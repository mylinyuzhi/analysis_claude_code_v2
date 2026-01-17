# Sandbox Tool Integration (2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isBashSandboxed` (KEA) - Determine if command runs in sandbox
- `isExcludedCommand` (ya5) - Check if command is excluded from sandbox
- `getSandboxRestrictionsSummary` (Ct8) - Generate system prompt guidance
- `cleanSandboxViolations` (Vb5) - Strip sandbox tags from output
- `stripSandboxTags` (D71) - Remove violation XML tags

---

## 1. Bash Tool Integration

The Bash tool is the primary consumer of the sandbox system. Every shell command execution goes through the sandbox decision logic.

### 1.1 isBashSandboxed Decision Function

```javascript
// ============================================
// isBashSandboxed - Determine if command runs in sandbox
// Location: chunks.124.mjs:1217-1223
// ============================================

// ORIGINAL (for source lookup):
function KEA(A) {
  if (!XB.isSandboxingEnabled()) return !1;
  if (A.dangerouslyDisableSandbox && XB.areUnsandboxedCommandsAllowed()) return !1;
  if (!A.command) return !1;
  if (ya5(A.command)) return !1;
  return !0
}

// READABLE (for understanding):
function isBashSandboxed(toolInput) {
  // Gate 1: Is sandboxing enabled on this platform?
  if (!sandboxManager.isSandboxingEnabled()) {
    return false;
  }

  // Gate 2: Is dangerouslyDisableSandbox set AND allowed by policy?
  if (toolInput.dangerouslyDisableSandbox && sandboxManager.areUnsandboxedCommandsAllowed()) {
    return false;
  }

  // Gate 3: Is there a command to sandbox?
  if (!toolInput.command) {
    return false;
  }

  // Gate 4: Is command in the excluded commands list?
  if (isExcludedCommand(toolInput.command)) {
    return false;
  }

  // Default: Run in sandbox
  return true;
}

// Mapping: KEA->isBashSandboxed, A->toolInput, XB->sandboxManager, ya5->isExcludedCommand
```

**Decision Flow Diagram:**

```
                    +------------------+
                    | isBashSandboxed  |
                    |    (toolInput)   |
                    +--------+---------+
                             |
                             v
              +-----------------------------+
              | isSandboxingEnabled()       |
              | == false?                   |
              +-------------+---------------+
                            |
              YES           |           NO
               +------------+------------+
               |                         |
               v                         v
        RETURN false          +----------------------------+
        (no sandbox)          | dangerouslyDisableSandbox  |
                              | == true AND                |
                              | areUnsandboxedCommandsAllowed() |
                              +-------------+--------------+
                                            |
                              YES           |           NO
                               +------------+------------+
                               |                         |
                               v                         v
                        RETURN false          +-------------------+
                        (bypass allowed)      | command is empty? |
                                              +--------+----------+
                                                       |
                                         YES           |           NO
                                          +------------+------------+
                                          |                         |
                                          v                         v
                                   RETURN false          +-------------------+
                                                         | isExcludedCommand |
                                                         | (command)?        |
                                                         +--------+----------+
                                                                  |
                                                    YES           |           NO
                                                     +------------+------------+
                                                     |                         |
                                                     v                         v
                                              RETURN false              RETURN true
                                              (excluded)                (sandbox!)
```

### 1.2 Bash Tool Handler Integration

```javascript
// ============================================
// bashToolHandler - Bash tool entry point (simplified)
// Location: chunks.124.mjs:1258-1273
// ============================================

// ORIGINAL (for source lookup):
async function* ka5({
  input: A,
  abortController: Q,
  setAppState: B,
  setToolJSX: G,
  preventCwdChanges: Z
}) {
  let {
    command: Y,
    description: J,
    timeout: X,
    shellExecutable: I,
    run_in_background: D
  } = A, W = X || CKA(), K = "", V = "", F = 0, H = void 0,
      E = !ZV1 && xa5(Y),
      z = await e51(Y, Q.signal, W, I, (x, b, S) => {
        V = x, K = b, F = S
      }, Z, KEA(A), E),  // <-- KEA(A) determines sandboxing
      $ = z.result;
  // ... execution continues
}

// READABLE (for understanding):
async function* bashToolHandler({
  input: toolInput,
  abortController: abortSignal,
  setAppState,
  setToolJSX,
  preventCwdChanges
}) {
  const {
    command,
    description,
    timeout,
    shellExecutable,
    run_in_background: backgroundMode
  } = toolInput;

  const effectiveTimeout = timeout || getDefaultTimeout();
  const isBackgroundCommand = !isReplMode && isLongRunningCommand(command);

  // Determine if command should be sandboxed
  const shouldSandbox = isBashSandboxed(toolInput);

  // Prepare shell execution with sandbox decision
  const shellContext = await prepareShellExecution(
    command,
    abortSignal.signal,
    effectiveTimeout,
    shellExecutable,
    undefined,      // progress callback
    preventCwdChanges,
    shouldSandbox,  // <-- Passed to shell preparation
    isBackgroundCommand
  );

  const result = shellContext.result;
  // ... execution continues
}

// Mapping: ka5->bashToolHandler, A->toolInput, KEA(A)->isBashSandboxed(toolInput)
```

