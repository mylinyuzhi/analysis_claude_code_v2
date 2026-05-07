
// @from(Ln 50715, Col 4)
Rg7 = L(() => {
    p7();
    qG6();
    fi5 = ["autoMode", "deepLink", "voice", "assistant", "briefView"], Gi5 = {}, ZX8 = {
        autoMode: {
            buildGate: () => !0,
            shape: () => ({
                skipAutoPermissionPrompt: y.boolean().optional().describe("Whether the user has accepted the auto mode opt-in dialog"),
                useAutoModeDuringPlan: y.boolean().optional().describe("Whether plan mode uses auto mode semantics when auto mode is available (default: true)"),
                autoMode: y.object({
                    allow: y.array(y.string()).optional().describe("Rules for the auto mode classifier allow section"),
                    soft_deny: y.array(y.string()).optional().describe("Rules for the auto mode classifier deny section"),
                    ...!1,
                    environment: y.array(y.string()).optional().describe("Entries for the auto mode classifier environment section")
                }).optional().describe("Auto mode classifier prompt customization")
            }),
            permissionsShape: () => ({
                disableAutoMode: y.enum(["disable"]).optional().describe("Disable auto mode")
            }),
            permissionModes: () => jv.filter((q) => !p16.includes(q))
        },
        deepLink: {
            buildGate: () => !0,
            shape: () => ({
                disableDeepLinkRegistration: y.enum(["disable"]).optional().describe("Prevent claude-cli:// protocol handler registration with the OS")
            })
        },
        voice: {
            buildGate: () => !0,
            shape: () => ({
                voiceEnabled: y.boolean().optional().describe("Enable voice mode (hold-to-talk dictation)")
            })
        },
        assistant: {
            buildGate: () => !1,
            shape: () => Gi5
        },
        briefView: {
            buildGate: () => !0,
            shape: () => ({
                defaultView: y.enum(["chat", "transcript"]).optional().describe("Default transcript view: chat (SendUserMessage checkpoints only) or transcript (full)")
            })
        }
    }
})
// @from(Ln 50761, Col 0)
function Pw(q) {
    let K = q.replace(/[^a-zA-Z0-9_-]/g, "_");
    if (q.startsWith("claude.ai ")) K = K.replace(/_+/g, "_").replace(/^_|_$/g, "");
    return K
}
// @from(Ln 50767, Col 0)
function Cm(q) {
    let K = q.split("__"),
        [_, z, ...Y] = K;
    if (_ !== "mcp" || !z) return null;
    let A = Y.length > 0 ? Y.join("__") : void 0;
    return {
        serverName: z,
        toolName: A
    }
}
// @from(Ln 50778, Col 0)
function Zh(q) {
    return `mcp__${Pw(q)}__`
}
// @from(Ln 50782, Col 0)
function tC(q, K) {
    return `${Zh(q)}${Pw(K)}`
}
// @from(Ln 50786, Col 0)
function WO1(q) {
    return q.mcpInfo ? tC(q.mcpInfo.serverName, q.mcpInfo.toolName) : q.name
}
// @from(Ln 50790, Col 0)
function fX8(q, K) {
    let _ = `mcp__${Pw(K)}__`;
    return q.replace(_, "")
}
// @from(Ln 50795, Col 0)
function GX8(q) {
    let K = q.replace(/\s*\(MCP\)\s*$/, "");
    K = K.trim();
    let _ = K.indexOf(" - ");
    if (_ !== -1) return K.substring(_ + 3).trim();
    return K
}
// @from(Ln 50802, Col 4)
fh = () => {}
// @from(Ln 50803, Col 4)
T4 = "Agent"
// @from(Ln 50804, Col 4)
Gh = "Task"
// @from(Ln 50805, Col 4)
vX8 = "verification"
// @from(Ln 50806, Col 4)
Sg7
// @from(Ln 50807, Col 4)
sY = L(() => {
    Sg7 = new Set(["Explore", "Plan"])
})
// @from(Ln 50810, Col 4)
tN = "TaskOutput"
// @from(Ln 50811, Col 4)
RV = "TaskStop"
// @from(Ln 50812, Col 4)
Cg7 = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`
// @from(Ln 50818, Col 4)
TU = {}
// @from(Ln 50827, Col 4)
vi5 = "In brief mode you must call SendUserMessage to communicate with the user — text outside it is hidden from their view."
// @from(Ln 50828, Col 4)
U16 = "SendUserMessage"
// @from(Ln 50829, Col 4)
DO1 = "Brief"
// @from(Ln 50830, Col 4)
ZO1 = "Send a message to the user"
// @from(Ln 50831, Col 4)
fO1 = "Send a message the user will read. Text outside this tool is visible in the detail view, but most won't open it — the answer lives here.\n\n`message` supports markdown. `attachments` takes file paths (absolute or cwd-relative) for images, diffs, logs.\n\n`status` labels intent: 'normal' when replying to what they just asked; 'proactive' when you're initiating — a scheduled task finished, a blocker surfaced during background work, you need input on something they haven't asked about. Set it honestly; downstream routing uses it."
// @from(Ln 50832, Col 4)
Ti5
// @from(Ln 50833, Col 4)
vh = L(() => {
    Ti5 = `## Talking to the user

${"SendUserMessage"} is where your replies go. Text outside it is visible if the user expands the detail view, but most won't — assume unread. Anything you want them to actually see goes through ${"SendUserMessage"}. The failure mode: the real answer lives in plain text while ${"SendUserMessage"} just says "done!" — they see "done!" and miss everything.

So: every time the user says something, the reply they actually read comes through ${"SendUserMessage"}. Even for "hi". Even for "thanks".

If you can answer right away, send the answer. If you need to go look — run a command, read files, check something — ack first in one line ("On it — checking the test output"), then work, then send the result. Without the ack they're staring at a spinner.

For longer work: ack → work → result. Between those, send a checkpoint when something useful happened — a decision you made, a surprise you hit, a phase boundary. Skip the filler ("running tests...") — a checkpoint earns its place by carrying information.

