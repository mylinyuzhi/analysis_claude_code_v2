
// @from(Ln 246762, Col 0)
async function* v51(A, Q, B) {
  let G = as8(B),
    Z = {
      model: B.model,
      maxThinkingTokens: B.maxThinkingTokens
    },
    Y = null,
    J = 0,
    X;
  for (let I = 1; I <= G + 1; I++) {
    if (B.signal?.aborted) throw new II;
    try {
      if (Y === null || X instanceof D9 && X.status === 401 || PeB(X)) {
        if (X instanceof D9 && X.status === 401) {
          let D = g4()?.accessToken;
          if (D) await mA1(D)
        }
        Y = await A()
      }
      return await Q(Y, I, Z)
    } catch (D) {
      if (X = D, ls8(D) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !qB() && oJA(B.model))) {
        if (J++, J >= ds8) {
          if (B.fallbackModel) throw l("tengu_api_opus_fallback_triggered", {
            original_model: B.model,
            fallback_model: B.fallbackModel,
            provider: PT()
          }), new y51(B.model, B.fallbackModel);
          if (!process.env.IS_SANDBOX) throw l("tengu_api_custom_529_overloaded_error", {}), new Qr(Error(CZ0), Z)
        }
      }
      if (I > G) throw new Qr(D, Z);
      if (!is8(D) && (!(D instanceof D9) || !ns8(D))) throw new Qr(D, Z);
      if (D instanceof D9) {
        let F = TeB(D);
        if (F) {
          let {
            inputTokens: H,
            contextLimit: E
          } = F, z = 1000, $ = Math.max(0, E - H - 1000);
          if ($ < qZ0) throw e(Error(`availableContext ${$} is less than FLOOR_OUTPUT_TOKENS ${qZ0}`)), D;
          let O = (Z.maxThinkingTokens || 0) + 1,
            L = Math.max(qZ0, $, O);
          Z.maxTokensOverride = L, l("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens: H,
            contextLimit: E,
            adjustedMaxTokens: L,
            attempt: I
          });
          continue
        }
      }
      let K = ps8(D),
        V = fSA(I, K);
      if (D instanceof D9) yield SeB(D, V, I, G);
      l("tengu_api_retry", {
        attempt: I,
        delayMs: V,
        error: D.message,
        status: D.status,
        provider: PT()
      }), await QKA(V, B.signal)
    }
  }
  throw new Qr(X, Z)
}
// @from(Ln 246829, Col 0)
function ps8(A) {
  return (A.headers?.["retry-after"] || A.headers?.get?.("retry-after")) ?? null
}
// @from(Ln 246833, Col 0)
function fSA(A, Q) {
  if (Q) {
    let Z = parseInt(Q, 10);
    if (!isNaN(Z)) return Z * 1000
  }
  let B = Math.min(cs8 * Math.pow(2, A - 1), 32000),
    G = Math.random() * 0.25 * B;
  return B + G
}
// @from(Ln 246843, Col 0)
function TeB(A) {
  if (A.status !== 400 || !A.message) return;
  if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
  let Q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
    B = A.message.match(Q);
  if (!B || B.length !== 4) return;
  if (!B[1] || !B[2] || !B[3]) {
    e(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
    return
  }
  let G = parseInt(B[1], 10),
    Z = parseInt(B[2], 10),
    Y = parseInt(B[3], 10);
  if (isNaN(G) || isNaN(Z) || isNaN(Y)) return;
  return {
    inputTokens: G,
    maxTokens: Z,
    contextLimit: Y
  }
}
// @from(Ln 246864, Col 0)
function ls8(A) {
  if (!(A instanceof D9)) return !1;
  return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}
// @from(Ln 246869, Col 0)
function PeB(A) {
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    if (qBB(A) || A instanceof D9 && A.status === 403) return !0
  }
  return !1
}
// @from(Ln 246876, Col 0)
function is8(A) {
  if (PeB(A)) return uA1(), !0;
  return !1
}
// @from(Ln 246881, Col 0)
function ns8(A) {
  if (mrB(A)) return !1;
  if (A.message?.includes('"type":"overloaded_error"')) return !0;
  if (TeB(A)) return !0;
  let Q = A.headers?.get("x-should-retry");
  if (Q === "true" && !qB()) return !0;
  if (Q === "false") return !1;
  if (A instanceof zC) return !0;
  if (!A.status) return !1;
  if (A.status === 408) return !0;
  if (A.status === 409) return !0;
  if (A.status === 429) return !qB();
  if (A.status === 401) return gA1(), !0;
  if (A.status && A.status >= 500) return !0;
  return !1
}
// @from(Ln 246898, Col 0)
function as8(A) {
  if (A.maxRetries) return A.maxRetries;
  if (process.env.CLAUDE_CODE_MAX_RETRIES) return parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
  return ms8
}
// @from(Ln 246903, Col 4)
ms8 = 10
// @from(Ln 246904, Col 2)
qZ0 = 3000
// @from(Ln 246905, Col 2)
ds8 = 3
// @from(Ln 246906, Col 2)
cs8 = 500
// @from(Ln 246907, Col 2)
Qr
// @from(Ln 246907, Col 6)
y51
// @from(Ln 246908, Col 4)
hSA = w(() => {
  vk();
  v1();
  l2();
  MD();
  Q2();
  Z0();
  XO();
  fi1();
  MSA();
  tQ();
  _9A();
  fQ();
  Qr = class Qr extends Error {
    originalError;
    retryContext;
    constructor(A, Q) {
      let B = A instanceof Error ? A.message : String(A);
      super(B);
      this.originalError = A;
      this.retryContext = Q;
      if (this.name = "RetryError", A instanceof Error && A.stack) this.stack = A.stack
    }
  };
  y51 = class y51 extends Error {
    originalModel;
    fallbackModel;
    constructor(A, Q) {
      super(`Model fallback triggered: ${A} -> ${Q}`);
      this.originalModel = A;
      this.fallbackModel = Q;
      this.name = "FallbackTriggeredError"
    }
  }
})
// @from(Ln 246952, Col 0)
function NZ0() {
  return !1
}
// @from(Ln 246955, Col 0)
async function os8(A, Q, B) {
  if (!NZ0()) return await B();
  let G = veB("sha1").update(eA(A)).digest("hex").slice(0, 12),
    Z = keB(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? o1(), `fixtures/${Q}-${G}.json`);
  if (vA().existsSync(Z)) return AQ(vA().readFileSync(Z, {
    encoding: "utf8"
  }));
  if (l0.isCI) throw Error(`Fixture missing: ${Z}. Re-run npm test locally, then commit the result.`);
  let Y = await B();
  if (!vA().existsSync(k51(Z))) vA().mkdirSync(k51(Z));
  return bB(Z, eA(Y, null, 2), {
    encoding: "utf8",
    flush: !1
  }), Y
}
// @from(Ln 246970, Col 0)
async function wZ0(A, Q) {
  if (!NZ0()) return await Q();
  let B = FI(A.filter((J) => {
      if (J.type !== "user") return !0;
      if (J.isMeta) return !1;
      return !0
    })),
    G = ss8(B.map((J) => J.message.content), yeB),
    Z = keB(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? o1(), `fixtures/${G.map((J)=>veB("sha1").update(eA(J)).digest("hex").slice(0,6)).join("-")}.json`);
  if (vA().existsSync(Z)) {
    let J = AQ(vA().readFileSync(Z, {
      encoding: "utf8"
    }));
    return J.output.forEach(rs8), J.output.map((X, I) => xeB(X, es8, I))
  }
  if (l0.isCI) throw Error(`Anthropic API fixture missing: ${Z}. Re-run npm test locally, then commit the result. Input messages:
${eA(G,null,2)}`);
  let Y = await Q();
  if (l0.isCI) return Y;
  if (!vA().existsSync(k51(Z))) vA().mkdirSync(k51(Z));
  return bB(Z, eA({
    input: G,
    output: Y.map((J, X) => xeB(J, yeB, X))
  }, null, 2), {
    encoding: "utf8",
    flush: !1
  }), Y
}
// @from(Ln 246999, Col 0)
function rs8(A) {
  if (A.type === "stream_event") return;
  let Q = A.message.model,
    B = A.message.usage,
    G = eeA(Q, B);
  oeA(G, B, Q)
}
// @from(Ln 247007, Col 0)
function ss8(A, Q) {
  return A.map((B) => {
    if (typeof B === "string") return Q(B);
    return B.map((G) => {
      switch (G.type) {
        case "tool_result":
          if (typeof G.content === "string") return {
            ...G,
            content: Q(G.content)
          };
          if (Array.isArray(G.content)) return {
            ...G,
            content: G.content.map((Z) => {
              switch (Z.type) {
                case "text":
                  return {
                    ...Z, text: Q(Z.text)
                  };
                case "image":
                  return Z;
                default:
                  return
              }
            })
          };
          return G;
        case "text":
          return {
            ...G, text: Q(G.text)
          };
        case "tool_use":
          return {
            ...G, input: b51(G.input, Q)
          };
        case "image":
          return G;
        default:
          return
      }
    })
  })
}
// @from(Ln 247050, Col 0)
function b51(A, Q) {
  return I1A(A, (B, G) => {
    if (Array.isArray(B)) return B.map((Z) => b51(Z, Q));
    if (K7A(B)) return b51(B, Q);
    return Q(B, G, A)
  })
}
// @from(Ln 247058, Col 0)
function ts8(A, Q, B) {
  return {
    uuid: `UUID-${B}`,
    requestId: "REQUEST_ID",
    timestamp: A.timestamp,
    message: {
      ...A.message,
      content: A.message.content.map((G) => {
        switch (G.type) {
          case "text":
            return {
              ...G, text: Q(G.text), citations: G.citations || []
            };
          case "tool_use":
            return {
              ...G, input: b51(G.input, Q)
            };
          default:
            return G
        }
      }).filter(Boolean)
    },
    type: "assistant"
  }
}
// @from(Ln 247084, Col 0)
function xeB(A, Q, B) {
  if (A.type === "assistant") return ts8(A, Q, B);
  else return A
}
// @from(Ln 247089, Col 0)
function yeB(A) {
  if (typeof A !== "string") return A;
  let Q = A.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replace(/\//g, beB.sep).replaceAll(zQ(), "[CONFIG_HOME]").replaceAll(o1(), "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
  if (Q.includes("Files modified by user:")) return "Files modified by user: [FILES]";
  return Q
}
// @from(Ln 247096, Col 0)
function es8(A) {
  if (typeof A !== "string") return A;
  return A.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", zQ()).replaceAll("[CWD]", o1())
}
// @from(Ln 247100, Col 0)
async function* LZ0(A, Q) {
  if (!NZ0()) return yield* Q();
  let B = [],
    G = await wZ0(A, async () => {
      for await (let Z of Q()) B.push(Z);
      return B
    });
  if (G.length > 0) {
    yield* G;
    return
  }
  yield* B
}
// @from(Ln 247113, Col 0)
async function feB(A, Q, B) {
  return (await os8({
    messages: A,
    tools: Q
  }, "token-count", async () => ({
    tokenCount: await B()
  }))).tokenCount
}
// @from(Ln 247121, Col 4)
OZ0 = w(() => {
  p3();
  V2();
  fQ();
  DQ();
  A0();
  adA();
  RpA();
  tQ();
  AA1();
  LR();
  A0()
})
// @from(Ln 247135, Col 0)
function MZ0(A) {
  let Q = A.filter((G) => G.isMcp);
  if (Q.length === 0) return `Search for or select MCP tools to make them available for use.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST use this tool to load MCP tools BEFORE calling them directly.

This is a BLOCKING REQUIREMENT - MCP tools listed below are NOT available until you load them using this tool.

**Why this is non-negotiable:**
- MCP tools are deferred and not loaded until discovered via this tool
- Calling an MCP tool without first loading it will fail

**Query modes:**

1. **Direct selection** - Use \`select:<tool_name>\` when you know exactly which tool you need:
   - "select:mcp__slack__read_channel"
   - "select:mcp__filesystem__list_directory"
   - Returns just that tool if it exists

2. **Keyword search** - Use keywords when you're unsure which tool to use:
   - "list directory" - find tools for listing directories
   - "read file" - find tools for reading files
   - "slack message" - find slack messaging tools
   - Returns up to 5 matching tools ranked by relevance

**CORRECT Usage Patterns:**

<example>
User: List files in the src directory
Assistant: I can see mcp__filesystem__list_directory in the available tools. Let me select it.
[Calls MCPSearch with query: "select:mcp__filesystem__list_directory"]
[Calls the MCP tool]
</example>

<example>
User: I need to work with slack somehow
Assistant: Let me search for slack tools.
[Calls MCPSearch with query: "slack"]
Assistant: Found several options including mcp__slack__read_channel.
[Calls the MCP tool]
</example>

**INCORRECT Usage Pattern - NEVER DO THIS:**

<bad-example>
User: Read my slack messages
Assistant: [Directly calls mcp__slack__read_channel without loading it first]
WRONG - You must load the tool FIRST using this tool
</bad-example>`;
  return `Search for or select MCP tools to make them available for use.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST use this tool to load MCP tools BEFORE calling them directly.

This is a BLOCKING REQUIREMENT - MCP tools listed below are NOT available until you load them using this tool.

**Why this is non-negotiable:**
- MCP tools are deferred and not loaded until discovered via this tool
- Calling an MCP tool without first loading it will fail

**Query modes:**

1. **Direct selection** - Use \`select:<tool_name>\` when you know exactly which tool you need:
   - "select:mcp__slack__read_channel"
   - "select:mcp__filesystem__list_directory"
   - Returns just that tool if it exists

2. **Keyword search** - Use keywords when you're unsure which tool to use:
   - "list directory" - find tools for listing directories
   - "read file" - find tools for reading files
   - "slack message" - find slack messaging tools
   - Returns up to 5 matching tools ranked by relevance

**CORRECT Usage Patterns:**

<example>
User: List files in the src directory
Assistant: I can see mcp__filesystem__list_directory in the available tools. Let me select it.
[Calls MCPSearch with query: "select:mcp__filesystem__list_directory"]
[Calls the MCP tool]
</example>

<example>
User: I need to work with slack somehow
Assistant: Let me search for slack tools.
[Calls MCPSearch with query: "slack"]
Assistant: Found several options including mcp__slack__read_channel.
[Calls the MCP tool]
</example>

**INCORRECT Usage Pattern - NEVER DO THIS:**

<bad-example>
User: Read my slack messages
Assistant: [Directly calls mcp__slack__read_channel without loading it first]
WRONG - You must load the tool FIRST using this tool
</bad-example>

Available MCP tools (must be loaded before use):
${Q.map((G)=>G.name).join(`
`)}`
}
// @from(Ln 247240, Col 4)
Db = "MCPSearch"
// @from(Ln 247241, Col 4)
deB = {}
// @from(Ln 247254, Col 0)
function geB(A) {
  let Q = KA1(A),
    B = Jq(A, Q);
  return Math.floor(B * heB * At8)
}
// @from(Ln 247260, Col 0)
function Qt8() {
  if (process.env.ENABLE_TOOL_SEARCH === "auto") return "tst-auto";
  if (a1(process.env.ENABLE_TOOL_SEARCH)) return "tst";
  if (a1(process.env.ENABLE_MCP_CLI)) return "mcp-cli";
  if (iX(process.env.ENABLE_MCP_CLI)) return "standard";
  if (iX(process.env.ENABLE_TOOL_SEARCH)) return "standard";
  return "tst-auto"
}
// @from(Ln 247269, Col 0)
function k9A() {
  if (process.env.ENABLE_TOOL_SEARCH === "auto") return "tst-auto";
  if (a1(process.env.ENABLE_TOOL_SEARCH)) return "tst";
  if (a1(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "mcp-cli";
  if (iX(process.env.ENABLE_TOOL_SEARCH)) return "standard";
  if (iX(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "standard";
  if (!gW()) try {
    if (ZZ("tengu_mcp_tool_search", !0) === !1) return "standard"
  } catch {}
  return "tst-auto"
}
// @from(Ln 247281, Col 0)
function Gt8() {
  try {
    let A = ZZ("tengu_tool_search_unsupported_models", null);
    if (A && Array.isArray(A) && A.length > 0) return A
  } catch {}
  return Bt8
}
// @from(Ln 247289, Col 0)
function ueB(A) {
  let Q = A.toLowerCase(),
    B = Gt8();
  for (let G of B)
    if (Q.includes(G.toLowerCase())) return !1;
  return !0
}
// @from(Ln 247297, Col 0)
function Zd() {
  switch (k9A()) {
    case "tst":
    case "tst-auto":
      return !0;
    case "mcp-cli":
    case "standard":
      return !1
  }
}
// @from(Ln 247308, Col 0)
function meB(A) {
  return A.some((Q) => Q.name === Db)
}
// @from(Ln 247311, Col 0)
async function Zt8(A, Q, B) {
  let G = A.filter((Y) => Y.isMcp);
  if (G.length === 0) return 0;
  return (await Promise.all(G.map((Y) => Y.prompt({
    getToolPermissionContext: Q,
    tools: A,
    agents: B
  })))).reduce((Y, J) => Y + J.length, 0)
}
// @from(Ln 247320, Col 0)
async function RZ0(A, Q, B, G) {
  let Z = Q.filter((X) => X.isMcp).length;

  function Y(X, I, D, W) {
    l("tengu_tool_search_mode_decision", {
      enabled: X,
      mode: I,
      reason: D,
      checkedModel: A,
      mcpToolCount: Z,
      userType: "external",
      ...W
    })
  }
  if (!ueB(A)) return k(`Tool search disabled for model '${A}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`), Y(!1, "standard", "model_unsupported"), !1;
  if (!meB(Q)) return k("Tool search disabled: MCPSearchTool is not available (may have been disallowed via disallowedTools)."), Y(!1, "standard", "mcp_search_unavailable"), !1;
  let J = k9A();
  switch (J) {
    case "tst":
      return Y(!0, J, "tst_enabled"), !0;
    case "tst-auto": {
      let X = await Zt8(Q, B, G),
        I = geB(A),
        D = X >= I;
      return k(`Auto tool search ${D?"enabled":"disabled"}: ${X} chars (threshold: ${I}, ${Math.round(heB*100)}% of context)`), Y(D, J, D ? "auto_above_threshold" : "auto_below_threshold", {
        mcpToolDescriptionChars: X,
        threshold: I
      }), D
    }
    case "mcp-cli":
      return Y(!1, J, "mcp_cli_mode"), !1;
    case "standard":
      return Y(!1, J, "standard_mode"), !1
  }
}
// @from(Ln 247356, Col 0)
function Yd(A) {
  return typeof A === "object" && A !== null && "type" in A && A.type === "tool_reference"
}
// @from(Ln 247360, Col 0)
function Yt8(A) {
  return Yd(A) && "tool_name" in A && typeof A.tool_name === "string"
}
// @from(Ln 247364, Col 0)
function Jt8(A) {
  return typeof A === "object" && A !== null && "type" in A && A.type === "tool_result" && "content" in A && Array.isArray(A.content)
}
// @from(Ln 247368, Col 0)
function _Z0(A) {
  let Q = new Set;
  for (let B of A) {
    if (B.type !== "user") continue;
    let G = B.message?.content;
    if (!Array.isArray(G)) continue;
    for (let Z of G)
      if (Jt8(Z)) {
        for (let Y of Z.content)
          if (Yt8(Y)) Q.add(Y.tool_name)
      }
  }
  if (Q.size > 0) k(`Dynamic tool loading: found ${Q.size} discovered tools in message history`);
  return Q
}
// @from(Ln 247383, Col 4)
heB = 0.1
// @from(Ln 247384, Col 2)
At8 = 2.5
// @from(Ln 247385, Col 2)
Bt8
// @from(Ln 247386, Col 4)
Wb = w(() => {
  w6();
  Mu();
  Z0();
  fQ();
  T1();
  FT();
  RR();
  Bt8 = ["haiku"]
})
// @from(Ln 247397, Col 0)
function leB(A) {
  for (let Q of A)
    if (Q.role === "assistant" && Array.isArray(Q.content)) {
      for (let B of Q.content)
        if (typeof B === "object" && B !== null && "type" in B && (B.type === "thinking" || B.type === "redacted_thinking")) return !0
    } return !1
}
// @from(Ln 247405, Col 0)
function Xt8(A) {
  return A.map((Q) => {
    if (!Array.isArray(Q.content)) return Q;
    let B = Q.content.map((G) => {
      if (G.type === "tool_use") {
        let Z = G;
        return {
          type: "tool_use",
          id: Z.id,
          name: Z.name,
          input: Z.input
        }
      }
      if (G.type === "tool_result") {
        let Z = G;
        if (Array.isArray(Z.content)) {
          let Y = Z.content.filter((J) => !Yd(J));
          if (Y.length === 0) return {
            ...Z,
            content: [{
              type: "text",
              text: "[tool references]"
            }]
          };
          if (Y.length !== Z.content.length) return {
            ...Z,
            content: Y
          }
        }
      }
      return G
    });
    return {
      ...Q,
      content: B
    }
  })
}
// @from(Ln 247443, Col 0)
async function ieB(A) {
  if (!A) return 0;
  return gSA([{
    role: "user",
    content: A
  }], [])
}
// @from(Ln 247450, Col 0)
async function gSA(A, Q) {
  return feB(A, Q, async () => {
    try {
      let B = B5(),
        G = OL(B),
        Z = leB(A);
      if (R4() === "bedrock") return Dt8({
        model: Lu(B),
        messages: A,
        tools: Q,
        betas: G,
        containsThinking: Z
      });
      let Y = await XS({
          maxRetries: 1,
          model: B
        }),
        J = R4() === "vertex" ? G.filter((I) => iU1.has(I)) : G,
        X = await Y.beta.messages.countTokens({
          model: Lu(B),
          messages: A.length > 0 ? A : [{
            role: "user",
            content: "foo"
          }],
          tools: Q,
          ...J.length > 0 ? {
            betas: J
          } : {},
          ...Z ? {
            thinking: {
              type: "enabled",
              budget_tokens: jZ0
            }
          } : {}
        });
      if (typeof X.input_tokens !== "number") return null;
      return X.input_tokens
    } catch (B) {
      return e(B), null
    }
  })
}
// @from(Ln 247493, Col 0)
function l7(A) {
  return Math.round(A.length / 4)
}
// @from(Ln 247496, Col 0)
async function neB(A, Q) {
  let B = leB(A),
    G = a1(process.env.CLAUDE_CODE_USE_VERTEX) && SdA(SD()) === "global",
    Z = a1(process.env.CLAUDE_CODE_USE_BEDROCK) && B,
    Y = a1(process.env.CLAUDE_CODE_USE_VERTEX) && B,
    J = G || Z || Y ? OR() : SD(),
    X = await XS({
      maxRetries: 1,
      model: J
    }),
    I = Xt8(A),
    D = I.length > 0 ? I : [{
      role: "user",
      content: "count"
    }],
    W = OL(J),
    K = R4() === "vertex" ? W.filter(($) => iU1.has($)) : W,
    F = (await X.beta.messages.create({
      model: Lu(J),
      max_tokens: B ? peB : 1,
      messages: D,
      tools: Q.length > 0 ? Q : void 0,
      ...K.length > 0 ? {
        betas: K
      } : {},
      metadata: ao(),
      ...f51(),
      ...B ? {
        thinking: {
          type: "enabled",
          budget_tokens: jZ0
        }
      } : {}
    })).usage,
    H = F.input_tokens,
    E = F.cache_creation_input_tokens || 0,
    z = F.cache_read_input_tokens || 0;
  return H + E + z
}
// @from(Ln 247536, Col 0)
function TZ0(A) {
  let Q = 0;
  for (let B of A) Q += PZ0(B);
  return Q
}
// @from(Ln 247542, Col 0)
function PZ0(A) {
  if (A.type !== "assistant" && A.type !== "user" || !A.message?.content) return 0;
  return aeB(A.message?.content)
}
// @from(Ln 247547, Col 0)
function aeB(A) {
  if (!A) return 0;
  if (typeof A === "string") return l7(A);
  let Q = 0;
  for (let B of A) Q += It8(B);
  return Q
}
// @from(Ln 247555, Col 0)
function It8(A) {
  if (typeof A === "string") return l7(A);
  if (A.type === "text") return l7(A.text);
  if (A.type === "image") return 1334;
  if (A.type === "tool_result") return aeB(A.content);
  return 0
}
// @from(Ln 247562, Col 0)
async function Dt8({
  model: A,
  messages: Q,
  tools: B,
  betas: G,
  containsThinking: Z
}) {
  try {
    let Y = await ltQ(),
      J = _p1(A) ? A : await ieA(A);
    if (!J) return null;
    let X = {
        anthropic_version: "bedrock-2023-05-31",
        messages: Q.length > 0 ? Q : [{
          role: "user",
          content: "foo"
        }],
        max_tokens: Z ? peB : 1,
        ...B.length > 0 ? {
          tools: B
        } : {},
        ...G.length > 0 ? {
          anthropic_beta: G
        } : {},
        ...Z ? {
          thinking: {
            type: "enabled",
            budget_tokens: jZ0
          }
        } : {}
      },
      I = {
        modelId: J,
        input: {
          invokeModel: {
            body: new TextEncoder().encode(eA(X))
          }
        }
      };
    return (await Y.send(new ceB.CountTokensCommand(I))).inputTokens ?? null
  } catch (Y) {
    return e(Y), null
  }
}
// @from(Ln 247606, Col 4)
ceB
// @from(Ln 247606, Col 9)
jZ0 = 1024
// @from(Ln 247607, Col 2)
peB = 2048
// @from(Ln 247608, Col 4)
qN = w(() => {
  OSA();
  v1();
  l2();
  RR();
  a5A();
  nY();
  fQ();
  OZ0();
  MD();
  UOA();
  Wb();
  A0();
  ceB = c(XtA(), 1)
})
// @from(Ln 247624, Col 0)
function Jd(A) {
  if (A?.type === "assistant" && "usage" in A.message && !(A.message.content[0]?.type === "text" && SZ0.has(A.message.content[0].text)) && A.message.model !== EKA) return A.message.usage;
  return
}
// @from(Ln 247629, Col 0)
function uSA(A) {
  return A.input_tokens + (A.cache_creation_input_tokens ?? 0) + (A.cache_read_input_tokens ?? 0) + A.output_tokens
}
// @from(Ln 247633, Col 0)
function sH(A) {
  let Q = A.length - 1;
  while (Q >= 0) {
    let B = A[Q],
      G = B ? Jd(B) : void 0;
    if (G) return uSA(G);
    Q--
  }
  return 0
}
// @from(Ln 247644, Col 0)
function oeB(A) {
  let Q = A.length - 1;
  while (Q >= 0) {
    let B = A[Q],
      G = B ? Jd(B) : void 0;
    if (G) return G.output_tokens;
    Q--
  }
  return 0
}
// @from(Ln 247655, Col 0)
function reB(A) {
  for (let Q = A.length - 1; Q >= 0; Q--) {
    let B = A[Q],
      G = B ? Jd(B) : void 0;
    if (G) return {
      input_tokens: G.input_tokens,
      output_tokens: G.output_tokens,
      cache_creation_input_tokens: G.cache_creation_input_tokens ?? 0,
      cache_read_input_tokens: G.cache_read_input_tokens ?? 0
    }
  }
  return null
}
// @from(Ln 247669, Col 0)
function h51(A) {
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "assistant") {
      let Z = Jd(G);
      if (Z) return uSA(Z) > 200000;
      return !1
    }
  }
  return !1
}
// @from(Ln 247681, Col 0)
function seB(A) {
  if (A < 1000) return `~${A}`;
  return `~${(A/1000).toFixed(1)}k`
}
// @from(Ln 247686, Col 0)
function g51(A) {
  let Q = 0;
  for (let B of A.message.content)
    if (B.type === "text") Q += B.text.length;
    else if (B.type === "thinking") Q += B.thinking.length;
  else if (B.type === "redacted_thinking") Q += B.data.length;
  else if (B.type === "tool_use") Q += eA(B.input).length;
  return Q
}
// @from(Ln 247696, Col 0)
function HKA(A) {
  let Q = A.length - 1;
  while (Q >= 0) {
    let B = A[Q],
      G = B ? Jd(B) : void 0;
    if (G) return uSA(G) + TZ0(A.slice(Q + 1));
    Q--
  }
  return TZ0(A)
}
// @from(Ln 247706, Col 4)
uC = w(() => {
  tQ();
  qN();
  A0()
})
// @from(Ln 247712, Col 0)
function xZ0(A) {
  if (!A || A.trim() === "") return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>
`;
  return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>


Additional Instructions:
${A}`
}
// @from(Ln 247910, Col 0)
function Wt8(A) {
  let Q = A,
    B = Q.match(/<analysis>([\s\S]*?)<\/analysis>/);
  if (B) {
    let Z = B[1] || "";
    Q = Q.replace(/<analysis>[\s\S]*?<\/analysis>/, `Analysis:
${Z.trim()}`)
  }
  let G = Q.match(/<summary>([\s\S]*?)<\/summary>/);
  if (G) {
    let Z = G[1] || "";
    Q = Q.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${Z.trim()}`)
  }
  return Q = Q.replace(/\n\n+/g, `

`), Q.trim()
}
// @from(Ln 247929, Col 0)
function u51(A, Q, B, G) {
  let Y = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${Wt8(A)}`;
  if (B) Y += `

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${B}`;
  if (G) Y += `

Recent messages are preserved verbatim.`;
  if (Q) return `${Y}
Please continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  return Y
}
// @from(Ln 247953, Col 0)
function Et8() {
  let A = process.platform,
    Q = {
      darwin: "No image found in clipboard. Use Cmd + Ctrl + Shift + 4 to copy a screenshot to clipboard.",
      win32: "No image found in clipboard. Use Print Screen to copy a screenshot to clipboard.",
      linux: "No image found in clipboard. Use appropriate screenshot tool to copy a screenshot to clipboard."
    };
  return Q[A] || Q.linux
}
// @from(Ln 247963, Col 0)
function teB() {
  let A = process.platform,
    Q = process.env.CLAUDE_CODE_TMPDIR || (A === "win32" ? process.env.TEMP || "C:\\Temp" : "/tmp"),
    B = "claude_cli_latest_screenshot.png",
    G = {
      darwin: yZ0(Q, "claude_cli_latest_screenshot.png"),
      linux: yZ0(Q, "claude_cli_latest_screenshot.png"),
      win32: yZ0(Q, "claude_cli_latest_screenshot.png")
    },
    Z = G[A] || G.linux,
    Y = {
      darwin: {
        checkImage: "osascript -e 'the clipboard as «class PNGf»'",
        saveImage: `osascript -e 'set png_data to (the clipboard as «class PNGf»)' -e 'set fp to open for access POSIX file "${Z}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
        getPath: "osascript -e 'get POSIX path of (the clipboard as «class furl»)'",
        deleteFile: `rm -f "${Z}"`
      },
      linux: {
        checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)"',
        saveImage: `xclip -selection clipboard -t image/png -o > "${Z}" 2>/dev/null || wl-paste --type image/png > "${Z}"`,
        getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
        deleteFile: `rm -f "${Z}"`
      },
      win32: {
        checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
        saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${Z.replace(/\\/g,"\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
        getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
        deleteFile: `del /f "${Z}"`
      }
    };
  return {
    commands: Y[A] || Y.linux,
    screenshotPath: Z
  }
}
// @from(Ln 247998, Col 0)
async function eeB() {
  if (process.platform !== "darwin") return !1;
  return (await J2("osascript", ["-e", "the clipboard as «class PNGf»"])).code === 0
}
// @from(Ln 248002, Col 0)
async function d51() {
  let {
    commands: A,
    screenshotPath: Q
  } = teB();
  try {
    if ((await e5(A.checkImage, {
        shell: !0,
        reject: !1
      })).exitCode !== 0) return null;
    if ((await e5(A.saveImage, {
        shell: !0,
        reject: !1
      })).exitCode !== 0) return null;
    let Z = vA().readFileBytesSync(Q),
      Y = await KKA(Z, Z.length, "png"),
      J = Y.buffer.toString("base64"),
      X = QA2(J);
    return e5(A.deleteFile, {
      shell: !0,
      reject: !1
    }), {
      base64: J,
      mediaType: X,
      dimensions: Y.dimensions
    }
  } catch {
    return null
  }
}
// @from(Ln 248032, Col 0)
async function zt8() {
  let {
    commands: A
  } = teB();
  try {
    let Q = await e5(A.getPath, {
      shell: !0,
      reject: !1
    });
    if (Q.exitCode !== 0 || !Q.stdout) return null;
    return Q.stdout.trim()
  } catch (Q) {
    return e(Q), null
  }
}
// @from(Ln 248048, Col 0)
function c51(A) {
  if (A.length < 4) return "image/png";
  if (A[0] === 137 && A[1] === 80 && A[2] === 78 && A[3] === 71) return "image/png";
  if (A[0] === 255 && A[1] === 216 && A[2] === 255) return "image/jpeg";
  if (A[0] === 71 && A[1] === 73 && A[2] === 70) return "image/gif";
  if (A[0] === 82 && A[1] === 73 && A[2] === 70 && A[3] === 70) {
    if (A.length >= 12 && A[8] === 87 && A[9] === 69 && A[10] === 66 && A[11] === 80) return "image/webp"
  }
  return "image/png"
}
// @from(Ln 248059, Col 0)
function QA2(A) {
  try {
    let Q = Buffer.from(A, "base64");
    return c51(Q)
  } catch {
    return "image/png"
  }
}
// @from(Ln 248068, Col 0)
function BA2(A) {
  if (A.startsWith('"') && A.endsWith('"') || A.startsWith("'") && A.endsWith("'")) return A.slice(1, -1);
  return A
}
// @from(Ln 248073, Col 0)
function GA2(A) {
  if (process.platform === "win32") return A;
  let G = `__DOUBLE_BACKSLASH_${Kt8(8).toString("hex")}__`;
  return A.replace(/\\\\/g, G).replace(/\\(.)/g, "$1").replace(new RegExp(G, "g"), "\\")
}
// @from(Ln 248079, Col 0)
function vZ0(A) {
  let Q = BA2(A.trim()),
    B = GA2(Q);
  return AA2.test(B)
}
// @from(Ln 248085, Col 0)
function $t8(A) {
  let Q = BA2(A.trim()),
    B = GA2(Q);
  if (AA2.test(B)) return B;
  return null
}
// @from(Ln 248091, Col 0)
async function ZA2(A) {
  let Q = $t8(A);
  if (!Q) return null;
  let B = Q,
    G;
  try {
    if (Ht8(B)) G = vA().readFileBytesSync(B);
    else {
      let I = await zt8();
      if (I && B === Vt8(I)) G = vA().readFileBytesSync(I)
    }
  } catch (I) {
    return e(I), null
  }
  if (!G) return null;
  let Z = Ft8(B).slice(1).toLowerCase() || "png",
    Y = await KKA(G, G.length, Z),
    J = Y.buffer.toString("base64"),
    X = QA2(J);
  return {
    path: B,
    base64: J,
    mediaType: X,
    dimensions: Y.dimensions
  }
}
// @from(Ln 248117, Col 4)
$YZ
// @from(Ln 248117, Col 9)
m51 = 800
// @from(Ln 248118, Col 2)
AA2
// @from(Ln 248119, Col 4)
mSA = w(() => {
  t4();
  Vq();
  DQ();
  v1();
  Ib();
  $YZ = Et8();
  AA2 = /\.(png|jpe?g|gif|webp)$/i
})
// @from(Ln 248128, Col 4)
YA2 = "https://claude.com/claude-code"
// @from(Ln 248129, Col 4)
mC = "command-name"
// @from(Ln 248130, Col 2)
fz = "command-message"
// @from(Ln 248131, Col 2)
kZ0 = "local-command-caveat"
// @from(Ln 248132, Col 2)
bZ0 = "tick"
// @from(Ln 248133, Col 2)
zF = "task-notification"
// @from(Ln 248134, Col 2)
IO = "task-id"
// @from(Ln 248135, Col 2)
p51 = "task-type"
// @from(Ln 248136, Col 2)
Kb = "output-file"
// @from(Ln 248137, Col 2)
hz = "status"
// @from(Ln 248138, Col 2)
gz = "summary"
// @from(Ln 248139, Col 2)
zKA
// @from(Ln 248139, Col 7)
$KA
// @from(Ln 248140, Col 4)
cD = w(() => {
  zKA = ["help", "-h", "--help"], $KA = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"]
})
// @from(Ln 248144, Col 0)
function l51() {
  if (_dA() === "remote") return {
    commit: "",
    pr: ""
  };
  let A = XeQ(B5()),
    Q = `\uD83E\uDD16 Generated with [Claude Code](${YA2})`,
    B = `Co-Authored-By: ${A} <noreply@anthropic.com>`,
    G = r3();
  if (G.attribution) return {
    commit: G.attribution.commit ?? B,
    pr: G.attribution.pr ?? Q
  };
  if (G.includeCoAuthoredBy === !1) return {
    commit: "",
    pr: ""
  };
  return {
    commit: B,
    pr: Q
  }
}
// @from(Ln 248166, Col 4)
i51 = w(() => {
  C0();
  GB();
  l2();
  d4();
  vI();
  B2A();
  v1();
  T1();
  cD()
})
// @from(Ln 248178, Col 0)
function n51() {
  let A = process.env.BASH_DEFAULT_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Q
  }
  return 120000
}
// @from(Ln 248187, Col 0)
function JA2() {
  let A = process.env.BASH_MAX_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Math.max(Q, n51())
  }
  return Math.max(600000, n51())
}
// @from(Ln 248196, Col 0)
function dSA() {
  let A = zdA.validate(process.env.BASH_MAX_OUTPUT_LENGTH);
  if (A.status === "capped") k(`BASH_MAX_OUTPUT_LENGTH ${A.message}`);
  return A.effective
}
// @from(Ln 248202, Col 0)
function CKA() {
  return n51()
}
// @from(Ln 248206, Col 0)
function a51() {
  return JA2()
}
// @from(Ln 248210, Col 0)
function Ct8() {
  if (!XB.isSandboxingEnabled()) return "";
  let A = XB.getFsReadConfig(),
    Q = XB.getFsWriteConfig(),
    B = XB.getNetworkRestrictionConfig(),
    G = XB.getAllowUnixSockets(),
    Z = XB.getIgnoreViolations(),
    Y = XB.areUnsandboxedCommandsAllowed(),
    J = {
      read: A,
      write: Q
    },
    X = {
      ...B?.allowedHosts && {
        allowedHosts: B.allowedHosts
      },
      ...B?.deniedHosts && {
        deniedHosts: B.deniedHosts
      },
      ...G && {
        allowUnixSockets: G
      }
    },
    I = [];
  if (Object.keys(J).length > 0) I.push(`    - Filesystem: ${eA(J,null,2).split(`
`).join(`
      `)}`);
  if (Object.keys(X).length > 0) I.push(`    - Network: ${eA(X,null,2).split(`
`).join(`
      `)}`);
  if (Z) I.push(`    - Ignored violations: ${eA(Z,null,2).split(`
`).join(`
      `)}`);
  let D = jJ() ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true` as they do not work properly in sandboxed mode\n" : "",
    W = Y ? `  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox - each command should run sandboxed by default
${D}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
        - Unix socket connection errors
      - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
      - Mention: "Use \`/sandbox\` to manage restrictions"
      - This will prompt the user for permission
    - Example of normal usage: { "command": "ls", "description": "List files" }
    - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
    - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist` : "  - CRITICAL: All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy\n    - Commands cannot run outside the sandbox under any circumstances\n    - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead";
  return `- Commands run in a sandbox by default with the following restrictions:
${I.join(`
`)}
${W}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead
    - Most programs that respect TMPDIR will automatically use \`/tmp/claude/\``
}
// @from(Ln 248276, Col 0)
function Ut8() {
  if (a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return "";
  return "\n  - You can use the `run_in_background` parameter to run the command in the background. Only use this if you don't need the result immediately and are OK being notified when the command completes later. You do not need to check the output right away - you'll be notified when it finishes. You do not need to use '&' at the end of the command when using this parameter."
}
// @from(Ln 248281, Col 0)
function XA2() {
  return `Executes a given bash command in a persistent shell session with optional timeout, ensuring proper handling and security measures.

IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.

Before executing the command, please follow these steps:

1. Directory Verification:
   - If the command will create new directories or files, first use \`ls\` to verify the parent directory exists and is the correct location
   - For example, before running "mkdir foo/bar", first use \`ls foo\` to check that "foo" exists and is the intended parent directory

2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - Examples of proper quoting:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
     - python "/path/with spaces/script.py" (correct)
     - python /path/with spaces/script.py (incorrect - will fail)
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.

Usage notes:
  - The command argument is required.
  - You can specify an optional timeout in milliseconds (up to ${a51()}ms / ${a51()/60000} minutes). If not specified, commands will timeout after ${CKA()}ms (${CKA()/60000} minutes).
  - It is very helpful if you write a clear, concise description of what this command does. For simple commands, keep it brief (5-10 words). For complex commands (piped commands, obscure flags, or anything hard to understand at a glance), add enough context to clarify what it does.
  - If the output exceeds ${dSA()} characters, output will be truncated before being returned to you.
  ${Ut8()}
  ${Ct8()}
  - Avoid using Bash with the \`find\`, \`grep\`, \`cat\`, \`head\`, \`tail\`, \`sed\`, \`awk\`, or \`echo\` commands, unless explicitly instructed or when these commands are truly necessary for the task. Instead, always prefer using the dedicated tools for these commands:
    - File search: Use ${lI} (NOT find or ls)
    - Content search: Use ${DI} (NOT grep or rg)
    - Read files: Use ${z3} (NOT cat/head/tail)
    - Edit files: Use ${I8} (NOT sed/awk)
    - Write files: Use ${BY} (NOT echo >/cat <<EOF)
    - Communication: Output text directly (NOT echo/printf)
  - When issuing multiple commands:
    - If the commands are independent and can run in parallel, make multiple ${X9} tool calls in a single message. For example, if you need to run "git status" and "git diff", send a single message with two ${X9} tool calls in parallel.
    - If the commands depend on each other and must run sequentially, use a single ${X9} call with '&&' to chain them together (e.g., \`git add . && git commit -m "message" && git push\`). For instance, if one operation must complete before another starts (like mkdir before cp, Write before Bash for git operations, or git add before git commit), run these operations sequentially instead.
    - Use ';' only when you need to run commands sequentially but don't care if earlier commands fail
    - DO NOT use newlines to separate commands (newlines are ok in quoted strings)
  - Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of \`cd\`. You may use \`cd\` if the User explicitly requests it.
    <good-example>
    pytest /foo/bar/tests
    </good-example>
    <bad-example>
    cd /foo/bar && pytest tests
    </bad-example>

${qt8()}`
}
// @from(Ln 248332, Col 0)
function qt8() {
  let A = "You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance.",
    {
      commit: Q,
      pr: B
    } = l51();
  return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Avoid git commit --amend. ONLY use --amend when ALL conditions are met:
  (1) User explicitly requested amend, OR commit SUCCEEDED but pre-commit hook auto-modified files that need including
  (2) HEAD commit was created by you in this conversation (verify: git log -1 --format='%an %ae')
  (3) Commit has NOT been pushed to remote (verify: git status shows "Your branch is ahead")
- CRITICAL: If commit FAILED or was REJECTED by hook, NEVER amend - fix the issue and create a NEW commit
- CRITICAL: If you already pushed to remote, NEVER amend unless user explicitly requests it (requires force push)
- NEVER commit changes unless the user explicitly asks you to. It is VERY IMPORTANT to only commit when explicitly asked, otherwise the user will feel that you are being too proactive.

1. ${A} run the following bash commands in parallel, each using the ${X9} tool:
  - Run a git status command to see all untracked files. IMPORTANT: Never use the -uall flag as it can cause memory issues on large repos.
  - Run a git diff command to see both staged and unstaged changes that will be committed.
  - Run a git log command to see recent commit messages, so that you can follow this repository's commit message style.
2. Analyze all staged changes (both previously staged and newly added) and draft a commit message:
  - Summarize the nature of the changes (eg. new feature, enhancement to an existing feature, bug fix, refactoring, test, docs, etc.). Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.).
  - Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
  - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"
  - Ensure it accurately reflects the changes and their purpose
3. ${A} run the following commands:
   - Add relevant untracked files to the staging area.
   - Create the commit with a message${Q?` ending with:
   ${Q}`:"."}
   - Run git status after the commit completes to verify success.
   Note: git status depends on the commit completing, so run it sequentially after the commit.
4. If the commit fails due to pre-commit hook, fix the issue and create a NEW commit (see amend rules above)

Important notes:
- NEVER run additional commands to read or explore code, besides git bash commands
- NEVER use the ${vD.name} or ${f3} tools
- DO NOT push to the remote repository unless the user explicitly asks you to do so
- IMPORTANT: Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported.
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- In order to ensure good formatting, ALWAYS pass the commit message via a HEREDOC, a la this example:
<example>
git commit -m "$(cat <<'EOF'
   Commit message here.${Q?`

   ${Q}`:""}
   EOF
   )"
</example>

# Creating pull requests
Use the gh command via the Bash tool for ALL GitHub-related tasks including working with issues, pull requests, checks, and releases. If given a Github URL use the gh command to get the information needed.

IMPORTANT: When the user asks you to create a pull request, follow these steps carefully:

1. ${A} run the following bash commands in parallel using the ${X9} tool, in order to understand the current state of the branch since it diverged from the main branch:
   - Run a git status command to see all untracked files (never use -uall flag)
   - Run a git diff command to see both staged and unstaged changes that will be committed
   - Check if the current branch tracks a remote branch and is up to date with the remote, so you know if you need to push to the remote
   - Run a git log command and \`git diff [base-branch]...HEAD\` to understand the full commit history for the current branch (from the time it diverged from the base branch)
2. Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request!!!), and draft a pull request summary
3. ${A} run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create with the format below. Use a HEREDOC to pass the body to ensure correct formatting.
<example>
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${B?`

${B}`:""}
EOF
)"
</example>

Important:
- DO NOT use the ${vD.name} or ${f3} tools
- Return the PR URL when you're done, so the user can see it

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments`
}
// @from(Ln 248423, Col 4)
cSA = w(() => {
  wP();
  cW();
  pL();
  SIA();
  i51();
  T1();
  TCA();
  NJ();
  $F();
  A0();
  fQ()
})
// @from(Ln 248437, Col 0)
function o51(A, Q) {
  let B = A.lastIndexOf(" -");
  if (B > 0) {
    let G = A.substring(0, B),
      Z = A.substring(B + 1);
    return `${m6([G])} ${Z} ${m6([Q])}`
  } else return `${m6([A])} ${m6([Q])}`
}
// @from(Ln 248445, Col 4)
fZ0 = w(() => {
  pV()
})
// @from(Ln 248449, Col 0)
function hZ0(A) {
  if (/\d\s*<<\s*\d/.test(A) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(A) || /\$\(\(.*<<.*\)\)/.test(A)) return !1;
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(A)
}
// @from(Ln 248454, Col 0)
function Nt8(A) {
  let Q = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
    B = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
  return Q.test(A) || B.test(A)
}
// @from(Ln 248460, Col 0)
function IA2(A, Q = !0) {
  if (hZ0(A) || Nt8(A)) {
    let G = `'${A.replace(/'/g,`'"'"'`)}'`;
    if (hZ0(A)) return G;
    return Q ? `${G} < /dev/null` : G
  }
  if (Q) return m6([A, "<", "/dev/null"]);
  return m6([A])
}
// @from(Ln 248470, Col 0)
function wt8(A) {
  return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(A)
}
// @from(Ln 248474, Col 0)
function DA2(A) {
  if (hZ0(A)) return !1;
  if (wt8(A)) return !1;
  return !0
}
// @from(Ln 248479, Col 4)
WA2 = w(() => {
  pV()
})
// @from(Ln 248482, Col 4)
zA2 = U((QJZ, EA2) => {
  var HA2 = NA("child_process"),
    KA2 = HA2.spawn,
    Lt8 = HA2.exec;
  EA2.exports = function (A, Q, B) {
    if (typeof Q === "function" && B === void 0) B = Q, Q = void 0;
    if (A = parseInt(A), Number.isNaN(A))
      if (B) return B(Error("pid must be a number"));
      else throw Error("pid must be a number");
    var G = {},
      Z = {};
    switch (G[A] = [], Z[A] = 1, process.platform) {
      case "win32":
        Lt8("taskkill /pid " + A + " /T /F", B);
        break;
      case "darwin":
        gZ0(A, G, Z, function (Y) {
          return KA2("pgrep", ["-P", Y])
        }, function () {
          VA2(G, Q, B)
        });
        break;
      default:
        gZ0(A, G, Z, function (Y) {
          return KA2("ps", ["-o", "pid", "--no-headers", "--ppid", Y])
        }, function () {
          VA2(G, Q, B)
        });
        break
    }
  };

  function VA2(A, Q, B) {
    var G = {};
    try {
      Object.keys(A).forEach(function (Z) {
        if (A[Z].forEach(function (Y) {
            if (!G[Y]) FA2(Y, Q), G[Y] = 1
          }), !G[Z]) FA2(Z, Q), G[Z] = 1
      })
    } catch (Z) {
      if (B) return B(Z);
      else throw Z
    }
    if (B) return B()
  }

  function FA2(A, Q) {
    try {
      process.kill(parseInt(A, 10), Q)
    } catch (B) {
      if (B.code !== "ESRCH") throw B
    }
  }

  function gZ0(A, Q, B, G, Z) {
    var Y = G(A),
      J = "";
    Y.stdout.on("data", function (D) {
      var D = D.toString("ascii");
      J += D
    });
    var X = function (I) {
      if (delete B[A], I != 0) {
        if (Object.keys(B).length == 0) Z();
        return
      }
      J.match(/\d+/g).forEach(function (D) {
        D = parseInt(D, 10), Q[A].push(D), Q[D] = [], B[D] = 1, gZ0(D, Q, B, G, Z)
      })
    };
    Y.on("close", X)
  }
})
// @from(Ln 248556, Col 0)
class pSA {
  capacity;
  buffer;
  head = 0;
  size = 0;
  constructor(A) {
    this.capacity = A;
    this.buffer = Array(A)
  }
  add(A) {
    if (this.buffer[this.head] = A, this.head = (this.head + 1) % this.capacity, this.size < this.capacity) this.size++
  }
  addAll(A) {
    for (let Q of A) this.add(Q)
  }
  getRecent(A) {
    let Q = [],
      B = this.size < this.capacity ? 0 : this.head,
      G = Math.min(A, this.size);
    for (let Z = 0; Z < G; Z++) {
      let Y = (B + this.size - G + Z) % this.capacity;
      Q.push(this.buffer[Y])
    }
    return Q
  }
  toArray() {
    if (this.size === 0) return [];
    let A = [],
      Q = this.size < this.capacity ? 0 : this.head;
    for (let B = 0; B < this.size; B++) {
      let G = (Q + B) % this.capacity;
      A.push(this.buffer[G])
    }
    return A
  }
  clear() {
    this.head = 0, this.size = 0
  }
  length() {
    return this.size
  }
}
// @from(Ln 248599, Col 0)
function uZ0(A, Q = ",", B = 67108736) {
  let Z = "";
  for (let Y of A) {
    let J = Z ? Q : "",
      X = J + Y;
    if (Z.length + X.length <= B) Z += X;
    else {
      let I = B - Z.length - J.length - 14;
      if (I > 0) Z += J + Y.slice(0, I) + "...[truncated]";
      else Z += "...[truncated]";
      return Z
    }
  }
  return Z
}
// @from(Ln 248614, Col 0)
class UKA {
  maxSize;
  content = "";
  isTruncated = !1;
  totalBytesReceived = 0;
  constructor(A = 67108736) {
    this.maxSize = A
  }
  append(A) {
    let Q = typeof A === "string" ? A : A.toString();
    if (this.totalBytesReceived += Q.length, this.isTruncated && this.content.length >= this.maxSize) return;
    if (this.content.length + Q.length > this.maxSize) {
      let B = this.maxSize - this.content.length;
      if (B > 0) this.content += Q.slice(0, B);
      this.isTruncated = !0
    } else this.content += Q
  }
  toString() {
    if (!this.isTruncated) return this.content;
    let A = this.totalBytesReceived - this.maxSize,
      Q = Math.round(A / 1024);
    return this.content + `
... [output truncated - ${Q}KB removed]`
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
// @from(Ln 248655, Col 0)
function UA2(A) {
  let Q = null,
    B = new UKA;
  A.on("data", (Z) => {
    if (Q) Q.write(Z);
    else B.append(Z)
  });
  let G = () => B.toString();
  return {
    get: G,
    asStream() {
      return Q = new Ot8({
        highWaterMark: 10485760
      }), Q.on("error", () => {}), Q.write(G()), B.clear(), Q
    }
  }
}
// @from(Ln 248673, Col 0)
function r51(A, Q, B, G, Z = !1) {
  let Y = "running",
    J, X = UA2(A.stdout),
    I = UA2(A.stderr);
  if (G) {
    let z = new pSA(1000),
      $ = 0,
      O = (L) => {
        let _ = L.toString().split(`
`).filter((x) => x.trim());
        z.addAll(_), $ += _.length;
        let j = z.getRecent(5);
        if (j.length > 0) G(uZ0(j, `
`), uZ0(z.getRecent(100), `
`), $)
      };
    A.stdout.on("data", O), A.stderr.on("data", O)
  }
  let D = (z) => {
      if (Y = "killed", A.pid) qA2.default(A.pid, "SIGKILL")
    },
    W = null,
    K, V, F = (z) => {
      if (Y === "running") return J = z, Y = "backgrounded", K(), {
        stdoutStream: X.asStream(),
        stderrStream: I.asStream()
      };
      return null
    },
    H = new Promise((z) => {
      let $ = () => D();
      K = () => {
        if (W) clearTimeout(W), W = null;
        Q.removeEventListener("abort", $)
      }, Q.addEventListener("abort", $, {
        once: !0
      }), new Promise((O) => {
        let L = D;
        D = (M) => {
          L(), O(M || $A2)
        }, W = setTimeout(() => {
          if (Z && V) V(F);
          else D(CA2)
        }, B), A.on("close", (M, _) => {
          O(M !== null && M !== void 0 ? M : _ === "SIGTERM" ? 144 : 1)
        }), A.on("error", () => O(1))
      }).then((O) => {
        if (K(), Y === "running" || Y === "backgrounded") Y = "completed";
        let L = {
          code: O,
          stdout: X.get(),
          stderr: I.get(),
          interrupted: O === $A2,
          backgroundTaskId: J
        };
        if (O === CA2) L.stderr = [`Command timed out after ${QI(B)}`, L.stderr].filter(Boolean).join(" ");
        z(L)
      })
    }),
    E = {
      get status() {
        return Y
      },
      background: F,
      kill: () => D(),
      result: H
    };
  if (Z) E.onTimeout = (z) => {
    V = z
  };
  return E
}
// @from(Ln 248746, Col 0)
function NA2(A) {
  return {
    get status() {
      return "killed"
    },
    background: () => null,
    kill: () => {},
    result: Promise.resolve({
      code: 145,
      stdout: "",
      stderr: "Command aborted before execution",
      interrupted: !0,
      backgroundTaskId: A
    })
  }
}
// @from(Ln 248762, Col 4)
qA2
// @from(Ln 248762, Col 9)
$A2 = 137
// @from(Ln 248763, Col 2)
CA2 = 143
// @from(Ln 248764, Col 4)
mZ0 = w(() => {
  qA2 = c(zA2(), 1)
})
// @from(Ln 248768, Col 0)
function LA2(A) {
  if (A.includes("`")) return m6([A, "<", "/dev/null"]);
  if (A.includes("$(")) return m6([A, "<", "/dev/null"]);
  if (jt8(A)) return m6([A, "<", "/dev/null"]);
  let Q = bY(A);
  if (!Q.success) return m6([A, "<", "/dev/null"]);
  let B = Q.tokens,
    G = Mt8(B);
  if (G <= 0) return m6([A, "<", "/dev/null"]);
  let Z = [...wA2(B, 0, G), "< /dev/null", ...wA2(B, G, B.length)];
  return m6([Z.join(" ")])
}
// @from(Ln 248781, Col 0)
function Mt8(A) {
  for (let Q = 0; Q < A.length; Q++) {
    let B = A[Q];
    if (dZ0(B, "|")) return Q
  }
  return -1
}
// @from(Ln 248789, Col 0)
function wA2(A, Q, B) {
  let G = [],
    Z = !1;
  for (let Y = Q; Y < B; Y++) {
    let J = A[Y];
    if (typeof J === "string" && /^[012]$/.test(J) && Y + 2 < B && dZ0(A[Y + 1])) {
      let X = A[Y + 1],
        I = A[Y + 2];
      if (X.op === ">&" && typeof I === "string" && /^[012]$/.test(I)) {
        G.push(`${J}>&${I}`), Y += 2;
        continue
      }
      if (X.op === ">" && I === "/dev/null") {
        G.push(`${J}>/dev/null`), Y += 2;
        continue
      }
      if (X.op === ">" && typeof I === "string" && I.startsWith("&")) {
        let D = I.slice(1);
        if (/^[012]$/.test(D)) {
          G.push(`${J}>&${D}`), Y += 2;
          continue
        }
      }
    }
    if (typeof J === "string")
      if (!Z && Rt8(J)) {
        let I = J.indexOf("="),
          D = J.slice(0, I),
          W = J.slice(I + 1),
          K = m6([W]);
        G.push(`${D}=${K}`)
      } else Z = !0, G.push(m6([J]));
    else if (dZ0(J)) {
      if (J.op === "glob" && "pattern" in J) G.push(J.pattern);
      else if (G.push(J.op), _t8(J.op)) Z = !1
    }
  }
  return G
}
// @from(Ln 248829, Col 0)
function Rt8(A) {
  return /^[A-Za-z_][A-Za-z0-9_]*=/.test(A)
}
// @from(Ln 248833, Col 0)
function _t8(A) {
  return A === "&&" || A === "||" || A === ";"
}
// @from(Ln 248837, Col 0)
function dZ0(A, Q) {
  if (!A || typeof A !== "object" || !("op" in A)) return !1;
  return Q ? A.op === Q : !0
}
// @from(Ln 248842, Col 0)
function jt8(A) {
  return /\b(for|while|until|if|case|select)\s/.test(A)
}
// @from(Ln 248845, Col 4)
OA2 = w(() => {
  pV()
})
// @from(Ln 248862, Col 0)
function yt8() {
  let A = GGA(),
    Q = m6([A.rgPath]),
    B = A.rgArgs.map((G) => m6([G]));
  return A.rgArgs.length > 0 ? `${Q} ${B.join(" ")}` : Q
}
// @from(Ln 248869, Col 0)
function lZ0(A) {
  let Q = A.includes("zsh") ? ".zshrc" : A.includes("bash") ? ".bashrc" : ".profile";
  return pZ0(s51.homedir(), Q)
}
// @from(Ln 248874, Col 0)
function vt8(A) {
  let Q = A.endsWith(".zshrc"),
    B = "";
  if (Q) B += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter system ones and write directly to file
      typeset +f | grep -vE '^(_|__)' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
  else B += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter system ones and give the rest to eval in b64 encoding
      declare -F | cut -d' ' -f3 | grep -vE '^(_|__)' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${cZ0}"${cZ0}$(echo '$encoded_func' | base64 -d)${cZ0}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
  if (Q) B += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
  else B += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
  return B += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      # Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
      # Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
      # programs that need Win32 Console in mintty, but winpty fails when there's no TTY
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `, B
}
// @from(Ln 248925, Col 0)
function kt8() {
  if (!jJ()) return null;
  try {
    let A = LG() ? process.execPath : process.argv[1];
    if (!A) return null;
    try {
      A = St8(A)
    } catch {}
    if ($Q() === "windows") A = iy(A);
    return {
      cliPath: A,
      args: ["--mcp-cli"]
    }
  } catch (A) {
    return e(A instanceof Error ? A : Error(String(A))), null
  }
}
// @from(Ln 248942, Col 0)
async function bt8() {
  let A = process.env.PATH;
  if ($Q() === "windows") {
    let Z = await e5("echo $PATH", {
      shell: !0,
      reject: !1
    });
    if (Z.exitCode === 0 && Z.stdout) A = Z.stdout.trim()
  }
  let Q = yt8(),
    B = kt8(),
    G = "";
  if (G += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! command -v rg >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
      echo '  alias rg='"'${Q.replace(/'/g,"'\\''")}'" >> "$SNAPSHOT_FILE"
      echo "fi" >> "$SNAPSHOT_FILE"
  `, B) {
    let Z = m6([B.cliPath]),
      Y = B.args.map((X) => m6([X])),
      J = `${Z} ${Y.join(" ")}`;
    G += `

      # Check for mcp-cli availability
      echo "# Check for mcp-cli availability" >> "$SNAPSHOT_FILE"
      echo "if ! command -v mcp-cli >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
      echo '  alias mcp-cli='"'${J.replace(/'/g,"'\\''")}'" >> "$SNAPSHOT_FILE"
      echo "fi" >> "$SNAPSHOT_FILE"
    `
  }
  return G += `

      # Add PATH to the file
      echo "export PATH=${m6([A||""])}" >> "$SNAPSHOT_FILE"
  `, G
}
// @from(Ln 248979, Col 0)
async function ft8(A, Q, B) {
  let G = lZ0(A),
    Z = G.endsWith(".zshrc"),
    Y = B ? vt8(G) : !Z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
    J = await bt8();
  return `SNAPSHOT_FILE=${m6([Q])}
      ${B?`source "${G}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${Y}

      ${J}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
// @from(Ln 249007, Col 4)
cZ0 = "\\"
// @from(Ln 249008, Col 2)
MA2 = 1e4
// @from(Ln 249009, Col 2)
RA2 = async (A) => {
    let Q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
    return k(`Creating shell snapshot for ${Q} (${A})`), new Promise(async (B) => {
      try {
        let G = lZ0(A);
        k(`Looking for shell config file: ${G}`);
        let Z = lSA(G);
        if (!Z) k(`Shell config file not found: ${G}, creating snapshot with Claude Code defaults only`);
        let Y = Date.now(),
          J = Math.random().toString(36).substring(2, 8),
          X = pZ0(zQ(), "shell-snapshots");
        k(`Snapshots directory: ${X}`);
        let I = pZ0(X, `snapshot-${Q}-${Y}-${J}.sh`);
        Pt8(X, {
          recursive: !0
        });
        let D = await ft8(A, I, Z);
        k(`Creating snapshot at: ${I}`), k(`Shell binary exists: ${lSA(A)}`), k(`Execution timeout: ${MA2}ms`), xt8(A, ["-c", "-l", D], {
          env: {
            ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
            SHELL: A,
            GIT_EDITOR: "true",
            CLAUDECODE: "1"
          },
          timeout: MA2,
          maxBuffer: 1048576,
          encoding: "utf8"
        }, async (W, K, V) => {
          if (W) {
            let F = W;
            if (k(`Shell snapshot creation failed: ${W.message}`), k("Error details:"), k(`  - Error code: ${F?.code}`), k(`  - Error signal: ${F?.signal}`), k(`  - Error killed: ${F?.killed}`), k(`  - Shell path: ${A}`), k(`  - Config file: ${lZ0(A)}`), k(`  - Config file exists: ${Z}`), k(`  - Working directory: ${o1()}`), k(`  - Claude home: ${zQ()}`), k(`Full snapshot script:
${D}`), K) k(`stdout output (${K.length} chars):
${K}`);
            else k("No stdout output captured");
            if (V) k(`stderr output (${V.length} chars): ${V}`);
            else k("No stderr output captured");
            e(Error(`Failed to create shell snapshot: ${W.message}`));
            let H = F?.signal ? s51.constants.signals[F.signal] : void 0;
            l("tengu_shell_snapshot_failed", {
              stderr_length: V?.length || 0,
              has_error_code: !!F?.code,
              error_signal_number: H,
              error_killed: F?.killed
            }), B(void 0)
          } else if (lSA(I)) {
            let F = Tt8(I).size;
            k(`Shell snapshot created successfully (${F} bytes)`), C6(async () => {
              try {
                if (lSA(I)) vA().unlinkSync(I), k(`Cleaned up session snapshot: ${I}`)
              } catch (H) {
                k(`Error cleaning up session snapshot: ${H}`)
              }
            }), B(I)
          } else {
            k(`Shell snapshot file not found after creation: ${I}`), k(`Checking if parent directory still exists: ${X}`);
            let F = lSA(X);
            if (k(`Parent directory exists: ${F}`), F) try {
              let H = vA().readdirSync(X);
              k(`Directory contains ${H.length} files`)
            } catch (H) {
              k(`Could not read directory contents: ${H}`)
            }
            l("tengu_shell_unknown_error", {}), B(void 0)
          }
        })
      } catch (G) {
        if (k(`Unexpected error during snapshot creation: ${G}`), G instanceof Error) k(`Error stack trace: ${G.stack}`);
        e(G instanceof Error ? G : Error(String(G))), l("tengu_shell_snapshot_error", {}), B(void 0)
      }
    })
  }
// @from(Ln 249080, Col 4)
_A2 = w(() => {
  pV();
  Vq();
  v1();
  Z0();
  fQ();
  nX();
  DQ();
  c3();
  T1();
  uy();
  V2();
  fGA();
  $F()
})
// @from(Ln 249105, Col 0)
function PA2() {
  let A = iZ0(zQ(), "session-env", q0());
  return ht8(A, {
    recursive: !0
  }), A
}
// @from(Ln 249112, Col 0)
function SA2(A) {
  return iZ0(PA2(), `hook-${A}.sh`)
}
// @from(Ln 249116, Col 0)
function xA2() {
  k("Invalidating session environment cache"), Br = void 0
}
// @from(Ln 249120, Col 0)
function yA2() {
  if ($Q() === "windows") return k("Session environment not yet supported on Windows"), null;
  if (Br !== void 0) return Br;
  let A = [],
    Q = process.env.CLAUDE_ENV_FILE;
  if (Q && TA2(Q)) try {
    let G = jA2(Q, "utf8").trim();
    if (G) A.push(G), k(`Session environment loaded from CLAUDE_ENV_FILE: ${Q} (${G.length} chars)`)
  } catch (G) {
    k(`Failed to read CLAUDE_ENV_FILE: ${G instanceof Error?G.message:String(G)}`)
  }
  let B = PA2();
  if (TA2(B)) try {
    let Z = gt8(B).filter((Y) => Y.startsWith("hook-") && Y.endsWith(".sh")).sort((Y, J) => {
      let X = parseInt(Y.match(/hook-(\d+)\.sh/)?.[1] || "0", 10),
        I = parseInt(J.match(/hook-(\d+)\.sh/)?.[1] || "0", 10);
      return X - I
    });
    for (let Y of Z) {
      let J = iZ0(B, Y),
        X = jA2(J, "utf8").trim();
      if (X) A.push(X)
    }
    if (Z.length > 0) k(`Session environment loaded from ${Z.length} hook file(s)`)
  } catch (G) {
    k(`Failed to load session environment from hooks: ${G instanceof Error?G.message:String(G)}`)
  }
  if (A.length === 0) return k("No session environment scripts found"), Br = null, Br;
  return Br = A.join(`
`), k(`Session environment script ready (${Br.length} chars total)`), Br
}
// @from(Ln 249151, Col 4)
Br = void 0
// @from(Ln 249152, Col 4)
t51 = w(() => {
  T1();
  c3();
  fQ();
  C0()
})
// @from(Ln 249159, Col 0)
function vA2() {
  return null
}
// @from(Ln 249184, Col 0)
function aZ0(A) {
  try {
    return at8(A, ut8.X_OK), !0
  } catch (Q) {
    try {
      return pt8(A, ["--version"], {
        timeout: 1000,
        stdio: "ignore"
      }), !0
    } catch {
      return !1
    }
  }
}
// @from(Ln 249199, Col 0)
function rt8(A) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
  if (A.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
  else if (A.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
  return null
}
// @from(Ln 249205, Col 0)
async function st8() {
  let A = process.env.CLAUDE_CODE_SHELL;
  if (A)
    if ((A.includes("bash") || A.includes("zsh")) && aZ0(A)) return k(`Using shell override: ${A}`), A;
    else k(`CLAUDE_CODE_SHELL="${A}" is not a valid bash/zsh path, falling back to detection`);
  let Q = async (K) => {
    let V = await e5(`which ${K}`, {
      shell: !0,
      reject: !1
    });
    if (V.exitCode !== 0 || !V.stdout) return null;
    return V.stdout.trim()
  }, B = process.env.SHELL, G = B && (B.includes("bash") || B.includes("zsh")), Z = B?.includes("bash"), [Y, J] = await Promise.all([Q("zsh"), Q("bash")]), X = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"], D = (Z ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((K) => X.map((V) => `${V}/${K}`));
  if (Z) {
    if (J) D.unshift(J);
    if (Y) D.push(Y)
  } else {
    if (Y) D.unshift(Y);
    if (J) D.push(J)
  }
  if (G && aZ0(B)) D.unshift(B);
  let W = D.find((K) => K && aZ0(K));
  if (!W) {
    let K = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
    throw e(Error(K)), Error(K)
  }
  return W
}
// @from(Ln 249233, Col 0)
async function tt8() {
  let A = await st8(),
    Q;
  try {
    Q = await RA2(A)
  } catch (B) {
    k(`Failed to create shell snapshot: ${B}`), Q = void 0
  }
  return {
    binShell: A,
    snapshotFilePath: Q
  }
}
// @from(Ln 249246, Col 0)
async function e51(A, Q, B, G, Z, Y, J, X) {
  let I = B || ot8,
    {
      binShell: D,
      snapshotFilePath: W
    } = await iSA();
  if (G) D = G, W = void 0;
  let K = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"),
    V = kA2.tmpdir();
  if ($Q() === "windows") V = iy(V);
  let F = nZ0(process.env.CLAUDE_CODE_TMPDIR || "/tmp", "claude"),
    H = J ? nZ0(F, `cwd-${K}`) : nZ0(V, `claude-${K}-cwd`),
    E = DA2(A),
    z = IA2(A, E);
  if (!J && A.includes("|") && E) z = LA2(A);
  let $ = [];
  if (W) {
    if (!dt8(W)) k(`Snapshot file missing, recreating: ${W}`), iSA.cache?.clear?.(), W = (await iSA()).snapshotFilePath;
    if (W) {
      let b = $Q() === "windows" ? iy(W) : W;
      $.push(`source ${m6([b])}`)
    }
  }
  let O = yA2();
  if (O) $.push(O);
  let L = rt8(D);
  if (L) $.push(L);
  $.push(`eval ${z}`), $.push(`pwd -P >| ${H}`);
  let M = $.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) M = o51(process.env.CLAUDE_CODE_SHELL_PREFIX, M);
  let _ = aL1();
  if (Q.aborted) return NA2();
  if (J) {
    M = await XB.wrapWithSandbox(M, D, void 0, Q);
    try {
      let b = vA();
      if (!b.existsSync(F)) b.mkdirSync(F)
    } catch (b) {
      k(`Failed to create ${F} directory: ${b}`)
    }
  }
  let j = (process.env.CLAUDE_BASH_NO_LOGIN === "true" || process.env.CLAUDE_BASH_NO_LOGIN === "1") && W !== void 0,
    x = ["-c", ...j ? [] : ["-l"], M];
  if (j) k("Spawning shell without login (-l flag skipped)");
  try {
    let b = vA2(),
      S = lt8(D, x, {
        env: {
          ...process.env,
          SHELL: D,
          GIT_EDITOR: "true",
          CLAUDECODE: "1",
          ...{},
          ...J ? {
            TMPDIR: F,
            CLAUDE_CODE_TMPDIR: F
          } : {},
          ...b ? {
            TMUX: b
          } : {}
        },
        cwd: _,
        detached: !0
      }),
      u = r51(S, Q, I, Z, X);
    return u.result.then(async (f) => {
      if (f && !Y && !f.backgroundTaskId) try {
        DO(mt8(H, {
          encoding: "utf8"
        }).trim(), _)
      } catch {
        l("tengu_shell_set_cwd", {
          success: !1
        })
      }
      try {
        ct8(H)
      } catch {}
    }), u
  } catch (b) {
    return k(`Shell exec error: ${b instanceof Error?b.message:String(b)}`), {
      status: "killed",
      background: () => null,
      kill: () => {},
      result: Promise.resolve({
        code: 126,
        stdout: "",
        stderr: b instanceof Error ? b.message : String(b),
        interrupted: !1
      })
    }
  }
}
// @from(Ln 249340, Col 0)
function DO(A, Q) {
  let B = it8(A) ? A : nt8(Q || vA().cwd(), A);
  if (!vA().existsSync(B)) throw Error(`Path "${B}" does not exist`);
  let G = vA().realpathSync(B);
  Ob0(G);
  try {
    l("tengu_shell_set_cwd", {
      success: !0
    })
  } catch (Z) {}
}
// @from(Ln 249351, Col 4)
ot8 = 1800000
// @from(Ln 249352, Col 2)
iSA
// @from(Ln 249353, Col 4)
Vb = w(() => {
  pV();
  fZ0();
  WA2();
  Vq();
  v1();
  Z0();
  mZ0();
  DQ();
  C0();
  fGA();
  c3();
  T1();
  OA2();
  _A2();
  Y9();
  V2();
  NJ();
  t51();
  iSA = W0(tt8)
})
// @from(Ln 249375, Col 0)
function oZ0(A) {
  let Q = A.split(`
`),
    B = 0;
  while (B < Q.length && Q[B]?.trim() === "") B++;
  let G = Q.length - 1;
  while (G >= 0 && Q[G]?.trim() === "") G--;
  if (B > G) return "";
  return Q.slice(B, G + 1).join(`
`)
}
// @from(Ln 249387, Col 0)
function rZ0(A) {
  return /^data:image\/[a-z0-9.+_-]+;base64,/i.test(A)
}
// @from(Ln 249391, Col 0)
function A71(A) {
  let Q = rZ0(A);
  if (Q) return {
    totalLines: 1,
    truncatedContent: A,
    isImage: Q
  };
  let B = dSA();
  if (A.length <= B) return {
    totalLines: A.split(`
`).length,
    truncatedContent: A,
    isImage: Q
  };
  let G = A.slice(0, B),
    Z = A.slice(B).split(`
`).length,
    Y = `${G}

... [${Z} lines truncated] ...`;
  return {
    totalLines: A.split(`
`).length,
    truncatedContent: Y,
    isImage: Q
  }
}
// @from(Ln 249419, Col 0)
function B71(A) {
  if (Wq1() || !WS(o1(), A)) {
    if (DO(EQ()), !Wq1()) return l("tengu_bash_tool_reset_to_original_dir", {}), !0
  }
  return !1
}
// @from(Ln 249425, Col 0)
async function bA2(A, Q, B, G) {
  let Y = (await CF({
    systemPrompt: [`Extract any file paths that this command reads or modifies. For commands like "git diff" and "cat", include the paths of files being shown. Use paths verbatim -- don't add any slashes or try to resolve them. Do not try to infer paths that were not explicitly listed in the command output.

IMPORTANT: Commands that do not display the contents of the files should not return any filepaths. For eg. "ls", pwd", "find". Even more complicated commands that don't display the contents should not be considered: eg "find . -type f -exec ls -la {} + | sort -k5 -nr | head -5"

First, determine if the command displays the contents of the files. If it does, then <is_displaying_contents> tag should be true. If it does not, then <is_displaying_contents> tag should be false.

Format your response as:
<is_displaying_contents>
true
</is_displaying_contents>

<filepaths>
path/to/file1
path/to/file2
</filepaths>

If no files are read or modified, return empty filepaths tags:
<filepaths>
</filepaths>

Do not include any other text in your response.`],
    userPrompt: `Command: ${A}
Output: ${Q}`,
    enablePromptCaching: !0,
    signal: B,
    options: {
      querySource: "bash_extract_command_paths",
      agents: [],
      isNonInteractiveSession: G,
      hasAppendSystemPrompt: !1,
      mcpTools: []
    }
  })).message.content.filter((J) => J.type === "text").map((J) => J.text).join("");
  return Q9(Y, "filepaths")?.trim().split(`
`).filter(Boolean) || []
}
// @from(Ln 249464, Col 0)
function fA2(A) {
  let Q = [],
    B = 0,
    G = 0;
  for (let Y of A)
    if (Y.type === "image") G++;
    else if (Y.type === "text" && "text" in Y) {
    B++;
    let J = Y.text.slice(0, 200);
    Q.push(J + (Y.text.length > 200 ? "..." : ""))
  }
  let Z = [];
  if (G > 0) Z.push(`[${G} image${G>1?"s":""}]`);
  if (B > 0) Z.push(`[${B} text block${B>1?"s":""}]`);
  return `MCP Result: ${Z.join(", ")}${Q.length>0?`

`+Q.join(`

`):""}`
}
// @from(Ln 249484, Col 4)
Q71 = (A) => `${A.trim()}
Shell cwd was reset to ${EQ()}`
// @from(Ln 249486, Col 4)
qKA = w(() => {
  fQ();
  nY();
  tQ();
  cSA();
  AY();
  C0();
  Z0();
  V2();
  Vb()
})
// @from(Ln 249498, Col 0)
function sZ0(A) {
  if (!A) return "";
  let Q = Array.isArray(A) ? A.join("") : A,
    {
      truncatedContent: B
    } = A71(Q);
  return B
}
// @from(Ln 249507, Col 0)
function Ae8(A) {
  if (typeof A["image/png"] === "string") return {
    image_data: A["image/png"].replace(/\s/g, ""),
    media_type: "image/png"
  };
  if (typeof A["image/jpeg"] === "string") return {
    image_data: A["image/jpeg"].replace(/\s/g, ""),
    media_type: "image/jpeg"
  };
  return
}
// @from(Ln 249519, Col 0)
function Qe8(A) {
  switch (A.output_type) {
    case "stream":
      return {
        output_type: A.output_type, text: sZ0(A.text)
      };
    case "execute_result":
    case "display_data":
      return {
        output_type: A.output_type, text: sZ0(A.data?.["text/plain"]), image: A.data && Ae8(A.data)
      };
    case "error":
      return {
        output_type: A.output_type, text: sZ0(`${A.ename}: ${A.evalue}
${A.traceback.join(`
`)}`)
      }
  }
}
// @from(Ln 249539, Col 0)
function hA2(A, Q, B, G) {
  let Z = A.id ?? `cell-${Q}`,
    Y = {
      cellType: A.cell_type,
      source: Array.isArray(A.source) ? A.source.join("") : A.source,
      execution_count: A.cell_type === "code" ? A.execution_count || void 0 : void 0,
      cell_id: Z
    };
  if (A.cell_type === "code") Y.language = B;
  if (A.cell_type === "code" && A.outputs?.length) {
    let J = A.outputs.map(Qe8);
    if (!G && eA(J).length > 1e4) Y.outputs = [{
      output_type: "stream",
      text: `Outputs are too large to include. Use ${X9} with: cat <notebook_path> | jq '.cells[${Q}].outputs'`
    }];
    else Y.outputs = J
  }
  return Y
}
// @from(Ln 249559, Col 0)
function Be8(A) {
  let Q = [];
  if (A.cellType !== "code") Q.push(`<cell_type>${A.cellType}</cell_type>`);
  if (A.language !== "python" && A.cellType === "code") Q.push(`<language>${A.language}</language>`);
  return {
    text: `<cell id="${A.cell_id}">${Q.join("")}${A.source}</cell id="${A.cell_id}">`,
    type: "text"
  }
}
// @from(Ln 249569, Col 0)
function Ge8(A) {
  let Q = [];
  if (A.text) Q.push({
    text: `
${A.text}`,
    type: "text"
  });
  if (A.image) Q.push({
    type: "image",
    source: {
      data: A.image.image_data,
      media_type: A.image.media_type,
      type: "base64"
    }
  });
  return Q
}
// @from(Ln 249587, Col 0)
function Ze8(A) {
  let Q = Be8(A),
    B = A.outputs?.flatMap(Ge8);
  return [Q, ...B ?? []]
}
// @from(Ln 249593, Col 0)
function gA2(A, Q) {
  let B = Y4(A),
    G = vA().readFileSync(B, {
      encoding: "utf-8"
    }),
    Z = AQ(G),
    Y = Z.metadata.language_info?.name ?? "python";
  if (Q) {
    let J = Z.cells.find((X) => X.id === Q);
    if (!J) throw Error(`Cell with ID "${Q}" not found in notebook`);
    return [hA2(J, Z.cells.indexOf(J), Y, !0)]
  }
  return Z.cells.map((J, X) => hA2(J, X, Y, !1))
}
// @from(Ln 249608, Col 0)
function uA2(A, Q) {
  let B = A.flatMap(Ze8);
  return {
    tool_use_id: Q,
    type: "tool_result",
    content: B.reduce((G, Z) => {
      if (G.length === 0) return [Z];
      let Y = G[G.length - 1];
      if (Y && Y.type === "text" && Z.type === "text") return Y.text += `
` + Z.text, G;
      return G.push(Z), G
    }, [])
  }
}
// @from(Ln 249623, Col 0)
function nSA(A) {
  let Q = A.match(/^cell-(\d+)$/);
  if (Q && Q[1]) {
    let B = parseInt(Q[1], 10);
    return isNaN(B) ? void 0 : B
  }
  return
}
// @from(Ln 249631, Col 4)
G71 = w(() => {
  qKA();
  oZ();
  DQ();
  A0()
})
// @from(Ln 249638, Col 0)
function x0({
  children: A,
  height: Q
}) {
  if (mA2.useContext(dA2)) return A;
  return KS.createElement(Ye8, null, KS.createElement(T, {
    flexDirection: "row",
    height: Q,
    overflowY: "hidden"
  }, KS.createElement(C, null, "  ", "⎿  "), A))
}
// @from(Ln 249650, Col 0)
function Ye8({
  children: A
}) {
  return KS.createElement(dA2.Provider, {
    value: !0
  }, A)
}
// @from(Ln 249657, Col 4)
KS
// @from(Ln 249657, Col 8)
mA2
// @from(Ln 249657, Col 13)
dA2
// @from(Ln 249658, Col 4)
c4 = w(() => {
  fA();
  KS = c(QA(), 1), mA2 = c(QA(), 1);
  dA2 = KS.createContext(!1)
})
// @from(Ln 249664, Col 0)
function Hb() {
  return Fb.createElement(Fb.Fragment, null, Fb.createElement(C, {
    dimColor: !0
  }, "Interrupted "), Fb.createElement(C, {
    dimColor: !0
  }, "· What should Claude do instead?"))
}
// @from(Ln 249671, Col 4)
Fb
// @from(Ln 249672, Col 4)
NKA = w(() => {
  fA();
  Fb = c(QA(), 1)
})
// @from(Ln 249677, Col 0)
function w7() {
  return aSA.createElement(x0, {
    height: 1
  }, aSA.createElement(Hb, null))
}
// @from(Ln 249682, Col 4)
aSA
// @from(Ln 249683, Col 4)
tH = w(() => {
  c4();
  NKA();
  aSA = c(QA(), 1)
})
// @from(Ln 249689, Col 0)
function ZB() {
  let A = cA2.useContext(l_A);
  if (!A) throw Error("useTerminalSize must be used within an Ink App component");
  return A
}
// @from(Ln 249694, Col 4)
cA2
// @from(Ln 249695, Col 4)
P4 = w(() => {
  U21();
  cA2 = c(QA(), 1)
})
// @from(Ln 249700, Col 0)
function F0({
  shortcut: A,
  action: Q,
  parens: B = !1,
  bold: G = !1
}) {
  let Z = G ? Z71.default.createElement(DF, {
    bold: !0
  }, A) : A;
  if (B) return Z71.default.createElement(DF, null, "(", Z, " to ", Q, ")");
  return Z71.default.createElement(DF, null, Z, " to ", Q)
}
// @from(Ln 249712, Col 4)
Z71
// @from(Ln 249713, Col 4)
e9 = w(() => {
  ADA();
  Z71 = c(QA(), 1)
})
// @from(Ln 249718, Col 0)
function oSA({
  children: A
}) {
  return b9A.default.createElement(pA2.Provider, {
    value: !0
  }, A)
}
// @from(Ln 249726, Col 0)
function VS() {
  let A = b9A.useContext(pA2),
    Q = J3("app:toggleTranscript", "Global", "ctrl+o");
  if (A) return null;
  return b9A.default.createElement(C, {
    dimColor: !0
  }, b9A.default.createElement(F0, {
    shortcut: Q,
    action: "expand",
    parens: !0
  }))
}
// @from(Ln 249739, Col 0)
function lA2() {
  let A = BN("app:toggleTranscript", "Global", "ctrl+o");
  return I1.dim(`(${A} to expand)`)
}
// @from(Ln 249743, Col 4)
b9A
// @from(Ln 249743, Col 9)
pA2
// @from(Ln 249744, Col 4)
Gr = w(() => {
  fA();
  Z3();
  e9();
  NX();
  b9A = c(QA(), 1), pA2 = b9A.default.createContext(!1)
})
// @from(Ln 249752, Col 0)
function AY0(A, Q) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) return;
  let B = Q ? `${A} ${Q}` : "";
  if (process.platform === "win32") process.title = B;
  else process.stdout.write(`\x1B]0;${B}\x07`)
}
// @from(Ln 249759, Col 0)
function X71(A) {
  if (J71 = A, !wKA) AY0(eZ0, A)
}
// @from(Ln 249763, Col 0)
function nA2() {
  X71("Claude Code")
}
// @from(Ln 249767, Col 0)
function aA2() {
  return J71
}
// @from(Ln 249771, Col 0)
function oA2() {
  if (wKA) return;
  Y71 = 0, wKA = setInterval(() => {
    Y71 = (Y71 + 1) % iA2.length, AY0(iA2[Y71] ?? eZ0, J71)
  }, Je8)
}
// @from(Ln 249778, Col 0)
function rSA() {
  if (wKA) clearInterval(wKA), wKA = null;
  AY0(eZ0, J71)
}
// @from(Ln 249782, Col 0)
async function rA2(A) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) return;
  if (A.startsWith("<local-command-stdout>")) return;
  let Q = "{";
  try {
    let B = await CF({
        systemPrompt: ["Analyze if this message indicates a new conversation topic. If it does, extract a 2-3 word title that captures the new topic. Format your response as a JSON object with two fields: 'isNewTopic' (boolean) and 'title' (string, or null if isNewTopic is false). Only include these fields, no other text. ONLY generate the JSON object, no other text (eg. no markdown)."],
        userPrompt: A,
        assistantPrompt: Q,
        signal: new AbortController().signal,
        options: {
          querySource: "terminal_update_title",
          agents: [],
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          mcpTools: []
        }
      }),
      G = Q + B.message.content.filter((Y) => Y.type === "text").map((Y) => Y.text).join(""),
      Z = c5(G);
    if (Z && typeof Z === "object" && "isNewTopic" in Z && "title" in Z) {
      if (Z.isNewTopic && Z.title) X71(Z.title)
    }
  } catch (B) {
    e(B)
  }
}
// @from(Ln 249810, Col 0)
function sI() {
  return new Promise((A) => {
    process.stdout.write(QjA(), () => {
      A()
    })
  })
}
// @from(Ln 249818, Col 0)
function Ie8(A, Q) {
  let B = A.split(`
`),
    G = [];
  for (let Y of B) {
    let J = A9(Y);
    if (J <= Q) G.push(Y.trimEnd());
    else {
      let X = 0;
      while (X < J) {
        let I = h_A(Y, X, X + Q);
        G.push(I.trimEnd()), X += Q
      }
    }
  }
  let Z = G.length - tZ0;
  if (Z === 1) return {
    aboveTheFold: G.slice(0, tZ0 + 1).join(`
`).trimEnd(),
    remainingLines: 0
  };
  return {
    aboveTheFold: G.slice(0, tZ0).join(`
`).trimEnd(),
    remainingLines: Math.max(0, Z)
  }
}
// @from(Ln 249846, Col 0)
function sA2(A, Q) {
  let B = A.trimEnd();
  if (!B) return "";
  let {
    aboveTheFold: G,
    remainingLines: Z
  } = Ie8(B, Math.max(Q - Xe8, 10));
  return [G, Z > 0 ? I1.dim(`… +${Z} lines ${lA2()}`) : ""].filter(Boolean).join(`
`)
}
// @from(Ln 249856, Col 4)
iA2
// @from(Ln 249856, Col 9)
eZ0 = "✳"
// @from(Ln 249857, Col 2)
Je8 = 960
// @from(Ln 249858, Col 2)
J71 = ""
// @from(Ln 249859, Col 2)
wKA = null
// @from(Ln 249860, Col 2)
Y71 = 0
// @from(Ln 249861, Col 2)
tZ0 = 3
// @from(Ln 249862, Col 2)
Xe8 = 9
// @from(Ln 249863, Col 4)
Xd = w(() => {
  nY();
  vI();
  v1();
  Z3();
  Gr();
  fQ();
  $Q0();
  UC();
  BB0();
  iA2 = ["⠂", "⠐"]
})
// @from(Ln 249876, Col 0)
function De8(A) {
  try {
    let Q = AQ(A),
      B = eA(Q),
      G = A.replace(/\s+/g, ""),
      Z = B.replace(/\s+/g, "");
    if (G !== Z) return A;
    return eA(Q, null, 2)
  } catch {
    return A
  }
}
// @from(Ln 249889, Col 0)
function tA2(A) {
  return A.split(`
`).map(De8).join(`
`)
}
// @from(Ln 249895, Col 0)
function Eb({
  content: A,
  verbose: Q,
  isError: B,
  isWarning: G
}) {
  let {
    columns: Z
  } = ZB(), Y = eA2.useMemo(() => {
    if (Q) return I71(tA2(A));
    else return I71(sA2(tA2(A), Z))
  }, [A, Q, Z]);
  return f9A.createElement(x0, null, f9A.createElement(C, {
    color: B ? "error" : G ? "warning" : void 0
  }, f9A.createElement(M8, null, Y)))
}
// @from(Ln 249912, Col 0)
function I71(A) {
  return A.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "")
}
// @from(Ln 249915, Col 4)
f9A
// @from(Ln 249915, Col 9)
eA2
// @from(Ln 249916, Col 4)
LKA = w(() => {
  fA();
  c4();
  P4();
  Xd();
  A0();
  f9A = c(QA(), 1), eA2 = c(QA(), 1)
})
// @from(Ln 249925, Col 0)
function D71(A) {
  return A.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}