### 1.3 dangerouslyDisableSandbox Parameter

The `dangerouslyDisableSandbox` parameter allows bypassing the sandbox when policy permits:

**Schema Definition:**
```javascript
// Tool parameter schema (chunks.90.mjs)
dangerouslyDisableSandbox: z.boolean().optional().describe(
  "Set this to true to dangerously override sandbox mode and run commands without sandboxing."
)
```

**Policy Control:**
```javascript
// Configuration schema
allowUnsandboxedCommands: z.boolean().optional().describe(
  "Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. " +
  "When false, the dangerouslyDisableSandbox parameter is completely ignored and all " +
  "commands must run sandboxed. Default: true."
)
```

**Bypass Logic:**
```
IF (dangerouslyDisableSandbox == true) AND (areUnsandboxedCommandsAllowed() == true):
  THEN: Command runs unsandboxed
  ELSE: Command always runs sandboxed (parameter ignored)
```

### 1.4 Excluded Commands

Commands can be excluded from sandboxing via the excluded commands list:

```javascript
// isExcludedCommand checks if command prefix matches any exclusion
function isExcludedCommand(command) {
  const excludedCommands = sandboxManager.getExcludedCommands();
  const trimmedCommand = command.trim();

  for (const pattern of excludedCommands) {
    const classification = classifyPermissionPattern(pattern);

    switch (classification.type) {
      case "exact":
        if (trimmedCommand === classification.command) return true;
        break;
      case "prefix":
        if (trimmedCommand === classification.prefix ||
            trimmedCommand.startsWith(classification.prefix + " ")) return true;
        break;
      case "wildcard":
        if (matchWildcardPattern(classification.pattern, trimmedCommand)) return true;
        break;
    }
  }
  return false;
}
```

---

## 2. System Reminder Integration

The sandbox system generates guidance in system prompts to help Claude understand sandbox restrictions.

### 2.1 getSandboxRestrictionsSummary Function

```javascript
// ============================================
// getSandboxRestrictionsSummary - Generate system prompt sandbox guidance
// Location: chunks.85.mjs:1479-1543
// ============================================

// ORIGINAL (for source lookup):
function Ct8() {
  if (!XB.isSandboxingEnabled()) return "";
  let A = XB.getFsReadConfig(),
    Q = XB.getFsWriteConfig(),
    B = XB.getNetworkRestrictionConfig(),
    G = XB.getAllowUnixSockets(),
    Z = XB.getIgnoreViolations(),
    Y = XB.areUnsandboxedCommandsAllowed(),
    J = { read: A, write: Q },
    X = { ...B?.allowedHosts && { allowedHosts: B.allowedHosts },
          ...B?.deniedHosts && { deniedHosts: B.deniedHosts },
          ...G && { allowUnixSockets: G } },
    I = [];
  if (Object.keys(J).length > 0) I.push(`    - Filesystem: ${JSON.stringify(J,null,2)...}`);
  if (Object.keys(X).length > 0) I.push(`    - Network: ${JSON.stringify(X,null,2)...}`);
  if (Z) I.push(`    - Ignored violations: ${JSON.stringify(Z,null,2)...}`);
  let D = jJ() ? "    - EXCEPTION: `mcp-cli` commands must always be called with..." : "",
    W = Y ? /* allowUnsandboxedCommands=true prompt */ : /* strict mode prompt */;
  return `- Commands run in a sandbox by default with the following restrictions:
