
// @from(Ln 205481, Col 0)
function PH4(q) {
    if (!MH4()) return {
        errors: ["Unsupported platform"],
        warnings: []
    };
    let K = [],
        _ = [],
        z = q ?? q9?.ripgrep ?? {
            command: "rg"
        };
    if (ws(z.command) === null) K.push(`ripgrep (${z.command}) not found`);
    if (nv() === "linux") {
        let A = tj4(q9?.seccomp);
        K.push(...A.errors), _.push(...A.warnings)
    }
    return {
        errors: K,
        warnings: _
    }
}
// @from(Ln 205502, Col 0)
function bl_() {
    if (!q9) return {
        denyOnly: [],
        allowWithinDeny: []
    };
    let q = [];
    for (let _ of q9.filesystem.denyRead) {
        let z = $s(_);
        if (nv() === "linux" && yf(z)) {
            let Y = os6(_);
            x7(`[Sandbox] Expanded glob pattern "${_}" to ${Y.length} paths on Linux`), q.push(...Y)
        } else q.push(z)
    }
    let K = [];
    for (let _ of q9.filesystem.allowRead ?? []) {
        let z = $s(_);
        if (nv() === "linux" && yf(z)) {
            let Y = os6(_);
            x7(`[Sandbox] Expanded allowRead glob pattern "${_}" to ${Y.length} paths on Linux`), K.push(...Y)
        } else K.push(z)
    }
    return {
        denyOnly: q,
        allowWithinDeny: K
    }
}
// @from(Ln 205529, Col 0)
function Il_() {
    if (!q9) return {
        allowOnly: rs6(),
        denyWithinAllow: []
    };
    let q = q9.filesystem.allowWrite.map((z) => $s(z)).filter((z) => {
            if (nv() === "linux" && yf(z)) return x7(`Skipping glob pattern on Linux/WSL: ${z}`), !1;
            return !0
        }),
        K = q9.filesystem.denyWrite.map((z) => $s(z)).filter((z) => {
            if (nv() === "linux" && yf(z)) return x7(`Skipping glob pattern on Linux/WSL: ${z}`), !1;
            return !0
        });
    return {
        allowOnly: [...rs6(), ...q],
        denyWithinAllow: K
    }
}
// @from(Ln 205548, Col 0)
function xl_() {
    if (!q9) return {};
    let q = q9.network.allowedDomains,
        K = q9.network.deniedDomains;
    return {
        ...q.length > 0 && {
            allowedHosts: q
        },
        ...K.length > 0 && {
            deniedHosts: K
        }
    }
}
// @from(Ln 205562, Col 0)
function WH4() {
    return q9?.network?.allowUnixSockets
}
// @from(Ln 205566, Col 0)
function HH4() {
    return q9?.network?.allowAllUnixSockets
}
// @from(Ln 205570, Col 0)
function DH4() {
    return q9?.network?.allowLocalBinding
}
// @from(Ln 205574, Col 0)
function ZH4() {
    return q9?.network?.allowMachLookup
}
// @from(Ln 205578, Col 0)
function fH4() {
    return q9?.ignoreViolations
}
// @from(Ln 205582, Col 0)
function GH4() {
    return q9?.enableWeakerNestedSandbox
}
// @from(Ln 205586, Col 0)
function ul_() {
    return q9?.enableWeakerNetworkIsolation
}
// @from(Ln 205590, Col 0)
function ml_() {
    return q9?.ripgrep ?? {
        command: "rg"
    }
}
// @from(Ln 205596, Col 0)
function Bl_() {
    return q9?.mandatoryDenySearchDepth ?? 3
}
// @from(Ln 205600, Col 0)
function JH4() {
    return q9?.filesystem?.allowGitConfig ?? !1
}
// @from(Ln 205604, Col 0)
function pl_() {
    return q9?.seccomp
}
// @from(Ln 205608, Col 0)
function vH4() {
    return mI?.httpProxyPort
}
// @from(Ln 205612, Col 0)
function TH4() {
    return mI?.socksProxyPort
}
// @from(Ln 205616, Col 0)
function VH4() {
    return mI?.linuxBridge?.httpSocketPath
}
// @from(Ln 205620, Col 0)
function kH4() {
    return mI?.linuxBridge?.socksSocketPath
}
// @from(Ln 205623, Col 0)
async function NH4() {
    if (!q9) return !1;
    if (e46) try {
        return await e46, !0
    } catch {
        return !1
    }
    return mI !== void 0
}
// @from(Ln 205632, Col 0)
async function Fl_(q, K, _, z) {
    let Y = nv(),
        A = (Z) => Z.map((G) => $s(G)).filter((G) => {
            if (nv() === "linux" && yf(G)) return x7(`[Sandbox] Skipping glob write pattern on Linux: ${G}`), !1;
            return !0
        }),
        O = A(_?.filesystem?.allowWrite ?? q9?.filesystem.allowWrite ?? []),
        w = {
            allowOnly: [...rs6(), ...O],
            denyWithinAllow: A(_?.filesystem?.denyWrite ?? q9?.filesystem.denyWrite ?? [])
        },
        $ = _?.filesystem?.denyRead ?? q9?.filesystem.denyRead ?? [],
        j = [];
    for (let Z of $) {
        let G = $s(Z);
        if (nv() === "linux" && yf(G)) j.push(...os6(Z));
        else j.push(G)
    }
    let H = _?.filesystem?.allowRead ?? q9?.filesystem.allowRead ?? [],
        J = [];
    for (let Z of H) {
        let G = $s(Z);
        if (nv() === "linux" && yf(G)) J.push(...os6(Z));
        else J.push(G)
    }
    let X = {
            denyOnly: j,
            allowWithinDeny: J
        },
        M = _?.network?.allowedDomains !== void 0 || q9?.network?.allowedDomains !== void 0,
        P = M,
        W = M;
    if (W) await NH4();
    let D = _?.allowPty ?? q9?.allowPty;
    switch (Y) {
        case "macos":
            return OH4({
                command: q,
                needsNetworkRestriction: P,
                httpProxyPort: W ? vH4() : void 0,
                socksProxyPort: W ? TH4() : void 0,
                readConfig: X,
                writeConfig: w,
                allowUnixSockets: WH4(),
                allowAllUnixSockets: HH4(),
                allowLocalBinding: DH4(),
                allowMachLookup: ZH4(),
                ignoreViolations: fH4(),
                allowPty: D,
                allowGitConfig: JH4(),
                enableWeakerNetworkIsolation: ul_(),
                binShell: K
            });
        case "linux":
            return qH4({
                command: q,
                needsNetworkRestriction: P,
                httpSocketPath: W ? VH4() : void 0,
                socksSocketPath: W ? kH4() : void 0,
                httpProxyPort: W ? mI?.httpProxyPort : void 0,
                socksProxyPort: W ? mI?.socksProxyPort : void 0,
                readConfig: X,
                writeConfig: w,
                enableWeakerNestedSandbox: GH4(),
                allowAllUnixSockets: HH4(),
                binShell: K,
                ripgrepConfig: ml_(),
                mandatoryDenySearchDepth: Bl_(),
                allowGitConfig: JH4(),
                seccompConfig: pl_(),
                abortSignal: z
            });
        default:
            throw Error(`Sandbox configuration is not supported on platform: ${Y}`)
    }
}
// @from(Ln 205709, Col 0)
function gl_() {
    return q9
}
// @from(Ln 205713, Col 0)
function Ul_(q) {
    q9 = structuredClone(q), qK6 = IB1(q.network.parentProxy), x7("Sandbox configuration updated")
}
// @from(Ln 205717, Col 0)
function Ql_() {
    WL8()
}
// @from(Ln 205720, Col 0)
async function qp1() {
    if (WL8({
            force: !0
        }), DL8) DL8(), DL8 = void 0;
    if (mI?.linuxBridge) {
        let {
            httpSocketPath: K,
            socksSocketPath: _,
            httpBridgeProcess: z,
            socksBridgeProcess: Y
        } = mI.linuxBridge, A = [];
        if (z.pid && !z.killed) try {
            process.kill(z.pid, "SIGTERM"), x7("Sent SIGTERM to HTTP bridge process"), A.push(new Promise((O) => {
                z.once("exit", () => {
                    x7("HTTP bridge process exited"), O()
                }), setTimeout(() => {
                    if (!z.killed) {
                        x7("HTTP bridge did not exit, forcing SIGKILL", {
                            level: "warn"
                        });
                        try {
                            if (z.pid) process.kill(z.pid, "SIGKILL")
                        } catch {}
                    }
                    O()
                }, 5000)
            }))
        } catch (O) {
            if (O.code !== "ESRCH") x7(`Error killing HTTP bridge: ${O}`, {
                level: "error"
            })
        }
        if (Y.pid && !Y.killed) try {
            process.kill(Y.pid, "SIGTERM"), x7("Sent SIGTERM to SOCKS bridge process"), A.push(new Promise((O) => {
                Y.once("exit", () => {
                    x7("SOCKS bridge process exited"), O()
                }), setTimeout(() => {
                    if (!Y.killed) {
                        x7("SOCKS bridge did not exit, forcing SIGKILL", {
                            level: "warn"
                        });
                        try {
                            if (Y.pid) process.kill(Y.pid, "SIGKILL")
                        } catch {}
                    }
                    O()
                }, 5000)
            }))
        } catch (O) {
            if (O.code !== "ESRCH") x7(`Error killing SOCKS bridge: ${O}`, {
                level: "error"
            })
        }
        if (await Promise.all(A), K) try {
            tB1.rmSync(K, {
                force: !0
            }), x7("Cleaned up HTTP socket")
        } catch (O) {
            x7(`HTTP socket cleanup error: ${O}`, {
                level: "error"
            })
        }
        if (_) try {
            tB1.rmSync(_, {
                force: !0
            }), x7("Cleaned up SOCKS socket")
        } catch (O) {
            x7(`SOCKS socket cleanup error: ${O}`, {
                level: "error"
            })
        }
    }
    let q = [];
    if (gE6) {
        let K = gE6,
            _ = new Promise((z) => {
                K.close((Y) => {
                    if (Y && Y.message !== "Server is not running.") x7(`Error closing HTTP proxy server: ${Y.message}`, {
                        level: "error"
                    });
                    z()
                })
            });
        q.push(_)
    }
    if (Oj6) {
        let K = Oj6.close().catch((_) => {
            x7(`Error closing SOCKS proxy server: ${_.message}`, {
                level: "error"
            })
        });
        q.push(K)
    }
    await Promise.all(q), gE6 = void 0, Oj6 = void 0, mI = void 0, e46 = void 0, qK6 = void 0
}
// @from(Ln 205816, Col 0)
function dl_() {
    return ZL8
}
// @from(Ln 205820, Col 0)
function cl_(q, K) {
    if (!q9) return K;
    let _ = ZL8.getViolationsForCommand(q);
    if (_.length === 0) return K;
    let z = K;
    z += sB1 + "<sandbox_violations>" + sB1;
    for (let Y of _) z += Y.line + sB1;
    return z += "</sandbox_violations>", z
}
// @from(Ln 205830, Col 0)
function ll_() {
    if (nv() !== "linux" || !q9) return [];
    let q = [],
        K = [...q9.filesystem.allowWrite, ...q9.filesystem.denyWrite];
    for (let _ of K) {
        let z = $s(_);
        if (yf(z)) q.push(_)
    }
    return q
}
// @from(Ln 205840, Col 4)
q9
// @from(Ln 205840, Col 8)
gE6
// @from(Ln 205840, Col 13)
Oj6
// @from(Ln 205840, Col 18)
mI
// @from(Ln 205840, Col 22)
e46
// @from(Ln 205840, Col 27)
jH4 = !1
// @from(Ln 205841, Col 4)
DL8
// @from(Ln 205841, Col 9)
qK6
// @from(Ln 205841, Col 14)
ZL8
// @from(Ln 205841, Col 19)
B2
// @from(Ln 205842, Col 4)
EH4 = L(() => {
    Tj4();
    Cj4();
    ns6();
    wL8();
    KH4();
    $H4();
    pE6();
    aB1();
    AL8();
    ZL8 = new FE6;
    B2 = {
        initialize: Sl_,
        isSupportedPlatform: MH4,
        isSandboxingEnabled: Cl_,
        checkDependencies: PH4,
        getFsReadConfig: bl_,
        getFsWriteConfig: Il_,
        getNetworkRestrictionConfig: xl_,
        getAllowUnixSockets: WH4,
        getAllowLocalBinding: DH4,
        getAllowMachLookup: ZH4,
        getIgnoreViolations: fH4,
        getEnableWeakerNestedSandbox: GH4,
        getProxyPort: vH4,
        getSocksProxyPort: TH4,
        getLinuxHttpSocketPath: VH4,
        getLinuxSocksSocketPath: kH4,
        waitForNetworkInitialization: NH4,
        wrapWithSandbox: Fl_,
        cleanupAfterCommand: Ql_,
        reset: qp1,
        getSandboxViolationStore: dl_,
        annotateStderrWithSandboxFailures: cl_,
        getLinuxGlobPatternWarnings: ll_,
        getConfig: gl_,
        updateConfig: Ul_
    }
})
// @from(Ln 205881, Col 4)
Hs = L(() => {
    s71();
    s71()
})
// @from(Ln 205885, Col 4)
Kp1
// @from(Ln 205885, Col 9)
fL8
// @from(Ln 205885, Col 14)
nl_
// @from(Ln 205885, Col 19)
il_
// @from(Ln 205885, Col 24)
LH4
// @from(Ln 205885, Col 29)
hH4
// @from(Ln 205885, Col 34)
RH4
// @from(Ln 205885, Col 39)
SH4
// @from(Ln 205885, Col 44)
rl_
// @from(Ln 205885, Col 49)
_p1
// @from(Ln 205886, Col 4)
CH4 = L(() => {
    Hs();
    Kp1 = g7.string().refine((q) => {
        if (q.includes("://") || q.includes("/") || q.includes(":")) return !1;
        if (q === "localhost") return !0;
        if (q.startsWith("*.")) {
            let K = q.slice(2);
            if (!K.includes(".") || K.startsWith(".") || K.endsWith(".")) return !1;
            let _ = K.split(".");
            return _.length >= 2 && _.every((z) => z.length > 0)
        }
        if (q.includes("*")) return !1;
        return q.includes(".") && !q.startsWith(".") && !q.endsWith(".")
    }, {
        message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
    }), fL8 = g7.string().min(1, "Path cannot be empty"), nl_ = g7.object({
        socketPath: g7.string().min(1).describe("Unix socket path to the MITM proxy"),
        domains: g7.array(Kp1).min(1).describe('Domains to route through the MITM proxy (e.g., ["api.example.com", "*.internal.org"])')
    }), il_ = g7.object({
        http: g7.string().url().optional().describe("Upstream proxy URL for plain HTTP traffic"),
        https: g7.string().url().optional().describe("Upstream proxy URL for HTTPS/CONNECT traffic (falls back to http if unset)"),
        noProxy: g7.string().optional().describe("Comma-separated NO_PROXY list (hostname suffixes and CIDR ranges). Matching destinations connect directly instead of via the parent proxy.")
    }), LH4 = g7.object({
        allowedDomains: g7.array(Kp1).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
        deniedDomains: g7.array(Kp1).describe("List of denied domains"),
        allowUnixSockets: g7.array(g7.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: g7.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: g7.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
        allowMachLookup: g7.array(g7.string().refine((q) => {
            return !(q.endsWith("*") ? q.slice(0, -1) : q).includes("*")
        }, {
            message: 'Wildcards are only allowed as a single trailing "*" (e.g., "com.example.*" or "*" for all services).'
        })).optional().describe('macOS only: Additional XPC/Mach service names to allow looking up. Supports trailing-wildcard prefix matching (e.g., "2BUA8C4S2C.com.1password.*"). Needed for tools like 1Password CLI, Playwright, or the iOS Simulator that communicate via XPC.'),
        httpProxyPort: g7.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
        socksProxyPort: g7.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering."),
        mitmProxy: nl_.optional().describe("Optional MITM proxy configuration. Routes matching domains through an upstream proxy via Unix socket while SRT still handles allow/deny filtering."),
        parentProxy: il_.optional().describe("Upstream HTTP proxy for outbound connections. When set, SRT's proxy tunnels non-mitmProxy traffic through this parent instead of connecting directly. Falls back to HTTP_PROXY/HTTPS_PROXY/NO_PROXY env vars if unset.")
    }), hH4 = g7.object({
        denyRead: g7.array(fL8).describe("Paths denied for reading"),
        allowRead: g7.array(fL8).optional().describe("Paths to re-allow reading within denied regions (takes precedence over denyRead). Use with denyRead to deny a broad region then allow back specific subdirectories."),
        allowWrite: g7.array(fL8).describe("Paths allowed for writing"),
        denyWrite: g7.array(fL8).describe("Paths denied for writing (takes precedence over allowWrite)"),
        allowGitConfig: g7.boolean().optional().describe("Allow writes to .git/config files (default: false). Enables git remote URL updates while keeping .git/hooks protected.")
    }), RH4 = g7.record(g7.string(), g7.array(g7.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), SH4 = g7.object({
        command: g7.string().describe("The ripgrep command to execute"),
        args: g7.array(g7.string()).optional().describe("Additional arguments to pass before ripgrep args"),
        argv0: g7.string().optional().describe("Override argv[0] when spawning (for multicall binaries that dispatch on argv[0])")
    }), rl_ = g7.object({
        applyPath: g7.string().optional().describe("Path to the apply-seccomp binary"),
        argv0: g7.string().optional().describe("Invoke apply-seccomp as a multicall binary that dispatches on the ARGV0 environment variable. When set, applyPath is used verbatim (no existence check) and the invocation inside bwrap is prefixed with ARGV0=<this value>. The caller is responsible for ensuring applyPath resolves inside the bwrap namespace and that the target binary implements the apply-seccomp interface when ARGV0 matches.")
    }), _p1 = g7.object({
        network: LH4.describe("Network restrictions configuration"),
        filesystem: hH4.describe("Filesystem restrictions configuration"),
        ignoreViolations: RH4.optional().describe("Optional configuration for ignoring specific violations"),
        enableWeakerNestedSandbox: g7.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
        enableWeakerNetworkIsolation: g7.boolean().optional().describe("Enable weaker network isolation to allow access to com.apple.trustd.agent (macOS only). This is needed for Go programs (gh, gcloud, terraform, kubectl, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. Enabling this opens a potential data exfiltration vector through the trustd service. Only enable if you need Go TLS verification."),
        ripgrep: SH4.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
        mandatoryDenySearchDepth: g7.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance."),
        allowPty: g7.boolean().optional().describe("Allow pseudo-terminal (pty) operations (macOS only)"),
        seccomp: rl_.optional().describe("Custom seccomp binary paths (Linux only).")
    })
})
// @from(Ln 205948, Col 4)
bH4 = L(() => {
    EH4();
    aB1();
    CH4();
    pE6();
    wL8()
})
// @from(Ln 205960, Col 0)
function tl_(q) {
    let K = q?.stabilityThreshold ?? uH4,
        _ = q?.pollInterval ?? mH4,
        z = q?.mdmPollInterval ?? al_,
        Y = q?.deletionGrace ?? sl_,
        A = l5(),
        O = RX8.subscribe((N) => A.emit(N)),
        w = null,
        $ = null,
        j = null,
        H = !1,
        J = !1,
        X = new Map,
        M = null;
    async function P() {
        if (nK()) return;
        if (H || J) return;
        H = !0, v(), M = eq(W);
        let {
            dirs: N,
            settingsFiles: R,
            dropInDir: h
        } = await el_();
        if (J) return;
        if (N.length === 0) return;
        E(`Watching for changes in setting files ${[...R].join(", ")}...${h?` and drop-in directory ${h}`:""}`), w = oa.watch(N, {
            persistent: !0,
            ignoreInitial: !0,
            depth: 0,
            awaitWriteFinish: {
                stabilityThreshold: K,
                pollInterval: _
            },
            ignored: (C, x) => {
                if (x && !x.isFile() && !x.isDirectory()) return !0;
                if (C.split(/[/\\]/).some((m) => m === ".git")) return !0;
                if (!x || x.isDirectory()) return !1;
                let B = _K6.normalize(C);
                if (R.has(B)) return !1;
                if (h && B.startsWith(h + _K6.sep) && B.endsWith(".json")) return !1;
                return !0
            },
            ignorePermissionErrors: !0,
            usePolling: !1,
            atomic: !0
        }), w.on("change", D), w.on("unlink", G), w.on("add", Z)
    }

    function W() {
        if (J = !0, M) M(), M = null;
        if ($) clearInterval($), $ = null;
        for (let R of X.values()) clearTimeout(R);
        X.clear(), j = null, QF7(), O(), A.clear();
        let N = w;
        return w = null, N ? N.close() : Promise.resolve()
    }

    function D(N) {
        let R = zp1(N);
        if (!R) return;
        let h = X.get(N);
        if (h) clearTimeout(h), X.delete(N), E(`Cancelled pending deletion of ${N} — file was recreated`);
        if (UF7(N, ol_)) return;
        E(`Detected change to ${N}`), KK6(xH4(R), N).then((C) => {
            if (UE6(C)) {
                E(`ConfigChange hook blocked change to ${N}`);
                return
            }
            V(R)
        })
    }

    function Z(N) {
        if (!zp1(N)) return;
        let h = X.get(N);
        if (h) clearTimeout(h), X.delete(N), E(`Cancelled pending deletion of ${N} — file was re-added`);
        D(N)
    }

    function G(N) {
        let R = zp1(N);
        if (!R) return;
        if (E(`Detected deletion of ${N}`), X.has(N)) return;
        let h = setTimeout(f, Y, N, R);
        X.set(N, h)
    }

    function f(N, R) {
        X.delete(N), KK6(xH4(R), N).then((h) => {
            if (UE6(h)) {
                E(`ConfigChange hook blocked deletion of ${N}`);
                return
            }
            V(R)
        })
    }

    function v() {
        let N = wG6(),
            R = $G6();
        j = I6({
            mdm: N.settings,
            hkcu: R.settings
        }), $ = setInterval(() => {
            if (J) return;
            (async () => {
                try {
                    let {
                        mdm: h,
                        hkcu: C
                    } = await YU7();
                    if (J) return;
                    let x = I6({
                        mdm: h.settings,
                        hkcu: C.settings
                    });
                    if (x !== j) j = x, zU7(h, C), E("Detected MDM settings change via poll"), V("policySettings")
                } catch (h) {
                    E(`MDM poll error: ${b6(h)}`)
                }
            })()
        }, z), $.unref()
    }

    function V(N) {
        u0();
        try {
            A.emit(N)
        } catch (R) {
            for (let h of R instanceof AggregateError ? R.errors : [R]) j6(h)
        }
    }

    function k(N) {
        E(`Programmatic settings change notification for ${N}`), V(N)
    }
    return {
        initialize: P,
        dispose: W,
        subscribe: A.subscribe,
        notifyChange: k
    }
}
// @from(Ln 206103, Col 0)
async function el_() {
    let q = new Map,
        K = new Set;
    for (let A of wv) {
        if (A === "flagSettings") continue;
        let O = Ww(A);
        if (!O) continue;
        let w = _K6.dirname(O);
        if (!q.has(w)) q.set(w, new Set);
        q.get(w).add(O);
        try {
            if ((await IH4(O)).isFile()) K.add(w)
        } catch {}
    }
    let _ = new Set;
    for (let A of K) {
        let O = q.get(A);
        if (O)
            for (let w of O) _.add(w)
    }
    let z = null,
        Y = ZU();
    try {
        if ((await IH4(Y)).isDirectory()) K.add(Y), z = Y
    } catch {}
    return {
        dirs: [...K],
        settingsFiles: _,
        dropInDir: z
    }
}
// @from(Ln 206135, Col 0)
function xH4(q) {
    switch (q) {
        case "userSettings":
            return "user_settings";
        case "projectSettings":
            return "project_settings";
        case "localSettings":
            return "local_settings";
        case "flagSettings":
        case "policySettings":
            return "policy_settings"
    }
}
// @from(Ln 206149, Col 0)
function zp1(q) {
    let K = _K6.normalize(q),
        _ = ZU();
    if (K.startsWith(_ + _K6.sep)) return "policySettings";
    return wv.find((z) => Ww(z) === K)
}
// @from(Ln 206155, Col 4)
uH4 = 1000
// @from(Ln 206156, Col 4)
mH4 = 500
// @from(Ln 206157, Col 4)
ol_ = 5000
// @from(Ln 206158, Col 4)
al_ = 1800000
// @from(Ln 206159, Col 4)
sl_
// @from(Ln 206159, Col 9)
_y
// @from(Ln 206160, Col 4)
zK6 = L(() => {
    AE6();
    y8();
    R9();
    K8();
    m8();
    K9();
    U8();
    nH();
    e8();
    aY();
    _X8();
    Rm();
    hX8();
    a1();
    Li();
    mO1();
    sl_ = uH4 + mH4 + 200;
    _y = tl_()
})
// @from(Ln 206180, Col 4)
QH4 = {}
// @from(Ln 206203, Col 0)
function xP() {
    if (GL8 === void 0) GL8 = S6(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB);
    return GL8
}
// @from(Ln 206208, Col 0)
function Kn_() {
    if (xP()) return !0;
    if (c5(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) return !1;
    return process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent"
}
// @from(Ln 206214, Col 0)
function Js() {
    if (vL8 !== void 0) return vL8;
    return process.platform === "linux" && !!rN("bwrap")
}
// @from(Ln 206218, Col 0)
async function wp1() {
    if (!xP()) return;
    let q = BH4(),
        K = Y7(),
        _ = process.env.GITHUB_ENV ? Yp1(process.env.GITHUB_ENV) : void 0,
        z = process.env.GITHUB_WORKSPACE;
    if (vL8 = process.platform === "linux" && !!rN("bwrap"), kR = {
            home: q,
            originalCwd: K,
            claudeConfigDir: process.env.CLAUDE_CONFIG_DIR,
            runnerFileCommandsDir: _,
            workspace: z,
            GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH,
            GITHUB_EVENT_PATH: process.env.GITHUB_EVENT_PATH
        }, kR.pathDirs = (process.env.PATH ?? "").split(":").map((j) => j ? as6.normalize(j).replace(/\/+$/, "") : j).filter((j) => j && pH4.some((H) => j.startsWith(`${H}/`))), FH4(), process.platform !== "linux") return;
    if (!rN("bwrap")) throw Error("bubblewrap is required for subprocess env scrubbing and isolation. Install with: sudo apt-get install -y bubblewrap, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).");
    let {
        appendFile: Y,
        mkdir: A,
        open: O
    } = await import("fs/promises"), {
        join: w
    } = await import("path");
    await A(w(z2(), `claude-${process.getuid?.()??0}`), {
        recursive: !0
    }).catch(() => {});
    for (let j of [`${q}/.gitconfig`, `${q}/.bash_profile`, `${q}/.bashrc`, `${q}/.bash_aliases`, `${q}/.profile`, `${q}/.zshrc`, `${q}/.bunfig.toml`, `${q}/.netrc`, `${q}/.npmrc`, `${q}/.yarnrc`, `${q}/.yarnrc.yml`, `${K}/.npmrc`, `${K}/.yarnrc`, `${K}/.yarnrc.yml`, `${K}/bunfig.toml`, `${K}/package.json`, `${K}/.gitmodules`, `${K}/package-lock.json`, `${K}/yarn.lock`, `${K}/pnpm-lock.yaml`, "/tmp/inline-comments-buffer.jsonl", ...Ap1.map((H) => `${K}/${H}`)]) try {
        await A(Yp1(j), {
            recursive: !0
        }), await (await O(j, "a")).close()
    } catch {}
    for (let j of [`${q}/.config/gh`, `${q}/.config/git`, `${q}/.config/pip`, `${q}/.pip`, `${K}/.claude/commands`, `${K}/.claude/agents`, `${K}/node_modules/.bin`, ..._ ? [_] : [], ...kR.pathDirs]) try {
        await A(j, {
            recursive: !0
        })
    } catch {}
    if (z && as6.resolve(z) !== as6.resolve(K)) {
        await A(`${z}/.git/hooks`).catch(() => {}), await A(`${z}/.git/modules`).catch(() => {}), await A(`${z}/.git/info`).catch(() => {}), await A(`${z}/.github`, {
            recursive: !0
        }).catch(() => {});
        for (let j of [`${z}/.git/config`, `${z}/.git/info/exclude`, `${z}/.gitmodules`]) try {
            await (await O(j, "a")).close()
        } catch {}
    }
    let $ = ["bunfig.toml", "package.json", ".npmrc", ".yarnrc", ".yarnrc.yml", ".gitmodules", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", ...Ap1];
    await A(`${K}/.git/info`).catch(() => {}), await A(`${K}/.git/modules`).catch(() => {});
    try {
        await Y(`${K}/.git/info/exclude`, `
# claude-code scrub-mode stubs
${$.map((j)=>`/${j}`).join(`
`)}
`)
    } catch {}
}
// @from(Ln 206273, Col 0)
function FH4() {
    if (YK6 !== void 0) return;
    let q = process.env.CLAUDE_CODE_SCRIPT_CAPS;
    if (!q) {
        YK6 = null;
        return
    }
    try {
        let K = n8(q);
        if (K && typeof K === "object" && !Array.isArray(K)) {
            let _ = QC(K, (z, Y) => typeof z === "number" && Number.isFinite(z) && Y.trim().length > 0);
            YK6 = Object.keys(_).length > 0 ? _ : null
        } else YK6 = null
    } catch {
        YK6 = null
    }
}
// @from(Ln 206291, Col 0)
function gH4() {
    Op1.clear(), YK6 = void 0
}
// @from(Ln 206295, Col 0)
function _n_() {
    GL8 = void 0, vL8 = void 0, kR = void 0, gH4()
}
// @from(Ln 206299, Col 0)
function zn_(q) {
    kR = q
}
// @from(Ln 206303, Col 0)
function $p1(q) {
    if (!xP()) return;
    if (FH4(), !YK6) return;
    let K = YK6;
    for (let [_, z] of Object.entries(K)) {
        let Y = q.split(_).length - 1;
        if (Y > 0) {
            let A = (Op1.get(_) ?? 0) + Y;
            if (Op1.set(_, A), A > z) throw Error(`Script call limit exceeded: ${_} has been called ${A} times (cap: ${z}). This limit prevents data exfiltration via repeated write operations in untrusted-input workflows.`)
        }
    }
}
// @from(Ln 206316, Col 0)
function An_(q) {
    UH4 = q
}
// @from(Ln 206320, Col 0)
function TL8() {
    return UH4?.() ?? {}
}
// @from(Ln 206324, Col 0)
function Dk() {
    let q = TL8(),
        K = Object.keys(q).length > 0,
        _ = Kn_();
    if (!K && !_ && !0) return process.env;
    let Y = {
        ...process.env,
        ...q
    };
    if (!_) return Y;
    for (let A of Yn_) delete Y[A], delete Y[`INPUT_${A}`];
    return Y
}
// @from(Ln 206338, Col 0)
function jp1() {
    let q = process.env.CLAUDE_CODE_MCP_ALLOWLIST_ENV;
    if (S6(q)) return !0;
    if (c5(q)) return !1;
    return process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent"
}
// @from(Ln 206345, Col 0)
function Hp1() {
    let q = kR?.home ?? BH4(),
        K = kR?.originalCwd ?? Y7(),
        _ = kR?.GITHUB_ACTION_PATH ?? process.env.GITHUB_ACTION_PATH,
        z = kR?.runnerFileCommandsDir ?? (process.env.GITHUB_ENV ? Yp1(process.env.GITHUB_ENV) : void 0),
        Y = kR?.workspace ?? process.env.GITHUB_WORKSPACE,
        A = Y && as6.resolve(Y) !== as6.resolve(K) ? [`${Y}/.git/hooks`, `${Y}/.git/config`, `${Y}/.git/modules`, `${Y}/.git/info/exclude`, `${Y}/.gitmodules`, `${Y}/.github`] : [];
    return {
        filesystem: {
            allowWrite: pH4,
            denyRead: ["/run/docker.sock", "/run/containerd/containerd.sock", "/run/podman/podman.sock", "/run/buildkit/buildkitd.sock", "/run/dbus", "/run/user"],
            denyWrite: [`${q}/.bash_profile`, `${q}/.bashrc`, `${q}/.bash_aliases`, `${q}/.bash_login`, `${q}/.bash_logout`, `${q}/.profile`, `${q}/.zshrc`, `${q}/.zprofile`, `${q}/.zshenv`, `${q}/.zlogin`, `${q}/.zlogout`, `${q}/.claude`, `${q}/.claude.json`, kR?.claudeConfigDir ?? process.env.CLAUDE_CONFIG_DIR, `${q}/.gitconfig`, `${q}/.config/git`, `${q}/.bunfig.toml`, `${K}/bunfig.toml`, `${K}/package.json`, ...Ap1.map((O) => `${K}/${O}`), `${q}/.npmrc`, `${K}/.npmrc`, `${q}/.yarnrc`, `${q}/.yarnrc.yml`, `${K}/.yarnrc`, `${K}/.yarnrc.yml`, `${q}/.config/pip`, `${q}/.pip`, `${K}/package-lock.json`, `${K}/yarn.lock`, `${K}/pnpm-lock.yaml`, `${K}/node_modules/.bin`, `${K}/.git/modules`, `${K}/scripts`, `${K}/.claude`, `${K}/.github`, `${q}/.local/bin`, `${q}/runners`, `${q}/actions-runner`, "/tmp/inline-comments-buffer.jsonl", ...kR?.pathDirs ?? [], z, _, _ && _.includes("/_actions/") ? _.slice(0, _.indexOf("/_actions/") + 9) : void 0, kR?.GITHUB_EVENT_PATH ?? process.env.GITHUB_EVENT_PATH, `${q}/.config/gh`, `${q}/.netrc`, `${q}/.ssh`, `${K}/.git/hooks`, `${K}/.git/config`, `${K}/.gitmodules`, `${K}/.git/info/exclude`, ...A].filter((O) => !!O)
        }
    }
}
// @from(Ln 206360, Col 4)
GL8
// @from(Ln 206360, Col 9)
Ap1
// @from(Ln 206360, Col 14)
pH4
// @from(Ln 206360, Col 19)
vL8
// @from(Ln 206360, Col 24)
kR
// @from(Ln 206360, Col 28)
Op1
// @from(Ln 206360, Col 33)
YK6
// @from(Ln 206360, Col 38)
Yn_
// @from(Ln 206360, Col 43)
UH4
// @from(Ln 206361, Col 4)
zy = L(() => {
    v16();
    y8();
    Q8();
    e8();
    cW();
    n0();
    Ap1 = [".env", ".env.local", ".env.development", ".env.development.local", ".env.test", ".env.test.local", ".env.production", ".env.production.local"], pH4 = ["home", "root", "tmp", "var", "opt", "run", "mnt"].map((q) => `/${q}`);
    Op1 = new Map;
    Yn_ = ["ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY", "ANTHROPIC_BEDROCK_MANTLE_API_KEY", "ANTHROPIC_CUSTOM_HEADERS", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "AWS_BEARER_TOKEN_BEDROCK", "GOOGLE_APPLICATION_CREDENTIALS", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "ACTIONS_ID_TOKEN_REQUEST_TOKEN", "ACTIONS_ID_TOKEN_REQUEST_URL", "ACTIONS_RUNTIME_TOKEN", "ACTIONS_RUNTIME_URL", "ALL_INPUTS", "OVERRIDE_GITHUB_TOKEN", "DEFAULT_WORKFLOW_TOKEN", "SSH_SIGNING_KEY"]
})
// @from(Ln 206372, Col 4)
J4 = "Edit"
// @from(Ln 206373, Col 4)
VL8 = "/.claude/**"
// @from(Ln 206374, Col 4)
kL8 = "~/.claude/**"
// @from(Ln 206375, Col 4)
NL8 = "File has not been read yet. Read it first before writing to it."
// @from(Ln 206376, Col 4)
EL8 = "File content has changed since it was last read. This commonly happens when a linter or formatter run via Bash rewrites the file. Call Read on this file to refresh, then retry the edit."
// @from(Ln 206378, Col 0)
function cH4(q, K, _) {
    return `
Web page content:
---
${q}
---

${K}

${_?"Provide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed.":`Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics.`}
`
}
// @from(Ln 206394, Col 4)
PH = "WebFetch"
// @from(Ln 206395, Col 4)
dH4 = `
- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content

Usage notes:
  - IMPORTANT: If an MCP-provided web fetch tool is available, prefer using that tool instead of this one, as it may have fewer restrictions.
  - The URL must be a fully-formed valid URL
  - HTTP URLs will be automatically upgraded to HTTPS
  - The prompt should describe what information you want to extract from the page
  - This tool is read-only and does not modify any files
  - Results may be summarized if the content is very large
  - Includes a self-cleaning 15-minute cache for faster responses when repeatedly accessing the same URL
  - When a URL redirects to a different host, the tool will inform you and provide the redirect URL in a special format. You should then make a new WebFetch request with the redirect URL to fetch the content.
  - For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).
`
// @from(Ln 206415, Col 0)
function Jp1(q, K) {
    return {
        cmd: rN(q) ?? q,
        args: K
    }
}
// @from(Ln 206421, Col 4)
lH4 = L(() => {
    n0()
})
// @from(Ln 206436, Col 0)
function wj6() {
    let q = ts6();
    return {
        rgPath: q.command,
        rgArgs: q.args,
        argv0: q.argv0
    }
}
// @from(Ln 206445, Col 0)
function Xn_(q) {
    return q.includes("os error 11") || q.includes("Resource temporarily unavailable")
}
// @from(Ln 206449, Col 0)
function nH4(q, K, _, z, Y = !1) {
    let {
        rgPath: A,
        rgArgs: O,
        argv0: w
    } = wj6(), $ = Y ? ["-j", "1"] : [], j = [...O, ...$, ...q, K], H = y1() === "wsl" ? 60000 : 20000, J = parseInt(process.env.CLAUDE_CODE_GLOB_TIMEOUT_SECONDS || "", 10) || 0, X = J > 0 ? J * 1000 : H;
    if (w) {
        let M = rH4(A, j, {
                argv0: w,
                cwd: b8(),
                signal: _,
                windowsHide: !0
            }),
            P = "",
            W = "",
            D = !1,
            Z = !1;
        M.stdout?.on("data", (V) => {
            if (!D) {
                if (P += V.toString(), P.length > ss6) P = P.slice(0, ss6), D = !0
            }
        }), M.stderr?.on("data", (V) => {
            if (!Z) {
                if (W += V.toString(), W.length > ss6) W = W.slice(0, ss6), Z = !0
            }
        });
        let G, f = setTimeout(() => {
                if (process.platform === "win32") M.kill();
                else M.kill("SIGTERM"), G = setTimeout((V) => V.kill("SIGKILL"), 5000, M)
            }, X),
            v = !1;
        return M.on("close", (V, k) => {
            if (v) return;
            if (v = !0, clearTimeout(f), clearTimeout(G), V === 0 || V === 1) z(null, P, W);
            else {
                let N = Error(`ripgrep exited with code ${V}`);
                N.code = V ?? void 0, N.signal = k ?? void 0, z(N, P, W)
            }
        }), M.on("error", (V) => {
            if (v) return;
            if (v = !0, clearTimeout(f), clearTimeout(G), V.code === "ENOENT") tH4();
            z(V, P, W)
        }), M
    }
    return wn_(A, j, {
        cwd: b8(),
        maxBuffer: ss6,
        signal: _,
        timeout: X,
        killSignal: process.platform === "win32" ? void 0 : "SIGKILL"
    }, z)
}
// @from(Ln 206501, Col 0)
async function Mn_(q, K, _) {
    await eH4();
    let {
        rgPath: z,
        rgArgs: Y,
        argv0: A
    } = wj6();
    return new Promise((O, w) => {
        let $ = rH4(z, [...Y, ...q, K], {
                argv0: A,
                cwd: b8(),
                signal: _,
                windowsHide: !0,
                stdio: ["ignore", "pipe", "ignore"]
            }),
            j = 0;
        $.stdout?.on("data", (J) => {
            j += tz(J, `
`)
        });
        let H = !1;
        $.on("close", (J) => {
            if (H) return;
            if (H = !0, J === 0 || J === 1) O(j);
            else w(Error(`rg --files exited ${J}`))
        }), $.on("error", (J) => {
            if (H) return;
            if (H = !0, J.code === "ENOENT" && A) tH4();
            w(J)
        })
    })
}
// @from(Ln 206533, Col 0)
async function dd(q, K, _) {
    return await eH4(), sH4().catch((z) => {
        j6(z)
    }), new Promise((z, Y) => {
        let A = (O, w, $, j) => {
            if (!O) {
                z(w.trim().split(`
`).map((W) => W.replace(/\r$/, "")).filter(Boolean));
                return
            }
            if (O.code === 1) {
                z([]);
                return
            }
            if (["ENOENT", "EACCES", "EPERM"].includes(O.code)) {
                Y(O);
                return
            }
            if (!j && Xn_($)) {
                E("rg EAGAIN error detected, retrying with single-threaded mode (-j 1)"), d("tengu_ripgrep_eagain_retry", {}), nH4(q, K, _, (W, D, Z) => {
                    A(W, D, Z, !0)
                }, !0);
                return
            }
            let J = w && w.trim().length > 0,
                X = O.signal === "SIGTERM" || O.signal === "SIGKILL" || O.code === "ABORT_ERR",
                M = O.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
                P = [];
            if (J) {
                if (P = w.trim().split(`
`).map((W) => W.replace(/\r$/, "")).filter(Boolean), P.length > 0 && (X || M)) P = P.slice(0, -1)
            }
            if (E(`rg error (signal=${O.signal}, code=${O.code}, stderr: ${$}), ${P.length} results`), O.code !== 2 && O.code !== "ABORT_ERR") j6(O);
            if (X && P.length === 0) {
                Y(new oH4(`Ripgrep search timed out after ${y1()==="wsl"?60:20} seconds. The search may have matched files but did not complete in time. Try searching a more specific path or pattern.`, P));
                return
            }
            z(P)
        };
        nH4(q, K, _, (O, w, $) => {
            A(O, w, $, !1)
        })
    })
}
// @from(Ln 206578, Col 0)
function aH4() {
    let q = ts6();
    return {
        mode: q.mode,
        path: q.command,
        working: QE6?.working ?? null
    }
}
// @from(Ln 206587, Col 0)
function tH4() {
    if (ts6.cache?.clear?.(), QE6?.working !== !1) sH4.cache?.clear?.(), QE6 = null
}
// @from(Ln 206590, Col 0)
async function eH4() {
    if (process.platform !== "darwin" || iH4) return;
    iH4 = !0;
    let q = ts6();
    if (q.mode !== "builtin") return;
    let K = q.command;
    if (!(await w1("codesign", ["-vv", "-d", K], {
            preserveOutputOnError: !1
        })).stdout.split(`
`).find((Y) => Y.includes("linker-signed"))) return;
    try {
        let Y = await w1("codesign", ["--sign", "-", "--force", "--preserve-metadata=entitlements,requirements,flags,runtime", K]);
        if (Y.code !== 0) j6(Error(`Failed to sign ripgrep: ${Y.stdout} ${Y.stderr}`));
        let A = await w1("xattr", ["-d", "com.apple.quarantine", K]);
        if (A.code !== 0) j6(Error(`Failed to remove quarantine: ${A.stdout} ${A.stderr}`))
    } catch (Y) {
        j6(Y)
    }
}
// @from(Ln 206609, Col 4)
Hn_
// @from(Ln 206609, Col 9)
Jn_
// @from(Ln 206609, Col 14)
ts6
// @from(Ln 206609, Col 19)
ss6 = 20000000
// @from(Ln 206610, Col 4)
oH4
// @from(Ln 206610, Col 9)
yL8
// @from(Ln 206610, Col 14)
QE6 = null
// @from(Ln 206611, Col 4)
sH4
// @from(Ln 206611, Col 9)
iH4 = !1
// @from(Ln 206612, Col 4)
BI = L(() => {
    U4();
    C8();
    n7();
    K8();
    Q8();
    Q4();
    lH4();
    U8();
    NK();
    n0();
    Hn_ = jn_(import.meta.url), Jn_ = AK6.join(Hn_, "../"), ts6 = P1(() => {
        if (c5(process.env.USE_BUILTIN_RIPGREP)) {
            let {
                cmd: z
            } = Jp1("rg", []);
            if (z !== "rg") return {
                mode: "system",
                command: z,
                args: []
            }
        }
        if (v$()) {
            let z = {
                mode: "embedded",
                command: process.execPath,
                args: ["--no-config"],
                argv0: "rg"
            };
            if (rN(process.execPath)) return z;
            let {
                cmd: Y
            } = Jp1("rg", []);
            if (Y !== "rg") return {
                mode: "system",
                command: Y,
                args: []
            };
            return z
        }
        let K = AK6.resolve(Jn_, "vendor", "ripgrep");
        return {
            mode: "builtin",
            command: process.platform === "win32" ? AK6.resolve(K, `${process.arch}-win32`, "rg.exe") : AK6.resolve(K, `${process.arch}-${process.platform}`, "rg"),
            args: []
        }
    });
    oH4 = class oH4 extends Error {
        partialResults;
        constructor(q, K) {
            super(q);
            this.partialResults = K;
            this.name = "RipgrepTimeoutError"
        }
    };
    yL8 = P1(async (q, K, _ = []) => {
        if (AK6.resolve(q) === AK6.resolve($n_())) return;
        try {
            let z, Y = null;
            {
                let w = ["--files", "--hidden"];
                _.forEach(($) => {
                    w.push("--glob", `!${$}`)
                }), z = await Mn_(w, q, K)
            }
            if (z === 0) return 0;
            let A = Math.floor(Math.log10(z)),
                O = Math.pow(10, A);
            return Math.round(z / O) * O
        } catch (z) {
            if (z?.name !== "AbortError") j6(z)
        }
    }, (q, K, _ = []) => `${q}|${_.join(",")}`);
    sH4 = P1(async () => {
        if (QE6 !== null) return;
        let q = ts6();
        try {
            let K;
            if (q.argv0) {
                let z = Bun.spawn([q.command, "--version"], {
                        argv0: q.argv0,
                        cwd: b8(),
                        stderr: "ignore",
                        stdout: "pipe"
                    }),
                    [Y, A] = await Promise.all([z.stdout.text(), z.exited]);
                K = {
                    code: A,
                    stdout: Y
                }
            } else K = await w1(q.command, [...q.args, "--version"], {
                timeout: 5000
            });
            let _ = K.code === 0 && !!K.stdout && K.stdout.startsWith("ripgrep ");
            QE6 = {
                working: _,
                lastTested: Date.now(),
                config: q
            }, E(`Ripgrep first use test: ${_?"PASSED":"FAILED"} (mode=${q.mode}, path=${q.command})`), d("tengu_ripgrep_availability", {
                working: _ ? 1 : 0,
                using_system: q.mode === "system" ? 1 : 0
            })
        } catch (K) {
            QE6 = {
                working: !1,
                lastTested: Date.now(),
                config: q
            }, j6(K)
        }
    })
})
// @from(Ln 206727, Col 0)
function qJ4() {
    return process.platform === "linux" && v$()
}
// @from(Ln 206730, Col 0)
async function KJ4() {
    return (await Wn_())?.fd
}
// @from(Ln 206734, Col 0)
function _J4() {
    if (!qJ4()) return;
    return {
        applyPath: `/proc/self/fd/${Xp1}`,
        argv0: "apply-seccomp"
    }
}
// @from(Ln 206741, Col 4)
Xp1 = 3
// @from(Ln 206742, Col 4)
Wn_
// @from(Ln 206743, Col 4)
Mp1 = L(() => {
    U4();
    K8();
    Wn_ = P1(async () => {
        if (!qJ4()) return;
        try {
            return await Pn_("/proc/self/exe", "r")
        } catch (q) {
            E(`seccomp: failed to open /proc/self/exe: ${q}`);
            return
        }
    })
})
// @from(Ln 206756, Col 4)
zJ4 = {}
// @from(Ln 206780, Col 0)
function dE6(q) {
    let K = q.match(/^([^(]+)\(([^)]+)\)$/);
    if (!K) return {
        toolName: q
    };
    let _ = K[1],
        z = K[2];
    if (!_ || !z) return {
        toolName: q
    };
    return {
        toolName: _,
        ruleContent: z
    }
}
// @from(Ln 206796, Col 0)
function vn_(q) {
    return q.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Ln 206800, Col 0)
function LL8(q, K) {
    if (q.startsWith("//")) return q.slice(1);
    if (q.startsWith("/") && !q.startsWith("//")) {
        let _ = d16(K);
        return $j6(_, q.slice(1))
    }
    return q
}
// @from(Ln 206809, Col 0)
function es6(q, K) {
    if (q.startsWith("//")) return q.slice(1);
    return Wq(q, d16(K))
}
// @from(Ln 206814, Col 0)
function jj6() {
    return E1("policySettings")?.sandbox?.network?.allowManagedDomainsOnly === !0
}
// @from(Ln 206818, Col 0)
function Tn_() {
    return E1("policySettings")?.sandbox?.filesystem?.allowManagedReadPathsOnly === !0
}
// @from(Ln 206822, Col 0)
function hL8(q) {
    let K = q.permissions || {},
        _ = [],
        z = [];
    if (jj6()) {
        let f = E1("policySettings");
        for (let v of f?.sandbox?.network?.allowedDomains || []) _.push(v);
        for (let v of f?.permissions?.allow || []) {
            let V = dE6(v);
            if (V.toolName === PH && V.ruleContent?.startsWith("domain:")) _.push(V.ruleContent.substring(7))
        }
    } else {
        for (let f of q.sandbox?.network?.allowedDomains || []) _.push(f);
        for (let f of K.allow || []) {
            let v = dE6(f);
            if (v.toolName === PH && v.ruleContent?.startsWith("domain:")) _.push(v.ruleContent.substring(7))
        }
    }
    for (let f of K.deny || []) {
        let v = dE6(f);
        if (v.toolName === PH && v.ruleContent?.startsWith("domain:")) z.push(v.ruleContent.substring(7))
    }
    let Y = [".", iv()],
        A = [],
        O = [],
        w = [],
        $ = wv.map((f) => Ww(f)).filter((f) => f !== void 0);
    A.push(...$), A.push(ZU());
    let j = tu(),
        H = Y7();
    if (j !== H) A.push($j6(j, ".claude", "settings.json")), A.push($j6(j, ".claude", "settings.local.json"));
    if (A.push($j6(H, ".claude", "skills")), j !== H) A.push($j6(j, ".claude", "skills"));
    RL8.length = 0;
    let J = ["HEAD", "objects", "refs", "hooks", "config"];
    for (let f of j === H ? [H] : [H, j])
        for (let v of J) {
            let V = $j6(f, v);
            try {
                Zn_(V), A.push(V)
            } catch {
                RL8.push(V)
            }
        }
    if (cE6 && cE6 !== j) Y.push(cE6);
    let X = new Set([...q.permissions?.additionalDirectories || [], ...tG()]);
    Y.push(...X);
    for (let f of wv) {
        let v = E1(f);
        if (v?.permissions) {
            for (let k of v.permissions.allow || []) {
                let N = dE6(k);
                if (N.toolName === J4 && N.ruleContent) Y.push(LL8(N.ruleContent, f))
            }
            for (let k of v.permissions.deny || []) {
                let N = dE6(k);
                if (N.toolName === J4 && N.ruleContent) A.push(LL8(N.ruleContent, f));
                if (N.toolName === xq && N.ruleContent) O.push(LL8(N.ruleContent, f))
            }
        }
        let V = v?.sandbox?.filesystem;
        if (V) {
            for (let k of V.allowWrite || []) Y.push(es6(k, f));
            for (let k of V.denyWrite || []) A.push(es6(k, f));
            for (let k of V.denyRead || []) O.push(es6(k, f));
            if (!Tn_() || f === "policySettings")
                for (let k of V.allowRead || []) w.push(es6(k, f))
        }
    }
    let {
        rgPath: M,
        rgArgs: P,
        argv0: W
    } = wj6(), D = q.sandbox?.ripgrep ?? {
        command: M,
        args: P,
        argv0: W
    };
    return {
        network: xP() && Js() && !lE6() ? {
            allowedDomains: void 0,
            deniedDomains: [],
            allowAllUnixSockets: !0
        } : {
            allowedDomains: _,
            deniedDomains: z,
            allowUnixSockets: q.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: q.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: q.sandbox?.network?.allowLocalBinding,
            allowMachLookup: q.sandbox?.network?.allowMachLookup,
            httpProxyPort: q.sandbox?.network?.httpProxyPort,
            socksProxyPort: q.sandbox?.network?.socksProxyPort
        },
        filesystem: {
            denyRead: O,
            allowRead: w,
            allowWrite: Y,
            denyWrite: A
        },
        ignoreViolations: q.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: xP() && Js() ? !1 : q.sandbox?.enableWeakerNestedSandbox,
        enableWeakerNetworkIsolation: q.sandbox?.enableWeakerNetworkIsolation,
        ripgrep: D,
        seccomp: _J4()
    }
}
// @from(Ln 206928, Col 0)
function Vn_() {
    for (let q of RL8) try {
        Dn_(q, {
            recursive: !0
        }), E(`[Sandbox] scrubbed planted bare-repo file: ${q}`)
    } catch {}
}
// @from(Ln 206935, Col 0)
async function kn_(q) {
    let K = Gn_(q, ".git");
    try {
        let z = (await fn_(K, {
            encoding: "utf8"
        })).match(/^gitdir:\s*(.+)$/m);
        if (!z?.[1]) return null;
        let Y = $j6(q, z[1].trim()),
            A = `${Pp1}.git${Pp1}worktrees${Pp1}`,
            O = Y.lastIndexOf(A);
        if (O > 0) return Y.substring(0, O);
        return null
    } catch {
        return null
    }
}
// @from(Ln 206952, Col 0)
function lE6() {
    try {
        return y7()?.sandbox?.enabled ?? !1
    } catch (q) {
        return E(`Failed to get settings for sandbox check: ${q}`), !1
    }
}
// @from(Ln 206960, Col 0)
function Nn_() {
    if (xP()) return !1;
    return y7()?.sandbox?.autoAllowBashIfSandboxed ?? !0
}
// @from(Ln 206965, Col 0)
function En_() {
    return y7()?.sandbox?.allowUnsandboxedCommands ?? !0
}
// @from(Ln 206969, Col 0)
function yn_() {
    let q = y7();
    return lE6() && (q?.sandbox?.failIfUnavailable ?? !1)
}
// @from(Ln 206974, Col 0)
function Dp1() {
    try {
        let K = v7()?.sandbox?.enabledPlatforms;
        if (K === void 0) return !0;
        if (K.length === 0) return !1;
        let _ = y1();
        return K.includes(_)
    } catch (q) {
        return E(`Failed to check enabledPlatforms: ${q}`), !0
    }
}
// @from(Ln 206986, Col 0)
function CL8() {
    if (xP() && process.platform === "linux" && !lE6()) return Js();
    if (!SL8()) return !1;
    if (qt6().errors.length > 0) return !1;
    if (!Dp1()) return !1;
    return lE6()
}
// @from(Ln 206994, Col 0)
function Ln_() {
    if (!lE6()) return;
    if (!SL8()) {
        let K = y1();
        if (K === "wsl") return "sandbox.enabled is set but WSL1 is not supported (requires WSL2)";
        return `sandbox.enabled is set but ${K} is not supported (requires macOS, Linux, or WSL2)`
    }
    if (!Dp1()) return `sandbox.enabled is set but ${y1()} is not in sandbox.enabledPlatforms`;
    let q = qt6();
    if (q.errors.length > 0) {
        let _ = y1() === "macos" ? "run /sandbox or /doctor for details" : "install missing tools (e.g. apt install bubblewrap socat) or run /sandbox for details";
        return `sandbox.enabled is set but dependencies are missing: ${q.errors.join(", ")} · ${_}`
    }
    return
}
// @from(Ln 207010, Col 0)
function hn_() {
    let q = y1();
    if (q !== "linux" && q !== "wsl") return [];
    try {
        let K = y7();
        if (!K?.sandbox?.enabled) return [];
        let _ = K?.permissions || {},
            z = [],
            Y = (A) => {
                let O = A.replace(/\/\*\*$/, "");
                return /[*?[\]]/.test(O)
            };
        for (let A of [..._.allow || [], ..._.deny || []]) {
            let O = dE6(A);
            if ((O.toolName === J4 || O.toolName === xq) && O.ruleContent && Y(O.ruleContent)) z.push(A)
        }
        return z
    } catch (K) {
        return E(`Failed to get Linux glob pattern warnings: ${K}`), []
    }
}
// @from(Ln 207032, Col 0)
function Rn_() {
    let q = ["flagSettings", "policySettings"];
    for (let K of q) {
        let _ = E1(K);
        if (_?.sandbox?.enabled !== void 0 || _?.sandbox?.autoAllowBashIfSandboxed !== void 0 || _?.sandbox?.allowUnsandboxedCommands !== void 0) return !0
    }
    return !1
}
// @from(Ln 207040, Col 0)
async function Sn_(q) {
    let K = E1("localSettings");
    P7("localSettings", {
        sandbox: {
            ...K?.sandbox,
            ...q.enabled !== void 0 && {
                enabled: q.enabled
            },
            ...q.autoAllowBashIfSandboxed !== void 0 && {
                autoAllowBashIfSandboxed: q.autoAllowBashIfSandboxed
            },
            ...q.allowUnsandboxedCommands !== void 0 && {
                allowUnsandboxedCommands: q.allowUnsandboxedCommands
            }
        }
    })
}
// @from(Ln 207058, Col 0)
function Cn_() {
    return y7()?.sandbox?.excludedCommands ?? []
}
// @from(Ln 207061, Col 0)
async function bn_(q, K, _, z) {
    if (CL8())
        if (OK6) await OK6;
        else throw Error("Sandbox failed to initialize. ");
    return B2.wrapWithSandbox(q, K, _, z)
}
// @from(Ln 207067, Col 0)
async function In_(q) {
    if (OK6) return OK6;
    if (!CL8()) return;
    let K = q ? async (_) => {
        if (jj6()) return E(`[sandbox] Blocked network request to ${_.host} (allowManagedDomainsOnly)`), !1;
        return q(_)
    }: void 0;
    return OK6 = (async () => {
        try {
            if (cE6 === void 0) cE6 = await kn_(tu());
            let _ = y7(),
                z = hL8(_);
            await B2.initialize(z, K), qt6.cache.clear?.(), Wp1 = _y.subscribe(() => {
                let Y = y7(),
                    A = hL8(Y);
                B2.updateConfig(A), E("Sandbox configuration updated from settings change")
            })
        } catch (_) {
            OK6 = void 0, E(`Failed to initialize sandbox: ${b6(_)}`)
        }
    })(), OK6
}
// @from(Ln 207090, Col 0)
function xn_() {
    if (!CL8()) return;
    let q = y7(),
        K = hL8(q);
    B2.updateConfig(K)
}
// @from(Ln 207096, Col 0)
async function un_() {
    return Wp1?.(), Wp1 = void 0, cE6 = void 0, RL8.length = 0, qt6.cache.clear?.(), SL8.cache.clear?.(), OK6 = void 0, B2.reset()
}
// @from(Ln 207100, Col 0)
function Zp1(q, K) {
    let _ = E1("localSettings"),
        z = _?.sandbox?.excludedCommands || [],
        Y = q;
    if (K) {
        let A = K.filter((O) => O.type === "addRules" && O.rules.some((w) => w.toolName === S7));
        if (A.length > 0 && A[0].type === "addRules") {
            let O = A[0].rules.find((w) => w.toolName === S7);
            if (O?.ruleContent) Y = vn_(O.ruleContent) || O.ruleContent
        }
    }
    if (!z.includes(Y)) P7("localSettings", {
        sandbox: {
            ..._?.sandbox,
            excludedCommands: [...z, Y]
        }
    });
    return Y
}
// @from(Ln 207119, Col 4)
OK6
// @from(Ln 207119, Col 9)
Wp1
// @from(Ln 207119, Col 14)
cE6
// @from(Ln 207119, Col 19)
RL8
// @from(Ln 207119, Col 24)
qt6
// @from(Ln 207119, Col 29)
SL8
// @from(Ln 207119, Col 34)
Z7
// @from(Ln 207120, Col 4)
yY = L(() => {
    bH4();
    v16();
    y8();
    K8();
    b9();
    NK();
    zK6();
    aY();
    Rm();
    a1();
    zy();
    Rz();
    m8();
    Sz();
    BI();
    Mp1();
    RL8 = [];
    qt6 = P1(() => {
        let {
            rgPath: q,
            rgArgs: K
        } = wj6();
        return B2.checkDependencies({
            command: q,
            args: K
        })
    });
    SL8 = P1(() => {
        return B2.isSupportedPlatform()
    });
    Z7 = {
        initialize: In_,
        isSandboxingEnabled: CL8,
        isSandboxEnabledInSettings: lE6,
        isPlatformInEnabledList: Dp1,
        getSandboxUnavailableReason: Ln_,
        isAutoAllowBashIfSandboxedEnabled: Nn_,
        areUnsandboxedCommandsAllowed: En_,
        isSandboxRequired: yn_,
        areSandboxSettingsLockedByPolicy: Rn_,
        setSandboxSettings: Sn_,
        getExcludedCommands: Cn_,
        wrapWithSandbox: bn_,
        refreshConfig: xn_,
        reset: un_,
        checkDependencies: qt6,
        getConfig: B2.getConfig,
        getFsReadConfig: B2.getFsReadConfig,
        getFsWriteConfig: B2.getFsWriteConfig,
        getNetworkRestrictionConfig: () => {
            if (B2.getConfig()?.network?.allowedDomains === void 0) return {};
            return B2.getNetworkRestrictionConfig()
        },
        getIgnoreViolations: B2.getIgnoreViolations,
        getLinuxGlobPatternWarnings: hn_,
        isSupportedPlatform: SL8,
        getAllowUnixSockets: B2.getAllowUnixSockets,
        getAllowLocalBinding: B2.getAllowLocalBinding,
        getAllowMachLookup: B2.getAllowMachLookup,
        getEnableWeakerNestedSandbox: B2.getEnableWeakerNestedSandbox,
        getProxyPort: B2.getProxyPort,
        getSocksProxyPort: B2.getSocksProxyPort,
        getLinuxHttpSocketPath: B2.getLinuxHttpSocketPath,
        getLinuxSocksSocketPath: B2.getLinuxSocksSocketPath,
        waitForNetworkInitialization: B2.waitForNetworkInitialization,
        getSandboxViolationStore: B2.getSandboxViolationStore,
        annotateStderrWithSandboxFailures: B2.annotateStderrWithSandboxFailures,
        cleanupAfterCommand: () => {
            B2.cleanupAfterCommand(), Vn_()
        }
    }
})
// @from(Ln 207193, Col 4)
YJ4 = {}
// @from(Ln 207198, Col 0)
function mn_(q) {
    let K = s(10),
        {
            message: _,
            args: z,
            onDone: Y
        } = q,
        A, O;
    if (K[0] !== Y) A = () => {
        let H = setTimeout(Y, 0);
        return () => clearTimeout(H)
    }, O = [Y], K[0] = Y, K[1] = A, K[2] = O;
    else A = K[1], O = K[2];
    cd.useEffect(A, O);
    let w;
    if (K[3] !== z) w = cd.default.createElement(T, {
        dimColor: !0
    }, e6.pointer, " /add-dir ", z), K[3] = z, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== _) $ = cd.default.createElement(_1, null, cd.default.createElement(T, null, _)), K[5] = _, K[6] = $;
    else $ = K[6];
    let j;
    if (K[7] !== w || K[8] !== $) j = cd.default.createElement(u, {
        flexDirection: "column"
    }, w, $), K[7] = w, K[8] = $, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 207227, Col 0)
async function Bn_(q, K, _) {
    let z = (_ ?? "").trim(),
        Y = K.getAppState(),
        A = async (w, $ = !1) => {
            let H = {
                type: "addDirectories",
                directories: [w],
                destination: $ ? "localSettings" : "session"
            };
            K.setToolPermissionContext((P) => EY(P, H));
            let J = tG();
            if (!J.includes(w)) Ap6([...J, w]);
            Z7.refreshConfig();
            let X;
            if ($) try {
                Ud(H), X = `Added ${Y8.bold(w)} as a working directory and saved to local settings`
            } catch (P) {
                X = `Added ${Y8.bold(w)} as a working directory. Failed to save to local settings: ${P instanceof Error?P.message:"Unknown error"}`
            } else X = `Added ${Y8.bold(w)} as a working directory for this session`;
            let M = `${X} ${Y8.dim("· /permissions to manage")}`;
            q(M)
        };
    if (!z) return cd.default.createElement(Fs6, {
        permissionContext: Y.toolPermissionContext,
        onAddDirectory: A,
        onCancel: () => {
            q("Did not add a working directory.")
        }
    });
    let O = await KE6(z, Y.toolPermissionContext);
    if (O.resultType !== "success") {
        let w = _E6(O);
        return cd.default.createElement(mn_, {
            message: w,
            args: _ ?? "",
            onDone: () => q(w)
        })
    }
    return cd.default.createElement(Fs6, {
        directoryPath: O.absolutePath,
        permissionContext: Y.toolPermissionContext,
        onAddDirectory: A,
        onCancel: () => {
            q(`Did not add ${Y8.bold(O.absolutePath)} as a working directory.`)
        }
    })
}
// @from(Ln 207274, Col 4)
cd
// @from(Ln 207275, Col 4)
AJ4 = L(() => {
    o6();
    Y3();
    Qq();
    y8();
    GK();
    SB1();
    g6();
    MH();
    yY();
    gE8();
    cd = K6(P6(), 1)
})
// @from(Ln 207288, Col 4)
pn_
// @from(Ln 207288, Col 9)
OJ4
// @from(Ln 207289, Col 4)
wJ4 = L(() => {
    pn_ = {
        type: "local-jsx",
        name: "add-dir",
        description: "Add a new working directory",
        argumentHint: "<path>",
        load: () => Promise.resolve().then(() => (AJ4(), YJ4))
    }, OJ4 = pn_
})
// @from(Ln 207299, Col 0)
function Fn_(q) {
    var K = q == null ? 0 : q.length;
    return K ? q[K - 1] : void 0
}
// @from(Ln 207303, Col 4)
pI
// @from(Ln 207304, Col 4)
Kt6 = L(() => {
    pI = Fn_
})
// @from(Ln 207307, Col 4)
Yy = "(no content)"
// @from(Ln 207308, Col 4)
YA = p((in_) => {
    var fp1 = Symbol.for("yaml.alias"),
        $J4 = Symbol.for("yaml.document"),
        bL8 = Symbol.for("yaml.map"),
        jJ4 = Symbol.for("yaml.pair"),
        Gp1 = Symbol.for("yaml.scalar"),
        IL8 = Symbol.for("yaml.seq"),
        Xs = Symbol.for("yaml.node.type"),
        gn_ = (q) => !!q && typeof q === "object" && q[Xs] === fp1,
        Un_ = (q) => !!q && typeof q === "object" && q[Xs] === $J4,
        Qn_ = (q) => !!q && typeof q === "object" && q[Xs] === bL8,
        dn_ = (q) => !!q && typeof q === "object" && q[Xs] === jJ4,
        HJ4 = (q) => !!q && typeof q === "object" && q[Xs] === Gp1,
        cn_ = (q) => !!q && typeof q === "object" && q[Xs] === IL8;

    function JJ4(q) {
        if (q && typeof q === "object") switch (q[Xs]) {
            case bL8:
            case IL8:
                return !0
        }
        return !1
    }

    function ln_(q) {
        if (q && typeof q === "object") switch (q[Xs]) {
            case fp1:
            case bL8:
            case Gp1:
            case IL8:
                return !0
        }
        return !1
    }
    var nn_ = (q) => (HJ4(q) || JJ4(q)) && !!q.anchor;
    in_.ALIAS = fp1;
    in_.DOC = $J4;
    in_.MAP = bL8;
    in_.NODE_TYPE = Xs;
    in_.PAIR = jJ4;
    in_.SCALAR = Gp1;
    in_.SEQ = IL8;
    in_.hasAnchor = nn_;
    in_.isAlias = gn_;
    in_.isCollection = JJ4;
    in_.isDocument = Un_;
    in_.isMap = Qn_;
    in_.isNode = ln_;
    in_.isPair = dn_;
    in_.isScalar = HJ4;
    in_.isSeq = cn_
})
// @from(Ln 207360, Col 4)
_t6 = p((Hi_) => {
    var nW = YA(),
        Ay = Symbol("break visit"),
        XJ4 = Symbol("skip children"),
        ld = Symbol("remove node");

    function xL8(q, K) {
        let _ = MJ4(K);
        if (nW.isDocument(q)) {
            if (nE6(null, q.contents, _, Object.freeze([q])) === ld) q.contents = null
        } else nE6(null, q, _, Object.freeze([]))
    }
    xL8.BREAK = Ay;
    xL8.SKIP = XJ4;
    xL8.REMOVE = ld;

    function nE6(q, K, _, z) {
        let Y = PJ4(q, K, _, z);
        if (nW.isNode(Y) || nW.isPair(Y)) return WJ4(q, z, Y), nE6(q, Y, _, z);
        if (typeof Y !== "symbol") {
            if (nW.isCollection(K)) {
                z = Object.freeze(z.concat(K));
                for (let A = 0; A < K.items.length; ++A) {
                    let O = nE6(A, K.items[A], _, z);
                    if (typeof O === "number") A = O - 1;
                    else if (O === Ay) return Ay;
                    else if (O === ld) K.items.splice(A, 1), A -= 1
                }
            } else if (nW.isPair(K)) {
                z = Object.freeze(z.concat(K));
                let A = nE6("key", K.key, _, z);
                if (A === Ay) return Ay;
                else if (A === ld) K.key = null;
                let O = nE6("value", K.value, _, z);
                if (O === Ay) return Ay;
                else if (O === ld) K.value = null
            }
        }
        return Y
    }
    async function uL8(q, K) {
        let _ = MJ4(K);
        if (nW.isDocument(q)) {
            if (await iE6(null, q.contents, _, Object.freeze([q])) === ld) q.contents = null
        } else await iE6(null, q, _, Object.freeze([]))
    }
    uL8.BREAK = Ay;
    uL8.SKIP = XJ4;
    uL8.REMOVE = ld;
    async function iE6(q, K, _, z) {
        let Y = await PJ4(q, K, _, z);
        if (nW.isNode(Y) || nW.isPair(Y)) return WJ4(q, z, Y), iE6(q, Y, _, z);
        if (typeof Y !== "symbol") {
            if (nW.isCollection(K)) {
                z = Object.freeze(z.concat(K));
                for (let A = 0; A < K.items.length; ++A) {
                    let O = await iE6(A, K.items[A], _, z);
                    if (typeof O === "number") A = O - 1;
                    else if (O === Ay) return Ay;
                    else if (O === ld) K.items.splice(A, 1), A -= 1
                }
            } else if (nW.isPair(K)) {
                z = Object.freeze(z.concat(K));
                let A = await iE6("key", K.key, _, z);
                if (A === Ay) return Ay;
                else if (A === ld) K.key = null;
                let O = await iE6("value", K.value, _, z);
                if (O === Ay) return Ay;
                else if (O === ld) K.value = null
            }
        }
        return Y
    }

    function MJ4(q) {
        if (typeof q === "object" && (q.Collection || q.Node || q.Value)) return Object.assign({
            Alias: q.Node,
            Map: q.Node,
            Scalar: q.Node,
            Seq: q.Node
        }, q.Value && {
            Map: q.Value,
            Scalar: q.Value,
            Seq: q.Value
        }, q.Collection && {
            Map: q.Collection,
            Seq: q.Collection
        }, q);
        return q
    }

    function PJ4(q, K, _, z) {
        if (typeof _ === "function") return _(q, K, z);
        if (nW.isMap(K)) return _.Map?.(q, K, z);
        if (nW.isSeq(K)) return _.Seq?.(q, K, z);
        if (nW.isPair(K)) return _.Pair?.(q, K, z);
        if (nW.isScalar(K)) return _.Scalar?.(q, K, z);
        if (nW.isAlias(K)) return _.Alias?.(q, K, z);
        return
    }

    function WJ4(q, K, _) {
        let z = K[K.length - 1];
        if (nW.isCollection(z)) z.items[q] = _;
        else if (nW.isPair(z))
            if (q === "key") z.key = _;
            else z.value = _;
        else if (nW.isDocument(z)) z.contents = _;
        else {
            let Y = nW.isAlias(z) ? "alias" : "scalar";
            throw Error(`Cannot replace node with ${Y} parent`)
        }
    }
    Hi_.visit = xL8;
    Hi_.visitAsync = uL8
})
// @from(Ln 207476, Col 4)
vp1 = p((Di_) => {
    var DJ4 = YA(),
        Mi_ = _t6(),
        Pi_ = {
            "!": "%21",
            ",": "%2C",
            "[": "%5B",
            "]": "%5D",
            "{": "%7B",
            "}": "%7D"
        },
        Wi_ = (q) => q.replace(/[!,[\]{}]/g, (K) => Pi_[K]);
    class FI {
        constructor(q, K) {
            this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, FI.defaultYaml, q), this.tags = Object.assign({}, FI.defaultTags, K)
        }
        clone() {
            let q = new FI(this.yaml, this.tags);
            return q.docStart = this.docStart, q
        }
        atDocument() {
            let q = new FI(this.yaml, this.tags);
            switch (this.yaml.version) {
                case "1.1":
                    this.atNextDocument = !0;
                    break;
                case "1.2":
                    this.atNextDocument = !1, this.yaml = {
                        explicit: FI.defaultYaml.explicit,
                        version: "1.2"
                    }, this.tags = Object.assign({}, FI.defaultTags);
                    break
            }
            return q
        }
        add(q, K) {
            if (this.atNextDocument) this.yaml = {
                explicit: FI.defaultYaml.explicit,
                version: "1.1"
            }, this.tags = Object.assign({}, FI.defaultTags), this.atNextDocument = !1;
            let _ = q.trim().split(/[ \t]+/),
                z = _.shift();
            switch (z) {
                case "%TAG": {
                    if (_.length !== 2) {
                        if (K(0, "%TAG directive should contain exactly two parts"), _.length < 2) return !1
                    }
                    let [Y, A] = _;
                    return this.tags[Y] = A, !0
                }
                case "%YAML": {
                    if (this.yaml.explicit = !0, _.length !== 1) return K(0, "%YAML directive should contain exactly one part"), !1;
                    let [Y] = _;
                    if (Y === "1.1" || Y === "1.2") return this.yaml.version = Y, !0;
                    else {
                        let A = /^\d+\.\d+$/.test(Y);
                        return K(6, `Unsupported YAML version ${Y}`, A), !1
                    }
                }
                default:
                    return K(0, `Unknown directive ${z}`, !0), !1
            }
        }
        tagName(q, K) {
            if (q === "!") return "!";
            if (q[0] !== "!") return K(`Not a valid tag: ${q}`), null;
            if (q[1] === "<") {
                let A = q.slice(2, -1);
                if (A === "!" || A === "!!") return K(`Verbatim tags aren't resolved, so ${q} is invalid.`), null;
                if (q[q.length - 1] !== ">") K("Verbatim tags must end with a >");
                return A
            }
            let [, _, z] = q.match(/^(.*!)([^!]*)$/s);
            if (!z) K(`The ${q} tag has no suffix`);
            let Y = this.tags[_];
            if (Y) try {
                return Y + decodeURIComponent(z)
            } catch (A) {
                return K(String(A)), null
            }
            if (_ === "!") return q;
            return K(`Could not resolve tag: ${q}`), null
        }
        tagString(q) {
            for (let [K, _] of Object.entries(this.tags))
                if (q.startsWith(_)) return K + Wi_(q.substring(_.length));
            return q[0] === "!" ? q : `!<${q}>`
        }
        toString(q) {
            let K = this.yaml.explicit ? [`%YAML ${this.yaml.version||"1.2"}`] : [],
                _ = Object.entries(this.tags),
                z;
            if (q && _.length > 0 && DJ4.isNode(q.contents)) {
                let Y = {};
                Mi_.visit(q.contents, (A, O) => {
                    if (DJ4.isNode(O) && O.tag) Y[O.tag] = !0
                }), z = Object.keys(Y)
            } else z = [];
            for (let [Y, A] of _) {
                if (Y === "!!" && A === "tag:yaml.org,2002:") continue;
                if (!q || z.some((O) => O.startsWith(A))) K.push(`%TAG ${Y} ${A}`)
            }
            return K.join(`
`)
        }
    }
    FI.defaultYaml = {
        explicit: !1,
        version: "1.2"
    };
    FI.defaultTags = {
        "!!": "tag:yaml.org,2002:"
    };
    Di_.Directives = FI
})
// @from(Ln 207591, Col 4)
mL8 = p((Ti_) => {
    var ZJ4 = YA(),
        fi_ = _t6();

    function Gi_(q) {
        if (/[\x00-\x19\s,[\]{}]/.test(q)) {
            let _ = `Anchor must not contain whitespace or control characters: ${JSON.stringify(q)}`;
            throw Error(_)
        }
        return !0
    }

    function fJ4(q) {
        let K = new Set;
        return fi_.visit(q, {
            Value(_, z) {
                if (z.anchor) K.add(z.anchor)
            }
        }), K
    }

    function GJ4(q, K) {
        for (let _ = 1;; ++_) {
            let z = `${q}${_}`;
            if (!K.has(z)) return z
        }
    }

    function vi_(q, K) {
        let _ = [],
            z = new Map,
            Y = null;
        return {
            onAnchor: (A) => {
                _.push(A), Y ?? (Y = fJ4(q));
                let O = GJ4(K, Y);
                return Y.add(O), O
            },
            setAnchors: () => {
                for (let A of _) {
                    let O = z.get(A);
                    if (typeof O === "object" && O.anchor && (ZJ4.isScalar(O.node) || ZJ4.isCollection(O.node))) O.node.anchor = O.anchor;
                    else {
                        let w = Error("Failed to resolve repeated object (this should not happen)");
                        throw w.source = A, w
                    }
                }
            },
            sourceObjects: z
        }
    }
    Ti_.anchorIsValid = Gi_;
    Ti_.anchorNames = fJ4;
    Ti_.createNodeAnchors = vi_;
    Ti_.findNewAnchor = GJ4
})
// @from(Ln 207647, Col 4)
Tp1 = p((yi_) => {
    function zt6(q, K, _, z) {
        if (z && typeof z === "object")
            if (Array.isArray(z))
                for (let Y = 0, A = z.length; Y < A; ++Y) {
                    let O = z[Y],
                        w = zt6(q, z, String(Y), O);
                    if (w === void 0) delete z[Y];
                    else if (w !== O) z[Y] = w
                } else if (z instanceof Map)
                    for (let Y of Array.from(z.keys())) {
                        let A = z.get(Y),
                            O = zt6(q, z, Y, A);
                        if (O === void 0) z.delete(Y);
                        else if (O !== A) z.set(Y, O)
                    } else if (z instanceof Set)
                        for (let Y of Array.from(z)) {
                            let A = zt6(q, z, Y, Y);
                            if (A === void 0) z.delete(Y);
                            else if (A !== Y) z.delete(Y), z.add(A)
                        } else
                            for (let [Y, A] of Object.entries(z)) {
                                let O = zt6(q, z, Y, A);
                                if (O === void 0) delete z[Y];
                                else if (O !== A) z[Y] = O
                            }
        return q.call(K, _, z)
    }
    yi_.applyReviver = zt6
})
// @from(Ln 207677, Col 4)
wK6 = p((Ri_) => {
    var hi_ = YA();

    function vJ4(q, K, _) {
        if (Array.isArray(q)) return q.map((z, Y) => vJ4(z, String(Y), _));
        if (q && typeof q.toJSON === "function") {
            if (!_ || !hi_.hasAnchor(q)) return q.toJSON(K, _);
            let z = {
                aliasCount: 0,
                count: 1,
                res: void 0
            };
            _.anchors.set(q, z), _.onCreate = (A) => {
                z.res = A, delete _.onCreate
            };
            let Y = q.toJSON(K, _);
            if (_.onCreate) _.onCreate(Y);
            return Y
        }
        if (typeof q === "bigint" && !_?.keep) return Number(q);
        return q
    }
    Ri_.toJS = vJ4
})
// @from(Ln 207701, Col 4)
BL8 = p((Ii_) => {
    var Ci_ = Tp1(),
        TJ4 = YA(),
        bi_ = wK6();
    class VJ4 {
        constructor(q) {
            Object.defineProperty(this, TJ4.NODE_TYPE, {
                value: q
            })
        }
        clone() {
            let q = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (this.range) q.range = this.range.slice();
            return q
        }
        toJS(q, {
            mapAsMap: K,
            maxAliasCount: _,
            onAnchor: z,
            reviver: Y
        } = {}) {
            if (!TJ4.isDocument(q)) throw TypeError("A document argument is required");
            let A = {
                    anchors: new Map,
                    doc: q,
                    keep: !0,
                    mapAsMap: K === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof _ === "number" ? _ : 100
                },
                O = bi_.toJS(this, "", A);
            if (typeof z === "function")
                for (let {
                        count: w,
                        res: $
                    }
                    of A.anchors.values()) z($, w);
            return typeof Y === "function" ? Ci_.applyReviver(Y, {
                "": O
            }, "", O) : O
        }
    }
    Ii_.NodeBase = VJ4
})
// @from(Ln 207745, Col 4)
Yt6 = p((Fi_) => {
    var ui_ = mL8(),
        mi_ = _t6(),
        rE6 = YA(),
        Bi_ = BL8(),
        pi_ = wK6();
    class kJ4 extends Bi_.NodeBase {
        constructor(q) {
            super(rE6.ALIAS);
            this.source = q, Object.defineProperty(this, "tag", {
                set() {
                    throw Error("Alias nodes cannot have tags")
                }
            })
        }
        resolve(q, K) {
            let _;
            if (K?.aliasResolveCache) _ = K.aliasResolveCache;
            else if (_ = [], mi_.visit(q, {
                    Node: (Y, A) => {
                        if (rE6.isAlias(A) || rE6.hasAnchor(A)) _.push(A)
                    }
                }), K) K.aliasResolveCache = _;
            let z = void 0;
            for (let Y of _) {
                if (Y === this) break;
                if (Y.anchor === this.source) z = Y
            }
            return z
        }
        toJSON(q, K) {
            if (!K) return {
                source: this.source
            };
            let {
                anchors: _,
                doc: z,
                maxAliasCount: Y
            } = K, A = this.resolve(z, K);
            if (!A) {
                let w = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw ReferenceError(w)
            }
            let O = _.get(A);
            if (!O) pi_.toJS(A, null, K), O = _.get(A);
            if (!O || O.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
            if (Y >= 0) {
                if (O.count += 1, O.aliasCount === 0) O.aliasCount = pL8(z, A, _);
                if (O.count * O.aliasCount > Y) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack")
            }
            return O.res
        }
        toString(q, K, _) {
            let z = `*${this.source}`;
            if (q) {
                if (ui_.anchorIsValid(this.source), q.options.verifyAliasOrder && !q.anchors.has(this.source)) {
                    let Y = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                    throw Error(Y)
                }
                if (q.implicitKey) return `${z} `
            }
            return z
        }
    }

    function pL8(q, K, _) {
        if (rE6.isAlias(K)) {
            let z = K.resolve(q),
                Y = _ && z && _.get(z);
            return Y ? Y.count * Y.aliasCount : 0
        } else if (rE6.isCollection(K)) {
            let z = 0;
            for (let Y of K.items) {
                let A = pL8(q, Y, _);
                if (A > z) z = A
            }
            return z
        } else if (rE6.isPair(K)) {
            let z = pL8(q, K.key, _),
                Y = pL8(q, K.value, _);
            return Math.max(z, Y)
        }
        return 1
    }
    Fi_.Alias = kJ4
})
// @from(Ln 207831, Col 4)
uP = p((li_) => {
    var Ui_ = YA(),
        Qi_ = BL8(),
        di_ = wK6(),
        ci_ = (q) => !q || typeof q !== "function" && typeof q !== "object";
    class Hj6 extends Qi_.NodeBase {
        constructor(q) {
            super(Ui_.SCALAR);
            this.value = q
        }
        toJSON(q, K) {
            return K?.keep ? this.value : di_.toJS(this.value, q, K)
        }
        toString() {
            return String(this.value)
        }
    }
    Hj6.BLOCK_FOLDED = "BLOCK_FOLDED";
    Hj6.BLOCK_LITERAL = "BLOCK_LITERAL";
    Hj6.PLAIN = "PLAIN";
    Hj6.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Hj6.QUOTE_SINGLE = "QUOTE_SINGLE";
    li_.Scalar = Hj6;
    li_.isScalarValue = ci_
})
// @from(Ln 207856, Col 4)
At6 = p((ti_) => {
    var ri_ = Yt6(),
        Jj6 = YA(),
        NJ4 = uP(),
        oi_ = "tag:yaml.org,2002:";

    function ai_(q, K, _) {
        if (K) {
            let z = _.filter((A) => A.tag === K),
                Y = z.find((A) => !A.format) ?? z[0];
            if (!Y) throw Error(`Tag ${K} not found`);
            return Y
        }
        return _.find((z) => z.identify?.(q) && !z.format)
    }

    function si_(q, K, _) {
        if (Jj6.isDocument(q)) q = q.contents;
        if (Jj6.isNode(q)) return q;
        if (Jj6.isPair(q)) {
            let J = _.schema[Jj6.MAP].createNode?.(_.schema, null, _);
            return J.items.push(q), J
        }
        if (q instanceof String || q instanceof Number || q instanceof Boolean || typeof BigInt < "u" && q instanceof BigInt) q = q.valueOf();
        let {
            aliasDuplicateObjects: z,
            onAnchor: Y,
            onTagObj: A,
            schema: O,
            sourceObjects: w
        } = _, $ = void 0;
        if (z && q && typeof q === "object")
            if ($ = w.get(q), $) return $.anchor ?? ($.anchor = Y(q)), new ri_.Alias($.anchor);
            else $ = {
                anchor: null,
                node: null
            }, w.set(q, $);
        if (K?.startsWith("!!")) K = oi_ + K.slice(2);
        let j = ai_(q, K, O.tags);
        if (!j) {
            if (q && typeof q.toJSON === "function") q = q.toJSON();
            if (!q || typeof q !== "object") {
                let J = new NJ4.Scalar(q);
                if ($) $.node = J;
                return J
            }
            j = q instanceof Map ? O[Jj6.MAP] : (Symbol.iterator in Object(q)) ? O[Jj6.SEQ] : O[Jj6.MAP]
        }
        if (A) A(j), delete _.onTagObj;
        let H = j?.createNode ? j.createNode(_.schema, q, _) : typeof j?.nodeClass?.from === "function" ? j.nodeClass.from(_.schema, q, _) : new NJ4.Scalar(q);
        if (K) H.tag = K;
        else if (!j.default) H.tag = j.tag;
        if ($) $.node = H;
        return H
    }
    ti_.createNode = si_
})
// @from(Ln 207913, Col 4)
FL8 = p((_r_) => {
    var qr_ = At6(),
        nd = YA(),
        Kr_ = BL8();

    function Vp1(q, K, _) {
        let z = _;
        for (let Y = K.length - 1; Y >= 0; --Y) {
            let A = K[Y];
            if (typeof A === "number" && Number.isInteger(A) && A >= 0) {
                let O = [];
                O[A] = z, z = O
            } else z = new Map([
                [A, z]
            ])
        }
        return qr_.createNode(z, void 0, {
            aliasDuplicateObjects: !1,
            keepUndefined: !1,
            onAnchor: () => {
                throw Error("This should not happen, please report a bug.")
            },
            schema: q,
            sourceObjects: new Map
        })
    }
    var EJ4 = (q) => q == null || typeof q === "object" && !!q[Symbol.iterator]().next().done;
    class yJ4 extends Kr_.NodeBase {
        constructor(q, K) {
            super(q);
            Object.defineProperty(this, "schema", {
                value: K,
                configurable: !0,
                enumerable: !1,
                writable: !0
            })
        }
        clone(q) {
            let K = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (q) K.schema = q;
            if (K.items = K.items.map((_) => nd.isNode(_) || nd.isPair(_) ? _.clone(q) : _), this.range) K.range = this.range.slice();
            return K
        }
        addIn(q, K) {
            if (EJ4(q)) this.add(K);
            else {
                let [_, ...z] = q, Y = this.get(_, !0);
                if (nd.isCollection(Y)) Y.addIn(z, K);
                else if (Y === void 0 && this.schema) this.set(_, Vp1(this.schema, z, K));
                else throw Error(`Expected YAML collection at ${_}. Remaining path: ${z}`)
            }
        }
        deleteIn(q) {
            let [K, ..._] = q;
            if (_.length === 0) return this.delete(K);
            let z = this.get(K, !0);
            if (nd.isCollection(z)) return z.deleteIn(_);
            else throw Error(`Expected YAML collection at ${K}. Remaining path: ${_}`)
        }
        getIn(q, K) {
            let [_, ...z] = q, Y = this.get(_, !0);
            if (z.length === 0) return !K && nd.isScalar(Y) ? Y.value : Y;
            else return nd.isCollection(Y) ? Y.getIn(z, K) : void 0
        }
        hasAllNullValues(q) {
            return this.items.every((K) => {
                if (!nd.isPair(K)) return !1;
                let _ = K.value;
                return _ == null || q && nd.isScalar(_) && _.value == null && !_.commentBefore && !_.comment && !_.tag
            })
        }
        hasIn(q) {
            let [K, ..._] = q;
            if (_.length === 0) return this.has(K);
            let z = this.get(K, !0);
            return nd.isCollection(z) ? z.hasIn(_) : !1
        }
        setIn(q, K) {
            let [_, ...z] = q;
            if (z.length === 0) this.set(_, K);
            else {
                let Y = this.get(_, !0);
                if (nd.isCollection(Y)) Y.setIn(z, K);
                else if (Y === void 0 && this.schema) this.set(_, Vp1(this.schema, z, K));
                else throw Error(`Expected YAML collection at ${_}. Remaining path: ${z}`)
            }
        }
    }
    _r_.Collection = yJ4;
    _r_.collectionFromPath = Vp1;
    _r_.isEmptyPath = EJ4
})
// @from(Ln 208005, Col 4)
Ot6 = p(($r_) => {
    var Or_ = (q) => q.replace(/^(?!$)(?: $)?/gm, "#");

    function kp1(q, K) {
        if (/^\n+$/.test(q)) return q.substring(1);
        return K ? q.replace(/^(?! *$)/gm, K) : q
    }
    var wr_ = (q, K, _) => q.endsWith(`
`) ? kp1(_, K) : _.includes(`
`) ? `
` + kp1(_, K) : (q.endsWith(" ") ? "" : " ") + _;
    $r_.indentComment = kp1;
    $r_.lineComment = wr_;
    $r_.stringifyComment = Or_
})
// @from(Ln 208020, Col 4)
hJ4 = p((Mr_) => {
    function Xr_(q, K, _ = "flow", {
        indentAtStart: z,
        lineWidth: Y = 80,
        minContentWidth: A = 20,
        onFold: O,
        onOverflow: w
    } = {}) {
        if (!Y || Y < 0) return q;
        if (Y < A) A = 0;
        let $ = Math.max(1 + A, 1 + Y - K.length);
        if (q.length <= $) return q;
        let j = [],
            H = {},
            J = Y - K.length;
        if (typeof z === "number")
            if (z > Y - Math.max(2, A)) j.push(0);
            else J = Y - z;
        let X = void 0,
            M = void 0,
            P = !1,
            W = -1,
            D = -1,
            Z = -1;
        if (_ === "block") {
            if (W = LJ4(q, W, K.length), W !== -1) J = W + $
        }
        for (let f; f = q[W += 1];) {
            if (_ === "quoted" && f === "\\") {
                switch (D = W, q[W + 1]) {
                    case "x":
                        W += 3;
                        break;
                    case "u":
                        W += 5;
                        break;
                    case "U":
                        W += 9;
                        break;
                    default:
                        W += 1
                }
                Z = W
            }
            if (f === `
`) {
                if (_ === "block") W = LJ4(q, W, K.length);
                J = W + K.length + $, X = void 0
            } else {
                if (f === " " && M && M !== " " && M !== `
` && M !== "\t") {
                    let v = q[W + 1];
                    if (v && v !== " " && v !== `
` && v !== "\t") X = W
                }
                if (W >= J)
                    if (X) j.push(X), J = X + $, X = void 0;
                    else if (_ === "quoted") {
                    while (M === " " || M === "\t") M = f, f = q[W += 1], P = !0;
                    let v = W > Z + 1 ? W - 2 : D - 1;
                    if (H[v]) return q;
                    j.push(v), H[v] = !0, J = v + $, X = void 0
                } else P = !0
            }
            M = f
        }
        if (P && w) w();
        if (j.length === 0) return q;
        if (O) O();
        let G = q.slice(0, j[0]);
        for (let f = 0; f < j.length; ++f) {
            let v = j[f],
                V = j[f + 1] || q.length;
            if (v === 0) G = `
${K}${q.slice(0,V)}`;
            else {
                if (_ === "quoted" && H[v]) G += `${q[v]}\\`;
                G += `
${K}${q.slice(v+1,V)}`
            }
        }
        return G
    }

    function LJ4(q, K, _) {
        let z = K,
            Y = K + 1,
            A = q[Y];
        while (A === " " || A === "\t")
            if (K < Y + _) A = q[++K];
            else {
                do A = q[++K]; while (A && A !== `
`);
                z = K, Y = K + 1, A = q[Y]
            } return z
    }
    Mr_.FOLD_BLOCK = "block";
    Mr_.FOLD_FLOW = "flow";
    Mr_.FOLD_QUOTED = "quoted";
    Mr_.foldFlowLines = Xr_
})