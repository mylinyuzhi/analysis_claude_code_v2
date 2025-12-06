
// @from(Start 1492065, End 1498193)
function H44({
  readConfig: A,
  writeConfig: Q,
  httpProxyPort: B,
  socksProxyPort: G,
  needsNetworkRestriction: Z,
  allowUnixSockets: I,
  allowAllUnixSockets: Y,
  allowLocalBinding: J,
  logTag: W
}) {
  let X = ["(version 1)", `(deny default (with message "${W}"))`, "", `; LogTag: ${W}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.trustd.agent")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', '  (sysctl-name "hw.busfrequency_compat")', '  (sysctl-name "hw.byteorder")', '  (sysctl-name "hw.cacheconfig")', '  (sysctl-name "hw.cachelinesize_compat")', '  (sysctl-name "hw.cpufamily")', '  (sysctl-name "hw.cpufrequency")', '  (sysctl-name "hw.cpufrequency_compat")', '  (sysctl-name "hw.cputype")', '  (sysctl-name "hw.l1dcachesize_compat")', '  (sysctl-name "hw.l1icachesize_compat")', '  (sysctl-name "hw.l2cachesize_compat")', '  (sysctl-name "hw.l3cachesize_compat")', '  (sysctl-name "hw.logicalcpu")', '  (sysctl-name "hw.logicalcpu_max")', '  (sysctl-name "hw.machine")', '  (sysctl-name "hw.memsize")', '  (sysctl-name "hw.ncpu")', '  (sysctl-name "hw.nperflevels")', '  (sysctl-name "hw.packages")', '  (sysctl-name "hw.pagesize_compat")', '  (sysctl-name "hw.pagesize")', '  (sysctl-name "hw.physicalcpu")', '  (sysctl-name "hw.physicalcpu_max")', '  (sysctl-name "hw.tbfrequency_compat")', '  (sysctl-name "hw.vectorunit")', '  (sysctl-name "kern.argmax")', '  (sysctl-name "kern.bootargs")', '  (sysctl-name "kern.hostname")', '  (sysctl-name "kern.maxfiles")', '  (sysctl-name "kern.maxfilesperproc")', '  (sysctl-name "kern.maxproc")', '  (sysctl-name "kern.ngroups")', '  (sysctl-name "kern.osproductversion")', '  (sysctl-name "kern.osrelease")', '  (sysctl-name "kern.ostype")', '  (sysctl-name "kern.osvariant_status")', '  (sysctl-name "kern.osversion")', '  (sysctl-name "kern.secure_kernel")', '  (sysctl-name "kern.tcsm_available")', '  (sysctl-name "kern.tcsm_enable")', '  (sysctl-name "kern.usrstack64")', '  (sysctl-name "kern.version")', '  (sysctl-name "kern.willshutdown")', '  (sysctl-name "machdep.cpu.brand_string")', '  (sysctl-name "machdep.ptrauth_enabled")', '  (sysctl-name "security.mac.lockdown_mode_state")', '  (sysctl-name "sysctl.proc_cputype")', '  (sysctl-name "vm.loadavg")', '  (sysctl-name-prefix "hw.optional.arm")', '  (sysctl-name-prefix "hw.optional.arm.")', '  (sysctl-name-prefix "hw.optional.armv8_")', '  (sysctl-name-prefix "hw.perflevel")', '  (sysctl-name-prefix "kern.proc.pgrp.")', '  (sysctl-name-prefix "kern.proc.pid.")', '  (sysctl-name-prefix "machdep.cpu.")', '  (sysctl-name-prefix "net.routetable.")', ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
  if (X.push("; Network"), !Z) X.push("(allow network*)");
  else {
    if (J) X.push('(allow network-bind (local ip "localhost:*"))'), X.push('(allow network-inbound (local ip "localhost:*"))'), X.push('(allow network-outbound (local ip "localhost:*"))');
    if (Y) X.push('(allow network* (subpath "/"))');
    else if (I && I.length > 0)
      for (let V of I) {
        let F = NR(V);
        X.push(`(allow network* (subpath ${t$(F)}))`)
      }
    if (B !== void 0) X.push(`(allow network-bind (local ip "localhost:${B}"))`), X.push(`(allow network-inbound (local ip "localhost:${B}"))`), X.push(`(allow network-outbound (remote ip "localhost:${B}"))`);
    if (G !== void 0) X.push(`(allow network-bind (local ip "localhost:${G}"))`), X.push(`(allow network-inbound (local ip "localhost:${G}"))`), X.push(`(allow network-outbound (remote ip "localhost:${G}"))`)
  }
  return X.push(""), X.push("; File read"), X.push(...K44(A, W)), X.push(""), X.push("; File write"), X.push(...D44(Q, W)), X.join(`
`)
}
// @from(Start 1498195, End 1498240)
function t$(A) {
  return JSON.stringify(A)
}
// @from(Start 1498242, End 1498579)
function C44() {
  let A = process.env.TMPDIR;
  if (!A) return [];
  if (!A.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
  let B = A.replace(/\/T\/?$/, "");
  if (B.startsWith("/private/var/")) return [B, B.replace("/private", "")];
  else if (B.startsWith("/var/")) return [B, "/private" + B];
  return [B]
}
// @from(Start 1498581, End 1499700)
function Tm0(A) {
  let {
    command: Q,
    needsNetworkRestriction: B,
    httpProxyPort: G,
    socksProxyPort: Z,
    allowUnixSockets: I,
    allowAllUnixSockets: Y,
    allowLocalBinding: J,
    readConfig: W,
    writeConfig: X,
    binShell: V
  } = A, F = W && W.denyOnly.length > 0;
  if (!B && !F && X === void 0) return Q;
  let D = F44(Q),
    H = H44({
      readConfig: W,
      writeConfig: X,
      httpProxyPort: G,
      socksProxyPort: Z,
      needsNetworkRestriction: B,
      allowUnixSockets: I,
      allowAllUnixSockets: Y,
      allowLocalBinding: J,
      logTag: D
    }),
    C = `export ${RxA(G,Z).join(" ")} && `,
    E = V || "bash",
    U = X44("which", [E], {
      encoding: "utf8"
    });
  if (U.status !== 0) throw Error(`Shell '${E}' not found in PATH`);
  let q = U.stdout.trim(),
    w = Mm0.default.quote(["sandbox-exec", "-p", H, q, "-c", C + Q]);
  return kQ(`[Sandbox macOS] Applied restrictions - network: ${!!(G||Z)}, read: ${W?"allowAllExcept"in W?"allowAllExcept":"denyAllExcept":"none"}, write: ${X?"allowAllExcept"in X?"allowAllExcept":"denyAllExcept":"none"}`), w
}
// @from(Start 1499702, End 1501206)
function Pm0(A, Q) {
  let B = /CMD64_(.+?)_END/,
    G = /Sandbox:\s+(.+)$/,
    Z = Q?.["*"] || [],
    I = Q ? Object.entries(Q).filter(([J]) => J !== "*") : [],
    Y = W44("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${Om0}")`, "--style", "compact"]);
  return Y.stdout?.on("data", (J) => {
    let W = J.toString().split(`
`),
      X = W.find((C) => C.includes("Sandbox:") && C.includes("deny")),
      V = W.find((C) => C.startsWith("CMD64_"));
    if (!X) return;
    let F = X.match(G);
    if (!F?.[1]) return;
    let K = F[1],
      D, H;
    if (V) {
      if (H = V.match(B)?.[1], H) try {
        D = Xm0(H)
      } catch {}
    }
    if (K.includes("mDNSResponder") || K.includes("mach-lookup com.apple.diagnosticd") || K.includes("mach-lookup com.apple.analyticsd")) return;
    if (Q && D) {
      if (Z.length > 0) {
        if (Z.some((E) => K.includes(E))) return
      }
      for (let [C, E] of I)
        if (D.includes(C)) {
          if (E.some((q) => K.includes(q))) return
        }
    }
    A({
      line: K,
      command: D,
      encodedCommand: H,
      timestamp: new Date
    })
  }), Y.stderr?.on("data", (J) => {
    kQ(`[Sandbox Monitor] Log stream stderr: ${J.toString()}`)
  }), Y.on("error", (J) => {
    kQ(`[Sandbox Monitor] Failed to start log stream: ${J.message}`)
  }), Y.on("exit", (J) => {
    kQ(`[Sandbox Monitor] Log stream exited with code: ${J}`)
  }), () => {
    kQ("[Sandbox Monitor] Stopping log monitor"), Y.kill("SIGTERM")
  }
}
// @from(Start 1501211, End 1501214)
Mm0
// @from(Start 1501216, End 1501219)
Om0
// @from(Start 1501225, End 1501331)
jm0 = L(() => {
  w9A();
  Mm0 = BA(GxA(), 1);
  Om0 = `_${Math.random().toString(36).slice(2,11)}_SBX`
})
// @from(Start 1501333, End 1502285)
class XKA {
  constructor() {
    this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
  }
  addViolation(A) {
    if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
    this.notifyListeners()
  }
  getViolations(A) {
    if (A === void 0) return [...this.violations];
    return this.violations.slice(-A)
  }
  getCount() {
    return this.violations.length
  }
  getTotalCount() {
    return this.totalCount
  }
  getViolationsForCommand(A) {
    let Q = TxA(A);
    return this.violations.filter((B) => B.encodedCommand === Q)
  }
  clear() {
    this.violations = [], this.notifyListeners()
  }
  subscribe(A) {
    return this.listeners.add(A), A(this.getViolations()), () => {
      this.listeners.delete(A)
    }
  }
  notifyListeners() {
    let A = this.getViolations();
    this.listeners.forEach((Q) => Q(A))
  }
}
// @from(Start 1502290, End 1502316)
TH1 = L(() => {
  w9A()
})
// @from(Start 1502386, End 1502636)
function E44() {
  if (Sm0) return;
  let A = () => SH1().catch((Q) => {
    kQ(`Cleanup failed in registerCleanup ${Q}`, {
      level: "error"
    })
  });
  process.once("exit", A), process.once("SIGINT", A), process.once("SIGTERM", A), Sm0 = !0
}
// @from(Start 1502638, End 1502824)
function _m0(A, Q) {
  if (Q.startsWith("*.")) {
    let B = Q.substring(2);
    return A.toLowerCase().endsWith("." + B.toLowerCase())
  }
  return A.toLowerCase() === Q.toLowerCase()
}
// @from(Start 1502825, End 1503551)
async function ym0(A, Q, B) {
  if (!e8) return kQ("No config available, denying network request"), !1;
  for (let G of e8.network.deniedDomains)
    if (_m0(Q, G)) return kQ(`Denied by config rule: ${Q}:${A}`), !1;
  for (let G of e8.network.allowedDomains)
    if (_m0(Q, G)) return kQ(`Allowed by config rule: ${Q}:${A}`), !0;
  if (!B) return kQ(`No matching config rule, denying: ${Q}:${A}`), !1;
  kQ(`No matching config rule, asking user: ${Q}:${A}`);
  try {
    if (await B({
        host: Q,
        port: A
      })) return kQ(`User allowed: ${Q}:${A}`), !0;
    else return kQ(`User denied: ${Q}:${A}`), !1
  } catch (G) {
    return kQ(`Error in permission callback: ${G}`, {
      level: "error"
    }), !1
  }
}
// @from(Start 1503552, End 1504062)
async function z44(A) {
  return q9A = hh0({
    filter: (Q, B) => ym0(Q, B, A)
  }), new Promise((Q, B) => {
    if (!q9A) {
      B(Error("HTTP proxy server undefined before listen"));
      return
    }
    let G = q9A;
    G.once("error", B), G.once("listening", () => {
      let Z = G.address();
      if (Z && typeof Z === "object") G.unref(), kQ(`HTTP proxy listening on localhost:${Z.port}`), Q(Z.port);
      else B(Error("Failed to get proxy server address"))
    }), G.listen(0, "127.0.0.1")
  })
}
// @from(Start 1504063, End 1504358)
async function U44(A) {
  return rs = ah0({
    filter: (Q, B) => ym0(Q, B, A)
  }), new Promise((Q, B) => {
    if (!rs) {
      B(Error("SOCKS proxy server undefined before listen"));
      return
    }
    rs.listen(0, "127.0.0.1").then((G) => {
      rs?.unref(), Q(G)
    }).catch(B)
  })
}
// @from(Start 1504359, End 1505708)
async function $44(A, Q, B = !1) {
  if (_m) {
    await _m;
    return
  }
  if (e8 = A, !vm0()) {
    let G = aN(),
      Z = "Sandbox dependencies are not available on this system.";
    if (G === "linux") Z += " Required: ripgrep (rg), bubblewrap (bwrap), and socat.";
    else if (G === "macos") Z += " Required: ripgrep (rg).";
    else Z += ` Platform '${G}' is not supported.`;
    throw Error(Z)
  }
  if (B && aN() === "macos") SxA = Pm0(_xA.addViolation.bind(_xA), e8.ignoreViolations), kQ("Started macOS sandbox log monitor");
  E44(), _m = (async () => {
    try {
      let G;
      if (e8.network.httpProxyPort !== void 0) G = e8.network.httpProxyPort, kQ(`Using external HTTP proxy on port ${G}`);
      else G = await z44(Q);
      let Z;
      if (e8.network.socksProxyPort !== void 0) Z = e8.network.socksProxyPort, kQ(`Using external SOCKS proxy on port ${Z}`);
      else Z = await U44(Q);
      let I;
      if (aN() === "linux") I = await wm0(G, Z);
      let Y = {
        httpProxyPort: G,
        socksProxyPort: Z,
        linuxBridge: I
      };
      return sN = Y, kQ("Network infrastructure initialized"), Y
    } catch (G) {
      throw _m = void 0, sN = void 0, SH1().catch((Z) => {
        kQ(`Cleanup failed in initializationPromise ${Z}`, {
          level: "error"
        })
      }), G
    }
  })(), await _m
}
// @from(Start 1505710, End 1505769)
function xm0(A) {
  return ["macos", "linux"].includes(A)
}
// @from(Start 1505771, End 1505812)
function w44() {
  return e8 !== void 0
}
// @from(Start 1505814, End 1506062)
function vm0(A) {
  let Q = aN();
  if (!xm0(Q)) return !1;
  if ((A ?? e8?.ripgrep)?.command === void 0) {
    if (!Jm0()) return !1
  }
  if (Q === "linux") {
    let Z = e8?.network?.allowAllUnixSockets ?? !1;
    return $m0(Z)
  }
  return !0
}
// @from(Start 1506064, End 1506326)
function q44() {
  if (!e8) return {
    denyOnly: []
  };
  return {
    denyOnly: e8.filesystem.denyRead.map((Q) => JKA(Q)).filter((Q) => {
      if (aN() === "linux" && qR(Q)) return kQ(`Skipping glob pattern on Linux: ${Q}`), !1;
      return !0
    })
  }
}
// @from(Start 1506328, End 1506857)
function N44() {
  if (!e8) return {
    allowOnly: WKA(),
    denyWithinAllow: []
  };
  let A = e8.filesystem.allowWrite.map((G) => JKA(G)).filter((G) => {
      if (aN() === "linux" && qR(G)) return kQ(`Skipping glob pattern on Linux: ${G}`), !1;
      return !0
    }),
    Q = e8.filesystem.denyWrite.map((G) => JKA(G)).filter((G) => {
      if (aN() === "linux" && qR(G)) return kQ(`Skipping glob pattern on Linux: ${G}`), !1;
      return !0
    });
  return {
    allowOnly: [...WKA(), ...A],
    denyWithinAllow: Q
  }
}
// @from(Start 1506859, End 1507091)
function L44() {
  if (!e8) return {};
  let A = e8.network.allowedDomains,
    Q = e8.network.deniedDomains;
  return {
    ...A.length > 0 && {
      allowedHosts: A
    },
    ...Q.length > 0 && {
      deniedHosts: Q
    }
  }
}
// @from(Start 1507093, End 1507150)
function bm0() {
  return e8?.network?.allowUnixSockets
}
// @from(Start 1507152, End 1507212)
function km0() {
  return e8?.network?.allowAllUnixSockets
}
// @from(Start 1507214, End 1507272)
function fm0() {
  return e8?.network?.allowLocalBinding
}
// @from(Start 1507274, End 1507322)
function hm0() {
  return e8?.ignoreViolations
}
// @from(Start 1507324, End 1507381)
function gm0() {
  return e8?.enableWeakerNestedSandbox
}
// @from(Start 1507383, End 1507449)
function M44() {
  return e8?.ripgrep ?? {
    command: "rg"
  }
}
// @from(Start 1507451, End 1507512)
function O44() {
  return e8?.mandatoryDenySearchDepth ?? 3
}
// @from(Start 1507514, End 1507559)
function um0() {
  return sN?.httpProxyPort
}
// @from(Start 1507561, End 1507607)
function mm0() {
  return sN?.socksProxyPort
}
// @from(Start 1507609, End 1507668)
function dm0() {
  return sN?.linuxBridge?.httpSocketPath
}
// @from(Start 1507670, End 1507730)
function cm0() {
  return sN?.linuxBridge?.socksSocketPath
}
// @from(Start 1507731, End 1507870)
async function pm0() {
  if (!e8) return !1;
  if (_m) try {
    return await _m, !0
  } catch {
    return !1
  }
  return sN !== void 0
}
// @from(Start 1507871, End 1509478)
async function R44(A, Q, B, G) {
  let Z = aN(),
    I = B?.filesystem?.allowWrite ?? e8?.filesystem.allowWrite ?? [],
    Y = {
      allowOnly: [...WKA(), ...I],
      denyWithinAllow: B?.filesystem?.denyWrite ?? e8?.filesystem.denyWrite ?? []
    },
    J = {
      denyOnly: B?.filesystem?.denyRead ?? e8?.filesystem.denyRead ?? []
    },
    W = B?.network?.allowedDomains !== void 0 || e8?.network?.allowedDomains !== void 0,
    X = B?.network?.allowedDomains ?? e8?.network.allowedDomains ?? [],
    V = W,
    F = X.length > 0;
  if (F) await pm0();
  switch (Z) {
    case "macos":
      return Tm0({
        command: A,
        needsNetworkRestriction: V,
        httpProxyPort: F ? um0() : void 0,
        socksProxyPort: F ? mm0() : void 0,
        readConfig: J,
        writeConfig: Y,
        allowUnixSockets: bm0(),
        allowAllUnixSockets: km0(),
        allowLocalBinding: fm0(),
        ignoreViolations: hm0(),
        binShell: Q
      });
    case "linux":
      return qm0({
        command: A,
        needsNetworkRestriction: V,
        httpSocketPath: F ? dm0() : void 0,
        socksSocketPath: F ? cm0() : void 0,
        httpProxyPort: F ? sN?.httpProxyPort : void 0,
        socksProxyPort: F ? sN?.socksProxyPort : void 0,
        readConfig: J,
        writeConfig: Y,
        enableWeakerNestedSandbox: gm0(),
        allowAllUnixSockets: km0(),
        binShell: Q,
        ripgrepConfig: M44(),
        mandatoryDenySearchDepth: O44(),
        abortSignal: G
      });
    default:
      throw Error(`Sandbox configuration is not supported on platform: ${Z}`)
  }
}
// @from(Start 1509480, End 1509510)
function T44() {
  return e8
}
// @from(Start 1509512, End 1509581)
function P44(A) {
  e8 = Yv(A), kQ("Sandbox configuration updated")
}
// @from(Start 1509582, End 1512116)
async function SH1() {
  if (SxA) SxA(), SxA = void 0;
  if (sN?.linuxBridge) {
    let {
      httpSocketPath: Q,
      socksSocketPath: B,
      httpBridgeProcess: G,
      socksBridgeProcess: Z
    } = sN.linuxBridge, I = [];
    if (G.pid && !G.killed) try {
      process.kill(G.pid, "SIGTERM"), kQ("Sent SIGTERM to HTTP bridge process"), I.push(new Promise((Y) => {
        G.once("exit", () => {
          kQ("HTTP bridge process exited"), Y()
        }), setTimeout(() => {
          if (!G.killed) {
            kQ("HTTP bridge did not exit, forcing SIGKILL", {
              level: "warn"
            });
            try {
              if (G.pid) process.kill(G.pid, "SIGKILL")
            } catch {}
          }
          Y()
        }, 5000)
      }))
    } catch (Y) {
      if (Y.code !== "ESRCH") kQ(`Error killing HTTP bridge: ${Y}`, {
        level: "error"
      })
    }
    if (Z.pid && !Z.killed) try {
      process.kill(Z.pid, "SIGTERM"), kQ("Sent SIGTERM to SOCKS bridge process"), I.push(new Promise((Y) => {
        Z.once("exit", () => {
          kQ("SOCKS bridge process exited"), Y()
        }), setTimeout(() => {
          if (!Z.killed) {
            kQ("SOCKS bridge did not exit, forcing SIGKILL", {
              level: "warn"
            });
            try {
              if (Z.pid) process.kill(Z.pid, "SIGKILL")
            } catch {}
          }
          Y()
        }, 5000)
      }))
    } catch (Y) {
      if (Y.code !== "ESRCH") kQ(`Error killing SOCKS bridge: ${Y}`, {
        level: "error"
      })
    }
    if (await Promise.all(I), Q) try {
      jH1.rmSync(Q, {
        force: !0
      }), kQ("Cleaned up HTTP socket")
    } catch (Y) {
      kQ(`HTTP socket cleanup error: ${Y}`, {
        level: "error"
      })
    }
    if (B) try {
      jH1.rmSync(B, {
        force: !0
      }), kQ("Cleaned up SOCKS socket")
    } catch (Y) {
      kQ(`SOCKS socket cleanup error: ${Y}`, {
        level: "error"
      })
    }
  }
  let A = [];
  if (q9A) {
    let Q = q9A,
      B = new Promise((G) => {
        Q.close((Z) => {
          if (Z && Z.message !== "Server is not running.") kQ(`Error closing HTTP proxy server: ${Z.message}`, {
            level: "error"
          });
          G()
        })
      });
    A.push(B)
  }
  if (rs) {
    let Q = rs.close().catch((B) => {
      kQ(`Error closing SOCKS proxy server: ${B.message}`, {
        level: "error"
      })
    });
    A.push(Q)
  }
  await Promise.all(A), q9A = void 0, rs = void 0, sN = void 0, _m = void 0
}
// @from(Start 1512118, End 1512149)
function j44() {
  return _xA
}
// @from(Start 1512151, End 1512403)
function S44(A, Q) {
  if (!e8) return Q;
  let B = _xA.getViolationsForCommand(A);
  if (B.length === 0) return Q;
  let G = Q;
  G += PH1 + "<sandbox_violations>" + PH1;
  for (let Z of B) G += Z.line + PH1;
  return G += "</sandbox_violations>", G
}
// @from(Start 1512405, End 1512654)
function _44() {
  if (aN() !== "linux" || !e8) return [];
  let A = [],
    Q = [...e8.filesystem.denyRead, ...e8.filesystem.allowWrite, ...e8.filesystem.denyWrite];
  for (let B of Q) {
    let G = JKA(B);
    if (qR(G)) A.push(B)
  }
  return A
}
// @from(Start 1512659, End 1512661)
e8
// @from(Start 1512663, End 1512666)
q9A
// @from(Start 1512668, End 1512670)
rs
// @from(Start 1512672, End 1512674)
sN
// @from(Start 1512676, End 1512678)
_m
// @from(Start 1512680, End 1512688)
Sm0 = !1
// @from(Start 1512692, End 1512695)
SxA
// @from(Start 1512697, End 1512700)
_xA
// @from(Start 1512702, End 1512704)
xI
// @from(Start 1512710, End 1513518)
lm0 = L(() => {
  gh0();
  sh0();
  $9A();
  Nm0();
  jm0();
  w9A();
  zH1();
  TH1();
  _xA = new XKA;
  xI = {
    initialize: $44,
    isSupportedPlatform: xm0,
    isSandboxingEnabled: w44,
    checkDependencies: vm0,
    getFsReadConfig: q44,
    getFsWriteConfig: N44,
    getNetworkRestrictionConfig: L44,
    getAllowUnixSockets: bm0,
    getAllowLocalBinding: fm0,
    getIgnoreViolations: hm0,
    getEnableWeakerNestedSandbox: gm0,
    getProxyPort: um0,
    getSocksProxyPort: mm0,
    getLinuxHttpSocketPath: dm0,
    getLinuxSocksSocketPath: cm0,
    waitForNetworkInitialization: pm0,
    wrapWithSandbox: R44,
    reset: SH1,
    getSandboxViolationStore: j44,
    annotateStderrWithSandboxFailures: S44,
    getLinuxGlobPatternWarnings: _44,
    getConfig: T44,
    updateConfig: P44
  }
})
// @from(Start 1513524, End 1513526)
i6
// @from(Start 1513528, End 1513531)
_H1
// @from(Start 1513533, End 1513535)
tQ
// @from(Start 1513537, End 1514386)
QS = (A) => {
  switch (typeof A) {
    case "undefined":
      return tQ.undefined;
    case "string":
      return tQ.string;
    case "number":
      return Number.isNaN(A) ? tQ.nan : tQ.number;
    case "boolean":
      return tQ.boolean;
    case "function":
      return tQ.function;
    case "bigint":
      return tQ.bigint;
    case "symbol":
      return tQ.symbol;
    case "object":
      if (Array.isArray(A)) return tQ.array;
      if (A === null) return tQ.null;
      if (A.then && typeof A.then === "function" && A.catch && typeof A.catch === "function") return tQ.promise;
      if (typeof Map < "u" && A instanceof Map) return tQ.map;
      if (typeof Set < "u" && A instanceof Set) return tQ.set;
      if (typeof Date < "u" && A instanceof Date) return tQ.date;
      return tQ.object;
    default:
      return tQ.unknown
  }
}
// @from(Start 1514392, End 1516051)
VKA = L(() => {
  (function(A) {
    A.assertEqual = (Z) => {};

    function Q(Z) {}
    A.assertIs = Q;

    function B(Z) {
      throw Error()
    }
    A.assertNever = B, A.arrayToEnum = (Z) => {
      let I = {};
      for (let Y of Z) I[Y] = Y;
      return I
    }, A.getValidEnumValues = (Z) => {
      let I = A.objectKeys(Z).filter((J) => typeof Z[Z[J]] !== "number"),
        Y = {};
      for (let J of I) Y[J] = Z[J];
      return A.objectValues(Y)
    }, A.objectValues = (Z) => {
      return A.objectKeys(Z).map(function(I) {
        return Z[I]
      })
    }, A.objectKeys = typeof Object.keys === "function" ? (Z) => Object.keys(Z) : (Z) => {
      let I = [];
      for (let Y in Z)
        if (Object.prototype.hasOwnProperty.call(Z, Y)) I.push(Y);
      return I
    }, A.find = (Z, I) => {
      for (let Y of Z)
        if (I(Y)) return Y;
      return
    }, A.isInteger = typeof Number.isInteger === "function" ? (Z) => Number.isInteger(Z) : (Z) => typeof Z === "number" && Number.isFinite(Z) && Math.floor(Z) === Z;

    function G(Z, I = " | ") {
      return Z.map((Y) => typeof Y === "string" ? `'${Y}'` : Y).join(I)
    }
    A.joinValues = G, A.jsonStringifyReplacer = (Z, I) => {
      if (typeof I === "bigint") return I.toString();
      return I
    }
  })(i6 || (i6 = {}));
  (function(A) {
    A.mergeShapes = (Q, B) => {
      return {
        ...Q,
        ...B
      }
    }
  })(_H1 || (_H1 = {}));
  tQ = i6.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"])
})
// @from(Start 1516057, End 1516059)
qQ
// @from(Start 1516061, End 1516147)
k44 = (A) => {
    return JSON.stringify(A, null, 2).replace(/"([^"]+)":/g, "$1:")
  }
