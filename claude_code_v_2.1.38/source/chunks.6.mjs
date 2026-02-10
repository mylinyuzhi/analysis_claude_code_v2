
// @from(Ln 16773, Col 4)
i78 = R((fmz, l78) => {
    var V4K = h1("os"),
        c78 = h1("tty"),
        wk = cN1(),
        {
            env: G0
        } = process,
        sr1;
    if (wk("no-color") || wk("no-colors") || wk("color=false") || wk("color=never")) sr1 = 0;
    else if (wk("color") || wk("colors") || wk("color=true") || wk("color=always")) sr1 = 1;

    function N4K() {
        if ("FORCE_COLOR" in G0) {
            if (G0.FORCE_COLOR === "true") return 1;
            if (G0.FORCE_COLOR === "false") return 0;
            return G0.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(G0.FORCE_COLOR, 10), 3)
        }
    }

    function T4K(A) {
        if (A === 0) return !1;
        return {
            level: A,
            hasBasic: !0,
            has256: A >= 2,
            has16m: A >= 3
        }
    }

    function v4K(A, {
        streamIsTTY: q,
        sniffFlags: K = !0
    } = {}) {
        let Y = N4K();
        if (Y !== void 0) sr1 = Y;
        let z = K ? sr1 : Y;
        if (z === 0) return 0;
        if (K) {
            if (wk("color=16m") || wk("color=full") || wk("color=truecolor")) return 3;
            if (wk("color=256")) return 2
        }
        if (A && !q && z === void 0) return 0;
        let w = z || 0;
        if (G0.TERM === "dumb") return w;
        if (process.platform === "win32") {
            let H = V4K.release().split(".");
            if (Number(H[0]) >= 10 && Number(H[2]) >= 10586) return Number(H[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in G0) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((H) => (H in G0)) || G0.CI_NAME === "codeship") return 1;
            return w
        }
        if ("TEAMCITY_VERSION" in G0) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(G0.TEAMCITY_VERSION) ? 1 : 0;
        if (G0.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in G0) {
            let H = Number.parseInt((G0.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (G0.TERM_PROGRAM) {
                case "iTerm.app":
                    return H >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(G0.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(G0.TERM)) return 1;
        if ("COLORTERM" in G0) return 1;
        return w
    }

    function uS6(A, q = {}) {
        let K = v4K(A, {
            streamIsTTY: A && A.isTTY,
            ...q
        });
        return T4K(K)
    }
    l78.exports = {
        supportsColor: uS6,
        stdout: uS6({
            isTTY: c78.isatty(1)
        }),
        stderr: uS6({
            isTTY: c78.isatty(2)
        })
    }
})
// @from(Ln 16860, Col 4)
a78 = R((r78, er1) => {
    var E4K = h1("tty"),
        tr1 = h1("util");
    r78.init = h4K;
    r78.log = y4K;
    r78.formatArgs = L4K;
    r78.save = C4K;
    r78.load = S4K;
    r78.useColors = k4K;
    r78.destroy = tr1.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    r78.colors = [6, 2, 3, 4, 5, 1];
    try {
        let A = i78();
        if (A && (A.stderr || A).level >= 2) r78.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]
    } catch (A) {}
    r78.inspectOpts = Object.keys(process.env).filter((A) => {
        return /^debug_/i.test(A)
    }).reduce((A, q) => {
        let K = q.substring(6).toLowerCase().replace(/_([a-z])/g, (z, w) => {
                return w.toUpperCase()
            }),
            Y = process.env[q];
        if (/^(yes|on|true|enabled)$/i.test(Y)) Y = !0;
        else if (/^(no|off|false|disabled)$/i.test(Y)) Y = !1;
        else if (Y === "null") Y = null;
        else Y = Number(Y);
        return A[K] = Y, A
    }, {});

    function k4K() {
        return "colors" in r78.inspectOpts ? Boolean(r78.inspectOpts.colors) : E4K.isatty(process.stderr.fd)
    }

    function L4K(A) {
        let {
            namespace: q,
            useColors: K
        } = this;
        if (K) {
            let Y = this.color,
                z = "\x1B[3" + (Y < 8 ? Y : "8;5;" + Y),
                w = `  ${z};1m${q} \x1B[0m`;
            A[0] = w + A[0].split(`
`).join(`
` + w), A.push(z + "m+" + er1.exports.humanize(this.diff) + "\x1B[0m")
        } else A[0] = R4K() + q + " " + A[0]
    }

    function R4K() {
        if (r78.inspectOpts.hideDate) return "";
        return new Date().toISOString() + " "
    }

    function y4K(...A) {
        return process.stderr.write(tr1.formatWithOptions(r78.inspectOpts, ...A) + `
`)
    }

    function C4K(A) {
        if (A) process.env.DEBUG = A;
        else delete process.env.DEBUG
    }

    function S4K() {
        return process.env.DEBUG
    }

    function h4K(A) {
        A.inspectOpts = {};
        let q = Object.keys(r78.inspectOpts);
        for (let K = 0; K < q.length; K++) A.inspectOpts[q[K]] = r78.inspectOpts[q[K]]
    }
    er1.exports = bS6()(r78);
    var {
        formatters: n78
    } = er1.exports;
    n78.o = function(A) {
        return this.inspectOpts.colors = this.useColors, tr1.inspect(A, this.inspectOpts).split(`
`).map((q) => q.trim()).join(" ")
    };
    n78.O = function(A) {
        return this.inspectOpts.colors = this.useColors, tr1.inspect(A, this.inspectOpts)
    }
})
// @from(Ln 16944, Col 4)
L61 = R((Nmz, BS6) => {
    if (typeof process > "u" || process.type === "renderer" || !1 || process.__nwjs) BS6.exports = p78();
    else BS6.exports = a78()
})
// @from(Ln 16948, Col 4)
FS6 = R((DT) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2245/node_modules/spawn-rx/lib/src",
        Hk = DT && DT.__assign || function() {
            return Hk = Object.assign || function(A) {
                for (var q, K = 1, Y = arguments.length; K < Y; K++) {
                    q = arguments[K];
                    for (var z in q)
                        if (Object.prototype.hasOwnProperty.call(q, z)) A[z] = q[z]
                }
                return A
            }, Hk.apply(this, arguments)
        },
        Q4K = DT && DT.__rest || function(A, q) {
            var K = {};
            for (var Y in A)
                if (Object.prototype.hasOwnProperty.call(A, Y) && q.indexOf(Y) < 0) K[Y] = A[Y];
            if (A != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var z = 0, Y = Object.getOwnPropertySymbols(A); z < Y.length; z++)
                    if (q.indexOf(Y[z]) < 0 && Object.prototype.propertyIsEnumerable.call(A, Y[z])) K[Y[z]] = A[Y[z]]
            }
            return K
        },
        g4K = DT && DT.__spreadArray || function(A, q, K) {
            if (K || arguments.length === 2) {
                for (var Y = 0, z = q.length, w; Y < z; Y++)
                    if (w || !(Y in q)) {
                        if (!w) w = Array.prototype.slice.call(q, 0, Y);
                        w[Y] = q[Y]
                    }
            }
            return A.concat(w || Array.prototype.slice.call(q))
        };
    Object.defineProperty(DT, "__esModule", {
        value: !0
    });
    DT.findActualExecutable = Ao1;
    DT.spawnDetached = mS6;
    DT.spawn = nN1;
    DT.spawnDetachedPromise = c4K;
    DT.spawnPromise = l4K;
    var lN1 = h1("path"),
        U4K = h1("net"),
        iN1 = h1("fs"),
        Xi = I78(),
        s78 = F78(),
        p4K = h1("child_process"),
        d4K = L61(),
        A48 = process.platform === "win32",
        a21 = (0, d4K.default)("spawn-rx");

    function t78(A) {
        try {
            return iN1.statSync(A)
        } catch (q) {
            return null
        }
    }

    function e78(A) {
        if (A.match(/[\\/]/)) return a21("Path has slash in directory, bailing"), A;
        var q = lN1.join(".", A);
        if (t78(q)) return a21("Found executable in currect directory: ".concat(q)), iN1.realpathSync(q);
        var K = process.env.PATH.split(A48 ? ";" : ":");
        for (var Y = 0, z = K; Y < z.length; Y++) {
            var w = z[Y],
                H = lN1.join(w, A);
            if (t78(H)) return iN1.realpathSync(H)
        }
        return a21("Failed to find executable anywhere in path"), A
    }

    function Ao1(A, q) {
        if (process.platform !== "win32") return {
            cmd: e78(A),
            args: q
        };
        if (!iN1.existsSync(A)) {
            var K = [".exe", ".bat", ".cmd", ".ps1"];
            for (var Y = 0, z = K; Y < z.length; Y++) {
                var w = z[Y],
                    H = e78("".concat(A).concat(w));
                if (iN1.existsSync(H)) return Ao1(H, q)
            }
        }
        if (A.match(/\.ps1$/i)) {
            var $ = lN1.join(process.env.SYSTEMROOT, "System32", "WindowsPowerShell", "v1.0", "PowerShell.exe"),
                O = ["-ExecutionPolicy", "Unrestricted", "-NoLogo", "-NonInteractive", "-File", A];
            return {
                cmd: $,
                args: O.concat(q)
            }
        }
        if (A.match(/\.(bat|cmd)$/i)) {
            var $ = lN1.join(process.env.SYSTEMROOT, "System32", "cmd.exe"),
                _ = g4K(["/C", A], q, !0);
            return {
                cmd: $,
                args: _
            }
        }
        if (A.match(/\.(js)$/i)) {
            var $ = process.execPath,
                J = [A];
            return {
                cmd: $,
                args: J.concat(q)
            }
        }
        return {
            cmd: A,
            args: q
        }
    }

    function mS6(A, q, K) {
        var Y = Ao1(A, q !== null && q !== void 0 ? q : []),
            z = Y.cmd,
            w = Y.args;
        if (!A48) return nN1(z, w, Object.assign({}, K || {}, {
            detached: !0
        }));
        var H = [z].concat(w),
            $ = lN1.join(__dirname, "..", "..", "vendor", "jobber", "Jobber.exe"),
            O = Hk(Hk({}, K !== null && K !== void 0 ? K : {}), {
                detached: !0,
                jobber: !0
            });
        return a21("spawnDetached: ".concat($, ", ").concat(H)), nN1($, H, O)
    }

    function nN1(A, q, K) {
        K = K !== null && K !== void 0 ? K : {};
        var Y = new Xi.Observable(function(z) {
            var {
                stdin: w,
                jobber: H,
                split: $,
                encoding: O
            } = K, _ = Q4K(K, ["stdin", "jobber", "split", "encoding"]), J = Ao1(A, q), X = J.cmd, D = J.args;
            a21("spawning process: ".concat(X, " ").concat(D.join(), ", ").concat(JSON.stringify(_)));
            var j = (0, p4K.spawn)(X, D, _),
                M = function(Z) {
                    return function(N) {
                        if (N.length < 1) return;
                        if (K.echoOutput)(Z === "stdout" ? process.stdout : process.stderr).write(N);
                        var T = "<< String sent back was too long >>";
                        try {
                            if (typeof N === "string") T = N.toString();
                            else T = N.toString(O || "utf8")
                        } catch (k) {
                            T = "<< Lost chunk of process output for ".concat(A, " - length was ").concat(N.length, ">>")
                        }
                        z.next({
                            source: Z,
                            text: T
                        })
                    }
                },
                P = new Xi.Subscription;
            if (K.stdin)
                if (j.stdin) P.add(K.stdin.subscribe({
                    next: function(Z) {
                        return j.stdin.write(Z)
                    },
                    error: z.error.bind(z),
                    complete: function() {
                        return j.stdin.end()
                    }
                }));
                else z.error(Error("opts.stdio conflicts with provided spawn opts.stdin observable, 'pipe' is required"));
            var W = null,
                G = null,
                f = !1;
            if (j.stdout) G = new Xi.AsyncSubject, j.stdout.on("data", M("stdout")), j.stdout.on("close", function() {
                G.next(!0), G.complete()
            });
            else G = (0, Xi.of)(!0);
            if (j.stderr) W = new Xi.AsyncSubject, j.stderr.on("data", M("stderr")), j.stderr.on("close", function() {
                W.next(!0), W.complete()
            });
            else W = (0, Xi.of)(!0);
            return j.on("error", function(Z) {
                f = !0, z.error(Z)
            }), j.on("close", function(Z) {
                f = !0;
                var N = (0, Xi.merge)(G, W).pipe((0, s78.reduce)(function(T) {
                    return T
                }, !0));
                if (Z === 0) N.subscribe(function() {
                    return z.complete()
                });
                else N.subscribe(function() {
                    var T = Error("Failed with exit code: ".concat(Z));
                    T.exitCode = Z, T.code = Z, z.error(T)
                })
            }), P.add(new Xi.Subscription(function() {
                if (f) return;
                if (a21("Killing process: ".concat(X, " ").concat(D.join())), K.jobber) U4K.connect("\\\\.\\pipe\\jobber-".concat(j.pid)), setTimeout(function() {
                    return j.kill()
                }, 5000);
                else j.kill()
            })), P
        });
        return K.split ? Y : Y.pipe((0, s78.map)(function(z) {
            return z === null || z === void 0 ? void 0 : z.text
        }))
    }

    function q48(A) {
        return new Promise(function(q, K) {
            var Y = "";
            A.subscribe({
                next: function(z) {
                    return Y += z
                },
                error: function(z) {
                    var w = Error("".concat(Y, `
`).concat(z.message));
                    if ("exitCode" in z) w.exitCode = z.exitCode, w.code = z.exitCode;
                    K(w)
                },
                complete: function() {
                    return q(Y)
                }
            })
        })
    }

    function K48(A) {
        return new Promise(function(q, K) {
            var Y = "",
                z = "";
            A.subscribe({
                next: function(w) {
                    return w.source === "stdout" ? Y += w.text : z += w.text
                },
                error: function(w) {
                    var H = Error("".concat(Y, `
`).concat(w.message));
                    if ("exitCode" in w) H.exitCode = w.exitCode, H.code = w.exitCode, H.stdout = Y, H.stderr = z;
                    K(H)
                },
                complete: function() {
                    return q([Y, z])
                }
            })
        })
    }

    function c4K(A, q, K) {
        if (K === null || K === void 0 ? void 0 : K.split) return K48(mS6(A, q, Hk(Hk({}, K !== null && K !== void 0 ? K : {}), {
            split: !0
        })));
        else return q48(mS6(A, q, Hk(Hk({}, K !== null && K !== void 0 ? K : {}), {
            split: !1
        })))
    }

    function l4K(A, q, K) {
        if (K === null || K === void 0 ? void 0 : K.split) return K48(nN1(A, q, Hk(Hk({}, K !== null && K !== void 0 ? K : {}), {
            split: !0
        })));
        else return q48(nN1(A, q, Hk(Hk({}, K !== null && K !== void 0 ? K : {}), {
            split: !1
        })))
    }
})
// @from(Ln 17219, Col 0)
function Aq(A = n4K) {
    let q = new AbortController;
    return i4K(A, q.signal), q
}
// @from(Ln 17224, Col 0)
function r4K(A) {
    let q = this.deref();
    A.deref()?.abort(q?.signal.reason)
}
// @from(Ln 17229, Col 0)
function o4K(A) {
    let q = this.deref(),
        K = A.deref();
    if (q && K) q.signal.removeEventListener("abort", K)
}
// @from(Ln 17235, Col 0)
function R61(A, q) {
    let K = Aq(q);
    if (A.signal.aborted) return K.abort(A.signal.reason), K;
    let Y = new WeakRef(K),
        z = new WeakRef(A),
        w = r4K.bind(z, Y);
    return A.signal.addEventListener("abort", w, {
        once: !0
    }), K.signal.addEventListener("abort", o4K.bind(z, new WeakRef(w)), {
        once: !0
    }), K
}
// @from(Ln 17247, Col 4)
n4K = 50
// @from(Ln 17248, Col 4)
G2 = () => {}
// @from(Ln 17250, Col 0)
function s21() {
    return process.versions.bun !== void 0
}
// @from(Ln 17254, Col 0)
function D9() {
    return typeof Bun < "u" && Array.isArray(Bun.embeddedFiles) && Bun.embeddedFiles.length > 0
}
// @from(Ln 17258, Col 0)
function z48() {
    return "prod"
}
// @from(Ln 17262, Col 0)
function w48() {
    if (process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL) return "-custom-oauth";
    switch (z48()) {
        case "local":
            return "-local-oauth";
        case "staging":
            return "-staging-oauth";
        case "prod":
            return ""
    }
}
// @from(Ln 17274, Col 0)
function P4() {
    let A = (() => {
            switch (z48()) {
                case "local":
                    return e4K;
                case "staging":
                    return t4K ?? Y48;
                case "prod":
                    return Y48
            }
        })(),
        q = process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL;
    if (q) {
        let Y = q.replace(/\/$/, "");
        if (!AqK.includes(Y)) throw Error("CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.");
        A = {
            ...A,
            BASE_API_URL: Y,
            CONSOLE_AUTHORIZE_URL: `${Y}/oauth/authorize`,
            CLAUDE_AI_AUTHORIZE_URL: `${Y}/oauth/authorize`,
            TOKEN_URL: `${Y}/v1/oauth/token`,
            API_KEY_URL: `${Y}/api/oauth/claude_cli/create_api_key`,
            ROLES_URL: `${Y}/api/oauth/claude_cli/roles`,
            CONSOLE_SUCCESS_URL: `${Y}/oauth/code/success?app=claude-code`,
            CLAUDEAI_SUCCESS_URL: `${Y}/oauth/code/success?app=claude-code`,
            MANUAL_REDIRECT_URL: `${Y}/oauth/code/callback`,
            OAUTH_FILE_SUFFIX: "-custom-oauth"
        }
    }
    let K = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
    if (K) A = {
        ...A,
        CLIENT_ID: K
    };
    return A
}
// @from(Ln 17310, Col 4)
Fx = "user:inference"
// @from(Ln 17311, Col 4)
a4K = "org:create_api_key"
// @from(Ln 17312, Col 4)
uf = "oauth-2025-04-20"
// @from(Ln 17313, Col 4)
s4K
// @from(Ln 17313, Col 9)
QS6
// @from(Ln 17313, Col 14)
H48
// @from(Ln 17313, Col 19)
Y48
// @from(Ln 17313, Col 24)
t4K = void 0
// @from(Ln 17314, Col 4)
e4K
// @from(Ln 17314, Col 9)
AqK
// @from(Ln 17315, Col 4)
Uz = v(() => {
    hA();
    s4K = [a4K, "user:profile"], QS6 = ["user:profile", Fx, "user:sessions:claude_code", "user:mcp_servers"], H48 = Array.from(new Set([...s4K, ...QS6])), Y48 = {
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
        MCP_PROXY_URL: "https://mcp-proxy.anthropic.com",
        MCP_PROXY_PATH: "/v1/mcp/{server_id}"
    }, e4K = {
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
    }, AqK = ["https://beacon.claude-ai.staging.ant.dev", "https://claude.fedstart.com", "https://claude-staging.fedstart.com"]
})
// @from(Ln 17347, Col 4)
X48 = R((Cmz, J48) => {
    J48.exports = _48;
    _48.sync = KqK;
    var $48 = h1("fs");

    function qqK(A, q) {
        var K = q.pathExt !== void 0 ? q.pathExt : process.env.PATHEXT;
        if (!K) return !0;
        if (K = K.split(";"), K.indexOf("") !== -1) return !0;
        for (var Y = 0; Y < K.length; Y++) {
            var z = K[Y].toLowerCase();
            if (z && A.substr(-z.length).toLowerCase() === z) return !0
        }
        return !1
    }

    function O48(A, q, K) {
        if (!A.isSymbolicLink() && !A.isFile()) return !1;
        return qqK(q, K)
    }

    function _48(A, q, K) {
        $48.stat(A, function(Y, z) {
            K(Y, Y ? !1 : O48(z, A, q))
        })
    }

    function KqK(A, q) {
        return O48($48.statSync(A), A, q)
    }
})
// @from(Ln 17378, Col 4)
W48 = R((Smz, P48) => {
    P48.exports = j48;
    j48.sync = YqK;
    var D48 = h1("fs");

    function j48(A, q, K) {
        D48.stat(A, function(Y, z) {
            K(Y, Y ? !1 : M48(z, q))
        })
    }

    function YqK(A, q) {
        return M48(D48.statSync(A), q)
    }

    function M48(A, q) {
        return A.isFile() && zqK(A, q)
    }

    function zqK(A, q) {
        var {
            mode: K,
            uid: Y,
            gid: z
        } = A, w = q.uid !== void 0 ? q.uid : process.getuid && process.getuid(), H = q.gid !== void 0 ? q.gid : process.getgid && process.getgid(), $ = parseInt("100", 8), O = parseInt("010", 8), _ = parseInt("001", 8), J = $ | O, X = K & _ || K & O && z === H || K & $ && Y === w || K & J && w === 0;
        return X
    }
})
// @from(Ln 17406, Col 4)
Z48 = R((Imz, G48) => {
    var hmz = h1("fs"),
        qo1;
    if (process.platform === "win32" || global.TESTING_WINDOWS) qo1 = X48();
    else qo1 = W48();
    G48.exports = gS6;
    gS6.sync = wqK;

    function gS6(A, q, K) {
        if (typeof q === "function") K = q, q = {};
        if (!K) {
            if (typeof Promise !== "function") throw TypeError("callback not provided");
            return new Promise(function(Y, z) {
                gS6(A, q || {}, function(w, H) {
                    if (w) z(w);
                    else Y(H)
                })
            })
        }
        qo1(A, q || {}, function(Y, z) {
            if (Y) {
                if (Y.code === "EACCES" || q && q.ignoreErrors) Y = null, z = !1
            }
            K(Y, z)
        })
    }

    function wqK(A, q) {
        try {
            return qo1.sync(A, q || {})
        } catch (K) {
            if (q && q.ignoreErrors || K.code === "EACCES") return !1;
            else throw K
        }
    }
})
// @from(Ln 17442, Col 4)
k48 = R((xmz, E48) => {
    var t21 = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys",
        f48 = h1("path"),
        HqK = t21 ? ";" : ":",
        V48 = Z48(),
        N48 = (A) => Object.assign(Error(`not found: ${A}`), {
            code: "ENOENT"
        }),
        T48 = (A, q) => {
            let K = q.colon || HqK,
                Y = A.match(/\//) || t21 && A.match(/\\/) ? [""] : [...t21 ? [process.cwd()] : [], ...(q.path || process.env.PATH || "").split(K)],
                z = t21 ? q.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "",
                w = t21 ? z.split(K) : [""];
            if (t21) {
                if (A.indexOf(".") !== -1 && w[0] !== "") w.unshift("")
            }
            return {
                pathEnv: Y,
                pathExt: w,
                pathExtExe: z
            }
        },
        v48 = (A, q, K) => {
            if (typeof q === "function") K = q, q = {};
            if (!q) q = {};
            let {
                pathEnv: Y,
                pathExt: z,
                pathExtExe: w
            } = T48(A, q), H = [], $ = (_) => new Promise((J, X) => {
                if (_ === Y.length) return q.all && H.length ? J(H) : X(N48(A));
                let D = Y[_],
                    j = /^".*"$/.test(D) ? D.slice(1, -1) : D,
                    M = f48.join(j, A),
                    P = !j && /^\.[\\\/]/.test(A) ? A.slice(0, 2) + M : M;
                J(O(P, _, 0))
            }), O = (_, J, X) => new Promise((D, j) => {
                if (X === z.length) return D($(J + 1));
                let M = z[X];
                V48(_ + M, {
                    pathExt: w
                }, (P, W) => {
                    if (!P && W)
                        if (q.all) H.push(_ + M);
                        else return D(_ + M);
                    return D(O(_, J, X + 1))
                })
            });
            return K ? $(0).then((_) => K(null, _), K) : $(0)
        },
        $qK = (A, q) => {
            q = q || {};
            let {
                pathEnv: K,
                pathExt: Y,
                pathExtExe: z
            } = T48(A, q), w = [];
            for (let H = 0; H < K.length; H++) {
                let $ = K[H],
                    O = /^".*"$/.test($) ? $.slice(1, -1) : $,
                    _ = f48.join(O, A),
                    J = !O && /^\.[\\\/]/.test(A) ? A.slice(0, 2) + _ : _;
                for (let X = 0; X < Y.length; X++) {
                    let D = J + Y[X];
                    try {
                        if (V48.sync(D, {
                                pathExt: z
                            }))
                            if (q.all) w.push(D);
                            else return D
                    } catch (j) {}
                }
            }
            if (q.all && w.length) return w;
            if (q.nothrow) return null;
            throw N48(A)
        };
    E48.exports = v48;
    v48.sync = $qK
})
// @from(Ln 17522, Col 4)
R48 = R((bmz, US6) => {
    var L48 = (A = {}) => {
        let q = A.env || process.env;
        if ((A.platform || process.platform) !== "win32") return "PATH";
        return Object.keys(q).reverse().find((Y) => Y.toUpperCase() === "PATH") || "Path"
    };
    US6.exports = L48;
    US6.exports.default = L48
})
// @from(Ln 17531, Col 4)
h48 = R((umz, S48) => {
    var y48 = h1("path"),
        OqK = k48(),
        _qK = R48();

    function C48(A, q) {
        let K = A.options.env || process.env,
            Y = process.cwd(),
            z = A.options.cwd != null,
            w = z && process.chdir !== void 0 && !process.chdir.disabled;
        if (w) try {
            process.chdir(A.options.cwd)
        } catch ($) {}
        let H;
        try {
            H = OqK.sync(A.command, {
                path: K[_qK({
                    env: K
                })],
                pathExt: q ? y48.delimiter : void 0
            })
        } catch ($) {} finally {
            if (w) process.chdir(Y)
        }
        if (H) H = y48.resolve(z ? A.options.cwd : "", H);
        return H
    }

    function JqK(A) {
        return C48(A) || C48(A, !0)
    }
    S48.exports = JqK
})
// @from(Ln 17564, Col 4)
I48 = R((jqK, dS6) => {
    var pS6 = /([()\][%!^"`<>&|;, *?])/g;

    function XqK(A) {
        return A = A.replace(pS6, "^$1"), A
    }

    function DqK(A, q) {
        if (A = `${A}`, A = A.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\""), A = A.replace(/(?=(\\+?)?)\1$/, "$1$1"), A = `"${A}"`, A = A.replace(pS6, "^$1"), q) A = A.replace(pS6, "^$1");
        return A
    }
    jqK.command = XqK;
    jqK.argument = DqK
})
// @from(Ln 17578, Col 4)
b48 = R((Bmz, x48) => {
    x48.exports = /^#!(.*)/
})
// @from(Ln 17581, Col 4)
B48 = R((mmz, u48) => {
    var WqK = b48();
    u48.exports = (A = "") => {
        let q = A.match(WqK);
        if (!q) return null;
        let [K, Y] = q[0].replace(/#! ?/, "").split(" "), z = K.split("/").pop();
        if (z === "env") return Y;
        return Y ? `${z} ${Y}` : z
    }
})
// @from(Ln 17591, Col 4)
F48 = R((Fmz, m48) => {
    var cS6 = h1("fs"),
        GqK = B48();

    function ZqK(A) {
        let K = Buffer.alloc(150),
            Y;
        try {
            Y = cS6.openSync(A, "r"), cS6.readSync(Y, K, 0, 150, 0), cS6.closeSync(Y)
        } catch (z) {}
        return GqK(K.toString())
    }
    m48.exports = ZqK
})
// @from(Ln 17605, Col 4)
p48 = R((Qmz, U48) => {
    var fqK = h1("path"),
        Q48 = h48(),
        g48 = I48(),
        VqK = F48(),
        NqK = process.platform === "win32",
        TqK = /\.(?:com|exe)$/i,
        vqK = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

    function EqK(A) {
        A.file = Q48(A);
        let q = A.file && VqK(A.file);
        if (q) return A.args.unshift(A.file), A.command = q, Q48(A);
        return A.file
    }

    function kqK(A) {
        if (!NqK) return A;
        let q = EqK(A),
            K = !TqK.test(q);
        if (A.options.forceShell || K) {
            let Y = vqK.test(q);
            A.command = fqK.normalize(A.command), A.command = g48.command(A.command), A.args = A.args.map((w) => g48.argument(w, Y));
            let z = [A.command].concat(A.args).join(" ");
            A.args = ["/d", "/s", "/c", `"${z}"`], A.command = process.env.comspec || "cmd.exe", A.options.windowsVerbatimArguments = !0
        }
        return A
    }

    function LqK(A, q, K) {
        if (q && !Array.isArray(q)) K = q, q = null;
        q = q ? q.slice(0) : [], K = Object.assign({}, K);
        let Y = {
            command: A,
            args: q,
            options: K,
            file: void 0,
            original: {
                command: A,
                args: q
            }
        };
        return K.shell ? Y : kqK(Y)
    }
    U48.exports = LqK
})
// @from(Ln 17651, Col 4)
l48 = R((gmz, c48) => {
    var lS6 = process.platform === "win32";

    function iS6(A, q) {
        return Object.assign(Error(`${q} ${A.command} ENOENT`), {
            code: "ENOENT",
            errno: "ENOENT",
            syscall: `${q} ${A.command}`,
            path: A.command,
            spawnargs: A.args
        })
    }

    function RqK(A, q) {
        if (!lS6) return;
        let K = A.emit;
        A.emit = function(Y, z) {
            if (Y === "exit") {
                let w = d48(z, q);
                if (w) return K.call(A, "error", w)
            }
            return K.apply(A, arguments)
        }
    }

    function d48(A, q) {
        if (lS6 && A === 1 && !q.file) return iS6(q.original, "spawn");
        return null
    }

    function yqK(A, q) {
        if (lS6 && A === 1 && !q.file) return iS6(q.original, "spawnSync");
        return null
    }
    c48.exports = {
        hookChildProcess: RqK,
        verifyENOENT: d48,
        verifyENOENTSync: yqK,
        notFoundError: iS6
    }
})
// @from(Ln 17692, Col 4)
oS6 = R((Umz, e21) => {
    var i48 = h1("child_process"),
        nS6 = p48(),
        rS6 = l48();

    function n48(A, q, K) {
        let Y = nS6(A, q, K),
            z = i48.spawn(Y.command, Y.args, Y.options);
        return rS6.hookChildProcess(z, Y), z
    }

    function CqK(A, q, K) {
        let Y = nS6(A, q, K),
            z = i48.spawnSync(Y.command, Y.args, Y.options);
        return z.error = z.error || rS6.verifyENOENTSync(z.status, Y), z
    }
    e21.exports = n48;
    e21.exports.spawn = n48;
    e21.exports.sync = CqK;
    e21.exports._parse = nS6;
    e21.exports._enoent = rS6
})
// @from(Ln 17715, Col 0)
function aS6(A) {
    let q = typeof A === "string" ? `
` : `
`.charCodeAt(),
        K = typeof A === "string" ? "\r" : "\r".charCodeAt();
    if (A[A.length - 1] === q) A = A.slice(0, -1);
    if (A[A.length - 1] === K) A = A.slice(0, -1);
    return A
}
// @from(Ln 17725, Col 0)
function Ko1(A = {}) {
    let {
        env: q = process.env,
        platform: K = process.platform
    } = A;
    if (K !== "win32") return "PATH";
    return Object.keys(q).reverse().find((Y) => Y.toUpperCase() === "PATH") || "Path"
}
// @from(Ln 17738, Col 4)
SqK = ({
        cwd: A = Yo1.cwd(),
        path: q = Yo1.env[Ko1()],
        preferLocal: K = !0,
        execPath: Y = Yo1.execPath,
        addExecPath: z = !0
    } = {}) => {
        let w = A instanceof URL ? r48(A) : A,
            H = rN1.resolve(w),
            $ = [];
        if (K) hqK($, H);
        if (z) IqK($, Y, H);
        return [...$, q].join(rN1.delimiter)
    }
// @from(Ln 17752, Col 4)
hqK = (A, q) => {
        let K;
        while (K !== q) A.push(rN1.join(q, "node_modules/.bin")), K = q, q = rN1.resolve(q, "..")
    }
// @from(Ln 17756, Col 4)
IqK = (A, q, K) => {
        let Y = q instanceof URL ? r48(q) : q;
        A.push(rN1.resolve(K, Y, ".."))
    }
// @from(Ln 17760, Col 4)
o48 = ({
        env: A = Yo1.env,
        ...q
    } = {}) => {
        A = {
            ...A
        };
        let K = Ko1({
            env: A
        });
        return q.path = A[K], A[K] = SqK(q), A
    }
// @from(Ln 17772, Col 4)
a48 = () => {}
// @from(Ln 17774, Col 0)
function sS6(A, q, {
    ignoreNonConfigurable: K = !1
} = {}) {
    let {
        name: Y
    } = A;
    for (let z of Reflect.ownKeys(q)) xqK(A, q, z, K);
    return uqK(A, q), QqK(A, q, Y), A
}
// @from(Ln 17783, Col 4)
xqK = (A, q, K, Y) => {
        if (K === "length" || K === "prototype") return;
        if (K === "arguments" || K === "caller") return;
        let z = Object.getOwnPropertyDescriptor(A, K),
            w = Object.getOwnPropertyDescriptor(q, K);
        if (!bqK(z, w) && Y) return;
        Object.defineProperty(A, K, w)
    }
// @from(Ln 17791, Col 4)
bqK = function(A, q) {
        return A === void 0 || A.configurable || A.writable === q.writable && A.enumerable === q.enumerable && A.configurable === q.configurable && (A.writable || A.value === q.value)
    }
// @from(Ln 17794, Col 4)
uqK = (A, q) => {
        let K = Object.getPrototypeOf(q);
        if (K === Object.getPrototypeOf(A)) return;
        Object.setPrototypeOf(A, K)
    }
// @from(Ln 17799, Col 4)
BqK = (A, q) => `/* Wrapped ${A}*/
${q}`
// @from(Ln 17801, Col 4)
mqK
// @from(Ln 17801, Col 9)
FqK
// @from(Ln 17801, Col 14)
QqK = (A, q, K) => {
        let Y = K === "" ? "" : `with ${K.trim()}() `,
            z = BqK.bind(null, Y, q.toString());
        Object.defineProperty(z, "name", FqK), Object.defineProperty(A, "toString", {
            ...mqK,
            value: z
        })
    }
// @from(Ln 17809, Col 4)
s48 = v(() => {
    mqK = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), FqK = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name")
})
// @from(Ln 17812, Col 4)
zo1
// @from(Ln 17812, Col 9)
t48 = (A, q = {}) => {
        if (typeof A !== "function") throw TypeError("Expected a function");
        let K, Y = 0,
            z = A.displayName || A.name || "<anonymous>",
            w = function(...H) {
                if (zo1.set(w, ++Y), Y === 1) K = A.apply(this, H), A = null;
                else if (q.throw === !0) throw Error(`Function \`${z}\` can only be called once`);
                return K
            };
        return sS6(w, A), zo1.set(w, Y), w
    }
// @from(Ln 17823, Col 4)
e48
// @from(Ln 17824, Col 4)
Aq8 = v(() => {
    s48();
    zo1 = new WeakMap;
    t48.callCount = (A) => {
        if (!zo1.has(A)) throw Error(`The given function \`${A.name}\` is not wrapped by the \`onetime\` package`);
        return zo1.get(A)
    };
    e48 = t48
})
// @from(Ln 17833, Col 4)
qq8 = () => {
        let A = tS6 - Kq8 + 1;
        return Array.from({
            length: A
        }, gqK)
    }
// @from(Ln 17839, Col 4)
gqK = (A, q) => ({
        name: `SIGRT${q+1}`,
        number: Kq8 + q,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
    })
// @from(Ln 17846, Col 4)
Kq8 = 34
// @from(Ln 17847, Col 4)
tS6 = 64
// @from(Ln 17848, Col 4)
Yq8
// @from(Ln 17849, Col 4)
zq8 = v(() => {
    Yq8 = [{
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
    }, {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
    }, {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
    }, {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
    }, {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
    }, {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
    }, {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
    }, {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
    }, {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
    }, {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
    }, {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    }, {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
    }, {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    }, {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
    }, {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
    }, {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
    }, {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
    }, {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
    }, {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
    }, {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
    }, {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
    }, {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
    }, {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
    }, {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
    }, {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
    }, {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
    }, {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    }, {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    }, {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
    }, {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
    }, {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
    }, {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
    }, {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
    }, {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
    }, {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
    }]
})
// @from(Ln 18086, Col 4)
eS6 = () => {
        let A = qq8();
        return [...Yq8, ...A].map(pqK)
    }
// @from(Ln 18090, Col 4)
pqK = ({
        name: A,
        number: q,
        description: K,
        action: Y,
        forced: z = !1,
        standard: w
    }) => {
        let {
            signals: {
                [A]: H
            }
        } = UqK, $ = H !== void 0;
        return {
            name: A,
            number: $ ? H : q,
            description: K,
            supported: $,
            action: Y,
            forced: z,
            standard: w
        }
    }
// @from(Ln 18113, Col 4)
wq8 = v(() => {
    zq8()
})
// @from(Ln 18119, Col 4)
cqK = () => {
        let A = eS6();
        return Object.fromEntries(A.map(lqK))
    }
// @from(Ln 18123, Col 4)
lqK = ({
        name: A,
        number: q,
        description: K,
        supported: Y,
        action: z,
        forced: w,
        standard: H
    }) => [A, {
        name: A,
        number: q,
        description: K,
        supported: Y,
        action: z,
        forced: w,
        standard: H
    }]
// @from(Ln 18140, Col 4)
Hq8
// @from(Ln 18140, Col 9)
iqK = () => {
        let A = eS6(),
            q = tS6 + 1,
            K = Array.from({
                length: q
            }, (Y, z) => nqK(z, A));
        return Object.assign({}, ...K)
    }
// @from(Ln 18148, Col 4)
nqK = (A, q) => {
        let K = rqK(A, q);
        if (K === void 0) return {};
        let {
            name: Y,
            description: z,
            supported: w,
            action: H,
            forced: $,
            standard: O
        } = K;
        return {
            [A]: {
                name: Y,
                number: A,
                description: z,
                supported: w,
                action: H,
                forced: $,
                standard: O
            }
        }
    }
// @from(Ln 18171, Col 4)
rqK = (A, q) => {
        let K = q.find(({
            name: Y
        }) => dqK.signals[Y] === A);
        if (K !== void 0) return K;
        return q.find((Y) => Y.number === A)
    }
// @from(Ln 18178, Col 4)
$Fz
// @from(Ln 18179, Col 4)
$q8 = v(() => {
    wq8();
    Hq8 = cqK(), $Fz = iqK()
})
// @from(Ln 18184, Col 4)
aqK = ({
        timedOut: A,
        timeout: q,
        errorCode: K,
        signal: Y,
        signalDescription: z,
        exitCode: w,
        isCanceled: H
    }) => {
        if (A) return `timed out after ${q} milliseconds`;
        if (H) return "was canceled";
        if (K !== void 0) return `failed with ${K}`;
        if (Y !== void 0) return `was killed with ${Y} (${z})`;
        if (w !== void 0) return `failed with exit code ${w}`;
        return "failed"
    }
// @from(Ln 18200, Col 4)
oN1 = ({
        stdout: A,
        stderr: q,
        all: K,
        error: Y,
        signal: z,
        exitCode: w,
        command: H,
        escapedCommand: $,
        timedOut: O,
        isCanceled: _,
        killed: J,
        parsed: {
            options: {
                timeout: X,
                cwd: D = oqK.cwd()
            }
        }
    }) => {
        w = w === null ? void 0 : w, z = z === null ? void 0 : z;
        let j = z === void 0 ? void 0 : Hq8[z].description,
            M = Y && Y.code,
            W = `Command ${aqK({timedOut:O,timeout:X,errorCode:M,signal:z,signalDescription:j,exitCode:w,isCanceled:_})}: ${H}`,
            G = Object.prototype.toString.call(Y) === "[object Error]",
            f = G ? `${W}
${Y.message}` : W,
            Z = [f, q, A].filter(Boolean).join(`
`);
        if (G) Y.originalMessage = Y.message, Y.message = Z;
        else Y = Error(Z);
        if (Y.shortMessage = f, Y.command = H, Y.escapedCommand = $, Y.exitCode = w, Y.signal = z, Y.signalDescription = j, Y.stdout = A, Y.stderr = q, Y.cwd = D, K !== void 0) Y.all = K;
        if ("bufferedData" in Y) delete Y.bufferedData;
        return Y.failed = !0, Y.timedOut = Boolean(O), Y.isCanceled = _, Y.killed = J && !O, Y
    }
// @from(Ln 18234, Col 4)
Oq8 = v(() => {
    $q8()
})
// @from(Ln 18237, Col 4)
wo1
// @from(Ln 18237, Col 9)
sqK = (A) => wo1.some((q) => A[q] !== void 0)
// @from(Ln 18238, Col 4)
_q8 = (A) => {
        if (!A) return;
        let {
            stdio: q
        } = A;
        if (q === void 0) return wo1.map((Y) => A[Y]);
        if (sqK(A)) throw Error(`It's not possible to provide \`stdio\` in combination with one of ${wo1.map((Y)=>`\`${Y}\``).join(", ")}`);
        if (typeof q === "string") return q;
        if (!Array.isArray(q)) throw TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof q}\``);
        let K = Math.max(q.length, wo1.length);
        return Array.from({
            length: K
        }, (Y, z) => q[z])
    }
