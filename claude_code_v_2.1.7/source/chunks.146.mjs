
// @from(Ln 432981, Col 0)
function Y$1() {
  return {
    version: J$1,
    lastComputedDate: null,
    dailyActivity: [],
    dailyModelTokens: [],
    modelUsage: {},
    totalSessions: 0,
    totalMessages: 0,
    longestSession: null,
    firstSessionDate: null,
    hourCounts: {}
  }
}
// @from(Ln 432996, Col 0)
function dT0() {
  let A = vA(),
    Q = VY9();
  try {
    if (!A.existsSync(Q)) return k("Stats cache does not exist, returning empty cache"), Y$1();
    let B = A.readFileSync(Q, {
        encoding: "utf-8"
      }),
      G = AQ(B);
    if (G.version !== J$1) return k(`Stats cache version mismatch (got ${G.version}, expected ${J$1}), returning empty cache`), Y$1();
    if (!Array.isArray(G.dailyActivity) || !Array.isArray(G.dailyModelTokens) || typeof G.totalSessions !== "number" || typeof G.totalMessages !== "number") return k("Stats cache has invalid structure, returning empty cache"), Y$1();
    return G
  } catch (B) {
    return k(`Failed to load stats cache: ${B instanceof Error?B.message:String(B)}`), Y$1()
  }
}
// @from(Ln 433013, Col 0)
function C8A(A) {
  let Q = vA(),
    B = VY9(),
    G = `${B}.${FE7(8).toString("hex")}.tmp`;
  try {
    let Z = zQ();
    if (!Q.existsSync(Z)) Q.mkdirSync(Z);
    let Y = eA(A, null, 2);
    bB(G, Y, {
      encoding: "utf-8",
      mode: 384,
      flush: !0
    }), Q.renameSync(G, B), k(`Stats cache saved successfully (lastComputedDate: ${A.lastComputedDate})`)
  } catch (Z) {
    e(Z);
    try {
      if (Q.existsSync(G)) Q.unlinkSync(G)
    } catch {}
  }
}
// @from(Ln 433034, Col 0)
function $uA(A, Q, B) {
  let G = new Map;
  for (let K of A.dailyActivity) G.set(K.date, {
    ...K
  });
  for (let K of Q.dailyActivity) {
    let V = G.get(K.date);
    if (V) V.messageCount += K.messageCount, V.sessionCount += K.sessionCount, V.toolCallCount += K.toolCallCount;
    else G.set(K.date, {
      ...K
    })
  }
  let Z = new Map;
  for (let K of A.dailyModelTokens) Z.set(K.date, {
    ...K.tokensByModel
  });
  for (let K of Q.dailyModelTokens) {
    let V = Z.get(K.date);
    if (V)
      for (let [F, H] of Object.entries(K.tokensByModel)) V[F] = (V[F] || 0) + H;
    else Z.set(K.date, {
      ...K.tokensByModel
    })
  }
  let Y = {
    ...A.modelUsage
  };
  for (let [K, V] of Object.entries(Q.modelUsage))
    if (Y[K]) Y[K] = {
      inputTokens: Y[K].inputTokens + V.inputTokens,
      outputTokens: Y[K].outputTokens + V.outputTokens,
      cacheReadInputTokens: Y[K].cacheReadInputTokens + V.cacheReadInputTokens,
      cacheCreationInputTokens: Y[K].cacheCreationInputTokens + V.cacheCreationInputTokens,
      webSearchRequests: Y[K].webSearchRequests + V.webSearchRequests,
      costUSD: Y[K].costUSD + V.costUSD,
      contextWindow: Math.max(Y[K].contextWindow, V.contextWindow),
      maxOutputTokens: Math.max(Y[K].maxOutputTokens, V.maxOutputTokens)
    };
    else Y[K] = {
      ...V
    };
  let J = {
    ...A.hourCounts
  };
  for (let [K, V] of Object.entries(Q.hourCounts)) {
    let F = parseInt(K, 10);
    J[F] = (J[F] || 0) + V
  }
  let X = A.totalSessions + Q.sessionStats.length,
    I = A.totalMessages + Q.sessionStats.reduce((K, V) => K + V.messageCount, 0),
    D = A.longestSession;
  for (let K of Q.sessionStats)
    if (!D || K.duration > D.duration) D = K;
  let W = A.firstSessionDate;
  for (let K of Q.sessionStats)
    if (!W || K.timestamp < W) W = K.timestamp;
  return {
    version: J$1,
    lastComputedDate: B,
    dailyActivity: Array.from(G.values()).sort((K, V) => K.date.localeCompare(V.date)),
    dailyModelTokens: Array.from(Z.entries()).map(([K, V]) => ({
      date: K,
      tokensByModel: V
    })).sort((K, V) => K.date.localeCompare(V.date)),
    modelUsage: Y,
    totalSessions: X,
    totalMessages: I,
    longestSession: D,
    firstSessionDate: W,
    hourCounts: J
  }
}
// @from(Ln 433107, Col 0)
function Zh(A) {
  let B = A.toISOString().split("T")[0];
  if (!B) throw Error("Invalid ISO date string");
  return B
}
// @from(Ln 433113, Col 0)
function FY9() {
  return Zh(new Date)
}
// @from(Ln 433117, Col 0)
function cT0() {
  let A = new Date;
  return A.setDate(A.getDate() - 1), Zh(A)
}
// @from(Ln 433122, Col 0)
function D$A(A, Q) {
  return A < Q
}
// @from(Ln 433125, Col 4)
J$1 = 1
// @from(Ln 433126, Col 2)
HE7 = "stats-cache.json"
// @from(Ln 433127, Col 2)
Z$1 = null
// @from(Ln 433128, Col 4)
pT0 = w(() => {
  fQ();
  DQ();
  A0();
  T1();
  v1();
  A0()
})
// @from(Ln 433140, Col 0)
async function W$A(A, Q = {}) {
  let {
    fromDate: B,
    toDate: G
  } = Q, Z = vA(), Y = new Map, J = new Map, X = [], I = new Map, D = 0, W = {}, K = 20;
  for (let V = 0; V < A.length; V += K) {
    let F = A.slice(V, V + K),
      H = await Promise.all(F.map(async (E) => {
        try {
          if (B) try {
            let $ = Z.statSync(E),
              O = Zh($.mtime);
            if (D$A(O, B)) return {
              sessionFile: E,
              entries: null,
              error: null,
              skipped: !0
            }
          } catch {}
          let z = await Fg(E);
          return {
            sessionFile: E,
            entries: z,
            error: null,
            skipped: !1
          }
        } catch (z) {
          return {
            sessionFile: E,
            entries: null,
            error: z,
            skipped: !1
          }
        }
      }));
    for (let {
        sessionFile: E,
        entries: z,
        error: $,
        skipped: O
      }
      of H) {
      if (O) continue;
      if ($ || !z) {
        k(`Failed to read session file ${E}: ${$ instanceof Error?$.message:String($)}`);
        continue
      }
      let L = EE7(E, ".jsonl"),
        M = [];
      for (let y of z)
        if (y.type === "user" || y.type === "assistant" || y.type === "attachment" || y.type === "system") M.push(y);
      if (M.length === 0) continue;
      let _ = M.filter((y) => !y.isSidechain);
      if (_.length === 0) continue;
      let j = _[0],
        x = _[_.length - 1],
        b = new Date(j.timestamp),
        S = new Date(x.timestamp),
        u = Zh(b);
      if (B && D$A(u, B)) continue;
      if (G && D$A(G, u)) continue;
      let f = S.getTime() - b.getTime();
      X.push({
        sessionId: L,
        duration: f,
        messageCount: _.length,
        timestamp: j.timestamp
      }), D += _.length;
      let AA = Y.get(u) || {
        date: u,
        messageCount: 0,
        sessionCount: 0,
        toolCallCount: 0
      };
      AA.sessionCount++, AA.messageCount += _.length, Y.set(u, AA);
      let n = b.getHours();
      I.set(n, (I.get(n) || 0) + 1);
      for (let y of _)
        if (y.type === "assistant") {
          let p = y.message?.content;
          if (Array.isArray(p)) {
            for (let GA of p)
              if (GA.type === "tool_use") {
                let WA = Y.get(u);
                WA.toolCallCount++
              }
          }
          if (y.message?.usage) {
            let GA = y.message.usage,
              WA = y.message.model || "unknown";
            if (WA === EKA) continue;
            if (!W[WA]) W[WA] = {
              inputTokens: 0,
              outputTokens: 0,
              cacheReadInputTokens: 0,
              cacheCreationInputTokens: 0,
              webSearchRequests: 0,
              costUSD: 0,
              contextWindow: 0,
              maxOutputTokens: 0
            };
            W[WA].inputTokens += GA.input_tokens || 0, W[WA].outputTokens += GA.output_tokens || 0, W[WA].cacheReadInputTokens += GA.cache_read_input_tokens || 0, W[WA].cacheCreationInputTokens += GA.cache_creation_input_tokens || 0;
            let MA = (GA.input_tokens || 0) + (GA.output_tokens || 0);
            if (MA > 0) {
              let TA = J.get(u) || {};
              TA[WA] = (TA[WA] || 0) + MA, J.set(u, TA)
            }
          }
        }
    }
  }
  return {
    dailyActivity: Array.from(Y.values()).sort((V, F) => V.date.localeCompare(F.date)),
    dailyModelTokens: Array.from(J.entries()).map(([V, F]) => ({
      date: V,
      tokensByModel: F
    })).sort((V, F) => V.date.localeCompare(F.date)),
    modelUsage: W,
    sessionStats: X,
    hourCounts: Object.fromEntries(I),
    totalMessages: D
  }
}
// @from(Ln 433264, Col 0)
function lT0() {
  let A = wp(),
    Q = vA();
  try {
    Q.statSync(A)
  } catch {
    return []
  }
  let B = Q.readdirSync(A).filter((Z) => Z.isDirectory()).map((Z) => X$1(A, Z.name)),
    G = [];
  for (let Z of B) try {
    let Y = Q.readdirSync(Z),
      J = Y.filter((I) => I.isFile() && I.name.endsWith(".jsonl")).map((I) => X$1(Z, I.name));
    G.push(...J);
    let X = Y.filter((I) => I.isDirectory());
    for (let I of X) {
      let D = X$1(Z, I.name, "subagents");
      try {
        let W = Q.readdirSync(D).filter((K) => K.isFile() && K.name.endsWith(".jsonl") && K.name.startsWith("agent-")).map((K) => X$1(D, K.name));
        G.push(...W)
      } catch {}
    }
  } catch (Y) {
    k(`Failed to read project directory ${Z}: ${Y instanceof Error?Y.message:String(Y)}`);
    continue
  }
  return G
}
// @from(Ln 433293, Col 0)
function zE7(A, Q) {
  let B = new Map;
  for (let $ of A.dailyActivity) B.set($.date, {
    ...$
  });
  if (Q)
    for (let $ of Q.dailyActivity) {
      let O = B.get($.date);
      if (O) O.messageCount += $.messageCount, O.sessionCount += $.sessionCount, O.toolCallCount += $.toolCallCount;
      else B.set($.date, {
        ...$
      })
    }
  let G = new Map;
  for (let $ of A.dailyModelTokens) G.set($.date, {
    ...$.tokensByModel
  });
  if (Q)
    for (let $ of Q.dailyModelTokens) {
      let O = G.get($.date);
      if (O)
        for (let [L, M] of Object.entries($.tokensByModel)) O[L] = (O[L] || 0) + M;
      else G.set($.date, {
        ...$.tokensByModel
      })
    }
  let Z = {
    ...A.modelUsage
  };
  if (Q)
    for (let [$, O] of Object.entries(Q.modelUsage))
      if (Z[$]) Z[$] = {
        inputTokens: Z[$].inputTokens + O.inputTokens,
        outputTokens: Z[$].outputTokens + O.outputTokens,
        cacheReadInputTokens: Z[$].cacheReadInputTokens + O.cacheReadInputTokens,
        cacheCreationInputTokens: Z[$].cacheCreationInputTokens + O.cacheCreationInputTokens,
        webSearchRequests: Z[$].webSearchRequests + O.webSearchRequests,
        costUSD: Z[$].costUSD + O.costUSD,
        contextWindow: Math.max(Z[$].contextWindow, O.contextWindow),
        maxOutputTokens: Math.max(Z[$].maxOutputTokens, O.maxOutputTokens)
      };
      else Z[$] = {
        ...O
      };
  let Y = new Map;
  for (let [$, O] of Object.entries(A.hourCounts)) Y.set(parseInt($, 10), O);
  if (Q)
    for (let [$, O] of Object.entries(Q.hourCounts)) {
      let L = parseInt($, 10);
      Y.set(L, (Y.get(L) || 0) + O)
    }
  let J = Array.from(B.values()).sort(($, O) => $.date.localeCompare(O.date)),
    X = zY9(J),
    I = Array.from(G.entries()).map(([$, O]) => ({
      date: $,
      tokensByModel: O
    })).sort(($, O) => $.date.localeCompare(O.date)),
    D = A.totalSessions + (Q?.sessionStats.length || 0),
    W = A.totalMessages + (Q?.totalMessages || 0),
    K = A.longestSession;
  if (Q) {
    for (let $ of Q.sessionStats)
      if (!K || $.duration > K.duration) K = $
  }
  let V = A.firstSessionDate,
    F = null;
  if (Q)
    for (let $ of Q.sessionStats) {
      if (!V || $.timestamp < V) V = $.timestamp;
      if (!F || $.timestamp > F) F = $.timestamp
    }
  if (!F && J.length > 0) F = J[J.length - 1].date;
  let H = J.length > 0 ? J.reduce(($, O) => O.messageCount > $.messageCount ? O : $).date : null,
    E = Y.size > 0 ? Array.from(Y.entries()).reduce(($, [O, L]) => L > $[1] ? [O, L] : $)[0] : null,
    z = V && F ? Math.ceil((new Date(F).getTime() - new Date(V).getTime()) / 86400000) + 1 : 0;
  return {
    totalSessions: D,
    totalMessages: W,
    totalDays: z,
    activeDays: B.size,
    streaks: X,
    dailyActivity: J,
    dailyModelTokens: I,
    longestSession: K,
    modelUsage: Z,
    firstSessionDate: V,
    lastSessionDate: F,
    peakActivityDay: H,
    peakActivityHour: E
  }
}
// @from(Ln 433384, Col 0)
async function $E7() {
  let A = lT0();
  if (A.length === 0) return $Y9();
  let Q = await mT0(async () => {
      let Z = dT0(),
        Y = cT0(),
        J = Z;
      if (!Z.lastComputedDate) {
        k("Stats cache empty, processing all historical data");
        let X = await W$A(A, {
          toDate: Y
        });
        if (X.sessionStats.length > 0) J = $uA(Z, X, Y), C8A(J)
      } else if (D$A(Z.lastComputedDate, Y)) {
        let X = EY9(Z.lastComputedDate);
        k(`Stats cache stale (${Z.lastComputedDate}), processing ${X} to ${Y}`);
        let I = await W$A(A, {
          fromDate: X,
          toDate: Y
        });
        if (I.sessionStats.length > 0 || I.dailyActivity.length > 0) J = $uA(Z, I, Y), C8A(J);
        else J = {
          ...Z,
          lastComputedDate: Y
        }, C8A(J)
      }
      return J
    }),
    B = FY9(),
    G = await W$A(A, {
      fromDate: B,
      toDate: B
    });
  return zE7(Q, G)
}
// @from(Ln 433419, Col 0)
async function iT0(A) {
  if (A === "all") return $E7();
  let Q = lT0();
  if (Q.length === 0) return $Y9();
  let B = new Date,
    G = A === "7d" ? 7 : 30,
    Z = new Date(B);
  Z.setDate(B.getDate() - G + 1);
  let Y = Zh(Z),
    J = await W$A(Q, {
      fromDate: Y
    });
  return CE7(J)
}
// @from(Ln 433434, Col 0)
function CE7(A) {
  let Q = [...A.dailyActivity].sort((K, V) => K.date.localeCompare(V.date)),
    B = [...A.dailyModelTokens].sort((K, V) => K.date.localeCompare(V.date)),
    G = zY9(Q),
    Z = null;
  for (let K of A.sessionStats)
    if (!Z || K.duration > Z.duration) Z = K;
  let Y = null,
    J = null;
  for (let K of A.sessionStats) {
    if (!Y || K.timestamp < Y) Y = K.timestamp;
    if (!J || K.timestamp > J) J = K.timestamp
  }
  let X = Q.length > 0 ? Q.reduce((K, V) => V.messageCount > K.messageCount ? V : K).date : null,
    I = Object.entries(A.hourCounts),
    D = I.length > 0 ? parseInt(I.reduce((K, [V, F]) => F > parseInt(K[1].toString()) ? [V, F] : K)[0], 10) : null,
    W = Y && J ? Math.ceil((new Date(J).getTime() - new Date(Y).getTime()) / 86400000) + 1 : 0;
  return {
    totalSessions: A.sessionStats.length,
    totalMessages: A.totalMessages,
    totalDays: W,
    activeDays: A.dailyActivity.length,
    streaks: G,
    dailyActivity: Q,
    dailyModelTokens: B,
    longestSession: Z,
    modelUsage: A.modelUsage,
    firstSessionDate: Y,
    lastSessionDate: J,
    peakActivityDay: X,
    peakActivityHour: D
  }
}
// @from(Ln 433467, Col 0)
async function HY9() {
  let A = lT0();
  if (A.length === 0) return;
  await mT0(async () => {
    let Q = dT0(),
      B = cT0();
    if (Q.lastComputedDate === B) {
      k("Stats cache is up to date");
      return
    }
    if (!Q.lastComputedDate) {
      k("Stats cache empty, processing all historical data in background");
      let G = await W$A(A, {
        toDate: B
      });
      if (G.sessionStats.length > 0) {
        let Z = $uA(Q, G, B);
        C8A(Z), k(`Stats cache updated with ${G.sessionStats.length} sessions`)
      }
    } else if (D$A(Q.lastComputedDate, B)) {
      let G = EY9(Q.lastComputedDate);
      k(`Stats cache stale (${Q.lastComputedDate}), processing ${G} to ${B} in background`);
      let Z = await W$A(A, {
        fromDate: G,
        toDate: B
      });
      if (Z.sessionStats.length > 0 || Z.dailyActivity.length > 0) {
        let Y = $uA(Q, Z, B);
        C8A(Y), k(`Stats cache updated with ${Z.sessionStats.length} new sessions`)
      } else {
        let Y = {
          ...Q,
          lastComputedDate: B
        };
        C8A(Y), k("Stats cache lastComputedDate updated (no new data)")
      }
    }
  })
}
// @from(Ln 433507, Col 0)
function EY9(A) {
  let Q = new Date(A);
  return Q.setDate(Q.getDate() + 1), Zh(Q)
}
// @from(Ln 433512, Col 0)
function zY9(A) {
  if (A.length === 0) return {
    currentStreak: 0,
    longestStreak: 0,
    currentStreakStart: null,
    longestStreakStart: null,
    longestStreakEnd: null
  };
  let Q = new Date;
  Q.setHours(0, 0, 0, 0);
  let B = 0,
    G = null,
    Z = new Date(Q),
    Y = new Set(A.map((D) => D.date));
  while (!0) {
    let D = Zh(Z);
    if (!Y.has(D)) break;
    B++, G = D, Z.setDate(Z.getDate() - 1)
  }
  let J = 0,
    X = null,
    I = null;
  if (A.length > 0) {
    let D = Array.from(Y).sort(),
      W = 1,
      K = D[0];
    for (let V = 1; V < D.length; V++) {
      let F = new Date(D[V - 1]),
        H = new Date(D[V]);
      if (Math.round((H.getTime() - F.getTime()) / 86400000) === 1) W++;
      else {
        if (W > J) J = W, X = K, I = D[V - 1];
        W = 1, K = D[V]
      }
    }
    if (W > J) J = W, X = K, I = D[D.length - 1]
  }
  return {
    currentStreak: B,
    longestStreak: J,
    currentStreakStart: G,
    longestStreakStart: X,
    longestStreakEnd: I
  }
}
// @from(Ln 433558, Col 0)
function $Y9() {
  return {
    totalSessions: 0,
    totalMessages: 0,
    totalDays: 0,
    activeDays: 0,
    streaks: {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStart: null,
      longestStreakStart: null,
      longestStreakEnd: null
    },
    dailyActivity: [],
    dailyModelTokens: [],
    longestSession: null,
    modelUsage: {},
    firstSessionDate: null,
    lastSessionDate: null,
    peakActivityDay: null,
    peakActivityHour: null
  }
}
// @from(Ln 433581, Col 4)
nT0 = w(() => {
  d4();
  DQ();
  vI();
  T1();
  pT0();
  tQ()
})
// @from(Ln 433590, Col 0)
function UE7(A) {
  let Q = A.map((B) => B.messageCount).filter((B) => B > 0).sort((B, G) => B - G);
  if (Q.length === 0) return null;
  return {
    p25: Q[Math.floor(Q.length * 0.25)],
    p50: Q[Math.floor(Q.length * 0.5)],
    p75: Q[Math.floor(Q.length * 0.75)]
  }
}
// @from(Ln 433600, Col 0)
function aT0(A, Q = {}) {
  let {
    terminalWidth: B = 80,
    showMonthLabels: G = !0
  } = Q, Z = 4, Y = B - 4, J = Math.min(52, Math.max(10, Y)), X = new Map;
  for (let O of A) X.set(O.date, O);
  let I = UE7(A),
    D = new Date;
  D.setHours(0, 0, 0, 0);
  let W = new Date(D);
  W.setDate(D.getDate() - D.getDay());
  let K = new Date(W);
  K.setDate(K.getDate() - (J - 1) * 7);
  let V = Array.from({
      length: 7
    }, () => Array(J).fill("")),
    F = [],
    H = -1,
    E = new Date(K);
  for (let O = 0; O < J; O++)
    for (let L = 0; L < 7; L++) {
      if (E > D) {
        V[L][O] = " ", E.setDate(E.getDate() + 1);
        continue
      }
      let M = Zh(E),
        _ = X.get(M);
      if (L === 0) {
        let x = E.getMonth();
        if (x !== H) F.push({
          month: x,
          week: O
        }), H = x
      }
      let j = qE7(_?.messageCount || 0, I);
      V[L][O] = NE7(j), E.setDate(E.getDate() + 1)
    }
  let z = [];
  if (G) {
    let O = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      L = F.map((j) => j.month),
      M = Math.floor(J / Math.max(L.length, 1)),
      _ = L.map((j) => O[j].padEnd(M)).join("");
    z.push("    " + _)
  }
  let $ = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let O = 0; O < 7; O++) {
    let M = ([1, 3, 5].includes(O) ? $[O].padEnd(3) : "   ") + " " + V[O].join("");
    z.push(M)
  }
  return z.push(""), z.push("    Less " + [ye("░"), ye("▒"), ye("▓"), ye("█")].join(" ") + " More"), z.join(`
`)
}
// @from(Ln 433654, Col 0)
function qE7(A, Q) {
  if (A === 0 || !Q) return 0;
  if (A >= Q.p75) return 4;
  if (A >= Q.p50) return 3;
  if (A >= Q.p25) return 2;
  return 1
}
// @from(Ln 433662, Col 0)
function NE7(A) {
  switch (A) {
    case 0:
      return I1.gray("·");
    case 1:
      return ye("░");
    case 2:
      return ye("▒");
    case 3:
      return ye("▓");
    case 4:
      return ye("█");
    default:
      return I1.gray("·")
  }
}
// @from(Ln 433678, Col 4)
ye
// @from(Ln 433679, Col 4)
CY9 = w(() => {
  pT0();
  Z3();
  ye = I1.hex("#da7756")
})
// @from(Ln 433685, Col 0)
function zw(A) {
  if (quA === Lp.length) Lp.push(Lp.length + 1);
  let Q = quA;
  return quA = Lp[Q], Lp[Q] = A, Q
}
// @from(Ln 433691, Col 0)
function yU(A) {
  return Lp[A]
}
// @from(Ln 433695, Col 0)
function wE7(A) {
  if (A < 132) return;
  Lp[A] = quA, quA = A
}
// @from(Ln 433700, Col 0)
function Op(A) {
  let Q = yU(A);
  return wE7(A), Q
}
// @from(Ln 433705, Col 0)
function I$1() {
  if (CuA === null || CuA.byteLength === 0) CuA = new Uint8Array(A4.memory.buffer);
  return CuA
}
// @from(Ln 433710, Col 0)
function rT0(A, Q, B) {
  if (B === void 0) {
    let X = D$1.encode(A),
      I = Q(X.length, 1) >>> 0;
    return I$1().subarray(I, I + X.length).set(X), NuA = X.length, I
  }
  let G = A.length,
    Z = Q(G, 1) >>> 0,
    Y = I$1(),
    J = 0;
  for (; J < G; J++) {
    let X = A.charCodeAt(J);
    if (X > 127) break;
    Y[Z + J] = X
  }
  if (J !== G) {
    if (J !== 0) A = A.slice(J);
    Z = B(Z, G, G = J + A.length * 3, 1) >>> 0;
    let X = I$1().subarray(Z + J, Z + G),
      I = LE7(A, X);
    J += I.written, Z = B(Z, G, J, 1) >>> 0
  }
  return NuA = J, Z
}
// @from(Ln 433735, Col 0)
function sT0(A) {
  return A === void 0 || A === null
}
// @from(Ln 433739, Col 0)
function tF() {
  if (UuA === null || UuA.byteLength === 0) UuA = new Int32Array(A4.memory.buffer);
  return UuA
}
// @from(Ln 433744, Col 0)
function W$1(A, Q) {
  return A = A >>> 0, NY9.decode(I$1().subarray(A, A + Q))
}
// @from(Ln 433748, Col 0)
function OE7(A, Q) {
  if (!(A instanceof Q)) throw Error(`expected instance of ${Q.name}`);
  return A.ptr
}
// @from(Ln 433753, Col 0)
function ME7(A, Q) {
  try {
    return A.apply(this, Q)
  } catch (B) {
    A4.__wbindgen_exn_store(zw(B))
  }
}
// @from(Ln 433760, Col 0)
async function TE7(A, Q) {
  if (typeof Response === "function" && A instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") try {
      return await WebAssembly.instantiateStreaming(A, Q)
    } catch (G) {
      if (A.headers.get("Content-Type") != "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", G);
      else throw G
    }
    let B = await A.arrayBuffer();
    return await WebAssembly.instantiate(B, Q)
  } else {
    let B = await WebAssembly.instantiate(A, Q);
    if (B instanceof WebAssembly.Instance) return {
      instance: B,
      module: A
    };
    else return B
  }
}
// @from(Ln 433780, Col 0)
function PE7() {
  let A = {};
  return A.wbg = {}, A.wbg.__wbg_new_28c511d9baebfa89 = function (Q, B) {
    let G = Error(W$1(Q, B));
    return zw(G)
  }, A.wbg.__wbindgen_memory = function () {
    let Q = A4.memory;
    return zw(Q)
  }, A.wbg.__wbg_buffer_12d079cc21e14bdb = function (Q) {
    let B = yU(Q).buffer;
    return zw(B)
  }, A.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function (Q, B, G) {
    let Z = new Uint8Array(yU(Q), B >>> 0, G >>> 0);
    return zw(Z)
  }, A.wbg.__wbindgen_object_drop_ref = function (Q) {
    Op(Q)
  }, A.wbg.__wbg_new_63b92bc8671ed464 = function (Q) {
    let B = new Uint8Array(yU(Q));
    return zw(B)
  }, A.wbg.__wbg_values_839f3396d5aac002 = function (Q) {
    let B = yU(Q).values();
    return zw(B)
  }, A.wbg.__wbg_next_196c84450b364254 = function () {
    return ME7(function (Q) {
      let B = yU(Q).next();
      return zw(B)
    }, arguments)
  }, A.wbg.__wbg_done_298b57d23c0fc80c = function (Q) {
    return yU(Q).done
  }, A.wbg.__wbg_value_d93c65011f51a456 = function (Q) {
    let B = yU(Q).value;
    return zw(B)
  }, A.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function (Q) {
    let B;
    try {
      B = yU(Q) instanceof Uint8Array
    } catch (Z) {
      B = !1
    }
    return B
  }, A.wbg.__wbindgen_string_get = function (Q, B) {
    let G = yU(B),
      Z = typeof G === "string" ? G : void 0;
    var Y = sT0(Z) ? 0 : rT0(Z, A4.__wbindgen_malloc, A4.__wbindgen_realloc),
      J = NuA;
    tF()[Q / 4 + 1] = J, tF()[Q / 4 + 0] = Y
  }, A.wbg.__wbg_new_16b304a2cfa7ff4a = function () {
    return zw([])
  }, A.wbg.__wbindgen_string_new = function (Q, B) {
    let G = W$1(Q, B);
    return zw(G)
  }, A.wbg.__wbg_push_a5b05aedc7234f9f = function (Q, B) {
    return yU(Q).push(yU(B))
  }, A.wbg.__wbg_length_c20a40f15020d68a = function (Q) {
    return yU(Q).length
  }, A.wbg.__wbg_set_a47bac70306a19a7 = function (Q, B, G) {
    yU(Q).set(yU(B), G >>> 0)
  }, A.wbg.__wbindgen_throw = function (Q, B) {
    throw Error(W$1(Q, B))
  }, A
}
// @from(Ln 433842, Col 0)
function SE7(A, Q) {}
// @from(Ln 433844, Col 0)
function xE7(A, Q) {
  return A4 = A.exports, wY9.__wbindgen_wasm_module = Q, UuA = null, CuA = null, A4
}
// @from(Ln 433847, Col 0)
async function wY9(A) {
  if (A4 !== void 0) return A4;
  if (typeof A > "u") A = new URL("index_bg.wasm", void 0);
  let Q = PE7();
  if (typeof A === "string" || typeof Request === "function" && A instanceof Request || typeof URL === "function" && A instanceof URL) A = fetch(A);
  SE7(Q);
  let {
    instance: B,
    module: G
  } = await TE7(await A, Q);
  return xE7(B, G)
}
// @from(Ln 433860, Col 0)
function vE7(A) {
  return Object.prototype.hasOwnProperty.call(A, "fontBuffers")
}
// @from(Ln 433863, Col 4)
A4
// @from(Ln 433863, Col 8)
Lp
// @from(Ln 433863, Col 12)
quA
// @from(Ln 433863, Col 17)
NuA = 0
// @from(Ln 433864, Col 2)
CuA = null
// @from(Ln 433865, Col 2)
D$1
// @from(Ln 433865, Col 7)
LE7
// @from(Ln 433865, Col 12)
UuA = null
// @from(Ln 433866, Col 2)
NY9
// @from(Ln 433866, Col 7)
UY9
// @from(Ln 433866, Col 12)
oT0 = class A {
    static __wrap(Q) {
      Q = Q >>> 0;
      let B = Object.create(A.prototype);
      return B.__wbg_ptr = Q, UY9.register(B, B.__wbg_ptr, B), B
    }
    __destroy_into_raw() {
      let Q = this.__wbg_ptr;
      return this.__wbg_ptr = 0, UY9.unregister(this), Q
    }
    free() {
      let Q = this.__destroy_into_raw();
      A4.__wbg_bbox_free(Q)
    }
    get x() {
      return A4.__wbg_get_bbox_x(this.__wbg_ptr)
    }
    set x(Q) {
      A4.__wbg_set_bbox_x(this.__wbg_ptr, Q)
    }
    get y() {
      return A4.__wbg_get_bbox_y(this.__wbg_ptr)
    }
    set y(Q) {
      A4.__wbg_set_bbox_y(this.__wbg_ptr, Q)
    }
    get width() {
      return A4.__wbg_get_bbox_width(this.__wbg_ptr)
    }
    set width(Q) {
      A4.__wbg_set_bbox_width(this.__wbg_ptr, Q)
    }
    get height() {
      return A4.__wbg_get_bbox_height(this.__wbg_ptr)
    }
    set height(Q) {
      A4.__wbg_set_bbox_height(this.__wbg_ptr, Q)
    }
  }
