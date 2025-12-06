
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