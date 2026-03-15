
// @from(Ln 138836, Col 4)
JG7 = E(() => {
    t46();
    mw8 = K4.string().refine((A) => {
        if (A.includes("://") || A.includes("/") || A.includes(":")) return !1;
        if (A === "localhost") return !0;
        if (A.startsWith("*.")) {
            let q = A.slice(2);
            if (!q.includes(".") || q.startsWith(".") || q.endsWith(".")) return !1;
            let K = q.split(".");
            return K.length >= 2 && K.every((Y) => Y.length > 0)
        }
        if (A.includes("*")) return !1;
        return A.includes(".") && !A.startsWith(".") && !A.endsWith(".")
    }, {
        message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
    }), uw8 = K4.string().min(1, "Path cannot be empty"), qx3 = K4.object({
        socketPath: K4.string().min(1).describe("Unix socket path to the MITM proxy"),
        domains: K4.array(mw8).min(1).describe('Domains to route through the MITM proxy (e.g., ["api.example.com", "*.internal.org"])')
    }), OG7 = K4.object({
        allowedDomains: K4.array(mw8).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
        deniedDomains: K4.array(mw8).describe("List of denied domains"),
        allowUnixSockets: K4.array(K4.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: K4.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: K4.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
        httpProxyPort: K4.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
        socksProxyPort: K4.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering."),
        mitmProxy: qx3.optional().describe("Optional MITM proxy configuration. Routes matching domains through an upstream proxy via Unix socket while SRT still handles allow/deny filtering.")
    }), $G7 = K4.object({
        denyRead: K4.array(uw8).describe("Paths denied for reading"),
        allowWrite: K4.array(uw8).describe("Paths allowed for writing"),
        denyWrite: K4.array(uw8).describe("Paths denied for writing (takes precedence over allowWrite)"),
        allowGitConfig: K4.boolean().optional().describe("Allow writes to .git/config files (default: false). Enables git remote URL updates while keeping .git/hooks protected.")
    }), HG7 = K4.record(K4.string(), K4.array(K4.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), jG7 = K4.object({
        command: K4.string().describe("The ripgrep command to execute"),
        args: K4.array(K4.string()).optional().describe("Additional arguments to pass before ripgrep args"),
        argv0: K4.string().optional().describe("Override argv[0] when spawning (for multicall binaries that dispatch on argv[0])")
    }), Kx3 = K4.object({
        bpfPath: K4.string().optional().describe("Path to the unix-block.bpf filter file"),
        applyPath: K4.string().optional().describe("Path to the apply-seccomp binary")
    }), Bw8 = K4.object({
        network: OG7.describe("Network restrictions configuration"),
        filesystem: $G7.describe("Filesystem restrictions configuration"),
        ignoreViolations: HG7.optional().describe("Optional configuration for ignoring specific violations"),
        enableWeakerNestedSandbox: K4.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
        enableWeakerNetworkIsolation: K4.boolean().optional().describe("Enable weaker network isolation to allow access to com.apple.trustd.agent (macOS only). This is needed for Go programs (gh, gcloud, terraform, kubectl, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. Enabling this opens a potential data exfiltration vector through the trustd service. Only enable if you need Go TLS verification."),
        ripgrep: jG7.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
        mandatoryDenySearchDepth: K4.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance."),
        allowPty: K4.boolean().optional().describe("Allow pseudo-terminal (pty) operations (macOS only)"),
        seccomp: Kx3.optional().describe("Custom seccomp binary paths (Linux only).")
    })
})
// @from(Ln 138887, Col 4)
MG7 = E(() => {
    wG7();
    Sw8();
    JG7();
    $D6();
    W21()
})
// @from(Ln 138895, Col 0)
function XG7(A, q, K) {
    return `
Web page content:
---
${A}
---

${q}

${K?"Provide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed.":`Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics.`}
`
}
// @from(Ln 138911, Col 4)
sO = "WebFetch"
// @from(Ln 138912, Col 4)
DG7 = `
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
// @from(Ln 138931, Col 4)
R4 = "Edit"
// @from(Ln 138932, Col 4)
k21 = "/.claude/**"
// @from(Ln 138933, Col 4)
E21 = "~/.claude/**"
// @from(Ln 138934, Col 4)
y21 = "File has been unexpectedly modified. Read it again before attempting to write it."
// @from(Ln 138936, Col 0)
function gw8(A) {
    let q = A.trim();
    if (!q) return null;
    if (q.endsWith("-")) {
        let _ = parseInt(q.slice(0, -1), 10);
        if (isNaN(_) || _ < 1) return null;
        return {
            firstPage: _,
            lastPage: 1 / 0
        }
    }
    let K = q.indexOf("-");
    if (K === -1) {
        let _ = parseInt(q, 10);
        if (isNaN(_) || _ < 1) return null;
        return {
            firstPage: _,
            lastPage: _
        }
    }
    let Y = parseInt(q.slice(0, K), 10),
        z = parseInt(q.slice(K + 1), 10);
    if (isNaN(Y) || isNaN(z) || Y < 1 || z < 1 || z < Y) return null;
    return {
        firstPage: Y,
        lastPage: z
    }
}
// @from(Ln 138965, Col 0)
function yx6() {
    return QA() === "firstParty"
}
// @from(Ln 138969, Col 0)
function JD6(A) {
    let q = A.startsWith(".") ? A.slice(1) : A;
    return Yx3.has(q.toLowerCase())
}
// @from(Ln 138973, Col 4)
Yx3
// @from(Ln 138974, Col 4)
L21 = E(() => {
    Nz();
    Yx3 = new Set(["pdf"])
})
// @from(Ln 138979, Col 0)
function fG7(A, q, K) {
    return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${Lx6} lines starting from the beginning of the file${q}
${K}
${A}
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.${yx6()?`
- This tool can read PDF files (.pdf). For large PDFs (more than 10 pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: "1-5"). Reading a large PDF without the pages parameter will fail. Maximum 20 pages per request.`:""}
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.
- This tool can only read files, not directories. To read a directory, use an ls command via the ${Q7} tool.
- You can call multiple tools in a single response. It is always better to speculatively read multiple potentially useful files in parallel.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.`
}
// @from(Ln 138996, Col 4)
s7 = "Read"
// @from(Ln 138997, Col 4)
Lx6 = 2000
// @from(Ln 138998, Col 4)
PG7 = "Read a file from the local filesystem."
// @from(Ln 138999, Col 4)
WG7 = "- Results are returned using cat -n format, with line numbers starting at 1"
// @from(Ln 139000, Col 4)
ZG7 = "- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters"
// @from(Ln 139001, Col 4)
GG7 = "- When you already know which part of the file you need, only read that part. This can be important for larger files."
// @from(Ln 139002, Col 4)
J_ = E(() => {
    L21()
})
// @from(Ln 139005, Col 4)
NG7 = {}
// @from(Ln 139023, Col 0)
function MD6(A) {
    let q = A.match(/^([^(]+)\(([^)]+)\)$/);
    if (!q) return {
        toolName: A
    };
    let K = q[1],
        Y = q[2];
    if (!K || !Y) return {
        toolName: A
    };
    return {
        toolName: K,
        ruleContent: Y
    }
}
// @from(Ln 139039, Col 0)
function wx3(A) {
    return A.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Ln 139043, Col 0)
function Qq6(A, q) {
    if (A.startsWith("//")) return A.slice(1);
    if (A.startsWith("/") && !A.startsWith("//")) {
        let K = XD6(q);
        return pq6(K, A.slice(1))
    }
    return A
}
// @from(Ln 139052, Col 0)
function Uq6() {
    return L8("policySettings")?.sandbox?.network?.allowManagedDomainsOnly === !0
}
// @from(Ln 139056, Col 0)
function R21(A) {
    let q = A.permissions || {},
        K = [],
        Y = [];
    if (Uq6()) {
        let W = L8("policySettings");
        for (let Z of W?.sandbox?.network?.allowedDomains || []) K.push(Z);
        for (let Z of W?.permissions?.allow || []) {
            let G = MD6(Z);
            if (G.toolName === sO && G.ruleContent?.startsWith("domain:")) K.push(G.ruleContent.substring(7))
        }
    } else {
        for (let W of A.sandbox?.network?.allowedDomains || []) K.push(W);
        for (let W of q.allow || []) {
            let Z = MD6(W);
            if (Z.toolName === sO && Z.ruleContent?.startsWith("domain:")) K.push(Z.ruleContent.substring(7))
        }
    }
    for (let W of q.deny || []) {
        let Z = MD6(W);
        if (Z.toolName === sO && Z.ruleContent?.startsWith("domain:")) Y.push(Z.ruleContent.substring(7))
    }
    let z = [".", _k()],
        _ = [],
        w = [],
        O = VG.map((W) => F_(W)).filter((W) => W !== void 0);
    _.push(...O);
    let $ = OS(),
        H = AA();
    if ($ !== H) _.push(pq6($, ".claude", "settings.json")), _.push(pq6($, ".claude", "settings.local.json"));
    if (_.push(pq6(H, ".claude", "skills")), $ !== H) _.push(pq6($, ".claude", "skills"));
    let j = ["HEAD", "objects", "refs", "hooks", "config"];
    for (let W of j)
        if (_.push(pq6(H, W)), $ !== H) _.push(pq6($, W));
    if (DD6 && DD6 !== $) z.push(DD6);
    let J = new Set([...A.permissions?.additionalDirectories || [], ...XT()]);
    z.push(...J);
    for (let W of VG) {
        let Z = L8(W);
        if (Z?.permissions) {
            for (let f of Z.permissions.allow || []) {
                let v = MD6(f);
                if (v.toolName === R4 && v.ruleContent) z.push(Qq6(v.ruleContent, W))
            }
            for (let f of Z.permissions.deny || []) {
                let v = MD6(f);
                if (v.toolName === R4 && v.ruleContent) _.push(Qq6(v.ruleContent, W));
                if (v.toolName === s7 && v.ruleContent) w.push(Qq6(v.ruleContent, W))
            }
        }
        let G = Z?.sandbox?.filesystem;
        if (G) {
            for (let f of G.allowWrite || []) z.push(Qq6(f, W));
            for (let f of G.denyWrite || []) _.push(Qq6(f, W));
            for (let f of G.denyRead || []) w.push(Qq6(f, W))
        }
    }
    let {
        rgPath: M,
        rgArgs: D,
        argv0: X
    } = p$6(), P = A.sandbox?.ripgrep ?? {
        command: M,
        args: D,
        argv0: X
    };
    return {
        network: {
            allowedDomains: K,
            deniedDomains: Y,
            allowUnixSockets: A.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: A.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: A.sandbox?.network?.allowLocalBinding,
            httpProxyPort: A.sandbox?.network?.httpProxyPort,
            socksProxyPort: A.sandbox?.network?.socksProxyPort
        },
        filesystem: {
            denyRead: w,
            allowWrite: z,
            denyWrite: _
        },
        ignoreViolations: A.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: A.sandbox?.enableWeakerNestedSandbox,
        enableWeakerNetworkIsolation: A.sandbox?.enableWeakerNetworkIsolation,
        ripgrep: P
    }
}
// @from(Ln 139143, Col 0)
async function Ox3(A) {
    let q = zx3(A, ".git");
    try {
        let Y = (await _x3(q, {
            encoding: "utf8"
        })).match(/^gitdir:\s*(.+)$/m);
        if (Y?.[1]) {
            let z = Y[1].trim(),
                _ = z.indexOf(".git");
            if (_ > 0) return z.substring(0, _ - 1)
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 139160, Col 0)
function TG7() {
    try {
        return PA()?.sandbox?.enabled ?? !1
    } catch (A) {
        return k(`Failed to get settings for sandbox check: ${A}`), !1
    }
}
// @from(Ln 139168, Col 0)
function $x3() {
    return PA()?.sandbox?.autoAllowBashIfSandboxed ?? !0
}
// @from(Ln 139172, Col 0)
function Hx3() {
    return PA()?.sandbox?.allowUnsandboxedCommands ?? !0
}
// @from(Ln 139176, Col 0)
function vG7() {
    try {
        let q = mA()?.sandbox?.enabledPlatforms;
        if (q === void 0) return !0;
        if (q.length === 0) return !1;
        let K = y8();
        return q.includes(K)
    } catch (A) {
        return k(`Failed to check enabledPlatforms: ${A}`), !0
    }
}
// @from(Ln 139188, Col 0)
function h21() {
    if (!Qw8()) return !1;
    if (pw8().errors.length > 0) return !1;
    if (!vG7()) return !1;
    return TG7()
}
// @from(Ln 139195, Col 0)
function jx3() {
    let A = y8();
    if (A !== "linux" && A !== "wsl") return [];
    try {
        let q = PA();
        if (!q?.sandbox?.enabled) return [];
        let K = q?.permissions || {},
            Y = [],
            z = (_) => {
                let w = _.replace(/\/\*\*$/, "");
                return /[*?[\]]/.test(w)
            };
        for (let _ of [...K.allow || [], ...K.deny || []]) {
            let w = MD6(_);
            if ((w.toolName === R4 || w.toolName === s7) && w.ruleContent && z(w.ruleContent)) Y.push(_)
        }
        return Y
    } catch (q) {
        return k(`Failed to get Linux glob pattern warnings: ${q}`), []
    }
}
// @from(Ln 139217, Col 0)
function Jx3() {
    let A = ["flagSettings", "policySettings"];
    for (let q of A) {
        let K = L8(q);
        if (K?.sandbox?.enabled !== void 0 || K?.sandbox?.autoAllowBashIfSandboxed !== void 0 || K?.sandbox?.allowUnsandboxedCommands !== void 0) return !0
    }
    return !1
}
// @from(Ln 139225, Col 0)
async function Mx3(A) {
    let q = L8("localSettings");
    TA("localSettings", {
        sandbox: {
            ...q?.sandbox,
            ...A.enabled !== void 0 && {
                enabled: A.enabled
            },
            ...A.autoAllowBashIfSandboxed !== void 0 && {
                autoAllowBashIfSandboxed: A.autoAllowBashIfSandboxed
            },
            ...A.allowUnsandboxedCommands !== void 0 && {
                allowUnsandboxedCommands: A.allowUnsandboxedCommands
            }
        }
    })
}
// @from(Ln 139243, Col 0)
function Dx3() {
    return PA()?.sandbox?.excludedCommands ?? []
}
// @from(Ln 139246, Col 0)
async function Xx3(A, q, K, Y) {
    if (h21())
        if (da) await da;
        else throw Error("Sandbox failed to initialize. ");
    return aO.wrapWithSandbox(A, q, K, Y)
}
// @from(Ln 139252, Col 0)
async function Px3(A) {
    if (da) return da;
    if (!h21()) return;
    let q = A ? async (K) => {
        if (Uq6()) return k(`[sandbox] Blocked network request to ${K.host} (allowManagedDomainsOnly)`), !1;
        return A(K)
    }: void 0;
    return da = (async () => {
        try {
            if (DD6 === void 0) DD6 = await Ox3(OS());
            let K = PA(),
                Y = R21(K);
            await aO.initialize(Y, q), Fw8 = tO.subscribe(() => {
                let z = PA(),
                    _ = R21(z);
                aO.updateConfig(_), k("Sandbox configuration updated from settings change")
            })
        } catch (K) {
            da = void 0, k(`Failed to initialize sandbox: ${_1(K)}`)
        }
    })(), da
}
// @from(Ln 139275, Col 0)
function Wx3() {
    if (!h21()) return;
    let A = PA(),
        q = R21(A);
    aO.updateConfig(q)
}
// @from(Ln 139281, Col 0)
async function Zx3() {
    return Fw8?.(), Fw8 = void 0, DD6 = void 0, pw8.cache.clear?.(), Qw8.cache.clear?.(), da = void 0, aO.reset()
}
// @from(Ln 139285, Col 0)
function Uw8(A, q) {
    let K = L8("localSettings"),
        Y = K?.sandbox?.excludedCommands || [],
        z = A;
    if (q) {
        let _ = q.filter((w) => w.type === "addRules" && w.rules.some((O) => O.toolName === Q7));
        if (_.length > 0 && _[0].type === "addRules") {
            let w = _[0].rules.find((O) => O.toolName === Q7);
            if (w?.ruleContent) z = wx3(w.ruleContent) || w.ruleContent
        }
    }
    if (!Y.includes(z)) TA("localSettings", {
        sandbox: {
            ...K?.sandbox,
            excludedCommands: [...Y, z]
        }
    });
    return z
}
// @from(Ln 139304, Col 4)
da
// @from(Ln 139304, Col 8)
Fw8
// @from(Ln 139304, Col 13)
DD6
// @from(Ln 139304, Col 18)
pw8
// @from(Ln 139304, Col 23)
Qw8
// @from(Ln 139304, Col 28)
vA
// @from(Ln 139305, Col 4)
Lz = E(() => {
    MG7();
    YK();
    i8();
    O2();
    T1();
    H1();
    Hm();
    eL6();
    J_();
    jy();
    RY();
    s8();
    pw8 = e1(() => {
        let {
            rgPath: A,
            rgArgs: q
        } = p$6();
        return aO.checkDependencies({
            command: A,
            args: q
        })
    });
    Qw8 = e1(() => {
        return aO.isSupportedPlatform()
    });
    vA = {
        initialize: Px3,
        isSandboxingEnabled: h21,
        isSandboxEnabledInSettings: TG7,
        isPlatformInEnabledList: vG7,
        isAutoAllowBashIfSandboxedEnabled: $x3,
        areUnsandboxedCommandsAllowed: Hx3,
        areSandboxSettingsLockedByPolicy: Jx3,
        setSandboxSettings: Mx3,
        getExcludedCommands: Dx3,
        wrapWithSandbox: Xx3,
        refreshConfig: Wx3,
        reset: Zx3,
        checkDependencies: pw8,
        getFsReadConfig: aO.getFsReadConfig,
        getFsWriteConfig: aO.getFsWriteConfig,
        getNetworkRestrictionConfig: aO.getNetworkRestrictionConfig,
        getIgnoreViolations: aO.getIgnoreViolations,
        getLinuxGlobPatternWarnings: jx3,
        isSupportedPlatform: Qw8,
        getAllowUnixSockets: aO.getAllowUnixSockets,
        getAllowLocalBinding: aO.getAllowLocalBinding,
        getEnableWeakerNestedSandbox: aO.getEnableWeakerNestedSandbox,
        getProxyPort: aO.getProxyPort,
        getSocksProxyPort: aO.getSocksProxyPort,
        getLinuxHttpSocketPath: aO.getLinuxHttpSocketPath,
        getLinuxSocksSocketPath: aO.getLinuxSocksSocketPath,
        waitForNetworkInitialization: aO.waitForNetworkInitialization,
        getSandboxViolationStore: aO.getSandboxViolationStore,
        annotateStderrWithSandboxFailures: aO.annotateStderrWithSandboxFailures,
        cleanupAfterCommand: aO.cleanupAfterCommand
    }
})
// @from(Ln 139364, Col 4)
P6 = x((xx3) => {
    var lw8 = Symbol.for("react.transitional.element"),
        Gx3 = Symbol.for("react.portal"),
        fx3 = Symbol.for("react.fragment"),
        Tx3 = Symbol.for("react.strict_mode"),
        vx3 = Symbol.for("react.profiler"),
        Nx3 = Symbol.for("react.consumer"),
        Vx3 = Symbol.for("react.context"),
        kx3 = Symbol.for("react.forward_ref"),
        Ex3 = Symbol.for("react.suspense"),
        yx3 = Symbol.for("react.memo"),
        LG7 = Symbol.for("react.lazy"),
        Lx3 = Symbol.for("react.activity"),
        VG7 = Symbol.iterator;

    function Rx3(A) {
        if (A === null || typeof A !== "object") return null;
        return A = VG7 && A[VG7] || A["@@iterator"], typeof A === "function" ? A : null
    }
    var RG7 = {
            isMounted: function() {
                return !1
            },
            enqueueForceUpdate: function() {},
            enqueueReplaceState: function() {},
            enqueueSetState: function() {}
        },
        hG7 = Object.assign,
        SG7 = {};

    function WD6(A, q, K) {
        this.props = A, this.context = q, this.refs = SG7, this.updater = K || RG7
    }
    WD6.prototype.isReactComponent = {};
    WD6.prototype.setState = function(A, q) {
        if (typeof A !== "object" && typeof A !== "function" && A != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, A, q, "setState")
    };
    WD6.prototype.forceUpdate = function(A) {
        this.updater.enqueueForceUpdate(this, A, "forceUpdate")
    };

    function CG7() {}
    CG7.prototype = WD6.prototype;

    function iw8(A, q, K) {
        this.props = A, this.context = q, this.refs = SG7, this.updater = K || RG7
    }
    var nw8 = iw8.prototype = new CG7;
    nw8.constructor = iw8;
    hG7(nw8, WD6.prototype);
    nw8.isPureReactComponent = !0;
    var kG7 = Array.isArray;

    function cw8() {}
    var MO = {
            H: null,
            A: null,
            T: null,
            S: null
        },
        IG7 = Object.prototype.hasOwnProperty;

    function rw8(A, q, K) {
        var Y = K.ref;
        return {
            $$typeof: lw8,
            type: A,
            key: q,
            ref: Y !== void 0 ? Y : null,
            props: K
        }
    }

    function hx3(A, q) {
        return rw8(A.type, q, A.props)
    }

    function ow8(A) {
        return typeof A === "object" && A !== null && A.$$typeof === lw8
    }

    function Sx3(A) {
        var q = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + A.replace(/[=:]/g, function(K) {
            return q[K]
        })
    }
    var EG7 = /\/+/g;

    function dw8(A, q) {
        return typeof A === "object" && A !== null && A.key != null ? Sx3("" + A.key) : q.toString(36)
    }

    function Cx3(A) {
        switch (A.status) {
            case "fulfilled":
                return A.value;
            case "rejected":
                throw A.reason;
            default:
                switch (typeof A.status === "string" ? A.then(cw8, cw8) : (A.status = "pending", A.then(function(q) {
                        A.status === "pending" && (A.status = "fulfilled", A.value = q)
                    }, function(q) {
                        A.status === "pending" && (A.status = "rejected", A.reason = q)
                    })), A.status) {
                    case "fulfilled":
                        return A.value;
                    case "rejected":
                        throw A.reason
                }
        }
        throw A
    }

    function PD6(A, q, K, Y, z) {
        var _ = typeof A;
        if (_ === "undefined" || _ === "boolean") A = null;
        var w = !1;
        if (A === null) w = !0;
        else switch (_) {
            case "bigint":
            case "string":
            case "number":
                w = !0;
                break;
            case "object":
                switch (A.$$typeof) {
                    case lw8:
                    case Gx3:
                        w = !0;
                        break;
                    case LG7:
                        return w = A._init, PD6(w(A._payload), q, K, Y, z)
                }
        }
        if (w) return z = z(A), w = Y === "" ? "." + dw8(A, 0) : Y, kG7(z) ? (K = "", w != null && (K = w.replace(EG7, "$&/") + "/"), PD6(z, q, K, "", function(H) {
            return H
        })) : z != null && (ow8(z) && (z = hx3(z, K + (z.key == null || A && A.key === z.key ? "" : ("" + z.key).replace(EG7, "$&/") + "/") + w)), q.push(z)), 1;
        w = 0;
        var O = Y === "" ? "." : Y + ":";
        if (kG7(A))
            for (var $ = 0; $ < A.length; $++) Y = A[$], _ = O + dw8(Y, $), w += PD6(Y, q, K, _, z);
        else if ($ = Rx3(A), typeof $ === "function")
            for (A = $.call(A), $ = 0; !(Y = A.next()).done;) Y = Y.value, _ = O + dw8(Y, $++), w += PD6(Y, q, K, _, z);
        else if (_ === "object") {
            if (typeof A.then === "function") return PD6(Cx3(A), q, K, Y, z);
            throw q = String(A), Error("Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead.")
        }
        return w
    }

    function S21(A, q, K) {
        if (A == null) return A;
        var Y = [],
            z = 0;
        return PD6(A, Y, "", "", function(_) {
            return q.call(K, _, z++)
        }), Y
    }

    function Ix3(A) {
        if (A._status === -1) {
            var q = A._result;
            q = q(), q.then(function(K) {
                if (A._status === 0 || A._status === -1) A._status = 1, A._result = K
            }, function(K) {
                if (A._status === 0 || A._status === -1) A._status = 2, A._result = K
            }), A._status === -1 && (A._status = 0, A._result = q)
        }
        if (A._status === 1) return A._result.default;
        throw A._result
    }
    var yG7 = typeof reportError === "function" ? reportError : function(A) {
            if (typeof window === "object" && typeof window.ErrorEvent === "function") {
                var q = new window.ErrorEvent("error", {
                    bubbles: !0,
                    cancelable: !0,
                    message: typeof A === "object" && A !== null && typeof A.message === "string" ? String(A.message) : String(A),
                    error: A
                });
                if (!window.dispatchEvent(q)) return
            } else if (typeof process === "object" && typeof process.emit === "function") {
                process.emit("uncaughtException", A);
                return
            }
            console.error(A)
        },
        bx3 = {
            map: S21,
            forEach: function(A, q, K) {
                S21(A, function() {
                    q.apply(this, arguments)
                }, K)
            },
            count: function(A) {
                var q = 0;
                return S21(A, function() {
                    q++
                }), q
            },
            toArray: function(A) {
                return S21(A, function(q) {
                    return q
                }) || []
            },
            only: function(A) {
                if (!ow8(A)) throw Error("React.Children.only expected to receive a single React element child.");
                return A
            }
        };
    xx3.Activity = Lx3;
    xx3.Children = bx3;
    xx3.Component = WD6;
    xx3.Fragment = fx3;
    xx3.Profiler = vx3;
    xx3.PureComponent = iw8;
    xx3.StrictMode = Tx3;
    xx3.Suspense = Ex3;
    xx3.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = MO;
    xx3.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(A) {
            return MO.H.useMemoCache(A)
        }
    };
    xx3.cache = function(A) {
        return function() {
            return A.apply(null, arguments)
        }
    };
    xx3.cacheSignal = function() {
        return null
    };
    xx3.cloneElement = function(A, q, K) {
        if (A === null || A === void 0) throw Error("The argument must be a React element, but you passed " + A + ".");
        var Y = hG7({}, A.props),
            z = A.key;
        if (q != null)
            for (_ in q.key !== void 0 && (z = "" + q.key), q) !IG7.call(q, _) || _ === "key" || _ === "__self" || _ === "__source" || _ === "ref" && q.ref === void 0 || (Y[_] = q[_]);
        var _ = arguments.length - 2;
        if (_ === 1) Y.children = K;
        else if (1 < _) {
            for (var w = Array(_), O = 0; O < _; O++) w[O] = arguments[O + 2];
            Y.children = w
        }
        return rw8(A.type, z, Y)
    };
    xx3.createContext = function(A) {
        return A = {
            $$typeof: Vx3,
            _currentValue: A,
            _currentValue2: A,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        }, A.Provider = A, A.Consumer = {
            $$typeof: Nx3,
            _context: A
        }, A
    };
    xx3.createElement = function(A, q, K) {
        var Y, z = {},
            _ = null;
        if (q != null)
            for (Y in q.key !== void 0 && (_ = "" + q.key), q) IG7.call(q, Y) && Y !== "key" && Y !== "__self" && Y !== "__source" && (z[Y] = q[Y]);
        var w = arguments.length - 2;
        if (w === 1) z.children = K;
        else if (1 < w) {
            for (var O = Array(w), $ = 0; $ < w; $++) O[$] = arguments[$ + 2];
            z.children = O
        }
        if (A && A.defaultProps)
            for (Y in w = A.defaultProps, w) z[Y] === void 0 && (z[Y] = w[Y]);
        return rw8(A, _, z)
    };
    xx3.createRef = function() {
        return {
            current: null
        }
    };
    xx3.forwardRef = function(A) {
        return {
            $$typeof: kx3,
            render: A
        }
    };
    xx3.isValidElement = ow8;
    xx3.lazy = function(A) {
        return {
            $$typeof: LG7,
            _payload: {
                _status: -1,
                _result: A
            },
            _init: Ix3
        }
    };
    xx3.memo = function(A, q) {
        return {
            $$typeof: yx3,
            type: A,
            compare: q === void 0 ? null : q
        }
    };
    xx3.startTransition = function(A) {
        var q = MO.T,
            K = {};
        MO.T = K;
        try {
            var Y = A(),
                z = MO.S;
            z !== null && z(K, Y), typeof Y === "object" && Y !== null && typeof Y.then === "function" && Y.then(cw8, yG7)
        } catch (_) {
            yG7(_)
        } finally {
            q !== null && K.types !== null && (q.types = K.types), MO.T = q
        }
    };
    xx3.unstable_useCacheRefresh = function() {
        return MO.H.useCacheRefresh()
    };
    xx3.use = function(A) {
        return MO.H.use(A)
    };
    xx3.useActionState = function(A, q, K) {
        return MO.H.useActionState(A, q, K)
    };
    xx3.useCallback = function(A, q) {
        return MO.H.useCallback(A, q)
    };
    xx3.useContext = function(A) {
        return MO.H.useContext(A)
    };
    xx3.useDebugValue = function() {};
    xx3.useDeferredValue = function(A, q) {
        return MO.H.useDeferredValue(A, q)
    };
    xx3.useEffect = function(A, q) {
        return MO.H.useEffect(A, q)
    };
    xx3.useEffectEvent = function(A) {
        return MO.H.useEffectEvent(A)
    };
    xx3.useId = function() {
        return MO.H.useId()
    };
    xx3.useImperativeHandle = function(A, q, K) {
        return MO.H.useImperativeHandle(A, q, K)
    };
    xx3.useInsertionEffect = function(A, q) {
        return MO.H.useInsertionEffect(A, q)
    };
    xx3.useLayoutEffect = function(A, q) {
        return MO.H.useLayoutEffect(A, q)
    };
    xx3.useMemo = function(A, q) {
        return MO.H.useMemo(A, q)
    };
    xx3.useOptimistic = function(A, q) {
        return MO.H.useOptimistic(A, q)
    };
    xx3.useReducer = function(A, q, K) {
        return MO.H.useReducer(A, q, K)
    };
    xx3.useRef = function(A) {
        return MO.H.useRef(A)
    };
    xx3.useState = function(A) {
        return MO.H.useState(A)
    };
    xx3.useSyncExternalStore = function(A, q, K) {
        return MO.H.useSyncExternalStore(A, q, K)
    };
    xx3.useTransition = function() {
        return MO.H.useTransition()
    };
    xx3.version = "19.2.0"
})
// @from(Ln 139747, Col 0)
function YX(A = C.boolean()) {
    return C.preprocess((q) => q === "true" ? !0 : q === "false" ? !1 : q, A)
}
// @from(Ln 139750, Col 4)
dq6 = E(() => {
    K7()
})
// @from(Ln 139757, Col 0)
function yu3() {
    return Vu3(8).toString("hex")
}
// @from(Ln 139761, Col 0)
function ca(A, q) {
    let K = new Map;
    if (!A.includes("<<")) return {
        processedCommand: A,
        heredocs: K
    };
    if (/\$['"]/.test(A)) return {
        processedCommand: A,
        heredocs: K
    };
    let Y = A.indexOf("<<");
    if (Y > 0 && A.slice(0, Y).includes("`")) return {
        processedCommand: A,
        heredocs: K
    };
    if (Y > 0) {
        let f = A.slice(0, Y),
            v = (f.match(/\(\(/g) || []).length,
            N = (f.match(/\)\)/g) || []).length;
        if (v > N) return {
            processedCommand: A,
            heredocs: K
        }
    }
    let z = new RegExp(Lu3.source, "g"),
        _ = [],
        w = [],
        O, $ = 0,
        H = !1,
        j = !1,
        J = !1,
        M = !1,
        D = 0,
        X = (f) => {
            for (let v = $; v < f; v++) {
                let N = A[v];
                if (N === `
`) J = !1;
                if (H) {
                    if (N === "'") H = !1;
                    continue
                }
                if (j) {
                    if (M) {
                        M = !1;
                        continue
                    }
                    if (N === "\\") {
                        M = !0;
                        continue
                    }
                    if (N === '"') j = !1;
                    continue
                }
                if (N === "\\") {
                    D++;
                    continue
                }
                let V = D % 2 === 1;
                if (D = 0, V) continue;
                if (N === "'") H = !0;
                else if (N === '"') j = !0;
                else if (!J && N === "#") J = !0
            }
            $ = f
        };
    while ((O = z.exec(A)) !== null) {
        let f = O.index;
        if (X(f), H || j) continue;
        if (J) continue;
        if (D % 2 === 1) continue;
        let v = !1;
        for (let z6 of w)
            if (f > z6.contentStartIndex && f < z6.contentEndIndex) {
                v = !0;
                break
            } if (v) continue;
        let N = O[0],
            V = O[1] === "-",
            L = O[3] || O[4],
            h = f + N.length,
            R = O[2];
        if (R && A[h - 1] !== R) continue;
        let u = N.includes("\\"),
            I = !!R || u;
        if (h < A.length) {
            let z6 = A[h];
            if (!/^[ \t\n|&;()<>]$/.test(z6)) continue
        }
        let g = -1;
        {
            let z6 = !1,
                N6 = !1;
            for (let $6 = h; $6 < A.length; $6++) {
                let n = A[$6];
                if (z6) {
                    if (n === "'") z6 = !1;
                    continue
                }
                if (N6) {
                    if (n === "\\") {
                        $6++;
                        continue
                    }
                    if (n === '"') N6 = !1;
                    continue
                }
                if (n === `
`) {
                    g = $6 - h;
                    break
                }
                let o = 0;
                for (let a = $6 - 1; a >= h && A[a] === "\\"; a--) o++;
                if (o % 2 === 1) continue;
                if (n === "'") z6 = !0;
                else if (n === '"') N6 = !0
            }
        }
        if (g === -1) continue;
        let B = A.slice(h, h + g),
            b = 0;
        for (let z6 = B.length - 1; z6 >= 0; z6--)
            if (B[z6] === "\\") b++;
            else break;
        if (b % 2 === 1) continue;
        let p = h + g,
            U = A.slice(p + 1).split(`
`),
            r = -1;
        for (let z6 = 0; z6 < U.length; z6++) {
            let N6 = U[z6];
            if (V) {
                if (N6.replace(/^\t*/, "") === L) {
                    r = z6;
                    break
                }
            } else if (N6 === L) {
                r = z6;
                break
            }
            let $6 = V ? N6.replace(/^\t*/, "") : N6;
            if ($6.length > L.length && $6.startsWith(L)) {
                let n = $6[L.length];
                if (/^[)}`|&;(<>]$/.test(n)) {
                    r = -1;
                    break
                }
            }
        }
        if (q?.quotedOnly && !I) {
            let z6;
            if (r === -1) z6 = A.length;
            else {
                let $6 = U.slice(0, r + 1).join(`
`).length;
                z6 = p + 1 + $6
            }
            w.push({
                contentStartIndex: p,
                contentEndIndex: z6
            });
            continue
        }
        if (r === -1) continue;
        let Y6 = U.slice(0, r + 1).join(`
`).length,
            H6 = p + 1 + Y6,
            J6 = !1;
        for (let z6 of w)
            if (p < z6.contentEndIndex && z6.contentStartIndex < H6) {
                J6 = !0;
                break
            } if (J6) continue;
        let K6 = A.slice(f, h),
            s = A.slice(p, H6),
            X6 = K6 + s;
        _.push({
            fullText: X6,
            delimiter: L,
            operatorStartIndex: f,
            operatorEndIndex: h,
            contentStartIndex: p,
            contentEndIndex: H6
        })
    }
    if (_.length === 0) return {
        processedCommand: A,
        heredocs: K
    };
    let P = _.filter((f, v, N) => {
        for (let V of N) {
            if (f === V) continue;
            if (f.operatorStartIndex > V.contentStartIndex && f.operatorStartIndex < V.contentEndIndex) return !1
        }
        return !0
    });
    if (P.length === 0) return {
        processedCommand: A,
        heredocs: K
    };
    if (new Set(P.map((f) => f.contentStartIndex)).size < P.length) return {
        processedCommand: A,
        heredocs: K
    };
    P.sort((f, v) => v.contentEndIndex - f.contentEndIndex);
    let Z = yu3(),
        G = A;
    return P.forEach((f, v) => {
        let N = P.length - 1 - v,
            V = `${ku3}${N}_${Z}${Eu3}`;
        K.set(V, f), G = G.slice(0, f.operatorStartIndex) + V + G.slice(f.operatorEndIndex, f.contentStartIndex) + G.slice(f.contentEndIndex)
    }), {
        processedCommand: G,
        heredocs: K
    }
}
// @from(Ln 139979, Col 0)
function Ru3(A, q) {
    let K = A;
    for (let [Y, z] of q) K = K.replaceAll(Y, z.fullText);
    return K
}
// @from(Ln 139985, Col 0)
function aw8(A, q) {
    if (q.size === 0) return A;
    return A.map((K) => Ru3(K, q))
}
// @from(Ln 139989, Col 4)
ku3 = "__HEREDOC_"
// @from(Ln 139990, Col 4)
Eu3 = "__"
// @from(Ln 139991, Col 4)
Lu3
// @from(Ln 139992, Col 4)
sw8 = E(() => {
    Lu3 = /(?<!<)<<(?!<)(-)?[ \t]*(?:(['"])(\\?\w+)\2|\\?(\w+))/
})
// @from(Ln 139995, Col 4)
hu3 = null
// @from(Ln 139996, Col 4)
ZU
// @from(Ln 139997, Col 4)
ZD6 = E(() => {
    ZU = [Q7, hu3].filter((A) => A != null)
})
// @from(Ln 140000, Col 4)
qz = "Glob"
// @from(Ln 140001, Col 4)
tw8 = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
- You can call multiple tools in a single response. It is always better to speculatively perform multiple searches in parallel if they are potentially useful.`
// @from(Ln 140008, Col 0)
function ew8() {
    return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${N9} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${Q7} command. The ${N9} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${r4} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}
// @from(Ln 140021, Col 4)
N9 = "Grep"
// @from(Ln 140022, Col 4)
uP = () => {}
// @from(Ln 140024, Col 0)
function Su3() {
    return `
- If this is an existing file, you MUST use the ${s7} tool first to read the file's contents. This tool will fail if you did not read the file first.`
}
// @from(Ln 140029, Col 0)
function bG7() {
    return `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.${Su3()}
- Prefer the Edit tool for modifying existing files — it only sends the diff. Only use this tool to create new files or for complete rewrites.
- NEVER create documentation files (*.md) or README files unless explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`
}
// @from(Ln 140038, Col 4)
_K = "Write"
// @from(Ln 140039, Col 4)
Q$ = E(() => {
    J_()
})
// @from(Ln 140042, Col 4)
bJ = "NotebookEdit"
// @from(Ln 140044, Col 0)
function GD6() {
    let A = new Date,
        q = A.getFullYear(),
        K = String(A.getMonth() + 1).padStart(2, "0"),
        Y = String(A.getDate()).padStart(2, "0");
    return `${q}-${K}-${Y}`
}
// @from(Ln 140052, Col 0)
function xG7() {
    return new Date().toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    })
}
// @from(Ln 140059, Col 0)
function uG7() {
    return `
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - The current month is ${xG7()}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If the user asks for "latest React docs", search for "React documentation" with the current year, NOT last year
`
}
// @from(Ln 140088, Col 4)
jv = "WebSearch"
// @from(Ln 140089, Col 4)
cq6 = () => {}
// @from(Ln 140091, Col 0)
function gG7(A) {
    let {
        hasThinking: q = !1
    } = A ?? {}, K = [];
    if (q && w8("tengu_marble_anvil", !1)) K.push({
        type: "clear_thinking_20251015",
        keep: "all"
    });
    return K.length > 0 ? {
        edits: K
    } : void 0
}
// @from(Ln 140103, Col 4)
mG7 = 180000
// @from(Ln 140104, Col 4)
BG7 = 40000
// @from(Ln 140105, Col 4)
Cu3
// @from(Ln 140105, Col 9)
Iu3
// @from(Ln 140106, Col 4)
FG7 = E(() => {
    A8();
    HA();
    ZD6();
    uP();
    J_();
    Q$();
    cq6();
    Cu3 = [...ZU, qz, N9, s7, sO, jv], Iu3 = [R4, _K, bJ]
})
// @from(Ln 140117, Col 0)
function GU() {
    return w8("tengu_turtle_carbon", !0)
}
// @from(Ln 140121, Col 0)
function pG7(A) {
    return /\bultrathink\b/i.test(A)
}
// @from(Ln 140125, Col 0)
function C21(A) {
    let q = [],
        K = A.matchAll(/\bultrathink\b/gi);
    for (let Y of K)
        if (Y.index !== void 0) q.push({
            word: Y[0],
            start: Y.index,
            end: Y.index + Y[0].length
        });
    return q
}
// @from(Ln 140137, Col 0)
function Rx6(A, q = !1) {
    let K = q ? xu3 : bu3;
    return K[A % K.length]
}
// @from(Ln 140142, Col 0)
function QG7(A) {
    let q = IY(A),
        K = QA();
    if (K === "foundry" || K === "firstParty") return !q.includes("claude-3-");
    return q.includes("sonnet-4") || q.includes("opus-4")
}
// @from(Ln 140149, Col 0)
function I21(A) {
    let q = IY(A);
    if (q.includes("opus-4-6") || q.includes("sonnet-4-6")) return !0;
    if (q.includes("opus") || q.includes("sonnet") || q.includes("haiku")) return !1;
    return !1
}
// @from(Ln 140156, Col 0)
function fD6() {
    if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
    let {
        settings: A
    } = lq6();
    if (A.alwaysThinkingEnabled === !1) return !1;
    return !0
}
// @from(Ln 140164, Col 4)
bu3
// @from(Ln 140164, Col 9)
xu3
// @from(Ln 140165, Col 4)
jm = E(() => {
    HA();
    z4();
    Nz();
    i8();
    bu3 = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"], xu3 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer", "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer", "rainbow_violet_shimmer"]
})
// @from(Ln 140173, Col 0)
function yC(A) {
    let q = A.toLowerCase();
    if (t6(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return !0;
    if (q.includes("opus-4-6") || q.includes("sonnet-4-6")) return !0;
    if (q.includes("haiku") || q.includes("sonnet") || q.includes("opus")) return !1;
    return QA() === "firstParty"
}
// @from(Ln 140181, Col 0)
function hx6(A) {
    if (A.toLowerCase().includes("opus-4-6")) return !0;
    return !1
}
// @from(Ln 140186, Col 0)
function b21(A) {
    return iq6.includes(A)
}
// @from(Ln 140190, Col 0)
function TD6(A) {
    if (A === void 0 || A === null || A === "") return;
    if (typeof A === "number" && UG7(A)) return A;
    let q = String(A).toLowerCase();
    if (b21(q)) return q;
    let K = parseInt(q, 10);
    if (!isNaN(K) && UG7(K)) return K;
    return
}
// @from(Ln 140200, Col 0)
function nq6(A) {
    if (A === "low" || A === "medium" || A === "high") return A;
    return
}
// @from(Ln 140205, Col 0)
function AO8() {
    return nq6(mA().effortLevel)
}
// @from(Ln 140209, Col 0)
function cG7(A, q, K, Y) {
    return K !== void 0 || Y || A !== q ? A : void 0
}
// @from(Ln 140213, Col 0)
function qO8() {
    let A = process.env.CLAUDE_CODE_EFFORT_LEVEL;
    return A?.toLowerCase() === "unset" || A?.toLowerCase() === "auto" ? null : TD6(A)
}
// @from(Ln 140218, Col 0)
function rq6(A, q) {
    let K = qO8();
    if (K === null) return;
    let Y = K ?? q ?? Cx6(A);
    if (Y === "max" && !hx6(A)) return "high";
    return Y
}
// @from(Ln 140226, Col 0)
function vD6(A, q) {
    if (q === void 0) return "";
    let K = rq6(A, q);
    if (K === void 0) return "";
    return ` with ${la(K)} effort`
}
// @from(Ln 140233, Col 0)
function UG7(A) {
    return Number.isInteger(A)
}
// @from(Ln 140237, Col 0)
function la(A) {
    if (typeof A === "string") return b21(A) ? A : "high";
    return "high"
}
// @from(Ln 140242, Col 0)
function uu3(A) {
    switch (A) {
        case "low":
            return "Quick, straightforward implementation with minimal overhead";
        case "medium":
            return "Balanced approach with standard implementation and testing";
        case "high":
            return "Comprehensive implementation with extensive testing and documentation";
        case "max":
            return "Maximum capability with deepest reasoning (Opus 4.6 only)"
    }
}
// @from(Ln 140255, Col 0)
function KO8(A) {
    if (typeof A === "string") return uu3(A);
    return "Balanced approach with standard implementation and testing"
}
// @from(Ln 140260, Col 0)
function Sx6() {
    let A = w8("tengu_grey_step2", dG7);
    return {
        ...dG7,
        ...A
    }
}
// @from(Ln 140268, Col 0)
function Cx6(A) {
    if (A.toLowerCase().includes("opus-4-6")) {
        if (LC()) return "medium";
        if (Sx6().enabled && (RL() || Ix6())) return "medium"
    }
    if (GU() && yC(A)) return "medium";
    return
}
// @from(Ln 140276, Col 4)
iq6
// @from(Ln 140276, Col 9)
dG7
// @from(Ln 140277, Col 4)
wk = E(() => {
    jm();
    i8();
    fA();
    HA();
    Nz();
    A8();
    iq6 = ["low", "medium", "high", "max"];
    dG7 = {
        enabled: !1,
        dialogTitle: "",
        dialogDescription: ""
    }
})
// @from(Ln 140292, Col 0)
function u21(A) {
    if (QA() === "vertex") return YO8;
    if (A?.isNonInteractive) {
        if (A.hasAppendSystemPrompt) return lG7;
        return iG7
    }
    return YO8
}
// @from(Ln 140301, Col 0)
function Bu3() {
    if (xz(process.env.CLAUDE_CODE_ATTRIBUTION_HEADER)) return !1;
    return w8("tengu_attribution_header", !0)
}
// @from(Ln 140306, Col 0)
function m21(A) {
    if (!Bu3()) return "";
    let q = `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}.${A}`,
        K = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown",
        Y = " cch=00000;",
        z = oA1(),
        _ = z ? ` cc_workload=${z};` : "",
        w = `x-anthropic-billing-header: cc_version=${q}; cc_entrypoint=${K};${Y}${_}`;
    return k(`attribution header ${w}`), w
}
// @from(Ln 140316, Col 4)
YO8 = "You are Claude Code, Anthropic's official CLI for Claude."
// @from(Ln 140317, Col 4)
lG7 = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// @from(Ln 140318, Col 4)
iG7 = "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// @from(Ln 140319, Col 4)
mu3
// @from(Ln 140319, Col 9)
x21
// @from(Ln 140320, Col 4)
B21 = E(() => {
    Nz();
    H1();
    HA();
    A8();
    E76();
    mu3 = [YO8, lG7, iG7], x21 = new Set(mu3)
})
// @from(Ln 140332, Col 0)
function pu3(A) {
    let q = A.find((Y) => Y.type === "user");
    if (!q) return "";
    let K = q.message.content;
    if (typeof K === "string") return K;
    if (Array.isArray(K)) {
        let Y = K.find((z) => z.type === "text");
        if (Y && Y.type === "text") return Y.text
    }
    return ""
}
// @from(Ln 140344, Col 0)
function zO8(A, q) {
    let Y = [4, 7, 20].map((w) => A[w] || "0").join(""),
        z = `${Fu3}${Y}${q}`;
    return gu3("sha256").update(z).digest("hex").slice(0, 3)
}
// @from(Ln 140350, Col 0)
function nG7(A) {
    let q = pu3(A);
    return zO8(q, {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION)
}
// @from(Ln 140361, Col 4)
Fu3 = "59cf53e54c78"
// @from(Ln 140362, Col 4)
_O8 = () => {}
// @from(Ln 140364, Col 0)
function ia(A) {
    return A.filter((q) => q.data?.type !== "hook_progress")
}
// @from(Ln 140368, Col 0)
function z3(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}
// @from(Ln 140372, Col 0)
function dK(A, q) {
    return A.find((K) => z3(K, q))
}
// @from(Ln 140375, Col 4)
xM = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map,
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: !1
})
// @from(Ln 140384, Col 0)
function fU(A) {
    let q = rG7.get(A);
    if (q) return q;
    let K = Np(A);
    return rG7.set(A, K), K
}
// @from(Ln 140390, Col 4)
rG7
// @from(Ln 140391, Col 4)
g21 = E(() => {
    K7();
    rG7 = new WeakMap
})
// @from(Ln 140401, Col 0)
function cu3(A) {
    let q = Qu3(A).toLowerCase();
    return du3.has(q)
}
// @from(Ln 140406, Col 0)
function sG7(A) {
    return aG7?.get(oG7(A))
}
// @from(Ln 140409, Col 0)
async function tG7(A) {
    if (w8("tengu_granite_whisper", !1)) return d("tengu_repo_text_file_size", {
        skipped: !0
    }), null;
    try {
        let q = H_(A);
        if (!q) return null;
        let {
            stdout: K,
            code: Y
        } = await RA(hA(), ["ls-tree", "-r", "-l", "-z", "HEAD"], {
            timeout: 30000,
            cwd: q
        });
        if (Y !== 0) return null;
        let z = 0,
            _ = 0,
            w = new Map,
            O = K.split("\x00");
        for (let $ of O) {
            if (!$) continue;
            let H = $.indexOf("\t");
            if (H === -1) continue;
            let j = $.slice(H + 1);
            if (!cu3(j)) continue;
            let J = $.slice(0, H).split(/\s+/),
                M = J[2],
                D = parseInt(J[3] ?? "", 10);
            if (M && !isNaN(D)) z += D, _++, w.set(oG7(Uu3(q, j)), M)
        }
        return aG7 = w, d("tengu_repo_text_file_size", {
            total_bytes: z,
            total_files: _
        }), z
    } catch (q) {
        return k(`[repoTextSize] Failed to calculate repo text size: ${q}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 140449, Col 4)
du3
// @from(Ln 140449, Col 9)
aG7 = null
// @from(Ln 140450, Col 4)
wO8 = E(() => {
    Eq();
    $5();
    V1();
    H1();
    HA();
    du3 = new Set([".md", ".tsx", ".py", ".ts", ".js", ".php", ".cs", ".java", ".dart", ".go", ".vue", ".jsx", ".swift", ".rs", ".css", ".sql", ".kt", ".cpp", ".sh", ".rb", ".c", ".h", ".scss", ".prisma", ".tf", ".ex", ".lua", ".tex", ".ps1", ".r", ".scala", ".hpp", ".jsp", ".cc"])
})
// @from(Ln 140462, Col 0)
function lu3(A) {
    return eG7("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Ln 140466, Col 0)
function iu3(A) {
    return eG7("sha256").update(A).digest("hex")
}
// @from(Ln 140470, Col 0)
function RC(A) {
    let q = {
        operation: A.operation,
        tool: A.tool,
        filePathHash: lu3(A.filePath)
    };
    if (A.content !== void 0 && A.content.length <= nu3) q.contentHash = iu3(A.content);
    let K = sG7(A.filePath);
    if (K !== void 0) q.repo_blob_sha = K;
    if (A.type !== void 0) q.type = A.type;
    d("tengu_file_operation", q)
}
// @from(Ln 140482, Col 4)
nu3 = 102400
// @from(Ln 140483, Col 4)
F21 = E(() => {
    V1();
    wO8()
})
// @from(Ln 140487, Col 0)
class oq6 {
    diff(A, q, K = {}) {
        let Y;
        if (typeof K === "function") Y = K, K = {};
        else if ("callback" in K) Y = K.callback;
        let z = this.castInput(A, K),
            _ = this.castInput(q, K),
            w = this.removeEmpty(this.tokenize(z, K)),
            O = this.removeEmpty(this.tokenize(_, K));
        return this.diffWithOptionsObj(w, O, K, Y)
    }
    diffWithOptionsObj(A, q, K, Y) {
        var z;
        let _ = (Z) => {
                if (Z = this.postProcess(Z, K), Y) {
                    setTimeout(function() {
                        Y(Z)
                    }, 0);
                    return
                } else return Z
            },
            w = q.length,
            O = A.length,
            $ = 1,
            H = w + O;
        if (K.maxEditLength != null) H = Math.min(H, K.maxEditLength);
        let j = (z = K.timeout) !== null && z !== void 0 ? z : 1 / 0,
            J = Date.now() + j,
            M = [{
                oldPos: -1,
                lastComponent: void 0
            }],
            D = this.extractCommon(M[0], q, A, 0, K);
        if (M[0].oldPos + 1 >= O && D + 1 >= w) return _(this.buildValues(M[0].lastComponent, q, A));
        let X = -1 / 0,
            P = 1 / 0,
            W = () => {
                for (let Z = Math.max(X, -$); Z <= Math.min(P, $); Z += 2) {
                    let G, f = M[Z - 1],
                        v = M[Z + 1];
                    if (f) M[Z - 1] = void 0;
                    let N = !1;
                    if (v) {
                        let L = v.oldPos - Z;
                        N = v && 0 <= L && L < w
                    }
                    let V = f && f.oldPos + 1 < O;
                    if (!N && !V) {
                        M[Z] = void 0;
                        continue
                    }
                    if (!V || N && f.oldPos < v.oldPos) G = this.addToPath(v, !0, !1, 0, K);
                    else G = this.addToPath(f, !1, !0, 1, K);
                    if (D = this.extractCommon(G, q, A, Z, K), G.oldPos + 1 >= O && D + 1 >= w) return _(this.buildValues(G.lastComponent, q, A)) || !0;
                    else {
                        if (M[Z] = G, G.oldPos + 1 >= O) P = Math.min(P, Z - 1);
                        if (D + 1 >= w) X = Math.max(X, Z + 1)
                    }
                }
                $++
            };
        if (Y)(function Z() {
            setTimeout(function() {
                if ($ > H || Date.now() > J) return Y(void 0);
                if (!W()) Z()
            }, 0)
        })();
        else
            while ($ <= H && Date.now() <= J) {
                let Z = W();
                if (Z) return Z
            }
    }
    addToPath(A, q, K, Y, z) {
        let _ = A.lastComponent;
        if (_ && !z.oneChangePerToken && _.added === q && _.removed === K) return {
            oldPos: A.oldPos + Y,
            lastComponent: {
                count: _.count + 1,
                added: q,
                removed: K,
                previousComponent: _.previousComponent
            }
        };
        else return {
            oldPos: A.oldPos + Y,
            lastComponent: {
                count: 1,
                added: q,
                removed: K,
                previousComponent: _
            }
        }
    }
    extractCommon(A, q, K, Y, z) {
        let _ = q.length,
            w = K.length,
            O = A.oldPos,
            $ = O - Y,
            H = 0;
        while ($ + 1 < _ && O + 1 < w && this.equals(K[O + 1], q[$ + 1], z))
            if ($++, O++, H++, z.oneChangePerToken) A.lastComponent = {
                count: 1,
                previousComponent: A.lastComponent,
                added: !1,
                removed: !1
            };
        if (H && !z.oneChangePerToken) A.lastComponent = {
            count: H,
            previousComponent: A.lastComponent,
            added: !1,
            removed: !1
        };
        return A.oldPos = O, $
    }
    equals(A, q, K) {
        if (K.comparator) return K.comparator(A, q);
        else return A === q || !!K.ignoreCase && A.toLowerCase() === q.toLowerCase()
    }
    removeEmpty(A) {
        let q = [];
        for (let K = 0; K < A.length; K++)
            if (A[K]) q.push(A[K]);
        return q
    }
    castInput(A, q) {
        return A
    }
    tokenize(A, q) {
        return Array.from(A)
    }
    join(A) {
        return A.join("")
    }
    postProcess(A, q) {
        return A
    }
    get useLongestToken() {
        return !1
    }
    buildValues(A, q, K) {
        let Y = [],
            z;
        while (A) Y.push(A), z = A.previousComponent, delete A.previousComponent, A = z;
        Y.reverse();
        let _ = Y.length,
            w = 0,
            O = 0,
            $ = 0;
        for (; w < _; w++) {
            let H = Y[w];
            if (!H.removed) {
                if (!H.added && this.useLongestToken) {
                    let j = q.slice(O, O + H.count);
                    j = j.map(function(J, M) {
                        let D = K[$ + M];
                        return D.length > J.length ? D : J
                    }), H.value = this.join(j)
                } else H.value = this.join(q.slice(O, O + H.count));
                if (O += H.count, !H.added) $ += H.count
            } else H.value = this.join(K.slice($, $ + H.count)), $ += H.count
        }
        return Y
    }
}
// @from(Ln 140653, Col 0)
function OO8(A, q) {
    let K;
    for (K = 0; K < A.length && K < q.length; K++)
        if (A[K] != q[K]) return A.slice(0, K);
    return A.slice(0, K)
}
// @from(Ln 140660, Col 0)
function $O8(A, q) {
    let K;
    if (!A || !q || A[A.length - 1] != q[q.length - 1]) return "";
    for (K = 0; K < A.length && K < q.length; K++)
        if (A[A.length - (K + 1)] != q[q.length - (K + 1)]) return A.slice(-K);
    return A.slice(-K)
}
// @from(Ln 140668, Col 0)
function p21(A, q, K) {
    if (A.slice(0, q.length) != q) throw Error(`string ${JSON.stringify(A)} doesn't start with prefix ${JSON.stringify(q)}; this is a bug`);
    return K + A.slice(q.length)
}
// @from(Ln 140673, Col 0)
function Q21(A, q, K) {
    if (!q) return A + K;
    if (A.slice(-q.length) != q) throw Error(`string ${JSON.stringify(A)} doesn't end with suffix ${JSON.stringify(q)}; this is a bug`);
    return A.slice(0, -q.length) + K
}
// @from(Ln 140679, Col 0)
function ND6(A, q) {
    return p21(A, q, "")
}
// @from(Ln 140683, Col 0)
function bx6(A, q) {
    return Q21(A, q, "")
}
// @from(Ln 140687, Col 0)
function HO8(A, q) {
    return q.slice(0, ru3(A, q))
}
// @from(Ln 140691, Col 0)
function ru3(A, q) {
    let K = 0;
    if (A.length > q.length) K = A.length - q.length;
    let Y = q.length;
    if (A.length < q.length) Y = A.length;
    let z = Array(Y),
        _ = 0;
    z[0] = 0;
    for (let w = 1; w < Y; w++) {
        if (q[w] == q[_]) z[w] = z[_];
        else z[w] = _;
        while (_ > 0 && q[w] != q[_]) _ = z[_];
        if (q[w] == q[_]) _++
    }
    _ = 0;
    for (let w = K; w < A.length; w++) {
        while (_ > 0 && A[w] != q[_]) _ = z[_];
        if (A[w] == q[_]) _++
    }
    return _
}
// @from(Ln 140713, Col 0)
function VD6(A) {
    let q;
    for (q = A.length - 1; q >= 0; q--)
        if (!A[q].match(/\s/)) break;
    return A.substring(q + 1)
}
// @from(Ln 140720, Col 0)
function TU(A) {
    let q = A.match(/^\s*/);
    return q ? q[0] : ""
}
// @from(Ln 140725, Col 0)
function Af7(A, q, K, Y) {
    if (q && K) {
        let z = TU(q.value),
            _ = VD6(q.value),
            w = TU(K.value),
            O = VD6(K.value);
        if (A) {
            let $ = OO8(z, w);
            A.value = Q21(A.value, w, $), q.value = ND6(q.value, $), K.value = ND6(K.value, $)
        }
        if (Y) {
            let $ = $O8(_, O);
            Y.value = p21(Y.value, O, $), q.value = bx6(q.value, $), K.value = bx6(K.value, $)
        }
    } else if (K) {
        if (A) {
            let z = TU(K.value);
            K.value = K.value.substring(z.length)
        }
        if (Y) {
            let z = TU(Y.value);
            Y.value = Y.value.substring(z.length)
        }
    } else if (A && Y) {
        let z = TU(Y.value),
            _ = TU(q.value),
            w = VD6(q.value),
            O = OO8(z, _);
        q.value = ND6(q.value, O);
        let $ = $O8(ND6(z, O), w);
        q.value = bx6(q.value, $), Y.value = p21(Y.value, z, $), A.value = Q21(A.value, z, z.slice(0, z.length - $.length))
    } else if (Y) {
        let z = TU(Y.value),
            _ = VD6(q.value),
            w = HO8(_, z);
        q.value = bx6(q.value, w)
    } else if (A) {
        let z = VD6(A.value),
            _ = TU(q.value),
            w = HO8(z, _);
        q.value = ND6(q.value, w)
    }
}
// @from(Ln 140769, Col 0)
function jO8(A, q, K) {
    return Yf7.diff(A, q, K)
}
// @from(Ln 140772, Col 4)
U21 = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}"
// @from(Ln 140773, Col 4)
ou3
// @from(Ln 140773, Col 9)
qf7
// @from(Ln 140773, Col 14)
au3
// @from(Ln 140773, Col 19)
Kf7
// @from(Ln 140773, Col 24)
Yf7
// @from(Ln 140774, Col 4)
zf7 = E(() => {
    ou3 = new RegExp(`[${U21}]+|\\s+|[^${U21}]`, "ug");
    qf7 = class qf7 extends oq6 {
        equals(A, q, K) {
            if (K.ignoreCase) A = A.toLowerCase(), q = q.toLowerCase();
            return A.trim() === q.trim()
        }
        tokenize(A, q = {}) {
            let K;
            if (q.intlSegmenter) {
                let _ = q.intlSegmenter;
                if (_.resolvedOptions().granularity != "word") throw Error('The segmenter passed must have a granularity of "word"');
                K = [];
                for (let w of Array.from(_.segment(A))) {
                    let O = w.segment;
                    if (K.length && /\s/.test(K[K.length - 1]) && /\s/.test(O)) K[K.length - 1] += O;
                    else K.push(O)
                }
            } else K = A.match(ou3) || [];
            let Y = [],
                z = null;
            return K.forEach((_) => {
                if (/\s/.test(_))
                    if (z == null) Y.push(_);
                    else Y.push(Y.pop() + _);
                else if (z != null && /\s/.test(z))
                    if (Y[Y.length - 1] == z) Y.push(Y.pop() + _);
                    else Y.push(z + _);
                else Y.push(_);
                z = _
            }), Y
        }
        join(A) {
            return A.map((q, K) => {
                if (K == 0) return q;
                else return q.replace(/^\s+/, "")
            }).join("")
        }
        postProcess(A, q) {
            if (!A || q.oneChangePerToken) return A;
            let K = null,
                Y = null,
                z = null;
            if (A.forEach((_) => {
                    if (_.added) Y = _;
                    else if (_.removed) z = _;
                    else {
                        if (Y || z) Af7(K, z, Y, _);
                        K = _, Y = null, z = null
                    }
                }), Y || z) Af7(K, z, Y, null);
            return A
        }
    };
    au3 = new qf7;
    Kf7 = class Kf7 extends oq6 {
        tokenize(A) {
            let q = new RegExp(`(\\r?\\n)|[${U21}]+|[^\\S\\n\\r]+|[^${U21}]`, "ug");
            return A.match(q) || []
        }
    };
    Yf7 = new Kf7
})
// @from(Ln 140838, Col 0)
function na(A, q, K) {
    return wf7.diff(A, q, K)
}
// @from(Ln 140842, Col 0)
function su3(A, q) {
    if (q.stripTrailingCr) A = A.replace(/\r\n/g, `
`);
    let K = [],
        Y = A.split(/(\n|\r\n)/);
    if (!Y[Y.length - 1]) Y.pop();
    for (let z = 0; z < Y.length; z++) {
        let _ = Y[z];
        if (z % 2 && !q.newlineIsToken) K[K.length - 1] += _;
        else K.push(_)
    }
    return K
}
// @from(Ln 140855, Col 4)
_f7
// @from(Ln 140855, Col 9)
wf7
// @from(Ln 140856, Col 4)
JO8 = E(() => {
    _f7 = class _f7 extends oq6 {
        constructor() {
            super(...arguments);
            this.tokenize = su3
        }
        equals(A, q, K) {
            if (K.ignoreWhitespace) {
                if (!K.newlineIsToken || !A.includes(`
`)) A = A.trim();
                if (!K.newlineIsToken || !q.includes(`
`)) q = q.trim()
            } else if (K.ignoreNewlineAtEof && !K.newlineIsToken) {
                if (A.endsWith(`
`)) A = A.slice(0, -1);
                if (q.endsWith(`
`)) q = q.slice(0, -1)
            }
            return super.equals(A, q, K)
        }
    };
    wf7 = new _f7
})
// @from(Ln 140880, Col 0)
function kD6(A, q, K, Y, z, _, w) {
    let O;
    if (!w) O = {};
    else if (typeof w === "function") O = {
        callback: w
    };
    else O = w;
    if (typeof O.context > "u") O.context = 4;
    let $ = O.context;
    if (O.newlineIsToken) throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
    if (!O.callback) return H(na(K, Y, O));
    else {
        let {
            callback: j
        } = O;
        na(K, Y, Object.assign(Object.assign({}, O), {
            callback: (J) => {
                let M = H(J);
                j(M)
            }
        }))
    }

    function H(j) {
        if (!j) return;
        j.push({
            value: "",
            lines: []
        });

        function J(G) {
            return G.map(function(f) {
                return " " + f
            })
        }
        let M = [],
            D = 0,
            X = 0,
            P = [],
            W = 1,
            Z = 1;
        for (let G = 0; G < j.length; G++) {
            let f = j[G],
                v = f.lines || tu3(f.value);
            if (f.lines = v, f.added || f.removed) {
                if (!D) {
                    let N = j[G - 1];
                    if (D = W, X = Z, N) P = $ > 0 ? J(N.lines.slice(-$)) : [], D -= P.length, X -= P.length
                }
                for (let N of v) P.push((f.added ? "+" : "-") + N);
                if (f.added) Z += v.length;
                else W += v.length
            } else {
                if (D)
                    if (v.length <= $ * 2 && G < j.length - 2)
                        for (let N of J(v)) P.push(N);
                    else {
                        let N = Math.min(v.length, $);
                        for (let L of J(v.slice(0, N))) P.push(L);
                        let V = {
                            oldStart: D,
                            oldLines: W - D + N,
                            newStart: X,
                            newLines: Z - X + N,
                            lines: P
                        };
                        M.push(V), D = 0, X = 0, P = []
                    } W += v.length, Z += v.length
            }
        }
        for (let G of M)
            for (let f = 0; f < G.lines.length; f++)
                if (G.lines[f].endsWith(`
`)) G.lines[f] = G.lines[f].slice(0, -1);
                else G.lines.splice(f + 1, 0, "\\ No newline at end of file"), f++;
        return {
            oldFileName: A,
            newFileName: q,
            oldHeader: z,
            newHeader: _,
            hunks: M
        }
    }
}
// @from(Ln 140965, Col 0)
function tu3(A) {
    let q = A.endsWith(`
`),
        K = A.split(`
`).map((Y) => Y + `
`);
    if (q) K.pop();
    else K.push(K.pop().slice(0, -1));
    return K
}
// @from(Ln 140975, Col 4)
Of7 = E(() => {
    JO8()
})
// @from(Ln 140978, Col 4)
ED6 = E(() => {
    zf7();
    JO8();
    Of7()
})
// @from(Ln 140984, Col 0)
function qm3() {
    let A = new Map;
    for (let [q, K] of Object.entries(eO)) {
        for (let [Y, z] of Object.entries(K)) eO[Y] = {
            open: `\x1B[${z[0]}m`,
            close: `\x1B[${z[1]}m`
        }, K[Y] = eO[Y], A.set(z[0], z[1]);
        Object.defineProperty(eO, q, {
            value: K,
            enumerable: !1
        })
    }
    return Object.defineProperty(eO, "codes", {
        value: A,
        enumerable: !1
    }), eO.color.close = "\x1B[39m", eO.bgColor.close = "\x1B[49m", eO.color.ansi = $f7(), eO.color.ansi256 = Hf7(), eO.color.ansi16m = jf7(), eO.bgColor.ansi = $f7(10), eO.bgColor.ansi256 = Hf7(10), eO.bgColor.ansi16m = jf7(10), Object.defineProperties(eO, {
        rgbToAnsi256: {
            value(q, K, Y) {
                if (q === K && K === Y) {
                    if (q < 8) return 16;
                    if (q > 248) return 231;
                    return Math.round((q - 8) / 247 * 24) + 232
                }
                return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
            },
            enumerable: !1
        },
        hexToRgb: {
            value(q) {
                let K = /[a-f\d]{6}|[a-f\d]{3}/i.exec(q.toString(16));
                if (!K) return [0, 0, 0];
                let [Y] = K;
                if (Y.length === 3) Y = [...Y].map((_) => _ + _).join("");
                let z = Number.parseInt(Y, 16);
                return [z >> 16 & 255, z >> 8 & 255, z & 255]
            },
            enumerable: !1
        },
        hexToAnsi256: {
            value: (q) => eO.rgbToAnsi256(...eO.hexToRgb(q)),
            enumerable: !1
        },
        ansi256ToAnsi: {
            value(q) {
                if (q < 8) return 30 + q;
                if (q < 16) return 90 + (q - 8);
                let K, Y, z;
                if (q >= 232) K = ((q - 232) * 10 + 8) / 255, Y = K, z = K;
                else {
                    q -= 16;
                    let O = q % 36;
                    K = Math.floor(q / 36) / 5, Y = Math.floor(O / 6) / 5, z = O % 6 / 5
                }
                let _ = Math.max(K, Y, z) * 2;
                if (_ === 0) return 30;
                let w = 30 + (Math.round(z) << 2 | Math.round(Y) << 1 | Math.round(K));
                if (_ === 2) w += 60;
                return w
            },
            enumerable: !1
        },
        rgbToAnsi: {
            value: (q, K, Y) => eO.ansi256ToAnsi(eO.rgbToAnsi256(q, K, Y)),
            enumerable: !1
        },
        hexToAnsi: {
            value: (q) => eO.ansi256ToAnsi(eO.hexToAnsi256(q)),
            enumerable: !1
        }
    }), eO
}
// @from(Ln 141055, Col 4)
$f7 = (A = 0) => (q) => `\x1B[${q+A}m`
// @from(Ln 141056, Col 4)
Hf7 = (A = 0) => (q) => `\x1B[${38+A};5;${q}m`
// @from(Ln 141057, Col 4)
jf7 = (A = 0) => (q, K, Y) => `\x1B[${38+A};2;${q};${K};${Y}m`
// @from(Ln 141058, Col 4)
eO
// @from(Ln 141058, Col 8)
ua_
// @from(Ln 141058, Col 13)
eu3
// @from(Ln 141058, Col 18)
Am3
// @from(Ln 141058, Col 23)
ma_
// @from(Ln 141058, Col 28)
Km3
// @from(Ln 141058, Col 33)
hC
// @from(Ln 141059, Col 4)
Jf7 = E(() => {
    eO = {
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
    }, ua_ = Object.keys(eO.modifier), eu3 = Object.keys(eO.color), Am3 = Object.keys(eO.bgColor), ma_ = [...eu3, ...Am3];
    Km3 = qm3(), hC = Km3
})
// @from(Ln 141119, Col 0)
function hL(A, q = globalThis.Deno ? globalThis.Deno.args : MO8.argv) {
    let K = A.startsWith("-") ? "" : A.length === 1 ? "-" : "--",
        Y = q.indexOf(K + A),
        z = q.indexOf("--");
    return Y !== -1 && (z === -1 || Y < z)
}
// @from(Ln 141126, Col 0)
function zm3() {
    if ("FORCE_COLOR" in gH) {
        if (gH.FORCE_COLOR === "true") return 1;
        if (gH.FORCE_COLOR === "false") return 0;
        return gH.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(gH.FORCE_COLOR, 10), 3)
    }
}
// @from(Ln 141134, Col 0)
function _m3(A) {
    if (A === 0) return !1;
    return {
        level: A,
        hasBasic: !0,
        has256: A >= 2,
        has16m: A >= 3
    }
}
// @from(Ln 141144, Col 0)
function wm3(A, {
    streamIsTTY: q,
    sniffFlags: K = !0
} = {}) {
    let Y = zm3();
    if (Y !== void 0) d21 = Y;
    let z = K ? d21 : Y;
    if (z === 0) return 0;
    if (K) {
        if (hL("color=16m") || hL("color=full") || hL("color=truecolor")) return 3;
        if (hL("color=256")) return 2
    }
    if ("TF_BUILD" in gH && "AGENT_NAME" in gH) return 1;
    if (A && !q && z === void 0) return 0;
    let _ = z || 0;
    if (gH.TERM === "dumb") return _;
    if (MO8.platform === "win32") {
        let w = Ym3.release().split(".");
        if (Number(w[0]) >= 10 && Number(w[2]) >= 10586) return Number(w[2]) >= 14931 ? 3 : 2;
        return 1
    }
    if ("CI" in gH) {
        if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((w) => (w in gH))) return 3;
        if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((w) => (w in gH)) || gH.CI_NAME === "codeship") return 1;
        return _
    }
    if ("TEAMCITY_VERSION" in gH) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(gH.TEAMCITY_VERSION) ? 1 : 0;
    if (gH.COLORTERM === "truecolor") return 3;
    if (gH.TERM === "xterm-kitty") return 3;
    if ("TERM_PROGRAM" in gH) {
        let w = Number.parseInt((gH.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (gH.TERM_PROGRAM) {
            case "iTerm.app":
                return w >= 3 ? 3 : 2;
            case "Apple_Terminal":
                return 2
        }
    }
    if (/-256(color)?$/i.test(gH.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(gH.TERM)) return 1;
    if ("COLORTERM" in gH) return 1;
    return _
}
// @from(Ln 141188, Col 0)
function Df7(A, q = {}) {
    let K = wm3(A, {
        streamIsTTY: A && A.isTTY,
        ...q
    });
    return _m3(K)
}
// @from(Ln 141195, Col 4)
gH
// @from(Ln 141195, Col 8)
d21
// @from(Ln 141195, Col 13)
Om3
// @from(Ln 141195, Col 18)
Xf7
// @from(Ln 141196, Col 4)
Pf7 = E(() => {
    ({
        env: gH
    } = MO8);
    if (hL("no-color") || hL("no-colors") || hL("color=false") || hL("color=never")) d21 = 0;
    else if (hL("color") || hL("colors") || hL("color=true") || hL("color=always")) d21 = 1;
    Om3 = {
        stdout: Df7({
            isTTY: Mf7.isatty(1)
        }),
        stderr: Df7({
            isTTY: Mf7.isatty(2)
        })
    }, Xf7 = Om3
})
// @from(Ln 141212, Col 0)
function Wf7(A, q, K) {
    let Y = A.indexOf(q);
    if (Y === -1) return A;
    let z = q.length,
        _ = 0,
        w = "";
    do w += A.slice(_, Y) + q + K, _ = Y + z, Y = A.indexOf(q, _); while (Y !== -1);
    return w += A.slice(_), w
}
// @from(Ln 141222, Col 0)
function Zf7(A, q, K, Y) {
    let z = 0,
        _ = "";
    do {
        let w = A[Y - 1] === "\r";
        _ += A.slice(z, w ? Y - 1 : Y) + q + (w ? `\r
` : `
`) + K, z = Y + 1, Y = A.indexOf(`
`, z)
    } while (Y !== -1);
    return _ += A.slice(z), _
}
// @from(Ln 141234, Col 0)
class WO8 {
    constructor(A) {
        return vf7(A)
    }
}
// @from(Ln 141240, Col 0)
function ux6(A) {
    return vf7(A)
}
// @from(Ln 141243, Col 4)
Gf7
// @from(Ln 141243, Col 9)
ff7
// @from(Ln 141243, Col 14)
DO8
// @from(Ln 141243, Col 19)
yD6
// @from(Ln 141243, Col 24)
xx6
// @from(Ln 141243, Col 29)
Tf7
// @from(Ln 141243, Col 34)
LD6
// @from(Ln 141243, Col 39)
$m3 = (A, q = {}) => {
        if (q.level && !(Number.isInteger(q.level) && q.level >= 0 && q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
        let K = Gf7 ? Gf7.level : 0;
        A.level = q.level === void 0 ? K : q.level
    }
// @from(Ln 141248, Col 4)
vf7 = (A) => {
        let q = (...K) => K.join(" ");
        return $m3(q, A), Object.setPrototypeOf(q, ux6.prototype), q
    }
// @from(Ln 141252, Col 4)
XO8 = (A, q, K, ...Y) => {
        if (A === "rgb") {
            if (q === "ansi16m") return hC[K].ansi16m(...Y);
            if (q === "ansi256") return hC[K].ansi256(hC.rgbToAnsi256(...Y));
            return hC[K].ansi(hC.rgbToAnsi(...Y))
        }
        if (A === "hex") return XO8("rgb", q, K, ...hC.hexToRgb(...Y));
        return hC[K][A](...Y)
    }
// @from(Ln 141261, Col 4)
Hm3
// @from(Ln 141261, Col 9)
jm3
// @from(Ln 141261, Col 14)
PO8 = (A, q, K) => {
        let Y, z;
        if (K === void 0) Y = A, z = q;
        else Y = K.openAll + A, z = q + K.closeAll;
        return {
            open: A,
            close: q,
            openAll: Y,
            closeAll: z,
            parent: K
        }
    }
// @from(Ln 141273, Col 4)
c21 = (A, q, K) => {
        let Y = (...z) => Jm3(Y, z.length === 1 ? "" + z[0] : z.join(" "));
        return Object.setPrototypeOf(Y, jm3), Y[DO8] = A, Y[yD6] = q, Y[xx6] = K, Y
    }
// @from(Ln 141277, Col 4)
Jm3 = (A, q) => {
        if (A.level <= 0 || !q) return A[xx6] ? "" : q;
        let K = A[yD6];
        if (K === void 0) return q;
        let {
            openAll: Y,
            closeAll: z
        } = K;
        if (q.includes("\x1B"))
            while (K !== void 0) q = Wf7(q, K.close, K.open), K = K.parent;
        let _ = q.indexOf(`
`);
        if (_ !== -1) q = Zf7(q, z, Y, _);
        return Y + q + z
    }
// @from(Ln 141292, Col 4)
Mm3
// @from(Ln 141292, Col 9)
ia_
// @from(Ln 141292, Col 14)
O1
// @from(Ln 141293, Col 4)
aK = E(() => {
    Jf7();
    Pf7();
    ({
        stdout: Gf7,
        stderr: ff7
    } = Xf7), DO8 = Symbol("GENERATOR"), yD6 = Symbol("STYLER"), xx6 = Symbol("IS_EMPTY"), Tf7 = ["ansi", "ansi", "ansi256", "ansi16m"], LD6 = Object.create(null);
    Object.setPrototypeOf(ux6.prototype, Function.prototype);
    for (let [A, q] of Object.entries(hC)) LD6[A] = {
        get() {
            let K = c21(this, PO8(q.open, q.close, this[yD6]), this[xx6]);
            return Object.defineProperty(this, A, {
                value: K
            }), K
        }
    };
    LD6.visible = {
        get() {
            let A = c21(this, this[yD6], !0);
            return Object.defineProperty(this, "visible", {
                value: A
            }), A
        }
    };
    Hm3 = ["rgb", "hex", "ansi256"];
    for (let A of Hm3) {
        LD6[A] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = PO8(XO8(A, Tf7[K], "color", ...Y), hC.color.close, this[yD6]);
                    return c21(this, z, this[xx6])
                }
            }
        };
        let q = "bg" + A[0].toUpperCase() + A.slice(1);
        LD6[q] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = PO8(XO8(A, Tf7[K], "bgColor", ...Y), hC.bgColor.close, this[yD6]);
                    return c21(this, z, this[xx6])
                }
            }
        }
    }
    jm3 = Object.defineProperties(() => {}, {
        ...LD6,
        level: {
            enumerable: !0,
            get() {
                return this[DO8].level
            },
            set(A) {
                this[DO8].level = A
            }
        }
    });
    Object.defineProperties(ux6.prototype, LD6);
    Mm3 = ux6(), ia_ = ux6({
        level: ff7 ? ff7.level : 0
    }), O1 = Mm3
})
// @from(Ln 141361, Col 0)
function Dq() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
}
// @from(Ln 141365, Col 0)
function yj() {
    if (!Dq()) return !1;
    return ra() === null
}
// @from(Ln 141370, Col 0)
function Dm3(A, q) {
    switch (A) {
        case "free":
            return q === "oauth" ? "Fast mode requires a paid subscription" : "Fast mode unavailable during evaluation. Please purchase credits.";
        case "preference":
            return "Fast mode has been disabled by your organization";
        case "extra_usage_disabled":
            return "Fast mode requires extra usage billing · /extra-usage to enable";
        case "network_error":
            return "Fast mode unavailable due to network connectivity issues";
        case "unknown":
            return "Fast mode is currently unavailable"
    }
}
// @from(Ln 141385, Col 0)
function ra() {
    if (!Dq()) return "Fast mode is not available";
    let A = w8("tengu_penguins_off", null);
    if (A !== null) return k(`Fast mode unavailable: ${A}`), A;
    if (!rY() && w8("tengu_marble_sandcastle", !1)) return "Fast mode requires the native binary · Install from: https://claude.com/product/claude-code";
    if (q7() && pk6()) {
        if (!L8("flagSettings")?.fastMode) return k("Fast mode unavailable: Fast mode is not available in the Agent SDK"), "Fast mode is not available in the Agent SDK"
    }
    if (QA() !== "firstParty") return k("Fast mode unavailable: Fast mode is not available on Bedrock, Vertex, or Foundry"), "Fast mode is not available on Bedrock, Vertex, or Foundry";
    if (Jv.status === "disabled") {
        if (Jv.reason === "network_error" || Jv.reason === "unknown") {
            if (t6(process.env.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS)) return null
        }
        let q = sA() !== null ? "oauth" : "api-key",
            K = Dm3(Jv.reason, q);
        return k(`Fast mode unavailable: ${K}`), K
    }
    return null
}
// @from(Ln 141405, Col 0)
function Bx6() {
    return "opus" + (pH() ? "[1m]" : "")
}
// @from(Ln 141409, Col 0)
function fO8(A) {
    if (!Dq()) return !1;
    if (!yj()) return !1;
    if (!FH(A)) return !1;
    let q = mA();
    if (q.fastModePerSessionOptIn) return !1;
    return q.fastMode === !0
}
// @from(Ln 141418, Col 0)
function FH(A) {
    if (!Dq()) return !1;
    let q = A ?? Mv();
    return H5(q).toLowerCase().includes("opus-4-6")
}
// @from(Ln 141424, Col 0)
function Vf7(A) {
    return l21.add(A), () => {
        l21.delete(A)
    }
}
// @from(Ln 141430, Col 0)
function TO8() {
    if (RD6.status === "cooldown" && Date.now() >= RD6.resetAt) {
        if (Dq() && !ZO8) {
            k("Fast mode cooldown expired, re-enabling fast mode"), ZO8 = !0;
            for (let A of l21) A.onCooldownExpired()
        }
        RD6 = {
            status: "active"
        }
    }
    return RD6
}
// @from(Ln 141443, Col 0)
function kf7(A, q) {
    if (!Dq()) return;
    RD6 = {
        status: "cooldown",
        resetAt: A,
        reason: q
    }, ZO8 = !1;
    let K = A - Date.now();
    k(`Fast mode cooldown triggered (${q}), duration ${Math.round(K/1000)}s`), d("tengu_fast_mode_fallback_triggered", {
        cooldown_duration_ms: K,
        cooldown_reason: q
    });
    for (let Y of l21) Y.onCooldownTriggered(A, q)
}
// @from(Ln 141458, Col 0)
function aq6() {
    RD6 = {
        status: "active"
    }
}
// @from(Ln 141464, Col 0)
function Ef7() {
    if (Jv.status === "disabled") return;
    Jv = {
        status: "disabled",
        reason: "preference"
    }, TA("userSettings", {
        fastMode: void 0
    }), d1((A) => ({
        ...A,
        penguinModeOrgEnabled: !1
    }));
    for (let A of i21) A(!1)
}
// @from(Ln 141478, Col 0)
function yf7(A) {
    return GO8.add(A), () => {
        GO8.delete(A)
    }
}
// @from(Ln 141484, Col 0)
function Xm3(A) {
    switch (A) {
        case "out_of_credits":
            return "Fast mode disabled · extra usage credits exhausted";
        case "org_level_disabled":
        case "org_service_level_disabled":
            return "Fast mode disabled · extra usage disabled by your organization";
        case "org_level_disabled_until":
            return "Fast mode disabled · extra usage spending cap reached";
        case "member_level_disabled":
            return "Fast mode disabled · extra usage disabled for your account";
        case "seat_tier_level_disabled":
        case "seat_tier_zero_credit_limit":
        case "member_zero_credit_limit":
            return "Fast mode disabled · extra usage not available for your plan";
        case "overage_not_provisioned":
        case "no_limits_configured":
            return "Fast mode requires extra usage billing · /extra-usage to enable";
        default:
            return "Fast mode disabled · extra usage not available"
    }
}
// @from(Ln 141507, Col 0)
function Pm3(A) {
    return A === "org_level_disabled_until" || A === "out_of_credits"
}
// @from(Ln 141511, Col 0)
function Lf7(A) {
    let q = Xm3(A);
    if (k(`Fast mode overage rejection: ${A??"unknown"} — ${q}`), d("tengu_fast_mode_overage_rejected", {
            overage_disabled_reason: A ?? "unknown"
        }), !Pm3(A)) TA("userSettings", {
        fastMode: void 0
    }), d1((K) => ({
        ...K,
        penguinModeOrgEnabled: !1
    }));
    for (let K of GO8) K(q)
}
// @from(Ln 141524, Col 0)
function Jm() {
    return TO8().status === "cooldown"
}
// @from(Ln 141528, Col 0)
function Mm(A, q) {
    let K = Dq() && yj() && !!q && FH(A);
    if (K && Jm()) return "cooldown";
    if (K) return "on";
    return "off"
}
// @from(Ln 141535, Col 0)
function Rf7(A) {
    return i21.add(A), () => {
        i21.delete(A)
    }
}
// @from(Ln 141540, Col 0)
async function Wm3(A) {
    let q = `${P7().BASE_API_URL}/api/claude_code_penguin_mode`,
        K = "accessToken" in A ? {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": DP
        } : {
            "x-api-key": A.apiKey
        };
    return (await X8.get(q, {
        headers: K
    })).data
}
// @from(Ln 141553, Col 0)
function vO8() {
    if (!Dq()) return;
    if (Jv.status !== "pending") return;
    let A = !1,
        q = X1().penguinModeOrgEnabled === !0;
    Jv = A || q ? {
        status: "enabled"
    } : {
        status: "disabled",
        reason: "unknown"
    }
}
// @from(Ln 141565, Col 0)
async function n21() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    if (!Dq()) return;
    if (mx6) return k("Fast mode prefetch in progress, returning in-flight promise"), mx6;
    let A = RV();
    if (!(sA()?.accessToken && XG()) && !A) {
        Jv = X1().penguinModeOrgEnabled === !0 ? {
            status: "enabled"
        } : {
            status: "disabled",
            reason: "preference"
        };
        return
    }
    let K = Date.now();
    if (K - Nf7 < Zm3) {
        k("Skipping fast mode prefetch, fetched recently");
        return
    }
    Nf7 = K;
    let Y = async () => {
        let _ = sA(),
            w = _?.accessToken && XG() ? {
                accessToken: _.accessToken
            } : A ? {
                apiKey: A
            } : null;
        if (!w) throw Error("No auth available");
        return Wm3(w)
    };
    async function z() {
        try {
            let _;
            try {
                _ = await Y()
            } catch (O) {
                if (X8.isAxiosError(O) && (O.response?.status === 401 || O.response?.status === 403 && typeof O.response?.data === "string" && O.response.data.includes("OAuth token has been revoked"))) {
                    let H = sA()?.accessToken;
                    if (H) await DG(H), _ = await Y();
                    else throw O
                } else throw O
            }
            let w = Jv.status !== "pending" ? Jv.status === "enabled" : X1().penguinModeOrgEnabled;
            if (Jv = _.enabled ? {
                    status: "enabled"
                } : {
                    status: "disabled",
                    reason: _.disabled_reason ?? "preference"
                }, w !== _.enabled) {
                if (!_.enabled) TA("userSettings", {
                    fastMode: void 0
                });
                d1((O) => ({
                    ...O,
                    penguinModeOrgEnabled: _.enabled
                }));
                for (let O of i21) O(_.enabled)
            }
            k(`Org fast mode: ${_.enabled?"enabled":`disabled (${_.disabled_reason??"preference"})`}`)
        } catch (_) {
            Jv = X1().penguinModeOrgEnabled === !0 ? {
                status: "enabled"
            } : {
                status: "disabled",
                reason: "network_error"
            }, k(`Failed to fetch org fast mode status, defaulting to ${Jv.status==="enabled"?"enabled (cached)":"disabled (network_error)"}: ${_}`, {
                level: "error"
            }), d("tengu_org_penguin_mode_fetch_failed", {})
        } finally {
            mx6 = null
        }
    }
    return mx6 = z(), mx6
}
// @from(Ln 141639, Col 4)
Ok = "Opus 4.6"
// @from(Ln 141640, Col 4)
RD6
// @from(Ln 141640, Col 9)
ZO8 = !1
// @from(Ln 141641, Col 4)
l21
// @from(Ln 141641, Col 9)
GO8
// @from(Ln 141641, Col 14)
Jv
// @from(Ln 141641, Col 18)
i21
// @from(Ln 141641, Col 23)
Zm3 = 30000
// @from(Ln 141642, Col 4)
Nf7 = 0
// @from(Ln 141643, Col 4)
mx6 = null
// @from(Ln 141644, Col 4)
FW = E(() => {
    kK();
    i8();
    V1();
    H1();
    T1();
    fA();
    Nz();
    z4();
    HA();
    F5();
    k8();
    A8();
    RD6 = {
        status: "active"
    }, l21 = new Set;
    GO8 = new Set;
    Jv = {
        status: "pending"
    }, i21 = new Set
})
// @from(Ln 141666, Col 0)
function NO8(A) {
    let q = d2();
    if (q.lastSessionId !== A) return;
    let K;
    if (q.lastModelUsage) K = Object.fromEntries(Object.entries(q.lastModelUsage).map(([Y, z]) => [Y, {
        ...z,
        contextWindow: uM(Y, Zj()),
        maxOutputTokens: oa(Y).default
    }]));
    return {
        totalCostUSD: q.lastCost ?? 0,
        totalAPIDuration: q.lastAPIDuration ?? 0,
        totalAPIDurationWithoutRetries: q.lastAPIDurationWithoutRetries ?? 0,
        totalToolDuration: q.lastToolDuration ?? 0,
        totalLinesAdded: q.lastLinesAdded ?? 0,
        totalLinesRemoved: q.lastLinesRemoved ?? 0,
        lastDuration: q.lastDuration,
        modelUsage: K
    }
}
// @from(Ln 141687, Col 0)
function r21(A) {
    let q = NO8(A);
    if (!q) return !1;
    return xk6(q), !0
}
// @from(Ln 141693, Col 0)
function o21(A) {
    c2((q) => ({
        ...q,
        lastCost: LD(),
        lastAPIDuration: OV(),
        lastAPIDurationWithoutRetries: sx1(),
        lastToolDuration: tx1(),
        lastDuration: Iw6(),
        lastLinesAdded: n86(),
        lastLinesRemoved: r86(),
        lastTotalInputTokens: o86(),
        lastTotalOutputTokens: Mp(),
        lastTotalCacheCreationInputTokens: bk6(),
        lastTotalCacheReadInputTokens: Ik6(),
        lastTotalWebSearchRequests: Ou1(),
        lastFpsAverage: A?.averageFps,
        lastFpsLow1Pct: A?.low1PctFps,
        lastModelUsage: Object.fromEntries(Object.entries($S()).map(([K, Y]) => [K, {
            inputTokens: Y.inputTokens,
            outputTokens: Y.outputTokens,
            cacheReadInputTokens: Y.cacheReadInputTokens,
            cacheCreationInputTokens: Y.cacheCreationInputTokens,
            webSearchRequests: Y.webSearchRequests,
            costUSD: Y.costUSD
        }])),
        lastSessionId: R1()
    }))
}
// @from(Ln 141722, Col 0)
function gx6(A, q = 4) {
    return `$${A>0.5?fm3(A,100).toFixed(2):A.toFixed(q)}`
}
// @from(Ln 141726, Col 0)
function Gm3() {
    let A = $S();
    if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
    let q = {};
    for (let [Y, z] of Object.entries(A)) {
        let _ = IY(Y);
        if (!q[_]) q[_] = {
            inputTokens: 0,
            outputTokens: 0,
            cacheReadInputTokens: 0,
            cacheCreationInputTokens: 0,
            webSearchRequests: 0,
            costUSD: 0,
            contextWindow: 0,
            maxOutputTokens: 0
        };
        let w = q[_];
        w.inputTokens += z.inputTokens, w.outputTokens += z.outputTokens, w.cacheReadInputTokens += z.cacheReadInputTokens, w.cacheCreationInputTokens += z.cacheCreationInputTokens, w.webSearchRequests += z.webSearchRequests, w.costUSD += z.costUSD
    }
    let K = "Usage by model:";
    for (let [Y, z] of Object.entries(q)) {
        let _ = `  ${fq(z.inputTokens)} input, ${fq(z.outputTokens)} output, ${fq(z.cacheReadInputTokens)} cache read, ${fq(z.cacheCreationInputTokens)} cache write` + (z.webSearchRequests > 0 ? `, ${fq(z.webSearchRequests)} web search` : "") + ` (${gx6(z.costUSD)})`;
        K += `
` + `${Y}:`.padStart(21) + _
    }
    return K
}
// @from(Ln 141754, Col 0)
function a21() {
    let A = gx6(LD()) + (ju1() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
        q = Gm3();
    return O1.dim(`Total cost:            ${A}
Total duration (API):  ${UK(OV())}
Total duration (wall): ${UK(Iw6())}
Total code changes:    ${n86()} ${n86()===1?"line":"lines"} added, ${r86()} ${r86()===1?"line":"lines"} removed
${q}`)
}
// @from(Ln 141764, Col 0)
function fm3(A, q) {
    return Math.round(A * q) / q
}