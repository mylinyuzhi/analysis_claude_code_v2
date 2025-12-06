
// @from(Start 2003078, End 2006485)
Xn0 = L(() => {
  bR();
  QZ();
  Ww();
  Zn0();
  XS();
  vvA();
  qE1();
  kvA();
  gvA = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function", Yn0 = gvA && typeof ReadableStream === "function", iZ4 = gvA && (typeof TextEncoder === "function" ? ((A) => (Q) => A.encode(Q))(new TextEncoder) : async (A) => new Uint8Array(await new Response(A).arrayBuffer())), nZ4 = Yn0 && Jn0(() => {
    let A = !1,
      Q = new Request(a3.origin, {
        body: new ReadableStream,
        method: "POST",
        get duplex() {
          return A = !0, "half"
        }
      }).headers.has("Content-Type");
    return A && !Q
  }), LE1 = Yn0 && Jn0(() => b1.isReadableStream(new Response("").body)), hvA = {
    stream: LE1 && ((A) => A.body)
  };
  gvA && ((A) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((Q) => {
      !hvA[Q] && (hvA[Q] = b1.isFunction(A[Q]) ? (B) => B[Q]() : (B, G) => {
        throw new RB(`Response type '${Q}' is not supported`, RB.ERR_NOT_SUPPORT, G)
      })
    })
  })(new Response);
  Wn0 = gvA && (async (A) => {
    let {
      url: Q,
      method: B,
      data: G,
      signal: Z,
      cancelToken: I,
      timeout: Y,
      onDownloadProgress: J,
      onUploadProgress: W,
      responseType: X,
      headers: V,
      withCredentials: F = "same-origin",
      fetchOptions: K
    } = fvA(A);
    X = X ? (X + "").toLowerCase() : "text";
    let D = Gn0([Z, I && I.toAbortSignal()], Y),
      H, C = D && D.unsubscribe && (() => {
        D.unsubscribe()
      }),
      E;
    try {
      if (W && nZ4 && B !== "get" && B !== "head" && (E = await sZ4(V, G)) !== 0) {
        let R = new Request(Q, {
            method: "POST",
            body: G,
            duplex: "half"
          }),
          T;
        if (b1.isFormData(G) && (T = R.headers.get("content-type"))) V.setContentType(T);
        if (R.body) {
          let [y, v] = A4A(E, Ev(Q4A(W)));
          G = NE1(R.body, In0, y, v)
        }
      }
      if (!b1.isString(F)) F = F ? "include" : "omit";
      let U = "credentials" in Request.prototype;
      H = new Request(Q, {
        ...K,
        signal: D,
        method: B.toUpperCase(),
        headers: V.normalize().toJSON(),
        body: G,
        duplex: "half",
        credentials: U ? F : void 0
      });
      let q = await fetch(H),
        w = LE1 && (X === "stream" || X === "response");
      if (LE1 && (J || w && C)) {
        let R = {};
        ["status", "statusText", "headers"].forEach((x) => {
          R[x] = q[x]
        });
        let T = b1.toFiniteNumber(q.headers.get("content-length")),
          [y, v] = J && A4A(T, Ev(Q4A(J), !0)) || [];
        q = new Response(NE1(q.body, In0, y, () => {
          v && v(), C && C()
        }), R)
      }
      X = X || "text";
      let N = await hvA[b1.findKey(hvA, X) || "text"](q, A);
      return !w && C && C(), await new Promise((R, T) => {
        VS(R, T, {
          data: N,
          headers: vY.from(q.headers),
          status: q.status,
          statusText: q.statusText,
          config: A,
          request: H
        })
      })
    } catch (U) {
      if (C && C(), U && U.name === "TypeError" && /fetch/i.test(U.message)) throw Object.assign(new RB("Network Error", RB.ERR_NETWORK, A, H), {
        cause: U.cause || U
      });
      throw RB.from(U, U && U.code, A, H)
    }
  })
})
// @from(Start 2006491, End 2006494)
ME1
// @from(Start 2006496, End 2006517)
Vn0 = (A) => `- ${A}`
// @from(Start 2006521, End 2006576)
rZ4 = (A) => b1.isFunction(A) || A === null || A === !1
// @from(Start 2006580, End 2006583)
uvA
// @from(Start 2006589, End 2007783)
OE1 = L(() => {
  QZ();
  si0();
  Bn0();
  Xn0();
  Ww();
  ME1 = {
    http: ai0,
    xhr: Qn0,
    fetch: Wn0
  };
  b1.forEach(ME1, (A, Q) => {
    if (A) {
      try {
        Object.defineProperty(A, "name", {
          value: Q
        })
      } catch (B) {}
      Object.defineProperty(A, "adapterName", {
        value: Q
      })
    }
  });
  uvA = {
    getAdapter: (A) => {
      A = b1.isArray(A) ? A : [A];
      let {
        length: Q
      } = A, B, G, Z = {};
      for (let I = 0; I < Q; I++) {
        B = A[I];
        let Y;
        if (G = B, !rZ4(B)) {
          if (G = ME1[(Y = String(B)).toLowerCase()], G === void 0) throw new RB(`Unknown adapter '${Y}'`)
        }
        if (G) break;
        Z[Y || "#" + I] = G
      }
      if (!G) {
        let I = Object.entries(Z).map(([J, W]) => `adapter ${J} ` + (W === !1 ? "is not supported by the environment" : "is not available in the build")),
          Y = Q ? I.length > 1 ? `since :
` + I.map(Vn0).join(`
`) : " " + Vn0(I[0]) : "as no adapter specified";
        throw new RB("There is no suitable adapter to dispatch the request " + Y, "ERR_NOT_SUPPORT")
      }
      return G
    },
    adapters: ME1
  }
})
// @from(Start 2007786, End 2007918)
function RE1(A) {
  if (A.cancelToken) A.cancelToken.throwIfRequested();
  if (A.signal && A.signal.aborted) throw new Xw(null, A)
}
// @from(Start 2007920, End 2008542)
function mvA(A) {
  if (RE1(A), A.headers = vY.from(A.headers), A.data = oKA.call(A, A.transformRequest), ["post", "put", "patch"].indexOf(A.method) !== -1) A.headers.setContentType("application/x-www-form-urlencoded", !1);
  return uvA.getAdapter(A.adapter || t9A.adapter)(A).then(function(G) {
    return RE1(A), G.data = oKA.call(A, A.transformResponse, G), G.headers = vY.from(G.headers), G
  }, function(G) {
    if (!tKA(G)) {
      if (RE1(A), G && G.response) G.response.data = oKA.call(A, A.transformResponse, G.response), G.response.headers = vY.from(G.response.headers)
    }
    return Promise.reject(G)
  })
}
// @from(Start 2008547, End 2008607)
Fn0 = L(() => {
  Hi0();
  SvA();
  Kr();
  XS();
  OE1()
})
// @from(Start 2008610, End 2009093)
function oZ4(A, Q, B) {
  if (typeof A !== "object") throw new RB("options must be an object", RB.ERR_BAD_OPTION_VALUE);
  let G = Object.keys(A),
    Z = G.length;
  while (Z-- > 0) {
    let I = G[Z],
      Y = Q[I];
    if (Y) {
      let J = A[I],
        W = J === void 0 || Y(J, I, A);
      if (W !== !0) throw new RB("option " + I + " must be " + W, RB.ERR_BAD_OPTION_VALUE);
      continue
    }
    if (B !== !0) throw new RB("Unknown option " + I, RB.ERR_BAD_OPTION)
  }
}
// @from(Start 2009098, End 2009101)
dvA
// @from(Start 2009103, End 2009106)
Kn0
// @from(Start 2009108, End 2009111)
IDA
// @from(Start 2009117, End 2010021)
Dn0 = L(() => {
  Ww();
  dvA = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((A, Q) => {
    dvA[A] = function(G) {
      return typeof G === A || "a" + (Q < 1 ? "n " : " ") + A
    }
  });
  Kn0 = {};
  dvA.transitional = function(Q, B, G) {
    function Z(I, Y) {
      return "[Axios v" + Er + "] Transitional option '" + I + "'" + Y + (G ? ". " + G : "")
    }
    return (I, Y, J) => {
      if (Q === !1) throw new RB(Z(Y, " has been removed" + (B ? " in " + B : "")), RB.ERR_DEPRECATED);
      if (B && !Kn0[Y]) Kn0[Y] = !0, console.warn(Z(Y, " has been deprecated since v" + B + " and will be removed in the near future"));
      return Q ? Q(I, Y, J) : !0
    }
  };
  dvA.spelling = function(Q) {
    return (B, G) => {
      return console.warn(`${G} is likely a misspelling of ${Q}`), !0
    }
  };
  IDA = {
    assertOptions: oZ4,
    validators: dvA
  }
})
// @from(Start 2010023, End 2012985)
class YDA {
  constructor(A) {
    this.defaults = A, this.interceptors = {
      request: new aC1,
      response: new aC1
    }
  }
  async request(A, Q) {
    try {
      return await this._request(A, Q)
    } catch (B) {
      if (B instanceof Error) {
        let G = {};
        Error.captureStackTrace ? Error.captureStackTrace(G) : G = Error();
        let Z = G.stack ? G.stack.replace(/^.+\n/, "") : "";
        try {
          if (!B.stack) B.stack = Z;
          else if (Z && !String(B.stack).endsWith(Z.replace(/^.+\n.+\n/, ""))) B.stack += `
` + Z
        } catch (I) {}
      }
      throw B
    }
  }
  _request(A, Q) {
    if (typeof A === "string") Q = Q || {}, Q.url = A;
    else Q = A || {};
    Q = fR(this.defaults, Q);
    let {
      transitional: B,
      paramsSerializer: G,
      headers: Z
    } = Q;
    if (B !== void 0) IDA.assertOptions(B, {
      silentJSONParsing: FS.transitional(FS.boolean),
      forcedJSONParsing: FS.transitional(FS.boolean),
      clarifyTimeoutError: FS.transitional(FS.boolean)
    }, !1);
    if (G != null)
      if (b1.isFunction(G)) Q.paramsSerializer = {
        serialize: G
      };
      else IDA.assertOptions(G, {
        encode: FS.function,
        serialize: FS.function
      }, !0);
    if (Q.allowAbsoluteUrls !== void 0);
    else if (this.defaults.allowAbsoluteUrls !== void 0) Q.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    else Q.allowAbsoluteUrls = !0;
    IDA.assertOptions(Q, {
      baseUrl: FS.spelling("baseURL"),
      withXsrfToken: FS.spelling("withXSRFToken")
    }, !0), Q.method = (Q.method || this.defaults.method || "get").toLowerCase();
    let I = Z && b1.merge(Z.common, Z[Q.method]);
    Z && b1.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (D) => {
      delete Z[D]
    }), Q.headers = vY.concat(I, Z);
    let Y = [],
      J = !0;
    this.interceptors.request.forEach(function(H) {
      if (typeof H.runWhen === "function" && H.runWhen(Q) === !1) return;
      J = J && H.synchronous, Y.unshift(H.fulfilled, H.rejected)
    });
    let W = [];
    this.interceptors.response.forEach(function(H) {
      W.push(H.fulfilled, H.rejected)
    });
    let X, V = 0,
      F;
    if (!J) {
      let D = [mvA.bind(this), void 0];
      D.unshift.apply(D, Y), D.push.apply(D, W), F = D.length, X = Promise.resolve(Q);
      while (V < F) X = X.then(D[V++], D[V++]);
      return X
    }
    F = Y.length;
    let K = Q;
    V = 0;
    while (V < F) {
      let D = Y[V++],
        H = Y[V++];
      try {
        K = D(K)
      } catch (C) {
        H.call(this, C);
        break
      }
    }
    try {
      X = mvA.call(this, K)
    } catch (D) {
      return Promise.reject(D)
    }
    V = 0, F = W.length;
    while (V < F) X = X.then(W[V++], W[V++]);
    return X
  }
  getUri(A) {
    A = fR(this.defaults, A);
    let Q = Dr(A.baseURL, A.url, A.allowAbsoluteUrls);
    return Fr(Q, A.params, A.paramsSerializer)
  }
}
// @from(Start 2012990, End 2012992)
FS
// @from(Start 2012994, End 2012997)
JDA
// @from(Start 2013003, End 2013749)
Hn0 = L(() => {
  QZ();
  TvA();
  Bi0();
  Fn0();
  bvA();
  yvA();
  Dn0();
  XS();
  FS = IDA.validators;
  b1.forEach(["delete", "get", "head", "options"], function(Q) {
    YDA.prototype[Q] = function(B, G) {
      return this.request(fR(G || {}, {
        method: Q,
        url: B,
        data: (G || {}).data
      }))
    }
  });
  b1.forEach(["post", "put", "patch"], function(Q) {
    function B(G) {
      return function(I, Y, J) {
        return this.request(fR(J || {}, {
          method: Q,
          headers: G ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: I,
          data: Y
        }))
      }
    }
    YDA.prototype[Q] = B(), YDA.prototype[Q + "Form"] = B(!0)
  });
  JDA = YDA
})
// @from(Start 2013751, End 2015134)
class TE1 {
  constructor(A) {
    if (typeof A !== "function") throw TypeError("executor must be a function.");
    let Q;
    this.promise = new Promise(function(Z) {
      Q = Z
    });
    let B = this;
    this.promise.then((G) => {
      if (!B._listeners) return;
      let Z = B._listeners.length;
      while (Z-- > 0) B._listeners[Z](G);
      B._listeners = null
    }), this.promise.then = (G) => {
      let Z, I = new Promise((Y) => {
        B.subscribe(Y), Z = Y
      }).then(G);
      return I.cancel = function() {
        B.unsubscribe(Z)
      }, I
    }, A(function(Z, I, Y) {
      if (B.reason) return;
      B.reason = new Xw(Z, I, Y), Q(B.reason)
    })
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  subscribe(A) {
    if (this.reason) {
      A(this.reason);
      return
    }
    if (this._listeners) this._listeners.push(A);
    else this._listeners = [A]
  }
  unsubscribe(A) {
    if (!this._listeners) return;
    let Q = this._listeners.indexOf(A);
    if (Q !== -1) this._listeners.splice(Q, 1)
  }
  toAbortSignal() {
    let A = new AbortController,
      Q = (B) => {
        A.abort(B)
      };
    return this.subscribe(Q), A.signal.unsubscribe = () => this.unsubscribe(Q), A.signal
  }
  static source() {
    let A;
    return {
      token: new TE1(function(G) {
        A = G
      }),
      cancel: A
    }
  }
}
// @from(Start 2015139, End 2015142)
Cn0
// @from(Start 2015148, End 2015186)
En0 = L(() => {
  Kr();
  Cn0 = TE1
})
// @from(Start 2015189, End 2015263)
function PE1(A) {
  return function(B) {
    return A.apply(null, B)
  }
}
// @from(Start 2015265, End 2015333)
function jE1(A) {
  return b1.isObject(A) && A.isAxiosError === !0
}
// @from(Start 2015338, End 2015363)
zn0 = L(() => {
  QZ()
})
// @from(Start 2015369, End 2015372)
SE1
// @from(Start 2015374, End 2015377)
Un0
// @from(Start 2015383, End 2017063)
$n0 = L(() => {
  SE1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(SE1).forEach(([A, Q]) => {
    SE1[Q] = A
  });
  Un0 = SE1
})
// @from(Start 2017066, End 2017319)
function wn0(A) {
  let Q = new JDA(A),
    B = mKA(JDA.prototype.request, Q);
  return b1.extend(B, JDA.prototype, Q, {
    allOwnKeys: !0
  }), b1.extend(B, Q, null, {
    allOwnKeys: !0
  }), B.create = function(Z) {
    return wn0(fR(A, Z))
  }, B
}
// @from(Start 2017324, End 2017326)
qX
// @from(Start 2017328, End 2017330)
YQ
// @from(Start 2017336, End 2017974)
qn0 = L(() => {
  QZ();
  Hn0();
  bvA();
  SvA();
  AE1();
  Kr();
  En0();
  aKA();
  Ww();
  zn0();
  XS();
  OE1();
  $n0();
  qX = wn0(t9A);
  qX.Axios = JDA;
  qX.CanceledError = Xw;
  qX.CancelToken = Cn0;
  qX.isCancel = tKA;
  qX.VERSION = Er;
  qX.toFormData = mm;
  qX.AxiosError = RB;
  qX.Cancel = qX.CanceledError;
  qX.all = function(Q) {
    return Promise.all(Q)
  };
  qX.spread = PE1;
  qX.isAxiosError = jE1;
  qX.mergeConfig = fR;
  qX.AxiosHeaders = vY;
  qX.formToJSON = (A) => jvA(b1.isHTMLForm(A) ? new FormData(A) : A);
  qX.getAdapter = uvA.getAdapter;
  qX.HttpStatusCode = Un0;
  qX.default = qX;
  YQ = qX
})
// @from(Start 2017980, End 2017983)
xV7
// @from(Start 2017985, End 2017988)
Nn0
// @from(Start 2017990, End 2017993)
vV7
// @from(Start 2017995, End 2017998)
bV7
// @from(Start 2018000, End 2018003)
fV7
// @from(Start 2018005, End 2018008)
hV7
// @from(Start 2018010, End 2018013)
gV7
// @from(Start 2018015, End 2018018)
uV7
// @from(Start 2018020, End 2018023)
mV7
// @from(Start 2018025, End 2018028)
dV7
// @from(Start 2018030, End 2018033)
cV7
// @from(Start 2018035, End 2018038)
pV7
// @from(Start 2018040, End 2018043)
lV7
// @from(Start 2018045, End 2018048)
iV7
// @from(Start 2018050, End 2018053)
nV7
// @from(Start 2018055, End 2018058)
aV7
// @from(Start 2018064, End 2018428)
O3 = L(() => {
  qn0();
  ({
    Axios: xV7,
    AxiosError: Nn0,
    CanceledError: vV7,
    isCancel: bV7,
    CancelToken: fV7,
    VERSION: hV7,
    all: gV7,
    Cancel: uV7,
    isAxiosError: mV7,
    spread: dV7,
    toFormData: cV7,
    AxiosHeaders: pV7,
    HttpStatusCode: lV7,
    formToJSON: iV7,
    getAdapter: nV7,
    mergeConfig: aV7
  } = YQ)
})
// @from(Start 2018434, End 2019262)
UH = z((Ln0) => {
  Object.defineProperty(Ln0, "__esModule", {
    value: !0
  });
  Ln0.Log = Ln0.LogLevel = void 0;
  var tZ4 = " DEBUG ",
    eZ4 = "  INFO ",
    AI4 = "  WARN ",
    QI4 = " ERROR ";

  function cvA(A) {
    return A.unshift("[Statsig]"), A
  }
  Ln0.LogLevel = {
    None: 0,
    Error: 1,
    Warn: 2,
    Info: 3,
    Debug: 4
  };
  class zr {
    static info(...A) {
      if (zr.level >= Ln0.LogLevel.Info) console.info(eZ4, ...cvA(A))
    }
    static debug(...A) {
      if (zr.level >= Ln0.LogLevel.Debug) console.debug(tZ4, ...cvA(A))
    }
    static warn(...A) {
      if (zr.level >= Ln0.LogLevel.Warn) console.warn(AI4, ...cvA(A))
    }
    static error(...A) {
      if (zr.level >= Ln0.LogLevel.Error) console.error(QI4, ...cvA(A))
    }
  }
  Ln0.Log = zr;
  zr.level = Ln0.LogLevel.Warn
})
// @from(Start 2019268, End 2020525)
Ur = z((Pn0) => {
  var _E1, kE1, yE1;
  Object.defineProperty(Pn0, "__esModule", {
    value: !0
  });
  Pn0._getInstance = Pn0._getStatsigGlobalFlag = Pn0._getStatsigGlobal = void 0;
  var BI4 = UH(),
    GI4 = () => {
      return __STATSIG__ ? __STATSIG__ : pvA
    };
  Pn0._getStatsigGlobal = GI4;
  var ZI4 = (A) => {
    return Pn0._getStatsigGlobal()[A]
  };
  Pn0._getStatsigGlobalFlag = ZI4;
  var II4 = (A) => {
    let Q = Pn0._getStatsigGlobal();
    if (!A) {
      if (Q.instances && Object.keys(Q.instances).length > 1) BI4.Log.warn("Call made to Statsig global instance without an SDK key but there is more than one client instance. If you are using mulitple clients, please specify the SDK key.");
      return Q.firstInstance
    }
    return Q.instances && Q.instances[A]
  };
  Pn0._getInstance = II4;
  var Z4A = "__STATSIG__",
    On0 = typeof window < "u" ? window : {},
    Rn0 = typeof global < "u" ? global : {},
    Tn0 = typeof globalThis < "u" ? globalThis : {},
    pvA = (yE1 = (kE1 = (_E1 = On0[Z4A]) !== null && _E1 !== void 0 ? _E1 : Rn0[Z4A]) !== null && kE1 !== void 0 ? kE1 : Tn0[Z4A]) !== null && yE1 !== void 0 ? yE1 : {
      instance: Pn0._getInstance
    };
  On0[Z4A] = pvA;
  Rn0[Z4A] = pvA;
  Tn0[Z4A] = pvA
})
// @from(Start 2020531, End 2023185)
ivA = z((jn0) => {
  Object.defineProperty(jn0, "__esModule", {
    value: !0
  });
  jn0.Diagnostics = void 0;
  var lvA = new Map,
    bE1 = "start",
    fE1 = "end",
    JI4 = "statsig::diagnostics";
  jn0.Diagnostics = {
    _getMarkers: (A) => {
      return lvA.get(A)
    },
    _markInitOverallStart: (A) => {
      Y4A(A, I4A({}, bE1, "overall"))
    },
    _markInitOverallEnd: (A, Q, B) => {
      Y4A(A, I4A({
        success: Q,
        error: Q ? void 0 : {
          name: "InitializeError",
          message: "Failed to initialize"
        },
        evaluationDetails: B
      }, fE1, "overall"))
    },
    _markInitNetworkReqStart: (A, Q) => {
      Y4A(A, I4A(Q, bE1, "initialize", "network_request"))
    },
    _markInitNetworkReqEnd: (A, Q) => {
      Y4A(A, I4A(Q, fE1, "initialize", "network_request"))
    },
    _markInitProcessStart: (A) => {
      Y4A(A, I4A({}, bE1, "initialize", "process"))
    },
    _markInitProcessEnd: (A, Q) => {
      Y4A(A, I4A(Q, fE1, "initialize", "process"))
    },
    _clearMarkers: (A) => {
      lvA.delete(A)
    },
    _formatError(A) {
      if (!(A && typeof A === "object")) return;
      return {
        code: hE1(A, "code"),
        name: hE1(A, "name"),
        message: hE1(A, "message")
      }
    },
    _getDiagnosticsData(A, Q, B, G) {
      var Z;
      return {
        success: (A === null || A === void 0 ? void 0 : A.ok) === !0,
        statusCode: A === null || A === void 0 ? void 0 : A.status,
        sdkRegion: (Z = A === null || A === void 0 ? void 0 : A.headers) === null || Z === void 0 ? void 0 : Z.get("x-statsig-region"),
        isDelta: B.includes('"is_delta":true') === !0 ? !0 : void 0,
        attempt: Q,
        error: jn0.Diagnostics._formatError(G)
      }
    },
    _enqueueDiagnosticsEvent(A, Q, B, G) {
      let Z = jn0.Diagnostics._getMarkers(B);
      if (Z == null || Z.length <= 0) return -1;
      let I = Z[Z.length - 1].timestamp - Z[0].timestamp;
      jn0.Diagnostics._clearMarkers(B);
      let Y = WI4(A, {
        context: "initialize",
        markers: Z.slice(),
        statsigOptions: G
      });
      return Q.enqueue(Y), I
    }
  };

  function I4A(A, Q, B, G) {
    return Object.assign({
      key: B,
      action: Q,
      step: G,
      timestamp: Date.now()
    }, A)
  }

  function WI4(A, Q) {
    return {
      eventName: JI4,
      user: A,
      value: null,
      metadata: Q,
      time: Date.now()
    }
  }

  function Y4A(A, Q) {
    var B;
    let G = (B = lvA.get(A)) !== null && B !== void 0 ? B : [];
    G.push(Q), lvA.set(A, G)
  }

  function hE1(A, Q) {
    if (Q in A) return A[Q];
    return
  }
})
// @from(Start 2023191, End 2023551)
nvA = z((Sn0) => {
  Object.defineProperty(Sn0, "__esModule", {
    value: !0
  });
  Sn0._isTypeMatch = Sn0._typeOf = void 0;

  function XI4(A) {
    return Array.isArray(A) ? "array" : typeof A
  }
  Sn0._typeOf = XI4;

  function VI4(A, Q) {
    let B = (G) => Array.isArray(G) ? "array" : typeof G;
    return B(A) === B(Q)
  }
  Sn0._isTypeMatch = VI4
})
// @from(Start 2023557, End 2024416)
J4A = z((kn0) => {
  Object.defineProperty(kn0, "__esModule", {
    value: !0
  });
  kn0._getSortedObject = kn0._DJB2Object = kn0._DJB2 = void 0;
  var KI4 = nvA(),
    DI4 = (A) => {
      let Q = 0;
      for (let B = 0; B < A.length; B++) {
        let G = A.charCodeAt(B);
        Q = (Q << 5) - Q + G, Q = Q & Q
      }
      return String(Q >>> 0)
    };
  kn0._DJB2 = DI4;
  var HI4 = (A, Q) => {
    return kn0._DJB2(JSON.stringify(kn0._getSortedObject(A, Q)))
  };
  kn0._DJB2Object = HI4;
  var CI4 = (A, Q) => {
    if (A == null) return null;
    let B = Object.keys(A).sort(),
      G = {};
    return B.forEach((Z) => {
      let I = A[Z];
      if (Q === 0 || (0, KI4._typeOf)(I) !== "object") {
        G[Z] = I;
        return
      }
      G[Z] = kn0._getSortedObject(I, Q != null ? Q - 1 : Q)
    }), G
  };
  kn0._getSortedObject = CI4
})
// @from(Start 2024422, End 2025088)
XDA = z((bn0) => {
  Object.defineProperty(bn0, "__esModule", {
    value: !0
  });
  bn0._getStorageKey = bn0._getUserStorageKey = void 0;
  var xn0 = J4A();

  function vn0(A, Q, B) {
    var G;
    if (B) return B(A, Q);
    let Z = Q && Q.customIDs ? Q.customIDs : {},
      I = [`uid:${(G=Q===null||Q===void 0?void 0:Q.userID)!==null&&G!==void 0?G:""}`, `cids:${Object.keys(Z).sort((Y,J)=>Y.localeCompare(J)).map((Y)=>`${Y}-${Z[Y]}`).join(",")}`, `k:${A}`];
    return (0, xn0._DJB2)(I.join("|"))
  }
  bn0._getUserStorageKey = vn0;

  function zI4(A, Q, B) {
    if (Q) return vn0(A, Q, B);
    return (0, xn0._DJB2)(`k:${A}`)
  }
  bn0._getStorageKey = zI4
})
// @from(Start 2025094, End 2025792)
VDA = z((hn0) => {
  Object.defineProperty(hn0, "__esModule", {
    value: !0
  });
  hn0.NetworkParam = hn0.NetworkDefault = hn0.Endpoint = void 0;
  hn0.Endpoint = {
    _initialize: "initialize",
    _rgstr: "rgstr",
    _download_config_specs: "download_config_specs"
  };
  hn0.NetworkDefault = {
    [hn0.Endpoint._rgstr]: "https://prodregistryv2.org/v1",
    [hn0.Endpoint._initialize]: "https://featureassets.org/v1",
    [hn0.Endpoint._download_config_specs]: "https://api.statsigcdn.com/v1"
  };
  hn0.NetworkParam = {
    EventCount: "ec",
    SdkKey: "k",
    SdkType: "st",
    SdkVersion: "sv",
    Time: "t",
    SessionID: "sid",
    StatsigEncoded: "se",
    IsGzipped: "gz"
  }
})
// @from(Start 2025798, End 2027270)
$r = z((un0) => {
  Object.defineProperty(un0, "__esModule", {
    value: !0
  });
  un0._getCurrentPageUrlSafe = un0._addDocumentEventListenerSafe = un0._addWindowEventListenerSafe = un0._isServerEnv = un0._getDocumentSafe = un0._getWindowSafe = void 0;
  var wI4 = () => {
    return typeof window < "u" ? window : null
  };
  un0._getWindowSafe = wI4;
  var qI4 = () => {
    var A;
    let Q = un0._getWindowSafe();
    return (A = Q === null || Q === void 0 ? void 0 : Q.document) !== null && A !== void 0 ? A : null
  };
  un0._getDocumentSafe = qI4;
  var NI4 = () => {
    if (un0._getDocumentSafe() !== null) return !1;
    let A = typeof process < "u" && process.versions != null && process.versions.node != null;
    return typeof EdgeRuntime === "string" || A
  };
  un0._isServerEnv = NI4;
  var LI4 = (A, Q) => {
    let B = un0._getWindowSafe();
    if (typeof(B === null || B === void 0 ? void 0 : B.addEventListener) === "function") B.addEventListener(A, Q)
  };
  un0._addWindowEventListenerSafe = LI4;
  var MI4 = (A, Q) => {
    let B = un0._getDocumentSafe();
    if (typeof(B === null || B === void 0 ? void 0 : B.addEventListener) === "function") B.addEventListener(A, Q)
  };
  un0._addDocumentEventListenerSafe = MI4;
  var OI4 = () => {
    var A;
    try {
      return (A = un0._getWindowSafe()) === null || A === void 0 ? void 0 : A.location.href.split(/[?#]/)[0]
    } catch (Q) {
      return
    }
  };
  un0._getCurrentPageUrlSafe = OI4
})
// @from(Start 2027276, End 2030294)
mE1 = z((ln0) => {
  Object.defineProperty(ln0, "__esModule", {
    value: !0
  });
  ln0._createLayerParameterExposure = ln0._createConfigExposure = ln0._mapExposures = ln0._createGateExposure = ln0._isExposureEvent = void 0;
  var dn0 = "statsig::config_exposure",
    cn0 = "statsig::gate_exposure",
    pn0 = "statsig::layer_exposure",
    uE1 = (A, Q, B, G, Z) => {
      if (B.bootstrapMetadata) G.bootstrapMetadata = B.bootstrapMetadata;
      return {
        eventName: A,
        user: Q,
        value: null,
        metadata: yI4(B, G),
        secondaryExposures: Z,
        time: Date.now()
      }
    },
    jI4 = ({
      eventName: A
    }) => {
      return A === cn0 || A === dn0 || A === pn0
    };
  ln0._isExposureEvent = jI4;
  var SI4 = (A, Q, B) => {
    var G, Z, I;
    let Y = {
      gate: Q.name,
      gateValue: String(Q.value),
      ruleID: Q.ruleID
    };
    if (((G = Q.__evaluation) === null || G === void 0 ? void 0 : G.version) != null) Y.configVersion = Q.__evaluation.version;
    return uE1(cn0, A, Q.details, Y, ovA((I = (Z = Q.__evaluation) === null || Z === void 0 ? void 0 : Z.secondary_exposures) !== null && I !== void 0 ? I : [], B))
  };
  ln0._createGateExposure = SI4;

  function ovA(A, Q) {
    return A.map((B) => {
      if (typeof B === "string") return (Q !== null && Q !== void 0 ? Q : {})[B];
      return B
    }).filter((B) => B != null)
  }
  ln0._mapExposures = ovA;
  var _I4 = (A, Q, B) => {
    var G, Z, I, Y;
    let J = {
      config: Q.name,
      ruleID: Q.ruleID
    };
    if (((G = Q.__evaluation) === null || G === void 0 ? void 0 : G.version) != null) J.configVersion = Q.__evaluation.version;
    if (((Z = Q.__evaluation) === null || Z === void 0 ? void 0 : Z.passed) != null) J.rulePassed = String(Q.__evaluation.passed);
    return uE1(dn0, A, Q.details, J, ovA((Y = (I = Q.__evaluation) === null || I === void 0 ? void 0 : I.secondary_exposures) !== null && Y !== void 0 ? Y : [], B))
  };
  ln0._createConfigExposure = _I4;
  var kI4 = (A, Q, B, G) => {
    var Z, I, Y, J;
    let W = Q.__evaluation,
      X = ((Z = W === null || W === void 0 ? void 0 : W.explicit_parameters) === null || Z === void 0 ? void 0 : Z.includes(B)) === !0,
      V = "",
      F = (I = W === null || W === void 0 ? void 0 : W.undelegated_secondary_exposures) !== null && I !== void 0 ? I : [];
    if (X) V = (Y = W.allocated_experiment_name) !== null && Y !== void 0 ? Y : "", F = W.secondary_exposures;
    let K = {
      config: Q.name,
      parameterName: B,
      ruleID: Q.ruleID,
      allocatedExperiment: V,
      isExplicitParameter: String(X)
    };
    if (((J = Q.__evaluation) === null || J === void 0 ? void 0 : J.version) != null) K.configVersion = Q.__evaluation.version;
    return uE1(pn0, A, Q.details, K, ovA(F, G))
  };
  ln0._createLayerParameterExposure = kI4;
  var yI4 = (A, Q) => {
    if (Q.reason = A.reason, A.lcut) Q.lcut = String(A.lcut);
    if (A.receivedAt) Q.receivedAt = String(A.receivedAt);
    return Q
  }
})
// @from(Start 2030300, End 2032361)
zv = z((nn0) => {
  Object.defineProperty(nn0, "__esModule", {
    value: !0
  });
  nn0._setObjectInStorage = nn0._getObjectFromStorage = nn0.Storage = void 0;
  var hI4 = UH(),
    gI4 = $r(),
    FDA = {},
    cE1 = {
      isReady: () => !0,
      isReadyResolver: () => null,
      getProviderName: () => "InMemory",
      getItem: (A) => FDA[A] ? FDA[A] : null,
      setItem: (A, Q) => {
        FDA[A] = Q
      },
      removeItem: (A) => {
        delete FDA[A]
      },
      getAllKeys: () => Object.keys(FDA)
    },
    tvA = null;
  try {
    let A = (0, gI4._getWindowSafe)();
    if (A && A.localStorage && typeof A.localStorage.getItem === "function") tvA = {
      isReady: () => !0,
      isReadyResolver: () => null,
      getProviderName: () => "LocalStorage",
      getItem: (Q) => A.localStorage.getItem(Q),
      setItem: (Q, B) => A.localStorage.setItem(Q, B),
      removeItem: (Q) => A.localStorage.removeItem(Q),
      getAllKeys: () => Object.keys(A.localStorage)
    }
  } catch (A) {
    hI4.Log.warn("Failed to setup localStorageProvider.")
  }
  var dE1 = tvA !== null && tvA !== void 0 ? tvA : cE1,
    KS = dE1;

  function uI4(A) {
    try {
      return A()
    } catch (Q) {
      if (Q instanceof Error && Q.name === "SecurityError") return nn0.Storage._setProvider(cE1), null;
      throw Q
    }
  }
  nn0.Storage = {
    isReady: () => KS.isReady(),
    isReadyResolver: () => KS.isReadyResolver(),
    getProviderName: () => KS.getProviderName(),
    getItem: (A) => uI4(() => KS.getItem(A)),
    setItem: (A, Q) => KS.setItem(A, Q),
    removeItem: (A) => KS.removeItem(A),
    getAllKeys: () => KS.getAllKeys(),
    _setProvider: (A) => {
      dE1 = A, KS = A
    },
    _setDisabled: (A) => {
      if (A) KS = cE1;
      else KS = dE1
    }
  };

  function mI4(A) {
    let Q = nn0.Storage.getItem(A);
    return JSON.parse(Q !== null && Q !== void 0 ? Q : "null")
  }
  nn0._getObjectFromStorage = mI4;

  function dI4(A, Q) {
    nn0.Storage.setItem(A, JSON.stringify(Q))
  }
  nn0._setObjectInStorage = dI4
})
// @from(Start 2032367, End 2033164)
pE1 = z((rn0) => {
  Object.defineProperty(rn0, "__esModule", {
    value: !0
  });
  rn0.UrlConfiguration = void 0;
  var AbA = VDA(),
    pI4 = {
      [AbA.Endpoint._initialize]: "i",
      [AbA.Endpoint._rgstr]: "e",
      [AbA.Endpoint._download_config_specs]: "d"
    };
  class sn0 {
    constructor(A, Q, B, G) {
      if (this.customUrl = null, this.fallbackUrls = null, this.endpoint = A, this.endpointDnsKey = pI4[A], Q) this.customUrl = Q;
      if (!Q && B) this.customUrl = B.endsWith("/") ? `${B}${A}` : `${B}/${A}`;
      if (G) this.fallbackUrls = G;
      let Z = AbA.NetworkDefault[A];
      this.defaultUrl = `${Z}/${A}`
    }
    getUrl() {
      var A;
      return (A = this.customUrl) !== null && A !== void 0 ? A : this.defaultUrl
    }
  }
  rn0.UrlConfiguration = sn0
})
// @from(Start 2033170, End 2034309)
GbA = z((en0) => {
  Object.defineProperty(en0, "__esModule", {
    value: !0
  });
  en0._notifyVisibilityChanged = en0._subscribeToVisiblityChanged = en0._isUnloading = en0._isCurrentlyVisible = void 0;
  var QbA = $r(),
    BbA = "foreground",
    iE1 = "background",
    tn0 = [],
    lE1 = BbA,
    nE1 = !1,
    lI4 = () => {
      return lE1 === BbA
    };
  en0._isCurrentlyVisible = lI4;
  var iI4 = () => nE1;
  en0._isUnloading = iI4;
  var nI4 = (A) => {
    tn0.unshift(A)
  };
  en0._subscribeToVisiblityChanged = nI4;
  var aI4 = (A) => {
    if (A === lE1) return;
    lE1 = A, tn0.forEach((Q) => Q(A))
  };
  en0._notifyVisibilityChanged = aI4;
  (0, QbA._addWindowEventListenerSafe)("focus", () => {
    nE1 = !1, en0._notifyVisibilityChanged(BbA)
  });
  (0, QbA._addWindowEventListenerSafe)("blur", () => en0._notifyVisibilityChanged(iE1));
  (0, QbA._addWindowEventListenerSafe)("beforeunload", () => {
    nE1 = !0, en0._notifyVisibilityChanged(iE1)
  });
  (0, QbA._addDocumentEventListenerSafe)("visibilitychange", () => {
    en0._notifyVisibilityChanged(document.visibilityState === "visible" ? BbA : iE1)
  })
})
// @from(Start 2034315, End 2042752)
sE1 = z((F4A) => {
  var X4A = F4A && F4A.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(F4A, "__esModule", {
    value: !0
  });
  F4A.EventLogger = void 0;
  var tI4 = XDA(),
    eI4 = J4A(),
    KDA = UH(),
    Aa0 = VDA(),
    aE1 = $r(),
    AY4 = mE1(),
    V4A = zv(),
    QY4 = pE1(),
    Qa0 = GbA(),
    BY4 = 100,
    GY4 = 1e4,
    ZY4 = 1000,
    IY4 = 600000,
    YY4 = 500,
    Ba0 = 200,
    DDA = {},
    ZbA = {
      Startup: "startup",
      GainedFocus: "gained_focus"
    };
  class wr {
    static _safeFlushAndForget(A) {
      var Q;
      (Q = DDA[A]) === null || Q === void 0 || Q.flush().catch(() => {})
    }
    static _safeRetryFailedLogs(A) {
      var Q;
      (Q = DDA[A]) === null || Q === void 0 || Q._retryFailedLogs(ZbA.GainedFocus)
    }
    constructor(A, Q, B, G) {
      var Z;
      this._sdkKey = A, this._emitter = Q, this._network = B, this._options = G, this._queue = [], this._lastExposureTimeMap = {}, this._nonExposedChecks = {}, this._hasRunQuickFlush = !1, this._creationTime = Date.now(), this._isLoggingDisabled = (G === null || G === void 0 ? void 0 : G.disableLogging) === !0, this._maxQueueSize = (Z = G === null || G === void 0 ? void 0 : G.loggingBufferMaxSize) !== null && Z !== void 0 ? Z : BY4;
      let I = G === null || G === void 0 ? void 0 : G.networkConfig;
      this._logEventUrlConfig = new QY4.UrlConfiguration(Aa0.Endpoint._rgstr, I === null || I === void 0 ? void 0 : I.logEventUrl, I === null || I === void 0 ? void 0 : I.api, I === null || I === void 0 ? void 0 : I.logEventFallbackUrls)
    }
    setLoggingDisabled(A) {
      this._isLoggingDisabled = A
    }
    enqueue(A) {
      if (!this._shouldLogEvent(A)) return;
      if (this._normalizeAndAppendEvent(A), this._quickFlushIfNeeded(), this._queue.length > this._maxQueueSize) wr._safeFlushAndForget(this._sdkKey)
    }
    incrementNonExposureCount(A) {
      var Q;
      let B = (Q = this._nonExposedChecks[A]) !== null && Q !== void 0 ? Q : 0;
      this._nonExposedChecks[A] = B + 1
    }
    reset() {
      this._lastExposureTimeMap = {}
    }
    start() {
      if ((0, aE1._isServerEnv)()) return;
      DDA[this._sdkKey] = this, (0, Qa0._subscribeToVisiblityChanged)((A) => {
        if (A === "background") wr._safeFlushAndForget(this._sdkKey);
        else if (A === "foreground") wr._safeRetryFailedLogs(this._sdkKey)
      }), this._retryFailedLogs(ZbA.Startup), this._startBackgroundFlushInterval()
    }
    stop() {
      return X4A(this, void 0, void 0, function*() {
        if (this._flushIntervalId) clearInterval(this._flushIntervalId), this._flushIntervalId = null;
        delete DDA[this._sdkKey], yield this.flush()
      })
    }
    flush() {
      return X4A(this, void 0, void 0, function*() {
        if (this._appendAndResetNonExposedChecks(), this._queue.length === 0) return;
        let A = this._queue;
        this._queue = [], yield this._sendEvents(A)
      })
    }
    _quickFlushIfNeeded() {
      if (this._hasRunQuickFlush) return;
      if (this._hasRunQuickFlush = !0, Date.now() - this._creationTime > Ba0) return;
      setTimeout(() => wr._safeFlushAndForget(this._sdkKey), Ba0)
    }
    _shouldLogEvent(A) {
      if ((0, aE1._isServerEnv)()) return !1;
      if (!(0, AY4._isExposureEvent)(A)) return !0;
      let Q = A.user ? A.user : {
          statsigEnvironment: void 0
        },
        B = (0, tI4._getUserStorageKey)(this._sdkKey, Q),
        G = A.metadata ? A.metadata : {},
        Z = [A.eventName, B, G.gate, G.config, G.ruleID, G.allocatedExperiment, G.parameterName, String(G.isExplicitParameter), G.reason].join("|"),
        I = this._lastExposureTimeMap[Z],
        Y = Date.now();
      if (I && Y - I < IY4) return !1;
      if (Object.keys(this._lastExposureTimeMap).length > ZY4) this._lastExposureTimeMap = {};
      return this._lastExposureTimeMap[Z] = Y, !0
    }
    _sendEvents(A) {
      var Q, B;
      return X4A(this, void 0, void 0, function*() {
        if (this._isLoggingDisabled) return this._saveFailedLogsToStorage(A), !1;
        try {
          let Z = (0, Qa0._isUnloading)() && this._network.isBeaconSupported() && ((B = (Q = this._options) === null || Q === void 0 ? void 0 : Q.networkConfig) === null || B === void 0 ? void 0 : B.networkOverrideFunc) == null;
          if (this._emitter({
              name: "pre_logs_flushed",
              events: A
            }), (Z ? yield this._sendEventsViaBeacon(A): yield this._sendEventsViaPost(A)).success) return this._emitter({
            name: "logs_flushed",
            events: A
          }), !0;
          else return KDA.Log.warn("Failed to flush events."), this._saveFailedLogsToStorage(A), !1
        } catch (G) {
          return KDA.Log.warn("Failed to flush events."), !1
        }
      })
    }
    _sendEventsViaPost(A) {
      var Q;
      return X4A(this, void 0, void 0, function*() {
        let B = yield this._network.post(this._getRequestData(A)), G = (Q = B === null || B === void 0 ? void 0 : B.code) !== null && Q !== void 0 ? Q : -1;
        return {
          success: G >= 200 && G < 300
        }
      })
    }
    _sendEventsViaBeacon(A) {
      return X4A(this, void 0, void 0, function*() {
        return {
          success: yield this._network.beacon(this._getRequestData(A))
        }
      })
    }
    _getRequestData(A) {
      return {
        sdkKey: this._sdkKey,
        data: {
          events: A
        },
        urlConfig: this._logEventUrlConfig,
        retries: 3,
        isCompressable: !0,
        params: {
          [Aa0.NetworkParam.EventCount]: String(A.length)
        }
      }
    }
    _saveFailedLogsToStorage(A) {
      while (A.length > YY4) A.shift();
      let Q = this._getStorageKey();
      try {
        (0, V4A._setObjectInStorage)(Q, A)
      } catch (B) {
        KDA.Log.warn("Unable to save failed logs to storage")
      }
    }
    _retryFailedLogs(A) {
      let Q = this._getStorageKey();
      (() => X4A(this, void 0, void 0, function*() {
        if (!V4A.Storage.isReady()) yield V4A.Storage.isReadyResolver();
        let B = (0, V4A._getObjectFromStorage)(Q);
        if (!B) return;
        if (A === ZbA.Startup) V4A.Storage.removeItem(Q);
        if ((yield this._sendEvents(B)) && A === ZbA.GainedFocus) V4A.Storage.removeItem(Q)
      }))().catch(() => {
        KDA.Log.warn("Failed to flush stored logs")
      })
    }
    _getStorageKey() {
      return `statsig.failed_logs.${(0,eI4._DJB2)(this._sdkKey)}`
    }
    _normalizeAndAppendEvent(A) {
      if (A.user) A.user = Object.assign({}, A.user), delete A.user.privateAttributes;
      let Q = {},
        B = this._getCurrentPageUrl();
      if (B) Q.statsigMetadata = {
        currentPage: B
      };
      let G = Object.assign(Object.assign({}, A), Q);
      KDA.Log.debug("Enqueued Event:", G), this._queue.push(G)
    }
    _appendAndResetNonExposedChecks() {
      if (Object.keys(this._nonExposedChecks).length === 0) return;
      this._normalizeAndAppendEvent({
        eventName: "statsig::non_exposed_checks",
        user: null,
        time: Date.now(),
        metadata: {
          checks: Object.assign({}, this._nonExposedChecks)
        }
      }), this._nonExposedChecks = {}
    }
    _getCurrentPageUrl() {
      var A;
      if (((A = this._options) === null || A === void 0 ? void 0 : A.includeCurrentPageUrlWithEvents) === !1) return;
      return (0, aE1._getCurrentPageUrlSafe)()
    }
    _startBackgroundFlushInterval() {
      var A, Q;
      let B = (Q = (A = this._options) === null || A === void 0 ? void 0 : A.loggingIntervalMs) !== null && Q !== void 0 ? Q : GY4,
        G = setInterval(() => {
          let Z = DDA[this._sdkKey];
          if (!Z || Z._flushIntervalId !== G) clearInterval(G);
          else wr._safeFlushAndForget(this._sdkKey)
        }, B);
      this._flushIntervalId = G
    }
  }
  F4A.EventLogger = wr
})
// @from(Start 2042758, End 2043142)
HDA = z((Ga0) => {
  Object.defineProperty(Ga0, "__esModule", {
    value: !0
  });
  Ga0.StatsigMetadataProvider = Ga0.SDK_VERSION = void 0;
  Ga0.SDK_VERSION = "3.12.1";
  var rE1 = {
    sdkVersion: Ga0.SDK_VERSION,
    sdkType: "js-mono"
  };
  Ga0.StatsigMetadataProvider = {
    get: () => rE1,
    add: (A) => {
      rE1 = Object.assign(Object.assign({}, rE1), A)
    }
  }
})
// @from(Start 2043148, End 2043233)
Ja0 = z((Ya0) => {
  Object.defineProperty(Ya0, "__esModule", {
    value: !0
  })
})
// @from(Start 2043239, End 2043943)
IbA = z((Wa0) => {
  Object.defineProperty(Wa0, "__esModule", {
    value: !0
  });
  Wa0.getUUID = void 0;

  function JY4() {
    if (typeof crypto < "u" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    let A = new Date().getTime(),
      Q = typeof performance < "u" && performance.now && performance.now() * 1000 || 0;
    return `xxxxxxxx-xxxx-4xxx-${"89ab"[Math.floor(Math.random()*4)]}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (G) => {
      let Z = Math.random() * 16;
      if (A > 0) Z = (A + Z) % 16 | 0, A = Math.floor(A / 16);
      else Z = (Q + Z) % 16 | 0, Q = Math.floor(Q / 16);
      return (G === "x" ? Z : Z & 7 | 8).toString(16)
    })
  }
  Wa0.getUUID = JY4
})
// @from(Start 2043949, End 2044755)
JbA = z((Da0) => {
  Object.defineProperty(Da0, "__esModule", {
    value: !0
  });
  Da0.StableID = void 0;
  var WY4 = XDA(),
    XY4 = UH(),
    Fa0 = zv(),
    VY4 = IbA(),
    YbA = {};
  Da0.StableID = {
    get: (A) => {
      if (YbA[A] == null) {
        let Q = FY4(A);
        if (Q == null) Q = (0, VY4.getUUID)(), Va0(Q, A);
        YbA[A] = Q
      }
      return YbA[A]
    },
    setOverride: (A, Q) => {
      YbA[Q] = A, Va0(A, Q)
    }
  };

  function Ka0(A) {
    return `statsig.stable_id.${(0,WY4._getStorageKey)(A)}`
  }

  function Va0(A, Q) {
    let B = Ka0(Q);
    try {
      (0, Fa0._setObjectInStorage)(B, A)
    } catch (G) {
      XY4.Log.warn("Failed to save StableID")
    }
  }

  function FY4(A) {
    let Q = Ka0(A);
    return (0, Fa0._getObjectFromStorage)(Q)
  }
})
// @from(Start 2044761, End 2045455)
oE1 = z((Ca0) => {
  Object.defineProperty(Ca0, "__esModule", {
    value: !0
  });
  Ca0._getFullUserHash = Ca0._normalizeUser = void 0;
  var KY4 = J4A(),
    DY4 = UH();

  function HY4(A, Q, B) {
    try {
      let G = JSON.parse(JSON.stringify(A));
      if (Q != null && Q.environment != null) G.statsigEnvironment = Q.environment;
      else if (B != null) G.statsigEnvironment = {
        tier: B
      };
      return G
    } catch (G) {
      return DY4.Log.error("Failed to JSON.stringify user"), {
        statsigEnvironment: void 0
      }
    }
  }
  Ca0._normalizeUser = HY4;

  function CY4(A) {
    return A ? (0, KY4._DJB2Object)(A) : null
  }
  Ca0._getFullUserHash = CY4
})
// @from(Start 2045461, End 2045826)
tE1 = z((za0) => {
  Object.defineProperty(za0, "__esModule", {
    value: !0
  });
  za0._typedJsonParse = void 0;
  var zY4 = UH();

  function UY4(A, Q, B) {
    try {
      let G = JSON.parse(A);
      if (G && typeof G === "object" && Q in G) return G
    } catch (G) {}
    return zY4.Log.error(`Failed to parse ${B}`), null
  }
  za0._typedJsonParse = UY4
})
// @from(Start 2045832, End 2051485)
Ma0 = z((lm) => {
  var eE1 = lm && lm.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(lm, "__esModule", {
    value: !0
  });
  lm._makeDataAdapterResult = lm.DataAdapterCore = void 0;
  var WbA = UH(),
    $Y4 = JbA(),
    XbA = oE1(),
    pm = zv(),
    $a0 = tE1(),
    wa0 = 10;
  class qa0 {
    constructor(A, Q) {
      this._adapterName = A, this._cacheSuffix = Q, this._options = null, this._sdkKey = null, this._lastModifiedStoreKey = `statsig.last_modified_time.${Q}`, this._inMemoryCache = new Na0
    }
    attach(A, Q) {
      this._sdkKey = A, this._options = Q
    }
    getDataSync(A) {
      let Q = A && (0, XbA._normalizeUser)(A, this._options),
        B = this._getCacheKey(Q),
        G = this._inMemoryCache.get(B, Q);
      if (G) return G;
      let Z = this._loadFromCache(B);
      if (Z) return this._inMemoryCache.add(B, Z), this._inMemoryCache.get(B, Q);
      return null
    }
    setData(A, Q) {
      let B = Q && (0, XbA._normalizeUser)(Q, this._options),
        G = this._getCacheKey(B);
      this._inMemoryCache.add(G, VbA("Bootstrap", A, null, B))
    }
    _getDataAsyncImpl(A, Q, B) {
      return eE1(this, void 0, void 0, function*() {
        if (!pm.Storage.isReady()) yield pm.Storage.isReadyResolver();
        let G = A !== null && A !== void 0 ? A : this.getDataSync(Q),
          Z = [this._fetchAndPrepFromNetwork(G, Q, B)];
        if (B === null || B === void 0 ? void 0 : B.timeoutMs) Z.push(new Promise((I) => setTimeout(I, B.timeoutMs)).then(() => {
          return WbA.Log.debug("Fetching latest value timed out"), null
        }));
        return yield Promise.race(Z)
      })
    }
    _prefetchDataImpl(A, Q) {
      return eE1(this, void 0, void 0, function*() {
        let B = A && (0, XbA._normalizeUser)(A, this._options),
          G = this._getCacheKey(B),
          Z = yield this._getDataAsyncImpl(null, B, Q);
        if (Z) this._inMemoryCache.add(G, Object.assign(Object.assign({}, Z), {
          source: "Prefetch"
        }))
      })
    }
    _fetchAndPrepFromNetwork(A, Q, B) {
      var G;
      return eE1(this, void 0, void 0, function*() {
        let Z = (G = A === null || A === void 0 ? void 0 : A.data) !== null && G !== void 0 ? G : null,
          I = A != null && this._isCachedResultValidFor204(A, Q),
          Y = yield this._fetchFromNetwork(Z, Q, B, I);
        if (!Y) return WbA.Log.debug("No response returned for latest value"), null;
        let J = (0, $a0._typedJsonParse)(Y, "has_updates", "Response"),
          W = this._getSdkKey(),
          X = $Y4.StableID.get(W),
          V = null;
        if ((J === null || J === void 0 ? void 0 : J.has_updates) === !0) V = VbA("Network", Y, X, Q);
        else if (Z && (J === null || J === void 0 ? void 0 : J.has_updates) === !1) V = VbA("NetworkNotModified", Z, X, Q);
        else return null;
        let F = this._getCacheKey(Q);
        return this._inMemoryCache.add(F, V), this._writeToCache(F, V), V
      })
    }
    _getSdkKey() {
      if (this._sdkKey != null) return this._sdkKey;
      return WbA.Log.error(`${this._adapterName} is not attached to a Client`), ""
    }
    _loadFromCache(A) {
      var Q;
      let B = (Q = pm.Storage.getItem) === null || Q === void 0 ? void 0 : Q.call(pm.Storage, A);
      if (B == null) return null;
      let G = (0, $a0._typedJsonParse)(B, "source", "Cached Result");
      return G ? Object.assign(Object.assign({}, G), {
        source: "Cache"
      }) : null
    }
    _writeToCache(A, Q) {
      pm.Storage.setItem(A, JSON.stringify(Q)), this._runLocalStorageCacheEviction(A)
    }
    _runLocalStorageCacheEviction(A) {
      var Q;
      let B = (Q = (0, pm._getObjectFromStorage)(this._lastModifiedStoreKey)) !== null && Q !== void 0 ? Q : {};
      B[A] = Date.now();
      let G = La0(B, wa0);
      if (G) delete B[G], pm.Storage.removeItem(G);
      (0, pm._setObjectInStorage)(this._lastModifiedStoreKey, B)
    }
  }
  lm.DataAdapterCore = qa0;

  function VbA(A, Q, B, G) {
    return {
      source: A,
      data: Q,
      receivedAt: Date.now(),
      stableID: B,
      fullUserHash: (0, XbA._getFullUserHash)(G)
    }
  }
  lm._makeDataAdapterResult = VbA;
  class Na0 {
    constructor() {
      this._data = {}
    }
    get(A, Q) {
      var B;
      let G = this._data[A],
        Z = G === null || G === void 0 ? void 0 : G.stableID,
        I = (B = Q === null || Q === void 0 ? void 0 : Q.customIDs) === null || B === void 0 ? void 0 : B.stableID;
      if (I && Z && I !== Z) return WbA.Log.warn("'StatsigUser.customIDs.stableID' mismatch"), null;
      return G
    }
    add(A, Q) {
      let B = La0(this._data, wa0 - 1);
      if (B) delete this._data[B];
      this._data[A] = Q
    }
    merge(A) {
      this._data = Object.assign(Object.assign({}, this._data), A)
    }
  }

  function La0(A, Q) {
    let B = Object.keys(A);
    if (B.length <= Q) return null;
    return B.reduce((G, Z) => {
      let I = A[G],
        Y = A[Z];
      if (typeof I === "object" && typeof Y === "object") return Y.receivedAt < I.receivedAt ? Z : G;
      return Y < I ? Z : G
    })
  }
})
// @from(Start 2051491, End 2051576)
Ra0 = z((Oa0) => {
  Object.defineProperty(Oa0, "__esModule", {
    value: !0
  })
})
// @from(Start 2051582, End 2052025)
FbA = z((Pa0) => {
  Object.defineProperty(Pa0, "__esModule", {
    value: !0
  });
  Pa0.SDKType = void 0;
  var Ta0 = {},
    K4A;
  Pa0.SDKType = {
    _get: (A) => {
      var Q;
      return ((Q = Ta0[A]) !== null && Q !== void 0 ? Q : "js-mono") + (K4A !== null && K4A !== void 0 ? K4A : "")
    },
    _setClientType(A, Q) {
      Ta0[A] = Q
    },
    _setBindingType(A) {
      if (!K4A || K4A === "-react") K4A = "-" + A
    }
  }
})
// @from(Start 2052031, End 2056422)
Az1 = z((Uv) => {
  var wY4 = Uv && Uv.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(Uv, "__esModule", {
    value: !0
  });
  Uv.ErrorBoundary = Uv.EXCEPTION_ENDPOINT = void 0;
  var qY4 = UH(),
    NY4 = FbA(),
    LY4 = HDA();
  Uv.EXCEPTION_ENDPOINT = "https://statsigapi.net/v1/sdk_exception";
  var _a0 = "[Statsig] UnknownError";
  class ka0 {
    constructor(A, Q, B, G) {
      this._sdkKey = A, this._options = Q, this._emitter = B, this._lastSeenError = G, this._seen = new Set
    }
    wrap(A) {
      try {
        let Q = A;
        OY4(Q).forEach((B) => {
          let G = Q[B];
          if ("$EB" in G) return;
          Q[B] = (...Z) => {
            return this._capture(B, () => G.apply(A, Z))
          }, Q[B].$EB = !0
        })
      } catch (Q) {
        this._onError("eb:wrap", Q)
      }
    }
    logError(A, Q) {
      this._onError(A, Q)
    }
    getLastSeenErrorAndReset() {
      let A = this._lastSeenError;
      return this._lastSeenError = void 0, A !== null && A !== void 0 ? A : null
    }
    attachErrorIfNoneExists(A) {
      if (this._lastSeenError) return;
      this._lastSeenError = Sa0(A)
    }
    _capture(A, Q) {
      try {
        let B = Q();
        if (B && B instanceof Promise) return B.catch((G) => this._onError(A, G));
        return B
      } catch (B) {
        return this._onError(A, B), null
      }
    }
    _onError(A, Q) {
      try {
        qY4.Log.warn(`Caught error in ${A}`, {
          error: Q
        }), (() => wY4(this, void 0, void 0, function*() {
          var G, Z, I, Y, J, W, X;
          let V = Q ? Q : Error(_a0),
            F = V instanceof Error,
            K = F ? V.name : "No Name",
            D = Sa0(V);
          if (this._lastSeenError = D, this._seen.has(K)) return;
          if (this._seen.add(K), (Z = (G = this._options) === null || G === void 0 ? void 0 : G.networkConfig) === null || Z === void 0 ? void 0 : Z.preventAllNetworkTraffic) {
            (I = this._emitter) === null || I === void 0 || I.call(this, {
              name: "error",
              error: Q,
              tag: A
            });
            return
          }
          let H = NY4.SDKType._get(this._sdkKey),
            C = LY4.StatsigMetadataProvider.get(),
            E = F ? V.stack : MY4(V),
            U = JSON.stringify(Object.assign({
              tag: A,
              exception: K,
              info: E
            }, Object.assign(Object.assign({}, C), {
              sdkType: H
            })));
          yield((W = (J = (Y = this._options) === null || Y === void 0 ? void 0 : Y.networkConfig) === null || J === void 0 ? void 0 : J.networkOverrideFunc) !== null && W !== void 0 ? W : fetch)(Uv.EXCEPTION_ENDPOINT, {
            method: "POST",
            headers: {
              "STATSIG-API-KEY": this._sdkKey,
              "STATSIG-SDK-TYPE": String(H),
              "STATSIG-SDK-VERSION": String(C.sdkVersion),
              "Content-Type": "application/json"
            },
            body: U
          }), (X = this._emitter) === null || X === void 0 || X.call(this, {
            name: "error",
            error: Q,
            tag: A
          })
        }))().then(() => {}).catch(() => {})
      } catch (B) {}
    }
  }
  Uv.ErrorBoundary = ka0;

  function Sa0(A) {
    if (A instanceof Error) return A;
    else if (typeof A === "string") return Error(A);
    else return Error("An unknown error occurred.")
  }

  function MY4(A) {
    try {
      return JSON.stringify(A)
    } catch (Q) {
      return _a0
    }
  }

  function OY4(A) {
    let Q = new Set,
      B = Object.getPrototypeOf(A);
    while (B && B !== Object.prototype) Object.getOwnPropertyNames(B).filter((G) => typeof(B === null || B === void 0 ? void 0 : B[G]) === "function").forEach((G) => Q.add(G)), B = Object.getPrototypeOf(B);
    return Array.from(Q)
  }
})
// @from(Start 2056428, End 2056513)
xa0 = z((ya0) => {
  Object.defineProperty(ya0, "__esModule", {
    value: !0
  })
})
// @from(Start 2056519, End 2056604)
ba0 = z((va0) => {
  Object.defineProperty(va0, "__esModule", {
    value: !0
  })
})
// @from(Start 2056610, End 2056695)
ha0 = z((fa0) => {
  Object.defineProperty(fa0, "__esModule", {
    value: !0
  })
})
// @from(Start 2056701, End 2057292)
Qz1 = z((ga0) => {
  Object.defineProperty(ga0, "__esModule", {
    value: !0
  });
  ga0.createMemoKey = ga0.MemoPrefix = void 0;
  ga0.MemoPrefix = {
    _gate: "g",
    _dynamicConfig: "c",
    _experiment: "e",
    _layer: "l",
    _paramStore: "p"
  };
  var RY4 = new Set([]),
    TY4 = new Set(["userPersistedValues"]);

  function PY4(A, Q, B) {
    let G = `${A}|${Q}`;
    if (!B) return G;
    for (let Z of Object.keys(B)) {
      if (TY4.has(Z)) return;
      if (RY4.has(Z)) G += `|${Z}=true`;
      else G += `|${Z}=${B[Z]}`
    }
    return G
  }
  ga0.createMemoKey = PY4
})
// @from(Start 2057298, End 2059187)
ma0 = z((D4A) => {
  var SY4 = D4A && D4A.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(D4A, "__esModule", {
    value: !0
  });
  D4A._fetchTxtRecords = void 0;
  var _Y4 = new Uint8Array([0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 97, 115, 115, 101, 116, 115, 3, 111, 114, 103, 0, 0, 16, 0, 1]),
    kY4 = "https://cloudflare-dns.com/dns-query",
    yY4 = ["i", "e", "d"],
    xY4 = 200;

  function vY4(A) {
    return SY4(this, void 0, void 0, function*() {
      let Q = yield A(kY4, {
        method: "POST",
        headers: {
          "Content-Type": "application/dns-message",
          Accept: "application/dns-message"
        },
        body: _Y4
      });
      if (!Q.ok) {
        let Z = Error("Failed to fetch TXT records from DNS");
        throw Z.name = "DnsTxtFetchError", Z
      }
      let B = yield Q.arrayBuffer(), G = new Uint8Array(B);
      return bY4(G)
    })
  }
  D4A._fetchTxtRecords = vY4;

  function bY4(A) {
    let Q = A.findIndex((G, Z) => Z < xY4 && String.fromCharCode(G) === "=" && yY4.includes(String.fromCharCode(A[Z - 1])));
    if (Q === -1) {
      let G = Error("Failed to parse TXT records from DNS");
      throw G.name = "DnsTxtParseError", G
    }
    let B = "";
    for (let G = Q - 1; G < A.length; G++) B += String.fromCharCode(A[G]);
    return B.split(",")
  }
})
// @from(Start 2059193, End 2064703)
aa0 = z((im) => {
  var da0 = im && im.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(im, "__esModule", {
    value: !0
  });
  im._isDomainFailure = im.NetworkFallbackResolver = void 0;
  var fY4 = ma0(),
    hY4 = J4A(),
    gY4 = UH(),
    Gz1 = zv(),
    ca0 = 604800000,
    uY4 = 14400000;
  class la0 {
    constructor(A) {
      var Q;
      this._fallbackInfo = null, this._errorBoundary = null, this._dnsQueryCooldowns = {}, this._networkOverrideFunc = (Q = A.networkConfig) === null || Q === void 0 ? void 0 : Q.networkOverrideFunc
    }
    setErrorBoundary(A) {
      this._errorBoundary = A
    }
    tryBumpExpiryTime(A, Q) {
      var B;
      let G = (B = this._fallbackInfo) === null || B === void 0 ? void 0 : B[Q.endpoint];
      if (!G) return;
      G.expiryTime = Date.now() + ca0, Bz1(A, Object.assign(Object.assign({}, this._fallbackInfo), {
        [Q.endpoint]: G
      }))
    }
    getActiveFallbackUrl(A, Q) {
      var B, G;
      let Z = this._fallbackInfo;
      if (Z == null) Z = (B = mY4(A)) !== null && B !== void 0 ? B : {}, this._fallbackInfo = Z;
      let I = Z[Q.endpoint];
      if (!I || Date.now() > ((G = I.expiryTime) !== null && G !== void 0 ? G : 0)) return delete Z[Q.endpoint], this._fallbackInfo = Z, Bz1(A, this._fallbackInfo), null;
      if (I.url) return I.url;
      return null
    }
    getFallbackFromProvided(A) {
      let Q = pa0(A);
      if (Q) return A.replace(Q, "");
      return null
    }
    tryFetchUpdatedFallbackInfo(A, Q, B, G) {
      var Z, I;
      return da0(this, void 0, void 0, function*() {
        try {
          if (!ia0(B, G)) return !1;
          let J = Q.customUrl == null && Q.fallbackUrls == null ? yield this._tryFetchFallbackUrlsFromNetwork(Q): Q.fallbackUrls, W = this._pickNewFallbackUrl((Z = this._fallbackInfo) === null || Z === void 0 ? void 0 : Z[Q.endpoint], J);
          if (!W) return !1;
          return this._updateFallbackInfoWithNewUrl(A, Q.endpoint, W), !0
        } catch (Y) {
          return (I = this._errorBoundary) === null || I === void 0 || I.logError("tryFetchUpdatedFallbackInfo", Y), !1
        }
      })
    }
    _updateFallbackInfoWithNewUrl(A, Q, B) {
      var G, Z, I;
      let Y = {
          url: B,
          expiryTime: Date.now() + ca0,
          previous: []
        },
        J = (G = this._fallbackInfo) === null || G === void 0 ? void 0 : G[Q];
      if (J) Y.previous.push(...J.previous);
      if (Y.previous.length > 10) Y.previous = [];
      let W = (I = (Z = this._fallbackInfo) === null || Z === void 0 ? void 0 : Z[Q]) === null || I === void 0 ? void 0 : I.url;
      if (W != null) Y.previous.push(W);
      this._fallbackInfo = Object.assign(Object.assign({}, this._fallbackInfo), {
        [Q]: Y
      }), Bz1(A, this._fallbackInfo)
    }
    _tryFetchFallbackUrlsFromNetwork(A) {
      var Q;
      return da0(this, void 0, void 0, function*() {
        let B = this._dnsQueryCooldowns[A.endpoint];
        if (B && Date.now() < B) return null;
        this._dnsQueryCooldowns[A.endpoint] = Date.now() + uY4;
        let G = [],
          Z = yield(0, fY4._fetchTxtRecords)((Q = this._networkOverrideFunc) !== null && Q !== void 0 ? Q : fetch), I = pa0(A.defaultUrl);
        for (let Y of Z) {
          if (!Y.startsWith(A.endpointDnsKey + "=")) continue;
          let J = Y.split("=");
          if (J.length > 1) {
            let W = J[1];
            if (W.endsWith("/")) W = W.slice(0, -1);
            G.push(`https://${W}${I}`)
          }
        }
        return G
      })
    }
    _pickNewFallbackUrl(A, Q) {
      var B;
      if (Q == null) return null;
      let G = new Set((B = A === null || A === void 0 ? void 0 : A.previous) !== null && B !== void 0 ? B : []),
        Z = A === null || A === void 0 ? void 0 : A.url,
        I = null;
      for (let Y of Q) {
        let J = Y.endsWith("/") ? Y.slice(0, -1) : Y;
        if (!G.has(Y) && J !== Z) {
          I = J;
          break
        }
      }
      return I
    }
  }
  im.NetworkFallbackResolver = la0;