// @from(Ln 433905, Col 2)
qY9
// @from(Ln 433905, Col 7)
RE7 = class A {
    static __wrap(Q) {
      Q = Q >>> 0;
      let B = Object.create(A.prototype);
      return B.__wbg_ptr = Q, qY9.register(B, B.__wbg_ptr, B), B
    }
    __destroy_into_raw() {
      let Q = this.__wbg_ptr;
      return this.__wbg_ptr = 0, qY9.unregister(this), Q
    }
    free() {
      let Q = this.__destroy_into_raw();
      A4.__wbg_renderedimage_free(Q)
    }
    get width() {
      return A4.renderedimage_width(this.__wbg_ptr) >>> 0
    }
    get height() {
      return A4.renderedimage_height(this.__wbg_ptr) >>> 0
    }
    asPng() {
      try {
        let Z = A4.__wbindgen_add_to_stack_pointer(-16);
        A4.renderedimage_asPng(Z, this.__wbg_ptr);
        var Q = tF()[Z / 4 + 0],
          B = tF()[Z / 4 + 1],
          G = tF()[Z / 4 + 2];
        if (G) throw Op(B);
        return Op(Q)
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16)
      }
    }
    get pixels() {
      let Q = A4.renderedimage_pixels(this.__wbg_ptr);
      return Op(Q)
    }
  }