// @from(Start 1516151, End 1516153)
dz
// @from(Start 1516159, End 1518633)
kxA = L(() => {
  VKA();
  qQ = i6.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
  dz = class dz extends Error {
    get errors() {
      return this.issues
    }
    constructor(A) {
      super();
      this.issues = [], this.addIssue = (B) => {
        this.issues = [...this.issues, B]
      }, this.addIssues = (B = []) => {
        this.issues = [...this.issues, ...B]
      };
      let Q = new.target.prototype;
      if (Object.setPrototypeOf) Object.setPrototypeOf(this, Q);
      else this.__proto__ = Q;
      this.name = "ZodError", this.issues = A
    }
    format(A) {
      let Q = A || function(Z) {
          return Z.message
        },
        B = {
          _errors: []
        },
        G = (Z) => {
          for (let I of Z.issues)
            if (I.code === "invalid_union") I.unionErrors.map(G);
            else if (I.code === "invalid_return_type") G(I.returnTypeError);
          else if (I.code === "invalid_arguments") G(I.argumentsError);
          else if (I.path.length === 0) B._errors.push(Q(I));
          else {
            let Y = B,
              J = 0;
            while (J < I.path.length) {
              let W = I.path[J];
              if (J !== I.path.length - 1) Y[W] = Y[W] || {
                _errors: []
              };
              else Y[W] = Y[W] || {
                _errors: []
              }, Y[W]._errors.push(Q(I));
              Y = Y[W], J++
            }
          }
        };
      return G(this), B
    }
    static assert(A) {
      if (!(A instanceof dz)) throw Error(`Not a ZodError: ${A}`)
    }
    toString() {
      return this.message
    }
    get message() {
      return JSON.stringify(this.issues, i6.jsonStringifyReplacer, 2)
    }
    get isEmpty() {
      return this.issues.length === 0
    }
    flatten(A = (Q) => Q.message) {
      let Q = {},
        B = [];
      for (let G of this.issues)
        if (G.path.length > 0) {
          let Z = G.path[0];
          Q[Z] = Q[Z] || [], Q[Z].push(A(G))
        } else B.push(A(G));
      return {
        formErrors: B,
        fieldErrors: Q
      }
    }
    get formErrors() {
      return this.flatten()
    }
  };
  dz.create = (A) => {
    return new dz(A)
  }
})
// @from(Start 1518639, End 1522567)
y44 = (A, Q) => {
    let B;
    switch (A.code) {
      case qQ.invalid_type:
        if (A.received === tQ.undefined) B = "Required";
        else B = `Expected ${A.expected}, received ${A.received}`;
        break;
      case qQ.invalid_literal:
        B = `Invalid literal value, expected ${JSON.stringify(A.expected,i6.jsonStringifyReplacer)}`;
        break;
      case qQ.unrecognized_keys:
        B = `Unrecognized key(s) in object: ${i6.joinValues(A.keys,", ")}`;
        break;
      case qQ.invalid_union:
        B = "Invalid input";
        break;
      case qQ.invalid_union_discriminator:
        B = `Invalid discriminator value. Expected ${i6.joinValues(A.options)}`;
        break;
      case qQ.invalid_enum_value:
        B = `Invalid enum value. Expected ${i6.joinValues(A.options)}, received '${A.received}'`;
        break;
      case qQ.invalid_arguments:
        B = "Invalid function arguments";
        break;
      case qQ.invalid_return_type:
        B = "Invalid function return type";
        break;
      case qQ.invalid_date:
        B = "Invalid date";
        break;
      case qQ.invalid_string:
        if (typeof A.validation === "object")
          if ("includes" in A.validation) {
            if (B = `Invalid input: must include "${A.validation.includes}"`, typeof A.validation.position === "number") B = `${B} at one or more positions greater than or equal to ${A.validation.position}`
          } else if ("startsWith" in A.validation) B = `Invalid input: must start with "${A.validation.startsWith}"`;
        else if ("endsWith" in A.validation) B = `Invalid input: must end with "${A.validation.endsWith}"`;
        else i6.assertNever(A.validation);
        else if (A.validation !== "regex") B = `Invalid ${A.validation}`;
        else B = "Invalid";
        break;
      case qQ.too_small:
        if (A.type === "array") B = `Array must contain ${A.exact?"exactly":A.inclusive?"at least":"more than"} ${A.minimum} element(s)`;
        else if (A.type === "string") B = `String must contain ${A.exact?"exactly":A.inclusive?"at least":"over"} ${A.minimum} character(s)`;
        else if (A.type === "number") B = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
        else if (A.type === "bigint") B = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
        else if (A.type === "date") B = `Date must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(A.minimum))}`;
        else B = "Invalid input";
        break;
      case qQ.too_big:
        if (A.type === "array") B = `Array must contain ${A.exact?"exactly":A.inclusive?"at most":"less than"} ${A.maximum} element(s)`;
        else if (A.type === "string") B = `String must contain ${A.exact?"exactly":A.inclusive?"at most":"under"} ${A.maximum} character(s)`;
        else if (A.type === "number") B = `Number must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
        else if (A.type === "bigint") B = `BigInt must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
        else if (A.type === "date") B = `Date must be ${A.exact?"exactly":A.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(A.maximum))}`;
        else B = "Invalid input";
        break;
      case qQ.custom:
        B = "Invalid input";
        break;
      case qQ.invalid_intersection_types:
        B = "Intersection results could not be merged";
        break;
      case qQ.not_multiple_of:
        B = `Number must be a multiple of ${A.multipleOf}`;
        break;
      case qQ.not_finite:
        B = "Number must be finite";
        break;
      default:
        B = Q.defaultError, i6.assertNever(A)
    }
    return {
      message: B
    }
  }
// @from(Start 1522571, End 1522573)
Wv
// @from(Start 1522579, End 1522626)
kH1 = L(() => {
  kxA();
  VKA();
  Wv = y44
})
// @from(Start 1522629, End 1522658)
function x44(A) {
  im0 = A
}
// @from(Start 1522660, End 1522691)
function N9A() {
  return im0
}
// @from(Start 1522696, End 1522699)
im0
// @from(Start 1522705, End 1522743)
yxA = L(() => {
  kH1();
  im0 = Wv
})
// @from(Start 1522746, End 1523003)
function wB(A, Q) {
  let B = N9A(),
    G = FKA({
      issueData: Q,
      data: A.data,
      path: A.path,
      errorMaps: [A.common.contextualErrorMap, A.schemaErrorMap, B, B === Wv ? void 0 : Wv].filter((Z) => !!Z)
    });
  A.common.issues.push(G)
}
// @from(Start 1523004, End 1524155)
class pK {
  constructor() {
    this.value = "valid"
  }
  dirty() {
    if (this.value === "valid") this.value = "dirty"
  }
  abort() {
    if (this.value !== "aborted") this.value = "aborted"
  }
  static mergeArray(A, Q) {
    let B = [];
    for (let G of Q) {
      if (G.status === "aborted") return t9;
      if (G.status === "dirty") A.dirty();
      B.push(G.value)
    }
    return {
      status: A.value,
      value: B
    }
  }
  static async mergeObjectAsync(A, Q) {
    let B = [];
    for (let G of Q) {
      let Z = await G.key,
        I = await G.value;
      B.push({
        key: Z,
        value: I
      })
    }
    return pK.mergeObjectSync(A, B)
  }
  static mergeObjectSync(A, Q) {
    let B = {};
    for (let G of Q) {
      let {
        key: Z,
        value: I
      } = G;
      if (Z.status === "aborted") return t9;
      if (I.status === "aborted") return t9;
      if (Z.status === "dirty") A.dirty();
      if (I.status === "dirty") A.dirty();
      if (Z.value !== "__proto__" && (typeof I.value < "u" || G.alwaysSet)) B[Z.value] = I.value
    }
    return {
      status: A.value,
      value: B
    }
  }
}
// @from(Start 1524160, End 1524648)
FKA = (A) => {
    let {
      data: Q,
      path: B,
      errorMaps: G,
      issueData: Z
    } = A, I = [...B, ...Z.path || []], Y = {
      ...Z,
      path: I
    };
    if (Z.message !== void 0) return {
      ...Z,
      path: I,
      message: Z.message
    };
    let J = "",
      W = G.filter((X) => !!X).slice().reverse();
    for (let X of W) J = X(Y, {
      data: Q,
      defaultError: J
    }).message;
    return {
      ...Z,
      path: I,
      message: J
    }
  }
