
// @from(Ln 113977, Col 0)
async function e76(A, q, K) {
    if (_AA(), A = await A, q || (q = Ky1(A, !0)), GX5(A)) {
        if (A instanceof File && q == null && K == null) return A;
        return m81([await A.arrayBuffer()], q ?? A.name, {
            type: A.type,
            lastModified: A.lastModified,
            ...K
        })
    }
    if (ZX5(A)) {
        let z = await A.blob();
        return q || (q = new URL(A.url).pathname.split(/[\\/]/).pop()), m81(await XAA(z), q, K)
    }
    let Y = await XAA(A);
    if (!K?.type) {
        let z = Y.find((w) => typeof w === "object" && ("type" in w) && w.type);
        if (typeof z === "string") K = {
            ...K,
            type: z
        }
    }
    return m81(Y, q, K)
}
// @from(Ln 114000, Col 0)
async function XAA(A) {
    let q = [];
    if (typeof A === "string" || ArrayBuffer.isView(A) || A instanceof ArrayBuffer) q.push(A);
    else if (rr8(A)) q.push(A instanceof Blob ? A : await A.arrayBuffer());
    else if (JAA(A))
        for await (let K of A) q.push(...await XAA(K));
    else {
        let K = A?.constructor?.name;
        throw Error(`Unexpected data type: ${typeof A}${K?`; constructor: ${K}`:""}${fX5(A)}`)
    }
    return q
}
// @from(Ln 114013, Col 0)
function fX5(A) {
    if (typeof A !== "object" || A === null) return "";
    return `; props: [${Object.getOwnPropertyNames(A).map((K)=>`"${K}"`).join(", ")}]`
}
// @from(Ln 114017, Col 4)
rr8 = (A) => A != null && typeof A === "object" && typeof A.size === "number" && typeof A.type === "string" && typeof A.text === "function" && typeof A.slice === "function" && typeof A.arrayBuffer === "function"
// @from(Ln 114018, Col 4)
GX5 = (A) => A != null && typeof A === "object" && typeof A.name === "string" && typeof A.lastModified === "number" && rr8(A)
// @from(Ln 114019, Col 4)
ZX5 = (A) => A != null && typeof A === "object" && typeof A.url === "string" && typeof A.blob === "function"
// @from(Ln 114020, Col 4)
or8 = v(() => {
    UO1();
    UO1()
})
// @from(Ln 114024, Col 4)
DAA = v(() => {
    or8()
})
// @from(Ln 114027, Col 4)
ar8 = () => {}
// @from(Ln 114028, Col 0)
class SO {
    constructor(A) {
        this._client = A
    }
}
// @from(Ln 114034, Col 0)
function* NX5(A) {
    if (!A) return;
    if (sr8 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let w of z) yield [w, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (t6A(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let w = t6A(Y[1]) ? Y[1] : [Y[1]],
            H = !1;
        for (let $ of w) {
            if ($ === void 0) continue;
            if (q && !H) H = !0, yield [z, null];
            yield [z, $]
        }
    }
}
// @from(Ln 114062, Col 4)
sr8
// @from(Ln 114062, Col 9)
M3 = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [w, H] of NX5(Y)) {
            let $ = w.toLowerCase();
            if (!z.has($)) q.delete(w), z.add($);
            if (H === null) q.delete(w), K.add($);
            else q.append(w, H), K.delete($)
        }
    }
    return {
        [sr8]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 114080, Col 4)