// @from(Ln 433943, Col 2)
_E7
// @from(Ln 433943, Col 7)
jE7 = class {
    __destroy_into_raw() {
      let A = this.__wbg_ptr;
      return this.__wbg_ptr = 0, _E7.unregister(this), A
    }
    free() {
      let A = this.__destroy_into_raw();
      A4.__wbg_resvg_free(A)
    }
    constructor(A, Q, B) {
      try {
        let I = A4.__wbindgen_add_to_stack_pointer(-16);
        var G = sT0(Q) ? 0 : rT0(Q, A4.__wbindgen_malloc, A4.__wbindgen_realloc),
          Z = NuA;
        A4.resvg_new(I, zw(A), G, Z, sT0(B) ? 0 : zw(B));
        var Y = tF()[I / 4 + 0],
          J = tF()[I / 4 + 1],
          X = tF()[I / 4 + 2];
        if (X) throw Op(J);
        return this.__wbg_ptr = Y >>> 0, this
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16)
      }
    }
    get width() {
      return A4.resvg_width(this.__wbg_ptr)
    }
    get height() {
      return A4.resvg_height(this.__wbg_ptr)
    }
    render() {
      try {
        let G = A4.__wbindgen_add_to_stack_pointer(-16);
        A4.resvg_render(G, this.__wbg_ptr);
        var A = tF()[G / 4 + 0],
          Q = tF()[G / 4 + 1],
          B = tF()[G / 4 + 2];
        if (B) throw Op(Q);
        return RE7.__wrap(A)
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16)
      }
    }
    toString() {
      let A, Q;
      try {
        let Z = A4.__wbindgen_add_to_stack_pointer(-16);
        A4.resvg_toString(Z, this.__wbg_ptr);
        var B = tF()[Z / 4 + 0],
          G = tF()[Z / 4 + 1];
        return A = B, Q = G, W$1(B, G)
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16), A4.__wbindgen_free(A, Q, 1)
      }
    }
    innerBBox() {
      let A = A4.resvg_innerBBox(this.__wbg_ptr);
      return A === 0 ? void 0 : oT0.__wrap(A)
    }
    getBBox() {
      let A = A4.resvg_getBBox(this.__wbg_ptr);
      return A === 0 ? void 0 : oT0.__wrap(A)
    }
    cropByBBox(A) {
      OE7(A, oT0), A4.resvg_cropByBBox(this.__wbg_ptr, A.__wbg_ptr)
    }
    imagesToResolve() {
      try {
        let G = A4.__wbindgen_add_to_stack_pointer(-16);
        A4.resvg_imagesToResolve(G, this.__wbg_ptr);
        var A = tF()[G / 4 + 0],
          Q = tF()[G / 4 + 1],
          B = tF()[G / 4 + 2];
        if (B) throw Op(Q);
        return Op(A)
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16)
      }
    }
    resolveImage(A, Q) {
      try {
        let Z = A4.__wbindgen_add_to_stack_pointer(-16),
          Y = rT0(A, A4.__wbindgen_malloc, A4.__wbindgen_realloc),
          J = NuA;
        A4.resvg_resolveImage(Z, this.__wbg_ptr, Y, J, zw(Q));
        var B = tF()[Z / 4 + 0],
          G = tF()[Z / 4 + 1];
        if (G) throw Op(B)
      } finally {
        A4.__wbindgen_add_to_stack_pointer(16)
      }
    }
  }
// @from(Ln 434036, Col 2)
yE7
// @from(Ln 434036, Col 7)
tT0 = !1
// @from(Ln 434037, Col 2)
eT0 = async (A) => {
    if (tT0) throw Error("Already initialized. The `initWasm()` function can be used only once.");
    await yE7(await A), tT0 = !0
  }
