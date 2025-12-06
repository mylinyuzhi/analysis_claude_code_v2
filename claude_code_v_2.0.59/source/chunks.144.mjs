
// @from(Start 13645455, End 13648033)
async function qX0() {
  let Q = l0().enabledPlugins || {},
    B = ajA(),
    G = B !== null,
    Z = B?.version ?? 0;
  if (US3(Q)) return;
  if (!G || Z !== kQA) g(`Schema version mismatch (current: ${Z}, expected: ${kQA}), syncing installed_plugins.json`);
  else g("Syncing installed_plugins.json with enabledPlugins from settings");
  let I = RA(),
    Y = QVA(),
    J = new Date().toISOString(),
    W = 0,
    X = 0;
  for (let [V] of Object.entries(Q)) {
    if (!$S3(V, Y)) {
      X++;
      continue
    }
    let F = V.split("@"),
      K = F[0];
    if (!K || F.length !== 2) {
      g(`Invalid plugin ID format: ${V}, skipping migration`), X++;
      continue
    }
    try {
      let D, H = "unknown",
        C = void 0,
        E = !1;
      try {
        let U = await nl(V);
        if (!U) {
          g(`Plugin ${V} not found in any marketplace, skipping`), X++;
          continue
        }
        let {
          entry: q,
          marketplaceInstallLocation: w
        } = U;
        if (typeof q.source === "string") E = !0, D = Xx(w, q.source), H = w39(D, V), C = await mI1(D);
        else {
          let N = al(),
            R = K.replace(/[^a-zA-Z0-9-_]/g, "-"),
            T = Xx(N, R);
          if (!I.existsSync(T)) {
            g(`External plugin ${V} not in cache, skipping`), X++;
            continue
          }
          D = T, H = w39(T, V), C = await mI1(T)
        }
        if (H === "unknown" && C) H = C.substring(0, 12), g(`Using git SHA as version for ${V}: ${H}`)
      } catch (U) {
        g(`Failed to get plugin info for ${V}: ${U}, skipping`), X++;
        continue
      }
      Y[V] = {
        version: H,
        installedAt: J,
        lastUpdated: J,
        installPath: D,
        gitCommitSha: C,
        isLocal: E
      }, W++, g(`Added ${V} to installed_plugins.json`)
    } catch (D) {
      let H = D instanceof Error ? D.message : String(D);
      g(`Failed to migrate plugin ${V}: ${H}`, {
        level: "warn"
      }), X++
    }
  }
  if (W > 0 || !G || Z !== kQA)
    if (o2("tengu_enable_versioned_plugins")) {
      let F = $X0({
        version: 1,
        plugins: Y
      });
      N39(F), g(`Sync completed (V2): ${W} plugins added to installed_plugins.json, ${X} skipped`)
    } else if (cI1(Y), !G || Z !== kQA) g(`Updated installed_plugins.json to schema version ${kQA} (${W} plugins added, ${X} skipped)`);
  else g(`Sync completed: ${W} plugins added to installed_plugins.json, ${X} skipped`);
  else if (X > 0) g(`Sync completed: All ${X} plugins already in installed_plugins.json`)
}
// @from(Start 13648038, End 13648068)
JS3 = "installed_plugins.json"
// @from(Start 13648072, End 13648105)
WS3 = "installed_plugins_v2.json"
// @from(Start 13648109, End 13648116)
kQA = 1
// @from(Start 13648120, End 13648129)
hg = null
// @from(Start 13648133, End 13648142)
T$ = null
// @from(Start 13648146, End 13648156)
zX0 = null
// @from(Start 13648162, End 13648259)
za = L(() => {
  AQ();
  V0();
  g1();
  hQ();
  u2();
  aAA();
  MB();
  fV();
  _8();
  oH()
})
// @from(Start 13648261, End 13648322)
async function wS3() {
  return "claude-code" in await pZ()
}
// @from(Start 13648323, End 13648510)
async function qS3() {
  let A = await QQ("rg", ["--files", "--glob", "*.{html,css,htm}", "--max-count=1"], {
    timeout: 5000
  });
  return A.code === 0 && A.stdout.trim().length > 0
}
// @from(Start 13648511, End 13648701)
async function iI1() {
  let A = [...NS3, ...LS3],
    Q = await Promise.all(A.map((B) => B.isRelevant()));
  return A.filter((B, G) => Q[G]).filter((B) => uI1(B.id) >= B.cooldownSessions)
}
// @from(Start 13648706, End 13648709)
NS3
// @from(Start 13648711, End 13648714)
LS3
// @from(Start 13648720, End 13658148)
NX0 = L(() => {
  jQ();
  PV();
  za();
  oH();
  _8();
  t2();
  r7A();
  c5();
  nY();
  Q3();
  Up();
  MB();
  EX0();
  S7();
  sU();
  V0();
  iUA();
  NS3 = [{
    id: "new-user-warmup",
    content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
    cooldownSessions: 3,
    async isRelevant() {
      return N1().numStartups < 10
    }
  }, {
    id: "plan-mode-for-complex-tasks",
    content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${HU.displayText} twice to enable.`,
    cooldownSessions: 5,
    isRelevant: async () => {
      let A = N1();
      return (A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0) > 7
    }
  }, {
    id: "default-permission-mode-config",
    content: async () => "Use /config to change your default permission mode (including Plan Mode)",
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        let A = N1(),
          Q = l0(),
          B = Boolean(A.lastPlanModeUse),
          G = Boolean(Q?.permissions?.defaultMode);
        return B && !G
      } catch (A) {
        return g(`Failed to check default-permission-mode-config tip relevance: ${A}`, {
          level: "warn"
        }), !1
      }
    }
  }, {
    id: "git-worktrees",
    content: async () => "Use git worktrees to run multiple Claude sessions in parallel.",
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        let A = N1();
        return await NUA() <= 1 && A.numStartups > 50
      } catch (A) {
        return !1
      }
    }
  }, {
    id: "terminal-setup",
    content: async () => d0.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
    cooldownSessions: 10,
    async isRelevant() {
      let A = N1();
      if (d0.terminal === "Apple_Terminal") return Ep.isEnabled() && !A.optionAsMetaKeyInstalled;
      return Ep.isEnabled() && !A.shiftEnterKeyBindingInstalled
    }
  }, {
    id: "shift-enter",
    content: async () => d0.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
    cooldownSessions: 10,
    async isRelevant() {
      let A = N1();
      return Boolean((d0.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled) && A.numStartups > 3)
    }
  }, {
    id: "shift-enter-setup",
    content: async () => d0.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
    cooldownSessions: 10,
    async isRelevant() {
      if (!M$A()) return !1;
      let A = N1();
      return !(d0.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled)
    }
  }, {
    id: "memory-command",
    content: async () => "Use /memory to view and manage Claude memory",
    cooldownSessions: 15,
    async isRelevant() {
      return N1().memoryUsageCount <= 0
    }
  }, {
    id: "theme-command",
    content: async () => "Use /theme to change the color theme",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "status-line",
    content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
    cooldownSessions: 25,
    isRelevant: async () => l0().statusLine === void 0
  }, {
    id: "stickers-command",
    content: async () => "Use /stickers to order Claude Code swag",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "prompt-queue",
    content: async () => "Hit Enter to queue up additional messages while Claude is working.",
    cooldownSessions: 5,
    async isRelevant() {
      return N1().promptQueueUseCount <= 3
    }
  }, {
    id: "enter-to-steer-in-relatime",
    content: async () => "Send messages to Claude while it works to steer Claude in real-time",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "todo-list",
    content: async () => "Ask Claude to create a todo list when working on complex tasks to track progress and remain on track",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "vscode-command-install",
    content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${d0.terminal==="vscode"?"code":d0.terminal}' command in PATH" to enable IDE integration`,
    cooldownSessions: 0,
    async isRelevant() {
      if (!KLA()) return !1;
      if (dQ() !== "macos") return !1;
      switch (d0.terminal) {
        case "vscode":
          return !YB2();
        case "cursor":
          return !ZB2();
        case "windsurf":
          return !IB2();
        default:
          return !1
      }
    }
  }, {
    id: "ide-upsell-external-terminal",
    content: async () => "Connect Claude to your IDE · /ide",
    cooldownSessions: 4,
    async isRelevant() {
      if (bV()) return !1;
      if (jQ1().length !== 0) return !1;
      return _Q1().length > 0
    }
  }, {
    id: "# for memory",
    content: async () => "Want Claude to remember something? Hit # to add preferences, tools, and instructions to Claude's memory",
    cooldownSessions: 10,
    isRelevant: async () => N1().memoryUsageCount <= 10
  }, {
    id: "install-github-app",
    content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
    cooldownSessions: 10,
    isRelevant: async () => !N1().githubActionSetupCount
  }, {
    id: "permissions",
    content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
    cooldownSessions: 10,
    async isRelevant() {
      return N1().numStartups > 10
    }
  }, {
    id: "drag-and-drop-images",
    content: async () => "Did you know you can drag and drop image files into your terminal?",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "paste-images-mac",
    content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
    cooldownSessions: 10,
    isRelevant: async () => dQ() === "macos"
  }, {
    id: "double-esc",
    content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
    cooldownSessions: 10,
    isRelevant: async () => !EG()
  }, {
    id: "double-esc-code-restore",
    content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
    cooldownSessions: 10,
    isRelevant: async () => EG()
  }, {
    id: "continue",
    content: async () => "Run claude --continue or claude --resume to resume a conversation",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "rename-conversation",
    content: async () => "Name your conversations with /rename to find them easily in /resume later",
    cooldownSessions: 15,
    isRelevant: async () => ug() && N1().numStartups > 10
  }, {
    id: "custom-commands",
    content: async () => "Create custom slash commands by adding .md files to .claude/commands/ in your project or ~/.claude/commands/ for commands that work in any project",
    cooldownSessions: 15,
    async isRelevant() {
      return N1().numStartups > 10
    }
  }, {
    id: "shift-tab",
    content: async () => `Hit ${HU.displayText} to cycle between default mode, auto-accept edit mode, and plan mode`,
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "image-paste",
    content: async () => `Use ${tt.displayText} to paste images from your clipboard`,
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "tab-toggle-thinking",
    content: async () => "Hit tab to toggle thinking mode on and off",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "ultrathink-keyword",
    content: async () => "Type 'ultrathink' in your message to enable thinking for just that turn",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "custom-agents",
    content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
    cooldownSessions: 15,
    async isRelevant() {
      return N1().numStartups > 5
    }
  }, {
    id: "opusplan-mode-reminder",
    content: async () => `Your default model setting is Opus Plan Mode. Press ${HU.displayText} twice to activate Plan Mode and plan with Claude Opus.`,
    cooldownSessions: 2,
    async isRelevant() {
      let A = N1(),
        B = Tt() === "opusplan",
        G = A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0;
      return B && G > 3
    }
  }, {
    id: "frontend-design-plugin",
    content: async (A) => {
      let Q = await wS3(),
        B = ZB("suggestion", A.theme);
      if (!Q) return `Working with HTML/CSS? Add the frontend-design plugin:
${B("/plugin marketplace add anthropics/claude-code")}
${B("/plugin install frontend-design@claude-code-plugins")}`;
      return `Working with HTML/CSS? Install the frontend-design plugin:
${B("/plugin install frontend-design@claude-code-plugins")}`
    },
    cooldownSessions: 3,
    async isRelevant() {
      if (gg("frontend-design@claude-code-plugins")) return !1;
      return qS3()
    }
  }], LS3 = []
})
// @from(Start 13658151, End 13658366)
function MS3(A) {
  if (A.length === 0) return;
  if (A.length === 1) return A[0];
  let Q = A.map((B) => ({
    tip: B,
    sessions: uI1(B.id)
  }));
  return Q.sort((B, G) => G.sessions - B.sessions), Q[0]?.tip
}
// @from(Start 13658367, End 13658506)
async function R39() {
  if (l0().spinnerTipsEnabled === !1) return;
  let A = await iI1();
  if (A.length === 0) return;
  return MS3(A)
}
// @from(Start 13658508, End 13658633)
function T39(A) {
  $39(A.id), GA("tengu_tip_shown", {
    tipIdLength: A.id,
    cooldownSessions: A.cooldownSessions
  })
}
// @from(Start 13658638, End 13658706)
P39 = L(() => {
  EX0();
  q0();
  jQ();
  MB();
  tXA();
  NX0()
})
// @from(Start 13658709, End 13658835)
function S39() {
  let [A, Q] = OQ(), {
    toolPermissionContext: B
  } = A;
  j39.useEffect(() => {
    LX0(B, Q)
  }, [])
}
// @from(Start 13658840, End 13658843)
j39
// @from(Start 13658845, End 13658848)
LX0
// @from(Start 13658854, End 13659152)
_39 = L(() => {
  l2();
  z9();
  tJA();
  j39 = BA(VA(), 1), LX0 = s1(async (A, Q) => {
    if (!A.isBypassPermissionsModeAvailable) return;
    if (!await MX0()) return;
    Q((G) => {
      return {
        ...G,
        toolPermissionContext: k39(G.toolPermissionContext)
      }
    })
  })
})
// @from(Start 13659155, End 13659319)
function y39(A, Q, B) {
  let G = nI1.useRef(!1);
  nI1.useEffect(() => {
    if (!EG() || G.current) return;
    if (G.current = !0, A) xYA(A, B)
  }, [Q, A, B])
}
// @from(Start 13659324, End 13659327)
nI1
// @from(Start 13659333, End 13659379)
x39 = L(() => {
  sU();
  nI1 = BA(VA(), 1)
})
// @from(Start 13659382, End 13660684)
function v39({
  hostPattern: {
    host: A
  },
  onUserResponse: Q
}) {
  function B(Z) {
    switch (Z) {
      case "yes":
        Q({
          allow: !0,
          persistToSettings: !1
        });
        break;
      case "yes-dont-ask-again":
        Q({
          allow: !0,
          persistToSettings: !0
        });
        break;
      case "no":
        Q({
          allow: !1,
          persistToSettings: !1
        });
        break
    }
  }
  let G = [{
    label: "Yes",
    value: "yes"
  }, {
    label: `Yes, and don't ask again for ${tA.bold(A)}`,
    value: "yes-dont-ask-again"
  }, {
    label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
    value: "no"
  }];
  return oV.createElement(uJ, {
    title: "Network request outside of sandbox"
  }, oV.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, oV.createElement(S, null, oV.createElement($, {
    dimColor: !0
  }, "Host:"), oV.createElement($, null, " ", A)), oV.createElement(S, {
    marginTop: 1
  }, oV.createElement($, null, "Do you want to allow this connection?")), oV.createElement(S, null, oV.createElement(M0, {
    options: G,
    onChange: B,
    onCancel: () => {
      Q({
        allow: !1,
        persistToSettings: !1
      })
    }
  }))))
}
// @from(Start 13660689, End 13660691)
oV
// @from(Start 13660697, End 13660774)
b39 = L(() => {
  hA();
  S5();
  wO();
  F9();
  q0();
  oV = BA(VA(), 1)
})
// @from(Start 13660780, End 13660783)
OS3
// @from(Start 13660785, End 13660788)
AfZ
// @from(Start 13660790, End 13660805)
aI1 = 604800000
// @from(Start 13660809, End 13660823)
f39 = 86400000
// @from(Start 13660827, End 13660830)
OX0
// @from(Start 13660836, End 13660951)
sjA = L(() => {
  OS3 = Math.pow(10, 8) * 24 * 60 * 60 * 1000, AfZ = -OS3, OX0 = Symbol.for("constructDateFrom")
})
// @from(Start 13660954, End 13661158)
function P$(A, Q) {
  if (typeof A === "function") return A(Q);
  if (A && typeof A === "object" && OX0 in A) return A[OX0](Q);
  if (A instanceof Date) return new A.constructor(Q);
  return new Date(Q)
}
// @from(Start 13661163, End 13661188)
Ua = L(() => {
  sjA()
})
// @from(Start 13661191, End 13661235)
function sJ(A, Q) {
  return P$(Q || A, A)
}
// @from(Start 13661240, End 13661264)
GN = L(() => {
  Ua()
})
// @from(Start 13661270, End 13661284)
h39 = () => {}
// @from(Start 13661290, End 13661304)
g39 = () => {}
// @from(Start 13661310, End 13661324)
u39 = () => {}
// @from(Start 13661330, End 13661344)
m39 = () => {}
// @from(Start 13661350, End 13661364)
d39 = () => {}
// @from(Start 13661370, End 13661384)
c39 = () => {}
// @from(Start 13661390, End 13661404)
p39 = () => {}
// @from(Start 13661410, End 13661424)
l39 = () => {}
// @from(Start 13661430, End 13661444)
i39 = () => {}
// @from(Start 13661447, End 13661477)
function $a() {
  return RS3
}
// @from(Start 13661482, End 13661485)
RS3
// @from(Start 13661491, End 13661520)
rjA = L(() => {
  RS3 = {}
})
// @from(Start 13661523, End 13661817)
function mg(A, Q) {
  let B = $a(),
    G = Q?.weekStartsOn ?? Q?.locale?.options?.weekStartsOn ?? B.weekStartsOn ?? B.locale?.options?.weekStartsOn ?? 0,
    Z = sJ(A, Q?.in),
    I = Z.getDay(),
    Y = (I < G ? 7 : 0) + I - G;
  return Z.setDate(Z.getDate() - Y), Z.setHours(0, 0, 0, 0), Z
}
// @from(Start 13661822, End 13661856)
BVA = L(() => {
  rjA();
  GN()
})
// @from(Start 13661859, End 13661933)
function xQA(A, Q) {
  return mg(A, {
    ...Q,
    weekStartsOn: 1
  })
}
// @from(Start 13661938, End 13661964)
ojA = L(() => {
  BVA()
})
// @from(Start 13661967, End 13662331)
function sI1(A, Q) {
  let B = sJ(A, Q?.in),
    G = B.getFullYear(),
    Z = P$(B, 0);
  Z.setFullYear(G + 1, 0, 4), Z.setHours(0, 0, 0, 0);
  let I = xQA(Z),
    Y = P$(B, 0);
  Y.setFullYear(G, 0, 4), Y.setHours(0, 0, 0, 0);
  let J = xQA(Y);
  if (B.getTime() >= I.getTime()) return G + 1;
  else if (B.getTime() >= J.getTime()) return G;
  else return G - 1
}
// @from(Start 13662336, End 13662378)
rI1 = L(() => {
  Ua();
  ojA();
  GN()
})
// @from(Start 13662381, End 13662608)
function RX0(A) {
  let Q = sJ(A),
    B = new Date(Date.UTC(Q.getFullYear(), Q.getMonth(), Q.getDate(), Q.getHours(), Q.getMinutes(), Q.getSeconds(), Q.getMilliseconds()));
  return B.setUTCFullYear(Q.getFullYear()), +A - +B
}
// @from(Start 13662613, End 13662638)
n39 = L(() => {
  GN()
})
// @from(Start 13662641, End 13662752)
function a39(A, ...Q) {
  let B = P$.bind(null, A || Q.find((G) => typeof G === "object"));
  return Q.map(B)
}
// @from(Start 13662757, End 13662782)
s39 = L(() => {
  Ua()
})
// @from(Start 13662785, End 13662866)
function TX0(A, Q) {
  let B = sJ(A, Q?.in);
  return B.setHours(0, 0, 0, 0), B
}
// @from(Start 13662871, End 13662896)
PX0 = L(() => {
  GN()
})
// @from(Start 13662899, End 13663050)
function r39(A, Q, B) {
  let [G, Z] = a39(B?.in, A, Q), I = TX0(G), Y = TX0(Z), J = +I - RX0(I), W = +Y - RX0(Y);
  return Math.round((J - W) / f39)
}
// @from(Start 13663055, End 13663108)
jX0 = L(() => {
  n39();
  s39();
  sjA();
  PX0()
})
// @from(Start 13663111, End 13663245)
function o39(A, Q) {
  let B = sI1(A, Q),
    G = P$(Q?.in || A, 0);
  return G.setFullYear(B, 0, 4), G.setHours(0, 0, 0, 0), xQA(G)
}
// @from(Start 13663250, End 13663293)
SX0 = L(() => {
  Ua();
  rI1();
  ojA()
})
// @from(Start 13663299, End 13663313)
t39 = () => {}
// @from(Start 13663319, End 13663333)
e39 = () => {}
// @from(Start 13663339, End 13663353)
A79 = () => {}
// @from(Start 13663359, End 13663373)
Q79 = () => {}
// @from(Start 13663379, End 13663393)
B79 = () => {}
// @from(Start 13663399, End 13663413)
G79 = () => {}
// @from(Start 13663419, End 13663433)
Z79 = () => {}
// @from(Start 13663439, End 13663453)
I79 = () => {}
// @from(Start 13663459, End 13663473)
Y79 = () => {}
// @from(Start 13663479, End 13663493)
J79 = () => {}
// @from(Start 13663499, End 13663513)
W79 = () => {}
// @from(Start 13663519, End 13663533)
X79 = () => {}
// @from(Start 13663539, End 13663553)
V79 = () => {}
// @from(Start 13663559, End 13663573)
F79 = () => {}
// @from(Start 13663579, End 13663593)
K79 = () => {}
// @from(Start 13663599, End 13663613)
D79 = () => {}
// @from(Start 13663619, End 13663633)
H79 = () => {}
// @from(Start 13663639, End 13663653)
C79 = () => {}
// @from(Start 13663656, End 13663784)
function E79(A) {
  return A instanceof Date || typeof A === "object" && Object.prototype.toString.call(A) === "[object Date]"
}
// @from(Start 13663789, End 13663803)
_X0 = () => {}
// @from(Start 13663806, End 13663887)
function z79(A) {
  return !(!E79(A) && typeof A !== "number" || isNaN(+sJ(A)))
}
// @from(Start 13663892, End 13663926)
kX0 = L(() => {
  _X0();
  GN()
})
// @from(Start 13663932, End 13663946)
U79 = () => {}
// @from(Start 13663952, End 13663966)
$79 = () => {}
// @from(Start 13663972, End 13663986)
w79 = () => {}
// @from(Start 13663992, End 13664006)
q79 = () => {}
// @from(Start 13664012, End 13664026)
N79 = () => {}
// @from(Start 13664032, End 13664046)
L79 = () => {}
// @from(Start 13664052, End 13664066)
M79 = () => {}
// @from(Start 13664072, End 13664086)
O79 = () => {}
// @from(Start 13664092, End 13664106)
R79 = () => {}
// @from(Start 13664112, End 13664126)
T79 = () => {}
// @from(Start 13664132, End 13664146)
P79 = () => {}
// @from(Start 13664152, End 13664166)
j79 = () => {}
// @from(Start 13664172, End 13664186)
S79 = () => {}
// @from(Start 13664192, End 13664206)
_79 = () => {}
// @from(Start 13664212, End 13664226)
k79 = () => {}
// @from(Start 13664232, End 13664246)
y79 = () => {}
// @from(Start 13664252, End 13664266)
x79 = () => {}
// @from(Start 13664272, End 13664286)
v79 = () => {}
// @from(Start 13664292, End 13664306)
b79 = () => {}
// @from(Start 13664312, End 13664326)
f79 = () => {}
// @from(Start 13664332, End 13664346)
h79 = () => {}
// @from(Start 13664352, End 13664366)
g79 = () => {}
// @from(Start 13664372, End 13664386)
u79 = () => {}
// @from(Start 13664392, End 13664406)
m79 = () => {}
// @from(Start 13664412, End 13664426)
d79 = () => {}
// @from(Start 13664432, End 13664446)
c79 = () => {}
// @from(Start 13664452, End 13664466)
p79 = () => {}
// @from(Start 13664472, End 13664486)
l79 = () => {}
// @from(Start 13664492, End 13664506)
i79 = () => {}
// @from(Start 13664512, End 13664526)
n79 = () => {}
// @from(Start 13664532, End 13664546)
a79 = () => {}
// @from(Start 13664552, End 13664566)
s79 = () => {}
// @from(Start 13664572, End 13664586)
r79 = () => {}
// @from(Start 13664589, End 13664708)
function o79(A, Q) {
  let B = sJ(A, Q?.in);
  return B.setFullYear(B.getFullYear(), 0, 1), B.setHours(0, 0, 0, 0), B
}
// @from(Start 13664713, End 13664738)
yX0 = L(() => {
  GN()
})
// @from(Start 13664744, End 13664758)
t79 = () => {}
// @from(Start 13664764, End 13664778)
e79 = () => {}
// @from(Start 13664784, End 13664798)
AG9 = () => {}
// @from(Start 13664804, End 13664818)
QG9 = () => {}
// @from(Start 13664824, End 13664838)
BG9 = () => {}
// @from(Start 13664844, End 13664858)
GG9 = () => {}
// @from(Start 13664864, End 13664878)
ZG9 = () => {}
// @from(Start 13664884, End 13664898)
IG9 = () => {}
// @from(Start 13664904, End 13664918)
YG9 = () => {}
// @from(Start 13664924, End 13664938)
JG9 = () => {}
// @from(Start 13664944, End 13664958)
WG9 = () => {}
// @from(Start 13664964, End 13664978)
XG9 = () => {}
// @from(Start 13664984, End 13664998)
VG9 = () => {}
// @from(Start 13665004, End 13665007)
TS3
// @from(Start 13665009, End 13665293)
FG9 = (A, Q, B) => {
  let G, Z = TS3[A];
  if (typeof Z === "string") G = Z;
  else if (Q === 1) G = Z.one;
  else G = Z.other.replace("{{count}}", Q.toString());
  if (B?.addSuffix)
    if (B.comparison && B.comparison > 0) return "in " + G;
    else return G + " ago";
  return G
}
// @from(Start 13665299, End 13666644)
KG9 = L(() => {
  TS3 = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  }
})
// @from(Start 13666647, End 13666802)
function oI1(A) {
  return (Q = {}) => {
    let B = Q.width ? String(Q.width) : A.defaultWidth;
    return A.formats[B] || A.formats[A.defaultWidth]
  }
}
// @from(Start 13666807, End 13666810)
PS3
// @from(Start 13666812, End 13666815)
jS3
// @from(Start 13666817, End 13666820)
SS3
// @from(Start 13666822, End 13666825)
DG9
// @from(Start 13666831, End 13667456)
HG9 = L(() => {
  PS3 = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  }, jS3 = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  }, SS3 = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  }, DG9 = {
    date: oI1({
      formats: PS3,
      defaultWidth: "full"
    }),
    time: oI1({
      formats: jS3,
      defaultWidth: "full"
    }),
    dateTime: oI1({
      formats: SS3,
      defaultWidth: "full"
    })
  }
})
// @from(Start 13667462, End 13667465)
_S3
// @from(Start 13667467, End 13667495)
CG9 = (A, Q, B, G) => _S3[A]
// @from(Start 13667501, End 13667708)
EG9 = L(() => {
  _S3 = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  }
})
// @from(Start 13667711, End 13668253)
function GVA(A) {
  return (Q, B) => {
    let G = B?.context ? String(B.context) : "standalone",
      Z;
    if (G === "formatting" && A.formattingValues) {
      let Y = A.defaultFormattingWidth || A.defaultWidth,
        J = B?.width ? String(B.width) : Y;
      Z = A.formattingValues[J] || A.formattingValues[Y]
    } else {
      let Y = A.defaultWidth,
        J = B?.width ? String(B.width) : A.defaultWidth;
      Z = A.values[J] || A.values[Y]
    }
    let I = A.argumentCallback ? A.argumentCallback(Q) : Q;
    return Z[I]
  }
}
// @from(Start 13668258, End 13668261)
kS3
// @from(Start 13668263, End 13668266)
yS3
// @from(Start 13668268, End 13668271)
xS3
// @from(Start 13668273, End 13668276)
vS3
// @from(Start 13668278, End 13668281)
bS3
// @from(Start 13668283, End 13668286)
fS3
// @from(Start 13668288, End 13668537)
hS3 = (A, Q) => {
    let B = Number(A),
      G = B % 100;
    if (G > 20 || G < 10) switch (G % 10) {
      case 1:
        return B + "st";
      case 2:
        return B + "nd";
      case 3:
        return B + "rd"
    }
    return B + "th"
  }
