
// @from(Ln 47789, Col 0)
function DR1(A) {
  if (A.cancelToken) A.cancelToken.throwIfRequested();
  if (A.signal && A.signal.aborted) throw new sw(null, A)
}
// @from(Ln 47794, Col 0)
function wlA(A) {
  if (DR1(A), A.headers = oX.from(A.headers), A.data = vUA.call(A, A.transformRequest), ["post", "put", "patch"].indexOf(A.method) !== -1) A.headers.setContentType("application/x-www-form-urlencoded", !1);
  return NlA.getAdapter(A.adapter || MGA.adapter)(A).then(function (G) {
    return DR1(A), G.data = vUA.call(A, A.transformResponse, G), G.headers = oX.from(G.headers), G
  }, function (G) {
    if (!kUA(G)) {
      if (DR1(A), G && G.response) G.response.data = vUA.call(A, A.transformResponse, G.response), G.response.headers = oX.from(G.response.headers)
    }
    return Promise.reject(G)
  })
}
// @from(Ln 47805, Col 4)
O5Q = w(() => {
  _8Q();
  KlA();
  H1A();
  dy();
  IR1()
})
// @from(Ln 47813, Col 0)
function NZ4(A, Q, B) {
  if (typeof A !== "object") throw new F2("options must be an object", F2.ERR_BAD_OPTION_VALUE);
  let G = Object.keys(A),
    Z = G.length;
  while (Z-- > 0) {
    let Y = G[Z],
      J = Q[Y];
    if (J) {
      let X = A[Y],
        I = X === void 0 || J(X, Y, A);
      if (I !== !0) throw new F2("option " + Y + " must be " + I, F2.ERR_BAD_OPTION_VALUE);
      continue
    }
    if (B !== !0) throw new F2("Unknown option " + Y, F2.ERR_BAD_OPTION)
  }
}
// @from(Ln 47829, Col 4)
LlA
// @from(Ln 47829, Col 9)
M5Q
// @from(Ln 47829, Col 14)
dUA
// @from(Ln 47830, Col 4)
R5Q = w(() => {
  rw();
  LlA = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((A, Q) => {
    LlA[A] = function (G) {
      return typeof G === A || "a" + (Q < 1 ? "n " : " ") + A
    }
  });
  M5Q = {};
  LlA.transitional = function (Q, B, G) {
    function Z(Y, J) {
      return "[Axios v" + C1A + "] Transitional option '" + Y + "'" + J + (G ? ". " + G : "")
    }
    return (Y, J, X) => {
      if (Q === !1) throw new F2(Z(J, " has been removed" + (B ? " in " + B : "")), F2.ERR_DEPRECATED);
      if (B && !M5Q[J]) M5Q[J] = !0, console.warn(Z(J, " has been deprecated since v" + B + " and will be removed in the near future"));
      return Q ? Q(Y, J, X) : !0
    }
  };
  LlA.spelling = function (Q) {
    return (B, G) => {
      return console.warn(`${G} is likely a misspelling of ${Q}`), !0
    }
  };
  dUA = {
    assertOptions: NZ4,
    validators: LlA
  }
})
// @from(Ln 47859, Col 0)
class cUA {
  constructor(A) {
    this.defaults = A, this.interceptors = {
      request: new SM1,
      response: new SM1
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
        } catch (Y) {}
      }
      throw B
    }
  }
  _request(A, Q) {
    if (typeof A === "string") Q = Q || {}, Q.url = A;
    else Q = A || {};
    Q = wT(this.defaults, Q);
    let {
      transitional: B,
      paramsSerializer: G,
      headers: Z
    } = Q;
    if (B !== void 0) dUA.assertOptions(B, {
      silentJSONParsing: py.transitional(py.boolean),
      forcedJSONParsing: py.transitional(py.boolean),
      clarifyTimeoutError: py.transitional(py.boolean)
    }, !1);
    if (G != null)
      if (d1.isFunction(G)) Q.paramsSerializer = {
        serialize: G
      };
      else dUA.assertOptions(G, {
        encode: py.function,
        serialize: py.function
      }, !0);
    if (Q.allowAbsoluteUrls !== void 0);
    else if (this.defaults.allowAbsoluteUrls !== void 0) Q.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    else Q.allowAbsoluteUrls = !0;
    dUA.assertOptions(Q, {
      baseUrl: py.spelling("baseURL"),
      withXsrfToken: py.spelling("withXSRFToken")
    }, !0), Q.method = (Q.method || this.defaults.method || "get").toLowerCase();
    let Y = Z && d1.merge(Z.common, Z[Q.method]);
    Z && d1.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (F) => {
      delete Z[F]
    }), Q.headers = oX.concat(Y, Z);
    let J = [],
      X = !0;
    this.interceptors.request.forEach(function (H) {
      if (typeof H.runWhen === "function" && H.runWhen(Q) === !1) return;
      X = X && H.synchronous, J.unshift(H.fulfilled, H.rejected)
    });
    let I = [];
    this.interceptors.response.forEach(function (H) {
      I.push(H.fulfilled, H.rejected)
    });
    let D, W = 0,
      K;
    if (!X) {
      let F = [wlA.bind(this), void 0];
      F.unshift.apply(F, J), F.push.apply(F, I), K = F.length, D = Promise.resolve(Q);
      while (W < K) D = D.then(F[W++], F[W++]);
      return D
    }
    K = J.length;
    let V = Q;
    W = 0;
    while (W < K) {
      let F = J[W++],
        H = J[W++];
      try {
        V = F(V)
      } catch (E) {
        H.call(this, E);
        break
      }
    }
    try {
      D = wlA.call(this, V)
    } catch (F) {
      return Promise.reject(F)
    }
    W = 0, K = I.length;
    while (W < K) D = D.then(I[W++], I[W++]);
    return D
  }
  getUri(A) {
    A = wT(this.defaults, A);
    let Q = E1A(A.baseURL, A.url, A.allowAbsoluteUrls);
    return F1A(Q, A.params, A.paramsSerializer)
  }
}
// @from(Ln 47962, Col 4)
py
// @from(Ln 47962, Col 8)
pUA
// @from(Ln 47963, Col 4)
_5Q = w(() => {
  aZ();
  IlA();
  E8Q();
  O5Q();
  $lA();
  HlA();
  R5Q();
  dy();
  py = dUA.validators;
  d1.forEach(["delete", "get", "head", "options"], function (Q) {
    cUA.prototype[Q] = function (B, G) {
      return this.request(wT(G || {}, {
        method: Q,
        url: B,
        data: (G || {}).data
      }))
    }
  });
  d1.forEach(["post", "put", "patch"], function (Q) {
    function B(G) {
      return function (Y, J, X) {
        return this.request(wT(X || {}, {
          method: Q,
          headers: G ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: Y,
          data: J
        }))
      }
    }
    cUA.prototype[Q] = B(), cUA.prototype[Q + "Form"] = B(!0)
  });
  pUA = cUA
})
// @from(Ln 47999, Col 0)
class WR1 {
  constructor(A) {
    if (typeof A !== "function") throw TypeError("executor must be a function.");
    let Q;
    this.promise = new Promise(function (Z) {
      Q = Z
    });
    let B = this;
    this.promise.then((G) => {
      if (!B._listeners) return;
      let Z = B._listeners.length;
      while (Z-- > 0) B._listeners[Z](G);
      B._listeners = null
    }), this.promise.then = (G) => {
      let Z, Y = new Promise((J) => {
        B.subscribe(J), Z = J
      }).then(G);
      return Y.cancel = function () {
        B.unsubscribe(Z)
      }, Y
    }, A(function (Z, Y, J) {
      if (B.reason) return;
      B.reason = new sw(Z, Y, J), Q(B.reason)
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
      token: new WR1(function (G) {
        A = G
      }),
      cancel: A
    }
  }
}
// @from(Ln 48057, Col 4)
j5Q
// @from(Ln 48058, Col 4)
T5Q = w(() => {
  H1A();
  j5Q = WR1
})
// @from(Ln 48063, Col 0)
function KR1(A) {
  return function (B) {
    return A.apply(null, B)
  }
}
// @from(Ln 48069, Col 0)
function VR1(A) {
  return d1.isObject(A) && A.isAxiosError === !0
}
// @from(Ln 48072, Col 4)
P5Q = w(() => {
  aZ()
})
// @from(Ln 48075, Col 4)
FR1
// @from(Ln 48075, Col 9)
S5Q
// @from(Ln 48076, Col 4)
x5Q = w(() => {
  FR1 = {
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
  Object.entries(FR1).forEach(([A, Q]) => {
    FR1[Q] = A
  });
  S5Q = FR1
})
// @from(Ln 48148, Col 0)
function y5Q(A) {
  let Q = new pUA(A),
    B = OUA(pUA.prototype.request, Q);
  return d1.extend(B, pUA.prototype, Q, {
    allOwnKeys: !0
  }), d1.extend(B, Q, null, {
    allOwnKeys: !0
  }), B.create = function (Z) {
    return y5Q(wT(A, Z))
  }, B
}
// @from(Ln 48159, Col 4)
_W
// @from(Ln 48159, Col 8)
xQ
// @from(Ln 48160, Col 4)
v5Q = w(() => {
  aZ();
  _5Q();
  $lA();
  KlA();
  fM1();
  H1A();
  T5Q();
  SUA();
  rw();
  P5Q();
  dy();
  IR1();
  x5Q();
  _W = y5Q(MGA);
  _W.Axios = pUA;
  _W.CanceledError = sw;
  _W.CancelToken = j5Q;
  _W.isCancel = kUA;
  _W.VERSION = C1A;
  _W.toFormData = Fi;
  _W.AxiosError = F2;
  _W.Cancel = _W.CanceledError;
  _W.all = function (Q) {
    return Promise.all(Q)
  };
  _W.spread = KR1;
  _W.isAxiosError = VR1;
  _W.mergeConfig = wT;
  _W.AxiosHeaders = oX;
  _W.formToJSON = (A) => WlA(d1.isHTMLForm(A) ? new FormData(A) : A);
  _W.getAdapter = NlA.getAdapter;
  _W.HttpStatusCode = S5Q;
  _W.default = _W;
  xQ = _W
})
// @from(Ln 48196, Col 4)
iQG
// @from(Ln 48196, Col 9)
k5Q
// @from(Ln 48196, Col 14)
nQG
// @from(Ln 48196, Col 19)
aQG
// @from(Ln 48196, Col 24)
oQG
// @from(Ln 48196, Col 29)
rQG
// @from(Ln 48196, Col 34)
sQG
// @from(Ln 48196, Col 39)
tQG
// @from(Ln 48196, Col 44)
eQG
// @from(Ln 48196, Col 49)
ABG
// @from(Ln 48196, Col 54)
QBG
// @from(Ln 48196, Col 59)
BBG
// @from(Ln 48196, Col 64)
GBG
// @from(Ln 48196, Col 69)
ZBG
// @from(Ln 48196, Col 74)
YBG
// @from(Ln 48196, Col 79)
JBG
// @from(Ln 48197, Col 4)
j5 = w(() => {
  v5Q();
  ({
    Axios: iQG,
    AxiosError: k5Q,
    CanceledError: nQG,
    isCancel: aQG,
    CancelToken: oQG,
    VERSION: rQG,
    all: sQG,
    Cancel: tQG,
    isAxiosError: eQG,
    spread: ABG,
    toFormData: QBG,
    AxiosHeaders: BBG,
    HttpStatusCode: GBG,
    formToJSON: ZBG,
    getAdapter: YBG,
    mergeConfig: JBG
  } = xQ)
})
// @from(Ln 48219, Col 0)
function f5Q() {
  return "prod"
}
// @from(Ln 48223, Col 0)
function h5Q() {
  switch (f5Q()) {
    case "local":
      return "-local-oauth";
    case "staging":
      return "-staging-oauth";
    case "prod":
      return ""
  }
}
// @from(Ln 48234, Col 0)
function v9() {
  let A = (() => {
      switch (f5Q()) {
        case "local":
          return MZ4;
        case "staging":
          return OZ4 ?? b5Q;
        case "prod":
          return b5Q
      }
    })(),
    Q = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
  if (Q) return {
    ...A,
    CLIENT_ID: Q
  };
  return A
}
// @from(Ln 48252, Col 4)
PGA = "user:inference"
// @from(Ln 48253, Col 2)
wZ4 = "org:create_api_key"
// @from(Ln 48254, Col 2)
zi = "oauth-2025-04-20"
// @from(Ln 48255, Col 2)
LZ4
// @from(Ln 48255, Col 7)
HR1
// @from(Ln 48255, Col 12)
g5Q
// @from(Ln 48255, Col 17)
b5Q
// @from(Ln 48255, Col 22)
OZ4 = void 0
// @from(Ln 48256, Col 2)
MZ4
// @from(Ln 48257, Col 4)
JX = w(() => {
  fQ();
  LZ4 = [wZ4, "user:profile"], HR1 = ["user:profile", PGA, "user:sessions:claude_code", ...[]], g5Q = Array.from(new Set([...LZ4, ...HR1])), b5Q = {
    BASE_API_URL: "https://api.anthropic.com",
    CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
    CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
    TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
    API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
    ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
    CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
    CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",
    MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",
    CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
    OAUTH_FILE_SUFFIX: "",
    MCP_PROXY_URL: void 0,
    MCP_PROXY_PATH: void 0
  }, MZ4 = {
    BASE_API_URL: "http://localhost:3000",
    CONSOLE_AUTHORIZE_URL: "http://localhost:3000/oauth/authorize",
    CLAUDE_AI_AUTHORIZE_URL: "http://localhost:4000/oauth/authorize",
    TOKEN_URL: "http://localhost:3000/v1/oauth/token",
    API_KEY_URL: "http://localhost:3000/api/oauth/claude_cli/create_api_key",
    ROLES_URL: "http://localhost:3000/api/oauth/claude_cli/roles",
    CONSOLE_SUCCESS_URL: "http://localhost:3000/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
    CLAUDEAI_SUCCESS_URL: "http://localhost:3000/oauth/code/success?app=claude-code",
    MANUAL_REDIRECT_URL: "https://console.staging.ant.dev/oauth/code/callback",
    CLIENT_ID: "22422756-60c9-4084-8eb7-27705fd5cf9a",
    OAUTH_FILE_SUFFIX: "-local-oauth",
    MCP_PROXY_URL: "http://localhost:8205",
    MCP_PROXY_PATH: "/v1/toolbox/shttp/mcp/{server_id}"
  }
})
// @from(Ln 48302, Col 0)
function wH() {
  if (vA().existsSync(ER1(zQ(), ".config.json"))) return ER1(zQ(), ".config.json");
  let A = `.claude${h5Q()}.json`;
  return ER1(process.env.CLAUDE_CONFIG_DIR || _Z4(), A)
}
// @from(Ln 48307, Col 0)
async function SGA(A) {
  try {
    let {
      cmd: Q
    } = zR1.findActualExecutable(A, []);
    try {
      return RZ4(Q, u5Q.F_OK | u5Q.X_OK), !0
    } catch {
      return !1
    }
  } catch {
    return !1
  }
}
// @from(Ln 48322, Col 0)
function yZ4() {
  if (process.env.CURSOR_TRACE_ID) return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("/.cursor-server/")) return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("/.windsurf-server/")) return "windsurf";
  let A = process.env.__CFBundleIdentifier?.toLowerCase();
  if (A?.includes("vscodium")) return "codium";
  if (A?.includes("windsurf")) return "windsurf";
  if (A?.includes("com.google.android.studio")) return "androidstudio";
  if (A) {
    for (let Q of $R1)
      if (A.includes(Q)) return Q
  }
  if (process.env.VisualStudioVersion) return "visualstudio";
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (process.platform === "darwin") return "pycharm";
    return "pycharm"
  }
  if (process.env.TERM === "xterm-ghostty") return "ghostty";
  if (process.env.TERM?.includes("kitty")) return "kitty";
  if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM;
  if (process.env.TMUX) return "tmux";
  if (process.env.STY) return "screen";
  if (process.env.KONSOLE_VERSION) return "konsole";
  if (process.env.GNOME_TERMINAL_SERVICE) return "gnome-terminal";
  if (process.env.XTERM_VERSION) return "xterm";
  if (process.env.VTE_VERSION) return "vte-based";
  if (process.env.TERMINATOR_UUID) return "terminator";
  if (process.env.KITTY_WINDOW_ID) return "kitty";
  if (process.env.ALACRITTY_LOG) return "alacritty";
  if (process.env.TILIX_ID) return "tilix";
  if (process.env.WT_SESSION) return "windows-terminal";
  if (process.env.SESSIONNAME && process.env.TERM === "cygwin") return "cygwin";
  if (process.env.MSYSTEM) return process.env.MSYSTEM.toLowerCase();
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return "conemu";
  if (process.env.WSL_DISTRO_NAME) return `wsl-${process.env.WSL_DISTRO_NAME}`;
  if (d5Q()) return "ssh-session";
  if (process.env.TERM) {
    let Q = process.env.TERM;
    if (Q.includes("alacritty")) return "alacritty";
    if (Q.includes("rxvt")) return "rxvt";
    if (Q.includes("termite")) return "termite";
    return process.env.TERM
  }
  if (!process.stdout.isTTY) return "non-interactive";
  return null
}
// @from(Ln 48369, Col 0)
function d5Q() {
  return !!(process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY)
}
// @from(Ln 48372, Col 4)
zR1
// @from(Ln 48372, Col 9)
jZ4
// @from(Ln 48372, Col 14)
TZ4
// @from(Ln 48372, Col 19)
PZ4
// @from(Ln 48372, Col 24)
m5Q
// @from(Ln 48372, Col 29)
SZ4
// @from(Ln 48372, Col 34)
xZ4 = () => {
    return process.env.__CFBundleIdentifier === "com.conductor.app"
  }
