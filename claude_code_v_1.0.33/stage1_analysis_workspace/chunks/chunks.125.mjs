
// @from(Start 11812743, End 11814027)
K70 = L(() => {
  cE();
  V0();
  g1();
  cE();
  $9A();
  _b2 = s1(async () => {
    let A = await OWA(),
      {
        limitedCommands: Q
      } = Sb2(A),
      B = Q.map((Z) => Z.userFacingName()).join(", ");
    return g(`Skills and commands included in Skill tool: ${B}`), `Execute a skill within the main conversation

<skills_instructions>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke skills using this tool with the skill name only (no arguments)
- When you invoke a skill, you will see <command-message>The "{name}" skill is loading</command-message>
- The skill's prompt will expand and provide detailed instructions on how to complete the task
- Examples:
  - \`skill: "pdf"\` - invoke the pdf skill
  - \`skill: "xlsx"\` - invoke the xlsx skill
  - \`skill: "ms-office-suite:pdf"\` - invoke using fully qualified name

Important:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
</skills_instructions>

<available_skills>
${Pi5(Q,A.length)}
</available_skills>
`
  })
})
// @from(Start 11814033, End 11814045)
kq = "Skill"
// @from(Start 11814047, End 11814155)
async function WTA(A, Q) {
  let B = await bNA(A, Q);
  if (B !== null) return B;
  return await ReB(A, Q)
}
// @from(Start 11814156, End 11814374)
async function a51(A, Q, B, G) {
  let Z = await Promise.all(A.map((I) => r51(I, {
    getToolPermissionContext: Q,
    tools: A,
    agents: B?.activeAgents ?? [],
    model: G
  })));
  return await WTA([], Z) ?? 0
}
// @from(Start 11814375, End 11814674)
async function ji5(A, Q) {
  let [B, G] = await Promise.all([Tn(A, Q), iD()]), Z = [...B, ...Object.values(G)];
  if (Z.length < 1) return 0;
  return (await Promise.all(Z.filter((Y) => Y.length > 0).map((Y) => WTA([{
    role: "user",
    content: Y
  }], [])))).reduce((Y, J) => Y + (J || 0), 0)
}
// @from(Start 11814675, End 11815211)
async function Si5() {
  let A = gV(),
    Q = [],
    B = 0;
  if (A.length < 1) return {
    memoryFileDetails: [],
    claudeMdTokens: 0
  };
  let G = await Promise.all(A.map(async (Z) => {
    let I = await WTA([{
      role: "user",
      content: Z.content
    }], []);
    return {
      file: Z,
      tokens: I || 0
    }
  }));
  for (let {
      file: Z,
      tokens: I
    }
    of G) B += I, Q.push({
    path: Z.path,
    type: Z.type,
    tokens: I
  });
  return {
    claudeMdTokens: B,
    memoryFileDetails: Q
  }
}
// @from(Start 11815212, End 11815344)
async function _i5(A, Q, B, G) {
  let Z = A.filter((I) => !I.isMcp);
  if (Z.length < 1) return 0;
  return await a51(Z, Q, B, G)
}
// @from(Start 11815346, End 11815403)
function ki5(A) {
  return A.find((Q) => Q.name === kq)
}
// @from(Start 11815404, End 11815767)
async function yi5(A, Q, B) {
  let G = await kb2(),
    Z = ki5(A);
  if (!Z) return {
    slashCommandTokens: 0,
    commandInfo: {
      totalCommands: 0,
      includedCommands: 0
    }
  };
  return {
    slashCommandTokens: await a51([Z], Q, B),
    commandInfo: {
      totalCommands: G.totalCommands,
      includedCommands: G.includedCommands
    }
  }
}
// @from(Start 11815768, End 11816150)
async function XTA(A, Q, B, G) {
  let Z = A.filter((W) => W.isMcp),
    I = [],
    Y = await Promise.all(Z.map((W) => a51([W], Q, B, G))),
    J = Y.reduce((W, X) => W + (X || 0), 0);
  for (let [W, X] of Z.entries()) I.push({
    name: X.name,
    serverName: X.name.split("__")[1] || "unknown",
    tokens: Y[W]
  });
  return {
    mcpToolTokens: J,
    mcpToolDetails: I
  }
}
// @from(Start 11816151, End 11816273)
async function yb2(A, Q, B) {
  let G = A.filter((Z) => !Z.isMcp);
  if (G.length === 0) return 0;
  return a51(G, Q, B)
}
// @from(Start 11816274, End 11816746)
async function xi5(A) {
  let Q = A.activeAgents.filter((I) => I.source !== "built-in"),
    B = [],
    G = 0,
    Z = await Promise.all(Q.map((I) => WTA([{
      role: "user",
      content: [I.agentType, I.whenToUse].join(" ")
    }], [])));
  for (let [I, Y] of Q.entries()) {
    let J = Z[I] || 0;
    G += J || 0, B.push({
      agentType: Y.agentType,
      source: Y.source,
      tokens: J || 0
    })
  }
  return {
    agentTokens: G,
    agentDetails: B
  }
}
// @from(Start 11816747, End 11817304)
async function vi5(A) {
  let Q = await Si(A),
    B = {
      totalTokens: 0,
      toolCallTokens: 0,
      toolResultTokens: 0,
      attachmentTokens: 0,
      assistantMessageTokens: 0,
      userMessageTokens: 0,
      toolCallsByType: new Map,
      toolResultsByType: new Map,
      attachmentsByType: new Map
    },
    G = await WTA(WZ(Q.messages).map((Z) => {
      if (Z.type === "assistant") return {
        role: "assistant",
        content: Z.message.content
      };
      return Z.message
    }), []);
  return B.totalTokens = G ?? 0, B
}
// @from(Start 11817305, End 11820841)
async function xb2(A, Q, B, G, Z, I) {
  let Y = Pt({
      permissionMode: (await B()).mode,
      mainLoopModel: Q
    }),
    J = su(Y),
    [W, {
      claudeMdTokens: X,
      memoryFileDetails: V
    }, F, {
      mcpToolTokens: K,
      mcpToolDetails: D
    }, {
      agentTokens: H,
      agentDetails: C
    }, {
      slashCommandTokens: E,
      commandInfo: U
    }, q] = await Promise.all([ji5(G, Y), Si5(), _i5(G, B, Z, Y), XTA(G, B, Z, Y), xi5(Z), yi5(G, B, Z), vi5(A)]),
    w = 0,
    N = {
      totalSkills: 0,
      includedSkills: 0
    },
    R = q.totalTokens,
    T = b1A(),
    y = T ? TYA() - zQ0 : void 0,
    v = [];
  if (W > 0) v.push({
    name: "System prompt",
    tokens: W,
    color: "promptBorder"
  });
  if (F > 0) v.push({
    name: "System tools",
    tokens: F,
    color: "inactive"
  });
  if (K > 0) v.push({
    name: "MCP tools",
    tokens: K,
    color: "cyan_FOR_SUBAGENTS_ONLY"
  });
  if (H > 0) v.push({
    name: "Custom agents",
    tokens: H,
    color: "permission"
  });
  if (X > 0) v.push({
    name: "Memory files",
    tokens: X,
    color: "claude"
  });
  if (R !== null && R > 0) v.push({
    name: "Messages",
    tokens: R,
    color: "purple_FOR_SUBAGENTS_ONLY"
  });
  if (T && y) {
    let yA = J - y;
    v.push({
      name: D70,
      tokens: yA,
      color: "inactive"
    })
  }
  let x = v.reduce((yA, oA) => yA + oA.tokens, 0),
    p = Math.max(0, J - x);
  v.push({
    name: "Free space",
    tokens: p,
    color: "promptBorder"
  });
  let u = x,
    e = I && I < 80,
    l = J >= 1e6 ? e ? 5 : 20 : e ? 5 : 10,
    k = J >= 1e6 ? 10 : e ? 5 : 10,
    m = l * k,
    o = v.map((yA) => ({
      ...yA,
      squares: yA.name === "Free space" ? Math.round(yA.tokens / J * m) : Math.max(1, Math.round(yA.tokens / J * m)),
      percentageOfTotal: Math.round(yA.tokens / J * 100)
    }));

  function IA(yA) {
    let oA = [],
      X1 = yA.tokens / J * m,
      WA = Math.floor(X1),
      EA = X1 - WA;
    for (let MA = 0; MA < yA.squares; MA++) {
      let DA = 1;
      if (MA === WA && EA > 0) DA = EA;
      oA.push({
        color: yA.color,
        isFilled: !0,
        categoryName: yA.name,
        tokens: yA.tokens,
        percentage: yA.percentageOfTotal,
        squareFullness: DA
      })
    }
    return oA
  }
  let FA = [],
    zA = o.find((yA) => yA.name === D70),
    NA = o.filter((yA) => yA.name !== D70 && yA.name !== "Free space");
  for (let yA of NA) {
    let oA = IA(yA);
    for (let X1 of oA)
      if (FA.length < m) FA.push(X1)
  }
  let OA = zA ? zA.squares : 0,
    mA = v.find((yA) => yA.name === "Free space"),
    wA = m - OA;
  while (FA.length < wA) FA.push({
    color: "promptBorder",
    isFilled: !0,
    categoryName: "Free space",
    tokens: mA?.tokens || 0,
    percentage: mA ? Math.round(mA.tokens / J * 100) : 0,
    squareFullness: 1
  });
  if (zA) {
    let yA = IA(zA);
    for (let oA of yA)
      if (FA.length < m) FA.push(oA)
  }
  let qA = [];
  for (let yA = 0; yA < k; yA++) qA.push(FA.slice(yA * l, (yA + 1) * l));
  let KA;
  return {
    categories: v,
    totalTokens: u,
    maxTokens: J,
    rawMaxTokens: J,
    percentage: Math.round(u / J * 100),
    gridRows: qA,
    model: Y,
    memoryFiles: V,
    mcpTools: D,
    agents: C,
    slashCommands: E > 0 ? {
      totalCommands: U.totalCommands,
      includedCommands: U.includedCommands,
      tokens: E
    } : void 0,
    skills: void 0,
    autoCompactThreshold: y,
    isAutoCompactEnabled: T,
    messageBreakdown: KA
  }
}
// @from(Start 11820846, End 11820872)
D70 = "Autocompact buffer"
// @from(Start 11820878, End 11820986)
s51 = L(() => {
  Ty();
  xM();
  Pn();
  gE();
  y1A();
  cQ();
  th();
  t2();
  K70();
  v1A();
  g1()
})
// @from(Start 11820989, End 11821918)
function H70({
  count: A,
  countLabel: Q,
  secondaryCount: B,
  secondaryLabel: G,
  content: Z,
  verbose: I
}) {
  let Y = gJ.default.createElement(gJ.default.Fragment, null, "Found ", gJ.default.createElement($, {
      bold: !0
    }, A, " "), A === 0 || A > 1 ? Q : Q.slice(0, -1)),
    J = B !== void 0 && G ? gJ.default.createElement(gJ.default.Fragment, null, " ", "across ", gJ.default.createElement($, {
      bold: !0
    }, B, " "), B === 0 || B > 1 ? G : G.slice(0, -1)) : null;
  if (I) return gJ.default.createElement(S, {
    flexDirection: "column"
  }, gJ.default.createElement(S, {
    flexDirection: "row"
  }, gJ.default.createElement($, null, "  ⎿  ", Y, J)), gJ.default.createElement(S, {
    marginLeft: 5
  }, gJ.default.createElement($, null, Z)));
  return gJ.default.createElement(S0, {
    height: 1
  }, gJ.default.createElement($, null, Y, J, " ", A > 0 && gJ.default.createElement(Tl, null)))
}
// @from(Start 11821920, End 11822359)
function vb2({
  pattern: A,
  path: Q,
  glob: B,
  type: G,
  output_mode: Z = "files_with_matches",
  head_limit: I
}, {
  verbose: Y
}) {
  if (!A) return null;
  let J = [`pattern: "${A}"`];
  if (Q) J.push(`path: "${Y?Q:Q5(Q)}"`);
  if (B) J.push(`glob: "${B}"`);
  if (G) J.push(`type: "${G}"`);
  if (Z !== "files_with_matches") J.push(`output_mode: "${Z}"`);
  if (I !== void 0) J.push(`head_limit: ${I}`);
  return J.join(", ")
}
// @from(Start 11822361, End 11822423)
function bb2() {
  return gJ.default.createElement(k5, null)
}
// @from(Start 11822425, End 11822722)
function fb2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return gJ.default.createElement(S0, null, gJ.default.createElement($, {
    color: "error"
  }, "Error searching files"));
  return gJ.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 11822724, End 11822756)
