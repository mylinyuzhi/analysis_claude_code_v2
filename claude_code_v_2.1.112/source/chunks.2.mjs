
// @from(Ln 3879, Col 4)
M11 = L(() => {
    mi();
    m0();
    J11();
    GY6();
    jw8();
    m0();
    $V = class $V {
        constructor(q, K, _) {
            this.iterator = q, vp6.set(this, void 0), this.controller = K, N4(this, vp6, _, "f")
        }
        static fromSSEResponse(q, K, _) {
            let z = !1,
                Y = _ ? B0(_) : console;
            async function* A() {
                if (z) throw new bq("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                z = !0;
                let O = !1;
                try {
                    for await (let w of Yf5(q, K)) {
                        if (w.event === "completion") try {
                            yield JSON.parse(w.data)
                        } catch ($) {
                            throw Y.error("Could not parse message into JSON:", w.data), Y.error("From chunk:", w.raw), $
                        }
                        if (w.event === "message_start" || w.event === "message_delta" || w.event === "message_stop" || w.event === "content_block_start" || w.event === "content_block_delta" || w.event === "content_block_stop") try {
                            yield JSON.parse(w.data)
                        } catch ($) {
                            throw Y.error("Could not parse message into JSON:", w.data), Y.error("From chunk:", w.raw), $
                        }
                        if (w.event === "ping") continue;
                        if (w.event === "error") {
                            let $ = Aw8(w.data) ?? w.data,
                                j = $?.error?.type;
                            throw new vq(void 0, $, void 0, q.headers, j)
                        }
                    }
                    O = !0
                } catch (w) {
                    if (Bi(w)) return;
                    throw w
                } finally {
                    if (!O) K.abort()
                }
            }
            return new $V(A, K, _)
        }
        static fromReadableStream(q, K, _) {
            let z = !1;
            async function* Y() {
                let O = new C86,
                    w = Zp6(q);
                for await (let $ of w) for (let j of O.decode($)) yield j;
                for (let $ of O.flush()) yield $
            }
            async function* A() {
                if (z) throw new bq("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                z = !0;
                let O = !1;
                try {
                    for await (let w of Y()) {
                        if (O) continue;
                        if (w) yield JSON.parse(w)
                    }
                    O = !0
                } catch (w) {
                    if (Bi(w)) return;
                    throw w
                } finally {
                    if (!O) K.abort()
                }
            }
            return new $V(A, K, _)
        } [(vp6 = new WeakMap, Symbol.asyncIterator)]() {
            return this.iterator()
        }
        tee() {
            let q = [],
                K = [],
                _ = this.iterator(),
                z = (Y) => {
                    return {
                        next: () => {
                            if (Y.length === 0) {
                                let A = _.next();
                                q.push(A), K.push(A)
                            }
                            return Y.shift()
                        }
                    }
                };
            return [new $V(() => z(q), this.controller, U1(this, vp6, "f")), new $V(() => z(K), this.controller, U1(this, vp6, "f"))]
        }
        toReadableStream() {
            let q = this,
                K;
            return j11({
                async start() {
                    K = q[Symbol.asyncIterator]()
                },
                async pull(_) {
                    try {
                        let {
                            value: z,
                            done: Y
                        } = await K.next();
                        if (Y) return _.close();
                        let A = fp6(JSON.stringify(z) + `
`);
                        _.enqueue(A)
                    } catch (z) {
                        _.error(z)
                    }
                },
                async cancel() {
                    await K.return?.()
                }
            })
        }
    }
})
// @from(Ln 4000, Col 0)
async function Hw8(q, K) {
    let {
        response: _,
        requestLogID: z,
        retryOfRequestLogID: Y,
        startTime: A
    } = K, O = await (async () => {
        if (K.options.stream) {
            if (B0(q).debug("response", _.status, _.url, _.headers, _.body), K.options.__streamClass) return K.options.__streamClass.fromSSEResponse(_, K.controller);
            return $V.fromSSEResponse(_, K.controller)
        }
        if (_.status === 204) return null;
        if (K.options.__binaryResponse) return _;
        let $ = _.headers.get("content-type")?.split(";")[0]?.trim();
        if ($?.includes("application/json") || $?.endsWith("+json")) {
            if (_.headers.get("content-length") === "0") return;
            let X = await _.json();
            return P11(X, _)
        }
        return await _.text()
    })();
    return B0(q).debug(`[${z}] response parsed`, pi({
        retryOfRequestLogID: Y,
        url: _.url,
        status: _.status,
        body: O,
        durationMs: Date.now() - A
    })), O
}
// @from(Ln 4030, Col 0)
function P11(q, K) {
    if (!q || typeof q !== "object" || Array.isArray(q)) return q;
    return Object.defineProperty(q, "_request_id", {
        value: K.headers.get("request-id"),
        enumerable: !1
    })
}
// @from(Ln 4037, Col 4)
W11 = L(() => {
    M11();
    jw8()
})
// @from(Ln 4041, Col 4)
Tp6
// @from(Ln 4041, Col 9)
vY6
// @from(Ln 4042, Col 4)
Jw8 = L(() => {
    mi();
    W11();
    vY6 = class vY6 extends Promise {
        constructor(q, K, _ = Hw8) {
            super((z) => {
                z(null)
            });
            this.responsePromise = K, this.parseResponse = _, Tp6.set(this, void 0), N4(this, Tp6, q, "f")
        }
        _thenUnwrap(q) {
            return new vY6(U1(this, Tp6, "f"), this.responsePromise, async (K, _) => P11(q(await this.parseResponse(K, _), _), _.response))
        }
        asResponse() {
            return this.responsePromise.then((q) => q.response)
        }
        async withResponse() {
            let [q, K] = await Promise.all([this.parse(), this.asResponse()]);
            return {
                data: q,
                response: K,
                request_id: K.headers.get("request-id")
            }
        }
        parse() {
            if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((q) => this.parseResponse(U1(this, Tp6, "f"), q));
            return this.parsedPromise
        }
        then(q, K) {
            return this.parse().then(q, K)
        } catch (q) {
            return this.parse().catch(q)
        } finally(q) {
            return this.parse().finally(q)
        }
    };
    Tp6 = new WeakMap
})
// @from(Ln 4080, Col 4)
Xw8
// @from(Ln 4080, Col 9)
D11
// @from(Ln 4080, Col 14)
Mw8
// @from(Ln 4080, Col 19)
zm
// @from(Ln 4080, Col 23)
Vp6
// @from(Ln 4081, Col 4)
ig = L(() => {
    mi();
    m0();
    W11();
    Jw8();
    GY6();
    D11 = class D11 {
        constructor(q, K, _, z) {
            Xw8.set(this, void 0), N4(this, Xw8, q, "f"), this.options = z, this.response = K, this.body = _
        }
        hasNextPage() {
            if (!this.getPaginatedItems().length) return !1;
            return this.nextPageRequestOptions() != null
        }
        async getNextPage() {
            let q = this.nextPageRequestOptions();
            if (!q) throw new bq("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
            return await U1(this, Xw8, "f").requestAPIList(this.constructor, q)
        }
        async * iterPages() {
            let q = this;
            yield q;
            while (q.hasNextPage()) q = await q.getNextPage(), yield q
        }
        async * [(Xw8 = new WeakMap, Symbol.asyncIterator)]() {
            for await (let q of this.iterPages()) for (let K of q.getPaginatedItems()) yield K
        }
    };
    Mw8 = class Mw8 extends vY6 {
        constructor(q, K, _) {
            super(q, K, async (z, Y) => new _(z, Y.response, await Hw8(z, Y), Y.options))
        }
        async * [Symbol.asyncIterator]() {
            let q = await this;
            for await (let K of q) yield K
        }
    };
    zm = class zm extends D11 {
        constructor(q, K, _, z) {
            super(q, K, _, z);
            this.data = _.data || [], this.has_more = _.has_more || !1, this.first_id = _.first_id || null, this.last_id = _.last_id || null
        }
        getPaginatedItems() {
            return this.data ?? []
        }
        hasNextPage() {
            if (this.has_more === !1) return !1;
            return super.hasNextPage()
        }
        nextPageRequestOptions() {
            if (this.options.query?.before_id) {
                let K = this.first_id;
                if (!K) return null;
                return {
                    ...this.options,
                    query: {
                        ...Yw8(this.options.query),
                        before_id: K
                    }
                }
            }
            let q = this.last_id;
            if (!q) return null;
            return {
                ...this.options,
                query: {
                    ...Yw8(this.options.query),
                    after_id: q
                }
            }
        }
    };
    Vp6 = class Vp6 extends D11 {
        constructor(q, K, _, z) {
            super(q, K, _, z);
            this.data = _.data || [], this.has_more = _.has_more || !1, this.next_page = _.next_page || null
        }
        getPaginatedItems() {
            return this.data ?? []
        }
        hasNextPage() {
            if (this.has_more === !1) return !1;
            return super.hasNextPage()
        }
        nextPageRequestOptions() {
            let q = this.next_page;
            if (!q) return null;
            return {
                ...this.options,
                query: {
                    ...Yw8(this.options.query),
                    page: q
                }
            }
        }
    }
})
// @from(Ln 4179, Col 0)
function TY6(q, K, _) {
    return f11(), new File(q, K ?? "unknown_file", _)
}
// @from(Ln 4183, Col 0)
function kp6(q, K) {
    let _ = typeof q === "object" && q !== null && (("name" in q) && q.name && String(q.name) || ("url" in q) && q.url && String(q.url) || ("filename" in q) && q.filename && String(q.filename) || ("path" in q) && q.path && String(q.path)) || "";
    return K ? _.split(/[\\/]/).pop() || void 0 : _
}
// @from(Ln 4188, Col 0)
function $f5(q) {
    let K = typeof q === "function" ? q : q.fetch,
        _ = NG7.get(K);
    if (_) return _;
    let z = (async () => {
        try {
            let Y = "Response" in K ? K.Response : (await K("data:,")).constructor,
                A = new FormData;
            if (A.toString() === await new Y(A).text()) return !1;
            return !0
        } catch {
            return !0
        }
    })();
    return NG7.set(K, z), z
}
// @from(Ln 4204, Col 4)
f11 = () => {
        if (typeof File > "u") {
            let {
                process: q
            } = globalThis, K = typeof q?.versions?.node === "string" && parseInt(q.versions.node.split(".")) < 20;
            throw Error("`File` is not defined as a global, which is required for file uploads." + (K ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""))
        }
    }
// @from(Ln 4212, Col 4)
G11 = (q) => q != null && typeof q === "object" && typeof q[Symbol.asyncIterator] === "function"
// @from(Ln 4213, Col 4)
mD6 = async (q, K, _ = !0) => {
        return {
            ...q,
            body: await jf5(q.body, K, _)
        }
    }
// @from(Ln 4218, Col 7)
NG7
// @from(Ln 4218, Col 12)
jf5 = async (q, K, _ = !0) => {
        if (!await $f5(K)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
        let z = new FormData;
        return await Promise.all(Object.entries(q || {}).map(([Y, A]) => Z11(z, Y, A, _))), z
    }
// @from(Ln 4222, Col 7)
Hf5 = (q) => q instanceof Blob && ("name" in q)
// @from(Ln 4222, Col 56)
Z11 = async (q, K, _, z) => {
        if (_ === void 0) return;
        if (_ == null) throw TypeError(`Received null for "${K}"; to pass null in FormData, you must use the string 'null'`);
        if (typeof _ === "string" || typeof _ === "number" || typeof _ === "boolean") q.append(K, String(_));
        else if (_ instanceof Response) {
            let Y = {},
                A = _.headers.get("Content-Type");
            if (A) Y = {
                type: A
            };
            q.append(K, TY6([await _.blob()], kp6(_, z), Y))
        } else if (G11(_)) q.append(K, TY6([await new Response(Ow8(_)).blob()], kp6(_, z)));
        else if (Hf5(_)) q.append(K, TY6([_], kp6(_, z), {
            type: _.type
        }));
        else if (Array.isArray(_)) await Promise.all(_.map((Y) => Z11(q, K + "[]", Y, z)));
        else if (typeof _ === "object") await Promise.all(Object.entries(_).map(([Y, A]) => Z11(q, `${K}[${Y}]`, A, z)));
        else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${_} instead`)
    }
// @from(Ln 4241, Col 4)
BD6 = L(() => {
    NG7 = new WeakMap
})
// @from(Ln 4244, Col 0)
async function Pw8(q, K, _) {
    if (f11(), q = await q, K || (K = kp6(q, !0)), Jf5(q)) {
        if (q instanceof File && K == null && _ == null) return q;
        return TY6([await q.arrayBuffer()], K ?? q.name, {
            type: q.type,
            lastModified: q.lastModified,
            ..._
        })
    }
    if (Xf5(q)) {
        let Y = await q.blob();
        return K || (K = new URL(q.url).pathname.split(/[\\/]/).pop()), TY6(await v11(Y), K, _)
    }
    let z = await v11(q);
    if (!_?.type) {
        let Y = z.find((A) => typeof A === "object" && ("type" in A) && A.type);
        if (typeof Y === "string") _ = {
            ..._,
            type: Y
        }
    }
    return TY6(z, K, _)
}
// @from(Ln 4267, Col 0)
async function v11(q) {
    let K = [];
    if (typeof q === "string" || ArrayBuffer.isView(q) || q instanceof ArrayBuffer) K.push(q);
    else if (EG7(q)) K.push(q instanceof Blob ? q : await q.arrayBuffer());
    else if (G11(q))
        for await (let _ of q) K.push(...await v11(_));
    else {
        let _ = q?.constructor?.name;
        throw Error(`Unexpected data type: ${typeof q}${_?`; constructor: ${_}`:""}${Mf5(q)}`)
    }
    return K
}
// @from(Ln 4280, Col 0)
function Mf5(q) {
    if (typeof q !== "object" || q === null) return "";
    return `; props: [${Object.getOwnPropertyNames(q).map((_)=>`"${_}"`).join(", ")}]`
}
// @from(Ln 4284, Col 4)
EG7 = (q) => q != null && typeof q === "object" && typeof q.size === "number" && typeof q.type === "string" && typeof q.text === "function" && typeof q.slice === "function" && typeof q.arrayBuffer === "function"
// @from(Ln 4285, Col 4)
Jf5 = (q) => q != null && typeof q === "object" && typeof q.name === "string" && typeof q.lastModified === "number" && EG7(q)
// @from(Ln 4286, Col 4)
Xf5 = (q) => q != null && typeof q === "object" && typeof q.url === "string" && typeof q.blob === "function"
// @from(Ln 4287, Col 4)
yG7 = L(() => {
    BD6();
    BD6()
})
// @from(Ln 4291, Col 4)
T11 = L(() => {
    yG7()
})
// @from(Ln 4294, Col 4)
LG7 = () => {}
// @from(Ln 4295, Col 0)
class iH {
    constructor(q) {
        this._client = q
    }
}
// @from(Ln 4301, Col 0)
function* Wf5(q) {
    if (!q) return;
    if (hG7 in q) {
        let {
            values: z,
            nulls: Y
        } = q;
        yield* z.entries();
        for (let A of Y) yield [A, null];
        return
    }
    let K = !1,
        _;
    if (q instanceof Headers) _ = q.entries();
    else if (O11(q)) _ = q;
    else K = !0, _ = Object.entries(q ?? {});
    for (let z of _) {
        let Y = z[0];
        if (typeof Y !== "string") throw TypeError("expected header name to be a string");
        let A = O11(z[1]) ? z[1] : [z[1]],
            O = !1;
        for (let w of A) {
            if (w === void 0) continue;
            if (K && !O) O = !0, yield [Y, null];
            yield [Y, w]
        }
    }
}
// @from(Ln 4329, Col 4)
hG7
// @from(Ln 4329, Col 9)
r3 = (q) => {
    let K = new Headers,
        _ = new Set;
    for (let z of q) {
        let Y = new Set;
        for (let [A, O] of Wf5(z)) {
            let w = A.toLowerCase();
            if (!Y.has(w)) K.delete(A), Y.add(w);
            if (O === null) K.delete(A), _.add(w);
            else K.append(A, O), _.delete(w)
        }
    }
    return {
        [hG7]: !0,
        values: K,
        nulls: _
    }
}
// @from(Ln 4347, Col 4)
tL = L(() => {
    GY6();
    hG7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 4352, Col 0)
function Ww8(q) {
    return typeof q === "object" && q !== null && Np6 in q
}
// @from(Ln 4356, Col 0)
function V11(q, K) {
    let _ = new Set;
    if (q) {
        for (let z of q)
            if (Ww8(z)) _.add(z[Np6])
    }
    if (K)
        for (let z of K) {
            if (Ww8(z)) _.add(z[Np6]);
            if (Array.isArray(z.content)) {
                for (let Y of z.content)
                    if (Ww8(Y)) _.add(Y[Np6])
            }
        }
    return Array.from(_)
}
// @from(Ln 4373, Col 0)
function Dw8(q, K) {
    let _ = V11(q, K);
    if (_.length === 0) return {};
    return {
        "x-stainless-helper": _.join(", ")
    }
}
// @from(Ln 4381, Col 0)
function RG7(q) {
    if (Ww8(q)) return {
        "x-stainless-helper": q[Np6]
    };
    return {}
}
// @from(Ln 4387, Col 4)
Np6
// @from(Ln 4388, Col 4)
Ep6 = L(() => {
    Np6 = Symbol("anthropic.sdk.stainlessHelper")
})
// @from(Ln 4392, Col 0)
function CG7(q) {
    return q.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 4395, Col 4)
SG7
// @from(Ln 4395, Col 9)
Df5 = (q = CG7) => function(_, ...z) {
        if (_.length === 1) return _[0];
        let Y = !1,
            A = [],
            O = _.reduce((H, J, X) => {
                if (/[?#]/.test(J)) Y = !0;
                let M = z[X],
                    P = (Y ? encodeURIComponent : q)("" + M);
                if (X !== z.length && (M == null || typeof M === "object" && M.toString === Object.getPrototypeOf(Object.getPrototypeOf(M.hasOwnProperty ?? SG7) ?? SG7)?.toString)) P = M + "", A.push({
                    start: H.length + J.length,
                    length: P.length,
                    error: `Value of type ${Object.prototype.toString.call(M).slice(8,-1)} is not a valid path parameter`
                });
                return H + J + (X === z.length ? "" : P)
            }, ""),
            w = O.split(/[?#]/, 1)[0],
            $ = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            j;
        while ((j = $.exec(w)) !== null) A.push({
            start: j.index,
            length: j[0].length,
            error: `Value "${j[0]}" can't be safely passed as a path parameter`
        });
        if (A.sort((H, J) => H.start - J.start), A.length > 0) {
            let H = 0,
                J = A.reduce((X, M) => {
                    let P = " ".repeat(M.start - H),
                        W = "^".repeat(M.length);
                    return H = M.start + M.length, X + P + W
                }, "");
            throw new bq(`Path parameters result in path with invalid segments:
${A.map((X)=>X.error).join(`
`)}
${O}
${J}`)
        }
        return O
    }
// @from(Ln 4433, Col 4)
Qj
// @from(Ln 4434, Col 4)
b86 = L(() => {
    m0();
    SG7 = Object.freeze(Object.create(null)), Qj = Df5(CG7)
})
// @from(Ln 4438, Col 4)
yp6
// @from(Ln 4439, Col 4)
k11 = L(() => {
    ig();
    tL();
    Ep6();
    BD6();
    b86();
    yp6 = class yp6 extends iH {
        list(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.getAPIList("/v1/files", zm, {
                query: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "files-api-2025-04-14"].toString()
                }, K?.headers])
            })
        }
        delete(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.delete(Qj`/v1/files/${q}`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "files-api-2025-04-14"].toString()
                }, _?.headers])
            })
        }
        download(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/files/${q}/content`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "files-api-2025-04-14"].toString(),
                    Accept: "application/binary"
                }, _?.headers]),
                __binaryResponse: !0
            })
        }
        retrieveMetadata(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/files/${q}`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "files-api-2025-04-14"].toString()
                }, _?.headers])
            })
        }
        upload(q, K) {
            let {
                betas: _,
                ...z
            } = q;
            return this._client.post("/v1/files", mD6({
                body: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "files-api-2025-04-14"].toString()
                }, RG7(z.file), K?.headers])
            }, this._client))
        }
    }
})
// @from(Ln 4509, Col 4)
Lp6
// @from(Ln 4510, Col 4)
N11 = L(() => {
    ig();
    tL();
    b86();
    Lp6 = class Lp6 extends iH {
        retrieve(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/models/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    ...z?.toString() != null ? {
                        "anthropic-beta": z?.toString()
                    } : void 0
                }, _?.headers])
            })
        }
        list(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.getAPIList("/v1/models?beta=true", zm, {
                query: z,
                ...K,
                headers: r3([{
                    ..._?.toString() != null ? {
                        "anthropic-beta": _?.toString()
                    } : void 0
                }, K?.headers])
            })
        }
    }
})
// @from(Ln 4545, Col 4)
Fi = L(() => {
    m0()
})
// @from(Ln 4548, Col 4)
Zw8
// @from(Ln 4549, Col 4)
E11 = L(() => {
    Zw8 = {
        "claude-opus-4-20250514": 8192,
        "claude-opus-4-0": 8192,
        "claude-4-opus-20250514": 8192,
        "anthropic.claude-opus-4-20250514-v1:0": 8192,
        "claude-opus-4@20250514": 8192,
        "claude-opus-4-1-20250805": 8192,
        "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
        "claude-opus-4-1@20250805": 8192
    }
})
// @from(Ln 4562, Col 0)
function bG7(q) {
    return q?.output_format ?? q?.output_config?.format
}
// @from(Ln 4566, Col 0)
function y11(q, K, _) {
    let z = bG7(K);
    if (!K || !("parse" in (z ?? {}))) return {
        ...q,
        content: q.content.map((Y) => {
            if (Y.type === "text") {
                let A = Object.defineProperty({
                    ...Y
                }, "parsed_output", {
                    value: null,
                    enumerable: !1
                });
                return Object.defineProperty(A, "parsed", {
                    get() {
                        return _.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null
                    },
                    enumerable: !1
                })
            }
            return Y
        }),
        parsed_output: null
    };
    return L11(q, K, _)
}
// @from(Ln 4592, Col 0)
function L11(q, K, _) {
    let z = null,
        Y = q.content.map((A) => {
            if (A.type === "text") {
                let O = Gf5(K, A.text);
                if (z === null) z = O;
                let w = Object.defineProperty({
                    ...A
                }, "parsed_output", {
                    value: O,
                    enumerable: !1
                });
                return Object.defineProperty(w, "parsed", {
                    get() {
                        return _.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), O
                    },
                    enumerable: !1
                })
            }
            return A
        });
    return {
        ...q,
        content: Y,
        parsed_output: z
    }
}
// @from(Ln 4620, Col 0)
function Gf5(q, K) {
    let _ = bG7(q);
    if (_?.type !== "json_schema") return null;
    try {
        if ("parse" in _) return _.parse(K);
        return JSON.parse(K)
    } catch (z) {
        throw new bq(`Failed to parse structured output: ${z}`)
    }
}
// @from(Ln 4630, Col 4)
h11 = L(() => {
    m0()
})
// @from(Ln 4633, Col 4)
vf5 = (q) => {
        let K = 0,
            _ = [];
        while (K < q.length) {
            let z = q[K];
            if (z === "\\") {
                K++;
                continue
            }
            if (z === "{") {
                _.push({
                    type: "brace",
                    value: "{"
                }), K++;
                continue
            }
            if (z === "}") {
                _.push({
                    type: "brace",
                    value: "}"
                }), K++;
                continue
            }
            if (z === "[") {
                _.push({
                    type: "paren",
                    value: "["
                }), K++;
                continue
            }
            if (z === "]") {
                _.push({
                    type: "paren",
                    value: "]"
                }), K++;
                continue
            }
            if (z === ":") {
                _.push({
                    type: "separator",
                    value: ":"
                }), K++;
                continue
            }
            if (z === ",") {
                _.push({
                    type: "delimiter",
                    value: ","
                }), K++;
                continue
            }
            if (z === '"') {
                let w = "",
                    $ = !1;
                z = q[++K];
                while (z !== '"') {
                    if (K === q.length) {
                        $ = !0;
                        break
                    }
                    if (z === "\\") {
                        if (K++, K === q.length) {
                            $ = !0;
                            break
                        }
                        w += z + q[K], z = q[++K]
                    } else w += z, z = q[++K]
                }
                if (z = q[++K], !$) _.push({
                    type: "string",
                    value: w
                });
                continue
            }
            if (z && /\s/.test(z)) {
                K++;
                continue
            }
            let A = /[0-9]/;
            if (z && A.test(z) || z === "-" || z === ".") {
                let w = "";
                if (z === "-") w += z, z = q[++K];
                while (z && A.test(z) || z === ".") w += z, z = q[++K];
                _.push({
                    type: "number",
                    value: w
                });
                continue
            }
            let O = /[a-z]/i;
            if (z && O.test(z)) {
                let w = "";
                while (z && O.test(z)) {
                    if (K === q.length) break;
                    w += z, z = q[++K]
                }
                if (w == "true" || w == "false" || w === "null") _.push({
                    type: "name",
                    value: w
                });
                else {
                    K++;
                    continue
                }
                continue
            }
            K++
        }
        return _
    }