// @from(Ln 48375, Col 2)
$R1
// @from(Ln 48375, Col 7)
vZ4
// @from(Ln 48375, Col 12)
l0
// @from(Ln 48376, Col 4)
p3 = w(() => {
  Y9();
  j5();
  DQ();
  iZ();
  fQ();
  JX();
  zR1 = c(dcA(), 1);
  jZ4 = W0(async () => {
    try {
      let A = c9(),
        Q = setTimeout(() => A.abort(), 1000);
      return await xQ.head("http://1.1.1.1", {
        signal: A.signal
      }), clearTimeout(Q), !0
    } catch {
      return !1
    }
  });
  TZ4 = W0(async () => {
    let A = [];
    if (await SGA("npm")) A.push("npm");
    if (await SGA("yarn")) A.push("yarn");
    if (await SGA("pnpm")) A.push("pnpm");
    return A
  }), PZ4 = W0(async () => {
    let A = [];
    if (await SGA("bun")) A.push("bun");
    if (await SGA("deno")) A.push("deno");
    if (await SGA("node")) A.push("node");
    return A
  }), m5Q = W0(() => {
    try {
      return vA().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")
    } catch (A) {
      return !1
    }
  }), SZ4 = W0(() => {
    try {
      if (!m5Q()) return !1;
      let {
        cmd: A
      } = zR1.findActualExecutable("npm", []);
      return A.startsWith("/mnt/c/")
    } catch (A) {
      return !1
    }
  }), $R1 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];
  vZ4 = W0(() => {
    if (process.env.CODESPACES === "true") return "codespaces";
    if (process.env.GITPOD_WORKSPACE_ID) return "gitpod";
    if (process.env.REPL_ID || process.env.REPL_SLUG) return "replit";
    if (process.env.PROJECT_DOMAIN) return "glitch";
    if (process.env.VERCEL === "1") return "vercel";
    if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME) return "railway";
    if (process.env.RENDER === "true") return "render";
    if (process.env.NETLIFY === "true") return "netlify";
    if (process.env.DYNO) return "heroku";
    if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID) return "fly.io";
    if (process.env.CF_PAGES === "1") return "cloudflare-pages";
    if (process.env.DENO_DEPLOYMENT_ID) return "deno-deploy";
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws-lambda";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE") return "aws-fargate";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2") return "aws-ecs";
    try {
      if (vA().existsSync("/sys/hypervisor/uuid")) {
        if (vA().readFileSync("/sys/hypervisor/uuid", {
            encoding: "utf8"
          }).trim().toLowerCase().startsWith("ec2")) return "aws-ec2"
      }
    } catch {}
    if (process.env.K_SERVICE) return "gcp-cloud-run";
    if (process.env.GOOGLE_CLOUD_PROJECT) return "gcp";
    if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU) return "azure-app-service";
    if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) return "azure-functions";
    if (process.env.APP_URL?.includes("ondigitalocean.app")) return "digitalocean-app-platform";
    if (process.env.SPACE_CREATOR_USER_ID) return "huggingface-spaces";
    if (process.env.GITHUB_ACTIONS === "true") return "github-actions";
    if (process.env.GITLAB_CI === "true") return "gitlab-ci";
    if (process.env.CIRCLECI) return "circleci";
    if (process.env.BUILDKITE) return "buildkite";
    if (a1(!1)) return "ci";
    if (process.env.KUBERNETES_SERVICE_HOST) return "kubernetes";
    try {
      if (vA().existsSync("/.dockerenv")) return "docker"
    } catch {}
    if (l0.platform === "darwin") return "unknown-darwin";
    if (l0.platform === "linux") return "unknown-linux";
    if (l0.platform === "win32") return "unknown-win32";
    return "unknown"
  });
  l0 = {
    hasInternetAccess: jZ4,
    isCI: a1(!1),
    platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
    arch: process.arch,
    nodeVersion: process.version,
    terminal: yZ4(),
    isSSH: d5Q,
    getPackageManagers: TZ4,
    getRuntimes: PZ4,
    isRunningWithBun: W0(G1A),
    isWslEnvironment: m5Q,
    isNpmFromWindowsPath: SZ4,
    isConductor: xZ4,
    detectDeploymentEnvironment: vZ4
  }
})
// @from(Ln 48485, Col 0)
function iUA(A, Q = !1) {
  let B = A.length,
    G = 0,
    Z = "",
    Y = 0,
    J = 16,
    X = 0,
    I = 0,
    D = 0,
    W = 0,
    K = 0;

  function V(L, M) {
    let _ = 0,
      j = 0;
    while (_ < L || !M) {
      let x = A.charCodeAt(G);
      if (x >= 48 && x <= 57) j = j * 16 + x - 48;
      else if (x >= 65 && x <= 70) j = j * 16 + x - 65 + 10;
      else if (x >= 97 && x <= 102) j = j * 16 + x - 97 + 10;
      else break;
      G++, _++
    }
    if (_ < L) j = -1;
    return j
  }

  function F(L) {
    G = L, Z = "", Y = 0, J = 16, K = 0
  }

  function H() {
    let L = G;
    if (A.charCodeAt(G) === 48) G++;
    else {
      G++;
      while (G < A.length && xGA(A.charCodeAt(G))) G++
    }
    if (G < A.length && A.charCodeAt(G) === 46)
      if (G++, G < A.length && xGA(A.charCodeAt(G))) {
        G++;
        while (G < A.length && xGA(A.charCodeAt(G))) G++
      } else return K = 3, A.substring(L, G);
    let M = G;
    if (G < A.length && (A.charCodeAt(G) === 69 || A.charCodeAt(G) === 101)) {
      if (G++, G < A.length && A.charCodeAt(G) === 43 || A.charCodeAt(G) === 45) G++;
      if (G < A.length && xGA(A.charCodeAt(G))) {
        G++;
        while (G < A.length && xGA(A.charCodeAt(G))) G++;
        M = G
      } else K = 3
    }
    return A.substring(L, M)
  }

  function E() {
    let L = "",
      M = G;
    while (!0) {
      if (G >= B) {
        L += A.substring(M, G), K = 2;
        break
      }
      let _ = A.charCodeAt(G);
      if (_ === 34) {
        L += A.substring(M, G), G++;
        break
      }
      if (_ === 92) {
        if (L += A.substring(M, G), G++, G >= B) {
          K = 2;
          break
        }
        switch (A.charCodeAt(G++)) {
          case 34:
            L += '"';
            break;
          case 92:
            L += "\\";
            break;
          case 47:
            L += "/";
            break;
          case 98:
            L += "\b";
            break;
          case 102:
            L += "\f";
            break;
          case 110:
            L += `
`;
            break;
          case 114:
            L += "\r";
            break;
          case 116:
            L += "\t";
            break;
          case 117:
            let x = V(4, !0);
            if (x >= 0) L += String.fromCharCode(x);
            else K = 4;
            break;
          default:
            K = 5
        }
        M = G;
        continue
      }
      if (_ >= 0 && _ <= 31)
        if (lUA(_)) {
          L += A.substring(M, G), K = 2;
          break
        } else K = 6;
      G++
    }
    return L
  }

  function z() {
    if (Z = "", K = 0, Y = G, I = X, W = D, G >= B) return Y = B, J = 17;
    let L = A.charCodeAt(G);
    if (CR1(L)) {
      do G++, Z += String.fromCharCode(L), L = A.charCodeAt(G); while (CR1(L));
      return J = 15
    }
    if (lUA(L)) {
      if (G++, Z += String.fromCharCode(L), L === 13 && A.charCodeAt(G) === 10) G++, Z += `
`;
      return X++, D = G, J = 14
    }
    switch (L) {
      case 123:
        return G++, J = 1;
      case 125:
        return G++, J = 2;
      case 91:
        return G++, J = 3;
      case 93:
        return G++, J = 4;
      case 58:
        return G++, J = 6;
      case 44:
        return G++, J = 5;
      case 34:
        return G++, Z = E(), J = 10;
      case 47:
        let M = G - 1;
        if (A.charCodeAt(G + 1) === 47) {
          G += 2;
          while (G < B) {
            if (lUA(A.charCodeAt(G))) break;
            G++
          }
          return Z = A.substring(M, G), J = 12
        }
        if (A.charCodeAt(G + 1) === 42) {
          G += 2;
          let _ = B - 1,
            j = !1;
          while (G < _) {
            let x = A.charCodeAt(G);
            if (x === 42 && A.charCodeAt(G + 1) === 47) {
              G += 2, j = !0;
              break
            }
            if (G++, lUA(x)) {
              if (x === 13 && A.charCodeAt(G) === 10) G++;
              X++, D = G
            }
          }
          if (!j) G++, K = 1;
          return Z = A.substring(M, G), J = 13
        }
        return Z += String.fromCharCode(L), G++, J = 16;
      case 45:
        if (Z += String.fromCharCode(L), G++, G === B || !xGA(A.charCodeAt(G))) return J = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return Z += H(), J = 11;
      default:
        while (G < B && $(L)) G++, L = A.charCodeAt(G);
        if (Y !== G) {
          switch (Z = A.substring(Y, G), Z) {
            case "true":
              return J = 8;
            case "false":
              return J = 9;
            case "null":
              return J = 7
          }
          return J = 16
        }
        return Z += String.fromCharCode(L), G++, J = 16
    }
  }

  function $(L) {
    if (CR1(L) || lUA(L)) return !1;
    switch (L) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return !1
    }
    return !0
  }

  function O() {
    let L;
    do L = z(); while (L >= 12 && L <= 15);
    return L
  }
  return {
    setPosition: F,
    getPosition: () => G,
    scan: Q ? O : z,
    getToken: () => J,
    getTokenValue: () => Z,
    getTokenOffset: () => Y,
    getTokenLength: () => G - Y,
    getTokenStartLine: () => I,
    getTokenStartCharacter: () => Y - W,
    getTokenError: () => K
  }
}
// @from(Ln 48726, Col 0)
function CR1(A) {
  return A === 32 || A === 9
}
// @from(Ln 48730, Col 0)
function lUA(A) {
  return A === 10 || A === 13
}
// @from(Ln 48734, Col 0)
function xGA(A) {
  return A >= 48 && A <= 57
}
// @from(Ln 48737, Col 4)
c5Q
// @from(Ln 48738, Col 4)
OlA = w(() => {
  (function (A) {
    A[A.lineFeed = 10] = "lineFeed", A[A.carriageReturn = 13] = "carriageReturn", A[A.space = 32] = "space", A[A._0 = 48] = "_0", A[A._1 = 49] = "_1", A[A._2 = 50] = "_2", A[A._3 = 51] = "_3", A[A._4 = 52] = "_4", A[A._5 = 53] = "_5", A[A._6 = 54] = "_6", A[A._7 = 55] = "_7", A[A._8 = 56] = "_8", A[A._9 = 57] = "_9", A[A.a = 97] = "a", A[A.b = 98] = "b", A[A.c = 99] = "c", A[A.d = 100] = "d", A[A.e = 101] = "e", A[A.f = 102] = "f", A[A.g = 103] = "g", A[A.h = 104] = "h", A[A.i = 105] = "i", A[A.j = 106] = "j", A[A.k = 107] = "k", A[A.l = 108] = "l", A[A.m = 109] = "m", A[A.n = 110] = "n", A[A.o = 111] = "o", A[A.p = 112] = "p", A[A.q = 113] = "q", A[A.r = 114] = "r", A[A.s = 115] = "s", A[A.t = 116] = "t", A[A.u = 117] = "u", A[A.v = 118] = "v", A[A.w = 119] = "w", A[A.x = 120] = "x", A[A.y = 121] = "y", A[A.z = 122] = "z", A[A.A = 65] = "A", A[A.B = 66] = "B", A[A.C = 67] = "C", A[A.D = 68] = "D", A[A.E = 69] = "E", A[A.F = 70] = "F", A[A.G = 71] = "G", A[A.H = 72] = "H", A[A.I = 73] = "I", A[A.J = 74] = "J", A[A.K = 75] = "K", A[A.L = 76] = "L", A[A.M = 77] = "M", A[A.N = 78] = "N", A[A.O = 79] = "O", A[A.P = 80] = "P", A[A.Q = 81] = "Q", A[A.R = 82] = "R", A[A.S = 83] = "S", A[A.T = 84] = "T", A[A.U = 85] = "U", A[A.V = 86] = "V", A[A.W = 87] = "W", A[A.X = 88] = "X", A[A.Y = 89] = "Y", A[A.Z = 90] = "Z", A[A.asterisk = 42] = "asterisk", A[A.backslash = 92] = "backslash", A[A.closeBrace = 125] = "closeBrace", A[A.closeBracket = 93] = "closeBracket", A[A.colon = 58] = "colon", A[A.comma = 44] = "comma", A[A.dot = 46] = "dot", A[A.doubleQuote = 34] = "doubleQuote", A[A.minus = 45] = "minus", A[A.openBrace = 123] = "openBrace", A[A.openBracket = 91] = "openBracket", A[A.plus = 43] = "plus", A[A.slash = 47] = "slash", A[A.formFeed = 12] = "formFeed", A[A.tab = 9] = "tab"
  })(c5Q || (c5Q = {}))
})
// @from(Ln 48743, Col 4)
tw
// @from(Ln 48743, Col 8)
UR1
// @from(Ln 48743, Col 13)
p5Q
// @from(Ln 48744, Col 4)
l5Q = w(() => {
  tw = Array(20).fill(0).map((A, Q) => {
    return " ".repeat(Q)
  }), UR1 = {
    " ": {
      "\n": Array(200).fill(0).map((A, Q) => {
        return `
` + " ".repeat(Q)
      }),
      "\r": Array(200).fill(0).map((A, Q) => {
        return "\r" + " ".repeat(Q)
      }),
      "\r\n": Array(200).fill(0).map((A, Q) => {
        return `\r
` + " ".repeat(Q)
      })
    },
    "\t": {
      "\n": Array(200).fill(0).map((A, Q) => {
        return `
` + "\t".repeat(Q)
      }),
      "\r": Array(200).fill(0).map((A, Q) => {
        return "\r" + "\t".repeat(Q)
      }),
      "\r\n": Array(200).fill(0).map((A, Q) => {
        return `\r
` + "\t".repeat(Q)
      })
    }
  }, p5Q = [`
`, "\r", `\r
`]
})
// @from(Ln 48779, Col 0)
function qR1(A, Q, B) {
  let G, Z, Y, J, X;
  if (Q) {
    J = Q.offset, X = J + Q.length, Y = J;
    while (Y > 0 && !nUA(A, Y - 1)) Y--;
    let _ = X;
    while (_ < A.length && !nUA(A, _)) _++;
    Z = A.substring(Y, _), G = bZ4(Z, B)
  } else Z = A, G = 0, Y = 0, J = 0, X = A.length;
  let I = fZ4(B, A),
    D = p5Q.includes(I),
    W = 0,
    K = 0,
    V;
  if (B.insertSpaces) V = tw[B.tabSize || 4] ?? yGA(tw[1], B.tabSize || 4);
  else V = "\t";
  let F = V === "\t" ? "\t" : " ",
    H = iUA(Z, !1),
    E = !1;

  function z() {
    if (W > 1) return yGA(I, W) + yGA(V, G + K);
    let _ = V.length * (G + K);
    if (!D || _ > UR1[F][I].length) return I + yGA(V, G + K);
    if (_ <= 0) return I;
    return UR1[F][I][_]
  }

  function $() {
    let _ = H.scan();
    W = 0;
    while (_ === 15 || _ === 14) {
      if (_ === 14 && B.keepLines) W += 1;
      else if (_ === 14) W = 1;
      _ = H.scan()
    }
    return E = _ === 16 || H.getTokenError() !== 0, _
  }
  let O = [];

  function L(_, j, x) {
    if (!E && (!Q || j < X && x > J) && A.substring(j, x) !== _) O.push({
      offset: j,
      length: x - j,
      content: _
    })
  }
  let M = $();
  if (B.keepLines && W > 0) L(yGA(I, W), 0, 0);
  if (M !== 17) {
    let _ = H.getTokenOffset() + Y,
      j = V.length * G < 20 && B.insertSpaces ? tw[V.length * G] : yGA(V, G);
    L(j, Y, _)
  }
  while (M !== 17) {
    let _ = H.getTokenOffset() + H.getTokenLength() + Y,
      j = $(),
      x = "",
      b = !1;
    while (W === 0 && (j === 12 || j === 13)) {
      let u = H.getTokenOffset() + Y;
      L(tw[1], _, u), _ = H.getTokenOffset() + H.getTokenLength() + Y, b = j === 12, x = b ? z() : "", j = $()
    }
    if (j === 2) {
      if (M !== 1) K--;
      if (B.keepLines && W > 0 || !B.keepLines && M !== 1) x = z();
      else if (B.keepLines) x = tw[1]
    } else if (j === 4) {
      if (M !== 3) K--;
      if (B.keepLines && W > 0 || !B.keepLines && M !== 3) x = z();
      else if (B.keepLines) x = tw[1]
    } else {
      switch (M) {
        case 3:
        case 1:
          if (K++, B.keepLines && W > 0 || !B.keepLines) x = z();
          else x = tw[1];
          break;
        case 5:
          if (B.keepLines && W > 0 || !B.keepLines) x = z();
          else x = tw[1];
          break;
        case 12:
          x = z();
          break;
        case 13:
          if (W > 0) x = z();
          else if (!b) x = tw[1];
          break;
        case 6:
          if (B.keepLines && W > 0) x = z();
          else if (!b) x = tw[1];
          break;
        case 10:
          if (B.keepLines && W > 0) x = z();
          else if (j === 6 && !b) x = "";
          break;
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (B.keepLines && W > 0) x = z();
          else if ((j === 12 || j === 13) && !b) x = tw[1];
          else if (j !== 5 && j !== 17) E = !0;
          break;
        case 16:
          E = !0;
          break
      }
      if (W > 0 && (j === 12 || j === 13)) x = z()
    }
    if (j === 17)
      if (B.keepLines && W > 0) x = z();
      else x = B.insertFinalNewline ? I : "";
    let S = H.getTokenOffset() + Y;
    L(x, _, S), M = j
  }
  return O
}
// @from(Ln 48901, Col 0)
function yGA(A, Q) {
  let B = "";
  for (let G = 0; G < Q; G++) B += A;
  return B
}
// @from(Ln 48907, Col 0)
function bZ4(A, Q) {
  let B = 0,
    G = 0,
    Z = Q.tabSize || 4;
  while (B < A.length) {
    let Y = A.charAt(B);
    if (Y === tw[1]) G++;
    else if (Y === "\t") G += Z;
    else break;
    B++
  }
  return Math.floor(G / Z)
}
// @from(Ln 48921, Col 0)
function fZ4(A, Q) {
  for (let B = 0; B < Q.length; B++) {
    let G = Q.charAt(B);
    if (G === "\r") {
      if (B + 1 < Q.length && Q.charAt(B + 1) === `
`) return `\r
`;
      return "\r"
    } else if (G === `
`) return `
`
  }
  return A && A.eol || `
`
}
// @from(Ln 48937, Col 0)
function nUA(A, Q) {
  return `\r
`.indexOf(A.charAt(Q)) !== -1
}
// @from(Ln 48941, Col 4)
NR1 = w(() => {
  OlA();
  l5Q()
})
// @from(Ln 48946, Col 0)
function i5Q(A, Q = [], B = aUA.DEFAULT) {
  let G = null,
    Z = [],
    Y = [];

  function J(I) {
    if (Array.isArray(Z)) Z.push(I);
    else if (G !== null) Z[G] = I
  }
  return LR1(A, {
    onObjectBegin: () => {
      let I = {};
      J(I), Y.push(Z), Z = I, G = null
    },
    onObjectProperty: (I) => {
      G = I
    },
    onObjectEnd: () => {
      Z = Y.pop()
    },
    onArrayBegin: () => {
      let I = [];
      J(I), Y.push(Z), Z = I, G = null
    },
    onArrayEnd: () => {
      Z = Y.pop()
    },
    onLiteralValue: J,
    onError: (I, D, W) => {
      Q.push({
        error: I,
        offset: D,
        length: W
      })
    }
  }, B), Z[0]
}
// @from(Ln 48984, Col 0)
function wR1(A, Q = [], B = aUA.DEFAULT) {
  let G = {
    type: "array",
    offset: -1,
    length: -1,
    children: [],
    parent: void 0
  };

  function Z(I) {
    if (G.type === "property") G.length = I - G.offset, G = G.parent
  }

  function Y(I) {
    return G.children.push(I), I
  }
  LR1(A, {
    onObjectBegin: (I) => {
      G = Y({
        type: "object",
        offset: I,
        length: -1,
        parent: G,
        children: []
      })
    },
    onObjectProperty: (I, D, W) => {
      G = Y({
        type: "property",
        offset: D,
        length: -1,
        parent: G,
        children: []
      }), G.children.push({
        type: "string",
        value: I,
        offset: D,
        length: W,
        parent: G
      })
    },
    onObjectEnd: (I, D) => {
      Z(I + D), G.length = I + D - G.offset, G = G.parent, Z(I + D)
    },
    onArrayBegin: (I, D) => {
      G = Y({
        type: "array",
        offset: I,
        length: -1,
        parent: G,
        children: []
      })
    },
    onArrayEnd: (I, D) => {
      G.length = I + D - G.offset, G = G.parent, Z(I + D)
    },
    onLiteralValue: (I, D, W) => {
      Y({
        type: gZ4(I),
        offset: D,
        length: W,
        parent: G,
        value: I
      }), Z(D + W)
    },
    onSeparator: (I, D, W) => {
      if (G.type === "property") {
        if (I === ":") G.colonOffset = D;
        else if (I === ",") Z(D)
      }
    },
    onError: (I, D, W) => {
      Q.push({
        error: I,
        offset: D,
        length: W
      })
    }
  }, B);
  let X = G.children[0];
  if (X) delete X.parent;
  return X
}
// @from(Ln 49068, Col 0)
function MlA(A, Q) {
  if (!A) return;
  let B = A;
  for (let G of Q)
    if (typeof G === "string") {
      if (B.type !== "object" || !Array.isArray(B.children)) return;
      let Z = !1;
      for (let Y of B.children)
        if (Array.isArray(Y.children) && Y.children[0].value === G && Y.children.length === 2) {
          B = Y.children[1], Z = !0;
          break
        } if (!Z) return
    } else {
      let Z = G;
      if (B.type !== "array" || Z < 0 || !Array.isArray(B.children) || Z >= B.children.length) return;
      B = B.children[Z]
    } return B
}
// @from(Ln 49087, Col 0)
function LR1(A, Q, B = aUA.DEFAULT) {
  let G = iUA(A, !1),
    Z = [];

  function Y(AA) {
    return AA ? () => AA(G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter()) : () => !0
  }

  function J(AA) {
    return AA ? () => AA(G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter(), () => Z.slice()) : () => !0
  }

  function X(AA) {
    return AA ? (n) => AA(n, G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter()) : () => !0
  }

  function I(AA) {
    return AA ? (n) => AA(n, G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter(), () => Z.slice()) : () => !0
  }
  let D = J(Q.onObjectBegin),
    W = I(Q.onObjectProperty),
    K = Y(Q.onObjectEnd),
    V = J(Q.onArrayBegin),
    F = Y(Q.onArrayEnd),
    H = I(Q.onLiteralValue),
    E = X(Q.onSeparator),
    z = Y(Q.onComment),
    $ = X(Q.onError),
    O = B && B.disallowComments,
    L = B && B.allowTrailingComma;

  function M() {
    while (!0) {
      let AA = G.scan();
      switch (G.getTokenError()) {
        case 4:
          _(14);
          break;
        case 5:
          _(15);
          break;
        case 3:
          _(13);
          break;
        case 1:
          if (!O) _(11);
          break;
        case 2:
          _(12);
          break;
        case 6:
          _(16);
          break
      }
      switch (AA) {
        case 12:
        case 13:
          if (O) _(10);
          else z();
          break;
        case 16:
          _(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return AA
      }
    }
  }

  function _(AA, n = [], y = []) {
    if ($(AA), n.length + y.length > 0) {
      let p = G.getToken();
      while (p !== 17) {
        if (n.indexOf(p) !== -1) {
          M();
          break
        } else if (y.indexOf(p) !== -1) break;
        p = M()
      }
    }
  }

  function j(AA) {
    let n = G.getTokenValue();
    if (AA) H(n);
    else W(n), Z.push(n);
    return M(), !0
  }

  function x() {
    switch (G.getToken()) {
      case 11:
        let AA = G.getTokenValue(),
          n = Number(AA);
        if (isNaN(n)) _(2), n = 0;
        H(n);
        break;
      case 7:
        H(null);
        break;
      case 8:
        H(!0);
        break;
      case 9:
        H(!1);
        break;
      default:
        return !1
    }
    return M(), !0
  }

  function b() {
    if (G.getToken() !== 10) return _(3, [], [2, 5]), !1;
    if (j(!1), G.getToken() === 6) {
      if (E(":"), M(), !f()) _(4, [], [2, 5])
    } else _(5, [], [2, 5]);
    return Z.pop(), !0
  }

  function S() {
    D(), M();
    let AA = !1;
    while (G.getToken() !== 2 && G.getToken() !== 17) {
      if (G.getToken() === 5) {
        if (!AA) _(4, [], []);
        if (E(","), M(), G.getToken() === 2 && L) break
      } else if (AA) _(6, [], []);
      if (!b()) _(4, [], [2, 5]);
      AA = !0
    }
    if (K(), G.getToken() !== 2) _(7, [2], []);
    else M();
    return !0
  }

  function u() {
    V(), M();
    let AA = !0,
      n = !1;
    while (G.getToken() !== 4 && G.getToken() !== 17) {
      if (G.getToken() === 5) {
        if (!n) _(4, [], []);
        if (E(","), M(), G.getToken() === 4 && L) break
      } else if (n) _(6, [], []);
      if (AA) Z.push(0), AA = !1;
      else Z[Z.length - 1]++;
      if (!f()) _(4, [], [4, 5]);
      n = !0
    }
    if (F(), !AA) Z.pop();
    if (G.getToken() !== 4) _(8, [4], []);
    else M();
    return !0
  }

  function f() {
    switch (G.getToken()) {
      case 3:
        return u();
      case 1:
        return S();
      case 10:
        return j(!0);
      default:
        return x()
    }
  }
  if (M(), G.getToken() === 17) {
    if (B.allowEmptyContent) return !0;
    return _(4, [], []), !1
  }
  if (!f()) return _(4, [], []), !1;
  if (G.getToken() !== 17) _(9, [], []);
  return !0
}
// @from(Ln 49267, Col 0)
function gZ4(A) {
  switch (typeof A) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!A) return "null";
      else if (Array.isArray(A)) return "array";
      return "object"
    }
    default:
      return "null"
  }
}
// @from(Ln 49284, Col 4)
aUA
// @from(Ln 49285, Col 4)
OR1 = w(() => {
  OlA();
  (function (A) {
    A.DEFAULT = {
      allowTrailingComma: !1
    }
  })(aUA || (aUA = {}))
})
// @from(Ln 49294, Col 0)
function n5Q(A, Q, B, G) {
  let Z = Q.slice(),
    J = wR1(A, []),
    X = void 0,
    I = void 0;
  while (Z.length > 0)
    if (I = Z.pop(), X = MlA(J, Z), X === void 0 && B !== void 0)
      if (typeof I === "string") B = {
        [I]: B
      };
      else B = [B];
  else break;
  if (!X) {
    if (B === void 0) throw Error("Can not delete in empty document");
    return U1A(A, {
      offset: J ? J.offset : 0,
      length: J ? J.length : 0,
      content: JSON.stringify(B)
    }, G)
  } else if (X.type === "object" && typeof I === "string" && Array.isArray(X.children)) {
    let D = MlA(X, [I]);
    if (D !== void 0)
      if (B === void 0) {
        if (!D.parent) throw Error("Malformed AST");
        let W = X.children.indexOf(D.parent),
          K, V = D.parent.offset + D.parent.length;
        if (W > 0) {
          let F = X.children[W - 1];
          K = F.offset + F.length
        } else if (K = X.offset + 1, X.children.length > 1) V = X.children[1].offset;
        return U1A(A, {
          offset: K,
          length: V - K,
          content: ""
        }, G)
      } else return U1A(A, {
        offset: D.offset,
        length: D.length,
        content: JSON.stringify(B)
      }, G);
    else {
      if (B === void 0) return [];
      let W = `${JSON.stringify(I)}: ${JSON.stringify(B)}`,
        K = G.getInsertionIndex ? G.getInsertionIndex(X.children.map((F) => F.children[0].value)) : X.children.length,
        V;
      if (K > 0) {
        let F = X.children[K - 1];
        V = {
          offset: F.offset + F.length,
          length: 0,
          content: "," + W
        }
      } else if (X.children.length === 0) V = {
        offset: X.offset + 1,
        length: 0,
        content: W
      };
      else V = {
        offset: X.offset + 1,
        length: 0,
        content: W + ","
      };
      return U1A(A, V, G)
    }
  } else if (X.type === "array" && typeof I === "number" && Array.isArray(X.children)) {
    let D = I;
    if (D === -1) {
      let W = `${JSON.stringify(B)}`,
        K;
      if (X.children.length === 0) K = {
        offset: X.offset + 1,
        length: 0,
        content: W
      };
      else {
        let V = X.children[X.children.length - 1];
        K = {
          offset: V.offset + V.length,
          length: 0,
          content: "," + W
        }
      }
      return U1A(A, K, G)
    } else if (B === void 0 && X.children.length >= 0) {
      let W = I,
        K = X.children[W],
        V;
      if (X.children.length === 1) V = {
        offset: X.offset + 1,
        length: X.length - 2,
        content: ""
      };
      else if (X.children.length - 1 === W) {
        let F = X.children[W - 1],
          H = F.offset + F.length,
          E = X.offset + X.length;
        V = {
          offset: H,
          length: E - 2 - H,
          content: ""
        }
      } else V = {
        offset: K.offset,
        length: X.children[W + 1].offset - K.offset,
        content: ""
      };
      return U1A(A, V, G)
    } else if (B !== void 0) {
      let W, K = `${JSON.stringify(B)}`;
      if (!G.isArrayInsertion && X.children.length > I) {
        let V = X.children[I];
        W = {
          offset: V.offset,
          length: V.length,
          content: K
        }
      } else if (X.children.length === 0 || I === 0) W = {
        offset: X.offset + 1,
        length: 0,
        content: X.children.length === 0 ? K : K + ","
      };
      else {
        let V = I > X.children.length ? X.children.length : I,
          F = X.children[V - 1];
        W = {
          offset: F.offset + F.length,
          length: 0,
          content: "," + K
        }
      }
      return U1A(A, W, G)
    } else throw Error(`Can not ${B===void 0?"remove":G.isArrayInsertion?"insert":"modify"} Array index ${D} as length is not sufficient`)
  } else throw Error(`Can not add ${typeof I!=="number"?"index":"property"} to parent of type ${X.type}`)
}
// @from(Ln 49429, Col 0)
function U1A(A, Q, B) {
  if (!B.formattingOptions) return [Q];
  let G = RlA(A, Q),
    Z = Q.offset,
    Y = Q.offset + Q.content.length;
  if (Q.length === 0 || Q.content.length === 0) {
    while (Z > 0 && !nUA(G, Z - 1)) Z--;
    while (Y < G.length && !nUA(G, Y)) Y++
  }
  let J = qR1(G, {
    offset: Z,
    length: Y - Z
  }, {
    ...B.formattingOptions,
    keepLines: !1
  });
  for (let I = J.length - 1; I >= 0; I--) {
    let D = J[I];
    G = RlA(G, D), Z = Math.min(Z, D.offset), Y = Math.max(Y, D.offset + D.length), Y += D.content.length - D.length
  }
  let X = A.length - (G.length - Y) - Z;
  return [{
    offset: Z,
    length: X,
    content: G.substring(Z, Y)
  }]
}
// @from(Ln 49457, Col 0)
function RlA(A, Q) {
  return A.substring(0, Q.offset) + Q.content + A.substring(Q.offset + Q.length)
}
// @from(Ln 49460, Col 4)
a5Q = w(() => {
  NR1();
  OR1()
})
// @from(Ln 49465, Col 0)
function t5Q(A, Q, B, G) {
  return n5Q(A, Q, B, G)
}
// @from(Ln 49469, Col 0)
function e5Q(A, Q) {
  let B = Q.slice(0).sort((Z, Y) => {
      let J = Z.offset - Y.offset;
      if (J === 0) return Z.length - Y.length;
      return J
    }),
    G = A.length;
  for (let Z = B.length - 1; Z >= 0; Z--) {
    let Y = B[Z];
    if (Y.offset + Y.length <= G) A = RlA(A, Y);
    else throw Error("Overlapping edit");
    G = Y.offset
  }
  return A
}
// @from(Ln 49484, Col 4)
o5Q
// @from(Ln 49484, Col 9)
r5Q
// @from(Ln 49484, Col 14)
MR1
// @from(Ln 49484, Col 19)
s5Q
// @from(Ln 49485, Col 4)
A7Q = w(() => {
  NR1();
  a5Q();
  OlA();
  OR1();
  (function (A) {
    A[A.None = 0] = "None", A[A.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 4] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 6] = "InvalidCharacter"
  })(o5Q || (o5Q = {}));
  (function (A) {
    A[A.OpenBraceToken = 1] = "OpenBraceToken", A[A.CloseBraceToken = 2] = "CloseBraceToken", A[A.OpenBracketToken = 3] = "OpenBracketToken", A[A.CloseBracketToken = 4] = "CloseBracketToken", A[A.CommaToken = 5] = "CommaToken", A[A.ColonToken = 6] = "ColonToken", A[A.NullKeyword = 7] = "NullKeyword", A[A.TrueKeyword = 8] = "TrueKeyword", A[A.FalseKeyword = 9] = "FalseKeyword", A[A.StringLiteral = 10] = "StringLiteral", A[A.NumericLiteral = 11] = "NumericLiteral", A[A.LineCommentTrivia = 12] = "LineCommentTrivia", A[A.BlockCommentTrivia = 13] = "BlockCommentTrivia", A[A.LineBreakTrivia = 14] = "LineBreakTrivia", A[A.Trivia = 15] = "Trivia", A[A.Unknown = 16] = "Unknown", A[A.EOF = 17] = "EOF"
  })(r5Q || (r5Q = {}));
  MR1 = i5Q;
  (function (A) {
    A[A.InvalidSymbol = 1] = "InvalidSymbol", A[A.InvalidNumberFormat = 2] = "InvalidNumberFormat", A[A.PropertyNameExpected = 3] = "PropertyNameExpected", A[A.ValueExpected = 4] = "ValueExpected", A[A.ColonExpected = 5] = "ColonExpected", A[A.CommaExpected = 6] = "CommaExpected", A[A.CloseBraceExpected = 7] = "CloseBraceExpected", A[A.CloseBracketExpected = 8] = "CloseBracketExpected", A[A.EndOfFileExpected = 9] = "EndOfFileExpected", A[A.InvalidCommentToken = 10] = "InvalidCommentToken", A[A.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 14] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 16] = "InvalidCharacter"
  })(s5Q || (s5Q = {}))
})
// @from(Ln 49505, Col 0)
function vGA(A) {
  return A.startsWith(cZ4) ? A.slice(1) : A
}
// @from(Ln 49509, Col 0)
function Q7Q(A) {
  if (!A) return null;
  try {
    return MR1(vGA(A))
  } catch (Q) {
    return e(Q), null
  }
}
// @from(Ln 49517, Col 0)
async function Fg(A) {
  try {
    let Q = await dZ4(A, "utf8");
    if (!Q.trim()) return [];
    return Q = vGA(Q), Q.split(`
`).filter((B) => B.trim()).map((B) => {
      try {
        return JSON.parse(B)
      } catch (G) {
        return e(Error(`Error parsing line in ${A}: ${G}`)), null
      }
    }).filter((B) => B !== null)
  } catch (Q) {
    return e(Error(`Error opening file ${A}: ${Q}`)), []
  }
}
// @from(Ln 49534, Col 0)
function B7Q(A, Q) {
  try {
    if (!A || A.trim() === "") return eA([Q], null, 4);
    let B = vGA(A),
      G = MR1(B);
    if (Array.isArray(G)) {
      let Z = G.length,
        X = t5Q(B, Z === 0 ? [0] : [Z], Q, {
          formattingOptions: {
            insertSpaces: !0,
            tabSize: 4
          },
          isArrayInsertion: !0
        });
      if (!X || X.length === 0) {
        let I = [...G, Q];
        return eA(I, null, 4)
      }
      return e5Q(B, X)
    } else return eA([Q], null, 4)
  } catch (B) {
    return e(B), eA([Q], null, 4)
  }
}
// @from(Ln 49558, Col 4)
cZ4 = "\uFEFF"
// @from(Ln 49559, Col 2)
c5
// @from(Ln 49560, Col 4)
vI = w(() => {
  v1();
  A7Q();
  Y9();
  A0();
  c5 = W0((A, Q = !0) => {
    if (!A) return null;
    try {
      return JSON.parse(vGA(A))
    } catch (B) {
      if (Q) e(B);
      return null
    }
  })
})
// @from(Ln 49579, Col 0)
function lZ4(A, Q) {
  performance.now() - Q > Bg
}
// @from(Ln 49583, Col 0)
function ly(A, Q) {
  let B = `execSync: ${A.slice(0,100)}`,
    G = performance.now();
  try {
    return pZ4(A, Q)
  } finally {
    lZ4(B, G)
  }
}
// @from(Ln 49592, Col 4)
_lA = w(() => {
  T1();
  C0();
  A0()
})
// @from(Ln 49597, Col 4)
Z7Q = U((aBG, G7Q) => {
  G7Q.exports = function (Q) {
    return Q.map(function (B) {
      if (B === "") return "''";
      if (B && typeof B === "object") return B.op.replace(/(.)/g, "\\$1");
      if (/["\s\\]/.test(B) && !/'/.test(B)) return "'" + B.replace(/(['])/g, "\\$1") + "'";
      if (/["'\s]/.test(B)) return '"' + B.replace(/(["\\$`!])/g, "\\$1") + '"';
      return String(B).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2")
    }).join(" ")
  }
})
// @from(Ln 49608, Col 4)
K7Q = U((oBG, W7Q) => {
  var D7Q = "(?:" + ["\\|\\|", "\\&\\&", ";;", "\\|\\&", "\\<\\(", "\\<\\<\\<", ">>", ">\\&", "<\\&", "[&;()|<>]"].join("|") + ")",
    Y7Q = new RegExp("^" + D7Q + "$"),
    J7Q = "|&;()<> \\t",
    iZ4 = '"((\\\\"|[^"])*?)"',
    nZ4 = "'((\\\\'|[^'])*?)'",
    aZ4 = /^#$/,
    X7Q = "'",
    I7Q = '"',
    RR1 = "$",
    q1A = "",
    oZ4 = 4294967296;
  for (jlA = 0; jlA < 4; jlA++) q1A += (oZ4 * Math.random()).toString(16);
  var jlA, rZ4 = new RegExp("^" + q1A);

  function sZ4(A, Q) {
    var B = Q.lastIndex,
      G = [],
      Z;
    while (Z = Q.exec(A))
      if (G.push(Z), Q.lastIndex === Z.index) Q.lastIndex += 1;
    return Q.lastIndex = B, G
  }

  function tZ4(A, Q, B) {
    var G = typeof A === "function" ? A(B) : A[B];
    if (typeof G > "u" && B != "") G = "";
    else if (typeof G > "u") G = "$";
    if (typeof G === "object") return Q + q1A + JSON.stringify(G) + q1A;
    return Q + G
  }

  function eZ4(A, Q, B) {
    if (!B) B = {};
    var G = B.escape || "\\",
      Z = "(\\" + G + `['"` + J7Q + `]|[^\\s'"` + J7Q + "])+",
      Y = new RegExp(["(" + D7Q + ")", "(" + Z + "|" + iZ4 + "|" + nZ4 + ")+"].join("|"), "g"),
      J = sZ4(A, Y);
    if (J.length === 0) return [];
    if (!Q) Q = {};
    var X = !1;
    return J.map(function (I) {
      var D = I[0];
      if (!D || X) return;
      if (Y7Q.test(D)) return {
        op: D
      };
      var W = !1,
        K = !1,
        V = "",
        F = !1,
        H;

      function E() {
        H += 1;
        var O, L, M = D.charAt(H);
        if (M === "{") {
          if (H += 1, D.charAt(H) === "}") throw Error("Bad substitution: " + D.slice(H - 2, H + 1));
          if (O = D.indexOf("}", H), O < 0) throw Error("Bad substitution: " + D.slice(H));
          L = D.slice(H, O), H = O
        } else if (/[*@#?$!_-]/.test(M)) L = M, H += 1;
        else {
          var _ = D.slice(H);
          if (O = _.match(/[^\w\d_]/), !O) L = _, H = D.length;
          else L = _.slice(0, O.index), H += O.index - 1
        }
        return tZ4(Q, "", L)
      }
      for (H = 0; H < D.length; H++) {
        var z = D.charAt(H);
        if (F = F || !W && (z === "*" || z === "?"), K) V += z, K = !1;
        else if (W)
          if (z === W) W = !1;
          else if (W == X7Q) V += z;
        else if (z === G)
          if (H += 1, z = D.charAt(H), z === I7Q || z === G || z === RR1) V += z;
          else V += G + z;
        else if (z === RR1) V += E();
        else V += z;
        else if (z === I7Q || z === X7Q) W = z;
        else if (Y7Q.test(z)) return {
          op: D
        };
        else if (aZ4.test(z)) {
          X = !0;
          var $ = {
            comment: A.slice(I.index + H + 1)
          };
          if (V.length) return [V, $];
          return [$]
        } else if (z === G) K = !0;
        else if (z === RR1) V += E();
        else V += z
      }
      if (F) return {
        op: "glob",
        pattern: V
      };
      return V
    }).reduce(function (I, D) {
      return typeof D > "u" ? I : I.concat(D)
    }, [])
  }
  W7Q.exports = function (Q, B, G) {
    var Z = eZ4(Q, B, G);
    if (typeof B !== "function") return Z;
    return Z.reduce(function (Y, J) {
      if (typeof J === "object") return Y.concat(J);
      var X = J.split(RegExp("(" + q1A + ".*?" + q1A + ")", "g"));
      if (X.length === 1) return Y.concat(X[0]);
      return Y.concat(X.filter(Boolean).map(function (I) {
        if (rZ4.test(I)) return JSON.parse(I.split(q1A)[1]);
        return I
      }))
    }, [])
  }
})
// @from(Ln 49725, Col 4)
TlA = U((AY4) => {
  AY4.quote = Z7Q();
  AY4.parse = K7Q()
})
// @from(Ln 49730, Col 0)
function bY(A, Q) {
  try {
    return {
      success: !0,
      tokens: typeof Q === "function" ? kGA.parse(A, Q) : kGA.parse(A, Q)
    }
  } catch (B) {
    if (B instanceof Error) e(B);
    return {
      success: !1,
      error: B instanceof Error ? B.message : "Unknown parse error"
    }
  }
}
// @from(Ln 49745, Col 0)
function GY4(A) {
  try {
    let Q = A.map((G, Z) => {
      if (G === null || G === void 0) return String(G);
      let Y = typeof G;
      if (Y === "string") return G;
      if (Y === "number" || Y === "boolean") return String(G);
      if (Y === "object") throw Error(`Cannot quote argument at index ${Z}: object values are not supported`);
      if (Y === "symbol") throw Error(`Cannot quote argument at index ${Z}: symbol values are not supported`);
      if (Y === "function") throw Error(`Cannot quote argument at index ${Z}: function values are not supported`);
      throw Error(`Cannot quote argument at index ${Z}: unsupported type ${Y}`)
    });
    return {
      success: !0,
      quoted: kGA.quote(Q)
    }
  } catch (Q) {
    if (Q instanceof Error) e(Q);
    return {
      success: !1,
      error: Q instanceof Error ? Q.message : "Unknown quote error"
    }
  }
}
// @from(Ln 49770, Col 0)
function m6(A) {
  let Q = GY4([...A]);
  if (Q.success) return Q.quoted;
  try {
    let B = A.map((G) => {
      if (G === null || G === void 0) return String(G);
      let Z = typeof G;
      if (Z === "string" || Z === "number" || Z === "boolean") return String(G);
      return eA(G)
    });
    return kGA.quote(B)
  } catch (B) {
    if (B instanceof Error) e(B);
    throw Error("Failed to quote shell arguments safely")
  }
}
// @from(Ln 49786, Col 4)
kGA
// @from(Ln 49787, Col 4)
pV = w(() => {
  v1();
  A0();
  kGA = c(TlA(), 1)
})
// @from(Ln 49795, Col 0)
function _R1(A) {
  try {
    return ly(`dir "${A}"`, {
      stdio: "pipe"
    }), !0
  } catch {
    return !1
  }
}
// @from(Ln 49805, Col 0)
function ZY4(A) {
  if (A === "git") {
    let Q = ["C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files (x86)\\Git\\cmd\\git.exe"];
    for (let B of Q)
      if (_R1(B)) return B
  }
  try {
    let B = ly(`where.exe ${A}`, {
        stdio: "pipe",
        encoding: "utf8"
      }).trim().split(`\r
`).filter(Boolean),
      G = o1().toLowerCase();
    for (let Z of B) {
      let Y = bGA.resolve(Z).toLowerCase();
      if (bGA.dirname(Y).toLowerCase() === G || Y.startsWith(G + bGA.sep)) {
        k(`Skipping potentially malicious executable in current directory: ${Z}`);
        continue
      }
      return Z
    }
    return null
  } catch {
    return null
  }
}
// @from(Ln 49831, Col 4)
F7Q = () => {
    if ($Q() === "windows") {
      let A = jR1();
      process.env.SHELL = A, k(`Using bash path: "${A}"`)
    }
  }
// @from(Ln 49837, Col 2)
jR1
// @from(Ln 49837, Col 7)
iy = (A) => {
    let Q = m6([A]);
    return ly(`cygpath -u ${Q}`, {
      shell: jR1()
    }).toString().trim()
  }
// @from(Ln 49843, Col 2)
H7Q = (A) => {
    let Q = m6([A]);
    return ly(`cygpath -w ${Q}`, {
      shell: jR1()
    }).toString().trim()
  }
// @from(Ln 49849, Col 4)
fGA = w(() => {
  _lA();
  Y9();
  pV();
  c3();
  T1();
  V2();
  jR1 = W0(() => {
    if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
      if (_R1(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
      console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1)
    }
    let A = ZY4("git");
    if (A) {
      let Q = V7Q.join(A, "..", "..", "bin", "bash.exe");
      if (_R1(Q)) return Q
    }
    console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1)
  })
})
// @from(Ln 49880, Col 0)
function Y4(A, Q) {
  let B = Q ?? o1() ?? vA().cwd();
  if (typeof A !== "string") throw TypeError(`Path must be a string, received ${typeof A}`);
  if (typeof B !== "string") throw TypeError(`Base directory must be a string, received ${typeof B}`);
  if (A.includes("\x00") || B.includes("\x00")) throw Error("Path contains null bytes");
  let G = A.trim();
  if (!G) return TR1(B);
  if (G === "~") return E7Q();
  if (G.startsWith("~/")) return JY4(E7Q(), G.slice(2));
  let Z = G;
  if ($Q() === "windows" && G.match(/^\/[a-z]\//i)) try {
    Z = H7Q(G)
  } catch {
    Z = G
  }
  if (YY4(Z)) return TR1(Z);
  return XY4(B, Z)
}
// @from(Ln 49899, Col 0)
function Hg(A) {
  let Q = Y4(A);
  try {
    if (vA().statSync(Q).isDirectory()) return Q
  } catch {}
  return IY4(Q)
}
// @from(Ln 49907, Col 0)
function hGA(A) {
  return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(A)
}
// @from(Ln 49911, Col 0)
function gGA(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Ln 49915, Col 0)
function oUA(A) {
  return TR1(A).replace(/\\/g, "/")
}
// @from(Ln 49918, Col 4)
oZ = w(() => {
  V2();
  DQ();
  c3();
  fGA()
})
// @from(Ln 49925, Col 0)
function sUA(A, Q) {
  return A instanceof Error && A.message === Q
}
// @from(Ln 49928, Col 4)
rUA
// @from(Ln 49928, Col 9)
ny
// @from(Ln 49928, Col 13)
aG
// @from(Ln 49928, Col 17)
Hq
// @from(Ln 49928, Col 21)
ay
// @from(Ln 49928, Col 25)
uK
// @from(Ln 49929, Col 4)
XX = w(() => {
  rUA = class rUA extends Error {
    constructor(A) {
      super(A);
      this.name = this.constructor.name
    }
  };
  ny = class ny extends Error {};
  aG = class aG extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  };
  Hq = class Hq extends Error {
    filePath;
    defaultConfig;
    constructor(A, Q, B) {
      super(A);
      this.name = "ConfigParseError", this.filePath = Q, this.defaultConfig = B
    }
  };
  ay = class ay extends Error {
    stdout;
    stderr;
    code;
    interrupted;
    constructor(A, Q, B, G) {
      super("Shell command failed");
      this.stdout = A;
      this.stderr = Q;
      this.code = B;
      this.interrupted = G;
      this.name = "ShellError"
    }
  };
  uK = class uK extends Error {
    formattedMessage;
    constructor(A, Q) {
      super(A);
      this.formattedMessage = Q;
      this.name = "TeleportOperationError"
    }
  }
})
// @from(Ln 49974, Col 4)
$7Q = U((E2G, z7Q) => {
  var $i = NA("constants"),
    DY4 = process.cwd,
    PlA = null,
    WY4 = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function () {
    if (!PlA) PlA = DY4.call(process);
    return PlA
  };
  try {
    process.cwd()
  } catch (A) {}
  if (typeof process.chdir === "function") {
    if (SlA = process.chdir, process.chdir = function (A) {
        PlA = null, SlA.call(process, A)
      }, Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, SlA)
  }
  var SlA;
  z7Q.exports = KY4;

  function KY4(A) {
    if ($i.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) Q(A);
    if (!A.lutimes) B(A);
    if (A.chown = Y(A.chown), A.fchown = Y(A.fchown), A.lchown = Y(A.lchown), A.chmod = G(A.chmod), A.fchmod = G(A.fchmod), A.lchmod = G(A.lchmod), A.chownSync = J(A.chownSync), A.fchownSync = J(A.fchownSync), A.lchownSync = J(A.lchownSync), A.chmodSync = Z(A.chmodSync), A.fchmodSync = Z(A.fchmodSync), A.lchmodSync = Z(A.lchmodSync), A.stat = X(A.stat), A.fstat = X(A.fstat), A.lstat = X(A.lstat), A.statSync = I(A.statSync), A.fstatSync = I(A.fstatSync), A.lstatSync = I(A.lstatSync), A.chmod && !A.lchmod) A.lchmod = function (W, K, V) {
      if (V) process.nextTick(V)
    }, A.lchmodSync = function () {};
    if (A.chown && !A.lchown) A.lchown = function (W, K, V, F) {
      if (F) process.nextTick(F)
    }, A.lchownSync = function () {};
    if (WY4 === "win32") A.rename = typeof A.rename !== "function" ? A.rename : function (W) {
      function K(V, F, H) {
        var E = Date.now(),
          z = 0;
        W(V, F, function $(O) {
          if (O && (O.code === "EACCES" || O.code === "EPERM" || O.code === "EBUSY") && Date.now() - E < 60000) {
            if (setTimeout(function () {
                A.stat(F, function (L, M) {
                  if (L && L.code === "ENOENT") W(V, F, $);
                  else H(O)
                })
              }, z), z < 100) z += 10;
            return
          }
          if (H) H(O)
        })
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(K, W);
      return K
    }(A.rename);
    A.read = typeof A.read !== "function" ? A.read : function (W) {
      function K(V, F, H, E, z, $) {
        var O;
        if ($ && typeof $ === "function") {
          var L = 0;
          O = function (M, _, j) {
            if (M && M.code === "EAGAIN" && L < 10) return L++, W.call(A, V, F, H, E, z, O);
            $.apply(this, arguments)
          }
        }
        return W.call(A, V, F, H, E, z, O)
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(K, W);
      return K
    }(A.read), A.readSync = typeof A.readSync !== "function" ? A.readSync : function (W) {
      return function (K, V, F, H, E) {
        var z = 0;
        while (!0) try {
          return W.call(A, K, V, F, H, E)
        } catch ($) {
          if ($.code === "EAGAIN" && z < 10) {
            z++;
            continue
          }
          throw $
        }
      }
    }(A.readSync);

    function Q(W) {
      W.lchmod = function (K, V, F) {
        W.open(K, $i.O_WRONLY | $i.O_SYMLINK, V, function (H, E) {
          if (H) {
            if (F) F(H);
            return
          }
          W.fchmod(E, V, function (z) {
            W.close(E, function ($) {
              if (F) F(z || $)
            })
          })
        })
      }, W.lchmodSync = function (K, V) {
        var F = W.openSync(K, $i.O_WRONLY | $i.O_SYMLINK, V),
          H = !0,
          E;
        try {
          E = W.fchmodSync(F, V), H = !1
        } finally {
          if (H) try {
            W.closeSync(F)
          } catch (z) {} else W.closeSync(F)
        }
        return E
      }
    }

    function B(W) {
      if ($i.hasOwnProperty("O_SYMLINK") && W.futimes) W.lutimes = function (K, V, F, H) {
        W.open(K, $i.O_SYMLINK, function (E, z) {
          if (E) {
            if (H) H(E);
            return
          }
          W.futimes(z, V, F, function ($) {
            W.close(z, function (O) {
              if (H) H($ || O)
            })
          })
        })
      }, W.lutimesSync = function (K, V, F) {
        var H = W.openSync(K, $i.O_SYMLINK),
          E, z = !0;
        try {
          E = W.futimesSync(H, V, F), z = !1
        } finally {
          if (z) try {
            W.closeSync(H)
          } catch ($) {} else W.closeSync(H)
        }
        return E
      };
      else if (W.futimes) W.lutimes = function (K, V, F, H) {
        if (H) process.nextTick(H)
      }, W.lutimesSync = function () {}
    }

    function G(W) {
      if (!W) return W;
      return function (K, V, F) {
        return W.call(A, K, V, function (H) {
          if (D(H)) H = null;
          if (F) F.apply(this, arguments)
        })
      }
    }

    function Z(W) {
      if (!W) return W;
      return function (K, V) {
        try {
          return W.call(A, K, V)
        } catch (F) {
          if (!D(F)) throw F
        }
      }
    }

    function Y(W) {
      if (!W) return W;
      return function (K, V, F, H) {
        return W.call(A, K, V, F, function (E) {
          if (D(E)) E = null;
          if (H) H.apply(this, arguments)
        })
      }
    }

    function J(W) {
      if (!W) return W;
      return function (K, V, F) {
        try {
          return W.call(A, K, V, F)
        } catch (H) {
          if (!D(H)) throw H
        }
      }
    }

    function X(W) {
      if (!W) return W;
      return function (K, V, F) {
        if (typeof V === "function") F = V, V = null;

        function H(E, z) {
          if (z) {
            if (z.uid < 0) z.uid += 4294967296;
            if (z.gid < 0) z.gid += 4294967296
          }
          if (F) F.apply(this, arguments)
        }
        return V ? W.call(A, K, V, H) : W.call(A, K, H)
      }
    }

    function I(W) {
      if (!W) return W;
      return function (K, V) {
        var F = V ? W.call(A, K, V) : W.call(A, K);
        if (F) {
          if (F.uid < 0) F.uid += 4294967296;
          if (F.gid < 0) F.gid += 4294967296
        }
        return F
      }
    }

    function D(W) {
      if (!W) return !0;
      if (W.code === "ENOSYS") return !0;
      var K = !process.getuid || process.getuid() !== 0;
      if (K) {
        if (W.code === "EINVAL" || W.code === "EPERM") return !0
      }
      return !1
    }
  }
})
// @from(Ln 50191, Col 4)
q7Q = U((z2G, U7Q) => {
  var C7Q = NA("stream").Stream;
  U7Q.exports = VY4;

  function VY4(A) {
    return {
      ReadStream: Q,
      WriteStream: B
    };

    function Q(G, Z) {
      if (!(this instanceof Q)) return new Q(G, Z);
      C7Q.call(this);
      var Y = this;
      this.path = G, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, Z = Z || {};
      var J = Object.keys(Z);
      for (var X = 0, I = J.length; X < I; X++) {
        var D = J[X];
        this[D] = Z[D]
      }
      if (this.encoding) this.setEncoding(this.encoding);
      if (this.start !== void 0) {
        if (typeof this.start !== "number") throw TypeError("start must be a Number");
        if (this.end === void 0) this.end = 1 / 0;
        else if (typeof this.end !== "number") throw TypeError("end must be a Number");
        if (this.start > this.end) throw Error("start must be <= end");
        this.pos = this.start
      }
      if (this.fd !== null) {
        process.nextTick(function () {
          Y._read()
        });
        return
      }
      A.open(this.path, this.flags, this.mode, function (W, K) {
        if (W) {
          Y.emit("error", W), Y.readable = !1;
          return
        }
        Y.fd = K, Y.emit("open", K), Y._read()
      })
    }

    function B(G, Z) {
      if (!(this instanceof B)) return new B(G, Z);
      C7Q.call(this), this.path = G, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, Z = Z || {};
      var Y = Object.keys(Z);
      for (var J = 0, X = Y.length; J < X; J++) {
        var I = Y[J];
        this[I] = Z[I]
      }
      if (this.start !== void 0) {
        if (typeof this.start !== "number") throw TypeError("start must be a Number");
        if (this.start < 0) throw Error("start must be >= zero");
        this.pos = this.start
      }
      if (this.busy = !1, this._queue = [], this.fd === null) this._open = A.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush()
    }
  }
})
// @from(Ln 50251, Col 4)
w7Q = U(($2G, N7Q) => {
  N7Q.exports = HY4;
  var FY4 = Object.getPrototypeOf || function (A) {
    return A.__proto__
  };

  function HY4(A) {
    if (A === null || typeof A !== "object") return A;
    if (A instanceof Object) var Q = {
      __proto__: FY4(A)
    };
    else var Q = Object.create(null);
    return Object.getOwnPropertyNames(A).forEach(function (B) {
      Object.defineProperty(Q, B, Object.getOwnPropertyDescriptor(A, B))
    }), Q
  }
})
// @from(Ln 50268, Col 4)
OG = U((C2G, yR1) => {
  var rX = NA("fs"),
    EY4 = $7Q(),
    zY4 = q7Q(),
    $Y4 = w7Q(),
    xlA = NA("util"),
    LH, vlA;
  if (typeof Symbol === "function" && typeof Symbol.for === "function") LH = Symbol.for("graceful-fs.queue"), vlA = Symbol.for("graceful-fs.previous");
  else LH = "___graceful-fs.queue", vlA = "___graceful-fs.previous";

  function CY4() {}

  function O7Q(A, Q) {
    Object.defineProperty(A, LH, {
      get: function () {
        return Q
      }
    })
  }
  var N1A = CY4;
  if (xlA.debuglog) N1A = xlA.debuglog("gfs4");
  else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) N1A = function () {
    var A = xlA.format.apply(xlA, arguments);
    A = "GFS4: " + A.split(/\n/).join(`
GFS4: `), console.error(A)
  };
  if (!rX[LH]) {
    if (PR1 = global[LH] || [], O7Q(rX, PR1), rX.close = function (A) {
        function Q(B, G) {
          return A.call(rX, B, function (Z) {
            if (!Z) L7Q();
            if (typeof G === "function") G.apply(this, arguments)
          })
        }
        return Object.defineProperty(Q, vlA, {
          value: A
        }), Q
      }(rX.close), rX.closeSync = function (A) {
        function Q(B) {
          A.apply(rX, arguments), L7Q()
        }
        return Object.defineProperty(Q, vlA, {
          value: A
        }), Q
      }(rX.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function () {
      N1A(rX[LH]), NA("assert").equal(rX[LH].length, 0)
    })
  }
  var PR1;
  if (!global[LH]) O7Q(global, rX[LH]);
  yR1.exports = SR1($Y4(rX));
  if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !rX.__patched) yR1.exports = SR1(rX), rX.__patched = !0;

  function SR1(A) {
    EY4(A), A.gracefulify = SR1, A.createReadStream = _, A.createWriteStream = j;
    var Q = A.readFile;
    A.readFile = B;

    function B(S, u, f) {
      if (typeof u === "function") f = u, u = null;
      return AA(S, u, f);

      function AA(n, y, p, GA) {
        return Q(n, y, function (WA) {
          if (WA && (WA.code === "EMFILE" || WA.code === "ENFILE")) uGA([AA, [n, y, p], WA, GA || Date.now(), Date.now()]);
          else if (typeof p === "function") p.apply(this, arguments)
        })
      }
    }
    var G = A.writeFile;
    A.writeFile = Z;

    function Z(S, u, f, AA) {
      if (typeof f === "function") AA = f, f = null;
      return n(S, u, f, AA);

      function n(y, p, GA, WA, MA) {
        return G(y, p, GA, function (TA) {
          if (TA && (TA.code === "EMFILE" || TA.code === "ENFILE")) uGA([n, [y, p, GA, WA], TA, MA || Date.now(), Date.now()]);
          else if (typeof WA === "function") WA.apply(this, arguments)
        })
      }
    }
    var Y = A.appendFile;
    if (Y) A.appendFile = J;

    function J(S, u, f, AA) {
      if (typeof f === "function") AA = f, f = null;
      return n(S, u, f, AA);

      function n(y, p, GA, WA, MA) {
        return Y(y, p, GA, function (TA) {
          if (TA && (TA.code === "EMFILE" || TA.code === "ENFILE")) uGA([n, [y, p, GA, WA], TA, MA || Date.now(), Date.now()]);
          else if (typeof WA === "function") WA.apply(this, arguments)
        })
      }
    }
    var X = A.copyFile;
    if (X) A.copyFile = I;

    function I(S, u, f, AA) {
      if (typeof f === "function") AA = f, f = 0;
      return n(S, u, f, AA);

      function n(y, p, GA, WA, MA) {
        return X(y, p, GA, function (TA) {
          if (TA && (TA.code === "EMFILE" || TA.code === "ENFILE")) uGA([n, [y, p, GA, WA], TA, MA || Date.now(), Date.now()]);
          else if (typeof WA === "function") WA.apply(this, arguments)
        })
      }
    }
    var D = A.readdir;
    A.readdir = K;
    var W = /^v[0-5]\./;

    function K(S, u, f) {
      if (typeof u === "function") f = u, u = null;
      var AA = W.test(process.version) ? function (p, GA, WA, MA) {
        return D(p, n(p, GA, WA, MA))
      } : function (p, GA, WA, MA) {
        return D(p, GA, n(p, GA, WA, MA))
      };
      return AA(S, u, f);

      function n(y, p, GA, WA) {
        return function (MA, TA) {
          if (MA && (MA.code === "EMFILE" || MA.code === "ENFILE")) uGA([AA, [y, p, GA], MA, WA || Date.now(), Date.now()]);
          else {
            if (TA && TA.sort) TA.sort();
            if (typeof GA === "function") GA.call(this, MA, TA)
          }
        }
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var V = zY4(A);
      $ = V.ReadStream, L = V.WriteStream
    }
    var F = A.ReadStream;
    if (F) $.prototype = Object.create(F.prototype), $.prototype.open = O;
    var H = A.WriteStream;
    if (H) L.prototype = Object.create(H.prototype), L.prototype.open = M;
    Object.defineProperty(A, "ReadStream", {
      get: function () {
        return $
      },
      set: function (S) {
        $ = S
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(A, "WriteStream", {
      get: function () {
        return L
      },
      set: function (S) {
        L = S
      },
      enumerable: !0,
      configurable: !0
    });
    var E = $;
    Object.defineProperty(A, "FileReadStream", {
      get: function () {
        return E
      },
      set: function (S) {
        E = S
      },
      enumerable: !0,
      configurable: !0
    });
    var z = L;
    Object.defineProperty(A, "FileWriteStream", {
      get: function () {
        return z
      },
      set: function (S) {
        z = S
      },
      enumerable: !0,
      configurable: !0
    });

    function $(S, u) {
      if (this instanceof $) return F.apply(this, arguments), this;
      else return $.apply(Object.create($.prototype), arguments)
    }

    function O() {
      var S = this;
      b(S.path, S.flags, S.mode, function (u, f) {
        if (u) {
          if (S.autoClose) S.destroy();
          S.emit("error", u)
        } else S.fd = f, S.emit("open", f), S.read()
      })
    }

    function L(S, u) {
      if (this instanceof L) return H.apply(this, arguments), this;
      else return L.apply(Object.create(L.prototype), arguments)
    }

    function M() {
      var S = this;
      b(S.path, S.flags, S.mode, function (u, f) {
        if (u) S.destroy(), S.emit("error", u);
        else S.fd = f, S.emit("open", f)
      })
    }

    function _(S, u) {
      return new A.ReadStream(S, u)
    }

    function j(S, u) {
      return new A.WriteStream(S, u)
    }
    var x = A.open;
    A.open = b;

    function b(S, u, f, AA) {
      if (typeof f === "function") AA = f, f = null;
      return n(S, u, f, AA);

      function n(y, p, GA, WA, MA) {
        return x(y, p, GA, function (TA, bA) {
          if (TA && (TA.code === "EMFILE" || TA.code === "ENFILE")) uGA([n, [y, p, GA, WA], TA, MA || Date.now(), Date.now()]);
          else if (typeof WA === "function") WA.apply(this, arguments)
        })
      }
    }
    return A
  }

  function uGA(A) {
    N1A("ENQUEUE", A[0].name, A[1]), rX[LH].push(A), xR1()
  }
  var ylA;

  function L7Q() {
    var A = Date.now();
    for (var Q = 0; Q < rX[LH].length; ++Q)
      if (rX[LH][Q].length > 2) rX[LH][Q][3] = A, rX[LH][Q][4] = A;
    xR1()
  }

  function xR1() {
    if (clearTimeout(ylA), ylA = void 0, rX[LH].length === 0) return;
    var A = rX[LH].shift(),
      Q = A[0],
      B = A[1],
      G = A[2],
      Z = A[3],
      Y = A[4];
    if (Z === void 0) N1A("RETRY", Q.name, B), Q.apply(null, B);
    else if (Date.now() - Z >= 60000) {
      N1A("TIMEOUT", Q.name, B);
      var J = B.pop();
      if (typeof J === "function") J.call(null, G)
    } else {
      var X = Date.now() - Y,
        I = Math.max(Y - Z, 1),
        D = Math.min(I * 1.2, 100);
      if (X >= D) N1A("RETRY", Q.name, B), Q.apply(null, B.concat([Z]));
      else rX[LH].push(A)
    }
    if (ylA === void 0) ylA = setTimeout(xR1, 0)
  }
})
// @from(Ln 50539, Col 4)
R7Q = U((U2G, M7Q) => {
  function hM(A, Q) {
    if (typeof Q === "boolean") Q = {
      forever: Q
    };
    if (this._originalTimeouts = JSON.parse(JSON.stringify(A)), this._timeouts = A, this._options = Q || {}, this._maxRetryTime = Q && Q.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever) this._cachedTimeouts = this._timeouts.slice(0)
  }
  M7Q.exports = hM;
  hM.prototype.reset = function () {
    this._attempts = 1, this._timeouts = this._originalTimeouts
  };
  hM.prototype.stop = function () {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeouts = [], this._cachedTimeouts = null
  };
  hM.prototype.retry = function (A) {
    if (this._timeout) clearTimeout(this._timeout);
    if (!A) return !1;
    var Q = new Date().getTime();
    if (A && Q - this._operationStart >= this._maxRetryTime) return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
    this._errors.push(A);
    var B = this._timeouts.shift();
    if (B === void 0)
      if (this._cachedTimeouts) this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), B = this._timeouts.shift();
      else return !1;
    var G = this,
      Z = setTimeout(function () {
        if (G._attempts++, G._operationTimeoutCb) {
          if (G._timeout = setTimeout(function () {
              G._operationTimeoutCb(G._attempts)
            }, G._operationTimeout), G._options.unref) G._timeout.unref()
        }
        G._fn(G._attempts)
      }, B);
    if (this._options.unref) Z.unref();
    return !0
  };
  hM.prototype.attempt = function (A, Q) {
    if (this._fn = A, Q) {
      if (Q.timeout) this._operationTimeout = Q.timeout;
      if (Q.cb) this._operationTimeoutCb = Q.cb
    }
    var B = this;
    if (this._operationTimeoutCb) this._timeout = setTimeout(function () {
      B._operationTimeoutCb()
    }, B._operationTimeout);
    this._operationStart = new Date().getTime(), this._fn(this._attempts)
  };
  hM.prototype.try = function (A) {
    console.log("Using RetryOperation.try() is deprecated"), this.attempt(A)
  };
  hM.prototype.start = function (A) {
    console.log("Using RetryOperation.start() is deprecated"), this.attempt(A)
  };
  hM.prototype.start = hM.prototype.try;
  hM.prototype.errors = function () {
    return this._errors
  };
  hM.prototype.attempts = function () {
    return this._attempts
  };
  hM.prototype.mainError = function () {
    if (this._errors.length === 0) return null;
    var A = {},
      Q = null,
      B = 0;
    for (var G = 0; G < this._errors.length; G++) {
      var Z = this._errors[G],
        Y = Z.message,
        J = (A[Y] || 0) + 1;
      if (A[Y] = J, J >= B) Q = Z, B = J
    }
    return Q
  }
})
// @from(Ln 50614, Col 4)
j7Q = U((qY4) => {
  var UY4 = R7Q();
  qY4.operation = function (A) {
    var Q = qY4.timeouts(A);
    return new UY4(Q, {
      forever: A && A.forever,
      unref: A && A.unref,
      maxRetryTime: A && A.maxRetryTime
    })
  };
  qY4.timeouts = function (A) {
    if (A instanceof Array) return [].concat(A);
    var Q = {
      retries: 10,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 1 / 0,
      randomize: !1
    };
    for (var B in A) Q[B] = A[B];
    if (Q.minTimeout > Q.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
    var G = [];
    for (var Z = 0; Z < Q.retries; Z++) G.push(this.createTimeout(Z, Q));
    if (A && A.forever && !G.length) G.push(this.createTimeout(Z, Q));
    return G.sort(function (Y, J) {
      return Y - J
    }), G
  };
  qY4.createTimeout = function (A, Q) {
    var B = Q.randomize ? Math.random() + 1 : 1,
      G = Math.round(B * Q.minTimeout * Math.pow(Q.factor, A));
    return G = Math.min(G, Q.maxTimeout), G
  };
  qY4.wrap = function (A, Q, B) {
    if (Q instanceof Array) B = Q, Q = null;
    if (!B) {
      B = [];
      for (var G in A)
        if (typeof A[G] === "function") B.push(G)
    }
    for (var Z = 0; Z < B.length; Z++) {
      var Y = B[Z],
        J = A[Y];
      A[Y] = function (I) {
        var D = qY4.operation(Q),
          W = Array.prototype.slice.call(arguments, 1),
          K = W.pop();
        W.push(function (V) {
          if (D.retry(V)) return;
          if (V) arguments[0] = D.mainError();
          K.apply(this, arguments)
        }), D.attempt(function () {
          I.apply(A, W)
        })
      }.bind(A, J), A[Y].options = Q
    }
  }
})
// @from(Ln 50672, Col 4)
T7Q = U((N2G, klA) => {
  klA.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
  if (process.platform !== "win32") klA.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
  if (process.platform === "linux") klA.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED")
})
// @from(Ln 50677, Col 4)
P7Q = U((w2G, dGA) => {
  var IX = global.process,
    w1A = function (A) {
      return A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
    };
  if (!w1A(IX)) dGA.exports = function () {
    return function () {}
  };
  else {
    if (vR1 = NA("assert"), L1A = T7Q(), kR1 = /^win/i.test(IX.platform), mGA = NA("events"), typeof mGA !== "function") mGA = mGA.EventEmitter;
    if (IX.__signal_exit_emitter__) mK = IX.__signal_exit_emitter__;
    else mK = IX.__signal_exit_emitter__ = new mGA, mK.count = 0, mK.emitted = {};
    if (!mK.infinite) mK.setMaxListeners(1 / 0), mK.infinite = !0;
    dGA.exports = function (A, Q) {
      if (!w1A(global.process)) return function () {};
      if (vR1.equal(typeof A, "function", "a callback must be provided for exit handler"), O1A === !1) blA();
      var B = "exit";
      if (Q && Q.alwaysLast) B = "afterexit";
      var G = function () {
        if (mK.removeListener(B, A), mK.listeners("exit").length === 0 && mK.listeners("afterexit").length === 0) tUA()
      };
      return mK.on(B, A), G
    }, tUA = function () {
      if (!O1A || !w1A(global.process)) return;
      O1A = !1, L1A.forEach(function (Q) {
        try {
          IX.removeListener(Q, eUA[Q])
        } catch (B) {}
      }), IX.emit = AqA, IX.reallyExit = flA, mK.count -= 1
    }, dGA.exports.unload = tUA, Ci = function (Q, B, G) {
      if (mK.emitted[Q]) return;
      mK.emitted[Q] = !0, mK.emit(Q, B, G)
    }, eUA = {}, L1A.forEach(function (A) {
      eUA[A] = function () {
        if (!w1A(global.process)) return;
        var B = IX.listeners(A);
        if (B.length === mK.count) {
          if (tUA(), Ci("exit", null, A), Ci("afterexit", null, A), kR1 && A === "SIGHUP") A = "SIGINT";
          IX.kill(IX.pid, A)
        }
      }
    }), dGA.exports.signals = function () {
      return L1A
    }, O1A = !1, blA = function () {
      if (O1A || !w1A(global.process)) return;
      O1A = !0, mK.count += 1, L1A = L1A.filter(function (Q) {
        try {
          return IX.on(Q, eUA[Q]), !0
        } catch (B) {
          return !1
        }
      }), IX.emit = fR1, IX.reallyExit = bR1
    }, dGA.exports.load = blA, flA = IX.reallyExit, bR1 = function (Q) {
      if (!w1A(global.process)) return;
      IX.exitCode = Q || 0, Ci("exit", IX.exitCode, null), Ci("afterexit", IX.exitCode, null), flA.call(IX, IX.exitCode)
    }, AqA = IX.emit, fR1 = function (Q, B) {
      if (Q === "exit" && w1A(global.process)) {
        if (B !== void 0) IX.exitCode = B;
        var G = AqA.apply(this, arguments);
        return Ci("exit", IX.exitCode, null), Ci("afterexit", IX.exitCode, null), G
      } else return AqA.apply(this, arguments)
    }
  }
  var vR1, L1A, kR1, mGA, mK, tUA, Ci, eUA, O1A, blA, flA, bR1, AqA, fR1
})
// @from(Ln 50742, Col 4)
x7Q = U((RY4, hR1) => {
  var S7Q = Symbol();

  function OY4(A, Q, B) {
    let G = Q[S7Q];
    if (G) return Q.stat(A, (Y, J) => {
      if (Y) return B(Y);
      B(null, J.mtime, G)
    });
    let Z = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
    Q.utimes(A, Z, Z, (Y) => {
      if (Y) return B(Y);
      Q.stat(A, (J, X) => {
        if (J) return B(J);
        let I = X.mtime.getTime() % 1000 === 0 ? "s" : "ms";
        Object.defineProperty(Q, S7Q, {
          value: I
        }), B(null, X.mtime, I)
      })
    })
  }

  function MY4(A) {
    let Q = Date.now();
    if (A === "s") Q = Math.ceil(Q / 1000) * 1000;
    return new Date(Q)
  }
  RY4.probe = OY4;
  RY4.getMtime = MY4
})
// @from(Ln 50772, Col 4)
f7Q = U((kY4, BqA) => {
  var TY4 = NA("path"),
    mR1 = OG(),
    PY4 = j7Q(),
    SY4 = P7Q(),
    y7Q = x7Q(),
    Eg = {};

  function QqA(A, Q) {
    return Q.lockfilePath || `${A}.lock`
  }

  function dR1(A, Q, B) {
    if (!Q.realpath) return B(null, TY4.resolve(A));
    Q.fs.realpath(A, B)
  }

  function uR1(A, Q, B) {
    let G = QqA(A, Q);
    Q.fs.mkdir(G, (Z) => {
      if (!Z) return y7Q.probe(G, Q.fs, (Y, J, X) => {
        if (Y) return Q.fs.rmdir(G, () => {}), B(Y);
        B(null, J, X)
      });
      if (Z.code !== "EEXIST") return B(Z);
      if (Q.stale <= 0) return B(Object.assign(Error("Lock file is already being held"), {
        code: "ELOCKED",
        file: A
      }));
      Q.fs.stat(G, (Y, J) => {
        if (Y) {
          if (Y.code === "ENOENT") return uR1(A, {
            ...Q,
            stale: 0
          }, B);
          return B(Y)
        }
        if (!v7Q(J, Q)) return B(Object.assign(Error("Lock file is already being held"), {
          code: "ELOCKED",
          file: A
        }));
        k7Q(A, Q, (X) => {
          if (X) return B(X);
          uR1(A, {
            ...Q,
            stale: 0
          }, B)
        })
      })
    })
  }

  function v7Q(A, Q) {
    return A.mtime.getTime() < Date.now() - Q.stale
  }

  function k7Q(A, Q, B) {
    Q.fs.rmdir(QqA(A, Q), (G) => {
      if (G && G.code !== "ENOENT") return B(G);
      B()
    })
  }

  function hlA(A, Q) {
    let B = Eg[A];
    if (B.updateTimeout) return;
    if (B.updateDelay = B.updateDelay || Q.update, B.updateTimeout = setTimeout(() => {
        B.updateTimeout = null, Q.fs.stat(B.lockfilePath, (G, Z) => {
          let Y = B.lastUpdate + Q.stale < Date.now();
          if (G) {
            if (G.code === "ENOENT" || Y) return gR1(A, B, Object.assign(G, {
              code: "ECOMPROMISED"
            }));
            return B.updateDelay = 1000, hlA(A, Q)
          }
          if (B.mtime.getTime() !== Z.mtime.getTime()) return gR1(A, B, Object.assign(Error("Unable to update lock within the stale threshold"), {
            code: "ECOMPROMISED"
          }));
          let X = y7Q.getMtime(B.mtimePrecision);
          Q.fs.utimes(B.lockfilePath, X, X, (I) => {
            let D = B.lastUpdate + Q.stale < Date.now();
            if (B.released) return;
            if (I) {
              if (I.code === "ENOENT" || D) return gR1(A, B, Object.assign(I, {
                code: "ECOMPROMISED"
              }));
              return B.updateDelay = 1000, hlA(A, Q)
            }
            B.mtime = X, B.lastUpdate = Date.now(), B.updateDelay = null, hlA(A, Q)
          })
        })
      }, B.updateDelay), B.updateTimeout.unref) B.updateTimeout.unref()
  }

  function gR1(A, Q, B) {
    if (Q.released = !0, Q.updateTimeout) clearTimeout(Q.updateTimeout);
    if (Eg[A] === Q) delete Eg[A];
    Q.options.onCompromised(B)
  }

  function xY4(A, Q, B) {
    Q = {
      stale: 1e4,
      update: null,
      realpath: !0,
      retries: 0,
      fs: mR1,
      onCompromised: (G) => {
        throw G
      },
      ...Q
    }, Q.retries = Q.retries || 0, Q.retries = typeof Q.retries === "number" ? {
      retries: Q.retries
    } : Q.retries, Q.stale = Math.max(Q.stale || 0, 2000), Q.update = Q.update == null ? Q.stale / 2 : Q.update || 0, Q.update = Math.max(Math.min(Q.update, Q.stale / 2), 1000), dR1(A, Q, (G, Z) => {
      if (G) return B(G);
      let Y = PY4.operation(Q.retries);
      Y.attempt(() => {
        uR1(Z, Q, (J, X, I) => {
          if (Y.retry(J)) return;
          if (J) return B(Y.mainError());
          let D = Eg[Z] = {
            lockfilePath: QqA(Z, Q),
            mtime: X,
            mtimePrecision: I,
            options: Q,
            lastUpdate: Date.now()
          };
          hlA(Z, Q), B(null, (W) => {
            if (D.released) return W && W(Object.assign(Error("Lock is already released"), {
              code: "ERELEASED"
            }));
            b7Q(Z, {
              ...Q,
              realpath: !1
            }, W)
          })
        })
      })
    })
  }

  function b7Q(A, Q, B) {
    Q = {
      fs: mR1,
      realpath: !0,
      ...Q
    }, dR1(A, Q, (G, Z) => {
      if (G) return B(G);
      let Y = Eg[Z];
      if (!Y) return B(Object.assign(Error("Lock is not acquired/owned by you"), {
        code: "ENOTACQUIRED"
      }));
      Y.updateTimeout && clearTimeout(Y.updateTimeout), Y.released = !0, delete Eg[Z], k7Q(Z, Q, B)
    })
  }

  function yY4(A, Q, B) {
    Q = {
      stale: 1e4,
      realpath: !0,
      fs: mR1,
      ...Q
    }, Q.stale = Math.max(Q.stale || 0, 2000), dR1(A, Q, (G, Z) => {
      if (G) return B(G);
      Q.fs.stat(QqA(Z, Q), (Y, J) => {
        if (Y) return Y.code === "ENOENT" ? B(null, !1) : B(Y);
        return B(null, !v7Q(J, Q))
      })
    })
  }

  function vY4() {
    return Eg
  }
  SY4(() => {
    for (let A in Eg) {
      let Q = Eg[A].options;
      try {
        Q.fs.rmdirSync(QqA(A, Q))
      } catch (B) {}
    }
  });
  kY4.lock = xY4;
  kY4.unlock = b7Q;
  kY4.check = yY4;
  kY4.getLocks = vY4
})
// @from(Ln 50959, Col 4)
g7Q = U((L2G, h7Q) => {
  var uY4 = OG();

  function mY4(A) {
    let Q = ["mkdir", "realpath", "stat", "rmdir", "utimes"],
      B = {
        ...A
      };
    return Q.forEach((G) => {
      B[G] = (...Z) => {
        let Y = Z.pop(),
          J;
        try {
          J = A[`${G}Sync`](...Z)
        } catch (X) {
          return Y(X)
        }
        Y(null, J)
      }
    }), B
  }

  function dY4(A) {
    return (...Q) => new Promise((B, G) => {
      Q.push((Z, Y) => {
        if (Z) G(Z);
        else B(Y)
      }), A(...Q)
    })
  }

  function cY4(A) {
    return (...Q) => {
      let B, G;
      if (Q.push((Z, Y) => {
          B = Z, G = Y
        }), A(...Q), B) throw B;
      return G
    }
  }

  function pY4(A) {
    if (A = {
        ...A
      }, A.fs = mY4(A.fs || uY4), typeof A.retries === "number" && A.retries > 0 || A.retries && typeof A.retries.retries === "number" && A.retries.retries > 0) throw Object.assign(Error("Cannot use retries with the sync api"), {
      code: "ESYNC"
    });
    return A
  }
  h7Q.exports = {
    toPromise: dY4,
    toSync: cY4,
    toSyncOptions: pY4
  }
})
// @from(Ln 51014, Col 4)
qi = U((O2G, Ui) => {
  var cGA = f7Q(),
    {
      toPromise: glA,
      toSync: ulA,
      toSyncOptions: cR1
    } = g7Q();
  async function u7Q(A, Q) {
    let B = await glA(cGA.lock)(A, Q);
    return glA(B)
  }

  function lY4(A, Q) {
    let B = ulA(cGA.lock)(A, cR1(Q));
    return ulA(B)
  }

  function iY4(A, Q) {
    return glA(cGA.unlock)(A, Q)
  }

  function nY4(A, Q) {
    return ulA(cGA.unlock)(A, cR1(Q))
  }

  function aY4(A, Q) {
    return glA(cGA.check)(A, Q)
  }

  function oY4(A, Q) {
    return ulA(cGA.check)(A, cR1(Q))
  }
  Ui.exports = u7Q;
  Ui.exports.lock = u7Q;
  Ui.exports.unlock = iY4;
  Ui.exports.lockSync = lY4;
  Ui.exports.unlockSync = nY4;
  Ui.exports.check = aY4;
  Ui.exports.checkSync = oY4
})
// @from(Ln 51054, Col 4)
gM = U((p7Q) => {
  Object.defineProperty(p7Q, "__esModule", {
    value: !0
  });
  var m7Q = Object.prototype.toString;

  function rY4(A) {
    switch (m7Q.call(A)) {
      case "[object Error]":
      case "[object Exception]":
      case "[object DOMException]":
        return !0;
      default:
        return mlA(A, Error)
    }
  }

  function pGA(A, Q) {
    return m7Q.call(A) === `[object ${Q}]`
  }

  function sY4(A) {
    return pGA(A, "ErrorEvent")
  }

  function tY4(A) {
    return pGA(A, "DOMError")
  }

  function eY4(A) {
    return pGA(A, "DOMException")
  }

  function AJ4(A) {
    return pGA(A, "String")
  }

  function d7Q(A) {
    return typeof A === "object" && A !== null && "__sentry_template_string__" in A && "__sentry_template_values__" in A
  }

  function QJ4(A) {
    return A === null || d7Q(A) || typeof A !== "object" && typeof A !== "function"
  }

  function c7Q(A) {
    return pGA(A, "Object")
  }

  function BJ4(A) {
    return typeof Event < "u" && mlA(A, Event)
  }

  function GJ4(A) {
    return typeof Element < "u" && mlA(A, Element)
  }

  function ZJ4(A) {
    return pGA(A, "RegExp")
  }

  function YJ4(A) {
    return Boolean(A && A.then && typeof A.then === "function")
  }

  function JJ4(A) {
    return c7Q(A) && "nativeEvent" in A && "preventDefault" in A && "stopPropagation" in A
  }

  function XJ4(A) {
    return typeof A === "number" && A !== A
  }

  function mlA(A, Q) {
    try {
      return A instanceof Q
    } catch (B) {
      return !1
    }
  }

  function IJ4(A) {
    return !!(typeof A === "object" && A !== null && (A.__isVue || A._isVue))
  }
  p7Q.isDOMError = tY4;
  p7Q.isDOMException = eY4;
  p7Q.isElement = GJ4;
  p7Q.isError = rY4;
  p7Q.isErrorEvent = sY4;
  p7Q.isEvent = BJ4;
  p7Q.isInstanceOf = mlA;
  p7Q.isNaN = XJ4;
  p7Q.isParameterizedString = d7Q;
  p7Q.isPlainObject = c7Q;
  p7Q.isPrimitive = QJ4;
  p7Q.isRegExp = ZJ4;
  p7Q.isString = AJ4;
  p7Q.isSyntheticEvent = JJ4;
  p7Q.isThenable = YJ4;
  p7Q.isVueViewModel = IJ4
})
// @from(Ln 51155, Col 4)
GqA = U((i7Q) => {
  Object.defineProperty(i7Q, "__esModule", {
    value: !0
  });
  var dlA = gM();

  function MJ4(A, Q = 0) {
    if (typeof A !== "string" || Q === 0) return A;
    return A.length <= Q ? A : `${A.slice(0,Q)}...`
  }

  function RJ4(A, Q) {
    let B = A,
      G = B.length;
    if (G <= 150) return B;
    if (Q > G) Q = G;
    let Z = Math.max(Q - 60, 0);
    if (Z < 5) Z = 0;
    let Y = Math.min(Z + 140, G);
    if (Y > G - 5) Y = G;
    if (Y === G) Z = Math.max(Y - 140, 0);
    if (B = B.slice(Z, Y), Z > 0) B = `'{snip} ${B}`;
    if (Y < G) B += " {snip}";
    return B
  }

  function _J4(A, Q) {
    if (!Array.isArray(A)) return "";
    let B = [];
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      try {
        if (dlA.isVueViewModel(Z)) B.push("[VueViewModel]");
        else B.push(String(Z))
      } catch (Y) {
        B.push("[value cannot be serialized]")
      }
    }
    return B.join(Q)
  }

  function l7Q(A, Q, B = !1) {
    if (!dlA.isString(A)) return !1;
    if (dlA.isRegExp(Q)) return Q.test(A);
    if (dlA.isString(Q)) return B ? A === Q : A.includes(Q);
    return !1
  }

  function jJ4(A, Q = [], B = !1) {
    return Q.some((G) => l7Q(A, G, B))
  }
  i7Q.isMatchingPattern = l7Q;
  i7Q.safeJoin = _J4;
  i7Q.snipLine = RJ4;
  i7Q.stringMatchesSomePattern = jJ4;
  i7Q.truncate = MJ4
})
// @from(Ln 51212, Col 4)
r7Q = U((o7Q) => {
  Object.defineProperty(o7Q, "__esModule", {
    value: !0
  });
  var pR1 = gM(),
    vJ4 = GqA();

  function kJ4(A, Q, B = 250, G, Z, Y, J) {
    if (!Y.exception || !Y.exception.values || !J || !pR1.isInstanceOf(J.originalException, Error)) return;
    let X = Y.exception.values.length > 0 ? Y.exception.values[Y.exception.values.length - 1] : void 0;
    if (X) Y.exception.values = bJ4(lR1(A, Q, Z, J.originalException, G, Y.exception.values, X, 0), B)
  }

  function lR1(A, Q, B, G, Z, Y, J, X) {
    if (Y.length >= B + 1) return Y;
    let I = [...Y];
    if (pR1.isInstanceOf(G[Z], Error)) {
      n7Q(J, X);
      let D = A(Q, G[Z]),
        W = I.length;
      a7Q(D, Z, W, X), I = lR1(A, Q, B, G[Z], Z, [D, ...I], D, W)
    }
    if (Array.isArray(G.errors)) G.errors.forEach((D, W) => {
      if (pR1.isInstanceOf(D, Error)) {
        n7Q(J, X);
        let K = A(Q, D),
          V = I.length;
        a7Q(K, `errors[${W}]`, V, X), I = lR1(A, Q, B, D, Z, [K, ...I], K, V)
      }
    });
    return I
  }

  function n7Q(A, Q) {
    A.mechanism = A.mechanism || {
      type: "generic",
      handled: !0
    }, A.mechanism = {
      ...A.mechanism,
      ...A.type === "AggregateError" && {
        is_exception_group: !0
      },
      exception_id: Q
    }
  }

  function a7Q(A, Q, B, G) {
    A.mechanism = A.mechanism || {
      type: "generic",
      handled: !0
    }, A.mechanism = {
      ...A.mechanism,
      type: "chained",
      source: Q,
      exception_id: B,
      parent_id: G
    }
  }

  function bJ4(A, Q) {
    return A.map((B) => {
      if (B.value) B.value = vJ4.truncate(B.value, Q);
      return B
    })
  }
  o7Q.applyAggregateErrorsToEvent = kJ4
})