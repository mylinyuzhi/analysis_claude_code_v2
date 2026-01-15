
// @from(Ln 449988, Col 0)
function VW9({
  serverName: A,
  request: Q,
  onResponse: B,
  signal: G
}) {
  let {
    message: Z,
    requestedSchema: Y
  } = Q, [J, X] = fj.useState(null), [I, D] = fj.useState(() => {
    let TA = {};
    if (Y.properties) {
      for (let [bA, jA] of Object.entries(Y.properties))
        if (typeof jA === "object" && jA !== null) {
          if (jA.default !== void 0) TA[bA] = jA.default
        }
    }
    return TA
  }), [W, K] = fj.useState(() => {
    let TA = {};
    for (let [bA, jA] of Object.entries(Y.properties))
      if (KW9(jA) && jA?.default !== void 0) {
        let OA = jS0(String(jA.default), jA);
        if (!OA.isValid && OA.error) TA[bA] = OA.error
      } return TA
  });
  fj.useEffect(() => {
    if (!G) return;
    let TA = () => {
      B("cancel")
    };
    if (G.aborted) {
      TA();
      return
    }
    return G.addEventListener("abort", TA), () => {
      G.removeEventListener("abort", TA)
    }
  }, [G, B]);
  let V = fj.useMemo(() => {
      let TA = Y.required ?? [];
      return Object.entries(Y.properties).map(([bA, jA]) => ({
        name: bA,
        schema: jA,
        isRequired: TA.includes(bA)
      }))
    }, [Y]),
    [F, H] = fj.useState(0),
    [E, z] = fj.useState(),
    [$, O] = fj.useState(""),
    [L, M] = fj.useState(0),
    {
      columns: _
    } = ZB(),
    j = F !== void 0 ? V[F] : void 0,
    x = j && KW9(j.schema);
  MQ(), c$1("Claude Code needs your input", "elicitation_dialog");

  function b(TA) {
    let bA = V.length + 2,
      jA = F ?? (J === "accept" ? V.length : J === "decline" ? V.length + 1 : void 0),
      OA = jA !== void 0 ? (jA + (TA === "up" ? bA - 1 : 1)) % bA : 0;
    if (OA < V.length) H(OA), X(null);
    else H(void 0), X(OA === V.length ? "accept" : "decline")
  }

  function S(TA, bA) {
    D((jA) => {
      let OA = {
        ...jA
      };
      if (bA === void 0) delete OA[TA];
      else OA[TA] = bA;
      return OA
    })
  }

  function u(TA, bA) {
    K((jA) => {
      let OA = {
        ...jA
      };
      if (bA) OA[TA] = bA;
      else delete OA[TA];
      return OA
    })
  }

  function f(TA) {
    if (!TA) return;
    S(TA, void 0), u(TA), z(void 0), O(""), M(0)
  }

  function AA(TA) {
    if (!j) return;
    if (TA.trim() === "" && (j.schema.type !== "string" || ("format" in j.schema) && j.schema.format !== void 0)) {
      f(j.name), b("down");
      return
    }
    let jA = jS0(TA, j.schema);
    S(j.name, jA.isValid ? jA.value : TA), u(j.name, jA.isValid ? void 0 : jA.error), z(void 0), O(""), M(0), b("down")
  }

  function n() {
    if (!j) return;
    z(void 0), O(""), M(0)
  }
  J0((TA, bA) => {
    if (j && E === j.name) {
      if (nuA(j?.schema)) return;
      if (x) {
        if (bA.escape && $ === "") {
          n();
          return
        }
      }
    } else {
      if (bA.escape) {
        B("cancel");
        return
      }
      if (bA.return && J === "accept") {
        if (y() && Object.keys(W).length === 0) B("accept", I);
        return
      }
      if (bA.return && J === "decline") {
        B("decline");
        return
      }
      if (bA.upArrow || bA.downArrow) {
        b(bA.upArrow ? "up" : "down");
        return
      }
      if (j) {
        let {
          schema: jA,
          name: OA,
          isRequired: IA
        } = j, HA = I[OA];
        if (bA.backspace && !IA) {
          f(j.name);
          return
        }
        if (bA.return) {
          if (jA.type === "boolean") {
            S(OA, !(HA ?? !1)), b("down");
            return
          }
          if (z(OA), x) {
            let ZA = HA !== void 0 ? String(HA) : "";
            O(ZA), M(ZA.length)
          }
        }
      }
    }
  }, {
    isActive: !0
  });
  let y = () => {
      let TA = Y.required || [];
      for (let bA of TA) {
        let jA = I[bA];
        if (jA === void 0 || jA === null || jA === "") return !1
      }
      return !0
    },
    p = () => {
      if (!V.length) return null;
      return n4.default.createElement(T, {
        flexDirection: "column",
        gap: 1
      }, V.map((TA, bA) => {
        let {
          name: jA,
          schema: OA,
          isRequired: IA
        } = TA, HA = bA === F && !J, ZA = I[jA], zA = (() => {
          if (!HA || E !== void 0) return null;
          let _A = OA.type === "boolean" ? "toggle" : nuA(OA) ? "select" : "edit",
            s = ZA === void 0 || IA ? `(Press Enter to ${_A})` : `(Press Enter to ${_A}, Backspace to unset)`;
          return n4.default.createElement(C, {
            dimColor: !0
          }, " ", s)
        })(), wA = (_A, s) => {
          return n4.default.createElement(T, {
            key: jA,
            flexDirection: "column"
          }, n4.default.createElement(T, {
            gap: 1,
            paddingLeft: HA ? 0 : 2
          }, HA && n4.default.createElement(C, {
            color: "success"
          }, tA.pointer), n4.default.createElement(T, {
            flexGrow: 1,
            flexDirection: "column"
          }, _A, OA.description && n4.default.createElement(T, {
            marginLeft: 2
          }, n4.default.createElement(C, {
            dimColor: !0
          }, OA.description)), s && n4.default.createElement(T, {
            marginLeft: 2
          }, n4.default.createElement(C, {
            color: "error",
            bold: !0
          }, tA.warning, " ", s)))))
        };
        if (nuA(OA)) {
          let _A = o$1(OA),
            s = _S0(OA),
            t = _A.map((BA, DA) => ({
              label: s[DA] ?? BA,
              value: BA
            }));
          if (HA && E === jA) return n4.default.createElement(T, {
            key: jA,
            flexDirection: "column"
          }, n4.default.createElement(C, {
            color: "success"
          }, OA.title || jA, IA && n4.default.createElement(C, {
            color: "error"
          }, "*"), OA.description && n4.default.createElement(C, {
            dimColor: !0
          }, " - ", OA.description)), n4.default.createElement(k0, {
            options: t,
            defaultValue: ZA !== void 0 ? ZA : OA.default ?? _A[0],
            onChange: (BA) => {
              S(jA, BA), z(void 0), b("down")
            },
            onCancel: () => {
              z(void 0)
            }
          }));
          else {
            let BA = ZA !== void 0 ? IW9(OA, ZA) : n4.default.createElement(r$1, null);
            return wA(n4.default.createElement(C, {
              color: HA ? "success" : void 0
            }, OA.title || jA, IA && n4.default.createElement(C, {
              color: "error"
            }, "*"), ": ", BA, zA))
          }
        } else if (OA.type === "boolean") return wA(n4.default.createElement(C, {
          color: HA ? "success" : void 0
        }, OA.title || jA, IA && n4.default.createElement(C, {
          color: "error"
        }, "*"), ":", " ", ZA !== void 0 ? ZA ? `${tA.tick} Yes` : `${tA.cross} No` : n4.default.createElement(r$1, null), zA));
        else if (x) {
          let _A = W[jA],
            s = DW9(OA);
          if (HA && E === jA) return wA(n4.default.createElement(T, {
            flexDirection: "column"
          }, n4.default.createElement(C, {
            color: "success"
          }, OA.title || jA, IA && n4.default.createElement(C, {
            color: "error"
          }, "*"), ":", s && n4.default.createElement(C, {
            dimColor: !0
          }, ` ${s}`)), n4.default.createElement(T, {
            marginLeft: 2
          }, n4.default.createElement(p4, {
            value: $,
            onChange: O,
            onSubmit: AA,
            onExit: n,
            placeholder: `Enter ${OA.type}…`,
            columns: Math.min(_ - 6, 80),
            cursorOffset: L,
            onChangeCursorOffset: M,
            focus: !0,
            showCursor: !0,
            multiline: OA.type === "string"
          }))));
          return wA(n4.default.createElement(C, {
            color: HA ? "success" : void 0
          }, OA.title || jA, IA && n4.default.createElement(C, {
            color: "error"
          }, "*"), ":", " ", ZA === void 0 ? n4.default.createElement(r$1, null) : String(ZA), zA), _A)
        } else return wA(n4.default.createElement(C, {
          color: HA ? "success" : void 0
        }, OA.title || jA, IA && n4.default.createElement(C, {
          color: "error"
        }, "*"), ":", " ", ZA === void 0 ? n4.default.createElement(r$1, null) : String(ZA), zA))
      }))
    },
    GA = (TA) => {
      return Y.properties[TA]?.title ?? TA
    },
    WA = Object.keys(W),
    MA = (Y.required || []).filter((TA) => I[TA] === void 0);
  return n4.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "permission"
  }, n4.default.createElement(C, {
    bold: !0
  }, tA.info, " MCP Server “", A, "” requests your input"), n4.default.createElement(T, {
    padding: 1
  }, n4.default.createElement(C, null, Z)), p(), V.length > 0 && n4.default.createElement(n4.default.Fragment, null, MA.length > 0 && n4.default.createElement(C, {
    color: "error"
  }, tA.warning, " Missing required fields:", " ", MA.map(GA).join(", ")), WA.length > 0 && n4.default.createElement(C, {
    color: "error"
  }, tA.warning, " Validation errors in:", " ", WA.map(GA).join(", ")), n4.default.createElement(C, {
    bold: !0,
    color: J === "accept" ? "success" : void 0,
    inverse: J === "accept"
  }, "Accept"), n4.default.createElement(C, {
    bold: !0,
    color: J === "decline" ? "error" : void 0,
    inverse: J === "decline"
  }, "Decline"), n4.default.createElement(C, {
    dimColor: !0
  }, n4.default.createElement(vQ, null, n4.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), n4.default.createElement(F0, {
    shortcut: "Enter",
    action: "edit"
  }), n4.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel / go back"
  })))))
}
// @from(Ln 450313, Col 4)
n4
// @from(Ln 450313, Col 8)
fj
// @from(Ln 450313, Col 12)
KW9 = (A) => ["string", "number", "integer"].includes(A.type)
// @from(Ln 450314, Col 4)
FW9 = w(() => {
  fA();
  B2();
  E9();
  US0();
  W8();
  K6();
  e9();
  I3();
  WW9();
  IY();
  P4();
  n4 = c(QA(), 1), fj = c(QA(), 1)
})
// @from(Ln 450329, Col 0)
function HW9(A) {
  return `${w$A.major(A,{loose:!0})}.${w$A.minor(A,{loose:!0})}.${w$A.patch(A,{loose:!0})}`
}
// @from(Ln 450333, Col 0)
function s$1(A, Q = {
  ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
  PACKAGE_URL: "@anthropic-ai/claude-code",
  README_URL: "https://code.claude.com/docs/en/overview",
  VERSION: "2.1.7",
  FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
  BUILD_TIME: "2026-01-13T22:55:21Z"
}.VERSION) {
  let [B, G] = EW9.useState(() => HW9(Q));
  if (!A) return null;
  let Z = HW9(A);
  if (Z !== B) return G(Z), Z;
  return null
}
// @from(Ln 450347, Col 4)
EW9
// @from(Ln 450347, Col 9)
w$A
// @from(Ln 450348, Col 4)
TS0 = w(() => {
  EW9 = c(QA(), 1), w$A = c(xP(), 1)
})
// @from(Ln 450352, Col 0)
function $W9({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: Y
}) {
  let [J, X] = t$1.useState({}), I = s$1(G?.version), D = K7.useCallback(async () => {
    if (A) return;
    let W = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION,
      K = r3()?.autoUpdatesChannel ?? "latest",
      V = await Ht(K),
      F = Su();
    if (X({
        global: W,
        latest: V
      }), !F && W && V && !zW9.gte(W, V, {
        loose: !0
      }) && !JEA(V)) {
      let H = Date.now();
      Q(!0);
      let E = L1();
      if (E.installMethod !== "native") await GgA();
      let z = await Et();
      if (k(`AutoUpdater: Detected installation type: ${z}`), z === "development") {
        k("AutoUpdater: Cannot auto-update development build"), Q(!1);
        return
      }
      let $, O;
      if (z === "npm-local") k("AutoUpdater: Using local update method"), O = "local", $ = await ZEA(K);
      else if (z === "npm-global") k("AutoUpdater: Using global update method"), O = "global", $ = await XEA();
      else if (z === "native") {
        k("AutoUpdater: Unexpected native installation in non-native updater"), Q(!1);
        return
      } else {
        k("AutoUpdater: Unknown installation type, falling back to config");
        let L = E.installMethod === "local";
        if (O = L ? "local" : "global", L) $ = await ZEA(K);
        else $ = await XEA()
      }
      if (Q(!1), $ === "success") $QA(), l("tengu_auto_updater_success", {
        fromVersion: W,
        toVersion: V,
        durationMs: Date.now() - H,
        wasMigrated: O === "local",
        installationType: z
      });
      else l("tengu_auto_updater_fail", {
        fromVersion: W,
        attemptedVersion: V,
        status: $,
        durationMs: Date.now() - H,
        wasMigrated: O === "local",
        installationType: z
      });
      B({
        version: V,
        status: $
      })
    }
  }, [B]);
  if (t$1.useEffect(() => {
      D()
    }, [D]), XZ(D, 1800000), !G?.version && (!J.global || !J.latest)) return null;
  if (!G?.version && !A) return null;
  return K7.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, Y && K7.createElement(C, {
    dimColor: !0
  }, "globalVersion: ", J.global, " · latestVersion:", " ", J.latest), A ? K7.createElement(K7.Fragment, null, K7.createElement(T, null, K7.createElement(C, {
    color: "text",
    dimColor: !0,
    wrap: "end"
  }, "Auto-updating…"))) : G?.status === "success" && Z && I && K7.createElement(C, {
    color: "success"
  }, "✓ Update installed · Restart to apply"), (G?.status === "install_failed" || G?.status === "no_permissions") && K7.createElement(C, {
    color: "error"
  }, "✗ Auto-update failed · Try ", K7.createElement(C, {
    bold: !0
  }, "claude doctor"), !kc() && K7.createElement(K7.Fragment, null, " ", "or ", K7.createElement(C, {
    bold: !0
  }, "npm i -g ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.PACKAGE_URL)), kc() && K7.createElement(K7.Fragment, null, " ", "or", " ", K7.createElement(C, {
    bold: !0
  }, "cd ~/.claude/local && npm update ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.PACKAGE_URL))))
}
// @from(Ln 450460, Col 4)
K7
// @from(Ln 450460, Col 8)
zW9
// @from(Ln 450460, Col 13)
t$1
// @from(Ln 450461, Col 4)
CW9 = w(() => {
  fA();
  GQ();
  bc();
  Vt();
  xx();
  oK();
  BI();
  Z0();
  TS0();
  jf();
  T1();
  GB();
  K7 = c(QA(), 1), zW9 = c(xP(), 1), t$1 = c(QA(), 1)
})
// @from(Ln 450477, Col 0)
function _N7(A) {
  if (A.includes("timeout")) return "timeout";
  if (A.includes("Checksum mismatch")) return "checksum_mismatch";
  if (A.includes("ENOENT") || A.includes("not found")) return "not_found";
  if (A.includes("EACCES") || A.includes("permission")) return "permission_denied";
  if (A.includes("ENOSPC")) return "disk_full";
  if (A.includes("npm")) return "npm_error";
  if (A.includes("network") || A.includes("ECONNREFUSED") || A.includes("ENOTFOUND")) return "network_error";
  return "unknown"
}
// @from(Ln 450488, Col 0)
function qW9({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: Y
}) {
  let [J, X] = e$1.useState({}), I = s$1(G?.version), D = wV.useRef(!1), W = r3()?.autoUpdatesChannel ?? "latest", K = wV.useCallback(async () => {
    if (A || Su()) return;
    Q(!0);
    let V = Date.now();
    l("tengu_native_auto_updater_start", {});
    try {
      let F = await sf(W),
        H = {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.1.7",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
          BUILD_TIME: "2026-01-13T22:55:21Z"
        }.VERSION,
        E = Date.now() - V;
      if (F.lockFailed) {
        l("tengu_native_auto_updater_lock_contention", {
          latency_ms: E
        });
        return
      }
      if (X({
          current: H,
          latest: F.latestVersion
        }), F.wasUpdated) $QA(), l("tengu_native_auto_updater_success", {
        latency_ms: E
      }), B({
        version: F.latestVersion,
        status: "success"
      });
      else l("tengu_native_auto_updater_up_to_date", {
        latency_ms: E
      })
    } catch (F) {
      let H = Date.now() - V,
        E = F instanceof Error ? F.message : String(F);
      e(F instanceof Error ? F : Error(String(F))), UW9.captureException(F);
      let z = _N7(E);
      l("tengu_native_auto_updater_fail", {
        latency_ms: H,
        error_timeout: z === "timeout",
        error_checksum: z === "checksum_mismatch",
        error_not_found: z === "not_found",
        error_permission: z === "permission_denied",
        error_disk_full: z === "disk_full",
        error_npm: z === "npm_error",
        error_network: z === "network_error"
      }), B({
        version: null,
        status: "install_failed"
      })
    } finally {
      Q(!1)
    }
  }, [A, Q, B]);
  if (e$1.useEffect(() => {
      if (!D.current) D.current = !0, K()
    }), XZ(K, 1800000), !G?.version && (!J.current || !J.latest)) return null;
  if (!G?.version && !A) return null;
  return wV.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, Y && wV.createElement(C, {
    dimColor: !0
  }, "current: ", J.current, " · ", W, ": ", J.latest), A ? wV.createElement(T, null, wV.createElement(C, {
    dimColor: !0,
    wrap: "end"
  }, "Checking for updates")) : G?.status === "success" && Z && I && wV.createElement(C, {
    color: "success"
  }, "✓ Update installed · Restart to update"), G?.status === "install_failed" && wV.createElement(C, {
    color: "error"
  }, "✗ Auto-update failed · Try ", wV.createElement(C, {
    bold: !0
  }, "/status")))
}
// @from(Ln 450572, Col 4)
wV
// @from(Ln 450572, Col 8)
e$1
// @from(Ln 450572, Col 13)
UW9
// @from(Ln 450573, Col 4)
NW9 = w(() => {
  fA();
  GQ();
  xx();
  oK();
  BI();
  Z0();
  v1();
  TS0();
  GB();
  wV = c(QA(), 1), e$1 = c(QA(), 1), UW9 = c(Sg(), 1)
})
// @from(Ln 450586, Col 0)
function OW9({
  verbose: A
}) {
  let [Q, B] = LW9.useState(!1), G = IEA(), Z = x$.useCallback(async () => {
    if (Su()) return;
    let J = r3()?.autoUpdatesChannel ?? "latest",
      X = await Ht(J),
      I = X && !wW9.gte({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION, X, {
        loose: !0
      }) && !JEA(X);
    if (B(!!I), I) k(`PackageManagerAutoUpdater: Update available ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} -> ${X}`)
  }, []);
  if (x$.useEffect(() => {
      Z()
    }, [Z]), XZ(Z, 1800000), !Q) return null;
  let Y = G === "homebrew" ? "brew upgrade claude-code" : G === "winget" ? "winget upgrade Anthropic.ClaudeCode" : "your package manager update command";
  return x$.createElement(x$.Fragment, null, A && x$.createElement(C, {
    dimColor: !0
  }, "currentVersion: ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION), x$.createElement(C, {
    color: "warning"
  }, "Update available! Run: ", x$.createElement(C, {
    bold: !0
  }, Y)))
}
// @from(Ln 450624, Col 4)
x$
// @from(Ln 450624, Col 8)
wW9
// @from(Ln 450624, Col 13)
LW9
// @from(Ln 450625, Col 4)
MW9 = w(() => {
  fA();
  bc();
  oK();
  T1();
  mK1();
  GQ();
  GB();
  x$ = c(QA(), 1), wW9 = c(xP(), 1), LW9 = c(QA(), 1)
})
// @from(Ln 450635, Col 0)
async function AC1() {
  let A = process.argv.includes("-p") || process.argv.includes("--print");
  if (!await en("auto_migrate_to_native", !1)) return !1;
  if (a1(!1) || !1 || A || a1(process.env.DISABLE_AUTO_MIGRATE_TO_NATIVE)) return !1;
  if (L1().installMethod === "native") return !1;
  return !0
}
// @from(Ln 450642, Col 0)
async function RW9() {
  l("tengu_auto_migrate_to_native_attempt", {});
  try {
    let A = r3()?.autoUpdatesChannel ?? "latest",
      Q = await sf(A, !0),
      B = [];
    if (Q.latestVersion) {
      l("tengu_auto_migrate_to_native_success", {}), k("✅ Upgraded to native installation. Future sessions will use the native version.");
      let {
        removed: Z,
        errors: Y,
        warnings: J
      } = await YgA(), X = [];
      if (Y.length > 0) Y.forEach((W) => {
        X.push({
          message: W,
          userActionRequired: !1,
          type: "error"
        })
      });
      if (J.length > 0) J.forEach((W) => {
        X.push({
          message: W,
          userActionRequired: !1,
          type: "info"
        })
      });
      if (Z > 0) X.push({
        message: `Cleaned up ${Z} old npm installation(s)`,
        userActionRequired: !1,
        type: "info"
      });
      let I = ZgA();
      B = [...await rf(!0), ...I, ...X]
    } else l("tengu_auto_migrate_to_native_partial", {}), k("⚠️ Native installation setup encountered issues but cleanup completed."), B = await rf(!0);
    let G = [];
    if (B.length > 0) {
      let Z = B.filter((Y) => Y.userActionRequired);
      if (Z.length > 0) {
        let Y = ["⚠️  Manual action required after migration to native installer:", ...Z.map((J) => `• ${J.message}`)].join(`
`);
        G.push(Y)
      }
      k("Migration completed with the following notes:"), B.forEach((Y) => {
        k(`  • [${Y.type}] ${Y.message}`)
      })
    }
    return {
      success: !0,
      version: Q.latestVersion,
      notifications: G.length > 0 ? G : void 0
    }
  } catch (A) {
    return l("tengu_auto_migrate_to_native_failure", {
      error: A instanceof Error ? A.message : String(A)
    }), e(A instanceof Error ? A : Error(String(A))), {
      success: !1
    }
  }
}
// @from(Ln 450702, Col 4)
PS0 = w(() => {
  xx();
  w6();
  Z0();
  v1();
  T1();
  fQ();
  GQ();
  GB()
})
// @from(Ln 450713, Col 0)
function _W9({
  onMigrationComplete: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  verbose: G
}) {
  let [Z, Y] = QC1.useState("checking"), J = xp.useRef(!1);
  if (QC1.useEffect(() => {
      async function X() {
        if (J.current) return;
        J.current = !0;
        try {
          if (!await AC1()) {
            Y("idle");
            return
          }
          if (G) k("Starting auto-migration from npm to native installation");
          l("tengu_auto_migrate_to_native_ui_shown", {}), Y("migrating"), Q?.(!0);
          let D = await RW9();
          if (D.success) Y("success"), l("tengu_auto_migrate_to_native_ui_success", {}), B?.({
            status: "success",
            version: D.version,
            notifications: D.notifications
          }), setTimeout(() => {
            Y("idle"), Q?.(!1), A?.()
          }, 5000);
          else Y("error"), l("tengu_auto_migrate_to_native_ui_error", {}), B?.({
            status: "install_failed",
            version: null
          }), setTimeout(() => {
            Y("idle"), Q?.(!1)
          }, 1e4)
        } catch (I) {
          e(I instanceof Error ? I : Error(String(I))), Y("error"), B?.({
            status: "install_failed",
            version: null
          }), setTimeout(() => {
            Y("idle"), Q?.(!1)
          }, 1e4)
        }
      }
      X()
    }, [A, Q, B, G]), Z === "idle" || Z === "checking") return null;
  if (Z === "migrating") return xp.createElement(C, {
    dimColor: !0
  }, "Migrating to native installation…");
  if (Z === "success") return xp.createElement(C, {
    color: "success"
  }, tA.tick, " Migrated to native installation");
  if (Z === "error") return xp.createElement(C, {
    color: "error"
  }, "Migration failed · Run /doctor for details");
  return null
}
// @from(Ln 450767, Col 4)
xp
// @from(Ln 450767, Col 8)
QC1
// @from(Ln 450768, Col 4)
jW9 = w(() => {
  fA();
  B2();
  PS0();
  Z0();
  v1();
  T1();
  xp = c(QA(), 1), QC1 = c(QA(), 1)
})
// @from(Ln 450778, Col 0)
function TW9({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: Y
}) {
  let [J, X] = XM.useState(null), [I, D] = XM.useState(null), [W, K] = XM.useState(null);
  if (XM.useEffect(() => {
      async function F() {
        let H = await Et(),
          E = H === "native",
          z = H === "package-manager";
        if (k(`AutoUpdaterWrapper: Installation type: ${H}`), X(E), D(z), !E && !z) {
          let $ = await AC1();
          K($)
        } else K(!1)
      }
      F()
    }, []), J === null || W === null || I === null) return null;
  if (I) return XM.createElement(OW9, {
    verbose: Y,
    onAutoUpdaterResult: B,
    autoUpdaterResult: G,
    isUpdating: A,
    onChangeIsUpdating: Q,
    showSuccessMessage: Z
  });
  if (!J && W) return XM.createElement(_W9, {
    onMigrationComplete: async () => {
      try {
        let H = await Et() === "native";
        X(H), K(!1)
      } catch (F) {
        k(`Error checking installation type after migration: ${F}`), X(!0), K(!1)
      }
    },
    onChangeIsUpdating: Q,
    onAutoUpdaterResult: B,
    verbose: Y
  });
  return XM.createElement(J ? qW9 : $W9, {
    verbose: Y,
    onAutoUpdaterResult: B,
    autoUpdaterResult: G,
    isUpdating: A,
    onChangeIsUpdating: Q,
    showSuccessMessage: Z
  })
}
// @from(Ln 450829, Col 4)
XM
// @from(Ln 450830, Col 4)
PW9 = w(() => {
  CW9();
  NW9();
  MW9();
  jW9();
  jf();
  T1();
  PS0();
  XM = c(QA(), 1)
})
// @from(Ln 450841, Col 0)
function SW9({
  tokenUsage: A
}) {
  let {
    percentLeft: Q,
    isAboveWarningThreshold: B,
    isAboveErrorThreshold: G
  } = ic(A), Z = Ts2();
  if (!B || Z) return null;
  let Y = nc(),
    J = f4A("warning");
  return T8A.createElement(T, {
    flexDirection: "row"
  }, Y ? T8A.createElement(C, {
    dimColor: !0
  }, J ? `Context left until auto-compact: ${Q}% · ${J}` : `Context left until auto-compact: ${Q}%`) : T8A.createElement(C, {
    color: G ? "error" : "warning"
  }, J ? `Context low (${Q}% remaining) · ${J}` : `Context low (${Q}% remaining) · Run /compact to compact & continue`))
}
// @from(Ln 450860, Col 4)
T8A
// @from(Ln 450861, Col 4)
xW9 = w(() => {
  fA();
  nt();
  N3A();
  tY1();
  T8A = c(QA(), 1)
})
// @from(Ln 450869, Col 0)
function yW9(A) {
  return ic(A).isAboveWarningThreshold
}
// @from(Ln 450872, Col 4)
vW9 = w(() => {
  nt()
})
// @from(Ln 450876, Col 0)
function L$A(A) {
  return kW9.useMemo(() => {
    let Q = A?.find((B) => B.name === "ide");
    if (!Q) return null;
    return Q.type === "connected" ? "connected" : "disconnected"
  }, [A])
}
// @from(Ln 450883, Col 4)
kW9
// @from(Ln 450884, Col 4)
BC1 = w(() => {
  kW9 = c(QA(), 1)
})
// @from(Ln 450891, Col 0)
function bW9({
  ideSelection: A,
  mcpClients: Q
}) {
  let B = L$A(Q),
    G = B === "connected" && (A?.filePath || A?.text && A.lineCount > 0);
  if (B === null || !G || !A) return null;
  if (A.text && A.lineCount > 0) return auA.createElement(C, {
    color: "ide",
    key: "selection-indicator"
  }, "⧉ ", A.lineCount, " ", A.lineCount === 1 ? "line" : "lines", " selected");
  if (A.filePath) return auA.createElement(C, {
    color: "ide",
    key: "selection-indicator"
  }, "⧉ In ", jN7(A.filePath))
}
// @from(Ln 450907, Col 4)
auA
// @from(Ln 450908, Col 4)
fW9 = w(() => {
  fA();
  BC1();
  auA = c(QA(), 1)
})
// @from(Ln 450914, Col 0)
function gW9() {
  let [A, Q] = hW9.useState(null);

  function B() {
    return
  }
  return XZ(B, 1e4), A
}
// @from(Ln 450922, Col 4)
hW9
// @from(Ln 450922, Col 9)
TN7 = 2147483648
// @from(Ln 450923, Col 2)
PN7 = 2684354560
// @from(Ln 450924, Col 4)
uW9 = w(() => {
  oK();
  hW9 = c(QA(), 1)
})
// @from(Ln 450929, Col 0)
function mW9() {
  let A = gW9();
  return null
}
// @from(Ln 450933, Col 4)
ouA
// @from(Ln 450934, Col 4)
dW9 = w(() => {
  fA();
  uW9();
  y9();
  ouA = c(QA(), 1)
})
// @from(Ln 450941, Col 0)
function cW9() {
  let [A, Q] = O$A.useState(0), B = O$A.useRef(null), G = J3("app:toggleTranscript", "Global", "ctrl+o");
  if (O$A.useEffect(() => {
      if (!XB.isSandboxingEnabled()) return;
      let Z = XB.getSandboxViolationStore(),
        Y = Z.getTotalCount(),
        J = Z.subscribe(() => {
          let X = Z.getTotalCount(),
            I = X - Y;
          if (I > 0) {
            if (Q(I), Y = X, B.current) clearTimeout(B.current);
            B.current = setTimeout(() => {
              Q(0)
            }, 5000)
          }
        });
      return () => {
        if (J(), B.current) clearTimeout(B.current)
      }
    }, []), !XB.isSandboxingEnabled() || A === 0) return null;
  return ruA.createElement(T, {
    paddingX: 0,
    paddingY: 0
  }, ruA.createElement(C, {
    color: "inactive"
  }, "⧈ Sandbox blocked ", A, " ", A === 1 ? "operation" : "operations", " ·", " ", G, " for details · /sandbox to disable"))
}
// @from(Ln 450968, Col 4)
ruA
// @from(Ln 450968, Col 9)
O$A
// @from(Ln 450969, Col 4)
pW9 = w(() => {
  fA();
  NJ();
  NX();
  ruA = c(QA(), 1), O$A = c(QA(), 1)
})
// @from(Ln 450976, Col 0)
function lW9({
  apiKeyStatus: A,
  autoUpdaterResult: Q,
  debug: B,
  isAutoUpdating: G,
  verbose: Z,
  messages: Y,
  onAutoUpdaterResult: J,
  onChangeIsUpdating: X,
  ideSelection: I,
  mcpClients: D,
  isInputWrapped: W = !1
}) {
  let K = GC1.useMemo(() => {
      let S = _x(Y);
      return sH(S)
    }, [Y]),
    V = yW9(K),
    F = L$A(D),
    [{
      notifications: H
    }] = a0(),
    {
      addNotification: E,
      removeNotification: z
    } = S4(),
    $ = no(),
    L = !(F === "connected" && (I?.filePath || I?.text && I.lineCount > 0)) || G || Q?.status !== "success",
    M = $.isUsingOverage,
    _ = N6(),
    j = _ === "team" || _ === "enterprise",
    x = Wp(),
    b = W && !V && A !== "invalid" && A !== "missing" && x !== void 0;
  return GC1.useEffect(() => {
    if (b && x) l("tengu_external_editor_hint_shown", {}), E({
      key: "external-editor-hint",
      jsx: j3.createElement(C, {
        dimColor: !0
      }, j3.createElement(hQ, {
        action: "chat:externalEditor",
        context: "Chat",
        fallback: "ctrl+g",
        description: `edit in ${EK(x)}`
      })),
      priority: "immediate",
      timeoutMs: 5000
    });
    else z("external-editor-hint")
  }, [b, x, E, z]), j3.createElement(y4A, null, j3.createElement(T, {
    flexDirection: "column",
    alignItems: "flex-end"
  }, j3.createElement(bW9, {
    ideSelection: I,
    mcpClients: D
  }), H.current && ("jsx" in H.current ? j3.createElement(T, {
    key: H.current.key
  }, H.current.jsx) : j3.createElement(C, {
    color: H.current.color,
    dimColor: !H.current.color
  }, H.current.text)), M && !j && j3.createElement(T, null, j3.createElement(C, {
    dimColor: !0
  }, "Now using extra usage")), A === "invalid" && j3.createElement(T, null, j3.createElement(C, {
    color: "error"
  }, "Invalid API key · Run /login")), A === "missing" && j3.createElement(T, null, j3.createElement(C, {
    color: "error"
  }, "Missing API key · Run /login")), B && j3.createElement(T, null, j3.createElement(C, {
    color: "warning"
  }, "Debug mode")), A !== "invalid" && A !== "missing" && Z && j3.createElement(T, null, j3.createElement(C, {
    dimColor: !0
  }, K, " tokens")), j3.createElement(SW9, {
    tokenUsage: K
  }), L && j3.createElement(TW9, {
    verbose: Z,
    onAutoUpdaterResult: J,
    autoUpdaterResult: Q,
    isUpdating: G,
    onChangeIsUpdating: X,
    showSuccessMessage: !V
  }), j3.createElement(mW9, null), j3.createElement(cW9, null)))
}
// @from(Ln 451056, Col 4)
j3
// @from(Ln 451056, Col 8)
GC1
// @from(Ln 451056, Col 13)
ZC1 = 5000
// @from(Ln 451057, Col 4)
YC1 = w(() => {
  fA();
  PW9();
  aY1();
  xW9();
  vW9();
  fW9();
  BC1();
  hB();
  HY();
  dW9();
  Z0();
  Kp();
  TX();
  uC();
  tQ();
  pW9();
  I3();
  IS();
  Q2();
  j3 = c(QA(), 1), GC1 = c(QA(), 1)
})
// @from(Ln 451079, Col 0)
async function SN7(A) {
  let Q = Math.ceil(A / iW9) * iW9;
  if (P8A && JC1 >= Q) return P8A;
  if (P8A) await P8A;
  JC1 = Q, P8A = (async () => {
    let B = [],
      G = 0;
    for await (let Z of $RB()) if (B.push(Z), G++, G >= JC1) break;
    return B
  })();
  try {
    return await P8A
  } finally {
    P8A = null, JC1 = 0
  }
}
// @from(Ln 451096, Col 0)
function nW9(A, Q, B, G) {
  let [Z, Y] = QH.useState(0), [J, X] = QH.useState(void 0), I = QH.useRef(!1), {
    addNotification: D,
    removeNotification: W
  } = S4(), K = QH.useRef([]), V = QH.useRef(0), F = QH.useCallback((M, _, j, x = !1) => {
    A(M, _, j), G?.(x ? 0 : M.length)
  }, [A, G]), H = QH.useCallback((M, _ = !1) => {
    if (!M || !M.display) return;
    let j = Fm(M.display),
      x = j === "bash" || j === "background" ? M.display.slice(1) : M.display;
    F(x, j, M.pastedContents ?? {}, _)
  }, [F]), E = QH.useCallback(() => {
    D({
      key: "search-history-hint",
      jsx: QH.default.createElement(C, {
        dimColor: !0
      }, QH.default.createElement(hQ, {
        action: "history:search",
        context: "Global",
        fallback: "ctrl+r",
        description: "search history"
      })),
      priority: "immediate",
      timeoutMs: ZC1
    })
  }, [D]), z = QH.useCallback(() => {
    let M = V.current;
    V.current++, (async () => {
      let _ = M + 1;
      if (K.current.length < _) {
        let x = await SN7(_);
        if (x.length > K.current.length) K.current = x
      }
      if (M >= K.current.length) {
        V.current--;
        return
      }
      if (M === 0) {
        let x = Q.trim() !== "";
        X(x ? {
          display: Q,
          pastedContents: B
        } : void 0)
      }
      let j = M + 1;
      if (Y(j), H(K.current[M], !0), j >= 2 && !I.current) I.current = !0, E()
    })()
  }, [Q, B, H, E]), $ = QH.useCallback(() => {
    let M = V.current;
    if (M > 1) V.current--, Y(M - 1), H(K.current[M - 2]);
    else if (M === 1)
      if (V.current = 0, Y(0), J) H(J);
      else F("", "prompt", {});
    return M <= 0
  }, [J, H, F]), O = QH.useCallback(() => {
    X(void 0), Y(0), V.current = 0, W("search-history-hint"), K.current = []
  }, [W]), L = QH.useCallback(() => {
    W("search-history-hint")
  }, [W]);
  return {
    historyIndex: Z,
    setHistoryIndex: Y,
    onHistoryUp: z,
    onHistoryDown: $,
    resetHistory: O,
    dismissSearchHint: L
  }
}
// @from(Ln 451164, Col 4)
QH
// @from(Ln 451164, Col 8)
iW9 = 10
// @from(Ln 451165, Col 2)
P8A = null
// @from(Ln 451166, Col 2)
JC1 = 0
// @from(Ln 451167, Col 4)
aW9 = w(() => {
  fA();
  Vm();
  YC1();
  HY();
  I3();
  QH = c(QA(), 1)
})
// @from(Ln 451176, Col 0)
function rW9(A) {
  return typeof A === "object" && A !== null && "userFacingName" in A && typeof A.userFacingName === "function" && "type" in A
}
// @from(Ln 451180, Col 0)
function xS0(A, Q) {
  if (A.startsWith("/")) return null;
  let G = A.slice(0, Q).match(/(?<=\s)\/([a-zA-Z0-9_:-]*)$/);
  if (!G || G.index === void 0) return null;
  let Z = G.index,
    J = A.slice(Z + 1).match(/^[a-zA-Z0-9_:-]*/),
    X = J ? J[0] : "";
  if (Q > Z + 1 + X.length) return null;
  return {
    token: "/" + X,
    startPos: Z,
    partialCommand: X
  }
}
// @from(Ln 451195, Col 0)
function sW9(A, Q) {
  if (!A) return null;
  let B = yS0("/" + A, Q);
  if (B.length === 0) return null;
  let G = A.toLowerCase();
  for (let Z of B) {
    if (!rW9(Z.metadata)) continue;
    let Y = Z.metadata.userFacingName();
    if (Y.toLowerCase().startsWith(G)) {
      let J = Y.slice(A.length);
      if (J) return {
        suffix: J,
        fullCommand: Y
      }
    }
  }
  return null
}
// @from(Ln 451214, Col 0)
function yp(A) {
  return A.startsWith("/")
}
// @from(Ln 451218, Col 0)
function yN7(A) {
  if (!yp(A)) return !1;
  if (!A.includes(" ")) return !1;
  if (A.endsWith(" ")) return !1;
  return !0
}
// @from(Ln 451225, Col 0)
function vN7(A) {
  return `/${A} `
}
// @from(Ln 451229, Col 0)
function SS0(A) {
  let Q = A.userFacingName();
  if (A.type === "prompt") {
    if (A.source === "plugin" && A.pluginInfo?.repository) return `${Q}:${A.source}:${A.pluginInfo.repository}`;
    return `${Q}:${A.source}`
  }
  return `${Q}:${A.type}`
}
// @from(Ln 451238, Col 0)
function kN7(A, Q) {
  if (!Q || Q.length === 0 || A === "") return;
  return Q.find((B) => B.toLowerCase().startsWith(A))
}
// @from(Ln 451243, Col 0)
function oW9(A, Q) {
  let B = A.userFacingName(),
    G = Q ? ` (${Q})` : "",
    Z = gzA(A) + (A.type === "prompt" && A.argNames?.length ? ` (arguments: ${A.argNames.join(", ")})` : "");
  return {
    id: SS0(A),
    displayText: `/${B}${G}`,
    description: Z,
    metadata: A
  }
}
// @from(Ln 451255, Col 0)
function yS0(A, Q) {
  if (!yp(A)) return [];
  if (yN7(A)) return [];
  let B = A.slice(1).toLowerCase().trim();
  if (B === "") {
    let X = Q.filter((z) => !z.isHidden),
      I = [],
      D = X.filter((z) => z.type === "prompt").map((z) => ({
        cmd: z,
        score: RD1(z.userFacingName())
      })).filter((z) => z.score > 0).sort((z, $) => $.score - z.score);
    for (let z of D.slice(0, 5)) I.push(z.cmd);
    let W = new Set(I.map((z) => SS0(z))),
      K = [],
      V = [],
      F = [],
      H = [];
    X.forEach((z) => {
      if (W.has(SS0(z))) return;
      if (z.type === "prompt" && (z.source === "userSettings" || z.source === "localSettings")) K.push(z);
      else if (z.type === "prompt" && z.source === "projectSettings") V.push(z);
      else if (z.type === "prompt" && z.source === "policySettings") F.push(z);
      else H.push(z)
    });
    let E = (z, $) => z.userFacingName().localeCompare($.userFacingName());
    return K.sort(E), V.sort(E), F.sort(E), H.sort(E), [...I, ...K, ...V, ...F, ...H].map((z) => oW9(z))
  }
  let G = Q.filter((X) => !X.isHidden).map((X) => {
    let I = X.userFacingName(),
      D = I.split(xN7).filter(Boolean);
    return {
      nameKey: I,
      descriptionKey: X.description.split(" ").map((W) => bN7(W)).filter(Boolean),
      partKey: D.length > 1 ? D : void 0,
      commandName: I,
      command: X,
      aliasKey: X.aliases
    }
  });
  return [...new Vw(G, {
    includeScore: !0,
    threshold: 0.3,
    location: 0,
    distance: 100,
    keys: [{
      name: "commandName",
      weight: 3
    }, {
      name: "partKey",
      weight: 2
    }, {
      name: "aliasKey",
      weight: 2
    }, {
      name: "descriptionKey",
      weight: 0.5
    }]
  }).search(B)].sort((X, I) => {
    let D = X.item.commandName.toLowerCase(),
      W = I.item.commandName.toLowerCase(),
      K = X.item.aliasKey?.map((M) => M.toLowerCase()) ?? [],
      V = I.item.aliasKey?.map((M) => M.toLowerCase()) ?? [],
      F = D === B || K.some((M) => M === B),
      H = W === B || V.some((M) => M === B);
    if (F && !H) return -1;
    if (H && !F) return 1;
    let E = D.startsWith(B) || K.some((M) => M.startsWith(B)),
      z = W.startsWith(B) || V.some((M) => M.startsWith(B));
    if (E && !z) return -1;
    if (z && !E) return 1;
    let $ = (X.score ?? 0) - (I.score ?? 0);
    if (Math.abs($) > 0.1) return $;
    let O = X.item.command.type === "prompt" ? RD1(X.item.command.userFacingName()) : 0;
    return (I.item.command.type === "prompt" ? RD1(I.item.command.userFacingName()) : 0) - O
  }).map((X) => {
    let I = X.item.command,
      D = kN7(B, I.aliases);
    return oW9(I, D)
  })
}
// @from(Ln 451336, Col 0)
function vS0(A, Q, B, G, Z, Y) {
  let J, X;
  if (typeof A === "string") J = A, X = Q ? eS(J, B) : void 0;
  else {
    if (!rW9(A.metadata)) return;
    J = A.metadata.userFacingName(), X = A.metadata
  }
  let I = vN7(J);
  if (G(I), Z(I.length), Q && X) {
    if (X.type !== "prompt" || (X.argNames ?? []).length === 0) Y(I, !0)
  }
}
// @from(Ln 451349, Col 0)
function bN7(A) {
  return A.toLowerCase().replace(/[^a-z0-9]/g, "")
}
// @from(Ln 451353, Col 0)
function tW9(A) {
  let Q = [],
    B = /(^|[\s])(\/[a-zA-Z][a-zA-Z0-9:\-_]*)/g,
    G = null;
  while ((G = B.exec(A)) !== null) {
    let Z = G[1] ?? "",
      Y = G[2] ?? "",
      J = G.index + Z.length;
    Q.push({
      start: J,
      end: J + Y.length
    })
  }
  return Q
}
// @from(Ln 451368, Col 4)
xN7
// @from(Ln 451369, Col 4)
kS0 = w(() => {
  rhA();
  WV();
  _D1();
  xN7 = /[:_-]/g
})
// @from(Ln 451376, Col 0)
function AK9(A) {
  return typeof A === "object" && A !== null && "op" in A && hN7.includes(A.op)
}
// @from(Ln 451380, Col 0)
function eW9(A) {
  if (A.startsWith("$")) return "variable";
  if (A.includes("/") || A.startsWith("~") || A.startsWith(".")) return "file";
  return "command"
}
// @from(Ln 451386, Col 0)
function gN7(A) {
  for (let Q = A.length - 1; Q >= 0; Q--)
    if (typeof A[Q] === "string") return {
      token: A[Q],
      index: Q
    };
  return null
}
// @from(Ln 451395, Col 0)
function uN7(A, Q) {
  if (Q === 0) return !0;
  let B = A[Q - 1];
  return B !== void 0 && AK9(B)
}
// @from(Ln 451401, Col 0)
function mN7(A, Q) {
  let B = A.slice(0, Q),
    G = B.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (G) return {
    prefix: G[0],
    completionType: "variable"
  };
  let Z = bY(B);
  if (!Z.success) {
    let I = B.split(/\s+/),
      D = I[I.length - 1] || "",
      K = I.length === 1 && !B.includes(" ") ? "command" : eW9(D);
    return {
      prefix: D,
      completionType: K
    }
  }
  let Y = gN7(Z.tokens);
  if (!Y) {
    let I = Z.tokens[Z.tokens.length - 1];
    return {
      prefix: "",
      completionType: I && AK9(I) ? "command" : "command"
    }
  }
  if (B.endsWith(" ")) return {
    prefix: "",
    completionType: "file"
  };
  let J = eW9(Y.token);
  if (J === "variable" || J === "file") return {
    prefix: Y.token,
    completionType: J
  };
  let X = uN7(Z.tokens, Y.index) ? "command" : "file";
  return {
    prefix: Y.token,
    completionType: X
  }
}
// @from(Ln 451442, Col 0)
function dN7(A, Q) {
  if (Q === "variable") {
    let B = A.slice(1);
    return `compgen -v ${m6([B])} 2>/dev/null`
  } else if (Q === "file") return `compgen -f ${m6([A])} 2>/dev/null | head -${bS0} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
  else return `compgen -c ${m6([A])} 2>/dev/null`
}
// @from(Ln 451450, Col 0)
function cN7(A, Q) {
  if (Q === "variable") {
    let B = A.slice(1);
    return `print -rl -- \${(k)parameters[(I)${m6([B])}*]} 2>/dev/null`
  } else if (Q === "file") return `for f in ${m6([A])}*(N[1,${bS0}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
  else return `print -rl -- \${(k)commands[(I)${m6([A])}*]} 2>/dev/null`
}
// @from(Ln 451457, Col 0)
async function pN7(A, Q, B, G) {
  let Z;
  if (A === "bash") Z = dN7(Q, B);
  else if (A === "zsh") Z = cN7(Q, B);
  else return [];
  return (await (await e51(Z, G, fN7)).result).stdout.split(`
`).filter((X) => X.trim()).slice(0, bS0).map((X) => ({
    id: X,
    displayText: X,
    description: void 0,
    metadata: {
      completionType: B
    }
  }))
}
// @from(Ln 451472, Col 0)
async function QK9(A, Q, B) {
  let G = YEA();
  if (G !== "bash" && G !== "zsh") return [];
  try {
    let {
      prefix: Z,
      completionType: Y
    } = mN7(A, Q);
    if (!Z) return [];
    return (await pN7(G, Z, Y, B)).map((X) => ({
      ...X,
      metadata: {
        ...X.metadata,
        inputSnapshot: A
      }
    }))
  } catch (Z) {
    return k(`Shell completion failed: ${Z}`), []
  }
}
// @from(Ln 451492, Col 4)
bS0 = 15
// @from(Ln 451493, Col 2)
fN7 = 1000
// @from(Ln 451494, Col 2)
hN7
// @from(Ln 451495, Col 4)
BK9 = w(() => {
  Vt();
  Vb();
  T1();
  pV();
  hN7 = ["|", "||", "&&", ";"]
})
// @from(Ln 451504, Col 0)
function GK9(A) {
  switch (A.type) {
    case "file":
      return {
        id: `file-${A.path}`, displayText: A.displayText, description: A.description
      };
    case "mcp_resource":
      return {
        id: `mcp-resource-${A.server}__${A.uri}`, displayText: A.displayText, description: A.description
      };
    case "agent":
      return {
        id: `agent-${A.agentType}`, displayText: A.displayText, description: A.description, color: A.color
      }
  }
}
// @from(Ln 451521, Col 0)
function JK9(A) {
  if (A.length <= ZK9) return A;
  return A.substring(0, ZK9 - 1) + "…"
}
// @from(Ln 451526, Col 0)
function lN7(A, Q, B = !1) {
  if (!Q && !B) return [];
  try {
    let G = A.map((Y) => ({
      type: "agent",
      displayText: `${Y.agentType} (agent)`,
      description: JK9(Y.whenToUse),
      agentType: Y.agentType,
      color: yVA(Y.agentType)
    }));
    if (!Q) return G;
    let Z = Q.toLowerCase();
    return G.filter((Y) => Y.agentType.toLowerCase().includes(Z) || Y.displayText.toLowerCase().includes(Z))
  } catch (G) {
    return e(G), []
  }
}
// @from(Ln 451543, Col 0)
async function hS0(A, Q, B, G = !1) {
  if (!A && !G) return [];
  let [Z, Y] = await Promise.all([IQ9(A, G), Promise.resolve(lN7(B, A, G))]), J = Z.map((W) => ({
    type: "file",
    displayText: W.displayText,
    description: W.description,
    path: W.displayText,
    filename: YK9.basename(W.displayText),
    score: W.metadata?.score
  })), X = Object.values(Q).flat().map((W) => ({
    type: "mcp_resource",
    displayText: `${W.server}:${W.uri}`,
    description: JK9(W.description || W.name || W.uri),
    server: W.server,
    uri: W.uri,
    name: W.name || W.uri
  }));
  if (!A) return [...J, ...X, ...Y].slice(0, fS0).map(GK9);
  let I = [...X, ...Y],
    D = [];
  for (let W of J) D.push({
    source: W,
    score: W.score ?? 0.5
  });
  if (I.length > 0) {
    let K = new Vw(I, {
      includeScore: !0,
      threshold: 0.6,
      keys: [{
        name: "displayText",
        weight: 2
      }, {
        name: "name",
        weight: 3
      }, {
        name: "server",
        weight: 1
      }, {
        name: "description",
        weight: 1
      }, {
        name: "agentType",
        weight: 3
      }]
    }).search(A, {
      limit: fS0
    });
    for (let V of K) D.push({
      source: V.item,
      score: V.score ?? 0.5
    })
  }
  return D.sort((W, K) => W.score - K.score), D.slice(0, fS0).map((W) => W.source).map(GK9)
}
// @from(Ln 451597, Col 4)
fS0 = 15
// @from(Ln 451598, Col 2)
ZK9 = 60
// @from(Ln 451599, Col 4)
XK9 = w(() => {
  rhA();
  EO();
  v1();
  JE1()
})
// @from(Ln 451606, Col 0)
function S8A(A) {
  return typeof A === "object" && A !== null && "type" in A && (A.type === "directory" || A.type === "file")
}
// @from(Ln 451610, Col 0)
function iN7(A) {
  return typeof A === "object" && A !== null && "isBashStyleCompletion" in A && A.isBashStyleCompletion === !0 && "inputSnapshot" in A && typeof A.inputSnapshot === "string"
}
// @from(Ln 451614, Col 0)
function IK9(A, Q) {
  if (!iN7(A)) return !1;
  return A.inputSnapshot !== Q
}
// @from(Ln 451619, Col 0)
function XC1() {
  return !1
}
// @from(Ln 451623, Col 0)
function M$A(A, Q, B) {
  if (Q < 0 || B.length === 0) return B.length > 0 ? 0 : -1;
  if (A.length === B.length && A.every((Z, Y) => Z.id === B[Y]?.id)) return Math.min(Q, B.length - 1);
  return 0
}
// @from(Ln 451629, Col 0)
function DK9(A) {
  let Q = A.metadata;
  return Q?.sessionId ? `/resume ${Q.sessionId}` : `/resume ${A.displayText}`
}
// @from(Ln 451634, Col 0)
function WK9(A) {
  if (A.isQuoted) return A.token.slice(2).replace(/"$/, "");
  else if (A.token.startsWith("@")) return A.token.substring(1);
  else return A.token
}
// @from(Ln 451640, Col 0)
function gS0(A) {
  let {
    displayText: Q,
    mode: B,
    hasAtPrefix: G,
    needsQuotes: Z,
    isQuoted: Y,
    isComplete: J
  } = A, X = J ? " " : "";
  if (Y || Z) return B === "bash" ? `"${Q}"${X}` : `@"${Q}"${X}`;
  else if (G) return B === "bash" ? `${Q}${X}` : `@${Q}${X}`;
  else return Q
}
// @from(Ln 451654, Col 0)
function uS0(A, Q, B, G, Z, Y) {
  let I = Q.slice(0, B).lastIndexOf(" ") + 1,
    D;
  if (Y === "variable") D = "$" + A.displayText + " ";
  else if (Y === "command") D = A.displayText + " ";
  else D = A.displayText;
  let W = Q.slice(0, I) + D + Q.slice(B);
  G(W), Z(I + D.length)
}
// @from(Ln 451663, Col 0)
async function nN7(A, Q) {
  try {
    if (IC1) IC1.abort();
    return IC1 = new AbortController, await QK9(A, Q, IC1.signal)
  } catch {
    return l("tengu_shell_completion_failed", {}), []
  }
}
// @from(Ln 451672, Col 0)
function KK9(A, Q, B, G, Z) {
  let Y = Z ? "/" : " ",
    J = A.slice(0, B),
    X = A.slice(B + G),
    I = "@" + Q + Y;
  return {
    newInput: J + I + X,
    cursorPos: J.length + I.length
  }
}
// @from(Ln 451683, Col 0)
function vp(A, Q, B = !1) {
  if (!A) return null;
  let G = A.substring(0, Q);
  if (B) {
    let D = /@"([^"]*)"?$/,
      W = G.match(D);
    if (W && W.index !== void 0) {
      let V = A.substring(Q).match(/^[^"]*"?/),
        F = V ? V[0] : "";
      return {
        token: W[0] + F,
        startPos: W.index,
        isQuoted: !0
      }
    }
  }
  let Z = B ? /(@[a-zA-Z0-9_\-./\\()[\]~]*|[a-zA-Z0-9_\-./\\()[\]~]+)$/ : /[a-zA-Z0-9_\-./\\()[\]~]+$/,
    Y = G.match(Z);
  if (!Y || Y.index === void 0) return null;
  let X = A.substring(Q).match(/^[a-zA-Z0-9_\-./\\()[\]~]+/),
    I = X ? X[0] : "";
  return {
    token: Y[0] + I,
    startPos: Y.index,
    isQuoted: !1
  }
}
// @from(Ln 451711, Col 0)
function aN7(A) {
  if (yp(A)) {
    let Q = A.indexOf(" ");
    if (Q === -1) return {
      commandName: A.slice(1),
      args: ""
    };
    return {
      commandName: A.slice(1, Q),
      args: A.slice(Q + 1)
    }
  }
  return null
}
// @from(Ln 451726, Col 0)
function VK9(A, Q) {
  return !A && Q.includes(" ") && !Q.endsWith(" ")
}
// @from(Ln 451730, Col 0)
function FK9({
  commands: A,
  onInputChange: Q,
  onSubmit: B,
  setCursorOffset: G,
  input: Z,
  cursorOffset: Y,
  mode: J,
  agents: X,
  setSuggestionsState: I,
  suggestionsState: {
    suggestions: D,
    selectedSuggestion: W,
    commandArgumentHint: K
  },
  suppressSuggestions: V = !1,
  markAccepted: F
}) {
  let {
    addNotification: H
  } = S4(), E = J3("chat:thinkingToggle", "Chat", "alt+t"), [z, $] = NI.useState("none"), O = NI.useMemo(() => {
    let OA = A.filter((HA) => !HA.isHidden);
    if (OA.length === 0) return;
    return Math.max(...OA.map((HA) => HA.userFacingName().length)) + 6
  }, [A]), [L, M] = NI.useState(void 0), [_] = a0(), [j, x] = NI.useState(void 0), b = NI.useRef(Y);
  b.current = Y;
  let S = NI.useRef(""),
    u = NI.useRef(""),
    f = NI.useCallback(() => {
      I(() => ({
        commandArgumentHint: void 0,
        suggestions: [],
        selectedSuggestion: -1
      })), $("none"), M(void 0), x(void 0)
    }, [I]),
    AA = NI.useCallback(async (OA, IA = !1) => {
      S.current = OA;
      let HA = await hS0(OA, _.mcp.resources, X, IA);
      if (S.current !== OA) return;
      if (HA.length === 0) {
        I(() => ({
          commandArgumentHint: void 0,
          suggestions: [],
          selectedSuggestion: -1
        })), $("none"), M(void 0);
        return
      }
      I((ZA) => ({
        commandArgumentHint: void 0,
        suggestions: HA,
        selectedSuggestion: M$A(ZA.suggestions, ZA.selectedSuggestion, HA)
      })), $(HA.length > 0 ? "file" : "none"), M(void 0)
    }, [_.mcp.resources, I, $, M, X]),
    n = ua(AA, 200),
    y = NI.useCallback(async (OA, IA) => {
      let HA = IA ?? b.current;
      if (V) {
        n.cancel(), f();
        return
      }
      if (J === "prompt") {
        let wA = xS0(OA, HA);
        if (wA) {
          let _A = sW9(wA.partialCommand, A);
          if (_A) {
            x({
              text: _A.suffix,
              fullCommand: _A.fullCommand,
              insertPosition: wA.startPos + 1 + wA.partialCommand.length
            }), I(() => ({
              commandArgumentHint: void 0,
              suggestions: [],
              selectedSuggestion: -1
            })), $("none"), M(void 0);
            return
          } else x(void 0)
        } else x(void 0)
      }
      let ZA = OA.substring(0, HA).match(/(^|\s)@([a-zA-Z0-9_\-./\\()[\]~]*|"[^"]*"?)$/),
        zA = HA === OA.length && HA > 0 && OA.length > 0 && OA[HA - 1] === " ";
      if (J === "prompt" && yp(OA) && HA > 0) {
        let wA = aN7(OA);
        if (wA && wA.commandName === "add-dir" && wA.args) {
          let {
            args: _A
          } = wA;
          if (_A.match(/\s+$/)) {
            n.cancel(), f();
            return
          }
          let s = await nH1(_A);
          if (s.length > 0) {
            I((t) => ({
              suggestions: s,
              selectedSuggestion: M$A(t.suggestions, t.selectedSuggestion, s),
              commandArgumentHint: void 0
            })), $("directory");
            return
          }
          n.cancel(), f();
          return
        }
        if (wA && wA.commandName === "resume" && wA.args !== void 0 && OA.includes(" ")) {
          let {
            args: _A
          } = wA, t = (await Q$A(_A, {
            limit: 10
          })).map((BA) => {
            let DA = xX(BA);
            return {
              id: `resume-title-${DA}`,
              displayText: BA.customTitle,
              description: qOA(BA),
              metadata: {
                sessionId: DA
              }
            }
          });
          if (t.length > 0) {
            I((BA) => ({
              suggestions: t,
              selectedSuggestion: M$A(BA.suggestions, BA.selectedSuggestion, t),
              commandArgumentHint: void 0
            })), $("custom-title");
            return
          }
          f();
          return
        }
      }
      if (J === "prompt" && yp(OA) && HA > 0 && !VK9(zA, OA)) {
        let wA = void 0;
        if (OA.length > 1) {
          let s = OA.indexOf(" "),
            t = s === -1 ? OA.slice(1) : OA.slice(1, s),
            BA = s !== -1 && OA.slice(s + 1).trim().length > 0,
            DA = s !== -1 && OA.length === s + 1;
          if (s !== -1) {
            let CA = A.find((FA) => FA.userFacingName() === t);
            if (CA || BA) {
              if (CA?.argumentHint && DA) wA = CA.argumentHint;
              I(() => ({
                commandArgumentHint: wA,
                suggestions: [],
                selectedSuggestion: -1
              })), $("none"), M(void 0);
              return
            }
          }
        }
        let _A = yS0(OA, A);
        if (I((s) => ({
            commandArgumentHint: wA,
            suggestions: _A,
            selectedSuggestion: M$A(s.suggestions, s.selectedSuggestion, _A)
          })), $(_A.length > 0 ? "command" : "none"), _A.length > 0) M(O);
        return
      }
      if (z === "command") n.cancel(), f();
      else if (yp(OA) && VK9(zA, OA)) I((wA) => wA.commandArgumentHint ? {
        ...wA,
        commandArgumentHint: void 0
      } : wA);
      if (z === "custom-title") f();
      if (z === "directory" && XC1()) {
        if (IK9(D[0]?.metadata, OA)) n.cancel(), f()
      }
      if (ZA) {
        let wA = vp(OA, HA, !0);
        if (wA && wA.token.startsWith("@")) {
          let _A = WK9(wA);
          if (V09(_A)) {
            u.current = _A;
            let s = await bM0(_A, {
              maxResults: 10
            });
            if (u.current !== _A) return;
            if (s.length > 0) {
              I((t) => ({
                suggestions: s,
                selectedSuggestion: M$A(t.suggestions, t.selectedSuggestion, s),
                commandArgumentHint: void 0
              })), $("directory");
              return
            }
          }
          if (S.current === _A) return;
          n(_A, !0);
          return
        }
      }
      if (z === "file") {
        let wA = vp(OA, HA, !0);
        if (wA) {
          let _A = WK9(wA);
          if (S.current === _A) return;
          n(_A, !1)
        } else n.cancel(), f()
      }
      if (z === "shell") {
        let wA = D[0]?.metadata?.inputSnapshot;
        if (J !== "bash" || OA !== wA) n.cancel(), f()
      }
    }, [z, A, I, f, n, J, V, D, O]);
  NI.useEffect(() => {
    y(Z)
  }, [Z, y]);
  let p = NI.useCallback(async () => {
      if (j) {
        let OA = xS0(Z, Y);
        if (OA) {
          T9("tab-completion");
          let IA = Z.slice(0, OA.startPos),
            HA = Z.slice(OA.startPos + OA.token.length),
            ZA = IA + "/" + j.fullCommand + " " + HA,
            zA = OA.startPos + 1 + j.fullCommand.length + 1;
          Q(ZA), G(zA), x(void 0);
          return
        }
        x(void 0)
      }
      if (D.length > 0) {
        T9("tab-completion"), n.cancel();
        let OA = W === -1 ? 0 : W,
          IA = D[OA];
        if (z === "command" && OA < D.length) {
          if (IA) vS0(IA, !1, A, Q, G, B), f()
        } else if (z === "custom-title" && D.length > 0) {
          if (IA) {
            let HA = DK9(IA);
            Q(HA), G(HA.length), f()
          }
        } else if (z === "directory" && D.length > 0) {
          let HA = D[OA];
          if (HA) {
            let ZA = yp(Z),
              zA;
            if (ZA) {
              let wA = Z.indexOf(" "),
                _A = Z.slice(0, wA + 1),
                s = S8A(HA.metadata) && HA.metadata.type === "directory" ? "/" : " ";
              zA = _A + HA.id + s
            } else {
              let _A = vp(Z, Y, !0) ?? vp(Z, Y, !1);
              if (_A) {
                let t = S8A(HA.metadata) && HA.metadata.type === "directory",
                  BA = KK9(Z, HA.id, _A.startPos, _A.token.length, t);
                if (zA = BA.newInput, Q(zA), G(BA.cursorPos), t) I((DA) => ({
                  ...DA,
                  commandArgumentHint: void 0
                })), y(zA, BA.cursorPos);
                else f();
                return
              }
              let s = S8A(HA.metadata) && HA.metadata.type === "directory" ? "/" : " ";
              zA = "@" + HA.id + s
            }
            Q(zA), G(zA.length), I((wA) => ({
              ...wA,
              commandArgumentHint: void 0
            })), y(zA, zA.length)
          }
        } else if (z === "shell" && D.length > 0) {
          let HA = D[OA];
          if (HA) {
            let ZA = HA.metadata;
            uS0(HA, Z, Y, Q, G, ZA?.completionType), f()
          }
        } else if (z === "file" && D.length > 0) {
          let HA = vp(Z, Y, !0);
          if (!HA) {
            f();
            return
          }
          let ZA = XQ9(D),
            zA = HA.token.startsWith("@"),
            wA;
          if (HA.isQuoted) wA = HA.token.slice(2).replace(/"$/, "").length;
          else if (zA) wA = HA.token.length - 1;
          else wA = HA.token.length;
          if (ZA.length > wA) {
            let _A = gS0({
              displayText: ZA,
              mode: J,
              hasAtPrefix: zA,
              needsQuotes: !1,
              isQuoted: HA.isQuoted,
              isComplete: !1
            });
            YE1(_A, Z, HA.token, HA.startPos, Q, G), y(Z.replace(HA.token, _A), Y)
          } else if (OA < D.length) {
            let _A = D[OA];
            if (_A) {
              let s = _A.displayText.includes(" "),
                t = gS0({
                  displayText: _A.displayText,
                  mode: J,
                  hasAtPrefix: zA,
                  needsQuotes: s,
                  isQuoted: HA.isQuoted,
                  isComplete: !0
                });
              YE1(t, Z, HA.token, HA.startPos, Q, G), f()
            }
          }
        }
      } else if (Z.trim() !== "") {
        let OA, IA;
        if (J === "bash") {
          OA = "shell";
          let HA = await nN7(Z, Y);
          if (HA.length === 1) {
            let ZA = HA[0];
            if (ZA) {
              let zA = ZA.metadata;
              uS0(ZA, Z, Y, Q, G, zA?.completionType)
            }
            IA = []
          } else IA = HA
        } else if (XC1()) {
          OA = "directory";
          let HA = Z.slice(0, Y),
            ZA = HA.lastIndexOf(" "),
            zA = ZA === -1 ? HA : HA.slice(ZA + 1),
            wA = zA === "" ? "./" : "./" + zA,
            _A = await bM0(wA, {
              maxResults: 15
            });
          if (_A.length === 1) {
            let s = _A[0];
            if (s) {
              let t = S8A(s.metadata) && s.metadata.type === "directory",
                BA = ZA + 1,
                DA = t ? "/" : " ",
                CA = "@" + s.id + DA,
                FA = Z.slice(0, BA) + CA + Z.slice(Y),
                xA = BA + CA.length;
              if (Q(FA), G(xA), t) y(FA, xA)
            }
            IA = []
          } else IA = _A.map((s) => ({
            ...s,
            metadata: {
              ...typeof s.metadata === "object" && s.metadata !== null ? s.metadata : {},
              inputSnapshot: Z,
              isBashStyleCompletion: !0
            }
          }))
        } else {
          OA = "file";
          let HA = vp(Z, Y, !0);
          if (HA) {
            let ZA = HA.token.startsWith("@"),
              zA = ZA ? HA.token.substring(1) : HA.token;
            IA = await hS0(zA, _.mcp.resources, X, ZA)
          } else IA = []
        }
        if (IA.length > 0) I((HA) => ({
          commandArgumentHint: void 0,
          suggestions: IA,
          selectedSuggestion: M$A(HA.suggestions, HA.selectedSuggestion, IA)
        })), $(OA), M(void 0)
      }
    }, [D, W, Z, z, A, J, Q, G, B, f, Y, y, _.mcp.resources, I, X, n, j]),
    GA = NI.useCallback(() => {
      if (W < 0 || D.length === 0) return;
      let OA = D[W];
      if (z === "command" && W < D.length) {
        if (OA) vS0(OA, !0, A, Q, G, B), n.cancel(), f()
      } else if (z === "custom-title" && W < D.length) {
        if (OA) {
          let IA = DK9(OA);
          Q(IA), G(IA.length), B(IA, !0), n.cancel(), f()
        }
      } else if (z === "shell" && W < D.length) {
        let IA = D[W];
        if (IA) {
          let HA = IA.metadata;
          uS0(IA, Z, Y, Q, G, HA?.completionType), n.cancel(), f()
        }
      } else if (z === "file" && W < D.length) {
        let IA = vp(Z, Y, !0);
        if (IA) {
          if (OA) {
            let HA = IA.token.startsWith("@"),
              ZA = OA.displayText.includes(" "),
              zA = gS0({
                displayText: OA.displayText,
                mode: J,
                hasAtPrefix: HA,
                needsQuotes: ZA,
                isQuoted: IA.isQuoted,
                isComplete: !0
              });
            YE1(zA, Z, IA.token, IA.startPos, Q, G), n.cancel(), f()
          }
        }
      } else if (z === "directory" && W < D.length) {
        if (OA) {
          let IA = yp(Z),
            HA, ZA;
          if (IA) {
            let zA = Z.indexOf(" "),
              wA = Z.slice(0, zA + 1),
              _A = S8A(OA.metadata) && OA.metadata.type === "directory" ? "/" : " ";
            HA = wA + OA.id + _A, ZA = HA.length
          } else {
            let wA = vp(Z, Y, !0) ?? vp(Z, Y, !1);
            if (wA) {
              let _A = S8A(OA.metadata) && OA.metadata.type === "directory",
                s = KK9(Z, OA.id, wA.startPos, wA.token.length, _A);
              HA = s.newInput, ZA = s.cursorPos
            } else {
              let _A = S8A(OA.metadata) && OA.metadata.type === "directory" ? "/" : " ";
              HA = "@" + OA.id + _A, ZA = HA.length
            }
          }
          Q(HA), G(ZA), n.cancel(), f()
        }
      }
    }, [D, W, z, A, Z, Y, J, Q, G, B, f, n]),
    WA = NI.useCallback(() => {
      p()
    }, [p]),
    MA = NI.useCallback(() => {
      n.cancel(), f()
    }, [n, f]),
    TA = NI.useCallback(() => {
      I((OA) => ({
        ...OA,
        selectedSuggestion: OA.selectedSuggestion <= 0 ? D.length - 1 : OA.selectedSuggestion - 1
      }))
    }, [D.length, I]),
    bA = NI.useCallback(() => {
      I((OA) => ({
        ...OA,
        selectedSuggestion: OA.selectedSuggestion >= D.length - 1 ? 0 : OA.selectedSuggestion + 1
      }))
    }, [D.length, I]),
    jA = NI.useMemo(() => ({
      "autocomplete:accept": WA,
      "autocomplete:dismiss": MA,
      "autocomplete:previous": TA,
      "autocomplete:next": bA
    }), [WA, MA, TA, bA]);
  return iW(jA, {
    context: "Autocomplete",
    isActive: D.length > 0 || !!j
  }), J0((OA, IA) => {
    if (IA.tab && !IA.shift) {
      if (z === "directory" && XC1() && D.length > 0) {
        if (IK9(D[0]?.metadata, Z)) {
          f(), p();
          return
        }
      }
      if (D.length > 0 || j) return;
      if (XC1() && J === "prompt" && Z.trim() !== "") {
        p();
        return
      }
      let HA = _.promptSuggestion.text,
        ZA = _.promptSuggestion.shownAt;
      if (HA && ZA > 0 && Z === "") {
        F(), Q(HA), G(HA.length);
        return
      }
      if (Z.trim() === "") H({
        key: "thinking-toggle-hint",
        jsx: mS0.createElement(C, {
          dimColor: !0
        }, "Use ", E, " to toggle thinking"),
        priority: "immediate",
        timeoutMs: 3000
      });
      return
    }
    if (D.length === 0) return;
    if (IA.ctrl && OA === "n") {
      bA();
      return
    }
    if (IA.ctrl && OA === "p") {
      TA();
      return
    }
    if (IA.return) GA()
  }), {
    suggestions: D,
    selectedSuggestion: W,
    suggestionType: z,
    maxColumnWidth: L,
    commandArgumentHint: K,
    inlineGhostText: j
  }
}
// @from(Ln 452226, Col 4)
NI
// @from(Ln 452226, Col 8)
mS0
// @from(Ln 452226, Col 13)
IC1 = null
// @from(Ln 452227, Col 4)
HK9 = w(() => {
  fA();
  c6();
  kS0();
  fM0();
  d4();
  JE1();
  BK9();
  XK9();
  oK();
  hB();
  Z0();
  w6();
  JZ();
  NX();
  HY();
  fA();
  NI = c(QA(), 1), mS0 = c(QA(), 1)
})
// @from(Ln 452247, Col 0)
function CK9() {
  return {
    mode: "INSERT",
    insertedText: ""
  }
}
// @from(Ln 452254, Col 0)
function UK9() {
  return {
    lastChange: null,
    lastFind: null,
    register: "",
    registerIsLinewise: !1
  }
}
// @from(Ln 452262, Col 4)
EK9
// @from(Ln 452262, Col 9)
dS0
// @from(Ln 452262, Col 14)
cS0
// @from(Ln 452262, Col 19)
zK9
// @from(Ln 452262, Col 24)
$K9
// @from(Ln 452262, Col 29)
pS0 = 1e4
// @from(Ln 452263, Col 4)
lS0 = w(() => {
  EK9 = {
    d: "delete",
    c: "change",
    y: "yank"
  }, dS0 = new Set(["h", "l", "j", "k", "w", "b", "e", "W", "B", "E", "0", "^", "$"]), cS0 = new Set(["f", "F", "t", "T"]), zK9 = {
    i: "inner",
    a: "around"
  }, $K9 = new Set(["w", "W", '"', "'", "`", "(", ")", "b", "[", "]", "{", "}", "B", "<", ">"])
})
// @from(Ln 452274, Col 0)
function DC1(A, Q, B) {
  let G = Q;
  for (let Z = 0; Z < B; Z++) {
    let Y = oN7(A, G);
    if (Y.equals(G)) break;
    G = Y
  }
  return G
}
// @from(Ln 452284, Col 0)
function oN7(A, Q) {
  switch (A) {
    case "h":
      return Q.left();
    case "l":
      return Q.right();
    case "j":
      return Q.downLogicalLine();
    case "k":
      return Q.upLogicalLine();
    case "w":
      return Q.nextVimWord();
    case "b":
      return Q.prevVimWord();
    case "e":
      return Q.endOfVimWord();
    case "W":
      return Q.nextWORD();
    case "B":
      return Q.prevWORD();
    case "E":
      return Q.endOfWORD();
    case "0":
      return Q.startOfLogicalLine();
    case "^":
      return Q.firstNonBlankInLogicalLine();
    case "$":
      return Q.endOfLogicalLine();
    case "G":
      return Q.startOfLastLine();
    default:
      return Q
  }
}
// @from(Ln 452319, Col 0)
function qK9(A) {
  return "eE$".includes(A)
}
// @from(Ln 452323, Col 0)
function NK9(A) {
  return "jkG".includes(A) || A === "gg"
}
// @from(Ln 452327, Col 0)
function LK9(A, Q, B, G) {
  if (B === "w") return wK9(A, Q, G, Wm);
  if (B === "W") return wK9(A, Q, G, (Y) => !Y91(Y));
  let Z = rN7[B];
  if (Z) {
    let [Y, J] = Z;
    return Y === J ? sN7(A, Q, Y, G) : tN7(A, Q, Y, J, G)
  }
  return null
}
// @from(Ln 452338, Col 0)
function wK9(A, Q, B, G) {
  let Z = Q,
    Y = Q,
    J = (W) => A[W] ?? "",
    X = (W) => Y91(J(W)),
    I = (W) => G(J(W)),
    D = (W) => ca(J(W));
  if (I(Q)) {
    while (Z > 0 && I(Z - 1)) Z--;
    while (Y < A.length && I(Y)) Y++
  } else if (X(Q)) {
    while (Z > 0 && X(Z - 1)) Z--;
    while (Y < A.length && X(Y)) Y++;
    return {
      start: Z,
      end: Y
    }
  } else if (D(Q)) {
    while (Z > 0 && D(Z - 1)) Z--;
    while (Y < A.length && D(Y)) Y++
  }
  if (!B) {
    if (Y < A.length && X(Y))
      while (Y < A.length && X(Y)) Y++;
    else if (Z > 0 && X(Z - 1))
      while (Z > 0 && X(Z - 1)) Z--
  }
  return {
    start: Z,
    end: Y
  }
}
// @from(Ln 452371, Col 0)
function sN7(A, Q, B, G) {
  let Z = A.lastIndexOf(`
`, Q - 1) + 1,
    Y = A.indexOf(`
`, Q),
    J = Y === -1 ? A.length : Y,
    X = A.slice(Z, J),
    I = Q - Z,
    D = [];
  for (let W = 0; W < X.length; W++)
    if (X[W] === B) D.push(W);
  for (let W = 0; W < D.length - 1; W += 2) {
    let K = D[W],
      V = D[W + 1];
    if (K <= I && I <= V) return G ? {
      start: Z + K + 1,
      end: Z + V
    } : {
      start: Z + K,
      end: Z + V + 1
    }
  }
  return null
}
// @from(Ln 452396, Col 0)
function tN7(A, Q, B, G, Z) {
  let Y = 0,
    J = -1;
  for (let I = Q; I >= 0; I--)
    if (A[I] === G && I !== Q) Y++;
    else if (A[I] === B) {
    if (Y === 0) {
      J = I;
      break
    }
    Y--
  }
  if (J === -1) return null;
  Y = 0;
  let X = -1;
  for (let I = J + 1; I < A.length; I++)
    if (A[I] === B) Y++;
    else if (A[I] === G) {
    if (Y === 0) {
      X = I;
      break
    }
    Y--
  }
  if (X === -1) return null;
  return Z ? {
    start: J + 1,
    end: X
  } : {
    start: J,
    end: X + 1
  }
}
// @from(Ln 452429, Col 4)
rN7
// @from(Ln 452430, Col 4)
OK9 = w(() => {
  DjA();
  rN7 = {
    "(": ["(", ")"],
    ")": ["(", ")"],
    b: ["(", ")"],
    "[": ["[", "]"],
    "]": ["[", "]"],
    "{": ["{", "}"],
    "}": ["{", "}"],
    B: ["{", "}"],
    "<": ["<", ">"],
    ">": ["<", ">"],
    '"': ['"', '"'],
    "'": ["'", "'"],
    "`": ["`", "`"]
  }
})
// @from(Ln 452449, Col 0)
function R$A(A, Q, B, G) {
  let Z = DC1(Q, G.cursor, B);
  if (Z.equals(G.cursor)) return;
  let Y = nS0(G.cursor, Z, Q, A, B);
  tuA(A, Y.from, Y.to, G, Y.linewise), G.recordChange({
    type: "operator",
    op: A,
    motion: Q,
    count: B
  })
}
// @from(Ln 452461, Col 0)
function WC1(A, Q, B, G, Z) {
  let Y = Z.cursor.findCharacter(B, Q, G);
  if (Y === null) return;
  let J = new p6(Z.cursor.measuredText, Y),
    X = eN7(Z.cursor, J, Q);
  tuA(A, X.from, X.to, Z), Z.setLastFind(Q, B), Z.recordChange({
    type: "operatorFind",
    op: A,
    find: Q,
    char: B,
    count: G
  })
}
// @from(Ln 452475, Col 0)
function KC1(A, Q, B, G, Z) {
  let Y = LK9(Z.text, Z.cursor.offset, B, Q === "inner");
  if (!Y) return;
  tuA(A, Y.start, Y.end, Z), Z.recordChange({
    type: "operatorTextObj",
    op: A,
    objType: B,
    scope: Q,
    count: G
  })
}
// @from(Ln 452487, Col 0)
function iS0(A, Q, B) {
  let G = B.text,
    Z = G.split(`
`),
    Y = G.slice(0, B.cursor.offset).split(`
`).length - 1,
    J = Math.min(Q, Z.length - Y),
    X = B.cursor.startOfLogicalLine().offset,
    I = X;
  for (let W = 0; W < J; W++) {
    let K = G.indexOf(`
`, I);
    I = K === -1 ? G.length : K + 1
  }
  let D = G.slice(X, I);
  if (!D.endsWith(`
`)) D = D + `
`;
  if (B.setRegister(D, !0), A === "yank") B.setOffset(X);
  else if (A === "delete") {
    let W = X,
      K = I;
    if (K === G.length && W > 0 && G[W - 1] === `
`) W -= 1;
    let V = G.slice(0, W) + G.slice(K);
    B.setText(V || ""), B.setOffset(Math.min(W, Math.max(0, V.length - 1)))
  } else if (A === "change")
    if (Z.length === 1) B.setText(""), B.enterInsert(0);
    else {
      let W = Z.slice(0, Y),
        K = Z.slice(Y + J),
        V = [...W, "", ...K].join(`
`);
      B.setText(V), B.enterInsert(X)
    } B.recordChange({
    type: "operator",
    op: A,
    motion: A[0],
    count: Q
  })
}
// @from(Ln 452529, Col 0)
function VC1(A, Q) {
  let B = Q.cursor.offset,
    G = Math.min(B + A, Q.text.length);
  if (B >= Q.text.length) return;
  let Z = Q.text.slice(B, G),
    Y = Q.text.slice(0, B) + Q.text.slice(G);
  Q.setRegister(Z, !1), Q.setText(Y), Q.setOffset(Math.min(B, Math.max(0, Y.length - 1))), Q.recordChange({
    type: "x",
    count: A
  })
}
// @from(Ln 452541, Col 0)
function FC1(A, Q, B) {
  let G = B.cursor.offset,
    Z = B.text;
  for (let Y = 0; Y < Q && G < Z.length; Y++) Z = Z.slice(0, G) + A + Z.slice(G + 1), G++;
  B.setText(Z), B.setOffset(Math.max(0, G - 1)), B.recordChange({
    type: "replace",
    char: A,
    count: Q
  })
}
// @from(Ln 452552, Col 0)
function HC1(A, Q) {
  let B = Q.cursor.offset,
    G = Math.min(B + A, Q.text.length);
  if (B >= Q.text.length) return;
  let Z = Q.text;
  for (let Y = B; Y < G; Y++) {
    let J = Z[Y],
      X = J === J.toUpperCase() ? J.toLowerCase() : J.toUpperCase();
    Z = Z.slice(0, Y) + X + Z.slice(Y + 1)
  }
  Q.setText(Z), Q.setOffset(G), Q.recordChange({
    type: "toggleCase",
    count: A
  })
}
// @from(Ln 452568, Col 0)
function EC1(A, Q) {
  let G = Q.text.split(`
`),
    {
      line: Z
    } = Q.cursor.getPosition();
  if (Z >= G.length - 1) return;
  let Y = Math.min(A, G.length - Z - 1),
    J = G[Z],
    X = J.length;
  for (let W = 1; W <= Y; W++) {
    let K = (G[Z + W] ?? "").trimStart();
    if (K.length > 0) {
      if (!J.endsWith(" ") && J.length > 0) J += " ";
      J += K
    }
  }
  let I = [...G.slice(0, Z), J, ...G.slice(Z + Y + 1)],
    D = I.join(`
`);
  Q.setText(D), Q.setOffset($C1(I, Z) + X), Q.recordChange({
    type: "join",
    count: A
  })
}
// @from(Ln 452594, Col 0)
function MK9(A, Q, B) {
  let G = B.getRegister();
  if (!G) return;
  let Z = G.endsWith(`
`),
    Y = Z ? G.slice(0, -1) : G;
  if (Z) {
    let X = B.text.split(`
`),
      {
        line: I
      } = B.cursor.getPosition(),
      D = A ? I + 1 : I,
      W = Y.split(`
`),
      K = [];
    for (let H = 0; H < Q; H++) K.push(...W);
    let V = [...X.slice(0, D), ...K, ...X.slice(D)],
      F = V.join(`
`);
    B.setText(F), B.setOffset($C1(V, D))
  } else {
    let J = Y.repeat(Q),
      X = A && B.cursor.offset < B.text.length ? B.cursor.offset + 1 : B.cursor.offset,
      I = B.text.slice(0, X) + J + B.text.slice(X),
      D = X + J.length - 1;
    B.setText(I), B.setOffset(Math.max(X, D))
  }
}
// @from(Ln 452624, Col 0)
function zC1(A, Q, B) {
  let Z = B.text.split(`
`),
    {
      line: Y
    } = B.cursor.getPosition(),
    J = Math.min(Q, Z.length - Y),
    X = "  ";
  for (let K = 0; K < J; K++) {
    let V = Y + K,
      F = Z[V] ?? "";
    if (A === ">") Z[V] = "  " + F;
    else if (F.startsWith("  ")) Z[V] = F.slice(2);
    else if (F.startsWith("\t")) Z[V] = F.slice(1);
    else {
      let H = 0,
        E = 0;
      while (E < F.length && H < 2 && /\s/.test(F[E])) H++, E++;
      Z[V] = F.slice(E)
    }
  }
  let I = Z.join(`
`),
    W = ((Z[Y] ?? "").match(/^\s*/)?.[0] ?? "").length;
  B.setText(I), B.setOffset($C1(Z, Y) + W), B.recordChange({
    type: "indent",
    dir: A,
    count: Q
  })
}
// @from(Ln 452655, Col 0)
function suA(A, Q) {
  let G = Q.text.split(`
`),
    {
      line: Z
    } = Q.cursor.getPosition(),
    Y = A === "below" ? Z + 1 : Z,
    J = [...G.slice(0, Y), "", ...G.slice(Y)],
    X = J.join(`
`);
  Q.setText(X), Q.enterInsert($C1(J, Y)), Q.recordChange({
    type: "openLine",
    direction: A
  })
}
// @from(Ln 452671, Col 0)
function $C1(A, Q) {
  return A.slice(0, Q).join(`
`).length + (Q > 0 ? 1 : 0)
}
// @from(Ln 452676, Col 0)
function nS0(A, Q, B, G, Z) {
  let Y = Math.min(A.offset, Q.offset),
    J = Math.max(A.offset, Q.offset),
    X = !1;
  if (G === "change" && (B === "w" || B === "W")) {
    let I = A;
    for (let W = 0; W < Z - 1; W++) I = B === "w" ? I.nextVimWord() : I.nextWORD();
    J = (B === "w" ? I.endOfVimWord() : I.endOfWORD()).offset + 1
  } else if (NK9(B)) {
    X = !0;
    let I = A.text,
      D = I.indexOf(`
`, J);
    if (D === -1) {
      if (J = I.length, Y > 0 && I[Y - 1] === `
`) Y -= 1
    } else J = D + 1
  } else if (qK9(B) && A.offset <= Q.offset) J += 1;
  return {
    from: Y,
    to: J,
    linewise: X
  }
}
// @from(Ln 452701, Col 0)
function eN7(A, Q, B) {
  let G = Math.min(A.offset, Q.offset),
    Z = Math.max(A.offset, Q.offset) + 1;
  return {
    from: G,
    to: Z
  }
}
// @from(Ln 452710, Col 0)
function tuA(A, Q, B, G, Z = !1) {
  let Y = G.text.slice(Q, B);
  if (Z && !Y.endsWith(`
`)) Y = Y + `
`;
  if (G.setRegister(Y, Z), A === "yank") G.setOffset(Q);
  else if (A === "delete") {
    let J = G.text.slice(0, Q) + G.text.slice(B);
    G.setText(J), G.setOffset(Math.min(Q, Math.max(0, J.length - 1)))
  } else if (A === "change") {
    let J = G.text.slice(0, Q) + G.text.slice(B);
    G.setText(J), G.enterInsert(Q)
  }
}
// @from(Ln 452725, Col 0)
function RK9(A, Q, B) {
  let G = Q === 1 ? B.cursor.startOfLastLine() : B.cursor.goToLine(Q);
  if (G.equals(B.cursor)) return;
  let Z = nS0(B.cursor, G, "G", A, Q);
  tuA(A, Z.from, Z.to, B, Z.linewise), B.recordChange({
    type: "operator",
    op: A,
    motion: "G",
    count: Q
  })
}
// @from(Ln 452737, Col 0)
function _K9(A, Q, B) {
  let G = Q === 1 ? B.cursor.startOfFirstLine() : B.cursor.goToLine(Q);
  if (G.equals(B.cursor)) return;
  let Z = nS0(B.cursor, G, "gg", A, Q);
  tuA(A, Z.from, Z.to, B, Z.linewise), B.recordChange({
    type: "operator",
    op: A,
    motion: "gg",
    count: Q
  })
}
// @from(Ln 452748, Col 4)
aS0 = w(() => {
  DjA();
  OK9()
})
// @from(Ln 452753, Col 0)
function jK9(A, Q, B) {
  switch (A.type) {
    case "idle":
      return Aw7(Q, B);
    case "count":
      return Qw7(A, Q, B);
    case "operator":
      return Bw7(A, Q, B);
    case "operatorCount":
      return Gw7(A, Q, B);
    case "operatorFind":
      return Zw7(A, Q, B);
    case "operatorTextObj":
      return Yw7(A, Q, B);
    case "find":
      return Jw7(A, Q, B);
    case "g":
      return Xw7(A, Q, B);
    case "operatorG":
      return Iw7(A, Q, B);
    case "replace":
      return Dw7(A, Q, B);
    case "indent":
      return Ww7(A, Q, B)
  }
}
// @from(Ln 452780, Col 0)
function TK9(A, Q, B) {
  let G = EK9[A];
  if (G) return {
    next: {
      type: "operator",
      op: G,
      count: Q
    }
  };
  if (dS0.has(A)) return {
    execute: () => {
      let Z = DC1(A, B.cursor, Q);
      B.setOffset(Z.offset)
    }
  };
  if (cS0.has(A)) return {
    next: {
      type: "find",
      find: A,
      count: Q
    }
  };
  if (A === "g") return {
    next: {
      type: "g",
      count: Q
    }
  };
  if (A === "r") return {
    next: {
      type: "replace",
      count: Q
    }
  };
  if (A === ">" || A === "<") return {
    next: {
      type: "indent",
      dir: A,
      count: Q
    }
  };
  if (A === "~") return {
    execute: () => HC1(Q, B)
  };
  if (A === "x") return {
    execute: () => VC1(Q, B)
  };
  if (A === "J") return {
    execute: () => EC1(Q, B)
  };
  if (A === "p" || A === "P") return {
    execute: () => MK9(A === "p", Q, B)
  };
  if (A === "D") return {
    execute: () => R$A("delete", "$", 1, B)
  };
  if (A === "C") return {
    execute: () => R$A("change", "$", 1, B)
  };
  if (A === "Y") return {
    execute: () => iS0("yank", Q, B)
  };
  if (A === "G") return {
    execute: () => {
      if (Q === 1) B.setOffset(B.cursor.startOfLastLine().offset);
      else B.setOffset(B.cursor.goToLine(Q).offset)
    }
  };
  if (A === ".") return {
    execute: () => B.onDotRepeat?.()
  };
  if (A === ";" || A === ",") return {
    execute: () => Kw7(A === ",", Q, B)
  };
  if (A === "u") return {
    execute: () => B.onUndo?.()
  };
  if (A === "i") return {
    execute: () => B.enterInsert(B.cursor.offset)
  };
  if (A === "I") return {
    execute: () => B.enterInsert(B.cursor.firstNonBlankInLogicalLine().offset)
  };
  if (A === "a") return {
    execute: () => {
      let Z = B.cursor.isAtEnd() ? B.cursor.offset : B.cursor.offset + 1;
      B.enterInsert(Z)
    }
  };
  if (A === "A") return {
    execute: () => B.enterInsert(B.cursor.endOfLogicalLine().offset)
  };
  if (A === "o") return {
    execute: () => suA("below", B)
  };
  if (A === "O") return {
    execute: () => suA("above", B)
  };
  return null
}
// @from(Ln 452881, Col 0)
function PK9(A, Q, B, G) {
  let Z = zK9[B];
  if (Z) return {
    next: {
      type: "operatorTextObj",
      op: A,
      count: Q,
      scope: Z
    }
  };
  if (cS0.has(B)) return {
    next: {
      type: "operatorFind",
      op: A,
      count: Q,
      find: B
    }
  };
  if (dS0.has(B)) return {
    execute: () => R$A(A, B, Q, G)
  };
  if (B === "G") return {
    execute: () => RK9(A, Q, G)
  };
  if (B === "g") return {
    next: {
      type: "operatorG",
      op: A,
      count: Q
    }
  };
  return null
}
// @from(Ln 452915, Col 0)
function Aw7(A, Q) {
  if (/[1-9]/.test(A)) return {
    next: {
      type: "count",
      digits: A
    }
  };
  if (A === "0") return {
    execute: () => Q.setOffset(Q.cursor.startOfLogicalLine().offset)
  };
  let B = TK9(A, 1, Q);
  if (B) return B;
  return {}
}
// @from(Ln 452930, Col 0)
function Qw7(A, Q, B) {
  if (/[0-9]/.test(Q)) {
    let Y = A.digits + Q,
      J = Math.min(parseInt(Y, 10), pS0);
    return {
      next: {
        type: "count",
        digits: String(J)
      }
    }
  }
  let G = parseInt(A.digits, 10),
    Z = TK9(Q, G, B);
  if (Z) return Z;
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 452951, Col 0)
function Bw7(A, Q, B) {
  if (Q === A.op[0]) return {
    execute: () => iS0(A.op, A.count, B)
  };
  if (/[0-9]/.test(Q)) return {
    next: {
      type: "operatorCount",
      op: A.op,
      count: A.count,
      digits: Q
    }
  };
  let G = PK9(A.op, A.count, Q, B);
  if (G) return G;
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 452972, Col 0)
function Gw7(A, Q, B) {
  if (/[0-9]/.test(Q)) {
    let J = A.digits + Q,
      X = Math.min(parseInt(J, 10), pS0);
    return {
      next: {
        ...A,
        digits: String(X)
      }
    }
  }
  let G = parseInt(A.digits, 10),
    Z = A.count * G,
    Y = PK9(A.op, Z, Q, B);
  if (Y) return Y;
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 452994, Col 0)
function Zw7(A, Q, B) {
  return {
    execute: () => WC1(A.op, A.find, Q, A.count, B)
  }
}
// @from(Ln 453000, Col 0)
function Yw7(A, Q, B) {
  if ($K9.has(Q)) return {
    execute: () => KC1(A.op, A.scope, Q, A.count, B)
  };
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 453011, Col 0)
function Jw7(A, Q, B) {
  return {
    execute: () => {
      let G = B.cursor.findCharacter(Q, A.find, A.count);
      if (G !== null) B.setOffset(G), B.setLastFind(A.find, Q)
    }
  }
}
// @from(Ln 453020, Col 0)
function Xw7(A, Q, B) {
  if (Q === "g") {
    if (A.count > 1) return {
      execute: () => {
        let G = B.text.split(`
`),
          Z = Math.min(A.count - 1, G.length - 1),
          Y = 0;
        for (let J = 0; J < Z; J++) Y += (G[J]?.length ?? 0) + 1;
        B.setOffset(Y)
      }
    };
    return {
      execute: () => B.setOffset(B.cursor.startOfFirstLine().offset)
    }
  }
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 453043, Col 0)
function Iw7(A, Q, B) {
  if (Q === "g") return {
    execute: () => _K9(A.op, A.count, B)
  };
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 453054, Col 0)
function Dw7(A, Q, B) {
  return {
    execute: () => FC1(Q, A.count, B)
  }
}
// @from(Ln 453060, Col 0)
function Ww7(A, Q, B) {
  if (Q === A.dir) return {
    execute: () => zC1(A.dir, A.count, B)
  };
  return {
    next: {
      type: "idle"
    }
  }
}
// @from(Ln 453071, Col 0)
function Kw7(A, Q, B) {
  let G = B.getLastFind();
  if (!G) return;
  let Z = G.type;
  if (A) Z = {
    f: "F",
    F: "f",
    t: "T",
    T: "t"
  } [Z];
  let Y = B.cursor.findCharacter(G.char, Z, Q);
  if (Y !== null) B.setOffset(Y)
}
// @from(Ln 453084, Col 4)
SK9 = w(() => {
  lS0();
  aS0()
})
// @from(Ln 453089, Col 0)
function xK9(A) {
  let Q = kp.default.useRef(CK9()),
    [B, G] = kp.useState("INSERT"),
    Z = kp.default.useRef(UK9()),
    Y = mH1({
      ...A,
      inputFilter: A.inputFilter
    }),
    {
      onModeChange: J
    } = A,
    X = kp.useCallback((F) => {
      if (F !== void 0) Y.setOffset(F);
      Q.current = {
        mode: "INSERT",
        insertedText: ""
      }, G("INSERT"), J?.("INSERT")
    }, [Y, J]),
    I = kp.useCallback(() => {
      let F = Q.current;
      if (F.mode === "INSERT" && F.insertedText) Z.current.lastChange = {
        type: "insert",
        text: F.insertedText
      };
      Q.current = {
        mode: "NORMAL",
        command: {
          type: "idle"
        }
      }, G("NORMAL"), J?.("NORMAL")
    }, [J]);

  function D(F, H = !1) {
    return {
      cursor: F,
      text: A.value,
      setText: (E) => A.onChange(E),
      setOffset: (E) => Y.setOffset(E),
      enterInsert: (E) => X(E),
      getRegister: () => Z.current.register,
      setRegister: (E, z) => {
        Z.current.register = E, Z.current.registerIsLinewise = z
      },
      getLastFind: () => Z.current.lastFind,
      setLastFind: (E, z) => {
        Z.current.lastFind = {
          type: E,
          char: z
        }
      },
      recordChange: H ? () => {} : (E) => {
        Z.current.lastChange = E
      }
    }
  }

  function W() {
    let F = Z.current.lastChange;
    if (!F) return;
    let H = p6.fromText(A.value, A.columns, Y.offset),
      E = D(H, !0);
    switch (F.type) {
      case "insert":
        if (F.text) {
          let z = H.insert(F.text);
          A.onChange(z.text), Y.setOffset(z.offset)
        }
        break;
      case "x":
        VC1(F.count, E);
        break;
      case "replace":
        FC1(F.char, F.count, E);
        break;
      case "toggleCase":
        HC1(F.count, E);
        break;
      case "indent":
        zC1(F.dir, F.count, E);
        break;
      case "join":
        EC1(F.count, E);
        break;
      case "openLine":
        suA(F.direction, E);
        break;
      case "operator":
        R$A(F.op, F.motion, F.count, E);
        break;
      case "operatorFind":
        WC1(F.op, F.find, F.char, F.count, E);
        break;
      case "operatorTextObj":
        KC1(F.op, F.scope, F.objType, F.count, E);
        break
    }
  }

  function K(F, H) {
    let E = p6.fromText(A.value, A.columns, Y.offset),
      z = Q.current;
    if (H.ctrl) {
      Y.onInput(F, H);
      return
    }
    if (H.escape && z.mode === "INSERT") {
      I();
      return
    }
    if (H.return) {
      Y.onInput(F, H);
      return
    }
    if (z.mode === "INSERT") {
      if (H.backspace || H.delete) {
        if (z.insertedText.length > 0) Q.current = {
          mode: "INSERT",
          insertedText: z.insertedText.slice(0, -1)
        }
      } else Q.current = {
        mode: "INSERT",
        insertedText: z.insertedText + F
      };
      Y.onInput(F, H);
      return
    }
    if (z.mode !== "NORMAL") return;
    let $ = {
        ...D(E, !1),
        onUndo: A.onUndo,
        onDotRepeat: W
      },
      O = jK9(z.command, F, $);
    if (O.execute) O.execute();
    if (Q.current.mode === "NORMAL") {
      if (O.next) Q.current = {
        mode: "NORMAL",
        command: O.next
      };
      else if (O.execute) Q.current = {
        mode: "NORMAL",
        command: {
          type: "idle"
        }
      }
    }
    if (F === "?" && z.mode === "NORMAL" && z.command.type === "idle") A.onChange("?")
  }
  let V = kp.useCallback((F) => {
    if (F === "INSERT") Q.current = {
      mode: "INSERT",
      insertedText: ""
    };
    else Q.current = {
      mode: "NORMAL",
      command: {
        type: "idle"
      }
    };
    G(F), J?.(F)
  }, [J]);
  return {
    ...Y,
    onInput: K,
    mode: B,
    setMode: V
  }
}
// @from(Ln 453257, Col 4)
kp
// @from(Ln 453258, Col 4)
yK9 = w(() => {
  PM0();
  DjA();
  lS0();
  SK9();
  aS0();
  kp = c(QA(), 1)
})
// @from(Ln 453267, Col 0)
function oS0(A) {
  let [Q] = oB(), B = GN();
  lH1(B, !!A.onImagePaste);
  let G = xK9({
      value: A.value,
      onChange: A.onChange,
      onSubmit: A.onSubmit,
      onExit: A.onExit,
      onExitMessage: A.onExitMessage,
      onHistoryReset: A.onHistoryReset,
      onHistoryUp: A.onHistoryUp,
      onHistoryDown: A.onHistoryDown,
      focus: A.focus,
      mask: A.mask,
      multiline: A.multiline,
      cursorChar: A.showCursor ? " " : "",
      highlightPastedText: A.highlightPastedText,
      invert: B ? I1.inverse : (J) => J,
      themeText: sQ("text", Q),
      columns: A.columns,
      onImagePaste: A.onImagePaste,
      disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
      externalOffset: A.cursorOffset,
      onOffsetChange: A.onChangeCursorOffset,
      onModeChange: A.onModeChange,
      isMessageLoading: A.isLoading,
      onUndo: A.onUndo
    }),
    {
      mode: Z,
      setMode: Y
    } = G;
  return CC1.default.useEffect(() => {
    if (A.initialMode && A.initialMode !== Z) Y(A.initialMode)
  }, [A.initialMode, Z, Y]), CC1.default.createElement(T, {
    flexDirection: "column"
  }, CC1.default.createElement(cH1, {
    inputState: G,
    terminalFocus: B,
    highlights: A.highlights,
    ...A
  }))
}
// @from(Ln 453310, Col 4)
CC1
// @from(Ln 453311, Col 4)
vK9 = w(() => {
  fA();
  Z3();
  yK9();
  xM0();
  kM0();
  CC1 = c(QA(), 1)
})
// @from(Ln 453320, Col 0)
function kK9(A, Q) {
  let B = Q && null?.isTeamLead(Q);
  switch (A.mode) {
    case "default":
      return "acceptEdits";
    case "acceptEdits":
      return "plan";
    case "plan":
      if (B) return "delegate";
      return A.isBypassPermissionsModeAvailable ? "bypassPermissions" : "default";
    case "delegate":
      return A.isBypassPermissionsModeAvailable ? "bypassPermissions" : "default";
    case "bypassPermissions":
      return "default";
    case "dontAsk":
      return "default"
  }
}
// @from(Ln 453339, Col 0)
function bK9({
  tasksSelected: A,
  showHint: Q
}) {
  let {
    columns: B
  } = ZB(), G = rS0.useMemo(() => L1().hasSeenTasksHint, []), [{
    tasks: Z
  }] = a0(), Y = Q && (A || !G) ? gZ.createElement(gZ.Fragment, null, gZ.createElement(C, {
    dimColor: !0
  }, " · "), gZ.createElement(C, {
    dimColor: !0
  }, A ? gZ.createElement(F0, {
    shortcut: "Enter",
    action: "view tasks"
  }) : gZ.createElement(F0, {
    shortcut: "↓",
    action: "view"
  }))) : null, J = rS0.useMemo(() => Object.values(Z ?? {}).filter(I8A), [Z]);
  if (J.length === 0) return null;
  if (J.length > 1 || B < 150) return gZ.createElement(gZ.Fragment, null, gZ.createElement(C, {
    color: "background",
    inverse: A
  }, J.length, " background", " ", J.length === 1 ? "task" : "tasks"), Y);
  if (J.length === 1) {
    let X = J[0],
      I = Vw7(X);
    return gZ.createElement(gZ.Fragment, null, gZ.createElement(C, {
      color: "background",
      inverse: A
    }, YG(I, 40, !0), " ", gZ.createElement(C, {
      dimColor: !0
    }, "(", X.status, ")")), Y)
  }
  return null
}
// @from(Ln 453376, Col 0)
function Vw7(A) {
  switch (A.type) {
    case "local_bash":
      return A.command;
    case "local_agent":
      return A.description;
    case "remote_agent":
      return A.title
  }
}
// @from(Ln 453386, Col 4)
gZ
// @from(Ln 453386, Col 8)
rS0
// @from(Ln 453387, Col 4)
fK9 = w(() => {
  fA();
  GQ();
  hB();
  e9();
  P4();
  gZ = c(QA(), 1), rS0 = c(QA(), 1)
})
// @from(Ln 453396, Col 0)
function Fw7({
  value: A,
  onChange: Q,
  historyFailedMatch: B
}) {
  return x8A.createElement(T, {
    gap: 1
  }, x8A.createElement(C, {
    dimColor: !0
  }, B ? "no matching prompt:" : "search prompts:"), x8A.createElement(p4, {
    value: A,
    onChange: Q,
    cursorOffset: A.length,
    onChangeCursorOffset: () => {},
    columns: A.length + 1,
    focus: !0,
    showCursor: !0,
    multiline: !1,
    dimColor: !0
  }))
}
// @from(Ln 453417, Col 4)
x8A
// @from(Ln 453417, Col 9)
hK9
// @from(Ln 453418, Col 4)
gK9 = w(() => {
  fA();
  IY();
  x8A = c(QA(), 1);
  hK9 = Fw7
})
// @from(Ln 453430, Col 0)
async function uK9() {
  if (!await nq()) return null;
  if (await dK9()) return null;
  let {
    stdout: Q,
    code: B
  } = await TQ("git", ["diff", "HEAD", "--shortstat"], {
    timeout: UC1,
    preserveOutputOnError: !1
  });
  if (B === 0) {
    let I = ww7(Q);
    if (I && I.filesCount > Cw7) return {
      stats: I,
      perFileStats: new Map,
      hunks: new Map
    }
  }
  let {
    stdout: G,
    code: Z
  } = await TQ("git", ["diff", "HEAD", "--numstat"], {
    timeout: UC1,
    preserveOutputOnError: !1
  });
  if (Z !== 0) return null;
  let {
    stats: Y,
    perFileStats: J
  } = Uw7(G), X = sS0 - J.size;
  if (X > 0) {
    let I = await Nw7(X);
    if (I) {
      Y.filesCount += I.size;
      for (let [D, W] of I) J.set(D, W)
    }
  }
  return {
    stats: Y,
    perFileStats: J,
    hunks: new Map
  }
}
// @from(Ln 453473, Col 0)
async function mK9() {
  if (!await nq()) return new Map;
  if (await dK9()) return new Map;
  let {
    stdout: Q,
    code: B
  } = await TQ("git", ["diff", "HEAD"], {
    timeout: UC1,
    preserveOutputOnError: !1
  });
  if (B !== 0) return new Map;
  return qw7(Q)
}
// @from(Ln 453487, Col 0)
function Uw7(A) {
  let Q = A.trim().split(`
`).filter(Boolean),
    B = 0,
    G = 0,
    Z = 0,
    Y = new Map;
  for (let J of Q) {
    let X = J.split("\t");
    if (X.length < 3) continue;
    Z++;
    let I = X[0],
      D = X[1],
      W = X.slice(2).join("\t"),
      K = I === "-" || D === "-",
      V = K ? 0 : parseInt(I ?? "0", 10) || 0,
      F = K ? 0 : parseInt(D ?? "0", 10) || 0;
    if (B += V, G += F, Y.size < sS0) Y.set(W, {
      added: V,
      removed: F,
      isBinary: K
    })
  }
  return {
    stats: {
      filesCount: Z,
      linesAdded: B,
      linesRemoved: G
    },
    perFileStats: Y
  }
}
// @from(Ln 453520, Col 0)
function qw7(A) {
  let Q = new Map;
  if (!A.trim()) return Q;
  let B = A.split(/^diff --git /m).filter(Boolean);
  for (let G of B) {
    if (Q.size >= sS0) break;
    if (G.length > zw7) continue;
    let Z = G.split(`
`),
      Y = Z[0]?.match(/^a\/(.+?) b\/(.+)$/);
    if (!Y) continue;
    let J = Y[2] ?? Y[1] ?? "",
      X = [],
      I = null,
      D = 0;
    for (let W = 1; W < Z.length; W++) {
      let K = Z[W] ?? "",
        V = K.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (V) {
        if (I) X.push(I);
        I = {
          oldStart: parseInt(V[1] ?? "0", 10),
          oldLines: parseInt(V[2] ?? "1", 10),
          newStart: parseInt(V[3] ?? "0", 10),
          newLines: parseInt(V[4] ?? "1", 10),
          lines: []
        };
        continue
      }
      if (K.startsWith("index ") || K.startsWith("---") || K.startsWith("+++") || K.startsWith("new file") || K.startsWith("deleted file") || K.startsWith("old mode") || K.startsWith("new mode") || K.startsWith("Binary files")) continue;
      if (I && (K.startsWith("+") || K.startsWith("-") || K.startsWith(" ") || K === "")) {
        if (D >= $w7) continue;
        I.lines.push("" + K), D++
      }
    }
    if (I) X.push(I);
    if (X.length > 0) Q.set(J, X)
  }
  return Q
}
// @from(Ln 453560, Col 0)
async function dK9() {
  let A = await dBB(o1());
  if (!A) return !1;
  return (await Promise.all(["MERGE_HEAD", "REBASE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"].map((G) => Hw7(Ew7(A, G)).then(() => !0).catch(() => !1)))).some(Boolean)
}
// @from(Ln 453565, Col 0)
async function Nw7(A) {
  let {
    stdout: Q,
    code: B
  } = await TQ("git", ["ls-files", "--others", "--exclude-standard"], {
    timeout: UC1,
    preserveOutputOnError: !1
  });
  if (B !== 0 || !Q.trim()) return null;
  let G = Q.trim().split(`
`).filter(Boolean);
  if (G.length === 0) return null;
  let Z = new Map;
  for (let Y of G.slice(0, A)) Z.set(Y, {
    added: 0,
    removed: 0,
    isBinary: !1,
    isUntracked: !0
  });
  return Z
}
// @from(Ln 453587, Col 0)
function ww7(A) {
  let Q = A.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/);
  if (!Q) return null;
  return {
    filesCount: parseInt(Q[1] ?? "0", 10),
    linesAdded: parseInt(Q[2] ?? "0", 10),
    linesRemoved: parseInt(Q[3] ?? "0", 10)
  }
}
// @from(Ln 453596, Col 4)
UC1 = 5000
// @from(Ln 453597, Col 2)
sS0 = 50
// @from(Ln 453598, Col 2)
zw7 = 1e6
// @from(Ln 453599, Col 2)
$w7 = 400
// @from(Ln 453600, Col 2)
Cw7 = 500
// @from(Ln 453601, Col 4)
tS0 = w(() => {
  V2();
  t4();
  ZI()
})
// @from(Ln 453607, Col 0)
function Mw7(A, Q) {
  if (A === Q) return !0;
  if (!A || !Q) return !1;
  return A.filesCount === Q.filesCount && A.linesAdded === Q.linesAdded && A.linesRemoved === Q.linesRemoved
}
// @from(Ln 453613, Col 0)
function Rw7(A, Q) {
  if (A.size !== Q.size) return !1;
  for (let [B, G] of A) {
    let Z = Q.get(B);
    if (!Z) return !1;
    if (G.added !== Z.added || G.removed !== Z.removed || G.isBinary !== Z.isBinary) return !1
  }
  return !0
}
// @from(Ln 453623, Col 0)
function _w7(A, Q, B) {
  let G = B?.stats ?? null,
    Z = B?.perFileStats ?? new Map;
  if (!Mw7(A, G)) return !0;
  if (!Rw7(Q, Z)) return !0;
  return !1
}