// @from(Ln 4743, Col 4)
pD6 = (q) => {
        if (q.length === 0) return q;
        let K = q[q.length - 1];
        switch (K.type) {
            case "separator":
                return q = q.slice(0, q.length - 1), pD6(q);
                break;
            case "number":
                let _ = K.value[K.value.length - 1];
                if (_ === "." || _ === "-") return q = q.slice(0, q.length - 1), pD6(q);
            case "string":
                let z = q[q.length - 2];
                if (z?.type === "delimiter") return q = q.slice(0, q.length - 1), pD6(q);
                else if (z?.type === "brace" && z.value === "{") return q = q.slice(0, q.length - 1), pD6(q);
                break;
            case "delimiter":
                return q = q.slice(0, q.length - 1), pD6(q);
                break
        }
        return q
    }
// @from(Ln 4764, Col 4)
Tf5 = (q) => {
        let K = [];
        if (q.map((_) => {
                if (_.type === "brace")
                    if (_.value === "{") K.push("}");
                    else K.splice(K.lastIndexOf("}"), 1);
                if (_.type === "paren")
                    if (_.value === "[") K.push("]");
                    else K.splice(K.lastIndexOf("]"), 1)
            }), K.length > 0) K.reverse().map((_) => {
            if (_ === "}") q.push({
                type: "brace",
                value: "}"
            });
            else if (_ === "]") q.push({
                type: "paren",
                value: "]"
            })
        });
        return q
    }
