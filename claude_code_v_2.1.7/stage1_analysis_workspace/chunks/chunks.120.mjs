
// @from(Ln 354406, Col 4)
cg2 = w(() => {
  j9();
  Cg2();
  Pg2();
  ms();
  oZ();
  V2();
  DQ();
  AY();
  v1();
  T1();
  ug2();
  Ol5 = m.strictObject({
    operation: m.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation to perform"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Ml5 = m.object({
    operation: m.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation that was performed"),
    result: m.string().describe("The formatted result of the LSP operation"),
    filePath: m.string().describe("The file path the operation was performed on"),
    resultCount: m.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
    fileCount: m.number().int().nonnegative().optional().describe("Number of files containing results")
  }), vU0 = {
    name: Sg2,
    maxResultSizeChars: 1e5,
    isLsp: !0,
    async description() {
      return xU0
    },
    userFacingName: vg2,
    isEnabled() {
      if (f6A().status === "failed") return !1;
      let Q = Rc();
      if (!Q) return !1;
      let B = Q.getAllServers();
      if (B.size === 0) return !1;
      return Array.from(B.values()).some((Z) => Z.state !== "error")
    },
    inputSchema: Ol5,
    outputSchema: Ml5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    getPath({
      filePath: A
    }) {
      return Y4(A)
    },
    async validateInput(A) {
      let Q = $g2.safeParse(A);
      if (!Q.success) return {
        result: !1,
        message: `Invalid input: ${Q.error.message}`,
        errorCode: 3
      };
      let B = vA(),
        G = Y4(A.filePath);
      if (!B.existsSync(G)) return {
        result: !1,
        message: `File does not exist: ${A.filePath}`,
        errorCode: 1
      };
      try {
        if (!B.statSync(G).isFile()) return {
          result: !1,
          message: `Path is not a file: ${A.filePath}`,
          errorCode: 2
        }
      } catch (Z) {
        let Y = Z instanceof Error ? Z : Error(String(Z));
        return e(Error(`Failed to access file stats for LSP operation on ${A.filePath}: ${Y.message}`)), {
          result: !1,
          message: `Cannot access file: ${A.filePath}. ${Y.message}`,
          errorCode: 4
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return Jr(vU0, A, B.toolPermissionContext)
    },
    async prompt() {
      return xU0
    },
    renderToolUseMessage: kg2,
    renderToolUseRejectedMessage: bg2,
    renderToolUseErrorMessage: fg2,
    renderToolUseProgressMessage: hg2,
    renderToolResultMessage: gg2,
    async call(A, Q) {
      let B = Y4(A.filePath),
        G = o1();
      if (f6A().status === "pending") await Ty2();
      let Y = Rc();
      if (!Y) return e(Error("LSP server manager not initialized when tool was called")), {
        data: {
          operation: A.operation,
          result: "LSP server manager not initialized. This may indicate a startup issue.",
          filePath: A.filePath
        }
      };
      let {
        method: J,
        params: X
      } = Rl5(A, B);
      try {
        if (!Y.isFileOpen(B)) {
          let F = await wl5(B, "utf-8");
          await Y.openFile(B, F)
        }
        let I = await Y.sendRequest(B, J, X);
        if (I === void 0) return k(`No LSP server available for file type ${yU0.extname(B)} for operation ${A.operation} on file ${A.filePath}`), {
          data: {
            operation: A.operation,
            result: `No LSP server available for file type: ${yU0.extname(B)}`,
            filePath: A.filePath
          }
        };
        if (A.operation === "incomingCalls" || A.operation === "outgoingCalls") {
          let F = I;
          if (!F || F.length === 0) return {
            data: {
              operation: A.operation,
              result: "No call hierarchy item found at this position",
              filePath: A.filePath,
              resultCount: 0,
              fileCount: 0
            }
          };
          let H = A.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
          if (I = await Y.sendRequest(B, H, {
              item: F[0]
            }), I === void 0) k(`LSP server returned undefined for ${H} on ${A.filePath}`)
        }
        let {
          formatted: D,
          resultCount: W,
          fileCount: K
        } = jl5(A.operation, I, G);
        return {
          data: {
            operation: A.operation,
            result: D,
            filePath: A.filePath,
            resultCount: W,
            fileCount: K
          }
        }
      } catch (I) {
        let W = (I instanceof Error ? I : Error(String(I))).message;
        return e(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${W}`)), {
          data: {
            operation: A.operation,
            result: `Error performing ${A.operation}: ${W}`,
            filePath: A.filePath
          }
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A.result
      }
    }
  }
})
// @from(Ln 354582, Col 0)
function pg2(A) {
  return `Search MCP tools: "${A.query??"..."}"`
}
// @from(Ln 354586, Col 0)
function lg2() {
  return DU.createElement(w7, null)
}
// @from(Ln 354590, Col 0)
function ig2(A) {
  let Q = typeof A === "string" ? A : Array.isArray(A) ? A.filter((B) => B.type === "text").map((B) => ("text" in B) ? B.text : "").join(`
`) : "Unknown error";
  return DU.createElement(C, {
    color: "error"
  }, Q)
}
// @from(Ln 354598, Col 0)
function ng2() {
  return null
}
// @from(Ln 354602, Col 0)
function ag2(A) {
  let {
    matches: Q
  } = A;
  if (Q.length === 0) return DU.createElement(x0, null, DU.createElement(C, {
    dimColor: !0
  }, "No matching MCP tools found"));
  return DU.createElement(x0, null, DU.createElement(C, null, "Found ", DU.createElement(C, {
    bold: !0
  }, Q.length), " ", Q.length === 1 ? "tool" : "tools"))
}
// @from(Ln 354613, Col 4)
DU
// @from(Ln 354614, Col 4)
og2 = w(() => {
  fA();
  tH();
  c4();
  DU = c(QA(), 1)
})
// @from(Ln 354621, Col 0)
function vl5(A) {
  return A.map((Q) => Q.name).sort().join(",")
}
// @from(Ln 354625, Col 0)
function kl5(A) {
  let Q = vl5(A);
  if (rg2 !== Q) k("MCPSearchTool: cache invalidated - MCP tools changed"), sg2.cache.clear?.(), rg2 = Q
}
// @from(Ln 354630, Col 0)
function kU0(A, Q, B) {
  return {
    data: {
      matches: A,
      query: Q,
      total_mcp_tools: B
    }
  }
}
// @from(Ln 354639, Col 0)
async function bl5(A, Q, B, G) {
  let Z = A.toLowerCase().split(/\s+/).filter((J) => J.length > 0);
  return (await Promise.all(Q.map(async (J) => {
    let X = J.name.toLowerCase().replace(/__/g, " "),
      D = (await sg2(J.name, B)).toLowerCase(),
      W = 0;
    for (let K of Z) {
      if (X === K) W += 10;
      else if (X.includes(K)) W += 5;
      if (D.includes(K)) W += 2
    }
    return {
      name: J.name,
      score: W
    }
  }))).filter((J) => J.score > 0).sort((J, X) => X.score - J.score).slice(0, G).map((J) => J.name)
}
// @from(Ln 354656, Col 4)
xl5
// @from(Ln 354656, Col 9)
yl5
// @from(Ln 354656, Col 14)
rg2 = null
// @from(Ln 354657, Col 2)
sg2
// @from(Ln 354657, Col 7)
tg2
// @from(Ln 354658, Col 4)
eg2 = w(() => {
  j9();
  og2();
  Wb();
  T1();
  Z0();
  Y9();
  xl5 = m.object({
    query: m.string().describe('Query to find MCP tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
    max_results: m.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
  }), yl5 = m.object({
    matches: m.array(m.string()),
    query: m.string(),
    total_mcp_tools: m.number()
  });
  sg2 = W0(async (A, Q) => {
    let B = Q.find((G) => G.name === A);
    if (!B) return "";
    return B.prompt({
      getToolPermissionContext: async () => ({
        mode: "default",
        additionalWorkingDirectories: new Map,
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: !1
      }),
      tools: Q,
      agents: []
    })
  }, (A) => A);
  tg2 = {
    isEnabled() {
      return Zd()
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    name: Db,
    maxResultSizeChars: 1e5,
    async description(A, {
      tools: Q
    }) {
      return MZ0(Q)
    },
    async prompt({
      tools: A
    }) {
      return MZ0(A)
    },
    inputSchema: xl5,
    outputSchema: yl5,
    async call(A, {
      options: {
        tools: Q
      }
    }) {
      let {
        query: B,
        max_results: G = 5
      } = A, Z = Q.filter((I) => I.isMcp);
      kl5(Z);

      function Y(I, D) {
        l("tengu_mcp_search_outcome", {
          query: B,
          queryType: D,
          matchCount: I.length,
          totalMcpTools: Z.length,
          maxResults: G,
          hasMatches: I.length > 0
        })
      }
      let J = B.match(/^select:(.+)$/i);
      if (J) {
        let I = J[1].trim(),
          D = Z.find((W) => W.name === I);
        if (!D) return k(`MCPSearchTool: select failed - tool not found: ${I}`), Y([], "select"), kU0([], B, Z.length);
        return k(`MCPSearchTool: selected "${I}"`), Y([D.name], "select"), kU0([D.name], B, Z.length)
      }
      let X = await bl5(B, Z, Q, G);
      return k(`MCPSearchTool: keyword search for "${B}", found ${X.length} matches`), Y(X, "keyword"), kU0(X, B, Z.length)
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: pg2,
    userFacingName: () => "MCPSearch",
    renderToolUseRejectedMessage: lg2,
    renderToolUseErrorMessage: ig2,
    renderToolUseProgressMessage: ng2,
    renderToolResultMessage: ag2,
    mapToolResultToToolResultBlockParam(A, Q) {
      if (A.matches.length === 0) return {
        type: "tool_result",
        tool_use_id: Q,
        content: "No matching MCP tools found"
      };
      return {
        type: "tool_result",
        tool_use_id: Q,
        content: A.matches.map((B) => ({
          type: "tool_reference",
          tool_name: B
        }))
      }
    }
  }
})
// @from(Ln 354773, Col 4)
Au2
// @from(Ln 354774, Col 4)
Qu2 = w(() => {
  Au2 = `Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

## When to Use This Tool

**Prefer using EnterPlanMode** for implementation tasks unless they're simple. Use it when ANY of these conditions apply:

1. **New Feature Implementation**: Adding meaningful new functionality
   - Example: "Add a logout button" - where should it go? What should happen on click?
   - Example: "Add form validation" - what rules? What error messages?

2. **Multiple Valid Approaches**: The task can be solved in several different ways
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

3. **Code Modifications**: Changes that affect existing behavior or structure
   - Example: "Update the login flow" - what exactly should change?
   - Example: "Refactor this component" - what's the target architecture?

4. **Architectural Decisions**: The task requires choosing between patterns or technologies
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

5. **Multi-File Changes**: The task will likely touch more than 2-3 files
   - Example: "Refactor the authentication system"
   - Example: "Add a new API endpoint with tests"

6. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

7. **User Preferences Matter**: The implementation could reasonably go multiple ways
   - If you would use ${zY} to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Task tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${zY} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- Requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

User: "Add a delete button to the user profile"
- Seems simple but involves: where to place it, confirmation dialog, API call, error handling, state updates

User: "Update the error handling in the API"
- Affects multiple files, user should approve the approach

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- If unsure whether to use it, err on the side of planning - it's better to get alignment upfront than to redo work
- Users appreciate being consulted before significant changes are made to their codebase
`
})
// @from(Ln 354863, Col 0)
function Bu2() {
  return null
}
// @from(Ln 354867, Col 0)
function Gu2() {
  return null
}
// @from(Ln 354871, Col 0)
function Zu2(A, Q, B) {
  return KV.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, KV.createElement(T, {
    flexDirection: "row"
  }, KV.createElement(C, {
    color: iR("plan")
  }, xJ), KV.createElement(C, null, " Entered plan mode")), KV.createElement(T, {
    paddingLeft: 2
  }, KV.createElement(C, {
    dimColor: !0
  }, "Claude is now exploring and designing an implementation approach.")))
}
// @from(Ln 354886, Col 0)
function Yu2() {
  return KV.createElement(T, {
    flexDirection: "row",
    marginTop: 1
  }, KV.createElement(C, {
    color: iR("default")
  }, xJ), KV.createElement(C, null, " User declined to enter plan mode"))
}
// @from(Ln 354895, Col 0)
function Ju2() {
  return null
}
// @from(Ln 354898, Col 4)
KV
// @from(Ln 354899, Col 4)
Xu2 = w(() => {
  fA();
  vS();
  mL();
  KV = c(QA(), 1)
})
// @from(Ln 354905, Col 4)
VK1 = "EnterPlanMode"
// @from(Ln 354906, Col 4)
fl5
// @from(Ln 354906, Col 9)
hl5
// @from(Ln 354906, Col 14)
gbA
// @from(Ln 354907, Col 4)
bU0 = w(() => {
  j9();
  dW();
  C0();
  Qu2();
  Xu2();
  fl5 = m.strictObject({}), hl5 = m.object({
    message: m.string().describe("Confirmation that plan mode was entered")
  }), gbA = {
    name: VK1,
    maxResultSizeChars: 1e5,
    async description() {
      return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() {
      return Au2
    },
    inputSchema: fl5,
    outputSchema: hl5,
    userFacingName() {
      return ""
    },
    isEnabled() {
      if (process.env.CLAUDE_CODE_REMOTE === "true") return !1;
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: Bu2,
    renderToolUseProgressMessage: Gu2,
    renderToolResultMessage: Zu2,
    renderToolUseRejectedMessage: Yu2,
    renderToolUseErrorMessage: Ju2,
    async call(A, Q) {
      if (Q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
      let B = await Q.getAppState();
      return Ty(B.toolPermissionContext.mode, "plan"), Q.setAppState((G) => ({
        ...G,
        toolPermissionContext: UJ(G.toolPermissionContext, {
          type: "setMode",
          mode: "plan",
          destination: "session"
        })
      })), {
        data: {
          message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      message: A
    }, Q) {
      return {
        type: "tool_result",
        content: `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
        tool_use_id: Q
      }
    }
  }
})
// @from(Ln 354988, Col 0)
function gl5(A) {
  let Q = A.find((Z) => Z.role === "user");
  if (!Q) return "";
  let B = Q.content;
  if (typeof B === "string") return B;
  let G = B.find((Z) => Z.type === "text");
  return G?.type === "text" ? G.text : ""
}
// @from(Ln 354996, Col 0)
async function sHA(A) {
  let {
    model: Q,
    system: B,
    messages: G,
    tools: Z,
    tool_choice: Y,
    output_format: J,
    max_tokens: X = 1024,
    maxRetries: I = 2,
    signal: D
  } = A, W = await XS({
    maxRetries: I,
    model: Q
  }), K = OL(Q), V = gl5(G), F = i10(V, {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION), H = zB1(F), E = EB1({
    isNonInteractive: !1,
    hasAppendSystemPrompt: !1
  }), z;
  if (Array.isArray(B)) z = [...H ? [{
    type: "text",
    text: H
  }] : [], {
    type: "text",
    text: E
  }, ...B];
  else z = [H, E, B].filter(Boolean).join(`

`);
  return await W.beta.messages.create({
    model: Lu(Q),
    max_tokens: X,
    system: z,
    messages: G,
    ...Z && {
      tools: Z
    },
    ...Y && {
      tool_choice: Y
    },
    ...J && {
      output_format: J
    },
    ...K.length > 0 && {
      betas: K
    },
    metadata: ao()
  }, {
    signal: D
  })
}
// @from(Ln 355053, Col 4)
FK1 = w(() => {
  OSA();
  nY();
  RR();
  $B1();
  n10();
  l2()
})
// @from(Ln 355061, Col 0)
async function HK1(A) {
  let Q = A.trim();
  if (!Q) return {
    valid: !1,
    error: "Model name cannot be empty"
  };
  let B = Q.toLowerCase();
  if (nJA.includes(B)) return {
    valid: !0
  };
  if (Iu2.has(Q)) return {
    valid: !0
  };
  try {
    return await sHA({
      model: Q,
      max_tokens: 1,
      maxRetries: 0,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "Hi",
          cache_control: {
            type: "ephemeral"
          }
        }]
      }]
    }), Iu2.set(Q, !0), {
      valid: !0
    }
  } catch (G) {
    return ul5(G, Q)
  }
}
// @from(Ln 355097, Col 0)
function ul5(A, Q) {
  if (A instanceof NBA) return {
    valid: !1,
    error: `Model '${Q}' not found`
  };
  if (A instanceof D9) {
    if (A instanceof qBA) return {
      valid: !1,
      error: "Authentication failed. Please check your API credentials."
    };
    if (A instanceof zC) return {
      valid: !1,
      error: "Network error. Please check your internet connection."
    };
    let G = A.error;
    if (G && typeof G === "object" && "type" in G && G.type === "not_found_error" && "message" in G && typeof G.message === "string" && G.message.includes("model:")) return {
      valid: !1,
      error: `Model '${Q}' not found`
    };
    return {
      valid: !1,
      error: `API error: ${A.message}`
    }
  }
  return {
    valid: !1,
    error: `Unable to validate model: ${A instanceof Error?A.message:String(A)}`
  }
}
// @from(Ln 355126, Col 4)
Iu2
// @from(Ln 355127, Col 4)
fU0 = w(() => {
  l2();
  FK1();
  vk();
  Iu2 = new Map
})
// @from(Ln 355133, Col 4)
ml5
// @from(Ln 355134, Col 4)
hU0 = w(() => {
  mBA();
  ai1();
  fU0();
  l2();
  ml5 = {
    theme: {
      source: "global",
      type: "string",
      description: "Color theme for the UI",
      options: DNB
    },
    editorMode: {
      source: "global",
      type: "string",
      description: "Key binding mode",
      options: ni1
    },
    verbose: {
      source: "global",
      type: "boolean",
      description: "Show detailed debug output",
      appStateKey: "verbose"
    },
    preferredNotifChannel: {
      source: "global",
      type: "string",
      description: "Preferred notification channel",
      options: ii1
    },
    autoCompactEnabled: {
      source: "global",
      type: "boolean",
      description: "Auto-compact when context is full"
    },
    fileCheckpointingEnabled: {
      source: "global",
      type: "boolean",
      description: "Enable file checkpointing for code rewind"
    },
    showTurnDuration: {
      source: "global",
      type: "boolean",
      description: 'Show turn duration message after responses (e.g., "Cooked for 1m 6s")'
    },
    todoFeatureEnabled: {
      source: "global",
      type: "boolean",
      description: "Enable todo/task tracking"
    },
    model: {
      source: "settings",
      type: "string",
      description: "Override the default model",
      appStateKey: "mainLoopModel",
      getOptions: () => {
        try {
          return zQA().filter((A) => A.value !== null).map((A) => A.value)
        } catch {
          return ["sonnet", "opus", "haiku"]
        }
      },
      validateOnWrite: (A) => HK1(String(A)),
      formatOnRead: (A) => A === null ? "default" : A
    },
    alwaysThinkingEnabled: {
      source: "settings",
      type: "boolean",
      description: "Enable extended thinking (false to disable)",
      appStateKey: "thinkingEnabled"
    },
    "permissions.defaultMode": {
      source: "settings",
      type: "string",
      description: "Default permission mode for tool usage",
      options: ["default", "plan", "acceptEdits", "dontAsk"]
    },
    language: {
      source: "settings",
      type: "string",
      description: 'Preferred language for Claude responses (e.g., "japanese", "spanish")'
    },
    ...{},
    ...{}
  }
})
// @from(Ln 355220, Col 4)
Du2 = w(() => {
  hU0();
  l2()
})
// @from(Ln 355224, Col 4)
cl5
// @from(Ln 355225, Col 4)
Wu2 = w(() => {
  fA();
  eW();
  c4();
  A0();
  cl5 = c(QA(), 1)
})
// @from(Ln 355232, Col 4)
V4Y
// @from(Ln 355232, Col 9)
F4Y
// @from(Ln 355233, Col 4)
Ku2 = w(() => {
  j9();
  Du2();
  hU0();
  Wu2();
  GQ();
  GB();
  Z0();
  v1();
  A0();
  V4Y = m.strictObject({
    setting: m.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
    value: m.union([m.string(), m.boolean(), m.number()]).optional().describe("The new value. Omit to get current value.")
  }), F4Y = m.object({
    success: m.boolean(),
    operation: m.enum(["get", "set"]).optional(),
    setting: m.string().optional(),
    value: m.unknown().optional(),
    previousValue: m.unknown().optional(),
    newValue: m.unknown().optional(),
    error: m.string().optional()
  })
})
// @from(Ln 355257, Col 0)
function Uu2(A) {
  let Q = A.toLowerCase();
  if (!pl5.includes(Q)) return null;
  return Q
}
// @from(Ln 355263, Col 0)
function gU0() {
  let A = zK1(),
    Q = A.map((B) => B.isEnabled());
  return A.filter((B, G) => Q[G]).map((B) => B.name)
}
// @from(Ln 355269, Col 0)
function zK1() {
  return [xVA, JK1, o2, as, Tc, V$, v5, J$, X$, qf, hF, vD, XK1, ZK1, IK1, bs, gbA, ...Hu2 ? [Hu2] : [], vU0, ...Fu2 ? [Fu2] : [], Ud, qd, ...Zd() ? [tg2] : []]
}
// @from(Ln 355273, Col 0)
function ubA(A, Q) {
  let B = _d(Q);
  return A.filter((G) => {
    return !B.some((Z) => Z.ruleValue.toolName === G.name && Z.ruleValue.ruleContent === void 0)
  })
}
// @from(Ln 355279, Col 4)
Vu2 = null
// @from(Ln 355280, Col 2)
Fu2 = null
// @from(Ln 355281, Col 2)
Hu2 = null
// @from(Ln 355282, Col 2)
EK1 = null
// @from(Ln 355283, Col 2)
Eu2 = null
// @from(Ln 355284, Col 2)
zu2 = null
// @from(Ln 355285, Col 2)
$u2 = null
// @from(Ln 355286, Col 2)
Cu2 = null
// @from(Ln 355287, Col 2)
pl5
// @from(Ln 355287, Col 7)
NyA
// @from(Ln 355287, Col 12)
D52
// @from(Ln 355287, Col 17)
W52
// @from(Ln 355287, Col 22)
ll5
// @from(Ln 355287, Col 27)
F$ = (A) => {
    if (a1(void 0)) return [o2];
    let Q = new Set([Ud.name, qd.name, JE]),
      B = zK1().filter((Y) => !Q.has(Y.name)),
      G = ubA(B, A);
    if (A.mode === "delegate") G = G.filter((Y) => ll5.has(Y.name));
    let Z = G.map((Y) => Y.isEnabled());
    return G.filter((Y, J) => Z[J])
  }
