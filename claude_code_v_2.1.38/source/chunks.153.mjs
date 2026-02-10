
// @from(Ln 391781, Col 0)
async function mnY(A, q) {
    try {
        let K = Hc(),
            Y = nf6(K),
            z = BJ(A, Y);
        try {
            await HG(z)
        } catch {
            throw c("tengu_native_install_binary_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Staged binary not found")
        }
        await S8q(z, q), await zV6(A, {
            recursive: !0,
            force: !0
        }), c("tengu_native_install_binary_success", {})
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        if (!Y.includes("Staged binary not found")) c("tengu_native_install_binary_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw K1(K instanceof Error ? K : Error(Y)), K
    }
}
// @from(Ln 391807, Col 0)
async function FnY(A, q, K) {
    if (K === "npm") await BnY(A, q);
    else await mnY(A, q)
}
// @from(Ln 391811, Col 0)
async function QnY(A, q) {
    let {
        stagingPath: K,
        installPath: Y
    } = await C8q(A), {
        executable: z
    } = $e(), w = `${K}.${process.pid}.${Date.now()}`, H = !await h8q(A) || q;
    if (H) {
        h(q ? `Force reinstalling native installer version ${A}` : `Downloading native installer version ${A}`);
        let $ = await N8q(A, w);
        await FnY(w, Y, $)
    } else h(`Version ${A} already installed, updating symlink`);
    if (await UnY(z), await pnY(z, Y), !await He(z)) {
        let $ = !1;
        try {
            await HG(Y), $ = !0
        } catch {}
        throw Error(`Failed to create executable at ${z}. Source file exists: ${$}. Check write permissions to ${z}.`)
    }
    return H
}
// @from(Ln 391832, Col 0)
async function h8q(A) {
    let {
        installPath: q
    } = await C8q(A);
    return He(q)
}
// @from(Ln 391838, Col 0)
async function gnY(A, q = !1) {
    let K = Date.now(),
        Y = await CIA(A),
        {
            executable: z
        } = $e();
    if (h(`Checking for native installer update to version ${Y}`), !q && Y === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION && await h8q(Y) && await He(z)) return h(`Found ${Y} at ${z}, skipping install`), c("tengu_native_update_complete", {
        latency_ms: Date.now() - K,
        was_new_install: !1,
        was_force_reinstall: !1,
        was_already_running: !0
    }), {
        success: !0
    };
    if (!q && AZ1(Y)) return c("tengu_native_update_skipped_minimum_version", {
        latency_ms: Date.now() - K,
        target_version: Y
    }), {
        success: !0
    };
    let w = !1,
        H;
    return w = await QnY(Y, q), H = Date.now() - K, c("tengu_native_update_complete", {
        latency_ms: H,
        was_new_install: w,
        was_force_reinstall: q
    }), h(`Successfully updated to version ${Y}`), {
        success: !0
    }
}
// @from(Ln 391875, Col 0)
async function UnY(A) {
    try {
        if ((await HG(A)).isDirectory()) {
            if ((await YZ1(A)).length === 0) await xnY(A), h(`Removed empty directory at ${A}`)
        }
    } catch (q) {
        h(`Could not remove empty directory at ${A}: ${q}`)
    }
}
// @from(Ln 391884, Col 0)
async function pnY(A, q) {
    if (Hc().startsWith("win32")) try {
        let H = $c(A);
        await Z91(H, {
            recursive: !0
        });
        let $ = !1;
        try {
            await HG(A), $ = !0
        } catch {}
        if ($) {
            try {
                let _ = await HG(A),
                    J = await HG(q);
                if (_.size === J.size) return !1
            } catch {}
            let O = `${A}.old.${Date.now()}`;
            await qV6(A, O);
            try {
                await QIA(q, A);
                try {
                    await Oc(O)
                } catch {}
            } catch (_) {
                try {
                    await qV6(O, A)
                } catch (J) {
                    let X = Error(`Failed to restore old executable: ${J}`, {
                        cause: _
                    });
                    throw K1(X), X
                }
                throw _
            }
        } else {
            try {
                await HG(q)
            } catch {
                throw Error(`Source file does not exist: ${q}`)
            }
            await QIA(q, A)
        }
        return !0
    } catch (H) {
        return K1(Error(`Failed to copy executable from ${q} to ${A}: ${H}`)), !1
    }
    let z = $c(A);
    try {
        await Z91(z, {
            recursive: !0
        }), h(`Created directory ${z} for symlink`)
    } catch (H) {
        return K1(Error(`Failed to create directory ${z}: ${H}`)), !1
    }
    try {
        let H = !1;
        try {
            await HG(A), H = !0
        } catch {}
        if (H) {
            try {
                let $ = await gIA(A),
                    O = sm($c(A), $),
                    _ = sm(q);
                if (O === _) return !1
            } catch {}
            await Oc(A)
        }
    } catch (H) {
        K1(Error(`Failed to check/remove existing symlink: ${H}`))
    }
    let w = `${A}.tmp.${process.pid}.${Date.now()}`;
    try {
        return await SnY(q, w), await qV6(w, A), h(`Atomically updated symlink ${A} -> ${q}`), !0
    } catch (H) {
        try {
            await Oc(w)
        } catch {}
        return K1(Error(`Failed to create symlink from ${A} to ${q}: ${H}`)), !1
    }
}
// @from(Ln 391965, Col 0)
async function tm(A = !1) {
    if (J6(process.env.DISABLE_INSTALLATION_CHECKS)) return [];
    let q = await om();
    if (q === "development") return [];
    let K = f6();
    if (!(A || q === "native" || K.installMethod === "native")) return [];
    let z = $e(),
        w = [],
        H = $c(z.executable),
        $ = sm(H),
        _ = Hc().startsWith("win32");
    if (!ME(H)) w.push({
        message: `installMethod is native, but directory ${H} does not exist`,
        userActionRequired: !0,
        type: "error"
    });
    if (!ME(z.executable)) w.push({
        message: `installMethod is native, but claude command not found at ${z.executable}`,
        userActionRequired: !0,
        type: "error"
    });
    else if (!_) try {
        let X = await gIA(z.executable),
            D = sm($c(z.executable), X);
        if (!ME(D)) w.push({
            message: `Claude symlink points to non-existent file: ${X}`,
            userActionRequired: !0,
            type: "error"
        });
        else if (!await He(D)) w.push({
            message: `Claude symlink points to invalid binary: ${X}`,
            userActionRequired: !0,
            type: "error"
        })
    } catch {
        if (!await He(z.executable)) w.push({
            message: `${z.executable} exists but is not a valid Claude binary`,
            userActionRequired: !0,
            type: "error"
        })
    } else if (!await He(z.executable)) w.push({
        message: `${z.executable} exists but is not a valid Claude binary`,
        userActionRequired: !0,
        type: "error"
    });
    if (!(process.env.PATH || "").split(knY).some((X) => {
            try {
                let D = sm(X);
                if (_) return D.toLowerCase() === $.toLowerCase();
                return D === $
            } catch {
                return !1
            }
        }))
        if (_) {
            let X = H.replace(/\//g, "\\");
            w.push({
                message: `Native installation exists but ${X} is not in your PATH. Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.`,
                userActionRequired: !0,
                type: "path"
            })
        } else {
            let X = eG1(),
                j = ze()[X],
                M = j ? j.replace(y8q(), "~") : "your shell config file";
            w.push({
                message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${M} && source ${M}`,
                userActionRequired: !0,
                type: "path"
            })
        } return w
}
// @from(Ln 392039, Col 0)
async function _c(A, q = !1) {
    let K = await CIA(A),
        Y = await gnY(A, q);
    if (!Y.success) return {
        latestVersion: null,
        wasUpdated: !1,
        lockFailed: Y.lockFailed,
        lockHolderPid: Y.lockHolderPid
    };
    if (K || Y.success) {
        if (f6().installMethod !== "native") jA((w) => ({
            ...w,
            installMethod: "native",
            autoUpdates: !1,
            autoUpdatesProtectedForNative: !0
        })), h('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection')
    }
    return Op1(), {
        latestVersion: K,
        wasUpdated: Y.success,
        lockFailed: !1
    }
}
// @from(Ln 392062, Col 0)
async function dnY(A) {
    try {
        if (ME(A)) {
            let q = await gIA(A),
                K = sm($c(A), q);
            if (ME(K) && await He(K)) return K
        }
    } catch {}
    return null
}
// @from(Ln 392073, Col 0)
function pIA(A, q) {
    let K = LnY(q);
    return BJ(A.locks, `${K}.lock`)
}
// @from(Ln 392077, Col 0)
async function dIA() {
    let A = $e();
    if (!process.execPath.includes(A.versions)) return;
    try {
        let q = sm(process.execPath),
            K = pIA(A, q);
        if (await Z91(A.locks, {
                recursive: !0
            }), !ME(q)) {
            h(`Cannot lock current version - file does not exist: ${q}`, {
                level: "info"
            });
            return
        }
        if (G91()) {
            if (!await k8q(q, K)) {
                c("tengu_version_lock_failed", {
                    is_pid_based: !0,
                    is_lifetime_lock: !0
                }), KV6(q, Error("Lock already held by another process"));
                return
            }
            c("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !0
            }), h(`Acquired PID lock on running version: ${q}`)
        } else {
            let Y;
            try {
                Y = await YV6.default.lock(q, {
                    stale: UIA,
                    retries: 0,
                    lockfilePath: K,
                    onCompromised: (z) => {
                        h(`NON-FATAL: Lock on running version was compromised: ${z.message}`, {
                            level: "info"
                        })
                    }
                }), c("tengu_version_lock_acquired", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), h(`Acquired mtime-based lock on running version: ${q}`), Tq(async () => {
                    try {
                        await Y?.()
                    } catch {}
                })
            } catch (z) {
                c("tengu_version_lock_failed", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), KV6(q, z);
                return
            }
        }
    } catch (q) {
        h(`NON-FATAL: Failed to lock current version during execution ${q instanceof Error?q.message:String(q)}`, {
            level: "info"
        })
    }
}
// @from(Ln 392138, Col 0)
function KV6(A, q) {
    let K = `NON-FATAL: Lock acquisition failed for ${A} (expected in multi-process scenarios)`,
        Y = q instanceof Error ? Error(K, {
            cause: q
        }) : Error(`${K}: ${q}`);
    K1(Y)
}
// @from(Ln 392145, Col 0)
async function Op1() {
    await Promise.resolve();
    let A = $e();
    if (Hc().startsWith("win32")) try {
        let K = $c(A.executable);
        if (ME(K)) {
            let z = (await YZ1(K)).filter((H) => H.startsWith("claude.exe.old.") && H.match(/claude\.exe\.old\.\d+$/)),
                w = 0;
            for (let H of z) try {
                let $ = BJ(K, H);
                await Oc($), w++
            } catch {}
            if (w > 0) h(`Cleaned up ${w} old Windows executables on startup`)
        }
    } catch (K) {
        h(`Failed to clean up old Windows executables: ${K}`)
    }
    if (ME(A.staging)) try {
        let K = await YZ1(A.staging),
            Y = Date.now() - 3600000,
            z = 0;
        for (let w of K) {
            let H = BJ(A.staging, w);
            try {
                if ((await HG(H)).mtime.getTime() < Y) await zV6(H, {
                    recursive: !0,
                    force: !0
                }), z++, h(`Cleaned up old staging directory: ${w}`)
            } catch {}
        }
        if (z > 0) h(`Cleaned up ${z} orphaned staging directories`), c("tengu_native_staging_cleanup", {
            cleaned_count: z
        })
    } catch (K) {
        h(`Failed to clean up staging directories: ${K}`)
    }
    if (ME(A.versions)) try {
        let K = await YZ1(A.versions),
            Y = Date.now() - 3600000,
            z = 0;
        for (let w of K)
            if (w.match(/\.tmp\.\d+\.\d+$/)) {
                let H = BJ(A.versions, w);
                try {
                    if ((await HG(H)).mtime.getTime() < Y) await Oc(H), z++, h(`Cleaned up orphaned temp install file: ${w}`)
                } catch {}
            } if (z > 0) h(`Cleaned up ${z} orphaned temp install files`), c("tengu_native_temp_files_cleanup", {
            cleaned_count: z
        })
    } catch (K) {
        h(`Failed to clean up temp install files: ${K}`)
    }
    if (G91() && ME(A.locks)) {
        let K = AV6(A.locks);
        if (K > 0) h(`Cleaned up ${K} stale version locks`), c("tengu_native_stale_locks_cleanup", {
            cleaned_count: K
        })
    }
    if (!ME(A.versions)) return;
    try {
        let K = await YZ1(A.versions),
            Y = [];
        for (let j of K) {
            let M = BJ(A.versions, j);
            try {
                let P = await HG(M);
                if (P.isFile() && (P.size === 0 || await He(M))) Y.push(j)
            } catch {}
        }
        let z = process.execPath,
            w = z && z.includes(A.versions) ? sm(z) : null,
            H = new Set([...w ? [w] : []]),
            $ = await dnY(A.executable);
        if ($) H.add($);
        for (let j of Y) {
            let M = sm(A.versions, j);
            if (H.has(M)) continue;
            let P = pIA(A, M),
                W = !1;
            if (G91()) W = ef6(P);
            else try {
                W = await YV6.default.check(M, {
                    stale: UIA,
                    lockfilePath: P
                })
            } catch {
                W = !1
            }
            if (W) H.add(M), h(`Protecting locked version from cleanup: ${j}`)
        }
        let O = [];
        for (let j of Y) {
            let M = sm(A.versions, j);
            if (H.has(M)) continue;
            try {
                let P = await HG(M);
                O.push({
                    name: j,
                    path: M,
                    mtime: P.mtime
                })
            } catch {}
        }
        O.sort((j, M) => M.mtime.getTime() - j.mtime.getTime());
        let _ = O.slice(FIA);
        if (_.length === 0) {
            c("tengu_native_version_cleanup", {
                total_count: Y.length,
                deleted_count: 0,
                protected_count: H.size,
                retained_count: FIA,
                lock_failed_count: 0,
                error_count: 0
            });
            return
        }
        let J = 0,
            X = 0,
            D = 0;
        await Promise.all(_.map(async (j) => {
            try {
                if (await unY(j.path, async () => {
                        await Oc(j.path)
                    })) J++;
                else X++, h(`Skipping deletion of ${j.name} - locked by another process`)
            } catch (M) {
                D++, K1(Error(`Failed to delete version ${j.name}: ${M}`))
            }
        })), c("tengu_native_version_cleanup", {
            total_count: Y.length,
            deleted_count: J,
            protected_count: H.size,
            retained_count: FIA,
            lock_failed_count: X,
            error_count: D
        })
    } catch (K) {
        K1(Error(`Version cleanup failed: ${K}`))
    }
}
// @from(Ln 392285, Col 0)
async function cnY(A) {
    let q = A;
    if ((await hnY(A)).isSymbolicLink()) q = await InY(A);
    return q.endsWith(".js") || q.includes("node_modules")
}
// @from(Ln 392290, Col 0)
async function _p1() {
    let A = $e();
    try {
        if (!ME(A.executable)) return;
        if (await cnY(A.executable)) {
            h(`Skipping removal of ${A.executable} - appears to be npm-managed`);
            return
        }
        await Oc(A.executable), h(`Removed claude symlink at ${A.executable}`)
    } catch (q) {
        K1(Error(`Failed to remove claude symlink: ${q}`))
    }
}
// @from(Ln 392304, Col 0)
function Jp1() {
    let A = [],
        q = ze();
    for (let [K, Y] of Object.entries(q)) try {
        let z = qp1(Y);
        if (!z) continue;
        let {
            filtered: w,
            hadAlias: H
        } = Uf6(z);
        if (H) pf6(Y, w), A.push({
            message: `Removed claude alias from ${Y}. Run: unalias claude`,
            userActionRequired: !0,
            type: "alias"
        }), h(`Cleaned up claude alias from ${K} config`)
    } catch (z) {
        K1(z instanceof Error ? z : Error(String(z))), A.push({
            message: `Failed to clean up ${Y}: ${z}`,
            userActionRequired: !1,
            type: "error"
        })
    }
    return A
}
// @from(Ln 392328, Col 0)
async function lnY(A) {
    try {
        let q = await d4("npm", ["config", "get", "prefix"]);
        if (q.code !== 0 || !q.stdout) return {
            success: !1,
            error: "Failed to get npm global prefix"
        };
        let K = q.stdout.trim(),
            Y = !1;
        async function z(w, H) {
            try {
                return await HG(w), await Oc(w), h(`Manually removed ${H}: ${w}`), !0
            } catch {
                return !1
            }
        }
        if (Hc() === "windows") {
            let w = BJ(K, "claude.cmd"),
                H = BJ(K, "claude.ps1"),
                $ = BJ(K, "claude");
            if (await z(w, "bin script")) Y = !0;
            if (await z(H, "PowerShell script")) Y = !0;
            if (await z($, "bin executable")) Y = !0
        } else {
            let w = BJ(K, "bin", "claude");
            if (await z(w, "bin symlink")) Y = !0
        }
        if (Y) {
            h(`Successfully removed ${A} manually`);
            let w = Hc() === "windows" ? BJ(K, "node_modules", A) : BJ(K, "lib", "node_modules", A);
            return {
                success: !0,
                warning: `${A} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${w}`
            }
        } else return {
            success: !1
        }
    } catch (q) {
        return h(`Manual removal failed: ${q}`, {
            level: "error"
        }), {
            success: !1,
            error: `Manual removal failed: ${q}`
        }
    }
}
// @from(Ln 392374, Col 0)
async function R8q(A) {
    let {
        code: q,
        stderr: K
    } = await d4("npm", ["uninstall", "-g", A], {
        cwd: process.cwd()
    });
    if (q === 0) return h(`Removed global npm installation of ${A}`), {
        success: !0
    };
    else if (K && !K.includes("npm ERR! code E404")) {
        if (K.includes("npm error code ENOTEMPTY")) {
            h(`Failed to uninstall global npm package ${A}: ${K}`, {
                level: "error"
            }), h("Attempting manual removal due to ENOTEMPTY error");
            let Y = await lnY(A);
            if (Y.success) return {
                success: !0,
                warning: Y.warning
            };
            else if (Y.error) return {
                success: !1,
                error: `Failed to remove global npm installation of ${A}: ${K}. Manual removal also failed: ${Y.error}`
            }
        }
        return h(`Failed to uninstall global npm package ${A}: ${K}`, {
            level: "error"
        }), {
            success: !1,
            error: `Failed to remove global npm installation of ${A}: ${K}`
        }
    }
    return {
        success: !1
    }
}
// @from(Ln 392410, Col 0)
async function Xp1() {
    let A = [],
        q = [],
        K = 0,
        Y = await R8q("@anthropic-ai/claude-code");
    if (Y.success) {
        if (K++, Y.warning) q.push(Y.warning)
    } else if (Y.error) A.push(Y.error);
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") {
        let w = await R8q({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL);
        if (w.success) {
            if (K++, w.warning) q.push(w.warning)
        } else if (w.error) A.push(w.error)
    }
    let z = BJ(y8q(), ".claude", "local");
    if (ME(z)) try {
        await zV6(z, {
            recursive: !0,
            force: !0
        }), K++, h(`Removed local installation at ${z}`)
    } catch (w) {
        A.push(`Failed to remove ${z}: ${w}`), h(`Failed to remove local installation: ${w}`, {
            level: "error"
        })
    }
    return {
        removed: K,
        errors: A,
        warnings: q
    }
}
// @from(Ln 392462, Col 4)
YV6
// @from(Ln 392462, Col 9)
FIA = 2
// @from(Ln 392463, Col 4)
UIA = 604800000
// @from(Ln 392464, Col 4)
SIA = v(() => {
    G5();
    $a();
    tq();
    y6();
    Tz();
    u6();
    Z6();
    EIA();
    cA();
    df6();
    D91();
    we();
    T8q();
    am();
    hA();
    mIA();
    YV6 = o(NQ(), 1)
})
// @from(Ln 392483, Col 4)
BI = v(() => {
    SIA()
})
// @from(Ln 392487, Col 0)
function Jc() {
    let A = E81(),
        K = ["user", "project", "local"].flatMap((Y) => xJ(Y).errors);
    return {
        settings: A.settings,
        errors: [...A.errors, ...K]
    }
}
// @from(Ln 392495, Col 4)
Dp1 = v(() => {
    p8();
    nW()
})
// @from(Ln 392500, Col 0)
function I8q() {
    return []
}
// @from(Ln 392504, Col 0)
function x8q(A, q = null, K) {
    let Y = A?.find((z) => z.name === "ide");
    if (q) {
        let z = S_(q.ideType),
            w = Oh(q.ideType) ? "plugin" : "extension";
        if (q.error) return [{
            label: "IDE",
            value: f91.createElement(V, null, k8("error", K)(l1.cross), " Error installing ", z, " ", w, ": ", q.error, `
`, "Please restart your IDE and try again.")
        }];
        if (q.installed)
            if (Y && Y.type === "connected")
                if (q.installedVersion !== Y.serverInfo?.version) return [{
                    label: "IDE",
                    value: `Connected to ${z} ${w} version ${q.installedVersion} (server version: ${Y.serverInfo?.version})`
                }];
                else return [{
                    label: "IDE",
                    value: `Connected to ${z} ${w} version ${q.installedVersion}`
                }];
        else return [{
            label: "IDE",
            value: `Installed ${z} ${w}`
        }]
    } else if (Y) {
        let z = DXA(Y) ?? "IDE";
        if (Y.type === "connected") return [{
            label: "IDE",
            value: `Connected to ${z} extension`
        }];
        else return [{
            label: "IDE",
            value: `${k8("error",K)(l1.cross)} Not connected to ${z}`
        }]
    }
    return []
}
// @from(Ln 392542, Col 0)
function b8q(A = [], q) {
    let K = A.filter((Y) => Y.name !== "ide");
    if (!K.length) return [];
    return [{
        label: "MCP servers",
        value: f91.createElement(I, {
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 1,
            flexShrink: 99
        }, K.map((Y, z) => {
            let w = "";
            if (Y.type === "connected") w = k8("success", q)(l1.tick);
            else if (Y.type === "pending") w = k8("inactive", q)(l1.radioOff);
            else if (Y.type === "needs-auth") w = k8("warning", q)(l1.triangleUpOutline);
            else if (Y.type === "failed") w = k8("error", q)(l1.cross);
            else w = k8("error", q)(l1.cross);
            let H = z < K.length - 1 ? "," : "";
            return f91.createElement(V, {
                key: z
            }, Y.name, " ", w, H)
        }))
    }]
}
// @from(Ln 392567, Col 0)
function u8q() {
    let A = DK1(),
        q = jK1(),
        K = [];
    if (A.forEach((Y) => {
            let z = L3(Y.path);
            K.push(`Large ${z} will impact performance (${Y3(Y.content.length)} chars > ${Y3(Cp)})`)
        }), q && q.content.length > Cj1) K.push(`CLAUDE.md entries marked as IMPORTANT exceed ${Y3(Cj1)} characters (${Y3(q.content.length)} chars)`);
    return K
}
// @from(Ln 392578, Col 0)
function B8q() {
    return [{
        label: "Setting sources",
        value: Ei().filter((Y) => {
            let z = y7(Y);
            return z !== null && Object.keys(z).length > 0
        }).map((Y) => {
            if (Y === "policySettings") {
                let z = Di8();
                if (z === null) return null;
                return z === "remote" ? "Enterprise managed settings (remote)" : "Enterprise managed settings (local)"
            }
            return Tz8(Y)
        }).filter((Y) => Y !== null)
    }]
}
// @from(Ln 392594, Col 0)
async function m8q() {
    return (await tm()).map((q) => q.message)
}
// @from(Ln 392597, Col 0)
async function F8q() {
    let A = await W91(),
        q = [],
        {
            errors: K
        } = Jc();
    if (K.length > 0) {
        let z = Array.from(new Set(K.map((w) => w.file))).join(", ");
        q.push(`Found invalid settings files: ${z}. They will be ignored.`)
    }
    if (A.warnings.forEach((Y) => {
            q.push(Y.issue)
        }), A.hasUpdatePermissions === !1) q.push("No write permissions for auto-updates (requires sudo)");
    return q
}
// @from(Ln 392613, Col 0)
function Q8q() {
    let A = r86();
    if (!A) return [];
    let q = [];
    if (A.subscription) q.push({
        label: "Login method",
        value: `${A.subscription} Account`
    });
    if (A.tokenSource) q.push({
        label: "Auth token",
        value: A.tokenSource
    });
    if (A.apiKeySource) q.push({
        label: "API key",
        value: A.apiKeySource
    });
    if (A.organization && !process.env.IS_DEMO) q.push({
        label: "Organization",
        value: A.organization
    });
    if (A.email && !process.env.IS_DEMO) q.push({
        label: "Email",
        value: A.email
    });
    return q
}
// @from(Ln 392640, Col 0)
function g8q() {
    let A = E4(),
        q = [];
    if (A !== "firstParty") {
        let z = {
            bedrock: "AWS Bedrock",
            vertex: "Google Vertex AI",
            foundry: "Microsoft Foundry"
        } [A];
        q.push({
            label: "API provider",
            value: z
        })
    }
    if (A === "firstParty") {
        let z = process.env.ANTHROPIC_BASE_URL;
        if (z) q.push({
            label: "Anthropic base URL",
            value: z
        })
    } else if (A === "bedrock") {
        let z = process.env.BEDROCK_BASE_URL;
        if (z) q.push({
            label: "Bedrock base URL",
            value: z
        });
        if (q.push({
                label: "AWS region",
                value: j61()
            }), J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) q.push({
            value: "AWS auth skipped"
        })
    } else if (A === "vertex") {
        let z = process.env.VERTEX_BASE_URL;
        if (z) q.push({
            label: "Vertex base URL",
            value: z
        });
        let w = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
        if (w) q.push({
            label: "GCP project",
            value: w
        });
        if (q.push({
                label: "Default region",
                value: KC()
            }), J6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) q.push({
            value: "GCP auth skipped"
        })
    } else if (A === "foundry") {
        let z = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
        if (z) q.push({
            label: "Microsoft Foundry base URL",
            value: z
        });
        let w = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
        if (w) q.push({
            label: "Microsoft Foundry resource",
            value: w
        });
        if (J6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) q.push({
            value: "Microsoft Foundry auth skipped"
        })
    }
    let K = Vg();
    if (K) q.push({
        label: "Proxy",
        value: K
    });
    let Y = mC();
    if (process.env.NODE_EXTRA_CA_CERTS) q.push({
        label: "Additional CA cert(s)",
        value: process.env.NODE_EXTRA_CA_CERTS
    });
    if (Y) {
        if (Y.cert && process.env.CLAUDE_CODE_CLIENT_CERT) q.push({
            label: "mTLS client cert",
            value: process.env.CLAUDE_CODE_CLIENT_CERT
        });
        if (Y.key && process.env.CLAUDE_CODE_CLIENT_KEY) q.push({
            label: "mTLS client key",
            value: process.env.CLAUDE_CODE_CLIENT_KEY
        })
    }
    return q
}
// @from(Ln 392727, Col 0)
function U8q(A) {
    let q = _S(A);
    if (A === null && i8()) {
        let K = Qq6();
        if (tk()) q = `${H6.bold("Default")} ${K}`;
        else q = `${H6.bold("Sonnet")} ${K}`
    }
    return q
}
// @from(Ln 392736, Col 4)
f91
// @from(Ln 392737, Col 4)
p8q = v(() => {
    m1();
    BI();
    J7();
    q$();
    dD();
    vq();
    wq();
    UH();
    e7();
    q3();
    am();
    hA();
    bb();
    YO1();
    p8();
    Dp1();
    k2();
    b7();
    J7();
    E$();
    f91 = o(X1(), 1)
})
// @from(Ln 392761, Col 0)
function inY() {
    let A = U6(),
        K = wm1(A) ?? v5.createElement(V, {
            dimColor: !0
        }, "/rename to add a name");
    return [{
        label: "Version",
        value: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION
    }, {
        label: "Session name",
        value: K
    }, {
        label: "Session ID",
        value: A
    }, {
        label: "cwd",
        value: h6()
    }, ...Q8q(), ...g8q()]
}
// @from(Ln 392788, Col 0)
function nnY({
    mainLoopModel: A,
    mcp: q,
    theme: K,
    context: Y
}) {
    return [{
        label: "Model",
        value: U8q(A)
    }, ...x8q(q.clients, Y.options.ideInstallationStatus, K), ...b8q(q.clients, K), {
        label: "Memory",
        value: v5.createElement(H8q, {
            context: Y,
            flat: !0
        })
    }, ...I8q(), ...B8q()]
}
// @from(Ln 392805, Col 0)
async function rnY() {
    return [...await m8q(), ...await F8q(), ...u8q()]
}
// @from(Ln 392809, Col 0)
function onY(A) {
    let q = e(8),
        {
            value: K
        } = A;
    if (Array.isArray(K)) {
        let Y;
        if (q[0] !== K) {
            let w;
            if (q[2] !== K.length) w = (H, $) => v5.createElement(V, {
                key: $
            }, H, $ < K.length - 1 ? "," : ""), q[2] = K.length, q[3] = w;
            else w = q[3];
            Y = K.map(w), q[0] = K, q[1] = Y
        } else Y = q[1];
        let z;
        if (q[4] !== Y) z = v5.createElement(I, {
            flexWrap: "wrap",
            columnGap: 1,
            flexShrink: 99
        }, Y), q[4] = Y, q[5] = z;
        else z = q[5];
        return z
    }
    if (typeof K === "string") {
        let Y;
        if (q[6] !== K) Y = v5.createElement(V, null, K), q[6] = K, q[7] = Y;
        else Y = q[7];
        return Y
    }
    return K
}
// @from(Ln 392842, Col 0)
function d8q(A) {
    let q = e(18),
        {
            context: K
        } = A,
        Y = v6(ArY),
        z = v6(enY),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = [], q[0] = w;
    else w = q[0];
    let [H, $] = v5.useState(w), O;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = [], q[1] = O;
    else O = q[1];
    let [_, J] = v5.useState(O), [X] = T7(), D, j;
    if (q[2] !== K || q[3] !== Y || q[4] !== z || q[5] !== X) D = () => {
        (async function() {
            let T = [inY(), nnY({
                    mainLoopModel: Y,
                    mcp: z,
                    theme: X,
                    context: K
                })],
                k = await rnY();
            $(T), J(k)
        })()
    }, j = [Y, z, X, K], q[2] = K, q[3] = Y, q[4] = z, q[5] = X, q[6] = D, q[7] = j;
    else D = q[6], j = q[7];
    v5.useEffect(D, j);
    let M;
    if (q[8] !== H) M = H.map(snY), q[8] = H, q[9] = M;
    else M = q[9];
    let P;
    if (q[10] !== _) P = _.length > 0 && v5.createElement(I, {
        flexDirection: "column",
        paddingBottom: 1
    }, v5.createElement(V, {
        bold: !0
    }, "System Diagnostics"), _.map(anY)), q[10] = _, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] !== M || q[13] !== P) W = v5.createElement(I, {
        flexDirection: "column",
        gap: 1,
        marginTop: 1
    }, M, P), q[12] = M, q[13] = P, q[14] = W;
    else W = q[14];
    let G;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) G = v5.createElement(V, {
        dimColor: !0
    }, v5.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })), q[15] = G;
    else G = q[15];
    let f;
    if (q[16] !== W) f = v5.createElement(I, {
        flexDirection: "column"
    }, W, G), q[16] = W, q[17] = f;
    else f = q[17];
    return f
}
// @from(Ln 392906, Col 0)
function anY(A, q) {
    return v5.createElement(I, {
        key: q,
        flexDirection: "row",
        gap: 1,
        paddingX: 1
    }, v5.createElement(V, {
        color: "error"
    }, l1.warning), typeof A === "string" ? v5.createElement(V, {
        wrap: "wrap"
    }, A) : A)
}
// @from(Ln 392919, Col 0)
function snY(A, q) {
    return A.length > 0 && v5.createElement(I, {
        key: q,
        flexDirection: "column"
    }, A.map(tnY))
}
// @from(Ln 392926, Col 0)
function tnY(A, q) {
    let {
        label: K,
        value: Y
    } = A;
    return v5.createElement(I, {
        key: q,
        flexDirection: "row",
        gap: 1,
        flexShrink: 0
    }, K !== void 0 && v5.createElement(V, {
        bold: !0
    }, K, ":"), v5.createElement(onY, {
        value: Y
    }))
}
// @from(Ln 392943, Col 0)
function enY(A) {
    return A.mcp
}
// @from(Ln 392947, Col 0)
function ArY(A) {
    return A.mainLoopModel
}
// @from(Ln 392950, Col 4)
v5
// @from(Ln 392951, Col 4)
c8q = v(() => {
    i1();
    m1();
    b7();
    d8();
    B6();
    $8q();
    p8q();
    N7();
    lq();
    BK();
    v5 = o(X1(), 1)
})
// @from(Ln 392965, Col 0)
function zZ1(A) {
    let q = e(59),
        {
            onThemeSelect: K,
            showIntroText: Y,
            helpText: z,
            showHelpTextBelow: w,
            hideEscToCancel: H,
            skipExitHandling: $,
            onCancel: O
        } = A,
        _ = Y === void 0 ? !1 : Y,
        J = z === void 0 ? "" : z,
        X = w === void 0 ? !1 : w,
        D = H === void 0 ? !1 : H,
        j = $ === void 0 ? !1 : $,
        [M] = T7(),
        {
            columns: P
        } = Z8(),
        W;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) W = kkA(), q[0] = W;
    else W = q[0];
    let G = W,
        f;
    if (q[1] !== M) f = G === null ? LF4(M) : null, q[1] = M, q[2] = f;
    else f = q[2];
    let Z = f,
        {
            setPreviewTheme: N,
            savePreview: T,
            cancelPreview: k
        } = dK6(),
        y = v6(KrY) ?? !1,
        B = L7();
    q36("ThemePicker");
    let S = RK("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t"),
        m;
    if (q[3] !== B || q[4] !== y) m = () => {
        if (G === null) {
            let M1 = !y;
            Z7("userSettings", {
                syntaxHighlightingDisabled: M1
            }), B((z1) => ({
                ...z1,
                settings: {
                    ...z1.settings,
                    syntaxHighlightingDisabled: M1
                }
            }))
        }
    }, q[3] = B, q[4] = y, q[5] = m;
    else m = q[5];
    let b;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) b = {
        context: "ThemePicker"
    }, q[6] = b;
    else b = q[6];
    DA("theme:toggleSyntaxHighlighting", m, b);
    let g = uq(j ? qrY : void 0),
        U;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) U = [{
        label: "Dark mode",
        value: "dark"
    }, {
        label: "Light mode",
        value: "light"
    }, {
        label: "Dark mode (colorblind-friendly)",
        value: "dark-daltonized"
    }, {
        label: "Light mode (colorblind-friendly)",
        value: "light-daltonized"
    }, {
        label: "Dark mode (ANSI colors only)",
        value: "dark-ansi"
    }, {
        label: "Light mode (ANSI colors only)",
        value: "light-ansi"
    }], q[7] = U;
    else U = q[7];
    let x = U,
        p;
    if (q[8] !== _) p = _ ? TK.createElement(V, null, "Let's get started.") : TK.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Theme"), q[8] = _, q[9] = p;
    else p = q[9];
    let l;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) l = TK.createElement(V, {
        bold: !0
    }, "Choose the text style that looks best with your terminal"), q[10] = l;
    else l = q[10];
    let r;
    if (q[11] !== J || q[12] !== X) r = J && !X && TK.createElement(V, {
        dimColor: !0
    }, J), q[11] = J, q[12] = X, q[13] = r;
    else r = q[13];
    let s;
    if (q[14] !== r) s = TK.createElement(I, {
        flexDirection: "column"
    }, l, r), q[14] = r, q[15] = s;
    else s = q[15];
    let O1;
    if (q[16] !== N) O1 = (M1) => {
        N(M1)
    }, q[16] = N, q[17] = O1;
    else O1 = q[17];
    let T1;
    if (q[18] !== K || q[19] !== T) T1 = (M1) => {
        T(), K(M1)
    }, q[18] = K, q[19] = T, q[20] = T1;
    else T1 = q[20];
    let N1;
    if (q[21] !== k || q[22] !== O || q[23] !== j) N1 = j ? () => {
        k(), O?.()
    } : async () => {
        k(), await nK(0)
    }, q[21] = k, q[22] = O, q[23] = j, q[24] = N1;
    else N1 = q[24];
    let j1;
    if (q[25] !== O1 || q[26] !== T1 || q[27] !== N1 || q[28] !== M) j1 = TK.createElement(kA, {
        options: x,
        onFocus: O1,
        onChange: T1,
        onCancel: N1,
        visibleOptionCount: 6,
        defaultValue: M,
        defaultFocusValue: M
    }), q[25] = O1, q[26] = T1, q[27] = N1, q[28] = M, q[29] = j1;
    else j1 = q[29];
    let q1;
    if (q[30] !== p || q[31] !== s || q[32] !== j1) q1 = TK.createElement(I, {
        flexDirection: "column",
        gap: 1,
        marginX: 1
    }, p, s, j1), q[30] = p, q[31] = s, q[32] = j1, q[33] = q1;
    else q1 = q[33];
    let t;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) t = {
        oldStart: 1,
        newStart: 1,
        oldLines: 3,
        newLines: 3,
        lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
    }, q[34] = t;
    else t = q[34];
    let J1;
    if (q[35] !== P) J1 = TK.createElement(I, {
        flexDirection: "column",
        borderTop: !0,
        borderBottom: !0,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderDimColor: !0
    }, TK.createElement(fN, {
        patch: t,
        dim: !1,
        filePath: "demo.js",
        firstLine: null,
        width: P
    })), q[35] = P, q[36] = J1;
    else J1 = q[36];
    let D1 = G === "env" ? `Syntax highlighting disabled (via CLAUDE_CODE_SYNTAX_HIGHLIGHT=${process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT})` : G === "build" ? "Syntax highlighting available only in native build" : y ? `Syntax highlighting disabled (${S} to enable)` : Z ? `Syntax theme: ${Z.theme}${Z.source?` (from ${Z.source})`:""} (${S} to disable)` : `Syntax highlighting enabled (${S} to disable)`,
        Z1;
    if (q[37] !== D1) Z1 = TK.createElement(V, {
        dimColor: !0
    }, " ", D1), q[37] = D1, q[38] = Z1;
    else Z1 = q[38];
    let E1;
    if (q[39] !== J1 || q[40] !== Z1) E1 = TK.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, J1, Z1), q[39] = J1, q[40] = Z1, q[41] = E1;
    else E1 = q[41];
    let a;
    if (q[42] !== q1 || q[43] !== E1) a = TK.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, q1, E1), q[42] = q1, q[43] = E1, q[44] = a;
    else a = q[44];
    let A1 = a;
    if (!_) {
        let M1;
        if (q[45] !== A1) M1 = TK.createElement(I, {
            flexDirection: "column"
        }, A1), q[45] = A1, q[46] = M1;
        else M1 = q[46];
        let z1;
        if (q[47] !== J || q[48] !== X) z1 = X && J && TK.createElement(I, {
            marginLeft: 3
        }, TK.createElement(V, {
            dimColor: !0
        }, J)), q[47] = J, q[48] = X, q[49] = z1;
        else z1 = q[49];
        let Y1;
        if (q[50] !== g || q[51] !== D) Y1 = !D && TK.createElement(I, null, TK.createElement(V, {
            dimColor: !0,
            italic: !0
        }, g.pending ? TK.createElement(TK.Fragment, null, "Press ", g.keyName, " again to exit") : TK.createElement(oA, null, TK.createElement(YA, {
            shortcut: "Enter",
            action: "select"
        }), TK.createElement(YA, {
            shortcut: "Esc",
            action: "cancel"
        })))), q[50] = g, q[51] = D, q[52] = Y1;
        else Y1 = q[52];
        let _1;
        if (q[53] !== z1 || q[54] !== Y1) _1 = TK.createElement(I, {
            marginX: 1,
            marginTop: 1
        }, z1, Y1), q[53] = z1, q[54] = Y1, q[55] = _1;
        else _1 = q[55];
        let $1;
        if (q[56] !== M1 || q[57] !== _1) $1 = TK.createElement(TK.Fragment, null, M1, _1), q[56] = M1, q[57] = _1, q[58] = $1;
        else $1 = q[58];
        return $1
    }
    return A1
}
// @from(Ln 393188, Col 0)
function qrY() {}
// @from(Ln 393190, Col 0)
function KrY(A) {
    return A.settings.syntaxHighlightingDisabled
}
// @from(Ln 393193, Col 4)
TK
// @from(Ln 393194, Col 4)
wV6 = v(() => {
    i1();
    m1();
    wY();
    jt();
    R2();
    w$();
    m1();
    mq();
    wK();
    HK();
    G51();
    p8();
    d8();
    K7();
    s2();
    eg();
    TK = o(X1(), 1)
})
// @from(Ln 393214, Col 0)
function wZ1({
    initial: A,
    sessionModel: q,
    onSelect: K,
    onCancel: Y,
    isStandaloneCommand: z,
    showPenguinsNotice: w
}) {
    let H = L7(),
        $ = A === null ? HV6 : A,
        O = 10,
        _ = uq(),
        J = v6((x) => i4() ? x.fastMode : !1),
        X = v6((x) => x.effortValue),
        D = RN.useRef(X !== void 0 ? hn7(X) : "high"),
        [j, M] = RN.useState(D.current),
        [P, W] = RN.useState(!1),
        [G, f] = RN.useState($),
        Z = RN.useMemo(() => O71(J ?? !1), [J]),
        N = RN.useMemo(() => {
            if (A !== null && !Z.some((x) => x.value === A)) return [...Z, {
                value: A,
                label: _S(A),
                description: "Current model"
            }];
            return Z
        }, [Z, A]),
        T = RN.useMemo(() => N.map((x) => ({
            ...x,
            value: x.value === null ? HV6 : x.value
        })), [N]),
        k = RN.useMemo(() => T.some((x) => x.value === $) ? $ : T[0]?.value ?? void 0, [T, $]),
        y = Math.min(10, T.length),
        B = Math.max(0, T.length - y),
        S = T.find((x) => x.value === G)?.label,
        m = l8q(G),
        b = RN.useCallback(() => {
            if (m) M((x) => r8q(x, "left")), W(!0)
        }, [m]),
        g = RN.useCallback(() => {
            if (m) M((x) => r8q(x, "right")), W(!0)
        }, [m]);
    c7({
        "modelPicker:decreaseEffort": b,
        "modelPicker:increaseEffort": g
    }, {
        context: "ModelPicker"
    });

    function U(x) {
        c("tengu_model_command_menu_effort", {
            effort: j
        });
        let p = j === "high" ? void 0 : j;
        if (Z7("userSettings", {
                effortLevel: p
            }), H((r) => ({
                ...r,
                effortValue: p
            })), x === HV6) {
            K(null, void 0);
            return
        }
        let l = P && l8q(x) ? j : void 0;
        K(x, l)
    }
    return A4.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, z && A4.createElement(CY, {
        dividerColor: "permission",
        dividerDimColor: !1
    }), A4.createElement(I, {
        flexDirection: "column",
        paddingX: z ? 1 : 0
    }, A4.createElement(I, {
        flexDirection: "column"
    }, A4.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, A4.createElement(V, {
        color: "remember",
        bold: !0
    }, "Select model"), A4.createElement(V, {
        dimColor: !0
    }, "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model."), q && A4.createElement(V, {
        dimColor: !0
    }, "Currently using ", _S(q), " for this session (set by plan mode). Selecting a model will undo this.")), A4.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, A4.createElement(I, {
        flexDirection: "column"
    }, A4.createElement(kA, {
        defaultValue: $,
        defaultFocusValue: k,
        options: T,
        onChange: U,
        onFocus: f,
        onCancel: Y ?? (() => {}),
        visibleOptionCount: y
    })), B > 0 && A4.createElement(I, {
        paddingLeft: 3
    }, A4.createElement(V, {
        dimColor: !0
    }, "and ", B, " more…"))), A4.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, m ? A4.createElement(V, {
        dimColor: !0
    }, A4.createElement(i8q, {
        effort: j
    }), " ", _Q(j), " ", "effort", j === "high" ? " (default)" : "", " ", A4.createElement(V, {
        color: "subtle"
    }, "← → to adjust")) : A4.createElement(V, {
        color: "subtle"
    }, A4.createElement(i8q, {
        effort: void 0
    }), " Effort not supported", S ? ` for ${S}` : "")), i4() ? w ? A4.createElement(I, {
        marginBottom: 1
    }, A4.createElement(V, {
        dimColor: !0
    }, "Fast mode is ", A4.createElement(V, {
        bold: !0
    }, "ON"), " and available with", " ", $S, " only (/fast). Switching to other models turn off fast mode.", A4.createElement(n8q, null))) : lH() && !Kv() ? A4.createElement(I, {
        marginBottom: 1
    }, A4.createElement(V, {
        dimColor: !0
    }, "Use ", A4.createElement(V, {
        bold: !0
    }, "/fast"), " to turn on Fast mode (", $S, " only).", A4.createElement(n8q, null))) : null : null), z && A4.createElement(V, {
        dimColor: !0,
        italic: !0
    }, _.pending ? A4.createElement(A4.Fragment, null, "Press ", _.keyName, " again to exit") : A4.createElement(oA, null, A4.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), A4.createElement(NA, {
        action: "select:cancel",
        context: "Select",
        fallback: "Esc",
        description: "exit"
    })))))
}
// @from(Ln 393357, Col 0)
function l8q(A) {
    if (!A) return !1;
    if (A === HV6) return VB1(ML());
    return VB1(t9(A))
}
// @from(Ln 393363, Col 0)
function i8q(A) {
    let q = e(3),
        {
            effort: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = ["low", "medium", "high"], q[0] = Y;
    else Y = q[0];
    let z = Y,
        w = K ? z.indexOf(K) + 1 : 0,
        H;
    if (q[1] !== w) H = A4.createElement(A4.Fragment, null, z.map(($, O) => A4.createElement(V, {
        key: O,
        color: O < w ? "claude" : "subtle"
    }, "▌"))), q[1] = w, q[2] = H;
    else H = q[2];
    return H
}
// @from(Ln 393382, Col 0)
function n8q() {
    let A = e(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = HS(), A[0] = q;
    else q = A[0];
    let K = q;
    if (!K) return null;
    let Y;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) Y = A4.createElement(V, null, " ", "Now ", K.discountPercent, "% off through ", K.endDate, "."), A[1] = Y;
    else Y = A[1];
    return Y
}
// @from(Ln 393395, Col 0)
function r8q(A, q) {
    let K = ["low", "medium", "high"],
        Y = K.indexOf(A);
    if (q === "right") return K[(Y + 1) % K.length];
    else return K[(Y - 1 + K.length) % K.length]
}
// @from(Ln 393401, Col 4)
A4
// @from(Ln 393401, Col 8)
RN
// @from(Ln 393401, Col 12)
HV6 = "__NO_PREFERENCE__"
// @from(Ln 393402, Col 4)
$V6 = v(() => {
    i1();
    m1();
    K7();
    TN1();
    e7();
    NB1();
    p8();
    d8();
    wY();
    R2();
    kW();
    wK();
    BK();
    HK();
    u6();
    OJ();
    A4 = o(X1(), 1), RN = o(X1(), 1)
})
// @from(Ln 393422, Col 0)
function OV6(A) {
    let q = e(18),
        {
            onDone: K,
            isStandaloneDialog: Y,
            externalIncludes: z
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = [], q[0] = w;
    else w = q[0];
    em.default.useEffect(HrY, w);
    let H;
    if (q[1] !== K) H = (f) => {
        if (f === "no") c("tengu_claude_md_external_includes_dialog_declined", {}), iH(wrY);
        else c("tengu_claude_md_external_includes_dialog_accepted", {}), iH(zrY);
        K()
    }, q[1] = K, q[2] = H;
    else H = q[2];
    let $ = H,
        O;
    if (q[3] !== $) O = () => {
        $("no")
    }, q[3] = $, q[4] = O;
    else O = q[4];
    let _ = O,
        J = !Y,
        X = !Y,
        D;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) D = em.default.createElement(V, null, "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."), q[5] = D;
    else D = q[5];
    let j;
    if (q[6] !== z) j = z && z.length > 0 && em.default.createElement(I, {
        flexDirection: "column"
    }, em.default.createElement(V, {
        dimColor: !0
    }, "External imports:"), z.map(YrY)), q[6] = z, q[7] = j;
    else j = q[7];
    let M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = em.default.createElement(V, {
        dimColor: !0
    }, "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks", " ", em.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/security"
    }), " "), q[8] = M;
    else M = q[8];
    let P;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) P = [{
        label: "Yes, allow external imports",
        value: "yes"
    }, {
        label: "No, disable external imports",
        value: "no"
    }], q[9] = P;
    else P = q[9];
    let W;
    if (q[10] !== $) W = em.default.createElement(kA, {
        options: P,
        onChange: (f) => $(f)
    }), q[10] = $, q[11] = W;
    else W = q[11];
    let G;
    if (q[12] !== _ || q[13] !== W || q[14] !== J || q[15] !== X || q[16] !== j) G = em.default.createElement(w8, {
        title: "Allow external CLAUDE.md file imports?",
        color: "warning",
        onCancel: _,
        hideBorder: J,
        hideInputGuide: X
    }, D, j, M, W), q[12] = _, q[13] = W, q[14] = J, q[15] = X, q[16] = j, q[17] = G;
    else G = q[17];
    return G
}
// @from(Ln 393493, Col 0)
function YrY(A, q) {
    return em.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "  ", A.path)
}
// @from(Ln 393500, Col 0)
function zrY(A) {
    return {
        ...A,
        hasClaudeMdExternalIncludesApproved: !0,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 393508, Col 0)
function wrY(A) {
    return {
        ...A,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 393516, Col 0)
function HrY() {
    c("tengu_claude_md_includes_dialog_shown", {})
}
// @from(Ln 393519, Col 4)
em
// @from(Ln 393520, Col 4)
cIA = v(() => {
    i1();
    m1();
    wY();
    cA();
    u6();
    m1();
    Bq();
    em = o(X1(), 1)
})
// @from(Ln 393531, Col 0)
function o8q(A) {
    let q = e(17),
        {
            currentVersion: K,
            onChoice: Y
        } = A,
        z;
    if (q[0] !== Y) z = function(W) {
        Y(W)
    }, q[0] = Y, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] !== Y) H = function() {
        Y("cancel")
    }, q[2] = Y, q[3] = H;
    else H = q[3];
    let $ = H,
        O;
    if (q[4] !== K) O = jp1.default.createElement(V, null, "The stable channel may have an older version than what you're currently running (", K, ")."), q[4] = K, q[5] = O;
    else O = q[5];
    let _;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) _ = jp1.default.createElement(V, {
        dimColor: !0
    }, "How would you like to handle this?"), q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = {
        label: "Allow possible downgrade to stable version",
        value: "downgrade"
    }, q[7] = J;
    else J = q[7];
    let X = `Stay on current version (${K}) until stable catches up`,
        D;
    if (q[8] !== X) D = [J, {
        label: X,
        value: "stay"
    }], q[8] = X, q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== w || q[11] !== D) j = jp1.default.createElement(kA, {
        options: D,
        onChange: w
    }), q[10] = w, q[11] = D, q[12] = j;
    else j = q[12];
    let M;
    if (q[13] !== $ || q[14] !== O || q[15] !== j) M = jp1.default.createElement(w8, {
        title: "Switch to Stable Channel",
        onCancel: $,
        color: "permission",
        hideBorder: !0,
        hideInputGuide: !0
    }, O, _, j), q[13] = $, q[14] = O, q[15] = j, q[16] = M;
    else M = q[16];
    return M
}
// @from(Ln 393587, Col 4)
jp1
// @from(Ln 393588, Col 4)
a8q = v(() => {
    i1();
    m1();
    wY();
    Bq();
    jp1 = o(X1(), 1)
})
// @from(Ln 393596, Col 0)
function s8q(A) {
    return Object.entries(A).map(([q, K]) => ({
        label: K?.name ?? $rY,
        value: q,
        description: K?.description ?? OrY
    }))
}
// @from(Ln 393604, Col 0)
function _V6(A) {
    let q = e(16),
        {
            initialStyle: K,
            onComplete: Y,
            onCancel: z,
            isStandaloneCommand: w
        } = A,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = [], q[0] = H;
    else H = q[0];
    let [$, O] = Mp1.useState(H), [_, J] = Mp1.useState(!0), X, D;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) X = () => {
        V91(h6()).then((N) => {
            let T = s8q(N);
            O(T), J(!1)
        }).catch(() => {
            let N = s8q(D51);
            O(N), J(!1)
        })
    }, D = [], q[1] = X, q[2] = D;
    else X = q[1], D = q[2];
    Mp1.useEffect(X, D);
    let j;
    if (q[3] !== Y) j = (N) => {
        Y(N)
    }, q[3] = Y, q[4] = j;
    else j = q[4];
    let M = j,
        P = !w,
        W = !w,
        G;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) G = PE.createElement(I, {
        marginTop: 1
    }, PE.createElement(V, {
        dimColor: !0
    }, "This changes how Claude Code communicates with you")), q[5] = G;
    else G = q[5];
    let f;
    if (q[6] !== M || q[7] !== K || q[8] !== _ || q[9] !== $) f = PE.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, G, _ ? PE.createElement(V, {
        dimColor: !0
    }, "Loading output styles…") : PE.createElement(kA, {
        options: $,
        onChange: M,
        visibleOptionCount: 10,
        defaultValue: K
    })), q[6] = M, q[7] = K, q[8] = _, q[9] = $, q[10] = f;
    else f = q[10];
    let Z;
    if (q[11] !== z || q[12] !== P || q[13] !== W || q[14] !== f) Z = PE.createElement(w8, {
        title: "Preferred output style",
        onCancel: z,
        borderDimColor: !0,
        hideInputGuide: P,
        hideBorder: W
    }, f), q[11] = z, q[12] = P, q[13] = W, q[14] = f, q[15] = Z;
    else Z = q[15];
    return Z
}
// @from(Ln 393666, Col 4)
PE
// @from(Ln 393666, Col 8)
Mp1
// @from(Ln 393666, Col 13)
$rY = "Default"
// @from(Ln 393667, Col 4)
OrY = "Claude completes coding tasks efficiently and provides concise responses"
// @from(Ln 393668, Col 4)
lIA = v(() => {
    i1();
    m1();
    U5();
    Em();
    N7();
    Bq();
    PE = o(X1(), 1), Mp1 = o(X1(), 1)
})
// @from(Ln 393678, Col 0)
function t8q(A) {
    let q = e(13),
        {
            initialLanguage: K,
            onComplete: Y,
            onCancel: z
        } = A,
        [w, H] = iIA.useState(K),
        [$, O] = iIA.useState((K ?? "").length),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Settings"
    }, q[0] = _;
    else _ = q[0];
    DA("confirm:no", z, _);
    let J;
    if (q[1] !== w || q[2] !== Y) J = function() {
        let Z = w?.trim();
        Y(Z || void 0)
    }, q[1] = w, q[2] = Y, q[3] = J;
    else J = q[3];
    let X = J,
        D;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) D = N91.default.createElement(V, null, "Enter your preferred response language:"), q[4] = D;
    else D = q[4];
    let j;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) j = N91.default.createElement(V, null, l1.pointer), q[5] = j;
    else j = q[5];
    let M = w ?? "",
        P;
    if (q[6] !== $ || q[7] !== X || q[8] !== M) P = N91.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, j, N91.default.createElement(k3, {
        value: M,
        onChange: H,
        onSubmit: X,
        focus: !0,
        showCursor: !0,
        placeholder: `e.g., Japanese, 日本語, Español${l1.ellipsis}`,
        columns: 60,
        cursorOffset: $,
        onChangeCursorOffset: O
    })), q[6] = $, q[7] = X, q[8] = M, q[9] = P;
    else P = q[9];
    let W;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) W = N91.default.createElement(V, {
        dimColor: !0
    }, "Leave empty for default (English)"), q[10] = W;
    else W = q[10];
    let G;
    if (q[11] !== P) G = N91.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, D, P, W), q[11] = P, q[12] = G;
    else G = q[12];
    return G
}
// @from(Ln 393736, Col 4)
N91
// @from(Ln 393736, Col 9)
iIA
// @from(Ln 393737, Col 4)
e8q = v(() => {
    i1();
    m1();
    gO();
    b7();
    K7();
    N91 = o(X1(), 1), iIA = o(X1(), 1)
})
// @from(Ln 393746, Col 0)
function AF(A) {
    let q = e(15),
        {
            query: K,
            placeholder: Y,
            isFocused: z,
            isTerminalFocused: w,
            prefix: H,
            width: $,
            cursorOffset: O
        } = A,
        _ = Y === void 0 ? "Search…" : Y,
        J = H === void 0 ? "⌕" : H,
        X = O ?? K.length,
        D = z ? "suggestion" : void 0,
        j = !z,
        M = !z,
        P;
    if (q[0] !== z || q[1] !== w || q[2] !== X || q[3] !== _ || q[4] !== K) P = z ? kj.default.createElement(kj.default.Fragment, null, K ? w ? kj.default.createElement(kj.default.Fragment, null, kj.default.createElement(V, null, K.slice(0, X)), kj.default.createElement(V, {
        inverse: !0
    }, X < K.length ? K[X] : " "), X < K.length && kj.default.createElement(V, null, K.slice(X + 1))) : kj.default.createElement(V, null, K) : w ? kj.default.createElement(kj.default.Fragment, null, kj.default.createElement(V, {
        inverse: !0
    }, _.charAt(0)), kj.default.createElement(V, {
        dimColor: !0
    }, _.slice(1))) : kj.default.createElement(V, {
        dimColor: !0
    }, _)) : K ? kj.default.createElement(V, null, K) : kj.default.createElement(V, null, _), q[0] = z, q[1] = w, q[2] = X, q[3] = _, q[4] = K, q[5] = P;
    else P = q[5];
    let W;
    if (q[6] !== J || q[7] !== M || q[8] !== P) W = kj.default.createElement(V, {
        dimColor: M
    }, J, " ", P), q[6] = J, q[7] = M, q[8] = P, q[9] = W;
    else W = q[9];
    let G;
    if (q[10] !== D || q[11] !== j || q[12] !== W || q[13] !== $) G = kj.default.createElement(I, {
        flexShrink: 0,
        borderStyle: "round",
        borderColor: D,
        borderDimColor: j,
        paddingX: 1,
        width: $
    }, W), q[10] = D, q[11] = j, q[12] = W, q[13] = $, q[14] = G;
    else G = q[14];
    return G
}
// @from(Ln 393791, Col 4)
kj
// @from(Ln 393792, Col 4)
HZ1 = v(() => {
    i1();
    m1();
    kj = o(X1(), 1)
})
// @from(Ln 393798, Col 0)
function _rY(A, q) {
    if (A.ctrl && (q === "k" || q === "u" || q === "w")) return !0;
    if (A.meta && A.backspace) return !0;
    return !1
}
// @from(Ln 393804, Col 0)
function JrY(A, q) {
    return (A.ctrl || A.meta) && q === "y"
}
// @from(Ln 393808, Col 0)
function qF({
    isActive: A,
    onExit: q,
    onExitUp: K,
    columns: Y,
    passthroughCtrlKeys: z = [],
    initialQuery: w = ""
}) {
    let {
        columns: H
    } = Z8(), $ = Y ?? H, [O, _] = Pp1.useState(w), [J, X] = Pp1.useState(w.length), D = Pp1.useCallback((j) => {
        _(j), X(j.length)
    }, []);
    return D8((j, M) => {
        let P = z3.fromText(O, $, J);
        if (M.ctrl && z.includes(j.toLowerCase())) return;
        if (!_rY(M, j)) Nx1();
        if (!JrY(M, j)) Tx1();
        if (M.return || M.downArrow) {
            q();
            return
        }
        if (M.upArrow) {
            if (K) K();
            return
        }
        if (M.escape) {
            if (O.length > 0) _(""), X(0);
            else q();
            return
        }
        if (M.backspace) {
            if (M.meta) {
                let {
                    cursor: G,
                    killed: f
                } = P.deleteWordBefore();
                rU(f, "prepend"), _(G.text), X(G.offset);
                return
            }
            if (O.length === 0) {
                q();
                return
            }
            let W = P.backspace();
            _(W.text), X(W.offset);
            return
        }
        if (M.delete) {
            let W = P.del();
            _(W.text), X(W.offset);
            return
        }
        if (M.leftArrow && (M.ctrl || M.meta || M.fn)) {
            let W = P.prevWord();
            X(W.offset);
            return
        }
        if (M.rightArrow && (M.ctrl || M.meta || M.fn)) {
            let W = P.nextWord();
            X(W.offset);
            return
        }
        if (M.leftArrow) {
            let W = P.left();
            X(W.offset);
            return
        }
        if (M.rightArrow) {
            let W = P.right();
            X(W.offset);
            return
        }
        if (M.home) {
            X(0);
            return
        }
        if (M.end) {
            X(O.length);
            return
        }
        if (M.ctrl) {
            switch (j.toLowerCase()) {
                case "a":
                    X(0);
                    return;
                case "e":
                    X(O.length);
                    return;
                case "b":
                    X(P.left().offset);
                    return;
                case "f":
                    X(P.right().offset);
                    return;
                case "d": {
                    let W = P.del();
                    _(W.text), X(W.offset);
                    return
                }
                case "h": {
                    if (O.length === 0) {
                        q();
                        return
                    }
                    let W = P.backspace();
                    _(W.text), X(W.offset);
                    return
                }
                case "k": {
                    let {
                        cursor: W,
                        killed: G
                    } = P.deleteToLineEnd();
                    rU(G, "append"), _(W.text), X(W.offset);
                    return
                }
                case "u": {
                    let {
                        cursor: W,
                        killed: G
                    } = P.deleteToLineStart();
                    rU(G, "prepend"), _(W.text), X(W.offset);
                    return
                }
                case "w": {
                    let {
                        cursor: W,
                        killed: G
                    } = P.deleteWordBefore();
                    rU(G, "prepend"), _(W.text), X(W.offset);
                    return
                }
                case "y": {
                    let W = u26();
                    if (W.length > 0) {
                        let G = P.offset,
                            f = P.insert(W);
                        B26(G, W.length), _(f.text), X(f.offset)
                    }
                    return
                }
            }
            return
        }
        if (M.meta) {
            switch (j.toLowerCase()) {
                case "b":
                    X(P.prevWord().offset);
                    return;
                case "f":
                    X(P.nextWord().offset);
                    return;
                case "d": {
                    let W = P.deleteWordAfter();
                    _(W.text), X(W.offset);
                    return
                }
                case "y": {
                    let W = m26();
                    if (W) {
                        let {
                            text: G,
                            start: f,
                            length: Z
                        } = W, N = O.slice(0, f), T = O.slice(f + Z), k = N + G + T, y = f + G.length;
                        F26(G.length), _(k), X(y)
                    }
                    return
                }
            }
            return
        }
        if (M.tab) return;
        if (j) {
            let W = P.insert(j);
            _(W.text), X(W.offset)
        }
    }, {
        isActive: A
    }), {
        query: O,
        setQuery: D,
        cursorOffset: J
    }
}
// @from(Ln 393994, Col 4)
Pp1
// @from(Ln 393995, Col 4)
$Z1 = v(() => {
    m1();
    RD1();
    mq();
    Pp1 = o(X1(), 1)
})