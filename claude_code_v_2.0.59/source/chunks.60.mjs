
// @from(Start 5443647, End 5444428)
async function lc(A = {}) {
  let Q = A.model ? String(A.model) : k3(),
    B = Dw(Q),
    G = await mY6(),
    Z = dY6();
  return {
    model: Q,
    sessionId: e1(),
    userType: "external",
    ...B.length > 0 ? {
      betas: B.join(",")
    } : {},
    envContext: G,
    ...process.env.CLAUDE_CODE_ENTRYPOINT && {
      entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
    },
    ...process.env.CLAUDE_AGENT_SDK_VERSION && {
      agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
    },
    isInteractive: String(wkA()),
    clientType: qkA(),
    ...Z && {
      processMetrics: Z
    },
    sweBenchRunId: process.env.SWE_BENCH_RUN_ID || "",
    sweBenchInstanceId: process.env.SWE_BENCH_INSTANCE_ID || "",
    sweBenchTaskId: process.env.SWE_BENCH_TASK_ID || ""
  }
}
// @from(Start 5444430, End 5444789)
function NCB(A, Q = {}) {
  let B = {};
  for (let [G, Z] of Object.entries(Q))
    if (Z !== void 0) B[G] = String(Z);
  for (let [G, Z] of Object.entries(A)) {
    if (Z === void 0) continue;
    if (G === "envContext") B.env = JSON.stringify(Z);
    else if (G === "processMetrics") B.process = JSON.stringify(Z);
    else B[G] = String(Z)
  }
  return B
}
// @from(Start 5444791, End 5444988)
function LCB(A, Q = {}) {
  let {
    envContext: B,
    processMetrics: G,
    ...Z
  } = A;
  return {
    ...Q,
    ...Z,
    env: B,
    ...G && {
      process: G
    },
    surface: gY6
  }
}
// @from(Start 5444990, End 5447301)
function GCB(A, Q, B = {}) {
  let {
    envContext: G,
    processMetrics: Z,
    ...I
  } = A, Y = {
    platform: G.platform,
    arch: G.arch,
    node_version: G.nodeVersion,
    terminal: G.terminal || "unknown",
    package_managers: G.packageManagers,
    runtimes: G.runtimes,
    is_running_with_bun: G.isRunningWithBun,
    is_ci: G.isCi,
    is_claubbit: G.isClaubbit,
    is_claude_code_remote: G.isClaudeCodeRemote,
    is_conductor: G.isConductor,
    is_github_action: G.isGithubAction,
    is_claude_code_action: G.isClaudeCodeAction,
    is_claude_ai_auth: G.isClaudeAiAuth,
    version: G.version,
    deployment_environment: G.deploymentEnvironment
  };
  if (G.remoteEnvironmentType) Y.remote_environment_type = G.remoteEnvironmentType;
  if (G.claudeCodeContainerId) Y.claude_code_container_id = G.claudeCodeContainerId;
  if (G.claudeCodeRemoteSessionId) Y.claude_code_remote_session_id = G.claudeCodeRemoteSessionId;
  if (G.tags) Y.tags = G.tags.split(",").map((W) => W.trim()).filter(Boolean);
  if (G.githubEventName) Y.github_event_name = G.githubEventName;
  if (G.githubActionsRunnerEnvironment) Y.github_actions_runner_environment = G.githubActionsRunnerEnvironment;
  if (G.githubActionsRunnerOs) Y.github_actions_runner_os = G.githubActionsRunnerOs;
  if (G.githubActionRef) Y.github_action_ref = G.githubActionRef;
  if (G.wslVersion) Y.wsl_version = G.wslVersion;
  if (G.versionBase) Y.version_base = G.versionBase;
  let J = {
    session_id: I.sessionId,
    model: I.model,
    user_type: I.userType,
    is_interactive: I.isInteractive === "true",
    client_type: I.clientType
  };
  if (I.betas) J.betas = I.betas;
  if (I.entrypoint) J.entrypoint = I.entrypoint;
  if (I.agentSdkVersion) J.agent_sdk_version = I.agentSdkVersion;
  if (I.sweBenchRunId) J.swe_bench_run_id = I.sweBenchRunId;
  if (I.sweBenchInstanceId) J.swe_bench_instance_id = I.sweBenchInstanceId;
  if (I.sweBenchTaskId) J.swe_bench_task_id = I.sweBenchTaskId;
  if (Q.githubActionsMetadata) {
    let W = Q.githubActionsMetadata;
    Y.github_actions_metadata = {
      actor_id: W.actorId,
      repository_id: W.repositoryId,
      repository_owner_id: W.repositoryOwnerId
    }
  }
  return {
    env: Y,
    ...Z && {
      process: JSON.stringify(Z)
    },
    core: J,
    additional: B
  }
}
// @from(Start 5447306, End 5447325)
gY6 = "claude-code"
// @from(Start 5447329, End 5447332)
uY6
// @from(Start 5447338, End 5447852)
B7A = L(() => {
  l2();
  c5();
  It();
  CS();
  t2();
  _0();
  hQ();
  gB();
  Q3();
  uY6 = s1(() => {
    let A = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION.match(/^\d+\.\d+\.\d+(?:-[a-z]+)?/);
    return A ? A[0] : void 0
  })
})
// @from(Start 5447901, End 5448726)
function OCB(A) {
  let Q = vc(!0),
    B = {
      networkConfig: {
        api: "https://statsig.anthropic.com/v1/"
      },
      environment: {
        tier: ["test", "dev"].includes("production") ? "development" : "production"
      },
      includeCurrentPageUrlWithEvents: !1,
      logLevel: anA.LogLevel.None,
      storageProvider: new Hz1,
      customUserCacheKeyFunc: (I, Y) => {
        return cY6("sha1").update(I).update(Y.userID || "").digest("hex").slice(0, 10)
      }
    },
    G = new anA.StatsigClient(A, Q, B);
  G.on("error", () => {
    YQ.head("https://api.anthropic.com/api/hello").catch(() => {})
  });
  let Z = G.initializeAsync();
  return process.on("beforeExit", async () => {
    await G.flush()
  }), process.on("exit", () => {
    G.flush()
  }), {
    client: G,
    initialized: Z
  }
}
// @from(Start 5448728, End 5448762)
function qUA(A) {
  return Dh1()
}
// @from(Start 5448764, End 5448901)
function TCB() {
  Kh1 = !1, Dh1.cache?.clear?.(), RCB.cache?.clear?.(), nb.cache?.clear?.(), Ch1.cache?.clear?.(), hX.cache?.clear?.()
}
// @from(Start 5448903, End 5448935)
function PCB() {
  return fX()
}
// @from(Start 5448936, End 5449298)
async function St() {
  if (fX()) return;
  try {
    let A = vc(!0),
      Q = await nb(),
      B = RCB(),
      G = [];
    if (Q) G.push(Q.updateUserAsync(A));
    if (B) G.push(B.initialized.then(() => B.client.updateUserAsync(A)));
    await Promise.all(G)
  } catch (A) {
    AA(A instanceof Error ? A : Error(`Statsig: Force refresh failed: ${A}`))
  }
}
// @from(Start 5449300, End 5449449)
function jCB() {
  if (fX()) return;
  let A = setInterval(() => {
    St()
  }, pY6);
  process.on("beforeExit", () => {
    clearInterval(A)
  })
}
// @from(Start 5449450, End 5449742)
async function Hh1(A, Q) {
  if (fX()) return;
  try {
    let [B, G] = await Promise.all([nb(), lc({
      model: Q.model
    })]);
    if (!B) return;
    let Z = NCB(G, Q),
      I = {
        eventName: A,
        metadata: Z
      };
    B.logEvent(I), await B.flush()
  } catch (B) {}
}
// @from(Start 5449744, End 5449778)
function SCB(A, Q) {
  Hh1(A, Q)
}
// @from(Start 5449780, End 5449824)
function _CB() {
  return {
    ...MCB
  }
}
// @from(Start 5449825, End 5450043)
async function ab(A, Q) {
  if (fX()) return Q;
  let B = qUA(A);
  if (!B) return Q;
  await B.initialized;
  let G = B.client.getDynamicConfig(A);
  if (Object.keys(G.value).length === 0) return Q;
  return G.value
}
// @from(Start 5450045, End 5450185)
function BZ(A, Q, B) {
  let G = qUA(A);
  if (!G) return B;
  let Z = G.client.getExperiment(A);
  if (!Z) return B;
  return Z.get(Q, B)
}
// @from(Start 5450187, End 5450361)
function WCB(A, Q) {
  let B = qUA(A);
  if (!B) return Q;
  let G = B.client.getDynamicConfig(A);
  if (!G || Object.keys(G.value).length === 0) return Q;
  return G.value
}
// @from(Start 5450363, End 5450431)
function o2(A) {
  return iY6(A), N1().cachedStatsigGates[A] ?? !1
}
// @from(Start 5450432, End 5450497)
async function kCB(A) {
  if (Kh1) return o2(A);
  return hX(A)
}
// @from(Start 5450499, End 5450794)
function Z7A(A, Q) {
  let G = N1().cachedDynamicConfigs?.[A];
  return lY6(A, Q).then((Z) => {
    let I = N1();
    if (Z === I.cachedDynamicConfigs?.[A]) return;
    c0({
      ...I,
      cachedDynamicConfigs: {
        ...I.cachedDynamicConfigs,
        [A]: Z
      }
    })
  }), G ?? Q
}
// @from(Start 5450796, End 5450992)
function yCB(A) {
  let Q = N1();
  if (Q.cachedDynamicConfigs?.[A] === void 0) return;
  c0({
    ...Q,
    cachedDynamicConfigs: {
      ...Q.cachedDynamicConfigs,
      [A]: void 0
    }
  })
}
// @from(Start 5450997, End 5451000)
Fh1
// @from(Start 5451002, End 5451005)
anA
// @from(Start 5451007, End 5451021)
pY6 = 21600000
// @from(Start 5451025, End 5451028)
MCB
// @from(Start 5451030, End 5451038)
Kh1 = !1
// @from(Start 5451042, End 5451045)
Dh1
// @from(Start 5451047, End 5451050)
RCB
// @from(Start 5451052, End 5451054)
nb
// @from(Start 5451056, End 5451058)
hX
// @from(Start 5451060, End 5451205)
snA = (A, Q) => {
    let [B, G] = Fh1.default.useState(Q);
    return Fh1.default.useEffect(() => {
      ab(A, Q).then(G)
    }, [A, Q]), B
  }