// @from(Start 13668541, End 13668544)
zG9
// @from(Start 13668550, End 13671248)
UG9 = L(() => {
  kS3 = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  }, yS3 = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  }, xS3 = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }, vS3 = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }, bS3 = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  }, fS3 = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  }, zG9 = {
    ordinalNumber: hS3,
    era: GVA({
      values: kS3,
      defaultWidth: "wide"
    }),
    quarter: GVA({
      values: yS3,
      defaultWidth: "wide",
      argumentCallback: (A) => A - 1
    }),
    month: GVA({
      values: xS3,
      defaultWidth: "wide"
    }),
    day: GVA({
      values: vS3,
      defaultWidth: "wide"
    }),
    dayPeriod: GVA({
      values: bS3,
      defaultWidth: "wide",
      formattingValues: fS3,
      defaultFormattingWidth: "wide"
    })
  }
})
// @from(Start 13671251, End 13671803)
function ZVA(A) {
  return (Q, B = {}) => {
    let G = B.width,
      Z = G && A.matchPatterns[G] || A.matchPatterns[A.defaultMatchWidth],
      I = Q.match(Z);
    if (!I) return null;
    let Y = I[0],
      J = G && A.parsePatterns[G] || A.parsePatterns[A.defaultParseWidth],
      W = Array.isArray(J) ? uS3(J, (F) => F.test(Y)) : gS3(J, (F) => F.test(Y)),
      X;
    X = A.valueCallback ? A.valueCallback(W) : W, X = B.valueCallback ? B.valueCallback(X) : X;
    let V = Q.slice(Y.length);
    return {
      value: X,
      rest: V
    }
  }
}
// @from(Start 13671805, End 13671928)
function gS3(A, Q) {
  for (let B in A)
    if (Object.prototype.hasOwnProperty.call(A, B) && Q(A[B])) return B;
  return
}
// @from(Start 13671930, End 13672025)
function uS3(A, Q) {
  for (let B = 0; B < A.length; B++)
    if (Q(A[B])) return B;
  return
}
// @from(Start 13672027, End 13672406)
function $G9(A) {
  return (Q, B = {}) => {
    let G = Q.match(A.matchPattern);
    if (!G) return null;
    let Z = G[0],
      I = Q.match(A.parsePattern);
    if (!I) return null;
    let Y = A.valueCallback ? A.valueCallback(I[0]) : I[0];
    Y = B.valueCallback ? B.valueCallback(Y) : Y;
    let J = Q.slice(Z.length);
    return {
      value: Y,
      rest: J
    }
  }
}
// @from(Start 13672411, End 13672414)
mS3
// @from(Start 13672416, End 13672419)
dS3
// @from(Start 13672421, End 13672424)
cS3
// @from(Start 13672426, End 13672429)
pS3
// @from(Start 13672431, End 13672434)
lS3
// @from(Start 13672436, End 13672439)
iS3
// @from(Start 13672441, End 13672444)
nS3
// @from(Start 13672446, End 13672449)
aS3
// @from(Start 13672451, End 13672454)
sS3
// @from(Start 13672456, End 13672459)
rS3
// @from(Start 13672461, End 13672464)
oS3
// @from(Start 13672466, End 13672469)
tS3
// @from(Start 13672471, End 13672474)
wG9
// @from(Start 13672480, End 13674972)
qG9 = L(() => {
  mS3 = /^(\d+)(th|st|nd|rd)?/i, dS3 = /\d+/i, cS3 = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  }, pS3 = {
    any: [/^b/i, /^(a|c)/i]
  }, lS3 = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  }, iS3 = {
    any: [/1/i, /2/i, /3/i, /4/i]
  }, nS3 = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  }, aS3 = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  }, sS3 = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  }, rS3 = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  }, oS3 = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  }, tS3 = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  }, wG9 = {
    ordinalNumber: $G9({
      matchPattern: mS3,
      parsePattern: dS3,
      valueCallback: (A) => parseInt(A, 10)
    }),
    era: ZVA({
      matchPatterns: cS3,
      defaultMatchWidth: "wide",
      parsePatterns: pS3,
      defaultParseWidth: "any"
    }),
    quarter: ZVA({
      matchPatterns: lS3,
      defaultMatchWidth: "wide",
      parsePatterns: iS3,
      defaultParseWidth: "any",
      valueCallback: (A) => A + 1
    }),
    month: ZVA({
      matchPatterns: nS3,
      defaultMatchWidth: "wide",
      parsePatterns: aS3,
      defaultParseWidth: "any"
    }),
    day: ZVA({
      matchPatterns: sS3,
      defaultMatchWidth: "wide",
      parsePatterns: rS3,
      defaultParseWidth: "any"
    }),
    dayPeriod: ZVA({
      matchPatterns: oS3,
      defaultMatchWidth: "any",
      parsePatterns: tS3,
      defaultParseWidth: "any"
    })
  }
})
// @from(Start 13674978, End 13674981)
xX0
// @from(Start 13674987, End 13675264)
NG9 = L(() => {
  KG9();
  HG9();
  EG9();
  UG9();
  qG9();
  xX0 = {
    code: "en-US",
    formatDistance: FG9,
    formatLong: DG9,
    formatRelative: CG9,
    localize: zG9,
    match: wG9,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  }
})
// @from(Start 13675270, End 13675296)
LG9 = L(() => {
  NG9()
})
// @from(Start 13675299, End 13675373)
function MG9(A, Q) {
  let B = sJ(A, Q?.in);
  return r39(B, o79(B)) + 1
}
// @from(Start 13675378, End 13675421)
vX0 = L(() => {
  jX0();
  yX0();
  GN()
})
// @from(Start 13675424, End 13675530)
function OG9(A, Q) {
  let B = sJ(A, Q?.in),
    G = +xQA(B) - +o39(B);
  return Math.round(G / aI1) + 1
}
// @from(Start 13675535, End 13675587)
bX0 = L(() => {
  sjA();
  ojA();
  SX0();
  GN()
})
// @from(Start 13675590, End 13676109)
function tI1(A, Q) {
  let B = sJ(A, Q?.in),
    G = B.getFullYear(),
    Z = $a(),
    I = Q?.firstWeekContainsDate ?? Q?.locale?.options?.firstWeekContainsDate ?? Z.firstWeekContainsDate ?? Z.locale?.options?.firstWeekContainsDate ?? 1,
    Y = P$(Q?.in || A, 0);
  Y.setFullYear(G + 1, 0, I), Y.setHours(0, 0, 0, 0);
  let J = mg(Y, Q),
    W = P$(Q?.in || A, 0);
  W.setFullYear(G, 0, I), W.setHours(0, 0, 0, 0);
  let X = mg(W, Q);
  if (+B >= +J) return G + 1;
  else if (+B >= +X) return G;
  else return G - 1
}
// @from(Start 13676114, End 13676165)
eI1 = L(() => {
  rjA();
  Ua();
  BVA();
  GN()
})
// @from(Start 13676168, End 13676473)
function RG9(A, Q) {
  let B = $a(),
    G = Q?.firstWeekContainsDate ?? Q?.locale?.options?.firstWeekContainsDate ?? B.firstWeekContainsDate ?? B.locale?.options?.firstWeekContainsDate ?? 1,
    Z = tI1(A, Q),
    I = P$(Q?.in || A, 0);
  return I.setFullYear(Z, 0, G), I.setHours(0, 0, 0, 0), mg(I, Q)
}
// @from(Start 13676478, End 13676530)
fX0 = L(() => {
  rjA();
  Ua();
  eI1();
  BVA()
})
// @from(Start 13676533, End 13676644)
function TG9(A, Q) {
  let B = sJ(A, Q?.in),
    G = +mg(B, Q) - +RG9(B, Q);
  return Math.round(G / aI1) + 1
}
// @from(Start 13676649, End 13676701)
hX0 = L(() => {
  sjA();
  BVA();
  fX0();
  GN()
})
// @from(Start 13676704, End 13676817)
function x7(A, Q) {
  let B = A < 0 ? "-" : "",
    G = Math.abs(A).toString().padStart(Q, "0");
  return B + G
}
// @from(Start 13676822, End 13676824)
dg
// @from(Start 13676830, End 13677913)
PG9 = L(() => {
  dg = {
    y(A, Q) {
      let B = A.getFullYear(),
        G = B > 0 ? B : 1 - B;
      return x7(Q === "yy" ? G % 100 : G, Q.length)
    },
    M(A, Q) {
      let B = A.getMonth();
      return Q === "M" ? String(B + 1) : x7(B + 1, 2)
    },
    d(A, Q) {
      return x7(A.getDate(), Q.length)
    },
    a(A, Q) {
      let B = A.getHours() / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "a":
        case "aa":
          return B.toUpperCase();
        case "aaa":
          return B;
        case "aaaaa":
          return B[0];
        case "aaaa":
        default:
          return B === "am" ? "a.m." : "p.m."
      }
    },
    h(A, Q) {
      return x7(A.getHours() % 12 || 12, Q.length)
    },
    H(A, Q) {
      return x7(A.getHours(), Q.length)
    },
    m(A, Q) {
      return x7(A.getMinutes(), Q.length)
    },
    s(A, Q) {
      return x7(A.getSeconds(), Q.length)
    },
    S(A, Q) {
      let B = Q.length,
        G = A.getMilliseconds(),
        Z = Math.trunc(G * Math.pow(10, B - 3));
      return x7(Z, Q.length)
    }
  }
})
// @from(Start 13677916, End 13678112)
function jG9(A, Q = "") {
  let B = A > 0 ? "-" : "+",
    G = Math.abs(A),
    Z = Math.trunc(G / 60),
    I = G % 60;
  if (I === 0) return B + String(Z);
  return B + String(Z) + Q + x7(I, 2)
}
// @from(Start 13678114, End 13678229)
function SG9(A, Q) {
  if (A % 60 === 0) return (A > 0 ? "-" : "+") + x7(Math.abs(A) / 60, 2);
  return vQA(A, Q)
}
// @from(Start 13678231, End 13678389)
function vQA(A, Q = "") {
  let B = A > 0 ? "-" : "+",
    G = Math.abs(A),
    Z = x7(Math.trunc(G / 60), 2),
    I = x7(G % 60, 2);
  return B + Z + Q + I
}
// @from(Start 13678394, End 13678397)
IVA
// @from(Start 13678399, End 13678402)
gX0
// @from(Start 13678408, End 13691028)
_G9 = L(() => {
  vX0();
  bX0();
  rI1();
  hX0();
  eI1();
  PG9();
  IVA = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }, gX0 = {
    G: function(A, Q, B) {
      let G = A.getFullYear() > 0 ? 1 : 0;
      switch (Q) {
        case "G":
        case "GG":
        case "GGG":
          return B.era(G, {
            width: "abbreviated"
          });
        case "GGGGG":
          return B.era(G, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return B.era(G, {
            width: "wide"
          })
      }
    },
    y: function(A, Q, B) {
      if (Q === "yo") {
        let G = A.getFullYear(),
          Z = G > 0 ? G : 1 - G;
        return B.ordinalNumber(Z, {
          unit: "year"
        })
      }
      return dg.y(A, Q)
    },
    Y: function(A, Q, B, G) {
      let Z = tI1(A, G),
        I = Z > 0 ? Z : 1 - Z;
      if (Q === "YY") {
        let Y = I % 100;
        return x7(Y, 2)
      }
      if (Q === "Yo") return B.ordinalNumber(I, {
        unit: "year"
      });
      return x7(I, Q.length)
    },
    R: function(A, Q) {
      let B = sI1(A);
      return x7(B, Q.length)
    },
    u: function(A, Q) {
      let B = A.getFullYear();
      return x7(B, Q.length)
    },
    Q: function(A, Q, B) {
      let G = Math.ceil((A.getMonth() + 1) / 3);
      switch (Q) {
        case "Q":
          return String(G);
        case "QQ":
          return x7(G, 2);
        case "Qo":
          return B.ordinalNumber(G, {
            unit: "quarter"
          });
        case "QQQ":
          return B.quarter(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return B.quarter(G, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return B.quarter(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    q: function(A, Q, B) {
      let G = Math.ceil((A.getMonth() + 1) / 3);
      switch (Q) {
        case "q":
          return String(G);
        case "qq":
          return x7(G, 2);
        case "qo":
          return B.ordinalNumber(G, {
            unit: "quarter"
          });
        case "qqq":
          return B.quarter(G, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return B.quarter(G, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return B.quarter(G, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    M: function(A, Q, B) {
      let G = A.getMonth();
      switch (Q) {
        case "M":
        case "MM":
          return dg.M(A, Q);
        case "Mo":
          return B.ordinalNumber(G + 1, {
            unit: "month"
          });
        case "MMM":
          return B.month(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return B.month(G, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return B.month(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    L: function(A, Q, B) {
      let G = A.getMonth();
      switch (Q) {
        case "L":
          return String(G + 1);
        case "LL":
          return x7(G + 1, 2);
        case "Lo":
          return B.ordinalNumber(G + 1, {
            unit: "month"
          });
        case "LLL":
          return B.month(G, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return B.month(G, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return B.month(G, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    w: function(A, Q, B, G) {
      let Z = TG9(A, G);
      if (Q === "wo") return B.ordinalNumber(Z, {
        unit: "week"
      });
      return x7(Z, Q.length)
    },
    I: function(A, Q, B) {
      let G = OG9(A);
      if (Q === "Io") return B.ordinalNumber(G, {
        unit: "week"
      });
      return x7(G, Q.length)
    },
    d: function(A, Q, B) {
      if (Q === "do") return B.ordinalNumber(A.getDate(), {
        unit: "date"
      });
      return dg.d(A, Q)
    },
    D: function(A, Q, B) {
      let G = MG9(A);
      if (Q === "Do") return B.ordinalNumber(G, {
        unit: "dayOfYear"
      });
      return x7(G, Q.length)
    },
    E: function(A, Q, B) {
      let G = A.getDay();
      switch (Q) {
        case "E":
        case "EE":
        case "EEE":
          return B.day(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return B.day(G, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return B.day(G, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return B.day(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    e: function(A, Q, B, G) {
      let Z = A.getDay(),
        I = (Z - G.weekStartsOn + 8) % 7 || 7;
      switch (Q) {
        case "e":
          return String(I);
        case "ee":
          return x7(I, 2);
        case "eo":
          return B.ordinalNumber(I, {
            unit: "day"
          });
        case "eee":
          return B.day(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return B.day(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return B.day(Z, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return B.day(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    c: function(A, Q, B, G) {
      let Z = A.getDay(),
        I = (Z - G.weekStartsOn + 8) % 7 || 7;
      switch (Q) {
        case "c":
          return String(I);
        case "cc":
          return x7(I, Q.length);
        case "co":
          return B.ordinalNumber(I, {
            unit: "day"
          });
        case "ccc":
          return B.day(Z, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return B.day(Z, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return B.day(Z, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return B.day(Z, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    i: function(A, Q, B) {
      let G = A.getDay(),
        Z = G === 0 ? 7 : G;
      switch (Q) {
        case "i":
          return String(Z);
        case "ii":
          return x7(Z, Q.length);
        case "io":
          return B.ordinalNumber(Z, {
            unit: "day"
          });
        case "iii":
          return B.day(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return B.day(G, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return B.day(G, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return B.day(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    a: function(A, Q, B) {
      let Z = A.getHours() / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "a":
        case "aa":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    b: function(A, Q, B) {
      let G = A.getHours(),
        Z;
      if (G === 12) Z = IVA.noon;
      else if (G === 0) Z = IVA.midnight;
      else Z = G / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "b":
        case "bb":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    B: function(A, Q, B) {
      let G = A.getHours(),
        Z;
      if (G >= 17) Z = IVA.evening;
      else if (G >= 12) Z = IVA.afternoon;
      else if (G >= 4) Z = IVA.morning;
      else Z = IVA.night;
      switch (Q) {
        case "B":
        case "BB":
        case "BBB":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    h: function(A, Q, B) {
      if (Q === "ho") {
        let G = A.getHours() % 12;
        if (G === 0) G = 12;
        return B.ordinalNumber(G, {
          unit: "hour"
        })
      }
      return dg.h(A, Q)
    },
    H: function(A, Q, B) {
      if (Q === "Ho") return B.ordinalNumber(A.getHours(), {
        unit: "hour"
      });
      return dg.H(A, Q)
    },
    K: function(A, Q, B) {
      let G = A.getHours() % 12;
      if (Q === "Ko") return B.ordinalNumber(G, {
        unit: "hour"
      });
      return x7(G, Q.length)
    },
    k: function(A, Q, B) {
      let G = A.getHours();
      if (G === 0) G = 24;
      if (Q === "ko") return B.ordinalNumber(G, {
        unit: "hour"
      });
      return x7(G, Q.length)
    },
    m: function(A, Q, B) {
      if (Q === "mo") return B.ordinalNumber(A.getMinutes(), {
        unit: "minute"
      });
      return dg.m(A, Q)
    },
    s: function(A, Q, B) {
      if (Q === "so") return B.ordinalNumber(A.getSeconds(), {
        unit: "second"
      });
      return dg.s(A, Q)
    },
    S: function(A, Q) {
      return dg.S(A, Q)
    },
    X: function(A, Q, B) {
      let G = A.getTimezoneOffset();
      if (G === 0) return "Z";
      switch (Q) {
        case "X":
          return SG9(G);
        case "XXXX":
        case "XX":
          return vQA(G);
        case "XXXXX":
        case "XXX":
        default:
          return vQA(G, ":")
      }
    },
    x: function(A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "x":
          return SG9(G);
        case "xxxx":
        case "xx":
          return vQA(G);
        case "xxxxx":
        case "xxx":
        default:
          return vQA(G, ":")
      }
    },
    O: function(A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + jG9(G, ":");
        case "OOOO":
        default:
          return "GMT" + vQA(G, ":")
      }
    },
    z: function(A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + jG9(G, ":");
        case "zzzz":
        default:
          return "GMT" + vQA(G, ":")
      }
    },
    t: function(A, Q, B) {
      let G = Math.trunc(+A / 1000);
      return x7(G, Q.length)
    },
    T: function(A, Q, B) {
      return x7(+A, Q.length)
    }
  }
})
// @from(Start 13691034, End 13691405)
kG9 = (A, Q) => {
    switch (A) {
      case "P":
        return Q.date({
          width: "short"
        });
      case "PP":
        return Q.date({
          width: "medium"
        });
      case "PPP":
        return Q.date({
          width: "long"
        });
      case "PPPP":
      default:
        return Q.date({
          width: "full"
        })
    }
  }
// @from(Start 13691409, End 13691780)
yG9 = (A, Q) => {
    switch (A) {
      case "p":
        return Q.time({
          width: "short"
        });
      case "pp":
        return Q.time({
          width: "medium"
        });
      case "ppp":
        return Q.time({
          width: "long"
        });
      case "pppp":
      default:
        return Q.time({
          width: "full"
        })
    }
  }
// @from(Start 13691784, End 13692407)
eS3 = (A, Q) => {
    let B = A.match(/(P+)(p+)?/) || [],
      G = B[1],
      Z = B[2];
    if (!Z) return kG9(A, Q);
    let I;
    switch (G) {
      case "P":
        I = Q.dateTime({
          width: "short"
        });
        break;
      case "PP":
        I = Q.dateTime({
          width: "medium"
        });
        break;
      case "PPP":
        I = Q.dateTime({
          width: "long"
        });
        break;
      case "PPPP":
      default:
        I = Q.dateTime({
          width: "full"
        });
        break
    }
    return I.replace("{{date}}", kG9(G, Q)).replace("{{time}}", yG9(Z, Q))
  }
// @from(Start 13692411, End 13692414)
xG9
// @from(Start 13692420, End 13692475)
vG9 = L(() => {
  xG9 = {
    p: yG9,
    P: eS3
  }
})
// @from(Start 13692478, End 13692518)
function bG9(A) {
  return A_3.test(A)
}
// @from(Start 13692520, End 13692560)
function fG9(A) {
  return Q_3.test(A)
}
// @from(Start 13692562, End 13692671)
function hG9(A, Q, B) {
  let G = G_3(A, Q, B);
  if (console.warn(G), B_3.includes(A)) throw RangeError(G)
}
// @from(Start 13692673, End 13692945)
function G_3(A, Q, B) {
  let G = A[0] === "Y" ? "years" : "days of the month";
  return `Use \`${A.toLowerCase()}\` instead of \`${A}\` (in \`${Q}\`) for formatting ${G} to the input \`${B}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
}
// @from(Start 13692950, End 13692953)
A_3
// @from(Start 13692955, End 13692958)
Q_3
// @from(Start 13692960, End 13692963)
B_3
// @from(Start 13692969, End 13693049)
gG9 = L(() => {
  A_3 = /^D+$/, Q_3 = /^Y+$/, B_3 = ["D", "DD", "YY", "YYYY"]
})
// @from(Start 13693052, End 13694505)
function uG9(A, Q, B) {
  let G = $a(),
    Z = B?.locale ?? G.locale ?? xX0,
    I = B?.firstWeekContainsDate ?? B?.locale?.options?.firstWeekContainsDate ?? G.firstWeekContainsDate ?? G.locale?.options?.firstWeekContainsDate ?? 1,
    Y = B?.weekStartsOn ?? B?.locale?.options?.weekStartsOn ?? G.weekStartsOn ?? G.locale?.options?.weekStartsOn ?? 0,
    J = sJ(A, B?.in);
  if (!z79(J)) throw RangeError("Invalid time value");
  let W = Q.match(I_3).map((V) => {
    let F = V[0];
    if (F === "p" || F === "P") {
      let K = xG9[F];
      return K(V, Z.formatLong)
    }
    return V
  }).join("").match(Z_3).map((V) => {
    if (V === "''") return {
      isToken: !1,
      value: "'"
    };
    let F = V[0];
    if (F === "'") return {
      isToken: !1,
      value: X_3(V)
    };
    if (gX0[F]) return {
      isToken: !0,
      value: V
    };
    if (F.match(W_3)) throw RangeError("Format string contains an unescaped latin alphabet character `" + F + "`");
    return {
      isToken: !1,
      value: V
    }
  });
  if (Z.localize.preprocessor) W = Z.localize.preprocessor(J, W);
  let X = {
    firstWeekContainsDate: I,
    weekStartsOn: Y,
    locale: Z
  };
  return W.map((V) => {
    if (!V.isToken) return V.value;
    let F = V.value;
    if (!B?.useAdditionalWeekYearTokens && fG9(F) || !B?.useAdditionalDayOfYearTokens && bG9(F)) hG9(F, Q, String(A));
    let K = gX0[F[0]];
    return K(J, F, Z.localize, X)
  }).join("")
}
// @from(Start 13694507, End 13694602)
function X_3(A) {
  let Q = A.match(Y_3);
  if (!Q) return A;
  return Q[1].replace(J_3, "'")
}
// @from(Start 13694607, End 13694610)
Z_3
// @from(Start 13694612, End 13694615)
I_3
// @from(Start 13694617, End 13694620)
Y_3
// @from(Start 13694622, End 13694625)
J_3
// @from(Start 13694627, End 13694630)
W_3
// @from(Start 13694636, End 13694876)
mG9 = L(() => {
  LG9();
  rjA();
  _G9();
  vG9();
  gG9();
  kX0();
  GN();
  Z_3 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, I_3 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Y_3 = /^'([^]*?)'?$/, J_3 = /''/g, W_3 = /[a-zA-Z]/
})
// @from(Start 13694882, End 13694896)
dG9 = () => {}
// @from(Start 13694902, End 13694916)
cG9 = () => {}
// @from(Start 13694922, End 13694936)
pG9 = () => {}
// @from(Start 13694942, End 13694956)
lG9 = () => {}
// @from(Start 13694962, End 13694976)
iG9 = () => {}
// @from(Start 13694982, End 13694996)
nG9 = () => {}
// @from(Start 13695002, End 13695016)
aG9 = () => {}
// @from(Start 13695022, End 13695036)
sG9 = () => {}
// @from(Start 13695042, End 13695056)
rG9 = () => {}
// @from(Start 13695062, End 13695076)
oG9 = () => {}
// @from(Start 13695082, End 13695096)
tG9 = () => {}
// @from(Start 13695102, End 13695116)
eG9 = () => {}
// @from(Start 13695122, End 13695136)
AZ9 = () => {}
// @from(Start 13695142, End 13695156)
QZ9 = () => {}
// @from(Start 13695162, End 13695176)
BZ9 = () => {}
// @from(Start 13695182, End 13695196)
GZ9 = () => {}
// @from(Start 13695202, End 13695216)
ZZ9 = () => {}
// @from(Start 13695222, End 13695236)
IZ9 = () => {}
// @from(Start 13695242, End 13695256)
YZ9 = () => {}
// @from(Start 13695262, End 13695276)
JZ9 = () => {}
// @from(Start 13695282, End 13695296)
WZ9 = () => {}
// @from(Start 13695302, End 13695316)
XZ9 = () => {}
// @from(Start 13695322, End 13695336)
VZ9 = () => {}
// @from(Start 13695342, End 13695356)
FZ9 = () => {}
// @from(Start 13695362, End 13695376)
KZ9 = () => {}
// @from(Start 13695382, End 13695396)
DZ9 = () => {}
// @from(Start 13695402, End 13695416)
HZ9 = () => {}
// @from(Start 13695422, End 13695436)
CZ9 = () => {}
// @from(Start 13695442, End 13695456)
EZ9 = () => {}
// @from(Start 13695462, End 13695476)
zZ9 = () => {}
// @from(Start 13695482, End 13695496)
UZ9 = () => {}
// @from(Start 13695502, End 13695516)
$Z9 = () => {}
// @from(Start 13695522, End 13695536)
wZ9 = () => {}
// @from(Start 13695542, End 13695556)
qZ9 = () => {}
// @from(Start 13695562, End 13695576)
NZ9 = () => {}
// @from(Start 13695582, End 13695596)
LZ9 = () => {}
// @from(Start 13695602, End 13695616)
MZ9 = () => {}
// @from(Start 13695622, End 13695636)
OZ9 = () => {}
// @from(Start 13695642, End 13695656)
RZ9 = () => {}
// @from(Start 13695662, End 13695676)
TZ9 = () => {}
// @from(Start 13695682, End 13695696)
PZ9 = () => {}
// @from(Start 13695702, End 13695716)
jZ9 = () => {}
// @from(Start 13695722, End 13695736)
SZ9 = () => {}
// @from(Start 13695742, End 13695756)
_Z9 = () => {}
// @from(Start 13695762, End 13695776)
kZ9 = () => {}
// @from(Start 13695782, End 13695796)
yZ9 = () => {}
// @from(Start 13695802, End 13695816)
xZ9 = () => {}
// @from(Start 13695822, End 13695836)
vZ9 = () => {}
// @from(Start 13695842, End 13695856)
bZ9 = () => {}
// @from(Start 13695862, End 13695876)
fZ9 = () => {}
// @from(Start 13695882, End 13695896)
hZ9 = () => {}
// @from(Start 13695902, End 13695916)
gZ9 = () => {}
// @from(Start 13695922, End 13695936)
uZ9 = () => {}
// @from(Start 13695942, End 13695956)
mZ9 = () => {}
// @from(Start 13695962, End 13695976)
dZ9 = () => {}
// @from(Start 13695982, End 13695996)
cZ9 = () => {}
// @from(Start 13696002, End 13696016)
pZ9 = () => {}
// @from(Start 13696022, End 13696036)
lZ9 = () => {}
// @from(Start 13696042, End 13696056)
iZ9 = () => {}
// @from(Start 13696062, End 13696076)
nZ9 = () => {}
// @from(Start 13696082, End 13696096)
aZ9 = () => {}
// @from(Start 13696102, End 13696116)
sZ9 = () => {}
// @from(Start 13696122, End 13696136)
rZ9 = () => {}
// @from(Start 13696142, End 13696156)
oZ9 = () => {}
// @from(Start 13696162, End 13696176)
tZ9 = () => {}
// @from(Start 13696182, End 13696196)
eZ9 = () => {}
// @from(Start 13696202, End 13696216)
AI9 = () => {}
// @from(Start 13696222, End 13696236)
QI9 = () => {}
// @from(Start 13696242, End 13696256)
BI9 = () => {}
// @from(Start 13696262, End 13696276)
GI9 = () => {}
// @from(Start 13696282, End 13696296)
ZI9 = () => {}
// @from(Start 13696302, End 13696316)
II9 = () => {}
// @from(Start 13696322, End 13696336)
YI9 = () => {}
// @from(Start 13696342, End 13696356)
JI9 = () => {}
// @from(Start 13696362, End 13696376)
WI9 = () => {}
// @from(Start 13696382, End 13696396)
XI9 = () => {}
// @from(Start 13696402, End 13696416)
VI9 = () => {}
// @from(Start 13696422, End 13696436)
FI9 = () => {}
// @from(Start 13696442, End 13696456)
KI9 = () => {}
// @from(Start 13696462, End 13696476)
DI9 = () => {}
// @from(Start 13696482, End 13696496)
HI9 = () => {}
// @from(Start 13696502, End 13696516)
CI9 = () => {}
// @from(Start 13696522, End 13696536)
EI9 = () => {}
// @from(Start 13696542, End 13696556)
zI9 = () => {}
// @from(Start 13696562, End 13696576)
UI9 = () => {}
// @from(Start 13696582, End 13696596)
$I9 = () => {}
// @from(Start 13696602, End 13696616)
wI9 = () => {}
// @from(Start 13696622, End 13696636)
qI9 = () => {}
// @from(Start 13696642, End 13696656)
NI9 = () => {}
// @from(Start 13696662, End 13696676)
LI9 = () => {}
// @from(Start 13696682, End 13696696)
MI9 = () => {}
// @from(Start 13696702, End 13696716)
OI9 = () => {}
// @from(Start 13696722, End 13696736)
RI9 = () => {}
// @from(Start 13696742, End 13696756)
TI9 = () => {}
// @from(Start 13696762, End 13696776)
PI9 = () => {}
// @from(Start 13696782, End 13696796)
jI9 = () => {}
// @from(Start 13696802, End 13696816)
SI9 = () => {}
// @from(Start 13696822, End 13696836)
_I9 = () => {}
// @from(Start 13696842, End 13696856)
kI9 = () => {}
// @from(Start 13696862, End 13696876)
yI9 = () => {}
// @from(Start 13696882, End 13696896)
xI9 = () => {}
// @from(Start 13696902, End 13696916)
vI9 = () => {}
// @from(Start 13696922, End 13696936)
bI9 = () => {}
// @from(Start 13696942, End 13696956)
fI9 = () => {}
// @from(Start 13696962, End 13696976)
hI9 = () => {}
// @from(Start 13696982, End 13696996)
gI9 = () => {}
// @from(Start 13697002, End 13697016)
uI9 = () => {}
// @from(Start 13697022, End 13697036)
mI9 = () => {}
// @from(Start 13697042, End 13697056)
dI9 = () => {}
// @from(Start 13697062, End 13697076)
cI9 = () => {}
// @from(Start 13697082, End 13697096)
pI9 = () => {}
// @from(Start 13697102, End 13697116)
lI9 = () => {}
// @from(Start 13697122, End 13697136)
iI9 = () => {}
// @from(Start 13697142, End 13697156)
nI9 = () => {}
// @from(Start 13697162, End 13697176)
aI9 = () => {}
// @from(Start 13697182, End 13697196)
sI9 = () => {}
// @from(Start 13697202, End 13697216)
rI9 = () => {}
// @from(Start 13697222, End 13697236)
oI9 = () => {}
// @from(Start 13697242, End 13697256)
tI9 = () => {}
// @from(Start 13697262, End 13697276)
eI9 = () => {}
// @from(Start 13697282, End 13697296)
AY9 = () => {}
// @from(Start 13697302, End 13697316)
QY9 = () => {}
// @from(Start 13697322, End 13697336)
BY9 = () => {}
// @from(Start 13697342, End 13697356)
GY9 = () => {}
// @from(Start 13697362, End 13697376)
ZY9 = () => {}
// @from(Start 13697382, End 13697396)
IY9 = () => {}
// @from(Start 13697402, End 13697416)
YY9 = () => {}
// @from(Start 13697422, End 13697436)
JY9 = () => {}
// @from(Start 13697442, End 13697456)
WY9 = () => {}
// @from(Start 13697462, End 13697476)
XY9 = () => {}
// @from(Start 13697482, End 13697496)
VY9 = () => {}
// @from(Start 13697502, End 13697516)
FY9 = () => {}
// @from(Start 13697522, End 13697536)
KY9 = () => {}
// @from(Start 13697542, End 13697556)
DY9 = () => {}
// @from(Start 13697562, End 13697576)
HY9 = () => {}
// @from(Start 13697582, End 13697596)
CY9 = () => {}
// @from(Start 13697602, End 13697616)
EY9 = () => {}
// @from(Start 13697622, End 13697636)
zY9 = () => {}
// @from(Start 13697642, End 13697656)
UY9 = () => {}
// @from(Start 13697662, End 13697676)
$Y9 = () => {}
// @from(Start 13697682, End 13697696)
wY9 = () => {}
// @from(Start 13697702, End 13697716)
qY9 = () => {}
// @from(Start 13697722, End 13697736)
NY9 = () => {}
// @from(Start 13697742, End 13697756)
LY9 = () => {}
// @from(Start 13697762, End 13697776)
MY9 = () => {}
// @from(Start 13697782, End 13697796)
OY9 = () => {}
// @from(Start 13697802, End 13697816)
RY9 = () => {}
// @from(Start 13697822, End 13697836)
TY9 = () => {}
// @from(Start 13697842, End 13697856)
PY9 = () => {}
// @from(Start 13697862, End 13697876)
jY9 = () => {}
// @from(Start 13697882, End 13697896)
SY9 = () => {}
// @from(Start 13697902, End 13697916)
_Y9 = () => {}
// @from(Start 13697922, End 13697936)
kY9 = () => {}
// @from(Start 13697942, End 13697956)
yY9 = () => {}
// @from(Start 13697962, End 13697976)
xY9 = () => {}
// @from(Start 13697982, End 13700202)
vY9 = L(() => {
  u39();
  p39();
  h39();
  i39();
  e39();
  l39();
  A79();
  g39();
  Q79();
  B79();
  G79();
  Z79();
  I79();
  W79();
  X79();
  V79();
  F79();
  K79();
  Ua();
  D79();
  H79();
  U79();
  jX0();
  $79();
  w79();
  q79();
  L79();
  M79();
  O79();
  R79();
  T79();
  j79();
  S79();
  _79();
  v79();
  b79();
  f79();
  h79();
  g79();
  u79();
  m79();
  d79();
  c79();
  l79();
  i79();
  n79();
  s79();
  t79();
  e79();
  k79();
  AG9();
  QG9();
  GG9();
  ZG9();
  IG9();
  y79();
  YG9();
  JG9();
  WG9();
  XG9();
  BG9();
  r79();
  VG9();
  mG9();
  dG9();
  cG9();
  pG9();
  lG9();
  iG9();
  nG9();
  aG9();
  sG9();
  rG9();
  oG9();
  tG9();
  eG9();
  AZ9();
  QZ9();
  vX0();
  BZ9();
  ZZ9();
  IZ9();
  YZ9();
  JZ9();
  WZ9();
  bX0();
  rI1();
  XZ9();
  VZ9();
  FZ9();
  KZ9();
  DZ9();
  N79();
  HZ9();
  CZ9();
  EZ9();
  hX0();
  zZ9();
  eI1();
  $Z9();
  wZ9();
  qZ9();
  NZ9();
  LZ9();
  MZ9();
  OZ9();
  RZ9();
  TZ9();
  PZ9();
  jZ9();
  _X0();
  SZ9();
  _Z9();
  kZ9();
  yZ9();
  xZ9();
  x79();
  GZ9();
  mZ9();
  dZ9();
  cZ9();
  C79();
  lZ9();
  nZ9();
  aZ9();
  rZ9();
  oZ9();
  tZ9();
  AI9();
  iZ9();
  QI9();
  m39();
  d39();
  BI9();
  GI9();
  ZI9();
  II9();
  YI9();
  JI9();
  WI9();
  XI9();
  VI9();
  FI9();
  KI9();
  DI9();
  kX0();
  HI9();
  c39();
  CI9();
  zI9();
  UI9();
  wI9();
  qI9();
  UZ9();
  NI9();
  $I9();
  LI9();
  MI9();
  Y79();
  OI9();
  RI9();
  TI9();
  PI9();
  J79();
  jI9();
  SI9();
  _I9();
  kI9();
  yI9();
  xI9();
  vI9();
  bI9();
  fI9();
  hI9();
  gI9();
  uI9();
  mI9();
  uZ9();
  dI9();
  cI9();
  pI9();
  lI9();
  iI9();
  nI9();
  aI9();
  sI9();
  rI9();
  oI9();
  tI9();
  eI9();
  AY9();
  QY9();
  BY9();
  GY9();
  ZY9();
  YY9();
  JY9();
  hZ9();
  WY9();
  XY9();
  VY9();
  gZ9();
  fZ9();
  t39();
  FY9();
  KY9();
  IY9();
  DY9();
  HY9();
  bZ9();
  CY9();
  EY9();
  PX0();
  zY9();
  pZ9();
  ojA();
  SX0();
  sZ9();
  a79();
  p79();
  eZ9();
  UY9();
  $Y9();
  BVA();
  fX0();
  yX0();
  wY9();
  NY9();
  LY9();
  EI9();
  MY9();
  P79();
  OY9();
  RY9();
  qY9();
  TY9();
  PY9();
  jY9();
  SY9();
  GN();
  vZ9();
  _Y9();
  kY9();
  yY9();
  xY9()
})
// @from(Start 13700205, End 13701177)
function bY9() {
  let [A, Q] = tjA.useState([]), [B, G] = tjA.useState(0);
  if (tjA.useEffect(() => {
      let Z = nQ.getSandboxViolationStore();
      return Z.subscribe((Y) => {
        Q(Y.slice(-10)), G(Z.getTotalCount())
      })
    }, []), !nQ.isSandboxingEnabled() || dQ() === "linux") return null;
  if (B === 0) return null;
  return Qz.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, Qz.createElement(S, {
    marginLeft: 0
  }, Qz.createElement($, {
    color: "permission"
  }, "⧈ Sandbox blocked ", B, " total", " ", B === 1 ? "operation" : "operations")), A.map((Z, I) => Qz.createElement(S, {
    key: `${Z.timestamp.getTime()}-${I}`,
    paddingLeft: 2
  }, Qz.createElement($, {
    dimColor: !0
  }, uG9(Z.timestamp, "h:mm:ssa"), Z.command ? ` ${Z.command}:` : "", " ", Z.line))), Qz.createElement(S, {
    paddingLeft: 2
  }, Qz.createElement($, {
    dimColor: !0
  }, "… showing last ", Math.min(10, A.length), " of ", B)))
}
// @from(Start 13701182, End 13701184)
Qz
// @from(Start 13701186, End 13701189)
tjA
// @from(Start 13701195, End 13701284)
fY9 = L(() => {
  hA();
  $J();
  vY9();
  Q3();
  Qz = BA(VA(), 1), tjA = BA(VA(), 1)
})
// @from(Start 13701287, End 13701837)
function AY1() {
  let {
    addNotification: A
  } = vZ(), [Q, B] = YVA.useState(() => {
    let {
      errors: Z
    } = wa();
    return Z
  }), G = YVA.useCallback(() => {
    let {
      errors: Z
    } = wa();
    B(Z)
  }, []);
  return t7A(G), YVA.useEffect(() => {
    if (Q.length > 0) A({
      key: "settings-errors",
      jsx: uX0.createElement($, {
        dimColor: !0
      }, "Found ", Q.length, " invalid settings", " ", Q.length === 1 ? "file" : "files", " · /doctor for details"),
      priority: "high"
    })
  }, [Q, A]), Q
}
// @from(Start 13701842, End 13701845)
YVA
// @from(Start 13701847, End 13701850)
uX0
// @from(Start 13701856, End 13701946)
mX0 = L(() => {
  MB();
  YrA();
  EU();
  hA();
  YVA = BA(VA(), 1), uX0 = BA(VA(), 1)
})
// @from(Start 13701949, End 13702964)
function gY9({
  mcpClients: A = []
}) {
  let {
    addNotification: Q
  } = vZ();
  hY9.useEffect(() => {
    let B = A.filter((Z) => Z.type === "failed" && Z.config.type !== "sse-ide" && Z.config.type !== "ws-ide"),
      G = A.filter((Z) => Z.type === "needs-auth");
    if (B.length === 0 && G.length === 0) return;
    if (B.length > 0) Q({
      key: "mcp-failed",
      jsx: NK.createElement(NK.Fragment, null, NK.createElement($, {
        color: "error"
      }, B.length, " MCP", " ", B.length === 1 ? "server" : "servers", " failed"), NK.createElement($, {
        dimColor: !0
      }, " · /mcp for info")),
      priority: "medium"
    });
    if (G.length) Q({
      key: "mcp-needs-auth",
      jsx: NK.createElement(NK.Fragment, null, NK.createElement($, {
        color: "warning"
      }, G.length, " MCP", " ", G.length === 1 ? "server needs" : "servers need", " ", "auth"), NK.createElement($, {
        dimColor: !0
      }, " · /mcp for info")),
      priority: "medium"
    })
  }, [Q, A])
}
// @from(Start 13702969, End 13702971)
NK
// @from(Start 13702973, End 13702976)
hY9
// @from(Start 13702982, End 13703054)
uY9 = L(() => {
  hA();
  EU();
  NK = BA(VA(), 1), hY9 = BA(VA(), 1)
})
// @from(Start 13703057, End 13704284)
function mY9() {
  let {
    addNotification: A
  } = vZ(), [Q] = OQ(), {
    installationStatus: B
  } = Q.plugins, {
    totalFailed: G,
    failedMarketplacesCount: Z,
    failedPluginsCount: I
  } = QY1.useMemo(() => {
    if (!B) return {
      totalFailed: 0,
      failedMarketplacesCount: 0,
      failedPluginsCount: 0
    };
    let Y = B.marketplaces.filter((W) => W.status === "failed"),
      J = B.plugins.filter((W) => W.status === "failed");
    return {
      totalFailed: Y.length + J.length,
      failedMarketplacesCount: Y.length,
      failedPluginsCount: J.length
    }
  }, [B]);
  QY1.useEffect(() => {
    if (!B) {
      g("No installation status to monitor");
      return
    }
    if (G === 0) return;
    if (g(`Plugin installation status: ${Z} failed marketplaces, ${I} failed plugins`), G === 0) return;
    g(`Adding notification for ${G} failed installations`), A({
      key: "plugin-install-failed",
      jsx: Vx.createElement(Vx.Fragment, null, Vx.createElement($, {
        color: "error"
      }, G, " plugin", G === 1 ? "" : "s", " failed to install"), Vx.createElement($, {
        dimColor: !0
      }, " · /plugin for details")),
      priority: "medium"
    })
  }, [A, G, Z, I])
}
// @from(Start 13704289, End 13704291)
Vx
// @from(Start 13704293, End 13704296)
QY1
// @from(Start 13704302, End 13704390)
dY9 = L(() => {
  hA();
  EU();
  z9();
  V0();
  Vx = BA(VA(), 1), QY1 = BA(VA(), 1)
})
// @from(Start 13704392, End 13704570)
async function cY9() {
  let A = l0(),
    Q = new Map;
  if (A.extraKnownMarketplaces)
    for (let [B, G] of Object.entries(A.extraKnownMarketplaces)) Q.set(B, G);
  return Q
}
// @from(Start 13704571, End 13704787)
async function pY9(A) {
  try {
    let Q = await pZ(),
      B = [];
    for (let [G] of A)
      if (!Q[G]) B.push(G);
    return B
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Start 13704792, End 13704833)
lY9 = L(() => {
  MB();
  oH();
  g1()
})
// @from(Start 13704836, End 13704888)
function V_3() {
  return new Date().toISOString()
}
// @from(Start 13704889, End 13705324)
async function Bj(A, Q) {
  if (typeof Q.source === "string") throw Error("cacheAndRegisterPlugin should only be used for external plugins");
  let B = await SIA(Q.source, {
      manifest: Q
    }),
    G = await mI1(B.path),
    Z = V_3();
  return M39(A, {
    version: B.manifest.version || Q.version || "unknown",
    installedAt: Z,
    lastUpdated: Z,
    installPath: B.path,
    gitCommitSha: G,
    isLocal: !1
  }), B.path
}
// @from(Start 13705329, End 13705362)
ejA = L(() => {
  za();
  fV()
})
// @from(Start 13705364, End 13705556)
async function dX0() {
  let A = l0(),
    Q = [];
  if (A.enabledPlugins) {
    for (let [B, G] of Object.entries(A.enabledPlugins))
      if (B.includes("@") && G) Q.push(B)
  }
  return Q
}
// @from(Start 13705557, End 13705953)
async function cX0() {
  if (qX0().catch((B) => {
      AA(B instanceof Error ? B : Error(String(B)))
    }), o2("tengu_enable_versioned_plugins")) {
    let B = wX0(),
      G = Object.keys(B.plugins);
    return g(`Found ${G.length} installed plugins (V2 format, versioned plugins enabled)`), G
  }
  let A = QVA(),
    Q = Object.keys(A);
  return g(`Found ${Q.length} installed plugins`), Q
}
// @from(Start 13705954, End 13706298)
async function iY9(A) {
  try {
    let Q = await cX0(),
      B = [];
    for (let G of A)
      if (!Q.includes(G)) try {
        if (await nl(G)) B.push(G)
      } catch (Z) {
        g(`Failed to check plugin ${G} in marketplace: ${Z}`)
      }
    return B
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Start 13706303, End 13706401)
nY9 = L(() => {
  MB();
  oH();
  g1();
  V0();
  u2();
  fV();
  MB();
  AQ();
  ejA();
  za()
})
// @from(Start 13706404, End 13706743)
function pX0(A, Q, B, G) {
  A((Z) => ({
    ...Z,
    plugins: {
      ...Z.plugins,
      installationStatus: {
        ...Z.plugins.installationStatus,
        marketplaces: Z.plugins.installationStatus.marketplaces.map((I) => I.name === Q ? {
          ...I,
          status: B,
          error: G
        } : I)
      }
    }
  }))
}
// @from(Start 13706745, End 13707072)
function lX0(A, Q, B, G) {
  A((Z) => ({
    ...Z,
    plugins: {
      ...Z.plugins,
      installationStatus: {
        ...Z.plugins.installationStatus,
        plugins: Z.plugins.installationStatus.plugins.map((I) => I.id === Q ? {
          ...I,
          status: B,
          error: G
        } : I)
      }
    }
  }))
}
// @from(Start 13707073, End 13707588)
async function F_3(A, Q, B) {
  let G = [],
    Z = [];
  for (let I of A) {
    let Y = Q.get(I);
    if (!Y) continue;
    pX0(B, I, "installing");
    try {
      await rAA(Y.source), G.push(I), pX0(B, I, "installed"), d22(), _IA(), await K_3(I, B)
    } catch (J) {
      let W = J instanceof Error ? J.message : String(J);
      Z.push({
        name: I,
        error: W
      }), pX0(B, I, "failed", W), AA(J instanceof Error ? J : Error(String(J)))
    }
  }
  return {
    installed: G,
    failed: Z
  }
}
// @from(Start 13707589, End 13707930)
async function K_3(A, Q) {
  try {
    let G = (await dX0()).filter((Z) => Z.endsWith(`@${A}`));
    if (G.length > 0) {
      let Z = await iY9(G);
      if (Z.length > 0) g(`Installing ${Z.length} plugins from newly installed marketplace ${A}`), await aY9(Z, Q)
    }
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Start 13707931, End 13708822)
async function aY9(A, Q) {
  let G = {
      ...OB("userSettings")?.enabledPlugins
    },
    Z = [],
    I = [];
  for (let Y of A) {
    lX0(Q, Y, "installing");
    try {
      let J = await nl(Y);
      if (!J) throw Error("Plugin not found in any marketplace");
      let {
        entry: W
      } = J;
      if (typeof W.source !== "string" || !W.source.startsWith("./")) await Bj(Y, W);
      if (l0().enabledPlugins?.[Y] !== !0) G[Y] = !0;
      Z.push(Y), lX0(Q, Y, "installed")
    } catch (J) {
      let W = J instanceof Error ? J.message : String(J);
      I.push({
        name: Y,
        error: W
      }), lX0(Q, Y, "failed", W), AA(J instanceof Error ? J : Error(String(J)))
    }
  }
  if (Object.keys(G).length > 0) {
    let Y = OB("userSettings");
    cB("userSettings", {
      ...Y,
      enabledPlugins: G
    })
  }
  return {
    installed: Z,
    failed: I
  }
}
// @from(Start 13708823, End 13711549)
async function BY1(A) {
  g("performBackgroundPluginInstallations called");
  try {
    let Q = [],
      B = [],
      G = await pZ(),
      Z = await cY9();
    if (Z.size > 0) {
      g(`Found ${Z.size} extra marketplaces in settings`);
      let J = await pY9(Z);
      if (J.length > 0) {
        g(`Installing ${J.length} marketplaces automatically`);
        for (let W of J) {
          let X = Z.get(W);
          if (X) Q.push({
            name: W,
            marketplace: X
          })
        }
      }
    }
    let I = await dX0(),
      Y = [];
    if (I.length > 0) {
      g(`Found ${I.length} enabled plugins`);
      let J = await cX0(),
        W = I.filter((V) => !J.includes(V));
      g(`Found ${W.length} missing plugins (not installed): ${W.join(", ")}`);
      let X = [];
      for (let V of W) {
        let [, F] = V.split("@");
        if (!F) X.push(V);
        else if (F in G || Z.has(F) || Q.some((K) => K.name === F)) X.push(V);
        else Y.push(V)
      }
      if (Y.length > 0) {
        let V = [...new Set(Y.map((F) => F.split("@")[1]))];
        g(`Cannot install ${Y.length} plugins because their marketplaces are not installed or configured: ${V.join(", ")}`), g(`Uninstallable plugins: ${Y.join(", ")}`)
      }
      if (X.length > 0) g(`Installing ${X.length} plugins automatically`), B.push(...X)
    }
    if (g(`Setting installation status: ${Q.length} marketplaces, ${B.length} installable plugins, ${Y.length} uninstallable plugins`), A((J) => ({
        ...J,
        plugins: {
          ...J.plugins,
          installationStatus: {
            marketplaces: Q.map(({
              name: W
            }) => ({
              name: W,
              status: "pending"
            })),
            plugins: [...B.map((W) => {
              let [X] = W.split("@");
              return {
                id: W,
                name: X || W,
                status: "pending"
              }
            }), ...Y.map((W) => {
              let [X, V] = W.split("@");
              return {
                id: W,
                name: X || W,
                status: "failed",
                error: `Marketplace '${V}' is not installed or configured`
              }
            })]
          }
        }
      })), Q.length > 0) F_3(Q.map((J) => J.name), Z, A).catch((J) => {
      AA(J instanceof Error ? J : Error(String(J)))
    });
    if (B.length > 0) {
      let J = B.filter((W) => {
        let [, X] = W.split("@");
        return !Q.some((V) => V.name === X)
      });
      if (J.length > 0) aY9(J, A).catch((W) => {
        AA(W instanceof Error ? W : Error(String(W)))
      })
    }
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error(String(Q)))
  }
}
// @from(Start 13711554, End 13711646)
iX0 = L(() => {
  V0();
  g1();
  lY9();
  nY9();
  oH();
  oH();
  fV();
  ejA();
  MB()
})
// @from(Start 13711648, End 13711978)
async function sY9(A) {
  if (g("performStartupChecks called"), !TJ(!0)) {
    g("Trust not accepted for current directory - skipping plugin installations");
    return
  }
  try {
    g("Starting background plugin installations"), await BY1(A)
  } catch (Q) {
    g(`Error initiating background plugin installations: ${Q}`)
  }
}
// @from(Start 13711983, End 13712025)
rY9 = L(() => {
  V0();
  iX0();
  jQ()
})
// @from(Start 13712028, End 13712638)
function tY9() {
  let {
    addNotification: A
  } = vZ(), [{
    thinkingEnabled: Q
  }] = OQ();
  oY9.useEffect(() => {
    A({
      key: "toggled-thinking-initial",
      jsx: Q ? cg.createElement($, {
        color: "suggestion"
      }, "Thinking on", " ", cg.createElement(E4, {
        shortcut: "tab",
        action: "toggle",
        parens: !0
      })) : cg.createElement($, {
        dimColor: !0
      }, "Thinking off", " ", cg.createElement(E4, {
        shortcut: "tab",
        action: "toggle",
        parens: !0
      })),
      priority: "low",
      timeoutMs: 20000
    })
  }, [A])
}
// @from(Start 13712643, End 13712645)
cg
// @from(Start 13712647, End 13712650)
oY9
// @from(Start 13712656, End 13712744)
eY9 = L(() => {
  EU();
  hA();
  z9();
  dF();
  cg = BA(VA(), 1), oY9 = BA(VA(), 1)
})
// @from(Start 13712747, End 13713367)
function AJ9(A) {
  let {
    addNotification: Q
  } = vZ(), B = w91(), G = o00(B, A), Z = t00(B), I = bQA.useRef(null), [Y, J] = bQA.useState(!1);
  bQA.useEffect(() => {
    if (B.isUsingOverage && !Y) Q({
      key: "limit-reached",
      text: Z,
      priority: "immediate"
    }), J(!0);
    else if (!B.isUsingOverage && Y) J(!1)
  }, [B.isUsingOverage, Z, Y, Q]), bQA.useEffect(() => {
    if (G && G !== I.current) I.current = G, Q({
      key: "rate-limit-warning",
      jsx: ASA.createElement($, null, ASA.createElement($, {
        color: "warning"
      }, G)),
      priority: "high"
    })
  }, [G, Q])
}
// @from(Start 13713372, End 13713375)
ASA
// @from(Start 13713377, End 13713380)
bQA
// @from(Start 13713386, End 13713467)
QJ9 = L(() => {
  EU();
  Pi();
  hA();
  ASA = BA(VA(), 1), bQA = BA(VA(), 1)
})
// @from(Start 13713470, End 13715177)
function GJ9({
  ideSelection: A,
  mcpClients: Q,
  ideInstallationStatus: B
}) {
  let {
    addNotification: G
  } = vZ(), Z = yXA(Q), I = B ? oT(B?.ideType) : !1, Y = B?.error || I, J = Z === "connected" && (A?.filePath || A?.text && A.lineCount > 0), W = Z === "connected" && !J, X = Y && !I && !W && !J, V = Y && I && !W && !J;
  BJ9.useEffect(() => {
    if (bV() || Z !== null) return;
    HLA(!0).then((F) => {
      if (F.length > 0) {
        let K = F[0]?.name;
        if (K && !V) G({
          key: "ide-status-hint",
          jsx: Gj.createElement($, {
            dimColor: !0
          }, H1.circle, " /ide for ", D_3(K)),
          priority: "low"
        });
        else if (!X && Z === "disconnected") G({
          key: "ide-status-disconnected",
          jsx: Gj.createElement($, {
            color: "error",
            key: "ide-status"
          }, H1.circle, " IDE disconnected"),
          priority: "medium"
        });
        else if (V) G({
          key: "ide-status-jetbrains-disconnected",
          jsx: Gj.createElement($, {
            dimColor: !0
          }, "IDE plugin not connected · /status for info"),
          priority: "medium"
        });
        else if (W) G({
          key: "ide-status-connected",
          jsx: Gj.createElement($, {
            color: "ide",
            key: "ide-status"
          }, H1.circle, "IDE connected"),
          priority: "low"
        });
        else if (X) G({
          key: "ide-status-install-error",
          jsx: Gj.createElement($, {
            color: "error"
          }, "IDE extension install failed (see /status for info)"),
          priority: "medium"
        })
      }
    })
  }, [G, Z, W, X, V])
}
// @from(Start 13715179, End 13715261)
function D_3(A) {
  if (A === "Visual Studio Code") return "VS Code";
  return A
}
// @from(Start 13715266, End 13715269)
BJ9
// @from(Start 13715271, End 13715273)
Gj
// @from(Start 13715279, End 13715376)
ZJ9 = L(() => {
  EU();
  nY();
  qZ1();
  hA();
  V9();
  BJ9 = BA(VA(), 1), Gj = BA(VA(), 1)
})
// @from(Start 13715379, End 13715742)
function YJ9() {
  let {
    addNotification: A
  } = vZ();
  IJ9.useEffect(() => {
    let B = N1().sonnet45MigrationTimestamp;
    if (B) {
      if (Date.now() - B < 3000) A({
        key: "sonnet-4.5-update",
        text: "Model updated to Sonnet 4.5",
        color: "suggestion",
        priority: "high",
        timeoutMs: 3000
      })
    }
  }, [A])
}
// @from(Start 13715747, End 13715750)
IJ9
// @from(Start 13715756, End 13715810)
JJ9 = L(() => {
  EU();
  jQ();
  IJ9 = BA(VA(), 1)
})
// @from(Start 13715813, End 13716529)
function XJ9() {
  let {
    addNotification: A
  } = vZ();
  WJ9.useEffect(() => {
    if (N1().subscriptionNoticeCount ?? 0 >= H_3) return;
    C_3().then((Q) => {
      if (Q === null) return;
      let B = N1();
      c0({
        ...B,
        subscriptionNoticeCount: (B.subscriptionNoticeCount ?? 0) + 1
      }), GA("tengu_switch_to_subscription_notice_shown", {}), A({
        key: "switch-to-subscription",
        jsx: QSA.createElement($, {
          color: "suggestion"
        }, "Use your existing Claude ", Q, " plan with Claude Code", QSA.createElement($, {
          color: "text",
          dimColor: !0
        }, " ", "· /login to activate")),
        priority: "low"
      })
    })
  }, [A])
}
// @from(Start 13716530, End 13716731)
async function C_3() {
  if (BB()) return null;
  let A = await dbA();
  if (!A) return null;
  if (A.account.has_claude_max) return "Max";
  if (A.account.has_claude_pro) return "Pro";
  return null
}
// @from(Start 13716736, End 13716739)
QSA
// @from(Start 13716741, End 13716744)
WJ9
// @from(Start 13716746, End 13716753)
H_3 = 3
// @from(Start 13716759, End 13716865)
VJ9 = L(() => {
  hA();
  kDA();
  jQ();
  q0();
  gB();
  EU();
  QSA = BA(VA(), 1), WJ9 = BA(VA(), 1)
})
// @from(Start 13716868, End 13717473)
function FJ9({
  onRun: A,
  onCancel: Q,
  reason: B
}) {
  let G = JVA.useRef(!1);
  return f1(JVA.useCallback((Z, I) => {
    if (I.escape) Q()
  }, [Q])), JVA.useEffect(() => {
    if (!G.current) G.current = !0, A()
  }, [A]), Bz.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, Bz.createElement(S, null, Bz.createElement($, {
    bold: !0
  }, "Running /issue to capture feedback...")), Bz.createElement(S, null, Bz.createElement($, {
    dimColor: !0
  }, "Press Esc anytime to cancel")), Bz.createElement(S, null, Bz.createElement($, {
    dimColor: !0
  }, "Reason: ", B)))
}
// @from(Start 13717475, End 13717637)
function nX0(A) {
  return !1;
  switch (A) {
    case "feedback_survey_bad":
      return !0;
    case "feedback_survey_good":
    default:
      return !1
  }
}
// @from(Start 13717639, End 13717904)
function KJ9(A) {
  switch (A) {
    case "feedback_survey_bad":
      return 'You responded "Bad" to the feedback survey';
    case "feedback_survey_good":
      return 'You responded "Good" to the feedback survey';
    default:
      return "Unknown reason"
  }
}
// @from(Start 13717909, End 13717911)
Bz
// @from(Start 13717913, End 13717916)
JVA
// @from(Start 13717922, End 13717986)
DJ9 = L(() => {
  hA();
  Bz = BA(VA(), 1), JVA = BA(VA(), 1)
})
// @from(Start 13718035, End 13718369)
function HJ9({
  mainThreadAgentDefinition: A,
  toolUseContext: Q,
  customSystemPrompt: B,
  defaultSystemPrompt: G,
  appendSystemPrompt: Z
}) {
  let I = A ? $O(A) ? A.getSystemPrompt({
    toolUseContext: {
      options: Q.options
    }
  }) : A.getSystemPrompt() : void 0;
  return [...I ? [I] : B ? [B] : G, ...Z ? [Z] : []]
}