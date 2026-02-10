
// @from(Ln 47539, Col 4)
Ls1 = v(() => {
    i7();
    sw1();
    a$K = u.object({
        type: u.literal("command").describe("Bash command hook type"),
        command: u.string().describe("Shell command to execute"),
        timeout: u.number().positive().optional().describe("Timeout in seconds for this specific command"),
        statusMessage: u.string().optional().describe("Custom status message to display in spinner while hook runs"),
        once: u.boolean().optional().describe("If true, hook runs once and is removed after execution"),
        async: u.boolean().optional().describe("If true, hook runs in background without blocking")
    }), s$K = u.object({
        type: u.literal("prompt").describe("LLM prompt hook type"),
        prompt: u.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
        timeout: u.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
        model: u.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses the default small fast model.'),
        statusMessage: u.string().optional().describe("Custom status message to display in spinner while hook runs"),
        once: u.boolean().optional().describe("If true, hook runs once and is removed after execution")
    }), t$K = u.object({
        type: u.literal("agent").describe("Agentic verifier hook type"),
        prompt: u.string().transform((A) => (q) => A).describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
        timeout: u.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
        model: u.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses Haiku.'),
        statusMessage: u.string().optional().describe("Custom status message to display in spinner while hook runs"),
        once: u.boolean().optional().describe("If true, hook runs once and is removed after execution")
    }), uw8 = u.discriminatedUnion("type", [a$K, s$K, t$K]), Bw8 = u.object({
        matcher: u.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
        hooks: u.array(uw8).describe("List of hooks to execute when the matcher matches")
    }), Xk = u.partialRecord(u.enum(ax), u.array(Bw8))
})
// @from(Ln 47568, Col 4)
KF6
// @from(Ln 47568, Col 9)
goz
// @from(Ln 47568, Col 14)
YF6
// @from(Ln 47568, Col 19)
mw8
// @from(Ln 47568, Col 24)
e$K
// @from(Ln 47568, Col 29)
AOK
// @from(Ln 47568, Col 34)
qOK
// @from(Ln 47568, Col 39)
KOK
// @from(Ln 47568, Col 44)
YOK
// @from(Ln 47568, Col 49)
zOK
// @from(Ln 47568, Col 54)
wOK
// @from(Ln 47568, Col 59)
sx
// @from(Ln 47568, Col 63)
Fw8
// @from(Ln 47569, Col 4)
YA1 = v(() => {
    i7();
    KF6 = u.enum(["local", "user", "project", "dynamic", "enterprise", "claudeai", "managed"]), goz = u.enum(["stdio", "sse", "sse-ide", "http", "ws", "sdk"]), YF6 = u.object({
        type: u.literal("stdio").optional(),
        command: u.string().min(1, "Command cannot be empty"),
        args: u.array(u.string()).default([]),
        env: u.record(u.string(), u.string()).optional()
    }), mw8 = u.object({
        clientId: u.string(),
        callbackPort: u.number().int().positive().optional()
    }), e$K = u.object({
        type: u.literal("sse"),
        url: u.string(),
        headers: u.record(u.string(), u.string()).optional(),
        headersHelper: u.string().optional(),
        oauth: mw8.optional()
    }), AOK = u.object({
        type: u.literal("sse-ide"),
        url: u.string(),
        ideName: u.string(),
        ideRunningInWindows: u.boolean().optional()
    }), qOK = u.object({
        type: u.literal("ws-ide"),
        url: u.string(),
        ideName: u.string(),
        authToken: u.string().optional(),
        ideRunningInWindows: u.boolean().optional()
    }), KOK = u.object({
        type: u.literal("http"),
        url: u.string(),
        headers: u.record(u.string(), u.string()).optional(),
        headersHelper: u.string().optional(),
        oauth: mw8.optional()
    }), YOK = u.object({
        type: u.literal("ws"),
        url: u.string(),
        headers: u.record(u.string(), u.string()).optional(),
        headersHelper: u.string().optional()
    }), zOK = u.object({
        type: u.literal("sdk"),
        name: u.string()
    }), wOK = u.object({
        type: u.literal("claudeai-proxy"),
        url: u.string(),
        id: u.string()
    }), sx = u.union([YF6, e$K, AOK, qOK, KOK, YOK, zOK, wOK]), Fw8 = u.object({
        mcpServers: u.record(u.string(), sx)
    })
})
// @from(Ln 47619, Col 0)
function yv1(A, q) {
    let K = A.toLowerCase();
    return q.autoUpdate ?? (NT.has(K) && !HOK.has(K))
}
// @from(Ln 47624, Col 0)
function _OK(A) {
    if (NT.has(A.toLowerCase())) return !1;
    if (OOK.test(A)) return !0;
    return $OK.test(A)
}
// @from(Ln 47630, Col 0)
function pw8(A, q) {
    let K = A.toLowerCase();
    if (!NT.has(K)) return null;
    if (q.source === "github") {
        if (!(q.repo || "").toLowerCase().startsWith(`${Rs1}/`)) return `The name '${A}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${Rs1}/' can use this name.`;
        return null
    }
    if (q.source === "git" && q.url) {
        let Y = q.url.toLowerCase(),
            z = Y.includes("github.com/anthropics/"),
            w = Y.includes("git@github.com:anthropics/");
        if (z || w) return null;
        return `The name '${A}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${Rs1}/' can use this name.`
    }
    return `The name '${A}' is reserved for official Anthropic marketplaces and can only be used with GitHub sources from the '${Rs1}' organization.`
}
// @from(Ln 47647, Col 0)
function tx(A) {
    return typeof A === "string" && A.startsWith("./")
}
// @from(Ln 47650, Col 4)
NT
// @from(Ln 47650, Col 8)
HOK
// @from(Ln 47650, Col 13)
$OK
// @from(Ln 47650, Col 18)
OOK
// @from(Ln 47650, Col 23)
Rs1 = "anthropics"
// @from(Ln 47651, Col 4)
SQ
// @from(Ln 47651, Col 8)
tw1
// @from(Ln 47651, Col 13)
Qw8
// @from(Ln 47651, Col 18)
zF6
// @from(Ln 47651, Col 23)
wF6
// @from(Ln 47651, Col 28)
dw8
// @from(Ln 47651, Col 33)
JOK
// @from(Ln 47651, Col 38)
cw8
// @from(Ln 47651, Col 43)
XOK
// @from(Ln 47651, Col 48)
DOK
// @from(Ln 47651, Col 53)
jOK
// @from(Ln 47651, Col 58)
MOK
// @from(Ln 47651, Col 63)
POK
// @from(Ln 47651, Col 68)
WOK
// @from(Ln 47651, Col 73)
GOK
// @from(Ln 47651, Col 78)
gw8
// @from(Ln 47651, Col 83)
ZOK
// @from(Ln 47651, Col 88)
ew1
// @from(Ln 47651, Col 93)
fOK
// @from(Ln 47651, Col 98)
wA1
// @from(Ln 47651, Col 103)
lw8
// @from(Ln 47651, Col 108)
Cv1
// @from(Ln 47651, Col 113)
Uw8
// @from(Ln 47651, Col 118)
VOK
// @from(Ln 47651, Col 123)
NOK
// @from(Ln 47651, Col 128)
AH1
// @from(Ln 47651, Col 133)
zA1
// @from(Ln 47651, Col 138)
loz
// @from(Ln 47651, Col 143)
TOK
// @from(Ln 47651, Col 148)
Sv1
// @from(Ln 47651, Col 153)
vOK
// @from(Ln 47651, Col 158)
EOK
// @from(Ln 47651, Col 163)
hv1
// @from(Ln 47651, Col 168)
ioz
// @from(Ln 47651, Col 173)
kOK
// @from(Ln 47651, Col 178)
HF6
// @from(Ln 47652, Col 4)
N0 = v(() => {
    i7();
    Ls1();
    YA1();
    NT = new Set(["claude-code-marketplace", "claude-code-plugins", "claude-plugins-official", "anthropic-marketplace", "anthropic-plugins", "agent-skills", "life-sciences", "knowledge-work-plugins"]), HOK = new Set(["knowledge-work-plugins"]);
    $OK = /(?:official[^a-z0-9]*(anthropic|claude)|(?:anthropic|claude)[^a-z0-9]*official|^(?:anthropic|claude)[^a-z0-9]*(marketplace|plugins|official))/i, OOK = /[^\u0020-\u007E]/;
    SQ = u.string().startsWith("./"), tw1 = SQ.endsWith(".json"), Qw8 = u.union([SQ.refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
        message: "MCPB file path must end with .mcpb or .dxt"
    }).describe("Path to MCPB file relative to plugin root"), u.string().url().refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
        message: "MCPB URL must end with .mcpb or .dxt"
    }).describe("URL to MCPB file")]), zF6 = SQ.endsWith(".md"), wF6 = u.union([zF6, SQ]), dw8 = u.object({
        name: u.string().min(1, "Author name cannot be empty").describe("Display name of the plugin author or organization"),
        email: u.string().optional().describe("Contact email for support or feedback"),
        url: u.string().optional().describe("Website, GitHub profile, or organization URL")
    }), JOK = u.object({
        name: u.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier for the plugin, used for namespacing (prefer kebab-case)"),
        version: u.string().optional().describe("Semantic version (e.g., 1.2.3) following semver.org specification"),
        description: u.string().optional().describe("Brief, user-facing explanation of what the plugin provides"),
        author: dw8.optional().describe("Information about the plugin creator or maintainer"),
        homepage: u.string().url().optional().describe("Plugin homepage or documentation URL"),
        repository: u.string().optional().describe("Source code repository URL"),
        license: u.string().optional().describe("SPDX license identifier (e.g., MIT, Apache-2.0)"),
        keywords: u.array(u.string()).optional().describe("Tags for plugin discovery and categorization")
    }), cw8 = u.object({
        description: u.string().optional().describe("Brief, user-facing explanation of what these hooks provide"),
        hooks: u.lazy(() => Xk).describe("The hooks provided by the plugin, in the same format as the one used for settings")
    }), XOK = u.object({
        hooks: u.union([tw1.describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), u.lazy(() => Xk).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)"), u.array(u.union([tw1.describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), u.lazy(() => Xk).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)")]))])
    }), DOK = u.object({
        source: wF6.optional().describe("Path to command markdown file, relative to plugin root"),
        content: u.string().optional().describe("Inline markdown content for the command"),
        description: u.string().optional().describe("Command description override"),
        argumentHint: u.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
        model: u.string().optional().describe("Default model for this command"),
        allowedTools: u.array(u.string()).optional().describe("Tools allowed when command runs")
    }).refine((A) => A.source && !A.content || !A.source && A.content, {
        message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both'
    }), jOK = u.object({
        commands: u.union([wF6.describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root"), u.array(wF6.describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional command files or skill directories"), u.record(u.string(), DOK).describe('Object mapping of command names to their metadata and source files. Command name becomes the slash command name (e.g., "about" → "/plugin:about")')])
    }), MOK = u.object({
        agents: u.union([zF6.describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root"), u.array(zF6.describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional agent files")])
    }), POK = u.object({
        skills: u.union([SQ.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"), u.array(SQ.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional skill directories")])
    }), WOK = u.object({
        outputStyles: u.union([SQ.describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root"), u.array(SQ.describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional output styles directories or files")])
    }), GOK = u.object({
        mcpServers: u.union([tw1.describe("MCP servers to include in the plugin (in addition to those in the .mcp.json file, if it exists)"), Qw8.describe("Path or URL to MCPB file containing MCP server configuration"), u.record(u.string(), sx).describe("MCP server configurations keyed by server name"), u.array(u.union([tw1.describe("Path to MCP servers configuration file"), Qw8.describe("Path or URL to MCPB file"), u.record(u.string(), sx).describe("Inline MCP server configurations")])).describe("Array of MCP server configurations (paths, MCPB files, or inline definitions)")])
    }), gw8 = u.string().min(1), ZOK = u.string().min(2).refine((A) => A.startsWith("."), {
        message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
    }), ew1 = u.strictObject({
        command: u.string().min(1).refine((A) => {
            if (A.includes(" ") && !A.startsWith("/")) return !1;
            return !0
        }, {
            message: "Command should not contain spaces. Use args array for arguments."
        }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
        args: u.array(gw8).optional().describe("Command-line arguments to pass to the server"),
        extensionToLanguage: u.record(ZOK, gw8).refine((A) => Object.keys(A).length > 0, {
            message: "extensionToLanguage must have at least one mapping"
        }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
        transport: u.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
        env: u.record(u.string(), u.string()).optional().describe("Environment variables to set when starting the server"),
        initializationOptions: u.unknown().optional().describe("Initialization options passed to the server during initialization"),
        settings: u.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
        workspaceFolder: u.string().optional().describe("Workspace folder path to use for the server"),
        startupTimeout: u.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
        shutdownTimeout: u.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
        restartOnCrash: u.boolean().optional().describe("Whether to restart the server if it crashes"),
        maxRestarts: u.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
    }), fOK = u.object({
        lspServers: u.union([tw1.describe("Path to .lsp.json configuration file relative to plugin root"), u.record(u.string(), ew1).describe("LSP server configurations keyed by server name"), u.array(u.union([tw1.describe("Path to LSP configuration file"), u.record(u.string(), ew1).describe("Inline LSP server configurations")])).describe("Array of LSP server configurations (paths or inline definitions)")])
    }), wA1 = u.object({
        ...JOK.shape,
        ...XOK.partial().shape,
        ...jOK.partial().shape,
        ...MOK.partial().shape,
        ...POK.partial().shape,
        ...WOK.partial().shape,
        ...GOK.partial().shape,
        ...fOK.partial().shape
    }).strict(), lw8 = u.string().refine((A) => !A.includes("..") && !A.includes("//"), "Package name cannot contain path traversal patterns").refine((A) => {
        let q = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/,
            K = /^[a-z0-9][a-z0-9-._]*$/;
        return q.test(A) || K.test(A)
    }, "Invalid npm package name format"), Cv1 = u.discriminatedUnion("source", [u.object({
        source: u.literal("url"),
        url: u.string().url().describe("Direct URL to marketplace.json file"),
        headers: u.record(u.string(), u.string()).optional().describe("Custom HTTP headers (e.g., for authentication)")
    }), u.object({
        source: u.literal("github"),
        repo: u.string().describe("GitHub repository in owner/repo format"),
        ref: u.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: u.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)")
    }), u.object({
        source: u.literal("git"),
        url: u.string().endsWith(".git").describe("Full git repository URL"),
        ref: u.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: u.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)")
    }), u.object({
        source: u.literal("npm"),
        package: lw8.describe("NPM package containing marketplace.json")
    }), u.object({
        source: u.literal("file"),
        path: u.string().describe("Local file path to marketplace.json")
    }), u.object({
        source: u.literal("directory"),
        path: u.string().describe("Local directory containing .claude-plugin/marketplace.json")
    }), u.object({
        source: u.literal("hostPattern"),
        hostPattern: u.string().describe('Regex pattern to match the host/domain extracted from any marketplace source type. For github sources, matches against "github.com". For git sources (SSH or HTTPS), extracts the hostname from the URL. Use in strictKnownMarketplaces to allow all marketplaces from a specific host (e.g., "^github\\.mycompany\\.com$").')
    })]), Uw8 = u.string().length(40).regex(/^[a-f0-9]{40}$/, "Must be a full 40-character lowercase git commit SHA"), VOK = u.union([SQ.describe("Path to the plugin root, relative to the marketplace directory"), u.object({
        source: u.literal("npm"),
        package: lw8.or(u.string()).describe("Package name (or url, or local path, or anything else that can be passed to `npm` as a package)"),
        version: u.string().optional().describe("Specific version or version range (e.g., ^1.0.0, ~2.1.0)"),
        registry: u.string().url().optional().describe("Custom NPM registry URL (defaults to using system default, likely npmjs.org)")
    }).describe("NPM package as plugin source"), u.object({
        source: u.literal("pip"),
        package: u.string().describe("Python package name as it appears on PyPI"),
        version: u.string().optional().describe("Version specifier (e.g., ==1.0.0, >=2.0.0, <3.0.0)"),
        registry: u.string().url().optional().describe("Custom PyPI registry URL (defaults to using system default, likely pypi.org)")
    }).describe("Python package as plugin source"), u.object({
        source: u.literal("url"),
        url: u.string().endsWith(".git").describe("Full git repository URL (https:// or git@)"),
        ref: u.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: Uw8.optional().describe("Specific commit SHA to use")
    }), u.object({
        source: u.literal("github"),
        repo: u.string().describe("GitHub repository in owner/repo format"),
        ref: u.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: Uw8.optional().describe("Specific commit SHA to use")
    })]);
    NOK = wA1.partial().extend({
        name: u.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier matching the plugin name"),
        source: VOK.describe("Where to fetch the plugin from"),
        category: u.string().optional().describe('Category for organizing plugins (e.g., "productivity", "development")'),
        tags: u.array(u.string()).optional().describe("Tags for searchability and discovery"),
        strict: u.boolean().optional().default(!0).describe("Require the plugin manifest to be present in the plugin folder. If false, the marketplace entry provides the manifest.")
    }).strict(), AH1 = u.object({
        name: u.string().min(1, "Marketplace must have a name").refine((A) => !A.includes(" "), {
            message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")'
        }).refine((A) => !_OK(A), {
            message: 'Marketplace name cannot impersonate official Anthropic/Claude marketplaces. Names containing "official", "anthropic", or "claude" in official-sounding combinations are reserved.'
        }),
        owner: dw8.describe("Marketplace maintainer or curator information"),
        plugins: u.array(NOK).describe("Collection of available plugins in this marketplace"),
        metadata: u.object({
            pluginRoot: u.string().optional().describe("Base path for relative plugin sources"),
            version: u.string().optional().describe("Marketplace version"),
            description: u.string().optional().describe("Marketplace description")
        }).optional().describe("Optional marketplace metadata")
    }), zA1 = u.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, "Plugin ID must be in format: plugin@marketplace"), loz = u.union([zA1, u.object({
        id: zA1.describe('Plugin identifier (e.g., "formatter@tools")'),
        version: u.string().optional().describe('Version constraint (e.g., "^2.0.0")'),
        required: u.boolean().optional().describe("If true, cannot be disabled"),
        config: u.record(u.string(), u.unknown()).optional().describe("Plugin-specific configuration")
    })]), TOK = u.object({
        version: u.string().describe("Currently installed version"),
        installedAt: u.string().describe("ISO 8601 timestamp of installation"),
        lastUpdated: u.string().optional().describe("ISO 8601 timestamp of last update"),
        installPath: u.string().describe("Absolute path to the installed plugin directory"),
        gitCommitSha: u.string().optional().describe("Git commit SHA for git-based plugins (for version tracking)")
    }), Sv1 = u.object({
        version: u.literal(1).describe("Schema version 1"),
        plugins: u.record(zA1, TOK).describe("Map of plugin IDs to their installation metadata")
    }), vOK = u.enum(["managed", "user", "project", "local"]), EOK = u.object({
        scope: vOK.describe("Installation scope"),
        projectPath: u.string().optional().describe("Project path (required for project/local scopes)"),
        installPath: u.string().describe("Absolute path to the versioned plugin directory"),
        version: u.string().optional().describe("Currently installed version"),
        installedAt: u.string().optional().describe("ISO 8601 timestamp of installation"),
        lastUpdated: u.string().optional().describe("ISO 8601 timestamp of last update"),
        gitCommitSha: u.string().optional().describe("Git commit SHA for git-based plugins")
    }), hv1 = u.object({
        version: u.literal(2).describe("Schema version 2"),
        plugins: u.record(zA1, u.array(EOK)).describe("Map of plugin IDs to arrays of installation entries")
    }), ioz = u.union([Sv1, hv1]), kOK = u.object({
        source: Cv1.describe("Where to fetch the marketplace from"),
        installLocation: u.string().describe("Local cache path where marketplace manifest is stored"),
        lastUpdated: u.string().describe("ISO 8601 timestamp of last marketplace refresh"),
        autoUpdate: u.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
    }), HF6 = u.record(u.string(), kOK)
})
// @from(Ln 47838, Col 4)
LOK
// @from(Ln 47838, Col 9)
iw8
// @from(Ln 47839, Col 4)
nw8 = v(() => {
    i7();
    LOK = u.object({
        allowedDomains: u.array(u.string()).optional(),
        allowManagedDomainsOnly: u.boolean().optional().describe("When true (and set in managed settings), only allowedDomains and WebFetch(domain:...) allow rules from managed settings are respected. User, project, local, and flag settings domains are ignored. Denied domains are still respected from all sources."),
        allowUnixSockets: u.array(u.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: u.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: u.boolean().optional(),
        httpProxyPort: u.number().optional(),
        socksProxyPort: u.number().optional()
    }).optional(), iw8 = u.object({
        enabled: u.boolean().optional(),
        autoAllowBashIfSandboxed: u.boolean().optional(),
        allowUnsandboxedCommands: u.boolean().optional().describe("Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. When false, the dangerouslyDisableSandbox parameter is completely ignored and all commands must run sandboxed. Default: true."),
        network: LOK,
        ignoreViolations: u.record(u.string(), u.array(u.string())).optional(),
        enableWeakerNestedSandbox: u.boolean().optional(),
        excludedCommands: u.array(u.string()).optional(),
        ripgrep: u.object({
            command: u.string(),
            args: u.array(u.string()).optional()
        }).optional().describe("Custom ripgrep configuration for bundled ripgrep support")
    }).passthrough()
})
// @from(Ln 47864, Col 0)
function qH1(A) {
    return "serverName" in A && A.serverName !== void 0
}
// @from(Ln 47868, Col 0)
function ys1(A) {
    return "serverCommand" in A && A.serverCommand !== void 0
}
// @from(Ln 47872, Col 0)
function Cs1(A) {
    return "serverUrl" in A && A.serverUrl !== void 0
}
// @from(Ln 47875, Col 4)
ROK
// @from(Ln 47875, Col 9)
yOK
// @from(Ln 47875, Col 14)
COK
// @from(Ln 47875, Col 19)
SOK
// @from(Ln 47875, Col 24)
hOK
// @from(Ln 47875, Col 29)
Dk
// @from(Ln 47876, Col 4)
hQ = v(() => {
    i7();
    oj();
    Iw8();
    E$();
    N0();
    nw8();
    Ls1();
    Ls1();
    ROK = u.record(u.string(), u.coerce.string()), yOK = u.object({
        allow: u.array(ks1).optional().describe("List of permission rules for allowed operations"),
        deny: u.array(ks1).optional().describe("List of permission rules for denied operations"),
        ask: u.array(ks1).optional().describe("List of permission rules that should always prompt for confirmation"),
        defaultMode: u.enum(qA1).optional().describe("Default permission mode when Claude Code needs access"),
        disableBypassPermissionsMode: u.enum(["disable"]).optional().describe("Disable the ability to bypass permission prompts"),
        additionalDirectories: u.array(u.string()).optional().describe("Additional directories to include in the permission scope")
    }).passthrough(), COK = u.object({
        source: Cv1.describe("Where to fetch the marketplace from"),
        installLocation: u.string().optional().describe("Local cache path where marketplace manifest is stored (auto-generated if not provided)")
    }), SOK = u.object({
        serverName: u.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
        serverCommand: u.array(u.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers"),
        serverUrl: u.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for allowed remote MCP servers')
    }).refine((A) => {
        return [A.serverName !== void 0, A.serverCommand !== void 0, A.serverUrl !== void 0].filter(Boolean).length === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    }), hOK = u.object({
        serverName: u.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that is explicitly blocked"),
        serverCommand: u.array(u.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for blocked stdio servers"),
        serverUrl: u.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for blocked remote MCP servers')
    }).refine((A) => {
        return [A.serverName !== void 0, A.serverCommand !== void 0, A.serverUrl !== void 0].filter(Boolean).length === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    }), Dk = u.object({
        $schema: u.literal(Ez8).optional().describe("JSON Schema reference for Claude Code settings"),
        apiKeyHelper: u.string().optional().describe("Path to a script that outputs authentication values"),
        awsCredentialExport: u.string().optional().describe("Path to a script that exports AWS credentials"),
        awsAuthRefresh: u.string().optional().describe("Path to a script that refreshes AWS authentication"),
        fileSuggestion: u.object({
            type: u.literal("command"),
            command: u.string()
        }).optional().describe("Custom file suggestion configuration for @ mentions"),
        respectGitignore: u.boolean().optional().describe("Whether file picker should respect .gitignore files (default: true). Note: .ignore files are always respected."),
        cleanupPeriodDays: u.number().nonnegative().int().optional().describe("Number of days to retain chat transcripts (0 to disable cleanup)"),
        env: ROK.optional().describe("Environment variables to set for Claude Code sessions"),
        attribution: u.object({
            commit: u.string().optional().describe("Attribution text for git commits, including any trailers. Empty string hides attribution."),
            pr: u.string().optional().describe("Attribution text for pull request descriptions. Empty string hides attribution.")
        }).optional().describe("Customize attribution text for commits and PRs. Each field defaults to the standard Claude Code attribution if not set."),
        includeCoAuthoredBy: u.boolean().optional().describe("Deprecated: Use attribution instead. Whether to include Claude's co-authored by attribution in commits and PRs (defaults to true)"),
        permissions: yOK.optional().describe("Tool usage permissions configuration"),
        model: u.string().optional().describe("Override the default model used by Claude Code"),
        enableAllProjectMcpServers: u.boolean().optional().describe("Whether to automatically approve all MCP servers in the project"),
        enabledMcpjsonServers: u.array(u.string()).optional().describe("List of approved MCP servers from .mcp.json"),
        disabledMcpjsonServers: u.array(u.string()).optional().describe("List of rejected MCP servers from .mcp.json"),
        allowedMcpServers: u.array(SOK).optional().describe("Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied."),
        deniedMcpServers: u.array(hOK).optional().describe("Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied."),
        hooks: Xk.optional().describe("Custom commands to run before/after tool executions"),
        worktree: u.object({
            symlinkDirectories: u.array(u.string()).optional().describe('Directories to symlink from main repository to worktrees to avoid disk bloat. Must be explicitly configured - no directories are symlinked by default. Common examples: "node_modules", ".cache", ".bin"')
        }).optional().describe("Git worktree configuration for --worktree flag. Symlinks prevent duplicating large directories like node_modules across worktrees."),
        disableAllHooks: u.boolean().optional().describe("Disable all hooks and statusLine execution"),
        allowManagedHooksOnly: u.boolean().optional().describe("When true (and set in managed settings), only hooks from managed settings run. User, project, and local hooks are ignored."),
        allowManagedPermissionRulesOnly: u.boolean().optional().describe("When true (and set in managed settings), only permission rules (allow/deny/ask) from managed settings are respected. User, project, local, and CLI argument permission rules are ignored."),
        statusLine: u.object({
            type: u.literal("command"),
            command: u.string(),
            padding: u.number().optional()
        }).optional().describe("Custom status line display configuration"),
        enabledPlugins: u.record(u.string(), u.union([u.array(u.string()), u.boolean(), u.undefined()])).optional().describe('Enabled plugins using plugin-id@marketplace-id format. Example: { "formatter@anthropic-tools": true }. Also supports extended format with version constraints.'),
        extraKnownMarketplaces: u.record(u.string(), COK).optional().describe("Additional marketplaces to make available for this repository. Typically used in repository .claude/settings.json to ensure team members have required plugin sources."),
        strictKnownMarketplaces: u.array(Cv1).optional().describe("Enterprise strict list of allowed marketplace sources. When set in managed settings, ONLY these exact sources can be added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
        blockedMarketplaces: u.array(Cv1).optional().describe("Enterprise blocklist of marketplace sources. When set in managed settings, these exact sources are blocked from being added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
        forceLoginMethod: u.enum(["claudeai", "console"]).optional().describe('Force a specific login method: "claudeai" for Claude Pro/Max, "console" for Console billing'),
        forceLoginOrgUUID: u.string().optional().describe("Organization UUID to use for OAuth login"),
        otelHeadersHelper: u.string().optional().describe("Path to a script that outputs OpenTelemetry headers"),
        outputStyle: u.string().optional().describe("Controls the output style for assistant responses"),
        language: u.string().optional().describe('Preferred language for Claude responses (e.g., "japanese", "spanish")'),
        skipWebFetchPreflight: u.boolean().optional().describe("Skip the WebFetch blocklist check for enterprise environments with restrictive security policies"),
        sandbox: iw8.optional(),
        spinnerTipsEnabled: u.boolean().optional().describe("Whether to show tips in the spinner"),
        spinnerVerbs: u.object({
            mode: u.enum(["append", "replace"]),
            verbs: u.array(u.string())
        }).optional().describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),
        syntaxHighlightingDisabled: u.boolean().optional().describe("Whether to disable syntax highlighting in diffs"),
        terminalTitleFromRename: u.boolean().optional().describe("When true, terminal tab title is set from /rename and not auto-updated based on the conversation topic"),
        alwaysThinkingEnabled: u.boolean().optional().describe("When false, thinking is disabled. When absent or true, thinking is enabled automatically for supported models."),
        fastMode: u.boolean().optional().describe("When true, fast mode is enabled. When absent or false, fast mode is off."),
        promptSuggestionEnabled: u.boolean().optional().describe("When false, prompt suggestions are disabled. When absent or true, prompt suggestions are enabled."),
        agent: u.string().optional().describe("Name of an agent (built-in or custom) to use for the main thread. Applies the agent's system prompt, tool restrictions, and model."),
        companyAnnouncements: u.array(u.string()).optional().describe("Company announcements to display at startup (one will be randomly selected if multiple are provided)"),
        pluginConfigs: u.record(u.string(), u.object({
            mcpServers: u.record(u.string(), u.record(u.string(), u.union([u.string(), u.number(), u.boolean(), u.array(u.string())]))).optional().describe("User configuration values for MCP servers keyed by server name")
        })).optional().describe("Per-plugin configuration including MCP server user configs, keyed by plugin ID (plugin@marketplace format)"),
        remote: u.object({
            defaultEnvironmentId: u.string().optional().describe("Default environment ID to use for remote sessions")
        }).optional().describe("Remote session configuration"),
        autoUpdatesChannel: u.enum(["latest", "stable"]).optional().describe("Release channel for auto-updates (latest or stable)"),
        minimumVersion: u.string().optional().describe("Minimum version to stay on - prevents downgrades when switching to stable channel"),
        plansDirectory: u.string().optional().describe("Custom directory for plan files, relative to project root. If not set, defaults to ~/.claude/plans/"),
        ...{},
        prefersReducedMotion: u.boolean().optional().describe("Reduce or disable animations for accessibility (spinner shimmer, flash effects, etc.)"),
        autoMemoryEnabled: u.boolean().optional().describe("Enable auto-memory for this project. When false, Claude will not read from or write to the auto-memory directory.")
    }).passthrough()
})
// @from(Ln 47990, Col 0)
async function $F6(A, q, K, Y) {
    try {
        let z = await IOK(xOK(A, "config"), "utf-8");
        return bOK(z, q, K, Y)
    } catch {
        return null
    }
}
// @from(Ln 47999, Col 0)
function bOK(A, q, K, Y) {
    let z = A.split(`
`),
        w = q.toLowerCase(),
        H = Y.toLowerCase(),
        $ = !1;
    for (let O of z) {
        let _ = O.trim();
        if (_.length === 0 || _[0] === "#" || _[0] === ";") continue;
        if (_[0] === "[") {
            $ = FOK(_, w, K);
            continue
        }
        if (!$) continue;
        let J = uOK(_);
        if (J && J.key.toLowerCase() === H) return J.value
    }
    return null
}
// @from(Ln 48019, Col 0)
function uOK(A) {
    let q = 0;
    while (q < A.length && QOK(A[q])) q++;
    if (q === 0) return null;
    let K = A.slice(0, q);
    while (q < A.length && (A[q] === " " || A[q] === "\t")) q++;
    if (q >= A.length || A[q] !== "=") return null;
    q++;
    while (q < A.length && (A[q] === " " || A[q] === "\t")) q++;
    let Y = BOK(A, q);
    return {
        key: K,
        value: Y
    }
}
// @from(Ln 48035, Col 0)
function BOK(A, q) {
    let K = "",
        Y = !1,
        z = q;
    while (z < A.length) {
        let w = A[z];
        if (!Y && (w === "#" || w === ";")) break;
        if (w === '"') {
            Y = !Y, z++;
            continue
        }
        if (w === "\\" && z + 1 < A.length) {
            let H = A[z + 1];
            if (Y) {
                switch (H) {
                    case "n":
                        K += `
`;
                        break;
                    case "t":
                        K += "\t";
                        break;
                    case "b":
                        K += "\b";
                        break;
                    case '"':
                        K += '"';
                        break;
                    case "\\":
                        K += "\\";
                        break;
                    default:
                        K += H;
                        break
                }
                z += 2;
                continue
            }
            if (H === "\\") {
                K += "\\", z += 2;
                continue
            }
        }
        K += w, z++
    }
    if (!Y) K = mOK(K);
    return K
}
// @from(Ln 48084, Col 0)
function mOK(A) {
    let q = A.length;
    while (q > 0 && (A[q - 1] === " " || A[q - 1] === "\t")) q--;
    return A.slice(0, q)
}
// @from(Ln 48090, Col 0)
function FOK(A, q, K) {
    let Y = 1;
    while (Y < A.length && A[Y] !== "]" && A[Y] !== " " && A[Y] !== "\t" && A[Y] !== '"') Y++;
    if (A.slice(1, Y).toLowerCase() !== q) return !1;
    if (K === null) return Y < A.length && A[Y] === "]";
    while (Y < A.length && (A[Y] === " " || A[Y] === "\t")) Y++;
    if (Y >= A.length || A[Y] !== '"') return !1;
    Y++;
    let w = "";
    while (Y < A.length && A[Y] !== '"') {
        if (A[Y] === "\\" && Y + 1 < A.length) {
            let H = A[Y + 1];
            if (H === "\\" || H === '"') {
                w += H, Y += 2;
                continue
            }
            w += H, Y += 2;
            continue
        }
        w += A[Y], Y++
    }
    if (Y >= A.length || A[Y] !== '"') return !1;
    if (Y++, Y >= A.length || A[Y] !== "]") return !1;
    return w === K
}
// @from(Ln 48116, Col 0)
function QOK(A) {
    return A >= "a" && A <= "z" || A >= "A" && A <= "Z" || A >= "0" && A <= "9" || A === "-"
}
// @from(Ln 48119, Col 4)
rw8 = () => {}
// @from(Ln 48133, Col 0)
async function Ab(A) {
    let q = OF6(A ?? h6()),
        K = Iv1.get(q);
    if (K !== void 0) return K;
    let Y = YX(q);
    if (!Y) return Iv1.set(q, null), null;
    let z = ex(Y, ".git");
    try {
        if ((await UOK(z)).isFile()) {
            let H = (await KH1(z, "utf-8")).trim();
            if (H.startsWith("gitdir:")) {
                let $ = H.slice(7).trim(),
                    O = OF6(Y, $);
                return Iv1.set(q, O), O
            }
        }
        return Iv1.set(q, z), z
    } catch {
        return Iv1.set(q, null), null
    }
}
// @from(Ln 48154, Col 0)
async function Ss1(A) {
    try {
        let q = (await KH1(ex(A, "HEAD"), "utf-8")).trim();
        if (q.startsWith("ref:")) {
            let K = q.slice(4).trim();
            if (K.startsWith("refs/heads/")) return {
                type: "branch",
                name: K.slice(11)
            };
            let Y = await xv1(A, K);
            return Y ? {
                type: "detached",
                sha: Y
            } : {
                type: "detached",
                sha: ""
            }
        }
        return {
            type: "detached",
            sha: q
        }
    } catch {
        return null
    }
}
// @from(Ln 48180, Col 0)
async function xv1(A, q) {
    let K = await aw8(A, q);
    if (K) return K;
    let Y = await dOK(A);
    if (Y && Y !== A) return aw8(Y, q);
    return null
}
// @from(Ln 48187, Col 0)
async function aw8(A, q) {
    try {
        let K = (await KH1(ex(A, q), "utf-8")).trim();
        if (K.startsWith("ref:")) return xv1(A, K.slice(4).trim());
        return K
    } catch {}
    try {
        let K = await KH1(ex(A, "packed-refs"), "utf-8");
        for (let Y of K.split(`
`)) {
            if (Y.startsWith("#") || Y.startsWith("^")) continue;
            let z = Y.indexOf(" ");
            if (z === -1) continue;
            if (Y.slice(z + 1) === q) return Y.slice(0, z)
        }
    } catch {}
    return null
}
// @from(Ln 48205, Col 0)
async function dOK(A) {
    try {
        let q = (await KH1(ex(A, "commondir"), "utf-8")).trim();
        return OF6(A, q)
    } catch {
        return null
    }
}
// @from(Ln 48213, Col 0)
async function cOK(A, q, K) {
    try {
        let Y = (await KH1(ex(A, q), "utf-8")).trim();
        if (Y.startsWith("ref:")) {
            let z = Y.slice(4).trim();
            if (z.startsWith(K)) return z.slice(K.length)
        }
    } catch {}
    return null
}
// @from(Ln 48223, Col 0)
class sw8 {
    gitDir = null;
    initialized = !1;
    initPromise = null;
    watchedPaths = [];
    branchRefPath = null;
    cache = new Map;
    async ensureStarted() {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;
        return this.initPromise = this.start(), this.initPromise
    }
    async start() {
        if (this.initialized = !0, this.gitDir = await Ab(), !this.gitDir) return;
        this.watchPath(ex(this.gitDir, "HEAD"), () => {
            this.onHeadChanged()
        }), this.watchPath(ex(this.gitDir, "config"), () => {
            this.invalidate()
        }), await this.watchCurrentBranchRef(), Tq(async () => {
            this.stopWatching()
        })
    }
    watchPath(A, q) {
        this.watchedPaths.push(A), gOK(A, {
            interval: lOK
        }, q)
    }
    async watchCurrentBranchRef() {
        if (!this.gitDir) return;
        let A = await Ss1(this.gitDir);
        if (!A || A.type !== "branch") return;
        let q = ex(this.gitDir, "refs", "heads", A.name);
        if (q === this.branchRefPath) return;
        if (this.branchRefPath) ow8(this.branchRefPath), this.watchedPaths = this.watchedPaths.filter((K) => K !== this.branchRefPath);
        this.branchRefPath = q, this.watchPath(q, () => {
            this.invalidate()
        })
    }
    async onHeadChanged() {
        await this.watchCurrentBranchRef(), this.invalidate()
    }
    invalidate() {
        for (let A of this.cache.values()) A.dirty = !0
    }
    stopWatching() {
        for (let A of this.watchedPaths) ow8(A);
        this.watchedPaths = [], this.branchRefPath = null
    }
    async get(A, q) {
        await this.ensureStarted();
        let K = this.cache.get(A);
        if (K && !K.dirty) return K.value;
        if (K) K.dirty = !1;
        let Y = await q(),
            z = this.cache.get(A);
        if (z && !z.dirty) z.value = Y;
        if (!z) this.cache.set(A, {
            value: Y,
            dirty: !1,
            compute: q
        });
        return Y
    }
    reset() {
        this.stopWatching(), this.cache.clear(), this.initialized = !1, this.initPromise = null, this.gitDir = null
    }
}
// @from(Ln 48290, Col 0)
async function iOK() {
    let A = await Ab();
    if (!A) return "HEAD";
    let q = await Ss1(A);
    if (!q) return "HEAD";
    return q.type === "branch" ? q.name : "HEAD"
}
// @from(Ln 48297, Col 0)
async function nOK() {
    let A = await Ab();
    if (!A) return "";
    let q = await Ss1(A);
    if (!q) return "";
    if (q.type === "branch") return await xv1(A, `refs/heads/${q.name}`) ?? "";
    return q.sha
}
// @from(Ln 48305, Col 0)
async function rOK() {
    let A = await Ab();
    if (!A) return null;
    return $F6(A, "remote", "origin", "url")
}
// @from(Ln 48310, Col 0)
async function oOK() {
    let A = await Ab();
    if (!A) return "main";
    let q = await cOK(A, "refs/remotes/origin/HEAD", "refs/remotes/origin/");
    if (q) return q;
    for (let K of ["main", "master"])
        if (await xv1(A, `refs/remotes/origin/${K}`)) return K;
    return "main"
}
// @from(Ln 48319, Col 0)
async function tw8() {
    return hs1.get("branch", iOK)
}
// @from(Ln 48322, Col 0)
async function ew8() {
    return hs1.get("head", nOK)
}
// @from(Ln 48325, Col 0)
async function AH8() {
    return hs1.get("remoteUrl", rOK)
}
// @from(Ln 48328, Col 0)
async function qH8() {
    return hs1.get("defaultBranch", oOK)
}
// @from(Ln 48331, Col 0)
async function bv1(A) {
    let q = await Ab(A);
    if (!q) return null;
    let K = await Ss1(q);
    if (!K) return null;
    if (K.type === "branch") return xv1(q, `refs/heads/${K.name}`);
    return K.sha
}
// @from(Ln 48339, Col 0)
async function Is1(A) {
    let q = await Ab(A);
    if (!q) return null;
    return $F6(q, "remote", "origin", "url")
}
// @from(Ln 48344, Col 0)
async function KH8() {
    try {
        let A = await Ab();
        if (!A) return 0;
        return (await pOK(ex(A, "worktrees"))).length + 1
    } catch {
        return 1
    }
}
// @from(Ln 48353, Col 4)
Iv1
// @from(Ln 48353, Col 9)
lOK = 1000
// @from(Ln 48354, Col 4)
hs1
// @from(Ln 48355, Col 4)
YH1 = v(() => {
    h9();
    N7();
    Tz();
    rw8();
    Iv1 = new Map;
    hs1 = new sw8
})
// @from(Ln 48377, Col 0)
async function HH8(A) {
    return Ab(A)
}
// @from(Ln 48381, Col 0)
function A_K(A) {
    let q = A.trim();
    if (!q) return null;
    let K = q.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
    if (K && K[1] && K[2]) return `${K[1]}/${K[2]}`.toLowerCase();
    let Y = q.match(/^(?:https?|ssh):\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/);
    if (Y && Y[1] && Y[2]) {
        let z = Y[1],
            w = Y[2];
        if (K_K(z) && w.startsWith("git/")) return `github.com/${w.slice(4)}`.toLowerCase();
        return `${z}/${w}`.toLowerCase()
    }
    return null
}
// @from(Ln 48395, Col 0)
async function xs1() {
    let A = await uv1();
    if (!A) return null;
    let q = A_K(A);
    if (!q) return null;
    return aOK("sha256").update(q).digest("hex").substring(0, 16)
}
// @from(Ln 48402, Col 0)
async function q_K() {
    let A = await tj(),
        {
            stdout: q,
            code: K
        } = await IA(pq(), ["rev-list", "--count", `${A}..HEAD`]);
    if (K !== 0) return null;
    return parseInt(q.trim(), 10) || 0
}
// @from(Ln 48411, Col 0)
async function XH8() {
    try {
        let [A, q, K, Y, z, w] = await Promise.all([eOK(), sj(), uv1(), OH8(), HA1(), Bv1()]);
        return {
            commitHash: A,
            branchName: q,
            remoteUrl: K,
            isHeadOnRemote: Y,
            isClean: z,
            worktreeCount: w
        }
    } catch (A) {
        return null
    }
}
// @from(Ln 48426, Col 0)
async function DH8() {
    let A = await uv1();
    if (!A) return h("Local GitHub repo: unknown"), null;
    let q = A.match(/.*github\.com[:/]([^/]+)\/([^/]+)$/);
    if (q && q[1] && q[2]) {
        let K = `${q[1]}/${q[2].replace(/\.git$/,"")}`;
        return h(`Local GitHub repo: ${K}`), K
    }
    return h("Local GitHub repo: unknown"), null
}
// @from(Ln 48437, Col 0)
function K_K(A) {
    let q = A.split(":")[0] ?? "";
    return q === "localhost" || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(q)
}
// @from(Ln 48441, Col 4)
YX
// @from(Ln 48441, Col 8)
pq
// @from(Ln 48441, Col 12)
aj
// @from(Ln 48441, Col 16)
$H8 = async (A) => {
    return YX(A) !== null
}
// @from(Ln 48443, Col 3)
eOK = async () => {
    return ew8()
}
// @from(Ln 48445, Col 3)
sj = async () => {
    return tw8()
}
// @from(Ln 48447, Col 3)
tj = async () => {
    return qH8()
}
// @from(Ln 48449, Col 3)
uv1 = async () => {
    return AH8()
}
// @from(Ln 48451, Col 3)
OH8 = async () => {
    let {
        code: A
    } = await IA(pq(), ["rev-parse", "@{u}"], {
        preserveOutputOnError: !1
    });
    return A === 0
}
// @from(Ln 48458, Col 3)
HA1 = async (A) => {
    let q = ["status", "--porcelain"];
    if (A?.ignoreUntracked) q.push("-uno");
    let {
        stdout: K
    } = await IA(pq(), q, {
        preserveOutputOnError: !1
    });
    return K.trim().length === 0
}
// @from(Ln 48467, Col 3)
_H8 = async () => {
    let A = await OH8(),
        q = await q_K();
    if (!A) return {
        hasUpstream: !1,
        needsPush: !0,
        commitsAhead: 0,
        commitsAheadOfDefaultBranch: q
    };
    let {
        stdout: K,
        code: Y
    } = await IA(pq(), ["rev-list", "--count", "@{u}..HEAD"], {
        preserveOutputOnError: !1
    });
    if (Y !== 0) return {
        hasUpstream: !0,
        needsPush: !1,
        commitsAhead: 0,
        commitsAheadOfDefaultBranch: q
    };
    let z = parseInt(K.trim(), 10) || 0;
    return {
        hasUpstream: !0,
        needsPush: z > 0,
        commitsAhead: z,
        commitsAheadOfDefaultBranch: q
    }
}
// @from(Ln 48495, Col 3)
bs1 = async () => {
    let [A, q] = await Promise.all([HA1(), _H8()]);
    return {
        hasUncommitted: !A,
        hasUnpushed: q.needsPush,
        commitsAheadOfDefaultBranch: q.commitsAheadOfDefaultBranch
    }
}
// @from(Ln 48502, Col 3)
us1 = async (A, q) => {
    if (!await HA1()) {
        q?.("committing");
        let {
            code: O,
            stderr: _
        } = await IA(pq(), ["add", "-A"], {
            preserveOutputOnError: !0
        });
        if (O !== 0) return {
            success: !1,
            error: `Failed to stage changes: ${_}`
        };
        let {
            code: J,
            stderr: X
        } = await IA(pq(), ["commit", "-m", A], {
            preserveOutputOnError: !0
        });
        if (J !== 0) return {
            success: !1,
            error: `Failed to commit: ${X}`
        }
    }
    q?.("pushing");
    let Y = await _H8(),
        z = await sj(),
        w = Y.hasUpstream ? ["push"] : ["push", "-u", "origin", z],
        {
            code: H,
            stderr: $
        } = await IA(pq(), w, {
            preserveOutputOnError: !0
        });
    if (H !== 0) return {
        success: !1,
        error: `Failed to push: ${$}`
    };
    return {
        success: !0
    }
}
// @from(Ln 48543, Col 3)
_F6 = async () => {
    let {
        stdout: A
    } = await IA(pq(), ["status", "--porcelain"], {
        preserveOutputOnError: !1
    }), q = [], K = [];
    return A.trim().split(`
`).filter((Y) => Y.length > 0).forEach((Y) => {
        let z = Y.substring(0, 2),
            w = Y.substring(2).trim();
        if (z === "??") K.push(w);
        else if (w) q.push(w)
    }), {
        tracked: q,
        untracked: K
    }
}
// @from(Ln 48559, Col 3)
Bv1 = async () => {
    return KH8()
}
// @from(Ln 48561, Col 3)
JH8 = async (A) => {
    try {
        let q = A || `Claude Code auto-stash - ${new Date().toISOString()}`,
            {
                untracked: K
            } = await _F6();
        if (K.length > 0) {
            let {
                code: z
            } = await IA(pq(), ["add", ...K], {
                preserveOutputOnError: !1
            });
            if (z !== 0) return !1
        }
        let {
            code: Y
        } = await IA(pq(), ["stash", "push", "--message", q], {
            preserveOutputOnError: !1
        });
        return Y === 0
    } catch (q) {
        return !1
    }
}
// @from(Ln 48585, Col 4)
h9 = v(() => {
    zq();
    tq();
    Z6();
    N7();
    f0();
    y6();
    WQ();
    YH1();
    YX = KA((A) => {
        let q = Date.now();
        H8("info", "find_git_root_started");
        let K = sOK(A),
            Y = K.substring(0, K.indexOf(wH8) + 1) || wH8,
            z = 0;
        while (K !== Y) {
            try {
                let H = zH8(K, ".git");
                z++;
                let $ = YH8(H);
                if ($.isDirectory() || $.isFile()) return H8("info", "find_git_root_completed", {
                    duration_ms: Date.now() - q,
                    stat_count: z,
                    found: !0
                }), K.normalize("NFC")
            } catch {}
            let w = tOK(K);
            if (w === K) break;
            K = w
        }
        try {
            let w = zH8(Y, ".git");
            z++;
            let H = YH8(w);
            if (H.isDirectory() || H.isFile()) return H8("info", "find_git_root_completed", {
                duration_ms: Date.now() - q,
                stat_count: z,
                found: !0
            }), Y.normalize("NFC")
        } catch {}
        return H8("info", "find_git_root_completed", {
            duration_ms: Date.now() - q,
            stat_count: z,
            found: !1
        }), null
    }), pq = KA(() => {
        return Po1("git") || "git"
    }), aj = KA(async () => {
        let A = Date.now();
        H8("info", "is_git_check_started");
        let q = YX(h6()) !== null;
        return H8("info", "is_git_check_completed", {
            duration_ms: Date.now() - A,
            is_git: q
        }), q
    })
})
// @from(Ln 48649, Col 0)
async function H_K(A, q) {
    let {
        code: K
    } = await d4("git", ["check-ignore", A], {
        preserveOutputOnError: !1,
        cwd: q
    });
    return K === 0
}
// @from(Ln 48659, Col 0)
function $_K() {
    return Y_K(w_K(), ".config", "git", "ignore")
}
// @from(Ln 48662, Col 0)
async function JF6(A, q = h6()) {
    try {
        if (!await $H8(q)) return;
        let K = `**/${A}`,
            Y = A.endsWith("/") ? `${A}sample-file.txt` : A;
        if (await H_K(Y, q)) return;
        let z = $_K(),
            w = b1(),
            H = z_K(z);
        if (!w.existsSync(H)) w.mkdirSync(H);
        if (w.existsSync(z)) {
            if (w.readFileSync(z, {
                    encoding: "utf-8"
                }).includes(K)) return;
            w.appendFileSync(z, `
${K}
`)
        } else c8(z, `${K}
`, "utf-8")
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K)))
    }
}
// @from(Ln 48685, Col 4)
XF6 = v(() => {
    h9();
    _8();
    N7();
    y6();
    tq();
    m6()
})
// @from(Ln 48694, Col 0)
function jH8(A) {
    let q = O_K.find((Y) => Y.matches(A));
    if (!q) return null;
    let K = {
        ...q.tip
    };
    if (A.code === "invalid_value" && A.enumValues && !K.suggestion) K.suggestion = `Valid values: ${A.enumValues.map((Y)=>`"${Y}"`).join(", ")}`;
    if (!K.docLink && A.path) {
        let Y = A.path.split(".")[0];
        if (Y) K.docLink = __K[Y]
    }
    return K
}
// @from(Ln 48707, Col 4)
O_K
// @from(Ln 48707, Col 9)
__K
// @from(Ln 48708, Col 4)
MH8 = v(() => {
    O_K = [{
        matches: (A) => A.path === "permissions.defaultMode" && A.code === "invalid_value",
        tip: {
            suggestion: 'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
            docLink: "https://code.claude.com/docs/en/iam#permission-modes"
        }
    }, {
        matches: (A) => A.path === "apiKeyHelper" && A.code === "invalid_type",
        tip: {
            suggestion: 'Provide a shell command that outputs your API key to stdout. The script should output only the API key. Example: "/bin/generate_temp_api_key.sh"'
        }
    }, {
        matches: (A) => A.path === "cleanupPeriodDays" && A.code === "too_small" && A.expected === "0",
        tip: {
            suggestion: "Must be 0 or greater. Use 0 to disable automatic cleanup and keep chat transcripts forever, or set a positive number for days to retain (default is 30 days)"
        }
    }, {
        matches: (A) => A.path.startsWith("env.") && A.code === "invalid_type",
        tip: {
            suggestion: 'Environment variables must be strings. Wrap numbers and booleans in quotes. Example: "DEBUG": "true", "PORT": "3000"',
            docLink: "https://code.claude.com/docs/en/settings#environment-variables"
        }
    }, {
        matches: (A) => (A.path === "permissions.allow" || A.path === "permissions.deny") && A.code === "invalid_type" && A.expected === "array",
        tip: {
            suggestion: 'Permission rules must be in an array. Format: ["Tool(specifier)"]. Examples: ["Bash(npm run build)", "Edit(docs/**)", "Read(~/.zshrc)"]. Use * for wildcards.'
        }
    }, {
        matches: (A) => A.path.includes("hooks") && A.code === "invalid_type",
        tip: {
            suggestion: 'Hooks use a new format with matchers. Example: {"PostToolUse": [{"matcher": {"tools": ["BashTool"]}, "hooks": [{"type": "command", "command": "echo Done"}]}]}'
        }
    }, {
        matches: (A) => A.code === "invalid_type" && A.expected === "boolean",
        tip: {
            suggestion: 'Use true or false without quotes. Example: "includeCoAuthoredBy": true'
        }
    }, {
        matches: (A) => A.code === "unrecognized_keys",
        tip: {
            suggestion: "Check for typos or refer to the documentation for valid fields",
            docLink: "https://code.claude.com/docs/en/settings"
        }
    }, {
        matches: (A) => A.code === "invalid_value" && A.enumValues !== void 0,
        tip: {
            suggestion: void 0
        }
    }, {
        matches: (A) => A.code === "invalid_type" && A.expected === "object" && A.received === null && A.path === "",
        tip: {
            suggestion: "Check for missing commas, unmatched brackets, or trailing commas. Use a JSON validator to identify the exact syntax error."
        }
    }, {
        matches: (A) => A.path === "permissions.additionalDirectories" && A.code === "invalid_type",
        tip: {
            suggestion: 'Must be an array of directory paths. Example: ["~/projects", "/tmp/workspace"]. You can also use --add-dir flag or /add-dir command',
            docLink: "https://code.claude.com/docs/en/iam#working-directories"
        }
    }], __K = {
        permissions: "https://code.claude.com/docs/en/iam#configuring-permissions",
        env: "https://code.claude.com/docs/en/settings#environment-variables",
        hooks: "https://code.claude.com/docs/en/hooks"
    }
})
// @from(Ln 48775, Col 0)
function DF6() {
    let A = RQ(Dk, {
        unrepresentable: "any"
    });
    return Q1(A, null, 2)
}
// @from(Ln 48781, Col 4)
PH8 = v(() => {
    i7();
    hQ();
    m6()
})
// @from(Ln 48787, Col 0)
function WH8(A) {
    return A.code === "invalid_type"
}
// @from(Ln 48791, Col 0)
function GH8(A) {
    return A.code === "invalid_value"
}
// @from(Ln 48795, Col 0)
function J_K(A) {
    return A.code === "unrecognized_keys"
}
// @from(Ln 48799, Col 0)
function ZH8(A) {
    return A.code === "too_small"
}
// @from(Ln 48803, Col 0)
function jF6(A) {
    if (A === null) return "null";
    if (A === void 0) return "undefined";
    if (Array.isArray(A)) return "array";
    return typeof A
}
// @from(Ln 48810, Col 0)
function fH8(A) {
    let q = A.match(/received (\w+)/);
    return q ? q[1] : void 0
}
// @from(Ln 48815, Col 0)
function Bs1(A, q) {
    return A.issues.map((K) => {
        let Y = K.path.map(String).join("."),
            z = K.message,
            w, H, $, O, _;
        if (GH8(K)) H = K.values.map((X) => String(X)), $ = H.join(" | "), O = void 0, _ = void 0;
        else if (WH8(K)) {
            $ = K.expected;
            let X = fH8(K.message);
            O = X ?? jF6(K.input), _ = X ?? jF6(K.input)
        } else if (ZH8(K)) $ = String(K.minimum);
        else if (K.code === "custom" && "params" in K) O = K.params.received, _ = O;
        let J = jH8({
            path: Y,
            code: K.code,
            expected: $,
            received: O,
            enumValues: H,
            message: K.message,
            value: O
        });
        if (GH8(K)) w = H?.map((X) => `"${X}"`).join(", "), z = `Invalid value. Expected one of: ${w}`;
        else if (WH8(K)) {
            let X = fH8(K.message) ?? jF6(K.input);
            if (K.expected === "object" && X === "null" && Y === "") z = "Invalid or malformed JSON";
            else z = `Expected ${K.expected}, but received ${X}`
        } else if (J_K(K)) {
            let X = K.keys.join(", ");
            z = `Unrecognized field${K.keys.length>1?"s":""}: ${X}`
        } else if (ZH8(K)) z = `Number must be greater than or equal to ${K.minimum}`, w = String(K.minimum);
        return {
            file: q,
            path: Y,
            message: z,
            expected: w,
            invalidValue: _,
            suggestion: J?.suggestion,
            docLink: J?.docLink
        }
    })
}
// @from(Ln 48857, Col 0)
function MF6(A) {
    try {
        let q = _A(A),
            K = Dk.strict().safeParse(q);
        if (K.success) return {
            isValid: !0
        };
        return {
            isValid: !1,
            error: `Settings validation failed:
` + Bs1(K.error, "settings").map((w) => `- ${w.path}: ${w.message}`).join(`
`),
            fullSchema: DF6()
        }
    } catch (q) {
        return {
            isValid: !1,
            error: `Invalid JSON: ${q instanceof Error?q.message:"Unknown parsing error"}`,
            fullSchema: DF6()
        }
    }
}
// @from(Ln 48879, Col 4)
PF6 = v(() => {
    hQ();
    MH8();
    PH8();
    m6()
})
// @from(Ln 48888, Col 4)
df
// @from(Ln 48889, Col 4)
$A1 = v(() => {
    zq();
    x3();
    df = KA(function() {
        switch (eA()) {
            case "macos":
                return "/Library/Application Support/ClaudeCode";
            case "windows":
                if (X_K("C:\\Program Files\\ClaudeCode")) return "C:\\Program Files\\ClaudeCode";
                return "C:\\ProgramData\\ClaudeCode";
            default:
                return "/etc/claude-code"
        }
    })
})
// @from(Ln 48920, Col 0)
function RH8(A, q = {}) {
    let K = q.entryType || q.type;
    if (K === "both") K = TT.FILE_DIR_TYPE;
    if (K) q.type = K;
    if (!A) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
    else if (typeof A !== "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
    else if (K && !TH8.includes(K)) throw Error(`readdirp: Invalid type passed. Use one of ${TH8.join(", ")}`);
    return q.root = A, new LH8(q)
}
// @from(Ln 48929, Col 4)
TT
// @from(Ln 48929, Col 8)
WF6
// @from(Ln 48929, Col 13)
kH8 = "READDIRP_RECURSIVE_ERROR"
// @from(Ln 48930, Col 4)
f_K
// @from(Ln 48930, Col 9)
TH8
// @from(Ln 48930, Col 14)
V_K
// @from(Ln 48930, Col 19)
N_K
// @from(Ln 48930, Col 24)
T_K = (A) => f_K.has(A.code)
// @from(Ln 48931, Col 4)
v_K
// @from(Ln 48931, Col 9)
vH8 = (A) => !0
// @from(Ln 48932, Col 4)
EH8 = (A) => {
        if (A === void 0) return vH8;
        if (typeof A === "function") return A;
        if (typeof A === "string") {
            let q = A.trim();
            return (K) => K.basename === q
        }
        if (Array.isArray(A)) {
            let q = A.map((K) => K.trim());
            return (K) => q.some((Y) => K.basename === Y)
        }
        return vH8
    }
// @from(Ln 48945, Col 4)
LH8
// @from(Ln 48946, Col 4)
yH8 = v(() => {
    TT = {
        FILE_TYPE: "files",
        DIR_TYPE: "directories",
        FILE_DIR_TYPE: "files_directories",
        EVERYTHING_TYPE: "all"
    }, WF6 = {
        root: ".",
        fileFilter: (A) => !0,
        directoryFilter: (A) => !0,
        type: TT.FILE_TYPE,
        lstat: !1,
        depth: 2147483648,
        alwaysStat: !1,
        highWaterMark: 4096
    };
    Object.freeze(WF6);
    f_K = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", kH8]), TH8 = [TT.DIR_TYPE, TT.EVERYTHING_TYPE, TT.FILE_DIR_TYPE, TT.FILE_TYPE], V_K = new Set([TT.DIR_TYPE, TT.EVERYTHING_TYPE, TT.FILE_DIR_TYPE]), N_K = new Set([TT.EVERYTHING_TYPE, TT.FILE_DIR_TYPE, TT.FILE_TYPE]), v_K = process.platform === "win32";
    LH8 = class LH8 extends P_K {
        constructor(A = {}) {
            super({
                objectMode: !0,
                autoDestroy: !0,
                highWaterMark: A.highWaterMark
            });
            let q = {
                    ...WF6,
                    ...A
                },
                {
                    root: K,
                    type: Y
                } = q;
            this._fileFilter = EH8(q.fileFilter), this._directoryFilter = EH8(q.directoryFilter);
            let z = q.lstat ? VH8 : D_K;
            if (v_K) this._stat = (w) => z(w, {
                bigint: !0
            });
            else this._stat = z;
            this._maxDepth = q.depth ?? WF6.depth, this._wantsDir = Y ? V_K.has(Y) : !1, this._wantsFile = Y ? N_K.has(Y) : !1, this._wantsEverything = Y === TT.EVERYTHING_TYPE, this._root = NH8(K), this._isDirent = !q.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = {
                encoding: "utf8",
                withFileTypes: this._isDirent
            }, this.parents = [this._exploreDir(K, 1)], this.reading = !1, this.parent = void 0
        }
        async _read(A) {
            if (this.reading) return;
            this.reading = !0;
            try {
                while (!this.destroyed && A > 0) {
                    let q = this.parent,
                        K = q && q.files;
                    if (K && K.length > 0) {
                        let {
                            path: Y,
                            depth: z
                        } = q, w = K.splice(0, A).map(($) => this._formatEntry($, Y)), H = await Promise.all(w);
                        for (let $ of H) {
                            if (!$) continue;
                            if (this.destroyed) return;
                            let O = await this._getEntryType($);
                            if (O === "directory" && this._directoryFilter($)) {
                                if (z <= this._maxDepth) this.parents.push(this._exploreDir($.fullPath, z + 1));
                                if (this._wantsDir) this.push($), A--
                            } else if ((O === "file" || this._includeAsFile($)) && this._fileFilter($)) {
                                if (this._wantsFile) this.push($), A--
                            }
                        }
                    } else {
                        let Y = this.parents.pop();
                        if (!Y) {
                            this.push(null);
                            break
                        }
                        if (this.parent = await Y, this.destroyed) return
                    }
                }
            } catch (q) {
                this.destroy(q)
            } finally {
                this.reading = !1
            }
        }
        async _exploreDir(A, q) {
            let K;
            try {
                K = await j_K(A, this._rdOptions)
            } catch (Y) {
                this._onError(Y)
            }
            return {
                files: K,
                depth: q,
                path: A
            }
        }
        async _formatEntry(A, q) {
            let K, Y = this._isDirent ? A.name : A;
            try {
                let z = NH8(G_K(q, Y));
                K = {
                    path: W_K(this._root, z),
                    fullPath: z,
                    basename: Y
                }, K[this._statsProp] = this._isDirent ? A : await this._stat(z)
            } catch (z) {
                this._onError(z);
                return
            }
            return K
        }
        _onError(A) {
            if (T_K(A) && !this.destroyed) this.emit("warn", A);
            else this.destroy(A)
        }
        async _getEntryType(A) {
            if (!A && this._statsProp in A) return "";
            let q = A[this._statsProp];
            if (q.isFile()) return "file";
            if (q.isDirectory()) return "directory";
            if (q && q.isSymbolicLink()) {
                let K = A.fullPath;
                try {
                    let Y = await M_K(K),
                        z = await VH8(Y);
                    if (z.isFile()) return "file";
                    if (z.isDirectory()) {
                        let w = Y.length;
                        if (K.startsWith(Y) && K.substr(w, 1) === Z_K) {
                            let H = Error(`Circular symlink detected: "${K}" points to "${Y}"`);
                            return H.code = kH8, this._onError(H)
                        }
                        return "directory"
                    }
                } catch (Y) {
                    return this._onError(Y), ""
                }
            }
        }
        _includeAsFile(A) {
            let q = A && A[this._statsProp];
            return q && this._wantsEverything && !q.isDirectory()
        }
    }
})
// @from(Ln 49106, Col 0)
function SH8(A, q, K, Y, z) {
    let w = (H, $) => {
        if (K(A), z(H, $, {
                watchedPath: A
            }), $ && A !== $) Qs1(k$.resolve(A, $), OA1, k$.join(A, $))
    };
    try {
        return k_K(A, {
            persistent: q.persistent
        }, w)
    } catch (H) {
        Y(H);
        return
    }
}
// @from(Ln 49121, Col 0)
class TF6 {
    constructor(A) {
        this.fsw = A, this._boundHandleError = (q) => A._handleError(q)
    }
    _watchWithNodeFs(A, q) {
        let K = this.fsw.options,
            Y = k$.dirname(A),
            z = k$.basename(A);
        this.fsw._getWatchedDir(Y).add(z);
        let H = k$.resolve(A),
            $ = {
                persistent: K.persistent
            };
        if (!q) q = gs1;
        let O;
        if (K.usePolling) {
            let _ = K.interval !== K.binaryInterval;
            $.interval = _ && m_K(z) ? K.binaryInterval : K.interval, O = g_K(A, H, $, {
                listener: q,
                rawEmitter: this.fsw._emitRaw
            })
        } else O = Q_K(A, H, $, {
            listener: q,
            errHandler: this._boundHandleError,
            rawEmitter: this.fsw._emitRaw
        });
        return O
    }
    _handleFile(A, q, K) {
        if (this.fsw.closed) return;
        let Y = k$.dirname(A),
            z = k$.basename(A),
            w = this.fsw._getWatchedDir(Y),
            H = q;
        if (w.has(z)) return;
        let $ = async (_, J) => {
            if (!this.fsw._throttle(x_K, A, 5)) return;
            if (!J || J.mtimeMs === 0) try {
                let X = await hH8(A);
                if (this.fsw.closed) return;
                let {
                    atimeMs: D,
                    mtimeMs: j
                } = X;
                if (!D || D <= j || j !== H.mtimeMs) this.fsw._emit(MC.CHANGE, A, X);
                if ((S_K || h_K || I_K) && H.ino !== X.ino) {
                    this.fsw._closeFile(_), H = X;
                    let M = this._watchWithNodeFs(A, $);
                    if (M) this.fsw._addPathCloser(_, M)
                } else H = X
            } catch (X) {
                this.fsw._remove(Y, z)
            } else if (w.has(z)) {
                let {
                    atimeMs: X,
                    mtimeMs: D
                } = J;
                if (!X || X <= D || D !== H.mtimeMs) this.fsw._emit(MC.CHANGE, A, J);
                H = J
            }
        }, O = this._watchWithNodeFs(A, $);
        if (!(K && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(A)) {
            if (!this.fsw._throttle(MC.ADD, A, 0)) return;
            this.fsw._emit(MC.ADD, A, q)
        }
        return O
    }
    async _handleSymlink(A, q, K, Y) {
        if (this.fsw.closed) return;
        let z = A.fullPath,
            w = this.fsw._getWatchedDir(q);
        if (!this.fsw.options.followSymlinks) {
            this.fsw._incrReadyCount();
            let H;
            try {
                H = await GF6(K)
            } catch ($) {
                return this.fsw._emitReady(), !0
            }
            if (this.fsw.closed) return;
            if (w.has(Y)) {
                if (this.fsw._symlinkPaths.get(z) !== H) this.fsw._symlinkPaths.set(z, H), this.fsw._emit(MC.CHANGE, K, A.stats)
            } else w.add(Y), this.fsw._symlinkPaths.set(z, H), this.fsw._emit(MC.ADD, K, A.stats);
            return this.fsw._emitReady(), !0
        }
        if (this.fsw._symlinkPaths.has(z)) return !0;
        this.fsw._symlinkPaths.set(z, !0)
    }
    _handleRead(A, q, K, Y, z, w, H) {
        if (A = k$.join(A, ""), H = this.fsw._throttle("readdir", A, 1000), !H) return;
        let $ = this.fsw._getWatchedDir(K.path),
            O = new Set,
            _ = this.fsw._readdirp(A, {
                fileFilter: (J) => K.filterPath(J),
                directoryFilter: (J) => K.filterDir(J)
            });
        if (!_) return;
        return _.on(C_K, async (J) => {
            if (this.fsw.closed) {
                _ = void 0;
                return
            }
            let X = J.path,
                D = k$.join(A, X);
            if (O.add(X), J.stats.isSymbolicLink() && await this._handleSymlink(J, A, D, X)) return;
            if (this.fsw.closed) {
                _ = void 0;
                return
            }
            if (X === Y || !Y && !$.has(X)) this.fsw._incrReadyCount(), D = k$.join(z, k$.relative(z, D)), this._addToNodeFs(D, q, K, w + 1)
        }).on(MC.ERROR, this._boundHandleError), new Promise((J, X) => {
            if (!_) return X();
            _.once(VF6, () => {
                if (this.fsw.closed) {
                    _ = void 0;
                    return
                }
                let D = H ? H.clear() : !1;
                if (J(void 0), $.getChildren().filter((j) => {
                        return j !== A && !O.has(j)
                    }).forEach((j) => {
                        this.fsw._remove(A, j)
                    }), _ = void 0, D) this._handleRead(A, !1, K, Y, z, w, H)
            })
        })
    }
    async _handleDir(A, q, K, Y, z, w, H) {
        let $ = this.fsw._getWatchedDir(k$.dirname(A)),
            O = $.has(k$.basename(A));
        if (!(K && this.fsw.options.ignoreInitial) && !z && !O) this.fsw._emit(MC.ADD_DIR, A, q);
        $.add(k$.basename(A)), this.fsw._getWatchedDir(A);
        let _, J, X = this.fsw.options.depth;
        if ((X == null || Y <= X) && !this.fsw._symlinkPaths.has(H)) {
            if (!z) {
                if (await this._handleRead(A, K, w, z, A, Y, _), this.fsw.closed) return
            }
            J = this._watchWithNodeFs(A, (D, j) => {
                if (j && j.mtimeMs === 0) return;
                this._handleRead(D, !1, w, z, A, Y, _)
            })
        }
        return J
    }
    async _addToNodeFs(A, q, K, Y, z) {
        let w = this.fsw._emitReady;
        if (this.fsw._isIgnored(A) || this.fsw.closed) return w(), !1;
        let H = this.fsw._getWatchHelpers(A);
        if (K) H.filterPath = ($) => K.filterPath($), H.filterDir = ($) => K.filterDir($);
        try {
            let $ = await b_K[H.statMethod](H.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(H.watchPath, $)) return w(), !1;
            let O = this.fsw.options.followSymlinks,
                _;
            if ($.isDirectory()) {
                let J = k$.resolve(A),
                    X = O ? await GF6(A) : A;
                if (this.fsw.closed) return;
                if (_ = await this._handleDir(H.watchPath, $, q, Y, z, H, X), this.fsw.closed) return;
                if (J !== X && X !== void 0) this.fsw._symlinkPaths.set(J, X)
            } else if ($.isSymbolicLink()) {
                let J = O ? await GF6(A) : A;
                if (this.fsw.closed) return;
                let X = k$.dirname(H.watchPath);
                if (this.fsw._getWatchedDir(X).add(H.watchPath), this.fsw._emit(MC.ADD, H.watchPath, $), _ = await this._handleDir(X, $, q, Y, A, H, J), this.fsw.closed) return;
                if (J !== void 0) this.fsw._symlinkPaths.set(k$.resolve(A), J)
            } else _ = this._handleFile(H.watchPath, $, q);
            if (w(), _) this.fsw._addPathCloser(A, _);
            return !1
        } catch ($) {
            if (this.fsw._handleError($)) return w(), A
        }
    }
}
// @from(Ln 49295, Col 4)
C_K = "data"
// @from(Ln 49296, Col 4)
VF6 = "end"
// @from(Ln 49297, Col 4)
IH8 = "close"
// @from(Ln 49298, Col 4)
gs1 = () => {}
// @from(Ln 49299, Col 4)
Us1
// @from(Ln 49299, Col 9)
NF6
// @from(Ln 49299, Col 14)
S_K
// @from(Ln 49299, Col 19)
h_K
// @from(Ln 49299, Col 24)
I_K
// @from(Ln 49299, Col 29)
xH8
// @from(Ln 49299, Col 34)
gH
// @from(Ln 49299, Col 38)
MC
// @from(Ln 49299, Col 42)
x_K = "watch"
// @from(Ln 49300, Col 4)
b_K
// @from(Ln 49300, Col 9)
OA1 = "listeners"
// @from(Ln 49301, Col 4)
ms1 = "errHandlers"
// @from(Ln 49302, Col 4)
zH1 = "rawEmitters"
// @from(Ln 49303, Col 4)
u_K
// @from(Ln 49303, Col 9)
B_K
// @from(Ln 49303, Col 14)
m_K = (A) => B_K.has(k$.extname(A).slice(1).toLowerCase())
// @from(Ln 49304, Col 4)
fF6 = (A, q) => {
        if (A instanceof Set) A.forEach(q);
        else q(A)
    }
// @from(Ln 49308, Col 4)
mv1 = (A, q, K) => {
        let Y = A[q];
        if (!(Y instanceof Set)) A[q] = Y = new Set([Y]);
        Y.add(K)
    }
// @from(Ln 49313, Col 4)
F_K = (A) => (q) => {
        let K = A[q];
        if (K instanceof Set) K.clear();
        else delete A[q]
    }
// @from(Ln 49318, Col 4)
Fv1 = (A, q, K) => {
        let Y = A[q];
        if (Y instanceof Set) Y.delete(K);
        else if (Y === K) delete A[q]
    }
// @from(Ln 49323, Col 4)
bH8 = (A) => A instanceof Set ? A.size === 0 : !A
// @from(Ln 49324, Col 4)
Fs1
// @from(Ln 49324, Col 9)
Qs1 = (A, q, K, Y, z) => {
        let w = Fs1.get(A);
        if (!w) return;
        fF6(w[q], (H) => {
            H(K, Y, z)
        })
    }
// @from(Ln 49331, Col 4)
Q_K = (A, q, K, Y) => {
        let {
            listener: z,
            errHandler: w,
            rawEmitter: H
        } = Y, $ = Fs1.get(q), O;
        if (!K.persistent) {
            if (O = SH8(A, K, z, w, H), !O) return;
            return O.close.bind(O)
        }
        if ($) mv1($, OA1, z), mv1($, ms1, w), mv1($, zH1, H);
        else {
            if (O = SH8(A, K, Qs1.bind(null, q, OA1), w, Qs1.bind(null, q, zH1)), !O) return;
            O.on(MC.ERROR, async (_) => {
                let J = Qs1.bind(null, q, ms1);
                if ($) $.watcherUnusable = !0;
                if (NF6 && _.code === "EPERM") try {
                    await (await L_K(A, "r")).close(), J(_)
                } catch (X) {} else J(_)
            }), $ = {
                listeners: z,
                errHandlers: w,
                rawEmitters: H,
                watcher: O
            }, Fs1.set(q, $)
        }
        return () => {
            if (Fv1($, OA1, z), Fv1($, ms1, w), Fv1($, zH1, H), bH8($.listeners)) $.watcher.close(), Fs1.delete(q), u_K.forEach(F_K($)), $.watcher = void 0, Object.freeze($)
        }
    }
// @from(Ln 49361, Col 4)
ZF6
// @from(Ln 49361, Col 9)
g_K = (A, q, K, Y) => {
        let {
            listener: z,
            rawEmitter: w
        } = Y, H = ZF6.get(q), $ = H && H.options;
        if ($ && ($.persistent < K.persistent || $.interval > K.interval)) CH8(q), H = void 0;
        if (H) mv1(H, OA1, z), mv1(H, zH1, w);
        else H = {
            listeners: z,
            rawEmitters: w,
            options: K,
            watcher: E_K(q, K, (O, _) => {
                fF6(H.rawEmitters, (X) => {
                    X(MC.CHANGE, q, {
                        curr: O,
                        prev: _
                    })
                });
                let J = O.mtimeMs;
                if (O.size !== _.size || J > _.mtimeMs || J === 0) fF6(H.listeners, (X) => X(A, O))
            })
        }, ZF6.set(q, H);
        return () => {
            if (Fv1(H, OA1, z), Fv1(H, zH1, w), bH8(H.listeners)) ZF6.delete(q), CH8(q), H.options = H.watcher = void 0, Object.freeze(H)
        }
    }
// @from(Ln 49387, Col 4)
uH8 = v(() => {
    Us1 = process.platform, NF6 = Us1 === "win32", S_K = Us1 === "darwin", h_K = Us1 === "linux", I_K = Us1 === "freebsd", xH8 = y_K() === "OS400", gH = {
        ALL: "all",
        READY: "ready",
        ADD: "add",
        CHANGE: "change",
        ADD_DIR: "addDir",
        UNLINK: "unlink",
        UNLINK_DIR: "unlinkDir",
        RAW: "raw",
        ERROR: "error"
    }, MC = gH, b_K = {
        lstat: R_K,
        stat: hH8
    }, u_K = [OA1, ms1, zH1], B_K = new Set(["3dm", "3ds", "3g2", "3gp", "7z", "a", "aac", "adp", "afdesign", "afphoto", "afpub", "ai", "aif", "aiff", "alz", "ape", "apk", "appimage", "ar", "arj", "asf", "au", "avi", "bak", "baml", "bh", "bin", "bk", "bmp", "btif", "bz2", "bzip2", "cab", "caf", "cgm", "class", "cmx", "cpio", "cr2", "cur", "dat", "dcm", "deb", "dex", "djvu", "dll", "dmg", "dng", "doc", "docm", "docx", "dot", "dotm", "dra", "DS_Store", "dsk", "dts", "dtshd", "dvb", "dwg", "dxf", "ecelp4800", "ecelp7470", "ecelp9600", "egg", "eol", "eot", "epub", "exe", "f4v", "fbs", "fh", "fla", "flac", "flatpak", "fli", "flv", "fpx", "fst", "fvt", "g3", "gh", "gif", "graffle", "gz", "gzip", "h261", "h263", "h264", "icns", "ico", "ief", "img", "ipa", "iso", "jar", "jpeg", "jpg", "jpgv", "jpm", "jxr", "key", "ktx", "lha", "lib", "lvp", "lz", "lzh", "lzma", "lzo", "m3u", "m4a", "m4v", "mar", "mdi", "mht", "mid", "midi", "mj2", "mka", "mkv", "mmr", "mng", "mobi", "mov", "movie", "mp3", "mp4", "mp4a", "mpeg", "mpg", "mpga", "mxu", "nef", "npx", "numbers", "nupkg", "o", "odp", "ods", "odt", "oga", "ogg", "ogv", "otf", "ott", "pages", "pbm", "pcx", "pdb", "pdf", "pea", "pgm", "pic", "png", "pnm", "pot", "potm", "potx", "ppa", "ppam", "ppm", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", "psd", "pya", "pyc", "pyo", "pyv", "qt", "rar", "ras", "raw", "resources", "rgb", "rip", "rlc", "rmf", "rmvb", "rpm", "rtf", "rz", "s3m", "s7z", "scpt", "sgi", "shar", "snap", "sil", "sketch", "slk", "smv", "snk", "so", "stl", "suo", "sub", "swf", "tar", "tbz", "tbz2", "tga", "tgz", "thmx", "tif", "tiff", "tlz", "ttc", "ttf", "txz", "udf", "uvh", "uvi", "uvm", "uvp", "uvs", "uvu", "viv", "vob", "war", "wav", "wax", "wbmp", "wdp", "weba", "webm", "webp", "whl", "wim", "wm", "wma", "wmv", "wmx", "woff", "woff2", "wrm", "wvx", "xbm", "xif", "xla", "xlam", "xls", "xlsb", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xm", "xmind", "xpi", "xpm", "xwd", "xz", "z", "zip", "zipx"]), Fs1 = new Map;
    ZF6 = new Map
})
// @from(Ln 49416, Col 0)
function ps1(A) {
    return Array.isArray(A) ? A : [A]
}
// @from(Ln 49420, Col 0)
function s_K(A) {
    if (typeof A === "function") return A;
    if (typeof A === "string") return (q) => A === q;
    if (A instanceof RegExp) return (q) => A.test(q);
    if (typeof A === "object" && A !== null) return (q) => {
        if (A.path === q) return !0;
        if (A.recursive) {
            let K = I9.relative(A.path, q);
            if (!K) return !1;
            return !K.startsWith("..") && !I9.isAbsolute(K)
        }
        return !1
    };
    return () => !1
}
// @from(Ln 49436, Col 0)
function t_K(A) {
    if (typeof A !== "string") throw Error("string expected");
    A = I9.normalize(A), A = A.replace(/\\/g, "/");
    let q = !1;
    if (A.startsWith("//")) q = !0;
    let K = /\/\//;
    while (A.match(K)) A = A.replace(K, "/");
    if (q) A = "/" + A;
    return A
}
// @from(Ln 49447, Col 0)
function mH8(A, q, K) {
    let Y = t_K(q);
    for (let z = 0; z < A.length; z++) {
        let w = A[z];
        if (w(Y, K)) return !0
    }
    return !1
}
// @from(Ln 49456, Col 0)
function e_K(A, q) {
    if (A == null) throw TypeError("anymatch: specify first argument");
    let Y = ps1(A).map((z) => s_K(z));
    if (q == null) return (z, w) => {
        return mH8(Y, z, w)
    };
    return mH8(Y, q)
}
// @from(Ln 49464, Col 0)
class dH8 {
    constructor(A, q) {
        this.path = A, this._removeWatcher = q, this.items = new Set
    }
    add(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        if (A !== UH8 && A !== i_K) q.add(A)
    }
    async remove(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        if (q.delete(A), q.size > 0) return;
        let K = this.path;
        try {
            await d_K(K)
        } catch (Y) {
            if (this._removeWatcher) this._removeWatcher(I9.dirname(K), I9.basename(K))
        }
    }
    has(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        return q.has(A)
    }
    getChildren() {
        let {
            items: A
        } = this;
        if (!A) return [];
        return [...A.values()]
    }
    dispose() {
        this.items.clear(), this.path = "", this._removeWatcher = gs1, this.items = qJK, Object.freeze(this)
    }
}
// @from(Ln 49506, Col 0)
class cH8 {
    constructor(A, q, K) {
        this.fsw = K;
        let Y = A;
        this.path = A = A.replace(a_K, ""), this.watchPath = Y, this.fullWatchPath = I9.resolve(Y), this.dirParts = [], this.dirParts.forEach((z) => {
            if (z.length > 1) z.pop()
        }), this.followSymlinks = q, this.statMethod = q ? KJK : YJK
    }
    entryPath(A) {
        return I9.join(this.watchPath, I9.relative(this.watchPath, A.fullPath))
    }
    filterPath(A) {
        let {
            stats: q
        } = A;
        if (q && q.isSymbolicLink()) return this.filterDir(A);
        let K = this.entryPath(A);
        return this.fsw._isntIgnored(K, q) && this.fsw._hasReadPermissions(q)
    }
    filterDir(A) {
        return this.fsw._isntIgnored(this.entryPath(A), A.stats)
    }
}
// @from(Ln 49530, Col 0)
function zJK(A, q = {}) {
    let K = new kF6(q);
    return K.add(A), K
}
// @from(Ln 49534, Col 4)
vF6 = "/"
// @from(Ln 49535, Col 4)
l_K = "//"
// @from(Ln 49536, Col 4)
UH8 = "."
// @from(Ln 49537, Col 4)
i_K = ".."
// @from(Ln 49538, Col 4)
n_K = "string"
// @from(Ln 49539, Col 4)
r_K
// @from(Ln 49539, Col 9)
BH8
// @from(Ln 49539, Col 14)
o_K
// @from(Ln 49539, Col 19)
a_K
// @from(Ln 49539, Col 24)
EF6 = (A) => typeof A === "object" && A !== null && !(A instanceof RegExp)
// @from(Ln 49540, Col 4)
FH8 = (A) => {
        let q = ps1(A).flat();
        if (!q.every((K) => typeof K === n_K)) throw TypeError(`Non-string provided as watch path: ${q}`);
        return q.map(pH8)
    }
// @from(Ln 49545, Col 4)
QH8 = (A) => {
        let q = A.replace(r_K, vF6),
            K = !1;
        if (q.startsWith(l_K)) K = !0;
        while (q.match(BH8)) q = q.replace(BH8, vF6);
        if (K) q = vF6 + q;
        return q
    }
// @from(Ln 49553, Col 4)
pH8 = (A) => QH8(I9.normalize(QH8(A)))
// @from(Ln 49554, Col 4)
gH8 = (A = "") => (q) => {
        if (typeof q === "string") return pH8(I9.isAbsolute(q) ? q : I9.join(A, q));
        else return q
    }
// @from(Ln 49558, Col 4)
AJK = (A, q) => {
        if (I9.isAbsolute(A)) return A;
        return I9.join(q, A)
    }
// @from(Ln 49562, Col 4)
qJK
// @from(Ln 49562, Col 9)
KJK = "stat"
// @from(Ln 49563, Col 4)
YJK = "lstat"
// @from(Ln 49564, Col 4)
kF6
// @from(Ln 49564, Col 9)
wH1