// @from(Ln 4785, Col 4)
Vf5 = (q) => {
        let K = "";
        return q.map((_) => {
            switch (_.type) {
                case "string":
                    K += '"' + _.value + '"';
                    break;
                default:
                    K += _.value;
                    break
            }
        }), K
    }
// @from(Ln 4798, Col 4)
fw8 = (q) => JSON.parse(Vf5(Tf5(pD6(vf5(q)))))
// @from(Ln 4799, Col 4)
R11 = () => {}
// @from(Ln 4800, Col 4)
Gw8 = L(() => {
    M11()
})
// @from(Ln 4804, Col 0)
function mG7(q) {
    return q.type === "tool_use" || q.type === "server_tool_use" || q.type === "mcp_tool_use"
}
// @from(Ln 4808, Col 0)
function BG7(q) {}
// @from(Ln 4809, Col 4)
NC
// @from(Ln 4809, Col 8)
I86
// @from(Ln 4809, Col 13)
FD6
// @from(Ln 4809, Col 18)
hp6
// @from(Ln 4809, Col 23)
vw8
// @from(Ln 4809, Col 28)
Rp6
// @from(Ln 4809, Col 33)
Sp6
// @from(Ln 4809, Col 38)
Tw8
// @from(Ln 4809, Col 43)
Cp6
// @from(Ln 4809, Col 48)
gi
// @from(Ln 4809, Col 52)
bp6
// @from(Ln 4809, Col 57)
Vw8
// @from(Ln 4809, Col 62)
kw8
// @from(Ln 4809, Col 67)
VY6
// @from(Ln 4809, Col 72)
Nw8
// @from(Ln 4809, Col 77)
Ew8
// @from(Ln 4809, Col 82)
Ip6
// @from(Ln 4809, Col 87)
S11
// @from(Ln 4809, Col 92)
IG7
// @from(Ln 4809, Col 97)
yw8
// @from(Ln 4809, Col 102)
C11
// @from(Ln 4809, Col 107)
b11
// @from(Ln 4809, Col 112)
I11
// @from(Ln 4809, Col 117)
xG7
// @from(Ln 4809, Col 122)
uG7 = "__json_buf"
// @from(Ln 4810, Col 4)
xp6
// @from(Ln 4811, Col 4)
pG7 = L(() => {
    mi();
    R11();
    Fi();
    Gw8();
    h11();
    xp6 = class xp6 {
        constructor(q, K) {
            NC.add(this), this.messages = [], this.receivedMessages = [], I86.set(this, void 0), FD6.set(this, null), this.controller = new AbortController, hp6.set(this, void 0), vw8.set(this, () => {}), Rp6.set(this, () => {}), Sp6.set(this, void 0), Tw8.set(this, () => {}), Cp6.set(this, () => {}), gi.set(this, {}), bp6.set(this, !1), Vw8.set(this, !1), kw8.set(this, !1), VY6.set(this, !1), Nw8.set(this, void 0), Ew8.set(this, void 0), Ip6.set(this, void 0), yw8.set(this, (_) => {
                if (N4(this, Vw8, !0, "f"), Bi(_)) _ = new r_;
                if (_ instanceof r_) return N4(this, kw8, !0, "f"), this._emit("abort", _);
                if (_ instanceof bq) return this._emit("error", _);
                if (_ instanceof Error) {
                    let z = new bq(_.message);
                    return z.cause = _, this._emit("error", z)
                }
                return this._emit("error", new bq(String(_)))
            }), N4(this, hp6, new Promise((_, z) => {
                N4(this, vw8, _, "f"), N4(this, Rp6, z, "f")
            }), "f"), N4(this, Sp6, new Promise((_, z) => {
                N4(this, Tw8, _, "f"), N4(this, Cp6, z, "f")
            }), "f"), U1(this, hp6, "f").catch(() => {}), U1(this, Sp6, "f").catch(() => {}), N4(this, FD6, q, "f"), N4(this, Ip6, K?.logger ?? console, "f")
        }
        get response() {
            return U1(this, Nw8, "f")
        }
        get request_id() {
            return U1(this, Ew8, "f")
        }
        async withResponse() {
            N4(this, VY6, !0, "f");
            let q = await U1(this, hp6, "f");
            if (!q) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: q,
                request_id: q.headers.get("request-id")
            }
        }
        static fromReadableStream(q) {
            let K = new xp6(null);
            return K._run(() => K._fromReadableStream(q)), K
        }
        static createMessage(q, K, _, {
            logger: z
        } = {}) {
            let Y = new xp6(K, {
                logger: z
            });
            for (let A of K.messages) Y._addMessageParam(A);
            return N4(Y, FD6, {
                ...K,
                stream: !0
            }, "f"), Y._run(() => Y._createMessage(q, {
                ...K,
                stream: !0
            }, {
                ..._,
                headers: {
                    ..._?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), Y
        }
        _run(q) {
            q().then(() => {
                this._emitFinal(), this._emit("end")
            }, U1(this, yw8, "f"))
        }
        _addMessageParam(q) {
            this.messages.push(q)
        }
        _addMessage(q, K = !0) {
            if (this.receivedMessages.push(q), K) this._emit("message", q)
        }
        async _createMessage(q, K, _) {
            let z = _?.signal,
                Y;
            if (z) {
                if (z.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), z.addEventListener("abort", Y)
            }
            try {
                U1(this, NC, "m", C11).call(this);
                let {
                    response: A,
                    data: O
                } = await q.create({
                    ...K,
                    stream: !0
                }, {
                    ..._,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(A);
                for await (let w of O) U1(this, NC, "m", b11).call(this, w);
                if (O.controller.signal?.aborted) throw new r_;
                U1(this, NC, "m", I11).call(this)
            } finally {
                if (z && Y) z.removeEventListener("abort", Y)
            }
        }
        _connected(q) {
            if (this.ended) return;
            N4(this, Nw8, q, "f"), N4(this, Ew8, q?.headers.get("request-id"), "f"), U1(this, vw8, "f").call(this, q), this._emit("connect")
        }
        get ended() {
            return U1(this, bp6, "f")
        }
        get errored() {
            return U1(this, Vw8, "f")
        }
        get aborted() {
            return U1(this, kw8, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(q, K) {
            return (U1(this, gi, "f")[q] || (U1(this, gi, "f")[q] = [])).push({
                listener: K
            }), this
        }
        off(q, K) {
            let _ = U1(this, gi, "f")[q];
            if (!_) return this;
            let z = _.findIndex((Y) => Y.listener === K);
            if (z >= 0) _.splice(z, 1);
            return this
        }
        once(q, K) {
            return (U1(this, gi, "f")[q] || (U1(this, gi, "f")[q] = [])).push({
                listener: K,
                once: !0
            }), this
        }
        emitted(q) {
            return new Promise((K, _) => {
                if (N4(this, VY6, !0, "f"), q !== "error") this.once("error", _);
                this.once(q, K)
            })
        }
        async done() {
            N4(this, VY6, !0, "f"), await U1(this, Sp6, "f")
        }
        get currentMessage() {
            return U1(this, I86, "f")
        }
        async finalMessage() {
            return await this.done(), U1(this, NC, "m", S11).call(this)
        }
        async finalText() {
            return await this.done(), U1(this, NC, "m", IG7).call(this)
        }
        _emit(q, ...K) {
            if (U1(this, bp6, "f")) return;
            if (q === "end") N4(this, bp6, !0, "f"), U1(this, Tw8, "f").call(this);
            let _ = U1(this, gi, "f")[q];
            if (_) U1(this, gi, "f")[q] = _.filter((z) => !z.once), _.forEach(({
                listener: z
            }) => z(...K));
            if (q === "abort") {
                let z = K[0];
                if (!U1(this, VY6, "f") && !_?.length) Promise.reject(z);
                U1(this, Rp6, "f").call(this, z), U1(this, Cp6, "f").call(this, z), this._emit("end");
                return
            }
            if (q === "error") {
                let z = K[0];
                if (!U1(this, VY6, "f") && !_?.length) Promise.reject(z);
                U1(this, Rp6, "f").call(this, z), U1(this, Cp6, "f").call(this, z), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", U1(this, NC, "m", S11).call(this))
        }
        async _fromReadableStream(q, K) {
            let _ = K?.signal,
                z;
            if (_) {
                if (_.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), _.addEventListener("abort", z)
            }
            try {
                U1(this, NC, "m", C11).call(this), this._connected(null);
                let Y = $V.fromReadableStream(q, this.controller);
                for await (let A of Y) U1(this, NC, "m", b11).call(this, A);
                if (Y.controller.signal?.aborted) throw new r_;
                U1(this, NC, "m", I11).call(this)
            } finally {
                if (_ && z) _.removeEventListener("abort", z)
            }
        } [(I86 = new WeakMap, FD6 = new WeakMap, hp6 = new WeakMap, vw8 = new WeakMap, Rp6 = new WeakMap, Sp6 = new WeakMap, Tw8 = new WeakMap, Cp6 = new WeakMap, gi = new WeakMap, bp6 = new WeakMap, Vw8 = new WeakMap, kw8 = new WeakMap, VY6 = new WeakMap, Nw8 = new WeakMap, Ew8 = new WeakMap, Ip6 = new WeakMap, yw8 = new WeakMap, NC = new WeakSet, S11 = function() {
            if (this.receivedMessages.length === 0) throw new bq("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, IG7 = function() {
            if (this.receivedMessages.length === 0) throw new bq("stream ended without producing a Message with role=assistant");
            let K = this.receivedMessages.at(-1).content.filter((_) => _.type === "text").map((_) => _.text);
            if (K.length === 0) throw new bq("stream ended without producing a content block with type=text");
            return K.join(" ")
        }, C11 = function() {
            if (this.ended) return;
            N4(this, I86, void 0, "f")
        }, b11 = function(K) {
            if (this.ended) return;
            let _ = U1(this, NC, "m", xG7).call(this, K);
            switch (this._emit("streamEvent", K, _), K.type) {
                case "content_block_delta": {
                    let z = _.content.at(-1);
                    switch (K.delta.type) {
                        case "text_delta": {
                            if (z.type === "text") this._emit("text", K.delta.text, z.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (z.type === "text") this._emit("citation", K.delta.citation, z.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (mG7(z) && z.input) this._emit("inputJson", K.delta.partial_json, z.input);
                            break
                        }
                        case "thinking_delta": {
                            if (z.type === "thinking") this._emit("thinking", K.delta.thinking, z.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (z.type === "thinking") this._emit("signature", z.signature);
                            break
                        }
                        case "compaction_delta": {
                            if (z.type === "compaction" && z.content) this._emit("compaction", z.content);
                            break
                        }
                        default:
                            BG7(K.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(_), this._addMessage(y11(_, U1(this, FD6, "f"), {
                        logger: U1(this, Ip6, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", _.content.at(-1));
                    break
                }
                case "message_start": {
                    N4(this, I86, _, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, I11 = function() {
            if (this.ended) throw new bq("stream has ended, this shouldn't happen");
            let K = U1(this, I86, "f");
            if (!K) throw new bq("request ended without sending any chunks");
            return N4(this, I86, void 0, "f"), y11(K, U1(this, FD6, "f"), {
                logger: U1(this, Ip6, "f")
            })
        }, xG7 = function(K) {
            let _ = U1(this, I86, "f");
            if (K.type === "message_start") {
                if (_) throw new bq(`Unexpected event order, got ${K.type} before receiving "message_stop"`);
                return K.message
            }
            if (!_) throw new bq(`Unexpected event order, got ${K.type} before "message_start"`);
            switch (K.type) {
                case "message_stop":
                    return _;
                case "message_delta":
                    if (_.container = K.delta.container, _.stop_reason = K.delta.stop_reason, _.stop_sequence = K.delta.stop_sequence, _.usage.output_tokens = K.usage.output_tokens, _.context_management = K.context_management, K.usage.input_tokens != null) _.usage.input_tokens = K.usage.input_tokens;
                    if (K.usage.cache_creation_input_tokens != null) _.usage.cache_creation_input_tokens = K.usage.cache_creation_input_tokens;
                    if (K.usage.cache_read_input_tokens != null) _.usage.cache_read_input_tokens = K.usage.cache_read_input_tokens;
                    if (K.usage.server_tool_use != null) _.usage.server_tool_use = K.usage.server_tool_use;
                    if (K.usage.iterations != null) _.usage.iterations = K.usage.iterations;
                    return _;
                case "content_block_start":
                    return _.content.push(K.content_block), _;
                case "content_block_delta": {
                    let z = _.content.at(K.index);
                    switch (K.delta.type) {
                        case "text_delta": {
                            if (z?.type === "text") _.content[K.index] = {
                                ...z,
                                text: (z.text || "") + K.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (z?.type === "text") _.content[K.index] = {
                                ...z,
                                citations: [...z.citations ?? [], K.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (z && mG7(z)) {
                                let Y = z[uG7] || "";
                                Y += K.delta.partial_json;
                                let A = {
                                    ...z
                                };
                                if (Object.defineProperty(A, uG7, {
                                        value: Y,
                                        enumerable: !1,
                                        writable: !0
                                    }), Y) try {
                                    A.input = fw8(Y)
                                } catch (O) {
                                    let w = new bq(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${O}. JSON: ${Y}`);
                                    U1(this, yw8, "f").call(this, w)
                                }
                                _.content[K.index] = A
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (z?.type === "thinking") _.content[K.index] = {
                                ...z,
                                thinking: z.thinking + K.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (z?.type === "thinking") _.content[K.index] = {
                                ...z,
                                signature: K.delta.signature
                            };
                            break
                        }
                        case "compaction_delta": {
                            if (z?.type === "compaction") _.content[K.index] = {
                                ...z,
                                content: (z.content || "") + K.delta.content
                            };
                            break
                        }
                        default:
                            BG7(K.delta)
                    }
                    return _
                }
                case "content_block_stop":
                    return _
            }
        }, Symbol.asyncIterator)]() {
            let q = [],
                K = [],
                _ = !1;
            return this.on("streamEvent", (z) => {
                let Y = K.shift();
                if (Y) Y.resolve(z);
                else q.push(z)
            }), this.on("end", () => {
                _ = !0;
                for (let z of K) z.resolve(void 0);
                K.length = 0
            }), this.on("abort", (z) => {
                _ = !0;
                for (let Y of K) Y.reject(z);
                K.length = 0
            }), this.on("error", (z) => {
                _ = !0;
                for (let Y of K) Y.reject(z);
                K.length = 0
            }), {
                next: async () => {
                    if (!q.length) {
                        if (_) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((Y, A) => K.push({
                            resolve: Y,
                            reject: A
                        })).then((Y) => Y ? {
                            value: Y,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: q.shift(),
                        done: !1
                    }
                },
                return: async () => {
                    return this.abort(), {
                        value: void 0,
                        done: !0
                    }
                }
            }
        }
        toReadableStream() {
            return new $V(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 5217, Col 4)
gD6
// @from(Ln 5218, Col 4)
Lw8 = L(() => {
    gD6 = class gD6 extends Error {
        constructor(q) {
            let K = typeof q === "string" ? q : q.map((_) => {
                if (_.type === "text") return _.text;
                return `[${_.type}]`
            }).join(" ");
            super(K);
            this.name = "ToolError", this.content = q
        }
    }
})
// @from(Ln 5230, Col 4)
FG7 = 1e5
// @from(Ln 5231, Col 4)
gG7 = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`
// @from(Ln 5255, Col 0)
function QG7() {
    let q, K;
    return {
        promise: new Promise((z, Y) => {
            q = z, K = Y
        }),
        resolve: q,
        reject: K
    }
}
// @from(Ln 5265, Col 0)
async function kf5(q, K = q.messages.at(-1)) {
    if (!K || K.role !== "assistant" || !K.content || typeof K.content === "string") return null;
    let _ = K.content.filter((Y) => Y.type === "tool_use");
    if (_.length === 0) return null;
    return {
        role: "user",
        content: await Promise.all(_.map(async (Y) => {
            let A = q.tools.find((O) => ("name" in O ? O.name : O.mcp_server_name) === Y.name);
            if (!A || !("run" in A)) return {
                type: "tool_result",
                tool_use_id: Y.id,
                content: `Error: Tool '${Y.name}' not found`,
                is_error: !0
            };
            try {
                let O = Y.input;
                if ("parse" in A && A.parse) O = A.parse(O);
                let w = await A.run(O);
                return {
                    type: "tool_result",
                    tool_use_id: Y.id,
                    content: w
                }
            } catch (O) {
                return {
                    type: "tool_result",
                    tool_use_id: Y.id,
                    content: O instanceof gD6 ? O.content : `Error: ${O instanceof Error?O.message:String(O)}`,
                    is_error: !0
                }
            }
        }))
    }
}
// @from(Ln 5299, Col 4)
up6
// @from(Ln 5299, Col 9)
UD6
// @from(Ln 5299, Col 14)
kY6
// @from(Ln 5299, Col 19)
NW
// @from(Ln 5299, Col 23)
mp6
// @from(Ln 5299, Col 28)
eL
// @from(Ln 5299, Col 32)
Ui
// @from(Ln 5299, Col 36)
x86
// @from(Ln 5299, Col 41)
Bp6
// @from(Ln 5299, Col 46)
UG7
// @from(Ln 5299, Col 51)
x11
// @from(Ln 5299, Col 56)
pp6
// @from(Ln 5300, Col 4)
u11 = L(() => {
    mi();
    Lw8();
    m0();
    tL();
    Ep6();
    pp6 = class pp6 {
        constructor(q, K, _) {
            up6.add(this), this.client = q, UD6.set(this, !1), kY6.set(this, !1), NW.set(this, void 0), mp6.set(this, void 0), eL.set(this, void 0), Ui.set(this, void 0), x86.set(this, void 0), Bp6.set(this, 0), N4(this, NW, {
                params: {
                    ...K,
                    messages: structuredClone(K.messages)
                }
            }, "f");
            let Y = ["BetaToolRunner", ...V11(K.tools, K.messages)].join(", ");
            N4(this, mp6, {
                ..._,
                headers: r3([{
                    "x-stainless-helper": Y
                }, _?.headers])
            }, "f"), N4(this, x86, QG7(), "f")
        }
        async * [(UD6 = new WeakMap, kY6 = new WeakMap, NW = new WeakMap, mp6 = new WeakMap, eL = new WeakMap, Ui = new WeakMap, x86 = new WeakMap, Bp6 = new WeakMap, up6 = new WeakSet, UG7 = async function() {
            let K = U1(this, NW, "f").params.compactionControl;
            if (!K || !K.enabled) return !1;
            let _ = 0;
            if (U1(this, eL, "f") !== void 0) try {
                let $ = await U1(this, eL, "f");
                _ = $.usage.input_tokens + ($.usage.cache_creation_input_tokens ?? 0) + ($.usage.cache_read_input_tokens ?? 0) + $.usage.output_tokens
            } catch {
                return !1
            }
            let z = K.contextTokenThreshold ?? FG7;
            if (_ < z) return !1;
            let Y = K.model ?? U1(this, NW, "f").params.model,
                A = K.summaryPrompt ?? gG7,
                O = U1(this, NW, "f").params.messages;
            if (O[O.length - 1].role === "assistant") {
                let $ = O[O.length - 1];
                if (Array.isArray($.content)) {
                    let j = $.content.filter((H) => H.type !== "tool_use");
                    if (j.length === 0) O.pop();
                    else $.content = j
                }
            }
            let w = await this.client.beta.messages.create({
                model: Y,
                messages: [...O, {
                    role: "user",
                    content: [{
                        type: "text",
                        text: A
                    }]
                }],
                max_tokens: U1(this, NW, "f").params.max_tokens
            }, {
                headers: {
                    "x-stainless-helper": "compaction"
                }
            });
            if (w.content[0]?.type !== "text") throw new bq("Expected text response for compaction");
            return U1(this, NW, "f").params.messages = [{
                role: "user",
                content: w.content
            }], !0
        }, Symbol.asyncIterator)]() {
            var q;
            if (U1(this, UD6, "f")) throw new bq("Cannot iterate over a consumed stream");
            N4(this, UD6, !0, "f"), N4(this, kY6, !0, "f"), N4(this, Ui, void 0, "f");
            try {
                while (!0) {
                    let K;
                    try {
                        if (U1(this, NW, "f").params.max_iterations && U1(this, Bp6, "f") >= U1(this, NW, "f").params.max_iterations) break;
                        N4(this, kY6, !1, "f"), N4(this, Ui, void 0, "f"), N4(this, Bp6, (q = U1(this, Bp6, "f"), q++, q), "f"), N4(this, eL, void 0, "f");
                        let {
                            max_iterations: _,
                            compactionControl: z,
                            ...Y
                        } = U1(this, NW, "f").params;
                        if (Y.stream) K = this.client.beta.messages.stream({
                            ...Y
                        }, U1(this, mp6, "f")), N4(this, eL, K.finalMessage(), "f"), U1(this, eL, "f").catch(() => {}), yield K;
                        else N4(this, eL, this.client.beta.messages.create({
                            ...Y,
                            stream: !1
                        }, U1(this, mp6, "f")), "f"), yield U1(this, eL, "f");
                        if (!await U1(this, up6, "m", UG7).call(this)) {
                            if (!U1(this, kY6, "f")) {
                                let {
                                    role: w,
                                    content: $
                                } = await U1(this, eL, "f");
                                U1(this, NW, "f").params.messages.push({
                                    role: w,
                                    content: $
                                })
                            }
                            let O = await U1(this, up6, "m", x11).call(this, U1(this, NW, "f").params.messages.at(-1));
                            if (O) U1(this, NW, "f").params.messages.push(O);
                            else if (!U1(this, kY6, "f")) break
                        }
                    } finally {
                        if (K) K.abort()
                    }
                }
                if (!U1(this, eL, "f")) throw new bq("ToolRunner concluded without a message from the server");
                U1(this, x86, "f").resolve(await U1(this, eL, "f"))
            } catch (K) {
                throw N4(this, UD6, !1, "f"), U1(this, x86, "f").promise.catch(() => {}), U1(this, x86, "f").reject(K), N4(this, x86, QG7(), "f"), K
            }
        }
        setMessagesParams(q) {
            if (typeof q === "function") U1(this, NW, "f").params = q(U1(this, NW, "f").params);
            else U1(this, NW, "f").params = q;
            N4(this, kY6, !0, "f"), N4(this, Ui, void 0, "f")
        }
        async generateToolResponse() {
            let q = await U1(this, eL, "f") ?? this.params.messages.at(-1);
            if (!q) return null;
            return U1(this, up6, "m", x11).call(this, q)
        }
        done() {
            return U1(this, x86, "f").promise
        }
        async runUntilDone() {
            if (!U1(this, UD6, "f"))
                for await (let q of this);
            return this.done()
        }
        get params() {
            return U1(this, NW, "f").params
        }
        pushMessages(...q) {
            this.setMessagesParams((K) => ({
                ...K,
                messages: [...K.messages, ...q]
            }))
        }
        then(q, K) {
            return this.runUntilDone().then(q, K)
        }
    };
    x11 = async function(K) {
        if (U1(this, Ui, "f") !== void 0) return U1(this, Ui, "f");
        return N4(this, Ui, kf5(U1(this, NW, "f").params, K), "f"), U1(this, Ui, "f")
    }
})
// @from(Ln 5448, Col 4)
QD6
// @from(Ln 5449, Col 4)
m11 = L(() => {
    m0();
    J11();
    QD6 = class QD6 {
        constructor(q, K) {
            this.iterator = q, this.controller = K
        }
        async * decoder() {
            let q = new C86;
            for await (let K of this.iterator) for (let _ of q.decode(K)) yield JSON.parse(_);
            for (let K of q.flush()) yield JSON.parse(K)
        } [Symbol.asyncIterator]() {
            return this.decoder()
        }
        static fromResponse(q, K) {
            if (!q.body) {
                if (K.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new bq("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
                throw new bq("Attempted to iterate over a response with no body")
            }
            return new QD6(Zp6(q.body), K)
        }
    }
})
// @from(Ln 5472, Col 4)
Fp6
// @from(Ln 5473, Col 4)
B11 = L(() => {
    ig();
    tL();
    m11();
    Fi();
    b86();
    Fp6 = class Fp6 extends iH {
        create(q, K) {
            let {
                betas: _,
                ...z
            } = q;
            return this._client.post("/v1/messages/batches?beta=true", {
                body: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        retrieve(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/messages/batches/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "message-batches-2024-09-24"].toString()
                }, _?.headers])
            })
        }
        list(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.getAPIList("/v1/messages/batches?beta=true", zm, {
                query: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        delete(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.delete(Qj`/v1/messages/batches/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "message-batches-2024-09-24"].toString()
                }, _?.headers])
            })
        }
        cancel(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.post(Qj`/v1/messages/batches/${q}/cancel?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "message-batches-2024-09-24"].toString()
                }, _?.headers])
            })
        }
        async results(q, K = {}, _) {
            let z = await this.retrieve(q);
            if (!z.results_url) throw new bq(`No batch \`results_url\`; Has it finished processing? ${z.processing_status} - ${z.id}`);
            let {
                betas: Y
            } = K ?? {};
            return this._client.get(z.results_url, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString(),
                    Accept: "application/binary"
                }, _?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((A, O) => QD6.fromResponse(O.response, O.controller))
        }
    }
})
// @from(Ln 5558, Col 0)
function cG7(q) {
    if (!q.output_format) return q;
    if (q.output_config?.format) throw new bq("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
    let {
        output_format: K,
        ..._
    } = q;
    return {
        ..._,
        output_config: {
            ...q.output_config,
            format: K
        }
    }
}
// @from(Ln 5573, Col 4)
dG7
// @from(Ln 5573, Col 9)
Ef5
// @from(Ln 5573, Col 14)
u86
// @from(Ln 5574, Col 4)
p11 = L(() => {
    Fi();
    E11();
    tL();
    Ep6();
    h11();
    pG7();
    u11();
    Lw8();
    B11();
    B11();
    u11();
    Lw8();
    dG7 = {
        "claude-1.3": "November 6th, 2024",
        "claude-1.3-100k": "November 6th, 2024",
        "claude-instant-1.1": "November 6th, 2024",
        "claude-instant-1.1-100k": "November 6th, 2024",
        "claude-instant-1.2": "November 6th, 2024",
        "claude-3-sonnet-20240229": "July 21st, 2025",
        "claude-3-opus-20240229": "January 5th, 2026",
        "claude-2.1": "July 21st, 2025",
        "claude-2.0": "July 21st, 2025",
        "claude-3-7-sonnet-latest": "February 19th, 2026",
        "claude-3-7-sonnet-20250219": "February 19th, 2026"
    }, Ef5 = ["claude-opus-4-6"];
    u86 = class u86 extends iH {
        constructor() {
            super(...arguments);
            this.batches = new Fp6(this._client)
        }
        create(q, K) {
            let _ = cG7(q),
                {
                    betas: z,
                    ...Y
                } = _;
            if (Y.model in dG7) console.warn(`The model '${Y.model}' is deprecated and will reach end-of-life on ${dG7[Y.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (Y.model in Ef5 && Y.thinking && Y.thinking.type === "enabled") console.warn(`Using Claude with ${Y.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let A = this._client._options.timeout;
            if (!Y.stream && A == null) {
                let w = Zw8[Y.model] ?? void 0;
                A = this._client.calculateNonstreamingTimeout(Y.max_tokens, w)
            }
            let O = Dw8(Y.tools, Y.messages);
            return this._client.post("/v1/messages?beta=true", {
                body: Y,
                timeout: A ?? 600000,
                ...K,
                headers: r3([{
                    ...z?.toString() != null ? {
                        "anthropic-beta": z?.toString()
                    } : void 0
                }, O, K?.headers]),
                stream: _.stream ?? !1
            })
        }
        parse(q, K) {
            return K = {
                ...K,
                headers: r3([{
                    "anthropic-beta": [...q.betas ?? [], "structured-outputs-2025-12-15"].toString()
                }, K?.headers])
            }, this.create(q, K).then((_) => L11(_, q, {
                logger: this._client.logger ?? console
            }))
        }
        stream(q, K) {
            return xp6.createMessage(this, q, K)
        }
        countTokens(q, K) {
            let _ = cG7(q),
                {
                    betas: z,
                    ...Y
                } = _;
            return this._client.post("/v1/messages/count_tokens?beta=true", {
                body: Y,
                ...K,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "token-counting-2024-11-01"].toString()
                }, K?.headers])
            })
        }
        toolRunner(q, K) {
            return new pp6(this._client, q, K)
        }
    };
    u86.Batches = Fp6;
    u86.BetaToolRunner = pp6;
    u86.ToolError = gD6
})
// @from(Ln 5667, Col 4)
gp6
// @from(Ln 5668, Col 4)
F11 = L(() => {
    ig();
    tL();
    BD6();
    b86();
    gp6 = class gp6 extends iH {
        create(q, K = {}, _) {
            let {
                betas: z,
                ...Y
            } = K ?? {};
            return this._client.post(Qj`/v1/skills/${q}/versions?beta=true`, mD6({
                body: Y,
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            }, this._client))
        }
        retrieve(q, K, _) {
            let {
                skill_id: z,
                betas: Y
            } = K;
            return this._client.get(Qj`/v1/skills/${z}/versions/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            })
        }
        list(q, K = {}, _) {
            let {
                betas: z,
                ...Y
            } = K ?? {};
            return this._client.getAPIList(Qj`/v1/skills/${q}/versions?beta=true`, Vp6, {
                query: Y,
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            })
        }
        delete(q, K, _) {
            let {
                skill_id: z,
                betas: Y
            } = K;
            return this._client.delete(Qj`/v1/skills/${z}/versions/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            })
        }
    }
})
// @from(Ln 5726, Col 4)
dD6
// @from(Ln 5727, Col 4)
g11 = L(() => {
    F11();
    F11();
    ig();
    tL();
    BD6();
    b86();
    dD6 = class dD6 extends iH {
        constructor() {
            super(...arguments);
            this.versions = new gp6(this._client)
        }
        create(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.post("/v1/skills?beta=true", mD6({
                body: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            }, this._client, !1))
        }
        retrieve(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/skills/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            })
        }
        list(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.getAPIList("/v1/skills?beta=true", Vp6, {
                query: z,
                ...K,
                headers: r3([{
                    "anthropic-beta": [..._ ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        delete(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.delete(Qj`/v1/skills/${q}?beta=true`, {
                ..._,
                headers: r3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, _?.headers])
            })
        }
    };
    dD6.Versions = gp6
})
// @from(Ln 5790, Col 4)
p0
// @from(Ln 5791, Col 4)
U11 = L(() => {
    k11();
    k11();
    N11();
    N11();
    p11();
    p11();
    g11();
    g11();
    p0 = class p0 extends iH {
        constructor() {
            super(...arguments);
            this.models = new Lp6(this._client), this.messages = new u86(this._client), this.files = new yp6(this._client), this.skills = new dD6(this._client)
        }
    };
    p0.Models = Lp6;
    p0.Messages = u86;
    p0.Files = yp6;
    p0.Skills = dD6
})
// @from(Ln 5811, Col 4)
m86
// @from(Ln 5812, Col 4)
Q11 = L(() => {
    tL();
    m86 = class m86 extends iH {
        create(q, K) {
            let {
                betas: _,
                ...z
            } = q;
            return this._client.post("/v1/complete", {
                body: z,
                timeout: this._client._options.timeout ?? 600000,
                ...K,
                headers: r3([{
                    ..._?.toString() != null ? {
                        "anthropic-beta": _?.toString()
                    } : void 0
                }, K?.headers]),
                stream: q.stream ?? !1
            })
        }
    }
})
// @from(Ln 5835, Col 0)
function lG7(q) {
    return q?.output_config?.format
}
// @from(Ln 5839, Col 0)
function d11(q, K, _) {
    let z = lG7(K);
    if (!K || !("parse" in (z ?? {}))) return {
        ...q,
        content: q.content.map((Y) => {
            if (Y.type === "text") return Object.defineProperty({
                ...Y
            }, "parsed_output", {
                value: null,
                enumerable: !1
            });
            return Y
        }),
        parsed_output: null
    };
    return c11(q, K, _)
}
// @from(Ln 5857, Col 0)
function c11(q, K, _) {
    let z = null,
        Y = q.content.map((A) => {
            if (A.type === "text") {
                let O = Rf5(K, A.text);
                if (z === null) z = O;
                return Object.defineProperty({
                    ...A
                }, "parsed_output", {
                    value: O,
                    enumerable: !1
                })
            }
            return A
        });
    return {
        ...q,
        content: Y,
        parsed_output: z
    }
}
// @from(Ln 5879, Col 0)
function Rf5(q, K) {
    let _ = lG7(q);
    if (_?.type !== "json_schema") return null;
    try {
        if ("parse" in _) return _.parse(K);
        return JSON.parse(K)
    } catch (z) {
        throw new bq(`Failed to parse structured output: ${z}`)
    }
}
// @from(Ln 5889, Col 4)
l11 = L(() => {
    m0()
})
// @from(Ln 5893, Col 0)
function oG7(q) {
    return q.type === "tool_use" || q.type === "server_tool_use"
}
// @from(Ln 5897, Col 0)
function aG7(q) {}
// @from(Ln 5898, Col 4)
EC
// @from(Ln 5898, Col 8)
B86
// @from(Ln 5898, Col 13)
cD6
// @from(Ln 5898, Col 18)
Up6
// @from(Ln 5898, Col 23)
hw8
// @from(Ln 5898, Col 28)
Qp6
// @from(Ln 5898, Col 33)
dp6
// @from(Ln 5898, Col 38)
Rw8
// @from(Ln 5898, Col 43)
cp6
// @from(Ln 5898, Col 48)
Qi
// @from(Ln 5898, Col 52)
lp6
// @from(Ln 5898, Col 57)
Sw8
// @from(Ln 5898, Col 62)
Cw8
// @from(Ln 5898, Col 67)
NY6
// @from(Ln 5898, Col 72)
bw8
// @from(Ln 5898, Col 77)
Iw8
// @from(Ln 5898, Col 82)
np6
// @from(Ln 5898, Col 87)
n11
// @from(Ln 5898, Col 92)
nG7
// @from(Ln 5898, Col 97)
i11
// @from(Ln 5898, Col 102)
r11
// @from(Ln 5898, Col 107)
o11
// @from(Ln 5898, Col 112)
a11
// @from(Ln 5898, Col 117)
iG7
// @from(Ln 5898, Col 122)
rG7 = "__json_buf"
// @from(Ln 5899, Col 4)
ip6
// @from(Ln 5900, Col 4)
sG7 = L(() => {
    mi();
    Fi();
    Gw8();
    R11();
    l11();
    ip6 = class ip6 {
        constructor(q, K) {
            EC.add(this), this.messages = [], this.receivedMessages = [], B86.set(this, void 0), cD6.set(this, null), this.controller = new AbortController, Up6.set(this, void 0), hw8.set(this, () => {}), Qp6.set(this, () => {}), dp6.set(this, void 0), Rw8.set(this, () => {}), cp6.set(this, () => {}), Qi.set(this, {}), lp6.set(this, !1), Sw8.set(this, !1), Cw8.set(this, !1), NY6.set(this, !1), bw8.set(this, void 0), Iw8.set(this, void 0), np6.set(this, void 0), i11.set(this, (_) => {
                if (N4(this, Sw8, !0, "f"), Bi(_)) _ = new r_;
                if (_ instanceof r_) return N4(this, Cw8, !0, "f"), this._emit("abort", _);
                if (_ instanceof bq) return this._emit("error", _);
                if (_ instanceof Error) {
                    let z = new bq(_.message);
                    return z.cause = _, this._emit("error", z)
                }
                return this._emit("error", new bq(String(_)))
            }), N4(this, Up6, new Promise((_, z) => {
                N4(this, hw8, _, "f"), N4(this, Qp6, z, "f")
            }), "f"), N4(this, dp6, new Promise((_, z) => {
                N4(this, Rw8, _, "f"), N4(this, cp6, z, "f")
            }), "f"), U1(this, Up6, "f").catch(() => {}), U1(this, dp6, "f").catch(() => {}), N4(this, cD6, q, "f"), N4(this, np6, K?.logger ?? console, "f")
        }
        get response() {
            return U1(this, bw8, "f")
        }
        get request_id() {
            return U1(this, Iw8, "f")
        }
        async withResponse() {
            N4(this, NY6, !0, "f");
            let q = await U1(this, Up6, "f");
            if (!q) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: q,
                request_id: q.headers.get("request-id")
            }
        }
        static fromReadableStream(q) {
            let K = new ip6(null);
            return K._run(() => K._fromReadableStream(q)), K
        }
        static createMessage(q, K, _, {
            logger: z
        } = {}) {
            let Y = new ip6(K, {
                logger: z
            });
            for (let A of K.messages) Y._addMessageParam(A);
            return N4(Y, cD6, {
                ...K,
                stream: !0
            }, "f"), Y._run(() => Y._createMessage(q, {
                ...K,
                stream: !0
            }, {
                ..._,
                headers: {
                    ..._?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), Y
        }
        _run(q) {
            q().then(() => {
                this._emitFinal(), this._emit("end")
            }, U1(this, i11, "f"))
        }
        _addMessageParam(q) {
            this.messages.push(q)
        }
        _addMessage(q, K = !0) {
            if (this.receivedMessages.push(q), K) this._emit("message", q)
        }
        async _createMessage(q, K, _) {
            let z = _?.signal,
                Y;
            if (z) {
                if (z.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), z.addEventListener("abort", Y)
            }
            try {
                U1(this, EC, "m", r11).call(this);
                let {
                    response: A,
                    data: O
                } = await q.create({
                    ...K,
                    stream: !0
                }, {
                    ..._,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(A);
                for await (let w of O) U1(this, EC, "m", o11).call(this, w);
                if (O.controller.signal?.aborted) throw new r_;
                U1(this, EC, "m", a11).call(this)
            } finally {
                if (z && Y) z.removeEventListener("abort", Y)
            }
        }
        _connected(q) {
            if (this.ended) return;
            N4(this, bw8, q, "f"), N4(this, Iw8, q?.headers.get("request-id"), "f"), U1(this, hw8, "f").call(this, q), this._emit("connect")
        }
        get ended() {
            return U1(this, lp6, "f")
        }
        get errored() {
            return U1(this, Sw8, "f")
        }
        get aborted() {
            return U1(this, Cw8, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(q, K) {
            return (U1(this, Qi, "f")[q] || (U1(this, Qi, "f")[q] = [])).push({
                listener: K
            }), this
        }
        off(q, K) {
            let _ = U1(this, Qi, "f")[q];
            if (!_) return this;
            let z = _.findIndex((Y) => Y.listener === K);
            if (z >= 0) _.splice(z, 1);
            return this
        }
        once(q, K) {
            return (U1(this, Qi, "f")[q] || (U1(this, Qi, "f")[q] = [])).push({
                listener: K,
                once: !0
            }), this
        }
        emitted(q) {
            return new Promise((K, _) => {
                if (N4(this, NY6, !0, "f"), q !== "error") this.once("error", _);
                this.once(q, K)
            })
        }
        async done() {
            N4(this, NY6, !0, "f"), await U1(this, dp6, "f")
        }
        get currentMessage() {
            return U1(this, B86, "f")
        }
        async finalMessage() {
            return await this.done(), U1(this, EC, "m", n11).call(this)
        }
        async finalText() {
            return await this.done(), U1(this, EC, "m", nG7).call(this)
        }
        _emit(q, ...K) {
            if (U1(this, lp6, "f")) return;
            if (q === "end") N4(this, lp6, !0, "f"), U1(this, Rw8, "f").call(this);
            let _ = U1(this, Qi, "f")[q];
            if (_) U1(this, Qi, "f")[q] = _.filter((z) => !z.once), _.forEach(({
                listener: z
            }) => z(...K));
            if (q === "abort") {
                let z = K[0];
                if (!U1(this, NY6, "f") && !_?.length) Promise.reject(z);
                U1(this, Qp6, "f").call(this, z), U1(this, cp6, "f").call(this, z), this._emit("end");
                return
            }
            if (q === "error") {
                let z = K[0];
                if (!U1(this, NY6, "f") && !_?.length) Promise.reject(z);
                U1(this, Qp6, "f").call(this, z), U1(this, cp6, "f").call(this, z), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", U1(this, EC, "m", n11).call(this))
        }
        async _fromReadableStream(q, K) {
            let _ = K?.signal,
                z;
            if (_) {
                if (_.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), _.addEventListener("abort", z)
            }
            try {
                U1(this, EC, "m", r11).call(this), this._connected(null);
                let Y = $V.fromReadableStream(q, this.controller);
                for await (let A of Y) U1(this, EC, "m", o11).call(this, A);
                if (Y.controller.signal?.aborted) throw new r_;
                U1(this, EC, "m", a11).call(this)
            } finally {
                if (_ && z) _.removeEventListener("abort", z)
            }
        } [(B86 = new WeakMap, cD6 = new WeakMap, Up6 = new WeakMap, hw8 = new WeakMap, Qp6 = new WeakMap, dp6 = new WeakMap, Rw8 = new WeakMap, cp6 = new WeakMap, Qi = new WeakMap, lp6 = new WeakMap, Sw8 = new WeakMap, Cw8 = new WeakMap, NY6 = new WeakMap, bw8 = new WeakMap, Iw8 = new WeakMap, np6 = new WeakMap, i11 = new WeakMap, EC = new WeakSet, n11 = function() {
            if (this.receivedMessages.length === 0) throw new bq("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, nG7 = function() {
            if (this.receivedMessages.length === 0) throw new bq("stream ended without producing a Message with role=assistant");
            let K = this.receivedMessages.at(-1).content.filter((_) => _.type === "text").map((_) => _.text);
            if (K.length === 0) throw new bq("stream ended without producing a content block with type=text");
            return K.join(" ")
        }, r11 = function() {
            if (this.ended) return;
            N4(this, B86, void 0, "f")
        }, o11 = function(K) {
            if (this.ended) return;
            let _ = U1(this, EC, "m", iG7).call(this, K);
            switch (this._emit("streamEvent", K, _), K.type) {
                case "content_block_delta": {
                    let z = _.content.at(-1);
                    switch (K.delta.type) {
                        case "text_delta": {
                            if (z.type === "text") this._emit("text", K.delta.text, z.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (z.type === "text") this._emit("citation", K.delta.citation, z.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (oG7(z) && z.input) this._emit("inputJson", K.delta.partial_json, z.input);
                            break
                        }
                        case "thinking_delta": {
                            if (z.type === "thinking") this._emit("thinking", K.delta.thinking, z.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (z.type === "thinking") this._emit("signature", z.signature);
                            break
                        }
                        default:
                            aG7(K.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(_), this._addMessage(d11(_, U1(this, cD6, "f"), {
                        logger: U1(this, np6, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", _.content.at(-1));
                    break
                }
                case "message_start": {
                    N4(this, B86, _, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, a11 = function() {
            if (this.ended) throw new bq("stream has ended, this shouldn't happen");
            let K = U1(this, B86, "f");
            if (!K) throw new bq("request ended without sending any chunks");
            return N4(this, B86, void 0, "f"), d11(K, U1(this, cD6, "f"), {
                logger: U1(this, np6, "f")
            })
        }, iG7 = function(K) {
            let _ = U1(this, B86, "f");
            if (K.type === "message_start") {
                if (_) throw new bq(`Unexpected event order, got ${K.type} before receiving "message_stop"`);
                return K.message
            }
            if (!_) throw new bq(`Unexpected event order, got ${K.type} before "message_start"`);
            switch (K.type) {
                case "message_stop":
                    return _;
                case "message_delta":
                    if (_.stop_reason = K.delta.stop_reason, _.stop_sequence = K.delta.stop_sequence, _.usage.output_tokens = K.usage.output_tokens, K.usage.input_tokens != null) _.usage.input_tokens = K.usage.input_tokens;
                    if (K.usage.cache_creation_input_tokens != null) _.usage.cache_creation_input_tokens = K.usage.cache_creation_input_tokens;
                    if (K.usage.cache_read_input_tokens != null) _.usage.cache_read_input_tokens = K.usage.cache_read_input_tokens;
                    if (K.usage.server_tool_use != null) _.usage.server_tool_use = K.usage.server_tool_use;
                    return _;
                case "content_block_start":
                    return _.content.push({
                        ...K.content_block
                    }), _;
                case "content_block_delta": {
                    let z = _.content.at(K.index);
                    switch (K.delta.type) {
                        case "text_delta": {
                            if (z?.type === "text") _.content[K.index] = {
                                ...z,
                                text: (z.text || "") + K.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (z?.type === "text") _.content[K.index] = {
                                ...z,
                                citations: [...z.citations ?? [], K.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (z && oG7(z)) {
                                let Y = z[rG7] || "";
                                Y += K.delta.partial_json;
                                let A = {
                                    ...z
                                };
                                if (Object.defineProperty(A, rG7, {
                                        value: Y,
                                        enumerable: !1,
                                        writable: !0
                                    }), Y) A.input = fw8(Y);
                                _.content[K.index] = A
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (z?.type === "thinking") _.content[K.index] = {
                                ...z,
                                thinking: z.thinking + K.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (z?.type === "thinking") _.content[K.index] = {
                                ...z,
                                signature: K.delta.signature
                            };
                            break
                        }
                        default:
                            aG7(K.delta)
                    }
                    return _
                }
                case "content_block_stop":
                    return _
            }
        }, Symbol.asyncIterator)]() {
            let q = [],
                K = [],
                _ = !1;
            return this.on("streamEvent", (z) => {
                let Y = K.shift();
                if (Y) Y.resolve(z);
                else q.push(z)
            }), this.on("end", () => {
                _ = !0;
                for (let z of K) z.resolve(void 0);
                K.length = 0
            }), this.on("abort", (z) => {
                _ = !0;
                for (let Y of K) Y.reject(z);
                K.length = 0
            }), this.on("error", (z) => {
                _ = !0;
                for (let Y of K) Y.reject(z);
                K.length = 0
            }), {
                next: async () => {
                    if (!q.length) {
                        if (_) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((Y, A) => K.push({
                            resolve: Y,
                            reject: A
                        })).then((Y) => Y ? {
                            value: Y,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: q.shift(),
                        done: !1
                    }
                },
                return: async () => {
                    return this.abort(), {
                        value: void 0,
                        done: !0
                    }
                }
            }
        }
        toReadableStream() {
            return new $V(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 6291, Col 4)
rp6
// @from(Ln 6292, Col 4)
s11 = L(() => {
    ig();
    tL();
    m11();
    Fi();
    b86();
    rp6 = class rp6 extends iH {
        create(q, K) {
            return this._client.post("/v1/messages/batches", {
                body: q,
                ...K
            })
        }
        retrieve(q, K) {
            return this._client.get(Qj`/v1/messages/batches/${q}`, K)
        }
        list(q = {}, K) {
            return this._client.getAPIList("/v1/messages/batches", zm, {
                query: q,
                ...K
            })
        }
        delete(q, K) {
            return this._client.delete(Qj`/v1/messages/batches/${q}`, K)
        }
        cancel(q, K) {
            return this._client.post(Qj`/v1/messages/batches/${q}/cancel`, K)
        }
        async results(q, K) {
            let _ = await this.retrieve(q);
            if (!_.results_url) throw new bq(`No batch \`results_url\`; Has it finished processing? ${_.processing_status} - ${_.id}`);
            return this._client.get(_.results_url, {
                ...K,
                headers: r3([{
                    Accept: "application/binary"
                }, K?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((z, Y) => QD6.fromResponse(Y.response, Y.controller))
        }
    }
})
// @from(Ln 6334, Col 4)
jV
// @from(Ln 6334, Col 8)
tG7
// @from(Ln 6334, Col 13)
Cf5
// @from(Ln 6335, Col 4)
t11 = L(() => {
    tL();
    Ep6();
    sG7();
    l11();
    s11();
    s11();
    E11();
    jV = class jV extends iH {
        constructor() {
            super(...arguments);
            this.batches = new rp6(this._client)
        }
        create(q, K) {
            if (q.model in tG7) console.warn(`The model '${q.model}' is deprecated and will reach end-of-life on ${tG7[q.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (q.model in Cf5 && q.thinking && q.thinking.type === "enabled") console.warn(`Using Claude with ${q.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let _ = this._client._options.timeout;
            if (!q.stream && _ == null) {
                let Y = Zw8[q.model] ?? void 0;
                _ = this._client.calculateNonstreamingTimeout(q.max_tokens, Y)
            }
            let z = Dw8(q.tools, q.messages);
            return this._client.post("/v1/messages", {
                body: q,
                timeout: _ ?? 600000,
                ...K,
                headers: r3([z, K?.headers]),
                stream: q.stream ?? !1
            })
        }
        parse(q, K) {
            return this.create(q, K).then((_) => c11(_, q, {
                logger: this._client.logger ?? console
            }))
        }
        stream(q, K) {
            return ip6.createMessage(this, q, K, {
                logger: this._client.logger ?? console
            })
        }
        countTokens(q, K) {
            return this._client.post("/v1/messages/count_tokens", {
                body: q,
                ...K
            })
        }
    };
    tG7 = {
        "claude-1.3": "November 6th, 2024",
        "claude-1.3-100k": "November 6th, 2024",
        "claude-instant-1.1": "November 6th, 2024",
        "claude-instant-1.1-100k": "November 6th, 2024",
        "claude-instant-1.2": "November 6th, 2024",
        "claude-3-sonnet-20240229": "July 21st, 2025",
        "claude-3-opus-20240229": "January 5th, 2026",
        "claude-2.1": "July 21st, 2025",
        "claude-2.0": "July 21st, 2025",
        "claude-3-7-sonnet-latest": "February 19th, 2026",
        "claude-3-7-sonnet-20250219": "February 19th, 2026",
        "claude-3-5-haiku-latest": "February 19th, 2026",
        "claude-3-5-haiku-20241022": "February 19th, 2026"
    }, Cf5 = ["claude-opus-4-6"];
    jV.Batches = rp6
})
// @from(Ln 6400, Col 4)
lD6
// @from(Ln 6401, Col 4)
e11 = L(() => {
    ig();
    tL();
    b86();
    lD6 = class lD6 extends iH {
        retrieve(q, K = {}, _) {
            let {
                betas: z
            } = K ?? {};
            return this._client.get(Qj`/v1/models/${q}`, {
                ..._,
                headers: r3([{
                    ...z?.toString() != null ? {
                        "anthropic-beta": z?.toString()
                    } : void 0
                }, _?.headers])
            })
        }
        list(q = {}, K) {
            let {
                betas: _,
                ...z
            } = q ?? {};
            return this._client.getAPIList("/v1/models", zm, {
                query: z,
                ...K,
                headers: r3([{
                    ..._?.toString() != null ? {
                        "anthropic-beta": _?.toString()
                    } : void 0
                }, K?.headers])
            })
        }
    }
})
// @from(Ln 6436, Col 4)
nD6 = L(() => {
    U11();
    Q11();
    t11();
    e11();
    LG7()
})
// @from(Ln 6443, Col 4)
ap6 = (q) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[q]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(q)?.trim();
    return
}