// @from(Ln 18252, Col 4)
Jq8 = v(() => {
    wo1 = ["stdin", "stdout", "stderr"]
})
// @from(Ln 18255, Col 4)
y61
// @from(Ln 18256, Col 4)
Xq8 = v(() => {
    y61 = [];
    y61.push("SIGHUP", "SIGINT", "SIGTERM");
    if (process.platform !== "win32") y61.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") y61.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT")
})
// @from(Ln 18262, Col 0)
class Dq8 {
    emitted = {
        afterExit: !1,
        exit: !1
    };
    listeners = {
        afterExit: [],
        exit: []
    };
    count = 0;
    id = Math.random();
    constructor() {
        if (qh6[Ah6]) return qh6[Ah6];
        tqK(qh6, Ah6, {
            value: this,
            writable: !1,
            enumerable: !1,
            configurable: !1
        })
    }
    on(A, q) {
        this.listeners[A].push(q)
    }
    removeListener(A, q) {
        let K = this.listeners[A],
            Y = K.indexOf(q);
        if (Y === -1) return;
        if (Y === 0 && K.length === 1) K.length = 0;
        else K.splice(Y, 1)
    }
    emit(A, q, K) {
        if (this.emitted[A]) return !1;
        this.emitted[A] = !0;
        let Y = !1;
        for (let z of this.listeners[A]) Y = z(q, K) === !0 || Y;
        if (A === "exit") Y = this.emit("afterExit", q, K) || Y;
        return Y
    }
}
// @from(Ln 18301, Col 0)
class Yh6 {}
// @from(Ln 18302, Col 4)
Ho1 = (A) => !!A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
// @from(Ln 18303, Col 4)
Ah6
// @from(Ln 18303, Col 9)
qh6
// @from(Ln 18303, Col 14)
tqK
// @from(Ln 18303, Col 19)
eqK = (A) => {
        return {
            onExit(q, K) {
                return A.onExit(q, K)
            },
            load() {
                return A.load()
            },
            unload() {
                return A.unload()
            }
        }
    }