// @from(Ln 355296, Col 4)
az = w(() => {
  YY1();
  uD1();
  YK();
  is();
  T_();
  jc();
  UW1();
  u6A();
  iHA();
  MU0();
  _U0();
  jU0();
  SIA();
  fbA();
  Eg2();
  HbA();
  DK1();
  cg2();
  IZ1();
  DZ1();
  eg2();
  bU0();
  Ku2();
  Wb();
  Pr();
  YZ();
  fQ();
  cW();
  MBA();
  wP();
  pL();
  pl5 = ["default"];
  NyA = new Set([aHA, V$.name, VK1, f3, zY, GK1, ...Vu2 ? [Vu2] : []]), D52 = new Set([...NyA]), W52 = new Set([z3, aR, Bm, DI, cI, lI, X9, I8, BY, tq, kF, JE, Db, ...EK1 ? [EK1] : []]), ll5 = new Set([...EK1 ? [EK1] : [], ...Eu2 ? [Eu2] : [], ...zu2 ? [zu2] : [], ...$u2 ? [$u2] : [], ...Cu2 ? [Cu2] : []])
})
// @from(Ln 355334, Col 0)
async function Nu2(A, Q, B, G, Z, Y, J, X) {
  let I = J || `hook-${qu2()}`,
    D = Y.agentId ? yb(Y.agentId) : uz(),
    W = Date.now();
  try {
    let K = BY1(A.prompt(X), G);
    k(`Hooks: Processing agent hook with prompt: ${K}`);
    let F = [H0({
      content: K
    })];
    k(`Hooks: Starting agent query with ${F.length} messages`);
    let H = A.timeout ? A.timeout * 1000 : 60000,
      E = c9(),
      {
        signal: z,
        cleanup: $
      } = u_(Z, AbortSignal.timeout(H)),
      O = () => E.abort();
    z.addEventListener("abort", O);
    let L = E.signal;
    try {
      let M = q82(),
        j = [...Y.options.tools.filter((p) => p.name !== JE).filter((p) => !NyA.has(p.name)), M],
        x = [`You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${D}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${JE} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`],
        b = A.model ?? SD(),
        S = 50,
        u = iz(`hook-agent-${qu2()}`),
        f = {
          ...Y,
          agentId: u,
          abortController: E,
          options: {
            ...Y.options,
            tools: j,
            mainLoopModel: b,
            isNonInteractiveSession: !0,
            maxThinkingTokens: 0
          },
          setInProgressToolUseIDs: () => {},
          async getAppState() {
            let p = await Y.getAppState(),
              GA = p.toolPermissionContext.alwaysAllowRules.session ?? [];
            return {
              ...p,
              toolPermissionContext: {
                ...p.toolPermissionContext,
                mode: "dontAsk",
                alwaysAllowRules: {
                  ...p.toolPermissionContext.alwaysAllowRules,
                  session: [...GA, `Read(/${D})`]
                }
              }
            }
          }
        };
      GY1(Y.setAppState, u);
      let AA = null,
        n = 0,
        y = !1;
      for await (let p of aN({
        messages: F,
        systemPrompt: x,
        userContext: {},
        systemContext: {},
        canUseTool: B$,
        toolUseContext: f,
        querySource: "hook_agent"
      })) {
        if ($K1(p, () => {}, (GA) => Y.setResponseLength((WA) => WA + GA.length), Y.setStreamMode ?? (() => {}), () => {}), p.type === "stream_event" || p.type === "stream_request_start") continue;
        if (p.type === "assistant") {
          if (n++, n >= 50) {
            y = !0, k(`Hooks: Agent turn ${n} hit max turns, aborting`), E.abort();
            break
          }
        }
        if (p.type === "attachment" && p.attachment.type === "structured_output") {
          let GA = WyA.safeParse(p.attachment.data);
          if (GA.success) {
            AA = GA.data, k(`Hooks: Got structured output: ${eA(AA)}`), E.abort();
            break
          }
        }
      }
      if (z.removeEventListener("abort", O), $(), wVA(Y.setAppState, u), !AA) {
        if (y) return k("Hooks: Agent hook did not complete within 50 turns"), l("tengu_agent_stop_hook_max_turns", {
          durationMs: Date.now() - W,
          turnCount: n
        }), {
          hook: A,
          outcome: "cancelled"
        };
        return k("Hooks: Agent hook did not return structured output"), l("tengu_agent_stop_hook_error", {
          durationMs: Date.now() - W,
          turnCount: n,
          errorType: 1
        }), {
          hook: A,
          outcome: "cancelled"
        }
      }
      if (!AA.ok) return k(`Hooks: Agent hook condition was not met: ${AA.reason}`), {
        hook: A,
        outcome: "blocking",
        blockingError: {
          blockingError: `Agent hook condition was not met: ${AA.reason}`,
          command: A.prompt(X)
        }
      };
      return k("Hooks: Agent hook condition was met"), l("tengu_agent_stop_hook_success", {
        durationMs: Date.now() - W,
        turnCount: n
      }), {
        hook: A,
        outcome: "success",
        message: X4({
          type: "hook_success",
          hookName: Q,
          toolUseID: I,
          hookEvent: B,
          content: "Condition met"
        })
      }
    } catch (M) {
      if (z.removeEventListener("abort", O), $(), L.aborted) return {
        hook: A,
        outcome: "cancelled"
      };
      throw M
    }
  } catch (K) {
    let V = K instanceof Error ? K.message : String(K);
    return k(`Hooks: Agent hook error: ${V}`), l("tengu_agent_stop_hook_error", {
      durationMs: Date.now() - W,
      errorType: 2
    }), {
      hook: A,
      outcome: "non_blocking_error",
      message: X4({
        type: "hook_non_blocking_error",
        hookName: Q,
        toolUseID: I,
        hookEvent: B,
        stderr: `Error executing agent hook: ${V}`,
        stdout: "",
        exitCode: 1
      })
    }
  }
}
// @from(Ln 355491, Col 4)
wu2 = w(() => {
  T1();
  YZ();
  ks();
  l2();
  m_();
  Z0();
  Pr();
  iZ();
  DyA();
  ZY1();
  d4();
  tQ();
  az();
  vr();
  A0()
})
// @from(Ln 355508, Col 4)
OZ2 = {}
// @from(Ln 355536, Col 0)
function Ou2() {
  if (!!p2()) return !1;
  return !eZ(!1)
}
// @from(Ln 355541, Col 0)
function jE(A, Q) {
  let B = Q ?? q0();
  return {
    session_id: B,
    transcript_path: Bw(B),
    cwd: o1(),
    permission_mode: A
  }
}
// @from(Ln 355551, Col 0)
function Mu2(A) {
  let Q = A.trim();
  if (!Q.startsWith("{")) return k("Hook output does not start with {, treating as plain text"), {
    plainText: A
  };
  try {
    let B = AQ(Q),
      G = AY1.safeParse(B);
    if (G.success) return k("Successfully parsed and validated hook JSON output"), {
      json: G.data
    };
    else {
      let Y = `Hook JSON output validation failed:
${G.error.issues.map((J)=>`  - ${J.path.join(".")}: ${J.message}`).join(`
`)}

Expected schema:
${eA({continue:"boolean (optional)",suppressOutput:"boolean (optional)",stopReason:"string (optional)",decision:'"approve" | "block" (optional)',reason:"string (optional)",systemMessage:"string (optional)",permissionDecision:'"allow" | "deny" | "ask" (optional)',hookSpecificOutput:{"for PreToolUse":{hookEventName:'"PreToolUse"',permissionDecision:'"allow" | "deny" | "ask" (optional)',permissionDecisionReason:"string (optional)",updatedInput:"object (optional) - Modified tool input to use"},"for UserPromptSubmit":{hookEventName:'"UserPromptSubmit"',additionalContext:"string (required)"},"for PostToolUse":{hookEventName:'"PostToolUse"',additionalContext:"string (optional)"}}},null,2)}. The hook's stdout was: ${eA(B,null,2)}`;
      return k(Y), {
        plainText: A,
        validationError: Y
      }
    }
  } catch (B) {
    return k(`Failed to parse hook output as JSON: ${B}`), {
      plainText: A
    }
  }
}
// @from(Ln 355581, Col 0)
function Ru2({
  json: A,
  command: Q,
  hookName: B,
  toolUseID: G,
  hookEvent: Z,
  expectedHookEvent: Y,
  stdout: J,
  stderr: X,
  exitCode: I
}) {
  let D = {},
    W = A;
  if (W.continue === !1) {
    if (D.preventContinuation = !0, W.stopReason) D.stopReason = W.stopReason
  }
  if (A.decision) switch (A.decision) {
    case "approve":
      D.permissionBehavior = "allow";
      break;
    case "block":
      D.permissionBehavior = "deny", D.blockingError = {
        blockingError: A.reason || "Blocked by hook",
        command: Q
      };
      break;
    default:
      throw Error(`Unknown hook decision type: ${A.decision}. Valid types are: approve, block`)
  }
  if (A.systemMessage) D.systemMessage = A.systemMessage;
  if (A.hookSpecificOutput?.hookEventName === "PreToolUse" && A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
    case "allow":
      D.permissionBehavior = "allow";
      break;
    case "deny":
      D.permissionBehavior = "deny", D.blockingError = {
        blockingError: A.reason || "Blocked by hook",
        command: Q
      };
      break;
    case "ask":
      D.permissionBehavior = "ask";
      break;
    default:
      throw Error(`Unknown hook permissionDecision type: ${A.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask`)
  }
  if (D.permissionBehavior !== void 0 && A.reason !== void 0) D.hookPermissionDecisionReason = A.reason;
  if (A.hookSpecificOutput) {
    if (Y && A.hookSpecificOutput.hookEventName !== Y) throw Error(`Hook returned incorrect event name: expected '${Y}' but got '${A.hookSpecificOutput.hookEventName}'. Full stdout: ${eA(A,null,2)}`);
    switch (A.hookSpecificOutput.hookEventName) {
      case "PreToolUse":
        if (A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
          case "allow":
            D.permissionBehavior = "allow";
            break;
          case "deny":
            D.permissionBehavior = "deny", D.blockingError = {
              blockingError: A.hookSpecificOutput.permissionDecisionReason || A.reason || "Blocked by hook",
              command: Q
            };
            break;
          case "ask":
            D.permissionBehavior = "ask";
            break
        }
        if (D.hookPermissionDecisionReason = A.hookSpecificOutput.permissionDecisionReason, A.hookSpecificOutput.updatedInput) D.updatedInput = A.hookSpecificOutput.updatedInput;
        break;
      case "UserPromptSubmit":
        D.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "SessionStart":
        D.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "SubagentStart":
        D.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "PostToolUse":
        if (D.additionalContext = A.hookSpecificOutput.additionalContext, A.hookSpecificOutput.updatedMCPToolOutput) D.updatedMCPToolOutput = A.hookSpecificOutput.updatedMCPToolOutput;
        break;
      case "PostToolUseFailure":
        D.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "PermissionRequest":
        if (A.hookSpecificOutput.decision) {
          if (D.permissionRequestResult = A.hookSpecificOutput.decision, D.permissionBehavior = A.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", A.hookSpecificOutput.decision.behavior === "allow" && A.hookSpecificOutput.decision.updatedInput) D.updatedInput = A.hookSpecificOutput.decision.updatedInput
        }
        break
    }
  }
  return {
    ...D,
    message: D.blockingError ? X4({
      type: "hook_blocking_error",
      hookName: B,
      toolUseID: G,
      hookEvent: Z,
      blockingError: D.blockingError
    }) : X4({
      type: "hook_success",
      hookName: B,
      toolUseID: G,
      hookEvent: Z,
      content: "Success",
      stdout: J,
      stderr: X,
      exitCode: I
    })
  }
}
// @from(Ln 355690, Col 0)
async function CK1(A, Q, B, G, Z, Y, J) {
  let X = EQ(),
    I = A.command;
  if (J) I = I.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, J);
  let D = process.env.CLAUDE_CODE_SHELL_PREFIX ? o51(process.env.CLAUDE_CODE_SHELL_PREFIX, I) : I,
    W = A.timeout ? A.timeout * 1000 : 60000,
    K = {
      ...process.env,
      CLAUDE_PROJECT_DIR: X
    };
  if (J) K.CLAUDE_PLUGIN_ROOT = J;
  if (Q === "SessionStart" && Y !== void 0) K.CLAUDE_ENV_FILE = SA2(Y);
  let V = il5(D, [], {
      env: K,
      cwd: o1(),
      shell: !0
    }),
    F = r51(V, Z, W),
    H = "",
    E = "";
  V.stdout.setEncoding("utf8"), V.stderr.setEncoding("utf8");
  let z = !1,
    $ = null,
    O = new Promise((j) => {
      $ = j
    });
  V.stdout.on("data", (j) => {
    if (H += j, !z && H.trim().includes("}")) {
      z = !0, k(`Hooks: Checking initial response for async: ${H.trim()}`);
      try {
        let x = AQ(H.trim());
        if (k(`Hooks: Parsed initial response: ${eA(x)}`), PVA(x)) {
          let b = `async_hook_${V.pid}`;
          k(`Hooks: Detected async hook, backgrounding process ${b}`);
          let S = F.background(b);
          if (S) H82({
            processId: b,
            asyncResponse: x,
            hookEvent: Q,
            hookName: B,
            command: A.command,
            shellCommand: F
          }), S.stdoutStream.on("data", (u) => {
            E82(b, u.toString())
          }), S.stderrStream.on("data", (u) => {
            z82(b, u.toString())
          }), $?.({
            stdout: H,
            stderr: E,
            status: 0
          })
        } else k("Hooks: Initial response is not async, continuing normal processing")
      } catch (x) {
        k(`Hooks: Failed to parse initial response as JSON: ${x}`)
      }
    }
  }), V.stderr.on("data", (j) => {
    E += j
  });
  let L = new Promise((j, x) => {
      V.stdin.on("error", x), V.stdin.write(G, "utf8"), V.stdin.end(), j()
    }),
    M = new Promise((j, x) => {
      V.on("error", x)
    }),
    _ = new Promise((j) => {
      V.on("close", (x) => {
        j({
          stdout: H,
          stderr: E,
          status: x ?? 1,
          aborted: Z.aborted
        })
      })
    });
  try {
    return await Promise.race([L, M]), await Promise.race([O, _, M])
  } catch (j) {
    let x = j;
    if (x.code === "EPIPE") return k("EPIPE error while writing to hook stdin (hook command likely closed early)"), {
      stdout: "",
      stderr: "Hook command closed stdin before hook input was fully written (EPIPE)",
      status: 1
    };
    else if (x.code === "ABORT_ERR") return {
      stdout: "",
      stderr: "Hook cancelled",
      status: 1,
      aborted: !0
    };
    else return {
      stdout: "",
      stderr: `Error occurred while executing hook command: ${j instanceof Error?j.message:String(j)}`,
      status: 1
    }
  }
}
// @from(Ln 355788, Col 0)
function nl5(A, Q) {
  if (!Q || Q === "*") return !0;
  if (/^[a-zA-Z0-9_|]+$/.test(Q)) {
    if (Q.includes("|")) return Q.split("|").map((G) => G.trim()).includes(A);
    return A === Q
  }
  try {
    return new RegExp(Q).test(A)
  } catch {
    return k(`Invalid regex pattern in hook matcher: ${Q}`), !1
  }
}
// @from(Ln 355801, Col 0)
function al5(A, Q) {
  let B = {},
    G = o32();
  if (G)
    for (let [J, X] of Object.entries(G)) B[J] = X.map((I) => ({
      matcher: I.matcher,
      hooks: I.hooks
    }));
  let Z = br(),
    Y = TdA();
  if (Y)
    for (let [J, X] of Object.entries(Y)) {
      if (!B[J]) B[J] = [];
      for (let I of X) {
        if (Z && "pluginRoot" in I) continue;
        B[J].push(I)
      }
    }
  if (!Z && A !== void 0) {
    let J = lZ1(A, Q);
    for (let [I, D] of J.entries()) {
      if (!B[I]) B[I] = [];
      for (let W of D) B[I].push({
        matcher: W.matcher,
        hooks: W.hooks
      })
    }
    let X = u32(A, Q);
    for (let [I, D] of X.entries()) {
      if (!B[I]) B[I] = [];
      for (let W of D) B[I].push({
        matcher: W.matcher,
        hooks: W.hooks
      })
    }
  }
  return B
}
// @from(Ln 355840, Col 0)
function uU0(A, Q, B, G) {
  try {
    let Y = al5(A, Q)?.[B] ?? [],
      J = void 0;
    switch (G.hook_event_name) {
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "PermissionRequest":
        J = G.tool_name;
        break;
      case "SessionStart":
        J = G.source;
        break;
      case "PreCompact":
        J = G.trigger;
        break;
      case "Notification":
        J = G.notification_type;
        break;
      case "SessionEnd":
        J = G.reason;
        break;
      case "SubagentStart":
        J = G.agent_type;
        break;
      default:
        break
    }
    k(`Getting matching hook commands for ${B} with query: ${J}`), k(`Found ${Y.length} hook matchers in settings`);
    let I = (J ? Y.filter((E) => !E.matcher || nl5(J, E.matcher)) : Y).flatMap((E) => {
        let z = "pluginRoot" in E ? E.pluginRoot : void 0;
        return E.hooks.map(($) => ({
          hook: $,
          pluginRoot: z
        }))
      }),
      D = Array.from(new Map(I.filter((E) => E.hook.type === "command").map((E) => [E.hook.command, E])).values()),
      W = Array.from(new Map(I.filter((E) => E.hook.type === "prompt").map((E) => [E.hook.prompt, E])).values()),
      K = Array.from(new Map(I.filter((E) => E.hook.type === "agent").map((E) => [E.hook.prompt([]), E])).values()),
      V = I.filter((E) => E.hook.type === "callback"),
      F = I.filter((E) => E.hook.type === "function"),
      H = [...D, ...W, ...K, ...V, ...F];
    return k(`Matched ${H.length} unique hooks for query "${J||"no match query"}" (${I.length} before deduplication)`), H
  } catch {
    return []
  }
}
// @from(Ln 355889, Col 0)
function mU0(A, Q) {
  return `${A} hook error: ${Q.blockingError}`
}
// @from(Ln 355893, Col 0)
function dU0(A) {
  return `Stop hook feedback:
${A.blockingError}`
}
// @from(Ln 355898, Col 0)
function cU0(A) {
  return `UserPromptSubmit operation blocked by hook:
${A.blockingError}`
}
// @from(Ln 355902, Col 0)
async function* At({
  hookInput: A,
  toolUseID: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = fO,
  toolUseContext: Y,
  messages: J
}) {
  if (jQ().disableAllHooks) return;
  let X = A.hook_event_name,
    I = B ? `${X}:${B}` : X;
  if (Ou2()) {
    k(`Skipping ${I} hook execution - workspace trust not accepted`);
    return
  }
  let D = Y ? await Y.getAppState() : void 0,
    W = Y?.agentId ?? q0(),
    K = uU0(D, W, X, A);
  if (K.length === 0) return;
  if (G?.aborted) return;
  l("tengu_run_hook", {
    hookName: I,
    numCommands: K.length
  });
  let V = JK() ? Lu2(K) : [];
  if (JK()) LF("hook_execution_start", {
    hook_event: X,
    hook_name: I,
    num_hooks: String(K.length),
    managed_only: String(br()),
    hook_definitions: eA(V),
    hook_source: br() ? "policySettings" : "merged"
  });
  let F = W82(X, I, K.length, eA(V));
  for (let {
      hook: $
    }
    of K) yield {
    message: {
      type: "progress",
      data: {
        type: "hook_progress",
        hookEvent: X,
        hookName: I,
        command: AU($),
        promptText: $.type === "prompt" ? $.prompt : void 0,
        statusMessage: "statusMessage" in $ ? $.statusMessage : void 0
      },
      parentToolUseID: Q,
      toolUseID: Q,
      timestamp: new Date().toISOString(),
      uuid: tHA()
    }
  };
  let H = K.map(async function* ({
      hook: $,
      pluginRoot: O
    }, L) {
      if ($.type === "callback") {
        let x = $.timeout ? $.timeout * 1000 : Z,
          {
            signal: b,
            cleanup: S
          } = u_(AbortSignal.timeout(x), G);
        yield rl5({
          toolUseID: Q,
          hook: $,
          hookEvent: X,
          hookInput: A,
          signal: b,
          hookIndex: L,
          toolUseContext: Y
        }).finally(S);
        return
      }
      if ($.type === "function") {
        if (!J) {
          yield {
            message: X4({
              type: "hook_error_during_execution",
              hookName: I,
              toolUseID: Q,
              hookEvent: X,
              content: "Messages not provided for function hook"
            }),
            outcome: "non_blocking_error",
            hook: $
          };
          return
        }
        yield ol5({
          hook: $,
          messages: J,
          hookName: I,
          toolUseID: Q,
          hookEvent: X,
          timeoutMs: Z,
          signal: G
        });
        return
      }
      let M = $.timeout ? $.timeout * 1000 : Z,
        {
          signal: _,
          cleanup: j
        } = u_(AbortSignal.timeout(M), G);
      try {
        let x;
        try {
          x = eA(A)
        } catch (AA) {
          e(Error(`Failed to stringify hook ${I} input`, {
            cause: AA
          })), yield {
            message: X4({
              type: "hook_error_during_execution",
              hookName: I,
              toolUseID: Q,
              hookEvent: X,
              content: `Failed to prepare hook input: ${AA instanceof Error?AA.message:String(AA)}`
            }),
            outcome: "non_blocking_error",
            hook: $
          };
          return
        }
        if ($.type === "prompt") {
          if (!Y) throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
          yield await w82($, I, X, x, _, Y, J, Q), j?.();
          return
        }
        if ($.type === "agent") {
          if (!Y) throw Error("ToolUseContext is required for agent hooks. This is a bug.");
          if (!J) throw Error("Messages are required for agent hooks. This is a bug.");
          yield await Nu2($, I, X, x, _, Y, Q, J), j?.();
          return
        }
        let b = await CK1($, X, I, x, _, L, O);
        if (j?.(), b.aborted) {
          yield {
            message: X4({
              type: "hook_cancelled",
              hookName: I,
              toolUseID: Q,
              hookEvent: X
            }),
            outcome: "cancelled",
            hook: $
          };
          return
        }
        let {
          json: S,
          plainText: u,
          validationError: f
        } = Mu2(b.stdout);
        if (f) {
          yield {
            message: X4({
              type: "hook_non_blocking_error",
              hookName: I,
              toolUseID: Q,
              hookEvent: X,
              stderr: `JSON validation failed: ${f}`,
              stdout: b.stdout,
              exitCode: 1
            }),
            outcome: "non_blocking_error",
            hook: $
          };
          return
        }
        if (S) {
          if (PVA(S)) {
            yield {
              outcome: "success",
              hook: $
            };
            return
          }
          let AA = Ru2({
            json: S,
            command: $.type === "command" ? $.command : "prompt",
            hookName: I,
            toolUseID: Q,
            hookEvent: X,
            expectedHookEvent: X,
            stdout: b.stdout,
            stderr: b.stderr,
            exitCode: b.status
          });
          if (F82(S) && !S.suppressOutput && u && b.status === 0) {
            let n = `${I1.bold(I)} completed`;
            yield {
              ...AA,
              message: AA.message || X4({
                type: "hook_success",
                hookName: I,
                toolUseID: Q,
                hookEvent: X,
                content: n,
                stdout: b.stdout,
                stderr: b.stderr,
                exitCode: b.status
              }),
              outcome: "success",
              hook: $
            };
            return
          }
          yield {
            ...AA,
            outcome: "success",
            hook: $
          };
          return
        }
        if (b.status === 0) {
          yield {
            message: X4({
              type: "hook_success",
              hookName: I,
              toolUseID: Q,
              hookEvent: X,
              content: b.stdout.trim(),
              stdout: b.stdout,
              stderr: b.stderr,
              exitCode: b.status
            }),
            outcome: "success",
            hook: $
          };
          return
        }
        if (b.status === 2) {
          yield {
            blockingError: {
              blockingError: `[${$.command}]: ${b.stderr||"No stderr output"}`,
              command: $.command
            },
            outcome: "blocking",
            hook: $
          };
          return
        }
        yield {
          message: X4({
            type: "hook_non_blocking_error",
            hookName: I,
            toolUseID: Q,
            hookEvent: X,
            stderr: `Failed with non-blocking status code: ${b.stderr.trim()||"No stderr output"}`,
            stdout: b.stdout,
            exitCode: b.status
          }),
          outcome: "non_blocking_error",
          hook: $
        };
        return
      } catch (x) {
        j?.();
        let b = x instanceof Error ? x.message : String(x);
        yield {
          message: X4({
            type: "hook_non_blocking_error",
            hookName: I,
            toolUseID: Q,
            hookEvent: X,
            stderr: `Failed to run: ${b}`,
            stdout: "",
            exitCode: 1
          }),
          outcome: "non_blocking_error",
          hook: $
        };
        return
      }
    }),
    E = {
      success: 0,
      blocking: 0,
      non_blocking_error: 0,
      cancelled: 0
    },
    z;
  for await (let $ of SVA(H)) {
    if (E[$.outcome]++, $.preventContinuation) yield {
      preventContinuation: !0,
      stopReason: $.stopReason
    };
    if ($.blockingError) yield {
      blockingError: $.blockingError
    };
    if ($.message) yield {
      message: $.message
    };
    if ($.systemMessage) yield {
      message: X4({
        type: "hook_system_message",
        content: $.systemMessage,
        hookName: I,
        toolUseID: Q,
        hookEvent: X
      })
    };
    if ($.additionalContext) yield {
      additionalContexts: [$.additionalContext]
    };
    if ($.updatedMCPToolOutput) yield {
      updatedMCPToolOutput: $.updatedMCPToolOutput
    };
    if ($.permissionBehavior) switch ($.permissionBehavior) {
      case "deny":
        z = "deny";
        break;
      case "ask":
        if (z !== "deny") z = "ask";
        break;
      case "allow":
        if (!z) z = "allow";
        break;
      case "passthrough":
        break
    }
    if (z !== void 0) yield {
      permissionBehavior: z,
      hookPermissionDecisionReason: $.hookPermissionDecisionReason,
      updatedInput: $.updatedInput && ($.permissionBehavior === "allow" || $.permissionBehavior === "ask") ? $.updatedInput : void 0
    };
    if ($.updatedInput && $.permissionBehavior === void 0) yield {
      updatedInput: $.updatedInput
    };
    if ($.permissionRequestResult) yield {
      permissionRequestResult: $.permissionRequestResult
    };
    if (D && $.hook.type !== "callback") {
      let O = q0(),
        M = m32(D, O, X, B ?? "", $.hook);
      if (M?.onHookSuccess && $.outcome === "success") try {
        M.onHookSuccess($.hook, $)
      } catch (_) {
        e(Error("Session hook success callback failed", {
          cause: _
        }))
      }
    }
  }
  if (l("tengu_repl_hook_finished", {
      hookName: I,
      numCommands: K.length,
      numSuccess: E.success,
      numBlocking: E.blocking,
      numNonBlockingError: E.non_blocking_error,
      numCancelled: E.cancelled
    }), JK()) {
    let $ = Lu2(K);
    LF("hook_execution_complete", {
      hook_event: X,
      hook_name: I,
      num_hooks: String(K.length),
      num_success: String(E.success),
      num_blocking: String(E.blocking),
      num_non_blocking_error: String(E.non_blocking_error),
      num_cancelled: String(E.cancelled),
      managed_only: String(br()),
      hook_definitions: eA($),
      hook_source: br() ? "policySettings" : "merged"
    })
  }
  K82(F, {
    numSuccess: E.success,
    numBlocking: E.blocking,
    numNonBlockingError: E.non_blocking_error,
    numCancelled: E.cancelled
  })
}
// @from(Ln 356279, Col 0)
async function pU0({
  getAppState: A,
  hookInput: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = fO
}) {
  let Y = Q.hook_event_name,
    J = B ? `${Y}:${B}` : Y;
  if (jQ().disableAllHooks) return k(`Skipping hooks for ${J} due to 'disableAllHooks' setting`), [];
  if (Ou2()) return k(`Skipping ${J} hook execution - workspace trust not accepted`), [];
  let X = A ? await A() : void 0,
    I = q0(),
    D = uU0(X, I, Y, Q);
  if (D.length === 0) return [];
  if (G?.aborted) return [];
  l("tengu_run_hook", {
    hookName: J,
    numCommands: D.length
  });
  let W;
  try {
    W = eA(Q)
  } catch (V) {
    return e(V instanceof Error ? V : Error(String(V))), []
  }
  let K = D.map(async ({
    hook: V,
    pluginRoot: F
  }, H) => {
    if (V.type === "callback") {
      let O = V.timeout ? V.timeout * 1000 : Z,
        {
          signal: L,
          cleanup: M
        } = u_(AbortSignal.timeout(O), G);
      try {
        let _ = tHA(),
          j = await V.callback(Q, _, L, H);
        if (M?.(), PVA(j)) return k(`${J} [callback] returned async response, returning empty output`), {
          command: "callback",
          succeeded: !0,
          output: ""
        };
        let x = j.systemMessage || "";
        return k(`${J} [callback] completed successfully`), {
          command: "callback",
          succeeded: !0,
          output: x
        }
      } catch (_) {
        M?.();
        let j = _ instanceof Error ? _.message : String(_);
        return k(`${J} [callback] failed to run: ${j}`, {
          level: "error"
        }), {
          command: "callback",
          succeeded: !1,
          output: j
        }
      }
    }
    if (V.type === "prompt") return {
      command: V.prompt,
      succeeded: !1,
      output: "Prompt stop hooks are not yet supported outside REPL"
    };
    if (V.type === "agent") return {
      command: V.prompt([]),
      succeeded: !1,
      output: "Agent stop hooks are not yet supported outside REPL"
    };
    if (V.type === "function") return e(Error(`Function hook reached executeHooksOutsideREPL for ${Y}. Function hooks should only be used in REPL context (Stop hooks).`)), {
      command: "function",
      succeeded: !1,
      output: "Internal error: function hook executed outside REPL context"
    };
    let E = V.timeout ? V.timeout * 1000 : Z,
      {
        signal: z,
        cleanup: $
      } = u_(AbortSignal.timeout(E), G);
    try {
      let O = await CK1(V, Y, J, W, z, H, F);
      if ($?.(), O.aborted) return k(`${J} [${V.command}] cancelled`), {
        command: V.command,
        succeeded: !1,
        output: "Hook cancelled"
      };
      k(`${J} [${V.command}] completed with status ${O.status}`);
      let {
        json: L,
        validationError: M
      } = Mu2(O.stdout);
      if (M) throw Error(M);
      if (L && !PVA(L)) k(`Parsed JSON output from hook: ${eA(L)}`);
      let _ = O.status === 0 ? O.stdout || "" : O.stderr || "";
      return {
        command: V.command,
        succeeded: O.status === 0,
        output: _
      }
    } catch (O) {
      $?.();
      let L = O instanceof Error ? O.message : String(O);
      return k(`${J} [${V.command}] failed to run: ${L}`, {
        level: "error"
      }), {
        command: V.command,
        succeeded: !1,
        output: L
      }
    }
  });
  return await Promise.all(K)
}
// @from(Ln 356395, Col 0)
async function* lU0(A, Q, B, G, Z, Y, J = fO) {
  k(`executePreToolHooks called for tool: ${A}`);
  let X = {
    ...jE(Z),
    hook_event_name: "PreToolUse",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q
  };
  yield* At({
    hookInput: X,
    toolUseID: Q,
    matchQuery: A,
    signal: Y,
    timeoutMs: J,
    toolUseContext: G
  })
}
// @from(Ln 356413, Col 0)
async function* iU0(A, Q, B, G, Z, Y, J, X = fO) {
  let I = {
    ...jE(Y),
    hook_event_name: "PostToolUse",
    tool_name: A,
    tool_input: B,
    tool_response: G,
    tool_use_id: Q
  };
  yield* At({
    hookInput: I,
    toolUseID: Q,
    matchQuery: A,
    signal: J,
    timeoutMs: X,
    toolUseContext: Z
  })
}
// @from(Ln 356431, Col 0)
async function* nU0(A, Q, B, G, Z, Y, J, X, I = fO) {
  let D = {
    ...jE(J),
    hook_event_name: "PostToolUseFailure",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q,
    error: G,
    is_interrupt: Y
  };
  yield* At({
    hookInput: D,
    toolUseID: Q,
    matchQuery: A,
    signal: X,
    timeoutMs: I,
    toolUseContext: Z
  })
}
// @from(Ln 356450, Col 0)
async function vE0(A, Q = fO) {
  let {
    message: B,
    title: G,
    notificationType: Z
  } = A, Y = {
    ...jE(void 0),
    hook_event_name: "Notification",
    message: B,
    title: G,
    notification_type: Z
  };
  await pU0({
    hookInput: Y,
    timeoutMs: Q,
    matchQuery: Z
  })
}
// @from(Ln 356468, Col 0)
async function* aU0(A, Q, B = fO, G = !1, Z, Y, J) {
  let X = Z ? {
    ...jE(A),
    hook_event_name: "SubagentStop",
    stop_hook_active: G,
    agent_id: Z,
    agent_transcript_path: yb(Z)
  } : {
    ...jE(A),
    hook_event_name: "Stop",
    stop_hook_active: G
  };
  yield* At({
    hookInput: X,
    toolUseID: tHA(),
    signal: Q,
    timeoutMs: B,
    toolUseContext: Y,
    messages: J
  })
}
// @from(Ln 356489, Col 0)
async function* oU0(A, Q, B) {
  let G = {
    ...jE(Q),
    hook_event_name: "UserPromptSubmit",
    prompt: A
  };
  yield* At({
    hookInput: G,
    toolUseID: tHA(),
    signal: B.abortController.signal,
    timeoutMs: fO,
    toolUseContext: B
  })
}
// @from(Ln 356503, Col 0)
async function* rU0(A, Q, B, G, Z = fO) {
  let Y = {
    ...jE(void 0, Q),
    hook_event_name: "SessionStart",
    source: A,
    agent_type: B
  };
  yield* At({
    hookInput: Y,
    toolUseID: tHA(),
    matchQuery: A,
    signal: G,
    timeoutMs: Z
  })
}
// @from(Ln 356518, Col 0)
async function* kz0(A, Q, B, G = fO) {
  let Z = {
    ...jE(void 0),
    hook_event_name: "SubagentStart",
    agent_id: A,
    agent_type: Q
  };
  yield* At({
    hookInput: Z,
    toolUseID: tHA(),
    matchQuery: Q,
    signal: B,
    timeoutMs: G
  })
}
// @from(Ln 356533, Col 0)
async function sU0(A, Q, B = fO) {
  let G = {
      ...jE(void 0),
      hook_event_name: "PreCompact",
      trigger: A.trigger,
      custom_instructions: A.customInstructions
    },
    Z = await pU0({
      hookInput: G,
      matchQuery: A.trigger,
      signal: Q,
      timeoutMs: B
    });
  if (Z.length === 0) return {};
  let Y = Z.filter((X) => X.succeeded && X.output.trim().length > 0).map((X) => X.output.trim()),
    J = [];
  for (let X of Z)
    if (X.succeeded)
      if (X.output.trim()) J.push(`PreCompact [${X.command}] completed successfully: ${X.output.trim()}`);
      else J.push(`PreCompact [${X.command}] completed successfully`);
  else if (X.output.trim()) J.push(`PreCompact [${X.command}] failed: ${X.output.trim()}`);
  else J.push(`PreCompact [${X.command}] failed`);
  return {
    newCustomInstructions: Y.length > 0 ? Y.join(`

`) : void 0,
    userDisplayMessage: J.length > 0 ? J.join(`
`) : void 0
  }
}
// @from(Ln 356563, Col 0)
async function tU0(A, Q) {
  let {
    getAppState: B,
    setAppState: G,
    signal: Z,
    timeoutMs: Y = fO
  } = Q || {}, J = {
    ...jE(void 0),
    hook_event_name: "SessionEnd",
    reason: A
  }, X = await pU0({
    getAppState: B,
    hookInput: J,
    matchQuery: A,
    signal: Z,
    timeoutMs: Y
  });
  for (let I of X)
    if (!I.succeeded && I.output) process.stderr.write(`SessionEnd hook [${I.command}] failed: ${I.output}
`);
  if (G) {
    let I = q0();
    wVA(G, I)
  }
}
// @from(Ln 356588, Col 0)
async function* eU0(A, Q, B, G, Z, Y, J, X = fO) {
  k(`executePermissionRequestHooks called for tool: ${A}`);
  let I = {
    ...jE(Z),
    hook_event_name: "PermissionRequest",
    tool_name: A,
    tool_input: B,
    permission_suggestions: Y
  };
  yield* At({
    hookInput: I,
    toolUseID: Q,
    matchQuery: A,
    signal: J,
    timeoutMs: X,
    toolUseContext: G
  })
}
// @from(Ln 356606, Col 0)
async function Aq0(A, Q, B = 5000) {
  let G = jQ(),
    Z = G?.statusLine;
  if (G?.disableAllHooks === !0) return;
  if (!Z || Z.type !== "command") return;
  let Y = Q || AbortSignal.timeout(B);
  try {
    let J = eA(A),
      X = await CK1(Z, "StatusLine", "statusLine", J, Y);
    if (X.aborted) return;
    if (X.status === 0) {
      let I = X.stdout.trim().split(`
`).flatMap((D) => D.trim() || []).join(`
`);
      if (I) return I
    }
    return
  } catch (J) {
    k(`Status hook failed: ${J}`, {
      level: "error"
    });
    return
  }
}
// @from(Ln 356630, Col 0)
async function Qq0(A, Q, B = 5000) {
  let G = jQ();
  if (G?.disableAllHooks === !0) return [];
  let Z = G?.fileSuggestion;
  if (!Z || Z.type !== "command") return [];
  let Y = Q || AbortSignal.timeout(B);
  try {
    let J = eA(A),
      X = {
        type: "command",
        command: Z.command
      },
      I = await CK1(X, "FileSuggestion", "FileSuggestion", J, Y);
    if (I.aborted || I.status !== 0) return [];
    return I.stdout.split(`
`).map((D) => D.trim()).filter(Boolean)
  } catch (J) {
    return k(`File suggestion helper failed: ${J}`, {
      level: "error"
    }), []
  }
}
// @from(Ln 356652, Col 0)
async function ol5({
  hook: A,
  messages: Q,
  hookName: B,
  toolUseID: G,
  hookEvent: Z,
  timeoutMs: Y,
  signal: J
}) {
  let X = A.timeout ?? Y,
    {
      signal: I,
      cleanup: D
    } = u_(AbortSignal.timeout(X), J);
  try {
    if (I.aborted) return D(), {
      outcome: "cancelled",
      hook: A
    };
    let W = await new Promise((K, V) => {
      let F = () => V(Error("Function hook cancelled"));
      I.addEventListener("abort", F), Promise.resolve(A.callback(Q, I)).then((H) => {
        I.removeEventListener("abort", F), K(H)
      }).catch((H) => {
        I.removeEventListener("abort", F), V(H)
      })
    });
    if (D(), W) return {
      outcome: "success",
      hook: A
    };
    return {
      blockingError: {
        blockingError: A.errorMessage,
        command: "function"
      },
      outcome: "blocking",
      hook: A
    }
  } catch (W) {
    if (D(), W instanceof Error && (W.message === "Function hook cancelled" || W.name === "AbortError")) return {
      outcome: "cancelled",
      hook: A
    };
    return e(W instanceof Error ? W : Error(String(W))), {
      message: X4({
        type: "hook_error_during_execution",
        hookName: B,
        toolUseID: G,
        hookEvent: Z,
        content: W instanceof Error ? W.message : "Function hook execution error"
      }),
      outcome: "non_blocking_error",
      hook: A
    }
  }
}
// @from(Ln 356709, Col 0)
async function rl5({
  toolUseID: A,
  hook: Q,
  hookEvent: B,
  hookInput: G,
  signal: Z,
  hookIndex: Y,
  toolUseContext: J
}) {
  let X = J ? {
      getAppState: J.getAppState,
      setAppState: J.setAppState
    } : void 0,
    I = await Q.callback(G, A, Z, Y, X);
  if (PVA(I)) return {
    outcome: "success",
    hook: Q
  };
  return {
    ...Ru2({
      json: I,
      command: "callback",
      hookName: `${B}:Callback`,
      toolUseID: A,
      hookEvent: B,
      expectedHookEvent: B,
      stdout: void 0,
      stderr: void 0,
      exitCode: void 0
    }),
    outcome: "success",
    hook: Q
  }
}
// @from(Ln 356744, Col 0)
function Lu2(A) {
  return A.map(({
    hook: Q
  }) => {
    if (Q.type === "command") return {
      type: "command",
      command: Q.command
    };
    else if (Q.type === "prompt") return {
      type: "prompt",
      prompt: Q.prompt
    };
    else if (Q.type === "function") return {
      type: "function",
      name: "function"
    };
    else if (Q.type === "callback") return {
      type: "callback",
      name: "callback"
    };
    return {
      type: "unknown"
    }
  })
}
// @from(Ln 356769, Col 4)
fO = 600000
// @from(Ln 356770, Col 4)
zO = w(() => {
  mZ0();
  V2();
  fZ0();
  t51();
  C0();
  GQ();
  OVA();
  d4();
  GB();
  Z0();
  fr();
  hr();
  nI0();
  Z3();
  bb();
  T1();
  v1();
  DyA();
  aI0();
  m_();
  gr();
  L82();
  wu2();
  vr();
  A0()
})
// @from(Ln 356798, Col 0)
function sl5(A) {
  let Q = {
    PreToolUse: [],
    PostToolUse: [],
    PostToolUseFailure: [],
    Notification: [],
    UserPromptSubmit: [],
    SessionStart: [],
    SessionEnd: [],
    Stop: [],
    SubagentStart: [],
    SubagentStop: [],
    PreCompact: [],
    PermissionRequest: []
  };
  if (!A.hooksConfig) return Q;
  for (let [B, G] of Object.entries(A.hooksConfig)) {
    let Z = B;
    if (!Q[Z]) continue;
    for (let Y of G)
      if (Y.hooks.length > 0) Q[Z].push({
        matcher: Y.matcher,
        hooks: Y.hooks,
        pluginRoot: A.path,
        pluginName: A.name
      })
  }
  return Q
}
// @from(Ln 356828, Col 0)
function Bq0() {
  Qt.cache?.clear?.(), Hf0()
}
// @from(Ln 356832, Col 0)
function ju2() {
  if (_u2) return;
  _u2 = !0, HC.subscribe((A) => {
    if (A === "policySettings") k("Plugin hooks: reloading due to policySettings change"), Bt(), Bq0(), Qt()
  })
}
// @from(Ln 356838, Col 4)
_u2 = !1
// @from(Ln 356839, Col 2)
Qt
// @from(Ln 356840, Col 4)
mbA = w(() => {
  Y9();
  GK();
  T1();
  C0();
  WBA();
  Qt = W0(async () => {
    let {
      enabled: A
    } = await DG(), Q = {
      PreToolUse: [],
      PostToolUse: [],
      PostToolUseFailure: [],
      Notification: [],
      UserPromptSubmit: [],
      SessionStart: [],
      SessionEnd: [],
      Stop: [],
      SubagentStart: [],
      SubagentStop: [],
      PreCompact: [],
      PermissionRequest: []
    };
    for (let G of A) {
      if (!G.hooksConfig) continue;
      k(`Loading hooks from plugin: ${G.name}`);
      let Z = sl5(G);
      for (let Y of Object.keys(Z)) Q[Y].push(...Z[Y])
    }
    G7A(Q);
    let B = Object.values(Q).reduce((G, Z) => G + Z.reduce((Y, J) => Y + J.hooks.length, 0), 0);
    k(`Registered ${B} hooks from ${A.length} plugins`)
  })
})
// @from(Ln 356874, Col 0)
async function WU(A, Q, B) {
  let G = [],
    Z = [];
  if (br()) k("Skipping plugin hooks - allowManagedHooksOnly is enabled");
  else try {
    await Qt()
  } catch (J) {
    let X = J instanceof Error ? Error(`Failed to load plugin hooks during ${A}: ${J.message}`) : Error(`Failed to load plugin hooks during ${A}: ${String(J)}`);
    if (J instanceof Error && J.stack) X.stack = J.stack;
    e(X);
    let I = J instanceof Error ? J.message : String(J),
      D = "";
    if (I.includes("Failed to clone") || I.includes("network") || I.includes("ETIMEDOUT") || I.includes("ENOTFOUND")) D = "This appears to be a network issue. Check your internet connection and try again.";
    else if (I.includes("Permission denied") || I.includes("EACCES") || I.includes("EPERM")) D = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
    else if (I.includes("Invalid") || I.includes("parse") || I.includes("JSON") || I.includes("schema")) D = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
    else D = "Please fix the plugin configuration or remove problematic plugins from your settings.";
    k(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${I}. ${D}`, {
      level: "warn"
    })
  }
  let Y = B ?? $f0();
  for await (let J of rU0(A, Q, Y)) {
    if (J.message) G.push(J.message);
    if (J.additionalContexts && J.additionalContexts.length > 0) Z.push(...J.additionalContexts)
  }
  if (Z.length > 0) {
    let J = X4({
      type: "hook_additional_context",
      content: Z,
      hookName: "SessionStart",
      toolUseID: "SessionStart",
      hookEvent: "SessionStart"
    });
    G.push(J)
  }
  return G
}
// @from(Ln 356911, Col 4)
Gt = w(() => {
  zO();
  mbA();
  v1();
  T1();
  m_();
  OVA();
  C0()
})
// @from(Ln 356924, Col 0)
function tl5(A) {
  if (A.type !== "attachment") return A;
  let Q = A.attachment;
  if (Q.type === "new_file") return {
    ...A,
    attachment: {
      ...Q,
      type: "file"
    }
  };
  if (Q.type === "new_directory") return {
    ...A,
    attachment: {
      ...Q,
      type: "directory"
    }
  };
  return A
}
// @from(Ln 356944, Col 0)
function dbA(A) {
  try {
    let Q = A.map(tl5),
      B = Pu2(Q),
      G = Su2(B);
    if (G[G.length - 1]?.type === "user") G.push(QU({
      content: v9A
    }));
    return G
  } catch (Q) {
    throw e(Q), Q
  }
}
// @from(Ln 356957, Col 0)
async function Zt(A, Q) {
  try {
    let B = null,
      G = null,
      Z;
    if (A === void 0) B = await xu2(0);
    else if (Q) {
      G = [];
      for (let J of await Fg(Q)) {
        if (J.type === "assistant" || J.type === "user") {
          let X = el5(J);
          if (X) G.push(X)
        }
        Z = J.session_id
      }
    } else if (typeof A === "string") B = await Gq0(A), Z = A;
    else B = A;
    if (!B && !G) return null;
    if (B) {
      if (Gj(B)) B = await Vx(B);
      if (!Z) Z = xX(B);
      if (w71(B), Z) W71(B, lz(Z));
      EW1(B), G = B.messages
    }
    G = dbA(G);
    let Y = await WU("resume", Z);
    return G.push(...Y), {
      messages: G,
      fileHistorySnapshots: B?.fileHistorySnapshots,
      attributionSnapshots: B?.attributionSnapshots,
      sessionId: Z
    }
  } catch (B) {
    throw e(B), B
  }
}
// @from(Ln 356994, Col 0)
function el5(A) {
  if (A.type === "assistant") return {
    type: A.type,
    message: A.message,
    uuid: Tu2(),
    timestamp: new Date().toISOString(),
    requestId: void 0
  };
  else if (A.type === "user") return {
    type: A.type,
    message: A.message,
    uuid: Tu2(),
    timestamp: new Date().toISOString()
  };
  return
}
// @from(Ln 357010, Col 4)
eHA = w(() => {
  v1();
  d4();
  tQ();
  Dd();
  UF();
  vI();
  Gt();
  oN()
})
// @from(Ln 357021, Col 0)
function yu2({
  onStashAndContinue: A,
  onCancel: Q
}) {
  let [B, G] = o6A.useState(null), Z = B !== null ? [...B.tracked, ...B.untracked] : [], [Y, J] = o6A.useState(!0), [X, I] = o6A.useState(!1), [D, W] = o6A.useState(null);
  o6A.useEffect(() => {
    (async () => {
      try {
        let E = await pi1();
        G(E)
      } catch (E) {
        let z = E instanceof Error ? E.message : String(E);
        k(`Error getting changed files: ${z}`, {
          level: "error"
        }), W("Failed to get changed files")
      } finally {
        J(!1)
      }
    })()
  }, []);
  let K = async () => {
    I(!0);
    try {
      if (k("Stashing changes before teleport..."), await oBB("Teleport auto-stash")) k("Successfully stashed changes"), A();
      else W("Failed to stash changes")
    } catch (H) {
      let E = H instanceof Error ? H.message : String(H);
      k(`Error stashing changes: ${E}`, {
        level: "error"
      }), W("Failed to stash changes")
    } finally {
      I(!1)
    }
  }, V = (H) => {
    if (H === "stash") K();
    else Q()
  };
  if (Y) return ZD.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, ZD.default.createElement(T, {
    marginBottom: 1
  }, ZD.default.createElement(W9, null), ZD.default.createElement(C, null, " Checking git status", tA.ellipsis)));
  if (D) return ZD.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, ZD.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Error: ", D), ZD.default.createElement(T, {
    marginTop: 1
  }, ZD.default.createElement(C, {
    dimColor: !0
  }, "Press "), ZD.default.createElement(C, {
    bold: !0
  }, "Escape"), ZD.default.createElement(C, {
    dimColor: !0
  }, " to cancel")));
  let F = Z.length > 8;
  return ZD.default.createElement(o9, {
    title: "Working Directory Has Changes",
    onCancel: Q,
    borderDimColor: !0
  }, ZD.default.createElement(C, null, "Teleport will switch git branches. The following changes were found:"), ZD.default.createElement(T, {
    flexDirection: "column",
    paddingLeft: 2
  }, Z.length > 0 ? F ? ZD.default.createElement(C, null, Z.length, " files changed") : Z.map((H, E) => ZD.default.createElement(C, {
    key: E
  }, H)) : ZD.default.createElement(C, {
    dimColor: !0
  }, "No changes detected")), ZD.default.createElement(C, null, "Would you like to stash these changes and continue with teleport?"), X ? ZD.default.createElement(T, null, ZD.default.createElement(W9, null), ZD.default.createElement(C, null, " Stashing changes...")) : ZD.default.createElement(k0, {
    options: [{
      label: "Stash changes and continue",
      value: "stash"
    }, {
      label: "Exit",
      value: "exit"
    }],
    onChange: V
  }))
}
// @from(Ln 357102, Col 4)
ZD
// @from(Ln 357102, Col 8)
o6A
// @from(Ln 357103, Col 4)
vu2 = w(() => {
  fA();
  ZI();
  T1();
  yG();
  u8();
  B2();
  rY();
  ZD = c(QA(), 1), o6A = c(QA(), 1)
})
// @from(Ln 357113, Col 0)
async function AEA() {
  let A = g4()?.accessToken;
  if (!A) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let Q = await Wv();
  if (!Q) throw Error("Unable to get organization UUID");
  let B = `${v9().BASE_API_URL}/v1/environment_providers`;
  try {
    let G = {
        ...IV(A),
        "x-organization-uuid": Q
      },
      Z = await xQ.get(B, {
        headers: G,
        timeout: 15000
      });
    if (Z.status !== 200) throw Error(`Failed to fetch environments: ${Z.status} ${Z.statusText}`);
    return Z.data.environments
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw e(Z), Error(`Failed to fetch environments: ${Z.message}`)
  }
}
// @from(Ln 357135, Col 4)
UK1 = w(() => {
  j5();
  JX();
  Q2();
  JL();
  v1();
  zf()
})
// @from(Ln 357143, Col 0)
async function qK1() {
  if (!qB()) return !1;
  return xR()
}
// @from(Ln 357147, Col 0)
async function ku2() {
  return await LQA()
}
// @from(Ln 357150, Col 0)
async function bu2() {
  try {
    return (await AEA()).length > 0
  } catch (A) {
    return k(`checkHasRemoteEnvironment failed: ${A instanceof Error?A.message:String(A)}`), !1
  }
}
// @from(Ln 357157, Col 0)
async function fu2() {
  return await aS() !== null
}
// @from(Ln 357160, Col 0)
async function hu2(A, Q) {
  try {
    let B = g4()?.accessToken;
    if (!B) return k("checkGithubAppInstalled: No access token found, assuming app not installed"), !1;
    let G = await Wv();
    if (!G) return k("checkGithubAppInstalled: No org UUID found, assuming app not installed"), !1;
    let Z = `${v9().BASE_API_URL}/api/oauth/organizations/${G}/code/repos/${A}/${Q}`,
      Y = {
        ...IV(B),
        "x-organization-uuid": G
      };
    k(`Checking GitHub app installation for ${A}/${Q}`);
    let J = await xQ.get(Z, {
      headers: Y,
      timeout: 15000
    });
    if (J.status === 200) {
      if (J.data.status) {
        let X = J.data.status.app_installed;
        return k(`GitHub app ${X?"is":"is not"} installed on ${A}/${Q}`), X
      }
      return k(`GitHub app is not installed on ${A}/${Q} (status is null)`), !1
    }
    return k(`checkGithubAppInstalled: Unexpected response status ${J.status}`), !1
  } catch (B) {
    if (xQ.isAxiosError(B)) {
      let G = B.response?.status;
      if (G && G >= 400 && G < 500) return k(`checkGithubAppInstalled: Got ${G} error, app likely not installed on ${A}/${Q}`), !1
    }
    return k(`checkGithubAppInstalled error: ${B instanceof Error?B.message:String(B)}`), !1
  }
}
// @from(Ln 357192, Col 4)
Zq0 = w(() => {
  ZI();
  Q2();
  L6A();
  UK1();
  JL();
  JX();
  zf();
  j5();
  T1()
})
// @from(Ln 357204, Col 0)
function NK1({
  onComplete: A,
  errorsToIgnore: Q = new Set
}) {
  let [B, G] = VK.useState(null), [Z, Y] = VK.useState(!1), J = VK.useCallback(async () => {
    let V = await Yq0(),
      F = new Set(Array.from(V).filter((H) => !Q.has(H)));
    if (F.size === 0) {
      A();
      return
    }
    if (F.has("needsLogin")) G("needsLogin");
    else if (F.has("needsGitStash")) G("needsGitStash")
  }, [A, Q]);
  VK.useEffect(() => {
    J()
  }, [J]);
  let X = VK.useCallback(() => {
      f6(0)
    }, []),
    I = VK.useCallback(() => {
      Y(!1), J()
    }, [J]),
    D = VK.useCallback(() => {
      Y(!0)
    }, [Y]),
    W = VK.useCallback((V) => {
      if (V === "login") D();
      else X()
    }, [D, X]),
    K = VK.useCallback(() => {
      J()
    }, [J]);
  if (!B) return null;
  switch (B) {
    case "needsGitStash":
      return VK.default.createElement(yu2, {
        onStashAndContinue: K,
        onCancel: X
      });
    case "needsLogin": {
      if (Z) return VK.default.createElement(_s, {
        onDone: I,
        mode: "login",
        forceLoginMethod: "claudeai"
      });
      return VK.default.createElement(o9, {
        title: "Log in to Claude",
        onCancel: X,
        borderDimColor: !0
      }, VK.default.createElement(T, {
        flexDirection: "column"
      }, VK.default.createElement(C, {
        dimColor: !0
      }, "Teleport requires a Claude.ai account."), VK.default.createElement(C, {
        dimColor: !0
      }, "Your Claude Pro/Max subscription will be used by Claude Code.")), VK.default.createElement(k0, {
        options: [{
          label: "Login with Claude account",
          value: "login"
        }, {
          label: "Exit",
          value: "exit"
        }],
        onChange: W
      }))
    }
  }
}
// @from(Ln 357273, Col 0)
async function Yq0() {
  let A = new Set,
    [Q, B] = await Promise.all([qK1(), ku2()]);
  if (Q) A.add("needsLogin");
  if (!B) A.add("needsGitStash");
  return A
}
// @from(Ln 357280, Col 4)
VK
// @from(Ln 357281, Col 4)
Jq0 = w(() => {
  fA();
  rY();
  u8();
  RkA();
  vu2();
  yJ();
  Zq0();
  VK = c(QA(), 1)
})
// @from(Ln 357292, Col 0)
function uu2(A) {
  let Q = gu2.get(A);
  if (!Q) Q = ev(async (B, G, Z) => await Qi5(A, B, G, Z)), gu2.set(A, Q);
  return Q
}
// @from(Ln 357297, Col 0)
async function Qi5(A, Q, B, G) {
  for (let Z = 1; Z <= wK1; Z++) {
    try {
      let J = LK1.get(A),
        X = {
          ...G
        };
      if (J) X["Last-Uuid"] = J;
      let I = await xQ.put(B, Q, {
        headers: X,
        validateStatus: (D) => D < 500
      });
      if (I.status === 200 || I.status === 201) return LK1.set(A, Q.uuid), k(`Successfully persisted session log entry for session ${A}`), !0;
      if (I.status === 409) {
        if (I.headers["x-last-uuid"] === Q.uuid) return LK1.set(A, Q.uuid), k(`Session entry ${Q.uuid} already present on server, recovering from stale state`), OB("info", "session_persist_recovered_from_409"), !0;
        let K = I.data.error?.message || "Concurrent modification detected";
        return e(Error(`Session persistence conflict: UUID mismatch for session ${A}, entry ${Q.uuid}. ${K}`)), OB("error", "session_persist_fail_concurrent_modification"), !1
      }
      if (I.status === 401) return k("Session token expired or invalid"), OB("error", "session_persist_fail_bad_token"), !1;
      k(`Failed to persist session log: ${I.status} ${I.statusText}`), OB("error", "session_persist_fail_status", {
        status: I.status,
        attempt: Z
      })
    } catch (J) {
      let X = J;
      e(Error(`Error persisting session log: ${X.message}`)), OB("error", "session_persist_fail_status", {
        status: X.status,
        attempt: Z
      })
    }
    if (Z === wK1) return k(`Remote persistence failed after ${wK1} attempts`), OB("error", "session_persist_error_retries_exhausted", {
      attempt: Z
    }), !1;
    let Y = Math.min(Ai5 * Math.pow(2, Z - 1), 8000);
    k(`Remote persistence attempt ${Z}/${wK1} failed, retrying in ${Y}ms…`), await new Promise((J) => setTimeout(J, Y))
  }
  return !1
}
// @from(Ln 357335, Col 0)
async function mu2(A, Q, B) {
  let G = G4A();
  if (!G) return k("No session token available for session persistence"), OB("error", "session_persist_fail_jwt_no_token"), !1;
  let Z = {
    Authorization: `Bearer ${G}`,
    "Content-Type": "application/json"
  };
  return await uu2(A)(Q, B, Z)
}
// @from(Ln 357344, Col 0)
async function du2(A, Q) {
  try {
    let {
      accessToken: B,
      orgUUID: G
    } = await oS(), Z = `${v9().BASE_API_URL}/v1/session_ingress/session/${A}`, Y = {
      ...IV(B),
      "x-organization-uuid": G
    };
    return await uu2(A)(Q, Z, Y)
  } catch (B) {
    return k(`Failed to get OAuth credentials: ${B instanceof Error?B.message:String(B)}`), OB("error", "session_persist_fail_oauth_no_token"), !1
  }
}
// @from(Ln 357358, Col 0)
async function cu2(A, Q) {
  let B = G4A();
  if (!B) return k("No session token available for fetching session logs"), OB("error", "session_get_fail_no_token"), null;
  let G = {
      Authorization: `Bearer ${B}`
    },
    Z = await lu2(A, Q, G);
  if (Z && Z.length > 0) {
    let Y = Z[Z.length - 1];
    if (Y && "uuid" in Y && Y.uuid) LK1.set(A, Y.uuid)
  }
  return Z
}
// @from(Ln 357371, Col 0)
async function pu2(A, Q, B) {
  let G = `${v9().BASE_API_URL}/v1/session_ingress/session/${A}`;
  k(`[session-ingress] Fetching session logs from: ${G}`);
  let Z = {
    ...IV(Q),
    "x-organization-uuid": B
  };
  return await lu2(A, G, Z)
}
// @from(Ln 357380, Col 0)
async function lu2(A, Q, B) {
  try {
    let G = await xQ.get(Q, {
      headers: B,
      timeout: 1e4,
      validateStatus: (Z) => Z < 500
    });
    if (G.status === 200) {
      let Z = G.data;
      if (!Z || typeof Z !== "object" || !Array.isArray(Z.loglines)) return e(Error(`Invalid session logs response format: ${eA(Z)}`)), OB("error", "session_get_fail_invalid_response"), null;
      let Y = Z.loglines;
      return k(`Fetched ${Y.length} session logs for session ${A}`), Y
    }
    if (G.status === 404) return k(`No existing logs for session ${A}`), OB("warn", "session_get_no_logs_for_session"), [];
    if (G.status === 401) throw k("Auth token expired or invalid"), OB("error", "session_get_fail_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
    return k(`Failed to fetch session logs: ${G.status} ${G.statusText}`), OB("error", "session_get_fail_status", {
      status: G.status
    }), null
  } catch (G) {
    let Z = G;
    return e(Error(`Error fetching session logs: ${Z.message}`)), OB("error", "session_get_fail_status", {
      status: Z.status
    }), null
  }
}
// @from(Ln 357405, Col 4)
LK1
// @from(Ln 357405, Col 9)
wK1 = 10
// @from(Ln 357406, Col 2)
Ai5 = 500
// @from(Ln 357407, Col 2)
gu2
// @from(Ln 357408, Col 4)
OK1 = w(() => {
  j5();
  v1();
  T1();
  sG1();
  JX();
  zf();
  PL();
  A0();
  LK1 = new Map, gu2 = new Map
})
// @from(Ln 357423, Col 0)
function Zi5(A) {
  if (A === null) return hO("Session resumed", "suggestion");
  let Q = A instanceof uK ? A.formattedMessage : A.message;
  return hO(`Session resumed without branch: ${Q}`, "warning")
}
// @from(Ln 357429, Col 0)
function Yi5() {
  return H0({
    content: `This session is being continued from another machine. Application state may have changed. The updated working directory is ${EQ()}`,
    isMeta: !0
  })
}
// @from(Ln 357435, Col 0)
async function Xi5(A, Q) {
  let B = A.length > 75 ? A.slice(0, 75) + "…" : A,
    G = "claude/task";
  try {
    let Z = Ji5.replace("{description}", A),
      Y = "<title>",
      X = (await CF({
        systemPrompt: [],
        userPrompt: Z,
        assistantPrompt: "<title>",
        signal: Q,
        options: {
          querySource: "teleport_generate_title",
          agents: [],
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          mcpTools: []
        }
      })).message.content[0];
    if (X?.type === "text") {
      let I = "<title>" + X.text.trim(),
        D = I.match(/<title>(.*?)<\/title>/s),
        W = D ? D[1]?.trim() : B,
        K = I.match(/<branch>(.*?)<\/branch>/s),
        V = K ? K[1]?.trim() : "claude/task";
      return {
        title: W || B,
        branchName: V || "claude/task"
      }
    }
  } catch (Z) {
    e(Error(`Error generating title and branch: ${Z}`))
  }
  return {
    title: B,
    branchName: "claude/task"
  }
}
// @from(Ln 357473, Col 0)
async function _K1() {
  if (!await LQA()) throw l("tengu_teleport_error_git_not_clean", {}), new uK("Git working directory is not clean. Please commit or stash your changes before using --teleport.", I1.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`))
}
// @from(Ln 357477, Col 0)
async function Ii5(A) {
  let Q = A ? ["fetch", "origin", `${A}:${A}`] : ["fetch", "origin"],
    {
      code: B,
      stderr: G
    } = await TQ("git", Q);
  if (B !== 0)
    if (A && G.includes("refspec")) {
      k(`Specific branch fetch failed, trying to fetch ref: ${A}`);
      let {
        code: Z,
        stderr: Y
      } = await TQ("git", ["fetch", "origin", A]);
      if (Z !== 0) e(Error(`Failed to fetch from remote origin: ${Y}`))
    } else e(Error(`Failed to fetch from remote origin: ${G}`))
}
// @from(Ln 357493, Col 0)
async function Di5(A) {
  let {
    code: Q
  } = await TQ("git", ["rev-parse", "--abbrev-ref", `${A}@{upstream}`]);
  if (Q === 0) {
    k(`Branch '${A}' already has upstream set`);
    return
  }
  let {
    code: B
  } = await TQ("git", ["rev-parse", "--verify", `origin/${A}`]);
  if (B === 0) {
    k(`Setting upstream for '${A}' to 'origin/${A}'`);
    let {
      code: G,
      stderr: Z
    } = await TQ("git", ["branch", "--set-upstream-to", `origin/${A}`, A]);
    if (G !== 0) k(`Failed to set upstream for '${A}': ${Z}`);
    else k(`Successfully set upstream for '${A}'`)
  } else k(`Remote branch 'origin/${A}' does not exist, skipping upstream setup`)
}
// @from(Ln 357514, Col 0)
async function Wi5(A) {
  let {
    code: Q,
    stderr: B
  } = await TQ("git", ["checkout", A]);
  if (Q !== 0) {
    k(`Local checkout failed, trying to checkout from origin: ${B}`);
    let G = await TQ("git", ["checkout", "-b", A, "--track", `origin/${A}`]);
    if (Q = G.code, B = G.stderr, Q !== 0) {
      k(`Remote checkout with -b failed, trying without -b: ${B}`);
      let Z = await TQ("git", ["checkout", "--track", `origin/${A}`]);
      Q = Z.code, B = Z.stderr
    }
  }
  if (Q !== 0) throw l("tengu_teleport_error_branch_checkout_failed", {}), new uK(`Failed to checkout branch '${A}': ${B}`, I1.red(`Failed to checkout branch '${A}'
`));
  await Di5(A)
}
// @from(Ln 357532, Col 0)
async function MK1() {
  let {
    stdout: A
  } = await TQ("git", ["branch", "--show-current"]);
  return A.trim()
}
// @from(Ln 357539, Col 0)
function QEA(A, Q) {
  return [...dbA(A), Yi5(), Zi5(Q)]
}
// @from(Ln 357542, Col 0)
async function BEA(A) {
  try {
    let Q = await MK1();
    if (k(`Current branch before teleport: '${Q}'`), A) {
      k(`Switching to branch '${A}'...`), await Ii5(A), await Wi5(A);
      let G = await MK1();
      k(`Branch after checkout: '${G}'`)
    } else k("No branch specified, staying on current branch");
    return {
      branchName: await MK1(),
      branchError: null
    }
  } catch (Q) {
    let B = await MK1(),
      G = Q instanceof Error ? Q : Error(String(Q));
    return {
      branchName: B,
      branchError: G
    }
  }
}
// @from(Ln 357563, Col 0)
async function Xq0(A) {
  let Q = await aS(),
    B = A.session_context.sources.find((Z) => Z.type === "git_repository");
  if (!B?.url) return k(Q ? "Session has no associated repository, proceeding without validation" : "Session has no repo requirement and not in git directory, proceeding"), {
    status: "no_repo_required"
  };
  let G = w6A(B.url);
  if (!G) return {
    status: "no_repo_required"
  };
  if (k(`Session is for repository: ${G}, current repo: ${Q??"none"}`), !Q) return {
    status: "not_in_repo",
    sessionRepo: G,
    currentRepo: null
  };
  if (Q.toLowerCase() === G.toLowerCase()) return {
    status: "match",
    sessionRepo: G,
    currentRepo: Q
  };
  return {
    status: "mismatch",
    sessionRepo: G,
    currentRepo: Q
  }
}
// @from(Ln 357589, Col 0)
async function Yt(A, Q) {
  k(`Resuming code session ID: ${A}`);
  try {
    let B = g4()?.accessToken;
    if (!B) throw l("tengu_teleport_resume_error", {
      error_type: "no_access_token"
    }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let G = await Wv();
    if (!G) throw l("tengu_teleport_resume_error", {
      error_type: "no_org_uuid"
    }), Error("Unable to get organization UUID for constructing session URL");
    Q?.("validating");
    let Z = await xkA(A),
      Y = await Xq0(Z);
    switch (Y.status) {
      case "match":
      case "no_repo_required":
        break;
      case "not_in_repo":
        throw l("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
          sessionId: A
        }), new uK(`You must run claude --teleport ${A} from a checkout of ${Y.sessionRepo}.`, I1.red(`You must run claude --teleport ${A} from a checkout of ${I1.bold(Y.sessionRepo)}.
`));
      case "mismatch":
        throw l("tengu_teleport_error_repo_mismatch_sessions_api", {
          sessionId: A
        }), new uK(`You must run claude --teleport ${A} from a checkout of ${Y.sessionRepo}.
This repo is ${Y.currentRepo}.`, I1.red(`You must run claude --teleport ${A} from a checkout of ${I1.bold(Y.sessionRepo)}.
This repo is ${I1.bold(Y.currentRepo)}.
`));
      case "error":
        throw new uK(Y.errorMessage || "Failed to validate session repository", I1.red(`Error: ${Y.errorMessage||"Failed to validate session repository"}
`));
      default: {
        let J = Y.status;
        throw Error(`Unhandled repo validation status: ${J}`)
      }
    }
    return await Vi5(A, G, B, Q, Z)
  } catch (B) {
    if (B instanceof uK) throw B;
    let G = B instanceof Error ? B : Error(String(B));
    throw e(G), l("tengu_teleport_resume_error", {
      error_type: "resume_session_id_catch"
    }), new uK(G.message, I1.red(`Error: ${G.message}
`))
  }
}
// @from(Ln 357637, Col 0)
async function Ki5(A) {
  let Q = await Yq0();
  if (Q.size > 0) l("tengu_teleport_errors_detected", {
    error_types: Array.from(Q).join(","),
    errors_ignored: Array.from(A || []).join(",")
  }), await new Promise(async (B) => {
    let {
      unmount: G
    } = await Y5(RK1.default.createElement(b5, null, RK1.default.createElement(vJ, null, RK1.default.createElement(NK1, {
      errorsToIgnore: A,
      onComplete: () => {
        l("tengu_teleport_errors_resolved", {
          error_types: Array.from(Q).join(",")
        }), G(), B()
      }
    }))), FY(!1))
  })
}
// @from(Ln 357655, Col 0)
async function iu2(A, Q) {
  return await Ki5(new Set(["needsGitStash"])), cbA({
    initialMessage: A,
    signal: Q
  })
}
// @from(Ln 357661, Col 0)
async function Vi5(A, Q, B, G, Z) {
  let Y = Date.now();
  try {
    k(`[teleport] Starting fetch for session: ${A}`), G?.("fetching_logs");
    let J = Date.now(),
      X = await pu2(A, B, Q);
    if (k(`[teleport] Session logs fetched in ${Date.now()-J}ms`), X === null) throw Error("Failed to fetch session logs");
    let I = Date.now(),
      D = X.filter((K) => pbA(K) && !K.isSidechain);
    k(`[teleport] Filtered ${X.length} entries to ${D.length} messages in ${Date.now()-I}ms`), G?.("fetching_branch");
    let W = Z ? Vz0(Z) : void 0;
    if (W) k(`[teleport] Found branch: ${W}`);
    return k(`[teleport] Total teleportFromSessionsAPI time: ${Date.now()-Y}ms`), {
      log: D,
      branch: W
    }
  } catch (J) {
    let X = J instanceof Error ? J : Error(String(J));
    if (xQ.isAxiosError(J) && J.response?.status === 404) throw l("tengu_teleport_error_session_not_found_404", {
      sessionId: A
    }), new uK(`${A} not found.`, `${A} not found.
${I1.dim("Run /status in Claude Code to check your account.")}`);
    throw e(X), Error(`Failed to fetch session from Sessions API: ${X.message}`)
  }
}
// @from(Ln 357686, Col 0)
async function nu2(A) {
  let Q = g4()?.accessToken;
  if (!Q) throw Error("No access token for polling");
  let B = await Wv();
  if (!B) throw Error("No org UUID for polling");
  let G = IV(Q),
    Z = `${v9().BASE_API_URL}/v1/sessions/${A}/events`,
    Y = await xQ.get(Z, {
      headers: {
        ...G,
        "x-organization-uuid": B
      },
      timeout: 30000
    });
  if (Y.status !== 200) throw Error(`Failed to fetch session events: ${Y.statusText}`);
  let J = Y.data;
  if (!J?.data || !Array.isArray(J.data)) throw Error("Invalid events response");
  let X = [];
  for (let D of J.data)
    if (D && typeof D === "object" && "type" in D) {
      if (D.type === "env_manager_log" || D.type === "control_response") continue;
      if ("session_id" in D) X.push(D)
    } let I;
  try {
    let D = await xkA(A);
    I = Vz0(D)
  } catch {}
  return {
    log: X,
    branch: I
  }
}
// @from(Ln 357718, Col 0)
async function cbA(A) {
  let {
    initialMessage: Q,
    description: B,
    signal: G
  } = A;
  try {
    await xR();
    let Z = g4()?.accessToken;
    if (!Z) return e(Error("No access token found for remote session creation")), null;
    let Y = await Wv();
    if (!Y) return e(Error("Unable to get organization UUID for remote session creation")), null;
    let J = await aS(),
      X = null,
      I = null,
      {
        title: D,
        branchName: W
      } = await Xi5(B || Q || "Background task", G);
    if (J) {
      let [x, b] = J.split("/");
      if (x && b) X = {
        type: "git_repository",
        url: `https://github.com/${x}/${b}`,
        revision: A.branchName
      }, I = {
        type: "git_repository",
        git_info: {
          type: "github",
          repo: `${x}/${b}`,
          branches: [W]
        }
      };
      else e(Error(`Invalid repository format: ${J} - expected 'owner/name'`))
    }
    let K = await AEA();
    if (!K || K.length === 0) return e(Error("No environments available for session creation")), null;
    let F = jQ()?.remote?.defaultEnvironmentId,
      H = K[0];
    if (F) {
      let x = K.find((b) => b.environment_id === F);
      if (x) H = x, k(`Using configured default environment: ${F}`);
      else k(`Configured default environment ${F} not found in available environments, using first available`)
    }
    if (!H) return e(Error("No environments available for session creation")), null;
    let E = H.environment_id;
    k(`Selected environment: ${E} (${H.name})`);
    let z = `${v9().BASE_API_URL}/v1/sessions`,
      $ = {
        ...IV(Z),
        "x-organization-uuid": Y
      },
      O = {
        sources: X ? [X] : [],
        outcomes: I ? [I] : [],
        model: B5()
      },
      L = Q ? [{
        type: "event",
        data: {
          uuid: Gi5(),
          session_id: "",
          type: "user",
          parent_tool_use_id: null,
          message: {
            role: "user",
            content: Q
          }
        }
      }] : [],
      M = {
        title: D,
        events: L,
        session_context: O,
        environment_id: E
      };
    k(`Creating session with payload: ${eA(M,null,2)}`);
    let _ = await xQ.post(z, M, {
      headers: $,
      signal: G
    });
    if (_.status !== 200 && _.status !== 201) return e(Error(`API request failed with status ${_.status}: ${_.statusText}

Response data: ${eA(_.data,null,2)}`)), null;
    let j = _.data;
    if (j && typeof j.id === "string") return k(`Successfully created remote session: ${j.id}`), {
      id: j.id,
      title: j.title || D
    };
    return e(Error(`Cannot determine session ID from API response: ${eA(_.data)}`)), null
  } catch (Z) {
    let Y = Z instanceof Error ? Z : Error(String(Z));
    return e(Y), null
  }
}
// @from(Ln 357813, Col 4)
RK1
// @from(Ln 357813, Col 9)
Ji5 = `You are coming up with a succinct title and git branch name for a coding session based on the provided description. The title should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 6 words. Avoid using jargon or overly technical terms unless absolutely necessary. The title should be easy to understand for anyone reading it.
You should wrap the title in <title> tags.

The branch name should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 4 words. The branch should always start with "claude/" and should be all lower case, with words separated by dashes.
You should wrap the branch name in <branch> tags.

The title should always come first, followed by the branch. Do not include any other text other than the title and branch.

Example 1:
<title>Fix login button not working on mobile</title>
<branch>claude/fix-mobile-login-button</branch>

Example 2:
<title>Update README with installation instructions</title>
<branch>claude/update-readme</branch>

Example 3:
<title>Improve performance of data processing script</title>
<branch>claude/improve-data-processing</branch>

Here is the session description:
<description>{description}</description>
Please generate a title and branch name for this session.`
// @from(Ln 357838, Col 4)
Jt = w(() => {
  t4();
  ZI();
  eHA();
  Z3();
  XX();
  T1();
  v1();
  fA();
  hB();
  Kf();
  Jq0();
  Q2();
  JL();
  j5();
  JX();
  Q2();
  L6A();
  nY();
  l2();
  Z0();
  tQ();
  C0();
  zf();
  UK1();
  GB();
  OK1();
  d4();
  A0();
  Bc();
  RK1 = c(QA(), 1)
})