
// @from(Ln 141768, Col 0)
function Tm3(A, q, K) {
    let Y = Ju1(K) ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };
    return Y.inputTokens += q.input_tokens, Y.outputTokens += q.output_tokens, Y.cacheReadInputTokens += q.cache_read_input_tokens ?? 0, Y.cacheCreationInputTokens += q.cache_creation_input_tokens ?? 0, Y.webSearchRequests += q.server_tool_use?.web_search_requests ?? 0, Y.costUSD += A, Y.contextWindow = uM(K, Zj()), Y.maxOutputTokens = oa(K).default, Y
}
// @from(Ln 141782, Col 0)
function s21(A, q, K) {
    let Y = Tm3(A, q, K);
    ax1(A, Y, K);
    let z = Dq() && q.speed === "fast" ? {
        model: K,
        speed: "fast"
    } : {
        model: K
    };
    Zu1()?.add(A, z), Bw6()?.add(q.input_tokens, {
        ...z,
        type: "input"
    }), Bw6()?.add(q.output_tokens, {
        ...z,
        type: "output"
    }), Bw6()?.add(q.cache_read_input_tokens ?? 0, {
        ...z,
        type: "cacheRead"
    }), Bw6()?.add(q.cache_creation_input_tokens ?? 0, {
        ...z,
        type: "cacheCreation"
    })
}
// @from(Ln 141805, Col 4)
$k = E(() => {
    aK();
    FW();
    M4();
    z4();
    k8();
    T1();
    T1();
    T1();
    xJ();
    T1()
})
// @from(Ln 141818, Col 0)
function Fx6(A) {
    return A.replaceAll("&", Sf7).replaceAll("$", Cf7)
}
// @from(Ln 141822, Col 0)
function If7(A) {
    return A.replaceAll(Sf7, "&").replaceAll(Cf7, "$")
}
// @from(Ln 141826, Col 0)
function px6(A, q) {
    let K = 0,
        Y = 0;
    if (A.length === 0 && q) K = q.split(/\r?\n/).length;
    else K = A.reduce((z, _) => z + _.lines.filter((w) => w.startsWith("+")).length, 0), Y = A.reduce((z, _) => z + _.lines.filter((w) => w.startsWith("-")).length, 0);
    Wt6(K, Y), ft6()?.add(K, {
        type: "added"
    }), ft6()?.add(Y, {
        type: "removed"
    }), d("tengu_file_changed", {
        lines_added: K,
        lines_removed: Y
    })
}
// @from(Ln 141841, Col 0)
function t21({
    filePath: A,
    oldContent: q,
    newContent: K,
    ignoreWhitespace: Y = !1,
    singleHunk: z = !1
}) {
    return kD6(A, A, Fx6(q), Fx6(K), void 0, void 0, {
        ignoreWhitespace: Y,
        context: z ? 1e5 : hf7
    }).hunks.map((_) => ({
        ..._,
        lines: _.lines.map(If7)
    }))
}
// @from(Ln 141857, Col 0)
function SL({
    filePath: A,
    fileContents: q,
    edits: K,
    ignoreWhitespace: Y = !1
}) {
    let z = Fx6(vU(q));
    return kD6(A, A, z, K.reduce((_, w) => {
        let {
            old_string: O,
            new_string: $
        } = w, H = "replace_all" in w ? w.replace_all : !1, j = Fx6(vU(O)), J = Fx6(vU($));
        if (H) return _.replaceAll(j, () => J);
        else return _.replace(j, () => J)
    }, z), void 0, void 0, {
        context: hf7,
        ignoreWhitespace: Y
    }).hunks.map((_) => ({
        ..._,
        lines: _.lines.map(If7)
    }))
}
// @from(Ln 141879, Col 4)
hf7 = 3
// @from(Ln 141880, Col 4)
Sf7 = "<<:AMPERSAND_TOKEN:>>"
// @from(Ln 141881, Col 4)
Cf7 = "<<:DOLLAR_TOKEN:>>"
// @from(Ln 141882, Col 4)
NU = E(() => {
    ED6();
    $k();
    Z7();
    V1();
    T1()
})
// @from(Ln 141889, Col 4)
e21 = "ZPMQVRWSNKTXJBYH"
// @from(Ln 141890, Col 4)
Ss_
// @from(Ln 141890, Col 9)
Cs_
// @from(Ln 141890, Col 14)
Is_
// @from(Ln 141891, Col 4)
VU = E(() => {
    HA();
    T1();
    H1();
    V1();
    s8();
    Ss_ = Array.from({
        length: 256
    }, (A, q) => e21[q >>> 4] + e21[q & 15]), Cs_ = new RegExp(`^(\\d+)#([${e21}]{2})\\|`), Is_ = new RegExp(`^(\\d+)#([${e21}]{2})$`)
})
// @from(Ln 141902, Col 0)
function vm3() {
    return `
- You must use your \`${s7}\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file. `
}
// @from(Ln 141907, Col 0)
function bf7() {
    return Nm3()
}
// @from(Ln 141911, Col 0)
function Nm3() {
    return `Performs exact string replacements in files.

Usage:${vm3()}
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`.
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
}
// @from(Ln 141921, Col 4)
xf7 = E(() => {
    J_();
    VU()
})
// @from(Ln 141926, Col 0)
function uf7(A) {
    return A.replaceAll(VO8, "'").replaceAll(Aw1, "'").replaceAll(kO8, '"').replaceAll(EO8, '"')
}
// @from(Ln 141930, Col 0)
function yO8(A) {
    let q = A.split(/(\r\n|\n|\r)/),
        K = "";
    for (let Y = 0; Y < q.length; Y++) {
        let z = q[Y];
        if (z !== void 0)
            if (Y % 2 === 0) K += z.replace(/\s+$/, "");
            else K += z
    }
    return K
}
// @from(Ln 141942, Col 0)
function sq6(A, q) {
    if (A.includes(q)) return q;
    let K = uf7(q),
        z = uf7(A).indexOf(K);
    if (z !== -1) return A.substring(z, z + q.length);
    return null
}
// @from(Ln 141950, Col 0)
function hD6(A, q, K) {
    if (A === q) return K;
    let Y = q.includes(kO8) || q.includes(EO8),
        z = q.includes(VO8) || q.includes(Aw1);
    if (!Y && !z) return K;
    let _ = K;
    if (Y) _ = Vm3(_);
    if (z) _ = km3(_);
    return _
}
// @from(Ln 141961, Col 0)
function mf7(A, q) {
    if (q === 0) return !0;
    let K = A[q - 1];
    return K === " " || K === "\t" || K === `
` || K === "\r" || K === "(" || K === "[" || K === "{" || K === "—" || K === "–"
}
// @from(Ln 141968, Col 0)
function Vm3(A) {
    let q = [...A],
        K = [];
    for (let Y = 0; Y < q.length; Y++)
        if (q[Y] === '"') K.push(mf7(q, Y) ? kO8 : EO8);
        else K.push(q[Y]);
    return K.join("")
}
// @from(Ln 141977, Col 0)
function km3(A) {
    let q = [...A],
        K = [];
    for (let Y = 0; Y < q.length; Y++)
        if (q[Y] === "'") {
            let z = Y > 0 ? q[Y - 1] : void 0,
                _ = Y < q.length - 1 ? q[Y + 1] : void 0,
                w = z !== void 0 && /\p{L}/u.test(z),
                O = _ !== void 0 && /\p{L}/u.test(_);
            if (w && O) K.push(Aw1);
            else K.push(mf7(q, Y) ? VO8 : Aw1)
        } else K.push(q[Y]);
    return K.join("")
}
// @from(Ln 141992, Col 0)
function Em3(A, q, K, Y = !1) {
    let z = Y ? (w, O, $) => w.replaceAll(O, () => $) : (w, O, $) => w.replace(O, () => $);
    if (K !== "") return z(A, q, K);
    return !q.endsWith(`
`) && A.includes(q + `
`) ? z(A, q + `
`, K) : z(A, q, K)
}
// @from(Ln 142001, Col 0)
function qw1({
    filePath: A,
    fileContents: q,
    oldString: K,
    newString: Y,
    replaceAll: z = !1
}) {
    return Qx6({
        filePath: A,
        fileContents: q,
        edits: [{
            old_string: K,
            new_string: Y,
            replace_all: z
        }]
    })
}
// @from(Ln 142019, Col 0)
function Qx6({
    filePath: A,
    fileContents: q,
    edits: K
}) {
    let Y = q,
        z = [];
    if (!q && K.length === 1 && K[0] && K[0].old_string === "" && K[0].new_string === "") return {
        patch: SL({
            filePath: A,
            fileContents: q,
            edits: [{
                old_string: q,
                new_string: Y,
                replace_all: !1
            }]
        }),
        updatedFile: ""
    };
    for (let w of K) {
        let O = w.old_string.replace(/\n+$/, "");
        for (let H of z)
            if (O !== "" && H.includes(O)) throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
        let $ = Y;
        if (Y = w.old_string === "" ? w.new_string : Em3(Y, w.old_string, w.new_string, w.replace_all), Y === $) throw Error("String not found in file. Failed to apply edit.");
        z.push(w.new_string)
    }
    if (Y === q) throw Error("Original and edited file match exactly. Failed to apply edit.");
    return {
        patch: t21({
            filePath: A,
            oldContent: vU(q),
            newContent: vU(Y)
        }),
        updatedFile: Y
    }
}
// @from(Ln 142057, Col 0)
function Bf7(A, q) {
    return kD6("file.txt", "file.txt", A, q, void 0, void 0, {
        context: 8
    }).hunks.map((Y) => ({
        startLine: Y.oldStart,
        content: Y.lines.filter((z) => !z.startsWith("-") && !z.startsWith("\\")).map((z) => z.slice(1)).join(`
`)
    })).map(Kw1).join(`
...
`)
}
// @from(Ln 142069, Col 0)
function gf7(A) {
    return A.map((q) => {
        let K = [],
            Y = [],
            z = [];
        for (let _ of q.lines)
            if (_.startsWith(" ")) K.push(_.slice(1)), Y.push(_.slice(1)), z.push(_.slice(1));
            else if (_.startsWith("-")) Y.push(_.slice(1));
        else if (_.startsWith("+")) z.push(_.slice(1));
        return {
            old_string: Y.join(`
`),
            new_string: z.join(`
`),
            replace_all: !1
        }
    })
}
// @from(Ln 142088, Col 0)
function Lm3(A) {
    let q = A,
        K = [];
    for (let [Y, z] of Object.entries(ym3)) {
        let _ = q;
        if (q = q.replaceAll(Y, z), _ !== q) K.push({
            from: Y,
            to: z
        })
    }
    return {
        result: q,
        appliedReplacements: K
    }
}
// @from(Ln 142104, Col 0)
function Ff7({
    file_path: A,
    edits: q
}) {
    if (q.length === 0) return {
        file_path: A,
        edits: q
    };
    try {
        let K = L4(A);
        if (!$1().existsSync(K)) return {
            file_path: A,
            edits: q
        };
        let Y = LO8(K);
        return {
            file_path: A,
            edits: q.map(({
                old_string: z,
                new_string: _,
                replace_all: w
            }) => {
                let O = yO8(_),
                    $ = z;
                if (Y.includes($)) return {
                    old_string: $,
                    new_string: O,
                    replace_all: w
                };
                let {
                    result: H,
                    appliedReplacements: j
                } = Lm3($);
                if (Y.includes(H)) {
                    let J = O;
                    for (let {
                            from: M,
                            to: D
                        }
                        of j) J = J.replaceAll(M, D);
                    return {
                        old_string: H,
                        new_string: J,
                        replace_all: w
                    }
                }
                return {
                    old_string: $,
                    new_string: O,
                    replace_all: w
                }
            })
        }
    } catch (K) {
        _6(K)
    }
    return {
        file_path: A,
        edits: q
    }
}
// @from(Ln 142166, Col 0)
function Rm3(A, q, K) {
    if (A.length === q.length && A.every((O, $) => {
            let H = q[$];
            return H !== void 0 && O.old_string === H.old_string && O.new_string === H.new_string && O.replace_all === H.replace_all
        })) return !0;
    let Y = null,
        z = null,
        _ = null,
        w = null;
    try {
        Y = Qx6({
            filePath: "temp",
            fileContents: K,
            edits: A
        })
    } catch (O) {
        z = _1(O)
    }
    try {
        _ = Qx6({
            filePath: "temp",
            fileContents: K,
            edits: q
        })
    } catch (O) {
        w = _1(O)
    }
    if (z !== null && w !== null) return z === w;
    if (z !== null || w !== null) return !1;
    return Y.updatedFile === _.updatedFile
}
// @from(Ln 142198, Col 0)
function pf7(A, q) {
    if (A.file_path !== q.file_path) return !1;
    if (A.edits.length === q.edits.length && A.edits.every((z, _) => {
            let w = q.edits[_];
            return w !== void 0 && z.old_string === w.old_string && z.new_string === w.new_string && z.replace_all === w.replace_all
        })) return !0;
    let Y = $1().existsSync(A.file_path) ? LO8(A.file_path) : "";
    return Rm3(A.edits, q.edits, Y)
}
// @from(Ln 142207, Col 4)
VO8 = "‘"
// @from(Ln 142208, Col 4)
Aw1 = "’"
// @from(Ln 142209, Col 4)
kO8 = "“"
// @from(Ln 142210, Col 4)
EO8 = "”"
// @from(Ln 142211, Col 4)
ym3
// @from(Ln 142212, Col 4)
tq6 = E(() => {
    ED6();
    Z7();
    NU();
    F9();
    SA();
    k1();
    VU();
    s8();
    ym3 = {
        "<fnr>": "<function_results>",
        "<n>": "<name>",
        "</n>": "</name>",
        "<o>": "<output>",
        "</o>": "</output>",
        "<e>": "<error>",
        "</e>": "</error>",
        "<s>": "<system>",
        "</s>": "</system>",
        "<r>": "<result>",
        "</r>": "</result>",
        "< META_START >": "<META_START>",
        "< META_END >": "<META_END>",
        "< EOT >": "<EOT>",
        "< META >": "<META>",
        "< SOS >": "<SOS>",
        "\n\nH:": `

Human:`,
        "\n\nA:": `

Assistant:`
    }
})
// @from(Ln 142246, Col 0)
async function Ux6(A, q, {
    concurrency: K = Number.POSITIVE_INFINITY,
    stopOnError: Y = !0,
    signal: z
} = {}) {
    return new Promise((_, w) => {
        if (A[Symbol.iterator] === void 0 && A[Symbol.asyncIterator] === void 0) throw TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof A})`);
        if (typeof q !== "function") throw TypeError("Mapper function is required");
        if (!(Number.isSafeInteger(K) && K >= 1 || K === Number.POSITIVE_INFINITY)) throw TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${K}\` (${typeof K})`);
        let O = [],
            $ = [],
            H = new Map,
            j = !1,
            J = !1,
            M = !1,
            D = 0,
            X = 0,
            P = A[Symbol.iterator] === void 0 ? A[Symbol.asyncIterator]() : A[Symbol.iterator](),
            W = () => {
                f(z.reason)
            },
            Z = () => {
                z?.removeEventListener("abort", W)
            },
            G = (N) => {
                _(N), Z()
            },
            f = (N) => {
                j = !0, J = !0, w(N), Z()
            };
        if (z) {
            if (z.aborted) f(z.reason);
            z.addEventListener("abort", W, {
                once: !0
            })
        }
        let v = async () => {
            if (J) return;
            let N = await P.next(),
                V = X;
            if (X++, N.done) {
                if (M = !0, D === 0 && !J) {
                    if (!Y && $.length > 0) {
                        f(AggregateError($));
                        return
                    }
                    if (J = !0, H.size === 0) {
                        G(O);
                        return
                    }
                    let L = [];
                    for (let [h, R] of O.entries()) {
                        if (H.get(h) === Qf7) continue;
                        L.push(R)
                    }
                    G(L)
                }
                return
            }
            D++, (async () => {
                try {
                    let L = await N.value;
                    if (J) return;
                    let h = await q(L, V);
                    if (h === Qf7) H.set(V, h);
                    O[V] = h, D--, await v()
                } catch (L) {
                    if (Y) f(L);
                    else {
                        $.push(L), D--;
                        try {
                            await v()
                        } catch (h) {
                            f(h)
                        }
                    }
                }
            })()
        };
        (async () => {
            for (let N = 0; N < K; N++) {
                try {
                    await v()
                } catch (V) {
                    f(V);
                    break
                }
                if (M || j) break
            }
        })()
    })
}
// @from(Ln 142338, Col 4)
Qf7
// @from(Ln 142339, Col 4)
RO8 = E(() => {
    Qf7 = Symbol("skip")
})
// @from(Ln 142342, Col 0)
class hO8 {
    constructor(A) {
        this._client = A
    }
    async * callToolStream(A, q = bx, K) {
        let Y = this._client,
            z = {
                ...K,
                task: K?.task ?? (Y.isToolTask(A.name) ? {} : void 0)
            },
            _ = Y.requestStream({
                method: "tools/call",
                params: A
            }, q, z),
            w = Y.getToolOutputValidator(A.name);
        for await (let O of _) {
            if (O.type === "result" && w) {
                let $ = O.result;
                if (!$.structuredContent && !$.isError) {
                    yield {
                        type: "error",
                        error: new Aq(Fq.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`)
                    };
                    return
                }
                if ($.structuredContent) try {
                    let H = w($.structuredContent);
                    if (!H.valid) {
                        yield {
                            type: "error",
                            error: new Aq(Fq.InvalidParams, `Structured content does not match the tool's output schema: ${H.errorMessage}`)
                        };
                        return
                    }
                } catch (H) {
                    if (H instanceof Aq) {
                        yield {
                            type: "error",
                            error: H
                        };
                        return
                    }
                    yield {
                        type: "error",
                        error: new Aq(Fq.InvalidParams, `Failed to validate structured content: ${H instanceof Error?H.message:String(H)}`)
                    };
                    return
                }
            }
            yield O
        }
    }
    async getTask(A, q) {
        return this._client.getTask({
            taskId: A
        }, q)
    }
    async getTaskResult(A, q, K) {
        return this._client.getTaskResult({
            taskId: A
        }, q, K)
    }
    async listTasks(A, q) {
        return this._client.listTasks(A ? {
            cursor: A
        } : void 0, q)
    }
    async cancelTask(A, q) {
        return this._client.cancelTask({
            taskId: A
        }, q)
    }
    requestStream(A, q, K) {
        return this._client.requestStream(A, q, K)
    }
}
// @from(Ln 142418, Col 4)
Uf7 = E(() => {
    hD()
})
// @from(Ln 142422, Col 0)
function Yw1(A, q) {
    if (!A || q === null || typeof q !== "object") return;
    if (A.type === "object" && A.properties && typeof A.properties === "object") {
        let K = q,
            Y = A.properties;
        for (let z of Object.keys(Y)) {
            let _ = Y[z];
            if (K[z] === void 0 && Object.prototype.hasOwnProperty.call(_, "default")) K[z] = _.default;
            if (K[z] !== void 0) Yw1(_, K[z])
        }
    }
    if (Array.isArray(A.anyOf)) {
        for (let K of A.anyOf)
            if (typeof K !== "boolean") Yw1(K, q)
    }
    if (Array.isArray(A.oneOf)) {
        for (let K of A.oneOf)
            if (typeof K !== "boolean") Yw1(K, q)
    }
}
// @from(Ln 142443, Col 0)
function hm3(A) {
    if (!A) return {
        supportsFormMode: !1,
        supportsUrlMode: !1
    };
    let q = A.form !== void 0,
        K = A.url !== void 0;
    return {
        supportsFormMode: q || !q && !K,
        supportsUrlMode: K
    }
}
// @from(Ln 142455, Col 4)
zw1
// @from(Ln 142456, Col 4)
df7 = E(() => {
    $U1();
    hD();
    jd1();
    Iy6();
    Uf7();
    zw1 = class zw1 extends xy6 {
        constructor(A, q) {
            super(q);
            if (this._clientInfo = A, this._cachedToolOutputValidators = new Map, this._cachedKnownTaskTools = new Set, this._cachedRequiredTaskTools = new Set, this._listChangedDebounceTimers = new Map, this._capabilities = q?.capabilities ?? {}, this._jsonSchemaValidator = q?.jsonSchemaValidator ?? new zL6, q?.listChanged) this._pendingListChangedConfig = q.listChanged
        }
        _setupListChangedHandlers(A) {
            if (A.tools && this._serverCapabilities?.tools?.listChanged) this._setupListChangedHandler("tools", Hy6, A.tools, async () => {
                return (await this.listTools()).tools
            });
            if (A.prompts && this._serverCapabilities?.prompts?.listChanged) this._setupListChangedHandler("prompts", wy6, A.prompts, async () => {
                return (await this.listPrompts()).prompts
            });
            if (A.resources && this._serverCapabilities?.resources?.listChanged) this._setupListChangedHandler("resources", zy6, A.resources, async () => {
                return (await this.listResources()).resources
            })
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new hO8(this)
            };
            return this._experimental
        }
        registerCapabilities(A) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = F61(this._capabilities, A)
        }
        setRequestHandler(A, q) {
            let Y = FO6(A)?.method;
            if (!Y) throw Error("Schema is missing a method literal");
            let z;
            if (Qn(Y)) {
                let w = Y;
                z = w._zod?.def?.value ?? w.value
            } else {
                let w = Y;
                z = w._def?.value ?? w.value
            }
            if (typeof z !== "string") throw Error("Schema method literal must be a string");
            let _ = z;
            if (_ === "elicitation/create") {
                let w = async (O, $) => {
                    let H = $G(yp, O);
                    if (!H.success) {
                        let Z = H.error instanceof Error ? H.error.message : String(H.error);
                        throw new Aq(Fq.InvalidParams, `Invalid elicitation request: ${Z}`)
                    }
                    let {
                        params: j
                    } = H.data;
                    j.mode = j.mode ?? "form";
                    let {
                        supportsFormMode: J,
                        supportsUrlMode: M
                    } = hm3(this._capabilities.elicitation);
                    if (j.mode === "form" && !J) throw new Aq(Fq.InvalidParams, "Client does not support form-mode elicitation requests");
                    if (j.mode === "url" && !M) throw new Aq(Fq.InvalidParams, "Client does not support URL-mode elicitation requests");
                    let D = await Promise.resolve(q(O, $));
                    if (j.task) {
                        let Z = $G(Ep, D);
                        if (!Z.success) {
                            let G = Z.error instanceof Error ? Z.error.message : String(Z.error);
                            throw new Aq(Fq.InvalidParams, `Invalid task creation result: ${G}`)
                        }
                        return Z.data
                    }
                    let X = $G(Cn, D);
                    if (!X.success) {
                        let Z = X.error instanceof Error ? X.error.message : String(X.error);
                        throw new Aq(Fq.InvalidParams, `Invalid elicitation result: ${Z}`)
                    }
                    let P = X.data,
                        W = j.mode === "form" ? j.requestedSchema : void 0;
                    if (j.mode === "form" && P.action === "accept" && P.content && W) {
                        if (this._capabilities.elicitation?.form?.applyDefaults) try {
                            Yw1(W, P.content)
                        } catch {}
                    }
                    return P
                };
                return super.setRequestHandler(A, w)
            }
            if (_ === "sampling/createMessage") {
                let w = async (O, $) => {
                    let H = $G($Q1, O);
                    if (!H.success) {
                        let P = H.error instanceof Error ? H.error.message : String(H.error);
                        throw new Aq(Fq.InvalidParams, `Invalid sampling request: ${P}`)
                    }
                    let {
                        params: j
                    } = H.data, J = await Promise.resolve(q(O, $));
                    if (j.task) {
                        let P = $G(Ep, J);
                        if (!P.success) {
                            let W = P.error instanceof Error ? P.error.message : String(P.error);
                            throw new Aq(Fq.InvalidParams, `Invalid task creation result: ${W}`)
                        }
                        return P.data
                    }
                    let D = j.tools || j.toolChoice ? Jy6 : fA6,
                        X = $G(D, J);
                    if (!X.success) {
                        let P = X.error instanceof Error ? X.error.message : String(X.error);
                        throw new Aq(Fq.InvalidParams, `Invalid sampling result: ${P}`)
                    }
                    return X.data
                };
                return super.setRequestHandler(A, w)
            }
            return super.setRequestHandler(A, q)
        }
        assertCapability(A, q) {
            if (!this._serverCapabilities?.[A]) throw Error(`Server does not support ${A} (required for ${q})`)
        }
        async connect(A, q) {
            if (await super.connect(A), A.sessionId !== void 0) return;
            try {
                let K = await this.request({
                    method: "initialize",
                    params: {
                        protocolVersion: hn,
                        capabilities: this._capabilities,
                        clientInfo: this._clientInfo
                    }
                }, tp1, q);
                if (K === void 0) throw Error(`Server sent invalid initialize result: ${K}`);
                if (!se6.includes(K.protocolVersion)) throw Error(`Server's protocol version is not supported: ${K.protocolVersion}`);
                if (this._serverCapabilities = K.capabilities, this._serverVersion = K.serverInfo, A.setProtocolVersion) A.setProtocolVersion(K.protocolVersion);
                if (this._instructions = K.instructions, await this.notification({
                        method: "notifications/initialized"
                    }), this._pendingListChangedConfig) this._setupListChangedHandlers(this._pendingListChangedConfig), this._pendingListChangedConfig = void 0
            } catch (K) {
                throw this.close(), K
            }
        }
        getServerCapabilities() {
            return this._serverCapabilities
        }
        getServerVersion() {
            return this._serverVersion
        }
        getInstructions() {
            return this._instructions
        }
        assertCapabilityForMethod(A) {
            switch (A) {
                case "logging/setLevel":
                    if (!this._serverCapabilities?.logging) throw Error(`Server does not support logging (required for ${A})`);
                    break;
                case "prompts/get":
                case "prompts/list":
                    if (!this._serverCapabilities?.prompts) throw Error(`Server does not support prompts (required for ${A})`);
                    break;
                case "resources/list":
                case "resources/templates/list":
                case "resources/read":
                case "resources/subscribe":
                case "resources/unsubscribe":
                    if (!this._serverCapabilities?.resources) throw Error(`Server does not support resources (required for ${A})`);
                    if (A === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw Error(`Server does not support resource subscriptions (required for ${A})`);
                    break;
                case "tools/call":
                case "tools/list":
                    if (!this._serverCapabilities?.tools) throw Error(`Server does not support tools (required for ${A})`);
                    break;
                case "completion/complete":
                    if (!this._serverCapabilities?.completions) throw Error(`Server does not support completions (required for ${A})`);
                    break;
                case "initialize":
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(A) {
            switch (A) {
                case "notifications/roots/list_changed":
                    if (!this._capabilities.roots?.listChanged) throw Error(`Client does not support roots list changed notifications (required for ${A})`);
                    break;
                case "notifications/initialized":
                    break;
                case "notifications/cancelled":
                    break;
                case "notifications/progress":
                    break
            }
        }
        assertRequestHandlerCapability(A) {
            if (!this._capabilities) return;
            switch (A) {
                case "sampling/createMessage":
                    if (!this._capabilities.sampling) throw Error(`Client does not support sampling capability (required for ${A})`);
                    break;
                case "elicitation/create":
                    if (!this._capabilities.elicitation) throw Error(`Client does not support elicitation capability (required for ${A})`);
                    break;
                case "roots/list":
                    if (!this._capabilities.roots) throw Error(`Client does not support roots capability (required for ${A})`);
                    break;
                case "tasks/get":
                case "tasks/list":
                case "tasks/result":
                case "tasks/cancel":
                    if (!this._capabilities.tasks) throw Error(`Client does not support tasks capability (required for ${A})`);
                    break;
                case "ping":
                    break
            }
        }
        assertTaskCapability(A) {
            k11(this._serverCapabilities?.tasks?.requests, A, "Server")
        }
        assertTaskHandlerCapability(A) {
            if (!this._capabilities) return;
            E11(this._capabilities.tasks?.requests, A, "Client")
        }
        async ping(A) {
            return this.request({
                method: "ping"
            }, kp, A)
        }
        async complete(A, q) {
            return this.request({
                method: "completion/complete",
                params: A
            }, HQ1, q)
        }
        async setLoggingLevel(A, q) {
            return this.request({
                method: "logging/setLevel",
                params: {
                    level: A
                }
            }, kp, q)
        }
        async getPrompt(A, q) {
            return this.request({
                method: "prompts/get",
                params: A
            }, wQ1, q)
        }
        async listPrompts(A, q) {
            return this.request({
                method: "prompts/list",
                params: A
            }, _y6, q)
        }
        async listResources(A, q) {
            return this.request({
                method: "resources/list",
                params: A
            }, Ky6, q)
        }
        async listResourceTemplates(A, q) {
            return this.request({
                method: "resources/templates/list",
                params: A
            }, AQ1, q)
        }
        async readResource(A, q) {
            return this.request({
                method: "resources/read",
                params: A
            }, Yy6, q)
        }
        async subscribeResource(A, q) {
            return this.request({
                method: "resources/subscribe",
                params: A
            }, kp, q)
        }
        async unsubscribeResource(A, q) {
            return this.request({
                method: "resources/unsubscribe",
                params: A
            }, kp, q)
        }
        async callTool(A, q = bx, K) {
            if (this.isToolTaskRequired(A.name)) throw new Aq(Fq.InvalidRequest, `Tool "${A.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
            let Y = await this.request({
                    method: "tools/call",
                    params: A
                }, q, K),
                z = this.getToolOutputValidator(A.name);
            if (z) {
                if (!Y.structuredContent && !Y.isError) throw new Aq(Fq.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`);
                if (Y.structuredContent) try {
                    let _ = z(Y.structuredContent);
                    if (!_.valid) throw new Aq(Fq.InvalidParams, `Structured content does not match the tool's output schema: ${_.errorMessage}`)
                } catch (_) {
                    if (_ instanceof Aq) throw _;
                    throw new Aq(Fq.InvalidParams, `Failed to validate structured content: ${_ instanceof Error?_.message:String(_)}`)
                }
            }
            return Y
        }
        isToolTask(A) {
            if (!this._serverCapabilities?.tasks?.requests?.tools?.call) return !1;
            return this._cachedKnownTaskTools.has(A)
        }
        isToolTaskRequired(A) {
            return this._cachedRequiredTaskTools.has(A)
        }
        cacheToolMetadata(A) {
            this._cachedToolOutputValidators.clear(), this._cachedKnownTaskTools.clear(), this._cachedRequiredTaskTools.clear();
            for (let q of A) {
                if (q.outputSchema) {
                    let Y = this._jsonSchemaValidator.getValidator(q.outputSchema);
                    this._cachedToolOutputValidators.set(q.name, Y)
                }
                let K = q.execution?.taskSupport;
                if (K === "required" || K === "optional") this._cachedKnownTaskTools.add(q.name);
                if (K === "required") this._cachedRequiredTaskTools.add(q.name)
            }
        }
        getToolOutputValidator(A) {
            return this._cachedToolOutputValidators.get(A)
        }
        async listTools(A, q) {
            let K = await this.request({
                method: "tools/list",
                params: A
            }, $y6, q);
            return this.cacheToolMetadata(K.tools), K
        }
        _setupListChangedHandler(A, q, K, Y) {
            let z = fqA.safeParse(K);
            if (!z.success) throw Error(`Invalid ${A} listChanged options: ${z.error.message}`);
            if (typeof K.onChanged !== "function") throw Error(`Invalid ${A} listChanged options: onChanged must be a function`);
            let {
                autoRefresh: _,
                debounceMs: w
            } = z.data, {
                onChanged: O
            } = K, $ = async () => {
                if (!_) {
                    O(null, null);
                    return
                }
                try {
                    let j = await Y();
                    O(null, j)
                } catch (j) {
                    let J = j instanceof Error ? j : Error(String(j));
                    O(J, null)
                }
            }, H = () => {
                if (w) {
                    let j = this._listChangedDebounceTimers.get(A);
                    if (j) clearTimeout(j);
                    let J = setTimeout($, w);
                    this._listChangedDebounceTimers.set(A, J)
                } else $()
            };
            this.setNotificationHandler(q, H)
        }
        async sendRootsListChanged() {
            return this.notification({
                method: "notifications/roots/list_changed"
            })
        }
    }
})
// @from(Ln 142830, Col 0)
function Im3() {
    let A = {};
    for (let q of Cm3) {
        let K = _w1.env[q];
        if (K === void 0) continue;
        if (K.startsWith("()")) continue;
        A[q] = K
    }
    return A
}
// @from(Ln 142840, Col 0)
class SO8 {
    constructor(A) {
        if (this._readBuffer = new Dy6, this._stderrStream = null, this._serverParams = A, A.stderr === "pipe" || A.stderr === "overlapped") this._stderrStream = new Sm3
    }
    async start() {
        if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return new Promise((A, q) => {
            if (this._process = cf7.default(this._serverParams.command, this._serverParams.args ?? [], {
                    env: {
                        ...Im3(),
                        ...this._serverParams.env
                    },
                    stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
                    shell: !1,
                    windowsHide: _w1.platform === "win32" && bm3(),
                    cwd: this._serverParams.cwd
                }), this._process.on("error", (K) => {
                    q(K), this.onerror?.(K)
                }), this._process.on("spawn", () => {
                    A()
                }), this._process.on("close", (K) => {
                    this._process = void 0, this.onclose?.()
                }), this._process.stdin?.on("error", (K) => {
                    this.onerror?.(K)
                }), this._process.stdout?.on("data", (K) => {
                    this._readBuffer.append(K), this.processReadBuffer()
                }), this._process.stdout?.on("error", (K) => {
                    this.onerror?.(K)
                }), this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream)
        })
    }
    get stderr() {
        if (this._stderrStream) return this._stderrStream;
        return this._process?.stderr ?? null
    }
    get pid() {
        return this._process?.pid ?? null
    }
    processReadBuffer() {
        while (!0) try {
            let A = this._readBuffer.readMessage();
            if (A === null) break;
            this.onmessage?.(A)
        } catch (A) {
            this.onerror?.(A)
        }
    }
    async close() {
        if (this._process) {
            let A = this._process;
            this._process = void 0;
            let q = new Promise((K) => {
                A.once("close", () => {
                    K()
                })
            });
            try {
                A.stdin?.end()
            } catch {}
            if (await Promise.race([q, new Promise((K) => setTimeout(K, 2000).unref())]), A.exitCode === null) {
                try {
                    A.kill("SIGTERM")
                } catch {}
                await Promise.race([q, new Promise((K) => setTimeout(K, 2000).unref())])
            }
            if (A.exitCode === null) try {
                A.kill("SIGKILL")
            } catch {}
        }
        this._readBuffer.clear()
    }
    send(A) {
        return new Promise((q) => {
            if (!this._process?.stdin) throw Error("Not connected");
            let K = j61(A);
            if (this._process.stdin.write(K)) q();
            else this._process.stdin.once("drain", q)
        })
    }
}
// @from(Ln 142921, Col 0)
function bm3() {
    return "type" in _w1
}
// @from(Ln 142924, Col 4)
cf7
// @from(Ln 142924, Col 9)
Cm3
// @from(Ln 142925, Col 4)
lf7 = E(() => {
    MQ1();
    cf7 = t(kd1(), 1), Cm3 = _w1.platform === "win32" ? ["APPDATA", "HOMEDRIVE", "HOMEPATH", "LOCALAPPDATA", "PATH", "PROCESSOR_ARCHITECTURE", "SYSTEMDRIVE", "SYSTEMROOT", "TEMP", "USERNAME", "USERPROFILE", "PROGRAMFILES"] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
})
// @from(Ln 142930, Col 0)
function CO8(A) {}
// @from(Ln 142932, Col 0)
function ww1(A) {
    if (typeof A == "function") throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
    let {
        onEvent: q = CO8,
        onError: K = CO8,
        onRetry: Y = CO8,
        onComment: z
    } = A, _ = "", w = !0, O, $ = "", H = "";

    function j(P) {
        let W = w ? P.replace(/^\xEF\xBB\xBF/, "") : P,
            [Z, G] = xm3(`${_}${W}`);
        for (let f of Z) J(f);
        _ = G, w = !1
    }

    function J(P) {
        if (P === "") {
            D();
            return
        }
        if (P.startsWith(":")) {
            z && z(P.slice(P.startsWith(": ") ? 2 : 1));
            return
        }
        let W = P.indexOf(":");
        if (W !== -1) {
            let Z = P.slice(0, W),
                G = P[W + 1] === " " ? 2 : 1,
                f = P.slice(W + G);
            M(Z, f, P);
            return
        }
        M(P, "", P)
    }

    function M(P, W, Z) {
        switch (P) {
            case "event":
                H = W;
                break;
            case "data":
                $ = `${$}${W}
`;
                break;
            case "id":
                O = W.includes("\x00") ? void 0 : W;
                break;
            case "retry":
                /^\d+$/.test(W) ? Y(parseInt(W, 10)) : K(new IO8(`Invalid \`retry\` value: "${W}"`, {
                    type: "invalid-retry",
                    value: W,
                    line: Z
                }));
                break;
            default:
                K(new IO8(`Unknown field "${P.length>20?`${P.slice(0,20)}…`:P}"`, {
                    type: "unknown-field",
                    field: P,
                    value: W,
                    line: Z
                }));
                break
        }
    }

    function D() {
        $.length > 0 && q({
            id: O,
            event: H || void 0,
            data: $.endsWith(`
`) ? $.slice(0, -1) : $
        }), O = void 0, $ = "", H = ""
    }

    function X(P = {}) {
        _ && P.consume && J(_), w = !0, O = void 0, $ = "", H = "", _ = ""
    }
    return {
        feed: j,
        reset: X
    }
}
// @from(Ln 143016, Col 0)
function xm3(A) {
    let q = [],
        K = "",
        Y = 0;
    for (; Y < A.length;) {
        let z = A.indexOf("\r", Y),
            _ = A.indexOf(`
`, Y),
            w = -1;
        if (z !== -1 && _ !== -1 ? w = Math.min(z, _) : z !== -1 ? w = z : _ !== -1 && (w = _), w === -1) {
            K = A.slice(Y);
            break
        } else {
            let O = A.slice(Y, w);
            q.push(O), Y = w + 1, A[Y - 1] === "\r" && A[Y] === `
` && Y++
        }
    }
    return [q, K]
}
// @from(Ln 143036, Col 4)
IO8
// @from(Ln 143037, Col 4)
bO8 = E(() => {
    IO8 = class IO8 extends Error {
        constructor(A, q) {
            super(A), this.name = "ParseError", this.type = q.type, this.field = q.field, this.value = q.value, this.line = q.line
        }
    }
})
// @from(Ln 143045, Col 0)
function um3(A) {
    let q = globalThis.DOMException;
    return typeof q == "function" ? new q(A, "SyntaxError") : SyntaxError(A)
}
// @from(Ln 143050, Col 0)
function uO8(A) {
    return A instanceof Error ? "errors" in A && Array.isArray(A.errors) ? A.errors.map(uO8).join(", ") : ("cause" in A) && A.cause instanceof Error ? `${A}: ${uO8(A.cause)}` : A.message : `${A}`
}
// @from(Ln 143054, Col 0)
function if7(A) {
    return {
        type: A.type,
        message: A.message,
        code: A.code,
        defaultPrevented: A.defaultPrevented,
        cancelable: A.cancelable,
        timeStamp: A.timeStamp
    }
}
// @from(Ln 143065, Col 0)
function mm3() {
    let A = "document" in globalThis ? globalThis.document : void 0;
    return A && typeof A == "object" && "baseURI" in A && typeof A.baseURI == "string" ? A.baseURI : void 0
}
// @from(Ln 143069, Col 4)
xO8
// @from(Ln 143069, Col 9)
rf7 = (A) => {
        throw TypeError(A)
    }