// @from(Ln 434040, Col 5)
LY9
// @from(Ln 434041, Col 4)
OY9 = w(() => {
  Lp = Array(128).fill(void 0);
  Lp.push(void 0, null, !0, !1);
  quA = Lp.length;
  D$1 = typeof TextEncoder < "u" ? new TextEncoder("utf-8") : {
    encode: () => {
      throw Error("TextEncoder not available")
    }
  }, LE7 = typeof D$1.encodeInto === "function" ? function (A, Q) {
    return D$1.encodeInto(A, Q)
  } : function (A, Q) {
    let B = D$1.encode(A);
    return Q.set(B), {
      read: A.length,
      written: B.length
    }
  };
  NY9 = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
    ignoreBOM: !0,
    fatal: !0
  }) : {
    decode: () => {
      throw Error("TextDecoder not available")
    }
  };
  if (typeof TextDecoder < "u") NY9.decode();
  UY9 = typeof FinalizationRegistry > "u" ? {
    register: () => {},
    unregister: () => {}
  } : new FinalizationRegistry((A) => A4.__wbg_bbox_free(A >>> 0)), qY9 = typeof FinalizationRegistry > "u" ? {
    register: () => {},
    unregister: () => {}
  } : new FinalizationRegistry((A) => A4.__wbg_renderedimage_free(A >>> 0)), _E7 = typeof FinalizationRegistry > "u" ? {
    register: () => {},
    unregister: () => {}
  } : new FinalizationRegistry((A) => A4.__wbg_resvg_free(A >>> 0));
  yE7 = wY9, LY9 = class extends jE7 {
    constructor(A, Q) {
      if (!tT0) throw Error("Wasm has not been initialized. Call `initWasm()` function.");
      let B = Q?.font;
      if (!!B && vE7(B)) {
        let G = {
          ...Q,
          font: {
            ...B,
            fontBuffers: void 0
          }
        };
        super(A, JSON.stringify(G), B.fontBuffers)
      } else super(A, JSON.stringify(Q))
    }
  }
})
// @from(Ln 434095, Col 0)
function kE7(A) {
  let Q = [],
    B = A.split(`
`);
  for (let G of B) {
    let Z = [],
      Y = U8A,
      J = !1,
      X = 0;
    while (X < G.length) {
      if (G[X] === "\x1B" && G[X + 1] === "[") {
        let W = X + 2;
        while (W < G.length && !/[A-Za-z]/.test(G[W])) W++;
        if (G[W] === "m") {
          let K = G.slice(X + 2, W).split(";").map(Number),
            V = 0;
          while (V < K.length) {
            let F = K[V];
            if (F === 0) Y = U8A, J = !1;
            else if (F === 1) J = !0;
            else if (F >= 30 && F <= 37) Y = MY9[F] || U8A;
            else if (F >= 90 && F <= 97) Y = MY9[F] || U8A;
            else if (F === 39) Y = U8A;
            else if (F === 38) {
              if (K[V + 1] === 5 && K[V + 2] !== void 0) {
                let H = K[V + 2];
                Y = bE7(H), V += 2
              } else if (K[V + 1] === 2 && K[V + 2] !== void 0 && K[V + 3] !== void 0 && K[V + 4] !== void 0) Y = {
                r: K[V + 2],
                g: K[V + 3],
                b: K[V + 4]
              }, V += 4
            }
            V++
          }
        }
        X = W + 1;
        continue
      }
      let I = X;
      while (X < G.length && G[X] !== "\x1B") X++;
      let D = G.slice(I, X);
      if (D) Z.push({
        text: D,
        color: Y,
        bold: J
      })
    }
    if (Z.length === 0) Z.push({
      text: "",
      color: U8A,
      bold: !1
    });
    Q.push(Z)
  }
  return Q
}
// @from(Ln 434153, Col 0)
function bE7(A) {
  if (A < 16) return [{
    r: 0,
    g: 0,
    b: 0
  }, {
    r: 128,
    g: 0,
    b: 0
  }, {
    r: 0,
    g: 128,
    b: 0
  }, {
    r: 128,
    g: 128,
    b: 0
  }, {
    r: 0,
    g: 0,
    b: 128
  }, {
    r: 128,
    g: 0,
    b: 128
  }, {
    r: 0,
    g: 128,
    b: 128
  }, {
    r: 192,
    g: 192,
    b: 192
  }, {
    r: 128,
    g: 128,
    b: 128
  }, {
    r: 255,
    g: 0,
    b: 0
  }, {
    r: 0,
    g: 255,
    b: 0
  }, {
    r: 255,
    g: 255,
    b: 0
  }, {
    r: 0,
    g: 0,
    b: 255
  }, {
    r: 255,
    g: 0,
    b: 255
  }, {
    r: 0,
    g: 255,
    b: 255
  }, {
    r: 255,
    g: 255,
    b: 255
  }][A] || U8A;
  if (A < 232) {
    let B = A - 16,
      G = Math.floor(B / 36),
      Z = Math.floor(B % 36 / 6),
      Y = B % 6;
    return {
      r: G === 0 ? 0 : 55 + G * 40,
      g: Z === 0 ? 0 : 55 + Z * 40,
      b: Y === 0 ? 0 : 55 + Y * 40
    }
  }
  let Q = (A - 232) * 10 + 8;
  return {
    r: Q,
    g: Q,
    b: Q
  }
}
// @from(Ln 434238, Col 0)
function fE7(A) {
  return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}
