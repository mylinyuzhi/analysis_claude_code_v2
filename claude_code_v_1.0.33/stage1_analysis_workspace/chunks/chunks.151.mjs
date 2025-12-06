
// @from(Start 14282103, End 14282157)
hH9 = L(() => {
  hA();
  Q4();
  LSA = BA(VA(), 1)
})
// @from(Start 14282160, End 14289244)
function gH9({
  tools: A,
  onExit: Q
}) {
  let [B, G] = Ra.useState({
    mode: "list-agents",
    source: "all"
  }), [Z, I] = OQ(), {
    allAgents: Y,
    activeAgents: J
  } = Z.agentDefinitions, [W, X] = Ra.useState([]), V = CI1(A, Z.mcp.tools);
  EQ();
  let F = Ra.useMemo(() => ({
    "built-in": Y.filter((H) => H.source === "built-in"),
    userSettings: Y.filter((H) => H.source === "userSettings"),
    projectSettings: Y.filter((H) => H.source === "projectSettings"),
    policySettings: Y.filter((H) => H.source === "policySettings"),
    localSettings: Y.filter((H) => H.source === "localSettings"),
    flagSettings: Y.filter((H) => H.source === "flagSettings"),
    plugin: Y.filter((H) => H.source === "plugin"),
    all: Y
  }), [Y]);
  f1((H, C) => {
    if (!C.escape) return;
    let E = W.length > 0 ? `Agent changes:
${W.join(`
`)}` : void 0;
    switch (B.mode) {
      case "list-agents":
        Q(E ?? "Agents dialog dismissed", {
          display: W.length === 0 ? "system" : void 0
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
  let K = Ra.useCallback((H) => {
      X((C) => [...C, H]), G({
        mode: "list-agents",
        source: "all"
      })
    }, []),
    D = Ra.useCallback(async (H) => {
      try {
        await BH9(H), I((C) => {
          let E = C.agentDefinitions.allAgents.filter((U) => !(U.agentType === H.agentType && U.source === H.source));
          return {
            ...C,
            agentDefinitions: {
              ...C.agentDefinitions,
              allAgents: E,
              activeAgents: ky(E)
            }
          }
        }), X((C) => [...C, `Deleted agent: ${tA.bold(H.agentType)}`]), G({
          mode: "list-agents",
          source: "all"
        })
      } catch (C) {
        AA(C instanceof Error ? C : Error("Failed to delete agent"))
      }
    }, []);
  switch (B.mode) {
    case "list-agents": {
      let H = B.source === "all" ? [...F["built-in"], ...F.userSettings, ...F.projectSettings, ...F.policySettings, ...F.flagSettings, ...F.plugin] : F[B.source],
        C = new Map;
      J.forEach((U) => C.set(U.agentType, U));
      let E = H.map((U) => {
        let q = C.get(U.agentType),
          w = q && q.source !== U.source ? q.source : void 0;
        return {
          ...U,
          overriddenBy: w
        }
      });
      return oB.createElement(oB.Fragment, null, oB.createElement(GH9, {
        source: B.source,
        agents: E,
        onBack: () => {
          let U = W.length > 0 ? `Agent changes:
${W.join(`
`)}` : void 0;
          Q(U ?? "Agents dialog dismissed", {
            display: W.length === 0 ? "system" : void 0
          })
        },
        onSelect: (U) => G({
          mode: "agent-menu",
          agent: U,
          previousMode: B
        }),
        onCreateNew: () => G({
          mode: "create-agent"
        }),
        changes: W
      }), oB.createElement(OVA, null))
    }
    case "create-agent":
      return oB.createElement(kH9, {
        tools: V,
        existingAgents: J,
        onComplete: K,
        onCancel: () => G({
          mode: "list-agents",
          source: "all"
        })
      });
    case "agent-menu": {
      let C = Y.find((w) => w.agentType === B.agent.agentType && w.source === B.agent.source) || B.agent,
        E = C.source === "built-in",
        U = [{
          label: "View agent",
          value: "view"
        }, ...!E ? [{
          label: "Edit agent",
          value: "edit"
        }, {
          label: "Delete agent",
          value: "delete"
        }] : [], {
          label: "Back",
          value: "back"
        }],
        q = (w) => {
          switch (w) {
            case "view":
              G({
                mode: "view-agent",
                agent: C,
                previousMode: B.previousMode
              });
              break;
            case "edit":
              G({
                mode: "edit-agent",
                agent: C,
                previousMode: B
              });
              break;
            case "delete":
              G({
                mode: "delete-confirm",
                agent: C,
                previousMode: B
              });
              break;
            case "back":
              G(B.previousMode);
              break
          }
        };
      return oB.createElement(oB.Fragment, null, oB.createElement(Ma, {
        title: B.agent.agentType
      }, oB.createElement(S, {
        flexDirection: "column",
        marginTop: 1
      }, oB.createElement(M0, {
        options: U,
        onChange: q,
        onCancel: () => G(B.previousMode)
      }), W.length > 0 && oB.createElement(S, {
        marginTop: 1
      }, oB.createElement($, {
        dimColor: !0
      }, W[W.length - 1])))), oB.createElement(OVA, null))
    }
    case "view-agent": {
      let C = Y.find((E) => E.agentType === B.agent.agentType && E.source === B.agent.source) || B.agent;
      return oB.createElement(oB.Fragment, null, oB.createElement(Ma, {
        title: C.agentType
      }, oB.createElement(bH9, {
        agent: C,
        tools: V,
        allAgents: Y,
        onBack: () => G({
          mode: "agent-menu",
          agent: C,
          previousMode: B.previousMode
        })
      })), oB.createElement(OVA, {
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
      return oB.createElement(oB.Fragment, null, oB.createElement(Ma, {
        title: "Delete agent",
        titleColor: "error",
        borderColor: "error"
      }, oB.createElement($, null, "Are you sure you want to delete the agent", " ", oB.createElement($, {
        bold: !0
      }, B.agent.agentType), "?"), oB.createElement(S, {
        marginTop: 1
      }, oB.createElement($, {
        dimColor: !0
      }, "Source: ", B.agent.source)), oB.createElement(S, {
        marginTop: 1
      }, oB.createElement(M0, {
        options: H,
        onChange: (C) => {
          if (C === "yes") D(B.agent);
          else if ("previousMode" in B) G(B.previousMode)
        },
        onCancel: () => {
          if ("previousMode" in B) G(B.previousMode)
        }
      }))), oB.createElement(OVA, {
        instructions: "Press ↑↓ to navigate, Enter to select, Esc to cancel"
      }))
    }
    case "edit-agent": {
      let C = Y.find((E) => E.agentType === B.agent.agentType && E.source === B.agent.source) || B.agent;
      return oB.createElement(oB.Fragment, null, oB.createElement(Ma, {
        title: `Edit agent: ${C.agentType}`
      }, oB.createElement(xH9, {
        agent: C,
        tools: V,
        onSaved: (E) => {
          K(E), G(B.previousMode)
        },
        onBack: () => G(B.previousMode)
      })), oB.createElement(OVA, null))
    }
    default:
      return null
  }
}
// @from(Start 14289249, End 14289251)
oB
// @from(Start 14289253, End 14289255)
Ra
// @from(Start 14289261, End 14289452)
uH9 = L(() => {
  hA();
  hA();
  F9();
  Q4();
  fP();
  NVA();
  S5();
  ZH9();
  yH9();
  vH9();
  fH9();
  g1();
  hH9();
  gF0();
  z9();
  pW0();
  oB = BA(VA(), 1), Ra = BA(VA(), 1)
})
// @from(Start 14289458, End 14289461)
eF0
// @from(Start 14289463, End 14289466)
kx3
// @from(Start 14289468, End 14289471)
mH9
// @from(Start 14289477, End 14289934)
dH9 = L(() => {
  uH9();
  yq();
  eF0 = BA(VA(), 1), kx3 = {
    type: "local-jsx",
    name: "agents",
    description: "Manage agent configurations",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      let G = (await Q.getAppState()).toolPermissionContext,
        Z = LC(G);
      return eF0.createElement(gH9, {
        tools: Z,
        onExit: A
      })
    },
    userFacingName() {
      return "agents"
    }
  }, mH9 = kx3
})
// @from(Start 14289937, End 14291782)
function cH9({
  setViewState: A,
  onComplete: Q,
  exitState: B
}) {
  let [G] = OQ(), {
    installationStatus: Z,
    errors: I
  } = G.plugins, Y = Z.marketplaces.length > 0 || Z.plugins.length > 0, J = Z.marketplaces.some((F) => F.status === "failed") || Z.plugins.some((F) => F.status === "failed"), W = I.length > 0, V = [{
    value: "browse-marketplace",
    label: "Browse and install plugins"
  }, {
    value: "manage-plugins",
    label: "Manage and uninstall plugins"
  }, {
    value: "add-marketplace",
    label: "Add marketplace"
  }, {
    value: "manage-marketplaces",
    label: "Manage marketplaces"
  }, ...Y || W ? [{
    value: "installation-status",
    label: `View installation status${J||W?" (errors)":""}`
  }] : []];
  return wY.createElement(S, {
    flexDirection: "column"
  }, wY.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, wY.createElement(S, {
    marginBottom: 1
  }, wY.createElement($, {
    bold: !0
  }, "Plugins")), wY.createElement(M0, {
    options: V,
    onChange: (F) => {
      if (F === "add-marketplace") A({
        type: "add-marketplace"
      });
      else if (F === "manage-marketplaces") A({
        type: "manage-marketplaces"
      });
      else if (F === "browse-marketplace") A({
        type: "browse-marketplace"
      });
      else if (F === "manage-plugins") A({
        type: "manage-plugins"
      });
      else if (F === "installation-status") A({
        type: "installation-status"
      })
    },
    onCancel: () => Q()
  })), wY.createElement(S, {
    marginLeft: 3
  }, wY.createElement($, {
    dimColor: !0,
    italic: !0
  }, B.pending ? wY.createElement(wY.Fragment, null, "Press ", B.keyName, " again to exit") : wY.createElement(wY.Fragment, null, "Press ↑↓ to navigate · Enter to select · Esc to exit"))))
}
// @from(Start 14291787, End 14291789)
wY
// @from(Start 14291795, End 14291856)
pH9 = L(() => {
  hA();
  S5();
  z9();
  wY = BA(VA(), 1)
})
// @from(Start 14291916, End 14292390)
function lH9(A, Q) {
  let B = [],
    G = RA();

  function Z(I) {
    try {
      let Y = G.readdirSync(I);
      for (let J of Y) {
        let W = yx3(I, J.name);
        if (J.isDirectory()) Z(W);
        else if (J.isFile() && J.name.endsWith(".md")) {
          let X = iH9(W, Q);
          if (X) B.push(X)
        }
      }
    } catch (Y) {
      g(`Failed to scan output-styles directory ${I}: ${Y}`, {
        level: "error"
      })
    }
  }
  return Z(A), B
}
// @from(Start 14292392, End 14292931)
function iH9(A, Q) {
  let B = RA();
  try {
    let G = B.readFileSync(A, {
        encoding: "utf-8"
      }),
      {
        frontmatter: Z,
        content: I
      } = NV(G),
      Y = xx3(A, ".md"),
      J = Z.name || Y,
      W = `${Q}:${J}`,
      X = Z.description || Wx(I, `Output style from ${Q} plugin`);
    return {
      name: W,
      description: X,
      prompt: I.trim(),
      source: "plugin"
    }
  } catch (G) {
    return g(`Failed to load output style from ${A}: ${G}`, {
      level: "error"
    }), null
  }
}
// @from(Start 14292933, End 14292974)
function QK0() {
  AK0.cache?.clear?.()
}
// @from(Start 14292979, End 14292982)
AK0
// @from(Start 14292988, End 14294352)
$J1 = L(() => {
  l2();
  AQ();
  fV();
  V0();
  _y();
  AK0 = s1(async () => {
    let {
      enabled: A,
      errors: Q
    } = await l7(), B = [];
    if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
    for (let G of A) {
      if (G.outputStylesPath) try {
        let Z = lH9(G.outputStylesPath, G.name);
        if (B.push(...Z), Z.length > 0) g(`Loaded ${Z.length} output styles from plugin ${G.name} default directory`)
      } catch (Z) {
        g(`Failed to load output styles from plugin ${G.name} default directory: ${Z}`, {
          level: "error"
        })
      }
      if (G.outputStylesPaths)
        for (let Z of G.outputStylesPaths) try {
          let Y = RA().statSync(Z);
          if (Y.isDirectory()) {
            let J = lH9(Z, G.name);
            if (B.push(...J), J.length > 0) g(`Loaded ${J.length} output styles from plugin ${G.name} custom path: ${Z}`)
          } else if (Y.isFile() && Z.endsWith(".md")) {
            let J = iH9(Z, G.name);
            if (J) B.push(J), g(`Loaded output style from plugin ${G.name} custom file: ${Z}`)
          }
        } catch (I) {
          g(`Failed to load output styles from plugin ${G.name} custom path ${Z}: ${I}`, {
            level: "error"
          })
        }
    }
    return g(`Total plugin output styles loaded: ${B.length}`), B
  })
})
// @from(Start 14294355, End 14294409)
function vx3() {
  _IA(), zI1(), Xf2(), bI2(), QK0()
}
// @from(Start 14294411, End 14294443)
function AF() {
  vx3(), nH9()
}
// @from(Start 14294448, End 14294517)
sQA = L(() => {
  fV();
  TjA();
  ETA();
  dMA();
  $J1();
  cE()
})
// @from(Start 14294600, End 14296675)
function wJ1(A) {
  let Q = A.trim(),
    B = RA(),
    G = Q.match(/^(git@[^:]+:.+\.git)(#(.+))?$/);
  if (G?.[1]) {
    let Z = G[1],
      I = G[3];
    return I ? {
      source: "git",
      url: Z,
      ref: I
    } : {
      source: "git",
      url: Z
    }
  }
  if (Q.startsWith("http://") || Q.startsWith("https://")) {
    let Z = Q.match(/^([^#]+)(#(.+))?$/),
      I = Z?.[1] || Q,
      Y = Z?.[3];
    if (I.endsWith(".git")) return Y ? {
      source: "git",
      url: I,
      ref: Y
    } : {
      source: "git",
      url: I
    };
    let J;
    try {
      J = new URL(I)
    } catch (W) {
      return {
        source: "url",
        url: I
      }
    }
    if (J.hostname === "github.com" || J.hostname === "www.github.com") {
      if (J.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
        let X = I.endsWith(".git") ? I : `${I}.git`;
        return Y ? {
          source: "git",
          url: X,
          ref: Y
        } : {
          source: "git",
          url: X
        }
      }
    }
    return {
      source: "url",
      url: I
    }
  }
  if (Q.startsWith("./") || Q.startsWith("../") || Q.startsWith("/") || Q.startsWith("~")) {
    let Z = bx3(Q.startsWith("~") ? Q.replace(/^~/, fx3()) : Q);
    if (!B.existsSync(Z)) return {
      error: `Path does not exist: ${Z}`
    };
    let I = B.statSync(Z);
    if (I.isFile())
      if (Z.endsWith(".json")) return {
        source: "file",
        path: Z
      };
      else return {
        error: `File path must point to a .json file (marketplace.json), but got: ${Z}`
      };
    else if (I.isDirectory()) return {
      source: "directory",
      path: Z
    };
    else return {
      error: `Path is neither a file nor a directory: ${Z}`
    }
  }
  if (Q.includes("/") && !Q.startsWith("@")) {
    if (Q.includes(":")) return null;
    let Z = Q.match(/^([^#]+)(#(.+))?$/),
      I = Z?.[1] || Q,
      Y = Z?.[3];
    return Y ? {
      source: "github",
      repo: I,
      ref: Y
    } : {
      source: "github",
      repo: I
    }
  }
  return null
}
// @from(Start 14296680, End 14296705)
BK0 = L(() => {
  AQ()
})
// @from(Start 14296708, End 14299589)
function aH9({
  inputValue: A,
  setInputValue: Q,
  cursorOffset: B,
  setCursorOffset: G,
  error: Z,
  setError: I,
  result: Y,
  setResult: J,
  setViewState: W,
  onAddComplete: X,
  cliMode: V = !1
}) {
  let F = rQA.useRef(!1),
    [K, D] = rQA.useState(!1),
    [H, C] = rQA.useState(""),
    E = async () => {
      let U = A.trim();
      if (!U) {
        I("Please enter a marketplace source");
        return
      }
      let q = wJ1(U);
      if (!q) {
        I("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
        return
      }
      if ("error" in q) {
        I(q.error);
        return
      }
      I(null);
      try {
        D(!0), C("");
        let {
          name: w
        } = await rAA(q, (R) => {
          C(R)
        });
        AF();
        let N = q.source;
        if (q.source === "github") N = q.repo;
        if (GA("tengu_marketplace_added", {
            source_type: N
          }), X) await X();
        if (C(""), D(!1), V) J(`Successfully added marketplace: ${w}`);
        else W({
          type: "browse-marketplace",
          targetMarketplace: w
        })
      } catch (w) {
        let N = w instanceof Error ? w : Error(String(w));
        if (AA(N), I(N.message), C(""), D(!1), V) J(`Error: ${N.message}`);
        else J(null)
      }
    };
  return rQA.useEffect(() => {
    if (A && !F.current && !Z && !Y) F.current = !0, E()
  }, []), Z8.createElement(S, {
    flexDirection: "column"
  }, Z8.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Z8.createElement(S, {
    marginBottom: 1
  }, Z8.createElement($, {
    bold: !0
  }, "Add Marketplace")), Z8.createElement(S, {
    flexDirection: "column"
  }, Z8.createElement($, null, "Enter marketplace source:"), Z8.createElement($, {
    dimColor: !0
  }, "Examples:"), Z8.createElement($, {
    dimColor: !0
  }, " • owner/repo (GitHub)"), Z8.createElement($, {
    dimColor: !0
  }, " • git@github.com:owner/repo.git (SSH)"), Z8.createElement($, {
    dimColor: !0
  }, " • https://example.com/marketplace.json"), Z8.createElement($, {
    dimColor: !0
  }, " • ./path/to/marketplace"), Z8.createElement(S, {
    marginTop: 1
  }, Z8.createElement(s4, {
    value: A,
    onChange: Q,
    onSubmit: E,
    columns: 80,
    cursorOffset: B,
    onChangeCursorOffset: G,
    focus: !0,
    showCursor: !0
  }))), K && Z8.createElement(S, {
    marginTop: 1
  }, Z8.createElement(g4, null), Z8.createElement($, null, H || "Adding marketplace to configuration…")), Z && Z8.createElement(S, {
    marginTop: 1
  }, Z8.createElement($, {
    color: "error"
  }, Z)), Y && Z8.createElement(S, {
    marginTop: 1
  }, Z8.createElement($, null, Y))), Z8.createElement(S, {
    marginLeft: 3
  }, Z8.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter to add · Esc to cancel")))
}
// @from(Start 14299594, End 14299596)
Z8
// @from(Start 14299598, End 14299601)
rQA
// @from(Start 14299607, End 14299729)
sH9 = L(() => {
  hA();
  ZY();
  oH();
  sQA();
  q0();
  BK0();
  DY();
  g1();
  Z8 = BA(VA(), 1), rQA = BA(VA(), 1)
})
// @from(Start 14299732, End 14313808)
function rH9({
  setViewState: A,
  error: Q,
  setError: B,
  setResult: G,
  exitState: Z,
  onManageComplete: I,
  targetMarketplace: Y,
  action: J
}) {
  let [W, X] = Wz.useState([]), [V, F] = Wz.useState(!0), [K, D] = Wz.useState(0), [H, C] = Wz.useState(!1), [E, U] = Wz.useState(null), [q, w] = Wz.useState(null), [N, R] = Wz.useState(null), [T, y] = Wz.useState("list"), [v, x] = Wz.useState(null), [p, u] = Wz.useState(0), e = Wz.useRef(!1);
  Wz.useEffect(() => {
    async function zA() {
      try {
        let NA = await pZ(),
          {
            enabled: OA,
            disabled: mA
          } = await l7(),
          wA = [...OA, ...mA],
          {
            marketplaces: qA,
            failures: KA
          } = await NLA(NA),
          yA = [];
        for (let {
            name: WA,
            config: EA,
            data: MA
          }
          of qA) {
          let DA = wA.filter(($A) => $A.source.endsWith(`@${WA}`));
          yA.push({
            name: WA,
            source: qLA(EA.source),
            lastUpdated: EA.lastUpdated,
            pluginCount: MA?.plugins.length,
            installedPlugins: DA,
            pendingUpdate: !1,
            pendingRemove: !1
          })
        }
        yA.sort((WA, EA) => WA.name.localeCompare(EA.name)), X(yA);
        let oA = qA.filter((WA) => WA.data !== null).length,
          X1 = BB1(KA, oA);
        if (X1)
          if (X1.type === "warning") U(X1.message);
          else throw Error(X1.message);
        if (Y && J && !e.current && !Q) {
          e.current = !0;
          let WA = yA.findIndex((EA) => EA.name === Y);
          if (WA >= 0) {
            D(WA);
            let EA = [...yA];
            if (J === "update") EA[WA].pendingUpdate = !0;
            else if (J === "remove") EA[WA].pendingRemove = !0;
            X(EA), setTimeout(() => {
              m(EA)
            }, 100)
          } else if (B) B(`Marketplace not found: ${Y}`)
        }
      } catch (NA) {
        if (B) B(NA instanceof Error ? NA.message : "Failed to load marketplaces");
        U(NA instanceof Error ? NA.message : "Failed to load marketplaces")
      } finally {
        F(!1)
      }
    }
    zA()
  }, [Y, J, Q]);
  let l = () => {
      return W.some((zA) => zA.pendingUpdate || zA.pendingRemove)
    },
    k = () => {
      let zA = W.filter((OA) => OA.pendingUpdate).length,
        NA = W.filter((OA) => OA.pendingRemove).length;
      return {
        updateCount: zA,
        removeCount: NA
      }
    },
    m = async (zA) => {
      let NA = zA || W,
        OA = T === "details";
      C(!0), U(null), w(null), R(null);
      try {
        let mA = OB("userSettings"),
          wA = 0,
          qA = 0;
        for (let DA of NA) {
          if (DA.pendingRemove) {
            if (DA.installedPlugins && DA.installedPlugins.length > 0) {
              let $A = {
                ...mA?.enabledPlugins
              };
              for (let TA of DA.installedPlugins) {
                let rA = jIA(TA.name, DA.name);
                $A[rA] = !1
              }
              cB("userSettings", {
                enabledPlugins: $A
              })
            }
            await ZB1(DA.name), qA++, GA("tengu_marketplace_removed", {
              marketplace_name: DA.name,
              plugins_uninstalled: DA.installedPlugins?.length || 0
            });
            continue
          }
          if (DA.pendingUpdate) await IB1(DA.name, ($A) => {
            R($A)
          }), wA++, GA("tengu_marketplace_updated", {
            marketplace_name: DA.name
          })
        }
        if (AF(), I) await I();
        let KA = await pZ(),
          {
            enabled: yA,
            disabled: oA
          } = await l7(),
          X1 = [...yA, ...oA],
          {
            marketplaces: WA
          } = await NLA(KA),
          EA = [];
        for (let {
            name: DA,
            config: $A,
            data: TA
          }
          of WA) {
          let rA = X1.filter((iA) => iA.source.endsWith(`@${DA}`));
          EA.push({
            name: DA,
            source: qLA($A.source),
            lastUpdated: $A.lastUpdated,
            pluginCount: TA?.plugins.length,
            installedPlugins: rA,
            pendingUpdate: !1,
            pendingRemove: !1
          })
        }
        if (EA.sort((DA, $A) => DA.name.localeCompare($A.name)), X(EA), OA && v) {
          let DA = EA.find(($A) => $A.name === v.name);
          if (DA) x(DA)
        }
        let MA = [];
        if (wA > 0) MA.push(`Updated ${wA} marketplace${wA>1?"s":""}`);
        if (qA > 0) MA.push(`Removed ${qA} marketplace${qA>1?"s":""}`);
        if (MA.length > 0) {
          let DA = `${H1.tick} ${MA.join(", ")}`;
          if (OA) w(DA);
          else G(DA), setTimeout(() => {
            A({
              type: "menu"
            })
          }, 2000)
        } else if (!OA) A({
          type: "menu"
        })
      } catch (mA) {
        let wA = mA instanceof Error ? mA.message : String(mA);
        if (U(wA), B) B(wA)
      } finally {
        C(!1), R(null)
      }
    }, o = async () => {
      if (!v) return;
      let zA = W.map((NA) => NA.name === v.name ? {
        ...NA,
        pendingRemove: !0
      } : NA);
      X(zA), await m(zA)
    };
  if (f1((zA, NA) => {
      if (H) return;
      if (NA.escape) {
        if (T === "details" || T === "confirm-remove") {
          y("list"), u(0);
          return
        }
        if (l()) X((OA) => OA.map((mA) => ({
          ...mA,
          pendingUpdate: !1,
          pendingRemove: !1
        }))), D(0);
        else A({
          type: "menu"
        });
        return
      }
      if (T === "list") {
        if (NA.upArrow || zA === "k") D((OA) => Math.max(0, OA - 1));
        else if (NA.downArrow || zA === "j") D((OA) => Math.min(W.length - 1, OA + 1));
        else if (zA === "u" || zA === "U") X((OA) => OA.map((mA, wA) => wA === K ? {
          ...mA,
          pendingUpdate: !mA.pendingUpdate,
          pendingRemove: mA.pendingUpdate ? mA.pendingRemove : !1
        } : mA));
        else if (zA === "r" || zA === "R") {
          let OA = W[K];
          if (OA) x(OA), y("confirm-remove")
        } else if (NA.return) {
          let OA = W[K];
          if (OA && !l()) x(OA), y("details"), u(0);
          else if (l()) m()
        }
      } else if (T === "details") {
        let mA = v?.source.startsWith("http") ? 2 : 1;
        if (NA.upArrow || zA === "k") u((wA) => Math.max(0, wA - 1));
        else if (NA.downArrow || zA === "j") u((wA) => Math.min(mA, wA + 1));
        else if (NA.return && v) {
          if (p === 0) {
            let wA = W.map((qA) => qA.name === v.name ? {
              ...qA,
              pendingUpdate: !0
            } : qA);
            X(wA), m(wA)
          } else if (p === 1) y("confirm-remove");
          else if (p === 2) {
            if (v.source.startsWith("http")) cZ(v.source)
          }
        }
      } else if (T === "confirm-remove") {
        if (zA === "y" || zA === "Y") o();
        else if (zA === "n" || zA === "N") y("list"), x(null)
      }
    }), V) return r1.createElement(S, {
    flexDirection: "column"
  }, r1.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, r1.createElement($, null, "Loading marketplaces…")));
  if (W.length === 0) return r1.createElement(S, {
    flexDirection: "column"
  }, r1.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, r1.createElement($, null, "No marketplaces configured.")), r1.createElement(S, {
    marginLeft: 3,
    marginTop: 1
  }, r1.createElement($, {
    dimColor: !0
  }, Z.pending ? r1.createElement(r1.Fragment, null, "Press ", Z.keyName, " again to go back") : r1.createElement(r1.Fragment, null, "Esc to go back"))));
  if (T === "confirm-remove" && v) {
    let zA = v.installedPlugins?.length || 0;
    return r1.createElement(S, {
      flexDirection: "column"
    }, r1.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, r1.createElement($, {
      bold: !0,
      color: "warning"
    }, "Remove marketplace ", r1.createElement($, {
      italic: !0
    }, v.name), "?"), r1.createElement(S, {
      flexDirection: "column"
    }, zA > 0 && r1.createElement(S, {
      marginTop: 1
    }, r1.createElement($, {
      color: "warning"
    }, "This will also uninstall ", zA, " plugin", zA !== 1 ? "s" : "", " from this marketplace:")), v.installedPlugins && v.installedPlugins.length > 0 && r1.createElement(S, {
      flexDirection: "column",
      marginTop: 1,
      marginLeft: 2
    }, v.installedPlugins.map((NA) => r1.createElement($, {
      key: NA.name,
      dimColor: !0
    }, "• ", NA.name))), r1.createElement(S, {
      marginTop: 1
    }, r1.createElement($, null, "Press ", r1.createElement($, {
      bold: !0
    }, "y"), " to confirm or ", r1.createElement($, {
      bold: !0
    }, "n"), " to cancel")))))
  }
  if (T === "details" && v) {
    let zA = v.pendingUpdate || H,
      NA = [{
        label: "Update marketplace",
        value: "update"
      }, {
        label: "Remove marketplace",
        value: "remove"
      }, v.source.startsWith("http") && {
        label: "Open in browser",
        value: "browser"
      }].filter(Boolean);
    return r1.createElement(S, {
      flexDirection: "column"
    }, r1.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, r1.createElement($, {
      bold: !0
    }, v.name), r1.createElement($, {
      dimColor: !0
    }, v.source), v.lastUpdated && r1.createElement($, {
      dimColor: !0
    }, "Last updated:", " ", new Date(v.lastUpdated).toLocaleDateString()), r1.createElement(S, {
      marginTop: 1
    }, r1.createElement($, null, v.pluginCount || 0, " available plugin", v.pluginCount !== 1 ? "s" : "")), v.installedPlugins && v.installedPlugins.length > 0 && r1.createElement(S, {
      flexDirection: "column",
      marginTop: 1
    }, r1.createElement($, {
      bold: !0
    }, "Installed plugins (", v.installedPlugins.length, "):"), r1.createElement(S, {
      flexDirection: "column",
      marginLeft: 1
    }, v.installedPlugins.map((OA) => r1.createElement(S, {
      key: OA.name,
      flexDirection: "row",
      gap: 1
    }, r1.createElement($, null, H1.bullet), r1.createElement(S, {
      flexDirection: "column"
    }, r1.createElement($, null, OA.name), r1.createElement($, {
      dimColor: !0
    }, OA.manifest.description)))))), zA && r1.createElement(S, {
      marginTop: 1,
      flexDirection: "column"
    }, r1.createElement($, {
      color: "claude"
    }, "Updating marketplace…"), N && r1.createElement($, {
      dimColor: !0
    }, N)), !zA && q && r1.createElement(S, {
      marginTop: 1
    }, r1.createElement($, {
      color: "claude"
    }, q)), !zA && E && r1.createElement(S, {
      marginTop: 1
    }, r1.createElement($, {
      color: "error"
    }, E)), !zA && r1.createElement(S, {
      flexDirection: "column",
      marginTop: 1
    }, NA.map((OA, mA) => {
      if (!OA) return null;
      let wA = mA === p;
      return r1.createElement(S, {
        key: OA.value
      }, r1.createElement($, {
        color: wA ? "claude" : void 0
      }, wA ? H1.pointer : " ", " ", OA.label))
    }))), r1.createElement(S, {
      marginLeft: 3
    }, r1.createElement($, {
      dimColor: !0,
      italic: !0
    }, zA ? r1.createElement(r1.Fragment, null, "Please wait…") : r1.createElement(r1.Fragment, null, H1.arrowUp, H1.arrowDown, " · enter to select · Esc to go back"))))
  }
  let {
    updateCount: IA,
    removeCount: FA
  } = k();
  return r1.createElement(S, {
    flexDirection: "column"
  }, r1.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, r1.createElement(S, {
    marginBottom: 1
  }, r1.createElement($, {
    bold: !0
  }, "Manage marketplaces")), r1.createElement(S, {
    flexDirection: "column"
  }, W.map((zA, NA) => {
    let OA = NA === K,
      mA = [];
    if (zA.pendingUpdate) mA.push("UPDATE");
    if (zA.pendingRemove) mA.push("REMOVE");
    return r1.createElement(S, {
      key: zA.name,
      flexDirection: "row",
      gap: 1,
      marginBottom: 1
    }, r1.createElement($, {
      color: OA ? "claude" : void 0
    }, OA ? H1.pointer : " ", " ", zA.pendingRemove ? H1.cross : H1.bullet), r1.createElement(S, {
      flexDirection: "column",
      flexGrow: 1
    }, r1.createElement(S, {
      flexDirection: "row",
      gap: 1
    }, r1.createElement($, {
      bold: !0,
      strikethrough: zA.pendingRemove,
      dimColor: zA.pendingRemove
    }, zA.name), mA.length > 0 && r1.createElement($, {
      color: "warning"
    }, "[", mA.join(", "), "]")), r1.createElement($, {
      dimColor: !0
    }, zA.source), r1.createElement($, {
      dimColor: !0
    }, zA.pluginCount !== void 0 && r1.createElement(r1.Fragment, null, zA.pluginCount, " available"), zA.installedPlugins && zA.installedPlugins.length > 0 && r1.createElement(r1.Fragment, null, " • ", zA.installedPlugins.length, " installed"), zA.lastUpdated && r1.createElement(r1.Fragment, null, " ", "• Updated", " ", new Date(zA.lastUpdated).toLocaleDateString()))))
  })), l() && r1.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, r1.createElement($, null, r1.createElement($, {
    bold: !0
  }, "Pending changes:"), " ", r1.createElement($, {
    dimColor: !0
  }, "Enter to apply")), IA > 0 && r1.createElement($, null, "• Update ", IA, " marketplace", IA > 1 ? "s" : ""), FA > 0 && r1.createElement($, {
    color: "warning"
  }, "• Remove ", FA, " marketplace", FA > 1 ? "s" : "")), H && r1.createElement(S, {
    marginTop: 1
  }, r1.createElement($, {
    color: "claude"
  }, "Processing changes…")), E && r1.createElement(S, {
    marginTop: 1
  }, r1.createElement($, {
    color: "error"
  }, E))), r1.createElement(hx3, {
    exitState: Z,
    hasPendingActions: l()
  }))
}
// @from(Start 14313810, End 14314305)
function hx3({
  exitState: A,
  hasPendingActions: Q
}) {
  let B = [];
  if (A.pending) B.push(`Press ${A.keyName} again to go back`);
  else {
    if (B.push(`${H1.arrowUp}${H1.arrowDown}`), Q) B.push("Enter to apply changes");
    else B.push("Enter for details"), B.push("u update"), B.push("r remove");
    B.push(Q ? "Esc to cancel" : "Esc to go back")
  }
  return r1.createElement(S, {
    marginLeft: 3
  }, r1.createElement($, {
    dimColor: !0,
    italic: !0
  }, B.join(" · ")))
}
// @from(Start 14314310, End 14314312)
r1
// @from(Start 14314314, End 14314316)
Wz
// @from(Start 14314322, End 14314459)
oH9 = L(() => {
  hA();
  hA();
  V9();
  oH();
  sQA();
  q0();
  fV();
  OLA();
  gM();
  MB();
  r1 = BA(VA(), 1), Wz = BA(VA(), 1)
})
// @from(Start 14314462, End 14330424)
function tH9({
  error: A,
  setError: Q,
  result: B,
  setResult: G,
  setViewState: Z,
  onInstallComplete: I,
  targetMarketplace: Y,
  targetPlugin: J
}) {
  let [W, X] = OK.useState("marketplace-list"), [V, F] = OK.useState(null), [K, D] = OK.useState(null), [H, C] = OK.useState([]), [E, U] = OK.useState([]), [q, w] = OK.useState(!0), [N, R] = OK.useState(0), [T, y] = OK.useState(new Set), [v, x] = OK.useState(new Set), [p, u] = OK.useState(0), [e, l] = OK.useState(!1), [k, m] = OK.useState(null), [o, IA] = OK.useState(null);
  OK.useEffect(() => {
    async function NA() {
      try {
        let OA = await pZ(),
          {
            marketplaces: mA,
            failures: wA
          } = await NLA(OA),
          qA = [];
        for (let {
            name: oA,
            config: X1,
            data: WA
          }
          of mA)
          if (WA) {
            let EA = WA.plugins.filter((MA) => gg(jIA(MA.name, oA))).length;
            qA.push({
              name: oA,
              totalPlugins: WA.plugins.length,
              installedCount: EA,
              source: qLA(X1.source)
            })
          } C(qA);
        let KA = mA.filter((oA) => oA.data !== null).length,
          yA = BB1(wA, KA);
        if (yA)
          if (yA.type === "warning") IA(yA.message + ". Showing available marketplaces.");
          else throw Error(yA.message);
        if (qA.length === 1 && !Y && !J) {
          let oA = qA[0];
          if (oA) F(oA.name), X("plugin-list")
        }
        if (J) {
          let oA = null,
            X1 = null;
          for (let [WA] of Object.entries(OA)) {
            let EA = await _D(WA);
            if (EA) {
              let MA = EA.plugins.find((DA) => DA.name === J);
              if (MA) {
                oA = {
                  entry: MA,
                  marketplaceName: WA,
                  pluginId: jIA(MA.name, WA)
                }, X1 = WA;
                break
              }
            }
          }
          if (oA && X1) {
            let WA = oA.pluginId;
            if (gg(WA)) Q(`Plugin '${WA}' is already installed. Use '/plugin' to manage existing plugins.`);
            else F(X1), D(oA), X("plugin-details")
          } else Q(`Plugin "${J}" not found in any marketplace`)
        } else if (Y)
          if (qA.some((X1) => X1.name === Y)) F(Y), X("plugin-list");
          else Q(`Marketplace "${Y}" not found`)
      } catch (OA) {
        Q(OA instanceof Error ? OA.message : "Failed to load marketplaces")
      } finally {
        w(!1)
      }
    }
    NA()
  }, [Q, Y, J]), OK.useEffect(() => {
    if (!V) return;
    async function NA(OA) {
      w(!0);
      try {
        let mA = await _D(OA);
        if (!mA) throw Error(`Failed to load marketplace: ${OA}`);
        let wA = [];
        for (let qA of mA.plugins) {
          let KA = jIA(qA.name, OA);
          if (!gg(KA)) wA.push({
            entry: qA,
            marketplaceName: OA,
            pluginId: KA
          })
        }
        U(wA), R(0), y(new Set)
      } catch (mA) {
        Q(mA instanceof Error ? mA.message : "Failed to load plugins")
      } finally {
        w(!1)
      }
    }
    NA(V)
  }, [V, Q]);
  let FA = async () => {
    if (T.size === 0) return;
    let NA = E.filter((qA) => T.has(qA.pluginId));
    x(new Set(NA.map((qA) => qA.pluginId)));
    let OA = 0,
      mA = 0,
      wA = [];
    for (let qA of NA) try {
      if (typeof qA.entry.source !== "string") await Bj(qA.pluginId, qA.entry);
      let yA = {
        ...OB("userSettings")?.enabledPlugins,
        [qA.pluginId]: !0
      };
      cB("userSettings", {
        enabledPlugins: yA
      }), OA++, GA("tengu_plugin_installed", {
        plugin_id: qA.pluginId,
        marketplace_name: qA.marketplaceName
      })
    } catch (KA) {
      mA++;
      let yA = KA instanceof Error ? KA.message : String(KA);
      wA.push({
        name: qA.entry.name,
        reason: yA
      }), AA(KA instanceof Error ? KA : Error(`Failed to install ${qA.entry.name}: ${KA}`))
    }
    if (x(new Set), y(new Set), AF(), mA === 0) {
      let qA = `✓ Installed ${OA} plugin${OA!==1?"s":""}. Restart Claude Code to load new plugins.`;
      G(qA)
    } else if (OA === 0) Q(`Failed to install: ${xe1(wA,!0)}`);
    else {
      let qA = `✓ Installed ${OA} of ${OA+mA} plugins. Failed: ${xe1(wA,!1)}. Restart Claude Code to load successfully installed plugins.`;
      G(qA)
    }
    if (OA > 0) {
      if (I) await I()
    }
    Z({
      type: "menu"
    })
  }, zA = async (NA) => {
    l(!0), m(null);
    try {
      if (typeof NA.entry.source !== "string") await Bj(NA.pluginId, NA.entry);
      let mA = {
        ...OB("userSettings")?.enabledPlugins,
        [NA.pluginId]: !0
      };
      cB("userSettings", {
        enabledPlugins: mA
      }), GA("tengu_plugin_installed", {
        plugin_id: NA.pluginId,
        marketplace_name: NA.marketplaceName
      }), AF();
      let wA = `✓ Installed ${NA.entry.name}. Restart Claude Code to load new plugins.`;
      if (G(wA), I) await I();
      Z({
        type: "menu"
      })
    } catch (OA) {
      l(!1);
      let mA = OA instanceof Error ? OA.message : String(OA);
      m(`Failed to install: ${mA}`), AA(OA instanceof Error ? OA : Error(`Failed to install plugin: ${String(OA)}`))
    }
  };
  if (OK.useEffect(() => {
      if (A) G(A)
    }, [A, G]), f1((NA, OA) => {
      if (OA.escape) {
        if (W === "plugin-list") X("marketplace-list"), F(null), y(new Set);
        else if (W === "plugin-details") X("plugin-list"), D(null);
        return
      }
      if (W === "marketplace-list") {
        if ((OA.upArrow || NA === "k") && N > 0) R(N - 1);
        else if ((OA.downArrow || NA === "j") && N < H.length - 1) R(N + 1);
        else if (OA.return) {
          let mA = H[N];
          if (mA) F(mA.name), X("plugin-list")
        }
      } else if (W === "plugin-list") {
        let mA = E.length;
        if ((OA.upArrow || NA === "k") && N > 0) R(N - 1);
        else if ((OA.downArrow || NA === "j") && N < mA - 1) R(N + 1);
        else if (NA === " ") {
          if (N < E.length) {
            let wA = E[N];
            if (wA) {
              let qA = new Set(T);
              if (qA.has(wA.pluginId)) qA.delete(wA.pluginId);
              else qA.add(wA.pluginId);
              y(qA)
            }
          }
        } else if (OA.return) {
          if (N === E.length && T.size > 0) FA();
          else if (N < E.length) {
            let wA = E[N];
            if (wA) D(wA), X("plugin-details"), u(0), m(null)
          }
        } else if (NA === "i" && T.size > 0) FA()
      } else if (W === "plugin-details" && K) {
        let mA = K.entry.homepage,
          qA = K.entry.source && typeof K.entry.source === "object" && "source" in K.entry.source && K.entry.source.source === "github" && typeof K.entry.source === "object" && "repo" in K.entry.source ? K.entry.source.repo : null,
          KA = [];
        if (KA.push({
            label: "Install now",
            action: "install"
          }), mA) KA.push({
          label: "Open homepage",
          action: "homepage"
        });
        if (qA) KA.push({
          label: "View on GitHub",
          action: "github"
        });
        if (KA.push({
            label: "Back to plugin list",
            action: "back"
          }), (OA.upArrow || NA === "k") && p > 0) u(p - 1);
        else if ((OA.downArrow || NA === "j") && p < KA.length - 1) u(p + 1);
        else if (OA.return) {
          let yA = KA[p]?.action;
          if (yA === "mark") {
            let oA = new Set(T);
            if (oA.has(K.pluginId)) oA.delete(K.pluginId);
            else oA.add(K.pluginId);
            y(oA), X("plugin-list"), D(null)
          } else if (yA === "install") zA(K);
          else if (yA === "homepage" && mA) cZ(mA);
          else if (yA === "github" && qA) cZ(`https://github.com/${qA}`);
          else if (yA === "back") X("plugin-list"), D(null)
        }
      }
    }), q) return A0.createElement(S, {
    flexDirection: "column"
  }, A0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, A0.createElement($, null, "Loading…")));
  if (A) return A0.createElement(S, {
    flexDirection: "column"
  }, A0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, A0.createElement($, {
    color: "error"
  }, A)));
  if (W === "marketplace-list") {
    if (H.length === 0) return A0.createElement(S, {
      flexDirection: "column"
    }, A0.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, A0.createElement(S, {
      marginBottom: 1
    }, A0.createElement($, {
      bold: !0
    }, "Select marketplace")), A0.createElement($, null, "No marketplaces configured."), A0.createElement($, {
      dimColor: !0
    }, "Add a marketplace first using ", "'Add marketplace'", ".")), A0.createElement(S, {
      marginTop: 1,
      paddingLeft: 1
    }, A0.createElement($, {
      dimColor: !0
    }, "Esc to go back")));
    return A0.createElement(S, {
      flexDirection: "column"
    }, A0.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, A0.createElement(S, {
      marginBottom: 1
    }, A0.createElement($, {
      bold: !0
    }, "Select marketplace")), o && A0.createElement(S, {
      marginBottom: 1,
      flexDirection: "column"
    }, A0.createElement($, {
      color: "warning"
    }, H1.warning, " ", o)), H.map((NA, OA) => A0.createElement(S, {
      key: NA.name,
      flexDirection: "column",
      marginBottom: OA < H.length - 1 ? 1 : 0
    }, A0.createElement(S, null, A0.createElement($, {
      color: N === OA ? "suggestion" : void 0
    }, N === OA ? H1.pointer : " ", " ", NA.name)), A0.createElement(S, {
      marginLeft: 2
    }, A0.createElement($, {
      dimColor: !0
    }, NA.totalPlugins, " plugin", NA.totalPlugins !== 1 ? "s" : "", " available", NA.installedCount > 0 && ` · ${NA.installedCount} already installed`, NA.source && ` · ${NA.source}`))))), A0.createElement(S, {
      paddingLeft: 1
    }, A0.createElement($, {
      dimColor: !0,
      italic: !0
    }, "Enter to select · esc to go back")))
  }
  if (W === "plugin-details" && K) {
    let NA = K.entry.homepage,
      mA = K.entry.source && typeof K.entry.source === "object" && "source" in K.entry.source && K.entry.source.source === "github" && typeof K.entry.source === "object" && "repo" in K.entry.source ? K.entry.source.repo : null,
      wA = [];
    if (wA.push({
        label: "Install now",
        action: "install"
      }), NA) wA.push({
      label: "Open homepage",
      action: "homepage"
    });
    if (mA) wA.push({
      label: "View on GitHub",
      action: "github"
    });
    return wA.push({
      label: "Back to plugin list",
      action: "back"
    }), A0.createElement(S, {
      flexDirection: "column"
    }, A0.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, A0.createElement(S, {
      marginBottom: 1
    }, A0.createElement($, {
      bold: !0
    }, "Plugin Details")), A0.createElement(S, {
      flexDirection: "column",
      marginBottom: 1
    }, A0.createElement($, {
      bold: !0
    }, K.entry.name), K.entry.version && A0.createElement($, {
      dimColor: !0
    }, "Version: ", K.entry.version), K.entry.description && A0.createElement(S, {
      marginTop: 1
    }, A0.createElement($, null, K.entry.description)), K.entry.author && A0.createElement(S, {
      marginTop: 1
    }, A0.createElement($, {
      dimColor: !0
    }, "By:", " ", typeof K.entry.author === "string" ? K.entry.author : K.entry.author.name))), A0.createElement(S, {
      flexDirection: "column",
      marginBottom: 1
    }, A0.createElement($, {
      bold: !0
    }, "Will install:"), K.entry.commands && A0.createElement($, {
      dimColor: !0
    }, "• Commands:", " ", Array.isArray(K.entry.commands) ? K.entry.commands.join(", ") : Object.keys(K.entry.commands).join(", ")), K.entry.agents && A0.createElement($, {
      dimColor: !0
    }, "• Agents:", " ", Array.isArray(K.entry.agents) ? K.entry.agents.join(", ") : Object.keys(K.entry.agents).join(", ")), K.entry.hooks && A0.createElement($, {
      dimColor: !0
    }, "• Hooks: ", Object.keys(K.entry.hooks).join(", ")), K.entry.mcpServers && A0.createElement($, {
      dimColor: !0
    }, "• MCP Servers:", " ", Array.isArray(K.entry.mcpServers) ? K.entry.mcpServers.join(", ") : typeof K.entry.mcpServers === "object" ? Object.keys(K.entry.mcpServers).join(", ") : "configured"), !K.entry.commands && !K.entry.agents && !K.entry.hooks && !K.entry.mcpServers && A0.createElement(A0.Fragment, null, typeof K.entry.source === "object" && "source" in K.entry.source && (K.entry.source.source === "github" || K.entry.source.source === "url" || K.entry.source.source === "npm" || K.entry.source.source === "pip") ? A0.createElement($, {
      dimColor: !0
    }, "• Component summary not available for remote plugin") : A0.createElement($, {
      dimColor: !0
    }, "• Components will be discovered at installation"))), k && A0.createElement(S, {
      marginBottom: 1
    }, A0.createElement($, {
      color: "error"
    }, "Error: ", k)), A0.createElement(S, {
      flexDirection: "column"
    }, wA.map((qA, KA) => A0.createElement(S, {
      key: qA.action
    }, p === KA && A0.createElement($, null, "> "), p !== KA && A0.createElement($, null, "  "), A0.createElement($, {
      bold: p === KA
    }, e && qA.action === "install" ? "Installing…" : qA.label))))), A0.createElement(S, {
      marginTop: 1,
      paddingLeft: 1
    }, A0.createElement($, {
      dimColor: !0
    }, A0.createElement($, {
      bold: !0
    }, "Select:"), " Enter", " • ", A0.createElement($, {
      bold: !0
    }, "Back:"), " Esc")))
  }
  if (E.length === 0) return A0.createElement(S, {
    flexDirection: "column"
  }, A0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, A0.createElement(S, {
    marginBottom: 1
  }, A0.createElement($, {
    bold: !0
  }, V, " ", H1.pointerSmall, " Install plugins")), A0.createElement($, {
    dimColor: !0
  }, "No new plugins available to install."), A0.createElement($, {
    dimColor: !0
  }, "All plugins from this marketplace are already installed.")), A0.createElement(S, {
    marginLeft: 3
  }, A0.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Esc to go back")));
  return A0.createElement(S, {
    flexDirection: "column"
  }, A0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, A0.createElement(S, {
    marginBottom: 1
  }, A0.createElement($, {
    bold: !0
  }, V, " ", H1.pointerSmall, " Install plugins")), E.map((NA, OA) => {
    let mA = N === OA,
      wA = T.has(NA.pluginId),
      qA = v.has(NA.pluginId),
      KA = OA === E.length - 1;
    return A0.createElement(S, {
      key: NA.pluginId,
      flexDirection: "column",
      marginBottom: KA && !A ? 0 : 1
    }, A0.createElement(S, null, A0.createElement($, {
      color: mA ? "suggestion" : void 0
    }, mA ? H1.pointer : " ", " "), A0.createElement($, null, qA ? H1.ellipsis : wA ? H1.radioOn : H1.radioOff, " ", NA.entry.name, NA.entry.category && A0.createElement($, {
      dimColor: !0
    }, " [", NA.entry.category, "]"))), NA.entry.description && A0.createElement(S, {
      marginLeft: 4
    }, A0.createElement($, {
      dimColor: !0
    }, NA.entry.description.length > 60 ? NA.entry.description.substring(0, 57) + "..." : NA.entry.description), NA.entry.version && A0.createElement($, {
      dimColor: !0
    }, " · v", NA.entry.version)))
  }), A && A0.createElement(S, {
    marginTop: 1
  }, A0.createElement($, {
    color: "error"
  }, H1.cross, " ", A))), A0.createElement(gx3, {
    hasSelection: T.size > 0
  }))
}
// @from(Start 14330426, End 14330857)
function gx3({
  hasSelection: A
}) {
  let Q = [];
  return Q.push("Space to (de)select"), Q.push("Enter for details"), Q.push("Esc to go back"), A0.createElement(S, {
    marginLeft: 3
  }, A0.createElement($, {
    italic: !0
  }, A && A0.createElement($, {
    bold: !0,
    color: "suggestion"
  }, "Press i to install ·", " "), A0.createElement($, {
    dimColor: !0
  }, "Space: (de)select · Enter: details · Esc: back")))
}
// @from(Start 14330862, End 14330864)
A0
// @from(Start 14330866, End 14330868)
OK
// @from(Start 14330874, End 14331028)
eH9 = L(() => {
  hA();
  hA();
  V9();
  oH();
  OLA();
  MB();
  sQA();
  q0();
  g1();
  gM();
  ejA();
  za();
  A0 = BA(VA(), 1), OK = BA(VA(), 1)
})
// @from(Start 14331031, End 14333970)
function AC9({
  pluginName: A,
  serverName: Q,
  configSchema: B,
  onSave: G,
  onCancel: Z
}) {
  let I = Object.keys(B),
    [Y, J] = AG.useState(0),
    [W, X] = AG.useState({}),
    [V, F] = AG.useState(""),
    K = I[Y],
    D = K ? B[K] : null,
    H = EQ(Z);
  if (f1((q, w) => {
      if (w.escape) {
        Z();
        return
      }
      if (w.tab && Y < I.length - 1) {
        if (K) X({
          ...W,
          [K]: V
        });
        J(Y + 1), F("");
        return
      }
      if (w.return) {
        if (K) {
          let N = {
            ...W,
            [K]: V
          };
          if (Y === I.length - 1) {
            let R = {};
            for (let T of I) {
              let y = N[T] || "",
                v = B[T];
              if (v?.type === "number") {
                let x = Number(y);
                R[T] = isNaN(x) ? y : x
              } else if (v?.type === "boolean") R[T] = y.toLowerCase() === "true" || y === "1";
              else R[T] = y
            }
            G(R)
          } else X(N), J(Y + 1), F("")
        }
        return
      }
      if (w.backspace || w.delete) {
        F(V.slice(0, -1));
        return
      }
      if (q && !w.ctrl && !w.meta) F(V + q)
    }), !D || !K) return null;
  let C = D.sensitive === !0,
    E = D.required === !0,
    U = C ? "*".repeat(V.length) : V;
  return AG.default.createElement(S, {
    flexDirection: "column"
  }, AG.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round"
  }, AG.default.createElement($, {
    bold: !0
  }, "Configure ", Q), AG.default.createElement(S, {
    marginLeft: 1
  }, AG.default.createElement($, {
    dimColor: !0
  }, "Plugin: ", A)), AG.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, AG.default.createElement($, {
    bold: !0
  }, D.title || K, E && AG.default.createElement($, {
    color: "error"
  }, " *")), D.description && AG.default.createElement($, {
    dimColor: !0
  }, D.description), AG.default.createElement(S, {
    marginTop: 1
  }, AG.default.createElement($, null, H1.pointerSmall, " "), AG.default.createElement($, null, U), AG.default.createElement($, null, "█"))), AG.default.createElement(S, {
    marginTop: 1
  }, AG.default.createElement($, {
    dimColor: !0
  }, "Field ", Y + 1, " of ", I.length)), Y < I.length - 1 && AG.default.createElement(S, null, AG.default.createElement($, {
    dimColor: !0
  }, "Tab: Next field · Enter: Save and continue")), Y === I.length - 1 && AG.default.createElement(S, null, AG.default.createElement($, {
    dimColor: !0
  }, "Enter: Save configuration"))), AG.default.createElement(S, {
    marginLeft: 3
  }, AG.default.createElement($, {
    dimColor: !0
  }, H.pending ? AG.default.createElement(AG.default.Fragment, null, "Press ", H.keyName, " again to exit") : AG.default.createElement(AG.default.Fragment, null, "Esc to cancel"))))
}
// @from(Start 14333975, End 14333977)
AG
// @from(Start 14333983, End 14334044)
QC9 = L(() => {
  hA();
  Q4();
  V9();
  AG = BA(VA(), 1)
})
// @from(Start 14334111, End 14334577)
async function BC9(A) {
  try {
    return (await oQA.readdir(A, {
      withFileTypes: !0
    })).filter((B) => B.isFile() && B.name.endsWith(".md")).map((B) => {
      return RVA.basename(B.name, ".md")
    })
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return g(`Failed to read plugin components from ${A}: ${B}`, {
      level: "error"
    }), AA(Q instanceof Error ? Q : Error(`Failed to read plugin components: ${B}`)), []
  }
}
// @from(Start 14334578, End 14335166)
async function ux3(A) {
  try {
    let Q = await oQA.readdir(A, {
        withFileTypes: !0
      }),
      B = [];
    for (let G of Q)
      if (G.isDirectory() || G.isSymbolicLink()) {
        let Z = RVA.join(A, G.name, "SKILL.md");
        try {
          await oQA.access(Z), B.push(G.name)
        } catch {}
      } return B
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return g(`Failed to read skill directories from ${A}: ${B}`, {
      level: "error"
    }), AA(Q instanceof Error ? Q : Error(`Failed to read skill directories: ${B}`)), []
  }
}
// @from(Start 14335168, End 14339002)
function mx3({
  plugin: A,
  marketplace: Q
}) {
  let [B, G] = tJ.useState(null), [Z, I] = tJ.useState(!0), [Y, J] = tJ.useState(null);
  if (tJ.useEffect(() => {
      async function X() {
        try {
          let F = (await _D(Q)).plugins.find((K) => K.name === A.name);
          if (F) {
            let K = [];
            if (A.commandsPath) K.push(A.commandsPath);
            if (A.commandsPaths) K.push(...A.commandsPaths);
            let D = [];
            for (let N of K)
              if (typeof N === "string") {
                let R = await BC9(N);
                D.push(...R)
              } let H = [];
            if (A.agentsPath) H.push(A.agentsPath);
            if (A.agentsPaths) H.push(...A.agentsPaths);
            let C = [];
            for (let N of H)
              if (typeof N === "string") {
                let R = await BC9(N);
                C.push(...R)
              } let E = [];
            if (A.skillsPath) E.push(A.skillsPath);
            if (A.skillsPaths) E.push(...A.skillsPaths);
            let U = [];
            for (let N of E)
              if (typeof N === "string") {
                let R = await ux3(N);
                U.push(...R)
              } let q = [];
            if (A.hooksConfig) q.push(Object.keys(A.hooksConfig));
            if (F.hooks) q.push(F.hooks);
            let w = [];
            if (A.mcpServers) w.push(Object.keys(A.mcpServers));
            if (F.mcpServers) w.push(F.mcpServers);
            G({
              commands: D.length > 0 ? D : null,
              agents: C.length > 0 ? C : null,
              skills: U.length > 0 ? U : null,
              hooks: q.length > 0 ? q : null,
              mcpServers: w.length > 0 ? w : null
            })
          } else J(`Plugin ${A.name} not found in marketplace`)
        } catch (V) {
          J(V instanceof Error ? V.message : "Failed to load components")
        } finally {
          I(!1)
        }
      }
      X()
    }, [A.name, A.commandsPath, A.commandsPaths, A.agentsPath, A.agentsPaths, A.skillsPath, A.skillsPaths, A.hooksConfig, A.mcpServers, Q]), Z) return null;
  if (Y) return Q0.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, Q0.createElement($, {
    bold: !0
  }, "Components:"), Q0.createElement($, {
    dimColor: !0
  }, "Error: ", Y));
  if (!B) return null;
  if (!(B.commands || B.agents || B.skills || B.hooks || B.mcpServers)) return null;
  return Q0.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, Q0.createElement($, {
    bold: !0
  }, "Installed components:"), B.commands ? Q0.createElement($, {
    dimColor: !0
  }, "• Commands:", " ", typeof B.commands === "string" ? B.commands : Array.isArray(B.commands) ? B.commands.join(", ") : Object.keys(B.commands).join(", ")) : null, B.agents ? Q0.createElement($, {
    dimColor: !0
  }, "• Agents:", " ", typeof B.agents === "string" ? B.agents : Array.isArray(B.agents) ? B.agents.join(", ") : Object.keys(B.agents).join(", ")) : null, B.skills ? Q0.createElement($, {
    dimColor: !0
  }, "• Skills:", " ", typeof B.skills === "string" ? B.skills : Array.isArray(B.skills) ? B.skills.join(", ") : Object.keys(B.skills).join(", ")) : null, B.hooks ? Q0.createElement($, {
    dimColor: !0
  }, "• Hooks:", " ", typeof B.hooks === "string" ? B.hooks : Array.isArray(B.hooks) ? B.hooks.map(String).join(", ") : typeof B.hooks === "object" && B.hooks !== null ? Object.keys(B.hooks).join(", ") : String(B.hooks)) : null, B.mcpServers ? Q0.createElement($, {
    dimColor: !0
  }, "• MCP Servers:", " ", typeof B.mcpServers === "string" ? B.mcpServers : Array.isArray(B.mcpServers) ? B.mcpServers.map(String).join(", ") : typeof B.mcpServers === "object" && B.mcpServers !== null ? Object.keys(B.mcpServers).join(", ") : String(B.mcpServers)) : null)
}
// @from(Start 14339003, End 14339243)
async function GK0(A, Q) {
  let G = (await _D(Q))?.plugins.find((Z) => Z.name === A);
  if (G && typeof G.source === "string") return `Local plugins cannot be updated remotely. To update, modify the source at: ${G.source}`;
  return null
}
// @from(Start 14339245, End 14362332)
function GC9({
  setViewState: A,
  setResult: Q,
  onManageComplete: B,
  targetPlugin: G,
  action: Z
}) {
  let [I, Y] = tJ.useState("marketplace-list"), [J, W] = tJ.useState(null), [X, V] = tJ.useState(null), [F, K] = tJ.useState([]), [D, H] = tJ.useState([]), [C, E] = tJ.useState(!0), [U, q] = tJ.useState(0), [w, N] = tJ.useState(0), [R, T] = tJ.useState(!1), [y, v] = tJ.useState(null), [x, p] = tJ.useState(null), [u, e] = tJ.useState(!1), [l, k] = tJ.useState(!1);
  tJ.useEffect(() => {
    if (!X) {
      k(!1);
      return
    }
    async function KA() {
      let yA = X.plugin.manifest.mcpServers,
        oA = !1;
      if (yA) oA = typeof yA === "string" && rM(yA) || Array.isArray(yA) && yA.some((X1) => typeof X1 === "string" && rM(X1));
      if (!oA) try {
        let X1 = RVA.join(X.plugin.path, ".."),
          WA = RVA.join(X1, ".claude-plugin", "marketplace.json"),
          EA = await oQA.readFile(WA, "utf-8"),
          DA = JSON.parse(EA).plugins?.find(($A) => $A.name === X.plugin.name);
        if (DA?.mcpServers) {
          let $A = DA.mcpServers;
          oA = typeof $A === "string" && rM($A) || Array.isArray($A) && $A.some((TA) => typeof TA === "string" && rM(TA))
        }
      } catch (X1) {
        g(`Failed to read raw marketplace.json: ${X1}`)
      }
      k(oA)
    }
    KA()
  }, [X]), tJ.useEffect(() => {
    async function KA() {
      E(!0);
      try {
        let {
          enabled: yA,
          disabled: oA
        } = await l7(), X1 = [...yA, ...oA], WA = l0(), EA = {};
        for (let DA of X1) {
          let $A = DA.source.split("@")[1] || "local";
          if (!EA[$A]) EA[$A] = [];
          EA[$A].push(DA)
        }
        let MA = [];
        for (let [DA, $A] of Object.entries(EA)) {
          let TA = $A.filter((iA) => {
              let J1 = `${iA.name}@${DA}`;
              return WA?.enabledPlugins?.[J1] !== !1
            }).length,
            rA = $A.length - TA;
          MA.push({
            name: DA,
            installedPlugins: $A,
            enabledCount: TA,
            disabledCount: rA
          })
        }
        MA.sort((DA, $A) => DA.name.localeCompare($A.name)), K(MA), q(0)
      } finally {
        E(!1)
      }
    }
    KA()
  }, []), tJ.useEffect(() => {
    if (J && I === "plugin-list") {
      let KA = F.find((yA) => yA.name === J);
      if (KA) {
        let yA = KA.installedPlugins.map((oA) => {
          return {
            plugin: oA,
            marketplace: KA.name,
            pendingEnable: void 0,
            pendingUpdate: !1
          }
        });
        H(yA), q(0)
      }
    }
  }, [J, I, F]);
  let m = () => {
      return D.some((KA) => KA.pendingEnable !== void 0 || KA.pendingUpdate)
    },
    o = () => {
      let KA = D.filter((X1) => X1.pendingUpdate).length,
        yA = D.filter((X1) => X1.pendingEnable === !0).length,
        oA = D.filter((X1) => X1.pendingEnable === !1).length;
      return {
        updateCount: KA,
        enableCount: yA,
        disableCount: oA
      }
    },
    IA = async () => {
      T(!0), v(null);
      try {
        let yA = {
            ...OB("userSettings")?.enabledPlugins
          },
          oA = 0,
          X1 = 0,
          WA = 0;
        for (let DA of D) {
          let $A = `${DA.plugin.name}@${DA.marketplace}`;
          if (DA.pendingUpdate) {
            let rA = (await _D(DA.marketplace))?.plugins.find((iA) => iA.name === DA.plugin.name);
            if (rA && typeof rA.source !== "string") await Bj($A, rA), oA++
          }
          if (DA.pendingEnable !== void 0)
            if (DA.pendingEnable) {
              if (!gg($A)) {
                let rA = (await _D(DA.marketplace))?.plugins.find((iA) => iA.name === DA.plugin.name);
                if (rA && typeof rA.source !== "string") await Bj($A, rA)
              }
              yA[$A] = !0, X1++
            } else yA[$A] = !1, WA++
        }
        cB("userSettings", {
          enabledPlugins: yA
        }), AF();
        let EA = [];
        if (oA > 0) EA.push(`Updated ${oA} plugin${oA!==1?"s":""}`);
        if (X1 > 0) EA.push(`Enabled ${X1} plugin${X1!==1?"s":""}`);
        if (WA > 0) EA.push(`Disabled ${WA} plugin${WA!==1?"s":""}`);
        let MA = `✓ ${EA.join(", ")}. Restart Claude Code to apply changes.`;
        if (Q(MA), B) await B();
        A({
          type: "menu"
        })
      } catch (KA) {
        T(!1);
        let yA = KA instanceof Error ? KA.message : String(KA);
        v(`Failed to apply changes: ${yA}`), AA(KA instanceof Error ? KA : Error(`Failed to apply plugin changes: ${String(KA)}`))
      }
    }, FA = async (KA) => {
      let oA = {
          ...OB("userSettings")?.enabledPlugins
        },
        MA = yQA().plugins[KA]?.find(($A) => $A.scope === "user")?.installPath;
      if (O39(KA), pI1(KA, "user"), MA && MA.includes("/cache/")) try {
        lI1(MA)
      } catch ($A) {
        AA($A instanceof Error ? $A : Error(String($A)))
      } else if (MA) g(`Skipping cache deletion for plugin ${KA} at ${MA} (not a cache path)`);
      oA[KA] = void 0;
      let {
        error: DA
      } = cB("userSettings", {
        enabledPlugins: oA
      });
      if (DA) throw DA;
      AF()
    }, zA = async (KA) => {
      if (!X) return;
      T(!0), v(null);
      try {
        let yA = `${X.plugin.name}@${X.marketplace}`,
          X1 = {
            ...OB("userSettings")?.enabledPlugins
          };
        switch (KA) {
          case "enable": {
            if (!gg(yA)) {
              let DA = (await _D(X.marketplace))?.plugins.find(($A) => $A.name === X.plugin.name);
              if (DA && typeof DA.source !== "string") await Bj(yA, DA)
            }
            X1[yA] = !0;
            break
          }
          case "disable":
            X1[yA] = !1;
            break;
          case "uninstall": {
            await FA(yA);
            break
          }
          case "update": {
            let DA = (await _D(X.marketplace))?.plugins.find(($A) => $A.name === X.plugin.name);
            if (DA && typeof DA.source !== "string") await Bj(yA, DA);
            break
          }
        }
        if (KA !== "uninstall") {
          let {
            error: MA
          } = cB("userSettings", {
            enabledPlugins: X1
          });
          if (MA) throw MA;
          AF()
        }
        let EA = `✓ ${KA==="enable"?"Enabled":KA==="disable"?"Disabled":KA==="update"?"Updated":"Uninstalled"} ${X.plugin.name}. Restart Claude Code to apply changes.`;
        if (Q(EA), B) await B();
        A({
          type: "menu"
        })
      } catch (yA) {
        T(!1);
        let oA = yA instanceof Error ? yA.message : String(yA);
        v(`Failed to ${KA}: ${oA}`), AA(yA instanceof Error ? yA : Error(`Failed to ${KA} plugin: ${String(yA)}`))
      }
    }, NA = async (KA) => {
      T(!0), v(null);
      try {
        let yA = `${KA.plugin.name}@${KA.marketplace}`;
        await FA(yA);
        let {
          enabled: oA,
          disabled: X1
        } = await l7(), WA = [...oA, ...X1];
        if (F.find((MA) => MA.name === J)) {
          let MA = WA.filter((iA) => {
              return (iA.source.split("@")[1] || "local") === J
            }),
            DA = MA.map((iA) => ({
              plugin: iA,
              marketplace: J,
              pendingEnable: void 0,
              pendingUpdate: !1
            }));
          H(DA);
          let $A = l0(),
            TA = MA.filter((iA) => {
              let J1 = `${iA.name}@${J}`;
              return $A?.enabledPlugins?.[J1] !== !1
            }).length,
            rA = MA.length - TA;
          if (K((iA) => iA.map((J1) => J1.name === J ? {
              ...J1,
              installedPlugins: MA,
              enabledCount: TA,
              disabledCount: rA
            } : J1)), U >= DA.length) q(Math.max(0, DA.length - 1))
        }
        Q(`✓ Uninstalled ${KA.plugin.name}. Restart Claude Code to apply changes.`)
      } catch (yA) {
        let oA = yA instanceof Error ? yA.message : String(yA);
        v(`Failed to uninstall: ${oA}`), AA(yA instanceof Error ? yA : Error(`Failed to uninstall plugin: ${String(yA)}`))
      } finally {
        T(!1)
      }
    };
  if (f1((KA, yA) => {
      if (yA.escape) {
        if (I === "plugin-list") Y("marketplace-list"), W(null), H([]);
        else if (I === "plugin-details") Y("plugin-list"), V(null), v(null);
        else if (I === "configuring") Y("plugin-details"), p(null);
        else A({
          type: "menu"
        });
        return
      }
      if (I === "marketplace-list") {
        if ((yA.upArrow || KA === "k") && U > 0) q(U - 1);
        else if ((yA.downArrow || KA === "j") && U < F.length - 1) q(U + 1);
        else if (yA.return) {
          let oA = F[U];
          if (oA) W(oA.name), Y("plugin-list")
        }
      } else if (I === "plugin-list") {
        let oA = m(),
          X1 = D.length + (oA ? 1 : 0);
        if ((yA.upArrow || KA === "k") && U > 0) q(U - 1);
        else if ((yA.downArrow || KA === "j") && U < X1 - 1) q(U + 1);
        else if (KA === " " && U < D.length) {
          let WA = [...D],
            EA = WA[U];
          if (EA) {
            let MA = l0(),
              DA = `${EA.plugin.name}@${EA.marketplace}`,
              $A = MA?.enabledPlugins?.[DA] !== !1;
            if (EA.pendingEnable === void 0) EA.pendingEnable = !$A;
            else EA.pendingEnable = void 0;
            H(WA)
          }
        } else if (KA === "u" && U < D.length) {
          let WA = [...D],
            EA = WA[U];
          if (EA)(async () => {
            try {
              let DA = await GK0(EA.plugin.name, EA.marketplace);
              if (DA) {
                v(DA);
                return
              }
              EA.pendingUpdate = !EA.pendingUpdate, H(WA)
            } catch (DA) {
              v(DA instanceof Error ? DA.message : "Failed to check plugin update availability")
            }
          })()
        } else if (yA.delete || yA.backspace) {
          if (U < D.length && !R) {
            let WA = D[U];
            if (WA) NA(WA)
          }
        } else if (yA.return) {
          if (U === D.length && oA) IA();
          else if (U < D.length) {
            let WA = D[U];
            if (WA) V(WA), Y("plugin-details"), N(0), v(null)
          }
        }
      } else if (I === "plugin-details" && X) {
        let oA = l0(),
          X1 = `${X.plugin.name}@${X.marketplace}`,
          WA = oA?.enabledPlugins?.[X1] !== !1,
          EA = [];
        if (EA.push({
            label: WA ? "Disable plugin" : "Enable plugin",
            action: () => void zA(WA ? "disable" : "enable")
          }), EA.push({
            label: X.pendingUpdate ? "Unmark for update" : "Mark for update",
            action: async () => {
              try {
                let MA = await GK0(X.plugin.name, X.marketplace);
                if (MA) {
                  v(MA);
                  return
                }
                let DA = [...D],
                  $A = DA.findIndex((TA) => TA.plugin.name === X.plugin.name && TA.marketplace === X.marketplace);
                if ($A !== -1) DA[$A].pendingUpdate = !X.pendingUpdate, H(DA), V({
                  ...X,
                  pendingUpdate: !X.pendingUpdate
                })
              } catch (MA) {
                v(MA instanceof Error ? MA.message : "Failed to check plugin update availability")
              }
            }
          }), l) EA.push({
          label: "Configure",
          action: async () => {
            e(!0);
            try {
              let MA = X.plugin.manifest.mcpServers,
                DA = null;
              if (typeof MA === "string" && rM(MA)) DA = MA;
              else if (Array.isArray(MA)) {
                for (let rA of MA)
                  if (typeof rA === "string" && rM(rA)) {
                    DA = rA;
                    break
                  }
              }
              if (!DA) {
                v("No MCPB file found in plugin"), e(!1);
                return
              }
              let $A = `${X.plugin.name}@${X.marketplace}`,
                TA = await BMA(DA, X.plugin.path, $A, void 0, void 0, !0);
              if ("status" in TA && TA.status === "needs-config") p(TA), Y("configuring");
              else v("Failed to load MCPB for configuration")
            } catch (MA) {
              let DA = MA instanceof Error ? MA.message : String(MA);
              v(`Failed to load configuration: ${DA}`)
            } finally {
              e(!1)
            }
          }
        });
        if (EA.push({
            label: "Update now",
            action: () => void zA("update")
          }), EA.push({
            label: "Uninstall",
            action: () => void zA("uninstall")
          }), X.plugin.manifest.homepage) EA.push({
          label: "Open homepage",
          action: () => void cZ(X.plugin.manifest.homepage)
        });
        if (X.plugin.manifest.repository) EA.push({
          label: "View on GitHub",
          action: () => void cZ(X.plugin.manifest.repository)
        });
        if (EA.push({
            label: "Back to plugin list",
            action: () => {
              Y("plugin-list"), V(null), v(null)
            }
          }), (yA.upArrow || KA === "k") && w > 0) N(w - 1);
        else if ((yA.downArrow || KA === "j") && w < EA.length - 1) N(w + 1);
        else if (yA.return && EA[w]) EA[w].action()
      }
    }), C) return Q0.createElement(S, {
    flexDirection: "column"
  }, Q0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Q0.createElement($, null, "Loading installed plugins…")));
  if (F.length === 0) return Q0.createElement(S, {
    flexDirection: "column"
  }, Q0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Q0.createElement(S, {
    marginBottom: 1
  }, Q0.createElement($, {
    bold: !0
  }, "Manage plugins")), Q0.createElement($, null, "No plugins installed.")), Q0.createElement(S, {
    marginTop: 1,
    paddingLeft: 1
  }, Q0.createElement($, {
    dimColor: !0
  }, "Esc to go back")));
  if (I === "marketplace-list") return Q0.createElement(S, {
    flexDirection: "column"
  }, Q0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Q0.createElement($, {
    bold: !0
  }, "Manage plugins"), Q0.createElement(S, {
    marginBottom: 1
  }, Q0.createElement($, {
    dimColor: !0
  }, "Select a marketplace to manage plugins:")), F.map((KA, yA) => {
    let oA = yA === U,
      X1 = KA.installedPlugins.length,
      WA = KA.enabledCount ?? X1,
      EA = KA.disabledCount ?? 0,
      MA = yA === F.length - 1;
    return Q0.createElement(S, {
      key: KA.name,
      flexDirection: "column",
      marginBottom: MA ? 0 : 1
    }, Q0.createElement(S, null, Q0.createElement($, {
      color: oA ? "suggestion" : void 0
    }, oA ? H1.pointer : " ", " ", KA.name)), Q0.createElement(S, {
      marginLeft: 2
    }, Q0.createElement($, {
      dimColor: !0
    }, X1, " plugin", X1 !== 1 ? "s" : "", " installed", WA > 0 && ` · ${WA} enabled`, EA > 0 && ` · ${EA} disabled`)))
  })), Q0.createElement(S, {
    paddingLeft: 1
  }, Q0.createElement($, {
    dimColor: !0,
    italic: !0
  }, H1.arrowUp, H1.arrowDown, " enter to select · esc to go back")));
  if (I === "configuring" && x && X) {
    let oA = function() {
        p(null), Y("plugin-details")
      },
      KA = `${X.plugin.name}@${X.marketplace}`;
    async function yA(X1) {
      if (!x || !X) return;
      try {
        let WA = X.plugin.manifest.mcpServers,
          EA = null;
        if (typeof WA === "string" && rM(WA)) EA = WA;
        else if (Array.isArray(WA)) {
          for (let MA of WA)
            if (typeof MA === "string" && rM(MA)) {
              EA = MA;
              break
            }
        }
        if (!EA) {
          v("No MCPB file found"), Y("plugin-details");
          return
        }
        await BMA(EA, X.plugin.path, KA, void 0, X1), v(null), p(null), Y("plugin-details"), Q("Configuration saved. Restart Claude Code for changes to take effect.")
      } catch (WA) {
        let EA = WA instanceof Error ? WA.message : String(WA);
        v(`Failed to save configuration: ${EA}`), Y("plugin-details")
      }
    }
    return Q0.createElement(AC9, {
      pluginName: X.plugin.name,
      serverName: x.manifest.name,
      configSchema: x.configSchema,
      onSave: yA,
      onCancel: oA
    })
  }
  if (I === "plugin-details" && X) {
    let KA = l0(),
      yA = `${X.plugin.name}@${X.marketplace}`,
      oA = KA?.enabledPlugins?.[yA] !== !1,
      X1 = [];
    if (X1.push({
        label: oA ? "Disable plugin" : "Enable plugin",
        action: () => void zA(oA ? "disable" : "enable")
      }), X1.push({
        label: X.pendingUpdate ? "Unmark for update" : "Mark for update",
        action: async () => {
          try {
            let WA = await GK0(X.plugin.name, X.marketplace);
            if (WA) {
              v(WA);
              return
            }
            let EA = [...D],
              MA = EA.findIndex((DA) => DA.plugin.name === X.plugin.name && DA.marketplace === X.marketplace);
            if (MA !== -1) EA[MA].pendingUpdate = !X.pendingUpdate, H(EA), V({
              ...X,
              pendingUpdate: !X.pendingUpdate
            })
          } catch (WA) {
            v(WA instanceof Error ? WA.message : "Failed to check plugin update availability")
          }
        }
      }), l) X1.push({
      label: "Configure",
      action: () => {}
    });
    if (X1.push({
        label: "Update now",
        action: () => void zA("update")
      }), X1.push({
        label: "Uninstall",
        action: () => void zA("uninstall")
      }), X.plugin.manifest.homepage) X1.push({
      label: "Open homepage",
      action: () => void cZ(X.plugin.manifest.homepage)
    });
    if (X.plugin.manifest.repository) X1.push({
      label: "View on GitHub",
      action: () => void cZ(X.plugin.manifest.repository)
    });
    return X1.push({
      label: "Back to plugin list",
      action: () => {
        Y("plugin-list"), V(null), v(null)
      }
    }), Q0.createElement(S, {
      flexDirection: "column"
    }, Q0.createElement(S, {
      flexDirection: "column",
      paddingX: 1,
      borderStyle: "round"
    }, Q0.createElement(S, {
      marginBottom: 1
    }, Q0.createElement($, {
      bold: !0
    }, X.plugin.name, " @ ", X.marketplace)), X.plugin.manifest.version && Q0.createElement(S, {
      marginBottom: 1
    }, Q0.createElement($, {
      dimColor: !0
    }, "Version: "), Q0.createElement($, null, X.plugin.manifest.version)), X.plugin.manifest.description && Q0.createElement(S, {
      marginBottom: 1
    }, Q0.createElement($, null, X.plugin.manifest.description)), X.plugin.manifest.author && Q0.createElement(S, {
      marginBottom: 1
    }, Q0.createElement($, {
      dimColor: !0
    }, "Author: "), Q0.createElement($, null, X.plugin.manifest.author.name)), Q0.createElement(S, {
      marginBottom: 1
    }, Q0.createElement($, {
      dimColor: !0
    }, "Status: "), Q0.createElement($, {
      color: oA ? "success" : "warning"
    }, oA ? "Enabled" : "Disabled"), X.pendingUpdate && Q0.createElement($, {
      color: "suggestion"
    }, " · Marked for update")), Q0.createElement(mx3, {
      plugin: X.plugin,
      marketplace: X.marketplace
    }), Q0.createElement(S, {
      marginTop: 1,
      flexDirection: "column"
    }, X1.map((WA, EA) => {
      let MA = EA === w;
      return Q0.createElement(S, {
        key: EA
      }, MA && Q0.createElement($, null, H1.pointer, " "), !MA && Q0.createElement($, null, "  "), Q0.createElement($, {
        bold: MA,
        color: WA.label.includes("Uninstall") ? "error" : WA.label.includes("Update") ? "suggestion" : void 0
      }, WA.label))
    })), R && Q0.createElement(S, {
      marginTop: 1
    }, Q0.createElement($, null, "Processing…")), y && Q0.createElement(S, {
      marginTop: 1
    }, Q0.createElement($, {
      color: "error"
    }, y))), Q0.createElement(S, {
      marginTop: 1,
      paddingLeft: 1
    }, Q0.createElement($, {
      dimColor: !0
    }, Q0.createElement($, {
      bold: !0
    }, "Navigate:"), " ", H1.arrowUp, H1.arrowDown, " • ", Q0.createElement($, {
      bold: !0
    }, "Select:"), " Enter", " • ", Q0.createElement($, {
      bold: !0
    }, "Back:"), " Esc")))
  }
  let OA = m(),
    {
      updateCount: mA,
      enableCount: wA,
      disableCount: qA
    } = o();
  return Q0.createElement(S, {
    flexDirection: "column"
  }, Q0.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Q0.createElement(S, {
    marginBottom: 1
  }, Q0.createElement($, {
    bold: !0
  }, J, " ", H1.pointerSmall, " Manage plugins")), D.map((KA, yA) => {
    let oA = l0(),
      X1 = `${KA.plugin.name}@${KA.marketplace}`,
      WA = oA?.enabledPlugins?.[X1] !== !1,
      EA = KA.pendingEnable !== void 0 ? KA.pendingEnable : WA,
      MA = yA === U,
      DA = KA.pendingEnable !== void 0 || KA.pendingUpdate,
      $A = yA === D.length - 1;
    return Q0.createElement(S, {
      key: X1,
      flexDirection: "column",
      marginBottom: $A ? 0 : 1
    }, Q0.createElement(S, null, Q0.createElement($, {
      color: MA ? "suggestion" : void 0
    }, MA ? H1.pointer : " ", " "), Q0.createElement($, {
      color: KA.pendingEnable !== void 0 ? "warning" : EA ? "success" : void 0
    }, EA ? H1.radioOn : H1.radioOff, " "), Q0.createElement($, {
      bold: MA,
      color: KA.pendingUpdate ? "suggestion" : DA ? "warning" : void 0
    }, KA.plugin.name)), Q0.createElement(S, {
      marginLeft: 4
    }, Q0.createElement($, {
      dimColor: !0
    }, KA.plugin.manifest.description ? KA.plugin.manifest.description.length > 50 ? KA.plugin.manifest.description.substring(0, 47) + "..." : KA.plugin.manifest.description : "No description", KA.plugin.manifest.version && ` · v${KA.plugin.manifest.version}`), KA.pendingUpdate && Q0.createElement($, {
      color: "suggestion"
    }, " · Marked for update")))
  }), OA && Q0.createElement(S, {
    marginTop: 1
  }, U === D.length && Q0.createElement($, null, H1.pointer, " "), U !== D.length && Q0.createElement($, null, "  "), Q0.createElement($, {
    bold: U === D.length,
    color: "success"
  }, "Apply changes"), Q0.createElement($, {
    dimColor: !0
  }, " ", mA > 0 && `(update ${mA})`, wA > 0 && ` (enable ${wA})`, qA > 0 && ` (disable ${qA})`))), OA && Q0.createElement(S, {
    marginTop: 1,
    paddingLeft: 1
  }, Q0.createElement($, {
    color: "warning"
  }, "Restart to apply changes")), Q0.createElement(S, {
    paddingLeft: 3,
    flexDirection: "column"
  }, Q0.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Space to toggle enabled · 'u' to mark update · Delete to uninstall"), Q0.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter for details · Esc to back")))
}
// @from(Start 14362337, End 14362339)
Q0
// @from(Start 14362341, End 14362343)
tJ
// @from(Start 14362349, End 14362520)
ZC9 = L(() => {
  hA();
  hA();
  V9();
  fV();
  oH();
  MB();
  sQA();
  gM();
  g1();
  V0();
  za();
  ejA();
  QC9();
  M10();
  Q0 = BA(VA(), 1), tJ = BA(VA(), 1)
})
// @from(Start 14362523, End 14364468)
function dx3(A) {
  switch (A.type) {
    case "path-not-found":
      return `${A.component} path not found: ${A.path}`;
    case "git-auth-failed":
      return `Git ${A.authType.toUpperCase()} authentication failed for ${A.gitUrl}`;
    case "git-timeout":
      return `Git ${A.operation} timed out for ${A.gitUrl}`;
    case "network-error":
      return `Network error accessing ${A.url}${A.details?`: ${A.details}`:""}`;
    case "manifest-parse-error":
      return `Failed to parse manifest at ${A.manifestPath}: ${A.parseError}`;
    case "manifest-validation-error":
      return `Invalid manifest at ${A.manifestPath}: ${A.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin '${A.pluginId}' not found in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return `Marketplace '${A.marketplace}' not found`;
    case "marketplace-load-failed":
      return `Failed to load marketplace '${A.marketplace}': ${A.reason}`;
    case "repository-scan-failed":
      return `Failed to scan repository at ${A.repositoryPath}: ${A.reason}`;
    case "mcp-config-invalid":
      return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
    case "hook-load-failed":
      return `Failed to load hooks from ${A.hookPath}: ${A.reason}`;
    case "component-load-failed":
      return `Failed to load ${A.component} from ${A.path}: ${A.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${A.url}: ${A.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
    case "marketplace-blocked-by-policy":
      return `Marketplace '${A.marketplace}' is not allowed by enterprise policy`;
    case "generic-error":
      return A.error;
    default:
      return "Unknown error"
  }
}
// @from(Start 14364470, End 14366401)
function IC9(A) {
  switch (A.type) {
    case "path-not-found":
      return "→ Check that the path in your manifest or marketplace config is correct";
    case "git-auth-failed":
      return A.authType === "ssh" ? "→ Configure SSH keys or use HTTPS URL instead" : "→ Configure credentials or use SSH URL instead";
    case "git-timeout":
    case "network-error":
      return "→ Check your internet connection and try again";
    case "manifest-parse-error":
      return "→ Check manifest file syntax in the plugin directory";
    case "manifest-validation-error":
      return "→ Check manifest file follows the required schema";
    case "plugin-not-found":
      return `→ Plugin may not exist in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return A.availableMarketplaces.length > 0 ? `→ Available marketplaces: ${A.availableMarketplaces.join(", ")}` : "→ Add the marketplace first using /plugin marketplace add";
    case "mcp-config-invalid":
      return "→ Check MCP server configuration in .mcp.json or manifest";
    case "hook-load-failed":
      return "→ Check hooks.json file syntax and structure";
    case "component-load-failed":
      return `→ Check ${A.component} directory structure and file permissions`;
    case "mcpb-download-failed":
      return "→ Check your internet connection and URL accessibility";
    case "mcpb-extract-failed":
      return "→ Verify the MCPB file is valid and not corrupted";
    case "mcpb-invalid-manifest":
      return "→ Contact the plugin author about the invalid manifest";
    case "marketplace-blocked-by-policy":
      return A.allowedSources.length > 0 ? `→ Allowed sources: ${A.allowedSources.join(", ")}` : "→ Contact your administrator to configure allowed marketplace sources";
    case "repository-scan-failed":
    case "marketplace-load-failed":
    case "generic-error":
      return null;
    default:
      return null
  }
}
// @from(Start 14366403, End 14372220)
function JC9({
  onComplete: A
}) {
  let [Q, B] = OQ(), {
    installationStatus: G,
    errors: Z
  } = Q.plugins;
  EQ();
  let I = YC9.useCallback(() => {
    B((F) => ({
      ...F,
      plugins: {
        ...F.plugins,
        installationStatus: {
          marketplaces: F.plugins.installationStatus.marketplaces.map((K) => K.status === "failed" ? {
            ...K,
            status: "pending"
          } : K),
          plugins: F.plugins.installationStatus.plugins.map((K) => K.status === "failed" ? {
            ...K,
            status: "pending"
          } : K)
        }
      }
    })), BY1(B)
  }, [B]);
  f1((F, K) => {
    if (K.escape) A();
    else if (F === "r" || F === "R") I()
  });
  let Y = {
      pending: G.marketplaces.filter((F) => F.status === "pending").length,
      installing: G.marketplaces.filter((F) => F.status === "installing").length,
      installed: G.marketplaces.filter((F) => F.status === "installed").length,
      failed: G.marketplaces.filter((F) => F.status === "failed").length
    },
    J = {
      pending: G.plugins.filter((F) => F.status === "pending").length,
      installing: G.plugins.filter((F) => F.status === "installing").length,
      installed: G.plugins.filter((F) => F.status === "installed").length,
      failed: G.plugins.filter((F) => F.status === "failed").length
    },
    W = Y.installing > 0 || J.installing > 0 || Y.pending > 0 || J.pending > 0,
    X = Z.length > 0,
    V = G.marketplaces.length > 0 || G.plugins.length > 0;
  return E0.createElement(S, {
    flexDirection: "column"
  }, E0.createElement(S, {
    marginBottom: 1
  }, E0.createElement($, {
    bold: !0
  }, X && !V ? "Plugin Loading Errors" : "Plugin Status")), G.marketplaces.length > 0 && E0.createElement(E0.Fragment, null, E0.createElement(S, {
    marginBottom: 1
  }, E0.createElement($, {
    dimColor: !0
  }, "Marketplaces:")), G.marketplaces.map((F) => E0.createElement(S, {
    key: F.name,
    marginLeft: 2
  }, F.status === "installing" && E0.createElement(E0.Fragment, null, E0.createElement(g4, null), E0.createElement(S, {
    marginLeft: 1
  }, E0.createElement($, null, F.name), E0.createElement($, {
    dimColor: !0
  }, " · Installing…"))), F.status === "pending" && E0.createElement($, null, E0.createElement($, {
    dimColor: !0
  }, H1.circle || "○", " "), F.name, E0.createElement($, {
    dimColor: !0
  }, " · Pending")), F.status === "installed" && E0.createElement($, null, E0.createElement($, {
    color: "success"
  }, H1.tick || "✓", " "), F.name, E0.createElement($, {
    dimColor: !0
  }, " · Installed")), F.status === "failed" && E0.createElement(S, {
    flexDirection: "column"
  }, E0.createElement($, null, E0.createElement($, {
    color: "error"
  }, H1.cross || "✗", " "), F.name, E0.createElement($, {
    color: "error"
  }, " · Failed")), F.error && E0.createElement(S, {
    marginLeft: 3
  }, E0.createElement($, {
    color: "error",
    dimColor: !0
  }, F.error)))))), G.plugins.length > 0 && E0.createElement(E0.Fragment, null, E0.createElement(S, {
    marginTop: 1,
    marginBottom: 1
  }, E0.createElement($, {
    dimColor: !0
  }, "Plugins:")), G.plugins.map((F) => E0.createElement(S, {
    key: F.id,
    marginLeft: 2
  }, F.status === "installing" && E0.createElement(E0.Fragment, null, E0.createElement(g4, null), E0.createElement(S, {
    marginLeft: 1
  }, E0.createElement($, null, F.name), E0.createElement($, {
    dimColor: !0
  }, " · Installing…"))), F.status === "pending" && E0.createElement($, null, E0.createElement($, {
    dimColor: !0
  }, H1.circle || "○", " "), F.name, E0.createElement($, {
    dimColor: !0
  }, " · Pending")), F.status === "installed" && E0.createElement($, null, E0.createElement($, {
    color: "success"
  }, H1.tick || "✓", " "), F.name, E0.createElement($, {
    dimColor: !0
  }, " · Installed")), F.status === "failed" && E0.createElement(S, {
    flexDirection: "column"
  }, E0.createElement($, null, E0.createElement($, {
    color: "error"
  }, H1.cross || "✗", " "), F.name, E0.createElement($, {
    color: "error"
  }, " · Failed")), F.error && E0.createElement(S, {
    marginLeft: 3
  }, E0.createElement($, {
    color: "error",
    dimColor: !0
  }, F.error)))))), G.marketplaces.length === 0 && G.plugins.length === 0 && Z.length === 0 && E0.createElement(S, {
    marginTop: 1
  }, E0.createElement($, {
    dimColor: !0
  }, "No pending installations or errors")), Z.length > 0 && E0.createElement(E0.Fragment, null, E0.createElement(S, {
    marginTop: 1,
    marginBottom: 1
  }, E0.createElement($, {
    dimColor: !0
  }, "Plugin Loading Errors:")), Z.map((F, K) => {
    let D = "plugin" in F ? F.plugin : void 0;
    return E0.createElement(S, {
      key: K,
      marginLeft: 2,
      flexDirection: "column"
    }, E0.createElement($, null, E0.createElement($, {
      color: "error"
    }, H1.cross || "✗", " "), D ? E0.createElement(E0.Fragment, null, "Plugin ", E0.createElement($, {
      bold: !0
    }, D), " from", " ", E0.createElement($, {
      dimColor: !0
    }, F.source)) : E0.createElement($, {
      dimColor: !0
    }, F.source)), E0.createElement(S, {
      marginLeft: 3
    }, E0.createElement($, {
      color: "error",
      dimColor: !0
    }, dx3(F))), IC9(F) && E0.createElement(S, {
      marginLeft: 3,
      marginTop: 1
    }, E0.createElement($, {
      dimColor: !0,
      italic: !0
    }, IC9(F))))
  })), E0.createElement(S, {
    marginTop: 2
  }, E0.createElement($, {
    dimColor: !0
  }, W ? "Installing…" : E0.createElement(E0.Fragment, null, "Press", " ", Y.failed > 0 || J.failed > 0 ? E0.createElement(E0.Fragment, null, E0.createElement($, {
    bold: !0
  }, "r"), " to retry failed installations ·", " ") : null, E0.createElement($, {
    bold: !0
  }, "Esc"), " to return"))))
}
// @from(Start 14372225, End 14372227)
E0
// @from(Start 14372229, End 14372232)
YC9
// @from(Start 14372238, End 14372343)
WC9 = L(() => {
  hA();
  Q4();
  z9();
  iX0();
  DY();
  V9();
  E0 = BA(VA(), 1), YC9 = BA(VA(), 1)
})
// @from(Start 14372400, End 14372645)
function cx3(A) {
  let Q = lO.basename(A),
    B = lO.basename(lO.dirname(A));
  if (Q === "plugin.json") return "plugin";
  if (Q === "marketplace.json") return "marketplace";
  if (B === ".claude-plugin") return "plugin";
  return "unknown"
}
// @from(Start 14372647, End 14372783)
function XC9(A) {
  return A.errors.map((Q) => ({
    path: Q.path.join(".") || "root",
    message: Q.message,
    code: Q.code
  }))
}
// @from(Start 14372785, End 14372941)
function MSA(A, Q, B) {
  if (A.includes("..")) B.push({
    path: Q,
    message: `Path contains ".." which could be a path traversal attempt: ${A}`
  })
}
// @from(Start 14372943, End 14375284)
function ZK0(A) {
  let Q = [],
    B = [],
    G = lO.resolve(A);
  if (!Xz.existsSync(G)) return {
    success: !1,
    errors: [{
      path: "file",
      message: `File not found: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "plugin"
  };
  if (!Xz.statSync(G).isFile()) return {
    success: !1,
    errors: [{
      path: "file",
      message: `Path is not a file: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "plugin"
  };
  let I;
  try {
    I = Xz.readFileSync(G, {
      encoding: "utf-8"
    })
  } catch (W) {
    return {
      success: !1,
      errors: [{
        path: "file",
        message: `Failed to read file: ${W instanceof Error?W.message:String(W)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "plugin"
    }
  }
  let Y;
  try {
    Y = JSON.parse(I)
  } catch (W) {
    return {
      success: !1,
      errors: [{
        path: "json",
        message: `Invalid JSON syntax: ${W instanceof Error?W.message:String(W)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "plugin"
    }
  }
  if (Y && typeof Y === "object") {
    let W = Y;
    if (W.commands)(Array.isArray(W.commands) ? W.commands : [W.commands]).forEach((V, F) => {
      if (typeof V === "string") MSA(V, `commands[${F}]`, Q)
    });
    if (W.agents)(Array.isArray(W.agents) ? W.agents : [W.agents]).forEach((V, F) => {
      if (typeof V === "string") MSA(V, `agents[${F}]`, Q)
    });
    if (W.skills)(Array.isArray(W.skills) ? W.skills : [W.skills]).forEach((V, F) => {
      if (typeof V === "string") MSA(V, `skills[${F}]`, Q)
    })
  }
  let J = nAA.safeParse(Y);
  if (!J.success) Q.push(...XC9(J.error));
  if (J.success) {
    let W = J.data;
    if (!W.version) B.push({
      path: "version",
      message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
    });
    if (!W.description) B.push({
      path: "description",
      message: "No description provided. Adding a description helps users understand what your plugin does"
    });
    if (!W.author) B.push({
      path: "author",
      message: "No author information provided. Consider adding author details for plugin attribution"
    })
  }
  return {
    success: Q.length === 0,
    errors: Q,
    warnings: B,
    filePath: G,
    fileType: "plugin"
  }
}
// @from(Start 14375286, End 14377864)
function IK0(A) {
  let Q = [],
    B = [],
    G = lO.resolve(A);
  if (!Xz.existsSync(G)) return {
    success: !1,
    errors: [{
      path: "file",
      message: `File not found: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "marketplace"
  };
  if (!Xz.statSync(G).isFile()) return {
    success: !1,
    errors: [{
      path: "file",
      message: `Path is not a file: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "marketplace"
  };
  let I;
  try {
    I = Xz.readFileSync(G, {
      encoding: "utf-8"
    })
  } catch (W) {
    return {
      success: !1,
      errors: [{
        path: "file",
        message: `Failed to read file: ${W instanceof Error?W.message:String(W)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "marketplace"
    }
  }
  let Y;
  try {
    Y = JSON.parse(I)
  } catch (W) {
    return {
      success: !1,
      errors: [{
        path: "json",
        message: `Invalid JSON syntax: ${W instanceof Error?W.message:String(W)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "marketplace"
    }
  }
  if (Y && typeof Y === "object") {
    let W = Y;
    if (Array.isArray(W.plugins)) W.plugins.forEach((X, V) => {
      if (X && typeof X === "object" && "source" in X) {
        let F = X.source;
        if (typeof F === "string") MSA(F, `plugins[${V}].source`, Q);
        if (F && typeof F === "object" && "path" in F && typeof F.path === "string") MSA(F.path, `plugins[${V}].source.path`, Q)
      }
    })
  }
  let J = TIA.safeParse(Y);
  if (!J.success) Q.push(...XC9(J.error));
  if (J.success) {
    let W = J.data;
    if (!W.plugins || W.plugins.length === 0) B.push({
      path: "plugins",
      message: "Marketplace has no plugins defined"
    });
    if (W.plugins) W.plugins.forEach((X, V) => {
      if (typeof X.source === "object" && X.source.source === "npm") B.push({
        path: `plugins[${V}].source`,
        message: `Plugin "${X.name}" uses npm source which is not yet fully implemented`
      });
      if (W.plugins.filter((K) => K.name === X.name).length > 1) Q.push({
        path: `plugins[${V}].name`,
        message: `Duplicate plugin name "${X.name}" found in marketplace`
      })
    });
    if (!W.metadata?.description) B.push({
      path: "metadata.description",
      message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
    })
  }
  return {
    success: Q.length === 0,
    errors: Q,
    warnings: B,
    filePath: G,
    fileType: "marketplace"
  }
}
// @from(Start 14377866, End 14379042)
function qJ1(A) {
  let Q = lO.resolve(A);
  if (Xz.existsSync(Q) && Xz.statSync(Q).isDirectory()) {
    let G = lO.join(Q, ".claude-plugin", "marketplace.json"),
      Z = lO.join(Q, ".claude-plugin", "plugin.json");
    if (Xz.existsSync(G)) return IK0(G);
    else if (Xz.existsSync(Z)) return ZK0(Z);
    else return {
      success: !1,
      errors: [{
        path: "directory",
        message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
      }],
      warnings: [],
      filePath: Q,
      fileType: "plugin"
    }
  }
  switch (cx3(A)) {
    case "plugin":
      return ZK0(A);
    case "marketplace":
      return IK0(A);
    case "unknown": {
      if (!Xz.existsSync(Q)) return {
        success: !1,
        errors: [{
          path: "file",
          message: `File not found: ${Q}`
        }],
        warnings: [],
        filePath: Q,
        fileType: "plugin"
      };
      try {
        let G = Xz.readFileSync(Q, {
            encoding: "utf-8"
          }),
          Z = JSON.parse(G);
        if (Array.isArray(Z.plugins)) return IK0(A)
      } catch {}
      return ZK0(A)
    }
  }
}
// @from(Start 14379047, End 14379073)
YK0 = L(() => {
  aAA()
})