  function ia0(A, Q) {
    var B;
    let G = (B = A === null || A === void 0 ? void 0 : A.toLowerCase()) !== null && B !== void 0 ? B : "";
    return Q || G.includes("uncaught exception") || G.includes("failed to fetch") || G.includes("networkerror when attempting to fetch resource")
  }
  im._isDomainFailure = ia0;

  function na0(A) {
    return `statsig.network_fallback.${(0,hY4._DJB2)(A)}`
  }

  function Bz1(A, Q) {
    let B = na0(A);
    if (!Q || Object.keys(Q).length === 0) {
      Gz1.Storage.removeItem(B);
      return
    }
    Gz1.Storage.setItem(B, JSON.stringify(Q))
  }

  function mY4(A) {
    let Q = na0(A),
      B = Gz1.Storage.getItem(Q);
    if (!B) return null;
    try {
      return JSON.parse(B)
    } catch (G) {
      return gY4.Log.error("Failed to parse FallbackInfo"), null
    }
  }

  function pa0(A) {
    try {
      return new URL(A).pathname
    } catch (Q) {
      return null
    }
  }
})
// @from(Start 2064709, End 2065059)
Zz1 = z((ra0) => {
  Object.defineProperty(ra0, "__esModule", {
    value: !0
  });
  ra0.SDKFlags = void 0;
  var sa0 = {};
  ra0.SDKFlags = {
    setFlags: (A, Q) => {
      sa0[A] = Q
    },
    get: (A, Q) => {
      var B, G;
      return (G = (B = sa0[A]) === null || B === void 0 ? void 0 : B[Q]) !== null && G !== void 0 ? G : !1
    }
  }
})
// @from(Start 2065065, End 2067133)
DbA = z((Zs0) => {
  Object.defineProperty(Zs0, "__esModule", {
    value: !0
  });
  Zs0.StatsigSession = Zs0.SessionID = void 0;
  var dY4 = XDA(),
    cY4 = UH(),
    ea0 = zv(),
    As0 = IbA(),
    Qs0 = 1800000,
    Bs0 = 14400000,
    KbA = {};
  Zs0.SessionID = {
    get: (A) => {
      return Zs0.StatsigSession.get(A).data.sessionID
    }
  };
  Zs0.StatsigSession = {
    get: (A) => {
      if (KbA[A] == null) KbA[A] = pY4(A);
      let Q = KbA[A];
      return iY4(Q)
    },
    overrideInitialSessionID: (A, Q) => {
      KbA[Q] = lY4(A, Q)
    }
  };

  function pY4(A) {
    let Q = rY4(A),
      B = Date.now();
    if (!Q) Q = {
      sessionID: (0, As0.getUUID)(),
      startTime: B,
      lastUpdate: B
    };
    return {
      data: Q,
      sdkKey: A
    }
  }

  function lY4(A, Q) {
    let B = Date.now();
    return {
      data: {
        sessionID: A,
        startTime: B,
        lastUpdate: B
      },
      sdkKey: Q
    }
  }

  function iY4(A) {
    let Q = Date.now(),
      B = A.data;
    if (nY4(B) || aY4(B)) B.sessionID = (0, As0.getUUID)(), B.startTime = Q;
    B.lastUpdate = Q, sY4(B, A.sdkKey), clearTimeout(A.idleTimeoutID), clearTimeout(A.ageTimeoutID);
    let G = Q - B.startTime,
      Z = A.sdkKey;
    return A.idleTimeoutID = ta0(Z, Qs0), A.ageTimeoutID = ta0(Z, Bs0 - G), A
  }

  function ta0(A, Q) {
    return setTimeout(() => {
      let B = __STATSIG__ === null || __STATSIG__ === void 0 ? void 0 : __STATSIG__.instance(A);
      if (B) B.$emt({
        name: "session_expired"
      })
    }, Q)
  }

  function nY4({
    lastUpdate: A
  }) {
    return Date.now() - A > Qs0
  }

  function aY4({
    startTime: A
  }) {
    return Date.now() - A > Bs0
  }

  function Gs0(A) {
    return `statsig.session_id.${(0,dY4._getStorageKey)(A)}`
  }

  function sY4(A, Q) {
    let B = Gs0(Q);
    try {
      (0, ea0._setObjectInStorage)(B, A)
    } catch (G) {
      cY4.Log.warn("Failed to save SessionID")
    }
  }

  function rY4(A) {
    let Q = Gs0(A);
    return (0, ea0._getObjectFromStorage)(Q)
  }
})
// @from(Start 2067139, End 2067306)
Yz1 = z((Is0) => {
  Object.defineProperty(Is0, "__esModule", {
    value: !0
  });
  Is0.ErrorTag = void 0;
  Is0.ErrorTag = {
    NetworkError: "NetworkError"
  }
})
// @from(Start 2067312, End 2077826)
Cs0 = z((C4A) => {
  var H4A = C4A && C4A.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(C4A, "__esModule", {
    value: !0
  });
  C4A.NetworkCore = void 0;
  Ur();
  var Js0 = Ur(),
    Jz1 = ivA(),
    qr = UH(),
    hR = VDA(),
    tY4 = aa0(),
    eY4 = Zz1(),
    Vs0 = FbA(),
    AJ4 = $r(),
    Fs0 = DbA(),
    QJ4 = JbA(),
    BJ4 = Yz1(),
    Ks0 = HDA(),
    GJ4 = GbA(),
    ZJ4 = 1e4,
    IJ4 = 500,
    YJ4 = 30000,
    JJ4 = 1000,
    Ds0 = 50,
    WJ4 = Ds0 / JJ4,
    XJ4 = new Set([408, 500, 502, 503, 504, 522, 524, 599]);
  class Hs0 {
    constructor(A, Q) {
      if (this._emitter = Q, this._errorBoundary = null, this._timeout = ZJ4, this._netConfig = {}, this._options = {}, this._leakyBucket = {}, this._lastUsedInitUrl = null, A) this._options = A;
      if (this._options.networkConfig) this._netConfig = this._options.networkConfig;
      if (this._netConfig.networkTimeoutMs) this._timeout = this._netConfig.networkTimeoutMs;
      this._fallbackResolver = new tY4.NetworkFallbackResolver(this._options)
    }
    setErrorBoundary(A) {
      this._errorBoundary = A, this._errorBoundary.wrap(this), this._errorBoundary.wrap(this._fallbackResolver), this._fallbackResolver.setErrorBoundary(A)
    }
    isBeaconSupported() {
      return typeof navigator < "u" && typeof navigator.sendBeacon === "function"
    }
    getLastUsedInitUrlAndReset() {
      let A = this._lastUsedInitUrl;
      return this._lastUsedInitUrl = null, A
    }
    beacon(A) {
      return H4A(this, void 0, void 0, function*() {
        if (!Ws0(A)) return !1;
        let Q = this._getInternalRequestArgs("POST", A);
        yield this._tryToCompressBody(Q);
        let B = yield this._getPopulatedURL(Q), G = navigator;
        return G.sendBeacon.bind(G)(B, Q.body)
      })
    }
    post(A) {
      return H4A(this, void 0, void 0, function*() {
        let Q = this._getInternalRequestArgs("POST", A);
        return this._tryEncodeBody(Q), yield this._tryToCompressBody(Q), this._sendRequest(Q)
      })
    }
    get(A) {
      let Q = this._getInternalRequestArgs("GET", A);
      return this._sendRequest(Q)
    }
    _sendRequest(A) {
      var Q, B, G, Z;
      return H4A(this, void 0, void 0, function*() {
        if (!Ws0(A)) return null;
        if (this._netConfig.preventAllNetworkTraffic) return null;
        let {
          method: I,
          body: Y,
          retries: J,
          attempt: W
        } = A, X = A.urlConfig.endpoint;
        if (this._isRateLimited(X)) return qr.Log.warn(`Request to ${X} was blocked because you are making requests too frequently.`), null;
        let V = W !== null && W !== void 0 ? W : 1,
          F = typeof AbortController < "u" ? new AbortController : null,
          K = setTimeout(() => {
            F === null || F === void 0 || F.abort(`Timeout of ${this._timeout}ms expired.`)
          }, this._timeout),
          D = yield this._getPopulatedURL(A), H = null, C = (0, GJ4._isUnloading)();
        try {
          let E = {
            method: I,
            body: Y,
            headers: Object.assign({}, A.headers),
            signal: F === null || F === void 0 ? void 0 : F.signal,
            priority: A.priority,
            keepalive: C
          };
          DJ4(A, V);
          let U = this._leakyBucket[X];
          if (U) U.lastRequestTime = Date.now(), this._leakyBucket[X] = U;
          if (H = yield((Q = this._netConfig.networkOverrideFunc) !== null && Q !== void 0 ? Q : fetch)(D, E), clearTimeout(K), !H.ok) {
            let N = yield H.text().catch(() => "No Text"), R = Error(`NetworkError: ${D} ${N}`);
            throw R.name = "NetworkError", R
          }
          let w = yield H.text();
          return Xs0(A, H, V, w), this._fallbackResolver.tryBumpExpiryTime(A.sdkKey, A.urlConfig), {
            body: w,
            code: H.status
          }
        } catch (E) {
          let U = FJ4(F, E),
            q = KJ4(F);
          if (Xs0(A, H, V, "", E), yield this._fallbackResolver.tryFetchUpdatedFallbackInfo(A.sdkKey, A.urlConfig, U, q)) A.fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(A.sdkKey, A.urlConfig);
          if (!J || V > J || !XJ4.has((B = H === null || H === void 0 ? void 0 : H.status) !== null && B !== void 0 ? B : 500)) {
            (G = this._emitter) === null || G === void 0 || G.call(this, {
              name: "error",
              error: E,
              tag: BJ4.ErrorTag.NetworkError,
              requestArgs: A
            });
            let N = `A networking error occurred during ${I} request to ${D}.`;
            return qr.Log.error(N, U, E), (Z = this._errorBoundary) === null || Z === void 0 || Z.attachErrorIfNoneExists(N), null
          }
          return yield HJ4(V), this._sendRequest(Object.assign(Object.assign({}, A), {
            retries: J,
            attempt: V + 1
          }))
        }
      })
    }
    _isRateLimited(A) {
      var Q;
      let B = Date.now(),
        G = (Q = this._leakyBucket[A]) !== null && Q !== void 0 ? Q : {
          count: 0,
          lastRequestTime: B
        },
        Z = B - G.lastRequestTime,
        I = Math.floor(Z * WJ4);
      if (G.count = Math.max(0, G.count - I), G.count >= Ds0) return !0;
      return G.count += 1, G.lastRequestTime = B, this._leakyBucket[A] = G, !1
    }
    _getPopulatedURL(A) {
      var Q;
      return H4A(this, void 0, void 0, function*() {
        let B = (Q = A.fallbackUrl) !== null && Q !== void 0 ? Q : A.urlConfig.getUrl();
        if (A.urlConfig.endpoint === hR.Endpoint._initialize || A.urlConfig.endpoint === hR.Endpoint._download_config_specs) this._lastUsedInitUrl = B;
        let G = Object.assign({
            [hR.NetworkParam.SdkKey]: A.sdkKey,
            [hR.NetworkParam.SdkType]: Vs0.SDKType._get(A.sdkKey),
            [hR.NetworkParam.SdkVersion]: Ks0.SDK_VERSION,
            [hR.NetworkParam.Time]: String(Date.now()),
            [hR.NetworkParam.SessionID]: Fs0.SessionID.get(A.sdkKey)
          }, A.params),
          Z = Object.keys(G).map((I) => {
            return `${encodeURIComponent(I)}=${encodeURIComponent(G[I])}`
          }).join("&");
        return `${B}${Z?`?${Z}`:""}`
      })
    }
    _tryEncodeBody(A) {
      var Q;
      let B = (0, AJ4._getWindowSafe)(),
        G = A.body;
      if (!A.isStatsigEncodable || this._options.disableStatsigEncoding || typeof G !== "string" || (0, Js0._getStatsigGlobalFlag)("no-encode") != null || !(B === null || B === void 0 ? void 0 : B.btoa)) return;
      try {
        A.body = B.btoa(G).split("").reverse().join(""), A.params = Object.assign(Object.assign({}, (Q = A.params) !== null && Q !== void 0 ? Q : {}), {
          [hR.NetworkParam.StatsigEncoded]: "1"
        })
      } catch (Z) {
        qr.Log.warn(`Request encoding failed for ${A.urlConfig.getUrl()}`, Z)
      }
    }
    _tryToCompressBody(A) {
      var Q;
      return H4A(this, void 0, void 0, function*() {
        let B = A.body;
        if (!A.isCompressable || this._options.disableCompression || typeof B !== "string" || eY4.SDKFlags.get(A.sdkKey, "enable_log_event_compression") !== !0 || (0, Js0._getStatsigGlobalFlag)("no-compress") != null || typeof CompressionStream > "u" || typeof TextEncoder > "u") return;
        try {
          let G = new TextEncoder().encode(B),
            Z = new CompressionStream("gzip"),
            I = Z.writable.getWriter();
          I.write(G).catch(qr.Log.error), I.close().catch(qr.Log.error);
          let Y = Z.readable.getReader(),
            J = [],
            W;
          while (!(W = yield Y.read()).done) J.push(W.value);
          let X = J.reduce((K, D) => K + D.length, 0),
            V = new Uint8Array(X),
            F = 0;
          for (let K of J) V.set(K, F), F += K.length;
          A.body = V, A.params = Object.assign(Object.assign({}, (Q = A.params) !== null && Q !== void 0 ? Q : {}), {
            [hR.NetworkParam.IsGzipped]: "1"
          })
        } catch (G) {
          qr.Log.warn(`Request compression failed for ${A.urlConfig.getUrl()}`, G)
        }
      })
    }
    _getInternalRequestArgs(A, Q) {
      let B = this._fallbackResolver.getActiveFallbackUrl(Q.sdkKey, Q.urlConfig),
        G = Object.assign(Object.assign({}, Q), {
          method: A,
          fallbackUrl: B
        });
      if ("data" in Q) VJ4(G, Q.data);
      return G
    }
  }
  C4A.NetworkCore = Hs0;
  var Ws0 = (A) => {
      if (!A.sdkKey) return qr.Log.warn("Unable to make request without an SDK key"), !1;
      return !0
    },
    VJ4 = (A, Q) => {
      let {
        sdkKey: B,
        fallbackUrl: G
      } = A, Z = QJ4.StableID.get(B), I = Fs0.SessionID.get(B), Y = Vs0.SDKType._get(B);
      A.body = JSON.stringify(Object.assign(Object.assign({}, Q), {
        statsigMetadata: Object.assign(Object.assign({}, Ks0.StatsigMetadataProvider.get()), {
          stableID: Z,
          sessionID: I,
          sdkType: Y,
          fallbackUrl: G
        })
      }))
    };

  function FJ4(A, Q) {
    if ((A === null || A === void 0 ? void 0 : A.signal.aborted) && typeof A.signal.reason === "string") return A.signal.reason;
    if (typeof Q === "string") return Q;
    if (Q instanceof Error) return `${Q.name}: ${Q.message}`;
    return "Unknown Error"
  }

  function KJ4(A) {
    return (A === null || A === void 0 ? void 0 : A.signal.aborted) && typeof A.signal.reason === "string" && A.signal.reason.includes("Timeout") || !1
  }

  function DJ4(A, Q) {
    if (A.urlConfig.endpoint !== hR.Endpoint._initialize) return;
    Jz1.Diagnostics._markInitNetworkReqStart(A.sdkKey, {
      attempt: Q
    })
  }

  function Xs0(A, Q, B, G, Z) {
    if (A.urlConfig.endpoint !== hR.Endpoint._initialize) return;
    Jz1.Diagnostics._markInitNetworkReqEnd(A.sdkKey, Jz1.Diagnostics._getDiagnosticsData(Q, B, G, Z))
  }

  function HJ4(A) {
    return H4A(this, void 0, void 0, function*() {
      yield new Promise((Q) => setTimeout(Q, Math.min(IJ4 * (A * A), YJ4)))
    })
  }
})
// @from(Start 2077832, End 2077917)
zs0 = z((Es0) => {
  Object.defineProperty(Es0, "__esModule", {
    value: !0
  })
})
// @from(Start 2077923, End 2078008)
$s0 = z((Us0) => {
  Object.defineProperty(Us0, "__esModule", {
    value: !0
  })
})
// @from(Start 2078014, End 2082866)
qs0 = z((E4A) => {
  var CJ4 = E4A && E4A.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(E4A, "__esModule", {
    value: !0
  });
  E4A.StatsigClientBase = void 0;
  Ur();
  var EJ4 = Ur(),
    zJ4 = Az1(),
    UJ4 = sE1(),
    Wz1 = UH(),
    $J4 = Qz1(),
    wJ4 = $r(),
    qJ4 = DbA(),
    HbA = zv(),
    NJ4 = 3000;
  class ws0 {
    constructor(A, Q, B, G) {
      var Z;
      this.loadingStatus = "Uninitialized", this._initializePromise = null, this._listeners = {};
      let I = this.$emt.bind(this);
      (G === null || G === void 0 ? void 0 : G.logLevel) != null && (Wz1.Log.level = G.logLevel), (G === null || G === void 0 ? void 0 : G.disableStorage) && HbA.Storage._setDisabled(!0), (G === null || G === void 0 ? void 0 : G.initialSessionID) && qJ4.StatsigSession.overrideInitialSessionID(G.initialSessionID, A), (G === null || G === void 0 ? void 0 : G.storageProvider) && HbA.Storage._setProvider(G.storageProvider), this._sdkKey = A, this._options = G !== null && G !== void 0 ? G : {}, this._memoCache = {}, this.overrideAdapter = (Z = G === null || G === void 0 ? void 0 : G.overrideAdapter) !== null && Z !== void 0 ? Z : null, this._logger = new UJ4.EventLogger(A, I, B, G), this._errorBoundary = new zJ4.ErrorBoundary(A, G, I), this._errorBoundary.wrap(this), this._errorBoundary.wrap(Q), this._errorBoundary.wrap(this._logger), B.setErrorBoundary(this._errorBoundary), this.dataAdapter = Q, this.dataAdapter.attach(A, G), this.storageProvider = HbA.Storage, this._primeReadyRipcord(), LJ4(A, this)
    }
    updateRuntimeOptions(A) {
      if (A.disableLogging != null) this._options.disableLogging = A.disableLogging, this._logger.setLoggingDisabled(A.disableLogging);
      if (A.disableStorage != null) this._options.disableStorage = A.disableStorage, HbA.Storage._setDisabled(A.disableStorage)
    }
    flush() {
      return this._logger.flush()
    }
    shutdown() {
      return CJ4(this, void 0, void 0, function*() {
        this.$emt({
          name: "pre_shutdown"
        }), this._setStatus("Uninitialized", null), this._initializePromise = null, yield this._logger.stop()
      })
    }
    on(A, Q) {
      if (!this._listeners[A]) this._listeners[A] = [];
      this._listeners[A].push(Q)
    }
    off(A, Q) {
      if (this._listeners[A]) {
        let B = this._listeners[A].indexOf(Q);
        if (B !== -1) this._listeners[A].splice(B, 1)
      }
    }
    $on(A, Q) {
      Q.__isInternal = !0, this.on(A, Q)
    }
    $emt(A) {
      var Q;
      let B = (G) => {
        try {
          G(A)
        } catch (Z) {
          if (G.__isInternal === !0) {
            this._errorBoundary.logError(`__emit:${A.name}`, Z);
            return
          }
          Wz1.Log.error("An error occurred in a StatsigClientEvent listener. This is not an issue with Statsig.", A)
        }
      };
      if (this._listeners[A.name]) this._listeners[A.name].forEach((G) => B(G));
      (Q = this._listeners["*"]) === null || Q === void 0 || Q.forEach(B)
    }
    _setStatus(A, Q) {
      this.loadingStatus = A, this._memoCache = {}, this.$emt({
        name: "values_updated",
        status: A,
        values: Q
      })
    }
    _enqueueExposure(A, Q, B) {
      if ((B === null || B === void 0 ? void 0 : B.disableExposureLog) === !0) {
        this._logger.incrementNonExposureCount(A);
        return
      }
      this._logger.enqueue(Q)
    }
    _memoize(A, Q) {
      return (B, G) => {
        if (this._options.disableEvaluationMemoization) return Q(B, G);
        let Z = (0, $J4.createMemoKey)(A, B, G);
        if (!Z) return Q(B, G);
        if (!(Z in this._memoCache)) {
          if (Object.keys(this._memoCache).length >= NJ4) this._memoCache = {};
          this._memoCache[Z] = Q(B, G)
        }
        return this._memoCache[Z]
      }
    }
  }
  E4A.StatsigClientBase = ws0;

  function LJ4(A, Q) {
    var B;
    if ((0, wJ4._isServerEnv)()) return;
    let G = (0, EJ4._getStatsigGlobal)(),
      Z = (B = G.instances) !== null && B !== void 0 ? B : {},
      I = Q;
    if (Z[A] != null) Wz1.Log.warn("Creating multiple Statsig clients with the same SDK key can lead to unexpected behavior. Multi-instance support requires different SDK keys.");
    if (Z[A] = I, !G.firstInstance) G.firstInstance = I;
    G.instances = Z, __STATSIG__ = G
  }
})
// @from(Start 2082872, End 2083045)
Ms0 = z((Ns0) => {
  Object.defineProperty(Ns0, "__esModule", {
    value: !0
  });
  Ns0.DataAdapterCachePrefix = void 0;
  Ns0.DataAdapterCachePrefix = "statsig.cached"
})
// @from(Start 2083051, End 2083136)
Rs0 = z((Os0) => {
  Object.defineProperty(Os0, "__esModule", {
    value: !0
  })
})
// @from(Start 2083142, End 2083227)
Ps0 = z((Ts0) => {
  Object.defineProperty(Ts0, "__esModule", {
    value: !0
  })
})
// @from(Start 2083233, End 2085671)
ks0 = z((Ss0) => {
  Object.defineProperty(Ss0, "__esModule", {
    value: !0
  });
  Ss0._makeTypedGet = Ss0._mergeOverride = Ss0._makeLayer = Ss0._makeExperiment = Ss0._makeDynamicConfig = Ss0._makeFeatureGate = void 0;
  var MJ4 = UH(),
    OJ4 = nvA(),
    RJ4 = "default";

  function Xz1(A, Q, B, G) {
    var Z;
    return {
      name: A,
      details: Q,
      ruleID: (Z = B === null || B === void 0 ? void 0 : B.rule_id) !== null && Z !== void 0 ? Z : RJ4,
      __evaluation: B,
      value: G
    }
  }

  function TJ4(A, Q, B) {
    return Xz1(A, Q, B, (B === null || B === void 0 ? void 0 : B.value) === !0)
  }
  Ss0._makeFeatureGate = TJ4;

  function js0(A, Q, B) {
    var G;
    let Z = (G = B === null || B === void 0 ? void 0 : B.value) !== null && G !== void 0 ? G : {};
    return Object.assign(Object.assign({}, Xz1(A, Q, B, Z)), {
      get: CbA(A, B === null || B === void 0 ? void 0 : B.value)
    })
  }
  Ss0._makeDynamicConfig = js0;

  function PJ4(A, Q, B) {
    var G;
    let Z = js0(A, Q, B);
    return Object.assign(Object.assign({}, Z), {
      groupName: (G = B === null || B === void 0 ? void 0 : B.group_name) !== null && G !== void 0 ? G : null
    })
  }
  Ss0._makeExperiment = PJ4;

  function jJ4(A, Q, B, G) {
    var Z, I;
    return Object.assign(Object.assign({}, Xz1(A, Q, B, void 0)), {
      get: CbA(A, B === null || B === void 0 ? void 0 : B.value, G),
      groupName: (Z = B === null || B === void 0 ? void 0 : B.group_name) !== null && Z !== void 0 ? Z : null,
      __value: (I = B === null || B === void 0 ? void 0 : B.value) !== null && I !== void 0 ? I : {}
    })
  }
  Ss0._makeLayer = jJ4;

  function SJ4(A, Q, B, G) {
    return Object.assign(Object.assign(Object.assign({}, A), Q), {
      get: CbA(A.name, B, G)
    })
  }
  Ss0._mergeOverride = SJ4;

  function CbA(A, Q, B) {
    return (G, Z) => {
      var I;
      let Y = (I = Q === null || Q === void 0 ? void 0 : Q[G]) !== null && I !== void 0 ? I : null;
      if (Y == null) return Z !== null && Z !== void 0 ? Z : null;
      if (Z != null && !(0, OJ4._isTypeMatch)(Y, Z)) return MJ4.Log.warn(`Parameter type mismatch. '${A}.${G}' was found to be type '${typeof Y}' but fallback/return type is '${typeof Z}'. See https://docs.statsig.com/client/javascript-sdk/#typed-getters`), Z !== null && Z !== void 0 ? Z : null;
      return B === null || B === void 0 || B(G), Y
    }
  }
  Ss0._makeTypedGet = CbA
})
// @from(Start 2085677, End 2085762)
xs0 = z((ys0) => {
  Object.defineProperty(ys0, "__esModule", {
    value: !0
  })
})
// @from(Start 2085768, End 2086337)
fs0 = z((vs0) => {
  Object.defineProperty(vs0, "__esModule", {
    value: !0
  });
  vs0.UPDATE_DETAIL_ERROR_MESSAGES = vs0.createUpdateDetails = void 0;
  var bJ4 = (A, Q, B, G, Z, I) => {
    return {
      duration: B,
      source: Q,
      success: A,
      error: G,
      sourceUrl: Z,
      warnings: I
    }
  };
  vs0.createUpdateDetails = bJ4;
  vs0.UPDATE_DETAIL_ERROR_MESSAGES = {
    NO_NETWORK_DATA: "No data was returned from the network. This may be due to a network timeout if a timeout value was specified in the options or ad blocker error."
  }
})
// @from(Start 2086343, End 2088545)
nm = z((f9) => {
  var hJ4 = f9 && f9.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    F6 = f9 && f9.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) hJ4(Q, A, B)
    };
  Object.defineProperty(f9, "__esModule", {
    value: !0
  });
  f9.Storage = f9.Log = f9.EventLogger = f9.Diagnostics = void 0;
  Ur();
  var gJ4 = ivA();
  Object.defineProperty(f9, "Diagnostics", {
    enumerable: !0,
    get: function() {
      return gJ4.Diagnostics
    }
  });
  var uJ4 = sE1();
  Object.defineProperty(f9, "EventLogger", {
    enumerable: !0,
    get: function() {
      return uJ4.EventLogger
    }
  });
  var hs0 = UH();
  Object.defineProperty(f9, "Log", {
    enumerable: !0,
    get: function() {
      return hs0.Log
    }
  });
  var mJ4 = HDA(),
    dJ4 = zv();
  Object.defineProperty(f9, "Storage", {
    enumerable: !0,
    get: function() {
      return dJ4.Storage
    }
  });
  F6(Ur(), f9);
  F6(XDA(), f9);
  F6(Ja0(), f9);
  F6(Ma0(), f9);
  F6(ivA(), f9);
  F6(Ra0(), f9);
  F6(Az1(), f9);
  F6(xa0(), f9);
  F6(ba0(), f9);
  F6(J4A(), f9);
  F6(ha0(), f9);
  F6(UH(), f9);
  F6(Qz1(), f9);
  F6(VDA(), f9);
  F6(Cs0(), f9);
  F6(zs0(), f9);
  F6($s0(), f9);
  F6($r(), f9);
  F6(FbA(), f9);
  F6(DbA(), f9);
  F6(JbA(), f9);
  F6(qs0(), f9);
  F6(Yz1(), f9);
  F6(Ms0(), f9);
  F6(mE1(), f9);
  F6(HDA(), f9);
  F6(Rs0(), f9);
  F6(Ps0(), f9);
  F6(ks0(), f9);
  F6(xs0(), f9);
  F6(oE1(), f9);
  F6(zv(), f9);
  F6(tE1(), f9);
  F6(nvA(), f9);
  F6(pE1(), f9);
  F6(IbA(), f9);
  F6(GbA(), f9);
  F6(fs0(), f9);
  F6(Zz1(), f9);
  __STATSIG__ = Object.assign(Object.assign({}, __STATSIG__ !== null && __STATSIG__ !== void 0 ? __STATSIG__ : {}), {
    Log: hs0.Log,
    SDK_VERSION: mJ4.SDK_VERSION
  })
})
// @from(Start 2088551, End 2092638)
ms0 = z((us0) => {
  Object.defineProperty(us0, "__esModule", {
    value: !0
  });
  var Nr = nm();
  class gs0 {
    constructor(A) {
      this._sdkKey = A, this._rawValues = null, this._values = null, this._source = "Uninitialized", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null, this._warnings = new Set
    }
    reset() {
      this._values = null, this._rawValues = null, this._source = "Loading", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null
    }
    finalize() {
      if (this._values) return;
      this._source = "NoValues"
    }
    getValues() {
      return this._rawValues ? (0, Nr._typedJsonParse)(this._rawValues, "has_updates", "EvaluationStoreValues") : null
    }
    setValues(A, Q) {
      var B;
      if (!A) return !1;
      let G = (0, Nr._typedJsonParse)(A.data, "has_updates", "EvaluationResponse");
      if (G == null) return !1;
      if (this._source = A.source, (G === null || G === void 0 ? void 0 : G.has_updates) !== !0) return !0;
      if (this._rawValues = A.data, this._lcut = G.time, this._receivedAt = A.receivedAt, this._values = G, this._bootstrapMetadata = this._extractBootstrapMetadata(A.source, G), A.source && G.user) this._setWarningState(Q, G);
      return Nr.SDKFlags.setFlags(this._sdkKey, (B = G.sdk_flags) !== null && B !== void 0 ? B : {}), !0
    }
    getWarnings() {
      if (this._warnings.size === 0) return;
      return Array.from(this._warnings)
    }
    getGate(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.feature_gates, A)
    }
    getConfig(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.dynamic_configs, A)
    }
    getLayer(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.layer_configs, A)
    }
    getParamStore(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.param_stores, A)
    }
    getSource() {
      return this._source
    }
    getExposureMapping() {
      var A;
      return (A = this._values) === null || A === void 0 ? void 0 : A.exposures
    }
    _extractBootstrapMetadata(A, Q) {
      if (A !== "Bootstrap") return null;
      let B = {};
      if (Q.user) B.user = Q.user;
      if (Q.sdkInfo) B.generatorSDKInfo = Q.sdkInfo;
      return B.lcut = Q.time, B
    }
    _getDetailedStoreResult(A, Q) {
      let B = null;
      if (A) B = A[Q] ? A[Q] : A[(0, Nr._DJB2)(Q)];
      return {
        result: B,
        details: this._getDetails(B == null)
      }
    }
    _setWarningState(A, Q) {
      var B;
      let G = Nr.StableID.get(this._sdkKey);
      if (((B = A.customIDs) === null || B === void 0 ? void 0 : B.stableID) !== G) {
        this._warnings.add("StableIDMismatch");
        return
      }
      if ("user" in Q) {
        let Z = Q.user;
        if ((0, Nr._getFullUserHash)(A) !== (0, Nr._getFullUserHash)(Z)) this._warnings.add("PartialUserMatch")
      }
    }
    getCurrentSourceDetails() {
      if (this._source === "Uninitialized" || this._source === "NoValues") return {
        reason: this._source
      };
      let A = {
        reason: this._source,
        lcut: this._lcut,
        receivedAt: this._receivedAt
      };
      if (this._warnings.size > 0) A.warnings = Array.from(this._warnings);
      return A
    }
    _getDetails(A) {
      var Q, B;
      let G = this.getCurrentSourceDetails(),
        Z = G.reason,
        I = (Q = G.warnings) !== null && Q !== void 0 ? Q : [];
      if (this._source === "Bootstrap" && I.length > 0) Z = Z + I[0];
      if (Z !== "Uninitialized" && Z !== "NoValues") Z = `${Z}:${A?"Unrecognized":"Recognized"}`;
      let Y = this._source === "Bootstrap" ? (B = this._bootstrapMetadata) !== null && B !== void 0 ? B : void 0 : void 0;
      if (Y) G.bootstrapMetadata = Y;
      return Object.assign(Object.assign({}, G), {
        reason: Z
      })
    }
  }
  us0.default = gs0
})
// @from(Start 2092644, End 2094144)
ls0 = z((cs0) => {
  Object.defineProperty(cs0, "__esModule", {
    value: !0
  });
  cs0._resolveDeltasResponse = void 0;
  var ds0 = nm(),
    pJ4 = 2;

  function lJ4(A, Q) {
    let B = (0, ds0._typedJsonParse)(Q, "checksum", "DeltasEvaluationResponse");
    if (!B) return {
      hadBadDeltaChecksum: !0
    };
    let G = iJ4(A, B),
      Z = nJ4(G),
      I = (0, ds0._DJB2Object)({
        feature_gates: Z.feature_gates,
        dynamic_configs: Z.dynamic_configs,
        layer_configs: Z.layer_configs
      }, pJ4);
    if (I !== B.checksumV2) return {
      hadBadDeltaChecksum: !0,
      badChecksum: I,
      badMergedConfigs: Z,
      badFullResponse: B.deltas_full_response
    };
    return JSON.stringify(Z)
  }
  cs0._resolveDeltasResponse = lJ4;

  function iJ4(A, Q) {
    return Object.assign(Object.assign(Object.assign({}, A), Q), {
      feature_gates: Object.assign(Object.assign({}, A.feature_gates), Q.feature_gates),
      layer_configs: Object.assign(Object.assign({}, A.layer_configs), Q.layer_configs),
      dynamic_configs: Object.assign(Object.assign({}, A.dynamic_configs), Q.dynamic_configs)
    })
  }

  function nJ4(A) {
    let Q = A;
    return Vz1(A.deleted_gates, Q.feature_gates), delete Q.deleted_gates, Vz1(A.deleted_configs, Q.dynamic_configs), delete Q.deleted_configs, Vz1(A.deleted_layers, Q.layer_configs), delete Q.deleted_layers, Q
  }

  function Vz1(A, Q) {
    A === null || A === void 0 || A.forEach((B) => {
      delete Q[B]
    })
  }
})
// @from(Start 2094150, End 2097069)
Fz1 = z((CDA) => {
  var is0 = CDA && CDA.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(CDA, "__esModule", {
    value: !0
  });
  var EbA = nm(),
    aJ4 = ls0();
  class ns0 extends EbA.NetworkCore {
    constructor(A, Q) {
      super(A, Q);
      let B = A === null || A === void 0 ? void 0 : A.networkConfig;
      this._initializeUrlConfig = new EbA.UrlConfiguration(EbA.Endpoint._initialize, B === null || B === void 0 ? void 0 : B.initializeUrl, B === null || B === void 0 ? void 0 : B.api, B === null || B === void 0 ? void 0 : B.initializeFallbackUrls)
    }
    fetchEvaluations(A, Q, B, G, Z) {
      return is0(this, void 0, void 0, function*() {
        let I = Q ? (0, EbA._typedJsonParse)(Q, "has_updates", "InitializeResponse") : null,
          Y = {
            user: G,
            hash: "djb2",
            deltasResponseRequested: !1,
            full_checksum: null
          };
        if (I === null || I === void 0 ? void 0 : I.has_updates) Y = Object.assign(Object.assign({}, Y), {
          sinceTime: Z ? I.time : 0,
          previousDerivedFields: "derived_fields" in I && Z ? I.derived_fields : {},
          deltasResponseRequested: !0,
          full_checksum: I.full_checksum
        });
        return this._fetchEvaluations(A, I, Y, B)
      })
    }
    _fetchEvaluations(A, Q, B, G) {
      var Z, I;
      return is0(this, void 0, void 0, function*() {
        let Y = yield this.post({
          sdkKey: A,
          urlConfig: this._initializeUrlConfig,
          data: B,
          retries: 2,
          isStatsigEncodable: !0,
          priority: G
        });
        if ((Y === null || Y === void 0 ? void 0 : Y.code) === 204) return '{"has_updates": false}';
        if ((Y === null || Y === void 0 ? void 0 : Y.code) !== 200) return (Z = Y === null || Y === void 0 ? void 0 : Y.body) !== null && Z !== void 0 ? Z : null;
        if ((Q === null || Q === void 0 ? void 0 : Q.has_updates) !== !0 || ((I = Y.body) === null || I === void 0 ? void 0 : I.includes('"is_delta":true')) !== !0 || B.deltasResponseRequested !== !0) return Y.body;
        let J = (0, aJ4._resolveDeltasResponse)(Q, Y.body);
        if (typeof J === "string") return J;
        return this._fetchEvaluations(A, Q, Object.assign(Object.assign(Object.assign({}, B), J), {
          deltasResponseRequested: !1
        }), G)
      })
    }
  }
  CDA.default = ns0
})
// @from(Start 2097075, End 2098793)
os0 = z((ss0) => {
  Object.defineProperty(ss0, "__esModule", {
    value: !0
  });
  ss0._makeParamStoreGetter = void 0;
  var as0 = nm(),
    zbA = {
      disableExposureLog: !0
    };

  function UbA(A) {
    return A == null || A.disableExposureLog === !1
  }

  function Kz1(A, Q) {
    return Q != null && !(0, as0._isTypeMatch)(A, Q)
  }

  function sJ4(A, Q) {
    return A.value
  }

  function rJ4(A, Q, B) {
    if (A.getFeatureGate(Q.gate_name, UbA(B) ? void 0 : zbA).value) return Q.pass_value;
    return Q.fail_value
  }

  function oJ4(A, Q, B, G) {
    let I = A.getDynamicConfig(Q.config_name, zbA).get(Q.param_name);
    if (Kz1(I, B)) return B;
    if (UbA(G)) A.getDynamicConfig(Q.config_name);
    return I
  }

  function tJ4(A, Q, B, G) {
    let I = A.getExperiment(Q.experiment_name, zbA).get(Q.param_name);
    if (Kz1(I, B)) return B;
    if (UbA(G)) A.getExperiment(Q.experiment_name);
    return I
  }

  function eJ4(A, Q, B, G) {
    let I = A.getLayer(Q.layer_name, zbA).get(Q.param_name);
    if (Kz1(I, B)) return B;
    if (UbA(G)) A.getLayer(Q.layer_name).get(Q.param_name);
    return I
  }

  function AW4(A, Q, B) {
    return (G, Z) => {
      if (Q == null) return Z;
      let I = Q[G];
      if (I == null || Z != null && (0, as0._typeOf)(Z) !== I.param_type) return Z;
      switch (I.ref_type) {
        case "static":
          return sJ4(I, B);
        case "gate":
          return rJ4(A, I, B);
        case "dynamic_config":
          return oJ4(A, I, Z, B);
        case "experiment":
          return tJ4(A, I, Z, B);
        case "layer":
          return eJ4(A, I, Z, B);
        default:
          return Z
      }
    }
  }
  ss0._makeParamStoreGetter = AW4
})