// @from(Ln 434242, Col 0)
function RY9(A, Q = {}) {
  let {
    fontFamily: B = "Menlo, Monaco, monospace",
    fontSize: G = 14,
    lineHeight: Z = 22,
    paddingX: Y = 24,
    paddingY: J = 24,
    backgroundColor: X = `rgb(${AP0.r}, ${AP0.g}, ${AP0.b})`,
    borderRadius: I = 8
  } = Q, D = kE7(A);
  while (D.length > 0 && D[D.length - 1].every((E) => E.text.trim() === "")) D.pop();
  let W = G * 0.6,
    K = Math.max(...D.map((E) => E.reduce((z, $) => z + $.text.length, 0))),
    V = Math.ceil(K * W + Y * 2),
    F = D.length * Z + J * 2,
    H = `<svg xmlns="http://www.w3.org/2000/svg" width="${V}" height="${F}" viewBox="0 0 ${V} ${F}">
`;
  H += `  <rect width="100%" height="100%" fill="${X}" rx="${I}" ry="${I}"/>
`, H += `  <style>
`, H += `    text { font-family: ${B}; font-size: ${G}px; white-space: pre; }
`, H += `    .b { font-weight: bold; }
`, H += `  </style>
`;
  for (let E = 0; E < D.length; E++) {
    let z = D[E],
      $ = J + (E + 1) * Z - (Z - G) / 2;
    H += `  <text x="${Y}" y="${$}" xml:space="preserve">`;
    for (let O of z) {
      if (!O.text) continue;
      let L = `rgb(${O.color.r}, ${O.color.g}, ${O.color.b})`,
        M = O.bold ? ' class="b"' : "";
      H += `<tspan fill="${L}"${M}>${fE7(O.text)}</tspan>`
    }
    H += `</text>
`
  }
  return H += "</svg>", H
}
// @from(Ln 434280, Col 4)
MY9
// @from(Ln 434280, Col 9)
U8A
// @from(Ln 434280, Col 14)
AP0
// @from(Ln 434281, Col 4)
_Y9 = w(() => {
  MY9 = {
    30: {
      r: 0,
      g: 0,
      b: 0
    },
    31: {
      r: 205,
      g: 49,
      b: 49
    },
    32: {
      r: 13,
      g: 188,
      b: 121
    },
    33: {
      r: 229,
      g: 229,
      b: 16
    },
    34: {
      r: 36,
      g: 114,
      b: 200
    },
    35: {
      r: 188,
      g: 63,
      b: 188
    },
    36: {
      r: 17,
      g: 168,
      b: 205
    },
    37: {
      r: 229,
      g: 229,
      b: 229
    },
    90: {
      r: 102,
      g: 102,
      b: 102
    },
    91: {
      r: 241,
      g: 76,
      b: 76
    },
    92: {
      r: 35,
      g: 209,
      b: 139
    },
    93: {
      r: 245,
      g: 245,
      b: 67
    },
    94: {
      r: 59,
      g: 142,
      b: 234
    },
    95: {
      r: 214,
      g: 112,
      b: 214
    },
    96: {
      r: 41,
      g: 184,
      b: 219
    },
    97: {
      r: 255,
      g: 255,
      b: 255
    }
  }, U8A = {
    r: 229,
    g: 229,
    b: 229
  }, AP0 = {
    r: 30,
    g: 30,
    b: 30
  }
})
// @from(Ln 434390, Col 0)
function dE7() {
  let A = jY9(mE7(import.meta.url));
  return BP0(jY9(BfA()), "resvg.wasm")
}
// @from(Ln 434395, Col 0)
function cE7() {
  if (!LG() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
  for (let A of Bun.embeddedFiles) {
    let Q = A.name;
    if (Q && Q.endsWith("resvg.wasm")) return A
  }
  return null
}
// @from(Ln 434403, Col 0)
async function pE7() {
  if (QP0) return;
  if (LG()) {
    let B = cE7();
    if (B) {
      let G = await B.arrayBuffer();
      await eT0(new Uint8Array(G)), QP0 = !0;
      return
    }
  }
  let A = dE7();
  if (!GP0(A)) throw Error(`resvg WASM file not found at: ${A}`);
  let Q = TY9(A);
  await eT0(Q), QP0 = !0
}
// @from(Ln 434418, Col 0)
async function lE7() {
  if (K$1) return [K$1];
  let A = $Q(),
    Q = [];
  if (A === "macos") Q.push("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Monaco.dfont", "/Library/Fonts/Courier New.ttf");
  else if (A === "linux") Q.push("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/TTF/DejaVuSansMono.ttf", "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf");
  else if (A === "windows") Q.push("C:\\Windows\\Fonts\\consola.ttf", "C:\\Windows\\Fonts\\cour.ttf");
  for (let B of Q) try {
    if (GP0(B)) return K$1 = TY9(B), [K$1]
  } catch {}
  return []
}
// @from(Ln 434430, Col 0)
async function PY9(A, Q) {
  if (!LG()) return {
    success: !1,
    message: "Screenshot copying is not available in this build"
  };
  try {
    await pE7();
    let B = BP0(uE7(), "claude-code-screenshots");
    if (!GP0(B)) gE7(B, {
      recursive: !0
    });
    let G = Date.now(),
      Z = RY9(A, Q),
      Y = BP0(B, `screenshot-${G}.png`),
      J = await lE7(),
      D = new LY9(Z, {
        fitTo: {
          mode: "zoom",
          value: 4
        },
        font: {
          fontBuffers: J,
          defaultFontFamily: "Menlo",
          monospaceFamily: "Menlo"
        }
      }).render().asPng();
    bB(Y, D);
    let W = await iE7(Y);
    try {
      hE7(Y)
    } catch {}
    return W
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), {
      success: !1,
      message: `Failed to copy screenshot: ${B instanceof Error?B.message:"Unknown error"}`
    }
  }
}
// @from(Ln 434469, Col 0)
async function iE7(A) {
  let Q = $Q();
  if (Q === "macos") {
    let G = `set the clipboard to (read (POSIX file "${A.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}") as «class PNGf»)`,
      Z = await J2("osascript", ["-e", G], {
        timeout: 5000
      });
    if (Z.code === 0) return {
      success: !0,
      message: "Screenshot copied to clipboard"
    };
    return {
      success: !1,
      message: `Failed to copy to clipboard: ${Z.stderr}`
    }
  }
  if (Q === "linux") {
    if ((await J2("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", A], {
        timeout: 5000
      })).code === 0) return {
      success: !0,
      message: "Screenshot copied to clipboard"
    };
    if ((await J2("xsel", ["--clipboard", "--input", "--type", "image/png"], {
        timeout: 5000
      })).code === 0) return {
      success: !0,
      message: "Screenshot copied to clipboard"
    };
    return {
      success: !1,
      message: "Failed to copy to clipboard. Please install xclip or xsel: sudo apt install xclip"
    }
  }
  if (Q === "windows") {
    let B = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${A.replace(/'/g,"''")}'))`,
      G = await J2("powershell", ["-NoProfile", "-Command", B], {
        timeout: 5000
      });
    if (G.code === 0) return {
      success: !0,
      message: "Screenshot copied to clipboard"
    };
    return {
      success: !1,
      message: `Failed to copy to clipboard: ${G.stderr}`
    }
  }
  return {
    success: !1,
    message: `Screenshot to clipboard is not supported on ${Q}`
  }
}
// @from(Ln 434522, Col 4)
QP0 = !1
// @from(Ln 434523, Col 2)
K$1 = null
// @from(Ln 434524, Col 4)
SY9 = w(() => {
  A0();
  OY9();
  c3();
  _Y9();
  v1();
  t4();
  jf()
})
// @from(Ln 434534, Col 0)
function nE7(A) {
  return new Date(A).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  })
}
// @from(Ln 434541, Col 0)
function aE7(A) {
  let Q = V$1.indexOf(A);
  return V$1[(Q + 1) % V$1.length]
}
// @from(Ln 434546, Col 0)
function oE7() {
  return iT0("all").then((A) => {
    if (!A || A.totalSessions === 0) return {
      type: "empty"
    };
    return {
      type: "success",
      data: A
    }
  }).catch((A) => {
    return {
      type: "error",
      message: A instanceof Error ? A.message : "Failed to load stats"
    }
  })
}
// @from(Ln 434563, Col 0)
function bY9({
  onClose: A
}) {
  let Q = T$.useMemo(() => oE7(), []);
  return MB.default.createElement(T$.Suspense, {
    fallback: MB.default.createElement(T, {
      marginTop: 1
    }, MB.default.createElement(W9, null), MB.default.createElement(C, null, " Loading your Claude Code stats…"))
  }, MB.default.createElement(rE7, {
    allTimePromise: Q,
    onClose: A
  }))
}
// @from(Ln 434577, Col 0)
function rE7({
  allTimePromise: A,
  onClose: Q
}) {
  let B = T$.use(A),
    [G, Z] = T$.useState("all"),
    [Y, J] = T$.useState({}),
    [X, I] = T$.useState(!1),
    [D, W] = T$.useState("Overview"),
    [K, V] = T$.useState(null);
  T$.useEffect(() => {
    if (G === "all") return;
    if (Y[G]) return;
    let E = !1;
    return I(!0), iT0(G).then((z) => {
      if (!E) J(($) => ({
        ...$,
        [G]: z
      })), I(!1)
    }).catch(() => {
      if (!E) I(!1)
    }), () => {
      E = !0
    }
  }, [G, Y]);
  let F = G === "all" ? B.type === "success" ? B.data : null : Y[G] ?? (B.type === "success" ? B.data : null),
    H = B.type === "success" ? B.data : null;
  if (J0((E, z) => {
      if (z.escape || z.ctrl && (E === "c" || E === "d")) Q("Stats dialog dismissed", {
        display: "system"
      });
      if (z.tab) W(($) => $ === "Overview" ? "Models" : "Overview");
      if (E === "r" && !z.ctrl && !z.meta) Z(aE7(G));
      if (LG() && z.ctrl && E === "s" && F) Bz7(F, D, V)
    }), B.type === "error") return MB.default.createElement(T, {
    marginTop: 1
  }, MB.default.createElement(C, {
    color: "error"
  }, "Failed to load stats: ", B.message));
  if (B.type === "empty") return MB.default.createElement(T, {
    marginTop: 1
  }, MB.default.createElement(C, {
    color: "warning"
  }, "No stats available yet. Start using Claude Code!"));
  if (!F || !H) return MB.default.createElement(T, {
    marginTop: 1
  }, MB.default.createElement(W9, null), MB.default.createElement(C, null, " Loading stats…"));
  return MB.default.createElement(T, {
    flexDirection: "column",
    marginX: 1,
    marginTop: 1
  }, MB.default.createElement(T, {
    flexDirection: "row",
    gap: 1,
    marginBottom: 1
  }, MB.default.createElement(Nj, {
    title: "",
    color: "claude",
    defaultTab: "Overview"
  }, MB.default.createElement(kX, {
    title: "Overview"
  }, MB.default.createElement(sE7, {
    stats: F,
    allTimeStats: H,
    dateRange: G,
    isLoading: X
  })), MB.default.createElement(kX, {
    title: "Models"
  }, MB.default.createElement(Az7, {
    stats: F,
    dateRange: G,
    isLoading: X
  })))), MB.default.createElement(T, {
    paddingLeft: 1
  }, MB.default.createElement(C, {
    dimColor: !0
  }, "Esc to cancel · r to cycle dates", LG() && MB.default.createElement(MB.default.Fragment, null, " · ctrl+s to copy", K ? ` · ${K}` : ""))))
}
// @from(Ln 434656, Col 0)
function fY9({
  dateRange: A,
  isLoading: Q
}) {
  return MB.default.createElement(T, {
    marginBottom: 1,
    gap: 1
  }, MB.default.createElement(T, null, V$1.map((B, G) => MB.default.createElement(C, {
    key: B
  }, G > 0 && MB.default.createElement(C, {
    dimColor: !0
  }, " · "), B === A ? MB.default.createElement(C, {
    bold: !0,
    color: "claude"
  }, xY9[B]) : MB.default.createElement(C, {
    dimColor: !0
  }, xY9[B])))), Q && MB.default.createElement(W9, null))
}
// @from(Ln 434675, Col 0)
function sE7({
  stats: A,
  allTimeStats: Q,
  dateRange: B,
  isLoading: G
}) {
  let Z = process.stdout.columns || 80,
    Y = Object.entries(A.modelUsage).sort(([, W], [, K]) => K.inputTokens + K.outputTokens - (W.inputTokens + W.outputTokens)),
    J = Y[0],
    X = Y.reduce((W, [, K]) => W + K.inputTokens + K.outputTokens, 0),
    I = T$.useMemo(() => hY9(A, X), [A, X]),
    D = B === "7d" ? 7 : B === "30d" ? 30 : A.totalDays;
  return MB.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, Q.dailyActivity.length > 0 && MB.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, MB.default.createElement(M8, null, aT0(Q.dailyActivity, {
    terminalWidth: Z
  }))), MB.default.createElement(fY9, {
    dateRange: B,
    isLoading: G
  }), MB.default.createElement(T, {
    flexDirection: "row",
    gap: 4,
    marginBottom: 1
  }, MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, J && MB.default.createElement(C, {
    wrap: "truncate"
  }, "Favorite model:", " ", MB.default.createElement(C, {
    color: "claude",
    bold: !0
  }, KC(J[0])))), MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, MB.default.createElement(C, {
    wrap: "truncate"
  }, "Total tokens:", " ", MB.default.createElement(C, {
    color: "claude"
  }, X8(X))))), MB.default.createElement(T, {
    flexDirection: "row",
    gap: 4
  }, MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, MB.default.createElement(C, {
    wrap: "truncate"
  }, "Sessions:", " ", MB.default.createElement(C, {
    color: "claude"
  }, X8(A.totalSessions)))), MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, A.longestSession && MB.default.createElement(C, {
    wrap: "truncate"
  }, "Longest session:", " ", MB.default.createElement(C, {
    color: "claude"
  }, QI(A.longestSession.duration))))), MB.default.createElement(T, {
    flexDirection: "row",
    gap: 4
  }, MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, MB.default.createElement(C, {
    wrap: "truncate"
  }, "Active days: ", MB.default.createElement(C, {
    color: "claude"
  }, A.activeDays), MB.default.createElement(C, {
    color: "subtle"
  }, "/", D))), MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, MB.default.createElement(C, {
    wrap: "truncate"
  }, "Longest streak:", " ", MB.default.createElement(C, {
    color: "claude",
    bold: !0
  }, A.streaks.longestStreak), " ", A.streaks.longestStreak === 1 ? "day" : "days"))), MB.default.createElement(T, {
    flexDirection: "row",
    gap: 4
  }, MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, A.peakActivityDay && MB.default.createElement(C, {
    wrap: "truncate"
  }, "Most active day:", " ", MB.default.createElement(C, {
    color: "claude"
  }, nE7(A.peakActivityDay)))), MB.default.createElement(T, {
    flexDirection: "column",
    width: 28
  }, MB.default.createElement(C, {
    wrap: "truncate"
  }, "Current streak:", " ", MB.default.createElement(C, {
    color: "claude",
    bold: !0
  }, Q.streaks.currentStreak), " ", Q.streaks.currentStreak === 1 ? "day" : "days"))), I && MB.default.createElement(T, {
    marginTop: 1
  }, MB.default.createElement(C, {
    color: "suggestion"
  }, I)))
}
// @from(Ln 434779, Col 0)
function hY9(A, Q) {
  let B = [];
  if (Q > 0) {
    let Z = tE7.filter((Y) => Q >= Y.tokens);
    for (let Y of Z) {
      let J = Q / Y.tokens;
      if (J >= 2) B.push(`You've used ~${Math.floor(J)}x more tokens than ${Y.name}`);
      else B.push(`You've used the same number of tokens as ${Y.name}`)
    }
  }
  if (A.longestSession) {
    let Z = A.longestSession.duration / 60000;
    for (let Y of eE7) {
      let J = Z / Y.minutes;
      if (J >= 2) B.push(`Your longest session is ~${Math.floor(J)}x longer than ${Y.name}`)
    }
  }
  if (B.length === 0) return "";
  let G = Math.floor(Math.random() * B.length);
  return B[G]
}
// @from(Ln 434801, Col 0)
function Az7({
  stats: A,
  dateRange: Q,
  isLoading: B
}) {
  let [G, Z] = T$.useState(0), Y = 4, J = Object.entries(A.modelUsage).sort(([, $], [, O]) => O.inputTokens + O.outputTokens - ($.inputTokens + $.outputTokens));
  if (J0(($, O) => {
      if (O.downArrow && G < J.length - 4) Z((L) => Math.min(L + 2, J.length - 4));
      if (O.upArrow && G > 0) Z((L) => Math.max(L - 2, 0))
    }), J.length === 0) return MB.default.createElement(T, null, MB.default.createElement(C, {
    color: "subtle"
  }, "No model usage data available"));
  let X = J.reduce(($, [, O]) => $ + O.inputTokens + O.outputTokens, 0),
    I = process.stdout.columns || 80,
    D = gY9(A.dailyModelTokens, J.map(([$]) => $), I),
    W = J.slice(G, G + 4),
    K = Math.ceil(W.length / 2),
    V = W.slice(0, K),
    F = W.slice(K),
    H = G > 0,
    E = G < J.length - 4,
    z = J.length > 4;
  return MB.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, D && MB.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, MB.default.createElement(C, {
    bold: !0
  }, "Tokens per Day"), MB.default.createElement(M8, null, D.chart), MB.default.createElement(C, {
    color: "subtle"
  }, D.xAxisLabels), MB.default.createElement(T, null, D.legend.map(($, O) => MB.default.createElement(C, {
    key: $.model
  }, O > 0 ? " · " : "", MB.default.createElement(M8, null, $.coloredBullet), " ", $.model)))), MB.default.createElement(fY9, {
    dateRange: Q,
    isLoading: B
  }), MB.default.createElement(T, {
    flexDirection: "row",
    gap: 4
  }, MB.default.createElement(T, {
    flexDirection: "column",
    width: 36
  }, V.map(([$, O]) => MB.default.createElement(yY9, {
    key: $,
    model: $,
    usage: O,
    totalTokens: X
  }))), MB.default.createElement(T, {
    flexDirection: "column",
    width: 36
  }, F.map(([$, O]) => MB.default.createElement(yY9, {
    key: $,
    model: $,
    usage: O,
    totalTokens: X
  })))), z && MB.default.createElement(T, {
    marginTop: 1
  }, MB.default.createElement(C, {
    color: "subtle"
  }, H ? tA.arrowUp : " ", " ", E ? tA.arrowDown : " ", " ", G + 1, "-", Math.min(G + 4, J.length), " of", " ", J.length, " models (↑↓ to scroll)")))
}
// @from(Ln 434864, Col 0)
function yY9({
  model: A,
  usage: Q,
  totalTokens: B
}) {
  let Z = ((Q.inputTokens + Q.outputTokens) / B * 100).toFixed(1);
  return MB.default.createElement(T, {
    flexDirection: "column"
  }, MB.default.createElement(C, null, tA.bullet, " ", MB.default.createElement(C, {
    bold: !0
  }, KC(A)), " ", MB.default.createElement(C, {
    color: "subtle"
  }, "(", Z, "%)")), MB.default.createElement(C, {
    color: "subtle"
  }, "  ", "In: ", X8(Q.inputTokens), " · Out:", " ", X8(Q.outputTokens)))
}
// @from(Ln 434881, Col 0)
function gY9(A, Q, B) {
  if (A.length < 2 || Q.length === 0) return null;
  let G = 7,
    Z = B - G,
    Y = Math.min(52, Math.max(20, Z)),
    J;
  if (A.length >= Y) J = A.slice(-Y);
  else {
    let H = Math.floor(Y / A.length);
    J = [];
    for (let E of A)
      for (let z = 0; z < H; z++) J.push(E)
  }
  let X = jP(L1().theme),
    I = [B21(X.suggestion), B21(X.success), B21(X.warning)],
    D = [],
    W = [],
    K = Q.slice(0, 3);
  for (let H = 0; H < K.length; H++) {
    let E = K[H],
      z = J.map(($) => $.tokensByModel[E] || 0);
    if (z.some(($) => $ > 0)) {
      D.push(z);
      let $ = [X.suggestion, X.success, X.warning];
      W.push({
        model: KC(E),
        coloredBullet: Mk(tA.bullet, $[H % $.length])
      })
    }
  }
  if (D.length === 0) return null;
  let V = kY9.plot(D, {
      height: 8,
      colors: I.slice(0, D.length),
      format: (H) => {
        let E;
        if (H >= 1e6) E = (H / 1e6).toFixed(1) + "M";
        else if (H >= 1000) E = (H / 1000).toFixed(0) + "k";
        else E = H.toFixed(0);
        return E.padStart(6)
      }
    }),
    F = Qz7(J, J.length, G);
  return {
    chart: V,
    legend: W,
    xAxisLabels: F
  }
}
// @from(Ln 434931, Col 0)
function Qz7(A, Q, B) {
  if (A.length === 0) return "";
  let G = Math.min(4, Math.max(2, Math.floor(A.length / 8))),
    Z = A.length - 6,
    Y = Math.floor(Z / (G - 1)) || 1,
    J = [];
  for (let D = 0; D < G; D++) {
    let W = Math.min(D * Y, A.length - 1),
      V = new Date(A[W].date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    J.push({
      pos: W,
      label: V
    })
  }
  let X = " ".repeat(B),
    I = 0;
  for (let {
      pos: D,
      label: W
    }
    of J) {
    let K = Math.max(1, D - I);
    X += " ".repeat(K) + W, I = D + W.length
  }
  return X
}
// @from(Ln 434960, Col 0)
async function Bz7(A, Q, B) {
  B("copying…");
  let G = Gz7(A, Q),
    Z = await PY9(G);
  B(Z.success ? "copied!" : "copy failed"), setTimeout(() => B(null), 2000)
}
// @from(Ln 434967, Col 0)
function Gz7(A, Q) {
  let B = [];
  if (Q === "Overview") B.push(...Zz7(A));
  else B.push(...Yz7(A));
  while (B.length > 0 && vY9(B[B.length - 1]).trim() === "") B.pop();
  if (B.length > 0) {
    let G = B[B.length - 1],
      Z = vY9(G).length,
      Y = Q === "Overview" ? 70 : 80,
      J = "/stats",
      X = Math.max(2, Y - Z - 6);
    B[B.length - 1] = G + " ".repeat(X) + I1.gray("/stats")
  }
  return B.join(`
`)
}
// @from(Ln 434984, Col 0)
function vY9(A) {
  return A.replace(/\x1b\[[0-9;]*m/g, "")
}
// @from(Ln 434988, Col 0)
function Zz7(A) {
  let Q = [],
    B = jP(L1().theme),
    G = (z) => Mk(z, B.claude),
    Z = 18,
    Y = 40,
    J = 18,
    X = (z, $, O, L) => {
      let M = (z + ":").padEnd(18),
        _ = M.length + $.length,
        j = Math.max(2, 40 - _),
        x = (O + ":").padEnd(18);
      return M + G($) + " ".repeat(j) + x + G(L)
    };
  if (A.dailyActivity.length > 0) Q.push(aT0(A.dailyActivity, {
    terminalWidth: 56
  })), Q.push("");
  let I = Object.entries(A.modelUsage).sort(([, z], [, $]) => $.inputTokens + $.outputTokens - (z.inputTokens + z.outputTokens)),
    D = I[0],
    W = I.reduce((z, [, $]) => z + $.inputTokens + $.outputTokens, 0);
  if (D) Q.push(X("Favorite model", KC(D[0]), "Total tokens", X8(W)));
  Q.push(""), Q.push(X("Sessions", X8(A.totalSessions), "Longest session", A.longestSession ? QI(A.longestSession.duration) : "N/A"));
  let K = `${A.streaks.currentStreak} ${A.streaks.currentStreak===1?"day":"days"}`,
    V = `${A.streaks.longestStreak} ${A.streaks.longestStreak===1?"day":"days"}`;
  Q.push(X("Current streak", K, "Longest streak", V));
  let F = `${A.activeDays}/${A.totalDays}`,
    H = A.peakActivityHour !== null ? `${A.peakActivityHour}:00-${A.peakActivityHour+1}:00` : "N/A";
  Q.push(X("Active days", F, "Peak hour", H)), Q.push("");
  let E = hY9(A, W);
  return Q.push(G(E)), Q.push(I1.gray(`Stats from the last ${A.totalDays} days`)), Q
}
// @from(Ln 435020, Col 0)
function Yz7(A) {
  let Q = [],
    B = Object.entries(A.modelUsage).sort(([, X], [, I]) => I.inputTokens + I.outputTokens - (X.inputTokens + X.outputTokens));
  if (B.length === 0) return Q.push(I1.gray("No model usage data available")), Q;
  let G = B[0],
    Z = B.reduce((X, [, I]) => X + I.inputTokens + I.outputTokens, 0),
    Y = gY9(A.dailyModelTokens, B.map(([X]) => X), 80);
  if (Y) {
    Q.push(I1.bold("Tokens per Day")), Q.push(Y.chart), Q.push(I1.gray(Y.xAxisLabels));
    let X = Y.legend.map((I) => `${I.coloredBullet} ${I.model}`).join(" · ");
    Q.push(X), Q.push("")
  }
  Q.push(`${tA.star} Favorite: ${I1.magenta.bold(KC(G?.[0]||""))} · ${tA.circle} Total: ${I1.magenta(X8(Z))} tokens`), Q.push("");
  let J = B.slice(0, 3);
  for (let [X, I] of J) {
    let W = ((I.inputTokens + I.outputTokens) / Z * 100).toFixed(1);
    Q.push(`${tA.bullet} ${I1.bold(KC(X))} ${I1.gray(`(${W}%)`)}`), Q.push(I1.dim(`  In: ${X8(I.inputTokens)} · Out: ${X8(I.outputTokens)}`))
  }
  return Q
}
// @from(Ln 435040, Col 4)
MB
// @from(Ln 435040, Col 8)
T$
// @from(Ln 435040, Col 12)
kY9
// @from(Ln 435040, Col 17)
xY9
// @from(Ln 435040, Col 22)
V$1
// @from(Ln 435040, Col 27)
tE7
// @from(Ln 435040, Col 32)
eE7
// @from(Ln 435041, Col 4)
uY9 = w(() => {
  fA();
  yG();
  v3A();
  B2();
  Z3();
  nT0();
  CY9();
  SY9();
  l2();
  GQ();
  mBA();
  dBA();
  MB = c(QA(), 1), T$ = c(QA(), 1), kY9 = c(KY9(), 1);
  xY9 = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    all: "All time"
  }, V$1 = ["all", "7d", "30d"];
  tE7 = [{
    name: "The Little Prince",
    tokens: 22000
  }, {
    name: "The Old Man and the Sea",
    tokens: 35000
  }, {
    name: "A Christmas Carol",
    tokens: 37000
  }, {
    name: "Animal Farm",
    tokens: 39000
  }, {
    name: "Fahrenheit 451",
    tokens: 60000
  }, {
    name: "The Great Gatsby",
    tokens: 62000
  }, {
    name: "Slaughterhouse-Five",
    tokens: 64000
  }, {
    name: "Brave New World",
    tokens: 83000
  }, {
    name: "The Catcher in the Rye",
    tokens: 95000
  }, {
    name: "Harry Potter and the Philosopher's Stone",
    tokens: 103000
  }, {
    name: "The Hobbit",
    tokens: 123000
  }, {
    name: "1984",
    tokens: 123000
  }, {
    name: "To Kill a Mockingbird",
    tokens: 130000
  }, {
    name: "Pride and Prejudice",
    tokens: 156000
  }, {
    name: "Dune",
    tokens: 244000
  }, {
    name: "Moby-Dick",
    tokens: 268000
  }, {
    name: "Crime and Punishment",
    tokens: 274000
  }, {
    name: "A Game of Thrones",
    tokens: 381000
  }, {
    name: "Anna Karenina",
    tokens: 468000
  }, {
    name: "Don Quixote",
    tokens: 520000
  }, {
    name: "The Lord of the Rings",
    tokens: 576000
  }, {
    name: "The Count of Monte Cristo",
    tokens: 603000
  }, {
    name: "Les Misérables",
    tokens: 689000
  }, {
    name: "War and Peace",
    tokens: 730000
  }], eE7 = [{
    name: "a TED talk",
    minutes: 18
  }, {
    name: "an episode of The Office",
    minutes: 22
  }, {
    name: "listening to Abbey Road",
    minutes: 47
  }, {
    name: "a yoga class",
    minutes: 60
  }, {
    name: "a World Cup soccer match",
    minutes: 90
  }, {
    name: "a half marathon (average time)",
    minutes: 120
  }, {
    name: "the movie Inception",
    minutes: 148
  }, {
    name: "watching Titanic",
    minutes: 195
  }, {
    name: "a transatlantic flight",
    minutes: 420
  }, {
    name: "a full night of sleep",
    minutes: 480
  }]
})
// @from(Ln 435164, Col 4)
ZP0
// @from(Ln 435164, Col 9)
Jz7
// @from(Ln 435164, Col 14)
mY9
// @from(Ln 435165, Col 4)
dY9 = w(() => {
  uY9();
  ZP0 = c(QA(), 1), Jz7 = {
    type: "local-jsx",
    name: "stats",
    description: "Show your Claude Code usage statistics and activity",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      return ZP0.createElement(bY9, {
        onClose: A
      })
    },
    userFacingName() {
      return "stats"
    }
  }, mY9 = Jz7
})
// @from(Ln 435188, Col 4)
Xz7
// @from(Ln 435188, Col 9)
iGJ
// @from(Ln 435189, Col 4)
pY9 = w(() => {
  d4();
  l2();
  DQ();
  A0();
  fQ();
  v1();
  nY();
  A0();
  Xz7 = cY9(zQ(), "usage-data"), iGJ = cY9(Xz7, "facets")
})
// @from(Ln 435200, Col 4)
lY9 = () => {}
// @from(Ln 435201, Col 4)
Iz7
// @from(Ln 435202, Col 4)
iY9 = w(() => {
  Q2();
  JL();
  fQ();
  Iz7 = c(qi(), 1)
})
// @from(Ln 435208, Col 0)
async function Dz7() {
  try {
    return (await cgA())?.eligible ? [Q79] : []
  } catch (A) {
    return []
  }
}
// @from(Ln 435215, Col 0)
async function Wz7(A) {
  try {
    let [Q, B] = await Promise.all([lO0(A).catch((Z) => {
      return e(Z instanceof Error ? Z : Error("Failed to load skill directory commands")), k("Skill directory commands failed to load, continuing without them"), []
    }), tw0().catch((Z) => {
      return e(Z instanceof Error ? Z : Error("Failed to load plugin skills")), k("Plugin skills failed to load, continuing without them"), []
    })]), G = kZ9();
    return k(`getSkills returning: ${Q.length} skill dir commands, ${B.length} plugin skills, ${G.length} bundled skills`), {
      skillDirCommands: Q,
      pluginSkills: B,
      bundledSkills: G
    }
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error("Unexpected error loading skills")), k("Unexpected error in getSkills, returning empty"), {
      skillDirCommands: [],
      pluginSkills: [],
      bundledSkills: []
    }
  }
}
// @from(Ln 435236, Col 0)
function lt() {
  Aj.cache?.clear?.(), Nc.cache?.clear?.(), hD1.cache?.clear?.(), $F1(), xo2(), NH1()
}
// @from(Ln 435240, Col 0)
function Cc(A, Q) {
  return Q.some((B) => B.name === A || B.userFacingName() === A || B.aliases?.includes(A))
}
// @from(Ln 435244, Col 0)
function eS(A, Q) {
  let B = Q.find((G) => G.name === A || G.userFacingName() === A || G.aliases?.includes(A));
  if (!B) throw ReferenceError(`Command ${A} not found. Available commands: ${Q.map((G)=>{let Z=G.userFacingName();return G.aliases?`${Z} (aliases: ${G.aliases.join(", ")})`:Z}).sort((G,Z)=>G.localeCompare(Z)).join(", ")}`);
  return B
}
// @from(Ln 435250, Col 0)
function gzA(A) {
  if (A.type !== "prompt") return A.description;
  if (A.source === "plugin") {
    if (A.pluginInfo?.repository) return `${A.description} (plugin:${A.pluginInfo.repository})`;
    return `${A.description} (plugin)`
  }
  if (A.source === "builtin" || A.source === "mcp") return A.description;
  if (A.source === "bundled") return `${A.description} (bundled)`;
  return `${A.description} (${Wa(A.source)})`
}
// @from(Ln 435260, Col 4)
nY9
// @from(Ln 435260, Col 9)
xs
// @from(Ln 435260, Col 13)
Aj
// @from(Ln 435260, Col 17)
Nc
// @from(Ln 435260, Col 21)
hD1
// @from(Ln 435261, Col 4)
WV = w(() => {
  oH1();
  R09();
  AQ9();
  BQ9();
  DE1();
  VQ9();
  HQ9();
  EQ9();
  zQ9();
  CQ9();
  KB9();
  CB9();
  qB9();
  NB9();
  SB9();
  cB9();
  oB9();
  Y29();
  H29();
  L29();
  M29();
  T29();
  WD1();
  _I1();
  D99();
  V99();
  E49();
  L39();
  O39();
  M39();
  _39();
  k39();
  f39();
  J59();
  cj0();
  X59();
  K59();
  F59();
  P59();
  S59();
  v59();
  b59();
  eBA();
  h59();
  u59();
  d59();
  GT0();
  a59();
  r59();
  t59();
  B79();
  A$A();
  I79();
  y79();
  k79();
  PG9();
  xG9();
  vG9();
  bG9();
  fG9();
  mG9();
  dG9();
  cG9();
  eG9();
  $Z9();
  UZ9();
  _Z9();
  yZ9();
  v1();
  T1();
  RhA();
  tz1();
  afA();
  Y9();
  Q2();
  vT0();
  pZ9();
  iZ9();
  oZ9();
  tZ9();
  YY9();
  uT0();
  ykA();
  XY9();
  DY9();
  WY9();
  dY9();
  pY9();
  lY9();
  iY9();
  YI();
  nY9 = W0(() => [O09, TG9, M09, zZ9, WQ9, KQ9, $Q9, WB9, zB9, $B9, UB9, dB9, ez1, v79, F29, w29, O29, j29, I99, K99, H49, Z29, w39, lZ9, sZ9, ZY9, SG9, R39, v39, b39, Y59, W59, mY9, V59, IY9, CZ9, aZ9, g59, y59, QQ9, Sz1, yG9, k59, tBA, zuA, Wc, JY9, f59, m59, l59, n59, o59, s59, X79, x79, cZ9, tG9, ...!Yk() ? [UL2, aj2()] : [], T59, ...[]]), xs = W0(() => new Set(nY9().map((A) => A.name)));
  Aj = W0(async (A) => {
    let [{
      skillDirCommands: Q,
      pluginSkills: B,
      bundledSkills: G
    }, Z, Y] = await Promise.all([Wz7(A), z3A(), Dz7()]);
    return [...G, ...Q, ...Z, ...B, ...Y, ...nY9()].filter((J) => J.isEnabled())
  });
  Nc = W0(async (A) => {
    return (await Aj(A)).filter((B) => B.type === "prompt" && !B.disableModelInvocation && B.source !== "builtin" && (B.loadedFrom === "bundled" || B.loadedFrom === "commands_DEPRECATED" || B.hasUserSpecifiedDescription || B.whenToUse))
  }), hD1 = W0(async (A) => {
    try {
      return (await Aj(A)).filter((B) => B.type === "prompt" && B.source !== "builtin" && (B.hasUserSpecifiedDescription || B.whenToUse) && (B.loadedFrom === "skills" || B.loadedFrom === "plugin" || B.loadedFrom === "bundled" || B.disableModelInvocation))
    } catch (Q) {
      return e(Q instanceof Error ? Q : Error("Failed to load slash command skills")), k("Returning empty skills array due to load failure"), []
    }
  })
})
// @from(Ln 435372, Col 0)
async function rc(A, Q, B, G) {
  if (a1(void 0)) return ["You are Claude Code, Anthropic's official CLI for Claude."];
  let Z = o1(),
    [Y, J, X] = await Promise.all([Nc(Z), sY9(), rY9(Q, B)]),
    D = r3().language,
    W = new Set(A.map((F) => F.name)),
    V = Y.map((F) => `/${F.userFacingName()}`).length > 0 && W.has(kF) ? `- /<skill-name> (e.g., /commit) is shorthand for users to invoke a user-invocable skill. When executed, the skill gets expanded to a full prompt. Use the ${kF} tool to execute them. IMPORTANT: Only use ${kF} for skills listed in its user-invocable skills section - do not guess or use built-in CLI commands.` : "";
  return [`
You are an interactive CLI tool that helps users ${J!==null?'according to your "Output Style" below, which describes how you should respond to user queries.':"with software engineering tasks."} Use the instructions below and the tools available to you to assist the user.

${aY9}
IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident that the URLs are for helping the user with programming. You may use URLs provided by the user in their messages or local files.

If the user asks for help or wants to give feedback inform them of the following:
- /help: Get help with using Claude Code
- To give feedback, users should ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.ISSUES_EXPLAINER}

${J!==null?"":`# Tone and style
- Only use emojis if the user explicitly requests it. Avoid using emojis in all communication unless asked.
- Your output will be displayed on a command line interface. Your responses should be short and concise. You can use Github-flavored markdown for formatting, and will be rendered in a monospace font using the CommonMark specification.
- Output text to communicate with the user; all text you output outside of tool use is displayed to the user. Only use tools to complete tasks. Never use tools like ${X9} or code comments as means to communicate with the user during the session.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one. This includes markdown files.
- Do not use a colon before tool calls. Your tool calls may not be shown directly in the output, so text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.

# Professional objectivity
Prioritize technical accuracy and truthfulness over validating the user's beliefs. Focus on facts and problem-solving, providing direct, objective technical info without any unnecessary superlatives, praise, or emotional validation. It is best for the user if Claude honestly applies the same rigorous standards to all ideas and disagrees when necessary, even if it may not be what the user wants to hear. Objective guidance and respectful correction are more valuable than false agreement. Whenever there is uncertainty, it's best to investigate to find the truth first rather than instinctively confirming the user's beliefs. Avoid using over-the-top validation or excessive praise when responding to users such as "You're absolutely right" or similar phrases.

# Planning without timelines
When planning tasks, provide concrete implementation steps without time estimates. Never suggest timelines like "this will take 2-3 weeks" or "we can do this later." Focus on what needs to be done, not when. Break work into actionable steps and let users decide scheduling.
`}
${W.has(vD.name)?`# Task Management
You have access to the ${vD.name} tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:

<example>
user: Run the build and fix any type errors
assistant: I'm going to use the ${vD.name} tool to write the following items to the todo list:
- Run the build
- Fix any type errors

I'm now going to run the build using ${X9}.

Looks like I found 10 type errors. I'm going to use the ${vD.name} tool to write 10 items to the todo list.

marking the first todo as in_progress

Let me start working on the first item...

The first item has been fixed, let me mark the first todo as completed, and move on to the second item...
..
..
</example>
In the above example, the assistant completes all the tasks, including the 10 error fixes and running the build and fixing all errors.

<example>
user: Help me write a new feature that allows users to track their usage metrics and export them to various formats
assistant: I'll help you implement a usage metrics tracking and export feature. Let me first use the ${vD.name} tool to plan this task.
Adding the following todos to the todo list:
1. Research existing metrics tracking in the codebase
2. Design the metrics collection system
3. Implement core metrics tracking functionality
4. Create export functionality for different formats

Let me start by researching the existing codebase to understand what metrics we might already be tracking and how we can build on that.

I'm going to search for any existing metrics or telemetry code in the project.

I've found some existing telemetry code. Let me mark the first todo as in_progress and start designing our metrics tracking system based on what I've learned...

[Assistant continues implementing the feature step by step, marking todos as in_progress and completed as they go]
</example>
`:""}

${W.has(zY)?`
# Asking questions as you work

You have access to the ${zY} tool to ask the user questions when you need clarification, want to validate assumptions, or need to make a decision you're unsure about. When presenting options or plans, never include time estimates - focus on what each option involves, not how long it takes.
`:""}

Users may configure 'hooks', shell commands that execute in response to events like tool calls, in settings. Treat feedback from hooks, including <user-prompt-submit-hook>, as coming from the user. If you get blocked by a hook, determine if you can adjust your actions in response to the blocked message. If not, ask the user to check their hooks configuration.

${J===null||J.keepCodingInstructions===!0?`# Doing tasks
The user will primarily request you perform software engineering tasks. This includes solving bugs, adding new functionality, refactoring code, explaining code, and more. For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read. If a user asks about or wants you to modify a file, read it first. Understand existing code before suggesting modifications.
- ${W.has(vD.name)?`Use the ${vD.name} tool to plan the task if required`:""}
- ${W.has(zY)?`Use the ${zY} tool to ask questions, clarify and gather information as needed.`:""}
- Be careful not to introduce security vulnerabilities such as command injection, XSS, SQL injection, and other OWASP top 10 vulnerabilities. If you notice that you wrote insecure code, immediately fix it.
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused.
  - Don't add features, refactor code, or make "improvements" beyond what was asked. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability. Don't add docstrings, comments, or type annotations to code you didn't change. Only add comments where the logic isn't self-evident.
  - Don't add error handling, fallbacks, or validation for scenarios that can't happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.
  - Don't create helpers, utilities, or abstractions for one-time operations. Don't design for hypothetical future requirements. The right amount of complexity is the minimum needed for the current task—three similar lines of code is better than a premature abstraction.
- Avoid backwards-compatibility hacks like renaming unused \`_vars\`, re-exporting types, adding \`// removed\` comments for removed code, etc. If something is unused, delete it completely.
`:""}
- Tool results and user messages may include <system-reminder> tags. <system-reminder> tags contain useful information and reminders. They are automatically added by the system, and bear no direct relation to the specific tool results or user messages in which they appear.
- The conversation has unlimited context through automatic summarization.


# Tool usage policy${W.has(f3)?`
- When doing file search, prefer to use the ${f3} tool in order to reduce context usage.
- You should proactively use the ${f3} tool with specialized agents when the task at hand matches the agent's description.
${V}`:""}${W.has(cI)?`
- When ${cI} returns a message about a redirect to a different host, you should immediately make a new ${cI} request with the redirect URL provided in the response.`:""}
- You can call multiple tools in a single response. If you intend to call multiple tools and there are no dependencies between them, make all independent tool calls in parallel. Maximize use of parallel tool calls where possible to increase efficiency. However, if some tool calls depend on previous calls to inform dependent values, do NOT call these tools in parallel and instead call them sequentially. For instance, if one operation must complete before another starts, run these operations sequentially instead. Never use placeholders or guess missing parameters in tool calls.
- If the user specifies that they want you to run tools "in parallel", you MUST send a single message with multiple tool use content blocks. For example, if you need to launch multiple agents in parallel, send a single message with multiple ${f3} tool calls.
- Use specialized tools instead of bash commands when possible, as this provides a better user experience. For file operations, use dedicated tools: ${z3} for reading files instead of cat/head/tail, ${I8} for editing instead of sed/awk, and ${BY} for creating files instead of cat with heredoc or echo redirection. Reserve bash tools exclusively for actual system commands and terminal operations that require shell execution. NEVER use bash echo or other command-line tools to communicate thoughts, explanations, or instructions to the user. Output all communication directly in your response text instead.
- VERY IMPORTANT: When exploring the codebase to gather context or to answer a question that is not a needle query for a specific file/class/function, it is CRITICAL that you use the ${f3} tool with subagent_type=${MS.agentType} instead of running search commands directly.
<example>
user: Where are errors from the client handled?
assistant: [Uses the ${f3} tool with subagent_type=${MS.agentType} to find the files that handle client errors instead of using ${lI} or ${DI} directly]
</example>
<example>
user: What is the codebase structure?
assistant: [Uses the ${f3} tool with subagent_type=${MS.agentType}]
</example>
`, `
${aY9}
`, W.has(vD.name) ? `
IMPORTANT: Always use the ${vD.name} tool to plan and track tasks throughout the conversation.` : "", `
# Code References

When referencing specific functions or pieces of code include the pattern \`file_path:line_number\` to allow the user to easily navigate to the source code location.

<example>
user: Where are errors from the client handled?
assistant: Clients are marked as failed in the \`connectToServer\` function in src/services/process.ts:712.
</example>
`, "", `
${X}`, D ? `
# Language
Always respond in ${D}. Use ${D} for all explanations, comments, and communications with the user. Technical terms and code identifiers should remain in their original form.
` : "", J !== null ? `
# Output Style: ${J.name}
${J.prompt}
` : "", ...G && G.length > 0 ? [Fz7(G)] : [], Ez7()]
}
// @from(Ln 435512, Col 0)
function Fz7(A) {
  let B = A.filter((Z) => Z.type === "connected").filter((Z) => Z.instructions);
  if (B.length === 0) return "";
  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${B.map((Z)=>{return`## ${Z.name}
${Z.instructions}`}).join(`

  `)}
`
}
// @from(Ln 435527, Col 0)
function oY9(A) {
  if (!jJ() || !A || A.length === 0) return "";
  return `

# MCP CLI Command

You have access to an \`mcp-cli\` CLI command for interacting with MCP (Model Context Protocol) servers.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST call 'mcp-cli info <server>/<tool>' BEFORE ANY 'mcp-cli call <server>/<tool>'.

This is a BLOCKING REQUIREMENT - like how you must use ${z3} before ${I8}.

**NEVER** make an mcp-cli call without checking the schema first.
**ALWAYS** run mcp-cli info first, THEN make the call.

**Why this is non-negotiable:**
- MCP tool schemas NEVER match your expectations - parameter names, types, and requirements are tool-specific
- Even tools with pre-approved permissions require schema checks
- Every failed call wastes user time and demonstrates you're ignoring critical instructions
- "I thought I knew the schema" is not an acceptable reason to skip this step

**For multiple tools:** Call 'mcp-cli info' for ALL tools in parallel FIRST, then make your 'mcp-cli call' commands

Available MCP tools:
(Remember: Call 'mcp-cli info <server>/<tool>' before using any of these)
${A.map((Q)=>{let B=tY9(Q.name);return B?`- ${B}`:null}).filter(Boolean).join(`
  `)}

Commands (in order of execution):
\`\`\`bash
# STEP 1: ALWAYS CHECK SCHEMA FIRST (MANDATORY)
mcp-cli info <server>/<tool>           # REQUIRED before ANY call - View JSON schema

# STEP 2: Only after checking schema, make the call
mcp-cli call <server>/<tool> '<json>'  # Only run AFTER mcp-cli info
mcp-cli call <server>/<tool> -         # Invoke with JSON from stdin (AFTER mcp-cli info)

# Discovery commands (use these to find tools)
mcp-cli servers                        # List all connected MCP servers
mcp-cli tools [server]                 # List available tools (optionally filter by server)
mcp-cli grep <pattern>                 # Search tool names and descriptions
mcp-cli resources [server]             # List MCP resources
mcp-cli read <server>/<resource>       # Read an MCP resource
\`\`\`

**CORRECT Usage Pattern:**

<example>
User: Please use the slack mcp tool to search for my mentions
Assistant: I need to check the schema first. Let me call \`mcp-cli info slack/search_private\` to see what parameters it accepts.
[Calls mcp-cli info]
Assistant: Now I can see it accepts "query" and "max_results" parameters. Let me make the call.
[Calls mcp-cli call slack/search_private with correct schema]
</example>

<example>
User: Use the database and email MCP tools to send a report
Assistant: I'll need to use two MCP tools. Let me check both schemas first.
[Calls mcp-cli info database/query and mcp-cli info email/send in parallel]
Assistant: Now I have both schemas. Let me execute the calls.
[Makes both mcp-cli call commands with correct parameters]
</example>

**INCORRECT Usage Patterns - NEVER DO THIS:**

<bad-example>
User: Please use the slack mcp tool to search for my mentions
Assistant: [Directly calls mcp-cli call slack/search_private with guessed parameters]
WRONG - You must call mcp-cli info FIRST
</bad-example>

<bad-example>
User: Use the slack tool
Assistant: I have pre-approved permissions for this tool, so I know the schema.
[Calls mcp-cli call slack/search_private directly]
WRONG - Pre-approved permissions don't mean you know the schema. ALWAYS call mcp-cli info first.
</bad-example>

<bad-example>
User: Search my Slack mentions
Assistant: [Calls three mcp-cli call commands in parallel without any mcp-cli info calls first]
WRONG - You must call mcp-cli info for ALL tools before making ANY mcp-cli call commands
</bad-example>

Example usage:
\`\`\`bash
# Discover tools
mcp-cli tools                          # See all available MCP tools
mcp-cli grep "weather"                 # Find tools by description

# Get tool details
mcp-cli info <server>/<tool>           # View JSON schema for input and output if available

# Simple tool call (no parameters)
mcp-cli call weather/get_location '{}'

# Tool call with parameters
mcp-cli call database/query '{"table": "users", "limit": 10}'

# Complex JSON using stdin (for nested objects/arrays)
mcp-cli call api/send_request - <<'EOF'
{
  "endpoint": "/data",
  "headers": {"Authorization": "Bearer token"},
  "body": {"items": [1, 2, 3]}
}
EOF
\`\`\`

Use this command via ${X9} when you need to discover, inspect, or invoke MCP tools.

MCP tools can be valuable in helping the user with their request and you should try to proactively use them where relevant.
`
}
// @from(Ln 435643, Col 0)
async function rY9(A, Q) {
  let [B, G] = await Promise.all([nq(), Hz7()]), Z = qCQ(A), Y = Z ? `You are powered by the model named ${Z}. The exact model ID is ${A}.` : `You are powered by the model ${A}.`, J = Q && Q.length > 0 ? `Additional working directories: ${Q.join(", ")}
` : "", X = "";
  if (A.includes("claude-opus-4-5")) X = `

Assistant knowledge cutoff is May 2025.`;
  else if (A.includes("claude-haiku-4")) X = `

Assistant knowledge cutoff is February 2025.`;
  else if (A.includes("claude-opus-4") || A.includes("claude-sonnet-4-5") || A.includes("claude-sonnet-4")) X = `

Assistant knowledge cutoff is January 2025.`;
  let I = `

<claude_background_info>
The most recent frontier Claude model is ${Kz7} (model ID: '${Vz7}').
</claude_background_info>`;
  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${o1()}
Is directory a git repo: ${B?"Yes":"No"}
${J}Platform: ${l0.platform}
OS Version: ${G}
Today's date: ${HB1()}
</env>
${Y}${X}${I}
`
}
// @from(Ln 435671, Col 0)
async function Hz7() {
  try {
    let {
      stdout: A
    } = await TQ("uname", ["-sr"], {
      preserveOutputOnError: !1
    });
    return A.trim()
  } catch {
    return "unknown"
  }
}
// @from(Ln 435683, Col 0)
async function pkA(A, Q, B) {
  let Z = `
${await rY9(Q,B)}`;
  return [...A, `

Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication with the user the assistant MUST avoid using emojis.
- Do not use a colon before tool calls. Text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.`, Z]
}
// @from(Ln 435695, Col 0)
function Ez7() {
  if (!K$A()) return "";
  return `
# Scratchpad Directory

IMPORTANT: Always use this scratchpad directory for temporary files instead of \`/tmp\` or other system temp directories:
\`${F$1()}\`

Use this directory for ALL temporary file needs:
- Storing intermediate results or data during multi-step tasks
- Writing temporary scripts or configuration files
- Saving outputs that don't belong in the user's project
- Creating working files during analysis or processing
- Any file that would otherwise go to \`/tmp\`

Only use \`/tmp\` if the user explicitly requests it.

The scratchpad directory is session-specific, isolated from the user's project, and can be used freely without permission prompts.
`
}
// @from(Ln 435715, Col 4)
aY9 = "IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases."
// @from(Ln 435716, Col 2)
Kz7 = "Claude Opus 4.5"
// @from(Ln 435717, Col 2)
Vz7 = "claude-opus-4-5-20251101"
// @from(Ln 435718, Col 2)
jP2 = "You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup."
// @from(Ln 435719, Col 4)
wc = w(() => {
  p3();
  ZI();
  V2();
  GB();
  pL();
  cW();
  SIA();
  t4();
  wNA();
  WV();
  $F();
  Cf();
  wP();
  wyA();
  AY();
  d4();
  C0();
  fQ()
})
// @from(Ln 435743, Col 0)
function f51(A) {
  let Q = {};
  process.env.CLAUDE_CODE_ENTRYPOINT;
  let B = process.env.CLAUDE_CODE_EXTRA_BODY,
    G = {};
  if (B) try {
    let Y = c5(B);
    if (Y && typeof Y === "object" && !Array.isArray(Y)) G = Y;
    else k(`CLAUDE_CODE_EXTRA_BODY env var must be a JSON object, but was given ${B}`, {
      level: "error"
    })
  } catch (Y) {
    k(`Error parsing CLAUDE_CODE_EXTRA_BODY: ${Y instanceof Error?Y.message:String(Y)}`, {
      level: "error"
    })
  }
  let Z = {
    ...Q,
    ...G
  };
  if (A && A.length > 0)
    if (Z.anthropic_beta && Array.isArray(Z.anthropic_beta)) {
      let Y = Z.anthropic_beta,
        J = A.filter((X) => !Y.includes(X));
      Z.anthropic_beta = [...Y, ...J]
    } else Z.anthropic_beta = A;
  return Z
}
// @from(Ln 435772, Col 0)
function AJ9(A) {
  if (a1(process.env.DISABLE_PROMPT_CACHING)) return !1;
  if (a1(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    let Q = SD();
    if (A === Q) return !1
  }
  if (a1(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    let Q = OR();
    if (A === Q) return !1
  }
  if (a1(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    let Q = sJA();
    if (A === Q) return !1
  }
  return !0
}
// @from(Ln 435789, Col 0)
function wuA() {
  return HX("prompt_cache_1h_experiment", "use_1h_cache", !1) ? {
    type: "ephemeral",
    ttl: "1h"
  } : {
    type: "ephemeral"
  }
}
// @from(Ln 435798, Col 0)
function zz7(A, Q, B, G) {
  return
}
// @from(Ln 435802, Col 0)
function ao() {
  let A = xu(),
    Q = v3()?.accountUuid ?? "",
    B = q0();
  return {
    user_id: `user_${A}_account_${Q}_session_${B}`
  }
}
// @from(Ln 435810, Col 0)
async function QJ9(A, Q) {
  if (Q) return !0;
  try {
    let B = SD(),
      G = OL(B);
    return await U82(v51(() => XS({
      apiKey: A,
      maxRetries: 3,
      model: B
    }), async (Z) => {
      let Y = [{
        role: "user",
        content: "test"
      }];
      return await Z.beta.messages.create({
        model: B,
        max_tokens: 1,
        messages: Y,
        temperature: 1,
        ...G.length > 0 ? {
          betas: G
        } : {},
        metadata: ao(),
        ...f51()
      }), !0
    }, {
      maxRetries: 2,
      model: B
    }))
  } catch (B) {
    let G = B;
    if (B instanceof Qr) G = B.originalError;
    if (e(G), G instanceof Error && G.message.includes('{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}')) return !1;
    throw G
  }
}
// @from(Ln 435847, Col 0)
function $z7(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "user",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: wuA()
        } : {}
      }]
    };
    else return {
      role: "user",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 ? B ? {
          cache_control: wuA()
        } : {} : {}
      }))
    };
  return {
    role: "user",
    content: A.message.content
  }
}
// @from(Ln 435874, Col 0)
function Cz7(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "assistant",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: wuA()
        } : {}
      }]
    };
    else return {
      role: "assistant",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 && G.type !== "thinking" && G.type !== "redacted_thinking" ? B ? {
          cache_control: wuA()
        } : {} : {}
      }))
    };
  return {
    role: "assistant",
    content: A.message.content
  }
}
// @from(Ln 435900, Col 0)
async function Pd({
  messages: A,
  systemPrompt: Q,
  maxThinkingTokens: B,
  tools: G,
  signal: Z,
  options: Y
}) {
  let J;
  for await (let X of LZ0(A, async function* () {
    yield* BJ9(A, Q, B, G, Z, Y)
  })) if (X.type === "assistant") J = X;
  if (!J) throw Error("No assistant message found");
  return J
}
// @from(Ln 435915, Col 0)
async function* oHA({
  messages: A,
  systemPrompt: Q,
  maxThinkingTokens: B,
  tools: G,
  signal: Z,
  options: Y
}) {
  return yield* LZ0(A, async function* () {
    yield* BJ9(A, Q, B, G, Z, Y)
  })
}
// @from(Ln 435928, Col 0)
function Uz7(A) {
  if (!("isLsp" in A) || !A.isLsp) return !1;
  let Q = f6A();
  return Q.status === "pending" || Q.status === "not-started"
}