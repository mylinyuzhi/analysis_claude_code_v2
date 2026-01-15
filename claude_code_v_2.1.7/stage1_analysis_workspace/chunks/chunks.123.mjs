
// @from(Ln 362113, Col 0)
async function Uq0() {
  try {
    let A = await Wn5();
    if (!A) return {
      hasPermissions: !1,
      npmPrefix: null
    };
    let Q = !1;
    try {
      Yn5(A, Gn5.W_OK), Q = !0
    } catch {
      Q = !1
    }
    if (Q) return {
      hasPermissions: !0,
      npmPrefix: A
    };
    return e(new hK1("Insufficient permissions for global npm install.")), {
      hasPermissions: !1,
      npmPrefix: A
    }
  } catch (A) {
    return e(A), {
      hasPermissions: !1,
      npmPrefix: null
    }
  }
}
// @from(Ln 362141, Col 0)
async function Ht(A) {
  let Q = c9();
  setTimeout(() => Q.abort(), 5000);
  let B = A === "stable" ? "stable" : "latest",
    G = await J2("npm", ["view", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}@${B}`, "version", "--prefer-online"], {
      abortSignal: Q.signal,
      cwd: ebA()
    });
  if (G.code !== 0) {
    if (k(`npm view failed with code ${G.code}`), G.stderr) k(`npm stderr: ${G.stderr.trim()}`);
    else k("npm stderr: (empty)");
    if (G.stdout) k(`npm stdout: ${G.stdout.trim()}`);
    return null
  }
  return G.stdout.trim()
}
// @from(Ln 362157, Col 0)
async function vm2() {
  let A = c9();
  setTimeout(() => A.abort(), 5000);
  let Q = await J2("npm", ["view", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.PACKAGE_URL, "dist-tags", "--json", "--prefer-online"], {
    abortSignal: A.signal,
    cwd: ebA()
  });
  if (Q.code !== 0) return k(`npm view dist-tags failed with code ${Q.code}`), {
    latest: null,
    stable: null
  };
  try {
    let B = AQ(Q.stdout.trim());
    return {
      latest: typeof B.latest === "string" ? B.latest : null,
      stable: typeof B.stable === "string" ? B.stable : null
    }
  } catch (B) {
    return k(`Failed to parse dist-tags: ${B}`), {
      latest: null,
      stable: null
    }
  }
}
// @from(Ln 362188, Col 0)
async function km2() {
  async function A(G) {
    try {
      return (await xQ.get(`${Jn5}/${G}`, {
        timeout: 5000,
        responseType: "text"
      })).data.trim()
    } catch (Z) {
      return k(`Failed to fetch ${G} from GCS: ${Z}`), null
    }
  }
  let [Q, B] = await Promise.all([A("latest"), A("stable")]);
  return {
    latest: Q,
    stable: B
  }
}
// @from(Ln 362205, Col 0)
async function XEA(A) {
  if (!In5()) return e(new hK1("Another process is currently installing an update")), l("tengu_auto_updater_lock_contention", {
    pid: process.pid,
    currentVersion: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION
  }), "in_progress";
  try {
    if (Kn5(), !l0.isRunningWithBun() && l0.isNpmFromWindowsPath()) return e(Error("Windows NPM detected in WSL environment")), l("tengu_auto_updater_windows_npm_in_wsl", {
      currentVersion: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
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
      hasPermissions: Q
    } = await Uq0();
    if (!Q) return "no_permissions";
    let B = A ? `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}@${A}` : {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.PACKAGE_URL,
      G = l0.isRunningWithBun() ? "bun" : "npm",
      Z = await J2(G, ["install", "-g", B], {
        cwd: ebA()
      });
    if (Z.code !== 0) {
      let Y = new hK1(`Failed to install new version of claude: ${Z.stdout} ${Z.stderr}`);
      return e(Y), xm2.captureException(Y), "install_failed"
    }
    return S0((Y) => ({
      ...Y,
      installMethod: "global"
    })), "success"
  } finally {
    Dn5()
  }
}
// @from(Ln 362267, Col 0)
function Kn5() {
  let A = Ft();
  for (let [, Q] of Object.entries(A)) try {
    let B = tbA(Q);
    if (!B) continue;
    let {
      filtered: G,
      hadAlias: Z
    } = kK1(B);
    if (Z) bK1(Q, G), k(`Removed claude alias from ${Q}`)
  } catch (B) {
    k(`Failed to remove alias from ${Q}: ${B}`, {
      level: "error"
    })
  }
}
// @from(Ln 362283, Col 4)
gK1
// @from(Ln 362283, Col 9)
xm2
// @from(Ln 362283, Col 14)
Jn5 = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 362284, Col 2)
hK1
// @from(Ln 362284, Col 7)
Xn5 = 300000
// @from(Ln 362285, Col 4)
bc = w(() => {
  Z0();
  w6();
  iZ();
  GQ();
  T1();
  p3();
  fQ();
  XX();
  t4();
  A0();
  DQ();
  yJ();
  v1();
  GB();
  fK1();
  A0();
  j5();
  gK1 = c(xP(), 1), xm2 = c(Sg(), 1);
  hK1 = class hK1 extends rUA {}
})
// @from(Ln 362307, Col 0)
function uK1() {
  let A = $Q();
  if (A !== "macos" && A !== "linux" && A !== "wsl") return !1;
  let Q = process.execPath || process.argv[0] || "";
  if (Q.includes("/Caskroom/")) return k(`Detected Homebrew cask installation: ${Q}`), !0;
  return !1
}
// @from(Ln 362315, Col 0)
function qq0() {
  if ($Q() !== "windows") return !1;
  let Q = process.execPath || process.argv[0] || "",
    B = [/Microsoft[/\\]WinGet[/\\]Packages/i, /Microsoft[/\\]WinGet[/\\]Links/i];
  for (let G of B)
    if (G.test(Q)) return k(`Detected winget installation: ${Q}`), !0;
  return !1
}
// @from(Ln 362323, Col 4)
IEA
// @from(Ln 362324, Col 4)
mK1 = w(() => {
  c3();
  T1();
  Y9();
  IEA = W0(() => {
    if (uK1()) return "homebrew";
    if (qq0()) return "winget";
    return "unknown"
  })
})
// @from(Ln 362344, Col 0)
function Fn5() {
  let A = process.argv[1] || "",
    Q = process.execPath || process.argv[0] || "";
  if ($Q() === "windows") A = A.split(QfA.sep).join(AfA.sep), Q = Q.split(QfA.sep).join(AfA.sep);
  return [A, Q]
}
// @from(Ln 362350, Col 0)
async function Et() {
  let [A] = Fn5();
  if (LG()) {
    if (uK1() || qq0()) return "package-manager";
    return "native"
  }
  if (Tm2()) return "npm-local";
  if (["/usr/local/lib/node_modules", "/usr/lib/node_modules", "/opt/homebrew/lib/node_modules", "/opt/homebrew/bin", "/usr/local/bin", "/.nvm/versions/node/"].some((Z) => A.includes(Z))) return "npm-global";
  if (A.includes("/npm/") || A.includes("/nvm/")) return "npm-global";
  let B = await e5("npm config get prefix", {
      shell: !0,
      reject: !1
    }),
    G = B.exitCode === 0 ? B.stdout.trim() : null;
  if (G && A.startsWith(G)) return "npm-global";
  return "unknown"
}
// @from(Ln 362367, Col 0)
async function Hn5() {
  if (LG()) {
    let A = await TQ("which", ["claude"]);
    if (A.code === 0 && A.stdout) return A.stdout.trim();
    if (vA().existsSync(_f(t6A(), ".local/bin/claude"))) return _f(t6A(), ".local/bin/claude");
    return "native"
  }
  try {
    return process.argv[0] || "unknown"
  } catch {
    return "unknown"
  }
}
// @from(Ln 362381, Col 0)
function BfA() {
  try {
    if (LG()) return process.execPath || "unknown";
    return process.argv[1] || "unknown"
  } catch {
    return "unknown"
  }
}
// @from(Ln 362389, Col 0)
async function En5() {
  let A = vA(),
    Q = [],
    B = _f(t6A(), ".claude", "local");
  if (kc()) Q.push({
    type: "npm-local",
    path: B
  });
  let G = ["@anthropic-ai/claude-code"];
  if ({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL && {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL !== "@anthropic-ai/claude-code") G.push({
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.PACKAGE_URL);
  let Z = await TQ("npm", ["-g", "config", "get", "prefix"]);
  if (Z.code === 0 && Z.stdout) {
    let X = Z.stdout.trim(),
      I = $Q() === "windows",
      D = I ? _f(X, "claude") : _f(X, "bin", "claude");
    if (A.existsSync(D)) {
      let W = !1;
      try {
        if (A.realpathSync(D).includes("/Caskroom/")) W = uK1()
      } catch {}
      if (!W) Q.push({
        type: "npm-global",
        path: D
      })
    } else
      for (let W of G) {
        let K = I ? _f(X, "node_modules", W) : _f(X, "lib", "node_modules", W);
        if (A.existsSync(K)) Q.push({
          type: "npm-global-orphan",
          path: K
        })
      }
  }
  let Y = _f(t6A(), ".local", "bin", "claude");
  if (A.existsSync(Y)) Q.push({
    type: "native",
    path: Y
  });
  if (L1().installMethod === "native") {
    let X = _f(t6A(), ".local", "share", "claude");
    if (A.existsSync(X) && !Q.some((I) => I.type === "native")) Q.push({
      type: "native",
      path: X
    })
  }
  return Q
}
// @from(Ln 362457, Col 0)
async function zn5(A) {
  let Q = [],
    B = L1();
  if (A === "development") return Q;
  if (A === "native") {
    let J = (process.env.PATH || "").split(Vn5),
      X = t6A(),
      I = _f(X, ".local", "bin"),
      D = I;
    if ($Q() === "windows") D = I.split(QfA.sep).join(AfA.sep);
    if (!J.some((K) => {
        let V = K;
        if ($Q() === "windows") V = K.split(QfA.sep).join(AfA.sep);
        return V === D || K === "~/.local/bin" || K === "$HOME/.local/bin"
      }))
      if ($Q() === "windows") {
        let V = I.split(AfA.sep).join(QfA.sep);
        Q.push({
          issue: `Native installation exists but ${V} is not in your PATH`,
          fix: "Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal."
        })
      } else {
        let V = YEA(),
          H = Ft()[V],
          E = H ? H.replace(t6A(), "~") : "your shell config file";
        Q.push({
          issue: "Native installation exists but ~/.local/bin is not in your PATH",
          fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${E} then open a new terminal or run: source ${E}`
        })
      }
  }
  if (!a1(process.env.DISABLE_INSTALLATION_CHECKS)) {
    if (A === "npm-local" && B.installMethod !== "local") Q.push({
      issue: `Running from local installation but config install method is '${B.installMethod}'`,
      fix: "Consider using native installation: claude install"
    });
    if (A === "native" && B.installMethod !== "native") Q.push({
      issue: `Running native installation but config install method is '${B.installMethod}'`,
      fix: "Run claude install to update configuration"
    })
  }
  if (A === "npm-global" && kc()) Q.push({
    issue: "Local installation exists but not being used",
    fix: "Consider using native installation: claude install"
  });
  let G = Cq0(),
    Z = Sm2();
  if (A === "npm-local") {
    let Y = await TQ("which", ["claude"]);
    if (!(Y.code === 0 && Y.stdout.trim()) && !Z)
      if (G) Q.push({
        issue: "Local installation not accessible",
        fix: `Alias exists but points to invalid target: ${G}. Update alias: alias claude="~/.claude/local/claude"`
      });
      else Q.push({
        issue: "Local installation not accessible",
        fix: 'Create alias: alias claude="~/.claude/local/claude"'
      })
  }
  return Q
}
// @from(Ln 362519, Col 0)
function $n5() {
  if ($Q() !== "linux") return [];
  let A = [],
    Q = XB.getLinuxGlobPatternWarnings();
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
// @from(Ln 362534, Col 0)
async function zt() {
  let A = await Et(),
    Q = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION ? {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION : "unknown",
    B = await Hn5(),
    G = BfA(),
    Z = await En5(),
    Y = await zn5(A);
  if (Y.push(...$n5()), A === "native") {
    let F = Z.filter((E) => E.type === "npm-global" || E.type === "npm-global-orphan" || E.type === "npm-local"),
      H = $Q() === "windows";
    for (let E of F)
      if (E.type === "npm-global") {
        let z = "npm -g uninstall @anthropic-ai/claude-code";
        if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.PACKAGE_URL !== "@anthropic-ai/claude-code") z += ` && npm -g uninstall ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}`;
        Y.push({
          issue: `Leftover npm global installation at ${E.path}`,
          fix: `Run: ${z}`
        })
      } else if (E.type === "npm-global-orphan") Y.push({
      issue: `Orphaned npm global package at ${E.path}`,
      fix: H ? `Run: rmdir /s /q "${E.path}"` : `Run: rm -rf ${E.path}`
    });
    else if (E.type === "npm-local") Y.push({
      issue: `Leftover npm local installation at ${E.path}`,
      fix: H ? `Run: rmdir /s /q "${E.path}"` : `Run: rm -rf ${E.path}`
    })
  }
  let X = L1().installMethod || "not set",
    I = null;
  if (A === "npm-global") {
    if (I = (await Uq0()).hasPermissions, !I && !DXA()) Y.push({
      issue: "Insufficient permissions for auto-updates",
      fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
    })
  }
  let D = Xs0(),
    W = {
      working: D.working ?? !0,
      mode: D.mode,
      systemPath: D.mode === "system" ? D.path : null
    },
    K = A === "package-manager" ? IEA() : void 0;
  return {
    installationType: A,
    version: Q,
    installationPath: B,
    invokedBinary: G,
    configInstallMethod: X,
    autoUpdates: (() => {
      let F = DXA();
      return F ? `disabled (${F})` : "enabled"
    })(),
    hasUpdatePermissions: I,
    multipleInstallations: Z,
    warnings: Y,
    packageManager: K,
    ripgrepStatus: W
  }
}
// @from(Ln 362621, Col 4)
jf = w(() => {
  DQ();
  V2();
  Vt();
  GQ();
  bc();
  fK1();
  c3();
  t4();
  Vq();
  uy();
  NJ();
  fQ();
  mK1()
})
// @from(Ln 362636, Col 4)
Lq0 = {}
// @from(Ln 362650, Col 0)
function Ln5() {
  let A = bm2(Cn5(import.meta.url));
  return bm2(BfA())
}
// @from(Ln 362655, Col 0)
function On5(A) {
  if (!LG() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
  for (let Q of Bun.embeddedFiles) {
    let B = Q.name;
    if (B && B.endsWith(A)) return Q
  }
  return null
}
// @from(Ln 362663, Col 0)
async function fm2(A) {
  let Q = On5(A);
  if (!Q) return null;
  let B = await Q.arrayBuffer();
  return new Uint8Array(B)
}
// @from(Ln 362669, Col 0)
async function Mn5() {
  let A = vA();
  if (LG()) {
    let J = await fm2("tree-sitter.wasm"),
      X = await fm2("tree-sitter-bash.wasm");
    if (J && X) {
      await rbA.init({
        wasmBinary: J
      }), DEA = new rbA, GfA = await yK1.load(X), DEA.setLanguage(GfA), k("tree-sitter: loaded from embedded"), l("tengu_tree_sitter_load", {
        success: !0,
        from_embedded: !0
      });
      return
    }
  }
  let B = Ln5(),
    G = !1,
    Z = G ? dK1(B, "web-tree-sitter", "tree-sitter.wasm") : dK1(B, "tree-sitter.wasm"),
    Y = G ? dK1(B, "tree-sitter-bash", "tree-sitter-bash.wasm") : dK1(B, "tree-sitter-bash.wasm");
  if (!A.existsSync(Z) || !A.existsSync(Y)) {
    k("tree-sitter: WASM files not found"), l("tengu_tree_sitter_load", {
      success: !1
    });
    return
  }
  await rbA.init({
    locateFile: (J) => J.endsWith("tree-sitter.wasm") ? Z : J
  }), DEA = new rbA, GfA = await yK1.load(A.readFileBytesSync(Y)), DEA.setLanguage(GfA), k("tree-sitter: loaded from disk"), l("tengu_tree_sitter_load", {
    success: !0,
    from_embedded: !1
  })
}
// @from(Ln 362701, Col 0)
async function hm2() {
  if (!wq0) wq0 = Mn5();
  await wq0
}
// @from(Ln 362705, Col 0)
async function Rn5(A) {
  if (await hm2(), !A || A.length > Un5 || !DEA || !GfA) return null;
  try {
    let Q = DEA.parse(A),
      B = Q?.rootNode;
    if (!B) return null;
    let G = gm2(B),
      Z = _n5(G);
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
// @from(Ln 362725, Col 0)
function gm2(A) {
  let {
    type: Q,
    children: B,
    parent: G
  } = A;
  if (Nq0.has(Q)) return A;
  if (Q === "variable_assignment" && G) return G.children.find((Z) => Z && Nq0.has(Z.type) && Z.startIndex > A.startIndex) ?? null;
  if (Q === "pipeline" || Q === "redirected_statement") return B.find((Z) => Z && Nq0.has(Z.type)) ?? null;
  for (let Z of B) {
    let Y = Z && gm2(Z);
    if (Y) return Y
  }
  return null
}
// @from(Ln 362741, Col 0)
function _n5(A) {
  if (!A || A.type !== "command") return [];
  let Q = [];
  for (let B of A.children) {
    if (!B) continue;
    if (B.type === "variable_assignment") Q.push(B.text);
    else if (B.type === "command_name" || B.type === "word") break
  }
  return Q
}
// @from(Ln 362752, Col 0)
function jn5(A) {
  if (A.type === "declaration_command") {
    let G = A.children[0];
    return G && qn5.has(G.text) ? [G.text] : []
  }
  let Q = [],
    B = !1;
  for (let G of A.children) {
    if (!G || G.type === "variable_assignment") continue;
    if (G.type === "command_name" || !B && G.type === "word") {
      B = !0, Q.push(G.text);
      continue
    }
    if (Nn5.has(G.type)) Q.push(Tn5(G.text));
    else if (wn5.has(G.type)) break
  }
  return Q
}
// @from(Ln 362771, Col 0)
function Tn5(A) {
  return A.length >= 2 && (A[0] === '"' && A.at(-1) === '"' || A[0] === "'" && A.at(-1) === "'") ? A.slice(1, -1) : A
}
// @from(Ln 362774, Col 4)
Un5 = 1e4
// @from(Ln 362775, Col 2)
qn5
// @from(Ln 362775, Col 7)
Nn5
// @from(Ln 362775, Col 12)
wn5
// @from(Ln 362775, Col 17)
Nq0
// @from(Ln 362775, Col 22)
DEA = null
// @from(Ln 362776, Col 2)
GfA = null
// @from(Ln 362777, Col 2)
wq0 = null
// @from(Ln 362778, Col 4)
Oq0 = w(() => {
  Rm2();
  DQ();
  jf();
  Z0();
  T1();
  qn5 = new Set(["export", "declare", "typeset", "readonly", "local", "unset", "unsetenv"]), Nn5 = new Set(["word", "string", "raw_string", "number"]), wn5 = new Set(["command_substitution", "process_substitution"]), Nq0 = new Set(["command", "declaration_command"])
})
// @from(Ln 362786, Col 0)
class um2 {
  originalCommand;
  constructor(A) {
    this.originalCommand = A
  }
  toString() {
    return this.originalCommand
  }
  getPipeSegments() {
    try {
      let A = ZfA(this.originalCommand),
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
    } = Hx(this.originalCommand);
    return Q.length > 0 ? A : this.originalCommand
  }
  getOutputRedirections() {
    let {
      redirections: A
    } = Hx(this.originalCommand);
    return A
  }
}
// @from(Ln 362825, Col 0)
function Mq0(A, Q) {
  let B = A;
  Q(B);
  for (let G of B.children)
    if (G) Mq0(G, Q)
}
// @from(Ln 362832, Col 0)
function Pn5(A) {
  let Q = [];
  return Mq0(A, (B) => {
    if (B.type === "pipeline") {
      for (let G of B.children)
        if (G && G.type === "|") Q.push(G.startIndex)
    }
  }), Q
}
// @from(Ln 362842, Col 0)
function Sn5(A) {
  let Q = [];
  return Mq0(A, (B) => {
    if (B.type === "file_redirect") {
      let G = B.children,
        Z = G.find((J) => J && (J.type === ">" || J.type === ">>")),
        Y = G.find((J) => J && J.type === "word");
      if (Z && Y) Q.push({
        startIndex: B.startIndex,
        endIndex: B.endIndex,
        target: Y.text,
        operator: Z.type
      })
    }
  }), Q
}
// @from(Ln 362858, Col 0)
class mm2 {
  originalCommand;
  pipePositions;
  redirectionNodes;
  constructor(A, Q, B) {
    this.originalCommand = A, this.pipePositions = Q, this.redirectionNodes = B
  }
  toString() {
    return this.originalCommand
  }
  getPipeSegments() {
    if (this.pipePositions.length === 0) return [this.originalCommand];
    let A = [],
      Q = 0;
    for (let G of this.pipePositions) {
      let Z = this.originalCommand.slice(Q, G).trim();
      if (Z) A.push(Z);
      Q = G + 1
    }
    let B = this.originalCommand.slice(Q).trim();
    if (B) A.push(B);
    return A
  }
  withoutOutputRedirections() {
    if (this.redirectionNodes.length === 0) return this.originalCommand;
    let A = [...this.redirectionNodes].sort((B, G) => G.startIndex - B.startIndex),
      Q = this.originalCommand;
    for (let B of A) Q = Q.slice(0, B.startIndex) + Q.slice(B.endIndex);
    return Q.trim().replace(/\s+/g, " ")
  }
  getOutputRedirections() {
    return this.redirectionNodes.map(({
      target: A,
      operator: Q
    }) => ({
      target: A,
      operator: Q
    }))
  }
}
// @from(Ln 362898, Col 4)
xn5
// @from(Ln 362898, Col 9)
cK1
// @from(Ln 362899, Col 4)
dm2 = w(() => {
  Y9();
  KU();
  xn5 = W0(async () => {
    try {
      let {
        parseCommand: A
      } = await Promise.resolve().then(() => (Oq0(), Lq0)), Q = await A("echo test");
      if (!Q) return !1;
      return Q.tree.delete(), !0
    } catch {
      return !1
    }
  }), cK1 = {
    async parse(A) {
      if (!A) return null;
      if (await xn5()) try {
        let {
          parseCommand: B
        } = await Promise.resolve().then(() => (Oq0(), Lq0)), G = await B(A);
        if (G) {
          let Z = Pn5(G.rootNode),
            Y = Sn5(G.rootNode);
          return G.tree.delete(), new mm2(A, Z, Y)
        }
      } catch {}
      return new um2(A)
    }
  }
})
// @from(Ln 362929, Col 0)
async function yn5(A, Q, B) {
  if (Q.filter((D) => {
      let W = D.trim();
      return YfA.test(W)
    }).length > 1) {
    let D = {
      type: "other",
      reason: "Multiple directory changes in one command require approval for clarity"
    };
    return {
      behavior: "ask",
      decisionReason: D,
      message: YD(o2.name, D)
    }
  }
  let Z = new Map;
  for (let D of Q) {
    let W = D.trim();
    if (!W) continue;
    let K = await B({
      ...A,
      command: W
    });
    Z.set(W, K)
  }
  let Y = Array.from(Z.entries()).find(([, D]) => D.behavior === "deny");
  if (Y) {
    let [D, W] = Y;
    return {
      behavior: "deny",
      message: W.behavior === "deny" ? W.message : `Permission denied for: ${D}`,
      decisionReason: {
        type: "subcommandResults",
        reasons: Z
      }
    }
  }
  if (Array.from(Z.values()).every((D) => D.behavior === "allow")) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: Z
    }
  };
  let X = [];
  for (let [, D] of Z)
    if (D.behavior !== "allow" && "suggestions" in D && D.suggestions) X.push(...D.suggestions);
  let I = {
    type: "subcommandResults",
    reasons: Z
  };
  return {
    behavior: "ask",
    message: YD(o2.name, I),
    decisionReason: I,
    suggestions: X.length > 0 ? X : void 0
  }
}
// @from(Ln 362988, Col 0)
async function vn5(A) {
  if (!A.includes(">")) return A;
  return (await cK1.parse(A))?.withoutOutputRedirections() ?? A
}
// @from(Ln 362992, Col 0)
async function cm2(A, Q) {
  if (lm2(A.command)) {
    let Y = Mf(A.command),
      J = {
        type: "other",
        reason: Y.behavior === "ask" && Y.message ? Y.message : "This command uses shell operators that require approval for safety"
      };
    return {
      behavior: "ask",
      message: YD(o2.name, J),
      decisionReason: J
    }
  }
  let B = await cK1.parse(A.command);
  if (!B) return {
    behavior: "passthrough",
    message: "Failed to parse command"
  };
  let G = B.getPipeSegments();
  if (G.length <= 1) return {
    behavior: "passthrough",
    message: "No pipes found in command"
  };
  let Z = await Promise.all(G.map((Y) => vn5(Y)));
  return yn5(A, Z, Q)
}
// @from(Ln 363018, Col 4)
pm2 = w(() => {
  YK();
  KU();
  YZ();
  PK1();
  dm2()
})
// @from(Ln 363034, Col 0)
function am2(A) {
  let Q = A.length;
  if (Q <= Rq0) return A.map((G) => `'${G}'`).join(", ");
  return `${A.slice(0,Rq0).map((G)=>`'${G}'`).join(", ")}, and ${Q-Rq0} more`
}
// @from(Ln 363040, Col 0)
function bn5(A) {
  let Q = A.match(nm2);
  if (!Q || Q.index === void 0) return A;
  let B = A.substring(0, Q.index),
    G = B.lastIndexOf("/");
  if (G === -1) return ".";
  return B.substring(0, G) || "/"
}
// @from(Ln 363049, Col 0)
function _q0(A, Q, B) {
  let G = B === "read" ? "read" : "edit",
    Z = AE(A, Q, G, "deny");
  if (Z !== null) return {
    allowed: !1,
    decisionReason: {
      type: "rule",
      rule: Z
    }
  };
  if (B !== "read") {
    let J = Sq0(A);
    if (!J.safe) return {
      allowed: !1,
      decisionReason: {
        type: "other",
        reason: J.message
      }
    }
  }
  if (WS(A, Q)) {
    if (B === "read" || Q.mode === "acceptEdits") return {
      allowed: !0
    }
  }
  if (B === "read") {
    let J = xq0(A, {});
    if (J.behavior === "allow") return {
      allowed: !0,
      decisionReason: J.decisionReason
    }
  }
  let Y = AE(A, Q, G, "allow");
  if (Y !== null) return {
    allowed: !0,
    decisionReason: {
      type: "rule",
      rule: Y
    }
  };
  return {
    allowed: !1
  }
}
// @from(Ln 363094, Col 0)
function fn5(A, Q, B, G) {
  if (hGA(A)) {
    let I = pK1(A) ? A : lK1(Q, A),
      {
        resolvedPath: D
      } = xI(vA(), I),
      W = _q0(D, B, G);
    return {
      allowed: W.allowed,
      resolvedPath: D,
      decisionReason: W.decisionReason
    }
  }
  let Z = bn5(A),
    Y = pK1(Z) ? Z : lK1(Q, Z),
    {
      resolvedPath: J
    } = xI(vA(), Y),
    X = _q0(J, B, G);
  return {
    allowed: X.allowed,
    resolvedPath: J,
    decisionReason: X.decisionReason
  }
}
// @from(Ln 363120, Col 0)
function om2(A) {
  if (A === "~" || A.startsWith("~/")) return jq0() + A.slice(1);
  return A
}
// @from(Ln 363125, Col 0)
function hn5(A) {
  if (A === "*" || A.endsWith("/*")) return !0;
  let Q = A === "/" ? A : A.replace(/\/$/, "");
  if (Q === "/") return !0;
  let B = jq0();
  if (Q === B) return !0;
  if (kn5(Q) === "/") return !0;
  return !1
}
// @from(Ln 363135, Col 0)
function rm2(A, Q, B, G) {
  let Z = om2(A.replace(/^['"]|['"]$/g, ""));
  if (Z.includes("$") || Z.includes("%")) return {
    allowed: !1,
    resolvedPath: Z,
    decisionReason: {
      type: "other",
      reason: "Shell expansion syntax in paths requires manual approval"
    }
  };
  if (nm2.test(Z)) {
    if (G === "write" || G === "create") return {
      allowed: !1,
      resolvedPath: Z,
      decisionReason: {
        type: "other",
        reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
      }
    };
    return fn5(Z, Q, B, G)
  }
  let Y = pK1(Z) ? Z : lK1(Q, Z),
    {
      resolvedPath: J
    } = xI(vA(), Y),
    X = _q0(J, B, G);
  return {
    allowed: X.allowed,
    resolvedPath: J,
    decisionReason: X.decisionReason
  }
}
// @from(Ln 363168, Col 0)
function gn5(A, Q, B) {
  let G = Tq0[A],
    Z = G(Q);
  for (let Y of Z) {
    let J = om2(Y.replace(/^['"]|['"]$/g, "")),
      X = pK1(J) ? J : lK1(B, J);
    if (hn5(X)) return {
      behavior: "ask",
      message: `Dangerous ${A} operation detected: '${X}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
      decisionReason: {
        type: "other",
        reason: `Dangerous ${A} operation on critical path: ${X}`
      },
      suggestions: []
    }
  }
  return {
    behavior: "passthrough",
    message: `No dangerous removals detected for ${A} command`
  }
}
// @from(Ln 363192, Col 0)
function im2(A, Q, B = []) {
  let G = [],
    Z = !1;
  for (let Y = 0; Y < A.length; Y++) {
    let J = A[Y];
    if (J === void 0 || J === null) continue;
    if (J.startsWith("-")) {
      let X = J.split("=")[0];
      if (X && ["-e", "--regexp", "-f", "--file"].includes(X)) Z = !0;
      if (X && Q.has(X) && !J.includes("=")) Y++;
      continue
    }
    if (!Z) {
      Z = !0;
      continue
    }
    G.push(J)
  }
  return G.length > 0 ? G : B
}
// @from(Ln 363213, Col 0)
function cn5(A, Q, B, G, Z) {
  let Y = Tq0[A],
    J = Y(Q),
    X = sm2[A],
    I = dn5[A];
  if (I && !I(Q)) return {
    behavior: "ask",
    message: `${A} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${A} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
    decisionReason: {
      type: "other",
      reason: `${A} command with flags requires manual approval`
    }
  };
  if (Z && X !== "read") return {
    behavior: "ask",
    message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
    decisionReason: {
      type: "other",
      reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
    }
  };
  for (let D of J) {
    let {
      allowed: W,
      resolvedPath: K,
      decisionReason: V
    } = rm2(D, B, G, X);
    if (!W) {
      let F = Array.from(WEA(G)),
        H = am2(F),
        E = V?.type === "other" ? V.reason : `${A} in '${K}' was blocked. For security, Claude Code may only ${mn5[A]} the allowed working directories for this session: ${H}.`;
      if (V?.type === "rule") return {
        behavior: "deny",
        message: E,
        decisionReason: V
      };
      return {
        behavior: "ask",
        message: E,
        blockedPath: K,
        decisionReason: V
      }
    }
  }
  return {
    behavior: "passthrough",
    message: `Path validation passed for ${A} command`
  }
}
// @from(Ln 363263, Col 0)
function pn5(A) {
  return (Q, B, G, Z) => {
    let Y = cn5(A, Q, B, G, Z);
    if (Y.behavior === "deny") return Y;
    if (A === "rm" || A === "rmdir") {
      let J = gn5(A, Q, B);
      if (J.behavior !== "passthrough") return J
    }
    if (Y.behavior === "passthrough") return Y;
    if (Y.behavior === "ask") {
      let J = sm2[A],
        X = [];
      if (Y.blockedPath)
        if (J === "read") {
          let I = Hg(Y.blockedPath),
            D = N01(I, "session");
          if (D) X.push(D)
        } else X.push({
          type: "addDirectories",
          directories: [Hg(Y.blockedPath)],
          destination: "session"
        });
      if (J === "write" || J === "create") X.push({
        type: "setMode",
        mode: "acceptEdits",
        destination: "session"
      });
      Y.suggestions = X
    }
    return Y
  }
}
// @from(Ln 363296, Col 0)
function ln5(A) {
  let Q = bY(A, (Z) => `$${Z}`);
  if (!Q.success) return [];
  let B = Q.tokens,
    G = [];
  for (let Z of B)
    if (typeof Z === "string") G.push(Z);
    else if (typeof Z === "object" && Z !== null && "op" in Z && Z.op === "glob" && "pattern" in Z) G.push(String(Z.pattern));
  return G
}
// @from(Ln 363307, Col 0)
function in5(A, Q, B, G) {
  let Z = Pq0(A),
    Y = ln5(Z);
  if (Y.length === 0) return {
    behavior: "passthrough",
    message: "Empty command - no paths to validate"
  };
  let [J, ...X] = Y;
  if (!J || !un5.includes(J)) return {
    behavior: "passthrough",
    message: `Command '${J}' is not a path-restricted command`
  };
  return pn5(J)(X, Q, B, G)
}
// @from(Ln 363322, Col 0)
function nn5(A, Q, B, G) {
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
      allowed: Y,
      resolvedPath: J,
      decisionReason: X
    } = rm2(Z, Q, B, "create");
    if (!Y) {
      let I = Array.from(WEA(B)),
        D = am2(I),
        W = X?.type === "other" ? X.reason : X?.type === "rule" ? `Output redirection to '${J}' was blocked by a deny rule.` : `Output redirection to '${J}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${D}.`;
      if (X?.type === "rule") return {
        behavior: "deny",
        message: W,
        decisionReason: X
      };
      return {
        behavior: "ask",
        message: W,
        blockedPath: J,
        suggestions: [{
          type: "addDirectories",
          directories: [Hg(J)],
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
// @from(Ln 363368, Col 0)
function iK1(A, Q, B, G) {
  if (/(?:>>?)\s*\S*[$%]/.test(A.command)) return {
    behavior: "ask",
    message: "Shell expansion syntax in paths requires manual approval",
    decisionReason: {
      type: "other",
      reason: "Shell expansion syntax in paths requires manual approval"
    }
  };
  if (/>>\s*>\s*\(|>\s*>\s*\(|<\s*\(/.test(A.command)) return {
    behavior: "ask",
    message: "Process substitution (>(...) or <(...)) can execute arbitrary commands and requires manual approval",
    decisionReason: {
      type: "other",
      reason: "Process substitution requires manual approval"
    }
  };
  let {
    redirections: Z
  } = Hx(A.command), Y = nn5(Z, Q, B, G);
  if (Y.behavior !== "passthrough") return Y;
  let J = FK(A.command);
  for (let X of J) {
    let I = in5(X, Q, B, G);
    if (I.behavior === "ask" || I.behavior === "deny") return I
  }
  return {
    behavior: "passthrough",
    message: "All path commands validated successfully"
  }
}
// @from(Ln 363399, Col 4)
Rq0 = 5
// @from(Ln 363400, Col 2)
nm2
// @from(Ln 363400, Col 7)
HZ = (A) => A.filter((Q) => !Q?.startsWith("-"))
// @from(Ln 363401, Col 2)
Tq0
// @from(Ln 363401, Col 7)
un5
// @from(Ln 363401, Col 12)
mn5
// @from(Ln 363401, Col 17)
sm2
// @from(Ln 363401, Col 22)
dn5
// @from(Ln 363402, Col 4)
tm2 = w(() => {
  DQ();
  AY();
  dW();
  oZ();
  KU();
  pV();
  nK1();
  nm2 = /[*?[\]{}]/;
  Tq0 = {
    cd: (A) => A.length === 0 ? [jq0()] : [A.join(" ")],
    ls: (A) => {
      let Q = HZ(A);
      return Q.length > 0 ? Q : ["."]
    },
    find: (A) => {
      let Q = [],
        B = new Set(["-newer", "-anewer", "-cnewer", "-mnewer", "-samefile", "-path", "-wholename", "-ilname", "-lname", "-ipath", "-iwholename"]),
        G = /^-newer[acmBt][acmtB]$/,
        Z = !1;
      for (let Y = 0; Y < A.length; Y++) {
        let J = A[Y];
        if (!J) continue;
        if (J.startsWith("-")) {
          if (["-H", "-L", "-P"].includes(J)) continue;
          if (Z = !0, B.has(J) || G.test(J)) {
            let X = A[Y + 1];
            if (X) Q.push(X), Y++
          }
          continue
        }
        if (!Z) Q.push(J)
      }
      return Q.length > 0 ? Q : ["."]
    },
    mkdir: HZ,
    touch: HZ,
    rm: HZ,
    rmdir: HZ,
    mv: HZ,
    cp: HZ,
    cat: HZ,
    head: HZ,
    tail: HZ,
    sort: HZ,
    uniq: HZ,
    wc: HZ,
    cut: HZ,
    paste: HZ,
    column: HZ,
    file: HZ,
    stat: HZ,
    diff: HZ,
    awk: HZ,
    strings: HZ,
    hexdump: HZ,
    od: HZ,
    base64: HZ,
    nl: HZ,
    sha256sum: HZ,
    sha1sum: HZ,
    md5sum: HZ,
    tr: (A) => {
      let Q = A.some((G) => G === "-d" || G === "--delete" || G.startsWith("-") && G.includes("d"));
      return HZ(A).slice(Q ? 1 : 2)
    },
    grep: (A) => {
      let B = im2(A, new Set(["-e", "--regexp", "-f", "--file", "--exclude", "--include", "--exclude-dir", "--include-dir", "-m", "--max-count", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]));
      if (B.length === 0 && A.some((G) => ["-r", "-R", "--recursive"].includes(G))) return ["."];
      return B
    },
    rg: (A) => {
      return im2(A, new Set(["-e", "--regexp", "-f", "--file", "-t", "--type", "-T", "--type-not", "-g", "--glob", "-m", "--max-count", "--max-depth", "-r", "--replace", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]), ["."])
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
        let Y = A[Z];
        if (!Y) continue;
        if (Y.startsWith("-")) {
          if (["-f", "--file"].includes(Y)) {
            let J = A[Z + 1];
            if (J) Q.push(J), B = !0;
            G = !0
          } else if (["-e", "--expression"].includes(Y)) B = !0, G = !0;
          else if (Y.includes("e") || Y.includes("f")) G = !0;
          continue
        }
        if (!G) {
          G = !0;
          continue
        }
        Q.push(Y)
      }
      return Q
    },
    jq: (A) => {
      let Q = [],
        B = new Set(["-e", "--expression", "-f", "--from-file", "--arg", "--argjson", "--slurpfile", "--rawfile", "--args", "--jsonargs", "-L", "--library-path", "--indent", "--tab"]),
        G = !1;
      for (let Z = 0; Z < A.length; Z++) {
        let Y = A[Z];
        if (Y === void 0 || Y === null) continue;
        if (Y.startsWith("-")) {
          let J = Y.split("=")[0];
          if (J && ["-e", "--expression"].includes(J)) G = !0;
          if (J && B.has(J) && !Y.includes("=")) Z++;
          continue
        }
        if (!G) {
          G = !0;
          continue
        }
        Q.push(Y)
      }
      return Q
    },
    git: (A) => {
      if (A.length >= 1 && A[0] === "diff") {
        if (A.includes("--no-index")) return A.slice(1).filter((G) => !G?.startsWith("-")).slice(0, 2)
      }
      return []
    }
  }, un5 = Object.keys(Tq0), mn5 = {
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
  }, sm2 = {
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
  }, dn5 = {
    mv: (A) => !A.some((Q) => Q?.startsWith("-")),
    cp: (A) => !A.some((Q) => Q?.startsWith("-"))
  }
})
// @from(Ln 363611, Col 0)
function on5(A) {
  return an5.includes(A)
}
// @from(Ln 363615, Col 0)
function rn5(A, Q) {
  let B = A.trim(),
    [G] = B.split(/\s+/);
  if (!G) return {
    behavior: "passthrough",
    message: "Base command not found"
  };
  if (Q.mode === "acceptEdits" && on5(G)) return {
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
// @from(Ln 363638, Col 0)
function em2(A, Q) {
  if (Q.mode === "bypassPermissions") return {
    behavior: "passthrough",
    message: "Bypass mode is handled in main permission flow"
  };
  if (Q.mode === "dontAsk") return {
    behavior: "passthrough",
    message: "DontAsk mode is handled in main permission flow"
  };
  let B = FK(A.command);
  for (let G of B) {
    let Z = rn5(G, Q);
    if (Z.behavior !== "passthrough") return Z
  }
  return {
    behavior: "passthrough",
    message: "No mode-specific validation required"
  }
}
// @from(Ln 363657, Col 4)
an5
// @from(Ln 363658, Col 4)
Ad2 = w(() => {
  KU();
  an5 = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]
})
// @from(Ln 363663, Col 0)
function Bd2(A, Q) {
  for (let B of A)
    if (B.startsWith("-") && !B.startsWith("--") && B.length > 2)
      for (let G = 1; G < B.length; G++) {
        let Z = "-" + B[G];
        if (!Q.includes(Z)) return !1
      } else if (!Q.includes(B)) return !1;
  return !0
}
// @from(Ln 363673, Col 0)
function sn5(A, Q) {
  let B = A.match(/^\s*sed\s+/);
  if (!B) return !1;
  let G = A.slice(B[0].length),
    Z = bY(G);
  if (!Z.success) return !1;
  let Y = Z.tokens,
    J = [];
  for (let D of Y)
    if (typeof D === "string" && D.startsWith("-") && D !== "--") J.push(D);
  if (!Bd2(J, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
  let I = !1;
  for (let D of J) {
    if (D === "-n" || D === "--quiet" || D === "--silent") {
      I = !0;
      break
    }
    if (D.startsWith("-") && !D.startsWith("--") && D.includes("n")) {
      I = !0;
      break
    }
  }
  if (!I) return !1;
  if (Q.length === 0) return !1;
  for (let D of Q) {
    let W = D.split(";");
    for (let K of W)
      if (!tn5(K.trim())) return !1
  }
  return !0
}
// @from(Ln 363705, Col 0)
function tn5(A) {
  if (!A) return !1;
  return /^(?:\d+|\d+,\d+)?p$/.test(A)
}
// @from(Ln 363710, Col 0)
function Qd2(A, Q, B, G) {
  let Z = G?.allowFileWrites ?? !1;
  if (!Z && B) return !1;
  let Y = A.match(/^\s*sed\s+/);
  if (!Y) return !1;
  let J = A.slice(Y[0].length),
    X = bY(J);
  if (!X.success) return !1;
  let I = X.tokens,
    D = [];
  for (let L of I)
    if (typeof L === "string" && L.startsWith("-") && L !== "--") D.push(L);
  let W = ["-E", "--regexp-extended", "-r", "--posix"];
  if (Z) W.push("-i", "--in-place");
  if (!Bd2(D, W)) return !1;
  if (Q.length !== 1) return !1;
  let K = Q[0].trim();
  if (!K.startsWith("s")) return !1;
  let V = K.match(/^s\/(.*?)$/);
  if (!V) return !1;
  let F = V[1],
    H = 0,
    E = -1,
    z = 0;
  while (z < F.length) {
    if (F[z] === "\\") {
      z += 2;
      continue
    }
    if (F[z] === "/") H++, E = z;
    z++
  }
  if (H !== 2) return !1;
  let $ = F.slice(E + 1);
  if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test($)) return !1;
  return !0
}
// @from(Ln 363748, Col 0)
function yq0(A, Q) {
  let B = Q?.allowFileWrites ?? !1,
    G;
  try {
    G = Aa5(A)
  } catch (X) {
    return !1
  }
  let Z = en5(A),
    Y = !1,
    J = !1;
  if (B) J = Qd2(A, G, Z, {
    allowFileWrites: !0
  });
  else Y = sn5(A, G), J = Qd2(A, G, Z);
  if (!Y && !J) return !1;
  for (let X of G)
    if (J && X.includes(";")) return !1;
  for (let X of G)
    if (Qa5(X)) return !1;
  return !0
}
// @from(Ln 363771, Col 0)
function en5(A) {
  let Q = A.match(/^\s*sed\s+/);
  if (!Q) return !1;
  let B = A.slice(Q[0].length),
    G = bY(B);
  if (!G.success) return !0;
  let Z = G.tokens;
  try {
    let Y = 0,
      J = !1;
    for (let X = 0; X < Z.length; X++) {
      let I = Z[X];
      if (typeof I !== "string" && typeof I !== "object") continue;
      if (typeof I === "object" && I !== null && "op" in I && I.op === "glob") return !0;
      if (typeof I !== "string") continue;
      if ((I === "-e" || I === "--expression") && X + 1 < Z.length) {
        J = !0, X++;
        continue
      }
      if (I.startsWith("--expression=")) {
        J = !0;
        continue
      }
      if (I.startsWith("-e=")) {
        J = !0;
        continue
      }
      if (I.startsWith("-")) continue;
      if (Y++, J) return !0;
      if (Y > 1) return !0
    }
    return !1
  } catch (Y) {
    return !0
  }
}
// @from(Ln 363808, Col 0)
function Aa5(A) {
  let Q = [],
    B = A.match(/^\s*sed\s+/);
  if (!B) return Q;
  let G = A.slice(B[0].length);
  if (/-e[wWe]/.test(G) || /-w[eE]/.test(G)) throw Error("Dangerous flag combination detected");
  let Z = bY(G);
  if (!Z.success) throw Error(`Malformed shell syntax: ${Z.error}`);
  let Y = Z.tokens;
  try {
    let J = !1,
      X = !1;
    for (let I = 0; I < Y.length; I++) {
      let D = Y[I];
      if (typeof D !== "string") continue;
      if ((D === "-e" || D === "--expression") && I + 1 < Y.length) {
        J = !0;
        let W = Y[I + 1];
        if (typeof W === "string") Q.push(W), I++;
        continue
      }
      if (D.startsWith("--expression=")) {
        J = !0, Q.push(D.slice(13));
        continue
      }
      if (D.startsWith("-e=")) {
        J = !0, Q.push(D.slice(3));
        continue
      }
      if (D.startsWith("-")) continue;
      if (!J && !X) {
        Q.push(D), X = !0;
        continue
      }
      break
    }
  } catch (J) {
    throw Error(`Failed to parse sed command: ${J instanceof Error?J.message:"Unknown error"}`)
  }
  return Q
}
// @from(Ln 363850, Col 0)
function Qa5(A) {
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
    let Y = G[2] || "";
    if (Y.includes("w") || Y.includes("W")) return !0;
    if (Y.includes("e") || Y.includes("E")) return !0
  }
  if (Q.match(/y([^\\\n])/)) {
    if (/[wWeE]/.test(Q)) return !0
  }
  return !1
}
// @from(Ln 363884, Col 0)
function Gd2(A, Q) {
  let B = FK(A.command);
  for (let G of B) {
    let Z = G.trim();
    if (Z.split(/\s+/)[0] !== "sed") continue;
    let J = Q.mode === "acceptEdits";
    if (!yq0(Z, {
        allowFileWrites: J
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
// @from(Ln 363906, Col 4)
vq0 = w(() => {
  KU();
  pV()
})
// @from(Ln 363911, Col 0)
function aK1(A) {
  return `prompt: ${A.trim()}`
}
// @from(Ln 363915, Col 0)
function $t() {
  return !1
}
// @from(Ln 363919, Col 0)
function Yd2(A) {
  return []
}
// @from(Ln 363923, Col 0)
function Jd2(A) {
  return []
}
// @from(Ln 363927, Col 0)
function oK1(A) {
  return []
}
// @from(Ln 363930, Col 0)
async function rK1(A, Q, B, G, Z, Y) {
  return {
    matches: !1,
    confidence: "high",
    reason: "Classifier permissions feature is disabled in external builds"
  }
}
// @from(Ln 363937, Col 0)
async function Xd2(A, Q, B) {
  return Q || null
}
// @from(Ln 363940, Col 4)
Zd2 = "prompt:"
// @from(Ln 363942, Col 0)
function bq0(A, Q, B, G) {
  return
}
// @from(Ln 363946, Col 0)
function sK1(A) {
  return [{
    type: "addRules",
    rules: [{
      toolName: o2.name,
      ruleContent: A
    }],
    behavior: "allow",
    destination: "localSettings"
  }]
}
// @from(Ln 363958, Col 0)
function Kd2(A) {
  return [{
    type: "addRules",
    rules: [{
      toolName: o2.name,
      ruleContent: `${A}:*`
    }],
    behavior: "allow",
    destination: "localSettings"
  }]
}
// @from(Ln 363970, Col 0)
function Id2(A) {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(A)
}
// @from(Ln 363974, Col 0)
function Dd2(A) {
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
// @from(Ln 363986, Col 0)
function Ba5(A, Q) {
  let B = e6A(A);
  if (!B) return null;
  try {
    if (FK(A).length > 1) return null
  } catch {
    return null
  }
  let {
    server: G,
    toolName: Z
  } = B;
  if (!Id2(G) || !Id2(Z)) return {
    behavior: "deny",
    message: "Invalid MCP server or tool name. Names must contain only letters, numbers, hyphens, and underscores.",
    decisionReason: {
      type: "other",
      reason: "Security: Invalid characters in MCP identifier"
    }
  };
  let Y = `mcp__${G}__${Z}`,
    J = {
      name: Y
    },
    X = pq0(Q, J);
  if (X) return {
    behavior: "deny",
    message: `MCP tool ${G}/${Z} has been denied`,
    decisionReason: {
      type: "rule",
      rule: X
    }
  };
  let I = lq0(Q, J);
  if (I) return {
    behavior: "ask",
    message: YD(Y),
    decisionReason: {
      type: "rule",
      rule: I
    },
    suggestions: Dd2(Y)
  };
  let D = cq0(Q, J);
  if (D) return {
    behavior: "allow",
    updatedInput: {
      command: A
    },
    decisionReason: {
      type: "rule",
      rule: D
    }
  };
  return {
    behavior: "ask",
    message: YD(Y),
    decisionReason: {
      type: "other",
      reason: "MCP tool requires permission"
    },
    suggestions: Dd2(Y)
  }
}
// @from(Ln 364051, Col 0)
function Ga5(A) {
  if (A.endsWith(":*")) return !1;
  for (let Q = 0; Q < A.length; Q++)
    if (A[Q] === "*") {
      let B = 0,
        G = Q - 1;
      while (G >= 0 && A[G] === "\\") B++, G--;
      if (B % 2 === 0) return !0
    } return !1
}
// @from(Ln 364062, Col 0)
function hq0(A, Q) {
  let B = A.trim(),
    G = "\x00ESCAPED_STAR\x00",
    Z = "\x00ESCAPED_BACKSLASH\x00",
    Y = "",
    J = 0;
  while (J < B.length) {
    let K = B[J];
    if (K === "\\" && J + 1 < B.length) {
      let V = B[J + 1];
      if (V === "*") {
        Y += "\x00ESCAPED_STAR\x00", J += 2;
        continue
      } else if (V === "\\") {
        Y += "\x00ESCAPED_BACKSLASH\x00", J += 2;
        continue
      }
    }
    Y += K, J++
  }
  let D = Y.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&").replace(/\*/g, ".*").replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*").replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\");
  return new RegExp(`^${D}$`).test(Q)
}
// @from(Ln 364086, Col 0)
function gq0(A) {
  let Q = fq0(A);
  if (Q !== null) return {
    type: "prefix",
    prefix: Q
  };
  if (Ga5(A)) return {
    type: "wildcard",
    pattern: A
  };
  return {
    type: "exact",
    command: A
  }
}
// @from(Ln 364102, Col 0)
function Ya5(A) {
  let B = A.split(`
`).filter((G) => {
    let Z = G.trim();
    return Z !== "" && !Z.startsWith("#")
  });
  if (B.length === 0) return A;
  return B.join(`
`)
}
// @from(Ln 364113, Col 0)
function Pq0(A) {
  let Q = [/^timeout\s+\d+[smhd]?\s+/, /^time\s+/, /^nice\s+-n\s+-?\d+\s+/, /^nohup\s+/],
    B = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)\s+/,
    G = A,
    Z = "";
  while (G !== Z) {
    Z = G, G = Ya5(G);
    for (let J of Q) G = G.replace(J, "");
    let Y = G.match(B);
    if (Y) {
      let J = Y[1],
        X = !1;
      if (Za5.has(J)) G = G.replace(B, "")
    }
  }
  return G.trim()
}
// @from(Ln 364131, Col 0)
function kq0(A, Q, B) {
  let G = A.command.trim(),
    Z = Hx(G).commandWithoutRedirections,
    J = (B === "exact" ? [G, Z] : [Z]).flatMap((X) => {
      let I = Pq0(X);
      return I !== X ? [X, I] : [X]
    });
  return Array.from(Q.entries()).filter(([X]) => {
    let I = gq0(X);
    return J.some((D) => {
      switch (I.type) {
        case "exact":
          return I.command === D;
        case "prefix":
          switch (B) {
            case "exact":
              return I.prefix === D;
            case "prefix":
              if (D === I.prefix) return !0;
              return D.startsWith(I.prefix + " ")
          }
          break;
        case "wildcard":
          if (B === "exact") return !1;
          return hq0(I.pattern, D)
      }
    })
  }).map(([, X]) => X)
}
// @from(Ln 364161, Col 0)
function uq0(A, Q, B) {
  let G = Bx(Q, o2, "deny"),
    Z = kq0(A, G, B),
    Y = Bx(Q, o2, "ask"),
    J = kq0(A, Y, B),
    X = Bx(Q, o2, "allow"),
    I = kq0(A, X, B);
  return {
    matchingDenyRules: Z,
    matchingAskRules: J,
    matchingAllowRules: I
  }
}
// @from(Ln 364175, Col 0)
function Wd2(A, Q, B, G) {
  let Z = mq0(A, Q);
  if (Z.behavior !== "passthrough") return Z;
  let Y = Vd2(A, Q, G);
  if (Y.behavior === "deny" || Y.behavior === "ask") return Y;
  if (!a1(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let X = Mf(A.command);
    if (X.behavior !== "passthrough") {
      let I = {
        type: "other",
        reason: X.behavior === "ask" && X.message ? X.message : "This command contains patterns that could pose security risks and requires approval"
      };
      return {
        behavior: "ask",
        message: YD(o2.name, I),
        decisionReason: I,
        suggestions: []
      }
    }
  }
  if (Y.behavior === "allow") return Y;
  let J = B?.commandPrefix ? Kd2(B.commandPrefix) : sK1(A.command);
  return {
    ...Y,
    suggestions: J
  }
}
// @from(Ln 364203, Col 0)
function Ja5(A, Q) {
  let B = A.command.trim(),
    {
      matchingDenyRules: G,
      matchingAskRules: Z
    } = uq0(A, Q, "prefix");
  if (G[0] !== void 0) return {
    behavior: "deny",
    message: `Permission to use ${o2.name} with command ${B} has been denied.`,
    decisionReason: {
      type: "rule",
      rule: G[0]
    }
  };
  if (Z[0] !== void 0) return {
    behavior: "ask",
    message: YD(o2.name),
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
// @from(Ln 364234, Col 0)
async function JfA(A, Q) {
  if (!$t()) return null;
  let B = await Q.getAppState(),
    G = oK1(B.toolPermissionContext);
  if (G.length === 0) return null;
  k(`Running allow classifier for command: ${A.command.substring(0,100)}${A.command.length>100?"...":""}`);
  let Z = await rK1(A.command, o1(), G, "allow", Q.abortController.signal, Q.options.isNonInteractiveSession);
  if (Q.abortController.signal.aborted) throw new aG;
  if (bq0(A.command, "allow", G, Z), Z.matches && Z.confidence === "high") return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "other",
      reason: `Allowed by Bash prompt rule: "${Z.matchedDescription}"`
    }
  };
  return null
}
// @from(Ln 364252, Col 0)
async function dq0(A, Q, B = Fd2) {
  let G = await Q.getAppState(),
    Z = bY(A.command);
  if (!Z.success) {
    let _ = {
      type: "other",
      reason: `Command contains malformed syntax that cannot be parsed: ${Z.error}`
    };
    return {
      behavior: "ask",
      decisionReason: _,
      message: YD(o2.name, _)
    }
  }
  if (XB.isSandboxingEnabled() && XB.isAutoAllowBashIfSandboxedEnabled() && KEA(A)) {
    let _ = Ja5(A, G.toolPermissionContext);
    if (_.behavior !== "passthrough") return _
  }
  let Y = mq0(A, G.toolPermissionContext);
  if (Y.behavior === "deny") return Y;
  if ($t()) {
    let _ = Yd2(G.toolPermissionContext);
    if (_.length > 0) {
      let j = await rK1(A.command, o1(), _, "deny", Q.abortController.signal, Q.options.isNonInteractiveSession);
      if (Q.abortController.signal.aborted) throw new aG;
      if (bq0(A.command, "deny", _, j), j.matches && j.confidence === "high") return {
        behavior: "deny",
        message: `Denied by Bash prompt rule: "${j.matchedDescription}"`,
        decisionReason: {
          type: "other",
          reason: `Denied by Bash prompt rule: "${j.matchedDescription}"`
        }
      }
    }
  }
  if ($t()) {
    let _ = Jd2(G.toolPermissionContext);
    if (_.length > 0) {
      let j = await rK1(A.command, o1(), _, "ask", Q.abortController.signal, Q.options.isNonInteractiveSession);
      if (Q.abortController.signal.aborted) throw new aG;
      if (bq0(A.command, "ask", _, j), j.matches && j.confidence === "high") {
        let x = await B(A.command, Q.abortController.signal, Q.options.isNonInteractiveSession);
        if (Q.abortController.signal.aborted) throw new aG;
        let b = x?.commandPrefix ? Kd2(x.commandPrefix) : sK1(A.command);
        return {
          behavior: "ask",
          message: YD(o2.name),
          decisionReason: {
            type: "other",
            reason: `Required by Bash prompt rule: "${j.matchedDescription}"`
          },
          suggestions: b
        }
      }
    }
  }
  let J = await cm2(A, (_) => dq0(_, Q, B));
  if (J.behavior !== "passthrough") {
    if (J.behavior === "allow") {
      let _ = Mf(A.command);
      if (_.behavior !== "passthrough" && _.behavior !== "allow") {
        let x = await JfA(A, Q);
        if (x) return x;
        return {
          behavior: "ask",
          message: YD(o2.name, {
            type: "other",
            reason: _.message ?? "Command contains patterns that require approval"
          }),
          decisionReason: {
            type: "other",
            reason: _.message ?? "Command contains patterns that require approval"
          }
        }
      }
      G = await Q.getAppState();
      let j = iK1(A, o1(), G.toolPermissionContext, !1);
      if (j.behavior !== "passthrough") return j
    }
    if (J.behavior === "ask") {
      let _ = await JfA(A, Q);
      if (_) return _
    }
    return J
  }
  if (!a1(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let _ = Mf(A.command);
    if (_.behavior === "ask" && _.message?.includes("${")) {
      let j = await JfA(A, Q);
      if (j) return j;
      let x = {
        type: "other",
        reason: _.message
      };
      return {
        behavior: "ask",
        message: YD(o2.name, x),
        decisionReason: x,
        suggestions: []
      }
    }
  }
  let X = FK(A.command).filter((_) => {
      if (_ === `cd ${o1()}`) return !1;
      return !0
    }),
    I = X.filter((_) => YfA.test(_));
  if (I.length > 1) {
    let _ = {
      type: "other",
      reason: "Multiple directory changes in one command require approval for clarity"
    };
    return {
      behavior: "ask",
      decisionReason: _,
      message: YD(o2.name, _)
    }
  }
  let D = I.length > 0;
  G = await Q.getAppState();
  let W = X.map((_) => {
    let j = Ba5(_, G.toolPermissionContext);
    if (j !== null) return j;
    return Vd2({
      command: _
    }, G.toolPermissionContext, D)
  });
  if (W.find((_) => _.behavior === "deny") !== void 0) return {
    behavior: "deny",
    message: `Permission to use ${o2.name} with command ${A.command} has been denied.`,
    decisionReason: {
      type: "subcommandResults",
      reasons: new Map(W.map((_, j) => [X[j], _]))
    }
  };
  let V = iK1(A, o1(), G.toolPermissionContext, D);
  if (V.behavior !== "passthrough") return V;
  let F = W.find((_) => _.behavior === "ask");
  if (F !== void 0) return F;
  if (Y.behavior === "allow") return Y;
  let H = a1(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? !1 : X.some((_) => Mf(_).behavior !== "passthrough");
  if (W.every((_) => _.behavior === "allow") && !H) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: new Map(W.map((_, j) => [X[j], _]))
    }
  };
  let E = await B(A.command, Q.abortController.signal, Q.options.isNonInteractiveSession);
  if (Q.abortController.signal.aborted) throw new aG;
  if (G = await Q.getAppState(), X.length === 1) {
    let _ = Wd2({
      command: X[0]
    }, G.toolPermissionContext, E, D);
    if (_.behavior === "ask" || _.behavior === "passthrough") {
      let j = await JfA({
        ...A,
        command: X[0]
      }, Q);
      if (j) return j
    }
    return _
  }
  let z = new Map;
  for (let _ of X) z.set(_, Wd2({
    ...A,
    command: _
  }, G.toolPermissionContext, E?.subcommandPrefixes.get(_), D));
  if (X.every((_) => {
      return z.get(_)?.behavior === "allow"
    })) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "subcommandResults",
      reasons: z
    }
  };
  let $ = new Map;
  for (let _ of z.values())
    if (_.behavior === "ask" || _.behavior === "passthrough") {
      let j = "suggestions" in _ ? _.suggestions : void 0,
        x = ABA(j);
      for (let b of x) {
        let S = S5(b);
        $.set(S, b)
      }
    } let O = {
      type: "subcommandResults",
      reasons: z
    },
    L = $.size > 0 ? [{
      type: "addRules",
      rules: Array.from($.values()),
      behavior: "allow",
      destination: "localSettings"
    }] : void 0,
    M = await JfA(A, Q);
  if (M) return M;
  return {
    behavior: "passthrough",
    message: YD(o2.name, O),
    decisionReason: O,
    suggestions: L
  }
}
// @from(Ln 364459, Col 4)
fq0 = (A) => {
    return A.match(/^(.+):\*$/)?.[1] ?? null
  }
// @from(Ln 364462, Col 2)
Za5
// @from(Ln 364462, Col 7)
mq0 = (A, Q) => {
    let B = A.command.trim(),
      {
        matchingDenyRules: G,
        matchingAskRules: Z,
        matchingAllowRules: Y
      } = uq0(A, Q, "exact");
    if (G[0] !== void 0) return {
      behavior: "deny",
      message: `Permission to use ${o2.name} with command ${B} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: G[0]
      }
    };
    if (Z[0] !== void 0) return {
      behavior: "ask",
      message: YD(o2.name),
      decisionReason: {
        type: "rule",
        rule: Z[0]
      }
    };
    if (Y[0] !== void 0) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "rule",
        rule: Y[0]
      }
    };
    let J = {
      type: "other",
      reason: "This command requires approval"
    };
    return {
      behavior: "passthrough",
      message: YD(o2.name, J),
      decisionReason: J,
      suggestions: sK1(B)
    }
  }
// @from(Ln 364504, Col 2)
Vd2 = (A, Q, B) => {
    let G = A.command.trim(),
      Z = mq0(A, Q);
    if (Z.behavior === "deny" || Z.behavior === "ask") return Z;
    let {
      matchingDenyRules: Y,
      matchingAskRules: J,
      matchingAllowRules: X
    } = uq0(A, Q, "prefix");
    if (Y[0] !== void 0) return {
      behavior: "deny",
      message: `Permission to use ${o2.name} with command ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: Y[0]
      }
    };
    if (J[0] !== void 0) return {
      behavior: "ask",
      message: YD(o2.name),
      decisionReason: {
        type: "rule",
        rule: J[0]
      }
    };
    let I = iK1(A, o1(), Q, B);
    if (I.behavior !== "passthrough") return I;
    if (Z.behavior === "allow") return Z;
    if (X[0] !== void 0) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "rule",
        rule: X[0]
      }
    };
    let D = Gd2(A, Q);
    if (D.behavior !== "passthrough") return D;
    let W = em2(A, Q);
    if (W.behavior !== "passthrough") return W;
    if (o2.isReadOnly(A)) return {
      behavior: "allow",
      updatedInput: A,
      decisionReason: {
        type: "other",
        reason: "Read-only command is allowed"
      }
    };
    let K = {
      type: "other",
      reason: "This command requires approval"
    };
    return {
      behavior: "passthrough",
      message: YD(o2.name, K),
      decisionReason: K,
      suggestions: sK1(G)
    }
  }
// @from(Ln 364563, Col 4)
nK1 = w(() => {
  YK();
  NJ();
  PK1();
  KU();
  pV();
  XX();
  V2();
  dW();
  YZ();
  pm2();
  fQ();
  tm2();
  KU();
  Ad2();
  vq0();
  $F();
  T1();
  Z0();
  A0();
  Za5 = new Set(["GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE", "RUST_BACKTRACE", "RUST_LOG", "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE", "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG", "ANTHROPIC_API_KEY", "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME", "CHARSET", "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR", "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS", "GCC_COLORS", "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE"])
})
// @from(Ln 364589, Col 0)
function Cd2(A, Q) {
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
// @from(Ln 364608, Col 0)
function Ia5(A) {
  let Q = bY(A, (I) => `$${I}`);
  if (!Q.success) return !1;
  let B = Q.tokens.map((I) => {
    if (typeof I !== "string") {
      if (I = I, I.op === "glob") return I.pattern
    }
    return I
  });
  if (B.some((I) => typeof I !== "string")) return !1;
  let Z = B;
  if (Z.length === 0) return !1;
  let Y, J = 0;
  for (let [I] of Object.entries($d2)) {
    let D = I.split(" ");
    if (Z.length >= D.length) {
      let W = !0;
      for (let K = 0; K < D.length; K++)
        if (Z[K] !== D[K]) {
          W = !1;
          break
        } if (W) {
        Y = $d2[I], J = D.length;
        break
      }
    }
  }
  if (!Y) return !1;
  if (Z[0] === "git" && Z[1] === "ls-remote")
    for (let I = 2; I < Z.length; I++) {
      let D = Z[I];
      if (D && !D.startsWith("-")) {
        if (D.includes("://")) return !1;
        if (D.includes("@") || D.includes(":")) return !1;
        if (D.includes("$")) return !1
      }
    }
  let X = J;
  while (X < Z.length) {
    let I = Z[X];
    if (!I) {
      X++;
      continue
    }
    if (Z[0] === "xargs" && (!I.startsWith("-") || I === "--")) {
      if (I === "--" && X + 1 < Z.length) X++, I = Z[X];
      if (I && Xa5.includes(I)) break;
      return !1
    }
    if (I === "--") {
      X++;
      break
    }
    if (I.startsWith("-") && I.length > 1 && Hd2.test(I)) {
      let [D, ...W] = I.split("="), K = W.join("=");
      if (!D) return !1;
      let V = Y.safeFlags[D];
      if (!V) {
        if (Z[0] === "git" && D.match(/^-\d+$/)) {
          X++;
          continue
        }
        if ((Z[0] === "grep" || Z[0] === "rg") && D.startsWith("-") && !D.startsWith("--") && D.length > 2) {
          let F = D.substring(0, 2),
            H = D.substring(2);
          if (Y.safeFlags[F] && /^\d+$/.test(H)) {
            let E = Y.safeFlags[F];
            if (E === "number" || E === "string")
              if (Cd2(H, E)) {
                X++;
                continue
              } else return !1
          }
        }
        if (D.startsWith("-") && !D.startsWith("--") && D.length > 2) {
          for (let F = 1; F < D.length; F++) {
            let H = "-" + D[F];
            if (!Y.safeFlags[H]) return !1
          }
          X++;
          continue
        } else return !1
      }
      if (V === "none") {
        if (K) return !1;
        X++
      } else {
        let F;
        if (K) F = K, X++;
        else {
          if (X + 1 >= Z.length || Z[X + 1] && Z[X + 1].startsWith("-") && Z[X + 1].length > 1 && Hd2.test(Z[X + 1])) return !1;
          F = Z[X + 1] || "", X += 2
        }
        if (V === "string" && F.startsWith("-"))
          if (D === "--sort" && Z[0] === "git" && F.match(/^-[a-zA-Z]/));
          else return !1;
        if (!Cd2(F, V)) return !1
      }
    } else X++
  }
  if (Y.regex && !Y.regex.test(A)) return !1;
  if (!Y.regex && /`/.test(A)) return !1;
  if (!Y.regex && (Z[0] === "rg" || Z[0] === "grep") && /[\n\r]/.test(A)) return !1;
  if (Y.additionalCommandIsDangerousCallback && Y.additionalCommandIsDangerousCallback(A)) return !1;
  return !0
}
// @from(Ln 364715, Col 0)
function Da5(A) {
  return new RegExp(`^${A}(?:\\s|$)[^<>()$\`|{}&;\\n\\r]*$`)
}
// @from(Ln 364719, Col 0)
function QV1(A) {
  if ($Q() !== "windows") return !1;
  if (/\\\\[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?\\/i.test(A)) return !0;
  if (/\/\/[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?\//i.test(A)) return !0;
  if (/@SSL@\d+/i.test(A) || /@\d+@SSL/i.test(A)) return !0;
  if (/DavWWWRoot/i.test(A)) return !0;
  if (/^\\\\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A) || /^\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A)) return !0;
  if (/^\\\\(\[[\da-fA-F:]+\])[\\/]/.test(A) || /^\/\/(\[[\da-fA-F:]+\])[\\/]/.test(A)) return !0;
  return !1
}
// @from(Ln 364730, Col 0)
function Va5(A) {
  let Q = !1,
    B = !1,
    G = !1;
  for (let Z = 0; Z < A.length; Z++) {
    let Y = A[Z];
    if (G) {
      G = !1;
      continue
    }
    if (Y === "\\") {
      G = !0;
      continue
    }
    if (Y === "'" && !B) {
      Q = !Q;
      continue
    }
    if (Y === '"' && !Q) {
      B = !B;
      continue
    }
    if (Q || B) continue;
    if (Y && /[?*[\]]/.test(Y)) return !0
  }
  return !1
}
// @from(Ln 364758, Col 0)
function Fa5(A) {
  let Q = A.trim();
  if (Q.endsWith(" 2>&1")) Q = Q.slice(0, -5).trim();
  if (QV1(Q)) return !1;
  if (Va5(Q)) return !1;
  if (Ia5(Q)) return !0;
  for (let B of Ka5)
    if (B.test(Q)) {
      if (Q.includes("git") && /\s-c[\s=]/.test(Q)) return !1;
      if (Q.includes("git") && /\s--exec-path[\s=]/.test(Q)) return !1;
      if (Q.includes("git") && /\s--config-env[\s=]/.test(Q)) return !1;
      return !0
    } return !1
}
// @from(Ln 364773, Col 0)
function Ha5(A) {
  return /^git(?:\s|$)/.test(A)
}
// @from(Ln 364777, Col 0)
function Ea5(A) {
  return FK(A).some((Q) => Ha5(Q.trim()))
}
// @from(Ln 364781, Col 0)
function za5() {
  let A = vA(),
    Q = o1(),
    B = XfA(Q, ".git");
  try {
    if (A.existsSync(B)) {
      let J = A.statSync(B);
      if (J.isFile()) return !1;
      if (J.isDirectory()) {
        let X = XfA(B, "HEAD");
        if (A.existsSync(X)) return !1
      }
    }
  } catch {}
  let G = XfA(Q, "HEAD"),
    Z = XfA(Q, "objects"),
    Y = XfA(Q, "refs");
  try {
    let J = A.existsSync(G),
      X = A.existsSync(Z) && A.statSync(Z).isDirectory(),
      I = A.existsSync(Y) && A.statSync(Y).isDirectory();
    return J || X || I
  } catch {
    return !1
  }
}
// @from(Ln 364808, Col 0)
function BV1(A, Q) {
  let {
    command: B
  } = A;
  if (!bY(B, (J) => `$${J}`).success) return {
    behavior: "passthrough",
    message: "Command cannot be parsed, requires further permission checks"
  };
  if (Mf(B).behavior !== "passthrough") return {
    behavior: "passthrough",
    message: "Command is not read-only, requires further permission checks"
  };
  if (QV1(B)) return {
    behavior: "ask",
    message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
  };
  let Z = Ea5(B);
  if (Q && Z) return {
    behavior: "passthrough",
    message: "Compound commands with cd and git require permission checks for enhanced security"
  };
  if (Z && za5()) return {
    behavior: "passthrough",
    message: "Git commands in directories with bare repository structure require permission checks for enhanced security"
  };
  if (FK(B).every((J) => {
      if (Mf(J).behavior !== "passthrough") return !1;
      return Fa5(J)
    })) return {
    behavior: "allow",
    updatedInput: A
  };
  return {
    behavior: "passthrough",
    message: "Command is not read-only, requires further permission checks"
  }
}
// @from(Ln 364845, Col 4)
Hd2
// @from(Ln 364845, Col 9)
tK1
// @from(Ln 364845, Col 14)
iq0
// @from(Ln 364845, Col 19)
eK1
// @from(Ln 364845, Col 24)
nq0
// @from(Ln 364845, Col 29)
aq0
// @from(Ln 364845, Col 34)
AV1
// @from(Ln 364845, Col 39)
Ed2
// @from(Ln 364845, Col 44)
zd2
// @from(Ln 364845, Col 49)
$d2
// @from(Ln 364845, Col 54)
Xa5
// @from(Ln 364845, Col 59)
Wa5
// @from(Ln 364845, Col 64)
Ka5