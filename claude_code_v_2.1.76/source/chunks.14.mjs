
// @from(Ln 36606, Col 4)
IHA = E(() => {
    u2();
    K81();
    $$A();
    hHA();
    Z81();
    $81();
    CHA();
    Qx();
    dx = bL6.validators;
    c1.forEach(["delete", "get", "head", "options"], function(q) {
        xL6.prototype[q] = function(K, Y) {
            return this.request(bS(Y || {}, {
                method: q,
                url: K,
                data: (Y || {}).data
            }))
        }
    });
    c1.forEach(["post", "put", "patch"], function(q) {
        function K(Y) {
            return function(_, w, O) {
                return this.request(bS(O || {}, {
                    method: q,
                    headers: Y ? {
                        "Content-Type": "multipart/form-data"
                    } : {},
                    url: _,
                    data: w
                }))
            }
        }
        xL6.prototype[q] = K(), xL6.prototype[q + "Form"] = K(!0)
    });
    uL6 = xL6
})
// @from(Ln 36642, Col 0)
class $l1 {
    constructor(A) {
        if (typeof A !== "function") throw TypeError("executor must be a function.");
        let q;
        this.promise = new Promise(function(z) {
            q = z
        });
        let K = this;
        this.promise.then((Y) => {
            if (!K._listeners) return;
            let z = K._listeners.length;
            while (z-- > 0) K._listeners[z](Y);
            K._listeners = null
        }), this.promise.then = (Y) => {
            let z, _ = new Promise((w) => {
                K.subscribe(w), z = w
            }).then(Y);
            return _.cancel = function() {
                K.unsubscribe(z)
            }, _
        }, A(function(z, _, w) {
            if (K.reason) return;
            K.reason = new TV(z, _, w), q(K.reason)
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
        let q = this._listeners.indexOf(A);
        if (q !== -1) this._listeners.splice(q, 1)
    }
    toAbortSignal() {
        let A = new AbortController,
            q = (K) => {
                A.abort(K)
            };
        return this.subscribe(q), A.signal.unsubscribe = () => this.unsubscribe(q), A.signal
    }
    static source() {
        let A;
        return {
            token: new $l1(function(Y) {
                A = Y
            }),
            cancel: A
        }
    }
}
// @from(Ln 36700, Col 4)
bHA
// @from(Ln 36701, Col 4)
xHA = E(() => {
    QA6();
    bHA = $l1
})
// @from(Ln 36706, Col 0)
function Hl1(A) {
    return function(K) {
        return A.apply(null, K)
    }
}
// @from(Ln 36712, Col 0)
function jl1(A) {
    return c1.isObject(A) && A.isAxiosError === !0
}
// @from(Ln 36715, Col 4)
uHA = E(() => {
    u2()
})
// @from(Ln 36718, Col 4)
Jl1
// @from(Ln 36718, Col 9)
mHA
// @from(Ln 36719, Col 4)
BHA = E(() => {
    Jl1 = {
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
    Object.entries(Jl1).forEach(([A, q]) => {
        Jl1[q] = A
    });
    mHA = Jl1
})
// @from(Ln 36791, Col 0)
function gHA(A) {
    let q = new uL6(A),
        K = DL6(uL6.prototype.request, q);
    return c1.extend(K, uL6.prototype, q, {
        allOwnKeys: !0
    }), c1.extend(K, q, null, {
        allOwnKeys: !0
    }), K.create = function(z) {
        return gHA(bS(A, z))
    }, K
}
// @from(Ln 36802, Col 4)
GJ
// @from(Ln 36802, Col 8)
X8
// @from(Ln 36803, Col 4)
FHA = E(() => {
    u2();
    IHA();
    Z81();
    _81();
    Cc1();
    QA6();
    xHA();
    vL6();
    fV();
    uHA();
    Qx();
    wl1();
    BHA();
    GJ = gHA(H$6);
    GJ.Axios = uL6;
    GJ.CanceledError = TV;
    GJ.CancelToken = bHA;
    GJ.isCancel = EL6;
    GJ.VERSION = nA6;
    GJ.toFormData = en;
    GJ.AxiosError = A4;
    GJ.Cancel = GJ.CanceledError;
    GJ.all = function(q) {
        return Promise.all(q)
    };
    GJ.spread = Hl1;
    GJ.isAxiosError = jl1;
    GJ.mergeConfig = bS;
    GJ.AxiosHeaders = I$;
    GJ.formToJSON = (A) => z81(c1.isHTMLForm(A) ? new FormData(A) : A);
    GJ.getAdapter = v81.getAdapter;
    GJ.HttpStatusCode = mHA;
    GJ.default = GJ;
    X8 = GJ
})
// @from(Ln 36839, Col 4)
G$6 = {}
// @from(Ln 36859, Col 4)
IwK
// @from(Ln 36859, Col 9)
bwK
// @from(Ln 36859, Col 14)
xwK
// @from(Ln 36859, Col 19)
uwK
// @from(Ln 36859, Col 24)
mwK
// @from(Ln 36859, Col 29)
BwK
// @from(Ln 36859, Col 34)
gwK
// @from(Ln 36859, Col 39)
FwK
// @from(Ln 36859, Col 44)
pwK
// @from(Ln 36859, Col 49)
QwK
// @from(Ln 36859, Col 54)
UwK
// @from(Ln 36859, Col 59)
dwK
// @from(Ln 36859, Col 64)
cwK
// @from(Ln 36859, Col 69)
lwK
// @from(Ln 36859, Col 74)
iwK
// @from(Ln 36859, Col 79)
nwK
// @from(Ln 36860, Col 4)
kK = E(() => {
    FHA();
    ({
        Axios: IwK,
        AxiosError: bwK,
        CanceledError: xwK,
        isCancel: uwK,
        CancelToken: mwK,
        VERSION: BwK,
        all: gwK,
        Cancel: FwK,
        isAxiosError: pwK,
        spread: QwK,
        toFormData: UwK,
        AxiosHeaders: dwK,
        HttpStatusCode: cwK,
        formToJSON: lwK,
        getAdapter: iwK,
        mergeConfig: nwK
    } = X8)
})
// @from(Ln 36887, Col 0)
async function f$6(A) {
    try {
        return !!await EM(A)
    } catch {
        return !1
    }
}
// @from(Ln 36895, Col 0)
function AOK() {
    if (process.env.CURSOR_TRACE_ID) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor")) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf")) return "windsurf";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("antigravity")) return "antigravity";
    let A = process.env.__CFBundleIdentifier?.toLowerCase();
    if (A?.includes("vscodium")) return "codium";
    if (A?.includes("windsurf")) return "windsurf";
    if (A?.includes("com.google.android.studio")) return "androidstudio";
    if (A) {
        for (let q of Dl1)
            if (A.includes(q)) return q
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
    if (QHA()) return "ssh-session";
    if (process.env.TERM) {
        let q = process.env.TERM;
        if (q.includes("alacritty")) return "alacritty";
        if (q.includes("rxvt")) return "rxvt";
        if (q.includes("termite")) return "termite";
        return process.env.TERM
    }
    if (!process.stdout.isTTY) return "non-interactive";
    return null
}
// @from(Ln 36943, Col 0)
function QHA() {
    return !!(process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY)
}
// @from(Ln 36947, Col 0)
function T$6() {
    let A = process.env.CLAUDE_CODE_HOST_PLATFORM;
    if (A === "win32" || A === "darwin" || A === "linux") return A;
    return Q8.platform
}
// @from(Ln 36952, Col 4)
xD
// @from(Ln 36952, Col 8)
owK
// @from(Ln 36952, Col 13)
awK
// @from(Ln 36952, Col 18)
swK
// @from(Ln 36952, Col 23)
pHA
// @from(Ln 36952, Col 28)
twK
// @from(Ln 36952, Col 33)
ewK = () => {
        return process.env.__CFBundleIdentifier === "com.conductor.app"
    }
// @from(Ln 36955, Col 4)
Dl1
// @from(Ln 36955, Col 9)
qOK
// @from(Ln 36955, Col 14)
Q8
// @from(Ln 36956, Col 4)
d3 = E(() => {
    U4();
    sd1();
    SA();
    A8();
    F5();
    Oy();
    xD = e1(() => {
        if ($1().existsSync(Ml1(c8(), ".config.json"))) return Ml1(c8(), ".config.json");
        let A = `.claude${td1()}.json`;
        return Ml1(process.env.CLAUDE_CONFIG_DIR || rwK(), A)
    }), owK = e1(async () => {
        try {
            let {
                default: A
            } = await Promise.resolve().then(() => (kK(), G$6));
            return await A.head("http://1.1.1.1", {
                signal: AbortSignal.timeout(1000)
            }), !0
        } catch {
            return !1
        }
    });
    awK = e1(async () => {
        let A = [];
        if (await f$6("npm")) A.push("npm");
        if (await f$6("yarn")) A.push("yarn");
        if (await f$6("pnpm")) A.push("pnpm");
        return A
    }), swK = e1(async () => {
        let A = [];
        if (await f$6("bun")) A.push("bun");
        if (await f$6("deno")) A.push("deno");
        if (await f$6("node")) A.push("node");
        return A
    }), pHA = e1(() => {
        try {
            return $1().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")
        } catch (A) {
            return !1
        }
    }), twK = e1(() => {
        try {
            if (!pHA()) return !1;
            let {
                cmd: A
            } = Q11("npm", []);
            return A.startsWith("/mnt/c/")
        } catch (A) {
            return !1
        }
    }), Dl1 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];
    qOK = e1(() => {
        if (t6(process.env.CODESPACES)) return "codespaces";
        if (process.env.GITPOD_WORKSPACE_ID) return "gitpod";
        if (process.env.REPL_ID || process.env.REPL_SLUG) return "replit";
        if (process.env.PROJECT_DOMAIN) return "glitch";
        if (t6(process.env.VERCEL)) return "vercel";
        if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME) return "railway";
        if (t6(process.env.RENDER)) return "render";
        if (t6(process.env.NETLIFY)) return "netlify";
        if (process.env.DYNO) return "heroku";
        if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID) return "fly.io";
        if (t6(process.env.CF_PAGES)) return "cloudflare-pages";
        if (process.env.DENO_DEPLOYMENT_ID) return "deno-deploy";
        if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws-lambda";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE") return "aws-fargate";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2") return "aws-ecs";
        try {
            if ($1().readFileSync("/sys/hypervisor/uuid", {
                    encoding: "utf8"
                }).trim().toLowerCase().startsWith("ec2")) return "aws-ec2"
        } catch {}
        if (process.env.K_SERVICE) return "gcp-cloud-run";
        if (process.env.GOOGLE_CLOUD_PROJECT) return "gcp";
        if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU) return "azure-app-service";
        if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) return "azure-functions";
        if (process.env.APP_URL?.includes("ondigitalocean.app")) return "digitalocean-app-platform";
        if (process.env.SPACE_CREATOR_USER_ID) return "huggingface-spaces";
        if (t6(process.env.GITHUB_ACTIONS)) return "github-actions";
        if (t6(process.env.GITLAB_CI)) return "gitlab-ci";
        if (process.env.CIRCLECI) return "circleci";
        if (process.env.BUILDKITE) return "buildkite";
        if (t6(!1)) return "ci";
        if (process.env.KUBERNETES_SERVICE_HOST) return "kubernetes";
        try {
            if ($1().existsSync("/.dockerenv")) return "docker"
        } catch {}
        if (Q8.platform === "darwin") return "unknown-darwin";
        if (Q8.platform === "linux") return "unknown-linux";
        if (Q8.platform === "win32") return "unknown-win32";
        return "unknown"
    });
    Q8 = {
        hasInternetAccess: owK,
        isCI: t6(!1),
        platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
        arch: process.arch,
        nodeVersion: process.version,
        terminal: AOK(),
        isSSH: QHA,
        getPackageManagers: awK,
        getRuntimes: swK,
        isRunningWithBun: e1(A$6),
        isWslEnvironment: pHA,
        isNpmFromWindowsPath: twK,
        isConductor: ewK,
        detectDeploymentEnvironment: qOK
    }
})
// @from(Ln 37070, Col 0)
function dHA(A, q) {
    return UHA.run(A, q)
}
// @from(Ln 37074, Col 0)
function k81() {
    return UHA.getStore() ?? OS()
}
// @from(Ln 37078, Col 0)
function G1() {
    try {
        return k81()
    } catch {
        return AA()
    }
}
// @from(Ln 37085, Col 4)
UHA
// @from(Ln 37086, Col 4)
lA = E(() => {
    T1();
    UHA = new KOK
})
// @from(Ln 37091, Col 0)
function v$6(A) {
    return A.sort((q, K) => {
        let Y = K.modified.getTime() - q.modified.getTime();
        if (Y !== 0) return Y;
        return K.created.getTime() - q.created.getTime()
    })
}
// @from(Ln 37102, Col 0)
function Wl1(A, {
    suffix: q = "nodejs"
} = {}) {
    if (typeof A !== "string") throw TypeError(`Expected a string, got ${typeof A}`);
    if (q) A += `-${q}`;
    if (Xl1.platform === "darwin") return YOK(A);
    if (Xl1.platform === "win32") return zOK(A);
    return _OK(A)
}
// @from(Ln 37111, Col 4)
Kr
// @from(Ln 37111, Col 8)
Pl1
// @from(Ln 37111, Col 13)
N$6
// @from(Ln 37111, Col 18)
YOK = (A) => {
        let q = b$.join(Kr, "Library");
        return {
            data: b$.join(q, "Application Support", A),
            config: b$.join(q, "Preferences", A),
            cache: b$.join(q, "Caches", A),
            log: b$.join(q, "Logs", A),
            temp: b$.join(Pl1, A)
        }
    }