// @from(Start 1524652, End 1524655)
v44
// @from(Start 1524657, End 1524659)
t9
// @from(Start 1524661, End 1524714)
os = (A) => ({
    status: "dirty",
    value: A
  })
// @from(Start 1524718, End 1524771)
zH = (A) => ({
    status: "valid",
    value: A
  })
// @from(Start 1524775, End 1524810)
xxA = (A) => A.status === "aborted"
// @from(Start 1524814, End 1524847)
vxA = (A) => A.status === "dirty"
// @from(Start 1524851, End 1524883)
km = (A) => A.status === "valid"
// @from(Start 1524887, End 1524944)
L9A = (A) => typeof Promise < "u" && A instanceof Promise
// @from(Start 1524950, End 1525048)
yH1 = L(() => {
  yxA();
  kH1();
  v44 = [];
  t9 = Object.freeze({
    status: "aborted"
  })
})
// @from(Start 1525054, End 1525068)
nm0 = () => {}
// @from(Start 1525074, End 1525076)
g2
// @from(Start 1525082, End 1525282)
am0 = L(() => {
  (function(A) {
    A.errToObj = (Q) => typeof Q === "string" ? {
      message: Q
    } : Q || {}, A.toString = (Q) => typeof Q === "string" ? Q : Q?.message
  })(g2 || (g2 = {}))
})
// @from(Start 1525284, End 1525646)
class RR {
  constructor(A, Q, B, G) {
    this._cachedPath = [], this.parent = A, this.data = Q, this._path = B, this._key = G
  }
  get path() {
    if (!this._cachedPath.length)
      if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
      else this._cachedPath.push(...this._path, this._key);
    return this._cachedPath
  }
}
// @from(Start 1525648, End 1526427)
function k8(A) {
  if (!A) return {};
  let {
    errorMap: Q,
    invalid_type_error: B,
    required_error: G,
    description: Z
  } = A;
  if (Q && (B || G)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  if (Q) return {
    errorMap: Q,
    description: Z
  };
  return {
    errorMap: (Y, J) => {
      let {
        message: W
      } = A;
      if (Y.code === "invalid_enum_value") return {
        message: W ?? J.defaultError
      };
      if (typeof J.data > "u") return {
        message: W ?? G ?? J.defaultError
      };
      if (Y.code !== "invalid_type") return {
        message: J.defaultError
      };
      return {
        message: W ?? B ?? J.defaultError
      }
    },
    description: Z
  }
}
// @from(Start 1526428, End 1532739)
class X6 {
  get description() {
    return this._def.description
  }
  _getType(A) {
    return QS(A.data)
  }
  _getOrReturnCtx(A, Q) {
    return Q || {
      common: A.parent.common,
      data: A.data,
      parsedType: QS(A.data),
      schemaErrorMap: this._def.errorMap,
      path: A.path,
      parent: A.parent
    }
  }
  _processInputParams(A) {
    return {
      status: new pK,
      ctx: {
        common: A.parent.common,
        data: A.data,
        parsedType: QS(A.data),
        schemaErrorMap: this._def.errorMap,
        path: A.path,
        parent: A.parent
      }
    }
  }
  _parseSync(A) {
    let Q = this._parse(A);
    if (L9A(Q)) throw Error("Synchronous parse encountered promise.");
    return Q
  }
  _parseAsync(A) {
    let Q = this._parse(A);
    return Promise.resolve(Q)
  }
  parse(A, Q) {
    let B = this.safeParse(A, Q);
    if (B.success) return B.data;
    throw B.error
  }
  safeParse(A, Q) {
    let B = {
        common: {
          issues: [],
          async: Q?.async ?? !1,
          contextualErrorMap: Q?.errorMap
        },
        path: Q?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: A,
        parsedType: QS(A)
      },
      G = this._parseSync({
        data: A,
        path: B.path,
        parent: B
      });
    return sm0(B, G)
  }
  "~validate"(A) {
    let Q = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: A,
      parsedType: QS(A)
    };
    if (!this["~standard"].async) try {
      let B = this._parseSync({
        data: A,
        path: [],
        parent: Q
      });
      return km(B) ? {
        value: B.value
      } : {
        issues: Q.common.issues
      }
    } catch (B) {
      if (B?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = !0;
      Q.common = {
        issues: [],
        async: !0
      }
    }
    return this._parseAsync({
      data: A,
      path: [],
      parent: Q
    }).then((B) => km(B) ? {
      value: B.value
    } : {
      issues: Q.common.issues
    })
  }
  async parseAsync(A, Q) {
    let B = await this.safeParseAsync(A, Q);
    if (B.success) return B.data;
    throw B.error
  }
  async safeParseAsync(A, Q) {
    let B = {
        common: {
          issues: [],
          contextualErrorMap: Q?.errorMap,
          async: !0
        },
        path: Q?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: A,
        parsedType: QS(A)
      },
      G = this._parse({
        data: A,
        path: B.path,
        parent: B
      }),
      Z = await (L9A(G) ? G : Promise.resolve(G));
    return sm0(B, Z)
  }
  refine(A, Q) {
    let B = (G) => {
      if (typeof Q === "string" || typeof Q > "u") return {
        message: Q
      };
      else if (typeof Q === "function") return Q(G);
      else return Q
    };
    return this._refinement((G, Z) => {
      let I = A(G),
        Y = () => Z.addIssue({
          code: qQ.custom,
          ...B(G)
        });
      if (typeof Promise < "u" && I instanceof Promise) return I.then((J) => {
        if (!J) return Y(), !1;
        else return !0
      });
      if (!I) return Y(), !1;
      else return !0
    })
  }
  refinement(A, Q) {
    return this._refinement((B, G) => {
      if (!A(B)) return G.addIssue(typeof Q === "function" ? Q(B, G) : Q), !1;
      else return !0
    })
  }
  _refinement(A) {
    return new TR({
      schema: this,
      typeName: PQ.ZodEffects,
      effect: {
        type: "refinement",
        refinement: A
      }
    })
  }
  superRefine(A) {
    return this._refinement(A)
  }
  constructor(A) {
    this.spa = this.safeParseAsync, this._def = A, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (Q) => this["~validate"](Q)
    }
  }
  optional() {
    return e$.create(this, this._def)
  }
  nullable() {
    return Vv.create(this, this._def)
  }
  nullish() {
    return this.nullable().optional()
  }
  array() {
    return OR.create(this)
  }
  promise() {
    return Qr.create(this, this._def)
  }
  or(A) {
    return j9A.create([this, A], this._def)
  }
  and(A) {
    return S9A.create(this, A, this._def)
  }
  transform(A) {
    return new TR({
      ...k8(this._def),
      schema: this,
      typeName: PQ.ZodEffects,
      effect: {
        type: "transform",
        transform: A
      }
    })
  }
  default (A) {
    let Q = typeof A === "function" ? A : () => A;
    return new x9A({
      ...k8(this._def),
      innerType: this,
      defaultValue: Q,
      typeName: PQ.ZodDefault
    })
  }
  brand() {
    return new fxA({
      typeName: PQ.ZodBranded,
      type: this,
      ...k8(this._def)
    })
  } catch (A) {
    let Q = typeof A === "function" ? A : () => A;
    return new v9A({
      ...k8(this._def),
      innerType: this,
      catchValue: Q,
      typeName: PQ.ZodCatch
    })
  }
  describe(A) {
    return new this.constructor({
      ...this._def,
      description: A
    })
  }
  pipe(A) {
    return zKA.create(this, A)
  }
  readonly() {
    return b9A.create(this)
  }
  isOptional() {
    return this.safeParse(void 0).success
  }
  isNullable() {
    return this.safeParse(null).success
  }
}
// @from(Start 1532741, End 1532972)
function tm0(A) {
  let Q = "[0-5]\\d";
  if (A.precision) Q = `${Q}\\.\\d{${A.precision}}`;
  else if (A.precision == null) Q = `${Q}(\\.\\d+)?`;
  let B = A.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${Q})${B}`
}
// @from(Start 1532974, End 1533028)
function t44(A) {
  return new RegExp(`^${tm0(A)}$`)
}
// @from(Start 1533030, End 1533227)
function em0(A) {
  let Q = `${om0}T${tm0(A)}`,
    B = [];
  if (B.push(A.local ? "Z?" : "Z"), A.offset) B.push("([+-]\\d{2}:?\\d{2})");
  return Q = `${Q}(${B.join("|")})`, new RegExp(`^${Q}$`)
}
// @from(Start 1533229, End 1533367)
function e44(A, Q) {
  if ((Q === "v4" || !Q) && l44.test(A)) return !0;
  if ((Q === "v6" || !Q) && n44.test(A)) return !0;
  return !1
}
// @from(Start 1533369, End 1533827)
function A84(A, Q) {
  if (!m44.test(A)) return !1;
  try {
    let [B] = A.split(".");
    if (!B) return !1;
    let G = B.replace(/-/g, "+").replace(/_/g, "/").padEnd(B.length + (4 - B.length % 4) % 4, "="),
      Z = JSON.parse(atob(G));
    if (typeof Z !== "object" || Z === null) return !1;
    if ("typ" in Z && Z?.typ !== "JWT") return !1;
    if (!Z.alg) return !1;
    if (Q && Z.alg !== Q) return !1;
    return !0
  } catch {
    return !1
  }
}
// @from(Start 1533829, End 1533967)
function Q84(A, Q) {
  if ((Q === "v4" || !Q) && i44.test(A)) return !0;
  if ((Q === "v6" || !Q) && a44.test(A)) return !0;
  return !1
}
// @from(Start 1533969, End 1534255)
function B84(A, Q) {
  let B = (A.toString().split(".")[1] || "").length,
    G = (Q.toString().split(".")[1] || "").length,
    Z = B > G ? B : G,
    I = Number.parseInt(A.toFixed(Z).replace(".", "")),
    Y = Number.parseInt(Q.toFixed(Z).replace(".", ""));
  return I % Y / 10 ** Z
}
// @from(Start 1534257, End 1534782)
function M9A(A) {
  if (A instanceof kY) {
    let Q = {};
    for (let B in A.shape) {
      let G = A.shape[B];
      Q[B] = e$.create(M9A(G))
    }
    return new kY({
      ...A._def,
      shape: () => Q
    })
  } else if (A instanceof OR) return new OR({
    ...A._def,
    type: M9A(A.element)
  });
  else if (A instanceof e$) return e$.create(M9A(A.unwrap()));
  else if (A instanceof Vv) return Vv.create(M9A(A.unwrap()));
  else if (A instanceof GS) return GS.create(A.items.map((Q) => M9A(Q)));
  else return A
}
// @from(Start 1534784, End 1535766)
function vH1(A, Q) {
  let B = QS(A),
    G = QS(Q);
  if (A === Q) return {
    valid: !0,
    data: A
  };
  else if (B === tQ.object && G === tQ.object) {
    let Z = i6.objectKeys(Q),
      I = i6.objectKeys(A).filter((J) => Z.indexOf(J) !== -1),
      Y = {
        ...A,
        ...Q
      };
    for (let J of I) {
      let W = vH1(A[J], Q[J]);
      if (!W.valid) return {
        valid: !1
      };
      Y[J] = W.data
    }
    return {
      valid: !0,
      data: Y
    }
  } else if (B === tQ.array && G === tQ.array) {
    if (A.length !== Q.length) return {
      valid: !1
    };
    let Z = [];
    for (let I = 0; I < A.length; I++) {
      let Y = A[I],
        J = Q[I],
        W = vH1(Y, J);
      if (!W.valid) return {
        valid: !1
      };
      Z.push(W.data)
    }
    return {
      valid: !0,
      data: Z
    }
  } else if (B === tQ.date && G === tQ.date && +A === +Q) return {
    valid: !0,
    data: A
  };
  else return {
    valid: !1
  }
}
// @from(Start 1535768, End 1535867)
function Ad0(A, Q) {
  return new bm({
    values: A,
    typeName: PQ.ZodEnum,
    ...k8(Q)
  })
}
// @from(Start 1535869, End 1536042)
function rm0(A, Q) {
  let B = typeof A === "function" ? A(Q) : typeof A === "string" ? {
    message: A
  } : A;
  return typeof B === "string" ? {
    message: B
  } : B
}
// @from(Start 1536044, End 1536581)
function Qd0(A, Q = {}, B) {
  if (A) return es.create().superRefine((G, Z) => {
    let I = A(G);
    if (I instanceof Promise) return I.then((Y) => {
      if (!Y) {
        let J = rm0(Q, G),
          W = J.fatal ?? B ?? !0;
        Z.addIssue({
          code: "custom",
          ...J,
          fatal: W
        })
      }
    });
    if (!I) {
      let Y = rm0(Q, G),
        J = Y.fatal ?? B ?? !0;
      Z.addIssue({
        code: "custom",
        ...Y,
        fatal: J
      })
    }
    return
  });
  return es.create()
}
// @from(Start 1536586, End 1536999)
sm0 = (A, Q) => {
    if (km(Q)) return {
      success: !0,
      data: Q.value
    };
    else {
      if (!A.common.issues.length) throw Error("Validation failed but no issues detected.");
      return {
        success: !1,
        get error() {
          if (this._error) return this._error;
          let B = new dz(A.common.issues);
          return this._error = B, this._error
        }
      }
    }
  }
// @from(Start 1537003, End 1537006)
b44
// @from(Start 1537008, End 1537011)
f44
// @from(Start 1537013, End 1537016)
h44
// @from(Start 1537018, End 1537021)
g44
// @from(Start 1537023, End 1537026)
u44
// @from(Start 1537028, End 1537031)
m44
// @from(Start 1537033, End 1537036)
d44
// @from(Start 1537038, End 1537041)
c44
// @from(Start 1537043, End 1537103)
p44 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$"
// @from(Start 1537107, End 1537110)
xH1
// @from(Start 1537112, End 1537115)
l44
// @from(Start 1537117, End 1537120)
i44
// @from(Start 1537122, End 1537125)
n44
// @from(Start 1537127, End 1537130)
a44
// @from(Start 1537132, End 1537135)
s44
// @from(Start 1537137, End 1537140)
r44
// @from(Start 1537142, End 1537343)
om0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))"
// @from(Start 1537347, End 1537350)
o44
// @from(Start 1537352, End 1537354)
MR
// @from(Start 1537356, End 1537358)
xm
// @from(Start 1537360, End 1537362)
vm
// @from(Start 1537364, End 1537367)
R9A
// @from(Start 1537369, End 1537371)
ts
// @from(Start 1537373, End 1537376)
KKA
// @from(Start 1537378, End 1537381)
T9A
// @from(Start 1537383, End 1537386)
P9A
// @from(Start 1537388, End 1537390)
es
// @from(Start 1537392, End 1537394)
ym
// @from(Start 1537396, End 1537398)
BS
// @from(Start 1537400, End 1537403)
DKA
// @from(Start 1537405, End 1537407)
OR
// @from(Start 1537409, End 1537411)
kY
// @from(Start 1537413, End 1537416)
j9A
// @from(Start 1537418, End 1538169)
Xv = (A) => {
    if (A instanceof _9A) return Xv(A.schema);
    else if (A instanceof TR) return Xv(A.innerType());
    else if (A instanceof k9A) return [A.value];
    else if (A instanceof bm) return A.options;
    else if (A instanceof y9A) return i6.objectValues(A.enum);
    else if (A instanceof x9A) return Xv(A._def.innerType);
    else if (A instanceof T9A) return [void 0];
    else if (A instanceof P9A) return [null];
    else if (A instanceof e$) return [void 0, ...Xv(A.unwrap())];
    else if (A instanceof Vv) return [null, ...Xv(A.unwrap())];
    else if (A instanceof fxA) return Xv(A.unwrap());
    else if (A instanceof b9A) return Xv(A.unwrap());
    else if (A instanceof v9A) return Xv(A._def.innerType);
    else return []
  }
// @from(Start 1538173, End 1538176)
bxA
// @from(Start 1538178, End 1538181)
S9A
// @from(Start 1538183, End 1538185)
GS
// @from(Start 1538187, End 1538190)
HKA
// @from(Start 1538192, End 1538195)
CKA
// @from(Start 1538197, End 1538199)
Ar
// @from(Start 1538201, End 1538204)
O9A
// @from(Start 1538206, End 1538209)
_9A
// @from(Start 1538211, End 1538214)
k9A
// @from(Start 1538216, End 1538218)
bm
// @from(Start 1538220, End 1538223)
y9A
// @from(Start 1538225, End 1538227)
Qr
// @from(Start 1538229, End 1538231)
TR
// @from(Start 1538233, End 1538235)
e$
// @from(Start 1538237, End 1538239)
Vv
// @from(Start 1538241, End 1538244)
x9A
// @from(Start 1538246, End 1538249)
v9A
// @from(Start 1538251, End 1538254)
EKA
// @from(Start 1538256, End 1538259)
G84
// @from(Start 1538261, End 1538264)
fxA
// @from(Start 1538266, End 1538269)
zKA
// @from(Start 1538271, End 1538274)
b9A
// @from(Start 1538276, End 1538279)
Z84
// @from(Start 1538281, End 1538283)
PQ
// @from(Start 1538285, End 1538385)
I84 = (A, Q = {
    message: `Input not instance of ${A.name}`
  }) => Qd0((B) => B instanceof A, Q)
// @from(Start 1538389, End 1538391)
CQ
// @from(Start 1538393, End 1538395)
rN
// @from(Start 1538397, End 1538400)
Y84
// @from(Start 1538402, End 1538405)
J84
// @from(Start 1538407, End 1538409)
$F
// @from(Start 1538411, End 1538414)
W84
// @from(Start 1538416, End 1538419)
X84
// @from(Start 1538421, End 1538424)
V84
// @from(Start 1538426, End 1538429)
F84
// @from(Start 1538431, End 1538434)
K84
// @from(Start 1538436, End 1538439)
D84
// @from(Start 1538441, End 1538444)
H84
// @from(Start 1538446, End 1538449)
C84
// @from(Start 1538451, End 1538453)
zJ
// @from(Start 1538455, End 1538457)
Aw
// @from(Start 1538459, End 1538461)
Qw
// @from(Start 1538463, End 1538465)
Br
// @from(Start 1538467, End 1538470)
E84
// @from(Start 1538472, End 1538475)
z84
// @from(Start 1538477, End 1538480)
U84
// @from(Start 1538482, End 1538484)
PR
// @from(Start 1538486, End 1538489)
$84
// @from(Start 1538491, End 1538494)
w84
// @from(Start 1538496, End 1538499)
q84
// @from(Start 1538501, End 1538504)
N84
// @from(Start 1538506, End 1538509)
L84
// @from(Start 1538511, End 1538513)
jR
// @from(Start 1538515, End 1538518)
M84
// @from(Start 1538520, End 1538523)
O84
// @from(Start 1538525, End 1538528)
R84
// @from(Start 1538530, End 1538533)
T84
// @from(Start 1538535, End 1538538)
P84
// @from(Start 1538540, End 1538543)
j84
// @from(Start 1538545, End 1538548)
S84
// @from(Start 1538550, End 1538577)
_84 = () => CQ().optional()
// @from(Start 1538581, End 1538608)
k84 = () => rN().optional()
// @from(Start 1538612, End 1538639)
y84 = () => $F().optional()
// @from(Start 1538643, End 1538646)
x84
// @from(Start 1538648, End 1538651)
v84
// @from(Start 1538657, End 1604532)
Bd0 = L(() => {
  kxA();
  yxA();
  am0();
  yH1();
  VKA();
  b44 = /^c[^\s-]{8,}$/i, f44 = /^[0-9a-z]+$/, h44 = /^[0-9A-HJKMNP-TV-Z]{26}$/i, g44 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, u44 = /^[a-z0-9_-]{21}$/i, m44 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, d44 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, c44 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, l44 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, i44 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, n44 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, a44 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, s44 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, r44 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, o44 = new RegExp(`^${om0}$`);
  MR = class MR extends X6 {
    _parse(A) {
      if (this._def.coerce) A.data = String(A.data);
      if (this._getType(A) !== tQ.string) {
        let Z = this._getOrReturnCtx(A);
        return wB(Z, {
          code: qQ.invalid_type,
          expected: tQ.string,
          received: Z.parsedType
        }), t9
      }
      let B = new pK,
        G = void 0;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (A.data.length < Z.value) G = this._getOrReturnCtx(A, G), wB(G, {
            code: qQ.too_small,
            minimum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: Z.message
          }), B.dirty()
        } else if (Z.kind === "max") {
        if (A.data.length > Z.value) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.too_big,
          maximum: Z.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "length") {
        let I = A.data.length > Z.value,
          Y = A.data.length < Z.value;
        if (I || Y) {
          if (G = this._getOrReturnCtx(A, G), I) wB(G, {
            code: qQ.too_big,
            maximum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: Z.message
          });
          else if (Y) wB(G, {
            code: qQ.too_small,
            minimum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: Z.message
          });
          B.dirty()
        }
      } else if (Z.kind === "email") {
        if (!c44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "email",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "emoji") {
        if (!xH1) xH1 = new RegExp(p44, "u");
        if (!xH1.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "emoji",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "uuid") {
        if (!g44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "uuid",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "nanoid") {
        if (!u44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "nanoid",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cuid") {
        if (!b44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "cuid",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cuid2") {
        if (!f44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "cuid2",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "ulid") {
        if (!h44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "ulid",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "url") try {
        new URL(A.data)
      } catch {
        G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "url",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "regex") {
        if (Z.regex.lastIndex = 0, !Z.regex.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "regex",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "trim") A.data = A.data.trim();
      else if (Z.kind === "includes") {
        if (!A.data.includes(Z.value, Z.position)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: {
            includes: Z.value,
            position: Z.position
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "toLowerCase") A.data = A.data.toLowerCase();
      else if (Z.kind === "toUpperCase") A.data = A.data.toUpperCase();
      else if (Z.kind === "startsWith") {
        if (!A.data.startsWith(Z.value)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: {
            startsWith: Z.value
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "endsWith") {
        if (!A.data.endsWith(Z.value)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: {
            endsWith: Z.value
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "datetime") {
        if (!em0(Z).test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: "datetime",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "date") {
        if (!o44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: "date",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "time") {
        if (!t44(Z).test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.invalid_string,
          validation: "time",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "duration") {
        if (!d44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "duration",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "ip") {
        if (!e44(A.data, Z.version)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "ip",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "jwt") {
        if (!A84(A.data, Z.alg)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "jwt",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cidr") {
        if (!Q84(A.data, Z.version)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "cidr",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "base64") {
        if (!s44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "base64",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "base64url") {
        if (!r44.test(A.data)) G = this._getOrReturnCtx(A, G), wB(G, {
          validation: "base64url",
          code: qQ.invalid_string,
          message: Z.message
        }), B.dirty()
      } else i6.assertNever(Z);
      return {
        status: B.value,
        value: A.data
      }
    }
    _regex(A, Q, B) {
      return this.refinement((G) => A.test(G), {
        validation: Q,
        code: qQ.invalid_string,
        ...g2.errToObj(B)
      })
    }
    _addCheck(A) {
      return new MR({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    email(A) {
      return this._addCheck({
        kind: "email",
        ...g2.errToObj(A)
      })
    }
    url(A) {
      return this._addCheck({
        kind: "url",
        ...g2.errToObj(A)
      })
    }
    emoji(A) {
      return this._addCheck({
        kind: "emoji",
        ...g2.errToObj(A)
      })
    }
    uuid(A) {
      return this._addCheck({
        kind: "uuid",
        ...g2.errToObj(A)
      })
    }
    nanoid(A) {
      return this._addCheck({
        kind: "nanoid",
        ...g2.errToObj(A)
      })
    }
    cuid(A) {
      return this._addCheck({
        kind: "cuid",
        ...g2.errToObj(A)
      })
    }
    cuid2(A) {
      return this._addCheck({
        kind: "cuid2",
        ...g2.errToObj(A)
      })
    }
    ulid(A) {
      return this._addCheck({
        kind: "ulid",
        ...g2.errToObj(A)
      })
    }
    base64(A) {
      return this._addCheck({
        kind: "base64",
        ...g2.errToObj(A)
      })
    }
    base64url(A) {
      return this._addCheck({
        kind: "base64url",
        ...g2.errToObj(A)
      })
    }
    jwt(A) {
      return this._addCheck({
        kind: "jwt",
        ...g2.errToObj(A)
      })
    }
    ip(A) {
      return this._addCheck({
        kind: "ip",
        ...g2.errToObj(A)
      })
    }
    cidr(A) {
      return this._addCheck({
        kind: "cidr",
        ...g2.errToObj(A)
      })
    }
    datetime(A) {
      if (typeof A === "string") return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: !1,
        local: !1,
        message: A
      });
      return this._addCheck({
        kind: "datetime",
        precision: typeof A?.precision > "u" ? null : A?.precision,
        offset: A?.offset ?? !1,
        local: A?.local ?? !1,
        ...g2.errToObj(A?.message)
      })
    }
    date(A) {
      return this._addCheck({
        kind: "date",
        message: A
      })
    }
    time(A) {
      if (typeof A === "string") return this._addCheck({
        kind: "time",
        precision: null,
        message: A
      });
      return this._addCheck({
        kind: "time",
        precision: typeof A?.precision > "u" ? null : A?.precision,
        ...g2.errToObj(A?.message)
      })
    }
    duration(A) {
      return this._addCheck({
        kind: "duration",
        ...g2.errToObj(A)
      })
    }
    regex(A, Q) {
      return this._addCheck({
        kind: "regex",
        regex: A,
        ...g2.errToObj(Q)
      })
    }
    includes(A, Q) {
      return this._addCheck({
        kind: "includes",
        value: A,
        position: Q?.position,
        ...g2.errToObj(Q?.message)
      })
    }
    startsWith(A, Q) {
      return this._addCheck({
        kind: "startsWith",
        value: A,
        ...g2.errToObj(Q)
      })
    }
    endsWith(A, Q) {
      return this._addCheck({
        kind: "endsWith",
        value: A,
        ...g2.errToObj(Q)
      })
    }
    min(A, Q) {
      return this._addCheck({
        kind: "min",
        value: A,
        ...g2.errToObj(Q)
      })
    }
    max(A, Q) {
      return this._addCheck({
        kind: "max",
        value: A,
        ...g2.errToObj(Q)
      })
    }
    length(A, Q) {
      return this._addCheck({
        kind: "length",
        value: A,
        ...g2.errToObj(Q)
      })
    }
    nonempty(A) {
      return this.min(1, g2.errToObj(A))
    }
    trim() {
      return new MR({
        ...this._def,
        checks: [...this._def.checks, {
          kind: "trim"
        }]
      })
    }
    toLowerCase() {
      return new MR({
        ...this._def,
        checks: [...this._def.checks, {
          kind: "toLowerCase"
        }]
      })
    }
    toUpperCase() {
      return new MR({
        ...this._def,
        checks: [...this._def.checks, {
          kind: "toUpperCase"
        }]
      })
    }
    get isDatetime() {
      return !!this._def.checks.find((A) => A.kind === "datetime")
    }
    get isDate() {
      return !!this._def.checks.find((A) => A.kind === "date")
    }
    get isTime() {
      return !!this._def.checks.find((A) => A.kind === "time")
    }
    get isDuration() {
      return !!this._def.checks.find((A) => A.kind === "duration")
    }
    get isEmail() {
      return !!this._def.checks.find((A) => A.kind === "email")
    }
    get isURL() {
      return !!this._def.checks.find((A) => A.kind === "url")
    }
    get isEmoji() {
      return !!this._def.checks.find((A) => A.kind === "emoji")
    }
    get isUUID() {
      return !!this._def.checks.find((A) => A.kind === "uuid")
    }
    get isNANOID() {
      return !!this._def.checks.find((A) => A.kind === "nanoid")
    }
    get isCUID() {
      return !!this._def.checks.find((A) => A.kind === "cuid")
    }
    get isCUID2() {
      return !!this._def.checks.find((A) => A.kind === "cuid2")
    }
    get isULID() {
      return !!this._def.checks.find((A) => A.kind === "ulid")
    }
    get isIP() {
      return !!this._def.checks.find((A) => A.kind === "ip")
    }
    get isCIDR() {
      return !!this._def.checks.find((A) => A.kind === "cidr")
    }
    get isBase64() {
      return !!this._def.checks.find((A) => A.kind === "base64")
    }
    get isBase64url() {
      return !!this._def.checks.find((A) => A.kind === "base64url")
    }
    get minLength() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxLength() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
  };
  MR.create = (A) => {
    return new MR({
      checks: [],
      typeName: PQ.ZodString,
      coerce: A?.coerce ?? !1,
      ...k8(A)
    })
  };
  xm = class xm extends X6 {
    constructor() {
      super(...arguments);
      this.min = this.gte, this.max = this.lte, this.step = this.multipleOf
    }
    _parse(A) {
      if (this._def.coerce) A.data = Number(A.data);
      if (this._getType(A) !== tQ.number) {
        let Z = this._getOrReturnCtx(A);
        return wB(Z, {
          code: qQ.invalid_type,
          expected: tQ.number,
          received: Z.parsedType
        }), t9
      }
      let B = void 0,
        G = new pK;
      for (let Z of this._def.checks)
        if (Z.kind === "int") {
          if (!i6.isInteger(A.data)) B = this._getOrReturnCtx(A, B), wB(B, {
            code: qQ.invalid_type,
            expected: "integer",
            received: "float",
            message: Z.message
          }), G.dirty()
        } else if (Z.kind === "min") {
        if (Z.inclusive ? A.data < Z.value : A.data <= Z.value) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.too_small,
          minimum: Z.value,
          type: "number",
          inclusive: Z.inclusive,
          exact: !1,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "max") {
        if (Z.inclusive ? A.data > Z.value : A.data >= Z.value) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.too_big,
          maximum: Z.value,
          type: "number",
          inclusive: Z.inclusive,
          exact: !1,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "multipleOf") {
        if (B84(A.data, Z.value) !== 0) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.not_multiple_of,
          multipleOf: Z.value,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "finite") {
        if (!Number.isFinite(A.data)) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.not_finite,
          message: Z.message
        }), G.dirty()
      } else i6.assertNever(Z);
      return {
        status: G.value,
        value: A.data
      }
    }
    gte(A, Q) {
      return this.setLimit("min", A, !0, g2.toString(Q))
    }
    gt(A, Q) {
      return this.setLimit("min", A, !1, g2.toString(Q))
    }
    lte(A, Q) {
      return this.setLimit("max", A, !0, g2.toString(Q))
    }
    lt(A, Q) {
      return this.setLimit("max", A, !1, g2.toString(Q))
    }
    setLimit(A, Q, B, G) {
      return new xm({
        ...this._def,
        checks: [...this._def.checks, {
          kind: A,
          value: Q,
          inclusive: B,
          message: g2.toString(G)
        }]
      })
    }
    _addCheck(A) {
      return new xm({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    int(A) {
      return this._addCheck({
        kind: "int",
        message: g2.toString(A)
      })
    }
    positive(A) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: g2.toString(A)
      })
    }
    negative(A) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: g2.toString(A)
      })
    }
    nonpositive(A) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: g2.toString(A)
      })
    }
    nonnegative(A) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: g2.toString(A)
      })
    }
    multipleOf(A, Q) {
      return this._addCheck({
        kind: "multipleOf",
        value: A,
        message: g2.toString(Q)
      })
    }
    finite(A) {
      return this._addCheck({
        kind: "finite",
        message: g2.toString(A)
      })
    }
    safe(A) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: g2.toString(A)
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: g2.toString(A)
      })
    }
    get minValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
    get isInt() {
      return !!this._def.checks.find((A) => A.kind === "int" || A.kind === "multipleOf" && i6.isInteger(A.value))
    }
    get isFinite() {
      let A = null,
        Q = null;
      for (let B of this._def.checks)
        if (B.kind === "finite" || B.kind === "int" || B.kind === "multipleOf") return !0;
        else if (B.kind === "min") {
        if (Q === null || B.value > Q) Q = B.value
      } else if (B.kind === "max") {
        if (A === null || B.value < A) A = B.value
      }
      return Number.isFinite(Q) && Number.isFinite(A)
    }
  };
  xm.create = (A) => {
    return new xm({
      checks: [],
      typeName: PQ.ZodNumber,
      coerce: A?.coerce || !1,
      ...k8(A)
    })
  };
  vm = class vm extends X6 {
    constructor() {
      super(...arguments);
      this.min = this.gte, this.max = this.lte
    }
    _parse(A) {
      if (this._def.coerce) try {
        A.data = BigInt(A.data)
      } catch {
        return this._getInvalidInput(A)
      }
      if (this._getType(A) !== tQ.bigint) return this._getInvalidInput(A);
      let B = void 0,
        G = new pK;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (Z.inclusive ? A.data < Z.value : A.data <= Z.value) B = this._getOrReturnCtx(A, B), wB(B, {
            code: qQ.too_small,
            type: "bigint",
            minimum: Z.value,
            inclusive: Z.inclusive,
            message: Z.message
          }), G.dirty()
        } else if (Z.kind === "max") {
        if (Z.inclusive ? A.data > Z.value : A.data >= Z.value) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.too_big,
          type: "bigint",
          maximum: Z.value,
          inclusive: Z.inclusive,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "multipleOf") {
        if (A.data % Z.value !== BigInt(0)) B = this._getOrReturnCtx(A, B), wB(B, {
          code: qQ.not_multiple_of,
          multipleOf: Z.value,
          message: Z.message
        }), G.dirty()
      } else i6.assertNever(Z);
      return {
        status: G.value,
        value: A.data
      }
    }
    _getInvalidInput(A) {
      let Q = this._getOrReturnCtx(A);
      return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.bigint,
        received: Q.parsedType
      }), t9
    }
    gte(A, Q) {
      return this.setLimit("min", A, !0, g2.toString(Q))
    }
    gt(A, Q) {
      return this.setLimit("min", A, !1, g2.toString(Q))
    }
    lte(A, Q) {
      return this.setLimit("max", A, !0, g2.toString(Q))
    }
    lt(A, Q) {
      return this.setLimit("max", A, !1, g2.toString(Q))
    }
    setLimit(A, Q, B, G) {
      return new vm({
        ...this._def,
        checks: [...this._def.checks, {
          kind: A,
          value: Q,
          inclusive: B,
          message: g2.toString(G)
        }]
      })
    }
    _addCheck(A) {
      return new vm({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    positive(A) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: g2.toString(A)
      })
    }
    negative(A) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: g2.toString(A)
      })
    }
    nonpositive(A) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: g2.toString(A)
      })
    }
    nonnegative(A) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: g2.toString(A)
      })
    }
    multipleOf(A, Q) {
      return this._addCheck({
        kind: "multipleOf",
        value: A,
        message: g2.toString(Q)
      })
    }
    get minValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
  };
  vm.create = (A) => {
    return new vm({
      checks: [],
      typeName: PQ.ZodBigInt,
      coerce: A?.coerce ?? !1,
      ...k8(A)
    })
  };
  R9A = class R9A extends X6 {
    _parse(A) {
      if (this._def.coerce) A.data = Boolean(A.data);
      if (this._getType(A) !== tQ.boolean) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.boolean,
          received: B.parsedType
        }), t9
      }
      return zH(A.data)
    }
  };
  R9A.create = (A) => {
    return new R9A({
      typeName: PQ.ZodBoolean,
      coerce: A?.coerce || !1,
      ...k8(A)
    })
  };
  ts = class ts extends X6 {
    _parse(A) {
      if (this._def.coerce) A.data = new Date(A.data);
      if (this._getType(A) !== tQ.date) {
        let Z = this._getOrReturnCtx(A);
        return wB(Z, {
          code: qQ.invalid_type,
          expected: tQ.date,
          received: Z.parsedType
        }), t9
      }
      if (Number.isNaN(A.data.getTime())) {
        let Z = this._getOrReturnCtx(A);
        return wB(Z, {
          code: qQ.invalid_date
        }), t9
      }
      let B = new pK,
        G = void 0;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (A.data.getTime() < Z.value) G = this._getOrReturnCtx(A, G), wB(G, {
            code: qQ.too_small,
            message: Z.message,
            inclusive: !0,
            exact: !1,
            minimum: Z.value,
            type: "date"
          }), B.dirty()
        } else if (Z.kind === "max") {
        if (A.data.getTime() > Z.value) G = this._getOrReturnCtx(A, G), wB(G, {
          code: qQ.too_big,
          message: Z.message,
          inclusive: !0,
          exact: !1,
          maximum: Z.value,
          type: "date"
        }), B.dirty()
      } else i6.assertNever(Z);
      return {
        status: B.value,
        value: new Date(A.data.getTime())
      }
    }
    _addCheck(A) {
      return new ts({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    min(A, Q) {
      return this._addCheck({
        kind: "min",
        value: A.getTime(),
        message: g2.toString(Q)
      })
    }
    max(A, Q) {
      return this._addCheck({
        kind: "max",
        value: A.getTime(),
        message: g2.toString(Q)
      })
    }
    get minDate() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A != null ? new Date(A) : null
    }
    get maxDate() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A != null ? new Date(A) : null
    }
  };
  ts.create = (A) => {
    return new ts({
      checks: [],
      coerce: A?.coerce || !1,
      typeName: PQ.ZodDate,
      ...k8(A)
    })
  };
  KKA = class KKA extends X6 {
    _parse(A) {
      if (this._getType(A) !== tQ.symbol) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.symbol,
          received: B.parsedType
        }), t9
      }
      return zH(A.data)
    }
  };
  KKA.create = (A) => {
    return new KKA({
      typeName: PQ.ZodSymbol,
      ...k8(A)
    })
  };
  T9A = class T9A extends X6 {
    _parse(A) {
      if (this._getType(A) !== tQ.undefined) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.undefined,
          received: B.parsedType
        }), t9
      }
      return zH(A.data)
    }
  };
  T9A.create = (A) => {
    return new T9A({
      typeName: PQ.ZodUndefined,
      ...k8(A)
    })
  };
  P9A = class P9A extends X6 {
    _parse(A) {
      if (this._getType(A) !== tQ.null) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.null,
          received: B.parsedType
        }), t9
      }
      return zH(A.data)
    }
  };
  P9A.create = (A) => {
    return new P9A({
      typeName: PQ.ZodNull,
      ...k8(A)
    })
  };
  es = class es extends X6 {
    constructor() {
      super(...arguments);
      this._any = !0
    }
    _parse(A) {
      return zH(A.data)
    }
  };
  es.create = (A) => {
    return new es({
      typeName: PQ.ZodAny,
      ...k8(A)
    })
  };
  ym = class ym extends X6 {
    constructor() {
      super(...arguments);
      this._unknown = !0
    }
    _parse(A) {
      return zH(A.data)
    }
  };
  ym.create = (A) => {
    return new ym({
      typeName: PQ.ZodUnknown,
      ...k8(A)
    })
  };
  BS = class BS extends X6 {
    _parse(A) {
      let Q = this._getOrReturnCtx(A);
      return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.never,
        received: Q.parsedType
      }), t9
    }
  };
  BS.create = (A) => {
    return new BS({
      typeName: PQ.ZodNever,
      ...k8(A)
    })
  };
  DKA = class DKA extends X6 {
    _parse(A) {
      if (this._getType(A) !== tQ.undefined) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.void,
          received: B.parsedType
        }), t9
      }
      return zH(A.data)
    }
  };
  DKA.create = (A) => {
    return new DKA({
      typeName: PQ.ZodVoid,
      ...k8(A)
    })
  };
  OR = class OR extends X6 {
    _parse(A) {
      let {
        ctx: Q,
        status: B
      } = this._processInputParams(A), G = this._def;
      if (Q.parsedType !== tQ.array) return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.array,
        received: Q.parsedType
      }), t9;
      if (G.exactLength !== null) {
        let I = Q.data.length > G.exactLength.value,
          Y = Q.data.length < G.exactLength.value;
        if (I || Y) wB(Q, {
          code: I ? qQ.too_big : qQ.too_small,
          minimum: Y ? G.exactLength.value : void 0,
          maximum: I ? G.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: G.exactLength.message
        }), B.dirty()
      }
      if (G.minLength !== null) {
        if (Q.data.length < G.minLength.value) wB(Q, {
          code: qQ.too_small,
          minimum: G.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: G.minLength.message
        }), B.dirty()
      }
      if (G.maxLength !== null) {
        if (Q.data.length > G.maxLength.value) wB(Q, {
          code: qQ.too_big,
          maximum: G.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: G.maxLength.message
        }), B.dirty()
      }
      if (Q.common.async) return Promise.all([...Q.data].map((I, Y) => {
        return G.type._parseAsync(new RR(Q, I, Q.path, Y))
      })).then((I) => {
        return pK.mergeArray(B, I)
      });
      let Z = [...Q.data].map((I, Y) => {
        return G.type._parseSync(new RR(Q, I, Q.path, Y))
      });
      return pK.mergeArray(B, Z)
    }
    get element() {
      return this._def.type
    }
    min(A, Q) {
      return new OR({
        ...this._def,
        minLength: {
          value: A,
          message: g2.toString(Q)
        }
      })
    }
    max(A, Q) {
      return new OR({
        ...this._def,
        maxLength: {
          value: A,
          message: g2.toString(Q)
        }
      })
    }
    length(A, Q) {
      return new OR({
        ...this._def,
        exactLength: {
          value: A,
          message: g2.toString(Q)
        }
      })
    }
    nonempty(A) {
      return this.min(1, A)
    }
  };
  OR.create = (A, Q) => {
    return new OR({
      type: A,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: PQ.ZodArray,
      ...k8(Q)
    })
  };
  kY = class kY extends X6 {
    constructor() {
      super(...arguments);
      this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend
    }
    _getCached() {
      if (this._cached !== null) return this._cached;
      let A = this._def.shape(),
        Q = i6.objectKeys(A);
      return this._cached = {
        shape: A,
        keys: Q
      }, this._cached
    }
    _parse(A) {
      if (this._getType(A) !== tQ.object) {
        let W = this._getOrReturnCtx(A);
        return wB(W, {
          code: qQ.invalid_type,
          expected: tQ.object,
          received: W.parsedType
        }), t9
      }
      let {
        status: B,
        ctx: G
      } = this._processInputParams(A), {
        shape: Z,
        keys: I
      } = this._getCached(), Y = [];
      if (!(this._def.catchall instanceof BS && this._def.unknownKeys === "strip")) {
        for (let W in G.data)
          if (!I.includes(W)) Y.push(W)
      }
      let J = [];
      for (let W of I) {
        let X = Z[W],
          V = G.data[W];
        J.push({
          key: {
            status: "valid",
            value: W
          },
          value: X._parse(new RR(G, V, G.path, W)),
          alwaysSet: W in G.data
        })
      }
      if (this._def.catchall instanceof BS) {
        let W = this._def.unknownKeys;
        if (W === "passthrough")
          for (let X of Y) J.push({
            key: {
              status: "valid",
              value: X
            },
            value: {
              status: "valid",
              value: G.data[X]
            }
          });
        else if (W === "strict") {
          if (Y.length > 0) wB(G, {
            code: qQ.unrecognized_keys,
            keys: Y
          }), B.dirty()
        } else if (W === "strip");
        else throw Error("Internal ZodObject error: invalid unknownKeys value.")
      } else {
        let W = this._def.catchall;
        for (let X of Y) {
          let V = G.data[X];
          J.push({
            key: {
              status: "valid",
              value: X
            },
            value: W._parse(new RR(G, V, G.path, X)),
            alwaysSet: X in G.data
          })
        }
      }
      if (G.common.async) return Promise.resolve().then(async () => {
        let W = [];
        for (let X of J) {
          let V = await X.key,
            F = await X.value;
          W.push({
            key: V,
            value: F,
            alwaysSet: X.alwaysSet
          })
        }
        return W
      }).then((W) => {
        return pK.mergeObjectSync(B, W)
      });
      else return pK.mergeObjectSync(B, J)
    }
    get shape() {
      return this._def.shape()
    }
    strict(A) {
      return g2.errToObj, new kY({
        ...this._def,
        unknownKeys: "strict",
        ...A !== void 0 ? {
          errorMap: (Q, B) => {
            let G = this._def.errorMap?.(Q, B).message ?? B.defaultError;
            if (Q.code === "unrecognized_keys") return {
              message: g2.errToObj(A).message ?? G
            };
            return {
              message: G
            }
          }
        } : {}
      })
    }
    strip() {
      return new kY({
        ...this._def,
        unknownKeys: "strip"
      })
    }
    passthrough() {
      return new kY({
        ...this._def,
        unknownKeys: "passthrough"
      })
    }
    extend(A) {
      return new kY({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...A
        })
      })
    }
    merge(A) {
      return new kY({
        unknownKeys: A._def.unknownKeys,
        catchall: A._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...A._def.shape()
        }),
        typeName: PQ.ZodObject
      })
    }
    setKey(A, Q) {
      return this.augment({
        [A]: Q
      })
    }
    catchall(A) {
      return new kY({
        ...this._def,
        catchall: A
      })
    }
    pick(A) {
      let Q = {};
      for (let B of i6.objectKeys(A))
        if (A[B] && this.shape[B]) Q[B] = this.shape[B];
      return new kY({
        ...this._def,
        shape: () => Q
      })
    }
    omit(A) {
      let Q = {};
      for (let B of i6.objectKeys(this.shape))
        if (!A[B]) Q[B] = this.shape[B];
      return new kY({
        ...this._def,
        shape: () => Q
      })
    }
    deepPartial() {
      return M9A(this)
    }
    partial(A) {
      let Q = {};
      for (let B of i6.objectKeys(this.shape)) {
        let G = this.shape[B];
        if (A && !A[B]) Q[B] = G;
        else Q[B] = G.optional()
      }
      return new kY({
        ...this._def,
        shape: () => Q
      })
    }
    required(A) {
      let Q = {};
      for (let B of i6.objectKeys(this.shape))
        if (A && !A[B]) Q[B] = this.shape[B];
        else {
          let Z = this.shape[B];
          while (Z instanceof e$) Z = Z._def.innerType;
          Q[B] = Z
        } return new kY({
        ...this._def,
        shape: () => Q
      })
    }
    keyof() {
      return Ad0(i6.objectKeys(this.shape))
    }
  };
  kY.create = (A, Q) => {
    return new kY({
      shape: () => A,
      unknownKeys: "strip",
      catchall: BS.create(),
      typeName: PQ.ZodObject,
      ...k8(Q)
    })
  };
  kY.strictCreate = (A, Q) => {
    return new kY({
      shape: () => A,
      unknownKeys: "strict",
      catchall: BS.create(),
      typeName: PQ.ZodObject,
      ...k8(Q)
    })
  };
  kY.lazycreate = (A, Q) => {
    return new kY({
      shape: A,
      unknownKeys: "strip",
      catchall: BS.create(),
      typeName: PQ.ZodObject,
      ...k8(Q)
    })
  };
  j9A = class j9A extends X6 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = this._def.options;

      function G(Z) {
        for (let Y of Z)
          if (Y.result.status === "valid") return Y.result;
        for (let Y of Z)
          if (Y.result.status === "dirty") return Q.common.issues.push(...Y.ctx.common.issues), Y.result;
        let I = Z.map((Y) => new dz(Y.ctx.common.issues));
        return wB(Q, {
          code: qQ.invalid_union,
          unionErrors: I
        }), t9
      }
      if (Q.common.async) return Promise.all(B.map(async (Z) => {
        let I = {
          ...Q,
          common: {
            ...Q.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await Z._parseAsync({
            data: Q.data,
            path: Q.path,
            parent: I
          }),
          ctx: I
        }
      })).then(G);
      else {
        let Z = void 0,
          I = [];
        for (let J of B) {
          let W = {
              ...Q,
              common: {
                ...Q.common,
                issues: []
              },
              parent: null
            },
            X = J._parseSync({
              data: Q.data,
              path: Q.path,
              parent: W
            });
          if (X.status === "valid") return X;
          else if (X.status === "dirty" && !Z) Z = {
            result: X,
            ctx: W
          };
          if (W.common.issues.length) I.push(W.common.issues)
        }
        if (Z) return Q.common.issues.push(...Z.ctx.common.issues), Z.result;
        let Y = I.map((J) => new dz(J));
        return wB(Q, {
          code: qQ.invalid_union,
          unionErrors: Y
        }), t9
      }
    }
    get options() {
      return this._def.options
    }
  };
  j9A.create = (A, Q) => {
    return new j9A({
      options: A,
      typeName: PQ.ZodUnion,
      ...k8(Q)
    })
  };
  bxA = class bxA extends X6 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== tQ.object) return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.object,
        received: Q.parsedType
      }), t9;
      let B = this.discriminator,
        G = Q.data[B],
        Z = this.optionsMap.get(G);
      if (!Z) return wB(Q, {
        code: qQ.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [B]
      }), t9;
      if (Q.common.async) return Z._parseAsync({
        data: Q.data,
        path: Q.path,
        parent: Q
      });
      else return Z._parseSync({
        data: Q.data,
        path: Q.path,
        parent: Q
      })
    }
    get discriminator() {
      return this._def.discriminator
    }
    get options() {
      return this._def.options
    }
    get optionsMap() {
      return this._def.optionsMap
    }
    static create(A, Q, B) {
      let G = new Map;
      for (let Z of Q) {
        let I = Xv(Z.shape[A]);
        if (!I.length) throw Error(`A discriminator value for key \`${A}\` could not be extracted from all schema options`);
        for (let Y of I) {
          if (G.has(Y)) throw Error(`Discriminator property ${String(A)} has duplicate value ${String(Y)}`);
          G.set(Y, Z)
        }
      }
      return new bxA({
        typeName: PQ.ZodDiscriminatedUnion,
        discriminator: A,
        options: Q,
        optionsMap: G,
        ...k8(B)
      })
    }
  };
  S9A = class S9A extends X6 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A), G = (Z, I) => {
        if (xxA(Z) || xxA(I)) return t9;
        let Y = vH1(Z.value, I.value);
        if (!Y.valid) return wB(B, {
          code: qQ.invalid_intersection_types
        }), t9;
        if (vxA(Z) || vxA(I)) Q.dirty();
        return {
          status: Q.value,
          value: Y.data
        }
      };
      if (B.common.async) return Promise.all([this._def.left._parseAsync({
        data: B.data,
        path: B.path,
        parent: B
      }), this._def.right._parseAsync({
        data: B.data,
        path: B.path,
        parent: B
      })]).then(([Z, I]) => G(Z, I));
      else return G(this._def.left._parseSync({
        data: B.data,
        path: B.path,
        parent: B
      }), this._def.right._parseSync({
        data: B.data,
        path: B.path,
        parent: B
      }))
    }
  };
  S9A.create = (A, Q, B) => {
    return new S9A({
      left: A,
      right: Q,
      typeName: PQ.ZodIntersection,
      ...k8(B)
    })
  };
  GS = class GS extends X6 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== tQ.array) return wB(B, {
        code: qQ.invalid_type,
        expected: tQ.array,
        received: B.parsedType
      }), t9;
      if (B.data.length < this._def.items.length) return wB(B, {
        code: qQ.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), t9;
      if (!this._def.rest && B.data.length > this._def.items.length) wB(B, {
        code: qQ.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), Q.dirty();
      let Z = [...B.data].map((I, Y) => {
        let J = this._def.items[Y] || this._def.rest;
        if (!J) return null;
        return J._parse(new RR(B, I, B.path, Y))
      }).filter((I) => !!I);
      if (B.common.async) return Promise.all(Z).then((I) => {
        return pK.mergeArray(Q, I)
      });
      else return pK.mergeArray(Q, Z)
    }
    get items() {
      return this._def.items
    }
    rest(A) {
      return new GS({
        ...this._def,
        rest: A
      })
    }
  };
  GS.create = (A, Q) => {
    if (!Array.isArray(A)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new GS({
      items: A,
      typeName: PQ.ZodTuple,
      rest: null,
      ...k8(Q)
    })
  };
  HKA = class HKA extends X6 {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== tQ.object) return wB(B, {
        code: qQ.invalid_type,
        expected: tQ.object,
        received: B.parsedType
      }), t9;
      let G = [],
        Z = this._def.keyType,
        I = this._def.valueType;
      for (let Y in B.data) G.push({
        key: Z._parse(new RR(B, Y, B.path, Y)),
        value: I._parse(new RR(B, B.data[Y], B.path, Y)),
        alwaysSet: Y in B.data
      });
      if (B.common.async) return pK.mergeObjectAsync(Q, G);
      else return pK.mergeObjectSync(Q, G)
    }
    get element() {
      return this._def.valueType
    }
    static create(A, Q, B) {
      if (Q instanceof X6) return new HKA({
        keyType: A,
        valueType: Q,
        typeName: PQ.ZodRecord,
        ...k8(B)
      });
      return new HKA({
        keyType: MR.create(),
        valueType: A,
        typeName: PQ.ZodRecord,
        ...k8(Q)
      })
    }
  };
  CKA = class CKA extends X6 {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== tQ.map) return wB(B, {
        code: qQ.invalid_type,
        expected: tQ.map,
        received: B.parsedType
      }), t9;
      let G = this._def.keyType,
        Z = this._def.valueType,
        I = [...B.data.entries()].map(([Y, J], W) => {
          return {
            key: G._parse(new RR(B, Y, B.path, [W, "key"])),
            value: Z._parse(new RR(B, J, B.path, [W, "value"]))
          }
        });
      if (B.common.async) {
        let Y = new Map;
        return Promise.resolve().then(async () => {
          for (let J of I) {
            let W = await J.key,
              X = await J.value;
            if (W.status === "aborted" || X.status === "aborted") return t9;
            if (W.status === "dirty" || X.status === "dirty") Q.dirty();
            Y.set(W.value, X.value)
          }
          return {
            status: Q.value,
            value: Y
          }
        })
      } else {
        let Y = new Map;
        for (let J of I) {
          let {
            key: W,
            value: X
          } = J;
          if (W.status === "aborted" || X.status === "aborted") return t9;
          if (W.status === "dirty" || X.status === "dirty") Q.dirty();
          Y.set(W.value, X.value)
        }
        return {
          status: Q.value,
          value: Y
        }
      }
    }
  };
  CKA.create = (A, Q, B) => {
    return new CKA({
      valueType: Q,
      keyType: A,
      typeName: PQ.ZodMap,
      ...k8(B)
    })
  };
  Ar = class Ar extends X6 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== tQ.set) return wB(B, {
        code: qQ.invalid_type,
        expected: tQ.set,
        received: B.parsedType
      }), t9;
      let G = this._def;
      if (G.minSize !== null) {
        if (B.data.size < G.minSize.value) wB(B, {
          code: qQ.too_small,
          minimum: G.minSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: G.minSize.message
        }), Q.dirty()
      }
      if (G.maxSize !== null) {
        if (B.data.size > G.maxSize.value) wB(B, {
          code: qQ.too_big,
          maximum: G.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: G.maxSize.message
        }), Q.dirty()
      }
      let Z = this._def.valueType;

      function I(J) {
        let W = new Set;
        for (let X of J) {
          if (X.status === "aborted") return t9;
          if (X.status === "dirty") Q.dirty();
          W.add(X.value)
        }
        return {
          status: Q.value,
          value: W
        }
      }
      let Y = [...B.data.values()].map((J, W) => Z._parse(new RR(B, J, B.path, W)));
      if (B.common.async) return Promise.all(Y).then((J) => I(J));
      else return I(Y)
    }
    min(A, Q) {
      return new Ar({
        ...this._def,
        minSize: {
          value: A,
          message: g2.toString(Q)
        }
      })
    }
    max(A, Q) {
      return new Ar({
        ...this._def,
        maxSize: {
          value: A,
          message: g2.toString(Q)
        }
      })
    }
    size(A, Q) {
      return this.min(A, Q).max(A, Q)
    }
    nonempty(A) {
      return this.min(1, A)
    }
  };
  Ar.create = (A, Q) => {
    return new Ar({
      valueType: A,
      minSize: null,
      maxSize: null,
      typeName: PQ.ZodSet,
      ...k8(Q)
    })
  };
  O9A = class O9A extends X6 {
    constructor() {
      super(...arguments);
      this.validate = this.implement
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== tQ.function) return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.function,
        received: Q.parsedType
      }), t9;

      function B(Y, J) {
        return FKA({
          data: Y,
          path: Q.path,
          errorMaps: [Q.common.contextualErrorMap, Q.schemaErrorMap, N9A(), Wv].filter((W) => !!W),
          issueData: {
            code: qQ.invalid_arguments,
            argumentsError: J
          }
        })
      }

      function G(Y, J) {
        return FKA({
          data: Y,
          path: Q.path,
          errorMaps: [Q.common.contextualErrorMap, Q.schemaErrorMap, N9A(), Wv].filter((W) => !!W),
          issueData: {
            code: qQ.invalid_return_type,
            returnTypeError: J
          }
        })
      }
      let Z = {
          errorMap: Q.common.contextualErrorMap
        },
        I = Q.data;
      if (this._def.returns instanceof Qr) {
        let Y = this;
        return zH(async function(...J) {
          let W = new dz([]),
            X = await Y._def.args.parseAsync(J, Z).catch((K) => {
              throw W.addIssue(B(J, K)), W
            }),
            V = await Reflect.apply(I, this, X);
          return await Y._def.returns._def.type.parseAsync(V, Z).catch((K) => {
            throw W.addIssue(G(V, K)), W
          })
        })
      } else {
        let Y = this;
        return zH(function(...J) {
          let W = Y._def.args.safeParse(J, Z);
          if (!W.success) throw new dz([B(J, W.error)]);
          let X = Reflect.apply(I, this, W.data),
            V = Y._def.returns.safeParse(X, Z);
          if (!V.success) throw new dz([G(X, V.error)]);
          return V.data
        })
      }
    }
    parameters() {
      return this._def.args
    }
    returnType() {
      return this._def.returns
    }
    args(...A) {
      return new O9A({
        ...this._def,
        args: GS.create(A).rest(ym.create())
      })
    }
    returns(A) {
      return new O9A({
        ...this._def,
        returns: A
      })
    }
    implement(A) {
      return this.parse(A)
    }
    strictImplement(A) {
      return this.parse(A)
    }
    static create(A, Q, B) {
      return new O9A({
        args: A ? A : GS.create([]).rest(ym.create()),
        returns: Q || ym.create(),
        typeName: PQ.ZodFunction,
        ...k8(B)
      })
    }
  };
  _9A = class _9A extends X6 {
    get schema() {
      return this._def.getter()
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      return this._def.getter()._parse({
        data: Q.data,
        path: Q.path,
        parent: Q
      })
    }
  };
  _9A.create = (A, Q) => {
    return new _9A({
      getter: A,
      typeName: PQ.ZodLazy,
      ...k8(Q)
    })
  };
  k9A = class k9A extends X6 {
    _parse(A) {
      if (A.data !== this._def.value) {
        let Q = this._getOrReturnCtx(A);
        return wB(Q, {
          received: Q.data,
          code: qQ.invalid_literal,
          expected: this._def.value
        }), t9
      }
      return {
        status: "valid",
        value: A.data
      }
    }
    get value() {
      return this._def.value
    }
  };
  k9A.create = (A, Q) => {
    return new k9A({
      value: A,
      typeName: PQ.ZodLiteral,
      ...k8(Q)
    })
  };
  bm = class bm extends X6 {
    _parse(A) {
      if (typeof A.data !== "string") {
        let Q = this._getOrReturnCtx(A),
          B = this._def.values;
        return wB(Q, {
          expected: i6.joinValues(B),
          received: Q.parsedType,
          code: qQ.invalid_type
        }), t9
      }
      if (!this._cache) this._cache = new Set(this._def.values);
      if (!this._cache.has(A.data)) {
        let Q = this._getOrReturnCtx(A),
          B = this._def.values;
        return wB(Q, {
          received: Q.data,
          code: qQ.invalid_enum_value,
          options: B
        }), t9
      }
      return zH(A.data)
    }
    get options() {
      return this._def.values
    }
    get enum() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    get Values() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    get Enum() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    extract(A, Q = this._def) {
      return bm.create(A, {
        ...this._def,
        ...Q
      })
    }
    exclude(A, Q = this._def) {
      return bm.create(this.options.filter((B) => !A.includes(B)), {
        ...this._def,
        ...Q
      })
    }
  };
  bm.create = Ad0;
  y9A = class y9A extends X6 {
    _parse(A) {
      let Q = i6.getValidEnumValues(this._def.values),
        B = this._getOrReturnCtx(A);
      if (B.parsedType !== tQ.string && B.parsedType !== tQ.number) {
        let G = i6.objectValues(Q);
        return wB(B, {
          expected: i6.joinValues(G),
          received: B.parsedType,
          code: qQ.invalid_type
        }), t9
      }
      if (!this._cache) this._cache = new Set(i6.getValidEnumValues(this._def.values));
      if (!this._cache.has(A.data)) {
        let G = i6.objectValues(Q);
        return wB(B, {
          received: B.data,
          code: qQ.invalid_enum_value,
          options: G
        }), t9
      }
      return zH(A.data)
    }
    get enum() {
      return this._def.values
    }
  };
  y9A.create = (A, Q) => {
    return new y9A({
      values: A,
      typeName: PQ.ZodNativeEnum,
      ...k8(Q)
    })
  };
  Qr = class Qr extends X6 {
    unwrap() {
      return this._def.type
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== tQ.promise && Q.common.async === !1) return wB(Q, {
        code: qQ.invalid_type,
        expected: tQ.promise,
        received: Q.parsedType
      }), t9;
      let B = Q.parsedType === tQ.promise ? Q.data : Promise.resolve(Q.data);
      return zH(B.then((G) => {
        return this._def.type.parseAsync(G, {
          path: Q.path,
          errorMap: Q.common.contextualErrorMap
        })
      }))
    }
  };
  Qr.create = (A, Q) => {
    return new Qr({
      type: A,
      typeName: PQ.ZodPromise,
      ...k8(Q)
    })
  };
  TR = class TR extends X6 {
    innerType() {
      return this._def.schema
    }
    sourceType() {
      return this._def.schema._def.typeName === PQ.ZodEffects ? this._def.schema.sourceType() : this._def.schema
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A), G = this._def.effect || null, Z = {
        addIssue: (I) => {
          if (wB(B, I), I.fatal) Q.abort();
          else Q.dirty()
        },
        get path() {
          return B.path
        }
      };
      if (Z.addIssue = Z.addIssue.bind(Z), G.type === "preprocess") {
        let I = G.transform(B.data, Z);
        if (B.common.async) return Promise.resolve(I).then(async (Y) => {
          if (Q.value === "aborted") return t9;
          let J = await this._def.schema._parseAsync({
            data: Y,
            path: B.path,
            parent: B
          });
          if (J.status === "aborted") return t9;
          if (J.status === "dirty") return os(J.value);
          if (Q.value === "dirty") return os(J.value);
          return J
        });
        else {
          if (Q.value === "aborted") return t9;
          let Y = this._def.schema._parseSync({
            data: I,
            path: B.path,
            parent: B
          });
          if (Y.status === "aborted") return t9;
          if (Y.status === "dirty") return os(Y.value);
          if (Q.value === "dirty") return os(Y.value);
          return Y
        }
      }
      if (G.type === "refinement") {
        let I = (Y) => {
          let J = G.refinement(Y, Z);
          if (B.common.async) return Promise.resolve(J);
          if (J instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          return Y
        };
        if (B.common.async === !1) {
          let Y = this._def.schema._parseSync({
            data: B.data,
            path: B.path,
            parent: B
          });
          if (Y.status === "aborted") return t9;
          if (Y.status === "dirty") Q.dirty();
          return I(Y.value), {
            status: Q.value,
            value: Y.value
          }
        } else return this._def.schema._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        }).then((Y) => {
          if (Y.status === "aborted") return t9;
          if (Y.status === "dirty") Q.dirty();
          return I(Y.value).then(() => {
            return {
              status: Q.value,
              value: Y.value
            }
          })
        })
      }
      if (G.type === "transform")
        if (B.common.async === !1) {
          let I = this._def.schema._parseSync({
            data: B.data,
            path: B.path,
            parent: B
          });
          if (!km(I)) return t9;
          let Y = G.transform(I.value, Z);
          if (Y instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          return {
            status: Q.value,
            value: Y
          }
        } else return this._def.schema._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        }).then((I) => {
          if (!km(I)) return t9;
          return Promise.resolve(G.transform(I.value, Z)).then((Y) => ({
            status: Q.value,
            value: Y
          }))
        });
      i6.assertNever(G)
    }
  };
  TR.create = (A, Q, B) => {
    return new TR({
      schema: A,
      typeName: PQ.ZodEffects,
      effect: Q,
      ...k8(B)
    })
  };
  TR.createWithPreprocess = (A, Q, B) => {
    return new TR({
      schema: Q,
      effect: {
        type: "preprocess",
        transform: A
      },
      typeName: PQ.ZodEffects,
      ...k8(B)
    })
  };
  e$ = class e$ extends X6 {
    _parse(A) {
      if (this._getType(A) === tQ.undefined) return zH(void 0);
      return this._def.innerType._parse(A)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  e$.create = (A, Q) => {
    return new e$({
      innerType: A,
      typeName: PQ.ZodOptional,
      ...k8(Q)
    })
  };
  Vv = class Vv extends X6 {
    _parse(A) {
      if (this._getType(A) === tQ.null) return zH(null);
      return this._def.innerType._parse(A)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  Vv.create = (A, Q) => {
    return new Vv({
      innerType: A,
      typeName: PQ.ZodNullable,
      ...k8(Q)
    })
  };
  x9A = class x9A extends X6 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = Q.data;
      if (Q.parsedType === tQ.undefined) B = this._def.defaultValue();
      return this._def.innerType._parse({
        data: B,
        path: Q.path,
        parent: Q
      })
    }
    removeDefault() {
      return this._def.innerType
    }
  };
  x9A.create = (A, Q) => {
    return new x9A({
      innerType: A,
      typeName: PQ.ZodDefault,
      defaultValue: typeof Q.default === "function" ? Q.default : () => Q.default,
      ...k8(Q)
    })
  };
  v9A = class v9A extends X6 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = {
        ...Q,
        common: {
          ...Q.common,
          issues: []
        }
      }, G = this._def.innerType._parse({
        data: B.data,
        path: B.path,
        parent: {
          ...B
        }
      });
      if (L9A(G)) return G.then((Z) => {
        return {
          status: "valid",
          value: Z.status === "valid" ? Z.value : this._def.catchValue({
            get error() {
              return new dz(B.common.issues)
            },
            input: B.data
          })
        }
      });
      else return {
        status: "valid",
        value: G.status === "valid" ? G.value : this._def.catchValue({
          get error() {
            return new dz(B.common.issues)
          },
          input: B.data
        })
      }
    }
    removeCatch() {
      return this._def.innerType
    }
  };
  v9A.create = (A, Q) => {
    return new v9A({
      innerType: A,
      typeName: PQ.ZodCatch,
      catchValue: typeof Q.catch === "function" ? Q.catch : () => Q.catch,
      ...k8(Q)
    })
  };
  EKA = class EKA extends X6 {
    _parse(A) {
      if (this._getType(A) !== tQ.nan) {
        let B = this._getOrReturnCtx(A);
        return wB(B, {
          code: qQ.invalid_type,
          expected: tQ.nan,
          received: B.parsedType
        }), t9
      }
      return {
        status: "valid",
        value: A.data
      }
    }
  };
  EKA.create = (A) => {
    return new EKA({
      typeName: PQ.ZodNaN,
      ...k8(A)
    })
  };
  G84 = Symbol("zod_brand");
  fxA = class fxA extends X6 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = Q.data;
      return this._def.type._parse({
        data: B,
        path: Q.path,
        parent: Q
      })
    }
    unwrap() {
      return this._def.type
    }
  };
  zKA = class zKA extends X6 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.common.async) return (async () => {
        let Z = await this._def.in._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        });
        if (Z.status === "aborted") return t9;
        if (Z.status === "dirty") return Q.dirty(), os(Z.value);
        else return this._def.out._parseAsync({
          data: Z.value,
          path: B.path,
          parent: B
        })
      })();
      else {
        let G = this._def.in._parseSync({
          data: B.data,
          path: B.path,
          parent: B
        });
        if (G.status === "aborted") return t9;
        if (G.status === "dirty") return Q.dirty(), {
          status: "dirty",
          value: G.value
        };
        else return this._def.out._parseSync({
          data: G.value,
          path: B.path,
          parent: B
        })
      }
    }
    static create(A, Q) {
      return new zKA({
        in: A,
        out: Q,
        typeName: PQ.ZodPipeline
      })
    }
  };
  b9A = class b9A extends X6 {
    _parse(A) {
      let Q = this._def.innerType._parse(A),
        B = (G) => {
          if (km(G)) G.value = Object.freeze(G.value);
          return G
        };
      return L9A(Q) ? Q.then((G) => B(G)) : B(Q)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  b9A.create = (A, Q) => {
    return new b9A({
      innerType: A,
      typeName: PQ.ZodReadonly,
      ...k8(Q)
    })
  };
  Z84 = {
    object: kY.lazycreate
  };
  (function(A) {
    A.ZodString = "ZodString", A.ZodNumber = "ZodNumber", A.ZodNaN = "ZodNaN", A.ZodBigInt = "ZodBigInt", A.ZodBoolean = "ZodBoolean", A.ZodDate = "ZodDate", A.ZodSymbol = "ZodSymbol", A.ZodUndefined = "ZodUndefined", A.ZodNull = "ZodNull", A.ZodAny = "ZodAny", A.ZodUnknown = "ZodUnknown", A.ZodNever = "ZodNever", A.ZodVoid = "ZodVoid", A.ZodArray = "ZodArray", A.ZodObject = "ZodObject", A.ZodUnion = "ZodUnion", A.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", A.ZodIntersection = "ZodIntersection", A.ZodTuple = "ZodTuple", A.ZodRecord = "ZodRecord", A.ZodMap = "ZodMap", A.ZodSet = "ZodSet", A.ZodFunction = "ZodFunction", A.ZodLazy = "ZodLazy", A.ZodLiteral = "ZodLiteral", A.ZodEnum = "ZodEnum", A.ZodEffects = "ZodEffects", A.ZodNativeEnum = "ZodNativeEnum", A.ZodOptional = "ZodOptional", A.ZodNullable = "ZodNullable", A.ZodDefault = "ZodDefault", A.ZodCatch = "ZodCatch", A.ZodPromise = "ZodPromise", A.ZodBranded = "ZodBranded", A.ZodPipeline = "ZodPipeline", A.ZodReadonly = "ZodReadonly"
  })(PQ || (PQ = {}));
  CQ = MR.create, rN = xm.create, Y84 = EKA.create, J84 = vm.create, $F = R9A.create, W84 = ts.create, X84 = KKA.create, V84 = T9A.create, F84 = P9A.create, K84 = es.create, D84 = ym.create, H84 = BS.create, C84 = DKA.create, zJ = OR.create, Aw = kY.create, Qw = kY.strictCreate, Br = j9A.create, E84 = bxA.create, z84 = S9A.create, U84 = GS.create, PR = HKA.create, $84 = CKA.create, w84 = Ar.create, q84 = O9A.create, N84 = _9A.create, L84 = k9A.create, jR = bm.create, M84 = y9A.create, O84 = Qr.create, R84 = TR.create, T84 = e$.create, P84 = Vv.create, j84 = TR.createWithPreprocess, S84 = zKA.create, x84 = {
    string: (A) => MR.create({
      ...A,
      coerce: !0
    }),
    number: (A) => xm.create({
      ...A,
      coerce: !0
    }),
    boolean: (A) => R9A.create({
      ...A,
      coerce: !0
    }),
    bigint: (A) => vm.create({
      ...A,
      coerce: !0
    }),
    date: (A) => ts.create({
      ...A,
      coerce: !0
    })
  }, v84 = t9
})
// @from(Start 1604538, End 1604544)
j = {}
// @from(Start 1607028, End 1607099)
bH1 = L(() => {
  yxA();
  yH1();
  nm0();
  VKA();
  Bd0();
  kxA()
})
// @from(Start 1607105, End 1607107)
W2
// @from(Start 1607113, End 1607157)
Q2 = L(() => {
  bH1();
  bH1();
  W2 = j
})
// @from(Start 1607163, End 1607166)
Zd0
// @from(Start 1607168, End 1607171)
fH1
// @from(Start 1607173, End 1607176)
Id0
// @from(Start 1607178, End 1607181)
Yd0
// @from(Start 1607183, End 1607186)
Jd0
// @from(Start 1607188, End 1607191)
Wd0
// @from(Start 1607193, End 1607196)
Xd0
// @from(Start 1607202, End 1610466)
Vd0 = L(() => {
  Q2();
  Zd0 = j.string().refine((A) => {
    if (A.includes("://") || A.includes("/") || A.includes(":")) return !1;
    if (A === "localhost") return !0;
    if (A.startsWith("*.")) {
      let Q = A.slice(2);
      if (!Q.includes(".") || Q.startsWith(".") || Q.endsWith(".")) return !1;
      let B = Q.split(".");
      return B.length >= 2 && B.every((G) => G.length > 0)
    }
    if (A.includes("*")) return !1;
    return A.includes(".") && !A.startsWith(".") && !A.endsWith(".")
  }, {
    message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
  }), fH1 = j.string().min(1, "Path cannot be empty"), Id0 = j.object({
    allowedDomains: j.array(Zd0).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
    deniedDomains: j.array(Zd0).describe("List of denied domains"),
    allowUnixSockets: j.array(j.string()).optional().describe("Unix socket paths that are allowed (macOS only)"),
    allowAllUnixSockets: j.boolean().optional().describe("Allow ALL Unix sockets (Linux only - disables Unix socket blocking)"),
    allowLocalBinding: j.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
    httpProxyPort: j.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
    socksProxyPort: j.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering.")
  }), Yd0 = j.object({
    denyRead: j.array(fH1).describe("Paths denied for reading"),
    allowWrite: j.array(fH1).describe("Paths allowed for writing"),
    denyWrite: j.array(fH1).describe("Paths denied for writing (takes precedence over allowWrite)")
  }), Jd0 = j.record(j.string(), j.array(j.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), Wd0 = j.object({
    command: j.string().describe('The ripgrep command to execute (e.g., "rg", "claude")'),
    args: j.array(j.string()).optional().describe('Additional arguments to pass before ripgrep args (e.g., ["--ripgrep"])')
  }), Xd0 = j.object({
    network: Id0.describe("Network restrictions configuration"),
    filesystem: Yd0.describe("Filesystem restrictions configuration"),
    ignoreViolations: Jd0.optional().describe("Optional configuration for ignoring specific violations"),
    enableWeakerNestedSandbox: j.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
    ripgrep: Wd0.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
    mandatoryDenySearchDepth: j.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance.")
  })
})
// @from(Start 1610472, End 1610525)
Fd0 = L(() => {
  lm0();
  TH1();
  Vd0();
  w9A()
})
// @from(Start 1610774, End 1611260)
function $d0(A, Q = {}) {
  let B = Q.entryType || Q.type;
  if (B === "both") B = Bw.FILE_DIR_TYPE;
  if (B) Q.type = B;
  if (!A) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
  else if (typeof A !== "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
  else if (B && !Hd0.includes(B)) throw Error(`readdirp: Invalid type passed. Use one of ${Hd0.join(", ")}`);
  return Q.root = A, new Ud0(Q)
}
// @from(Start 1611265, End 1611267)
Bw
// @from(Start 1611269, End 1611272)
hH1
// @from(Start 1611274, End 1611306)
zd0 = "READDIRP_RECURSIVE_ERROR"
// @from(Start 1611310, End 1611313)
c84
// @from(Start 1611315, End 1611318)
Hd0
// @from(Start 1611320, End 1611323)
p84
// @from(Start 1611325, End 1611328)
l84
// @from(Start 1611330, End 1611358)
i84 = (A) => c84.has(A.code)
// @from(Start 1611362, End 1611365)
n84
// @from(Start 1611367, End 1611382)
Cd0 = (A) => !0
// @from(Start 1611386, End 1611720)
Ed0 = (A) => {
    if (A === void 0) return Cd0;
    if (typeof A === "function") return A;
    if (typeof A === "string") {
      let Q = A.trim();
      return (B) => B.basename === Q
    }
    if (Array.isArray(A)) {
      let Q = A.map((B) => B.trim());
      return (B) => Q.some((G) => B.basename === G)
    }
    return Cd0
  }
// @from(Start 1611724, End 1611727)
Ud0
// @from(Start 1611733, End 1616293)
wd0 = L(() => {
  Bw = {
    FILE_TYPE: "files",
    DIR_TYPE: "directories",
    FILE_DIR_TYPE: "files_directories",
    EVERYTHING_TYPE: "all"
  }, hH1 = {
    root: ".",
    fileFilter: (A) => !0,
    directoryFilter: (A) => !0,
    type: Bw.FILE_TYPE,
    lstat: !1,
    depth: 2147483648,
    alwaysStat: !1,
    highWaterMark: 4096
  };
  Object.freeze(hH1);
  c84 = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", zd0]), Hd0 = [Bw.DIR_TYPE, Bw.EVERYTHING_TYPE, Bw.FILE_DIR_TYPE, Bw.FILE_TYPE], p84 = new Set([Bw.DIR_TYPE, Bw.EVERYTHING_TYPE, Bw.FILE_DIR_TYPE]), l84 = new Set([Bw.EVERYTHING_TYPE, Bw.FILE_DIR_TYPE, Bw.FILE_TYPE]), n84 = process.platform === "win32";
  Ud0 = class Ud0 extends g84 {
    constructor(A = {}) {
      super({
        objectMode: !0,
        autoDestroy: !0,
        highWaterMark: A.highWaterMark
      });
      let Q = {
          ...hH1,
          ...A
        },
        {
          root: B,
          type: G
        } = Q;
      this._fileFilter = Ed0(Q.fileFilter), this._directoryFilter = Ed0(Q.directoryFilter);
      let Z = Q.lstat ? Kd0 : b84;
      if (n84) this._stat = (I) => Z(I, {
        bigint: !0
      });
      else this._stat = Z;
      this._maxDepth = Q.depth ?? hH1.depth, this._wantsDir = G ? p84.has(G) : !1, this._wantsFile = G ? l84.has(G) : !1, this._wantsEverything = G === Bw.EVERYTHING_TYPE, this._root = Dd0(B), this._isDirent = !Q.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = {
        encoding: "utf8",
        withFileTypes: this._isDirent
      }, this.parents = [this._exploreDir(B, 1)], this.reading = !1, this.parent = void 0
    }
    async _read(A) {
      if (this.reading) return;
      this.reading = !0;
      try {
        while (!this.destroyed && A > 0) {
          let Q = this.parent,
            B = Q && Q.files;
          if (B && B.length > 0) {
            let {
              path: G,
              depth: Z
            } = Q, I = B.splice(0, A).map((J) => this._formatEntry(J, G)), Y = await Promise.all(I);
            for (let J of Y) {
              if (!J) continue;
              if (this.destroyed) return;
              let W = await this._getEntryType(J);
              if (W === "directory" && this._directoryFilter(J)) {
                if (Z <= this._maxDepth) this.parents.push(this._exploreDir(J.fullPath, Z + 1));
                if (this._wantsDir) this.push(J), A--
              } else if ((W === "file" || this._includeAsFile(J)) && this._fileFilter(J)) {
                if (this._wantsFile) this.push(J), A--
              }
            }
          } else {
            let G = this.parents.pop();
            if (!G) {
              this.push(null);
              break
            }
            if (this.parent = await G, this.destroyed) return
          }
        }
      } catch (Q) {
        this.destroy(Q)
      } finally {
        this.reading = !1
      }
    }
    async _exploreDir(A, Q) {
      let B;
      try {
        B = await f84(A, this._rdOptions)
      } catch (G) {
        this._onError(G)
      }
      return {
        files: B,
        depth: Q,
        path: A
      }
    }
    async _formatEntry(A, Q) {
      let B, G = this._isDirent ? A.name : A;
      try {
        let Z = Dd0(m84(Q, G));
        B = {
          path: u84(this._root, Z),
          fullPath: Z,
          basename: G
        }, B[this._statsProp] = this._isDirent ? A : await this._stat(Z)
      } catch (Z) {
        this._onError(Z);
        return
      }
      return B
    }
    _onError(A) {
      if (i84(A) && !this.destroyed) this.emit("warn", A);
      else this.destroy(A)
    }
    async _getEntryType(A) {
      if (!A && this._statsProp in A) return "";
      let Q = A[this._statsProp];
      if (Q.isFile()) return "file";
      if (Q.isDirectory()) return "directory";
      if (Q && Q.isSymbolicLink()) {
        let B = A.fullPath;
        try {
          let G = await h84(B),
            Z = await Kd0(G);
          if (Z.isFile()) return "file";
          if (Z.isDirectory()) {
            let I = G.length;
            if (B.startsWith(G) && B.substr(I, 1) === d84) {
              let Y = Error(`Circular symlink detected: "${B}" points to "${G}"`);
              return Y.code = zd0, this._onError(Y)
            }
            return "directory"
          }
        } catch (G) {
          return this._onError(G), ""
        }
      }
    }
    _includeAsFile(A) {
      let Q = A && A[this._statsProp];
      return Q && this._wantsEverything && !Q.isDirectory()
    }
  }
})
// @from(Start 1616534, End 1616814)
function Nd0(A, Q, B, G, Z) {
  let I = (Y, J) => {
    if (B(A), Z(Y, J, {
        watchedPath: A
      }), J && A !== J) uxA(vI.resolve(A, J), Gr, vI.join(A, J))
  };
  try {
    return s84(A, {
      persistent: Q.persistent
    }, I)
  } catch (Y) {
    G(Y);
    return
  }
}
// @from(Start 1616815, End 1622823)
class pH1 {
  constructor(A) {
    this.fsw = A, this._boundHandleError = (Q) => A._handleError(Q)
  }
  _watchWithNodeFs(A, Q) {
    let B = this.fsw.options,
      G = vI.dirname(A),
      Z = vI.basename(A);
    this.fsw._getWatchedDir(G).add(Z);
    let Y = vI.resolve(A),
      J = {
        persistent: B.persistent
      };
    if (!Q) Q = mxA;
    let W;
    if (B.usePolling) {
      let X = B.interval !== B.binaryInterval;
      J.interval = X && J64(Z) ? B.binaryInterval : B.interval, W = V64(A, Y, J, {
        listener: Q,
        rawEmitter: this.fsw._emitRaw
      })
    } else W = X64(A, Y, J, {
      listener: Q,
      errHandler: this._boundHandleError,
      rawEmitter: this.fsw._emitRaw
    });
    return W
  }
  _handleFile(A, Q, B) {
    if (this.fsw.closed) return;
    let G = vI.dirname(A),
      Z = vI.basename(A),
      I = this.fsw._getWatchedDir(G),
      Y = Q;
    if (I.has(Z)) return;
    let J = async (X, V) => {
      if (!this.fsw._throttle(G64, A, 5)) return;
      if (!V || V.mtimeMs === 0) try {
        let F = await Ld0(A);
        if (this.fsw.closed) return;
        let {
          atimeMs: K,
          mtimeMs: D
        } = F;
        if (!K || K <= D || D !== Y.mtimeMs) this.fsw._emit(SR.CHANGE, A, F);
        if ((A64 || Q64 || B64) && Y.ino !== F.ino) {
          this.fsw._closeFile(X), Y = F;
          let H = this._watchWithNodeFs(A, J);
          if (H) this.fsw._addPathCloser(X, H)
        } else Y = F
      } catch (F) {
        this.fsw._remove(G, Z)
      } else if (I.has(Z)) {
        let {
          atimeMs: F,
          mtimeMs: K
        } = V;
        if (!F || F <= K || K !== Y.mtimeMs) this.fsw._emit(SR.CHANGE, A, V);
        Y = V
      }
    }, W = this._watchWithNodeFs(A, J);
    if (!(B && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(A)) {
      if (!this.fsw._throttle(SR.ADD, A, 0)) return;
      this.fsw._emit(SR.ADD, A, Q)
    }
    return W
  }
  async _handleSymlink(A, Q, B, G) {
    if (this.fsw.closed) return;
    let Z = A.fullPath,
      I = this.fsw._getWatchedDir(Q);
    if (!this.fsw.options.followSymlinks) {
      this.fsw._incrReadyCount();
      let Y;
      try {
        Y = await gH1(B)
      } catch (J) {
        return this.fsw._emitReady(), !0
      }
      if (this.fsw.closed) return;
      if (I.has(G)) {
        if (this.fsw._symlinkPaths.get(Z) !== Y) this.fsw._symlinkPaths.set(Z, Y), this.fsw._emit(SR.CHANGE, B, A.stats)
      } else I.add(G), this.fsw._symlinkPaths.set(Z, Y), this.fsw._emit(SR.ADD, B, A.stats);
      return this.fsw._emitReady(), !0
    }
    if (this.fsw._symlinkPaths.has(Z)) return !0;
    this.fsw._symlinkPaths.set(Z, !0)
  }
  _handleRead(A, Q, B, G, Z, I, Y) {
    if (A = vI.join(A, ""), Y = this.fsw._throttle("readdir", A, 1000), !Y) return;
    let J = this.fsw._getWatchedDir(B.path),
      W = new Set,
      X = this.fsw._readdirp(A, {
        fileFilter: (V) => B.filterPath(V),
        directoryFilter: (V) => B.filterDir(V)
      });
    if (!X) return;
    return X.on(e84, async (V) => {
      if (this.fsw.closed) {
        X = void 0;
        return
      }
      let F = V.path,
        K = vI.join(A, F);
      if (W.add(F), V.stats.isSymbolicLink() && await this._handleSymlink(V, A, K, F)) return;
      if (this.fsw.closed) {
        X = void 0;
        return
      }
      if (F === G || !G && !J.has(F)) this.fsw._incrReadyCount(), K = vI.join(Z, vI.relative(Z, K)), this._addToNodeFs(K, Q, B, I + 1)
    }).on(SR.ERROR, this._boundHandleError), new Promise((V, F) => {
      if (!X) return F();
      X.once(dH1, () => {
        if (this.fsw.closed) {
          X = void 0;
          return
        }
        let K = Y ? Y.clear() : !1;
        if (V(void 0), J.getChildren().filter((D) => {
            return D !== A && !W.has(D)
          }).forEach((D) => {
            this.fsw._remove(A, D)
          }), X = void 0, K) this._handleRead(A, !1, B, G, Z, I, Y)
      })
    })
  }
  async _handleDir(A, Q, B, G, Z, I, Y) {
    let J = this.fsw._getWatchedDir(vI.dirname(A)),
      W = J.has(vI.basename(A));
    if (!(B && this.fsw.options.ignoreInitial) && !Z && !W) this.fsw._emit(SR.ADD_DIR, A, Q);
    J.add(vI.basename(A)), this.fsw._getWatchedDir(A);
    let X, V, F = this.fsw.options.depth;
    if ((F == null || G <= F) && !this.fsw._symlinkPaths.has(Y)) {
      if (!Z) {
        if (await this._handleRead(A, B, I, Z, A, G, X), this.fsw.closed) return
      }
      V = this._watchWithNodeFs(A, (K, D) => {
        if (D && D.mtimeMs === 0) return;
        this._handleRead(K, !1, I, Z, A, G, X)
      })
    }
    return V
  }
  async _addToNodeFs(A, Q, B, G, Z) {
    let I = this.fsw._emitReady;
    if (this.fsw._isIgnored(A) || this.fsw.closed) return I(), !1;
    let Y = this.fsw._getWatchHelpers(A);
    if (B) Y.filterPath = (J) => B.filterPath(J), Y.filterDir = (J) => B.filterDir(J);
    try {
      let J = await Z64[Y.statMethod](Y.watchPath);
      if (this.fsw.closed) return;
      if (this.fsw._isIgnored(Y.watchPath, J)) return I(), !1;
      let W = this.fsw.options.followSymlinks,
        X;
      if (J.isDirectory()) {
        let V = vI.resolve(A),
          F = W ? await gH1(A) : A;
        if (this.fsw.closed) return;
        if (X = await this._handleDir(Y.watchPath, J, Q, G, Z, Y, F), this.fsw.closed) return;
        if (V !== F && F !== void 0) this.fsw._symlinkPaths.set(V, F)
      } else if (J.isSymbolicLink()) {
        let V = W ? await gH1(A) : A;
        if (this.fsw.closed) return;
        let F = vI.dirname(Y.watchPath);
        if (this.fsw._getWatchedDir(F).add(Y.watchPath), this.fsw._emit(SR.ADD, Y.watchPath, J), X = await this._handleDir(F, J, Q, G, A, Y, V), this.fsw.closed) return;
        if (V !== void 0) this.fsw._symlinkPaths.set(vI.resolve(A), V)
      } else X = this._handleFile(Y.watchPath, J, Q);
      if (I(), X) this.fsw._addPathCloser(A, X);
      return !1
    } catch (J) {
      if (this.fsw._handleError(J)) return I(), A
    }
  }
}
// @from(Start 1622828, End 1622840)
e84 = "data"
// @from(Start 1622844, End 1622855)
dH1 = "end"
// @from(Start 1622859, End 1622872)
Md0 = "close"
// @from(Start 1622876, End 1622890)
mxA = () => {}
// @from(Start 1622894, End 1622897)
dxA
// @from(Start 1622899, End 1622902)
cH1
// @from(Start 1622904, End 1622907)
A64
// @from(Start 1622909, End 1622912)
Q64
// @from(Start 1622914, End 1622917)
B64
// @from(Start 1622919, End 1622922)
Od0
// @from(Start 1622924, End 1622926)
VI
// @from(Start 1622928, End 1622930)
SR
// @from(Start 1622932, End 1622945)
G64 = "watch"
// @from(Start 1622949, End 1622952)
Z64
// @from(Start 1622954, End 1622970)
Gr = "listeners"
// @from(Start 1622974, End 1622993)
hxA = "errHandlers"
// @from(Start 1622997, End 1623016)
f9A = "rawEmitters"
// @from(Start 1623020, End 1623023)
I64
// @from(Start 1623025, End 1623028)
Y64
// @from(Start 1623030, End 1623088)
J64 = (A) => Y64.has(vI.extname(A).slice(1).toLowerCase())
// @from(Start 1623092, End 1623167)
mH1 = (A, Q) => {
    if (A instanceof Set) A.forEach(Q);
    else Q(A)
  }
// @from(Start 1623171, End 1623280)
UKA = (A, Q, B) => {
    let G = A[Q];
    if (!(G instanceof Set)) A[Q] = G = new Set([G]);
    G.add(B)
  }
// @from(Start 1623284, End 1623385)
W64 = (A) => (Q) => {
    let B = A[Q];
    if (B instanceof Set) B.clear();
    else delete A[Q]
  }
// @from(Start 1623389, End 1623504)
$KA = (A, Q, B) => {
    let G = A[Q];
    if (G instanceof Set) G.delete(B);
    else if (G === B) delete A[Q]
  }
// @from(Start 1623508, End 1623557)
Rd0 = (A) => A instanceof Set ? A.size === 0 : !A
// @from(Start 1623561, End 1623564)
gxA
// @from(Start 1623566, End 1623687)
uxA = (A, Q, B, G, Z) => {
    let I = gxA.get(A);
    if (!I) return;
    mH1(I[Q], (Y) => {
      Y(B, G, Z)
    })
  }
// @from(Start 1623691, End 1624649)
X64 = (A, Q, B, G) => {
    let {
      listener: Z,
      errHandler: I,
      rawEmitter: Y
    } = G, J = gxA.get(Q), W;
    if (!B.persistent) {
      if (W = Nd0(A, B, Z, I, Y), !W) return;
      return W.close.bind(W)
    }
    if (J) UKA(J, Gr, Z), UKA(J, hxA, I), UKA(J, f9A, Y);
    else {
      if (W = Nd0(A, B, uxA.bind(null, Q, Gr), I, uxA.bind(null, Q, f9A)), !W) return;
      W.on(SR.ERROR, async (X) => {
        let V = uxA.bind(null, Q, hxA);
        if (J) J.watcherUnusable = !0;
        if (cH1 && X.code === "EPERM") try {
          await (await r84(A, "r")).close(), V(X)
        } catch (F) {} else V(X)
      }), J = {
        listeners: Z,
        errHandlers: I,
        rawEmitters: Y,
        watcher: W
      }, gxA.set(Q, J)
    }
    return () => {
      if ($KA(J, Gr, Z), $KA(J, hxA, I), $KA(J, f9A, Y), Rd0(J.listeners)) J.watcher.close(), gxA.delete(Q), I64.forEach(W64(J)), J.watcher = void 0, Object.freeze(J)
    }
  }
// @from(Start 1624653, End 1624656)
uH1
// @from(Start 1624658, End 1625462)
V64 = (A, Q, B, G) => {
    let {
      listener: Z,
      rawEmitter: I
    } = G, Y = uH1.get(Q), J = Y && Y.options;
    if (J && (J.persistent < B.persistent || J.interval > B.interval)) qd0(Q), Y = void 0;
    if (Y) UKA(Y, Gr, Z), UKA(Y, f9A, I);
    else Y = {
      listeners: Z,
      rawEmitters: I,
      options: B,
      watcher: a84(Q, B, (W, X) => {
        mH1(Y.rawEmitters, (F) => {
          F(SR.CHANGE, Q, {
            curr: W,
            prev: X
          })
        });
        let V = W.mtimeMs;
        if (W.size !== X.size || V > X.mtimeMs || V === 0) mH1(Y.listeners, (F) => F(A, W))
      })
    }, uH1.set(Q, Y);
    return () => {
      if ($KA(Y, Gr, Z), $KA(Y, f9A, I), Rd0(Y.listeners)) uH1.delete(Q), qd0(Q), Y.options = Y.watcher = void 0, Object.freeze(Y)
    }
  }
// @from(Start 1625468, End 1627878)
Td0 = L(() => {
  dxA = process.platform, cH1 = dxA === "win32", A64 = dxA === "darwin", Q64 = dxA === "linux", B64 = dxA === "freebsd", Od0 = t84() === "OS400", VI = {
    ALL: "all",
    READY: "ready",
    ADD: "add",
    CHANGE: "change",
    ADD_DIR: "addDir",
    UNLINK: "unlink",
    UNLINK_DIR: "unlinkDir",
    RAW: "raw",
    ERROR: "error"
  }, SR = VI, Z64 = {
    lstat: o84,
    stat: Ld0
  }, I64 = [Gr, hxA, f9A], Y64 = new Set(["3dm", "3ds", "3g2", "3gp", "7z", "a", "aac", "adp", "afdesign", "afphoto", "afpub", "ai", "aif", "aiff", "alz", "ape", "apk", "appimage", "ar", "arj", "asf", "au", "avi", "bak", "baml", "bh", "bin", "bk", "bmp", "btif", "bz2", "bzip2", "cab", "caf", "cgm", "class", "cmx", "cpio", "cr2", "cur", "dat", "dcm", "deb", "dex", "djvu", "dll", "dmg", "dng", "doc", "docm", "docx", "dot", "dotm", "dra", "DS_Store", "dsk", "dts", "dtshd", "dvb", "dwg", "dxf", "ecelp4800", "ecelp7470", "ecelp9600", "egg", "eol", "eot", "epub", "exe", "f4v", "fbs", "fh", "fla", "flac", "flatpak", "fli", "flv", "fpx", "fst", "fvt", "g3", "gh", "gif", "graffle", "gz", "gzip", "h261", "h263", "h264", "icns", "ico", "ief", "img", "ipa", "iso", "jar", "jpeg", "jpg", "jpgv", "jpm", "jxr", "key", "ktx", "lha", "lib", "lvp", "lz", "lzh", "lzma", "lzo", "m3u", "m4a", "m4v", "mar", "mdi", "mht", "mid", "midi", "mj2", "mka", "mkv", "mmr", "mng", "mobi", "mov", "movie", "mp3", "mp4", "mp4a", "mpeg", "mpg", "mpga", "mxu", "nef", "npx", "numbers", "nupkg", "o", "odp", "ods", "odt", "oga", "ogg", "ogv", "otf", "ott", "pages", "pbm", "pcx", "pdb", "pdf", "pea", "pgm", "pic", "png", "pnm", "pot", "potm", "potx", "ppa", "ppam", "ppm", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", "psd", "pya", "pyc", "pyo", "pyv", "qt", "rar", "ras", "raw", "resources", "rgb", "rip", "rlc", "rmf", "rmvb", "rpm", "rtf", "rz", "s3m", "s7z", "scpt", "sgi", "shar", "snap", "sil", "sketch", "slk", "smv", "snk", "so", "stl", "suo", "sub", "swf", "tar", "tbz", "tbz2", "tga", "tgz", "thmx", "tif", "tiff", "tlz", "ttc", "ttf", "txz", "udf", "uvh", "uvi", "uvm", "uvp", "uvs", "uvu", "viv", "vob", "war", "wav", "wax", "wbmp", "wdp", "weba", "webm", "webp", "whl", "wim", "wm", "wma", "wmv", "wmx", "woff", "woff2", "wrm", "wvx", "xbm", "xif", "xla", "xlam", "xls", "xlsb", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xm", "xmind", "xpi", "xpm", "xwd", "xz", "z", "zip", "zipx"]), gxA = new Map;
  uH1 = new Map
})
// @from(Start 1628056, End 1628111)
function cxA(A) {
  return Array.isArray(A) ? A : [A]
}
// @from(Start 1628113, End 1628552)
function q64(A) {
  if (typeof A === "function") return A;
  if (typeof A === "string") return (Q) => A === Q;
  if (A instanceof RegExp) return (Q) => A.test(Q);
  if (typeof A === "object" && A !== null) return (Q) => {
    if (A.path === Q) return !0;
    if (A.recursive) {
      let B = n6.relative(A.path, Q);
      if (!B) return !1;
      return !B.startsWith("..") && !n6.isAbsolute(B)
    }
    return !1
  };
  return () => !1
}
// @from(Start 1628554, End 1628827)
function N64(A) {
  if (typeof A !== "string") throw Error("string expected");
  A = n6.normalize(A), A = A.replace(/\\/g, "/");
  let Q = !1;
  if (A.startsWith("//")) Q = !0;
  let B = /\/\//;
  while (A.match(B)) A = A.replace(B, "/");
  if (Q) A = "/" + A;
  return A
}
// @from(Start 1628829, End 1628972)
function jd0(A, Q, B) {
  let G = N64(Q);
  for (let Z = 0; Z < A.length; Z++) {
    let I = A[Z];
    if (I(G, B)) return !0
  }
  return !1
}
// @from(Start 1628974, End 1629187)
function L64(A, Q) {
  if (A == null) throw TypeError("anymatch: specify first argument");
  let G = cxA(A).map((Z) => q64(Z));
  if (Q == null) return (Z, I) => {
    return jd0(G, Z, I)
  };
  return jd0(G, Q)
}
// @from(Start 1629188, End 1630017)
class vd0 {
  constructor(A, Q) {
    this.path = A, this._removeWatcher = Q, this.items = new Set
  }
  add(A) {
    let {
      items: Q
    } = this;
    if (!Q) return;
    if (A !== yd0 && A !== E64) Q.add(A)
  }
  async remove(A) {
    let {
      items: Q
    } = this;
    if (!Q) return;
    if (Q.delete(A), Q.size > 0) return;
    let B = this.path;
    try {
      await D64(B)
    } catch (G) {
      if (this._removeWatcher) this._removeWatcher(n6.dirname(B), n6.basename(B))
    }
  }
  has(A) {
    let {
      items: Q
    } = this;
    if (!Q) return;
    return Q.has(A)
  }
  getChildren() {
    let {
      items: A
    } = this;
    if (!A) return [];
    return [...A.values()]
  }
  dispose() {
    this.items.clear(), this.path = "", this._removeWatcher = mxA, this.items = O64, Object.freeze(this)
  }
}
// @from(Start 1630018, End 1630738)
class bd0 {
  constructor(A, Q, B) {
    this.fsw = B;
    let G = A;
    this.path = A = A.replace(w64, ""), this.watchPath = G, this.fullWatchPath = n6.resolve(G), this.dirParts = [], this.dirParts.forEach((Z) => {
      if (Z.length > 1) Z.pop()
    }), this.followSymlinks = Q, this.statMethod = Q ? R64 : T64
  }
  entryPath(A) {
    return n6.join(this.watchPath, n6.relative(this.watchPath, A.fullPath))
  }
  filterPath(A) {
    let {
      stats: Q
    } = A;
    if (Q && Q.isSymbolicLink()) return this.filterDir(A);
    let B = this.entryPath(A);
    return this.fsw._isntIgnored(B, Q) && this.fsw._hasReadPermissions(Q)
  }
  filterDir(A) {
    return this.fsw._isntIgnored(this.entryPath(A), A.stats)
  }
}
// @from(Start 1630740, End 1630810)
function P64(A, Q = {}) {
  let B = new nH1(Q);
  return B.add(A), B
}
// @from(Start 1630815, End 1630824)
lH1 = "/"
// @from(Start 1630828, End 1630838)
C64 = "//"
// @from(Start 1630842, End 1630851)
yd0 = "."
// @from(Start 1630855, End 1630865)
E64 = ".."
// @from(Start 1630869, End 1630883)
z64 = "string"
// @from(Start 1630887, End 1630890)
U64
// @from(Start 1630892, End 1630895)
Pd0
// @from(Start 1630897, End 1630900)
$64
// @from(Start 1630902, End 1630905)
w64
// @from(Start 1630907, End 1630981)
iH1 = (A) => typeof A === "object" && A !== null && !(A instanceof RegExp)
// @from(Start 1630985, End 1631155)
Sd0 = (A) => {
    let Q = cxA(A).flat();
    if (!Q.every((B) => typeof B === z64)) throw TypeError(`Non-string provided as watch path: ${Q}`);
    return Q.map(xd0)
  }
// @from(Start 1631159, End 1631346)
_d0 = (A) => {
    let Q = A.replace(U64, lH1),
      B = !1;
    if (Q.startsWith(C64)) B = !0;
    while (Q.match(Pd0)) Q = Q.replace(Pd0, lH1);
    if (B) Q = lH1 + Q;
    return Q
  }
// @from(Start 1631350, End 1631388)
xd0 = (A) => _d0(n6.normalize(_d0(A)))
// @from(Start 1631392, End 1631521)
kd0 = (A = "") => (Q) => {
    if (typeof Q === "string") return xd0(n6.isAbsolute(Q) ? Q : n6.join(A, Q));
    else return Q
  }
// @from(Start 1631525, End 1631607)
M64 = (A, Q) => {
    if (n6.isAbsolute(A)) return A;
    return n6.join(Q, A)
  }
// @from(Start 1631611, End 1631614)
O64
// @from(Start 1631616, End 1631628)
R64 = "stat"
// @from(Start 1631632, End 1631645)
T64 = "lstat"
// @from(Start 1631649, End 1631652)
nH1
// @from(Start 1631654, End 1631657)
fd0