
// @from(Ln 264547, Col 0)
function t75(A) {
  return A.source === "github" ? A.repo.replace("/", "-") : A.source === "npm" ? A.package.replace("@", "").replace("/", "-") : A.source === "file" ? e62(A.path).replace(".json", "") : A.source === "directory" ? e62(A.path) : "temp_" + Date.now()
}
// @from(Ln 264551, Col 0)
function J32(A, Q) {
  let G = vA().readFileSync(A, {
      encoding: "utf-8"
    }),
    Z = AQ(G),
    Y = Q.safeParse(Z);
  if (!Y.success) throw new Hq(`Invalid schema: ${Y.error?.issues.map((J)=>`${J.path.join(".")}: ${J.message}`).join(", ")}`, A, Z);
  return Y.data
}
// @from(Ln 264560, Col 0)
async function VI0(A, Q) {
  let B = vA(),
    G = Z32();
  B.mkdirSync(G);
  let Z, Y, J = !1,
    X = t75(A);
  try {
    switch (A.source) {
      case "url": {
        Z = sC(G, `${X}.json`), J = !0, await Y32(A.url, Z, A.headers, Q), Y = Z;
        break
      }
      case "github": {
        let K = `git@github.com:${A.repo}.git`,
          V = `https://github.com/${A.repo}.git`;
        Z = sC(G, X), J = !0;
        let F = null;
        if (await o75()) {
          b_(Q, `Cloning via SSH: ${K}`);
          try {
            await VVA(K, Z, A.ref, Q)
          } catch (E) {
            if (F = E instanceof Error ? E : Error(String(E)), e(F), b_(Q, `SSH clone failed, retrying with HTTPS: ${V}`), k(`SSH clone failed for ${A.repo} despite SSH being configured, falling back to HTTPS`, {
                level: "info"
              }), B.existsSync(Z)) B.rmSync(Z, {
              recursive: !0,
              force: !0
            });
            try {
              await VVA(V, Z, A.ref, Q), F = null
            } catch (z) {
              F = z instanceof Error ? z : Error(String(z)), e(F)
            }
          }
        } else {
          b_(Q, `SSH not configured, cloning via HTTPS: ${V}`), k(`SSH not configured for GitHub, using HTTPS for ${A.repo}`, {
            level: "info"
          });
          try {
            await VVA(V, Z, A.ref, Q)
          } catch (E) {
            if (F = E instanceof Error ? E : Error(String(E)), e(F), b_(Q, `HTTPS clone failed, retrying with SSH: ${K}`), k(`HTTPS clone failed for ${A.repo} (${F.message}), falling back to SSH`, {
                level: "info"
              }), B.existsSync(Z)) B.rmSync(Z, {
              recursive: !0,
              force: !0
            });
            try {
              await VVA(K, Z, A.ref, Q), F = null
            } catch (z) {
              F = z instanceof Error ? z : Error(String(z)), e(F)
            }
          }
        }
        if (F) throw F;
        Y = sC(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "git": {
        Z = sC(G, X), J = !0, await VVA(A.url, Z, A.ref, Q), Y = sC(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "npm":
        throw Error("NPM marketplace sources not yet implemented");
      case "file": {
        Y = A.path, Z = A32(A32(A.path)), J = !1;
        break
      }
      case "directory": {
        Y = sC(A.path, ".claude-plugin", "marketplace.json"), Z = A.path, J = !1;
        break
      }
      default:
        throw Error("Unsupported marketplace source type")
    }
    if (!B.existsSync(Y)) throw Error(`Marketplace file not found at ${Y}`);
    let I = J32(Y, JVA),
      D = sC(G, I.name),
      W = A.source === "file" || A.source === "directory";
    if (Z !== D && !W) try {
      if (B.existsSync(D)) {
        try {
          Q?.("Cleaning up old marketplace cache…")
        } catch (K) {
          k(`Progress callback error: ${K instanceof Error?K.message:String(K)}`, {
            level: "warn"
          })
        }
        B.rmSync(D, {
          recursive: !0,
          force: !0
        })
      }
      B.renameSync(Z, D), Z = D, J = !1
    } catch (K) {
      let V = K instanceof Error ? K.message : String(K);
      throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${D} if it exists and try again.

Technical details: ${V}`)
    }
    return {
      marketplace: I,
      cachePath: Z
    }
  } catch (I) {
    if (J && Z && A.source !== "file" && A.source !== "directory") try {
      if (B.existsSync(Z)) B.rmSync(Z, {
        recursive: !0,
        force: !0
      })
    } catch (D) {
      k(`Warning: Failed to clean up temporary marketplace cache at ${Z}: ${D instanceof Error?D.message:String(D)}`, {
        level: "warn"
      })
    }
    throw I
  }
}
// @from(Ln 264678, Col 0)
async function NS(A, Q) {
  if (!H4A(A)) {
    if (AyA(A)) throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy.`);
    let J = WVA() || [];
    throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy. ` + (J.length > 0 ? `Allowed sources: ${J.map((X)=>KVA(X)).join(", ")}` : "No external marketplaces are allowed."))
  }
  let {
    marketplace: B,
    cachePath: G
  } = await VI0(A, Q), Z = c62(B.name, A);
  if (Z) throw Error(Z);
  let Y = await D5();
  if (Y[B.name]) throw Error(`Marketplace '${B.name}' is already installed. Please remove it first using '/plugin marketplace remove ${B.name}' if you want to re-install it.`);
  return Y[B.name] = {
    source: A,
    installLocation: G,
    lastUpdated: new Date().toISOString()
  }, await FVA(Y), k(`Added marketplace source: ${B.name}`), {
    name: B.name
  }
}
// @from(Ln 264699, Col 0)
async function _Z1(A) {
  let Q = await D5();
  if (!Q[A]) throw Error(`Marketplace '${A}' not found`);
  delete Q[A], await FVA(Q);
  let B = vA(),
    G = Z32(),
    Z = sC(G, A);
  if (B.existsSync(Z)) B.rmSync(Z, {
    recursive: !0,
    force: !0
  });
  let Y = sC(G, `${A}.json`);
  if (B.existsSync(Y)) B.rmSync(Y, {
    force: !0
  });
  let J = ["userSettings", "projectSettings", "localSettings"];
  for (let X of J) {
    let I = dB(X);
    if (!I) continue;
    let D = !1,
      W = {};
    if (I.extraKnownMarketplaces?.[A]) {
      let K = {
        ...I.extraKnownMarketplaces
      };
      delete K[A], W.extraKnownMarketplaces = K, D = !0
    }
    if (I.enabledPlugins) {
      let K = `@${A}`,
        V = {
          ...I.enabledPlugins
        },
        F = !1;
      for (let H in V)
        if (H.endsWith(K)) delete V[H], F = !0;
      if (F) W.enabledPlugins = V, D = !0
    }
    if (D) {
      let K = pB(X, W);
      if (K.error) e(K.error), k(`Failed to clean up marketplace '${A}' from ${X} settings: ${K.error.message}`);
      else k(`Cleaned up marketplace '${A}' from ${X} settings`)
    }
  }
  k(`Removed marketplace source: ${A}`)
}
// @from(Ln 264745, Col 0)
function FI0(A) {
  let Q = vA();
  try {
    let B = A;
    if (Q.existsSync(A) && Q.statSync(A).isDirectory()) {
      let G = sC(A, ".claude-plugin", "marketplace.json");
      if (Q.existsSync(G)) B = G;
      else throw Error(`Invalid cached directory at ${A}: missing .claude-plugin/marketplace.json`)
    }
    if (!Q.existsSync(B)) throw Error(`Marketplace file not found at ${B}`);
    return J32(B, JVA)
  } catch (B) {
    if (B instanceof Hq) throw B;
    throw B
  }
}
// @from(Ln 264762, Col 0)
function e75(A) {
  let Q = vA(),
    B = MZ1();
  if (!Q.existsSync(B)) return null;
  try {
    let G = Q.readFileSync(B, {
        encoding: "utf-8"
      }),
      Y = AQ(G)[A];
    if (!Y) return null;
    return FI0(Y.installLocation)
  } catch {
    return null
  }
}
// @from(Ln 264778, Col 0)
function HI0(A) {
  let Q = A.split("@");
  if (Q.length !== 2) return null;
  let B = Q[0],
    G = Q[1],
    Z = vA(),
    Y = MZ1();
  if (!Z.existsSync(Y)) return null;
  try {
    let J = Z.readFileSync(Y, {
        encoding: "utf-8"
      }),
      I = AQ(J)[G];
    if (!I) return null;
    let D = e75(G);
    if (!D) return null;
    let W = D.plugins.find((K) => K.name === B);
    if (!W) return null;
    return {
      entry: W,
      marketplaceInstallLocation: I.installLocation
    }
  } catch {
    return null
  }
}
// @from(Ln 264804, Col 0)
async function NF(A) {
  let Q = HI0(A);
  if (Q) return Q;
  let B = A.split("@");
  if (B.length !== 2) return null;
  let G = B[0],
    Z = B[1];
  try {
    let J = (await D5())[Z];
    if (!J) return null;
    let I = (await rC(Z)).plugins.find((D) => D.name === G);
    if (!I) return null;
    return {
      entry: I,
      marketplaceInstallLocation: J.installLocation
    }
  } catch (Y) {
    return k(`Could not find plugin ${A}: ${Y instanceof Error?Y.message:String(Y)}`, {
      level: "debug"
    }), null
  }
}
// @from(Ln 264826, Col 0)
async function X32() {
  let A = await D5();
  for (let [Q, B] of Object.entries(A)) try {
    await VI0(B.source), A[Q].lastUpdated = new Date().toISOString()
  } catch (G) {
    k(`Failed to refresh marketplace ${Q}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    })
  }
  await FVA(A)
}
// @from(Ln 264837, Col 0)
async function Rr(A, Q) {
  let B = await D5(),
    G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(B).join(", ")}`);
  rC.cache?.delete?.(A);
  try {
    let {
      installLocation: Z,
      source: Y
    } = G;
    if (Y.source === "github" || Y.source === "git") await VVA(Y.source === "github" ? `git@github.com:${Y.repo}.git` : Y.url, Z, Y.ref, Q);
    else if (Y.source === "url") await Y32(Y.url, Z, Y.headers, Q);
    else if (Y.source === "file" || Y.source === "directory") b_(Q, "Validating local marketplace"), FI0(Z);
    else throw Error("Unsupported marketplace source type for refresh");
    B[A].lastUpdated = new Date().toISOString(), await FVA(B), k(`Successfully refreshed marketplace: ${A}`)
  } catch (Z) {
    let Y = Z instanceof Error ? Z.message : String(Z);
    throw k(`Failed to refresh marketplace ${A}: ${Y}`, {
      level: "error"
    }), Error(`Failed to refresh marketplace '${A}': ${Y}`)
  }
}
// @from(Ln 264859, Col 0)
async function I32(A, Q) {
  let B = await D5(),
    G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(B).join(", ")}`);
  if (G.autoUpdate === Q) return;
  B[A] = {
    ...G,
    autoUpdate: Q
  }, await FVA(B), k(`Set autoUpdate=${Q} for marketplace: ${A}`)
}
// @from(Ln 264869, Col 4)
i75
// @from(Ln 264869, Col 9)
rC
// @from(Ln 264870, Col 4)
HI = w(() => {
  j5();
  Y9();
  fQ();
  DQ();
  A0();
  T1();
  v1();
  t4();
  XX();
  GB();
  pz();
  E4A();
  A0();
  i75 = {
    GIT_TERMINAL_PROMPT: "0",
    GIT_ASKPASS: ""
  };
  rC = W0(async (A) => {
    let Q = await D5(),
      B = Q[A];
    if (!B) throw Error(`Marketplace '${A}' not found in configuration. Available marketplaces: ${Object.keys(Q).join(", ")}`);
    try {
      return FI0(B.installLocation)
    } catch (Z) {
      k(`Cache corrupted or missing for marketplace ${A}, re-fetching from source: ${Z instanceof Error?Z.message:String(Z)}`, {
        level: "warn"
      })
    }
    let {
      marketplace: G
    } = await VI0(B.source);
    return Q[A].lastUpdated = new Date().toISOString(), await FVA(Q), G
  })
})
// @from(Ln 264905, Col 0)
async function Od(A, Q, B, G, Z) {
  if (B?.version) return k(`Using manifest version for ${A}: ${B.version}`), B.version;
  if (Z) return k(`Using provided version for ${A}: ${Z}`), Z;
  if (G) {
    let Y = await AG5(G);
    if (Y) {
      let J = Y.substring(0, 12);
      return k(`Using git SHA for ${A}: ${J}`), J
    }
  }
  return k(`No version found for ${A}, using 'unknown'`), "unknown"
}
// @from(Ln 264917, Col 0)
async function AG5(A) {
  try {
    let Q = await J2("git", ["rev-parse", "HEAD"], {
      cwd: A
    });
    if (Q.code === 0 && Q.stdout) return Q.stdout.trim();
    return null
  } catch {
    return null
  }
}
// @from(Ln 264928, Col 4)
jZ1 = w(() => {
  t4();
  T1()
})
// @from(Ln 264933, Col 0)
function HVA(A) {
  if (A.includes("@")) {
    let Q = A.split("@");
    return {
      name: Q[0] || "",
      marketplace: Q[1]
    }
  }
  return {
    name: A
  }
}
// @from(Ln 264946, Col 0)
function Pb(A) {
  if (A === "managed") throw Error("Cannot install plugins to managed scope");
  return QG5[A]
}
// @from(Ln 264951, Col 0)
function W32(A) {
  return D32[A]
}
// @from(Ln 264954, Col 4)
D32
// @from(Ln 264954, Col 9)
QG5
// @from(Ln 264955, Col 4)
z4A = w(() => {
  D32 = {
    policySettings: "managed",
    userSettings: "user",
    projectSettings: "project",
    localSettings: "local",
    flagSettings: "flag"
  };
  QG5 = {
    user: "userSettings",
    project: "projectSettings",
    local: "localSettings"
  }
})
// @from(Ln 264974, Col 0)
function ByA() {
  return _r(zQ(), "plugins", "installed_plugins.json")
}
// @from(Ln 264978, Col 0)
function BG5() {
  return _r(zQ(), "plugins", "installed_plugins_v2.json")
}
// @from(Ln 264982, Col 0)
function GG5() {
  if (EI0) return;
  let A = vA(),
    Q = ByA(),
    B = BG5();
  try {
    let G = A.existsSync(B),
      Z = A.existsSync(Q);
    if (G) {
      A.renameSync(B, Q), k("Renamed installed_plugins_v2.json to installed_plugins.json");
      let Y = f_();
      K32(Y)
    } else if (Z) {
      let Y = A.readFileSync(Q, {
          encoding: "utf-8"
        }),
        J = AQ(Y);
      if ((typeof J?.version === "number" ? J.version : 1) === 1) {
        let I = sxA.parse(J),
          D = CI0(I);
        bB(Q, eA(D, null, 2), {
          encoding: "utf-8",
          flush: !0
        }), k(`Converted installed_plugins.json from V1 to V2 format (${Object.keys(I.plugins).length} plugins)`), K32(D)
      }
    }
    EI0 = !0
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    k(`Failed to migrate plugin files: ${Z}`, {
      level: "error"
    }), e(G instanceof Error ? G : Error(`Failed to migrate plugin files: ${Z}`)), EI0 = !0
  }
}
// @from(Ln 265017, Col 0)
function K32(A) {
  let Q = vA(),
    B = Tr();
  if (!Q.existsSync(B)) return;
  try {
    let G = new Set;
    for (let Y of Object.values(A.plugins))
      for (let J of Y) G.add(J.installPath);
    let Z = Q.readdirSync(B);
    for (let Y of Z) {
      if (!Y.isDirectory()) continue;
      let J = Y.name,
        X = _r(B, J);
      if (Q.readdirSync(X).some((W) => {
          if (!W.isDirectory()) return !1;
          let K = _r(X, W.name);
          return Q.readdirSync(K).some((F) => F.isDirectory())
        })) continue;
      if (!G.has(X)) Q.rmSync(X, {
        recursive: !0,
        force: !0
      }), k(`Cleaned up legacy cache directory: ${J}`)
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    k(`Failed to clean up legacy cache: ${Z}`, {
      level: "warn"
    })
  }
}
// @from(Ln 265048, Col 0)
function $I0() {
  let A = vA(),
    Q = ByA();
  if (!A.existsSync(Q)) return null;
  let B = A.readFileSync(Q, {
      encoding: "utf-8"
    }),
    G = AQ(B);
  return {
    version: typeof G?.version === "number" ? G.version : 1,
    data: G
  }
}
// @from(Ln 265062, Col 0)
function CI0(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.plugins)) {
    let Z = xb(B, G.version);
    Q[B] = [{
      scope: "user",
      installPath: Z,
      version: G.version,
      installedAt: G.installedAt,
      lastUpdated: G.lastUpdated,
      gitCommitSha: G.gitCommitSha
    }]
  }
  return {
    version: 2,
    plugins: Q
  }
}
// @from(Ln 265081, Col 0)
function f_() {
  if (Sb !== null) return Sb;
  let A = ByA();
  try {
    let Q = $I0();
    if (Q) {
      if (Q.version === 2) {
        let Z = txA.parse(Q.data);
        return Sb = Z, k(`Loaded ${Object.keys(Z.plugins).length} installed plugins from ${A}`), Z
      }
      let B = sxA.parse(Q.data),
        G = CI0(B);
      return Sb = G, k(`Loaded and converted ${Object.keys(B.plugins).length} plugins from V1 format`), G
    }
    return k("installed_plugins.json doesn't exist, returning empty V2 object"), Sb = {
      version: 2,
      plugins: {}
    }, Sb
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return k(`Failed to load installed_plugins.json: ${B}. Starting with empty state.`, {
      level: "error"
    }), e(Q instanceof Error ? Q : Error(`Failed to load installed_plugins.json: ${B}`)), Sb = {
      version: 2,
      plugins: {}
    }, Sb
  }
}
// @from(Ln 265110, Col 0)
function UI0(A) {
  let Q = vA(),
    B = ByA();
  try {
    let G = _r(zQ(), "plugins");
    if (!Q.existsSync(G)) Q.mkdirSync(G);
    let Z = eA(A, null, 2);
    bB(B, Z, {
      encoding: "utf-8",
      flush: !0
    }), Sb = A, k(`Saved ${Object.keys(A.plugins).length} installed plugins to ${B}`)
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    throw e(G instanceof Error ? G : Error(`Failed to save installed_plugins.json: ${Z}`)), G
  }
}
// @from(Ln 265127, Col 0)
function F32(A, Q, B) {
  let G = f_(),
    Z = G.plugins[A];
  if (!Z) return;
  if (G.plugins[A] = Z.filter((Y) => !(Y.scope === Q && Y.projectPath === B)), G.plugins[A].length === 0) delete G.plugins[A];
  UI0(G), k(`Removed installation for ${A} at scope ${Q}`)
}
// @from(Ln 265135, Col 0)
function qI0() {
  if (zI0 === null) zI0 = f_();
  return zI0
}
// @from(Ln 265140, Col 0)
function jr() {
  try {
    let A = $I0();
    if (A) {
      if (A.version === 2) return txA.parse(A.data);
      let Q = sxA.parse(A.data);
      return CI0(Q)
    }
    return {
      version: 2,
      plugins: {}
    }
  } catch (A) {
    let Q = A instanceof Error ? A.message : String(A);
    return k(`Failed to load installed plugins from disk: ${Q}`, {
      level: "error"
    }), {
      version: 2,
      plugins: {}
    }
  }
}
// @from(Ln 265163, Col 0)
function H32(A, Q, B, G, Z) {
  let Y = jr(),
    J = Y.plugins[A];
  if (!J) {
    k(`Cannot update ${A} on disk: plugin not found in installed plugins`);
    return
  }
  let X = J.find((I) => I.scope === Q && I.projectPath === B);
  if (X) {
    X.installPath = G, X.version = Z, X.lastUpdated = new Date().toISOString();
    let I = ByA();
    bB(I, eA(Y, null, 2), {
      encoding: "utf-8",
      flush: !0
    }), Sb = null, k(`Updated ${A} on disk to version ${Z} at ${G}`)
  } else k(`Cannot update ${A} on disk: no installation for scope ${Q}`)
}
// @from(Ln 265180, Col 0)
async function E32() {
  GG5();
  try {
    await wI0()
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)))
  }
  let A = qI0();
  k(`Initialized versioned plugins system with ${Object.keys(A.plugins).length} plugins`)
}
// @from(Ln 265191, Col 0)
function ZG5(A) {
  let B = f_().plugins[A];
  if (!B || B.length === 0) return;
  let G = B[0];
  if (!G) return;
  return {
    version: G.version || "unknown",
    installedAt: G.installedAt || new Date().toISOString(),
    lastUpdated: G.lastUpdated,
    installPath: G.installPath,
    gitCommitSha: G.gitCommitSha
  }
}
// @from(Ln 265205, Col 0)
function tC(A) {
  return ZG5(A) !== void 0
}
// @from(Ln 265209, Col 0)
function NI0(A, Q, B = "user", G) {
  let Z = f_(),
    Y = {
      scope: B,
      installPath: Q.installPath,
      version: Q.version,
      installedAt: Q.installedAt,
      lastUpdated: Q.lastUpdated,
      gitCommitSha: Q.gitCommitSha,
      ...G && {
        projectPath: G
      }
    },
    J = Z.plugins[A] || [],
    X = J.findIndex((D) => D.scope === B && D.projectPath === G),
    I = X >= 0;
  if (I) J[X] = Y;
  else J.push(Y);
  Z.plugins[A] = J, UI0(Z), k(`${I?"Updated":"Added"} installed plugin: ${A} (scope: ${B})`)
}
// @from(Ln 265229, Col 0)
async function TZ1(A) {
  try {
    let Q = await TQ("git", ["-C", A, "rev-parse", "HEAD"]);
    if (Q.code === 0 && Q.stdout) return Q.stdout.trim();
    return
  } catch (Q) {
    k(`Failed to get git commit SHA from ${A}: ${Q}`);
    return
  }
}
// @from(Ln 265240, Col 0)
function V32(A, Q) {
  let B = vA(),
    G = _r(A, ".claude-plugin", "plugin.json");
  if (!B.existsSync(G)) return "unknown";
  try {
    let Z = B.readFileSync(G, {
      encoding: "utf-8"
    });
    return AQ(Z).version || "unknown"
  } catch {
    return k(`Could not read version from manifest for ${Q}`), "unknown"
  }
}
// @from(Ln 265253, Col 0)
async function wI0() {
  let Q = jQ().enabledPlugins || {};
  if (Object.keys(Q).length === 0) return;
  let B = $I0(),
    G = B !== null;
  if (G && B?.version === 2 && B) {
    let F = txA.safeParse(B.data);
    if (F?.success) {
      let H = F.data.plugins;
      if (Object.keys(Q).filter((z) => z.includes("@")).every((z) => {
          let $ = H[z];
          return $ && $.length > 0
        })) {
        k("All plugins already exist, skipping migration");
        return
      }
    }
  }
  k(G ? "Syncing installed_plugins.json with enabledPlugins from all settings.json files" : "Creating installed_plugins.json from settings.json files");
  let Y = vA(),
    J = new Date().toISOString(),
    X = o1(),
    I = new Map,
    D = ["userSettings", "projectSettings", "localSettings"];
  for (let F of D) {
    let E = dB(F)?.enabledPlugins || {};
    for (let z of Object.keys(E)) {
      if (!z.includes("@")) continue;
      let $ = W32(F);
      I.set(z, {
        scope: $,
        projectPath: $ === "user" ? void 0 : X
      })
    }
  }
  let W = {};
  if (G) W = {
    ...f_().plugins
  };
  let K = 0,
    V = 0;
  for (let [F, H] of I) {
    let E = W[F];
    if (E && E.length > 0) {
      let z = E[0];
      if (z && (z.scope !== H.scope || z.projectPath !== H.projectPath)) {
        if (z.scope = H.scope, H.projectPath) z.projectPath = H.projectPath;
        else delete z.projectPath;
        z.lastUpdated = J, K++, k(`Updated ${F} scope to ${H.scope} (settings.json is source of truth)`)
      }
    } else {
      let z = F.split("@"),
        $ = z[0];
      if (!$ || z.length !== 2) continue;
      try {
        let O = await NF(F);
        if (!O) {
          k(`Plugin ${F} not found in any marketplace, skipping`);
          continue
        }
        let {
          entry: L,
          marketplaceInstallLocation: M
        } = O, _, j = "unknown", x = void 0;
        if (typeof L.source === "string") _ = _r(M, L.source), j = V32(_, F), x = await TZ1(_);
        else {
          let b = Tr(),
            S = $.replace(/[^a-zA-Z0-9-_]/g, "-"),
            u = _r(b, S);
          if (!Y.existsSync(u)) {
            k(`External plugin ${F} not in cache, skipping`);
            continue
          }
          _ = u, j = V32(u, F), x = await TZ1(u)
        }
        if (j === "unknown" && L.version) j = L.version;
        if (j === "unknown" && x) j = x.substring(0, 12);
        W[F] = [{
          scope: H.scope,
          installPath: xb(F, j),
          version: j,
          installedAt: J,
          lastUpdated: J,
          gitCommitSha: x,
          ...H.projectPath && {
            projectPath: H.projectPath
          }
        }], V++, k(`Added ${F} with scope ${H.scope}`)
      } catch (O) {
        k(`Failed to add plugin ${F}: ${O}`)
      }
    }
  }
  if (!G || K > 0 || V > 0) UI0({
    version: 2,
    plugins: W
  }), k(`Sync completed: ${V} added, ${K} updated in installed_plugins.json`)
}
// @from(Ln 265351, Col 4)
EI0 = !1
// @from(Ln 265352, Col 2)
Sb = null
// @from(Ln 265353, Col 2)
zI0 = null
// @from(Ln 265354, Col 4)
PN = w(() => {
  DQ();
  A0();
  T1();
  v1();
  fQ();
  pz();
  A0();
  GB();
  z4A();
  V2();
  GK();
  t4();
  HI()
})
// @from(Ln 265370, Col 0)
function h_(A) {
  switch (A.type) {
    case "generic-error":
      return A.error;
    case "path-not-found":
      return `Path not found: ${A.path} (${A.component})`;
    case "git-auth-failed":
      return `Git authentication failed (${A.authType}): ${A.gitUrl}`;
    case "git-timeout":
      return `Git ${A.operation} timeout: ${A.gitUrl}`;
    case "network-error":
      return `Network error: ${A.url}${A.details?` - ${A.details}`:""}`;
    case "manifest-parse-error":
      return `Manifest parse error: ${A.parseError}`;
    case "manifest-validation-error":
      return `Manifest validation failed: ${A.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin ${A.pluginId} not found in marketplace ${A.marketplace}`;
    case "marketplace-not-found":
      return `Marketplace ${A.marketplace} not found`;
    case "marketplace-load-failed":
      return `Marketplace ${A.marketplace} failed to load: ${A.reason}`;
    case "repository-scan-failed":
      return `Repository scan failed: ${A.reason}`;
    case "mcp-config-invalid":
      return `MCP server ${A.serverName} invalid: ${A.validationError}`;
    case "hook-load-failed":
      return `Hook load failed: ${A.reason}`;
    case "component-load-failed":
      return `${A.component} load failed from ${A.path}: ${A.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${A.url}: ${A.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
    case "lsp-config-invalid":
      return `Plugin "${A.plugin}" has invalid LSP server config for "${A.serverName}": ${A.validationError}`;
    case "lsp-server-start-failed":
      return `Plugin "${A.plugin}" failed to start LSP server "${A.serverName}": ${A.reason}`;
    case "lsp-server-crashed":
      if (A.signal) return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with signal ${A.signal}`;
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with exit code ${A.exitCode??"unknown"}`;
    case "lsp-request-timeout":
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" timed out on ${A.method} request after ${A.timeoutMs}ms`;
    case "lsp-request-failed":
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" ${A.method} request failed: ${A.error}`;
    case "marketplace-blocked-by-policy":
      if (A.blockedByBlocklist) return `Marketplace '${A.marketplace}' is blocked by enterprise policy`;
      return `Marketplace '${A.marketplace}' is not in the allowed marketplace list`
  }
}
// @from(Ln 265426, Col 0)
function XG5(A) {
  return JG5[A] ?? "x"
}
// @from(Ln 265430, Col 0)
function GyA(A) {
  let Q = XG5(A),
    B = YG5().replace(/-/g, "").substring(0, 6);
  return `${Q}${B}`
}
// @from(Ln 265436, Col 0)
function KO(A, Q, B) {
  return {
    id: A,
    type: Q,
    status: "pending",
    description: B,
    startTime: Date.now(),
    outputFile: aY(A),
    outputOffset: 0,
    notified: !1
  }
}
// @from(Ln 265448, Col 4)
JG5
// @from(Ln 265449, Col 4)
EVA = w(() => {
  cC();
  JG5 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r"
  }
})
// @from(Ln 265458, Col 0)
function z32(A, Q) {
  let B = Object.create(null),
    G = 0;
  for (let Z of A) {
    let Y = Q(Z, G++);
    if (B[Y] === void 0) B[Y] = [];
    B[Y].push(Z)
  }
  return B
}
// @from(Ln 265469, Col 0)
function ZyA(A, Q) {
  let B = q0(),
    G = {
      type: "queue-operation",
      operation: A,
      timestamp: new Date().toISOString(),
      sessionId: B,
      ...Q !== void 0 && {
        content: Q
      }
    };
  q32(G)
}
// @from(Ln 265483, Col 0)
function wF(A, Q) {
  Q((B) => ({
    ...B,
    queuedCommands: [...B.queuedCommands, A]
  })), ZyA("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Ln 265489, Col 0)
async function $32(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return;
  let [G, ...Z] = B.queuedCommands;
  return Q((Y) => ({
    ...Y,
    queuedCommands: Z
  })), ZyA("dequeue"), G
}
// @from(Ln 265498, Col 0)
async function C32(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return [];
  let G = [...B.queuedCommands];
  Q((Z) => ({
    ...Z,
    queuedCommands: []
  }));
  for (let Z of G) ZyA("dequeue");
  return G
}
// @from(Ln 265510, Col 0)
function U32(A, Q) {
  if (A.length === 0) return;
  Q((B) => ({
    ...B,
    queuedCommands: B.queuedCommands.filter((G) => !A.some((Z) => Z.value === G.value))
  }));
  for (let B of A) ZyA("remove")
}
// @from(Ln 265519, Col 0)
function PZ1(A) {
  return !IG5.has(A)
}
// @from(Ln 265523, Col 0)
function DG5(A) {
  if (typeof A === "string") return A;
  let Q = [];
  for (let B of A)
    if (B.type === "text") Q.push(B.text);
  return Q.join(`
`)
}
// @from(Ln 265532, Col 0)
function WG5(A, Q) {
  if (typeof A === "string") return [];
  let B = [],
    G = 0;
  for (let Z of A)
    if (Z.type === "image" && Z.source.type === "base64") B.push({
      id: Q + G,
      type: "image",
      content: Z.source.data,
      mediaType: Z.source.media_type,
      filename: `image${G+1}`
    }), G++;
  return B
}
// @from(Ln 265546, Col 0)
async function SZ1(A, Q, B, G) {
  let Z = await B();
  if (Z.queuedCommands.length === 0) return;
  let {
    editable: Y = [],
    nonEditable: J = []
  } = z32(Z.queuedCommands, (V) => PZ1(V.mode) ? "editable" : "nonEditable");
  if (Y.length === 0) return;
  let X = Y.map((V) => DG5(V.value)),
    I = [...X, A].filter(Boolean).join(`
`),
    D = X.join(`
`).length + 1 + Q,
    W = [],
    K = Date.now();
  for (let V of Y) {
    let F = WG5(V.value, K);
    W.push(...F), K += F.length
  }
  for (let V of Y) ZyA("popAll", typeof V.value === "string" ? V.value : void 0);
  return G((V) => ({
    ...V,
    queuedCommands: J
  })), {
    text: I,
    cursorOffset: D,
    images: W
  }
}
// @from(Ln 265575, Col 4)
IG5
// @from(Ln 265576, Col 4)
VO = w(() => {
  d4();
  C0();
  IG5 = new Set(["task-notification"])
})
// @from(Ln 265582, Col 0)
function lz(A) {
  return A
}
// @from(Ln 265586, Col 0)
function iz(A) {
  return A
}
// @from(Ln 265590, Col 0)
function w32(A) {
  return A.isNonInteractiveSession
}
// @from(Ln 265594, Col 0)
function xZ1(A) {
  try {
    let Q = new N32.Ajv({
      allErrors: !0
    });
    if (!Q.validateSchema(A)) throw Error(`Invalid JSON Schema: ${Q.errorsText(Q.errors)}`);
    let G = Q.compile(A);
    return {
      ...LI0,
      inputJSONSchema: A,
      async call(Z) {
        if (!G(Z)) {
          let J = G.errors?.map((X) => `${X.instancePath||"root"}: ${X.message}`).join(", ");
          throw Error(`Output does not match required schema: ${J}`)
        }
        return {
          data: "Structured output provided successfully",
          structured_output: Z
        }
      }
    }
  } catch {
    return null
  }
}
// @from(Ln 265619, Col 4)
N32
// @from(Ln 265619, Col 9)
KG5
// @from(Ln 265619, Col 14)
VG5
// @from(Ln 265619, Col 19)
JE = "StructuredOutput"
// @from(Ln 265620, Col 2)
LI0
// @from(Ln 265621, Col 4)
Pr = w(() => {
  j9();
  A0();
  N32 = c(MG1(), 1), KG5 = m.object({}).passthrough(), VG5 = m.string().describe("Structured output tool result");
  LI0 = {
    isMcp: !1,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    isDestructive() {
      return !1
    },
    isOpenWorld() {
      return !1
    },
    name: JE,
    maxResultSizeChars: 1e5,
    async description() {
      return "Return structured output in the requested format"
    },
    async prompt() {
      return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."
    },
    inputSchema: KG5,
    outputSchema: VG5,
    async call(A) {
      return {
        data: "Structured output provided successfully",
        structured_output: A
      }
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage(A) {
      let Q = Object.keys(A);
      if (Q.length === 0) return null;
      if (Q.length <= 3) return Q.map((B) => `${B}: ${eA(A[B])}`).join(", ");
      return `${Q.length} fields: ${Q.slice(0,3).join(", ")}…`
    },
    userFacingName: () => JE,
    renderToolUseRejectedMessage() {
      return "Structured output rejected"
    },
    renderToolUseErrorMessage() {
      return "Structured output error"
    },
    renderToolUseProgressMessage() {
      return null
    },
    renderToolResultMessage(A) {
      return A
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A
      }
    }
  }
})
// @from(Ln 265693, Col 0)
function OI0() {
  return {
    toolUseCount: 0,
    latestInputTokens: 0,
    cumulativeOutputTokens: 0,
    recentActivities: []
  }
}
// @from(Ln 265702, Col 0)
function HG5(A) {
  return A.latestInputTokens + A.cumulativeOutputTokens
}
// @from(Ln 265706, Col 0)
function vZ1(A, Q) {
  if (Q.type !== "assistant") return;
  let B = Q.message.usage;
  A.latestInputTokens = B.input_tokens + (B.cache_creation_input_tokens ?? 0) + (B.cache_read_input_tokens ?? 0), A.cumulativeOutputTokens += B.output_tokens;
  for (let G of Q.message.content)
    if (G.type === "tool_use") {
      if (A.toolUseCount++, G.name !== JE) A.recentActivities.push({
        toolName: G.name,
        input: G.input
      })
    } while (A.recentActivities.length > FG5) A.recentActivities.shift()
}
// @from(Ln 265719, Col 0)
function MI0(A) {
  return {
    toolUseCount: A.toolUseCount,
    tokenCount: HG5(A),
    lastActivity: A.recentActivities.length > 0 ? A.recentActivities[A.recentActivities.length - 1] : void 0,
    recentActivities: [...A.recentActivities]
  }
}
// @from(Ln 265728, Col 0)
function Sr(A) {
  return typeof A === "object" && A !== null && "type" in A && A.type === "local_agent"
}
// @from(Ln 265732, Col 0)
function C4A(A, Q, B, G, Z, Y) {
  let J = B === "completed" ? `Agent "${Q}" completed` : B === "failed" ? `Agent "${Q}" failed: ${G||"Unknown error"}` : `Agent "${Q}" was stopped`,
    X = aY(A),
    I = Y ? `
<result>${Y}</result>` : "",
    D = `<${zF}>
<${IO}>${A}</${IO}>
<${hz}>${B}</${hz}>
<${gz}>${J}</${gz}>${I}
</${zF}>
Full transcript available at: ${X}`;
  wF({
    value: D,
    mode: "task-notification"
  }, Z), oY(A, Z, (W) => ({
    ...W,
    notified: !0
  }))
}
// @from(Ln 265752, Col 0)
function $4A(A, Q) {
  oY(A, Q, (B) => {
    if (B.status !== "running") return B;
    return B.abortController?.abort(), B.unregisterCleanup?.(), {
      ...B,
      status: "killed",
      endTime: Date.now()
    }
  })
}
// @from(Ln 265763, Col 0)
function RI0(A, Q, B) {
  oY(A, B, (G) => {
    if (G.status !== "running") return G;
    return {
      ...G,
      progress: Q
    }
  })
}
// @from(Ln 265773, Col 0)
function _I0(A, Q) {
  let B = A.agentId;
  oY(B, Q, (G) => {
    if (G.status !== "running") return G;
    return G.unregisterCleanup?.(), {
      ...G,
      status: "completed",
      result: A,
      endTime: Date.now()
    }
  })
}
// @from(Ln 265786, Col 0)
function jI0(A, Q, B) {
  oY(A, B, (G) => {
    if (G.status !== "running") return G;
    return G.unregisterCleanup?.(), {
      ...G,
      status: "failed",
      error: Q,
      endTime: Date.now()
    }
  })
}
// @from(Ln 265798, Col 0)
function L32({
  agentId: A,
  description: Q,
  prompt: B,
  selectedAgent: G,
  setAppState: Z
}) {
  OKA(A, yb(iz(A)));
  let Y = c9(),
    J = {
      ...KO(A, "local_agent", Q),
      type: "local_agent",
      status: "running",
      agentId: A,
      prompt: B,
      selectedAgent: G,
      agentType: G.agentType ?? "general-purpose",
      abortController: Y,
      retrieved: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: !0
    },
    X = C6(async () => {
      $4A(A, Z)
    });
  return J.unregisterCleanup = X, FO(J, Z), J
}
// @from(Ln 265827, Col 0)
function O32({
  agentId: A,
  description: Q,
  prompt: B,
  selectedAgent: G,
  setAppState: Z
}) {
  OKA(A, yb(iz(A)));
  let Y = c9(),
    J = C6(async () => {
      $4A(A, Z)
    }),
    X = {
      ...KO(A, "local_agent", Q),
      type: "local_agent",
      status: "running",
      agentId: A,
      prompt: B,
      selectedAgent: G,
      agentType: G.agentType ?? "general-purpose",
      abortController: Y,
      unregisterCleanup: J,
      retrieved: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: !1
    },
    I, D = new Promise((W) => {
      I = W
    });
  return yZ1.set(A, I), FO(X, Z), {
    taskId: A,
    backgroundSignal: D
  }
}
// @from(Ln 265863, Col 0)
function M32(A, Q, B) {
  let Z = Q().tasks[A];
  if (!Sr(Z) || Z.isBackgrounded) return !1;
  B((J) => {
    let X = J.tasks[A];
    if (!Sr(X)) return J;
    return {
      ...J,
      tasks: {
        ...J.tasks,
        [A]: {
          ...X,
          isBackgrounded: !0
        }
      }
    }
  });
  let Y = yZ1.get(A);
  if (Y) Y(), yZ1.delete(A);
  return !0
}
// @from(Ln 265885, Col 0)
function R32(A, Q) {
  yZ1.delete(A);
  let B;
  Q((G) => {
    let Z = G.tasks[A];
    if (!Sr(Z) || Z.isBackgrounded) return G;
    B = Z.unregisterCleanup;
    let {
      [A]: Y, ...J
    } = G.tasks;
    return {
      ...G,
      tasks: J
    }
  }), B?.()
}
// @from(Ln 265901, Col 4)
Md
// @from(Ln 265901, Col 8)
FG5 = 5
// @from(Ln 265902, Col 2)
kZ1
// @from(Ln 265902, Col 7)
yZ1
// @from(Ln 265903, Col 4)
YyA = w(() => {
  fA();
  EVA();
  iZ();
  nX();
  VO();
  xr();
  cC();
  d4();
  Pr();
  cD();
  Md = c(QA(), 1);
  kZ1 = {
    name: "LocalAgentTask",
    type: "local_agent",
    async spawn(A, Q) {
      let {
        prompt: B,
        description: G,
        agentType: Z,
        model: Y,
        selectedAgent: J,
        agentId: X
      } = A, {
        setAppState: I
      } = Q, D = X ?? GyA("local_agent");
      OKA(D, yb(iz(D)));
      let W = c9(),
        K = {
          ...KO(D, "local_agent", G),
          type: "local_agent",
          status: "running",
          agentId: D,
          prompt: B,
          selectedAgent: J,
          agentType: Z,
          model: Y,
          abortController: W,
          retrieved: !1,
          lastReportedToolCount: 0,
          lastReportedTokenCount: 0,
          isBackgrounded: !0
        },
        V = C6(async () => {
          $4A(D, I)
        });
      return K.unregisterCleanup = V, FO(K, I), {
        taskId: D,
        cleanup: () => {
          V(), W.abort()
        }
      }
    },
    async kill(A, Q) {
      $4A(A, Q.setAppState)
    },
    renderStatus(A) {
      let Q = A,
        B = Q.status,
        G = Q.description,
        Z = Q.progress,
        Y = B === "running" ? "warning" : B === "completed" ? "success" : B === "failed" ? "error" : "inactive",
        J = Z ? ` (${Z.toolUseCount} tools, ${Z.tokenCount} tokens)` : "";
      return Md.createElement(T, null, Md.createElement(C, {
        color: Y
      }, "[", B, "] ", G, J))
    },
    renderOutput(A) {
      return Md.createElement(T, null, Md.createElement(C, null, A))
    },
    getProgressMessage(A) {
      let Q = A,
        B = Q.progress;
      if (!B) return null;
      let G = B.toolUseCount - Q.lastReportedToolCount,
        Z = B.tokenCount - Q.lastReportedTokenCount;
      if (G === 0 && Z === 0) return null;
      let Y = [];
      if (G > 0) Y.push(`${G} new tool${G>1?"s":""} used`);
      if (Z > 0) Y.push(`${Z} new tokens`);
      return `Agent ${A.id} progress: ${Y.join(", ")}. The agent is still running. You usually do not need to read ${A.outputFile} unless you need specific details right away. You will receive a notification when the agent is done.`
    }
  };
  yZ1 = new Map
})
// @from(Ln 265989, Col 0)
function yr({
  isFocused: A,
  isSelected: Q,
  children: B,
  description: G,
  shouldShowDownArrow: Z,
  shouldShowUpArrow: Y
}) {
  return vb.default.createElement(T, {
    flexDirection: "column"
  }, vb.default.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, A ? vb.default.createElement(C, {
    color: "suggestion"
  }, tA.pointer) : Z ? vb.default.createElement(C, {
    dimColor: !0
  }, tA.arrowDown) : Y ? vb.default.createElement(C, {
    dimColor: !0
  }, tA.arrowUp) : vb.default.createElement(C, null, " "), B, Q && vb.default.createElement(C, {
    color: "success"
  }, tA.tick)), G && vb.default.createElement(T, {
    paddingLeft: 5
  }, vb.default.createElement(C, {
    color: "inactive"
  }, G)))
}
// @from(Ln 266016, Col 4)
vb
// @from(Ln 266017, Col 4)
bZ1 = w(() => {
  B2();
  fA();
  vb = c(QA(), 1)
})
// @from(Ln 266022, Col 4)
fZ1
// @from(Ln 266023, Col 4)
_32 = w(() => {
  fZ1 = class fZ1 extends Map {
    first;
    last;
    constructor(A) {
      let Q = [],
        B, G, Z, Y = 0;
      for (let J of A) {
        let X = {
          label: J.label,
          value: J.value,
          description: J.description,
          previous: Z,
          next: void 0,
          index: Y
        };
        if (Z) Z.next = X;
        B ||= X, G = X, Q.push([J.value, X]), Y++, Z = X
      }
      super(Q);
      this.first = B, this.last = G
    }
  }
})
// @from(Ln 266051, Col 0)
function hZ1({
  visibleOptionCount: A = 5,
  options: Q,
  initialFocusValue: B,
  onFocus: G,
  focusValue: Z
}) {
  let [Y, J] = XE.useReducer(zG5, {
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: Z || B
  }, j32), [X, I] = XE.useState(Q);
  if (Q !== X && !EG5(Q, X)) J({
    type: "reset",
    state: j32({
      visibleOptionCount: A,
      options: Q,
      initialFocusValue: Z ?? Y.focusedValue ?? B,
      currentViewport: {
        visibleFromIndex: Y.visibleFromIndex,
        visibleToIndex: Y.visibleToIndex
      }
    })
  }), I(Q);
  let D = XE.useCallback(() => {
      J({
        type: "focus-next-option"
      })
    }, []),
    W = XE.useCallback(() => {
      J({
        type: "focus-previous-option"
      })
    }, []),
    K = XE.useCallback(() => {
      J({
        type: "focus-next-page"
      })
    }, []),
    V = XE.useCallback(() => {
      J({
        type: "focus-previous-page"
      })
    }, []),
    F = XE.useCallback(($) => {
      if ($ !== void 0) J({
        type: "set-focus",
        value: $
      })
    }, []),
    H = XE.useMemo(() => {
      return Q.map(($, O) => ({
        ...$,
        index: O
      })).slice(Y.visibleFromIndex, Y.visibleToIndex)
    }, [Q, Y.visibleFromIndex, Y.visibleToIndex]),
    E = XE.useMemo(() => {
      if (Y.focusedValue === void 0) return;
      if (Q.some((O) => O.value === Y.focusedValue)) return Y.focusedValue;
      return Q[0]?.value
    }, [Y.focusedValue, Q]),
    z = XE.useMemo(() => {
      return Q.find((O) => O.value === E)?.type === "input"
    }, [E, Q]);
  return XE.useEffect(() => {
    if (E !== void 0) G?.(E)
  }, [E, G]), XE.useEffect(() => {
    if (Z !== void 0) J({
      type: "set-focus",
      value: Z
    })
  }, [Z]), {
    focusedValue: E,
    visibleFromIndex: Y.visibleFromIndex,
    visibleToIndex: Y.visibleToIndex,
    visibleOptions: H,
    isInInput: z ?? !1,
    focusNextOption: D,
    focusPreviousOption: W,
    focusNextPage: K,
    focusPreviousPage: V,
    focusOption: F,
    options: Q
  }
}
// @from(Ln 266136, Col 4)
XE
// @from(Ln 266136, Col 8)
zG5 = (A, Q) => {
    switch (Q.type) {
      case "focus-next-option": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = B.next || A.optionMap.first;
        if (!G) return A;
        if (!B.next && G === A.optionMap.first) return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: 0,
          visibleToIndex: A.visibleOptionCount
        };
        if (!(G.index >= A.visibleToIndex)) return {
          ...A,
          focusedValue: G.value
        };
        let Y = Math.min(A.optionMap.size, A.visibleToIndex + 1),
          J = Y - A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: J,
          visibleToIndex: Y
        }
      }
      case "focus-previous-option": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = B.previous || A.optionMap.last;
        if (!G) return A;
        if (!B.previous && G === A.optionMap.last) {
          let X = A.optionMap.size,
            I = Math.max(0, X - A.visibleOptionCount);
          return {
            ...A,
            focusedValue: G.value,
            visibleFromIndex: I,
            visibleToIndex: X
          }
        }
        if (!(G.index <= A.visibleFromIndex)) return {
          ...A,
          focusedValue: G.value
        };
        let Y = Math.max(0, A.visibleFromIndex - 1),
          J = Y + A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: Y,
          visibleToIndex: J
        }
      }
      case "focus-next-page": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = Math.min(A.optionMap.size - 1, B.index + A.visibleOptionCount),
          Z = A.optionMap.first;
        while (Z && Z.index < G)
          if (Z.next) Z = Z.next;
          else break;
        if (!Z) return A;
        let Y = Math.min(A.optionMap.size, Z.index + 1),
          J = Math.max(0, Y - A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Z.value,
          visibleFromIndex: J,
          visibleToIndex: Y
        }
      }
      case "focus-previous-page": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = Math.max(0, B.index - A.visibleOptionCount),
          Z = A.optionMap.first;
        while (Z && Z.index < G)
          if (Z.next) Z = Z.next;
          else break;
        if (!Z) return A;
        let Y = Math.max(0, Z.index),
          J = Math.min(A.optionMap.size, Y + A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Z.value,
          visibleFromIndex: Y,
          visibleToIndex: J
        }
      }
      case "reset":
        return Q.state;
      case "set-focus": {
        if (A.focusedValue === Q.value) return A;
        let B = A.optionMap.get(Q.value);
        if (!B) return A;
        if (B.index >= A.visibleFromIndex && B.index < A.visibleToIndex) return {
          ...A,
          focusedValue: Q.value
        };
        let G, Z;
        if (B.index < A.visibleFromIndex) G = B.index, Z = Math.min(A.optionMap.size, G + A.visibleOptionCount);
        else Z = Math.min(A.optionMap.size, B.index + 1), G = Math.max(0, Z - A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Q.value,
          visibleFromIndex: G,
          visibleToIndex: Z
        }
      }
    }
  }
