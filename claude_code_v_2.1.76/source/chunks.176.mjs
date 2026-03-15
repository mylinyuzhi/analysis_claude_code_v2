
// @from(Ln 452885, Col 0)
async function y_z({
    hook: A,
    messages: q,
    hookName: K,
    toolUseID: Y,
    hookEvent: z,
    timeoutMs: _,
    signal: w
}) {
    let O = A.timeout ?? _,
        {
            signal: $,
            cleanup: H
        } = mN(AbortSignal.timeout(O), w);
    try {
        if ($.aborted) return H(), {
            outcome: "cancelled",
            hook: A
        };
        let j = await new Promise((J, M) => {
            let D = () => M(Error("Function hook cancelled"));
            $.addEventListener("abort", D), Promise.resolve(A.callback(q, $)).then((X) => {
                $.removeEventListener("abort", D), J(X)
            }).catch((X) => {
                $.removeEventListener("abort", D), M(X)
            })
        });
        if (H(), j) return {
            outcome: "success",
            hook: A
        };
        return {
            blockingError: {
                blockingError: A.errorMessage,
                command: "function"
            },
            outcome: "blocking",
            hook: A
        }
    } catch (j) {
        if (H(), j instanceof Error && (j.message === "Function hook cancelled" || j.name === "AbortError")) return {
            outcome: "cancelled",
            hook: A
        };
        return _6(j), {
            message: f4({
                type: "hook_error_during_execution",
                hookName: K,
                toolUseID: Y,
                hookEvent: z,
                content: j instanceof Error ? j.message : "Function hook execution error"
            }),
            outcome: "non_blocking_error",
            hook: A
        }
    }
}
// @from(Ln 452942, Col 0)
async function L_z({
    toolUseID: A,
    hook: q,
    hookEvent: K,
    hookInput: Y,
    signal: z,
    hookIndex: _,
    toolUseContext: w
}) {
    let O = w ? {
            getAppState: w.getAppState,
            updateAttributionState: w.updateAttributionState
        } : void 0,
        $ = await q.callback(Y, A, z, _, O);
    if (uh($)) return {
        outcome: "success",
        hook: q
    };
    return {
        ...Vr8({
            json: $,
            command: "callback",
            hookName: `${K}:Callback`,
            toolUseID: A,
            hookEvent: K,
            expectedHookEvent: K,
            stdout: void 0,
            stderr: void 0,
            exitCode: void 0
        }),
        outcome: "success",
        hook: q
    }
}
// @from(Ln 452977, Col 0)
function iN1() {
    let A = EM6()?.WorktreeCreate;
    if (A && A.length > 0) return !0;
    let q = Xp()?.WorktreeCreate;
    if (!q || q.length === 0) return !1;
    let K = GL();
    return q.some((Y) => !(K && ("pluginRoot" in Y)))
}
// @from(Ln 452985, Col 0)
async function nN1(A) {
    let q = {
            ...$w(void 0),
            hook_event_name: "WorktreeCreate",
            name: A
        },
        K = await RF({
            hookInput: q,
            timeoutMs: T$
        }),
        Y = K.find((_) => _.succeeded && _.output.trim().length > 0);
    if (!Y) {
        let _ = K.filter((w) => !w.succeeded).map((w) => `${w.command}: ${w.output.trim()||"no output"}`);
        throw Error(`WorktreeCreate hook failed: ${_.join("; ")||"no successful output"}`)
    }
    return {
        worktreePath: Y.output.trim()
    }
}
// @from(Ln 453004, Col 0)
async function rN1(A) {
    let q = EM6()?.WorktreeRemove,
        K = Xp()?.WorktreeRemove,
        Y = q && q.length > 0,
        z = K && K.length > 0;
    if (!Y && !z) return !1;
    let _ = {
            ...$w(void 0),
            hook_event_name: "WorktreeRemove",
            worktree_path: A
        },
        w = await RF({
            hookInput: _,
            timeoutMs: T$
        });
    if (w.length === 0) return !1;
    for (let O of w)
        if (!O.succeeded) k(`WorktreeRemove hook failed [${O.command}]: ${O.output.trim()}`, {
            level: "error"
        });
    return !0
}
// @from(Ln 453027, Col 0)
function Avq(A) {
    return A.map(({
        hook: q
    }) => {
        if (q.type === "command") return {
            type: "command",
            command: q.command
        };
        else if (q.type === "prompt") return {
            type: "prompt",
            prompt: q.prompt
        };
        else if (q.type === "http") return {
            type: "http",
            command: q.url
        };
        else if (q.type === "function") return {
            type: "function",
            name: "function"
        };
        else if (q.type === "callback") return {
            type: "callback",
            name: "callback"
        };
        return {
            type: "unknown"
        }
    })
}
// @from(Ln 453056, Col 4)
T$ = 600000
// @from(Ln 453057, Col 4)
V_z = 1500
// @from(Ln 453058, Col 4)
hw = E(() => {
    Z7();
    M38();
    oC6();
    lA();
    P38();
    D91();
    YK();
    lx();
    eu();
    T1();
    k8();
    tI6();
    Oq();
    i8();
    V1();
    FB();
    IW();
    Ae();
    vr8();
    aK();
    P96();
    H1();
    SP();
    k1();
    pN6();
    RE1();
    aH();
    JA();
    LE1();
    M0();
    o36();
    UTq();
    lTq();
    tTq();
    Mc();
    g1();
    A8();
    s8()
})
// @from(Ln 453102, Col 0)
function Mvq() {
    let A = "";
    try {
        A = R_z().username
    } catch {}
    let q = [];
    if (A) q.push({
        path: `/Library/Managed Preferences/${A}/${$vq}.plist`,
        label: "per-user managed preferences"
    });
    return q.push({
        path: `/Library/Managed Preferences/${$vq}.plist`,
        label: "device-level managed preferences"
    }), q
}
// @from(Ln 453117, Col 4)
$vq = "com.anthropic.claudecode"
// @from(Ln 453118, Col 4)
VS1 = "HKLM\\SOFTWARE\\Policies\\ClaudeCode"
// @from(Ln 453119, Col 4)
kS1 = "HKCU\\SOFTWARE\\Policies\\ClaudeCode"
// @from(Ln 453120, Col 4)
dN6 = "Settings"
// @from(Ln 453121, Col 4)
Hvq = "/usr/bin/plutil"
// @from(Ln 453122, Col 4)
jvq
// @from(Ln 453122, Col 9)
Jvq = 5000
// @from(Ln 453123, Col 4)
Rr8 = E(() => {
    jvq = ["-convert", "json", "-o", "-", "--"]
})
// @from(Ln 453133, Col 0)
function hr8(A, q) {
    return new Promise((K) => {
        h_z(A, q, {
            encoding: "utf-8",
            timeout: Jvq
        }, (Y, z) => {
            K({
                stdout: z ?? "",
                code: Y ? 1 : 0
            })
        })
    })
}
// @from(Ln 453147, Col 0)
function ES1() {
    return (async () => {
        if (process.platform === "darwin") {
            let A = Mvq(),
                K = (await Promise.all(A.map(async ({
                    path: Y,
                    label: z
                }) => {
                    if (!S_z(Y)) return {
                        stdout: "",
                        label: z,
                        ok: !1
                    };
                    let {
                        stdout: _,
                        code: w
                    } = await hr8(Hvq, [...jvq, Y]);
                    return {
                        stdout: _,
                        label: z,
                        ok: w === 0 && !!_
                    }
                }))).find((Y) => Y.ok);
            return {
                plistStdouts: K ? [{
                    stdout: K.stdout,
                    label: K.label
                }] : [],
                hklmStdout: null,
                hkcuStdout: null
            }
        }
        if (process.platform === "win32") {
            let [A, q] = await Promise.all([hr8("reg", ["query", VS1, "/v", dN6]), hr8("reg", ["query", kS1, "/v", dN6])]);
            return {
                plistStdouts: null,
                hklmStdout: A.code === 0 ? A.stdout : null,
                hkcuStdout: q.code === 0 ? q.stdout : null
            }
        }
        return {
            plistStdouts: null,
            hklmStdout: null,
            hkcuStdout: null
        }
    })()
}
// @from(Ln 453195, Col 0)
function Dvq() {
    if (Sr8) return;
    Sr8 = ES1()
}
// @from(Ln 453200, Col 0)
function Xvq() {
    return Sr8
}
// @from(Ln 453203, Col 4)
Sr8 = null
// @from(Ln 453204, Col 4)
Cr8 = E(() => {
    Rr8()
})
// @from(Ln 453211, Col 0)
function I_z() {
    if (yS1) return;
    yS1 = (async () => {
        Zq("mdm_load_start");
        let A = Date.now(),
            q = Xvq() ?? ES1(),
            {
                mdm: K,
                hkcu: Y
            } = fvq(await q);
        br8 = K, xr8 = Y, Zq("mdm_load_end");
        let z = Date.now() - A;
        if (k(`MDM settings load completed in ${z}ms`), Object.keys(K.settings).length > 0) {
            k(`MDM settings found: ${Object.keys(K.settings).join(", ")}`);
            try {
                U1("info", "mdm_settings_loaded", {
                    duration_ms: z,
                    key_count: Object.keys(K.settings).length,
                    error_count: K.errors.length
                })
            } catch {}
        }
    })()
}
// @from(Ln 453235, Col 0)
async function Wvq() {
    if (!yS1) I_z();
    await yS1
}
// @from(Ln 453240, Col 0)
function cN6() {
    return br8 ?? Ei
}
// @from(Ln 453244, Col 0)
function lN6() {
    return xr8 ?? Ei
}
// @from(Ln 453248, Col 0)
function Zvq(A, q) {
    br8 = A, xr8 = q
}
// @from(Ln 453251, Col 0)
async function Gvq() {
    let A = await ES1();
    return fvq(A)
}
// @from(Ln 453256, Col 0)
function Ir8(A, q) {
    let K = WK(A, !1);
    if (!K || typeof K !== "object") return {
        settings: {},
        errors: []
    };
    let Y = c31(K, q),
        z = oD().safeParse(K);
    if (!z.success) {
        let _ = vJ6(z.error, q);
        return {
            settings: {},
            errors: [...Y, ..._]
        }
    }
    return {
        settings: z.data,
        errors: Y
    }
}
// @from(Ln 453277, Col 0)
function Pvq(A, q = "Settings") {
    let K = A.split(/\r?\n/),
        Y = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (let z of K) {
        let _ = z.match(new RegExp(`^\\s+${Y}\\s+REG_(?:EXPAND_)?SZ\\s+(.*)$`, "i"));
        if (_ && _[1]) return _[1].trimEnd()
    }
    return null
}
// @from(Ln 453287, Col 0)
function fvq(A) {
    if (A.plistStdouts && A.plistStdouts.length > 0) {
        let {
            stdout: q,
            label: K
        } = A.plistStdouts[0], Y = Ir8(q, K);
        if (Object.keys(Y.settings).length > 0) return {
            mdm: Y,
            hkcu: Ei
        }
    }
    if (A.hklmStdout) {
        let q = Pvq(A.hklmStdout);
        if (q) {
            let K = Ir8(q, `Registry: ${VS1}\\${dN6}`);
            if (Object.keys(K.settings).length > 0) return {
                mdm: K,
                hkcu: Ei
            }
        }
    }
    if (b_z()) return {
        mdm: Ei,
        hkcu: Ei
    };
    if (A.hkcuStdout) {
        let q = Pvq(A.hkcuStdout);
        if (q) {
            let K = Ir8(q, `Registry: ${kS1}\\${dN6}`);
            return {
                mdm: Ei,
                hkcu: K
            }
        }
    }
    return {
        mdm: Ei,
        hkcu: Ei
    }
}
// @from(Ln 453328, Col 0)
function b_z() {
    try {
        let A = C_z(bW(), "managed-settings.json"),
            q = IM(A),
            K = WK(q, !1);
        return !!K && typeof K === "object" && Object.keys(K).length > 0
    } catch {
        return !1
    }
}
// @from(Ln 453338, Col 4)
Ei
// @from(Ln 453338, Col 8)
br8 = null
// @from(Ln 453339, Col 4)
xr8 = null
// @from(Ln 453340, Col 4)
yS1 = null
// @from(Ln 453341, Col 4)
LS1 = E(() => {
    Z7();
    H1();
    u_();
    XS();
    jC();
    l31();
    K_();
    So();
    Cr8();
    Rr8();
    Ei = Object.freeze({
        settings: {},
        errors: []
    })
})
// @from(Ln 453361, Col 0)
async function g_z() {
    if (t4()) return;
    if (ur8 || iN6) return;
    ur8 = !0, c_z(), E4(async () => Nvq());
    let {
        dirs: A,
        settingsFiles: q
    } = await Q_z();
    if (iN6) return;
    if (A.length === 0) return;
    k(`Watching for changes in setting files ${[...q].join(", ")}...`), B_6 = g46.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        depth: 0,
        awaitWriteFinish: {
            stabilityThreshold: _o6?.stabilityThreshold ?? Tvq,
            pollInterval: _o6?.pollInterval ?? vvq
        },
        ignored: (K, Y) => {
            if (Y && !Y.isFile() && !Y.isDirectory()) return !0;
            if (K.split(g_6.sep).some((z) => z === ".git")) return !0;
            if (!Y || Y.isDirectory()) return !1;
            return !q.has(g_6.normalize(K))
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), B_6.on("change", kvq), B_6.on("unlink", d_z), B_6.on("add", U_z)
}
// @from(Ln 453391, Col 0)
function Nvq() {
    if (iN6 = !0, B_6) B_6.close(), B_6 = null;
    if (t16) clearInterval(t16), t16 = null;
    for (let A of qx.values()) clearTimeout(A);
    qx.clear(), zo6 = null, RS1.clear(), hS1.clear()
}
// @from(Ln 453398, Col 0)
function F_z(A) {
    return hS1.add(A), () => {
        hS1.delete(A)
    }
}
// @from(Ln 453404, Col 0)
function p_z(A) {
    let q = F_(A);
    if (q) RS1.set(q, Date.now())
}
// @from(Ln 453408, Col 0)
async function Q_z() {
    let A = new Map,
        q = new Set;
    for (let Y of VG) {
        if (Y === "flagSettings") continue;
        let z = F_(Y);
        if (!z) continue;
        let _ = g_6.dirname(z);
        if (!A.has(_)) A.set(_, new Set);
        A.get(_).add(z);
        try {
            if ((await x_z(z)).isFile()) q.add(_)
        } catch {}
    }
    let K = new Set;
    for (let Y of q) {
        let z = A.get(Y);
        if (z)
            for (let _ of z) K.add(_)
    }
    return {
        dirs: [...q],
        settingsFiles: K
    }
}
// @from(Ln 453434, Col 0)
function Vvq(A) {
    switch (A) {
        case "userSettings":
            return "user_settings";
        case "projectSettings":
            return "project_settings";
        case "localSettings":
            return "local_settings";
        case "flagSettings":
        case "policySettings":
            return "policy_settings"
    }
}
// @from(Ln 453448, Col 0)
function kvq(A) {
    let q = mr8(A);
    if (!q) return;
    let K = qx.get(A);
    if (K) clearTimeout(K), qx.delete(A), k(`Cancelled pending deletion of ${A} — file was recreated`);
    let Y = RS1.get(A);
    if (Y && Date.now() - Y < u_z) {
        RS1.delete(A);
        return
    }
    k(`Detected change to ${A}`), UN6(Vvq(q), A).then((z) => {
        if (QN6(z)) {
            k(`ConfigChange hook blocked change to ${A}`);
            return
        }
        SS1(q)
    })
}
// @from(Ln 453467, Col 0)
function U_z(A) {
    if (!mr8(A)) return;
    let K = qx.get(A);
    if (K) clearTimeout(K), qx.delete(A), k(`Cancelled pending deletion of ${A} — file was re-added`);
    kvq(A)
}
// @from(Ln 453474, Col 0)
function d_z(A) {
    let q = mr8(A);
    if (!q) return;
    if (k(`Detected deletion of ${A}`), qx.has(A)) return;
    let K = setTimeout((Y, z) => {
        qx.delete(Y), UN6(Vvq(z), Y).then((_) => {
            if (QN6(_)) {
                k(`ConfigChange hook blocked deletion of ${Y}`);
                return
            }
            SS1(z)
        })
    }, _o6?.deletionGrace ?? B_z, A, q);
    qx.set(A, K)
}
// @from(Ln 453490, Col 0)
function mr8(A) {
    let q = g_6.normalize(A);
    return VG.find((K) => F_(K) === q)
}
// @from(Ln 453495, Col 0)
function c_z() {
    let A = cN6(),
        q = lN6();
    zo6 = B6({
        mdm: A.settings,
        hkcu: q.settings
    }), t16 = setInterval(() => {
        if (iN6) return;
        (async () => {
            try {
                let {
                    mdm: K,
                    hkcu: Y
                } = await Gvq();
                if (iN6) return;
                let z = B6({
                    mdm: K.settings,
                    hkcu: Y.settings
                });
                if (z !== zo6) zo6 = z, Zvq(K, Y), k("Detected MDM settings change via poll"), SS1("policySettings")
            } catch (K) {
                k(`MDM poll error: ${_1(K)}`)
            }
        })()
    }, _o6?.mdmPollInterval ?? m_z), t16.unref()
}
// @from(Ln 453522, Col 0)
function SS1(A) {
    zP(), hS1.forEach((q) => q(A))
}
// @from(Ln 453526, Col 0)
function l_z(A) {
    k(`Programmatic settings change notification for ${A}`), SS1(A)
}
// @from(Ln 453530, Col 0)
function i_z(A) {
    if (t16) clearInterval(t16), t16 = null;
    for (let q of qx.values()) clearTimeout(q);
    qx.clear(), zo6 = null, ur8 = !1, iN6 = !1, _o6 = A ?? null
}
// @from(Ln 453535, Col 4)
Tvq = 1000
// @from(Ln 453536, Col 4)
vvq = 500
// @from(Ln 453537, Col 4)
u_z = 5000
// @from(Ln 453538, Col 4)
m_z = 1800000
// @from(Ln 453539, Col 4)
B_z
// @from(Ln 453539, Col 9)
B_6 = null
// @from(Ln 453540, Col 4)
t16 = null
// @from(Ln 453541, Col 4)
zo6 = null
// @from(Ln 453542, Col 4)
ur8 = !1
// @from(Ln 453543, Col 4)
iN6 = !1
// @from(Ln 453544, Col 4)
RS1
// @from(Ln 453544, Col 9)
qx
// @from(Ln 453544, Col 13)
hS1
// @from(Ln 453544, Col 18)
_o6 = null
// @from(Ln 453545, Col 4)
tO
// @from(Ln 453546, Col 4)
Hm = E(() => {
    F46();
    T1();
    H1();
    i8();
    O2();
    hw();
    KY();
    LS1();
    g1();
    s8();
    B_z = Tvq + vvq + 200, RS1 = new Map, qx = new Map, hS1 = new Set;
    tO = {
        initialize: g_z,
        dispose: Nvq,
        subscribe: F_z,
        markInternalWrite: p_z,
        notifyChange: l_z,
        resetForTesting: i_z
    }
})
// @from(Ln 453573, Col 0)
function Lvq() {
    return $o6(bW(), "managed-settings.json")
}
// @from(Ln 453577, Col 0)
function Rvq(A, q) {
    if (typeof A === "object" && A && "code" in A && A.code === "ENOENT") k(`Broken symlink or missing file encountered for settings.json at path: ${q}`);
    else _6(A)
}
// @from(Ln 453582, Col 0)
function Ye(A) {
    try {
        let {
            resolvedPath: q
        } = qO($1(), A), K = IM(q);
        if (K.trim() === "") return {
            settings: {},
            errors: []
        };
        let Y = WK(K, !1),
            z = c31(Y, A),
            _ = oD().safeParse(Y);
        if (!_.success) {
            let w = vJ6(_.error, A);
            return {
                settings: null,
                errors: [...z, ...w]
            }
        }
        return {
            settings: _.data,
            errors: z
        }
    } catch (q) {
        return Rvq(q, A), {
            settings: null,
            errors: []
        }
    }
}
// @from(Ln 453613, Col 0)
function XD6(A) {
    switch (A) {
        case "userSettings":
            return wo6(c8());
        case "policySettings":
        case "projectSettings":
        case "localSettings":
            return wo6(AA());
        case "flagSettings": {
            let q = kn();
            return q ? yvq(wo6(q)) : wo6(AA())
        }
    }
}
// @from(Ln 453628, Col 0)
function n_z() {
    if (Uk6() || t6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return "cowork_settings.json";
    return "settings.json"
}
// @from(Ln 453633, Col 0)
function F_(A) {
    switch (A) {
        case "userSettings":
            return $o6(XD6(A), n_z());
        case "projectSettings":
        case "localSettings":
            return $o6(XD6(A), Yz6(A));
        case "policySettings":
            return Lvq();
        case "flagSettings":
            return kn()
    }
}
// @from(Ln 453647, Col 0)
function Yz6(A) {
    switch (A) {
        case "projectSettings":
            return $o6(".claude", "settings.json");
        case "localSettings":
            return $o6(".claude", "settings.local.json")
    }
}
// @from(Ln 453656, Col 0)
function L8(A) {
    if (A === "policySettings") {
        let Y = gG1();
        if (Y && Object.keys(Y).length > 0) return Y;
        let z = cN6();
        if (Object.keys(z.settings).length > 0) return z.settings;
        let _ = F_(A);
        if (_) {
            let {
                settings: O
            } = Ye(_);
            if (O && Object.keys(O).length > 0) return O
        }
        let w = lN6();
        if (Object.keys(w.settings).length > 0) return w.settings;
        return null
    }
    let q = F_(A),
        {
            settings: K
        } = q ? Ye(q) : {
            settings: null
        };
    if (A === "flagSettings") {
        let Y = Fw6();
        if (Y) {
            let z = oD().safeParse(Y);
            if (z.success) return C46(K || {}, z.data, Oo6)
        }
    }
    return K
}
// @from(Ln 453689, Col 0)
function SU4() {
    let A = gG1();
    if (A && Object.keys(A).length > 0) return "remote";
    let q = cN6();
    if (Object.keys(q.settings).length > 0) return y8() === "macos" ? "plist" : "hklm";
    let K = Lvq(),
        {
            settings: Y
        } = Ye(K);
    if (Y && Object.keys(Y).length > 0) return "file";
    let z = lN6();
    if (Object.keys(z.settings).length > 0) return "hkcu";
    return null
}
// @from(Ln 453704, Col 0)
function TA(A, q) {
    if (A === "policySettings" || A === "flagSettings") return {
        error: null
    };
    let K = F_(A);
    if (!K) return {
        error: null
    };
    try {
        $1().mkdirSync(yvq(K));
        let Y = L8(A);
        if (!Y) {
            let _ = null;
            try {
                _ = IM(K)
            } catch (w) {
                if (w.code !== "ENOENT") throw w
            }
            if (_ !== null) {
                let w = WK(_);
                if (w === null) return {
                    error: Error(`Invalid JSON syntax in settings file at ${K}`)
                };
                if (w && typeof w === "object") Y = w, k(`Using raw settings from ${K} due to validation failure`)
            }
        }
        let z = C46(Y || {}, q, (_, w, O, $) => {
            if (w === void 0 && $ && typeof O === "string") {
                delete $[O];
                return
            }
            if (Array.isArray(w)) return w;
            return
        });
        if (tO.markInternalWrite(A), nN6(K, B6(z, null, 2) + `
`), zP(), A === "localSettings") Z37(Yz6("localSettings"), AA())
    } catch (Y) {
        let z = Error(`Failed to read raw settings from ${K}: ${Y}`);
        return _6(z), {
            error: z
        }
    }
    return {
        error: null
    }
}
// @from(Ln 453751, Col 0)
function r_z(A, q) {
    let K = [...A, ...q];
    return Array.from(new Set(K))
}
// @from(Ln 453756, Col 0)
function Oo6(A, q) {
    if (Array.isArray(A) && Array.isArray(q)) return r_z(A, q);
    return
}
// @from(Ln 453761, Col 0)
function hvq(A) {
    let q = oD().strip().parse(A),
        K = ["permissions", "sandbox", "hooks"],
        Y = [],
        z = {
            permissions: new Set(["allow", "deny", "ask", "defaultMode", "disableBypassPermissionsMode", "disableAutoMode", "additionalDirectories"]),
            sandbox: new Set(["network", "ignoreViolations", "excludedCommands", "autoAllowBashIfSandboxed", "enableWeakerNestedSandbox", "enableWeakerNetworkIsolation"]),
            hooks: new Set(["PreToolUse", "PostToolUse", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStop", "PreCompact", "PostCompact", "TeammateIdle", "TaskCompleted"])
        };
    for (let _ of Object.keys(q))
        if (K.includes(_) && q[_] && typeof q[_] === "object") {
            let w = q[_],
                O = z[_];
            if (O) {
                for (let $ of Object.keys(w))
                    if (O.has($)) Y.push(`${_}.${$}`)
            }
        } else Y.push(_);
    return Y.sort()
}
// @from(Ln 453782, Col 0)
function o_z() {
    if (Br8) return {
        settings: {},
        errors: []
    };
    let A = Date.now();
    Zq("loadSettingsFromDisk_start"), U1("info", "settings_load_started"), Br8 = !0;
    try {
        let q = Dt6(),
            K = {};
        if (q) K = C46(K, q, Oo6);
        let Y = [],
            z = new Set,
            _ = new Set;
        for (let w of pQ()) {
            if (w === "policySettings") {
                let $ = null,
                    H = [],
                    j = gG1();
                if (j && Object.keys(j).length > 0) {
                    let J = oD().safeParse(j);
                    if (J.success) $ = J.data;
                    else H.push(...vJ6(J.error, "remote managed settings"))
                }
                if (!$) {
                    let J = cN6();
                    if (Object.keys(J.settings).length > 0) $ = J.settings;
                    H.push(...J.errors)
                }
                if (!$) {
                    let J = F_(w);
                    if (J) {
                        let {
                            settings: M,
                            errors: D
                        } = Ye(J);
                        if (M && Object.keys(M).length > 0) $ = M;
                        H.push(...D)
                    }
                }
                if (!$) {
                    let J = lN6();
                    if (Object.keys(J.settings).length > 0) $ = J.settings;
                    H.push(...J.errors)
                }
                if ($) K = C46(K, $, Oo6);
                for (let J of H) {
                    let M = `${J.file}:${J.path}:${J.message}`;
                    if (!z.has(M)) z.add(M), Y.push(J)
                }
                continue
            }
            let O = F_(w);
            if (O) {
                let $ = wo6(O);
                if (!_.has($)) {
                    _.add($);
                    let {
                        settings: H,
                        errors: j
                    } = Ye(O);
                    for (let J of j) {
                        let M = `${J.file}:${J.path}:${J.message}`;
                        if (!z.has(M)) z.add(M), Y.push(J)
                    }
                    if (H) K = C46(K, H, Oo6)
                }
            }
            if (w === "flagSettings") {
                let $ = Fw6();
                if ($) {
                    let H = oD().safeParse($);
                    if (H.success) K = C46(K, H.data, Oo6)
                }
            }
        }
        return U1("info", "settings_load_completed", {
            duration_ms: Date.now() - A,
            source_count: _.size,
            error_count: Y.length
        }), {
            settings: K,
            errors: Y
        }
    } finally {
        Br8 = !1
    }
}
// @from(Ln 453871, Col 0)
function mA() {
    let {
        settings: A
    } = lq6();
    return A || {}
}
// @from(Ln 453878, Col 0)
function Svq() {
    zP();
    let A = [];
    for (let q of pQ()) {
        let K = L8(q);
        if (K && Object.keys(K).length > 0) A.push({
            source: q,
            settings: K
        })
    }
    return {
        effective: mA(),
        sources: A
    }
}
// @from(Ln 453894, Col 0)
function lq6() {
    let A = y8A();
    if (A !== null) return A;
    let q = o_z();
    return L8A(q), q
}
// @from(Ln 453901, Col 0)
function OZ6() {
    return !!(L8("userSettings")?.skipDangerousModePermissionPrompt || L8("localSettings")?.skipDangerousModePermissionPrompt || L8("flagSettings")?.skipDangerousModePermissionPrompt || L8("policySettings")?.skipDangerousModePermissionPrompt)
}
// @from(Ln 453905, Col 0)
function s16() {
    return !!(L8("userSettings")?.skipAutoPermissionPrompt || L8("localSettings")?.skipAutoPermissionPrompt || L8("flagSettings")?.skipAutoPermissionPrompt || L8("policySettings")?.skipAutoPermissionPrompt)
}
// @from(Ln 453909, Col 0)
function RN1() {
    {
        let A = C.object({
                allow: C.array(C.string()).optional(),
                deny: C.array(C.string()).optional(),
                environment: C.array(C.string()).optional()
            }),
            q = [],
            K = [],
            Y = [];
        for (let z of ["userSettings", "localSettings", "flagSettings", "policySettings"]) {
            let _ = L8(z);
            if (!_) continue;
            let w = A.safeParse(_.autoMode);
            if (w.success) {
                if (w.data.allow) q.push(...w.data.allow);
                if (w.data.deny) K.push(...w.data.deny);
                if (w.data.environment) Y.push(...w.data.environment)
            }
        }
        if (q.length > 0 || K.length > 0 || Y.length > 0) return {
            ...q.length > 0 ? {
                allow: q
            } : {},
            ...K.length > 0 ? {
                deny: K
            } : {},
            ...Y.length > 0 ? {
                environment: Y
            } : {}
        }
    }
    return
}
// @from(Ln 453944, Col 0)
function Cvq(A) {
    for (let q of pQ()) {
        if (q === "policySettings") continue;
        let K = F_(q);
        if (!K) continue;
        try {
            let {
                resolvedPath: Y
            } = qO($1(), K), z = IM(Y);
            if (!z.trim()) continue;
            let _ = WK(z, !1);
            if (_ && typeof _ === "object" && A in _) return !0
        } catch (Y) {
            Rvq(Y, K)
        }
    }
    return !1
}
// @from(Ln 453962, Col 4)
Br8 = !1
// @from(Ln 453963, Col 4)
PA
// @from(Ln 453964, Col 4)
i8 = E(() => {
    K7();
    $57();
    Z7();
    SA();
    K_();
    k1();
    H1();
    u_();
    XS();
    YK();
    O2();
    jC();
    T1();
    C58();
    A8();
    l31();
    So();
    Hm();
    vR8();
    LS1();
    g1();
    PA = mA
})
// @from(Ln 453989, Col 0)
function CS1(A) {
    let q = {};
    for (let K of bvq) q[K] = OJ6[K][A];
    return q
}
// @from(Ln 453994, Col 0)
async function a_z() {
    let A = CS1("bedrock"),
        q;
    try {
        q = await hK7()
    } catch (Y) {
        return _6(Y), A
    }
    if (!q?.length) return A;
    let K = {};
    for (let Y of bvq) {
        let z = OJ6[Y].firstParty;
        K[Y] = SK7(q, z) || A[Y]
    }
    return K
}
// @from(Ln 454011, Col 0)
function Ivq(A) {
    let q = mA().modelOverrides;
    if (!q) return A;
    let K = {
        ...A
    };
    for (let [Y, z] of Object.entries(q)) {
        let _ = xK7[Y];
        if (_ && z) K[_] = z
    }
    return K
}
// @from(Ln 454024, Col 0)
function qE1(A) {
    let q;
    try {
        q = mA().modelOverrides
    } catch {
        return A
    }
    if (!q) return A;
    for (let [K, Y] of Object.entries(q))
        if (Y === A) return K;
    return A
}
// @from(Ln 454037, Col 0)
function s_z() {
    if (mw6() !== null) return;
    if (QA() !== "bedrock") {
        uk6(CS1(QA()));
        return
    }
    xvq()
}
// @from(Ln 454046, Col 0)
function _3() {
    let A = mw6();
    if (A === null) return s_z(), Ivq(CS1(QA()));
    return Ivq(A)
}
// @from(Ln 454051, Col 0)
async function uvq() {
    if (mw6() !== null) return;
    if (QA() !== "bedrock") {
        uk6(CS1(QA()));
        return
    }
    await xvq()
}
// @from(Ln 454059, Col 4)
bvq
// @from(Ln 454059, Col 9)
xvq
// @from(Ln 454060, Col 4)
ht = E(() => {
    T1();
    k1();
    vC6();
    T31();
    Nz();
    i8();
    bvq = Object.keys(OJ6);
    xvq = Bu(async () => {
        if (mw6() !== null) return;
        try {
            let A = await a_z();
            uk6(A)
        } catch (A) {
            _6(A)
        }
    })
})
// @from(Ln 454078, Col 4)
IHq = {}
// @from(Ln 454109, Col 0)
function lH() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || hT6()
}
// @from(Ln 454113, Col 0)
function V36(A) {
    return A === _3().opus40 || A === _3().opus41 || A === _3().opus45 || A === _3().opus46
}
// @from(Ln 454117, Col 0)
function uR() {
    let A, q = HS();
    if (q !== void 0) A = q;
    else {
        let K = PA() || {};
        A = process.env.ANTHROPIC_MODEL || K.model || void 0
    }
    if (A && !s66(A)) return;
    return A
}
// @from(Ln 454128, Col 0)
function cK() {
    let A = uR();
    if (A !== void 0 && A !== null) return H5(A);
    return g0()
}
// @from(Ln 454134, Col 0)
function mvq() {
    return GN()
}
// @from(Ln 454138, Col 0)
function GN() {
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (QA() !== "firstParty") return _3().opus46;
    return _3().opus46
}
// @from(Ln 454144, Col 0)
function Ef() {
    if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    if (QA() !== "firstParty") return _3().sonnet45;
    return _3().sonnet46
}
// @from(Ln 454150, Col 0)
function hT6() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return _3().haiku45
}
// @from(Ln 454155, Col 0)
function II(A) {
    let {
        permissionMode: q,
        mainLoopModel: K,
        exceeds200kTokens: Y = !1
    } = A;
    if (uR() === "opusplan" && q === "plan" && !Y) return GN();
    if (uR() === "haiku" && q === "plan") return Ef();
    return K
}
// @from(Ln 454166, Col 0)
function Mv() {
    if (RL()) return GN() + (pH() ? "[1m]" : "");
    if (t66()) return GN() + (pH() ? "[1m]" : "");
    return Ef()
}
// @from(Ln 454172, Col 0)
function g0() {
    return H5(Mv())
}
// @from(Ln 454176, Col 0)
function Of(A) {
    if (A = A.toLowerCase(), A.includes("claude-opus-4-6")) return "claude-opus-4-6";
    if (A.includes("claude-opus-4-5")) return "claude-opus-4-5";
    if (A.includes("claude-opus-4-1")) return "claude-opus-4-1";
    if (A.includes("claude-opus-4")) return "claude-opus-4";
    if (A.includes("claude-sonnet-4-6")) return "claude-sonnet-4-6";
    if (A.includes("claude-sonnet-4-5")) return "claude-sonnet-4-5";
    if (A.includes("claude-sonnet-4")) return "claude-sonnet-4";
    if (A.includes("claude-haiku-4-5")) return "claude-haiku-4-5";
    if (A.includes("claude-3-7-sonnet")) return "claude-3-7-sonnet";
    if (A.includes("claude-3-5-sonnet")) return "claude-3-5-sonnet";
    if (A.includes("claude-3-5-haiku")) return "claude-3-5-haiku";
    if (A.includes("claude-3-opus")) return "claude-3-opus";
    if (A.includes("claude-3-sonnet")) return "claude-3-sonnet";
    if (A.includes("claude-3-haiku")) return "claude-3-haiku";
    let q = A.match(/(claude-(\d+-\d+-)?\w+)/);
    if (q && q[1]) return q[1];
    return A
}
// @from(Ln 454196, Col 0)
function IY(A) {
    return Of(qE1(A))
}
// @from(Ln 454200, Col 0)
function Of6(A = !1) {
    if (RL() || t66()) {
        if (pH()) return `Opus 4.6 with 1M context [NEW] · Most capable for complex work${A?Il(!0):""}`;
        return `Opus 4.6 · Most capable for complex work${A?Il(!0):""}`
    }
    return "Sonnet 4.6 · Best for everyday tasks"
}
// @from(Ln 454208, Col 0)
function Oi6(A) {
    if (A === "opusplan") return "Opus 4.6 in plan mode, else Sonnet 4.6";
    return qJ(H5(A))
}
// @from(Ln 454213, Col 0)
function Il(A) {
    if (QA() !== "firstParty") return "";
    let q = zR(N06(A));
    return ` ·${A?` (${De})`:""} ${q}`
}
// @from(Ln 454219, Col 0)
function pH() {
    if (ke() || LC() || QA() !== "firstParty") return !1;
    return w8("tengu_cobalt_compass", !1)
}
// @from(Ln 454224, Col 0)
function on6(A) {
    if (A === "opusplan") return "Opus Plan";
    if (zc(A)) return A.charAt(0).toUpperCase() + A.slice(1);
    return qJ(A)
}
// @from(Ln 454230, Col 0)
function ei6(A) {
    switch (A) {
        case _3().opus46:
            return "Opus 4.6";
        case _3().opus46 + "[1m]":
            return "Opus 4.6 (1M context)";
        case _3().opus45:
            return "Opus 4.5";
        case _3().opus41:
            return "Opus 4.1";
        case _3().opus40:
            return "Opus 4";
        case _3().sonnet46 + "[1m]":
            return "Sonnet 4.6 (1M context)";
        case _3().sonnet46:
            return "Sonnet 4.6";
        case _3().sonnet45 + "[1m]":
            return "Sonnet 4.5 (1M context)";
        case _3().sonnet45:
            return "Sonnet 4.5";
        case _3().sonnet40:
            return "Sonnet 4";
        case _3().sonnet40 + "[1m]":
            return "Sonnet 4 (1M context)";
        case _3().sonnet37:
            return "Sonnet 3.7";
        case _3().sonnet35:
            return "Sonnet 3.5";
        case _3().haiku45:
            return "Haiku 4.5";
        case _3().haiku35:
            return "Haiku 3.5";
        default:
            return null
    }
}
// @from(Ln 454267, Col 0)
function qJ(A) {
    let q = ei6(A);
    if (q) return q;
    return A
}
// @from(Ln 454273, Col 0)
function cQ8(A) {
    let q = ei6(A);
    if (q) return `Claude ${q}`;
    return `Claude (${A})`
}
// @from(Ln 454279, Col 0)
function H5(A) {
    let q = A.trim(),
        K = q.toLowerCase(),
        Y = Cf(K),
        z = Y ? K.replace(/\[1m]$/i, "").trim() : K;
    if (zc(z)) switch (z) {
        case "opusplan":
            return Ef() + (Y ? "[1m]" : "");
        case "sonnet":
            return Ef() + (Y ? "[1m]" : "");
        case "haiku":
            return hT6() + (Y ? "[1m]" : "");
        case "opus":
            return GN() + (Y ? "[1m]" : "");
        case "best":
            return mvq();
        default:
    }
    if (QA() === "firstParty" && e_z(z) && IS1()) return GN() + (Y ? "[1m]" : "");
    if (Y) return q.replace(/\[1m\]$/i, "").trim() + "[1m]";
    return q
}
// @from(Ln 454302, Col 0)
function Pl6(A, q) {
    if (Cf(A) || !Cf(q)) return A;
    if (gr8(H5(A))) return A + "[1m]";
    return A
}
// @from(Ln 454308, Col 0)
function e_z(A) {
    return t_z.includes(A)
}
// @from(Ln 454312, Col 0)
function IS1() {
    if (t6(process.env.CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP)) return !1;
    return w8("tengu_grey_wool", !0)
}
// @from(Ln 454317, Col 0)
function oR(A) {
    if (A === null) {
        if (iA()) return `Default (${Of6()})`;
        return `Default (${g0()})`
    }
    let q = H5(A);
    return A === q ? q : `${A} (${q})`
}
// @from(Ln 454326, Col 0)
function Cl(A) {
    if (QA() === "foundry") return;
    let q = A.toLowerCase().includes("[1m]"),
        K = IY(A);
    if (K.includes("claude-opus-4-6")) return q ? "Opus 4.6 (with 1M context)" : "Opus 4.6";
    if (K.includes("claude-opus-4-5")) return "Opus 4.5";
    if (K.includes("claude-opus-4-1")) return "Opus 4.1";
    if (K.includes("claude-opus-4")) return "Opus 4";
    if (K.includes("claude-sonnet-4-6")) return q ? "Sonnet 4.6 (with 1M context)" : "Sonnet 4.6";
    if (K.includes("claude-sonnet-4-5")) return q ? "Sonnet 4.5 (with 1M context)" : "Sonnet 4.5";
    if (K.includes("claude-sonnet-4")) return q ? "Sonnet 4 (with 1M context)" : "Sonnet 4";
    if (K.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
    if (K.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
    if (K.includes("claude-haiku-4-5")) return "Haiku 4.5";
    if (K.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
    return
}
// @from(Ln 454344, Col 0)
function lg(A) {
    return A.replace(/\[(1|2)m\]/gi, "")
}
// @from(Ln 454347, Col 4)
t_z
// @from(Ln 454348, Col 4)
z4 = E(() => {
    T1();
    fA();
    xJ();
    A8();
    ht();
    Mt();
    i8();
    Nz();
    qw();
    zi6();
    dW6();
    HA();
    t_z = ["claude-opus-4-20250514", "claude-opus-4-1-20250805", "claude-opus-4-0", "claude-opus-4-1"]
})
// @from(Ln 454364, Col 0)
function ke() {
    return t6(process.env.CLAUDE_CODE_DISABLE_1M_CONTEXT)
}
// @from(Ln 454368, Col 0)
function Cf(A) {
    if (ke()) return !1;
    return /\[1m\]/i.test(A)
}
// @from(Ln 454373, Col 0)
function gr8(A) {
    if (ke()) return !1;
    let q = IY(A);
    return q.includes("claude-sonnet-4") || q.includes("opus-4-6")
}
// @from(Ln 454379, Col 0)
function uM(A, q) {
    if (Cf(A) || q?.includes(Gr) && gr8(A)) return 1e6;
    if (Pn8(A)) return 1e6;
    return A2z
}
// @from(Ln 454385, Col 0)
function Pn8(A) {
    if (ke()) return !1;
    if (Cf(A)) return !1;
    if (!IY(A).includes("sonnet-4-6")) return !1;
    return HLA()
}
// @from(Ln 454392, Col 0)
function bS1(A, q) {
    if (!A) return {
        used: null,
        remaining: null
    };
    let K = A.input_tokens + A.cache_creation_input_tokens + A.cache_read_input_tokens,
        Y = Math.round(K / q * 100),
        z = Math.min(100, Math.max(0, Y));
    return {
        used: z,
        remaining: 100 - z
    }
}
// @from(Ln 454406, Col 0)
function oa(A) {
    let q, K, Y = IY(A);
    if (Y.includes("opus-4-5") || Y.includes("opus-4-6") || Y.includes("sonnet-4") || Y.includes("haiku-4")) q = 32000, K = 64000;
    else if (Y.includes("opus-4-1") || Y.includes("opus-4")) q = 32000, K = 32000;
    else if (Y.includes("claude-3-opus")) q = 4096, K = 4096;
    else if (Y.includes("claude-3-sonnet")) q = 8192, K = 8192;
    else if (Y.includes("claude-3-haiku")) q = 4096, K = 4096;
    else if (Y.includes("3-5-sonnet") || Y.includes("3-5-haiku")) q = 8192, K = 8192;
    else if (Y.includes("3-7-sonnet")) q = 32000, K = 64000;
    else q = q2z, K = K2z;
    return {
        default: q,
        upperLimit: K
    }
}
// @from(Ln 454422, Col 0)
function FGq(A) {
    return oa(A).upperLimit - 1
}
// @from(Ln 454425, Col 4)
A2z = 200000
// @from(Ln 454426, Col 4)
Vqq = 20000
// @from(Ln 454427, Col 4)
q2z = 32000
// @from(Ln 454428, Col 4)
K2z = 64000
// @from(Ln 454429, Col 4)
xJ = E(() => {
    Ar1();
    Tr();
    A8();
    z4()
})
// @from(Ln 454436, Col 0)
function z2z(A) {
    let q = [],
        K = [];
    for (let Y of A)
        if (gvq.includes(Y)) q.push(Y);
        else K.push(Y);
    return {
        allowed: q,
        disallowed: K
    }
}
// @from(Ln 454448, Col 0)
function Fvq(A) {
    if (!A || A.length === 0) return;
    if (iA()) {
        console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas.");
        return
    }
    let {
        allowed: q,
        disallowed: K
    } = z2z(A);
    for (let Y of K) console.warn(`Warning: Beta header '${Y}' is not allowed. Only the following betas are supported: ${gvq.join(", ")}`);
    return q.length > 0 ? q : void 0
}
// @from(Ln 454462, Col 0)
function Bvq(A) {
    let q = IY(A),
        K = QA();
    if (K === "foundry") return !0;
    if (K === "firstParty") return !q.includes("claude-3-");
    return q.includes("claude-opus-4") || q.includes("claude-sonnet-4")
}
// @from(Ln 454470, Col 0)
function _2z(A) {
    let q = IY(A);
    return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4")
}
// @from(Ln 454475, Col 0)
function w2z(A) {
    let q = IY(A),
        K = QA();
    if (K === "foundry") return !0;
    if (K === "firstParty") return !q.includes("claude-3-");
    return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4")
}
// @from(Ln 454483, Col 0)
function eY6(A) {
    let q = IY(A),
        K = QA();
    if (K !== "firstParty" && K !== "foundry") return !1;
    return q.includes("claude-sonnet-4-6") || q.includes("claude-sonnet-4-5") || q.includes("claude-opus-4-1") || q.includes("claude-opus-4-5") || q.includes("claude-opus-4-6") || q.includes("claude-haiku-4-5")
}
// @from(Ln 454490, Col 0)
function IN6(A) {
    {
        let q = IY(A);
        if (QA() !== "firstParty") return !1;
        if (w8("tengu_auto_mode_config", {})?.allowModels?.includes(q)) return !0;
        return /^claude-(opus|sonnet)-4-6/.test(q)
    }
    return !1
}
// @from(Ln 454500, Col 0)
function pGq() {
    let A = QA();
    if (A === "vertex" || A === "bedrock") return zLA;
    return YLA
}
// @from(Ln 454506, Col 0)
function C_6() {
    return (QA() === "firstParty" || QA() === "foundry") && !t6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}
// @from(Ln 454510, Col 0)
function Ch1(A, q) {
    let K = [...bk(A)];
    if (q?.isAgenticQuery) {
        if (!K.includes(lA1)) K.push(lA1)
    }
    let Y = Zj();
    if (!Y || Y.length === 0) return K;
    return [...K, ...Y.filter((z) => !K.includes(z))]
}
// @from(Ln 454520, Col 0)
function Ov1() {
    Fr8.cache?.clear?.(), bk.cache?.clear?.(), Wn8.cache?.clear?.()
}
// @from(Ln 454523, Col 4)
gvq
// @from(Ln 454523, Col 9)
Fr8
// @from(Ln 454523, Col 14)
bk
// @from(Ln 454523, Col 18)
Wn8
// @from(Ln 454524, Col 4)
Mf = E(() => {
    U4();
    T1();
    Tr();
    HA();
    F5();
    fA();
    A8();
    Nz();
    HA();
    xJ();
    z4();
    i8();
    gvq = [Gr];
    Fr8 = e1((A) => {
        let q = [],
            K = IY(A).includes("haiku"),
            Y = QA(),
            z = C_6();
        if (!K) q.push(lA1);
        if (iA()) q.push(DP);
        if (Cf(A)) q.push(Gr);
        if (!t6(process.env.DISABLE_INTERLEAVED_THINKING) && Bvq(A)) q.push(KLA);
        if (z && Bvq(A) && !q7() && mA().showThinkingSummaries !== !0 && w8("tengu_quiet_hollow", !1)) q.push(wLA);
        let _ = t6(process.env.USE_API_CONTEXT_MANAGEMENT) && !1,
            w = w2z(A) && w8("tengu_marble_anvil", !1);
        if (C_6() && (_ || w)) q.push(iA1);
        let O = jY("tengu_tool_pear");
        if (eY6(A) && O) q.push(fr);
        if (z && w8("tengu_scarf_coffee", !1)) q.push(nA1);
        if (Y === "vertex" && _2z(A)) q.push(an1);
        if (Y === "foundry") q.push(an1);
        if (z) q.push(kR6);
        if (process.env.ANTHROPIC_BETAS && !K) q.push(...process.env.ANTHROPIC_BETAS.split(",").map(($) => $.trim()).filter(Boolean));
        return q
    }), bk = e1((A) => {
        let q = Fr8(A);
        if (QA() === "bedrock") return q.filter((K) => !tn1.has(K));
        return q
    }), Wn8 = e1((A) => {
        return Fr8(A).filter((K) => tn1.has(K))
    })
})
// @from(Ln 454571, Col 0)
function hq(A) {
    if (A.startsWith("mcp__")) return "mcp_tool";
    return A
}
// @from(Ln 454576, Col 0)
function I4q() {
    return t6(process.env.OTEL_LOG_TOOL_DETAILS)
}
// @from(Ln 454580, Col 0)
function YF() {
    return t6(process.env.ANALYTICS_LOG_TOOL_DETAILS)
}
// @from(Ln 454584, Col 0)
function gb(A) {
    if (!A.startsWith("mcp__")) return;
    let q = A.split("__");
    if (q.length < 3) return;
    let K = q[1],
        Y = q.slice(2).join("__");
    if (!K || !Y) return;
    return {
        serverName: K,
        mcpToolName: Y
    }
}
// @from(Ln 454597, Col 0)
function b4q(A, q) {
    if (A !== "Skill") return;
    if (typeof q === "object" && q !== null && "skill" in q && typeof q.skill === "string") return q.skill;
    return
}
// @from(Ln 454603, Col 0)
function F36(A) {
    let q = O2z(A).toLowerCase();
    if (!q || q === ".") return;
    let K = q.slice(1);
    if (K.length > H2z) return "other";
    return K
}
// @from(Ln 454611, Col 0)
function x4q(A, q) {
    if (!A.includes(".") && !q) return;
    let K, Y = new Set;
    if (q) {
        let z = F36(q);
        if (z) Y.add(z), K = z
    }
    for (let z of A.split(J2z)) {
        if (!z) continue;
        let _ = z.split(M2z);
        if (_.length < 2) continue;
        let w = _[0],
            O = w.lastIndexOf("/"),
            $ = O >= 0 ? w.slice(O + 1) : w;
        if (!j2z.has($)) continue;
        for (let H = 1; H < _.length; H++) {
            let j = _[H];
            if (j.charCodeAt(0) === 45) continue;
            let J = F36(j);
            if (J && !Y.has(J)) Y.add(J), K = K ? K + "," + J : J
        }
    }
    if (!K) return;
    return K
}
// @from(Ln 454637, Col 0)
function D2z() {
    let A = Tf6();
    if (A) {
        let O = {
            agentId: A.agentId,
            parentSessionId: A.parentSessionId,
            agentType: A.agentType
        };
        if (A.agentType === "teammate") O.teamName = A.teamName;
        return O
    }
    let q = nM(),
        K = Zt(),
        Y = l5(),
        _ = $Y() ? "teammate" : q ? "standalone" : void 0;
    if (q || _ || K || Y) return {
        ...q ? {
            agentId: q
        } : {},
        ..._ ? {
            agentType: _
        } : {},
        ...K ? {
            parentSessionId: K
        } : {},
        ...Y ? {
            teamName: Y
        } : {}
    };
    let w = nx1();
    if (w) return {
        parentSessionId: w
    };
    return {}
}
// @from(Ln 454673, Col 0)
function W2z() {
    try {
        let A = process.memoryUsage(),
            q = process.cpuUsage(),
            K = Date.now(),
            Y;
        if (xS1 && pr8) {
            let z = K - pr8;
            if (z > 0) {
                let _ = q.user - xS1.user,
                    w = q.system - xS1.system;
                Y = (_ + w) / (z * 1000) * 100
            }
        }
        return xS1 = q, pr8 = K, {
            uptime: process.uptime(),
            rss: A.rss,
            heapTotal: A.heapTotal,
            heapUsed: A.heapUsed,
            external: A.external,
            arrayBuffers: A.arrayBuffers,
            constrainedMemory: process.constrainedMemory(),
            cpuUsage: q,
            cpuPercent: Y
        }
    } catch {
        return
    }
}
// @from(Ln 454702, Col 0)
async function eZ6(A = {}) {
    let q = A.model ? String(A.model) : cK(),
        K = typeof A.betas === "string" ? A.betas : bk(q).join(","),
        [Y, z] = await Promise.all([P2z(), FC6()]),
        _ = W2z();
    return {
        model: q,
        sessionId: R1(),
        userType: "external",
        ...K.length > 0 ? {
            betas: K
        } : {},
        envContext: Y,
        ...process.env.CLAUDE_CODE_ENTRYPOINT && {
            entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
        },
        ...process.env.CLAUDE_AGENT_SDK_VERSION && {
            agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
        },
        isInteractive: String(DW()),
        clientType: gw6(),
        ..._ && {
            processMetrics: _
        },
        sweBenchRunId: process.env.SWE_BENCH_RUN_ID || "",
        sweBenchInstanceId: process.env.SWE_BENCH_INSTANCE_ID || "",
        sweBenchTaskId: process.env.SWE_BENCH_TASK_ID || "",
        ...D2z(),
        ...CK() && {
            subscriptionType: CK()
        },
        ...{},
        ...z && {
            rh: z
        }
    }
}
// @from(Ln 454740, Col 0)
function UN4(A, q = {}) {
    let {
        envContext: K,
        processMetrics: Y,
        ...z
    } = A;
    return {
        ...q,
        ...z,
        env: K,
        ...Y && {
            process: Y
        },
        surface: $2z
    }
}
// @from(Ln 454757, Col 0)
function Qvq(A, q, K = {}) {
    let {
        envContext: Y,
        processMetrics: z,
        rh: _,
        kairosActive: w,
        ...O
    } = A, $ = {
        platform: Y.platform,
        arch: Y.arch,
        node_version: Y.nodeVersion,
        terminal: Y.terminal || "unknown",
        package_managers: Y.packageManagers,
        runtimes: Y.runtimes,
        is_running_with_bun: Y.isRunningWithBun,
        is_ci: Y.isCi,
        is_claubbit: Y.isClaubbit,
        is_claude_code_remote: Y.isClaudeCodeRemote,
        is_local_agent_mode: Y.isLocalAgentMode,
        is_conductor: Y.isConductor,
        is_github_action: Y.isGithubAction,
        is_claude_code_action: Y.isClaudeCodeAction,
        is_claude_ai_auth: Y.isClaudeAiAuth,
        version: Y.version,
        build_time: Y.buildTime,
        deployment_environment: Y.deploymentEnvironment
    };
    if (Y.remoteEnvironmentType) $.remote_environment_type = Y.remoteEnvironmentType;
    if (Y.claudeCodeContainerId) $.claude_code_container_id = Y.claudeCodeContainerId;
    if (Y.claudeCodeRemoteSessionId) $.claude_code_remote_session_id = Y.claudeCodeRemoteSessionId;
    if (Y.tags) $.tags = Y.tags.split(",").map((J) => J.trim()).filter(Boolean);
    if (Y.githubEventName) $.github_event_name = Y.githubEventName;
    if (Y.githubActionsRunnerEnvironment) $.github_actions_runner_environment = Y.githubActionsRunnerEnvironment;
    if (Y.githubActionsRunnerOs) $.github_actions_runner_os = Y.githubActionsRunnerOs;
    if (Y.githubActionRef) $.github_action_ref = Y.githubActionRef;
    if (Y.wslVersion) $.wsl_version = Y.wslVersion;
    if (Y.linuxDistroId) $.linux_distro_id = Y.linuxDistroId;
    if (Y.linuxDistroVersion) $.linux_distro_version = Y.linuxDistroVersion;
    if (Y.linuxKernel) $.linux_kernel = Y.linuxKernel;
    if (Y.vcs) $.vcs = Y.vcs;
    if (Y.versionBase) $.version_base = Y.versionBase;
    let H = {
        session_id: O.sessionId,
        model: O.model,
        user_type: O.userType,
        is_interactive: O.isInteractive === "true",
        client_type: O.clientType
    };
    if (O.betas) H.betas = O.betas;
    if (O.entrypoint) H.entrypoint = O.entrypoint;
    if (O.agentSdkVersion) H.agent_sdk_version = O.agentSdkVersion;
    if (O.sweBenchRunId) H.swe_bench_run_id = O.sweBenchRunId;
    if (O.sweBenchInstanceId) H.swe_bench_instance_id = O.sweBenchInstanceId;
    if (O.sweBenchTaskId) H.swe_bench_task_id = O.sweBenchTaskId;
    if (O.agentId) H.agent_id = O.agentId;
    if (O.parentSessionId) H.parent_session_id = O.parentSessionId;
    if (O.agentType) H.agent_type = O.agentType;
    if (O.teamName) H.team_name = O.teamName;
    if (q.githubActionsMetadata) {
        let J = q.githubActionsMetadata;
        $.github_actions_metadata = {
            actor_id: J.actorId,
            repository_id: J.repositoryId,
            repository_owner_id: J.repositoryOwnerId
        }
    }
    let j;
    if (q.accountUuid || q.organizationUuid) j = {
        account_uuid: q.accountUuid,
        organization_uuid: q.organizationUuid
    };
    return {
        env: $,
        ...z && {
            process: B6(z)
        },
        ...j && {
            auth: j
        },
        core: H,
        additional: {
            ..._ && {
                rh: _
            },
            ...w && {
                is_assistant_mode: !0
            },
            ...K
        }
    }
}
// @from(Ln 454848, Col 4)
$2z = "claude-code"
// @from(Ln 454849, Col 4)
H2z = 10
// @from(Ln 454850, Col 4)
j2z
// @from(Ln 454850, Col 9)
J2z
// @from(Ln 454850, Col 14)
M2z
// @from(Ln 454850, Col 19)
X2z
// @from(Ln 454850, Col 24)
P2z
// @from(Ln 454850, Col 29)
xS1 = null
// @from(Ln 454851, Col 4)
pr8 = null
// @from(Ln 454852, Col 4)
o$ = E(() => {
    U4();
    d3();
    Zr();
    Mf();
    z4();
    T1();
    A8();
    fA();
    $5();
    YK();
    P66();
    g1();
    zz();
    j2z = new Set(["rm", "mv", "cp", "touch", "mkdir", "chmod", "chown", "cat", "head", "tail", "sort", "stat", "diff", "wc", "grep", "rg", "sed"]), J2z = /\s*(?:&&|\|\||[;|])\s*/, M2z = /\s+/;
    X2z = e1(() => {
        let A = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION.match(/^\d+\.\d+\.\d+(?:-[a-z]+)?/);
        return A ? A[0] : void 0
    }), P2z = e1(async () => {
        let [A, q, K, Y] = await Promise.all([Q8.getPackageManagers(), Q8.getRuntimes(), vjA(), NjA()]);
        return {
            platform: T$6(),
            arch: Q8.arch,
            nodeVersion: Q8.nodeVersion,
            terminal: LT.terminal,
            packageManagers: A.join(","),
            runtimes: q.join(","),
            isRunningWithBun: Q8.isRunningWithBun(),
            isCi: t6(!1),
            isClaubbit: t6(process.env.CLAUBBIT),
            isClaudeCodeRemote: t6(process.env.CLAUDE_CODE_REMOTE),
            isLocalAgentMode: process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent",
            isConductor: Q8.isConductor(),
            ...process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE && {
                remoteEnvironmentType: process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE
            },
            ...{},
            ...process.env.CLAUDE_CODE_CONTAINER_ID && {
                claudeCodeContainerId: process.env.CLAUDE_CODE_CONTAINER_ID
            },
            ...process.env.CLAUDE_CODE_REMOTE_SESSION_ID && {
                claudeCodeRemoteSessionId: process.env.CLAUDE_CODE_REMOTE_SESSION_ID
            },
            ...process.env.CLAUDE_CODE_TAGS && {
                tags: process.env.CLAUDE_CODE_TAGS
            },
            isGithubAction: t6(process.env.GITHUB_ACTIONS),
            isClaudeCodeAction: t6(process.env.CLAUDE_CODE_ACTION),
            isClaudeAiAuth: iA(),
            version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            versionBase: X2z(),
            buildTime: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.BUILD_TIME,
            deploymentEnvironment: Q8.detectDeploymentEnvironment(),
            ...t6(process.env.GITHUB_ACTIONS) && {
                githubEventName: process.env.GITHUB_EVENT_NAME,
                githubActionsRunnerEnvironment: process.env.RUNNER_ENVIRONMENT,
                githubActionsRunnerOs: process.env.RUNNER_OS,
                githubActionRef: process.env.GITHUB_ACTION_PATH?.includes("claude-code-action/") ? process.env.GITHUB_ACTION_PATH.split("claude-code-action/")[1] : void 0
            },
            ...sA6() && {
                wslVersion: sA6()
            },
            ...K ?? {},
            ...Y.length > 0 ? {
                vcs: Y.join(",")
            } : {}
        }
    })
})
// @from(Ln 454943, Col 0)
function Z2z() {
    return {
        seconds: 0,
        nanos: 0
    }
}
// @from(Ln 454950, Col 0)
function Uvq(A) {
    return A !== null && A !== void 0
}
// @from(Ln 454953, Col 4)
Ho6
// @from(Ln 454954, Col 4)
Qr8 = E(() => {
    Ho6 = {
        fromJSON(A) {
            return {
                seconds: Uvq(A.seconds) ? globalThis.Number(A.seconds) : 0,
                nanos: Uvq(A.nanos) ? globalThis.Number(A.nanos) : 0
            }
        },
        toJSON(A) {
            let q = {};
            if (A.seconds !== void 0) q.seconds = Math.round(A.seconds);
            if (A.nanos !== void 0) q.nanos = Math.round(A.nanos);
            return q
        },
        create(A) {
            return Ho6.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = Z2z();
            return q.seconds = A.seconds ?? 0, q.nanos = A.nanos ?? 0, q
        }
    }
})
// @from(Ln 454978, Col 0)
function G2z() {
    return {
        account_id: 0,
        organization_uuid: "",
        account_uuid: ""
    }
}
// @from(Ln 454986, Col 0)
function Ur8(A) {
    return A !== null && A !== void 0
}
// @from(Ln 454989, Col 4)
yi
// @from(Ln 454990, Col 4)
dr8 = E(() => {
    yi = {
        fromJSON(A) {
            return {
                account_id: Ur8(A.account_id) ? globalThis.Number(A.account_id) : 0,
                organization_uuid: Ur8(A.organization_uuid) ? globalThis.String(A.organization_uuid) : "",
                account_uuid: Ur8(A.account_uuid) ? globalThis.String(A.account_uuid) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.account_id !== void 0) q.account_id = Math.round(A.account_id);
            if (A.organization_uuid !== void 0) q.organization_uuid = A.organization_uuid;
            if (A.account_uuid !== void 0) q.account_uuid = A.account_uuid;
            return q
        },
        create(A) {
            return yi.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = G2z();
            return q.account_id = A.account_id ?? 0, q.organization_uuid = A.organization_uuid ?? "", q.account_uuid = A.account_uuid ?? "", q
        }
    }
})
// @from(Ln 455016, Col 0)
function f2z() {
    return {
        actor_id: "",
        repository_id: "",
        repository_owner_id: ""
    }
}
// @from(Ln 455024, Col 0)
function T2z() {
    return {
        platform: "",
        node_version: "",
        terminal: "",
        package_managers: "",
        runtimes: "",
        is_running_with_bun: !1,
        is_ci: !1,
        is_claubbit: !1,
        is_github_action: !1,
        is_claude_code_action: !1,
        is_claude_ai_auth: !1,
        version: "",
        github_event_name: "",
        github_actions_runner_environment: "",
        github_actions_runner_os: "",
        github_action_ref: "",
        wsl_version: "",
        github_actions_metadata: void 0,
        arch: "",
        is_claude_code_remote: !1,
        remote_environment_type: "",
        claude_code_container_id: "",
        claude_code_remote_session_id: "",
        tags: [],
        deployment_environment: "",
        is_conductor: !1,
        version_base: "",
        coworker_type: "",
        build_time: "",
        is_local_agent_mode: !1,
        linux_distro_id: "",
        linux_distro_version: "",
        linux_kernel: "",
        vcs: ""
    }
}
// @from(Ln 455063, Col 0)
function v2z() {
    return {
        slack_team_id: "",
        is_enterprise_install: !1,
        trigger: "",
        creation_method: ""
    }
}
// @from(Ln 455072, Col 0)
function N2z() {
    return {
        event_name: "",
        client_timestamp: void 0,
        model: "",
        session_id: "",
        user_type: "",
        betas: "",
        env: void 0,
        entrypoint: "",
        agent_sdk_version: "",
        is_interactive: !1,
        client_type: "",
        process: "",
        additional_metadata: "",
        auth: void 0,
        server_timestamp: void 0,
        event_id: "",
        device_id: "",
        swe_bench_run_id: "",
        swe_bench_instance_id: "",
        swe_bench_task_id: "",
        email: "",
        agent_id: "",
        parent_session_id: "",
        agent_type: "",
        slack: void 0,
        team_name: ""
    }
}
// @from(Ln 455103, Col 0)
function V2z(A) {
    let q = (A.seconds || 0) * 1000;
    return q += (A.nanos || 0) / 1e6, new globalThis.Date(q)
}
// @from(Ln 455108, Col 0)
function dvq(A) {
    if (A instanceof globalThis.Date) return A;
    else if (typeof A === "string") return new globalThis.Date(A);
    else return V2z(Ho6.fromJSON(A))
}
// @from(Ln 455114, Col 0)
function c4(A) {
    return A !== null && A !== void 0
}
// @from(Ln 455117, Col 4)
uS1
// @from(Ln 455117, Col 9)
mS1
// @from(Ln 455117, Col 14)
BS1
// @from(Ln 455117, Col 19)
gS1
// @from(Ln 455118, Col 4)
cvq = E(() => {
    Qr8();
    dr8();
    uS1 = {
        fromJSON(A) {
            return {
                actor_id: c4(A.actor_id) ? globalThis.String(A.actor_id) : "",
                repository_id: c4(A.repository_id) ? globalThis.String(A.repository_id) : "",
                repository_owner_id: c4(A.repository_owner_id) ? globalThis.String(A.repository_owner_id) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.actor_id !== void 0) q.actor_id = A.actor_id;
            if (A.repository_id !== void 0) q.repository_id = A.repository_id;
            if (A.repository_owner_id !== void 0) q.repository_owner_id = A.repository_owner_id;
            return q
        },
        create(A) {
            return uS1.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = f2z();
            return q.actor_id = A.actor_id ?? "", q.repository_id = A.repository_id ?? "", q.repository_owner_id = A.repository_owner_id ?? "", q
        }
    };
    mS1 = {
        fromJSON(A) {
            return {
                platform: c4(A.platform) ? globalThis.String(A.platform) : "",
                node_version: c4(A.node_version) ? globalThis.String(A.node_version) : "",
                terminal: c4(A.terminal) ? globalThis.String(A.terminal) : "",
                package_managers: c4(A.package_managers) ? globalThis.String(A.package_managers) : "",
                runtimes: c4(A.runtimes) ? globalThis.String(A.runtimes) : "",
                is_running_with_bun: c4(A.is_running_with_bun) ? globalThis.Boolean(A.is_running_with_bun) : !1,
                is_ci: c4(A.is_ci) ? globalThis.Boolean(A.is_ci) : !1,
                is_claubbit: c4(A.is_claubbit) ? globalThis.Boolean(A.is_claubbit) : !1,
                is_github_action: c4(A.is_github_action) ? globalThis.Boolean(A.is_github_action) : !1,
                is_claude_code_action: c4(A.is_claude_code_action) ? globalThis.Boolean(A.is_claude_code_action) : !1,
                is_claude_ai_auth: c4(A.is_claude_ai_auth) ? globalThis.Boolean(A.is_claude_ai_auth) : !1,
                version: c4(A.version) ? globalThis.String(A.version) : "",
                github_event_name: c4(A.github_event_name) ? globalThis.String(A.github_event_name) : "",
                github_actions_runner_environment: c4(A.github_actions_runner_environment) ? globalThis.String(A.github_actions_runner_environment) : "",
                github_actions_runner_os: c4(A.github_actions_runner_os) ? globalThis.String(A.github_actions_runner_os) : "",
                github_action_ref: c4(A.github_action_ref) ? globalThis.String(A.github_action_ref) : "",
                wsl_version: c4(A.wsl_version) ? globalThis.String(A.wsl_version) : "",
                github_actions_metadata: c4(A.github_actions_metadata) ? uS1.fromJSON(A.github_actions_metadata) : void 0,
                arch: c4(A.arch) ? globalThis.String(A.arch) : "",
                is_claude_code_remote: c4(A.is_claude_code_remote) ? globalThis.Boolean(A.is_claude_code_remote) : !1,
                remote_environment_type: c4(A.remote_environment_type) ? globalThis.String(A.remote_environment_type) : "",
                claude_code_container_id: c4(A.claude_code_container_id) ? globalThis.String(A.claude_code_container_id) : "",
                claude_code_remote_session_id: c4(A.claude_code_remote_session_id) ? globalThis.String(A.claude_code_remote_session_id) : "",
                tags: globalThis.Array.isArray(A?.tags) ? A.tags.map((q) => globalThis.String(q)) : [],
                deployment_environment: c4(A.deployment_environment) ? globalThis.String(A.deployment_environment) : "",
                is_conductor: c4(A.is_conductor) ? globalThis.Boolean(A.is_conductor) : !1,
                version_base: c4(A.version_base) ? globalThis.String(A.version_base) : "",
                coworker_type: c4(A.coworker_type) ? globalThis.String(A.coworker_type) : "",
                build_time: c4(A.build_time) ? globalThis.String(A.build_time) : "",
                is_local_agent_mode: c4(A.is_local_agent_mode) ? globalThis.Boolean(A.is_local_agent_mode) : !1,
                linux_distro_id: c4(A.linux_distro_id) ? globalThis.String(A.linux_distro_id) : "",
                linux_distro_version: c4(A.linux_distro_version) ? globalThis.String(A.linux_distro_version) : "",
                linux_kernel: c4(A.linux_kernel) ? globalThis.String(A.linux_kernel) : "",
                vcs: c4(A.vcs) ? globalThis.String(A.vcs) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.platform !== void 0) q.platform = A.platform;
            if (A.node_version !== void 0) q.node_version = A.node_version;
            if (A.terminal !== void 0) q.terminal = A.terminal;
            if (A.package_managers !== void 0) q.package_managers = A.package_managers;
            if (A.runtimes !== void 0) q.runtimes = A.runtimes;
            if (A.is_running_with_bun !== void 0) q.is_running_with_bun = A.is_running_with_bun;
            if (A.is_ci !== void 0) q.is_ci = A.is_ci;
            if (A.is_claubbit !== void 0) q.is_claubbit = A.is_claubbit;
            if (A.is_github_action !== void 0) q.is_github_action = A.is_github_action;
            if (A.is_claude_code_action !== void 0) q.is_claude_code_action = A.is_claude_code_action;
            if (A.is_claude_ai_auth !== void 0) q.is_claude_ai_auth = A.is_claude_ai_auth;
            if (A.version !== void 0) q.version = A.version;
            if (A.github_event_name !== void 0) q.github_event_name = A.github_event_name;
            if (A.github_actions_runner_environment !== void 0) q.github_actions_runner_environment = A.github_actions_runner_environment;
            if (A.github_actions_runner_os !== void 0) q.github_actions_runner_os = A.github_actions_runner_os;
            if (A.github_action_ref !== void 0) q.github_action_ref = A.github_action_ref;
            if (A.wsl_version !== void 0) q.wsl_version = A.wsl_version;
            if (A.github_actions_metadata !== void 0) q.github_actions_metadata = uS1.toJSON(A.github_actions_metadata);
            if (A.arch !== void 0) q.arch = A.arch;
            if (A.is_claude_code_remote !== void 0) q.is_claude_code_remote = A.is_claude_code_remote;
            if (A.remote_environment_type !== void 0) q.remote_environment_type = A.remote_environment_type;
            if (A.claude_code_container_id !== void 0) q.claude_code_container_id = A.claude_code_container_id;
            if (A.claude_code_remote_session_id !== void 0) q.claude_code_remote_session_id = A.claude_code_remote_session_id;
            if (A.tags?.length) q.tags = A.tags;
            if (A.deployment_environment !== void 0) q.deployment_environment = A.deployment_environment;
            if (A.is_conductor !== void 0) q.is_conductor = A.is_conductor;
            if (A.version_base !== void 0) q.version_base = A.version_base;
            if (A.coworker_type !== void 0) q.coworker_type = A.coworker_type;
            if (A.build_time !== void 0) q.build_time = A.build_time;
            if (A.is_local_agent_mode !== void 0) q.is_local_agent_mode = A.is_local_agent_mode;
            if (A.linux_distro_id !== void 0) q.linux_distro_id = A.linux_distro_id;
            if (A.linux_distro_version !== void 0) q.linux_distro_version = A.linux_distro_version;
            if (A.linux_kernel !== void 0) q.linux_kernel = A.linux_kernel;
            if (A.vcs !== void 0) q.vcs = A.vcs;
            return q
        },
        create(A) {
            return mS1.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = T2z();
            return q.platform = A.platform ?? "", q.node_version = A.node_version ?? "", q.terminal = A.terminal ?? "", q.package_managers = A.package_managers ?? "", q.runtimes = A.runtimes ?? "", q.is_running_with_bun = A.is_running_with_bun ?? !1, q.is_ci = A.is_ci ?? !1, q.is_claubbit = A.is_claubbit ?? !1, q.is_github_action = A.is_github_action ?? !1, q.is_claude_code_action = A.is_claude_code_action ?? !1, q.is_claude_ai_auth = A.is_claude_ai_auth ?? !1, q.version = A.version ?? "", q.github_event_name = A.github_event_name ?? "", q.github_actions_runner_environment = A.github_actions_runner_environment ?? "", q.github_actions_runner_os = A.github_actions_runner_os ?? "", q.github_action_ref = A.github_action_ref ?? "", q.wsl_version = A.wsl_version ?? "", q.github_actions_metadata = A.github_actions_metadata !== void 0 && A.github_actions_metadata !== null ? uS1.fromPartial(A.github_actions_metadata) : void 0, q.arch = A.arch ?? "", q.is_claude_code_remote = A.is_claude_code_remote ?? !1, q.remote_environment_type = A.remote_environment_type ?? "", q.claude_code_container_id = A.claude_code_container_id ?? "", q.claude_code_remote_session_id = A.claude_code_remote_session_id ?? "", q.tags = A.tags?.map((K) => K) || [], q.deployment_environment = A.deployment_environment ?? "", q.is_conductor = A.is_conductor ?? !1, q.version_base = A.version_base ?? "", q.coworker_type = A.coworker_type ?? "", q.build_time = A.build_time ?? "", q.is_local_agent_mode = A.is_local_agent_mode ?? !1, q.linux_distro_id = A.linux_distro_id ?? "", q.linux_distro_version = A.linux_distro_version ?? "", q.linux_kernel = A.linux_kernel ?? "", q.vcs = A.vcs ?? "", q
        }
    };
    BS1 = {
        fromJSON(A) {
            return {
                slack_team_id: c4(A.slack_team_id) ? globalThis.String(A.slack_team_id) : "",
                is_enterprise_install: c4(A.is_enterprise_install) ? globalThis.Boolean(A.is_enterprise_install) : !1,
                trigger: c4(A.trigger) ? globalThis.String(A.trigger) : "",
                creation_method: c4(A.creation_method) ? globalThis.String(A.creation_method) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.slack_team_id !== void 0) q.slack_team_id = A.slack_team_id;
            if (A.is_enterprise_install !== void 0) q.is_enterprise_install = A.is_enterprise_install;
            if (A.trigger !== void 0) q.trigger = A.trigger;
            if (A.creation_method !== void 0) q.creation_method = A.creation_method;
            return q
        },
        create(A) {
            return BS1.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = v2z();
            return q.slack_team_id = A.slack_team_id ?? "", q.is_enterprise_install = A.is_enterprise_install ?? !1, q.trigger = A.trigger ?? "", q.creation_method = A.creation_method ?? "", q
        }
    };
    gS1 = {
        fromJSON(A) {
            return {
                event_name: c4(A.event_name) ? globalThis.String(A.event_name) : "",
                client_timestamp: c4(A.client_timestamp) ? dvq(A.client_timestamp) : void 0,
                model: c4(A.model) ? globalThis.String(A.model) : "",
                session_id: c4(A.session_id) ? globalThis.String(A.session_id) : "",
                user_type: c4(A.user_type) ? globalThis.String(A.user_type) : "",
                betas: c4(A.betas) ? globalThis.String(A.betas) : "",
                env: c4(A.env) ? mS1.fromJSON(A.env) : void 0,
                entrypoint: c4(A.entrypoint) ? globalThis.String(A.entrypoint) : "",
                agent_sdk_version: c4(A.agent_sdk_version) ? globalThis.String(A.agent_sdk_version) : "",
                is_interactive: c4(A.is_interactive) ? globalThis.Boolean(A.is_interactive) : !1,
                client_type: c4(A.client_type) ? globalThis.String(A.client_type) : "",
                process: c4(A.process) ? globalThis.String(A.process) : "",
                additional_metadata: c4(A.additional_metadata) ? globalThis.String(A.additional_metadata) : "",
                auth: c4(A.auth) ? yi.fromJSON(A.auth) : void 0,
                server_timestamp: c4(A.server_timestamp) ? dvq(A.server_timestamp) : void 0,
                event_id: c4(A.event_id) ? globalThis.String(A.event_id) : "",
                device_id: c4(A.device_id) ? globalThis.String(A.device_id) : "",
                swe_bench_run_id: c4(A.swe_bench_run_id) ? globalThis.String(A.swe_bench_run_id) : "",
                swe_bench_instance_id: c4(A.swe_bench_instance_id) ? globalThis.String(A.swe_bench_instance_id) : "",
                swe_bench_task_id: c4(A.swe_bench_task_id) ? globalThis.String(A.swe_bench_task_id) : "",
                email: c4(A.email) ? globalThis.String(A.email) : "",
                agent_id: c4(A.agent_id) ? globalThis.String(A.agent_id) : "",
                parent_session_id: c4(A.parent_session_id) ? globalThis.String(A.parent_session_id) : "",
                agent_type: c4(A.agent_type) ? globalThis.String(A.agent_type) : "",
                slack: c4(A.slack) ? BS1.fromJSON(A.slack) : void 0,
                team_name: c4(A.team_name) ? globalThis.String(A.team_name) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.event_name !== void 0) q.event_name = A.event_name;
            if (A.client_timestamp !== void 0) q.client_timestamp = A.client_timestamp.toISOString();
            if (A.model !== void 0) q.model = A.model;
            if (A.session_id !== void 0) q.session_id = A.session_id;
            if (A.user_type !== void 0) q.user_type = A.user_type;
            if (A.betas !== void 0) q.betas = A.betas;
            if (A.env !== void 0) q.env = mS1.toJSON(A.env);
            if (A.entrypoint !== void 0) q.entrypoint = A.entrypoint;
            if (A.agent_sdk_version !== void 0) q.agent_sdk_version = A.agent_sdk_version;
            if (A.is_interactive !== void 0) q.is_interactive = A.is_interactive;
            if (A.client_type !== void 0) q.client_type = A.client_type;
            if (A.process !== void 0) q.process = A.process;
            if (A.additional_metadata !== void 0) q.additional_metadata = A.additional_metadata;
            if (A.auth !== void 0) q.auth = yi.toJSON(A.auth);
            if (A.server_timestamp !== void 0) q.server_timestamp = A.server_timestamp.toISOString();
            if (A.event_id !== void 0) q.event_id = A.event_id;
            if (A.device_id !== void 0) q.device_id = A.device_id;
            if (A.swe_bench_run_id !== void 0) q.swe_bench_run_id = A.swe_bench_run_id;
            if (A.swe_bench_instance_id !== void 0) q.swe_bench_instance_id = A.swe_bench_instance_id;
            if (A.swe_bench_task_id !== void 0) q.swe_bench_task_id = A.swe_bench_task_id;
            if (A.email !== void 0) q.email = A.email;
            if (A.agent_id !== void 0) q.agent_id = A.agent_id;
            if (A.parent_session_id !== void 0) q.parent_session_id = A.parent_session_id;
            if (A.agent_type !== void 0) q.agent_type = A.agent_type;
            if (A.slack !== void 0) q.slack = BS1.toJSON(A.slack);
            if (A.team_name !== void 0) q.team_name = A.team_name;
            return q
        },
        create(A) {
            return gS1.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = N2z();
            return q.event_name = A.event_name ?? "", q.client_timestamp = A.client_timestamp ?? void 0, q.model = A.model ?? "", q.session_id = A.session_id ?? "", q.user_type = A.user_type ?? "", q.betas = A.betas ?? "", q.env = A.env !== void 0 && A.env !== null ? mS1.fromPartial(A.env) : void 0, q.entrypoint = A.entrypoint ?? "", q.agent_sdk_version = A.agent_sdk_version ?? "", q.is_interactive = A.is_interactive ?? !1, q.client_type = A.client_type ?? "", q.process = A.process ?? "", q.additional_metadata = A.additional_metadata ?? "", q.auth = A.auth !== void 0 && A.auth !== null ? yi.fromPartial(A.auth) : void 0, q.server_timestamp = A.server_timestamp ?? void 0, q.event_id = A.event_id ?? "", q.device_id = A.device_id ?? "", q.swe_bench_run_id = A.swe_bench_run_id ?? "", q.swe_bench_instance_id = A.swe_bench_instance_id ?? "", q.swe_bench_task_id = A.swe_bench_task_id ?? "", q.email = A.email ?? "", q.agent_id = A.agent_id ?? "", q.parent_session_id = A.parent_session_id ?? "", q.agent_type = A.agent_type ?? "", q.slack = A.slack !== void 0 && A.slack !== null ? BS1.fromPartial(A.slack) : void 0, q.team_name = A.team_name ?? "", q
        }
    }
})
// @from(Ln 455325, Col 0)
function k2z() {
    return {
        event_id: "",
        timestamp: void 0,
        experiment_id: "",
        variation_id: 0,
        environment: "",
        user_attributes: "",
        experiment_metadata: "",
        device_id: "",
        auth: void 0,
        session_id: "",
        anonymous_id: "",
        event_metadata_vars: ""
    }
}
// @from(Ln 455342, Col 0)
function E2z(A) {
    let q = (A.seconds || 0) * 1000;
    return q += (A.nanos || 0) / 1e6, new globalThis.Date(q)
}
// @from(Ln 455347, Col 0)
function y2z(A) {
    if (A instanceof globalThis.Date) return A;
    else if (typeof A === "string") return new globalThis.Date(A);
    else return E2z(Ho6.fromJSON(A))
}
// @from(Ln 455353, Col 0)
function mh(A) {
    return A !== null && A !== void 0
}
// @from(Ln 455356, Col 4)
cr8
// @from(Ln 455357, Col 4)
lvq = E(() => {
    Qr8();
    dr8();
    cr8 = {
        fromJSON(A) {
            return {
                event_id: mh(A.event_id) ? globalThis.String(A.event_id) : "",
                timestamp: mh(A.timestamp) ? y2z(A.timestamp) : void 0,
                experiment_id: mh(A.experiment_id) ? globalThis.String(A.experiment_id) : "",
                variation_id: mh(A.variation_id) ? globalThis.Number(A.variation_id) : 0,
                environment: mh(A.environment) ? globalThis.String(A.environment) : "",
                user_attributes: mh(A.user_attributes) ? globalThis.String(A.user_attributes) : "",
                experiment_metadata: mh(A.experiment_metadata) ? globalThis.String(A.experiment_metadata) : "",
                device_id: mh(A.device_id) ? globalThis.String(A.device_id) : "",
                auth: mh(A.auth) ? yi.fromJSON(A.auth) : void 0,
                session_id: mh(A.session_id) ? globalThis.String(A.session_id) : "",
                anonymous_id: mh(A.anonymous_id) ? globalThis.String(A.anonymous_id) : "",
                event_metadata_vars: mh(A.event_metadata_vars) ? globalThis.String(A.event_metadata_vars) : ""
            }
        },
        toJSON(A) {
            let q = {};
            if (A.event_id !== void 0) q.event_id = A.event_id;
            if (A.timestamp !== void 0) q.timestamp = A.timestamp.toISOString();
            if (A.experiment_id !== void 0) q.experiment_id = A.experiment_id;
            if (A.variation_id !== void 0) q.variation_id = Math.round(A.variation_id);
            if (A.environment !== void 0) q.environment = A.environment;
            if (A.user_attributes !== void 0) q.user_attributes = A.user_attributes;
            if (A.experiment_metadata !== void 0) q.experiment_metadata = A.experiment_metadata;
            if (A.device_id !== void 0) q.device_id = A.device_id;
            if (A.auth !== void 0) q.auth = yi.toJSON(A.auth);
            if (A.session_id !== void 0) q.session_id = A.session_id;
            if (A.anonymous_id !== void 0) q.anonymous_id = A.anonymous_id;
            if (A.event_metadata_vars !== void 0) q.event_metadata_vars = A.event_metadata_vars;
            return q
        },
        create(A) {
            return cr8.fromPartial(A ?? {})
        },
        fromPartial(A) {
            let q = k2z();
            return q.event_id = A.event_id ?? "", q.timestamp = A.timestamp ?? void 0, q.experiment_id = A.experiment_id ?? "", q.variation_id = A.variation_id ?? 0, q.environment = A.environment ?? "", q.user_attributes = A.user_attributes ?? "", q.experiment_metadata = A.experiment_metadata ?? "", q.device_id = A.device_id ?? "", q.auth = A.auth !== void 0 && A.auth !== null ? yi.fromPartial(A.auth) : void 0, q.session_id = A.session_id ?? "", q.anonymous_id = A.anonymous_id ?? "", q.event_metadata_vars = A.event_metadata_vars ?? "", q
        }
    }
})
// @from(Ln 455414, Col 0)
function jo6() {
    return FS1.join(c8(), "telemetry")
}
// @from(Ln 455417, Col 0)
class lr8 {
    endpoint;
    timeout;
    maxBatchSize;
    skipAuth;
    batchDelayMs;
    baseBackoffDelayMs;
    maxBackoffDelayMs;
    maxAttempts;
    isKilled;
    pendingExports = [];
    isShutdown = !1;
    backoffRetryTimer = null;
    attempts = 0;
    isRetrying = !1;
    lastExportErrorContext;
    constructor(A = {}) {
        let q = A.baseUrl || (process.env.ANTHROPIC_BASE_URL === "https://api-staging.anthropic.com" ? "https://api-staging.anthropic.com" : "https://api.anthropic.com");
        this.endpoint = `${q}${A.path||"/api/event_logging/batch"}`, this.timeout = A.timeout || 1e4, this.maxBatchSize = A.maxBatchSize || 200, this.skipAuth = A.skipAuth ?? !1, this.batchDelayMs = A.batchDelayMs || 100, this.baseBackoffDelayMs = A.baseBackoffDelayMs || 500, this.maxBackoffDelayMs = A.maxBackoffDelayMs || 30000, this.maxAttempts = A.maxAttempts ?? 8, this.isKilled = A.isKilled ?? (() => !1), this.retryPreviousBatches()
    }
    async getQueuedEventCount() {
        return (await this.loadEventsFromCurrentBatch()).length
    }
    getCurrentBatchFilePath() {
        return FS1.join(jo6(), `${ovq}${R1()}.${rvq}.json`)
    }
    async loadEventsFromFile(A) {
        try {
            return await x$6(A)
        } catch {
            return []
        }
    }
    async loadEventsFromCurrentBatch() {
        return this.loadEventsFromFile(this.getCurrentBatchFilePath())
    }
    async saveEventsToFile(A, q) {
        try {
            if (q.length === 0) try {
                await ivq(A)
            } catch {} else {
                await nvq(jo6(), {
                    recursive: !0
                });
                let K = q.map((Y) => B6(Y)).join(`
`) + `
`;
                await R2z(A, K, "utf8")
            }
        } catch (K) {
            _6(K)
        }
    }
    async appendEventsToFile(A, q) {
        if (q.length === 0) return;
        try {
            await nvq(jo6(), {
                recursive: !0
            });
            let K = q.map((Y) => B6(Y)).join(`
`) + `
`;
            await h2z(A, K, "utf8")
        } catch (K) {
            _6(K)
        }
    }
    async deleteFile(A) {
        try {
            await ivq(A)
        } catch {}
    }
    async retryPreviousBatches() {
        try {
            let A = `${ovq}${R1()}.`,
                q;
            try {
                q = (await S2z(jo6())).filter((K) => K.startsWith(A) && K.endsWith(".json")).filter((K) => !K.includes(rvq))
            } catch (K) {
                let Y = K.code;
                if (Y === "ENOENT" || Y === "EACCES" || Y === "EPERM") return;
                throw K
            }
            for (let K of q) {
                let Y = FS1.join(jo6(), K);
                this.retryFileInBackground(Y)
            }
        } catch (A) {
            _6(A)
        }
    }
    async retryFileInBackground(A) {
        if (this.attempts >= this.maxAttempts) {
            await this.deleteFile(A);
            return
        }
        let q = await this.loadEventsFromFile(A);
        if (q.length === 0) {
            await this.deleteFile(A);
            return
        }
        let K = await this.sendEventsInBatches(q);
        if (K.length === 0) await this.deleteFile(A);
        else await this.saveEventsToFile(A, K)
    }
    async export (A, q) {
        if (this.isShutdown) {
            q({
                code: e16.ExportResultCode.FAILED,
                error: Error("Exporter has been shutdown")
            });
            return
        }
        let K = this.doExport(A, q);
        this.pendingExports.push(K), K.finally(() => {
            let Y = this.pendingExports.indexOf(K);
            if (Y > -1) this.pendingExports.splice(Y, 1)
        })
    }
    async doExport(A, q) {
        try {
            let K = A.filter((_) => _.instrumentationScope?.name === "com.anthropic.claude_code.events");
            if (K.length === 0) {
                q({
                    code: e16.ExportResultCode.SUCCESS
                });
                return
            }
            let Y = this.transformLogsToEvents(K).events;
            if (Y.length === 0) {
                q({
                    code: e16.ExportResultCode.SUCCESS
                });
                return
            }
            if (this.attempts >= this.maxAttempts) {
                q({
                    code: e16.ExportResultCode.FAILED,
                    error: Error(`Dropped ${Y.length} events: max attempts (${this.maxAttempts}) reached`)
                });
                return
            }
            let z = await this.sendEventsInBatches(Y);
            if (this.attempts++, z.length > 0) {
                await this.queueFailedEvents(z), this.scheduleBackoffRetry();
                let _ = this.lastExportErrorContext ? ` (${this.lastExportErrorContext})` : "";
                q({
                    code: e16.ExportResultCode.FAILED,
                    error: Error(`Failed to export ${z.length} events${_}`)
                });
                return
            }
            if (this.resetBackoff(), await this.getQueuedEventCount() > 0 && !this.isRetrying) this.retryFailedEvents();
            q({
                code: e16.ExportResultCode.SUCCESS
            })
        } catch (K) {
            _6(K), q({
                code: e16.ExportResultCode.FAILED,
                error: K instanceof Error ? K : Error("Unknown export error")
            })
        }
    }
    async sendEventsInBatches(A) {
        let q = [];
        for (let z = 0; z < A.length; z += this.maxBatchSize) q.push(A.slice(z, z + this.maxBatchSize));
        let K = [],
            Y;
        for (let z = 0; z < q.length; z++) {
            let _ = q[z];
            try {
                await this.sendBatchWithRetry({
                    events: _
                })
            } catch (w) {
                Y = C2z(w);
                for (let O = z; O < q.length; O++) K.push(...q[O]);
                break
            }
            if (z < q.length - 1 && this.batchDelayMs > 0) await new Promise((w) => setTimeout(w, this.batchDelayMs))
        }
        if (K.length > 0 && Y) this.lastExportErrorContext = Y;
        return K
    }
    async queueFailedEvents(A) {
        let q = this.getCurrentBatchFilePath();
        await this.appendEventsToFile(q, A);
        let K = this.lastExportErrorContext ? ` (${this.lastExportErrorContext})` : "",
            Y = `1P event logging: ${A.length} events failed to export${K}`;
        _6(Error(Y))
    }
    scheduleBackoffRetry() {
        if (this.backoffRetryTimer || this.isRetrying || this.isShutdown) return;
        let A = Math.min(this.baseBackoffDelayMs * this.attempts * this.attempts, this.maxBackoffDelayMs);
        this.backoffRetryTimer = setTimeout(() => {
            this.backoffRetryTimer = null, this.retryFailedEvents()
        }, A)
    }
    async retryFailedEvents() {
        let A = this.getCurrentBatchFilePath();
        while (!this.isShutdown) {
            let q = await this.loadEventsFromFile(A);
            if (q.length === 0) break;
            if (this.attempts >= this.maxAttempts) {
                await this.deleteFile(A), this.resetBackoff();
                return
            }
            this.isRetrying = !0, await this.deleteFile(A);
            let K = await this.sendEventsInBatches(q);
            if (this.attempts++, this.isRetrying = !1, K.length > 0) {
                await this.saveEventsToFile(A, K), this.scheduleBackoffRetry();
                return
            }
            this.resetBackoff()
        }
    }
    resetBackoff() {
        if (this.attempts = 0, this.backoffRetryTimer) clearTimeout(this.backoffRetryTimer), this.backoffRetryTimer = null
    }
    async sendBatchWithRetry(A) {
        if (this.isKilled()) throw Error("firstParty sink killswitch active");
        let q = {
                "Content-Type": "application/json",
                "User-Agent": pO(),
                "x-service-name": "claude-code"
            },
            K = l_() || q7(),
            Y = this.skipAuth || !K;
        if (!Y && iA()) {
            let O = sA();
            if (!XG()) Y = !0;
            else if (O && Yg(O.expiresAt)) Y = !0
        }
        let z = Y ? {
                headers: {},
                error: "trust not established or Oauth token expired"
            } : QO(),
            _ = !z.error,
            w = _ ? {
                ...q,
                ...z.headers
            } : q;
        try {
            let O = await X8.post(this.endpoint, A, {
                timeout: this.timeout,
                headers: w
            });
            this.logSuccess(A.events.length, _, O.data);
            return
        } catch (O) {
            if (_ && X8.isAxiosError(O) && O.response?.status === 401) {
                let $ = await X8.post(this.endpoint, A, {
                    timeout: this.timeout,
                    headers: q
                });
                this.logSuccess(A.events.length, !1, $.data);
                return
            }
            throw O
        }
    }
    logSuccess(A, q, K) {}
    hrTimeToDate(A) {
        let [q, K] = A;
        return new Date(q * 1000 + K / 1e6)
    }
    transformLogsToEvents(A) {
        let q = [];
        for (let K of A) {
            let Y = K.attributes || {};
            if (Y.event_type === "GrowthbookExperimentEvent") {
                let j = this.hrTimeToDate(K.hrTime);
                q.push({
                    event_type: "GrowthbookExperimentEvent",
                    event_data: cr8.toJSON({
                        event_id: Y.event_id,
                        timestamp: j,
                        experiment_id: Y.experiment_id,
                        variation_id: Y.variation_id,
                        environment: Y.environment,
                        user_attributes: Y.user_attributes,
                        experiment_metadata: Y.experiment_metadata,
                        device_id: Y.device_id,
                        session_id: Y.session_id
                    })
                });
                continue
            }
            let z = Y.event_name || K.body || "unknown",
                _ = Y.core_metadata,
                w = Y.user_metadata,
                O = Y.event_metadata || {};
            if (!_) {
                q.push({
                    event_type: "ClaudeCodeInternalEvent",
                    event_data: gS1.toJSON({
                        event_id: Y.event_id,
                        event_name: z,
                        client_timestamp: this.hrTimeToDate(K.hrTime),
                        session_id: R1(),
                        additional_metadata: B6({
                            transform_error: "core_metadata attribute is missing"
                        })
                    })
                });
                continue
            }
            let $ = Qvq(_, w, O),
                H = {
                    ...$.additional
                };
            q.push({
                event_type: "ClaudeCodeInternalEvent",
                event_data: gS1.toJSON({
                    event_id: Y.event_id,
                    event_name: z,
                    client_timestamp: this.hrTimeToDate(K.hrTime),
                    device_id: Y.user_id,
                    email: w?.email,
                    auth: $.auth,
                    ...$.core,
                    env: $.env,
                    process: $.process,
                    additional_metadata: Object.keys(H).length > 0 ? B6(H) : void 0
                })
            })
        }
        return {
            events: q
        }
    }
    async shutdown() {
        this.isShutdown = !0, this.resetBackoff(), await this.forceFlush()
    }
    async forceFlush() {
        await Promise.all(this.pendingExports)
    }
}
// @from(Ln 455756, Col 0)
function C2z(A) {
    if (!X8.isAxiosError(A)) return _1(A);
    let q = [],
        K = A.response?.headers?.["request-id"];
    if (K) q.push(`request-id=${K}`);
    if (A.response?.status) q.push(`status=${A.response.status}`);
    if (A.code) q.push(`code=${A.code}`);
    if (A.message) q.push(A.message);
    return q.join(", ")
}
// @from(Ln 455766, Col 4)
e16
// @from(Ln 455766, Col 9)
rvq
// @from(Ln 455766, Col 14)
ovq = "1p_failed_events."
// @from(Ln 455767, Col 4)
avq = E(() => {
    kK();
    H1();
    k1();
    RM();
    fA();
    W0();
    o$();
    T1();
    k8();
    cvq();
    lvq();
    A8();
    g1();
    K_();
    s8();
    e16 = t(K9(), 1), rvq = L2z()
})
// @from(Ln 455786, Col 0)
function F_6(A) {
    return mf(I2z, {})?.[A] === !0
}
// @from(Ln 455789, Col 4)
I2z = "tengu_frond_boric"
// @from(Ln 455790, Col 4)
ir8 = E(() => {
    HA()
})
// @from(Ln 455793, Col 4)
KNq = {}
// @from(Ln 455808, Col 0)
function evq() {
    return mf(b2z, {})
}
// @from(Ln 455812, Col 0)
function US1(A) {
    let K = evq()[A];
    if (!K) return null;
    let Y = K.sample_rate;
    if (typeof Y !== "number" || Y < 0 || Y > 1) return null;
    if (Y >= 1) return null;
    if (Y <= 0) return 0;
    return Math.random() < Y ? Y : 0
}
// @from(Ln 455821, Col 0)
async function TU6() {
    if (!A86) return;
    try {
        await A86.shutdown()
    } catch {}
}
// @from(Ln 455828, Col 0)
function p_6() {
    return !My()
}
// @from(Ln 455831, Col 0)
async function x2z(A, q, K = {}) {
    try {
        let Y = await eZ6({
                model: K.model,
                betas: K.betas
            }),
            z = {
                event_name: q,
                event_id: svq(),
                core_metadata: Y,
                user_metadata: Pr(!0),
                event_metadata: K
            },
            _ = Jy();
        if (_) z.user_id = _;
        A.emit({
            body: q,
            attributes: z
        })
    } catch (Y) {}
}
// @from(Ln 455853, Col 0)
function Hv6(A, q = {}) {
    if (!p_6()) return;
    if (!q86 || F_6("firstParty")) return;
    x2z(q86, A, q)
}
// @from(Ln 455859, Col 0)
function u2z() {
    return "production"
}
// @from(Ln 455863, Col 0)
function nr8(A) {
    if (!p_6()) return;
    if (!q86 || F_6("firstParty")) return;
    let q = Jy(),
        K = {
            event_type: "GrowthbookExperimentEvent",
            event_id: svq(),
            experiment_id: A.experimentId,
            variation_id: A.variationId,
            ...q && {
                device_id: q
            },
            ...A.userAttributes && {
                session_id: A.userAttributes.sessionId,
                user_attributes: B6(A.userAttributes)
            },
            ...A.experimentMetadata && {
                experiment_metadata: B6(A.experimentMetadata)
            },
            environment: u2z()
        };
    q86.emit({
        body: "growthbook_experiment",
        attributes: K
    })
}
// @from(Ln 455890, Col 0)
function qNq() {
    if (Zq("1p_event_logging_start"), !p_6()) return;
    let q = mf("tengu_1p_event_batch_config", {});
    ANq = q, Zq("1p_event_after_growthbook_config");
    let K = q.scheduledDelayMillis || parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || m2z.toString()),
        Y = q.maxExportBatchSize || B2z,
        z = q.maxQueueSize || g2z,
        _ = y8(),
        w = {
            [QS1.ATTR_SERVICE_NAME]: "claude-code",
            [QS1.ATTR_SERVICE_VERSION]: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION
        };
    if (_ === "wsl") {
        let H = sA6();
        if (H) w["wsl.version"] = H
    }
    let O = tvq.resourceFromAttributes(w),
        $ = new lr8({
            maxBatchSize: Y,
            skipAuth: q.skipAuth,
            maxAttempts: q.maxAttempts,
            path: q.path,
            baseUrl: q.baseUrl,
            isKilled: () => F_6("firstParty")
        });
    A86 = new pS1.LoggerProvider({
        resource: O,
        processors: [new pS1.BatchLogRecordProcessor($, {
            scheduledDelayMillis: K,
            maxExportBatchSize: Y,
            maxQueueSize: z
        })]
    }), q86 = A86.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION)
}