Keep messages tight — the decision, the file:line, the PR number. Second person always ("your config"), never third.`
})
// @from(Ln 50847, Col 0)
function i0(q) {
    return Object.hasOwn(vO1, q) ? vO1[q] : q
}
// @from(Ln 50851, Col 0)
function Ig7(q) {
    let K = [];
    for (let [_, z] of Object.entries(vO1))
        if (z === q) K.push(_);
    return K
}
// @from(Ln 50858, Col 0)
function Vi5(q) {
    return q.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)")
}
// @from(Ln 50862, Col 0)
function ki5(q) {
    return q.replaceAll("\\(", "(").replaceAll("\\)", ")").replaceAll("\\\\", "\\")
}
// @from(Ln 50866, Col 0)
function h2(q) {
    let K = Ni5(q, "(");
    if (K === -1) return {
        toolName: i0(q)
    };
    let _ = Ei5(q, ")");
    if (_ === -1 || _ <= K) return {
        toolName: i0(q)
    };
    if (_ !== q.length - 1) return {
        toolName: i0(q)
    };
    let z = q.substring(0, K),
        Y = q.substring(K + 1, _);
    if (!z) return {
        toolName: i0(q)
    };
    if (Y === "" || Y === "*") return {
        toolName: i0(z)
    };
    let A = ki5(Y);
    return {
        toolName: i0(z),
        ruleContent: A
    }
}
// @from(Ln 50893, Col 0)
function I9(q) {
    if (!q.ruleContent) return q.toolName;
    let K = Vi5(q.ruleContent);
    return `${q.toolName}(${K})`
}
// @from(Ln 50899, Col 0)
function Ni5(q, K) {
    for (let _ = 0; _ < q.length; _++)
        if (q[_] === K) {
            let z = 0,
                Y = _ - 1;
            while (Y >= 0 && q[Y] === "\\") z++, Y--;
            if (z % 2 === 0) return _
        } return -1
}
// @from(Ln 50909, Col 0)
function Ei5(q, K) {
    for (let _ = q.length - 1; _ >= 0; _--)
        if (q[_] === K) {
            let z = 0,
                Y = _ - 1;
            while (Y >= 0 && q[Y] === "\\") z++, Y--;
            if (z % 2 === 0) return _
        } return -1
}
// @from(Ln 50918, Col 4)
bg7
// @from(Ln 50918, Col 9)
vO1
// @from(Ln 50919, Col 4)
cZ = L(() => {
    sY();
    bg7 = (vh(), B7(TU)).BRIEF_TOOL_NAME, vO1 = {
        Task: T4,
        KillShell: RV,
        AgentOutputTool: tN,
        BashOutputTool: tN,
        ...bg7 ? {
            Brief: bg7
        } : {}
    }
})
// @from(Ln 50932, Col 0)
function xg7(q) {
    return TO1.filePatternTools.includes(q)
}
// @from(Ln 50936, Col 0)
function ug7(q) {
    return TO1.bashPrefixTools.includes(q)
}
// @from(Ln 50940, Col 0)
function mg7(q) {
    return TO1.customValidation[q]
}
// @from(Ln 50943, Col 4)
TO1
// @from(Ln 50944, Col 4)
Bg7 = L(() => {
    TO1 = {
        filePatternTools: ["Read", "Write", "Edit", "Glob", "NotebookRead", "NotebookEdit"],
        bashPrefixTools: ["Bash"],
        customValidation: {
            WebSearch: (q) => {
                if (q.includes("*") || q.includes("?")) return {
                    valid: !1,
                    error: "WebSearch does not support wildcards",
                    suggestion: "Use exact search terms without * or ?",
                    examples: ["WebSearch(claude ai)", "WebSearch(typescript tutorial)"]
                };
                return {
                    valid: !0
                }
            },
            WebFetch: (q) => {
                if (q.includes("://") || q.startsWith("http")) return {
                    valid: !1,
                    error: "WebFetch permissions use domain format, not URLs",
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:github.com)"]
                };
                if (!q.startsWith("domain:")) return {
                    valid: !1,
                    error: 'WebFetch permissions must use "domain:" prefix',
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:*.google.com)"]
                };
                return {
                    valid: !0
                }
            }
        }
    }
})
// @from(Ln 50981, Col 0)
function pg7(q, K) {
    let _ = 0,
        z = K - 1;
    while (z >= 0 && q[z] === "\\") _++, z--;
    return _ % 2 !== 0
}
// @from(Ln 50988, Col 0)
function VO1(q, K) {
    let _ = 0;
    for (let z = 0; z < q.length; z++)
        if (q[z] === K && !pg7(q, z)) _++;
    return _
}
// @from(Ln 50995, Col 0)
function yi5(q) {
    for (let K = 0; K < q.length - 1; K++)
        if (q[K] === "(" && q[K + 1] === ")") {
            if (!pg7(q, K)) return !0
        } return !1
}
// @from(Ln 51002, Col 0)
function kO1(q) {
    if (!q || q.trim() === "") return {
        valid: !1,
        error: "Permission rule cannot be empty"
    };
    let K = VO1(q, "("),
        _ = VO1(q, ")");
    if (K !== _) return {
        valid: !1,
        error: "Mismatched parentheses",
        suggestion: "Ensure all opening parentheses have matching closing parentheses"
    };
    if (yi5(q)) {
        let O = q.substring(0, q.indexOf("("));
        if (!O) return {
            valid: !1,
            error: "Empty parentheses with no tool name",
            suggestion: "Specify a tool name before the parentheses"
        };
        return {
            valid: !1,
            error: "Empty parentheses",
            suggestion: `Either specify a pattern or use just "${O}" without parentheses`,
            examples: [`${O}`, `${O}(some-pattern)`]
        }
    }
    let z = h2(q),
        Y = Cm(z.toolName);
    if (Y) {
        if (z.ruleContent !== void 0 || VO1(q, "(") > 0) return {
            valid: !1,
            error: "MCP rules do not support patterns in parentheses",
            suggestion: `Use "${z.toolName}" without parentheses, or use "mcp__${Y.serverName}__*" for all tools`,
            examples: [`mcp__${Y.serverName}`, `mcp__${Y.serverName}__*`, Y.toolName && Y.toolName !== "*" ? `mcp__${Y.serverName}__${Y.toolName}` : void 0].filter(Boolean)
        };
        return {
            valid: !0
        }
    }
    if (!z.toolName || z.toolName.length === 0) return {
        valid: !1,
        error: "Tool name cannot be empty"
    };
    if (z.toolName[0] !== z.toolName[0]?.toUpperCase()) return {
        valid: !1,
        error: "Tool names must start with uppercase",
        suggestion: `Use "${zv(String(z.toolName))}"`
    };
    let A = mg7(z.toolName);
    if (A && z.ruleContent !== void 0) {
        let O = A(z.ruleContent);
        if (!O.valid) return O
    }
    if (ug7(z.toolName) && z.ruleContent !== void 0) {
        let O = z.ruleContent;
        if (O.includes(":*") && !O.endsWith(":*")) return {
            valid: !1,
            error: "The :* pattern must be at the end",
            suggestion: "Move :* to the end for prefix matching, or use * for wildcard matching",
            examples: ["Bash(npm run:*) - prefix matching (legacy)", "Bash(npm run *) - wildcard matching"]
        };
        if (O === ":*") return {
            valid: !1,
            error: "Prefix cannot be empty before :*",
            suggestion: "Specify a command prefix before :*",
            examples: ["Bash(npm *)", "Bash(git *)"]
        }
    }
    if (xg7(z.toolName) && z.ruleContent !== void 0) {
        let O = z.ruleContent;
        if (O.includes(":*")) return {
            valid: !1,
            error: 'The ":*" syntax is only for Bash prefix rules',
            suggestion: 'Use glob patterns like "*" or "**" for file matching',
            examples: [`${z.toolName}(*.ts) - matches .ts files`, `${z.toolName}(src/**) - matches all files in src`, `${z.toolName}(**/*.test.ts) - matches test files`]
        };
        if (O.includes("*") && !O.match(/^\*|\*$|\*\*|\/\*|\*\.|\*\)/) && !O.includes("**")) return {
            valid: !1,
            error: "Wildcard placement might be incorrect",
            suggestion: "Wildcards are typically used at path boundaries",
            examples: [`${z.toolName}(*.js) - all .js files`, `${z.toolName}(src/*) - all files directly in src`, `${z.toolName}(src/**) - all files recursively in src`]
        }
    }
    return {
        valid: !0
    }
}
// @from(Ln 51089, Col 4)
TX8
// @from(Ln 51090, Col 4)
NO1 = L(() => {
    p7();
    fh();
    cZ();
    Bg7();
    TX8 = C6(() => y.string().superRefine((q, K) => {
        let _ = kO1(q);
        if (!_.valid) {
            let z = _.error;
            if (_.suggestion) z += `. ${_.suggestion}`;
            if (_.examples && _.examples.length > 0) z += `. Examples: ${_.examples.join(", ")}`;
            K.addIssue({
                code: y.ZodIssueCode.custom,
                message: z,
                params: {
                    received: q
                }
            })
        }
    }))
})
// @from(Ln 51112, Col 0)
function Fg7(q) {
    return y.object({
        allow: y.array(TX8()).optional().describe("List of permission rules for allowed operations"),
        deny: y.array(TX8()).optional().describe("List of permission rules for denied operations"),
        ask: y.array(TX8()).optional().describe("List of permission rules that should always prompt for confirmation"),
        defaultMode: y.enum([...p16, ...hg7(q)]).optional().describe("Default permission mode when Claude Code needs access"),
        disableBypassPermissionsMode: y.enum(["disable"]).optional().describe("Disable the ability to bypass permission prompts"),
        ...Lg7(q),
        additionalDirectories: y.array(y.string()).optional().describe("Additional directories to include in the permission scope")
    }).passthrough()
}
// @from(Ln 51124, Col 0)
function EO1(q) {
    return y.object({
        $schema: y.literal(gF7).optional().describe("JSON Schema reference for Claude Code settings"),
        apiKeyHelper: y.string().optional().describe("Path to a script that outputs authentication values"),
        proxyAuthHelper: y.string().optional().describe("Shell command that outputs a Proxy-Authorization header value (EAP)"),
        awsCredentialExport: y.string().optional().describe("Path to a script that exports AWS credentials"),
        awsAuthRefresh: y.string().optional().describe("Path to a script that refreshes AWS authentication"),
        gcpAuthRefresh: y.string().optional().describe("Command to refresh GCP authentication (e.g., gcloud auth application-default login)"),
        ...S6(process.env.CLAUDE_CODE_ENABLE_XAA) && {
            xaaIdp: y.object({
                issuer: y.string().url().describe("IdP issuer URL for OIDC discovery"),
                clientId: y.string().describe("Claude Code's client_id registered at the IdP"),
                callbackPort: y.number().int().positive().optional().describe("Fixed loopback callback port for the IdP OIDC login. Only needed if the IdP does not honor RFC 8252 port-any matching.")
            }).optional().describe("XAA (SEP-990) IdP connection. Configure once; all XAA-enabled MCP servers reuse this.")
        },
        fileSuggestion: y.object({
            type: y.literal("command"),
            command: y.string()
        }).optional().describe("Custom file suggestion configuration for @ mentions"),
        respectGitignore: y.boolean().optional().describe("Whether file picker should respect .gitignore files (default: true). Note: .ignore files are always respected."),
        cleanupPeriodDays: y.number().int().positive().optional().describe("Number of days to retain chat transcripts before automatic cleanup (default: 30). Minimum 1. Use a large value for long retention; use --no-session-persistence to disable transcript writes entirely."),
        skillListingMaxDescChars: y.number().int().positive().optional().describe("Per-skill description character cap in the skill listing sent to Claude (default: 1536). Descriptions longer than this are truncated. Raise to opt in to higher per-turn context cost."),
        skillListingBudgetFraction: y.number().gt(0).lte(1).optional().describe("Fraction of the context window (in characters) reserved for the skill listing sent to Claude (default: 0.01 = 1%). When the listing exceeds this, descriptions are shortened to fit. Raise to opt in to higher per-turn context cost."),
        env: Li5().optional().describe("Environment variables to set for Claude Code sessions"),
        attribution: y.object({
            commit: y.string().optional().describe("Attribution text for git commits, including any trailers. Empty string hides attribution."),
            pr: y.string().optional().describe("Attribution text for pull request descriptions. Empty string hides attribution.")
        }).optional().describe("Customize attribution text for commits and PRs. Each field defaults to the standard Claude Code attribution if not set."),
        includeCoAuthoredBy: y.boolean().optional().describe("Deprecated: Use attribution instead. Whether to include Claude's co-authored by attribution in commits and PRs (defaults to true)"),
        includeGitInstructions: y.boolean().optional().describe("Include built-in commit and PR workflow instructions in Claude's system prompt (default: true)"),
        permissions: Fg7(q).optional().describe("Tool usage permissions configuration"),
        model: y.string().optional().describe("Override the default model used by Claude Code"),
        availableModels: y.array(y.string()).optional().describe('Allowlist of models that users can select. Accepts family aliases ("opus" allows any opus version), version prefixes ("opus-4-5" allows only that version), and full model IDs. If undefined, all models are available. If empty array, only the default model is available. Typically set in managed settings by enterprise administrators.'),
        modelOverrides: y.record(y.string(), y.string()).optional().describe('Override mapping from Anthropic model ID (e.g. "claude-opus-4-6") to provider-specific model ID (e.g. a Bedrock inference profile ARN). Typically set in managed settings by enterprise administrators.'),
        enableAllProjectMcpServers: y.boolean().optional().describe("Whether to automatically approve all MCP servers in the project"),
        enabledMcpjsonServers: y.array(y.string()).optional().describe("List of approved MCP servers from .mcp.json"),
        disabledMcpjsonServers: y.array(y.string()).optional().describe("List of rejected MCP servers from .mcp.json"),
        skillOverrides: y.record(y.string(), y.enum(["on", "name-only", "user-invocable-only", "off"])).optional().describe('Per-skill listing overrides keyed by skill name. "name-only" lists the skill without its description; "user-invocable-only" hides it from the model but keeps /name; "off" hides it from both. Absent = on.'),
        allowedMcpServers: y.array(Ri5()).optional().describe("Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied."),
        deniedMcpServers: y.array(Si5()).optional().describe("Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied."),
        hooks: sN().optional().describe("Custom commands to run before/after tool executions"),
        worktree: y.object({
            symlinkDirectories: y.array(y.string()).optional().describe('Directories to symlink from main repository to worktrees to avoid disk bloat. Must be explicitly configured - no directories are symlinked by default. Common examples: "node_modules", ".cache", ".bin"'),
            sparsePaths: y.array(y.string()).optional().describe("Directories to include when creating worktrees, via git sparse-checkout (cone mode). " + "Dramatically faster in large monorepos — only the listed paths are written to disk.")
        }).optional().describe("Git worktree configuration for --worktree flag."),
        disableAllHooks: y.boolean().optional().describe("Disable all hooks and statusLine execution"),
        disableSkillShellExecution: y.boolean().optional().describe("Disable inline shell execution in skills and custom slash commands from user, project, or plugin sources. Commands are replaced with a placeholder instead of being run."),
        defaultShell: y.enum(["bash", "powershell"]).optional().describe("Default shell for input-box ! commands. Defaults to 'bash' on all platforms (no Windows auto-flip)."),
        allowManagedHooksOnly: y.boolean().optional().describe("When true (and set in managed settings), only hooks from managed settings run. User, project, and local hooks are ignored."),
        allowedHttpHookUrls: y.array(y.string()).optional().describe('Allowlist of URL patterns that HTTP hooks may target. Supports * as a wildcard (e.g. "https://hooks.example.com/*"). When set, HTTP hooks with non-matching URLs are blocked. If undefined, all URLs are allowed. If empty array, no HTTP hooks are allowed. Arrays merge across settings sources (same semantics as allowedMcpServers).'),
        httpHookAllowedEnvVars: y.array(y.string()).optional().describe("Allowlist of environment variable names HTTP hooks may interpolate into headers. When set, each hook's effective allowedEnvVars is the intersection with this list. If undefined, no restriction is applied. Arrays merge across settings sources (same semantics as allowedMcpServers)."),
        allowManagedPermissionRulesOnly: y.boolean().optional().describe("When true (and set in managed settings), only permission rules (allow/deny/ask) from managed settings are respected. User, project, local, and CLI argument permission rules are ignored."),
        allowManagedMcpServersOnly: y.boolean().optional().describe("When true (and set in managed settings), allowedMcpServers is only read from managed settings. deniedMcpServers still merges from all sources, so users can deny servers for themselves. Users can still add their own MCP servers, but only the admin-defined allowlist applies."),
        strictPluginOnlyCustomization: y.preprocess((K) => Array.isArray(K) ? K.filter((_) => YG6.includes(_)) : K, y.union([y.boolean(), y.array(y.enum(YG6))])).optional().catch(void 0).describe('When set in managed settings, blocks non-plugin customization sources for the listed surfaces. Array form locks specific surfaces (e.g. ["skills", "hooks"]); `true` locks all four; `false` is an explicit no-op. Blocked: ~/.claude/{surface}/, .claude/{surface}/ (project), settings.json hooks, .mcp.json. NOT blocked: managed (policySettings) sources, plugin-provided customizations. ' + "Composes with strictKnownMarketplaces for end-to-end admin control — plugins gated by " + "marketplace allowlist, everything else blocked here."),
        statusLine: y.object({
            type: y.literal("command"),
            command: y.string(),
            padding: y.number().optional(),
            refreshInterval: y.number().min(1).optional().catch(void 0).describe("Re-run the status line command every N seconds in addition to event-driven updates")
        }).optional().describe("Custom status line display configuration"),
        subagentStatusLine: y.object({
            type: y.literal("command"),
            command: y.string()
        }).optional().describe("Custom per-subagent status line shown in the agent panel; receives row context as JSON on stdin"),
        enabledPlugins: y.record(y.string(), y.union([y.array(y.string()), y.boolean(), y.undefined()])).optional().describe('Enabled plugins using plugin-id@marketplace-id format. Example: { "formatter@anthropic-tools": true }. Also supports extended format with version constraints.'),
        extraKnownMarketplaces: y.record(y.string(), hi5()).check((K) => {
            for (let [_, z] of Object.entries(K.value))
                if (z.source.source === "settings" && z.source.name !== _) K.issues.push({
                    code: "custom",
                    input: z.source.name,
                    path: [_, "source", "name"],
                    message: `Settings-sourced marketplace name must match its extraKnownMarketplaces key (got key "${_}" but source.name "${z.source.name}")`
                })
        }).optional().describe("Additional marketplaces to make available for this repository. Typically used in repository .claude/settings.json to ensure team members have required plugin sources."),
        strictKnownMarketplaces: y.array(xQ6()).optional().describe("Enterprise strict list of allowed marketplace sources. When set in managed settings, ONLY these exact sources can be added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem. " + "Note: this is a policy gate only — it does NOT register marketplaces. " + "To pre-register allowed marketplaces for users, also set extraKnownMarketplaces."),
        blockedMarketplaces: y.array(xQ6()).optional().describe("Enterprise blocklist of marketplace sources. When set in managed settings, these exact sources are blocked from being added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
        forceLoginMethod: y.enum(["claudeai", "console"]).optional().describe('Force a specific login method: "claudeai" for Claude Pro/Max, "console" for Console billing'),
        forceLoginOrgUUID: y.union([y.string(), y.array(y.string())]).optional().describe("Organization UUID to require for OAuth login. Accepts a single UUID string or an array of UUIDs (any one is permitted). When set in managed settings, login fails if the authenticated account does not belong to a listed organization."),
        forceRemoteSettingsRefresh: y.boolean().optional().describe("When set in managed settings, the CLI blocks startup until remote managed settings are freshly fetched, and exits if the fetch fails"),
        otelHeadersHelper: y.string().optional().describe("Path to a script that outputs OpenTelemetry headers"),
        outputStyle: y.string().optional().describe("Controls the output style for assistant responses"),
        viewMode: y.enum(["default", "verbose", "focus"]).optional().catch(void 0).describe("Default transcript view mode on startup"),
        language: y.string().optional().describe('Preferred language for Claude responses and voice dictation (e.g., "japanese", "spanish")'),
        skipWebFetchPreflight: y.boolean().optional().describe("Skip the WebFetch blocklist check for enterprise environments with restrictive security policies"),
        sandbox: dF7().optional(),
        feedbackSurveyRate: y.number().min(0).max(1).optional().describe("Probability (0–1) that the session quality survey appears when eligible. 0.05 is a reasonable starting point."),
        spinnerTipsEnabled: y.boolean().optional().describe("Whether to show tips in the spinner"),
        spinnerVerbs: y.object({
            mode: y.enum(["append", "replace"]),
            verbs: y.array(y.string())
        }).optional().describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),
        spinnerTipsOverride: y.object({
            excludeDefault: y.boolean().optional(),
            tips: y.array(y.string())
        }).optional().describe("Override spinner tips. tips: array of tip strings. excludeDefault: if true, only show custom tips (default: false)."),
        syntaxHighlightingDisabled: y.boolean().optional().describe("Whether to disable syntax highlighting in diffs"),
        terminalTitleFromRename: y.boolean().optional().describe("Whether /rename updates the terminal tab title (defaults to true). Set to false to keep auto-generated topic titles."),
        alwaysThinkingEnabled: y.boolean().optional().describe("When false, thinking is disabled. When absent or true, thinking is enabled automatically for supported models."),
        effortLevel: y.enum(["low", "medium", "high", "xhigh"]).optional().catch(void 0).describe("Persisted effort level for supported models."),
        autoCompactWindow: y.number().int().min(1e5).max(1e6).optional().catch(void 0).describe("Auto-compact window size"),
        advisorModel: y.string().optional().describe("Advisor model for the server-side advisor tool."),
        fastMode: y.boolean().optional().describe("When true, fast mode is enabled. When absent or false, fast mode is off."),
        fastModePerSessionOptIn: y.boolean().optional().describe("When true, fast mode does not persist across sessions. Each session starts with fast mode off."),
        promptSuggestionEnabled: y.boolean().optional().describe("When false, prompt suggestions are disabled. When absent or true, prompt suggestions are enabled."),
        awaySummaryEnabled: y.boolean().optional().describe("@internal When false, the session recap (shown when you return after being away for 5+ minutes) is disabled. When absent or true, recap is enabled. Hidden from public SDK types until external launch; mirrors voiceHandsfree pattern above."),
        showClearContextOnPlanAccept: y.boolean().optional().describe('When true, the plan-approval dialog offers a "clear context" option. Defaults to false.'),
        agent: y.string().optional().describe("Name of an agent (built-in or custom) to use for the main thread. Applies the agent's system prompt, tool restrictions, and model."),
        companyAnnouncements: y.array(y.string()).optional().describe("Company announcements to display at startup (one will be randomly selected if multiple are provided)"),
        pluginConfigs: y.record(y.string(), y.object({
            mcpServers: y.record(y.string(), y.record(y.string(), y.union([y.string(), y.number(), y.boolean(), y.array(y.string())]))).optional().describe("User configuration values for MCP servers keyed by server name"),
            options: y.record(y.string(), y.union([y.string(), y.number(), y.boolean(), y.array(y.string())])).optional().describe("Non-sensitive option values from plugin manifest userConfig, keyed by option name. Sensitive values go to secure storage instead.")
        })).optional().describe("Per-plugin configuration including MCP server user configs, keyed by plugin ID (plugin@marketplace format)"),
        remote: y.object({
            defaultEnvironmentId: y.string().optional().describe("Default environment ID to use for remote sessions")
        }).optional().describe("Remote session configuration"),
        autoUpdatesChannel: y.enum(["latest", "stable"]).optional().describe("Release channel for auto-updates (latest or stable)"),
        minimumVersion: y.string().optional().describe("Minimum version to stay on - prevents downgrades when switching to stable channel"),
        plansDirectory: y.string().optional().describe("Custom directory for plan files, relative to project root. If not set, defaults to ~/.claude/plans/"),
        tui: y.enum(["default", "fullscreen"]).optional().describe('Terminal UI renderer. "fullscreen" uses the flicker-free alt-screen renderer with virtualized scrollback (equivalent to CLAUDE_CODE_NO_FLICKER=1). "default" uses the classic main-screen renderer.'),
        ...!1,
        voice: y.object({
            enabled: y.boolean().optional(),
            mode: y.enum(["hold", "tap"]).optional().describe("'hold' (default): hold to talk. 'tap': tap to start, tap to stop+submit."),
            autoSubmit: y.boolean().optional().describe("Submit the prompt when hold-to-talk is released (hold mode only)")
        }).optional().describe("@internal Voice handsfree settings; behavior gated at read sites by feature(VOICE_HANDSFREE). Hidden from public SDK types until external launch; see TODO on voiceEnabled in entitlements.ts."),
        channelsEnabled: y.boolean().optional().describe("Teams/Enterprise opt-in for channel notifications (MCP servers with the claude/channel capability pushing inbound messages). Default off. Set true to allow; users then select servers via --channels."),
        allowedChannelPlugins: y.array(y.object({
            marketplace: y.string(),
            plugin: y.string()
        })).optional().describe("Teams/Enterprise allowlist of channel plugins. When set, " + "replaces the default Anthropic allowlist — admins decide which " + "plugins may push inbound messages. Undefined falls back to the default. Requires channelsEnabled: true."),
        prefersReducedMotion: y.boolean().optional().describe("Reduce or disable animations for accessibility (spinner shimmer, flash effects, etc.)"),
        autoMemoryEnabled: y.boolean().optional().describe("Enable auto-memory for this project. When false, Claude will not read from or write to the auto-memory directory."),
        autoMemoryDirectory: y.string().optional().describe("Custom directory path for auto-memory storage. Supports ~/ prefix for home directory expansion. Ignored if set in projectSettings (checked-in .claude/settings.json) for security. When unset, defaults to ~/.claude/projects/<sanitized-cwd>/memory/."),
        autoDreamEnabled: y.boolean().optional().describe("Enable background memory consolidation (auto-dream). When set, overrides the server-side default."),
        showThinkingSummaries: y.boolean().optional().describe("Show thinking summaries in the transcript view (ctrl+o). Default: false."),
        skipDangerousModePermissionPrompt: y.boolean().optional().describe("Whether the user has accepted the bypass permissions mode dialog"),
        disableAutoMode: y.enum(["disable"]).optional().describe("Disable auto mode"),
        sshConfigs: y.array(y.object({
            id: y.string().describe("Unique identifier for this SSH config. Used to match configs across settings sources."),
            name: y.string().describe("Display name for the SSH connection"),
            sshHost: y.string().describe('SSH host in format "user@hostname" or "hostname", or a host alias from ~/.ssh/config'),
            sshPort: y.number().int().optional().describe("SSH port (default: 22)"),
            sshIdentityFile: y.string().optional().describe("Path to SSH identity file (private key)"),
            startDirectory: y.string().optional().describe("Default working directory on the remote host. Supports tilde expansion (e.g. ~/projects). If not specified, defaults to the remote user home directory. Can be overridden by the [dir] positional argument in `claude ssh <config> [dir]`.")
        })).optional().describe("SSH connection configurations for remote environments. Typically set in managed settings by enterprise administrators to pre-configure SSH connections for team members."),
        claudeMdExcludes: y.array(y.string()).optional().describe('Glob patterns or absolute paths of CLAUDE.md files to exclude from loading. Patterns are matched against absolute file paths using picomatch. Only applies to User, Project, and Local memory types (Managed/policy files cannot be excluded). Examples: "/home/user/monorepo/CLAUDE.md", "**/code/CLAUDE.md", "**/some-dir/.claude/rules/**"'),
        pluginTrustMessage: y.string().optional().describe('Custom message to append to the plugin trust warning shown before installation. Only read from policy settings (managed-settings.json / MDM). Useful for enterprise administrators to add organization-specific context (e.g., "All plugins from our internal marketplace are vetted and approved.").'),
        ...yg7(q)
    }).passthrough()
}
// @from(Ln 51275, Col 0)
function AG6(q) {
    return "serverName" in q && q.serverName !== void 0
}
// @from(Ln 51279, Col 0)
function VX8(q) {
    return "serverCommand" in q && q.serverCommand !== void 0
}
// @from(Ln 51283, Col 0)
function kX8(q) {
    return "serverUrl" in q && q.serverUrl !== void 0
}
// @from(Ln 51286, Col 4)
Li5
// @from(Ln 51286, Col 9)
Z3O
// @from(Ln 51286, Col 14)
hi5
// @from(Ln 51286, Col 19)
Ri5
// @from(Ln 51286, Col 24)
Si5
// @from(Ln 51286, Col 29)
YG6
// @from(Ln 51286, Col 34)
CW
// @from(Ln 51287, Col 4)
Th = L(() => {
    p7();
    cF7();
    Q8();
    OP();
    Hv();
    aY();
    Rg7();
    NO1();
    MX8();
    MX8();
    Li5 = C6(() => y.record(y.string(), y.coerce.string()));
    Z3O = C6(() => Fg7(PO1())), hi5 = C6(() => y.object({
        source: xQ6().describe("Where to fetch the marketplace from"),
        installLocation: y.string().optional().describe("Local cache path where marketplace manifest is stored (auto-generated if not provided)"),
        autoUpdate: y.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
    })), Ri5 = C6(() => y.object({
        serverName: y.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
        serverCommand: y.array(y.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers"),
        serverUrl: y.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for allowed remote MCP servers')
    }).refine((q) => {
        return w7([q.serverName !== void 0, q.serverCommand !== void 0, q.serverUrl !== void 0], Boolean) === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    })), Si5 = C6(() => y.object({
        serverName: y.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that is explicitly blocked"),
        serverCommand: y.array(y.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for blocked stdio servers"),
        serverUrl: y.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for blocked remote MCP servers')
    }).refine((q) => {
        return w7([q.serverName !== void 0, q.serverCommand !== void 0, q.serverUrl !== void 0], Boolean) === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    })), YG6 = ["skills", "agents", "hooks", "mcp"];
    CW = C6(() => EO1(PO1()))
})
// @from(Ln 51323, Col 0)
function yO1(q) {
    let K = q ? EO1(q) : CW(),
        _ = zr(K, {
            unrepresentable: "any"
        });
    return I6(_, null, 2)
}
// @from(Ln 51330, Col 4)
gg7 = L(() => {
    p7();
    e8();
    Th()
})
// @from(Ln 51336, Col 0)
function Ug7(q) {
    let K = Ci5.find((z) => z.matches(q));
    if (!K) return null;
    let _ = {
        ...K.tip
    };
    if (q.code === "invalid_value" && q.enumValues && !_.suggestion) _.suggestion = `Valid values: ${q.enumValues.map((z)=>`"${z}"`).join(", ")}`;
    if (!_.docLink && q.path) {
        let z = q.path.split(".")[0];
        if (z) _.docLink = bi5[z]
    }
    return _
}
// @from(Ln 51349, Col 4)
Ci5
// @from(Ln 51349, Col 9)
bi5
// @from(Ln 51350, Col 4)
Qg7 = L(() => {
    Ci5 = [{
        matches: (q) => q.path === "permissions.defaultMode" && q.code === "invalid_value",
        tip: {
            suggestion: 'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
            docLink: "https://code.claude.com/docs/en/iam#permission-modes"
        }
    }, {
        matches: (q) => q.path === "apiKeyHelper" && q.code === "invalid_type",
        tip: {
            suggestion: 'Provide a shell command that outputs your API key to stdout. The script should output only the API key. Example: "/bin/generate_temp_api_key.sh"'
        }
    }, {
        matches: (q) => q.path === "cleanupPeriodDays" && q.code === "too_small",
        tip: {
            suggestion: 'cleanupPeriodDays must be at least 1. To keep transcripts for a long time, set a large number (e.g. 3650 for ~10 years). To disable transcript writes entirely, remove this setting and use the --no-session-persistence CLI flag or the SDK persistSession:false option instead. (0 is rejected because it previously silently disabled all transcript writes, which users setting it to mean "never clean up" did not expect.)'
        }
    }, {
        matches: (q) => q.path.startsWith("env.") && q.code === "invalid_type",
        tip: {
            suggestion: 'Environment variables must be strings. Wrap numbers and booleans in quotes. Example: "DEBUG": "true", "PORT": "3000"',
            docLink: "https://code.claude.com/docs/en/settings#environment-variables"
        }
    }, {
        matches: (q) => (q.path === "permissions.allow" || q.path === "permissions.deny") && q.code === "invalid_type" && q.expected === "array",
        tip: {
            suggestion: 'Permission rules must be in an array. Format: ["Tool(specifier)"]. Examples: ["Bash(npm run build)", "Edit(docs/**)", "Read(~/.zshrc)"]. Use * for wildcards.'
        }
    }, {
        matches: (q) => q.path.startsWith("hooks.") && q.code === "invalid_key",
        tip: {
            suggestion: "Not a recognized hook event. Common events: PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, SessionEnd, Stop. Check spelling and capitalization.",
            docLink: "https://code.claude.com/docs/en/hooks"
        }
    }, {
        matches: (q) => q.path.includes("hooks") && q.code === "invalid_type",
        tip: {
            suggestion: 'Hooks use a matcher + hooks array. The matcher is a string: a tool name ("Bash"), pipe-separated list ("Edit|Write"), or empty to match all. Example: {"PostToolUse": [{"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "echo Done"}]}]}'
        }
    }, {
        matches: (q) => q.code === "invalid_type" && q.expected === "boolean",
        tip: {
            suggestion: 'Use true or false without quotes. Example: "includeCoAuthoredBy": true'
        }
    }, {
        matches: (q) => q.code === "unrecognized_keys",
        tip: {
            suggestion: "Check for typos or refer to the documentation for valid fields",
            docLink: "https://code.claude.com/docs/en/settings"
        }
    }, {
        matches: (q) => q.code === "invalid_value" && q.enumValues !== void 0,
        tip: {
            suggestion: void 0
        }
    }, {
        matches: (q) => q.code === "invalid_type" && q.expected === "object" && q.received === null && q.path === "",
        tip: {
            suggestion: "Check for missing commas, unmatched brackets, or trailing commas. Use a JSON validator to identify the exact syntax error."
        }
    }, {
        matches: (q) => q.path === "permissions.additionalDirectories" && q.code === "invalid_type",
        tip: {
            suggestion: 'Must be an array of directory paths. Example: ["~/projects", "/tmp/workspace"]. You can also use --add-dir flag or /add-dir command',
            docLink: "https://code.claude.com/docs/en/iam#working-directories"
        }
    }], bi5 = {
        permissions: "https://code.claude.com/docs/en/iam#configuring-permissions",
        env: "https://code.claude.com/docs/en/settings#environment-variables",
        hooks: "https://code.claude.com/docs/en/hooks"
    }
})
// @from(Ln 51423, Col 0)
function dg7(q) {
    return q.code === "invalid_type"
}
// @from(Ln 51427, Col 0)
function cg7(q) {
    return q.code === "invalid_value"
}
// @from(Ln 51431, Col 0)
function Ii5(q) {
    return q.code === "unrecognized_keys"
}
// @from(Ln 51435, Col 0)
function lg7(q) {
    return q.code === "too_small"
}
// @from(Ln 51439, Col 0)
function LO1(q) {
    if (q === null) return "null";
    if (q === void 0) return "undefined";
    if (Array.isArray(q)) return "array";
    return typeof q
}
// @from(Ln 51446, Col 0)
function ng7(q) {
    let K = q.match(/received (\w+)/);
    return K ? K[1] : void 0
}
// @from(Ln 51451, Col 0)
function UA6(q, K) {
    return q.issues.map((_) => {
        let z = _.path.map(String).join("."),
            Y = _.message,
            A, O, w, $, j;
        if (cg7(_)) O = _.values.map((J) => String(J)), w = O.join(" | "), $ = void 0, j = void 0;
        else if (dg7(_)) {
            w = _.expected;
            let J = ng7(_.message);
            $ = J ?? LO1(_.input), j = J ?? LO1(_.input)
        } else if (lg7(_)) w = String(_.minimum);
        else if (_.code === "custom" && "params" in _) $ = _.params.received, j = $;
        let H = Ug7({
            path: z,
            code: _.code,
            expected: w,
            received: $,
            enumValues: O,
            message: _.message,
            value: $
        });
        if (cg7(_)) A = O?.map((J) => `"${J}"`).join(", "), Y = `Invalid value. Expected one of: ${A}`;
        else if (dg7(_)) {
            let J = ng7(_.message) ?? LO1(_.input);
            if (_.expected === "object" && J === "null" && z === "") Y = "Invalid or malformed JSON";
            else Y = `Expected ${_.expected}, but received ${J}`
        } else if (Ii5(_)) {
            let J = _.keys.join(", ");
            Y = `Unrecognized ${O7(_.keys.length,"field")}: ${J}`
        } else if (lg7(_)) Y = `Number must be greater than or equal to ${_.minimum}`, A = String(_.minimum);
        return {
            file: K,
            path: z,
            message: Y,
            expected: A,
            invalidValue: j,
            suggestion: H?.suggestion,
            docLink: H?.docLink
        }
    })
}
// @from(Ln 51493, Col 0)
function hO1(q) {
    try {
        let K = n8(q),
            _ = CW().strict().safeParse(K);
        if (_.success) return {
            isValid: !0
        };
        return {
            isValid: !1,
            error: `Settings validation failed:
` + UA6(_.error, "settings").map((A) => {
                let O = `- ${A.path}: ${A.message}`;
                if (A.suggestion) O += `. ${A.suggestion}`;
                return O
            }).join(`
`),
            fullSchema: yO1()
        }
    } catch (K) {
        return {
            isValid: !1,
            error: `Invalid JSON: ${K instanceof Error?K.message:"Unknown parsing error"}`,
            fullSchema: yO1()
        }
    }
}
// @from(Ln 51520, Col 0)
function xi5(q, K) {
    if (!q || typeof q !== "object") return [];
    let _ = q;
    if (!_.permissions || typeof _.permissions !== "object") return [];
    let z = _.permissions,
        Y = [];
    for (let A of ["allow", "deny", "ask"]) {
        let O = z[A];
        if (!Array.isArray(O)) continue;
        z[A] = O.filter((w) => {
            if (typeof w !== "string") return Y.push({
                file: K,
                path: `permissions.${A}`,
                message: `Non-string value in ${A} array was removed`,
                severity: "warning",
                invalidValue: w
            }), !1;
            let $ = kO1(w);
            if (!$.valid) {
                let j = `Invalid permission rule "${w}" was skipped`;
                if ($.error) j += `: ${$.error}`;
                if ($.suggestion) j += `. ${$.suggestion}`;
                return Y.push({
                    file: K,
                    path: `permissions.${A}`,
                    message: j,
                    severity: "warning",
                    invalidValue: w
                }), !1
            }
            return !0
        })
    }
    return Y
}
// @from(Ln 51556, Col 0)
function mi5(q, K) {
    if (!q || typeof q !== "object") return [];
    let _ = q;
    if (!_.hooks || typeof _.hooks !== "object" || Array.isArray(_.hooks)) return [];
    let z = _.hooks,
        Y = [];
    for (let A of Object.keys(z)) {
        if (ui5.has(A)) continue;
        delete z[A], Y.push({
            file: K,
            path: `hooks.${A}`,
            message: `Unknown hook event "${A}" was ignored. Valid events: ${hV.join(", ")}`,
            severity: "warning",
            invalidValue: A,
            docLink: "https://code.claude.com/docs/en/hooks"
        })
    }
    if (Y.length > 0 && Object.keys(z).length === 0) delete _.hooks;
    return Y
}
// @from(Ln 51577, Col 0)
function eC(q, K) {
    return [...xi5(q, K), ...mi5(q, K)]
}
// @from(Ln 51580, Col 4)
ui5
// @from(Ln 51581, Col 4)
pQ6 = L(() => {
    pA6();
    e8();
    NO1();
    gg7();
    Th();
    Qg7();
    ui5 = new Set(hV)
})
// @from(Ln 51594, Col 0)
function sg7() {
    let q = "";
    try {
        q = Bi5().username
    } catch {}
    let K = [];
    if (q) K.push({
        path: `/Library/Managed Preferences/${q}/${ig7}.plist`,
        label: "per-user managed preferences"
    });
    return K.push({
        path: `/Library/Managed Preferences/${ig7}.plist`,
        label: "device-level managed preferences"
    }), K
}
// @from(Ln 51609, Col 4)
ig7 = "com.anthropic.claudecode"
// @from(Ln 51610, Col 4)
NX8 = "HKLM\\SOFTWARE\\Policies\\ClaudeCode"
// @from(Ln 51611, Col 4)
EX8 = "HKCU\\SOFTWARE\\Policies\\ClaudeCode"
// @from(Ln 51612, Col 4)
OG6 = "Settings"
// @from(Ln 51613, Col 4)
rg7 = "/usr/bin/plutil"
// @from(Ln 51614, Col 4)
og7
// @from(Ln 51614, Col 9)
ag7 = 5000
// @from(Ln 51615, Col 4)
RO1 = L(() => {
    og7 = ["-convert", "json", "-o", "-", "--"]
})
// @from(Ln 51625, Col 0)
function SO1(q, K) {
    return new Promise((_) => {
        pi5(q, K, {
            encoding: "utf-8",
            timeout: ag7
        }, (z, Y) => {
            _({
                stdout: Y ?? "",
                code: z ? 1 : 0
            })
        })
    })
}
// @from(Ln 51639, Col 0)
function yX8() {
    return (async () => {
        if (process.platform === "darwin") {
            let q = sg7(),
                _ = (await Promise.all(q.map(async ({
                    path: z,
                    label: Y
                }) => {
                    if (!Fi5(z)) return {
                        stdout: "",
                        label: Y,
                        ok: !1
                    };
                    let {
                        stdout: A,
                        code: O
                    } = await SO1(rg7, [...og7, z]);
                    return {
                        stdout: A,
                        label: Y,
                        ok: O === 0 && !!A
                    }
                }))).find((z) => z.ok);
            return {
                plistStdouts: _ ? [{
                    stdout: _.stdout,
                    label: _.label
                }] : [],
                hklmStdout: null,
                hkcuStdout: null
            }
        }
        if (process.platform === "win32") {
            let K = `${process.env.SYSTEMROOT||"C:\\Windows"}\\System32\\reg.exe`,
                [_, z] = await Promise.all([SO1(K, ["query", NX8, "/v", OG6]), SO1(K, ["query", EX8, "/v", OG6])]);
            return {
                plistStdouts: null,
                hklmStdout: _.code === 0 ? _.stdout : null,
                hkcuStdout: z.code === 0 ? z.stdout : null
            }
        }
        return {
            plistStdouts: null,
            hklmStdout: null,
            hkcuStdout: null
        }
    })()
}
// @from(Ln 51688, Col 0)
function tg7() {
    if (CO1) return;
    CO1 = yX8()
}
// @from(Ln 51693, Col 0)
function eg7() {
    return CO1
}
// @from(Ln 51696, Col 4)
CO1 = null
// @from(Ln 51697, Col 4)
bO1 = L(() => {
    RO1()
})
// @from(Ln 51704, Col 0)
function gi5() {
    if (LX8) return;
    LX8 = (async () => {
        XK("mdm_load_start");
        let q = Date.now(),
            K = eg7() ?? yX8(),
            {
                mdm: _,
                hkcu: z
            } = AU7(await K);
        xO1 = _, uO1 = z, XK("mdm_load_end");
        let Y = Date.now() - q;
        if (E(`MDM settings load completed in ${Y}ms`), Object.keys(_.settings).length > 0) {
            E(`MDM settings found: ${Object.keys(_.settings).join(", ")}`);
            try {
                j1("info", "mdm_settings_loaded", {
                    duration_ms: Y,
                    key_count: Object.keys(_.settings).length,
                    error_count: _.errors.length
                })
            } catch {}
        }
    })()
}
// @from(Ln 51728, Col 0)
async function _U7() {
    if (!LX8) gi5();
    await LX8
}
// @from(Ln 51733, Col 0)
function wG6() {
    return xO1 ?? QA6
}
// @from(Ln 51737, Col 0)
function $G6() {
    return uO1 ?? QA6
}
// @from(Ln 51741, Col 0)
function zU7(q, K) {
    xO1 = q, uO1 = K
}
// @from(Ln 51744, Col 0)
async function YU7() {
    let q = await yX8();
    return AU7(q)
}
// @from(Ln 51749, Col 0)
function IO1(q, K) {
    let _ = structuredClone(k5(q, !1));
    if (!_ || typeof _ !== "object") return {
        settings: {},
        errors: []
    };
    let z = eC(_, K),
        Y = CW().safeParse(_);
    if (!Y.success) {
        let A = UA6(Y.error, K);
        return {
            settings: {},
            errors: [...z, ...A]
        }
    }
    return {
        settings: Y.data,
        errors: z
    }
}
// @from(Ln 51770, Col 0)
function KU7(q, K = "Settings") {
    let _ = q.split(/\r?\n/),
        z = K.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        Y = new RegExp(`^\\s+${z}\\s+REG_(?:EXPAND_)?SZ\\s+(.*)$`, "i");
    for (let A of _) {
        let O = A.match(Y);
        if (O && O[1]) return O[1].trimEnd()
    }
    return null
}
// @from(Ln 51781, Col 0)
function AU7(q) {
    let K = [];
    if (q.plistStdouts && q.plistStdouts.length > 0) {
        let {
            stdout: z,
            label: Y
        } = q.plistStdouts[0], A = IO1(z, Y);
        if (Object.keys(A.settings).length > 0) return {
            mdm: A,
            hkcu: QA6
        };
        K.push(...A.errors)
    }
    if (q.hklmStdout) {
        let z = KU7(q.hklmStdout);
        if (z) {
            let Y = IO1(z, `Registry: ${NX8}\\${OG6}`);
            if (Object.keys(Y.settings).length > 0) return {
                mdm: Y,
                hkcu: QA6
            };
            K.push(...Y.errors)
        }
    }
    let _ = K.length > 0 ? {
        settings: {},
        errors: K
    } : QA6;
    if (Ui5()) return {
        mdm: _,
        hkcu: QA6
    };
    if (q.hkcuStdout) {
        let z = KU7(q.hkcuStdout);
        if (z) {
            let Y = IO1(z, `Registry: ${EX8}\\${OG6}`);
            return {
                mdm: _,
                hkcu: Y
            }
        }
    }
    return {
        mdm: _,
        hkcu: QA6
    }
}
// @from(Ln 51829, Col 0)
function Ui5() {
    function q(K) {
        let _ = structuredClone(k5(VV(K), !1));
        if (!_ || typeof _ !== "object") return !1;
        return eC(_, K), Object.keys(_).length > 0
    }
    try {
        if (q(qU7(SW(), "managed-settings.json"))) return !0
    } catch {}
    try {
        let K = ZU(),
            _ = V8().readdirSync(K);
        for (let z of _) {
            if (!(z.isFile() || z.isSymbolicLink()) || !z.name.endsWith(".json") || z.name.startsWith(".")) continue;
            try {
                if (q(qU7(K, z.name))) return !0
            } catch {}
        }
    } catch {}
    return !1
}
// @from(Ln 51850, Col 4)
QA6
// @from(Ln 51850, Col 9)
xO1 = null
// @from(Ln 51851, Col 4)
uO1 = null
// @from(Ln 51852, Col 4)
LX8 = null
// @from(Ln 51853, Col 4)
hX8 = L(() => {
    K8();
    VA();
    nN();
    Yq();
    mO();
    ag();
    Rm();
    Th();
    pQ6();
    RO1();
    bO1();
    QA6 = Object.freeze({
        settings: {},
        errors: []
    })
})
// @from(Ln 51870, Col 4)
RX8
// @from(Ln 51871, Col 4)
mO1 = L(() => {
    nH();
    RX8 = l5()
})
// @from(Ln 51875, Col 4)
UQ6 = {}
// @from(Ln 51905, Col 0)
function FO1() {
    return jG6(SW(), "managed-settings.json")
}
// @from(Ln 51909, Col 0)
function SX8() {
    let q = [],
        K = {},
        _ = !1,
        {
            settings: z,
            errors: Y
        } = hr(FO1());
    if (q.push(...Y), z && Object.keys(z).length > 0) K = Zr(K, z, Q16), _ = !0;
    let A = ZU();
    try {
        let O = V8().readdirSync(A).filter((w) => (w.isFile() || w.isSymbolicLink()) && w.name.endsWith(".json") && !w.name.startsWith(".")).map((w) => w.name).sort();
        for (let w of O) {
            let {
                settings: $,
                errors: j
            } = hr(jG6(A, w));
            if (q.push(...j), $ && Object.keys($).length > 0) K = Zr(K, $, Q16), _ = !0
        }
    } catch (O) {
        let w = Q1(O);
        if (w !== "ENOENT" && w !== "ENOTDIR") j6(O)
    }
    return {
        settings: _ ? K : null,
        errors: q
    }
}
// @from(Ln 51938, Col 0)
function gO1() {
    let {
        settings: q
    } = hr(FO1()), K = !!q && Object.keys(q).length > 0, _ = !1, z = ZU();
    try {
        _ = V8().readdirSync(z).some((Y) => (Y.isFile() || Y.isSymbolicLink()) && Y.name.endsWith(".json") && !Y.name.startsWith("."))
    } catch {}
    return {
        hasBase: K,
        hasDropIns: _
    }
}
// @from(Ln 51951, Col 0)
function wU7(q, K) {
    if (t1(q)) E(`Broken symlink or missing file encountered for settings.json at path: ${K}`);
    else j6(q)
}
// @from(Ln 51956, Col 0)
function hr(q) {
    let K = If7(q);
    if (K) return {
        settings: K.settings ? H71(K.settings) : null,
        errors: K.errors
    };
    let _ = Qi5(q);
    return xf7(q, _), {
        settings: _.settings ? H71(_.settings) : null,
        errors: _.errors
    }
}
// @from(Ln 51969, Col 0)
function $U7() {
    let q = vr();
    if (!q || Object.keys(q).length === 0) return null;
    let K = structuredClone(q);
    eC(K, "remote managed settings");
    let _ = CW().safeParse(K);
    return _.success && Object.keys(_.data).length > 0 ? _.data : null
}
// @from(Ln 51978, Col 0)
function jU7() {
    let q = aB6();
    if (!q) return {
        settings: null,
        errors: []
    };
    let K = structuredClone(q),
        _ = eC(K, "SDK inline settings"),
        z = CW().safeParse(K);
    if (!z.success) return {
        settings: null,
        errors: [..._, ...UA6(z.error, "SDK inline settings")]
    };
    return {
        settings: z.data,
        errors: _
    }
}
// @from(Ln 51997, Col 0)
function Qi5(q) {
    try {
        let {
            resolvedPath: K
        } = vA(V8(), q), _ = VV(K);
        if (_.trim() === "") return {
            settings: {},
            errors: []
        };
        let z = structuredClone(k5(_, !1)),
            Y = eC(z, q),
            A = CW().safeParse(z);
        if (!A.success) {
            let O = UA6(A.error, q);
            return {
                settings: null,
                errors: [...Y, ...O]
            }
        }
        return {
            settings: A.data,
            errors: Y
        }
    } catch (K) {
        return wU7(K, q), {
            settings: null,
            errors: []
        }
    }
}
// @from(Ln 52028, Col 0)
function d16(q) {
    switch (q) {
        case "userSettings":
            return FQ6(A7());
        case "policySettings":
        case "projectSettings":
        case "localSettings":
            return FQ6(Y7());
        case "flagSettings": {
            let K = L86();
            return K ? OU7(FQ6(K)) : FQ6(Y7())
        }
    }
}
// @from(Ln 52043, Col 0)
function di5() {
    if (qp6() || S6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return "cowork_settings.json";
    return "settings.json"
}
// @from(Ln 52048, Col 0)
function Ww(q) {
    switch (q) {
        case "userSettings":
            return jG6(d16(q), di5());
        case "projectSettings":
        case "localSettings":
            return jG6(d16(q), c16(q));
        case "policySettings":
            return FO1();
        case "flagSettings":
            return L86()
    }
}
// @from(Ln 52062, Col 0)
function c16(q) {
    switch (q) {
        case "projectSettings":
            return jG6(".claude", "settings.json");
        case "localSettings":
            return jG6(".claude", "settings.local.json")
    }
}
// @from(Ln 52071, Col 0)
function E1(q) {
    let K = Cf7(q);
    if (K !== void 0) return K;
    let _ = HU7(q);
    return bf7(q, _), _
}
// @from(Ln 52078, Col 0)
function HU7(q) {
    if (q === "policySettings") {
        let z = $U7();
        if (z) return z;
        let Y = wG6();
        if (Object.keys(Y.settings).length > 0) return Y.settings;
        let {
            settings: A
        } = SX8();
        if (A) return A;
        let O = $G6();
        if (Object.keys(O.settings).length > 0) return O.settings;
        return null
    }
    let K = Ww(q),
        {
            settings: _
        } = K ? hr(K) : {
            settings: null
        };
    if (q === "flagSettings") {
        let {
            settings: z
        } = jU7();
        if (z) return Zr(_ || {}, z, Q16)
    }
    return _
}
// @from(Ln 52107, Col 0)
function UO1() {
    if ($U7()) return "remote";
    let q = wG6();
    if (Object.keys(q.settings).length > 0) return y1() === "macos" ? "plist" : "hklm";
    let {
        settings: K
    } = SX8();
    if (K) return "file";
    let _ = $G6();
    if (Object.keys(_.settings).length > 0) return "hkcu";
    return null
}
// @from(Ln 52120, Col 0)
function P7(q, K) {
    if (q === "policySettings" || q === "flagSettings") return {
        error: null
    };
    let _ = Ww(q);
    if (!_) return {
        error: null
    };
    try {
        V8().mkdirSync(OU7(_));
        let z = HU7(q);
        if (!z) {
            let A = null;
            try {
                A = VV(_)
            } catch (O) {
                if (!t1(O)) throw O
            }
            if (A !== null) {
                let O = k5(A);
                if (O === null) return {
                    error: Error(`Invalid JSON syntax in settings file at ${_}`)
                };
                if (O && typeof O === "object") z = O, E(`Using raw settings from ${_} due to validation failure`)
            }
        }
        let Y = Zr(z || {}, K, (A, O, w, $) => {
            if (O === void 0 && $ && typeof w === "string") {
                delete $[w];
                return
            }
            if (Array.isArray(O)) return O;
            return
        });
        if (qO1(_), Uf6(_, I6(Y, null, 2) + `
`), u0(), q === "localSettings") vF7(c16("localSettings"), Y7())
    } catch (z) {
        let Y = Error(`Failed to read raw settings from ${_}: ${z}`);
        return j6(Y), {
            error: Y
        }
    }
    try {
        RX8.emit(q)
    } catch (z) {
        for (let Y of z instanceof AggregateError ? z.errors : [z]) j6(Y)
    }
    return {
        error: null
    }
}
// @from(Ln 52172, Col 0)
function ci5(q, K) {
    return F4([...q, ...K])
}
// @from(Ln 52176, Col 0)
function Q16(q, K) {
    if (Array.isArray(q) && Array.isArray(K)) return ci5(q, K);
    return
}
// @from(Ln 52181, Col 0)
function QO1(q) {
    let K = CW().strip().parse(q),
        _ = ["permissions", "sandbox", "hooks"],
        z = [],
        Y = {
            permissions: new Set(["allow", "deny", "ask", "defaultMode", "disableBypassPermissionsMode", "disableAutoMode", "additionalDirectories"]),
            sandbox: new Set(["enabled", "failIfUnavailable", "allowUnsandboxedCommands", "network", "filesystem", "ignoreViolations", "excludedCommands", "autoAllowBashIfSandboxed", "enableWeakerNestedSandbox", "enableWeakerNetworkIsolation", "ripgrep"]),
            hooks: new Set(["PreToolUse", "PostToolUse", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStop", "PreCompact", "PostCompact", "TeammateIdle", "TaskCreated", "TaskCompleted"])
        };
    for (let A of Object.keys(K))
        if (_.includes(A) && K[A] && typeof K[A] === "object") {
            let O = K[A],
                w = Y[A];
            if (w) {
                for (let $ of Object.keys(O))
                    if (w.has($)) z.push(`${A}.${$}`)
            }
        } else z.push(A);
    return z.sort()
}
// @from(Ln 52202, Col 0)
function li5() {
    if (BO1) return {
        settings: {},
        errors: []
    };
    let q = Date.now();
    XK("loadSettingsFromDisk_start"), j1("info", "settings_load_started"), BO1 = !0;
    try {
        let K = CO8(),
            _ = {};
        if (K) _ = Zr(_, K, Q16);
        let z = [],
            Y = new Set,
            A = new Set;
        for (let O of Er()) {
            if (O === "policySettings") {
                let $ = null,
                    j = [],
                    H = vr();
                if (H && Object.keys(H).length > 0) {
                    let J = structuredClone(H);
                    j.push(...eC(J, "remote managed settings"));
                    let X = CW().safeParse(J);
                    if (X.success) {
                        if (Object.keys(X.data).length > 0) $ = X.data
                    } else j.push(...UA6(X.error, "remote managed settings"))
                }
                if (!$) {
                    let J = wG6();
                    if (Object.keys(J.settings).length > 0) $ = J.settings;
                    j.push(...J.errors)
                }
                if (!$) {
                    let {
                        settings: J,
                        errors: X
                    } = SX8();
                    if (J) $ = J;
                    j.push(...X)
                }
                if (!$) {
                    let J = $G6();
                    if (Object.keys(J.settings).length > 0) $ = J.settings;
                    j.push(...J.errors)
                }
                if ($) _ = Zr(_, $, Q16);
                for (let J of j) {
                    let X = `${J.file}:${J.path}:${J.message}`;
                    if (!Y.has(X)) Y.add(X), z.push(J)
                }
                continue
            }
            let w = Ww(O);
            if (w) {
                let $ = FQ6(w);
                if (!A.has($)) {
                    A.add($);
                    let {
                        settings: j,
                        errors: H
                    } = hr(w);
                    for (let J of H) {
                        let X = `${J.file}:${J.path}:${J.message}`;
                        if (!Y.has(X)) Y.add(X), z.push(J)
                    }
                    if (j) _ = Zr(_, j, Q16)
                }
            }
            if (O === "flagSettings") {
                let {
                    settings: $,
                    errors: j
                } = jU7();
                for (let H of j) {
                    let J = `${H.file}:${H.path}:${H.message}`;
                    if (!Y.has(J)) Y.add(J), z.push(H)
                }
                if ($) _ = Zr(_, $, Q16)
            }
        }
        return j1("info", "settings_load_completed", {
            duration_ms: Date.now() - q,
            source_count: A.size,
            error_count: z.length
        }), {
            settings: _,
            errors: z
        }
    } finally {
        BO1 = !1
    }
}
// @from(Ln 52295, Col 0)
function v7() {
    let {
        settings: q
    } = bm();
    return q || {}
}
// @from(Ln 52302, Col 0)
function gQ6(q) {
    if (!pf7()) d("tengu_plugin_settings_premature_read", {
        key: q
    });
    let {
        settings: K
    } = bm();
    return (K || {})[q]
}
// @from(Ln 52312, Col 0)
function dO1() {
    u0();
    let q = [];
    for (let K of Er()) {
        let _ = E1(K);
        if (_ && Object.keys(_).length > 0) q.push({
            source: K,
            settings: _
        })
    }
    return {
        effective: v7(),
        sources: q
    }
}
// @from(Ln 52328, Col 0)
function bm() {
    let q = Rf7();
    if (q !== null) return q;
    let K = li5();
    return XK("loadSettingsFromDisk_end"), Sf7(K), K
}
// @from(Ln 52335, Col 0)
function dA6() {
    return !!(E1("userSettings")?.skipDangerousModePermissionPrompt || E1("localSettings")?.skipDangerousModePermissionPrompt || E1("flagSettings")?.skipDangerousModePermissionPrompt || E1("policySettings")?.skipDangerousModePermissionPrompt)
}
// @from(Ln 52339, Col 0)
function VU() {
    {
        if (E1("policySettings")?.permissions?.defaultMode === "auto") return E("[auto-mode] hasAutoModeOptIn=true policy defaultMode=auto implies consent"), !0;
        let q = E1("userSettings")?.skipAutoPermissionPrompt,
            K = E1("localSettings")?.skipAutoPermissionPrompt,
            _ = E1("flagSettings")?.skipAutoPermissionPrompt,
            z = E1("policySettings")?.skipAutoPermissionPrompt,
            Y = !!(q || K || _ || z);
        return E(`[auto-mode] hasAutoModeOptIn=${Y} skipAutoPermissionPrompt: user=${q} local=${K} flag=${_} policy=${z}`), Y
    }
    return !1
}
// @from(Ln 52352, Col 0)
function cO1() {
    return E1("policySettings")?.useAutoModeDuringPlan !== !1 && E1("flagSettings")?.useAutoModeDuringPlan !== !1 && E1("userSettings")?.useAutoModeDuringPlan !== !1 && E1("localSettings")?.useAutoModeDuringPlan !== !1
}
// @from(Ln 52356, Col 0)
function HG6() {
    {
        let q = y.object({
                allow: y.array(y.string()).optional(),
                soft_deny: y.array(y.string()).optional(),
                deny: y.array(y.string()).optional(),
                environment: y.array(y.string()).optional()
            }),
            K = [],
            _ = [],
            z = [];
        for (let Y of ["userSettings", "localSettings", "flagSettings", "policySettings"]) {
            let A = E1(Y);
            if (!A) continue;
            let O = q.safeParse(A.autoMode);
            if (O.success) {
                if (O.data.allow) K.push(...O.data.allow);
                if (O.data.soft_deny) _.push(...O.data.soft_deny);
                if (O.data.environment) z.push(...O.data.environment)
            }
        }
        if (K.length > 0 || _.length > 0 || z.length > 0) return {
            ...K.length > 0 && {
                allow: K
            },
            ..._.length > 0 && {
                soft_deny: _
            },
            ...z.length > 0 && {
                environment: z
            }
        }
    }
    return
}
// @from(Ln 52392, Col 0)
function lO1(q) {
    for (let K of Er()) {
        if (K === "policySettings") continue;
        let _ = Ww(K);
        if (!_) continue;
        try {
            let {
                resolvedPath: z
            } = vA(V8(), _), Y = VV(z);
            if (!Y.trim()) continue;
            let A = k5(Y, !1);
            if (A && typeof A === "object" && q in A) return !0
        } catch (z) {
            wU7(z, _)
        }
    }
    return !1
}
// @from(Ln 52410, Col 4)
BO1 = !1
// @from(Ln 52411, Col 4)
y7
// @from(Ln 52412, Col 4)
a1 = L(() => {
    fm7();
    p7();
    y8();
    C8();
    wJ8();
    K8();
    VA();
    Q8();
    m8();
    eK();
    nN();
    Yq();
    lA1();
    mO();
    U8();
    NK();
    e8();
    ag();
    aY();
    _X8();
    Rm();
    hX8();
    Li();
    mO1();
    Th();
    pQ6();
    y7 = v7
})
// @from(Ln 52441, Col 4)
MU7 = p((eN) => {
    var ni5 = eN && eN.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        ii5 = eN && eN.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        JU7 = eN && eN.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) ni5(K, q, _)
            }
            return ii5(K, q), K
        };
    Object.defineProperty(eN, "__esModule", {
        value: !0
    });
    eN.req = eN.json = eN.toBuffer = void 0;
    var ri5 = JU7(d6("http")),
        oi5 = JU7(d6("https"));
    async function XU7(q) {
        let K = 0,
            _ = [];
        for await (let z of q) K += z.length, _.push(z);
        return Buffer.concat(_, K)
    }
    eN.toBuffer = XU7;
    async function ai5(q) {
        let _ = (await XU7(q)).toString("utf8");
        try {
            return JSON.parse(_)
        } catch (z) {
            let Y = z;
            throw Y.message += ` (input: ${_})`, Y
        }
    }
    eN.json = ai5;

    function si5(q, K = {}) {
        let z = ((typeof q === "string" ? q : q.href).startsWith("https:") ? oi5 : ri5).request(q, K),
            Y = new Promise((A, O) => {
                z.once("response", A).once("error", O).end()
            });
        return z.then = Y.then.bind(Y), z
    }
    eN.req = si5
})
// @from(Ln 52506, Col 4)
nO1 = p((Vh) => {
    var WU7 = Vh && Vh.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        ti5 = Vh && Vh.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        DU7 = Vh && Vh.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) WU7(K, q, _)
            }
            return ti5(K, q), K
        },
        ei5 = Vh && Vh.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) WU7(K, q, _)
        };
    Object.defineProperty(Vh, "__esModule", {
        value: !0
    });
    Vh.Agent = void 0;
    var qr5 = DU7(d6("net")),
        PU7 = DU7(d6("http")),
        Kr5 = d6("https");
    ei5(MU7(), Vh);
    var kU = Symbol("AgentBaseInternalState");
    class ZU7 extends PU7.Agent {
        constructor(q) {
            super(q);
            this[kU] = {}
        }
        isSecureEndpoint(q) {
            if (q) {
                if (typeof q.secureEndpoint === "boolean") return q.secureEndpoint;
                if (typeof q.protocol === "string") return q.protocol === "https:"
            }
            let {
                stack: K
            } = Error();
            if (typeof K !== "string") return !1;
            return K.split(`
`).some((_) => _.indexOf("(https.js:") !== -1 || _.indexOf("node:https:") !== -1)
        }
        incrementSockets(q) {
            if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0) return null;
            if (!this.sockets[q]) this.sockets[q] = [];
            let K = new qr5.Socket({
                writable: !1
            });
            return this.sockets[q].push(K), this.totalSocketCount++, K
        }
        decrementSockets(q, K) {
            if (!this.sockets[q] || K === null) return;
            let _ = this.sockets[q],
                z = _.indexOf(K);
            if (z !== -1) {
                if (_.splice(z, 1), this.totalSocketCount--, _.length === 0) delete this.sockets[q]
            }
        }
        getName(q) {
            if (typeof q.secureEndpoint === "boolean" ? q.secureEndpoint : this.isSecureEndpoint(q)) return Kr5.Agent.prototype.getName.call(this, q);
            return super.getName(q)
        }
        createSocket(q, K, _) {
            let z = {
                    ...K,
                    secureEndpoint: this.isSecureEndpoint(K)
                },
                Y = this.getName(z),
                A = this.incrementSockets(Y);
            Promise.resolve().then(() => this.connect(q, z)).then((O) => {
                if (this.decrementSockets(Y, A), O instanceof PU7.Agent) try {
                    return O.addRequest(q, z)
                } catch (w) {
                    return _(w)
                }
                this[kU].currentSocket = O, super.createSocket(q, K, _)
            }, (O) => {
                this.decrementSockets(Y, A), _(O)
            })
        }
        createConnection() {
            let q = this[kU].currentSocket;
            if (this[kU].currentSocket = void 0, !q) throw Error("No socket was returned in the `connect()` function");
            return q
        }
        get defaultPort() {
            return this[kU].defaultPort ?? (this.protocol === "https:" ? 443 : 80)
        }
        set defaultPort(q) {
            if (this[kU]) this[kU].defaultPort = q
        }
        get protocol() {
            return this[kU].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:")
        }
        set protocol(q) {
            if (this[kU]) this[kU].protocol = q
        }
    }
    Vh.Agent = ZU7
})
// @from(Ln 52626, Col 4)
fU7 = p((JG6) => {
    var _r5 = JG6 && JG6.__importDefault || function(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    };
    Object.defineProperty(JG6, "__esModule", {
        value: !0
    });
    JG6.parseProxyResponse = void 0;
    var zr5 = _r5($f6()),
        CX8 = (0, zr5.default)("https-proxy-agent:parse-proxy-response");

    function Yr5(q) {
        return new Promise((K, _) => {
            let z = 0,
                Y = [];

            function A() {
                let H = q.read();
                if (H) j(H);
                else q.once("readable", A)
            }

            function O() {
                q.removeListener("end", w), q.removeListener("error", $), q.removeListener("readable", A)
            }

            function w() {
                O(), CX8("onend"), _(Error("Proxy connection ended before receiving CONNECT response"))
            }

            function $(H) {
                O(), CX8("onerror %o", H), _(H)
            }

            function j(H) {
                Y.push(H), z += H.length;
                let J = Buffer.concat(Y, z),
                    X = J.indexOf(`\r
\r
`);
                if (X === -1) {
                    CX8("have not received end of HTTP headers yet..."), A();
                    return
                }
                let M = J.slice(0, X).toString("ascii").split(`\r
`),
                    P = M.shift();
                if (!P) return q.destroy(), _(Error("No header received from proxy CONNECT response"));
                let W = P.split(" "),
                    D = +W[1],
                    Z = W.slice(2).join(" "),
                    G = {};
                for (let f of M) {
                    if (!f) continue;
                    let v = f.indexOf(":");
                    if (v === -1) return q.destroy(), _(Error(`Invalid header from proxy CONNECT response: "${f}"`));
                    let V = f.slice(0, v).toLowerCase(),
                        k = f.slice(v + 1).trimStart(),
                        N = G[V];
                    if (typeof N === "string") G[V] = [N, k];
                    else if (Array.isArray(N)) N.push(k);
                    else G[V] = k
                }
                CX8("got proxy server response: %o %o", P, G), O(), K({
                    connect: {
                        statusCode: D,
                        statusText: Z,
                        headers: G
                    },
                    buffered: J
                })
            }
            q.on("error", $), q.on("end", w), A()
        })
    }
    JG6.parseProxyResponse = Yr5
})
// @from(Ln 52705, Col 4)
dQ6 = p((qb) => {
    var Ar5 = qb && qb.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        Or5 = qb && qb.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        VU7 = qb && qb.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) Ar5(K, q, _)
            }
            return Or5(K, q), K
        },
        kU7 = qb && qb.__importDefault || function(q) {
            return q && q.__esModule ? q : {
                default: q
            }
        };
    Object.defineProperty(qb, "__esModule", {
        value: !0
    });
    qb.HttpsProxyAgent = void 0;
    var bX8 = VU7(d6("net")),
        GU7 = VU7(d6("tls")),
        wr5 = kU7(d6("assert")),
        $r5 = kU7($f6()),
        jr5 = nO1(),
        Hr5 = d6("url"),
        Jr5 = fU7(),
        QQ6 = (0, $r5.default)("https-proxy-agent"),
        vU7 = (q) => {
            if (q.servername === void 0 && q.host && !bX8.isIP(q.host)) return {
                ...q,
                servername: q.host
            };
            return q
        };
    class iO1 extends jr5.Agent {
        constructor(q, K) {
            super(K);
            this.options = {
                path: void 0
            }, this.proxy = typeof q === "string" ? new Hr5.URL(q) : q, this.proxyHeaders = K?.headers ?? {}, QQ6("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
            let _ = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
                z = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
            this.connectOpts = {
                ALPNProtocols: ["http/1.1"],
                ...K ? TU7(K, "headers") : null,
                host: _,
                port: z
            }
        }
        async connect(q, K) {
            let {
                proxy: _
            } = this;
            if (!K.host) throw TypeError('No "host" provided');
            let z;
            if (_.protocol === "https:") QQ6("Creating `tls.Socket`: %o", this.connectOpts), z = GU7.connect(vU7(this.connectOpts));
            else QQ6("Creating `net.Socket`: %o", this.connectOpts), z = bX8.connect(this.connectOpts);
            let Y = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
                    ...this.proxyHeaders
                },
                A = bX8.isIPv6(K.host) ? `[${K.host}]` : K.host,
                O = `CONNECT ${A}:${K.port} HTTP/1.1\r
`;
            if (_.username || _.password) {
                let J = `${decodeURIComponent(_.username)}:${decodeURIComponent(_.password)}`;
                Y["Proxy-Authorization"] = `Basic ${Buffer.from(J).toString("base64")}`
            }
            if (Y.Host = `${A}:${K.port}`, !Y["Proxy-Connection"]) Y["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
            for (let J of Object.keys(Y)) O += `${J}: ${Y[J]}\r
`;
            let w = (0, Jr5.parseProxyResponse)(z);
            z.write(`${O}\r
`);
            let {
                connect: $,
                buffered: j
            } = await w;
            if (q.emit("proxyConnect", $), this.emit("proxyConnect", $, q), $.statusCode === 200) {
                if (q.once("socket", Xr5), K.secureEndpoint) return QQ6("Upgrading socket connection to TLS"), GU7.connect({
                    ...TU7(vU7(K), "host", "path", "port"),
                    socket: z
                });
                return z
            }
            z.destroy();
            let H = new bX8.Socket({
                writable: !1
            });
            return H.readable = !0, q.once("socket", (J) => {
                QQ6("Replaying proxy buffer for failed request"), (0, wr5.default)(J.listenerCount("data") > 0), J.push(j), J.push(null)
            }), H
        }
    }
    iO1.protocols = ["http", "https"];
    qb.HttpsProxyAgent = iO1;

    function Xr5(q) {
        q.resume()
    }

    function TU7(q, ...K) {
        let _ = {},
            z;
        for (z in q)
            if (!K.includes(z)) _[z] = q[z];
        return _
    }
})
// @from(Ln 52836, Col 0)
function Mr5() {
    let q = process.env.CLAUDE_CODE_CERT_STORE;
    if (q) {
        let K = [];
        for (let _ of q.split(",")) {
            let z = _.trim().toLowerCase();
            if (z === "bundled" || z === "system") {
                if (!K.includes(z)) K.push(z)
            } else if (z) E(`CA certs: unrecognized CLAUDE_CODE_CERT_STORE source '${z}', ignoring`, {
                level: "warn"
            })
        }
        return K.length > 0 ? K : NU7
    }
    if (xD6("--use-system-ca") || xD6("--use-openssl-ca")) return ["system"];
    return NU7
}
// @from(Ln 52854, Col 0)
function EU7() {
    Im.cache?.clear?.(), E("Cleared CA certificates cache")
}
// @from(Ln 52857, Col 4)
NU7
// @from(Ln 52857, Col 9)
Im
// @from(Ln 52858, Col 4)
cQ6 = L(() => {
    U4();
    K8();
    Q8();
    Yq();
    NU7 = ["bundled", "system"];
    Im = P1(() => {
        let q = Mr5(),
            K = process.env.NODE_EXTRA_CA_CERTS,
            _ = q.includes("bundled"),
            z = q.includes("system");
        if (E(`CA certs: stores=${q.join(",")}, extraCertsPath=${K}`), typeof Bun > "u" && !K && !process.env.CLAUDE_CODE_CERT_STORE) return;
        let Y = d6("tls"),
            A = Y.getCACertificates;
        if (!_ && z && !A) {
            E("CA certs: stores=system but system CA API unavailable, deferring to runtime");
            return
        }
        let O = [];
        if (_) O.push(...Y.rootCertificates), E(`CA certs: Loaded ${Y.rootCertificates.length} bundled root certificates`);
        if (z) try {
            let w = A?.("system");
            if (w && w.length > 0) O.push(...w), E(`CA certs: Loaded ${w.length} system CA certificates`);
            else if (E(`CA certs: system store ${A?"returned empty":"unavailable"}`), !_) O.push(...Y.rootCertificates)
        } catch (w) {
            if (E(`CA certs: Failed to load system CA certificates: ${w}`, {
                    level: "error"
                }), !_) O.push(...Y.rootCertificates)
        }
        if (K) try {
            let w = V8().readFileSync(K, {
                encoding: "utf8"
            });
            O.push(w), E(`CA certs: Appended extra certificates from NODE_EXTRA_CA_CERTS (${K})`)
        } catch (w) {
            E(`CA certs: Failed to read NODE_EXTRA_CA_CERTS file (${K}): ${w}`, {
                level: "error"
            })
        }
        return O.length > 0 ? F4(O) : void 0
    })
})
// @from(Ln 52900, Col 4)
oj = p((F9O, yU7) => {
    yU7.exports = {
        kClose: Symbol("close"),
        kDestroy: Symbol("destroy"),
        kDispatch: Symbol("dispatch"),
        kUrl: Symbol("url"),
        kWriting: Symbol("writing"),
        kResuming: Symbol("resuming"),
        kQueue: Symbol("queue"),
        kConnect: Symbol("connect"),
        kConnecting: Symbol("connecting"),
        kKeepAliveDefaultTimeout: Symbol("default keep alive timeout"),
        kKeepAliveMaxTimeout: Symbol("max keep alive timeout"),
        kKeepAliveTimeoutThreshold: Symbol("keep alive timeout threshold"),
        kKeepAliveTimeoutValue: Symbol("keep alive timeout"),
        kKeepAlive: Symbol("keep alive"),
        kHeadersTimeout: Symbol("headers timeout"),
        kBodyTimeout: Symbol("body timeout"),
        kServerName: Symbol("server name"),
        kLocalAddress: Symbol("local address"),
        kHost: Symbol("host"),
        kNoRef: Symbol("no ref"),
        kBodyUsed: Symbol("used"),
        kBody: Symbol("abstracted request body"),
        kRunning: Symbol("running"),
        kBlocking: Symbol("blocking"),
        kPending: Symbol("pending"),
        kSize: Symbol("size"),
        kBusy: Symbol("busy"),
        kQueued: Symbol("queued"),
        kFree: Symbol("free"),
        kConnected: Symbol("connected"),
        kClosed: Symbol("closed"),
        kNeedDrain: Symbol("need drain"),
        kReset: Symbol("reset"),
        kDestroyed: Symbol.for("nodejs.stream.destroyed"),
        kResume: Symbol("resume"),
        kOnError: Symbol("on error"),
        kMaxHeadersSize: Symbol("max headers size"),
        kRunningIdx: Symbol("running index"),
        kPendingIdx: Symbol("pending index"),
        kError: Symbol("error"),
        kClients: Symbol("clients"),
        kClient: Symbol("client"),
        kParser: Symbol("parser"),
        kOnDestroyed: Symbol("destroy callbacks"),
        kPipelining: Symbol("pipelining"),
        kSocket: Symbol("socket"),
        kHostHeader: Symbol("host header"),
        kConnector: Symbol("connector"),
        kStrictContentLength: Symbol("strict content length"),
        kMaxRedirections: Symbol("maxRedirections"),
        kMaxRequests: Symbol("maxRequestsPerClient"),
        kProxy: Symbol("proxy agent options"),
        kCounter: Symbol("socket request counter"),
        kInterceptors: Symbol("dispatch interceptors"),
        kMaxResponseSize: Symbol("max response size"),
        kHTTP2Session: Symbol("http2Session"),
        kHTTP2SessionState: Symbol("http2Session state"),
        kRetryHandlerDefaultRetry: Symbol("retry agent default retry"),
        kConstruct: Symbol("constructable"),
        kListeners: Symbol("listeners"),
        kHTTPContext: Symbol("http context"),
        kMaxConcurrentStreams: Symbol("max concurrent streams"),
        kNoProxyAgent: Symbol("no proxy agent"),
        kHttpProxyAgent: Symbol("http proxy agent"),
        kHttpsProxyAgent: Symbol("https proxy agent")
    }
})