function hb2() {
  return null
}
// @from(Start 11822758, End 11823401)
function gb2({
  mode: A = "files_with_matches",
  filenames: Q,
  numFiles: B,
  content: G,
  numLines: Z,
  numMatches: I
}, Y, {
  verbose: J
}) {
  if (A === "content") return gJ.default.createElement(H70, {
    count: Z ?? 0,
    countLabel: "lines",
    content: G,
    verbose: J
  });
  if (A === "count") return gJ.default.createElement(H70, {
    count: I ?? 0,
    countLabel: "matches",
    secondaryCount: B,
    secondaryLabel: "files",
    content: G,
    verbose: J
  });
  let W = Q.map((X) => X).join(`
`);
  return gJ.default.createElement(H70, {
    count: B,
    countLabel: "files",
    content: W,
    verbose: J
  })
}
// @from(Start 11823403, End 11823481)
function ub2(A) {
  if (!A?.pattern) return null;
  return J7(A.pattern, $k)
}
// @from(Start 11823486, End 11823488)
gJ
// @from(Start 11823494, End 11823588)
mb2 = L(() => {
  hA();
  iX();
  yJ();
  q8();
  AIA();
  R9();
  cQ();
  gJ = BA(VA(), 1)
})
// @from(Start 11823633, End 11823800)
function E70(A) {
  if (A.length <= C70) return A;
  let Q = A.slice(0, C70),
    G = A.slice(C70).split(`
`).length;
  return `${Q}

... [${G} lines truncated] ...`
}
// @from(Start 11823802, End 11823897)
function z70(A, Q, B = 0) {
  if (Q === void 0) return A.slice(B);
  return A.slice(B, B + Q)
}
// @from(Start 11823899, End 11823989)
function U70(A) {
  let Q = W0(),
    B = bi5(Q, A);
  return B.startsWith("..") ? A : B
}
// @from(Start 11823991, End 11824080)
function $70(A, Q) {
  if (!A && !Q) return "";
  return `limit: ${A}, offset: ${Q??0}`
}
// @from(Start 11824085, End 11824088)
fi5
// @from(Start 11824090, End 11824101)
C70 = 20000
// @from(Start 11824105, End 11824108)
hi5
// @from(Start 11824110, End 11824113)
gi5
// @from(Start 11824115, End 11824117)
Py
// @from(Start 11824123, End 11833344)
VTA = L(() => {
  Q2();
  U2();
  yI();
  sj();
  yR();
  u2();
  EJ();
  AQ();
  mb2();
  fi5 = j.strictObject({
    pattern: j.string().describe("The regular expression pattern to search for in file contents"),
    path: j.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
    glob: j.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
    output_mode: j.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
    "-B": j.number().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
    "-A": j.number().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
    "-C": j.number().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
    "-n": j.boolean().optional().describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
    "-i": j.boolean().optional().describe("Case insensitive search (rg -i)"),
    type: j.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
    head_limit: j.number().optional().describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults based on "cap" experiment value: 0 (unlimited), 20, or 100.'),
    offset: j.number().optional().describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
    multiline: j.boolean().optional().describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
  }), hi5 = [".git", ".svn", ".hg", ".bzr"];
  gi5 = j.object({
    mode: j.enum(["content", "files_with_matches", "count"]).optional(),
    numFiles: j.number(),
    filenames: j.array(j.string()),
    content: j.string().optional(),
    numLines: j.number().optional(),
    numMatches: j.number().optional(),
    appliedLimit: j.number().optional(),
    appliedOffset: j.number().optional()
  }), Py = {
    name: xY,
    strict: !0,
    input_examples: [{
      pattern: "TODO",
      output_mode: "files_with_matches"
    }, {
      pattern: "function.*export",
      glob: "*.ts",
      output_mode: "content",
      "-n": !0
    }, {
      pattern: "error",
      "-i": !0,
      type: "js"
    }],
    async description() {
      return CC1()
    },
    userFacingName() {
      return "Search"
    },
    getToolUseSummary: ub2,
    isEnabled() {
      return !0
    },
    inputSchema: fi5,
    outputSchema: gi5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    getPath({
      path: A
    }) {
      return A || W0()
    },
    async validateInput({
      path: A
    }) {
      if (A) {
        let Q = RA(),
          B = b9(A);
        if (!Q.existsSync(B)) return {
          result: !1,
          message: `Path does not exist: ${A}`,
          errorCode: 1
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return jl(Py, A, B.toolPermissionContext)
    },
    async prompt() {
      return CC1()
    },
    renderToolUseMessage: vb2,
    renderToolUseRejectedMessage: bb2,
    renderToolUseErrorMessage: fb2,
    renderToolUseProgressMessage: hb2,
    renderToolResultMessage: gb2,
    mapToolResultToToolResultBlockParam({
      mode: A = "files_with_matches",
      numFiles: Q,
      filenames: B,
      content: G,
      numLines: Z,
      numMatches: I,
      appliedLimit: Y,
      appliedOffset: J
    }, W) {
      if (A === "content") {
        let K = $70(Y, J),
          D = E70(G || "No matches found"),
          H = K ? `${D}

[Showing results with pagination = ${K}]` : D;
        return {
          tool_use_id: W,
          type: "tool_result",
          content: H
        }
      }
      if (A === "count") {
        let K = $70(Y, J),
          H = E70(G || "No matches found"),
          C = I ?? 0,
          E = Q ?? 0,
          U = `

Found ${C} total ${C===1?"occurrence":"occurrences"} across ${E} ${E===1?"file":"files"}.${K?` with pagination = ${K}`:""}`;
        return {
          tool_use_id: W,
          type: "tool_result",
          content: H + U
        }
      }
      let X = $70(Y, J);
      if (Q === 0) return {
        tool_use_id: W,
        type: "tool_result",
        content: "No files found"
      };
      let V = `Found ${Q} file${Q===1?"":"s"}${X?` ${X}`:""}
${B.join(`
`)}`,
        F = E70(V);
      return {
        tool_use_id: W,
        type: "tool_result",
        content: F
      }
    },
    async call({
      pattern: A,
      path: Q,
      glob: B,
      type: G,
      output_mode: Z = "files_with_matches",
      "-B": I,
      "-A": Y,
      "-C": J,
      "-n": W = !0,
      "-i": X = !1,
      head_limit: V,
      offset: F = 0,
      multiline: K = !1
    }, {
      abortController: D,
      getAppState: H
    }) {
      let {
        cap: C
      } = await Ch1("tengu_cap_grep_results", {
        cap: 0
      }), E = V !== void 0 ? V : C > 0 ? C : void 0, U = Q ? b9(Q) : W0(), q = ["--hidden"];
      for (let u of hi5) q.push("--glob", `!${u}`);
      if (q.push("--max-columns", "500"), K) q.push("-U", "--multiline-dotall");
      if (X) q.push("-i");
      if (Z === "files_with_matches") q.push("-l");
      else if (Z === "count") q.push("-c");
      if (W && Z === "content") q.push("-n");
      if (J !== void 0 && Z === "content") q.push("-C", J.toString());
      else if (Z === "content") {
        if (I !== void 0) q.push("-B", I.toString());
        if (Y !== void 0) q.push("-A", Y.toString())
      }
      if (A.startsWith("-")) q.push("-e", A);
      else q.push(A);
      if (G) q.push("--type", G);
      if (B) {
        let u = [],
          e = B.split(/\s+/);
        for (let l of e)
          if (l.includes("{") && l.includes("}")) u.push(l);
          else u.push(...l.split(",").filter(Boolean));
        for (let l of u.filter(Boolean)) q.push("--glob", l)
      }
      let w = await H(),
        N = RWA(TWA(w.toolPermissionContext), W0());
      for (let u of N) {
        let e = u.startsWith("/") ? `!${u}` : `!**/${u}`;
        q.push("--glob", e)
      }
      let R = await aj(q, U, D.signal);
      if (Z === "content") {
        let u = R.map((k) => {
            let m = k.indexOf(":");
            if (m > 0) {
              let o = k.substring(0, m),
                IA = k.substring(m);
              return U70(o) + IA
            }
            return k
          }),
          e = z70(u, E, F);
        return {
          data: {
            mode: "content",
            numFiles: 0,
            filenames: [],
            content: e.join(`
`),
            numLines: e.length,
            ...E !== void 0 && {
              appliedLimit: E
            },
            ...F > 0 && {
              appliedOffset: F
            }
          }
        }
      }
      if (Z === "count") {
        let u = R.map((o) => {
            let IA = o.lastIndexOf(":");
            if (IA > 0) {
              let FA = o.substring(0, IA),
                zA = o.substring(IA);
              return U70(FA) + zA
            }
            return o
          }),
          e = z70(u, E, F),
          l = 0,
          k = 0;
        for (let o of e) {
          let IA = o.lastIndexOf(":");
          if (IA > 0) {
            let FA = o.substring(IA + 1),
              zA = parseInt(FA, 10);
            if (!isNaN(zA)) l += zA, k += 1
          }
        }
        return {
          data: {
            mode: "count",
            numFiles: k,
            filenames: [],
            content: e.join(`
`),
            numMatches: l,
            ...E !== void 0 && {
              appliedLimit: E
            },
            ...F > 0 && {
              appliedOffset: F
            }
          }
        }
      }
      let T = await Promise.all(R.map((u) => RA().stat(u))),
        y = R.map((u, e) => [u, T[e]]).sort((u, e) => {
          let l = (e[1].mtimeMs ?? 0) - (u[1].mtimeMs ?? 0);
          if (l === 0) return u[0].localeCompare(e[0]);
          return l
        }).map((u) => u[0]),
        x = z70(y, E, F).map(U70);
      return {
        data: {
          mode: "files_with_matches",
          filenames: x,
          numFiles: x.length,
          ...E !== void 0 && {
            appliedLimit: E
          },
          ...F > 0 && {
            appliedOffset: F
          }
        }
      }
    }
  }
})
// @from(Start 11833347, End 11833383)
function db2() {
  return "Search"
}
// @from(Start 11833385, End 11833556)
function cb2({
  pattern: A,
  path: Q
}, {
  verbose: B
}) {
  if (!A) return null;
  if (!Q) return `pattern: "${A}"`;
  return `pattern: "${A}", path: "${B?Q:Q5(Q)}"`
}
// @from(Start 11833558, End 11833621)
function pb2() {
  return FTA.default.createElement(k5, null)
}
// @from(Start 11833623, End 11833923)
function lb2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return FTA.default.createElement(S0, null, FTA.default.createElement($, {
    color: "error"
  }, "Error searching files"));
  return FTA.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 11833925, End 11833957)
function ib2() {
  return null
}
// @from(Start 11833959, End 11834037)
function ab2(A) {
  if (!A?.pattern) return null;
  return J7(A.pattern, $k)
}
// @from(Start 11834042, End 11834045)
FTA
// @from(Start 11834047, End 11834050)
nb2
// @from(Start 11834056, End 11834187)
sb2 = L(() => {
  hA();
  iX();
  yJ();
  q8();
  cQ();
  R9();
  VTA();
  FTA = BA(VA(), 1);
  nb2 = Py.renderToolResultMessage
})
// @from(Start 11834193, End 11834196)
ui5
// @from(Start 11834198, End 11834201)
mi5
// @from(Start 11834203, End 11834205)
zO
// @from(Start 11834211, End 11837172)
KTA = L(() => {
  Q2();
  U2();
  R9();
  EJ();
  yI();
  AQ();
  sb2();
  ui5 = j.strictObject({
    pattern: j.string().describe("The glob pattern to match files against"),
    path: j.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
  }), mi5 = j.object({
    durationMs: j.number().describe("Time taken to execute the search in milliseconds"),
    numFiles: j.number().describe("Total number of files found"),
    filenames: j.array(j.string()).describe("Array of file paths that match the pattern"),
    truncated: j.boolean().describe("Whether results were truncated (limited to 100 files)")
  }), zO = {
    name: iK,
    async description() {
      return HC1
    },
    userFacingName: db2,
    getToolUseSummary: ab2,
    isEnabled() {
      return !0
    },
    inputSchema: ui5,
    outputSchema: mi5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    getPath({
      path: A
    }) {
      return A ? b9(A) : W0()
    },
    async validateInput({
      path: A
    }) {
      if (A) {
        let Q = RA(),
          B = b9(A);
        if (!Q.existsSync(B)) return {
          result: !1,
          message: `Directory does not exist: ${A}`,
          errorCode: 1
        };
        if (!Q.statSync(B).isDirectory()) return {
          result: !1,
          message: `Path is not a directory: ${A}`,
          errorCode: 2
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return jl(zO, A, B.toolPermissionContext)
    },
    async prompt() {
      return HC1
    },
    renderToolUseMessage: cb2,
    renderToolUseRejectedMessage: pb2,
    renderToolUseErrorMessage: lb2,
    renderToolUseProgressMessage: ib2,
    renderToolResultMessage: nb2,
    async call(A, {
      abortController: Q,
      getAppState: B
    }) {
      let G = Date.now(),
        Z = await B(),
        {
          files: I,
          truncated: Y
        } = await rb2(A.pattern, zO.getPath(A), {
          limit: 100,
          offset: 0
        }, Q.signal, Z.toolPermissionContext);
      return {
        data: {
          filenames: I,
          durationMs: Date.now() - G,
          numFiles: I.length,
          truncated: Y
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      if (A.filenames.length === 0) return {
        tool_use_id: Q,
        type: "tool_result",
        content: "No files found"
      };
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: [...A.filenames, ...A.truncated ? ["(Results are truncated. Consider using a more specific path or pattern.)"] : []].join(`
`)
      }
    }
  }
})
// @from(Start 11837174, End 11841558)
async function ob2(A) {
  let Q = A.map((B) => {
    let G = "";
    if (B?.forkContext) G = "Properties: " + (B?.forkContext ? "access to current context; " : "");
    let Z = B.tools ? B.tools.join(", ") : "All tools";
    return `- ${B.agentType}: ${B.whenToUse} (${G}Tools: ${Z})`
  }).join(`
`);
  return `Launch a new agent to handle complex, multi-step tasks autonomously. 

The ${A6} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${Q}

When using the ${A6} tool, you must specify a subagent_type parameter to select which agent type to use.

When NOT to use the ${A6} tool:
- If you want to read a specific file path, use the ${n8.name} or ${zO.name} tool instead of the ${A6} tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the ${zO.name} tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the ${n8.name} tool instead of the ${A6} tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above


Usage notes:
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Each agent invocation is stateless. You will not be able to send additional messages to the agent, nor will the agent be able to communicate with you outside of its final report. Therefore, your prompt should contain a highly detailed task description for the agent to perform autonomously and you should specify exactly what information the agent should return back to you in its final and only message to you.
- Agents with "access to current context" can see the full conversation history before the tool call. When using these agents, you can write concise prompts that reference earlier context (e.g., "investigate the error discussed above") instead of repeating information. The agent will receive all prior messages and understand the context.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${jn.name} tool use content blocks. For example, if you need to launch both a code-reviewer agent and a test-runner agent in parallel, send a single message with both tool calls.

Example usage:

<example_agent_descriptions>
"code-reviewer": use this agent after you are done writing a signficant piece of code
"greeting-responder": use this agent when to respond to user greetings with a friendly joke
</example_agent_description>

<example>
user: "Please write a function that checks if a number is prime"
assistant: Sure let me write a function that checks if a number is prime
assistant: First let me use the ${QV.name} tool to write a function that checks if a number is prime
assistant: I'm going to use the ${QV.name} tool to write the following code:
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
Since a signficant piece of code was written and the task was completed, now use the code-reviewer agent to review the code
</commentary>
assistant: Now let me use the code-reviewer agent to review the code
assistant: Uses the ${jn.name} tool to launch the code-reviewer agent 
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${jn.name} tool to launch the greeting-responder agent"
</example>
`
}
// @from(Start 11841563, End 11841614)
tb2 = L(() => {
  Dq();
  rh();
  KTA();
  DTA()
})
// @from(Start 11841617, End 11841751)
function PWA(A) {
  if (A === "general-purpose") return;
  let B = kX1().get(A);
  if (B && j0A.includes(B)) return HTA[B];
  return
}
// @from(Start 11841753, End 11841871)
function jWA(A, Q) {
  let B = kX1();
  if (!Q) {
    B.delete(A);
    return
  }
  if (j0A.includes(Q)) B.set(A, Q)
}
// @from(Start 11841876, End 11841879)
j0A
// @from(Start 11841881, End 11841884)
HTA
// @from(Start 11841890, End 11842314)
jy = L(() => {
  _0();
  j0A = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"], HTA = {
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
// @from(Start 11842364, End 11842456)
function nE(A) {
  if (typeof A !== "string") return null;
  return ci5.test(A) ? A : null
}
// @from(Start 11842458, End 11842508)
function SWA() {
  return di5(4).toString("hex")
}
// @from(Start 11842513, End 11842516)
ci5
// @from(Start 11842522, End 11842613)
Sy = L(() => {
  ci5 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
})
// @from(Start 11842662, End 11842999)
function w70({
  tools: A,
  isBuiltIn: Q,
  isAsync: B = !1
}) {
  return A.filter((G) => {
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS && G.name.startsWith("mcp__")) return !0;
    if (CTA.has(G.name)) return !1;
    if (!Q && Qf2.has(G.name)) return !1;
    if (B && !Bf2.has(G.name)) return !1;
    return !0
  })
}
// @from(Start 11843001, End 11843905)
function Sn(A, Q, B = !1) {
  let {
    tools: G,
    disallowedTools: Z,
    source: I
  } = A, Y = w70({
    tools: Q,
    isBuiltIn: I === "built-in",
    isAsync: B
  }), J = new Set(Z?.map((C) => {
    let {
      toolName: E
    } = nN(C);
    return E
  }) ?? []), W = Y.filter((C) => !J.has(C.name));
  if (G === void 0 || G.length === 1 && G[0] === "*") return {
    hasWildcard: !0,
    validTools: [],
    invalidTools: [],
    resolvedTools: W
  };
  let V = new Map;
  for (let C of W) V.set(C.name, C);
  let F = [],
    K = [],
    D = [],
    H = new Set;
  for (let C of G) {
    let {
      toolName: E
    } = nN(C);
    if (E === A6) {
      F.push(C);
      continue
    }
    let U = V.get(E);
    if (U) {
      if (F.push(C), !H.has(U)) D.push(U), H.add(U)
    } else K.push(C)
  }
  return {
    hasWildcard: !1,
    validTools: F,
    invalidTools: K,
    resolvedTools: D
  }
}
// @from(Start 11843907, End 11845237)
function Af2(A, Q) {
  let B = R0({
      content: A
    }),
    G = Q.message.content.find((W) => {
      if (W.type !== "tool_use" || W.name !== A6) return !1;
      let X = W.input;
      return "prompt" in X && X.prompt === A
    });
  if (!G) return g(`Could not find matching AgentTool tool use for prompt: ${A.slice(0,50)}...`, {
    level: "error"
  }), [B];
  let Z = {
      ...Q,
      uuid: pi5(),
      message: {
        ...Q.message,
        content: [G]
      }
    },
    I = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE: 
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`,
    Y = {
      status: "sub_agent_entered",
      description: "Entered sub-agent context",
      message: I
    },
    J = R0({
      content: [{
        type: "tool_result",
        tool_use_id: G.id,
        content: [{
          type: "text",
          text: I
        }]
      }],
      toolUseResult: Y
    });
  return [Z, J, B]
}
// @from(Start 11845242, End 11845245)
eb2
// @from(Start 11845251, End 11845430)
S0A = L(() => {
  AZ();
  yq();
  cQ();
  V0();
  Q2();
  eb2 = j.object({
    status: j.literal("sub_agent_entered"),
    description: j.string(),
    message: j.string()
  })
})
// @from(Start 11845436, End 11845439)
o51
// @from(Start 11845445, End 11847289)
q70 = L(() => {
  o51 = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    getSystemPrompt: () => `You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: Use Grep or Glob when you need to search broadly. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication, avoid using emojis.`
  }
})
// @from(Start 11847295, End 11847298)
Gf2
// @from(Start 11847304, End 11850839)
Zf2 = L(() => {
  Gf2 = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",
    getSystemPrompt: () => `You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc  
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\\n)\\s*(?:export\\s+)?PS1\\s*=\\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \\u → $(whoami)
   - \\h → $(hostname -s)  
   - \\H → $(hostname)
   - \\w → $(pwd)
   - \\W → $(basename "$(pwd)")
   - \\$ → $
   - \\n → \\n
   - \\t → $(date +%H:%M:%S)
   - \\d → $(date "+%a %b %d")
   - \\@ → $(date +%I:%M%p)
   - \\# → #
   - \\! → !

4. When using ANSI color codes, be sure to use \`printf\`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string"   // Project root directory path
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     }
   }
   
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')
   
   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command", 
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
`
  }
})
// @from(Start 11850845, End 11850848)
li5
// @from(Start 11850850, End 11850852)
xq
// @from(Start 11850858, End 11853778)
_WA = L(() => {
  wF();
  YS();
  yR();
  li5 = `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use ${iK} for broad file pattern matching
- Use ${xY} for searching file contents with regex
- Use ${d5} when you know the specific file path you need to read
- Use ${C9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use ${C9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`, xq = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: [A6, P51, $5, wX, JS],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    getSystemPrompt: () => li5,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
  }
})
// @from(Start 11853784, End 11853787)
ii5
// @from(Start 11853789, End 11853792)
kWA
// @from(Start 11853798, End 11856849)
t51 = L(() => {
  _WA();
  yR();
  wF();
  YS();
  ii5 = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using ${iK}, ${xY}, and ${d5}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${C9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use ${C9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`, kWA = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: [A6, P51, $5, wX, JS],
    source: "built-in",
    tools: xq.tools,
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => ii5,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
  }
})
// @from(Start 11856855, End 11856869)
If2 = () => {}
// @from(Start 11856872, End 11857149)
function N70() {
  let A = [o51, Gf2, xq, kWA];
  if (Y0(process.env.ENABLE_CODE_GUIDE_SUBAGENT) || process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(iCB);
  return A
}
// @from(Start 11857154, End 11857233)
Yf2 = L(() => {
  q70();
  Zf2();
  _WA();
  t51();
  Nh1();
  If2();
  hQ()
})
// @from(Start 11857293, End 11857793)
function Jf2(A, Q, B) {
  let G = [],
    Z = RA();

  function I(Y, J = []) {
    try {
      let W = Z.readdirSync(Y);
      for (let X of W) {
        let V = ni5(Y, X.name);
        if (X.isDirectory()) I(V, [...J, X.name]);
        else if (X.isFile() && X.name.endsWith(".md")) {
          let F = Wf2(V, Q, J, B);
          if (F) G.push(F)
        }
      }
    } catch (W) {
      g(`Failed to scan agents directory ${Y}: ${W}`, {
        level: "error"
      })
    }
  }
  return I(A), G
}
// @from(Start 11857795, End 11858648)
function Wf2(A, Q, B, G) {
  let Z = RA();
  try {
    let I = Z.readFileSync(A, {
        encoding: "utf-8"
      }),
      {
        frontmatter: Y,
        content: J
      } = NV(I),
      W = Y.name || ai5(A).replace(/\.md$/, ""),
      V = [Q, ...B, W].join(":"),
      F = Y.description || Y["when-to-use"] || `Agent from ${Q} plugin`,
      K = k0A(Y.tools),
      D = UO(Y.skills),
      H = Y.color,
      C = Y.model,
      E = Y.forkContext,
      U = J.trim();
    return {
      agentType: V,
      whenToUse: F,
      tools: K,
      ...D !== void 0 ? {
        skills: D
      } : {},
      getSystemPrompt: () => U,
      source: "plugin",
      color: H,
      model: C,
      filename: W,
      plugin: G,
      ...{}
    }
  } catch (I) {
    return g(`Failed to load agent from ${A}: ${I}`, {
      level: "error"
    }), null
  }
}
// @from(Start 11858650, End 11858691)
function Xf2() {
  _0A.cache?.clear?.()
}
// @from(Start 11858696, End 11858699)
_0A
// @from(Start 11858705, End 11860037)
ETA = L(() => {
  l2();
  AQ();
  fV();
  V0();
  _y();
  _0A = s1(async () => {
    let {
      enabled: A,
      errors: Q
    } = await l7(), B = [];
    if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
    for (let G of A) {
      if (G.agentsPath) try {
        let Z = Jf2(G.agentsPath, G.name, G.source);
        if (B.push(...Z), Z.length > 0) g(`Loaded ${Z.length} agents from plugin ${G.name} default directory`)
      } catch (Z) {
        g(`Failed to load agents from plugin ${G.name} default directory: ${Z}`, {
          level: "error"
        })
      }
      if (G.agentsPaths)
        for (let Z of G.agentsPaths) try {
          let Y = RA().statSync(Z);
          if (Y.isDirectory()) {
            let J = Jf2(Z, G.name, G.source);
            if (B.push(...J), J.length > 0) g(`Loaded ${J.length} agents from plugin ${G.name} custom path: ${Z}`)
          } else if (Y.isFile() && Z.endsWith(".md")) {
            let J = Wf2(Z, G.name, [], G.source);
            if (J) B.push(J), g(`Loaded agent from plugin ${G.name} custom file: ${Z}`)
          }
        } catch (I) {
          g(`Failed to load agents from plugin ${G.name} custom path ${Z}: ${I}`, {
            level: "error"
          })
        }
    }
    return g(`Total plugin agents loaded: ${B.length}`), B
  })
})
// @from(Start 11860082, End 11860133)
function $O(A) {
  return A.source === "built-in"
}
// @from(Start 11860135, End 11860212)
function Ff2(A) {
  return A.source !== "built-in" && A.source !== "plugin"
}
// @from(Start 11860214, End 11860264)
function e51(A) {
  return A.source === "plugin"
}
// @from(Start 11860266, End 11860745)
function ky(A) {
  let Q = A.filter((X) => X.source === "built-in"),
    B = A.filter((X) => X.source === "plugin"),
    G = A.filter((X) => X.source === "userSettings"),
    Z = A.filter((X) => X.source === "projectSettings"),
    I = A.filter((X) => X.source === "policySettings"),
    Y = A.filter((X) => X.source === "flagSettings"),
    J = [Q, B, G, Z, Y, I],
    W = new Map;
  for (let X of J)
    for (let V of X) W.set(V.agentType, V);
  return Array.from(W.values())
}
// @from(Start 11860747, End 11861168)
function oi5(A) {
  let {
    name: Q,
    description: B,
    model: G
  } = A;
  if (!Q || typeof Q !== "string") return 'Missing required "name" field in frontmatter';
  if (!B || typeof B !== "string") return 'Missing required "description" field in frontmatter';
  if (G && typeof G === "string" && !J7A.includes(G)) return `Invalid model "${G}". Valid options: ${J7A.join(", ")}`;
  return "Unknown parsing error"
}
// @from(Start 11861170, End 11861938)
function ti5(A, Q, B = "flagSettings") {
  try {
    let G = Vf2.parse(Q),
      Z = k0A(G.tools),
      I = G.disallowedTools !== void 0 ? k0A(G.disallowedTools) : void 0,
      Y = G.prompt;
    return {
      agentType: A,
      whenToUse: G.description,
      ...Z !== void 0 ? {
        tools: Z
      } : {},
      ...I !== void 0 ? {
        disallowedTools: I
      } : {},
      getSystemPrompt: () => Y,
      source: B,
      ...G.model ? {
        model: G.model
      } : {},
      ...G.permissionMode ? {
        permissionMode: G.permissionMode
      } : {}
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    return g(`Error parsing agent '${A}' from JSON: ${Z}`), AA(G instanceof Error ? G : Error(String(G))), null
  }
}
// @from(Start 11861940, End 11862278)
function A31(A, Q = "flagSettings") {
  try {
    let B = ri5.parse(A);
    return Object.entries(B).map(([G, Z]) => ti5(G, Z, Q)).filter((G) => G !== null)
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    return g(`Error parsing agents from JSON: ${G}`), AA(B instanceof Error ? B : Error(String(B))), []
  }
}
// @from(Start 11862280, End 11864487)
function ei5(A, Q, B, G, Z) {
  try {
    let {
      name: I,
      description: Y
    } = B;
    if (!I || typeof I !== "string" || !Y || typeof Y !== "string") {
      let T = `Agent file ${A} is missing required '${!I||typeof I!=="string"?"name":"description"}' in frontmatter`;
      return g(T), null
    }
    Y = Y.replace(/\\n/g, `
`);
    let {
      color: J,
      model: W,
      forkContext: X
    } = B;
    if (X !== void 0 && X !== "true" && X !== "false") {
      let R = `Agent file ${A} has invalid forkContext value '${X}'. Must be 'true', 'false', or omitted.`;
      g(R)
    }
    let V = X === "true";
    if (V && W !== "inherit") {
      let R = `Agent file ${A} has forkContext: true but model is not 'inherit'. Overriding to 'inherit'. Agents with forkContext must use model: inherit to avoid context length mismatch.`;
      g(R), W = "inherit"
    }
    let F = W && typeof W === "string" && J7A.includes(W);
    if (W && typeof W === "string" && !F) {
      let R = `Agent file ${A} has invalid model '${W}'. Valid options: ${J7A.join(", ")}`;
      g(R)
    }
    let K = B.permissionMode,
      D = K && kR.includes(K);
    if (K && !D) {
      let R = `Agent file ${A} has invalid permissionMode '${K}'. Valid options: ${kR.join(", ")}`;
      g(R)
    }
    let H = si5(A, ".md"),
      C = k0A(B.tools),
      E = B.disallowedTools,
      U = E !== void 0 ? k0A(E) : void 0,
      q = UO(B.skills),
      w = G.trim();
    return {
      baseDir: Q,
      agentType: I,
      whenToUse: Y,
      ...C !== void 0 ? {
        tools: C
      } : {},
      ...U !== void 0 ? {
        disallowedTools: U
      } : {},
      ...q !== void 0 ? {
        skills: q
      } : {},
      getSystemPrompt: () => w,
      source: Z,
      filename: H,
      ...J && typeof J === "string" && j0A.includes(J) ? {
        color: J
      } : {},
      ...F ? {
        model: W
      } : {},
      ...D ? {
        permissionMode: K
      } : {},
      ...V ? {
        forkContext: V
      } : {}
    }
  } catch (I) {
    let Y = I instanceof Error ? I.message : String(I);
    return g(`Error parsing agent from ${A}: ${Y}`), AA(I instanceof Error ? I : Error(String(I))), null
  }
}
// @from(Start 11864492, End 11864495)
Vf2
// @from(Start 11864497, End 11864500)
ri5
// @from(Start 11864502, End 11864505)
Kf2
// @from(Start 11864511, End 11866224)
fP = L(() => {
  l2();
  Q2();
  q0();
  V0();
  g1();
  _y();
  t2();
  jy();
  Yf2();
  ETA();
  Zw();
  Vf2 = j.object({
    description: j.string().min(1, "Description cannot be empty"),
    tools: j.array(j.string()).optional(),
    disallowedTools: j.array(j.string()).optional(),
    prompt: j.string().min(1, "Prompt cannot be empty"),
    model: j.enum(J7A).optional(),
    permissionMode: j.enum(kR).optional()
  }), ri5 = j.record(j.string(), Vf2);
  Kf2 = s1(async () => {
    try {
      let A = await _n("agents"),
        Q = [],
        B = A.map(({
          filePath: J,
          baseDir: W,
          frontmatter: X,
          content: V,
          source: F
        }) => {
          let K = ei5(J, W, X, V, F);
          if (!K) {
            let D = oi5(X);
            return Q.push({
              path: J,
              error: D
            }), g(`Failed to parse agent from ${J}: ${D}`), GA("tengu_agent_parse_error", {
              error: D,
              location: F
            }), null
          }
          return K
        }).filter((J) => J !== null),
        G = await _0A(),
        I = [...N70(), ...G, ...B],
        Y = ky(I);
      for (let J of Y)
        if (J.color) jWA(J.agentType, J.color);
      return {
        activeAgents: Y,
        allAgents: I,
        failedFiles: Q.length > 0 ? Q : void 0
      }
    } catch (A) {
      let Q = A instanceof Error ? A.message : String(A);
      g(`Error loading agent definitions: ${Q}`), AA(A instanceof Error ? A : Error(String(A)));
      let B = N70();
      return {
        activeAgents: B,
        allAgents: B,
        failedFiles: [{
          path: "unknown",
          error: Q
        }]
      }
    }
  })
})
// @from(Start 11866227, End 11867017)
function Df2({
  onDone: A
}) {
  return f1((Q, B) => {
    if (B.ctrl && (Q === "c" || Q === "d") || B.escape) A()
  }), kn.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    padding: 1,
    borderDimColor: !0
  }, kn.default.createElement(S, {
    marginBottom: 1,
    flexDirection: "column"
  }, kn.default.createElement($, {
    bold: !0
  }, "You've spent $5 on the Anthropic API this session."), kn.default.createElement($, null, "Learn more about how to monitor your spending:"), kn.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/costs"
  })), kn.default.createElement(S, null, kn.default.createElement(M0, {
    options: [{
      value: "ok",
      label: "Got it, thanks!"
    }],
    onChange: A,
    onCancel: A
  })))
}
// @from(Start 11867022, End 11867024)
kn
// @from(Start 11867030, End 11867091)
Hf2 = L(() => {
  hA();
  J5();
  hA();
  kn = BA(VA(), 1)
})
// @from(Start 11867094, End 11867177)
function Ef2(A, Q = !1) {
  Cf2.useEffect(() => {
    if (!Q) y0A(A)
  }, [A, Q])
}
// @from(Start 11867182, End 11867185)
Cf2
// @from(Start 11867191, End 11867237)
zf2 = L(() => {
  S7();
  Cf2 = BA(VA(), 1)
})
// @from(Start 11867315, End 11874170)
function $f2({
  messages: A,
  onPreRestore: Q,
  onRestoreMessage: B,
  onRestoreCode: G,
  onClose: Z
}) {
  let [I] = OQ(), [Y, J] = X$.useState(void 0), W = EG(), X = X$.useMemo(An5, []), V = X$.useMemo(() => [...A.filter(yn), {
    ...R0({
      content: ""
    }),
    uuid: X
  }], [A, X]), [F, K] = X$.useState(V.length - 1), D = Math.max(0, Math.min(F - Math.floor(L70 / 2), V.length - L70)), H = V.length > 1, [C, E] = X$.useState(void 0), [U, q] = X$.useState(void 0), [w, N] = X$.useState(!1), [R, T] = X$.useState("both");
  X$.useEffect(() => {
    GA("tengu_message_selector_opened", {})
  }, []);
  async function y(k) {
    let m = A.indexOf(k),
      o = A.length - 1 - m;
    if (GA("tengu_message_selector_selected", {
        index_from_end: o,
        message_type: k.type,
        is_current_prompt: !1
      }), !A.includes(k)) {
      Z();
      return
    }
    if (W) {
      E(k);
      let IA = TQ0(I.fileHistory, k.uuid);
      q(IA)
    } else {
      Q(), N(!0);
      try {
        await B(k), N(!1), Z()
      } catch (IA) {
        AA(IA), N(!1), J(`Failed to restore the conversation:
${IA}`)
      }
    }
  }
  async function v(k) {
    if (GA("tengu_message_selector_restore_option_selected", {
        option: k
      }), !C) {
      J("Message not found.");
      return
    }
    if (k === "nevermind") {
      E(void 0);
      return
    }
    Q(), N(!0), J(void 0);
    let m = null,
      o = null;
    if (k === "code" || k === "both") try {
      await G(C)
    } catch (IA) {
      m = IA, AA(m)
    }
    if (k === "conversation" || k === "both") try {
      await B(C)
    } catch (IA) {
      o = IA, AA(o)
    }
    if (N(!1), E(void 0), o && m) J(`Failed to restore the conversation and code:
${o}
${m}`);
    else if (o) J(`Failed to restore the conversation:
${o}`);
    else if (m) J(`Failed to restore the code:
${m}`);
    else Z()
  }
  let x = EQ();

  function p() {
    GA("tengu_message_selector_cancelled", {}), Z()
  }
  f1((k, m) => {
    if (m.escape) {
      p();
      return
    }
    if (w || Y || C || !H) return;
    if (m.return) {
      y(V[F]);
      return
    }
    if (m.upArrow)
      if (m.ctrl || m.shift || m.meta) K(0);
      else K((o) => Math.max(0, o - 1));
    if (m.downArrow)
      if (m.ctrl || m.shift || m.meta) K(V.length - 1);
      else K((o) => Math.min(V.length - 1, o + 1))
  });
  let [u, e] = X$.useState({});
  X$.useEffect(() => {
    async function k() {
      if (!W) return;
      Promise.all(V.map(async (m, o) => {
        if (m.uuid !== X) {
          let IA = c91(I.fileHistory, m.uuid),
            FA = V.at(o + 1),
            zA = IA ? Zn5(A, m.uuid, FA?.uuid !== X ? FA?.uuid : void 0) : void 0;
          if (zA !== void 0) e((NA) => ({
            ...NA,
            [o]: zA
          }));
          else e((NA) => ({
            ...NA,
            [o]: void 0
          }))
        }
      }))
    }
    k()
  }, [V, A, X, I.fileHistory, W, e]);
  let l = W && U?.filesChanged && U.filesChanged.length > 0;
  return $0.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, $0.createElement(D3, {
    dividerColor: "suggestion"
  }), $0.createElement(S, {
    flexDirection: "column",
    marginX: 1,
    gap: 1
  }, $0.createElement($, {
    bold: !0,
    color: "suggestion"
  }, "Rewind"), Y && $0.createElement($0.Fragment, null, $0.createElement($, {
    color: "error"
  }, "Error: ", Y)), !H && $0.createElement($0.Fragment, null, $0.createElement($, null, "Nothing to rewind to yet.")), !Y && C && H && $0.createElement($0.Fragment, null, $0.createElement($, null, "Confirm you want to restore", " ", !U && "the conversation ", "to the point before you sent this message:"), $0.createElement(S, {
    flexDirection: "column",
    paddingLeft: 1,
    borderStyle: "single",
    borderRight: !1,
    borderTop: !1,
    borderBottom: !1,
    borderLeft: !0,
    borderLeftDimColor: !0
  }, $0.createElement(Uf2, {
    userMessage: C,
    color: "text",
    isCurrent: !1
  }), $0.createElement($, {
    dimColor: !0
  }, "(", Yt(new Date(C.timestamp)), ")")), $0.createElement(S, {
    flexDirection: "column"
  }, R === "both" || R === "conversation" ? $0.createElement($, {
    dimColor: !0
  }, "The conversation will be forked.") : $0.createElement($, {
    dimColor: !0
  }, "The conversation will be unchanged."), l && (R === "both" || R === "code") ? $0.createElement(Gn5, {
    diffStatsForRestore: U
  }) : $0.createElement($, {
    dimColor: !0
  }, "The code will be unchanged.")), $0.createElement(M0, {
    isDisabled: w,
    options: l ? Qn5 : Bn5,
    focusValue: l ? "both" : "conversation",
    onFocus: (k) => T(k),
    onChange: (k) => v(k),
    onCancel: () => E(void 0)
  }), l && $0.createElement(S, {
    marginBottom: 1
  }, $0.createElement($, {
    dimColor: !0
  }, H1.warning, " Rewinding does not affect files edited manually or via bash."))), !Y && !C && H && $0.createElement($0.Fragment, null, W ? $0.createElement($, null, "Restore the code and/or conversation to the point before…") : $0.createElement($, null, "Restore and fork the conversation to the point before…"), $0.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, V.slice(D, D + L70).map((k, m) => {
    let o = D + m,
      IA = o === F,
      FA = k.uuid === X,
      zA = o in u,
      NA = u[o],
      OA = NA?.filesChanged && NA.filesChanged.length;
    return $0.createElement(S, {
      key: k.uuid,
      height: W ? 3 : 2,
      overflow: "hidden",
      width: "100%",
      flexDirection: "row"
    }, $0.createElement(S, {
      width: 2,
      minWidth: 2
    }, IA ? $0.createElement($, {
      color: "permission",
      bold: !0
    }, H1.pointer, " ") : $0.createElement($, null, "  ")), $0.createElement(S, {
      flexDirection: "column"
    }, $0.createElement(S, {
      flexShrink: 1,
      height: 1,
      overflow: "hidden"
    }, $0.createElement(Uf2, {
      userMessage: k,
      color: IA ? "suggestion" : void 0,
      isCurrent: FA,
      paddingRight: 10
    })), W && zA && $0.createElement(S, {
      height: 1,
      flexDirection: "row"
    }, NA ? $0.createElement($0.Fragment, null, $0.createElement($, {
      dimColor: !IA,
      color: "inactive"
    }, OA ? $0.createElement($0.Fragment, null, OA === 1 && NA.filesChanged[0] ? `${yWA.basename(NA.filesChanged[0])} ` : `${OA} files changed `, $0.createElement(wf2, {
      diffStats: NA
    })) : $0.createElement($0.Fragment, null, "No code changes"))) : $0.createElement($, {
      dimColor: !0,
      color: "warning"
    }, H1.warning, " No code restore"))))
  }))), $0.createElement($, {
    dimColor: !0,
    italic: !0
  }, x.pending ? $0.createElement($0.Fragment, null, "Press ", x.keyName, " again to exit") : $0.createElement($0.Fragment, null, !Y && H && "Enter to continue · ", "Esc to exit"))))
}
// @from(Start 11874172, End 11874933)
function Gn5({
  diffStatsForRestore: A
}) {
  if (A === void 0) return;
  if (!A.filesChanged || !A.filesChanged[0]) return $0.createElement($, {
    dimColor: !0
  }, "The code has not changed (nothing will be restored).");
  let Q = A.filesChanged.length,
    B = "";
  if (Q === 1) B = yWA.basename(A.filesChanged[0] || "");
  else if (Q === 2) {
    let G = yWA.basename(A.filesChanged[0] || ""),
      Z = yWA.basename(A.filesChanged[1] || "");
    B = `${G} and ${Z}`
  } else B = `${yWA.basename(A.filesChanged[0]||"")} and ${A.filesChanged.length-1} other files`;
  return $0.createElement($0.Fragment, null, $0.createElement($, {
    dimColor: !0
  }, "The code will be restored", " ", $0.createElement(wf2, {
    diffStats: A
  }), " in ", B, "."))
}
// @from(Start 11874935, End 11875207)
function wf2({
  diffStats: A
}) {
  if (!A || !A.filesChanged) return;
  return $0.createElement($0.Fragment, null, $0.createElement($, {
    color: "diffAddedWord"
  }, "+", A.insertions, " "), $0.createElement($, {
    color: "diffRemovedWord"
  }, "-", A.deletions))
}
// @from(Start 11875209, End 11876855)
function Uf2({
  userMessage: A,
  color: Q,
  dimColor: B,
  isCurrent: G,
  paddingRight: Z
}) {
  let {
    columns: I
  } = WB();
  if (G) return $0.createElement(S, {
    width: "100%"
  }, $0.createElement($, {
    italic: !0,
    color: Q,
    dimColor: B
  }, "(current)"));
  let Y = A.message.content,
    J = typeof Y === "string" ? Y.trim() : Y[Y.length - 1]?.type === "text" ? Y[Y.length - 1].text.trim() : "(no prompt)";
  if (B31(J)) return $0.createElement(S, {
    flexDirection: "row",
    width: "100%"
  }, $0.createElement($, {
    italic: !0,
    color: Q,
    dimColor: B
  }, "((empty message))"));
  if (J.includes("<bash-input>")) {
    let W = B9(J, "bash-input");
    if (W) return $0.createElement(S, {
      flexDirection: "row",
      width: "100%"
    }, $0.createElement($, {
      color: "bashBorder"
    }, "!"), $0.createElement($, {
      color: Q,
      dimColor: B
    }, " ", W))
  }
  if (J.includes("<command-message>")) {
    let W = B9(J, "command-message"),
      X = B9(J, "command-args");
    if (W)
      if (W.startsWith("The ")) return $0.createElement(S, {
        flexDirection: "row",
        width: "100%"
      }, $0.createElement($, {
        color: Q,
        dimColor: B
      }, W));
      else return $0.createElement(S, {
        flexDirection: "row",
        width: "100%"
      }, $0.createElement($, {
        color: Q,
        dimColor: B
      }, "/", W, " ", X))
  }
  return $0.createElement(S, {
    flexDirection: "row",
    width: "100%"
  }, $0.createElement($, {
    color: Q,
    dimColor: B
  }, Z ? J7(J, I - Z, !0) : J.slice(0, 500).split(`
`).slice(0, 4).join(`
`)))
}
// @from(Start 11876857, End 11877729)
function Zn5(A, Q, B) {
  let G = A.findIndex((W) => W.uuid === Q);
  if (G === -1) return;
  let Z = B ? A.findIndex((W) => W.uuid === B) : A.length;
  if (Z === -1) Z = A.length;
  let I = [],
    Y = 0,
    J = 0;
  for (let W = G + 1; W < Z; W++) {
    let X = A[W];
    if (!X || !qf2(X)) continue;
    let V = X.toolUseResult;
    if (!V || !V.filePath || !V.structuredPatch) continue;
    if (!I.includes(V.filePath)) I.push(V.filePath);
    try {
      if ("type" in V && V.type === "create") Y += V.content.split(/\r?\n/).length;
      else
        for (let F of V.structuredPatch) {
          let K = F.lines.filter((H) => H.startsWith("+")).length,
            D = F.lines.filter((H) => H.startsWith("-")).length;
          Y += K, J += D
        }
    } catch {
      continue
    }
  }
  return {
    filesChanged: I,
    insertions: Y,
    deletions: J
  }
}
// @from(Start 11877731, End 11878270)
function yn(A) {
  if (A.type !== "user") return !1;
  if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
  if (Q31(A)) return !1;
  if (A.isMeta) return !1;
  let Q = A.message.content,
    B = typeof Q === "string" ? Q.trim() : Q[Q.length - 1]?.type === "text" ? Q[Q.length - 1].text.trim() : "";
  if (B.indexOf("<local-command-stdout>") !== -1 || B.indexOf("<local-command-stderr>") !== -1 || B.indexOf("<bash-stdout>") !== -1 || B.indexOf("<bash-stderr>") !== -1) return !1;
  return !0
}
// @from(Start 11878275, End 11878277)
$0
// @from(Start 11878279, End 11878281)
X$
// @from(Start 11878283, End 11878286)
Qn5
// @from(Start 11878288, End 11878291)
Bn5
// @from(Start 11878293, End 11878300)
L70 = 7
// @from(Start 11878306, End 11878832)
zTA = L(() => {
  hA();
  V9();
  cQ();
  q0();
  Q4();
  S5();
  z9();
  g1();
  sU();
  i8();
  BK();
  $0 = BA(VA(), 1), X$ = BA(VA(), 1), Qn5 = [{
    value: "both",
    label: "Restore code and conversation"
  }, {
    value: "conversation",
    label: "Restore conversation"
  }, {
    value: "code",
    label: "Restore code"
  }, {
    value: "nevermind",
    label: "Never mind"
  }], Bn5 = [{
    value: "conversation",
    label: "Restore conversation"
  }, {
    value: "nevermind",
    label: "Never mind"
  }]
})
// @from(Start 11878835, End 11879109)
function Lf2(A) {
  Nf2.useEffect(() => {
    if (!A.length) return;
    let Q = uU(A);
    if (Q) Q.client.setNotificationHandler(In5, async (B) => {
      let {
        eventName: G,
        eventData: Z
      } = B.params;
      GA(`tengu_ide_${G}`, Z)
    })
  }, [A])
}
// @from(Start 11879114, End 11879117)
Nf2
// @from(Start 11879119, End 11879122)
In5
// @from(Start 11879128, End 11879352)
Mf2 = L(() => {
  Q2();
  q0();
  nY();
  Nf2 = BA(VA(), 1), In5 = j.object({
    method: j.literal("log_event"),
    params: j.object({
      eventName: j.string(),
      eventData: j.object({}).passthrough()
    })
  })
})
// @from(Start 11879355, End 11880199)
function Of2({
  file_path: A,
  edits: Q
}) {
  let B = G31.useMemo(() => RA().existsSync(A) ? _q(A) : "", [A]),
    G = G31.useMemo(() => Q.map((I) => {
      let Y = T1A(B, I.old_string) || I.old_string;
      return {
        ...I,
        old_string: Y
      }
    }), [B, Q]),
    Z = G31.useMemo(() => Uq({
      filePath: A,
      fileContents: B,
      edits: G
    }), [A, B, G]);
  return eh.createElement(S, {
    flexDirection: "column"
  }, eh.createElement(S, {
    borderDimColor: !0,
    borderColor: "subtle",
    borderStyle: "dashed",
    flexDirection: "column",
    borderLeft: !1,
    borderRight: !1,
    paddingX: 1
  }, dV(Z.map((I) => eh.createElement(J$, {
    key: I.newStart,
    patch: I,
    dim: !1,
    filePath: A
  })), (I) => eh.createElement($, {
    dimColor: !0,
    key: `ellipsis-${I}`
  }, "..."))))
}
// @from(Start 11880204, End 11880206)
eh
// @from(Start 11880208, End 11880211)
G31
// @from(Start 11880217, End 11880322)
Rf2 = L(() => {
  En();
  hA();
  Rh();
  R9();
  AQ();
  P1A();
  eh = BA(VA(), 1), G31 = BA(VA(), 1)
})
// @from(Start 11880325, End 11880660)
function xWA({
  title: A,
  subtitle: Q,
  color: B = "permission"
}) {
  return Ag.createElement(S, {
    flexDirection: "column"
  }, Ag.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, Ag.createElement($, {
    bold: !0,
    color: B
  }, A), Q !== void 0 && Ag.createElement($, {
    wrap: "truncate-start"
  }, Q)))
}
// @from(Start 11880665, End 11880667)
Ag
// @from(Start 11880673, End 11880718)
Z31 = L(() => {
  hA();
  Ag = BA(VA(), 1)
})
// @from(Start 11880721, End 11881235)
function uJ({
  title: A,
  subtitle: Q,
  color: B = "permission",
  titleColor: G,
  innerPaddingX: Z = 1,
  children: I
}) {
  return Qg.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: B,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    marginTop: 1
  }, Qg.createElement(S, {
    paddingX: 1
  }, Qg.createElement(xWA, {
    title: A,
    subtitle: Q,
    color: G
  })), Qg.createElement(S, {
    flexDirection: "column",
    paddingX: Z
  }, I))
}
// @from(Start 11881240, End 11881242)
Qg
// @from(Start 11881248, End 11881301)
wO = L(() => {
  hA();
  Z31();
  Qg = BA(VA(), 1)
})
// @from(Start 11881304, End 11881628)
function CY(A) {
  GA("tengu_unary_event", {
    event: A.event,
    completion_type: A.completion_type,
    language_name: A.metadata.language_name,
    message_id: A.metadata.message_id,
    platform: A.metadata.platform,
    ...A.metadata.hasFeedback !== void 0 && {
      hasFeedback: A.metadata.hasFeedback
    }
  })
}
// @from(Start 11881633, End 11881657)
xn = L(() => {
  q0()
})
// @from(Start 11881660, End 11882289)
function V$(A, Q) {
  Tf2.useEffect(() => {
    GA("tengu_tool_use_show_permission_request", {
      messageID: A.assistantMessage.message.id,
      toolName: A.tool.name,
      isMcp: A.tool.isMcp ?? !1,
      decisionReasonType: A.permissionResult.decisionReason?.type,
      sandboxEnabled: nQ.isSandboxingEnabled()
    }), Promise.resolve(Q.language_name).then((G) => {
      CY({
        completion_type: Q.completion_type,
        event: "response",
        metadata: {
          language_name: G,
          message_id: A.assistantMessage.message.id,
          platform: d0.platform
        }
      })
    })
  }, [A, Q])
}
// @from(Start 11882294, End 11882297)
Tf2
// @from(Start 11882303, End 11882404)
vn = L(() => {
  q0();
  bU();
  pF();
  AZ();
  cK();
  c5();
  xn();
  $J();
  Tf2 = BA(VA(), 1)
})
// @from(Start 11882449, End 11883604)
function Pf2({
  filePath: A,
  toolPermissionContext: Q,
  operationType: B = "write",
  onRejectFeedbackChange: G
}) {
  let Z = [{
      label: "Yes",
      value: "yes",
      option: {
        type: "accept-once"
      }
    }],
    I = qT(A, Q),
    Y, J = tA.bold(`(${HU.displayText})`);
  if (I)
    if (B === "read") Y = "Yes, during this session";
    else Y = `Yes, allow all edits during this session ${J}`;
  else {
    let W = Zv(A),
      X = Yn5(W) || "this directory";
    if (B === "read") Y = `Yes, allow reading from ${tA.bold(`${X}/`)} during this session`;
    else Y = `Yes, allow all edits in ${tA.bold(`${X}/`)} during this session ${J}`
  }
  if (Z.push({
      label: Y,
      value: "yes-session",
      option: {
        type: "accept-session"
      }
    }), G) Z.push({
    type: "input",
    label: "No",
    value: "no",
    placeholder: "Type here to tell Claude what to do differently",
    onChange: G,
    option: {
      type: "reject"
    }
  });
  else Z.push({
    label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
    value: "no",
    option: {
      type: "reject"
    }
  });
  return Z
}
// @from(Start 11883609, End 11883658)
jf2 = L(() => {
  F9();
  EJ();
  Up();
  yI()
})
// @from(Start 11883661, End 11883865)
function M70(A, Q, B, G, Z) {
  CY({
    completion_type: Q,
    event: A,
    metadata: {
      language_name: B,
      message_id: G,
      platform: d0.platform,
      hasFeedback: Z ?? !1
    }
  })
}
// @from(Start 11883867, End 11884056)
function Jn5(A) {
  let {
    messageId: Q,
    toolUseConfirm: B,
    onDone: G,
    completionType: Z,
    languageName: I
  } = A;
  M70("accept", Z, I, Q), G(), B.onAllow(B.input, [])
}
// @from(Start 11884058, End 11884346)
function Wn5(A) {
  let {
    messageId: Q,
    path: B,
    toolUseConfirm: G,
    toolPermissionContext: Z,
    onDone: I,
    completionType: Y,
    languageName: J,
    operationType: W
  } = A;
  M70("accept", Y, J, Q);
  let X = B ? I31(B, W, Z) : [];
  I(), G.onAllow(G.input, X)
}
// @from(Start 11884348, End 11884579)
function Xn5(A, Q) {
  let {
    messageId: B,
    toolUseConfirm: G,
    onDone: Z,
    onReject: I,
    completionType: Y,
    languageName: J
  } = A;
  M70("reject", Y, J, B, Q?.hasFeedback), Z(), I(), G.onReject(Q?.feedback)
}
// @from(Start 11884584, End 11884587)
Sf2
// @from(Start 11884593, End 11884716)
_f2 = L(() => {
  xn();
  c5();
  EJ();
  Sf2 = {
    "accept-once": Jn5,
    "accept-session": Wn5,
    reject: Xn5
  }
})
// @from(Start 11884719, End 11885843)
function kf2({
  filePath: A,
  completionType: Q,
  languageName: B,
  toolUseConfirm: G,
  onDone: Z,
  onReject: I,
  parseInput: Y,
  operationType: J = "write",
  onRejectFeedbackChange: W
}) {
  let [X] = OQ(), V = X.toolPermissionContext, F = Y31.useMemo(() => Pf2({
    filePath: A,
    toolPermissionContext: V,
    operationType: J,
    onRejectFeedbackChange: W
  }), [A, V, J, W]), K = Y31.useCallback((D, H, C) => {
    let E = {
        messageId: G.assistantMessage.message.id,
        path: A,
        toolUseConfirm: G,
        toolPermissionContext: V,
        onDone: Z,
        onReject: I,
        completionType: Q,
        languageName: B,
        operationType: J
      },
      U = G.onAllow;
    G.onAllow = (w, N) => {
      U(H, N)
    };
    let q = Sf2[D.type];
    q(E, {
      feedback: C,
      hasFeedback: !!C
    })
  }, [A, Q, B, G, V, Z, I, J]);
  return f1((D, H) => {
    if (HU.check(D, H)) {
      let C = F.find((E) => E.option.type === "accept-session");
      if (C) {
        let E = Y(G.input);
        K(C.option, E)
      }
    }
  }), {
    options: F,
    onChange: K
  }
}
// @from(Start 11885848, End 11885851)
Y31
// @from(Start 11885857, End 11885937)
yf2 = L(() => {
  hA();
  Up();
  jf2();
  _f2();
  z9();
  Y31 = BA(VA(), 1)
})
// @from(Start 11886028, End 11887429)
function xf2({
  onChange: A,
  toolUseContext: Q,
  filePath: B,
  edits: G,
  editMode: Z
}) {
  let I = Bg.useRef(!1),
    [Y, J] = Bg.useState(!1),
    W = Bg.useMemo(() => Vn5().slice(0, 6), []),
    X = Bg.useMemo(() => `✻ [Claude Code] ${Fn5(B)} (${W}) ⧉`, [B, W]),
    V = SQ1(Q.options.mcpClients) && N1().diffTool === "auto" && !B.endsWith(".ipynb"),
    F = kQ1(Q.options.mcpClients) ?? "IDE";
  async function K() {
    if (!V) return;
    try {
      GA("tengu_ext_will_show_diff", {});
      let {
        oldContent: D,
        newContent: H
      } = await Dn5(B, G, Q, X);
      if (I.current) return;
      GA("tengu_ext_diff_accepted", {});
      let C = Kn5(B, D, H, Z);
      if (C.length === 0) {
        GA("tengu_ext_diff_rejected", {});
        let E = uU(Q.options.mcpClients);
        if (E) await O70(X, E);
        A({
          type: "reject"
        }, {
          file_path: B,
          edits: G
        });
        return
      }
      A({
        type: "accept-once"
      }, {
        file_path: B,
        edits: C
      })
    } catch (D) {
      AA(D), J(!0)
    }
  }
  return Bg.useEffect(() => {
    return K(), () => {
      I.current = !0
    }
  }, []), {
    closeTabInIDE() {
      let D = uU(Q.options.mcpClients);
      if (!D) return Promise.resolve();
      return O70(X, D)
    },
    showingDiffInIDE: V && !Y,
    ideName: F,
    hasError: Y
  }
}
// @from(Start 11887431, End 11887734)
function Kn5(A, Q, B, G) {
  let Z = G === "single",
    I = WI2({
      filePath: A,
      oldContent: Q,
      newContent: B,
      singleHunk: Z
    });
  if (I.length === 0) return [];
  if (Z && I.length > 1) AA(Error(`Unexpected number of hunks: ${I.length}. Expected 1 hunk.`));
  return KI2(I)
}
// @from(Start 11887735, End 11889079)
async function Dn5(A, Q, B, G) {
  let Z = !1,
    I = RA(),
    Y = b9(A),
    J = I.existsSync(Y) ? _q(Y) : "";
  async function W() {
    if (Z) return;
    Z = !0;
    try {
      await O70(G, X)
    } catch (V) {
      AA(V)
    }
    process.off("beforeExit", W), B.abortController.signal.removeEventListener("abort", W)
  }
  B.abortController.signal.addEventListener("abort", W), process.on("beforeExit", W);
  let X = uU(B.options.mcpClients);
  try {
    let {
      updatedFile: V
    } = hMA({
      filePath: Y,
      fileContents: J,
      edits: Q
    });
    if (!X || X.type !== "connected") throw Error("IDE client not available");
    let F = Y,
      K = X.config.ideRunningInWindows === !0;
    if (dQ() === "wsl" && K && process.env.WSL_DISTRO_NAME) F = new $IA(process.env.WSL_DISTRO_NAME).toIDEPath(Y);
    let D = await Jh("openDiff", {
        old_file_path: F,
        new_file_path: F,
        new_file_contents: V,
        tab_name: G
      }, X),
      H = Array.isArray(D) ? D : [D];
    if (En5(H)) return W(), {
      oldContent: J,
      newContent: H[1].text
    };
    else if (Hn5(H)) return W(), {
      oldContent: J,
      newContent: V
    };
    else if (Cn5(H)) return W(), {
      oldContent: J,
      newContent: J
    };
    throw Error("Not accepted")
  } catch (V) {
    throw AA(V), W(), V
  }
}
// @from(Start 11889080, End 11889281)
async function O70(A, Q) {
  try {
    if (!Q || Q.type !== "connected") throw Error("IDE client not available");
    await Jh("close_tab", {
      tab_name: A
    }, Q)
  } catch (B) {
    AA(B)
  }
}
// @from(Start 11889283, End 11889463)
function Hn5(A) {
  return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "TAB_CLOSED"
}
// @from(Start 11889465, End 11889648)
function Cn5(A) {
  return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "DIFF_REJECTED"
}
// @from(Start 11889650, End 11889783)
function En5(A) {
  return Array.isArray(A) && A[0]?.type === "text" && A[0].text === "FILE_SAVED" && typeof A[1].text === "string"
}
// @from(Start 11889788, End 11889790)
Bg
// @from(Start 11889796, End 11889931)
vf2 = L(() => {
  AQ();
  P1A();
  Rh();
  g1();
  jQ();
  nY();
  q0();
  nY();
  yI();
  De1();
  Q3();
  R9();
  Bg = BA(VA(), 1)
})
// @from(Start 11889976, End 11891390)
function bf2({
  onChange: A,
  options: Q,
  input: B,
  filePath: G,
  ideName: Z,
  onRejectFeedbackChange: I
}) {
  let [Y, J] = vq.useState(""), [W, X] = vq.useState(null), V = (K) => {
    J(K), I?.(K)
  }, F = Q.map((K) => {
    if (K.type === "input" && I) return {
      ...K,
      onChange: V
    };
    return K
  });
  return vq.default.createElement(S, {
    flexDirection: "column"
  }, vq.default.createElement(D3, {
    dividerColor: "permission"
  }), vq.default.createElement(S, {
    marginX: 1,
    flexDirection: "column",
    gap: 1
  }, vq.default.createElement($, {
    bold: !0,
    color: "permission"
  }, "Opened changes in ", Z, " ⧉"), KLA() && vq.default.createElement($, {
    dimColor: !0
  }, "Save file to continue…"), vq.default.createElement(S, {
    flexDirection: "column"
  }, vq.default.createElement($, null, "Do you want to make this edit to", " ", vq.default.createElement($, {
    bold: !0
  }, zn5(G)), "?"), vq.default.createElement(M0, {
    options: F,
    onChange: (K) => {
      let D = Q.find((H) => H.value === K);
      if (D) {
        if (D.option.type === "reject") {
          if (Y.trim() === "") {
            X("no");
            return
          }
          A(D.option, B, Y);
          return
        }
        A(D.option, B)
      }
    },
    onCancel: () => A({
      type: "reject"
    }, B),
    onFocus: X,
    focusValue: W || void 0
  }))))
}
// @from(Start 11891395, End 11891397)
vq
// @from(Start 11891403, End 11891472)
ff2 = L(() => {
  hA();
  J5();
  nY();
  BK();
  vq = BA(VA(), 1)
})
// @from(Start 11891475, End 11893916)
function bn({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  title: Z,
  subtitle: I,
  question: Y = "Do you want to proceed?",
  content: J,
  completionType: W = "tool_use_single",
  languageName: X = "none",
  path: V,
  parseInput: F,
  operationType: K = "write",
  ideDiffSupport: D
}) {
  let H = aE.useMemo(() => ({
    completion_type: W,
    language_name: X
  }), [W, X]);
  V$(A, H);
  let [C, E] = aE.useState(""), [U, q] = aE.useState(null), w = kf2({
    filePath: V || "",
    completionType: W,
    languageName: X,
    toolUseConfirm: A,
    onDone: B,
    onReject: G,
    parseInput: F,
    operationType: K,
    onRejectFeedbackChange: E
  }), N = w.options, R = F(A.input), T = D ? D.getConfig(R) : null, y = T ? {
    onChange: (e, l) => {
      let k = D.applyChanges(R, l.edits);
      w.onChange(e, k)
    },
    toolUseContext: Q,
    filePath: T.filePath,
    edits: (T.edits || []).map((e) => ({
      old_string: e.old_string,
      new_string: e.new_string,
      replace_all: e.replace_all || !1
    })),
    editMode: T.editMode || "single"
  } : {
    onChange: () => {},
    toolUseContext: Q,
    filePath: "",
    edits: [],
    editMode: "single"
  }, {
    closeTabInIDE: v,
    showingDiffInIDE: x,
    ideName: p
  } = xf2(y), u = (e, l) => {
    e.type, v?.(), w.onChange(e, R, l?.trim())
  };
  if (x && T && V) return aE.default.createElement(bf2, {
    onChange: (e, l, k) => u(e, k),
    options: N,
    filePath: V,
    input: R,
    ideName: p,
    onRejectFeedbackChange: E
  });
  return aE.default.createElement(aE.default.Fragment, null, aE.default.createElement(uJ, {
    title: Z,
    subtitle: I,
    innerPaddingX: 0
  }, J, aE.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, typeof Y === "string" ? aE.default.createElement($, null, Y) : Y, aE.default.createElement(M0, {
    options: N,
    onChange: (e) => {
      let l = N.find((k) => k.value === e);
      if (l) {
        if (l.option.type === "reject") {
          if (C.trim() === "") {
            q("no");
            return
          }
          u(l.option, C);
          return
        }
        u(l.option)
      }
    },
    onCancel: () => u({
      type: "reject"
    }),
    onFocus: q,
    focusValue: U || void 0
  }))), aE.default.createElement(S, {
    paddingX: 1,
    marginTop: 1
  }, aE.default.createElement($, {
    dimColor: !0
  }, "Esc to exit")))
}
// @from(Start 11893921, End 11893923)
aE
// @from(Start 11893929, End 11894025)
UTA = L(() => {
  hA();
  J5();
  wO();
  vn();
  yf2();
  vf2();
  ff2();
  aE = BA(VA(), 1)
})
// @from(Start 11894028, End 11894196)
function J31(A, Q, B, G) {
  return {
    filePath: A,
    edits: [{
      old_string: Q,
      new_string: B,
      replace_all: G
    }],
    editMode: "single"
  }
}
// @from(Start 11894282, End 11895177)
function hf2(A) {
  let Q = (J) => {
      return lD.inputSchema.parse(J)
    },
    B = Q(A.toolUseConfirm.input),
    {
      file_path: G,
      old_string: Z,
      new_string: I,
      replace_all: Y
    } = B;
  return $TA.default.createElement(bn, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: "Edit file",
    subtitle: $n5(W0(), G),
    question: $TA.default.createElement($, null, "Do you want to make this edit to", " ", $TA.default.createElement($, {
      bold: !0
    }, Un5(G)), "?"),
    content: $TA.default.createElement(Of2, {
      file_path: G,
      edits: [{
        old_string: Z,
        new_string: I,
        replace_all: Y || !1
      }]
    }),
    path: G,
    completionType: "str_replace_single",
    languageName: vWA(G),
    parseInput: Q,
    ideDiffSupport: wn5
  })
}
// @from(Start 11895182, End 11895185)
$TA
// @from(Start 11895187, End 11895190)
wn5
// @from(Start 11895196, End 11895599)
gf2 = L(() => {
  hA();
  zn();
  Rf2();
  R9();
  UTA();
  U2();
  $TA = BA(VA(), 1), wn5 = {
    getConfig: (A) => J31(A.file_path, A.old_string, A.new_string, A.replace_all),
    applyChanges: (A, Q) => {
      let B = Q[0];
      if (B) return {
        ...A,
        old_string: B.old_string,
        new_string: B.new_string,
        replace_all: B.replace_all
      };
      return A
    }
  }
})
// @from(Start 11895602, End 11895868)
function fn(A, {
  assistantMessage: {
    message: {
      id: Q
    }
  }
}, B, G) {
  CY({
    completion_type: A,
    event: B,
    metadata: {
      language_name: "none",
      message_id: Q,
      platform: d0.platform,
      hasFeedback: G ?? !1
    }
  })
}
// @from(Start 11895873, End 11895906)
R70 = L(() => {
  c5();
  xn()
})
// @from(Start 11895938, End 11896216)
function qn5(A) {
  switch (A.length) {
    case 0:
      return "";
    case 1:
      return tA.bold(A[0]);
    case 2:
      return tA.bold(A[0]) + " and " + tA.bold(A[1]);
    default:
      return tA.bold(A.slice(0, -1).join(", ")) + ", and " + tA.bold(A.slice(-1)[0])
  }
}
// @from(Start 11896218, End 11896310)
function uf2(A) {
  let Q = qn5(A);
  if (Q.length > 50) return "similar";
  else return Q
}
// @from(Start 11896312, End 11896602)
function W31(A) {
  if (A.length === 0) return "";
  let Q = A.map((B) => {
    let G = B.split("/").pop() || B;
    return tA.bold(G) + X31.sep
  });
  if (Q.length === 1) return Q[0];
  if (Q.length === 2) return `${Q[0]} and ${Q[1]}`;
  return `${Q[0]}, ${Q[1]} and ${A.length-2} more`
}
// @from(Start 11896604, End 11898327)
function Nn5(A) {
  let Q = A.filter((V) => V.type === "addRules").flatMap((V) => V.rules || []),
    B = Q.filter((V) => V.toolName === "Read"),
    G = Q.filter((V) => V.toolName === "Bash"),
    Z = A.filter((V) => V.type === "addDirectories").flatMap((V) => V.directories || []),
    I = B.map((V) => V.ruleContent?.replace("/**", "") || "").filter((V) => V),
    Y = G.flatMap((V) => {
      if (!V.ruleContent) return [];
      let F = co1(V.ruleContent) ?? V.ruleContent,
        {
          commandWithoutRedirections: K,
          redirections: D
        } = nT(F);
      return D.length > 0 ? K : F
    }),
    J = Z.length > 0,
    W = I.length > 0,
    X = Y.length > 0;
  if (W && !J && !X) {
    if (I.length === 1) {
      let V = I[0],
        F = V.split("/").pop() || V;
      return `Yes, allow reading from ${tA.bold(F)}${X31.sep} from this project`
    }
    return `Yes, allow reading from ${W31(I)} from this project`
  }
  if (J && !W && !X) {
    if (Z.length === 1) {
      let V = Z[0],
        F = V.split("/").pop() || V;
      return `Yes, and always allow access to ${tA.bold(F)}${X31.sep} from this project`
    }
    return `Yes, and always allow access to ${W31(Z)} from this project`
  }
  if (X && !J && !W) return `Yes, and don't ask again for ${uf2(Y)} commands in ${tA.bold(uQ())}`;
  if ((J || W) && !X) {
    let V = [...Z, ...I];
    if (J && W) return `Yes, and always allow access to ${W31(V)} from this project`
  }
  if ((J || W) && X) {
    let V = [...Z, ...I],
      F = W31(V),
      K = uf2(Y);
    if (V.length === 1 && Y.length === 1) return `Yes, and allow access to ${F} and ${K} commands`;
    return `Yes, and allow ${F} access and ${K} commands`
  }
  return null
}
// @from(Start 11898329, End 11898744)
function mf2({
  suggestions: A = [],
  onRejectFeedbackChange: Q
}) {
  let B = [{
    label: "Yes",
    value: "yes"
  }];
  if (A.length > 0) {
    let G = Nn5(A);
    if (G) B.push({
      label: G,
      value: "yes-apply-suggestions"
    })
  }
  return B.push({
    type: "input",
    label: "No",
    value: "no",
    placeholder: "Type here to tell Claude what to do differently",
    onChange: Q
  }), B
}
// @from(Start 11898749, End 11898799)
df2 = L(() => {
  F9();
  _0();
  ao1();
  bU()
})
// @from(Start 11898802, End 11899289)
function Ln5(A) {
  switch (A) {
    case "cliArg":
      return "CLI argument";
    case "command":
      return "command configuration";
    case "session":
      return "current session";
    case "localSettings":
      return "local settings";
    case "projectSettings":
      return "project settings";
    case "policySettings":
      return "managed settings";
    case "userSettings":
      return "global settings";
    case "flagSettings":
      return "--settings flag"
  }
}
// @from(Start 11899291, End 11900014)
function cf2(A) {
  switch (A.type) {
    case "rule":
      return `${tA.bold(B3(A.rule.ruleValue))} rule from ${Ln5(A.rule.source)}`;
    case "mode":
      return `${Fv(A.mode)} mode`;
    case "sandboxOverride":
      return "Requires permission to bypass sandbox";
    case "workingDir":
      return A.reason;
    case "other":
      return A.reason;
    case "permissionPromptTool":
      return `${tA.bold(A.permissionPromptToolName)} permission prompt tool`;
    case "hook":
      return A.reason ? `${tA.bold(A.hookName)} hook: ${A.reason}` : `${tA.bold(A.hookName)} hook`;
    case "asyncAgent":
      return A.reason;
    case "classifier":
      return `${tA.bold(A.classifier)} classifier: ${A.reason}`
  }
}
// @from(Start 11900016, End 11901175)
function Mn5({
  title: A,
  decisionReason: Q
}) {
  let [B] = qB();

  function G() {
    switch (Q.type) {
      case "subcommandResults":
        return B4.default.createElement(S, {
          flexDirection: "column"
        }, Array.from(Q.reasons.entries()).map(([Z, I]) => {
          let Y = I.behavior === "allow" ? ZB("success", B)(H1.tick) : ZB("error", B)(H1.cross);
          return B4.default.createElement(S, {
            flexDirection: "column",
            key: Z
          }, B4.default.createElement($, null, Y, " ", Z), I.decisionReason !== void 0 && I.decisionReason.type !== "subcommandResults" && B4.default.createElement($, null, "  ", "⎿", "  ", cf2(I.decisionReason)), I.behavior === "ask" && (() => {
            let J = z9A(I.suggestions);
            return J.length > 0 ? B4.default.createElement($, null, "  ", "⎿", "  ", "Suggested rules:", " ", J.map((W) => tA.bold(B3(W))).join(", ")) : null
          })())
        }));
      default:
        return B4.default.createElement($, null, cf2(Q))
    }
  }
  return B4.default.createElement(S, {
    flexDirection: "column"
  }, A && B4.default.createElement($, null, A), G())
}
// @from(Start 11901177, End 11901370)
function On5(A) {
  if (!A) return [];
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "addDirectories":
        return Q.directories;
      default:
        return []
    }
  })
}
// @from(Start 11901372, End 11901529)
function Rn5(A) {
  if (!A) return;
  for (let Q = A.length - 1; Q >= 0; Q--) {
    let B = A[Q];
    if (B?.type === "setMode") return B.mode
  }
  return
}
// @from(Start 11901531, End 11903567)
function Tn5({
  suggestions: A,
  width: Q
}) {
  if (!A || A.length === 0) return B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Suggestions ")), B4.default.createElement($, null, "None"));
  let B = z9A(A),
    G = On5(A),
    Z = Rn5(A);
  if (B.length === 0 && G.length === 0 && !Z) return B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Suggestion ")), B4.default.createElement($, null, "None"));
  return B4.default.createElement(S, {
    flexDirection: "column"
  }, B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Suggestions ")), B4.default.createElement($, null, " ")), B.length > 0 && B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, " Rules ")), B4.default.createElement(S, {
    flexDirection: "column"
  }, B.map((I, Y) => B4.default.createElement($, {
    key: Y
  }, H1.bullet, " ", B3(I))))), G.length > 0 && B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, " Directories ")), B4.default.createElement(S, {
    flexDirection: "column"
  }, G.map((I, Y) => B4.default.createElement($, {
    key: Y
  }, H1.bullet, " ", I)))), Z && B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: Q
  }, B4.default.createElement($, {
    dimColor: !0
  }, " Mode ")), B4.default.createElement($, null, Fv(Z))))
}
// @from(Start 11903569, End 11904725)
function pf2({
  permissionResult: A
}) {
  let Q = A.decisionReason,
    B = "suggestions" in A ? A.suggestions : void 0,
    G = 10;
  return B4.default.createElement(S, {
    flexDirection: "column"
  }, B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: 10
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Behavior ")), B4.default.createElement($, null, A.behavior)), A.behavior !== "allow" && B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: 10
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Message ")), B4.default.createElement($, null, A.message)), B4.default.createElement(S, {
    flexDirection: "row"
  }, B4.default.createElement(S, {
    justifyContent: "flex-end",
    minWidth: 10
  }, B4.default.createElement($, {
    dimColor: !0
  }, "Reason ")), Q === void 0 ? B4.default.createElement($, null, "undefined") : B4.default.createElement(Mn5, {
    decisionReason: Q
  })), B4.default.createElement(Tn5, {
    suggestions: B,
    width: 10
  }))
}
// @from(Start 11904730, End 11904732)
B4
// @from(Start 11904738, End 11904823)
lf2 = L(() => {
  hA();
  AZ();
  F9();
  V9();
  Zw();
  cK();
  B4 = BA(VA(), 1)
})
// @from(Start 11904826, End 11905577)
function Pn5(A, Q) {
  if (!A) return null;
  switch (A.type) {
    case "rule":
      return {
        reasonString: `Permission rule ${tA.bold(B3(A.rule.ruleValue))} requires confirmation for this ${Q}.`, configString: A.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
      };
    case "hook": {
      let B = A.reason ? `:
${A.reason}` : ".";
      return {
        reasonString: `Hook ${tA.bold(A.hookName)} requires confirmation for this ${Q}${B}`,
        configString: "/hooks to update"
      }
    }
    case "classifier":
      return {
        reasonString: `Classifier ${tA.bold(A.classifier)} requires confirmation for this ${Q}.
${A.reason}`, configString: void 0
      };
    default:
      return null
  }
}
// @from(Start 11905579, End 11905930)
function VC({
  permissionResult: A,
  toolType: Q
}) {
  let B = Pn5(A?.decisionReason, Q);
  if (!B) return null;
  return V31.default.createElement(S, {
    marginBottom: 1,
    flexDirection: "column"
  }, V31.default.createElement($, null, B.reasonString), B.configString && V31.default.createElement($, {
    dimColor: !0
  }, B.configString))
}
// @from(Start 11905935, End 11905938)
V31
// @from(Start 11905944, End 11906005)
Gg = L(() => {
  hA();
  AZ();
  F9();
  V31 = BA(VA(), 1)
})