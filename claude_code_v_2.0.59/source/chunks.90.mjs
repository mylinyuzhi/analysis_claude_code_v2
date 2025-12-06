
// @from(Start 8492224, End 8492742)
async function Oo1() {
  try {
    let A = await m15();
    if (!A) return {
      hasPermissions: !1,
      npmPrefix: null
    };
    let Q = !1;
    try {
      f15(A, v15.W_OK), Q = !0
    } catch {
      Q = !1
    }
    if (Q) return {
      hasPermissions: !0,
      npmPrefix: A
    };
    return AA(new U01("Insufficient permissions for global npm install.")), {
      hasPermissions: !1,
      npmPrefix: A
    }
  } catch (A) {
    return AA(A), {
      hasPermissions: !1,
      npmPrefix: null
    }
  }
}
// @from(Start 8492743, End 8493468)
async function bAA() {
  let A = o9();
  setTimeout(() => A.abort(), 5000);
  let Q = await QQ("npm", ["view", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}@latest`, "version", "--prefer-online"], {
    abortSignal: A.signal
  });
  if (Q.code !== 0) {
    if (g(`npm view failed with code ${Q.code}`), Q.stderr) g(`npm stderr: ${Q.stderr.trim()}`);
    else g("npm stderr: (empty)");
    if (Q.stdout) g(`npm stdout: ${Q.stdout.trim()}`);
    return null
  }
  return Q.stdout.trim()
}
// @from(Start 8493469, End 8495758)
async function nNA() {
  if (!g15()) return AA(new U01("Another process is currently installing an update")), GA("tengu_auto_updater_lock_contention", {
    pid: process.pid,
    currentVersion: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION
  }), "in_progress";
  try {
    if (d15(), !d0.isRunningWithBun() && d0.isNpmFromWindowsPath()) return AA(Error("Windows NPM detected in WSL environment")), GA("tengu_auto_updater_windows_npm_in_wsl", {
      currentVersion: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION
    }), console.error(`
Error: Windows NPM detected in WSL

You're running Claude Code in WSL but using the Windows NPM installation from /mnt/c/.
This configuration is not supported for updates.

To fix this issue:
  1. Install Node.js within your Linux distribution: e.g. sudo apt install nodejs npm
  2. Make sure Linux NPM is in your PATH before the Windows version
  3. Try updating again with 'claude update'
`), "install_failed";
    let {
      hasPermissions: A
    } = await Oo1();
    if (!A) return "no_permissions";
    let Q = d0.isRunningWithBun() ? "bun" : "npm",
      B = await QQ(Q, ["install", "-g", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.PACKAGE_URL]);
    if (B.code !== 0) return AA(new U01(`Failed to install new version of claude: ${B.stdout} ${B.stderr}`)), "install_failed";
    let G = N1();
    return c0({
      ...G,
      installMethod: "global"
    }), "success"
  } finally {
    u15()
  }
}
// @from(Start 8495760, End 8496100)
function d15() {
  let A = fl();
  for (let [, Q] of Object.entries(A)) try {
    let B = iNA(Q);
    if (!B) continue;
    let {
      filtered: G,
      hadAlias: Z
    } = C01(B);
    if (Z) E01(Q, G), g(`Removed claude alias from ${Q}`)
  } catch (B) {
    g(`Failed to remove alias from ${Q}: ${B}`, {
      level: "error"
    })
  }
}
// @from(Start 8496105, End 8496108)
MA2
// @from(Start 8496110, End 8496113)
U01
// @from(Start 8496115, End 8496127)
h15 = 300000
// @from(Start 8496133, End 8496310)
ZIA = L(() => {
  q0();
  u2();
  OZ();
  jQ();
  V0();
  c5();
  hQ();
  RZ();
  _8();
  AQ();
  kW();
  g1();
  z01();
  MA2 = BA(KU(), 1);
  U01 = class U01 extends BKA {}
})
// @from(Start 8496313, End 8496567)
function $01() {
  let A = dQ();
  if (A !== "macos" && A !== "linux" && A !== "wsl") return !1;
  let Q = process.execPath || process.argv[0] || "";
  if (Q.includes("/Caskroom/")) return g(`Detected Homebrew cask installation: ${Q}`), !0;
  return !1
}
// @from(Start 8496572, End 8496575)
IIA
// @from(Start 8496581, End 8496702)
w01 = L(() => {
  Q3();
  V0();
  l2();
  IIA = s1(() => {
    if ($01()) return "homebrew";
    return "unknown"
  })
})
// @from(Start 8496832, End 8497728)
async function Nk() {
  let A = process.argv[1] || "",
    Q = process.execPath || process.argv[0] || "";
  if (dQ() === "windows") A = A.split(sNA.sep).join(aNA.sep), Q = Q.split(sNA.sep).join(aNA.sep);
  let B = [A, Q],
    G = ["/build-ant/", "/build-external/", "/build-external-native/", "/build-ant-native/"];
  if (B.some((Y) => G.some((J) => Y.includes(J)))) return "development";
  if (UX()) {
    if ($01()) return "package-manager";
    return "native"
  }
  if (qA2()) return "npm-local";
  if (["/usr/local/lib/node_modules", "/usr/lib/node_modules", "/opt/homebrew/lib/node_modules", "/opt/homebrew/bin", "/usr/local/bin", "/.nvm/versions/node/"].some((Y) => A.includes(Y))) return "npm-global";
  if (A.includes("/npm/") || A.includes("/nvm/")) return "npm-global";
  let I = await rFA("npm config get prefix");
  if (I && A.startsWith(I)) return "npm-global";
  return "unknown"
}
// @from(Start 8497729, End 8498073)
async function p15() {
  if (UX()) {
    let A = await QQ("which", ["claude"]);
    if (A.code === 0 && A.stdout) return A.stdout.trim();
    if (RA().existsSync(qk(fAA(), ".local/bin/claude"))) return qk(fAA(), ".local/bin/claude");
    return "native"
  }
  try {
    return process.argv[0] || "unknown"
  } catch {
    return "unknown"
  }
}
// @from(Start 8498075, End 8498230)
function Ro1() {
  try {
    if (UX()) return process.execPath || "unknown";
    return process.argv[1] || "unknown"
  } catch {
    return "unknown"
  }
}
// @from(Start 8498231, End 8500441)
async function l15() {
  let A = RA(),
    Q = [],
    B = qk(fAA(), ".claude", "local");
  if (bl()) Q.push({
    type: "npm-local",
    path: B
  });
  let G = ["@anthropic-ai/claude-code"];
  if ({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL && {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL !== "@anthropic-ai/claude-code") G.push({
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.PACKAGE_URL);
  let Z = await QQ("npm", ["-g", "config", "get", "prefix"]);
  if (Z.code === 0 && Z.stdout) {
    let J = Z.stdout.trim(),
      W = dQ() === "windows",
      X = W ? qk(J, "claude") : qk(J, "bin", "claude");
    if (A.existsSync(X)) {
      let V = !1;
      try {
        if (A.realpathSync(X).includes("/Caskroom/")) V = $01()
      } catch {}
      if (!V) Q.push({
        type: "npm-global",
        path: X
      })
    } else
      for (let V of G) {
        let F = W ? qk(J, "node_modules", V) : qk(J, "lib", "node_modules", V);
        if (A.existsSync(F)) Q.push({
          type: "npm-global-orphan",
          path: F
        })
      }
  }
  let I = qk(fAA(), ".local", "bin", "claude");
  if (A.existsSync(I)) Q.push({
    type: "native",
    path: I
  });
  if (N1().installMethod === "native") {
    let J = qk(fAA(), ".local", "share", "claude");
    if (A.existsSync(J) && !Q.some((W) => W.type === "native")) Q.push({
      type: "native",
      path: J
    })
  }
  return Q
}
// @from(Start 8500443, End 8502739)
function i15(A) {
  let Q = [],
    B = N1();
  if (A === "development") return Q;
  if (A === "native") {
    let Y = (process.env.PATH || "").split(c15),
      J = fAA(),
      W = qk(J, ".local", "bin"),
      X = W;
    if (dQ() === "windows") X = W.split(sNA.sep).join(aNA.sep);
    if (!Y.some((F) => {
        let K = F;
        if (dQ() === "windows") K = F.split(sNA.sep).join(aNA.sep);
        return K === X || F === "~/.local/bin" || F === "$HOME/.local/bin"
      }))
      if (dQ() === "windows") {
        let K = W.split(aNA.sep).join(sNA.sep);
        Q.push({
          issue: `Native installation exists but ${K} is not in your PATH`,
          fix: "Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal."
        })
      } else {
        let K = GIA(),
          H = fl()[K],
          C = H ? H.replace(fAA(), "~") : "your shell config file";
        Q.push({
          issue: "Native installation exists but ~/.local/bin is not in your PATH",
          fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${C} then open a new terminal or run: source ${C}`
        })
      }
  }
  if (!Y0(process.env.DISABLE_INSTALLATION_CHECKS)) {
    if (A === "npm-local" && B.installMethod !== "local") Q.push({
      issue: `Running from local installation but config install method is '${B.installMethod}'`,
      fix: "Consider using native installation: claude install"
    });
    if (A === "native" && B.installMethod !== "native") Q.push({
      issue: `Running native installation but config install method is '${B.installMethod}'`,
      fix: "Run claude install to update configuration"
    })
  }
  if (A === "npm-global" && bl()) Q.push({
    issue: "Local installation exists but not being used",
    fix: "Consider using native installation: claude install"
  });
  let G = Mo1(),
    Z = LA2();
  if (A === "npm-local") {
    if (G && !Z) Q.push({
      issue: "Local installation not accessible",
      fix: `Alias exists but points to invalid target: ${G}. Update alias: alias claude="~/.claude/local/claude"`
    });
    else if (!G) Q.push({
      issue: "Local installation not accessible",
      fix: 'Create alias: alias claude="~/.claude/local/claude"'
    })
  }
  return Q
}
// @from(Start 8502741, End 8503211)
function n15() {
  if (dQ() !== "linux") return [];
  let A = [],
    Q = nQ.getLinuxGlobPatternWarnings();
  if (Q.length > 0) {
    let B = Q.slice(0, 3).join(", "),
      G = Q.length - 3,
      Z = G > 0 ? `${B} (${G} more)` : B;
    A.push({
      issue: "Glob patterns in sandbox permission rules are not fully supported on Linux",
      fix: `Found ${Q.length} pattern(s): ${Z}. On Linux, glob patterns in Edit/Read rules will be ignored.`
    })
  }
  return A
}
// @from(Start 8503212, End 8506723)
async function YIA() {
  let A = await Nk(),
    Q = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION ? {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION : "unknown",
    B = await p15(),
    G = Ro1(),
    Z = await l15(),
    I = i15(A);
  if (I.push(...n15()), A === "native") {
    let D = Z.filter((C) => C.type === "npm-global" || C.type === "npm-global-orphan" || C.type === "npm-local"),
      H = dQ() === "windows";
    for (let C of D)
      if (C.type === "npm-global") {
        let E = "npm -g uninstall @anthropic-ai/claude-code";
        if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.0.59",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
          }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.0.59",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
          }.PACKAGE_URL !== "@anthropic-ai/claude-code") E += ` && npm -g uninstall ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}`;
        I.push({
          issue: `Leftover npm global installation at ${C.path}`,
          fix: `Run: ${E}`
        })
      } else if (C.type === "npm-global-orphan") I.push({
      issue: `Orphaned npm global package at ${C.path}`,
      fix: H ? `Run: rmdir /s /q "${C.path}"` : `Run: rm -rf ${C.path}`
    });
    else if (C.type === "npm-local") I.push({
      issue: `Leftover npm local installation at ${C.path}`,
      fix: H ? `Run: rmdir /s /q "${C.path}"` : `Run: rm -rf ${C.path}`
    })
  }
  let J = N1().installMethod || "not set",
    W = null;
  if (A === "npm-global") {
    if (W = (await Oo1()).hasPermissions, !W && !fb()) I.push({
      issue: "Insufficient permissions for auto-updates",
      fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
    })
  }
  let X = WS0(),
    V = {
      working: X.working ?? !0,
      mode: X.mode,
      systemPath: X.mode === "system" ? X.path : null
    },
    F = A === "package-manager" ? IIA() : void 0;
  return {
    installationType: A,
    version: Q,
    installationPath: B,
    invokedBinary: G,
    configInstallMethod: J,
    autoUpdates: fb() === !0 ? "false" : "default (true)",
    hasUpdatePermissions: W,
    multipleInstallations: Z,
    warnings: I,
    packageManager: F,
    ripgrepStatus: V
  }
}
// @from(Start 8506728, End 8506844)
Zh = L(() => {
  AQ();
  U2();
  xAA();
  jQ();
  ZIA();
  z01();
  Q3();
  _8();
  sj();
  $J();
  hQ();
  w01()
})
// @from(Start 8506850, End 8506858)
So1 = {}
// @from(Start 8507073, End 8507148)
function e15() {
  let A = RA2(a15(import.meta.url));
  return RA2(Ro1())
}
// @from(Start 8507150, End 8507349)
function A05(A) {
  if (!UX() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
  for (let Q of Bun.embeddedFiles) {
    let B = Q.name;
    if (B && B.endsWith(A)) return Q
  }
  return null
}
// @from(Start 8507350, End 8507476)
async function PA2(A) {
  let Q = A05(A);
  if (!Q) return null;
  let B = await Q.arrayBuffer();
  return new Uint8Array(B)
}
// @from(Start 8507477, End 8508432)
async function Q05() {
  let A = RA(),
    Q = null,
    B = null,
    G = null;
  if (UX()) {
    if (Q = await PA2("tree-sitter.wasm"), B = await PA2("tree-sitter-bash.wasm"), Q && B) G = "embedded"
  }
  if (!Q || !B) {
    let Z = e15(),
      I = !1,
      Y = TA2(Z, "tree-sitter.wasm"),
      J = TA2(Z, "tree-sitter-bash.wasm");
    if (!A.existsSync(Y) || !A.existsSync(J)) {
      g("tree-sitter: WASM files not found"), GA("tengu_tree_sitter_load", {
        success: !1
      });
      return
    }
    Q = A.readFileBytesSync(Y), B = A.readFileBytesSync(J), G = "disk"
  }
  if (!Q || !B) {
    g("tree-sitter: failed to get WASM bytes"), GA("tengu_tree_sitter_load", {
      success: !1
    });
    return
  }
  await No1.init({
    wasmBinary: Q
  }), q01 = new No1, jo1 = await qo1.load(B), q01.setLanguage(jo1), g(`tree-sitter: loaded from ${G}`), GA("tengu_tree_sitter_load", {
    success: !0,
    from_embedded: G === "embedded"
  })
}
// @from(Start 8508433, End 8508494)
async function jA2() {
  if (!Po1) Po1 = Q05();
  await Po1
}
// @from(Start 8508495, End 8508860)
async function B05(A) {
  if (await jA2(), !A || A.length > s15 || !q01 || !jo1) return null;
  try {
    let Q = q01.parse(A),
      B = Q?.rootNode;
    if (!B) return null;
    let G = SA2(B),
      Z = G05(G);
    return {
      tree: Q,
      rootNode: B,
      envVars: Z,
      commandNode: G,
      originalCommand: A
    }
  } catch {
    return null
  }
}
// @from(Start 8508862, End 8509294)
function SA2(A) {
  let {
    type: Q,
    children: B,
    parent: G
  } = A;
  if (To1.has(Q)) return A;
  if (Q === "variable_assignment" && G) return G.children.find((Z) => Z && To1.has(Z.type) && Z.startIndex > A.startIndex) ?? null;
  if (Q === "pipeline" || Q === "redirected_statement") return B.find((Z) => Z && To1.has(Z.type)) ?? null;
  for (let Z of B) {
    let I = Z && SA2(Z);
    if (I) return I
  }
  return null
}
// @from(Start 8509296, End 8509566)
function G05(A) {
  if (!A || A.type !== "command") return [];
  let Q = [];
  for (let B of A.children) {
    if (!B) continue;
    if (B.type === "variable_assignment") Q.push(B.text);
    else if (B.type === "command_name" || B.type === "word") break
  }
  return Q
}
// @from(Start 8509568, End 8510034)
function Z05(A) {
  if (A.type === "declaration_command") {
    let G = A.children[0];
    return G && r15.has(G.text) ? [G.text] : []
  }
  let Q = [],
    B = !1;
  for (let G of A.children) {
    if (!G || G.type === "variable_assignment") continue;
    if (G.type === "command_name" || !B && G.type === "word") {
      B = !0, Q.push(G.text);
      continue
    }
    if (o15.has(G.type)) Q.push(I05(G.text));
    else if (t15.has(G.type)) break
  }
  return Q
}
// @from(Start 8510036, End 8510173)
function I05(A) {
  return A.length >= 2 && (A[0] === '"' && A.at(-1) === '"' || A[0] === "'" && A.at(-1) === "'") ? A.slice(1, -1) : A
}
// @from(Start 8510178, End 8510187)
s15 = 1e4
// @from(Start 8510191, End 8510194)
r15
// @from(Start 8510196, End 8510199)
o15
// @from(Start 8510201, End 8510204)
t15
// @from(Start 8510206, End 8510209)
To1
// @from(Start 8510211, End 8510221)
q01 = null
// @from(Start 8510225, End 8510235)
jo1 = null
// @from(Start 8510239, End 8510249)
Po1 = null
// @from(Start 8510255, End 8510581)
_o1 = L(() => {
  UA2();
  AQ();
  Zh();
  q0();
  V0();
  r15 = new Set(["export", "declare", "typeset", "readonly", "local", "unset", "unsetenv"]), o15 = new Set(["word", "string", "raw_string", "number"]), t15 = new Set(["command_substitution", "process_substitution"]), To1 = new Set(["command", "declaration_command"])
})
// @from(Start 8510583, End 8511488)
class _A2 {
  originalCommand;
  constructor(A) {
    this.originalCommand = A
  }
  toString() {
    return this.originalCommand
  }
  getPipeSegments() {
    try {
      let A = ko1(this.originalCommand),
        Q = [],
        B = [];
      for (let G of A)
        if (G === "|") {
          if (B.length > 0) Q.push(B.join(" ")), B = []
        } else B.push(G);
      if (B.length > 0) Q.push(B.join(" "));
      return Q.length > 0 ? Q : [this.originalCommand]
    } catch {
      return [this.originalCommand]
    }
  }
  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">")) return this.originalCommand;
    let {
      commandWithoutRedirections: A,
      redirections: Q
    } = nT(this.originalCommand);
    return Q.length > 0 ? A : this.originalCommand
  }
  getOutputRedirections() {
    let {
      redirections: A
    } = nT(this.originalCommand);
    return A
  }
}
// @from(Start 8511493, End 8511496)
Y05
// @from(Start 8511498, End 8511501)
N01
// @from(Start 8511507, End 8514310)
kA2 = L(() => {
  l2();
  bU();
  Y05 = s1(async () => {
    try {
      let {
        parseCommand: A
      } = await Promise.resolve().then(() => (_o1(), So1));
      if (!await A("echo test")) return null;
      return class {
        originalCommand;
        rootNode;
        constructor(G, Z) {
          this.originalCommand = G, this.rootNode = Z
        }
        toString() {
          return this.originalCommand
        }
        getPipeSegments() {
          let G = [];
          if (this.visitNodes(this.rootNode, (J) => {
              if (J.type === "pipeline") {
                let W = J.children;
                for (let X of W)
                  if (X && X.type === "|") G.push(X.startIndex)
              }
            }), G.length === 0) return [this.originalCommand];
          let Z = [],
            I = 0;
          for (let J of G) {
            let W = this.originalCommand.slice(I, J).trim();
            if (W) Z.push(W);
            I = J + 1
          }
          let Y = this.originalCommand.slice(I).trim();
          if (Y) Z.push(Y);
          return Z
        }
        withoutOutputRedirections() {
          let G = this.findOutputRedirectionNodes();
          if (G.length === 0) return this.originalCommand;
          G.sort((I, Y) => Y.startIndex - I.startIndex);
          let Z = this.originalCommand;
          for (let I of G) Z = Z.slice(0, I.startIndex) + Z.slice(I.endIndex);
          return Z.trim().replace(/\s+/g, " ")
        }
        getOutputRedirections() {
          return this.findOutputRedirectionNodes().map(({
            target: G,
            operator: Z
          }) => ({
            target: G,
            operator: Z
          }))
        }
        findOutputRedirectionNodes() {
          let G = [];
          return this.visitNodes(this.rootNode, (Z) => {
            if (Z.type === "file_redirect") {
              let I = Z.children,
                Y = I.find((W) => W && (W.type === ">" || W.type === ">>")),
                J = I.find((W) => W && W.type === "word");
              if (Y && J) G.push({
                startIndex: Z.startIndex,
                endIndex: Z.endIndex,
                target: J.text,
                operator: Y.type
              })
            }
          }), G
        }
        visitNodes(G, Z) {
          let I = G;
          Z(I);
          for (let Y of I.children)
            if (Y) this.visitNodes(Y, Z)
        }
      }
    } catch {
      return null
    }
  }), N01 = {
    async parse(A) {
      if (!A) return null;
      let Q = await Y05();
      if (Q) try {
        let {
          parseCommand: B
        } = await Promise.resolve().then(() => (_o1(), So1)), G = await B(A);
        if (G) return new Q(A, G.rootNode)
      } catch {}
      return new _A2(A)
    }
  }
})
// @from(Start 8514312, End 8515703)
async function J05(A, Q, B) {
  if (Q.filter((X) => {
      let V = X.trim();
      return V.startsWith("cd ") || V === "cd"
    }).length > 1) {
    let X = {
      type: "other",
      reason: "Multiple directory changes in one command require approval for clarity"
    };
    return {
      behavior: "ask",
      decisionReason: X,
      message: yV(D9.name, X)
    }
  }
  let Z = new Map;
  for (let X of Q) {
    let V = X.trim();
    if (!V) continue;
    let F = await B({
      ...A,
      command: V
    });
    Z.set(V, F)
  }
  let I = Array.from(Z.entries()).find(([, X]) => X.behavior === "deny");
  if (I) {
    let [X, V] = I;
    return {
      behavior: "deny",
      message: V.behavior === "deny" ? V.message : `Permission denied for: ${X}`,
      decisionReason: {
        type: "subcommandResults",
        reasons: Z
      }
    }
  }
  if (Array.from(Z.values()).every((X) => X.behavior === "allow")) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: Z
    }
  };
  let J = [];
  for (let [, X] of Z)
    if (X.behavior !== "allow" && "suggestions" in X && X.suggestions) J.push(...X.suggestions);
  let W = {
    type: "subcommandResults",
    reasons: Z
  };
  return {
    behavior: "ask",
    message: yV(D9.name, W),
    decisionReason: W,
    suggestions: J.length > 0 ? J : void 0
  }
}
// @from(Start 8515704, End 8515827)
async function W05(A) {
  if (!A.includes(">")) return A;
  return (await N01.parse(A))?.withoutOutputRedirections() ?? A
}
// @from(Start 8515828, End 8516524)
async function yA2(A, Q) {
  if (vA2(A.command)) {
    let I = kl(A.command),
      Y = {
        type: "other",
        reason: I.behavior === "ask" && I.message ? I.message : "This command uses shell operators that require approval for safety"
      };
    return {
      behavior: "ask",
      message: yV(D9.name, Y),
      decisionReason: Y
    }
  }
  let B = await N01.parse(A.command);
  if (!B) return {
    behavior: "passthrough",
    message: "Failed to parse command"
  };
  let G = B.getPipeSegments();
  if (G.length <= 1) return {
    behavior: "passthrough",
    message: "No pipes found in command"
  };
  let Z = await Promise.all(G.map((I) => W05(I)));
  return J05(A, Z, Q)
}
// @from(Start 8516529, End 8516588)
xA2 = L(() => {
  pF();
  bU();
  AZ();
  F01();
  kA2()
})
// @from(Start 8516710, End 8516885)
function hA2(A) {
  let Q = A.length;
  if (Q <= yo1) return A.map((G) => `'${G}'`).join(", ");
  return `${A.slice(0,yo1).map((G)=>`'${G}'`).join(", ")}, and ${Q-yo1} more`
}
// @from(Start 8516887, End 8517097)
function V05(A) {
  let Q = A.match(fA2);
  if (!Q || Q.index === void 0) return A;
  let B = A.substring(0, Q.index),
    G = B.lastIndexOf("/");
  if (G === -1) return ".";
  return B.substring(0, G) || "/"
}
// @from(Start 8517099, End 8517704)
function xo1(A, Q, B) {
  let G = B === "read" ? "read" : "edit",
    Z = jD(A, Q, G, "deny");
  if (Z !== null) return {
    allowed: !1,
    decisionReason: {
      type: "rule",
      rule: Z
    }
  };
  if (B !== "read") {
    let Y = ho1(A);
    if (!Y.safe) return {
      allowed: !1,
      decisionReason: {
        type: "other",
        reason: Y.message
      }
    }
  }
  if (qT(A, Q)) return {
    allowed: !0
  };
  let I = jD(A, Q, G, "allow");
  if (I !== null) return {
    allowed: !0,
    decisionReason: {
      type: "rule",
      rule: I
    }
  };
  return {
    allowed: !1
  }
}
// @from(Start 8517706, End 8518194)
function F05(A, Q, B, G) {
  if (C9A(A)) {
    let W = L01(A) ? A : M01(Q, A),
      {
        resolvedPath: X
      } = fK(RA(), W),
      V = xo1(X, B, G);
    return {
      allowed: V.allowed,
      resolvedPath: X,
      decisionReason: V.decisionReason
    }
  }
  let Z = V05(A),
    I = L01(Z) ? Z : M01(Q, Z),
    {
      resolvedPath: Y
    } = fK(RA(), I),
    J = xo1(Y, B, G);
  return {
    allowed: J.allowed,
    resolvedPath: Y,
    decisionReason: J.decisionReason
  }
}
// @from(Start 8518196, End 8518292)
function gA2(A) {
  if (A === "~" || A.startsWith("~/")) return vo1() + A.slice(1);
  return A
}
// @from(Start 8518294, End 8518525)
function K05(A) {
  if (A === "*" || A.endsWith("/*")) return !0;
  let Q = A === "/" ? A : A.replace(/\/$/, "");
  if (Q === "/") return !0;
  let B = vo1();
  if (Q === B) return !0;
  if (X05(Q) === "/") return !0;
  return !1
}
// @from(Start 8518527, End 8519329)
function uA2(A, Q, B, G) {
  let Z = gA2(A.replace(/^['"]|['"]$/g, ""));
  if (Z.includes("$") || Z.includes("%")) return {
    allowed: !1,
    resolvedPath: Z,
    decisionReason: {
      type: "other",
      reason: "Shell expansion syntax in paths requires manual approval"
    }
  };
  if (fA2.test(Z)) {
    if (G === "write" || G === "create") return {
      allowed: !1,
      resolvedPath: Z,
      decisionReason: {
        type: "other",
        reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
      }
    };
    return F05(Z, Q, B, G)
  }
  let I = L01(Z) ? Z : M01(Q, Z),
    {
      resolvedPath: Y
    } = fK(RA(), I),
    J = xo1(Y, B, G);
  return {
    allowed: J.allowed,
    resolvedPath: Y,
    decisionReason: J.decisionReason
  }
}
// @from(Start 8519331, End 8519996)
function D05(A, Q, B) {
  let G = bo1[A],
    Z = G(Q);
  for (let I of Z) {
    let Y = gA2(I.replace(/^['"]|['"]$/g, "")),
      J = L01(Y) ? Y : M01(B, Y);
    if (K05(J)) return {
      behavior: "ask",
      message: `Dangerous ${A} operation detected: '${J}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
      decisionReason: {
        type: "other",
        reason: `Dangerous ${A} operation on critical path: ${J}`
      },
      suggestions: []
    }
  }
  return {
    behavior: "passthrough",
    message: `No dangerous removals detected for ${A} command`
  }
}
// @from(Start 8519998, End 8520456)
function bA2(A, Q, B = []) {
  let G = [],
    Z = !1;
  for (let I = 0; I < A.length; I++) {
    let Y = A[I];
    if (Y === void 0 || Y === null) continue;
    if (Y.startsWith("-")) {
      let J = Y.split("=")[0];
      if (J && ["-e", "--regexp", "-f", "--file"].includes(J)) Z = !0;
      if (J && Q.has(J) && !Y.includes("=")) I++;
      continue
    }
    if (!Z) {
      Z = !0;
      continue
    }
    G.push(Y)
  }
  return G.length > 0 ? G : B
}
// @from(Start 8520458, End 8522176)
function z05(A, Q, B, G, Z) {
  let I = bo1[A],
    Y = I(Q),
    J = mA2[A],
    W = E05[A];
  if (W && !W(Q)) return {
    behavior: "ask",
    message: `${A} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${A} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
    decisionReason: {
      type: "other",
      reason: `${A} command with flags requires manual approval`
    }
  };
  if (Z && J !== "read") return {
    behavior: "ask",
    message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
    decisionReason: {
      type: "other",
      reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
    }
  };
  for (let X of Y) {
    let {
      allowed: V,
      resolvedPath: F,
      decisionReason: K
    } = uA2(X, B, G, J);
    if (!V) {
      let D = Array.from(JIA(G)),
        H = hA2(D),
        C = K?.type === "other" ? K.reason : `${A} in '${F}' was blocked. For security, Claude Code may only ${C05[A]} the allowed working directories for this session: ${H}.`;
      if (K?.type === "rule") return {
        behavior: "deny",
        message: C,
        decisionReason: K
      };
      return {
        behavior: "ask",
        message: C,
        blockedPath: F,
        decisionReason: K
      }
    }
  }
  return {
    behavior: "passthrough",
    message: `Path validation passed for ${A} command`
  }
}
// @from(Start 8522178, End 8523030)
function U05(A) {
  return (Q, B, G, Z) => {
    let I = z05(A, Q, B, G, Z);
    if (I.behavior === "deny") return I;
    if (A === "rm" || A === "rmdir") {
      let Y = D05(A, Q, B);
      if (Y.behavior !== "passthrough") return Y
    }
    if (I.behavior === "passthrough") return I;
    if (I.behavior === "ask") {
      let Y = mA2[A],
        J = [];
      if (I.blockedPath)
        if (Y === "read") {
          let W = Zv(I.blockedPath),
            X = XxA(W, "session");
          if (X) J.push(X)
        } else J.push({
          type: "addDirectories",
          directories: [Zv(I.blockedPath)],
          destination: "session"
        });
      if (Y === "write" || Y === "create") J.push({
        type: "setMode",
        mode: "acceptEdits",
        destination: "session"
      });
      I.suggestions = J
    }
    return I
  }
}
// @from(Start 8523032, End 8523344)
function $05(A) {
  let Q = JW(A, (Z) => `$${Z}`);
  if (!Q.success) return [];
  let B = Q.tokens,
    G = [];
  for (let Z of B)
    if (typeof Z === "string") G.push(Z);
    else if (typeof Z === "object" && Z !== null && "op" in Z && Z.op === "glob" && "pattern" in Z) G.push(String(Z.pattern));
  return G
}
// @from(Start 8523346, End 8523694)
function w05(A, Q, B, G) {
  let Z = $05(A);
  if (Z.length === 0) return {
    behavior: "passthrough",
    message: "Empty command - no paths to validate"
  };
  let [I, ...Y] = Z;
  if (!I || !H05.includes(I)) return {
    behavior: "passthrough",
    message: `Command '${I}' is not a path-restricted command`
  };
  return U05(I)(Y, Q, B, G)
}
// @from(Start 8523696, End 8525221)
function q05(A, Q, B, G) {
  if (G && A.length > 0) return {
    behavior: "ask",
    message: "Commands that change directories and write via output redirection require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
    decisionReason: {
      type: "other",
      reason: "Compound command contains cd with output redirection - manual approval required to prevent path resolution bypass"
    }
  };
  for (let {
      target: Z
    }
    of A) {
    if (Z === "/dev/null") continue;
    let {
      allowed: I,
      resolvedPath: Y,
      decisionReason: J
    } = uA2(Z, Q, B, "create");
    if (!I) {
      let W = Array.from(JIA(B)),
        X = hA2(W),
        V = J?.type === "other" ? J.reason : J?.type === "rule" ? `Output redirection to '${Y}' was blocked by a deny rule.` : `Output redirection to '${Y}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${X}.`;
      if (J?.type === "rule") return {
        behavior: "deny",
        message: V,
        decisionReason: J
      };
      return {
        behavior: "ask",
        message: V,
        blockedPath: Y,
        suggestions: [{
          type: "addDirectories",
          directories: [Zv(Y)],
          destination: "session"
        }]
      }
    }
  }
  return {
    behavior: "passthrough",
    message: "No unsafe redirections found"
  }
}
// @from(Start 8525223, End 8525883)
function fo1(A, Q, B, G) {
  if (/(?:>>?)\s*\S*[$%]/.test(A.command)) return {
    behavior: "ask",
    message: "Shell expansion syntax in paths requires manual approval",
    decisionReason: {
      type: "other",
      reason: "Shell expansion syntax in paths requires manual approval"
    }
  };
  let {
    redirections: Z
  } = nT(A.command), I = q05(Z, Q, B, G);
  if (I.behavior !== "passthrough") return I;
  let Y = lF(A.command);
  for (let J of Y) {
    let W = w05(J, Q, B, G);
    if (W.behavior === "ask" || W.behavior === "deny") return W
  }
  return {
    behavior: "passthrough",
    message: "All path commands validated successfully"
  }
}
// @from(Start 8525888, End 8525895)
yo1 = 5
// @from(Start 8525899, End 8525902)
fA2
// @from(Start 8525904, End 8525952)
KG = (A) => A.filter((Q) => !Q?.startsWith("-"))
// @from(Start 8525956, End 8525959)
bo1
// @from(Start 8525961, End 8525964)
H05
// @from(Start 8525966, End 8525969)
C05
// @from(Start 8525971, End 8525974)
mA2
// @from(Start 8525976, End 8525979)
E05
// @from(Start 8525985, End 8531819)
dA2 = L(() => {
  AQ();
  EJ();
  cK();
  yI();
  bU();
  dK();
  fA2 = /[*?[\]{}]/;
  bo1 = {
    cd: (A) => A.length === 0 ? [vo1()] : [A.join(" ")],
    ls: (A) => {
      let Q = KG(A);
      return Q.length > 0 ? Q : ["."]
    },
    find: (A) => {
      let Q = [],
        B = new Set(["-newer", "-anewer", "-cnewer", "-mnewer", "-samefile", "-path", "-wholename", "-ilname", "-lname", "-ipath", "-iwholename"]),
        G = /^-newer[acmBt][acmtB]$/,
        Z = !1;
      for (let I = 0; I < A.length; I++) {
        let Y = A[I];
        if (!Y) continue;
        if (Y.startsWith("-")) {
          if (["-H", "-L", "-P"].includes(Y)) continue;
          if (Z = !0, B.has(Y) || G.test(Y)) {
            let J = A[I + 1];
            if (J) Q.push(J), I++
          }
          continue
        }
        if (!Z) Q.push(Y)
      }
      return Q.length > 0 ? Q : ["."]
    },
    mkdir: KG,
    touch: KG,
    rm: KG,
    rmdir: KG,
    mv: KG,
    cp: KG,
    cat: KG,
    head: KG,
    tail: KG,
    sort: KG,
    uniq: KG,
    wc: KG,
    cut: KG,
    paste: KG,
    column: KG,
    file: KG,
    stat: KG,
    diff: KG,
    awk: KG,
    strings: KG,
    hexdump: KG,
    od: KG,
    base64: KG,
    nl: KG,
    sha256sum: KG,
    sha1sum: KG,
    md5sum: KG,
    tr: (A) => {
      let Q = A.some((G) => G === "-d" || G === "--delete" || G.startsWith("-") && G.includes("d"));
      return KG(A).slice(Q ? 1 : 2)
    },
    grep: (A) => {
      let B = bA2(A, new Set(["-e", "--regexp", "-f", "--file", "--exclude", "--include", "--exclude-dir", "--include-dir", "-m", "--max-count", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]));
      if (B.length === 0 && A.some((G) => ["-r", "-R", "--recursive"].includes(G))) return ["."];
      return B
    },
    rg: (A) => {
      return bA2(A, new Set(["-e", "--regexp", "-f", "--file", "-t", "--type", "-T", "--type-not", "-g", "--glob", "-m", "--max-count", "--max-depth", "-r", "--replace", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]), ["."])
    },
    sed: (A) => {
      let Q = [],
        B = !1,
        G = !1;
      for (let Z = 0; Z < A.length; Z++) {
        if (B) {
          B = !1;
          continue
        }
        let I = A[Z];
        if (!I) continue;
        if (I.startsWith("-")) {
          if (["-f", "--file"].includes(I)) {
            let Y = A[Z + 1];
            if (Y) Q.push(Y), B = !0;
            G = !0
          } else if (["-e", "--expression"].includes(I)) B = !0, G = !0;
          else if (I.includes("e") || I.includes("f")) G = !0;
          continue
        }
        if (!G) {
          G = !0;
          continue
        }
        Q.push(I)
      }
      return Q
    },
    jq: (A) => {
      let Q = [],
        B = new Set(["-e", "--expression", "-f", "--from-file", "--arg", "--argjson", "--slurpfile", "--rawfile", "--args", "--jsonargs", "-L", "--library-path", "--indent", "--tab"]),
        G = !1;
      for (let Z = 0; Z < A.length; Z++) {
        let I = A[Z];
        if (I === void 0 || I === null) continue;
        if (I.startsWith("-")) {
          let Y = I.split("=")[0];
          if (Y && ["-e", "--expression"].includes(Y)) G = !0;
          if (Y && B.has(Y) && !I.includes("=")) Z++;
          continue
        }
        if (!G) {
          G = !0;
          continue
        }
        Q.push(I)
      }
      return Q
    },
    git: (A) => {
      if (A.length >= 1 && A[0] === "diff") {
        if (A.includes("--no-index")) return A.slice(1).filter((G) => !G?.startsWith("-")).slice(0, 2)
      }
      return []
    }
  }, H05 = Object.keys(bo1), C05 = {
    cd: "change directories to",
    ls: "list files in",
    find: "search files in",
    mkdir: "create directories in",
    touch: "create or modify files in",
    rm: "remove files from",
    rmdir: "remove directories from",
    mv: "move files to/from",
    cp: "copy files to/from",
    cat: "concatenate files from",
    head: "read the beginning of files from",
    tail: "read the end of files from",
    sort: "sort contents of files from",
    uniq: "filter duplicate lines from files in",
    wc: "count lines/words/bytes in files from",
    cut: "extract columns from files in",
    paste: "merge files from",
    column: "format files from",
    tr: "transform text from files in",
    file: "examine file types in",
    stat: "read file stats from",
    diff: "compare files from",
    awk: "process text from files in",
    strings: "extract strings from files in",
    hexdump: "display hex dump of files from",
    od: "display octal dump of files from",
    base64: "encode/decode files from",
    nl: "number lines in files from",
    grep: "search for patterns in files from",
    rg: "search for patterns in files from",
    sed: "edit files in",
    git: "access files with git from",
    jq: "process JSON from files in",
    sha256sum: "compute SHA-256 checksums for files in",
    sha1sum: "compute SHA-1 checksums for files in",
    md5sum: "compute MD5 checksums for files in"
  }, mA2 = {
    cd: "read",
    ls: "read",
    find: "read",
    mkdir: "create",
    touch: "create",
    rm: "write",
    rmdir: "write",
    mv: "write",
    cp: "write",
    cat: "read",
    head: "read",
    tail: "read",
    sort: "read",
    uniq: "read",
    wc: "read",
    cut: "read",
    paste: "read",
    column: "read",
    tr: "read",
    file: "read",
    stat: "read",
    diff: "read",
    awk: "read",
    strings: "read",
    hexdump: "read",
    od: "read",
    base64: "read",
    nl: "read",
    grep: "read",
    rg: "read",
    sed: "write",
    git: "read",
    jq: "read",
    sha256sum: "read",
    sha1sum: "read",
    md5sum: "read"
  }, E05 = {
    mv: (A) => !A.some((Q) => Q?.startsWith("-")),
    cp: (A) => !A.some((Q) => Q?.startsWith("-"))
  }
})
// @from(Start 8531822, End 8531866)
function L05(A) {
  return N05.includes(A)
}
// @from(Start 8531868, End 8532338)
function M05(A, Q) {
  let B = A.trim(),
    [G] = B.split(/\s+/);
  if (!G) return {
    behavior: "passthrough",
    message: "Base command not found"
  };
  if (Q.mode === "acceptEdits" && L05(G)) return {
    behavior: "allow",
    updatedInput: {
      command: A
    },
    decisionReason: {
      type: "mode",
      mode: "acceptEdits"
    }
  };
  return {
    behavior: "passthrough",
    message: `No mode-specific handling for '${G}' in ${Q.mode} mode`
  }
}
// @from(Start 8532340, End 8532855)
function cA2(A, Q) {
  if (Q.mode === "bypassPermissions") return {
    behavior: "passthrough",
    message: "Bypass mode is handled in main permission flow"
  };
  if (Q.mode === "dontAsk") return {
    behavior: "passthrough",
    message: "DontAsk mode is handled in main permission flow"
  };
  let B = lF(A.command);
  for (let G of B) {
    let Z = M05(G, Q);
    if (Z.behavior !== "passthrough") return Z
  }
  return {
    behavior: "passthrough",
    message: "No mode-specific validation required"
  }
}
// @from(Start 8532860, End 8532863)
N05
// @from(Start 8532869, End 8532956)
pA2 = L(() => {
  bU();
  N05 = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]
})
// @from(Start 8532959, End 8533231)
function iA2(A, Q) {
  for (let B of A)
    if (B.startsWith("-") && !B.startsWith("--") && B.length > 2)
      for (let G = 1; G < B.length; G++) {
        let Z = "-" + B[G];
        if (!Q.includes(Z)) return !1
      } else if (!Q.includes(B)) return !1;
  return !0
}
// @from(Start 8533233, End 8534050)
function O05(A, Q) {
  let B = A.match(/^\s*sed\s+/);
  if (!B) return !1;
  let G = A.slice(B[0].length),
    Z = JW(G);
  if (!Z.success) return !1;
  let I = Z.tokens,
    Y = [];
  for (let X of I)
    if (typeof X === "string" && X.startsWith("-") && X !== "--") Y.push(X);
  if (!iA2(Y, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
  let W = !1;
  for (let X of Y) {
    if (X === "-n" || X === "--quiet" || X === "--silent") {
      W = !0;
      break
    }
    if (X.startsWith("-") && !X.startsWith("--") && X.includes("n")) {
      W = !0;
      break
    }
  }
  if (!W) return !1;
  if (Q.length === 0) return !1;
  for (let X of Q) {
    let V = X.split(";");
    for (let F of V)
      if (!R05(F.trim())) return !1
  }
  return !0
}
// @from(Start 8534052, End 8534265)
function R05(A) {
  if (!A) return !1;
  if (!A.endsWith("p")) return !1;
  if (A === "p") return !0;
  let Q = A.slice(0, -1);
  if (/^\d+$/.test(Q)) return !0;
  if (/^\d+,\d+$/.test(Q)) return !0;
  return !1
}
// @from(Start 8534267, End 8535185)
function lA2(A, Q, B, G) {
  let Z = G?.allowFileWrites ?? !1;
  if (!Z && B) return !1;
  let I = A.match(/^\s*sed\s+/);
  if (!I) return !1;
  let Y = A.slice(I[0].length),
    J = JW(Y);
  if (!J.success) return !1;
  let W = J.tokens,
    X = [];
  for (let w of W)
    if (typeof w === "string" && w.startsWith("-") && w !== "--") X.push(w);
  let V = ["-E", "--regexp-extended", "-r", "--posix"];
  if (Z) V.push("-i", "--in-place");
  if (!iA2(X, V)) return !1;
  if (Q.length !== 1) return !1;
  let F = Q[0].trim();
  if (!F.startsWith("s")) return !1;
  let K = F.match(/^s\/(.*?)$/);
  if (!K) return !1;
  let D = K[1],
    H = 0,
    C = -1,
    E = 0;
  while (E < D.length) {
    if (D[E] === "\\") {
      E += 2;
      continue
    }
    if (D[E] === "/") H++, C = E;
    E++
  }
  if (H !== 2) return !1;
  let U = D.slice(C + 1);
  if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(U)) return !1;
  return !0
}
// @from(Start 8535187, End 8535594)
function go1(A, Q) {
  let B = Q?.allowFileWrites ?? !1,
    G;
  try {
    G = P05(A)
  } catch (J) {
    return !1
  }
  let Z = T05(A),
    I = !1,
    Y = !1;
  if (B) Y = lA2(A, G, Z, {
    allowFileWrites: !0
  });
  else I = O05(A, G), Y = lA2(A, G, Z);
  if (!I && !Y) return !1;
  for (let J of G)
    if (Y && J.includes(";")) return !1;
  for (let J of G)
    if (j05(J)) return !1;
  return !0
}
// @from(Start 8535596, End 8536487)
function T05(A) {
  let Q = A.match(/^\s*sed\s+/);
  if (!Q) return !1;
  let B = A.slice(Q[0].length),
    G = JW(B);
  if (!G.success) return !0;
  let Z = G.tokens;
  try {
    let I = 0,
      Y = !1;
    for (let J = 0; J < Z.length; J++) {
      let W = Z[J];
      if (typeof W !== "string" && typeof W !== "object") continue;
      if (typeof W === "object" && W !== null && "op" in W && W.op === "glob") return !0;
      if (typeof W !== "string") continue;
      if ((W === "-e" || W === "--expression") && J + 1 < Z.length) {
        Y = !0, J++;
        continue
      }
      if (W.startsWith("--expression=")) {
        Y = !0;
        continue
      }
      if (W.startsWith("-e=")) {
        Y = !0;
        continue
      }
      if (W.startsWith("-")) continue;
      if (I++, Y) return !0;
      if (I > 1) return !0
    }
    return !1
  } catch (I) {
    return !0
  }
}
// @from(Start 8536489, End 8537595)
function P05(A) {
  let Q = [],
    B = A.match(/^\s*sed\s+/);
  if (!B) return Q;
  let G = A.slice(B[0].length);
  if (/-e[wWe]/.test(G) || /-w[eE]/.test(G)) throw Error("Dangerous flag combination detected");
  let Z = JW(G);
  if (!Z.success) throw Error(`Malformed shell syntax: ${Z.error}`);
  let I = Z.tokens;
  try {
    let Y = !1,
      J = !1;
    for (let W = 0; W < I.length; W++) {
      let X = I[W];
      if (typeof X !== "string") continue;
      if ((X === "-e" || X === "--expression") && W + 1 < I.length) {
        Y = !0;
        let V = I[W + 1];
        if (typeof V === "string") Q.push(V), W++;
        continue
      }
      if (X.startsWith("--expression=")) {
        Y = !0, Q.push(X.slice(13));
        continue
      }
      if (X.startsWith("-e=")) {
        Y = !0, Q.push(X.slice(3));
        continue
      }
      if (X.startsWith("-")) continue;
      if (!Y && !J) {
        Q.push(X), J = !0;
        continue
      }
      break
    }
  } catch (Y) {
    throw Error(`Failed to parse sed command: ${Y instanceof Error?Y.message:"Unknown error"}`)
  }
  return Q
}
// @from(Start 8537597, End 8539139)
function j05(A) {
  let Q = A.trim();
  if (!Q) return !1;
  if (/[^\x01-\x7F]/.test(Q)) return !0;
  if (Q.includes("{") || Q.includes("}")) return !0;
  if (Q.includes(`
`)) return !0;
  let B = Q.indexOf("#");
  if (B !== -1 && !(B > 0 && Q[B - 1] === "s")) return !0;
  if (/^!/.test(Q) || /[/\d$]!/.test(Q)) return !0;
  if (/\d\s*~\s*\d|,\s*~\s*\d|\$\s*~\s*\d/.test(Q)) return !0;
  if (/^,/.test(Q)) return !0;
  if (/,\s*[+-]/.test(Q)) return !0;
  if (/s\\/.test(Q) || /\\[|#%@]/.test(Q)) return !0;
  if (/\\\/.*[wW]/.test(Q)) return !0;
  if (/\/[^/]*\s+[wWeE]/.test(Q)) return !0;
  if (/^s\//.test(Q) && !/^s\/[^/]*\/[^/]*\/[^/]*$/.test(Q)) return !0;
  if (/^s./.test(Q) && /[wWeE]$/.test(Q)) {
    if (!/^s([^\\\n]).*?\1.*?\1[^wWeE]*$/.test(Q)) return !0
  }
  if (/^[wW]\s*\S+/.test(Q) || /^\d+\s*[wW]\s*\S+/.test(Q) || /^\$\s*[wW]\s*\S+/.test(Q) || /^\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(Q) || /^\d+,\d+\s*[wW]\s*\S+/.test(Q) || /^\d+,\$\s*[wW]\s*\S+/.test(Q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(Q)) return !0;
  if (/^e/.test(Q) || /^\d+\s*e/.test(Q) || /^\$\s*e/.test(Q) || /^\/[^/]*\/[IMim]*\s*e/.test(Q) || /^\d+,\d+\s*e/.test(Q) || /^\d+,\$\s*e/.test(Q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*e/.test(Q)) return !0;
  let G = Q.match(/s([^\\\n]).*?\1.*?\1(.*?)$/);
  if (G) {
    let I = G[2] || "";
    if (I.includes("w") || I.includes("W")) return !0;
    if (I.includes("e") || I.includes("E")) return !0
  }
  if (Q.match(/y([^\\\n])/)) {
    if (/[wWeE]/.test(Q)) return !0
  }
  return !1
}
// @from(Start 8539141, End 8539778)
function nA2(A, Q) {
  let B = lF(A.command);
  for (let G of B) {
    let Z = G.trim();
    if (Z.split(/\s+/)[0] !== "sed") continue;
    let Y = Q.mode === "acceptEdits";
    if (!go1(Z, {
        allowFileWrites: Y
      })) return {
      behavior: "ask",
      message: "sed command requires approval (contains potentially dangerous operations)",
      decisionReason: {
        type: "other",
        reason: "sed command contains operations that require explicit approval (e.g., write commands, execute commands)"
      }
    }
  }
  return {
    behavior: "passthrough",
    message: "No dangerous sed operations detected"
  }
}
// @from(Start 8539783, End 8539816)
uo1 = L(() => {
  bU();
  dK()
})
// @from(Start 8539819, End 8540001)
function do1(A) {
  return [{
    type: "addRules",
    rules: [{
      toolName: D9.name,
      ruleContent: A
    }],
    behavior: "allow",
    destination: "localSettings"
  }]
}
// @from(Start 8540003, End 8540192)
function S05(A) {
  return [{
    type: "addRules",
    rules: [{
      toolName: D9.name,
      ruleContent: `${A}:*`
    }],
    behavior: "allow",
    destination: "localSettings"
  }]
}
// @from(Start 8540194, End 8540254)
function aA2(A) {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(A)
}
// @from(Start 8540256, End 8540437)
function sA2(A) {
  return [{
    type: "addRules",
    rules: [{
      toolName: A,
      ruleContent: void 0
    }],
    behavior: "allow",
    destination: "localSettings"
  }]
}
// @from(Start 8540439, End 8541676)
function _05(A, Q) {
  let B = hAA(A);
  if (!B) return null;
  try {
    if (lF(A).length > 1) return null
  } catch {
    return null
  }
  let {
    server: G,
    toolName: Z
  } = B;
  if (!aA2(G) || !aA2(Z)) return {
    behavior: "deny",
    message: "Invalid MCP server or tool name. Names must contain only letters, numbers, hyphens, and underscores.",
    decisionReason: {
      type: "other",
      reason: "Security: Invalid characters in MCP identifier"
    }
  };
  let I = `mcp__${G}__${Z}`,
    Y = {
      name: I
    },
    J = ro1(Q, Y);
  if (J) return {
    behavior: "deny",
    message: `MCP tool ${G}/${Z} has been denied`,
    decisionReason: {
      type: "rule",
      rule: J
    }
  };
  let W = oo1(Q, Y);
  if (W) return {
    behavior: "ask",
    message: yV(I),
    decisionReason: {
      type: "rule",
      rule: W
    },
    suggestions: sA2(I)
  };
  let X = so1(Q, Y);
  if (X) return {
    behavior: "allow",
    updatedInput: {
      command: A
    },
    decisionReason: {
      type: "rule",
      rule: X
    }
  };
  return {
    behavior: "ask",
    message: yV(I),
    decisionReason: {
      type: "other",
      reason: "MCP tool requires permission"
    },
    suggestions: sA2(I)
  }
}
// @from(Start 8541678, End 8541835)
function po1(A) {
  let Q = co1(A);
  if (Q !== null) return {
    type: "prefix",
    prefix: Q
  };
  else return {
    type: "exact",
    command: A
  }
}
// @from(Start 8541837, End 8542558)
function mo1(A, Q, B) {
  let G = A.command.trim(),
    Z = nT(G).commandWithoutRedirections,
    Y = (B === "exact" ? [G, Z] : [Z]).flatMap((J) => {
      return process.env.ENABLE_BASH_WRAPPER_MATCHING || process.env.ENABLE_BASH_ENV_VAR_MATCHING, [J]
    });
  return Array.from(Q.entries()).filter(([J]) => {
    let W = po1(J);
    return Y.some((X) => {
      switch (W.type) {
        case "exact":
          return W.command === X;
        case "prefix":
          switch (B) {
            case "exact":
              return W.prefix === X;
            case "prefix":
              if (X === W.prefix) return !0;
              return X.startsWith(W.prefix + " ")
          }
      }
    })
  }).map(([, J]) => J)
}
// @from(Start 8542560, End 8542826)
function lo1(A, Q, B) {
  let G = fU(Q, D9, "deny"),
    Z = mo1(A, G, B),
    I = fU(Q, D9, "ask"),
    Y = mo1(A, I, B),
    J = fU(Q, D9, "allow"),
    W = mo1(A, J, B);
  return {
    matchingDenyRules: Z,
    matchingAskRules: Y,
    matchingAllowRules: W
  }
}
// @from(Start 8542828, End 8543639)
function rA2(A, Q, B, G) {
  let Z = io1(A, Q);
  if (Z.behavior !== "passthrough") return Z;
  let I = oA2(A, Q, G);
  if (I.behavior === "deny" || I.behavior === "ask") return I;
  if (!Y0(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let J = kl(A.command);
    if (J.behavior !== "passthrough") {
      let W = {
        type: "other",
        reason: J.behavior === "ask" && J.message ? J.message : "This command contains patterns that could pose security risks and requires approval"
      };
      return {
        behavior: "ask",
        message: yV(D9.name, W),
        decisionReason: W,
        suggestions: []
      }
    }
  }
  if (I.behavior === "allow") return I;
  let Y = B?.commandPrefix ? S05(B.commandPrefix) : do1(A.command);
  return {
    ...I,
    suggestions: Y
  }
}
// @from(Start 8543641, End 8544318)
function k05(A, Q) {
  let B = A.command.trim(),
    {
      matchingDenyRules: G,
      matchingAskRules: Z
    } = lo1(A, Q, "prefix");
  if (G[0] !== void 0) return {
    behavior: "deny",
    message: `Permission to use ${D9.name} with command ${B} has been denied.`,
    decisionReason: {
      type: "rule",
      rule: G[0]
    }
  };
  if (Z[0] !== void 0) return {
    behavior: "ask",
    message: yV(D9.name),
    decisionReason: {
      type: "rule",
      rule: Z[0]
    }
  };
  return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "other",
      reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
    }
  }
}
// @from(Start 8544319, End 8547781)
async function no1(A, Q, B = tA2) {
  let G = await Q.getAppState(),
    Z = JW(A.command);
  if (!Z.success) {
    let N = {
      type: "other",
      reason: `Command contains malformed syntax that cannot be parsed: ${Z.error}`
    };
    return {
      behavior: "ask",
      decisionReason: N,
      message: yV(D9.name, N)
    }
  }
  if (nQ.isSandboxingEnabled() && nQ.isAutoAllowBashIfSandboxedEnabled() && WIA(A) && G.toolPermissionContext.mode === "acceptEdits") {
    let N = k05(A, G.toolPermissionContext);
    if (N.behavior !== "passthrough") return N
  }
  let I = io1(A, G.toolPermissionContext);
  if (I.behavior === "deny") return I;
  let Y = await yA2(A, (N) => no1(N, Q, B));
  if (Y.behavior !== "passthrough") return Y;
  let J = lF(A.command).filter((N) => {
      if (N === `cd ${W0()}`) return !1;
      return !0
    }),
    W = J.filter((N) => N.startsWith("cd "));
  if (W.length > 1) {
    let N = {
      type: "other",
      reason: "Multiple directory changes in one command require approval for clarity"
    };
    return {
      behavior: "ask",
      decisionReason: N,
      message: yV(D9.name, N)
    }
  }
  let X = W.length > 0;
  G = await Q.getAppState();
  let V = J.map((N) => {
    let R = _05(N, G.toolPermissionContext);
    if (R !== null) return R;
    return oA2({
      command: N
    }, G.toolPermissionContext, X)
  });
  if (V.find((N) => N.behavior === "deny") !== void 0) return {
    behavior: "deny",
    message: `Permission to use ${D9.name} with command ${A.command} has been denied.`,
    decisionReason: {
      type: "subcommandResults",
      reasons: new Map(V.map((N, R) => [J[R], N]))
    }
  };
  let K = fo1(A, W0(), G.toolPermissionContext, X);
  if (K.behavior !== "passthrough") return K;
  let D = V.find((N) => N.behavior === "ask");
  if (D !== void 0) return D;
  if (I.behavior === "allow") return I;
  let H = Y0(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? !1 : J.some((N) => kl(N).behavior !== "passthrough");
  if (V.every((N) => N.behavior === "allow") && !H) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: new Map(V.map((N, R) => [J[R], N]))
    }
  };
  let C = await B(A.command, Q.abortController.signal, Q.options.isNonInteractiveSession);
  if (Q.abortController.signal.aborted) throw new WW;
  if (G = await Q.getAppState(), J.length === 1) return rA2({
    command: J[0]
  }, G.toolPermissionContext, C, X);
  let E = new Map;
  for (let N of J) E.set(N, rA2({
    ...A,
    command: N
  }, G.toolPermissionContext, C?.subcommandPrefixes.get(N), X));
  if (J.every((N) => {
      return E.get(N)?.behavior === "allow"
    })) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: E
    }
  };
  let U = new Map;
  for (let N of E.values())
    if (N.behavior === "ask" || N.behavior === "passthrough") {
      let R = "suggestions" in N ? N.suggestions : void 0,
        T = z9A(R);
      for (let y of T) {
        let v = B3(y);
        U.set(v, y)
      }
    } let q = {
      type: "subcommandResults",
      reasons: E
    },
    w = U.size > 0 ? [{
      type: "addRules",
      rules: Array.from(U.values()),
      behavior: "allow",
      destination: "localSettings"
    }] : void 0;
  return {
    behavior: "passthrough",
    message: yV(D9.name, q),
    decisionReason: q,
    suggestions: w
  }
}
// @from(Start 8547786, End 8547849)
co1 = (A) => {
    return A.match(/^(.+):\*$/)?.[1] ?? null
  }
// @from(Start 8547853, End 8548799)
io1 = (A, Q) => {
    let B = A.command.trim(),
      {
        matchingDenyRules: G,
        matchingAskRules: Z,
        matchingAllowRules: I
      } = lo1(A, Q, "exact");
    if (G[0] !== void 0) return {
      behavior: "deny",
      message: `Permission to use ${D9.name} with command ${B} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: G[0]
      }
    };
    if (Z[0] !== void 0) return {
      behavior: "ask",
      message: yV(D9.name),
      decisionReason: {
        type: "rule",
        rule: Z[0]
      }
    };
    if (I[0] !== void 0) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "rule",
        rule: I[0]
      }
    };
    let Y = {
      type: "other",
      reason: "This command requires approval"
    };
    return {
      behavior: "passthrough",
      message: yV(D9.name, Y),
      decisionReason: Y,
      suggestions: do1(B)
    }
  }
// @from(Start 8548803, End 8550289)
oA2 = (A, Q, B) => {
    let G = A.command.trim(),
      Z = io1(A, Q);
    if (Z.behavior === "deny" || Z.behavior === "ask") return Z;
    let {
      matchingDenyRules: I,
      matchingAskRules: Y,
      matchingAllowRules: J
    } = lo1(A, Q, "prefix");
    if (I[0] !== void 0) return {
      behavior: "deny",
      message: `Permission to use ${D9.name} with command ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: I[0]
      }
    };
    if (Y[0] !== void 0) return {
      behavior: "ask",
      message: yV(D9.name),
      decisionReason: {
        type: "rule",
        rule: Y[0]
      }
    };
    let W = fo1(A, W0(), Q, B);
    if (W.behavior !== "passthrough") return W;
    if (Z.behavior === "allow") return Z;
    if (J[0] !== void 0) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "rule",
        rule: J[0]
      }
    };
    let X = nA2(A, Q);
    if (X.behavior !== "passthrough") return X;
    let V = cA2(A, Q);
    if (V.behavior !== "passthrough") return V;
    if (D9.isReadOnly(A)) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "other",
        reason: "Read-only command is allowed"
      }
    };
    let F = {
      type: "other",
      reason: "This command requires approval"
    };
    return {
      behavior: "passthrough",
      message: yV(D9.name, F),
      decisionReason: F,
      suggestions: do1(G)
    }
  }
// @from(Start 8550295, End 8550445)
ao1 = L(() => {
  pF();
  $J();
  F01();
  bU();
  dK();
  RZ();
  U2();
  cK();
  AZ();
  xA2();
  hQ();
  dA2();
  bU();
  pA2();
  uo1();
  dH()
})
// @from(Start 8550448, End 8550765)
function Q12(A, Q) {
  switch (Q) {
    case "none":
      return !1;
    case "number":
      return /^\d+$/.test(A);
    case "string":
      return !0;
    case "char":
      return A.length === 1;
    case "{}":
      return A === "{}";
    case "EOF":
      return A === "EOF";
    default:
      return !1
  }
}
// @from(Start 8550767, End 8553875)
function x05(A) {
  let Q = JW(A, (W) => `$${W}`);
  if (!Q.success) return !1;
  let B = Q.tokens.map((W) => {
    if (typeof W !== "string") {
      if (W = W, W.op === "glob") return W.pattern
    }
    return W
  });
  if (B.some((W) => typeof W !== "string")) return !1;
  let Z = B;
  if (Z.length === 0) return !1;
  let I, Y = 0;
  for (let [W] of Object.entries(A12)) {
    let X = W.split(" ");
    if (Z.length >= X.length) {
      let V = !0;
      for (let F = 0; F < X.length; F++)
        if (Z[F] !== X[F]) {
          V = !1;
          break
        } if (V) {
        I = A12[W], Y = X.length;
        break
      }
    }
  }
  if (!I) return !1;
  if (Z[0] === "git" && Z[1] === "ls-remote")
    for (let W = 2; W < Z.length; W++) {
      let X = Z[W];
      if (X && !X.startsWith("-")) {
        if (X.includes("://")) return !1;
        if (X.includes("@") || X.includes(":")) return !1;
        if (X.includes("$")) return !1
      }
    }
  let J = Y;
  while (J < Z.length) {
    let W = Z[J];
    if (!W) {
      J++;
      continue
    }
    if (Z[0] === "xargs" && (!W.startsWith("-") || W === "--")) {
      if (W === "--" && J + 1 < Z.length) J++, W = Z[J];
      if (W && y05.includes(W)) break;
      return !1
    }
    if (W === "--") {
      J++;
      break
    }
    if (W.startsWith("-") && W.length > 1 && eA2.test(W)) {
      let [X, ...V] = W.split("="), F = V.join("=");
      if (!X) return !1;
      let K = I.safeFlags[X];
      if (!K) {
        if (Z[0] === "git" && X.match(/^-\d+$/)) {
          J++;
          continue
        }
        if ((Z[0] === "grep" || Z[0] === "rg") && X.startsWith("-") && !X.startsWith("--") && X.length > 2) {
          let D = X.substring(0, 2),
            H = X.substring(2);
          if (I.safeFlags[D] && /^\d+$/.test(H)) {
            let C = I.safeFlags[D];
            if (C === "number" || C === "string")
              if (Q12(H, C)) {
                J++;
                continue
              } else return !1
          }
        }
        if (X.startsWith("-") && !X.startsWith("--") && X.length > 2) {
          for (let D = 1; D < X.length; D++) {
            let H = "-" + X[D];
            if (!I.safeFlags[H]) return !1
          }
          J++;
          continue
        } else return !1
      }
      if (K === "none") {
        if (F) return !1;
        J++
      } else {
        let D;
        if (F) D = F, J++;
        else {
          if (J + 1 >= Z.length || Z[J + 1] && Z[J + 1].startsWith("-") && Z[J + 1].length > 1 && eA2.test(Z[J + 1])) return !1;
          D = Z[J + 1] || "", J += 2
        }
        if (K === "string" && D.startsWith("-"))
          if (X === "--sort" && Z[0] === "git" && D.match(/^-[a-zA-Z]/));
          else return !1;
        if (!Q12(D, K)) return !1
      }
    } else J++
  }
  if (I.regex && !I.regex.test(A)) return !1;
  if (!I.regex && /`/.test(A)) return !1;
  if (!I.regex && (Z[0] === "rg" || Z[0] === "grep") && /[\n\r]/.test(A)) return !1;
  if (I.additionalCommandIsDangerousCallback && I.additionalCommandIsDangerousCallback(A)) return !1;
  return !0
}
// @from(Start 8553877, End 8553957)
function v05(A) {
  return new RegExp(`^${A}(?:\\s|$)[^<>()$\`|{}&;\\n\\r]*$`)
}
// @from(Start 8553959, End 8554510)
function O01(A) {
  if (dQ() !== "windows") return !1;
  if (/\\\\[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?\\/i.test(A)) return !0;
  if (/\/\/[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?\//i.test(A)) return !0;
  if (/@SSL@\d+/i.test(A) || /@\d+@SSL/i.test(A)) return !0;
  if (/DavWWWRoot/i.test(A)) return !0;
  if (/^\\\\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A) || /^\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A)) return !0;
  if (/^\\\\(\[[\da-fA-F:]+\])[\\/]/.test(A) || /^\/\/(\[[\da-fA-F:]+\])[\\/]/.test(A)) return !0;
  return !1
}
// @from(Start 8554512, End 8554939)
function h05(A) {
  let Q = !1,
    B = !1,
    G = !1;
  for (let Z = 0; Z < A.length; Z++) {
    let I = A[Z];
    if (G) {
      G = !1;
      continue
    }
    if (I === "\\") {
      G = !0;
      continue
    }
    if (I === "'" && !B) {
      Q = !Q;
      continue
    }
    if (I === '"' && !Q) {
      B = !B;
      continue
    }
    if (Q || B) continue;
    if (I && /[?*[\]]/.test(I)) return !0
  }
  return !1
}
// @from(Start 8554941, End 8555391)
function g05(A) {
  let Q = A.trim();
  if (Q.endsWith(" 2>&1")) Q = Q.slice(0, -5).trim();
  if (O01(Q)) return !1;
  if (h05(Q)) return !1;
  if (x05(Q)) return !0;
  for (let B of f05)
    if (B.test(Q)) {
      if (Q.includes("git") && /\s-c[\s=]/.test(Q)) return !1;
      if (Q.includes("git") && /\s--exec-path[\s=]/.test(Q)) return !1;
      if (Q.includes("git") && /\s--config-env[\s=]/.test(Q)) return !1;
      return !0
    } return !1
}
// @from(Start 8555393, End 8556188)
function B12(A) {
  let {
    command: Q
  } = A;
  if (!JW(Q, (Z) => `$${Z}`).success) return {
    behavior: "passthrough",
    message: "Command cannot be parsed, requires further permission checks"
  };
  if (kl(Q).behavior !== "passthrough") return {
    behavior: "passthrough",
    message: "Command is not read-only, requires further permission checks"
  };
  if (O01(Q)) return {
    behavior: "ask",
    message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
  };
  if (lF(Q).every((Z) => {
      if (kl(Z).behavior !== "passthrough") return !1;
      return g05(Z)
    })) return {
    behavior: "allow",
    updatedInput: A
  };
  return {
    behavior: "passthrough",
    message: "Command is not read-only, requires further permission checks"
  }
}
// @from(Start 8556193, End 8556196)
eA2
// @from(Start 8556198, End 8556201)
A12
// @from(Start 8556203, End 8556206)
y05
// @from(Start 8556208, End 8556211)
b05
// @from(Start 8556213, End 8556216)
f05
// @from(Start 8556222, End 8577163)
to1 = L(() => {
  bU();
  dK();
  F01();
  uo1();
  Q3();
  eA2 = /^-[a-zA-Z0-9_-]/, A12 = {
    xargs: {
      safeFlags: {
        "-I": "{}",
        "-i": "none",
        "-n": "number",
        "-P": "number",
        "-L": "number",
        "-s": "number",
        "-E": "EOF",
        "-e": "EOF",
        "-0": "none",
        "-t": "none",
        "-r": "none",
        "-x": "none",
        "-d": "char"
      }
    },
    "git diff": {
      safeFlags: {
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--dirstat": "none",
        "--summary": "none",
        "--patch-with-stat": "none",
        "--name-only": "none",
        "--name-status": "none",
        "--color": "none",
        "--no-color": "none",
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--color-words": "none",
        "--no-renames": "none",
        "--no-ext-diff": "none",
        "--check": "none",
        "--ws-error-highlight": "string",
        "--full-index": "none",
        "--binary": "none",
        "--abbrev": "number",
        "--break-rewrites": "none",
        "--find-renames": "none",
        "--find-copies": "none",
        "--find-copies-harder": "none",
        "--irreversible-delete": "none",
        "--diff-algorithm": "string",
        "--histogram": "none",
        "--patience": "none",
        "--minimal": "none",
        "--ignore-space-at-eol": "none",
        "--ignore-space-change": "none",
        "--ignore-all-space": "none",
        "--ignore-blank-lines": "none",
        "--inter-hunk-context": "number",
        "--function-context": "none",
        "--exit-code": "none",
        "--quiet": "none",
        "--cached": "none",
        "--staged": "none",
        "--pickaxe-regex": "none",
        "--pickaxe-all": "none",
        "--no-index": "none",
        "--relative": "string",
        "--diff-filter": "string",
        "-p": "none",
        "-u": "none",
        "-s": "none",
        "-M": "none",
        "-C": "none",
        "-B": "none",
        "-D": "none",
        "-l": "none",
        "-S": "none",
        "-G": "none",
        "-O": "none",
        "-R": "none"
      }
    },
    "git log": {
      safeFlags: {
        "--oneline": "none",
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--name-only": "none",
        "--name-status": "none",
        "--graph": "none",
        "--color": "none",
        "--no-color": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--abbrev-commit": "none",
        "--full-history": "none",
        "--dense": "none",
        "--sparse": "none",
        "--simplify-merges": "none",
        "--ancestry-path": "none",
        "--date": "string",
        "--relative-date": "none",
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none",
        "--first-parent": "none",
        "--merges": "none",
        "--no-merges": "none",
        "--reverse": "none",
        "--walk-reflogs": "none",
        "--grep": "string",
        "--author": "string",
        "--committer": "string",
        "--since": "string",
        "--after": "string",
        "--until": "string",
        "--before": "string",
        "--max-count": "number",
        "--skip": "number",
        "--max-age": "number",
        "--min-age": "number",
        "--no-min-parents": "none",
        "--no-max-parents": "none",
        "--follow": "none",
        "--patch": "none",
        "-p": "none",
        "--no-patch": "none",
        "--no-ext-diff": "none",
        "-s": "none",
        "--pretty": "string",
        "--format": "string",
        "--diff-filter": "string",
        "-n": "number",
        "-S": "string",
        "-G": "string",
        "--pickaxe-regex": "none",
        "--pickaxe-all": "none"
      }
    },
    "git show": {
      safeFlags: {
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--name-only": "none",
        "--name-status": "none",
        "--color": "none",
        "--no-color": "none",
        "--abbrev-commit": "none",
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--date": "string",
        "--relative-date": "none",
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--color-words": "none",
        "--no-patch": "none",
        "--no-ext-diff": "none",
        "--patch": "none",
        "--pretty": "string",
        "--first-parent": "none",
        "--diff-filter": "string",
        "-s": "none",
        "-p": "none",
        "-m": "none",
        "--quiet": "none"
      }
    },
    "git reflog": {
      safeFlags: {
        "--date": "string",
        "--relative-date": "none",
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none",
        "--grep": "string",
        "--author": "string",
        "--committer": "string",
        "--since": "string",
        "--after": "string",
        "--until": "string",
        "--before": "string",
        "--max-count": "number",
        "-n": "number",
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none"
      }
    },
    "git stash list": {
      safeFlags: {
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--date": "string",
        "--relative-date": "none",
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none",
        "--max-count": "number",
        "-n": "number"
      }
    },
    "git ls-remote": {
      safeFlags: {
        "--branches": "none",
        "-b": "none",
        "--tags": "none",
        "-t": "none",
        "--heads": "none",
        "-h": "none",
        "--refs": "none",
        "--quiet": "none",
        "-q": "none",
        "--exit-code": "none",
        "--get-url": "none",
        "--symref": "none",
        "--sort": "string",
        "--server-option": "string",
        "-o": "string"
      }
    },
    file: {
      safeFlags: {
        "--brief": "none",
        "-b": "none",
        "--mime": "none",
        "-i": "none",
        "--mime-type": "none",
        "--mime-encoding": "none",
        "--apple": "none",
        "--check-encoding": "none",
        "-c": "none",
        "--exclude": "string",
        "--exclude-quiet": "string",
        "--print0": "none",
        "-0": "none",
        "-f": "string",
        "-F": "string",
        "--separator": "string",
        "--help": "none",
        "--version": "none",
        "-v": "none",
        "--no-dereference": "none",
        "-h": "none",
        "--dereference": "none",
        "-L": "none",
        "--magic-file": "string",
        "-m": "string",
        "--keep-going": "none",
        "-k": "none",
        "--list": "none",
        "-l": "none",
        "--no-buffer": "none",
        "-n": "none",
        "--preserve-date": "none",
        "-p": "none",
        "--raw": "none",
        "-r": "none",
        "-s": "none",
        "--special-files": "none",
        "--uncompress": "none",
        "-z": "none"
      }
    },
    sed: {
      safeFlags: {
        "--expression": "string",
        "-e": "string",
        "--quiet": "none",
        "--silent": "none",
        "-n": "none",
        "--regexp-extended": "none",
        "-r": "none",
        "--posix": "none",
        "-E": "none",
        "--line-length": "number",
        "-l": "number",
        "--zero-terminated": "none",
        "-z": "none",
        "--separate": "none",
        "-s": "none",
        "--unbuffered": "none",
        "-u": "none",
        "--debug": "none",
        "--help": "none",
        "--version": "none"
      },
      additionalCommandIsDangerousCallback: (A) => !go1(A)
    },
    "pip list": {
      safeFlags: {
        "--outdated": "none",
        "-o": "none",
        "--uptodate": "none",
        "-u": "none",
        "--editable": "none",
        "-e": "none",
        "--local": "none",
        "-l": "none",
        "--user": "none",
        "--pre": "none",
        "--format": "string",
        "--not-required": "none",
        "--exclude-editable": "none",
        "--include-editable": "none",
        "--exclude": "string",
        "--help": "none",
        "-h": "none",
        "--version": "none",
        "-V": "none",
        "--verbose": "none",
        "-v": "none",
        "--quiet": "none",
        "-q": "none",
        "--no-color": "none",
        "--no-input": "none",
        "--disable-pip-version-check": "none",
        "--no-python-version-warning": "none"
      }
    },
    sort: {
      safeFlags: {
        "--ignore-leading-blanks": "none",
        "-b": "none",
        "--dictionary-order": "none",
        "-d": "none",
        "--ignore-case": "none",
        "-f": "none",
        "--general-numeric-sort": "none",
        "-g": "none",
        "--human-numeric-sort": "none",
        "-h": "none",
        "--ignore-nonprinting": "none",
        "-i": "none",
        "--month-sort": "none",
        "-M": "none",
        "--numeric-sort": "none",
        "-n": "none",
        "--random-sort": "none",
        "-R": "none",
        "--reverse": "none",
        "-r": "none",
        "--sort": "string",
        "--stable": "none",
        "-s": "none",
        "--unique": "none",
        "-u": "none",
        "--version-sort": "none",
        "-V": "none",
        "--zero-terminated": "none",
        "-z": "none",
        "--key": "string",
        "-k": "string",
        "--field-separator": "string",
        "-t": "string",
        "--check": "none",
        "-c": "none",
        "--check-char-order": "none",
        "-C": "none",
        "--merge": "none",
        "-m": "none",
        "--buffer-size": "string",
        "-S": "string",
        "--parallel": "number",
        "--batch-size": "number",
        "--help": "none",
        "--version": "none"
      }
    },
    man: {
      safeFlags: {
        "-a": "none",
        "--all": "none",
        "-d": "none",
        "-f": "none",
        "--whatis": "none",
        "-h": "none",
        "-k": "none",
        "--apropos": "none",
        "-l": "string",
        "-w": "none",
        "-S": "string",
        "-s": "string"
      }
    },
    "npm list": {
      safeFlags: {
        "--all": "none",
        "-a": "none",
        "--json": "none",
        "--long": "none",
        "-l": "none",
        "--global": "none",
        "-g": "none",
        "--depth": "number",
        "--omit": "string",
        "--include": "string",
        "--link": "none",
        "--workspace": "string",
        "-w": "string",
        "--workspaces": "none",
        "-ws": "none"
      }
    },
    "mcp-cli servers": {
      safeFlags: {
        "--json": "none"
      }
    },
    "mcp-cli tools": {
      safeFlags: {
        "--json": "none"
      }
    },
    "mcp-cli info": {
      safeFlags: {
        "--json": "none"
      }
    },
    "mcp-cli grep": {
      safeFlags: {
        "--json": "none",
        "-i": "none",
        "--ignore-case": "none"
      }
    },
    "mcp-cli resources": {
      safeFlags: {
        "--json": "none"
      }
    },
    "mcp-cli read": {
      safeFlags: {
        "--json": "none"
      }
    },
    netstat: {
      safeFlags: {
        "-a": "none",
        "-L": "none",
        "-l": "none",
        "-n": "none",
        "-f": "string",
        "-g": "none",
        "-i": "none",
        "-I": "string",
        "-s": "none",
        "-r": "none",
        "-m": "none",
        "-v": "none"
      }
    },
    ps: {
      safeFlags: {
        "-e": "none",
        "-A": "none",
        "-a": "none",
        "-d": "none",
        "-N": "none",
        "--deselect": "none",
        "-f": "none",
        "-F": "none",
        "-l": "none",
        "-j": "none",
        "-y": "none",
        "-w": "none",
        "-ww": "none",
        "--width": "number",
        "-c": "none",
        "-H": "none",
        "--forest": "none",
        "--headers": "none",
        "--no-headers": "none",
        "-n": "string",
        "--sort": "string",
        "-L": "none",
        "-T": "none",
        "-m": "none",
        "-C": "string",
        "-G": "string",
        "-g": "string",
        "-p": "string",
        "--pid": "string",
        "-q": "string",
        "--quick-pid": "string",
        "-s": "string",
        "--sid": "string",
        "-t": "string",
        "--tty": "string",
        "-U": "string",
        "-u": "string",
        "--user": "string",
        "--help": "none",
        "--info": "none",
        "-V": "none",
        "--version": "none"
      },
      additionalCommandIsDangerousCallback: (A) => {
        return /\s[a-zA-Z]*e[a-zA-Z]*(?:\s|$)/.test(A)
      }
    },
    base64: {
      safeFlags: {
        "-d": "none",
        "-D": "none",
        "--decode": "none",
        "-b": "number",
        "--break": "number",
        "-w": "number",
        "--wrap": "number",
        "-i": "string",
        "--input": "string",
        "--ignore-garbage": "none",
        "-h": "none",
        "--help": "none",
        "--version": "none"
      }
    },
    grep: {
      safeFlags: {
        "-e": "string",
        "--regexp": "string",
        "-f": "string",
        "--file": "string",
        "-F": "none",
        "--fixed-strings": "none",
        "-G": "none",
        "--basic-regexp": "none",
        "-E": "none",
        "--extended-regexp": "none",
        "-P": "none",
        "--perl-regexp": "none",
        "-i": "none",
        "--ignore-case": "none",
        "--no-ignore-case": "none",
        "-v": "none",
        "--invert-match": "none",
        "-w": "none",
        "--word-regexp": "none",
        "-x": "none",
        "--line-regexp": "none",
        "-c": "none",
        "--count": "none",
        "--color": "string",
        "--colour": "string",
        "-L": "none",
        "--files-without-match": "none",
        "-l": "none",
        "--files-with-matches": "none",
        "-m": "number",
        "--max-count": "number",
        "-o": "none",
        "--only-matching": "none",
        "-q": "none",
        "--quiet": "none",
        "--silent": "none",
        "-s": "none",
        "--no-messages": "none",
        "-b": "none",
        "--byte-offset": "none",
        "-H": "none",
        "--with-filename": "none",
        "-h": "none",
        "--no-filename": "none",
        "--label": "string",
        "-n": "none",
        "--line-number": "none",
        "-T": "none",
        "--initial-tab": "none",
        "-u": "none",
        "--unix-byte-offsets": "none",
        "-Z": "none",
        "--null": "none",
        "-z": "none",
        "--null-data": "none",
        "-A": "number",
        "--after-context": "number",
        "-B": "number",
        "--before-context": "number",
        "-C": "number",
        "--context": "number",
        "--group-separator": "string",
        "--no-group-separator": "none",
        "-a": "none",
        "--text": "none",
        "--binary-files": "string",
        "-D": "string",
        "--devices": "string",
        "-d": "string",
        "--directories": "string",
        "--exclude": "string",
        "--exclude-from": "string",
        "--exclude-dir": "string",
        "--include": "string",
        "-r": "none",
        "--recursive": "none",
        "-R": "none",
        "--dereference-recursive": "none",
        "--line-buffered": "none",
        "-U": "none",
        "--binary": "none",
        "--help": "none",
        "-V": "none",
        "--version": "none"
      }
    },
    rg: {
      safeFlags: {
        "-e": "string",
        "--regexp": "string",
        "-f": "string",
        "-i": "none",
        "--ignore-case": "none",
        "-S": "none",
        "--smart-case": "none",
        "-F": "none",
        "--fixed-strings": "none",
        "-w": "none",
        "--word-regexp": "none",
        "-v": "none",
        "--invert-match": "none",
        "-c": "none",
        "--count": "none",
        "-l": "none",
        "--files-with-matches": "none",
        "--files-without-match": "none",
        "-n": "none",
        "--line-number": "none",
        "-o": "none",
        "--only-matching": "none",
        "-A": "number",
        "--after-context": "number",
        "-B": "number",
        "--before-context": "number",
        "-C": "number",
        "--context": "number",
        "-H": "none",
        "-h": "none",
        "--heading": "none",
        "--no-heading": "none",
        "-q": "none",
        "--quiet": "none",
        "--column": "none",
        "-g": "string",
        "--glob": "string",
        "-t": "string",
        "--type": "string",
        "-T": "string",
        "--type-not": "string",
        "--type-list": "none",
        "--hidden": "none",
        "--no-ignore": "none",
        "-u": "none",
        "-m": "number",
        "--max-count": "number",
        "-d": "number",
        "--max-depth": "number",
        "-a": "none",
        "--text": "none",
        "-z": "none",
        "-L": "none",
        "--follow": "none",
        "--color": "string",
        "--json": "none",
        "--stats": "none",
        "--help": "none",
        "--version": "none",
        "--debug": "none",
        "--": "none"
      }
    },
    sha256sum: {
      safeFlags: {
        "-b": "none",
        "--binary": "none",
        "-t": "none",
        "--text": "none",
        "-c": "none",
        "--check": "none",
        "--ignore-missing": "none",
        "--quiet": "none",
        "--status": "none",
        "--strict": "none",
        "-w": "none",
        "--warn": "none",
        "--tag": "none",
        "-z": "none",
        "--zero": "none",
        "--help": "none",
        "--version": "none"
      }
    },
    sha1sum: {
      safeFlags: {
        "-b": "none",
        "--binary": "none",
        "-t": "none",
        "--text": "none",
        "-c": "none",
        "--check": "none",
        "--ignore-missing": "none",
        "--quiet": "none",
        "--status": "none",
        "--strict": "none",
        "-w": "none",
        "--warn": "none",
        "--tag": "none",
        "-z": "none",
        "--zero": "none",
        "--help": "none",
        "--version": "none"
      }
    },
    md5sum: {
      safeFlags: {
        "-b": "none",
        "--binary": "none",
        "-t": "none",
        "--text": "none",
        "-c": "none",
        "--check": "none",
        "--ignore-missing": "none",
        "--quiet": "none",
        "--status": "none",
        "--strict": "none",
        "-w": "none",
        "--warn": "none",
        "--tag": "none",
        "-z": "none",
        "--zero": "none",
        "--help": "none",
        "--version": "none"
      }
    }
  }, y05 = ["echo", "printf", "wc", "grep", "head", "tail"];
  b05 = ["date", "cal", "uptime", "head", "tail", "wc", "stat", "strings", "hexdump", "od", "nl", "id", "uname", "free", "df", "du", "locale", "hostname", "groups", "nproc", "docker ps", "docker images", "info", "help", "basename", "dirname", "realpath", "cut", "tr", "column", "diff", "true", "false", "sleep", "which", "type"], f05 = new Set([...b05.map(v05), /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/, /^claude -h$/, /^claude --help$/, /^git status(?:\s|$)[^<>()$`|{}&;\n\r]*$/, /^git blame(?:\s|$)[^<>()$`|{}&;\n\r]*$/, /^git ls-files(?:\s|$)[^<>()$`|{}&;\n\r]*$/, /^git config --get[^<>()$`|{}&;\n\r]*$/, /^git remote -v$/, /^git remote show\s+[a-zA-Z0-9_-]+$/, /^git tag$/, /^git tag -l[^<>()$`|{}&;\n\r]*$/, /^git branch$/, /^git branch (?:-v|-vv|--verbose)$/, /^git branch (?:-a|--all)$/, /^git branch (?:-r|--remotes)$/, /^git branch (?:-l|--list)(?:\s+".*"|'[^']*')?$/, /^git branch (?:--color|--no-color|--column|--no-column)$/, /^git branch --sort=\S+$/, /^git branch --show-current$/, /^git branch (?:--contains|--no-contains)\s+\S+$/, /^git branch (?:--merged|--no-merged)(?:\s+\S+)?$/, /^uniq(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?|-[fsw]\s+\d+))*(?:\s|$)\s*$/, /^pwd$/, /^whoami$/, /^node -v$/, /^npm -v$/, /^python --version$/, /^python3 --version$/, /^tree$/, /^history(?:\s+\d+)?\s*$/, /^alias$/, /^arch(?:\s+(?:--help|-h))?\s*$/, /^ip addr$/, /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/, /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path))(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?))*(?:\s+'[^'`]*'|\s+"[^"`]*"|\s+[^-\s'"][^\s]*)+\s*$/, /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/, /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/, /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/])
})
// @from(Start 8577169, End 8577186)
hl = "2025-06-18"
// @from(Start 8577190, End 8577193)
R01
// @from(Start 8577195, End 8577206)
T01 = "2.0"
// @from(Start 8577210, End 8577213)
G12
// @from(Start 8577215, End 8577218)
Z12
// @from(Start 8577220, End 8577223)
u05
// @from(Start 8577225, End 8577227)
fM
// @from(Start 8577229, End 8577231)
hU
// @from(Start 8577233, End 8577236)
rNA
// @from(Start 8577238, End 8577240)
Lk
// @from(Start 8577242, End 8577244)
hM
// @from(Start 8577246, End 8577249)
P01
// @from(Start 8577251, End 8577254)
I12
// @from(Start 8577256, End 8577293)
j01 = (A) => I12.safeParse(A).success
// @from(Start 8577297, End 8577300)
Y12
// @from(Start 8577302, End 8577339)
J12 = (A) => Y12.safeParse(A).success
// @from(Start 8577343, End 8577346)
W12
// @from(Start 8577348, End 8577385)
oNA = (A) => W12.safeParse(A).success
// @from(Start 8577389, End 8577391)
LE
// @from(Start 8577393, End 8577396)
X12
// @from(Start 8577398, End 8577435)
V12 = (A) => X12.safeParse(A).success
// @from(Start 8577439, End 8577441)
Mk
// @from(Start 8577443, End 8577445)
Ih
// @from(Start 8577447, End 8577450)
S01
// @from(Start 8577452, End 8577455)
tNA
// @from(Start 8577457, End 8577460)
F12
// @from(Start 8577462, End 8577465)
m05
// @from(Start 8577467, End 8577470)
eo1
// @from(Start 8577472, End 8577475)
d05
// @from(Start 8577477, End 8577480)
At1
// @from(Start 8577482, End 8577485)
_01
// @from(Start 8577487, End 8577524)
K12 = (A) => _01.safeParse(A).success
// @from(Start 8577528, End 8577531)
k01
// @from(Start 8577533, End 8577536)
c05
// @from(Start 8577538, End 8577541)
y01
// @from(Start 8577543, End 8577546)
x01
// @from(Start 8577548, End 8577551)
v01
// @from(Start 8577553, End 8577556)
D12
// @from(Start 8577558, End 8577561)
H12
// @from(Start 8577563, End 8577566)
Qt1
// @from(Start 8577568, End 8577571)
C12
// @from(Start 8577573, End 8577576)
E12
// @from(Start 8577578, End 8577581)
p05
// @from(Start 8577583, End 8577586)
l05
// @from(Start 8577588, End 8577591)
gAA
// @from(Start 8577593, End 8577596)
i05
// @from(Start 8577598, End 8577601)
Bt1
// @from(Start 8577603, End 8577606)
n05
// @from(Start 8577608, End 8577610)
gl
// @from(Start 8577612, End 8577615)
a05
// @from(Start 8577617, End 8577620)
s05
// @from(Start 8577622, End 8577625)
r05
// @from(Start 8577627, End 8577630)
o05
// @from(Start 8577632, End 8577635)
t05
// @from(Start 8577637, End 8577640)
e05
// @from(Start 8577642, End 8577645)
AQ5
// @from(Start 8577647, End 8577650)
eNA
// @from(Start 8577652, End 8577655)
QQ5
// @from(Start 8577657, End 8577660)
Gt1
// @from(Start 8577662, End 8577665)
Zt1
// @from(Start 8577667, End 8577670)
It1
// @from(Start 8577672, End 8577675)
BQ5
// @from(Start 8577677, End 8577680)
GQ5
// @from(Start 8577682, End 8577685)
z12
// @from(Start 8577687, End 8577690)
ZQ5
// @from(Start 8577692, End 8577695)
Yt1
// @from(Start 8577697, End 8577700)
IQ5
// @from(Start 8577702, End 8577705)
YQ5
// @from(Start 8577707, End 8577710)
JQ5
// @from(Start 8577712, End 8577715)
Jt1
// @from(Start 8577717, End 8577720)
ALA
// @from(Start 8577722, End 8577724)
aT
// @from(Start 8577726, End 8577729)
nNG
// @from(Start 8577731, End 8577734)
Wt1
// @from(Start 8577736, End 8577739)
WQ5
// @from(Start 8577741, End 8577744)
U12
// @from(Start 8577746, End 8577749)
XQ5
// @from(Start 8577751, End 8577754)
VQ5
// @from(Start 8577756, End 8577759)
FQ5
// @from(Start 8577761, End 8577764)
KQ5
// @from(Start 8577766, End 8577769)
DQ5
// @from(Start 8577771, End 8577774)
HQ5
// @from(Start 8577776, End 8577779)
Xt1
// @from(Start 8577781, End 8577784)
CQ5
// @from(Start 8577786, End 8577789)
EQ5
// @from(Start 8577791, End 8577794)
zQ5
// @from(Start 8577796, End 8577799)
UQ5
// @from(Start 8577801, End 8577804)
$Q5
// @from(Start 8577806, End 8577809)
$12
// @from(Start 8577811, End 8577814)
Vt1
// @from(Start 8577816, End 8577819)
wQ5
// @from(Start 8577821, End 8577824)
qQ5
// @from(Start 8577826, End 8577829)
NQ5
// @from(Start 8577831, End 8577834)
Ft1
// @from(Start 8577836, End 8577839)
LQ5
// @from(Start 8577841, End 8577844)
Kt1
// @from(Start 8577846, End 8577849)
Dt1
// @from(Start 8577851, End 8577854)
MQ5
// @from(Start 8577856, End 8577859)
aNG
// @from(Start 8577861, End 8577864)
sNG
// @from(Start 8577866, End 8577869)
rNG
// @from(Start 8577871, End 8577874)
oNG
// @from(Start 8577876, End 8577879)
tNG
// @from(Start 8577881, End 8577884)
eNG
// @from(Start 8577886, End 8577888)
ME