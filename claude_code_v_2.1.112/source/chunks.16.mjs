
// @from(Ln 42044, Col 0)
function BU5() {
    let q = process.env.CLAUDE_LOCAL_OAUTH_API_BASE?.replace(/\/$/, "") ?? "http://localhost:8000",
        K = process.env.CLAUDE_LOCAL_OAUTH_APPS_BASE?.replace(/\/$/, "") ?? "http://localhost:4000",
        _ = process.env.CLAUDE_LOCAL_OAUTH_CONSOLE_BASE?.replace(/\/$/, "") ?? "http://localhost:3000";
    return {
        BASE_API_URL: q,
        CONSOLE_AUTHORIZE_URL: `${_}/oauth/authorize`,
        CLAUDE_AI_AUTHORIZE_URL: `${K}/oauth/authorize`,
        CLAUDE_AI_ORIGIN: K,
        TOKEN_URL: `${q}/v1/oauth/token`,
        API_KEY_URL: `${q}/api/oauth/claude_cli/create_api_key`,
        ROLES_URL: `${q}/api/oauth/claude_cli/roles`,
        CONSOLE_SUCCESS_URL: `${_}/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code`,
        CLAUDEAI_SUCCESS_URL: `${_}/oauth/code/success?app=claude-code`,
        MANUAL_REDIRECT_URL: `${_}/oauth/code/callback`,
        CLIENT_ID: "22422756-60c9-4084-8eb7-27705fd5cf9a",
        OAUTH_FILE_SUFFIX: "-local-oauth",
        MCP_PROXY_URL: "http://localhost:8205",
        MCP_PROXY_PATH: "/v1/toolbox/shttp/mcp/{server_id}"
    }
}
// @from(Ln 42066, Col 0)
function r7() {
    let q = (() => {
            switch (Xu7()) {
                case "local":
                    return BU5();
                case "staging":
                    return mU5 ?? Ju7;
                case "prod":
                    return Ju7
            }
        })(),
        K = process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL;
    if (K) {
        let z = K.replace(/\/$/, "");
        if (!pU5.includes(z)) throw Error("CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.");
        q = {
            ...q,
            BASE_API_URL: z,
            CONSOLE_AUTHORIZE_URL: `${z}/oauth/authorize`,
            CLAUDE_AI_AUTHORIZE_URL: `${z}/oauth/authorize`,
            CLAUDE_AI_ORIGIN: z,
            TOKEN_URL: `${z}/v1/oauth/token`,
            API_KEY_URL: `${z}/api/oauth/claude_cli/create_api_key`,
            ROLES_URL: `${z}/api/oauth/claude_cli/roles`,
            CONSOLE_SUCCESS_URL: `${z}/oauth/code/success?app=claude-code`,
            CLAUDEAI_SUCCESS_URL: `${z}/oauth/code/success?app=claude-code`,
            MANUAL_REDIRECT_URL: `${z}/oauth/code/callback`,
            OAUTH_FILE_SUFFIX: "-custom-oauth"
        }
    }
    let _ = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
    if (_) q = {
        ...q,
        CLIENT_ID: _
    };
    return q
}
// @from(Ln 42103, Col 4)
dC = "user:inference"
// @from(Ln 42104, Col 4)
fA6 = "user:profile"
// @from(Ln 42105, Col 4)
uU5 = "org:create_api_key"
// @from(Ln 42106, Col 4)
eJ = "oauth-2025-04-20"
// @from(Ln 42107, Col 4)
Mu7
// @from(Ln 42107, Col 9)
dH8
// @from(Ln 42107, Col 14)
AY1
// @from(Ln 42107, Col 19)
Ju7
// @from(Ln 42107, Col 24)
OY1 = "https://claude.ai/oauth/claude-code-client-metadata"
// @from(Ln 42108, Col 4)
mU5 = void 0
// @from(Ln 42109, Col 4)
pU5
// @from(Ln 42110, Col 4)
z3 = L(() => {
    Q8();
    Mu7 = [uU5, fA6], dH8 = [fA6, dC, "user:sessions:claude_code", "user:mcp_servers", "user:file_upload"], AY1 = Array.from(new Set([...Mu7, ...dH8])), Ju7 = {
        BASE_API_URL: "https://api.anthropic.com",
        CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
        CLAUDE_AI_AUTHORIZE_URL: "https://claude.com/cai/oauth/authorize",
        CLAUDE_AI_ORIGIN: "https://claude.ai",
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
    };
    pU5 = ["https://beacon.claude-ai.staging.ant.dev", "https://claude.fedstart.com", "https://claude-staging.fedstart.com"]
})
// @from(Ln 42131, Col 0)
function UU5() {
    let q = new Map;
    for (let [K, _] of Object.entries(lj)) {
        for (let [z, Y] of Object.entries(_)) lj[z] = {
            open: `\x1B[${Y[0]}m`,
            close: `\x1B[${Y[1]}m`
        }, _[z] = lj[z], q.set(Y[0], Y[1]);
        Object.defineProperty(lj, K, {
            value: _,
            enumerable: !1
        })
    }
    return Object.defineProperty(lj, "codes", {
        value: q,
        enumerable: !1
    }), lj.color.close = "\x1B[39m", lj.bgColor.close = "\x1B[49m", lj.color.ansi = Pu7(), lj.color.ansi256 = Wu7(), lj.color.ansi16m = Du7(), lj.bgColor.ansi = Pu7(10), lj.bgColor.ansi256 = Wu7(10), lj.bgColor.ansi16m = Du7(10), Object.defineProperties(lj, {
        rgbToAnsi256: {
            value(K, _, z) {
                if (K === _ && _ === z) {
                    if (K < 8) return 16;
                    if (K > 248) return 231;
                    return Math.round((K - 8) / 247 * 24) + 232
                }
                return 16 + 36 * Math.round(K / 255 * 5) + 6 * Math.round(_ / 255 * 5) + Math.round(z / 255 * 5)
            },
            enumerable: !1
        },
        hexToRgb: {
            value(K) {
                let _ = /[a-f\d]{6}|[a-f\d]{3}/i.exec(K.toString(16));
                if (!_) return [0, 0, 0];
                let [z] = _;
                if (z.length === 3) z = [...z].map((A) => A + A).join("");
                let Y = Number.parseInt(z, 16);
                return [Y >> 16 & 255, Y >> 8 & 255, Y & 255]
            },
            enumerable: !1
        },
        hexToAnsi256: {
            value: (K) => lj.rgbToAnsi256(...lj.hexToRgb(K)),
            enumerable: !1
        },
        ansi256ToAnsi: {
            value(K) {
                if (K < 8) return 30 + K;
                if (K < 16) return 90 + (K - 8);
                let _, z, Y;
                if (K >= 232) _ = ((K - 232) * 10 + 8) / 255, z = _, Y = _;
                else {
                    K -= 16;
                    let w = K % 36;
                    _ = Math.floor(K / 36) / 5, z = Math.floor(w / 6) / 5, Y = w % 6 / 5
                }
                let A = Math.max(_, z, Y) * 2;
                if (A === 0) return 30;
                let O = 30 + (Math.round(Y) << 2 | Math.round(z) << 1 | Math.round(_));
                if (A === 2) O += 60;
                return O
            },
            enumerable: !1
        },
        rgbToAnsi: {
            value: (K, _, z) => lj.ansi256ToAnsi(lj.rgbToAnsi256(K, _, z)),
            enumerable: !1
        },
        hexToAnsi: {
            value: (K) => lj.ansi256ToAnsi(lj.hexToAnsi256(K)),
            enumerable: !1
        }
    }), lj
}
// @from(Ln 42202, Col 4)
Pu7 = (q = 0) => (K) => `\x1B[${K+q}m`
// @from(Ln 42203, Col 4)
Wu7 = (q = 0) => (K) => `\x1B[${38+q};5;${K}m`
// @from(Ln 42204, Col 4)
Du7 = (q = 0) => (K, _, z) => `\x1B[${38+q};2;${K};${_};${z}m`
// @from(Ln 42205, Col 4)
lj
// @from(Ln 42205, Col 8)
ieA
// @from(Ln 42205, Col 13)
FU5
// @from(Ln 42205, Col 18)
gU5
// @from(Ln 42205, Col 23)
reA
// @from(Ln 42205, Col 28)
QU5
// @from(Ln 42205, Col 33)
Em
// @from(Ln 42206, Col 4)
Zu7 = L(() => {
    lj = {
        modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            gray: [90, 39],
            grey: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgGray: [100, 49],
            bgGrey: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
        }
    }, ieA = Object.keys(lj.modifier), FU5 = Object.keys(lj.color), gU5 = Object.keys(lj.bgColor), reA = [...FU5, ...gU5];
    QU5 = UU5(), Em = QU5
})
// @from(Ln 42266, Col 0)
function cC(q, K = globalThis.Deno ? globalThis.Deno.args : wY1.argv) {
    let _ = q.startsWith("-") ? "" : q.length === 1 ? "-" : "--",
        z = K.indexOf(_ + q),
        Y = K.indexOf("--");
    return z !== -1 && (Y === -1 || z < Y)
}
// @from(Ln 42273, Col 0)
function cU5() {
    if ("FORCE_COLOR" in nj) {
        if (nj.FORCE_COLOR === "true") return 1;
        if (nj.FORCE_COLOR === "false") return 0;
        return nj.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(nj.FORCE_COLOR, 10), 3)
    }
}
// @from(Ln 42281, Col 0)
function lU5(q) {
    if (q === 0) return !1;
    return {
        level: q,
        hasBasic: !0,
        has256: q >= 2,
        has16m: q >= 3
    }
}
// @from(Ln 42291, Col 0)
function nU5(q, {
    streamIsTTY: K,
    sniffFlags: _ = !0
} = {}) {
    let z = cU5();
    if (z !== void 0) cH8 = z;
    let Y = _ ? cH8 : z;
    if (Y === 0) return 0;
    if (_) {
        if (cC("color=16m") || cC("color=full") || cC("color=truecolor")) return 3;
        if (cC("color=256")) return 2
    }
    if ("TF_BUILD" in nj && "AGENT_NAME" in nj) return 1;
    if (q && !K && Y === void 0) return 0;
    let A = Y || 0;
    if (nj.TERM === "dumb") return A;
    if (wY1.platform === "win32") {
        let O = dU5.release().split(".");
        if (Number(O[0]) >= 10 && Number(O[2]) >= 10586) return Number(O[2]) >= 14931 ? 3 : 2;
        return 1
    }
    if ("CI" in nj) {
        if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((O) => (O in nj))) return 3;
        if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((O) => (O in nj)) || nj.CI_NAME === "codeship") return 1;
        return A
    }
    if ("TEAMCITY_VERSION" in nj) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(nj.TEAMCITY_VERSION) ? 1 : 0;
    if (nj.COLORTERM === "truecolor") return 3;
    if (nj.TERM === "xterm-kitty") return 3;
    if (nj.TERM === "xterm-ghostty") return 3;
    if (nj.TERM === "wezterm") return 3;
    if ("TERM_PROGRAM" in nj) {
        let O = Number.parseInt((nj.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (nj.TERM_PROGRAM) {
            case "iTerm.app":
                return O >= 3 ? 3 : 2;
            case "Apple_Terminal":
                return 2
        }
    }
    if (/-256(color)?$/i.test(nj.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(nj.TERM)) return 1;
    if ("COLORTERM" in nj) return 1;
    return A
}
// @from(Ln 42337, Col 0)
function Gu7(q, K = {}) {
    let _ = nU5(q, {
        streamIsTTY: q && q.isTTY,
        ...K
    });
    return lU5(_)
}
// @from(Ln 42344, Col 4)
nj
// @from(Ln 42344, Col 8)
cH8
// @from(Ln 42344, Col 13)
iU5
// @from(Ln 42344, Col 18)
vu7
// @from(Ln 42345, Col 4)
Tu7 = L(() => {
    ({
        env: nj
    } = wY1);
    if (cC("no-color") || cC("no-colors") || cC("color=false") || cC("color=never")) cH8 = 0;
    else if (cC("color") || cC("colors") || cC("color=true") || cC("color=always")) cH8 = 1;
    iU5 = {
        stdout: Gu7({
            isTTY: fu7.isatty(1)
        }),
        stderr: Gu7({
            isTTY: fu7.isatty(2)
        })
    }, vu7 = iU5
})
// @from(Ln 42361, Col 0)
function Vu7(q, K, _) {
    let z = q.indexOf(K);
    if (z === -1) return q;
    let Y = K.length,
        A = 0,
        O = "";
    do O += q.slice(A, z) + K + _, A = z + Y, z = q.indexOf(K, A); while (z !== -1);
    return O += q.slice(A), O
}
// @from(Ln 42371, Col 0)
function ku7(q, K, _, z) {
    let Y = 0,
        A = "";
    do {
        let O = q[z - 1] === "\r";
        A += q.slice(Y, O ? z - 1 : z) + K + (O ? `\r
` : `
`) + _, Y = z + 1, z = q.indexOf(`
`, Y)
    } while (z !== -1);
    return A += q.slice(Y), A
}
// @from(Ln 42383, Col 0)
class JY1 {
    constructor(q) {
        return Lu7(q)
    }
}
// @from(Ln 42389, Col 0)
function cU6(q) {
    return Lu7(q)
}
// @from(Ln 42392, Col 4)
Nu7
// @from(Ln 42392, Col 9)
Eu7
// @from(Ln 42392, Col 14)
$Y1
// @from(Ln 42392, Col 19)
Gf6
// @from(Ln 42392, Col 24)
dU6
// @from(Ln 42392, Col 29)
yu7
// @from(Ln 42392, Col 34)
vf6
// @from(Ln 42392, Col 39)
rU5 = (q, K = {}) => {
        if (K.level && !(Number.isInteger(K.level) && K.level >= 0 && K.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
        let _ = Nu7 ? Nu7.level : 0;
        q.level = K.level === void 0 ? _ : K.level
    }
// @from(Ln 42397, Col 4)
Lu7 = (q) => {
        let K = (..._) => _.join(" ");
        return rU5(K, q), Object.setPrototypeOf(K, cU6.prototype), K
    }
// @from(Ln 42401, Col 4)
jY1 = (q, K, _, ...z) => {
        if (q === "rgb") {
            if (K === "ansi16m") return Em[_].ansi16m(...z);
            if (K === "ansi256") return Em[_].ansi256(Em.rgbToAnsi256(...z));
            return Em[_].ansi(Em.rgbToAnsi(...z))
        }
        if (q === "hex") return jY1("rgb", K, _, ...Em.hexToRgb(...z));
        return Em[_][q](...z)
    }
// @from(Ln 42410, Col 4)
oU5
// @from(Ln 42410, Col 9)
aU5
// @from(Ln 42410, Col 14)
HY1 = (q, K, _) => {
        let z, Y;
        if (_ === void 0) z = q, Y = K;
        else z = _.openAll + q, Y = K + _.closeAll;
        return {
            open: q,
            close: K,
            openAll: z,
            closeAll: Y,
            parent: _
        }
    }
// @from(Ln 42422, Col 4)
lH8 = (q, K, _) => {
        let z = (...Y) => sU5(z, Y.length === 1 ? "" + Y[0] : Y.join(" "));
        return Object.setPrototypeOf(z, aU5), z[$Y1] = q, z[Gf6] = K, z[dU6] = _, z
    }
// @from(Ln 42426, Col 4)
sU5 = (q, K) => {
        if (q.level <= 0 || !K) return q[dU6] ? "" : K;
        let _ = q[Gf6];
        if (_ === void 0) return K;
        let {
            openAll: z,
            closeAll: Y
        } = _;
        if (K.includes("\x1B"))
            while (_ !== void 0) K = Vu7(K, _.close, _.open), _ = _.parent;
        let A = K.indexOf(`
`);
        if (A !== -1) K = ku7(K, Y, z, A);
        return z + K + Y
    }
// @from(Ln 42441, Col 4)
tU5
// @from(Ln 42441, Col 9)
Y6O
// @from(Ln 42441, Col 14)
Y8
// @from(Ln 42442, Col 4)
Y3 = L(() => {
    Zu7();
    Tu7();
    ({
        stdout: Nu7,
        stderr: Eu7
    } = vu7), $Y1 = Symbol("GENERATOR"), Gf6 = Symbol("STYLER"), dU6 = Symbol("IS_EMPTY"), yu7 = ["ansi", "ansi", "ansi256", "ansi16m"], vf6 = Object.create(null);
    Object.setPrototypeOf(cU6.prototype, Function.prototype);
    for (let [q, K] of Object.entries(Em)) vf6[q] = {
        get() {
            let _ = lH8(this, HY1(K.open, K.close, this[Gf6]), this[dU6]);
            return Object.defineProperty(this, q, {
                value: _
            }), _
        }
    };
    vf6.visible = {
        get() {
            let q = lH8(this, this[Gf6], !0);
            return Object.defineProperty(this, "visible", {
                value: q
            }), q
        }
    };
    oU5 = ["rgb", "hex", "ansi256"];
    for (let q of oU5) {
        vf6[q] = {
            get() {
                let {
                    level: _
                } = this;
                return function(...z) {
                    let Y = HY1(jY1(q, yu7[_], "color", ...z), Em.color.close, this[Gf6]);
                    return lH8(this, Y, this[dU6])
                }
            }
        };
        let K = "bg" + q[0].toUpperCase() + q.slice(1);
        vf6[K] = {
            get() {
                let {
                    level: _
                } = this;
                return function(...z) {
                    let Y = HY1(jY1(q, yu7[_], "bgColor", ...z), Em.bgColor.close, this[Gf6]);
                    return lH8(this, Y, this[dU6])
                }
            }
        }
    }
    aU5 = Object.defineProperties(() => {}, {
        ...vf6,
        level: {
            enumerable: !0,
            get() {
                return this[$Y1].level
            },
            set(q) {
                this[$Y1].level = q
            }
        }
    });
    Object.defineProperties(cU6.prototype, vf6);
    tU5 = cU6(), Y6O = cU6({
        level: Eu7 ? Eu7.level : 0
    }), Y8 = tU5
})
// @from(Ln 42509, Col 4)
TV = "command-name"
// @from(Ln 42510, Col 4)
LW = "command-message"
// @from(Ln 42511, Col 4)
nH8 = "command-args"
// @from(Ln 42512, Col 4)
hu7 = "bash-input"
// @from(Ln 42513, Col 4)
Ru7 = "bash-stdout"
// @from(Ln 42514, Col 4)
Su7 = "bash-stderr"
// @from(Ln 42515, Col 4)
l0 = "local-command-stdout"
// @from(Ln 42516, Col 4)
GA6 = "local-command-stderr"
// @from(Ln 42517, Col 4)
lU6 = "local-command-caveat"
// @from(Ln 42518, Col 4)
Cu7
// @from(Ln 42518, Col 9)
T16 = "tick"
// @from(Ln 42519, Col 4)
TA = "task-notification"
// @from(Ln 42520, Col 4)
hW = "task-id"
// @from(Ln 42521, Col 4)
lC = "tool-use-id"
// @from(Ln 42522, Col 4)
V16 = "task-type"
// @from(Ln 42523, Col 4)
nC = "output-file"
// @from(Ln 42524, Col 4)
rX = "status"
// @from(Ln 42525, Col 4)
Mw = "summary"
// @from(Ln 42526, Col 4)
XY1 = "worktree"
// @from(Ln 42527, Col 4)
MY1 = "worktreePath"
// @from(Ln 42528, Col 4)
PY1 = "worktreeBranch"
// @from(Ln 42529, Col 4)
vA6 = "remote-review"
// @from(Ln 42530, Col 4)
WY1 = "remote-review-progress"
// @from(Ln 42531, Col 4)
oX = "teammate-message"
// @from(Ln 42532, Col 4)
Tf6 = "channel"
// @from(Ln 42533, Col 4)
iH8 = "fork-boilerplate"
// @from(Ln 42534, Col 4)
bu7 = "Your directive: "
// @from(Ln 42535, Col 4)
Iu7
// @from(Ln 42535, Col 9)
xu7
// @from(Ln 42536, Col 4)
rA = L(() => {
    Cu7 = ["bash-input", "bash-stdout", "bash-stderr", "local-command-stdout", "local-command-stderr", "local-command-caveat"], Iu7 = ["help", "-h", "--help"], xu7 = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"]
})
// @from(Ln 42540, Col 0)
function Vf6(q) {
    return q.sort((K, _) => {
        let z = _.modified.getTime() - K.modified.getTime();
        if (z !== 0) return z;
        return _.created.getTime() - K.created.getTime()
    })
}
// @from(Ln 42551, Col 0)
function fY1(q, {
    suffix: K = "nodejs"
} = {}) {
    if (typeof q !== "string") throw TypeError(`Expected a string, got ${typeof q}`);
    if (K) q += `-${K}`;
    if (DY1.platform === "darwin") return eU5(q);
    if (DY1.platform === "win32") return qQ5(q);
    return KQ5(q)
}
// @from(Ln 42560, Col 4)
k16
// @from(Ln 42560, Col 9)
ZY1
// @from(Ln 42560, Col 14)
kf6
// @from(Ln 42560, Col 19)
eU5 = (q) => {
        let K = tH.join(k16, "Library");
        return {
            data: tH.join(K, "Application Support", q),
            config: tH.join(K, "Preferences", q),
            cache: tH.join(K, "Caches", q),
            log: tH.join(K, "Logs", q),
            temp: tH.join(ZY1, q)
        }
    }
// @from(Ln 42570, Col 4)
qQ5 = (q) => {
        let K = kf6.APPDATA || tH.join(k16, "AppData", "Roaming"),
            _ = kf6.LOCALAPPDATA || tH.join(k16, "AppData", "Local");
        return {
            data: tH.join(_, q, "Data"),
            config: tH.join(K, q, "Config"),
            cache: tH.join(_, q, "Cache"),
            log: tH.join(_, q, "Log"),
            temp: tH.join(ZY1, q)
        }
    }
// @from(Ln 42581, Col 4)
KQ5 = (q) => {
        let K = tH.basename(k16);
        return {
            data: tH.join(kf6.XDG_DATA_HOME || tH.join(k16, ".local", "share"), q),
            config: tH.join(kf6.XDG_CONFIG_HOME || tH.join(k16, ".config"), q),
            cache: tH.join(kf6.XDG_CACHE_HOME || tH.join(k16, ".cache"), q),
            log: tH.join(kf6.XDG_STATE_HOME || tH.join(k16, ".local", "state"), q),
            temp: tH.join(ZY1, K, q)
        }
    }
// @from(Ln 42591, Col 4)
mu7 = L(() => {
    k16 = uu7.homedir(), ZY1 = uu7.tmpdir(), {
        env: kf6
    } = DY1
})
// @from(Ln 42597, Col 0)
function N16(q) {
    let K = 0;
    for (let _ = 0; _ < q.length; _++) K = (K << 5) - K + q.charCodeAt(_) | 0;
    return K
}
// @from(Ln 42603, Col 0)
function nU6(q) {
    if (typeof Bun < "u") return Bun.hash(q).toString();
    return d6("crypto").createHash("sha256").update(q).digest("hex")
}
// @from(Ln 42608, Col 0)
function Bu7(q, K) {
    if (typeof Bun < "u") return Bun.hash(K, Bun.hash(q)).toString();
    return d6("crypto").createHash("sha256").update(q).update("\x00").update(K).digest("hex")
}
// @from(Ln 42616, Col 0)
function Fu7(q) {
    let K = q.replace(/[^a-zA-Z0-9]/g, "-");
    if (K.length <= pu7) return K;
    return `${K.slice(0,pu7)}-${Math.abs(N16(q)).toString(36)}`
}
// @from(Ln 42622, Col 0)
function aH8(q) {
    return Fu7(q)
}
// @from(Ln 42625, Col 4)
oH8
// @from(Ln 42625, Col 9)
pu7 = 200
// @from(Ln 42626, Col 4)
TA6
// @from(Ln 42627, Col 4)
sH8 = L(() => {
    mu7();
    Yq();
    oH8 = fY1("claude-cli");
    TA6 = {
        baseLogs: () => rH8(oH8.cache, aH8(V8().cwd())),
        errors: () => rH8(oH8.cache, aH8(V8().cwd()), "errors"),
        messages: () => rH8(oH8.cache, aH8(V8().cwd()), "messages"),
        mcpLogs: (q) => rH8(oH8.cache, aH8(V8().cwd()), `mcp-logs-${Fu7(q)}`)
    }
})
// @from(Ln 42639, Col 0)
function tH8(q) {
    return q.replace(gu7, "").trim() || q
}
// @from(Ln 42643, Col 0)
function Nf6(q) {
    return q.replace(gu7, "").trim()
}
// @from(Ln 42647, Col 0)
function Uu7(q) {
    return q.replace(_Q5, "").trim()
}
// @from(Ln 42650, Col 4)
gu7
// @from(Ln 42650, Col 9)
_Q5
// @from(Ln 42651, Col 4)
Ef6 = L(() => {
    gu7 = /<([a-z][\w-]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>\n?/g;
    _Q5 = /<(ide_opened_file|ide_selection)(?:\s[^>]*)?>[\s\S]*?<\/\1>\n?/g
})
// @from(Ln 42656, Col 0)
function Qu7() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return "essential-traffic";
    if (process.env.DISABLE_TELEMETRY) return "no-telemetry";
    if (S6(process.env.DO_NOT_TRACK)) return "no-telemetry";
    return "default"
}
// @from(Ln 42663, Col 0)
function o3() {
    return Qu7() === "essential-traffic"
}
// @from(Ln 42667, Col 0)
function GY1() {
    return Qu7() !== "default"
}
// @from(Ln 42671, Col 0)
function du7() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC";
    return null
}
// @from(Ln 42675, Col 4)
G$ = L(() => {
    Q8()
})
// @from(Ln 42679, Col 0)
function E16(q) {
    return q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
// @from(Ln 42683, Col 0)
function zv(q) {
    return q.charAt(0).toUpperCase() + q.slice(1)
}
// @from(Ln 42687, Col 0)
function O7(q, K, _ = K + "s") {
    return q === 1 ? K : _
}
// @from(Ln 42691, Col 0)
function i5(q, K) {
    let _ = q.indexOf(K);
    return _ === -1 ? q : q.slice(0, _)
}
// @from(Ln 42696, Col 0)
function oY(q) {
    return i5(q, `
`)
}
// @from(Ln 42701, Col 0)
function tz(q, K, _ = 0) {
    let z = 0,
        Y = q.indexOf(K, _);
    while (Y !== -1) z++, Y = q.indexOf(K, Y + 1);
    return z
}
// @from(Ln 42708, Col 0)
function eH8(q) {
    return q.replace(/[０-９]/g, (K) => String.fromCharCode(K.charCodeAt(0) - 65248))
}
// @from(Ln 42712, Col 0)
function VA6(q) {
    return q.replaceAll("　", " ")
}
// @from(Ln 42716, Col 0)
function qJ8(q, K = ",", _ = cu7) {
    let Y = "";
    for (let A of q) {
        let O = Y ? K : "",
            w = O + A;
        if (Y.length + w.length <= _) Y += w;
        else {
            let $ = _ - Y.length - O.length - 14;
            if ($ > 0) Y += O + A.slice(0, $) + "...[truncated]";
            else Y += "...[truncated]";
            return Y
        }
    }
    return Y
}
// @from(Ln 42731, Col 0)
class iU6 {
    maxSize;
    content = "";
    isTruncated = !1;
    totalBytesReceived = 0;
    constructor(q = cu7) {
        this.maxSize = q
    }
    append(q) {
        let K = typeof q === "string" ? q : q.toString();
        if (this.totalBytesReceived += K.length, this.isTruncated && this.content.length >= this.maxSize) return;
        if (this.content.length + K.length > this.maxSize) {
            let _ = this.maxSize - this.content.length;
            if (_ > 0) this.content += K.slice(0, _);
            this.isTruncated = !0
        } else this.content += K
    }
    toString() {
        if (!this.isTruncated) return this.content;
        let q = this.totalBytesReceived - this.maxSize,
            K = Math.round(q / 1024);
        return this.content + `
... [output truncated - ${K}KB removed]`
    }
    clear() {
        this.content = "", this.isTruncated = !1, this.totalBytesReceived = 0
    }
    get length() {
        return this.content.length
    }
    get truncated() {
        return this.isTruncated
    }
    get totalBytes() {
        return this.totalBytesReceived
    }
}
// @from(Ln 42769, Col 0)
function KJ8(q, K) {
    let _ = q.split(`
`);
    if (_.length <= K) return q;
    return _.slice(0, K).join(`
`) + "…"
}
// @from(Ln 42776, Col 4)
cu7 = 33554432
// @from(Ln 42778, Col 0)
function kA6(q, K) {
    let _ = q.firstPrompt?.startsWith(`<${T16}>`),
        z = q.firstPrompt ? Nf6(q.firstPrompt) : "",
        Y = z && !_,
        A = q.agentName || q.customTitle || q.summary || (Y ? z : void 0) || K || (_ ? "Autonomous session" : void 0) || (q.sessionId ? q.sessionId.slice(0, 8) : "") || "";
    return tH8(A).trim()
}
// @from(Ln 42786, Col 0)
function lu7(q) {
    return q.toISOString().replace(/[:.]/g, "-")
}
// @from(Ln 42790, Col 0)
function YQ5(q) {
    if (_J8.length >= zQ5) _J8.shift();
    _J8.push(q)
}
// @from(Ln 42795, Col 0)
function nu7(q) {
    if (ym !== null) return;
    if (ym = q, yf6.length > 0) {
        let K = [...yf6];
        yf6.length = 0;
        for (let _ of K) switch (_.type) {
            case "error":
                ym.logError(_.error);
                break;
            case "mcpError":
                ym.logMCPError(_.serverName, _.error);
                break;
            case "mcpDebug":
                ym.logMCPDebug(_.serverName, _.message);
                break
        }
    }
}
// @from(Ln 42814, Col 0)
function j6(q) {
    let K = r1(q);
    try {
        if (S6(process.env.CLAUDE_CODE_USE_BEDROCK) || S6(process.env.CLAUDE_CODE_USE_VERTEX) || S6(process.env.CLAUDE_CODE_USE_FOUNDRY) || S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) || S6(process.env.CLAUDE_CODE_USE_MANTLE) || process.env.DISABLE_ERROR_REPORTING || o3()) return;
        let z = {
            error: K.stack || K.message,
            timestamp: new Date().toISOString()
        };
        if (YQ5(z), ym === null) {
            yf6.push({
                type: "error",
                error: K
            });
            return
        }
        ym.logError(K)
    } catch {}
}
// @from(Ln 42833, Col 0)
function NA6() {
    return [..._J8]
}
// @from(Ln 42837, Col 0)
function yz(q, K) {
    try {
        if (ym === null) {
            yf6.push({
                type: "mcpError",
                serverName: q,
                error: K
            });
            return
        }
        ym.logMCPError(q, K)
    } catch {}
}
// @from(Ln 42851, Col 0)
function i8(q, K) {
    try {
        if (ym === null) {
            yf6.push({
                type: "mcpDebug",
                serverName: q,
                message: K
            });
            return
        }
        ym.logMCPDebug(q, K)
    } catch {}
}
// @from(Ln 42865, Col 0)
function zJ8(q, K) {
    if (!K || !K.startsWith("repl_main_thread")) return;
    let {
        messages: _,
        ...z
    } = q;
    T81(z), k81(null)
}
// @from(Ln 42873, Col 4)
zQ5 = 100
// @from(Ln 42874, Col 4)
_J8
// @from(Ln 42874, Col 9)
yf6
// @from(Ln 42874, Col 14)
ym = null
// @from(Ln 42875, Col 4)
x6O
// @from(Ln 42876, Col 4)
U8 = L(() => {
    U4();
    y8();
    rA();
    sH8();
    Ef6();
    Q8();
    m8();
    G$();
    e8();
    _J8 = [];
    yf6 = [];
    x6O = P1(() => {
        return process.argv.includes("--hard-fail")
    })
})
// @from(Ln 42893, Col 0)
function y16(q) {
    let K = [],
        _ = !1;
    async function z() {
        if (_) return;
        if (K.length === 0) return;
        _ = !0;
        while (K.length > 0) {
            let {
                args: Y,
                resolve: A,
                reject: O,
                context: w
            } = K.shift();
            try {
                let $ = await q.apply(w, Y);
                A($)
            } catch ($) {
                O($)
            }
        }
        if (_ = !1, K.length > 0) z()
    }
    return function(...Y) {
        return new Promise((A, O) => {
            K.push({
                args: Y,
                resolve: A,
                reject: O,
                context: this
            }), z()
        })
    }
}
// @from(Ln 42928, Col 0)
function AQ5(q, K, _) {
    if (_ !== void 0 && !ug(q[K], _) || _ === void 0 && !(K in q)) F86(q, K, _)
}
// @from(Ln 42931, Col 4)
rU6
// @from(Ln 42932, Col 4)
vY1 = L(() => {
    tp6();
    t06();
    rU6 = AQ5
})
// @from(Ln 42938, Col 0)
function OQ5(q) {
    return TW(q) && gg(q)
}
// @from(Ln 42941, Col 4)
iu7
// @from(Ln 42942, Col 4)
ru7 = L(() => {
    XD6();
    Bg();
    iu7 = OQ5
})
// @from(Ln 42948, Col 0)
function XQ5(q) {
    if (!TW(q) || QL(q) != wQ5) return !1;
    var K = oD6(q);
    if (K === null) return !0;
    var _ = HQ5.call(K, "constructor") && K.constructor;
    return typeof _ == "function" && _ instanceof _ && ou7.call(_) == JQ5
}
// @from(Ln 42955, Col 4)
wQ5 = "[object Object]"
// @from(Ln 42956, Col 4)
$Q5
// @from(Ln 42956, Col 9)
jQ5
// @from(Ln 42956, Col 14)
ou7
// @from(Ln 42956, Col 19)
HQ5
// @from(Ln 42956, Col 24)
JQ5
// @from(Ln 42956, Col 29)
Lf6
// @from(Ln 42957, Col 4)
YJ8 = L(() => {
    YY6();
    gw8();
    Bg();
    $Q5 = Function.prototype, jQ5 = Object.prototype, ou7 = $Q5.toString, HQ5 = jQ5.hasOwnProperty, JQ5 = ou7.call(Object);
    Lf6 = XQ5
})
// @from(Ln 42965, Col 0)
function MQ5(q, K) {
    if (K === "constructor" && typeof q[K] === "function") return;
    if (K == "__proto__") return;
    return q[K]
}
// @from(Ln 42970, Col 4)
oU6
// @from(Ln 42971, Col 4)
TY1 = L(() => {
    oU6 = MQ5
})
// @from(Ln 42975, Col 0)
function PQ5(q) {
    return hC(q, og(q))
}
// @from(Ln 42978, Col 4)
au7
// @from(Ln 42979, Col 4)
su7 = L(() => {
    EY6();
    rD6();
    au7 = PQ5
})
// @from(Ln 42985, Col 0)
function WQ5(q, K, _, z, Y, A, O) {
    var w = oU6(q, _),
        $ = oU6(K, _),
        j = O.get($);
    if (j) {
        rU6(q, _, j);
        return
    }
    var H = A ? A(w, $, _ + "", q, K, O) : void 0,
        J = H === void 0;
    if (J) {
        var X = uO($),
            M = !X && pg($),
            P = !X && !M && HD6($);
        if (H = $, X || M || P)
            if (uO(w)) H = w;
            else if (iu7(w)) H = Fw8(w);
        else if (M) J = !1, H = qF6($, !0);
        else if (P) J = !1, H = cw8($, !0);
        else H = [];
        else if (Lf6($) || Ei($)) {
            if (H = w, Ei(w)) H = au7(w);
            else if (!xO(w) || qD6(w)) H = lw8($)
        } else J = !1
    }
    if (J) O.set($, H), Y(H, $, z, A, O), O.delete($);
    rU6(q, _, H)
}
// @from(Ln 43013, Col 4)
tu7
// @from(Ln 43014, Col 4)
eu7 = L(() => {
    vY1();
    A71();
    $71();
    O71();
    j71();
    LB6();
    YV();
    ru7();
    hB6();
    oA8();
    zV();
    YJ8();
    DO8();
    TY1();
    su7();
    tu7 = WQ5
})
// @from(Ln 43033, Col 0)
function qm7(q, K, _, z, Y) {
    if (q === K) return;
    UH8(K, function(A, O) {
        if (Y || (Y = new mg), xO(A)) tu7(q, K, O, _, qm7, z, Y);
        else {
            var w = z ? z(oU6(q, O), A, O + "", q, K, Y) : void 0;
            if (w === void 0) w = A;
            rU6(q, O, w)
        }
    }, og)
}
// @from(Ln 43044, Col 4)
Km7
// @from(Ln 43045, Col 4)
_m7 = L(() => {
    yB6();
    vY1();
    _Y1();
    eu7();
    zV();
    rD6();
    TY1();
    Km7 = qm7
})
// @from(Ln 43056, Col 0)
function DQ5(q, K, _) {
    switch (_.length) {
        case 0:
            return q.call(K);
        case 1:
            return q.call(K, _[0]);
        case 2:
            return q.call(K, _[0], _[1]);
        case 3:
            return q.call(K, _[0], _[1], _[2])
    }
    return q.apply(K, _)
}
// @from(Ln 43069, Col 4)
zm7
// @from(Ln 43070, Col 4)
Ym7 = L(() => {
    zm7 = DQ5
})
// @from(Ln 43074, Col 0)
function ZQ5(q, K, _) {
    return K = Am7(K === void 0 ? q.length - 1 : K, 0),
        function() {
            var z = arguments,
                Y = -1,
                A = Am7(z.length - K, 0),
                O = Array(A);
            while (++Y < A) O[Y] = z[K + Y];
            Y = -1;
            var w = Array(K + 1);
            while (++Y < K) w[Y] = z[Y];
            return w[K] = _(O), zm7(q, this, w)
        }
}
// @from(Ln 43088, Col 4)
Am7
// @from(Ln 43088, Col 9)
AJ8
// @from(Ln 43089, Col 4)
VY1 = L(() => {
    Ym7();
    Am7 = Math.max;
    AJ8 = ZQ5
})
// @from(Ln 43095, Col 0)
function fQ5(q) {
    return function() {
        return q
    }
}
// @from(Ln 43100, Col 4)
Om7
// @from(Ln 43101, Col 4)
wm7 = L(() => {
    Om7 = fQ5
})
// @from(Ln 43104, Col 4)
GQ5
// @from(Ln 43104, Col 9)
$m7
// @from(Ln 43105, Col 4)
jm7 = L(() => {
    wm7();
    Y71();
    RO8();
    GQ5 = !iD6 ? DD6 : function(q, K) {
        return iD6(q, "toString", {
            configurable: !0,
            enumerable: !1,
            value: Om7(K),
            writable: !0
        })
    }, $m7 = GQ5
})
// @from(Ln 43119, Col 0)
function kQ5(q) {
    var K = 0,
        _ = 0;
    return function() {
        var z = VQ5(),
            Y = TQ5 - (z - _);
        if (_ = z, Y > 0) {
            if (++K >= vQ5) return arguments[0]
        } else K = 0;
        return q.apply(void 0, arguments)
    }
}
// @from(Ln 43131, Col 4)
vQ5 = 800
// @from(Ln 43132, Col 4)
TQ5 = 16
// @from(Ln 43133, Col 4)
VQ5
// @from(Ln 43133, Col 9)
Hm7
// @from(Ln 43134, Col 4)
Jm7 = L(() => {
    VQ5 = Date.now;
    Hm7 = kQ5
})
// @from(Ln 43138, Col 4)
NQ5
// @from(Ln 43138, Col 9)
OJ8
// @from(Ln 43139, Col 4)
kY1 = L(() => {
    jm7();
    Jm7();
    NQ5 = Hm7($m7), OJ8 = NQ5
})
// @from(Ln 43145, Col 0)
function EQ5(q, K) {
    return OJ8(AJ8(q, K, DD6), q + "")
}
// @from(Ln 43148, Col 4)
Xm7
// @from(Ln 43149, Col 4)
Mm7 = L(() => {
    RO8();
    VY1();
    kY1();
    Xm7 = EQ5
})
// @from(Ln 43156, Col 0)
function yQ5(q, K, _) {
    if (!xO(_)) return !1;
    var z = typeof K;
    if (z == "number" ? gg(_) && G86(K, _.length) : z == "string" && (K in _)) return ug(_[K], q);
    return !1
}
// @from(Ln 43162, Col 4)
Pm7
// @from(Ln 43163, Col 4)
Wm7 = L(() => {
    t06();
    XD6();
    RB6();
    zV();
    Pm7 = yQ5
})
// @from(Ln 43171, Col 0)
function LQ5(q) {
    return Xm7(function(K, _) {
        var z = -1,
            Y = _.length,
            A = Y > 1 ? _[Y - 1] : void 0,
            O = Y > 2 ? _[2] : void 0;
        if (A = q.length > 3 && typeof A == "function" ? (Y--, A) : void 0, O && Pm7(_[0], _[1], O)) A = Y < 3 ? void 0 : A, Y = 1;
        K = Object(K);
        while (++z < Y) {
            var w = _[z];
            if (w) q(K, w, z, A)
        }
        return K
    })
}
// @from(Ln 43186, Col 4)
Dm7
// @from(Ln 43187, Col 4)
Zm7 = L(() => {
    Mm7();
    Wm7();
    Dm7 = LQ5
})
// @from(Ln 43192, Col 4)
hQ5
// @from(Ln 43192, Col 9)
Zr
// @from(Ln 43193, Col 4)
fm7 = L(() => {
    _m7();
    Zm7();
    hQ5 = Dm7(function(q, K, _, z) {
        Km7(q, K, _, z)
    }), Zr = hQ5
})
// @from(Ln 43201, Col 0)
function aU6(q) {
    let {
        buffer: K,
        bytesRead: _
    } = V8().readSync(q, {
        length: 4096
    });
    if (_ === 0) return "utf8";
    if (_ >= 2) {
        if (K[0] === 255 && K[1] === 254) return "utf16le"
    }
    if (_ >= 3 && K[0] === 239 && K[1] === 187 && K[2] === 191) return "utf8";
    return "utf8"
}
// @from(Ln 43216, Col 0)
function NY1(q) {
    let K = 0,
        _ = 0;
    for (let z = 0; z < q.length; z++)
        if (q[z] === `
`)
            if (z > 0 && q[z - 1] === "\r") K++;
            else _++;
    return K > _ ? "CRLF" : "LF"
}
// @from(Ln 43227, Col 0)
function iC(q) {
    let K = V8(),
        {
            resolvedPath: _,
            isSymlink: z
        } = vA(K, q);
    if (z) E(`Reading through symlink: ${q} -> ${_}`);
    let Y = aU6(_),
        A = K.readFileSync(_, {
            encoding: Y
        }),
        O = NY1(A.slice(0, 4096));
    return {
        content: A.replaceAll(`\r
`, `
`),
        encoding: Y,
        lineEndings: O
    }
}
// @from(Ln 43248, Col 0)
function VV(q) {
    return iC(q).content
}
// @from(Ln 43251, Col 4)
nN = L(() => {
    K8();
    Yq()
})
// @from(Ln 43256, Col 0)
function XU(q) {
    return q.startsWith("\uFEFF") ? q.slice(1) : q
}
// @from(Ln 43263, Col 0)
function hf6(q) {
    sU6 = q
}
// @from(Ln 43267, Col 0)
function Gm7() {
    sU6 = null, EY1 = void 0
}
// @from(Ln 43271, Col 0)
function fr(q) {
    return EY1 = q, q
}
// @from(Ln 43275, Col 0)
function Gr() {
    return
}
// @from(Ln 43279, Col 0)
function tU6() {
    return Gr() ?? RQ5(A7(), SQ5)
}
// @from(Ln 43283, Col 0)
function CQ5() {
    try {
        let q = VV(tU6()),
            K = n8(XU(q));
        if (!K || typeof K !== "object" || Array.isArray(K)) return null;
        return K
    } catch {
        return null
    }
}
// @from(Ln 43294, Col 0)
function vr() {
    if (!Gr() && EY1 !== !0) return null;
    if (sU6) return sU6;
    let q = CQ5();
    if (q) return sU6 = q, u0(), q;
    return null
}
// @from(Ln 43301, Col 4)
SQ5 = "remote-settings.json"
// @from(Ln 43302, Col 4)
sU6 = null
// @from(Ln 43303, Col 4)
EY1
// @from(Ln 43304, Col 4)
wJ8 = L(() => {
    Q8();
    nN();
    Li();
    e8()
})
// @from(Ln 43311, Col 0)
function L16(q, K) {
    return q.flatMap((_, z) => z ? [K(z), _] : [_])
}
// @from(Ln 43315, Col 0)
function w7(q, K) {
    let _ = 0;
    for (let z of q) _ += +!!K(z);
    return _
}
// @from(Ln 43321, Col 0)
function F4(q) {
    return [...new Set(q)]
}
// @from(Ln 43328, Col 0)
function j1(q, K, _) {
    let z = IQ5();
    if (!z) return;
    let Y = {
            timestamp: new Date().toISOString(),
            level: q,
            event: K,
            data: _ ?? {}
        },
        A = V8(),
        O = I6(Y) + `
`;
    try {
        A.appendFileSync(z, O)
    } catch {
        try {
            A.mkdirSync(bQ5(z)), A.appendFileSync(z, O)
        } catch {}
    }
}
// @from(Ln 43349, Col 0)
function IQ5() {
    return process.env.CLAUDE_CODE_DIAGNOSTICS_FILE
}
// @from(Ln 43352, Col 0)
async function Rf6(q, K, _) {
    let z = Date.now();
    j1("info", `${q}_started`);
    try {
        let Y = await K(),
            A = _ ? _(Y) : {};
        return j1("info", `${q}_completed`, {
            duration_ms: Date.now() - z,
            ...A
        }), Y
    } catch (Y) {
        throw j1("error", `${q}_failed`, {
            duration_ms: Date.now() - z
        }), Y
    }
}
// @from(Ln 43368, Col 4)
VA = L(() => {
    Yq();
    e8()
})
// @from(Ln 43376, Col 0)
function uQ5(q, K) {
    return $J8.run({
        cwd: q.normalize("NFC")
    }, K)
}
// @from(Ln 43382, Col 0)
function eU6(q, K) {
    return uQ5(q ?? b8(), K)
}
// @from(Ln 43386, Col 0)
function Sf6() {
    return $J8.getStore() !== void 0
}
// @from(Ln 43390, Col 0)
function yY1(q) {
    let K = $J8.getStore();
    if (K) K.cwd = q.normalize("NFC");
    else E61(q)
}
// @from(Ln 43396, Col 0)
function jJ8() {
    return $J8.getStore()?.cwd ?? tu()
}
// @from(Ln 43400, Col 0)
function b8() {
    try {
        return jJ8()
    } catch {
        return Y7()
    }
}
// @from(Ln 43407, Col 4)
$J8
// @from(Ln 43408, Col 4)
n7 = L(() => {
    y8();
    $J8 = new xQ5
})
// @from(Ln 43419, Col 0)
async function km7(q) {
    let K = new Set;
    if (process.env.P4PORT) K.add("perforce");
    try {
        let _ = q ?? V8().cwd(),
            z = new Set(await mQ5(_));
        for (let [Y, A] of pQ5)
            if (z.has(Y)) K.add(A)
    } catch {}
    return [...K]
}
// @from(Ln 43430, Col 4)
LY1
// @from(Ln 43430, Col 9)
y1
// @from(Ln 43430, Col 13)
EA6
// @from(Ln 43430, Col 18)
Tm7
// @from(Ln 43430, Col 23)
pQ5
// @from(Ln 43430, Col 28)
Vm7
// @from(Ln 43431, Col 4)
NK = L(() => {
    U4();
    Yq();
    U8();
    LY1 = ["macos", "wsl"], y1 = P1(() => {
        try {
            if (process.platform === "darwin") return "macos";
            if (process.platform === "win32") return "windows";
            if (process.platform === "linux") {
                try {
                    let q = V8().readFileSync("/proc/version", {
                        encoding: "utf8"
                    });
                    if (q.toLowerCase().includes("microsoft") || q.toLowerCase().includes("wsl")) return "wsl"
                } catch (q) {
                    j6(q)
                }
                return "linux"
            }
            return "unknown"
        } catch (q) {
            return j6(q), "unknown"
        }
    }), EA6 = P1(() => {
        if (process.platform !== "linux") return;
        try {
            let q = V8().readFileSync("/proc/version", {
                    encoding: "utf8"
                }),
                K = q.match(/WSL(\d+)/i);
            if (K && K[1]) return K[1];
            if (q.toLowerCase().includes("microsoft")) return "1";
            return
        } catch (q) {
            j6(q);
            return
        }
    }), Tm7 = P1(async () => {
        if (process.platform !== "linux") return;
        let q = {
            linuxKernel: vm7()
        };
        try {
            let K = await BQ5("/etc/os-release", "utf8");
            for (let _ of K.split(`
`)) {
                let z = _.match(/^(ID|VERSION_ID)=(.*)$/);
                if (z && z[1] && z[2]) {
                    let Y = z[2].replace(/^"|"$/g, "");
                    if (z[1] === "ID") q.linuxDistroId = Y;
                    else q.linuxDistroVersion = Y
                }
            }
        } catch {}
        return q
    }), pQ5 = [
        [".git", "git"],
        [".hg", "mercurial"],
        [".svn", "svn"],
        [".p4config", "perforce"],
        ["$tf", "tfs"],
        [".tfvc", "tfs"],
        [".jj", "jujutsu"],
        [".sl", "sapling"]
    ], Vm7 = P1(() => {
        if (process.platform !== "darwin") return;
        let K = vm7().match(/^(\d+)\./);
        if (!K || !K[1]) return;
        return parseInt(K[1], 10) - 9
    })
})
// @from(Ln 43506, Col 0)
function Nm7(q, K) {
    let z = [];
    try {
        const _ = rz(z, Jw`execSync: ${q.slice(0,100)}`, 0);
        return FQ5(q, K)
    } catch (Y) {
        var A = Y,
            O = 1
    } finally {
        oz(z, A, O)
    }
}
// @from(Ln 43518, Col 4)
Em7 = L(() => {
    e8()
})
// @from(Ln 43521, Col 0)
class bf6 {
    heap;
    length;
    static #q = !1;
    static create(q) {
        let K = Rm7(q);
        if (!K) return [];
        bf6.#q = !0;
        let _ = new bf6(q, K);
        return bf6.#q = !1, _
    }
    constructor(q, K) {
        if (!bf6.#q) throw TypeError("instantiate Stack using Stack.create(n)");
        this.heap = new K(q), this.length = 0
    }
    push(q) {
        this.heap[this.length++] = q
    }
    pop() {
        return this.heap[--this.length]
    }
}
// @from(Ln 43543, Col 4)
Cf6
// @from(Ln 43543, Col 9)
Lm7
// @from(Ln 43543, Col 14)
hY1
// @from(Ln 43543, Col 19)
hm7 = (q, K, _, z) => {
        typeof hY1.emitWarning === "function" ? hY1.emitWarning(q, K, _, z) : console.error(`[${_}] ${K}: ${q}`)
    }
// @from(Ln 43546, Col 4)
HJ8
// @from(Ln 43546, Col 9)
ym7
// @from(Ln 43546, Col 14)
gQ5 = (q) => !Lm7.has(q)
// @from(Ln 43547, Col 4)
k1O
// @from(Ln 43547, Col 9)
h16 = (q) => q && q === Math.floor(q) && q > 0 && isFinite(q)
// @from(Ln 43548, Col 4)
Rm7 = (q) => !h16(q) ? null : q <= Math.pow(2, 8) ? Uint8Array : q <= Math.pow(2, 16) ? Uint16Array : q <= Math.pow(2, 32) ? Uint32Array : q <= Number.MAX_SAFE_INTEGER ? qQ6 : null
// @from(Ln 43549, Col 4)
qQ6
// @from(Ln 43549, Col 9)
iN
// @from(Ln 43550, Col 4)
If6 = L(() => {
    Cf6 = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date, Lm7 = new Set, hY1 = typeof process === "object" && !!process ? process : {}, HJ8 = globalThis.AbortController, ym7 = globalThis.AbortSignal;
    if (typeof HJ8 > "u") {
        ym7 = class {
            onabort;
            _onabort = [];
            reason;
            aborted = !1;
            addEventListener(z, Y) {
                this._onabort.push(Y)
            }
        }, HJ8 = class {
            constructor() {
                K()
            }
            signal = new ym7;
            abort(z) {
                if (this.signal.aborted) return;
                this.signal.reason = z, this.signal.aborted = !0;
                for (let Y of this.signal._onabort) Y(z);
                this.signal.onabort?.(z)
            }
        };
        let q = hY1.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1",
            K = () => {
                if (!q) return;
                q = !1, hm7("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", K)
            }
    }
    k1O = Symbol("type");
    qQ6 = class qQ6 extends Array {
        constructor(q) {
            super(q);
            this.fill(0)
        }
    };
    iN = class iN {
        #q;
        #K;
        #_;
        #Y;
        #z;
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
        #A;
        #$;
        #H;
        #j;
        #O;
        #X;
        #D;
        #P;
        #J;
        #Z;
        #W;
        #G;
        #V;
        #v;
        #T;
        #N;
        #f;
        static unsafeExposeInternals(q) {
            return {
                starts: q.#V,
                ttls: q.#v,
                sizes: q.#G,
                keyMap: q.#H,
                keyList: q.#j,
                valList: q.#O,
                next: q.#X,
                prev: q.#D,
                get head() {
                    return q.#P
                },
                get tail() {
                    return q.#J
                },
                free: q.#Z,
                isBackgroundFetch: (K) => q.#M(K),
                backgroundFetch: (K, _, z, Y) => q.#m(K, _, z, Y),
                moveToTail: (K) => q.#I(K),
                indexes: (K) => q.#y(K),
                rindexes: (K) => q.#L(K),
                isStale: (K) => q.#k(K)
            }
        }
        get max() {
            return this.#q
        }
        get maxSize() {
            return this.#K
        }
        get calculatedSize() {
            return this.#$
        }
        get size() {
            return this.#A
        }
        get fetchMethod() {
            return this.#z
        }
        get memoMethod() {
            return this.#w
        }
        get dispose() {
            return this.#_
        }
        get disposeAfter() {
            return this.#Y
        }
        constructor(q) {
            let {
                max: K = 0,
                ttl: _,
                ttlResolution: z = 1,
                ttlAutopurge: Y,
                updateAgeOnGet: A,
                updateAgeOnHas: O,
                allowStale: w,
                dispose: $,
                disposeAfter: j,
                noDisposeOnSet: H,
                noUpdateTTL: J,
                maxSize: X = 0,
                maxEntrySize: M = 0,
                sizeCalculation: P,
                fetchMethod: W,
                memoMethod: D,
                noDeleteOnFetchRejection: Z,
                noDeleteOnStaleGet: G,
                allowStaleOnFetchRejection: f,
                allowStaleOnFetchAbort: v,
                ignoreFetchAbort: V
            } = q;
            if (K !== 0 && !h16(K)) throw TypeError("max option must be a nonnegative integer");
            let k = K ? Rm7(K) : Array;
            if (!k) throw Error("invalid max value: " + K);
            if (this.#q = K, this.#K = X, this.maxEntrySize = M || this.#K, this.sizeCalculation = P, this.sizeCalculation) {
                if (!this.#K && !this.maxEntrySize) throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
                if (typeof this.sizeCalculation !== "function") throw TypeError("sizeCalculation set to non-function")
            }
            if (D !== void 0 && typeof D !== "function") throw TypeError("memoMethod must be a function if defined");
            if (this.#w = D, W !== void 0 && typeof W !== "function") throw TypeError("fetchMethod must be a function if specified");
            if (this.#z = W, this.#N = !!W, this.#H = new Map, this.#j = Array(K).fill(void 0), this.#O = Array(K).fill(void 0), this.#X = new k(K), this.#D = new k(K), this.#P = 0, this.#J = 0, this.#Z = bf6.create(K), this.#A = 0, this.#$ = 0, typeof $ === "function") this.#_ = $;
            if (typeof j === "function") this.#Y = j, this.#W = [];
            else this.#Y = void 0, this.#W = void 0;
            if (this.#T = !!this.#_, this.#f = !!this.#Y, this.noDisposeOnSet = !!H, this.noUpdateTTL = !!J, this.noDeleteOnFetchRejection = !!Z, this.allowStaleOnFetchRejection = !!f, this.allowStaleOnFetchAbort = !!v, this.ignoreFetchAbort = !!V, this.maxEntrySize !== 0) {
                if (this.#K !== 0) {
                    if (!h16(this.#K)) throw TypeError("maxSize must be a positive integer if specified")
                }
                if (!h16(this.maxEntrySize)) throw TypeError("maxEntrySize must be a positive integer if specified");
                this.#U()
            }
            if (this.allowStale = !!w, this.noDeleteOnStaleGet = !!G, this.updateAgeOnGet = !!A, this.updateAgeOnHas = !!O, this.ttlResolution = h16(z) || z === 0 ? z : 1, this.ttlAutopurge = !!Y, this.ttl = _ || 0, this.ttl) {
                if (!h16(this.ttl)) throw TypeError("ttl must be a positive integer if specified");
                this.#C()
            }
            if (this.#q === 0 && this.ttl === 0 && this.#K === 0) throw TypeError("At least one of max, maxSize, or ttl is required");
            if (!this.ttlAutopurge && !this.#q && !this.#K) {
                if (gQ5("LRU_CACHE_UNBOUNDED")) Lm7.add("LRU_CACHE_UNBOUNDED"), hm7("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", "LRU_CACHE_UNBOUNDED", iN)
            }
        }
        getRemainingTTL(q) {
            return this.#H.has(q) ? 1 / 0 : 0
        }
        #C() {
            let q = new qQ6(this.#q),
                K = new qQ6(this.#q);
            this.#v = q, this.#V = K, this.#S = (Y, A, O = Cf6.now()) => {
                if (K[Y] = A !== 0 ? O : 0, q[Y] = A, A !== 0 && this.ttlAutopurge) {
                    let w = setTimeout(() => {
                        if (this.#k(Y)) this.#h(this.#j[Y], "expire")
                    }, A + 1);
                    if (w.unref) w.unref()
                }
            }, this.#R = (Y) => {
                K[Y] = q[Y] !== 0 ? Cf6.now() : 0
            }, this.#E = (Y, A) => {
                if (q[A]) {
                    let O = q[A],
                        w = K[A];
                    if (!O || !w) return;
                    Y.ttl = O, Y.start = w, Y.now = _ || z();
                    let $ = Y.now - w;
                    Y.remainingTTL = O - $
                }
            };
            let _ = 0,
                z = () => {
                    let Y = Cf6.now();
                    if (this.ttlResolution > 0) {
                        _ = Y;
                        let A = setTimeout(() => _ = 0, this.ttlResolution);
                        if (A.unref) A.unref()
                    }
                    return Y
                };
            this.getRemainingTTL = (Y) => {
                let A = this.#H.get(Y);
                if (A === void 0) return 0;
                let O = q[A],
                    w = K[A];
                if (!O || !w) return 1 / 0;
                let $ = (_ || z()) - w;
                return O - $
            }, this.#k = (Y) => {
                let A = K[Y],
                    O = q[Y];
                return !!O && !!A && (_ || z()) - A > O
            }
        }
        #R = () => {};
        #E = () => {};
        #S = () => {};
        #k = () => !1;
        #U() {
            let q = new qQ6(this.#q);
            this.#$ = 0, this.#G = q, this.#b = (K) => {
                this.#$ -= q[K], q[K] = 0
            }, this.#B = (K, _, z, Y) => {
                if (this.#M(_)) return 0;
                if (!h16(z))
                    if (Y) {
                        if (typeof Y !== "function") throw TypeError("sizeCalculation must be a function");
                        if (z = Y(_, K), !h16(z)) throw TypeError("sizeCalculation return invalid (expect positive integer)")
                    } else throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
                return z
            }, this.#x = (K, _, z) => {
                if (q[K] = _, this.#K) {
                    let Y = this.#K - q[K];
                    while (this.#$ > Y) this.#u(!0)
                }
                if (this.#$ += q[K], z) z.entrySize = _, z.totalCalculatedSize = this.#$
            }
        }
        #b = (q) => {};
        #x = (q, K, _) => {};
        #B = (q, K, _, z) => {
            if (_ || z) throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
            return 0
        };* #y({
            allowStale: q = this.allowStale
        } = {}) {
            if (this.#A)
                for (let K = this.#J;;) {
                    if (!this.#p(K)) break;
                    if (q || !this.#k(K)) yield K;
                    if (K === this.#P) break;
                    else K = this.#D[K]
                }
        }* #L({
            allowStale: q = this.allowStale
        } = {}) {
            if (this.#A)
                for (let K = this.#P;;) {
                    if (!this.#p(K)) break;
                    if (q || !this.#k(K)) yield K;
                    if (K === this.#J) break;
                    else K = this.#X[K]
                }
        }
        #p(q) {
            return q !== void 0 && this.#H.get(this.#j[q]) === q
        }* entries() {
            for (let q of this.#y())
                if (this.#O[q] !== void 0 && this.#j[q] !== void 0 && !this.#M(this.#O[q])) yield [this.#j[q], this.#O[q]]
        }* rentries() {
            for (let q of this.#L())
                if (this.#O[q] !== void 0 && this.#j[q] !== void 0 && !this.#M(this.#O[q])) yield [this.#j[q], this.#O[q]]
        }* keys() {
            for (let q of this.#y()) {
                let K = this.#j[q];
                if (K !== void 0 && !this.#M(this.#O[q])) yield K
            }
        }* rkeys() {
            for (let q of this.#L()) {
                let K = this.#j[q];
                if (K !== void 0 && !this.#M(this.#O[q])) yield K
            }
        }* values() {
            for (let q of this.#y())
                if (this.#O[q] !== void 0 && !this.#M(this.#O[q])) yield this.#O[q]
        }* rvalues() {
            for (let q of this.#L())
                if (this.#O[q] !== void 0 && !this.#M(this.#O[q])) yield this.#O[q]
        } [Symbol.iterator]() {
            return this.entries()
        } [Symbol.toStringTag] = "LRUCache";
        find(q, K = {}) {
            for (let _ of this.#y()) {
                let z = this.#O[_],
                    Y = this.#M(z) ? z.__staleWhileFetching : z;
                if (Y === void 0) continue;
                if (q(Y, this.#j[_], this)) return this.get(this.#j[_], K)
            }
        }
        forEach(q, K = this) {
            for (let _ of this.#y()) {
                let z = this.#O[_],
                    Y = this.#M(z) ? z.__staleWhileFetching : z;
                if (Y === void 0) continue;
                q.call(K, Y, this.#j[_], this)
            }
        }
        rforEach(q, K = this) {
            for (let _ of this.#L()) {
                let z = this.#O[_],
                    Y = this.#M(z) ? z.__staleWhileFetching : z;
                if (Y === void 0) continue;
                q.call(K, Y, this.#j[_], this)
            }
        }
        purgeStale() {
            let q = !1;
            for (let K of this.#L({
                    allowStale: !0
                }))
                if (this.#k(K)) this.#h(this.#j[K], "expire"), q = !0;
            return q
        }
        info(q) {
            let K = this.#H.get(q);
            if (K === void 0) return;
            let _ = this.#O[K],
                z = this.#M(_) ? _.__staleWhileFetching : _;
            if (z === void 0) return;
            let Y = {
                value: z
            };
            if (this.#v && this.#V) {
                let A = this.#v[K],
                    O = this.#V[K];
                if (A && O) {
                    let w = A - (Cf6.now() - O);
                    Y.ttl = w, Y.start = Date.now()
                }
            }
            if (this.#G) Y.size = this.#G[K];
            return Y
        }
        dump() {
            let q = [];
            for (let K of this.#y({
                    allowStale: !0
                })) {
                let _ = this.#j[K],
                    z = this.#O[K],
                    Y = this.#M(z) ? z.__staleWhileFetching : z;
                if (Y === void 0 || _ === void 0) continue;
                let A = {
                    value: Y
                };
                if (this.#v && this.#V) {
                    A.ttl = this.#v[K];
                    let O = Cf6.now() - this.#V[K];
                    A.start = Math.floor(Date.now() - O)
                }
                if (this.#G) A.size = this.#G[K];
                q.unshift([_, A])
            }
            return q
        }
        load(q) {
            this.clear();
            for (let [K, _] of q) {
                if (_.start) {
                    let z = Date.now() - _.start;
                    _.start = Cf6.now() - z
                }
                this.set(K, _.value, _)
            }
        }
        set(q, K, _ = {}) {
            if (K === void 0) return this.delete(q), this;
            let {
                ttl: z = this.ttl,
                start: Y,
                noDisposeOnSet: A = this.noDisposeOnSet,
                sizeCalculation: O = this.sizeCalculation,
                status: w
            } = _, {
                noUpdateTTL: $ = this.noUpdateTTL
            } = _, j = this.#B(q, K, _.size || 0, O);
            if (this.maxEntrySize && j > this.maxEntrySize) {
                if (w) w.set = "miss", w.maxEntrySizeExceeded = !0;
                return this.#h(q, "set"), this
            }
            let H = this.#A === 0 ? void 0 : this.#H.get(q);
            if (H === void 0) {
                if (H = this.#A === 0 ? this.#J : this.#Z.length !== 0 ? this.#Z.pop() : this.#A === this.#q ? this.#u(!1) : this.#A, this.#j[H] = q, this.#O[H] = K, this.#H.set(q, H), this.#X[this.#J] = H, this.#D[H] = this.#J, this.#J = H, this.#A++, this.#x(H, j, w), w) w.set = "add";
                $ = !1
            } else {
                this.#I(H);
                let J = this.#O[H];
                if (K !== J) {
                    if (this.#N && this.#M(J)) {
                        J.__abortController.abort(Error("replaced"));
                        let {
                            __staleWhileFetching: X
                        } = J;
                        if (X !== void 0 && !A) {
                            if (this.#T) this.#_?.(X, q, "set");
                            if (this.#f) this.#W?.push([X, q, "set"])
                        }
                    } else if (!A) {
                        if (this.#T) this.#_?.(J, q, "set");
                        if (this.#f) this.#W?.push([J, q, "set"])
                    }
                    if (this.#b(H), this.#x(H, j, w), this.#O[H] = K, w) {
                        w.set = "replace";
                        let X = J && this.#M(J) ? J.__staleWhileFetching : J;
                        if (X !== void 0) w.oldValue = X
                    }
                } else if (w) w.set = "update"
            }
            if (z !== 0 && !this.#v) this.#C();
            if (this.#v) {
                if (!$) this.#S(H, z, Y);
                if (w) this.#E(w, H)
            }
            if (!A && this.#f && this.#W) {
                let J = this.#W,
                    X;
                while (X = J?.shift()) this.#Y?.(...X)
            }
            return this
        }
        pop() {
            try {
                while (this.#A) {
                    let q = this.#O[this.#P];
                    if (this.#u(!0), this.#M(q)) {
                        if (q.__staleWhileFetching) return q.__staleWhileFetching
                    } else if (q !== void 0) return q
                }
            } finally {
                if (this.#f && this.#W) {
                    let q = this.#W,
                        K;
                    while (K = q?.shift()) this.#Y?.(...K)
                }
            }
        }
        #u(q) {
            let K = this.#P,
                _ = this.#j[K],
                z = this.#O[K];
            if (this.#N && this.#M(z)) z.__abortController.abort(Error("evicted"));
            else if (this.#T || this.#f) {
                if (this.#T) this.#_?.(z, _, "evict");
                if (this.#f) this.#W?.push([z, _, "evict"])
            }
            if (this.#b(K), q) this.#j[K] = void 0, this.#O[K] = void 0, this.#Z.push(K);
            if (this.#A === 1) this.#P = this.#J = 0, this.#Z.length = 0;
            else this.#P = this.#X[K];
            return this.#H.delete(_), this.#A--, K
        }
        has(q, K = {}) {
            let {
                updateAgeOnHas: _ = this.updateAgeOnHas,
                status: z
            } = K, Y = this.#H.get(q);
            if (Y !== void 0) {
                let A = this.#O[Y];
                if (this.#M(A) && A.__staleWhileFetching === void 0) return !1;
                if (!this.#k(Y)) {
                    if (_) this.#R(Y);
                    if (z) z.has = "hit", this.#E(z, Y);
                    return !0
                } else if (z) z.has = "stale", this.#E(z, Y)
            } else if (z) z.has = "miss";
            return !1
        }
        peek(q, K = {}) {
            let {
                allowStale: _ = this.allowStale
            } = K, z = this.#H.get(q);
            if (z === void 0 || !_ && this.#k(z)) return;
            let Y = this.#O[z];
            return this.#M(Y) ? Y.__staleWhileFetching : Y
        }
        #m(q, K, _, z) {
            let Y = K === void 0 ? void 0 : this.#O[K];
            if (this.#M(Y)) return Y;
            let A = new HJ8,
                {
                    signal: O
                } = _;
            O?.addEventListener("abort", () => A.abort(O.reason), {
                signal: A.signal
            });
            let w = {
                    signal: A.signal,
                    options: _,
                    context: z
                },
                $ = (P, W = !1) => {
                    let {
                        aborted: D
                    } = A.signal, Z = _.ignoreFetchAbort && P !== void 0;
                    if (_.status)
                        if (D && !W) {
                            if (_.status.fetchAborted = !0, _.status.fetchError = A.signal.reason, Z) _.status.fetchAbortIgnored = !0
                        } else _.status.fetchResolved = !0;
                    if (D && !Z && !W) return H(A.signal.reason);
                    let G = X;
                    if (this.#O[K] === X)
                        if (P === void 0)
                            if (G.__staleWhileFetching) this.#O[K] = G.__staleWhileFetching;
                            else this.#h(q, "fetch");
                    else {
                        if (_.status) _.status.fetchUpdated = !0;
                        this.set(q, P, w.options)
                    }
                    return P
                },
                j = (P) => {
                    if (_.status) _.status.fetchRejected = !0, _.status.fetchError = P;
                    return H(P)
                },
                H = (P) => {
                    let {
                        aborted: W
                    } = A.signal, D = W && _.allowStaleOnFetchAbort, Z = D || _.allowStaleOnFetchRejection, G = Z || _.noDeleteOnFetchRejection, f = X;
                    if (this.#O[K] === X) {
                        if (!G || f.__staleWhileFetching === void 0) this.#h(q, "fetch");
                        else if (!D) this.#O[K] = f.__staleWhileFetching
                    }
                    if (Z) {
                        if (_.status && f.__staleWhileFetching !== void 0) _.status.returnedStale = !0;
                        return f.__staleWhileFetching
                    } else if (f.__returned === f) throw P
                },
                J = (P, W) => {
                    let D = this.#z?.(q, Y, w);
                    if (D && D instanceof Promise) D.then((Z) => P(Z === void 0 ? void 0 : Z), W);
                    A.signal.addEventListener("abort", () => {
                        if (!_.ignoreFetchAbort || _.allowStaleOnFetchAbort) {
                            if (P(void 0), _.allowStaleOnFetchAbort) P = (Z) => $(Z, !0)
                        }
                    })
                };
            if (_.status) _.status.fetchDispatched = !0;
            let X = new Promise(J).then($, j),
                M = Object.assign(X, {
                    __abortController: A,
                    __staleWhileFetching: Y,
                    __returned: void 0
                });
            if (K === void 0) this.set(q, M, {
                ...w.options,
                status: void 0
            }), K = this.#H.get(q);
            else this.#O[K] = M;
            return M
        }
        #M(q) {
            if (!this.#N) return !1;
            let K = q;
            return !!K && K instanceof Promise && K.hasOwnProperty("__staleWhileFetching") && K.__abortController instanceof HJ8
        }
        async fetch(q, K = {}) {
            let {
                allowStale: _ = this.allowStale,
                updateAgeOnGet: z = this.updateAgeOnGet,
                noDeleteOnStaleGet: Y = this.noDeleteOnStaleGet,
                ttl: A = this.ttl,
                noDisposeOnSet: O = this.noDisposeOnSet,
                size: w = 0,
                sizeCalculation: $ = this.sizeCalculation,
                noUpdateTTL: j = this.noUpdateTTL,
                noDeleteOnFetchRejection: H = this.noDeleteOnFetchRejection,
                allowStaleOnFetchRejection: J = this.allowStaleOnFetchRejection,
                ignoreFetchAbort: X = this.ignoreFetchAbort,
                allowStaleOnFetchAbort: M = this.allowStaleOnFetchAbort,
                context: P,
                forceRefresh: W = !1,
                status: D,
                signal: Z
            } = K;
            if (!this.#N) {
                if (D) D.fetch = "get";
                return this.get(q, {
                    allowStale: _,
                    updateAgeOnGet: z,
                    noDeleteOnStaleGet: Y,
                    status: D
                })
            }
            let G = {
                    allowStale: _,
                    updateAgeOnGet: z,
                    noDeleteOnStaleGet: Y,
                    ttl: A,
                    noDisposeOnSet: O,
                    size: w,
                    sizeCalculation: $,
                    noUpdateTTL: j,
                    noDeleteOnFetchRejection: H,
                    allowStaleOnFetchRejection: J,
                    allowStaleOnFetchAbort: M,
                    ignoreFetchAbort: X,
                    status: D,
                    signal: Z
                },
                f = this.#H.get(q);
            if (f === void 0) {
                if (D) D.fetch = "miss";
                let v = this.#m(q, f, G, P);
                return v.__returned = v
            } else {
                let v = this.#O[f];
                if (this.#M(v)) {
                    let h = _ && v.__staleWhileFetching !== void 0;
                    if (D) {
                        if (D.fetch = "inflight", h) D.returnedStale = !0
                    }
                    return h ? v.__staleWhileFetching : v.__returned = v
                }
                let V = this.#k(f);
                if (!W && !V) {
                    if (D) D.fetch = "hit";
                    if (this.#I(f), z) this.#R(f);
                    if (D) this.#E(D, f);
                    return v
                }
                let k = this.#m(q, f, G, P),
                    R = k.__staleWhileFetching !== void 0 && _;
                if (D) {
                    if (D.fetch = V ? "stale" : "refresh", R && V) D.returnedStale = !0
                }
                return R ? k.__staleWhileFetching : k.__returned = k
            }
        }
        async forceFetch(q, K = {}) {
            let _ = await this.fetch(q, K);
            if (_ === void 0) throw Error("fetch() returned undefined");
            return _
        }
        memo(q, K = {}) {
            let _ = this.#w;
            if (!_) throw Error("no memoMethod provided to constructor");
            let {
                context: z,
                forceRefresh: Y,
                ...A
            } = K, O = this.get(q, A);
            if (!Y && O !== void 0) return O;
            let w = _(q, O, {
                options: A,
                context: z
            });
            return this.set(q, w, A), w
        }
        get(q, K = {}) {
            let {
                allowStale: _ = this.allowStale,
                updateAgeOnGet: z = this.updateAgeOnGet,
                noDeleteOnStaleGet: Y = this.noDeleteOnStaleGet,
                status: A
            } = K, O = this.#H.get(q);
            if (O !== void 0) {
                let w = this.#O[O],
                    $ = this.#M(w);
                if (A) this.#E(A, O);
                if (this.#k(O)) {
                    if (A) A.get = "stale";
                    if (!$) {
                        if (!Y) this.#h(q, "expire");
                        if (A && _) A.returnedStale = !0;
                        return _ ? w : void 0
                    } else {
                        if (A && _ && w.__staleWhileFetching !== void 0) A.returnedStale = !0;
                        return _ ? w.__staleWhileFetching : void 0
                    }
                } else {
                    if (A) A.get = "hit";
                    if ($) return w.__staleWhileFetching;
                    if (this.#I(O), z) this.#R(O);
                    return w
                }
            } else if (A) A.get = "miss"
        }
        #F(q, K) {
            this.#D[K] = q, this.#X[q] = K
        }
        #I(q) {
            if (q !== this.#J) {
                if (q === this.#P) this.#P = this.#X[q];
                else this.#F(this.#D[q], this.#X[q]);
                this.#F(this.#J, q), this.#J = q
            }
        }
        delete(q) {
            return this.#h(q, "delete")
        }
        #h(q, K) {
            let _ = !1;
            if (this.#A !== 0) {
                let z = this.#H.get(q);
                if (z !== void 0)
                    if (_ = !0, this.#A === 1) this.#g(K);
                    else {
                        this.#b(z);
                        let Y = this.#O[z];
                        if (this.#M(Y)) Y.__abortController.abort(Error("deleted"));
                        else if (this.#T || this.#f) {
                            if (this.#T) this.#_?.(Y, q, K);
                            if (this.#f) this.#W?.push([Y, q, K])
                        }
                        if (this.#H.delete(q), this.#j[z] = void 0, this.#O[z] = void 0, z === this.#J) this.#J = this.#D[z];
                        else if (z === this.#P) this.#P = this.#X[z];
                        else {
                            let A = this.#D[z];
                            this.#X[A] = this.#X[z];
                            let O = this.#X[z];
                            this.#D[O] = this.#D[z]
                        }
                        this.#A--, this.#Z.push(z)
                    }
            }
            if (this.#f && this.#W?.length) {
                let z = this.#W,
                    Y;
                while (Y = z?.shift()) this.#Y?.(...Y)
            }
            return _
        }
        clear() {
            return this.#g("delete")
        }
        #g(q) {
            for (let K of this.#L({
                    allowStale: !0
                })) {
                let _ = this.#O[K];
                if (this.#M(_)) _.__abortController.abort(Error("deleted"));
                else {
                    let z = this.#j[K];
                    if (this.#T) this.#_?.(_, z, q);
                    if (this.#f) this.#W?.push([_, z, q])
                }
            }
            if (this.#H.clear(), this.#O.fill(void 0), this.#j.fill(void 0), this.#v && this.#V) this.#v.fill(0), this.#V.fill(0);
            if (this.#G) this.#G.fill(0);
            if (this.#P = 0, this.#J = 0, this.#Z.length = 0, this.#$ = 0, this.#A = 0, this.#f && this.#W) {
                let K = this.#W,
                    _;
                while (_ = K?.shift()) this.#Y?.(..._)
            }
        }
    }
})
// @from(Ln 44318, Col 0)
function yA6(q, K = 300000) {
    let _ = new Map,
        z = new Map,
        Y = async (...A) => {
            let O = I6(A),
                w = _.get(O),
                $ = Date.now();
            if (!w) {
                let j = z.get(O);
                if (j) return j;
                let H = q(...A);
                z.set(O, H);
                try {
                    let J = await H;
                    if (z.get(O) === H) _.set(O, {
                        value: J,
                        timestamp: $,
                        refreshing: !1
                    });
                    return J
                } finally {
                    if (z.get(O) === H) z.delete(O)
                }
            }
            if (w && $ - w.timestamp > K && !w.refreshing) {
                w.refreshing = !0;
                let j = w;
                return q(...A).then((H) => {
                    if (_.get(O) === j) _.set(O, {
                        value: H,
                        timestamp: Date.now(),
                        refreshing: !1
                    })
                }).catch((H) => {
                    if (E(String(H), {
                            level: "error"
                        }), _.get(O) === j) _.delete(O)
                }), w.value
            }
            return _.get(O).value
        };
    return Y.cache = {
        clear: () => {
            _.clear(), z.clear()
        }
    }, Y
}
// @from(Ln 44366, Col 0)
function aX(q, K, _ = 100) {
    let z = new iN({
            max: _
        }),
        Y = (...A) => {
            let O = K(...A),
                w = z.get(O);
            if (w !== void 0) return w;
            let $ = q(...A);
            return z.set(O, $), $
        };
    return Y.cache = {
        clear: () => z.clear(),
        size: () => z.size,
        delete: (A) => z.delete(A),
        get: (A) => z.peek(A),
        has: (A) => z.has(A)
    }, Y
}
// @from(Ln 44385, Col 4)
Lm = L(() => {
    If6();
    K8();
    e8()
})
// @from(Ln 44400, Col 0)
function nQ5() {
    return process.platform === "win32"
}
// @from(Ln 44404, Col 0)
function RY1(q) {
    let K = process.env.SYSTEMROOT || "C:\\Windows",
        _ = dQ5(K, "System32", "where.exe");
    try {
        let Y = UQ5(_, [q], {
                stdio: "pipe",
                encoding: "utf8"
            }).trim().split(/\r?\n/).filter(Boolean),
            A = process.cwd().toLowerCase();
        for (let O of Y) {
            let w = cQ5(O).toLowerCase();
            if (QQ5(w).toLowerCase() === A || w.startsWith(A + lQ5)) continue;
            return O
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 44424, Col 0)
function KQ6(q) {
    if (!nQ5()) return q;
    if (q.includes("/") || q.includes("\\")) return q;
    return RY1(q)
}
// @from(Ln 44429, Col 4)
JJ8 = () => {}
// @from(Ln 44432, Col 0)
function XJ8(q) {
    try {
        return Nm7(`dir "${q}"`, {
            stdio: "pipe"
        }), !0
    } catch {
        return !1
    }
}
// @from(Ln 44442, Col 0)
function Sm7() {
    if (y1() === "windows") {
        let q = _Q6();
        process.env.SHELL = q, E(`Using bash path: "${q}"`)
    }
}
// @from(Ln 44448, Col 4)
_Q6
// @from(Ln 44448, Col 9)
sX
// @from(Ln 44448, Col 13)
LA6
// @from(Ln 44449, Col 4)
rC = L(() => {
    U4();
    K8();
    Em7();
    Lm();
    NK();
    JJ8();
    _Q6 = P1(() => {
        if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
            if (XJ8(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
            console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1)
        }
        let q = ["C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files (x86)\\Git\\cmd\\git.exe"];
        for (let _ of q)
            if (XJ8(_)) {
                let z = SY1.join(_, "..", "..", "bin", "bash.exe");
                if (XJ8(z)) return z
            } let K = RY1("git");
        if (K) {
            let _ = SY1.join(K, "..", "..", "bin", "bash.exe");
            if (XJ8(_)) return _
        }
        console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1)
    }), sX = aX((q) => {
        if (q.startsWith("\\\\")) return q.replaceAll("\\", "/");
        let K = q.match(/^([A-Za-z]):[/\\]/);
        if (K) return "/" + K[1].toLowerCase() + q.slice(2).replaceAll("\\", "/");
        return q.replaceAll("\\", "/")
    }, (q) => q, 500), LA6 = aX((q) => {
        if (q.startsWith("//")) return q.replaceAll("/", "\\");
        let K = q.match(/^\/cygdrive\/([A-Za-z])(\/|$)/);
        if (K) {
            let z = K[1].toUpperCase(),
                Y = q.slice(("/cygdrive/" + K[1]).length);
            return z + ":" + (Y || "\\").replaceAll("/", "\\")
        }
        let _ = q.match(/^\/([A-Za-z])(\/|$)/);
        if (_) {
            let z = _[1].toUpperCase(),
                Y = q.slice(2);
            return z + ":" + (Y || "\\").replaceAll("/", "\\")
        }
        return q.replaceAll("/", "\\")
    }, (q) => q, 500)
})
// @from(Ln 44500, Col 0)
async function xf6(q) {
    try {
        let {
            stdout: K
        } = await oQ5("git", ["worktree", "list", "--porcelain"], {
            cwd: q,
            timeout: 5000
        });
        if (!K) return [];
        return K.split(`
`).filter((_) => _.startsWith("worktree ")).map((_) => _.slice(9).normalize("NFC"))
    } catch {
        return []
    }
}
// @from(Ln 44515, Col 4)
oQ5
// @from(Ln 44516, Col 4)
zQ6 = L(() => {
    oQ5 = rQ5(iQ5)
})
// @from(Ln 44535, Col 0)
function xm7(q) {
    if (typeof q !== "string") return null;
    return sQ5.test(q) ? q : null
}
// @from(Ln 44540, Col 0)
function um7(q) {
    if (!q.includes("\\")) return q;
    try {
        return JSON.parse(`"${q}"`)
    } catch {
        return q
    }
}
// @from(Ln 44549, Col 0)
function Vr(q, K) {
    let _ = [`"${K}":"`, `"${K}": "`];
    for (let z of _) {
        let Y = q.indexOf(z);
        if (Y < 0) continue;
        let A = Y + z.length,
            O = A;
        while (O < q.length) {
            if (q[O] === "\\") {
                O += 2;
                continue
            }
            if (q[O] === '"') return um7(q.slice(A, O));
            O++
        }
    }
    return
}
// @from(Ln 44568, Col 0)
function kV(q, K) {
    let _ = [`"${K}":"`, `"${K}": "`],
        z, Y = -1;
    for (let A of _) {
        let O = 0;
        while (!0) {
            let w = q.indexOf(A, O);
            if (w < 0) break;
            let $ = w + A.length,
                j = $;
            while (j < q.length) {
                if (q[j] === "\\") {
                    j += 2;
                    continue
                }
                if (q[j] === '"') {
                    if (w > Y) z = um7(q.slice($, j)), Y = w;
                    break
                }
                j++
            }
            O = j + 1
        }
    }
    return z
}
// @from(Ln 44594, Col 0)
async function WJ8(q, K) {
    let _ = aQ5(q, {
        mode: 384
    });
    try {
        for (let z of K)
            if (!_.write(JSON.stringify(z) + `
`)) await Cm7(_, "drain");
        _.end(), await Cm7(_, "finish")
    } catch (z) {
        throw _.destroy(), z
    }
}
// @from(Ln 44607, Col 0)
async function mm7(q, K, _) {
    try {
        let z = await bm7(q, "r");
        try {
            let Y = await z.read(_, 0, Tr, 0);
            if (Y.bytesRead === 0) return {
                head: "",
                tail: ""
            };
            let A = _.toString("utf8", 0, Y.bytesRead),
                O = Math.max(0, K - Tr),
                w = A;
            if (O > 0) {
                let $ = await z.read(_, 0, Tr, O);
                w = _.toString("utf8", 0, $.bytesRead)
            }
            return {
                head: A,
                tail: w
            }
        } finally {
            await z.close()
        }
    } catch {
        return {
            head: "",
            tail: ""
        }
    }
}
// @from(Ln 44638, Col 0)
function tQ5(q) {
    return Math.abs(N16(q)).toString(36)
}
// @from(Ln 44642, Col 0)
function AP(q) {
    let K = q.replace(/[^a-zA-Z0-9]/g, "-");
    if (K.length <= CY1) return K;
    return `${K.slice(0,CY1)}-${tQ5(q)}`
}
// @from(Ln 44648, Col 0)
function uf6() {
    return Im7(A7(), "projects")
}
// @from(Ln 44652, Col 0)
function mf6(q) {
    return Im7(uf6(), AP(q))
}
// @from(Ln 44656, Col 0)
function Kd5() {
    return qd5 ??= Buffer.from('"compact_boundary"')
}
// @from(Ln 44660, Col 0)
function Bm7(q) {
    try {
        let K = JSON.parse(q);
        if (K.type !== "system" || K.subtype !== "compact_boundary") return null;
        return {
            hasPreservedSegment: Boolean(K.compactMetadata?.preservedSegment)
        }
    } catch {
        return null
    }
}
// @from(Ln 44672, Col 0)
function hA6(q, K, _, z) {
    let Y = z - _;
    if (Y <= 0) return;
    if (q.len + Y > q.buf.length) {
        let A = Buffer.allocUnsafe(Math.min(Math.max(q.buf.length * 2, q.len + Y), q.cap));
        q.buf.copy(A, 0, 0, q.len), q.buf = A
    }
    K.copy(q.buf, q.len, _, z), q.len += Y
}
// @from(Ln 44682, Col 0)
function MJ8(q, K, _, z) {
    return z - _ >= K.length && q.compare(K, 0, K.length, _, _ + K.length) === 0
}
// @from(Ln 44686, Col 0)
function Ad5(q, K, _) {
    if (q.straddleSnapCarryLen = 0, q.straddleSnapTailEnd = 0, q.carryLen === 0) return 0;
    let z = q.carryBuf,
        Y = K.indexOf(YQ6);
    if (Y === -1 || Y >= _) return 0;
    let A = Y + 1;
    if (MJ8(z, PJ8, 0, q.carryLen)) q.straddleSnapCarryLen = q.carryLen, q.straddleSnapTailEnd = A, q.lastSnapSrc = null;
    else if (q.carryLen < PJ8.length) return 0;
    else {
        if (MJ8(z, _d5, 0, q.carryLen)) {
            let O = Bm7(z.toString("utf-8", 0, q.carryLen) + K.toString("utf-8", 0, Y));
            if (O?.hasPreservedSegment) q.hasPreservedSegment = !0;
            else if (O) q.out.len = 0, q.boundaryStartOffset = q.bufFileOff, q.hasPreservedSegment = !1, q.lastSnapSrc = null
        }
        hA6(q.out, z, 0, q.carryLen), hA6(q.out, K, 0, A)
    }
    return q.bufFileOff += q.carryLen + A, q.carryLen = 0, A
}
// @from(Ln 44705, Col 0)
function Od5(q, K, _) {
    let z = K.indexOf(_),
        Y = 0,
        A = 0,
        O = -1,
        w = -1,
        $ = K.indexOf(YQ6);
    while ($ !== -1) {
        let j = $ + 1;
        if (z !== -1 && z < A) z = K.indexOf(_, A);
        if (MJ8(K, PJ8, A, j)) hA6(q.out, K, Y, A), O = A, w = j, Y = j;
        else if (z >= A && z < Math.min(A + Yd5, j)) {
            let H = Bm7(K.toString("utf-8", A, $));
            if (H?.hasPreservedSegment) q.hasPreservedSegment = !0;
            else if (H) q.out.len = 0, q.boundaryStartOffset = q.bufFileOff + A, q.hasPreservedSegment = !1, q.lastSnapSrc = null, O = -1, q.straddleSnapCarryLen = 0, Y = A;
            z = K.indexOf(_, z + _.length)
        }
        A = j, $ = K.indexOf(YQ6, A)
    }
    return hA6(q.out, K, Y, A), {
        lastSnapStart: O,
        lastSnapEnd: w,
        trailStart: A
    }
}
// @from(Ln 44731, Col 0)
function wd5(q, K, _, z, Y) {
    if (z !== -1) {
        if (q.lastSnapLen = Y - z, q.lastSnapBuf === void 0 || q.lastSnapLen > q.lastSnapBuf.length) q.lastSnapBuf = Buffer.allocUnsafe(q.lastSnapLen);
        K.copy(q.lastSnapBuf, 0, z, Y), q.lastSnapSrc = q.lastSnapBuf
    } else if (q.straddleSnapCarryLen > 0) {
        if (q.lastSnapLen = q.straddleSnapCarryLen + q.straddleSnapTailEnd, q.lastSnapBuf === void 0 || q.lastSnapLen > q.lastSnapBuf.length) q.lastSnapBuf = Buffer.allocUnsafe(q.lastSnapLen);
        q.carryBuf.copy(q.lastSnapBuf, 0, 0, q.straddleSnapCarryLen), _.copy(q.lastSnapBuf, q.straddleSnapCarryLen, 0, q.straddleSnapTailEnd), q.lastSnapSrc = q.lastSnapBuf
    }
}
// @from(Ln 44741, Col 0)
function $d5(q, K, _) {
    if (q.carryLen = K.length - _, q.carryLen > 0) {
        if (q.carryBuf === void 0 || q.carryLen > q.carryBuf.length) q.carryBuf = Buffer.allocUnsafe(q.carryLen);
        K.copy(q.carryBuf, 0, _, K.length)
    }
}
// @from(Ln 44748, Col 0)
function jd5(q) {
    if (q.carryLen > 0) {
        let K = q.carryBuf;
        if (MJ8(K, PJ8, 0, q.carryLen)) q.lastSnapSrc = K, q.lastSnapLen = q.carryLen;
        else hA6(q.out, K, 0, q.carryLen)
    }
    if (q.lastSnapSrc) {
        if (q.out.len > 0 && q.out.buf[q.out.len - 1] !== YQ6) hA6(q.out, zd5, 0, 1);
        hA6(q.out, q.lastSnapSrc, 0, q.lastSnapLen)
    }
}
// @from(Ln 44759, Col 0)
async function pm7(q, K) {
    let _ = Kd5(),
        z = eQ5,
        Y = {
            out: {
                buf: Buffer.allocUnsafe(Math.min(K, 8388608)),
                len: 0,
                cap: K + 1
            },
            boundaryStartOffset: 0,
            hasPreservedSegment: !1,
            lastSnapSrc: null,
            lastSnapLen: 0,
            lastSnapBuf: void 0,
            bufFileOff: 0,
            carryLen: 0,
            carryBuf: void 0,
            straddleSnapCarryLen: 0,
            straddleSnapTailEnd: 0
        },
        A = Buffer.allocUnsafe(z),
        O = await bm7(q, "r");
    try {
        let w = 0;
        while (w < K) {
            let {
                bytesRead: $
            } = await O.read(A, 0, Math.min(z, K - w), w);
            if ($ === 0) break;
            w += $;
            let j = Ad5(Y, A, $),
                H;
            if (Y.carryLen > 0) {
                let X = Y.carryLen + ($ - j);
                H = Buffer.allocUnsafe(X), Y.carryBuf.copy(H, 0, 0, Y.carryLen), A.copy(H, Y.carryLen, j, $)
            } else H = A.subarray(j, $);
            let J = Od5(Y, H, _);
            wd5(Y, H, A, J.lastSnapStart, J.lastSnapEnd), $d5(Y, H, J.trailStart), Y.bufFileOff += J.trailStart
        }
        jd5(Y)
    } finally {
        await O.close()
    }
    return {
        boundaryStartOffset: Y.boundaryStartOffset,
        postBoundaryBuf: Y.out.buf.subarray(0, Y.out.len),
        hasPreservedSegment: Y.hasPreservedSegment
    }
}
// @from(Ln 44808, Col 4)
Tr = 65536
// @from(Ln 44809, Col 4)
sQ5
// @from(Ln 44809, Col 9)
CY1 = 200
// @from(Ln 44810, Col 4)
eQ5 = 1048576
// @from(Ln 44811, Col 4)
AQ6 = 5242880
// @from(Ln 44812, Col 4)
qd5
// @from(Ln 44812, Col 9)
PJ8
// @from(Ln 44812, Col 14)
_d5
// @from(Ln 44812, Col 19)
YQ6 = 10
// @from(Ln 44813, Col 4)
zd5
// @from(Ln 44813, Col 9)
Yd5 = 256
// @from(Ln 44814, Col 4)
hm = L(() => {
    Q8();
    zQ6();
    sQ5 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    PJ8 = Buffer.from('{"type":"attribution-snapshot"'), _d5 = Buffer.from('{"type":"system"'), zd5 = Buffer.from([YQ6])
})
// @from(Ln 44833, Col 0)
function Wq(q, K) {
    let _ = K ?? b8() ?? V8().cwd();
    if (typeof q !== "string") throw TypeError(`Path must be a string, received ${typeof q}`);
    if (typeof _ !== "string") throw TypeError(`Base directory must be a string, received ${typeof _}`);
    if (q.includes("\x00") || _.includes("\x00")) throw Error("Path contains null bytes");
    let z = q.trim();
    if (!z) return IY1(_).normalize("NFC");
    if (z === "~") return bY1().normalize("NFC");
    if (z.startsWith("~/")) return Jd5(bY1(), z.slice(2)).normalize("NFC");
    let Y = z;
    if (y1() === "windows" && z.match(/^\/[a-z]\//i)) try {
        Y = LA6(z)
    } catch {
        Y = z
    }
    if (Hd5(Y)) return IY1(Y).normalize("NFC");
    return Md5(_, Y).normalize("NFC")
}
// @from(Ln 44852, Col 0)
function Bf6(q) {
    let K = Xd5(b8(), q);
    return K.startsWith("..") ? q : K
}
// @from(Ln 44857, Col 0)
function Yv(q) {
    let K = Wq(q);
    if (K.startsWith("\\\\") || K.startsWith("//")) return Fm7(K);
    try {
        if (V8().statSync(K).isDirectory()) return K
    } catch {}
    return Fm7(K)
}
// @from(Ln 44866, Col 0)
function MU(q) {
    return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(q)
}
// @from(Ln 44870, Col 0)
function DJ8(q) {
    let K = bY1();
    if (q === K) return "~";
    if (q.startsWith(K + Pd5)) return "~" + q.slice(K.length);
    return q
}
// @from(Ln 44877, Col 0)
function R16(q) {
    return IY1(q).replaceAll("\\", "/")
}
// @from(Ln 44880, Col 4)
b9 = L(() => {
    n7();
    Yq();
    NK();
    rC();
    hm()
})
// @from(Ln 44909, Col 0)
async function a3(q) {
    try {
        return await dm7(q), !0
    } catch {
        return !1
    }
}
// @from(Ln 44917, Col 0)
function nm7(q) {
    try {
        return V8().readFileSync(q, {
            encoding: "utf8"
        })
    } catch (K) {
        return j6(K), null
    }
}
// @from(Ln 44927, Col 0)
function Av(q) {
    let K = V8();
    return Math.floor(K.statSync(q).mtimeMs)
}
// @from(Ln 44931, Col 0)
async function RA6(q) {
    let K = await V8().stat(q);
    return Math.floor(K.mtimeMs)
}
// @from(Ln 44936, Col 0)
function mY1() {
    return S6(process.env.CLAUDE_CODE_PERFORCE_MODE)
}
// @from(Ln 44940, Col 0)
function gf6(q) {
    return mY1() && (q & 128) === 0
}
// @from(Ln 44944, Col 0)
function S16(q, K, _, z) {
    let Y = K;
    if (z === "CRLF") Y = K.replaceAll(`\r
`, `
`).split(`
`).join(`\r
`);
    Uf6(q, Y, {
        encoding: _
    })
}
// @from(Ln 44956, Col 0)
function fJ8(q) {
    try {
        let K = V8(),
            {
                resolvedPath: _
            } = vA(K, q);
        return aU6(_)
    } catch (K) {
        if (D5(K)) E(`detectFileEncoding failed for expected reason: ${K.code}`, {
            level: "debug"
        });
        else j6(K);
        return "utf8"
    }
}
// @from(Ln 44972, Col 0)
function im7(q, K = "utf8") {
    try {
        let _ = V8(),
            {
                resolvedPath: z
            } = vA(_, q),
            {
                buffer: Y,
                bytesRead: A
            } = _.readSync(z, {
                length: 4096
            }),
            O = Y.toString(K, 0, A);
        return NY1(O)
    } catch (_) {
        return j6(_), "LF"
    }
}
// @from(Ln 44991, Col 0)
function PU(q) {
    if (!q.includes("\t")) return q;
    return q.replace(/^\t+/gm, (K) => "  ".repeat(K.length))
}
// @from(Ln 44996, Col 0)
function vd5(q) {
    let K = q ? Wq(q) : void 0,
        _ = K ? lm7(b8(), K) : void 0;
    return {
        absolutePath: K,
        relativePath: _
    }
}
// @from(Ln 45005, Col 0)
function S3(q) {
    let {
        relativePath: K
    } = vd5(q);
    if (K && !K.startsWith("..")) return K;
    let _ = cm7();
    if (q.startsWith(_ + OQ6)) return "~" + q.slice(_.length);
    return q
}
// @from(Ln 45015, Col 0)
function GJ8(q) {
    let K = V8();
    try {
        let _ = ZJ8(q),
            z = xY1(q, Um7(q)),
            O = K.readdirSync(_).filter((w) => xY1(w.name, Um7(w.name)) === z && pf6(_, w.name) !== q)[0];
        if (O) return O.name;
        return
    } catch (_) {
        if (!t1(_)) j6(_);
        return
    }
}
// @from(Ln 45028, Col 0)
async function C16(q) {
    let K = b8(),
        _ = ZJ8(K),
        z = q;
    try {
        let H = await Dd5(ZJ8(q));
        z = pf6(H, xY1(q))
    } catch {}
    let Y = _ === OQ6 ? OQ6 : _ + OQ6,
        O = y1() === "windows" ? (H) => H.toLowerCase() : (H) => H,
        w = O(z);
    if (!w.startsWith(O(Y)) || w.startsWith(O(K + OQ6)) || w === O(K)) return;
    let $ = lm7(_, z),
        j = pf6(K, $);
    try {
        return await dm7(j), j
    } catch {
        return
    }
}
// @from(Ln 45049, Col 0)
function BY1() {
    return !u8("tengu_compact_line_prefix_killswitch", !1)
}
// @from(Ln 45053, Col 0)
function vJ8({
    content: q,
    startLine: K
}) {
    if (!q) return "";
    let _ = BY1(),
        z = [],
        Y = K,
        A = 0,
        O = q.indexOf(`
`);
    while (O !== -1) z.push(Qm7(q.slice(A, O), Y++, _)), A = O + 1, O = q.indexOf(`
`, A);
    return z.push(Qm7(q.slice(A), Y, _)), z.join(`
`)
}
// @from(Ln 45070, Col 0)
function Qm7(q, K, _) {
    let z = q.endsWith("\r") ? q.slice(0, -1) : q;
    if (_) return `${K}	${z}`;
    let Y = String(K);
    return Y.length >= 6 ? `${Y}→${z}` : `${Y.padStart(6," ")}→${z}`
}
// @from(Ln 45077, Col 0)
function rm7(q) {
    return q.match(/^\s*\d+[\u2192\t](.*)$/)?.[1] ?? q
}
// @from(Ln 45081, Col 0)
function om7(q) {
    try {
        return V8().isDirEmptySync(q)
    } catch (K) {
        return t1(K)
    }
}
// @from(Ln 45089, Col 0)
function Uf6(q, K, _ = {
    encoding: "utf-8"
}) {
    let z = V8(),
        Y = q;
    try {
        let $ = z.readlinkSync(q);
        Y = Zd5($) ? $ : Gd5(ZJ8(q), $), E(`Writing through symlink: ${q} -> ${Y}`)
    } catch {}
    let A = `${Y}.tmp.${process.pid}.${Date.now()}`,
        O, w = !1;
    try {
        O = z.statSync(Y).mode, w = !0, E(`Preserving file permissions: ${O.toString(8)}`)
    } catch ($) {
        if (!t1($)) throw $;
        if (_.mode !== void 0) O = _.mode, E(`Setting permissions for new file: ${O.toString(8)}`)
    }
    try {
        E(`Writing to temp file: ${A}`);
        let $ = {
            encoding: _.encoding,
            flush: !0
        };
        if (!w && _.mode !== void 0) $.mode = _.mode;
        if (gm7(A, K, $), E(`Temp file written successfully, size: ${K.length} bytes`), w && O !== void 0) Wd5(A, O), E("Applied original permissions to temp file");
        E(`Renaming ${A} to ${Y}`), z.renameSync(A, Y), E(`File ${Y} written atomically`)
    } catch ($) {
        E(`Failed to write file atomically: ${$}`, {
            level: "error"
        });
        try {
            E(`Cleaning up temp file: ${A}`), z.unlinkSync(A)
        } catch (j) {
            E(`Failed to clean up temp file: ${j}`)
        }
        E(`Falling back to non-atomic write for ${Y}`);
        try {
            let j = {
                encoding: _.encoding,
                flush: !0
            };
            if (!w && _.mode !== void 0) j.mode = _.mode;
            gm7(Y, K, j), E(`File ${Y} written successfully with non-atomic fallback`)
        } catch (j) {
            throw E(`Non-atomic write also failed: ${j}`), j
        }
    }
}
// @from(Ln 45138, Col 0)
function am7() {
    let q = y1(),
        K = cm7();
    if (q === "macos") return pf6(K, "Desktop");
    if (q === "windows") {
        let z = process.env.USERPROFILE ? process.env.USERPROFILE.replaceAll("\\", "/") : null;
        if (z) {
            let A = `/mnt/c${z.replace(/^[A-Z]:/,"")}/Desktop`;
            if (V8().existsSync(A)) return A
        }
        try {
            let A = V8().readdirSync("/mnt/c/Users");
            for (let O of A) {
                if (O.name === "Public" || O.name === "Default" || O.name === "Default User" || O.name === "All Users") continue;
                let w = pf6("/mnt/c/Users", O.name, "Desktop");
                if (V8().existsSync(w)) return w
            }
        } catch (Y) {
            j6(Y)
        }
    }
    let _ = pf6(K, "Desktop");
    if (V8().existsSync(_)) return _;
    return K
}
// @from(Ln 45164, Col 0)
function TJ8(q, K = uY1) {
    try {
        return V8().statSync(q).size <= K
    } catch {
        return !1
    }
}
// @from(Ln 45172, Col 0)
function tX(q) {
    let K = fd5(q);
    if (y1() === "windows") K = K.replaceAll("/", "\\").toLowerCase();
    return K
}
// @from(Ln 45178, Col 0)
function sm7(q, K) {
    return tX(q) === tX(K)
}
// @from(Ln 45181, Col 4)
uY1 = 262144
// @from(Ln 45182, Col 4)
Ff6 = "File is read-only — it has not been opened for edit in Perforce. Run `p4 edit <file>` to check it out, then retry. Do not chmod the file writable; that bypasses Perforce tracking."
// @from(Ln 45183, Col 4)
Ov = "Note: your current working directory is"
// @from(Ln 45184, Col 4)
eK = L(() => {
    B1();
    n7();
    K8();
    Q8();
    m8();
    nN();
    Yq();
    U8();
    b9();
    NK()
})