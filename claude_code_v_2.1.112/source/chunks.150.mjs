
// @from(Ln 385795, Col 0)
function _$Y(q) {
    let K = tb6.runInContext(`({
      arr: () => [],
      obj: () => ({}),
      wrap: (hostFn, cloneFn) => async (input) => {
        try { return cloneFn(await hostFn(input)) }
        catch (e) {
          if (e?.name === 'ReplayCacheExhausted') throw e
          return { error: typeof e?.message === 'string' ? e.message : String(e) }
        }
      },
      wrapN: (hostFn, cloneFn) => async (...args) => {
        try { return cloneFn(await hostFn(...args)) }
        catch (e) {
          if (e?.name === 'ReplayCacheExhausted') throw e
          return { error: typeof e?.message === 'string' ? e.message : String(e) }
        }
      },
      wrapPropagate: (hostFn, cloneFn, Err) => async (input) => {
        try { return cloneFn(await hostFn(input)) }
        catch (e) {
          const err = new Err(typeof e?.message === 'string' ? e.message : String(e))
          if (typeof e?.name === 'string') err.name = e.name
          throw err
        }
      },
      Err: Error,
    })`, q);

    function _(Y, A = new WeakMap) {
        if (typeof Y === "function") return;
        if (Y === null || typeof Y !== "object") return Y;
        let O = A.get(Y);
        if (O !== void 0) return O;
        if (Array.isArray(Y)) {
            let $ = K.arr();
            A.set(Y, $);
            for (let j = 0; j < Y.length; j++) $[j] = _(Y[j], A);
            return $
        }
        let w = K.obj();
        A.set(Y, w);
        for (let $ of Object.keys(Y)) w[$] = _(Y[$], A);
        return w
    }

    function z(Y) {
        let A;
        try {
            A = typeof Y?.message === "string" ? Y.message : String(Y)
        } catch {
            A = "<unprintable thrown value>"
        }
        throw new K.Err(A)
    }
    return {
        fn: (Y) => Ad8((...A) => {
            try {
                return Y(...A)
            } catch (O) {
                z(O)
            }
        }),
        clone: _,
        throwVM: (Y) => {
            throw new K.Err(Y)
        },
        asyncData: (Y) => {
            let A = Ad8((O) => Y(O));
            return K.wrap(A, _)
        },
        asyncDataN: (Y) => {
            let A = Ad8((...O) => Y(...O));
            return K.wrapN(A, _)
        },
        asyncDataPropagate: (Y) => {
            let A = Ad8((O) => Y(O));
            return K.wrapPropagate(A, _, K.Err)
        }
    }
}
// @from(Ln 385877, Col 0)
function QfK(q, K, _, z, Y, A, O, w, $) {
    q.console = {
        __proto__: null,
        log: K.fn(_.log),
        info: K.fn(_.info),
        debug: K.fn(_.debug),
        error: K.fn(_.error),
        warn: K.fn(_.warn)
    };
    for (let [j, H] of Object.entries(z)) q[j] = K.asyncData(H);
    for (let [j, H] of Object.entries(Y)) q[j] = K.asyncDataN(H);
    q.setTimeout = K.fn((j, H) => {
        let J = Number(setTimeout(() => j(), H));
        return w.add(J), J
    }), q.clearTimeout = K.fn((j) => {
        clearTimeout(j), w.delete(j)
    }), q.setInterval = K.fn((j, H) => {
        let J = Number(setInterval(() => j(), H));
        return w.add(J), J
    }), q.clearInterval = K.fn((j) => {
        clearInterval(j), w.delete(j)
    }), q.atob = K.fn((j) => atob(j)), q.btoa = K.fn((j) => btoa(j)), q.shQuote = K.fn((j) => `'${String(j).replaceAll("'","'\\''")}'`), q.registerTool = K.fn((j, H, J, X, M) => {
        if (typeof j !== "string" || !e2Y.test(j)) K.throwVM(`registerTool: name must match ^[a-zA-Z0-9_-]{1,111}$ (wire name is prefixed with 'eval_registered__'), got ${typeof j}: ${String(j).slice(0,50)}`);
        if (O.has(j) && !A.has(j)) K.throwVM(`registerTool: '${j}' collides with a built-in global; choose a different name`);
        A.set(j, {
            name: j,
            description: H,
            schema: J,
            handler: X,
            displayName: M?.displayName
        }), q[j] = K.asyncData(X)
    }), q.unregisterTool = K.fn((j) => {
        if (!A.has(j)) return !1;
        return delete q[j], A.delete(j)
    }), q.listTools = K.fn(() => K.clone([...A.keys()])), w$Y(q, K, $), q.getTool = K.fn((j) => {
        let H = A.get(j);
        return H ? K.clone({
            name: H.name,
            description: H.description,
            schema: H.schema,
            displayName: H.displayName
        }) : void 0
    })
}
// @from(Ln 385922, Col 0)
function w$Y(q, K, _) {
    function z(j) {
        let H = String(j);
        return s2Y(H) ? H : t2Y(_.cwd, H)
    }

    function Y(j, H) {
        let J = q[j];
        if (typeof J !== "function") K.throwVM(`${j} tool is not available in this REPL context`);
        return J(H)
    }

    function A(j) {
        return j !== null && typeof j === "object" ? j : {}
    }

    function O(j, H) {
        return typeof j[H] === "string" ? j[H] : ""
    }

    function w(j) {
        if (j !== void 0) return {
            path: z(j)
        };
        return _.cwd !== b8() ? {
            path: _.cwd
        } : {}
    }
    async function $(j, H) {
        let J = A(await Y(S7, {
                command: _.cwd === b8() ? j : `cd ${$$Y(_.cwd)} && ${j}`,
                ...typeof H === "number" && {
                    timeout: H
                }
            })),
            X = O(J, "stdout"),
            M = O(J, "stderr"),
            P = O(J, "error");
        return [X, M && `[stderr]
${M}`, P && `[error] ${P}`].filter(Boolean).join(`
`)
    }
    q.sh = K.asyncDataN((j, H) => $(String(j), H)), q.gh = K.asyncDataN((j) => {
        let H = String(j).trim(),
            J = _.repo;
        if (J && !O$Y.test(H)) {
            if (A$Y.test(H)) H = `${H} -R ${J}`;
            H = H.replaceAll("repos/:owner/:repo", `repos/${J}`)
        }
        return $(`gh ${H}`)
    }), q.cat = K.asyncDataN(async (j, H, J) => {
        let X = A(await Y(z$Y, {
                file_path: z(j),
                ...typeof H === "number" && {
                    offset: H
                },
                ...typeof J === "number" && {
                    limit: J
                }
            })),
            M = A(X.file);
        return O(M, "content") || O(X, "error")
    }), q.rg = K.asyncDataN(async (j, H, J) => {
        let X = A(J),
            M = A(await Y(UfK, {
                pattern: String(j),
                output_mode: "content",
                "-n": !0,
                ...w(H),
                ...X.A !== void 0 && {
                    "-A": X.A
                },
                ...X.B !== void 0 && {
                    "-B": X.B
                },
                ...X.C !== void 0 && {
                    "-C": X.C
                },
                ...X.glob !== void 0 && {
                    glob: X.glob
                },
                ...X.head !== void 0 && {
                    head_limit: X.head
                },
                ...X.type !== void 0 && {
                    type: X.type
                },
                ...X.i !== void 0 && {
                    "-i": X.i
                }
            }));
        return O(M, "content") || O(M, "error")
    }), q.rgf = K.asyncDataN(async (j, H, J) => {
        let X = A(await Y(UfK, {
            pattern: String(j),
            output_mode: "files_with_matches",
            ...w(H),
            ...typeof J === "string" && {
                glob: J
            }
        }));
        return Array.isArray(X.filenames) ? X.filenames : []
    }), q.gl = K.asyncDataN(async (j, H) => {
        let J = A(await Y(T9, {
            pattern: String(j),
            ...w(H)
        }));
        return Array.isArray(J.filenames) ? J.filenames : []
    }), q.put = K.asyncDataN(async (j, H) => {
        let J = A(await Y(Y$Y, {
                file_path: z(j),
                content: String(H)
            })),
            X = O(J, "error");
        return X ? `[error] ${X}` : ""
    }), q.chdir = K.fn((j) => {
        _.cwd = z(j)
    }), q.log = q.console.log, q.str = K.fn((j, H, J) => {
        if (typeof H === "function") K.throwVM("str: function replacer not supported");
        return JSON.stringify(j, H, J)
    })
}
// @from(Ln 386045, Col 0)
function $$Y(q) {
    return `'${q.replaceAll("'","'\\''")}'`
}
// @from(Ln 386049, Col 0)
function Od8(q, K) {
    if (q.helperState.cwd = b8(), K !== void 0) q.helperState.repo = K;
    q.vmContext.REPO = q.helperState.repo ?? "", q.vmContext.o = q.sealers.clone({})
}
// @from(Ln 386053, Col 0)
async function wd8(q, K) {
    let _ = K === void 0 ? q.vmContext.o : K;
    if (_ === null || typeof _ !== "object" || Array.isArray(_)) return _;
    let z = _;
    try {
        for (let Y of Object.keys(z)) try {
            let A = z[Y];
            if (!j$Y(A)) continue;
            z[Y] = await A
        } catch (A) {
            let O = A?.message;
            z[Y] = {
                error: typeof O === "string" ? O : String(A)
            }
        }
    } catch {}
    return z
}
// @from(Ln 386072, Col 0)
function j$Y(q) {
    return q !== null && typeof q === "object" && typeof q.then === "function"
}
// @from(Ln 386076, Col 0)
function dfK(q, K, _, z, Y) {
    let A = new Map,
        O = K$Y(),
        w = new Set,
        $ = new Set,
        j = {
            cwd: b8(),
            repo: void 0
        },
        H = tb6.createContext({
            __proto__: null
        }, {
            codeGeneration: {
                strings: !0,
                wasm: !1
            }
        }),
        J = _$Y(H);
    tb6.runInContext(`Object.defineProperty(Error, 'prepareStackTrace', {
      value: (err, sites) => String(err.stack ?? err),
      writable: false, configurable: false,
    });
    delete globalThis.ShadowRealm;
    delete globalThis.WebAssembly;`, H);
    let X = t57(q.filter((P) => !e3(P, GO)), K, _, z, Y),
        M = n57(K, Y);
    QfK(H, J, O, X, M, A, w, $, j), Object.keys(H).forEach((P) => w.add(P)), q$Y.forEach((P) => w.add(P));
    try {
        tb6.runInContext("Object.getOwnPropertyNames(globalThis)", H).forEach((W) => w.add(W))
    } catch {
        ["JSON", "Array", "Object", "Promise", "globalThis"].forEach((P) => w.add(P))
    }
    return w.add("__proto__"), {
        vmContext: H,
        registeredTools: A,
        reservedGlobals: w,
        toolWrapperNames: new Set([...Object.keys(X), ...Object.keys(M)]),
        boundaryUuid: null,
        console: O,
        sealers: J,
        clearAllTimers: () => {
            for (let P of $) clearTimeout(P);
            $.clear()
        },
        replayLog: [],
        helperState: j
    }
}
// @from(Ln 386125, Col 0)
function cfK(q, K, _, z, Y, A) {
    let O = t57(K.filter(($) => !e3($, GO)), _, z, Y, A),
        w = n57(_, A);
    QfK(q.vmContext, q.sealers, q.console, O, w, q.registeredTools, q.reservedGlobals, new Set, q.helperState);
    for (let $ of Object.keys(O)) q.toolWrapperNames.add($);
    for (let $ of Object.keys(w)) q.toolWrapperNames.add($)
}
// @from(Ln 386132, Col 4)
e2Y
// @from(Ln 386132, Col 9)
q$Y
// @from(Ln 386132, Col 14)
gfK = 52428800
// @from(Ln 386133, Col 4)
z$Y = "Read"
// @from(Ln 386134, Col 4)
Y$Y = "Write"
// @from(Ln 386135, Col 4)
UfK = "Grep"
// @from(Ln 386136, Col 4)
A$Y
// @from(Ln 386136, Col 9)
O$Y
// @from(Ln 386137, Col 4)
e57 = L(() => {
    gq();
    n7();
    e8();
    EP();
    mfK();
    FfK();
    e2Y = /^[a-zA-Z0-9_-]{1,111}$/, q$Y = ["sh", "cat", "rg", "rgf", "gl", "put", "gh", "chdir", "log", "str", "o", "REPO"];
    A$Y = /^(pr|issue|run|workflow|release|label|cache)\b/, O$Y = /(^|\s)(-R|--repo\b)/
})
// @from(Ln 386149, Col 0)
function K37(q) {
    return Array.from(q.values()).filter((K) => K.phase !== "start").map((K) => K.phase === "error" ? {
        kind: "err",
        toolName: K.toolName,
        error: K.error ?? ""
    } : {
        kind: "ok",
        toolName: K.toolName,
        result: K.result
    })
}
// @from(Ln 386161, Col 0)
function nfK(q, K) {
    if (q === null || typeof q !== "object") return "";
    let _ = q[K];
    return typeof _ === "string" ? _ : ""
}
// @from(Ln 386167, Col 0)
function H$Y(q) {
    if (q.type !== "assistant" || q.isVirtual) return [];
    let K = q.message.content;
    if (!Array.isArray(K)) return [];
    return K.filter((_) => _.type === "tool_use" && _.name === GO).map((_) => ({
        id: _.id,
        code: nfK(_.input, "code")
    }))
}
// @from(Ln 386177, Col 0)
function J$Y(q) {
    if (q.type !== "assistant" || !q.isVirtual) return;
    let K = q.message.content;
    if (!Array.isArray(K)) return;
    let _ = K[0];
    return _?.type === "tool_use" ? _.name : void 0
}
// @from(Ln 386185, Col 0)
function X$Y(q, K) {
    if (q.type !== "user" || !q.isVirtual) return;
    let _ = q.message.content;
    if (!Array.isArray(_)) return;
    let z = _[0];
    if (z?.type !== "tool_result") return;
    return z.is_error ? {
        kind: "err",
        toolName: K,
        error: typeof z.content === "string" ? z.content : ""
    } : {
        kind: "ok",
        toolName: K,
        result: q.toolUseResult
    }
}
// @from(Ln 386202, Col 0)
function M$Y(q, K) {
    if (q.type !== "user" || q.isVirtual) return;
    let _ = q.message.content;
    if (!Array.isArray(_)) return;
    if (!_.some((Y) => Y.type === "tool_result" && Y.tool_use_id === K)) return;
    return nfK(q.toolUseResult, "error").length > 0
}
// @from(Ln 386210, Col 0)
function ifK(q) {
    let K = [],
        _, z = () => {
            if (!_) return;
            K.push({
                code: _.code,
                calls: _.calls,
                threw: _.threw
            }), _ = void 0
        };
    for (let Y of q) {
        if (Y.type !== "assistant" && Y.type !== "user") continue;
        if (Y.isVirtual) {
            if (!_) continue;
            let O = J$Y(Y);
            if (O !== void 0) {
                _.pendingName = O;
                continue
            }
            let w = _.pendingName;
            if (w === void 0) continue;
            let $ = X$Y(Y, w);
            if (!$) continue;
            _.calls.push($), _.pendingName = void 0;
            continue
        }
        let A = H$Y(Y);
        if (A.length > 0) {
            for (let O of A) z(), _ = {
                replId: O.id,
                code: O.code,
                calls: [],
                threw: !1,
                pendingName: void 0
            };
            continue
        }
        if (_) {
            let O = M$Y(Y, _.replId);
            if (O !== void 0) _.threw = O
        }
    }
    return z(), K
}
// @from(Ln 386255, Col 0)
function P$Y(q) {
    return {
        error: q
    }
}
// @from(Ln 386261, Col 0)
function D$Y(q, K) {
    let _ = 0,
        z = [],
        Y = ($) => {
            if (z.length < W$Y) z.push($)
        },
        A = ($) => {
            let j = q[_];
            if (!j) throw new rfK($, q.length);
            if (_++, j.toolName !== $) Y(`position ${_-1}: expected ${j.toolName}, invoked ${$}`);
            return j
        },
        O = ($) => async function() {
            await new Promise((J) => setImmediate(J));
            let H = A($);
            return H.kind === "ok" ? H.result : P$Y(H.error)
        };
    return {
        wrappers: Object.fromEntries(K.map(($) => [$, O($)])),
        diagnostics: () => ({
            consumed: _,
            total: q.length,
            drift: z
        })
    }
}
// @from(Ln 386287, Col 0)
async function Z$Y(q, K) {
    let _ = [...q.toolWrapperNames],
        {
            wrappers: z,
            diagnostics: Y
        } = D$Y(K.calls, _),
        A = _.map((O) => [O, q.vmContext[O]]);
    _.forEach((O) => {
        q.vmContext[O] = q.sealers.asyncDataPropagate(z[O])
    }), Od8(q);
    try {
        let O = tQ8(K.code),
            $ = new lfK.Script(O, {
                filename: "repl-replay.js"
            }).runInContext(q.vmContext, {
                timeout: q37
            }),
            j = await aQ(Promise.resolve($), q37, `REPL replay timed out after ${q37}ms`);
        await wd8(q, eQ8(j));
        let H = Y();
        if (K.threw) return {
            kind: "drift",
            reason: "original threw, replay succeeded",
            consumed: H.consumed,
            total: H.total
        };
        if (H.drift.length > 0 || H.consumed !== H.total) return {
            kind: "drift",
            reason: H.drift[0] ?? `consumed ${H.consumed}/${H.total} cached calls`,
            consumed: H.consumed,
            total: H.total
        };
        return {
            kind: "ok",
            consumed: H.consumed,
            total: H.total
        }
    } catch (O) {
        let w = Y(),
            $ = typeof O?.message === "string" ? O.message : String(O);
        if (K.threw) {
            if (w.drift.length > 0 || w.consumed !== w.total) return {
                kind: "drift",
                reason: w.drift[0] ?? `consumed ${w.consumed}/${w.total} before expected throw`,
                consumed: w.consumed,
                total: w.total
            };
            return {
                kind: "ok",
                consumed: w.consumed,
                total: w.total
            }
        }
        return {
            kind: "threw",
            error: $
        }
    } finally {
        A.forEach(([O, w]) => {
            q.vmContext[O] = w
        }), q.console.clear()
    }
}
// @from(Ln 386350, Col 0)
async function ofK(q, K) {
    let _ = [];
    for (let z of K) {
        let Y = await Z$Y(q, z);
        if (_.push(Y), Y.kind !== "ok") E(`REPL replay ${Y.kind} at block ${_.length}/${K.length}: ${"error"in Y?Y.error:Y.reason}`, {
            level: "warn"
        })
    }
    return _
}
// @from(Ln 386361, Col 0)
function afK(q) {
    let K = w7(q, (A) => A.kind === "ok"),
        _ = w7(q, (A) => A.kind === "drift"),
        z = w7(q, (A) => A.kind === "threw"),
        Y = z > 0 || _ > 0 ? `${K}/${q.length} blocks replayed cleanly (${_} drifted, ${z} threw)` : `${K} blocks replayed`;
    return {
        ok: K,
        drifted: _,
        threw: z,
        summary: Y
    }
}
// @from(Ln 386373, Col 4)
rfK
// @from(Ln 386373, Col 9)
W$Y = 100
// @from(Ln 386374, Col 4)
q37 = 30000
// @from(Ln 386375, Col 4)
sfK = L(() => {
    K8();
    EP();
    c57();
    e57();
    rfK = class rfK extends Error {
        constructor(q, K) {
            super(`REPL replay: ${q} invoked but only ${K} calls were cached. ` + "The replayed code is making more tool calls than the original — " + "likely nondeterminism (Date.now, Math.random) took a different branch.");
            this.name = "ReplayCacheExhausted"
        }
    }
})
// @from(Ln 386388, Col 0)
function tfK(q, K) {
    return ""
}
// @from(Ln 386392, Col 0)
function efK(q, K) {
    let _ = q.at(-1)?.data;
    return fS.createElement(_1, null, fS.createElement(T, {
        dimColor: !0
    }, _ ? `Running ${_.toolName}…` : "Working…"))
}
// @from(Ln 386399, Col 0)
function qGK() {
    return fS.createElement(_1, null, fS.createElement(T, {
        color: "warning"
    }, "Rejected"))
}
// @from(Ln 386405, Col 0)
function KGK(q, K) {
    return fS.createElement(_1, null, fS.createElement(T, {
        color: "error"
    }, typeof q === "string" ? q : "Error"))
}
// @from(Ln 386410, Col 4)
fS
// @from(Ln 386411, Col 4)
_GK = L(() => {
    GK();
    g6();
    fS = K6(P6(), 1)
})
// @from(Ln 386421, Col 0)
function zGK(q, K) {
    let _ = s96(I96(), K),
        z = new Set(q.map((A) => A.name)),
        Y = q.filter((A) => !e3(A, T4) && !e3(A, GO));
    for (let A of _)
        if (!z.has(A.name)) Y.push(A);
    return Y
}
// @from(Ln 386430, Col 0)
function YGK(q, K) {
    if (typeof q === "string" && q.trim() !== "") return q;
    let _ = k$Y(q);
    if (_ !== void 0) return _;
    try {
        return f$Y(q, {
            colors: !1,
            depth: K,
            customInspect: !1
        })
    } catch {
        return "[non-serializable value]"
    }
}
// @from(Ln 386445, Col 0)
function k$Y(q) {
    try {
        if (q === null || typeof q !== "object" || Array.isArray(q) || q.constructor?.name !== "Object") return;
        let K = Object.entries(q);
        if (K.length === 0 || K.some(([_, z]) => typeof z !== "string" || V$Y.has(_))) return;
        return K.map(([_, z]) => `${_}:
${z}`).join(`

`)
    } catch {
        return
    }
}
// @from(Ln 386459, Col 0)
function AGK(q) {
    let K = [];
    for (let _ of q.values()) {
        if (_.phase === "start") continue;
        K.push(yj({
            content: [{
                type: "tool_use",
                id: _.toolUseId,
                name: _.toolName,
                input: _.toolInput
            }],
            isVirtual: !0
        })), K.push(t8({
            content: [{
                type: "tool_result",
                tool_use_id: _.toolUseId,
                content: _.phase === "error" ? _.error ?? "" : "",
                is_error: _.phase === "error"
            }],
            toolUseResult: _.result,
            isVirtual: !0
        }))
    }
    return K
}
// @from(Ln 386485, Col 0)
function N$Y(q, K) {
    let _ = q.get(K.toolUseId);
    if (_) _.phase = K.phase, _.result = K.result, _.error = K.error;
    else q.set(K.toolUseId, {
        toolUseId: K.toolUseId,
        toolName: K.toolName,
        toolInput: K.toolInput,
        phase: K.phase,
        result: K.result,
        error: K.error
    })
}
// @from(Ln 386498, Col 0)
function E$Y() {
    let q = J44()?.match(/trim(\d+)k/);
    return q ? parseInt(q[1], 10) * 1000 : 1e5
}
// @from(Ln 386503, Col 0)
function y$Y() {
    let q;
    return {
        promise: new Promise((_, z) => {
            q = z
        }),
        reject: q
    }
}
// @from(Ln 386513, Col 0)
function L$Y(q, K) {
    let _ = 0,
        z = q,
        Y = 0,
        A, O = !1;

    function w() {
        if (O || A !== void 0 || _ > 0) return;
        if (z <= 0) {
            O = !0, K();
            return
        }
        Y = Date.now(), A = setTimeout(() => {
            O = !0, K()
        }, z), A.unref?.()
    }

    function $() {
        if (A === void 0) return;
        clearTimeout(A), A = void 0, z -= Date.now() - Y
    }
    return {
        start: w,
        onToolStart: () => {
            if (_++ === 0) $()
        },
        onToolEnd: () => {
            if (--_ === 0) w()
        },
        cancel: () => {
            O = !0, $()
        }
    }
}
// @from(Ln 386548, Col 0)
function h$Y(q) {
    return
}
// @from(Ln 386551, Col 4)
G$Y
// @from(Ln 386551, Col 9)
v$Y
// @from(Ln 386551, Col 14)
T$Y = 30000
// @from(Ln 386552, Col 4)
_37 = 600000
// @from(Ln 386553, Col 4)
V$Y
// @from(Ln 386553, Col 9)
z37
// @from(Ln 386554, Col 4)
wGK = L(() => {
    p7();
    B1();
    C8();
    gq();
    $0();
    x$();
    K8();
    m8();
    pK();
    _7();
    sY();
    u$();
    EP();
    bK8();
    IfK();
    ufK();
    sfK();
    c57();
    _GK();
    e57();
    G$Y = C6(() => y.strictObject({
        code: y.string().describe("JavaScript code to execute. Supports top-level await. State persists across calls."),
        description: y.string().optional().describe('Clear, concise description of what this script does in active voice (5-10 words). E.g. "Trace upgrade message to its GrowthBook flag"'),
        timeout: y.number().optional().describe("Optional timeout in milliseconds (default 30000, max 600000)")
    })), v$Y = C6(() => y.object({
        code: y.string().describe("The code that was executed"),
        result: y.unknown().describe("Return value from the code execution"),
        stdout: y.string().describe("Captured console.log output"),
        stderr: y.string().describe("Captured console.error output"),
        error: y.string().optional().describe("Error message if execution failed"),
        registeredTools: y.array(y.string()).optional().describe("Names of tools registered during this execution"),
        innerToolCalls: y.array(y.object({
            name: y.string(),
            input: y.unknown()
        })).optional().describe("File-mutating inner tool calls — consumed by verificationInterceptor")
    })), V$Y = new Set(["stdout", "stderr", "error", "result"]);
    z37 = Iq({
        name: GO,
        searchHint: "execute JavaScript with programmatic tool access",
        get maxResultSizeChars() {
            return E$Y()
        },
        async prompt() {
            return CfK()
        },
        async description() {
            return bfK()
        },
        get inputSchema() {
            return G$Y()
        },
        get outputSchema() {
            return v$Y()
        },
        isEnabled() {
            return JJ()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(q) {
            return q.code
        },
        async checkPermissions() {
            return {
                behavior: "allow"
            }
        },
        async call(q, K, _, z, Y) {
            let A = K.agentId ?? Aa6,
                O = K.getAppState().replContexts[A],
                {
                    code: w,
                    timeout: $
                } = q;
            h$Y(w);
            let j = Math.min($ ?? T$Y, _37),
                H = tv(K.abortController),
                J = {
                    ...K,
                    abortController: H
                },
                X = new Map,
                M = y$Y(),
                P = L$Y(j, () => M.reject(Error(`REPL execution timed out after ${j}ms of script time (inner tool calls excluded). Script may still be running — avoid unbounded awaits.`))),
                W = () => {
                    return
                },
                D = (R) => {
                    let h = R.data;
                    if (N$Y(X, h), h.phase === "start") P.onToolStart();
                    else P.onToolEnd();
                    Y?.(h.result === void 0 ? R : {
                        toolUseID: R.toolUseID,
                        data: {
                            ...h,
                            result: void 0
                        }
                    })
                },
                Z, G = K.messages[0],
                f = G !== void 0 && RJ(G) ? G.uuid : null;
            if (O && O.boundaryUuid === f) Z = O, Z.console.clear(), Z.clearAllTimers(), cfK(Z, zGK(K.options.tools, K.getAppState().toolPermissionContext), J, _, z, D);
            else {
                O?.clearAllTimers(), O?.console.clear();
                let R = zGK(K.options.tools, K.getAppState().toolPermissionContext);
                Z = dfK(R, J, _, z, D), Z.boundaryUuid = f, Z.helperState.repo = await mA6().catch(() => null);
                let h = K.replHydration ?? {
                        kind: "fresh"
                    },
                    C = h.kind === "fork" && O ? {
                        kind: "fresh"
                    } : h;
                try {
                    let x = C.kind === "fork" ? C.log : C.kind === "resume" ? ifK(K.messages) : [];
                    if (x.length > 0) {
                        let B = performance.now(),
                            m = await ofK(Z, x),
                            S = Math.round(performance.now() - B),
                            {
                                summary: F
                            } = afK(m);
                        if (E(`REPL state hydrated from ${C.kind} in ${S}ms: ${F}`, {
                                level: "info"
                            }), C.kind === "resume") Z.replayLog = [...x]
                    }
                } catch (x) {
                    E(`REPL state hydration failed: ${x instanceof Error?x.message:String(x)}`, {
                        level: "warn"
                    })
                }
                Z.clearAllTimers(), K.setReplContext(A, Z)
            }
            let {
                vmContext: v,
                registeredTools: V,
                console: k
            } = Z, N = new Set(V.keys());
            Od8(Z);
            try {
                let R = tQ8(w),
                    C = new OGK.Script(R, {
                        filename: "repl-tool-code.js"
                    }).runInContext(v, {
                        timeout: j
                    }),
                    x = K.abortController.signal,
                    B = () => M.reject(Error("REPL execution interrupted"));
                if (x.aborted) B();
                else x.addEventListener("abort", B, {
                    once: !0
                });
                P.start();
                let m = setTimeout((n) => n(Error(`REPL execution exceeded hard wall-clock limit of ${_37}ms. An inner tool call may be hung — try a shorter timeout on the tool itself, or split the work.`)), _37, M.reject);
                m.unref?.();
                let S = await Promise.race([Promise.resolve(C).then((n) => wd8(Z, eQ8(n))), M.promise]).finally(() => {
                        clearTimeout(m), x.removeEventListener("abort", B)
                    }),
                    F = [...V.keys()].filter((n) => !N.has(n)),
                    U = W(),
                    g = {
                        code: w,
                        result: S,
                        stdout: k.getStdout(),
                        stderr: k.getStderr(),
                        ...F.length > 0 && {
                            registeredTools: F
                        },
                        ...U && {
                            innerToolCalls: U
                        }
                    },
                    c = F.length > 0 ? xfK(V) : void 0;
                return Z.replayLog.push({
                    code: w,
                    calls: K37(X),
                    threw: !1
                }), {
                    data: g,
                    newMessages: AGK(X),
                    ...c && {
                        newTools: c
                    }
                }
            } catch (R) {
                if (R instanceof Error && R.stack) E(`REPL error stack trace:
${R.stack}`, {
                    level: "error"
                });
                let h = Array.from(X.values()).filter((m) => m.phase === "error"),
                    C = h.length ? z71(R) + `

Inner tool errors (likely root cause):
` + h.map((m) => `- ${m.toolName}: ${m.error}`).join(`
`) : z71(R),
                    x = W(),
                    B = {
                        code: w,
                        result: null,
                        stdout: k.getStdout(),
                        stderr: k.getStderr(),
                        error: C,
                        ...x && {
                            innerToolCalls: x
                        }
                    };
                return Z.replayLog.push({
                    code: w,
                    calls: K37(X),
                    threw: !0
                }), {
                    data: B,
                    newMessages: AGK(X)
                }
            } finally {
                H.abort(), P.cancel(), Z.clearAllTimers()
            }
        },
        userFacingName() {
            return "REPL"
        },
        isTransparentWrapper() {
            return !0
        },
        getToolUseSummary(q) {
            if (!q?.code) return null;
            let K = oY(q.code);
            if (K && K.length > 50) return K.slice(0, 49) + "…";
            return K ?? null
        },
        renderToolUseMessage: tfK,
        renderToolUseRejectedMessage: qGK,
        renderToolUseErrorMessage: KGK,
        renderToolUseProgressMessage: efK,
        mapToolResultToToolResultBlockParam(q, K) {
            let _ = "";
            if (!q.stdout && !q.stderr && !q.error && q.result !== void 0 && !q.registeredTools?.length) _ = YGK(q.result, 10);
            else {
                let z = [];
                if (q.stdout) z.push(`stdout:
${q.stdout}`);
                if (q.stderr) z.push(`stderr:
${q.stderr}`);
                if (q.error) z.push(`error: ${q.error}`);
                if (q.result !== void 0) z.push(`result: ${YGK(q.result,10)}`);
                if (q.registeredTools?.length) z.push(`Registered tools: ${q.registeredTools.join(", ")}`);
                _ = z.join(`

`) || ""
            }
            return {
                tool_use_id: K,
                type: "tool_result",
                content: _,
                is_error: !!q.error
            }
        }
    })
})
// @from(Ln 386818, Col 0)
function R$Y() {
    return Lp("TASK_MAX_OUTPUT_LENGTH", process.env.TASK_MAX_OUTPUT_LENGTH, A37, Y37).effective
}
// @from(Ln 386822, Col 0)
function $GK(q, K) {
    let _ = R$Y();
    if (q.length <= _) return {
        content: q,
        wasTruncated: !1
    };
    let Y = `[Truncated. Full output: ${$A(K)}]

`,
        A = _ - Y.length,
        O = q.slice(-A);
    return {
        content: Y + O,
        wasTruncated: !0
    }
}
// @from(Ln 386838, Col 4)
Y37 = 160000
// @from(Ln 386839, Col 4)
A37 = 32000
// @from(Ln 386840, Col 4)
O37 = L(() => {
    ty6();
    EH()
})
// @from(Ln 386844, Col 0)
async function $d8(q) {
    let K;
    if (q.type === "local_bash") {
        let Y = q.shellCommand?.taskOutput;
        if (Y) {
            let A = await Y.getStdout(),
                O = Y.getStderr();
            K = [A, O].filter(Boolean).join(`
`)
        } else K = await w37(q.id)
    } else K = await w37(q.id);
    let _ = {
        task_id: q.id,
        task_type: q.type,
        status: q.status,
        description: q.description,
        output: K
    };
    if (q.type === "local_bash") return {
        ..._,
        exitCode: q.result?.code ?? null
    };
    if (q.type === "local_agent") {
        let z = q,
            Y = z.result ? s5(z.result.content, `
`) : void 0;
        return {
            ..._,
            prompt: z.prompt,
            result: Y || K,
            output: Y || K,
            error: z.error
        }
    }
    if (q.type === "remote_agent") return {
        ..._,
        prompt: q.command
    };
    return _
}
// @from(Ln 386884, Col 0)
async function C$Y(q, K, _, z) {
    let Y = Date.now();
    while (Date.now() - Y < _) {
        if (z?.signal.aborted) throw new sz;
        let w = K().tasks?.[q];
        if (!w) return null;
        if (w.status !== "running" && w.status !== "pending") return w;
        await l7(100)
    }
    return K().tasks?.[q] ?? null
}
// @from(Ln 386896, Col 0)
function b$Y(q) {
    let K = s(54),
        {
            content: _,
            verbose: z,
            theme: Y
        } = q,
        A = z === void 0 ? !1 : z,
        O = V3("app:toggleTranscript", "Global", "ctrl+o"),
        w;
    if (K[0] !== _) w = typeof _ === "string" ? n8(_) : _, K[0] = _, K[1] = w;
    else w = K[1];
    let $ = w;
    if (!$.task) {
        let M;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) M = Q_.default.createElement(_1, null, Q_.default.createElement(T, {
            dimColor: !0
        }, "No task output available")), K[2] = M;
        else M = K[2];
        return M
    }
    let {
        task: j
    } = $;
    if (j.task_type === "local_bash") {
        let M;
        if (K[3] !== j.error || K[4] !== j.output) M = {
            stdout: j.output,
            stderr: "",
            isImage: !1,
            dangerouslyDisableSandbox: !0,
            returnCodeInterpretation: j.error
        }, K[3] = j.error, K[4] = j.output, K[5] = M;
        else M = K[5];
        let P = M,
            W;
        if (K[6] !== P || K[7] !== A) W = Q_.default.createElement(FX6, {
            content: P,
            verbose: A
        }), K[6] = P, K[7] = A, K[8] = W;
        else W = K[8];
        return W
    }
    if (j.task_type === "local_agent") {
        let M = j.result ? tz(j.result, `
`) + 1 : 0;
        if ($.retrieval_status === "success") {
            if (A) {
                let D;
                if (K[9] !== M || K[10] !== j.description) D = Q_.default.createElement(T, null, j.description, " (", M, " lines)"), K[9] = M, K[10] = j.description, K[11] = D;
                else D = K[11];
                let Z;
                if (K[12] !== j.prompt || K[13] !== Y) Z = j.prompt && Q_.default.createElement(BK8, {
                    prompt: j.prompt,
                    theme: Y,
                    dim: !0
                }), K[12] = j.prompt, K[13] = Y, K[14] = Z;
                else Z = K[14];
                let G;
                if (K[15] !== j.result || K[16] !== Y) G = j.result && Q_.default.createElement(u, {
                    marginTop: 1
                }, Q_.default.createElement(Lq7, {
                    content: [{
                        type: "text",
                        text: j.result
                    }],
                    theme: Y
                })), K[15] = j.result, K[16] = Y, K[17] = G;
                else G = K[17];
                let f;
                if (K[18] !== j.error) f = j.error && Q_.default.createElement(u, {
                    flexDirection: "column",
                    marginTop: 1
                }, Q_.default.createElement(T, {
                    color: "error",
                    bold: !0
                }, "Error:"), Q_.default.createElement(u, {
                    paddingLeft: 2
                }, Q_.default.createElement(T, {
                    color: "error"
                }, j.error))), K[18] = j.error, K[19] = f;
                else f = K[19];
                let v;
                if (K[20] !== Z || K[21] !== G || K[22] !== f) v = Q_.default.createElement(u, {
                    flexDirection: "column",
                    paddingLeft: 2,
                    marginTop: 1
                }, Z, G, f), K[20] = Z, K[21] = G, K[22] = f, K[23] = v;
                else v = K[23];
                let V;
                if (K[24] !== D || K[25] !== v) V = Q_.default.createElement(u, {
                    flexDirection: "column"
                }, D, v), K[24] = D, K[25] = v, K[26] = V;
                else V = K[26];
                return V
            }
            let W;
            if (K[27] !== O) W = Q_.default.createElement(_1, null, Q_.default.createElement(T, {
                dimColor: !0
            }, "Read output (", O, " to expand)")), K[27] = O, K[28] = W;
            else W = K[28];
            return W
        }
        if ($.retrieval_status === "timeout" || j.status === "running") {
            let W;
            if (K[29] === Symbol.for("react.memo_cache_sentinel")) W = Q_.default.createElement(_1, null, Q_.default.createElement(T, {
                dimColor: !0
            }, "Task is still running…")), K[29] = W;
            else W = K[29];
            return W
        }
        if ($.retrieval_status === "not_ready") {
            let W;
            if (K[30] === Symbol.for("react.memo_cache_sentinel")) W = Q_.default.createElement(_1, null, Q_.default.createElement(T, {
                dimColor: !0
            }, "Task is still running…")), K[30] = W;
            else W = K[30];
            return W
        }
        let P;
        if (K[31] === Symbol.for("react.memo_cache_sentinel")) P = Q_.default.createElement(_1, null, Q_.default.createElement(T, {
            dimColor: !0
        }, "Task not ready")), K[31] = P;
        else P = K[31];
        return P
    }
    if (j.task_type === "remote_agent") {
        let M;
        if (K[32] !== j.description || K[33] !== j.status) M = Q_.default.createElement(T, null, "  ", j.description, " [", j.status, "]"), K[32] = j.description, K[33] = j.status, K[34] = M;
        else M = K[34];
        let P;
        if (K[35] !== j.output || K[36] !== A) P = j.output && A && Q_.default.createElement(u, {
            paddingLeft: 4,
            marginTop: 1
        }, Q_.default.createElement(T, null, j.output)), K[35] = j.output, K[36] = A, K[37] = P;
        else P = K[37];
        let W;
        if (K[38] !== O || K[39] !== j.output || K[40] !== A) W = !A && j.output && Q_.default.createElement(T, {
            dimColor: !0
        }, "     ", "(", O, " to expand)"), K[38] = O, K[39] = j.output, K[40] = A, K[41] = W;
        else W = K[41];
        let D;
        if (K[42] !== M || K[43] !== P || K[44] !== W) D = Q_.default.createElement(u, {
            flexDirection: "column"
        }, M, P, W), K[42] = M, K[43] = P, K[44] = W, K[45] = D;
        else D = K[45];
        return D
    }
    let H;
    if (K[46] !== j.description || K[47] !== j.status) H = Q_.default.createElement(T, null, "  ", j.description, " [", j.status, "]"), K[46] = j.description, K[47] = j.status, K[48] = H;
    else H = K[48];
    let J;
    if (K[49] !== j.output) J = j.output && Q_.default.createElement(u, {
        paddingLeft: 4
    }, Q_.default.createElement(T, null, j.output.slice(0, 500))), K[49] = j.output, K[50] = J;
    else J = K[50];
    let X;
    if (K[51] !== H || K[52] !== J) X = Q_.default.createElement(u, {
        flexDirection: "column"
    }, H, J), K[51] = H, K[52] = J, K[53] = X;
    else X = K[53];
    return X
}
// @from(Ln 387059, Col 4)
Q_
// @from(Ln 387059, Col 8)
S$Y
// @from(Ln 387059, Col 13)
jd8
// @from(Ln 387060, Col 4)
$37 = L(() => {
    o6();
    p7();
    u7();
    ny();
    GK8();
    GK();
    g6();
    RM();
    gq();
    m8();
    _7();
    g96();
    e8();
    EH();
    O37();
    FK8();
    $g8();
    Q_ = K6(P6(), 1), S$Y = C6(() => y.strictObject({
        task_id: y.string().describe("The task ID to get output from"),
        block: _W(y.boolean().default(!0)).describe("Whether to wait for completion"),
        timeout: y.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
    }));
    jd8 = Iq({
        name: tN,
        searchHint: "read output/logs from a background task",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        aliases: ["AgentOutputTool", "BashOutputTool"],
        userFacingName() {
            return "Task Output"
        },
        get inputSchema() {
            return S$Y()
        },
        async description() {
            return "[Deprecated] — for bash and remote_agent tasks, prefer Read on the output file path; for local_agent tasks, use the Agent tool result directly"
        },
        isConcurrencySafe(q) {
            return this.isReadOnly?.(q) ?? !1
        },
        isEnabled() {
            return !0
        },
        isReadOnly(q) {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.task_id
        },
        async prompt() {
            return `DEPRECATED: Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes.
- For bash tasks: prefer using the Read tool on that output file path — it contains stdout/stderr.
- For local_agent tasks: use the Agent tool result directly. Do NOT Read the .output file — it is a symlink to the full sub-agent conversation transcript (JSONL) and will overflow your context window.
- For remote_agent tasks: prefer using the Read tool on the output file path — it contains the streamed remote session output (same as bash).

- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`
        },
        async validateInput({
            task_id: q
        }, {
            getAppState: K
        }) {
            if (!q) return {
                result: !1,
                message: "Task ID is required",
                errorCode: 1
            };
            if (!K().tasks?.[q]) return {
                result: !1,
                message: `No task found with ID: ${q}`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call(q, K, _, z, Y) {
            let {
                task_id: A,
                block: O,
                timeout: w
            } = q, j = K.getAppState().tasks?.[A];
            if (!j) throw Error(`No task found with ID: ${A}`);
            if (!O) {
                if (j.status !== "running" && j.status !== "pending") return K.taskRegistry.update(A, (J) => ({
                    ...J,
                    notified: !0
                })), {
                    data: {
                        retrieval_status: "success",
                        task: await $d8(j)
                    }
                };
                return {
                    data: {
                        retrieval_status: "not_ready",
                        task: await $d8(j)
                    }
                }
            }
            if (Y) Y({
                toolUseID: `task-output-waiting-${Date.now()}`,
                data: {
                    type: "waiting_for_task",
                    taskDescription: j.description,
                    taskType: j.type
                }
            });
            let H = await C$Y(A, K.getAppState, w, K.abortController);
            if (!H) return {
                data: {
                    retrieval_status: "timeout",
                    task: null
                }
            };
            if (H.status === "running" || H.status === "pending") return {
                data: {
                    retrieval_status: "timeout",
                    task: await $d8(H)
                }
            };
            return K.taskRegistry.update(A, (J) => ({
                ...J,
                notified: !0
            })), {
                data: {
                    retrieval_status: "success",
                    task: await $d8(H)
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let _ = [];
            if (_.push(`<retrieval_status>${q.retrieval_status}</retrieval_status>`), q.task) {
                if (_.push(`<task_id>${q.task.task_id}</task_id>`), _.push(`<task_type>${q.task.task_type}</task_type>`), _.push(`<status>${q.task.status}</status>`), q.task.exitCode !== void 0 && q.task.exitCode !== null) _.push(`<exit_code>${q.task.exitCode}</exit_code>`);
                if (q.task.output?.trim()) {
                    let {
                        content: z
                    } = $GK(q.task.output, q.task.task_id);
                    _.push(`<output>
${z.trimEnd()}
</output>`)
                }
                if (q.task.error) _.push(`<error>${q.task.error}</error>`)
            }
            return {
                tool_use_id: K,
                type: "tool_result",
                content: _.join(`

`)
            }
        },
        renderToolUseMessage(q) {
            let {
                block: K = !0
            } = q;
            if (!K) return "non-blocking";
            return ""
        },
        renderToolUseTag(q) {
            if (!q.task_id) return null;
            return Q_.default.createElement(T, {
                dimColor: !0
            }, " ", q.task_id)
        },
        renderToolUseProgressMessage(q) {
            let _ = q.at(-1)?.data;
            return Q_.default.createElement(u, {
                flexDirection: "column"
            }, _?.taskDescription && Q_.default.createElement(T, null, "  ", _.taskDescription), Q_.default.createElement(T, null, "     Waiting for task", " ", Q_.default.createElement(T, {
                dimColor: !0
            }, Q_.default.createElement(A8, {
                chord: "escape",
                action: "give additional instructions",
                parens: !0,
                format: {
                    keyCase: "lower"
                }
            }))))
        },
        renderToolResultMessage(q, K, {
            verbose: _,
            theme: z
        }) {
            return Q_.default.createElement(b$Y, {
                content: q,
                verbose: _,
                theme: z
            })
        },
        renderToolUseRejectedMessage() {
            return Q_.default.createElement(Ul, null)
        },
        renderToolUseErrorMessage(q, {
            verbose: K
        }) {
            return Q_.default.createElement(d$, {
                result: q,
                verbose: K
            })
        }
    })
})
// @from(Ln 387272, Col 0)
function I$Y(q) {
    let K = 0,
        _ = 0;
    for (let z of q)
        if (z != null && typeof z !== "string") K++, _ += z.content?.length ?? 0;
    return {
        searchCount: K,
        totalResultCount: _
    }
}
// @from(Ln 387283, Col 0)
function jGK({
    query: q,
    allowed_domains: K,
    blocked_domains: _
}, {
    verbose: z
}) {
    if (!q) return null;
    let Y = "";
    if (q) Y += `"${q}"`;
    if (z) {
        if (K && K.length > 0) Y += `, only allowing domains: ${K.join(", ")}`;
        if (_ && _.length > 0) Y += `, blocking domains: ${_.join(", ")}`
    }
    return Y
}
// @from(Ln 387300, Col 0)
function HGK(q) {
    if (q.length === 0) return null;
    let K = q[q.length - 1];
    if (!K?.data) return null;
    let _ = K.data;
    switch (_.type) {
        case "query_update":
            return t96.default.createElement(_1, null, t96.default.createElement(T, {
                dimColor: !0
            }, "Searching: ", _.query));
        case "search_results_received":
            return t96.default.createElement(_1, null, t96.default.createElement(T, {
                dimColor: !0
            }, "Found ", _.resultCount, ' results for "', _.query, '"'));
        default:
            return null
    }
}
// @from(Ln 387319, Col 0)
function JGK(q) {
    let {
        searchCount: K
    } = I$Y(q.results ?? []), _ = q.durationSeconds >= 1 ? `${Math.round(q.durationSeconds)}s` : `${Math.round(q.durationSeconds*1000)}ms`;
    return t96.default.createElement(u, {
        justifyContent: "space-between",
        width: "100%"
    }, t96.default.createElement(_1, {
        height: 1
    }, t96.default.createElement(T, null, "Did ", K, " search", K !== 1 ? "es" : "", " in ", _)))
}
// @from(Ln 387331, Col 0)
function j37(q) {
    if (!q?.query) return null;
    return w5(q.query, av)
}
// @from(Ln 387335, Col 4)
t96
// @from(Ln 387336, Col 4)
XGK = L(() => {
    GK();
    g6();
    c7();
    t96 = K6(P6(), 1)
})
// @from(Ln 387343, Col 0)
function B$Y(q) {
    return {
        type: "web_search_20250305",
        name: "web_search",
        allowed_domains: q.allowed_domains,
        blocked_domains: q.blocked_domains,
        max_uses: 8
    }
}
// @from(Ln 387353, Col 0)
function p$Y(q, K, _) {
    let z = [],
        Y = "",
        A = !0;
    for (let O of q) {
        if (O.type === "server_tool_use") {
            if (A) {
                if (A = !1, Y.trim().length > 0) z.push(Y.trim());
                Y = ""
            }
            continue
        }
        if (O.type === "web_search_tool_result") {
            if (!Array.isArray(O.content)) {
                let $ = `Web search error: ${O.content.error_code}`;
                j6(Error($)), z.push($);
                continue
            }
            let w = O.content.map(($) => ({
                title: $.title,
                url: $.url
            }));
            z.push({
                tool_use_id: O.tool_use_id,
                content: w
            })
        }
        if (O.type === "text")
            if (A) Y += O.text;
            else A = !0, Y = O.text
    }
    if (Y.length) z.push(Y.trim());
    return {
        query: K,
        results: z,
        durationSeconds: _
    }
}
// @from(Ln 387391, Col 4)
x$Y
// @from(Ln 387391, Col 9)
u$Y
// @from(Ln 387391, Col 14)
m$Y
// @from(Ln 387391, Col 19)
Hd8
// @from(Ln 387392, Col 4)
H37 = L(() => {
    x9();
    p7();
    B1();
    O2();
    gq();
    U8();
    _7();
    Sq();
    e8();
    cy6();
    XGK();
    x$Y = C6(() => y.strictObject({
        query: y.string().min(2).describe("The search query to use"),
        allowed_domains: y.array(y.string()).optional().describe("Only include search results from these domains"),
        blocked_domains: y.array(y.string()).optional().describe("Never include search results from these domains")
    })), u$Y = C6(() => {
        let q = y.object({
            title: y.string().describe("The title of the search result"),
            url: y.string().describe("The URL of the search result")
        });
        return y.object({
            tool_use_id: y.string().describe("ID of the tool use"),
            content: y.array(q).describe("Array of search hits")
        })
    }), m$Y = C6(() => y.object({
        query: y.string().describe("The search query that was executed"),
        results: y.array(y.union([u$Y(), y.string()])).describe("Search results and/or text commentary from the model"),
        durationSeconds: y.number().describe("Time taken to complete the search operation")
    }));
    Hd8 = Iq({
        name: hR,
        searchHint: "search the web for current information",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description(q) {
            return `Claude wants to search the web for: ${q.query}`
        },
        userFacingName() {
            return "Web Search"
        },
        getToolUseSummary: j37,
        getActivityDescription(q) {
            let K = j37(q);
            return K ? `Searching for ${K}` : "Searching the web"
        },
        isEnabled() {
            let q = pq(),
                K = G5();
            if (q === "firstParty" || q === "anthropicAws") return !0;
            if (q === "vertex") return K.includes("claude-opus-4") || K.includes("claude-sonnet-4") || K.includes("claude-haiku-4");
            if (q === "foundry") return !0;
            return !1
        },
        get inputSchema() {
            return x$Y()
        },
        get outputSchema() {
            return m$Y()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.query
        },
        async checkPermissions(q) {
            return {
                behavior: "passthrough",
                message: "WebSearchTool requires permission.",
                suggestions: [{
                    type: "addRules",
                    rules: [{
                        toolName: hR
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]
            }
        },
        async prompt() {
            return V04()
        },
        renderToolUseMessage: jGK,
        renderToolUseProgressMessage: HGK,
        renderToolResultMessage: JGK,
        extractSearchText() {
            return ""
        },
        async validateInput(q) {
            let {
                query: K,
                allowed_domains: _,
                blocked_domains: z
            } = q;
            if (!K.length) return {
                result: !1,
                message: "Error: Missing query",
                errorCode: 1
            };
            if (_?.length && z?.length) return {
                result: !1,
                message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call(q, K, _, z, Y) {
            let A = performance.now(),
                {
                    query: O
                } = q,
                w = t8({
                    content: "Perform a web search for the query: " + O
                }),
                $ = B$Y(q),
                j = u8("tengu_plum_vx3", !1),
                H = K.getAppState(),
                J = eb6({
                    messages: [w],
                    systemPrompt: sK(["You are an assistant for performing a web search tool use"]),
                    thinkingConfig: j ? {
                        type: "disabled"
                    } : K.options.thinkingConfig,
                    tools: [],
                    signal: K.abortController.signal,
                    options: {
                        getToolPermissionContext: async () => H.toolPermissionContext,
                        model: j ? OM() : K.options.mainLoopModel,
                        toolChoice: j ? {
                            type: "tool",
                            name: "web_search"
                        } : void 0,
                        isNonInteractiveSession: K.options.isNonInteractiveSession,
                        hasAppendSystemPrompt: !!K.options.appendSystemPrompt,
                        extraToolSchemas: [$],
                        querySource: "web_search_tool",
                        agents: K.options.agentDefinitions.activeAgents,
                        mcpTools: [],
                        agentId: K.agentId,
                        effortValue: H.effortValue
                    }
                }),
                X = [],
                M = null,
                P = "",
                W = 0,
                D = new Map;
            for await (let v of J) {
                if (v.type === "assistant") {
                    X.push(...v.message.content);
                    continue
                }
                if (v.type === "stream_event" && v.event?.type === "content_block_start") {
                    let V = v.event.content_block;
                    if (V && V.type === "server_tool_use") {
                        M = V.id, P = "";
                        continue
                    }
                }
                if (M && v.type === "stream_event" && v.event?.type === "content_block_delta") {
                    let V = v.event.delta;
                    if (V?.type === "input_json_delta" && V.partial_json) {
                        P += V.partial_json;
                        try {
                            let k = P.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                            if (k && k[1]) {
                                let N = n8('"' + k[1] + '"');
                                if (!D.has(M) || D.get(M) !== N) {
                                    if (D.set(M, N), W++, Y) Y({
                                        toolUseID: `search-progress-${W}`,
                                        data: {
                                            type: "query_update",
                                            query: N
                                        }
                                    })
                                }
                            }
                        } catch {}
                    }
                }
                if (v.type === "stream_event" && v.event?.type === "content_block_start") {
                    let V = v.event.content_block;
                    if (V && V.type === "web_search_tool_result") {
                        let k = V.tool_use_id,
                            N = D.get(k) || O,
                            R = V.content;
                        if (W++, Y) Y({
                            toolUseID: k || `search-progress-${W}`,
                            data: {
                                type: "search_results_received",
                                resultCount: Array.isArray(R) ? R.length : 0,
                                query: N
                            }
                        })
                    }
                }
            }
            let G = (performance.now() - A) / 1000;
            return {
                data: p$Y(X, O, G)
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                query: _,
                results: z
            } = q, Y = `Web search results for query: "${_}"

`;
            return (z ?? []).forEach((A) => {
                if (A == null) return;
                if (typeof A === "string") Y += A + `

`;
                else if (A.content?.length > 0) Y += `Links: ${I6(A.content)}

`;
                else Y += `No links found.

`
            }), Y += `
REMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.`, {
                tool_use_id: K,
                type: "tool_result",
                content: Y.trim()
            }
        }
    })
})
// @from(Ln 387628, Col 0)
function Jd8(q, K) {
    for (let _ of Object.values(K.tasks))
        if (EJ(_) && _.identity.agentName === q) return _.id;
    return
}
// @from(Ln 387634, Col 0)
function J37(q, K, _) {
    K.update(q, (z) => ({
        ...z,
        awaitingPlanApproval: _
    }))
}
// @from(Ln 387641, Col 0)
function MGK(q, K, _) {
    J37(q, _, !1)
}
// @from(Ln 387644, Col 4)
X37 = L(() => {
    ZX()
})
// @from(Ln 387647, Col 4)
PGK = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Before Using This Tool
Ensure your plan is complete and unambiguous:
- If you have unresolved questions about requirements or approach, use AskUserQuestion first (in earlier phases)
- Once your plan is finalized, use THIS tool to request approval

**Important:** Do NOT use AskUserQuestion to ask "Is this plan okay?" or "Should I proceed?" - that's exactly what THIS tool does. ExitPlanMode inherently requests user approval of your plan.

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
`
// @from(Ln 387672, Col 0)
function WGK() {
    return null
}
// @from(Ln 387676, Col 0)
function DGK(q, K, {
    theme: _
}) {
    let {
        plan: z,
        filePath: Y
    } = q, A = !z || z.trim() === "", O = Y ? S3(Y) : "", w = q.awaitingLeaderApproval;
    if (A) return E9.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, E9.createElement(u, {
        flexDirection: "row"
    }, E9.createElement(T, {
        color: LV("plan")
    }, $9), E9.createElement(T, null, " Exited plan mode")));
    if (w) return E9.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, E9.createElement(u, {
        flexDirection: "row"
    }, E9.createElement(T, {
        color: LV("plan")
    }, $9), E9.createElement(T, null, " Plan submitted for team lead approval")), E9.createElement(_1, null, E9.createElement(u, {
        flexDirection: "column"
    }, Y && E9.createElement(T, {
        dimColor: !0
    }, "Plan file: ", O), E9.createElement(T, {
        dimColor: !0
    }, "Waiting for team lead to review and approve..."))));
    return E9.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, E9.createElement(u, {
        flexDirection: "row"
    }, E9.createElement(T, {
        color: LV("plan")
    }, $9), E9.createElement(T, null, " User approved Claude's plan")), E9.createElement(_1, null, E9.createElement(u, {
        flexDirection: "column"
    }, Y && E9.createElement(T, {
        dimColor: !0
    }, "Plan saved to: ", O, " · /plan to edit"), E9.createElement(xw, null, z))))
}
// @from(Ln 387719, Col 0)
function ZGK({
    plan: q
}, {
    theme: K
}) {
    let _ = q ?? lP() ?? "No plan found";
    return E9.createElement(u, {
        flexDirection: "column"
    }, E9.createElement(zU8, {
        plan: _
    }))
}
// @from(Ln 387731, Col 4)
E9
// @from(Ln 387732, Col 4)
fGK = L(() => {
    ry();
    GK();
    kq7();
    A3();
    OP();
    g6();
    eK();
    NJ();
    E9 = K6(P6(), 1)
})
// @from(Ln 387743, Col 4)
Pe = {}
// @from(Ln 387755, Col 0)
function GGK() {
    return {
        active: !1,
        flagCli: !1,
        circuitBroken: !1
    }
}
// @from(Ln 387763, Col 0)
function M37(q) {
    LM6.active = q
}
// @from(Ln 387767, Col 0)
function F$Y() {
    return LM6.active
}
// @from(Ln 387771, Col 0)
function g$Y(q) {
    LM6.flagCli = q
}
// @from(Ln 387775, Col 0)
function U$Y() {
    return LM6.flagCli
}
// @from(Ln 387779, Col 0)
function Q$Y(q) {
    LM6.circuitBroken = q
}
// @from(Ln 387783, Col 0)
function d$Y() {
    return LM6.circuitBroken
}
// @from(Ln 387787, Col 0)
function c$Y(q) {
    LM6 = q
}
// @from(Ln 387790, Col 4)
LM6
// @from(Ln 387791, Col 4)
Kn = L(() => {
    LM6 = GGK()
})
// @from(Ln 387797, Col 4)
vGK
// @from(Ln 387797, Col 9)
qI6
// @from(Ln 387797, Col 14)
n$Y
// @from(Ln 387797, Col 19)
TGK
// @from(Ln 387797, Col 24)
Vs2
// @from(Ln 387797, Col 29)
i$Y
// @from(Ln 387797, Col 34)
zZ
// @from(Ln 387798, Col 4)
n58 = L(() => {
    p7();
    y8();
    C8();
    gq();
    fO();
    K8();
    X37();
    U8();
    NJ();
    BP();
    e8();
    zY();
    ZX();
    sY();
    fGK();
    vGK = (Kn(), B7(Pe)), qI6 = (vX(), B7(P37)), n$Y = C6(() => y.object({
        tool: y.enum(["Bash"]).describe("The tool this prompt applies to"),
        prompt: y.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"')
    })), TGK = C6(() => y.strictObject({
        allowedPrompts: y.array(n$Y()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.")
    }).passthrough()), Vs2 = C6(() => TGK().extend({
        plan: y.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
        planFilePath: y.string().optional().describe("The plan file path (injected by normalizeToolInput)")
    })), i$Y = C6(() => y.object({
        plan: y.string().nullable().describe("The plan that was presented to the user"),
        isAgent: y.boolean(),
        filePath: y.string().optional().describe("The file path where the plan was saved"),
        hasTaskTool: y.boolean().optional().describe("Whether the Agent tool is available in the current context"),
        planWasEdited: y.boolean().optional().describe("True when the user edited the plan (CCR web UI or Ctrl+G); determines whether the plan is echoed back in tool_result"),
        awaitingLeaderApproval: y.boolean().optional().describe("When true, the teammate has sent a plan approval request to the team leader"),
        requestId: y.string().optional().describe("Unique identifier for the plan approval request")
    })), zZ = Iq({
        name: dP,
        searchHint: "present plan for approval and start coding (plan mode only)",
        maxResultSizeChars: 1e5,
        async description() {
            return "Prompts the user to exit plan mode and start coding"
        },
        async prompt() {
            return PGK
        },
        get inputSchema() {
            return TGK()
        },
        get outputSchema() {
            return i$Y()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            if (qj().length > 0) return !1;
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        requiresUserInteraction() {
            if (Lz()) return !1;
            return !0
        },
        async validateInput(q, {
            getAppState: K,
            options: _
        }) {
            if (Lz()) return {
                result: !0
            };
            let z = K().toolPermissionContext.mode;
            if (z !== "plan") return d("tengu_exit_plan_mode_called_outside_plan", {
                model: _.mainLoopModel,
                mode: z,
                hasExitedPlanModeInSession: _p6()
            }), {
                result: !1,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
                errorCode: 1
            };
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            if (Lz()) return {
                behavior: "allow",
                updatedInput: q
            };
            return {
                behavior: "ask",
                message: "Exit plan mode?",
                updatedInput: q
            }
        },
        renderToolUseMessage: WGK,
        renderToolResultMessage: DGK,
        renderToolUseRejectedMessage: ZGK,
        async call(q, K) {
            let _ = !!K.agentId,
                z = eW(K.agentId),
                Y = "plan" in q && typeof q.plan === "string" ? q.plan : void 0,
                A = Y ?? lP(K.agentId);
            if (Y !== void 0 && z) await l$Y(z, Y, "utf-8").catch((H) => j6(H)), gb8();
            if (Lz() && Pn6()) {
                if (!A) throw Error(`No plan file found at ${z}. Please write your plan to this file before calling ExitPlanMode.`);
                let H = T_() || "unknown",
                    J = Z9(),
                    X = ph6("plan_approval", op(H, J || "default")),
                    M = {
                        type: "plan_approval_request",
                        from: H,
                        timestamp: new Date().toISOString(),
                        planFilePath: z,
                        planContent: A,
                        requestId: X
                    };
                await F_("team-lead", {
                    from: H,
                    text: I6(M),
                    timestamp: new Date().toISOString()
                }, J);
                let P = K.getAppState(),
                    W = Jd8(H, P);
                if (W) J37(W, K.taskRegistry, !0);
                return {
                    data: {
                        plan: A,
                        isAgent: !0,
                        filePath: z,
                        awaitingLeaderApproval: !0,
                        requestId: X
                    }
                }
            }
            let O = K.getAppState(),
                w = null;
            {
                let H = O.toolPermissionContext.prePlanMode ?? "default";
                if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) {
                    let J = qI6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
                    w = qI6?.getAutoModeUnavailableNotification(J) ?? "auto mode unavailable", E(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${H} but gate is off (reason=${J}) — falling back to default on plan exit`, {
                        level: "warn"
                    })
                }
            }
            if (w) {
                let H = `plan exit → default · ${w}`;
                K.addNotification?.({
                    key: "auto-mode-gate-plan-exit-fallback",
                    text: H,
                    priority: "immediate",
                    color: "warning",
                    timeoutMs: 1e4
                }), sv({
                    type: "system",
                    subtype: "notification",
                    key: "auto-mode-gate-plan-exit-fallback",
                    text: H,
                    priority: "immediate",
                    color: "warning",
                    timeout_ms: 1e4
                })
            }
            let $ = K.getAppState().toolPermissionContext;
            if ($.mode === "plan") {
                iL(!0), Km(!0);
                let H = $.prePlanMode ?? "default";
                {
                    if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) H = "default";
                    let M = H === "auto",
                        P = vGK?.isAutoModeActive() ?? !1;
                    if (vGK?.setAutoModeActive(M), P && !M) sG(!0)
                }
                let J = H === "auto",
                    X = $.strippedDangerousRules;
                K.setToolPermissionContext((M) => {
                    let P = M;
                    if (J) P = qI6?.stripDangerousPermissionsForAutoMode(P) ?? P;
                    else if (X) P = qI6?.restoreDangerousPermissions(P) ?? P;
                    return {
                        ...P,
                        mode: H,
                        prePlanMode: void 0
                    }
                })
            }
            let j = z4() && K.options.tools.some((H) => e3(H, T4));
            return {
                data: {
                    plan: A,
                    isAgent: _,
                    filePath: z,
                    hasTaskTool: j || void 0,
                    planWasEdited: Y !== void 0 || void 0
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            isAgent: q,
            plan: K,
            filePath: _,
            hasTaskTool: z,
            planWasEdited: Y,
            awaitingLeaderApproval: A,
            requestId: O
        }, w) {
            if (A) return {
                type: "tool_result",
                content: `Your plan has been submitted to the team lead for approval.

Plan file: ${_}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${O}`,
                tool_use_id: w
            };
            if (q) return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: w
            };
            if (!K || K.trim() === "") return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: w
            };
            let $ = z ? `

If this plan can be broken down into multiple independent tasks, consider using the ${lp} tool to create a team and parallelize the work.` : "";
            return {
                type: "tool_result",
                content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${_}
You can refer back to it if needed during implementation.${$}

## ${Y?"Approved Plan (edited by user)":"Approved Plan"}:
${K}`,
                tool_use_id: w
            }
        }
    })
})
// @from(Ln 388052, Col 4)
VGK = "TestingPermission"
// @from(Ln 388053, Col 4)
r$Y
// @from(Ln 388053, Col 9)
Ls2
// @from(Ln 388054, Col 4)
kGK = L(() => {
    p7();
    gq();
    r$Y = C6(() => y.strictObject({})), Ls2 = Iq({
        name: VGK,
        maxResultSizeChars: 1e5,
        async description() {
            return "Test tool that always asks for permission"
        },
        async prompt() {
            return "Test tool that always asks for permission before executing. Used for end-to-end testing."
        },
        get inputSchema() {
            return r$Y()
        },
        userFacingName() {
            return "TestingPermission"
        },
        isEnabled() {
            return !1
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions() {
            return {
                behavior: "ask",
                message: "Run test?"
            }
        },
        renderToolUseMessage() {
            return null
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolUseQueuedMessage() {
            return null
        },
        renderToolUseRejectedMessage() {
            return null
        },
        renderToolResultMessage() {
            return null
        },
        renderToolUseErrorMessage() {
            return null
        },
        async call() {
            return {
                data: `${VGK} executed successfully`
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                type: "tool_result",
                content: String(q),
                tool_use_id: K
            }
        }
    })
})
// @from(Ln 388120, Col 0)
function qjY(q) {
    let K = s(3),
        {
            answers: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = mJ.createElement(u, {
        flexDirection: "row"
    }, mJ.createElement(T, {
        color: LV("default")
    }, $9, " "), mJ.createElement(T, null, "User answered Claude's questions:")), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = mJ.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, z, mJ.createElement(_1, null, mJ.createElement(u, {
        flexDirection: "column"
    }, Object.entries(_).map(KjY)))), K[1] = _, K[2] = Y;
    else Y = K[2];
    return Y
}
// @from(Ln 388143, Col 0)
function KjY(q) {
    let [K, _] = q;
    return mJ.createElement(T, {
        key: K,
        color: "inactive"
    }, "· ", K, " → ", _)
}
// @from(Ln 388151, Col 0)
function _jY(q) {
    if (q === void 0) return null;
    if (/<\s*(html|body|!doctype)\b/i.test(q)) return "preview must be an HTML fragment, not a full document (no <html>, <body>, or <!DOCTYPE>)";
    if (/<\s*(script|style)\b/i.test(q)) return "preview must not contain <script> or <style> tags. Use inline styles via the style attribute if needed.";
    if (!/<[a-z][^>]*>/i.test(q)) return 'preview must contain HTML (previewFormat is set to "html"). Wrap content in a tag like <div> or <pre>.';
    return null
}
// @from(Ln 388158, Col 4)
mJ
// @from(Ln 388158, Col 8)
a$Y
// @from(Ln 388158, Col 13)
EGK
// @from(Ln 388158, Col 18)
yGK
// @from(Ln 388158, Col 23)
NGK
// @from(Ln 388158, Col 28)
s$Y
// @from(Ln 388158, Col 33)
t$Y
// @from(Ln 388158, Col 38)
e$Y
// @from(Ln 388158, Col 43)
KI6
// @from(Ln 388159, Col 4)
Xd8 = L(() => {
    o6();
    y8();
    GK();
    A3();
    OP();
    p7();
    g6();
    gq();
    cp();
    mJ = K6(P6(), 1), a$Y = C6(() => y.object({
        label: y.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
        description: y.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications."),
        preview: y.string().optional().describe("Optional preview content rendered when this option is focused. Use for mockups, code snippets, or visual comparisons that help users compare options. See the tool description for the expected content format.")
    })), EGK = C6(() => y.object({
        question: y.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
        header: y.string().describe(`Very short label displayed as a chip/tag (max ${bS4} chars). Examples: "Auth method", "Library", "Approach".`),
        options: y.array(a$Y()).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
        multiSelect: y.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
    })), yGK = C6(() => {
        let q = y.object({
            preview: y.string().optional().describe("The preview content of the selected option, if the question used previews."),
            notes: y.string().optional().describe("Free-text notes the user added to their selection.")
        });
        return y.record(y.string(), q).optional().describe("Optional per-question annotations from the user (e.g., notes on preview selections). Keyed by question text.")
    }), NGK = {
        check: (q) => {
            let K = q.questions.map((_) => _.question);
            if (K.length !== new Set(K).size) return !1;
            for (let _ of q.questions) {
                let z = _.options.map((Y) => Y.label);
                if (z.length !== new Set(z).size) return !1
            }
            return !0
        },
        message: "Question texts must be unique, option labels must be unique within each question"
    }, s$Y = C6(() => ({
        answers: y.record(y.string(), y.string()).optional().describe("User answers collected by the permission component"),
        annotations: yGK(),
        metadata: y.object({
            source: y.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.')
        }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
    })), t$Y = C6(() => y.strictObject({
        questions: y.array(EGK()).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
        ...s$Y()
    }).refine(NGK.check, {
        message: NGK.message
    })), e$Y = C6(() => y.object({
        questions: y.array(EGK()).describe("The questions that were asked"),
        answers: y.record(y.string(), y.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)"),
        annotations: yGK()
    }));
    KI6 = Iq({
        name: AO,
        searchHint: "prompt the user with a multiple-choice question",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description() {
            return IS4
        },
        async prompt() {
            let q = cO8();
            if (q === void 0) return gn1;
            return gn1 + xS4[q]
        },
        get inputSchema() {
            return t$Y()
        },
        get outputSchema() {
            return e$Y()
        },
        userFacingName() {
            return ""
        },
        isEnabled() {
            if (qj().length > 0) return !1;
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.questions.map((K) => K.question).join(" | ")
        },
        requiresUserInteraction() {
            return !0
        },
        async validateInput({
            questions: q
        }) {
            if (cO8() !== "html") return {
                result: !0
            };
            for (let K of q)
                for (let _ of K.options) {
                    let z = _jY(_.preview);
                    if (z) return {
                        result: !1,
                        message: `Option "${_.label}" in question "${K.question}": ${z}`,
                        errorCode: 1
                    }
                }
            return {
                result: !0
            }
        },
        async checkPermissions(q) {
            return {
                behavior: "ask",
                message: "Answer questions?",
                updatedInput: q
            }
        },
        renderToolUseMessage() {
            return null
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolResultMessage({
            answers: q
        }, K) {
            return mJ.createElement(qjY, {
                answers: q
            })
        },
        renderToolUseRejectedMessage() {
            return mJ.createElement(u, {
                flexDirection: "row",
                marginTop: 1
            }, mJ.createElement(T, {
                color: LV("default")
            }, $9, " "), mJ.createElement(T, null, "User declined to answer questions"))
        },
        renderToolUseErrorMessage() {
            return null
        },
        async call({
            questions: q,
            answers: K = {},
            annotations: _
        }, z) {
            return {
                data: {
                    questions: q,
                    answers: K,
                    ..._ && {
                        annotations: _
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            answers: q,
            annotations: K
        }, _) {
            return {
                type: "tool_result",
                content: `User has answered your questions: ${Object.entries(q).map(([Y,A])=>{let O=K?.[Y],w=[`"${Y}"="${A}"`];if(O?.preview)w.push(`selected preview:
${O.preview}`);if(O?.notes)w.push(`user notes: ${O.notes}`);return w.join(" ")}).join(", ")}. You can now continue with the user's answers in mind.`,
                tool_use_id: _
            }
        }
    })
})
// @from(Ln 388331, Col 0)
function i58(q, K) {
    if (!q) return E("formatUri called with undefined URI - indicates malformed LSP server response", {
        level: "warn"
    }), "<unknown location>";
    let _ = q.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(_)) _ = _.slice(1);
    try {
        _ = decodeURIComponent(_)
    } catch (z) {
        let Y = b6(z);
        E(`Failed to decode LSP URI '${q}': ${Y}. Using un-decoded path: ${_}`, {
            level: "warn"
        })
    }
    if (K) {
        let z = zjY(K, _).replaceAll("\\", "/");
        if (z.length < _.length && !z.startsWith("../../")) return z
    }
    return _.replaceAll("\\", "/")
}
// @from(Ln 388352, Col 0)
function SGK(q, K) {
    let _ = new Map;
    for (let z of q) {
        let Y = "uri" in z ? z.uri : z.location.uri,
            A = i58(Y, K),
            O = _.get(A);
        if (O) O.push(z);
        else _.set(A, [z])
    }
    return _
}
// @from(Ln 388364, Col 0)
function Md8(q, K) {
    let _ = i58(q.uri, K),
        z = q.range.start.line + 1,
        Y = q.range.start.character + 1;
    return `${_}:${z}:${Y}`
}
// @from(Ln 388371, Col 0)
function LGK(q) {
    return {
        uri: q.targetUri,
        range: q.targetSelectionRange || q.targetRange
    }
}
// @from(Ln 388378, Col 0)
function hGK(q) {
    return "targetUri" in q
}
// @from(Ln 388382, Col 0)
function W37(q, K) {
    if (!q) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    if (Array.isArray(q)) {
        let z = q.map((w) => hGK(w) ? LGK(w) : w),
            Y = z.filter((w) => !w || !w.uri);
        if (Y.length > 0) E(`formatGoToDefinitionResult: Filtering out ${Y.length} invalid location(s) - this should have been caught earlier`, {
            level: "warn"
        });
        let A = z.filter((w) => w && w.uri);
        if (A.length === 0) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
        if (A.length === 1) return `Defined in ${Md8(A[0],K)}`;
        let O = A.map((w) => `  ${Md8(w,K)}`).join(`
`);
        return `Found ${A.length} definitions:
${O}`
    }
    let _ = hGK(q) ? LGK(q) : q;
    return `Defined in ${Md8(_,K)}`
}
// @from(Ln 388402, Col 0)
function CGK(q, K) {
    if (!q || q.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    let _ = q.filter((O) => !O || !O.uri);
    if (_.length > 0) E(`formatFindReferencesResult: Filtering out ${_.length} invalid location(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let z = q.filter((O) => O && O.uri);
    if (z.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    if (z.length === 1) return `Found 1 reference:
  ${Md8(z[0],K)}`;
    let Y = SGK(z, K),
        A = [`Found ${z.length} references across ${Y.size} files:`];
    for (let [O, w] of Y) {
        A.push(`
${O}:`);
        for (let $ of w) {
            let j = $.range.start.line + 1,
                H = $.range.start.character + 1;
            A.push(`  Line ${j}:${H}`)
        }
    }
    return A.join(`
`)
}
// @from(Ln 388427, Col 0)
function YjY(q) {
    if (Array.isArray(q)) return q.map((K) => {
        if (typeof K === "string") return K;
        return K.value
    }).join(`

`);
    if (typeof q === "string") return q;
    if ("kind" in q) return q.value;
    return q.value
}
// @from(Ln 388439, Col 0)
function bGK(q, K) {
    if (!q) return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
    let _ = YjY(q.contents);
    if (q.range) {
        let z = q.range.start.line + 1,
            Y = q.range.start.character + 1;
        return `Hover info at ${z}:${Y}:

${_}`
    }
    return _
}
// @from(Ln 388452, Col 0)
function _I6(q) {
    return {
        [1]: "File",
        [2]: "Module",
        [3]: "Namespace",
        [4]: "Package",
        [5]: "Class",
        [6]: "Method",
        [7]: "Property",
        [8]: "Field",
        [9]: "Constructor",
        [10]: "Enum",
        [11]: "Interface",
        [12]: "Function",
        [13]: "Variable",
        [14]: "Constant",
        [15]: "String",
        [16]: "Number",
        [17]: "Boolean",
        [18]: "Array",
        [19]: "Object",
        [20]: "Key",
        [21]: "Null",
        [22]: "EnumMember",
        [23]: "Struct",
        [24]: "Event",
        [25]: "Operator",
        [26]: "TypeParameter"
    } [q] || "Unknown"
}
// @from(Ln 388483, Col 0)
function IGK(q, K = 0) {
    let _ = [],
        z = "  ".repeat(K),
        Y = _I6(q.kind),
        A = `${z}${q.name} (${Y})`;
    if (q.detail) A += ` ${q.detail}`;
    let O = q.range.start.line + 1;
    if (A += ` - Line ${O}`, _.push(A), q.children && q.children.length > 0)
        for (let w of q.children) _.push(...IGK(w, K + 1));
    return _
}
// @from(Ln 388495, Col 0)
function xGK(q, K) {
    if (!q || q.length === 0) return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
    let _ = q[0];
    if (_ && "location" in _) return D37(q, K);
    let Y = ["Document symbols:"];
    for (let A of q) Y.push(...IGK(A));
    return Y.join(`
`)
}
// @from(Ln 388505, Col 0)
function D37(q, K) {
    if (!q || q.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let _ = q.filter((O) => !O || !O.location || !O.location.uri);
    if (_.length > 0) E(`formatWorkspaceSymbolResult: Filtering out ${_.length} invalid symbol(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let z = q.filter((O) => O && O.location && O.location.uri);
    if (z.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let Y = [`Found ${z.length} ${O7(z.length,"symbol")} in workspace:`],
        A = SGK(z, K);
    for (let [O, w] of A) {
        Y.push(`
${O}:`);
        for (let $ of w) {
            let j = _I6($.kind),
                H = $.location.range.start.line + 1,
                J = `  ${$.name} (${j}) - Line ${H}`;
            if ($.containerName) J += ` in ${$.containerName}`;
            Y.push(J)
        }
    }
    return Y.join(`
`)
}
// @from(Ln 388530, Col 0)
function RGK(q, K) {
    if (!q.uri) return E("formatCallHierarchyItem: CallHierarchyItem has undefined URI", {
        level: "warn"
    }), `${q.name} (${_I6(q.kind)}) - <unknown location>`;
    let _ = i58(q.uri, K),
        z = q.range.start.line + 1,
        Y = _I6(q.kind),
        A = `${q.name} (${Y}) - ${_}:${z}`;
    if (q.detail) A += ` [${q.detail}]`;
    return A
}
// @from(Ln 388542, Col 0)
function uGK(q, K) {
    if (!q || q.length === 0) return "No call hierarchy item found at this position";
    if (q.length === 1) return `Call hierarchy item: ${RGK(q[0],K)}`;
    let _ = [`Found ${q.length} call hierarchy items:`];
    for (let z of q) _.push(`  ${RGK(z,K)}`);
    return _.join(`
`)
}
// @from(Ln 388551, Col 0)
function mGK(q, K) {
    if (!q || q.length === 0) return "No incoming calls found (nothing calls this function)";
    let _ = [`Found ${q.length} incoming ${O7(q.length,"call")}:`],
        z = new Map;
    for (let Y of q) {
        if (!Y.from) {
            E("formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field", {
                level: "warn"
            });
            continue
        }
        let A = i58(Y.from.uri, K),
            O = z.get(A);
        if (O) O.push(Y);
        else z.set(A, [Y])
    }
    for (let [Y, A] of z) {
        _.push(`
${Y}:`);
        for (let O of A) {
            if (!O.from) continue;
            let w = _I6(O.from.kind),
                $ = O.from.range.start.line + 1,
                j = `  ${O.from.name} (${w}) - Line ${$}`;
            if (O.fromRanges && O.fromRanges.length > 0) {
                let H = O.fromRanges.map((J) => `${J.start.line+1}:${J.start.character+1}`).join(", ");
                j += ` [calls at: ${H}]`
            }
            _.push(j)
        }
    }
    return _.join(`
`)
}
// @from(Ln 388586, Col 0)
function BGK(q, K) {
    if (!q || q.length === 0) return "No outgoing calls found (this function calls nothing)";
    let _ = [`Found ${q.length} outgoing ${O7(q.length,"call")}:`],
        z = new Map;
    for (let Y of q) {
        if (!Y.to) {
            E("formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field", {
                level: "warn"
            });
            continue
        }
        let A = i58(Y.to.uri, K),
            O = z.get(A);
        if (O) O.push(Y);
        else z.set(A, [Y])
    }
    for (let [Y, A] of z) {
        _.push(`
${Y}:`);
        for (let O of A) {
            if (!O.to) continue;
            let w = _I6(O.to.kind),
                $ = O.to.range.start.line + 1,
                j = `  ${O.to.name} (${w}) - Line ${$}`;
            if (O.fromRanges && O.fromRanges.length > 0) {
                let H = O.fromRanges.map((J) => `${J.start.line+1}:${J.start.character+1}`).join(", ");
                j += ` [called from: ${H}]`
            }
            _.push(j)
        }
    }
    return _.join(`
`)
}
// @from(Ln 388620, Col 4)
pGK = L(() => {
    K8();
    m8()
})
// @from(Ln 388624, Col 4)
FGK
// @from(Ln 388625, Col 4)
gGK = L(() => {
    p7();
    FGK = C6(() => {
        let q = y.strictObject({
                operation: y.literal("goToDefinition"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            K = y.strictObject({
                operation: y.literal("findReferences"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            _ = y.strictObject({
                operation: y.literal("hover"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            z = y.strictObject({
                operation: y.literal("documentSymbol"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            Y = y.strictObject({
                operation: y.literal("workspaceSymbol"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            A = y.strictObject({
                operation: y.literal("goToImplementation"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            O = y.strictObject({
                operation: y.literal("prepareCallHierarchy"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            w = y.strictObject({
                operation: y.literal("incomingCalls"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            $ = y.strictObject({
                operation: y.literal("outgoingCalls"),
                filePath: y.string().describe("The absolute or relative path to the file"),
                line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            });
        return y.discriminatedUnion("operation", [q, K, _, z, Y, A, O, w, $])
    })
})