// @from(Ln 249929, Col 0)
function X5({
  result: A,
  verbose: Q
}) {
  let B = J3("app:toggleTranscript", "Global", "ctrl+o"),
    G;
  if (typeof A !== "string") G = "Tool execution failed";
  else {
    let Y = Q9(A, "tool_use_error") ?? A,
      X = D71(Y).trim();
    if (!Q && X.includes("InputValidationError: ")) G = "Invalid tool parameters";
    else if (X.startsWith("Error: ")) G = X;
    else G = `Error: ${X}`
  }
  let Z = G.split(`
`).length - QY0;
  return eH.createElement(x0, null, eH.createElement(T, {
    flexDirection: "column"
  }, eH.createElement(C, {
    color: "error"
  }, I71(Q ? G : G.split(`
`).slice(0, QY0).join(`
`))), !Q && G.split(`
`).length > QY0 && eH.createElement(T, null, eH.createElement(C, {
    dimColor: !0
  }, "… +", Z, " ", Z === 1 ? "line" : "lines", " ("), eH.createElement(C, {
    dimColor: !0,
    bold: !0
  }, B), eH.createElement(C, null, " "), eH.createElement(C, {
    dimColor: !0
  }, "to see all)"))))
}
// @from(Ln 249961, Col 4)
eH
// @from(Ln 249961, Col 8)
QY0 = 10
// @from(Ln 249962, Col 4)
eW = w(() => {
  fA();
  c4();
  tQ();
  LKA();
  NX();
  eH = c(QA(), 1)
})
// @from(Ln 249974, Col 0)
function zb({
  filePath: A,
  children: Q
}) {
  return A12.default.createElement(i2, {
    url: We8(A).href
  }, Q ?? A)
}
// @from(Ln 249982, Col 4)
A12
// @from(Ln 249983, Col 4)
sSA = w(() => {
  WDA();
  A12 = c(QA(), 1)
})
// @from(Ln 249991, Col 0)
function Ve8(A) {
  return Ke8(4).readUInt32BE(0) % A
}
// @from(Ln 249995, Col 0)
function BY0(A) {
  return A[Ve8(A.length)]
}