${I.join("\n")}
${W}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory...`
}

// READABLE (for understanding):
function getSandboxRestrictionsSummary() {
  // If sandbox is not enabled, return empty string
  if (!sandboxManager.isSandboxingEnabled()) {
    return "";
  }

  // Gather configuration
  const readConfig = sandboxManager.getFsReadConfig();
  const writeConfig = sandboxManager.getFsWriteConfig();
  const networkConfig = sandboxManager.getNetworkRestrictionConfig();
  const allowUnixSockets = sandboxManager.getAllowUnixSockets();
  const ignoreViolations = sandboxManager.getIgnoreViolations();
  const allowUnsandboxed = sandboxManager.areUnsandboxedCommandsAllowed();

  // Build filesystem section
  const fsConfig = { read: readConfig, write: writeConfig };

  // Build network section
  const netConfig = {
    ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
    ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
    ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
  };

  // Build restrictions list
  const restrictions = [];
  if (Object.keys(fsConfig).length > 0) {
    restrictions.push(`    - Filesystem: ${formatJSON(fsConfig)}`);
  }
  if (Object.keys(netConfig).length > 0) {
    restrictions.push(`    - Network: ${formatJSON(netConfig)}`);
  }
  if (ignoreViolations) {
    restrictions.push(`    - Ignored violations: ${formatJSON(ignoreViolations)}`);
  }

  // MCP-CLI exception
  const mcpCliException = isMcpCliAvailable()
    ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`...\n"
    : "";

  // Generate mode-specific prompt
  const modePrompt = allowUnsandboxed
    ? generateOpenModePrompt(mcpCliException)
    : generateStrictModePrompt();

  return `- Commands run in a sandbox by default with the following restrictions:
${restrictions.join("\n")}
${modePrompt}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead
    - Most programs that respect TMPDIR will automatically use \`/tmp/claude/\``;
}

// Mapping: Ct8->getSandboxRestrictionsSummary, XB->sandboxManager, jJ->isMcpCliAvailable
```

### 2.2 Two Prompt Variants

#### Open Mode (`allowUnsandboxedCommands=true`)

When policy allows unsandboxed commands:

```
- CRITICAL: Commands run in sandbox mode by default - do NOT set `dangerouslyDisableSandbox`
  - Even if you have recently run commands with `dangerouslyDisableSandbox: true`, you MUST NOT continue that pattern
  - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox - each command should run sandboxed by default
  - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`
  - Set `dangerouslyDisableSandbox: true` if:
    1. The user *explicitly* asks to bypass sandbox, OR
    2. A command just failed and you see evidence of sandbox restrictions causing the failure
  - When analyzing failures:
    - Commands can fail for many reasons unrelated to the sandbox
    - Evidence of sandbox-caused failures includes:
      - "Operation not permitted" errors for file/network operations
      - Access denied to specific paths outside allowed directories
      - Network connection failures to non-whitelisted hosts
      - Unix socket connection errors
    - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
  - When you see evidence of sandbox-caused failure:
    - IMMEDIATELY retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
    - Briefly explain what sandbox restriction likely caused the failure
    - Mention: "Use `/sandbox` to manage restrictions"
    - This will prompt the user for permission
  - Example of normal usage: { "command": "ls", "description": "List files" }
  - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
  - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist
```

**Key insights:**
1. **Default to sandbox** - Claude should NOT preemptively bypass
2. **Learn from failures** - Only bypass when seeing clear sandbox restriction evidence
3. **Immediate retry** - Don't ask permission, just retry with bypass
4. **Protect sensitive paths** - Never suggest adding credential files to allowlist

#### Strict Mode (`allowUnsandboxedCommands=false`)

When policy enforces sandboxing:

```
- CRITICAL: All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy
  - Commands cannot run outside the sandbox under any circumstances
  - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead
```

**Key insights:**
1. **No bypass possible** - Policy completely disables the parameter
2. **Adjust settings** - Guide user to modify sandbox configuration instead

### 2.3 MCP-CLI Exception

```javascript
let mcpCliException = isMcpCliAvailable()
  ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true` as they do not work properly in sandboxed mode\n"
  : "";
```

**Why MCP-CLI is exempted:**
- MCP-CLI requires network access to communicate with MCP servers
- MCP servers may need filesystem access outside sandbox restrictions
- MCP protocol communication doesn't work well through proxy filtering

---

## 3. Plan Mode Restrictions

In plan mode, the sandbox has special restrictions that prevent any code execution.

### 3.1 Read-Only Mode

Plan mode is a **read-only exploration phase** where:
- No tool execution is allowed
- Bash commands cannot run
- File modifications are blocked
- Only the plan file can be written

### 3.2 Why Sandbox Bypass is Disabled

In plan mode:
1. `dangerouslyDisableSandbox` has no effect
2. All Bash tool calls are blocked at the tool execution layer
3. The sandbox decision function (`KEA`) is never reached

**Reason:** Plan mode exists to understand the codebase before making changes. Allowing execution would defeat the purpose and introduce security risks during the exploration phase.

### 3.3 Plan Mode System Prompt

The plan mode system prompt includes:

```
Plan mode is active. The user indicated that they do not want you to execute yet --
you MUST NOT make any edits (with the exception of the plan file mentioned below),
run any non-readonly tools (including changing configs or making commits), or
otherwise make any changes to the system.
```

---

## 4. Permission System Integration

### 4.1 Permission Mode Affects Sandbox

| Permission Mode | `allowUnsandboxedCommands` | Effect |
|-----------------|---------------------------|--------|
| `"open"` | `true` | dangerouslyDisableSandbox can be used |
| `"prompt"` | Per policy | Subject to policy restrictions |
| `"none"` | N/A | Tools disabled entirely |

```javascript
// When setting permission mode to "open":
allowUnsandboxedCommands: permissionMode === "open"

