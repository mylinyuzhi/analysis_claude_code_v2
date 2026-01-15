
// @from(Ln 268310, Col 0)
function K82(A, Q) {
  if (!JK()) return;
  let B = HO(A),
    G = BV.get(B);
  if (!G) return;
  let Y = {
    duration_ms: Date.now() - G.startTime
  };
  if (Q) {
    if (Q.numSuccess !== void 0) Y.num_success = Q.numSuccess;
    if (Q.numBlocking !== void 0) Y.num_blocking = Q.numBlocking;
    if (Q.numNonBlockingError !== void 0) Y.num_non_blocking_error = Q.numNonBlockingError;
    if (Q.numCancelled !== void 0) Y.num_cancelled = Q.numCancelled
  }
  G.span.setAttributes(Y), G.span.end(), BV.delete(B)
}
// @from(Ln 268326, Col 4)
_X
// @from(Ln 268326, Col 8)
RVA
// @from(Ln 268326, Col 13)
_VA
// @from(Ln 268326, Col 18)
BV
// @from(Ln 268326, Col 22)
B82 = 0
// @from(Ln 268327, Col 4)
hr = w(() => {
  iZ1();
  fQ();
  uI0();
  rZ1();
  _X = c(p9(), 1), RVA = new G82, _VA = new G82, BV = new Map
})
// @from(Ln 268334, Col 4)
yNZ
// @from(Ln 268334, Col 9)
tZ1
// @from(Ln 268335, Col 4)
V82 = w(() => {
  j9();
  yNZ = k2.enum(["allow", "deny", "ask"]), tZ1 = k2.object({
    toolName: k2.string(),
    ruleContent: k2.string().optional()
  })
})
// @from(Ln 268342, Col 4)
TVA
// @from(Ln 268342, Col 9)
eZ1
// @from(Ln 268343, Col 4)
iI0 = w(() => {
  j9();
  V82();
  mL();
  TVA = k2.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"]), eZ1 = k2.discriminatedUnion("type", [k2.object({
    type: k2.literal("addRules"),
    rules: k2.array(tZ1),
    behavior: k2.enum(["allow", "deny", "ask"]),
    destination: TVA
  }), k2.object({
    type: k2.literal("replaceRules"),
    rules: k2.array(tZ1),
    behavior: k2.enum(["allow", "deny", "ask"]),
    destination: TVA
  }), k2.object({
    type: k2.literal("removeRules"),
    rules: k2.array(tZ1),
    behavior: k2.enum(["allow", "deny", "ask"]),
    destination: TVA
  }), k2.object({
    type: k2.literal("setMode"),
    mode: k$B,
    destination: TVA
  }), k2.object({
    type: k2.literal("addDirectories"),
    directories: k2.array(k2.string()),
    destination: TVA
  }), k2.object({
    type: k2.literal("removeDirectories"),
    directories: k2.array(k2.string()),
    destination: TVA
  })])
})
// @from(Ln 268377, Col 0)
function F82(A) {
  return !(("async" in A) && A.async === !0)
}
// @from(Ln 268381, Col 0)
function PVA(A) {
  return "async" in A && A.async === !0
}
// @from(Ln 268384, Col 4)
vG5
// @from(Ln 268384, Col 9)
kG5
// @from(Ln 268384, Col 14)
AY1
// @from(Ln 268385, Col 4)
nI0 = w(() => {
  j9();
  GVA();
  iI0();
  vG5 = m.object({
    async: m.literal(!0),
    asyncTimeout: m.number().optional()
  }), kG5 = m.object({
    continue: m.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
    suppressOutput: m.boolean().describe("Hide stdout from transcript (default: false)").optional(),
    stopReason: m.string().describe("Message shown when continue is false").optional(),
    decision: m.enum(["approve", "block"]).optional(),
    reason: m.string().describe("Explanation for the decision").optional(),
    systemMessage: m.string().describe("Warning message shown to the user").optional(),
    hookSpecificOutput: m.union([m.object({
      hookEventName: m.literal("PreToolUse"),
      permissionDecision: m.enum(["allow", "deny", "ask"]).optional(),
      permissionDecisionReason: m.string().optional(),
      updatedInput: m.record(m.string(), m.unknown()).optional()
    }), m.object({
      hookEventName: m.literal("UserPromptSubmit"),
      additionalContext: m.string().optional()
    }), m.object({
      hookEventName: m.literal("SessionStart"),
      additionalContext: m.string().optional()
    }), m.object({
      hookEventName: m.literal("SubagentStart"),
      additionalContext: m.string().optional()
    }), m.object({
      hookEventName: m.literal("PostToolUse"),
      additionalContext: m.string().optional(),
      updatedMCPToolOutput: m.unknown().describe("Updates the output for MCP tools").optional()
    }), m.object({
      hookEventName: m.literal("PostToolUseFailure"),
      additionalContext: m.string().optional()
    }), m.object({
      hookEventName: m.literal("PermissionRequest"),
      decision: m.union([m.object({
        behavior: m.literal("allow"),
        updatedInput: m.record(m.string(), m.unknown()).optional(),
        updatedPermissions: m.array(eZ1).optional()
      }), m.object({
        behavior: m.literal("deny"),
        message: m.string().optional(),
        interrupt: m.boolean().optional()
      })])
    })]).optional()
  }), AY1 = m.union([vG5, kG5])
})
// @from(Ln 268435, Col 0)
function u_(A, Q) {
  let B = c9();
  if (A.aborted || Q?.aborted) return B.abort(), {
    signal: B.signal,
    cleanup: () => {}
  };
  let G = () => {
    B.abort()
  };
  A.addEventListener("abort", G), Q?.addEventListener("abort", G);
  let Z = () => {
    A.removeEventListener("abort", G), Q?.removeEventListener("abort", G)
  };
  return {
    signal: B.signal,
    cleanup: Z
  }
}
// @from(Ln 268453, Col 4)
DyA = w(() => {
  iZ()
})
// @from(Ln 268457, Col 0)
function H82({
  processId: A,
  asyncResponse: Q,
  hookName: B,
  hookEvent: G,
  command: Z,
  shellCommand: Y,
  toolName: J
}) {
  let X = Q.asyncTimeout || 15000;
  k(`Hooks: Registering async hook ${A} (${B}) with timeout ${X}ms`), Td.set(A, {
    processId: A,
    hookName: B,
    hookEvent: G,
    toolName: J,
    command: Z,
    startTime: Date.now(),
    timeout: X,
    stdout: "",
    stderr: "",
    responseAttachmentSent: !1,
    shellCommand: Y
  })
}
// @from(Ln 268482, Col 0)
function E82(A, Q) {
  let B = Td.get(A);
  if (B) k(`Hooks: Adding stdout to ${A}: ${Q.substring(0,50)}...`), B.stdout += Q;
  else k(`Hooks: Attempted to add output to unknown process ${A}`)
}
// @from(Ln 268488, Col 0)
function z82(A, Q) {
  let B = Td.get(A);
  if (B) k(`Hooks: Adding stderr to ${A}: ${Q.substring(0,50)}...`), B.stderr += Q;
  else k(`Hooks: Attempted to add stderr to unknown process ${A}`)
}
// @from(Ln 268493, Col 0)
async function $82() {
  let A = [],
    Q = Td.size;
  k(`Hooks: Found ${Q} total hooks in registry`);
  let B = [];
  for (let G of Td.values()) {
    if (k(`Hooks: Checking hook ${G.processId} (${G.hookName}) - attachmentSent: ${G.responseAttachmentSent}, stdout length: ${G.stdout.length}`), !G.shellCommand) {
      k(`Hooks: Hook ${G.processId} has no shell command, removing from registry`), B.push(G.processId);
      continue
    }
    if (k(`Hooks: Hook shell status ${G.shellCommand.status}`), G.shellCommand.status === "killed") {
      k(`Hooks: Hook ${G.processId} is ${G.shellCommand.status}, removing from registry`), B.push(G.processId);
      continue
    }
    if (G.shellCommand.status !== "completed") continue;
    if (G.responseAttachmentSent || !G.stdout.trim()) {
      k(`Hooks: Skipping hook ${G.processId} - already delivered/sent or no stdout`), B.push(G.processId);
      continue
    }
    let Z = G.stdout.split(`
`);
    k(`Hooks: Processing ${Z.length} lines of stdout for ${G.processId}`);
    let J = (await G.shellCommand.result).code,
      X = {};
    for (let I of Z)
      if (I.trim().startsWith("{")) {
        k(`Hooks: Found JSON line: ${I.trim().substring(0,100)}...`);
        try {
          let D = AQ(I.trim());
          if (!("async" in D)) {
            k(`Hooks: Found sync response from ${G.processId}: ${eA(D)}`), X = D;
            break
          }
        } catch {
          k(`Hooks: Failed to parse JSON from ${G.processId}: ${I.trim()}`)
        }
      } if (A.push({
        processId: G.processId,
        response: X,
        hookName: G.hookName,
        hookEvent: G.hookEvent,
        toolName: G.toolName,
        stdout: G.stdout,
        stderr: G.stderr,
        exitCode: J
      }), G.responseAttachmentSent = !0, Td.delete(G.processId), G.hookEvent === "SessionStart") k(`Invalidating session env cache after SessionStart hook ${G.processId} completed`), xA2()
  }
  for (let G of B) Td.delete(G);
  return k(`Hooks: checkForNewResponses returning ${A.length} responses`), A
}
// @from(Ln 268544, Col 0)
function C82(A) {
  for (let Q of A) {
    let B = Td.get(Q);
    if (B && B.responseAttachmentSent) k(`Hooks: Removing delivered hook ${Q}`), Td.delete(Q)
  }
}
// @from(Ln 268550, Col 4)
Td
// @from(Ln 268551, Col 4)
aI0 = w(() => {
  T1();
  t51();
  A0();
  Td = new Map
})
// @from(Ln 268557, Col 0)
async function U82(A) {
  let Q;
  do Q = await A.next(); while (!Q.done);
  return Q.value
}
// @from(Ln 268562, Col 0)
async function* SVA(A, Q = 1 / 0) {
  let B = (Y) => {
      let J = Y.next().then(({
        done: X,
        value: I
      }) => ({
        done: X,
        value: I,
        generator: Y,
        promise: J
      }));
      return J
    },
    G = [...A],
    Z = new Set;
  while (Z.size < Q && G.length > 0) {
    let Y = G.shift();
    Z.add(B(Y))
  }
  while (Z.size > 0) {
    let {
      done: Y,
      value: J,
      generator: X,
      promise: I
    } = await Promise.race(Z);
    if (Z.delete(I), !Y) {
      if (Z.add(B(X)), J !== void 0) yield J
    } else if (G.length > 0) {
      let D = G.shift();
      Z.add(B(D))
    }
  }
}
// @from(Ln 268596, Col 0)
async function QY1(A) {
  let Q = [];
  for await (let B of A) Q.push(B);
  return Q
}
// @from(Ln 268601, Col 0)
async function* oI0(A) {
  for (let Q of A) yield Q
}
// @from(Ln 268604, Col 4)
oNZ
// @from(Ln 268605, Col 4)
gr = w(() => {
  oNZ = Symbol("NO_VALUE")
})
// @from(Ln 268609, Col 0)
function BY1(A, Q) {
  if (A.includes("$ARGUMENTS")) return A.replaceAll("$ARGUMENTS", Q);
  return A + `

ARGUMENTS: ${Q}`
}
// @from(Ln 268616, Col 0)
function q82() {
  return {
    ...LI0,
    inputSchema: WyA,
    inputJSONSchema: {
      type: "object",
      properties: {
        ok: {
          type: "boolean",
          description: "Whether the condition was met"
        },
        reason: {
          type: "string",
          description: "Reason, if the condition was not met"
        }
      },
      required: ["ok"],
      additionalProperties: !1
    },
    async prompt() {
      return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response."
    }
  }
}
// @from(Ln 268641, Col 0)
function GY1(A, Q) {
  f32(A, Q, "Stop", "", (B) => N82(B, JE), `You MUST call the ${JE} tool to complete this request. Call this tool now.`, {
    timeout: 5000
  })
}
// @from(Ln 268646, Col 4)
WyA
// @from(Ln 268647, Col 4)
ZY1 = w(() => {
  j9();
  Pr();
  vr();
  tQ();
  WyA = m.object({
    ok: m.boolean().describe("Whether the condition was met"),
    reason: m.string().describe("Reason, if the condition was not met").optional()
  })
})
// @from(Ln 268660, Col 0)
async function w82(A, Q, B, G, Z, Y, J, X) {
  let I = X || `hook-${bG5()}`;
  try {
    let D = BY1(A.prompt, G);
    k(`Hooks: Processing prompt hook with prompt: ${D}`);
    let W = H0({
        content: D
      }),
      K = J && J.length > 0 ? [...J, W] : [W];
    k(`Hooks: Querying model with ${K.length} messages`);
    let V = A.timeout ? A.timeout * 1000 : 30000,
      F = c9(),
      H = setTimeout(() => {
        F.abort()
      }, V),
      {
        signal: E,
        cleanup: z
      } = u_(Z, F.signal),
      $ = [...K, QU({
        content: "{"
      })];
    try {
      let O = await Pd({
        messages: $,
        systemPrompt: [`You are evaluating a hook in Claude Code.

CRITICAL: You MUST return ONLY valid JSON with no other text, explanation, or commentary before or after the JSON. Do not include any markdown code blocks, thinking, or additional text.

Your response must be a single JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}

Return the JSON object directly with no preamble or explanation.`],
        maxThinkingTokens: 0,
        tools: Y.options.tools,
        signal: E,
        options: {
          async getToolPermissionContext() {
            return (await Y.getAppState()).toolPermissionContext
          },
          model: A.model ?? SD(),
          toolChoice: void 0,
          isNonInteractiveSession: !0,
          hasAppendSystemPrompt: !1,
          agents: [],
          querySource: "hook_prompt",
          mcpTools: [],
          agentId: Y.agentId
        }
      });
      clearTimeout(H), z();
      let L = O.message.content.filter((x) => x.type === "text").map((x) => x.text).join("");
      Y.setResponseLength((x) => x + L.length);
      let M = ("{" + L).trim();
      k(`Hooks: Model response: ${M}`);
      let _ = c5(M);
      if (!_) return k(`Hooks: error parsing response as JSON: ${M}`), {
        hook: A,
        outcome: "non_blocking_error",
        message: X4({
          type: "hook_non_blocking_error",
          hookName: Q,
          toolUseID: I,
          hookEvent: B,
          stderr: "JSON validation failed",
          stdout: M,
          exitCode: 1
        })
      };
      let j = WyA.safeParse(_);
      if (!j.success) return k(`Hooks: model response does not conform to expected schema: ${j.error.message}`), {
        hook: A,
        outcome: "non_blocking_error",
        message: X4({
          type: "hook_non_blocking_error",
          hookName: Q,
          toolUseID: I,
          hookEvent: B,
          stderr: `Schema validation failed: ${j.error.message}`,
          stdout: M,
          exitCode: 1
        })
      };
      if (!j.data.ok) return k(`Hooks: Prompt hook condition was not met: ${j.data.reason}`), {
        hook: A,
        outcome: "blocking",
        blockingError: {
          blockingError: `Prompt hook condition was not met: ${j.data.reason}`,
          command: A.prompt
        },
        preventContinuation: !0,
        stopReason: j.data.reason
      };
      return k("Hooks: Prompt hook condition was met"), {
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
    } catch (O) {
      if (clearTimeout(H), z(), E.aborted) return {
        hook: A,
        outcome: "cancelled"
      };
      throw O
    }
  } catch (D) {
    let W = D instanceof Error ? D.message : String(D);
    return k(`Hooks: Prompt hook error: ${W}`), {
      hook: A,
      outcome: "non_blocking_error",
      message: X4({
        type: "hook_non_blocking_error",
        hookName: Q,
        toolUseID: I,
        hookEvent: B,
        stderr: `Error executing prompt hook: ${W}`,
        stdout: "",
        exitCode: 1
      })
    }
  }
}
// @from(Ln 268789, Col 4)
L82 = w(() => {
  T1();
  tQ();
  nY();
  l2();
  DyA();
  iZ();
  m_();
  vI();
  ZY1()
})
// @from(Ln 268801, Col 0)
function fG5(A) {
  let {
    tools: Q,
    disallowedTools: B
  } = A, G = Q && Q.length > 0, Z = B && B.length > 0;
  if (G && Z) {
    let Y = new Set(B),
      J = Q.filter((X) => !Y.has(X));
    if (J.length === 0) return "None";
    return J.join(", ")
  } else if (G) return Q.join(", ");
  else if (Z) return `All tools except ${B.join(", ")}`;
  return "All tools"
}
// @from(Ln 268815, Col 0)
async function O82(A) {
  let Q = A.map((B) => {
    let G = "";
    if (B?.forkContext) G = "Properties: " + (B?.forkContext ? "access to current context; " : "");
    let Z = fG5(B);
    return `- ${B.agentType}: ${B.whenToUse} (${G}Tools: ${Z})`
  }).join(`
`);
  return `Launch a new agent to handle complex, multi-step tasks autonomously. 

The ${f3} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${Q}

When using the ${f3} tool, you must specify a subagent_type parameter to select which agent type to use.

When NOT to use the ${f3} tool:
- If you want to read a specific file path, use the ${z3} or ${lI} tool instead of the ${f3} tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the ${lI} tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the ${z3} tool instead of the ${f3} tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above


Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do${N6()!=="pro"?`
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses`:""}
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.${!a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)?`
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, the tool result will include an output_file path. To check on the agent's progress or retrieve its results, use the ${z3} tool to read the output file, or use ${X9} with \`tail\` to see recent output. You can continue working while background agents run.`:""}
- Agents can be resumed using the \`resume\` parameter by passing the agent ID from a previous invocation. When resumed, the agent continues with its full previous context preserved. When NOT resuming, each invocation starts fresh and you should provide a detailed task description with all necessary context.
- When the agent is done, it will return a single message back to you along with its agent ID. You can use this ID to resume the agent later if needed for follow-up work.
- Provide clear, detailed prompts so the agent can work autonomously and return exactly the information you need.
- Agents with "access to current context" can see the full conversation history before the tool call. When using these agents, you can write concise prompts that reference earlier context (e.g., "investigate the error discussed above") instead of repeating information. The agent will receive all prior messages and understand the context.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${xVA.name} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.

Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent when to respond to user greetings with a friendly joke
</example_agent_description>

<example>
user: "Please write a function that checks if a number is prime"
assistant: Sure let me write a function that checks if a number is prime
assistant: First let me use the ${BY} tool to write a function that checks if a number is prime
assistant: I'm going to use the ${BY} tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a significant piece of code was written and the task was completed, now use the test-runner agent to run the tests
</commentary>
assistant: Now let me use the test-runner agent to run the tests
assistant: Uses the ${xVA.name} tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${xVA.name} tool to launch the greeting-responder agent"
</example>
`
}
// @from(Ln 268890, Col 4)
M82 = w(() => {
  YY1();
  cW();
  pL();
  Q2();
  fQ()
})
// @from(Ln 268898, Col 0)
function yVA(A) {
  if (A === "general-purpose") return;
  let B = Yq1().get(A);
  if (B && SN.includes(B)) return fb[B];
  return
}
// @from(Ln 268905, Col 0)
function vVA(A, Q) {
  let B = Yq1();
  if (!Q) {
    B.delete(A);
    return
  }
  if (SN.includes(Q)) B.set(A, Q)
}
// @from(Ln 268913, Col 4)
SN
// @from(Ln 268913, Col 8)
fb
// @from(Ln 268914, Col 4)
EO = w(() => {
  C0();
  SN = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"], fb = {
    red: "red_FOR_SUBAGENTS_ONLY",
    blue: "blue_FOR_SUBAGENTS_ONLY",
    green: "green_FOR_SUBAGENTS_ONLY",
    yellow: "yellow_FOR_SUBAGENTS_ONLY",
    purple: "purple_FOR_SUBAGENTS_ONLY",
    orange: "orange_FOR_SUBAGENTS_ONLY",
    pink: "pink_FOR_SUBAGENTS_ONLY",
    cyan: "cyan_FOR_SUBAGENTS_ONLY"
  }
})
// @from(Ln 268931, Col 0)
function BU(A) {
  if (typeof A !== "string") return null;
  return gG5.test(A) ? A : null
}
// @from(Ln 268936, Col 0)
function LS() {
  return `a${hG5(3).toString("hex")}`
}
// @from(Ln 268939, Col 4)
gG5
// @from(Ln 268940, Col 4)
d_ = w(() => {
  gG5 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
})
// @from(Ln 268943, Col 4)
VyA = U((RwZ, IY1) => {
  function j82(A) {
    return Array.isArray(A) ? A : [A]
  }
  var uG5 = void 0,
    sI0 = "",
    R82 = " ",
    rI0 = "\\",
    mG5 = /^\s+$/,
    dG5 = /(?:[^\\]|^)\\$/,
    cG5 = /^\\!/,
    pG5 = /^\\#/,
    lG5 = /\r?\n/g,
    iG5 = /^\.{0,2}\/|^\.{1,2}$/,
    nG5 = /\/$/,
    kVA = "/",
    T82 = "node-ignore";
  if (typeof Symbol < "u") T82 = Symbol.for("node-ignore");
  var P82 = T82,
    bVA = (A, Q, B) => {
      return Object.defineProperty(A, Q, {
        value: B
      }), B
    },
    aG5 = /([0-z])-([0-z])/g,
    S82 = () => !1,
    oG5 = (A) => A.replace(aG5, (Q, B, G) => B.charCodeAt(0) <= G.charCodeAt(0) ? Q : sI0),
    rG5 = (A) => {
      let {
        length: Q
      } = A;
      return A.slice(0, Q - Q % 2)
    },
    sG5 = [
      [/^\uFEFF/, () => sI0],
      [/((?:\\\\)*?)(\\?\s+)$/, (A, Q, B) => Q + (B.indexOf("\\") === 0 ? R82 : sI0)],
      [/(\\+?)\s/g, (A, Q) => {
        let {
          length: B
        } = Q;
        return Q.slice(0, B - B % 2) + R82
      }],
      [/[\\$.|*+(){^]/g, (A) => `\\${A}`],
      [/(?!\\)\?/g, () => "[^/]"],
      [/^\//, () => "^"],
      [/\//g, () => "\\/"],
      [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
      [/^(?=[^^])/, function () {
        return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^"
      }],
      [/\\\/\\\*\\\*(?=\\\/|$)/g, (A, Q, B) => Q + 6 < B.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
      [/(^|[^\\]+)(\\\*)+(?=.+)/g, (A, Q, B) => {
        let G = B.replace(/\\\*/g, "[^\\/]*");
        return Q + G
      }],
      [/\\\\\\(?=[$.|*+(){^])/g, () => rI0],
      [/\\\\/g, () => rI0],
      [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (A, Q, B, G, Z) => Q === rI0 ? `\\[${B}${rG5(G)}${Z}` : Z === "]" ? G.length % 2 === 0 ? `[${oG5(B)}${G}]` : "[]" : "[]"],
      [/(?:[^*])$/, (A) => /\/$/.test(A) ? `${A}$` : `${A}(?=$|\\/$)`]
    ],
    tG5 = /(^|\\\/)?\\\*$/,
    KyA = "regex",
    JY1 = "checkRegex",
    _82 = "_",
    eG5 = {
      [KyA](A, Q) {
        return `${Q?`${Q}[^/]+`:"[^/]*"}(?=$|\\/$)`
      },
      [JY1](A, Q) {
        return `${Q?`${Q}[^/]*`:"[^/]*"}(?=$|\\/$)`
      }
    },
    AZ5 = (A) => sG5.reduce((Q, [B, G]) => Q.replace(B, G.bind(A)), A),
    XY1 = (A) => typeof A === "string",
    QZ5 = (A) => A && XY1(A) && !mG5.test(A) && !dG5.test(A) && A.indexOf("#") !== 0,
    BZ5 = (A) => A.split(lG5).filter(Boolean);
  class x82 {
    constructor(A, Q, B, G, Z, Y) {
      this.pattern = A, this.mark = Q, this.negative = Z, bVA(this, "body", B), bVA(this, "ignoreCase", G), bVA(this, "regexPrefix", Y)
    }
    get regex() {
      let A = _82 + KyA;
      if (this[A]) return this[A];
      return this._make(KyA, A)
    }
    get checkRegex() {
      let A = _82 + JY1;
      if (this[A]) return this[A];
      return this._make(JY1, A)
    }
    _make(A, Q) {
      let B = this.regexPrefix.replace(tG5, eG5[A]),
        G = this.ignoreCase ? new RegExp(B, "i") : new RegExp(B);
      return bVA(this, Q, G)
    }
  }
  var GZ5 = ({
    pattern: A,
    mark: Q
  }, B) => {
    let G = !1,
      Z = A;
    if (Z.indexOf("!") === 0) G = !0, Z = Z.substr(1);
    Z = Z.replace(cG5, "!").replace(pG5, "#");
    let Y = AZ5(Z);
    return new x82(A, Q, Z, B, G, Y)
  };
  class y82 {
    constructor(A) {
      this._ignoreCase = A, this._rules = []
    }
    _add(A) {
      if (A && A[P82]) {
        this._rules = this._rules.concat(A._rules._rules), this._added = !0;
        return
      }
      if (XY1(A)) A = {
        pattern: A
      };
      if (QZ5(A.pattern)) {
        let Q = GZ5(A, this._ignoreCase);
        this._added = !0, this._rules.push(Q)
      }
    }
    add(A) {
      return this._added = !1, j82(XY1(A) ? BZ5(A) : A).forEach(this._add, this), this._added
    }
    test(A, Q, B) {
      let G = !1,
        Z = !1,
        Y;
      this._rules.forEach((X) => {
        let {
          negative: I
        } = X;
        if (Z === I && G !== Z || I && !G && !Z && !Q) return;
        if (!X[B].test(A)) return;
        G = !I, Z = I, Y = I ? uG5 : X
      });
      let J = {
        ignored: G,
        unignored: Z
      };
      if (Y) J.rule = Y;
      return J
    }
  }
  var ZZ5 = (A, Q) => {
      throw new Q(A)
    },
    Sd = (A, Q, B) => {
      if (!XY1(A)) return B(`path must be a string, but got \`${Q}\``, TypeError);
      if (!A) return B("path must not be empty", TypeError);
      if (Sd.isNotRelative(A)) return B(`path should be a \`path.relative()\`d string, but got "${Q}"`, RangeError);
      return !0
    },
    v82 = (A) => iG5.test(A);
  Sd.isNotRelative = v82;
  Sd.convert = (A) => A;
  class k82 {
    constructor({
      ignorecase: A = !0,
      ignoreCase: Q = A,
      allowRelativePaths: B = !1
    } = {}) {
      bVA(this, P82, !0), this._rules = new y82(Q), this._strictPathCheck = !B, this._initCache()
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
      let Z = A && Sd.convert(A);
      return Sd(Z, A, this._strictPathCheck ? ZZ5 : S82), this._t(Z, Q, B, G)
    }
    checkIgnore(A) {
      if (!nG5.test(A)) return this.test(A);
      let Q = A.split(kVA).filter(Boolean);
      if (Q.pop(), Q.length) {
        let B = this._t(Q.join(kVA) + kVA, this._testCache, !0, Q);
        if (B.ignored) return B
      }
      return this._rules.test(A, !1, JY1)
    }
    _t(A, Q, B, G) {
      if (A in Q) return Q[A];
      if (!G) G = A.split(kVA).filter(Boolean);
      if (G.pop(), !G.length) return Q[A] = this._rules.test(A, B, KyA);
      let Z = this._t(G.join(kVA) + kVA, Q, B, G);
      return Q[A] = Z.ignored ? Z : this._rules.test(A, B, KyA)
    }
    ignores(A) {
      return this._test(A, this._ignoreCache, !1).ignored
    }
    createFilter() {
      return (A) => !this.ignores(A)
    }
    filter(A) {
      return j82(A).filter(this.createFilter())
    }
    test(A) {
      return this._test(A, this._testCache, !0)
    }
  }
  var tI0 = (A) => new k82(A),
    YZ5 = (A) => Sd(A && Sd.convert(A), A, S82),
    b82 = () => {
      let A = (B) => /^\\\\\?\\/.test(B) || /["<>|\u0000-\u001F]+/u.test(B) ? B : B.replace(/\\/g, "/");
      Sd.convert = A;
      let Q = /^[a-z]:\//i;
      Sd.isNotRelative = (B) => Q.test(B) || v82(B)
    };
  if (typeof process < "u" && process.platform === "win32") b82();
  IY1.exports = tI0;
  tI0.default = tI0;
  IY1.exports.isPathValid = YZ5;
  bVA(IY1.exports, Symbol.for("setupWindows"), b82)
})
// @from(Ln 269168, Col 0)
function AD0() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  }
}
// @from(Ln 269183, Col 0)
function d82(A) {
  q4A = A
}
// @from(Ln 269187, Col 0)
function KZ(A, Q = "") {
  let B = typeof A === "string" ? A : A.source,
    G = {
      replace: (Z, Y) => {
        let J = typeof Y === "string" ? Y : Y.source;
        return J = J.replace(GU.caret, "$1"), B = B.replace(Z, J), G
      },
      getRegex: () => {
        return new RegExp(B, Q)
      }
    };
  return G
}
// @from(Ln 269201, Col 0)
function hb(A, Q) {
  if (Q) {
    if (GU.escapeTest.test(A)) return A.replace(GU.escapeReplace, h82)
  } else if (GU.escapeTestNoEncode.test(A)) return A.replace(GU.escapeReplaceNoEncode, h82);
  return A
}
// @from(Ln 269208, Col 0)
function g82(A) {
  try {
    A = encodeURI(A).replace(GU.percentDecode, "%")
  } catch {
    return null
  }
  return A
}
// @from(Ln 269217, Col 0)
function u82(A, Q) {
  let B = A.replace(GU.findPipe, (Y, J, X) => {
      let I = !1,
        D = J;
      while (--D >= 0 && X[D] === "\\") I = !I;
      if (I) return "|";
      else return " |"
    }),
    G = B.split(GU.splitPipe),
    Z = 0;
  if (!G[0].trim()) G.shift();
  if (G.length > 0 && !G.at(-1)?.trim()) G.pop();
  if (Q)
    if (G.length > Q) G.splice(Q);
    else
      while (G.length < Q) G.push("");
  for (; Z < G.length; Z++) G[Z] = G[Z].trim().replace(GU.slashPipe, "|");
  return G
}
// @from(Ln 269237, Col 0)
function HyA(A, Q, B) {
  let G = A.length;
  if (G === 0) return "";
  let Z = 0;
  while (Z < G)
    if (A.charAt(G - Z - 1) === Q) Z++;
    else break;
  return A.slice(0, G - Z)
}
// @from(Ln 269247, Col 0)
function hZ5(A, Q) {
  if (A.indexOf(Q[1]) === -1) return -1;
  let B = 0;
  for (let G = 0; G < A.length; G++)
    if (A[G] === "\\") G++;
    else if (A[G] === Q[0]) B++;
  else if (A[G] === Q[1]) {
    if (B--, B < 0) return G
  }
  return -1
}
// @from(Ln 269259, Col 0)
function m82(A, Q, B, G, Z) {
  let Y = Q.href,
    J = Q.title || null,
    X = A[1].replace(Z.other.outputLinkReplace, "$1");
  if (A[0].charAt(0) !== "!") {
    G.state.inLink = !0;
    let I = {
      type: "link",
      raw: B,
      href: Y,
      title: J,
      text: X,
      tokens: G.inlineTokens(X)
    };
    return G.state.inLink = !1, I
  }
  return {
    type: "image",
    raw: B,
    href: Y,
    title: J,
    text: X
  }
}
// @from(Ln 269284, Col 0)
function gZ5(A, Q, B) {
  let G = A.match(B.other.indentCodeCompensation);
  if (G === null) return Q;
  let Z = G[1];
  return Q.split(`
`).map((Y) => {
    let J = Y.match(B.other.beginningSpace);
    if (J === null) return Y;
    let [X] = J;
    if (X.length >= Z.length) return Y.slice(Z.length);
    return Y
  }).join(`
`)
}
// @from(Ln 269298, Col 0)
class $yA {
  options;
  rules;
  lexer;
  constructor(A) {
    this.options = A || q4A
  }
  space(A) {
    let Q = this.rules.block.newline.exec(A);
    if (Q && Q[0].length > 0) return {
      type: "space",
      raw: Q[0]
    }
  }
  code(A) {
    let Q = this.rules.block.code.exec(A);
    if (Q) {
      let B = Q[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: Q[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? HyA(B, `
`) : B
      }
    }
  }
  fences(A) {
    let Q = this.rules.block.fences.exec(A);
    if (Q) {
      let B = Q[0],
        G = gZ5(B, Q[3] || "", this.rules);
      return {
        type: "code",
        raw: B,
        lang: Q[2] ? Q[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : Q[2],
        text: G
      }
    }
  }
  heading(A) {
    let Q = this.rules.block.heading.exec(A);
    if (Q) {
      let B = Q[2].trim();
      if (this.rules.other.endingHash.test(B)) {
        let G = HyA(B, "#");
        if (this.options.pedantic) B = G.trim();
        else if (!G || this.rules.other.endingSpaceChar.test(G)) B = G.trim()
      }
      return {
        type: "heading",
        raw: Q[0],
        depth: Q[1].length,
        text: B,
        tokens: this.lexer.inline(B)
      }
    }
  }
  hr(A) {
    let Q = this.rules.block.hr.exec(A);
    if (Q) return {
      type: "hr",
      raw: HyA(Q[0], `
`)
    }
  }
  blockquote(A) {
    let Q = this.rules.block.blockquote.exec(A);
    if (Q) {
      let B = HyA(Q[0], `
`).split(`
`),
        G = "",
        Z = "",
        Y = [];
      while (B.length > 0) {
        let J = !1,
          X = [],
          I;
        for (I = 0; I < B.length; I++)
          if (this.rules.other.blockquoteStart.test(B[I])) X.push(B[I]), J = !0;
          else if (!J) X.push(B[I]);
        else break;
        B = B.slice(I);
        let D = X.join(`
`),
          W = D.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        G = G ? `${G}
${D}` : D, Z = Z ? `${Z}
${W}` : W;
        let K = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(W, Y, !0), this.lexer.state.top = K, B.length === 0) break;
        let V = Y.at(-1);
        if (V?.type === "code") break;
        else if (V?.type === "blockquote") {
          let F = V,
            H = F.raw + `
` + B.join(`
`),
            E = this.blockquote(H);
          Y[Y.length - 1] = E, G = G.substring(0, G.length - F.raw.length) + E.raw, Z = Z.substring(0, Z.length - F.text.length) + E.text;
          break
        } else if (V?.type === "list") {
          let F = V,
            H = F.raw + `
` + B.join(`
`),
            E = this.list(H);
          Y[Y.length - 1] = E, G = G.substring(0, G.length - V.raw.length) + E.raw, Z = Z.substring(0, Z.length - F.raw.length) + E.raw, B = H.substring(Y.at(-1).raw.length).split(`
`);
          continue
        }
      }
      return {
        type: "blockquote",
        raw: G,
        tokens: Y,
        text: Z
      }
    }
  }
  list(A) {
    let Q = this.rules.block.list.exec(A);
    if (Q) {
      let B = Q[1].trim(),
        G = B.length > 1,
        Z = {
          type: "list",
          raw: "",
          ordered: G,
          start: G ? +B.slice(0, -1) : "",
          loose: !1,
          items: []
        };
      if (B = G ? `\\d{1,9}\\${B.slice(-1)}` : `\\${B}`, this.options.pedantic) B = G ? B : "[*+-]";
      let Y = this.rules.other.listItemRegex(B),
        J = !1;
      while (A) {
        let I = !1,
          D = "",
          W = "";
        if (!(Q = Y.exec(A))) break;
        if (this.rules.block.hr.test(A)) break;
        D = Q[0], A = A.substring(D.length);
        let K = Q[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, ($) => " ".repeat(3 * $.length)),
          V = A.split(`
`, 1)[0],
          F = !K.trim(),
          H = 0;
        if (this.options.pedantic) H = 2, W = K.trimStart();
        else if (F) H = Q[1].length + 1;
        else H = Q[2].search(this.rules.other.nonSpaceChar), H = H > 4 ? 1 : H, W = K.slice(H), H += Q[1].length;
        if (F && this.rules.other.blankLine.test(V)) D += V + `
`, A = A.substring(V.length + 1), I = !0;
        if (!I) {
          let $ = this.rules.other.nextBulletRegex(H),
            O = this.rules.other.hrRegex(H),
            L = this.rules.other.fencesBeginRegex(H),
            M = this.rules.other.headingBeginRegex(H),
            _ = this.rules.other.htmlBeginRegex(H);
          while (A) {
            let j = A.split(`
`, 1)[0],
              x;
            if (V = j, this.options.pedantic) V = V.replace(this.rules.other.listReplaceNesting, "  "), x = V;
            else x = V.replace(this.rules.other.tabCharGlobal, "    ");
            if (L.test(V)) break;
            if (M.test(V)) break;
            if (_.test(V)) break;
            if ($.test(V)) break;
            if (O.test(V)) break;
            if (x.search(this.rules.other.nonSpaceChar) >= H || !V.trim()) W += `
` + x.slice(H);
            else {
              if (F) break;
              if (K.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
              if (L.test(K)) break;
              if (M.test(K)) break;
              if (O.test(K)) break;
              W += `
` + V
            }
            if (!F && !V.trim()) F = !0;
            D += j + `
`, A = A.substring(j.length + 1), K = x.slice(H)
          }
        }
        if (!Z.loose) {
          if (J) Z.loose = !0;
          else if (this.rules.other.doubleBlankLine.test(D)) J = !0
        }
        let E = null,
          z;
        if (this.options.gfm) {
          if (E = this.rules.other.listIsTask.exec(W), E) z = E[0] !== "[ ] ", W = W.replace(this.rules.other.listReplaceTask, "")
        }
        Z.items.push({
          type: "list_item",
          raw: D,
          task: !!E,
          checked: z,
          loose: !1,
          text: W,
          tokens: []
        }), Z.raw += D
      }
      let X = Z.items.at(-1);
      if (X) X.raw = X.raw.trimEnd(), X.text = X.text.trimEnd();
      else return;
      Z.raw = Z.raw.trimEnd();
      for (let I = 0; I < Z.items.length; I++)
        if (this.lexer.state.top = !1, Z.items[I].tokens = this.lexer.blockTokens(Z.items[I].text, []), !Z.loose) {
          let D = Z.items[I].tokens.filter((K) => K.type === "space"),
            W = D.length > 0 && D.some((K) => this.rules.other.anyLine.test(K.raw));
          Z.loose = W
        } if (Z.loose)
        for (let I = 0; I < Z.items.length; I++) Z.items[I].loose = !0;
      return Z
    }
  }
  html(A) {
    let Q = this.rules.block.html.exec(A);
    if (Q) return {
      type: "html",
      block: !0,
      raw: Q[0],
      pre: Q[1] === "pre" || Q[1] === "script" || Q[1] === "style",
      text: Q[0]
    }
  }
  def(A) {
    let Q = this.rules.block.def.exec(A);
    if (Q) {
      let B = Q[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
        G = Q[2] ? Q[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
        Z = Q[3] ? Q[3].substring(1, Q[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : Q[3];
      return {
        type: "def",
        tag: B,
        raw: Q[0],
        href: G,
        title: Z
      }
    }
  }
  table(A) {
    let Q = this.rules.block.table.exec(A);
    if (!Q) return;
    if (!this.rules.other.tableDelimiter.test(Q[2])) return;
    let B = u82(Q[1]),
      G = Q[2].replace(this.rules.other.tableAlignChars, "").split("|"),
      Z = Q[3]?.trim() ? Q[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [],
      Y = {
        type: "table",
        raw: Q[0],
        header: [],
        align: [],
        rows: []
      };
    if (B.length !== G.length) return;
    for (let J of G)
      if (this.rules.other.tableAlignRight.test(J)) Y.align.push("right");
      else if (this.rules.other.tableAlignCenter.test(J)) Y.align.push("center");
    else if (this.rules.other.tableAlignLeft.test(J)) Y.align.push("left");
    else Y.align.push(null);
    for (let J = 0; J < B.length; J++) Y.header.push({
      text: B[J],
      tokens: this.lexer.inline(B[J]),
      header: !0,
      align: Y.align[J]
    });
    for (let J of Z) Y.rows.push(u82(J, Y.header.length).map((X, I) => {
      return {
        text: X,
        tokens: this.lexer.inline(X),
        header: !1,
        align: Y.align[I]
      }
    }));
    return Y
  }
  lheading(A) {
    let Q = this.rules.block.lheading.exec(A);
    if (Q) return {
      type: "heading",
      raw: Q[0],
      depth: Q[2].charAt(0) === "=" ? 1 : 2,
      text: Q[1],
      tokens: this.lexer.inline(Q[1])
    }
  }
  paragraph(A) {
    let Q = this.rules.block.paragraph.exec(A);
    if (Q) {
      let B = Q[1].charAt(Q[1].length - 1) === `
` ? Q[1].slice(0, -1) : Q[1];
      return {
        type: "paragraph",
        raw: Q[0],
        text: B,
        tokens: this.lexer.inline(B)
      }
    }
  }
  text(A) {
    let Q = this.rules.block.text.exec(A);
    if (Q) return {
      type: "text",
      raw: Q[0],
      text: Q[0],
      tokens: this.lexer.inline(Q[0])
    }
  }
  escape(A) {
    let Q = this.rules.inline.escape.exec(A);
    if (Q) return {
      type: "escape",
      raw: Q[0],
      text: Q[1]
    }
  }
  tag(A) {
    let Q = this.rules.inline.tag.exec(A);
    if (Q) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(Q[0])) this.lexer.state.inLink = !0;
      else if (this.lexer.state.inLink && this.rules.other.endATag.test(Q[0])) this.lexer.state.inLink = !1;
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(Q[0])) this.lexer.state.inRawBlock = !0;
      else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(Q[0])) this.lexer.state.inRawBlock = !1;
      return {
        type: "html",
        raw: Q[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: Q[0]
      }
    }
  }
  link(A) {
    let Q = this.rules.inline.link.exec(A);
    if (Q) {
      let B = Q[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(B)) {
        if (!this.rules.other.endAngleBracket.test(B)) return;
        let Y = HyA(B.slice(0, -1), "\\");
        if ((B.length - Y.length) % 2 === 0) return
      } else {
        let Y = hZ5(Q[2], "()");
        if (Y > -1) {
          let X = (Q[0].indexOf("!") === 0 ? 5 : 4) + Q[1].length + Y;
          Q[2] = Q[2].substring(0, Y), Q[0] = Q[0].substring(0, X).trim(), Q[3] = ""
        }
      }
      let G = Q[2],
        Z = "";
      if (this.options.pedantic) {
        let Y = this.rules.other.pedanticHrefTitle.exec(G);
        if (Y) G = Y[1], Z = Y[3]
      } else Z = Q[3] ? Q[3].slice(1, -1) : "";
      if (G = G.trim(), this.rules.other.startAngleBracket.test(G))
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(B)) G = G.slice(1);
        else G = G.slice(1, -1);
      return m82(Q, {
        href: G ? G.replace(this.rules.inline.anyPunctuation, "$1") : G,
        title: Z ? Z.replace(this.rules.inline.anyPunctuation, "$1") : Z
      }, Q[0], this.lexer, this.rules)
    }
  }
  reflink(A, Q) {
    let B;
    if ((B = this.rules.inline.reflink.exec(A)) || (B = this.rules.inline.nolink.exec(A))) {
      let G = (B[2] || B[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
        Z = Q[G.toLowerCase()];
      if (!Z) {
        let Y = B[0].charAt(0);
        return {
          type: "text",
          raw: Y,
          text: Y
        }
      }
      return m82(B, Z, B[0], this.lexer, this.rules)
    }
  }
  emStrong(A, Q, B = "") {
    let G = this.rules.inline.emStrongLDelim.exec(A);
    if (!G) return;
    if (G[3] && B.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(G[1] || G[2]) || !B || this.rules.inline.punctuation.exec(B)) {
      let Y = [...G[0]].length - 1,
        J, X, I = Y,
        D = 0,
        W = G[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      W.lastIndex = 0, Q = Q.slice(-1 * A.length + Y);
      while ((G = W.exec(Q)) != null) {
        if (J = G[1] || G[2] || G[3] || G[4] || G[5] || G[6], !J) continue;
        if (X = [...J].length, G[3] || G[4]) {
          I += X;
          continue
        } else if (G[5] || G[6]) {
          if (Y % 3 && !((Y + X) % 3)) {
            D += X;
            continue
          }
        }
        if (I -= X, I > 0) continue;
        X = Math.min(X, X + I + D);
        let K = [...G[0]][0].length,
          V = A.slice(0, Y + G.index + K + X);
        if (Math.min(Y, X) % 2) {
          let H = V.slice(1, -1);
          return {
            type: "em",
            raw: V,
            text: H,
            tokens: this.lexer.inlineTokens(H)
          }
        }
        let F = V.slice(2, -2);
        return {
          type: "strong",
          raw: V,
          text: F,
          tokens: this.lexer.inlineTokens(F)
        }
      }
    }
  }
  codespan(A) {
    let Q = this.rules.inline.code.exec(A);
    if (Q) {
      let B = Q[2].replace(this.rules.other.newLineCharGlobal, " "),
        G = this.rules.other.nonSpaceChar.test(B),
        Z = this.rules.other.startingSpaceChar.test(B) && this.rules.other.endingSpaceChar.test(B);
      if (G && Z) B = B.substring(1, B.length - 1);
      return {
        type: "codespan",
        raw: Q[0],
        text: B
      }
    }
  }
  br(A) {
    let Q = this.rules.inline.br.exec(A);
    if (Q) return {
      type: "br",
      raw: Q[0]
    }
  }
  del(A) {
    let Q = this.rules.inline.del.exec(A);
    if (Q) return {
      type: "del",
      raw: Q[0],
      text: Q[2],
      tokens: this.lexer.inlineTokens(Q[2])
    }
  }
  autolink(A) {
    let Q = this.rules.inline.autolink.exec(A);
    if (Q) {
      let B, G;
      if (Q[2] === "@") B = Q[1], G = "mailto:" + B;
      else B = Q[1], G = B;
      return {
        type: "link",
        raw: Q[0],
        text: B,
        href: G,
        tokens: [{
          type: "text",
          raw: B,
          text: B
        }]
      }
    }
  }
  url(A) {
    let Q;
    if (Q = this.rules.inline.url.exec(A)) {
      let B, G;
      if (Q[2] === "@") B = Q[0], G = "mailto:" + B;
      else {
        let Z;
        do Z = Q[0], Q[0] = this.rules.inline._backpedal.exec(Q[0])?.[0] ?? ""; while (Z !== Q[0]);
        if (B = Q[0], Q[1] === "www.") G = "http://" + Q[0];
        else G = Q[0]
      }
      return {
        type: "link",
        raw: Q[0],
        text: B,
        href: G,
        tokens: [{
          type: "text",
          raw: B,
          text: B
        }]
      }
    }
  }
  inlineText(A) {
    let Q = this.rules.inline.text.exec(A);
    if (Q) {
      let B = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: Q[0],
        text: Q[0],
        escaped: B
      }
    }
  }
}
// @from(Ln 269815, Col 0)
class ZU {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(A) {
    this.tokens = [], this.tokens.links = Object.create(null), this.options = A || q4A, this.options.tokenizer = this.options.tokenizer || new $yA, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    let Q = {
      other: GU,
      block: DY1.normal,
      inline: FyA.normal
    };
    if (this.options.pedantic) Q.block = DY1.pedantic, Q.inline = FyA.pedantic;
    else if (this.options.gfm)
      if (Q.block = DY1.gfm, this.options.breaks) Q.inline = FyA.breaks;
      else Q.inline = FyA.gfm;
    this.tokenizer.rules = Q
  }
  static get rules() {
    return {
      block: DY1,
      inline: FyA
    }
  }
  static lex(A, Q) {
    return new ZU(Q).lex(A)
  }
  static lexInline(A, Q) {
    return new ZU(Q).inlineTokens(A)
  }
  lex(A) {
    A = A.replace(GU.carriageReturn, `
`), this.blockTokens(A, this.tokens);
    for (let Q = 0; Q < this.inlineQueue.length; Q++) {
      let B = this.inlineQueue[Q];
      this.inlineTokens(B.src, B.tokens)
    }
    return this.inlineQueue = [], this.tokens
  }
  blockTokens(A, Q = [], B = !1) {
    if (this.options.pedantic) A = A.replace(GU.tabCharGlobal, "    ").replace(GU.spaceLine, "");
    while (A) {
      let G;
      if (this.options.extensions?.block?.some((Y) => {
          if (G = Y.call({
              lexer: this
            }, A, Q)) return A = A.substring(G.raw.length), Q.push(G), !0;
          return !1
        })) continue;
      if (G = this.tokenizer.space(A)) {
        A = A.substring(G.raw.length);
        let Y = Q.at(-1);
        if (G.raw.length === 1 && Y !== void 0) Y.raw += `
`;
        else Q.push(G);
        continue
      }
      if (G = this.tokenizer.code(A)) {
        A = A.substring(G.raw.length);
        let Y = Q.at(-1);
        if (Y?.type === "paragraph" || Y?.type === "text") Y.raw += `
` + G.raw, Y.text += `
` + G.text, this.inlineQueue.at(-1).src = Y.text;
        else Q.push(G);
        continue
      }
      if (G = this.tokenizer.fences(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.heading(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.hr(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.blockquote(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.list(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.html(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.def(A)) {
        A = A.substring(G.raw.length);
        let Y = Q.at(-1);
        if (Y?.type === "paragraph" || Y?.type === "text") Y.raw += `
` + G.raw, Y.text += `
` + G.raw, this.inlineQueue.at(-1).src = Y.text;
        else if (!this.tokens.links[G.tag]) this.tokens.links[G.tag] = {
          href: G.href,
          title: G.title
        };
        continue
      }
      if (G = this.tokenizer.table(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.lheading(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      let Z = A;
      if (this.options.extensions?.startBlock) {
        let Y = 1 / 0,
          J = A.slice(1),
          X;
        if (this.options.extensions.startBlock.forEach((I) => {
            if (X = I.call({
                lexer: this
              }, J), typeof X === "number" && X >= 0) Y = Math.min(Y, X)
          }), Y < 1 / 0 && Y >= 0) Z = A.substring(0, Y + 1)
      }
      if (this.state.top && (G = this.tokenizer.paragraph(Z))) {
        let Y = Q.at(-1);
        if (B && Y?.type === "paragraph") Y.raw += `
` + G.raw, Y.text += `
` + G.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = Y.text;
        else Q.push(G);
        B = Z.length !== A.length, A = A.substring(G.raw.length);
        continue
      }
      if (G = this.tokenizer.text(A)) {
        A = A.substring(G.raw.length);
        let Y = Q.at(-1);
        if (Y?.type === "text") Y.raw += `
` + G.raw, Y.text += `
` + G.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = Y.text;
        else Q.push(G);
        continue
      }
      if (A) {
        let Y = "Infinite loop on byte: " + A.charCodeAt(0);
        if (this.options.silent) {
          console.error(Y);
          break
        } else throw Error(Y)
      }
    }
    return this.state.top = !0, Q
  }
  inline(A, Q = []) {
    return this.inlineQueue.push({
      src: A,
      tokens: Q
    }), Q
  }
  inlineTokens(A, Q = []) {
    let B = A,
      G = null;
    if (this.tokens.links) {
      let J = Object.keys(this.tokens.links);
      if (J.length > 0) {
        while ((G = this.tokenizer.rules.inline.reflinkSearch.exec(B)) != null)
          if (J.includes(G[0].slice(G[0].lastIndexOf("[") + 1, -1))) B = B.slice(0, G.index) + "[" + "a".repeat(G[0].length - 2) + "]" + B.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)
      }
    }
    while ((G = this.tokenizer.rules.inline.blockSkip.exec(B)) != null) B = B.slice(0, G.index) + "[" + "a".repeat(G[0].length - 2) + "]" + B.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    while ((G = this.tokenizer.rules.inline.anyPunctuation.exec(B)) != null) B = B.slice(0, G.index) + "++" + B.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let Z = !1,
      Y = "";
    while (A) {
      if (!Z) Y = "";
      Z = !1;
      let J;
      if (this.options.extensions?.inline?.some((I) => {
          if (J = I.call({
              lexer: this
            }, A, Q)) return A = A.substring(J.raw.length), Q.push(J), !0;
          return !1
        })) continue;
      if (J = this.tokenizer.escape(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.tag(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.link(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.reflink(A, this.tokens.links)) {
        A = A.substring(J.raw.length);
        let I = Q.at(-1);
        if (J.type === "text" && I?.type === "text") I.raw += J.raw, I.text += J.text;
        else Q.push(J);
        continue
      }
      if (J = this.tokenizer.emStrong(A, B, Y)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.codespan(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.br(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.del(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (J = this.tokenizer.autolink(A)) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      if (!this.state.inLink && (J = this.tokenizer.url(A))) {
        A = A.substring(J.raw.length), Q.push(J);
        continue
      }
      let X = A;
      if (this.options.extensions?.startInline) {
        let I = 1 / 0,
          D = A.slice(1),
          W;
        if (this.options.extensions.startInline.forEach((K) => {
            if (W = K.call({
                lexer: this
              }, D), typeof W === "number" && W >= 0) I = Math.min(I, W)
          }), I < 1 / 0 && I >= 0) X = A.substring(0, I + 1)
      }
      if (J = this.tokenizer.inlineText(X)) {
        if (A = A.substring(J.raw.length), J.raw.slice(-1) !== "_") Y = J.raw.slice(-1);
        Z = !0;
        let I = Q.at(-1);
        if (I?.type === "text") I.raw += J.raw, I.text += J.text;
        else Q.push(J);
        continue
      }
      if (A) {
        let I = "Infinite loop on byte: " + A.charCodeAt(0);
        if (this.options.silent) {
          console.error(I);
          break
        } else throw Error(I)
      }
    }
    return Q
  }
}
// @from(Ln 270072, Col 0)
class CyA {
  options;
  parser;
  constructor(A) {
    this.options = A || q4A
  }
  space(A) {
    return ""
  }
  code({
    text: A,
    lang: Q,
    escaped: B
  }) {
    let G = (Q || "").match(GU.notSpaceStart)?.[0],
      Z = A.replace(GU.endingNewline, "") + `
`;
    if (!G) return "<pre><code>" + (B ? Z : hb(Z, !0)) + `</code></pre>
`;
    return '<pre><code class="language-' + hb(G) + '">' + (B ? Z : hb(Z, !0)) + `</code></pre>
`
  }
  blockquote({
    tokens: A
  }) {
    return `<blockquote>
${this.parser.parse(A)}</blockquote>
`
  }
  html({
    text: A
  }) {
    return A
  }
  heading({
    tokens: A,
    depth: Q
  }) {
    return `<h${Q}>${this.parser.parseInline(A)}</h${Q}>
`
  }
  hr(A) {
    return `<hr>
`
  }
  list(A) {
    let {
      ordered: Q,
      start: B
    } = A, G = "";
    for (let J = 0; J < A.items.length; J++) {
      let X = A.items[J];
      G += this.listitem(X)
    }
    let Z = Q ? "ol" : "ul",
      Y = Q && B !== 1 ? ' start="' + B + '"' : "";
    return "<" + Z + Y + `>
` + G + "</" + Z + `>
`
  }
  listitem(A) {
    let Q = "";
    if (A.task) {
      let B = this.checkbox({
        checked: !!A.checked
      });
      if (A.loose)
        if (A.tokens[0]?.type === "paragraph") {
          if (A.tokens[0].text = B + " " + A.tokens[0].text, A.tokens[0].tokens && A.tokens[0].tokens.length > 0 && A.tokens[0].tokens[0].type === "text") A.tokens[0].tokens[0].text = B + " " + hb(A.tokens[0].tokens[0].text), A.tokens[0].tokens[0].escaped = !0
        } else A.tokens.unshift({
          type: "text",
          raw: B + " ",
          text: B + " ",
          escaped: !0
        });
      else Q += B + " "
    }
    return Q += this.parser.parse(A.tokens, !!A.loose), `<li>${Q}</li>
`
  }
  checkbox({
    checked: A
  }) {
    return "<input " + (A ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
  }
  paragraph({
    tokens: A
  }) {
    return `<p>${this.parser.parseInline(A)}</p>
`
  }
  table(A) {
    let Q = "",
      B = "";
    for (let Z = 0; Z < A.header.length; Z++) B += this.tablecell(A.header[Z]);
    Q += this.tablerow({
      text: B
    });
    let G = "";
    for (let Z = 0; Z < A.rows.length; Z++) {
      let Y = A.rows[Z];
      B = "";
      for (let J = 0; J < Y.length; J++) B += this.tablecell(Y[J]);
      G += this.tablerow({
        text: B
      })
    }
    if (G) G = `<tbody>${G}</tbody>`;
    return `<table>
<thead>
` + Q + `</thead>
` + G + `</table>
`
  }
  tablerow({
    text: A
  }) {
    return `<tr>
${A}</tr>
`
  }
  tablecell(A) {
    let Q = this.parser.parseInline(A.tokens),
      B = A.header ? "th" : "td";
    return (A.align ? `<${B} align="${A.align}">` : `<${B}>`) + Q + `</${B}>
`
  }
  strong({
    tokens: A
  }) {
    return `<strong>${this.parser.parseInline(A)}</strong>`
  }
  em({
    tokens: A
  }) {
    return `<em>${this.parser.parseInline(A)}</em>`
  }
  codespan({
    text: A
  }) {
    return `<code>${hb(A,!0)}</code>`
  }
  br(A) {
    return "<br>"
  }
  del({
    tokens: A
  }) {
    return `<del>${this.parser.parseInline(A)}</del>`
  }
  link({
    href: A,
    title: Q,
    tokens: B
  }) {
    let G = this.parser.parseInline(B),
      Z = g82(A);
    if (Z === null) return G;
    A = Z;
    let Y = '<a href="' + A + '"';
    if (Q) Y += ' title="' + hb(Q) + '"';
    return Y += ">" + G + "</a>", Y
  }
  image({
    href: A,
    title: Q,
    text: B
  }) {
    let G = g82(A);
    if (G === null) return hb(B);
    A = G;
    let Z = `<img src="${A}" alt="${B}"`;
    if (Q) Z += ` title="${hb(Q)}"`;
    return Z += ">", Z
  }
  text(A) {
    return "tokens" in A && A.tokens ? this.parser.parseInline(A.tokens) : ("escaped" in A) && A.escaped ? A.text : hb(A.text)
  }
}
// @from(Ln 270251, Col 0)
class FY1 {
  strong({
    text: A
  }) {
    return A
  }
  em({
    text: A
  }) {
    return A
  }
  codespan({
    text: A
  }) {
    return A
  }
  del({
    text: A
  }) {
    return A
  }
  html({
    text: A
  }) {
    return A
  }
  text({
    text: A
  }) {
    return A
  }
  link({
    text: A
  }) {
    return "" + A
  }
  image({
    text: A
  }) {
    return "" + A
  }
  br() {
    return ""
  }
}
// @from(Ln 270296, Col 0)
class c_ {
  options;
  renderer;
  textRenderer;
  constructor(A) {
    this.options = A || q4A, this.options.renderer = this.options.renderer || new CyA, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new FY1
  }
  static parse(A, Q) {
    return new c_(Q).parse(A)
  }
  static parseInline(A, Q) {
    return new c_(Q).parseInline(A)
  }
  parse(A, Q = !0) {
    let B = "";
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      if (this.options.extensions?.renderers?.[Z.type]) {
        let J = Z,
          X = this.options.extensions.renderers[J.type].call({
            parser: this
          }, J);
        if (X !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(J.type)) {
          B += X || "";
          continue
        }
      }
      let Y = Z;
      switch (Y.type) {
        case "space": {
          B += this.renderer.space(Y);
          continue
        }
        case "hr": {
          B += this.renderer.hr(Y);
          continue
        }
        case "heading": {
          B += this.renderer.heading(Y);
          continue
        }
        case "code": {
          B += this.renderer.code(Y);
          continue
        }
        case "table": {
          B += this.renderer.table(Y);
          continue
        }
        case "blockquote": {
          B += this.renderer.blockquote(Y);
          continue
        }
        case "list": {
          B += this.renderer.list(Y);
          continue
        }
        case "html": {
          B += this.renderer.html(Y);
          continue
        }
        case "paragraph": {
          B += this.renderer.paragraph(Y);
          continue
        }
        case "text": {
          let J = Y,
            X = this.renderer.text(J);
          while (G + 1 < A.length && A[G + 1].type === "text") J = A[++G], X += `
` + this.renderer.text(J);
          if (Q) B += this.renderer.paragraph({
            type: "paragraph",
            raw: X,
            text: X,
            tokens: [{
              type: "text",
              raw: X,
              text: X,
              escaped: !0
            }]
          });
          else B += X;
          continue
        }
        default: {
          let J = 'Token with "' + Y.type + '" type was not found.';
          if (this.options.silent) return console.error(J), "";
          else throw Error(J)
        }
      }
    }
    return B
  }
  parseInline(A, Q = this.renderer) {
    let B = "";
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      if (this.options.extensions?.renderers?.[Z.type]) {
        let J = this.options.extensions.renderers[Z.type].call({
          parser: this
        }, Z);
        if (J !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(Z.type)) {
          B += J || "";
          continue
        }
      }
      let Y = Z;
      switch (Y.type) {
        case "escape": {
          B += Q.text(Y);
          break
        }
        case "html": {
          B += Q.html(Y);
          break
        }
        case "link": {
          B += Q.link(Y);
          break
        }
        case "image": {
          B += Q.image(Y);
          break
        }
        case "strong": {
          B += Q.strong(Y);
          break
        }
        case "em": {
          B += Q.em(Y);
          break
        }
        case "codespan": {
          B += Q.codespan(Y);
          break
        }
        case "br": {
          B += Q.br(Y);
          break
        }
        case "del": {
          B += Q.del(Y);
          break
        }
        case "text": {
          B += Q.text(Y);
          break
        }
        default: {
          let J = 'Token with "' + Y.type + '" type was not found.';
          if (this.options.silent) return console.error(J), "";
          else throw Error(J)
        }
      }
    }
    return B
  }
}
// @from(Ln 270454, Col 0)
class e82 {
  defaults = AD0();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = c_;
  Renderer = CyA;
  TextRenderer = FY1;
  Lexer = ZU;
  Tokenizer = $yA;
  Hooks = zyA;
  constructor(...A) {
    this.use(...A)
  }
  walkTokens(A, Q) {
    let B = [];
    for (let G of A) switch (B = B.concat(Q.call(this, G)), G.type) {
      case "table": {
        let Z = G;
        for (let Y of Z.header) B = B.concat(this.walkTokens(Y.tokens, Q));
        for (let Y of Z.rows)
          for (let J of Y) B = B.concat(this.walkTokens(J.tokens, Q));
        break
      }
      case "list": {
        let Z = G;
        B = B.concat(this.walkTokens(Z.items, Q));
        break
      }
      default: {
        let Z = G;
        if (this.defaults.extensions?.childTokens?.[Z.type]) this.defaults.extensions.childTokens[Z.type].forEach((Y) => {
          let J = Z[Y].flat(1 / 0);
          B = B.concat(this.walkTokens(J, Q))
        });
        else if (Z.tokens) B = B.concat(this.walkTokens(Z.tokens, Q))
      }
    }
    return B
  }
  use(...A) {
    let Q = this.defaults.extensions || {
      renderers: {},
      childTokens: {}
    };
    return A.forEach((B) => {
      let G = {
        ...B
      };
      if (G.async = this.defaults.async || G.async || !1, B.extensions) B.extensions.forEach((Z) => {
        if (!Z.name) throw Error("extension name required");
        if ("renderer" in Z) {
          let Y = Q.renderers[Z.name];
          if (Y) Q.renderers[Z.name] = function (...J) {
            let X = Z.renderer.apply(this, J);
            if (X === !1) X = Y.apply(this, J);
            return X
          };
          else Q.renderers[Z.name] = Z.renderer
        }
        if ("tokenizer" in Z) {
          if (!Z.level || Z.level !== "block" && Z.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
          let Y = Q[Z.level];
          if (Y) Y.unshift(Z.tokenizer);
          else Q[Z.level] = [Z.tokenizer];
          if (Z.start) {
            if (Z.level === "block")
              if (Q.startBlock) Q.startBlock.push(Z.start);
              else Q.startBlock = [Z.start];
            else if (Z.level === "inline")
              if (Q.startInline) Q.startInline.push(Z.start);
              else Q.startInline = [Z.start]
          }
        }
        if ("childTokens" in Z && Z.childTokens) Q.childTokens[Z.name] = Z.childTokens
      }), G.extensions = Q;
      if (B.renderer) {
        let Z = this.defaults.renderer || new CyA(this.defaults);
        for (let Y in B.renderer) {
          if (!(Y in Z)) throw Error(`renderer '${Y}' does not exist`);
          if (["options", "parser"].includes(Y)) continue;
          let J = Y,
            X = B.renderer[J],
            I = Z[J];
          Z[J] = (...D) => {
            let W = X.apply(Z, D);
            if (W === !1) W = I.apply(Z, D);
            return W || ""
          }
        }
        G.renderer = Z
      }
      if (B.tokenizer) {
        let Z = this.defaults.tokenizer || new $yA(this.defaults);
        for (let Y in B.tokenizer) {
          if (!(Y in Z)) throw Error(`tokenizer '${Y}' does not exist`);
          if (["options", "rules", "lexer"].includes(Y)) continue;
          let J = Y,
            X = B.tokenizer[J],
            I = Z[J];
          Z[J] = (...D) => {
            let W = X.apply(Z, D);
            if (W === !1) W = I.apply(Z, D);
            return W
          }
        }
        G.tokenizer = Z
      }
      if (B.hooks) {
        let Z = this.defaults.hooks || new zyA;
        for (let Y in B.hooks) {
          if (!(Y in Z)) throw Error(`hook '${Y}' does not exist`);
          if (["options", "block"].includes(Y)) continue;
          let J = Y,
            X = B.hooks[J],
            I = Z[J];
          if (zyA.passThroughHooks.has(Y)) Z[J] = (D) => {
            if (this.defaults.async) return Promise.resolve(X.call(Z, D)).then((K) => {
              return I.call(Z, K)
            });
            let W = X.call(Z, D);
            return I.call(Z, W)
          };
          else Z[J] = (...D) => {
            let W = X.apply(Z, D);
            if (W === !1) W = I.apply(Z, D);
            return W
          }
        }
        G.hooks = Z
      }
      if (B.walkTokens) {
        let Z = this.defaults.walkTokens,
          Y = B.walkTokens;
        G.walkTokens = function (J) {
          let X = [];
          if (X.push(Y.call(this, J)), Z) X = X.concat(Z.call(this, J));
          return X
        }
      }
      this.defaults = {
        ...this.defaults,
        ...G
      }
    }), this
  }
  setOptions(A) {
    return this.defaults = {
      ...this.defaults,
      ...A
    }, this
  }
  lexer(A, Q) {
    return ZU.lex(A, Q ?? this.defaults)
  }
  parser(A, Q) {
    return c_.parse(A, Q ?? this.defaults)
  }
  parseMarkdown(A) {
    return (B, G) => {
      let Z = {
          ...G
        },
        Y = {
          ...this.defaults,
          ...Z
        },
        J = this.onError(!!Y.silent, !!Y.async);
      if (this.defaults.async === !0 && Z.async === !1) return J(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof B > "u" || B === null) return J(Error("marked(): input parameter is undefined or null"));
      if (typeof B !== "string") return J(Error("marked(): input parameter is of type " + Object.prototype.toString.call(B) + ", string expected"));
      if (Y.hooks) Y.hooks.options = Y, Y.hooks.block = A;
      let X = Y.hooks ? Y.hooks.provideLexer() : A ? ZU.lex : ZU.lexInline,
        I = Y.hooks ? Y.hooks.provideParser() : A ? c_.parse : c_.parseInline;
      if (Y.async) return Promise.resolve(Y.hooks ? Y.hooks.preprocess(B) : B).then((D) => X(D, Y)).then((D) => Y.hooks ? Y.hooks.processAllTokens(D) : D).then((D) => Y.walkTokens ? Promise.all(this.walkTokens(D, Y.walkTokens)).then(() => D) : D).then((D) => I(D, Y)).then((D) => Y.hooks ? Y.hooks.postprocess(D) : D).catch(J);
      try {
        if (Y.hooks) B = Y.hooks.preprocess(B);
        let D = X(B, Y);
        if (Y.hooks) D = Y.hooks.processAllTokens(D);
        if (Y.walkTokens) this.walkTokens(D, Y.walkTokens);
        let W = I(D, Y);
        if (Y.hooks) W = Y.hooks.postprocess(W);
        return W
      } catch (D) {
        return J(D)
      }
    }
  }
  onError(A, Q) {
    return (B) => {
      if (B.message += `
Please report this to https://github.com/markedjs/marked.`, A) {
        let G = "<p>An error occurred:</p><pre>" + hb(B.message + "", !0) + "</pre>";
        if (Q) return Promise.resolve(G);
        return G
      }
      if (Q) return Promise.reject(B);
      throw B
    }
  }
}
// @from(Ln 270656, Col 0)
function n7(A, Q) {
  return U4A.parse(A, Q)
}
// @from(Ln 270659, Col 4)
q4A
// @from(Ln 270659, Col 9)
EyA
// @from(Ln 270659, Col 14)
GU
// @from(Ln 270659, Col 18)
JZ5
// @from(Ln 270659, Col 23)
XZ5
// @from(Ln 270659, Col 28)
IZ5
// @from(Ln 270659, Col 33)
UyA
// @from(Ln 270659, Col 38)
DZ5
// @from(Ln 270659, Col 43)
c82
// @from(Ln 270659, Col 48)
p82
// @from(Ln 270659, Col 53)
QD0
// @from(Ln 270659, Col 58)
WZ5
// @from(Ln 270659, Col 63)
BD0
// @from(Ln 270659, Col 68)
KZ5
// @from(Ln 270659, Col 73)
VZ5
// @from(Ln 270659, Col 78)
KY1 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"
// @from(Ln 270660, Col 2)
GD0
// @from(Ln 270660, Col 7)
FZ5
// @from(Ln 270660, Col 12)
l82
// @from(Ln 270660, Col 17)
HZ5
// @from(Ln 270660, Col 22)
ZD0
// @from(Ln 270660, Col 27)
f82
// @from(Ln 270660, Col 32)
EZ5
// @from(Ln 270660, Col 37)
zZ5
// @from(Ln 270660, Col 42)
$Z5
// @from(Ln 270660, Col 47)
CZ5
// @from(Ln 270660, Col 52)
i82
// @from(Ln 270660, Col 57)
UZ5
// @from(Ln 270660, Col 62)
VY1
// @from(Ln 270660, Col 67)
YD0
// @from(Ln 270660, Col 72)
n82
// @from(Ln 270660, Col 77)
qZ5
// @from(Ln 270660, Col 82)
a82
// @from(Ln 270660, Col 87)
NZ5
// @from(Ln 270660, Col 92)
wZ5
// @from(Ln 270660, Col 97)
LZ5
// @from(Ln 270660, Col 102)
o82
// @from(Ln 270660, Col 107)
OZ5
// @from(Ln 270660, Col 112)
MZ5
// @from(Ln 270660, Col 117)
r82 = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)"
// @from(Ln 270661, Col 2)
RZ5
// @from(Ln 270661, Col 7)
_Z5
// @from(Ln 270661, Col 12)
jZ5
// @from(Ln 270661, Col 17)
TZ5
// @from(Ln 270661, Col 22)
PZ5
// @from(Ln 270661, Col 27)
SZ5
// @from(Ln 270661, Col 32)
xZ5
// @from(Ln 270661, Col 37)
WY1
// @from(Ln 270661, Col 42)
yZ5
// @from(Ln 270661, Col 47)
s82
// @from(Ln 270661, Col 52)
t82
// @from(Ln 270661, Col 57)
vZ5
// @from(Ln 270661, Col 62)
JD0
// @from(Ln 270661, Col 67)
kZ5
// @from(Ln 270661, Col 72)
eI0
// @from(Ln 270661, Col 77)
bZ5
// @from(Ln 270661, Col 82)
DY1
// @from(Ln 270661, Col 87)
FyA
// @from(Ln 270661, Col 92)
fZ5
// @from(Ln 270661, Col 97)
h82 = (A) => fZ5[A]
// @from(Ln 270662, Col 2)
zyA
// @from(Ln 270662, Col 7)
U4A
// @from(Ln 270662, Col 12)
_wZ
// @from(Ln 270662, Col 17)
jwZ
// @from(Ln 270662, Col 22)
TwZ
// @from(Ln 270662, Col 27)
PwZ
// @from(Ln 270662, Col 32)
SwZ
// @from(Ln 270662, Col 37)
xwZ
// @from(Ln 270662, Col 42)
ywZ
// @from(Ln 270663, Col 4)
HY1 = w(() => {
  q4A = AD0();
  EyA = {
    exec: () => null
  };
  GU = {
    codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceTabs: /^\t+/,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] /,
    listReplaceTask: /^\[[ xX]\] +/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (A) => new RegExp(`^( {0,3}${A})((?:[	 ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
    hrRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
    fencesBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:\`\`\`|~~~)`),
    headingBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}#`),
    htmlBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}<(?:[a-z].*>|!--)`, "i")
  }, JZ5 = /^(?:[ \t]*(?:\n|$))+/, XZ5 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, IZ5 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, UyA = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, DZ5 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, c82 = /(?:[*+-]|\d{1,9}[.)])/, p82 = KZ(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, c82).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), QD0 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, WZ5 = /^[^\n]+/, BD0 = /(?!\s*\])(?:\\.|[^\[\]\\])+/, KZ5 = KZ(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", BD0).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), VZ5 = KZ(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, c82).getRegex(), GD0 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, FZ5 = KZ("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", GD0).replace("tag", KY1).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), l82 = KZ(QD0).replace("hr", UyA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KY1).getRegex(), HZ5 = KZ(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", l82).getRegex(), ZD0 = {
    blockquote: HZ5,
    code: XZ5,
    def: KZ5,
    fences: IZ5,
    heading: DZ5,
    hr: UyA,
    html: FZ5,
    lheading: p82,
    list: VZ5,
    newline: JZ5,
    paragraph: l82,
    table: EyA,
    text: WZ5
  }, f82 = KZ("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", UyA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KY1).getRegex(), EZ5 = {
    ...ZD0,
    table: f82,
    paragraph: KZ(QD0).replace("hr", UyA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", f82).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KY1).getRegex()
  }, zZ5 = {
    ...ZD0,
    html: KZ(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", GD0).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: EyA,
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: KZ(QD0).replace("hr", UyA).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", p82).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  }, $Z5 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, CZ5 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, i82 = /^( {2,}|\\)\n(?!\s*$)/, UZ5 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, VY1 = /[\p{P}\p{S}]/u, YD0 = /[\s\p{P}\p{S}]/u, n82 = /[^\s\p{P}\p{S}]/u, qZ5 = KZ(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, YD0).getRegex(), a82 = /(?!~)[\p{P}\p{S}]/u, NZ5 = /(?!~)[\s\p{P}\p{S}]/u, wZ5 = /(?:[^\s\p{P}\p{S}]|~)/u, LZ5 = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, o82 = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, OZ5 = KZ(o82, "u").replace(/punct/g, VY1).getRegex(), MZ5 = KZ(o82, "u").replace(/punct/g, a82).getRegex(), RZ5 = KZ(r82, "gu").replace(/notPunctSpace/g, n82).replace(/punctSpace/g, YD0).replace(/punct/g, VY1).getRegex(), _Z5 = KZ(r82, "gu").replace(/notPunctSpace/g, wZ5).replace(/punctSpace/g, NZ5).replace(/punct/g, a82).getRegex(), jZ5 = KZ("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, n82).replace(/punctSpace/g, YD0).replace(/punct/g, VY1).getRegex(), TZ5 = KZ(/\\(punct)/, "gu").replace(/punct/g, VY1).getRegex(), PZ5 = KZ(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), SZ5 = KZ(GD0).replace("(?:-->|$)", "-->").getRegex(), xZ5 = KZ("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", SZ5).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), WY1 = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, yZ5 = KZ(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", WY1).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), s82 = KZ(/^!?\[(label)\]\[(ref)\]/).replace("label", WY1).replace("ref", BD0).getRegex(), t82 = KZ(/^!?\[(ref)\](?:\[\])?/).replace("ref", BD0).getRegex(), vZ5 = KZ("reflink|nolink(?!\\()", "g").replace("reflink", s82).replace("nolink", t82).getRegex(), JD0 = {
    _backpedal: EyA,
    anyPunctuation: TZ5,
    autolink: PZ5,
    blockSkip: LZ5,
    br: i82,
    code: CZ5,
    del: EyA,
    emStrongLDelim: OZ5,
    emStrongRDelimAst: RZ5,
    emStrongRDelimUnd: jZ5,
    escape: $Z5,
    link: yZ5,
    nolink: t82,
    punctuation: qZ5,
    reflink: s82,
    reflinkSearch: vZ5,
    tag: xZ5,
    text: UZ5,
    url: EyA
  }, kZ5 = {
    ...JD0,
    link: KZ(/^!?\[(label)\]\((.*?)\)/).replace("label", WY1).getRegex(),
    reflink: KZ(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", WY1).getRegex()
  }, eI0 = {
    ...JD0,
    emStrongRDelimAst: _Z5,
    emStrongLDelim: MZ5,
    url: KZ(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  }, bZ5 = {
    ...eI0,
    br: KZ(i82).replace("{2,}", "*").getRegex(),
    text: KZ(eI0.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  }, DY1 = {
    normal: ZD0,
    gfm: EZ5,
    pedantic: zZ5
  }, FyA = {
    normal: JD0,
    gfm: eI0,
    breaks: bZ5,
    pedantic: kZ5
  }, fZ5 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  zyA = class zyA {
    options;
    block;
    constructor(A) {
      this.options = A || q4A
    }
    static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(A) {
      return A
    }
    postprocess(A) {
      return A
    }
    processAllTokens(A) {
      return A
    }
    provideLexer() {
      return this.block ? ZU.lex : ZU.lexInline
    }
    provideParser() {
      return this.block ? c_.parse : c_.parseInline
    }
  };
  U4A = new e82;
  n7.options = n7.setOptions = function (A) {
    return U4A.setOptions(A), n7.defaults = U4A.defaults, d82(n7.defaults), n7
  };
  n7.getDefaults = AD0;
  n7.defaults = q4A;
  n7.use = function (...A) {
    return U4A.use(...A), n7.defaults = U4A.defaults, d82(n7.defaults), n7
  };
  n7.walkTokens = function (A, Q) {
    return U4A.walkTokens(A, Q)
  };
  n7.parseInline = U4A.parseInline;
  n7.Parser = c_;
  n7.parser = c_.parse;
  n7.Renderer = CyA;
  n7.TextRenderer = FY1;
  n7.Lexer = ZU;
  n7.lexer = ZU.lex;
  n7.Tokenizer = $yA;
  n7.Hooks = zyA;
  n7.parse = n7;
  _wZ = n7.options, jwZ = n7.setOptions, TwZ = n7.use, PwZ = n7.walkTokens, SwZ = n7.parseInline, xwZ = c_.parse, ywZ = ZU.lex
})
// @from(Ln 270862, Col 0)
function Q52(A) {
  return yd(A, EQ())
}
// @from(Ln 270866, Col 0)
function iZ5(A) {
  let {
    frontmatter: Q,
    content: B
  } = lK(A);
  if (!Q.paths) return {
    content: B
  };
  let G = TFB(Q.paths).map((Z) => {
    return Z.endsWith("/**") ? Z.slice(0, -3) : Z
  }).filter((Z) => Z.length > 0);
  if (G.length === 0 || G.every((Z) => Z === "**")) return {
    content: B
  };
  return {
    content: B,
    paths: G
  }
}
// @from(Ln 270886, Col 0)
function B52(A, Q) {
  try {
    let B = vA();
    if (!B.existsSync(A) || !B.statSync(A).isFile()) return null;
    let G = cZ5(A).toLowerCase();
    if (G && !lZ5.has(G)) return k(`Skipping non-text file in @include: ${A}`), null;
    let Z = B.readFileSync(A, {
        encoding: "utf-8"
      }),
      {
        content: Y,
        paths: J
      } = iZ5(Z);
    return {
      path: A,
      type: Q,
      content: Y,
      globs: J
    }
  } catch (B) {
    if (B instanceof Error && B.message.includes("EACCES")) l("tengu_claude_md_permission_error", {
      is_access_error: 1,
      has_home_dir: A.includes(zQ()) ? 1 : 0
    })
  }
  return null
}
// @from(Ln 270914, Col 0)
function nZ5(A, Q) {
  let B = new Set,
    Z = new ZU({
      gfm: !1
    }).lex(A);

  function Y(J) {
    for (let X of J) {
      if (X.type === "code" || X.type === "codespan") continue;
      if (X.type === "text") {
        let I = X.text || "",
          D = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,
          W;
        while ((W = D.exec(I)) !== null) {
          let K = W[1];
          if (!K) continue;
          if (K = K.replace(/\\ /g, " "), K) {
            if (K.startsWith("./") || K.startsWith("~/") || K.startsWith("/") && K !== "/" || !K.startsWith("@") && !K.match(/^[#%^&*()]+/) && K.match(/^[a-zA-Z0-9._-]/)) {
              let F = Y4(K, EY1(Q));
              B.add(F)
            }
          }
        }
      }
      if (X.tokens) Y(X.tokens);
      if (X.items) Y(X.items)
    }
  }
  return Y(Z), [...B]
}
// @from(Ln 270945, Col 0)
function gb(A, Q, B, G, Z = 0, Y) {
  if (B.has(A) || Z >= aZ5) return [];
  let {
    resolvedPath: J,
    isSymlink: X
  } = xI(vA(), A);
  if (B.add(A), X) B.add(J);
  let I = B52(A, Q);
  if (!I || !I.content.trim()) return [];
  if (Y) I.parent = Y;
  let D = [];
  D.push(I);
  let W = nZ5(I.content, J);
  for (let K of W) {
    if (!Q52(K) && !G) continue;
    let F = gb(K, Q, B, G, Z + 1, A);
    D.push(...F)
  }
  return D
}
// @from(Ln 270966, Col 0)
function fVA({
  rulesDir: A,
  type: Q,
  processedPaths: B,
  includeExternal: G,
  conditionalRule: Z,
  visitedDirs: Y = new Set
}) {
  if (Y.has(A)) return [];
  try {
    let J = vA();
    if (!J.existsSync(A) || !J.statSync(A).isDirectory()) return [];
    let {
      resolvedPath: X,
      isSymlink: I
    } = xI(J, A);
    if (Y.add(A), I) Y.add(X);
    let D = [],
      W = J.readdirSync(X);
    for (let K of W) {
      let V = ub(A, K.name),
        {
          resolvedPath: F,
          isSymlink: H
        } = xI(J, V),
        E = H ? J.statSync(F) : null,
        z = E ? E.isDirectory() : K.isDirectory(),
        $ = E ? E.isFile() : K.isFile();
      if (z) D.push(...fVA({
        rulesDir: F,
        type: Q,
        processedPaths: B,
        includeExternal: G,
        conditionalRule: Z,
        visitedDirs: Y
      }));
      else if ($ && K.name.endsWith(".md")) {
        let O = gb(F, Q, B, G);
        D.push(...O.filter((L) => Z ? L.globs : !L.globs))
      }
    }
    return D
  } catch (J) {
    if (J instanceof Error && J.message.includes("EACCES")) l("tengu_claude_rules_md_permission_error", {
      is_access_error: 1,
      has_home_dir: A.includes(zQ()) ? 1 : 0
    });
    return []
  }
}
// @from(Ln 271017, Col 0)
function N4A() {
  return GV().filter((A) => A.content.length > xd)
}
// @from(Ln 271021, Col 0)
function w4A() {
  return null
}
// @from(Ln 271025, Col 0)
function ID0() {
  return []
}
// @from(Ln 271029, Col 0)
function G52(A, Q) {
  let B = [],
    G = An1();
  if (B.push(...zY1(A, G, "Managed", Q, !1)), iK("userSettings")) {
    let Z = Qn1();
    B.push(...zY1(A, Z, "User", Q, !0))
  }
  return B
}
// @from(Ln 271039, Col 0)
function Z52(A, Q, B) {
  let G = [];
  if (iK("projectSettings")) {
    let J = ub(A, "CLAUDE.md");
    G.push(...gb(J, "Project", B, !1));
    let X = ub(A, ".claude", "CLAUDE.md");
    G.push(...gb(X, "Project", B, !1))
  }
  if (iK("localSettings")) {
    let J = ub(A, "CLAUDE.local.md");
    G.push(...gb(J, "Local", B, !1))
  }
  let Z = ub(A, ".claude", "rules"),
    Y = new Set(B);
  G.push(...fVA({
    rulesDir: Z,
    type: "Project",
    processedPaths: Y,
    includeExternal: !1,
    conditionalRule: !1
  })), G.push(...zY1(Q, Z, "Project", B, !1));
  for (let J of Y) B.add(J);
  return G
}
// @from(Ln 271064, Col 0)
function Y52(A, Q, B) {
  let G = ub(A, ".claude", "rules");
  return zY1(Q, G, "Project", B, !1)
}
// @from(Ln 271069, Col 0)
function zY1(A, Q, B, G, Z) {
  return fVA({
    rulesDir: Q,
    type: B,
    processedPaths: G,
    includeExternal: Z,
    conditionalRule: !0
  }).filter((J) => {
    if (!J.globs || J.globs.length === 0) return !1;
    let X = B === "Project" ? EY1(EY1(Q)) : EQ(),
      I = dZ5(A) ? mZ5(X, A) : A;
    return A52.default().add(J.globs).ignores(I)
  })
}
// @from(Ln 271084, Col 0)
function qyA() {
  let A = [];
  for (let Q of GV(!0))
    if (Q.type !== "User" && Q.parent && !Q52(Q.path)) A.push({
      path: Q.path,
      parent: Q.parent
    });
  return A
}
// @from(Ln 271094, Col 0)
function DD0() {
  return qyA().length > 0
}
// @from(Ln 271097, Col 0)
async function J52() {
  let A = JG();
  if (A.hasClaudeMdExternalIncludesApproved || A.hasClaudeMdExternalIncludesWarningShown) return !1;
  return DD0()
}
// @from(Ln 271102, Col 4)
A52
// @from(Ln 271102, Col 9)
pZ5 = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."
// @from(Ln 271103, Col 2)
xd = 40000
// @from(Ln 271104, Col 2)
hVA = 3000
// @from(Ln 271105, Col 2)
lZ5
// @from(Ln 271105, Col 7)
aZ5 = 5
// @from(Ln 271106, Col 2)
GV
// @from(Ln 271106, Col 6)
XD0 = () => {
    let A = GV(),
      Q = [];
    for (let B of A)
      if (B.content) {
        let G = B.type === "Project" ? " (project instructions, checked into the codebase)" : B.type === "Local" ? " (user's private project instructions, not checked in)" : " (user's private global instructions for all projects)";
        Q.push(`Contents of ${B.path}${G}:

${B.content}`)
      } if (Q.length === 0) return "";
    return `${pZ5}

${Q.join(`

`)}`
  }
// @from(Ln 271122, Col 4)
nz = w(() => {
  Y9();
  C0();
  DQ();
  oZ();
  BI();
  Z0();
  HY1();
  YI();
  AY();
  GQ();
  fQ();
  Da();
  pC();
  T1();
  PL();
  A52 = c(VyA(), 1), lZ5 = new Set([".md", ".txt", ".text", ".json", ".yaml", ".yml", ".toml", ".xml", ".csv", ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".py", ".pyi", ".pyw", ".rb", ".erb", ".rake", ".go", ".rs", ".java", ".kt", ".kts", ".scala", ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hxx", ".cs", ".swift", ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd", ".env", ".ini", ".cfg", ".conf", ".config", ".properties", ".sql", ".graphql", ".gql", ".proto", ".vue", ".svelte", ".astro", ".ejs", ".hbs", ".pug", ".jade", ".php", ".pl", ".pm", ".lua", ".r", ".R", ".dart", ".ex", ".exs", ".erl", ".hrl", ".clj", ".cljs", ".cljc", ".edn", ".hs", ".lhs", ".elm", ".ml", ".mli", ".f", ".f90", ".f95", ".for", ".cmake", ".make", ".makefile", ".gradle", ".sbt", ".rst", ".adoc", ".asciidoc", ".org", ".tex", ".latex", ".lock", ".log", ".diff", ".patch"]);
  GV = W0((A = !1) => {
    let Q = Date.now();
    OB("info", "memory_files_started");
    let B = [],
      G = new Set,
      Z = JG(),
      Y = A || Z.hasClaudeMdExternalIncludesApproved || !1,
      J = MQA("Managed");
    B.push(...gb(J, "Managed", G, Y));
    let X = An1();
    if (B.push(...fVA({
        rulesDir: X,
        type: "Managed",
        processedPaths: G,
        includeExternal: Y,
        conditionalRule: !1
      })), iK("userSettings")) {
      let W = MQA("User");
      B.push(...gb(W, "User", G, !0));
      let K = Qn1();
      B.push(...fVA({
        rulesDir: K,
        type: "User",
        processedPaths: G,
        includeExternal: !0,
        conditionalRule: !1
      }))
    }
    let I = [],
      D = EQ();
    while (D !== uZ5(D).root) I.push(D), D = EY1(D);
    for (let W of I.reverse()) {
      if (iK("projectSettings")) {
        let K = ub(W, "CLAUDE.md");
        B.push(...gb(K, "Project", G, Y));
        let V = ub(W, ".claude", "CLAUDE.md");
        B.push(...gb(V, "Project", G, Y));
        let F = ub(W, ".claude", "rules");
        B.push(...fVA({
          rulesDir: F,
          type: "Project",
          processedPaths: G,
          includeExternal: Y,
          conditionalRule: !1
        }))
      }
      if (iK("localSettings")) {
        let K = ub(W, "CLAUDE.local.md");
        B.push(...gb(K, "Local", G, Y))
      }
    }
    return OB("info", "memory_files_completed", {
      duration_ms: Date.now() - Q,
      file_count: B.length,
      total_content_length: B.reduce((W, K) => W + K.content.length, 0)
    }), B
  })
})
// @from(Ln 271197, Col 4)
WD0 = 40000
// @from(Ln 271198, Col 2)
KD0
// @from(Ln 271198, Col 7)
OF
// @from(Ln 271198, Col 11)
ZV
// @from(Ln 271199, Col 4)
OS = w(() => {
  v1();
  nz();
  Y9();
  ZI();
  t4();
  PL();
  KD0 = W0(async () => {
    let A = Date.now();
    OB("info", "git_status_started");
    let Q = Date.now(),
      B = await nq();
    if (OB("info", "git_is_git_check_completed", {
        duration_ms: Date.now() - Q,
        is_git: B
      }), !B) return OB("info", "git_status_skipped_not_git", {
      duration_ms: Date.now() - A
    }), null;
    try {
      let G = Date.now(),
        [Z, Y, J, X] = await Promise.all([TQ("git", ["branch", "--show-current"], {
          preserveOutputOnError: !1
        }).then(({
          stdout: D
        }) => D.trim()), TQ("git", ["rev-parse", "--abbrev-ref", "origin/HEAD"], {
          preserveOutputOnError: !1
        }).then(({
          stdout: D
        }) => D.replace("origin/", "").trim()), TQ("git", ["status", "--short"], {
          preserveOutputOnError: !1
        }).then(({
          stdout: D
        }) => D.trim()), TQ("git", ["log", "--oneline", "-n", "5"], {
          preserveOutputOnError: !1
        }).then(({
          stdout: D
        }) => D.trim())]);
      OB("info", "git_commands_completed", {
        duration_ms: Date.now() - G,
        status_length: J.length
      });
      let I = J.length > WD0 ? J.substring(0, WD0) + `
... (truncated because it exceeds 40k characters. If you need more information, run "git status" using BashTool)` : J;
      return OB("info", "git_status_completed", {
        duration_ms: Date.now() - A,
        truncated: J.length > WD0
      }), `This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.
Current branch: ${Z}

Main branch (you will usually use this for PRs): ${Y}

Status:
${I||"(clean)"}

Recent commits:
${X}`
    } catch (G) {
      return OB("error", "git_status_failed", {
        duration_ms: Date.now() - A
      }), e(G instanceof Error ? G : Error(String(G))), null
    }
  }), OF = W0(async () => {
    let A = Date.now();
    OB("info", "system_context_started");
    let Q = await KD0();
    return OB("info", "system_context_completed", {
      duration_ms: Date.now() - A,
      has_git_status: Q !== null
    }), {
      ...Q ? {
        gitStatus: Q
      } : {}
    }
  }), ZV = W0(async () => {
    let A = Date.now();
    OB("info", "user_context_started");
    let Q = process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS,
      B = Q ? null : XD0();
    return OB("info", "user_context_completed", {
      duration_ms: Date.now() - A,
      claudemd_length: B?.length ?? 0,
      claudemd_disabled: Boolean(Q)
    }), {
      ...B ? {
        claudeMd: B
      } : {}
    }
  })
})
// @from(Ln 271292, Col 0)
function VD0({
  tools: A,
  isBuiltIn: Q,
  isAsync: B = !1
}) {
  return A.filter((G) => {
    if (G.name.startsWith("mcp__")) return !0;
    if (NyA.has(G.name)) return !1;
    if (!Q && D52.has(G.name)) return !1;
    if (B && !W52.has(G.name)) return !1;
    return !0
  })
}
// @from(Ln 271306, Col 0)
function ur(A, Q, B = !1) {
  let {
    tools: G,
    disallowedTools: Z,
    source: Y
  } = A, J = VD0({
    tools: Q,
    isBuiltIn: Y === "built-in",
    isAsync: B
  }), X = new Set(Z?.map((E) => {
    let {
      toolName: z
    } = mR(E);
    return z
  }) ?? []), I = J.filter((E) => !X.has(E.name));
  if (G === void 0 || G.length === 1 && G[0] === "*") return {
    hasWildcard: !0,
    validTools: [],
    invalidTools: [],
    resolvedTools: I
  };
  let W = new Map;
  for (let E of I) W.set(E.name, E);
  let K = [],
    V = [],
    F = [],
    H = new Set;
  for (let E of G) {
    let {
      toolName: z
    } = mR(E);
    if (z === f3) {
      K.push(E);
      continue
    }
    let $ = W.get(z);
    if ($) {
      if (K.push(E), !H.has($)) F.push($), H.add($)
    } else V.push(E)
  }
  return {
    hasWildcard: !1,
    validTools: K,
    invalidTools: V,
    resolvedTools: F
  }
}
// @from(Ln 271354, Col 0)
function I52(A, Q) {
  let B = H0({
      content: A
    }),
    G = Q.message.content.find((I) => {
      if (I.type !== "tool_use" || I.name !== f3) return !1;
      let D = I.input;
      return "prompt" in D && D.prompt === A
    });
  if (!G) return k(`Could not find matching AgentTool tool use for prompt: ${A.slice(0,50)}...`, {
    level: "error"
  }), [B];
  let Z = {
      ...Q,
      uuid: oZ5(),
      message: {
        ...Q.message,
        content: [G]
      }
    },
    Y = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE: 
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`,
    J = {
      status: "sub_agent_entered",
      description: "Entered sub-agent context",
      message: Y
    },
    X = H0({
      content: [{
        type: "tool_result",
        tool_use_id: G.id,
        content: [{
          type: "text",
          text: Y
        }]
      }],
      toolUseResult: J
    });
  return [Z, X, B]
}
// @from(Ln 271400, Col 4)
X52
// @from(Ln 271401, Col 4)
L4A = w(() => {
  YZ();
  az();
  tQ();
  T1();
  j9();
  X52 = m.object({
    status: m.literal("sub_agent_entered"),
    description: m.string(),
    message: m.string()
  })
})