// @from(Ln 37121, Col 4)
zOK = (A) => {
        let q = N$6.APPDATA || b$.join(Kr, "AppData", "Roaming"),
            K = N$6.LOCALAPPDATA || b$.join(Kr, "AppData", "Local");
        return {
            data: b$.join(K, A, "Data"),
            config: b$.join(q, A, "Config"),
            cache: b$.join(K, A, "Cache"),
            log: b$.join(K, A, "Log"),
            temp: b$.join(Pl1, A)
        }
    }
// @from(Ln 37132, Col 4)
_OK = (A) => {
        let q = b$.basename(Kr);
        return {
            data: b$.join(N$6.XDG_DATA_HOME || b$.join(Kr, ".local", "share"), A),
            config: b$.join(N$6.XDG_CONFIG_HOME || b$.join(Kr, ".config"), A),
            cache: b$.join(N$6.XDG_CACHE_HOME || b$.join(Kr, ".cache"), A),
            log: b$.join(N$6.XDG_STATE_HOME || b$.join(Kr, ".local", "state"), A),
            temp: b$.join(Pl1, q, A)
        }
    }
// @from(Ln 37142, Col 4)
lHA = E(() => {
    Kr = cHA.homedir(), Pl1 = cHA.tmpdir(), {
        env: N$6
    } = Xl1
})
// @from(Ln 37151, Col 0)
function nHA(A) {
    let q = A.replace(/[^a-zA-Z0-9]/g, "-");
    if (q.length <= iHA) return q;
    let K = 0;
    for (let Y = 0; Y < A.length; Y++) K = (K << 5) - K + A.charCodeAt(Y), K |= 0;
    return `${q.slice(0,iHA)}-${Math.abs(K).toString(36)}`
}
// @from(Ln 37159, Col 0)
function L81(A) {
    return nHA(A)
}
// @from(Ln 37162, Col 4)
y81
// @from(Ln 37162, Col 9)
iHA = 200
// @from(Ln 37163, Col 4)
rA6
// @from(Ln 37164, Col 4)
R81 = E(() => {
    lHA();
    SA();
    y81 = Wl1("claude-cli");
    rA6 = {
        baseLogs: () => E81(y81.cache, L81($1().cwd())),
        errors: () => E81(y81.cache, L81($1().cwd()), "errors"),
        messages: () => E81(y81.cache, L81($1().cwd()), "messages"),
        mcpLogs: (A) => E81(y81.cache, L81($1().cwd()), `mcp-logs-${nHA(A)}`)
    }
})
// @from(Ln 37175, Col 4)
XP = "command-name"
// @from(Ln 37176, Col 4)
PP = "command-message"
// @from(Ln 37177, Col 4)
Zl1 = "command-args"
// @from(Ln 37178, Col 4)
rHA = "bash-stdout"
// @from(Ln 37179, Col 4)
oHA = "bash-stderr"
// @from(Ln 37180, Col 4)
WP = "local-command-stdout"
// @from(Ln 37181, Col 4)
oA6 = "local-command-stderr"
// @from(Ln 37182, Col 4)
mL6 = "local-command-caveat"
// @from(Ln 37183, Col 4)
h81
// @from(Ln 37183, Col 9)
vV = "tick"
// @from(Ln 37184, Col 4)
EH = "task-notification"
// @from(Ln 37185, Col 4)
JG = "task-id"
// @from(Ln 37186, Col 4)
NV = "tool-use-id"
// @from(Ln 37187, Col 4)
V$6 = "task-type"
// @from(Ln 37188, Col 4)
VV = "output-file"
// @from(Ln 37189, Col 4)
uD = "status"
// @from(Ln 37190, Col 4)
mD = "summary"
// @from(Ln 37191, Col 4)
Gl1 = "worktree"
// @from(Ln 37192, Col 4)
fl1 = "worktreePath"
// @from(Ln 37193, Col 4)
Tl1 = "worktreeBranch"
// @from(Ln 37194, Col 4)
aHA = "ultraplan"
// @from(Ln 37195, Col 4)
fj = "teammate-message"
// @from(Ln 37196, Col 4)
S81
// @from(Ln 37196, Col 9)
C81
// @from(Ln 37197, Col 4)
vz = E(() => {
    h81 = ["bash-input", "bash-stdout", "bash-stderr", "local-command-stdout", "local-command-stderr", "local-command-caveat"], S81 = ["help", "-h", "--help"], C81 = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"]
})
// @from(Ln 37201, Col 0)
function Yr(A) {
    return A.replace(sHA, "").trim() || A
}
// @from(Ln 37205, Col 0)
function k$6(A) {
    return A.replace(sHA, "").trim()
}
// @from(Ln 37208, Col 4)
wOK
// @from(Ln 37208, Col 9)
sHA
// @from(Ln 37209, Col 4)
E$6 = E(() => {
    vz();
    wOK = ["ide_opened_file", "ide_selection", "command-name", "command-message", "command-args", "session-start-hook", vV, "goal", ...h81], sHA = new RegExp(wOK.map((A) => `<${A}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${A}>\\n?`).join("|"), "g")
})
// @from(Ln 37214, Col 0)
function zr(A, q) {
    let K = A.firstPrompt?.startsWith(`<${vV}>`),
        Y = A.firstPrompt ? k$6(A.firstPrompt) : "",
        z = Y && !K,
        _ = A.agentName || A.customTitle || A.summary || (z ? Y : void 0) || q || (K ? "Autonomous session" : void 0) || (A.sessionId ? A.sessionId.slice(0, 8) : "") || "";
    return Yr(_).trim()
}
// @from(Ln 37222, Col 0)
function tHA(A) {
    return A.toISOString().replace(/[:.]/g, "-")
}
// @from(Ln 37226, Col 0)
function $OK(A) {
    if (I81.length >= OOK) I81.shift();
    I81.push(A)
}
// @from(Ln 37231, Col 0)
function eHA(A) {
    if (xS !== null) return;
    if (xS = A, y$6.length > 0) {
        let q = [...y$6];
        y$6.length = 0;
        for (let K of q) switch (K.type) {
            case "error":
                xS.logError(K.error);
                break;
            case "mcpError":
                xS.logMCPError(K.serverName, K.error);
                break;
            case "mcpDebug":
                xS.logMCPDebug(K.serverName, K.message);
                break
        }
    }
}
// @from(Ln 37250, Col 0)
function _6(A) {
    let q = A instanceof Error ? A : Error(String(A));
    try {
        if (t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_ERROR_REPORTING || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
        let Y = {
            error: q.stack || q.message,
            timestamp: new Date().toISOString()
        };
        if ($OK(Y), xS === null) {
            y$6.push({
                type: "error",
                error: q
            });
            return
        }
        xS.logError(q)
    } catch {}
}
// @from(Ln 37269, Col 0)
function L$6() {
    return [...I81]
}
// @from(Ln 37273, Col 0)
function EY(A, q) {
    try {
        if (xS === null) {
            y$6.push({
                type: "mcpError",
                serverName: A,
                error: q
            });
            return
        }
        xS.logMCPError(A, q)
    } catch {}
}
// @from(Ln 37287, Col 0)
function n1(A, q) {
    try {
        if (xS === null) {
            y$6.push({
                type: "mcpDebug",
                serverName: A,
                message: q
            });
            return
        }
        xS.logMCPDebug(A, q)
    } catch {}
}
// @from(Ln 37301, Col 0)
function b81(A, q) {
    if (!q || q !== "repl_main_thread") return;
    let {
        messages: K,
        ...Y
    } = A;
    Su1(Y)
}
// @from(Ln 37309, Col 4)
OOK = 100
// @from(Ln 37310, Col 4)
I81
// @from(Ln 37310, Col 9)
y$6
// @from(Ln 37310, Col 14)
xS = null
// @from(Ln 37311, Col 4)
_oz
// @from(Ln 37312, Col 4)
k1 = E(() => {
    T1();
    R81();
    U4();
    A8();
    g1();
    vz();
    E$6();
    I81 = [];
    y$6 = [];
    _oz = e1(() => {
        return process.argv.includes("--hard-fail")
    })
})
// @from(Ln 37327, Col 0)
function gL6(A, q = !1) {
    let K = A.length,
        Y = 0,
        z = "",
        _ = 0,
        w = 16,
        O = 0,
        $ = 0,
        H = 0,
        j = 0,
        J = 0;

    function M(f, v) {
        let N = 0,
            V = 0;
        while (N < f || !v) {
            let L = A.charCodeAt(Y);
            if (L >= 48 && L <= 57) V = V * 16 + L - 48;
            else if (L >= 65 && L <= 70) V = V * 16 + L - 65 + 10;
            else if (L >= 97 && L <= 102) V = V * 16 + L - 97 + 10;
            else break;
            Y++, N++
        }
        if (N < f) V = -1;
        return V
    }

    function D(f) {
        Y = f, z = "", _ = 0, w = 16, J = 0
    }

    function X() {
        let f = Y;
        if (A.charCodeAt(Y) === 48) Y++;
        else {
            Y++;
            while (Y < A.length && R$6(A.charCodeAt(Y))) Y++
        }
        if (Y < A.length && A.charCodeAt(Y) === 46)
            if (Y++, Y < A.length && R$6(A.charCodeAt(Y))) {
                Y++;
                while (Y < A.length && R$6(A.charCodeAt(Y))) Y++
            } else return J = 3, A.substring(f, Y);
        let v = Y;
        if (Y < A.length && (A.charCodeAt(Y) === 69 || A.charCodeAt(Y) === 101)) {
            if (Y++, Y < A.length && A.charCodeAt(Y) === 43 || A.charCodeAt(Y) === 45) Y++;
            if (Y < A.length && R$6(A.charCodeAt(Y))) {
                Y++;
                while (Y < A.length && R$6(A.charCodeAt(Y))) Y++;
                v = Y
            } else J = 3
        }
        return A.substring(f, v)
    }

    function P() {
        let f = "",
            v = Y;
        while (!0) {
            if (Y >= K) {
                f += A.substring(v, Y), J = 2;
                break
            }
            let N = A.charCodeAt(Y);
            if (N === 34) {
                f += A.substring(v, Y), Y++;
                break
            }
            if (N === 92) {
                if (f += A.substring(v, Y), Y++, Y >= K) {
                    J = 2;
                    break
                }
                switch (A.charCodeAt(Y++)) {
                    case 34:
                        f += '"';
                        break;
                    case 92:
                        f += "\\";
                        break;
                    case 47:
                        f += "/";
                        break;
                    case 98:
                        f += "\b";
                        break;
                    case 102:
                        f += "\f";
                        break;
                    case 110:
                        f += `
`;
                        break;
                    case 114:
                        f += "\r";
                        break;
                    case 116:
                        f += "\t";
                        break;
                    case 117:
                        let L = M(4, !0);
                        if (L >= 0) f += String.fromCharCode(L);
                        else J = 4;
                        break;
                    default:
                        J = 5
                }
                v = Y;
                continue
            }
            if (N >= 0 && N <= 31)
                if (BL6(N)) {
                    f += A.substring(v, Y), J = 2;
                    break
                } else J = 6;
            Y++
        }
        return f
    }

    function W() {
        if (z = "", J = 0, _ = Y, $ = O, j = H, Y >= K) return _ = K, w = 17;
        let f = A.charCodeAt(Y);
        if (vl1(f)) {
            do Y++, z += String.fromCharCode(f), f = A.charCodeAt(Y); while (vl1(f));
            return w = 15
        }
        if (BL6(f)) {
            if (Y++, z += String.fromCharCode(f), f === 13 && A.charCodeAt(Y) === 10) Y++, z += `
`;
            return O++, H = Y, w = 14
        }
        switch (f) {
            case 123:
                return Y++, w = 1;
            case 125:
                return Y++, w = 2;
            case 91:
                return Y++, w = 3;
            case 93:
                return Y++, w = 4;
            case 58:
                return Y++, w = 6;
            case 44:
                return Y++, w = 5;
            case 34:
                return Y++, z = P(), w = 10;
            case 47:
                let v = Y - 1;
                if (A.charCodeAt(Y + 1) === 47) {
                    Y += 2;
                    while (Y < K) {
                        if (BL6(A.charCodeAt(Y))) break;
                        Y++
                    }
                    return z = A.substring(v, Y), w = 12
                }
                if (A.charCodeAt(Y + 1) === 42) {
                    Y += 2;
                    let N = K - 1,
                        V = !1;
                    while (Y < N) {
                        let L = A.charCodeAt(Y);
                        if (L === 42 && A.charCodeAt(Y + 1) === 47) {
                            Y += 2, V = !0;
                            break
                        }
                        if (Y++, BL6(L)) {
                            if (L === 13 && A.charCodeAt(Y) === 10) Y++;
                            O++, H = Y
                        }
                    }
                    if (!V) Y++, J = 1;
                    return z = A.substring(v, Y), w = 13
                }
                return z += String.fromCharCode(f), Y++, w = 16;
            case 45:
                if (z += String.fromCharCode(f), Y++, Y === K || !R$6(A.charCodeAt(Y))) return w = 16;
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
                return z += X(), w = 11;
            default:
                while (Y < K && Z(f)) Y++, f = A.charCodeAt(Y);
                if (_ !== Y) {
                    switch (z = A.substring(_, Y), z) {
                        case "true":
                            return w = 8;
                        case "false":
                            return w = 9;
                        case "null":
                            return w = 7
                    }
                    return w = 16
                }
                return z += String.fromCharCode(f), Y++, w = 16
        }
    }

    function Z(f) {
        if (vl1(f) || BL6(f)) return !1;
        switch (f) {
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

    function G() {
        let f;
        do f = W(); while (f >= 12 && f <= 15);
        return f
    }
    return {
        setPosition: D,
        getPosition: () => Y,
        scan: q ? G : W,
        getToken: () => w,
        getTokenValue: () => z,
        getTokenOffset: () => _,
        getTokenLength: () => Y - _,
        getTokenStartLine: () => $,
        getTokenStartCharacter: () => _ - j,
        getTokenError: () => J
    }
}
// @from(Ln 37568, Col 0)
function vl1(A) {
    return A === 32 || A === 9
}
// @from(Ln 37572, Col 0)
function BL6(A) {
    return A === 10 || A === 13
}
// @from(Ln 37576, Col 0)
function R$6(A) {
    return A >= 48 && A <= 57
}
// @from(Ln 37579, Col 4)
AjA
// @from(Ln 37580, Col 4)
x81 = E(() => {
    (function(A) {
        A[A.lineFeed = 10] = "lineFeed", A[A.carriageReturn = 13] = "carriageReturn", A[A.space = 32] = "space", A[A._0 = 48] = "_0", A[A._1 = 49] = "_1", A[A._2 = 50] = "_2", A[A._3 = 51] = "_3", A[A._4 = 52] = "_4", A[A._5 = 53] = "_5", A[A._6 = 54] = "_6", A[A._7 = 55] = "_7", A[A._8 = 56] = "_8", A[A._9 = 57] = "_9", A[A.a = 97] = "a", A[A.b = 98] = "b", A[A.c = 99] = "c", A[A.d = 100] = "d", A[A.e = 101] = "e", A[A.f = 102] = "f", A[A.g = 103] = "g", A[A.h = 104] = "h", A[A.i = 105] = "i", A[A.j = 106] = "j", A[A.k = 107] = "k", A[A.l = 108] = "l", A[A.m = 109] = "m", A[A.n = 110] = "n", A[A.o = 111] = "o", A[A.p = 112] = "p", A[A.q = 113] = "q", A[A.r = 114] = "r", A[A.s = 115] = "s", A[A.t = 116] = "t", A[A.u = 117] = "u", A[A.v = 118] = "v", A[A.w = 119] = "w", A[A.x = 120] = "x", A[A.y = 121] = "y", A[A.z = 122] = "z", A[A.A = 65] = "A", A[A.B = 66] = "B", A[A.C = 67] = "C", A[A.D = 68] = "D", A[A.E = 69] = "E", A[A.F = 70] = "F", A[A.G = 71] = "G", A[A.H = 72] = "H", A[A.I = 73] = "I", A[A.J = 74] = "J", A[A.K = 75] = "K", A[A.L = 76] = "L", A[A.M = 77] = "M", A[A.N = 78] = "N", A[A.O = 79] = "O", A[A.P = 80] = "P", A[A.Q = 81] = "Q", A[A.R = 82] = "R", A[A.S = 83] = "S", A[A.T = 84] = "T", A[A.U = 85] = "U", A[A.V = 86] = "V", A[A.W = 87] = "W", A[A.X = 88] = "X", A[A.Y = 89] = "Y", A[A.Z = 90] = "Z", A[A.asterisk = 42] = "asterisk", A[A.backslash = 92] = "backslash", A[A.closeBrace = 125] = "closeBrace", A[A.closeBracket = 93] = "closeBracket", A[A.colon = 58] = "colon", A[A.comma = 44] = "comma", A[A.dot = 46] = "dot", A[A.doubleQuote = 34] = "doubleQuote", A[A.minus = 45] = "minus", A[A.openBrace = 123] = "openBrace", A[A.openBracket = 91] = "openBracket", A[A.plus = 43] = "plus", A[A.slash = 47] = "slash", A[A.formFeed = 12] = "formFeed", A[A.tab = 9] = "tab"
    })(AjA || (AjA = {}))
})
// @from(Ln 37585, Col 4)
kV
// @from(Ln 37585, Col 8)
Nl1
// @from(Ln 37585, Col 13)
qjA
// @from(Ln 37586, Col 4)
KjA = E(() => {
    kV = Array(20).fill(0).map((A, q) => {
        return " ".repeat(q)
    }), Nl1 = {
        " ": {
            "\n": Array(200).fill(0).map((A, q) => {
                return `
` + " ".repeat(q)
            }),
            "\r": Array(200).fill(0).map((A, q) => {
                return "\r" + " ".repeat(q)
            }),
            "\r\n": Array(200).fill(0).map((A, q) => {
                return `\r
` + " ".repeat(q)
            })
        },
        "\t": {
            "\n": Array(200).fill(0).map((A, q) => {
                return `
` + "\t".repeat(q)
            }),
            "\r": Array(200).fill(0).map((A, q) => {
                return "\r" + "\t".repeat(q)
            }),
            "\r\n": Array(200).fill(0).map((A, q) => {
                return `\r
` + "\t".repeat(q)
            })
        }
    }, qjA = [`
`, "\r", `\r
`]
})
// @from(Ln 37621, Col 0)
function Vl1(A, q, K) {
    let Y, z, _, w, O;
    if (q) {
        w = q.offset, O = w + q.length, _ = w;
        while (_ > 0 && !FL6(A, _ - 1)) _--;
        let N = O;
        while (N < A.length && !FL6(A, N)) N++;
        z = A.substring(_, N), Y = jOK(z, K)
    } else z = A, Y = 0, _ = 0, w = 0, O = A.length;
    let $ = JOK(K, A),
        H = qjA.includes($),
        j = 0,
        J = 0,
        M;
    if (K.insertSpaces) M = kV[K.tabSize || 4] ?? h$6(kV[1], K.tabSize || 4);
    else M = "\t";
    let D = M === "\t" ? "\t" : " ",
        X = gL6(z, !1),
        P = !1;

    function W() {
        if (j > 1) return h$6($, j) + h$6(M, Y + J);
        let N = M.length * (Y + J);
        if (!H || N > Nl1[D][$].length) return $ + h$6(M, Y + J);
        if (N <= 0) return $;
        return Nl1[D][$][N]
    }

    function Z() {
        let N = X.scan();
        j = 0;
        while (N === 15 || N === 14) {
            if (N === 14 && K.keepLines) j += 1;
            else if (N === 14) j = 1;
            N = X.scan()
        }
        return P = N === 16 || X.getTokenError() !== 0, N
    }
    let G = [];

    function f(N, V, L) {
        if (!P && (!q || V < O && L > w) && A.substring(V, L) !== N) G.push({
            offset: V,
            length: L - V,
            content: N
        })
    }
    let v = Z();
    if (K.keepLines && j > 0) f(h$6($, j), 0, 0);
    if (v !== 17) {
        let N = X.getTokenOffset() + _,
            V = M.length * Y < 20 && K.insertSpaces ? kV[M.length * Y] : h$6(M, Y);
        f(V, _, N)
    }
    while (v !== 17) {
        let N = X.getTokenOffset() + X.getTokenLength() + _,
            V = Z(),
            L = "",
            h = !1;
        while (j === 0 && (V === 12 || V === 13)) {
            let u = X.getTokenOffset() + _;
            f(kV[1], N, u), N = X.getTokenOffset() + X.getTokenLength() + _, h = V === 12, L = h ? W() : "", V = Z()
        }
        if (V === 2) {
            if (v !== 1) J--;
            if (K.keepLines && j > 0 || !K.keepLines && v !== 1) L = W();
            else if (K.keepLines) L = kV[1]
        } else if (V === 4) {
            if (v !== 3) J--;
            if (K.keepLines && j > 0 || !K.keepLines && v !== 3) L = W();
            else if (K.keepLines) L = kV[1]
        } else {
            switch (v) {
                case 3:
                case 1:
                    if (J++, K.keepLines && j > 0 || !K.keepLines) L = W();
                    else L = kV[1];
                    break;
                case 5:
                    if (K.keepLines && j > 0 || !K.keepLines) L = W();
                    else L = kV[1];
                    break;
                case 12:
                    L = W();
                    break;
                case 13:
                    if (j > 0) L = W();
                    else if (!h) L = kV[1];
                    break;
                case 6:
                    if (K.keepLines && j > 0) L = W();
                    else if (!h) L = kV[1];
                    break;
                case 10:
                    if (K.keepLines && j > 0) L = W();
                    else if (V === 6 && !h) L = "";
                    break;
                case 7:
                case 8:
                case 9:
                case 11:
                case 2:
                case 4:
                    if (K.keepLines && j > 0) L = W();
                    else if ((V === 12 || V === 13) && !h) L = kV[1];
                    else if (V !== 5 && V !== 17) P = !0;
                    break;
                case 16:
                    P = !0;
                    break
            }
            if (j > 0 && (V === 12 || V === 13)) L = W()
        }
        if (V === 17)
            if (K.keepLines && j > 0) L = W();
            else L = K.insertFinalNewline ? $ : "";
        let R = X.getTokenOffset() + _;
        f(L, N, R), v = V
    }
    return G
}
// @from(Ln 37743, Col 0)
function h$6(A, q) {
    let K = "";
    for (let Y = 0; Y < q; Y++) K += A;
    return K
}
// @from(Ln 37749, Col 0)
function jOK(A, q) {
    let K = 0,
        Y = 0,
        z = q.tabSize || 4;
    while (K < A.length) {
        let _ = A.charAt(K);
        if (_ === kV[1]) Y++;
        else if (_ === "\t") Y += z;
        else break;
        K++
    }
    return Math.floor(Y / z)
}
// @from(Ln 37763, Col 0)
function JOK(A, q) {
    for (let K = 0; K < q.length; K++) {
        let Y = q.charAt(K);
        if (Y === "\r") {
            if (K + 1 < q.length && q.charAt(K + 1) === `
`) return `\r
`;
            return "\r"
        } else if (Y === `
`) return `
`
    }
    return A && A.eol || `
`
}
// @from(Ln 37779, Col 0)
function FL6(A, q) {
    return `\r
`.indexOf(A.charAt(q)) !== -1
}
// @from(Ln 37783, Col 4)
kl1 = E(() => {
    x81();
    KjA()
})
// @from(Ln 37788, Col 0)
function YjA(A, q = [], K = pL6.DEFAULT) {
    let Y = null,
        z = [],
        _ = [];

    function w($) {
        if (Array.isArray(z)) z.push($);
        else if (Y !== null) z[Y] = $
    }
    return yl1(A, {
        onObjectBegin: () => {
            let $ = {};
            w($), _.push(z), z = $, Y = null
        },
        onObjectProperty: ($) => {
            Y = $
        },
        onObjectEnd: () => {
            z = _.pop()
        },
        onArrayBegin: () => {
            let $ = [];
            w($), _.push(z), z = $, Y = null
        },
        onArrayEnd: () => {
            z = _.pop()
        },
        onLiteralValue: w,
        onError: ($, H, j) => {
            q.push({
                error: $,
                offset: H,
                length: j
            })
        }
    }, K), z[0]
}
// @from(Ln 37826, Col 0)
function El1(A, q = [], K = pL6.DEFAULT) {
    let Y = {
        type: "array",
        offset: -1,
        length: -1,
        children: [],
        parent: void 0
    };

    function z($) {
        if (Y.type === "property") Y.length = $ - Y.offset, Y = Y.parent
    }

    function _($) {
        return Y.children.push($), $
    }
    yl1(A, {
        onObjectBegin: ($) => {
            Y = _({
                type: "object",
                offset: $,
                length: -1,
                parent: Y,
                children: []
            })
        },
        onObjectProperty: ($, H, j) => {
            Y = _({
                type: "property",
                offset: H,
                length: -1,
                parent: Y,
                children: []
            }), Y.children.push({
                type: "string",
                value: $,
                offset: H,
                length: j,
                parent: Y
            })
        },
        onObjectEnd: ($, H) => {
            z($ + H), Y.length = $ + H - Y.offset, Y = Y.parent, z($ + H)
        },
        onArrayBegin: ($, H) => {
            Y = _({
                type: "array",
                offset: $,
                length: -1,
                parent: Y,
                children: []
            })
        },
        onArrayEnd: ($, H) => {
            Y.length = $ + H - Y.offset, Y = Y.parent, z($ + H)
        },
        onLiteralValue: ($, H, j) => {
            _({
                type: DOK($),
                offset: H,
                length: j,
                parent: Y,
                value: $
            }), z(H + j)
        },
        onSeparator: ($, H, j) => {
            if (Y.type === "property") {
                if ($ === ":") Y.colonOffset = H;
                else if ($ === ",") z(H)
            }
        },
        onError: ($, H, j) => {
            q.push({
                error: $,
                offset: H,
                length: j
            })
        }
    }, K);
    let O = Y.children[0];
    if (O) delete O.parent;
    return O
}
// @from(Ln 37910, Col 0)
function u81(A, q) {
    if (!A) return;
    let K = A;
    for (let Y of q)
        if (typeof Y === "string") {
            if (K.type !== "object" || !Array.isArray(K.children)) return;
            let z = !1;
            for (let _ of K.children)
                if (Array.isArray(_.children) && _.children[0].value === Y && _.children.length === 2) {
                    K = _.children[1], z = !0;
                    break
                } if (!z) return
        } else {
            let z = Y;
            if (K.type !== "array" || z < 0 || !Array.isArray(K.children) || z >= K.children.length) return;
            K = K.children[z]
        } return K
}
// @from(Ln 37929, Col 0)
function yl1(A, q, K = pL6.DEFAULT) {
    let Y = gL6(A, !1),
        z = [];

    function _(g) {
        return g ? () => g(Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter()) : () => !0
    }

    function w(g) {
        return g ? () => g(Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter(), () => z.slice()) : () => !0
    }

    function O(g) {
        return g ? (B) => g(B, Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter()) : () => !0
    }

    function $(g) {
        return g ? (B) => g(B, Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter(), () => z.slice()) : () => !0
    }
    let H = w(q.onObjectBegin),
        j = $(q.onObjectProperty),
        J = _(q.onObjectEnd),
        M = w(q.onArrayBegin),
        D = _(q.onArrayEnd),
        X = $(q.onLiteralValue),
        P = O(q.onSeparator),
        W = _(q.onComment),
        Z = O(q.onError),
        G = K && K.disallowComments,
        f = K && K.allowTrailingComma;

    function v() {
        while (!0) {
            let g = Y.scan();
            switch (Y.getTokenError()) {
                case 4:
                    N(14);
                    break;
                case 5:
                    N(15);
                    break;
                case 3:
                    N(13);
                    break;
                case 1:
                    if (!G) N(11);
                    break;
                case 2:
                    N(12);
                    break;
                case 6:
                    N(16);
                    break
            }
            switch (g) {
                case 12:
                case 13:
                    if (G) N(10);
                    else W();
                    break;
                case 16:
                    N(1);
                    break;
                case 15:
                case 14:
                    break;
                default:
                    return g
            }
        }
    }

    function N(g, B = [], b = []) {
        if (Z(g), B.length + b.length > 0) {
            let p = Y.getToken();
            while (p !== 17) {
                if (B.indexOf(p) !== -1) {
                    v();
                    break
                } else if (b.indexOf(p) !== -1) break;
                p = v()
            }
        }
    }

    function V(g) {
        let B = Y.getTokenValue();
        if (g) X(B);
        else j(B), z.push(B);
        return v(), !0
    }

    function L() {
        switch (Y.getToken()) {
            case 11:
                let g = Y.getTokenValue(),
                    B = Number(g);
                if (isNaN(B)) N(2), B = 0;
                X(B);
                break;
            case 7:
                X(null);
                break;
            case 8:
                X(!0);
                break;
            case 9:
                X(!1);
                break;
            default:
                return !1
        }
        return v(), !0
    }

    function h() {
        if (Y.getToken() !== 10) return N(3, [], [2, 5]), !1;
        if (V(!1), Y.getToken() === 6) {
            if (P(":"), v(), !I()) N(4, [], [2, 5])
        } else N(5, [], [2, 5]);
        return z.pop(), !0
    }

    function R() {
        H(), v();
        let g = !1;
        while (Y.getToken() !== 2 && Y.getToken() !== 17) {
            if (Y.getToken() === 5) {
                if (!g) N(4, [], []);
                if (P(","), v(), Y.getToken() === 2 && f) break
            } else if (g) N(6, [], []);
            if (!h()) N(4, [], [2, 5]);
            g = !0
        }
        if (J(), Y.getToken() !== 2) N(7, [2], []);
        else v();
        return !0
    }

    function u() {
        M(), v();
        let g = !0,
            B = !1;
        while (Y.getToken() !== 4 && Y.getToken() !== 17) {
            if (Y.getToken() === 5) {
                if (!B) N(4, [], []);
                if (P(","), v(), Y.getToken() === 4 && f) break
            } else if (B) N(6, [], []);
            if (g) z.push(0), g = !1;
            else z[z.length - 1]++;
            if (!I()) N(4, [], [4, 5]);
            B = !0
        }
        if (D(), !g) z.pop();
        if (Y.getToken() !== 4) N(8, [4], []);
        else v();
        return !0
    }

    function I() {
        switch (Y.getToken()) {
            case 3:
                return u();
            case 1:
                return R();
            case 10:
                return V(!0);
            default:
                return L()
        }
    }
    if (v(), Y.getToken() === 17) {
        if (K.allowEmptyContent) return !0;
        return N(4, [], []), !1
    }
    if (!I()) return N(4, [], []), !1;
    if (Y.getToken() !== 17) N(9, [], []);
    return !0
}
// @from(Ln 38109, Col 0)
function DOK(A) {
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
// @from(Ln 38126, Col 4)
pL6
// @from(Ln 38127, Col 4)
Ll1 = E(() => {
    x81();
    (function(A) {
        A.DEFAULT = {
            allowTrailingComma: !1
        }
    })(pL6 || (pL6 = {}))
})
// @from(Ln 38136, Col 0)
function zjA(A, q, K, Y) {
    let z = q.slice(),
        w = El1(A, []),
        O = void 0,
        $ = void 0;
    while (z.length > 0)
        if ($ = z.pop(), O = u81(w, z), O === void 0 && K !== void 0)
            if (typeof $ === "string") K = {
                [$]: K
            };
            else K = [K];
    else break;
    if (!O) {
        if (K === void 0) throw Error("Can not delete in empty document");
        return aA6(A, {
            offset: w ? w.offset : 0,
            length: w ? w.length : 0,
            content: JSON.stringify(K)
        }, Y)
    } else if (O.type === "object" && typeof $ === "string" && Array.isArray(O.children)) {
        let H = u81(O, [$]);
        if (H !== void 0)
            if (K === void 0) {
                if (!H.parent) throw Error("Malformed AST");
                let j = O.children.indexOf(H.parent),
                    J, M = H.parent.offset + H.parent.length;
                if (j > 0) {
                    let D = O.children[j - 1];
                    J = D.offset + D.length
                } else if (J = O.offset + 1, O.children.length > 1) M = O.children[1].offset;
                return aA6(A, {
                    offset: J,
                    length: M - J,
                    content: ""
                }, Y)
            } else return aA6(A, {
                offset: H.offset,
                length: H.length,
                content: JSON.stringify(K)
            }, Y);
        else {
            if (K === void 0) return [];
            let j = `${JSON.stringify($)}: ${JSON.stringify(K)}`,
                J = Y.getInsertionIndex ? Y.getInsertionIndex(O.children.map((D) => D.children[0].value)) : O.children.length,
                M;
            if (J > 0) {
                let D = O.children[J - 1];
                M = {
                    offset: D.offset + D.length,
                    length: 0,
                    content: "," + j
                }
            } else if (O.children.length === 0) M = {
                offset: O.offset + 1,
                length: 0,
                content: j
            };
            else M = {
                offset: O.offset + 1,
                length: 0,
                content: j + ","
            };
            return aA6(A, M, Y)
        }
    } else if (O.type === "array" && typeof $ === "number" && Array.isArray(O.children)) {
        let H = $;
        if (H === -1) {
            let j = `${JSON.stringify(K)}`,
                J;
            if (O.children.length === 0) J = {
                offset: O.offset + 1,
                length: 0,
                content: j
            };
            else {
                let M = O.children[O.children.length - 1];
                J = {
                    offset: M.offset + M.length,
                    length: 0,
                    content: "," + j
                }
            }
            return aA6(A, J, Y)
        } else if (K === void 0 && O.children.length >= 0) {
            let j = $,
                J = O.children[j],
                M;
            if (O.children.length === 1) M = {
                offset: O.offset + 1,
                length: O.length - 2,
                content: ""
            };
            else if (O.children.length - 1 === j) {
                let D = O.children[j - 1],
                    X = D.offset + D.length,
                    P = O.offset + O.length;
                M = {
                    offset: X,
                    length: P - 2 - X,
                    content: ""
                }
            } else M = {
                offset: J.offset,
                length: O.children[j + 1].offset - J.offset,
                content: ""
            };
            return aA6(A, M, Y)
        } else if (K !== void 0) {
            let j, J = `${JSON.stringify(K)}`;
            if (!Y.isArrayInsertion && O.children.length > $) {
                let M = O.children[$];
                j = {
                    offset: M.offset,
                    length: M.length,
                    content: J
                }
            } else if (O.children.length === 0 || $ === 0) j = {
                offset: O.offset + 1,
                length: 0,
                content: O.children.length === 0 ? J : J + ","
            };
            else {
                let M = $ > O.children.length ? O.children.length : $,
                    D = O.children[M - 1];
                j = {
                    offset: D.offset + D.length,
                    length: 0,
                    content: "," + J
                }
            }
            return aA6(A, j, Y)
        } else throw Error(`Can not ${K===void 0?"remove":Y.isArrayInsertion?"insert":"modify"} Array index ${H} as length is not sufficient`)
    } else throw Error(`Can not add ${typeof $!=="number"?"index":"property"} to parent of type ${O.type}`)
}
// @from(Ln 38271, Col 0)
function aA6(A, q, K) {
    if (!K.formattingOptions) return [q];
    let Y = m81(A, q),
        z = q.offset,
        _ = q.offset + q.content.length;
    if (q.length === 0 || q.content.length === 0) {
        while (z > 0 && !FL6(Y, z - 1)) z--;
        while (_ < Y.length && !FL6(Y, _)) _++
    }
    let w = Vl1(Y, {
        offset: z,
        length: _ - z
    }, {
        ...K.formattingOptions,
        keepLines: !1
    });
    for (let $ = w.length - 1; $ >= 0; $--) {
        let H = w[$];
        Y = m81(Y, H), z = Math.min(z, H.offset), _ = Math.max(_, H.offset + H.length), _ += H.content.length - H.length
    }
    let O = A.length - (Y.length - _) - z;
    return [{
        offset: z,
        length: O,
        content: Y.substring(z, _)
    }]
}
// @from(Ln 38299, Col 0)
function m81(A, q) {
    return A.substring(0, q.offset) + q.content + A.substring(q.offset + q.length)
}
// @from(Ln 38302, Col 4)
_jA = E(() => {
    kl1();
    Ll1()
})
// @from(Ln 38307, Col 0)
function HjA(A, q, K, Y) {
    return zjA(A, q, K, Y)
}
// @from(Ln 38311, Col 0)
function jjA(A, q) {
    let K = q.slice(0).sort((z, _) => {
            let w = z.offset - _.offset;
            if (w === 0) return z.length - _.length;
            return w
        }),
        Y = A.length;
    for (let z = K.length - 1; z >= 0; z--) {
        let _ = K[z];
        if (_.offset + _.length <= Y) A = m81(A, _);
        else throw Error("Overlapping edit");
        Y = _.offset
    }
    return A
}
// @from(Ln 38326, Col 4)
wjA
// @from(Ln 38326, Col 9)
OjA
// @from(Ln 38326, Col 14)
Rl1
// @from(Ln 38326, Col 19)
$jA
// @from(Ln 38327, Col 4)
JjA = E(() => {
    kl1();
    _jA();
    x81();
    Ll1();
    (function(A) {
        A[A.None = 0] = "None", A[A.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 4] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 6] = "InvalidCharacter"
    })(wjA || (wjA = {}));
    (function(A) {
        A[A.OpenBraceToken = 1] = "OpenBraceToken", A[A.CloseBraceToken = 2] = "CloseBraceToken", A[A.OpenBracketToken = 3] = "OpenBracketToken", A[A.CloseBracketToken = 4] = "CloseBracketToken", A[A.CommaToken = 5] = "CommaToken", A[A.ColonToken = 6] = "ColonToken", A[A.NullKeyword = 7] = "NullKeyword", A[A.TrueKeyword = 8] = "TrueKeyword", A[A.FalseKeyword = 9] = "FalseKeyword", A[A.StringLiteral = 10] = "StringLiteral", A[A.NumericLiteral = 11] = "NumericLiteral", A[A.LineCommentTrivia = 12] = "LineCommentTrivia", A[A.BlockCommentTrivia = 13] = "BlockCommentTrivia", A[A.LineBreakTrivia = 14] = "LineBreakTrivia", A[A.Trivia = 15] = "Trivia", A[A.Unknown = 16] = "Unknown", A[A.EOF = 17] = "EOF"
    })(OjA || (OjA = {}));
    Rl1 = YjA;
    (function(A) {
        A[A.InvalidSymbol = 1] = "InvalidSymbol", A[A.InvalidNumberFormat = 2] = "InvalidNumberFormat", A[A.PropertyNameExpected = 3] = "PropertyNameExpected", A[A.ValueExpected = 4] = "ValueExpected", A[A.ColonExpected = 5] = "ColonExpected", A[A.CommaExpected = 6] = "CommaExpected", A[A.CloseBraceExpected = 7] = "CloseBraceExpected", A[A.CloseBracketExpected = 8] = "CloseBracketExpected", A[A.EndOfFileExpected = 9] = "EndOfFileExpected", A[A.InvalidCommentToken = 10] = "InvalidCommentToken", A[A.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 14] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 16] = "InvalidCharacter"
    })($jA || ($jA = {}))
})
// @from(Ln 38343, Col 0)
class C$6 {
    heap;
    length;
    static #A = !1;
    static create(A) {
        let q = PjA(A);
        if (!q) return [];
        C$6.#A = !0;
        let K = new C$6(A, q);
        return C$6.#A = !1, K
    }
    constructor(A, q) {
        if (!C$6.#A) throw TypeError("instantiate Stack using Stack.create(n)");
        this.heap = new q(A), this.length = 0
    }
    push(A) {
        this.heap[this.length++] = A
    }
    pop() {
        return this.heap[--this.length]
    }
}
// @from(Ln 38365, Col 4)
S$6
// @from(Ln 38365, Col 9)
DjA
// @from(Ln 38365, Col 14)
hl1
// @from(Ln 38365, Col 19)
XjA = (A, q, K, Y) => {
        typeof hl1.emitWarning === "function" ? hl1.emitWarning(A, q, K, Y) : console.error(`[${K}] ${q}: ${A}`)
    }
// @from(Ln 38368, Col 4)
B81
// @from(Ln 38368, Col 9)
MjA
// @from(Ln 38368, Col 14)
WOK = (A) => !DjA.has(A)
// @from(Ln 38369, Col 4)
foz
// @from(Ln 38369, Col 9)
_r = (A) => A && A === Math.floor(A) && A > 0 && isFinite(A)
// @from(Ln 38370, Col 4)
PjA = (A) => !_r(A) ? null : A <= Math.pow(2, 8) ? Uint8Array : A <= Math.pow(2, 16) ? Uint16Array : A <= Math.pow(2, 32) ? Uint32Array : A <= Number.MAX_SAFE_INTEGER ? QL6 : null
// @from(Ln 38371, Col 4)
QL6
// @from(Ln 38371, Col 9)
kT
// @from(Ln 38372, Col 4)
I$6 = E(() => {
    S$6 = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date, DjA = new Set, hl1 = typeof process === "object" && !!process ? process : {}, B81 = globalThis.AbortController, MjA = globalThis.AbortSignal;
    if (typeof B81 > "u") {
        MjA = class {
            onabort;
            _onabort = [];
            reason;
            aborted = !1;
            addEventListener(Y, z) {
                this._onabort.push(z)
            }
        }, B81 = class {
            constructor() {
                q()
            }
            signal = new MjA;
            abort(Y) {
                if (this.signal.aborted) return;
                this.signal.reason = Y, this.signal.aborted = !0;
                for (let z of this.signal._onabort) z(Y);
                this.signal.onabort?.(Y)
            }
        };
        let A = hl1.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1",
            q = () => {
                if (!A) return;
                A = !1, XjA("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", q)
            }
    }
    foz = Symbol("type");
    QL6 = class QL6 extends Array {
        constructor(A) {
            super(A);
            this.fill(0)
        }
    };
    kT = class kT {
        #A;
        #q;
        #K;
        #z;
        #Y;
        #w;
        ttl;
        ttlResolution;
        ttlAutopurge;
        updateAgeOnGet;
        updateAgeOnHas;
        allowStale;
        noDisposeOnSet;
        noUpdateTTL;
        maxEntrySize;
        sizeCalculation;
        noDeleteOnFetchRejection;
        noDeleteOnStaleGet;
        allowStaleOnFetchAbort;
        allowStaleOnFetchRejection;
        ignoreFetchAbort;
        #_;
        #$;
        #H;
        #j;
        #O;
        #J;
        #M;
        #W;
        #X;
        #G;
        #P;
        #Z;
        #f;
        #T;
        #N;
        #k;
        #v;
        static unsafeExposeInternals(A) {
            return {
                starts: A.#f,
                ttls: A.#T,
                sizes: A.#Z,
                keyMap: A.#H,
                keyList: A.#j,
                valList: A.#O,
                next: A.#J,
                prev: A.#M,
                get head() {
                    return A.#W
                },
                get tail() {
                    return A.#X
                },
                free: A.#G,
                isBackgroundFetch: (q) => A.#D(q),
                backgroundFetch: (q, K, Y, z) => A.#x(q, K, Y, z),
                moveToTail: (q) => A.#C(q),
                indexes: (q) => A.#E(q),
                rindexes: (q) => A.#y(q),
                isStale: (q) => A.#V(q)
            }
        }
        get max() {
            return this.#A
        }
        get maxSize() {
            return this.#q
        }
        get calculatedSize() {
            return this.#$
        }
        get size() {
            return this.#_
        }
        get fetchMethod() {
            return this.#Y
        }
        get memoMethod() {
            return this.#w
        }
        get dispose() {
            return this.#K
        }
        get disposeAfter() {
            return this.#z
        }
        constructor(A) {
            let {
                max: q = 0,
                ttl: K,
                ttlResolution: Y = 1,
                ttlAutopurge: z,
                updateAgeOnGet: _,
                updateAgeOnHas: w,
                allowStale: O,
                dispose: $,
                disposeAfter: H,
                noDisposeOnSet: j,
                noUpdateTTL: J,
                maxSize: M = 0,
                maxEntrySize: D = 0,
                sizeCalculation: X,
                fetchMethod: P,
                memoMethod: W,
                noDeleteOnFetchRejection: Z,
                noDeleteOnStaleGet: G,
                allowStaleOnFetchRejection: f,
                allowStaleOnFetchAbort: v,
                ignoreFetchAbort: N
            } = A;
            if (q !== 0 && !_r(q)) throw TypeError("max option must be a nonnegative integer");
            let V = q ? PjA(q) : Array;
            if (!V) throw Error("invalid max value: " + q);
            if (this.#A = q, this.#q = M, this.maxEntrySize = D || this.#q, this.sizeCalculation = X, this.sizeCalculation) {
                if (!this.#q && !this.maxEntrySize) throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
                if (typeof this.sizeCalculation !== "function") throw TypeError("sizeCalculation set to non-function")
            }
            if (W !== void 0 && typeof W !== "function") throw TypeError("memoMethod must be a function if defined");
            if (this.#w = W, P !== void 0 && typeof P !== "function") throw TypeError("fetchMethod must be a function if specified");
            if (this.#Y = P, this.#k = !!P, this.#H = new Map, this.#j = Array(q).fill(void 0), this.#O = Array(q).fill(void 0), this.#J = new V(q), this.#M = new V(q), this.#W = 0, this.#X = 0, this.#G = C$6.create(q), this.#_ = 0, this.#$ = 0, typeof $ === "function") this.#K = $;
            if (typeof H === "function") this.#z = H, this.#P = [];
            else this.#z = void 0, this.#P = void 0;
            if (this.#N = !!this.#K, this.#v = !!this.#z, this.noDisposeOnSet = !!j, this.noUpdateTTL = !!J, this.noDeleteOnFetchRejection = !!Z, this.allowStaleOnFetchRejection = !!f, this.allowStaleOnFetchAbort = !!v, this.ignoreFetchAbort = !!N, this.maxEntrySize !== 0) {
                if (this.#q !== 0) {
                    if (!_r(this.#q)) throw TypeError("maxSize must be a positive integer if specified")
                }
                if (!_r(this.maxEntrySize)) throw TypeError("maxEntrySize must be a positive integer if specified");
                this.#Q()
            }
            if (this.allowStale = !!O, this.noDeleteOnStaleGet = !!G, this.updateAgeOnGet = !!_, this.updateAgeOnHas = !!w, this.ttlResolution = _r(Y) || Y === 0 ? Y : 1, this.ttlAutopurge = !!z, this.ttl = K || 0, this.ttl) {
                if (!_r(this.ttl)) throw TypeError("ttl must be a positive integer if specified");
                this.#u()
            }
            if (this.#A === 0 && this.ttl === 0 && this.#q === 0) throw TypeError("At least one of max, maxSize, or ttl is required");
            if (!this.ttlAutopurge && !this.#A && !this.#q) {
                if (WOK("LRU_CACHE_UNBOUNDED")) DjA.add("LRU_CACHE_UNBOUNDED"), XjA("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", "LRU_CACHE_UNBOUNDED", kT)
            }
        }
        getRemainingTTL(A) {
            return this.#H.has(A) ? 1 / 0 : 0
        }
        #u() {
            let A = new QL6(this.#A),
                q = new QL6(this.#A);
            this.#T = A, this.#f = q, this.#m = (z, _, w = S$6.now()) => {
                if (q[z] = _ !== 0 ? w : 0, A[z] = _, _ !== 0 && this.ttlAutopurge) {
                    let O = setTimeout(() => {
                        if (this.#V(z)) this.#L(this.#j[z], "expire")
                    }, _ + 1);
                    if (O.unref) O.unref()
                }
            }, this.#h = (z) => {
                q[z] = A[z] !== 0 ? S$6.now() : 0
            }, this.#R = (z, _) => {
                if (A[_]) {
                    let w = A[_],
                        O = q[_];
                    if (!w || !O) return;
                    z.ttl = w, z.start = O, z.now = K || Y();
                    let $ = z.now - O;
                    z.remainingTTL = w - $
                }
            };
            let K = 0,
                Y = () => {
                    let z = S$6.now();
                    if (this.ttlResolution > 0) {
                        K = z;
                        let _ = setTimeout(() => K = 0, this.ttlResolution);
                        if (_.unref) _.unref()
                    }
                    return z
                };
            this.getRemainingTTL = (z) => {
                let _ = this.#H.get(z);
                if (_ === void 0) return 0;
                let w = A[_],
                    O = q[_];
                if (!w || !O) return 1 / 0;
                let $ = (K || Y()) - O;
                return w - $
            }, this.#V = (z) => {
                let _ = q[z],
                    w = A[z];
                return !!w && !!_ && (K || Y()) - _ > w
            }
        }
        #h = () => {};
        #R = () => {};
        #m = () => {};
        #V = () => !1;
        #Q() {
            let A = new QL6(this.#A);
            this.#$ = 0, this.#Z = A, this.#S = (q) => {
                this.#$ -= A[q], A[q] = 0
            }, this.#B = (q, K, Y, z) => {
                if (this.#D(K)) return 0;
                if (!_r(Y))
                    if (z) {
                        if (typeof z !== "function") throw TypeError("sizeCalculation must be a function");
                        if (Y = z(K, q), !_r(Y)) throw TypeError("sizeCalculation return invalid (expect positive integer)")
                    } else throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
                return Y
            }, this.#I = (q, K, Y) => {
                if (A[q] = K, this.#q) {
                    let z = this.#q - A[q];
                    while (this.#$ > z) this.#b(!0)
                }
                if (this.#$ += A[q], Y) Y.entrySize = K, Y.totalCalculatedSize = this.#$
            }
        }
        #S = (A) => {};
        #I = (A, q, K) => {};
        #B = (A, q, K, Y) => {
            if (K || Y) throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
            return 0
        };* #E({
            allowStale: A = this.allowStale
        } = {}) {
            if (this.#_)
                for (let q = this.#X;;) {
                    if (!this.#g(q)) break;
                    if (A || !this.#V(q)) yield q;
                    if (q === this.#W) break;
                    else q = this.#M[q]
                }
        }* #y({
            allowStale: A = this.allowStale
        } = {}) {
            if (this.#_)
                for (let q = this.#W;;) {
                    if (!this.#g(q)) break;
                    if (A || !this.#V(q)) yield q;
                    if (q === this.#X) break;
                    else q = this.#J[q]
                }
        }
        #g(A) {
            return A !== void 0 && this.#H.get(this.#j[A]) === A
        }* entries() {
            for (let A of this.#E())
                if (this.#O[A] !== void 0 && this.#j[A] !== void 0 && !this.#D(this.#O[A])) yield [this.#j[A], this.#O[A]]
        }* rentries() {
            for (let A of this.#y())
                if (this.#O[A] !== void 0 && this.#j[A] !== void 0 && !this.#D(this.#O[A])) yield [this.#j[A], this.#O[A]]
        }* keys() {
            for (let A of this.#E()) {
                let q = this.#j[A];
                if (q !== void 0 && !this.#D(this.#O[A])) yield q
            }
        }* rkeys() {
            for (let A of this.#y()) {
                let q = this.#j[A];
                if (q !== void 0 && !this.#D(this.#O[A])) yield q
            }
        }* values() {
            for (let A of this.#E())
                if (this.#O[A] !== void 0 && !this.#D(this.#O[A])) yield this.#O[A]
        }* rvalues() {
            for (let A of this.#y())
                if (this.#O[A] !== void 0 && !this.#D(this.#O[A])) yield this.#O[A]
        } [Symbol.iterator]() {
            return this.entries()
        } [Symbol.toStringTag] = "LRUCache";
        find(A, q = {}) {
            for (let K of this.#E()) {
                let Y = this.#O[K],
                    z = this.#D(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                if (A(z, this.#j[K], this)) return this.get(this.#j[K], q)
            }
        }
        forEach(A, q = this) {
            for (let K of this.#E()) {
                let Y = this.#O[K],
                    z = this.#D(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                A.call(q, z, this.#j[K], this)
            }
        }
        rforEach(A, q = this) {
            for (let K of this.#y()) {
                let Y = this.#O[K],
                    z = this.#D(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                A.call(q, z, this.#j[K], this)
            }
        }
        purgeStale() {
            let A = !1;
            for (let q of this.#y({
                    allowStale: !0
                }))
                if (this.#V(q)) this.#L(this.#j[q], "expire"), A = !0;
            return A
        }
        info(A) {
            let q = this.#H.get(A);
            if (q === void 0) return;
            let K = this.#O[q],
                Y = this.#D(K) ? K.__staleWhileFetching : K;
            if (Y === void 0) return;
            let z = {
                value: Y
            };
            if (this.#T && this.#f) {
                let _ = this.#T[q],
                    w = this.#f[q];
                if (_ && w) {
                    let O = _ - (S$6.now() - w);
                    z.ttl = O, z.start = Date.now()
                }
            }
            if (this.#Z) z.size = this.#Z[q];
            return z
        }
        dump() {
            let A = [];
            for (let q of this.#E({
                    allowStale: !0
                })) {
                let K = this.#j[q],
                    Y = this.#O[q],
                    z = this.#D(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0 || K === void 0) continue;
                let _ = {
                    value: z
                };
                if (this.#T && this.#f) {
                    _.ttl = this.#T[q];
                    let w = S$6.now() - this.#f[q];
                    _.start = Math.floor(Date.now() - w)
                }
                if (this.#Z) _.size = this.#Z[q];
                A.unshift([K, _])
            }
            return A
        }
        load(A) {
            this.clear();
            for (let [q, K] of A) {
                if (K.start) {
                    let Y = Date.now() - K.start;
                    K.start = S$6.now() - Y
                }
                this.set(q, K.value, K)
            }
        }
        set(A, q, K = {}) {
            if (q === void 0) return this.delete(A), this;
            let {
                ttl: Y = this.ttl,
                start: z,
                noDisposeOnSet: _ = this.noDisposeOnSet,
                sizeCalculation: w = this.sizeCalculation,
                status: O
            } = K, {
                noUpdateTTL: $ = this.noUpdateTTL
            } = K, H = this.#B(A, q, K.size || 0, w);
            if (this.maxEntrySize && H > this.maxEntrySize) {
                if (O) O.set = "miss", O.maxEntrySizeExceeded = !0;
                return this.#L(A, "set"), this
            }
            let j = this.#_ === 0 ? void 0 : this.#H.get(A);
            if (j === void 0) {
                if (j = this.#_ === 0 ? this.#X : this.#G.length !== 0 ? this.#G.pop() : this.#_ === this.#A ? this.#b(!1) : this.#_, this.#j[j] = A, this.#O[j] = q, this.#H.set(A, j), this.#J[this.#X] = j, this.#M[j] = this.#X, this.#X = j, this.#_++, this.#I(j, H, O), O) O.set = "add";
                $ = !1
            } else {
                this.#C(j);
                let J = this.#O[j];
                if (q !== J) {
                    if (this.#k && this.#D(J)) {
                        J.__abortController.abort(Error("replaced"));
                        let {
                            __staleWhileFetching: M
                        } = J;
                        if (M !== void 0 && !_) {
                            if (this.#N) this.#K?.(M, A, "set");
                            if (this.#v) this.#P?.push([M, A, "set"])
                        }
                    } else if (!_) {
                        if (this.#N) this.#K?.(J, A, "set");
                        if (this.#v) this.#P?.push([J, A, "set"])
                    }
                    if (this.#S(j), this.#I(j, H, O), this.#O[j] = q, O) {
                        O.set = "replace";
                        let M = J && this.#D(J) ? J.__staleWhileFetching : J;
                        if (M !== void 0) O.oldValue = M
                    }
                } else if (O) O.set = "update"
            }
            if (Y !== 0 && !this.#T) this.#u();
            if (this.#T) {
                if (!$) this.#m(j, Y, z);
                if (O) this.#R(O, j)
            }
            if (!_ && this.#v && this.#P) {
                let J = this.#P,
                    M;
                while (M = J?.shift()) this.#z?.(...M)
            }
            return this
        }
        pop() {
            try {
                while (this.#_) {
                    let A = this.#O[this.#W];
                    if (this.#b(!0), this.#D(A)) {
                        if (A.__staleWhileFetching) return A.__staleWhileFetching
                    } else if (A !== void 0) return A
                }
            } finally {
                if (this.#v && this.#P) {
                    let A = this.#P,
                        q;
                    while (q = A?.shift()) this.#z?.(...q)
                }
            }
        }
        #b(A) {
            let q = this.#W,
                K = this.#j[q],
                Y = this.#O[q];
            if (this.#k && this.#D(Y)) Y.__abortController.abort(Error("evicted"));
            else if (this.#N || this.#v) {
                if (this.#N) this.#K?.(Y, K, "evict");
                if (this.#v) this.#P?.push([Y, K, "evict"])
            }
            if (this.#S(q), A) this.#j[q] = void 0, this.#O[q] = void 0, this.#G.push(q);
            if (this.#_ === 1) this.#W = this.#X = 0, this.#G.length = 0;
            else this.#W = this.#J[q];
            return this.#H.delete(K), this.#_--, q
        }
        has(A, q = {}) {
            let {
                updateAgeOnHas: K = this.updateAgeOnHas,
                status: Y
            } = q, z = this.#H.get(A);
            if (z !== void 0) {
                let _ = this.#O[z];
                if (this.#D(_) && _.__staleWhileFetching === void 0) return !1;
                if (!this.#V(z)) {
                    if (K) this.#h(z);
                    if (Y) Y.has = "hit", this.#R(Y, z);
                    return !0
                } else if (Y) Y.has = "stale", this.#R(Y, z)
            } else if (Y) Y.has = "miss";
            return !1
        }
        peek(A, q = {}) {
            let {
                allowStale: K = this.allowStale
            } = q, Y = this.#H.get(A);
            if (Y === void 0 || !K && this.#V(Y)) return;
            let z = this.#O[Y];
            return this.#D(z) ? z.__staleWhileFetching : z
        }
        #x(A, q, K, Y) {
            let z = q === void 0 ? void 0 : this.#O[q];
            if (this.#D(z)) return z;
            let _ = new B81,
                {
                    signal: w
                } = K;
            w?.addEventListener("abort", () => _.abort(w.reason), {
                signal: _.signal
            });
            let O = {
                    signal: _.signal,
                    options: K,
                    context: Y
                },
                $ = (X, P = !1) => {
                    let {
                        aborted: W
                    } = _.signal, Z = K.ignoreFetchAbort && X !== void 0;
                    if (K.status)
                        if (W && !P) {
                            if (K.status.fetchAborted = !0, K.status.fetchError = _.signal.reason, Z) K.status.fetchAbortIgnored = !0
                        } else K.status.fetchResolved = !0;
                    if (W && !Z && !P) return j(_.signal.reason);
                    let G = M;
                    if (this.#O[q] === M)
                        if (X === void 0)
                            if (G.__staleWhileFetching) this.#O[q] = G.__staleWhileFetching;
                            else this.#L(A, "fetch");
                    else {
                        if (K.status) K.status.fetchUpdated = !0;
                        this.set(A, X, O.options)
                    }
                    return X
                },
                H = (X) => {
                    if (K.status) K.status.fetchRejected = !0, K.status.fetchError = X;
                    return j(X)
                },
                j = (X) => {
                    let {
                        aborted: P
                    } = _.signal, W = P && K.allowStaleOnFetchAbort, Z = W || K.allowStaleOnFetchRejection, G = Z || K.noDeleteOnFetchRejection, f = M;
                    if (this.#O[q] === M) {
                        if (!G || f.__staleWhileFetching === void 0) this.#L(A, "fetch");
                        else if (!W) this.#O[q] = f.__staleWhileFetching
                    }
                    if (Z) {
                        if (K.status && f.__staleWhileFetching !== void 0) K.status.returnedStale = !0;
                        return f.__staleWhileFetching
                    } else if (f.__returned === f) throw X
                },
                J = (X, P) => {
                    let W = this.#Y?.(A, z, O);
                    if (W && W instanceof Promise) W.then((Z) => X(Z === void 0 ? void 0 : Z), P);
                    _.signal.addEventListener("abort", () => {
                        if (!K.ignoreFetchAbort || K.allowStaleOnFetchAbort) {
                            if (X(void 0), K.allowStaleOnFetchAbort) X = (Z) => $(Z, !0)
                        }
                    })
                };
            if (K.status) K.status.fetchDispatched = !0;
            let M = new Promise(J).then($, H),
                D = Object.assign(M, {
                    __abortController: _,
                    __staleWhileFetching: z,
                    __returned: void 0
                });
            if (q === void 0) this.set(A, D, {
                ...O.options,
                status: void 0
            }), q = this.#H.get(A);
            else this.#O[q] = D;
            return D
        }
        #D(A) {
            if (!this.#k) return !1;
            let q = A;
            return !!q && q instanceof Promise && q.hasOwnProperty("__staleWhileFetching") && q.__abortController instanceof B81
        }
        async fetch(A, q = {}) {
            let {
                allowStale: K = this.allowStale,
                updateAgeOnGet: Y = this.updateAgeOnGet,
                noDeleteOnStaleGet: z = this.noDeleteOnStaleGet,
                ttl: _ = this.ttl,
                noDisposeOnSet: w = this.noDisposeOnSet,
                size: O = 0,
                sizeCalculation: $ = this.sizeCalculation,
                noUpdateTTL: H = this.noUpdateTTL,
                noDeleteOnFetchRejection: j = this.noDeleteOnFetchRejection,
                allowStaleOnFetchRejection: J = this.allowStaleOnFetchRejection,
                ignoreFetchAbort: M = this.ignoreFetchAbort,
                allowStaleOnFetchAbort: D = this.allowStaleOnFetchAbort,
                context: X,
                forceRefresh: P = !1,
                status: W,
                signal: Z
            } = q;
            if (!this.#k) {
                if (W) W.fetch = "get";
                return this.get(A, {
                    allowStale: K,
                    updateAgeOnGet: Y,
                    noDeleteOnStaleGet: z,
                    status: W
                })
            }
            let G = {
                    allowStale: K,
                    updateAgeOnGet: Y,
                    noDeleteOnStaleGet: z,
                    ttl: _,
                    noDisposeOnSet: w,
                    size: O,
                    sizeCalculation: $,
                    noUpdateTTL: H,
                    noDeleteOnFetchRejection: j,
                    allowStaleOnFetchRejection: J,
                    allowStaleOnFetchAbort: D,
                    ignoreFetchAbort: M,
                    status: W,
                    signal: Z
                },
                f = this.#H.get(A);
            if (f === void 0) {
                if (W) W.fetch = "miss";
                let v = this.#x(A, f, G, X);
                return v.__returned = v
            } else {
                let v = this.#O[f];
                if (this.#D(v)) {
                    let R = K && v.__staleWhileFetching !== void 0;
                    if (W) {
                        if (W.fetch = "inflight", R) W.returnedStale = !0
                    }
                    return R ? v.__staleWhileFetching : v.__returned = v
                }
                let N = this.#V(f);
                if (!P && !N) {
                    if (W) W.fetch = "hit";
                    if (this.#C(f), Y) this.#h(f);
                    if (W) this.#R(W, f);
                    return v
                }
                let V = this.#x(A, f, G, X),
                    h = V.__staleWhileFetching !== void 0 && K;
                if (W) {
                    if (W.fetch = N ? "stale" : "refresh", h && N) W.returnedStale = !0
                }
                return h ? V.__staleWhileFetching : V.__returned = V
            }
        }
        async forceFetch(A, q = {}) {
            let K = await this.fetch(A, q);
            if (K === void 0) throw Error("fetch() returned undefined");
            return K
        }
        memo(A, q = {}) {
            let K = this.#w;
            if (!K) throw Error("no memoMethod provided to constructor");
            let {
                context: Y,
                forceRefresh: z,
                ..._
            } = q, w = this.get(A, _);
            if (!z && w !== void 0) return w;
            let O = K(A, w, {
                options: _,
                context: Y
            });
            return this.set(A, O, _), O
        }
        get(A, q = {}) {
            let {
                allowStale: K = this.allowStale,
                updateAgeOnGet: Y = this.updateAgeOnGet,
                noDeleteOnStaleGet: z = this.noDeleteOnStaleGet,
                status: _
            } = q, w = this.#H.get(A);
            if (w !== void 0) {
                let O = this.#O[w],
                    $ = this.#D(O);
                if (_) this.#R(_, w);
                if (this.#V(w)) {
                    if (_) _.get = "stale";
                    if (!$) {
                        if (!z) this.#L(A, "expire");
                        if (_ && K) _.returnedStale = !0;
                        return K ? O : void 0
                    } else {
                        if (_ && K && O.__staleWhileFetching !== void 0) _.returnedStale = !0;
                        return K ? O.__staleWhileFetching : void 0
                    }
                } else {
                    if (_) _.get = "hit";
                    if ($) return O.__staleWhileFetching;
                    if (this.#C(w), Y) this.#h(w);
                    return O
                }
            } else if (_) _.get = "miss"
        }
        #F(A, q) {
            this.#M[q] = A, this.#J[A] = q
        }
        #C(A) {
            if (A !== this.#X) {
                if (A === this.#W) this.#W = this.#J[A];
                else this.#F(this.#M[A], this.#J[A]);
                this.#F(this.#X, A), this.#X = A
            }
        }
        delete(A) {
            return this.#L(A, "delete")
        }
        #L(A, q) {
            let K = !1;
            if (this.#_ !== 0) {
                let Y = this.#H.get(A);
                if (Y !== void 0)
                    if (K = !0, this.#_ === 1) this.#p(q);
                    else {
                        this.#S(Y);
                        let z = this.#O[Y];
                        if (this.#D(z)) z.__abortController.abort(Error("deleted"));
                        else if (this.#N || this.#v) {
                            if (this.#N) this.#K?.(z, A, q);
                            if (this.#v) this.#P?.push([z, A, q])
                        }
                        if (this.#H.delete(A), this.#j[Y] = void 0, this.#O[Y] = void 0, Y === this.#X) this.#X = this.#M[Y];
                        else if (Y === this.#W) this.#W = this.#J[Y];
                        else {
                            let _ = this.#M[Y];
                            this.#J[_] = this.#J[Y];
                            let w = this.#J[Y];
                            this.#M[w] = this.#M[Y]
                        }
                        this.#_--, this.#G.push(Y)
                    }
            }
            if (this.#v && this.#P?.length) {
                let Y = this.#P,
                    z;
                while (z = Y?.shift()) this.#z?.(...z)
            }
            return K
        }
        clear() {
            return this.#p("delete")
        }
        #p(A) {
            for (let q of this.#y({
                    allowStale: !0
                })) {
                let K = this.#O[q];
                if (this.#D(K)) K.__abortController.abort(Error("deleted"));
                else {
                    let Y = this.#j[q];
                    if (this.#N) this.#K?.(K, Y, A);
                    if (this.#v) this.#P?.push([K, Y, A])
                }
            }
            if (this.#H.clear(), this.#O.fill(void 0), this.#j.fill(void 0), this.#T && this.#f) this.#T.fill(0), this.#f.fill(0);
            if (this.#Z) this.#Z.fill(0);
            if (this.#W = 0, this.#X = 0, this.#G.length = 0, this.#$ = 0, this.#_ = 0, this.#v && this.#P) {
                let q = this.#P,
                    K;
                while (K = q?.shift()) this.#z?.(...K)
            }
        }
    }
})
// @from(Ln 39140, Col 0)
function g81(A, q = 300000) {
    let K = new Map,
        Y = (...z) => {
            let _ = B6(z),
                w = K.get(_),
                O = Date.now();
            if (!w) {
                let $ = A(...z);
                return K.set(_, {
                    value: $,
                    timestamp: O,
                    refreshing: !1
                }), $
            }
            if (w && O - w.timestamp > q && !w.refreshing) return w.refreshing = !0, Promise.resolve().then(() => {
                let $ = A(...z);
                K.set(_, {
                    value: $,
                    timestamp: Date.now(),
                    refreshing: !1
                })
            }).catch(($) => {
                _6($), K.delete(_)
            }), w.value;
            return K.get(_).value
        };
    return Y.cache = {
        clear: () => K.clear()
    }, Y
}
// @from(Ln 39171, Col 0)
function WjA(A, q = 300000) {
    let K = new Map,
        Y = async (...z) => {
            let _ = B6(z),
                w = K.get(_),
                O = Date.now();
            if (!w) {
                let $ = await A(...z);
                return K.set(_, {
                    value: $,
                    timestamp: O,
                    refreshing: !1
                }), $
            }
            if (w && O - w.timestamp > q && !w.refreshing) return w.refreshing = !0, A(...z).then(($) => {
                K.set(_, {
                    value: $,
                    timestamp: Date.now(),
                    refreshing: !1
                })
            }).catch(($) => {
                _6($), K.delete(_)
            }), w.value;
            return K.get(_).value
        };
    return Y.cache = {
        clear: () => K.clear()
    }, Y
}
// @from(Ln 39201, Col 0)
function ZP(A, q, K = 100) {
    let Y = new kT({
            max: K
        }),
        z = (..._) => {
            let w = q(..._),
                O = Y.get(w);
            if (O !== void 0) return O;
            let $ = A(..._);
            return Y.set(w, $), $
        };
    return z.cache = {
        clear: () => Y.clear(),
        size: () => Y.size,
        delete: (_) => Y.delete(_),
        get: (_) => Y.peek(_),
        has: (_) => Y.has(_)
    }, z
}
// @from(Ln 39220, Col 4)
Up = E(() => {
    I$6();
    k1();
    g1()
})
// @from(Ln 39231, Col 0)
function b$6(A) {
    return A.startsWith(TOK) ? A.slice(1) : A
}
// @from(Ln 39235, Col 0)
function GjA(A) {
    if (!A) return null;
    try {
        return Rl1(b$6(A))
    } catch (q) {
        return _6(q), null
    }
}
// @from(Ln 39244, Col 0)
function vOK(A) {
    let q = fjA,
        K = A.length,
        Y = q(A);
    if (!Y.error || Y.done || Y.read >= K) return Y.values;
    let {
        values: z,
        read: _
    } = Y;
    while (_ < K) {
        let w = typeof A === "string" ? A.indexOf(`
`, _) : A.indexOf(10, _);
        if (w === -1) break;
        _ = w + 1;
        let O = q(A, _);
        if (O.values.length > 0) z = z.concat(O.values);
        if (!O.error || O.done || O.read >= K) break;
        _ = O.read
    }
    return z
}
// @from(Ln 39266, Col 0)
function NOK(A) {
    let q = A.length,
        K = 0;
    if (A[0] === 239 && A[1] === 187 && A[2] === 191) K = 3;
    let Y = [];
    while (K < q) {
        let z = A.indexOf(10, K);
        if (z === -1) z = q;
        let _ = A.toString("utf8", K, z).trim();
        if (K = z + 1, !_) continue;
        try {
            Y.push(JSON.parse(_))
        } catch {}
    }
    return Y
}
// @from(Ln 39283, Col 0)
function VOK(A) {
    let q = b$6(A),
        K = q.length,
        Y = 0,
        z = [];
    while (Y < K) {
        let _ = q.indexOf(`
`, Y);
        if (_ === -1) _ = K;
        let w = q.substring(Y, _).trim();
        if (Y = _ + 1, !w) continue;
        try {
            z.push(JSON.parse(w))
        } catch {}
    }
    return z
}
// @from(Ln 39301, Col 0)
function cx(A) {
    if (fjA) return vOK(A);
    if (typeof A === "string") return VOK(A);
    return NOK(A)
}
// @from(Ln 39306, Col 0)
async function x$6(A) {
    let O = [];
    try {
        let {
            size: q
        } = await GOK(A);
        if (q <= UL6) return cx(await ZOK(A));
        const K = TY(O, await fOK(A, "r"), 1);
        let Y = Buffer.allocUnsafe(UL6);
        let z = 0;
        let _ = q - UL6;
        while (z < UL6) {
            let {
                bytesRead: M
            } = await K.read(Y, z, UL6 - z, _ + z);
            if (M === 0) break;
            z += M
        }
        let w = Y.indexOf(10);
        if (w !== -1 && w < z - 1) return cx(Y.subarray(w + 1, z));
        return cx(Y.subarray(0, z))
    } catch ($) {
        var H = $,
            j = 1
    } finally {
        var J = vY(O, H, j);
        J && await J
    }
}
// @from(Ln 39336, Col 0)
function TjA(A, q) {
    try {
        if (!A || A.trim() === "") return B6([q], null, 4);
        let K = b$6(A),
            Y = Rl1(K);
        if (Array.isArray(Y)) {
            let z = Y.length,
                O = HjA(K, z === 0 ? [0] : [z], q, {
                    formattingOptions: {
                        insertSpaces: !0,
                        tabSize: 4
                    },
                    isArrayInsertion: !0
                });
            if (!O || O.length === 0) {
                let $ = [...Y, q];
                return B6($, null, 4)
            }
            return jjA(K, O)
        } else return B6([q], null, 4)
    } catch (K) {
        return _6(K), B6([q], null, 4)
    }
}
// @from(Ln 39360, Col 4)
TOK = "\uFEFF"
// @from(Ln 39361, Col 4)
ZjA
// @from(Ln 39361, Col 9)
WK
// @from(Ln 39361, Col 13)
fjA
// @from(Ln 39361, Col 18)
UL6 = 104857600
// @from(Ln 39362, Col 4)
K_ = E(() => {
    k1();
    JjA();
    Up();
    g1();
    ZjA = ZP((A, q) => {
        try {
            return {
                ok: !0,
                value: JSON.parse(b$6(A))
            }
        } catch (K) {
            if (q) _6(K);
            return {
                ok: !1
            }
        }
    }, (A) => A, 50), WK = Object.assign(function(q, K = !0) {
        if (!q) return null;
        let Y = ZjA(q, K);
        return Y.ok ? Y.value : null
    }, {
        cache: ZjA.cache
    });
    fjA = (() => {
        if (typeof Bun > "u") return !1;
        let q = Bun.JSONL;
        if (!q?.parseChunk) return !1;
        return q.parseChunk
    })()
})
// @from(Ln 39400, Col 0)
async function NjA(A) {
    let q = new Set;
    if (process.env.P4PORT) q.add("perforce");
    try {
        let K = A ?? $1().cwd(),
            Y = new Set(await yOK(K));
        for (let [z, _] of LOK)
            if (Y.has(z)) q.add(_)
    } catch {}
    return [...q]
}
// @from(Ln 39411, Col 4)
Sl1
// @from(Ln 39411, Col 9)
y8
// @from(Ln 39411, Col 13)
sA6
// @from(Ln 39411, Col 18)
vjA
// @from(Ln 39411, Col 23)
LOK
// @from(Ln 39412, Col 4)
YK = E(() => {
    U4();
    k1();
    SA();
    Sl1 = ["macos", "wsl"], y8 = e1(() => {
        try {
            if (process.platform === "darwin") return "macos";
            if (process.platform === "win32") return "windows";
            if (process.platform === "linux") {
                try {
                    let A = $1().readFileSync("/proc/version", {
                        encoding: "utf8"
                    });
                    if (A.toLowerCase().includes("microsoft") || A.toLowerCase().includes("wsl")) return "wsl"
                } catch (A) {
                    _6(A)
                }
                return "linux"
            }
            return "unknown"
        } catch (A) {
            return _6(A), "unknown"
        }
    }), sA6 = e1(() => {
        if (process.platform !== "linux") return;
        try {
            let A = $1().readFileSync("/proc/version", {
                    encoding: "utf8"
                }),
                q = A.match(/WSL(\d+)/i);
            if (q && q[1]) return q[1];
            if (A.toLowerCase().includes("microsoft")) return "1";
            return
        } catch (A) {
            _6(A);
            return
        }
    }), vjA = e1(async () => {
        if (process.platform !== "linux") return;
        let A = {
            linuxKernel: kOK()
        };
        try {
            let q = await EOK("/etc/os-release", "utf8");
            for (let K of q.split(`
`)) {
                let Y = K.match(/^(ID|VERSION_ID)=(.*)$/);
                if (Y && Y[1] && Y[2]) {
                    let z = Y[2].replace(/^"|"$/g, "");
                    if (Y[1] === "ID") A.linuxDistroId = z;
                    else A.linuxDistroVersion = z
                }
            }
        } catch {}
        return A
    }), LOK = [
        [".git", "git"],
        [".hg", "mercurial"],
        [".svn", "svn"],
        [".p4config", "perforce"],
        ["$tf", "tfs"],
        [".tfvc", "tfs"]
    ]
})
// @from(Ln 39479, Col 0)
function Cl1(A) {
    try {
        return tn(`dir "${A}"`, {
            stdio: "pipe"
        }), !0
    } catch {
        return !1
    }
}
// @from(Ln 39489, Col 0)
function ROK(A) {
    if (A === "git") {
        let q = ["C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files (x86)\\Git\\cmd\\git.exe"];
        for (let K of q)
            if (Cl1(K)) return K
    }
    try {
        let K = tn(`where.exe ${A}`, {
                stdio: "pipe",
                encoding: "utf8"
            }).trim().split(`\r
`).filter(Boolean),
            Y = G1().toLowerCase();
        for (let z of K) {
            let _ = u$6.resolve(z).toLowerCase();
            if (u$6.dirname(_).toLowerCase() === Y || _.startsWith(Y + u$6.sep)) {
                k(`Skipping potentially malicious executable in current directory: ${z}`);
                continue
            }
            return z
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 39515, Col 4)
kjA = () => {
        if (y8() === "windows") {
            let A = Il1();
            process.env.SHELL = A, k(`Using bash path: "${A}"`)
        }
    }
// @from(Ln 39521, Col 4)
Il1
// @from(Ln 39521, Col 9)
GP
// @from(Ln 39521, Col 13)
tA6
// @from(Ln 39522, Col 4)
lx = E(() => {
    p11();
    U4();
    Up();
    YK();
    H1();
    lA();
    Il1 = e1(() => {
        if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
            if (Cl1(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
            console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1)
        }
        let A = ROK("git");
        if (A) {
            let q = VjA.join(A, "..", "..", "bin", "bash.exe");
            if (Cl1(q)) return q
        }
        console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1)
    }), GP = ZP((A) => {
        if (A.startsWith("\\\\")) return A.replace(/\\/g, "/");
        let q = A.match(/^([A-Za-z]):[/\\]/);
        if (q) return "/" + q[1].toLowerCase() + A.slice(2).replace(/\\/g, "/");
        return A.replace(/\\/g, "/")
    }, (A) => A, 500), tA6 = ZP((A) => {
        if (A.startsWith("//")) return A.replace(/\//g, "\\");
        let q = A.match(/^\/cygdrive\/([A-Za-z])(\/|$)/);
        if (q) {
            let Y = q[1].toUpperCase(),
                z = A.slice(("/cygdrive/" + q[1]).length);
            return Y + ":" + (z || "\\").replace(/\//g, "\\")
        }
        let K = A.match(/^\/([A-Za-z])(\/|$)/);
        if (K) {
            let Y = K[1].toUpperCase(),
                z = A.slice(2);
            return Y + ":" + (z || "\\").replace(/\//g, "\\")
        }
        return A.replace(/\//g, "\\")
    }, (A) => A, 500)
})
// @from(Ln 39568, Col 0)
async function bl1(A) {
    try {
        let {
            stdout: q
        } = await COK("git", ["worktree", "list", "--porcelain"], {
            cwd: A,
            timeout: 5000
        });
        if (!q) return [];
        return q.split(`
`).filter((K) => K.startsWith("worktree ")).map((K) => K.slice(9).normalize("NFC"))
    } catch {
        return []
    }
}
// @from(Ln 39583, Col 4)
COK
// @from(Ln 39584, Col 4)
xl1 = E(() => {
    COK = SOK(hOK)
})