// Result:
// "open" -> dangerouslyDisableSandbox can be used
// "prompt" -> dangerouslyDisableSandbox still subject to policy restrictions
```

### 4.2 Integration with Wildcard Permissions

The sandbox respects the wildcard permission system documented in [wildcard_permissions.md](./wildcard_permissions.md):

- Commands matching allowed patterns still run sandboxed
- Permission approval doesn't bypass sandbox restrictions
- Sandbox is orthogonal to command permission

---

## 5. Output Processing

### 5.1 cleanSandboxViolations Function

```javascript
// ============================================
// cleanSandboxViolations - Strip sandbox violation tags from stderr
// Location: chunks.112.mjs:44-51
// ============================================

// ORIGINAL (for source lookup):
function Vb5(A) {
  if (!A.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
    cleanedStderr: A
  };
  return {
    cleanedStderr: D71(A).trim()
  }
}

// READABLE (for understanding):
function cleanSandboxViolations(stderr) {
  // Check if stderr contains sandbox violation tags
  if (!stderr.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) {
    return { cleanedStderr: stderr };
  }

  // Strip the tags for user display
  return {
    cleanedStderr: stripSandboxTags(stderr).trim()
  };
}

// Mapping: Vb5->cleanSandboxViolations, A->stderr, D71->stripSandboxTags
```

### 5.2 stripSandboxTags Function

```javascript
// ============================================
// stripSandboxTags - Remove sandbox violation XML tags
// Location: chunks.85.mjs:3211-3213
// ============================================

// ORIGINAL (for source lookup):
function D71(A) {
  return A.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}

// READABLE (for understanding):
function stripSandboxTags(output) {
  // Remove all <sandbox_violations>...</sandbox_violations> tags
  return output.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "");
}

// Mapping: D71->stripSandboxTags, A->output
```

### 5.3 Violation Annotation

When sandbox violations occur, they are annotated in stderr:

```javascript
// Violation annotation format
function annotateStderrWithSandboxFailures(command, stderr) {
  if (!sandboxConfig) return stderr;

  // Get violations for this specific command
  let violations = violationStore.getViolationsForCommand(command);
  if (violations.length === 0) return stderr;

  // Append violations to stderr in XML tags
  let result = stderr;
  result += "\n<sandbox_violations>\n";
  for (let violation of violations) {
    result += violation.line + "\n";
  }
  result += "</sandbox_violations>";
  return result;
}
```

**Flow:**
1. Command executes in sandbox
2. macOS log monitor detects violations
3. Violations are stored with encoded command tag
4. When stderr is processed, matching violations are appended
5. Before displaying to user, violation tags are stripped

---

## 6. User-Facing Commands

### 6.1 /sandbox Slash Command

The `/sandbox` command allows users to manage sandbox settings:

```
/sandbox          - Show current sandbox status and restrictions
/sandbox enable   - Enable sandbox mode
/sandbox disable  - Disable sandbox mode
/sandbox allow <path>  - Add path to write allowlist
/sandbox deny <path>   - Add path to denylist
```

### 6.2 Sandbox Settings UI

The settings UI includes:
- Sandbox enable/disable toggle
- Filesystem restrictions editor
- Network restrictions editor
- Violation history viewer

---

## 7. Environment Variables

| Variable | Purpose | Set By |
|----------|---------|--------|
| `CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK` | Disable security checks | User (testing only) |
| `SANDBOX_RUNTIME` | Marker indicating sandbox mode | Sandbox wrapper |
| `TMPDIR` | Temporary directory | Set to `/tmp/claude` in sandbox |

---

## 8. Integration Flow Diagram

```
+------------------+
| User Request     |
| (run command)    |
+--------+---------+
         |
         v
+------------------+
| Bash Tool        |
| (ka5)            |
+--------+---------+
         |
         v
+------------------+
| isBashSandboxed  |
| (KEA)            |
+--------+---------+
         |
    YES  |  NO
    +----+----+
    |         |
    v         v
+--------+  +--------+
|Sandbox |  |Direct  |
|Wrapper |  |Execute |
|(WZ8)   |  |        |
+---+----+  +---+----+
    |           |
    v           v
