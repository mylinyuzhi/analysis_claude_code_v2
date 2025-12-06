
// @from(Start 8945819, End 8955648)
PIA = L(() => {
  Q2();
  oQ1();
  Zw();
  S22();
  LV();
  aAA();
  f22();
  X85 = j.record(j.coerce.string()), V85 = j.object({
    allow: j.array(tQ1).optional().describe("List of permission rules for allowed operations"),
    deny: j.array(tQ1).optional().describe("List of permission rules for denied operations"),
    ask: j.array(tQ1).optional().describe("List of permission rules that should always prompt for confirmation"),
    defaultMode: j.enum(kR).optional().describe("Default permission mode when Claude Code needs access"),
    disableBypassPermissionsMode: j.enum(["disable"]).optional().describe("Disable the ability to bypass permission prompts"),
    additionalDirectories: j.array(j.string()).optional().describe("Additional directories to include in the permission scope")
  }).passthrough(), F85 = j.object({
    type: j.literal("command").describe("Bash command hook type"),
    command: j.string().describe("Shell command to execute"),
    timeout: j.number().positive().optional().describe("Timeout in seconds for this specific command"),
    statusMessage: j.string().optional().describe("Custom status message to display in spinner while hook runs")
  }), K85 = j.object({
    type: j.literal("prompt").describe("LLM prompt hook type"),
    prompt: j.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
    timeout: j.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
    model: j.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses the default small fast model.'),
    statusMessage: j.string().optional().describe("Custom status message to display in spinner while hook runs")
  }), D85 = j.object({
    type: j.literal("agent").describe("Agentic verifier hook type"),
    prompt: j.string().transform((A) => (Q) => A).describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
    timeout: j.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
    model: j.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses Haiku.'),
    statusMessage: j.string().optional().describe("Custom status message to display in spinner while hook runs")
  }), H85 = j.discriminatedUnion("type", [F85, K85, D85]), C85 = j.object({
    matcher: j.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
    hooks: j.array(H85).describe("List of hooks to execute when the matcher matches")
  }), ULA = j.record(j.enum(zLA), j.array(C85)), E85 = j.object({
    source: eQ1.describe("Where to fetch the marketplace from"),
    installLocation: j.string().optional().describe("Local cache path where marketplace manifest is stored (auto-generated if not provided)")
  }), z85 = j.object({
    serverName: j.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
    serverCommand: j.array(j.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers")
  }).refine((A) => A.serverName !== void 0 && A.serverCommand === void 0 || A.serverName === void 0 && A.serverCommand !== void 0, {
    message: 'Entry must have either "serverName" or "serverCommand", but not both'
  }), U85 = j.object({
    serverName: j.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that is explicitly blocked"),
    serverCommand: j.array(j.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for blocked stdio servers")
  }).refine((A) => A.serverName !== void 0 && A.serverCommand === void 0 || A.serverName === void 0 && A.serverCommand !== void 0, {
    message: 'Entry must have either "serverName" or "serverCommand", but not both'
  }), sAA = j.object({
    $schema: j.literal(bh0).optional().describe("JSON Schema reference for Claude Code settings"),
    apiKeyHelper: j.string().optional().describe("Path to a script that outputs authentication values"),
    awsCredentialExport: j.string().optional().describe("Path to a script that exports AWS credentials"),
    awsAuthRefresh: j.string().optional().describe("Path to a script that refreshes AWS authentication"),
    cleanupPeriodDays: j.number().nonnegative().int().optional().describe("Number of days to retain chat transcripts (0 to disable cleanup)"),
    env: X85.optional().describe("Environment variables to set for Claude Code sessions"),
    includeCoAuthoredBy: j.boolean().optional().describe("Whether to include Claude's co-authored by attribution in commits and PRs (defaults to true)"),
    permissions: V85.optional().describe("Tool usage permissions configuration"),
    model: j.string().optional().describe("Override the default model used by Claude Code"),
    enableAllProjectMcpServers: j.boolean().optional().describe("Whether to automatically approve all MCP servers in the project"),
    enabledMcpjsonServers: j.array(j.string()).optional().describe("List of approved MCP servers from .mcp.json"),
    disabledMcpjsonServers: j.array(j.string()).optional().describe("List of rejected MCP servers from .mcp.json"),
    allowedMcpServers: j.array(z85).optional().describe("Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied."),
    deniedMcpServers: j.array(U85).optional().describe("Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied."),
    hooks: ULA.optional().describe("Custom commands to run before/after tool executions"),
    disableAllHooks: j.boolean().optional().describe("Disable all hooks and statusLine execution"),
    allowManagedHooksOnly: j.boolean().optional().describe("When true (and set in managed settings), only hooks from managed settings run. User, project, and local hooks are ignored."),
    statusLine: j.object({
      type: j.literal("command"),
      command: j.string(),
      padding: j.number().optional()
    }).optional().describe("Custom status line display configuration"),
    enabledPlugins: j.record(j.union([j.array(j.string()), j.boolean(), j.undefined()])).optional().describe('Enabled plugins using plugin-id@marketplace-id format. Example: { "formatter@anthropic-tools": true }. Also supports extended format with version constraints.'),
    extraKnownMarketplaces: j.record(j.string(), E85).optional().describe("Additional marketplaces to make available for this repository. Typically used in repository .claude/settings.json to ensure team members have required plugin sources."),
    skippedMarketplaces: j.array(j.string()).optional().describe("List of marketplace names the user has chosen not to install when prompted"),
    skippedPlugins: j.array(j.string()).optional().describe("List of plugin IDs (plugin@marketplace format) the user has chosen not to install when prompted"),
    strictKnownMarketplaces: j.array(eQ1).optional().describe("Enterprise strict list of allowed marketplace sources. When set in managed settings, ONLY these exact sources can be added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
    forceLoginMethod: j.enum(["claudeai", "console"]).optional().describe('Force a specific login method: "claudeai" for Claude Pro/Max, "console" for Console billing'),
    forceLoginOrgUUID: j.string().optional().describe("Organization UUID to use for OAuth login"),
    otelHeadersHelper: j.string().optional().describe("Path to a script that outputs OpenTelemetry headers"),
    outputStyle: j.string().optional().describe("Controls the output style for assistant responses"),
    skipWebFetchPreflight: j.boolean().optional().describe("Skip the WebFetch blocklist check for enterprise environments with restrictive security policies"),
    sandbox: b22.optional(),
    spinnerTipsEnabled: j.boolean().optional().describe("Whether to show tips in the spinner"),
    alwaysThinkingEnabled: j.boolean().optional().describe("Whether extended thinking is always enabled (default: false)"),
    agent: j.string().optional().describe("Name of an agent (built-in or custom) to use for the main thread. Applies the agent's system prompt, tool restrictions, and model."),
    companyAnnouncements: j.array(j.string()).optional().describe("Company announcements to display at startup (one will be randomly selected if multiple are provided)"),
    pluginConfigs: j.record(j.string(), j.object({
      mcpServers: j.record(j.string(), j.record(j.string(), j.union([j.string(), j.number(), j.boolean(), j.array(j.string())]))).optional().describe("User configuration values for MCP servers keyed by server name")
    })).optional().describe("Per-plugin configuration including MCP server user configs, keyed by plugin ID (plugin@marketplace format)"),
    remote: j.object({
      defaultEnvironmentId: j.string().optional().describe("Default environment ID to use for remote sessions")
    }).optional().describe("Remote session configuration")
  }).passthrough()
})
// @from(Start 8955651, End 8955920)
function xe1(A, Q) {
  let G = A.slice(0, 2).map((Y) => {
      let J = Y.reason || Y.error || "unknown error";
      return Q ? `${Y.name} (${J})` : Y.name
    }).join(Q ? "; " : ", "),
    Z = A.length - 2,
    I = Z > 0 ? ` and ${Z} more` : "";
  return `${G}${I}`
}
// @from(Start 8955922, End 8956203)
function qLA(A) {
  switch (A.source) {
    case "github":
      return A.repo;
    case "url":
      return A.url;
    case "git":
      return A.url;
    case "directory":
      return A.path;
    case "file":
      return A.path;
    default:
      return "Unknown source"
  }
}
// @from(Start 8956205, End 8956248)
function jIA(A, Q) {
  return `${A}@${Q}`
}
// @from(Start 8956249, End 8956731)
async function NLA(A) {
  let Q = [],
    B = [];
  for (let [G, Z] of Object.entries(A)) {
    let I = null;
    try {
      I = await _D(G)
    } catch (Y) {
      let J = Y instanceof Error ? Y.message : String(Y);
      B.push({
        name: G,
        error: J
      }), AA(Y instanceof Error ? Y : Error(`Failed to load marketplace ${G}: ${Y}`))
    }
    Q.push({
      name: G,
      config: Z,
      data: I
    })
  }
  return {
    marketplaces: Q,
    failures: B
  }
}
// @from(Start 8956733, End 8957100)
function BB1(A, Q) {
  if (A.length === 0) return null;
  if (Q > 0) return {
    type: "warning",
    message: A.length === 1 ? `Warning: Failed to load marketplace '${A[0].name}': ${A[0].error}` : `Warning: Failed to load ${A.length} marketplaces: ${$85(A)}`
  };
  return {
    type: "error",
    message: `Failed to load all marketplaces. Errors: ${w85(A)}`
  }
}
// @from(Start 8957102, End 8957162)
function $85(A) {
  return A.map((Q) => Q.name).join(", ")
}
// @from(Start 8957164, End 8957241)
function w85(A) {
  return A.map((Q) => `${Q.name}: ${Q.error}`).join("; ")
}
// @from(Start 8957243, End 8957376)
function LLA() {
  let A = OB("policySettings");
  if (!A?.strictKnownMarketplaces) return null;
  return A.strictKnownMarketplaces
}
// @from(Start 8957378, End 8957971)
function q85(A, Q) {
  if (A.source !== Q.source) return !1;
  switch (A.source) {
    case "url":
      return A.url === Q.url;
    case "github":
      return A.repo === Q.repo && (A.ref || void 0) === (Q.ref || void 0) && (A.path || void 0) === (Q.path || void 0);
    case "git":
      return A.url === Q.url && (A.ref || void 0) === (Q.ref || void 0) && (A.path || void 0) === (Q.path || void 0);
    case "npm":
      return A.package === Q.package;
    case "file":
      return A.path === Q.path;
    case "directory":
      return A.path === Q.path;
    default:
      return !1
  }
}
// @from(Start 8957973, End 8958072)
function GB1(A) {
  let Q = LLA();
  if (Q === null) return !0;
  return Q.some((B) => q85(A, B))
}
// @from(Start 8958074, End 8958490)
function MLA(A) {
  switch (A.source) {
    case "github":
      return `github:${A.repo}${A.ref?`@${A.ref}`:""}`;
    case "url":
      return A.url;
    case "git":
      return `git:${A.url}${A.ref?`@${A.ref}`:""}`;
    case "npm":
      return `npm:${A.package}`;
    case "file":
      return `file:${A.path}`;
    case "directory":
      return `dir:${A.path}`;
    default:
      return "unknown source"
  }
}
// @from(Start 8958495, End 8958536)
OLA = L(() => {
  oH();
  g1();
  MB()
})
// @from(Start 8958595, End 8958669)
function u22() {
  return RE(MQ(), "plugins", "known_marketplaces.json")
}
// @from(Start 8958671, End 8958734)
function m22() {
  return RE(MQ(), "plugins", "marketplaces")
}
// @from(Start 8958736, End 8958776)
function d22() {
  _D.cache?.clear?.()
}
// @from(Start 8958777, End 8959454)
async function pZ() {
  let A = RA(),
    Q = u22();
  if (!A.existsSync(Q)) return {};
  try {
    let B = A.readFileSync(Q, {
        encoding: "utf-8"
      }),
      G = JSON.parse(B),
      Z = ye1.safeParse(G);
    if (!Z.success) {
      let I = `Marketplace configuration file is corrupted: ${Z.error.errors.map((Y)=>`${Y.path.join(".")}: ${Y.message}`).join(", ")}`;
      throw g(I, {
        level: "error"
      }), new mz(I, Q, G)
    }
    return Z.data
  } catch (B) {
    if (B instanceof mz) throw B;
    let G = `Failed to load marketplace configuration: ${B instanceof Error?B.message:String(B)}`;
    throw g(G, {
      level: "error"
    }), Error(G)
  }
}
// @from(Start 8959455, End 8959762)
async function TLA(A) {
  let Q = ye1.safeParse(A),
    B = u22();
  if (!Q.success) throw new mz(`Invalid marketplace config: ${Q.error.message}`, B, A);
  let G = RA(),
    Z = RE(B, "..");
  G.mkdirSync(Z), G.writeFileSync(B, JSON.stringify(Q.data, null, 2), {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Start 8959763, End 8960285)
async function N85(A, Q) {
  if (Q) {
    let G = await A3("git", ["fetch", "origin", Q], {
      cwd: A,
      timeout: 30000
    });
    if (G.code !== 0) return G;
    let Z = await A3("git", ["checkout", Q], {
      cwd: A,
      timeout: 30000
    });
    if (Z.code !== 0) return Z;
    let I = await A3("git", ["pull", "origin", "HEAD"], {
      cwd: A,
      timeout: 30000
    });
    return g22(I)
  }
  let B = await A3("git", ["pull", "origin", "HEAD"], {
    cwd: A,
    timeout: 30000
  });
  return g22(B)
}
// @from(Start 8960287, End 8960888)
function g22(A) {
  if (A.code !== 0 && A.stderr) {
    if (A.stderr.includes("Permission denied (publickey)") || A.stderr.includes("Could not read from remote repository")) return {
      ...A,
      stderr: `SSH authentication failed while updating marketplace. Please ensure your SSH keys are configured.

Original error: ${A.stderr}`
    };
    if (A.stderr.includes("timed out") || A.stderr.includes("Could not resolve host")) return {
      ...A,
      stderr: `Network error while updating marketplace. Please check your internet connection.

Original error: ${A.stderr}`
    }
  }
  return A
}
// @from(Start 8960889, End 8961256)
async function L85() {
  try {
    let A = await QQ("ssh", ["-T", "-o", "BatchMode=yes", "-o", "ConnectTimeout=2", "-o", "StrictHostKeyChecking=accept-new", "git@github.com"], {
      timeout: 3000
    });
    return A.code === 1 && (A.stderr?.includes("successfully authenticated") || A.stdout?.includes("successfully authenticated"))
  } catch {
    return !1
  }
}
// @from(Start 8961257, End 8962445)
async function M85(A, Q, B) {
  let G = ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new", "clone", "--depth", "1"];
  if (B) G.push("--branch", B);
  G.push(A, Q);
  let Z = await QQ("git", G, {
    timeout: 30000
  });
  if (Z.code !== 0 && Z.stderr) {
    if (Z.stderr.includes("Permission denied (publickey)") || Z.stderr.includes("Could not read from remote repository")) return {
      ...Z,
      stderr: `SSH authentication failed. Please ensure your SSH keys are configured for GitHub, or use an HTTPS URL instead.

Original error: ${Z.stderr}`
    };
    if (Z.stderr.includes("Authentication failed") || Z.stderr.includes("could not read Username")) return {
      ...Z,
      stderr: `HTTPS authentication failed. You may need to configure credentials, or use an SSH URL for GitHub repositories.

Original error: ${Z.stderr}`
    };
    if (Z.stderr.includes("timed out") || Z.stderr.includes("timeout") || Z.stderr.includes("Could not resolve host")) return {
      ...Z,
      stderr: `Network error or timeout while cloning repository. Please check your internet connection and try again.

Original error: ${Z.stderr}`
    }
  }
  return Z
}
// @from(Start 8962447, End 8962628)
function tT(A, Q) {
  if (!A) return;
  try {
    A(Q)
  } catch (B) {
    g(`Progress callback error: ${B instanceof Error?B.message:String(B)}`, {
      level: "warn"
    })
  }
}
// @from(Start 8962629, End 8963714)
async function RLA(A, Q, B, G) {
  let Z = RA();
  if (Z.existsSync(Q)) {
    if (!Z.existsSync(RE(Q, ".git"))) throw Error(`Cache directory exists at ${Q} but is not a git repository. Please remove it manually and try again.`);
    tT(G, "Updating existing marketplace cache…");
    let J = await N85(Q, B);
    if (J.code !== 0) {
      g(`Failed to update marketplace cache: ${J.stderr}`, {
        level: "error"
      }), tT(G, "Update failed, cleaning up and re-cloning…");
      try {
        Z.rmSync(Q, {
          recursive: !0,
          force: !0
        })
      } catch (W) {
        let X = W instanceof Error ? W.message : String(W);
        throw Error(`Failed to clean up existing marketplace directory. Please manually delete the directory at ${Q} and try again.

Technical details: ${X}`)
      }
    } else return
  }
  let I = B ? ` (ref: ${B})` : "";
  tT(G, `Cloning repository: ${A}${I}`);
  let Y = await M85(A, Q, B);
  if (Y.code !== 0) throw Error(`Failed to clone marketplace repository: ${Y.stderr}`);
  tT(G, "Clone complete, validating marketplace…")
}
// @from(Start 8963716, End 8963818)
function O85(A) {
  return Object.fromEntries(Object.entries(A).map(([Q]) => [Q, "***REDACTED***"]))
}
// @from(Start 8963819, End 8965362)
async function c22(A, Q, B, G) {
  let Z = RA();
  if (tT(G, `Downloading marketplace from ${A}`), g(`Downloading marketplace from URL: ${A}`), B && Object.keys(B).length > 0) g(`Using custom headers: ${JSON.stringify(O85(B))}`);
  let I = {
      ...B,
      "User-Agent": "Claude-Code-Plugin-Manager"
    },
    Y;
  try {
    Y = await YQ.get(A, {
      timeout: 1e4,
      headers: I
    })
  } catch (X) {
    if (YQ.isAxiosError(X)) {
      if (X.code === "ECONNREFUSED" || X.code === "ENOTFOUND") throw Error(`Could not connect to ${A}. Please check your internet connection and verify the URL is correct.

Technical details: ${X.message}`);
      if (X.code === "ETIMEDOUT") throw Error(`Request timed out while downloading marketplace from ${A}. The server may be slow or unreachable.

Technical details: ${X.message}`);
      if (X.response) throw Error(`HTTP ${X.response.status} error while downloading marketplace from ${A}. The marketplace file may not exist at this URL.

Technical details: ${X.message}`)
    }
    throw Error(`Failed to download marketplace from ${A}: ${X instanceof Error?X.message:String(X)}`)
  }
  tT(G, "Validating marketplace data");
  let J = TIA.safeParse(Y.data);
  if (!J.success) throw new mz(`Invalid marketplace schema from URL: ${J.error.errors.map((X)=>`${X.path.join(".")}: ${X.message}`).join(", ")}`, A, Y.data);
  tT(G, "Saving marketplace to cache");
  let W = RE(Q, "..");
  Z.mkdirSync(W), Z.writeFileSync(Q, JSON.stringify(J.data, null, 2), {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Start 8965364, End 8965630)
function R85(A) {
  return A.source === "github" ? A.repo.replace("/", "-") : A.source === "npm" ? A.package.replace("@", "").replace("/", "-") : A.source === "file" ? h22(A.path).replace(".json", "") : A.source === "directory" ? h22(A.path) : "temp_" + Date.now()
}
// @from(Start 8965632, End 8965915)
function p22(A, Q) {
  let G = RA().readFileSync(A, {
      encoding: "utf-8"
    }),
    Z = JSON.parse(G),
    I = Q.safeParse(Z);
  if (!I.success) throw new mz(`Invalid schema: ${I.error?.errors.map((Y)=>`${Y.path.join(".")}: ${Y.message}`).join(", ")}`, A, Z);
  return I.data
}
// @from(Start 8965916, End 8969299)
async function ve1(A, Q) {
  let B = RA(),
    G = m22();
  B.mkdirSync(G);
  let Z, I, Y = !1,
    J = R85(A);
  try {
    switch (A.source) {
      case "url": {
        Z = RE(G, `${J}.json`), Y = !0, await c22(A.url, Z, A.headers, Q), I = Z;
        break
      }
      case "github": {
        let F = `git@github.com:${A.repo}.git`,
          K = `https://github.com/${A.repo}.git`;
        Z = RE(G, J), Y = !0;
        let D = null;
        if (await L85()) {
          tT(Q, `Cloning via SSH: ${F}`);
          try {
            await RLA(F, Z, A.ref, Q)
          } catch (C) {
            if (D = C instanceof Error ? C : Error(String(C)), AA(D), tT(Q, `SSH clone failed, retrying with HTTPS: ${K}`), g(`SSH clone failed for ${A.repo} despite SSH being configured, falling back to HTTPS`, {
                level: "info"
              }), B.existsSync(Z)) B.rmSync(Z, {
              recursive: !0,
              force: !0
            });
            try {
              await RLA(K, Z, A.ref, Q), D = null
            } catch (E) {
              D = E instanceof Error ? E : Error(String(E))
            }
          }
        } else {
          tT(Q, `SSH not configured, cloning via HTTPS: ${K}`), g(`SSH not configured for GitHub, using HTTPS for ${A.repo}`, {
            level: "info"
          });
          try {
            await RLA(K, Z, A.ref, Q)
          } catch (C) {
            D = C instanceof Error ? C : Error(String(C))
          }
        }
        if (D) throw D;
        I = RE(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "git": {
        Z = RE(G, J), Y = !0, await RLA(A.url, Z, A.ref, Q), I = RE(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "npm":
        throw Error("NPM marketplace sources not yet implemented");
      case "file": {
        I = A.path, Z = A.path, Y = !1;
        break
      }
      case "directory": {
        I = RE(A.path, ".claude-plugin", "marketplace.json"), Z = A.path, Y = !1;
        break
      }
      default:
        throw Error("Unsupported marketplace source type")
    }
    if (!B.existsSync(I)) throw Error(`Marketplace file not found at ${I}`);
    let W = p22(I, TIA),
      X = RE(G, W.name),
      V = A.source === "file" || A.source === "directory";
    if (Z !== X && !V) try {
      if (B.existsSync(X)) {
        try {
          Q?.("Cleaning up old marketplace cache…")
        } catch (F) {
          g(`Progress callback error: ${F instanceof Error?F.message:String(F)}`, {
            level: "warn"
          })
        }
        B.rmSync(X, {
          recursive: !0,
          force: !0
        })
      }
      B.renameSync(Z, X), Z = X, Y = !1
    } catch (F) {
      let K = F instanceof Error ? F.message : String(F);
      throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${X} if it exists and try again.

Technical details: ${K}`)
    }
    return {
      marketplace: W,
      cachePath: Z
    }
  } catch (W) {
    if (Y && Z && A.source !== "file" && A.source !== "directory") try {
      if (B.existsSync(Z)) B.rmSync(Z, {
        recursive: !0,
        force: !0
      })
    } catch (X) {
      g(`Warning: Failed to clean up temporary marketplace cache at ${Z}: ${X instanceof Error?X.message:String(X)}`, {
        level: "warn"
      })
    }
    throw W
  }
}
// @from(Start 8969300, End 8970020)
async function rAA(A, Q) {
  if (!GB1(A)) {
    let I = LLA() || [];
    throw Error(`Marketplace source '${MLA(A)}' is blocked by enterprise policy. ` + (I.length > 0 ? `Allowed sources: ${I.map((Y)=>MLA(Y)).join(", ")}` : "No external marketplaces are allowed."))
  }
  let {
    marketplace: B,
    cachePath: G
  } = await ve1(A, Q), Z = await pZ();
  if (Z[B.name]) throw Error(`Marketplace '${B.name}' is already installed. Please remove it first using '/plugin marketplace remove ${B.name}' if you want to re-install it.`);
  return Z[B.name] = {
    source: A,
    installLocation: G,
    lastUpdated: new Date().toISOString()
  }, await TLA(Z), g(`Added marketplace source: ${B.name}`), {
    name: B.name
  }
}
// @from(Start 8970021, End 8971195)
async function ZB1(A) {
  let Q = await pZ();
  if (!Q[A]) throw Error(`Marketplace '${A}' not found`);
  delete Q[A], await TLA(Q);
  let B = RA(),
    G = m22(),
    Z = RE(G, A);
  if (B.existsSync(Z)) B.rmSync(Z, {
    recursive: !0,
    force: !0
  });
  let I = RE(G, `${A}.json`);
  if (B.existsSync(I)) B.rmSync(I, {
    force: !0
  });
  let Y = ["userSettings", "projectSettings", "localSettings"];
  for (let J of Y) {
    let W = OB(J);
    if (!W) continue;
    let X = !1,
      V = {};
    if (W.extraKnownMarketplaces?.[A]) {
      let F = {
        ...W.extraKnownMarketplaces
      };
      delete F[A], V.extraKnownMarketplaces = F, X = !0
    }
    if (W.enabledPlugins) {
      let F = `@${A}`,
        K = {
          ...W.enabledPlugins
        },
        D = !1;
      for (let H in K)
        if (H.endsWith(F)) delete K[H], D = !0;
      if (D) V.enabledPlugins = K, X = !0
    }
    if (X) {
      let F = cB(J, V);
      if (F.error) AA(F.error), g(`Failed to clean up marketplace '${A}' from ${J} settings: ${F.error.message}`);
      else g(`Cleaned up marketplace '${A}' from ${J} settings`)
    }
  }
  g(`Removed marketplace source: ${A}`)
}
// @from(Start 8971197, End 8971678)
function l22(A) {
  let Q = RA();
  try {
    let B = A;
    if (Q.existsSync(A) && Q.statSync(A).isDirectory()) {
      let G = RE(A, ".claude-plugin", "marketplace.json");
      if (Q.existsSync(G)) B = G;
      else throw Error(`Invalid cached directory at ${A}: missing .claude-plugin/marketplace.json`)
    }
    if (!Q.existsSync(B)) throw Error(`Marketplace file not found at ${B}`);
    return p22(B, TIA)
  } catch (B) {
    if (B instanceof mz) throw B;
    throw B
  }
}
// @from(Start 8971679, End 8972253)
async function nl(A) {
  let Q = A.split("@");
  if (Q.length !== 2) throw Error(`Invalid plugin ID format '${A}'. Expected format: 'plugin-name@marketplace-name'`);
  let B = Q[0],
    G = Q[1];
  try {
    let I = (await pZ())[G];
    if (!I) return null;
    let J = (await _D(G)).plugins.find((W) => W.name === B);
    if (!J) return null;
    return {
      entry: J,
      marketplaceInstallLocation: I.installLocation
    }
  } catch (Z) {
    return g(`Could not find plugin ${A}: ${Z instanceof Error?Z.message:String(Z)}`, {
      level: "debug"
    }), null
  }
}
// @from(Start 8972254, End 8972567)
async function i22() {
  let A = await pZ();
  for (let [Q, B] of Object.entries(A)) try {
    await ve1(B.source), A[Q].lastUpdated = new Date().toISOString()
  } catch (G) {
    g(`Failed to refresh marketplace ${Q}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    })
  }
  await TLA(A)
}
// @from(Start 8972568, End 8973552)
async function IB1(A, Q) {
  let B = await pZ(),
    G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(B).join(", ")}`);
  _D.cache?.delete?.(A);
  try {
    let {
      installLocation: Z,
      source: I
    } = G;
    if (I.source === "github" || I.source === "git") await RLA(I.source === "github" ? `git@github.com:${I.repo}.git` : I.url, Z, I.ref, Q);
    else if (I.source === "url") await c22(I.url, Z, I.headers, Q);
    else if (I.source === "file" || I.source === "directory") tT(Q, "Validating local marketplace"), l22(Z);
    else throw Error("Unsupported marketplace source type for refresh");
    B[A].lastUpdated = new Date().toISOString(), await TLA(B), g(`Successfully refreshed marketplace: ${A}`)
  } catch (Z) {
    let I = Z instanceof Error ? Z.message : String(Z);
    throw g(`Failed to refresh marketplace ${A}: ${I}`, {
      level: "error"
    }), Error(`Failed to refresh marketplace '${A}': ${I}`)
  }
}
// @from(Start 8973557, End 8973559)
_D
// @from(Start 8973565, End 8974232)
oH = L(() => {
  O3();
  l2();
  hQ();
  AQ();
  V0();
  g1();
  _8();
  RZ();
  MB();
  aAA();
  OLA();
  _D = s1(async (A) => {
    let Q = await pZ(),
      B = Q[A];
    if (!B) throw Error(`Marketplace '${A}' not found in configuration. Available marketplaces: ${Object.keys(Q).join(", ")}`);
    try {
      return l22(B.installLocation)
    } catch (Z) {
      g(`Cache corrupted or missing for marketplace ${A}, re-fetching from source: ${Z instanceof Error?Z.message:String(Z)}`, {
        level: "warn"
      })
    }
    let {
      marketplace: G
    } = await ve1(B.source);
    return Q[A].lastUpdated = new Date().toISOString(), await TLA(Q), G
  })
})
// @from(Start 8974234, End 8974868)
async function YB1(A, Q, B, G) {
  if (B?.version) return g(`Using manifest version for ${A}: ${B.version}`), B.version;
  if (G) {
    let Z = await T85(G);
    if (Z) {
      let I = Z.substring(0, 12);
      return g(`Using git SHA for ${A}: ${I}`), I
    }
  }
  if (typeof Q === "string") {
    let Z = `local-${Date.now()}`;
    return g(`Using local fallback version for ${A}: ${Z}`), Z
  }
  if (Q.source === "github" || Q.source === "url") return "pending";
  if (Q.source === "npm") {
    let Z = await P85(Q.package);
    if (Z) return g(`Using npm version for ${A}: ${Z}`), Z;
    return "unknown"
  }
  return "unknown"
}
// @from(Start 8974869, End 8975082)
async function T85(A) {
  try {
    let Q = await A3("git", ["rev-parse", "HEAD"], {
      cwd: A
    });
    if (Q.code === 0 && Q.stdout) return Q.stdout.trim();
    return null
  } catch {
    return null
  }
}
// @from(Start 8975083, End 8975275)
async function P85(A) {
  try {
    let Q = await A3("npm", ["view", A, "version"]);
    if (Q.code === 0 && Q.stdout) return Q.stdout.trim();
    return null
  } catch {
    return null
  }
}
// @from(Start 8975280, End 8975313)
n22 = L(() => {
  _8();
  V0()
})
// @from(Start 8975431, End 8975486)
function al() {
  return A8(MQ(), "plugins", "cache")
}
// @from(Start 8975488, End 8975687)
function JB1(A, Q) {
  let B = al(),
    [G, Z] = A.split("@"),
    I = (Z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
    Y = (G || A).replace(/[^a-zA-Z0-9\-_]/g, "-");
  return A8(B, I, Y, Q)
}
// @from(Start 8975689, End 8976055)
function oAA(A, Q) {
  let B = RA();
  if (!B.existsSync(Q)) B.mkdirSync(Q);
  let G = B.readdirSync(A);
  for (let Z of G) {
    let I = A8(A, Z.name),
      Y = A8(Q, Z.name);
    if (Z.isDirectory()) oAA(I, Y);
    else if (Z.isFile()) B.copyFileSync(I, Y);
    else if (Z.isSymbolicLink()) {
      let J = B.readlinkSync(I);
      B.symlinkSync(J, Y)
    }
  }
}
// @from(Start 8976056, End 8977975)
async function s22(A, Q, B, G) {
  let Z = RA(),
    I = JB1(Q, B);
  if (Z.existsSync(I)) return g(`Plugin ${Q} version ${B} already cached at ${I}`), I;
  Z.mkdirSync(a22(I));
  let Y = A8(A, "plugin.json"),
    J = A8(A, ".claude-plugin", "plugin.json");
  if (Z.existsSync(Y) || Z.existsSync(J)) g(`Copying self-contained plugin ${Q} to versioned cache`), oAA(A, I);
  else if (G) {
    g(`Copying non-self-contained plugin ${Q} to versioned cache`), Z.mkdirSync(I);
    let V = (K) => {
      let D = A8(A, K),
        H = A8(I, K);
      if (!Z.existsSync(D)) {
        g(`Component path ${K} not found at ${D}`, {
          level: "warn"
        });
        return
      }
      if (Z.statSync(D).isDirectory()) oAA(D, H);
      else Z.mkdirSync(a22(H)), Z.copyFileSync(D, H)
    };
    if (G.commands)
      if (typeof G.commands === "object" && !Array.isArray(G.commands)) {
        for (let K of Object.values(G.commands))
          if (K?.source) V(K.source)
      } else {
        let K = Array.isArray(G.commands) ? G.commands : [G.commands];
        for (let D of K)
          if (typeof D === "string") V(D)
      } if (G.agents) {
      let K = Array.isArray(G.agents) ? G.agents : [G.agents];
      for (let D of K) V(D)
    }
    if (G.skills) {
      let K = Array.isArray(G.skills) ? G.skills : [G.skills];
      for (let D of K) V(D)
    }
    if (G.outputStyles) {
      let K = Array.isArray(G.outputStyles) ? G.outputStyles : [G.outputStyles];
      for (let D of K) V(D)
    }
    let F = ["commands", "agents", "skills", "hooks", "output-styles"];
    for (let K of F) {
      let D = A8(A, K);
      if (Z.existsSync(D)) oAA(D, A8(I, K))
    }
  } else g(`Copying plugin ${Q} to versioned cache (fallback to full copy)`), oAA(A, I);
  let X = A8(I, ".git");
  if (Z.existsSync(X)) Z.rmSync(X, {
    recursive: !0,
    force: !0
  });
  return g(`Successfully cached plugin ${Q} at ${I}`), I
}
// @from(Start 8977977, End 8978376)
function _85(A) {
  try {
    let Q = new URL(A);
    if (!["https:", "http:", "file:"].includes(Q.protocol)) {
      if (!/^git@[a-zA-Z0-9.-]+:/.test(A)) throw Error(`Invalid git URL protocol: ${Q.protocol}. Only HTTPS, HTTP, file:// and SSH (git@) URLs are supported.`)
    }
    return A
  } catch {
    if (/^git@[a-zA-Z0-9.-]+:/.test(A)) return A;
    throw Error(`Invalid git URL: ${A}`)
  }
}
// @from(Start 8978377, End 8978821)
async function k85(A, Q) {
  let B = RA(),
    G = A8(MQ(), "plugins", "npm-cache");
  B.mkdirSync(G);
  let Z = A8(G, "node_modules", A);
  if (!B.existsSync(Z)) {
    g(`Installing npm package ${A} to cache`);
    let Y = await QQ("npm", ["install", A, "--prefix", G], {
      useCwd: !1
    });
    if (Y.code !== 0) throw Error(`Failed to install npm package: ${Y.stderr}`)
  }
  oAA(Z, Q), g(`Copied npm package ${A} from cache to ${Q}`)
}
// @from(Start 8978822, End 8979043)
async function y85(A, Q, B) {
  let G = ["clone", "--depth", "1"];
  if (B) G.push("--branch", B);
  G.push(A, Q);
  let Z = await QQ("git", G);
  if (Z.code !== 0) throw Error(`Failed to clone repository: ${Z.stderr}`)
}
// @from(Start 8979044, End 8979197)
async function t22(A, Q, B) {
  let G = _85(A);
  await y85(G, Q, B);
  let Z = B ? ` (ref: ${B})` : "";
  g(`Cloned repository from ${G}${Z} to ${Q}`)
}
// @from(Start 8979198, End 8979425)
async function x85(A, Q, B) {
  if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A)) throw Error(`Invalid GitHub repository format: ${A}. Expected format: owner/repo`);
  let G = `git@github.com:${A}.git`;
  return t22(G, Q, B)
}
// @from(Start 8979426, End 8979656)
async function v85(A, Q) {
  let B = RA();
  if (!B.existsSync(A)) throw Error(`Source path does not exist: ${A}`);
  oAA(A, Q);
  let G = A8(Q, ".git");
  if (B.existsSync(G)) B.rmSync(G, {
    recursive: !0,
    force: !0
  })
}
// @from(Start 8979658, End 8980085)
function b85(A) {
  let Q = Date.now(),
    B = Math.random().toString(36).substring(2, 8),
    G;
  if (typeof A === "string") G = "local";
  else switch (A.source) {
    case "npm":
      G = "npm";
      break;
    case "pip":
      G = "pip";
      break;
    case "github":
      G = "github";
      break;
    case "url":
      G = "git";
      break;
    default:
      G = "unknown"
  }
  return `temp_${G}_${Q}_${B}`
}
// @from(Start 8980086, End 8983139)
async function SIA(A, Q) {
  let B = RA(),
    G = al();
  B.mkdirSync(G);
  let Z = b85(A),
    I = A8(G, Z),
    Y = !1;
  try {
    if (g(`Caching plugin from source: ${JSON.stringify(A)} to temporary path ${I}`), Y = !0, typeof A === "string") await v85(A, I);
    else switch (A.source) {
      case "npm":
        await k85(A.package, I);
        break;
      case "github":
        await x85(A.repo, I, A.ref);
        break;
      case "url":
        await t22(A.url, I, A.ref);
        break;
      case "pip":
        throw Error("Python package plugins are not yet supported");
      default:
        throw Error("Unsupported plugin source type")
    }
  } catch (K) {
    if (Y && B.existsSync(I)) {
      g(`Cleaning up failed installation at ${I}`);
      try {
        B.rmSync(I, {
          recursive: !0,
          force: !0
        })
      } catch (D) {
        g(`Failed to clean up installation: ${D}`, {
          level: "error"
        })
      }
    }
    throw K
  }
  let J = A8(I, ".claude-plugin", "plugin.json"),
    W = A8(I, "plugin.json"),
    X;
  if (B.existsSync(J)) try {
    let K = B.readFileSync(J, {
        encoding: "utf-8"
      }),
      D = JSON.parse(K),
      H = nAA.safeParse(D);
    if (H.success) X = H.data;
    else {
      let C = H.error.errors.map((E) => `${E.path.join(".")}: ${E.message}`).join(", ");
      throw g(`Invalid manifest at ${J}: ${C}`, {
        level: "error"
      }), Error(`Plugin has an invalid manifest file at ${J}. Validation errors: ${C}`)
    }
  } catch (K) {
    if (K instanceof Error && K.message.includes("invalid manifest file")) throw K;
    let D = K instanceof Error ? K.message : String(K);
    throw g(`Failed to parse manifest at ${J}: ${D}`, {
      level: "error"
    }), Error(`Plugin has a corrupt manifest file at ${J}. JSON parse error: ${D}`)
  } else if (B.existsSync(W)) try {
    let K = B.readFileSync(W, {
        encoding: "utf-8"
      }),
      D = JSON.parse(K),
      H = nAA.safeParse(D);
    if (H.success) X = H.data;
    else {
      let C = H.error.errors.map((E) => `${E.path.join(".")}: ${E.message}`).join(", ");
      throw g(`Invalid legacy manifest at ${W}: ${C}`, {
        level: "error"
      }), Error(`Plugin has an invalid manifest file at ${W}. Validation errors: ${C}`)
    }
  } catch (K) {
    if (K instanceof Error && K.message.includes("invalid manifest file")) throw K;
    let D = K instanceof Error ? K.message : String(K);
    throw g(`Failed to parse legacy manifest at ${W}: ${D}`, {
      level: "error"
    }), Error(`Plugin has a corrupt manifest file at ${W}. JSON parse error: ${D}`)
  } else X = Q?.manifest || {
    name: Z,
    description: `Plugin cached from ${typeof A==="string"?A:A.source}`
  };
  let V = X.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
    F = A8(G, V);
  if (B.existsSync(F)) g(`Removing old cached version at ${F}`), B.rmSync(F, {
    recursive: !0,
    force: !0
  });
  return B.renameSync(I, F), g(`Successfully cached plugin ${X.name} to ${F}`), {
    path: F,
    manifest: X
  }
}
// @from(Start 8983141, End 8984208)
function e22(A, Q, B) {
  let G = RA();
  if (!G.existsSync(A)) return {
    name: Q,
    description: `Plugin from ${B}`
  };
  try {
    let Z = G.readFileSync(A, {
        encoding: "utf-8"
      }),
      I = JSON.parse(Z),
      Y = nAA.safeParse(I);
    if (Y.success) return Y.data;
    let J = Y.error.errors.map((W) => `${W.path.join(".")}: ${W.message}`).join(", ");
    throw g(`Plugin ${Q} has an invalid manifest file at ${A}. Validation errors: ${J}`, {
      level: "error"
    }), Error(`Plugin ${Q} has an invalid manifest file at ${A}.

Validation errors: ${J}

Please fix the manifest or remove it. The plugin cannot load with an invalid manifest.`)
  } catch (Z) {
    if (Z instanceof Error && Z.message.includes("invalid manifest file")) throw Z;
    let I = Z instanceof Error ? Z.message : String(Z);
    throw g(`Plugin ${Q} has a corrupt manifest file at ${A}. Parse error: ${I}`, {
      level: "error"
    }), Error(`Plugin ${Q} has a corrupt manifest file at ${A}.

JSON parse error: ${I}

Please check the file for syntax errors.`)
  }
}
// @from(Start 8984210, End 8984500)
function r22(A, Q) {
  let B = RA();
  if (!B.existsSync(A)) throw Error(`Hooks file not found at ${A} for plugin ${Q}. If the manifest declares hooks, the file must exist.`);
  let G = B.readFileSync(A, {
      encoding: "utf-8"
    }),
    Z = JSON.parse(G);
  return x22.parse(Z).hooks
}
// @from(Start 8984502, End 8991534)
function A92(A, Q, B, G, Z = !0) {
  let I = RA(),
    Y = [],
    J = A8(A, ".claude-plugin", "plugin.json"),
    W = e22(J, G, Q),
    X = {
      name: W.name,
      manifest: W,
      path: A,
      source: Q,
      repository: Q,
      enabled: B
    },
    V = A8(A, "commands");
  if (I.existsSync(V)) X.commandsPath = V;
  if (W.commands) {
    let U = Object.values(W.commands)[0];
    if (typeof W.commands === "object" && !Array.isArray(W.commands) && U && typeof U === "object" && (("source" in U) || ("content" in U))) {
      let q = {},
        w = [];
      for (let [N, R] of Object.entries(W.commands)) {
        if (!R || typeof R !== "object") continue;
        if (R.source) {
          let T = A8(A, R.source);
          if (I.existsSync(T)) w.push(T), q[N] = R;
          else g(`Command ${N} path ${R.source} specified in manifest but not found at ${T} for ${W.name}`, {
            level: "warn"
          }), AA(Error(`Plugin component file not found: ${T} for ${W.name}`)), Y.push({
            type: "path-not-found",
            source: Q,
            plugin: W.name,
            path: T,
            component: "commands"
          })
        } else if (R.content) q[N] = R
      }
      if (w.length > 0) X.commandsPaths = w;
      if (Object.keys(q).length > 0) X.commandsMetadata = q
    } else {
      let q = Array.isArray(W.commands) ? W.commands : [W.commands],
        w = [];
      for (let N of q) {
        if (typeof N !== "string") {
          g(`Unexpected command format in manifest for ${W.name}`, {
            level: "error"
          });
          continue
        }
        let R = A8(A, N);
        if (I.existsSync(R)) w.push(R);
        else g(`Command path ${N} specified in manifest but not found at ${R} for ${W.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${R} for ${W.name}`)), Y.push({
          type: "path-not-found",
          source: Q,
          plugin: W.name,
          path: R,
          component: "commands"
        })
      }
      if (w.length > 0) X.commandsPaths = w
    }
  }
  let F = A8(A, "agents");
  if (I.existsSync(F)) X.agentsPath = F;
  if (W.agents) {
    let U = Array.isArray(W.agents) ? W.agents : [W.agents],
      q = [];
    for (let w of U) {
      let N = A8(A, w);
      if (I.existsSync(N)) q.push(N);
      else g(`Agent path ${w} specified in manifest but not found at ${N} for ${W.name}`, {
        level: "warn"
      }), AA(Error(`Plugin component file not found: ${N} for ${W.name}`)), Y.push({
        type: "path-not-found",
        source: Q,
        plugin: W.name,
        path: N,
        component: "agents"
      })
    }
    if (q.length > 0) X.agentsPaths = q
  }
  let K = A8(A, "skills");
  if (I.existsSync(K)) X.skillsPath = K;
  if (W.skills) {
    let U = Array.isArray(W.skills) ? W.skills : [W.skills],
      q = [];
    for (let w of U) {
      let N = A8(A, w);
      if (I.existsSync(N)) q.push(N);
      else g(`Skill path ${w} specified in manifest but not found at ${N} for ${W.name}`, {
        level: "warn"
      }), AA(Error(`Plugin component file not found: ${N} for ${W.name}`)), Y.push({
        type: "path-not-found",
        source: Q,
        plugin: W.name,
        path: N,
        component: "skills"
      })
    }
    if (q.length > 0) X.skillsPaths = q
  }
  let D = A8(A, "output-styles");
  if (I.existsSync(D)) X.outputStylesPath = D;
  if (W.outputStyles) {
    let U = Array.isArray(W.outputStyles) ? W.outputStyles : [W.outputStyles],
      q = [];
    for (let w of U) {
      let N = A8(A, w);
      if (I.existsSync(N)) q.push(N);
      else g(`Output style path ${w} specified in manifest but not found at ${N} for ${W.name}`, {
        level: "warn"
      }), AA(Error(`Plugin component file not found: ${N} for ${W.name}`)), Y.push({
        type: "path-not-found",
        source: Q,
        plugin: W.name,
        path: N,
        component: "output-styles"
      })
    }
    if (q.length > 0) X.outputStylesPaths = q
  }
  let H, C = new Set,
    E = A8(A, "hooks", "hooks.json");
  if (I.existsSync(E)) try {
    H = r22(E, W.name);
    try {
      C.add(I.realpathSync(E))
    } catch {
      C.add(E)
    }
    g(`Loaded hooks from standard location for plugin ${W.name}: ${E}`)
  } catch (U) {
    let q = U instanceof Error ? U.message : String(U);
    g(`Failed to load hooks for ${W.name}: ${q}`, {
      level: "error"
    }), AA(U instanceof Error ? U : Error(q)), Y.push({
      type: "hook-load-failed",
      source: Q,
      plugin: W.name,
      hookPath: E,
      reason: q
    })
  }
  if (W.hooks) {
    let U = Array.isArray(W.hooks) ? W.hooks : [W.hooks];
    for (let q of U)
      if (typeof q === "string") {
        let w = A8(A, q);
        if (!I.existsSync(w)) {
          g(`Hooks file ${q} specified in manifest but not found at ${w} for ${W.name}`, {
            level: "error"
          }), AA(Error(`Plugin component file not found: ${w} for ${W.name}`)), Y.push({
            type: "path-not-found",
            source: Q,
            plugin: W.name,
            path: w,
            component: "hooks"
          });
          continue
        }
        let N;
        try {
          N = I.realpathSync(w)
        } catch {
          N = w
        }
        if (C.has(N)) {
          if (g(`Skipping duplicate hooks file for plugin ${W.name}: ${q} (resolves to already-loaded file: ${N})`), Z) {
            let R = `Duplicate hooks file detected: ${q} resolves to already-loaded file ${N}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
            AA(Error(R)), Y.push({
              type: "hook-load-failed",
              source: Q,
              plugin: W.name,
              hookPath: w,
              reason: R
            })
          }
          continue
        }
        try {
          let R = r22(w, W.name);
          try {
            H = o22(H, R), C.add(N), g(`Loaded and merged hooks from manifest for plugin ${W.name}: ${q}`)
          } catch (T) {
            let y = T instanceof Error ? T.message : String(T);
            g(`Failed to merge hooks from ${q} for ${W.name}: ${y}`, {
              level: "error"
            }), AA(T instanceof Error ? T : Error(y)), Y.push({
              type: "hook-load-failed",
              source: Q,
              plugin: W.name,
              hookPath: w,
              reason: `Failed to merge: ${y}`
            })
          }
        } catch (R) {
          let T = R instanceof Error ? R.message : String(R);
          g(`Failed to load hooks from ${q} for ${W.name}: ${T}`, {
            level: "error"
          }), AA(R instanceof Error ? R : Error(T)), Y.push({
            type: "hook-load-failed",
            source: Q,
            plugin: W.name,
            hookPath: w,
            reason: T
          })
        }
      } else if (typeof q === "object") H = o22(H, q)
  }
  if (H) X.hooksConfig = H;
  return {
    plugin: X,
    errors: Y
  }
}
// @from(Start 8991536, End 8991719)
function o22(A, Q) {
  if (!A) return Q;
  let B = {
    ...A
  };
  for (let [G, Z] of Object.entries(Q))
    if (!B[G]) B[G] = Z;
    else B[G] = [...B[G] || [], ...Z];
  return B
}
// @from(Start 8991720, End 8992760)
async function f85() {
  let Q = l0().enabledPlugins || {},
    B = [],
    G = [],
    Z = Object.entries(Q).filter(([Y, J]) => {
      return iAA.safeParse(Y).success && J !== void 0
    }),
    I = await pZ();
  for (let [Y, J] of Z) try {
    let [W, X] = Y.split("@"), V = I[X];
    if (V && !GB1(V.source)) {
      let D = LLA() || [];
      G.push({
        type: "marketplace-blocked-by-policy",
        source: Y,
        plugin: W,
        marketplace: X,
        allowedSources: D.map((H) => MLA(H))
      });
      continue
    }
    let F = await nl(Y);
    if (!F) {
      G.push({
        type: "plugin-not-found",
        source: Y,
        pluginId: W,
        marketplace: X
      });
      continue
    }
    let K = await h85(F.entry, F.marketplaceInstallLocation, Y, J === !0, G);
    if (K) B.push(K)
  } catch (W) {
    let X = W instanceof Error ? W : Error(String(W));
    AA(X), G.push({
      type: "generic-error",
      source: Y,
      error: X.message
    })
  }
  return {
    plugins: B,
    errors: G
  }
}
// @from(Start 8992761, End 9004289)
async function h85(A, Q, B, G, Z) {
  g(`Loading plugin ${A.name} from source: ${JSON.stringify(A.source)}`);
  let I = RA(),
    Y = [],
    J;
  if (typeof A.source === "string") {
    let K = I.statSync(Q).isDirectory() ? Q : A8(Q, ".."),
      D = A8(K, A.source);
    if (!I.existsSync(D)) {
      let H = Error(`Plugin path not found: ${D}`);
      return g(`Plugin path not found: ${D}`, {
        level: "error"
      }), AA(H), Z.push({
        type: "generic-error",
        source: B,
        error: `Plugin directory not found at path: ${D}. Check that the marketplace entry has the correct path.`
      }), null
    }
    if (o2("tengu_enable_versioned_plugins")) try {
      let H = A8(D, ".claude-plugin", "plugin.json"),
        C;
      try {
        C = e22(H, A.name, A.source)
      } catch {}
      let E = await YB1(B, A.source, C, K);
      J = await s22(D, B, E, A), g(`Copied local plugin ${A.name} to versioned cache: ${J}`)
    } catch (H) {
      let C = H instanceof Error ? H.message : String(H);
      g(`Failed to copy plugin ${A.name} to versioned cache: ${C}. Using marketplace path.`, {
        level: "warn"
      }), J = D
    } else J = D
  } else if (o2("tengu_enable_versioned_plugins")) try {
    let D = await YB1(B, A.source, void 0, void 0),
      H = JB1(B, D);
    if (I.existsSync(H)) g(`Using versioned cached plugin ${A.name} from ${H}`), J = H;
    else {
      let C = await SIA(A.source, {
          manifest: {
            name: A.name
          }
        }),
        E = await YB1(B, A.source, C.manifest, C.path);
      if (J = await s22(C.path, B, E, A), C.path !== J) I.rmSync(C.path, {
        recursive: !0,
        force: !0
      })
    }
  } catch (D) {
    let H = D instanceof Error ? D.message : String(D);
    return g(`Failed to cache plugin ${A.name}: ${H}`, {
      level: "error"
    }), AA(D instanceof Error ? D : Error(H)), Z.push({
      type: "generic-error",
      source: B,
      error: `Failed to download/cache plugin ${A.name}: ${H}`
    }), null
  } else {
    let D = al(),
      H = A.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
      C = A8(D, H);
    if (I.existsSync(C)) g(`Using cached plugin ${A.name} from ${C}`), J = C;
    else try {
      J = (await SIA(A.source, {
        manifest: {
          name: A.name
        }
      })).path
    } catch (E) {
      let U = E instanceof Error ? E.message : String(E);
      return g(`Failed to cache plugin ${A.name}: ${U}`, {
        level: "error"
      }), AA(E instanceof Error ? E : Error(U)), Z.push({
        type: "generic-error",
        source: B,
        error: `Failed to download/cache plugin ${A.name}: ${U}`
      }), null
    }
  }
  let W = A8(J, ".claude-plugin", "plugin.json"),
    X = I.existsSync(W),
    {
      plugin: V,
      errors: F
    } = A92(J, B, G, A.name, A.strict ?? !0);
  if (Y.push(...F), !X) {
    if (V.manifest = {
        ...A,
        id: void 0,
        source: void 0,
        strict: void 0
      }, V.name = V.manifest.name, A.commands) {
      let K = Object.values(A.commands)[0];
      if (typeof A.commands === "object" && !Array.isArray(A.commands) && K && typeof K === "object" && (("source" in K) || ("content" in K))) {
        let D = {},
          H = [];
        for (let [C, E] of Object.entries(A.commands)) {
          if (!E || typeof E !== "object" || !E.source) continue;
          let U = A8(J, E.source);
          if (I.existsSync(U)) H.push(U), D[C] = E;
          else g(`Command ${C} path ${E.source} from marketplace entry not found at ${U} for ${A.name}`, {
            level: "warn"
          }), AA(Error(`Plugin component file not found: ${U} for ${A.name}`)), Y.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: U,
            component: "commands"
          })
        }
        if (H.length > 0) V.commandsPaths = H, V.commandsMetadata = D
      } else {
        let D = Array.isArray(A.commands) ? A.commands : [A.commands],
          H = [];
        for (let C of D) {
          if (typeof C !== "string") {
            g(`Unexpected command format in marketplace entry for ${A.name}`, {
              level: "error"
            });
            continue
          }
          let E = A8(J, C);
          if (I.existsSync(E)) H.push(E);
          else g(`Command path ${C} from marketplace entry not found at ${E} for ${A.name}`, {
            level: "warn"
          }), AA(Error(`Plugin component file not found: ${E} for ${A.name}`)), Y.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: E,
            component: "commands"
          })
        }
        if (H.length > 0) V.commandsPaths = H
      }
    }
    if (A.agents) {
      let K = Array.isArray(A.agents) ? A.agents : [A.agents],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (I.existsSync(C)) D.push(C);
        else g(`Agent path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "agents"
        })
      }
      if (D.length > 0) V.agentsPaths = D
    }
    if (A.skills) {
      g(`Processing ${Array.isArray(A.skills)?A.skills.length:1} skill paths for plugin ${A.name}`);
      let K = Array.isArray(A.skills) ? A.skills : [A.skills],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (g(`Checking skill path: ${H} -> ${C} (exists: ${I.existsSync(C)})`), I.existsSync(C)) D.push(C);
        else g(`Skill path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "skills"
        })
      }
      if (g(`Found ${D.length} valid skill paths for plugin ${A.name}, setting skillsPaths`), D.length > 0) V.skillsPaths = D
    } else g(`Plugin ${A.name} has no entry.skills defined`);
    if (A.outputStyles) {
      let K = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (I.existsSync(C)) D.push(C);
        else g(`Output style path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "output-styles"
        })
      }
      if (D.length > 0) V.outputStylesPaths = D
    }
    if (A.hooks) V.hooksConfig = A.hooks
  } else if (!A.strict && X && (A.commands || A.agents || A.skills || A.hooks || A.outputStyles)) {
    let K = Error(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
    return g(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, {
      level: "error"
    }), AA(K), Z.push({
      type: "generic-error",
      source: B,
      error: `Plugin ${A.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
    }), null
  } else if (X) {
    if (A.commands) {
      let K = Object.values(A.commands)[0];
      if (typeof A.commands === "object" && !Array.isArray(A.commands) && K && typeof K === "object" && (("source" in K) || ("content" in K))) {
        let D = {
            ...V.commandsMetadata || {}
          },
          H = [];
        for (let [C, E] of Object.entries(A.commands)) {
          if (!E || typeof E !== "object" || !E.source) continue;
          let U = A8(J, E.source);
          if (I.existsSync(U)) H.push(U), D[C] = E;
          else g(`Command ${C} path ${E.source} from marketplace entry not found at ${U} for ${A.name}`, {
            level: "warn"
          }), AA(Error(`Plugin component file not found: ${U} for ${A.name}`)), Y.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: U,
            component: "commands"
          })
        }
        if (H.length > 0) V.commandsPaths = [...V.commandsPaths || [], ...H], V.commandsMetadata = D
      } else {
        let D = Array.isArray(A.commands) ? A.commands : [A.commands],
          H = [];
        for (let C of D) {
          if (typeof C !== "string") {
            g(`Unexpected command format in marketplace entry for ${A.name}`, {
              level: "error"
            });
            continue
          }
          let E = A8(J, C);
          if (I.existsSync(E)) H.push(E);
          else g(`Command path ${C} from marketplace entry not found at ${E} for ${A.name}`, {
            level: "warn"
          }), AA(Error(`Plugin component file not found: ${E} for ${A.name}`)), Y.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: E,
            component: "commands"
          })
        }
        if (H.length > 0) V.commandsPaths = [...V.commandsPaths || [], ...H]
      }
    }
    if (A.agents) {
      let K = Array.isArray(A.agents) ? A.agents : [A.agents],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (I.existsSync(C)) D.push(C);
        else g(`Agent path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "agents"
        })
      }
      if (D.length > 0) V.agentsPaths = [...V.agentsPaths || [], ...D]
    }
    if (A.skills) {
      let K = Array.isArray(A.skills) ? A.skills : [A.skills],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (I.existsSync(C)) D.push(C);
        else g(`Skill path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "skills"
        })
      }
      if (D.length > 0) V.skillsPaths = [...V.skillsPaths || [], ...D]
    }
    if (A.outputStyles) {
      let K = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
        D = [];
      for (let H of K) {
        let C = A8(J, H);
        if (I.existsSync(C)) D.push(C);
        else g(`Output style path ${H} from marketplace entry not found at ${C} for ${A.name}`, {
          level: "warn"
        }), AA(Error(`Plugin component file not found: ${C} for ${A.name}`)), Y.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: C,
          component: "output-styles"
        })
      }
      if (D.length > 0) V.outputStylesPaths = [...V.outputStylesPaths || [], ...D]
    }
    if (A.hooks) V.hooksConfig = {
      ...V.hooksConfig || {},
      ...A.hooks
    }
  }
  return Z.push(...Y), V
}
// @from(Start 9004290, End 9005405)
async function g85(A) {
  if (A.length === 0) return {
    plugins: [],
    errors: []
  };
  let Q = [],
    B = [],
    G = RA();
  for (let [Z, I] of A.entries()) try {
    let Y = j85(I);
    if (!G.existsSync(Y)) {
      g(`Plugin path does not exist: ${Y}, skipping`, {
        level: "warn"
      }), B.push({
        type: "path-not-found",
        source: `inline[${Z}]`,
        path: Y,
        component: "commands"
      });
      continue
    }
    let J = S85(Y),
      {
        plugin: W,
        errors: X
      } = A92(Y, `${J}@inline`, !0, J);
    W.source = `${W.name}@inline`, W.repository = `${W.name}@inline`, Q.push(W), B.push(...X), g(`Loaded inline plugin from path: ${W.name}`)
  } catch (Y) {
    let J = Y instanceof Error ? Y.message : String(Y);
    g(`Failed to load session plugin from ${I}: ${J}`, {
      level: "warn"
    }), B.push({
      type: "generic-error",
      source: `inline[${Z}]`,
      error: `Failed to load plugin: ${J}`
    })
  }
  if (Q.length > 0) g(`Loaded ${Q.length} session-only plugins from --plugin-dir`);
  return {
    plugins: Q,
    errors: B
  }
}
// @from(Start 9005407, End 9005447)
function _IA() {
  l7.cache?.clear?.()
}
// @from(Start 9005452, End 9005454)
l7
// @from(Start 9005460, End 9006058)
fV = L(() => {
  l2();
  AQ();
  u2();
  _0();
  aAA();
  V0();
  g1();
  MB();
  oH();
  OLA();
  _8();
  hQ();
  n22();
  l7 = s1(async () => {
    let A = await f85(),
      Q = [...A.plugins],
      B = [...A.errors],
      G = Iz0();
    if (G.length > 0) {
      let Z = await g85(G);
      Q.push(...Z.plugins), B.push(...Z.errors)
    }
    return g(`Found ${Q.length} plugins (${Q.filter((Z)=>Z.enabled).length} enabled, ${Q.filter((Z)=>!Z.enabled).length} disabled)`), {
      enabled: Q.filter((Z) => Z.enabled),
      disabled: Q.filter((Z) => !Z.enabled),
      errors: B
    }
  })
})
// @from(Start 9006064, End 9006067)
Q92
// @from(Start 9006069, End 9006072)
u85
// @from(Start 9006074, End 9006077)
m85
// @from(Start 9006079, End 9006082)
d85
// @from(Start 9006084, End 9006087)
c85
// @from(Start 9006089, End 9006092)
p85
// @from(Start 9006094, End 9006097)
l85
// @from(Start 9006099, End 9006102)
i85
// @from(Start 9006104, End 9006107)
n85
// @from(Start 9006109, End 9006112)
a85
// @from(Start 9006114, End 9006117)
lTG
// @from(Start 9006119, End 9006122)
WB1
// @from(Start 9006124, End 9006127)
iTG
// @from(Start 9006133, End 9008662)
PLA = L(() => {
  Q2();
  Q92 = Qw({
    command: CQ(),
    args: zJ(CQ()).optional(),
    env: PR(CQ(), CQ()).optional()
  }), u85 = Qw({
    name: CQ(),
    email: CQ().email().optional(),
    url: CQ().url().optional()
  }), m85 = Qw({
    type: CQ(),
    url: CQ().url()
  }), d85 = Q92.partial(), c85 = Q92.extend({
    platform_overrides: PR(CQ(), d85).optional()
  }), p85 = Qw({
    type: jR(["python", "node", "binary"]),
    entry_point: CQ(),
    mcp_config: c85
  }), l85 = Qw({
    claude_desktop: CQ().optional(),
    platforms: zJ(jR(["darwin", "win32", "linux"])).optional(),
    runtimes: Qw({
      python: CQ().optional(),
      node: CQ().optional()
    }).optional()
  }).passthrough(), i85 = Qw({
    name: CQ(),
    description: CQ().optional()
  }), n85 = Qw({
    name: CQ(),
    description: CQ().optional(),
    arguments: zJ(CQ()).optional(),
    text: CQ()
  }), a85 = Qw({
    type: jR(["string", "number", "boolean", "directory", "file"]),
    title: CQ(),
    description: CQ(),
    required: $F().optional(),
    default: Br([CQ(), rN(), $F(), zJ(CQ())]).optional(),
    multiple: $F().optional(),
    sensitive: $F().optional(),
    min: rN().optional(),
    max: rN().optional()
  }), lTG = PR(CQ(), Br([CQ(), rN(), $F(), zJ(CQ())])), WB1 = Qw({
    $schema: CQ().optional(),
    dxt_version: CQ().optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: CQ().optional(),
    name: CQ(),
    display_name: CQ().optional(),
    version: CQ(),
    description: CQ(),
    long_description: CQ().optional(),
    author: u85,
    repository: m85.optional(),
    homepage: CQ().url().optional(),
    documentation: CQ().url().optional(),
    support: CQ().url().optional(),
    icon: CQ().optional(),
    screenshots: zJ(CQ()).optional(),
    server: p85,
    tools: zJ(i85).optional(),
    tools_generated: $F().optional(),
    prompts: zJ(n85).optional(),
    prompts_generated: $F().optional(),
    keywords: zJ(CQ()).optional(),
    license: CQ().optional(),
    privacy_policies: zJ(CQ()).optional(),
    compatibility: l85.optional(),
    user_config: PR(CQ(), a85).optional()
  }).refine((A) => !!(A.dxt_version || A.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  }), iTG = Qw({
    status: jR(["signed", "unsigned", "self-signed"]),
    publisher: CQ().optional(),
    issuer: CQ().optional(),
    valid_from: CQ().optional(),
    valid_to: CQ().optional(),
    fingerprint: CQ().optional()
  })
})
// @from(Start 9008668, End 9008694)
be1 = L(() => {
  PLA()
})
// @from(Start 9008746, End 9008931)
function J65(A, Q, B) {
  if (!B) B = Q, Q = {};
  if (typeof B != "function") TE(7);
  return Y65(A, Q, [I65], function(G) {
    return E92(de1(G.data[0], z92(G.data[1])))
  }, 1, B)
}
// @from(Start 9008933, End 9009018)
function de1(A, Q) {
  return C92(A, {
    i: 2
  }, Q && Q.out, Q && Q.dictionary)
}
// @from(Start 9009020, End 9009333)
function V65(A, Q) {
  if (Q) {
    var B = "";
    for (var G = 0; G < A.length; G += 16384) B += String.fromCharCode.apply(null, A.subarray(G, G + 16384));
    return B
  } else if (he1) return he1.decode(A);
  else {
    var Z = X65(A),
      I = Z.s,
      B = Z.r;
    if (B.length) TE(8);
    return I
  }
}
// @from(Start 9009335, End 9011085)
function U92(A, Q, B) {
  if (!B) B = Q, Q = {};
  if (typeof B != "function") TE(7);
  var G = [],
    Z = function() {
      for (var E = 0; E < G.length; ++E) G[E]()
    },
    I = {},
    Y = function(E, U) {
      G92(function() {
        B(E, U)
      })
    };
  G92(function() {
    Y = B
  });
  var J = A.length - 22;
  for (; eT(A, J) != 101010256; --J)
    if (!J || A.length - J > 65558) return Y(TE(13, 0, 1), null), Z;
  var W = Tk(A, J + 8);
  if (W) {
    var X = W,
      V = eT(A, J + 16),
      F = V == 4294967295 || X == 65535;
    if (F) {
      var K = eT(A, J - 12);
      if (F = eT(A, K) == 101075792, F) X = W = eT(A, K + 32), V = eT(A, K + 48)
    }
    var D = Q && Q.filter,
      H = function(E) {
        var U = K65(A, V, F),
          q = U[0],
          w = U[1],
          N = U[2],
          R = U[3],
          T = U[4],
          y = U[5],
          v = F65(A, y);
        V = T;
        var x = function(u, e) {
          if (u) Z(), Y(u, null);
          else {
            if (e) I[R] = e;
            if (!--W) Y(null, I)
          }
        };
        if (!D || D({
            name: R,
            size: w,
            originalSize: N,
            compression: q
          }))
          if (!q) x(null, HB1(A, v, v + w));
          else if (q == 8) {
          var p = A.subarray(v, v + w);
          if (N < 524288 || w > 0.8 * N) try {
            x(null, de1(p, {
              out: new PE(N)
            }))
          } catch (u) {
            x(u, null)
          } else G.push(J65(p, {
            size: N
          }, x))
        } else x(TE(14, "unknown compression type " + q, 1), null);
        else x(null, null)
      };
    for (var C = 0; C < X; ++C) H(C)
  } else Y(null, {});
  return Z
}
// @from(Start 9011090, End 9011093)
o85
// @from(Start 9011095, End 9011098)
VB1
// @from(Start 9011100, End 9011294)
t85 = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global"
// @from(Start 9011298, End 9011301)
e85
// @from(Start 9011303, End 9011305)
PE
// @from(Start 9011307, End 9011310)
tAA
// @from(Start 9011312, End 9011315)
Z92
// @from(Start 9011317, End 9011320)
ge1
// @from(Start 9011322, End 9011325)
ue1
// @from(Start 9011327, End 9011330)
I92
// @from(Start 9011332, End 9011616)
Y92 = function(A, Q) {
    var B = new tAA(31);
    for (var G = 0; G < 31; ++G) B[G] = Q += 1 << A[G - 1];
    var Z = new Z92(B[30]);
    for (var G = 1; G < 30; ++G)
      for (var I = B[G]; I < B[G + 1]; ++I) Z[I] = I - B[G] << 5 | G;
    return {
      b: B,
      r: Z
    }
  }
// @from(Start 9011620, End 9011623)
J92
// @from(Start 9011625, End 9011628)
me1
// @from(Start 9011630, End 9011633)
A65
// @from(Start 9011635, End 9011638)
W92
// @from(Start 9011640, End 9011643)
X92
// @from(Start 9011645, End 9011648)
oTG
// @from(Start 9011650, End 9011653)
DB1
// @from(Start 9011655, End 9011657)
Rk
// @from(Start 9011659, End 9011661)
G5
// @from(Start 9011663, End 9012330)
kIA = function(A, Q, B) {
    var G = A.length,
      Z = 0,
      I = new tAA(Q);
    for (; Z < G; ++Z)
      if (A[Z]) ++I[A[Z] - 1];
    var Y = new tAA(Q);
    for (Z = 1; Z < Q; ++Z) Y[Z] = Y[Z - 1] + I[Z - 1] << 1;
    var J;
    if (B) {
      J = new tAA(1 << Q);
      var W = 15 - Q;
      for (Z = 0; Z < G; ++Z)
        if (A[Z]) {
          var X = Z << 4 | A[Z],
            V = Q - A[Z],
            F = Y[A[Z] - 1]++ << V;
          for (var K = F | (1 << V) - 1; F <= K; ++F) J[DB1[F] >> W] = X
        }
    } else {
      J = new tAA(G);
      for (Z = 0; Z < G; ++Z)
        if (A[Z]) J[Z] = DB1[Y[A[Z] - 1]++] >> 15 - A[Z]
    }
    return J
  }
// @from(Start 9012334, End 9012337)
jLA
// @from(Start 9012355, End 9012358)
V92
// @from(Start 9012364, End 9012367)
F92
// @from(Start 9012369, End 9012372)
K92
// @from(Start 9012374, End 9012497)
FB1 = function(A) {
    var Q = A[0];
    for (var B = 1; B < A.length; ++B)
      if (A[B] > Q) Q = A[B];
    return Q
  }
// @from(Start 9012501, End 9012601)
mM = function(A, Q, B) {
    var G = Q / 8 | 0;
    return (A[G] | A[G + 1] << 8) >> (Q & 7) & B
  }
// @from(Start 9012605, End 9012716)
KB1 = function(A, Q) {
    var B = Q / 8 | 0;
    return (A[B] | A[B + 1] << 8 | A[B + 2] << 16) >> (Q & 7)
  }
// @from(Start 9012720, End 9012770)
D92 = function(A) {
    return (A + 7) / 8 | 0
  }
// @from(Start 9012774, End 9012923)
HB1 = function(A, Q, B) {
    if (Q == null || Q < 0) Q = 0;
    if (B == null || B > A.length) B = A.length;
    return new PE(A.subarray(Q, B))
  }
// @from(Start 9012927, End 9012930)
H92
// @from(Start 9012932, End 9013103)
TE = function(A, Q, B) {
    var G = Error(Q || H92[A]);
    if (G.code = A, Error.captureStackTrace) Error.captureStackTrace(G, TE);
    if (!B) throw G;
    return G
  }
// @from(Start 9013107, End 9016649)
C92 = function(A, Q, B, G) {
    var Z = A.length,
      I = G ? G.length : 0;
    if (!Z || Q.f && !Q.l) return B || new PE(0);
    var Y = !B,
      J = Y || Q.i != 2,
      W = Q.i;
    if (Y) B = new PE(Z * 3);
    var X = function(MA) {
        var DA = B.length;
        if (MA > DA) {
          var $A = new PE(Math.max(DA * 2, MA));
          $A.set(B), B = $A
        }
      },
      V = Q.f || 0,
      F = Q.p || 0,
      K = Q.b || 0,
      D = Q.l,
      H = Q.d,
      C = Q.m,
      E = Q.n,
      U = Z * 8;
    do {
      if (!D) {
        V = mM(A, F, 1);
        var q = mM(A, F + 1, 3);
        if (F += 3, !q) {
          var w = D92(F) + 4,
            N = A[w - 4] | A[w - 3] << 8,
            R = w + N;
          if (R > Z) {
            if (W) TE(0);
            break
          }
          if (J) X(K + N);
          B.set(A.subarray(w, R), K), Q.b = K += N, Q.p = F = R * 8, Q.f = V;
          continue
        } else if (q == 1) D = F92, H = K92, C = 9, E = 5;
        else if (q == 2) {
          var T = mM(A, F, 31) + 257,
            y = mM(A, F + 10, 15) + 4,
            v = T + mM(A, F + 5, 31) + 1;
          F += 14;
          var x = new PE(v),
            p = new PE(19);
          for (var u = 0; u < y; ++u) p[I92[u]] = mM(A, F + u * 3, 7);
          F += y * 3;
          var e = FB1(p),
            l = (1 << e) - 1,
            k = kIA(p, e, 1);
          for (var u = 0; u < v;) {
            var m = k[mM(A, F, l)];
            F += m & 15;
            var w = m >> 4;
            if (w < 16) x[u++] = w;
            else {
              var o = 0,
                IA = 0;
              if (w == 16) IA = 3 + mM(A, F, 3), F += 2, o = x[u - 1];
              else if (w == 17) IA = 3 + mM(A, F, 7), F += 3;
              else if (w == 18) IA = 11 + mM(A, F, 127), F += 7;
              while (IA--) x[u++] = o
            }
          }
          var FA = x.subarray(0, T),
            zA = x.subarray(T);
          C = FB1(FA), E = FB1(zA), D = kIA(FA, C, 1), H = kIA(zA, E, 1)
        } else TE(1);
        if (F > U) {
          if (W) TE(0);
          break
        }
      }
      if (J) X(K + 131072);
      var NA = (1 << C) - 1,
        OA = (1 << E) - 1,
        mA = F;
      for (;; mA = F) {
        var o = D[KB1(A, F) & NA],
          wA = o >> 4;
        if (F += o & 15, F > U) {
          if (W) TE(0);
          break
        }
        if (!o) TE(2);
        if (wA < 256) B[K++] = wA;
        else if (wA == 256) {
          mA = F, D = null;
          break
        } else {
          var qA = wA - 254;
          if (wA > 264) {
            var u = wA - 257,
              KA = ge1[u];
            qA = mM(A, F, (1 << KA) - 1) + me1[u], F += KA
          }
          var yA = H[KB1(A, F) & OA],
            oA = yA >> 4;
          if (!yA) TE(3);
          F += yA & 15;
          var zA = X92[oA];
          if (oA > 3) {
            var KA = ue1[oA];
            zA += KB1(A, F) & (1 << KA) - 1, F += KA
          }
          if (F > U) {
            if (W) TE(0);
            break
          }
          if (J) X(K + 131072);
          var X1 = K + qA;
          if (K < zA) {
            var WA = I - zA,
              EA = Math.min(zA, X1);
            if (WA + K < 0) TE(3);
            for (; K < EA; ++K) B[K] = G[WA + K]
          }
          for (; K < X1; ++K) B[K] = B[K - zA]
        }
      }
      if (Q.l = D, Q.p = mA, Q.b = K, Q.f = V, D) V = 1, Q.m = C, Q.d = H, Q.n = E
    } while (!V);
    return K != B.length && Y ? HB1(B, 0, K) : B.subarray(0, K)
  }
// @from(Start 9016653, End 9016656)
Q65
// @from(Start 9016658, End 9016781)
B65 = function(A, Q) {
    var B = {};
    for (var G in A) B[G] = A[G];
    for (var G in Q) B[G] = Q[G];
    return B
  }
// @from(Start 9016785, End 9017501)
B92 = function(A, Q, B) {
    var G = A(),
      Z = A.toString(),
      I = Z.slice(Z.indexOf("[") + 1, Z.lastIndexOf("]")).replace(/\s+/g, "").split(",");
    for (var Y = 0; Y < G.length; ++Y) {
      var J = G[Y],
        W = I[Y];
      if (typeof J == "function") {
        Q += ";" + W + "=";
        var X = J.toString();
        if (J.prototype)
          if (X.indexOf("[native code]") != -1) {
            var V = X.indexOf(" ", 8) + 1;
            Q += X.slice(V, X.indexOf("(", V))
          } else {
            Q += X;
            for (var F in J.prototype) Q += ";" + W + ".prototype." + F + "=" + J.prototype[F].toString()
          }
        else Q += X
      } else B[W] = J
    }
    return Q
  }
// @from(Start 9017505, End 9017508)
XB1
// @from(Start 9017510, End 9017658)
G65 = function(A) {
    var Q = [];
    for (var B in A)
      if (A[B].buffer) Q.push((A[B] = new A[B].constructor(A[B])).buffer);
    return Q
  }
// @from(Start 9017662, End 9018070)
Z65 = function(A, Q, B, G) {
    if (!XB1[B]) {
      var Z = "",
        I = {},
        Y = A.length - 1;
      for (var J = 0; J < Y; ++J) Z = B92(A[J], Z, I);
      XB1[B] = {
        c: B92(A[Y], Z, I),
        e: I
      }
    }
    var W = B65({}, XB1[B].e);
    return e85(XB1[B].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + Q.toString() + "}", B, W, G65(W), G)
  }
// @from(Start 9018074, End 9018220)
I65 = function() {
    return [PE, tAA, Z92, ge1, ue1, I92, me1, X92, F92, K92, DB1, H92, kIA, FB1, mM, KB1, D92, HB1, TE, C92, de1, E92, z92]
  }
// @from(Start 9018224, End 9018285)
E92 = function(A) {
    return postMessage(A, [A.buffer])
  }
// @from(Start 9018289, End 9018404)
z92 = function(A) {
    return A && {
      out: A.size && new PE(A.size),
      dictionary: A.dictionary
    }
  }
// @from(Start 9018408, End 9018637)
Y65 = function(A, Q, B, G, Z, I) {
    var Y = Z65(B, G, Z, function(J, W) {
      Y.terminate(), I(J, W)
    });
    return Y.postMessage([A, Q], Q.consume ? [A.buffer] : []),
      function() {
        Y.terminate()
      }
  }
// @from(Start 9018641, End 9018698)
Tk = function(A, Q) {
    return A[Q] | A[Q + 1] << 8
  }
// @from(Start 9018702, End 9018801)
eT = function(A, Q) {
    return (A[Q] | A[Q + 1] << 8 | A[Q + 2] << 16 | A[Q + 3] << 24) >>> 0
  }
// @from(Start 9018805, End 9018879)
fe1 = function(A, Q) {
    return eT(A, Q) + eT(A, Q + 4) * 4294967296
  }
// @from(Start 9018883, End 9018886)
he1
// @from(Start 9018888, End 9018895)
W65 = 0
// @from(Start 9018899, End 9019492)
X65 = function(A) {
    for (var Q = "", B = 0;;) {
      var G = A[B++],
        Z = (G > 127) + (G > 223) + (G > 239);
      if (B + Z > A.length) return {
        s: Q,
        r: HB1(A, B - 1)
      };
      if (!Z) Q += String.fromCharCode(G);
      else if (Z == 3) G = ((G & 15) << 18 | (A[B++] & 63) << 12 | (A[B++] & 63) << 6 | A[B++] & 63) - 65536, Q += String.fromCharCode(55296 | G >> 10, 56320 | G & 1023);
      else if (Z & 1) Q += String.fromCharCode((G & 31) << 6 | A[B++] & 63);
      else Q += String.fromCharCode((G & 15) << 12 | (A[B++] & 63) << 6 | A[B++] & 63)
    }
  }
// @from(Start 9019496, End 9019572)
F65 = function(A, Q) {
    return Q + 30 + Tk(A, Q + 26) + Tk(A, Q + 28)
  }
// @from(Start 9019576, End 9019952)
K65 = function(A, Q, B) {
    var G = Tk(A, Q + 28),
      Z = V65(A.subarray(Q + 46, Q + 46 + G), !(Tk(A, Q + 8) & 2048)),
      I = Q + 46 + G,
      Y = eT(A, Q + 20),
      J = B && Y == 4294967295 ? D65(A, I) : [Y, eT(A, Q + 24), eT(A, Q + 42)],
      W = J[0],
      X = J[1],
      V = J[2];
    return [Tk(A, Q + 10), W, X, Z, I + Tk(A, Q + 30) + Tk(A, Q + 32), V]
  }
// @from(Start 9019956, End 9020091)
D65 = function(A, Q) {
    for (; Tk(A, Q) != 1; Q += 4 + Tk(A, Q + 2));
    return [fe1(A, Q + 12), fe1(A, Q + 4), fe1(A, Q + 20)]
  }
// @from(Start 9020095, End 9020098)
G92
// @from(Start 9020104, End 9022584)
$92 = L(() => {
  o85 = r85("/");
  try {
    VB1 = o85("worker_threads").Worker
  } catch (A) {}
  e85 = VB1 ? function(A, Q, B, G, Z) {
    var I = !1,
      Y = new VB1(A + t85, {
        eval: !0
      }).on("error", function(J) {
        return Z(J, null)
      }).on("message", function(J) {
        return Z(null, J)
      }).on("exit", function(J) {
        if (J && !I) Z(Error("exited with code " + J), null)
      });
    return Y.postMessage(B, G), Y.terminate = function() {
      return I = !0, VB1.prototype.terminate.call(Y)
    }, Y
  } : function(A, Q, B, G, Z) {
    setImmediate(function() {
      return Z(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"), null)
    });
    var I = function() {};
    return {
      terminate: I,
      postMessage: I
    }
  }, PE = Uint8Array, tAA = Uint16Array, Z92 = Int32Array, ge1 = new PE([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), ue1 = new PE([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), I92 = new PE([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), J92 = Y92(ge1, 2), me1 = J92.b, A65 = J92.r;
  me1[28] = 258, A65[258] = 28;
  W92 = Y92(ue1, 0), X92 = W92.b, oTG = W92.r, DB1 = new tAA(32768);
  for (G5 = 0; G5 < 32768; ++G5) Rk = (G5 & 43690) >> 1 | (G5 & 21845) << 1, Rk = (Rk & 52428) >> 2 | (Rk & 13107) << 2, Rk = (Rk & 61680) >> 4 | (Rk & 3855) << 4, DB1[G5] = ((Rk & 65280) >> 8 | (Rk & 255) << 8) >> 1;
  jLA = new PE(288);
  for (G5 = 0; G5 < 144; ++G5) jLA[G5] = 8;
  for (G5 = 144; G5 < 256; ++G5) jLA[G5] = 9;
  for (G5 = 256; G5 < 280; ++G5) jLA[G5] = 7;
  for (G5 = 280; G5 < 288; ++G5) jLA[G5] = 8;
  V92 = new PE(32);
  for (G5 = 0; G5 < 32; ++G5) V92[G5] = 5;
  F92 = kIA(jLA, 9, 1), K92 = kIA(V92, 5, 1), H92 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], Q65 = new PE(0), XB1 = [];
  he1 = typeof TextDecoder < "u" && new TextDecoder;
  try {
    he1.decode(Q65, {
      stream: !0
    }), W65 = 1
  } catch (A) {}
  G92 = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(A) {
    A()
  }
})
// @from(Start 9022590, End 9029193)
UB1 = z((eTG, zB1) => {
  function N92(A) {
    return Array.isArray(A) ? A : [A]
  }
  var H65 = void 0,
    pe1 = "",
    w92 = " ",
    ce1 = "\\",
    C65 = /^\s+$/,
    E65 = /(?:[^\\]|^)\\$/,
    z65 = /^\\!/,
    U65 = /^\\#/,
    $65 = /\r?\n/g,
    w65 = /^\.{0,2}\/|^\.{1,2}$/,
    q65 = /\/$/,
    yIA = "/",
    L92 = "node-ignore";
  if (typeof Symbol < "u") L92 = Symbol.for("node-ignore");
  var M92 = L92,
    xIA = (A, Q, B) => {
      return Object.defineProperty(A, Q, {
        value: B
      }), B
    },
    N65 = /([0-z])-([0-z])/g,
    O92 = () => !1,
    L65 = (A) => A.replace(N65, (Q, B, G) => B.charCodeAt(0) <= G.charCodeAt(0) ? Q : pe1),
    M65 = (A) => {
      let {
        length: Q
      } = A;
      return A.slice(0, Q - Q % 2)
    },
    O65 = [
      [/^\uFEFF/, () => pe1],
      [/((?:\\\\)*?)(\\?\s+)$/, (A, Q, B) => Q + (B.indexOf("\\") === 0 ? w92 : pe1)],
      [/(\\+?)\s/g, (A, Q) => {
        let {
          length: B
        } = Q;
        return Q.slice(0, B - B % 2) + w92
      }],
      [/[\\$.|*+(){^]/g, (A) => `\\${A}`],
      [/(?!\\)\?/g, () => "[^/]"],
      [/^\//, () => "^"],
      [/\//g, () => "\\/"],
      [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
      [/^(?=[^^])/, function() {
        return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^"
      }],
      [/\\\/\\\*\\\*(?=\\\/|$)/g, (A, Q, B) => Q + 6 < B.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
      [/(^|[^\\]+)(\\\*)+(?=.+)/g, (A, Q, B) => {
        let G = B.replace(/\\\*/g, "[^\\/]*");
        return Q + G
      }],
      [/\\\\\\(?=[$.|*+(){^])/g, () => ce1],
      [/\\\\/g, () => ce1],
      [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (A, Q, B, G, Z) => Q === ce1 ? `\\[${B}${M65(G)}${Z}` : Z === "]" ? G.length % 2 === 0 ? `[${L65(B)}${G}]` : "[]" : "[]"],
      [/(?:[^*])$/, (A) => /\/$/.test(A) ? `${A}$` : `${A}(?=$|\\/$)`]
    ],
    R65 = /(^|\\\/)?\\\*$/,
    SLA = "regex",
    CB1 = "checkRegex",
    q92 = "_",
    T65 = {
      [SLA](A, Q) {
        return `${Q?`${Q}[^/]+`:"[^/]*"}(?=$|\\/$)`
      },
      [CB1](A, Q) {
        return `${Q?`${Q}[^/]*`:"[^/]*"}(?=$|\\/$)`
      }
    },
    P65 = (A) => O65.reduce((Q, [B, G]) => Q.replace(B, G.bind(A)), A),
    EB1 = (A) => typeof A === "string",
    j65 = (A) => A && EB1(A) && !C65.test(A) && !E65.test(A) && A.indexOf("#") !== 0,
    S65 = (A) => A.split($65).filter(Boolean);
  class R92 {
    constructor(A, Q, B, G, Z, I) {
      this.pattern = A, this.mark = Q, this.negative = Z, xIA(this, "body", B), xIA(this, "ignoreCase", G), xIA(this, "regexPrefix", I)
    }
    get regex() {
      let A = q92 + SLA;
      if (this[A]) return this[A];
      return this._make(SLA, A)
    }
    get checkRegex() {
      let A = q92 + CB1;
      if (this[A]) return this[A];
      return this._make(CB1, A)
    }
    _make(A, Q) {
      let B = this.regexPrefix.replace(R65, T65[A]),
        G = this.ignoreCase ? new RegExp(B, "i") : new RegExp(B);
      return xIA(this, Q, G)
    }
  }
  var _65 = ({
    pattern: A,
    mark: Q
  }, B) => {
    let G = !1,
      Z = A;
    if (Z.indexOf("!") === 0) G = !0, Z = Z.substr(1);
    Z = Z.replace(z65, "!").replace(U65, "#");
    let I = P65(Z);
    return new R92(A, Q, Z, B, G, I)
  };
  class T92 {
    constructor(A) {
      this._ignoreCase = A, this._rules = []
    }
    _add(A) {
      if (A && A[M92]) {
        this._rules = this._rules.concat(A._rules._rules), this._added = !0;
        return
      }
      if (EB1(A)) A = {
        pattern: A
      };
      if (j65(A.pattern)) {
        let Q = _65(A, this._ignoreCase);
        this._added = !0, this._rules.push(Q)
      }
    }
    add(A) {
      return this._added = !1, N92(EB1(A) ? S65(A) : A).forEach(this._add, this), this._added
    }
    test(A, Q, B) {
      let G = !1,
        Z = !1,
        I;
      this._rules.forEach((J) => {
        let {
          negative: W
        } = J;
        if (Z === W && G !== Z || W && !G && !Z && !Q) return;
        if (!J[B].test(A)) return;
        G = !W, Z = W, I = W ? H65 : J
      });
      let Y = {
        ignored: G,
        unignored: Z
      };
      if (I) Y.rule = I;
      return Y
    }
  }
  var k65 = (A, Q) => {
      throw new Q(A)
    },
    Fh = (A, Q, B) => {
      if (!EB1(A)) return B(`path must be a string, but got \`${Q}\``, TypeError);
      if (!A) return B("path must not be empty", TypeError);
      if (Fh.isNotRelative(A)) return B(`path should be a \`path.relative()\`d string, but got "${Q}"`, RangeError);
      return !0
    },
    P92 = (A) => w65.test(A);
  Fh.isNotRelative = P92;
  Fh.convert = (A) => A;
  class j92 {
    constructor({
      ignorecase: A = !0,
      ignoreCase: Q = A,
      allowRelativePaths: B = !1
    } = {}) {
      xIA(this, M92, !0), this._rules = new T92(Q), this._strictPathCheck = !B, this._initCache()
    }
    _initCache() {
      this._ignoreCache = Object.create(null), this._testCache = Object.create(null)
    }
    add(A) {
      if (this._rules.add(A)) this._initCache();
      return this
    }
    addPattern(A) {
      return this.add(A)
    }
    _test(A, Q, B, G) {
      let Z = A && Fh.convert(A);
      return Fh(Z, A, this._strictPathCheck ? k65 : O92), this._t(Z, Q, B, G)
    }
    checkIgnore(A) {
      if (!q65.test(A)) return this.test(A);
      let Q = A.split(yIA).filter(Boolean);
      if (Q.pop(), Q.length) {
        let B = this._t(Q.join(yIA) + yIA, this._testCache, !0, Q);
        if (B.ignored) return B
      }
      return this._rules.test(A, !1, CB1)
    }
    _t(A, Q, B, G) {
      if (A in Q) return Q[A];
      if (!G) G = A.split(yIA).filter(Boolean);
      if (G.pop(), !G.length) return Q[A] = this._rules.test(A, B, SLA);
      let Z = this._t(G.join(yIA) + yIA, Q, B, G);
      return Q[A] = Z.ignored ? Z : this._rules.test(A, B, SLA)
    }
    ignores(A) {
      return this._test(A, this._ignoreCache, !1).ignored
    }
    createFilter() {
      return (A) => !this.ignores(A)
    }
    filter(A) {
      return N92(A).filter(this.createFilter())
    }
    test(A) {
      return this._test(A, this._testCache, !0)
    }
  }
  var le1 = (A) => new j92(A),
    y65 = (A) => Fh(A && Fh.convert(A), A, O92),
    S92 = () => {
      let A = (B) => /^\\\\\?\\/.test(B) || /["<>|\u0000-\u001F]+/u.test(B) ? B : B.replace(/\\/g, "/");
      Fh.convert = A;
      let Q = /^[a-z]:\//i;
      Fh.isNotRelative = (B) => Q.test(B) || P92(B)
    };
  if (typeof process < "u" && process.platform === "win32") S92();
  zB1.exports = le1;
  le1.default = le1;
  zB1.exports.isPathValid = y65;
  xIA(zB1.exports, Symbol.for("setupWindows"), S92)
})
// @from(Start 9029199, End 9029202)
x65
// @from(Start 9029208, End 9029247)
ie1 = L(() => {
  x65 = BA(UB1(), 1)
})
// @from(Start 9029253, End 9029880)
dU = z((v65) => {
  v65.fromCallback = function(A) {
    return Object.defineProperty(function(...Q) {
      if (typeof Q[Q.length - 1] === "function") A.apply(this, Q);
      else return new Promise((B, G) => {
        Q.push((Z, I) => Z != null ? G(Z) : B(I)), A.apply(this, Q)
      })
    }, "name", {
      value: A.name
    })
  };
  v65.fromPromise = function(A) {
    return Object.defineProperty(function(...Q) {
      let B = Q[Q.length - 1];
      if (typeof B !== "function") return A.apply(this, Q);
      else Q.pop(), A.apply(this, Q).then((G) => B(null, G), B)
    }, "name", {
      value: A.name
    })
  }
})
// @from(Start 9029886, End 9031806)
eAA = z((ne1) => {
  var _92 = dU().fromCallback,
    cU = sK(),
    h65 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
      return typeof cU[A] === "function"
    });
  Object.assign(ne1, cU);
  h65.forEach((A) => {
    ne1[A] = _92(cU[A])
  });
  ne1.exists = function(A, Q) {
    if (typeof Q === "function") return cU.exists(A, Q);
    return new Promise((B) => {
      return cU.exists(A, B)
    })
  };
  ne1.read = function(A, Q, B, G, Z, I) {
    if (typeof I === "function") return cU.read(A, Q, B, G, Z, I);
    return new Promise((Y, J) => {
      cU.read(A, Q, B, G, Z, (W, X, V) => {
        if (W) return J(W);
        Y({
          bytesRead: X,
          buffer: V
        })
      })
    })
  };
  ne1.write = function(A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return cU.write(A, Q, ...B);
    return new Promise((G, Z) => {
      cU.write(A, Q, ...B, (I, Y, J) => {
        if (I) return Z(I);
        G({
          bytesWritten: Y,
          buffer: J
        })
      })
    })
  };
  if (typeof cU.writev === "function") ne1.writev = function(A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return cU.writev(A, Q, ...B);
    return new Promise((G, Z) => {
      cU.writev(A, Q, ...B, (I, Y, J) => {
        if (I) return Z(I);
        G({
          bytesWritten: Y,
          buffers: J
        })
      })
    })
  };
  if (typeof cU.realpath.native === "function") ne1.realpath.native = _92(cU.realpath.native);
  else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Start 9031812, End 9032116)
y92 = z((c65, k92) => {
  var d65 = UA("path");
  c65.checkPath = function(Q) {
    if (process.platform === "win32") {
      if (/[<>:"|?*]/.test(Q.replace(d65.parse(Q).root, ""))) {
        let G = Error(`Path contains invalid characters: ${Q}`);
        throw G.code = "EINVAL", G
      }
    }
  }
})
// @from(Start 9032122, End 9032617)
f92 = z((l65, ae1) => {
  var x92 = eAA(),
    {
      checkPath: v92
    } = y92(),
    b92 = (A) => {
      let Q = {
        mode: 511
      };
      if (typeof A === "number") return A;
      return {
        ...Q,
        ...A
      }.mode
    };
  l65.makeDir = async (A, Q) => {
    return v92(A), x92.mkdir(A, {
      mode: b92(Q),
      recursive: !0
    })
  };
  l65.makeDirSync = (A, Q) => {
    return v92(A), x92.mkdirSync(A, {
      mode: b92(Q),
      recursive: !0
    })
  }
})
// @from(Start 9032623, End 9032903)
AP = z((IPG, h92) => {
  var a65 = dU().fromPromise,
    {
      makeDir: s65,
      makeDirSync: se1
    } = f92(),
    re1 = a65(s65);
  h92.exports = {
    mkdirs: re1,
    mkdirsSync: se1,
    mkdirp: re1,
    mkdirpSync: se1,
    ensureDir: re1,
    ensureDirSync: se1
  }
})
// @from(Start 9032909, End 9033145)
sl = z((YPG, u92) => {
  var r65 = dU().fromPromise,
    g92 = eAA();

  function o65(A) {
    return g92.access(A).then(() => !0).catch(() => !1)
  }
  u92.exports = {
    pathExists: r65(o65),
    pathExistsSync: g92.existsSync
  }
})
// @from(Start 9033151, End 9033600)
oe1 = z((JPG, m92) => {
  var vIA = sK();

  function t65(A, Q, B, G) {
    vIA.open(A, "r+", (Z, I) => {
      if (Z) return G(Z);
      vIA.futimes(I, Q, B, (Y) => {
        vIA.close(I, (J) => {
          if (G) G(Y || J)
        })
      })
    })
  }

  function e65(A, Q, B) {
    let G = vIA.openSync(A, "r+");
    return vIA.futimesSync(G, Q, B), vIA.closeSync(G)
  }
  m92.exports = {
    utimesMillis: t65,
    utimesMillisSync: e65
  }
})
// @from(Start 9033606, End 9037562)
A1A = z((WPG, p92) => {
  var bIA = eAA(),
    sF = UA("path"),
    A55 = UA("util");

  function Q55(A, Q, B) {
    let G = B.dereference ? (Z) => bIA.stat(Z, {
      bigint: !0
    }) : (Z) => bIA.lstat(Z, {
      bigint: !0
    });
    return Promise.all([G(A), G(Q).catch((Z) => {
      if (Z.code === "ENOENT") return null;
      throw Z
    })]).then(([Z, I]) => ({
      srcStat: Z,
      destStat: I
    }))
  }

  function B55(A, Q, B) {
    let G, Z = B.dereference ? (Y) => bIA.statSync(Y, {
        bigint: !0
      }) : (Y) => bIA.lstatSync(Y, {
        bigint: !0
      }),
      I = Z(A);
    try {
      G = Z(Q)
    } catch (Y) {
      if (Y.code === "ENOENT") return {
        srcStat: I,
        destStat: null
      };
      throw Y
    }
    return {
      srcStat: I,
      destStat: G
    }
  }

  function G55(A, Q, B, G, Z) {
    A55.callbackify(Q55)(A, Q, G, (I, Y) => {
      if (I) return Z(I);
      let {
        srcStat: J,
        destStat: W
      } = Y;
      if (W) {
        if (_LA(J, W)) {
          let X = sF.basename(A),
            V = sF.basename(Q);
          if (B === "move" && X !== V && X.toLowerCase() === V.toLowerCase()) return Z(null, {
            srcStat: J,
            destStat: W,
            isChangingCase: !0
          });
          return Z(Error("Source and destination must not be the same."))
        }
        if (J.isDirectory() && !W.isDirectory()) return Z(Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`));
        if (!J.isDirectory() && W.isDirectory()) return Z(Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`))
      }
      if (J.isDirectory() && te1(A, Q)) return Z(Error($B1(A, Q, B)));
      return Z(null, {
        srcStat: J,
        destStat: W
      })
    })
  }

  function Z55(A, Q, B, G) {
    let {
      srcStat: Z,
      destStat: I
    } = B55(A, Q, G);
    if (I) {
      if (_LA(Z, I)) {
        let Y = sF.basename(A),
          J = sF.basename(Q);
        if (B === "move" && Y !== J && Y.toLowerCase() === J.toLowerCase()) return {
          srcStat: Z,
          destStat: I,
          isChangingCase: !0
        };
        throw Error("Source and destination must not be the same.")
      }
      if (Z.isDirectory() && !I.isDirectory()) throw Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`);
      if (!Z.isDirectory() && I.isDirectory()) throw Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`)
    }
    if (Z.isDirectory() && te1(A, Q)) throw Error($B1(A, Q, B));
    return {
      srcStat: Z,
      destStat: I
    }
  }

  function d92(A, Q, B, G, Z) {
    let I = sF.resolve(sF.dirname(A)),
      Y = sF.resolve(sF.dirname(B));
    if (Y === I || Y === sF.parse(Y).root) return Z();
    bIA.stat(Y, {
      bigint: !0
    }, (J, W) => {
      if (J) {
        if (J.code === "ENOENT") return Z();
        return Z(J)
      }
      if (_LA(Q, W)) return Z(Error($B1(A, B, G)));
      return d92(A, Q, Y, G, Z)
    })
  }

  function c92(A, Q, B, G) {
    let Z = sF.resolve(sF.dirname(A)),
      I = sF.resolve(sF.dirname(B));
    if (I === Z || I === sF.parse(I).root) return;
    let Y;
    try {
      Y = bIA.statSync(I, {
        bigint: !0
      })
    } catch (J) {
      if (J.code === "ENOENT") return;
      throw J
    }
    if (_LA(Q, Y)) throw Error($B1(A, B, G));
    return c92(A, Q, I, G)
  }

  function _LA(A, Q) {
    return Q.ino && Q.dev && Q.ino === A.ino && Q.dev === A.dev
  }

  function te1(A, Q) {
    let B = sF.resolve(A).split(sF.sep).filter((Z) => Z),
      G = sF.resolve(Q).split(sF.sep).filter((Z) => Z);
    return B.reduce((Z, I, Y) => Z && G[Y] === I, !0)
  }

  function $B1(A, Q, B) {
    return `Cannot ${B} '${A}' to a subdirectory of itself, '${Q}'.`
  }
  p92.exports = {
    checkPaths: G55,
    checkPathsSync: Z55,
    checkParentPaths: d92,
    checkParentPathsSync: c92,
    isSrcSubdir: te1,
    areIdentical: _LA
  }
})