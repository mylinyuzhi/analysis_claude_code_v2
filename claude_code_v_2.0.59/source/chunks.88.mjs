
// @from(Start 8327330, End 8330349)
async function Kq({
  apiKey: A,
  maxRetries: Q,
  model: B,
  fetchOverride: G
}) {
  let Z = process.env.CLAUDE_CODE_CONTAINER_ID,
    I = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
    Y = {
      "x-app": "cli",
      "User-Agent": fc(),
      ...jA5(),
      ...Z ? {
        "x-claude-remote-container-id": Z
      } : {},
      ...I ? {
        "x-claude-remote-session-id": I
      } : {}
    };
  if (Y0(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) Y["x-anthropic-additional-protection"] = "true";
  if (await Qt(), !BB()) PA5(Y, N6());
  let W = {
    defaultHeaders: Y,
    maxRetries: Q,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
    dangerouslyAllowBrowser: !0,
    fetchOptions: b3A(),
    ...G && {
      fetch: G
    }
  };
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    let V = B === MW() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : hBA(),
      F = {
        ...W,
        awsRegion: V,
        ...Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && {
          skipAuth: !0
        },
        ...gj() && {
          logger: a11()
        }
      };
    if (process.env.AWS_BEARER_TOKEN_BEDROCK) F.skipAuth = !0, F.defaultHeaders = {
      ...F.defaultHeaders,
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
    };
    else if (!Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
      let K = await h3A();
      if (K) F.awsAccessKey = K.accessKeyId, F.awsSecretKey = K.secretAccessKey, F.awsSessionToken = K.sessionToken
    }
    return new utA(F)
  }
  if (Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    let V;
    if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
      if (Y0(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) V = () => Promise.resolve("");
      else V = or1(new n11, "https://cognitiveservices.azure.com/.default");
    let F = {
      ...W,
      ...V && {
        azureADTokenProvider: V
      },
      ...gj() && {
        logger: a11()
      }
    };
    return new ptA(F)
  }
  if (Y0(process.env.CLAUDE_CODE_USE_VERTEX)) {
    let V = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project,
      F = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials,
      K = Y0(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
        getClient: () => ({
          getRequestHeaders: () => ({})
        })
      } : new zeB.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        ...V || F ? {} : {
          projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
        }
      }),
      D = {
        ...W,
        region: k_A(B),
        googleAuth: K,
        ...gj() && {
          logger: a11()
        }
      };
    return new beA(D)
  }
  let X = {
    apiKey: BB() ? null : A || Kw(),
    authToken: BB() ? M6()?.accessToken : void 0,
    ...{},
    ...W,
    ...gj() && {
      logger: a11()
    }
  };
  return new MT(X)
}
// @from(Start 8330351, End 8330468)
function PA5(A, Q) {
  let B = process.env.ANTHROPIC_AUTH_TOKEN || fzA(Q);
  if (B) A.Authorization = `Bearer ${B}`
}
// @from(Start 8330470, End 8330794)
function jA5() {
  let A = {},
    Q = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!Q) return A;
  let B = Q.split(/\n|\r\n/);
  for (let G of B) {
    if (!G.trim()) continue;
    let Z = G.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (Z) {
      let [, I, Y] = Z;
      if (I && Y !== void 0) A[I] = Y
    }
  }
  return A
}
// @from(Start 8330799, End 8330802)
zeB
// @from(Start 8330808, End 8330955)
oZA = L(() => {
  $hB();
  OhB();
  p_();
  kpB();
  EeB();
  gB();
  _0();
  AE();
  hQ();
  _c();
  NX();
  V0();
  t2();
  zeB = BA(fi1(), 1)
})
// @from(Start 8331089, End 8331119)
function tr1() {
  return !1
}
// @from(Start 8331120, End 8331731)
async function SA5(A, Q, B) {
  if (!tr1()) return await B();
  let G = weB("sha1").update(JSON.stringify(A)).digest("hex").slice(0, 12),
    Z = qeB(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? W0(), `fixtures/${Q}-${G}.json`);
  if (RA().existsSync(Z)) return JSON.parse(RA().readFileSync(Z, {
    encoding: "utf8"
  }));
  if (d0.isCI) throw Error(`Fixture missing: ${Z}. Re-run npm test locally, then commit the result.`);
  let I = await B();
  if (!RA().existsSync(s11(Z))) RA().mkdirSync(s11(Z));
  return RA().writeFileSync(Z, JSON.stringify(I, null, 2), {
    encoding: "utf8",
    flush: !1
  }), I
}
// @from(Start 8331732, End 8332753)
async function er1(A, Q) {
  if (!tr1()) return await Q();
  let B = WZ(A.filter((Y) => {
      if (Y.type !== "user") return !0;
      if (Y.isMeta) return !1;
      return !0
    })),
    G = kA5(B.map((Y) => Y.message.content), $eB),
    Z = qeB(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? W0(), `fixtures/${G.map((Y)=>weB("sha1").update(JSON.stringify(Y)).digest("hex").slice(0,6)).join("-")}.json`);
  if (RA().existsSync(Z)) {
    let Y = JSON.parse(RA().readFileSync(Z, {
      encoding: "utf8"
    }));
    return Y.output.forEach(_A5), Y.output.map((J, W) => UeB(J, xA5, W))
  }
  if (d0.isCI) throw Error(`Anthropic API fixture missing: ${Z}. Re-run npm test locally, then commit the result. Input messages:
${JSON.stringify(G,null,2)}`);
  let I = await Q();
  if (d0.isCI) return I;
  if (!RA().existsSync(s11(Z))) RA().mkdirSync(s11(Z));
  return RA().writeFileSync(Z, JSON.stringify({
    input: G,
    output: I.map((Y, J) => UeB(Y, $eB, J))
  }, null, 2), {
    encoding: "utf8",
    flush: !1
  }), I
}
// @from(Start 8332755, End 8332901)
function _A5(A) {
  if (A.type === "stream_event") return;
  let Q = A.message.model,
    B = A.message.usage,
    G = fiA(Q, B);
  xiA(G, B, Q)
}
// @from(Start 8332903, End 8333905)
function kA5(A, Q) {
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
            ...G, input: r11(G.input, Q)
          };
        case "image":
          return G;
        default:
          return
      }
    })
  })
}
// @from(Start 8333907, End 8334075)
function r11(A, Q) {
  return ns(A, (B, G) => {
    if (Array.isArray(B)) return B.map((Z) => r11(Z, Q));
    if (C2A(B)) return r11(B, Q);
    return Q(B, G, A)
  })
}
// @from(Start 8334077, End 8334639)
function yA5(A, Q, B) {
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
              ...G, input: r11(G.input, Q)
            };
          default:
            return G
        }
      }).filter(Boolean)
    },
    type: "assistant"
  }
}
// @from(Start 8334641, End 8334733)
function UeB(A, Q, B) {
  if (A.type === "assistant") return yA5(A, Q, B);
  else return A
}
// @from(Start 8334735, End 8335210)
function $eB(A) {
  if (typeof A !== "string") return A;
  let Q = A.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replace(/\//g, NeB.sep).replaceAll(MQ(), "[CONFIG_HOME]").replaceAll(W0(), "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
  if (Q.includes("Files modified by user:")) return "Files modified by user: [FILES]";
  return Q
}
// @from(Start 8335212, End 8335398)
function xA5(A) {
  if (typeof A !== "string") return A;
  return A.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", MQ()).replaceAll("[CWD]", W0())
}
// @from(Start 8335399, End 8335637)
async function* Ao1(A, Q) {
  if (!tr1()) return yield* Q();
  let B = [],
    G = await er1(A, async () => {
      for await (let Z of Q()) B.push(Z);
      return B
    });
  if (G.length > 0) {
    yield* G;
    return
  }
  yield* B
}
// @from(Start 8335638, End 8335800)
async function LeB(A, Q, B) {
  return (await SA5({
    messages: A,
    tools: Q
  }, "token-count", async () => ({
    tokenCount: await B()
  }))).tokenCount
}
// @from(Start 8335805, End 8335897)
Qo1 = L(() => {
  c5();
  U2();
  hQ();
  AQ();
  vkA();
  qxA();
  cQ();
  hiA();
  M_()
})
// @from(Start 8335900, End 8336182)
function MeB(A) {
  for (let Q of A)
    if (Q.role === "assistant" && Array.isArray(Q.content)) {
      for (let B of Q.content)
        if (typeof B === "object" && B !== null && "type" in B && (B.type === "thinking" || B.type === "redacted_thinking")) return !0
    } return !1
}
// @from(Start 8336183, End 8336287)
async function OeB(A) {
  if (!A) return 0;
  return bNA([{
    role: "user",
    content: A
  }], [])
}
// @from(Start 8336288, End 8337089)
async function bNA(A, Q) {
  return LeB(A, Q, async () => {
    try {
      let B = k3(),
        G = await Kq({
          maxRetries: 1,
          model: B
        }),
        Z = Dw(B),
        I = MeB(A),
        Y = await G.beta.messages.countTokens({
          model: ac(B),
          messages: A.length > 0 ? A : [{
            role: "user",
            content: "foo"
          }],
          tools: Q,
          ...Z.length > 0 ? {
            betas: Z
          } : {},
          ...I ? {
            thinking: {
              type: "enabled",
              budget_tokens: 1024
            },
            max_tokens: 2048
          } : {}
        });
      if (typeof Y.input_tokens !== "number") return null;
      return Y.input_tokens
    } catch (B) {
      return AA(B), null
    }
  })
}
// @from(Start 8337091, End 8337143)
function gG(A) {
  return Math.round(A.length / 4)
}
// @from(Start 8337144, End 8338069)
async function ReB(A, Q) {
  let B = MeB(A),
    G = Y0(process.env.CLAUDE_CODE_USE_VERTEX) && k_A(MW()) === "global",
    Z = Y0(process.env.CLAUDE_CODE_USE_BEDROCK) && B,
    I = Y0(process.env.CLAUDE_CODE_USE_VERTEX) && B,
    Y = G || Z || I ? XU() : X7A(),
    J = await Kq({
      maxRetries: 1,
      model: Y
    }),
    W = A.length > 0 ? A : [{
      role: "user",
      content: "count"
    }],
    X = Dw(Y),
    F = (await J.beta.messages.create({
      model: ac(Y),
      max_tokens: B ? 2048 : 1,
      messages: W,
      tools: Q.length > 0 ? Q : void 0,
      ...X.length > 0 ? {
        betas: X
      } : {},
      metadata: Rl(),
      ...o11(),
      ...B ? {
        thinking: {
          type: "enabled",
          budget_tokens: 1024
        }
      } : {}
    })).usage,
    K = F.input_tokens,
    D = F.cache_creation_input_tokens || 0,
    H = F.cache_read_input_tokens || 0;
  return K + D + H
}
// @from(Start 8338071, End 8338386)
function TeB(A) {
  if (A.type !== "assistant" || !A.message?.content) return 0;
  let Q = "";
  if (typeof A.message.content === "string") Q = A.message.content;
  else if (Array.isArray(A.message.content)) Q = A.message.content.filter((B) => B.type === "text").map((B) => B.text || "").join(`
`);
  return gG(Q)
}
// @from(Start 8338391, End 8338473)
xM = L(() => {
  oZA();
  g1();
  t2();
  CS();
  t2();
  fZ();
  hQ();
  Qo1()
})
// @from(Start 8338476, End 8338733)
function S0({
  children: A,
  height: Q
}) {
  if (PeB.useContext(jeB)) return A;
  return lT.createElement(vA5, null, lT.createElement(S, {
    flexDirection: "row",
    height: Q,
    overflowY: "hidden"
  }, lT.createElement($, null, "  ", "⎿  "), A))
}
// @from(Start 8338735, End 8338834)
function vA5({
  children: A
}) {
  return lT.createElement(jeB.Provider, {
    value: !0
  }, A)
}
// @from(Start 8338839, End 8338841)
lT
// @from(Start 8338843, End 8338846)
PeB
// @from(Start 8338848, End 8338851)
jeB
// @from(Start 8338857, End 8338950)
q8 = L(() => {
  hA();
  lT = BA(VA(), 1), PeB = BA(VA(), 1);
  jeB = lT.createContext(!1)
})
// @from(Start 8338953, End 8339159)
function zk() {
  return Ek.createElement(Ek.Fragment, null, Ek.createElement($, {
    color: "error"
  }, "Interrupted "), Ek.createElement($, {
    dimColor: !0
  }, "· What should Claude do instead?"))
}
// @from(Start 8339164, End 8339166)
Ek
// @from(Start 8339172, End 8339217)
tZA = L(() => {
  hA();
  Ek = BA(VA(), 1)
})
// @from(Start 8339220, End 8339318)
function k5() {
  return fNA.createElement(S0, {
    height: 1
  }, fNA.createElement(zk, null))
}
// @from(Start 8339323, End 8339326)
fNA
// @from(Start 8339332, End 8339386)
iX = L(() => {
  q8();
  tZA();
  fNA = BA(VA(), 1)
})
// @from(Start 8339389, End 8339531)
function WB() {
  let A = SeB.useContext(Q$A);
  if (!A) throw Error("useTerminalSize must be used within an Ink App component");
  return A
}
// @from(Start 8339536, End 8339539)
SeB
// @from(Start 8339545, End 8339591)
i8 = L(() => {
  QsA();
  SeB = BA(VA(), 1)
})
// @from(Start 8339594, End 8339918)
function E4({
  shortcut: A,
  action: Q,
  parens: B = !1,
  bold: G = !1
}) {
  let Z = G ? eZA.default.createElement($, {
    bold: !0
  }, A) : A;
  if (B) return eZA.default.createElement(eZA.default.Fragment, null, "(", Z, " to ", Q, ")");
  return eZA.default.createElement(eZA.default.Fragment, null, Z, " to ", Q)
}
// @from(Start 8339923, End 8339926)
eZA
// @from(Start 8339932, End 8339977)
dF = L(() => {
  hA();
  eZA = BA(VA(), 1)
})
// @from(Start 8339980, End 8340088)
function Bo1({
  children: A
}) {
  return SAA.default.createElement(_eB.Provider, {
    value: !0
  }, A)
}
// @from(Start 8340090, End 8340308)
function Tl() {
  if (SAA.useContext(_eB)) return null;
  return SAA.default.createElement($, {
    dimColor: !0
  }, SAA.default.createElement(E4, {
    shortcut: "ctrl+o",
    action: "expand",
    parens: !0
  }))
}
// @from(Start 8340310, End 8340366)
function keB() {
  return tA.dim("(ctrl+o to expand)")
}
// @from(Start 8340371, End 8340374)
SAA
// @from(Start 8340376, End 8340379)
_eB
// @from(Start 8340385, End 8340484)
AIA = L(() => {
  hA();
  F9();
  dF();
  SAA = BA(VA(), 1), _eB = SAA.default.createContext(!1)
})
// @from(Start 8340487, End 8340701)
function Zo1(A) {
  if (Y0(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) return;
  if (process.platform === "win32") process.title = A ? `✳ ${A}` : A;
  else process.stdout.write(`\x1B]0;${A?`✳ ${A}`:""}\x07`)
}
// @from(Start 8340702, End 8341829)
async function yeB(A) {
  if (A.startsWith("<local-command-stdout>")) return;
  let Q = "{";
  try {
    let B = await uX({
        systemPrompt: ["Analyze if this message indicates a new conversation topic. If it does, extract a 2-3 word title that captures the new topic. Format your response as a JSON object with two fields: 'isNewTopic' (boolean) and 'title' (string, or null if isNewTopic is false). Only include these fields, no other text. ONLY generate the JSON object, no other text (eg. no markdown)."],
        userPrompt: A,
        assistantPrompt: Q,
        signal: new AbortController().signal,
        options: {
          querySource: "terminal_update_title",
          agents: [],
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          mcpTools: [],
          agentIdOrSessionId: e1()
        }
      }),
      G = Q + B.message.content.filter((I) => I.type === "text").map((I) => I.text).join(""),
      Z = f7(G);
    if (Z && typeof Z === "object" && "isNewTopic" in Z && "title" in Z) {
      if (Z.isNewTopic && Z.title) Zo1(Z.title)
    }
  } catch (B) {
    AA(B)
  }
}
// @from(Start 8341831, End 8341957)
function kJ() {
  return new Promise((A) => {
    process.stdout.write("\x1B[2J\x1B[3J\x1B[H", () => {
      A()
    })
  })
}
// @from(Start 8341959, End 8342411)
function fA5(A, Q) {
  let B = A.split(`
`),
    G = [];
  for (let I of B)
    if (I.length <= Q) G.push(I.trimEnd());
    else
      for (let Y = 0; Y < I.length; Y += Q) G.push(I.slice(Y, Y + Q).trimEnd());
  let Z = G.length - Go1;
  if (Z === 1) return {
    aboveTheFold: G.slice(0, Go1 + 1).join(`
`).trimEnd(),
    remainingLines: 0
  };
  return {
    aboveTheFold: G.slice(0, Go1).join(`
`).trimEnd(),
    remainingLines: Math.max(0, Z)
  }
}
// @from(Start 8342413, End 8342653)
function xeB(A, Q) {
  let B = A.trimEnd();
  if (!B) return "";
  let {
    aboveTheFold: G,
    remainingLines: Z
  } = fA5(B, Math.max(Q - bA5, 10));
  return [G, Z > 0 ? tA.dim(`… +${Z} lines ${keB()}`) : ""].filter(Boolean).join(`
`)
}
// @from(Start 8342658, End 8342665)
Go1 = 3
// @from(Start 8342669, End 8342676)
bA5 = 9
// @from(Start 8342682, End 8342755)
Bh = L(() => {
  fZ();
  LF();
  g1();
  F9();
  AIA();
  hQ();
  _0()
})
// @from(Start 8342758, End 8343001)
function hA5(A) {
  try {
    let Q = JSON.parse(A),
      B = JSON.stringify(Q),
      G = A.replace(/\s+/g, ""),
      Z = B.replace(/\s+/g, "");
    if (G !== Z) return A;
    return JSON.stringify(Q, null, 2)
  } catch {
    return A
  }
}
// @from(Start 8343003, End 8343063)
function veB(A) {
  return A.split(`
`).map(hA5).join(`
`)
}
// @from(Start 8343065, End 8343370)
function _U({
  content: A,
  verbose: Q,
  isError: B
}) {
  let {
    columns: G
  } = WB(), Z = beB.useMemo(() => {
    if (Q) return t11(veB(A));
    else return t11(xeB(veB(A), G))
  }, [A, Q, G]);
  return hNA.createElement(S0, null, hNA.createElement($, {
    color: B ? "error" : void 0
  }, Z))
}
// @from(Start 8343372, End 8343491)
function t11(A) {
  return A.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "")
}
// @from(Start 8343496, End 8343499)
hNA
// @from(Start 8343501, End 8343504)
beB
// @from(Start 8343510, End 8343599)
QIA = L(() => {
  hA();
  q8();
  i8();
  Bh();
  hNA = BA(VA(), 1), beB = BA(VA(), 1)
})
// @from(Start 8343602, End 8343699)
function e11(A) {
  return A.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}
// @from(Start 8343701, End 8344593)
function Q6({
  result: A,
  verbose: Q
}) {
  let B;
  if (typeof A !== "string") B = "Tool execution failed";
  else {
    let Z = B9(A, "tool_use_error") ?? A,
      Y = e11(Z).trim();
    if (!Q && Y.includes("InputValidationError: ")) B = "Invalid tool parameters";
    else if (Y.startsWith("Error: ")) B = Y;
    else B = `Error: ${Y}`
  }
  let G = B.split(`
`).length - Io1;
  return TD.createElement(S0, null, TD.createElement(S, {
    flexDirection: "column"
  }, TD.createElement($, {
    color: "error"
  }, t11(Q ? B : B.split(`
`).slice(0, Io1).join(`
`))), !Q && B.split(`
`).length > Io1 && TD.createElement(S, null, TD.createElement($, {
    dimColor: !0
  }, "… +", G, " ", G === 1 ? "line" : "lines", " ("), TD.createElement($, {
    dimColor: !0,
    bold: !0
  }, "ctrl+o"), TD.createElement($, null, " "), TD.createElement($, {
    dimColor: !0
  }, "to see all)"))))
}
// @from(Start 8344598, End 8344600)
TD
// @from(Start 8344602, End 8344610)
Io1 = 10
// @from(Start 8344616, End 8344685)
yJ = L(() => {
  hA();
  q8();
  cQ();
  QIA();
  TD = BA(VA(), 1)
})
// @from(Start 8344735, End 8344790)
function uA5(A) {
  return gA5(4).readUInt32BE(0) % A
}
// @from(Start 8344792, End 8344837)
function Yo1(A) {
  return A[uA5(A.length)]
}
// @from(Start 8344839, End 8344939)
function ueB() {
  let A = Yo1(feB),
    Q = Yo1(geB),
    B = Yo1(heB);
  return `${A}-${Q}-${B}`
}
// @from(Start 8344944, End 8344947)
feB
// @from(Start 8344949, End 8344952)
heB
// @from(Start 8344954, End 8344957)
geB
// @from(Start 8344959, End 8344962)
s$G
// @from(Start 8344968, End 8352857)
meB = L(() => {
  feB = ["abundant", "ancient", "bright", "calm", "cheerful", "clever", "cozy", "curious", "dapper", "dazzling", "deep", "delightful", "eager", "elegant", "enchanted", "fancy", "fluffy", "gentle", "gleaming", "golden", "graceful", "happy", "hidden", "humble", "jolly", "joyful", "keen", "kind", "lively", "lovely", "lucky", "luminous", "magical", "majestic", "mellow", "merry", "mighty", "misty", "noble", "peaceful", "playful", "polished", "precious", "proud", "quiet", "quirky", "radiant", "rosy", "serene", "shiny", "silly", "sleepy", "smooth", "snazzy", "snug", "snuggly", "soft", "sparkling", "spicy", "splendid", "sprightly", "starry", "steady", "sunny", "swift", "tender", "tidy", "toasty", "tranquil", "twinkly", "valiant", "vast", "velvet", "vivid", "warm", "whimsical", "wild", "wise", "witty", "wondrous", "zany", "zesty", "zippy", "breezy", "bubbly", "buzzing", "cheeky", "cosmic", "cozy", "crispy", "crystalline", "cuddly", "drifting", "dreamy", "effervescent", "ethereal", "fizzy", "flickering", "floating", "floofy", "fluttering", "foamy", "frolicking", "fuzzy", "giggly", "glimmering", "glistening", "glittery", "glowing", "goofy", "groovy", "harmonic", "hazy", "humming", "iridescent", "jaunty", "jazzy", "jiggly", "melodic", "moonlit", "mossy", "nifty", "peppy", "prancy", "purrfect", "purring", "quizzical", "rippling", "rustling", "shimmering", "shimmying", "snappy", "snoopy", "squishy", "swirling", "ticklish", "tingly", "twinkling", "velvety", "wiggly", "wobbly", "woolly", "zazzy", "abstract", "adaptive", "agile", "async", "atomic", "binary", "cached", "compiled", "composed", "compressed", "concurrent", "cryptic", "curried", "declarative", "delegated", "distributed", "dynamic", "eager", "elegant", "encapsulated", "enumerated", "eventual", "expressive", "federated", "functional", "generic", "greedy", "hashed", "idempotent", "immutable", "imperative", "indexed", "inherited", "iterative", "lazy", "lexical", "linear", "linked", "logical", "memoized", "modular", "mutable", "nested", "optimized", "parallel", "parsed", "partitioned", "piped", "polymorphic", "pure", "reactive", "recursive", "refactored", "reflective", "replicated", "resilient", "robust", "scalable", "sequential", "serialized", "sharded", "sorted", "staged", "stateful", "stateless", "streamed", "structured", "synchronous", "synthetic", "temporal", "transient", "typed", "unified", "validated", "vectorized", "virtual"], heB = ["aurora", "avalanche", "blossom", "breeze", "brook", "bubble", "canyon", "cascade", "cloud", "clover", "comet", "coral", "cosmos", "creek", "crescent", "crystal", "dawn", "dewdrop", "dusk", "eclipse", "ember", "feather", "fern", "firefly", "flame", "flurry", "fog", "forest", "frost", "galaxy", "garden", "glacier", "glade", "grove", "harbor", "horizon", "island", "lagoon", "lake", "leaf", "lightning", "meadow", "meteor", "mist", "moon", "moonbeam", "mountain", "nebula", "nova", "ocean", "orbit", "pebble", "petal", "pine", "planet", "pond", "puddle", "quasar", "rain", "rainbow", "reef", "ripple", "river", "shore", "sky", "snowflake", "spark", "spring", "star", "stardust", "starlight", "storm", "stream", "summit", "sun", "sunbeam", "sunrise", "sunset", "thunder", "tide", "twilight", "valley", "volcano", "waterfall", "wave", "willow", "wind", "alpaca", "axolotl", "badger", "bear", "beaver", "bee", "bird", "bumblebee", "bunny", "cat", "chipmunk", "crab", "crane", "deer", "dolphin", "dove", "dragon", "dragonfly", "duckling", "eagle", "elephant", "falcon", "finch", "flamingo", "fox", "frog", "giraffe", "goose", "hamster", "hare", "hedgehog", "hippo", "hummingbird", "jellyfish", "kitten", "koala", "ladybug", "lark", "lemur", "llama", "lobster", "lynx", "manatee", "meerkat", "moth", "narwhal", "newt", "octopus", "otter", "owl", "panda", "parrot", "peacock", "pelican", "penguin", "phoenix", "piglet", "platypus", "pony", "porcupine", "puffin", "puppy", "quail", "quokka", "rabbit", "raccoon", "raven", "robin", "salamander", "seahorse", "seal", "sloth", "snail", "sparrow", "sphinx", "squid", "squirrel", "starfish", "swan", "tiger", "toucan", "turtle", "unicorn", "walrus", "whale", "wolf", "wombat", "wren", "yeti", "zebra", "acorn", "anchor", "balloon", "beacon", "biscuit", "blanket", "bonbon", "book", "boot", "cake", "candle", "candy", "castle", "charm", "clock", "cocoa", "cookie", "crayon", "crown", "cupcake", "donut", "dream", "fairy", "fiddle", "flask", "flute", "fountain", "gadget", "gem", "gizmo", "globe", "goblet", "hammock", "harp", "haven", "hearth", "honey", "journal", "kazoo", "kettle", "key", "kite", "lantern", "lemon", "lighthouse", "locket", "lollipop", "mango", "map", "marble", "marshmallow", "melody", "mitten", "mochi", "muffin", "music", "nest", "noodle", "oasis", "origami", "pancake", "parasol", "peach", "pearl", "pebble", "pie", "pillow", "pinwheel", "pixel", "pizza", "plum", "popcorn", "pretzel", "prism", "pudding", "pumpkin", "puzzle", "quiche", "quill", "quilt", "riddle", "rocket", "rose", "scone", "scroll", "shell", "sketch", "snowglobe", "sonnet", "sparkle", "spindle", "sprout", "sundae", "swing", "taco", "teacup", "teapot", "thimble", "toast", "token", "tome", "tower", "treasure", "treehouse", "trinket", "truffle", "tulip", "umbrella", "waffle", "wand", "whisper", "whistle", "widget", "wreath", "zephyr", "abelson", "adleman", "aho", "allen", "babbage", "bachman", "backus", "barto", "bengio", "bentley", "blum", "boole", "brooks", "catmull", "cerf", "cherny", "church", "clarke", "cocke", "codd", "conway", "cook", "corbato", "cray", "curry", "dahl", "diffie", "dijkstra", "dongarra", "eich", "emerson", "engelbart", "feigenbaum", "floyd", "gosling", "graham", "gray", "hamming", "hanrahan", "hartmanis", "hejlsberg", "hellman", "hennessy", "hickey", "hinton", "hoare", "hollerith", "hopcroft", "hopper", "iverson", "kahan", "kahn", "karp", "kay", "kernighan", "knuth", "kurzweil", "lamport", "lampson", "lecun", "lerdorf", "liskov", "lovelace", "matsumoto", "mccarthy", "metcalfe", "micali", "milner", "minsky", "moler", "moore", "naur", "neumann", "newell", "nygaard", "papert", "parnas", "pascal", "patterson", "pearl", "perlis", "pike", "pnueli", "rabin", "reddy", "ritchie", "rivest", "rossum", "russell", "scott", "sedgewick", "shamir", "shannon", "sifakis", "simon", "stallman", "stearns", "steele", "stonebraker", "stroustrup", "sutherland", "sutton", "tarjan", "thacker", "thompson", "torvalds", "turing", "ullman", "valiant", "wadler", "wall", "wigderson", "wilkes", "wilkinson", "wirth", "wozniak", "yao"], geB = ["baking", "beaming", "booping", "bouncing", "brewing", "bubbling", "chasing", "churning", "coalescing", "conjuring", "cooking", "crafting", "crunching", "cuddling", "dancing", "dazzling", "discovering", "doodling", "dreaming", "drifting", "enchanting", "exploring", "finding", "floating", "fluttering", "foraging", "forging", "frolicking", "gathering", "giggling", "gliding", "greeting", "growing", "hatching", "herding", "honking", "hopping", "hugging", "humming", "imagining", "inventing", "jingling", "juggling", "jumping", "kindling", "knitting", "launching", "leaping", "mapping", "marinating", "meandering", "mixing", "moseying", "munching", "napping", "nibbling", "noodling", "orbiting", "painting", "percolating", "petting", "plotting", "pondering", "popping", "prancing", "purring", "puzzling", "questing", "riding", "roaming", "rolling", "sauteeing", "scribbling", "seeking", "shimmying", "singing", "skipping", "sleeping", "snacking", "sniffing", "snuggling", "soaring", "sparking", "spinning", "splashing", "sprouting", "squishing", "stargazing", "stirring", "strolling", "swimming", "swinging", "tickling", "tinkering", "toasting", "tumbling", "twirling", "waddling", "wandering", "watching", "weaving", "whistling", "wibbling", "wiggling", "wishing", "wobbling", "wondering", "yawning", "zooming"];
  s$G = feB.length * geB.length * heB.length
})
// @from(Start 8352898, End 8353161)
function dA5(A) {
  let Q = A ?? e1(),
    B = qFA(),
    G = B.get(Q);
  if (!G) {
    let Z = kU();
    for (let I = 0; I < mA5; I++) {
      G = ueB();
      let Y = gNA(Z, `${G}.md`);
      if (!RA().existsSync(Y)) break
    }
    B.set(Q, G)
  }
  return G
}
// @from(Start 8353163, End 8353203)
function cA5(A, Q) {
  qFA().set(A, Q)
}
// @from(Start 8353205, End 8353388)
function kU() {
  let A = gNA(MQ(), "plans");
  if (!RA().existsSync(A)) try {
    RA().mkdirSync(A)
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error(String(Q)))
  }
  return A
}
// @from(Start 8353390, End 8353544)
function yU(A) {
  let Q = A ?? e1(),
    B = e1(),
    G = dA5(B);
  if (Q === B) return gNA(kU(), `${G}.md`);
  return gNA(kU(), `${G}-agent-${Q}.md`)
}
// @from(Start 8353546, End 8353777)
function xU(A) {
  let Q = yU(A);
  if (!RA().existsSync(Q)) return null;
  try {
    return RA().readFileSync(Q, {
      encoding: "utf-8"
    })
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Start 8353779, End 8353943)
function A01(A) {
  let Q = A.messages.find((G) => G.slug)?.slug;
  if (!Q) return !1;
  cA5(e1(), Q);
  let B = gNA(kU(), `${Q}.md`);
  return RA().existsSync(B)
}
// @from(Start 8353948, End 8353956)
mA5 = 10
// @from(Start 8353962, End 8354019)
NE = L(() => {
  _0();
  AQ();
  hQ();
  g1();
  meB()
})
// @from(Start 8354022, End 8354280)
function deB({
  file_path: A,
  offset: Q,
  limit: B
}, {
  verbose: G
}) {
  if (!A) return null;
  let Z = Q5(A);
  if (G && (Q || B)) {
    let I = Q ?? 1,
      Y = B ? `lines ${I}-${I+B-1}` : `from line ${I}`;
    return `${Z} · ${Y}`
  }
  return Z
}
// @from(Start 8354282, End 8354314)
function ceB() {
  return null
}
// @from(Start 8354316, End 8355390)
function peB(A) {
  switch (A.type) {
    case "image": {
      let {
        originalSize: Q
      } = A.file, B = UJ(Q);
      return _7.createElement(S0, {
        height: 1
      }, _7.createElement($, null, "Read image (", B, ")"))
    }
    case "notebook": {
      let {
        cells: Q
      } = A.file;
      if (!Q || Q.length < 1) return _7.createElement($, {
        color: "error"
      }, "No cells found in notebook");
      return _7.createElement(S0, {
        height: 1
      }, _7.createElement($, null, "Read ", _7.createElement($, {
        bold: !0
      }, Q.length), " cells"))
    }
    case "pdf": {
      let {
        originalSize: Q
      } = A.file, B = UJ(Q);
      return _7.createElement(S0, {
        height: 1
      }, _7.createElement($, null, "Read PDF (", B, ")"))
    }
    case "text": {
      let {
        numLines: Q
      } = A.file;
      return _7.createElement(S0, {
        height: 1
      }, _7.createElement($, null, "Read ", _7.createElement($, {
        bold: !0
      }, Q), " ", Q === 1 ? "line" : "lines"))
    }
  }
}
// @from(Start 8355392, End 8355446)
function leB() {
  return _7.createElement(k5, null)
}
// @from(Start 8355448, End 8355718)
function ieB(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return _7.createElement(S0, null, _7.createElement($, {
    color: "error"
  }, "Error reading file"));
  return _7.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 8355720, End 8355816)
function neB(A) {
  if (A?.file_path?.startsWith(kU())) return "Reading Plan";
  return "Read"
}
// @from(Start 8355818, End 8355896)
function aeB(A) {
  if (!A?.file_path) return null;
  return Q5(A.file_path)
}
// @from(Start 8355901, End 8355903)
_7
// @from(Start 8355909, End 8356002)
seB = L(() => {
  hA();
  iX();
  yJ();
  q8();
  R9();
  cQ();
  NE();
  _7 = BA(VA(), 1)
})
// @from(Start 8356051, End 8356130)
function pA5(A) {
  return reB("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Start 8356132, End 8356198)
function lA5(A) {
  return reB("sha256").update(A).digest("hex")
}
// @from(Start 8356200, End 8356476)
function Uk(A) {
  let Q = {
    operation: A.operation,
    tool: A.tool,
    filePathHash: pA5(A.filePath)
  };
  if (A.content !== void 0 && A.content.length <= iA5) Q.contentHash = lA5(A.content);
  if (A.type !== void 0) Q.type = A.type;
  GA("tengu_file_operation", Q)
}
// @from(Start 8356481, End 8356493)
iA5 = 102400
// @from(Start 8356499, End 8356524)
Q01 = L(() => {
  q0()
})
// @from(Start 8356596, End 8356852)
async function teB(A, Q, {
  maxSizeBytes: B = uNA,
  maxTokens: G = Xo1
}) {
  if (!B01.has(Q) && A.length > B) throw Error(Wo1(A.length, B));
  let Z = gG(A);
  if (!Z || Z <= G / 4) return;
  let I = await OeB(A);
  if (I && I > G) throw new Z01(I, G)
}
// @from(Start 8356854, End 8357015)
function G01(A, Q, B) {
  return {
    type: "image",
    file: {
      base64: A.toString("base64"),
      type: `image/${Q}`,
      originalSize: B
    }
  }
}
// @from(Start 8357016, End 8357899)
async function eA5(A, Q) {
  try {
    let G = RA().statSync(A).size,
      Z = RA().readFileBytesSync(A),
      I = oeB(A).toLowerCase().slice(1),
      J = `image/${I==="jpg"?"jpeg":I}`,
      W = await FMB(Z, Q, J);
    return {
      type: "image",
      file: {
        base64: W.base64,
        type: W.mediaType,
        originalSize: G
      }
    }
  } catch (B) {
    AA(B);
    let G = RA().readFileBytesSync(A);
    try {
      let Z = await Promise.resolve().then(() => BA(psA(), 1)),
        Y = await (Z.default || Z)(G).resize(400, 400, {
          fit: "inside",
          withoutEnlargement: !0
        }).jpeg({
          quality: 20
        }).toBuffer();
      return G01(Y, "jpeg", RA().statSync(A).size)
    } catch (Z) {
      AA(Z);
      let I = oeB(A).toLowerCase().slice(1);
      return G01(G, I === "jpg" ? "jpeg" : I, RA().statSync(A).size)
    }
  }
}
// @from(Start 8357900, End 8358321)
async function A15(A, Q) {
  try {
    let G = RA().statSync(A).size;
    if (G === 0) throw Error(`Image file is empty: ${A}`);
    let Z = RA().readFileBytesSync(A),
      {
        buffer: I,
        mediaType: Y
      } = await i7A(Z, G, Q);
    return G01(I, Y, G)
  } catch (B) {
    AA(B);
    let G = RA().statSync(A).size,
      Z = Q === "jpg" ? "jpeg" : Q;
    return G01(RA().readFileBytesSync(A), Z, G)
  }
}
// @from(Start 8358322, End 8358517)
async function Vo1(A, Q = Xo1, B = A.split(".").pop()?.toLowerCase() || "png") {
  let G = await A15(A, B);
  if (Math.ceil(G.file.base64.length * 0.125) > Q) return await eA5(A, Q);
  return G
}
// @from(Start 8358522, End 8358525)
nA5
// @from(Start 8358527, End 8358538)
Xo1 = 25000
// @from(Start 8358542, End 8358545)
Z01
// @from(Start 8358547, End 8358550)
B01
// @from(Start 8358552, End 8358555)
aA5
// @from(Start 8358557, End 8358560)
sA5
// @from(Start 8358562, End 8358565)
rA5
// @from(Start 8358567, End 8358570)
oA5
// @from(Start 8358572, End 8358574)
n8
// @from(Start 8358576, End 8358924)
tA5 = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`
// @from(Start 8358928, End 8359146)
Wo1 = (A, Q = uNA) => `File content (${UJ(A)}) exceeds maximum allowed size (${UJ(Q)}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`
// @from(Start 8359152, End 8368840)
Dq = L(() => {
  Q2();
  U2();
  _0();
  ot();
  R9();
  LrA();
  g1();
  wF();
  EJ();
  aH1();
  cQ();
  xM();
  AQ();
  seB();
  Q01();
  R9();
  nA5 = [];
  Z01 = class Z01 extends Error {
    tokenCount;
    maxTokens;
    constructor(A, Q) {
      super(`File content (${A} tokens) exceeds maximum allowed tokens (${Q}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`);
      this.tokenCount = A;
      this.maxTokens = Q;
      this.name = "MaxFileReadTokenExceededError"
    }
  };
  B01 = new Set(["png", "jpg", "jpeg", "gif", "webp"]), aA5 = new Set(["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "aiff", "opus", "mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "mpeg", "mpg", "zip", "rar", "tar", "gz", "bz2", "7z", "xz", "z", "tgz", "iso", "exe", "dll", "so", "dylib", "app", "msi", "deb", "rpm", "bin", "dat", "db", "sqlite", "sqlite3", "mdb", "idx", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "ttf", "otf", "woff", "woff2", "eot", "psd", "ai", "eps", "sketch", "fig", "xd", "blend", "obj", "3ds", "max", "class", "jar", "war", "pyc", "pyo", "rlib", "swf", "fla"]), sA5 = j.strictObject({
    file_path: j.string().describe("The absolute path to the file to read"),
    offset: j.number().optional().describe("The line number to start reading from. Only provide if the file is too large to read at once"),
    limit: j.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once.")
  }), rA5 = j.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]), oA5 = j.discriminatedUnion("type", [j.object({
    type: j.literal("text"),
    file: j.object({
      filePath: j.string().describe("The path to the file that was read"),
      content: j.string().describe("The content of the file"),
      numLines: j.number().describe("Number of lines in the returned content"),
      startLine: j.number().describe("The starting line number"),
      totalLines: j.number().describe("Total number of lines in the file")
    })
  }), j.object({
    type: j.literal("image"),
    file: j.object({
      base64: j.string().describe("Base64-encoded image data"),
      type: rA5.describe("The MIME type of the image"),
      originalSize: j.number().describe("Original file size in bytes")
    })
  }), j.object({
    type: j.literal("notebook"),
    file: j.object({
      filePath: j.string().describe("The path to the notebook file"),
      cells: j.array(j.any()).describe("Array of notebook cells")
    })
  }), j.object({
    type: j.literal("pdf"),
    file: j.object({
      filePath: j.string().describe("The path to the PDF file"),
      base64: j.string().describe("Base64-encoded PDF data"),
      originalSize: j.number().describe("Original file size in bytes")
    })
  })]), n8 = {
    name: d5,
    strict: !0,
    input_examples: [{
      file_path: "/Users/username/project/src/index.ts"
    }, {
      file_path: "/Users/username/project/README.md",
      limit: 100,
      offset: 0
    }],
    async description() {
      return ad0
    },
    async prompt() {
      return sd0
    },
    inputSchema: sA5,
    outputSchema: oA5,
    userFacingName: neB,
    getToolUseSummary: aeB,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    getPath({
      file_path: A
    }) {
      return A || W0()
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return jl(n8, A, B.toolPermissionContext)
    },
    renderToolUseMessage: deB,
    renderToolUseProgressMessage: ceB,
    renderToolResultMessage: peB,
    renderToolUseRejectedMessage: leB,
    renderToolUseErrorMessage: ieB,
    async validateInput({
      file_path: A,
      offset: Q,
      limit: B
    }, G) {
      let Z = RA(),
        I = Pl(A),
        Y = await G.getAppState();
      if (jD(I, Y.toolPermissionContext, "read", "deny") !== null) return {
        result: !1,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1
      };
      if (I.startsWith("\\\\") || I.startsWith("//")) return {
        result: !0
      };
      if (!Z.existsSync(I)) {
        let H = I01(I),
          C = "File does not exist.",
          E = W0(),
          U = uQ();
        if (E !== U) C += ` Current working directory: ${E}`;
        if (H) C += ` Did you mean ${H}?`;
        return {
          result: !1,
          message: C,
          errorCode: 2
        }
      }
      let X = Jo1.extname(I).toLowerCase();
      if (aA5.has(X.slice(1)) && !(g9A() && lxA(X))) return {
        result: !1,
        message: `This tool cannot read binary files. The file appears to be a binary ${X} file. Please use appropriate tools for binary file analysis.`,
        errorCode: 4
      };
      let F = Z.statSync(I).size;
      if (F === 0) {
        if (B01.has(X.slice(1))) return {
          result: !1,
          message: "Empty image files cannot be processed.",
          errorCode: 5
        }
      }
      let K = X === ".ipynb",
        D = g9A() && lxA(X);
      if (!B01.has(X.slice(1)) && !K && !D) {
        if (!Y01(I) && !Q && !B) return {
          result: !1,
          message: Wo1(F),
          meta: {
            fileSize: F
          },
          errorCode: 6
        }
      }
      return {
        result: !0
      }
    },
    async call({
      file_path: A,
      offset: Q = 1,
      limit: B = void 0
    }, G) {
      let {
        readFileState: Z,
        fileReadingLimits: I
      } = G, Y = uNA, J = I?.maxTokens ?? Xo1, W = Jo1.extname(A).toLowerCase().slice(1), X = Pl(A);
      if (W === "ipynb") {
        let C = gOB(X),
          E = JSON.stringify(C);
        if (E.length > Y) throw Error(`Notebook content (${UJ(E.length)}) exceeds maximum allowed size (${UJ(Y)}). Use ${C9} with jq to read specific portions:
  cat "${A}" | jq '.cells[:20]' # First 20 cells
  cat "${A}" | jq '.cells[100:120]' # Cells 100-120
  cat "${A}" | jq '.cells | length' # Count total cells
  cat "${A}" | jq '.cells[] | select(.cell_type=="code") | .source' # All code sources`);
        await teB(E, W, {
          maxSizeBytes: Y,
          maxTokens: J
        }), Z.set(X, {
          content: E,
          timestamp: PD(X),
          offset: Q,
          limit: B
        }), G.nestedMemoryAttachmentTriggers?.add(X);
        let U = {
          type: "notebook",
          file: {
            filePath: A,
            cells: C
          }
        };
        return Uk({
          operation: "read",
          tool: "FileReadTool",
          filePath: X,
          content: E
        }), {
          data: U
        }
      }
      if (B01.has(W)) {
        let C = await Vo1(X, J, W);
        return Z.set(X, {
          content: C.file.base64,
          timestamp: PD(X),
          offset: Q,
          limit: B
        }), G.nestedMemoryAttachmentTriggers?.add(X), Uk({
          operation: "read",
          tool: "FileReadTool",
          filePath: X,
          content: C.file.base64
        }), {
          data: C
        }
      }
      if (g9A() && lxA(W)) {
        let C = await nd0(X);
        return Uk({
          operation: "read",
          tool: "FileReadTool",
          filePath: X,
          content: C.file.base64
        }), {
          data: C,
          newMessages: [R0({
            content: [{
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: C.file.base64
              }
            }],
            isMeta: !0
          })]
        }
      }
      let V = Q === 0 ? 0 : Q - 1,
        {
          content: F,
          lineCount: K,
          totalLines: D
        } = eeB(X, V, B);
      if (F.length > Y) throw Error(Wo1(F.length, Y));
      await teB(F, W, {
        maxSizeBytes: Y,
        maxTokens: J
      }), Z.set(X, {
        content: F,
        timestamp: PD(X),
        offset: Q,
        limit: B
      }), G.nestedMemoryAttachmentTriggers?.add(X);
      for (let C of nA5) C(X, F);
      let H = {
        type: "text",
        file: {
          filePath: A,
          content: F,
          numLines: K,
          startLine: Q,
          totalLines: D
        }
      };
      return Uk({
        operation: "read",
        tool: "FileReadTool",
        filePath: X,
        content: F
      }), {
        data: H
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      switch (A.type) {
        case "image":
          return {
            tool_use_id: Q, type: "tool_result", content: [{
              type: "image",
              source: {
                type: "base64",
                data: A.file.base64,
                media_type: A.file.type
              }
            }]
          };
        case "notebook":
          return uOB(A.file.cells, Q);
        case "pdf":
          return {
            tool_use_id: Q, type: "tool_result", content: `PDF file read: ${A.file.filePath} (${UJ(A.file.originalSize)})`
          };
        case "text": {
          let B;
          if (A.file.content) B = Sl(A.file) + tA5;
          else B = A.file.totalLines === 0 ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>" : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${A.file.startLine}). The file has ${A.file.totalLines} lines.</system-reminder>`;
          return {
            tool_use_id: Q,
            type: "tool_result",
            content: B
          }
        }
      }
    }
  }
})
// @from(Start 8368894, End 8370378)
function Fo1(A, Q, B, G) {
  let Z = G15(),
    I = {
      id: Z,
      command: A,
      description: B,
      status: "running",
      startTime: Date.now(),
      shellCommand: Q,
      completionStatusSentInAttachment: !1,
      stdout: "",
      stderr: "",
      unregisterCleanup: PG(Y),
      type: "shell"
    };
  G(Z, () => I);
  async function Y() {
    G(Z, (W) => {
      if (!W) return AA(Error("Shell not found. This is a bug")), I;
      if (W.status !== "running") return W;
      return Z15(AA2(W))
    })
  }
  let J = Q.background(Z);
  if (!J) return G(Z, (W) => ({
    ...W ?? I,
    status: "failed",
    result: {
      code: 1,
      interrupted: !1
    }
  })), Z;
  return J.stdoutStream.on("data", (W) => {
    G(Z, (X) => {
      if (!X) return AA(Error("Shell not found. This is a bug")), I;
      return {
        ...X,
        stdout: X.stdout + W.toString()
      }
    })
  }), J.stderrStream.on("data", (W) => {
    G(Z, (X) => {
      if (!X) return AA(Error("Shell not found. This is a bug")), I;
      return {
        ...X,
        stderr: X.stderr + W.toString()
      }
    })
  }), Q.result.then((W) => {
    G(Z, (X) => {
      if (!X) return AA(Error("Shell not found. This is a bug")), I;
      if (X.status === "killed") return X;
      return B15({
        ...X,
        status: W.code === 0 ? "completed" : "failed",
        result: {
          code: W.code,
          interrupted: W.interrupted
        }
      }, W)
    })
  }), Z
}
// @from(Start 8370380, End 8370551)
function B15(A, Q) {
  return {
    ...A,
    status: Q.code === 0 ? "completed" : "failed",
    result: {
      code: Q.code,
      interrupted: Q.interrupted
    }
  }
}
// @from(Start 8370553, End 8370620)
function G15() {
  return Q15().replace(/-/g, "").substring(0, 6)
}
// @from(Start 8370622, End 8370852)
function AA2(A) {
  try {
    return g(`BackgroundShell ${A.id} kill requested`), A.shellCommand?.kill(), {
      ...A,
      status: "killed"
    }
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), A
  }
}
// @from(Start 8370854, End 8371067)
function Z15(A) {
  if (A.unregisterCleanup?.(), A.cleanupTimeoutId) clearTimeout(A.cleanupTimeoutId);
  return {
    ...A,
    unregisterCleanup: void 0,
    cleanupTimeoutId: void 0,
    shellCommand: null
  }
}
// @from(Start 8371069, End 8371317)
function J01(A) {
  return {
    shell: {
      ...A,
      stdout: "",
      stderr: ""
    },
    command: A.command,
    status: A.status,
    exitCode: A.result?.code ?? null,
    stdout: A.stdout.trimEnd(),
    stderr: A.stderr.trimEnd()
  }
}
// @from(Start 8371319, End 8371358)
function Ko1(A) {
  return !!A.stdout
}
// @from(Start 8371360, End 8371511)
function QA2(A) {
  return A.map((Q) => {
    let B = Ko1(Q);
    return {
      id: Q.id,
      command: Q.command,
      hasNewOutput: B
    }
  })
}
// @from(Start 8371513, End 8371661)
function W01(A) {
  if (A.status !== "running") return A;
  let Q = AA2(A);
  if (Q.cleanupTimeoutId) clearTimeout(Q.cleanupTimeoutId);
  return Q
}
// @from(Start 8371663, End 8371770)
function BA2(A) {
  return A.filter((Q) => Q.status !== "running" && !Q.completionStatusSentInAttachment)
}
// @from(Start 8371775, End 8371816)
_AA = L(() => {
  g1();
  V0();
  HH()
})
// @from(Start 8371819, End 8371871)
function Gh(A) {
  return new tm({
    max: A
  })
}
// @from(Start 8371873, End 8371933)
function GA2(A) {
  return Object.fromEntries(A.entries())
}
// @from(Start 8371935, End 8371983)
function _l(A) {
  return Array.from(A.keys())
}
// @from(Start 8371985, End 8372054)
function kAA(A) {
  let Q = Gh(A.max);
  return Q.load(A.dump()), Q
}
// @from(Start 8372056, End 8372222)
function X01(A, Q) {
  let B = kAA(A);
  for (let [G, Z] of Q.entries()) {
    let I = B.get(G);
    if (!I || Z.timestamp > I.timestamp) B.set(G, Z)
  }
  return B
}
// @from(Start 8372227, End 8372252)
vM = L(() => {
  bbA()
})
// @from(Start 8372258, End 8372265)
Do1 = 4
// @from(Start 8372269, End 8372281)
V01 = 400000
// @from(Start 8372285, End 8372292)
$k = 50
// @from(Start 8372295, End 8372870)
function Y15(A, Q = !1) {
  let B = "",
    G = "",
    Z = !1,
    I = !1,
    Y = !1;
  for (let J = 0; J < A.length; J++) {
    let W = A[J];
    if (Y) {
      if (Y = !1, !Z) B += W;
      if (!Z && !I) G += W;
      continue
    }
    if (W === "\\") {
      if (Y = !0, !Z) B += W;
      if (!Z && !I) G += W;
      continue
    }
    if (W === "'" && !I) {
      Z = !Z;
      continue
    }
    if (W === '"' && !Z) {
      if (I = !I, !Q) continue
    }
    if (!Z) B += W;
    if (!Z && !I) G += W
  }
  return {
    withDoubleQuotes: B,
    fullyUnquoted: G
  }
}
// @from(Start 8372872, End 8373016)
function J15(A) {
  return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "").replace(/[012]?\s*>\s*\/dev\/null/g, "").replace(/\s*<\s*\/dev\/null/g, "")
}
// @from(Start 8373018, End 8373302)
function W15(A, Q) {
  if (Q.length !== 1) throw Error("hasUnescapedChar only works with single characters");
  let B = 0;
  while (B < A.length) {
    if (A[B] === "\\" && B + 1 < A.length) {
      B += 2;
      continue
    }
    if (A[B] === Q) return !0;
    B++
  }
  return !1
}
// @from(Start 8373304, End 8373620)
function X15(A) {
  if (!A.originalCommand.trim()) return {
    behavior: "allow",
    updatedInput: {
      command: A.originalCommand
    },
    decisionReason: {
      type: "other",
      reason: "Empty command is safe"
    }
  };
  return {
    behavior: "passthrough",
    message: "Command is not empty"
  }
}
// @from(Start 8373622, End 8374510)
function V15(A) {
  let {
    originalCommand: Q
  } = A, B = Q.trim();
  if (/^\s*\t/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.INCOMPLETE_COMMANDS,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command appears to be an incomplete fragment (starts with tab)"
  };
  if (B.startsWith("-")) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.INCOMPLETE_COMMANDS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command appears to be an incomplete fragment (starts with flags)"
  };
  if (/^\s*(&&|\|\||;|>>?|<)/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.INCOMPLETE_COMMANDS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command appears to be a continuation line (starts with operator)"
  };
  return {
    behavior: "passthrough",
    message: "Command appears complete"
  }
}
// @from(Start 8374512, End 8375507)
function F15(A) {
  if (!Ho1.test(A)) return !1;
  let Q = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
    B, G = [];
  while ((B = Q.exec(A)) !== null) {
    let I = B[1] || B[2];
    if (I) G.push({
      start: B.index,
      delimiter: I
    })
  }
  if (G.length === 0) return !1;
  for (let {
      start: I,
      delimiter: Y
    }
    of G) {
    let J = A.substring(I),
      W = Y.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`(?:
|^[^\\n]*
)${W}\\s*\\)`).test(J)) return !1;
    let V = new RegExp(`^\\$\\(cat\\s*<<-?\\s*(?:'+${W}'+|\\\\${W})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${W}\\s*\\)`);
    if (!J.match(V)) return !1
  }
  let Z = A;
  for (let {
      delimiter: I
    }
    of G) {
    let Y = I.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      J = new RegExp(`\\$\\(cat\\s*<<-?\\s*(?:'+${Y}'+|\\\\${Y})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${Y}\\s*\\)`);
    Z = Z.replace(J, "")
  }
  if (/\$\(/.test(Z)) return !1;
  if (/\${/.test(Z)) return !1;
  return !0
}
// @from(Start 8375509, End 8375999)
function K15(A) {
  let {
    originalCommand: Q
  } = A;
  if (!Ho1.test(Q)) return {
    behavior: "passthrough",
    message: "No heredoc in substitution"
  };
  if (F15(Q)) return {
    behavior: "allow",
    updatedInput: {
      command: Q
    },
    decisionReason: {
      type: "other",
      reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
    }
  };
  return {
    behavior: "passthrough",
    message: "Command substitution needs validation"
  }
}
// @from(Start 8376001, End 8377014)
function D15(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A;
  if (B !== "git" || !/^git\s+commit\s+/.test(Q)) return {
    behavior: "passthrough",
    message: "Not a git commit"
  };
  let G = Q.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
  if (G) {
    let [, Z, I, Y] = G;
    if (Z === '"' && I && /\$\(|`|\$\{/.test(I)) return GA("tengu_bash_security_check_triggered", {
      checkId: cF.GIT_COMMIT_SUBSTITUTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Git commit message contains command substitution patterns"
    };
    if (Y && /\$\(|`|\$\{/.test(Y)) return {
      behavior: "passthrough",
      message: "Check patterns in flags"
    };
    return {
      behavior: "allow",
      updatedInput: {
        command: Q
      },
      decisionReason: {
        type: "other",
        reason: "Git commit with simple quoted message is allowed"
      }
    }
  }
  return {
    behavior: "passthrough",
    message: "Git commit needs validation"
  }
}
// @from(Start 8377016, End 8377529)
function H15(A) {
  let {
    originalCommand: Q
  } = A;
  if (Ho1.test(Q)) return {
    behavior: "passthrough",
    message: "Heredoc in substitution"
  };
  let B = /<<-?\s*'[^']+'/,
    G = /<<-?\s*\\\w+/;
  if (B.test(Q) || G.test(Q)) return {
    behavior: "allow",
    updatedInput: {
      command: Q
    },
    decisionReason: {
      type: "other",
      reason: "Heredoc with quoted/escaped delimiter is safe"
    }
  };
  return {
    behavior: "passthrough",
    message: "No heredoc patterns"
  }
}
// @from(Start 8377531, End 8378376)
function C15(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A;
  if (B !== "jq") return {
    behavior: "passthrough",
    message: "Not jq"
  };
  if (/\bsystem\s*\(/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.JQ_SYSTEM_FUNCTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "jq command contains system() function which executes arbitrary commands"
  };
  let G = Q.substring(3).trim();
  if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(G)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.JQ_FILE_ARGUMENTS,
    subId: 1
  }), {
    behavior: "ask",
    message: "jq command contains dangerous flags that could execute code or read arbitrary files"
  };
  return {
    behavior: "passthrough",
    message: "jq command is safe"
  }
}
// @from(Start 8378378, End 8379482)
function E15(A) {
  let {
    unquotedContent: Q
  } = A, B = "Command contains shell metacharacters (;, |, or &) in arguments";
  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.SHELL_METACHARACTERS,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  if ([/-name\s+["'][^"']*[;|&][^"']*["']/, /-path\s+["'][^"']*[;|&][^"']*["']/, /-iname\s+["'][^"']*[;|&][^"']*["']/].some((Z) => Z.test(Q))) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.SHELL_METACHARACTERS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.SHELL_METACHARACTERS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  return {
    behavior: "passthrough",
    message: "No metacharacters"
  }
}
// @from(Start 8379484, End 8379936)
function z15(A) {
  let {
    fullyUnquotedContent: Q
  } = A;
  if (/[<>|]\s*\$[A-Za-z_]/.test(Q) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.DANGEROUS_VARIABLES,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains variables in dangerous contexts (redirections or pipes)"
  };
  return {
    behavior: "passthrough",
    message: "No dangerous variables"
  }
}
// @from(Start 8379938, End 8381043)
function U15(A) {
  let {
    unquotedContent: Q,
    fullyUnquotedContent: B
  } = A;
  if (W15(Q, "`")) return {
    behavior: "ask",
    message: "Command contains backticks (`) for command substitution"
  };
  for (let {
      pattern: G,
      message: Z
    }
    of I15)
    if (G.test(Q)) return GA("tengu_bash_security_check_triggered", {
      checkId: cF.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION,
      subId: 1
    }), {
      behavior: "ask",
      message: `Command contains ${Z}`
    };
  if (/</.test(B)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.DANGEROUS_PATTERNS_INPUT_REDIRECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains input redirection (<) which could read sensitive files"
  };
  if (/>/.test(B)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains output redirection (>) which could write to arbitrary files"
  };
  return {
    behavior: "passthrough",
    message: "No dangerous patterns"
  }
}
// @from(Start 8381045, End 8381538)
function $15(A) {
  let {
    fullyUnquotedContent: Q
  } = A;
  if (!/[\n\r]/.test(Q)) return {
    behavior: "passthrough",
    message: "No newlines"
  };
  if (/[\n\r]\s*[a-zA-Z/.~]/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.NEWLINES,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains newlines that could separate multiple commands"
  };
  return {
    behavior: "passthrough",
    message: "Newlines appear to be within data"
  }
}
// @from(Start 8381540, End 8381939)
function w15(A) {
  let {
    originalCommand: Q
  } = A;
  if (/\$IFS|\$\{[^}]*IFS/.test(Q)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.IFS_INJECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains IFS variable usage which could bypass security validation"
  };
  return {
    behavior: "passthrough",
    message: "No IFS injection detected"
  }
}
// @from(Start 8381941, End 8383831)
function q15(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A;
  if (B === "echo") return {
    behavior: "passthrough",
    message: "echo command is safe and has no dangerous flags"
  };
  let G = !1,
    Z = !1,
    I = !1;
  for (let Y = 0; Y < Q.length - 1; Y++) {
    let J = Q[Y],
      W = Q[Y + 1];
    if (I) {
      I = !1;
      continue
    }
    if (J === "\\") {
      I = !0;
      continue
    }
    if (J === "'" && !Z) {
      G = !G;
      continue
    }
    if (J === '"' && !G) {
      Z = !Z;
      continue
    }
    if (G || Z) continue;
    if (J && W && /\s/.test(J) && W === "-") {
      let X = Y + 1,
        V = "";
      while (X < Q.length) {
        let F = Q[X];
        if (!F) break;
        if (/[\s=]/.test(F)) break;
        if (/['"`]/.test(F)) {
          if (B === "cut" && V === "-d" && /['"`]/.test(F)) break;
          if (X + 1 < Q.length) {
            let K = Q[X + 1];
            if (K && !/[a-zA-Z0-9_'"-]/.test(K)) break
          }
        }
        V += F, X++
      }
      if (V.includes('"') || V.includes("'")) return GA("tengu_bash_security_check_triggered", {
        checkId: cF.OBFUSCATED_FLAGS,
        subId: 1
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      }
    }
  }
  if (/\s['"`]-/.test(A.fullyUnquotedContent)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.OBFUSCATED_FLAGS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  if (/['"`]{2}-/.test(A.fullyUnquotedContent)) return GA("tengu_bash_security_check_triggered", {
    checkId: cF.OBFUSCATED_FLAGS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  return {
    behavior: "passthrough",
    message: "No obfuscated flags detected"
  }
}
// @from(Start 8383833, End 8384617)
function kl(A) {
  let Q = A.split(" ")[0] || "",
    {
      withDoubleQuotes: B,
      fullyUnquoted: G
    } = Y15(A, Q === "jq"),
    Z = {
      originalCommand: A,
      baseCommand: Q,
      unquotedContent: B,
      fullyUnquotedContent: J15(G)
    },
    I = [X15, V15, K15, H15, D15];
  for (let J of I) {
    let W = J(Z);
    if (W.behavior === "allow") return {
      behavior: "passthrough",
      message: W.decisionReason?.type === "other" ? W.decisionReason.reason : "Command allowed"
    };
    if (W.behavior !== "passthrough") return W
  }
  let Y = [C15, q15, E15, z15, $15, w15, U15];
  for (let J of Y) {
    let W = J(Z);
    if (W.behavior === "ask") return W
  }
  return {
    behavior: "passthrough",
    message: "Command passed all security checks"
  }
}
// @from(Start 8384622, End 8384625)
Ho1
// @from(Start 8384627, End 8384630)
I15
// @from(Start 8384632, End 8384634)
cF
// @from(Start 8384640, End 8385560)
F01 = L(() => {
  q0();
  Ho1 = /\$\(.*<</, I15 = [{
    pattern: /<\(/,
    message: "process substitution <()"
  }, {
    pattern: />\(/,
    message: "process substitution >()"
  }, {
    pattern: /\$\(/,
    message: "$() command substitution"
  }, {
    pattern: /\$\{/,
    message: "${} parameter substitution"
  }, {
    pattern: /~\[/,
    message: "Zsh-style parameter expansion"
  }, {
    pattern: /\(e:/,
    message: "Zsh-style glob qualifiers"
  }, {
    pattern: /<#/,
    message: "PowerShell comment syntax"
  }], cF = {
    INCOMPLETE_COMMANDS: 1,
    JQ_SYSTEM_FUNCTION: 2,
    JQ_FILE_ARGUMENTS: 3,
    OBFUSCATED_FLAGS: 4,
    SHELL_METACHARACTERS: 5,
    DANGEROUS_VARIABLES: 6,
    NEWLINES: 7,
    DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
    DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
    DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
    IFS_INJECTION: 11,
    GIT_COMMIT_SUBSTITUTION: 12
  }
})
// @from(Start 8385563, End 8385633)
function BIA(A) {
  if (A !== xl) throw Error("Illegal constructor")
}
// @from(Start 8385635, End 8385728)
function dNA(A) {
  return !!A && typeof A.row === "number" && typeof A.column === "number"
}
// @from(Start 8385730, End 8385758)
function YA2(A) {
  V1 = A
}
// @from(Start 8385760, End 8386050)
function $o1(A, Q, B, G) {
  let Z = B - Q,
    I = A.textCallback(Q, G);
  if (I) {
    Q += I.length;
    while (Q < B) {
      let Y = A.textCallback(Q, G);
      if (Y && Y.length > 0) Q += Y.length, I += Y;
      else break
    }
    if (Q > B) I = I.slice(0, Z)
  }
  return I ?? ""
}
// @from(Start 8386052, End 8386310)
function Uo1(A, Q, B, G, Z) {
  for (let I = 0, Y = Z.length; I < Y; I++) {
    let J = V1.getValue(B, "i32");
    B += d2;
    let W = XY(Q, B);
    B += vU, Z[I] = {
      patternIndex: G,
      name: A.captureNames[J],
      node: W
    }
  }
  return B
}
// @from(Start 8386312, End 8386583)
function N8(A, Q = 0) {
  let B = $2 + Q * vU;
  V1.setValue(B, A.id, "i32"), B += d2, V1.setValue(B, A.startIndex, "i32"), B += d2, V1.setValue(B, A.startPosition.row, "i32"), B += d2, V1.setValue(B, A.startPosition.column, "i32"), B += d2, V1.setValue(B, A[0], "i32")
}
// @from(Start 8386585, End 8386988)
function XY(A, Q = $2) {
  let B = V1.getValue(Q, "i32");
  if (Q += d2, B === 0) return null;
  let G = V1.getValue(Q, "i32");
  Q += d2;
  let Z = V1.getValue(Q, "i32");
  Q += d2;
  let I = V1.getValue(Q, "i32");
  Q += d2;
  let Y = V1.getValue(Q, "i32");
  return new R15(xl, {
    id: B,
    tree: A,
    startIndex: G,
    startPosition: {
      row: Z,
      column: I
    },
    other: Y
  })
}
// @from(Start 8386990, End 8387169)
function DZ(A, Q = $2) {
  V1.setValue(Q + 0 * d2, A[0], "i32"), V1.setValue(Q + 1 * d2, A[1], "i32"), V1.setValue(Q + 2 * d2, A[2], "i32"), V1.setValue(Q + 3 * d2, A[3], "i32")
}
// @from(Start 8387171, End 8387350)
function Hq(A) {
  A[0] = V1.getValue($2 + 0 * d2, "i32"), A[1] = V1.getValue($2 + 1 * d2, "i32"), A[2] = V1.getValue($2 + 2 * d2, "i32"), A[3] = V1.getValue($2 + 3 * d2, "i32")
}
// @from(Start 8387352, End 8387442)
function bM(A, Q) {
  V1.setValue(A, Q.row, "i32"), V1.setValue(A + d2, Q.column, "i32")
}
// @from(Start 8387444, End 8387561)
function yAA(A) {
  return {
    row: V1.getValue(A, "i32") >>> 0,
    column: V1.getValue(A + d2, "i32") >>> 0
  }
}
// @from(Start 8387563, End 8387740)
function JA2(A, Q) {
  bM(A, Q.startPosition), A += wk, bM(A, Q.endPosition), A += wk, V1.setValue(A, Q.startIndex, "i32"), A += d2, V1.setValue(A, Q.endIndex, "i32"), A += d2
}
// @from(Start 8387742, End 8387949)
function D01(A) {
  let Q = {};
  return Q.startPosition = yAA(A), A += wk, Q.endPosition = yAA(A), A += wk, Q.startIndex = V1.getValue(A, "i32") >>> 0, A += d2, Q.endIndex = V1.getValue(A, "i32") >>> 0, Q
}
// @from(Start 8387951, End 8388220)
function WA2(A, Q = $2) {
  bM(Q, A.startPosition), Q += wk, bM(Q, A.oldEndPosition), Q += wk, bM(Q, A.newEndPosition), Q += wk, V1.setValue(Q, A.startIndex, "i32"), Q += d2, V1.setValue(Q, A.oldEndIndex, "i32"), Q += d2, V1.setValue(Q, A.newEndIndex, "i32"), Q += d2
}
// @from(Start 8388222, End 8388405)
function XA2(A) {
  let Q = {};
  return Q.major_version = V1.getValue(A, "i32"), A += d2, Q.minor_version = V1.getValue(A, "i32"), A += d2, Q.field_count = V1.getValue(A, "i32"), Q
}
// @from(Start 8388407, End 8389527)
function VA2(A, Q, B, G) {
  if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 2, got ${A.length-1}`);
  if (!IA2(A[1])) throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}"`);
  let Z = B === "eq?" || B === "any-eq?",
    I = !B.startsWith("any-");
  if (IA2(A[2])) {
    let Y = A[1].name,
      J = A[2].name;
    G[Q].push((W) => {
      let X = [],
        V = [];
      for (let K of W) {
        if (K.name === Y) X.push(K.node);
        if (K.name === J) V.push(K.node)
      }
      let F = X0((K, D, H) => {
        return H ? K.text === D.text : K.text !== D.text
      }, "compare");
      return I ? X.every((K) => V.some((D) => F(K, D, Z))) : X.some((K) => V.some((D) => F(K, D, Z)))
    })
  } else {
    let Y = A[1].name,
      J = A[2].value,
      W = X0((V) => V.text === J, "matches"),
      X = X0((V) => V.text !== J, "doesNotMatch");
    G[Q].push((V) => {
      let F = [];
      for (let D of V)
        if (D.name === Y) F.push(D.node);
      let K = Z ? W : X;
      return I ? F.every(K) : F.some(K)
    })
  }
}
// @from(Start 8389529, End 8390343)
function FA2(A, Q, B, G) {
  if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 2, got ${A.length-1}.`);
  if (A[1].type !== "capture") throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}".`);
  if (A[2].type !== "string") throw Error(`Second argument of \`#${B}\` predicate must be a string. Got @${A[2].name}.`);
  let Z = B === "match?" || B === "any-match?",
    I = !B.startsWith("any-"),
    Y = A[1].name,
    J = new RegExp(A[2].value);
  G[Q].push((W) => {
    let X = [];
    for (let F of W)
      if (F.name === Y) X.push(F.node.text);
    let V = X0((F, K) => {
      return K ? J.test(F) : !J.test(F)
    }, "test");
    if (X.length === 0) return !Z;
    return I ? X.every((F) => V(F, Z)) : X.some((F) => V(F, Z))
  })
}
// @from(Start 8390345, End 8391002)
function KA2(A, Q, B, G) {
  if (A.length < 2) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected at least 1. Got ${A.length-1}.`);
  if (A[1].type !== "capture") throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}".`);
  let Z = B === "any-of?",
    I = A[1].name,
    Y = A.slice(2);
  if (!Y.every(wo1)) throw Error(`Arguments to \`#${B}\` predicate must be strings.".`);
  let J = Y.map((W) => W.value);
  G[Q].push((W) => {
    let X = [];
    for (let V of W)
      if (V.name === I) X.push(V.node.text);
    if (X.length === 0) return !Z;
    return X.every((V) => J.includes(V)) === Z
  })
}
// @from(Start 8391004, End 8391358)
function DA2(A, Q, B, G, Z) {
  if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
  if (!A.every(wo1)) throw Error(`Arguments to \`#${B}\` predicate must be strings.".`);
  let I = B === "is?" ? G : Z;
  if (!I[Q]) I[Q] = {};
  I[Q][A[1].value] = A[2]?.value ?? null
}
// @from(Start 8391360, End 8391675)
function HA2(A, Q, B) {
  if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
  if (!A.every(wo1)) throw Error('Arguments to `#set!` predicate must be strings.".');
  if (!B[Q]) B[Q] = {};
  B[Q][A[1].value] = A[2]?.value ?? null
}
// @from(Start 8391677, End 8392676)
function CA2(A, Q, B, G, Z, I, Y, J, W, X, V) {
  if (Q === T15) {
    let F = G[B];
    I.push({
      type: "capture",
      name: F
    })
  } else if (Q === P15) I.push({
    type: "string",
    value: Z[B]
  });
  else if (I.length > 0) {
    if (I[0].type !== "string") throw Error("Predicates must begin with a literal value");
    let F = I[0].value;
    switch (F) {
      case "any-not-eq?":
      case "not-eq?":
      case "any-eq?":
      case "eq?":
        VA2(I, A, F, Y);
        break;
      case "any-not-match?":
      case "not-match?":
      case "any-match?":
      case "match?":
        FA2(I, A, F, Y);
        break;
      case "not-any-of?":
      case "any-of?":
        KA2(I, A, F, Y);
        break;
      case "is?":
      case "is-not?":
        DA2(I, A, F, X, V);
        break;
      case "set!":
        HA2(I, A, W);
        break;
      default:
        J[A].push({
          operator: F,
          operands: I.slice(1)
        })
    }
    I.length = 0
  }
}
// @from(Start 8392677, End 8392747)
async function EA2(A) {
  if (!K01) K01 = await y15(A);
  return K01
}
// @from(Start 8392749, End 8392782)
function zA2() {
  return !!K01
}
// @from(Start 8392787, End 8392790)
N15
// @from(Start 8392792, End 8392863)
X0 = (A, Q) => N15(A, "name", {
    value: Q,
    configurable: !0
  })
// @from(Start 8392867, End 8392874)
ZA2 = 2
// @from(Start 8392878, End 8392884)
d2 = 4
// @from(Start 8392888, End 8392891)
Co1
// @from(Start 8392893, End 8392895)
vU
// @from(Start 8392897, End 8392899)
wk
// @from(Start 8392901, End 8392904)
cNA
// @from(Start 8392906, End 8392908)
yl
// @from(Start 8392910, End 8392912)
xl
// @from(Start 8392914, End 8392916)
V1
// @from(Start 8392918, End 8392921)
L15
// @from(Start 8392923, End 8392926)
M15
// @from(Start 8392928, End 8392931)
O15
// @from(Start 8392933, End 8392936)
R15
// @from(Start 8392938, End 8392945)
T15 = 1
// @from(Start 8392949, End 8392956)
P15 = 2
// @from(Start 8392960, End 8392963)
j15
// @from(Start 8392965, End 8392968)
pwG
// @from(Start 8392970, End 8392973)
IA2
// @from(Start 8392975, End 8392978)
wo1
// @from(Start 8392980, End 8392982)
iT
// @from(Start 8392984, End 8392987)
mNA
// @from(Start 8392989, End 8392992)
S15
// @from(Start 8392994, End 8392997)
_15
// @from(Start 8392999, End 8393002)
qo1
// @from(Start 8393004, End 8393007)
k15
// @from(Start 8393009, End 8393012)
y15
// @from(Start 8393014, End 8393024)
K01 = null
// @from(Start 8393028, End 8393030)
$2
// @from(Start 8393032, End 8393035)
Eo1
// @from(Start 8393037, End 8393040)
zo1
// @from(Start 8393042, End 8393045)
No1