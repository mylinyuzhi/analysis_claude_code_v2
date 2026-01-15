
// @from(Ln 328240, Col 4)
YY1 = w(() => {
  KGA();
  j9();
  YZ();
  tQ();
  M82();
  EO();
  l2();
  XX();
  fQ();
  Z0();
  KHA();
  uC();
  tQ();
  LD1();
  YyA();
  cC();
  _S();
  L4A();
  cW();
  bz0();
  d_();
  d4();
  gz0();
  T1();
  wc();
  mp1();
  dz0 = c(QA(), 1), nkA = a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), uP2 = m.object({
    description: m.string().describe("A short (3-5 word) description of the task"),
    prompt: m.string().describe("The task for the agent to perform"),
    subagent_type: m.string().describe("The type of specialized agent to use for this task"),
    model: m.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."),
    resume: m.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
    run_in_background: m.boolean().optional().describe(`Set to true to run this agent in the background. The tool result will include an output_file path - use ${z3} tool or ${X9} tail to check on output.`),
    max_turns: m.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
  }), Tz0 = nkA ? uP2.omit({
    run_in_background: !0
  }) : uP2, Bf5 = m.object({
    agentId: m.string(),
    content: m.array(m.object({
      type: m.literal("text"),
      text: m.string()
    })),
    totalToolUseCount: m.number(),
    totalDurationMs: m.number(),
    totalTokens: m.number(),
    usage: m.object({
      input_tokens: m.number(),
      output_tokens: m.number(),
      cache_creation_input_tokens: m.number().nullable(),
      cache_read_input_tokens: m.number().nullable(),
      server_tool_use: m.object({
        web_search_requests: m.number(),
        web_fetch_requests: m.number()
      }).nullable(),
      service_tier: m.enum(["standard", "priority", "batch"]).nullable(),
      cache_creation: m.object({
        ephemeral_1h_input_tokens: m.number(),
        ephemeral_5m_input_tokens: m.number()
      }).nullable()
    })
  }), Gf5 = Bf5.extend({
    status: m.literal("completed"),
    prompt: m.string()
  }), Zf5 = m.object({
    status: m.literal("async_launched"),
    agentId: m.string().describe("The ID of the async agent"),
    description: m.string().describe("The description of the task"),
    prompt: m.string().describe("The prompt for the agent"),
    outputFile: m.string().describe("Path to the output file for checking agent progress")
  }), Yf5 = m.union([Gf5, Zf5, X52]);
  xVA = {
    async prompt({
      agents: A,
      getToolPermissionContext: Q
    }) {
      let B = await Q(),
        G = mz0(A, B, f3);
      return await O82(G)
    },
    name: f3,
    maxResultSizeChars: 1e5,
    async description() {
      return "Launch a new task"
    },
    inputSchema: Tz0,
    outputSchema: Yf5,
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
        E = mz0(H, V.toolPermissionContext, f3),
        z = E.find((b) => b.agentType === Q);
      if (!z) {
        if (H.find((S) => S.agentType === Q)) {
          let S = cz0(V.toolPermissionContext, f3, Q);
          throw Error(`Agent type '${Q}' has been denied by permission rule '${f3}(${Q})' from ${S?.source??"settings"}.`)
        }
        throw Error(`Agent type '${Q}' not found. Available agents: ${E.map((S)=>S.agentType).join(", ")}`)
      }
      if (z.color) vVA(Q, z.color);
      let $ = YA1(z.model, X.options.mainLoopModel, G, F);
      l("tengu_agent_tool_selected", {
        agent_type: z.agentType,
        model: $,
        source: z.source,
        color: z.color,
        is_built_in_agent: p_(z)
      });
      let O;
      if (Z) {
        let b = await bD1(iz(Z));
        if (!b) throw Error(`No transcript found for agent ID: ${Z}`);
        O = b
      }
      let L = z?.forkContext ? X.messages : void 0,
        M;
      try {
        let b = Array.from(V.toolPermissionContext.additionalWorkingDirectories.keys()),
          S = z.getSystemPrompt({
            toolUseContext: X
          });
        M = await pkA([S], $, b)
      } catch (b) {
        k(`Failed to get system prompt for agent ${z.agentType}: ${b instanceof Error?b.message:String(b)}`)
      }
      let _ = z?.forkContext ? I52(A, D) : [H0({
          content: A
        })],
        j = {
          prompt: A,
          resolvedAgentModel: $,
          isBuiltInAgent: p_(z),
          startTime: K
        },
        x = {
          agentDefinition: z,
          promptMessages: O ? [...O, ..._] : _,
          toolUseContext: X,
          canUseTool: I,
          forkContextMessages: L,
          isAsync: Y === !0 && !nkA,
          querySource: X.options.querySource ?? TP2(z.agentType, p_(z)),
          model: G,
          maxTurns: J,
          override: M ? {
            systemPrompt: M
          } : void 0
        };
      if (Y === !0 && !nkA) {
        let b = Z || LS(),
          S = L32({
            agentId: b,
            description: B,
            prompt: A,
            selectedAgent: z,
            setAppState: X.setAppState
          }),
          u = {
            agentId: b,
            parentSessionId: gP2(),
            agentType: "subagent"
          };
        return XA1(u, async () => {
          try {
            let f = [],
              AA = OI0();
            for await (let p of $f({
              ...x,
              override: {
                ...x.override,
                agentId: iz(S.agentId),
                abortController: S.abortController
              }
            })) f.push(p), vZ1(AA, p), RI0(S.agentId, MI0(AA), X.setAppState);
            let n = uz0(f, S.agentId, j),
              y = n.content.filter((p) => p.type === "text").map((p) => p.text).join(`
`);
            _I0(n, X.setAppState), C4A(S.agentId, B, "completed", void 0, X.setAppState, y)
          } catch (f) {
            if (f instanceof aG) {
              $4A(S.agentId, X.setAppState), C4A(S.agentId, B, "killed", void 0, X.setAppState);
              return
            }
            let AA = f instanceof Error ? f.message : String(f);
            jI0(S.agentId, AA, X.setAppState), C4A(S.agentId, B, "failed", AA, X.setAppState)
          }
        }), {
          data: {
            isAsync: !0,
            status: "async_launched",
            agentId: S.agentId,
            description: B,
            prompt: A,
            outputFile: aY(S.agentId)
          }
        }
      } else {
        let b = Z ? iz(Z) : LS(),
          S = {
            agentId: b,
            parentSessionId: gP2(),
            agentType: "subagent"
          };
        return XA1(S, async () => {
          let u = [],
            f = Date.now();
          if (_[0] && _[0].type === "user") {
            let MA = a7(_),
              TA = MA.find((bA) => bA.type === "user");
            if (TA && TA.type === "user" && W) W({
              toolUseID: `agent_${D.message.id}`,
              data: {
                message: TA,
                normalizedMessages: MA,
                type: "agent_progress",
                prompt: A,
                resume: Z,
                agentId: b
              }
            })
          }
          let AA, n;
          if (!nkA) {
            let MA = O32({
              agentId: b,
              description: B,
              prompt: A,
              selectedAgent: z,
              setAppState: X.setAppState
            });
            AA = MA.taskId, n = MA.backgroundSignal
          }
          let y = !1,
            p = $f({
              ...x,
              override: {
                ...x.override,
                agentId: b
              }
            })[Symbol.asyncIterator]();
          try {
            while (!0) {
              let MA = Date.now() - f;
              if (!nkA && !y && MA >= Qf5 && X.setToolJSX) y = !0, X.setToolJSX({
                jsx: dz0.createElement(yD1, null),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
              });
              let TA = p.next(),
                bA = n ? await Promise.race([TA.then((HA) => ({
                  type: "message",
                  result: HA
                })), n.then(() => ({
                  type: "background"
                }))]) : await TA.then((HA) => ({
                  type: "message",
                  result: HA
                }));
              if (bA.type === "background" && AA) {
                let ZA = (await X.getAppState()).tasks[AA];
                if (Sr(ZA) && ZA.isBackgrounded) {
                  let zA = AA;
                  return XA1(S, async () => {
                    try {
                      let wA = OI0();
                      for (let t of u) vZ1(wA, t);
                      for await (let t of $f({
                        ...x,
                        isAsync: !0,
                        override: {
                          ...x.override,
                          agentId: iz(zA),
                          abortController: ZA.abortController
                        }
                      })) u.push(t), vZ1(wA, t), RI0(zA, MI0(wA), X.setAppState);
                      let _A = uz0(u, zA, j),
                        s = _A.content.filter((t) => t.type === "text").map((t) => t.text).join(`
`);
                      _I0(_A, X.setAppState), C4A(zA, B, "completed", void 0, X.setAppState, s)
                    } catch (wA) {
                      if (wA instanceof aG) {
                        $4A(zA, X.setAppState), C4A(zA, B, "killed", void 0, X.setAppState);
                        return
                      }
                      let _A = wA instanceof Error ? wA.message : String(wA);
                      jI0(zA, _A, X.setAppState), C4A(zA, B, "failed", _A, X.setAppState)
                    }
                  }), {
                    data: {
                      isAsync: !0,
                      status: "async_launched",
                      agentId: zA,
                      description: B,
                      prompt: A,
                      outputFile: aY(zA)
                    }
                  }
                }
              }
              if (bA.type !== "message") continue;
              let {
                result: jA
              } = bA;
              if (jA.done) break;
              let OA = jA.value;
              if (u.push(OA), OA.type !== "assistant" && OA.type !== "user") continue;
              if (OA.type === "assistant") {
                let HA = g51(OA);
                if (HA > 0) X.setResponseLength((ZA) => ZA + HA)
              }
              let IA = a7(u);
              for (let HA of a7([OA]))
                for (let ZA of HA.message.content) {
                  if (ZA.type !== "tool_use" && ZA.type !== "tool_result") continue;
                  if (W) W({
                    toolUseID: `agent_${D.message.id}`,
                    data: {
                      message: HA,
                      normalizedMessages: IA,
                      type: "agent_progress",
                      prompt: A,
                      resume: Z,
                      agentId: b
                    }
                  })
                }
            }
          } finally {
            if (X.setToolJSX) X.setToolJSX(null);
            if (AA) R32(AA, X.setAppState)
          }
          let GA = QC(u.filter((MA) => MA.type !== "system" && MA.type !== "progress"));
          if (GA && kD1(GA)) throw new aG;
          let WA = uz0(u, b, j);
          return {
            data: {
              status: "completed",
              prompt: A,
              ...WA
            }
          }
        })
      }
    },
    isReadOnly() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isEnabled() {
      return !0
    },
    userFacingName: _z0,
    userFacingNameBackgroundColor: jz0,
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      if (A.status === "async_launched") return {
        tool_use_id: Q,
        type: "tool_result",
        content: [{
          type: "text",
          text: `Async agent launched successfully.
agentId: ${A.agentId} (This is an internal ID for your use, do not mention it to the user. You can use this ID to resume the agent later if needed.)
output_file: ${A.outputFile}
The agent is currently working in the background. If you have other tasks you should continue working on them now.
To check on the agent's progress or retrieve its results, use the ${z3} tool to read the output file, or use ${X9} with \`tail\` to see recent output.`
        }]
      };
      if (A.status === "completed") return {
        tool_use_id: Q,
        type: "tool_result",
        content: [...A.content, {
          type: "text",
          text: `agentId: ${A.agentId} (for resuming to continue this agent's work if needed)`
        }]
      };
      throw Error(`Unexpected agent tool result status: ${A.status}`)
    },
    renderToolResultMessage: zP2,
    renderToolUseMessage: $P2,
    renderToolUseTag: CP2,
    renderToolUseProgressMessage: WHA,
    renderToolUseRejectedMessage: UP2,
    renderToolUseErrorMessage: qP2,
    renderGroupedToolUse: NP2
  }
})
// @from(Ln 328644, Col 4)
kF = "Skill"
// @from(Ln 328646, Col 0)
function Xf5() {
  return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) || 15000
}
// @from(Ln 328650, Col 0)
function mP2(A) {
  let Q = A.name,
    B = A.whenToUse ? `${A.description} - ${A.whenToUse}` : A.description;
  if (A.name !== A.userFacingName() && A.type === "prompt" && A.source === "plugin") k(`Skill prompt: showing "${A.name}" (userFacingName="${A.userFacingName()}")`);
  return `- ${Q}: ${B}`
}
// @from(Ln 328657, Col 0)
function If5(A) {
  let Q = [],
    B = 0;
  for (let G of A) {
    let Z = mP2(G);
    if (B += Z.length + 1, B > Xf5()) break;
    Q.push(G)
  }
  return Q
}
// @from(Ln 328668, Col 0)
function pz0(A) {
  return {
    limitedCommands: If5(A)
  }
}
// @from(Ln 328674, Col 0)
function Df5(A) {
  if (A.length === 0) return "";
  return A.map(mP2).join(`
`)
}
// @from(Ln 328680, Col 0)
function Wf5(A, Q) {
  let B = Df5(A);
  if (!B) return "";
  let G = Q > A.length ? `
<!-- Showing ${A.length} of ${Q} skills due to token limits -->` : "";
  return `${B}${G}`
}
// @from(Ln 328687, Col 0)
async function dP2(A) {
  let Q = await Nc(A),
    {
      limitedCommands: B
    } = pz0(Q);
  return {
    totalCommands: Q.length,
    includedCommands: B.length
  }
}
// @from(Ln 328697, Col 0)
async function cP2(A) {
  let Q = await Nc(A),
    {
      limitedCommands: B
    } = pz0(Q);
  return B
}
// @from(Ln 328705, Col 0)
function fD1() {
  lz0.cache?.clear?.()
}
// @from(Ln 328708, Col 4)
lz0
// @from(Ln 328709, Col 4)
akA = w(() => {
  WV();
  T1();
  v1();
  WV();
  zUA();
  cD();
  lz0 = W0(async (A) => {
    let Q = await Nc(A),
      {
        limitedCommands: B
      } = pz0(Q),
      G = B.map((Y) => Y.userFacingName()).join(", ");
    k(`Skills and commands included in Skill tool: ${G}`);
    let Z = Wf5(B, Q.length);
    return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

When users ask you to run a "slash command" or reference "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke the corresponding skill.

Example:
  User: "run /commit"
  Assistant: [Calls Skill tool with skill: "commit"]

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - \`skill: "pdf"\` - invoke the pdf skill
  - \`skill: "commit", args: "-m 'Fix bug'"\` - invoke with arguments
  - \`skill: "review-pr", args: "123"\` - invoke with arguments
  - \`skill: "ms-office-suite:pdf"\` - invoke using fully qualified name

Important:
- When a skill is relevant, you must invoke this tool IMMEDIATELY as your first action
- NEVER just announce or mention a skill in your text response without actually calling this tool
- This is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- Only use skills listed in "Available skills" below
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <${mC}> tag in the current conversation turn (e.g., <${mC}>/commit</${mC}>), the skill has ALREADY been loaded and its instructions follow in the next message. Do NOT call this tool - just follow the skill instructions directly.

Available skills:
${Z}
`
  })
})
// @from(Ln 328757, Col 0)
function pP2(A) {
  if ("status" in A && A.status === "forked") return h3.createElement(x0, {
    height: 1
  }, h3.createElement(C, null, h3.createElement(vQ, null, ["Done"])));
  let Q = ["Successfully loaded skill"];
  if ("allowedTools" in A && A.allowedTools && A.allowedTools.length > 0) {
    let B = A.allowedTools.length;
    Q.push(`${B} tool${B===1?"":"s"} allowed`)
  }
  if ("model" in A && A.model) Q.push(A.model);
  return h3.createElement(x0, {
    height: 1
  }, h3.createElement(C, null, h3.createElement(vQ, null, Q)))
}
// @from(Ln 328772, Col 0)
function lP2({
  skill: A
}, {
  commands: Q
}) {
  if (!A) return null;
  return Q?.find((Z) => Z.name === A)?.loadedFrom === "commands_DEPRECATED" ? `/${A}` : A
}
// @from(Ln 328781, Col 0)
function gD1(A, {
  tools: Q,
  verbose: B
}) {
  if (!A.length) return h3.createElement(x0, {
    height: 1
  }, h3.createElement(C, {
    dimColor: !0
  }, Vf5));
  let G = B ? A : A.slice(-Kf5),
    Z = A.length - G.length;
  return h3.createElement(x0, null, h3.createElement(T, {
    flexDirection: "column"
  }, h3.createElement(oSA, null, G.map((Y) => h3.createElement(T, {
    key: Y.uuid,
    height: 1,
    overflow: "hidden"
  }, h3.createElement(PO, {
    message: Y.data.message,
    messages: Y.data.normalizedMessages,
    addMargin: !1,
    tools: Q,
    commands: [],
    verbose: B,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: dkA(A),
    progressMessagesForMessage: A,
    shouldAnimate: !1,
    shouldShowDot: !1,
    style: "condensed",
    isTranscriptMode: !1,
    isStatic: !0
  })))), Z > 0 && h3.createElement(C, {
    dimColor: !0
  }, "+", Z, " more tool ", Z === 1 ? "use" : "uses")))
}
// @from(Ln 328819, Col 0)
function iP2(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  return h3.createElement(h3.Fragment, null, gD1(Q, {
    tools: B,
    verbose: G
  }), h3.createElement(w7, null))
}
// @from(Ln 328830, Col 0)
function nP2(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  return h3.createElement(h3.Fragment, null, gD1(Q, {
    tools: B,
    verbose: G
  }), h3.createElement(X5, {
    result: A,
    verbose: G
  }))
}
// @from(Ln 328843, Col 4)
h3
// @from(Ln 328843, Col 8)
Kf5 = 3
// @from(Ln 328844, Col 2)
Vf5 = "Initializing…"
// @from(Ln 328845, Col 4)
aP2 = w(() => {
  fA();
  eW();
  tH();
  c4();
  K6();
  x6A();
  Gr();
  tQ();
  h3 = c(QA(), 1)
})
// @from(Ln 328857, Col 0)
function oP2(A, Q) {
  if (!Q) return A;
  return A.map((B) => {
    if (B.type === "user") return {
      ...B,
      sourceToolUseID: Q
    };
    return B
  })
}
// @from(Ln 328868, Col 0)
function rP2(A, Q) {
  let B = A.message.content.find((G) => G.type === "tool_use" && G.name === Q);
  return B && B.type === "tool_use" ? B.id : void 0
}
// @from(Ln 328872, Col 0)
async function Ff5(A, Q, B, G, Z, Y, J) {
  let X = Date.now(),
    I = LS();
  l("tengu_skill_tool_invocation", {
    command_name: "custom",
    execution_context: "fork",
    ...!1
  });
  let {
    modifiedGetAppState: D,
    baseAgent: W,
    promptMessages: K,
    skillContent: V
  } = await TD1(A, B || "", G), F = [];
  k(`SkillTool executing forked skill ${Q} with agent ${W.agentType}`);
  for await (let z of $f({
    agentDefinition: W,
    promptMessages: K,
    toolUseContext: {
      ...G,
      getAppState: D
    },
    canUseTool: Z,
    isAsync: !1,
    querySource: "agent:custom",
    model: A.model
  })) if (F.push(z), (z.type === "assistant" || z.type === "user") && J) {
    let $ = a7(F);
    for (let O of a7([z]))
      if (O.message.content.some((M) => M.type === "tool_use" || M.type === "tool_result")) J({
        toolUseID: `skill_${Y.message.id}`,
        data: {
          message: O,
          normalizedMessages: $,
          type: "skill_progress",
          prompt: V,
          agentId: I
        }
      })
  }
  let H = PD1(F, "Skill execution completed"),
    E = Date.now() - X;
  return k(`SkillTool forked skill ${Q} completed in ${E}ms`), {
    data: {
      success: !0,
      commandName: Q,
      status: "forked",
      agentId: I,
      result: H
    }
  }
}
// @from(Ln 328925, Col 0)
function Cf5(A) {
  if (A.source !== "plugin" || !A.pluginInfo?.repository) return !1;
  let Q = A.pluginInfo.repository.lastIndexOf("@");
  if (Q <= 0) return !1;
  let B = A.pluginInfo.repository.slice(Q + 1);
  return K4A.has(B)
}
// @from(Ln 328932, Col 4)
Hf5
// @from(Ln 328932, Col 9)
Ef5
// @from(Ln 328932, Col 14)
zf5
// @from(Ln 328932, Col 19)
$f5
// @from(Ln 328932, Col 24)
bs
// @from(Ln 328933, Col 4)
uD1 = w(() => {
  j9();
  WV();
  pz();
  C0();
  YZ();
  jD1();
  akA();
  aP2();
  Z0();
  T1();
  C0();
  A0();
  cD();
  Pz0();
  KHA();
  d_();
  $c();
  tQ();
  _D1();
  Hf5 = m.object({
    skill: m.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
    args: m.string().optional().describe("Optional arguments for the skill")
  }), Ef5 = m.object({
    success: m.boolean().describe("Whether the skill is valid"),
    commandName: m.string().describe("The name of the skill"),
    allowedTools: m.array(m.string()).optional().describe("Tools allowed by this skill"),
    model: m.string().optional().describe("Model override if specified"),
    status: m.literal("inline").optional().describe("Execution status")
  }), zf5 = m.object({
    success: m.boolean().describe("Whether the skill completed successfully"),
    commandName: m.string().describe("The name of the skill"),
    status: m.literal("forked").describe("Execution status"),
    agentId: m.string().describe("The ID of the sub-agent that executed the skill"),
    result: m.string().describe("The result from the forked skill execution")
  }), $f5 = m.union([Ef5, zf5]), bs = {
    name: kF,
    maxResultSizeChars: 1e5,
    inputSchema: Hf5,
    outputSchema: $f5,
    description: async ({
      skill: A
    }) => `Execute skill: ${A}`,
    prompt: async () => lz0(Xq()),
    userFacingName: () => kF,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    async validateInput({
      skill: A
    }, Q) {
      let B = A.trim();
      if (!B) return {
        result: !1,
        message: `Invalid skill format: ${A}`,
        errorCode: 1
      };
      let G = B.startsWith("/");
      if (G) l("tengu_skill_tool_slash_prefix", {});
      let Z = G ? B.substring(1) : B,
        Y = await Aj(Xq());
      if (!Cc(Z, Y)) return {
        result: !1,
        message: `Unknown skill: ${Z}`,
        errorCode: 2
      };
      let J = eS(Z, Y);
      if (!J) return {
        result: !1,
        message: `Could not load skill: ${Z}`,
        errorCode: 3
      };
      if (J.disableModelInvocation) return {
        result: !1,
        message: `Skill ${Z} cannot be used with ${kF} tool due to disable-model-invocation`,
        errorCode: 4
      };
      if (J.type !== "prompt") return {
        result: !1,
        message: `Skill ${Z} is not a prompt-based skill`,
        errorCode: 5
      };
      return {
        result: !0
      }
    },
    async checkPermissions({
      skill: A
    }, Q) {
      let B = A.trim(),
        G = B.startsWith("/") ? B.substring(1) : B,
        Y = (await Q.getAppState()).toolPermissionContext,
        J = await Aj(Xq()),
        X = eS(G, J),
        I = (V) => {
          let F = V.startsWith("/") ? V.substring(1) : V;
          if (F === G) return !0;
          if (F.endsWith(":*")) {
            let H = F.slice(0, -2);
            return G.startsWith(H)
          }
          return !1
        },
        D = Bx(Y, bs, "deny");
      for (let [V, F] of D.entries())
        if (I(V)) return {
          behavior: "deny",
          message: "Skill execution blocked by permission rules",
          decisionReason: {
            type: "rule",
            rule: F
          }
        };
      let W = Bx(Y, bs, "allow");
      for (let [V, F] of W.entries())
        if (I(V)) return {
          behavior: "allow",
          updatedInput: {
            skill: A
          },
          decisionReason: {
            type: "rule",
            rule: F
          }
        };
      let K = [{
        type: "addRules",
        rules: [{
          toolName: kF,
          ruleContent: G
        }],
        behavior: "allow",
        destination: "localSettings"
      }, {
        type: "addRules",
        rules: [{
          toolName: kF,
          ruleContent: `${G}:*`
        }],
        behavior: "allow",
        destination: "localSettings"
      }];
      return {
        behavior: "ask",
        message: `Execute skill: ${G}`,
        decisionReason: void 0,
        suggestions: K,
        metadata: {
          command: X
        }
      }
    },
    async call({
      skill: A,
      args: Q
    }, B, G, Z, Y) {
      let J = A.trim(),
        X = J.startsWith("/") ? J.substring(1) : J,
        I = await Aj(Xq()),
        D = eS(X, I);
      if (MD1(X), D?.type === "prompt" && D.context === "fork") return Ff5(D, X, Q, B, G, Z, Y);
      let W = await MP2(X, Q || "", I, B);
      if (!W.shouldQuery) throw Error("Command processing failed");
      let K = W.allowedTools || [],
        V = W.model,
        F = W.maxThinkingTokens,
        H = xs().has(X),
        E = D?.type === "prompt" && Cf5(D);
      l("tengu_skill_tool_invocation", {
        command_name: H || E ? X : "custom",
        ...!1
      });
      let $ = rP2(Z, kF),
        O = oP2(W.messages.filter((_) => {
          if (_.type === "progress") return !1;
          if (_.type === "user" && "message" in _) {
            let j = _.message.content;
            if (typeof j === "string" && j.includes(`<${fz}>`)) return !1
          }
          return !0
        }), $);
      k(`SkillTool returning ${O.length} newMessages for skill ${X}`), O.forEach((_, j) => {
        if (_.type === "user" && "message" in _) {
          let x = typeof _.message.content === "string" ? _.message.content : eA(_.message.content);
          k(`  newMessage ${j+1}: ${x.substring(0,150)}...`)
        }
      });
      let L = O.filter((_) => _.type === "user" && ("message" in _)).map((_) => {
          let j = _.message.content;
          return typeof j === "string" ? j : eA(j)
        }).join(`

`),
        M = D?.type === "prompt" && D.source ? `${D.source}:${X}` : X;
      if (Ef0(X, M, L), D?.type === "prompt" && D.hooks) {
        let _ = q0();
        OD1(B.setAppState, _, D.hooks, X)
      }
      return {
        data: {
          success: !0,
          commandName: X,
          allowedTools: K.length > 0 ? K : void 0,
          model: V
        },
        newMessages: O,
        contextModifier(_) {
          let j = _;
          if (K.length > 0) {
            let x = j.getAppState;
            j = {
              ...j,
              async getAppState() {
                let b = await x();
                return {
                  ...b,
                  toolPermissionContext: {
                    ...b.toolPermissionContext,
                    alwaysAllowRules: {
                      ...b.toolPermissionContext.alwaysAllowRules,
                      command: [...new Set([...b.toolPermissionContext.alwaysAllowRules.command || [], ...K])]
                    }
                  }
                }
              }
            }
          }
          if (V) j = {
            ...j,
            options: {
              ...j.options,
              mainLoopModel: V
            }
          };
          if (F !== void 0) j = {
            ...j,
            options: {
              ...j.options,
              maxThinkingTokens: F
            }
          };
          return j
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      if ("status" in A && A.status === "forked") return {
        type: "tool_result",
        tool_use_id: Q,
        content: `Skill "${A.commandName}" completed (forked execution).

Result:
${A.result}`
      };
      return {
        type: "tool_result",
        tool_use_id: Q,
        content: `Launching skill: ${A.commandName}`
      }
    },
    renderToolResultMessage: pP2,
    renderToolUseMessage: lP2,
    renderToolUseProgressMessage: gD1,
    renderToolUseRejectedMessage: iP2,
    renderToolUseErrorMessage: nP2
  }
})
// @from(Ln 329201, Col 0)
function Gx() {}
// @from(Ln 329203, Col 0)
function sP2(A, Q, B, G, Z) {
  var Y = [],
    J;
  while (Q) Y.push(Q), J = Q.previousComponent, delete Q.previousComponent, Q = J;
  Y.reverse();
  var X = 0,
    I = Y.length,
    D = 0,
    W = 0;
  for (; X < I; X++) {
    var K = Y[X];
    if (!K.removed) {
      if (!K.added && Z) {
        var V = B.slice(D, D + K.count);
        V = V.map(function (F, H) {
          var E = G[W + H];
          return E.length > F.length ? E : F
        }), K.value = A.join(V)
      } else K.value = A.join(B.slice(D, D + K.count));
      if (D += K.count, !K.added) W += K.count
    } else K.value = A.join(G.slice(W, W + K.count)), W += K.count
  }
  return Y
}
// @from(Ln 329228, Col 0)
function tP2(A, Q) {
  var B;
  for (B = 0; B < A.length && B < Q.length; B++)
    if (A[B] != Q[B]) return A.slice(0, B);
  return A.slice(0, B)
}
// @from(Ln 329235, Col 0)
function eP2(A, Q) {
  var B;
  if (!A || !Q || A[A.length - 1] != Q[Q.length - 1]) return "";
  for (B = 0; B < A.length && B < Q.length; B++)
    if (A[A.length - (B + 1)] != Q[Q.length - (B + 1)]) return A.slice(-B);
  return A.slice(-B)
}
// @from(Ln 329243, Col 0)
function nz0(A, Q, B) {
  if (A.slice(0, Q.length) != Q) throw Error("string ".concat(JSON.stringify(A), " doesn't start with prefix ").concat(JSON.stringify(Q), "; this is a bug"));
  return B + A.slice(Q.length)
}
// @from(Ln 329248, Col 0)
function az0(A, Q, B) {
  if (!Q) return A + B;
  if (A.slice(-Q.length) != Q) throw Error("string ".concat(JSON.stringify(A), " doesn't end with suffix ").concat(JSON.stringify(Q), "; this is a bug"));
  return A.slice(0, -Q.length) + B
}
// @from(Ln 329254, Col 0)
function okA(A, Q) {
  return nz0(A, Q, "")
}
// @from(Ln 329258, Col 0)
function mD1(A, Q) {
  return az0(A, Q, "")
}
// @from(Ln 329262, Col 0)
function AS2(A, Q) {
  return Q.slice(0, Uf5(A, Q))
}
// @from(Ln 329266, Col 0)
function Uf5(A, Q) {
  var B = 0;
  if (A.length > Q.length) B = A.length - Q.length;
  var G = Q.length;
  if (A.length < Q.length) G = A.length;
  var Z = Array(G),
    Y = 0;
  Z[0] = 0;
  for (var J = 1; J < G; J++) {
    if (Q[J] == Q[Y]) Z[J] = Z[Y];
    else Z[J] = Y;
    while (Y > 0 && Q[J] != Q[Y]) Y = Z[Y];
    if (Q[J] == Q[Y]) Y++
  }
  Y = 0;
  for (var X = B; X < A.length; X++) {
    while (Y > 0 && A[X] != Q[Y]) Y = Z[Y];
    if (A[X] == Q[Y]) Y++
  }
  return Y
}
// @from(Ln 329288, Col 0)
function QS2(A, Q, B, G) {
  if (Q && B) {
    var Z = Q.value.match(/^\s*/)[0],
      Y = Q.value.match(/\s*$/)[0],
      J = B.value.match(/^\s*/)[0],
      X = B.value.match(/\s*$/)[0];
    if (A) {
      var I = tP2(Z, J);
      A.value = az0(A.value, J, I), Q.value = okA(Q.value, I), B.value = okA(B.value, I)
    }
    if (G) {
      var D = eP2(Y, X);
      G.value = nz0(G.value, X, D), Q.value = mD1(Q.value, D), B.value = mD1(B.value, D)
    }
  } else if (B) {
    if (A) B.value = B.value.replace(/^\s*/, "");
    if (G) G.value = G.value.replace(/^\s*/, "")
  } else if (A && G) {
    var W = G.value.match(/^\s*/)[0],
      K = Q.value.match(/^\s*/)[0],
      V = Q.value.match(/\s*$/)[0],
      F = tP2(W, K);
    Q.value = okA(Q.value, F);
    var H = eP2(okA(W, F), V);
    Q.value = mD1(Q.value, H), G.value = nz0(G.value, W, H), A.value = az0(A.value, W, W.slice(0, W.length - H.length))
  } else if (G) {
    var E = G.value.match(/^\s*/)[0],
      z = Q.value.match(/\s*$/)[0],
      $ = AS2(z, E);
    Q.value = mD1(Q.value, $)
  } else if (A) {
    var O = A.value.match(/\s*$/)[0],
      L = Q.value.match(/^\s*/)[0],
      M = AS2(O, L);
    Q.value = okA(Q.value, M)
  }
}
// @from(Ln 329326, Col 0)
function YS2(A, Q, B) {
  return ZS2.diff(A, Q, B)
}
// @from(Ln 329330, Col 0)
function cD1(A, Q, B) {
  return lD1.diff(A, Q, B)
}
// @from(Ln 329334, Col 0)
function BS2(A, Q) {
  var B = Object.keys(A);
  if (Object.getOwnPropertySymbols) {
    var G = Object.getOwnPropertySymbols(A);
    Q && (G = G.filter(function (Z) {
      return Object.getOwnPropertyDescriptor(A, Z).enumerable
    })), B.push.apply(B, G)
  }
  return B
}
// @from(Ln 329345, Col 0)
function GS2(A) {
  for (var Q = 1; Q < arguments.length; Q++) {
    var B = arguments[Q] != null ? arguments[Q] : {};
    Q % 2 ? BS2(Object(B), !0).forEach(function (G) {
      Mf5(A, G, B[G])
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(A, Object.getOwnPropertyDescriptors(B)) : BS2(Object(B)).forEach(function (G) {
      Object.defineProperty(A, G, Object.getOwnPropertyDescriptor(B, G))
    })
  }
  return A
}
// @from(Ln 329357, Col 0)
function Lf5(A, Q) {
  if (typeof A != "object" || !A) return A;
  var B = A[Symbol.toPrimitive];
  if (B !== void 0) {
    var G = B.call(A, Q || "default");
    if (typeof G != "object") return G;
    throw TypeError("@@toPrimitive must return a primitive value.")
  }
  return (Q === "string" ? String : Number)(A)
}
// @from(Ln 329368, Col 0)
function Of5(A) {
  var Q = Lf5(A, "string");
  return typeof Q == "symbol" ? Q : Q + ""
}
// @from(Ln 329373, Col 0)
function oz0(A) {
  return oz0 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (Q) {
    return typeof Q
  } : function (Q) {
    return Q && typeof Symbol == "function" && Q.constructor === Symbol && Q !== Symbol.prototype ? "symbol" : typeof Q
  }, oz0(A)
}
// @from(Ln 329381, Col 0)
function Mf5(A, Q, B) {
  if (Q = Of5(Q), Q in A) Object.defineProperty(A, Q, {
    value: B,
    enumerable: !0,
    configurable: !0,
    writable: !0
  });
  else A[Q] = B;
  return A
}
// @from(Ln 329392, Col 0)
function iz0(A) {
  return Rf5(A) || _f5(A) || jf5(A) || Tf5()
}
// @from(Ln 329396, Col 0)
function Rf5(A) {
  if (Array.isArray(A)) return rz0(A)
}
// @from(Ln 329400, Col 0)
function _f5(A) {
  if (typeof Symbol < "u" && A[Symbol.iterator] != null || A["@@iterator"] != null) return Array.from(A)
}
// @from(Ln 329404, Col 0)
function jf5(A, Q) {
  if (!A) return;
  if (typeof A === "string") return rz0(A, Q);
  var B = Object.prototype.toString.call(A).slice(8, -1);
  if (B === "Object" && A.constructor) B = A.constructor.name;
  if (B === "Map" || B === "Set") return Array.from(A);
  if (B === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(B)) return rz0(A, Q)
}
// @from(Ln 329413, Col 0)
function rz0(A, Q) {
  if (Q == null || Q > A.length) Q = A.length;
  for (var B = 0, G = Array(Q); B < Q; B++) G[B] = A[B];
  return G
}
// @from(Ln 329419, Col 0)
function Tf5() {
  throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
// @from(Ln 329424, Col 0)
function sz0(A, Q, B, G, Z) {
  if (Q = Q || [], B = B || [], G) A = G(Z, A);
  var Y;
  for (Y = 0; Y < Q.length; Y += 1)
    if (Q[Y] === A) return B[Y];
  var J;
  if (Object.prototype.toString.call(A) === "[object Array]") {
    Q.push(A), J = Array(A.length), B.push(J);
    for (Y = 0; Y < A.length; Y += 1) J[Y] = sz0(A[Y], Q, B, G, Z);
    return Q.pop(), B.pop(), J
  }
  if (A && A.toJSON) A = A.toJSON();
  if (oz0(A) === "object" && A !== null) {
    Q.push(A), J = {}, B.push(J);
    var X = [],
      I;
    for (I in A)
      if (Object.prototype.hasOwnProperty.call(A, I)) X.push(I);
    X.sort();
    for (Y = 0; Y < X.length; Y += 1) I = X[Y], J[I] = sz0(A[I], Q, B, G, I);
    Q.pop(), B.pop()
  } else J = A;
  return J
}
// @from(Ln 329449, Col 0)
function skA(A, Q, B, G, Z, Y, J) {
  if (!J) J = {};
  if (typeof J === "function") J = {
    callback: J
  };
  if (typeof J.context > "u") J.context = 4;
  if (J.newlineIsToken) throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
  if (!J.callback) return D(cD1(B, G, J));
  else {
    var X = J,
      I = X.callback;
    cD1(B, G, GS2(GS2({}, J), {}, {
      callback: function (K) {
        var V = D(K);
        I(V)
      }
    }))
  }

  function D(W) {
    if (!W) return;
    W.push({
      value: "",
      lines: []
    });

    function K(b) {
      return b.map(function (S) {
        return " " + S
      })
    }
    var V = [],
      F = 0,
      H = 0,
      E = [],
      z = 1,
      $ = 1,
      O = function () {
        var S = W[L],
          u = S.lines || Pf5(S.value);
        if (S.lines = u, S.added || S.removed) {
          var f;
          if (!F) {
            var AA = W[L - 1];
            if (F = z, H = $, AA) E = J.context > 0 ? K(AA.lines.slice(-J.context)) : [], F -= E.length, H -= E.length
          }
          if ((f = E).push.apply(f, iz0(u.map(function (WA) {
              return (S.added ? "+" : "-") + WA
            }))), S.added) $ += u.length;
          else z += u.length
        } else {
          if (F)
            if (u.length <= J.context * 2 && L < W.length - 2) {
              var n;
              (n = E).push.apply(n, iz0(K(u)))
            } else {
              var y, p = Math.min(u.length, J.context);
              (y = E).push.apply(y, iz0(K(u.slice(0, p))));
              var GA = {
                oldStart: F,
                oldLines: z - F + p,
                newStart: H,
                newLines: $ - H + p,
                lines: E
              };
              V.push(GA), F = 0, H = 0, E = []
            } z += u.length, $ += u.length
        }
      };
    for (var L = 0; L < W.length; L++) O();
    for (var M = 0, _ = V; M < _.length; M++) {
      var j = _[M];
      for (var x = 0; x < j.lines.length; x++)
        if (j.lines[x].endsWith(`
`)) j.lines[x] = j.lines[x].slice(0, -1);
        else j.lines.splice(x + 1, 0, "\\ No newline at end of file"), x++
    }
    return {
      oldFileName: A,
      newFileName: Q,
      oldHeader: Z,
      newHeader: Y,
      hunks: V
    }
  }
}
// @from(Ln 329536, Col 0)
function Pf5(A) {
  var Q = A.endsWith(`
`),
    B = A.split(`
`).map(function (G) {
      return G + `
`
    });
  if (Q) B.pop();
  else B.push(B.pop().slice(0, -1));
  return B
}
// @from(Ln 329548, Col 4)
woZ
// @from(Ln 329548, Col 9)
dD1 = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}"
// @from(Ln 329549, Col 2)
qf5
// @from(Ln 329549, Col 7)
pD1
// @from(Ln 329549, Col 12)
ZS2
// @from(Ln 329549, Col 17)
lD1
// @from(Ln 329549, Col 22)
Nf5
// @from(Ln 329549, Col 27)
wf5
// @from(Ln 329549, Col 32)
rkA
// @from(Ln 329549, Col 37)
tz0
// @from(Ln 329550, Col 4)
tkA = w(() => {
  Gx.prototype = {
    diff: function (Q, B) {
      var G, Z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        Y = Z.callback;
      if (typeof Z === "function") Y = Z, Z = {};
      var J = this;

      function X(M) {
        if (M = J.postProcess(M, Z), Y) return setTimeout(function () {
          Y(M)
        }, 0), !0;
        else return M
      }
      Q = this.castInput(Q, Z), B = this.castInput(B, Z), Q = this.removeEmpty(this.tokenize(Q, Z)), B = this.removeEmpty(this.tokenize(B, Z));
      var I = B.length,
        D = Q.length,
        W = 1,
        K = I + D;
      if (Z.maxEditLength != null) K = Math.min(K, Z.maxEditLength);
      var V = (G = Z.timeout) !== null && G !== void 0 ? G : 1 / 0,
        F = Date.now() + V,
        H = [{
          oldPos: -1,
          lastComponent: void 0
        }],
        E = this.extractCommon(H[0], B, Q, 0, Z);
      if (H[0].oldPos + 1 >= D && E + 1 >= I) return X(sP2(J, H[0].lastComponent, B, Q, J.useLongestToken));
      var z = -1 / 0,
        $ = 1 / 0;

      function O() {
        for (var M = Math.max(z, -W); M <= Math.min($, W); M += 2) {
          var _ = void 0,
            j = H[M - 1],
            x = H[M + 1];
          if (j) H[M - 1] = void 0;
          var b = !1;
          if (x) {
            var S = x.oldPos - M;
            b = x && 0 <= S && S < I
          }
          var u = j && j.oldPos + 1 < D;
          if (!b && !u) {
            H[M] = void 0;
            continue
          }
          if (!u || b && j.oldPos < x.oldPos) _ = J.addToPath(x, !0, !1, 0, Z);
          else _ = J.addToPath(j, !1, !0, 1, Z);
          if (E = J.extractCommon(_, B, Q, M, Z), _.oldPos + 1 >= D && E + 1 >= I) return X(sP2(J, _.lastComponent, B, Q, J.useLongestToken));
          else {
            if (H[M] = _, _.oldPos + 1 >= D) $ = Math.min($, M - 1);
            if (E + 1 >= I) z = Math.max(z, M + 1)
          }
        }
        W++
      }
      if (Y)(function M() {
        setTimeout(function () {
          if (W > K || Date.now() > F) return Y();
          if (!O()) M()
        }, 0)
      })();
      else
        while (W <= K && Date.now() <= F) {
          var L = O();
          if (L) return L
        }
    },
    addToPath: function (Q, B, G, Z, Y) {
      var J = Q.lastComponent;
      if (J && !Y.oneChangePerToken && J.added === B && J.removed === G) return {
        oldPos: Q.oldPos + Z,
        lastComponent: {
          count: J.count + 1,
          added: B,
          removed: G,
          previousComponent: J.previousComponent
        }
      };
      else return {
        oldPos: Q.oldPos + Z,
        lastComponent: {
          count: 1,
          added: B,
          removed: G,
          previousComponent: J
        }
      }
    },
    extractCommon: function (Q, B, G, Z, Y) {
      var J = B.length,
        X = G.length,
        I = Q.oldPos,
        D = I - Z,
        W = 0;
      while (D + 1 < J && I + 1 < X && this.equals(G[I + 1], B[D + 1], Y))
        if (D++, I++, W++, Y.oneChangePerToken) Q.lastComponent = {
          count: 1,
          previousComponent: Q.lastComponent,
          added: !1,
          removed: !1
        };
      if (W && !Y.oneChangePerToken) Q.lastComponent = {
        count: W,
        previousComponent: Q.lastComponent,
        added: !1,
        removed: !1
      };
      return Q.oldPos = I, D
    },
    equals: function (Q, B, G) {
      if (G.comparator) return G.comparator(Q, B);
      else return Q === B || G.ignoreCase && Q.toLowerCase() === B.toLowerCase()
    },
    removeEmpty: function (Q) {
      var B = [];
      for (var G = 0; G < Q.length; G++)
        if (Q[G]) B.push(Q[G]);
      return B
    },
    castInput: function (Q) {
      return Q
    },
    tokenize: function (Q) {
      return Array.from(Q)
    },
    join: function (Q) {
      return Q.join("")
    },
    postProcess: function (Q) {
      return Q
    }
  };
  woZ = new Gx;
  qf5 = new RegExp("[".concat(dD1, "]+|\\s+|[^").concat(dD1, "]"), "ug"), pD1 = new Gx;
  pD1.equals = function (A, Q, B) {
    if (B.ignoreCase) A = A.toLowerCase(), Q = Q.toLowerCase();
    return A.trim() === Q.trim()
  };
  pD1.tokenize = function (A) {
    var Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      B;
    if (Q.intlSegmenter) {
      if (Q.intlSegmenter.resolvedOptions().granularity != "word") throw Error('The segmenter passed must have a granularity of "word"');
      B = Array.from(Q.intlSegmenter.segment(A), function (Y) {
        return Y.segment
      })
    } else B = A.match(qf5) || [];
    var G = [],
      Z = null;
    return B.forEach(function (Y) {
      if (/\s/.test(Y))
        if (Z == null) G.push(Y);
        else G.push(G.pop() + Y);
      else if (/\s/.test(Z))
        if (G[G.length - 1] == Z) G.push(G.pop() + Y);
        else G.push(Z + Y);
      else G.push(Y);
      Z = Y
    }), G
  };
  pD1.join = function (A) {
    return A.map(function (Q, B) {
      if (B == 0) return Q;
      else return Q.replace(/^\s+/, "")
    }).join("")
  };
  pD1.postProcess = function (A, Q) {
    if (!A || Q.oneChangePerToken) return A;
    var B = null,
      G = null,
      Z = null;
    if (A.forEach(function (Y) {
        if (Y.added) G = Y;
        else if (Y.removed) Z = Y;
        else {
          if (G || Z) QS2(B, Z, G, Y);
          B = Y, G = null, Z = null
        }
      }), G || Z) QS2(B, Z, G, null);
    return A
  };
  ZS2 = new Gx;
  ZS2.tokenize = function (A) {
    var Q = new RegExp("(\\r?\\n)|[".concat(dD1, "]+|[^\\S\\n\\r]+|[^").concat(dD1, "]"), "ug");
    return A.match(Q) || []
  };
  lD1 = new Gx;
  lD1.tokenize = function (A, Q) {
    if (Q.stripTrailingCr) A = A.replace(/\r\n/g, `
`);
    var B = [],
      G = A.split(/(\n|\r\n)/);
    if (!G[G.length - 1]) G.pop();
    for (var Z = 0; Z < G.length; Z++) {
      var Y = G[Z];
      if (Z % 2 && !Q.newlineIsToken) B[B.length - 1] += Y;
      else B.push(Y)
    }
    return B
  };
  lD1.equals = function (A, Q, B) {
    if (B.ignoreWhitespace) {
      if (!B.newlineIsToken || !A.includes(`
`)) A = A.trim();
      if (!B.newlineIsToken || !Q.includes(`
`)) Q = Q.trim()
    } else if (B.ignoreNewlineAtEof && !B.newlineIsToken) {
      if (A.endsWith(`
`)) A = A.slice(0, -1);
      if (Q.endsWith(`
`)) Q = Q.slice(0, -1)
    }
    return Gx.prototype.equals.call(this, A, Q, B)
  };
  Nf5 = new Gx;
  Nf5.tokenize = function (A) {
    return A.split(/(\S.+?[.!?])(?=\s+|$)/)
  };
  wf5 = new Gx;
  wf5.tokenize = function (A) {
    return A.split(/([{}:;,]|\s+)/)
  };
  rkA = new Gx;
  rkA.useLongestToken = !0;
  rkA.tokenize = lD1.tokenize;
  rkA.castInput = function (A, Q) {
    var {
      undefinedReplacement: B,
      stringifyReplacer: G
    } = Q, Z = G === void 0 ? function (Y, J) {
      return typeof J > "u" ? B : J
    } : G;
    return typeof A === "string" ? A : JSON.stringify(sz0(A, null, null, Z), Z, "  ")
  };
  rkA.equals = function (A, Q, B) {
    return Gx.prototype.equals.call(rkA, A.replace(/,([\r\n])/g, "$1"), Q.replace(/,([\r\n])/g, "$1"), B)
  };
  tz0 = new Gx;
  tz0.tokenize = function (A) {
    return A.slice()
  };
  tz0.join = tz0.removeEmpty = function (A) {
    return A
  }
})
// @from(Ln 329798, Col 0)
function ekA(A) {
  return A.replaceAll("&", XS2).replaceAll("$", IS2)
}
// @from(Ln 329802, Col 0)
function DS2(A) {
  return A.replaceAll(XS2, "&").replaceAll(IS2, "$")
}
// @from(Ln 329806, Col 0)
function AbA(A, Q) {
  let B = 0,
    G = 0;
  if (A.length === 0 && Q) B = Q.split(/\r?\n/).length;
  else B = A.reduce((Z, Y) => Z + Y.lines.filter((J) => J.startsWith("+")).length, 0), G = A.reduce((Z, Y) => Z + Y.lines.filter((J) => J.startsWith("-")).length, 0);
  oU1(B, G), tU1()?.add(B, {
    type: "added"
  }), tU1()?.add(G, {
    type: "removed"
  }), l("tengu_file_changed", {
    lines_added: B,
    lines_removed: G
  })
}
// @from(Ln 329821, Col 0)
function WS2({
  filePath: A,
  oldContent: Q,
  newContent: B,
  ignoreWhitespace: G = !1,
  singleHunk: Z = !1
}) {
  return skA(A, A, ekA(Q), ekA(B), void 0, void 0, {
    ignoreWhitespace: G,
    context: Z ? 1e5 : JS2
  }).hunks.map((Y) => ({
    ...Y,
    lines: Y.lines.map(DS2)
  }))
}
// @from(Ln 329837, Col 0)
function xO({
  filePath: A,
  fileContents: Q,
  edits: B,
  ignoreWhitespace: G = !1
}) {
  let Z = ekA(EHA(Q));
  return skA(A, A, Z, B.reduce((Y, J) => {
    let {
      old_string: X,
      new_string: I
    } = J, D = "replace_all" in J ? J.replace_all : !1, W = ekA(EHA(X)), K = ekA(EHA(I));
    if (D) return Y.replaceAll(W, () => K);
    else return Y.replace(W, () => K)
  }, Z), void 0, void 0, {
    context: JS2,
    ignoreWhitespace: G
  }).hunks.map((Y) => ({
    ...Y,
    lines: Y.lines.map(DS2)
  }))
}
// @from(Ln 329859, Col 4)
JS2 = 3
// @from(Ln 329860, Col 2)
XS2 = "<<:AMPERSAND_TOKEN:>>"
// @from(Ln 329861, Col 2)
IS2 = "<<:DOLLAR_TOKEN:>>"
// @from(Ln 329862, Col 4)
Lc = w(() => {
  tkA();
  LR();
  y9();
  Z0();
  C0()
})
// @from(Ln 329869, Col 4)
KS2
// @from(Ln 329870, Col 4)
VS2 = w(() => {
  cW();
  KS2 = `Performs exact string replacements in files. 

Usage:
- You must use your \`${z3}\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file. 
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`. 
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
})
// @from(Ln 329883, Col 0)
function FS2(A) {
  return A.replaceAll(Sf5, "'").replaceAll(xf5, "'").replaceAll(yf5, '"').replaceAll(vf5, '"')
}
// @from(Ln 329887, Col 0)
function ez0(A) {
  let Q = A.split(/(\r\n|\n|\r)/),
    B = "";
  for (let G = 0; G < Q.length; G++) {
    let Z = Q[G];
    if (Z !== void 0)
      if (G % 2 === 0) B += Z.replace(/\s+$/, "");
      else B += Z
  }
  return B
}
// @from(Ln 329899, Col 0)
function k6A(A, Q) {
  if (A.includes(Q)) return Q;
  let B = FS2(Q),
    Z = FS2(A).indexOf(B);
  if (Z !== -1) return A.substring(Z, Z + Q.length);
  return null
}
// @from(Ln 329907, Col 0)
function iD1(A, Q, B, G = !1) {
  let Z = G ? (J, X, I) => J.replaceAll(X, () => I) : (J, X, I) => J.replace(X, () => I);
  if (B !== "") return Z(A, Q, B);
  return !Q.endsWith(`
`) && A.includes(Q + `
`) ? Z(A, Q + `
`, B) : Z(A, Q, B)
}
// @from(Ln 329916, Col 0)
function nD1({
  filePath: A,
  fileContents: Q,
  oldString: B,
  newString: G,
  replaceAll: Z = !1
}) {
  return QbA({
    filePath: A,
    fileContents: Q,
    edits: [{
      old_string: B,
      new_string: G,
      replace_all: Z
    }]
  })
}
// @from(Ln 329934, Col 0)
function QbA({
  filePath: A,
  fileContents: Q,
  edits: B
}) {
  let G = Q,
    Z = [];
  if (!Q && B.length === 1 && B[0] && B[0].old_string === "" && B[0].new_string === "") return {
    patch: xO({
      filePath: A,
      fileContents: Q,
      edits: [{
        old_string: Q,
        new_string: G,
        replace_all: !1
      }]
    }),
    updatedFile: ""
  };
  for (let J of B) {
    let X = J.old_string.replace(/\n+$/, "");
    for (let D of Z)
      if (X !== "" && D.includes(X)) throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
    let I = G;
    if (G = J.old_string === "" ? J.new_string : iD1(G, J.old_string, J.new_string, J.replace_all), G === I) throw Error("String not found in file. Failed to apply edit.");
    Z.push(J.new_string)
  }
  if (G === Q) throw Error("Original and edited file match exactly. Failed to apply edit.");
  return {
    patch: xO({
      filePath: A,
      fileContents: Q,
      edits: [{
        old_string: Q,
        new_string: G,
        replace_all: !1
      }]
    }),
    updatedFile: G
  }
}
// @from(Ln 329976, Col 0)
function A$0(A, Q) {
  return skA("file.txt", "file.txt", A, Q, void 0, void 0, {
    context: 8
  }).hunks.map((G) => ({
    startLine: G.oldStart,
    content: G.lines.filter((Z) => !Z.startsWith("-") && !Z.startsWith("\\")).map((Z) => Z.slice(1)).join(`
`)
  })).map(Xr).join(`
...
`)
}
// @from(Ln 329988, Col 0)
function HS2(A, Q, B, G = 4) {
  let Y = (A.split(Q)[0] ?? "").split(/\r?\n/).length - 1,
    J = iD1(A, Q, B).split(/\r?\n/),
    X = Math.max(0, Y - G),
    I = Y + G + B.split(/\r?\n/).length;
  return {
    snippet: J.slice(X, I).join(`
`),
    startLine: X + 1
  }
}
// @from(Ln 330000, Col 0)
function ES2(A) {
  return A.map((Q) => {
    let B = [],
      G = [],
      Z = [];
    for (let Y of Q.lines)
      if (Y.startsWith(" ")) B.push(Y.slice(1)), G.push(Y.slice(1)), Z.push(Y.slice(1));
      else if (Y.startsWith("-")) G.push(Y.slice(1));
    else if (Y.startsWith("+")) Z.push(Y.slice(1));
    return {
      old_string: G.join(`
`),
      new_string: Z.join(`
`),
      replace_all: !1
    }
  })
}
// @from(Ln 330019, Col 0)
function bf5(A) {
  let Q = A,
    B = [];
  for (let [G, Z] of Object.entries(kf5)) {
    let Y = Q;
    if (Q = Q.replaceAll(G, Z), Y !== Q) B.push({
      from: G,
      to: Z
    })
  }
  return {
    result: Q,
    appliedReplacements: B
  }
}
// @from(Ln 330035, Col 0)
function zS2({
  file_path: A,
  edits: Q
}) {
  if (Q.length === 0) return {
    file_path: A,
    edits: Q
  };
  try {
    let B = Y4(A);
    if (!vA().existsSync(B)) return {
      file_path: A,
      edits: Q
    };
    let G = Q$0(B);
    return {
      file_path: A,
      edits: Q.map(({
        old_string: Z,
        new_string: Y,
        replace_all: J
      }) => {
        let X = ez0(Y);
        if (G.includes(Z)) return {
          old_string: Z,
          new_string: X,
          replace_all: J
        };
        let {
          result: I,
          appliedReplacements: D
        } = bf5(Z);
        if (G.includes(I)) {
          let W = X;
          for (let {
              from: K,
              to: V
            }
            of D) W = W.replaceAll(K, V);
          return {
            old_string: I,
            new_string: W,
            replace_all: J
          }
        }
        return {
          old_string: Z,
          new_string: X,
          replace_all: J
        }
      })
    }
  } catch (B) {
    e(B)
  }
  return {
    file_path: A,
    edits: Q
  }
}
// @from(Ln 330096, Col 0)
function ff5(A, Q, B) {
  if (A.length === Q.length && A.every((X, I) => {
      let D = Q[I];
      return D !== void 0 && X.old_string === D.old_string && X.new_string === D.new_string && X.replace_all === D.replace_all
    })) return !0;
  let G = null,
    Z = null,
    Y = null,
    J = null;
  try {
    G = QbA({
      filePath: "temp",
      fileContents: B,
      edits: A
    })
  } catch (X) {
    Z = X instanceof Error ? X.message : String(X)
  }
  try {
    Y = QbA({
      filePath: "temp",
      fileContents: B,
      edits: Q
    })
  } catch (X) {
    J = X instanceof Error ? X.message : String(X)
  }
  if (Z !== null && J !== null) return Z === J;
  if (Z !== null || J !== null) return !1;
  return G.updatedFile === Y.updatedFile
}
// @from(Ln 330128, Col 0)
function $S2(A, Q) {
  if (A.file_path !== Q.file_path) return !1;
  if (A.edits.length === Q.edits.length && A.edits.every((Z, Y) => {
      let J = Q.edits[Y];
      return J !== void 0 && Z.old_string === J.old_string && Z.new_string === J.new_string && Z.replace_all === J.replace_all
    })) return !0;
  let G = vA().existsSync(A.file_path) ? Q$0(A.file_path) : "";
  return ff5(A.edits, Q.edits, G)
}
// @from(Ln 330137, Col 4)
Sf5 = "‘"
// @from(Ln 330138, Col 2)
xf5 = "’"
// @from(Ln 330139, Col 2)
yf5 = "“"
// @from(Ln 330140, Col 2)
vf5 = "”"
// @from(Ln 330141, Col 2)
kf5
// @from(Ln 330142, Col 4)
hs = w(() => {
  tkA();
  y9();
  Lc();
  oZ();
  DQ();
  v1();
  kf5 = {
    "<fnr>": "<function_results>",
    "<n>": "<name>",
    "</n>": "</name>",
    "<o>": "<output>",
    "</o>": "</output>",
    "<e>": "<error>",
    "</e>": "</error>",
    "<s>": "<system>",
    "</s>": "</system>",
    "<r>": "<result>",
    "</r>": "</result>",
    "< META_START >": "<META_START>",
    "< META_END >": "<META_END>",
    "< EOT >": "<EOT>",
    "< META >": "<META>",
    "< SOS >": "<SOS>",
    "\n\nH:": `

Human:`,
    "\n\nA:": `

Assistant:`
  }
})
// @from(Ln 330174, Col 4)
zHA = U((qS2) => {
  Object.defineProperty(qS2, "__esModule", {
    value: !0
  });
  qS2.stringArray = qS2.array = qS2.func = qS2.error = qS2.number = qS2.string = qS2.boolean = void 0;

  function hf5(A) {
    return A === !0 || A === !1
  }
  qS2.boolean = hf5;

  function CS2(A) {
    return typeof A === "string" || A instanceof String
  }
  qS2.string = CS2;

  function gf5(A) {
    return typeof A === "number" || A instanceof Number
  }
  qS2.number = gf5;

  function uf5(A) {
    return A instanceof Error
  }
  qS2.error = uf5;

  function mf5(A) {
    return typeof A === "function"
  }
  qS2.func = mf5;

  function US2(A) {
    return Array.isArray(A)
  }
  qS2.array = US2;

  function df5(A) {
    return US2(A) && A.every((Q) => CS2(Q))
  }
  qS2.stringArray = df5
})
// @from(Ln 330215, Col 4)
Z$0 = U((lS2) => {
  Object.defineProperty(lS2, "__esModule", {
    value: !0
  });
  lS2.Message = lS2.NotificationType9 = lS2.NotificationType8 = lS2.NotificationType7 = lS2.NotificationType6 = lS2.NotificationType5 = lS2.NotificationType4 = lS2.NotificationType3 = lS2.NotificationType2 = lS2.NotificationType1 = lS2.NotificationType0 = lS2.NotificationType = lS2.RequestType9 = lS2.RequestType8 = lS2.RequestType7 = lS2.RequestType6 = lS2.RequestType5 = lS2.RequestType4 = lS2.RequestType3 = lS2.RequestType2 = lS2.RequestType1 = lS2.RequestType = lS2.RequestType0 = lS2.AbstractMessageSignature = lS2.ParameterStructures = lS2.ResponseError = lS2.ErrorCodes = void 0;
  var b6A = zHA(),
    B$0;
  (function (A) {
    A.ParseError = -32700, A.InvalidRequest = -32600, A.MethodNotFound = -32601, A.InvalidParams = -32602, A.InternalError = -32603, A.jsonrpcReservedErrorRangeStart = -32099, A.serverErrorStart = -32099, A.MessageWriteError = -32099, A.MessageReadError = -32098, A.PendingResponseRejected = -32097, A.ConnectionInactive = -32096, A.ServerNotInitialized = -32002, A.UnknownErrorCode = -32001, A.jsonrpcReservedErrorRangeEnd = -32000, A.serverErrorEnd = -32000
  })(B$0 || (lS2.ErrorCodes = B$0 = {}));
  class G$0 extends Error {
    constructor(A, Q, B) {
      super(Q);
      this.code = b6A.number(A) ? A : B$0.UnknownErrorCode, this.data = B, Object.setPrototypeOf(this, G$0.prototype)
    }
    toJson() {
      let A = {
        code: this.code,
        message: this.message
      };
      if (this.data !== void 0) A.data = this.data;
      return A
    }
  }
  lS2.ResponseError = G$0;
  class Z$ {
    constructor(A) {
      this.kind = A
    }
    static is(A) {
      return A === Z$.auto || A === Z$.byName || A === Z$.byPosition
    }
    toString() {
      return this.kind
    }
  }
  lS2.ParameterStructures = Z$;
  Z$.auto = new Z$("auto");
  Z$.byPosition = new Z$("byPosition");
  Z$.byName = new Z$("byName");
  class PX {
    constructor(A, Q) {
      this.method = A, this.numberOfParams = Q
    }
    get parameterStructures() {
      return Z$.auto
    }
  }
  lS2.AbstractMessageSignature = PX;
  class LS2 extends PX {
    constructor(A) {
      super(A, 0)
    }
  }
  lS2.RequestType0 = LS2;
  class OS2 extends PX {
    constructor(A, Q = Z$.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  lS2.RequestType = OS2;
  class MS2 extends PX {
    constructor(A, Q = Z$.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  lS2.RequestType1 = MS2;
  class RS2 extends PX {
    constructor(A) {
      super(A, 2)
    }
  }
  lS2.RequestType2 = RS2;
  class _S2 extends PX {
    constructor(A) {
      super(A, 3)
    }
  }
  lS2.RequestType3 = _S2;
  class jS2 extends PX {
    constructor(A) {
      super(A, 4)
    }
  }
  lS2.RequestType4 = jS2;
  class TS2 extends PX {
    constructor(A) {
      super(A, 5)
    }
  }
  lS2.RequestType5 = TS2;
  class PS2 extends PX {
    constructor(A) {
      super(A, 6)
    }
  }
  lS2.RequestType6 = PS2;
  class SS2 extends PX {
    constructor(A) {
      super(A, 7)
    }
  }
  lS2.RequestType7 = SS2;
  class xS2 extends PX {
    constructor(A) {
      super(A, 8)
    }
  }
  lS2.RequestType8 = xS2;
  class yS2 extends PX {
    constructor(A) {
      super(A, 9)
    }
  }
  lS2.RequestType9 = yS2;
  class vS2 extends PX {
    constructor(A, Q = Z$.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  lS2.NotificationType = vS2;
  class kS2 extends PX {
    constructor(A) {
      super(A, 0)
    }
  }
  lS2.NotificationType0 = kS2;
  class bS2 extends PX {
    constructor(A, Q = Z$.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  lS2.NotificationType1 = bS2;
  class fS2 extends PX {
    constructor(A) {
      super(A, 2)
    }
  }
  lS2.NotificationType2 = fS2;
  class hS2 extends PX {
    constructor(A) {
      super(A, 3)
    }
  }
  lS2.NotificationType3 = hS2;
  class gS2 extends PX {
    constructor(A) {
      super(A, 4)
    }
  }
  lS2.NotificationType4 = gS2;
  class uS2 extends PX {
    constructor(A) {
      super(A, 5)
    }
  }
  lS2.NotificationType5 = uS2;
  class mS2 extends PX {
    constructor(A) {
      super(A, 6)
    }
  }
  lS2.NotificationType6 = mS2;
  class dS2 extends PX {
    constructor(A) {
      super(A, 7)
    }
  }
  lS2.NotificationType7 = dS2;
  class cS2 extends PX {
    constructor(A) {
      super(A, 8)
    }
  }
  lS2.NotificationType8 = cS2;
  class pS2 extends PX {
    constructor(A) {
      super(A, 9)
    }
  }
  lS2.NotificationType9 = pS2;
  var wS2;
  (function (A) {
    function Q(Z) {
      let Y = Z;
      return Y && b6A.string(Y.method) && (b6A.string(Y.id) || b6A.number(Y.id))
    }
    A.isRequest = Q;

    function B(Z) {
      let Y = Z;
      return Y && b6A.string(Y.method) && Z.id === void 0
    }
    A.isNotification = B;

    function G(Z) {
      let Y = Z;
      return Y && (Y.result !== void 0 || !!Y.error) && (b6A.string(Y.id) || b6A.number(Y.id) || Y.id === null)
    }
    A.isResponse = G
  })(wS2 || (lS2.Message = wS2 = {}))
})
// @from(Ln 330433, Col 4)
J$0 = U((oS2) => {
  var nS2;
  Object.defineProperty(oS2, "__esModule", {
    value: !0
  });
  oS2.LRUCache = oS2.LinkedMap = oS2.Touch = void 0;
  var Y$;
  (function (A) {
    A.None = 0, A.First = 1, A.AsOld = A.First, A.Last = 2, A.AsNew = A.Last
  })(Y$ || (oS2.Touch = Y$ = {}));
  class Y$0 {
    constructor() {
      this[nS2] = "LinkedMap", this._map = new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0
    }
    clear() {
      this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++
    }
    isEmpty() {
      return !this._head && !this._tail
    }
    get size() {
      return this._size
    }
    get first() {
      return this._head?.value
    }
    get last() {
      return this._tail?.value
    }
    has(A) {
      return this._map.has(A)
    }
    get(A, Q = Y$.None) {
      let B = this._map.get(A);
      if (!B) return;
      if (Q !== Y$.None) this.touch(B, Q);
      return B.value
    }
    set(A, Q, B = Y$.None) {
      let G = this._map.get(A);
      if (G) {
        if (G.value = Q, B !== Y$.None) this.touch(G, B)
      } else {
        switch (G = {
            key: A,
            value: Q,
            next: void 0,
            previous: void 0
          }, B) {
          case Y$.None:
            this.addItemLast(G);
            break;
          case Y$.First:
            this.addItemFirst(G);
            break;
          case Y$.Last:
            this.addItemLast(G);
            break;
          default:
            this.addItemLast(G);
            break
        }
        this._map.set(A, G), this._size++
      }
      return this
    }
    delete(A) {
      return !!this.remove(A)
    }
    remove(A) {
      let Q = this._map.get(A);
      if (!Q) return;
      return this._map.delete(A), this.removeItem(Q), this._size--, Q.value
    }
    shift() {
      if (!this._head && !this._tail) return;
      if (!this._head || !this._tail) throw Error("Invalid list");
      let A = this._head;
      return this._map.delete(A.key), this.removeItem(A), this._size--, A.value
    }
    forEach(A, Q) {
      let B = this._state,
        G = this._head;
      while (G) {
        if (Q) A.bind(Q)(G.value, G.key, this);
        else A(G.value, G.key, this);
        if (this._state !== B) throw Error("LinkedMap got modified during iteration.");
        G = G.next
      }
    }
    keys() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: Q.key,
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    }
    values() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: Q.value,
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    }
    entries() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: [Q.key, Q.value],
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    } [(nS2 = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries()
    }
    trimOld(A) {
      if (A >= this.size) return;
      if (A === 0) {
        this.clear();
        return
      }
      let Q = this._head,
        B = this.size;
      while (Q && B > A) this._map.delete(Q.key), Q = Q.next, B--;
      if (this._head = Q, this._size = B, Q) Q.previous = void 0;
      this._state++
    }
    addItemFirst(A) {
      if (!this._head && !this._tail) this._tail = A;
      else if (!this._head) throw Error("Invalid list");
      else A.next = this._head, this._head.previous = A;
      this._head = A, this._state++
    }
    addItemLast(A) {
      if (!this._head && !this._tail) this._head = A;
      else if (!this._tail) throw Error("Invalid list");
      else A.previous = this._tail, this._tail.next = A;
      this._tail = A, this._state++
    }
    removeItem(A) {
      if (A === this._head && A === this._tail) this._head = void 0, this._tail = void 0;
      else if (A === this._head) {
        if (!A.next) throw Error("Invalid list");
        A.next.previous = void 0, this._head = A.next
      } else if (A === this._tail) {
        if (!A.previous) throw Error("Invalid list");
        A.previous.next = void 0, this._tail = A.previous
      } else {
        let {
          next: Q,
          previous: B
        } = A;
        if (!Q || !B) throw Error("Invalid list");
        Q.previous = B, B.next = Q
      }
      A.next = void 0, A.previous = void 0, this._state++
    }
    touch(A, Q) {
      if (!this._head || !this._tail) throw Error("Invalid list");
      if (Q !== Y$.First && Q !== Y$.Last) return;
      if (Q === Y$.First) {
        if (A === this._head) return;
        let {
          next: B,
          previous: G
        } = A;
        if (A === this._tail) G.next = void 0, this._tail = G;
        else B.previous = G, G.next = B;
        A.previous = void 0, A.next = this._head, this._head.previous = A, this._head = A, this._state++
      } else if (Q === Y$.Last) {
        if (A === this._tail) return;
        let {
          next: B,
          previous: G
        } = A;
        if (A === this._head) B.previous = void 0, this._head = B;
        else B.previous = G, G.next = B;
        A.next = void 0, A.previous = this._tail, this._tail.next = A, this._tail = A, this._state++
      }
    }
    toJSON() {
      let A = [];
      return this.forEach((Q, B) => {
        A.push([B, Q])
      }), A
    }
    fromJSON(A) {
      this.clear();
      for (let [Q, B] of A) this.set(Q, B)
    }
  }
  oS2.LinkedMap = Y$0;
  class aS2 extends Y$0 {
    constructor(A, Q = 1) {
      super();
      this._limit = A, this._ratio = Math.min(Math.max(0, Q), 1)
    }
    get limit() {
      return this._limit
    }
    set limit(A) {
      this._limit = A, this.checkTrim()
    }
    get ratio() {
      return this._ratio
    }
    set ratio(A) {
      this._ratio = Math.min(Math.max(0, A), 1), this.checkTrim()
    }
    get(A, Q = Y$.AsNew) {
      return super.get(A, Q)
    }
    peek(A) {
      return super.get(A, Y$.None)
    }
    set(A, Q) {
      return super.set(A, Q, Y$.Last), this.checkTrim(), this
    }
    checkTrim() {
      if (this.size > this._limit) this.trimOld(Math.round(this._limit * this._ratio))
    }
  }
  oS2.LRUCache = aS2
})
// @from(Ln 330703, Col 4)
Ax2 = U((tS2) => {
  Object.defineProperty(tS2, "__esModule", {
    value: !0
  });
  tS2.Disposable = void 0;
  var sS2;
  (function (A) {
    function Q(B) {
      return {
        dispose: B
      }
    }
    A.create = Q
  })(sS2 || (tS2.Disposable = sS2 = {}))
})
// @from(Ln 330718, Col 4)
gs = U((Qx2) => {
  Object.defineProperty(Qx2, "__esModule", {
    value: !0
  });
  var X$0;

  function I$0() {
    if (X$0 === void 0) throw Error("No runtime abstraction layer installed");
    return X$0
  }(function (A) {
    function Q(B) {
      if (B === void 0) throw Error("No runtime abstraction layer provided");
      X$0 = B
    }
    A.install = Q
  })(I$0 || (I$0 = {}));
  Qx2.default = I$0
})
// @from(Ln 330736, Col 4)
$HA = U((Zx2) => {
  Object.defineProperty(Zx2, "__esModule", {
    value: !0
  });
  Zx2.Emitter = Zx2.Event = void 0;
  var Oh5 = gs(),
    Bx2;
  (function (A) {
    let Q = {
      dispose() {}
    };
    A.None = function () {
      return Q
    }
  })(Bx2 || (Zx2.Event = Bx2 = {}));
  class Gx2 {
    add(A, Q = null, B) {
      if (!this._callbacks) this._callbacks = [], this._contexts = [];
      if (this._callbacks.push(A), this._contexts.push(Q), Array.isArray(B)) B.push({
        dispose: () => this.remove(A, Q)
      })
    }
    remove(A, Q = null) {
      if (!this._callbacks) return;
      let B = !1;
      for (let G = 0, Z = this._callbacks.length; G < Z; G++)
        if (this._callbacks[G] === A)
          if (this._contexts[G] === Q) {
            this._callbacks.splice(G, 1), this._contexts.splice(G, 1);
            return
          } else B = !0;
      if (B) throw Error("When adding a listener with a context, you should remove it with the same context")
    }
    invoke(...A) {
      if (!this._callbacks) return [];
      let Q = [],
        B = this._callbacks.slice(0),
        G = this._contexts.slice(0);
      for (let Z = 0, Y = B.length; Z < Y; Z++) try {
        Q.push(B[Z].apply(G[Z], A))
      } catch (J) {
        (0, Oh5.default)().console.error(J)
      }
      return Q
    }
    isEmpty() {
      return !this._callbacks || this._callbacks.length === 0
    }
    dispose() {
      this._callbacks = void 0, this._contexts = void 0
    }
  }
  class aD1 {
    constructor(A) {
      this._options = A
    }
    get event() {
      if (!this._event) this._event = (A, Q, B) => {
        if (!this._callbacks) this._callbacks = new Gx2;
        if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
        this._callbacks.add(A, Q);
        let G = {
          dispose: () => {
            if (!this._callbacks) return;
            if (this._callbacks.remove(A, Q), G.dispose = aD1._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this)
          }
        };
        if (Array.isArray(B)) B.push(G);
        return G
      };
      return this._event
    }
    fire(A) {
      if (this._callbacks) this._callbacks.invoke.call(this._callbacks, A)
    }
    dispose() {
      if (this._callbacks) this._callbacks.dispose(), this._callbacks = void 0
    }
  }
  Zx2.Emitter = aD1;
  aD1._noop = function () {}
})
// @from(Ln 330818, Col 4)
rD1 = U((Xx2) => {
  Object.defineProperty(Xx2, "__esModule", {
    value: !0
  });
  Xx2.CancellationTokenSource = Xx2.CancellationToken = void 0;
  var Rh5 = gs(),
    _h5 = zHA(),
    D$0 = $HA(),
    oD1;
  (function (A) {
    A.None = Object.freeze({
      isCancellationRequested: !1,
      onCancellationRequested: D$0.Event.None
    }), A.Cancelled = Object.freeze({
      isCancellationRequested: !0,
      onCancellationRequested: D$0.Event.None
    });

    function Q(B) {
      let G = B;
      return G && (G === A.None || G === A.Cancelled || _h5.boolean(G.isCancellationRequested) && !!G.onCancellationRequested)
    }
    A.is = Q
  })(oD1 || (Xx2.CancellationToken = oD1 = {}));
  var jh5 = Object.freeze(function (A, Q) {
    let B = (0, Rh5.default)().timer.setTimeout(A.bind(Q), 0);
    return {
      dispose() {
        B.dispose()
      }
    }
  });
  class W$0 {
    constructor() {
      this._isCancelled = !1
    }
    cancel() {
      if (!this._isCancelled) {
        if (this._isCancelled = !0, this._emitter) this._emitter.fire(void 0), this.dispose()
      }
    }
    get isCancellationRequested() {
      return this._isCancelled
    }
    get onCancellationRequested() {
      if (this._isCancelled) return jh5;
      if (!this._emitter) this._emitter = new D$0.Emitter;
      return this._emitter.event
    }
    dispose() {
      if (this._emitter) this._emitter.dispose(), this._emitter = void 0
    }
  }
  class Jx2 {
    get token() {
      if (!this._token) this._token = new W$0;
      return this._token
    }
    cancel() {
      if (!this._token) this._token = oD1.Cancelled;
      else this._token.cancel()
    }
    dispose() {
      if (!this._token) this._token = oD1.None;
      else if (this._token instanceof W$0) this._token.dispose()
    }
  }
  Xx2.CancellationTokenSource = Jx2
})
// @from(Ln 330887, Col 4)
Ex2 = U((Fx2) => {
  Object.defineProperty(Fx2, "__esModule", {
    value: !0
  });
  Fx2.SharedArrayReceiverStrategy = Fx2.SharedArraySenderStrategy = void 0;
  var Ph5 = rD1(),
    BbA;
  (function (A) {
    A.Continue = 0, A.Cancelled = 1
  })(BbA || (BbA = {}));
  class Dx2 {
    constructor() {
      this.buffers = new Map
    }
    enableCancellation(A) {
      if (A.id === null) return;
      let Q = new SharedArrayBuffer(4),
        B = new Int32Array(Q, 0, 1);
      B[0] = BbA.Continue, this.buffers.set(A.id, Q), A.$cancellationData = Q
    }
    async sendCancellation(A, Q) {
      let B = this.buffers.get(Q);
      if (B === void 0) return;
      let G = new Int32Array(B, 0, 1);
      Atomics.store(G, 0, BbA.Cancelled)
    }
    cleanup(A) {
      this.buffers.delete(A)
    }
    dispose() {
      this.buffers.clear()
    }
  }
  Fx2.SharedArraySenderStrategy = Dx2;
  class Wx2 {
    constructor(A) {
      this.data = new Int32Array(A, 0, 1)
    }
    get isCancellationRequested() {
      return Atomics.load(this.data, 0) === BbA.Cancelled
    }
    get onCancellationRequested() {
      throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")
    }
  }
  class Kx2 {
    constructor(A) {
      this.token = new Wx2(A)
    }
    cancel() {}
    dispose() {}
  }
  class Vx2 {
    constructor() {
      this.kind = "request"
    }
    createCancellationTokenSource(A) {
      let Q = A.$cancellationData;
      if (Q === void 0) return new Ph5.CancellationTokenSource;
      return new Kx2(Q)
    }
  }
  Fx2.SharedArrayReceiverStrategy = Vx2
})
// @from(Ln 330951, Col 4)
K$0 = U(($x2) => {
  Object.defineProperty($x2, "__esModule", {
    value: !0
  });
  $x2.Semaphore = void 0;
  var xh5 = gs();
  class zx2 {
    constructor(A = 1) {
      if (A <= 0) throw Error("Capacity must be greater than 0");
      this._capacity = A, this._active = 0, this._waiting = []
    }
    lock(A) {
      return new Promise((Q, B) => {
        this._waiting.push({
          thunk: A,
          resolve: Q,
          reject: B
        }), this.runNext()
      })
    }
    get active() {
      return this._active
    }
    runNext() {
      if (this._waiting.length === 0 || this._active === this._capacity) return;
      (0, xh5.default)().timer.setImmediate(() => this.doRunNext())
    }
    doRunNext() {
      if (this._waiting.length === 0 || this._active === this._capacity) return;
      let A = this._waiting.shift();
      if (this._active++, this._active > this._capacity) throw Error("To many thunks active");
      try {
        let Q = A.thunk();
        if (Q instanceof Promise) Q.then((B) => {
          this._active--, A.resolve(B), this.runNext()
        }, (B) => {
          this._active--, A.reject(B), this.runNext()
        });
        else this._active--, A.resolve(Q), this.runNext()
      } catch (Q) {
        this._active--, A.reject(Q), this.runNext()
      }
    }
  }
  $x2.Semaphore = zx2
})
// @from(Ln 330997, Col 4)
Lx2 = U((Nx2) => {
  Object.defineProperty(Nx2, "__esModule", {
    value: !0
  });
  Nx2.ReadableStreamMessageReader = Nx2.AbstractMessageReader = Nx2.MessageReader = void 0;
  var F$0 = gs(),
    CHA = zHA(),
    V$0 = $HA(),
    yh5 = K$0(),
    Ux2;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && CHA.func(G.listen) && CHA.func(G.dispose) && CHA.func(G.onError) && CHA.func(G.onClose) && CHA.func(G.onPartialMessage)
    }
    A.is = Q
  })(Ux2 || (Nx2.MessageReader = Ux2 = {}));
  class E$0 {
    constructor() {
      this.errorEmitter = new V$0.Emitter, this.closeEmitter = new V$0.Emitter, this.partialMessageEmitter = new V$0.Emitter
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose()
    }
    get onError() {
      return this.errorEmitter.event
    }
    fireError(A) {
      this.errorEmitter.fire(this.asError(A))
    }
    get onClose() {
      return this.closeEmitter.event
    }
    fireClose() {
      this.closeEmitter.fire(void 0)
    }
    get onPartialMessage() {
      return this.partialMessageEmitter.event
    }
    firePartialMessage(A) {
      this.partialMessageEmitter.fire(A)
    }
    asError(A) {
      if (A instanceof Error) return A;
      else return Error(`Reader received error. Reason: ${CHA.string(A.message)?A.message:"unknown"}`)
    }
  }
  Nx2.AbstractMessageReader = E$0;
  var H$0;
  (function (A) {
    function Q(B) {
      let G, Z, Y, J = new Map,
        X, I = new Map;
      if (B === void 0 || typeof B === "string") G = B ?? "utf-8";
      else {
        if (G = B.charset ?? "utf-8", B.contentDecoder !== void 0) Y = B.contentDecoder, J.set(Y.name, Y);
        if (B.contentDecoders !== void 0)
          for (let D of B.contentDecoders) J.set(D.name, D);
        if (B.contentTypeDecoder !== void 0) X = B.contentTypeDecoder, I.set(X.name, X);
        if (B.contentTypeDecoders !== void 0)
          for (let D of B.contentTypeDecoders) I.set(D.name, D)
      }
      if (X === void 0) X = (0, F$0.default)().applicationJson.decoder, I.set(X.name, X);
      return {
        charset: G,
        contentDecoder: Y,
        contentDecoders: J,
        contentTypeDecoder: X,
        contentTypeDecoders: I
      }
    }
    A.fromOptions = Q
  })(H$0 || (H$0 = {}));
  class qx2 extends E$0 {
    constructor(A, Q) {
      super();
      this.readable = A, this.options = H$0.fromOptions(Q), this.buffer = (0, F$0.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new yh5.Semaphore(1)
    }
    set partialMessageTimeout(A) {
      this._partialMessageTimeout = A
    }
    get partialMessageTimeout() {
      return this._partialMessageTimeout
    }
    listen(A) {
      this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = A;
      let Q = this.readable.onData((B) => {
        this.onData(B)
      });
      return this.readable.onError((B) => this.fireError(B)), this.readable.onClose(() => this.fireClose()), Q
    }
    onData(A) {
      try {
        this.buffer.append(A);
        while (!0) {
          if (this.nextMessageLength === -1) {
            let B = this.buffer.tryReadHeaders(!0);
            if (!B) return;
            let G = B.get("content-length");
            if (!G) {
              this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(B))}`));
              return
            }
            let Z = parseInt(G);
            if (isNaN(Z)) {
              this.fireError(Error(`Content-Length value must be a number. Got ${G}`));
              return
            }
            this.nextMessageLength = Z
          }
          let Q = this.buffer.tryReadBody(this.nextMessageLength);
          if (Q === void 0) {
            this.setPartialMessageTimer();
            return
          }
          this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
            let B = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(Q) : Q,
              G = await this.options.contentTypeDecoder.decode(B, this.options);
            this.callback(G)
          }).catch((B) => {
            this.fireError(B)
          })
        }
      } catch (Q) {
        this.fireError(Q)
      }
    }
    clearPartialMessageTimer() {
      if (this.partialMessageTimer) this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0
    }
    setPartialMessageTimer() {
      if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0) return;
      this.partialMessageTimer = (0, F$0.default)().timer.setTimeout((A, Q) => {
        if (this.partialMessageTimer = void 0, A === this.messageToken) this.firePartialMessage({
          messageToken: A,
          waitingTime: Q
        }), this.setPartialMessageTimer()
      }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout)
    }
  }
  Nx2.ReadableStreamMessageReader = qx2
})
// @from(Ln 331140, Col 4)
Sx2 = U((Tx2) => {
  Object.defineProperty(Tx2, "__esModule", {
    value: !0
  });
  Tx2.WriteableStreamMessageWriter = Tx2.AbstractMessageWriter = Tx2.MessageWriter = void 0;
  var Ox2 = gs(),
    GbA = zHA(),
    bh5 = K$0(),
    Mx2 = $HA(),
    fh5 = "Content-Length: ",
    Rx2 = `\r
`,
    _x2;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && GbA.func(G.dispose) && GbA.func(G.onClose) && GbA.func(G.onError) && GbA.func(G.write)
    }
    A.is = Q
  })(_x2 || (Tx2.MessageWriter = _x2 = {}));
  class $$0 {
    constructor() {
      this.errorEmitter = new Mx2.Emitter, this.closeEmitter = new Mx2.Emitter
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose()
    }
    get onError() {
      return this.errorEmitter.event
    }
    fireError(A, Q, B) {
      this.errorEmitter.fire([this.asError(A), Q, B])
    }
    get onClose() {
      return this.closeEmitter.event
    }
    fireClose() {
      this.closeEmitter.fire(void 0)
    }
    asError(A) {
      if (A instanceof Error) return A;
      else return Error(`Writer received error. Reason: ${GbA.string(A.message)?A.message:"unknown"}`)
    }
  }
  Tx2.AbstractMessageWriter = $$0;
  var z$0;
  (function (A) {
    function Q(B) {
      if (B === void 0 || typeof B === "string") return {
        charset: B ?? "utf-8",
        contentTypeEncoder: (0, Ox2.default)().applicationJson.encoder
      };
      else return {
        charset: B.charset ?? "utf-8",
        contentEncoder: B.contentEncoder,
        contentTypeEncoder: B.contentTypeEncoder ?? (0, Ox2.default)().applicationJson.encoder
      }
    }
    A.fromOptions = Q
  })(z$0 || (z$0 = {}));
  class jx2 extends $$0 {
    constructor(A, Q) {
      super();
      this.writable = A, this.options = z$0.fromOptions(Q), this.errorCount = 0, this.writeSemaphore = new bh5.Semaphore(1), this.writable.onError((B) => this.fireError(B)), this.writable.onClose(() => this.fireClose())
    }
    async write(A) {
      return this.writeSemaphore.lock(async () => {
        return this.options.contentTypeEncoder.encode(A, this.options).then((B) => {
          if (this.options.contentEncoder !== void 0) return this.options.contentEncoder.encode(B);
          else return B
        }).then((B) => {
          let G = [];
          return G.push(fh5, B.byteLength.toString(), Rx2), G.push(Rx2), this.doWrite(A, G, B)
        }, (B) => {
          throw this.fireError(B), B
        })
      })
    }
    async doWrite(A, Q, B) {
      try {
        return await this.writable.write(Q.join(""), "ascii"), this.writable.write(B)
      } catch (G) {
        return this.handleError(G, A), Promise.reject(G)
      }
    }
    handleError(A, Q) {
      this.errorCount++, this.fireError(A, Q, this.errorCount)
    }
    end() {
      this.writable.end()
    }
  }
  Tx2.WriteableStreamMessageWriter = jx2
})
// @from(Ln 331234, Col 4)
kx2 = U((yx2) => {
  Object.defineProperty(yx2, "__esModule", {
    value: !0
  });
  yx2.AbstractMessageBuffer = void 0;
  var uh5 = 13,
    mh5 = 10,
    dh5 = `\r
`;
  class xx2 {
    constructor(A = "utf-8") {
      this._encoding = A, this._chunks = [], this._totalLength = 0
    }
    get encoding() {
      return this._encoding
    }
    append(A) {
      let Q = typeof A === "string" ? this.fromString(A, this._encoding) : A;
      this._chunks.push(Q), this._totalLength += Q.byteLength
    }
    tryReadHeaders(A = !1) {
      if (this._chunks.length === 0) return;
      let Q = 0,
        B = 0,
        G = 0,
        Z = 0;
      A: while (B < this._chunks.length) {
        let I = this._chunks[B];
        G = 0;
        Q: while (G < I.length) {
          switch (I[G]) {
            case uh5:
              switch (Q) {
                case 0:
                  Q = 1;
                  break;
                case 2:
                  Q = 3;
                  break;
                default:
                  Q = 0
              }
              break;
            case mh5:
              switch (Q) {
                case 1:
                  Q = 2;
                  break;
                case 3:
                  Q = 4, G++;
                  break A;
                default:
                  Q = 0
              }
              break;
            default:
              Q = 0
          }
          G++
        }
        Z += I.byteLength, B++
      }
      if (Q !== 4) return;
      let Y = this._read(Z + G),
        J = new Map,
        X = this.toString(Y, "ascii").split(dh5);
      if (X.length < 2) return J;
      for (let I = 0; I < X.length - 2; I++) {
        let D = X[I],
          W = D.indexOf(":");
        if (W === -1) throw Error(`Message header must separate key and value using ':'
${D}`);
        let K = D.substr(0, W),
          V = D.substr(W + 1).trim();
        J.set(A ? K.toLowerCase() : K, V)
      }
      return J
    }
    tryReadBody(A) {
      if (this._totalLength < A) return;
      return this._read(A)
    }
    get numberOfBytes() {
      return this._totalLength
    }
    _read(A) {
      if (A === 0) return this.emptyBuffer();
      if (A > this._totalLength) throw Error("Cannot read so many bytes!");
      if (this._chunks[0].byteLength === A) {
        let Z = this._chunks[0];
        return this._chunks.shift(), this._totalLength -= A, this.asNative(Z)
      }
      if (this._chunks[0].byteLength > A) {
        let Z = this._chunks[0],
          Y = this.asNative(Z, A);
        return this._chunks[0] = Z.slice(A), this._totalLength -= A, Y
      }
      let Q = this.allocNative(A),
        B = 0,
        G = 0;
      while (A > 0) {
        let Z = this._chunks[G];
        if (Z.byteLength > A) {
          let Y = Z.slice(0, A);
          Q.set(Y, B), B += A, this._chunks[G] = Z.slice(A), this._totalLength -= A, A -= A
        } else Q.set(Z, B), B += Z.byteLength, this._chunks.shift(), this._totalLength -= Z.byteLength, A -= Z.byteLength
      }
      return Q
    }
  }
  yx2.AbstractMessageBuffer = xx2
})