+--------+  +--------+
|Platform|  |Shell   |
|Specific|  |Exec    |
|Sandbox |  |        |
+---+----+  +---+----+
    |           |
    +-----+-----+
          |
          v
    +-----+-----+
    | annotate  |
    | Stderr    |
    +-----+-----+
          |
          v
    +-----+-----+
    | clean     |
    | Sandbox   |
    | Tags      |
    +-----+-----+
          |
          v
    +-----+-----+
    | Return    |
    | to User   |
    +-----------+
```

---

## 9. Subagent Integration (Task Tool)

When Claude spawns subagents via the Task tool, sandbox settings are inherited through the execution context.

### 9.1 Context Inheritance Pattern

```javascript
// ============================================
// Task Tool - Subagent Context Propagation
// Location: chunks.113.mjs:90-160
// ============================================

// ORIGINAL (for source lookup):
async call({
  prompt: A,
  subagent_type: Q,
  description: B,
  model: G,
  resume: Z,
  run_in_background: Y,
  max_turns: J
}, X, I, D, W) {
  let K = Date.now(),
    V = await X.getAppState(),
    F = V.toolPermissionContext.mode,
    H = X.options.agentDefinitions.activeAgents,
    E = mz0(H, V.toolPermissionContext, f3);
  // ... validation ...
  let x = {
    agentDefinition: z,
    promptMessages: O ? [...O, ..._] : _,
    toolUseContext: X,  // <- Parent context passed directly
    canUseTool: I,
    forkContextMessages: L,
    isAsync: Y === !0 && !nkA,
    querySource: X.options.querySource ?? TP2(z.agentType, p_(z)),
    model: G,
    maxTurns: J,
    override: M ? { systemPrompt: M } : void 0
  };
  for await (let p of $f({ ...x })) { ... }
}

// READABLE (for understanding):
async call({
  prompt,
  subagent_type,
  description,
  model,
  resume,
  run_in_background,
  max_turns
}, toolUseContext, canUseTool, messageDetails, progressCallback) {
  let appState = await toolUseContext.getAppState();
  let sandboxMode = appState.toolPermissionContext.mode;  // Inherited from parent

  let subagentExecutionContext = {
    agentDefinition: selectedAgent,
    promptMessages,
    toolUseContext,  // CRITICAL: Full parent context passed (includes sandbox settings)
    canUseTool,
    isAsync: run_in_background && !backgroundTasksDisabled,
    model,
    maxTurns
  };

  // Execute subagent - inherits sandbox configuration
  for await (let message of agentLoop(subagentExecutionContext)) { ... }
}

// Mapping: X→toolUseContext, F→sandboxMode, V→appState
```

### 9.2 Inheritance Rules

| Setting | Inherited? | Behavior |
|---------|------------|----------|
| `sandbox.enabled` | ✅ YES | Subagent inherits sandbox on/off state |
| `allowUnsandboxedCommands` | ✅ YES | Policy restrictions inherited |
| `autoAllowBashIfSandboxed` | ✅ YES | Auto-approval rules inherited |
| `dangerouslyDisableSandbox` | ❌ NO | Must be explicitly set per command |
| `excludedCommands` | ✅ YES | Command exclusion list inherited |

### 9.3 Key Insight: dangerouslyDisableSandbox NOT Inherited

```
Parent Agent
  ├─ toolUseContext (contains toolPermissionContext with sandbox mode)
  └─ Task Tool (Skill Tool)
      ├─ Reads parent's toolPermissionContext.mode
      ├─ Passes ENTIRE toolUseContext to subagent
      └─ Subagent inherits sandbox settings
          └─ When subagent executes Bash tool:
              ├─ Checks toolPermissionContext.mode from parent
              ├─ Honors dangerouslyDisableSandbox ONLY if set in current command
              └─ NOT inherited from parent's previous commands
```

**Why this design:**
- Prevents accidental bypass propagation
- Each command must explicitly request sandbox bypass
- Security decisions are localized, not global

---

## 10. Main Agent Loop Integration

### 10.1 Sandbox Initialization Points

Sandbox is initialized at application startup:

```javascript
// ============================================
// initializeAgentSession - CLI entry point
// Location: chunks.155.mjs:3094-3103
// ============================================

// ORIGINAL (for source lookup):
async function hw9(A, Q, B, G, Z, Y, J, X) {
  if (eO0(), await rVA()) await Y79();
  if (XB.isSandboxingEnabled()) try {
    await XB.initialize()
  } catch (L) {
    process.stderr.write(`\n❌ Sandbox Error: ${L instanceof Error?L.message:String(L)}\n`), f6(1, "other");
    return
  }
  // ... continue with agent initialization
}