rT = v(() => {
    u81();
    sr8 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 114085, Col 0)
function A46(A) {
    return typeof A === "object" && A !== null && Yy1 in A
}
// @from(Ln 114089, Col 0)
function jAA(A, q) {
    let K = new Set;
    if (A) {
        for (let Y of A)
            if (A46(Y)) K.add(Y[Yy1])
    }
    if (q)
        for (let Y of q) {
            if (A46(Y)) K.add(Y[Yy1]);
            if (Array.isArray(Y.content)) {
                for (let z of Y.content)
                    if (A46(z)) K.add(z[Yy1])
            }
        }
    return Array.from(K)
}
// @from(Ln 114106, Col 0)
function q46(A, q) {
    let K = jAA(A, q);
    if (K.length === 0) return {};
    return {
        "x-stainless-helper": K.join(", ")
    }
}
// @from(Ln 114114, Col 0)
function tr8(A) {
    if (A46(A)) return {
        "x-stainless-helper": A[Yy1]
    };
    return {}
}
// @from(Ln 114120, Col 4)
Yy1
// @from(Ln 114121, Col 4)
zy1 = v(() => {
    Yy1 = Symbol("anthropic.sdk.stainlessHelper")
})
// @from(Ln 114125, Col 0)
function Ao8(A) {
    return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 114128, Col 4)
er8
// @from(Ln 114128, Col 9)
TX5 = (A = Ao8) => function(K, ...Y) {
        if (K.length === 1) return K[0];
        let z = !1,
            w = [],
            H = K.reduce((J, X, D) => {
                if (/[?#]/.test(X)) z = !0;
                let j = Y[D],
                    M = (z ? encodeURIComponent : A)("" + j);
                if (D !== Y.length && (j == null || typeof j === "object" && j.toString === Object.getPrototypeOf(Object.getPrototypeOf(j.hasOwnProperty ?? er8) ?? er8)?.toString)) M = j + "", w.push({
                    start: J.length + X.length,
                    length: M.length,
                    error: `Value of type ${Object.prototype.toString.call(j).slice(8,-1)} is not a valid path parameter`
                });
                return J + X + (D === Y.length ? "" : M)
            }, ""),
            $ = H.split(/[?#]/, 1)[0],
            O = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            _;
        while ((_ = O.exec($)) !== null) w.push({
            start: _.index,
            length: _[0].length,
            error: `Value "${_[0]}" can't be safely passed as a path parameter`
        });
        if (w.sort((J, X) => J.start - X.start), w.length > 0) {
            let J = 0,
                X = w.reduce((D, j) => {
                    let M = " ".repeat(j.start - J),
                        P = "^".repeat(j.length);
                    return J = j.start + j.length, D + M + P
                }, "");
            throw new r7(`Path parameters result in path with invalid segments:
${w.map((D)=>D.error).join(`
`)}
${H}
${X}`)
        }
        return H
    }
// @from(Ln 114166, Col 4)
I$
// @from(Ln 114167, Col 4)
pn = v(() => {
    _W();
    er8 = Object.freeze(Object.create(null)), I$ = TX5(Ao8)
})
// @from(Ln 114171, Col 4)
wy1
// @from(Ln 114172, Col 4)
MAA = v(() => {
    qu();
    rT();
    zy1();
    UO1();
    pn();
    wy1 = class wy1 extends SO {
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/files", rC, {
                query: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "files-api-2025-04-14"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(I$`/v1/files/${A}`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "files-api-2025-04-14"].toString()
                }, K?.headers])
            })
        }
        download(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/files/${A}/content`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "files-api-2025-04-14"].toString(),
                    Accept: "application/binary"
                }, K?.headers]),
                __binaryResponse: !0
            })
        }
        retrieveMetadata(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/files/${A}`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "files-api-2025-04-14"].toString()
                }, K?.headers])
            })
        }
        upload(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/files", gO1({
                body: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "files-api-2025-04-14"].toString()
                }, tr8(Y.file), q?.headers])
            }, this._client))
        }
    }
})
// @from(Ln 114242, Col 4)
Hy1
// @from(Ln 114243, Col 4)
PAA = v(() => {
    qu();
    rT();
    pn();
    Hy1 = class Hy1 extends SO {
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/models/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    ...Y?.toString() != null ? {
                        "anthropic-beta": Y?.toString()
                    } : void 0
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/models?beta=true", rC, {
                query: Y,
                ...q,
                headers: M3([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers])
            })
        }
    }
})
// @from(Ln 114278, Col 4)
dn = v(() => {
    _W()
})
// @from(Ln 114281, Col 4)
K46
// @from(Ln 114282, Col 4)
WAA = v(() => {
    K46 = {
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
// @from(Ln 114295, Col 0)
function qo8(A) {
    return A?.output_format ?? A?.output_config?.format
}
// @from(Ln 114299, Col 0)
function GAA(A, q, K) {
    let Y = qo8(q);
    if (!q || !("parse" in (Y ?? {}))) return {
        ...A,
        content: A.content.map((z) => {
            if (z.type === "text") {
                let w = Object.defineProperty({
                    ...z
                }, "parsed_output", {
                    value: null,
                    enumerable: !1
                });
                return Object.defineProperty(w, "parsed", {
                    get() {
                        return K.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null
                    },
                    enumerable: !1
                })
            }
            return z
        }),
        parsed_output: null
    };
    return ZAA(A, q, K)
}
// @from(Ln 114325, Col 0)
function ZAA(A, q, K) {
    let Y = null,
        z = A.content.map((w) => {
            if (w.type === "text") {
                let H = kX5(q, w.text);
                if (Y === null) Y = H;
                let $ = Object.defineProperty({
                    ...w
                }, "parsed_output", {
                    value: H,
                    enumerable: !1
                });
                return Object.defineProperty($, "parsed", {
                    get() {
                        return K.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), H
                    },
                    enumerable: !1
                })
            }
            return w
        });
    return {
        ...A,
        content: z,
        parsed_output: Y
    }
}
// @from(Ln 114353, Col 0)
function kX5(A, q) {
    let K = qo8(A);
    if (K?.type !== "json_schema") return null;
    try {
        if ("parse" in K) return K.parse(q);
        return JSON.parse(q)
    } catch (Y) {
        throw new r7(`Failed to parse structured output: ${Y}`)
    }
}
// @from(Ln 114363, Col 4)
fAA = v(() => {
    _W()
})
// @from(Ln 114366, Col 4)
LX5 = (A) => {
        let q = 0,
            K = [];
        while (q < A.length) {
            let Y = A[q];
            if (Y === "\\") {
                q++;
                continue
            }
            if (Y === "{") {
                K.push({
                    type: "brace",
                    value: "{"
                }), q++;
                continue
            }
            if (Y === "}") {
                K.push({
                    type: "brace",
                    value: "}"
                }), q++;
                continue
            }
            if (Y === "[") {
                K.push({
                    type: "paren",
                    value: "["
                }), q++;
                continue
            }
            if (Y === "]") {
                K.push({
                    type: "paren",
                    value: "]"
                }), q++;
                continue
            }
            if (Y === ":") {
                K.push({
                    type: "separator",
                    value: ":"
                }), q++;
                continue
            }
            if (Y === ",") {
                K.push({
                    type: "delimiter",
                    value: ","
                }), q++;
                continue
            }
            if (Y === '"') {
                let $ = "",
                    O = !1;
                Y = A[++q];
                while (Y !== '"') {
                    if (q === A.length) {
                        O = !0;
                        break
                    }
                    if (Y === "\\") {
                        if (q++, q === A.length) {
                            O = !0;
                            break
                        }
                        $ += Y + A[q], Y = A[++q]
                    } else $ += Y, Y = A[++q]
                }
                if (Y = A[++q], !O) K.push({
                    type: "string",
                    value: $
                });
                continue
            }
            if (Y && /\s/.test(Y)) {
                q++;
                continue
            }
            let w = /[0-9]/;
            if (Y && w.test(Y) || Y === "-" || Y === ".") {
                let $ = "";
                if (Y === "-") $ += Y, Y = A[++q];
                while (Y && w.test(Y) || Y === ".") $ += Y, Y = A[++q];
                K.push({
                    type: "number",
                    value: $
                });
                continue
            }
            let H = /[a-z]/i;
            if (Y && H.test(Y)) {
                let $ = "";
                while (Y && H.test(Y)) {
                    if (q === A.length) break;
                    $ += Y, Y = A[++q]
                }
                if ($ == "true" || $ == "false" || $ === "null") K.push({
                    type: "name",
                    value: $
                });
                else {
                    q++;
                    continue
                }
                continue
            }
            q++
        }
        return K
    }
// @from(Ln 114476, Col 4)
pO1 = (A) => {
        if (A.length === 0) return A;
        let q = A[A.length - 1];
        switch (q.type) {
            case "separator":
                return A = A.slice(0, A.length - 1), pO1(A);
                break;
            case "number":
                let K = q.value[q.value.length - 1];
                if (K === "." || K === "-") return A = A.slice(0, A.length - 1), pO1(A);
            case "string":
                let Y = A[A.length - 2];
                if (Y?.type === "delimiter") return A = A.slice(0, A.length - 1), pO1(A);
                else if (Y?.type === "brace" && Y.value === "{") return A = A.slice(0, A.length - 1), pO1(A);
                break;
            case "delimiter":
                return A = A.slice(0, A.length - 1), pO1(A);
                break
        }
        return A
    }
// @from(Ln 114497, Col 4)
RX5 = (A) => {
        let q = [];
        if (A.map((K) => {
                if (K.type === "brace")
                    if (K.value === "{") q.push("}");
                    else q.splice(q.lastIndexOf("}"), 1);
                if (K.type === "paren")
                    if (K.value === "[") q.push("]");
                    else q.splice(q.lastIndexOf("]"), 1)
            }), q.length > 0) q.reverse().map((K) => {
            if (K === "}") A.push({
                type: "brace",
                value: "}"
            });
            else if (K === "]") A.push({
                type: "paren",
                value: "]"
            })
        });
        return A
    }
// @from(Ln 114518, Col 4)
yX5 = (A) => {
        let q = "";
        return A.map((K) => {
            switch (K.type) {
                case "string":
                    q += '"' + K.value + '"';
                    break;
                default:
                    q += K.value;
                    break
            }
        }), q
    }
// @from(Ln 114531, Col 4)
Y46 = (A) => JSON.parse(yX5(RX5(pO1(LX5(A)))))
// @from(Ln 114532, Col 4)
VAA = () => {}
// @from(Ln 114533, Col 4)
z46 = v(() => {
    zAA()
})
// @from(Ln 114537, Col 0)
function wo8(A) {
    return A.type === "tool_use" || A.type === "server_tool_use" || A.type === "mcp_tool_use"
}
// @from(Ln 114541, Col 0)
function Ho8(A) {}
// @from(Ln 114542, Col 4)
YL
// @from(Ln 114542, Col 8)
cn
// @from(Ln 114542, Col 12)
dO1
// @from(Ln 114542, Col 17)
$y1
// @from(Ln 114542, Col 22)
w46
// @from(Ln 114542, Col 27)
Oy1
// @from(Ln 114542, Col 32)
_y1
// @from(Ln 114542, Col 37)
H46
// @from(Ln 114542, Col 42)
Jy1
// @from(Ln 114542, Col 47)
Sg
// @from(Ln 114542, Col 51)
Xy1
// @from(Ln 114542, Col 56)
$46
// @from(Ln 114542, Col 61)
O46
// @from(Ln 114542, Col 66)
F81
// @from(Ln 114542, Col 71)
_46
// @from(Ln 114542, Col 76)
J46
// @from(Ln 114542, Col 81)
Dy1
// @from(Ln 114542, Col 86)
NAA
// @from(Ln 114542, Col 91)
Ko8
// @from(Ln 114542, Col 96)
X46
// @from(Ln 114542, Col 101)
TAA
// @from(Ln 114542, Col 106)
vAA
// @from(Ln 114542, Col 111)
EAA
// @from(Ln 114542, Col 116)
Yo8
// @from(Ln 114542, Col 121)
zo8 = "__json_buf"
// @from(Ln 114543, Col 4)
jy1
// @from(Ln 114544, Col 4)
$o8 = v(() => {
    Rg();
    VAA();
    dn();
    z46();
    fAA();
    jy1 = class jy1 {
        constructor(A, q) {
            YL.add(this), this.messages = [], this.receivedMessages = [], cn.set(this, void 0), dO1.set(this, null), this.controller = new AbortController, $y1.set(this, void 0), w46.set(this, () => {}), Oy1.set(this, () => {}), _y1.set(this, void 0), H46.set(this, () => {}), Jy1.set(this, () => {}), Sg.set(this, {}), Xy1.set(this, !1), $46.set(this, !1), O46.set(this, !1), F81.set(this, !1), _46.set(this, void 0), J46.set(this, void 0), Dy1.set(this, void 0), X46.set(this, (K) => {
                if (n7(this, $46, !0, "f"), yg(K)) K = new Oz;
                if (K instanceof Oz) return n7(this, O46, !0, "f"), this._emit("abort", K);
                if (K instanceof r7) return this._emit("error", K);
                if (K instanceof Error) {
                    let Y = new r7(K.message);
                    return Y.cause = K, this._emit("error", Y)
                }
                return this._emit("error", new r7(String(K)))
            }), n7(this, $y1, new Promise((K, Y) => {
                n7(this, w46, K, "f"), n7(this, Oy1, Y, "f")
            }), "f"), n7(this, _y1, new Promise((K, Y) => {
                n7(this, H46, K, "f"), n7(this, Jy1, Y, "f")
            }), "f"), ZA(this, $y1, "f").catch(() => {}), ZA(this, _y1, "f").catch(() => {}), n7(this, dO1, A, "f"), n7(this, Dy1, q?.logger ?? console, "f")
        }
        get response() {
            return ZA(this, _46, "f")
        }
        get request_id() {
            return ZA(this, J46, "f")
        }
        async withResponse() {
            n7(this, F81, !0, "f");
            let A = await ZA(this, $y1, "f");
            if (!A) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: A,
                request_id: A.headers.get("request-id")
            }
        }
        static fromReadableStream(A) {
            let q = new jy1(null);
            return q._run(() => q._fromReadableStream(A)), q
        }
        static createMessage(A, q, K, {
            logger: Y
        } = {}) {
            let z = new jy1(q, {
                logger: Y
            });
            for (let w of q.messages) z._addMessageParam(w);
            return n7(z, dO1, {
                ...q,
                stream: !0
            }, "f"), z._run(() => z._createMessage(A, {
                ...q,
                stream: !0
            }, {
                ...K,
                headers: {
                    ...K?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), z
        }
        _run(A) {
            A().then(() => {
                this._emitFinal(), this._emit("end")
            }, ZA(this, X46, "f"))
        }
        _addMessageParam(A) {
            this.messages.push(A)
        }
        _addMessage(A, q = !0) {
            if (this.receivedMessages.push(A), q) this._emit("message", A)
        }
        async _createMessage(A, q, K) {
            let Y = K?.signal,
                z;
            if (Y) {
                if (Y.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), Y.addEventListener("abort", z)
            }
            try {
                ZA(this, YL, "m", TAA).call(this);
                let {
                    response: w,
                    data: H
                } = await A.create({
                    ...q,
                    stream: !0
                }, {
                    ...K,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(w);
                for await (let $ of H) ZA(this, YL, "m", vAA).call(this, $);
                if (H.controller.signal?.aborted) throw new Oz;
                ZA(this, YL, "m", EAA).call(this)
            } finally {
                if (Y && z) Y.removeEventListener("abort", z)
            }
        }
        _connected(A) {
            if (this.ended) return;
            n7(this, _46, A, "f"), n7(this, J46, A?.headers.get("request-id"), "f"), ZA(this, w46, "f").call(this, A), this._emit("connect")
        }
        get ended() {
            return ZA(this, Xy1, "f")
        }
        get errored() {
            return ZA(this, $46, "f")
        }
        get aborted() {
            return ZA(this, O46, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(A, q) {
            return (ZA(this, Sg, "f")[A] || (ZA(this, Sg, "f")[A] = [])).push({
                listener: q
            }), this
        }
        off(A, q) {
            let K = ZA(this, Sg, "f")[A];
            if (!K) return this;
            let Y = K.findIndex((z) => z.listener === q);
            if (Y >= 0) K.splice(Y, 1);
            return this
        }
        once(A, q) {
            return (ZA(this, Sg, "f")[A] || (ZA(this, Sg, "f")[A] = [])).push({
                listener: q,
                once: !0
            }), this
        }
        emitted(A) {
            return new Promise((q, K) => {
                if (n7(this, F81, !0, "f"), A !== "error") this.once("error", K);
                this.once(A, q)
            })
        }
        async done() {
            n7(this, F81, !0, "f"), await ZA(this, _y1, "f")
        }
        get currentMessage() {
            return ZA(this, cn, "f")
        }
        async finalMessage() {
            return await this.done(), ZA(this, YL, "m", NAA).call(this)
        }
        async finalText() {
            return await this.done(), ZA(this, YL, "m", Ko8).call(this)
        }
        _emit(A, ...q) {
            if (ZA(this, Xy1, "f")) return;
            if (A === "end") n7(this, Xy1, !0, "f"), ZA(this, H46, "f").call(this);
            let K = ZA(this, Sg, "f")[A];
            if (K) ZA(this, Sg, "f")[A] = K.filter((Y) => !Y.once), K.forEach(({
                listener: Y
            }) => Y(...q));
            if (A === "abort") {
                let Y = q[0];
                if (!ZA(this, F81, "f") && !K?.length) Promise.reject(Y);
                ZA(this, Oy1, "f").call(this, Y), ZA(this, Jy1, "f").call(this, Y), this._emit("end");
                return
            }
            if (A === "error") {
                let Y = q[0];
                if (!ZA(this, F81, "f") && !K?.length) Promise.reject(Y);
                ZA(this, Oy1, "f").call(this, Y), ZA(this, Jy1, "f").call(this, Y), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", ZA(this, YL, "m", NAA).call(this))
        }
        async _fromReadableStream(A, q) {
            let K = q?.signal,
                Y;
            if (K) {
                if (K.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), K.addEventListener("abort", Y)
            }
            try {
                ZA(this, YL, "m", TAA).call(this), this._connected(null);
                let z = pG.fromReadableStream(A, this.controller);
                for await (let w of z) ZA(this, YL, "m", vAA).call(this, w);
                if (z.controller.signal?.aborted) throw new Oz;
                ZA(this, YL, "m", EAA).call(this)
            } finally {
                if (K && Y) K.removeEventListener("abort", Y)
            }
        } [(cn = new WeakMap, dO1 = new WeakMap, $y1 = new WeakMap, w46 = new WeakMap, Oy1 = new WeakMap, _y1 = new WeakMap, H46 = new WeakMap, Jy1 = new WeakMap, Sg = new WeakMap, Xy1 = new WeakMap, $46 = new WeakMap, O46 = new WeakMap, F81 = new WeakMap, _46 = new WeakMap, J46 = new WeakMap, Dy1 = new WeakMap, X46 = new WeakMap, YL = new WeakSet, NAA = function() {
            if (this.receivedMessages.length === 0) throw new r7("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, Ko8 = function() {
            if (this.receivedMessages.length === 0) throw new r7("stream ended without producing a Message with role=assistant");
            let q = this.receivedMessages.at(-1).content.filter((K) => K.type === "text").map((K) => K.text);
            if (q.length === 0) throw new r7("stream ended without producing a content block with type=text");
            return q.join(" ")
        }, TAA = function() {
            if (this.ended) return;
            n7(this, cn, void 0, "f")
        }, vAA = function(q) {
            if (this.ended) return;
            let K = ZA(this, YL, "m", Yo8).call(this, q);
            switch (this._emit("streamEvent", q, K), q.type) {
                case "content_block_delta": {
                    let Y = K.content.at(-1);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y.type === "text") this._emit("text", q.delta.text, Y.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (Y.type === "text") this._emit("citation", q.delta.citation, Y.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (wo8(Y) && Y.input) this._emit("inputJson", q.delta.partial_json, Y.input);
                            break
                        }
                        case "thinking_delta": {
                            if (Y.type === "thinking") this._emit("thinking", q.delta.thinking, Y.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (Y.type === "thinking") this._emit("signature", Y.signature);
                            break
                        }
                        case "compaction_delta": {
                            if (Y.type === "compaction" && Y.content) this._emit("compaction", Y.content);
                            break
                        }
                        default:
                            Ho8(q.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(K), this._addMessage(GAA(K, ZA(this, dO1, "f"), {
                        logger: ZA(this, Dy1, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", K.content.at(-1));
                    break
                }
                case "message_start": {
                    n7(this, cn, K, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, EAA = function() {
            if (this.ended) throw new r7("stream has ended, this shouldn't happen");
            let q = ZA(this, cn, "f");
            if (!q) throw new r7("request ended without sending any chunks");
            return n7(this, cn, void 0, "f"), GAA(q, ZA(this, dO1, "f"), {
                logger: ZA(this, Dy1, "f")
            })
        }, Yo8 = function(q) {
            let K = ZA(this, cn, "f");
            if (q.type === "message_start") {
                if (K) throw new r7(`Unexpected event order, got ${q.type} before receiving "message_stop"`);
                return q.message
            }
            if (!K) throw new r7(`Unexpected event order, got ${q.type} before "message_start"`);
            switch (q.type) {
                case "message_stop":
                    return K;
                case "message_delta":
                    if (K.container = q.delta.container, K.stop_reason = q.delta.stop_reason, K.stop_sequence = q.delta.stop_sequence, K.usage.output_tokens = q.usage.output_tokens, K.context_management = q.context_management, q.usage.input_tokens != null) K.usage.input_tokens = q.usage.input_tokens;
                    if (q.usage.cache_creation_input_tokens != null) K.usage.cache_creation_input_tokens = q.usage.cache_creation_input_tokens;
                    if (q.usage.cache_read_input_tokens != null) K.usage.cache_read_input_tokens = q.usage.cache_read_input_tokens;
                    if (q.usage.server_tool_use != null) K.usage.server_tool_use = q.usage.server_tool_use;
                    if (q.usage.iterations != null) K.usage.iterations = q.usage.iterations;
                    return K;
                case "content_block_start":
                    return K.content.push(q.content_block), K;
                case "content_block_delta": {
                    let Y = K.content.at(q.index);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                text: (Y.text || "") + q.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                citations: [...Y.citations ?? [], q.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (Y && wo8(Y)) {
                                let z = Y[zo8] || "";
                                z += q.delta.partial_json;
                                let w = {
                                    ...Y
                                };
                                if (Object.defineProperty(w, zo8, {
                                        value: z,
                                        enumerable: !1,
                                        writable: !0
                                    }), z) try {
                                    w.input = Y46(z)
                                } catch (H) {
                                    let $ = new r7(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${H}. JSON: ${z}`);
                                    ZA(this, X46, "f").call(this, $)
                                }
                                K.content[q.index] = w
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                thinking: Y.thinking + q.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                signature: q.delta.signature
                            };
                            break
                        }
                        case "compaction_delta": {
                            if (Y?.type === "compaction") K.content[q.index] = {
                                ...Y,
                                content: (Y.content || "") + q.delta.content
                            };
                            break
                        }
                        default:
                            Ho8(q.delta)
                    }
                    return K
                }
                case "content_block_stop":
                    return K
            }
        }, Symbol.asyncIterator)]() {
            let A = [],
                q = [],
                K = !1;
            return this.on("streamEvent", (Y) => {
                let z = q.shift();
                if (z) z.resolve(Y);
                else A.push(Y)
            }), this.on("end", () => {
                K = !0;
                for (let Y of q) Y.resolve(void 0);
                q.length = 0
            }), this.on("abort", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), this.on("error", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), {
                next: async () => {
                    if (!A.length) {
                        if (K) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((z, w) => q.push({
                            resolve: z,
                            reject: w
                        })).then((z) => z ? {
                            value: z,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: A.shift(),
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
            return new pG(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 114950, Col 4)
cO1
// @from(Ln 114951, Col 4)
D46 = v(() => {
    cO1 = class cO1 extends Error {
        constructor(A) {
            let q = typeof A === "string" ? A : A.map((K) => {
                if (K.type === "text") return K.text;
                return `[${K.type}]`
            }).join(" ");
            super(q);
            this.name = "ToolError", this.content = A
        }
    }
})
// @from(Ln 114963, Col 4)
Oo8 = 1e5
// @from(Ln 114964, Col 4)
_o8 = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
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
// @from(Ln 114988, Col 0)
function Xo8() {
    let A, q;
    return {
        promise: new Promise((Y, z) => {
            A = Y, q = z
        }),
        resolve: A,
        reject: q
    }
}
// @from(Ln 114998, Col 0)
async function CX5(A, q = A.messages.at(-1)) {
    if (!q || q.role !== "assistant" || !q.content || typeof q.content === "string") return null;
    let K = q.content.filter((z) => z.type === "tool_use");
    if (K.length === 0) return null;
    return {
        role: "user",
        content: await Promise.all(K.map(async (z) => {
            let w = A.tools.find((H) => ("name" in H ? H.name : H.mcp_server_name) === z.name);
            if (!w || !("run" in w)) return {
                type: "tool_result",
                tool_use_id: z.id,
                content: `Error: Tool '${z.name}' not found`,
                is_error: !0
            };
            try {
                let H = z.input;
                if ("parse" in w && w.parse) H = w.parse(H);
                let $ = await w.run(H);
                return {
                    type: "tool_result",
                    tool_use_id: z.id,
                    content: $
                }
            } catch (H) {
                return {
                    type: "tool_result",
                    tool_use_id: z.id,
                    content: H instanceof cO1 ? H.content : `Error: ${H instanceof Error?H.message:String(H)}`,
                    is_error: !0
                }
            }
        }))
    }
}
// @from(Ln 115032, Col 4)
My1
// @from(Ln 115032, Col 9)
lO1
// @from(Ln 115032, Col 14)
Q81
// @from(Ln 115032, Col 19)
CD
// @from(Ln 115032, Col 23)
Py1
// @from(Ln 115032, Col 28)
oT
// @from(Ln 115032, Col 32)
hg
// @from(Ln 115032, Col 36)
ln
// @from(Ln 115032, Col 40)
Wy1
// @from(Ln 115032, Col 45)
Jo8
// @from(Ln 115032, Col 50)
kAA
// @from(Ln 115032, Col 55)
Gy1
// @from(Ln 115033, Col 4)
LAA = v(() => {
    Rg();
    D46();
    _W();
    rT();
    zy1();
    Gy1 = class Gy1 {
        constructor(A, q, K) {
            My1.add(this), this.client = A, lO1.set(this, !1), Q81.set(this, !1), CD.set(this, void 0), Py1.set(this, void 0), oT.set(this, void 0), hg.set(this, void 0), ln.set(this, void 0), Wy1.set(this, 0), n7(this, CD, {
                params: {
                    ...q,
                    messages: structuredClone(q.messages)
                }
            }, "f");
            let z = ["BetaToolRunner", ...jAA(q.tools, q.messages)].join(", ");
            n7(this, Py1, {
                ...K,
                headers: M3([{
                    "x-stainless-helper": z
                }, K?.headers])
            }, "f"), n7(this, ln, Xo8(), "f")
        }
        async * [(lO1 = new WeakMap, Q81 = new WeakMap, CD = new WeakMap, Py1 = new WeakMap, oT = new WeakMap, hg = new WeakMap, ln = new WeakMap, Wy1 = new WeakMap, My1 = new WeakSet, Jo8 = async function() {
            let q = ZA(this, CD, "f").params.compactionControl;
            if (!q || !q.enabled) return !1;
            let K = 0;
            if (ZA(this, oT, "f") !== void 0) try {
                let O = await ZA(this, oT, "f");
                K = O.usage.input_tokens + (O.usage.cache_creation_input_tokens ?? 0) + (O.usage.cache_read_input_tokens ?? 0) + O.usage.output_tokens
            } catch {
                return !1
            }
            let Y = q.contextTokenThreshold ?? Oo8;
            if (K < Y) return !1;
            let z = q.model ?? ZA(this, CD, "f").params.model,
                w = q.summaryPrompt ?? _o8,
                H = ZA(this, CD, "f").params.messages;
            if (H[H.length - 1].role === "assistant") {
                let O = H[H.length - 1];
                if (Array.isArray(O.content)) {
                    let _ = O.content.filter((J) => J.type !== "tool_use");
                    if (_.length === 0) H.pop();
                    else O.content = _
                }
            }
            let $ = await this.client.beta.messages.create({
                model: z,
                messages: [...H, {
                    role: "user",
                    content: [{
                        type: "text",
                        text: w
                    }]
                }],
                max_tokens: ZA(this, CD, "f").params.max_tokens
            }, {
                headers: {
                    "x-stainless-helper": "compaction"
                }
            });
            if ($.content[0]?.type !== "text") throw new r7("Expected text response for compaction");
            return ZA(this, CD, "f").params.messages = [{
                role: "user",
                content: $.content
            }], !0
        }, Symbol.asyncIterator)]() {
            var A;
            if (ZA(this, lO1, "f")) throw new r7("Cannot iterate over a consumed stream");
            n7(this, lO1, !0, "f"), n7(this, Q81, !0, "f"), n7(this, hg, void 0, "f");
            try {
                while (!0) {
                    let q;
                    try {
                        if (ZA(this, CD, "f").params.max_iterations && ZA(this, Wy1, "f") >= ZA(this, CD, "f").params.max_iterations) break;
                        n7(this, Q81, !1, "f"), n7(this, hg, void 0, "f"), n7(this, Wy1, (A = ZA(this, Wy1, "f"), A++, A), "f"), n7(this, oT, void 0, "f");
                        let {
                            max_iterations: K,
                            compactionControl: Y,
                            ...z
                        } = ZA(this, CD, "f").params;
                        if (z.stream) q = this.client.beta.messages.stream({
                            ...z
                        }, ZA(this, Py1, "f")), n7(this, oT, q.finalMessage(), "f"), ZA(this, oT, "f").catch(() => {}), yield q;
                        else n7(this, oT, this.client.beta.messages.create({
                            ...z,
                            stream: !1
                        }, ZA(this, Py1, "f")), "f"), yield ZA(this, oT, "f");
                        if (!await ZA(this, My1, "m", Jo8).call(this)) {
                            if (!ZA(this, Q81, "f")) {
                                let {
                                    role: $,
                                    content: O
                                } = await ZA(this, oT, "f");
                                ZA(this, CD, "f").params.messages.push({
                                    role: $,
                                    content: O
                                })
                            }
                            let H = await ZA(this, My1, "m", kAA).call(this, ZA(this, CD, "f").params.messages.at(-1));
                            if (H) ZA(this, CD, "f").params.messages.push(H);
                            else if (!ZA(this, Q81, "f")) break
                        }
                    } finally {
                        if (q) q.abort()
                    }
                }
                if (!ZA(this, oT, "f")) throw new r7("ToolRunner concluded without a message from the server");
                ZA(this, ln, "f").resolve(await ZA(this, oT, "f"))
            } catch (q) {
                throw n7(this, lO1, !1, "f"), ZA(this, ln, "f").promise.catch(() => {}), ZA(this, ln, "f").reject(q), n7(this, ln, Xo8(), "f"), q
            }
        }
        setMessagesParams(A) {
            if (typeof A === "function") ZA(this, CD, "f").params = A(ZA(this, CD, "f").params);
            else ZA(this, CD, "f").params = A;
            n7(this, Q81, !0, "f"), n7(this, hg, void 0, "f")
        }
        async generateToolResponse() {
            let A = await ZA(this, oT, "f") ?? this.params.messages.at(-1);
            if (!A) return null;
            return ZA(this, My1, "m", kAA).call(this, A)
        }
        done() {
            return ZA(this, ln, "f").promise
        }
        async runUntilDone() {
            if (!ZA(this, lO1, "f"))
                for await (let A of this);
            return this.done()
        }
        get params() {
            return ZA(this, CD, "f").params
        }
        pushMessages(...A) {
            this.setMessagesParams((q) => ({
                ...q,
                messages: [...q.messages, ...A]
            }))
        }
        then(A, q) {
            return this.runUntilDone().then(A, q)
        }
    };
    kAA = async function(q) {
        if (ZA(this, hg, "f") !== void 0) return ZA(this, hg, "f");
        return n7(this, hg, CX5(ZA(this, CD, "f").params, q), "f"), ZA(this, hg, "f")
    }
})
// @from(Ln 115181, Col 4)
iO1
// @from(Ln 115182, Col 4)
RAA = v(() => {
    _W();
    KAA();
    iO1 = class iO1 {
        constructor(A, q) {
            this.iterator = A, this.controller = q
        }
        async * decoder() {
            let A = new Un;
            for await (let q of this.iterator) for (let K of A.decode(q)) yield JSON.parse(K);
            for (let q of A.flush()) yield JSON.parse(q)
        } [Symbol.asyncIterator]() {
            return this.decoder()
        }
        static fromResponse(A, q) {
            if (!A.body) {
                if (q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new r7("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
                throw new r7("Attempted to iterate over a response with no body")
            }
            return new iO1(aR1(A.body), q)
        }
    }
})
// @from(Ln 115205, Col 4)
Zy1
// @from(Ln 115206, Col 4)
yAA = v(() => {
    qu();
    rT();
    RAA();
    dn();
    pn();
    Zy1 = class Zy1 extends SO {
        create(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/messages/batches?beta=true", {
                body: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "message-batches-2024-09-24"].toString()
                }, q?.headers])
            })
        }
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/messages/batches/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/messages/batches?beta=true", rC, {
                query: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "message-batches-2024-09-24"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(I$`/v1/messages/batches/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        cancel(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.post(I$`/v1/messages/batches/${A}/cancel?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        async results(A, q = {}, K) {
            let Y = await this.retrieve(A);
            if (!Y.results_url) throw new r7(`No batch \`results_url\`; Has it finished processing? ${Y.processing_status} - ${Y.id}`);
            let {
                betas: z
            } = q ?? {};
            return this._client.get(Y.results_url, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...z ?? [], "message-batches-2024-09-24"].toString(),
                    Accept: "application/binary"
                }, K?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((w, H) => iO1.fromResponse(H.response, H.controller))
        }
    }
})
// @from(Ln 115291, Col 0)
function jo8(A) {
    if (!A.output_format) return A;
    if (A.output_config?.format) throw new r7("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
    let {
        output_format: q,
        ...K
    } = A;
    return {
        ...K,
        output_config: {
            ...A.output_config,
            format: q
        }
    }
}
// @from(Ln 115306, Col 4)
Do8
// @from(Ln 115306, Col 9)
hX5
// @from(Ln 115306, Col 14)
nn
// @from(Ln 115307, Col 4)
CAA = v(() => {
    dn();
    WAA();
    rT();
    zy1();
    fAA();
    $o8();
    LAA();
    D46();
    yAA();
    yAA();
    LAA();
    D46();
    Do8 = {
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
    }, hX5 = ["claude-opus-4-6"];
    nn = class nn extends SO {
        constructor() {
            super(...arguments);
            this.batches = new Zy1(this._client)
        }
        create(A, q) {
            let K = jo8(A),
                {
                    betas: Y,
                    ...z
                } = K;
            if (z.model in Do8) console.warn(`The model '${z.model}' is deprecated and will reach end-of-life on ${Do8[z.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (z.model in hX5 && z.thinking && z.thinking.type === "enabled") console.warn(`Using Claude with ${z.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let w = this._client._options.timeout;
            if (!z.stream && w == null) {
                let $ = K46[z.model] ?? void 0;
                w = this._client.calculateNonstreamingTimeout(z.max_tokens, $)
            }
            let H = q46(z.tools, z.messages);
            return this._client.post("/v1/messages?beta=true", {
                body: z,
                timeout: w ?? 600000,
                ...q,
                headers: M3([{
                    ...Y?.toString() != null ? {
                        "anthropic-beta": Y?.toString()
                    } : void 0
                }, H, q?.headers]),
                stream: K.stream ?? !1
            })
        }
        parse(A, q) {
            return q = {
                ...q,
                headers: M3([{
                    "anthropic-beta": [...A.betas ?? [], "structured-outputs-2025-12-15"].toString()
                }, q?.headers])
            }, this.create(A, q).then((K) => ZAA(K, A, {
                logger: this._client.logger ?? console
            }))
        }
        stream(A, q) {
            return jy1.createMessage(this, A, q)
        }
        countTokens(A, q) {
            let K = jo8(A),
                {
                    betas: Y,
                    ...z
                } = K;
            return this._client.post("/v1/messages/count_tokens?beta=true", {
                body: z,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "token-counting-2024-11-01"].toString()
                }, q?.headers])
            })
        }
        toolRunner(A, q) {
            return new Gy1(this._client, A, q)
        }
    };
    nn.Batches = Zy1;
    nn.BetaToolRunner = Gy1;
    nn.ToolError = cO1
})
// @from(Ln 115400, Col 4)
fy1
// @from(Ln 115401, Col 4)
SAA = v(() => {
    qu();
    rT();
    UO1();
    pn();
    fy1 = class fy1 extends SO {
        create(A, q = {}, K) {
            let {
                betas: Y,
                ...z
            } = q ?? {};
            return this._client.post(I$`/v1/skills/${A}/versions?beta=true`, gO1({
                body: z,
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            }, this._client))
        }
        retrieve(A, q, K) {
            let {
                skill_id: Y,
                betas: z
            } = q;
            return this._client.get(I$`/v1/skills/${Y}/versions/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        list(A, q = {}, K) {
            let {
                betas: Y,
                ...z
            } = q ?? {};
            return this._client.getAPIList(I$`/v1/skills/${A}/versions?beta=true`, qy1, {
                query: z,
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        delete(A, q, K) {
            let {
                skill_id: Y,
                betas: z
            } = q;
            return this._client.delete(I$`/v1/skills/${Y}/versions/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
    }
})
// @from(Ln 115459, Col 4)
nO1
// @from(Ln 115460, Col 4)
hAA = v(() => {
    SAA();
    SAA();
    qu();
    rT();
    UO1();
    pn();
    nO1 = class nO1 extends SO {
        constructor() {
            super(...arguments);
            this.versions = new fy1(this._client)
        }
        create(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.post("/v1/skills?beta=true", gO1({
                body: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "skills-2025-10-02"].toString()
                }, q?.headers])
            }, this._client, !1))
        }
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/skills/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/skills?beta=true", qy1, {
                query: Y,
                ...q,
                headers: M3([{
                    "anthropic-beta": [...K ?? [], "skills-2025-10-02"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(I$`/v1/skills/${A}?beta=true`, {
                ...K,
                headers: M3([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
    };
    nO1.Versions = fy1
})
// @from(Ln 115523, Col 4)
JW
// @from(Ln 115524, Col 4)
IAA = v(() => {
    MAA();
    MAA();
    PAA();
    PAA();
    CAA();
    CAA();
    hAA();
    hAA();
    JW = class JW extends SO {
        constructor() {
            super(...arguments);
            this.models = new Hy1(this._client), this.messages = new nn(this._client), this.files = new wy1(this._client), this.skills = new nO1(this._client)
        }
    };
    JW.Models = Hy1;
    JW.Messages = nn;
    JW.Files = wy1;
    JW.Skills = nO1
})
// @from(Ln 115544, Col 4)
rn
// @from(Ln 115545, Col 4)
xAA = v(() => {
    rT();
    rn = class rn extends SO {
        create(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/complete", {
                body: Y,
                timeout: this._client._options.timeout ?? 600000,
                ...q,
                headers: M3([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers]),
                stream: A.stream ?? !1
            })
        }
    }
})
// @from(Ln 115568, Col 0)
function Mo8(A) {
    return A?.output_config?.format
}
// @from(Ln 115572, Col 0)
function bAA(A, q, K) {
    let Y = Mo8(q);
    if (!q || !("parse" in (Y ?? {}))) return {
        ...A,
        content: A.content.map((z) => {
            if (z.type === "text") return Object.defineProperty({
                ...z
            }, "parsed_output", {
                value: null,
                enumerable: !1
            });
            return z
        }),
        parsed_output: null
    };
    return uAA(A, q, K)
}
// @from(Ln 115590, Col 0)
function uAA(A, q, K) {
    let Y = null,
        z = A.content.map((w) => {
            if (w.type === "text") {
                let H = uX5(q, w.text);
                if (Y === null) Y = H;
                return Object.defineProperty({
                    ...w
                }, "parsed_output", {
                    value: H,
                    enumerable: !1
                })
            }
            return w
        });
    return {
        ...A,
        content: z,
        parsed_output: Y
    }
}
// @from(Ln 115612, Col 0)
function uX5(A, q) {
    let K = Mo8(A);
    if (K?.type !== "json_schema") return null;
    try {
        if ("parse" in K) return K.parse(q);
        return JSON.parse(q)
    } catch (Y) {
        throw new r7(`Failed to parse structured output: ${Y}`)
    }
}
// @from(Ln 115622, Col 4)
BAA = v(() => {
    _W()
})
// @from(Ln 115626, Col 0)
function Zo8(A) {
    return A.type === "tool_use" || A.type === "server_tool_use"
}
// @from(Ln 115630, Col 0)
function fo8(A) {}
// @from(Ln 115631, Col 4)
zL
// @from(Ln 115631, Col 8)
on
// @from(Ln 115631, Col 12)
rO1
// @from(Ln 115631, Col 17)
Vy1
// @from(Ln 115631, Col 22)
j46
// @from(Ln 115631, Col 27)
Ny1
// @from(Ln 115631, Col 32)
Ty1
// @from(Ln 115631, Col 37)
M46
// @from(Ln 115631, Col 42)
vy1
// @from(Ln 115631, Col 47)
Ig
// @from(Ln 115631, Col 51)
Ey1
// @from(Ln 115631, Col 56)
P46
// @from(Ln 115631, Col 61)
W46
// @from(Ln 115631, Col 66)
g81
// @from(Ln 115631, Col 71)
G46
// @from(Ln 115631, Col 76)
Z46
// @from(Ln 115631, Col 81)
ky1
// @from(Ln 115631, Col 86)
mAA
// @from(Ln 115631, Col 91)
Po8
// @from(Ln 115631, Col 96)
FAA
// @from(Ln 115631, Col 101)
QAA
// @from(Ln 115631, Col 106)
gAA
// @from(Ln 115631, Col 111)
UAA
// @from(Ln 115631, Col 116)
Wo8
// @from(Ln 115631, Col 121)
Go8 = "__json_buf"
// @from(Ln 115632, Col 4)
Ly1
// @from(Ln 115633, Col 4)
Vo8 = v(() => {
    Rg();
    dn();
    z46();
    VAA();
    BAA();
    Ly1 = class Ly1 {
        constructor(A, q) {
            zL.add(this), this.messages = [], this.receivedMessages = [], on.set(this, void 0), rO1.set(this, null), this.controller = new AbortController, Vy1.set(this, void 0), j46.set(this, () => {}), Ny1.set(this, () => {}), Ty1.set(this, void 0), M46.set(this, () => {}), vy1.set(this, () => {}), Ig.set(this, {}), Ey1.set(this, !1), P46.set(this, !1), W46.set(this, !1), g81.set(this, !1), G46.set(this, void 0), Z46.set(this, void 0), ky1.set(this, void 0), FAA.set(this, (K) => {
                if (n7(this, P46, !0, "f"), yg(K)) K = new Oz;
                if (K instanceof Oz) return n7(this, W46, !0, "f"), this._emit("abort", K);
                if (K instanceof r7) return this._emit("error", K);
                if (K instanceof Error) {
                    let Y = new r7(K.message);
                    return Y.cause = K, this._emit("error", Y)
                }
                return this._emit("error", new r7(String(K)))
            }), n7(this, Vy1, new Promise((K, Y) => {
                n7(this, j46, K, "f"), n7(this, Ny1, Y, "f")
            }), "f"), n7(this, Ty1, new Promise((K, Y) => {
                n7(this, M46, K, "f"), n7(this, vy1, Y, "f")
            }), "f"), ZA(this, Vy1, "f").catch(() => {}), ZA(this, Ty1, "f").catch(() => {}), n7(this, rO1, A, "f"), n7(this, ky1, q?.logger ?? console, "f")
        }
        get response() {
            return ZA(this, G46, "f")
        }
        get request_id() {
            return ZA(this, Z46, "f")
        }
        async withResponse() {
            n7(this, g81, !0, "f");
            let A = await ZA(this, Vy1, "f");
            if (!A) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: A,
                request_id: A.headers.get("request-id")
            }
        }
        static fromReadableStream(A) {
            let q = new Ly1(null);
            return q._run(() => q._fromReadableStream(A)), q
        }
        static createMessage(A, q, K, {
            logger: Y
        } = {}) {
            let z = new Ly1(q, {
                logger: Y
            });
            for (let w of q.messages) z._addMessageParam(w);
            return n7(z, rO1, {
                ...q,
                stream: !0
            }, "f"), z._run(() => z._createMessage(A, {
                ...q,
                stream: !0
            }, {
                ...K,
                headers: {
                    ...K?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), z
        }
        _run(A) {
            A().then(() => {
                this._emitFinal(), this._emit("end")
            }, ZA(this, FAA, "f"))
        }
        _addMessageParam(A) {
            this.messages.push(A)
        }
        _addMessage(A, q = !0) {
            if (this.receivedMessages.push(A), q) this._emit("message", A)
        }
        async _createMessage(A, q, K) {
            let Y = K?.signal,
                z;
            if (Y) {
                if (Y.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), Y.addEventListener("abort", z)
            }
            try {
                ZA(this, zL, "m", QAA).call(this);
                let {
                    response: w,
                    data: H
                } = await A.create({
                    ...q,
                    stream: !0
                }, {
                    ...K,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(w);
                for await (let $ of H) ZA(this, zL, "m", gAA).call(this, $);
                if (H.controller.signal?.aborted) throw new Oz;
                ZA(this, zL, "m", UAA).call(this)
            } finally {
                if (Y && z) Y.removeEventListener("abort", z)
            }
        }
        _connected(A) {
            if (this.ended) return;
            n7(this, G46, A, "f"), n7(this, Z46, A?.headers.get("request-id"), "f"), ZA(this, j46, "f").call(this, A), this._emit("connect")
        }
        get ended() {
            return ZA(this, Ey1, "f")
        }
        get errored() {
            return ZA(this, P46, "f")
        }
        get aborted() {
            return ZA(this, W46, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(A, q) {
            return (ZA(this, Ig, "f")[A] || (ZA(this, Ig, "f")[A] = [])).push({
                listener: q
            }), this
        }
        off(A, q) {
            let K = ZA(this, Ig, "f")[A];
            if (!K) return this;
            let Y = K.findIndex((z) => z.listener === q);
            if (Y >= 0) K.splice(Y, 1);
            return this
        }
        once(A, q) {
            return (ZA(this, Ig, "f")[A] || (ZA(this, Ig, "f")[A] = [])).push({
                listener: q,
                once: !0
            }), this
        }
        emitted(A) {
            return new Promise((q, K) => {
                if (n7(this, g81, !0, "f"), A !== "error") this.once("error", K);
                this.once(A, q)
            })
        }
        async done() {
            n7(this, g81, !0, "f"), await ZA(this, Ty1, "f")
        }
        get currentMessage() {
            return ZA(this, on, "f")
        }
        async finalMessage() {
            return await this.done(), ZA(this, zL, "m", mAA).call(this)
        }
        async finalText() {
            return await this.done(), ZA(this, zL, "m", Po8).call(this)
        }
        _emit(A, ...q) {
            if (ZA(this, Ey1, "f")) return;
            if (A === "end") n7(this, Ey1, !0, "f"), ZA(this, M46, "f").call(this);
            let K = ZA(this, Ig, "f")[A];
            if (K) ZA(this, Ig, "f")[A] = K.filter((Y) => !Y.once), K.forEach(({
                listener: Y
            }) => Y(...q));
            if (A === "abort") {
                let Y = q[0];
                if (!ZA(this, g81, "f") && !K?.length) Promise.reject(Y);
                ZA(this, Ny1, "f").call(this, Y), ZA(this, vy1, "f").call(this, Y), this._emit("end");
                return
            }
            if (A === "error") {
                let Y = q[0];
                if (!ZA(this, g81, "f") && !K?.length) Promise.reject(Y);
                ZA(this, Ny1, "f").call(this, Y), ZA(this, vy1, "f").call(this, Y), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", ZA(this, zL, "m", mAA).call(this))
        }
        async _fromReadableStream(A, q) {
            let K = q?.signal,
                Y;
            if (K) {
                if (K.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), K.addEventListener("abort", Y)
            }
            try {
                ZA(this, zL, "m", QAA).call(this), this._connected(null);
                let z = pG.fromReadableStream(A, this.controller);
                for await (let w of z) ZA(this, zL, "m", gAA).call(this, w);
                if (z.controller.signal?.aborted) throw new Oz;
                ZA(this, zL, "m", UAA).call(this)
            } finally {
                if (K && Y) K.removeEventListener("abort", Y)
            }
        } [(on = new WeakMap, rO1 = new WeakMap, Vy1 = new WeakMap, j46 = new WeakMap, Ny1 = new WeakMap, Ty1 = new WeakMap, M46 = new WeakMap, vy1 = new WeakMap, Ig = new WeakMap, Ey1 = new WeakMap, P46 = new WeakMap, W46 = new WeakMap, g81 = new WeakMap, G46 = new WeakMap, Z46 = new WeakMap, ky1 = new WeakMap, FAA = new WeakMap, zL = new WeakSet, mAA = function() {
            if (this.receivedMessages.length === 0) throw new r7("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, Po8 = function() {
            if (this.receivedMessages.length === 0) throw new r7("stream ended without producing a Message with role=assistant");
            let q = this.receivedMessages.at(-1).content.filter((K) => K.type === "text").map((K) => K.text);
            if (q.length === 0) throw new r7("stream ended without producing a content block with type=text");
            return q.join(" ")
        }, QAA = function() {
            if (this.ended) return;
            n7(this, on, void 0, "f")
        }, gAA = function(q) {
            if (this.ended) return;
            let K = ZA(this, zL, "m", Wo8).call(this, q);
            switch (this._emit("streamEvent", q, K), q.type) {
                case "content_block_delta": {
                    let Y = K.content.at(-1);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y.type === "text") this._emit("text", q.delta.text, Y.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (Y.type === "text") this._emit("citation", q.delta.citation, Y.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (Zo8(Y) && Y.input) this._emit("inputJson", q.delta.partial_json, Y.input);
                            break
                        }
                        case "thinking_delta": {
                            if (Y.type === "thinking") this._emit("thinking", q.delta.thinking, Y.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (Y.type === "thinking") this._emit("signature", Y.signature);
                            break
                        }
                        default:
                            fo8(q.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(K), this._addMessage(bAA(K, ZA(this, rO1, "f"), {
                        logger: ZA(this, ky1, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", K.content.at(-1));
                    break
                }
                case "message_start": {
                    n7(this, on, K, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, UAA = function() {
            if (this.ended) throw new r7("stream has ended, this shouldn't happen");
            let q = ZA(this, on, "f");
            if (!q) throw new r7("request ended without sending any chunks");
            return n7(this, on, void 0, "f"), bAA(q, ZA(this, rO1, "f"), {
                logger: ZA(this, ky1, "f")
            })
        }, Wo8 = function(q) {
            let K = ZA(this, on, "f");
            if (q.type === "message_start") {
                if (K) throw new r7(`Unexpected event order, got ${q.type} before receiving "message_stop"`);
                return q.message
            }
            if (!K) throw new r7(`Unexpected event order, got ${q.type} before "message_start"`);
            switch (q.type) {
                case "message_stop":
                    return K;
                case "message_delta":
                    if (K.stop_reason = q.delta.stop_reason, K.stop_sequence = q.delta.stop_sequence, K.usage.output_tokens = q.usage.output_tokens, q.usage.input_tokens != null) K.usage.input_tokens = q.usage.input_tokens;
                    if (q.usage.cache_creation_input_tokens != null) K.usage.cache_creation_input_tokens = q.usage.cache_creation_input_tokens;
                    if (q.usage.cache_read_input_tokens != null) K.usage.cache_read_input_tokens = q.usage.cache_read_input_tokens;
                    if (q.usage.server_tool_use != null) K.usage.server_tool_use = q.usage.server_tool_use;
                    return K;
                case "content_block_start":
                    return K.content.push({
                        ...q.content_block
                    }), K;
                case "content_block_delta": {
                    let Y = K.content.at(q.index);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                text: (Y.text || "") + q.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                citations: [...Y.citations ?? [], q.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (Y && Zo8(Y)) {
                                let z = Y[Go8] || "";
                                z += q.delta.partial_json;
                                let w = {
                                    ...Y
                                };
                                if (Object.defineProperty(w, Go8, {
                                        value: z,
                                        enumerable: !1,
                                        writable: !0
                                    }), z) w.input = Y46(z);
                                K.content[q.index] = w
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                thinking: Y.thinking + q.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                signature: q.delta.signature
                            };
                            break
                        }
                        default:
                            fo8(q.delta)
                    }
                    return K
                }
                case "content_block_stop":
                    return K
            }
        }, Symbol.asyncIterator)]() {
            let A = [],
                q = [],
                K = !1;
            return this.on("streamEvent", (Y) => {
                let z = q.shift();
                if (z) z.resolve(Y);
                else A.push(Y)
            }), this.on("end", () => {
                K = !0;
                for (let Y of q) Y.resolve(void 0);
                q.length = 0
            }), this.on("abort", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), this.on("error", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), {
                next: async () => {
                    if (!A.length) {
                        if (K) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((z, w) => q.push({
                            resolve: z,
                            reject: w
                        })).then((z) => z ? {
                            value: z,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: A.shift(),
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
            return new pG(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 116024, Col 4)
Ry1
// @from(Ln 116025, Col 4)
pAA = v(() => {
    qu();
    rT();
    RAA();
    dn();
    pn();
    Ry1 = class Ry1 extends SO {
        create(A, q) {
            return this._client.post("/v1/messages/batches", {
                body: A,
                ...q
            })
        }
        retrieve(A, q) {
            return this._client.get(I$`/v1/messages/batches/${A}`, q)
        }
        list(A = {}, q) {
            return this._client.getAPIList("/v1/messages/batches", rC, {
                query: A,
                ...q
            })
        }
        delete(A, q) {
            return this._client.delete(I$`/v1/messages/batches/${A}`, q)
        }
        cancel(A, q) {
            return this._client.post(I$`/v1/messages/batches/${A}/cancel`, q)
        }
        async results(A, q) {
            let K = await this.retrieve(A);
            if (!K.results_url) throw new r7(`No batch \`results_url\`; Has it finished processing? ${K.processing_status} - ${K.id}`);
            return this._client.get(K.results_url, {
                ...q,
                headers: M3([{
                    Accept: "application/binary"
                }, q?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((Y, z) => iO1.fromResponse(z.response, z.controller))
        }
    }
})
// @from(Ln 116067, Col 4)
aT
// @from(Ln 116067, Col 8)
No8
// @from(Ln 116067, Col 13)
mX5
// @from(Ln 116068, Col 4)
dAA = v(() => {
    rT();
    zy1();
    Vo8();
    BAA();
    pAA();
    pAA();
    WAA();
    aT = class aT extends SO {
        constructor() {
            super(...arguments);
            this.batches = new Ry1(this._client)
        }
        create(A, q) {
            if (A.model in No8) console.warn(`The model '${A.model}' is deprecated and will reach end-of-life on ${No8[A.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (A.model in mX5 && A.thinking && A.thinking.type === "enabled") console.warn(`Using Claude with ${A.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let K = this._client._options.timeout;
            if (!A.stream && K == null) {
                let z = K46[A.model] ?? void 0;
                K = this._client.calculateNonstreamingTimeout(A.max_tokens, z)
            }
            let Y = q46(A.tools, A.messages);
            return this._client.post("/v1/messages", {
                body: A,
                timeout: K ?? 600000,
                ...q,
                headers: M3([Y, q?.headers]),
                stream: A.stream ?? !1
            })
        }
        parse(A, q) {
            return this.create(A, q).then((K) => uAA(K, A, {
                logger: this._client.logger ?? console
            }))
        }
        stream(A, q) {
            return Ly1.createMessage(this, A, q, {
                logger: this._client.logger ?? console
            })
        }
        countTokens(A, q) {
            return this._client.post("/v1/messages/count_tokens", {
                body: A,
                ...q
            })
        }
    };
    No8 = {
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
    }, mX5 = ["claude-opus-4-6"];
    aT.Batches = Ry1
})
// @from(Ln 116133, Col 4)
oO1
// @from(Ln 116134, Col 4)
cAA = v(() => {
    qu();
    rT();
    pn();
    oO1 = class oO1 extends SO {
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(I$`/v1/models/${A}`, {
                ...K,
                headers: M3([{
                    ...Y?.toString() != null ? {
                        "anthropic-beta": Y?.toString()
                    } : void 0
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/models", rC, {
                query: Y,
                ...q,
                headers: M3([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers])
            })
        }
    }
})
// @from(Ln 116169, Col 4)
yy1 = v(() => {
    IAA();
    xAA();
    dAA();
    cAA();
    ar8()
})
// @from(Ln 116176, Col 4)
Cy1 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 116181, Col 0)
class _z {
    constructor({
        baseURL: A = Cy1("ANTHROPIC_BASE_URL"),
        apiKey: q = Cy1("ANTHROPIC_API_KEY") ?? null,
        authToken: K = Cy1("ANTHROPIC_AUTH_TOKEN") ?? null,
        ...Y
    } = {}) {
        lAA.add(this), V46.set(this, void 0);
        let z = {
            apiKey: q,
            authToken: K,
            ...Y,
            baseURL: A || "https://api.anthropic.com"
        };
        if (!z.dangerouslyAllowBrowser && Br8()) throw new r7(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
        this.baseURL = z.baseURL, this.timeout = z.timeout ?? iAA.DEFAULT_TIMEOUT, this.logger = z.logger ?? console;
        let w = "warn";
        this.logLevel = w, this.logLevel = YAA(z.logLevel, "ClientOptions.logLevel", this) ?? YAA(Cy1("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? w, this.fetchOptions = z.fetchOptions, this.maxRetries = z.maxRetries ?? 2, this.fetch = z.fetch ?? Fr8(), n7(this, V46, gr8, "f"), this._options = z, this.apiKey = typeof q === "string" ? q : null, this.authToken = K
    }
    withOptions(A) {
        return new this.constructor({
            ...this._options,
            baseURL: this.baseURL,
            maxRetries: this.maxRetries,
            timeout: this.timeout,
            logger: this.logger,
            logLevel: this.logLevel,
            fetch: this.fetch,
            fetchOptions: this.fetchOptions,
            apiKey: this.apiKey,
            authToken: this.authToken,
            ...A
        })
    }
    defaultQuery() {
        return this._options.defaultQuery
    }
    validateHeaders({
        values: A,
        nulls: q
    }) {
        if (A.get("x-api-key") || A.get("authorization")) return;
        if (this.apiKey && A.get("x-api-key")) return;
        if (q.has("x-api-key")) return;
        if (this.authToken && A.get("authorization")) return;
        if (q.has("authorization")) return;
        throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')
    }
    async authHeaders(A) {
        return M3([await this.apiKeyAuth(A), await this.bearerAuth(A)])
    }
    async apiKeyAuth(A) {
        if (this.apiKey == null) return;
        return M3([{
            "X-Api-Key": this.apiKey
        }])
    }
    async bearerAuth(A) {
        if (this.authToken == null) return;
        return M3([{
            Authorization: `Bearer ${this.authToken}`
        }])
    }
    stringifyQuery(A) {
        return Object.entries(A).filter(([q, K]) => typeof K < "u").map(([q, K]) => {
            if (typeof K === "string" || typeof K === "number" || typeof K === "boolean") return `${encodeURIComponent(q)}=${encodeURIComponent(K)}`;
            if (K === null) return `${encodeURIComponent(q)}=`;
            throw new r7(`Cannot stringify type ${typeof K}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)
        }).join("&")
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${gn}`
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${a6A()}`
    }
    makeStatusError(A, q, K, Y) {
        return k4.generate(A, q, K, Y)
    }
    buildURL(A, q, K) {
        let Y = !ZA(this, lAA, "m", To8).call(this) && K || this.baseURL,
            z = yr8(A) ? new URL(A) : new URL(Y + (Y.endsWith("/") && A.startsWith("/") ? A.slice(1) : A)),
            w = this.defaultQuery();
        if (!Cr8(w)) q = {
            ...w,
            ...q
        };
        if (typeof q === "object" && q && !Array.isArray(q)) z.search = this.stringifyQuery(q);
        return z.toString()
    }
    _calculateNonstreamingTimeout(A) {
        if (3600 * A / 128000 > 600) throw new r7("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
        return 600000
    }
    async prepareOptions(A) {}
    async prepareRequest(A, {
        url: q,
        options: K
    }) {}
    get(A, q) {
        return this.methodRequest("get", A, q)
    }
    post(A, q) {
        return this.methodRequest("post", A, q)
    }
    patch(A, q) {
        return this.methodRequest("patch", A, q)
    }
    put(A, q) {
        return this.methodRequest("put", A, q)
    }
    delete(A, q) {
        return this.methodRequest("delete", A, q)
    }
    methodRequest(A, q, K) {
        return this.request(Promise.resolve(K).then((Y) => {
            return {
                method: A,
                path: q,
                ...Y
            }
        }))
    }
    request(A, q = null) {
        return new B81(this, this.makeRequest(A, q, void 0))
    }
    async makeRequest(A, q, K) {
        let Y = await A,
            z = Y.maxRetries ?? this.maxRetries;
        if (q == null) q = z;
        await this.prepareOptions(Y);
        let {
            req: w,
            url: H,
            timeout: $
        } = await this.buildRequest(Y, {
            retryCount: z - q
        });
        await this.prepareRequest(w, {
            url: H,
            options: Y
        });
        let O = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"),
            _ = K === void 0 ? "" : `, retryOf: ${K}`,
            J = Date.now();
        if (b0(this).debug(`[${O}] sending request`, Cg({
                retryOfRequestLogID: K,
                method: Y.method,
                url: H,
                options: Y,
                headers: w.headers
            })), Y.signal?.aborted) throw new Oz;
        let X = new AbortController,
            D = await this.fetchWithTimeout(H, w, $, X).catch(dR1),
            j = Date.now();
        if (D instanceof globalThis.Error) {
            let W = `retrying, ${q} attempts remaining`;
            if (Y.signal?.aborted) throw new Oz;
            let G = yg(D) || /timed? ?out/i.test(String(D) + ("cause" in D ? String(D.cause) : ""));
            if (q) return b0(this).info(`[${O}] connection ${G?"timed out":"failed"} - ${W}`), b0(this).debug(`[${O}] connection ${G?"timed out":"failed"} (${W})`, Cg({
                retryOfRequestLogID: K,
                url: H,
                durationMs: j - J,
                message: D.message
            })), this.retryRequest(Y, q, K ?? O);
            if (b0(this).info(`[${O}] connection ${G?"timed out":"failed"} - error; no more retries left`), b0(this).debug(`[${O}] connection ${G?"timed out":"failed"} (error; no more retries left)`, Cg({
                    retryOfRequestLogID: K,
                    url: H,
                    durationMs: j - J,
                    message: D.message
                })), G) throw new Au;
            throw new OW({
                cause: D
            })
        }
        let M = [...D.headers.entries()].filter(([W]) => W === "request-id").map(([W, G]) => ", " + W + ": " + JSON.stringify(G)).join(""),
            P = `[${O}${_}${M}] ${w.method} ${H} ${D.ok?"succeeded":"failed"} with status ${D.status} in ${j-J}ms`;
        if (!D.ok) {
            let W = await this.shouldRetry(D);
            if (q && W) {
                let k = `retrying, ${q} attempts remaining`;
                return await Qr8(D.body), b0(this).info(`${P} - ${k}`), b0(this).debug(`[${O}] response error (${k})`, Cg({
                    retryOfRequestLogID: K,
                    url: D.url,
                    status: D.status,
                    headers: D.headers,
                    durationMs: j - J
                })), this.retryRequest(Y, q, K ?? O, D.headers)
            }
            let G = W ? "error; no more retries left" : "error; not retryable";
            b0(this).info(`${P} - ${G}`);
            let f = await D.text().catch((k) => dR1(k).message),
                Z = c76(f),
                N = Z ? void 0 : f;
            throw b0(this).debug(`[${O}] response error (${G})`, Cg({
                retryOfRequestLogID: K,
                url: D.url,
                status: D.status,
                headers: D.headers,
                message: N,
                durationMs: Date.now() - J
            })), this.makeStatusError(D.status, Z, N, D.headers)
        }
        return b0(this).info(P), b0(this).debug(`[${O}] response start`, Cg({
            retryOfRequestLogID: K,
            url: D.url,
            status: D.status,
            headers: D.headers,
            durationMs: j - J
        })), {
            response: D,
            options: Y,
            controller: X,
            requestLogID: O,
            retryOfRequestLogID: K,
            startTime: J
        }
    }
    getAPIList(A, q, K) {
        return this.requestAPIList(q, K && "then" in K ? K.then((Y) => ({
            method: "get",
            path: A,
            ...Y
        })) : {
            method: "get",
            path: A,
            ...K
        })
    }
    requestAPIList(A, q) {
        let K = this.makeRequest(q, null, void 0);
        return new t76(this, K, A)
    }
    async fetchWithTimeout(A, q, K, Y) {
        let {
            signal: z,
            method: w,
            ...H
        } = q || {}, $ = this._makeAbort(Y);
        if (z) z.addEventListener("abort", $, {
            once: !0
        });
        let O = setTimeout($, K),
            _ = globalThis.ReadableStream && H.body instanceof globalThis.ReadableStream || typeof H.body === "object" && H.body !== null && Symbol.asyncIterator in H.body,
            J = {
                signal: Y.signal,
                ..._ ? {
                    duplex: "half"
                } : {},
                method: "GET",
                ...H
            };
        if (w) J.method = w.toUpperCase();
        try {
            return await this.fetch.call(void 0, A, J)
        } finally {
            clearTimeout(O)
        }
    }
    async shouldRetry(A) {
        let q = A.headers.get("x-should-retry");
        if (q === "true") return !0;
        if (q === "false") return !1;
        if (A.status === 408) return !0;
        if (A.status === 409) return !0;
        if (A.status === 429) return !0;
        if (A.status >= 500) return !0;
        return !1
    }
    async retryRequest(A, q, K, Y) {
        let z, w = Y?.get("retry-after-ms");
        if (w) {
            let $ = parseFloat(w);
            if (!Number.isNaN($)) z = $
        }
        let H = Y?.get("retry-after");
        if (H && !z) {
            let $ = parseFloat(H);
            if (!Number.isNaN($)) z = $ * 1000;
            else z = Date.parse(H) - Date.now()
        }
        if (!(z && 0 <= z && z < 60000)) {
            let $ = A.maxRetries ?? this.maxRetries;
            z = this.calculateDefaultRetryTimeoutMillis(q, $)
        }
        return await Ir8(z), this.makeRequest(A, q - 1, K)
    }
    calculateDefaultRetryTimeoutMillis(A, q) {
        let z = q - A,
            w = Math.min(0.5 * Math.pow(2, z), 8),
            H = 1 - Math.random() * 0.25;
        return w * H * 1000
    }
    calculateNonstreamingTimeout(A, q) {
        if (3600000 * A / 128000 > 600000 || q != null && A > q) throw new r7("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
        return 600000
    }
    async buildRequest(A, {
        retryCount: q = 0
    } = {}) {
        let K = {
                ...A
            },
            {
                method: Y,
                path: z,
                query: w,
                defaultBaseURL: H
            } = K,
            $ = this.buildURL(z, w, H);
        if ("timeout" in K) hr8("timeout", K.timeout);
        K.timeout = K.timeout ?? this.timeout;
        let {
            bodyHeaders: O,
            body: _
        } = this.buildBody({
            options: K
        }), J = await this.buildHeaders({
            options: A,
            method: Y,
            bodyHeaders: O,
            retryCount: q
        });
        return {
            req: {
                method: Y,
                headers: J,
                ...K.signal && {
                    signal: K.signal
                },
                ...globalThis.ReadableStream && _ instanceof globalThis.ReadableStream && {
                    duplex: "half"
                },
                ..._ && {
                    body: _
                },
                ...this.fetchOptions ?? {},
                ...K.fetchOptions ?? {}
            },
            url: $,
            timeout: K.timeout
        }
    }
    async buildHeaders({
        options: A,
        method: q,
        bodyHeaders: K,
        retryCount: Y
    }) {
        let z = {};
        if (this.idempotencyHeader && q !== "get") {
            if (!A.idempotencyKey) A.idempotencyKey = this.defaultIdempotencyKey();
            z[this.idempotencyHeader] = A.idempotencyKey
        }
        let w = M3([z, {
            Accept: "application/json",
            "User-Agent": this.getUserAgent(),
            "X-Stainless-Retry-Count": String(Y),
            ...A.timeout ? {
                "X-Stainless-Timeout": String(Math.trunc(A.timeout / 1000))
            } : {},
            ...mr8(),
            ...this._options.dangerouslyAllowBrowser ? {
                "anthropic-dangerous-direct-browser-access": "true"
            } : void 0,
            "anthropic-version": "2023-06-01"
        }, await this.authHeaders(A), this._options.defaultHeaders, K, A.headers]);
        return this.validateHeaders(w), w.values
    }
    _makeAbort(A) {
        return () => A.abort()
    }
    buildBody({
        options: {
            body: A,
            headers: q
        }
    }) {
        if (!A) return {
            bodyHeaders: void 0,
            body: void 0
        };
        let K = M3([q]);
        if (ArrayBuffer.isView(A) || A instanceof ArrayBuffer || A instanceof DataView || typeof A === "string" && K.values.has("content-type") || globalThis.Blob && A instanceof globalThis.Blob || A instanceof FormData || A instanceof URLSearchParams || globalThis.ReadableStream && A instanceof globalThis.ReadableStream) return {
            bodyHeaders: void 0,
            body: A
        };
        else if (typeof A === "object" && ((Symbol.asyncIterator in A) || (Symbol.iterator in A) && ("next" in A) && typeof A.next === "function")) return {
            bodyHeaders: void 0,
            body: l76(A)
        };
        else return ZA(this, V46, "f").call(this, {
            body: A,
            headers: K
        })
    }
}
// @from(Ln 116585, Col 4)
lAA
// @from(Ln 116585, Col 9)
iAA
// @from(Ln 116585, Col 14)
V46
// @from(Ln 116585, Col 19)
To8
// @from(Ln 116585, Col 24)
vo8 = "\\n\\nHuman:"
// @from(Ln 116586, Col 4)
Eo8 = "\\n\\nAssistant:"
// @from(Ln 116587, Col 4)
oC