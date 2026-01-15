
// @from(Ln 427259, Col 0)
function bF7(A) {
  let Q = hz1(A),
    B = vA();
  if (!B.existsSync(Q)) B.mkdirSync(Q);
  return Q
}
// @from(Ln 427265, Col 0)
async function DT0(A, Q, B, G, Z, Y = !0, J, X) {
  if (A === "built-in") throw Error("Cannot save built-in agents");
  bF7(A);
  let I = IT0({
      source: A,
      agentType: Q
    }),
    D = vA();
  if (Y && D.existsSync(I)) throw Error(`Agent file already exists: ${I}`);
  let W = f79(Q, B, G, Z, J, X);
  bB(I, W, {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Ln 427280, Col 0)
async function m79(A, Q, B, G, Z, Y) {
  if (A.source === "built-in") throw Error("Cannot update built-in agents");
  let J = gz1(A),
    X = f79(A.agentType, Q, B, G, Z, Y);
  bB(J, X, {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Ln 427289, Col 0)
async function d79(A) {
  if (A.source === "built-in") throw Error("Cannot delete built-in agents");
  let Q = vA(),
    B = gz1(A);
  if (Q.existsSync(B)) Q.unlinkSync(B)
}
// @from(Ln 427295, Col 4)
Z$A = w(() => {
  DQ();
  V2();
  A0();
  fQ();
  _S();
  b79();
  GB()
})
// @from(Ln 427305, Col 0)
function Me({
  title: A,
  titleColor: Q = "text",
  borderColor: B = "suggestion",
  children: G,
  subtitle: Z
}) {
  return hx.createElement(T, {
    borderStyle: "round",
    borderColor: B,
    flexDirection: "column"
  }, hx.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, hx.createElement(C, {
    bold: !0,
    color: Q
  }, A), Z && hx.createElement(C, {
    dimColor: !0
  }, Z)), hx.createElement(T, {
    paddingX: 1,
    flexDirection: "column"
  }, G))
}
// @from(Ln 427329, Col 4)
hx
// @from(Ln 427330, Col 4)
WT0 = w(() => {
  fA();
  hx = c(QA(), 1)
})
// @from(Ln 427335, Col 0)
function Y$A(A) {
  if (A === "all") return "Agents";
  if (A === "built-in") return "Built-in agents";
  if (A === "plugin") return "Plugin agents";
  return J1A(Wa(A))
}
// @from(Ln 427341, Col 4)
uz1 = w(() => {
  LpA();
  YI()
})
// @from(Ln 427346, Col 0)
function c79({
  source: A,
  agents: Q,
  onBack: B,
  onSelect: G,
  onCreateNew: Z,
  changes: Y
}) {
  let [J, X] = KB.useState(null), [I, D] = KB.useState(!0), W = (O) => {
    return {
      isOverridden: !!O.overriddenBy,
      overriddenBy: O.overriddenBy || null
    }
  }, K = () => {
    return KB.createElement(T, null, KB.createElement(C, {
      color: I ? "suggestion" : void 0
    }, I ? `${tA.pointer} ` : "  "), KB.createElement(C, {
      color: I ? "suggestion" : void 0
    }, "Create new agent"))
  }, V = (O) => {
    let L = O.source === "built-in",
      M = !L && !I && J?.agentType === O.agentType && J?.source === O.source,
      {
        isOverridden: _,
        overriddenBy: j
      } = W(O),
      x = L || _,
      b = !L && M ? "suggestion" : void 0,
      S = O.model || bp1;
    return KB.createElement(T, {
      key: `${O.agentType}-${O.source}`
    }, KB.createElement(C, {
      dimColor: x && !M,
      color: b
    }, L ? "" : M ? `${tA.pointer} ` : "  "), KB.createElement(C, {
      dimColor: x && !M,
      color: b
    }, O.agentType), S && KB.createElement(C, {
      dimColor: !0,
      color: b
    }, " · ", S === "inherit" ? "inherit" : S), j && KB.createElement(C, {
      dimColor: !M,
      color: M ? "warning" : void 0
    }, " ", tA.warning, " overridden by ", j))
  }, F = KB.useMemo(() => {
    let O = Q.filter((L) => L.source !== "built-in");
    if (A === "all") return [...O.filter((L) => L.source === "userSettings"), ...O.filter((L) => L.source === "projectSettings"), ...O.filter((L) => L.source === "policySettings")];
    return O
  }, [Q, A]);
  KB.useEffect(() => {
    if (!J && !I && F.length > 0)
      if (Z) D(!0);
      else X(F[0] || null)
  }, [F, J, I, Z]), J0((O, L) => {
    if (L.escape) {
      B();
      return
    }
    if (L.return) {
      if (I && Z) Z();
      else if (J) G(J);
      return
    }
    if (!L.upArrow && !L.downArrow) return;
    let M = !!Z,
      _ = F.length + (M ? 1 : 0);
    if (_ === 0) return;
    let j = 0;
    if (!I && J) {
      let b = F.findIndex((S) => S.agentType === J.agentType && S.source === J.source);
      if (b >= 0) j = M ? b + 1 : b
    }
    let x = L.upArrow ? j === 0 ? _ - 1 : j - 1 : j === _ - 1 ? 0 : j + 1;
    if (M && x === 0) D(!0), X(null);
    else {
      let b = M ? x - 1 : x,
        S = F[b];
      if (S) D(!1), X(S)
    }
  });
  let H = (O = "Built-in (always available):") => {
      let L = Q.filter((M) => M.source === "built-in");
      return KB.createElement(T, {
        flexDirection: "column",
        marginBottom: 1,
        paddingLeft: 2
      }, KB.createElement(C, {
        bold: !0,
        dimColor: !0
      }, O), L.map(V))
    },
    E = (O, L) => {
      if (!L.length) return null;
      let M = L[0]?.baseDir;
      return KB.createElement(T, {
        flexDirection: "column",
        marginBottom: 1
      }, KB.createElement(T, {
        paddingLeft: 2
      }, KB.createElement(C, {
        bold: !0,
        dimColor: !0
      }, O), M && KB.createElement(C, {
        dimColor: !0
      }, " (", M, ")")), L.map((_) => V(_)))
    },
    z = Y$A(A);
  if (!Q.length || A !== "built-in" && !Q.some((O) => O.source !== "built-in")) return KB.createElement(Me, {
    title: z,
    subtitle: "No agents found"
  }, Z && KB.createElement(T, {
    marginY: 1
  }, K()), KB.createElement(C, {
    dimColor: !0
  }, "No agents found. Create specialized subagents that Claude can delegate to."), KB.createElement(C, {
    dimColor: !0
  }, "Each subagent has its own context window, custom system prompt, and specific tools."), KB.createElement(C, {
    dimColor: !0
  }, "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."), A !== "built-in" && Q.some((O) => O.source === "built-in") && KB.createElement(KB.Fragment, null, KB.createElement(T, {
    marginTop: 1
  }, KB.createElement(K8, null)), H()));
  return KB.createElement(Me, {
    title: z,
    subtitle: `${Q.filter((O)=>!O.overriddenBy).length} agents`
  }, Y && Y.length > 0 && KB.createElement(T, {
    marginTop: 1
  }, KB.createElement(C, {
    dimColor: !0
  }, Y[Y.length - 1])), KB.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, Z && KB.createElement(T, {
    marginBottom: 1
  }, K()), A === "all" ? KB.createElement(KB.Fragment, null, E("User agents", Q.filter((O) => O.source === "userSettings")), E("Project agents", Q.filter((O) => O.source === "projectSettings")), E("Managed agents", Q.filter((O) => O.source === "policySettings")), E("Plugin agents", Q.filter((O) => O.source === "plugin")), E("CLI arg agents", Q.filter((O) => O.source === "flagSettings")), (() => {
    let O = Q.filter((L) => L.source === "built-in");
    return O.length > 0 ? KB.createElement(T, {
      flexDirection: "column",
      marginBottom: 1,
      paddingLeft: 2
    }, KB.createElement(C, {
      dimColor: !0
    }, KB.createElement(C, {
      bold: !0
    }, "Built-in agents"), " (always available)"), O.map(V)) : null
  })()) : A === "built-in" ? KB.createElement(KB.Fragment, null, KB.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Built-in agents are provided by default and cannot be modified."), KB.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, Q.map((O) => V(O)))) : KB.createElement(KB.Fragment, null, Q.filter((O) => O.source !== "built-in").map((O) => V(O)), Q.some((O) => O.source === "built-in") && KB.createElement(KB.Fragment, null, KB.createElement(T, {
    marginTop: 1
  }, KB.createElement(K8, null)), H()))))
}
// @from(Ln 427500, Col 4)
KB
// @from(Ln 427501, Col 4)
p79 = w(() => {
  fA();
  fA();
  B2();
  lD();
  WT0();
  l2();
  uz1();
  KB = c(QA(), 1)
})
// @from(Ln 427512, Col 0)
function VT0({
  steps: A,
  initialData: Q = {},
  onComplete: B,
  onCancel: G,
  children: Z,
  title: Y,
  showStepCounter: J = !0
}) {
  let [X, I] = NK.useState(0), [D, W] = NK.useState(Q), [K, V] = NK.useState(!1), [F, H] = NK.useState([]);
  MQ(), NK.useEffect(() => {
    if (K) H([]), B(D)
  }, [K, D, B]);
  let E = NK.useCallback(() => {
      if (X < A.length - 1) {
        if (F.length > 0) H((j) => [...j, X]);
        I((j) => j + 1)
      } else V(!0)
    }, [X, A.length, F]),
    z = NK.useCallback(() => {
      if (F.length > 0) {
        let j = F[F.length - 1];
        if (j !== void 0) H((x) => x.slice(0, -1)), I(j)
      } else if (X > 0) I((j) => j - 1);
      else if (G) G()
    }, [X, F, G]),
    $ = NK.useCallback((j) => {
      if (j >= 0 && j < A.length) H((x) => [...x, X]), I(j)
    }, [X, A.length]),
    O = NK.useCallback(() => {
      if (H([]), G) G()
    }, [G]),
    L = NK.useCallback((j) => {
      W((x) => ({
        ...x,
        ...j
      }))
    }, []),
    M = NK.useMemo(() => ({
      currentStepIndex: X,
      totalSteps: A.length,
      wizardData: D,
      setWizardData: W,
      updateWizardData: L,
      goNext: E,
      goBack: z,
      goToStep: $,
      cancel: O,
      title: Y,
      showStepCounter: J
    }), [X, A.length, D, L, E, z, $, O, Y, J]),
    _ = A[X];
  if (!_ || K) return null;
  return NK.default.createElement(KT0.Provider, {
    value: M
  }, Z || NK.default.createElement(_, null))
}
// @from(Ln 427569, Col 4)
NK
// @from(Ln 427569, Col 8)
KT0
// @from(Ln 427570, Col 4)
FT0 = w(() => {
  E9();
  NK = c(QA(), 1), KT0 = NK.createContext(null)
})
// @from(Ln 427575, Col 0)
function lJ() {
  let A = l79.useContext(KT0);
  if (!A) throw Error("useWizard must be used within a WizardProvider");
  return A
}
// @from(Ln 427580, Col 4)
l79
// @from(Ln 427581, Col 4)
HT0 = w(() => {
  FT0();
  l79 = c(QA(), 1)
})
// @from(Ln 427586, Col 0)
function ET0({
  instructions: A = V8A.default.createElement(vQ, null, V8A.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), V8A.default.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), V8A.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }))
}) {
  let Q = MQ();
  return V8A.default.createElement(T, {
    marginLeft: 3
  }, V8A.default.createElement(C, {
    dimColor: !0
  }, Q.pending ? `Press ${Q.keyName} again to exit` : A))
}
// @from(Ln 427607, Col 4)
V8A
// @from(Ln 427608, Col 4)
zT0 = w(() => {
  fA();
  E9();
  e9();
  I3();
  K6();
  V8A = c(QA(), 1)
})
// @from(Ln 427617, Col 0)
function WD({
  title: A,
  titleColor: Q = "text",
  borderColor: B = "suggestion",
  children: G,
  subtitle: Z,
  footerText: Y
}) {
  let {
    currentStepIndex: J,
    totalSteps: X,
    title: I,
    showStepCounter: D
  } = lJ();
  return Up.default.createElement(Up.default.Fragment, null, Up.default.createElement(T, {
    borderStyle: "round",
    borderColor: B,
    flexDirection: "column"
  }, Up.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, Up.default.createElement(C, {
    bold: !0,
    color: Q
  }, A || I || "Wizard", D !== !1 && ` (${J+1}/${X})`), Z && Up.default.createElement(C, {
    dimColor: !0
  }, Z)), Up.default.createElement(T, {
    paddingX: 1,
    flexDirection: "column"
  }, G)), Up.default.createElement(ET0, {
    instructions: Y
  }))
}
// @from(Ln 427650, Col 4)
Up
// @from(Ln 427651, Col 4)
Tj = w(() => {
  fA();
  HT0();
  zT0();
  Up = c(QA(), 1)
})
// @from(Ln 427657, Col 4)
QM = w(() => {
  FT0();
  HT0();
  Tj();
  zT0()
})
// @from(Ln 427664, Col 0)
function i79() {
  let {
    goNext: A,
    updateWizardData: Q,
    cancel: B
  } = lJ();
  return Re.default.createElement(WD, {
    subtitle: "Choose location",
    footerText: Re.default.createElement(vQ, null, Re.default.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), Re.default.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), Re.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "cancel"
    }))
  }, Re.default.createElement(T, {
    marginTop: 1
  }, Re.default.createElement(k0, {
    key: "location-select",
    options: [{
      label: "Project (.claude/agents/)",
      value: "projectSettings"
    }, {
      label: "Personal (~/.claude/agents/)",
      value: "userSettings"
    }],
    onChange: (Z) => {
      Q({
        location: Z
      }), A()
    },
    onCancel: () => B()
  })))
}
// @from(Ln 427703, Col 4)
Re
// @from(Ln 427704, Col 4)
n79 = w(() => {
  fA();
  W8();
  Tj();
  QM();
  e9();
  I3();
  K6();
  Re = c(QA(), 1)
})
// @from(Ln 427715, Col 0)
function a79() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    goToStep: G
  } = lJ();
  return _e.default.createElement(WD, {
    subtitle: "Creation method",
    footerText: _e.default.createElement(vQ, null, _e.default.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), _e.default.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), _e.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, _e.default.createElement(T, {
    marginTop: 1
  }, _e.default.createElement(k0, {
    key: "method-select",
    options: [{
      label: "Generate with Claude (recommended)",
      value: "generate"
    }, {
      label: "Manual configuration",
      value: "manual"
    }],
    onChange: (Y) => {
      let J = Y;
      if (B({
          method: J,
          wasGenerated: J === "generate"
        }), J === "generate") A();
      else G(3)
    },
    onCancel: () => Q()
  })))
}
// @from(Ln 427758, Col 4)
_e
// @from(Ln 427759, Col 4)
o79 = w(() => {
  fA();
  W8();
  Tj();
  QM();
  e9();
  I3();
  K6();
  _e = c(QA(), 1)
})
// @from(Ln 427769, Col 0)
async function r79(A, Q, B, G) {
  let Z = B.length > 0 ? `

IMPORTANT: The following identifiers already exist and must NOT be used: ${B.join(", ")}` : "",
    Y = `Create an agent configuration based on this request: "${A}".${Z}
  Return ONLY the JSON object, no other text.`,
    J = H0({
      content: Y
    }),
    X = await ZV(),
    I = _3A([J], X),
    K = (await Pd({
      messages: FI(I),
      systemPrompt: [fF7],
      maxThinkingTokens: 0,
      tools: [],
      signal: G,
      options: {
        getToolPermissionContext: async () => oL(),
        model: Q,
        toolChoice: void 0,
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        querySource: "agent_creation",
        mcpTools: []
      }
    })).message.content.filter((F) => F.type === "text").map((F) => F.text).join(`
`),
    V;
  try {
    V = AQ(K.trim())
  } catch {
    let F = K.match(/\{[\s\S]*\}/);
    if (!F) throw Error("No JSON object found in response");
    V = AQ(F[0])
  }
  if (!V.identifier || !V.whenToUse || !V.systemPrompt) throw Error("Invalid agent configuration generated");
  return l("tengu_agent_definition_generated", {
    agent_identifier: V.identifier
  }), {
    identifier: V.identifier,
    whenToUse: V.whenToUse,
    systemPrompt: V.systemPrompt
  }
}
// @from(Ln 427815, Col 4)
fF7
// @from(Ln 427816, Col 4)
s79 = w(() => {
  nY();
  tQ();
  OS();
  Z0();
  oc();
  A0();
  fF7 = `You are an elite AI agent architect specializing in crafting high-performance agent configurations. Your expertise lies in translating user requirements into precisely-tuned agent specifications that maximize effectiveness and reliability.

**Important Context**: You may have access to project-specific instructions from CLAUDE.md files and other context that may include coding standards, project structure, and custom requirements. Consider this context when creating agents to ensure they align with the project's established patterns and practices.

When a user describes what they want an agent to do, you will:

1. **Extract Core Intent**: Identify the fundamental purpose, key responsibilities, and success criteria for the agent. Look for both explicit requirements and implicit needs. Consider any project-specific context from CLAUDE.md files. For agents that are meant to review code, you should assume that the user is asking to review recently written code and not the whole codebase, unless the user has explicitly instructed you otherwise.

2. **Design Expert Persona**: Create a compelling expert identity that embodies deep domain knowledge relevant to the task. The persona should inspire confidence and guide the agent's decision-making approach.

3. **Architect Comprehensive Instructions**: Develop a system prompt that:
   - Establishes clear behavioral boundaries and operational parameters
   - Provides specific methodologies and best practices for task execution
   - Anticipates edge cases and provides guidance for handling them
   - Incorporates any specific requirements or preferences mentioned by the user
   - Defines output format expectations when relevant
   - Aligns with project-specific coding standards and patterns from CLAUDE.md

4. **Optimize for Performance**: Include:
   - Decision-making frameworks appropriate to the domain
   - Quality control mechanisms and self-verification steps
   - Efficient workflow patterns
   - Clear escalation or fallback strategies

5. **Create Identifier**: Design a concise, descriptive identifier that:
   - Uses lowercase letters, numbers, and hyphens only
   - Is typically 2-4 words joined by hyphens
   - Clearly indicates the agent's primary function
   - Is memorable and easy to type
   - Avoids generic terms like "helper" or "assistant"

6 **Example agent descriptions**:
  - in the 'whenToUse' field of the JSON object, you should include examples of when this agent should be used.
  - examples should be of the form:
    - <example>
      Context: The user is creating a test-runner agent that should be called after a logical chunk of code is written.
      user: "Please write a function that checks if a number is prime"
      assistant: "Here is the relevant function: "
      <function call omitted for brevity only for this example>
      <commentary>
      Since a significant piece of code was written, use the ${f3} tool to launch the test-runner agent to run the tests.
      </commentary>
      assistant: "Now let me use the test-runner agent to run the tests"
    </example>
    - <example>
      Context: User is creating an agent to respond to the word "hello" with a friendly jok.
      user: "Hello"
      assistant: "I'm going to use the ${f3} tool to launch the greeting-responder agent to respond with a friendly joke"
      <commentary>
      Since the user is greeting, use the greeting-responder agent to respond with a friendly joke. 
      </commentary>
    </example>
  - If the user mentioned or implied that the agent should be used proactively, you should include examples of this.
- NOTE: Ensure that in the examples, you are making the assistant use the Agent tool and not simply respond directly to the task.

Your output must be a valid JSON object with exactly these fields:
{
  "identifier": "A unique, descriptive identifier using lowercase letters, numbers, and hyphens (e.g., 'test-runner', 'api-docs-writer', 'code-formatter')",
  "whenToUse": "A precise, actionable description starting with 'Use this agent when...' that clearly defines the triggering conditions and use cases. Ensure you include examples as described above.",
  "systemPrompt": "The complete system prompt that will govern the agent's behavior, written in second person ('You are...', 'You will...') and structured for maximum clarity and effectiveness"
}

Key principles for your system prompts:
- Be specific rather than generic - avoid vague instructions
- Include concrete examples when they would clarify behavior
- Balance comprehensiveness with clarity - every instruction should add value
- Ensure the agent has enough context to handle variations of the core task
- Make the agent proactive in seeking clarification when needed
- Build in quality assurance and self-correction mechanisms

Remember: The agents you create should be autonomous experts capable of handling their designated tasks with minimal additional guidance. Your system prompts are their complete operational manual.
`
})
// @from(Ln 427897, Col 0)
function t79() {
  let {
    updateWizardData: A,
    goBack: Q,
    goToStep: B,
    wizardData: G
  } = lJ(), [Z, Y] = VW.useState(G.generationPrompt || ""), [J, X] = VW.useState(!1), [I, D] = VW.useState(null), [W, K] = VW.useState(Z.length), V = js(), F = VW.useRef(null);
  J0((z, $) => {
    if ($.escape) {
      if (J && F.current) F.current.abort(), F.current = null, X(!1), D("Generation cancelled");
      else if (!J) A({
        generationPrompt: "",
        agentType: "",
        systemPrompt: "",
        whenToUse: "",
        generatedAgent: void 0,
        wasGenerated: !1
      }), Y(""), D(null), Q()
    }
  });
  let H = async () => {
    let z = Z.trim();
    if (!z) {
      D("Please describe what the agent should do");
      return
    }
    D(null), X(!0), A({
      generationPrompt: z,
      isGenerating: !0
    });
    let $ = c9();
    F.current = $;
    try {
      let O = await r79(z, V, [], $.signal);
      A({
        agentType: O.identifier,
        whenToUse: O.whenToUse,
        systemPrompt: O.systemPrompt,
        generatedAgent: O,
        isGenerating: !1,
        wasGenerated: !0
      }), B(6)
    } catch (O) {
      if (O instanceof Error && !O.message.includes("No assistant message found")) D(O.message || "Failed to generate agent");
      A({
        isGenerating: !1
      })
    } finally {
      X(!1), F.current = null
    }
  }, E = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
  if (J) return VW.default.createElement(WD, {
    subtitle: E,
    footerText: VW.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "cancel"
    })
  }, VW.default.createElement(T, {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center"
  }, VW.default.createElement(W9, null), VW.default.createElement(C, {
    color: "suggestion"
  }, " Generating agent from description...")));
  return VW.default.createElement(WD, {
    subtitle: E,
    footerText: VW.default.createElement(vQ, null, VW.default.createElement(hQ, {
      action: "confirm:yes",
      context: "Confirmation",
      fallback: "Enter",
      description: "submit"
    }), VW.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, VW.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, I && VW.default.createElement(T, {
    marginBottom: 1
  }, VW.default.createElement(C, {
    color: "error"
  }, I)), VW.default.createElement(p4, {
    value: Z,
    onChange: Y,
    onSubmit: H,
    placeholder: "e.g., Help me write unit tests for my code...",
    columns: 80,
    cursorOffset: W,
    onChangeCursorOffset: K,
    focus: !0,
    showCursor: !0
  })))
}
// @from(Ln 427995, Col 4)
VW
// @from(Ln 427996, Col 4)
e79 = w(() => {
  fA();
  fA();
  IY();
  Tj();
  QM();
  yG();
  s79();
  _kA();
  iZ();
  I3();
  K6();
  VW = c(QA(), 1)
})
// @from(Ln 428011, Col 0)
function $T0(A) {
  if (!A) return "Agent type is required";
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(A)) return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
  if (A.length < 3) return "Agent type must be at least 3 characters long";
  if (A.length > 50) return "Agent type must be less than 50 characters";
  return null
}
// @from(Ln 428019, Col 0)
function AG9(A, Q, B) {
  let G = [],
    Z = [];
  if (!A.agentType) G.push("Agent type is required");
  else {
    let J = $T0(A.agentType);
    if (J) G.push(J);
    let X = B.find((I) => I.agentType === A.agentType && I.source !== A.source);
    if (X) G.push(`Agent type "${A.agentType}" already exists in ${Y$A(X.source)}`)
  }
  if (!A.whenToUse) G.push("Description (description) is required");
  else if (A.whenToUse.length < 10) Z.push("Description should be more descriptive (at least 10 characters)");
  else if (A.whenToUse.length > 5000) Z.push("Description is very long (over 5000 characters)");
  if (A.tools !== void 0 && !Array.isArray(A.tools)) G.push("Tools must be an array");
  else {
    if (A.tools === void 0) Z.push("Agent has access to all tools");
    else if (A.tools.length === 0) Z.push("No tools selected - agent will have very limited capabilities");
    let J = ur(A, Q, !1);
    if (J.invalidTools.length > 0) G.push(`Invalid tools: ${J.invalidTools.join(", ")}`)
  }
  let Y = A.getSystemPrompt();
  if (!Y) G.push("System prompt is required");
  else if (Y.length < 20) G.push("System prompt is too short (minimum 20 characters)");
  else if (Y.length > 1e4) Z.push("System prompt is very long (over 10,000 characters)");
  return {
    isValid: G.length === 0,
    errors: G,
    warnings: Z
  }
}
// @from(Ln 428049, Col 4)
CT0 = w(() => {
  L4A();
  uz1()
})
// @from(Ln 428054, Col 0)
function QG9(A) {
  let {
    goNext: Q,
    goBack: B,
    updateWizardData: G,
    wizardData: Z
  } = lJ(), [Y, J] = _$.useState(Z.agentType || ""), [X, I] = _$.useState(null), [D, W] = _$.useState(Y.length);
  return H2("confirm:no", B, {
    context: "Confirmation"
  }), _$.default.createElement(WD, {
    subtitle: "Agent type (identifier)",
    footerText: _$.default.createElement(vQ, null, _$.default.createElement(F0, {
      shortcut: "Type",
      action: "enter text"
    }), _$.default.createElement(F0, {
      shortcut: "Enter",
      action: "continue"
    }), _$.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, _$.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, _$.default.createElement(C, null, "Enter a unique identifier for your agent:"), _$.default.createElement(T, {
    marginTop: 1
  }, _$.default.createElement(p4, {
    value: Y,
    onChange: J,
    onSubmit: (V) => {
      let F = V.trim(),
        H = $T0(F);
      if (H) {
        I(H);
        return
      }
      I(null), G({
        agentType: F
      }), Q()
    },
    placeholder: "e.g., test-runner, tech-lead, etc",
    columns: 60,
    cursorOffset: D,
    onChangeCursorOffset: W,
    focus: !0,
    showCursor: !0
  })), X && _$.default.createElement(T, {
    marginTop: 1
  }, _$.default.createElement(C, {
    color: "error"
  }, X))))
}
// @from(Ln 428108, Col 4)
_$
// @from(Ln 428109, Col 4)
BG9 = w(() => {
  fA();
  IY();
  Tj();
  QM();
  CT0();
  e9();
  I3();
  K6();
  c6();
  _$ = c(QA(), 1)
})
// @from(Ln 428122, Col 0)
function GG9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = lJ(), [Z, Y] = vE.useState(G.systemPrompt || ""), [J, X] = vE.useState(Z.length), [I, D] = vE.useState(null);
  return H2("confirm:no", Q, {
    context: "Confirmation"
  }), vE.default.createElement(WD, {
    subtitle: "System prompt",
    footerText: vE.default.createElement(vQ, null, vE.default.createElement(F0, {
      shortcut: "Type",
      action: "enter text"
    }), vE.default.createElement(F0, {
      shortcut: "Enter",
      action: "continue"
    }), vE.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, vE.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, vE.default.createElement(C, null, "Enter the system prompt for your agent:"), vE.default.createElement(C, {
    dimColor: !0
  }, "Be comprehensive for best results"), vE.default.createElement(T, {
    marginTop: 1
  }, vE.default.createElement(p4, {
    value: Z,
    onChange: Y,
    onSubmit: () => {
      let K = Z.trim();
      if (!K) {
        D("System prompt is required");
        return
      }
      D(null), B({
        systemPrompt: K
      }), A()
    },
    placeholder: "You are a helpful code reviewer who...",
    columns: 80,
    cursorOffset: J,
    onChangeCursorOffset: X,
    focus: !0,
    showCursor: !0
  })), I && vE.default.createElement(T, {
    marginTop: 1
  }, vE.default.createElement(C, {
    color: "error"
  }, I))))
}
// @from(Ln 428177, Col 4)
vE
// @from(Ln 428178, Col 4)
ZG9 = w(() => {
  fA();
  IY();
  Tj();
  QM();
  e9();
  I3();
  K6();
  c6();
  vE = c(QA(), 1)
})
// @from(Ln 428190, Col 0)
function YG9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = lJ(), [Z, Y] = j$.useState(G.whenToUse || ""), [J, X] = j$.useState(Z.length), [I, D] = j$.useState(null);
  return H2("confirm:no", Q, {
    context: "Confirmation"
  }), j$.default.createElement(WD, {
    subtitle: "Description (tell Claude when to use this agent)",
    footerText: j$.default.createElement(vQ, null, j$.default.createElement(F0, {
      shortcut: "Type",
      action: "enter text"
    }), j$.default.createElement(F0, {
      shortcut: "Enter",
      action: "continue"
    }), j$.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, j$.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, j$.default.createElement(C, null, "When should Claude use this agent?"), j$.default.createElement(T, {
    marginTop: 1
  }, j$.default.createElement(p4, {
    value: Z,
    onChange: Y,
    onSubmit: (K) => {
      let V = K.trim();
      if (!V) {
        D("Description is required");
        return
      }
      D(null), B({
        whenToUse: V
      }), A()
    },
    placeholder: "e.g., use this agent after you're done writing code...",
    columns: 80,
    cursorOffset: J,
    onChangeCursorOffset: X,
    focus: !0,
    showCursor: !0
  })), I && j$.default.createElement(T, {
    marginTop: 1
  }, j$.default.createElement(C, {
    color: "error"
  }, I))))
}
// @from(Ln 428243, Col 4)
j$
// @from(Ln 428244, Col 4)
JG9 = w(() => {
  fA();
  IY();
  Tj();
  QM();
  e9();
  I3();
  K6();
  c6();
  j$ = c(QA(), 1)
})
// @from(Ln 428256, Col 0)
function hF7(A) {
  let Q = new Map;
  return A.forEach((B) => {
    if ($j(B)) {
      let G = qF(B.name);
      if (G?.serverName) {
        let Z = Q.get(G.serverName) || [];
        Z.push(B), Q.set(G.serverName, Z)
      }
    }
  }), Array.from(Q.entries()).map(([B, G]) => ({
    serverName: B,
    tools: G
  })).sort((B, G) => B.serverName.localeCompare(G.serverName))
}
// @from(Ln 428272, Col 0)
function mz1({
  tools: A,
  initialTools: Q,
  onComplete: B,
  onCancel: G
}) {
  let Z = wK.useMemo(() => VD0({
      tools: A,
      isBuiltIn: !1,
      isAsync: !1
    }), [A]),
    Y = !Q || Q.includes("*") ? Z.map((S) => S.name) : Q,
    [J, X] = wK.useState(Y),
    [I, D] = wK.useState(0),
    [W, K] = wK.useState(!1),
    V = wK.useMemo(() => {
      let S = new Set(Z.map((u) => u.name));
      return J.filter((u) => S.has(u))
    }, [J, Z]),
    F = new Set(V),
    H = V.length === Z.length && Z.length > 0,
    E = (S) => {
      if (!S) return;
      X((u) => u.includes(S) ? u.filter((f) => f !== S) : [...u, S])
    },
    z = (S, u) => {
      X((f) => {
        if (u) {
          let AA = S.filter((n) => !f.includes(n));
          return [...f, ...AA]
        } else return f.filter((AA) => !S.includes(AA))
      })
    },
    $ = () => {
      let S = Z.map((AA) => AA.name),
        f = V.length === S.length && S.every((AA) => V.includes(AA)) ? void 0 : V;
      B(f)
    },
    O = wK.useMemo(() => {
      let S = XG9(),
        u = {
          readOnly: [],
          edit: [],
          execution: [],
          mcp: [],
          other: []
        };
      return Z.forEach((f) => {
        if ($j(f)) u.mcp.push(f);
        else if (S.READ_ONLY.toolNames.has(f.name)) u.readOnly.push(f);
        else if (S.EDIT.toolNames.has(f.name)) u.edit.push(f);
        else if (S.EXECUTION.toolNames.has(f.name)) u.execution.push(f);
        else if (f.name !== f3) u.other.push(f)
      }), u
    }, [Z]),
    L = (S) => {
      let f = S.filter((AA) => F.has(AA.name)).length < S.length;
      return () => {
        let AA = S.map((n) => n.name);
        z(AA, f)
      }
    },
    M = [];
  M.push({
    id: "continue",
    label: "Continue",
    action: $,
    isContinue: !0
  }), M.push({
    id: "bucket-all",
    label: `${H?tA.checkboxOn:tA.checkboxOff} All tools`,
    action: () => {
      let S = Z.map((u) => u.name);
      z(S, !H)
    }
  });
  let _ = XG9();
  [{
    id: "bucket-readonly",
    name: _.READ_ONLY.name,
    tools: O.readOnly
  }, {
    id: "bucket-edit",
    name: _.EDIT.name,
    tools: O.edit
  }, {
    id: "bucket-execution",
    name: _.EXECUTION.name,
    tools: O.execution
  }, {
    id: "bucket-mcp",
    name: _.MCP.name,
    tools: O.mcp
  }, {
    id: "bucket-other",
    name: _.OTHER.name,
    tools: O.other
  }].forEach(({
    id: S,
    name: u,
    tools: f
  }) => {
    if (f.length === 0) return;
    let n = f.filter((y) => F.has(y.name)).length === f.length;
    M.push({
      id: S,
      label: `${n?tA.checkboxOn:tA.checkboxOff} ${u}`,
      action: L(f)
    })
  });
  let x = M.length;
  M.push({
    id: "toggle-individual",
    label: W ? "Hide advanced options" : "Show advanced options",
    action: () => {
      if (K(!W), W && I > x) D(x)
    },
    isToggle: !0
  });
  let b = wK.useMemo(() => hF7(Z), [Z]);
  if (W) {
    if (b.length > 0) M.push({
      id: "mcp-servers-header",
      label: "MCP Servers:",
      action: () => {},
      isHeader: !0
    }), b.forEach(({
      serverName: S,
      tools: u
    }) => {
      let AA = u.filter((n) => F.has(n.name)).length === u.length;
      M.push({
        id: `mcp-server-${S}`,
        label: `${AA?tA.checkboxOn:tA.checkboxOff} ${S} (${u.length} tool${u.length===1?"":"s"})`,
        action: () => {
          let n = u.map((y) => y.name);
          z(n, !AA)
        }
      })
    }), M.push({
      id: "tools-header",
      label: "Individual Tools:",
      action: () => {},
      isHeader: !0
    });
    Z.forEach((S) => {
      let u = S.name;
      if (S.name.startsWith("mcp__")) {
        let f = qF(S.name);
        u = f ? `${f.toolName} (${f.serverName})` : S.name
      }
      M.push({
        id: `tool-${S.name}`,
        label: `${F.has(S.name)?tA.checkboxOn:tA.checkboxOff} ${u}`,
        action: () => E(S.name)
      })
    })
  }
  return J0((S, u) => {
    if (u.return) {
      let f = M[I];
      if (f && !f.isHeader) f.action()
    } else if (u.escape)
      if (G) G();
      else B(Q);
    else if (u.upArrow) {
      let f = I - 1;
      while (f > 0 && M[f]?.isHeader) f--;
      D(Math.max(0, f))
    } else if (u.downArrow) {
      let f = I + 1;
      while (f < M.length - 1 && M[f]?.isHeader) f++;
      D(Math.min(M.length - 1, f))
    }
  }), wK.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, wK.default.createElement(C, {
    color: I === 0 ? "suggestion" : void 0,
    bold: I === 0
  }, I === 0 ? `${tA.pointer} ` : "  ", "[ Continue ]"), wK.default.createElement(C, {
    dimColor: !0
  }, "─".repeat(40)), M.slice(1).map((S, u) => {
    let f = u + 1 === I,
      AA = S.isToggle,
      n = S.isHeader;
    return wK.default.createElement(wK.default.Fragment, {
      key: S.id
    }, AA && wK.default.createElement(C, {
      dimColor: !0
    }, "─".repeat(40)), n && u > 0 && wK.default.createElement(T, {
      marginTop: 1
    }), wK.default.createElement(C, {
      color: n ? void 0 : f ? "suggestion" : void 0,
      dimColor: n,
      bold: AA && f
    }, n ? "" : f ? `${tA.pointer} ` : "  ", AA ? `[ ${S.label} ]` : S.label))
  }), wK.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, wK.default.createElement(C, {
    dimColor: !0
  }, H ? "All tools selected" : `${F.size} of ${Z.length} tools selected`)))
}
// @from(Ln 428476, Col 4)
wK
// @from(Ln 428476, Col 8)
XG9 = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([as.name, Tc.name, V$.name, v5.name, hF.name, vD.name, XK1.name, ZK1.name, JK1.name, Ud.name, qd.name])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([J$.name, X$.name, qf.name])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([o2.name, void 0].filter(Boolean))
  },
  MCP: {
    name: "MCP tools",
    toolNames: new Set,
    isMcp: !0
  },
  OTHER: {
    name: "Other tools",
    toolNames: new Set
  }
})
// @from(Ln 428499, Col 4)
UT0 = w(() => {
  fA();
  fA();
  B2();
  PJ();
  UW1();
  HbA();
  fbA();
  T_();
  iHA();
  SIA();
  jU0();
  MU0();
  _U0();
  IZ1();
  DZ1();
  is();
  jc();
  u6A();
  YK();
  L4A();
  wK = c(QA(), 1)
})
// @from(Ln 428523, Col 0)
function IG9({
  tools: A
}) {
  let {
    goNext: Q,
    goBack: B,
    updateWizardData: G,
    wizardData: Z
  } = lJ(), Y = (X) => {
    G({
      selectedTools: X
    }), Q()
  }, J = Z.selectedTools;
  return F8A.default.createElement(WD, {
    subtitle: "Select tools",
    footerText: F8A.default.createElement(vQ, null, F8A.default.createElement(F0, {
      shortcut: "Enter",
      action: "toggle selection"
    }), F8A.default.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), F8A.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, F8A.default.createElement(mz1, {
    tools: A,
    initialTools: J,
    onComplete: Y,
    onCancel: B
  }))
}
// @from(Ln 428557, Col 4)
F8A
// @from(Ln 428558, Col 4)
DG9 = w(() => {
  UT0();
  Tj();
  QM();
  e9();
  I3();
  K6();
  F8A = c(QA(), 1)
})
// @from(Ln 428568, Col 0)
function dz1({
  initialModel: A,
  onComplete: Q,
  onCancel: B
}) {
  let G = Pj.useMemo(() => KeQ(), []),
    Z = Pj.useMemo(() => {
      if (A && G.some((Y) => Y.value === A)) return A;
      return "sonnet"
    }, [A, G]);
  return Pj.createElement(T, {
    flexDirection: "column"
  }, Pj.createElement(T, {
    marginBottom: 1
  }, Pj.createElement(C, {
    dimColor: !0
  }, "Model determines the agent's reasoning capabilities and speed.")), Pj.createElement(k0, {
    options: G,
    defaultValue: Z,
    onChange: (Y) => {
      Q(Y)
    },
    onCancel: () => B ? B() : Q(A)
  }))
}
// @from(Ln 428593, Col 4)
Pj
// @from(Ln 428594, Col 4)
qT0 = w(() => {
  fA();
  W8();
  l2();
  Pj = c(QA(), 1)
})
// @from(Ln 428601, Col 0)
function WG9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = lJ(), Z = (Y) => {
    B({
      selectedModel: Y
    }), A()
  };
  return H8A.default.createElement(WD, {
    subtitle: "Select model",
    footerText: H8A.default.createElement(vQ, null, H8A.default.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), H8A.default.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), H8A.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, H8A.default.createElement(dz1, {
    initialModel: G.selectedModel,
    onComplete: Z,
    onCancel: Q
  }))
}
// @from(Ln 428632, Col 4)
H8A
// @from(Ln 428633, Col 4)
KG9 = w(() => {
  qT0();
  Tj();
  QM();
  e9();
  I3();
  K6();
  H8A = c(QA(), 1)
})
// @from(Ln 428643, Col 0)
function cz1({
  agentName: A,
  currentColor: Q = "automatic",
  onConfirm: B
}) {
  let [G, Z] = VG9.useState(Math.max(0, J$A.findIndex((J) => J === Q)));
  J0((J, X) => {
    if (X.upArrow) Z((I) => I > 0 ? I - 1 : J$A.length - 1);
    else if (X.downArrow) Z((I) => I < J$A.length - 1 ? I + 1 : 0);
    else if (X.return) {
      let I = J$A[G];
      B(I === "automatic" ? void 0 : I)
    }
  });
  let Y = J$A[G];
  return BM.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, BM.default.createElement(T, {
    flexDirection: "column"
  }, J$A.map((J, X) => {
    let I = X === G;
    return BM.default.createElement(T, {
      key: J,
      flexDirection: "row",
      gap: 1
    }, BM.default.createElement(C, {
      color: I ? "suggestion" : void 0
    }, I ? tA.pointer : " "), J === "automatic" ? BM.default.createElement(C, {
      bold: I
    }, "Automatic color") : BM.default.createElement(T, {
      gap: 1
    }, BM.default.createElement(C, {
      backgroundColor: fb[J],
      color: "inverseText"
    }, " "), BM.default.createElement(C, {
      bold: I
    }, J.charAt(0).toUpperCase() + J.slice(1))))
  })), BM.default.createElement(T, {
    marginTop: 1
  }, BM.default.createElement(C, null, "Preview: "), Y === void 0 || Y === "automatic" ? BM.default.createElement(C, {
    inverse: !0,
    bold: !0
  }, " ", A, " ") : BM.default.createElement(C, {
    backgroundColor: fb[Y],
    color: "inverseText",
    bold: !0
  }, " ", A, " ")))
}
// @from(Ln 428692, Col 4)
BM
// @from(Ln 428692, Col 8)
VG9
// @from(Ln 428692, Col 13)
J$A
// @from(Ln 428693, Col 4)
NT0 = w(() => {
  fA();
  EO();
  B2();
  BM = c(QA(), 1), VG9 = c(QA(), 1), J$A = ["automatic", ...SN]
})
// @from(Ln 428700, Col 0)
function FG9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = lJ();
  H2("confirm:no", Q, {
    context: "Confirmation"
  });
  let Z = (Y) => {
    B({
      selectedColor: Y,
      finalAgent: {
        agentType: G.agentType,
        whenToUse: G.whenToUse,
        getSystemPrompt: () => G.systemPrompt,
        tools: G.selectedTools,
        ...G.selectedModel ? {
          model: G.selectedModel
        } : {},
        ...Y ? {
          color: Y
        } : {},
        source: G.location
      }
    }), A()
  };
  return je.default.createElement(WD, {
    subtitle: "Choose background color",
    footerText: je.default.createElement(vQ, null, je.default.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), je.default.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), je.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))
  }, je.default.createElement(T, {
    marginTop: 1
  }, je.default.createElement(cz1, {
    agentName: G.agentType || "agent",
    currentColor: "automatic",
    onConfirm: Z
  })))
}
// @from(Ln 428750, Col 4)
je
// @from(Ln 428751, Col 4)
HG9 = w(() => {
  fA();
  NT0();
  Tj();
  QM();
  e9();
  I3();
  K6();
  c6();
  je = c(QA(), 1)
})
// @from(Ln 428763, Col 0)
function EG9({
  tools: A,
  existingAgents: Q,
  onSave: B,
  onSaveAndEdit: G,
  error: Z
}) {
  let {
    goBack: Y,
    wizardData: J
  } = lJ();
  J0((W, K) => {
    if (K.escape) Y();
    else if (W === "s" || K.return) B();
    else if (W === "e") G()
  });
  let X = J.finalAgent,
    I = AG9(X, A, Q),
    D = (W) => {
      if (W === void 0) return "All tools";
      if (W.length === 0) return "None";
      if (W.length === 1) return W[0] || "None";
      if (W.length === 2) return W.join(" and ");
      return `${W.slice(0,-1).join(", ")}, and ${W[W.length-1]}`
    };
  return l8.default.createElement(WD, {
    subtitle: "Confirm and save",
    footerText: l8.default.createElement(vQ, null, l8.default.createElement(F0, {
      shortcut: "s/Enter",
      action: "save"
    }), l8.default.createElement(F0, {
      shortcut: "e",
      action: "edit in your editor"
    }), l8.default.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "cancel"
    }))
  }, l8.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "Name"), ": ", X.agentType), l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "Location"), ":", " ", g79({
    source: J.location,
    agentType: X.agentType
  })), l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "Tools"), ": ", D(X.tools)), l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "Model"), ": ", JA1(X.model)), l8.default.createElement(T, {
    marginTop: 1
  }, l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "Description"), " (tells Claude when to use this agent):")), l8.default.createElement(T, {
    marginLeft: 2,
    marginTop: 1
  }, l8.default.createElement(C, null, X.whenToUse.length > 240 ? X.whenToUse.slice(0, 240) + "…" : X.whenToUse)), l8.default.createElement(T, {
    marginTop: 1
  }, l8.default.createElement(C, null, l8.default.createElement(C, {
    bold: !0
  }, "System prompt"), ":")), l8.default.createElement(T, {
    marginLeft: 2,
    marginTop: 1
  }, l8.default.createElement(C, null, (() => {
    let W = X.getSystemPrompt();
    return W.length > 240 ? W.slice(0, 240) + "…" : W
  })())), I.warnings.length > 0 && l8.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, l8.default.createElement(C, {
    color: "warning"
  }, "Warnings:"), I.warnings.map((W, K) => l8.default.createElement(C, {
    key: K,
    dimColor: !0
  }, " ", "• ", W))), I.errors.length > 0 && l8.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, l8.default.createElement(C, {
    color: "error"
  }, "Errors:"), I.errors.map((W, K) => l8.default.createElement(C, {
    key: K,
    color: "error"
  }, " ", "• ", W))), Z && l8.default.createElement(T, {
    marginTop: 1
  }, l8.default.createElement(C, {
    color: "error"
  }, Z)), l8.default.createElement(T, {
    marginTop: 2
  }, l8.default.createElement(C, {
    color: "success"
  }, "Press ", l8.default.createElement(C, {
    bold: !0
  }, "s"), " or ", l8.default.createElement(C, {
    bold: !0
  }, "Enter"), " to save,", " ", l8.default.createElement(C, {
    bold: !0
  }, "e"), " to save and edit"))))
}
// @from(Ln 428865, Col 4)
l8
// @from(Ln 428866, Col 4)
zG9 = w(() => {
  fA();
  fA();
  Tj();
  QM();
  CT0();
  Z$A();
  l2();
  e9();
  I3();
  K6();
  l8 = c(QA(), 1)
})
// @from(Ln 428880, Col 0)
function $G9({
  tools: A,
  existingAgents: Q,
  onComplete: B
}) {
  let {
    wizardData: G
  } = lJ(), [Z, Y] = E8A.useState(null), [, J] = a0(), X = E8A.useCallback(async () => {
    if (!G?.finalAgent) return;
    try {
      await DT0(G.location, G.finalAgent.agentType, G.finalAgent.whenToUse, G.finalAgent.tools, G.finalAgent.getSystemPrompt(), !0, G.finalAgent.color, G.finalAgent.model), J((D) => {
        if (!G.finalAgent) return D;
        let W = D.agentDefinitions.allAgents.concat(G.finalAgent);
        return {
          ...D,
          agentDefinitions: {
            ...D.agentDefinitions,
            activeAgents: mb(W),
            allAgents: W
          }
        }
      }), l("tengu_agent_created", {
        agent_type: G.finalAgent.agentType,
        generation_method: G.wasGenerated ? "generated" : "manual",
        source: G.location,
        tool_count: G.finalAgent.tools?.length ?? "all",
        has_custom_model: !!G.finalAgent.model,
        has_custom_color: !!G.finalAgent.color
      }), B(`Created agent: ${I1.bold(G.finalAgent.agentType)}`)
    } catch (D) {
      Y(D instanceof Error ? D.message : "Failed to save agent")
    }
  }, [G, B, J]), I = E8A.useCallback(async () => {
    if (!G?.finalAgent) return;
    try {
      await DT0(G.location, G.finalAgent.agentType, G.finalAgent.whenToUse, G.finalAgent.tools, G.finalAgent.getSystemPrompt(), !0, G.finalAgent.color, G.finalAgent.model), J((W) => {
        if (!G.finalAgent) return W;
        let K = W.agentDefinitions.allAgents.concat(G.finalAgent);
        return {
          ...W,
          agentDefinitions: {
            ...W.agentDefinitions,
            activeAgents: mb(K),
            allAgents: K
          }
        }
      });
      let D = IT0({
        source: G.location,
        agentType: G.finalAgent.agentType
      });
      await tf(D), l("tengu_agent_created", {
        agent_type: G.finalAgent.agentType,
        generation_method: G.wasGenerated ? "generated" : "manual",
        source: G.location,
        tool_count: G.finalAgent.tools?.length ?? "all",
        has_custom_model: !!G.finalAgent.model,
        has_custom_color: !!G.finalAgent.color,
        opened_in_editor: !0
      }), B(`Created agent: ${I1.bold(G.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.`)
    } catch (D) {
      Y(D instanceof Error ? D.message : "Failed to save agent")
    }
  }, [G, B, J]);
  return E8A.default.createElement(EG9, {
    tools: A,
    existingAgents: Q,
    onSave: X,
    onSaveAndEdit: I,
    error: Z
  })
}
// @from(Ln 428952, Col 4)
E8A
// @from(Ln 428953, Col 4)
CG9 = w(() => {
  Z3();
  QM();
  zG9();
  Z$A();
  _S();
  Kp();
  Z0();
  hB();
  E8A = c(QA(), 1)
})
// @from(Ln 428965, Col 0)
function UG9({
  tools: A,
  existingAgents: Q,
  onComplete: B,
  onCancel: G
}) {
  return XuA.default.createElement(VT0, {
    steps: [i79, a79, t79, () => XuA.default.createElement(QG9, {
      existingAgents: Q
    }), GG9, YG9, () => XuA.default.createElement(IG9, {
      tools: A
    }), WG9, FG9, () => XuA.default.createElement($G9, {
      tools: A,
      existingAgents: Q,
      onComplete: B
    })],
    initialData: {},
    onComplete: () => {},
    onCancel: G,
    title: "Create new agent",
    showStepCounter: !1
  })
}
// @from(Ln 428988, Col 4)
XuA
// @from(Ln 428989, Col 4)
qG9 = w(() => {
  QM();
  n79();
  o79();
  e79();
  BG9();
  ZG9();
  JG9();
  DG9();
  KG9();
  HG9();
  CG9();
  XuA = c(QA(), 1)
})
// @from(Ln 429004, Col 0)
function NG9({
  agent: A,
  tools: Q,
  onSaved: B,
  onBack: G
}) {
  let [, Z] = a0(), [Y, J] = Sj.useState("menu"), [X, I] = Sj.useState(0), [D, W] = Sj.useState(null), [K, V] = Sj.useState(A.color), F = Sj.useCallback(async () => {
    try {
      let L = gz1(A);
      await tf(L), B(`Opened ${A.agentType} in editor. If you made edits, restart to load the latest version.`)
    } catch (L) {
      W(L instanceof Error ? L.message : "Failed to open editor")
    }
  }, [A, B]), H = Sj.useCallback(async (L = {}) => {
    let {
      tools: M,
      color: _,
      model: j
    } = L, x = _ ?? K, b = M !== void 0, S = j !== void 0, u = x !== A.color;
    if (!b && !S && !u) return !1;
    try {
      if (!R52(A) && !qY1(A)) return !1;
      if (await m79(A, A.whenToUse, M ?? A.tools, A.getSystemPrompt(), x, j ?? A.model), u && x) vVA(A.agentType, x);
      return Z((f) => {
        let AA = f.agentDefinitions.allAgents.map((n) => n.agentType === A.agentType ? {
          ...n,
          tools: M ?? n.tools,
          color: x,
          model: j ?? n.model
        } : n);
        return {
          ...f,
          agentDefinitions: {
            ...f.agentDefinitions,
            activeAgents: mb(AA),
            allAgents: AA
          }
        }
      }), B(`Updated agent: ${I1.bold(A.agentType)}`), !0
    } catch (f) {
      return W(f instanceof Error ? f.message : "Failed to save agent"), !1
    }
  }, [A, K, B, Z]), E = Sj.useMemo(() => [{
    label: "Open in editor",
    action: F
  }, {
    label: "Edit tools",
    action: () => J("edit-tools")
  }, {
    label: "Edit model",
    action: () => J("edit-model")
  }, {
    label: "Edit color",
    action: () => J("edit-color")
  }], [F]), z = Sj.useCallback(() => {
    if (W(null), Y === "menu") G();
    else J("menu")
  }, [Y, G]), $ = Sj.useCallback((L) => {
    if (L.upArrow) I((M) => Math.max(0, M - 1));
    else if (L.downArrow) I((M) => Math.min(E.length - 1, M + 1));
    else if (L.return) {
      let M = E[X];
      if (M) M.action()
    }
  }, [E, X]);
  J0((L, M) => {
    if (M.escape) {
      z();
      return
    }
    if (Y === "menu") $(M)
  });
  let O = () => UV.createElement(T, {
    flexDirection: "column"
  }, UV.createElement(C, {
    dimColor: !0
  }, "Source: ", Y$A(A.source)), UV.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, E.map((L, M) => UV.createElement(C, {
    key: L.label,
    color: M === X ? "suggestion" : void 0
  }, M === X ? `${tA.pointer} ` : "  ", L.label))), D && UV.createElement(T, {
    marginTop: 1
  }, UV.createElement(C, {
    color: "error"
  }, D)));
  switch (Y) {
    case "menu":
      return O();
    case "edit-tools":
      return UV.createElement(mz1, {
        tools: Q,
        initialTools: A.tools,
        onComplete: async (L) => {
          J("menu"), await H({
            tools: L
          })
        }
      });
    case "edit-color":
      return UV.createElement(cz1, {
        agentName: A.agentType,
        currentColor: K || A.color || "automatic",
        onConfirm: async (L) => {
          V(L), J("menu"), await H({
            color: L
          })
        }
      });
    case "edit-model":
      return UV.createElement(dz1, {
        initialModel: A.model,
        onComplete: async (L) => {
          J("menu"), await H({
            model: L
          })
        }
      });
    default:
      return null
  }
}
// @from(Ln 429127, Col 4)
UV
// @from(Ln 429127, Col 8)
Sj
// @from(Ln 429128, Col 4)
wG9 = w(() => {
  fA();
  Z3();
  _S();
  UT0();
  NT0();
  qT0();
  Z$A();
  Kp();
  EO();
  B2();
  uz1();
  hB();
  UV = c(QA(), 1), Sj = c(QA(), 1)
})
// @from(Ln 429144, Col 0)
function LG9({
  agent: A,
  tools: Q,
  onBack: B
}) {
  let G = ur(A, Q, !1),
    Z = u79(A),
    Y = yVA(A.agentType);
  J0((X, I) => {
    if (I.escape || I.return) B()
  });

  function J() {
    if (G.hasWildcard) return L9.createElement(C, null, "All tools");
    if (!A.tools || A.tools.length === 0) return L9.createElement(C, null, "None");
    return L9.createElement(L9.Fragment, null, G.validTools.length > 0 && L9.createElement(C, null, G.validTools.join(", ")), G.invalidTools.length > 0 && L9.createElement(C, {
      color: "warning"
    }, tA.warning, " Unrecognized:", " ", G.invalidTools.join(", ")))
  }
  return L9.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, L9.createElement(C, {
    dimColor: !0
  }, Z), L9.createElement(T, {
    flexDirection: "column"
  }, L9.createElement(C, null, L9.createElement(C, {
    bold: !0
  }, "Description"), " (tells Claude when to use this agent):"), L9.createElement(T, {
    marginLeft: 2
  }, L9.createElement(C, null, A.whenToUse))), L9.createElement(T, null, L9.createElement(C, null, L9.createElement(C, {
    bold: !0
  }, "Tools"), ":", " "), J()), L9.createElement(C, null, L9.createElement(C, {
    bold: !0
  }, "Model"), ": ", JA1(A.model)), Y && L9.createElement(T, null, L9.createElement(C, null, L9.createElement(C, {
    bold: !0
  }, "Color"), ":", " ", L9.createElement(C, {
    backgroundColor: Y,
    color: "inverseText"
  }, " ", A.agentType, " "))), !p_(A) && L9.createElement(L9.Fragment, null, L9.createElement(T, null, L9.createElement(C, null, L9.createElement(C, {
    bold: !0
  }, "System prompt"), ":")), L9.createElement(T, {
    marginLeft: 2,
    marginRight: 2
  }, L9.createElement(JV, null, A.getSystemPrompt()))))
}
// @from(Ln 429190, Col 4)
L9
// @from(Ln 429191, Col 4)
OG9 = w(() => {
  fA();
  B2();
  _S();
  L4A();
  pb();
  Z$A();
  EO();
  l2();
  L9 = c(QA(), 1)
})
// @from(Ln 429203, Col 0)
function X$A({
  instructions: A = "Press ↑↓ to navigate · Enter to select · Esc to go back"
}) {
  let Q = MQ();
  return IuA.createElement(T, {
    marginLeft: 3
  }, IuA.createElement(C, {
    dimColor: !0
  }, Q.pending ? `Press ${Q.keyName} again to exit` : A))
}
// @from(Ln 429213, Col 4)
IuA
// @from(Ln 429214, Col 4)
MG9 = w(() => {
  fA();
  E9();
  IuA = c(QA(), 1)
})
// @from(Ln 429220, Col 0)
function pz1(A, Q, B) {
  return RG9.useMemo(() => {
    if (jJ()) return A;
    let G = ubA(Q, B);
    return Wi([...A, ...G], "name")
  }, [A, Q, B])
}
// @from(Ln 429227, Col 4)
RG9
// @from(Ln 429228, Col 4)
wT0 = w(() => {
  EUA();
  $F();
  az();
  RG9 = c(QA(), 1)
})
// @from(Ln 429235, Col 0)
function _G9({
  tools: A,
  onExit: Q
}) {
  let [B, G] = Te.useState({
    mode: "list-agents",
    source: "all"
  }), [Z, Y] = a0(), {
    allAgents: J,
    activeAgents: X
  } = Z.agentDefinitions, [I, D] = Te.useState([]), W = pz1(A, Z.mcp.tools, Z.toolPermissionContext);
  MQ();
  let K = Te.useMemo(() => ({
    "built-in": J.filter((H) => H.source === "built-in"),
    userSettings: J.filter((H) => H.source === "userSettings"),
    projectSettings: J.filter((H) => H.source === "projectSettings"),
    policySettings: J.filter((H) => H.source === "policySettings"),
    localSettings: J.filter((H) => H.source === "localSettings"),
    flagSettings: J.filter((H) => H.source === "flagSettings"),
    plugin: J.filter((H) => H.source === "plugin"),
    all: J
  }), [J]);
  J0((H, E) => {
    if (!E.escape) return;
    let z = I.length > 0 ? `Agent changes:
${I.join(`
`)}` : void 0;
    switch (B.mode) {
      case "list-agents":
        Q(z ?? "Agents dialog dismissed", {
          display: I.length === 0 ? "system" : void 0
        });
        break;
      case "create-agent":
        return;
      case "view-agent":
        return;
      default:
        if ("previousMode" in B) G(B.previousMode)
    }
  });
  let V = Te.useCallback((H) => {
      D((E) => [...E, H]), G({
        mode: "list-agents",
        source: "all"
      })
    }, []),
    F = Te.useCallback(async (H) => {
      try {
        await d79(H), Y((E) => {
          let z = E.agentDefinitions.allAgents.filter(($) => !($.agentType === H.agentType && $.source === H.source));
          return {
            ...E,
            agentDefinitions: {
              ...E.agentDefinitions,
              allAgents: z,
              activeAgents: mb(z)
            }
          }
        }), D((E) => [...E, `Deleted agent: ${I1.bold(H.agentType)}`]), G({
          mode: "list-agents",
          source: "all"
        })
      } catch (E) {
        e(E instanceof Error ? E : Error("Failed to delete agent"))
      }
    }, []);
  switch (B.mode) {
    case "list-agents": {
      let H = B.source === "all" ? [...K["built-in"], ...K.userSettings, ...K.projectSettings, ...K.policySettings, ...K.flagSettings, ...K.plugin] : K[B.source],
        E = new Map;
      X.forEach(($) => E.set($.agentType, $));
      let z = H.map(($) => {
        let O = E.get($.agentType),
          L = O && O.source !== $.source ? O.source : void 0;
        return {
          ...$,
          overriddenBy: L
        }
      });
      return d2.createElement(d2.Fragment, null, d2.createElement(c79, {
        source: B.source,
        agents: z,
        onBack: () => {
          let $ = I.length > 0 ? `Agent changes:
${I.join(`
`)}` : void 0;
          Q($ ?? "Agents dialog dismissed", {
            display: I.length === 0 ? "system" : void 0
          })
        },
        onSelect: ($) => G({
          mode: "agent-menu",
          agent: $,
          previousMode: B
        }),
        onCreateNew: () => G({
          mode: "create-agent"
        }),
        changes: I
      }), d2.createElement(X$A, null))
    }
    case "create-agent":
      return d2.createElement(UG9, {
        tools: W,
        existingAgents: X,
        onComplete: V,
        onCancel: () => G({
          mode: "list-agents",
          source: "all"
        })
      });
    case "agent-menu": {
      let E = J.find((L) => L.agentType === B.agent.agentType && L.source === B.agent.source) || B.agent,
        z = E.source === "built-in",
        $ = [{
          label: "View agent",
          value: "view"
        }, ...!z ? [{
          label: "Edit agent",
          value: "edit"
        }, {
          label: "Delete agent",
          value: "delete"
        }] : [], {
          label: "Back",
          value: "back"
        }],
        O = (L) => {
          switch (L) {
            case "view":
              G({
                mode: "view-agent",
                agent: E,
                previousMode: B.previousMode
              });
              break;
            case "edit":
              G({
                mode: "edit-agent",
                agent: E,
                previousMode: B
              });
              break;
            case "delete":
              G({
                mode: "delete-confirm",
                agent: E,
                previousMode: B
              });
              break;
            case "back":
              G(B.previousMode);
              break
          }
        };
      return d2.createElement(d2.Fragment, null, d2.createElement(Me, {
        title: B.agent.agentType
      }, d2.createElement(T, {
        flexDirection: "column",
        marginTop: 1
      }, d2.createElement(k0, {
        options: $,
        onChange: O,
        onCancel: () => G(B.previousMode)
      }), I.length > 0 && d2.createElement(T, {
        marginTop: 1
      }, d2.createElement(C, {
        dimColor: !0
      }, I[I.length - 1])))), d2.createElement(X$A, null))
    }
    case "view-agent": {
      let E = J.find((z) => z.agentType === B.agent.agentType && z.source === B.agent.source) || B.agent;
      return d2.createElement(d2.Fragment, null, d2.createElement(Me, {
        title: E.agentType
      }, d2.createElement(LG9, {
        agent: E,
        tools: W,
        allAgents: J,
        onBack: () => G({
          mode: "agent-menu",
          agent: E,
          previousMode: B.previousMode
        })
      })), d2.createElement(X$A, {
        instructions: "Press Enter or Esc to go back"
      }))
    }
    case "delete-confirm": {
      let H = [{
        label: "Yes, delete",
        value: "yes"
      }, {
        label: "No, cancel",
        value: "no"
      }];
      return d2.createElement(d2.Fragment, null, d2.createElement(Me, {
        title: "Delete agent",
        titleColor: "error",
        borderColor: "error"
      }, d2.createElement(C, null, "Are you sure you want to delete the agent", " ", d2.createElement(C, {
        bold: !0
      }, B.agent.agentType), "?"), d2.createElement(T, {
        marginTop: 1
      }, d2.createElement(C, {
        dimColor: !0
      }, "Source: ", B.agent.source)), d2.createElement(T, {
        marginTop: 1
      }, d2.createElement(k0, {
        options: H,
        onChange: (E) => {
          if (E === "yes") F(B.agent);
          else if ("previousMode" in B) G(B.previousMode)
        },
        onCancel: () => {
          if ("previousMode" in B) G(B.previousMode)
        }
      }))), d2.createElement(X$A, {
        instructions: "Press ↑↓ to navigate, Enter to select, Esc to cancel"
      }))
    }
    case "edit-agent": {
      let E = J.find((z) => z.agentType === B.agent.agentType && z.source === B.agent.source) || B.agent;
      return d2.createElement(d2.Fragment, null, d2.createElement(Me, {
        title: `Edit agent: ${E.agentType}`
      }, d2.createElement(NG9, {
        agent: E,
        tools: W,
        onSaved: (z) => {
          V(z), G(B.previousMode)
        },
        onBack: () => G(B.previousMode)
      })), d2.createElement(X$A, null))
    }
    default:
      return null
  }
}
// @from(Ln 429473, Col 4)
d2
// @from(Ln 429473, Col 8)
Te
// @from(Ln 429474, Col 4)
jG9 = w(() => {
  fA();
  fA();
  Z3();
  E9();
  _S();
  Z$A();
  W8();
  p79();
  qG9();
  wG9();
  OG9();
  v1();
  MG9();
  WT0();
  hB();
  wT0();
  d2 = c(QA(), 1), Te = c(QA(), 1)
})
// @from(Ln 429493, Col 4)
LT0
// @from(Ln 429493, Col 9)
gF7
// @from(Ln 429493, Col 14)
TG9
// @from(Ln 429494, Col 4)
PG9 = w(() => {
  jG9();
  az();
  LT0 = c(QA(), 1), gF7 = {
    type: "local-jsx",
    name: "agents",
    description: "Manage agent configurations",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      let G = (await Q.getAppState()).toolPermissionContext,
        Z = F$(G);
      return LT0.createElement(_G9, {
        tools: Z,
        onExit: A
      })
    },
    userFacingName() {
      return "agents"
    }
  }, TG9 = gF7
})
// @from(Ln 429516, Col 4)
OT0
// @from(Ln 429516, Col 9)
uF7
// @from(Ln 429516, Col 14)
SG9
// @from(Ln 429517, Col 4)
xG9 = w(() => {
  O_0();
  OT0 = c(QA(), 1), uF7 = {
    type: "local-jsx",
    name: "plugin",
    aliases: ["plugins", "marketplace"],
    description: "Manage Claude Code plugins",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      return OT0.createElement(F49, {
        onComplete: A,
        args: B
      })
    },
    userFacingName() {
      return "plugin"
    }
  }, SG9 = uF7
})
// @from(Ln 429537, Col 4)
mF7
// @from(Ln 429537, Col 9)
yG9
// @from(Ln 429538, Col 4)
vG9 = w(() => {
  JZ();
  mF7 = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",
    isEnabled: () => !0,
    type: "local",
    isHidden: !1,
    supportsNonInteractive: !1,
    async call(A, Q) {
      if (T9("rewind"), Q.openMessageSelector) Q.openMessageSelector();
      return {
        type: "skip"
      }
    }
  }, yG9 = mF7
})
// @from(Ln 429558, Col 4)
kG9 = w(() => {
  C0();
  t4();
  oZ();
  Q2();
  v1();
  T1();
  A0()
})
// @from(Ln 429567, Col 4)
bG9 = w(() => {
  kG9()
})
// @from(Ln 429570, Col 4)
dF7
// @from(Ln 429570, Col 9)
cF7
// @from(Ln 429571, Col 4)
fG9 = w(() => {
  fA();
  u8();
  onA();
  dF7 = c(QA(), 1), cF7 = c(QA(), 1)
})
// @from(Ln 429578, Col 0)
function pF7(A, Q) {
  let B = 0,
    G = Q === null || Q === void 0;
  for (let Z of A) {
    if (!G) {
      if (Z.uuid === Q) G = !0;
      continue
    }
    if (Z.type === "assistant") {
      let J = Z.message.content;
      if (Array.isArray(J)) B += J.filter((X) => X.type === "tool_use").length
    }
  }
  return B
}
// @from(Ln 429594, Col 0)
function lF7(A) {
  let B = [...A].reverse().find((I) => I.type === "assistant")?.uuid;
  if (B && B !== gG9) {
    let I = sH(A);
    if (I > 0) Hs2(I);
    let D = oeB(A);
    if (D > 0) Es2(D);
    gG9 = B
  }
  if (!$s2()) {
    if (!Us2()) return !1;
    Cs2()
  }
  let G = qs2(),
    Y = pF7(A, hG9) >= Ns2(),
    J = DuA(A);
  if (G && Y || G && !J) {
    let I = A[A.length - 1];
    if (I?.uuid) hG9 = I.uuid;
    return !0
  }
  return !1
}
// @from(Ln 429617, Col 0)
async function iF7(A) {
  let Q = vA(),
    B = lz1();
  if (!Q.existsSync(B)) Q.mkdirSync(B, {
    mode: 448
  });
  let G = VhA();
  if (!Q.existsSync(G)) {
    let X = await vL0();
    bB(G, X, {
      encoding: "utf-8",
      flush: !1,
      mode: 384
    })
  }
  let Z = await v5.call({
      file_path: G
    }, A),
    Y = "",
    J = Z.data;
  if (J.type === "text") Y = J.file.content;
  return {
    memoryPath: G,
    currentMemory: Y
  }
}
// @from(Ln 429643, Col 0)
async function uG9() {
  if (!nc()) return;
  if (await WA1("tengu_session_memory")) {
    let A = await XP("tengu_sm_config", {}),
      Q = {
        minimumMessageTokensToInit: A.minimumMessageTokensToInit && A.minimumMessageTokensToInit > 0 ? A.minimumMessageTokensToInit : WhA.minimumMessageTokensToInit,
        minimumTokensBetweenUpdate: A.minimumTokensBetweenUpdate && A.minimumTokensBetweenUpdate > 0 ? A.minimumTokensBetweenUpdate : WhA.minimumTokensBetweenUpdate,
        toolCallsBetweenUpdates: A.toolCallsBetweenUpdates && A.toolCallsBetweenUpdates > 0 ? A.toolCallsBetweenUpdates : WhA.toolCallsBetweenUpdates
      };
    Vs2(Q), RH1(nF7)
  }
}
// @from(Ln 429656, Col 0)
function aF7(A) {
  return async (Q, B) => {
    if (Q.name === I8 && typeof B === "object" && B !== null && "file_path" in B) {
      if (B.file_path === A) return {
        behavior: "allow",
        updatedInput: B
      }
    }
    return {
      behavior: "deny",
      message: `only ${I8} on ${A} is allowed`,
      decisionReason: {
        type: "other",
        reason: `only ${I8} on ${A} is allowed`
      }
    }
  }
}
// @from(Ln 429675, Col 0)
function oF7(A) {
  if (!DuA(A)) {
    let Q = A[A.length - 1];
    if (Q?.uuid) oEA(Q.uuid)
  }
}
// @from(Ln 429681, Col 4)
hG9
// @from(Ln 429681, Col 9)
gG9
// @from(Ln 429681, Col 14)
nF7
// @from(Ln 429682, Col 4)
MT0 = w(() => {
  AY();
  DQ();
  A0();
  T_();
  kL0();
  $c();
  yhA();
  BI();
  w6();
  Z0();
  nt();
  tQ();
  KhA();
  uC();
  wc();
  OS();
  nF7 = ev(async function (A) {
    let {
      messages: Q,
      toolUseContext: B,
      querySource: G
    } = A;
    if (G !== "repl_main_thread") return;
    if (!lF7(Q)) return;
    Is2();
    let Z = lkA(B),
      {
        memoryPath: Y,
        currentMemory: J
      } = await iF7(Z),
      X = await Ms2(J, Y);
    await sc({
      promptMessages: [H0({
        content: X
      })],
      cacheSafeParams: T3A(A),
      canUseTool: aF7(Y),
      querySource: "session_memory",
      forkLabel: "session_memory",
      overrides: {
        readFileState: Z.readFileState
      }
    });
    let I = Q[Q.length - 1],
      D = I ? Jd(I) : void 0,
      W = Fs2();
    l("tengu_session_memory_extraction", {
      input_tokens: D?.input_tokens,
      output_tokens: D?.output_tokens,
      cache_read_input_tokens: D?.cache_read_input_tokens ?? void 0,
      cache_creation_input_tokens: D?.cache_creation_input_tokens ?? void 0,
      config_min_message_tokens_to_init: W.minimumMessageTokensToInit,
      config_min_tokens_between_update: W.minimumTokensBetweenUpdate,
      config_tool_calls_between_updates: W.toolCallsBetweenUpdates
    }), zs2(), oF7(Q), Ds2()
  })
})
// @from(Ln 429740, Col 4)
mG9 = w(() => {
  MT0();
  AY();
  iD0()
})
// @from(Ln 429745, Col 4)
rF7
// @from(Ln 429746, Col 4)
dG9 = w(() => {
  JX();
  fA();
  IS();
  Q2();
  T1();
  qz();
  v1();
  u8();
  PR0();
  lD();
  C0();
  A0();
  rF7 = c(QA(), 1)
})
// @from(Ln 429761, Col 4)
cG9 = () => {}
// @from(Ln 429763, Col 0)
function pG9() {
  if (!XB.isSandboxingEnabled()) return _6.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, _6.createElement(C, {
    color: "subtle"
  }, "Sandbox is not enabled"));
  let Q = XB.getFsReadConfig(),
    B = XB.getFsWriteConfig(),
    G = XB.getNetworkRestrictionConfig(),
    Z = XB.getAllowUnixSockets(),
    Y = XB.getExcludedCommands(),
    J = XB.getLinuxGlobPatternWarnings();
  return _6.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, _6.createElement(T, {
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Excluded Commands:"), _6.createElement(C, {
    dimColor: !0
  }, Y.length > 0 ? Y.join(", ") : "None")), Q.denyOnly.length > 0 && _6.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Filesystem Read Restrictions:"), _6.createElement(C, {
    dimColor: !0
  }, "Denied: ", Q.denyOnly.join(", "))), B.allowOnly.length > 0 && _6.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Filesystem Write Restrictions:"), _6.createElement(C, {
    dimColor: !0
  }, "Allowed: ", B.allowOnly.join(", ")), B.denyWithinAllow.length > 0 && _6.createElement(C, {
    dimColor: !0
  }, "Denied within allowed: ", B.denyWithinAllow.join(", "))), (G.allowedHosts && G.allowedHosts.length > 0 || G.deniedHosts && G.deniedHosts.length > 0) && _6.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Network Restrictions:"), G.allowedHosts && G.allowedHosts.length > 0 && _6.createElement(C, {
    dimColor: !0
  }, "Allowed: ", G.allowedHosts.join(", ")), G.deniedHosts && G.deniedHosts.length > 0 && _6.createElement(C, {
    dimColor: !0
  }, "Denied: ", G.deniedHosts.join(", "))), Z && Z.length > 0 && _6.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Allowed Unix Sockets:"), _6.createElement(C, {
    dimColor: !0
  }, Z.join(", "))), J.length > 0 && _6.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, _6.createElement(C, {
    bold: !0,
    color: "warning"
  }, "⚠ Warning: Glob patterns not fully supported on Linux"), _6.createElement(C, {
    dimColor: !0
  }, "The following patterns will be ignored:", " ", J.slice(0, 3).join(", "), J.length > 3 && ` (${J.length-3} more)`)))
}
// @from(Ln 429832, Col 4)
_6
// @from(Ln 429833, Col 4)
lG9 = w(() => {
  fA();
  NJ();
  _6 = c(QA(), 1)
})
// @from(Ln 429839, Col 0)
function iG9({
  onComplete: A
}) {
  let [Q] = oB(), B = XB.isSandboxingEnabled(), G = XB.areUnsandboxedCommandsAllowed(), Z = XB.areSandboxSettingsLockedByPolicy(), Y = G ? "open" : "closed", J = sQ("success", Q)("(current)"), X = [{
    label: Y === "open" ? `Allow unsandboxed fallback ${J}` : "Allow unsandboxed fallback",
    value: "open"
  }, {
    label: Y === "closed" ? `Strict sandbox mode ${J}` : "Strict sandbox mode",
    value: "closed"
  }];
  async function I(D) {
    let W = D;
    await XB.setSandboxSettings({
      allowUnsandboxedCommands: W === "open"
    }), A(W === "open" ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option")
  }
  if (J0((D, W) => {
      if (W.escape) A()
    }), !B) return sF.default.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, sF.default.createElement(C, {
    color: "subtle"
  }, "Sandbox is not enabled. Enable sandbox to configure override settings."));
  if (Z) return sF.default.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, sF.default.createElement(C, {
    color: "subtle"
  }, "Override settings are managed by a higher-priority configuration and cannot be changed locally."), sF.default.createElement(T, {
    marginTop: 1
  }, sF.default.createElement(C, {
    dimColor: !0
  }, "Current setting:", " ", Y === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback")));
  return sF.default.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, sF.default.createElement(T, {
    marginBottom: 1
  }, sF.default.createElement(C, {
    bold: !0
  }, "Configure Overrides:")), sF.default.createElement(k0, {
    options: X,
    onChange: I,
    onCancel: () => A()
  }), sF.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, sF.default.createElement(C, {
    dimColor: !0
  }, sF.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Allow unsandboxed fallback:"), " ", "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."), sF.default.createElement(C, {
    dimColor: !0
  }, sF.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Strict sandbox mode:"), " ", "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."), sF.default.createElement(C, {
    dimColor: !0
  }, "Learn more:", " ", sF.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing"
  }, "code.claude.com/docs/en/sandboxing#configure-sandboxing"))))
}
// @from(Ln 429904, Col 4)
sF
// @from(Ln 429905, Col 4)
nG9 = w(() => {
  fA();
  W8();
  NJ();
  fA();
  sF = c(QA(), 1)
})
// @from(Ln 429913, Col 0)
function aG9({
  onComplete: A
}) {
  let [Q] = oB(), B = XB.isSandboxingEnabled(), G = XB.isAutoAllowBashIfSandboxedEnabled(), Y = (() => {
    if (!B) return "disabled";
    if (G) return "auto-allow";
    return "regular"
  })(), J = sQ("success", Q)("(current)"), X = [{
    label: Y === "auto-allow" ? `Sandbox BashTool, with auto-allow ${J}` : "Sandbox BashTool, with auto-allow",
    value: "auto-allow"
  }, {
    label: Y === "regular" ? `Sandbox BashTool, with regular permissions ${J}` : "Sandbox BashTool, with regular permissions",
    value: "regular"
  }, {
    label: Y === "disabled" ? `No Sandbox ${J}` : "No Sandbox",
    value: "disabled"
  }];
  async function I(D) {
    switch (D) {
      case "auto-allow":
        await XB.setSandboxSettings({
          enabled: !0,
          autoAllowBashIfSandboxed: !0
        }), A("✓ Sandbox enabled with auto-allow for bash commands");
        break;
      case "regular":
        await XB.setSandboxSettings({
          enabled: !0,
          autoAllowBashIfSandboxed: !1
        }), A("✓ Sandbox enabled with regular bash permissions");
        break;
      case "disabled":
        await XB.setSandboxSettings({
          enabled: !1,
          autoAllowBashIfSandboxed: !1
        }), A("○ Sandbox disabled");
        break
    }
  }
  return J0((D, W) => {
    if (W.escape) A()
  }), qV.default.createElement(T, {
    flexDirection: "column"
  }, qV.default.createElement(K8, {
    dividerColor: "permission",
    dividerDimColor: !0
  }), qV.default.createElement(T, {
    marginX: 1
  }, qV.default.createElement(Nj, {
    title: "Sandbox:",
    color: "permission",
    defaultTab: "Mode"
  }, qV.default.createElement(kX, {
    key: "mode",
    title: "Mode"
  }, qV.default.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, qV.default.createElement(T, {
    marginBottom: 1
  }, qV.default.createElement(C, {
    bold: !0
  }, "Configure Mode:")), qV.default.createElement(k0, {
    options: X,
    onChange: I,
    onCancel: () => A()
  }), qV.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, qV.default.createElement(C, {
    dimColor: !0
  }, qV.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Auto-allow mode:"), " ", "Commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."), qV.default.createElement(C, {
    dimColor: !0
  }, "Learn more:", " ", qV.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/sandboxing"
  }, "code.claude.com/docs/en/sandboxing"))))), qV.default.createElement(kX, {
    key: "overrides",
    title: "Overrides"
  }, qV.default.createElement(iG9, {
    onComplete: A
  })), qV.default.createElement(kX, {
    key: "config",
    title: "Config"
  }, qV.default.createElement(pG9, null)))))
}
// @from(Ln 430002, Col 4)
qV
// @from(Ln 430003, Col 4)
oG9 = w(() => {
  fA();
  W8();
  NJ();
  v3A();
  lD();
  fA();
  lG9();
  nG9();
  qV = c(QA(), 1)
})
// @from(Ln 430015, Col 0)
async function sF7(A, Q, B) {
  let Z = jQ().theme || "light";
  if (!XB.isSupportedPlatform($Q())) {
    let J = sQ("error", Z)("Error: Sandboxing is currently only supported on macOS and Linux");
    return A(J), null
  }
  if (!XB.checkDependencies()) {
    let X = $Q() === "linux" ? "Error: Sandbox requires socat and bubblewrap. Please install these packages." : "Error: Sandbox dependencies are not available on this system.",
      I = sQ("error", Z)(X);
    return A(I), null
  }
  if (XB.areSandboxSettingsLockedByPolicy()) {
    let J = sQ("error", Z)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
    return A(J), null
  }
  let Y = B?.trim() || "";
  if (!Y) return sG9.default.createElement(aG9, {
    onComplete: A
  });
  if (Y) {
    let X = Y.split(" ")[0];
    if (X === "exclude") {
      let I = Y.slice(8).trim();
      if (!I) {
        let F = sQ("error", Z)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
        return A(F), null
      }
      let D = I.replace(/^["']|["']$/g, "");
      kEB(D);
      let W = bH("localSettings"),
        K = W ? rG9.relative(_y(), W) : ".claude/settings.local.json",
        V = sQ("success", Z)(`Added "${D}" to excluded commands in ${K}`);
      return A(V), null
    } else {
      let I = sQ("error", Z)(`Error: Unknown subcommand "${X}". Available subcommand: exclude`);
      return A(I), null
    }
  }
  return null
}
// @from(Ln 430055, Col 4)
sG9
// @from(Ln 430055, Col 9)
tF7
// @from(Ln 430055, Col 14)
tG9
// @from(Ln 430056, Col 4)
eG9 = w(() => {
  NJ();
  fA();
  GB();
  NJ();
  GB();
  C0();
  oG9();
  c3();
  sG9 = c(QA(), 1);
  tF7 = {
    name: "sandbox",
    get description() {
      let A = XB.isSandboxingEnabled(),
        Q = XB.isAutoAllowBashIfSandboxedEnabled(),
        B = XB.areUnsandboxedCommandsAllowed(),
        G = XB.areSandboxSettingsLockedByPolicy(),
        Z = A ? "✓" : "○",
        Y = "sandbox disabled";
      if (A) Y = Q ? "sandbox enabled (auto-allow)" : "sandbox enabled", Y += B ? ", fallback allowed" : "";
      if (G) Y += " (managed)";
      return `${Z} ${Y} (⏎ to configure)`
    },
    argumentHint: 'exclude "command pattern"',
    isEnabled: () => !0,
    isHidden: !XB.isSupportedPlatform($Q()),
    type: "local-jsx",
    userFacingName: () => "sandbox",
    call: sF7
  }, tG9 = tF7
})
// @from(Ln 430087, Col 4)
Pe