// READABLE (for understanding):
async function initializeAgentSession(prompt, configLoader, ...) {
  // Check if sandbox is enabled
  if (sandboxManager.isSandboxingEnabled()) {
    try {
      await sandboxManager.initialize();  // Initialize proxies, bridges, monitors
    } catch (error) {
      process.stderr.write(`\n❌ Sandbox Error: ${error.message}\n`);
      exitWithCode(1, "other");
      return;
    }
  }
  // ... continue with agent initialization
}

// Mapping: hw9→initializeAgentSession, XB→sandboxManager, f6→exitWithCode
```

### 10.2 Settings Subscription (Reactive Updates)

Sandbox configuration updates reactively when settings change:

```javascript
// ============================================
// sandboxStateManager - Settings subscription
// Location: chunks.55.mjs:1319-1442
// ============================================

// ORIGINAL (for source lookup):
async function KZ8(A) {
  if (Ca) return Ca;
  if (!o01()) return;
  let Q = jQ(), B = lr1(Q);
  return Ca = (async () => {
    try {
      await $X.initialize(B, A);
      ir1 = HC.subscribe(() => {
        let G = jQ(), Z = lr1(G);
        $X.updateConfig(Z);
        k("Sandbox configuration updated from settings change");
      });
    } catch (G) {
      Ca = void 0;
      k(`Failed to initialize sandbox: ${G instanceof Error?G.message:String(G)}`);
    }
  })(), Ca;
}

// READABLE (for understanding):
async function initializeSandboxIfNeeded(hostPatternResolver) {
  if (sandboxInitPromise) return sandboxInitPromise;  // Already initializing
  if (!isSandboxSupportedAndEnabled()) return;

  let settings = getSettings();
  let sandboxConfig = buildSandboxConfigFromSettings(settings);

  return sandboxInitPromise = (async () => {
    try {
      await sandboxCoreApi.initialize(sandboxConfig, hostPatternResolver);

      // Subscribe to settings changes for reactive updates
      settingsSubscription = settingsManager.subscribe(() => {
        let newSettings = getSettings();
        let newConfig = buildSandboxConfigFromSettings(newSettings);
        sandboxCoreApi.updateConfig(newConfig);  // Update mid-session!
        logDebug("Sandbox configuration updated from settings change");
      });
    } catch (error) {
      sandboxInitPromise = undefined;
      logDebug(`Failed to initialize sandbox: ${error.message}`);
    }
  })(), sandboxInitPromise;
}

// Mapping: KZ8→initializeSandboxIfNeeded, Ca→sandboxInitPromise, ir1→settingsSubscription
//          $X→sandboxCoreApi, HC→settingsManager
```

### 10.3 Per-Turn Shell Execution Flow

```javascript
// ============================================
// executeShellCommandWithSandbox - Shell execution in agent loop
// Location: chunks.85.mjs:2492-2584
// ============================================

// ORIGINAL (for source lookup):
async function e51(A, Q, B, G, Z, Y, J, X) {
  // ... shell command setup ...
  let M = $.join(" && ");
  if (J) {  // J = isSandboxed flag
    M = await XB.wrapWithSandbox(M, D, void 0, Q);  // Wrap command
    try {
      let b = vA();
      if (!b.existsSync(F)) b.mkdirSync(F);  // Ensure /tmp/claude exists
    } catch (b) {
      k(`Failed to create ${F} directory: ${b}`);
    }
  }
  let x = ["-c", ...j ? [] : ["-l"], M];
  let S = lt8(D, x, {
    env: {
      ...process.env,
      SHELL: D,
      CLAUDECODE: "1",
      ...J ? { TMPDIR: F, CLAUDE_CODE_TMPDIR: F } : {},  // Sandbox env vars
    },
    cwd: _,
    detached: !0
  });
  return r51(S, Q, I, Z, X);
}

// READABLE (for understanding):
async function executeShellCommandWithSandbox(command, abortSignal, timeout, shell, cwd, outputHandler, isSandboxed, execContext) {
  let fullCommand = commandParts.join(" && ");

  // SANDBOX WRAPPING POINT
  if (isSandboxed) {
    fullCommand = await sandboxManager.wrapWithSandbox(
      fullCommand,
      shell,
      undefined,
      abortSignal
    );

    // Ensure sandbox temp directory exists
    try {
      if (!fs.existsSync(sandboxTmpDir)) {
        fs.mkdirSync(sandboxTmpDir);
      }
    } catch (error) {
      logDebug(`Failed to create ${sandboxTmpDir}: ${error}`);
    }
  }

  // Execute with sandbox environment
  let childProcess = spawnShell(shell, ["-c", fullCommand], {
    env: {
      ...process.env,
      SHELL: shell,
      CLAUDECODE: "1",
      ...(isSandboxed ? {
        TMPDIR: sandboxTmpDir,  // Redirect temp files
        CLAUDE_CODE_TMPDIR: sandboxTmpDir
      } : {}),
    },
    cwd: currentDir,
    detached: true
  });

  return executeWithTimeout(childProcess, abortSignal, outputHandler, execContext);
}