// @from(Ln 143072, Col 4)
dO8 = (A, q, K) => q.has(A) || rf7("Cannot " + K)
// @from(Ln 143073, Col 4)
V9 = (A, q, K) => (dO8(A, q, "read from private field"), K ? K.call(A) : q.get(A))
// @from(Ln 143074, Col 4)
mM = (A, q, K) => q.has(A) ? rf7("Cannot add the same private member more than once") : q instanceof WeakSet ? q.add(A) : q.set(A, K)
// @from(Ln 143075, Col 4)
A$ = (A, q, K, Y) => (dO8(A, q, "write to private field"), q.set(A, K), K)
// @from(Ln 143076, Col 4)
kU = (A, q, K) => (dO8(A, q, "access private method"), K)
// @from(Ln 143077, Col 4)
Dv
// @from(Ln 143077, Col 8)
eq6
// @from(Ln 143077, Col 13)
SD6
// @from(Ln 143077, Col 18)
Ow1
// @from(Ln 143077, Col 23)
$w1
// @from(Ln 143077, Col 28)
lx6
// @from(Ln 143077, Col 33)
bD6
// @from(Ln 143077, Col 38)
ix6
// @from(Ln 143077, Col 43)
aa
// @from(Ln 143077, Col 47)
CD6
// @from(Ln 143077, Col 52)
xD6
// @from(Ln 143077, Col 57)
ID6
// @from(Ln 143077, Col 62)
dx6
// @from(Ln 143077, Col 67)
SC
// @from(Ln 143077, Col 71)
mO8
// @from(Ln 143077, Col 76)
BO8
// @from(Ln 143077, Col 81)
gO8
// @from(Ln 143077, Col 86)
nf7
// @from(Ln 143077, Col 91)
FO8
// @from(Ln 143077, Col 96)
pO8
// @from(Ln 143077, Col 101)
cx6
// @from(Ln 143077, Col 106)
QO8
// @from(Ln 143077, Col 111)
UO8
// @from(Ln 143077, Col 116)
uD6
// @from(Ln 143078, Col 4)
of7 = E(() => {
    bO8();
    xO8 = class xO8 extends Event {
        constructor(A, q) {
            var K, Y;
            super(A), this.code = (K = q == null ? void 0 : q.code) != null ? K : void 0, this.message = (Y = q == null ? void 0 : q.message) != null ? Y : void 0
        } [Symbol.for("nodejs.util.inspect.custom")](A, q, K) {
            return K(if7(this), q)
        } [Symbol.for("Deno.customInspect")](A, q) {
            return A(if7(this), q)
        }
    };
    uD6 = class uD6 extends EventTarget {
        constructor(A, q) {
            var K, Y;
            super(), mM(this, SC), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, mM(this, Dv), mM(this, eq6), mM(this, SD6), mM(this, Ow1), mM(this, $w1), mM(this, lx6), mM(this, bD6), mM(this, ix6, null), mM(this, aa), mM(this, CD6), mM(this, xD6, null), mM(this, ID6, null), mM(this, dx6, null), mM(this, BO8, async (z) => {
                var _;
                V9(this, CD6).reset();
                let {
                    body: w,
                    redirected: O,
                    status: $,
                    headers: H
                } = z;
                if ($ === 204) {
                    kU(this, SC, cx6).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
                    return
                }
                if (O ? A$(this, SD6, new URL(z.url)) : A$(this, SD6, void 0), $ !== 200) {
                    kU(this, SC, cx6).call(this, `Non-200 status code (${$})`, $);
                    return
                }
                if (!(H.get("content-type") || "").startsWith("text/event-stream")) {
                    kU(this, SC, cx6).call(this, 'Invalid content type, expected "text/event-stream"', $);
                    return
                }
                if (V9(this, Dv) === this.CLOSED) return;
                A$(this, Dv, this.OPEN);
                let j = new Event("open");
                if ((_ = V9(this, dx6)) == null || _.call(this, j), this.dispatchEvent(j), typeof w != "object" || !w || !("getReader" in w)) {
                    kU(this, SC, cx6).call(this, "Invalid response body, expected a web ReadableStream", $), this.close();
                    return
                }
                let J = new TextDecoder,
                    M = w.getReader(),
                    D = !0;
                do {
                    let {
                        done: X,
                        value: P
                    } = await M.read();
                    P && V9(this, CD6).feed(J.decode(P, {
                        stream: !X
                    })), X && (D = !1, V9(this, CD6).reset(), kU(this, SC, QO8).call(this))
                } while (D)
            }), mM(this, gO8, (z) => {
                A$(this, aa, void 0), !(z.name === "AbortError" || z.type === "aborted") && kU(this, SC, QO8).call(this, uO8(z))
            }), mM(this, FO8, (z) => {
                typeof z.id == "string" && A$(this, ix6, z.id);
                let _ = new MessageEvent(z.event || "message", {
                    data: z.data,
                    origin: V9(this, SD6) ? V9(this, SD6).origin : V9(this, eq6).origin,
                    lastEventId: z.id || ""
                });
                V9(this, ID6) && (!z.event || z.event === "message") && V9(this, ID6).call(this, _), this.dispatchEvent(_)
            }), mM(this, pO8, (z) => {
                A$(this, lx6, z)
            }), mM(this, UO8, () => {
                A$(this, bD6, void 0), V9(this, Dv) === this.CONNECTING && kU(this, SC, mO8).call(this)
            });
            try {
                if (A instanceof URL) A$(this, eq6, A);
                else if (typeof A == "string") A$(this, eq6, new URL(A, mm3()));
                else throw Error("Invalid URL")
            } catch {
                throw um3("An invalid or illegal string was specified")
            }
            A$(this, CD6, ww1({
                onEvent: V9(this, FO8),
                onRetry: V9(this, pO8)
            })), A$(this, Dv, this.CONNECTING), A$(this, lx6, 3000), A$(this, $w1, (K = q == null ? void 0 : q.fetch) != null ? K : globalThis.fetch), A$(this, Ow1, (Y = q == null ? void 0 : q.withCredentials) != null ? Y : !1), kU(this, SC, mO8).call(this)
        }
        get readyState() {
            return V9(this, Dv)
        }
        get url() {
            return V9(this, eq6).href
        }
        get withCredentials() {
            return V9(this, Ow1)
        }
        get onerror() {
            return V9(this, xD6)
        }
        set onerror(A) {
            A$(this, xD6, A)
        }
        get onmessage() {
            return V9(this, ID6)
        }
        set onmessage(A) {
            A$(this, ID6, A)
        }
        get onopen() {
            return V9(this, dx6)
        }
        set onopen(A) {
            A$(this, dx6, A)
        }
        addEventListener(A, q, K) {
            let Y = q;
            super.addEventListener(A, Y, K)
        }
        removeEventListener(A, q, K) {
            let Y = q;
            super.removeEventListener(A, Y, K)
        }
        close() {
            V9(this, bD6) && clearTimeout(V9(this, bD6)), V9(this, Dv) !== this.CLOSED && (V9(this, aa) && V9(this, aa).abort(), A$(this, Dv, this.CLOSED), A$(this, aa, void 0))
        }
    };
    Dv = new WeakMap, eq6 = new WeakMap, SD6 = new WeakMap, Ow1 = new WeakMap, $w1 = new WeakMap, lx6 = new WeakMap, bD6 = new WeakMap, ix6 = new WeakMap, aa = new WeakMap, CD6 = new WeakMap, xD6 = new WeakMap, ID6 = new WeakMap, dx6 = new WeakMap, SC = new WeakSet, mO8 = function() {
        A$(this, Dv, this.CONNECTING), A$(this, aa, new AbortController), V9(this, $w1)(V9(this, eq6), kU(this, SC, nf7).call(this)).then(V9(this, BO8)).catch(V9(this, gO8))
    }, BO8 = new WeakMap, gO8 = new WeakMap, nf7 = function() {
        var A;
        let q = {
            mode: "cors",
            redirect: "follow",
            headers: {
                Accept: "text/event-stream",
                ...V9(this, ix6) ? {
                    "Last-Event-ID": V9(this, ix6)
                } : void 0
            },
            cache: "no-store",
            signal: (A = V9(this, aa)) == null ? void 0 : A.signal
        };
        return "window" in globalThis && (q.credentials = this.withCredentials ? "include" : "same-origin"), q
    }, FO8 = new WeakMap, pO8 = new WeakMap, cx6 = function(A, q) {
        var K;
        V9(this, Dv) !== this.CLOSED && A$(this, Dv, this.CLOSED);
        let Y = new xO8("error", {
            code: q,
            message: A
        });
        (K = V9(this, xD6)) == null || K.call(this, Y), this.dispatchEvent(Y)
    }, QO8 = function(A, q) {
        var K;
        if (V9(this, Dv) === this.CLOSED) return;
        A$(this, Dv, this.CONNECTING);
        let Y = new xO8("error", {
            code: q,
            message: A
        });
        (K = V9(this, xD6)) == null || K.call(this, Y), this.dispatchEvent(Y), A$(this, bD6, setTimeout(V9(this, UO8), V9(this, lx6)))
    }, UO8 = new WeakMap, uD6.CONNECTING = 0, uD6.OPEN = 1, uD6.CLOSED = 2
})
// @from(Ln 143236, Col 0)
function mD6(A) {
    if (!A) return {};
    if (A instanceof Headers) return Object.fromEntries(A.entries());
    if (Array.isArray(A)) return Object.fromEntries(A);
    return {
        ...A
    }
}
// @from(Ln 143245, Col 0)
function AK6(A = fetch, q) {
    if (!q) return A;
    return async (K, Y) => {
        let z = {
            ...q,
            ...Y,
            headers: Y?.headers ? {
                ...mD6(q.headers),
                ...mD6(Y.headers)
            } : q.headers
        };
        return A(K, z)
    }
}
// @from(Ln 143259, Col 0)
async function Bm3(A) {
    return (await cO8).getRandomValues(new Uint8Array(A))
}
// @from(Ln 143262, Col 0)
async function gm3(A) {
    let K = "",
        Y = await Bm3(A);
    for (let z = 0; z < A; z++) {
        let _ = Y[z] % 66;
        K += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~" [_]
    }
    return K
}
// @from(Ln 143271, Col 0)
async function Fm3(A) {
    return await gm3(A)
}
// @from(Ln 143274, Col 0)
async function pm3(A) {
    let q = await (await cO8).subtle.digest("SHA-256", new TextEncoder().encode(A));
    return btoa(String.fromCharCode(...new Uint8Array(q))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
}
// @from(Ln 143278, Col 0)
async function lO8(A) {
    if (!A) A = 43;
    if (A < 43 || A > 128) throw `Expected a length between 43 and 128. Received ${A}.`;
    let q = await Fm3(A),
        K = await pm3(q);
    return {
        code_verifier: q,
        code_challenge: K
    }
}
// @from(Ln 143288, Col 4)
cO8
// @from(Ln 143289, Col 4)
af7 = E(() => {
    cO8 = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((A) => A.webcrypto)
})
// @from(Ln 143292, Col 4)
mP
// @from(Ln 143292, Col 8)
tf7
// @from(Ln 143292, Col 13)
nx6
// @from(Ln 143292, Col 18)
Qm3
// @from(Ln 143292, Col 23)
ef7
// @from(Ln 143292, Col 28)
Hw1
// @from(Ln 143292, Col 33)
rx6
// @from(Ln 143292, Col 38)
sf7
// @from(Ln 143292, Col 43)
Um3
// @from(Ln 143292, Col 48)
dm3
// @from(Ln 143292, Col 53)
AT7
// @from(Ln 143292, Col 58)
Gt_
// @from(Ln 143292, Col 63)
ft_
// @from(Ln 143293, Col 4)
jw1 = E(() => {
    K7();
    mP = fp1().superRefine((A, q) => {
        if (!URL.canParse(A)) return q.addIssue({
            code: lp1.custom,
            message: "URL must be parseable",
            fatal: !0
        }), _E6
    }).refine((A) => {
        let q = new URL(A);
        return q.protocol !== "javascript:" && q.protocol !== "data:" && q.protocol !== "vbscript:"
    }, {
        message: "URL cannot use javascript:, data:, or vbscript: scheme"
    }), tf7 = WJ({
        resource: x1().url(),
        authorization_servers: h7(mP).optional(),
        jwks_uri: x1().url().optional(),
        scopes_supported: h7(x1()).optional(),
        bearer_methods_supported: h7(x1()).optional(),
        resource_signing_alg_values_supported: h7(x1()).optional(),
        resource_name: x1().optional(),
        resource_documentation: x1().optional(),
        resource_policy_uri: x1().url().optional(),
        resource_tos_uri: x1().url().optional(),
        tls_client_certificate_bound_access_tokens: y_().optional(),
        authorization_details_types_supported: h7(x1()).optional(),
        dpop_signing_alg_values_supported: h7(x1()).optional(),
        dpop_bound_access_tokens_required: y_().optional()
    }), nx6 = WJ({
        issuer: x1(),
        authorization_endpoint: mP,
        token_endpoint: mP,
        registration_endpoint: mP.optional(),
        scopes_supported: h7(x1()).optional(),
        response_types_supported: h7(x1()),
        response_modes_supported: h7(x1()).optional(),
        grant_types_supported: h7(x1()).optional(),
        token_endpoint_auth_methods_supported: h7(x1()).optional(),
        token_endpoint_auth_signing_alg_values_supported: h7(x1()).optional(),
        service_documentation: mP.optional(),
        revocation_endpoint: mP.optional(),
        revocation_endpoint_auth_methods_supported: h7(x1()).optional(),
        revocation_endpoint_auth_signing_alg_values_supported: h7(x1()).optional(),
        introspection_endpoint: x1().optional(),
        introspection_endpoint_auth_methods_supported: h7(x1()).optional(),
        introspection_endpoint_auth_signing_alg_values_supported: h7(x1()).optional(),
        code_challenge_methods_supported: h7(x1()).optional(),
        client_id_metadata_document_supported: y_().optional()
    }), Qm3 = WJ({
        issuer: x1(),
        authorization_endpoint: mP,
        token_endpoint: mP,
        userinfo_endpoint: mP.optional(),
        jwks_uri: mP,
        registration_endpoint: mP.optional(),
        scopes_supported: h7(x1()).optional(),
        response_types_supported: h7(x1()),
        response_modes_supported: h7(x1()).optional(),
        grant_types_supported: h7(x1()).optional(),
        acr_values_supported: h7(x1()).optional(),
        subject_types_supported: h7(x1()),
        id_token_signing_alg_values_supported: h7(x1()),
        id_token_encryption_alg_values_supported: h7(x1()).optional(),
        id_token_encryption_enc_values_supported: h7(x1()).optional(),
        userinfo_signing_alg_values_supported: h7(x1()).optional(),
        userinfo_encryption_alg_values_supported: h7(x1()).optional(),
        userinfo_encryption_enc_values_supported: h7(x1()).optional(),
        request_object_signing_alg_values_supported: h7(x1()).optional(),
        request_object_encryption_alg_values_supported: h7(x1()).optional(),
        request_object_encryption_enc_values_supported: h7(x1()).optional(),
        token_endpoint_auth_methods_supported: h7(x1()).optional(),
        token_endpoint_auth_signing_alg_values_supported: h7(x1()).optional(),
        display_values_supported: h7(x1()).optional(),
        claim_types_supported: h7(x1()).optional(),
        claims_supported: h7(x1()).optional(),
        service_documentation: x1().optional(),
        claims_locales_supported: h7(x1()).optional(),
        ui_locales_supported: h7(x1()).optional(),
        claims_parameter_supported: y_().optional(),
        request_parameter_supported: y_().optional(),
        request_uri_parameter_supported: y_().optional(),
        require_request_uri_registration: y_().optional(),
        op_policy_uri: mP.optional(),
        op_tos_uri: mP.optional(),
        client_id_metadata_document_supported: y_().optional()
    }), ef7 = p7({
        ...Qm3.shape,
        ...nx6.pick({
            code_challenge_methods_supported: !0
        }).shape
    }), Hw1 = p7({
        access_token: x1(),
        id_token: x1().optional(),
        token_type: x1(),
        expires_in: nE6.number().optional(),
        scope: x1().optional(),
        refresh_token: x1().optional()
    }).strip(), rx6 = p7({
        error: x1(),
        error_description: x1().optional(),
        error_uri: x1().optional()
    }), sf7 = mP.optional().or(e4("").transform(() => {
        return
    })), Um3 = p7({
        redirect_uris: h7(mP),
        token_endpoint_auth_method: x1().optional(),
        grant_types: h7(x1()).optional(),
        response_types: h7(x1()).optional(),
        client_name: x1().optional(),
        client_uri: mP.optional(),
        logo_uri: sf7,
        scope: x1().optional(),
        contacts: h7(x1()).optional(),
        tos_uri: sf7,
        policy_uri: x1().optional(),
        jwks_uri: mP.optional(),
        jwks: mp1().optional(),
        software_id: x1().optional(),
        software_version: x1().optional(),
        software_statement: x1().optional()
    }).strip(), dm3 = p7({
        client_id: x1(),
        client_secret: x1().optional(),
        client_id_issued_at: NY().optional(),
        client_secret_expires_at: NY().optional()
    }).strip(), AT7 = Um3.merge(dm3), Gt_ = p7({
        error: x1(),
        error_description: x1().optional()
    }).strip(), ft_ = p7({
        token: x1(),
        token_type_hint: x1().optional()
    }).strip()
})
// @from(Ln 143427, Col 0)
function qT7(A) {
    let q = typeof A === "string" ? new URL(A) : new URL(A.href);
    return q.hash = "", q
}
// @from(Ln 143432, Col 0)
function KT7({
    requestedResource: A,
    configuredResource: q
}) {
    let K = typeof A === "string" ? new URL(A) : new URL(A.href),
        Y = typeof q === "string" ? new URL(q) : new URL(q.href);
    if (K.origin !== Y.origin) return !1;
    if (K.pathname.length < Y.pathname.length) return !1;
    let z = K.pathname.endsWith("/") ? K.pathname : K.pathname + "/",
        _ = Y.pathname.endsWith("/") ? Y.pathname : Y.pathname + "/";
    return z.startsWith(_)
}
// @from(Ln 143444, Col 4)
uJ
// @from(Ln 143444, Col 8)
Jw1
// @from(Ln 143444, Col 13)
BD6
// @from(Ln 143444, Col 18)
sa
// @from(Ln 143444, Col 22)
gD6
// @from(Ln 143444, Col 27)
Mw1
// @from(Ln 143444, Col 32)
Dw1
// @from(Ln 143444, Col 37)
Xw1
// @from(Ln 143444, Col 42)
Dm
// @from(Ln 143444, Col 46)
FD6
// @from(Ln 143444, Col 51)
Pw1
// @from(Ln 143444, Col 56)
Ww1
// @from(Ln 143444, Col 61)
Zw1
// @from(Ln 143444, Col 66)
Gw1
// @from(Ln 143444, Col 71)
pD6
// @from(Ln 143444, Col 76)
QD6
// @from(Ln 143444, Col 81)
fw1
// @from(Ln 143444, Col 86)
Tw1
// @from(Ln 143444, Col 91)
YT7
// @from(Ln 143445, Col 4)
iO8 = E(() => {
    uJ = class uJ extends Error {
        constructor(A, q) {
            super(A);
            this.errorUri = q, this.name = this.constructor.name
        }
        toResponseObject() {
            let A = {
                error: this.errorCode,
                error_description: this.message
            };
            if (this.errorUri) A.error_uri = this.errorUri;
            return A
        }
        get errorCode() {
            return this.constructor.errorCode
        }
    };
    Jw1 = class Jw1 extends uJ {};
    Jw1.errorCode = "invalid_request";
    BD6 = class BD6 extends uJ {};
    BD6.errorCode = "invalid_client";
    sa = class sa extends uJ {};
    sa.errorCode = "invalid_grant";
    gD6 = class gD6 extends uJ {};
    gD6.errorCode = "unauthorized_client";
    Mw1 = class Mw1 extends uJ {};
    Mw1.errorCode = "unsupported_grant_type";
    Dw1 = class Dw1 extends uJ {};
    Dw1.errorCode = "invalid_scope";
    Xw1 = class Xw1 extends uJ {};
    Xw1.errorCode = "access_denied";
    Dm = class Dm extends uJ {};
    Dm.errorCode = "server_error";
    FD6 = class FD6 extends uJ {};
    FD6.errorCode = "temporarily_unavailable";
    Pw1 = class Pw1 extends uJ {};
    Pw1.errorCode = "unsupported_response_type";
    Ww1 = class Ww1 extends uJ {};
    Ww1.errorCode = "unsupported_token_type";
    Zw1 = class Zw1 extends uJ {};
    Zw1.errorCode = "invalid_token";
    Gw1 = class Gw1 extends uJ {};
    Gw1.errorCode = "method_not_allowed";
    pD6 = class pD6 extends uJ {};
    pD6.errorCode = "too_many_requests";
    QD6 = class QD6 extends uJ {};
    QD6.errorCode = "invalid_client_metadata";
    fw1 = class fw1 extends uJ {};
    fw1.errorCode = "insufficient_scope";
    Tw1 = class Tw1 extends uJ {};
    Tw1.errorCode = "invalid_target";
    YT7 = {
        [Jw1.errorCode]: Jw1,
        [BD6.errorCode]: BD6,
        [sa.errorCode]: sa,
        [gD6.errorCode]: gD6,
        [Mw1.errorCode]: Mw1,
        [Dw1.errorCode]: Dw1,
        [Xw1.errorCode]: Xw1,
        [Dm.errorCode]: Dm,
        [FD6.errorCode]: FD6,
        [Pw1.errorCode]: Pw1,
        [Ww1.errorCode]: Ww1,
        [Zw1.errorCode]: Zw1,
        [Gw1.errorCode]: Gw1,
        [pD6.errorCode]: pD6,
        [QD6.errorCode]: QD6,
        [fw1.errorCode]: fw1,
        [Tw1.errorCode]: Tw1
    }
})
// @from(Ln 143518, Col 0)
function cm3(A) {
    return ["client_secret_basic", "client_secret_post", "none"].includes(A)
}
// @from(Ln 143522, Col 0)
function lm3(A, q) {
    let K = A.client_secret !== void 0;
    if (q.length === 0) return K ? "client_secret_post" : "none";
    if ("token_endpoint_auth_method" in A && A.token_endpoint_auth_method && cm3(A.token_endpoint_auth_method) && q.includes(A.token_endpoint_auth_method)) return A.token_endpoint_auth_method;
    if (K && q.includes("client_secret_basic")) return "client_secret_basic";
    if (K && q.includes("client_secret_post")) return "client_secret_post";
    if (q.includes("none")) return "none";
    return K ? "client_secret_post" : "none"
}
// @from(Ln 143532, Col 0)
function im3(A, q, K, Y) {
    let {
        client_id: z,
        client_secret: _
    } = q;
    switch (A) {
        case "client_secret_basic":
            nm3(z, _, K);
            return;
        case "client_secret_post":
            rm3(z, _, Y);
            return;
        case "none":
            om3(z, Y);
            return;
        default:
            throw Error(`Unsupported client authentication method: ${A}`)
    }
}
// @from(Ln 143552, Col 0)
function nm3(A, q, K) {
    if (!q) throw Error("client_secret_basic authentication requires a client_secret");
    let Y = btoa(`${A}:${q}`);
    K.set("Authorization", `Basic ${Y}`)
}
// @from(Ln 143558, Col 0)
function rm3(A, q, K) {
    if (K.set("client_id", A), q) K.set("client_secret", q)
}
// @from(Ln 143562, Col 0)
function om3(A, q) {
    q.set("client_id", A)
}
// @from(Ln 143565, Col 0)
async function _T7(A) {
    let q = A instanceof Response ? A.status : void 0,
        K = A instanceof Response ? await A.text() : A;
    try {
        let Y = rx6.parse(JSON.parse(K)),
            {
                error: z,
                error_description: _,
                error_uri: w
            } = Y;
        return new(YT7[z] || Dm)(_ || "", w)
    } catch (Y) {
        let z = `${q?`HTTP ${q}: `:""}Invalid OAuth error response: ${Y}. Raw body: ${K}`;
        return new Dm(z)
    }
}
// @from(Ln 143581, Col 0)
async function CL(A, q) {
    try {
        return await oO8(A, q)
    } catch (K) {
        if (K instanceof BD6 || K instanceof gD6) return await A.invalidateCredentials?.("all"), await oO8(A, q);
        else if (K instanceof sa) return await A.invalidateCredentials?.("tokens"), await oO8(A, q);
        throw K
    }
}
// @from(Ln 143590, Col 0)
async function oO8(A, {
    serverUrl: q,
    authorizationCode: K,
    scope: Y,
    resourceMetadataUrl: z,
    fetchFn: _
}) {
    let w = await A.discoveryState?.(),
        O, $, H, j = z;
    if (!j && w?.resourceMetadataUrl) j = new URL(w.resourceMetadataUrl);
    if (w?.authorizationServerUrl) {
        if ($ = w.authorizationServerUrl, O = w.resourceMetadata, H = w.authorizationServerMetadata ?? await ox6($, {
                fetchFn: _
            }), !O) try {
            O = await wT7(q, {
                resourceMetadataUrl: j
            }, _)
        } catch {}
        if (H !== w.authorizationServerMetadata || O !== w.resourceMetadata) await A.saveDiscoveryState?.({
            authorizationServerUrl: String($),
            resourceMetadataUrl: j?.toString(),
            resourceMetadata: O,
            authorizationServerMetadata: H
        })
    } else {
        let G = await KB3(q, {
            resourceMetadataUrl: j,
            fetchFn: _
        });
        $ = G.authorizationServerUrl, H = G.authorizationServerMetadata, O = G.resourceMetadata, await A.saveDiscoveryState?.({
            authorizationServerUrl: String($),
            resourceMetadataUrl: j?.toString(),
            resourceMetadata: O,
            authorizationServerMetadata: H
        })
    }
    let J = await sm3(q, A, O),
        M = await Promise.resolve(A.clientInformation());
    if (!M) {
        if (K !== void 0) throw Error("Existing OAuth client information is required when exchanging an authorization code");
        let G = H?.client_id_metadata_document_supported === !0,
            f = A.clientMetadataUrl;
        if (f && !am3(f)) throw new QD6(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${f}`);
        if (G && f) M = {
            client_id: f
        }, await A.saveClientInformation?.(M);
        else {
            if (!A.saveClientInformation) throw Error("OAuth client information must be saveable for dynamic registration");
            let N = await wB3($, {
                metadata: H,
                clientMetadata: A.clientMetadata,
                fetchFn: _
            });
            await A.saveClientInformation(N), M = N
        }
    }
    let D = !A.redirectUrl;
    if (K !== void 0 || D) {
        let G = await _B3(A, $, {
            metadata: H,
            resource: J,
            authorizationCode: K,
            fetchFn: _
        });
        return await A.saveTokens(G), "AUTHORIZED"
    }
    let X = await A.tokens();
    if (X?.refresh_token) try {
        let G = await tO8($, {
            metadata: H,
            clientInformation: M,
            refreshToken: X.refresh_token,
            resource: J,
            addClientAuthentication: A.addClientAuthentication,
            fetchFn: _
        });
        return await A.saveTokens(G), "AUTHORIZED"
    } catch (G) {
        if (!(G instanceof uJ) || G instanceof Dm);
        else throw G
    }
    let P = A.state ? await A.state() : void 0,
        {
            authorizationUrl: W,
            codeVerifier: Z
        } = await YB3($, {
            metadata: H,
            clientInformation: M,
            state: P,
            redirectUrl: A.redirectUrl,
            scope: Y || O?.scopes_supported?.join(" ") || A.clientMetadata.scope,
            resource: J
        });
    return await A.saveCodeVerifier(Z), await A.redirectToAuthorization(W), "REDIRECT"
}
// @from(Ln 143686, Col 0)
function am3(A) {
    if (!A) return !1;
    try {
        let q = new URL(A);
        return q.protocol === "https:" && q.pathname !== "/"
    } catch {
        return !1
    }
}
// @from(Ln 143695, Col 0)
async function sm3(A, q, K) {
    let Y = qT7(A);
    if (q.validateResourceURL) return await q.validateResourceURL(Y, K?.resource);
    if (!K) return;
    if (!KT7({
            requestedResource: Y,
            configuredResource: K.resource
        })) throw Error(`Protected resource ${K.resource} does not match expected ${Y} (or origin)`);
    return new URL(K.resource)
}
// @from(Ln 143706, Col 0)
function UD6(A) {
    let q = A.headers.get("WWW-Authenticate");
    if (!q) return {};
    let [K, Y] = q.split(" ");
    if (K.toLowerCase() !== "bearer" || !Y) return {};
    let z = aO8(A, "resource_metadata") || void 0,
        _;
    if (z) try {
        _ = new URL(z)
    } catch {}
    let w = aO8(A, "scope") || void 0,
        O = aO8(A, "error") || void 0;
    return {
        resourceMetadataUrl: _,
        scope: w,
        error: O
    }
}
// @from(Ln 143725, Col 0)
function aO8(A, q) {
    let K = A.headers.get("WWW-Authenticate");
    if (!K) return null;
    let Y = new RegExp(`${q}=(?:"([^"]+)"|([^\\s,]+))`),
        z = K.match(Y);
    if (z) return z[1] || z[2];
    return null
}
// @from(Ln 143733, Col 0)
async function wT7(A, q, K = fetch) {
    let Y = await AB3(A, "oauth-protected-resource", K, {
        protocolVersion: q?.protocolVersion,
        metadataUrl: q?.resourceMetadataUrl
    });
    if (!Y || Y.status === 404) throw await Y?.body?.cancel(), Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
    if (!Y.ok) throw await Y.body?.cancel(), Error(`HTTP ${Y.status} trying to load well-known OAuth protected resource metadata.`);
    return tf7.parse(await Y.json())
}
// @from(Ln 143742, Col 0)
async function sO8(A, q, K = fetch) {
    try {
        return await K(A, {
            headers: q
        })
    } catch (Y) {
        if (Y instanceof TypeError)
            if (q) return sO8(A, void 0, K);
            else return;
        throw Y
    }
}
// @from(Ln 143755, Col 0)
function tm3(A, q = "", K = {}) {
    if (q.endsWith("/")) q = q.slice(0, -1);
    return K.prependPathname ? `${q}/.well-known/${A}` : `/.well-known/${A}${q}`
}
// @from(Ln 143759, Col 0)
async function zT7(A, q, K = fetch) {
    return await sO8(A, {
        "MCP-Protocol-Version": q
    }, K)
}
// @from(Ln 143765, Col 0)
function em3(A, q) {
    return !A || A.status >= 400 && A.status < 500 && q !== "/"
}
// @from(Ln 143768, Col 0)
async function AB3(A, q, K, Y) {
    let z = new URL(A),
        _ = Y?.protocolVersion ?? hn,
        w;
    if (Y?.metadataUrl) w = new URL(Y.metadataUrl);
    else {
        let $ = tm3(q, z.pathname);
        w = new URL($, Y?.metadataServerUrl ?? z), w.search = z.search
    }
    let O = await zT7(w, _, K);
    if (!Y?.metadataUrl && em3(O, z.pathname)) {
        let $ = new URL(`/.well-known/${q}`, z);
        O = await zT7($, _, K)
    }
    return O
}
// @from(Ln 143785, Col 0)
function qB3(A) {
    let q = typeof A === "string" ? new URL(A) : A,
        K = q.pathname !== "/",
        Y = [];
    if (!K) return Y.push({
        url: new URL("/.well-known/oauth-authorization-server", q.origin),
        type: "oauth"
    }), Y.push({
        url: new URL("/.well-known/openid-configuration", q.origin),
        type: "oidc"
    }), Y;
    let z = q.pathname;
    if (z.endsWith("/")) z = z.slice(0, -1);
    return Y.push({
        url: new URL(`/.well-known/oauth-authorization-server${z}`, q.origin),
        type: "oauth"
    }), Y.push({
        url: new URL(`/.well-known/openid-configuration${z}`, q.origin),
        type: "oidc"
    }), Y.push({
        url: new URL(`${z}/.well-known/openid-configuration`, q.origin),
        type: "oidc"
    }), Y
}
// @from(Ln 143809, Col 0)
async function ox6(A, {
    fetchFn: q = fetch,
    protocolVersion: K = hn
} = {}) {
    let Y = {
            "MCP-Protocol-Version": K,
            Accept: "application/json"
        },
        z = qB3(A);
    for (let {
            url: _,
            type: w
        }
        of z) {
        let O = await sO8(_, Y, q);
        if (!O) continue;
        if (!O.ok) {
            if (await O.body?.cancel(), O.status >= 400 && O.status < 500) continue;
            throw Error(`HTTP ${O.status} trying to load ${w==="oauth"?"OAuth":"OpenID provider"} metadata from ${_}`)
        }
        if (w === "oauth") return nx6.parse(await O.json());
        else return ef7.parse(await O.json())
    }
    return
}
// @from(Ln 143834, Col 0)
async function KB3(A, q) {
    let K, Y;
    try {
        if (K = await wT7(A, {
                resourceMetadataUrl: q?.resourceMetadataUrl
            }, q?.fetchFn), K.authorization_servers && K.authorization_servers.length > 0) Y = K.authorization_servers[0]
    } catch {}
    if (!Y) Y = String(new URL("/", A));
    let z = await ox6(Y, {
        fetchFn: q?.fetchFn
    });
    return {
        authorizationServerUrl: Y,
        authorizationServerMetadata: z,
        resourceMetadata: K
    }
}
// @from(Ln 143851, Col 0)
async function YB3(A, {
    metadata: q,
    clientInformation: K,
    redirectUrl: Y,
    scope: z,
    state: _,
    resource: w
}) {
    let O;
    if (q) {
        if (O = new URL(q.authorization_endpoint), !q.response_types_supported.includes(nO8)) throw Error(`Incompatible auth server: does not support response type ${nO8}`);
        if (q.code_challenge_methods_supported && !q.code_challenge_methods_supported.includes(rO8)) throw Error(`Incompatible auth server: does not support code challenge method ${rO8}`)
    } else O = new URL("/authorize", A);
    let $ = await lO8(),
        H = $.code_verifier,
        j = $.code_challenge;
    if (O.searchParams.set("response_type", nO8), O.searchParams.set("client_id", K.client_id), O.searchParams.set("code_challenge", j), O.searchParams.set("code_challenge_method", rO8), O.searchParams.set("redirect_uri", String(Y)), _) O.searchParams.set("state", _);
    if (z) O.searchParams.set("scope", z);
    if (z?.includes("offline_access")) O.searchParams.append("prompt", "consent");
    if (w) O.searchParams.set("resource", w.href);
    return {
        authorizationUrl: O,
        codeVerifier: H
    }
}
// @from(Ln 143877, Col 0)
function zB3(A, q, K) {
    return new URLSearchParams({
        grant_type: "authorization_code",
        code: A,
        code_verifier: q,
        redirect_uri: String(K)
    })
}
// @from(Ln 143885, Col 0)
async function OT7(A, {
    metadata: q,
    tokenRequestParams: K,
    clientInformation: Y,
    addClientAuthentication: z,
    resource: _,
    fetchFn: w
}) {
    let O = q?.token_endpoint ? new URL(q.token_endpoint) : new URL("/token", A),
        $ = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
        });
    if (_) K.set("resource", _.href);
    if (z) await z($, K, O, q);
    else if (Y) {
        let j = q?.token_endpoint_auth_methods_supported ?? [],
            J = lm3(Y, j);
        im3(J, Y, $, K)
    }
    let H = await (w ?? fetch)(O, {
        method: "POST",
        headers: $,
        body: K
    });
    if (!H.ok) throw await _T7(H);
    return Hw1.parse(await H.json())
}
// @from(Ln 143913, Col 0)
async function tO8(A, {
    metadata: q,
    clientInformation: K,
    refreshToken: Y,
    resource: z,
    addClientAuthentication: _,
    fetchFn: w
}) {
    let O = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: Y
        }),
        $ = await OT7(A, {
            metadata: q,
            tokenRequestParams: O,
            clientInformation: K,
            addClientAuthentication: _,
            resource: z,
            fetchFn: w
        });
    return {
        refresh_token: Y,
        ...$
    }
}
// @from(Ln 143938, Col 0)
async function _B3(A, q, {
    metadata: K,
    resource: Y,
    authorizationCode: z,
    fetchFn: _
} = {}) {
    let w = A.clientMetadata.scope,
        O;
    if (A.prepareTokenRequest) O = await A.prepareTokenRequest(w);
    if (!O) {
        if (!z) throw Error("Either provider.prepareTokenRequest() or authorizationCode is required");
        if (!A.redirectUrl) throw Error("redirectUrl is required for authorization_code flow");
        let H = await A.codeVerifier();
        O = zB3(z, H, A.redirectUrl)
    }
    let $ = await A.clientInformation();
    return OT7(q, {
        metadata: K,
        tokenRequestParams: O,
        clientInformation: $ ?? void 0,
        addClientAuthentication: A.addClientAuthentication,
        resource: Y,
        fetchFn: _
    })
}
// @from(Ln 143963, Col 0)
async function wB3(A, {
    metadata: q,
    clientMetadata: K,
    fetchFn: Y
}) {
    let z;
    if (q) {
        if (!q.registration_endpoint) throw Error("Incompatible auth server: does not support dynamic client registration");
        z = new URL(q.registration_endpoint)
    } else z = new URL("/register", A);
    let _ = await (Y ?? fetch)(z, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(K)
    });
    if (!_.ok) throw await _T7(_);
    return AT7.parse(await _.json())
}
// @from(Ln 143983, Col 4)
zX
// @from(Ln 143983, Col 8)
nO8 = "code"
// @from(Ln 143984, Col 4)
rO8 = "S256"
// @from(Ln 143985, Col 4)
ax6 = E(() => {
    af7();
    hD();
    jw1();
    jw1();
    iO8();
    zX = class zX extends Error {
        constructor(A) {
            super(A ?? "Unauthorized")
        }
    }
})
// @from(Ln 143997, Col 0)
class vw1 {
    constructor(A, q) {
        this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._eventSourceInit = q?.eventSourceInit, this._requestInit = q?.requestInit, this._authProvider = q?.authProvider, this._fetch = q?.fetch, this._fetchWithInit = AK6(q?.fetch, q?.requestInit)
    }
    async _authThenStart() {
        if (!this._authProvider) throw new zX("No auth provider");
        let A;
        try {
            A = await CL(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (q) {
            throw this.onerror?.(q), q
        }
        if (A !== "AUTHORIZED") throw new zX;
        return await this._startOrAuth()
    }
    async _commonHeaders() {
        let A = {};
        if (this._authProvider) {
            let K = await this._authProvider.tokens();
            if (K) A.Authorization = `Bearer ${K.access_token}`
        }
        if (this._protocolVersion) A["mcp-protocol-version"] = this._protocolVersion;
        let q = mD6(this._requestInit?.headers);
        return new Headers({
            ...A,
            ...q
        })
    }
    _startOrAuth() {
        let A = this?._eventSourceInit?.fetch ?? this._fetch ?? fetch;
        return new Promise((q, K) => {
            this._eventSource = new uD6(this._url.href, {
                ...this._eventSourceInit,
                fetch: async (Y, z) => {
                    let _ = await this._commonHeaders();
                    _.set("Accept", "text/event-stream");
                    let w = await A(Y, {
                        ...z,
                        headers: _
                    });
                    if (w.status === 401 && w.headers.has("www-authenticate")) {
                        let {
                            resourceMetadataUrl: O,
                            scope: $
                        } = UD6(w);
                        this._resourceMetadataUrl = O, this._scope = $
                    }
                    return w
                }
            }), this._abortController = new AbortController, this._eventSource.onerror = (Y) => {
                if (Y.code === 401 && this._authProvider) {
                    this._authThenStart().then(q, K);
                    return
                }
                let z = new $T7(Y.code, Y.message, Y);
                K(z), this.onerror?.(z)
            }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (Y) => {
                let z = Y;
                try {
                    if (this._endpoint = new URL(z.data, this._url), this._endpoint.origin !== this._url.origin) throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)
                } catch (_) {
                    K(_), this.onerror?.(_), this.close();
                    return
                }
                q()
            }), this._eventSource.onmessage = (Y) => {
                let z = Y,
                    _;
                try {
                    _ = PS.parse(JSON.parse(z.data))
                } catch (w) {
                    this.onerror?.(w);
                    return
                }
                this.onmessage?.(_)
            }
        })
    }
    async start() {
        if (this._eventSource) throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return await this._startOrAuth()
    }
    async finishAuth(A) {
        if (!this._authProvider) throw new zX("No auth provider");
        if (await CL(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: A,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new zX("Failed to authorize")
    }
    async close() {
        this._abortController?.abort(), this._eventSource?.close(), this.onclose?.()
    }
    async send(A) {
        if (!this._endpoint) throw Error("Not connected");
        try {
            let q = await this._commonHeaders();
            q.set("content-type", "application/json");
            let K = {
                    ...this._requestInit,
                    method: "POST",
                    headers: q,
                    body: JSON.stringify(A),
                    signal: this._abortController?.signal
                },
                Y = await (this._fetch ?? fetch)(this._endpoint, K);
            if (!Y.ok) {
                let z = await Y.text().catch(() => null);
                if (Y.status === 401 && this._authProvider) {
                    let {
                        resourceMetadataUrl: _,
                        scope: w
                    } = UD6(Y);
                    if (this._resourceMetadataUrl = _, this._scope = w, await CL(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new zX;
                    return this.send(A)
                }
                throw Error(`Error POSTing to endpoint (HTTP ${Y.status}): ${z}`)
            }
            await Y.body?.cancel()
        } catch (q) {
            throw this.onerror?.(q), q
        }
    }
    setProtocolVersion(A) {
        this._protocolVersion = A
    }
}
// @from(Ln 144136, Col 4)
$T7
// @from(Ln 144137, Col 4)
HT7 = E(() => {
    of7();
    hD();
    ax6();
    $T7 = class $T7 extends Error {
        constructor(A, q, K) {
            super(`SSE error: ${q}`);
            this.code = A, this.event = K
        }
    }
})
// @from(Ln 144148, Col 4)
eO8
// @from(Ln 144149, Col 4)
jT7 = E(() => {
    bO8();
    eO8 = class eO8 extends TransformStream {
        constructor({
            onError: A,
            onRetry: q,
            onComment: K
        } = {}) {
            let Y;
            super({
                start(z) {
                    Y = ww1({
                        onEvent: (_) => {
                            z.enqueue(_)
                        },
                        onError(_) {
                            A === "terminate" ? z.error(_) : typeof A == "function" && A(_)
                        },
                        onRetry: q,
                        onComment: K
                    })
                },
                transform(z) {
                    Y.feed(z)
                }
            })
        }
    }
})
// @from(Ln 144178, Col 0)
class Nw1 {
    constructor(A, q) {
        this._hasCompletedAuthFlow = !1, this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._requestInit = q?.requestInit, this._authProvider = q?.authProvider, this._fetch = q?.fetch, this._fetchWithInit = AK6(q?.fetch, q?.requestInit), this._sessionId = q?.sessionId, this._reconnectionOptions = q?.reconnectionOptions ?? OB3
    }
    async _authThenStart() {
        if (!this._authProvider) throw new zX("No auth provider");
        let A;
        try {
            A = await CL(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (q) {
            throw this.onerror?.(q), q
        }
        if (A !== "AUTHORIZED") throw new zX;
        return await this._startOrAuthSse({
            resumptionToken: void 0
        })
    }
    async _commonHeaders() {
        let A = {};
        if (this._authProvider) {
            let K = await this._authProvider.tokens();
            if (K) A.Authorization = `Bearer ${K.access_token}`
        }
        if (this._sessionId) A["mcp-session-id"] = this._sessionId;
        if (this._protocolVersion) A["mcp-protocol-version"] = this._protocolVersion;
        let q = mD6(this._requestInit?.headers);
        return new Headers({
            ...A,
            ...q
        })
    }
    async _startOrAuthSse(A) {
        let {
            resumptionToken: q
        } = A;
        try {
            let K = await this._commonHeaders();
            if (K.set("Accept", "text/event-stream"), q) K.set("last-event-id", q);
            let Y = await (this._fetch ?? fetch)(this._url, {
                method: "GET",
                headers: K,
                signal: this._abortController?.signal
            });
            if (!Y.ok) {
                if (await Y.body?.cancel(), Y.status === 401 && this._authProvider) return await this._authThenStart();
                if (Y.status === 405) return;
                throw new qK6(Y.status, `Failed to open SSE stream: ${Y.statusText}`)
            }
            this._handleSseStream(Y.body, A, !0)
        } catch (K) {
            throw this.onerror?.(K), K
        }
    }
    _getNextReconnectionDelay(A) {
        if (this._serverRetryMs !== void 0) return this._serverRetryMs;
        let q = this._reconnectionOptions.initialReconnectionDelay,
            K = this._reconnectionOptions.reconnectionDelayGrowFactor,
            Y = this._reconnectionOptions.maxReconnectionDelay;
        return Math.min(q * Math.pow(K, A), Y)
    }
    _scheduleReconnection(A, q = 0) {
        let K = this._reconnectionOptions.maxRetries;
        if (q >= K) {
            this.onerror?.(Error(`Maximum reconnection attempts (${K}) exceeded.`));
            return
        }
        let Y = this._getNextReconnectionDelay(q);
        this._reconnectionTimeout = setTimeout(() => {
            this._startOrAuthSse(A).catch((z) => {
                this.onerror?.(Error(`Failed to reconnect SSE stream: ${z instanceof Error?z.message:String(z)}`)), this._scheduleReconnection(A, q + 1)
            })
        }, Y)
    }
    _handleSseStream(A, q, K) {
        if (!A) return;
        let {
            onresumptiontoken: Y,
            replayMessageId: z
        } = q, _, w = !1, O = !1;
        (async () => {
            try {
                let H = A.pipeThrough(new TextDecoderStream).pipeThrough(new eO8({
                    onRetry: (M) => {
                        this._serverRetryMs = M
                    }
                })).getReader();
                while (!0) {
                    let {
                        value: M,
                        done: D
                    } = await H.read();
                    if (D) break;
                    if (M.id) _ = M.id, w = !0, Y?.(M.id);
                    if (!M.data) continue;
                    if (!M.event || M.event === "message") try {
                        let X = PS.parse(JSON.parse(M.data));
                        if (ZA6(X)) {
                            if (O = !0, z !== void 0) X.id = z
                        }
                        this.onmessage?.(X)
                    } catch (X) {
                        this.onerror?.(X)
                    }
                }
                if ((K || w) && !O && this._abortController && !this._abortController.signal.aborted) this._scheduleReconnection({
                    resumptionToken: _,
                    onresumptiontoken: Y,
                    replayMessageId: z
                }, 0)
            } catch (H) {
                if (this.onerror?.(Error(`SSE stream disconnected: ${H}`)), (K || w) && !O && this._abortController && !this._abortController.signal.aborted) try {
                    this._scheduleReconnection({
                        resumptionToken: _,
                        onresumptiontoken: Y,
                        replayMessageId: z
                    }, 0)
                } catch (M) {
                    this.onerror?.(Error(`Failed to reconnect: ${M instanceof Error?M.message:String(M)}`))
                }
            }
        })()
    }
    async start() {
        if (this._abortController) throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        this._abortController = new AbortController
    }
    async finishAuth(A) {
        if (!this._authProvider) throw new zX("No auth provider");
        if (await CL(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: A,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new zX("Failed to authorize")
    }
    async close() {
        if (this._reconnectionTimeout) clearTimeout(this._reconnectionTimeout), this._reconnectionTimeout = void 0;
        this._abortController?.abort(), this.onclose?.()
    }
    async send(A, q) {
        try {
            let {
                resumptionToken: K,
                onresumptiontoken: Y
            } = q || {};
            if (K) {
                this._startOrAuthSse({
                    resumptionToken: K,
                    replayMessageId: oE6(A) ? A.id : void 0
                }).catch((J) => this.onerror?.(J));
                return
            }
            let z = await this._commonHeaders();
            z.set("content-type", "application/json"), z.set("accept", "application/json, text/event-stream");
            let _ = {
                    ...this._requestInit,
                    method: "POST",
                    headers: z,
                    body: JSON.stringify(A),
                    signal: this._abortController?.signal
                },
                w = await (this._fetch ?? fetch)(this._url, _),
                O = w.headers.get("mcp-session-id");
            if (O) this._sessionId = O;
            if (!w.ok) {
                let J = await w.text().catch(() => null);
                if (w.status === 401 && this._authProvider) {
                    if (this._hasCompletedAuthFlow) throw new qK6(401, "Server returned 401 after successful authentication");
                    let {
                        resourceMetadataUrl: M,
                        scope: D
                    } = UD6(w);
                    if (this._resourceMetadataUrl = M, this._scope = D, await CL(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new zX;
                    return this._hasCompletedAuthFlow = !0, this.send(A)
                }
                if (w.status === 403 && this._authProvider) {
                    let {
                        resourceMetadataUrl: M,
                        scope: D,
                        error: X
                    } = UD6(w);
                    if (X === "insufficient_scope") {
                        let P = w.headers.get("WWW-Authenticate");
                        if (this._lastUpscopingHeader === P) throw new qK6(403, "Server returned 403 after trying upscoping");
                        if (D) this._scope = D;
                        if (M) this._resourceMetadataUrl = M;
                        if (this._lastUpscopingHeader = P ?? void 0, await CL(this._authProvider, {
                                serverUrl: this._url,
                                resourceMetadataUrl: this._resourceMetadataUrl,
                                scope: this._scope,
                                fetchFn: this._fetch
                            }) !== "AUTHORIZED") throw new zX;
                        return this.send(A)
                    }
                }
                throw new qK6(w.status, `Error POSTing to endpoint: ${J}`)
            }
            if (this._hasCompletedAuthFlow = !1, this._lastUpscopingHeader = void 0, w.status === 202) {
                if (await w.body?.cancel(), MqA(A)) this._startOrAuthSse({
                    resumptionToken: void 0
                }).catch((J) => this.onerror?.(J));
                return
            }
            let H = (Array.isArray(A) ? A : [A]).filter((J) => ("method" in J) && ("id" in J) && J.id !== void 0).length > 0,
                j = w.headers.get("content-type");
            if (H)
                if (j?.includes("text/event-stream")) this._handleSseStream(w.body, {
                    onresumptiontoken: Y
                }, !1);
                else if (j?.includes("application/json")) {
                let J = await w.json(),
                    M = Array.isArray(J) ? J.map((D) => PS.parse(D)) : [PS.parse(J)];
                for (let D of M) this.onmessage?.(D)
            } else throw await w.body?.cancel(), new qK6(-1, `Unexpected content type: ${j}`);
            else await w.body?.cancel()
        } catch (K) {
            throw this.onerror?.(K), K
        }
    }
    get sessionId() {
        return this._sessionId
    }
    async terminateSession() {
        if (!this._sessionId) return;
        try {
            let A = await this._commonHeaders(),
                q = {
                    ...this._requestInit,
                    method: "DELETE",
                    headers: A,
                    signal: this._abortController?.signal
                },
                K = await (this._fetch ?? fetch)(this._url, q);
            if (await K.body?.cancel(), !K.ok && K.status !== 405) throw new qK6(K.status, `Failed to terminate session: ${K.statusText}`);
            this._sessionId = void 0
        } catch (A) {
            throw this.onerror?.(A), A
        }
    }
    setProtocolVersion(A) {
        this._protocolVersion = A
    }
    get protocolVersion() {
        return this._protocolVersion
    }
    async resumeStream(A, q) {
        await this._startOrAuthSse({
            resumptionToken: A,
            onresumptiontoken: q?.onresumptiontoken
        })
    }
}
// @from(Ln 144441, Col 4)
OB3
// @from(Ln 144441, Col 9)
qK6
// @from(Ln 144442, Col 4)
JT7 = E(() => {
    hD();
    ax6();
    jT7();
    OB3 = {
        initialReconnectionDelay: 1000,
        maxReconnectionDelay: 30000,
        reconnectionDelayGrowFactor: 1.5,
        maxRetries: 2
    };
    qK6 = class qK6 extends Error {
        constructor(A, q) {
            super(`Streamable HTTP error: ${q}`);
            this.code = A
        }
    }
})
// @from(Ln 144460, Col 0)
function $B3(A, q, K) {
    var Y = -1,
        z = A.length,
        _ = q.length,
        w = {};
    while (++Y < z) {
        var O = Y < _ ? q[Y] : void 0;
        K(w, A[Y], O)
    }
    return w
}
// @from(Ln 144471, Col 4)
MT7
// @from(Ln 144472, Col 4)
DT7 = E(() => {
    MT7 = $B3
})
// @from(Ln 144476, Col 0)
function HB3(A, q) {
    return MT7(A || [], q || [], yn)
}
// @from(Ln 144479, Col 4)
XT7
// @from(Ln 144480, Col 4)
PT7 = E(() => {
    AE6();
    DT7();
    XT7 = HB3
})
// @from(Ln 144486, Col 0)
function KK6() {
    return w8("tengu_mcp_elicitation", !1)
}
// @from(Ln 144489, Col 4)
Vw1 = E(() => {
    HA()
})
// @from(Ln 144493, Col 0)
function jB3(A) {
    return A.mode === "url" ? "url" : "form"
}
// @from(Ln 144497, Col 0)
function JB3(A, q, K) {
    return A.findIndex((Y) => Y.serverName === q && Y.params.mode === "url" && ("elicitationId" in Y.params) && Y.params.elicitationId === K)
}