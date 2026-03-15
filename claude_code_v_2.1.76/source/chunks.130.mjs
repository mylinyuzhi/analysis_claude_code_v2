
// @from(Ln 319633, Col 0)
async function XZY() {
    let A = Tu1();
    if (!A) return;
    let q = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
    try {
        let K = [A.forceFlush()],
            Y = gk6();
        if (Y) K.push(Y.forceFlush());
        let z = a86();
        if (z) K.push(z.forceFlush());
        await Promise.race([Promise.all(K), new Promise((_, w) => setTimeout(Jb8, q, w, "OpenTelemetry flush timeout"))]), k("Telemetry flushed successfully")
    } catch (K) {
        if (K instanceof Pb8) k(`Telemetry flush timed out after ${q}ms. Some metrics may not be exported.`, {
            level: "warn"
        });
        else k(`Telemetry flush failed: ${_1(K)}`, {
            level: "error"
        })
    }
}
// @from(Ln 319654, Col 0)
function PZY() {
    let A = {},
        q = process.env.OTEL_EXPORTER_OTLP_HEADERS;
    if (q)
        for (let K of q.split(",")) {
            let [Y, ...z] = K.split("=");
            if (Y && z.length > 0) A[Y.trim()] = z.join("=").trim()
        }
    return A
}
// @from(Ln 319665, Col 0)
function Wb8() {
    let A = py(),
        q = Ry(),
        K = PA(),
        Y = {},
        z = PZY();
    if (K?.otelHeadersHelper) Y.headers = async () => {
        let $ = Tb8();
        return {
            ...z,
            ...$
        }
    };
    else if (Object.keys(z).length > 0) Y.headers = async () => z;
    let _ = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!A || _ && Oo(_)) {
        let $ = lS();
        if (q || $) Y.httpAgentOptions = {
            ...q,
            ...$ && {
                ca: $
            }
        };
        return Y
    }
    let w = lS(),
        O = ($) => {
            return q || w ? new jb8.HttpsProxyAgent(A, {
                ...q && {
                    cert: q.cert,
                    key: q.key,
                    passphrase: q.passphrase
                },
                ...w && {
                    ca: w
                }
            }) : new jb8.HttpsProxyAgent(A)
        };
    return Y.httpAgentOptions = O, Y
}
// @from(Ln 319705, Col 4)
kY6
// @from(Ln 319705, Col 9)
Qd6
// @from(Ln 319705, Col 14)
Ud6
// @from(Ln 319705, Col 19)
uQ4
// @from(Ln 319705, Col 24)
mQ4
// @from(Ln 319705, Col 29)
BQ4
// @from(Ln 319705, Col 34)
Mb8
// @from(Ln 319705, Col 39)
Y66
// @from(Ln 319705, Col 44)
gQ4
// @from(Ln 319705, Col 49)
Db8
// @from(Ln 319705, Col 54)
z66
// @from(Ln 319705, Col 59)
FQ4
// @from(Ln 319705, Col 64)
Xb8
// @from(Ln 319705, Col 69)
Xb
// @from(Ln 319705, Col 73)
K66
// @from(Ln 319705, Col 78)
jb8
// @from(Ln 319705, Col 83)
wZY = 60000
// @from(Ln 319706, Col 4)
pQ4 = 5000
// @from(Ln 319707, Col 4)
QQ4 = 5000
// @from(Ln 319708, Col 4)
Pb8
// @from(Ln 319709, Col 4)
Gb8 = E(() => {
    Kb4();
    $b4();
    KY();
    dV();
    fA();
    T1();
    Ae();
    up6();
    YK();
    fA();
    i8();
    H1();
    XS();
    Mu();
    hh6();
    A8();
    g1();
    gW6();
    s8();
    kY6 = t(yq(), 1), Qd6 = t(Pn1(), 1), Ud6 = t(ue(), 1), uQ4 = t(QS4(), 1), mQ4 = t(ff1(), 1), BQ4 = t(aS4(), 1), Mb8 = t(ue(), 1), Y66 = t(nn1(), 1), gQ4 = t(zC4(), 1), Db8 = t(MC4(), 1), z66 = t(FI4(), 1), FQ4 = t(nI4(), 1), Xb8 = t(qb4(), 1), Xb = t(KH6(), 1), K66 = t(P76(), 1), jb8 = t(yR6(), 1);
    Pb8 = class Pb8 extends Error {}
})
// @from(Ln 319732, Col 4)
cQ4 = {}
// @from(Ln 319738, Col 0)
async function dd6({
    clearOnboarding: A = !1
}) {
    let {
        flushTelemetry: q
    } = await Promise.resolve().then(() => (Gb8(), Zb8));
    await q(), await Vb8(), U2().delete(), await wv1(), d1((Y) => {
        let z = {
            ...Y
        };
        if (A) {
            if (z.hasCompletedOnboarding = !1, z.subscriptionNoticeCount = 0, z.hasAvailableSubscription = !1, z.customApiKeyResponses?.approved) z.customApiKeyResponses = {
                ...z.customApiKeyResponses,
                approved: []
            }
        }
        return z.oauthAccount = void 0, z
    })
}
// @from(Ln 319757, Col 0)
async function wv1() {
    sA.cache?.clear?.(), Ov1(), r$6(), EY6(), Ie.cache?.clear?.(), eI.cache?.clear?.(), await ER8(), await UG1()
}
// @from(Ln 319760, Col 0)
async function WZY() {
    await dd6({
        clearOnboarding: !0
    });
    let A = vb8.createElement(T, null, "Successfully logged out from your Anthropic account.");
    return setTimeout(() => {
        fK(0, "logout")
    }, 200), A
}
// @from(Ln 319769, Col 4)
vb8
// @from(Ln 319770, Col 4)
Nb8 = E(() => {
    k8();
    i6();
    fA();
    aI6();
    Mf();
    _76();
    c_();
    KG6();
    $G6();
    AN();
    HA();
    vb8 = t(P6(), 1)
})
// @from(Ln 319791, Col 0)
function Hv1(A) {
    return {
        env: A?.env ?? process.env,
        home: A?.homedir ?? process.env.HOME ?? ZZY()
    }
}
// @from(Ln 319798, Col 0)
function jv1(A) {
    let {
        env: q,
        home: K
    } = Hv1(A);
    return q.XDG_STATE_HOME ?? $v1(K, ".local", "state")
}
// @from(Ln 319806, Col 0)
function lQ4(A) {
    let {
        env: q,
        home: K
    } = Hv1(A);
    return q.XDG_CACHE_HOME ?? $v1(K, ".cache")
}
// @from(Ln 319814, Col 0)
function iQ4(A) {
    let {
        env: q,
        home: K
    } = Hv1(A);
    return q.XDG_DATA_HOME ?? $v1(K, ".local", "share")
}
// @from(Ln 319822, Col 0)
function nQ4(A) {
    let {
        home: q
    } = Hv1(A);
    return $v1(q, ".local", "bin")
}
// @from(Ln 319828, Col 4)
kb8 = () => {}
// @from(Ln 319833, Col 0)
function Jv1() {
    return cd6(c8(), "local")
}
// @from(Ln 319837, Col 0)
function rQ4() {
    return cd6(Jv1(), "claude")
}
// @from(Ln 319841, Col 0)
function oQ4() {
    return (process.argv[1] || "").includes("/.claude/local/node_modules/")
}
// @from(Ln 319844, Col 0)
async function GZY() {
    try {
        let A = Jv1(),
            q = cd6(A, "package.json");
        if (!$1().existsSync(A)) $1().mkdirSync(A);
        if (!$1().existsSync(q)) fz(q, B6({
            name: "claude-local",
            version: "0.0.1",
            private: !0
        }, null, 2), {
            encoding: "utf8",
            flush: !1
        });
        let K = cd6(A, "claude");
        if (!$1().existsSync(K)) {
            let Y = `#!/bin/sh
exec "${A}/node_modules/.bin/claude" "$@"`;
            fz(K, Y, {
                encoding: "utf8",
                flush: !1
            }), await z8("chmod", ["+x", K])
        }
        return !0
    } catch (A) {
        return _6(A), !1
    }
}
// @from(Ln 319871, Col 0)
async function ld6(A, q) {
    try {
        if (!await GZY()) return "install_failed";
        let K = q ? q : A === "stable" ? "stable" : "latest",
            Y = await RA("npm", ["install", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}@${K}`], {
                cwd: Jv1(),
                maxBuffer: 1e6
            });
        if (Y.code !== 0) {
            let z = Error(`Failed to install Claude CLI package: ${Y.stderr}`);
            return _6(z), Y.code === 190 ? "in_progress" : "install_failed"
        }
        return d1((z) => ({
            ...z,
            installMethod: "local"
        })), "success"
    } catch (K) {
        return _6(K), "install_failed"
    }
}
// @from(Ln 319892, Col 0)
function _66() {
    return $1().existsSync(cd6(Jv1(), "node_modules", ".bin", "claude"))
}
// @from(Ln 319896, Col 0)
function Kf6() {
    let A = process.env.SHELL || "";
    if (A.includes("zsh")) return "zsh";
    if (A.includes("bash")) return "bash";
    if (A.includes("fish")) return "fish";
    return "unknown"
}
// @from(Ln 319903, Col 4)
yY6 = E(() => {
    Eq();
    k1();
    k8();
    SA();
    A8();
    g1();
    g1()
})
// @from(Ln 319924, Col 0)
function w66(A) {
    let q = A?.homedir ?? aQ4(),
        Y = (A?.env ?? process.env).ZDOTDIR || q;
    return {
        zsh: Eb8(Y, ".zshrc"),
        bash: Eb8(q, ".bashrc"),
        fish: Eb8(q, ".config/fish/config.fish")
    }
}
// @from(Ln 319934, Col 0)
function Mv1(A) {
    let q = !1;
    return {
        filtered: A.filter((Y) => {
            if (sQ4.test(Y)) {
                let z = Y.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
                if (!z) z = Y.match(/alias\s+claude\s*=\s*([^#\n]+)/);
                if (z && z[1]) {
                    if (z[1].trim() === rQ4()) return q = !0, !1
                }
            }
            return !0
        }),
        hadAlias: q
    }
}
// @from(Ln 319950, Col 0)
async function id6(A) {
    try {
        return (await fZY(A, {
            encoding: "utf8"
        })).split(`
`)
    } catch (q) {
        let K = q.code;
        if (K === "ENOENT" || K === "EACCES" || K === "EPERM") return null;
        throw q
    }
}
// @from(Ln 319962, Col 0)
async function Dv1(A, q) {
    let K = await TZY(A, "w");
    try {
        await K.writeFile(q.join(`
`), {
            encoding: "utf8"
        }), await K.datasync()
    } finally {
        await K.close()
    }
}
// @from(Ln 319973, Col 0)
async function yb8(A) {
    let q = w66(A);
    for (let K of Object.values(q)) {
        let Y = await id6(K);
        if (!Y) continue;
        for (let z of Y)
            if (sQ4.test(z)) {
                let _ = z.match(/alias\s+claude=["']?([^"'\s]+)/);
                if (_ && _[1]) return _[1]
            }
    }
    return null
}
// @from(Ln 319986, Col 0)
async function tQ4(A) {
    let q = await yb8(A);
    if (!q) return null;
    let K = A?.homedir ?? aQ4(),
        Y = q.startsWith("~") ? q.replace("~", K) : q;
    try {
        let z = await vZY(Y);
        if (z.isFile() || z.isSymbolicLink()) return q
    } catch {}
    return null
}
// @from(Ln 319997, Col 4)
sQ4
// @from(Ln 319998, Col 4)
Xv1 = E(() => {
    yY6();
    sQ4 = /^\s*alias\s+claude\s*=/
})
// @from(Ln 320014, Col 0)
async function eQ4() {
    try {
        let A = await rR("tengu_version_config", {
            minVersion: "0.0.0"
        });
        if (A.minVersion && iD6({
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION, A.minVersion)) console.error(`
It looks like your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}) needs an update.
A newer version (${A.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), fK(1)
    } catch (A) {
        _6(A)
    }
}
// @from(Ln 320039, Col 0)
async function O66() {
    return (await qU4()).external || void 0
}
// @from(Ln 320042, Col 0)
async function AU4() {
    return (await qU4()).external_message || void 0
}
// @from(Ln 320045, Col 0)
async function qU4() {
    try {
        return await rR("tengu_max_version_config", {})
    } catch (A) {
        return _6(A), {}
    }
}
// @from(Ln 320053, Col 0)
function zf6(A) {
    let K = mA()?.minimumVersion;
    if (!K) return !1;
    let Y = !BM(A, K);
    if (Y) k(`Skipping update to ${A} - below minimumVersion ${K}`);
    return Y
}
// @from(Ln 320061, Col 0)
function Yf6() {
    return VZY(c8(), ".update.lock")
}
// @from(Ln 320065, Col 0)
function LZY() {
    try {
        if (!$1().existsSync(c8())) $1().mkdirSync(c8());
        if ($1().existsSync(Yf6())) {
            let A = $1().statSync(Yf6());
            if (Date.now() - A.mtimeMs < yZY) return !1;
            try {
                $1().unlinkSync(Yf6())
            } catch (K) {
                return _6(K), !1
            }
        }
        return fz(Yf6(), `${process.pid}`, {
            encoding: "utf8"
        }), !0
    } catch (A) {
        return _6(A), !1
    }
}
// @from(Ln 320085, Col 0)
function RZY() {
    try {
        if ($1().readFileSync(Yf6(), {
                encoding: "utf8"
            }) === `${process.pid}`) $1().unlinkSync(Yf6())
    } catch (A) {
        if (A.code === "ENOENT") return;
        _6(A)
    }
}
// @from(Ln 320095, Col 0)
async function hZY() {
    let A = Q8.isRunningWithBun(),
        q = null;
    if (A) q = await RA("bun", ["pm", "bin", "-g"], {
        cwd: nd6()
    });
    else q = await RA("npm", ["-g", "config", "get", "prefix"], {
        cwd: nd6()
    });
    if (q.code !== 0) return _6(Error(`Failed to check ${A?"bun":"npm"} permissions`)), null;
    return q.stdout.trim()
}
// @from(Ln 320107, Col 0)
async function Lb8() {
    try {
        let A = await hZY();
        if (!A) return {
            hasPermissions: !1,
            npmPrefix: null
        };
        let q = !1;
        try {
            kZY(A, NZY.W_OK), q = !0
        } catch {
            q = !1
        }
        if (q) return {
            hasPermissions: !0,
            npmPrefix: A
        };
        return _6(new Pv1("Insufficient permissions for global npm install.")), {
            hasPermissions: !1,
            npmPrefix: A
        }
    } catch (A) {
        return _6(A), {
            hasPermissions: !1,
            npmPrefix: null
        }
    }
}
// @from(Ln 320135, Col 0)
async function LY6(A) {
    let q = A === "stable" ? "stable" : "latest",
        K = await RA("npm", ["view", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}@${q}`, "version", "--prefer-online"], {
            abortSignal: AbortSignal.timeout(5000),
            cwd: nd6()
        });
    if (K.code !== 0) {
        if (k(`npm view failed with code ${K.code}`), K.stderr) k(`npm stderr: ${K.stderr.trim()}`);
        else k("npm stderr: (empty)");
        if (K.stdout) k(`npm stdout: ${K.stdout.trim()}`);
        return null
    }
    return K.stdout.trim()
}
// @from(Ln 320149, Col 0)
async function KU4() {
    let A = await RA("npm", ["view", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.PACKAGE_URL, "dist-tags", "--json", "--prefer-online"], {
        abortSignal: AbortSignal.timeout(5000),
        cwd: nd6()
    });
    if (A.code !== 0) return k(`npm view dist-tags failed with code ${A.code}`), {
        latest: null,
        stable: null
    };
    try {
        let q = i1(A.stdout.trim());
        return {
            latest: typeof q.latest === "string" ? q.latest : null,
            stable: typeof q.stable === "string" ? q.stable : null
        }
    } catch (q) {
        return k(`Failed to parse dist-tags: ${q}`), {
            latest: null,
            stable: null
        }
    }
}
// @from(Ln 320178, Col 0)
async function Wv1(A) {
    try {
        return (await X8.get(`${EZY}/${A}`, {
            timeout: 5000,
            responseType: "text"
        })).data.trim()
    } catch (q) {
        return k(`Failed to fetch ${A} from GCS: ${q}`), null
    }
}
// @from(Ln 320188, Col 0)
async function YU4() {
    let [A, q] = await Promise.all([Wv1("latest"), Wv1("stable")]);
    return {
        latest: A,
        stable: q
    }
}
// @from(Ln 320195, Col 0)
async function rd6(A) {
    if (!LZY()) return _6(new Pv1("Another process is currently installing an update")), d("tengu_auto_updater_lock_contention", {
        pid: process.pid,
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }), "in_progress";
    try {
        if (await SZY(), !Q8.isRunningWithBun() && Q8.isNpmFromWindowsPath()) return _6(Error("Windows NPM detected in WSL environment")), d("tengu_auto_updater_windows_npm_in_wsl", {
            currentVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION
        }), console.error(`
Error: Windows NPM detected in WSL

You're running Claude Code in WSL but using the Windows NPM installation from /mnt/c/.
This configuration is not supported for updates.

To fix this issue:
  1. Install Node.js within your Linux distribution: e.g. sudo apt install nodejs npm
  2. Make sure Linux NPM is in your PATH before the Windows version
  3. Try updating again with 'claude update'
`), "install_failed";
        let {
            hasPermissions: q
        } = await Lb8();
        if (!q) return "no_permissions";
        let K = A ? `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}@${A}` : {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.PACKAGE_URL,
            Y = Q8.isRunningWithBun() ? "bun" : "npm",
            z = await RA(Y, ["install", "-g", K], {
                cwd: nd6()
            });
        if (z.code !== 0) {
            let _ = new Pv1(`Failed to install new version of claude: ${z.stdout} ${z.stderr}`);
            return _6(_), "install_failed"
        }
        return d1((_) => ({
            ..._,
            installMethod: "global"
        })), "success"
    } finally {
        RZY()
    }
}
// @from(Ln 320256, Col 0)
async function SZY() {
    let A = w66();
    for (let [, q] of Object.entries(A)) try {
        let K = await id6(q);
        if (!K) continue;
        let {
            filtered: Y,
            hadAlias: z
        } = Mv1(K);
        if (z) await Dv1(q, Y), k(`Removed claude alias from ${q}`)
    } catch (K) {
        k(`Failed to remove alias from ${q}: ${K}`, {
            level: "error"
        })
    }
}
// @from(Ln 320272, Col 4)
EZY = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 320273, Col 4)
Pv1
// @from(Ln 320273, Col 9)
yZY = 300000
// @from(Ln 320274, Col 4)
ac = E(() => {
    V1();
    HA();
    k8();
    H1();
    d3();
    A8();
    s8();
    Eq();
    g1();
    SA();
    c_();
    k1();
    i8();
    Xv1();
    g1();
    kK();
    Pv1 = class Pv1 extends iL6 {}
})
// @from(Ln 320302, Col 0)
async function xZY(A = "latest", q, K) {
    let Y = Date.now();
    try {
        let z = await X8.get(`${q}/${A}`, {
                timeout: 30000,
                responseType: "text",
                ...K
            }),
            _ = Date.now() - Y;
        return d("tengu_version_check_success", {
            latency_ms: _
        }), z.data.trim()
    } catch (z) {
        let _ = Date.now() - Y,
            w = z instanceof Error ? z.message : String(z),
            O;
        if (X8.isAxiosError(z) && z.response) O = z.response.status;
        d("tengu_version_check_failure", {
            latency_ms: _,
            http_status: O,
            is_timeout: w.includes("timeout")
        });
        let $ = Error(`Failed to fetch version from ${q}/${A}: ${w}`);
        throw _6($), $
    }
}
// @from(Ln 320328, Col 0)
async function hb8(A) {
    if (/^v?\d+\.\d+\.\d+(-\S+)?$/.test(A)) return A.startsWith("v") ? A.slice(1) : A;
    let q = A;
    if (q !== "stable" && q !== "latest") throw Error(`Invalid channel: ${A}. Use 'stable' or 'latest'`);
    return xZY(q, zU4)
}
// @from(Ln 320335, Col 0)
function mZY() {
    return Number(process.env.CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING) || uZY
}
// @from(Ln 320338, Col 0)
async function BZY(A, q, K, Y = {}) {
    let z;
    for (let _ = 1; _ <= Rb8; _++) {
        let w = new AbortController,
            O, $ = () => {
                if (O) clearTimeout(O), O = void 0
            },
            H = () => {
                $(), O = setTimeout((j) => j.abort(), mZY(), w)
            };
        try {
            H();
            let j = await X8.get(A, {
                timeout: 300000,
                responseType: "arraybuffer",
                signal: w.signal,
                onDownloadProgress: () => {
                    H()
                },
                ...Y
            });
            $();
            let J = IZY("sha256");
            J.update(j.data);
            let M = J.digest("hex");
            if (M !== q) throw Error(`Checksum mismatch: expected ${q}, got ${M}`);
            (await import("fs")).writeFileSync(K, Buffer.from(j.data)), bZY(K, 493);
            return
        } catch (j) {
            $();
            let J = X8.isCancel(j);
            if (J) z = new _U4;
            else z = j instanceof Error ? j : Error(String(j));
            if (J && _ < Rb8) {
                k(`Download stalled on attempt ${_}/${Rb8}, retrying...`), await new Promise((M) => setTimeout(M, 1000));
                continue
            }
            throw z
        }
    }
    throw z ?? Error("Download failed after all retries")
}
// @from(Ln 320380, Col 0)
async function gZY(A, q, K, Y) {
    let z = $1();
    if (z.existsSync(q)) z.rmSync(q, {
        recursive: !0,
        force: !0
    });
    let _ = sc(),
        w = Date.now();
    d("tengu_binary_download_attempt", {});
    let O;
    try {
        O = (await X8.get(`${K}/${A}/manifest.json`, {
            timeout: 1e4,
            responseType: "json",
            ...Y
        })).data
    } catch (D) {
        let X = Date.now() - w,
            P = D instanceof Error ? D.message : String(D),
            W;
        if (X8.isAxiosError(D) && D.response) W = D.response.status;
        throw d("tengu_binary_manifest_fetch_failure", {
            latency_ms: X,
            http_status: W,
            is_timeout: P.includes("timeout")
        }), _6(Error(`Failed to fetch manifest from ${K}/${A}/manifest.json: ${P}`)), D
    }
    let $ = O.platforms[_];
    if (!$) throw d("tengu_binary_platform_not_found", {}), Error(`Platform ${_} not found in manifest for version ${A}`);
    let H = $.checksum,
        j = Zv1(_),
        J = `${K}/${A}/${_}/${j}`;
    z.mkdirSync(q);
    let M = CZY(q, j);
    try {
        await BZY(J, H, M, Y || {});
        let D = Date.now() - w;
        d("tengu_binary_download_success", {
            latency_ms: D
        })
    } catch (D) {
        let X = Date.now() - w,
            P = D instanceof Error ? D.message : String(D),
            W;
        if (X8.isAxiosError(D) && D.response) W = D.response.status;
        throw d("tengu_binary_download_failure", {
            latency_ms: X,
            http_status: W,
            is_timeout: P.includes("timeout"),
            is_checksum_mismatch: P.includes("Checksum mismatch")
        }), _6(Error(`Failed to download binary from ${J}: ${P}`)), D
    }
}
// @from(Ln 320433, Col 0)
async function wU4(A, q) {
    return await gZY(A, q, zU4), "binary"
}
// @from(Ln 320436, Col 4)
zU4 = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 320437, Col 4)
uZY = 60000
// @from(Ln 320438, Col 4)
Rb8 = 3
// @from(Ln 320439, Col 4)
_U4
// @from(Ln 320440, Col 4)
OU4 = E(() => {
    kK();
    SA();
    Eq();
    H1();
    V1();
    Sb8();
    k1();
    g1();
    g1();
    _U4 = class _U4 extends Error {
        constructor() {
            super("Download stalled: no data received for 60 seconds");
            this.name = "StallTimeoutError"
        }
    }
})
// @from(Ln 320461, Col 0)
function fv1(A, q) {
    return q.includes(A.id) || A.idLike.some((K) => q.includes(K))
}
// @from(Ln 320465, Col 0)
function Cb8() {
    let A = process.execPath || process.argv[0] || "";
    if (/[/\\]mise[/\\]installs[/\\]/i.test(A)) return k(`Detected mise installation: ${A}`), !0;
    return !1
}
// @from(Ln 320471, Col 0)
function Ib8() {
    let A = process.execPath || process.argv[0] || "";
    if (/[/\\]\.?asdf[/\\]installs[/\\]/i.test(A)) return k(`Detected asdf installation: ${A}`), !0;
    return !1
}
// @from(Ln 320477, Col 0)
function Tv1() {
    let A = y8();
    if (A !== "macos" && A !== "linux" && A !== "wsl") return !1;
    let q = process.execPath || process.argv[0] || "";
    if (q.includes("/Caskroom/")) return k(`Detected Homebrew cask installation: ${q}`), !0;
    return !1
}
// @from(Ln 320485, Col 0)
function bb8() {
    if (y8() !== "windows") return !1;
    let q = process.execPath || process.argv[0] || "",
        K = [/Microsoft[/\\]WinGet[/\\]Packages/i, /Microsoft[/\\]WinGet[/\\]Links/i];
    for (let Y of K)
        if (Y.test(q)) return k(`Detected winget installation: ${q}`), !0;
    return !1
}
// @from(Ln 320493, Col 4)
Gv1
// @from(Ln 320493, Col 9)
xb8
// @from(Ln 320493, Col 14)
ub8
// @from(Ln 320493, Col 19)
mb8
// @from(Ln 320493, Col 24)
Bb8
// @from(Ln 320493, Col 29)
_f6
// @from(Ln 320494, Col 4)
vv1 = E(() => {
    YK();
    H1();
    Eq();
    U4();
    Gv1 = e1(async () => {
        try {
            let A = await FZY("/etc/os-release", "utf8"),
                q = A.match(/^ID=["']?(\S+?)["']?\s*$/m),
                K = A.match(/^ID_LIKE=["']?(.+?)["']?\s*$/m);
            return {
                id: q?.[1] ?? "",
                idLike: K?.[1]?.split(" ") ?? []
            }
        } catch {
            return null
        }
    });
    xb8 = e1(async () => {
        if (y8() !== "linux") return !1;
        let q = await Gv1();
        if (q && !fv1(q, ["arch"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await z8("pacman", ["-Qo", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return k(`Detected pacman installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), ub8 = e1(async () => {
        if (y8() !== "linux") return !1;
        let q = await Gv1();
        if (q && !fv1(q, ["debian"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await z8("dpkg", ["-S", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return k(`Detected deb installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), mb8 = e1(async () => {
        if (y8() !== "linux") return !1;
        let q = await Gv1();
        if (q && !fv1(q, ["fedora", "rhel", "suse"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await z8("rpm", ["-qf", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return k(`Detected rpm installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), Bb8 = e1(async () => {
        if (y8() !== "linux") return !1;
        let q = await Gv1();
        if (q && !fv1(q, ["alpine"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await z8("apk", ["info", "--who-owns", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return k(`Detected apk installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), _f6 = e1(async () => {
        if (Tv1()) return "homebrew";
        if (bb8()) return "winget";
        if (Cb8()) return "mise";
        if (Ib8()) return "asdf";
        if (await xb8()) return "pacman";
        if (await Bb8()) return "apk";
        if (await ub8()) return "deb";
        if (await mb8()) return "rpm";
        return "unknown"
    })
})
// @from(Ln 320581, Col 0)
function QZY() {
    let A = process.argv[1] || "",
        q = process.execPath || process.argv[0] || "";
    if (y8() === "windows") A = A.split(ad6.sep).join(od6.sep), q = q.split(ad6.sep).join(od6.sep);
    return [A, q]
}
// @from(Ln 320587, Col 0)
async function ug() {
    let [A] = QZY();
    if (rY()) {
        if (Tv1() || bb8() || Cb8() || Ib8() || await xb8() || await ub8() || await mb8() || await Bb8()) return "package-manager";
        return "native"
    }
    if (oQ4()) return "npm-local";
    if (["/usr/local/lib/node_modules", "/usr/lib/node_modules", "/opt/homebrew/lib/node_modules", "/opt/homebrew/bin", "/usr/local/bin", "/.nvm/versions/node/"].some((z) => A.includes(z))) return "npm-global";
    if (A.includes("/npm/") || A.includes("/nvm/")) return "npm-global";
    let K = await q9("npm config get prefix", {
            shell: !0,
            reject: !1
        }),
        Y = K.exitCode === 0 ? K.stdout.trim() : null;
    if (Y && A.startsWith(Y)) return "npm-global";
    return "unknown"
}
// @from(Ln 320604, Col 0)
async function UZY() {
    if (rY()) {
        try {
            return await $U4(process.execPath)
        } catch {}
        try {
            let A = await EM("claude");
            if (A) return A
        } catch {}
        try {
            return await $1().stat(xg(RY6(), ".local/bin/claude")), xg(RY6(), ".local/bin/claude")
        } catch {}
        return "native"
    }
    try {
        return process.argv[0] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 320625, Col 0)
function gb8() {
    try {
        if (rY()) return process.execPath || "unknown";
        return process.argv[1] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 320633, Col 0)
async function dZY() {
    let A = $1(),
        q = [],
        K = xg(RY6(), ".claude", "local");
    if (_66()) q.push({
        type: "npm-local",
        path: K
    });
    let Y = ["@anthropic-ai/claude-code"];
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") Y.push({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.PACKAGE_URL);
    let z = await z8("npm", ["-g", "config", "get", "prefix"]);
    if (z.code === 0 && z.stdout) {
        let O = z.stdout.trim(),
            $ = y8() === "windows",
            H = $ ? xg(O, "claude") : xg(O, "bin", "claude"),
            j = !1;
        try {
            await A.stat(H), j = !0
        } catch {}
        if (j) {
            let J = !1;
            try {
                if ((await $U4(H)).includes("/Caskroom/")) J = Tv1()
            } catch {}
            if (!J) q.push({
                type: "npm-global",
                path: H
            })
        } else
            for (let J of Y) {
                let M = $ ? xg(O, "node_modules", J) : xg(O, "lib", "node_modules", J);
                try {
                    await A.stat(M), q.push({
                        type: "npm-global-orphan",
                        path: M
                    })
                } catch {}
            }
    }
    let _ = xg(RY6(), ".local", "bin", "claude");
    try {
        await A.stat(_), q.push({
            type: "native",
            path: _
        })
    } catch {}
    if (X1().installMethod === "native") {
        let O = xg(RY6(), ".local", "share", "claude");
        try {
            if (await A.stat(O), !q.some(($) => $.type === "native")) q.push({
                type: "native",
                path: O
            })
        } catch {}
    }
    return q
}
// @from(Ln 320711, Col 0)
async function cZY(A) {
    let q = [],
        K = X1();
    if (A === "development") return q;
    if (A === "native") {
        let w = (process.env.PATH || "").split(pZY),
            O = RY6(),
            $ = xg(O, ".local", "bin"),
            H = $;
        if (y8() === "windows") H = $.split(ad6.sep).join(od6.sep);
        if (!w.some((J) => {
                let M = J;
                if (y8() === "windows") M = J.split(ad6.sep).join(od6.sep);
                let D = M.replace(/\/+$/, ""),
                    X = J.replace(/[/\\]+$/, "");
                return D === H || X === "~/.local/bin" || X === "$HOME/.local/bin"
            }))
            if (y8() === "windows") {
                let M = $.split(od6.sep).join(ad6.sep);
                q.push({
                    issue: `Native installation exists but ${M} is not in your PATH`,
                    fix: "Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal."
                })
            } else {
                let M = Kf6(),
                    X = w66()[M],
                    P = X ? X.replace(RY6(), "~") : "your shell config file";
                q.push({
                    issue: "Native installation exists but ~/.local/bin is not in your PATH",
                    fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${P} then open a new terminal or run: source ${P}`
                })
            }
    }
    if (!t6(process.env.DISABLE_INSTALLATION_CHECKS)) {
        if (A === "npm-local" && K.installMethod !== "local") q.push({
            issue: `Running from local installation but config install method is '${K.installMethod}'`,
            fix: "Consider using native installation: claude install"
        });
        if (A === "native" && K.installMethod !== "native") q.push({
            issue: `Running native installation but config install method is '${K.installMethod}'`,
            fix: "Run claude install to update configuration"
        })
    }
    if (A === "npm-global" && _66()) q.push({
        issue: "Local installation exists but not being used",
        fix: "Consider using native installation: claude install"
    });
    let Y = await yb8(),
        z = await tQ4();
    if (A === "npm-local") {
        if (!await EM("claude") && !z)
            if (Y) q.push({
                issue: "Local installation not accessible",
                fix: `Alias exists but points to invalid target: ${Y}. Update alias: alias claude="~/.claude/local/claude"`
            });
            else q.push({
                issue: "Local installation not accessible",
                fix: 'Create alias: alias claude="~/.claude/local/claude"'
            })
    }
    return q
}
// @from(Ln 320774, Col 0)
function lZY() {
    if (y8() !== "linux") return [];
    let A = [],
        q = vA.getLinuxGlobPatternWarnings();
    if (q.length > 0) {
        let K = q.slice(0, 3).join(", "),
            Y = q.length - 3,
            z = Y > 0 ? `${K} (${Y} more)` : K;
        A.push({
            issue: "Glob patterns in sandbox permission rules are not fully supported on Linux",
            fix: `Found ${q.length} pattern(s): ${z}. On Linux, glob patterns in Edit/Read rules will be ignored.`
        })
    }
    return A
}
// @from(Ln 320789, Col 0)
async function SY6() {
    let A = await ug(),
        q = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION ? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION : "unknown",
        K = await UZY(),
        Y = gb8(),
        z = await dZY(),
        _ = await cZY(A);
    if (_.push(...lZY()), A === "native") {
        let D = z.filter((P) => P.type === "npm-global" || P.type === "npm-global-orphan" || P.type === "npm-local"),
            X = y8() === "windows";
        for (let P of D)
            if (P.type === "npm-global") {
                let W = "npm -g uninstall @anthropic-ai/claude-code";
                if ({
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.76",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-03-14T00:12:49Z"
                    }.PACKAGE_URL && {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.76",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-03-14T00:12:49Z"
                    }.PACKAGE_URL !== "@anthropic-ai/claude-code") W += ` && npm -g uninstall ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}`;
                _.push({
                    issue: `Leftover npm global installation at ${P.path}`,
                    fix: `Run: ${W}`
                })
            } else if (P.type === "npm-global-orphan") _.push({
            issue: `Orphaned npm global package at ${P.path}`,
            fix: X ? `Run: rmdir /s /q "${P.path}"` : `Run: rm -rf ${P.path}`
        });
        else if (P.type === "npm-local") _.push({
            issue: `Leftover npm local installation at ${P.path}`,
            fix: X ? `Run: rmdir /s /q "${P.path}"` : `Run: rm -rf ${P.path}`
        })
    }
    let O = X1().installMethod || "not set",
        $ = null;
    if (A === "npm-global") {
        if ($ = (await Lb8()).hasPermissions, !$ && !hY6()) _.push({
            issue: "Insufficient permissions for auto-updates",
            fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
        })
    }
    let H = MJA(),
        j = {
            working: H.working ?? !0,
            mode: H.mode,
            systemPath: H.mode === "system" ? H.path : null
        },
        J = A === "package-manager" ? await _f6() : void 0;
    return {
        installationType: A,
        version: q,
        installationPath: K,
        invokedBinary: Y,
        configInstallMethod: O,
        autoUpdates: (() => {
            let D = hY6();
            return D ? `disabled (${D})` : "enabled"
        })(),
        hasUpdatePermissions: $,
        multipleInstallations: z,
        warnings: _,
        packageManager: J,
        ripgrepStatus: j
    }
}
// @from(Ln 320876, Col 4)
tc = E(() => {
    SA();
    lA();
    yY6();
    k8();
    ac();
    Xv1();
    YK();
    Eq();
    WW();
    jy();
    Lz();
    A8();
    vv1();
    Oy()
})
// @from(Ln 320897, Col 0)
function $66() {
    if (t6(void 0)) return !0;
    if (xz(void 0)) return !1;
    return w8("tengu_pid_based_version_locking", !1)
}
// @from(Ln 320903, Col 0)
function Nv1(A) {
    if (A <= 1) return !1;
    try {
        return process.kill(A, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 320912, Col 0)
function rZY(A, q) {
    if (!Nv1(A)) return !1;
    if (A === process.pid) return !0;
    try {
        let K = eyA(A);
        if (!K) return !0;
        let Y = K.toLowerCase(),
            z = q.toLowerCase();
        return Y.includes("claude") || Y.includes(z)
    } catch {
        return !0
    }
}
// @from(Ln 320926, Col 0)
function CY6(A) {
    let q = $1();
    try {
        let K = q.readFileSync(A, {
            encoding: "utf8"
        });
        if (!K || K.trim() === "") return null;
        let Y = i1(K);
        if (typeof Y.pid !== "number" || !Y.version || !Y.execPath) return null;
        return Y
    } catch {
        return null
    }
}
// @from(Ln 320941, Col 0)
function sd6(A) {
    let q = CY6(A);
    if (!q) return !1;
    let {
        pid: K,
        execPath: Y
    } = q;
    if (!Nv1(K)) return !1;
    if (!rZY(K, Y)) return k(`Lock PID ${K} is running but does not appear to be Claude - treating as stale`), !1;
    let z = $1();
    try {
        let _ = z.statSync(A);
        if (Date.now() - _.mtimeMs > nZY) {
            if (!Nv1(K)) return !1
        }
    } catch {}
    return !0
}
// @from(Ln 320960, Col 0)
function oZY(A, q) {
    let K = $1(),
        Y = `${A}.tmp.${process.pid}.${Date.now()}`;
    try {
        fz(Y, B6(q, null, 2), {
            encoding: "utf8",
            flush: !0
        }), K.renameSync(Y, A)
    } catch (z) {
        try {
            K.unlinkSync(Y)
        } catch {}
        throw z
    }
}
// @from(Ln 320975, Col 0)
async function jU4(A, q) {
    let K = $1(),
        Y = iZY(A);
    if (sd6(q)) {
        let _ = CY6(q);
        return k(`Cannot acquire lock for ${Y} - held by PID ${_?.pid}`), null
    }
    let z = {
        pid: process.pid,
        version: Y,
        execPath: process.execPath,
        acquiredAt: Date.now()
    };
    try {
        if (oZY(q, z), CY6(q)?.pid !== process.pid) return null;
        return k(`Acquired PID lock for ${Y} (PID ${process.pid})`), () => {
            try {
                if (CY6(q)?.pid === process.pid) K.unlinkSync(q), k(`Released PID lock for ${Y}`)
            } catch (w) {
                k(`Failed to release lock for ${Y}: ${w}`)
            }
        }
    } catch (_) {
        return k(`Failed to acquire lock for ${Y}: ${_}`), null
    }
}
// @from(Ln 321001, Col 0)
async function JU4(A, q) {
    let K = await jU4(A, q);
    if (!K) return !1;
    let Y = () => {
        try {
            K()
        } catch {}
    };
    return process.on("exit", Y), process.on("SIGINT", Y), process.on("SIGTERM", Y), !0
}
// @from(Ln 321011, Col 0)
async function MU4(A, q, K) {
    let Y = await jU4(A, q);
    if (!Y) return !1;
    try {
        return await K(), !0
    } finally {
        Y()
    }
}
// @from(Ln 321021, Col 0)
function DU4(A) {
    let q = $1(),
        K = [];
    if (!q.existsSync(A)) return K;
    try {
        let Y = q.readdirStringSync(A).filter((z) => z.endsWith(".lock"));
        for (let z of Y) {
            let _ = HU4(A, z),
                w = CY6(_);
            if (w) K.push({
                version: w.version,
                pid: w.pid,
                isProcessRunning: Nv1(w.pid),
                execPath: w.execPath,
                acquiredAt: new Date(w.acquiredAt),
                lockFilePath: _
            })
        }
    } catch (Y) {
        _6(Y instanceof Error ? Y : Error(`Failed to get lock info: ${Y}`))
    }
    return K
}
// @from(Ln 321045, Col 0)
function Vv1(A) {
    let q = $1(),
        K = 0;
    if (!q.existsSync(A)) return 0;
    try {
        let Y = q.readdirStringSync(A).filter((z) => z.endsWith(".lock"));
        for (let z of Y) {
            let _ = HU4(A, z);
            try {
                if (q.lstatSync(_).isDirectory()) q.rmSync(_, {
                    recursive: !0,
                    force: !0
                }), K++, k(`Cleaned up legacy directory lock: ${z}`);
                else if (!sd6(_)) q.unlinkSync(_), K++, k(`Cleaned up stale lock: ${z}`)
            } catch {}
        }
    } catch (Y) {
        _6(Y instanceof Error ? Y : Error(`Failed to cleanup stale locks: ${Y}`))
    }
    return K
}
// @from(Ln 321066, Col 4)
nZY = 7200000
// @from(Ln 321067, Col 4)
Fb8 = E(() => {
    SA();
    H1();
    k1();
    _H6();
    HA();
    A8();
    g1();
    g1()
})
// @from(Ln 321109, Col 0)
function sc() {
    let A = Q8.platform,
        q = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
    if (!q) {
        let K = Error(`Unsupported architecture: ${process.arch}`);
        throw k(`Native installer does not support architecture: ${process.arch}`, {
            level: "error"
        }), K
    }
    if (A === "linux" && LT.isMuslEnvironment()) return `linux-${q}-musl`;
    return `${A}-${q}`
}
// @from(Ln 321122, Col 0)
function Zv1(A) {
    return A.startsWith("win32") ? "claude.exe" : "claude"
}
// @from(Ln 321126, Col 0)
function Bg() {
    let A = sc(),
        q = Zv1(A);
    return {
        versions: HM(iQ4(), "claude", "versions"),
        staging: HM(lQ4(), "claude", "staging"),
        locks: HM(jv1(), "claude", "locks"),
        executable: HM(nQ4(), q)
    }
}
// @from(Ln 321136, Col 0)
async function IY6(A) {
    try {
        let q = await kf(A);
        if (!q.isFile() || q.size === 0) return !1;
        return await GU4(A, ZU4.X_OK), !0
    } catch {
        return !1
    }
}
// @from(Ln 321145, Col 0)
async function cb8(A) {
    let q = Bg(),
        K = [q.versions, q.staging, q.locks];
    await Promise.all(K.map((_) => bY6(_, {
        recursive: !0
    })));
    let Y = ec(q.executable);
    await bY6(Y, {
        recursive: !0
    });
    let z = HM(q.versions, A);
    try {
        await kf(z)
    } catch {
        await YGY(z, "", {
            encoding: "utf8"
        })
    }
    return {
        stagingPath: HM(q.staging, A),
        installPath: z
    }
}
// @from(Ln 321168, Col 0)
async function fU4(A, q, K = 0) {
    let Y = Bg(),
        z = ed6(Y, A);
    if (await bY6(Y.locks, {
            recursive: !0
        }), $66()) {
        let w = 0,
            O = K + 1,
            $ = K > 0 ? 1000 : 100,
            H = K > 0 ? 5000 : 500;
        while (w < O) {
            if (await MU4(A, z, async () => {
                    try {
                        await q()
                    } catch (J) {
                        throw _6(J), J
                    }
                })) return d("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !1,
                attempts: w + 1
            }), !0;
            if (w++, w < O) {
                let J = Math.min($ * Math.pow(2, w - 1), H);
                await new Promise((M) => setTimeout(M, J))
            }
        }
        return d("tengu_version_lock_failed", {
            is_pid_based: !0,
            is_lifetime_lock: !1,
            attempts: O
        }), Ev1(A, Error("Lock held by another process")), !1
    }
    let _ = null;
    try {
        try {
            _ = await yv1.default.lock(A, {
                stale: db8,
                retries: {
                    retries: K,
                    minTimeout: K > 0 ? 1000 : 100,
                    maxTimeout: K > 0 ? 5000 : 500
                },
                lockfilePath: z,
                onCompromised: (w) => {
                    k(`NON-FATAL: Version lock was compromised during operation: ${w.message}`, {
                        level: "info"
                    })
                }
            })
        } catch (w) {
            return d("tengu_version_lock_failed", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), Ev1(A, w), !1
        }
        try {
            return await q(), d("tengu_version_lock_acquired", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), !0
        } catch (w) {
            throw _6(w), w
        }
    } finally {
        if (_) await _()
    }
}
// @from(Ln 321236, Col 0)
async function TU4(A, q) {
    await bY6(ec(q), {
        recursive: !0
    });
    let K = `${q}.tmp.${process.pid}.${Date.now()}`;
    try {
        await Qb8(A, K), await tZY(K, 493), await kv1(K, q), k(`Atomically installed binary to ${q}`)
    } catch (Y) {
        try {
            await mg(K)
        } catch {}
        throw Y
    }
}
// @from(Ln 321250, Col 0)
async function zGY(A, q) {
    try {
        let K = HM(A, "node_modules", "@anthropic-ai"),
            z = (await td6(K)).find((w) => w.startsWith("claude-cli-native-"));
        if (!z) throw d("tengu_native_install_package_failure", {
            stage_find_package: !0,
            error_package_not_found: !0
        }), Error("Could not find platform-specific native package");
        let _ = HM(K, z, "cli");
        try {
            await kf(_)
        } catch {
            throw d("tengu_native_install_package_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Native binary not found in staged package")
        }
        await TU4(_, q), await Lv1(A, {
            recursive: !0,
            force: !0
        }), d("tengu_native_install_package_success", {})
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        if (!Y.includes("Could not find platform-specific") && !Y.includes("Native binary not found")) d("tengu_native_install_package_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw _6(K instanceof Error ? K : Error(Y)), K
    }
}
// @from(Ln 321280, Col 0)
async function _GY(A, q) {
    try {
        let K = sc(),
            Y = Zv1(K),
            z = HM(A, Y);
        try {
            await kf(z)
        } catch {
            throw d("tengu_native_install_binary_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Staged binary not found")
        }
        await TU4(z, q), await Lv1(A, {
            recursive: !0,
            force: !0
        }), d("tengu_native_install_binary_success", {})
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        if (!Y.includes("Staged binary not found")) d("tengu_native_install_binary_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw _6(K instanceof Error ? K : Error(Y)), K
    }
}
// @from(Ln 321306, Col 0)
async function wGY(A, q, K) {
    if (K === "npm") await zGY(A, q);
    else await _GY(A, q)
}
// @from(Ln 321310, Col 0)
async function XU4(A, q) {
    let {
        stagingPath: K,
        installPath: Y
    } = await cb8(A), {
        executable: z
    } = Bg(), _ = t6("true") ? `${K}.${process.pid}.${Date.now()}` : K, w = !await vU4(A) || q;
    if (w) {
        k(q ? `Force reinstalling native installer version ${A}` : `Downloading native installer version ${A}`);
        let O = await wU4(A, _);
        await wGY(_, Y, O)
    } else k(`Version ${A} already installed, updating symlink`);
    if (await $GY(z), await HGY(z, Y), !await IY6(z)) {
        let O = !1;
        try {
            await kf(Y), O = !0
        } catch {}
        throw Error(`Failed to create executable at ${z}. Source file exists: ${O}. Check write permissions to ${z}.`)
    }
    return w
}
// @from(Ln 321331, Col 0)
async function vU4(A) {
    let {
        installPath: q
    } = await cb8(A);
    return IY6(q)
}
// @from(Ln 321337, Col 0)
async function OGY(A, q = !1) {
    let K = Date.now(),
        Y = await hb8(A),
        {
            executable: z
        } = Bg();
    if (k(`Checking for native installer update to version ${Y}`), !q) {
        let O = await O66();
        if (O && UG(Y, O)) {
            if (k(`Native installer: maxVersion ${O} is set, capping update from ${Y} to ${O}`), BM({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, O)) return k(`Native installer: current version ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} is already at or above maxVersion ${O}, skipping update`), d("tengu_native_update_skipped_max_version", {
                latency_ms: Date.now() - K,
                max_version: O,
                available_version: Y
            }), {
                success: !0
            };
            Y = O
        }
    }
    if (!q && Y === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION && await vU4(Y) && await IY6(z)) return k(`Found ${Y} at ${z}, skipping install`), d("tengu_native_update_complete", {
        latency_ms: Date.now() - K,
        was_new_install: !1,
        was_force_reinstall: !1,
        was_already_running: !0
    }), {
        success: !0
    };
    if (!q && zf6(Y)) return d("tengu_native_update_skipped_minimum_version", {
        latency_ms: Date.now() - K,
        target_version: Y
    }), {
        success: !0
    };
    let _ = !1,
        w;
    if (t6("true")) _ = await XU4(Y, q), w = Date.now() - K;
    else {
        let {
            installPath: O
        } = await cb8(Y);
        if (q) await JGY(O);
        let $ = await fU4(O, async () => {
            _ = await XU4(Y, q)
        }, 3);
        if (w = Date.now() - K, !$) {
            let H = Bg(),
                j;
            if ($66()) {
                let J = ed6(H, O);
                if (sd6(J)) j = CY6(J)?.pid
            }
            return d("tengu_native_update_lock_failed", {
                latency_ms: w,
                lock_holder_pid: j
            }), {
                success: !1,
                lockFailed: !0,
                lockHolderPid: j
            }
        }
    }
    return d("tengu_native_update_complete", {
        latency_ms: w,
        was_new_install: _,
        was_force_reinstall: q
    }), k(`Successfully updated to version ${Y}`), {
        success: !0
    }
}
// @from(Ln 321420, Col 0)
async function $GY(A) {
    try {
        if ((await kf(A)).isDirectory()) {
            if ((await td6(A)).length === 0) await KGY(A), k(`Removed empty directory at ${A}`)
        }
    } catch (q) {
        k(`Could not remove empty directory at ${A}: ${q}`)
    }
}
// @from(Ln 321429, Col 0)
async function HGY(A, q) {
    if (sc().startsWith("win32")) try {
        let w = ec(A);
        await bY6(w, {
            recursive: !0
        });
        let O = !1;
        try {
            await kf(A), O = !0
        } catch {}
        if (O) {
            try {
                let H = await kf(A),
                    j = await kf(q);
                if (H.size === j.size) return !1
            } catch {}
            let $ = `${A}.old.${Date.now()}`;
            await kv1(A, $);
            try {
                await Qb8(q, A);
                try {
                    await mg($)
                } catch {}
            } catch (H) {
                try {
                    await kv1($, A)
                } catch (j) {
                    let J = Error(`Failed to restore old executable: ${j}`, {
                        cause: H
                    });
                    throw _6(J), J
                }
                throw H
            }
        } else {
            try {
                await kf(q)
            } catch {
                throw Error(`Source file does not exist: ${q}`)
            }
            await Qb8(q, A)
        }
        return !0
    } catch (w) {
        return _6(Error(`Failed to copy executable from ${q} to ${A}: ${w}`)), !1
    }
    let z = ec(A);
    try {
        await bY6(z, {
            recursive: !0
        }), k(`Created directory ${z} for symlink`)
    } catch (w) {
        return _6(Error(`Failed to create directory ${z}: ${w}`)), !1
    }
    try {
        let w = !1;
        try {
            await kf(A), w = !0
        } catch {}
        if (w) {
            try {
                let O = await Ub8(A),
                    $ = Al(ec(A), O),
                    H = Al(q);
                if ($ === H) return !1
            } catch {}
            await mg(A)
        }
    } catch (w) {
        _6(Error(`Failed to check/remove existing symlink: ${w}`))
    }
    let _ = `${A}.tmp.${process.pid}.${Date.now()}`;
    try {
        return await eZY(q, _), await kv1(_, A), k(`Atomically updated symlink ${A} -> ${q}`), !0
    } catch (w) {
        try {
            await mg(_)
        } catch {}
        return _6(Error(`Failed to create symlink from ${A} to ${q}: ${w}`)), !1
    }
}
// @from(Ln 321510, Col 0)
async function gg(A = !1) {
    if (t6(process.env.DISABLE_INSTALLATION_CHECKS)) return [];
    let q = await ug();
    if (q === "development") return [];
    let K = X1();
    if (!(A || q === "native" || K.installMethod === "native")) return [];
    let z = Bg(),
        _ = [],
        w = ec(z.executable),
        O = Al(w),
        H = sc().startsWith("win32");
    if (!wf6(w)) _.push({
        message: `installMethod is native, but directory ${w} does not exist`,
        userActionRequired: !0,
        type: "error"
    });
    if (!wf6(z.executable)) _.push({
        message: `installMethod is native, but claude command not found at ${z.executable}`,
        userActionRequired: !0,
        type: "error"
    });
    else if (!H) try {
        let J = await Ub8(z.executable),
            M = Al(ec(z.executable), J);
        if (!wf6(M)) _.push({
            message: `Claude symlink points to non-existent file: ${J}`,
            userActionRequired: !0,
            type: "error"
        });
        else if (!await IY6(M)) _.push({
            message: `Claude symlink points to invalid binary: ${J}`,
            userActionRequired: !0,
            type: "error"
        })
    } catch {
        if (!await IY6(z.executable)) _.push({
            message: `${z.executable} exists but is not a valid Claude binary`,
            userActionRequired: !0,
            type: "error"
        })
    } else if (!await IY6(z.executable)) _.push({
        message: `${z.executable} exists but is not a valid Claude binary`,
        userActionRequired: !0,
        type: "error"
    });
    if (!(process.env.PATH || "").split(aZY).some((J) => {
            try {
                let M = Al(J);
                if (H) return M.toLowerCase() === O.toLowerCase();
                return M === O
            } catch {
                return !1
            }
        }))
        if (H) {
            let J = w.replace(/\//g, "\\");
            _.push({
                message: `Native installation exists but ${J} is not in your PATH. Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.`,
                userActionRequired: !0,
                type: "path"
            })
        } else {
            let J = Kf6(),
                D = w66()[J],
                X = D ? D.replace(WU4(), "~") : "your shell config file";
            _.push({
                message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${X} && source ${X}`,
                userActionRequired: !0,
                type: "path"
            })
        } return _
}
// @from(Ln 321584, Col 0)
async function ql(A, q = !1) {
    let K = await hb8(A),
        Y = await OGY(A, q);
    if (!Y.success) return {
        latestVersion: null,
        wasUpdated: !1,
        lockFailed: Y.lockFailed,
        lockHolderPid: Y.lockHolderPid
    };
    if (K || Y.success) {
        if (X1().installMethod !== "native") d1((_) => ({
            ..._,
            installMethod: "native",
            autoUpdates: !1,
            autoUpdatesProtectedForNative: !0
        })), k('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection')
    }
    return Ac6(), {
        latestVersion: K,
        wasUpdated: Y.success,
        lockFailed: !1
    }
}
// @from(Ln 321607, Col 0)
async function jGY(A) {
    try {
        let q = await Ub8(A),
            K = Al(ec(A), q);
        if (await IY6(K)) return K
    } catch {}
    return null
}
// @from(Ln 321616, Col 0)
function ed6(A, q) {
    let K = sZY(q);
    return HM(A.locks, `${K}.lock`)
}
// @from(Ln 321620, Col 0)
async function lb8() {
    let A = Bg();
    if (!process.execPath.includes(A.versions)) return;
    try {
        let q = Al(process.execPath),
            K = ed6(A, q);
        if (await bY6(A.locks, {
                recursive: !0
            }), !wf6(q)) {
            k(`Cannot lock current version - file does not exist: ${q}`, {
                level: "info"
            });
            return
        }
        if ($66()) {
            if (!await JU4(q, K)) {
                d("tengu_version_lock_failed", {
                    is_pid_based: !0,
                    is_lifetime_lock: !0
                }), Ev1(q, Error("Lock already held by another process"));
                return
            }
            d("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !0
            }), k(`Acquired PID lock on running version: ${q}`)
        } else {
            let Y;
            try {
                Y = await yv1.default.lock(q, {
                    stale: db8,
                    retries: 0,
                    lockfilePath: K,
                    onCompromised: (z) => {
                        k(`NON-FATAL: Lock on running version was compromised: ${z.message}`, {
                            level: "info"
                        })
                    }
                }), d("tengu_version_lock_acquired", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), k(`Acquired mtime-based lock on running version: ${q}`), E4(async () => {
                    try {
                        await Y?.()
                    } catch {}
                })
            } catch (z) {
                d("tengu_version_lock_failed", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), Ev1(q, z);
                return
            }
        }
    } catch (q) {
        k(`NON-FATAL: Failed to lock current version during execution ${_1(q)}`, {
            level: "info"
        })
    }
}
// @from(Ln 321681, Col 0)
function Ev1(A, q) {
    let K = `NON-FATAL: Lock acquisition failed for ${A} (expected in multi-process scenarios)`,
        Y = q instanceof Error ? Error(K, {
            cause: q
        }) : Error(`${K}: ${q}`);
    _6(Y)
}
// @from(Ln 321688, Col 0)
async function JGY(A) {
    let q = Bg(),
        K = ed6(q, A);
    try {
        await mg(K), k(`Force-removed lock file at ${K}`)
    } catch (Y) {
        k(`Failed to force-remove lock file: ${_1(Y)}`)
    }
}
// @from(Ln 321697, Col 0)
async function Ac6() {
    await Promise.resolve();
    let A = Bg(),
        q = Date.now() - 3600000;
    if (sc().startsWith("win32")) {
        let _ = ec(A.executable);
        try {
            let w = await td6(_),
                O = 0;
            for (let $ of w) {
                if (!/^claude\.exe\.old\.\d+$/.test($)) continue;
                try {
                    await mg(HM(_, $)), O++
                } catch {}
            }
            if (O > 0) k(`Cleaned up ${O} old Windows executables on startup`)
        } catch (w) {
            if (w.code !== "ENOENT") k(`Failed to clean up old Windows executables: ${w}`)
        }
    }
    try {
        let _ = await td6(A.staging),
            w = 0;
        for (let O of _) {
            let $ = HM(A.staging, O);
            try {
                if ((await kf($)).mtime.getTime() < q) await Lv1($, {
                    recursive: !0,
                    force: !0
                }), w++, k(`Cleaned up old staging directory: ${O}`)
            } catch {}
        }
        if (w > 0) k(`Cleaned up ${w} orphaned staging directories`), d("tengu_native_staging_cleanup", {
            cleaned_count: w
        })
    } catch (_) {
        if (_.code !== "ENOENT") k(`Failed to clean up staging directories: ${_}`)
    }
    if ($66()) {
        let _ = Vv1(A.locks);
        if (_ > 0) k(`Cleaned up ${_} stale version locks`), d("tengu_native_stale_locks_cleanup", {
            cleaned_count: _
        })
    }
    let K;
    try {
        K = await td6(A.versions)
    } catch (_) {
        if (_.code !== "ENOENT") k(`Failed to readdir versions directory: ${_}`);
        return
    }
    let Y = [],
        z = 0;
    for (let _ of K) {
        let w = HM(A.versions, _);
        if (/\.tmp\.\d+\.\d+$/.test(_)) {
            try {
                if ((await kf(w)).mtime.getTime() < q) await mg(w), z++, k(`Cleaned up orphaned temp install file: ${_}`)
            } catch {}
            continue
        }
        try {
            let O = await kf(w);
            if (!O.isFile()) continue;
            if (O.size > 0) try {
                await GU4(w, ZU4.X_OK)
            } catch {
                continue
            }
            Y.push({
                name: _,
                path: w,
                resolvedPath: Al(w),
                mtime: O.mtime
            })
        } catch {}
    }
    if (z > 0) k(`Cleaned up ${z} orphaned temp install files`), d("tengu_native_temp_files_cleanup", {
        cleaned_count: z
    });
    if (Y.length === 0) return;
    try {
        let _ = process.execPath,
            w = new Set;
        if (_ && _.includes(A.versions)) w.add(Al(_));
        let O = await jGY(A.executable);
        if (O) w.add(O);
        for (let D of Y) {
            if (w.has(D.resolvedPath)) continue;
            let X = ed6(A, D.resolvedPath),
                P = !1;
            if ($66()) P = sd6(X);
            else try {
                P = await yv1.default.check(D.resolvedPath, {
                    stale: db8,
                    lockfilePath: X
                })
            } catch {
                P = !1
            }
            if (P) w.add(D.resolvedPath), k(`Protecting locked version from cleanup: ${D.name}`)
        }
        let H = Y.filter((D) => !w.has(D.resolvedPath)).sort((D, X) => X.mtime.getTime() - D.mtime.getTime()).slice(pb8);
        if (H.length === 0) {
            d("tengu_native_version_cleanup", {
                total_count: Y.length,
                deleted_count: 0,
                protected_count: w.size,
                retained_count: pb8,
                lock_failed_count: 0,
                error_count: 0
            });
            return
        }
        let j = 0,
            J = 0,
            M = 0;
        await Promise.all(H.map(async (D) => {
            try {
                if (await fU4(D.path, async () => {
                        await mg(D.path)
                    })) j++;
                else J++, k(`Skipping deletion of ${D.name} - locked by another process`)
            } catch (X) {
                M++, _6(Error(`Failed to delete version ${D.name}: ${X}`))
            }
        })), d("tengu_native_version_cleanup", {
            total_count: Y.length,
            deleted_count: j,
            protected_count: w.size,
            retained_count: pb8,
            lock_failed_count: J,
            error_count: M
        })
    } catch (_) {
        if (_.code !== "ENOENT") _6(Error(`Version cleanup failed: ${_}`))
    }
}
// @from(Ln 321835, Col 0)
async function MGY(A) {
    let q = A;
    if ((await AGY(A)).isSymbolicLink()) q = await qGY(A);
    return q.endsWith(".js") || q.includes("node_modules")
}
// @from(Ln 321840, Col 0)
async function qc6() {
    let A = Bg();
    try {
        if (!wf6(A.executable)) return;
        if (await MGY(A.executable)) {
            k(`Skipping removal of ${A.executable} - appears to be npm-managed`);
            return
        }
        await mg(A.executable), k(`Removed claude symlink at ${A.executable}`)
    } catch (q) {
        if (q.code === "ENOENT") return;
        _6(Error(`Failed to remove claude symlink: ${q}`))
    }
}
// @from(Ln 321854, Col 0)
async function Kc6() {
    let A = [],
        q = w66();
    for (let [K, Y] of Object.entries(q)) try {
        let z = await id6(Y);
        if (!z) continue;
        let {
            filtered: _,
            hadAlias: w
        } = Mv1(z);
        if (w) await Dv1(Y, _), A.push({
            message: `Removed claude alias from ${Y}. Run: unalias claude`,
            userActionRequired: !0,
            type: "alias"
        }), k(`Cleaned up claude alias from ${K} config`)
    } catch (z) {
        _6(z), A.push({
            message: `Failed to clean up ${Y}: ${z}`,
            userActionRequired: !1,
            type: "error"
        })
    }
    return A
}
// @from(Ln 321878, Col 0)
async function DGY(A) {
    try {
        let q = await RA("npm", ["config", "get", "prefix"]);
        if (q.code !== 0 || !q.stdout) return {
            success: !1,
            error: "Failed to get npm global prefix"
        };
        let K = q.stdout.trim(),
            Y = !1;
        async function z(_, w) {
            try {
                return await kf(_), await mg(_), k(`Manually removed ${w}: ${_}`), !0
            } catch {
                return !1
            }
        }
        if (sc() === "windows") {
            let _ = HM(K, "claude.cmd"),
                w = HM(K, "claude.ps1"),
                O = HM(K, "claude");
            if (await z(_, "bin script")) Y = !0;
            if (await z(w, "PowerShell script")) Y = !0;
            if (await z(O, "bin executable")) Y = !0
        } else {
            let _ = HM(K, "bin", "claude");
            if (await z(_, "bin symlink")) Y = !0
        }
        if (Y) {
            k(`Successfully removed ${A} manually`);
            let _ = sc() === "windows" ? HM(K, "node_modules", A) : HM(K, "lib", "node_modules", A);
            return {
                success: !0,
                warning: `${A} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${_}`
            }
        } else return {
            success: !1
        }
    } catch (q) {
        return k(`Manual removal failed: ${q}`, {
            level: "error"
        }), {
            success: !1,
            error: `Manual removal failed: ${q}`
        }
    }
}
// @from(Ln 321924, Col 0)
async function PU4(A) {
    let {
        code: q,
        stderr: K
    } = await RA("npm", ["uninstall", "-g", A], {
        cwd: process.cwd()
    });
    if (q === 0) return k(`Removed global npm installation of ${A}`), {
        success: !0
    };
    else if (K && !K.includes("npm ERR! code E404")) {
        if (K.includes("npm error code ENOTEMPTY")) {
            k(`Failed to uninstall global npm package ${A}: ${K}`, {
                level: "error"
            }), k("Attempting manual removal due to ENOTEMPTY error");
            let Y = await DGY(A);
            if (Y.success) return {
                success: !0,
                warning: Y.warning
            };
            else if (Y.error) return {
                success: !1,
                error: `Failed to remove global npm installation of ${A}: ${K}. Manual removal also failed: ${Y.error}`
            }
        }
        return k(`Failed to uninstall global npm package ${A}: ${K}`, {
            level: "error"
        }), {
            success: !1,
            error: `Failed to remove global npm installation of ${A}: ${K}`
        }
    }
    return {
        success: !1
    }
}
// @from(Ln 321960, Col 0)
async function Yc6() {
    let A = [],
        q = [],
        K = 0,
        Y = await PU4("@anthropic-ai/claude-code");
    if (Y.success) {
        if (K++, Y.warning) q.push(Y.warning)
    } else if (Y.error) A.push(Y.error);
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") {
        let _ = await PU4({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL);
        if (_.success) {
            if (K++, _.warning) q.push(_.warning)
        } else if (_.error) A.push(_.error)
    }
    let z = HM(WU4(), ".claude", "local");
    if (wf6(z)) try {
        await Lv1(z, {
            recursive: !0,
            force: !0
        }), K++, k(`Removed local installation at ${z}`)
    } catch (_) {
        A.push(`Failed to remove ${z}: ${_}`), k(`Failed to remove local installation: ${_}`, {
            level: "error"
        })
    }
    return {
        removed: K,
        errors: A,
        warnings: q
    }
}
// @from(Ln 322012, Col 4)
yv1
// @from(Ln 322012, Col 9)
pb8 = 2
// @from(Ln 322013, Col 4)
db8 = 604800000
// @from(Ln 322014, Col 4)
Sb8 = E(() => {
    d3();
    Zr();
    Eq();
    k1();
    KY();
    V1();
    H1();
    kb8();
    k8();
    Xv1();
    yY6();
    ac();
    OU4();
    tc();
    A8();
    Fb8();
    s8();
    yv1 = t(nx(), 1)
})
// @from(Ln 322034, Col 4)
Pb = E(() => {
    Sb8()
})
// @from(Ln 322038, Col 0)
function Kl() {
    let A = lq6(),
        K = ["user", "project", "local"].flatMap((Y) => dj(Y).errors);
    return {
        settings: A.settings,
        errors: [...A.errors, ...K]
    }
}
// @from(Ln 322046, Col 4)
zc6 = E(() => {
    i8();
    WZ()
})
// @from(Ln 322051, Col 0)
function NU4() {
    return []
}
// @from(Ln 322055, Col 0)
function VU4(A, q = null, K) {
    let Y = A?.find((z) => z.name === "ide");
    if (q) {
        let z = Y$(q.ideType),
            _ = FC(q.ideType) ? "plugin" : "extension";
        if (q.error) return [{
            label: "IDE",
            value: xY6.createElement(T, null, kA("error", K)(a6.cross), " Error installing ", z, " ", _, ": ", q.error, `
`, "Please restart your IDE and try again.")
        }];
        if (q.installed)
            if (Y && Y.type === "connected")
                if (q.installedVersion !== Y.serverInfo?.version) return [{
                    label: "IDE",
                    value: `Connected to ${z} ${_} version ${q.installedVersion} (server version: ${Y.serverInfo?.version})`
                }];
                else return [{
                    label: "IDE",
                    value: `Connected to ${z} ${_} version ${q.installedVersion}`
                }];
        else return [{
            label: "IDE",
            value: `Installed ${z} ${_}`
        }]
    } else if (Y) {
        let z = sj8(Y) ?? "IDE";
        if (Y.type === "connected") return [{
            label: "IDE",
            value: `Connected to ${z} extension`
        }];
        else return [{
            label: "IDE",
            value: `${kA("error",K)(a6.cross)} Not connected to ${z}`
        }]
    }
    return []
}
// @from(Ln 322093, Col 0)
function kU4(A = [], q) {
    let K = A.filter((Y) => Y.name !== "ide");
    if (!K.length) return [];
    return [{
        label: "MCP servers",
        value: xY6.createElement(m, {
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 1,
            flexShrink: 99
        }, K.map((Y, z) => {
            let _ = "";
            if (Y.type === "connected") _ = kA("success", q)(a6.tick);
            else if (Y.type === "pending") _ = kA("inactive", q)(a6.radioOff);
            else if (Y.type === "needs-auth") _ = kA("warning", q)(a6.triangleUpOutline);
            else if (Y.type === "failed") _ = kA("error", q)(a6.cross);
            else _ = kA("error", q)(a6.cross);
            let w = z < K.length - 1 ? "," : "";
            return xY6.createElement(T, {
                key: z
            }, Y.name, " ", _, w)
        }))
    }]
}
// @from(Ln 322118, Col 0)
function EU4() {
    let A = Pt(),
        q = Wt(),
        K = [];
    if (A.forEach((Y) => {
            let z = $K(Y.path);
            K.push(`Large ${z} will impact performance (${fq(Y.content.length)} chars > ${fq(JB)})`)
        }), q && q.content.length > O36) K.push(`CLAUDE.md entries marked as IMPORTANT exceed ${fq(O36)} characters (${fq(q.content.length)} chars)`);
    return K
}
// @from(Ln 322129, Col 0)
function yU4() {
    return [{
        label: "Setting sources",
        value: pQ().filter((Y) => {
            let z = L8(Y);
            return z !== null && Object.keys(z).length > 0
        }).map((Y) => {
            if (Y === "policySettings") {
                let z = SU4();
                if (z === null) return null;
                switch (z) {
                    case "remote":
                        return "Enterprise managed settings (remote)";
                    case "plist":
                        return "Enterprise managed settings (plist)";
                    case "hklm":
                        return "Enterprise managed settings (HKLM)";
                    case "file":
                        return "Enterprise managed settings (file)";
                    case "hkcu":
                        return "Enterprise managed settings (HKCU)"
                }
            }
            return H57(Y)
        }).filter((Y) => Y !== null)
    }]
}
// @from(Ln 322156, Col 0)
async function LU4() {
    return (await gg()).map((q) => q.message)
}
// @from(Ln 322159, Col 0)
async function RU4() {
    let A = await SY6(),
        q = [],
        {
            errors: K
        } = Kl();
    if (K.length > 0) {
        let z = Array.from(new Set(K.map((_) => _.file))).join(", ");
        q.push(`Found invalid settings files: ${z}. They will be ignored.`)
    }
    if (A.warnings.forEach((Y) => {
            q.push(Y.issue)
        }), A.hasUpdatePermissions === !1) q.push("No write permissions for auto-updates (requires sudo)");
    return q
}
// @from(Ln 322175, Col 0)
function Rv1() {
    let A = _c6();
    if (!A) return [];
    let q = [];
    if (A.subscription) q.push({
        label: "Login method",
        value: `${A.subscription} Account`
    });
    if (A.tokenSource) q.push({
        label: "Auth token",
        value: A.tokenSource
    });
    if (A.apiKeySource) q.push({
        label: "API key",
        value: A.apiKeySource
    });
    if (A.organization && !process.env.IS_DEMO) q.push({
        label: "Organization",
        value: A.organization
    });
    if (A.email && !process.env.IS_DEMO) q.push({
        label: "Email",
        value: A.email
    });
    return q
}
// @from(Ln 322202, Col 0)
function hv1() {
    let A = QA(),
        q = [];
    if (A !== "firstParty") {
        let z = {
            bedrock: "AWS Bedrock",
            vertex: "Google Vertex AI",
            foundry: "Microsoft Foundry"
        } [A];
        q.push({
            label: "API provider",
            value: z
        })
    }
    if (A === "firstParty") {
        let z = process.env.ANTHROPIC_BASE_URL;
        if (z) q.push({
            label: "Anthropic base URL",
            value: z
        })
    } else if (A === "bedrock") {
        let z = process.env.BEDROCK_BASE_URL;
        if (z) q.push({
            label: "Bedrock base URL",
            value: z
        });
        if (q.push({
                label: "AWS region",
                value: OA6()
            }), t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) q.push({
            value: "AWS auth skipped"
        })
    } else if (A === "vertex") {
        let z = process.env.VERTEX_BASE_URL;
        if (z) q.push({
            label: "Vertex base URL",
            value: z
        });
        let _ = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
        if (_) q.push({
            label: "GCP project",
            value: _
        });
        if (q.push({
                label: "Default region",
                value: ct6()
            }), t6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) q.push({
            value: "GCP auth skipped"
        })
    } else if (A === "foundry") {
        let z = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
        if (z) q.push({
            label: "Microsoft Foundry base URL",
            value: z
        });
        let _ = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
        if (_) q.push({
            label: "Microsoft Foundry resource",
            value: _
        });
        if (t6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) q.push({
            value: "Microsoft Foundry auth skipped"
        })
    }
    let K = py();
    if (K) q.push({
        label: "Proxy",
        value: K
    });
    let Y = Ry();
    if (process.env.NODE_EXTRA_CA_CERTS) q.push({
        label: "Additional CA cert(s)",
        value: process.env.NODE_EXTRA_CA_CERTS
    });
    if (Y) {
        if (Y.cert && process.env.CLAUDE_CODE_CLIENT_CERT) q.push({
            label: "mTLS client cert",
            value: process.env.CLAUDE_CODE_CLIENT_CERT
        });
        if (Y.key && process.env.CLAUDE_CODE_CLIENT_KEY) q.push({
            label: "mTLS client key",
            value: process.env.CLAUDE_CODE_CLIENT_KEY
        })
    }
    return q
}
// @from(Ln 322289, Col 0)
function hU4(A) {
    let q = oR(A);
    if (A === null && iA()) {
        let K = Of6();
        q = `${O1.bold("Default")} ${K}`
    }
    return q
}
// @from(Ln 322297, Col 4)
xY6
// @from(Ln 322298, Col 4)
ib8 = E(() => {
    i6();
    Pb();
    fA();
    Sw();
    lM();
    M4();
    Z7();
    Nz();
    z4();
    aK();
    tc();
    A8();
    dV();
    Mu();
    i8();
    zc6();
    Lz();
    b7();
    fA();
    O2();
    xY6 = t(P6(), 1)
})
// @from(Ln 322321, Col 0)
async function CU4() {
    try {
        if (X1().claudeCodeFirstTokenDate !== void 0) return;
        let q = QO();
        if (q.error) {
            _6(Error(`Failed to get auth headers: ${q.error}`));
            return
        }
        let Y = `${P7().BASE_API_URL}/api/organization/claude_code_first_token_date`,
            _ = (await X8.get(Y, {
                headers: {
                    ...q.headers,
                    "User-Agent": pO()
                },
                timeout: 1e4
            })).data?.first_token_date ?? null;
        if (_ !== null) {
            let w = new Date(_).getTime();
            if (isNaN(w)) {
                _6(Error(`Received invalid first_token_date from API: ${_}`));
                return
            }
        }
        d1((w) => ({
            ...w,
            claudeCodeFirstTokenDate: _
        }))
    } catch (A) {
        _6(A)
    }
}
// @from(Ln 322352, Col 4)
IU4 = E(() => {
    k8();
    RM();
    k1();
    F5();
    kK()
})
// @from(Ln 322359, Col 4)
Sv1 = {}
// @from(Ln 322366, Col 0)
async function wc6(A) {
    await dd6({
        clearOnboarding: !1
    });
    let q = A.profile ?? await Kg(A.accessToken);
    if (q) hZ6({
        accountUuid: q.account.uuid,
        emailAddress: q.account.email,
        organizationUuid: q.organization.uuid,
        displayName: q.account.display_name || void 0,
        hasExtraUsageEnabled: q.organization.has_extra_usage_enabled ?? void 0,
        billingType: q.organization.billing_type ?? void 0,
        subscriptionCreatedAt: q.organization.subscription_created_at ?? void 0,
        accountCreatedAt: q.account.created_at
    });
    else if (A.tokenAccount) hZ6({
        accountUuid: A.tokenAccount.uuid,
        emailAddress: A.tokenAccount.emailAddress,
        organizationUuid: A.tokenAccount.organizationUuid
    });
    let K = $f6(A);
    if (Cv1(), K.warning) d("tengu_oauth_storage_warning", {
        warning: K.warning
    });
    if (await xy8(A.accessToken).catch((Y) => k(String(Y), {
            level: "error"
        })), aI(A.scopes)) await CU4().catch((Y) => k(String(Y), {
        level: "error"
    }));
    else if (!await uy8(A.accessToken)) throw Error("Unable to create API key. The server accepted the request but did not return a key.");
    await wv1()
}
// @from(Ln 322398, Col 0)
async function XGY({
    email: A,
    sso: q
}) {
    let K = process.env.CLAUDE_CODE_OAUTH_REFRESH_TOKEN;
    if (K) {
        let _ = process.env.CLAUDE_CODE_OAUTH_SCOPES;
        if (!_) process.stderr.write(`CLAUDE_CODE_OAUTH_SCOPES is required when using CLAUDE_CODE_OAUTH_REFRESH_TOKEN.
Set it to the space-separated scopes the refresh token was issued with
(e.g. "user:inference" or "user:profile user:inference user:sessions:claude_code user:mcp_servers").
`), process.exit(1);
        let w = _.split(/\s+/).filter(Boolean);
        try {
            d("tengu_login_from_refresh_token", {});
            let O = await QQ6(K, {
                scopes: w
            });
            await wc6(O);
            let $ = await Yl();
            if (!$.valid) process.stderr.write($.message + `
`), process.exit(1);
            d1((H) => {
                if (H.hasCompletedOnboarding) return H;
                return {
                    ...H,
                    hasCompletedOnboarding: !0
                }
            }), d("tengu_oauth_success", {
                loginWithClaudeAi: !0
            }), process.stdout.write(`Login successful.
`), process.exit(0)
        } catch (O) {
            _6(O);
            let $ = kt(O);
            process.stderr.write(`Login failed: ${_1(O)}
${$?$+`
`:""}`), process.exit(1)
        }
    }
    let Y = q ? "sso" : void 0,
        z = new I96;
    try {
        d("tengu_oauth_flow_start", {
            loginWithClaudeAi: !0
        });
        let _ = await z.startOAuthFlow(async (O) => {
            process.stdout.write(`Opening browser to sign in…
`), process.stdout.write(`If the browser didn't open, visit: ${O}
`)
        }, {
            loginWithClaudeAi: !0,
            loginHint: A,
            loginMethod: Y
        });
        await wc6(_);
        let w = await Yl();
        if (!w.valid) process.stderr.write(w.message + `
`), process.exit(1);
        d("tengu_oauth_success", {
            loginWithClaudeAi: !0
        }), process.stdout.write(`Login successful.
`), process.exit(0)
    } catch (_) {
        _6(_);
        let w = kt(_);
        process.stderr.write(`Login failed: ${_1(_)}
${w?w+`
`:""}`), process.exit(1)
    } finally {
        z.cleanup()
    }
}
// @from(Ln 322470, Col 0)
async function PGY(A) {
    let {
        source: q,
        hasToken: K
    } = aR(), {
        source: Y
    } = s2(), z = !!process.env.ANTHROPIC_API_KEY && !zG(), _ = L3(), w = CK(), O = uI(), $ = K || Y !== "none" || z || O, H = "none";
    if (O) H = "third_party";
    else if (q === "claude.ai") H = "claude.ai";
    else if (q === "apiKeyHelper") H = "api_key_helper";
    else if (q !== "none") H = "oauth_token";
    else if (Y === "ANTHROPIC_API_KEY" || z) H = "api_key";
    else if (Y === "/login managed key") H = "claude.ai";
    if (A.text) {
        let j = [...Rv1(), ...hv1()],
            J = !1;
        for (let M of j) {
            let D = typeof M.value === "string" ? M.value : Array.isArray(M.value) ? M.value.join(", ") : null;
            if (D === null || D === "none") continue;
            if (J = !0, M.label) process.stdout.write(`${M.label}: ${D}
`);
            else process.stdout.write(`${D}
`)
        }
        if (!J && z) process.stdout.write(`API key: ANTHROPIC_API_KEY
`);
        if (!$) process.stdout.write(`Not logged in. Run claude auth login to authenticate.
`)
    } else {
        let j = QA(),
            J = Y !== "none" ? Y : z ? "ANTHROPIC_API_KEY" : null,
            M = {
                loggedIn: $,
                authMethod: H,
                apiProvider: j
            };
        if (J) M.apiKeySource = J;
        if (H === "claude.ai") M.email = _?.emailAddress ?? null, M.orgId = _?.organizationUuid ?? null, M.orgName = _?.organizationName ?? null, M.subscriptionType = w ?? null;
        process.stdout.write(B6(M, null, 2) + `
`)
    }
    process.exit($ ? 0 : 1)
}
// @from(Ln 322513, Col 0)
async function WGY() {
    try {
        await dd6({
            clearOnboarding: !1
        })
    } catch {
        process.stderr.write(`Failed to log out.
`), process.exit(1)
    }
    process.stdout.write(`Successfully logged out from your Anthropic account.
`), process.exit(0)
}
// @from(Ln 322525, Col 4)
Oc6 = E(() => {
    fA();
    Nz();
    Nb8();
    ib8();
    g1();
    TZ1();
    W0();
    RZ6();
    IU4();
    V1();
    k1();
    H1();
    A8();
    k8();
    s8();
    uv()
})
// @from(Ln 322543, Col 4)
xU4 = {}