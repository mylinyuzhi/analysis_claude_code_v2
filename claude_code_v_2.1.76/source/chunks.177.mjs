
// @from(Ln 455938, Col 0)
async function F2z() {
    if (!p_6() || !A86) return;
    let A = mf("tengu_1p_event_batch_config", {});
    if (TP(A, ANq)) return;
    let q = A86,
        K = q86;
    q86 = null;
    try {
        await q.forceFlush()
    } catch {}
    A86 = null;
    try {
        qNq()
    } catch (Y) {
        A86 = q, q86 = K, _6(Y instanceof Error ? Y : Error(String(Y)));
        return
    }
    q.shutdown().catch(() => {})
}
// @from(Ln 455957, Col 4)
pS1
// @from(Ln 455957, Col 9)
tvq
// @from(Ln 455957, Col 14)
QS1
// @from(Ln 455957, Col 19)
b2z = "tengu_event_sampling_config"
// @from(Ln 455958, Col 4)
q86 = null
// @from(Ln 455959, Col 4)
A86 = null
// @from(Ln 455960, Col 4)
ANq = null
// @from(Ln 455961, Col 4)
m2z = 1e4
// @from(Ln 455962, Col 4)
B2z = 200
// @from(Ln 455963, Col 4)
g2z = 8192
// @from(Ln 455964, Col 4)
n96 = E(() => {
    eL6();
    k8();
    ip();
    HA();
    YK();
    o$();
    H1();
    XS();
    k1();
    _76();
    g1();
    avq();
    ir8();
    pS1 = t(nn1(), 1), tvq = t(KH6(), 1), QS1 = t(P76(), 1)
})
// @from(Ln 455980, Col 4)
HNq = {}
// @from(Ln 456001, Col 0)
function Hc6(A) {
    if (dS1.add(A), hF.size > 0) queueMicrotask(() => {
        if (dS1.has(A) && hF.size > 0) try {
            Promise.resolve(A()).catch((q) => {
                _6(q instanceof Error ? q : Error(String(q)))
            })
        } catch (q) {
            _6(q instanceof Error ? q : Error(String(q)))
        }
    });
    return () => {
        dS1.delete(A)
    }
}
// @from(Ln 456016, Col 0)
function tr8() {
    for (let A of dS1) try {
        Promise.resolve(A()).catch((q) => {
            _6(q instanceof Error ? q : Error(String(q)))
        })
    } catch (q) {
        _6(q instanceof Error ? q : Error(String(q)))
    }
}
// @from(Ln 456026, Col 0)
function sN6() {
    if (!or8) or8 = !0;
    return YNq
}
// @from(Ln 456031, Col 0)
function p2z(A) {
    let q = sN6();
    return q !== null && A in q
}
// @from(Ln 456036, Col 0)
function Po6(A) {
    if (rr8.has(A)) return;
    let q = d_6.get(A);
    if (q) rr8.add(A), nr8({
        experimentId: q.experimentId,
        variationId: q.variationId,
        userAttributes: wNq(),
        experimentMetadata: {
            feature_id: A
        }
    })
}
// @from(Ln 456048, Col 0)
async function zNq(A) {
    let q = A.getPayload();
    if (!q?.features) return !1;
    d_6.clear();
    let K = {};
    for (let [Y, z] of Object.entries(q.features)) {
        let _ = z;
        if ("value" in _ && !("defaultValue" in _)) K[Y] = {
            ..._,
            defaultValue: _.value
        };
        else K[Y] = _;
        if (_.source === "experiment" && _.experimentResult) {
            let {
                experimentResult: w,
                experiment: O
            } = _;
            if (O?.key && w.variationId !== void 0) d_6.set(Y, {
                experimentId: O.key,
                variationId: w.variationId
            })
        }
    }
    await A.setPayload({
        ...q,
        features: K
    }), hF.clear();
    for (let [Y, z] of Object.entries(K))
        if ("value" in z) hF.set(Y, z.value);
    return !0
}
// @from(Ln 456080, Col 0)
function Li() {
    return p_6()
}
// @from(Ln 456084, Col 0)
function _Nq() {
    let A = process.env.ANTHROPIC_BASE_URL;
    if (!A) return;
    try {
        let q = new URL(A).host;
        if (q === "api.anthropic.com") return;
        return q
    } catch {
        return
    }
}
// @from(Ln 456096, Col 0)
function wNq() {
    let A = OMA(),
        q = A.email,
        K = _Nq();
    return {
        id: A.deviceId,
        sessionId: A.sessionId,
        deviceID: A.deviceId,
        platform: A.platform,
        ...K && {
            apiBaseUrlHost: K
        },
        ...A.organizationUuid && {
            organizationUUID: A.organizationUuid
        },
        ...A.accountUuid && {
            accountUUID: A.accountUuid
        },
        ...A.userType && {
            userType: A.userType
        },
        ...A.subscriptionType && {
            subscriptionType: A.subscriptionType
        },
        ...A.rateLimitTier && {
            rateLimitTier: A.rateLimitTier
        },
        ...A.firstTokenTime && {
            firstTokenTime: A.firstTokenTime
        },
        ...q && {
            email: q
        },
        ...A.appVersion && {
            appVersion: A.appVersion
        },
        ...A.githubActionsMetadata && {
            githubActionsMetadata: A.githubActionsMetadata
        }
    }
}
// @from(Ln 456137, Col 0)
async function er8(A, q, K) {
    let Y = sN6();
    if (Y && A in Y) return Y[A];
    if (!Li()) return q;
    let z = await Ri();
    if (!z) return q;
    let _;
    if (hF.has(A)) _ = hF.get(A);
    else _ = z.getFeatureValue(A, q);
    if (K) Po6(A);
    return _
}
// @from(Ln 456149, Col 0)
async function iS1(A, q) {
    return er8(A, q, !0)
}
// @from(Ln 456153, Col 0)
function w8(A, q) {
    let K = sN6();
    if (K && A in K) return K[A];
    if (!Li()) return q;
    if (rN6(A, q), d_6.has(A)) Po6(A);
    else aN6.add(A);
    if (hF.has(A)) return hF.get(A);
    try {
        let Y = X1().cachedGrowthBookFeatures?.[A];
        return Y !== void 0 ? Y : q
    } catch {
        return q
    }
}
// @from(Ln 456168, Col 0)
function lk(A, q, K) {
    let Y = Date.now(),
        z = sr8.get(A) ?? 0;
    if (Y - z > K) sr8.set(A, Y), Xo6.delete(A);
    return w8(A, q)
}
// @from(Ln 456175, Col 0)
function jY(A) {
    let q = sN6();
    if (q && A in q) return Boolean(q[A]);
    if (!Li()) return !1;
    if (rN6(A, !1), d_6.has(A)) Po6(A);
    else aN6.add(A);
    let K = X1(),
        Y = K.cachedGrowthBookFeatures?.[A];
    if (Y !== void 0) return Boolean(Y);
    return K.cachedStatsigGates?.[A] ?? !1
}
// @from(Ln 456186, Col 0)
async function ln8(A) {
    let q = sN6();
    if (q && A in q) return Boolean(q[A]);
    if (!Li()) return !1;
    if (Do6) await Do6;
    let K = X1(),
        Y = K.cachedStatsigGates?.[A];
    if (Y !== void 0) return rN6(A, !1), Boolean(Y);
    let z = K.cachedGrowthBookFeatures?.[A];
    if (z !== void 0) return rN6(A, !1), Boolean(z);
    return rN6(A, !1), !1
}
// @from(Ln 456198, Col 0)
async function zn6(A) {
    let q = sN6();
    if (q && A in q) return Boolean(q[A]);
    if (!Li()) return !1;
    let K = X1().cachedGrowthBookFeatures?.[A];
    if (K === !0) {
        if (d_6.has(A)) Po6(A);
        else aN6.add(A);
        return !0
    }
    let Y = await er8(A, !1, !0);
    if (Y !== K) d1((z) => ({
        ...z,
        cachedGrowthBookFeatures: {
            ...z.cachedGrowthBookFeatures ?? {},
            [A]: Y
        }
    }));
    return Y
}
// @from(Ln 456218, Col 0)
async function rN6(A, q) {
    if (Xo6.has(A)) return;
    if (Xo6.add(A), !lS1) {
        cS1.set(A, q);
        return
    }
    let K = await er8(A, q, !1);
    if (!hF.has(A) && TP(K, q)) return;
    let Y = X1();
    if (TP(Y.cachedGrowthBookFeatures?.[A], K)) return;
    d1((z) => ({
        ...z,
        cachedGrowthBookFeatures: {
            ...z.cachedGrowthBookFeatures ?? {},
            [A]: K
        }
    }))
}
// @from(Ln 456237, Col 0)
function EY6() {
    if (!Li()) return;
    try {
        Wo6(), tr8(), Do6 = Ri().finally(() => {
            Do6 = null
        })
    } catch (A) {
        _6(A instanceof Error ? A : Error(`GrowthBook: Auth change refresh failed: ${A}`))
    }
}
// @from(Ln 456248, Col 0)
function Wo6() {
    if (Ao8(), Jo6) process.off("beforeExit", Jo6), Jo6 = null;
    if (Mo6) process.off("exit", Mo6), Mo6 = null;
    Q_6?.destroy(), Q_6 = null, lS1 = !1, Do6 = null, d_6.clear(), aN6.clear(), rr8.clear(), hF.clear(), sr8.clear(), ar8.cache?.clear?.(), Ri.cache?.clear?.(), Xo6.clear(), YNq = null, or8 = !1
}
// @from(Ln 456253, Col 0)
async function ONq() {
    if (!Li()) return;
    try {
        let A = await Ri();
        if (!A) return;
        if (await A.refreshFeatures(), A !== Q_6) return;
        let q = await zNq(A),
            K = X1().cachedGrowthBookFeatures;
        if (K) {
            let Y = {
                    ...K
                },
                z = !1;
            for (let _ of Object.keys(K)) {
                let w = A.getFeatureValue(_, void 0);
                if (w !== void 0 && !TP(w, K[_])) Y[_] = w, z = !0
            }
            if (z) d1((_) => ({
                ..._,
                cachedGrowthBookFeatures: Y
            }))
        }
        if (q) tr8()
    } catch (A) {
        _6(A instanceof Error ? A : Error(`GrowthBook: Light refresh failed: ${A}`))
    }
}
// @from(Ln 456281, Col 0)
function $Nq() {
    if (!Li()) return;
    if (U_6) clearInterval(U_6);
    if (U_6 = setInterval(() => {
            ONq()
        }, Q2z), U_6.unref?.(), !oN6) oN6 = () => {
        Ao8()
    }, process.once("beforeExit", oN6)
}
// @from(Ln 456291, Col 0)
function Ao8() {
    if (U_6) clearInterval(U_6), U_6 = null;
    if (oN6) process.removeListener("beforeExit", oN6), oN6 = null
}
// @from(Ln 456295, Col 0)
async function rR(A, q) {
    return iS1(A, q)
}
// @from(Ln 456299, Col 0)
function mf(A, q) {
    return w8(A, q)
}
// @from(Ln 456302, Col 4)
Q_6 = null
// @from(Ln 456303, Col 4)
Jo6 = null
// @from(Ln 456304, Col 4)
Mo6 = null
// @from(Ln 456305, Col 4)
lS1 = !1
// @from(Ln 456306, Col 4)
d_6
// @from(Ln 456306, Col 9)
hF
// @from(Ln 456306, Col 13)
aN6
// @from(Ln 456306, Col 18)
rr8
// @from(Ln 456306, Col 23)
Do6 = null
// @from(Ln 456307, Col 4)
dS1
// @from(Ln 456307, Col 9)
YNq = null
// @from(Ln 456308, Col 4)
or8 = !1
// @from(Ln 456309, Col 4)
ar8
// @from(Ln 456309, Col 9)
Ri
// @from(Ln 456309, Col 13)
sr8
// @from(Ln 456309, Col 18)
Xo6
// @from(Ln 456309, Col 23)
cS1
// @from(Ln 456309, Col 28)
Q2z = 21600000
// @from(Ln 456310, Col 4)
U_6 = null
// @from(Ln 456311, Col 4)
oN6 = null
// @from(Ln 456312, Col 4)
HA = E(() => {
    eL6();
    YMA();
    _MA();
    _76();
    H1();
    k1();
    n96();
    k8();
    RM();
    T1();
    g1();
    d_6 = new Map, hF = new Map, aN6 = new Set, rr8 = new Set, dS1 = new Set;
    ar8 = e1(() => {
        if (!Li()) return null;
        let A = wNq(),
            q = "https://api.anthropic.com/",
            Y = l_() || Qw6() || q7() ? QO() : {
                headers: {},
                error: "trust not established"
            },
            z = !Y.error;
        lS1 = z;
        let _ = new GA1({
            apiHost: q,
            clientKey: zMA,
            attributes: A,
            remoteEval: !0,
            cacheKeyAttributes: ["id", "organizationUUID"],
            ...Y.error ? {} : {
                apiHostRequestHeaders: Y.headers
            },
            ...{}
        });
        if (Q_6 = _, !z) return {
            client: _,
            initialized: Promise.resolve()
        };
        let w = _.init({
            timeout: 5000
        }).then(async (O) => {
            if (Q_6 !== _) return;
            let $ = await zNq(_);
            if ($) {
                for (let H of aN6) Po6(H);
                aN6.clear()
            }
            if ($ && cS1.size > 0) {
                let H = [...cS1.entries()];
                cS1.clear();
                for (let [j, J] of H) Xo6.delete(j), rN6(j, J)
            }
            if ($) tr8()
        }).catch((O) => {});
        return Jo6 = () => Q_6?.destroy(), Mo6 = () => Q_6?.destroy(), process.on("beforeExit", Jo6), process.on("exit", Mo6), {
            client: _,
            initialized: w
        }
    }), Ri = e1(async () => {
        let A = ar8();
        if (!A) return null;
        if (!lS1) {
            if (l_() || Qw6() || q7()) {
                if (!QO().error) {
                    if (Wo6(), A = ar8(), !A) return null
                }
            }
        }
        return await A.initialized, $Nq(), A.client
    });
    sr8 = new Map;
    Xo6 = new Set, cS1 = new Map
})
// @from(Ln 456399, Col 0)
function BN(A) {
    return A.toLowerCase()
}
// @from(Ln 456403, Col 0)
function Ko8(A, q) {
    if (y8() === "windows") {
        let K = GP(A),
            Y = GP(q);
        return K86.relative(K, Y)
    }
    return K86.relative(A, q)
}
// @from(Ln 456412, Col 0)
function MX7(A) {
    if (y8() === "windows") return GP(A);
    return A
}
// @from(Ln 456417, Col 0)
function n2z() {
    return VG.map((A) => F_(A)).filter((A) => A !== void 0)
}
// @from(Ln 456421, Col 0)
function On8(A) {
    let q = L4(A),
        K = BN(q);
    if (K.endsWith(`${sf}.claude${sf}settings.json`) || K.endsWith(`${sf}.claude${sf}settings.local.json`)) return !0;
    return n2z().some((Y) => BN(Y) === K)
}
// @from(Ln 456428, Col 0)
function r2z(A) {
    if (On8(A)) return !0;
    let q = Bh(AA(), ".claude", "commands"),
        K = Bh(AA(), ".claude", "agents"),
        Y = Bh(AA(), ".claude", "skills");
    return Iv(A, q) || Iv(A, K) || Iv(A, Y)
}
// @from(Ln 456436, Col 0)
function JNq(A) {
    let q = Bh(t2(), bB()),
        K = tN6(A);
    return K.startsWith(q) && K.endsWith(".md")
}
// @from(Ln 456442, Col 0)
function nS1() {
    return Bh(mj(G1()), R1(), "session-memory") + sf
}
// @from(Ln 456446, Col 0)
function Av6() {
    return Bh(nS1(), "summary.md")
}
// @from(Ln 456450, Col 0)
function o2z(A) {
    return tN6(A).startsWith(nS1())
}
// @from(Ln 456454, Col 0)
function a2z(A) {
    let q = mj(G1()),
        K = tN6(A);
    return K === q || K.startsWith(q + sf)
}
// @from(Ln 456460, Col 0)
function LN6() {
    return jY("tengu_scratch")
}
// @from(Ln 456464, Col 0)
function IN8() {
    if (y8() === "windows") return "claude";
    return `claude-${process.getuid?.()??0}`
}
// @from(Ln 456469, Col 0)
function z91() {
    return Bh(_k(), BD(AA())) + sf
}
// @from(Ln 456473, Col 0)
function Rh1() {
    return Bh(z91(), R1(), "scratchpad")
}
// @from(Ln 456476, Col 0)
async function MNq() {
    if (!LN6()) throw Error("Scratchpad directory feature is not enabled");
    let A = $1(),
        q = Rh1();
    return await A.mkdir(q, {
        mode: 448
    }), q
}
// @from(Ln 456485, Col 0)
function DNq(A) {
    if (!LN6()) return !1;
    let q = Rh1(),
        K = tN6(A);
    return K === q || K.startsWith(q + sf)
}
// @from(Ln 456492, Col 0)
function s2z(A) {
    let K = L4(A).split(sf),
        Y = K[K.length - 1];
    if (A.startsWith("\\\\") || A.startsWith("//")) return !0;
    for (let z = 0; z < K.length; z++) {
        let _ = K[z],
            w = BN(_);
        for (let O of i2z) {
            if (w !== BN(O)) continue;
            if (O === ".claude") {
                let $ = K[z + 1];
                if ($ && BN($) === "worktrees") break
            }
            return !0
        }
    }
    if (Y) {
        let z = BN(Y);
        if (l2z.some((_) => BN(_) === z)) return !0
    }
    return !1
}
// @from(Ln 456515, Col 0)
function XNq(A) {
    if (A.indexOf(":", 2) !== -1) return !0;
    if (/~\d/.test(A)) return !0;
    if (A.startsWith("\\\\?\\") || A.startsWith("\\\\.\\") || A.startsWith("//?/") || A.startsWith("//./")) return !0;
    if (/[.\s]+$/.test(A)) return !0;
    if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A)) return !0;
    if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A)) return !0;
    if (r36(A)) return !0;
    return !1
}
// @from(Ln 456526, Col 0)
function Yo8(A, q) {
    let K = q ?? DS(A);
    for (let Y of K)
        if (XNq(Y)) return {
            safe: !1,
            message: `Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`
        };
    for (let Y of K)
        if (r2z(Y)) return {
            safe: !1,
            message: `Claude requested permissions to write to ${A}, but you haven't granted it yet.`
        };
    for (let Y of K)
        if (s2z(Y)) return {
            safe: !1,
            message: `Claude requested permissions to edit ${A} which is a sensitive file.`
        };
    return {
        safe: !0
    }
}
// @from(Ln 456548, Col 0)
function uW6(A) {
    return new Set([AA(), ...A.additionalWorkingDirectories.keys()])
}
// @from(Ln 456552, Col 0)
function kI(A, q, K) {
    let Y = K ?? DS(A),
        z = Array.from(uW6(q)).flatMap((_) => t2z(_));
    return Y.every((_) => z.some((w) => Iv(_, w)))
}
// @from(Ln 456558, Col 0)
function Iv(A, q) {
    let K = L4(A),
        Y = L4(q),
        z = K.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        _ = Y.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        w = BN(z),
        O = BN(_),
        $ = Ko8(O, w);
    if ($ === "") return !0;
    if (Or($)) return !1;
    return !K86.isAbsolute($)
}
// @from(Ln 456571, Col 0)
function e2z(A) {
    switch (A) {
        case "cliArg":
        case "command":
        case "session":
            return L4(AA());
        case "userSettings":
        case "policySettings":
        case "projectSettings":
        case "localSettings":
        case "flagSettings":
            return XD6(A)
    }
}
// @from(Ln 456586, Col 0)
function qo8(A) {
    return K86.join(SF, A)
}
// @from(Ln 456590, Col 0)
function Awz({
    patternRoot: A,
    pattern: q,
    rootPath: K
}) {
    let Y = K86.join(A, q);
    if (A === K) return qo8(q);
    else if (Y.startsWith(`${K}${SF}`)) {
        let z = Y.slice(K.length);
        return qo8(z)
    } else {
        let z = K86.relative(K, A);
        if (!z || z.startsWith(`..${SF}`) || z === "..") return null;
        else {
            let _ = K86.join(z, q);
            return qo8(_)
        }
    }
}
// @from(Ln 456610, Col 0)
function YT6(A, q) {
    let K = new Set(A.get(null) ?? []);
    for (let [Y, z] of A.entries()) {
        if (Y === null) continue;
        for (let _ of z) {
            let w = Awz({
                patternRoot: Y,
                pattern: _,
                rootPath: q
            });
            if (w) K.add(w)
        }
    }
    return Array.from(K)
}
// @from(Ln 456626, Col 0)
function zT6(A) {
    let q = PNq(A, "read", "deny"),
        K = new Map;
    for (let [Y, z] of q.entries()) K.set(Y, Array.from(z.keys()));
    return K
}
// @from(Ln 456633, Col 0)
function qwz(A, q) {
    if (A.startsWith(`${SF}${SF}`)) {
        let Y = A.slice(1);
        if (y8() === "windows" && Y.match(/^\/[a-z]\//i)) {
            let z = Y[1]?.toUpperCase() ?? "C",
                _ = Y.slice(2),
                w = `${z}:\\`;
            return {
                relativePattern: _.startsWith("/") ? _.slice(1) : _,
                root: w
            }
        }
        return {
            relativePattern: Y,
            root: SF
        }
    } else if (A.startsWith(`~${SF}`)) return {
        relativePattern: A.slice(1),
        root: U2z().normalize("NFC")
    };
    else if (A.startsWith(SF)) return {
        relativePattern: A,
        root: e2z(q)
    };
    let K = A;
    if (A.startsWith(`.${SF}`)) K = A.slice(2);
    return {
        relativePattern: K,
        root: null
    }
}
// @from(Ln 456665, Col 0)
function PNq(A, q, K) {
    let Y = (() => {
            switch (q) {
                case "edit":
                    return R4;
                case "read":
                    return s7
            }
        })(),
        z = Bn8(A, Y, K),
        _ = new Map;
    for (let [w, O] of z.entries()) {
        let {
            relativePattern: $,
            root: H
        } = qwz(w, O.source), j = _.get(H);
        if (j === void 0) j = new Map, _.set(H, j);
        j.set($, O)
    }
    return _
}
// @from(Ln 456687, Col 0)
function ZX(A, q, K, Y) {
    let z = L4(A);
    if (y8() === "windows" && z.includes("\\")) z = GP(z);
    let _ = PNq(q, K, Y);
    for (let [w, O] of _.entries()) {
        let $ = Array.from(O.keys()).map((M) => {
                let D = M;
                if (D.endsWith("/**")) D = D.slice(0, -3);
                return D
            }),
            H = jNq.default().add($),
            j = Ko8(w ?? G1(), z ?? G1());
        if (j.startsWith(`..${SF}`)) continue;
        if (!j) continue;
        let J = H.test(j);
        if (J.ignored && J.rule) {
            let M = J.rule.pattern,
                D = M + "/**";
            if (O.has(D)) return O.get(D) ?? null;
            return O.get(M) ?? null
        }
    }
    return null
}
// @from(Ln 456712, Col 0)
function gt(A, q, K) {
    if (typeof A.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
    };
    let Y = A.getPath(q),
        z = DS(Y);
    for (let j of z)
        if (j.startsWith("\\\\") || j.startsWith("//")) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, which appears to be a UNC path that could access network resources.`,
            decisionReason: {
                type: "other",
                reason: "UNC path detected (defense-in-depth check)"
            }
        };
    for (let j of z)
        if (XNq(j)) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, which contains a suspicious Windows path pattern that requires manual approval.`,
            decisionReason: {
                type: "other",
                reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
            }
        };
    for (let j of z) {
        let J = ZX(j, K, "read", "deny");
        if (J) return {
            behavior: "deny",
            message: `Permission to read ${Y} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: J
            }
        }
    }
    for (let j of z) {
        let J = ZX(j, K, "read", "ask");
        if (J) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: J
            }
        }
    }
    let _ = Xz6(A, q, K, z);
    if (_.behavior === "allow") return _;
    if (kI(Y, K, z)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "mode",
            mode: "default"
        }
    };
    let O = L4(Y),
        $ = _o8(O, q);
    if ($.behavior !== "passthrough") return $;
    let H = ZX(Y, K, "read", "allow");
    if (H) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: H
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${Y}, but you haven't granted it yet.`,
        suggestions: Zo6(Y, "read", K, z),
        decisionReason: {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        }
    }
}
// @from(Ln 456792, Col 0)
function Xz6(A, q, K, Y) {
    if (typeof A.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
    };
    let z = A.getPath(q),
        _ = Y ?? DS(z);
    for (let M of _) {
        let D = ZX(M, K, "edit", "deny");
        if (D) return {
            behavior: "deny",
            message: `Permission to edit ${z} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: D
            }
        }
    }
    let w = L4(z),
        O = zo8(w, q);
    if (O.behavior !== "passthrough") return O;
    let $ = ZX(z, K, "edit", "allow");
    if ($ && $.source === "session") {
        let M = $.ruleValue.ruleContent;
        if (M === k21 || M === E21) return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "rule",
                rule: $
            }
        }
    }
    let H = Yo8(z, _);
    if (!H.safe) return {
        behavior: "ask",
        message: H.message,
        suggestions: Zo6(z, "write", K, _),
        decisionReason: {
            type: "other",
            reason: H.message
        }
    };
    for (let M of _) {
        let D = ZX(M, K, "edit", "ask");
        if (D) return {
            behavior: "ask",
            message: `Claude requested permissions to write to ${z}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: D
            }
        }
    }
    let j = kI(z, K, _);
    if (K.mode === "acceptEdits" && j) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "mode",
            mode: K.mode
        }
    };
    let J = ZX(z, K, "edit", "allow");
    if (J) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: J
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to write to ${z}, but you haven't granted it yet.`,
        suggestions: Zo6(z, "write", K, _),
        decisionReason: !j ? {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        } : void 0
    }
}
// @from(Ln 456875, Col 0)
function Zo6(A, q, K, Y) {
    let z = !kI(A, K, Y);
    if (q === "read" && z) {
        let _ = dp(A);
        return DS(_).map(($) => ez1($, "session")).filter(($) => $ !== void 0)
    }
    if (q === "write" || q === "create") {
        let _ = [{
            type: "setMode",
            mode: "acceptEdits",
            destination: "session"
        }];
        if (z) {
            let w = dp(A),
                O = DS(w);
            _.push({
                type: "addDirectories",
                directories: O,
                destination: "session"
            })
        }
        return _
    }
    return [{
        type: "setMode",
        mode: "acceptEdits",
        destination: "session"
    }]
}
// @from(Ln 456905, Col 0)
function zo8(A, q) {
    let K = tN6(A);
    if (JNq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for writing"
        }
    };
    if (DNq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for writing"
        }
    };
    if (Mp6(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for writing"
        }
    };
    if (!Oz1() && Da(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for writing"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 456945, Col 0)
function _o8(A, q) {
    let K = tN6(A);
    if (o2z(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Session memory files are allowed for reading"
        }
    };
    if (a2z(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Project directory files are allowed for reading"
        }
    };
    if (JNq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for reading"
        }
    };
    let Y = xt(),
        z = Y.endsWith(sf) ? Y : Y + sf;
    if (K === Y || K.startsWith(z)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Tool result files are allowed for reading"
        }
    };
    if (DNq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for reading"
        }
    };
    let _ = z91();
    if (K.startsWith(_)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Project temp directory files are allowed for reading"
        }
    };
    if (Mp6(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for reading"
        }
    };
    if (Da(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for reading"
        }
    };
    let w = Bh(c8(), "tasks") + sf;
    if (K === w.slice(0, -1) || K.startsWith(w)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Task files are allowed for reading"
        }
    };
    let O = Bh(c8(), "teams") + sf;
    if (K === O.slice(0, -1) || K.startsWith(O)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Team files are allowed for reading"
        }
    };
    let $ = ll8() + sf;
    if (K.startsWith($)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Bundled skill reference files are allowed for reading"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 457046, Col 4)
jNq
// @from(Ln 457046, Col 9)
l2z
// @from(Ln 457046, Col 14)
i2z
// @from(Ln 457046, Col 19)
SF
// @from(Ln 457046, Col 23)
_k
// @from(Ln 457046, Col 27)
ll8
// @from(Ln 457046, Col 32)
t2z
// @from(Ln 457047, Col 4)
RY = E(() => {
    T1();
    HA();
    lA();
    F9();
    lx();
    Oq();
    YK();
    F9();
    F$();
    Bj();
    J_();
    i8();
    O2();
    SA();
    U4();
    W01();
    rH();
    ZR();
    yI();
    mH();
    A8();
    jNq = t(Kq6(), 1), l2z = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json", ".claude.json"], i2z = [".git", ".vscode", ".idea", ".claude"];
    SF = K86.sep;
    _k = e1(function() {
        let q = process.env.CLAUDE_CODE_TMPDIR || (y8() === "windows" ? d2z() : "/tmp"),
            K = $1(),
            Y = q;
        try {
            Y = K.realpathSync(q)
        } catch {}
        return Bh(Y, IN8()) + sf
    }), ll8 = e1(function() {
        let q = c2z(16).toString("hex");
        return Bh(_k(), "bundled-skills", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION, q)
    });
    t2z = e1(DS)
})
// @from(Ln 457101, Col 0)
function nV8(A) {
    let q = A.length;
    if (q <= wo8) return A.map((Y) => `'${Y}'`).join(", ");
    return `${A.slice(0,wo8).map((Y)=>`'${Y}'`).join(", ")}, and ${q-wo8} more`
}
// @from(Ln 457107, Col 0)
function Ywz(A) {
    let q = A.match(GNq);
    if (!q || q.index === void 0) return A;
    let K = A.substring(0, q.index),
        Y = y8() === "windows" ? Math.max(K.lastIndexOf("/"), K.lastIndexOf("\\")) : K.lastIndexOf("/");
    if (Y === -1) return ".";
    return K.substring(0, Y) || "/"
}
// @from(Ln 457116, Col 0)
function at(A) {
    if (A === "~" || A.startsWith("~/") || process.platform === "win32" && A.startsWith("~\\")) return ZNq() + A.slice(1);
    return A
}
// @from(Ln 457121, Col 0)
function zwz(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    let {
        allowOnly: q,
        denyWithinAllow: K
    } = vA.getFsWriteConfig(), Y = DS(A), z = q.flatMap(WNq), _ = K.flatMap(WNq);
    return Y.every((w) => {
        for (let O of _)
            if (Iv(w, O)) return !1;
        return z.some((O) => Iv(w, O))
    })
}
// @from(Ln 457134, Col 0)
function Ho8(A, q, K, Y) {
    let z = K === "read" ? "read" : "edit",
        _ = ZX(A, q, z, "deny");
    if (_ !== null) return {
        allowed: !1,
        decisionReason: {
            type: "rule",
            rule: _
        }
    };
    if (K !== "read") {
        let $ = Yo8(A, Y);
        if (!$.safe) return {
            allowed: !1,
            decisionReason: {
                type: "other",
                reason: $.message
            }
        }
    }
    let w = kI(A, q, Y);
    if (w) {
        if (K === "read" || q.mode === "acceptEdits") return {
            allowed: !0
        }
    }
    if (K === "read") {
        let $ = _o8(A, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (K !== "read") {
        let $ = zo8(A, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (K !== "read" && !w && zwz(A)) return {
        allowed: !0,
        decisionReason: {
            type: "other",
            reason: "Path is in sandbox write allowlist"
        }
    };
    let O = ZX(A, q, z, "allow");
    if (O !== null) return {
        allowed: !0,
        decisionReason: {
            type: "rule",
            rule: O
        }
    };
    return {
        allowed: !1
    }
}
// @from(Ln 457194, Col 0)
function _wz(A, q, K, Y) {
    if (Or(A)) {
        let H = Oo8(A) ? A : $o8(q, A),
            {
                resolvedPath: j,
                isCanonical: J
            } = qO($1(), H),
            M = Ho8(j, K, Y, J ? [j] : void 0);
        return {
            allowed: M.allowed,
            resolvedPath: j,
            decisionReason: M.decisionReason
        }
    }
    let z = Ywz(A),
        _ = Oo8(z) ? z : $o8(q, z),
        {
            resolvedPath: w,
            isCanonical: O
        } = qO($1(), _),
        $ = Ho8(w, K, Y, O ? [w] : void 0);
    return {
        allowed: $.allowed,
        resolvedPath: w,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 457222, Col 0)
function Jz4(A) {
    if (A === "*" || A.endsWith("/*")) return !0;
    let q = A === "/" ? A : A.replace(/\/$/, "");
    if (q === "/") return !0;
    let K = ZNq();
    if (q === K) return !0;
    if (Kwz(q) === "/") return !0;
    return !1
}
// @from(Ln 457232, Col 0)
function rV8(A, q, K, Y) {
    let z = at(A.replace(/^['"]|['"]$/g, ""));
    if (r36(z)) return {
        allowed: !1,
        resolvedPath: z,
        decisionReason: {
            type: "other",
            reason: "UNC network paths require manual approval"
        }
    };
    if (z.startsWith("~")) return {
        allowed: !1,
        resolvedPath: z,
        decisionReason: {
            type: "other",
            reason: "Tilde expansion variants (~user, ~+, ~-) in paths require manual approval"
        }
    };
    if (z.includes("$") || z.includes("%") || z.startsWith("=")) return {
        allowed: !1,
        resolvedPath: z,
        decisionReason: {
            type: "other",
            reason: "Shell expansion syntax in paths requires manual approval"
        }
    };
    if (GNq.test(z)) {
        if (Y === "write" || Y === "create") return {
            allowed: !1,
            resolvedPath: z,
            decisionReason: {
                type: "other",
                reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
            }
        };
        return _wz(z, q, K, Y)
    }
    let _ = Oo8(z) ? z : $o8(q, z),
        {
            resolvedPath: w,
            isCanonical: O
        } = qO($1(), _),
        $ = Ho8(w, K, Y, O ? [w] : void 0);
    return {
        allowed: $.allowed,
        resolvedPath: w,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 457281, Col 4)
wo8 = 5
// @from(Ln 457282, Col 4)
GNq
// @from(Ln 457282, Col 9)
WNq
// @from(Ln 457283, Col 4)
J01 = E(() => {
    SA();
    RY();
    U4();
    Lz();
    F9();
    W01();
    YK();
    GNq = /[*?[\]{}]/;
    WNq = e1(DS)
})
// @from(Ln 457298, Col 0)
function $wz() {
    if (Uk6()) return fNq;
    if (t6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return fNq;
    return Owz
}
// @from(Ln 457304, Col 0)
function eH() {
    let A = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    if (A) return at(A);
    return wwz(c8(), $wz())
}
// @from(Ln 457310, Col 0)
function tB() {
    let A = process.env.CLAUDE_CODE_PLUGIN_SEED_DIR;
    return A ? at(A) : void 0
}
// @from(Ln 457314, Col 4)
Owz = "plugins"
// @from(Ln 457315, Col 4)
fNq = "cowork_plugins"
// @from(Ln 457316, Col 4)
ze = E(() => {
    A8();
    J01();
    T1()
})
// @from(Ln 457329, Col 0)
async function Pz6(A) {
    let q = vNq(Jwz(eH(), "cache"));
    if (A && !Xwz(A, q)) return [];
    if (c_6 !== null) return c_6;
    try {
        return c_6 = (await yV(["--files", "--hidden", "--no-ignore", "--max-depth", "4", "--glob", Dwz], q, new AbortController().signal)).map((Y) => {
            let z = Hwz(Y);
            return `!**/${(jwz(z)?Mwz(q,z):z).replace(/\\/g,"/")}/**`
        }), c_6
    } catch {
        return c_6 = [], c_6
    }
}
// @from(Ln 457343, Col 0)
function uXq() {
    c_6 = null
}
// @from(Ln 457347, Col 0)
function Xwz(A, q) {
    let K = TNq(A),
        Y = TNq(q);
    return K === Y || K === rS1 || Y === rS1 || K.startsWith(Y + rS1) || Y.startsWith(K + rS1)
}
// @from(Ln 457353, Col 0)
function TNq(A) {
    let q = vNq(A);
    return process.platform === "win32" ? q.toLowerCase() : q
}
// @from(Ln 457357, Col 4)
Dwz = ".orphaned_at"
// @from(Ln 457358, Col 4)
c_6 = null
// @from(Ln 457359, Col 4)
yl6 = E(() => {
    jy();
    ze()
})
// @from(Ln 457363, Col 0)
class NNq {
    cache = new Map;
    maxCacheSize = 1000;
    readFile(A) {
        let q = $1(),
            K;
        try {
            K = q.statSync(A)
        } catch (O) {
            throw this.cache.delete(A), O
        }
        let Y = A,
            z = this.cache.get(Y);
        if (z && z.mtime === K.mtimeMs) return {
            content: z.content,
            encoding: z.encoding
        };
        let _ = d66(A),
            w = q.readFileSync(A, {
                encoding: _
            }).replaceAll(`\r
`, `
`);
        if (this.cache.set(Y, {
                content: w,
                encoding: _,
                mtime: K.mtimeMs
            }), this.cache.size > this.maxCacheSize) {
            let O = this.cache.keys().next().value;
            if (O) this.cache.delete(O)
        }
        return {
            content: w,
            encoding: _
        }
    }
    clear() {
        this.cache.clear()
    }
    invalidate(A) {
        this.cache.delete(A)
    }
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        }
    }
}
// @from(Ln 457412, Col 4)
VNq
// @from(Ln 457413, Col 4)
kNq = E(() => {
    SA();
    Z7();
    VNq = new NNq
})
// @from(Ln 457440, Col 0)
async function uK(A) {
    try {
        return await hNq(A), !0
    } catch {
        return !1
    }
}
// @from(Ln 457448, Col 0)
function fwz(A) {
    let q = /[*?[{]/,
        K = A.match(q);
    if (!K || K.index === void 0) {
        let O = Go6(A),
            $ = oS1(A);
        return {
            baseDir: O,
            relativePattern: $
        }
    }
    let Y = A.slice(0, K.index),
        z = Math.max(Y.lastIndexOf("/"), Y.lastIndexOf(l_6));
    if (z === -1) return {
        baseDir: "",
        relativePattern: A
    };
    let _ = Y.slice(0, z),
        w = A.slice(z + 1);
    if (_ === "" && z === 0) _ = "/";
    if (y8() === "windows" && /^[A-Za-z]:$/.test(_)) _ = _ + l_6;
    return {
        baseDir: _,
        relativePattern: w
    }
}
// @from(Ln 457474, Col 0)
async function $s4(A, q, {
    limit: K,
    offset: Y
}, z, _) {
    let w = q,
        O = A;
    if (jo8(A)) {
        let {
            baseDir: W,
            relativePattern: Z
        } = fwz(A);
        if (W) w = W, O = Z
    }
    let $ = YT6(zT6(_), w),
        H = t6(process.env.CLAUDE_CODE_GLOB_NO_IGNORE || "true"),
        j = t6(process.env.CLAUDE_CODE_GLOB_HIDDEN || "true"),
        J = ["--files", "--glob", O, "--sort=modified", ...H ? ["--no-ignore"] : [], ...j ? ["--hidden"] : []];
    for (let W of $) J.push("--glob", `!${W}`);
    for (let W of await Pz6(w)) J.push("--glob", W);
    let D = (await yV(J, w, z)).map((W) => jo8(W) ? W : i_6(w, W)),
        X = D.length > Y + K;
    return {
        files: D.slice(Y, Y + K),
        truncated: X
    }
}
// @from(Ln 457501, Col 0)
function hYq(A) {
    try {
        return $1().readFileSync(A, {
            encoding: "utf8"
        })
    } catch (q) {
        return _6(q), null
    }
}
// @from(Ln 457511, Col 0)
function Jh(A) {
    let q = $1();
    return Math.floor(q.statSync(A).mtimeMs)
}
// @from(Ln 457516, Col 0)
function l66(A, q, K, Y) {
    let z = q;
    if (Y === "CRLF") z = q.split(`
`).join(`\r
`);
    nN6(A, z, {
        encoding: K
    })
}
// @from(Ln 457526, Col 0)
function SNq(A) {
    let {
        buffer: q,
        bytesRead: K
    } = $1().readSync(A, {
        length: 4096
    });
    if (K === 0) return "utf8";
    if (K >= 2) {
        if (q[0] === 255 && q[1] === 254) return "utf16le"
    }
    if (K >= 3 && q[0] === 239 && q[1] === 187 && q[2] === 191) return "utf8";
    return "utf8"
}
// @from(Ln 457541, Col 0)
function d66(A) {
    try {
        let q = $1(),
            {
                resolvedPath: K
            } = qO(q, A);
        return SNq(K)
    } catch (q) {
        let K = q.code;
        if (K === "ENOENT" || K === "EACCES" || K === "EPERM") k(`detectFileEncoding failed for expected reason: ${K}`, {
            level: "debug"
        });
        else _6(q);
        return "utf8"
    }
}
// @from(Ln 457558, Col 0)
function vn8(A, q = "utf8") {
    try {
        let K = $1(),
            {
                resolvedPath: Y
            } = qO(K, A),
            {
                buffer: z,
                bytesRead: _
            } = K.readSync(Y, {
                length: 4096
            }),
            w = z.toString(q, 0, _);
        return CNq(w)
    } catch (K) {
        return _6(K), "LF"
    }
}
// @from(Ln 457577, Col 0)
function CNq(A) {
    let q = 0,
        K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === `
`)
            if (Y > 0 && A[Y - 1] === "\r") q++;
            else K++;
    return q > K ? "CRLF" : "LF"
}
// @from(Ln 457588, Col 0)
function vU(A) {
    return A.replace(/^\t+/gm, (q) => "  ".repeat(q.length))
}
// @from(Ln 457592, Col 0)
function Twz(A) {
    let q = A ? L4(A) : void 0,
        K = q ? yNq(G1(), q) : void 0;
    return {
        absolutePath: q,
        relativePath: K
    }
}
// @from(Ln 457601, Col 0)
function $K(A) {
    let {
        relativePath: q
    } = Twz(A);
    if (q && !q.startsWith("..")) return q;
    let K = RNq();
    if (A.startsWith(K + l_6)) return "~" + A.slice(K.length);
    return A
}
// @from(Ln 457611, Col 0)
function uP1(A) {
    let q = $1();
    try {
        let K = Go6(A),
            Y = oS1(A, Jo8(A)),
            w = q.readdirSync(K).filter((O) => oS1(O.name, Jo8(O.name)) === Y && i_6(K, O.name) !== A)[0];
        if (w) return w.name;
        return
    } catch (K) {
        if (K.code !== "ENOENT") _6(K);
        return
    }
}
// @from(Ln 457624, Col 0)
async function Ft(A) {
    let q = G1(),
        K = Go6(q),
        Y = A;
    try {
        let O = await Gwz(Go6(A));
        Y = i_6(O, oS1(A))
    } catch {}
    let z = K === l_6 ? l_6 : K + l_6;
    if (!Y.startsWith(z) || Y.startsWith(q + l_6) || Y === q) return;
    let _ = yNq(K, Y),
        w = i_6(q, _);
    try {
        return await hNq(w), w
    } catch {
        return
    }
}
// @from(Ln 457643, Col 0)
function Kw1({
    content: A,
    startLine: q
}) {
    if (!A) return "";
    return A.split(/\r?\n/).map((Y, z) => {
        let _ = z + q,
            w = String(_);
        if (w.length >= 6) return `${w}→${Y}`;
        return `${w.padStart(6," ")}→${Y}`
    }).join(`
`)
}
// @from(Ln 457657, Col 0)
function N84(A) {
    try {
        return $1().isDirEmptySync(A)
    } catch (q) {
        return q.code === "ENOENT"
    }
}
// @from(Ln 457665, Col 0)
function IM(A) {
    return i66(A).content
}
// @from(Ln 457669, Col 0)
function i66(A) {
    let q = $1(),
        {
            resolvedPath: K,
            isSymlink: Y
        } = qO(q, A);
    if (Y) k(`Reading through symlink: ${A} -> ${K}`);
    let z = SNq(K),
        _ = q.readFileSync(K, {
            encoding: z
        }),
        w = CNq(_.slice(0, 4096));
    return {
        content: _.replaceAll(`\r
`, `
`),
        encoding: z,
        lineEndings: w
    }
}
// @from(Ln 457690, Col 0)
function LO8(A) {
    let {
        content: q
    } = VNq.readFile(A);
    return q
}
// @from(Ln 457697, Col 0)
function nN6(A, q, K = {
    encoding: "utf-8"
}) {
    let Y = $1(),
        z = A;
    if (Y.existsSync(A)) try {
        let w = Y.readlinkSync(A);
        z = jo8(w) ? w : Pwz(Go6(A), w), k(`Writing through symlink: ${A} -> ${z}`)
    } catch (w) {
        z = A
    }
    let _ = `${z}.tmp.${process.pid}.${Date.now()}`;
    try {
        k(`Writing to temp file: ${_}`);
        let w, O = Y.existsSync(z);
        if (O) w = Y.statSync(z).mode, k(`Preserving file permissions: ${w.toString(8)}`);
        else if (K.mode !== void 0) w = K.mode, k(`Setting permissions for new file: ${w.toString(8)}`);
        let $ = {
            encoding: K.encoding,
            flush: !0
        };
        if (!O && K.mode !== void 0) $.mode = K.mode;
        if (ENq(_, q, $), k(`Temp file written successfully, size: ${q.length} bytes`), O && w !== void 0) Zwz(_, w), k("Applied original permissions to temp file");
        k(`Renaming ${_} to ${z}`), Y.renameSync(_, z), k(`File ${z} written atomically`)
    } catch (w) {
        k(`Failed to write file atomically: ${w}`, {
            level: "error"
        }), d("tengu_atomic_write_error", {});
        try {
            if (Y.existsSync(_)) k(`Cleaning up temp file: ${_}`), Y.unlinkSync(_)
        } catch (O) {
            k(`Failed to clean up temp file: ${O}`)
        }
        k(`Falling back to non-atomic write for ${z}`);
        try {
            let O = {
                encoding: K.encoding,
                flush: !0
            };
            if (!Y.existsSync(z) && K.mode !== void 0) O.mode = K.mode;
            ENq(z, q, O), k(`File ${z} written successfully with non-atomic fallback`)
        } catch (O) {
            throw k(`Non-atomic write also failed: ${O}`), O
        }
    }
}
// @from(Ln 457744, Col 0)
function xq(A) {
    let q = A / 1024;
    if (q < 1) return `${A} bytes`;
    if (q < 1024) return `${q.toFixed(1).replace(/\.0$/,"")}KB`;
    let K = q / 1024;
    if (K < 1024) return `${K.toFixed(1).replace(/\.0$/,"")}MB`;
    return `${(K/1024).toFixed(1).replace(/\.0$/,"")}GB`
}
// @from(Ln 457753, Col 0)
function iXq() {
    let A = y8(),
        q = RNq();
    if (A === "macos") return i_6(q, "Desktop");
    if (A === "windows") {
        let Y = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
        if (Y) {
            let _ = `/mnt/c${Y.replace(/^[A-Z]:/,"")}/Desktop`;
            if ($1().existsSync(_)) return _
        }
        try {
            let _ = $1().readdirSync("/mnt/c/Users");
            for (let w of _) {
                if (w.name === "Public" || w.name === "Default" || w.name === "Default User" || w.name === "All Users") continue;
                let O = i_6("/mnt/c/Users", w.name, "Desktop");
                if ($1().existsSync(O)) return O
            }
        } catch (z) {
            _6(z)
        }
    }
    let K = i_6(q, "Desktop");
    if ($1().existsSync(K)) return K;
    return q
}
// @from(Ln 457779, Col 0)
function st(A) {
    let q = Jo8(A);
    if (!q) return "unknown";
    return LNq?.(q.slice(1))?.name ?? "unknown"
}
// @from(Ln 457785, Col 0)
function Oqq(A, q = mN8) {
    try {
        return $1().statSync(A).size <= q
    } catch {
        return !1
    }
}
// @from(Ln 457793, Col 0)
function $$(A) {
    let q = Wwz(A);
    if (y8() === "windows") q = q.replace(/\//g, "\\").toLowerCase();
    return q
}
// @from(Ln 457799, Col 0)
function fGq(A, q) {
    return $$(A) === $$(q)
}
// @from(Ln 457802, Col 4)
LNq
// @from(Ln 457802, Col 9)
mN8 = 262144
// @from(Ln 457803, Col 4)
ra4
// @from(Ln 457803, Col 9)
wZ = "Note: your current working directory is"
// @from(Ln 457804, Col 4)
Z7 = E(() => {
    k1();
    H1();
    A8();
    V1();
    jy();
    yl6();
    lA();
    U4();
    SA();
    kNq();
    RY();
    YK();
    F9();
    Promise.resolve().then(() => t(rE8(), 1)).then((A) => {
        LNq = A.getLanguage
    });
    ra4 = e1(async () => {
        let A = await JJA(G1(), AbortSignal.timeout(1000), 15),
            q = 0;
        for (let K of A)
            if (vn8(K) === "CRLF") q++;
        return q > 3 ? "CRLF" : "LF"
    })
})
// @from(Ln 457829, Col 4)
Vo6 = {}
// @from(Ln 457877, Col 0)
function Ewz(A) {
    return BNq.includes(A)
}
// @from(Ln 457881, Col 0)
function ywz() {
    FNq = !1
}
// @from(Ln 457885, Col 0)
function l_() {
    return FNq ||= Lwz()
}
// @from(Ln 457889, Col 0)
function Lwz() {
    if (Qw6()) return !0;
    let A = X1(),
        q = AC1();
    if (A.projects?.[q]?.hasTrustDialogAccepted) return !0;
    let Y = lL6(G1());
    while (!0) {
        if (A.projects?.[Y]?.hasTrustDialogAccepted) return !0;
        let _ = lL6(uNq(Y, ".."));
        if (_ === Y) break;
        Y = _
    }
    return !1
}
// @from(Ln 457904, Col 0)
function Rwz(A) {
    return gNq.includes(A)
}
// @from(Ln 457908, Col 0)
function eS1(A) {
    let q = gN.config;
    if (!q) return !1;
    let K = q.oauthAccount !== void 0 && A.oauthAccount === void 0,
        Y = q.hasCompletedOnboarding === !0 && A.hasCompletedOnboarding !== !0;
    return K || Y
}
// @from(Ln 457916, Col 0)
function d1(A) {
    try {
        if (QNq(xD(), Kx, (K) => {
                let Y = A(K);
                if (Y === K) return K;
                return {
                    ...Y,
                    projects: bNq(K.projects)
                }
            })) gN.config = null, gN.mtime = 0, tS1 = 0
    } catch (q) {
        k(`Failed to save config with lock: ${q}`, {
            level: "error"
        });
        let K = r_6(xD(), Kx);
        if (eS1(K)) {
            k("saveGlobalConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", {
                level: "error"
            }), d("tengu_config_auth_loss_prevented", {});
            return
        }
        let Y = A(K);
        if (Y === K) return;
        pNq(xD(), {
            ...Y,
            projects: bNq(K.projects)
        }, Kx), gN.config = null, gN.mtime = 0, tS1 = 0
    }
}
// @from(Ln 457946, Col 0)
function hwz() {
    return Wo8
}
// @from(Ln 457950, Col 0)
function Cwz() {
    let A = eN6 + aS1;
    if (A > 0) d("tengu_config_cache_stats", {
        cache_hits: eN6,
        cache_misses: aS1,
        hit_rate: eN6 / A
    });
    eN6 = 0, aS1 = 0
}
// @from(Ln 457960, Col 0)
function INq(A) {
    if (A.installMethod !== void 0) return A;
    let q = "unknown",
        K = A.autoUpdates ?? !0;
    switch (A.autoUpdaterStatus) {
        case "migrated":
            q = "local";
            break;
        case "installed":
            q = "native";
            break;
        case "disabled":
            K = !1;
            break;
        case "enabled":
        case "no_permissions":
        case "not_configured":
            q = "global";
            break;
        case void 0:
            break
    }
    return {
        ...A,
        installMethod: q,
        autoUpdates: K
    }
}
// @from(Ln 457989, Col 0)
function bNq(A) {
    if (!A) return A;
    let q = {},
        K = !1;
    for (let [Y, z] of Object.entries(A))
        if (z.history !== void 0) {
            K = !0;
            let {
                history: _,
                ...w
            } = z;
            q[Y] = w
        } else q[Y] = z;
    return K ? q : A
}
// @from(Ln 458005, Col 0)
function X1() {
    try {
        let A = performance.now();
        if (gN.config && A - tS1 < Iwz) return eN6++, gN.config;
        let q = null;
        try {
            q = $1().statSync(xD())
        } catch {}
        if (tS1 = A, gN.config && q) {
            if (q.mtimeMs <= gN.mtime) return eN6++, gN.config
        }
        aS1++;
        let K = INq(r_6(xD(), Kx));
        if (q) gN = {
            config: K,
            mtime: q.mtimeMs
        }, n_6 = {
            mtime: q.mtimeMs,
            size: q.size
        };
        else gN = {
            config: K,
            mtime: Date.now()
        }, n_6 = null;
        return K
    } catch {
        return INq(r_6(xD(), Kx))
    }
}
// @from(Ln 458035, Col 0)
function e66() {
    let A = X1().remoteControlAtStartup;
    if (A !== void 0) return A;
    return !1
}
// @from(Ln 458041, Col 0)
function To6(A) {
    let q = X1();
    if (q.customApiKeyResponses?.approved?.includes(A)) return "approved";
    if (q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
    return "new"
}
// @from(Ln 458048, Col 0)
function pNq(A, q, K) {
    let Y = sS1(A);
    $1().mkdirSync(Y);
    let _ = Object.fromEntries(Object.entries(q).filter(([w, O]) => B6(O) !== B6(K[w])));
    if (nN6(A, B6(_, null, 2), {
            encoding: "utf-8",
            mode: 384
        }), A === xD()) Wo8++
}
// @from(Ln 458058, Col 0)
function QNq(A, q, K) {
    let Y = sS1(A),
        z = $1();
    z.mkdirSync(Y);
    let _;
    try {
        let w = `${A}.lock`,
            O = Date.now();
        _ = mNq.lockSync(A, {
            lockfilePath: w,
            onCompromised: (M) => {
                k(`Config lock compromised: ${M}`, {
                    level: "error"
                })
            }
        });
        let $ = Date.now() - O;
        if ($ > 100) k("Lock acquisition took longer than expected - another Claude instance may be running"), d("tengu_config_lock_contention", {
            lock_time_ms: $
        });
        if (n_6 && A === xD()) try {
            let M = z.statSync(A);
            if (M.mtimeMs !== n_6.mtime || M.size !== n_6.size) d("tengu_config_stale_write", {
                read_mtime: n_6.mtime,
                write_mtime: M.mtimeMs,
                read_size: n_6.size,
                write_size: M.size
            })
        } catch (M) {
            if (M.code !== "ENOENT") throw M
        }
        let H = r_6(A, q);
        if (A === xD() && eS1(H)) return k("saveConfigWithLock: re-read config is missing auth that cache has; refusing to write to avoid wiping ~/.claude.json. See GH #3117.", {
            level: "error"
        }), d("tengu_config_auth_loss_prevented", {}), !1;
        let j = K(H);
        if (j === H) return !1;
        let J = Object.fromEntries(Object.entries(j).filter(([M, D]) => B6(D) !== B6(q[M])));
        try {
            let M = Po8(A),
                D = Zo8();
            try {
                z.mkdirSync(D)
            } catch (N) {
                if (N.code !== "EEXIST") throw N
            }
            let X = 60000,
                P = z.readdirStringSync(D).filter((N) => N.startsWith(`${M}.backup.`)).sort().reverse(),
                W = P[0],
                Z = W ? Number(W.split(".backup.").pop()) : 0,
                G = Number.isNaN(Z) || Date.now() - Z >= X;
            if (G) {
                let N = tf(D, `${M}.backup.${Date.now()}`);
                z.copyFileSync(A, N)
            }
            let f = 5,
                v = G ? z.readdirStringSync(D).filter((N) => N.startsWith(`${M}.backup.`)).sort().reverse() : P;
            for (let N of v.slice(f)) try {
                z.unlinkSync(tf(D, N))
            } catch {}
            try {
                let N = sS1(A),
                    V = z.readdirStringSync(N).filter((L) => L.startsWith(`${M}.backup.`) || L.startsWith(`${M}.corrupted.`));
                for (let L of V) try {
                    z.unlinkSync(tf(N, L))
                } catch {}
            } catch {}
        } catch (M) {
            if (M.code !== "ENOENT") k(`Failed to backup config: ${M}`, {
                level: "error"
            })
        }
        if (nN6(A, B6(J, null, 2), {
                encoding: "utf-8",
                mode: 384
            }), A === xD()) Wo8++;
        return !0
    } finally {
        if (_) _()
    }
}
// @from(Ln 458140, Col 0)
function vo6() {
    if (Do8) return;
    let A = Date.now();
    U1("info", "enable_configs_started"), Do8 = !0, r_6(xD(), Kx, !0), U1("info", "enable_configs_completed", {
        duration_ms: Date.now() - A
    })
}
// @from(Ln 458148, Col 0)
function Zo8() {
    return tf(c8(), "backups")
}
// @from(Ln 458152, Col 0)
function xNq(A) {
    let q = $1(),
        K = Po8(A),
        Y = Zo8();
    try {
        let _ = q.readdirStringSync(Y).filter((w) => w.startsWith(`${K}.backup.`)).sort().reverse();
        if (_.length > 0) return tf(Y, _[0])
    } catch {}
    let z = sS1(A);
    try {
        let _ = q.readdirStringSync(z).filter((O) => O.startsWith(`${K}.backup.`)).sort().reverse();
        if (_.length > 0) return tf(z, _[0]);
        let w = `${A}.backup`;
        try {
            return q.statSync(w), w
        } catch {}
    } catch {}
    return null
}
// @from(Ln 458172, Col 0)
function r_6(A, q, K) {
    if (!Do8) throw Error("Config accessed before allowed.");
    let Y = $1();
    try {
        let z = Y.readFileSync(A, {
            encoding: "utf-8"
        });
        try {
            let _ = i1(b$6(z));
            return {
                ...rw6(q),
                ..._
            }
        } catch (_) {
            let w = _ instanceof Error ? _.message : String(_);
            throw new MG(w, A, q)
        }
    } catch (z) {
        if (z.code === "ENOENT") {
            let w = xNq(A);
            if (w) process.stderr.write(`
Claude configuration file not found at: ${A}
A backup file exists at: ${w}
You can manually restore it by running: cp "${w}" "${A}"

`);
            return rw6(q)
        }
        if (z instanceof MG && K) throw z;
        if (z instanceof MG) {
            if (k(`Config file corrupted, resetting to defaults: ${z.message}`, {
                    level: "error"
                }), !Mo8) {
                Mo8 = !0;
                try {
                    _6(z);
                    let D = !1;
                    try {
                        Y.statSync(`${A}.backup`), D = !0
                    } catch {}
                    d("tengu_config_parse_error", {
                        has_backup: D
                    })
                } finally {
                    Mo8 = !1
                }
            }
            process.stderr.write(`
Claude configuration file at ${A} is corrupted: ${z.message}
`);
            let w = Po8(A),
                O = Zo8();
            try {
                Y.mkdirSync(O)
            } catch (D) {
                if (D.code !== "EEXIST") throw D
            }
            let $ = Y.readdirStringSync(O).filter((D) => D.startsWith(`${w}.corrupted.`)),
                H, j = !1,
                J = Y.readFileSync(A, {
                    encoding: "utf-8"
                });
            for (let D of $) try {
                let X = Y.readFileSync(tf(O, D), {
                    encoding: "utf-8"
                });
                if (J === X) {
                    j = !0;
                    break
                }
            } catch {}
            if (!j) {
                H = tf(O, `${w}.corrupted.${Date.now()}`);
                try {
                    Y.copyFileSync(A, H), k(`Corrupted config backed up to: ${H}`, {
                        level: "error"
                    })
                } catch {}
            }
            let M = xNq(A);
            if (H) process.stderr.write(`The corrupted file has been backed up to: ${H}
`);
            else if (j) process.stderr.write(`The corrupted file has already been backed up.
`);
            if (M) process.stderr.write(`A backup file exists at: ${M}
You can manually restore it by running: cp "${M}" "${A}"

`);
            else process.stderr.write(`
`)
        }
        return rw6(q)
    }
}
// @from(Ln 458267, Col 0)
function d2() {
    let A = AC1(),
        q = X1();
    if (!q.projects) return fo6;
    let K = q.projects[A] ?? fo6;
    if (typeof K.allowedTools === "string") K.allowedTools = WK(K.allowedTools) ?? [];
    return K
}
// @from(Ln 458276, Col 0)
function c2(A) {
    let q = AC1();
    try {
        QNq(xD(), Kx, (K) => {
            let Y = K.projects?.[q] ?? fo6,
                z = A(Y);
            if (z === Y) return K;
            return {
                ...K,
                projects: {
                    ...K.projects,
                    [q]: z
                }
            }
        })
    } catch (K) {
        k(`Failed to save config with lock: ${K}`, {
            level: "error"
        });
        let Y = r_6(xD(), Kx);
        if (eS1(Y)) {
            k("saveCurrentProjectConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", {
                level: "error"
            }), d("tengu_config_auth_loss_prevented", {});
            return
        }
        let z = Y.projects?.[q] ?? fo6,
            _ = A(z);
        if (_ === z) return;
        pNq(xD(), {
            ...Y,
            projects: {
                ...Y.projects,
                [q]: _
            }
        }, Kx)
    }
}
// @from(Ln 458315, Col 0)
function CF() {
    return hY6() !== null
}
// @from(Ln 458319, Col 0)
function Qv6() {
    return CF() && !t6(process.env.FORCE_AUTOUPDATE_PLUGINS)
}
// @from(Ln 458323, Col 0)
function hY6() {
    if (t6(process.env.DISABLE_AUTOUPDATER)) return "DISABLE_AUTOUPDATER set";
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC set";
    let A = X1();
    if (A.autoUpdates === !1 && (A.installMethod !== "native" || A.autoUpdatesProtectedForNative !== !0)) return "config";
    return null
}
// @from(Ln 458331, Col 0)
function No6() {
    if (t6(process.env.DISABLE_COST_WARNINGS)) return !1;
    if (iA()) return !1;
    let q = aR(),
        K = RV() !== null;
    if (!q.hasToken && !K) return !1;
    let Y = X1(),
        z = Y.oauthAccount?.organizationRole,
        _ = Y.oauthAccount?.workspaceRole;
    if (!z || !_) return !1;
    return ["admin", "billing"].includes(z) || ["workspace_admin", "workspace_billing"].includes(_)
}
// @from(Ln 458344, Col 0)
function wA4(A) {
    Xo8 = A
}
// @from(Ln 458348, Col 0)
function fI() {
    if (Xo8 !== null) return Xo8;
    if (!iA()) return !1;
    let A = CK();
    if (A === "max" || A === "pro") return !0;
    let K = X1().oauthAccount?.organizationRole;
    return !!K && ["admin", "billing", "owner", "primary_owner"].includes(K)
}
// @from(Ln 458357, Col 0)
function Jy() {
    let A = X1();
    if (A.userID) return A.userID;
    let q = Nwz(32).toString("hex");
    return d1((K) => ({
        ...K,
        userID: q
    })), q
}
// @from(Ln 458367, Col 0)
function CG1() {
    let A = X1();
    if (A.anonymousId) return A.anonymousId;
    let q = `claudecode.v1.${Vwz()}`;
    return d1((K) => ({
        ...K,
        anonymousId: q
    })), q
}
// @from(Ln 458377, Col 0)
function Go8() {
    if (!X1().firstStartTime) {
        let q = new Date().toISOString();
        d1((K) => ({
            ...K,
            firstStartTime: K.firstStartTime ?? q
        }))
    }
}
// @from(Ln 458387, Col 0)
function PI(A) {
    let q = AA();
    if (A === "ExperimentalUltraClaudeMd") return PI("User");
    switch (A) {
        case "User":
            return tf(c8(), "CLAUDE.md");
        case "Local":
            return tf(q, "CLAUDE.local.md");
        case "Project":
            return tf(q, "CLAUDE.md");
        case "Managed":
            return tf(bW(), "CLAUDE.md");
        case "ExperimentalUltraClaudeMd":
            return tf(c8(), "ULTRACLAUDE.md");
        case "AutoMem":
            return $z1()
    }
    return kwz.getTeamMemEntrypoint()
}
// @from(Ln 458407, Col 0)
function BD1() {
    return tf(bW(), ".claude", "rules")
}
// @from(Ln 458411, Col 0)
function gD1() {
    return tf(c8(), "rules")
}
// @from(Ln 458415, Col 0)
function uwz(A) {
    gN.config = A, gN.mtime = A ? Date.now() : 0
}
// @from(Ln 458418, Col 4)
mNq
// @from(Ln 458418, Col 9)
kwz
// @from(Ln 458418, Col 14)
Mo8 = !1
// @from(Ln 458419, Col 4)
fo6
// @from(Ln 458419, Col 9)
Kx
// @from(Ln 458419, Col 13)
BNq
// @from(Ln 458419, Col 18)
gNq
// @from(Ln 458419, Col 23)
FNq = !1
// @from(Ln 458420, Col 4)
YZ$
// @from(Ln 458420, Col 9)
zZ$
// @from(Ln 458420, Col 14)
gN
// @from(Ln 458420, Col 18)
n_6 = null
// @from(Ln 458421, Col 4)
eN6 = 0
// @from(Ln 458422, Col 4)
aS1 = 0
// @from(Ln 458423, Col 4)
Wo8 = 0
// @from(Ln 458424, Col 4)
Swz = 20
// @from(Ln 458425, Col 4)
Iwz = 1000
// @from(Ln 458426, Col 4)
tS1 = 0
// @from(Ln 458427, Col 4)
Do8 = !1
// @from(Ln 458428, Col 4)
AC1
// @from(Ln 458428, Col 9)
Xo8 = null
// @from(Ln 458429, Col 4)
bwz
// @from(Ln 458429, Col 9)
xwz
// @from(Ln 458430, Col 4)
k8 = E(() => {
    g1();
    U4();
    d3();
    A8();
    lA();
    K_();
    F9();
    s8();
    T1();
    SA();
    Z7();
    fA();
    H1();
    u_();
    k1();
    $5();
    V1();
    KY();
    So();
    mH();
    g1();
    $F8();
    mNq = t(nx(), 1), kwz = (Rk(), k4(Ld)), fo6 = {
        allowedTools: [],
        mcpContextUris: [],
        mcpServers: {},
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        hasTrustDialogAccepted: !1,
        projectOnboardingSeenCount: 0,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !1
    }, Kx = {
        numStartups: 0,
        installMethod: void 0,
        autoUpdates: void 0,
        theme: "dark",
        preferredNotifChannel: "auto",
        verbose: !1,
        editorMode: "normal",
        autoCompactEnabled: !0,
        showTurnDuration: !0,
        hasSeenTasksHint: !1,
        hasUsedStash: !1,
        queuedCommandUpHintCount: 0,
        diffTool: "auto",
        customApiKeyResponses: {
            approved: [],
            rejected: []
        },
        env: {},
        tipsHistory: {},
        memoryUsageCount: 0,
        promptQueueUseCount: 0,
        btwUseCount: 0,
        todoFeatureEnabled: !0,
        showExpandedTodos: !1,
        messageIdleNotifThresholdMs: 60000,
        autoConnectIde: !1,
        autoInstallIdeExtension: !0,
        fileCheckpointingEnabled: !0,
        terminalProgressBarEnabled: !0,
        cachedStatsigGates: {},
        cachedDynamicConfigs: {},
        cachedGrowthBookFeatures: {},
        respectGitignore: !0,
        copyFullResponse: !1
    }, BNq = ["apiKeyHelper", "installMethod", "autoUpdates", "autoUpdatesProtectedForNative", "theme", "verbose", "preferredNotifChannel", "shiftEnterKeyBindingInstalled", "editorMode", "hasUsedBackslashReturn", "autoCompactEnabled", "showTurnDuration", "diffTool", "env", "tipsHistory", "todoFeatureEnabled", "showExpandedTodos", "messageIdleNotifThresholdMs", "autoConnectIde", "autoInstallIdeExtension", "fileCheckpointingEnabled", "terminalProgressBarEnabled", "respectGitignore", "claudeInChromeDefaultEnabled", "hasCompletedClaudeInChromeOnboarding", "lspRecommendationDisabled", "lspRecommendationNeverPlugins", "lspRecommendationIgnoredCount", "copyFullResponse", "copyOnSelect", "permissionExplainerEnabled", "prStatusFooterEnabled", "remoteControlAtStartup", "remoteDialogSeen"];
    gNq = ["allowedTools", "hasTrustDialogAccepted", "hasCompletedProjectOnboarding"];
    YZ$ = {
        ...Kx,
        autoUpdates: !1
    }, zZ$ = {
        ...fo6
    };
    gN = {
        config: null,
        mtime: 0
    };
    E4(async () => {
        Cwz()
    });
    AC1 = e1(() => {
        let A = AA(),
            q = LJ(A);
        if (q) return lL6(q);
        return lL6(uNq(A))
    });
    bwz = r_6, xwz = eS1
})
// @from(Ln 458522, Col 0)
function qC1() {
    let A = Ru1();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR;
    if (!q) return t86(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return k(`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), t86(null), null;
    try {
        let Y = $1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            _ = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!_) return k("File descriptor contained empty OAuth token", {
            level: "error"
        }), t86(null), null;
        return k(`Successfully read OAuth token from file descriptor ${K}`), t86(_), _
    } catch (Y) {
        return k(`Failed to read OAuth token from file descriptor ${K}: ${_1(Y)}`, {
            level: "error"
        }), t86(null), null
    }
}
// @from(Ln 458548, Col 0)
function fo8() {
    let A = hu1();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
    if (!q) return e86(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return k(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), e86(null), null;
    try {
        let Y = $1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            _ = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!_) return k("File descriptor contained empty API key", {
            level: "error"
        }), e86(null), null;
        return k(`Successfully read API key from file descriptor ${K}`), e86(_), _
    } catch (Y) {
        return k(`Failed to read API key from file descriptor ${K}: ${_1(Y)}`, {
            level: "error"
        }), e86(null), null
    }
}
// @from(Ln 458573, Col 4)
UNq = E(() => {
    H1();
    SA();
    T1();
    s8()
})
// @from(Ln 458579, Col 0)
class e0 {
    static instance = null;
    status = {
        isAuthenticating: !1,
        output: []
    };
    listeners = new Set;
    static getInstance() {
        if (!e0.instance) e0.instance = new e0;
        return e0.instance
    }
    getStatus() {
        return {
            ...this.status,
            output: [...this.status.output]
        }
    }
    startAuthentication() {
        this.status = {
            isAuthenticating: !0,
            output: []
        }, this.notifyListeners()
    }
    addOutput(A) {
        this.status.output.push(A), this.notifyListeners()
    }
    setError(A) {
        this.status.error = A, this.notifyListeners()
    }
    endAuthentication(A) {
        if (A) this.status = {
            isAuthenticating: !1,
            output: []
        };
        else this.status.isAuthenticating = !1;
        this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        this.listeners.forEach((A) => A(this.getStatus()))
    }
    static reset() {
        if (e0.instance) e0.instance.listeners.clear(), e0.instance = null
    }
}
// @from(Ln 458628, Col 4)
S16 = {}
// @from(Ln 458689, Col 0)
function iH() {
    if (process.env.ANTHROPIC_UNIX_SOCKET) return !!process.env.CLAUDE_CODE_OAUTH_TOKEN;
    let A = t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY),
        K = (PA() || {}).apiKeyHelper,
        Y = process.env.ANTHROPIC_AUTH_TOKEN || K || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
        {
            source: z
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
    return !(A || Y || (z === "ANTHROPIC_API_KEY" || z === "apiKeyHelper") && !t6(process.env.CLAUDE_CODE_REMOTE))
}
// @from(Ln 458702, Col 0)
function aR() {
    if (process.env.ANTHROPIC_AUTH_TOKEN) return {
        source: "ANTHROPIC_AUTH_TOKEN",
        hasToken: !0
    };
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
        source: "CLAUDE_CODE_OAUTH_TOKEN",
        hasToken: !0
    };
    if (qC1()) return {
        source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
        hasToken: !0
    };
    if (yo6()) return {
        source: "apiKeyHelper",
        hasToken: !0
    };
    let K = sA();
    if (aI(K?.scopes) && K?.accessToken) return {
        source: "claude.ai",
        hasToken: !0
    };
    return {
        source: "none",
        hasToken: !1
    }
}
// @from(Ln 458730, Col 0)
function RV() {
    let {
        key: A
    } = s2();
    return A
}
// @from(Ln 458737, Col 0)
function RU8() {
    let {
        key: A,
        source: q
    } = s2({
        skipRetrievingKeyFromApiKeyHelper: !0
    });
    return A !== null && q !== "none"
}
// @from(Ln 458747, Col 0)
function s2(A = {}) {
    let q = zG() ? void 0 : process.env.ANTHROPIC_API_KEY;
    if (pk6() && q) return {
        key: q,
        source: "ANTHROPIC_API_KEY"
    };
    if (t6(!1)) {
        let z = fo8();
        if (z) return {
            key: z,
            source: "ANTHROPIC_API_KEY"
        };
        if (!q && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
        if (q) return {
            key: q,
            source: "ANTHROPIC_API_KEY"
        };
        return {
            key: null,
            source: "none"
        }
    }
    if (q && X1().customApiKeyResponses?.approved?.includes(vN(q))) return {
        key: q,
        source: "ANTHROPIC_API_KEY"
    };
    let K = fo8();
    if (K) return {
        key: K,
        source: "ANTHROPIC_API_KEY"
    };
    if (A.skipRetrievingKeyFromApiKeyHelper) {
        if (yo6()) return {
            key: null,
            source: "apiKeyHelper"
        }
    } else {
        let z = v06(q7());
        if (z) return {
            key: z,
            source: "apiKeyHelper"
        }
    }
    let Y = ON6();
    if (Y) return Y;
    return {
        key: null,
        source: "none"
    }
}
// @from(Ln 458798, Col 0)
function yo6() {
    return (PA() || {}).apiKeyHelper
}
// @from(Ln 458802, Col 0)
function iNq() {
    let A = yo6();
    if (!A) return !1;
    let q = L8("projectSettings"),
        K = L8("localSettings");
    return q?.apiKeyHelper === A || K?.apiKeyHelper === A
}
// @from(Ln 458810, Col 0)
function No8() {
    return (PA() || {}).awsAuthRefresh
}
// @from(Ln 458814, Col 0)
function Vo8() {
    let A = No8();
    if (!A) return !1;
    let q = L8("projectSettings"),
        K = L8("localSettings");
    return q?.awsAuthRefresh === A || K?.awsAuthRefresh === A
}
// @from(Ln 458822, Col 0)
function ko8() {
    return (PA() || {}).awsCredentialExport
}
// @from(Ln 458826, Col 0)
function Eo8() {
    let A = ko8();
    if (!A) return !1;
    let q = L8("projectSettings"),
        K = L8("localSettings");
    return q?.awsCredentialExport === A || K?.awsCredentialExport === A
}
// @from(Ln 458834, Col 0)
function nNq() {
    let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
    if (A) {
        let q = parseInt(A, 10);
        if (!Number.isNaN(q) && q >= 0) return q;
        k(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
            level: "error"
        })
    }
    return Bwz
}
// @from(Ln 458846, Col 0)
function rF6() {
    v06.cache.clear()
}
// @from(Ln 458850, Col 0)
function yo8(A) {
    if (yo6()) {
        if (iNq()) {
            if (!l_()) return
        }
    }
    v06(A)
}
// @from(Ln 458858, Col 0)
async function Fwz() {
    let A = No8();
    if (!A) return !1;
    if (Vo8()) {
        if (!l_() && !q7()) {
            let K = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.FEEDBACK_CHANNEL}.`);
            return jV("awsAuthRefresh invoked before trust check", K), d("tengu_awsAuthRefresh_missing_trust", {}), !1
        }
    }
    try {
        return k("Fetching AWS caller identity for AWS auth refresh command"), await ZN8(), k("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
    } catch {
        return rNq(A)
    }
}
// @from(Ln 458874, Col 0)
function rNq(A) {
    k("Running AWS auth refresh command");
    let q = e0.getInstance();
    return q.startAuthentication(), new Promise((K) => {
        let Y = lNq(A, {
            timeout: pwz
        });
        Y.stdout.on("data", (z) => {
            let _ = z.toString().trim();
            if (_) q.addOutput(_), k(_, {
                level: "debug"
            })
        }), Y.stderr.on("data", (z) => {
            let _ = z.toString().trim();
            if (_) q.setError(_), k(_, {
                level: "error"
            })
        }), Y.on("close", (z, _) => {
            if (z === 0) k("AWS auth refresh completed successfully"), q.endAuthentication(!0), K(!0);
            else {
                let O = _ === "SIGTERM" ? O1.red("AWS auth refresh timed out after 3 minutes. Run your auth command manually in a separate terminal.") : O1.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
                console.error(O), q.endAuthentication(!1), K(!1)
            }
        })
    })
}
// @from(Ln 458900, Col 0)
async function Qwz() {
    let A = ko8();
    if (!A) return null;
    if (Eo8()) {
        if (!l_() && !q7()) {
            let K = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.FEEDBACK_CHANNEL}.`);
            return jV("awsCredentialExport invoked before trust check", K), d("tengu_awsCredentialExport_missing_trust", {}), null
        }
    }
    try {
        return k("Fetching AWS caller identity for credential export command"), await ZN8(), k("Fetched AWS caller identity, skipping AWS credential export command"), null
    } catch {
        try {
            k("Running AWS credential export command");
            let q = await q9(A, {
                shell: !0,
                reject: !1
            });
            if (q.exitCode !== 0 || !q.stdout) throw Error("awsCredentialExport did not return a valid value");
            let K = i1(q.stdout.trim());
            if (!_54(K)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
            return k("AWS credentials retrieved from awsCredentialExport"), {
                accessKeyId: K.Credentials.AccessKeyId,
                secretAccessKey: K.Credentials.SecretAccessKey,
                sessionToken: K.Credentials.SessionToken
            }
        } catch (q) {
            let K = O1.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
            if (q instanceof Error) console.error(K, q.message);
            else console.error(K, q);
            return null
        }
    }
}
// @from(Ln 458935, Col 0)
function oF6() {
    To.cache.clear()
}
// @from(Ln 458939, Col 0)
function Lo8() {
    return (PA() || {}).gcpAuthRefresh
}
// @from(Ln 458943, Col 0)
function Ro8() {
    let A = Lo8();
    if (!A) return !1;
    let q = L8("projectSettings"),
        K = L8("localSettings");
    return q?.gcpAuthRefresh === A || K?.gcpAuthRefresh === A
}
// @from(Ln 458950, Col 0)
async function oNq() {
    try {
        let {
            GoogleAuth: A
        } = await Promise.resolve().then(() => t(OD1(), 1)), q = new A({
            scopes: ["https://www.googleapis.com/auth/cloud-platform"]
        }), K = (async () => {
            await (await q.getClient()).getAccessToken()
        })(), Y = new Promise((z, _) => setTimeout(ewz, Uwz, _));
        return await Promise.race([K, Y]), !0
    } catch {
        return !1
    }
}
// @from(Ln 458964, Col 0)
async function cwz() {
    let A = Lo8();
    if (!A) return !1;
    if (Ro8()) {
        if (!l_() && !q7()) {
            let K = Error(`Security: gcpAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.FEEDBACK_CHANNEL}.`);
            return jV("gcpAuthRefresh invoked before trust check", K), d("tengu_gcpAuthRefresh_missing_trust", {}), !1
        }
    }
    try {
        if (k("Checking GCP credentials validity for auth refresh"), await oNq()) return k("GCP credentials are valid, skipping auth refresh command"), !1
    } catch {}
    return aNq(A)
}
// @from(Ln 458979, Col 0)
function aNq(A) {
    k("Running GCP auth refresh command");
    let q = e0.getInstance();
    return q.startAuthentication(), new Promise((K) => {
        let Y = lNq(A, {
            timeout: lwz
        });
        Y.stdout.on("data", (z) => {
            let _ = z.toString().trim();
            if (_) q.addOutput(_), k(_, {
                level: "debug"
            })
        }), Y.stderr.on("data", (z) => {
            let _ = z.toString().trim();
            if (_) q.setError(_), k(_, {
                level: "error"
            })
        }), Y.on("close", (z, _) => {
            if (z === 0) k("GCP auth refresh completed successfully"), q.endAuthentication(!0), K(!0);
            else {
                let O = _ === "SIGTERM" ? O1.red("GCP auth refresh timed out after 3 minutes. Run your auth command manually in a separate terminal.") : O1.red("Error running gcpAuthRefresh (in settings or ~/.claude.json):");
                console.error(O), q.endAuthentication(!1), K(!1)
            }
        })
    })
}
// @from(Ln 459006, Col 0)
function aF6() {
    sg6.cache.clear()
}
// @from(Ln 459010, Col 0)
function ho8() {
    if (!Lo8()) return;
    if (Ro8()) {
        if (!l_() && !q7()) return
    }
    sg6()
}
// @from(Ln 459018, Col 0)
function So8() {
    let A = No8(),
        q = ko8();
    if (!A && !q) return;
    if (Vo8() || Eo8()) {
        if (!l_() && !q7()) return
    }
    To(), _3()
}
// @from(Ln 459028, Col 0)
function iwz(A) {
    return /^[a-zA-Z0-9-_]+$/.test(A)
}
// @from(Ln 459031, Col 0)
async function By8(A) {
    if (!iwz(A)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
    await sNq();
    let q = !1;
    if (process.platform === "darwin") try {
        let Y = qU(),
            z = kM6(),
            _ = Buffer.from(A, "utf-8").toString("hex"),
            w = `add-generic-password -U -a "${z}" -s "${Y}" -X "${_}"
`;
        await q9("security", ["-i"], {
            input: w,
            reject: !1
        }), d("tengu_api_key_saved_to_keychain", {}), q = !0
    } catch (Y) {
        _6(Y), d("tengu_api_key_keychain_error", {
            error: Y.message
        }), d("tengu_api_key_saved_to_config", {})
    } else d("tengu_api_key_saved_to_config", {});
    let K = vN(A);
    d1((Y) => {
        let z = Y.customApiKeyResponses?.approved ?? [];
        return {
            ...Y,
            primaryApiKey: q ? Y.primaryApiKey : A,
            customApiKeyResponses: {
                ...Y.customApiKeyResponses,
                approved: z.includes(K) ? z : [...z, K],
                rejected: Y.customApiKeyResponses?.rejected ?? []
            }
        }
    }), ON6.cache.clear?.()
}
// @from(Ln 459065, Col 0)
function nwz(A) {
    let q = X1(),
        K = vN(A);
    return q.customApiKeyResponses?.approved?.includes(K) ?? !1
}
// @from(Ln 459070, Col 0)
async function Vb8() {
    await sNq(), d1((A) => ({
        ...A,
        primaryApiKey: void 0
    })), ON6.cache.clear?.()
}
// @from(Ln 459076, Col 0)
async function sNq() {
    try {
        await R9q()
    } catch (A) {
        _6(A)
    }
}
// @from(Ln 459084, Col 0)
function $f6(A) {
    if (!aI(A.scopes)) return d("tengu_oauth_tokens_not_claude_ai", {}), {
        success: !0
    };
    if (!A.refreshToken || !A.expiresAt) return d("tengu_oauth_tokens_inference_only", {}), {
        success: !0
    };
    let q = U2(),
        K = q.name;
    try {
        let Y = q.read() || {},
            z = Y.claudeAiOauth;
        Y.claudeAiOauth = {
            accessToken: A.accessToken,
            refreshToken: A.refreshToken,
            expiresAt: A.expiresAt,
            scopes: A.scopes,
            subscriptionType: A.subscriptionType ?? z?.subscriptionType ?? null,
            rateLimitTier: A.rateLimitTier ?? z?.rateLimitTier ?? null
        };
        let _ = q.update(Y);
        if (_.success) d("tengu_oauth_tokens_saved", {
            storageBackend: K
        });
        else d("tengu_oauth_tokens_save_failed", {
            storageBackend: K
        });
        return sA.cache?.clear?.(), Ov1(), _
    } catch (Y) {
        return _6(Y), d("tengu_oauth_tokens_save_exception", {
            storageBackend: K,
            error: Y.message
        }), {
            success: !1,
            warning: "Failed to save OAuth tokens"
        }
    }
}
// @from(Ln 459123, Col 0)
function Cv1() {
    sA.cache?.clear?.(), tV()
}
// @from(Ln 459127, Col 0)
function DG(A) {
    let q = To8.get(A);
    if (q) return q;
    let K = rwz(A).finally(() => {
        To8.delete(A)
    });
    return To8.set(A, K), K
}
// @from(Ln 459135, Col 0)
async function rwz(A) {
    Cv1();
    let q = await Eo6();
    if (!q?.refreshToken) return !1;
    if (q.accessToken !== A) return d("tengu_oauth_401_recovered_from_keychain", {}), !0;
    return dz(0, !0)
}
// @from(Ln 459142, Col 0)
async function Eo6() {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN || qC1()) return sA();
    try {
        let K = (await U2().readAsync())?.claudeAiOauth;
        if (!K?.accessToken) return null;
        return K
    } catch (A) {
        return _6(A), null
    }
}
// @from(Ln 459153, Col 0)
function dz(A = 0, q = !1) {
    if (A === 0 && !q) {
        if (ko6) return ko6;
        return ko6 = vo8(A, q).finally(() => {
            ko6 = null
        }), ko6
    }
    return vo8(A, q)
}
// @from(Ln 459162, Col 0)
async function vo8(A, q) {
    let Y = sA();
    if (!q) {
        if (!Y?.refreshToken || !Yg(Y.expiresAt)) return !1
    }
    if (!Y?.refreshToken) return !1;
    if (!aI(Y.scopes)) return !1;
    sA.cache?.clear?.(), tV();
    let z = await Eo6();
    if (!z?.refreshToken || !Yg(z.expiresAt)) return !1;
    let _ = c8();
    await mwz(_, {
        recursive: !0
    });
    let w;
    try {
        d("tengu_oauth_token_refresh_lock_acquiring", {}), w = await cNq.lock(_), d("tengu_oauth_token_refresh_lock_acquired", {})
    } catch (O) {
        if (O.code === "ELOCKED") {
            if (A < 5) return d("tengu_oauth_token_refresh_lock_retry", {
                retryCount: A + 1
            }), await new Promise(($) => setTimeout($, 1000 + Math.random() * 1000)), vo8(A + 1, q);
            return d("tengu_oauth_token_refresh_lock_retry_limit_reached", {
                maxRetries: 5
            }), !1
        }
        return _6(O), d("tengu_oauth_token_refresh_lock_error", {
            error: O.message
        }), !1
    }
    try {
        sA.cache?.clear?.(), tV();
        let O = await Eo6();
        if (!O?.refreshToken || !Yg(O.expiresAt)) return d("tengu_oauth_token_refresh_race_resolved", {}), !1;
        d("tengu_oauth_token_refresh_starting", {});
        let $ = await QQ6(O.refreshToken, {
            scopes: aI(O.scopes) ? void 0 : O.scopes
        });
        return $f6($), sA.cache?.clear?.(), tV(), !0
    } catch (O) {
        _6(O), sA.cache?.clear?.(), tV();
        let $ = await Eo6();
        if ($ && !Yg($.expiresAt)) return d("tengu_oauth_token_refresh_race_recovered", {}), !0;
        return !1
    } finally {
        d("tengu_oauth_token_refresh_lock_releasing", {}), await w(), d("tengu_oauth_token_refresh_lock_released", {})
    }
}
// @from(Ln 459211, Col 0)
function iA() {
    if (!iH()) return !1;
    return aI(sA()?.scopes)
}
// @from(Ln 459216, Col 0)
function XG() {
    return sA()?.scopes?.includes(pp) ?? !1
}
// @from(Ln 459220, Col 0)
function fb8() {
    if (t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !1;
    if (iA()) return !1;
    return !0
}
// @from(Ln 459226, Col 0)
function L3() {
    return iH() ? X1().oauthAccount : void 0
}
// @from(Ln 459230, Col 0)
function U06() {
    let q = L3()?.billingType;
    if (!iA() || !q) return !1;
    if (q !== "stripe_subscription" && q !== "stripe_subscription_contracted" && q !== "apple_subscription" && q !== "google_play_subscription") return !1;
    return !0
}
// @from(Ln 459237, Col 0)
function owz() {
    let A = CK();
    return A === "max" || A === "enterprise" || A === "team" || A === "pro" || A === null
}
// @from(Ln 459242, Col 0)
function CK() {
    if (_A4()) return zA4();
    if (!iH()) return null;
    let A = sA();
    if (!A) return null;
    return A.subscriptionType ?? null
}
// @from(Ln 459250, Col 0)
function RL() {
    return CK() === "max"
}
// @from(Ln 459254, Col 0)
function Ix6() {
    return CK() === "team"
}
// @from(Ln 459258, Col 0)
function t66() {
    return CK() === "team" && ox() === "default_claude_max_5x"
}
// @from(Ln 459262, Col 0)
function awz() {
    return CK() === "enterprise"
}
// @from(Ln 459266, Col 0)
function LC() {
    return CK() === "pro"
}
// @from(Ln 459270, Col 0)
function ox() {
    if (!iH()) return null;
    let A = sA();
    if (!A) return null;
    return A.rateLimitTier ?? null
}
// @from(Ln 459277, Col 0)
function $R1() {
    switch (CK()) {
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
// @from(Ln 459292, Col 0)
function uI() {
    return !!(t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY))
}
// @from(Ln 459296, Col 0)
function tNq() {
    return (PA() || {}).otelHeadersHelper
}
// @from(Ln 459300, Col 0)
function eNq() {
    let A = tNq();
    if (!A) return !1;
    let q = L8("projectSettings"),
        K = L8("localSettings");
    return q?.otelHeadersHelper === A || K?.otelHeadersHelper === A
}
// @from(Ln 459308, Col 0)
function Tb8() {
    let A = tNq();
    if (!A) return {};
    let q = parseInt(process.env.CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS || swz.toString());
    if (KC1 && Date.now() - dNq < q) return KC1;
    if (eNq()) {
        if (!l_()) return {}
    }
    try {
        let K = yT(A, {
            timeout: 30000
        })?.toString().trim();
        if (!K) throw Error("otelHeadersHelper did not return a valid value");
        let Y = i1(K);
        if (typeof Y !== "object" || Y === null || Array.isArray(Y)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
        for (let [z, _] of Object.entries(Y))
            if (typeof _ !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${z}": ${typeof _}`);
        return KC1 = Y, dNq = Date.now(), KC1
    } catch (K) {
        throw _6(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${_1(K)}`)), K
    }
}
// @from(Ln 459331, Col 0)
function twz(A) {
    return A === "max" || A === "pro"
}
// @from(Ln 459335, Col 0)
function vU6() {
    let A = CK();
    return iA() && A !== null && twz(A)
}
// @from(Ln 459340, Col 0)
function _c6() {
    if (QA() !== "firstParty") return;
    let {
        source: q
    } = aR(), K = {};
    if (q === "CLAUDE_CODE_OAUTH_TOKEN" || q === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR") K.tokenSource = q;
    else if (iA()) K.subscription = $R1();
    else K.tokenSource = q;
    let {
        key: Y,
        source: z
    } = s2();
    if (Y) K.apiKeySource = z;
    if (q === "claude.ai" || z === "/login managed key") {
        let w = L3()?.organizationName;
        if (w) K.organization = w
    }
    let _ = L3()?.emailAddress;
    if ((q === "claude.ai" || z === "/login managed key") && _) K.email = _;
    return K
}
// @from(Ln 459361, Col 0)
async function Yl() {
    if (process.env.ANTHROPIC_UNIX_SOCKET) return {
        valid: !0
    };
    if (!iH()) return {
        valid: !0
    };
    let A = L8("policySettings")?.forceLoginOrgUUID;
    if (!A) return {
        valid: !0
    };
    await dz();
    let q = sA();
    if (!q) return {
        valid: !0
    };
    let {
        source: K
    } = aR(), Y = K === "CLAUDE_CODE_OAUTH_TOKEN" || K === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR", z = await Kg(q.accessToken);
    if (!z) return {
        valid: !1,
        message: `Unable to verify organization for the current authentication token.
This machine requires organization ${A} but the profile could not be fetched.
This may be a network error, or the token may lack the user:profile scope required for
verification (tokens from 'claude setup-token' do not include this scope).
Try again, or obtain a full-scope token via 'claude auth login'.`
    };
    let _ = z.organization.uuid;
    if (_ === A) return {
        valid: !0
    };
    if (Y) return {
        valid: !1,
        message: `The ${K==="CLAUDE_CODE_OAUTH_TOKEN"?"CLAUDE_CODE_OAUTH_TOKEN":"CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR"} environment variable provides a token for a
different organization than required by this machine's managed settings.

Required organization: ${A}
Token organization:   ${_}

Remove the environment variable or obtain a token for the correct organization.`
    };
    return {
        valid: !1,
        message: `Your authentication token belongs to organization ${_},
but this machine requires organization ${A}.

Please log in with the correct organization: claude auth login`
    }
}
// @from(Ln 459411, Col 0)
function ewz(A) {
    A(new AVq("GCP credentials check timed out"))
}
// @from(Ln 459414, Col 4)
cNq
// @from(Ln 459414, Col 9)
Bwz = 300000
// @from(Ln 459415, Col 4)
v06
// @from(Ln 459415, Col 9)
gwz = 3600000
// @from(Ln 459416, Col 4)
pwz = 180000
// @from(Ln 459417, Col 4)
To
// @from(Ln 459417, Col 8)
Uwz = 5000
// @from(Ln 459418, Col 4)
dwz = 3600000
// @from(Ln 459419, Col 4)
lwz = 180000
// @from(Ln 459420, Col 4)
sg6
// @from(Ln 459420, Col 9)
ON6
// @from(Ln 459420, Col 14)
sA
// @from(Ln 459420, Col 18)
To8
// @from(Ln 459420, Col 23)
ko6 = null
// @from(Ln 459421, Col 4)
KC1 = null
// @from(Ln 459422, Col 4)
dNq = 0
// @from(Ln 459423, Col 4)
swz = 1740000
// @from(Ln 459424, Col 4)
AVq
// @from(Ln 459425, Col 4)
fA = E(() => {
    k8();
    i8();
    Eq();
    WW();
    U4();
    Up();
    k1();
    H1();
    aK();
    aI6();
    UNq();
    W0();
    RZ6();
    mT8();
    Mf();
    A8();
    Gq6();
    T1();
    GN8();
    V1();
    Nz();
    ht();
    F5();
    qn6();
    g1();
    s8();
    cNq = t(nx(), 1);
    v06 = g81((A) => {
        let q = yo6();
        if (!q) return null;
        if (iNq()) {
            if (!l_() && !A) {
                let Y = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.FEEDBACK_CHANNEL}.`);
                return jV("apiKeyHelper invoked before trust check", Y), d("tengu_apiKeyHelper_missing_trust11", {}), null
            }
        }
        try {
            let K = yT(q)?.toString().trim();
            if (!K) throw Error("apiKeyHelper did not return a valid value");
            return K
        } catch (K) {
            let Y = O1.red("Error getting API key from apiKeyHelper (in settings or ~/.claude.json):");
            if (K instanceof Error && "stderr" in K) console.error(Y, String(K.stderr));
            else if (K instanceof Error) console.error(Y, K.message);
            else console.error(Y, K);
            return " "
        }
    }, nNq());
    To = g81(async () => {
        let A = await Fwz(),
            q = await Qwz();
        if (A || q) await w54();
        return q
    }, gwz);
    sg6 = g81(async () => {
        return await cwz()
    }, dwz);
    ON6 = e1(() => {
        if (process.platform === "darwin") {
            let q = qU();
            try {
                let K = yT(`security find-generic-password -a $USER -w -s "${q}"`);
                if (K) return {
                    key: K,
                    source: "/login managed key"
                }
            } catch (K) {
                _6(K)
            }
        }
        let A = X1();
        if (!A.primaryApiKey) return null;
        return {
            key: A.primaryApiKey,
            source: "/login managed key"
        }
    });
    sA = e1(() => {
        if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
            accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        let A = qC1();
        if (A) return {
            accessToken: A,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        try {
            let Y = U2().read()?.claudeAiOauth;
            if (!Y?.accessToken) return null;
            return Y
        } catch (q) {
            return _6(q), null
        }
    });
    To8 = new Map;
    AVq = class AVq extends Error {}
})
// @from(Ln 459532, Col 4)
_Vq = {}
// @from(Ln 459538, Col 0)
function YVq() {
    if (F_6("segment")) return !1;
    if (Co8 !== void 0) return Co8;
    try {
        return jY(qVq)
    } catch {
        return !1
    }
}