// @from(Ln 266252, Col 2)
j32 = ({
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: B,
    currentViewport: G
  }) => {
    let Z = typeof A === "number" ? Math.min(A, Q.length) : Q.length,
      Y = new fZ1(Q),
      J = B !== void 0 && Y.get(B),
      X = J ? B : Y.first?.value,
      I = 0,
      D = Z;
    if (J) {
      let W = J.index;
      if (G)
        if (W >= G.visibleFromIndex && W < G.visibleToIndex) I = G.visibleFromIndex, D = Math.min(Y.size, G.visibleToIndex);
        else if (W < G.visibleFromIndex) I = W, D = Math.min(Y.size, I + Z);
      else D = Math.min(Y.size, W + 1), I = Math.max(0, D - Z);
      else if (W >= Z) D = Math.min(Y.size, W + 1), I = Math.max(0, D - Z);
      I = Math.max(0, Math.min(I, Y.size - 1)), D = Math.min(Y.size, Math.max(Z, D))
    }
    return {
      optionMap: Y,
      visibleOptionCount: Z,
      focusedValue: X,
      visibleFromIndex: I,
      visibleToIndex: D
    }
  }
// @from(Ln 266281, Col 4)
TI0 = w(() => {
  _32();
  XE = c(QA(), 1)
})
// @from(Ln 266286, Col 0)
function T32({
  visibleOptionCount: A = 5,
  options: Q,
  defaultValue: B,
  onChange: G,
  onCancel: Z,
  onFocus: Y,
  focusValue: J
}) {
  let [X, I] = gZ1.useState(B), D = hZ1({
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: void 0,
    onFocus: Y,
    focusValue: J
  }), W = gZ1.useCallback(() => {
    I(D.focusedValue)
  }, [D.focusedValue]);
  return {
    ...D,
    value: X,
    selectFocusedOption: W,
    onChange: G,
    onCancel: Z
  }
}
// @from(Ln 266312, Col 4)
gZ1
// @from(Ln 266313, Col 4)
P32 = w(() => {
  TI0();
  gZ1 = c(QA(), 1)
})
// @from(Ln 266317, Col 4)
S32 = ({
  isDisabled: A = !1,
  disableSelection: Q = !1,
  state: B,
  options: G,
  isMultiSelect: Z = !1,
  onUpFromFirstItem: Y,
  onInputModeToggle: J,
  inputValues: X
}) => {
  J0((I, D) => {
    let W = G.find((V) => V.value === B.focusedValue),
      K = W?.type === "input";
    if (D.tab && J && B.focusedValue !== void 0) {
      J(B.focusedValue);
      return
    }
    if (K) {
      let V = D.upArrow || D.downArrow || D.escape || D.ctrl && (I === "n" || I === "p");
      if (/^[0-9]$/.test(I) && W?.type === "input")
        if (!(X?.get(B.focusedValue) ?? "").trim());
        else return;
      else if (!V) return
    }
    if (D.downArrow || D.ctrl && I === "n" || !D.ctrl && !D.shift && I === "j") B.focusNextOption();
    if (D.upArrow || D.ctrl && I === "p" || !D.ctrl && !D.shift && I === "k") {
      if (Y && B.visibleFromIndex === 0) {
        let V = G[0];
        if (V && B.focusedValue === V.value) {
          Y();
          return
        }
      }
      B.focusPreviousOption()
    }
    if (D.pageDown) B.focusNextPage();
    if (D.pageUp) B.focusPreviousPage();
    if (Q !== !0) {
      if ((Z ? D.return || I === " " : D.return) && B.focusedValue !== void 0) {
        if (W?.disabled !== !0) B.selectFocusedOption?.(), B.onChange?.(B.focusedValue)
      }
      if (Q !== "numeric" && /^[0-9]+$/.test(I)) {
        let F = parseInt(I) - 1;
        if (F >= 0 && F < B.options.length) {
          let H = B.options[F];
          if (H.disabled === !0) return;
          if (H.type === "input") {
            let E = X?.get(H.value) ?? "";
            if (H.allowEmptySubmit && !E.trim()) {
              B.onChange?.(H.value);
              return
            }
            B.focusOption(H.value);
            return
          }
          B.onChange?.(H.value);
          return
        }
      }
    }
    if (D.escape) B.onCancel?.()
  }, {
    isActive: !A
  })
}
// @from(Ln 266382, Col 4)
x32 = w(() => {
  fA()
})
// @from(Ln 266386, Col 0)
function zVA({
  option: A,
  isFocused: Q,
  isSelected: B,
  shouldShowDownArrow: G,
  shouldShowUpArrow: Z,
  maxIndexWidth: Y,
  index: J,
  inputValue: X,
  onInputChange: I,
  onSubmit: D,
  onExit: W,
  layout: K,
  children: V,
  showLabel: F = !1
}) {
  let H = F || A.showLabelWithValue === !0,
    [E, z] = ZK.useState(X.length),
    $ = K === "expanded" ? Y + 3 : Y + 4;
  return ZK.default.createElement(T, {
    flexDirection: "column",
    flexShrink: 0
  }, ZK.default.createElement(yr, {
    isFocused: Q,
    isSelected: B,
    shouldShowDownArrow: G,
    shouldShowUpArrow: Z
  }, ZK.default.createElement(T, {
    flexDirection: "row",
    flexShrink: K === "compact" ? 0 : void 0
  }, ZK.default.createElement(C, {
    dimColor: !0
  }, `${J}.`.padEnd(Y + 2)), V, H ? ZK.default.createElement(ZK.default.Fragment, null, ZK.default.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, A.label), Q ? ZK.default.createElement(ZK.default.Fragment, null, ZK.default.createElement(C, {
    color: "suggestion"
  }, A.labelValueSeparator ?? ", "), ZK.default.createElement(p4, {
    value: X,
    onChange: (O) => {
      I(O), A.onChange(O)
    },
    onSubmit: D,
    onExit: W,
    placeholder: A.placeholder,
    focus: !0,
    showCursor: !0,
    cursorOffset: E,
    onChangeCursorOffset: z,
    columns: 80
  })) : X && ZK.default.createElement(C, null, A.labelValueSeparator ?? ", ", X)) : Q ? ZK.default.createElement(p4, {
    value: X,
    onChange: (O) => {
      I(O), A.onChange(O)
    },
    onSubmit: D,
    onExit: W,
    placeholder: A.placeholder || (typeof A.label === "string" ? A.label : void 0),
    focus: !0,
    showCursor: !0,
    cursorOffset: E,
    onChangeCursorOffset: z,
    columns: 80
  }) : ZK.default.createElement(C, {
    color: X ? void 0 : "inactive"
  }, X || A.placeholder || A.label))), A.description && ZK.default.createElement(T, {
    paddingLeft: $
  }, ZK.default.createElement(C, {
    dimColor: A.dimDescription !== !1,
    color: B ? "success" : Q ? "suggestion" : void 0
  }, A.description)), K === "expanded" && ZK.default.createElement(C, null, " "))
}
// @from(Ln 266457, Col 4)
ZK
// @from(Ln 266458, Col 4)
PI0 = w(() => {
  fA();
  bZ1();
  IY();
  ZK = c(QA(), 1)
})
// @from(Ln 266465, Col 0)
function k0({
  isDisabled: A = !1,
  hideIndexes: Q = !1,
  visibleOptionCount: B = 5,
  highlightText: G,
  options: Z,
  defaultValue: Y,
  onCancel: J,
  onChange: X,
  onFocus: I,
  defaultFocusValue: D,
  layout: W = "compact",
  disableSelection: K = !1,
  inlineDescriptions: V = !1,
  onUpFromFirstItem: F,
  onInputModeToggle: H
}) {
  let [E, z] = h9.useState(() => {
    let x = new Map;
    return Z.forEach((b) => {
      if (b.type === "input" && b.initialValue) x.set(b.value, b.initialValue)
    }), x
  }), $ = T32({
    visibleOptionCount: B,
    options: Z,
    defaultValue: Y,
    onChange: X,
    onCancel: J,
    onFocus: I,
    focusValue: D
  });
  S32({
    isDisabled: A,
    disableSelection: K || (Q ? "numeric" : !1),
    state: $,
    options: Z,
    isMultiSelect: !1,
    onUpFromFirstItem: F,
    onInputModeToggle: H,
    inputValues: E
  });
  let O = {
    container: () => ({
      flexDirection: "column"
    }),
    highlightedText: () => ({
      bold: !0
    })
  };
  if (W === "expanded") {
    let x = $.options.length.toString().length;
    return h9.default.createElement(T, {
      ...O.container()
    }, $.visibleOptions.map((b, S) => {
      let u = b.index === $.visibleFromIndex,
        f = b.index === $.visibleToIndex - 1,
        AA = $.visibleToIndex < Z.length,
        n = $.visibleFromIndex > 0,
        y = $.visibleFromIndex + S + 1,
        p = !A && $.focusedValue === b.value,
        GA = $.value === b.value;
      if (b.type === "input") {
        let bA = E.has(b.value) ? E.get(b.value) : b.initialValue || "";
        return h9.default.createElement(zVA, {
          key: String(b.value),
          option: b,
          isFocused: p,
          isSelected: GA,
          shouldShowDownArrow: AA && f,
          shouldShowUpArrow: n && u,
          maxIndexWidth: x,
          index: y,
          inputValue: bA,
          onInputChange: (jA) => {
            z((OA) => {
              let IA = new Map(OA);
              return IA.set(b.value, jA), IA
            })
          },
          onSubmit: (jA) => {
            if (jA.trim() || b.allowEmptySubmit) X?.(b.value);
            else J?.()
          },
          onExit: J,
          layout: "expanded",
          showLabel: V
        })
      }
      let WA = b.label;
      if (typeof b.label === "string" && G && b.label.includes(G)) {
        let bA = b.label,
          jA = bA.indexOf(G);
        WA = h9.default.createElement(h9.default.Fragment, null, bA.slice(0, jA), h9.default.createElement(C, {
          ...O.highlightedText()
        }, G), bA.slice(jA + G.length))
      }
      let MA = b.disabled === !0,
        TA = MA ? void 0 : GA ? "success" : p ? "suggestion" : void 0;
      return h9.default.createElement(T, {
        key: String(b.value),
        flexDirection: "column",
        flexShrink: 0
      }, h9.default.createElement(yr, {
        isFocused: p,
        isSelected: GA,
        shouldShowDownArrow: AA && f,
        shouldShowUpArrow: n && u
      }, h9.default.createElement(C, {
        dimColor: MA,
        color: TA
      }, WA)), b.description && h9.default.createElement(T, {
        paddingLeft: 2
      }, h9.default.createElement(C, {
        dimColor: MA || b.dimDescription !== !1,
        color: TA
      }, h9.default.createElement(M8, null, b.description))), h9.default.createElement(C, null, " "))
    }))
  }
  if (W === "compact-vertical") {
    let x = Q ? 0 : $.options.length.toString().length;
    return h9.default.createElement(T, {
      ...O.container()
    }, $.visibleOptions.map((b, S) => {
      let u = b.index === $.visibleFromIndex,
        f = b.index === $.visibleToIndex - 1,
        AA = $.visibleToIndex < Z.length,
        n = $.visibleFromIndex > 0,
        y = $.visibleFromIndex + S + 1,
        p = !A && $.focusedValue === b.value,
        GA = $.value === b.value;
      if (b.type === "input") {
        let TA = E.has(b.value) ? E.get(b.value) : b.initialValue || "";
        return h9.default.createElement(zVA, {
          key: String(b.value),
          option: b,
          isFocused: p,
          isSelected: GA,
          shouldShowDownArrow: AA && f,
          shouldShowUpArrow: n && u,
          maxIndexWidth: x,
          index: y,
          inputValue: TA,
          onInputChange: (bA) => {
            z((jA) => {
              let OA = new Map(jA);
              return OA.set(b.value, bA), OA
            })
          },
          onSubmit: (bA) => {
            if (bA.trim() || b.allowEmptySubmit) X?.(b.value);
            else J?.()
          },
          onExit: J,
          layout: "compact",
          showLabel: V
        })
      }
      let WA = b.label;
      if (typeof b.label === "string" && G && b.label.includes(G)) {
        let TA = b.label,
          bA = TA.indexOf(G);
        WA = h9.default.createElement(h9.default.Fragment, null, TA.slice(0, bA), h9.default.createElement(C, {
          ...O.highlightedText()
        }, G), TA.slice(bA + G.length))
      }
      let MA = b.disabled === !0;
      return h9.default.createElement(T, {
        key: String(b.value),
        flexDirection: "column",
        flexShrink: 0
      }, h9.default.createElement(yr, {
        isFocused: p,
        isSelected: GA,
        shouldShowDownArrow: AA && f,
        shouldShowUpArrow: n && u
      }, h9.default.createElement(h9.default.Fragment, null, !Q && h9.default.createElement(C, {
        dimColor: !0
      }, `${y}.`.padEnd(x + 1)), h9.default.createElement(C, {
        dimColor: MA,
        color: MA ? void 0 : GA ? "success" : p ? "suggestion" : void 0
      }, WA))), b.description && h9.default.createElement(T, {
        paddingLeft: Q ? 2 : x + 4
      }, h9.default.createElement(C, {
        dimColor: MA || b.dimDescription !== !1,
        color: MA ? void 0 : GA ? "success" : p ? "suggestion" : void 0
      }, h9.default.createElement(M8, null, b.description))))
    }))
  }
  let L = Q ? 0 : $.options.length.toString().length,
    M = $.visibleOptions.some((x) => x.type === "input"),
    _ = !V && !M && $.visibleOptions.some((x) => x.description),
    j = $.visibleOptions.map((x, b) => {
      let S = x.index === $.visibleFromIndex,
        u = x.index === $.visibleToIndex - 1,
        f = $.visibleToIndex < Z.length,
        AA = $.visibleFromIndex > 0,
        n = $.visibleFromIndex + b + 1,
        y = !A && $.focusedValue === x.value,
        p = $.value === x.value,
        GA = x.disabled === !0,
        WA = x.label;
      if (typeof x.label === "string" && G && x.label.includes(G)) {
        let MA = x.label,
          TA = MA.indexOf(G);
        WA = h9.default.createElement(h9.default.Fragment, null, MA.slice(0, TA), h9.default.createElement(C, {
          ...O.highlightedText()
        }, G), MA.slice(TA + G.length))
      }
      return {
        option: x,
        index: n,
        label: WA,
        isFocused: y,
        isSelected: p,
        isOptionDisabled: GA,
        shouldShowDownArrow: f && u,
        shouldShowUpArrow: AA && S
      }
    });
  if (_) return h9.default.createElement(T, {
    ...O.container(),
    flexDirection: "row"
  }, h9.default.createElement(T, {
    flexDirection: "column",
    flexShrink: 0
  }, j.map((x) => {
    if (x.option.type === "input") return null;
    return h9.default.createElement(T, {
      key: String(x.option.value),
      flexDirection: "row",
      gap: 1
    }, x.isFocused ? h9.default.createElement(C, {
      color: "suggestion"
    }, tA.pointer) : x.shouldShowDownArrow ? h9.default.createElement(C, {
      dimColor: !0
    }, tA.arrowDown) : x.shouldShowUpArrow ? h9.default.createElement(C, {
      dimColor: !0
    }, tA.arrowUp) : h9.default.createElement(C, null, " "), h9.default.createElement(C, {
      dimColor: x.isOptionDisabled,
      color: x.isOptionDisabled ? void 0 : x.isSelected ? "success" : x.isFocused ? "suggestion" : void 0
    }, !Q && h9.default.createElement(C, {
      dimColor: !0
    }, `${x.index}.`.padEnd(L + 2)), x.label), x.isSelected && h9.default.createElement(C, {
      color: "success"
    }, tA.tick))
  })), h9.default.createElement(T, {
    flexDirection: "column",
    flexGrow: 1,
    marginLeft: 2
  }, j.map((x) => {
    if (x.option.type === "input") return null;
    return h9.default.createElement(C, {
      key: String(x.option.value),
      wrap: "wrap-trim",
      dimColor: x.isOptionDisabled || x.option.dimDescription !== !1,
      color: x.isOptionDisabled ? void 0 : x.isSelected ? "success" : x.isFocused ? "suggestion" : void 0
    }, h9.default.createElement(M8, null, x.option.description || ""))
  })));
  return h9.default.createElement(T, {
    ...O.container()
  }, $.visibleOptions.map((x, b) => {
    if (x.type === "input") {
      let MA = E.has(x.value) ? E.get(x.value) : x.initialValue || "",
        TA = x.index === $.visibleFromIndex,
        bA = x.index === $.visibleToIndex - 1,
        jA = $.visibleToIndex < Z.length,
        OA = $.visibleFromIndex > 0,
        IA = $.visibleFromIndex + b + 1,
        HA = !A && $.focusedValue === x.value,
        ZA = $.value === x.value;
      return h9.default.createElement(zVA, {
        key: String(x.value),
        option: x,
        isFocused: HA,
        isSelected: ZA,
        shouldShowDownArrow: jA && bA,
        shouldShowUpArrow: OA && TA,
        maxIndexWidth: L,
        index: IA,
        inputValue: MA,
        onInputChange: (zA) => {
          z((wA) => {
            let _A = new Map(wA);
            return _A.set(x.value, zA), _A
          })
        },
        onSubmit: (zA) => {
          if (zA.trim() || x.allowEmptySubmit) X?.(x.value);
          else J?.()
        },
        onExit: J,
        layout: "compact",
        showLabel: V
      })
    }
    let S = x.label;
    if (typeof x.label === "string" && G && x.label.includes(G)) {
      let MA = x.label,
        TA = MA.indexOf(G);
      S = h9.default.createElement(h9.default.Fragment, null, MA.slice(0, TA), h9.default.createElement(C, {
        ...O.highlightedText()
      }, G), MA.slice(TA + G.length))
    }
    let u = x.index === $.visibleFromIndex,
      f = x.index === $.visibleToIndex - 1,
      AA = $.visibleToIndex < Z.length,
      n = $.visibleFromIndex > 0,
      y = $.visibleFromIndex + b + 1,
      p = !A && $.focusedValue === x.value,
      GA = $.value === x.value,
      WA = x.disabled === !0;
    return h9.default.createElement(yr, {
      key: String(x.value),
      isFocused: p,
      isSelected: GA,
      shouldShowDownArrow: AA && f,
      shouldShowUpArrow: n && u
    }, h9.default.createElement(T, {
      flexDirection: "row",
      flexShrink: 0
    }, !Q && h9.default.createElement(C, {
      dimColor: !0
    }, `${y}.`.padEnd(L + 2)), h9.default.createElement(C, {
      dimColor: WA,
      color: WA ? void 0 : GA ? "success" : p ? "suggestion" : void 0
    }, S, V && x.description && h9.default.createElement(C, {
      dimColor: WA || x.dimDescription !== !1
    }, " ", x.description))), !V && x.description && h9.default.createElement(T, {
      flexShrink: 99,
      marginLeft: 2
    }, h9.default.createElement(C, {
      wrap: "wrap-trim",
      dimColor: WA || x.dimDescription !== !1,
      color: WA ? void 0 : GA ? "success" : p ? "suggestion" : void 0
    }, h9.default.createElement(M8, null, x.description))))
  }))
}
// @from(Ln 266802, Col 4)
h9
// @from(Ln 266803, Col 4)
W8 = w(() => {
  fA();
  bZ1();
  P32();
  x32();
  B2();
  PI0();
  h9 = c(QA(), 1)
})
// @from(Ln 266813, Col 0)
function uZ1({
  ruleValue: A
}) {
  switch (A.toolName) {
    case o2.name:
      if (A.ruleContent)
        if (A.ruleContent.endsWith(":*")) return eC.createElement(C, {
          dimColor: !0
        }, "Any Bash command starting with", " ", eC.createElement(C, {
          bold: !0
        }, A.ruleContent.slice(0, -2)));
        else return eC.createElement(C, {
          dimColor: !0
        }, "The Bash command ", eC.createElement(C, {
          bold: !0
        }, A.ruleContent));
      else return eC.createElement(C, {
        dimColor: !0
      }, "Any Bash command");
    default:
      if (!A.ruleContent) return eC.createElement(C, {
        dimColor: !0
      }, "Any use of the ", eC.createElement(C, {
        bold: !0
      }, A.toolName), " tool");
      else return null
  }
}
// @from(Ln 266841, Col 4)
eC
// @from(Ln 266842, Col 4)
SI0 = w(() => {
  fA();
  YK();
  eC = c(QA(), 1)
})
// @from(Ln 266848, Col 0)
function $G5({
  orientation: A = "horizontal",
  width: Q = "auto",
  dividerChar: B,
  dividerColor: G,
  dividerDimColor: Z = !0,
  boxProps: Y
}) {
  let J = A === "vertical",
    X = B || (J ? "│" : "─");
  if (J) return Rd.default.createElement(T, {
    height: "100%",
    borderStyle: {
      topLeft: "",
      top: "",
      topRight: "",
      right: X,
      bottomRight: "",
      bottom: "",
      bottomLeft: "",
      left: ""
    },
    borderColor: G,
    borderDimColor: Z,
    borderBottom: !1,
    borderTop: !1,
    borderLeft: !1,
    borderRight: !0,
    ...Y
  });
  return Rd.default.createElement(T, {
    width: Q,
    borderStyle: {
      topLeft: "",
      top: "",
      topRight: "",
      right: "",
      bottomRight: "",
      bottom: X,
      bottomLeft: "",
      left: ""
    },
    borderColor: G,
    borderDimColor: Z,
    flexGrow: 1,
    borderBottom: !0,
    borderTop: !1,
    borderLeft: !1,
    borderRight: !1,
    ...Y
  })
}
// @from(Ln 266901, Col 0)
function CG5({
  orientation: A = "horizontal",
  title: Q,
  width: B = "auto",
  padding: G = 0,
  titlePadding: Z = 1,
  titleColor: Y = "text",
  titleDimColor: J = !0,
  dividerChar: X,
  dividerColor: I,
  dividerDimColor: D = !0,
  boxProps: W
}) {
  let K = A === "vertical",
    F = Rd.default.createElement($G5, {
      orientation: A,
      dividerChar: X || (K ? "│" : "─"),
      dividerColor: I,
      dividerDimColor: D,
      boxProps: W
    });
  if (K) return F;
  if (!Q) return Rd.default.createElement(T, {
    paddingLeft: G,
    paddingRight: G
  }, F);
  return Rd.default.createElement(T, {
    width: B,
    paddingLeft: G,
    paddingRight: G,
    gap: Z
  }, F, Rd.default.createElement(T, null, Rd.default.createElement(C, {
    color: Y,
    dimColor: J
  }, Rd.default.createElement(M8, null, Q))), F)
}
// @from(Ln 266937, Col 4)
Rd
// @from(Ln 266937, Col 8)
K8
// @from(Ln 266938, Col 4)
lD = w(() => {
  fA();
  Rd = c(QA(), 1);
  K8 = CG5
})
// @from(Ln 266944, Col 0)
function hQ({
  action: A,
  context: Q,
  fallback: B,
  description: G,
  parens: Z,
  bold: Y
}) {
  let J = J3(A, Q, B);
  return xI0.createElement(F0, {
    shortcut: J,
    action: G,
    parens: Z,
    bold: Y
  })
}
// @from(Ln 266960, Col 4)
xI0
// @from(Ln 266961, Col 4)
I3 = w(() => {
  e9();
  NX();
  xI0 = c(QA(), 1)
})
// @from(Ln 266967, Col 0)
function vQ({
  children: A
}) {
  let Q = kb.Children.toArray(A);
  if (Q.length === 0) return null;
  return kb.default.createElement(kb.default.Fragment, null, Q.map((B, G) => kb.default.createElement(kb.default.Fragment, {
    key: kb.isValidElement(B) ? B.key ?? G : G
  }, G > 0 && kb.default.createElement(C, {
    dimColor: !0
  }, " · "), B)))
}
// @from(Ln 266978, Col 4)
kb
// @from(Ln 266979, Col 4)
K6 = w(() => {
  fA();
  kb = c(QA(), 1)
})
// @from(Ln 266984, Col 0)
function o9({
  title: A,
  subtitle: Q,
  children: B,
  onCancel: G,
  color: Z,
  borderDimColor: Y,
  hideInputGuide: J,
  hideBorder: X
}) {
  return IE.default.createElement(UG5, {
    title: A,
    subtitle: Q,
    onCancel: G,
    color: Z,
    borderDimColor: Y,
    hideInputGuide: J,
    hideBorder: X
  }, B)
}
// @from(Ln 267005, Col 0)
function UG5({
  title: A,
  subtitle: Q,
  children: B,
  onCancel: G,
  color: Z = "permission",
  borderDimColor: Y = !0,
  hideInputGuide: J,
  hideBorder: X
}) {
  let I = MQ();
  return H2("confirm:no", G, {
    context: "Confirmation"
  }), IE.default.createElement(IE.default.Fragment, null, IE.default.createElement(T, {
    flexDirection: "column",
    paddingBottom: 1
  }, !X && IE.default.createElement(K8, {
    dividerColor: Z,
    dividerDimColor: Y
  }), IE.default.createElement(T, {
    flexDirection: "column",
    paddingX: X ? 0 : 1,
    gap: 1
  }, IE.default.createElement(T, {
    flexDirection: "column"
  }, IE.default.createElement(C, {
    bold: !0,
    color: Z
  }, A), Q && IE.default.createElement(C, {
    dimColor: !0
  }, Q)), B)), !J && IE.default.createElement(T, {
    paddingX: X ? 0 : 1
  }, IE.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, I.pending ? IE.default.createElement(IE.default.Fragment, null, "Press ", I.keyName, " again to exit") : IE.default.createElement(vQ, null, IE.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), IE.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 267050, Col 4)
IE
// @from(Ln 267051, Col 4)
rY = w(() => {
  fA();
  E9();
  lD();
  e9();
  I3();
  K6();
  c6();
  IE = c(QA(), 1)
})
// @from(Ln 267062, Col 0)
function qG5(A) {
  return A === "projectSettings" || A === "policySettings" || A === "command"
}
// @from(Ln 267066, Col 0)
function mZ1(A) {
  return JyA(A)
}
// @from(Ln 267070, Col 0)
function y32(A, Q, B) {
  let G = mZ1(Q.source),
    Z = mZ1(B.source),
    Y = Q.ruleValue.toolName;
  if (A === "deny") return `Remove the "${Y}" deny rule from ${G}, or remove the specific allow rule from ${Z}`;
  return `Remove the "${Y}" ask rule from ${G}, or remove the specific allow rule from ${Z}`
}
// @from(Ln 267078, Col 0)
function NG5(A, Q, B) {
  let {
    toolName: G,
    ruleContent: Z
  } = A.ruleValue;
  if (Z === void 0) return {
    shadowed: !1
  };
  let Y = Q.find((J) => J.ruleValue.toolName === G && J.ruleValue.ruleContent === void 0);
  if (!Y) return {
    shadowed: !1
  };
  if (G === X9 && B.sandboxAutoAllowEnabled) {
    if (!qG5(Y.source)) return {
      shadowed: !1
    }
  }
  return {
    shadowed: !0,
    shadowedBy: Y,
    shadowType: "ask"
  }
}
// @from(Ln 267102, Col 0)
function wG5(A, Q) {
  let {
    toolName: B,
    ruleContent: G
  } = A.ruleValue;
  if (G === void 0) return {
    shadowed: !1
  };
  let Z = Q.find((Y) => Y.ruleValue.toolName === B && Y.ruleValue.ruleContent === void 0);
  if (!Z) return {
    shadowed: !1
  };
  return {
    shadowed: !0,
    shadowedBy: Z,
    shadowType: "deny"
  }
}
// @from(Ln 267121, Col 0)
function $VA(A, Q) {
  let B = [],
    G = CVA(A),
    Z = UVA(A),
    Y = _d(A);
  for (let J of G) {
    let X = wG5(J, Y);
    if (X.shadowed) {
      let D = mZ1(X.shadowedBy.source);
      B.push({
        rule: J,
        reason: `Blocked by "${X.shadowedBy.ruleValue.toolName}" deny rule (from ${D})`,
        shadowedBy: X.shadowedBy,
        shadowType: "deny",
        fix: y32("deny", X.shadowedBy, J)
      });
      continue
    }
    let I = NG5(J, Z, Q);
    if (I.shadowed) {
      let D = mZ1(I.shadowedBy.source);
      B.push({
        rule: J,
        reason: `Shadowed by "${I.shadowedBy.ruleValue.toolName}" ask rule (from ${D})`,
        shadowedBy: I.shadowedBy,
        shadowType: "ask",
        fix: y32("ask", I.shadowedBy, J)
      })
    }
  }
  return B
}
// @from(Ln 267153, Col 4)
dZ1 = w(() => {
  YZ()
})
// @from(Ln 267157, Col 0)
function yI0(A) {
  switch (A) {
    case "localSettings":
      return {
        label: "Project settings (local)", description: `Saved in ${NVA("localSettings")}`, value: A
      };
    case "projectSettings":
      return {
        label: "Project settings", description: `Checked in at ${NVA("projectSettings")}`, value: A
      };
    case "userSettings":
      return {
        label: "User settings", description: "Saved in at ~/.claude/settings.json", value: A
      }
  }
}
// @from(Ln 267174, Col 0)
function k32({
  onAddRules: A,
  onCancel: Q,
  ruleValues: B,
  ruleBehavior: G,
  initialContext: Z,
  setToolPermissionContext: Y
}) {
  let J = qVA.map(yI0),
    X = v32.useCallback((D) => {
      if (D === "cancel") {
        Q();
        return
      } else if (qVA.includes(D)) {
        let W = D,
          K = UJ(Z, {
            type: "addRules",
            rules: B,
            behavior: G,
            destination: W
          });
        Kk({
          type: "addRules",
          rules: B,
          behavior: G,
          destination: W
        }), Y(K);
        let V = B.map((z) => ({
            ruleValue: z,
            ruleBehavior: G,
            source: W
          })),
          F = XB.isSandboxingEnabled() && XB.isAutoAllowBashIfSandboxedEnabled(),
          E = $VA(K, {
            sandboxAutoAllowEnabled: F
          }).filter((z) => B.some(($) => $.toolName === z.rule.ruleValue.toolName && $.ruleContent === z.rule.ruleValue.ruleContent));
        A(V, E.length > 0 ? E : void 0)
      }
    }, [A, Q, B, G, Z, Y]),
    I = `Add ${G} permission rule${B.length===1?"":"s"}`;
  return DE.createElement(o9, {
    title: I,
    onCancel: Q,
    color: "permission"
  }, DE.createElement(T, {
    flexDirection: "column",
    paddingX: 2
  }, B.map((D) => DE.createElement(T, {
    flexDirection: "column",
    key: S5(D)
  }, DE.createElement(C, {
    bold: !0
  }, S5(D)), DE.createElement(uZ1, {
    ruleValue: D
  })))), DE.createElement(T, {
    flexDirection: "column",
    marginY: 1
  }, DE.createElement(C, null, B.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?"), DE.createElement(k0, {
    options: J,
    onChange: X
  })))
}
// @from(Ln 267236, Col 4)
DE
// @from(Ln 267236, Col 8)
v32
// @from(Ln 267236, Col 13)
qVA
// @from(Ln 267237, Col 4)
cZ1 = w(() => {
  fA();
  W8();
  YZ();
  dW();
  dW();
  SI0();
  GB();
  rY();
  dZ1();
  NJ();
  DE = c(QA(), 1), v32 = c(QA(), 1);
  qVA = ["localSettings", "projectSettings", "userSettings"]
})
// @from(Ln 267252, Col 0)
function pZ1(A, Q, B, G, Z, Y) {
  h32(A, Q, B, G, Z, Y)
}
// @from(Ln 267256, Col 0)
function f32(A, Q, B, G, Z, Y, J) {
  let X = J?.id || `function-hook-${Date.now()}-${Math.random()}`,
    I = {
      type: "function",
      id: X,
      timeout: J?.timeout || 5000,
      callback: Z,
      errorMessage: Y
    };
  return h32(A, Q, B, G, I), X
}
// @from(Ln 267268, Col 0)
function h32(A, Q, B, G, Z, Y) {
  A((J) => {
    let X = J.sessionHooks[Q] || {
        hooks: {}
      },
      I = X.hooks[B] || [],
      D = I.findIndex((V) => V.matcher === G),
      W;
    if (D >= 0) {
      W = [...I];
      let V = W[D];
      W[D] = {
        matcher: V.matcher,
        hooks: [...V.hooks, {
          hook: Z,
          onHookSuccess: Y
        }]
      }
    } else W = [...I, {
      matcher: G,
      hooks: [{
        hook: Z,
        onHookSuccess: Y
      }]
    }];
    let K = {
      ...X.hooks,
      [B]: W
    };
    return {
      ...J,
      sessionHooks: {
        ...J.sessionHooks,
        [Q]: {
          hooks: K
        }
      }
    }
  }), k(`Added session hook for event ${B} in session ${Q}`)
}
// @from(Ln 267309, Col 0)
function g32(A, Q, B, G) {
  A((Z) => {
    let Y = Z.sessionHooks[Q];
    if (!Y) return Z;
    let X = (Y.hooks[B] || []).map((D) => {
        let W = D.hooks.filter((K) => !LVA(K.hook, G));
        return W.length > 0 ? {
          ...D,
          hooks: W
        } : null
      }).filter((D) => D !== null),
      I = X.length > 0 ? {
        ...Y.hooks,
        [B]: X
      } : {
        ...Y.hooks
      };
    if (X.length === 0) delete I[B];
    return {
      ...Z,
      sessionHooks: {
        ...Z.sessionHooks,
        [Q]: {
          ...Y,
          hooks: I
        }
      }
    }
  }), k(`Removed session hook for event ${B} in session ${Q}`)
}
// @from(Ln 267340, Col 0)
function b32(A) {
  return A.map((Q) => ({
    matcher: Q.matcher,
    hooks: Q.hooks.map((B) => B.hook).filter((B) => B.type !== "function")
  }))
}
// @from(Ln 267347, Col 0)
function lZ1(A, Q, B) {
  let G = A.sessionHooks[Q];
  if (!G) return new Map;
  let Z = new Map;
  if (B) {
    let Y = G.hooks[B];
    if (Y) Z.set(B, b32(Y));
    return Z
  }
  for (let Y of _b) {
    let J = G.hooks[Y];
    if (J) Z.set(Y, b32(J))
  }
  return Z
}
// @from(Ln 267363, Col 0)
function u32(A, Q, B) {
  let G = A.sessionHooks[Q];
  if (!G) return new Map;
  let Z = new Map,
    Y = (J) => {
      return J.map((X) => ({
        matcher: X.matcher,
        hooks: X.hooks.map((I) => I.hook).filter((I) => I.type === "function")
      })).filter((X) => X.hooks.length > 0)
    };
  if (B) {
    let J = G.hooks[B];
    if (J) {
      let X = Y(J);
      if (X.length > 0) Z.set(B, X)
    }
    return Z
  }
  for (let J of _b) {
    let X = G.hooks[J];
    if (X) {
      let I = Y(X);
      if (I.length > 0) Z.set(J, I)
    }
  }
  return Z
}
// @from(Ln 267391, Col 0)
function m32(A, Q, B, G, Z) {
  let Y = A.sessionHooks[Q];
  if (!Y) return;
  let J = Y.hooks[B];
  if (!J) return;
  for (let X of J)
    if (X.matcher === G || G === "") {
      let I = X.hooks.find((D) => LVA(D.hook, Z));
      if (I) return I
    } return
}
// @from(Ln 267403, Col 0)
function wVA(A, Q) {
  A((B) => {
    let G = {
      ...B.sessionHooks
    };
    return delete G[Q], {
      ...B,
      sessionHooks: G
    }
  }), k(`Cleared all session hooks for session ${Q}`)
}
// @from(Ln 267414, Col 4)
vr = w(() => {
  GVA();
  T1();
  bb()
})
// @from(Ln 267423, Col 0)
function LVA(A, Q) {
  if (A.type !== Q.type) return !1;
  switch (A.type) {
    case "command":
      return Q.type === "command" && A.command === Q.command;
    case "prompt":
      return Q.type === "prompt" && A.prompt === Q.prompt;
    case "agent":
      return Q.type === "agent" && A.prompt === Q.prompt;
    case "function":
      return !1
  }
}
// @from(Ln 267437, Col 0)
function AU(A) {
  if ("statusMessage" in A && A.statusMessage) return A.statusMessage;
  switch (A.type) {
    case "command":
      return A.command;
    case "prompt":
      return A.prompt;
    case "agent":
      return A.prompt([]);
    case "callback":
      return "callback";
    case "function":
      return "function"
  }
}
// @from(Ln 267453, Col 0)
function d32(A) {
  let Q = [];
  if (dB("policySettings")?.allowManagedHooksOnly !== !0) {
    let J = ["userSettings", "projectSettings", "localSettings"],
      X = new Set;
    for (let I of J) {
      let D = bH(I);
      if (D) {
        let K = LG5(D);
        if (X.has(K)) continue;
        X.add(K)
      }
      let W = dB(I);
      if (!W?.hooks) continue;
      for (let [K, V] of Object.entries(W.hooks))
        for (let F of V)
          for (let H of F.hooks) Q.push({
            event: K,
            config: H,
            matcher: F.matcher,
            source: I
          })
    }
  }
  let Z = q0(),
    Y = lZ1(A, Z);
  for (let [J, X] of Y.entries())
    for (let I of X)
      for (let D of I.hooks) Q.push({
        event: J,
        config: D,
        matcher: I.matcher,
        source: "sessionHook"
      });
  return Q
}
// @from(Ln 267489, Col 0)
async function c32(A, Q, B = "", G = "userSettings") {
  let Y = (dB(G) ?? {}).hooks ?? {},
    J = Y[A] ?? [],
    X = J.findIndex((K) => K.matcher === B),
    I;
  if (X >= 0) {
    I = [...J];
    let K = I[X];
    I[X] = {
      matcher: K.matcher,
      hooks: [...K.hooks, Q]
    }
  } else I = [...J, {
    matcher: B,
    hooks: [Q]
  }];
  let D = {
      ...Y,
      [A]: I
    },
    {
      error: W
    } = pB(G, {
      hooks: D
    });
  if (W) throw Error(W.message);
  XyA()
}
// @from(Ln 267517, Col 0)
async function p32(A) {
  if (A.source === "pluginHook") throw Error("Plugin hooks cannot be removed through settings. Disable the plugin instead.");
  if (A.source === "sessionHook") throw Error("Session hooks cannot be removed through settings. They are temporary and will be cleared when the session ends.");
  let Q = dB(A.source) ?? {},
    B = Q.hooks ?? {},
    Z = (B[A.event] ?? []).map((X) => {
      if (X.matcher === A.matcher) {
        let I = X.hooks.filter((D) => !LVA(D, A.config));
        return I.length > 0 ? {
          ...X,
          hooks: I
        } : null
      }
      return X
    }).filter((X) => X !== null),
    Y = {
      ...B,
      [A.event]: Z.length > 0 ? Z : void 0
    },
    J = Object.values(Y).some((X) => X !== void 0);
  pB(A.source, {
    ...Q,
    hooks: J ? Y : void 0
  }), XyA()
}
// @from(Ln 267543, Col 0)
function l32(A) {
  switch (A) {
    case "userSettings":
      return "User settings (~/.claude/settings.json)";
    case "projectSettings":
      return "Project settings (.claude/settings.json)";
    case "localSettings":
      return "Local settings (.claude/settings.local.json)";
    case "pluginHook":
      return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
    case "sessionHook":
      return "Session hooks (in-memory, temporary)";
    default:
      return A
  }
}
// @from(Ln 267560, Col 0)
function vI0(A) {
  switch (A) {
    case "userSettings":
      return "User Settings";
    case "projectSettings":
      return "Project Settings";
    case "localSettings":
      return "Local Settings";
    case "pluginHook":
      return "Plugin Hooks";
    case "sessionHook":
      return "Session Hooks";
    default:
      return A
  }
}
// @from(Ln 267577, Col 0)
function i32(A) {
  switch (A) {
    case "userSettings":
      return "User";
    case "projectSettings":
      return "Project";
    case "localSettings":
      return "Local";
    case "pluginHook":
      return "Plugin";
    case "sessionHook":
      return "Session";
    default:
      return A
  }
}
// @from(Ln 267594, Col 0)
function n32(A, Q, B) {
  let G = qVA.reduce((Z, Y, J) => {
    return Z[Y] = J, Z
  }, {});
  return [...A].sort((Z, Y) => {
    let J = Q[B]?.[Z] || [],
      X = Q[B]?.[Y] || [],
      I = Array.from(new Set(J.map((F) => F.source))),
      D = Array.from(new Set(X.map((F) => F.source))),
      W = (F) => F === "pluginHook" ? 999 : G[F],
      K = Math.min(...I.map(W)),
      V = Math.min(...D.map(W));
    if (K !== V) return K - V;
    return Z.localeCompare(Y)
  })
}
// @from(Ln 267610, Col 4)
bb = w(() => {
  GB();
  cZ1();
  OVA();
  vr();
  C0()
})
// @from(Ln 267618, Col 0)
function kI0() {
  let A = dB("policySettings");
  if (A?.allowManagedHooksOnly === !0) return A.hooks ?? {};
  return jQ().hooks ?? {}
}
// @from(Ln 267624, Col 0)
function br() {
  return dB("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Ln 267628, Col 0)
function bI0(A) {
  if (!A) return null;
  let Q = {},
    B = Object.keys(A).sort();
  for (let G of B) {
    let Z = A[G];
    if (!Z) continue;
    let Y = [...Z].sort((J, X) => {
      let I = J.matcher || "",
        D = X.matcher || "";
      return I.localeCompare(D)
    });
    Q[G] = Y.map((J) => ({
      matcher: J.matcher,
      hooks: [...J.hooks].sort((X, I) => AU(X).localeCompare(AU(I)))
    }))
  }
  return Q
}
// @from(Ln 267648, Col 0)
function fI0() {
  let A = kI0();
  kr = bI0(A)
}
// @from(Ln 267653, Col 0)
function XyA() {
  let A = kI0();
  kr = bI0(A)
}
// @from(Ln 267658, Col 0)
function a32() {
  if (kr === null) return null;
  let A = bI0(kI0()),
    Q = eA(kr),
    B = eA(A);
  if (Q === B) return null;
  let G = [],
    Z = new Set(Object.keys(kr || {})),
    Y = new Set(Object.keys(A || {}));
  for (let J of Y)
    if (!Z.has(J)) G.push(`Added hooks for event: ${J}`);
  for (let J of Z)
    if (!Y.has(J)) G.push(`Removed all hooks for event: ${J}`);
  for (let J of Z)
    if (Y.has(J)) {
      let X = kr?.[J] || [],
        I = A?.[J] || [];
      if (eA(X) !== eA(I)) {
        let D = [],
          W = new Map(X.map((V) => [V.matcher || "", V])),
          K = new Map(I.map((V) => [V.matcher || "", V]));
        for (let [V] of K)
          if (!W.has(V)) D.push(`  - Added matcher: ${V||"(no matcher)"}`);
        for (let [V] of W)
          if (!K.has(V)) D.push(`  - Removed matcher: ${V||"(no matcher)"}`);
        for (let [V, F] of K)
          if (W.has(V)) {
            let H = W.get(V);
            if (eA(H.hooks) !== eA(F.hooks)) D.push(`  - Modified hooks for matcher: ${V||"(no matcher)"}`)
          } if (D.length > 0) G.push(`Modified hooks for event: ${J}`), G.push(...D);
        else G.push(`Modified hooks for event: ${J}`)
      }
    } return G.length > 0 ? G.join(`
`) : "Hooks configuration has been modified"
}
// @from(Ln 267694, Col 0)
function o32() {
  if (kr === null) fI0();
  return kr
}
// @from(Ln 267698, Col 4)
kr = null
// @from(Ln 267699, Col 4)
OVA = w(() => {
  GB();
  bb();
  C0();
  A0()
})
// @from(Ln 267706, Col 0)
function hI0(A) {
  let Q = MG5[A],
    B = process.env[A];
  if (B === void 0) return Q;
  return B === "true"
}
// @from(Ln 267713, Col 0)
function MVA() {
  let A = xu(),
    Q = q0(),
    B = {
      "user.id": A
    };
  if (hI0("OTEL_METRICS_INCLUDE_SESSION_ID")) B["session.id"] = Q;
  if (hI0("OTEL_METRICS_INCLUDE_VERSION")) B["app.version"] = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION;
  let G = v3();
  if (G) {
    let {
      organizationUuid: Z,
      emailAddress: Y,
      accountUuid: J
    } = G;
    if (Z) B["organization.id"] = Z;
    if (Y) B["user.email"] = Y;
    if (J && hI0("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) B["user.account_uuid"] = J
  }
  if (wq.terminal) B["terminal.type"] = wq.terminal;
  return B
}
// @from(Ln 267742, Col 4)
MG5
// @from(Ln 267743, Col 4)
iZ1 = w(() => {
  C0();
  GQ();
  G0A();
  Q2();
  MG5 = {
    OTEL_METRICS_INCLUDE_SESSION_ID: !0,
    OTEL_METRICS_INCLUDE_VERSION: !1,
    OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
  }
})
// @from(Ln 267755, Col 0)
function RG5() {
  return a1(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Ln 267759, Col 0)
function nZ1(A) {
  return RG5() ? A : "<REDACTED>"
}
// @from(Ln 267762, Col 0)
async function LF(A, Q = {}) {
  let B = ub0();
  if (!B) return;
  let G = {
    ...MVA(),
    "event.name": A,
    "event.timestamp": new Date().toISOString()
  };
  for (let [Z, Y] of Object.entries(Q))
    if (Y !== void 0) G[Z] = Y;
  B.emit({
    body: `claude_code.${A}`,
    attributes: G
  })
}
// @from(Ln 267777, Col 4)
fr = w(() => {
  C0();
  iZ1();
  fQ()
})
// @from(Ln 267782, Col 4)
aZ1
// @from(Ln 267783, Col 4)
uI0 = w(() => {
  w6();
  aZ1 = {
    get ENHANCED_TELEMETRY_BETA() {
      let A = process.env.CLAUDE_CODE_ENHANCED_TELEMETRY_BETA ?? process.env.ENABLE_ENHANCED_TELEMETRY_BETA;
      if (A === "true" || A === "1") return !0;
      if (A === "false" || A === "0") return !1;
      return ZZ("enhanced_telemetry_beta", !1)
    },
    get OVERFLOW_TEST_TOOL() {
      return !1
    }
  }
})
// @from(Ln 267801, Col 0)
function JK() {
  if (!(a1(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT))) return !1;
  return p2()
}
// @from(Ln 267806, Col 0)
function jd(A, Q = jG5) {
  if (A.length <= Q) return {
    content: A,
    truncated: !1
  };
  return {
    content: A.slice(0, Q) + `

[TRUNCATED - Content exceeds 60KB limit]`,
    truncated: !0
  }
}
// @from(Ln 267819, Col 0)
function dI0(A) {
  return _G5("sha256").update(A).digest("hex").slice(0, 12)
}
// @from(Ln 267823, Col 0)
function TG5(A) {
  return `sp_${dI0(A)}`
}
// @from(Ln 267827, Col 0)
function s32(A) {
  let Q = eA(A.message.content);
  return `msg_${dI0(Q)}`
}
// @from(Ln 267832, Col 0)
function mI0(A) {
  let Q = A.trim().match(PG5);
  return Q && Q[1] ? Q[1].trim() : null
}
// @from(Ln 267837, Col 0)
function SG5(A) {
  let Q = [],
    B = [];
  for (let G of A) {
    let Z = G.message.content;
    if (typeof Z === "string") {
      let Y = mI0(Z);
      if (Y) B.push(Y);
      else Q.push(`[USER]
${Z}`)
    } else if (Array.isArray(Z)) {
      for (let Y of Z)
        if (Y.type === "text") {
          let J = mI0(Y.text);
          if (J) B.push(J);
          else Q.push(`[USER]
${Y.text}`)
        } else if (Y.type === "tool_result") {
        let J = typeof Y.content === "string" ? Y.content : eA(Y.content),
          X = mI0(J);
        if (X) B.push(X);
        else Q.push(`[TOOL RESULT: ${Y.tool_use_id}]
${J}`)
      }
    }
  }
  return {
    contextParts: Q,
    systemReminders: B
  }
}
// @from(Ln 267869, Col 0)
function t32(A, Q) {
  if (!JK()) return;
  let {
    content: B,
    truncated: G
  } = jd(`[USER PROMPT]
${Q}`);
  A.setAttributes({
    new_context: B,
    ...G && {
      new_context_truncated: !0,
      new_context_original_length: Q.length
    }
  })
}
// @from(Ln 267885, Col 0)
function e32(A, Q, B) {
  if (!JK()) return;
  if (Q?.systemPrompt) {
    let G = TG5(Q.systemPrompt),
      Z = Q.systemPrompt.slice(0, 500);
    if (A.setAttribute("system_prompt_hash", G), A.setAttribute("system_prompt_preview", Z), A.setAttribute("system_prompt_length", Q.systemPrompt.length), !oZ1.has(G)) {
      oZ1.add(G);
      let {
        content: Y,
        truncated: J
      } = jd(Q.systemPrompt);
      LF("system_prompt", {
        system_prompt_hash: G,
        system_prompt: Y,
        system_prompt_length: String(Q.systemPrompt.length),
        ...J && {
          system_prompt_truncated: "true"
        }
      })
    }
  }
  if (Q?.tools) try {
    let Z = AQ(Q.tools).map((Y) => {
      let J = eA(Y),
        X = dI0(J);
      return {
        name: typeof Y.name === "string" ? Y.name : "unknown",
        hash: X,
        json: J
      }
    });
    A.setAttribute("tools", eA(Z.map(({
      name: Y,
      hash: J
    }) => ({
      name: Y,
      hash: J
    })))), A.setAttribute("tools_count", Z.length);
    for (let {
        name: Y,
        hash: J,
        json: X
      }
      of Z)
      if (!oZ1.has(`tool_${J}`)) {
        oZ1.add(`tool_${J}`);
        let {
          content: I,
          truncated: D
        } = jd(X);
        LF("tool", {
          tool_name: k9(Y),
          tool_hash: J,
          tool: I,
          ...D && {
            tool_truncated: "true"
          }
        })
      }
  } catch {
    A.setAttribute("tools_parse_error", !0)
  }
  if (B && B.length > 0 && Q?.querySource) {
    let G = Q.querySource,
      Z = r32.get(G),
      Y = 0;
    if (Z)
      for (let X = 0; X < B.length; X++) {
        let I = B[X];
        if (I && s32(I) === Z) {
          Y = X + 1;
          break
        }
      }
    let J = B.slice(Y).filter((X) => X.type === "user");
    if (J.length > 0) {
      let {
        contextParts: X,
        systemReminders: I
      } = SG5(J);
      if (X.length > 0) {
        let W = X.join(`

---

`),
          {
            content: K,
            truncated: V
          } = jd(W);
        A.setAttributes({
          new_context: K,
          new_context_message_count: J.length,
          ...V && {
            new_context_truncated: !0,
            new_context_original_length: W.length
          }
        })
      }
      if (I.length > 0) {
        let W = I.join(`

---

`),
          {
            content: K,
            truncated: V
          } = jd(W);
        A.setAttributes({
          system_reminders: K,
          system_reminders_count: I.length,
          ...V && {
            system_reminders_truncated: !0,
            system_reminders_original_length: W.length
          }
        })
      }
      let D = B[B.length - 1];
      if (D) r32.set(G, s32(D))
    }
  }
}
// @from(Ln 268009, Col 0)
function A82(A, Q) {
  if (!JK() || !Q) return;
  if (Q.modelOutput !== void 0) {
    let {
      content: B,
      truncated: G
    } = jd(Q.modelOutput);
    if (A["response.model_output"] = B, G) A["response.model_output_truncated"] = !0, A["response.model_output_original_length"] = Q.modelOutput.length
  }
}
// @from(Ln 268020, Col 0)
function Q82(A, Q, B) {
  if (!JK()) return;
  let {
    content: G,
    truncated: Z
  } = jd(`[TOOL RESULT: ${Q}]
${B}`);
  if (A.new_context = G, Z) A.new_context_truncated = !0, A.new_context_original_length = B.length
}
// @from(Ln 268029, Col 4)
oZ1
// @from(Ln 268029, Col 9)
r32
// @from(Ln 268029, Col 14)
jG5 = 61440
// @from(Ln 268030, Col 2)
PG5
// @from(Ln 268031, Col 4)
rZ1 = w(() => {
  fQ();
  fr();
  hW();
  C0();
  A0();
  oZ1 = new Set, r32 = new Map;
  PG5 = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
})
// @from(Ln 268044, Col 0)
function HO(A) {
  return A.spanContext().spanId || ""
}
// @from(Ln 268048, Col 0)
function xG5() {
  return aZ1.ENHANCED_TELEMETRY_BETA
}
// @from(Ln 268052, Col 0)
function wS() {
  return xG5() || JK()
}
// @from(Ln 268056, Col 0)
function g_() {
  return _X.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Ln 268060, Col 0)
function jVA(A, Q = {}) {
  return {
    ...MVA(),
    "span.type": A,
    ...Q
  }
}
// @from(Ln 268068, Col 0)
function Z82(A) {
  if (!wS()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let Q = g_(),
    G = a1(process.env.OTEL_LOG_USER_PROMPTS) ? A : "<REDACTED>";
  B82++;
  let Z = jVA("interaction", {
      user_prompt: G,
      user_prompt_length: A.length,
      "interaction.sequence": B82
    }),
    Y = Q.startSpan("claude_code.interaction", {
      attributes: Z
    });
  t32(Y, A);
  let J = HO(Y);
  return BV.set(J, {
    span: Y,
    startTime: Date.now(),
    attributes: Z
  }), RVA.enterWith(Y), Y
}
// @from(Ln 268090, Col 0)
function IyA() {
  if (!wS()) return;
  let A = RVA.getStore();
  if (!A) return;
  let Q = HO(A),
    B = BV.get(Q);
  if (!B) return;
  if (B.ended) return;
  let G = Date.now() - B.startTime;
  B.span.setAttributes({
    "interaction.duration_ms": G
  }), B.span.end(), B.ended = !0, BV.delete(Q), RVA.exit(() => {})
}
// @from(Ln 268104, Col 0)
function Y82(A, Q, B) {
  if (!wS()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let G = g_(),
    Z = RVA.getStore(),
    Y = jVA("llm_request", {
      model: A,
      "llm_request.context": Z ? "interaction" : "standalone"
    }),
    J = Z ? _X.trace.setSpan(_X.context.active(), Z) : _X.context.active(),
    X = G.startSpan("claude_code.llm_request", {
      attributes: Y
    }, J);
  if (Q?.querySource) X.setAttribute("query_source", Q.querySource);
  e32(X, Q, B);
  let I = HO(X);
  return BV.set(I, {
    span: X,
    startTime: Date.now(),
    attributes: Y
  }), X
}
// @from(Ln 268126, Col 0)
function cI0(A, Q) {
  if (!wS()) return;
  let B;
  if (A) {
    let Y = HO(A);
    B = BV.get(Y)
  } else
    for (let [, Y] of Array.from(BV.entries()).reverse())
      if (Y.attributes["span.type"] === "llm_request") {
        B = Y;
        break
      } if (!B) return;
  let Z = {
    duration_ms: Date.now() - B.startTime
  };
  if (Q) {
    if (Q.inputTokens !== void 0) Z.input_tokens = Q.inputTokens;
    if (Q.outputTokens !== void 0) Z.output_tokens = Q.outputTokens;
    if (Q.cacheReadTokens !== void 0) Z.cache_read_tokens = Q.cacheReadTokens;
    if (Q.cacheCreationTokens !== void 0) Z.cache_creation_tokens = Q.cacheCreationTokens;
    if (Q.success !== void 0) Z.success = Q.success;
    if (Q.statusCode !== void 0) Z.status_code = Q.statusCode;
    if (Q.error !== void 0) Z.error = Q.error;
    if (Q.attempt !== void 0) Z.attempt = Q.attempt;
    if (Q.hasToolCall !== void 0) Z["response.has_tool_call"] = Q.hasToolCall;
    A82(Z, Q)
  }
  B.span.setAttributes(Z), B.span.end(), BV.delete(HO(B.span))
}
// @from(Ln 268156, Col 0)
function J82(A, Q) {
  if (!wS()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let B = g_(),
    G = RVA.getStore(),
    Z = jVA("tool", {
      tool_name: A,
      ...Q
    }),
    Y = G ? _X.trace.setSpan(_X.context.active(), G) : _X.context.active(),
    J = B.startSpan("claude_code.tool", {
      attributes: Z
    }, Y),
    X = HO(J);
  return BV.set(X, {
    span: J,
    startTime: Date.now(),
    attributes: Z
  }), _VA.enterWith(J), J
}
// @from(Ln 268176, Col 0)
function X82() {
  if (!wS()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let A = g_(),
    Q = _VA.getStore(),
    B = jVA("tool.blocked_on_user"),
    G = Q ? _X.trace.setSpan(_X.context.active(), Q) : _X.context.active(),
    Z = A.startSpan("claude_code.tool.blocked_on_user", {
      attributes: B
    }, G),
    Y = HO(Z);
  return BV.set(Y, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Ln 268193, Col 0)
function pI0(A, Q) {
  if (!wS()) return;
  let B;
  for (let [, J] of Array.from(BV.entries()).reverse())
    if (J.attributes["span.type"] === "tool.blocked_on_user") {
      B = J;
      break
    } if (!B) return;
  let Z = {
    duration_ms: Date.now() - B.startTime
  };
  if (A) Z.decision = A;
  if (Q) Z.source = Q;
  B.span.setAttributes(Z), B.span.end();
  let Y = HO(B.span);
  BV.delete(Y)
}
// @from(Ln 268211, Col 0)
function I82() {
  if (!wS()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let A = g_(),
    Q = _VA.getStore(),
    B = jVA("tool.execution"),
    G = Q ? _X.trace.setSpan(_X.context.active(), Q) : _X.context.active(),
    Z = A.startSpan("claude_code.tool.execution", {
      attributes: B
    }, G),
    Y = HO(Z);
  return BV.set(Y, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Ln 268228, Col 0)
function lI0(A) {
  if (!wS()) return;
  let Q;
  for (let [, Y] of Array.from(BV.entries()).reverse())
    if (Y.attributes["span.type"] === "tool.execution") {
      Q = Y;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    if (A.success !== void 0) G.success = A.success;
    if (A.error !== void 0) G.error = A.error
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = HO(Q.span);
  BV.delete(Z)
}
// @from(Ln 268248, Col 0)
function sZ1(A) {
  if (!wS()) return;
  let Q;
  for (let [, Y] of Array.from(BV.entries()).reverse())
    if (Y.attributes["span.type"] === "tool") {
      Q = Y;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    let Y = Q.attributes.tool_name || "unknown";
    Q82(G, Y, A)
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = HO(Q.span);
  BV.delete(Z), _VA.exit(() => {})
}
// @from(Ln 268268, Col 0)
function yG5() {
  return a1(process.env.OTEL_LOG_TOOL_CONTENT)
}
// @from(Ln 268272, Col 0)
function D82(A, Q) {
  if (!wS() || !yG5()) return;
  let B = _VA.getStore();
  if (!B) return;
  let G = {};
  for (let [Z, Y] of Object.entries(Q))
    if (typeof Y === "string") {
      let {
        content: J,
        truncated: X
      } = jd(Y);
      if (G[Z] = J, X) G[`${Z}_truncated`] = !0, G[`${Z}_original_length`] = Y.length
    } else G[Z] = Y;
  B.addEvent(A, G)
}
// @from(Ln 268288, Col 0)
function W82(A, Q, B, G) {
  if (!JK()) return _X.trace.getActiveSpan() || g_().startSpan("dummy");
  let Z = g_(),
    Y = _VA.getStore() || RVA.getStore(),
    J = jVA("hook", {
      hook_event: A,
      hook_name: Q,
      num_hooks: B,
      hook_definitions: G
    }),
    X = Y ? _X.trace.setSpan(_X.context.active(), Y) : _X.context.active(),
    I = Z.startSpan("claude_code.hook", {
      attributes: J
    }, X),
    D = HO(I);
  return BV.set(D, {
    span: I,
    startTime: Date.now(),
    attributes: J
  }), I
}