// @from(Ln 18316, Col 4)
jq8
// @from(Ln 18316, Col 9)
Mq8
// @from(Ln 18316, Col 14)
Kh6
// @from(Ln 18316, Col 19)
$o1
// @from(Ln 18316, Col 24)
PFz
// @from(Ln 18316, Col 29)
WFz
// @from(Ln 18317, Col 4)
zh6 = v(() => {
    Xq8();
    Ah6 = Symbol.for("signal-exit emitter"), qh6 = globalThis, tqK = Object.defineProperty.bind(Object);
    jq8 = class jq8 extends Yh6 {
        onExit() {
            return () => {}
        }
        load() {}
        unload() {}
    };
    Mq8 = class Mq8 extends Yh6 {
        #A = Kh6.platform === "win32" ? "SIGINT" : "SIGHUP";
        #q = new Dq8;
        #K;
        #z;
        #Y;
        #$ = {};
        #w = !1;
        constructor(A) {
            super();
            this.#K = A, this.#$ = {};
            for (let q of y61) this.#$[q] = () => {
                let K = this.#K.listeners(q),
                    {
                        count: Y
                    } = this.#q,
                    z = A;
                if (typeof z.__signal_exit_emitter__ === "object" && typeof z.__signal_exit_emitter__.count === "number") Y += z.__signal_exit_emitter__.count;
                if (K.length === Y) {
                    this.unload();
                    let w = this.#q.emit("exit", null, q),
                        H = q === "SIGHUP" ? this.#A : q;
                    if (!w) A.kill(A.pid, H)
                }
            };
            this.#Y = A.reallyExit, this.#z = A.emit
        }
        onExit(A, q) {
            if (!Ho1(this.#K)) return () => {};
            if (this.#w === !1) this.load();
            let K = q?.alwaysLast ? "afterExit" : "exit";
            return this.#q.on(K, A), () => {
                if (this.#q.removeListener(K, A), this.#q.listeners.exit.length === 0 && this.#q.listeners.afterExit.length === 0) this.unload()
            }
        }
        load() {
            if (this.#w) return;
            this.#w = !0, this.#q.count += 1;
            for (let A of y61) try {
                let q = this.#$[A];
                if (q) this.#K.on(A, q)
            } catch (q) {}
            this.#K.emit = (A, ...q) => {
                return this.#J(A, ...q)
            }, this.#K.reallyExit = (A) => {
                return this.#_(A)
            }
        }
        unload() {
            if (!this.#w) return;
            this.#w = !1, y61.forEach((A) => {
                let q = this.#$[A];
                if (!q) throw Error("Listener not defined for signal: " + A);
                try {
                    this.#K.removeListener(A, q)
                } catch (K) {}
            }), this.#K.emit = this.#z, this.#K.reallyExit = this.#Y, this.#q.count -= 1
        }
        #_(A) {
            if (!Ho1(this.#K)) return 0;
            return this.#K.exitCode = A || 0, this.#q.emit("exit", this.#K.exitCode, null), this.#Y.call(this.#K, this.#K.exitCode)
        }
        #J(A, ...q) {
            let K = this.#z;
            if (A === "exit" && Ho1(this.#K)) {
                if (typeof q[0] === "number") this.#K.exitCode = q[0];
                let Y = K.call(this.#K, A, ...q);
                return this.#q.emit("exit", this.#K.exitCode, null), Y
            } else return K.call(this.#K, A, ...q)
        }
    };
    Kh6 = globalThis.process, {
        onExit: $o1,
        load: PFz,
        unload: WFz
    } = eqK(Ho1(Kh6) ? new Mq8(Kh6) : new jq8)
})
// @from(Ln 18405, Col 4)
qKK = 5000
// @from(Ln 18406, Col 4)
Pq8 = (A, q = "SIGTERM", K = {}) => {
        let Y = A(q);
        return KKK(A, q, K, Y), Y
    }
// @from(Ln 18410, Col 4)
KKK = (A, q, K, Y) => {
        if (!YKK(q, K, Y)) return;
        let z = wKK(K),
            w = setTimeout(() => {
                A("SIGKILL")
            }, z);
        if (w.unref) w.unref()
    }
// @from(Ln 18418, Col 4)
YKK = (A, {
        forceKillAfterTimeout: q
    }, K) => zKK(A) && q !== !1 && K
// @from(Ln 18421, Col 4)
zKK = (A) => A === AKK.constants.signals.SIGTERM || typeof A === "string" && A.toUpperCase() === "SIGTERM"
// @from(Ln 18422, Col 4)
wKK = ({
        forceKillAfterTimeout: A = !0
    }) => {
        if (A === !0) return qKK;
        if (!Number.isFinite(A) || A < 0) throw TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${A}\` (${typeof A})`);
        return A
    }
// @from(Ln 18429, Col 4)
Wq8 = (A, q) => {
        if (A.kill()) q.isCanceled = !0
    }
// @from(Ln 18432, Col 4)
HKK = (A, q, K) => {
        A.kill(q), K(Object.assign(Error("Timed out"), {
            timedOut: !0,
            signal: q
        }))
    }
// @from(Ln 18438, Col 4)
Gq8 = (A, {
        timeout: q,
        killSignal: K = "SIGTERM"
    }, Y) => {
        if (q === 0 || q === void 0) return Y;
        let z, w = new Promise(($, O) => {
                z = setTimeout(() => {
                    HKK(A, K, O)
                }, q)
            }),
            H = Y.finally(() => {
                clearTimeout(z)
            });
        return Promise.race([w, H])
    }
// @from(Ln 18453, Col 4)
Zq8 = ({
        timeout: A
    }) => {
        if (A !== void 0 && (!Number.isFinite(A) || A < 0)) throw TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${A}\` (${typeof A})`)
    }
// @from(Ln 18458, Col 4)
fq8 = async (A, {
        cleanup: q,
        detached: K
    }, Y) => {
        if (!q || K) return Y;
        let z = $o1(() => {
            A.kill()
        });
        return Y.finally(() => {
            z()
        })
    }
// @from(Ln 18470, Col 4)
Vq8 = v(() => {
    zh6()
})
// @from(Ln 18474, Col 0)
function Oo1(A) {
    return A !== null && typeof A === "object" && typeof A.pipe === "function"
}
// @from(Ln 18478, Col 0)
function wh6(A) {
    return Oo1(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object"
}
// @from(Ln 18487, Col 4)
_KK = (A) => A instanceof OKK && typeof A.then === "function"
// @from(Ln 18488, Col 4)
Hh6 = (A, q, K) => {
        if (typeof K === "string") return A[q].pipe($KK(K)), A;
        if (wh6(K)) return A[q].pipe(K), A;
        if (!_KK(K)) throw TypeError("The second argument must be a string, a stream or an Execa child process.");
        if (!wh6(K.stdin)) throw TypeError("The target child process's stdin must be available.");
        return A[q].pipe(K.stdin), K
    }
// @from(Ln 18495, Col 4)
Nq8 = (A) => {
        if (A.stdout !== null) A.pipeStdout = Hh6.bind(void 0, A, "stdout");
        if (A.stderr !== null) A.pipeStderr = Hh6.bind(void 0, A, "stderr");
        if (A.all !== void 0) A.pipeAll = Hh6.bind(void 0, A, "all")
    }
// @from(Ln 18500, Col 4)
Tq8 = () => {}
// @from(Ln 18501, Col 4)
aN1 = async (A, {
    init: q,
    convertChunk: K,
    getSize: Y,
    truncateChunk: z,
    addChunk: w,
    getFinalChunk: H,
    finalize: $
}, {
    maxBuffer: O = Number.POSITIVE_INFINITY
} = {}) => {
    if (!XKK(A)) throw Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
    let _ = q();
    _.length = 0;
    try {
        for await (let J of A) {
            let X = DKK(J),
                D = K[X](J, _);
            kq8({
                convertedChunk: D,
                state: _,
                getSize: Y,
                truncateChunk: z,
                addChunk: w,
                maxBuffer: O
            })
        }
        return JKK({
            state: _,
            convertChunk: K,
            getSize: Y,
            truncateChunk: z,
            addChunk: w,
            getFinalChunk: H,
            maxBuffer: O
        }), $(_)
    } catch (J) {
        throw J.bufferedData = $(_), J
    }
}
// @from(Ln 18540, Col 3)
JKK = ({
    state: A,
    getSize: q,
    truncateChunk: K,
    addChunk: Y,
    getFinalChunk: z,
    maxBuffer: w
}) => {
    let H = z(A);
    if (H !== void 0) kq8({
        convertedChunk: H,
        state: A,
        getSize: q,
        truncateChunk: K,
        addChunk: Y,
        maxBuffer: w
    })
}
// @from(Ln 18557, Col 3)
kq8 = ({
    convertedChunk: A,
    state: q,
    getSize: K,
    truncateChunk: Y,
    addChunk: z,
    maxBuffer: w
}) => {
    let H = K(A),
        $ = q.length + H;
    if ($ <= w) {
        vq8(A, q, z, $);
        return
    }
    let O = Y(A, w - q.length);
    if (O !== void 0) vq8(O, q, z, w);
    throw new $h6
}
// @from(Ln 18574, Col 3)
vq8 = (A, q, K, Y) => {
    q.contents = K(A, q, Y), q.length = Y
}
// @from(Ln 18576, Col 3)
XKK = (A) => typeof A === "object" && A !== null && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 18576, Col 102)
DKK = (A) => {
    let q = typeof A;
    if (q === "string") return "string";
    if (q !== "object" || A === null) return "others";
    if (globalThis.Buffer?.isBuffer(A)) return "buffer";
    let K = Eq8.call(A);
    if (K === "[object ArrayBuffer]") return "arrayBuffer";
    if (K === "[object DataView]") return "dataView";
    if (Number.isInteger(A.byteLength) && Number.isInteger(A.byteOffset) && Eq8.call(A.buffer) === "[object ArrayBuffer]") return "typedArray";
    return "others"
}
// @from(Ln 18586, Col 3)
Eq8
// @from(Ln 18586, Col 8)
$h6
// @from(Ln 18587, Col 4)
sN1 = v(() => {
    ({
        toString: Eq8
    } = Object.prototype);
    $h6 = class $h6 extends Error {
        name = "MaxBufferError";
        constructor() {
            super("maxBuffer exceeded")
        }
    }
})
// @from(Ln 18598, Col 4)
Oh6 = (A) => A
// @from(Ln 18599, Col 4)
_h6 = () => {
        return
    }
// @from(Ln 18602, Col 4)
Jh6 = ({
        contents: A
    }) => A
// @from(Ln 18605, Col 4)
_o1 = (A) => {
        throw Error(`Streams in object mode are not supported: ${String(A)}`)
    }
// @from(Ln 18608, Col 4)
Jo1 = (A) => A.length
// @from(Ln 18609, Col 4)
Lq8 = v(() => {
    sN1()
})
// @from(Ln 18612, Col 0)
async function Xh6(A, q) {
    return aN1(A, NKK, q)
}
// @from(Ln 18615, Col 4)
jKK = () => ({
        contents: new ArrayBuffer(0)
    })
// @from(Ln 18618, Col 4)
MKK = (A) => PKK.encode(A)
// @from(Ln 18619, Col 4)
PKK
// @from(Ln 18619, Col 9)
Rq8 = (A) => new Uint8Array(A)
// @from(Ln 18620, Col 4)
yq8 = (A) => new Uint8Array(A.buffer, A.byteOffset, A.byteLength)
// @from(Ln 18621, Col 4)
WKK = (A, q) => A.slice(0, q)
// @from(Ln 18622, Col 4)
GKK = (A, {
        contents: q,
        length: K
    }, Y) => {
        let z = hq8() ? fKK(q, Y) : ZKK(q, Y);
        return new Uint8Array(z).set(A, K), z
    }
// @from(Ln 18629, Col 4)
ZKK = (A, q) => {
        if (q <= A.byteLength) return A;
        let K = new ArrayBuffer(Sq8(q));
        return new Uint8Array(K).set(new Uint8Array(A), 0), K
    }
// @from(Ln 18634, Col 4)
fKK = (A, q) => {
        if (q <= A.maxByteLength) return A.resize(q), A;
        let K = new ArrayBuffer(q, {
            maxByteLength: Sq8(q)
        });
        return new Uint8Array(K).set(new Uint8Array(A), 0), K
    }
// @from(Ln 18641, Col 4)
Sq8 = (A) => Cq8 ** Math.ceil(Math.log(A) / Math.log(Cq8))
// @from(Ln 18642, Col 4)
Cq8 = 2
// @from(Ln 18643, Col 4)
VKK = ({
        contents: A,
        length: q
    }) => hq8() ? A : A.slice(0, q)
// @from(Ln 18647, Col 4)
hq8 = () => ("resize" in ArrayBuffer.prototype)
// @from(Ln 18648, Col 4)
NKK
// @from(Ln 18649, Col 4)
Dh6 = v(() => {
    sN1();
    PKK = new TextEncoder, NKK = {
        init: jKK,
        convertChunk: {
            string: MKK,
            buffer: Rq8,
            arrayBuffer: Rq8,
            dataView: yq8,
            typedArray: yq8,
            others: _o1
        },
        getSize: Jo1,
        truncateChunk: WKK,
        addChunk: GKK,
        getFinalChunk: _h6,
        finalize: VKK
    }
})
// @from(Ln 18668, Col 0)
async function Xo1(A, q) {
    if (!("Buffer" in globalThis)) throw Error("getStreamAsBuffer() is only supported in Node.js");
    try {
        return Iq8(await Xh6(A, q))
    } catch (K) {
        if (K.bufferedData !== void 0) K.bufferedData = Iq8(K.bufferedData);
        throw K
    }
}
// @from(Ln 18677, Col 4)
Iq8 = (A) => globalThis.Buffer.from(A)
// @from(Ln 18678, Col 4)
xq8 = v(() => {
    Dh6()
})
// @from(Ln 18681, Col 0)
async function jh6(A, q) {
    return aN1(A, LKK, q)
}
// @from(Ln 18684, Col 4)
TKK = () => ({
        contents: "",
        textDecoder: new TextDecoder
    })
// @from(Ln 18688, Col 4)
Do1 = (A, {
        textDecoder: q
    }) => q.decode(A, {
        stream: !0
    })
// @from(Ln 18693, Col 4)
vKK = (A, {
        contents: q
    }) => q + A
// @from(Ln 18696, Col 4)
EKK = (A, q) => A.slice(0, q)
// @from(Ln 18697, Col 4)
kKK = ({
        textDecoder: A
    }) => {
        let q = A.decode();
        return q === "" ? void 0 : q
    }
// @from(Ln 18703, Col 4)
LKK
// @from(Ln 18704, Col 4)
bq8 = v(() => {
    sN1();
    LKK = {
        init: TKK,
        convertChunk: {
            string: Oh6,
            buffer: Do1,
            arrayBuffer: Do1,
            dataView: Do1,
            typedArray: Do1,
            others: _o1
        },
        getSize: Jo1,
        truncateChunk: EKK,
        addChunk: vKK,
        getFinalChunk: kKK,
        finalize: Jh6
    }
})
// @from(Ln 18723, Col 4)
uq8 = v(() => {
    Lq8();
    Dh6();
    xq8();
    bq8();
    sN1()
})
// @from(Ln 18730, Col 4)
mq8 = R((iFz, Bq8) => {
    var {
        PassThrough: RKK
    } = h1("stream");
    Bq8.exports = function() {
        var A = [],
            q = new RKK({
                objectMode: !0
            });
        return q.setMaxListeners(0), q.add = K, q.isEmpty = Y, q.on("unpipe", z), Array.prototype.slice.call(arguments).forEach(K), q;

        function K(w) {
            if (Array.isArray(w)) return w.forEach(K), this;
            return A.push(w), w.once("end", z.bind(null, w)), w.once("error", q.emit.bind(q, "error")), w.pipe(q, {
                end: !1
            }), this
        }

        function Y() {
            return A.length == 0
        }

        function z(w) {
            if (A = A.filter(function(H) {
                    return H !== w
                }), !A.length && q.readable) q.end()
        }
    }
})
// @from(Ln 18766, Col 4)
Fq8
// @from(Ln 18766, Col 9)
Qq8 = (A) => {
        if (A !== void 0) throw TypeError("The `input` and `inputFile` options cannot be both set.")
    }
// @from(Ln 18769, Col 4)
hKK = ({
        input: A,
        inputFile: q
    }) => {
        if (typeof q !== "string") return A;
        return Qq8(A), CKK(q)
    }
// @from(Ln 18776, Col 4)
gq8 = (A) => {
        let q = hKK(A);
        if (Oo1(q)) throw TypeError("The `input` option cannot be a stream in sync mode");
        return q
    }
// @from(Ln 18781, Col 4)
IKK = ({
        input: A,
        inputFile: q
    }) => {
        if (typeof q !== "string") return A;
        return Qq8(A), yKK(q)
    }
// @from(Ln 18788, Col 4)
Uq8 = (A, q) => {
        let K = IKK(q);
        if (K === void 0) return;
        if (Oo1(K)) K.pipe(A.stdin);
        else A.stdin.end(K)
    }
// @from(Ln 18794, Col 4)
pq8 = (A, {
        all: q
    }) => {
        if (!q || !A.stdout && !A.stderr) return;
        let K = Fq8.default();
        if (A.stdout) K.add(A.stdout);
        if (A.stderr) K.add(A.stderr);
        return K
    }
// @from(Ln 18803, Col 4)
Mh6 = async (A, q) => {
        if (!A || q === void 0) return;
        await SKK(0), A.destroy();
        try {
            return await q
        } catch (K) {
            return K.bufferedData
        }
    }
// @from(Ln 18811, Col 7)
Ph6 = (A, {
        encoding: q,
        buffer: K,
        maxBuffer: Y
    }) => {
        if (!A || !K) return;
        if (q === "utf8" || q === "utf-8") return jh6(A, {
            maxBuffer: Y
        });
        if (q === null || q === "buffer") return Xo1(A, {
            maxBuffer: Y
        });
        return xKK(A, Y, q)
    }
// @from(Ln 18824, Col 7)
xKK = async (A, q, K) => {
        return (await Xo1(A, {
            maxBuffer: q
        })).toString(K)
    }
// @from(Ln 18828, Col 7)
dq8 = async ({
        stdout: A,
        stderr: q,
        all: K
    }, {
        encoding: Y,
        buffer: z,
        maxBuffer: w
    }, H) => {
        let $ = Ph6(A, {
                encoding: Y,
                buffer: z,
                maxBuffer: w
            }),
            O = Ph6(q, {
                encoding: Y,
                buffer: z,
                maxBuffer: w
            }),
            _ = Ph6(K, {
                encoding: Y,
                buffer: z,
                maxBuffer: w * 2
            });
        try {
            return await Promise.all([H, $, O, _])
        } catch (J) {
            return Promise.all([{
                error: J,
                signal: J.signal,
                timedOut: J.timedOut
            }, Mh6(A, $), Mh6(q, O), Mh6(K, _)])
        }
    }
// @from(Ln 18862, Col 4)
cq8 = v(() => {
    uq8();
    Fq8 = o(mq8(), 1)
})
// @from(Ln 18866, Col 4)
bKK
// @from(Ln 18866, Col 9)
uKK
// @from(Ln 18866, Col 14)
Wh6 = (A, q) => {
        for (let [K, Y] of uKK) {
            let z = typeof q === "function" ? (...w) => Reflect.apply(Y.value, q(), w) : Y.value.bind(q);
            Reflect.defineProperty(A, K, {
                ...Y,
                value: z
            })
        }
    }
// @from(Ln 18875, Col 4)
lq8 = (A) => new Promise((q, K) => {
        if (A.on("exit", (Y, z) => {
                q({
                    exitCode: Y,
                    signal: z
                })
            }), A.on("error", (Y) => {
                K(Y)
            }), A.stdin) A.stdin.on("error", (Y) => {
            K(Y)
        })
    })
// @from(Ln 18887, Col 4)
iq8 = v(() => {
    bKK = (async () => {})().constructor.prototype, uKK = ["then", "catch", "finally"].map((A) => [A, Reflect.getOwnPropertyDescriptor(bKK, A)])
})
// @from(Ln 18896, Col 4)
oq8 = (A, q = []) => {
        if (!Array.isArray(q)) return [A];
        return [A, ...q]
    }
// @from(Ln 18900, Col 4)
FKK
// @from(Ln 18900, Col 9)
QKK = (A) => {
        if (typeof A !== "string" || FKK.test(A)) return A;
        return `"${A.replaceAll('"',"\\\"")}"`
    }
// @from(Ln 18904, Col 4)
Gh6 = (A, q) => oq8(A, q).join(" ")
// @from(Ln 18905, Col 4)
Zh6 = (A, q) => oq8(A, q).map((K) => QKK(K)).join(" ")
// @from(Ln 18906, Col 4)
gKK
// @from(Ln 18906, Col 9)
nq8 = (A) => {
        let q = typeof A;
        if (q === "string") return A;
        if (q === "number") return String(A);
        if (q === "object" && A !== null && !(A instanceof mKK) && "stdout" in A) {
            let K = typeof A.stdout;
            if (K === "string") return A.stdout;
            if (BKK.isBuffer(A.stdout)) return A.stdout.toString();
            throw TypeError(`Unexpected "${K}" stdout in template expression`)
        }
        throw TypeError(`Unexpected "${q}" in template expression`)
    }
// @from(Ln 18918, Col 4)
rq8 = (A, q, K) => K || A.length === 0 || q.length === 0 ? [...A, ...q] : [...A.slice(0, -1), `${A.at(-1)}${q[0]}`, ...q.slice(1)]
// @from(Ln 18919, Col 4)
UKK = ({
        templates: A,
        expressions: q,
        tokens: K,
        index: Y,
        template: z
    }) => {
        let w = z ?? A.raw[Y],
            H = w.split(gKK).filter(Boolean),
            $ = rq8(K, H, w.startsWith(" "));
        if (Y === q.length) return $;
        let O = q[Y],
            _ = Array.isArray(O) ? O.map((J) => nq8(J)) : [nq8(O)];
        return rq8($, _, w.endsWith(" "))
    }
// @from(Ln 18934, Col 4)
fh6 = (A, q) => {
        let K = [];
        for (let [Y, z] of A.entries()) K = UKK({
            templates: A,
            expressions: q,
            tokens: K,
            index: Y,
            template: z
        });
        return K
    }
// @from(Ln 18945, Col 4)
aq8 = v(() => {
    FKK = /^[\w.-]+$/, gKK = / +/g
})
// @from(Ln 18952, Col 4)
sq8
// @from(Ln 18952, Col 9)
jo1 = (A, q) => String(A).padStart(q, "0")
// @from(Ln 18953, Col 4)
cKK = () => {
        let A = new Date;
        return `${jo1(A.getHours(),2)}:${jo1(A.getMinutes(),2)}:${jo1(A.getSeconds(),2)}.${jo1(A.getMilliseconds(),3)}`
    }
// @from(Ln 18957, Col 4)
Vh6 = (A, {
        verbose: q
    }) => {
        if (!q) return;
        dKK.stderr.write(`[${cKK()}] ${A}
`)
    }
// @from(Ln 18964, Col 4)
tq8 = v(() => {
    sq8 = pKK("execa").enabled
})
// @from(Ln 18974, Col 0)
function XY(A, q, K) {
    let Y = qK8(A, q, K),
        z = Gh6(A, q),
        w = Zh6(A, q);
    Vh6(w, Y.options), Zq8(Y.options);
    let H;
    try {
        H = Nh6.spawn(Y.file, Y.args, Y.options)
    } catch (j) {
        let M = new Nh6.ChildProcess,
            P = Promise.reject(oN1({
                error: j,
                stdout: "",
                stderr: "",
                all: "",
                command: z,
                escapedCommand: w,
                parsed: Y,
                timedOut: !1,
                isCanceled: !1,
                killed: !1
            }));
        return Wh6(M, P), M
    }
    let $ = lq8(H),
        O = Gq8(H, Y.options, $),
        _ = fq8(H, Y.options, O),
        J = {
            isCanceled: !1
        };
    H.kill = Pq8.bind(null, H.kill.bind(H)), H.cancel = Wq8.bind(null, H, J);
    let D = e48(async () => {
        let [{
            error: j,
            exitCode: M,
            signal: P,
            timedOut: W
        }, G, f, Z] = await dq8(H, Y.options, _), N = tN1(Y.options, G), T = tN1(Y.options, f), k = tN1(Y.options, Z);
        if (j || M !== 0 || P !== null) {
            let y = oN1({
                error: j,
                exitCode: M,
                signal: P,
                stdout: N,
                stderr: T,
                all: k,
                command: z,
                escapedCommand: w,
                parsed: Y,
                timedOut: W,
                isCanceled: J.isCanceled || (Y.options.signal ? Y.options.signal.aborted : !1),
                killed: H.killed
            });
            if (!Y.options.reject) return y;
            throw y
        }
        return {
            command: z,
            escapedCommand: w,
            exitCode: 0,
            stdout: N,
            stderr: T,
            all: k,
            failed: !1,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        }
    });
    return Uq8(H, Y.options), H.all = pq8(H, Y.options), Nq8(H), Wh6(H, D), H
}
// @from(Ln 19046, Col 0)
function Aw1(A, q, K) {
    let Y = qK8(A, q, K),
        z = Gh6(A, q),
        w = Zh6(A, q);
    Vh6(w, Y.options);
    let H = gq8(Y.options),
        $;
    try {
        $ = Nh6.spawnSync(Y.file, Y.args, {
            ...Y.options,
            input: H
        })
    } catch (J) {
        throw oN1({
            error: J,
            stdout: "",
            stderr: "",
            all: "",
            command: z,
            escapedCommand: w,
            parsed: Y,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        })
    }
    let O = tN1(Y.options, $.stdout, $.error),
        _ = tN1(Y.options, $.stderr, $.error);
    if ($.error || $.status !== 0 || $.signal !== null) {
        let J = oN1({
            stdout: O,
            stderr: _,
            error: $.error,
            signal: $.signal,
            exitCode: $.status,
            command: z,
            escapedCommand: w,
            parsed: Y,
            timedOut: $.error && $.error.code === "ETIMEDOUT",
            isCanceled: !1,
            killed: $.signal !== null
        });
        if (!Y.options.reject) return J;
        throw J
    }
    return {
        command: z,
        escapedCommand: w,
        exitCode: 0,
        stdout: O,
        stderr: _,
        failed: !1,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
    }
}
// @from(Ln 19104, Col 0)
function KK8(A) {
    function q(K, ...Y) {
        if (!Array.isArray(K)) return KK8({
            ...A,
            ...K
        });
        let [z, ...w] = fh6(K, Y);
        return XY(z, w, eq8(A))
    }
    return q.sync = (K, ...Y) => {
        if (!Array.isArray(K)) throw TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
        let [z, ...w] = fh6(K, Y);
        return Aw1(z, w, eq8(A))
    }, q
}
// @from(Ln 19119, Col 4)
AK8
// @from(Ln 19119, Col 9)
nKK = 1e8
// @from(Ln 19120, Col 4)
rKK = ({
        env: A,
        extendEnv: q,
        preferLocal: K,
        localDir: Y,
        execPath: z
    }) => {
        let w = q ? {
            ...Mo1.env,
            ...A
        } : A;
        if (K) return o48({
            env: w,
            cwd: Y,
            execPath: z
        });
        return w
    }
// @from(Ln 19138, Col 4)
qK8 = (A, q, K = {}) => {
        let Y = AK8.default._parse(A, q, K);
        if (A = Y.command, q = Y.args, K = Y.options, K = {
                maxBuffer: nKK,
                buffer: !0,
                stripFinalNewline: !0,
                extendEnv: !0,
                preferLocal: !1,
                localDir: K.cwd || Mo1.cwd(),
                execPath: Mo1.execPath,
                encoding: "utf8",
                reject: !0,
                cleanup: !0,
                all: !1,
                windowsHide: !0,
                verbose: sq8,
                ...K
            }, K.env = rKK(K), K.stdio = _q8(K), Mo1.platform === "win32" && iKK.basename(A, ".exe") === "cmd") q.unshift("/q");
        return {
            file: A,
            args: q,
            options: K,
            parsed: Y
        }
    }
// @from(Ln 19163, Col 4)
tN1 = (A, q, K) => {
        if (typeof q !== "string" && !lKK.isBuffer(q)) return K === void 0 ? void 0 : "";
        if (A.stripFinalNewline) return aS6(q);
        return q
    }
// @from(Ln 19168, Col 4)
oKK = ({
        input: A,
        inputFile: q,
        stdio: K
    }) => A === void 0 && q === void 0 && K === void 0 ? {
        stdin: "inherit"
    } : {}
// @from(Ln 19175, Col 4)
eq8 = (A = {}) => ({
        preferLocal: !0,
        ...oKK(A),
        ...A
    })
// @from(Ln 19180, Col 4)
TQz
// @from(Ln 19181, Col 4)
Bf = v(() => {
    a48();
    Aq8();
    Oq8();
    Jq8();
    Vq8();
    Tq8();
    cq8();
    iq8();
    aq8();
    tq8();
    AK8 = o(oS6(), 1);
    TQz = KK8()
})
// @from(Ln 19199, Col 0)
function sKK(A, q) {
    performance.now() - q > $Q
}
// @from(Ln 19203, Col 0)
function $k(A, q) {
    let K = `execSync: ${A.slice(0,100)}`,
        Y = performance.now();
    try {
        return aKK(A, q)
    } finally {
        sKK(K, Y)
    }
}
// @from(Ln 19212, Col 4)
eN1 = v(() => {
    Z6();
    B6();
    m6()
})
// @from(Ln 19217, Col 0)
async function tKK(A) {
    if (process.platform === "win32") {
        let K = await XY(`where.exe ${A}`, {
            shell: !0,
            stderr: "ignore",
            reject: !1
        });
        if (K.exitCode !== 0 || !K.stdout) return null;
        return K.stdout.trim().split(/\r?\n/)[0] || null
    }
    let q = await XY(`which ${A}`, {
        shell: !0,
        stderr: "ignore",
        reject: !1
    });
    if (q.exitCode !== 0 || !q.stdout) return null;
    return q.stdout.trim()
}
// @from(Ln 19236, Col 0)
function eKK(A) {
    if (process.platform === "win32") try {
        return $k(`where.exe ${A}`, {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).toString().trim().split(/\r?\n/)[0] || null
    } catch {
        return null
    }
    try {
        return $k(`which ${A}`, {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).toString().trim() || null
    } catch {
        return null
    }
}
// @from(Ln 19254, Col 0)
async function mf(A) {
    if (typeof Bun < "u") return Bun.which(A);
    return tKK(A)
}
// @from(Ln 19259, Col 0)
function Po1(A) {
    if (typeof Bun < "u") return Bun.which(A);
    return eKK(A)
}
// @from(Ln 19263, Col 4)
WQ = v(() => {
    Bf();
    eN1()
})
// @from(Ln 19268, Col 0)
function AT1(A, q) {
    return function() {
        return A.apply(q, arguments)
    }
}
// @from(Ln 19274, Col 0)
function q3K(A) {
    return A !== null && !qT1(A) && A.constructor !== null && !qT1(A.constructor) && jT(A.constructor.isBuffer) && A.constructor.isBuffer(A)
}
// @from(Ln 19278, Col 0)
function K3K(A) {
    let q;
    if (typeof ArrayBuffer < "u" && ArrayBuffer.isView) q = ArrayBuffer.isView(A);
    else q = A && A.buffer && zK8(A.buffer);
    return q
}
// @from(Ln 19285, Col 0)
function KT1(A, q, {
    allOwnKeys: K = !1
} = {}) {
    if (A === null || typeof A > "u") return;
    let Y, z;
    if (typeof A !== "object") A = [A];
    if (qw1(A))
        for (Y = 0, z = A.length; Y < z; Y++) q.call(null, A[Y], Y, A);
    else {
        let w = K ? Object.getOwnPropertyNames(A) : Object.keys(A),
            H = w.length,
            $;
        for (Y = 0; Y < H; Y++) $ = w[Y], q.call(null, A[$], $, A)
    }
}
// @from(Ln 19301, Col 0)
function HK8(A, q) {
    q = q.toLowerCase();
    let K = Object.keys(A),
        Y = K.length,
        z;
    while (Y-- > 0)
        if (z = K[Y], q === z.toLowerCase()) return z;
    return null
}
// @from(Ln 19311, Col 0)
function Th6() {
    let {
        caseless: A
    } = $K8(this) && this || {}, q = {}, K = (Y, z) => {
        let w = A && HK8(q, z) || z;
        if (Wo1(q[w]) && Wo1(Y)) q[w] = Th6(q[w], Y);
        else if (Wo1(Y)) q[w] = Th6({}, Y);
        else if (qw1(Y)) q[w] = Y.slice();
        else q[w] = Y
    };
    for (let Y = 0, z = arguments.length; Y < z; Y++) arguments[Y] && KT1(arguments[Y], K);
    return q
}
// @from(Ln 19325, Col 0)
function x3K(A) {
    return !!(A && jT(A.append) && A[Symbol.toStringTag] === "FormData" && A[Symbol.iterator])
}
// @from(Ln 19328, Col 4)
A3K
// @from(Ln 19328, Col 9)
vh6
// @from(Ln 19328, Col 14)
Go1
// @from(Ln 19328, Col 19)
HC = (A) => {
        return A = A.toLowerCase(), (q) => Go1(q) === A
    }
// @from(Ln 19331, Col 4)
Zo1 = (A) => (q) => typeof q === A
// @from(Ln 19332, Col 4)
qw1
// @from(Ln 19332, Col 9)
qT1
// @from(Ln 19332, Col 14)
zK8
// @from(Ln 19332, Col 19)
Y3K
// @from(Ln 19332, Col 24)
jT
// @from(Ln 19332, Col 28)
wK8
// @from(Ln 19332, Col 33)
fo1 = (A) => A !== null && typeof A === "object"
// @from(Ln 19333, Col 4)
z3K = (A) => A === !0 || A === !1
// @from(Ln 19334, Col 4)
Wo1 = (A) => {
        if (Go1(A) !== "object") return !1;
        let q = vh6(A);
        return (q === null || q === Object.prototype || Object.getPrototypeOf(q) === null) && !(Symbol.toStringTag in A) && !(Symbol.iterator in A)
    }
// @from(Ln 19339, Col 4)
w3K
// @from(Ln 19339, Col 9)
H3K
// @from(Ln 19339, Col 14)
$3K
// @from(Ln 19339, Col 19)
O3K
// @from(Ln 19339, Col 24)
_3K = (A) => fo1(A) && jT(A.pipe)
// @from(Ln 19340, Col 4)
J3K = (A) => {
        let q;
        return A && (typeof FormData === "function" && A instanceof FormData || jT(A.append) && ((q = Go1(A)) === "formdata" || q === "object" && jT(A.toString) && A.toString() === "[object FormData]"))
    }
// @from(Ln 19344, Col 4)
X3K
// @from(Ln 19344, Col 9)
D3K
// @from(Ln 19344, Col 14)
j3K
// @from(Ln 19344, Col 19)
M3K
// @from(Ln 19344, Col 24)
P3K
// @from(Ln 19344, Col 29)
W3K = (A) => A.trim ? A.trim() : A.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
// @from(Ln 19345, Col 4)
C61
// @from(Ln 19345, Col 9)
$K8 = (A) => !qT1(A) && A !== C61
// @from(Ln 19346, Col 4)
G3K = (A, q, K, {
        allOwnKeys: Y
    } = {}) => {
        return KT1(q, (z, w) => {
            if (K && jT(z)) A[w] = AT1(z, K);
            else A[w] = z
        }, {
            allOwnKeys: Y
        }), A
    }
// @from(Ln 19356, Col 4)
Z3K = (A) => {
        if (A.charCodeAt(0) === 65279) A = A.slice(1);
        return A
    }
// @from(Ln 19360, Col 4)
f3K = (A, q, K, Y) => {
        A.prototype = Object.create(q.prototype, Y), A.prototype.constructor = A, Object.defineProperty(A, "super", {
            value: q.prototype
        }), K && Object.assign(A.prototype, K)
    }
// @from(Ln 19365, Col 4)
V3K = (A, q, K, Y) => {
        let z, w, H, $ = {};
        if (q = q || {}, A == null) return q;
        do {
            z = Object.getOwnPropertyNames(A), w = z.length;
            while (w-- > 0)
                if (H = z[w], (!Y || Y(H, A, q)) && !$[H]) q[H] = A[H], $[H] = !0;
            A = K !== !1 && vh6(A)
        } while (A && (!K || K(A, q)) && A !== Object.prototype);
        return q
    }
// @from(Ln 19376, Col 4)
N3K = (A, q, K) => {
        if (A = String(A), K === void 0 || K > A.length) K = A.length;
        K -= q.length;
        let Y = A.indexOf(q, K);
        return Y !== -1 && Y === K
    }
// @from(Ln 19382, Col 4)
T3K = (A) => {
        if (!A) return null;
        if (qw1(A)) return A;
        let q = A.length;
        if (!wK8(q)) return null;
        let K = Array(q);
        while (q-- > 0) K[q] = A[q];
        return K
    }
// @from(Ln 19391, Col 4)
v3K
// @from(Ln 19391, Col 9)
E3K = (A, q) => {
        let Y = (A && A[Symbol.iterator]).call(A),
            z;
        while ((z = Y.next()) && !z.done) {
            let w = z.value;
            q.call(A, w[0], w[1])
        }
    }
// @from(Ln 19399, Col 4)
k3K = (A, q) => {
        let K, Y = [];
        while ((K = A.exec(q)) !== null) Y.push(K);
        return Y
    }
// @from(Ln 19404, Col 4)
L3K
// @from(Ln 19404, Col 9)
R3K = (A) => {
        return A.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(K, Y, z) {
            return Y.toUpperCase() + z
        })
    }
// @from(Ln 19409, Col 4)
YK8
// @from(Ln 19409, Col 9)
y3K
// @from(Ln 19409, Col 14)
OK8 = (A, q) => {
        let K = Object.getOwnPropertyDescriptors(A),
            Y = {};
        KT1(K, (z, w) => {
            let H;
            if ((H = q(z, w, A)) !== !1) Y[w] = H || z
        }), Object.defineProperties(A, Y)
    }
// @from(Ln 19417, Col 4)
C3K = (A) => {
        OK8(A, (q, K) => {
            if (jT(A) && ["arguments", "caller", "callee"].indexOf(K) !== -1) return !1;
            let Y = A[K];
            if (!jT(Y)) return;
            if (q.enumerable = !1, "writable" in q) {
                q.writable = !1;
                return
            }
            if (!q.set) q.set = () => {
                throw Error("Can not rewrite read-only method '" + K + "'")
            }
        })
    }
// @from(Ln 19431, Col 4)
S3K = (A, q) => {
        let K = {},
            Y = (z) => {
                z.forEach((w) => {
                    K[w] = !0
                })
            };
        return qw1(A) ? Y(A) : Y(String(A).split(q)), K
    }
// @from(Ln 19440, Col 4)
h3K = () => {}
// @from(Ln 19441, Col 4)
I3K = (A, q) => {
        return A != null && Number.isFinite(A = +A) ? A : q
    }
// @from(Ln 19444, Col 4)
b3K = (A) => {
        let q = [, , , , , , , , , , ],
            K = (Y, z) => {
                if (fo1(Y)) {
                    if (q.indexOf(Y) >= 0) return;
                    if (!("toJSON" in Y)) {
                        q[z] = Y;
                        let w = qw1(Y) ? [] : {};
                        return KT1(Y, (H, $) => {
                            let O = K(H, z + 1);
                            !qT1(O) && (w[$] = O)
                        }), q[z] = void 0, w
                    }
                }
                return Y
            };
        return K(A, 0)
    }
// @from(Ln 19462, Col 4)
u3K
// @from(Ln 19462, Col 9)
B3K = (A) => A && (fo1(A) || jT(A)) && jT(A.then) && jT(A.catch)
// @from(Ln 19463, Col 4)
_K8
// @from(Ln 19463, Col 9)
m3K
// @from(Ln 19463, Col 14)
i6
// @from(Ln 19464, Col 4)
Zw = v(() => {
    ({
        toString: A3K
    } = Object.prototype), {
        getPrototypeOf: vh6
    } = Object, Go1 = ((A) => (q) => {
        let K = A3K.call(q);
        return A[K] || (A[K] = K.slice(8, -1).toLowerCase())
    })(Object.create(null)), {
        isArray: qw1
    } = Array, qT1 = Zo1("undefined");
    zK8 = HC("ArrayBuffer");
    Y3K = Zo1("string"), jT = Zo1("function"), wK8 = Zo1("number"), w3K = HC("Date"), H3K = HC("File"), $3K = HC("Blob"), O3K = HC("FileList"), X3K = HC("URLSearchParams"), [D3K, j3K, M3K, P3K] = ["ReadableStream", "Request", "Response", "Headers"].map(HC);
    C61 = (() => {
        if (typeof globalThis < "u") return globalThis;
        return typeof self < "u" ? self : typeof window < "u" ? window : global
    })();
    v3K = ((A) => {
        return (q) => {
            return A && q instanceof A
        }
    })(typeof Uint8Array < "u" && vh6(Uint8Array)), L3K = HC("HTMLFormElement"), YK8 = (({
        hasOwnProperty: A
    }) => (q, K) => A.call(q, K))(Object.prototype), y3K = HC("RegExp");
    u3K = HC("AsyncFunction"), _K8 = ((A, q) => {
        if (A) return setImmediate;
        return q ? ((K, Y) => {
            return C61.addEventListener("message", ({
                source: z,
                data: w
            }) => {
                if (z === C61 && w === K) Y.length && Y.shift()()
            }, !1), (z) => {
                Y.push(z), C61.postMessage(K, "*")
            }
        })(`axios@${Math.random()}`, []) : (K) => setTimeout(K)
    })(typeof setImmediate === "function", jT(C61.postMessage)), m3K = typeof queueMicrotask < "u" ? queueMicrotask.bind(C61) : typeof process < "u" && process.nextTick || _K8, i6 = {
        isArray: qw1,
        isArrayBuffer: zK8,
        isBuffer: q3K,
        isFormData: J3K,
        isArrayBufferView: K3K,
        isString: Y3K,
        isNumber: wK8,
        isBoolean: z3K,
        isObject: fo1,
        isPlainObject: Wo1,
        isReadableStream: D3K,
        isRequest: j3K,
        isResponse: M3K,
        isHeaders: P3K,
        isUndefined: qT1,
        isDate: w3K,
        isFile: H3K,
        isBlob: $3K,
        isRegExp: y3K,
        isFunction: jT,
        isStream: _3K,
        isURLSearchParams: X3K,
        isTypedArray: v3K,
        isFileList: O3K,
        forEach: KT1,
        merge: Th6,
        extend: G3K,
        trim: W3K,
        stripBOM: Z3K,
        inherits: f3K,
        toFlatObject: V3K,
        kindOf: Go1,
        kindOfTest: HC,
        endsWith: N3K,
        toArray: T3K,
        forEachEntry: E3K,
        matchAll: k3K,
        isHTMLForm: L3K,
        hasOwnProperty: YK8,
        hasOwnProp: YK8,
        reduceDescriptors: OK8,
        freezeMethods: C3K,
        toObjectSet: S3K,
        toCamelCase: R3K,
        noop: h3K,
        toFiniteNumber: I3K,
        findKey: HK8,
        global: C61,
        isContextDefined: $K8,
        isSpecCompliantForm: x3K,
        toJSONObject: b3K,
        isAsyncFn: u3K,
        isThenable: B3K,
        setImmediate: _K8,
        asap: m3K
    }
})
// @from(Ln 19559, Col 0)
function Kw1(A, q, K, Y, z) {
    if (Error.call(this), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    else this.stack = Error().stack;
    if (this.message = A, this.name = "AxiosError", q && (this.code = q), K && (this.config = K), Y && (this.request = Y), z) this.response = z, this.status = z.status ? z.status : null
}
// @from(Ln 19564, Col 4)
JK8
// @from(Ln 19564, Col 9)
XK8
// @from(Ln 19564, Col 14)
H4
// @from(Ln 19565, Col 4)
MT = v(() => {
    Zw();
    i6.inherits(Kw1, Error, {
        toJSON: function() {
            return {
                message: this.message,
                name: this.name,
                description: this.description,
                number: this.number,
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                config: i6.toJSONObject(this.config),
                code: this.code,
                status: this.status
            }
        }
    });
    JK8 = Kw1.prototype, XK8 = {};
    ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((A) => {
        XK8[A] = {
            value: A
        }
    });
    Object.defineProperties(Kw1, XK8);
    Object.defineProperty(JK8, "isAxiosError", {
        value: !0
    });
    Kw1.from = (A, q, K, Y, z, w) => {
        let H = Object.create(JK8);
        return i6.toFlatObject(A, H, function(O) {
            return O !== Error.prototype
        }, ($) => {
            return $ !== "isAxiosError"
        }), Kw1.call(H, A.message, q, K, Y, z), H.cause = A, H.name = A.name, w && Object.assign(H, w), H
    };
    H4 = Kw1
})
// @from(Ln 19604, Col 4)
MK8 = R((QQz, jK8) => {
    var DK8 = h1("stream").Stream,
        F3K = h1("util");
    jK8.exports = $C;

    function $C() {
        this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
    }
    F3K.inherits($C, DK8);
    $C.create = function(A, q) {
        var K = new this;
        q = q || {};
        for (var Y in q) K[Y] = q[Y];
        K.source = A;
        var z = A.emit;
        if (A.emit = function() {
                return K._handleEmit(arguments), z.apply(A, arguments)
            }, A.on("error", function() {}), K.pauseStream) A.pause();
        return K
    };
    Object.defineProperty($C.prototype, "readable", {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.source.readable
        }
    });
    $C.prototype.setEncoding = function() {
        return this.source.setEncoding.apply(this.source, arguments)
    };
    $C.prototype.resume = function() {
        if (!this._released) this.release();
        this.source.resume()
    };
    $C.prototype.pause = function() {
        this.source.pause()
    };
    $C.prototype.release = function() {
        this._released = !0, this._bufferedEvents.forEach(function(A) {
            this.emit.apply(this, A)
        }.bind(this)), this._bufferedEvents = []
    };
    $C.prototype.pipe = function() {
        var A = DK8.prototype.pipe.apply(this, arguments);
        return this.resume(), A
    };
    $C.prototype._handleEmit = function(A) {
        if (this._released) {
            this.emit.apply(this, A);
            return
        }
        if (A[0] === "data") this.dataSize += A[1].length, this._checkIfMaxDataSizeExceeded();
        this._bufferedEvents.push(A)
    };
    $C.prototype._checkIfMaxDataSizeExceeded = function() {
        if (this._maxDataSizeExceeded) return;
        if (this.dataSize <= this.maxDataSize) return;
        this._maxDataSizeExceeded = !0;
        var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this.emit("error", Error(A))
    }
})
// @from(Ln 19666, Col 4)
ZK8 = R((gQz, GK8) => {
    var Q3K = h1("util"),
        WK8 = h1("stream").Stream,
        PK8 = MK8();
    GK8.exports = j_;

    function j_() {
        this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
    }
    Q3K.inherits(j_, WK8);
    j_.create = function(A) {
        var q = new this;
        A = A || {};
        for (var K in A) q[K] = A[K];
        return q
    };
    j_.isStreamLike = function(A) {
        return typeof A !== "function" && typeof A !== "string" && typeof A !== "boolean" && typeof A !== "number" && !Buffer.isBuffer(A)
    };
    j_.prototype.append = function(A) {
        var q = j_.isStreamLike(A);
        if (q) {
            if (!(A instanceof PK8)) {
                var K = PK8.create(A, {
                    maxDataSize: 1 / 0,
                    pauseStream: this.pauseStreams
                });
                A.on("data", this._checkDataSize.bind(this)), A = K
            }
            if (this._handleErrors(A), this.pauseStreams) A.pause()
        }
        return this._streams.push(A), this
    };
    j_.prototype.pipe = function(A, q) {
        return WK8.prototype.pipe.call(this, A, q), this.resume(), A
    };
    j_.prototype._getNext = function() {
        if (this._currentStream = null, this._insideLoop) {
            this._pendingNext = !0;
            return
        }
        this._insideLoop = !0;
        try {
            do this._pendingNext = !1, this._realGetNext(); while (this._pendingNext)
        } finally {
            this._insideLoop = !1
        }
    };
    j_.prototype._realGetNext = function() {
        var A = this._streams.shift();
        if (typeof A > "u") {
            this.end();
            return
        }
        if (typeof A !== "function") {
            this._pipeNext(A);
            return
        }
        var q = A;
        q(function(K) {
            var Y = j_.isStreamLike(K);
            if (Y) K.on("data", this._checkDataSize.bind(this)), this._handleErrors(K);
            this._pipeNext(K)
        }.bind(this))
    };
    j_.prototype._pipeNext = function(A) {
        this._currentStream = A;
        var q = j_.isStreamLike(A);
        if (q) {
            A.on("end", this._getNext.bind(this)), A.pipe(this, {
                end: !1
            });
            return
        }
        var K = A;
        this.write(K), this._getNext()
    };
    j_.prototype._handleErrors = function(A) {
        var q = this;
        A.on("error", function(K) {
            q._emitError(K)
        })
    };
    j_.prototype.write = function(A) {
        this.emit("data", A)
    };
    j_.prototype.pause = function() {
        if (!this.pauseStreams) return;
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
        this.emit("pause")
    };
    j_.prototype.resume = function() {
        if (!this._released) this._released = !0, this.writable = !0, this._getNext();
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
        this.emit("resume")
    };
    j_.prototype.end = function() {
        this._reset(), this.emit("end")
    };
    j_.prototype.destroy = function() {
        this._reset(), this.emit("close")
    };
    j_.prototype._reset = function() {
        this.writable = !1, this._streams = [], this._currentStream = null
    };
    j_.prototype._checkDataSize = function() {
        if (this._updateDataSize(), this.dataSize <= this.maxDataSize) return;
        var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this._emitError(Error(A))
    };
    j_.prototype._updateDataSize = function() {
        this.dataSize = 0;
        var A = this;
        if (this._streams.forEach(function(q) {
                if (!q.dataSize) return;
                A.dataSize += q.dataSize
            }), this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize
    };
    j_.prototype._emitError = function(A) {
        this._reset(), this.emit("error", A)
    }
})