// Mapping: e51→executeShellCommandWithSandbox, J→isSandboxed, XB→sandboxManager
//          M→fullCommand, lt8→spawnShell
```

### 10.4 Violation Tracking Across Turns

```javascript
// ============================================
// sandboxViolationNotificationBanner - UI violation tracking
// Location: chunks.151.mjs:1004-1030
// ============================================

// ORIGINAL (for source lookup):
function cW9() {
  let [A, Q] = O$A.useState(0), B = O$A.useRef(null);
  O$A.useEffect(() => {
    if (!XB.isSandboxingEnabled()) return;
    let Z = XB.getSandboxViolationStore();
    let Y = Z.getTotalCount();
    let J = Z.subscribe(() => {
      let X = Z.getTotalCount();
      let I = X - Y;
      if (I > 0) {
        Q(I);
        Y = X;
        if (B.current) clearTimeout(B.current);
        B.current = setTimeout(() => Q(0), 5000);
      }
    });
    return () => { if (J()) clearTimeout(B.current); };
  }, []);
  if (!XB.isSandboxingEnabled() || A === 0) return null;
  return displayViolationBadge(A);
}

// READABLE (for understanding):
function sandboxViolationNotificationBanner() {
  let [violationCount, setViolationCount] = useState(0);
  let timeoutRef = useRef(null);

  useEffect(() => {
    if (!sandboxManager.isSandboxingEnabled()) return;

    let violationStore = sandboxManager.getSandboxViolationStore();
    let baselineCount = violationStore.getTotalCount();

    // Subscribe to NEW violations during conversation turns
    let unsubscribe = violationStore.subscribe(() => {
      let currentTotal = violationStore.getTotalCount();
      let newViolations = currentTotal - baselineCount;

      if (newViolations > 0) {
        setViolationCount(newViolations);  // Show badge
        baselineCount = currentTotal;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setViolationCount(0), 5000);
      }
    });

    return () => { unsubscribe(); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  if (!sandboxManager.isSandboxingEnabled() || violationCount === 0) return null;
  return displayViolationBadge(violationCount);
}

// Mapping: cW9→sandboxViolationNotificationBanner, XB→sandboxManager, Z→violationStore
```

---

## 11. Session Restore Integration

### 11.1 Sandbox Violations NOT Persisted

**Critical finding:** Sandbox violations are session-scoped and NOT persisted between sessions.

```javascript
// ============================================
// ViolationStore - In-memory only
// Location: chunks.53.mjs:2675-2709
// ============================================

// ORIGINAL (for source lookup):
class nMA {
  constructor() {
    this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
  }
  addViolation(A) {
    if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize)
      this.violations = this.violations.slice(-this.maxSize);
    this.notifyListeners()
  }
  clear() {
    this.violations = [], this.notifyListeners()
  }
}

// READABLE (for understanding):
class ViolationStore {
  constructor() {
    this.violations = [];           // Fresh store each session (NOT persisted)
    this.totalCount = 0;
    this.maxSize = 100;             // Keep only last 100 violations
    this.listeners = new Set();
  }

  addViolation(violation) {
    this.violations.push(violation);
    this.totalCount++;
    if (this.violations.length > this.maxSize) {
      this.violations = this.violations.slice(-this.maxSize);
    }
    this.notifyListeners();
  }

  clear() {
    this.violations = [];
    this.notifyListeners();
  }
}

// Mapping: nMA→ViolationStore
```

### 11.2 Session Restore Flow

When a session is restored, sandbox is initialized fresh:

```javascript
// ============================================
// loadConversation - Session restore (no violation restore)
// Location: chunks.120.mjs:2608-2643
// ============================================

// ORIGINAL (for source lookup):
async function Zt(A, Q) {
  try {
    let B = null, G = null, Z;
    // ... load messages from session file ...
    if (B) {
      if (Gj(B)) B = await Vx(B);
      if (!Z) Z = xX(B);
      if (w71(B), Z) W71(B, lz(Z));
      EW1(B);  // Restore file history
      G = B.messages
    }
    G = dbA(G);
    let Y = await WU("resume", Z);
    return G.push(...Y), {
      messages: G,
      fileHistorySnapshots: B?.fileHistorySnapshots,
      attributionSnapshots: B?.attributionSnapshots,
      sessionId: Z
      // NOTE: NO sandbox violations restored here
    }
  } catch (B) { throw e(B), B }
}

// READABLE (for understanding):
async function loadConversation(sessionData, logsPath) {
  try {
    let messages = null, sessionId;
    // ... load messages from session file ...

    if (messages) {
      if (isCompressed(messages)) messages = await decompressMessages(messages);
      if (!sessionId) sessionId = getSessionIdFromMessages(messages);

      initializeTodoState(messages);     // Restore todo state
      restoreFileHistory(messages);      // Restore file history backups
      // NOTE: Sandbox violations are NOT restored
    }

    messages = deduplicateMessages(messages);
    let resumeMessages = await getResumeHookMessages("resume", sessionId);
    messages.push(...resumeMessages);

    return {
      messages: messages,
      fileHistorySnapshots: messages?.fileHistorySnapshots,
      attributionSnapshots: messages?.attributionSnapshots,
      sessionId: sessionId
      // No violation data included
    };
  } catch (error) { throw error; }
}

// Mapping: Zt→loadConversation, w71→initializeTodoState, EW1→restoreFileHistory
```

### 11.3 Sandbox Violation Lifecycle

| Phase | Behavior |
|-------|----------|
| **Session Start** | Violation store created fresh (empty) |
| **Sandbox Init** | macOS log monitor attached to empty store |
| **Tool Execution** | Violations added in real-time |
| **Stderr Output** | Current session violations appended to stderr |
| **Session Save** | Violations NOT included in session file |
| **Session Restore** | Violations NOT restored from previous session |

### 11.4 Why Violations Are Not Persisted

**Design rationale:**
1. **Relevance** - Violations are context-specific to the commands that caused them
2. **Performance** - No need to save/load potentially large violation logs
3. **Fresh start** - Each session gets clean monitoring state
4. **Privacy** - Violation logs may contain sensitive path information

---

## 12. Integration Summary Diagram

```
+-----------------------------------------------------------------------------------+
|                           Sandbox Integration Points                               |
+-----------------------------------------------------------------------------------+
|                                                                                    |
|  +-----------------+                                                               |
|  | App Startup     |                                                               |
|  | (chunks.155)    |                                                               |
|  +--------+--------+                                                               |
|           |                                                                        |
|           v                                                                        |
|  +--------+--------+     +------------------+                                      |
|  | XB.initialize() |---->| Initialize       |                                      |
|  |                 |     | - Proxies (HTTP) |                                      |
|  +-----------------+     | - Proxies (SOCKS)|                                      |
|                          | - Bridges (Linux)|                                      |
|                          | - Monitor (macOS)|                                      |
|                          +------------------+                                      |
|                                                                                    |
|  +---------------------------+                                                     |
|  | Agent Loop (per turn)     |                                                     |
|  |                           |                                                     |
|  |  +---------------------+  |     +------------------+                            |
|  |  | Bash Tool Call      |--|---->| isBashSandboxed  |                            |
|  |  | (chunks.124)        |  |     | (KEA)            |                            |
|  |  +---------------------+  |     +--------+---------+                            |
|  |                           |              |                                      |
|  |                           |    YES       |       NO                             |
|  |                           |    +---------+---------+                            |
|  |                           |    |                   |                            |
|  |                           |    v                   v                            |
|  |  +---------------------+  |  +--------+      +--------+                         |
|  |  | wrapWithSandbox     |<-|--|Sandbox |      |Direct  |                         |
|  |  | (chunks.85)         |  |  |Wrapper |      |Execute |                         |
|  |  +---------------------+  |  +--------+      +--------+                         |
|  |                           |                                                     |
|  +---------------------------+                                                     |
|                                                                                    |
|  +---------------------------+                                                     |
|  | Subagent (Task Tool)      |                                                     |
|  |                           |                                                     |
|  |  toolUseContext inherited |---> Sandbox mode inherited                          |
|  |  dangerouslyDisableSandbox|---> NOT inherited (per-command only)                |
|  |                           |                                                     |
|  +---------------------------+                                                     |
|                                                                                    |
|  +---------------------------+                                                     |
|  | Session Restore           |                                                     |
|  |                           |                                                     |
|  |  Messages restored        |---> YES                                             |
|  |  File history restored    |---> YES                                             |
|  |  Todo state restored      |---> YES                                             |
|  |  Sandbox violations       |---> NO (fresh store created)                        |
|  |                           |                                                     |
|  +---------------------------+                                                     |
|                                                                                    |
+-----------------------------------------------------------------------------------+
```

---

## See Also

- [overview.md](./overview.md) - System architecture overview
- [configuration.md](./configuration.md) - Configuration structure
- [wildcard_permissions.md](./wildcard_permissions.md) - Permission pattern matching
- [linux_implementation.md](./linux_implementation.md) - Linux platform details
- [macos_implementation.md](./macos_implementation.md) - macOS platform details