// @from(Start 5451209, End 5451212)
Ch1
// @from(Start 5451214, End 5451217)
lY6
// @from(Start 5451219, End 5451222)
iY6
// @from(Start 5451228, End 5452257)
u2 = L(() => {
  l2();
  O3();
  Zr0();
  Yr0();
  gb();
  V0();
  g1();
  jQ();
  B7A();
  Ft();
  Fh1 = BA(VA(), 1), anA = BA(Gr0(), 1), MCB = {};
  Dh1 = s1(() => {
    if (fX()) return null;
    let A = OCB(Wr0);
    return A.initialized.then(() => {
      Kh1 = !0
    }), A
  }), RCB = s1(() => {
    if (fX() || !Cz1) return null;
    return OCB(Cz1)
  });
  nb = s1(async () => {
    let A = Dh1();
    if (!A) return null;
    return await A.initialized, A.client
  });
  hX = s1(async (A) => {
    if (fX()) return !1;
    let Q = qUA(A);
    if (!Q) return !1;
    await Q.initialized;
    let B = Q.client.checkGate(A);
    return MCB[A] = B, B
  });
  Ch1 = s1(async (A, Q) => {
    if (fX()) return Q;
    let B = qUA(A);
    if (!B) return Q;
    await B.initialized;
    let G = B.client.getExperiment(A);
    if (Object.keys(G.value).length === 0) return Q;
    return G.value
  });
  lY6 = s1(ab);
  iY6 = s1(async (A) => {
    let Q = await hX(A),
      B = N1();
    B.cachedStatsigGates[A] = Q, c0(B)
  })
})
// @from(Start 5452260, End 5453683)
function bCB(A) {
  let {
    hasThinking: Q = !1
  } = A ?? {}, B = BZ("preserve_thinking", "enabled", !1);
  if (!B) return;
  let G = Y0(process.env.USE_API_CLEAR_TOOL_RESULTS),
    Z = Y0(process.env.USE_API_CLEAR_TOOL_USES);
  if (!G && !Z && !B) return;
  let I = [];
  if (G) {
    let Y = process.env.API_MAX_INPUT_TOKENS ? parseInt(process.env.API_MAX_INPUT_TOKENS) : xCB,
      J = process.env.API_TARGET_INPUT_TOKENS ? parseInt(process.env.API_TARGET_INPUT_TOKENS) : vCB,
      W = {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: Y
        },
        clear_at_least: {
          type: "input_tokens",
          value: Y - J
        },
        clear_tool_inputs: nY6
      };
    I.push(W)
  }
  if (Z) {
    let Y = process.env.API_MAX_INPUT_TOKENS ? parseInt(process.env.API_MAX_INPUT_TOKENS) : xCB,
      J = process.env.API_TARGET_INPUT_TOKENS ? parseInt(process.env.API_TARGET_INPUT_TOKENS) : vCB,
      W = {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: Y
        },
        clear_at_least: {
          type: "input_tokens",
          value: Y - J
        },
        exclude_tools: aY6
      };
    I.push(W)
  }
  if (B && Q) {
    let Y = {
      type: "clear_thinking_20251015",
      keep: "all"
    };
    I.push(Y)
  }
  return I.length > 0 ? {
    edits: I
  } : void 0
}
// @from(Start 5453688, End 5453700)
xCB = 180000
// @from(Start 5453704, End 5453715)
vCB = 40000
// @from(Start 5453719, End 5453722)
nY6
// @from(Start 5453724, End 5453727)
aY6
// @from(Start 5453733, End 5453853)
fCB = L(() => {
  hQ();
  yR();
  wF();
  YS();
  c9A();
  u2();
  nY6 = [C9, iK, xY, d5, $X, WS], aY6 = [$5, wX, JS]
})
// @from(Start 5453856, End 5454018)
function rnA(A) {
  if (V6() === "vertex") return hCB;
  if (A?.isNonInteractive) {
    if (A.hasAppendSystemPrompt) return sY6;
    return rY6
  }
  return hCB
}
// @from(Start 5454020, End 5454050)
function gCB() {
  return ""
}
// @from(Start 5454055, End 5454120)
hCB = "You are Claude Code, Anthropic's official CLI for Claude."
// @from(Start 5454124, End 5454226)
sY6 = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// @from(Start 5454230, End 5454300)
rY6 = "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// @from(Start 5454306, End 5454339)
Eh1 = L(() => {
  lK();
  u2()
})
// @from(Start 5454388, End 5454725)
function eY6(A) {
  let Q = A.trim();
  if (!Q) return null;
  let B = Q.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (B && B[1] && B[2]) return `${B[1]}/${B[2]}`.toLowerCase();
  let G = Q.match(/^(?:https?|ssh):\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/);
  if (G && G[1] && G[2]) return `${G[1]}/${G[2]}`.toLowerCase();
  return null
}
// @from(Start 5454726, End 5454901)
async function uCB() {
  let A = await onA();
  if (!A) return null;
  let Q = eY6(A);
  if (!Q) return null;
  return oY6("sha256").update(Q).digest("hex").substring(0, 16)
}
// @from(Start 5454902, End 5455115)
async function AJ6() {
  let A = await Uh1(),
    {
      stdout: Q,
      code: B
    } = await QQ("git", ["rev-list", "--count", `${A}..HEAD`]);
  if (B !== 0) return null;
  return parseInt(Q.trim(), 10) || 0
}
// @from(Start 5455116, End 5455421)
async function wh1() {
  try {
    let [A, Q, B, G, Z, I] = await Promise.all([tY6(), sb(), onA(), mCB(), _t(), NUA()]);
    return {
      commitHash: A,
      branchName: Q,
      remoteUrl: B,
      isHeadOnRemote: G,
      isClean: Z,
      worktreeCount: I
    }
  } catch (A) {
    return null
  }
}
// @from(Start 5455426, End 5455428)
rw
// @from(Start 5455430, End 5455601)
zh1 = async (A) => {
  let {
    code: Q
  } = await A3("git", ["rev-parse", "--is-inside-work-tree"], {
    preserveOutputOnError: !1,
    cwd: A
  });
  return Q === 0
}
// @from(Start 5455603, End 5455710)
tY6 = async () => {
  let {
    stdout: A
  } = await QQ("git", ["rev-parse", "HEAD"]);
  return A.trim()
}
// @from(Start 5455712, End 5455871)
sb = async () => {
  let {
    stdout: A
  } = await QQ("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    preserveOutputOnError: !1
  });
  return A.trim()
}
// @from(Start 5455873, End 5456449)
Uh1 = async () => {
  let {
    stdout: A,
    code: Q
  } = await QQ("git", ["symbolic-ref", "refs/remotes/origin/HEAD"], {
    preserveOutputOnError: !1
  });
  if (Q === 0) {
    let Z = A.trim().match(/refs\/remotes\/origin\/(.+)/);
    if (Z && Z[1]) return Z[1]
  }
  let {
    stdout: B,
    code: G
  } = await QQ("git", ["branch", "-r"], {
    preserveOutputOnError: !1
  });
  if (G === 0) {
    let Z = B.trim().split(`
`).map((I) => I.trim());
    for (let I of ["main", "master"])
      if (Z.some((Y) => Y.includes(`origin/${I}`))) return I
  }
  return "main"
}
// @from(Start 5456451, End 5456635)
onA = async () => {
  let {
    stdout: A,
    code: Q
  } = await QQ("git", ["remote", "get-url", "origin"], {
    preserveOutputOnError: !1
  });
  return Q === 0 ? A.trim() : null
}
// @from(Start 5456637, End 5456778)
mCB = async () => {
  let {
    code: A
  } = await QQ("git", ["rev-parse", "@{u}"], {
    preserveOutputOnError: !1
  });
  return A === 0
}
// @from(Start 5456780, End 5456940)
_t = async () => {
  let {
    stdout: A
  } = await QQ("git", ["status", "--porcelain"], {
    preserveOutputOnError: !1
  });
  return A.trim().length === 0
}
// @from(Start 5456942, End 5457539)
dCB = async () => {
  let A = await mCB(),
    Q = await AJ6();
  if (!A) return {
    hasUpstream: !1,
    needsPush: !0,
    commitsAhead: 0,
    commitsAheadOfDefaultBranch: Q
  };
  let {
    stdout: B,
    code: G
  } = await QQ("git", ["rev-list", "--count", "@{u}..HEAD"], {
    preserveOutputOnError: !1
  });
  if (G !== 0) return {
    hasUpstream: !0,
    needsPush: !1,
    commitsAhead: 0,
    commitsAheadOfDefaultBranch: Q
  };
  let Z = parseInt(B.trim(), 10) || 0;
  return {
    hasUpstream: !0,
    needsPush: Z > 0,
    commitsAhead: Z,
    commitsAheadOfDefaultBranch: Q
  }
}
// @from(Start 5457541, End 5457743)
cCB = async () => {
  let [A, Q] = await Promise.all([_t(), dCB()]);
  return {
    hasUncommitted: !A,
    hasUnpushed: Q.needsPush,
    commitsAheadOfDefaultBranch: Q.commitsAheadOfDefaultBranch
  }
}
// @from(Start 5457745, End 5458596)
pCB = async (A, Q) => {
  if (!await _t()) {
    Q?.("committing");
    let {
      code: W,
      stderr: X
    } = await QQ("git", ["add", "-A"], {
      preserveOutputOnError: !0
    });
    if (W !== 0) return {
      success: !1,
      error: `Failed to stage changes: ${X}`
    };
    let {
      code: V,
      stderr: F
    } = await QQ("git", ["commit", "-m", A], {
      preserveOutputOnError: !0
    });
    if (V !== 0) return {
      success: !1,
      error: `Failed to commit: ${F}`
    }
  }
  Q?.("pushing");
  let G = await dCB(),
    Z = await sb(),
    I = G.hasUpstream ? ["push"] : ["push", "-u", "origin", Z],
    {
      code: Y,
      stderr: J
    } = await QQ("git", I, {
      preserveOutputOnError: !0
    });
  if (Y !== 0) return {
    success: !1,
    error: `Failed to push: ${J}`
  };
  return {
    success: !0
  }
}
// @from(Start 5458598, End 5458984)
$h1 = async () => {
  let {
    stdout: A
  } = await QQ("git", ["status", "--porcelain"], {
    preserveOutputOnError: !1
  }), Q = [], B = [];
  return A.trim().split(`
`).filter((G) => G.length > 0).forEach((G) => {
    let Z = G.substring(0, 2),
      I = G.substring(2).trim();
    if (Z === "??") B.push(I);
    else if (I) Q.push(I)
  }), {
    tracked: Q,
    untracked: B
  }
}
// @from(Start 5458986, End 5459242)
NUA = async () => {
  try {
    let {
      stdout: A,
      code: Q
    } = await QQ("git", ["worktree", "list"], {
      preserveOutputOnError: !1
    });
    if (Q !== 0) return 0;
    return A.trim().split(`
`).length
  } catch (A) {
    return 0
  }
}
// @from(Start 5459244, End 5459751)
lCB = async (A) => {
  try {
    let Q = A || `Claude Code auto-stash - ${new Date().toISOString()}`,
      {
        untracked: B
      } = await $h1();
    if (B.length > 0) {
      let {
        code: Z
      } = await QQ("git", ["add", ...B], {
        preserveOutputOnError: !1
      });
      if (Z !== 0) return !1
    }
    let {
      code: G
    } = await QQ("git", ["stash", "push", "--message", Q], {
      preserveOutputOnError: !1
    });
    return G === 0
  } catch (Q) {
    return !1
  }
}
// @from(Start 5459757, End 5459943)
PV = L(() => {
  l2();
  _8();
  V0();
  U2();
  rw = s1(async () => {
    let {
      code: A
    } = await QQ("git", ["rev-parse", "--is-inside-work-tree"]);
    return A === 0
  })
})
// @from(Start 5459946, End 5460499)
function ZJ6() {
  if (N_()) return `- When you cannot find an answer or the feature doesn't exist, direct the user to ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.ISSUES_EXPLAINER}`;
  return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug"
}
// @from(Start 5460504, End 5460567)
QJ6 = "https://code.claude.com/docs/en/claude_code_docs_map.md"
// @from(Start 5460571, End 5460631)
BJ6 = "https://docs.claude.com/en/api/agent_sdk_docs_map.md"
// @from(Start 5460635, End 5460660)
qh1 = "claude-code-guide"
// @from(Start 5460664, End 5460667)
GJ6
// @from(Start 5460669, End 5460672)
iCB
// @from(Start 5460678, End 5465323)
Nh1 = L(() => {
  wF();
  yR();
  c9A();
  MB();
  gB();
  GJ6 = `You are the Claude Code guide agent. Your primary responsibility is helping users understand and use Claude Code and the Claude Agent SDK effectively.

**Your expertise:**
- Claude Code features and capabilities
- How to implement and use hooks 
- Creating and using slash commands
- Installing and configuring MCP servers
- Claude Agent SDK architecture and development
- Best practices for using Claude Code
- Keyboard shortcuts and hotkeys
- Available slash commands (built-in and custom)
- Configuration options and settings

**Approach:**
1. Use ${$X} to access the documentation maps:
   - Claude Code: ${QJ6}
   - Agent SDK: ${BJ6}
2. From the docs maps, identify the most relevant documentation URLs for the user's question:
   - **Getting Started**: Installation, setup, and basic usage
   - **Features**: Core capabilities like modes (Plan, Build, Deploy), REPL, terminal integration, and interactive features
   - **Built-in slash commands**: Commands like /context, /usage, /model, /help, /todos, etc. that let the user access more information or perform actions
   - **Customization**: Creating custom slash commands, hooks (pre/post command execution), and agents
   - **MCP Integration**: Installing and configuring Model Context Protocol servers for extended capabilities
   - **Configuration**: Settings files, environment variables, and project-specific setup
   - **Agent SDK**: Architecture, building agents, available tools, and SDK development patterns
3. Fetch the specific documentation pages using ${$X}
4. Provide clear, actionable guidance based on the official documentation
5. Use ${WS} if you need additional context or the docs don't cover the topic
6. Reference local project files (CLAUDE.md, .claude/ directory, etc.) when relevant using ${d5}, ${iK}, and ${xY}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets (for the agent SDK) when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`;
  iCB = {
    agentType: qh1,
    whenToUse: 'Use this agent when the user asks questions about Claude Code or the Claude Agent SDK. This includes questions about Claude Code features ("can Claude Code...", "does Claude Code have..."), how to use specific features (hooks, slash commands, MCP servers), and Claude Agent SDK architecture or development. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter. Reusing an existing agent is more efficient and maintains context from previous documentation lookups.',
    tools: [iK, xY, d5, $X, WS],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    permissionMode: "dontAsk",
    getSystemPrompt({
      toolUseContext: A
    }) {
      let Q = A.options.commands,
        B = [],
        G = Q.filter((V) => V.type === "prompt");
      if (G.length > 0) {
        let V = G.map((F) => `- /${F.name}: ${F.description}`).join(`
`);
        B.push(`**Available custom slash commands in this project:**
${V}`)
      }
      let Z = A.options.agentDefinitions.activeAgents.filter((V) => V.source !== "built-in");
      if (Z.length > 0) {
        let V = Z.map((F) => `- ${F.agentType}: ${F.whenToUse}`).join(`
`);
        B.push(`**Available custom agents configured:**
${V}`)
      }
      let I = A.options.mcpClients;
      if (I && I.length > 0) {
        let V = I.map((F) => `- ${F.name}`).join(`
`);
        B.push(`**Configured MCP servers:**
${V}`)
      }
      let Y = Q.filter((V) => V.type === "prompt" && V.source === "plugin");
      if (Y.length > 0) {
        let V = Y.map((F) => `- /${F.name}: ${F.description}`).join(`
`);
        B.push(`**Available plugin slash commands:**
${V}`)
      }
      let J = l0();
      if (Object.keys(J).length > 0) {
        let V = JSON.stringify(J, null, 2);
        B.push(`**User's settings.json:**
\`\`\`json
${V}
\`\`\``)
      }
      let W = ZJ6(),
        X = `${GJ6}
${W}`;
      if (B.length > 0) return `${X}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${B.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
      return X
    }
  }
})
// @from(Start 5465329, End 5465332)
nCB
// @from(Start 5465334, End 5465611)
aCB = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."
// @from(Start 5465617, End 5475348)
sCB = L(() => {
  nCB = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: I'll help add a dark mode toggle to your application settings. Let me create a todo list to track this implementation.
*Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: Let me first search through your codebase to find all occurrences of 'getCwd'.
*Uses grep or search tools to locate all instances of getCwd in the codebase*
Assistant: I've found 15 instances of 'getCwd' across 8 different files. Let me create a todo list to track these changes.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>


<example>
User: I need to implement these features for my e-commerce site: user registration, product catalog, shopping cart, and checkout flow.
Assistant: I'll help implement these features. First, let's add all the features to the todo list.
*Creates a todo list breaking down each feature into specific tasks based on the project architecture*
Assistant: Let's start with user registration. This will involve creating database models, API endpoints, and frontend forms that integrate with your existing authentication system.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple complex features to implement in a comma separated list
2. The todo list helps organize these large features into manageable tasks
3. This approach allows for tracking progress across the entire implementation
</reasoning>
</example>

<example>
User: Can you help optimize my React application? It's rendering slowly and has performance issues.</user>
Assistant: I'll help optimize your React application. First, let me examine your codebase to identify potential performance bottlenecks.
*Reviews component structure, render patterns, state management, and data fetching*
Assistant: After analyzing your codebase, I've identified several performance issues. Let me create a todo list to track our optimization efforts.
*Creates todo list with items like: 1) Implementing memoization for expensive calculations in ProductList, 2) Adding virtualization for long lists in Dashboard, 3) Optimizing image loading in Gallery component, 4) Fixing state update loops in ShoppingCart, 5) Reviewing bundle size and implementing code splitting*
Let's start by implementing memoization for the expensive calculations in your ProductList component.</assistant>

<reasoning>
The assistant used the todo list because:
1. First, the assistant examined the codebase to identify specific performance issues
2. Based on this analysis, it identified multiple optimization opportunities
3. Performance optimization is a non-trivial task requiring multiple steps
4. The todo list helps methodically track improvements across different components
5. This systematic approach ensures all performance bottlenecks are addressed
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

python
print("Hello World")

This will output the text "Hello World" to the console when executed.</assistant>

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What does the git status command do?
Assistant: The git status command shows the current state of your working directory and staging area. It displays which changes have been staged, which haven't, and which files aren't being tracked by Git. This is a fundamental command for understanding the current state of your repository before making commits.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual coding task to complete. The user is simply asking for an explanation, not for the assistant to perform multiple steps or tasks.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the ${$5} tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location in the code. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.

*Executes: npm install*

The command completed successfully. Here's the output:
[Output of npm install command]

All dependencies have been installed according to your package.json file.

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward task.
</reasoning>
</example>

## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`
})
// @from(Start 5475354, End 5475357)
IJ6
// @from(Start 5475359, End 5475362)
YJ6
// @from(Start 5475364, End 5475367)
V7A
// @from(Start 5475373, End 5475639)
Lh1 = L(() => {
  Q2();
  IJ6 = j.enum(["pending", "in_progress", "completed"]), YJ6 = j.object({
    content: j.string().min(1, "Content cannot be empty"),
    status: IJ6,
    activeForm: j.string().min(1, "Active form cannot be empty")
  }), V7A = j.array(YJ6)
})
// @from(Start 5475642, End 5475674)
function rCB() {
  return null
}
// @from(Start 5475676, End 5475708)
function oCB() {
  return null
}
// @from(Start 5475710, End 5475742)
function tCB() {
  return null
}
// @from(Start 5475744, End 5475776)
function eCB() {
  return null
}
// @from(Start 5475778, End 5475810)
function AEB() {
  return null
}
// @from(Start 5475815, End 5475832)
QEB = "TodoWrite"
// @from(Start 5475838, End 5475841)
JJ6
// @from(Start 5475843, End 5475846)
WJ6
// @from(Start 5475848, End 5475850)
BY
// @from(Start 5475856, End 5477789)
kt = L(() => {
  Q2();
  sCB();
  Lh1();
  JJ6 = j.strictObject({
    todos: V7A.describe("The updated todo list")
  }), WJ6 = j.object({
    oldTodos: V7A.describe("The todo list before the update"),
    newTodos: V7A.describe("The todo list after the update")
  }), BY = {
    name: QEB,
    strict: !0,
    input_examples: [{
      todos: [{
        content: "Implement user authentication",
        status: "in_progress",
        activeForm: "Implementing user authentication"
      }, {
        content: "Write unit tests",
        status: "pending",
        activeForm: "Writing unit tests"
      }]
    }],
    async description() {
      return aCB
    },
    async prompt() {
      return nCB
    },
    inputSchema: JJ6,
    outputSchema: WJ6,
    userFacingName() {
      return ""
    },
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: rCB,
    renderToolUseProgressMessage: oCB,
    renderToolUseRejectedMessage: tCB,
    renderToolUseErrorMessage: eCB,
    renderToolResultMessage: AEB,
    async call({
      todos: A
    }, Q) {
      let G = (await Q.getAppState()).todos[Q.agentId] ?? [],
        Z = A.every((I) => I.status === "completed") ? [] : A;
      return Q.setAppState((I) => ({
        ...I,
        todos: {
          ...I.todos,
          [Q.agentId]: Z
        }
      })), {
        data: {
          oldTodos: G,
          newTodos: A
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
      }
    }
  }
})
// @from(Start 5477792, End 5478647)
function BEB(A, Q, {
  signal: B,
  edges: G
} = {}) {
  let Z = void 0,
    I = null,
    Y = G != null && G.includes("leading"),
    J = G == null || G.includes("trailing"),
    W = () => {
      if (I !== null) A.apply(Z, I), Z = void 0, I = null
    },
    X = () => {
      if (J) W();
      D()
    },
    V = null,
    F = () => {
      if (V != null) clearTimeout(V);
      V = setTimeout(() => {
        V = null, X()
      }, Q)
    },
    K = () => {
      if (V !== null) clearTimeout(V), V = null
    },
    D = () => {
      K(), Z = void 0, I = null
    },
    H = () => {
      K(), W()
    },
    C = function(...E) {
      if (B?.aborted) return;
      Z = this, I = E;
      let U = V == null;
      if (F(), Y && U) W()
    };
  return C.schedule = F, C.cancel = D, C.flush = H, B?.addEventListener("abort", D, {
    once: !0
  }), C
}
// @from(Start 5478652, End 5478666)
GEB = () => {}
// @from(Start 5478669, End 5479390)
function ZEB(A, Q = 0, B = {}) {
  if (typeof B !== "object") B = {};
  let {
    signal: G,
    leading: Z = !1,
    trailing: I = !0,
    maxWait: Y
  } = B, J = Array(2);
  if (Z) J[0] = "leading";
  if (I) J[1] = "trailing";
  let W = void 0,
    X = null,
    V = BEB(function(...D) {
      W = A.apply(this, D), X = null
    }, Q, {
      signal: G,
      edges: J
    }),
    F = function(...D) {
      if (Y != null) {
        if (X === null) X = Date.now();
        else if (Date.now() - X >= Y) return W = A.apply(this, D), X = Date.now(), V.cancel(), V.schedule(), W
      }
      return V.apply(this, D), W
    },
    K = () => {
      return V.flush(), W
    };
  return F.cancel = V.cancel, F.flush = K, F
}
// @from(Start 5479395, End 5479421)
IEB = L(() => {
  GEB()
})
// @from(Start 5479424, End 5479658)
function Mh1(A, Q = 0, B = {}) {
  if (typeof B !== "object") B = {};
  let {
    leading: G = !0,
    trailing: Z = !0,
    signal: I
  } = B;
  return ZEB(A, Q, {
    leading: G,
    trailing: Z,
    signal: I,
    maxWait: Q
  })
}
// @from(Start 5479663, End 5479689)
YEB = L(() => {
  IEB()
})
// @from(Start 5479695, End 5479721)
JEB = L(() => {
  YEB()
})
// @from(Start 5479724, End 5480173)
function Oh1(A, {
  include: Q,
  exclude: B
} = {}) {
  let G = (Z) => {
    let I = (Y) => typeof Y === "string" ? Z === Y : Y.test(Z);
    if (Q) return Q.some(I);
    if (B) return !B.some(I);
    return !0
  };
  for (let [Z, I] of XJ6(A.constructor.prototype)) {
    if (I === "constructor" || !G(I)) continue;
    let Y = Reflect.getOwnPropertyDescriptor(Z, I);
    if (Y && typeof Y.value === "function") A[I] = A[I].bind(A)
  }
  return A
}
// @from(Start 5480178, End 5480349)
XJ6 = (A) => {
  let Q = new Set;
  do
    for (let B of Reflect.ownKeys(A)) Q.add([A, B]); while ((A = Reflect.getPrototypeOf(A)) && A !== Object.prototype);
  return Q
}
// @from(Start 5480407, End 5480410)
XEB
// @from(Start 5480412, End 5480415)
Rh1
// @from(Start 5480417, End 5480761)
VJ6 = (A) => {
    let Q = new WEB,
      B = new WEB;
    Q.write = (Z) => {
      A("stdout", Z)
    }, B.write = (Z) => {
      A("stderr", Z)
    };
    let G = new console.Console(Q, B);
    for (let Z of XEB) Rh1[Z] = console[Z], console[Z] = G[Z];
    return () => {
      for (let Z of XEB) console[Z] = Rh1[Z];
      Rh1 = {}
    }
  }
// @from(Start 5480765, End 5480768)
VEB
// @from(Start 5480774, End 5481000)
FEB = L(() => {
  XEB = ["assert", "count", "countReset", "debug", "dir", "dirxml", "error", "group", "groupCollapsed", "groupEnd", "info", "log", "table", "time", "timeEnd", "timeLog", "trace", "warn"], Rh1 = {}, VEB = VJ6
})
// @from(Start 5481006, End 5487160)
UEB = z((KJ6) => {
  function Ph1(A, Q) {
    var B = A.length;
    A.push(Q);
    A: for (; 0 < B;) {
      var G = B - 1 >>> 1,
        Z = A[G];
      if (0 < tnA(Z, Q)) A[G] = Q, A[B] = Z, B = G;
      else break A
    }
  }

  function DT(A) {
    return A.length === 0 ? null : A[0]
  }

  function BaA(A) {
    if (A.length === 0) return null;
    var Q = A[0],
      B = A.pop();
    if (B !== Q) {
      A[0] = B;
      A: for (var G = 0, Z = A.length, I = Z >>> 1; G < I;) {
        var Y = 2 * (G + 1) - 1,
          J = A[Y],
          W = Y + 1,
          X = A[W];
        if (0 > tnA(J, B)) W < Z && 0 > tnA(X, J) ? (A[G] = X, A[W] = B, G = W) : (A[G] = J, A[Y] = B, G = Y);
        else if (W < Z && 0 > tnA(X, B)) A[G] = X, A[W] = B, G = W;
        else break A
      }
    }
    return Q
  }

  function tnA(A, Q) {
    var B = A.sortIndex - Q.sortIndex;
    return B !== 0 ? B : A.id - Q.id
  }
  if (typeof performance === "object" && typeof performance.now === "function") jh1 = performance, KJ6.unstable_now = function() {
    return jh1.now()
  };
  else enA = Date, Sh1 = enA.now(), KJ6.unstable_now = function() {
    return enA.now() - Sh1
  };
  var jh1, enA, Sh1, P_ = [],
    sc = [],
    FJ6 = 1,
    JM = null,
    fH = 3,
    GaA = !1,
    yt = !1,
    MUA = !1,
    DEB = typeof setTimeout === "function" ? setTimeout : null,
    HEB = typeof clearTimeout === "function" ? clearTimeout : null,
    KEB = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);

  function _h1(A) {
    for (var Q = DT(sc); Q !== null;) {
      if (Q.callback === null) BaA(sc);
      else if (Q.startTime <= A) BaA(sc), Q.sortIndex = Q.expirationTime, Ph1(P_, Q);
      else break;
      Q = DT(sc)
    }
  }

  function yh1(A) {
    if (MUA = !1, _h1(A), !yt)
      if (DT(P_) !== null) yt = !0, vh1(xh1);
      else {
        var Q = DT(sc);
        Q !== null && bh1(yh1, Q.startTime - A)
      }
  }

  function xh1(A, Q) {
    yt = !1, MUA && (MUA = !1, HEB(OUA), OUA = -1), GaA = !0;
    var B = fH;
    try {
      _h1(Q);
      for (JM = DT(P_); JM !== null && (!(JM.expirationTime > Q) || A && !zEB());) {
        var G = JM.callback;
        if (typeof G === "function") {
          JM.callback = null, fH = JM.priorityLevel;
          var Z = G(JM.expirationTime <= Q);
          Q = KJ6.unstable_now(), typeof Z === "function" ? JM.callback = Z : JM === DT(P_) && BaA(P_), _h1(Q)
        } else BaA(P_);
        JM = DT(P_)
      }
      if (JM !== null) var I = !0;
      else {
        var Y = DT(sc);
        Y !== null && bh1(yh1, Y.startTime - Q), I = !1
      }
      return I
    } finally {
      JM = null, fH = B, GaA = !1
    }
  }
  var ZaA = !1,
    AaA = null,
    OUA = -1,
    CEB = 5,
    EEB = -1;

  function zEB() {
    return KJ6.unstable_now() - EEB < CEB ? !1 : !0
  }

  function Th1() {
    if (AaA !== null) {
      var A = KJ6.unstable_now();
      EEB = A;
      var Q = !0;
      try {
        Q = AaA(!0, A)
      } finally {
        Q ? LUA() : (ZaA = !1, AaA = null)
      }
    } else ZaA = !1
  }
  var LUA;
  if (typeof KEB === "function") LUA = function() {
    KEB(Th1)
  };
  else if (typeof MessageChannel < "u") QaA = new MessageChannel, kh1 = QaA.port2, QaA.port1.onmessage = Th1, LUA = function() {
    kh1.postMessage(null)
  };
  else LUA = function() {
    DEB(Th1, 0)
  };
  var QaA, kh1;

  function vh1(A) {
    AaA = A, ZaA || (ZaA = !0, LUA())
  }

  function bh1(A, Q) {
    OUA = DEB(function() {
      A(KJ6.unstable_now())
    }, Q)
  }
  KJ6.unstable_IdlePriority = 5;
  KJ6.unstable_ImmediatePriority = 1;
  KJ6.unstable_LowPriority = 4;
  KJ6.unstable_NormalPriority = 3;
  KJ6.unstable_Profiling = null;
  KJ6.unstable_UserBlockingPriority = 2;
  KJ6.unstable_cancelCallback = function(A) {
    A.callback = null
  };
  KJ6.unstable_continueExecution = function() {
    yt || GaA || (yt = !0, vh1(xh1))
  };
  KJ6.unstable_forceFrameRate = function(A) {
    0 > A || 125 < A ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : CEB = 0 < A ? Math.floor(1000 / A) : 5
  };
  KJ6.unstable_getCurrentPriorityLevel = function() {
    return fH
  };
  KJ6.unstable_getFirstCallbackNode = function() {
    return DT(P_)
  };
  KJ6.unstable_next = function(A) {
    switch (fH) {
      case 1:
      case 2:
      case 3:
        var Q = 3;
        break;
      default:
        Q = fH
    }
    var B = fH;
    fH = Q;
    try {
      return A()
    } finally {
      fH = B
    }
  };
  KJ6.unstable_pauseExecution = function() {};
  KJ6.unstable_requestPaint = function() {};
  KJ6.unstable_runWithPriority = function(A, Q) {
    switch (A) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        A = 3
    }
    var B = fH;
    fH = A;
    try {
      return Q()
    } finally {
      fH = B
    }
  };
  KJ6.unstable_scheduleCallback = function(A, Q, B) {
    var G = KJ6.unstable_now();
    switch (typeof B === "object" && B !== null ? (B = B.delay, B = typeof B === "number" && 0 < B ? G + B : G) : B = G, A) {
      case 1:
        var Z = -1;
        break;
      case 2:
        Z = 250;
        break;
      case 5:
        Z = 1073741823;
        break;
      case 4:
        Z = 1e4;
        break;
      default:
        Z = 5000
    }
    return Z = B + Z, A = {
      id: FJ6++,
      callback: Q,
      priorityLevel: A,
      startTime: B,
      expirationTime: Z,
      sortIndex: -1
    }, B > G ? (A.sortIndex = B, Ph1(sc, A), DT(P_) === null && A === DT(sc) && (MUA ? (HEB(OUA), OUA = -1) : MUA = !0, bh1(yh1, B - G))) : (A.sortIndex = Z, Ph1(P_, A), yt || GaA || (yt = !0, vh1(xh1))), A
  };
  KJ6.unstable_shouldYield = zEB;
  KJ6.unstable_wrapCallback = function(A) {
    var Q = fH;
    return function() {
      var B = fH;
      fH = Q;
      try {
        return A.apply(this, arguments)
      } finally {
        fH = B
      }
    }
  }
})