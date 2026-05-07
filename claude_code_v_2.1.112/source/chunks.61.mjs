
// @from(Ln 157001, Col 4)
MUq = p((UQO, XUq) => {
    var Ew_ = lO();

    function yw_(q) {
        let K = ["mkdir", "realpath", "stat", "rmdir", "utimes"],
            _ = {
                ...q
            };
        return K.forEach((z) => {
            _[z] = (...Y) => {
                let A = Y.pop(),
                    O;
                try {
                    O = q[`${z}Sync`](...Y)
                } catch (w) {
                    return A(w)
                }
                A(null, O)
            }
        }), _
    }

    function Lw_(q) {
        return (...K) => new Promise((_, z) => {
            K.push((Y, A) => {
                if (Y) z(Y);
                else _(A)
            }), q(...K)
        })
    }

    function hw_(q) {
        return (...K) => {
            let _, z;
            if (K.push((Y, A) => {
                    _ = Y, z = A
                }), q(...K), _) throw _;
            return z
        }
    }

    function Rw_(q) {
        if (q = {
                ...q
            }, q.fs = yw_(q.fs || Ew_), typeof q.retries === "number" && q.retries > 0 || q.retries && typeof q.retries.retries === "number" && q.retries.retries > 0) throw Object.assign(Error("Cannot use retries with the sync api"), {
            code: "ESYNC"
        });
        return q
    }
    XUq.exports = {
        toPromise: Lw_,
        toSync: hw_,
        toSyncOptions: Rw_
    }
})
// @from(Ln 157056, Col 4)
WUq = p((QQO, K46) => {
    var Tk6 = JUq(),
        {
            toPromise: LV8,
            toSync: hV8,
            toSyncOptions: bR1
        } = MUq();
    async function PUq(q, K) {
        let _ = await LV8(Tk6.lock)(q, K);
        return LV8(_)
    }

    function Sw_(q, K) {
        let _ = hV8(Tk6.lock)(q, bR1(K));
        return hV8(_)
    }

    function Cw_(q, K) {
        return LV8(Tk6.unlock)(q, K)
    }

    function bw_(q, K) {
        return hV8(Tk6.unlock)(q, bR1(K))
    }

    function Iw_(q, K) {
        return LV8(Tk6.check)(q, K)
    }

    function xw_(q, K) {
        return hV8(Tk6.check)(q, bR1(K))
    }
    K46.exports = PUq;
    K46.exports.lock = PUq;
    K46.exports.unlock = Cw_;
    K46.exports.lockSync = Sw_;
    K46.exports.unlockSync = bw_;
    K46.exports.check = Iw_;
    K46.exports.checkSync = xw_
})
// @from(Ln 157097, Col 0)
function xR1() {
    if (!IR1) IR1 = WUq();
    return IR1
}
// @from(Ln 157101, Col 0)
async function Jj(q, K) {
    let _ = await xR1().lock(q, K);
    return Object.assign(_, {
        [Symbol.asyncDispose]: _
    })
}
// @from(Ln 157108, Col 0)
function DUq(q, K) {
    let _ = xR1().lockSync(q, K);
    return Object.assign(_, {
        [Symbol.dispose]: _
    })
}
// @from(Ln 157115, Col 0)
function ZUq(q, K) {
    return xR1().check(q, K)
}
// @from(Ln 157118, Col 4)
IR1
// @from(Ln 157120, Col 0)
function fUq(q, K) {
    return {
        name: `${q.name}-with-${K.name}-fallback`,
        read() {
            let _ = q.read();
            if (_ !== null && _ !== void 0) return _;
            return K.read() || {}
        },
        async readAsync() {
            let _ = await q.readAsync();
            if (_ !== null && _ !== void 0) return _;
            return await K.readAsync() || {}
        },
        update(_) {
            let z = q.read(),
                Y = q.update(_);
            if (Y.success) {
                if (z === null) K.delete();
                return Y
            }
            let A = K.update(_);
            if (A.success) {
                if (z !== null) q.delete();
                return {
                    success: !0,
                    warning: A.warning
                }
            }
            return {
                success: !1
            }
        },
        delete() {
            let _ = q.delete(),
                z = K.delete();
            return _ || z
        }
    }
}
// @from(Ln 157159, Col 0)
async function mw_() {
    try {
        let q = Fh(sO6),
            K = _B(),
            {
                stdout: _,
                code: z
            } = await w1("security", ["find-generic-password", "-a", K, "-w", "-s", q], {
                useCwd: !1,
                preserveOutputOnError: !1
            });
        if (z === 0 && _) return n8(_.trim())
    } catch (q) {}
    return null
}
// @from(Ln 157175, Col 0)
function vUq() {
    if (Vk6 !== void 0) return Vk6;
    if (process.platform !== "darwin") return Vk6 = !1, !1;
    try {
        Vk6 = mJ8("security", ["show-keychain-info"], {
            reject: !1,
            stdio: ["ignore", "pipe", "pipe"]
        }).exitCode === 36
    } catch {
        Vk6 = !1
    }
    return Vk6
}
// @from(Ln 157188, Col 4)
uw_ = 4032
// @from(Ln 157189, Col 4)
GUq
// @from(Ln 157189, Col 9)
Vk6
// @from(Ln 157190, Col 4)
uR1 = L(() => {
    K8();
    Q4();
    GA1();
    NV();
    e8();
    r76();
    GUq = {
        name: "keychain",
        read() {
            let q = IW.cache;
            if (Date.now() - q.cachedAt < of1) return q.data;
            try {
                let K = Fh(sO6),
                    _ = _B(),
                    z = oC(`security find-generic-password -a "${_}" -w -s "${K}"`);
                if (z) {
                    let Y = n8(z);
                    return IW.cache = {
                        data: Y,
                        cachedAt: Date.now()
                    }, Y
                }
            } catch (K) {}
            if (q.data !== null) return E("[keychain] read failed; serving stale cache", {
                level: "warn"
            }), IW.cache = {
                data: q.data,
                cachedAt: Date.now()
            }, q.data;
            return IW.cache = {
                data: null,
                cachedAt: Date.now()
            }, null
        },
        async readAsync() {
            let q = IW.cache;
            if (Date.now() - q.cachedAt < of1) return q.data;
            if (IW.readInFlight) return IW.readInFlight;
            let K = IW.generation,
                _ = mw_().then((z) => {
                    if (K === IW.generation) {
                        if (z === null && q.data !== null) E("[keychain] readAsync failed; serving stale cache", {
                            level: "warn"
                        });
                        let Y = z ?? q.data;
                        return IW.cache = {
                            data: Y,
                            cachedAt: Date.now()
                        }, IW.readInFlight = null, Y
                    }
                    return z
                });
            return IW.readInFlight = _, _
        },
        update(q) {
            TE();
            try {
                let K = Fh(sO6),
                    _ = _B(),
                    z = I6(q),
                    Y = Buffer.from(z, "utf-8").toString("hex"),
                    A = `add-generic-password -U -a "${_}" -s "${K}" -X "${Y}"
`,
                    O;
                if (A.length <= uw_) O = mJ8("security", ["-i"], {
                    input: A,
                    stdio: ["pipe", "pipe", "pipe"],
                    reject: !1
                });
                else E(`Keychain payload (${z.length}B JSON) exceeds security -i stdin limit; using argv`, {
                    level: "warn"
                }), O = mJ8("security", ["add-generic-password", "-U", "-a", _, "-s", K, "-X", Y], {
                    stdio: ["ignore", "pipe", "pipe"],
                    reject: !1
                });
                if (O.exitCode !== 0) return {
                    success: !1
                };
                return IW.cache = {
                    data: q,
                    cachedAt: Date.now()
                }, {
                    success: !0
                }
            } catch (K) {
                return {
                    success: !1
                }
            }
        },
        delete() {
            TE();
            try {
                let q = Fh(sO6),
                    K = _B();
                return oC(`security delete-generic-password -a "${K}" -s "${q}"`), !0
            } catch (q) {
                return !1
            }
        }
    }
})
// @from(Ln 157300, Col 0)
function RV8() {
    let q = A7(),
        K = ".credentials.json";
    return {
        storageDir: q,
        storagePath: pw_(q, ".credentials.json")
    }
}
// @from(Ln 157308, Col 4)
mR1
// @from(Ln 157309, Col 4)
TUq = L(() => {
    Q8();
    m8();
    Yq();
    e8();
    mR1 = {
        name: "plaintext",
        read() {
            let {
                storagePath: q
            } = RV8();
            try {
                let K = V8().readFileSync(q, {
                    encoding: "utf8"
                });
                return n8(K)
            } catch {
                return null
            }
        },
        async readAsync() {
            let {
                storagePath: q
            } = RV8();
            try {
                let K = await V8().readFile(q, {
                    encoding: "utf8"
                });
                return n8(K)
            } catch {
                return null
            }
        },
        update(q) {
            try {
                let {
                    storageDir: K,
                    storagePath: _
                } = RV8();
                try {
                    V8().mkdirSync(K)
                } catch (z) {
                    if (Q1(z) !== "EEXIST") throw z
                }
                return aJ(_, I6(q), {
                    encoding: "utf8",
                    flush: !1
                }), Bw_(_, 384), {
                    success: !0,
                    warning: "Warning: Storing credentials in plaintext."
                }
            } catch {
                return {
                    success: !1
                }
            }
        },
        delete() {
            let {
                storagePath: q
            } = RV8();
            try {
                return V8().unlinkSync(q), !0
            } catch (K) {
                if (Q1(K) === "ENOENT") return !0;
                return !1
            }
        }
    }
})
// @from(Ln 157380, Col 0)
function t3() {
    if (process.platform === "darwin") return fUq(GUq, mR1);
    return mR1
}
// @from(Ln 157384, Col 4)
_46 = L(() => {
    uR1();
    TUq()
})
// @from(Ln 157392, Col 0)
function VUq(q) {
    return new Promise((K) => {
        Fw_("security", ["find-generic-password", "-a", _B(), "-w", "-s", q], {
            encoding: "utf-8",
            timeout: gw_
        }, (_, z) => {
            K({
                stdout: _ ? null : z?.trim() || null,
                timedOut: Boolean(_ && "killed" in _ && _.killed)
            })
        })
    })
}
// @from(Ln 157406, Col 0)
function kUq() {
    if (process.platform !== "darwin" || SV8 || S9()) return;
    let q = VUq(Fh(sO6)),
        K = VUq(Fh());
    SV8 = Promise.all([q, K]).then(([_, z]) => {
        if (!_.timedOut) vMq(_.stdout);
        if (!z.timedOut) BR1 = {
            stdout: z.stdout
        }
    })
}
// @from(Ln 157417, Col 0)
async function NUq() {
    if (SV8) await SV8
}
// @from(Ln 157421, Col 0)
function EUq() {
    return BR1
}
// @from(Ln 157425, Col 0)
function pR1() {
    BR1 = null
}
// @from(Ln 157428, Col 4)
gw_ = 1e4
// @from(Ln 157429, Col 4)
BR1 = null
// @from(Ln 157430, Col 4)
SV8 = null
// @from(Ln 157431, Col 4)
FR1 = L(() => {
    Q8();
    r76()
})
// @from(Ln 157435, Col 4)
yUq = {}
// @from(Ln 157441, Col 0)
function l7(q, K, _) {
    return new Promise((z, Y) => {
        if (K?.aborted) {
            if (_?.throwOnAbort || _?.abortError) Y(_.abortError?.() ?? Error("aborted"));
            else z();
            return
        }
        let A = setTimeout((w, $, j) => {
            w?.removeEventListener("abort", $), j()
        }, q, K, O, z);

        function O() {
            if (clearTimeout(A), _?.throwOnAbort || _?.abortError) Y(_.abortError?.() ?? Error("aborted"));
            else z()
        }
        if (K?.addEventListener("abort", O, {
                once: !0
            }), _?.unref) A.unref()
    })
}
// @from(Ln 157462, Col 0)
function Uw_(q, K) {
    q(Error(K))
}
// @from(Ln 157466, Col 0)
function aQ(q, K, _) {
    let z, Y = new Promise((A, O) => {
        if (z = setTimeout(Uw_, K, O, _), typeof z === "object") z.unref?.()
    });
    return Promise.race([q, Y]).finally(() => {
        if (z !== void 0) clearTimeout(z)
    })
}
// @from(Ln 157475, Col 0)
function hUq() {
    return LUq
}
// @from(Ln 157479, Col 0)
function CV8() {
    LUq.clear()
}
// @from(Ln 157482, Col 4)
LUq
// @from(Ln 157483, Col 4)
bV8 = L(() => {
    LUq = new Map
})
// @from(Ln 157486, Col 4)
zR = {}
// @from(Ln 157555, Col 0)
function xV8() {
    return S6(process.env.CLAUDE_CODE_REMOTE) || process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop"
}
// @from(Ln 157559, Col 0)
function jX() {
    if (S9()) return !1;
    if (process.env.ANTHROPIC_UNIX_SOCKET) return !!process.env.CLAUDE_CODE_OAUTH_TOKEN;
    let q = S6(process.env.CLAUDE_CODE_USE_BEDROCK) || S6(process.env.CLAUDE_CODE_USE_VERTEX) || S6(process.env.CLAUDE_CODE_USE_FOUNDRY) || S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) || S6(process.env.CLAUDE_CODE_USE_MANTLE),
        _ = (y7() || {}).apiKeyHelper,
        z = process.env.ANTHROPIC_AUTH_TOKEN || _ || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
        {
            source: Y
        } = Vw({
            skipRetrievingKeyFromApiKeyHelper: !0
        }),
        A = Y === "ANTHROPIC_API_KEY" || Y === "apiKeyHelper";
    return !(q || z && !xV8() || A && !xV8())
}
// @from(Ln 157574, Col 0)
function xb() {
    if (S9()) {
        if (sQ()) return {
            source: "apiKeyHelper",
            hasToken: !0
        };
        return {
            source: "none",
            hasToken: !1
        }
    }
    if (process.env.ANTHROPIC_AUTH_TOKEN && !xV8()) return {
        source: "ANTHROPIC_AUTH_TOKEN",
        hasToken: !0
    };
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
        source: "CLAUDE_CODE_OAUTH_TOKEN",
        hasToken: !0
    };
    if (HZ8()) {
        if (process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) return {
            source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
            hasToken: !0
        };
        return {
            source: "CCR_OAUTH_TOKEN_FILE",
            hasToken: !0
        }
    }
    if (sQ() && !xV8()) return {
        source: "apiKeyHelper",
        hasToken: !0
    };
    let _ = o7();
    if (ub(_?.scopes) && _?.accessToken) return {
        source: "claude.ai",
        hasToken: !0
    };
    return {
        source: "none",
        hasToken: !1
    }
}
// @from(Ln 157618, Col 0)
function FV() {
    let {
        key: q
    } = Vw();
    return q
}
// @from(Ln 157625, Col 0)
function cR1() {
    let {
        key: q,
        source: K
    } = Vw({
        skipRetrievingKeyFromApiKeyHelper: !0
    });
    return q !== null && K !== "none"
}
// @from(Ln 157635, Col 0)
function Vw(q = {}) {
    if (S9()) {
        if (process.env.ANTHROPIC_API_KEY) return {
            key: process.env.ANTHROPIC_API_KEY,
            source: "ANTHROPIC_API_KEY"
        };
        if (sQ()) return {
            key: q.skipRetrievingKeyFromApiKeyHelper ? null : UR1(),
            source: "apiKeyHelper"
        };
        return {
            key: null,
            source: "none"
        }
    }
    let K = CZ() ? void 0 : process.env.ANTHROPIC_API_KEY;
    if (tB6() && K) return {
        key: K,
        source: "ANTHROPIC_API_KEY"
    };
    if (S6(!1)) {
        let A = if1();
        if (A) return {
            key: A,
            source: "ANTHROPIC_API_KEY"
        };
        if (!K && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
        if (K) return {
            key: K,
            source: "ANTHROPIC_API_KEY"
        };
        return {
            key: null,
            source: "none"
        }
    }
    if (K && H8().customApiKeyResponses?.approved?.includes(VE(K))) return {
        key: K,
        source: "ANTHROPIC_API_KEY"
    };
    let _ = if1();
    if (_) return {
        key: _,
        source: "ANTHROPIC_API_KEY"
    };
    if (sQ()) {
        if (q.skipRetrievingKeyFromApiKeyHelper) return {
            key: null,
            source: "apiKeyHelper"
        };
        return {
            key: UR1(),
            source: "apiKeyHelper"
        }
    }
    let Y = Ek6();
    if (Y) return Y;
    return {
        key: null,
        source: "none"
    }
}
// @from(Ln 157698, Col 0)
function sQ() {
    if (S9()) return E1("flagSettings")?.apiKeyHelper;
    return (y7() || {}).apiKeyHelper
}
// @from(Ln 157703, Col 0)
function IUq() {
    let q = sQ();
    if (!q) return !1;
    let K = E1("projectSettings"),
        _ = E1("localSettings");
    return K?.apiKeyHelper === q || _?.apiKeyHelper === q
}
// @from(Ln 157711, Col 0)
function lR1() {
    return (y7() || {}).awsAuthRefresh
}
// @from(Ln 157715, Col 0)
function nR1() {
    let q = lR1();
    if (!q) return !1;
    let K = E1("projectSettings"),
        _ = E1("localSettings");
    return K?.awsAuthRefresh === q || _?.awsAuthRefresh === q
}
// @from(Ln 157723, Col 0)
function iR1() {
    return (y7() || {}).awsCredentialExport
}
// @from(Ln 157727, Col 0)
function rR1() {
    let q = iR1();
    if (!q) return !1;
    let K = E1("projectSettings"),
        _ = E1("localSettings");
    return K?.awsCredentialExport === q || _?.awsCredentialExport === q
}
// @from(Ln 157735, Col 0)
function xUq() {
    let q = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!Number.isNaN(K) && K >= 0) return K;
        E(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${q}`, {
            level: "error"
        })
    }
    return lw_
}
// @from(Ln 157747, Col 0)
function oR1() {
    let q = Xa?.startedAt;
    return q ? Date.now() - q : 0
}
// @from(Ln 157751, Col 0)
async function Wk6(q) {
    if (!sQ()) return null;
    let K = xUq();
    if (_R) {
        if (Date.now() - _R.timestamp < K) return _R.value;
        if (!Xa) Xa = {
            promise: RUq(q, !1, kk6),
            startedAt: null
        };
        return _R.value
    }
    if (Xa) return Xa.promise;
    return Xa = {
        promise: RUq(q, !0, kk6),
        startedAt: Date.now()
    }, Xa.promise
}
// @from(Ln 157768, Col 0)
async function RUq(q, K, _) {
    try {
        let z = await nw_(q);
        if (_ !== kk6) return z;
        if (z !== null) _R = {
            value: z,
            timestamp: Date.now()
        };
        return z
    } catch (z) {
        if (_ !== kk6) return " ";
        let Y = z instanceof Error ? z.message : String(z);
        if (console.error(Y8.red(`apiKeyHelper failed: ${Y}`)), E(`Error getting API key from apiKeyHelper: ${Y}`, {
                level: "error"
            }), !K && _R && _R.value !== " ") return _R = {
            ..._R,
            timestamp: Date.now()
        }, _R.value;
        return _R = {
            value: " ",
            timestamp: Date.now()
        }, " "
    } finally {
        if (_ === kk6) Xa = null
    }
}
// @from(Ln 157794, Col 0)
async function nw_(q) {
    let K = sQ();
    if (!K) return null;
    if (IUq()) {
        if (!EA() && !q) {
            let A = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.FEEDBACK_CHANNEL}.`);
            return Kh("apiKeyHelper invoked before trust check", A), d("tengu_apiKeyHelper_missing_trust11", {}), null
        }
    }
    let _ = await ij(K, {
        timeout: 600000,
        reject: !1
    });
    if (_.failed) {
        let Y = _.timedOut ? "timed out" : `exited ${_.exitCode}`,
            A = _.stderr?.trim();
        throw Error(A ? `${Y}: ${A}` : Y)
    }
    let z = _.stdout?.trim();
    if (!z) throw Error("did not return a value");
    return z
}
// @from(Ln 157817, Col 0)
function UR1() {
    return _R?.value ?? null
}
// @from(Ln 157821, Col 0)
function Vo6() {
    kk6++, _R = null, Xa = null
}
// @from(Ln 157825, Col 0)
function aR1(q) {
    if (IUq() && !EA()) return;
    Wk6(q)
}
// @from(Ln 157829, Col 0)
async function rw_() {
    let q = lR1();
    if (!q) return !1;
    if (nR1()) {
        if (!EA() && !I7()) {
            let _ = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.FEEDBACK_CHANNEL}.`);
            return Kh("awsAuthRefresh invoked before trust check", _), d("tengu_awsAuthRefresh_missing_trust", {}), !1
        }
    }
    try {
        return E("Fetching AWS caller identity for AWS auth refresh command"), await gv1(), E("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
    } catch {
        return uUq(q)
    }
}
// @from(Ln 157845, Col 0)
function uUq(q) {
    E("Running AWS auth refresh command");
    let K = wD.getInstance();
    return K.startAuthentication(), new Promise((_) => {
        let z = bUq(q, {
            timeout: ow_
        });
        z.stdout.on("data", (Y) => {
            let A = Y.toString().trim();
            if (A) K.addOutput(A), E(A, {
                level: "debug"
            })
        }), z.stderr.on("data", (Y) => {
            let A = Y.toString().trim();
            if (A) K.setError(A), E(A, {
                level: "error"
            })
        }), z.on("close", (Y, A) => {
            if (Y === 0) E("AWS auth refresh completed successfully"), K.endAuthentication(!0), _(!0);
            else {
                let w = A === "SIGTERM" ? Y8.red("AWS auth refresh timed out after 3 minutes. Run your auth command manually in a separate terminal.") : Y8.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
                console.error(w), K.endAuthentication(!1), _(!1)
            }
        })
    })
}
// @from(Ln 157871, Col 0)
async function aw_() {
    let q = iR1();
    if (!q) return null;
    if (rR1()) {
        if (!EA() && !I7()) {
            let _ = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.FEEDBACK_CHANNEL}.`);
            return Kh("awsCredentialExport invoked before trust check", _), d("tengu_awsCredentialExport_missing_trust", {}), null
        }
    }
    try {
        return E("Fetching AWS caller identity for credential export command"), await gv1(), E("Fetched AWS caller identity, skipping AWS credential export command"), null
    } catch {
        try {
            E("Running AWS credential export command");
            let K = await ij(q, {
                reject: !1
            });
            if (K.exitCode !== 0 || !K.stdout) throw Error("awsCredentialExport did not return a valid value");
            let _ = n8(K.stdout.trim());
            if (!DZq(_)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
            return E("AWS credentials retrieved from awsCredentialExport"), {
                accessKeyId: _.Credentials.AccessKeyId,
                secretAccessKey: _.Credentials.SecretAccessKey,
                sessionToken: _.Credentials.SessionToken
            }
        } catch (K) {
            let _ = Y8.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
            if (K instanceof Error) console.error(_, K.message);
            else console.error(_, K);
            return null
        }
    }
}
// @from(Ln 157905, Col 0)
function ko6() {
    bb.cache.clear()
}
// @from(Ln 157909, Col 0)
function sR1() {
    return (y7() || {}).gcpAuthRefresh
}
// @from(Ln 157913, Col 0)
function tR1() {
    let q = sR1();
    if (!q) return !1;
    let K = E1("projectSettings"),
        _ = E1("localSettings");
    return K?.gcpAuthRefresh === q || _?.gcpAuthRefresh === q
}
// @from(Ln 157920, Col 0)
async function mUq() {
    try {
        let {
            GoogleAuth: q
        } = await Promise.resolve().then(() => K6(AV8(), 1)), K = new q({
            scopes: ["https://www.googleapis.com/auth/cloud-platform"]
        }), _ = (async () => {
            await (await K.getClient()).getAccessToken()
        })(), z = l7(sw_).then(() => {
            throw new UUq("GCP credentials check timed out")
        });
        return await Promise.race([_, z]), !0
    } catch {
        return !1
    }
}
// @from(Ln 157936, Col 0)
async function ew_() {
    let q = sR1();
    if (!q) return !1;
    if (tR1()) {
        if (!EA() && !I7()) {
            let _ = Error(`Security: gcpAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.FEEDBACK_CHANNEL}.`);
            return Kh("gcpAuthRefresh invoked before trust check", _), d("tengu_gcpAuthRefresh_missing_trust", {}), !1
        }
    }
    try {
        if (E("Checking GCP credentials validity for auth refresh"), await mUq()) return E("GCP credentials are valid, skipping auth refresh command"), !1
    } catch {}
    return BUq(q)
}
// @from(Ln 157951, Col 0)
function BUq(q) {
    E("Running GCP auth refresh command");
    let K = wD.getInstance();
    return K.startAuthentication(), new Promise((_) => {
        let z = bUq(q, {
            timeout: q2_
        });
        z.stdout.on("data", (Y) => {
            let A = Y.toString().trim();
            if (A) K.addOutput(A), E(A, {
                level: "debug"
            })
        }), z.stderr.on("data", (Y) => {
            let A = Y.toString().trim();
            if (A) K.setError(A), E(A, {
                level: "error"
            })
        }), z.on("close", (Y, A) => {
            if (Y === 0) E("GCP auth refresh completed successfully"), K.endAuthentication(!0), _(!0);
            else {
                let w = A === "SIGTERM" ? Y8.red("GCP auth refresh timed out after 3 minutes. Run your auth command manually in a separate terminal.") : Y8.red("Error running gcpAuthRefresh (in settings or ~/.claude.json):");
                console.error(w), K.endAuthentication(!1), _(!1)
            }
        })
    })
}
// @from(Ln 157978, Col 0)
function No6() {
    h26.cache.clear()
}
// @from(Ln 157982, Col 0)
function eR1() {
    if (!sR1()) return;
    if (tR1()) {
        if (!EA() && !I7()) return
    }
    h26()
}
// @from(Ln 157990, Col 0)
function uV8() {
    let q = lR1(),
        K = iR1();
    if (!q && !K) return;
    if (nR1() || rR1()) {
        if (!EA() && !I7()) return
    }
    bb(), ZO()
}
// @from(Ln 158000, Col 0)
function K2_(q) {
    return /^[a-zA-Z0-9-_]+$/.test(q)
}
// @from(Ln 158003, Col 0)
async function lf1(q) {
    if (!K2_(q)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
    await pUq();
    let K = process.platform === "darwin";
    if (K) {
        let z = Fh(),
            Y = _B(),
            A = Buffer.from(q, "utf-8").toString("hex"),
            O = `add-generic-password -U -a "${Y}" -s "${z}" -X "${A}"
`,
            w = await Xh("security", ["-i"], {
                input: O,
                reject: !1,
                timeout: 5000
            });
        if (w.exitCode !== 0) {
            let $ = (w.stderr || w.stdout || "").trim().replace(/\s*\n\s*/g, "; ");
            throw d("tengu_api_key_keychain_error", {
                error: $
            }), Error(`Failed to save API key to macOS Keychain${$?` (${$})`:""}. Run \`claude doctor\` to diagnose keychain access.`)
        }
        d("tengu_api_key_saved_to_keychain", {})
    } else d("tengu_api_key_saved_to_config", {});
    let _ = VE(q);
    d8((z) => {
        let Y = z.customApiKeyResponses?.approved ?? [];
        return {
            ...z,
            primaryApiKey: K ? z.primaryApiKey : q,
            customApiKeyResponses: {
                ...z.customApiKeyResponses,
                approved: Y.includes(_) ? Y : [...Y, _],
                rejected: z.customApiKeyResponses?.rejected ?? []
            }
        }
    }), Ek6.cache.clear?.(), pR1()
}
// @from(Ln 158041, Col 0)
function _2_(q) {
    let K = H8(),
        _ = VE(q);
    return K.customApiKeyResponses?.approved?.includes(_) ?? !1
}
// @from(Ln 158046, Col 0)
async function qS1() {
    await pUq(), d8((q) => ({
        ...q,
        primaryApiKey: void 0
    })), Ek6.cache.clear?.(), pR1()
}
// @from(Ln 158052, Col 0)
async function pUq() {
    try {
        await TMq()
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 158060, Col 0)
function yk6(q) {
    if (!ub(q.scopes)) return d("tengu_oauth_tokens_not_claude_ai", {}), {
        success: !0
    };
    if (!q.refreshToken || !q.expiresAt) return d("tengu_oauth_tokens_inference_only", {}), {
        success: !0
    };
    let K = t3(),
        _ = K.name;
    try {
        let z = K.read() || {},
            Y = z.claudeAiOauth;
        z.claudeAiOauth = {
            accessToken: q.accessToken,
            refreshToken: q.refreshToken,
            expiresAt: q.expiresAt,
            scopes: q.scopes,
            subscriptionType: q.subscriptionType ?? Y?.subscriptionType ?? null,
            rateLimitTier: q.rateLimitTier ?? Y?.rateLimitTier ?? null
        };
        let A = K.update(z);
        if (A.success) d("tengu_oauth_tokens_saved", {
            storageBackend: _
        });
        else d("tengu_oauth_tokens_save_failed", {
            storageBackend: _
        });
        return o7.cache?.clear?.(), ZV8(), CV8(), A
    } catch (z) {
        return j6(z), d("tengu_oauth_tokens_save_exception", {
            storageBackend: _,
            error: b6(z)
        }), {
            success: !1,
            warning: "Failed to save OAuth tokens"
        }
    }
}
// @from(Ln 158099, Col 0)
function Nk6() {
    o7.cache?.clear?.(), TE()
}
// @from(Ln 158102, Col 0)
async function z2_() {
    try {
        let {
            mtimeMs: q
        } = await dw_(cw_(A7(), ".credentials.json"));
        if (q !== SUq) SUq = q, Nk6()
    } catch {
        o7.cache?.clear?.()
    }
}
// @from(Ln 158113, Col 0)
function $B(q) {
    let K = gR1.get(q);
    if (K) return K;
    let _ = Y2_(q).finally(() => {
        gR1.delete(q)
    });
    return gR1.set(q, _), _
}
// @from(Ln 158121, Col 0)
async function Y2_(q) {
    Nk6();
    let K = await To6();
    if (!K?.refreshToken) {
        let _ = TD6();
        if (_) try {
            let z = await _();
            if (z && z !== q) return process.env.CLAUDE_CODE_OAUTH_TOKEN = z, Nk6(), d("tengu_oauth_401_sdk_callback_refreshed", {}), !0;
            E(z === null ? "SDK getOAuthToken callback returned null (no token available)" : "SDK getOAuthToken callback returned the same expired token; treating as no refresh", {
                level: z === null ? "debug" : "error"
            })
        } catch (z) {
            E(`SDK getOAuthToken callback failed: ${z instanceof Error?z.message:String(z)}`, {
                level: "error"
            })
        }
        return !1
    }
    if (K.accessToken !== q) return d("tengu_oauth_401_recovered_from_keychain", {}), !0;
    return _Y(0, !0)
}
// @from(Ln 158142, Col 0)
async function To6() {
    if (S9()) return null;
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN || HZ8()) return o7();
    try {
        let _ = (await t3().readAsync())?.claudeAiOauth;
        if (!_?.accessToken) return null;
        return _
    } catch (q) {
        return j6(q), null
    }
}
// @from(Ln 158154, Col 0)
function _Y(q = 0, K = !1) {
    if (q === 0 && !K) {
        if (vo6) return vo6;
        return vo6 = QR1(q, K).finally(() => {
            vo6 = null
        }), vo6
    }
    return QR1(q, K)
}
// @from(Ln 158163, Col 0)
async function QR1(q, K) {
    await z2_();
    let z = o7();
    if (!K) {
        if (!z?.refreshToken || !XQ(z.expiresAt)) return !1
    }
    if (!z?.refreshToken) return !1;
    if (!ub(z.scopes)) return !1;
    o7.cache?.clear?.(), TE();
    let Y = await To6();
    if (!Y?.refreshToken || !XQ(Y.expiresAt)) return !1;
    let A = A7();
    await Qw_(A, {
        recursive: !0
    });
    let O;
    try {
        d("tengu_oauth_token_refresh_lock_acquiring", {}), O = await Jj(A), d("tengu_oauth_token_refresh_lock_acquired", {})
    } catch (w) {
        if (w.code === "ELOCKED") {
            if (q < 5) return d("tengu_oauth_token_refresh_lock_retry", {
                retryCount: q + 1
            }), await l7(1000 + Math.random() * 1000), QR1(q + 1, K);
            return d("tengu_oauth_token_refresh_lock_retry_limit_reached", {
                maxRetries: 5
            }), !1
        }
        return j6(w), d("tengu_oauth_token_refresh_lock_error", {
            error: b6(w)
        }), !1
    }
    try {
        o7.cache?.clear?.(), TE();
        let w = await To6();
        if (!w?.refreshToken || !XQ(w.expiresAt)) return d("tengu_oauth_token_refresh_race_resolved", {}), !1;
        d("tengu_oauth_token_refresh_starting", {});
        let $ = await ll6(w.refreshToken, {
            scopes: ub(w.scopes) ? void 0 : w.scopes
        });
        return yk6($), o7.cache?.clear?.(), TE(), !0
    } catch (w) {
        j6(w), o7.cache?.clear?.(), TE();
        let $ = await To6();
        if ($ && !XQ($.expiresAt)) return d("tengu_oauth_token_refresh_race_recovered", {}), !0;
        return !1
    } finally {
        d("tengu_oauth_token_refresh_lock_releasing", {}), await O(), d("tengu_oauth_token_refresh_lock_released", {})
    }
}
// @from(Ln 158213, Col 0)
function i7() {
    if (!jX()) return !1;
    return ub(o7()?.scopes)
}
// @from(Ln 158218, Col 0)
function AD() {
    return o7()?.scopes?.includes(fA6) ?? !1
}
// @from(Ln 158222, Col 0)
function x26() {
    if (S6(process.env.CLAUDE_CODE_USE_BEDROCK) || S6(process.env.CLAUDE_CODE_USE_VERTEX) || S6(process.env.CLAUDE_CODE_USE_FOUNDRY) || S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) || S6(process.env.CLAUDE_CODE_USE_MANTLE)) return !1;
    if (i7()) return !1;
    return !0
}
// @from(Ln 158228, Col 0)
function k_() {
    return jX() ? H8().oauthAccount : void 0
}
// @from(Ln 158232, Col 0)
function Lk6() {
    let K = k_()?.billingType;
    if (!i7() || !K) return !1;
    if (K !== "stripe_subscription" && K !== "stripe_subscription_contracted" && K !== "apple_subscription" && K !== "google_play_subscription") return !1;
    return !0
}
// @from(Ln 158239, Col 0)
function A2_() {
    let q = MK();
    return q === "max" || q === "enterprise" || q === "team" || q === "pro" || q === null
}
// @from(Ln 158244, Col 0)
function MK() {
    if (DMq()) return WMq();
    if (!jX()) return null;
    let q = o7();
    if (!q) return null;
    return q.subscriptionType ?? null
}
// @from(Ln 158252, Col 0)
function ch() {
    return MK() === "max"
}
// @from(Ln 158256, Col 0)
function O2_() {
    return MK() === "team"
}
// @from(Ln 158260, Col 0)
function Yq6() {
    return MK() === "team" && tQ() === "default_claude_max_5x"
}
// @from(Ln 158264, Col 0)
function mV8() {
    return MK() === "enterprise"
}
// @from(Ln 158268, Col 0)
function JB() {
    return MK() === "pro"
}
// @from(Ln 158272, Col 0)
function tQ() {
    let q = PMq();
    if (q !== null) return q;
    if (!jX()) return null;
    let K = o7();
    if (!K) return null;
    return K.rateLimitTier ?? null
}
// @from(Ln 158281, Col 0)
function BV8() {
    switch (MK()) {
        case "enterprise":
            return "Claude Enterprise";
        case "team":
            return "Claude Team";
        case "max":
            return "Claude Max";
        case "pro":
            return "Claude Pro";
        default:
            return "Claude API"
    }
}
// @from(Ln 158296, Col 0)
function z46() {
    return !!(S6(process.env.CLAUDE_CODE_USE_BEDROCK) || S6(process.env.CLAUDE_CODE_USE_VERTEX) || S6(process.env.CLAUDE_CODE_USE_FOUNDRY) || S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) || S6(process.env.CLAUDE_CODE_USE_MANTLE))
}
// @from(Ln 158300, Col 0)
function FUq() {
    return (y7() || {}).otelHeadersHelper
}
// @from(Ln 158304, Col 0)
function gUq() {
    let q = FUq();
    if (!q) return !1;
    let K = E1("projectSettings"),
        _ = E1("localSettings");
    return K?.otelHeadersHelper === q || _?.otelHeadersHelper === q
}
// @from(Ln 158312, Col 0)
function KS1() {
    let q = FUq();
    if (!q) return {};
    let K = parseInt(process.env.CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS || w2_.toString());
    if (IV8 && Date.now() - CUq < K) return IV8;
    if (gUq()) {
        if (!EA()) return {}
    }
    try {
        let _ = oC(q, {
            timeout: 30000
        })?.toString().trim();
        if (!_) throw Error("otelHeadersHelper did not return a valid value");
        let z = n8(_);
        if (typeof z !== "object" || z === null || Array.isArray(z)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
        for (let [Y, A] of Object.entries(z))
            if (typeof A !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${Y}": ${typeof A}`);
        return IV8 = z, CUq = Date.now(), IV8
    } catch (_) {
        throw j6(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${b6(_)}`)), _
    }
}
// @from(Ln 158335, Col 0)
function $2_(q) {
    return q === "max" || q === "pro"
}
// @from(Ln 158339, Col 0)
function u26() {
    let q = MK();
    return i7() && q !== null && $2_(q)
}
// @from(Ln 158344, Col 0)
function hk6() {
    if (pq() !== "firstParty") return;
    let {
        source: K
    } = xb(), _ = {};
    if (K === "CLAUDE_CODE_OAUTH_TOKEN" || K === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR") _.tokenSource = K;
    else if (i7()) _.subscription = BV8();
    else _.tokenSource = K;
    let {
        key: z,
        source: Y
    } = Vw();
    if (z) _.apiKeySource = Y;
    if (K === "claude.ai" || Y === "/login managed key") {
        let O = k_()?.organizationName;
        if (O) _.organization = O
    }
    let A = k_()?.emailAddress;
    if ((K === "claude.ai" || Y === "/login managed key") && A) _.email = A;
    return _
}
// @from(Ln 158365, Col 0)
async function Ma() {
    if (process.env.ANTHROPIC_UNIX_SOCKET) return {
        valid: !0
    };
    if (!jX()) return {
        valid: !0
    };
    let q = E1("policySettings")?.forceLoginOrgUUID;
    if (q === void 0) return {
        valid: !0
    };
    let K = typeof q === "string" ? [q] : q;
    if (K.length === 0) return {
        valid: !1,
        message: `forceLoginOrgUUID in managed settings is set to an empty array.
No organizations are permitted. This is almost certainly a misconfiguration.
Contact your administrator.`
    };
    let _ = K.length === 1 ? `organization ${K[0]}` : `one of these organizations: ${K.join(", ")}`;
    await _Y();
    let z = o7();
    if (!z) return {
        valid: !0
    };
    let {
        source: Y
    } = xb(), A = Y === "CLAUDE_CODE_OAUTH_TOKEN" || Y === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR", O = await JQ(z.accessToken);
    if (!O) return {
        valid: !1,
        message: `Unable to verify organization for the current authentication token.
This machine requires ${_} but the profile could not be fetched.
This may be a network error, or the token may lack the user:profile scope required for
verification (tokens from 'claude setup-token' do not include this scope).
Try again, or obtain a full-scope token via 'claude auth login'.`
    };
    let w = O.organization.uuid;
    if (K.includes(w)) return {
        valid: !0
    };
    if (A) return {
        valid: !1,
        message: `The ${Y==="CLAUDE_CODE_OAUTH_TOKEN"?"CLAUDE_CODE_OAUTH_TOKEN":"CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR"} environment variable provides a token for a
different organization than required by this machine's managed settings.

Required: ${_}
Token organization: ${w}

Remove the environment variable or obtain a token for a permitted organization.`
    };
    return {
        valid: !1,
        message: `Your authentication token belongs to organization ${w},
but this machine requires ${_}.

Please log in with a permitted organization: claude auth login`
    }
}
// @from(Ln 158422, Col 4)
lw_ = 300000
// @from(Ln 158423, Col 4)
dR1
// @from(Ln 158423, Col 9)
_R = null
// @from(Ln 158424, Col 4)
Xa = null
// @from(Ln 158425, Col 4)
kk6 = 0
// @from(Ln 158426, Col 4)
iw_ = 3600000
// @from(Ln 158427, Col 4)
ow_ = 180000
// @from(Ln 158428, Col 4)
bb
// @from(Ln 158428, Col 8)
sw_ = 5000
// @from(Ln 158429, Col 4)
tw_ = 3600000
// @from(Ln 158430, Col 4)
q2_ = 180000
// @from(Ln 158431, Col 4)
h26
// @from(Ln 158431, Col 9)
Ek6
// @from(Ln 158431, Col 14)
o7
// @from(Ln 158431, Col 18)
SUq = 0
// @from(Ln 158432, Col 4)
gR1
// @from(Ln 158432, Col 9)
vo6 = null
// @from(Ln 158433, Col 4)
IV8 = null
// @from(Ln 158434, Col 4)
CUq = 0
// @from(Ln 158435, Col 4)
w2_ = 1740000
// @from(Ln 158436, Col 4)
UUq
// @from(Ln 158437, Col 4)
T7 = L(() => {
    Y3();
    U4();
    z3();
    C8();
    jQ();
    x9();
    y8();
    dl6();
    YD();
    WT6();
    rf1();
    il6();
    Uv1();
    uZ8();
    pv();
    h1();
    K8();
    Q8();
    m8();
    Q4();
    U8();
    Lm();
    NV();
    _46();
    FR1();
    r76();
    a1();
    e8();
    bV8();
    dR1 = new Set(["claude-desktop", "local-agent", "claude-vscode"]);
    bb = yA6(async () => {
        let q = await rw_(),
            K = await aw_();
        if (q || K) await ZZq();
        return K
    }, iw_);
    h26 = yA6(async () => {
        return await ew_()
    }, tw_);
    Ek6 = P1(() => {
        if (S9()) return null;
        if (process.platform === "darwin") {
            let K = EUq();
            if (K) {
                if (K.stdout) return {
                    key: K.stdout,
                    source: "/login managed key"
                }
            } else {
                let _ = Fh();
                try {
                    let z = oC(`security find-generic-password -a $USER -w -s "${_}"`);
                    if (z) return {
                        key: z,
                        source: "/login managed key"
                    }
                } catch (z) {
                    j6(z)
                }
            }
        }
        let q = H8();
        if (!q.primaryApiKey) return null;
        return {
            key: q.primaryApiKey,
            source: "/login managed key"
        }
    });
    o7 = P1(() => {
        if (S9()) return null;
        if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
            accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        let q = HZ8();
        if (q) return {
            accessToken: q,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        try {
            let z = t3().read()?.claudeAiOauth;
            if (!z?.accessToken) return null;
            return z
        } catch (K) {
            return j6(K), null
        }
    });
    gR1 = new Map;
    UUq = class UUq extends Error {}
})
// @from(Ln 158537, Col 0)
function yA() {
    return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}`
}
// @from(Ln 158544, Col 0)
function FV8() {
    return QUq.getStore()?.workload
}
// @from(Ln 158548, Col 0)
function gV8(q, K) {
    return QUq.run({
        workload: q
    }, K)
}
// @from(Ln 158553, Col 4)
pV8 = "cron"
// @from(Ln 158554, Col 4)
QUq
// @from(Ln 158555, Col 4)
m26 = L(() => {
    QUq = new j2_
})
// @from(Ln 158559, Col 0)
function OI() {
    let q = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "",
        K = process.env.CLAUDE_AGENT_SDK_CLIENT_APP ? `, client-app/${process.env.CLAUDE_AGENT_SDK_CLIENT_APP}` : "",
        _ = FV8(),
        z = _ ? `, workload/${_}` : "";
    return `claude-cli/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT??"cli"}${q}${K}${z})`
}
// @from(Ln 158567, Col 0)
function Pa() {
    let q = [];
    if (process.env.CLAUDE_CODE_ENTRYPOINT) q.push(process.env.CLAUDE_CODE_ENTRYPOINT);
    if (process.env.CLAUDE_AGENT_SDK_VERSION) q.push(`agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}`);
    if (process.env.CLAUDE_AGENT_SDK_CLIENT_APP) q.push(`client-app/${process.env.CLAUDE_AGENT_SDK_CLIENT_APP}`);
    let K = q.length > 0 ? ` (${q.join(", ")})` : "";
    return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}${K}`
}
// @from(Ln 158576, Col 0)
function dUq() {
    return `Claude-User (${yA()}; +https://support.anthropic.com/)`
}
// @from(Ln 158580, Col 0)
function OH() {
    if (i7()) {
        let K = o7();
        if (!K?.accessToken) return {
            headers: {},
            error: "No OAuth token available"
        };
        return {
            headers: {
                Authorization: `Bearer ${K.accessToken}`,
                "anthropic-beta": eJ
            }
        }
    }
    let q = FV();
    if (!q) return {
        headers: {},
        error: "No API key available"
    };
    return {
        headers: {
            "x-api-key": q
        }
    }
}
// @from(Ln 158605, Col 0)
async function Wa(q, K) {
    try {
        return await q()
    } catch (_) {
        if (!Z1.isAxiosError(_)) throw _;
        let z = _.response?.status;
        if (!(z === 401 || K?.also403Revoked && z === 403 && typeof _.response?.data === "string" && _.response.data.includes("OAuth token has been revoked"))) throw _;
        let A = o7()?.accessToken;
        if (!A) throw _;
        return await $B(A), await q()
    }
}
// @from(Ln 158617, Col 4)
Zf = L(() => {
    CK();
    z3();
    T7();
    m26()
})
// @from(Ln 158623, Col 0)
async function cUq() {
    if (yo6 === null && !Eo6) Eo6 = J2_(), yo6 = await Eo6, Eo6 = null, Sk6.cache.clear?.()
}
// @from(Ln 158627, Col 0)
function Rk6() {
    yo6 = null, Eo6 = null, Sk6.cache.clear?.(), UV8.cache.clear?.()
}
// @from(Ln 158631, Col 0)
function lUq() {
    return Sk6(!0)
}
// @from(Ln 158635, Col 0)
function H2_() {
    if (yo6 !== null) return yo6;
    let q = k_();
    if (q?.emailAddress) return q.emailAddress;
    return
}
// @from(Ln 158641, Col 0)
async function J2_() {
    let q = k_();
    if (q?.emailAddress) return q.emailAddress;
    return
}
// @from(Ln 158646, Col 4)
yo6 = null
// @from(Ln 158647, Col 4)
Eo6 = null
// @from(Ln 158648, Col 4)
Sk6
// @from(Ln 158648, Col 9)
UV8
// @from(Ln 158649, Col 4)
B26 = L(() => {
    U4();
    y8();
    T7();
    h1();
    n7();
    D_();
    Q8();
    NV();
    Sk6 = P1((q) => {
        let K = $I(),
            _ = H8(),
            z, Y, A;
        if (q) {
            if (z = MK() ?? void 0, Y = tQ() ?? void 0, z && _.claudeCodeFirstTokenDate) {
                let j = new Date(_.claudeCodeFirstTokenDate).getTime();
                if (!isNaN(j)) A = j
            }
        }
        let O = k_(),
            w = O?.organizationUuid,
            $ = O?.accountUuid;
        return {
            deviceId: K,
            sessionId: I8(),
            email: H2_(),
            appVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            platform: ef6(),
            organizationUuid: w,
            accountUuid: $,
            userType: "external",
            subscriptionType: z,
            rateLimitTier: Y,
            firstTokenTime: A,
            ...S6(process.env.GITHUB_ACTIONS) && {
                githubActionsMetadata: {
                    actor: process.env.GITHUB_ACTOR,
                    actorId: process.env.GITHUB_ACTOR_ID,
                    repository: process.env.GITHUB_REPOSITORY,
                    repositoryId: process.env.GITHUB_REPOSITORY_ID,
                    repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
                    repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
                }
            }
        }
    });
    UV8 = P1(async () => {
        let q = await ij("git config --get user.email", {
            reject: !1,
            cwd: b8()
        });
        return q.exitCode === 0 && q.stdout ? q.stdout.trim() : void 0
    })
})
// @from(Ln 158710, Col 4)
rUq = p((nUq) => {
    Object.defineProperty(nUq, "__esModule", {
        value: !0
    });
    nUq._globalThis = void 0;
    nUq._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 158717, Col 4)
oUq = p((p26) => {
    var X2_ = p26 && p26.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            Object.defineProperty(q, z, {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            })
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        M2_ = p26 && p26.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) X2_(K, q, _)
        };
    Object.defineProperty(p26, "__esModule", {
        value: !0
    });
    M2_(rUq(), p26)
})
// @from(Ln 158739, Col 4)
aUq = p((F26) => {
    var P2_ = F26 && F26.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            Object.defineProperty(q, z, {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            })
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        W2_ = F26 && F26.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) P2_(K, q, _)
        };
    Object.defineProperty(F26, "__esModule", {
        value: !0
    });
    W2_(oUq(), F26)
})
// @from(Ln 158761, Col 4)
_S1 = p((sUq) => {
    Object.defineProperty(sUq, "__esModule", {
        value: !0
    });
    sUq.VERSION = void 0;
    sUq.VERSION = "1.9.0"
})
// @from(Ln 158768, Col 4)
zQq = p((KQq) => {
    Object.defineProperty(KQq, "__esModule", {
        value: !0
    });
    KQq.isCompatible = KQq._makeCompatibilityCheck = void 0;
    var D2_ = _S1(),
        eUq = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

    function qQq(q) {
        let K = new Set([q]),
            _ = new Set,
            z = q.match(eUq);
        if (!z) return () => !1;
        let Y = {
            major: +z[1],
            minor: +z[2],
            patch: +z[3],
            prerelease: z[4]
        };
        if (Y.prerelease != null) return function($) {
            return $ === q
        };

        function A(w) {
            return _.add(w), !1
        }

        function O(w) {
            return K.add(w), !0
        }
        return function($) {
            if (K.has($)) return !0;
            if (_.has($)) return !1;
            let j = $.match(eUq);
            if (!j) return A($);
            let H = {
                major: +j[1],
                minor: +j[2],
                patch: +j[3],
                prerelease: j[4]
            };
            if (H.prerelease != null) return A($);
            if (Y.major !== H.major) return A($);
            if (Y.major === 0) {
                if (Y.minor === H.minor && Y.patch <= H.patch) return O($);
                return A($)
            }
            if (Y.minor <= H.minor) return O($);
            return A($)
        }
    }
    KQq._makeCompatibilityCheck = qQq;
    KQq.isCompatible = qQq(D2_.VERSION)
})
// @from(Ln 158822, Col 4)
g26 = p((YQq) => {
    Object.defineProperty(YQq, "__esModule", {
        value: !0
    });
    YQq.unregisterGlobal = YQq.getGlobal = YQq.registerGlobal = void 0;
    var f2_ = aUq(),
        Ck6 = _S1(),
        G2_ = zQq(),
        v2_ = Ck6.VERSION.split(".")[0],
        Lo6 = Symbol.for(`opentelemetry.js.api.${v2_}`),
        ho6 = f2_._globalThis;

    function T2_(q, K, _, z = !1) {
        var Y;
        let A = ho6[Lo6] = (Y = ho6[Lo6]) !== null && Y !== void 0 ? Y : {
            version: Ck6.VERSION
        };
        if (!z && A[q]) {
            let O = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${q}`);
            return _.error(O.stack || O.message), !1
        }
        if (A.version !== Ck6.VERSION) {
            let O = Error(`@opentelemetry/api: Registration of version v${A.version} for ${q} does not match previously registered API v${Ck6.VERSION}`);
            return _.error(O.stack || O.message), !1
        }
        return A[q] = K, _.debug(`@opentelemetry/api: Registered a global for ${q} v${Ck6.VERSION}.`), !0
    }
    YQq.registerGlobal = T2_;

    function V2_(q) {
        var K, _;
        let z = (K = ho6[Lo6]) === null || K === void 0 ? void 0 : K.version;
        if (!z || !(0, G2_.isCompatible)(z)) return;
        return (_ = ho6[Lo6]) === null || _ === void 0 ? void 0 : _[q]
    }
    YQq.getGlobal = V2_;

    function k2_(q, K) {
        K.debug(`@opentelemetry/api: Unregistering a global for ${q} v${Ck6.VERSION}.`);
        let _ = ho6[Lo6];
        if (_) delete _[q]
    }
    YQq.unregisterGlobal = k2_
})
// @from(Ln 158866, Col 4)
jQq = p((wQq) => {
    Object.defineProperty(wQq, "__esModule", {
        value: !0
    });
    wQq.DiagComponentLogger = void 0;
    var y2_ = g26();
    class OQq {
        constructor(q) {
            this._namespace = q.namespace || "DiagComponentLogger"
        }
        debug(...q) {
            return Ro6("debug", this._namespace, q)
        }
        error(...q) {
            return Ro6("error", this._namespace, q)
        }
        info(...q) {
            return Ro6("info", this._namespace, q)
        }
        warn(...q) {
            return Ro6("warn", this._namespace, q)
        }
        verbose(...q) {
            return Ro6("verbose", this._namespace, q)
        }
    }
    wQq.DiagComponentLogger = OQq;

    function Ro6(q, K, _) {
        let z = (0, y2_.getGlobal)("diag");
        if (!z) return;
        return _.unshift(K), z[q](..._)
    }
})
// @from(Ln 158900, Col 4)
QV8 = p((HQq) => {
    Object.defineProperty(HQq, "__esModule", {
        value: !0
    });
    HQq.DiagLogLevel = void 0;
    var L2_;
    (function(q) {
        q[q.NONE = 0] = "NONE", q[q.ERROR = 30] = "ERROR", q[q.WARN = 50] = "WARN", q[q.INFO = 60] = "INFO", q[q.DEBUG = 70] = "DEBUG", q[q.VERBOSE = 80] = "VERBOSE", q[q.ALL = 9999] = "ALL"
    })(L2_ = HQq.DiagLogLevel || (HQq.DiagLogLevel = {}))
})
// @from(Ln 158910, Col 4)
MQq = p((JQq) => {
    Object.defineProperty(JQq, "__esModule", {
        value: !0
    });
    JQq.createLogLevelDiagLogger = void 0;
    var Da = QV8();

    function h2_(q, K) {
        if (q < Da.DiagLogLevel.NONE) q = Da.DiagLogLevel.NONE;
        else if (q > Da.DiagLogLevel.ALL) q = Da.DiagLogLevel.ALL;
        K = K || {};

        function _(z, Y) {
            let A = K[z];
            if (typeof A === "function" && q >= Y) return A.bind(K);
            return function() {}
        }
        return {
            error: _("error", Da.DiagLogLevel.ERROR),
            warn: _("warn", Da.DiagLogLevel.WARN),
            info: _("info", Da.DiagLogLevel.INFO),
            debug: _("debug", Da.DiagLogLevel.DEBUG),
            verbose: _("verbose", Da.DiagLogLevel.VERBOSE)
        }
    }
    JQq.createLogLevelDiagLogger = h2_
})
// @from(Ln 158937, Col 4)
U26 = p((WQq) => {
    Object.defineProperty(WQq, "__esModule", {
        value: !0
    });
    WQq.DiagAPI = void 0;
    var R2_ = jQq(),
        S2_ = MQq(),
        PQq = QV8(),
        dV8 = g26(),
        C2_ = "diag";
    class YS1 {
        constructor() {
            function q(z) {
                return function(...Y) {
                    let A = (0, dV8.getGlobal)("diag");
                    if (!A) return;
                    return A[z](...Y)
                }
            }
            let K = this,
                _ = (z, Y = {
                    logLevel: PQq.DiagLogLevel.INFO
                }) => {
                    var A, O, w;
                    if (z === K) {
                        let H = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                        return K.error((A = H.stack) !== null && A !== void 0 ? A : H.message), !1
                    }
                    if (typeof Y === "number") Y = {
                        logLevel: Y
                    };
                    let $ = (0, dV8.getGlobal)("diag"),
                        j = (0, S2_.createLogLevelDiagLogger)((O = Y.logLevel) !== null && O !== void 0 ? O : PQq.DiagLogLevel.INFO, z);
                    if ($ && !Y.suppressOverrideMessage) {
                        let H = (w = Error().stack) !== null && w !== void 0 ? w : "<failed to generate stacktrace>";
                        $.warn(`Current logger will be overwritten from ${H}`), j.warn(`Current logger will overwrite one already registered from ${H}`)
                    }
                    return (0, dV8.registerGlobal)("diag", j, K, !0)
                };
            K.setLogger = _, K.disable = () => {
                (0, dV8.unregisterGlobal)(C2_, K)
            }, K.createComponentLogger = (z) => {
                return new R2_.DiagComponentLogger(z)
            }, K.verbose = q("verbose"), K.debug = q("debug"), K.info = q("info"), K.warn = q("warn"), K.error = q("error")
        }
        static instance() {
            if (!this._instance) this._instance = new YS1;
            return this._instance
        }
    }
    WQq.DiagAPI = YS1
})
// @from(Ln 158989, Col 4)
GQq = p((ZQq) => {
    Object.defineProperty(ZQq, "__esModule", {
        value: !0
    });
    ZQq.BaggageImpl = void 0;
    class bk6 {
        constructor(q) {
            this._entries = q ? new Map(q) : new Map
        }
        getEntry(q) {
            let K = this._entries.get(q);
            if (!K) return;
            return Object.assign({}, K)
        }
        getAllEntries() {
            return Array.from(this._entries.entries()).map(([q, K]) => [q, K])
        }
        setEntry(q, K) {
            let _ = new bk6(this._entries);
            return _._entries.set(q, K), _
        }
        removeEntry(q) {
            let K = new bk6(this._entries);
            return K._entries.delete(q), K
        }
        removeEntries(...q) {
            let K = new bk6(this._entries);
            for (let _ of q) K._entries.delete(_);
            return K
        }
        clear() {
            return new bk6
        }
    }
    ZQq.BaggageImpl = bk6
})
// @from(Ln 159025, Col 4)
VQq = p((vQq) => {
    Object.defineProperty(vQq, "__esModule", {
        value: !0
    });
    vQq.baggageEntryMetadataSymbol = void 0;
    vQq.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Ln 159032, Col 4)
AS1 = p((kQq) => {
    Object.defineProperty(kQq, "__esModule", {
        value: !0
    });
    kQq.baggageEntryMetadataFromString = kQq.createBaggage = void 0;
    var b2_ = U26(),
        I2_ = GQq(),
        x2_ = VQq(),
        u2_ = b2_.DiagAPI.instance();

    function m2_(q = {}) {
        return new I2_.BaggageImpl(new Map(Object.entries(q)))
    }
    kQq.createBaggage = m2_;

    function B2_(q) {
        if (typeof q !== "string") u2_.error(`Cannot create baggage metadata from unknown type: ${typeof q}`), q = "";
        return {
            __TYPE__: x2_.baggageEntryMetadataSymbol,
            toString() {
                return q
            }
        }
    }
    kQq.baggageEntryMetadataFromString = B2_
})
// @from(Ln 159058, Col 4)
So6 = p((EQq) => {
    Object.defineProperty(EQq, "__esModule", {
        value: !0
    });
    EQq.ROOT_CONTEXT = EQq.createContextKey = void 0;

    function F2_(q) {
        return Symbol.for(q)
    }
    EQq.createContextKey = F2_;
    class cV8 {
        constructor(q) {
            let K = this;
            K._currentContext = q ? new Map(q) : new Map, K.getValue = (_) => K._currentContext.get(_), K.setValue = (_, z) => {
                let Y = new cV8(K._currentContext);
                return Y._currentContext.set(_, z), Y
            }, K.deleteValue = (_) => {
                let z = new cV8(K._currentContext);
                return z._currentContext.delete(_), z
            }
        }
    }
    EQq.ROOT_CONTEXT = new cV8
})
// @from(Ln 159082, Col 4)
SQq = p((hQq) => {
    Object.defineProperty(hQq, "__esModule", {
        value: !0
    });
    hQq.DiagConsoleLogger = void 0;
    var OS1 = [{
        n: "error",
        c: "error"
    }, {
        n: "warn",
        c: "warn"
    }, {
        n: "info",
        c: "info"
    }, {
        n: "debug",
        c: "debug"
    }, {
        n: "verbose",
        c: "trace"
    }];
    class LQq {
        constructor() {
            function q(K) {
                return function(..._) {
                    if (console) {
                        let z = console[K];
                        if (typeof z !== "function") z = console.log;
                        if (typeof z === "function") return z.apply(console, _)
                    }
                }
            }
            for (let K = 0; K < OS1.length; K++) this[OS1[K].n] = q(OS1[K].c)
        }
    }
    hQq.DiagConsoleLogger = LQq
})
// @from(Ln 159119, Col 4)
WS1 = p((CQq) => {
    Object.defineProperty(CQq, "__esModule", {
        value: !0
    });
    CQq.createNoopMeter = CQq.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = CQq.NOOP_OBSERVABLE_GAUGE_METRIC = CQq.NOOP_OBSERVABLE_COUNTER_METRIC = CQq.NOOP_UP_DOWN_COUNTER_METRIC = CQq.NOOP_HISTOGRAM_METRIC = CQq.NOOP_GAUGE_METRIC = CQq.NOOP_COUNTER_METRIC = CQq.NOOP_METER = CQq.NoopObservableUpDownCounterMetric = CQq.NoopObservableGaugeMetric = CQq.NoopObservableCounterMetric = CQq.NoopObservableMetric = CQq.NoopHistogramMetric = CQq.NoopGaugeMetric = CQq.NoopUpDownCounterMetric = CQq.NoopCounterMetric = CQq.NoopMetric = CQq.NoopMeter = void 0;
    class wS1 {
        constructor() {}
        createGauge(q, K) {
            return CQq.NOOP_GAUGE_METRIC
        }
        createHistogram(q, K) {
            return CQq.NOOP_HISTOGRAM_METRIC
        }
        createCounter(q, K) {
            return CQq.NOOP_COUNTER_METRIC
        }
        createUpDownCounter(q, K) {
            return CQq.NOOP_UP_DOWN_COUNTER_METRIC
        }
        createObservableGauge(q, K) {
            return CQq.NOOP_OBSERVABLE_GAUGE_METRIC
        }
        createObservableCounter(q, K) {
            return CQq.NOOP_OBSERVABLE_COUNTER_METRIC
        }
        createObservableUpDownCounter(q, K) {
            return CQq.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
        }
        addBatchObservableCallback(q, K) {}
        removeBatchObservableCallback(q) {}
    }
    CQq.NoopMeter = wS1;
    class Ik6 {}
    CQq.NoopMetric = Ik6;
    class $S1 extends Ik6 {
        add(q, K) {}
    }
    CQq.NoopCounterMetric = $S1;
    class jS1 extends Ik6 {
        add(q, K) {}
    }
    CQq.NoopUpDownCounterMetric = jS1;
    class HS1 extends Ik6 {
        record(q, K) {}
    }
    CQq.NoopGaugeMetric = HS1;
    class JS1 extends Ik6 {
        record(q, K) {}
    }
    CQq.NoopHistogramMetric = JS1;
    class Co6 {
        addCallback(q) {}
        removeCallback(q) {}
    }
    CQq.NoopObservableMetric = Co6;
    class XS1 extends Co6 {}
    CQq.NoopObservableCounterMetric = XS1;
    class MS1 extends Co6 {}
    CQq.NoopObservableGaugeMetric = MS1;
    class PS1 extends Co6 {}
    CQq.NoopObservableUpDownCounterMetric = PS1;
    CQq.NOOP_METER = new wS1;
    CQq.NOOP_COUNTER_METRIC = new $S1;
    CQq.NOOP_GAUGE_METRIC = new HS1;
    CQq.NOOP_HISTOGRAM_METRIC = new JS1;
    CQq.NOOP_UP_DOWN_COUNTER_METRIC = new jS1;
    CQq.NOOP_OBSERVABLE_COUNTER_METRIC = new XS1;
    CQq.NOOP_OBSERVABLE_GAUGE_METRIC = new MS1;
    CQq.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new PS1;

    function U2_() {
        return CQq.NOOP_METER
    }
    CQq.createNoopMeter = U2_
})
// @from(Ln 159194, Col 4)
QQq = p((UQq) => {
    Object.defineProperty(UQq, "__esModule", {
        value: !0
    });
    UQq.ValueType = void 0;
    var t2_;
    (function(q) {
        q[q.INT = 0] = "INT", q[q.DOUBLE = 1] = "DOUBLE"
    })(t2_ = UQq.ValueType || (UQq.ValueType = {}))
})
// @from(Ln 159204, Col 4)
ZS1 = p((dQq) => {
    Object.defineProperty(dQq, "__esModule", {
        value: !0
    });
    dQq.defaultTextMapSetter = dQq.defaultTextMapGetter = void 0;
    dQq.defaultTextMapGetter = {
        get(q, K) {
            if (q == null) return;
            return q[K]
        },
        keys(q) {
            if (q == null) return [];
            return Object.keys(q)
        }
    };
    dQq.defaultTextMapSetter = {
        set(q, K, _) {
            if (q == null) return;
            q[K] = _
        }
    }
})
// @from(Ln 159226, Col 4)
rQq = p((nQq) => {
    Object.defineProperty(nQq, "__esModule", {
        value: !0
    });
    nQq.NoopContextManager = void 0;
    var q$_ = So6();
    class lQq {
        active() {
            return q$_.ROOT_CONTEXT
        }
        with(q, K, _, ...z) {
            return K.call(_, ...z)
        }
        bind(q, K) {
            return K
        }
        enable() {
            return this
        }
        disable() {
            return this
        }
    }
    nQq.NoopContextManager = lQq
})
// @from(Ln 159251, Col 4)
bo6 = p((aQq) => {
    Object.defineProperty(aQq, "__esModule", {
        value: !0
    });
    aQq.ContextAPI = void 0;
    var K$_ = rQq(),
        fS1 = g26(),
        oQq = U26(),
        GS1 = "context",
        _$_ = new K$_.NoopContextManager;
    class vS1 {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new vS1;
            return this._instance
        }
        setGlobalContextManager(q) {
            return (0, fS1.registerGlobal)(GS1, q, oQq.DiagAPI.instance())
        }
        active() {
            return this._getContextManager().active()
        }
        with(q, K, _, ...z) {
            return this._getContextManager().with(q, K, _, ...z)
        }
        bind(q, K) {
            return this._getContextManager().bind(q, K)
        }
        _getContextManager() {
            return (0, fS1.getGlobal)(GS1) || _$_
        }
        disable() {
            this._getContextManager().disable(), (0, fS1.unregisterGlobal)(GS1, oQq.DiagAPI.instance())
        }
    }
    aQq.ContextAPI = vS1
})
// @from(Ln 159288, Col 4)
VS1 = p((tQq) => {
    Object.defineProperty(tQq, "__esModule", {
        value: !0
    });
    tQq.TraceFlags = void 0;
    var z$_;
    (function(q) {
        q[q.NONE = 0] = "NONE", q[q.SAMPLED = 1] = "SAMPLED"
    })(z$_ = tQq.TraceFlags || (tQq.TraceFlags = {}))
})
// @from(Ln 159298, Col 4)
lV8 = p((eQq) => {
    Object.defineProperty(eQq, "__esModule", {
        value: !0
    });
    eQq.INVALID_SPAN_CONTEXT = eQq.INVALID_TRACEID = eQq.INVALID_SPANID = void 0;
    var Y$_ = VS1();
    eQq.INVALID_SPANID = "0000000000000000";
    eQq.INVALID_TRACEID = "00000000000000000000000000000000";
    eQq.INVALID_SPAN_CONTEXT = {
        traceId: eQq.INVALID_TRACEID,
        spanId: eQq.INVALID_SPANID,
        traceFlags: Y$_.TraceFlags.NONE
    }
})
// @from(Ln 159312, Col 4)
nV8 = p((Ydq) => {
    Object.defineProperty(Ydq, "__esModule", {
        value: !0
    });
    Ydq.NonRecordingSpan = void 0;
    var A$_ = lV8();
    class zdq {
        constructor(q = A$_.INVALID_SPAN_CONTEXT) {
            this._spanContext = q
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(q, K) {
            return this
        }
        setAttributes(q) {
            return this
        }
        addEvent(q, K) {
            return this
        }
        addLink(q) {
            return this
        }
        addLinks(q) {
            return this
        }
        setStatus(q) {
            return this
        }
        updateName(q) {
            return this
        }
        end(q) {}
        isRecording() {
            return !1
        }
        recordException(q, K) {}
    }
    Ydq.NonRecordingSpan = zdq
})
// @from(Ln 159354, Col 4)
ES1 = p((wdq) => {
    Object.defineProperty(wdq, "__esModule", {
        value: !0
    });
    wdq.getSpanContext = wdq.setSpanContext = wdq.deleteSpan = wdq.setSpan = wdq.getActiveSpan = wdq.getSpan = void 0;
    var O$_ = So6(),
        w$_ = nV8(),
        $$_ = bo6(),
        kS1 = (0, O$_.createContextKey)("OpenTelemetry Context Key SPAN");

    function NS1(q) {
        return q.getValue(kS1) || void 0
    }
    wdq.getSpan = NS1;

    function j$_() {
        return NS1($$_.ContextAPI.getInstance().active())
    }
    wdq.getActiveSpan = j$_;

    function Odq(q, K) {
        return q.setValue(kS1, K)
    }
    wdq.setSpan = Odq;

    function H$_(q) {
        return q.deleteValue(kS1)
    }
    wdq.deleteSpan = H$_;

    function J$_(q, K) {
        return Odq(q, new w$_.NonRecordingSpan(K))
    }
    wdq.setSpanContext = J$_;

    function X$_(q) {
        var K;
        return (K = NS1(q)) === null || K === void 0 ? void 0 : K.spanContext()
    }
    wdq.getSpanContext = X$_
})
// @from(Ln 159395, Col 4)
iV8 = p((Xdq) => {
    Object.defineProperty(Xdq, "__esModule", {
        value: !0
    });
    Xdq.wrapSpanContext = Xdq.isSpanContextValid = Xdq.isValidSpanId = Xdq.isValidTraceId = void 0;
    var jdq = lV8(),
        f$_ = nV8(),
        G$_ = /^([0-9a-f]{32})$/i,
        v$_ = /^[0-9a-f]{16}$/i;

    function Hdq(q) {
        return G$_.test(q) && q !== jdq.INVALID_TRACEID
    }
    Xdq.isValidTraceId = Hdq;

    function Jdq(q) {
        return v$_.test(q) && q !== jdq.INVALID_SPANID
    }
    Xdq.isValidSpanId = Jdq;

    function T$_(q) {
        return Hdq(q.traceId) && Jdq(q.spanId)
    }
    Xdq.isSpanContextValid = T$_;

    function V$_(q) {
        return new f$_.NonRecordingSpan(q)
    }
    Xdq.wrapSpanContext = V$_
})
// @from(Ln 159425, Col 4)
hS1 = p((Ddq) => {
    Object.defineProperty(Ddq, "__esModule", {
        value: !0
    });
    Ddq.NoopTracer = void 0;
    var y$_ = bo6(),
        Pdq = ES1(),
        yS1 = nV8(),
        L$_ = iV8(),
        LS1 = y$_.ContextAPI.getInstance();
    class Wdq {
        startSpan(q, K, _ = LS1.active()) {
            if (Boolean(K === null || K === void 0 ? void 0 : K.root)) return new yS1.NonRecordingSpan;
            let Y = _ && (0, Pdq.getSpanContext)(_);
            if (h$_(Y) && (0, L$_.isSpanContextValid)(Y)) return new yS1.NonRecordingSpan(Y);
            else return new yS1.NonRecordingSpan
        }
        startActiveSpan(q, K, _, z) {
            let Y, A, O;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) O = K;
            else if (arguments.length === 3) Y = K, O = _;
            else Y = K, A = _, O = z;
            let w = A !== null && A !== void 0 ? A : LS1.active(),
                $ = this.startSpan(q, Y, w),
                j = (0, Pdq.setSpan)(w, $);
            return LS1.with(j, O, void 0, $)
        }
    }
    Ddq.NoopTracer = Wdq;

    function h$_(q) {
        return typeof q === "object" && typeof q.spanId === "string" && typeof q.traceId === "string" && typeof q.traceFlags === "number"
    }
})
// @from(Ln 159460, Col 4)
RS1 = p((Gdq) => {
    Object.defineProperty(Gdq, "__esModule", {
        value: !0
    });
    Gdq.ProxyTracer = void 0;
    var R$_ = hS1(),
        S$_ = new R$_.NoopTracer;
    class fdq {
        constructor(q, K, _, z) {
            this._provider = q, this.name = K, this.version = _, this.options = z
        }
        startSpan(q, K, _) {
            return this._getTracer().startSpan(q, K, _)
        }
        startActiveSpan(q, K, _, z) {
            let Y = this._getTracer();
            return Reflect.apply(Y.startActiveSpan, Y, arguments)
        }
        _getTracer() {
            if (this._delegate) return this._delegate;
            let q = this._provider.getDelegateTracer(this.name, this.version, this.options);
            if (!q) return S$_;
            return this._delegate = q, this._delegate
        }
    }
    Gdq.ProxyTracer = fdq
})
// @from(Ln 159487, Col 4)
Ndq = p((Vdq) => {
    Object.defineProperty(Vdq, "__esModule", {
        value: !0
    });
    Vdq.NoopTracerProvider = void 0;
    var C$_ = hS1();
    class Tdq {
        getTracer(q, K, _) {
            return new C$_.NoopTracer
        }
    }
    Vdq.NoopTracerProvider = Tdq
})
// @from(Ln 159500, Col 4)
SS1 = p((ydq) => {
    Object.defineProperty(ydq, "__esModule", {
        value: !0
    });
    ydq.ProxyTracerProvider = void 0;
    var b$_ = RS1(),
        I$_ = Ndq(),
        x$_ = new I$_.NoopTracerProvider;
    class Edq {
        getTracer(q, K, _) {
            var z;
            return (z = this.getDelegateTracer(q, K, _)) !== null && z !== void 0 ? z : new b$_.ProxyTracer(this, q, K, _)
        }
        getDelegate() {
            var q;
            return (q = this._delegate) !== null && q !== void 0 ? q : x$_
        }
        setDelegate(q) {
            this._delegate = q
        }
        getDelegateTracer(q, K, _) {
            var z;
            return (z = this._delegate) === null || z === void 0 ? void 0 : z.getTracer(q, K, _)
        }
    }
    ydq.ProxyTracerProvider = Edq
})
// @from(Ln 159527, Col 4)
Rdq = p((hdq) => {
    Object.defineProperty(hdq, "__esModule", {
        value: !0
    });
    hdq.SamplingDecision = void 0;
    var u$_;
    (function(q) {
        q[q.NOT_RECORD = 0] = "NOT_RECORD", q[q.RECORD = 1] = "RECORD", q[q.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(u$_ = hdq.SamplingDecision || (hdq.SamplingDecision = {}))
})
// @from(Ln 159537, Col 4)
Cdq = p((Sdq) => {
    Object.defineProperty(Sdq, "__esModule", {
        value: !0
    });
    Sdq.SpanKind = void 0;
    var m$_;
    (function(q) {
        q[q.INTERNAL = 0] = "INTERNAL", q[q.SERVER = 1] = "SERVER", q[q.CLIENT = 2] = "CLIENT", q[q.PRODUCER = 3] = "PRODUCER", q[q.CONSUMER = 4] = "CONSUMER"
    })(m$_ = Sdq.SpanKind || (Sdq.SpanKind = {}))
})
// @from(Ln 159547, Col 4)
Idq = p((bdq) => {
    Object.defineProperty(bdq, "__esModule", {
        value: !0
    });
    bdq.SpanStatusCode = void 0;
    var B$_;
    (function(q) {
        q[q.UNSET = 0] = "UNSET", q[q.OK = 1] = "OK", q[q.ERROR = 2] = "ERROR"
    })(B$_ = bdq.SpanStatusCode || (bdq.SpanStatusCode = {}))
})
// @from(Ln 159557, Col 4)
mdq = p((xdq) => {
    Object.defineProperty(xdq, "__esModule", {
        value: !0
    });
    xdq.validateValue = xdq.validateKey = void 0;
    var xS1 = "[_0-9a-z-*/]",
        p$_ = `[a-z]${xS1}{0,255}`,
        F$_ = `[a-z0-9]${xS1}{0,240}@[a-z]${xS1}{0,13}`,
        g$_ = new RegExp(`^(?:${p$_}|${F$_})$`),
        U$_ = /^[ -~]{0,255}[!-~]$/,
        Q$_ = /,|=/;

    function d$_(q) {
        return g$_.test(q)
    }
    xdq.validateKey = d$_;

    function c$_(q) {
        return U$_.test(q) && !Q$_.test(q)
    }
    xdq.validateValue = c$_
})
// @from(Ln 159579, Col 4)
ddq = p((Udq) => {
    Object.defineProperty(Udq, "__esModule", {
        value: !0
    });
    Udq.TraceStateImpl = void 0;
    var Bdq = mdq(),
        pdq = 32,
        n$_ = 512,
        Fdq = ",",
        gdq = "=";
    class uS1 {
        constructor(q) {
            if (this._internalState = new Map, q) this._parse(q)
        }
        set(q, K) {
            let _ = this._clone();
            if (_._internalState.has(q)) _._internalState.delete(q);
            return _._internalState.set(q, K), _
        }
        unset(q) {
            let K = this._clone();
            return K._internalState.delete(q), K
        }
        get(q) {
            return this._internalState.get(q)
        }
        serialize() {
            return this._keys().reduce((q, K) => {
                return q.push(K + gdq + this.get(K)), q
            }, []).join(Fdq)
        }
        _parse(q) {
            if (q.length > n$_) return;
            if (this._internalState = q.split(Fdq).reverse().reduce((K, _) => {
                    let z = _.trim(),
                        Y = z.indexOf(gdq);
                    if (Y !== -1) {
                        let A = z.slice(0, Y),
                            O = z.slice(Y + 1, _.length);
                        if ((0, Bdq.validateKey)(A) && (0, Bdq.validateValue)(O)) K.set(A, O)
                    }
                    return K
                }, new Map), this._internalState.size > pdq) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, pdq))
        }
        _keys() {
            return Array.from(this._internalState.keys()).reverse()
        }
        _clone() {
            let q = new uS1;
            return q._internalState = new Map(this._internalState), q
        }
    }
    Udq.TraceStateImpl = uS1
})
// @from(Ln 159633, Col 4)
ndq = p((cdq) => {
    Object.defineProperty(cdq, "__esModule", {
        value: !0
    });
    cdq.createTraceState = void 0;
    var i$_ = ddq();

    function r$_(q) {
        return new i$_.TraceStateImpl(q)
    }
    cdq.createTraceState = r$_
})
// @from(Ln 159645, Col 4)
odq = p((idq) => {
    Object.defineProperty(idq, "__esModule", {
        value: !0
    });
    idq.context = void 0;
    var o$_ = bo6();
    idq.context = o$_.ContextAPI.getInstance()
})
// @from(Ln 159653, Col 4)
tdq = p((adq) => {
    Object.defineProperty(adq, "__esModule", {
        value: !0
    });
    adq.diag = void 0;
    var a$_ = U26();
    adq.diag = a$_.DiagAPI.instance()
})
// @from(Ln 159661, Col 4)
Kcq = p((edq) => {
    Object.defineProperty(edq, "__esModule", {
        value: !0
    });
    edq.NOOP_METER_PROVIDER = edq.NoopMeterProvider = void 0;
    var s$_ = WS1();
    class mS1 {
        getMeter(q, K, _) {
            return s$_.NOOP_METER
        }
    }
    edq.NoopMeterProvider = mS1;
    edq.NOOP_METER_PROVIDER = new mS1
})
// @from(Ln 159675, Col 4)
Acq = p((zcq) => {
    Object.defineProperty(zcq, "__esModule", {
        value: !0
    });
    zcq.MetricsAPI = void 0;
    var e$_ = Kcq(),
        BS1 = g26(),
        _cq = U26(),
        pS1 = "metrics";
    class FS1 {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new FS1;
            return this._instance
        }
        setGlobalMeterProvider(q) {
            return (0, BS1.registerGlobal)(pS1, q, _cq.DiagAPI.instance())
        }
        getMeterProvider() {
            return (0, BS1.getGlobal)(pS1) || e$_.NOOP_METER_PROVIDER
        }
        getMeter(q, K, _) {
            return this.getMeterProvider().getMeter(q, K, _)
        }
        disable() {
            (0, BS1.unregisterGlobal)(pS1, _cq.DiagAPI.instance())
        }
    }
    zcq.MetricsAPI = FS1
})
// @from(Ln 159705, Col 4)
$cq = p((Ocq) => {
    Object.defineProperty(Ocq, "__esModule", {
        value: !0
    });
    Ocq.metrics = void 0;
    var qj_ = Acq();
    Ocq.metrics = qj_.MetricsAPI.getInstance()
})
// @from(Ln 159713, Col 4)
Xcq = p((Hcq) => {
    Object.defineProperty(Hcq, "__esModule", {
        value: !0
    });
    Hcq.NoopTextMapPropagator = void 0;
    class jcq {
        inject(q, K) {}
        extract(q, K) {
            return q
        }
        fields() {
            return []
        }
    }
    Hcq.NoopTextMapPropagator = jcq
})
// @from(Ln 159729, Col 4)
Dcq = p((Pcq) => {
    Object.defineProperty(Pcq, "__esModule", {
        value: !0
    });
    Pcq.deleteBaggage = Pcq.setBaggage = Pcq.getActiveBaggage = Pcq.getBaggage = void 0;
    var Kj_ = bo6(),
        _j_ = So6(),
        gS1 = (0, _j_.createContextKey)("OpenTelemetry Baggage Key");

    function Mcq(q) {
        return q.getValue(gS1) || void 0
    }
    Pcq.getBaggage = Mcq;

    function zj_() {
        return Mcq(Kj_.ContextAPI.getInstance().active())
    }
    Pcq.getActiveBaggage = zj_;

    function Yj_(q, K) {
        return q.setValue(gS1, K)
    }
    Pcq.setBaggage = Yj_;

    function Aj_(q) {
        return q.deleteValue(gS1)
    }
    Pcq.deleteBaggage = Aj_
})
// @from(Ln 159758, Col 4)
Tcq = p((Gcq) => {
    Object.defineProperty(Gcq, "__esModule", {
        value: !0
    });
    Gcq.PropagationAPI = void 0;
    var US1 = g26(),
        jj_ = Xcq(),
        Zcq = ZS1(),
        rV8 = Dcq(),
        Hj_ = AS1(),
        fcq = U26(),
        QS1 = "propagation",
        Jj_ = new jj_.NoopTextMapPropagator;
    class dS1 {
        constructor() {
            this.createBaggage = Hj_.createBaggage, this.getBaggage = rV8.getBaggage, this.getActiveBaggage = rV8.getActiveBaggage, this.setBaggage = rV8.setBaggage, this.deleteBaggage = rV8.deleteBaggage
        }
        static getInstance() {
            if (!this._instance) this._instance = new dS1;
            return this._instance
        }
        setGlobalPropagator(q) {
            return (0, US1.registerGlobal)(QS1, q, fcq.DiagAPI.instance())
        }
        inject(q, K, _ = Zcq.defaultTextMapSetter) {
            return this._getGlobalPropagator().inject(q, K, _)
        }
        extract(q, K, _ = Zcq.defaultTextMapGetter) {
            return this._getGlobalPropagator().extract(q, K, _)
        }
        fields() {
            return this._getGlobalPropagator().fields()
        }
        disable() {
            (0, US1.unregisterGlobal)(QS1, fcq.DiagAPI.instance())
        }
        _getGlobalPropagator() {
            return (0, US1.getGlobal)(QS1) || Jj_
        }
    }
    Gcq.PropagationAPI = dS1
})
// @from(Ln 159800, Col 4)
Ncq = p((Vcq) => {
    Object.defineProperty(Vcq, "__esModule", {
        value: !0
    });
    Vcq.propagation = void 0;
    var Xj_ = Tcq();
    Vcq.propagation = Xj_.PropagationAPI.getInstance()
})
// @from(Ln 159808, Col 4)
Scq = p((hcq) => {
    Object.defineProperty(hcq, "__esModule", {
        value: !0
    });
    hcq.TraceAPI = void 0;
    var cS1 = g26(),
        Ecq = SS1(),
        ycq = iV8(),
        xk6 = ES1(),
        Lcq = U26(),
        lS1 = "trace";
    class nS1 {
        constructor() {
            this._proxyTracerProvider = new Ecq.ProxyTracerProvider, this.wrapSpanContext = ycq.wrapSpanContext, this.isSpanContextValid = ycq.isSpanContextValid, this.deleteSpan = xk6.deleteSpan, this.getSpan = xk6.getSpan, this.getActiveSpan = xk6.getActiveSpan, this.getSpanContext = xk6.getSpanContext, this.setSpan = xk6.setSpan, this.setSpanContext = xk6.setSpanContext
        }
        static getInstance() {
            if (!this._instance) this._instance = new nS1;
            return this._instance
        }
        setGlobalTracerProvider(q) {
            let K = (0, cS1.registerGlobal)(lS1, this._proxyTracerProvider, Lcq.DiagAPI.instance());
            if (K) this._proxyTracerProvider.setDelegate(q);
            return K
        }
        getTracerProvider() {
            return (0, cS1.getGlobal)(lS1) || this._proxyTracerProvider
        }
        getTracer(q, K) {
            return this.getTracerProvider().getTracer(q, K)
        }
        disable() {
            (0, cS1.unregisterGlobal)(lS1, Lcq.DiagAPI.instance()), this._proxyTracerProvider = new Ecq.ProxyTracerProvider
        }
    }
    hcq.TraceAPI = nS1
})
// @from(Ln 159844, Col 4)
Icq = p((Ccq) => {
    Object.defineProperty(Ccq, "__esModule", {
        value: !0
    });
    Ccq.trace = void 0;
    var Mj_ = Scq();
    Ccq.trace = Mj_.TraceAPI.getInstance()
})
// @from(Ln 159852, Col 4)
$5 = p((kw) => {
    Object.defineProperty(kw, "__esModule", {
        value: !0
    });
    kw.trace = kw.propagation = kw.metrics = kw.diag = kw.context = kw.INVALID_SPAN_CONTEXT = kw.INVALID_TRACEID = kw.INVALID_SPANID = kw.isValidSpanId = kw.isValidTraceId = kw.isSpanContextValid = kw.createTraceState = kw.TraceFlags = kw.SpanStatusCode = kw.SpanKind = kw.SamplingDecision = kw.ProxyTracerProvider = kw.ProxyTracer = kw.defaultTextMapSetter = kw.defaultTextMapGetter = kw.ValueType = kw.createNoopMeter = kw.DiagLogLevel = kw.DiagConsoleLogger = kw.ROOT_CONTEXT = kw.createContextKey = kw.baggageEntryMetadataFromString = void 0;
    var Pj_ = AS1();
    Object.defineProperty(kw, "baggageEntryMetadataFromString", {
        enumerable: !0,
        get: function() {
            return Pj_.baggageEntryMetadataFromString
        }
    });
    var xcq = So6();
    Object.defineProperty(kw, "createContextKey", {
        enumerable: !0,
        get: function() {
            return xcq.createContextKey
        }
    });
    Object.defineProperty(kw, "ROOT_CONTEXT", {
        enumerable: !0,
        get: function() {
            return xcq.ROOT_CONTEXT
        }
    });
    var Wj_ = SQq();
    Object.defineProperty(kw, "DiagConsoleLogger", {
        enumerable: !0,
        get: function() {
            return Wj_.DiagConsoleLogger
        }
    });
    var Dj_ = QV8();
    Object.defineProperty(kw, "DiagLogLevel", {
        enumerable: !0,
        get: function() {
            return Dj_.DiagLogLevel
        }
    });
    var Zj_ = WS1();
    Object.defineProperty(kw, "createNoopMeter", {
        enumerable: !0,
        get: function() {
            return Zj_.createNoopMeter
        }
    });
    var fj_ = QQq();
    Object.defineProperty(kw, "ValueType", {
        enumerable: !0,
        get: function() {
            return fj_.ValueType
        }
    });
    var ucq = ZS1();
    Object.defineProperty(kw, "defaultTextMapGetter", {
        enumerable: !0,
        get: function() {
            return ucq.defaultTextMapGetter
        }
    });
    Object.defineProperty(kw, "defaultTextMapSetter", {
        enumerable: !0,
        get: function() {
            return ucq.defaultTextMapSetter
        }
    });
    var Gj_ = RS1();
    Object.defineProperty(kw, "ProxyTracer", {
        enumerable: !0,
        get: function() {
            return Gj_.ProxyTracer
        }
    });
    var vj_ = SS1();
    Object.defineProperty(kw, "ProxyTracerProvider", {
        enumerable: !0,
        get: function() {
            return vj_.ProxyTracerProvider
        }
    });
    var Tj_ = Rdq();
    Object.defineProperty(kw, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return Tj_.SamplingDecision
        }
    });
    var Vj_ = Cdq();
    Object.defineProperty(kw, "SpanKind", {
        enumerable: !0,
        get: function() {
            return Vj_.SpanKind
        }
    });
    var kj_ = Idq();
    Object.defineProperty(kw, "SpanStatusCode", {
        enumerable: !0,
        get: function() {
            return kj_.SpanStatusCode
        }
    });
    var Nj_ = VS1();
    Object.defineProperty(kw, "TraceFlags", {
        enumerable: !0,
        get: function() {
            return Nj_.TraceFlags
        }
    });
    var Ej_ = ndq();
    Object.defineProperty(kw, "createTraceState", {
        enumerable: !0,
        get: function() {
            return Ej_.createTraceState
        }
    });
    var iS1 = iV8();
    Object.defineProperty(kw, "isSpanContextValid", {
        enumerable: !0,
        get: function() {
            return iS1.isSpanContextValid
        }
    });
    Object.defineProperty(kw, "isValidTraceId", {
        enumerable: !0,
        get: function() {
            return iS1.isValidTraceId
        }
    });
    Object.defineProperty(kw, "isValidSpanId", {
        enumerable: !0,
        get: function() {
            return iS1.isValidSpanId
        }
    });
    var rS1 = lV8();
    Object.defineProperty(kw, "INVALID_SPANID", {
        enumerable: !0,
        get: function() {
            return rS1.INVALID_SPANID
        }
    });
    Object.defineProperty(kw, "INVALID_TRACEID", {
        enumerable: !0,
        get: function() {
            return rS1.INVALID_TRACEID
        }
    });
    Object.defineProperty(kw, "INVALID_SPAN_CONTEXT", {
        enumerable: !0,
        get: function() {
            return rS1.INVALID_SPAN_CONTEXT
        }
    });
    var mcq = odq();
    Object.defineProperty(kw, "context", {
        enumerable: !0,
        get: function() {
            return mcq.context
        }
    });
    var Bcq = tdq();
    Object.defineProperty(kw, "diag", {
        enumerable: !0,
        get: function() {
            return Bcq.diag
        }
    });
    var pcq = $cq();
    Object.defineProperty(kw, "metrics", {
        enumerable: !0,
        get: function() {
            return pcq.metrics
        }
    });
    var Fcq = Ncq();
    Object.defineProperty(kw, "propagation", {
        enumerable: !0,
        get: function() {
            return Fcq.propagation
        }
    });
    var gcq = Icq();
    Object.defineProperty(kw, "trace", {
        enumerable: !0,
        get: function() {
            return gcq.trace
        }
    });
    kw.default = {
        context: mcq.context,
        diag: Bcq.diag,
        metrics: pcq.metrics,
        propagation: Fcq.propagation,
        trace: gcq.trace
    }
})
// @from(Ln 160048, Col 4)
Io6 = p((Ucq) => {
    Object.defineProperty(Ucq, "__esModule", {
        value: !0
    });
    Ucq.isTracingSuppressed = Ucq.unsuppressTracing = Ucq.suppressTracing = void 0;
    var hj_ = $5(),
        oS1 = (0, hj_.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

    function Rj_(q) {
        return q.setValue(oS1, !0)
    }
    Ucq.suppressTracing = Rj_;

    function Sj_(q) {
        return q.deleteValue(oS1)
    }
    Ucq.unsuppressTracing = Sj_;

    function Cj_(q) {
        return q.getValue(oS1) === !0
    }
    Ucq.isTracingSuppressed = Cj_
})
// @from(Ln 160071, Col 4)
aS1 = p((dcq) => {
    Object.defineProperty(dcq, "__esModule", {
        value: !0
    });
    dcq.BAGGAGE_MAX_TOTAL_LENGTH = dcq.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = dcq.BAGGAGE_MAX_NAME_VALUE_PAIRS = dcq.BAGGAGE_HEADER = dcq.BAGGAGE_ITEMS_SEPARATOR = dcq.BAGGAGE_PROPERTIES_SEPARATOR = dcq.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
    dcq.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
    dcq.BAGGAGE_PROPERTIES_SEPARATOR = ";";
    dcq.BAGGAGE_ITEMS_SEPARATOR = ",";
    dcq.BAGGAGE_HEADER = "baggage";
    dcq.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
    dcq.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
    dcq.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Ln 160084, Col 4)
sS1 = p((ncq) => {
    Object.defineProperty(ncq, "__esModule", {
        value: !0
    });
    ncq.parseKeyPairsIntoRecord = ncq.parsePairKeyValue = ncq.getKeyPairs = ncq.serializeKeyPairs = void 0;
    var gj_ = $5(),
        Q26 = aS1();

    function Uj_(q) {
        return q.reduce((K, _) => {
            let z = `${K}${K!==""?Q26.BAGGAGE_ITEMS_SEPARATOR:""}${_}`;
            return z.length > Q26.BAGGAGE_MAX_TOTAL_LENGTH ? K : z
        }, "")
    }
    ncq.serializeKeyPairs = Uj_;

    function Qj_(q) {
        return q.getAllEntries().map(([K, _]) => {
            let z = `${encodeURIComponent(K)}=${encodeURIComponent(_.value)}`;
            if (_.metadata !== void 0) z += Q26.BAGGAGE_PROPERTIES_SEPARATOR + _.metadata.toString();
            return z
        })
    }
    ncq.getKeyPairs = Qj_;

    function lcq(q) {
        let K = q.split(Q26.BAGGAGE_PROPERTIES_SEPARATOR);
        if (K.length <= 0) return;
        let _ = K.shift();
        if (!_) return;
        let z = _.indexOf(Q26.BAGGAGE_KEY_PAIR_SEPARATOR);
        if (z <= 0) return;
        let Y = decodeURIComponent(_.substring(0, z).trim()),
            A = decodeURIComponent(_.substring(z + 1).trim()),
            O;
        if (K.length > 0) O = (0, gj_.baggageEntryMetadataFromString)(K.join(Q26.BAGGAGE_PROPERTIES_SEPARATOR));
        return {
            key: Y,
            value: A,
            metadata: O
        }
    }
    ncq.parsePairKeyValue = lcq;

    function dj_(q) {
        let K = {};
        if (typeof q === "string" && q.length > 0) q.split(Q26.BAGGAGE_ITEMS_SEPARATOR).forEach((_) => {
            let z = lcq(_);
            if (z !== void 0 && z.value.length > 0) K[z.key] = z.value
        });
        return K
    }
    ncq.parseKeyPairsIntoRecord = dj_
})
// @from(Ln 160138, Col 4)
scq = p((ocq) => {
    Object.defineProperty(ocq, "__esModule", {
        value: !0
    });
    ocq.W3CBaggagePropagator = void 0;
    var tS1 = $5(),
        ij_ = Io6(),
        d26 = aS1(),
        eS1 = sS1();
    class rcq {
        inject(q, K, _) {
            let z = tS1.propagation.getBaggage(q);
            if (!z || (0, ij_.isTracingSuppressed)(q)) return;
            let Y = (0, eS1.getKeyPairs)(z).filter((O) => {
                    return O.length <= d26.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
                }).slice(0, d26.BAGGAGE_MAX_NAME_VALUE_PAIRS),
                A = (0, eS1.serializeKeyPairs)(Y);
            if (A.length > 0) _.set(K, d26.BAGGAGE_HEADER, A)
        }
        extract(q, K, _) {
            let z = _.get(K, d26.BAGGAGE_HEADER),
                Y = Array.isArray(z) ? z.join(d26.BAGGAGE_ITEMS_SEPARATOR) : z;
            if (!Y) return q;
            let A = {};
            if (Y.length === 0) return q;
            if (Y.split(d26.BAGGAGE_ITEMS_SEPARATOR).forEach((w) => {
                    let $ = (0, eS1.parsePairKeyValue)(w);
                    if ($) {
                        let j = {
                            value: $.value
                        };
                        if ($.metadata) j.metadata = $.metadata;
                        A[$.key] = j
                    }
                }), Object.entries(A).length === 0) return q;
            return tS1.propagation.setBaggage(q, tS1.propagation.createBaggage(A))
        }
        fields() {
            return [d26.BAGGAGE_HEADER]
        }
    }
    ocq.W3CBaggagePropagator = rcq
})
// @from(Ln 160181, Col 4)
Klq = p((ecq) => {
    Object.defineProperty(ecq, "__esModule", {
        value: !0
    });
    ecq.AnchoredClock = void 0;
    class tcq {
        _monotonicClock;
        _epochMillis;
        _performanceMillis;
        constructor(q, K) {
            this._monotonicClock = K, this._epochMillis = q.now(), this._performanceMillis = K.now()
        }
        now() {
            let q = this._monotonicClock.now() - this._performanceMillis;
            return this._epochMillis + q
        }
    }
    ecq.AnchoredClock = tcq
})
// @from(Ln 160200, Col 4)
$lq = p((Olq) => {
    Object.defineProperty(Olq, "__esModule", {
        value: !0
    });
    Olq.isAttributeValue = Olq.isAttributeKey = Olq.sanitizeAttributes = void 0;
    var _lq = $5();

    function rj_(q) {
        let K = {};
        if (typeof q !== "object" || q == null) return K;
        for (let _ in q) {
            if (!Object.prototype.hasOwnProperty.call(q, _)) continue;
            if (!zlq(_)) {
                _lq.diag.warn(`Invalid attribute key: ${_}`);
                continue
            }
            let z = q[_];
            if (!Ylq(z)) {
                _lq.diag.warn(`Invalid attribute value set for key: ${_}`);
                continue
            }
            if (Array.isArray(z)) K[_] = z.slice();
            else K[_] = z
        }
        return K
    }
    Olq.sanitizeAttributes = rj_;

    function zlq(q) {
        return typeof q === "string" && q !== ""
    }
    Olq.isAttributeKey = zlq;

    function Ylq(q) {
        if (q == null) return !0;
        if (Array.isArray(q)) return oj_(q);
        return Alq(typeof q)
    }
    Olq.isAttributeValue = Ylq;

    function oj_(q) {
        let K;
        for (let _ of q) {
            if (_ == null) continue;
            let z = typeof _;
            if (z === K) continue;
            if (!K) {
                if (Alq(z)) {
                    K = z;
                    continue
                }
                return !1
            }
            return !1
        }
        return !0
    }

    function Alq(q) {
        switch (q) {
            case "number":
            case "boolean":
            case "string":
                return !0
        }
        return !1
    }
})
// @from(Ln 160268, Col 4)
qC1 = p((jlq) => {
    Object.defineProperty(jlq, "__esModule", {
        value: !0
    });
    jlq.loggingErrorHandler = void 0;
    var tj_ = $5();

    function ej_() {
        return (q) => {
            tj_.diag.error(qH_(q))
        }
    }
    jlq.loggingErrorHandler = ej_;

    function qH_(q) {
        if (typeof q === "string") return q;
        else return JSON.stringify(KH_(q))
    }

    function KH_(q) {
        let K = {},
            _ = q;
        while (_ !== null) Object.getOwnPropertyNames(_).forEach((z) => {
            if (K[z]) return;
            let Y = _[z];
            if (Y) K[z] = String(Y)
        }), _ = Object.getPrototypeOf(_);
        return K
    }
})
// @from(Ln 160298, Col 4)
Plq = p((Xlq) => {
    Object.defineProperty(Xlq, "__esModule", {
        value: !0
    });
    Xlq.globalErrorHandler = Xlq.setGlobalErrorHandler = void 0;
    var _H_ = qC1(),
        Jlq = (0, _H_.loggingErrorHandler)();

    function zH_(q) {
        Jlq = q
    }
    Xlq.setGlobalErrorHandler = zH_;

    function YH_(q) {
        try {
            Jlq(q)
        } catch {}
    }
    Xlq.globalErrorHandler = YH_
})