
// @from(Ln 339345, Col 4)
EV1 = E(() => {
    K7();
    D$();
    IW();
    T1();
    Bj();
    Q36();
    on4();
    V1();
    H1();
    A8();
    T1();
    vz();
    nY6();
    xI();
    gR();
    z4();
    JA();
    $N1();
    T1();
    JA();
    P66();
    s8();
    BG();
    _kY = F6(() => C.object({
        skill: C.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
        args: C.string().optional().describe("Optional arguments for the skill")
    })), wkY = F6(() => {
        let A = C.object({
                success: C.boolean().describe("Whether the skill is valid"),
                commandName: C.string().describe("The name of the skill"),
                allowedTools: C.array(C.string()).optional().describe("Tools allowed by this skill"),
                model: C.string().optional().describe("Model override if specified"),
                status: C.literal("inline").optional().describe("Execution status")
            }),
            q = C.object({
                success: C.boolean().describe("Whether the skill completed successfully"),
                commandName: C.string().describe("The name of the skill"),
                status: C.literal("forked").describe("Execution status"),
                agentId: C.string().describe("The ID of the sub-agent that executed the skill"),
                result: C.string().describe("The result from the forked skill execution")
            });
        return C.union([A, q])
    }), m66 = {
        name: oH,
        searchHint: "invoke a slash-command skill",
        maxResultSizeChars: 1e5,
        get inputSchema() {
            return _kY()
        },
        get outputSchema() {
            return wkY()
        },
        description: async ({
            skill: A
        }) => `Execute skill: ${A}`,
        prompt: async () => dP1(qY()),
        userFacingName: () => oH,
        isConcurrencySafe: () => !1,
        isEnabled: () => !0,
        isReadOnly: () => !1,
        toAutoClassifierInput: () => "",
        async validateInput({
            skill: A
        }, q) {
            let K = A.trim();
            if (!K) return {
                result: !1,
                message: `Invalid skill format: ${A}`,
                errorCode: 1
            };
            let Y = K.startsWith("/");
            if (Y) d("tengu_skill_tool_slash_prefix", {});
            let z = Y ? K.substring(1) : K,
                _ = await I0(qY()),
                w = G66(z, _);
            if (!w) return {
                result: !1,
                message: `Unknown skill: ${z}`,
                errorCode: 2
            };
            if (w.disableModelInvocation) return {
                result: !1,
                message: `Skill ${z} cannot be used with ${oH} tool due to disable-model-invocation`,
                errorCode: 4
            };
            if (w.type !== "prompt") return {
                result: !1,
                message: `Skill ${z} is not a prompt-based skill`,
                errorCode: 5
            };
            return {
                result: !0
            }
        },
        async checkPermissions({
            skill: A,
            args: q
        }, K) {
            let Y = A.trim(),
                z = Y.startsWith("/") ? Y.substring(1) : Y,
                w = K.getAppState().toolPermissionContext,
                O = await I0(qY()),
                $ = G66(z, O),
                H = (D) => {
                    let X = D.startsWith("/") ? D.substring(1) : D;
                    if (X === z) return !0;
                    if (X.endsWith(":*")) {
                        let P = X.slice(0, -2);
                        return z.startsWith(P)
                    }
                    return !1
                },
                j = Sb(w, m66, "deny");
            for (let [D, X] of j.entries())
                if (H(D)) return {
                    behavior: "deny",
                    message: "Skill execution blocked by permission rules",
                    decisionReason: {
                        type: "rule",
                        rule: X
                    }
                };
            let J = Sb(w, m66, "allow");
            for (let [D, X] of J.entries())
                if (H(D)) return {
                    behavior: "allow",
                    updatedInput: {
                        skill: A,
                        args: q
                    },
                    decisionReason: {
                        type: "rule",
                        rule: X
                    }
                };
            if ($?.type === "prompt" && $kY($)) return {
                behavior: "allow",
                updatedInput: {
                    skill: A,
                    args: q
                },
                decisionReason: void 0
            };
            let M = [{
                type: "addRules",
                rules: [{
                    toolName: oH,
                    ruleContent: z
                }],
                behavior: "allow",
                destination: "localSettings"
            }, {
                type: "addRules",
                rules: [{
                    toolName: oH,
                    ruleContent: `${z}:*`
                }],
                behavior: "allow",
                destination: "localSettings"
            }];
            return {
                behavior: "ask",
                message: `Execute skill: ${z}`,
                decisionReason: void 0,
                suggestions: M,
                updatedInput: {
                    skill: A,
                    args: q
                },
                metadata: $ ? {
                    command: $
                } : void 0
            }
        },
        async call({
            skill: A,
            args: q
        }, K, Y, z, _) {
            let w = A.trim(),
                O = w.startsWith("/") ? w.substring(1) : w,
                $ = await I0(qY()),
                H = G66(O, $);
            if (ON1(O), H?.type === "prompt" && H.context === "fork") return zkY(H, O, q, K, Y, z, _);
            let {
                processPromptSlashCommand: j
            } = await Promise.resolve().then(() => (MN1(), JN1)), J = await j(O, q || "", $, K);
            if (!J.shouldQuery) throw Error("Command processing failed");
            let M = J.allowedTools || [],
                D = J.model,
                X = Qg().has(O),
                P = H?.type === "prompt" && H.source === "bundled",
                W = H?.type === "prompt" && tn4(H);
            d("tengu_skill_tool_invocation", {
                command_name: X || P || W ? O : "custom",
                ...{},
                ...!1,
                ...H?.type === "prompt" && H.pluginInfo && {
                    plugin_name: W ? H.pluginInfo.pluginManifest.name : "third-party",
                    plugin_repository: W ? H.pluginInfo.repository : "third-party"
                }
            });
            let f = sn4(z, oH),
                v = an4(J.messages.filter((N) => {
                    if (N.type === "progress") return !1;
                    if (N.type === "user" && "message" in N) {
                        let V = N.message.content;
                        if (typeof V === "string" && V.includes(`<${PP}>`)) return !1
                    }
                    return !0
                }), f);
            return k(`SkillTool returning ${v.length} newMessages for skill ${O}`), {
                data: {
                    success: !0,
                    commandName: O,
                    allowedTools: M.length > 0 ? M : void 0,
                    model: D
                },
                newMessages: v,
                contextModifier(N) {
                    let V = N;
                    if (M.length > 0) {
                        let L = V.getAppState;
                        V = {
                            ...V,
                            getAppState() {
                                let h = L();
                                return {
                                    ...h,
                                    toolPermissionContext: {
                                        ...h.toolPermissionContext,
                                        alwaysAllowRules: {
                                            ...h.toolPermissionContext.alwaysAllowRules,
                                            command: [...new Set([...h.toolPermissionContext.alwaysAllowRules.command || [], ...M])]
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (D) V = {
                        ...V,
                        options: {
                            ...V.options,
                            mainLoopModel: Pl6(D, N.options.mainLoopModel)
                        }
                    };
                    return V
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            if ("status" in A && A.status === "forked") return {
                type: "tool_result",
                tool_use_id: q,
                content: `Skill "${A.commandName}" completed (forked execution).

Result:
${A.result}`
            };
            return {
                type: "tool_result",
                tool_use_id: q,
                content: `Launching skill: ${A.commandName}`
            }
        },
        renderToolResultMessage: ln4,
        renderToolUseMessage: in4,
        renderToolUseProgressMessage: VV1,
        renderToolUseRejectedMessage: nn4,
        renderToolUseErrorMessage: rn4
    }, OkY = new Set(["type", "progressMessage", "contentLength", "argNames", "model", "source", "pluginInfo", "disableNonInteractive", "skillRoot", "context", "agent", "getPromptForCommand", "frontmatterKeys", "name", "description", "hasUserSpecifiedDescription", "isEnabled", "isHidden", "aliases", "isMcp", "argumentHint", "whenToUse", "version", "disableModelInvocation", "userInvocable", "loadedFrom", "immediate", "userFacingName"])
})
// @from(Ln 339618, Col 4)
nf6 = x((qr4) => {
    Object.defineProperty(qr4, "__esModule", {
        value: !0
    });
    qr4.stringArray = qr4.array = qr4.func = qr4.error = qr4.number = qr4.string = qr4.boolean = void 0;

    function HkY(A) {
        return A === !0 || A === !1
    }
    qr4.boolean = HkY;

    function en4(A) {
        return typeof A === "string" || A instanceof String
    }
    qr4.string = en4;

    function jkY(A) {
        return typeof A === "number" || A instanceof Number
    }
    qr4.number = jkY;

    function JkY(A) {
        return A instanceof Error
    }
    qr4.error = JkY;

    function MkY(A) {
        return typeof A === "function"
    }
    qr4.func = MkY;

    function Ar4(A) {
        return Array.isArray(A)
    }
    qr4.array = Ar4;

    function DkY(A) {
        return Ar4(A) && A.every((q) => en4(q))
    }
    qr4.stringArray = DkY
})
// @from(Ln 339659, Col 4)
Pm8 = x((yr4) => {
    Object.defineProperty(yr4, "__esModule", {
        value: !0
    });
    yr4.Message = yr4.NotificationType9 = yr4.NotificationType8 = yr4.NotificationType7 = yr4.NotificationType6 = yr4.NotificationType5 = yr4.NotificationType4 = yr4.NotificationType3 = yr4.NotificationType2 = yr4.NotificationType1 = yr4.NotificationType0 = yr4.NotificationType = yr4.RequestType9 = yr4.RequestType8 = yr4.RequestType7 = yr4.RequestType6 = yr4.RequestType5 = yr4.RequestType4 = yr4.RequestType3 = yr4.RequestType2 = yr4.RequestType1 = yr4.RequestType = yr4.RequestType0 = yr4.AbstractMessageSignature = yr4.ParameterStructures = yr4.ResponseError = yr4.ErrorCodes = void 0;
    var jz6 = nf6(),
        Dm8;
    (function(A) {
        A.ParseError = -32700, A.InvalidRequest = -32600, A.MethodNotFound = -32601, A.InvalidParams = -32602, A.InternalError = -32603, A.jsonrpcReservedErrorRangeStart = -32099, A.serverErrorStart = -32099, A.MessageWriteError = -32099, A.MessageReadError = -32098, A.PendingResponseRejected = -32097, A.ConnectionInactive = -32096, A.ServerNotInitialized = -32002, A.UnknownErrorCode = -32001, A.jsonrpcReservedErrorRangeEnd = -32000, A.serverErrorEnd = -32000
    })(Dm8 || (yr4.ErrorCodes = Dm8 = {}));
    class Xm8 extends Error {
        constructor(A, q, K) {
            super(q);
            this.code = jz6.number(A) ? A : Dm8.UnknownErrorCode, this.data = K, Object.setPrototypeOf(this, Xm8.prototype)
        }
        toJson() {
            let A = {
                code: this.code,
                message: this.message
            };
            if (this.data !== void 0) A.data = this.data;
            return A
        }
    }
    yr4.ResponseError = Xm8;
    class SZ {
        constructor(A) {
            this.kind = A
        }
        static is(A) {
            return A === SZ.auto || A === SZ.byName || A === SZ.byPosition
        }
        toString() {
            return this.kind
        }
    }
    yr4.ParameterStructures = SZ;
    SZ.auto = new SZ("auto");
    SZ.byPosition = new SZ("byPosition");
    SZ.byName = new SZ("byName");
    class W$ {
        constructor(A, q) {
            this.method = A, this.numberOfParams = q
        }
        get parameterStructures() {
            return SZ.auto
        }
    }
    yr4.AbstractMessageSignature = W$;
    class zr4 extends W$ {
        constructor(A) {
            super(A, 0)
        }
    }
    yr4.RequestType0 = zr4;
    class _r4 extends W$ {
        constructor(A, q = SZ.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    yr4.RequestType = _r4;
    class wr4 extends W$ {
        constructor(A, q = SZ.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    yr4.RequestType1 = wr4;
    class Or4 extends W$ {
        constructor(A) {
            super(A, 2)
        }
    }
    yr4.RequestType2 = Or4;
    class $r4 extends W$ {
        constructor(A) {
            super(A, 3)
        }
    }
    yr4.RequestType3 = $r4;
    class Hr4 extends W$ {
        constructor(A) {
            super(A, 4)
        }
    }
    yr4.RequestType4 = Hr4;
    class jr4 extends W$ {
        constructor(A) {
            super(A, 5)
        }
    }
    yr4.RequestType5 = jr4;
    class Jr4 extends W$ {
        constructor(A) {
            super(A, 6)
        }
    }
    yr4.RequestType6 = Jr4;
    class Mr4 extends W$ {
        constructor(A) {
            super(A, 7)
        }
    }
    yr4.RequestType7 = Mr4;
    class Dr4 extends W$ {
        constructor(A) {
            super(A, 8)
        }
    }
    yr4.RequestType8 = Dr4;
    class Xr4 extends W$ {
        constructor(A) {
            super(A, 9)
        }
    }
    yr4.RequestType9 = Xr4;
    class Pr4 extends W$ {
        constructor(A, q = SZ.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    yr4.NotificationType = Pr4;
    class Wr4 extends W$ {
        constructor(A) {
            super(A, 0)
        }
    }
    yr4.NotificationType0 = Wr4;
    class Zr4 extends W$ {
        constructor(A, q = SZ.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    yr4.NotificationType1 = Zr4;
    class Gr4 extends W$ {
        constructor(A) {
            super(A, 2)
        }
    }
    yr4.NotificationType2 = Gr4;
    class fr4 extends W$ {
        constructor(A) {
            super(A, 3)
        }
    }
    yr4.NotificationType3 = fr4;
    class Tr4 extends W$ {
        constructor(A) {
            super(A, 4)
        }
    }
    yr4.NotificationType4 = Tr4;
    class vr4 extends W$ {
        constructor(A) {
            super(A, 5)
        }
    }
    yr4.NotificationType5 = vr4;
    class Nr4 extends W$ {
        constructor(A) {
            super(A, 6)
        }
    }
    yr4.NotificationType6 = Nr4;
    class Vr4 extends W$ {
        constructor(A) {
            super(A, 7)
        }
    }
    yr4.NotificationType7 = Vr4;
    class kr4 extends W$ {
        constructor(A) {
            super(A, 8)
        }
    }
    yr4.NotificationType8 = kr4;
    class Er4 extends W$ {
        constructor(A) {
            super(A, 9)
        }
    }
    yr4.NotificationType9 = Er4;
    var Yr4;
    (function(A) {
        function q(z) {
            let _ = z;
            return _ && jz6.string(_.method) && (jz6.string(_.id) || jz6.number(_.id))
        }
        A.isRequest = q;

        function K(z) {
            let _ = z;
            return _ && jz6.string(_.method) && z.id === void 0
        }
        A.isNotification = K;

        function Y(z) {
            let _ = z;
            return _ && (_.result !== void 0 || !!_.error) && (jz6.string(_.id) || jz6.number(_.id) || _.id === null)
        }
        A.isResponse = Y
    })(Yr4 || (yr4.Message = Yr4 = {}))
})
// @from(Ln 339877, Col 4)
Zm8 = x((Sr4) => {
    var Rr4;
    Object.defineProperty(Sr4, "__esModule", {
        value: !0
    });
    Sr4.LRUCache = Sr4.LinkedMap = Sr4.Touch = void 0;
    var CZ;
    (function(A) {
        A.None = 0, A.First = 1, A.AsOld = A.First, A.Last = 2, A.AsNew = A.Last
    })(CZ || (Sr4.Touch = CZ = {}));
    class Wm8 {
        constructor() {
            this[Rr4] = "LinkedMap", this._map = new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0
        }
        clear() {
            this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++
        }
        isEmpty() {
            return !this._head && !this._tail
        }
        get size() {
            return this._size
        }
        get first() {
            return this._head?.value
        }
        get last() {
            return this._tail?.value
        }
        has(A) {
            return this._map.has(A)
        }
        get(A, q = CZ.None) {
            let K = this._map.get(A);
            if (!K) return;
            if (q !== CZ.None) this.touch(K, q);
            return K.value
        }
        set(A, q, K = CZ.None) {
            let Y = this._map.get(A);
            if (Y) {
                if (Y.value = q, K !== CZ.None) this.touch(Y, K)
            } else {
                switch (Y = {
                        key: A,
                        value: q,
                        next: void 0,
                        previous: void 0
                    }, K) {
                    case CZ.None:
                        this.addItemLast(Y);
                        break;
                    case CZ.First:
                        this.addItemFirst(Y);
                        break;
                    case CZ.Last:
                        this.addItemLast(Y);
                        break;
                    default:
                        this.addItemLast(Y);
                        break
                }
                this._map.set(A, Y), this._size++
            }
            return this
        }
        delete(A) {
            return !!this.remove(A)
        }
        remove(A) {
            let q = this._map.get(A);
            if (!q) return;
            return this._map.delete(A), this.removeItem(q), this._size--, q.value
        }
        shift() {
            if (!this._head && !this._tail) return;
            if (!this._head || !this._tail) throw Error("Invalid list");
            let A = this._head;
            return this._map.delete(A.key), this.removeItem(A), this._size--, A.value
        }
        forEach(A, q) {
            let K = this._state,
                Y = this._head;
            while (Y) {
                if (q) A.bind(q)(Y.value, Y.key, this);
                else A(Y.value, Y.key, this);
                if (this._state !== K) throw Error("LinkedMap got modified during iteration.");
                Y = Y.next
            }
        }
        keys() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: q.key,
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        }
        values() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: q.value,
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        }
        entries() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: [q.key, q.value],
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        } [(Rr4 = Symbol.toStringTag, Symbol.iterator)]() {
            return this.entries()
        }
        trimOld(A) {
            if (A >= this.size) return;
            if (A === 0) {
                this.clear();
                return
            }
            let q = this._head,
                K = this.size;
            while (q && K > A) this._map.delete(q.key), q = q.next, K--;
            if (this._head = q, this._size = K, q) q.previous = void 0;
            this._state++
        }
        addItemFirst(A) {
            if (!this._head && !this._tail) this._tail = A;
            else if (!this._head) throw Error("Invalid list");
            else A.next = this._head, this._head.previous = A;
            this._head = A, this._state++
        }
        addItemLast(A) {
            if (!this._head && !this._tail) this._head = A;
            else if (!this._tail) throw Error("Invalid list");
            else A.previous = this._tail, this._tail.next = A;
            this._tail = A, this._state++
        }
        removeItem(A) {
            if (A === this._head && A === this._tail) this._head = void 0, this._tail = void 0;
            else if (A === this._head) {
                if (!A.next) throw Error("Invalid list");
                A.next.previous = void 0, this._head = A.next
            } else if (A === this._tail) {
                if (!A.previous) throw Error("Invalid list");
                A.previous.next = void 0, this._tail = A.previous
            } else {
                let {
                    next: q,
                    previous: K
                } = A;
                if (!q || !K) throw Error("Invalid list");
                q.previous = K, K.next = q
            }
            A.next = void 0, A.previous = void 0, this._state++
        }
        touch(A, q) {
            if (!this._head || !this._tail) throw Error("Invalid list");
            if (q !== CZ.First && q !== CZ.Last) return;
            if (q === CZ.First) {
                if (A === this._head) return;
                let {
                    next: K,
                    previous: Y
                } = A;
                if (A === this._tail) Y.next = void 0, this._tail = Y;
                else K.previous = Y, Y.next = K;
                A.previous = void 0, A.next = this._head, this._head.previous = A, this._head = A, this._state++
            } else if (q === CZ.Last) {
                if (A === this._tail) return;
                let {
                    next: K,
                    previous: Y
                } = A;
                if (A === this._head) K.previous = void 0, this._head = K;
                else K.previous = Y, Y.next = K;
                A.next = void 0, A.previous = this._tail, this._tail.next = A, this._tail = A, this._state++
            }
        }
        toJSON() {
            let A = [];
            return this.forEach((q, K) => {
                A.push([K, q])
            }), A
        }
        fromJSON(A) {
            this.clear();
            for (let [q, K] of A) this.set(q, K)
        }
    }
    Sr4.LinkedMap = Wm8;
    class hr4 extends Wm8 {
        constructor(A, q = 1) {
            super();
            this._limit = A, this._ratio = Math.min(Math.max(0, q), 1)
        }
        get limit() {
            return this._limit
        }
        set limit(A) {
            this._limit = A, this.checkTrim()
        }
        get ratio() {
            return this._ratio
        }
        set ratio(A) {
            this._ratio = Math.min(Math.max(0, A), 1), this.checkTrim()
        }
        get(A, q = CZ.AsNew) {
            return super.get(A, q)
        }
        peek(A) {
            return super.get(A, CZ.None)
        }
        set(A, q) {
            return super.set(A, q, CZ.Last), this.checkTrim(), this
        }
        checkTrim() {
            if (this.size > this._limit) this.trimOld(Math.round(this._limit * this._ratio))
        }
    }
    Sr4.LRUCache = hr4
})
// @from(Ln 340147, Col 4)
ur4 = x((br4) => {
    Object.defineProperty(br4, "__esModule", {
        value: !0
    });
    br4.Disposable = void 0;
    var Ir4;
    (function(A) {
        function q(K) {
            return {
                dispose: K
            }
        }
        A.create = q
    })(Ir4 || (br4.Disposable = Ir4 = {}))
})
// @from(Ln 340162, Col 4)
B66 = x((mr4) => {
    Object.defineProperty(mr4, "__esModule", {
        value: !0
    });
    var Gm8;

    function fm8() {
        if (Gm8 === void 0) throw Error("No runtime abstraction layer installed");
        return Gm8
    }(function(A) {
        function q(K) {
            if (K === void 0) throw Error("No runtime abstraction layer provided");
            Gm8 = K
        }
        A.install = q
    })(fm8 || (fm8 = {}));
    mr4.default = fm8
})
// @from(Ln 340180, Col 4)
rf6 = x((Fr4) => {
    Object.defineProperty(Fr4, "__esModule", {
        value: !0
    });
    Fr4.Emitter = Fr4.Event = void 0;
    var okY = B66(),
        Br4;
    (function(A) {
        let q = {
            dispose() {}
        };
        A.None = function() {
            return q
        }
    })(Br4 || (Fr4.Event = Br4 = {}));
    class gr4 {
        add(A, q = null, K) {
            if (!this._callbacks) this._callbacks = [], this._contexts = [];
            if (this._callbacks.push(A), this._contexts.push(q), Array.isArray(K)) K.push({
                dispose: () => this.remove(A, q)
            })
        }
        remove(A, q = null) {
            if (!this._callbacks) return;
            let K = !1;
            for (let Y = 0, z = this._callbacks.length; Y < z; Y++)
                if (this._callbacks[Y] === A)
                    if (this._contexts[Y] === q) {
                        this._callbacks.splice(Y, 1), this._contexts.splice(Y, 1);
                        return
                    } else K = !0;
            if (K) throw Error("When adding a listener with a context, you should remove it with the same context")
        }
        invoke(...A) {
            if (!this._callbacks) return [];
            let q = [],
                K = this._callbacks.slice(0),
                Y = this._contexts.slice(0);
            for (let z = 0, _ = K.length; z < _; z++) try {
                q.push(K[z].apply(Y[z], A))
            } catch (w) {
                (0, okY.default)().console.error(w)
            }
            return q
        }
        isEmpty() {
            return !this._callbacks || this._callbacks.length === 0
        }
        dispose() {
            this._callbacks = void 0, this._contexts = void 0
        }
    }
    class yV1 {
        constructor(A) {
            this._options = A
        }
        get event() {
            if (!this._event) this._event = (A, q, K) => {
                if (!this._callbacks) this._callbacks = new gr4;
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
                this._callbacks.add(A, q);
                let Y = {
                    dispose: () => {
                        if (!this._callbacks) return;
                        if (this._callbacks.remove(A, q), Y.dispose = yV1._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this)
                    }
                };
                if (Array.isArray(K)) K.push(Y);
                return Y
            };
            return this._event
        }
        fire(A) {
            if (this._callbacks) this._callbacks.invoke.call(this._callbacks, A)
        }
        dispose() {
            if (this._callbacks) this._callbacks.dispose(), this._callbacks = void 0
        }
    }
    Fr4.Emitter = yV1;
    yV1._noop = function() {}
})
// @from(Ln 340262, Col 4)
RV1 = x((Ur4) => {
    Object.defineProperty(Ur4, "__esModule", {
        value: !0
    });
    Ur4.CancellationTokenSource = Ur4.CancellationToken = void 0;
    var skY = B66(),
        tkY = nf6(),
        Tm8 = rf6(),
        LV1;
    (function(A) {
        A.None = Object.freeze({
            isCancellationRequested: !1,
            onCancellationRequested: Tm8.Event.None
        }), A.Cancelled = Object.freeze({
            isCancellationRequested: !0,
            onCancellationRequested: Tm8.Event.None
        });

        function q(K) {
            let Y = K;
            return Y && (Y === A.None || Y === A.Cancelled || tkY.boolean(Y.isCancellationRequested) && !!Y.onCancellationRequested)
        }
        A.is = q
    })(LV1 || (Ur4.CancellationToken = LV1 = {}));
    var ekY = Object.freeze(function(A, q) {
        let K = (0, skY.default)().timer.setTimeout(A.bind(q), 0);
        return {
            dispose() {
                K.dispose()
            }
        }
    });
    class vm8 {
        constructor() {
            this._isCancelled = !1
        }
        cancel() {
            if (!this._isCancelled) {
                if (this._isCancelled = !0, this._emitter) this._emitter.fire(void 0), this.dispose()
            }
        }
        get isCancellationRequested() {
            return this._isCancelled
        }
        get onCancellationRequested() {
            if (this._isCancelled) return ekY;
            if (!this._emitter) this._emitter = new Tm8.Emitter;
            return this._emitter.event
        }
        dispose() {
            if (this._emitter) this._emitter.dispose(), this._emitter = void 0
        }
    }
    class Qr4 {
        get token() {
            if (!this._token) this._token = new vm8;
            return this._token
        }
        cancel() {
            if (!this._token) this._token = LV1.Cancelled;
            else this._token.cancel()
        }
        dispose() {
            if (!this._token) this._token = LV1.None;
            else if (this._token instanceof vm8) this._token.dispose()
        }
    }
    Ur4.CancellationTokenSource = Qr4
})
// @from(Ln 340331, Col 4)
ar4 = x((rr4) => {
    Object.defineProperty(rr4, "__esModule", {
        value: !0
    });
    rr4.SharedArrayReceiverStrategy = rr4.SharedArraySenderStrategy = void 0;
    var qEY = RV1(),
        Wl6;
    (function(A) {
        A.Continue = 0, A.Cancelled = 1
    })(Wl6 || (Wl6 = {}));
    class cr4 {
        constructor() {
            this.buffers = new Map
        }
        enableCancellation(A) {
            if (A.id === null) return;
            let q = new SharedArrayBuffer(4),
                K = new Int32Array(q, 0, 1);
            K[0] = Wl6.Continue, this.buffers.set(A.id, q), A.$cancellationData = q
        }
        async sendCancellation(A, q) {
            let K = this.buffers.get(q);
            if (K === void 0) return;
            let Y = new Int32Array(K, 0, 1);
            Atomics.store(Y, 0, Wl6.Cancelled)
        }
        cleanup(A) {
            this.buffers.delete(A)
        }
        dispose() {
            this.buffers.clear()
        }
    }
    rr4.SharedArraySenderStrategy = cr4;
    class lr4 {
        constructor(A) {
            this.data = new Int32Array(A, 0, 1)
        }
        get isCancellationRequested() {
            return Atomics.load(this.data, 0) === Wl6.Cancelled
        }
        get onCancellationRequested() {
            throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")
        }
    }
    class ir4 {
        constructor(A) {
            this.token = new lr4(A)
        }
        cancel() {}
        dispose() {}
    }
    class nr4 {
        constructor() {
            this.kind = "request"
        }
        createCancellationTokenSource(A) {
            let q = A.$cancellationData;
            if (q === void 0) return new qEY.CancellationTokenSource;
            return new ir4(q)
        }
    }
    rr4.SharedArrayReceiverStrategy = nr4
})
// @from(Ln 340395, Col 4)
Nm8 = x((tr4) => {
    Object.defineProperty(tr4, "__esModule", {
        value: !0
    });
    tr4.Semaphore = void 0;
    var YEY = B66();
    class sr4 {
        constructor(A = 1) {
            if (A <= 0) throw Error("Capacity must be greater than 0");
            this._capacity = A, this._active = 0, this._waiting = []
        }
        lock(A) {
            return new Promise((q, K) => {
                this._waiting.push({
                    thunk: A,
                    resolve: q,
                    reject: K
                }), this.runNext()
            })
        }
        get active() {
            return this._active
        }
        runNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            (0, YEY.default)().timer.setImmediate(() => this.doRunNext())
        }
        doRunNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            let A = this._waiting.shift();
            if (this._active++, this._active > this._capacity) throw Error("To many thunks active");
            try {
                let q = A.thunk();
                if (q instanceof Promise) q.then((K) => {
                    this._active--, A.resolve(K), this.runNext()
                }, (K) => {
                    this._active--, A.reject(K), this.runNext()
                });
                else this._active--, A.resolve(q), this.runNext()
            } catch (q) {
                this._active--, A.reject(q), this.runNext()
            }
        }
    }
    tr4.Semaphore = sr4
})
// @from(Ln 340441, Col 4)
zo4 = x((Ko4) => {
    Object.defineProperty(Ko4, "__esModule", {
        value: !0
    });
    Ko4.ReadableStreamMessageReader = Ko4.AbstractMessageReader = Ko4.MessageReader = void 0;
    var km8 = B66(),
        of6 = nf6(),
        Vm8 = rf6(),
        zEY = Nm8(),
        Ao4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && of6.func(Y.listen) && of6.func(Y.dispose) && of6.func(Y.onError) && of6.func(Y.onClose) && of6.func(Y.onPartialMessage)
        }
        A.is = q
    })(Ao4 || (Ko4.MessageReader = Ao4 = {}));
    class ym8 {
        constructor() {
            this.errorEmitter = new Vm8.Emitter, this.closeEmitter = new Vm8.Emitter, this.partialMessageEmitter = new Vm8.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(A) {
            this.errorEmitter.fire(this.asError(A))
        }
        get onClose() {
            return this.closeEmitter.event
        }
        fireClose() {
            this.closeEmitter.fire(void 0)
        }
        get onPartialMessage() {
            return this.partialMessageEmitter.event
        }
        firePartialMessage(A) {
            this.partialMessageEmitter.fire(A)
        }
        asError(A) {
            if (A instanceof Error) return A;
            else return Error(`Reader received error. Reason: ${of6.string(A.message)?A.message:"unknown"}`)
        }
    }
    Ko4.AbstractMessageReader = ym8;
    var Em8;
    (function(A) {
        function q(K) {
            let Y, z, _, w = new Map,
                O, $ = new Map;
            if (K === void 0 || typeof K === "string") Y = K ?? "utf-8";
            else {
                if (Y = K.charset ?? "utf-8", K.contentDecoder !== void 0) _ = K.contentDecoder, w.set(_.name, _);
                if (K.contentDecoders !== void 0)
                    for (let H of K.contentDecoders) w.set(H.name, H);
                if (K.contentTypeDecoder !== void 0) O = K.contentTypeDecoder, $.set(O.name, O);
                if (K.contentTypeDecoders !== void 0)
                    for (let H of K.contentTypeDecoders) $.set(H.name, H)
            }
            if (O === void 0) O = (0, km8.default)().applicationJson.decoder, $.set(O.name, O);
            return {
                charset: Y,
                contentDecoder: _,
                contentDecoders: w,
                contentTypeDecoder: O,
                contentTypeDecoders: $
            }
        }
        A.fromOptions = q
    })(Em8 || (Em8 = {}));
    class qo4 extends ym8 {
        constructor(A, q) {
            super();
            this.readable = A, this.options = Em8.fromOptions(q), this.buffer = (0, km8.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new zEY.Semaphore(1)
        }
        set partialMessageTimeout(A) {
            this._partialMessageTimeout = A
        }
        get partialMessageTimeout() {
            return this._partialMessageTimeout
        }
        listen(A) {
            this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = A;
            let q = this.readable.onData((K) => {
                this.onData(K)
            });
            return this.readable.onError((K) => this.fireError(K)), this.readable.onClose(() => this.fireClose()), q
        }
        onData(A) {
            try {
                this.buffer.append(A);
                while (!0) {
                    if (this.nextMessageLength === -1) {
                        let K = this.buffer.tryReadHeaders(!0);
                        if (!K) return;
                        let Y = K.get("content-length");
                        if (!Y) {
                            this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(K))}`));
                            return
                        }
                        let z = parseInt(Y);
                        if (isNaN(z)) {
                            this.fireError(Error(`Content-Length value must be a number. Got ${Y}`));
                            return
                        }
                        this.nextMessageLength = z
                    }
                    let q = this.buffer.tryReadBody(this.nextMessageLength);
                    if (q === void 0) {
                        this.setPartialMessageTimer();
                        return
                    }
                    this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
                        let K = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(q) : q,
                            Y = await this.options.contentTypeDecoder.decode(K, this.options);
                        this.callback(Y)
                    }).catch((K) => {
                        this.fireError(K)
                    })
                }
            } catch (q) {
                this.fireError(q)
            }
        }
        clearPartialMessageTimer() {
            if (this.partialMessageTimer) this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0
        }
        setPartialMessageTimer() {
            if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0) return;
            this.partialMessageTimer = (0, km8.default)().timer.setTimeout((A, q) => {
                if (this.partialMessageTimer = void 0, A === this.messageToken) this.firePartialMessage({
                    messageToken: A,
                    waitingTime: q
                }), this.setPartialMessageTimer()
            }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout)
        }
    }
    Ko4.ReadableStreamMessageReader = qo4
})
// @from(Ln 340584, Col 4)
Mo4 = x((jo4) => {
    Object.defineProperty(jo4, "__esModule", {
        value: !0
    });
    jo4.WriteableStreamMessageWriter = jo4.AbstractMessageWriter = jo4.MessageWriter = void 0;
    var _o4 = B66(),
        Zl6 = nf6(),
        OEY = Nm8(),
        wo4 = rf6(),
        $EY = "Content-Length: ",
        Oo4 = `\r
`,
        $o4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && Zl6.func(Y.dispose) && Zl6.func(Y.onClose) && Zl6.func(Y.onError) && Zl6.func(Y.write)
        }
        A.is = q
    })($o4 || (jo4.MessageWriter = $o4 = {}));
    class Rm8 {
        constructor() {
            this.errorEmitter = new wo4.Emitter, this.closeEmitter = new wo4.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(A, q, K) {
            this.errorEmitter.fire([this.asError(A), q, K])
        }
        get onClose() {
            return this.closeEmitter.event
        }
        fireClose() {
            this.closeEmitter.fire(void 0)
        }
        asError(A) {
            if (A instanceof Error) return A;
            else return Error(`Writer received error. Reason: ${Zl6.string(A.message)?A.message:"unknown"}`)
        }
    }
    jo4.AbstractMessageWriter = Rm8;
    var Lm8;
    (function(A) {
        function q(K) {
            if (K === void 0 || typeof K === "string") return {
                charset: K ?? "utf-8",
                contentTypeEncoder: (0, _o4.default)().applicationJson.encoder
            };
            else return {
                charset: K.charset ?? "utf-8",
                contentEncoder: K.contentEncoder,
                contentTypeEncoder: K.contentTypeEncoder ?? (0, _o4.default)().applicationJson.encoder
            }
        }
        A.fromOptions = q
    })(Lm8 || (Lm8 = {}));
    class Ho4 extends Rm8 {
        constructor(A, q) {
            super();
            this.writable = A, this.options = Lm8.fromOptions(q), this.errorCount = 0, this.writeSemaphore = new OEY.Semaphore(1), this.writable.onError((K) => this.fireError(K)), this.writable.onClose(() => this.fireClose())
        }
        async write(A) {
            return this.writeSemaphore.lock(async () => {
                return this.options.contentTypeEncoder.encode(A, this.options).then((K) => {
                    if (this.options.contentEncoder !== void 0) return this.options.contentEncoder.encode(K);
                    else return K
                }).then((K) => {
                    let Y = [];
                    return Y.push($EY, K.byteLength.toString(), Oo4), Y.push(Oo4), this.doWrite(A, Y, K)
                }, (K) => {
                    throw this.fireError(K), K
                })
            })
        }
        async doWrite(A, q, K) {
            try {
                return await this.writable.write(q.join(""), "ascii"), this.writable.write(K)
            } catch (Y) {
                return this.handleError(Y, A), Promise.reject(Y)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {
            this.writable.end()
        }
    }
    jo4.WriteableStreamMessageWriter = Ho4
})
// @from(Ln 340678, Col 4)
Wo4 = x((Xo4) => {
    Object.defineProperty(Xo4, "__esModule", {
        value: !0
    });
    Xo4.AbstractMessageBuffer = void 0;
    var JEY = 13,
        MEY = 10,
        DEY = `\r
`;
    class Do4 {
        constructor(A = "utf-8") {
            this._encoding = A, this._chunks = [], this._totalLength = 0
        }
        get encoding() {
            return this._encoding
        }
        append(A) {
            let q = typeof A === "string" ? this.fromString(A, this._encoding) : A;
            this._chunks.push(q), this._totalLength += q.byteLength
        }
        tryReadHeaders(A = !1) {
            if (this._chunks.length === 0) return;
            let q = 0,
                K = 0,
                Y = 0,
                z = 0;
            A: while (K < this._chunks.length) {
                let $ = this._chunks[K];
                Y = 0;
                q: while (Y < $.length) {
                    switch ($[Y]) {
                        case JEY:
                            switch (q) {
                                case 0:
                                    q = 1;
                                    break;
                                case 2:
                                    q = 3;
                                    break;
                                default:
                                    q = 0
                            }
                            break;
                        case MEY:
                            switch (q) {
                                case 1:
                                    q = 2;
                                    break;
                                case 3:
                                    q = 4, Y++;
                                    break A;
                                default:
                                    q = 0
                            }
                            break;
                        default:
                            q = 0
                    }
                    Y++
                }
                z += $.byteLength, K++
            }
            if (q !== 4) return;
            let _ = this._read(z + Y),
                w = new Map,
                O = this.toString(_, "ascii").split(DEY);
            if (O.length < 2) return w;
            for (let $ = 0; $ < O.length - 2; $++) {
                let H = O[$],
                    j = H.indexOf(":");
                if (j === -1) throw Error(`Message header must separate key and value using ':'
${H}`);
                let J = H.substr(0, j),
                    M = H.substr(j + 1).trim();
                w.set(A ? J.toLowerCase() : J, M)
            }
            return w
        }
        tryReadBody(A) {
            if (this._totalLength < A) return;
            return this._read(A)
        }
        get numberOfBytes() {
            return this._totalLength
        }
        _read(A) {
            if (A === 0) return this.emptyBuffer();
            if (A > this._totalLength) throw Error("Cannot read so many bytes!");
            if (this._chunks[0].byteLength === A) {
                let z = this._chunks[0];
                return this._chunks.shift(), this._totalLength -= A, this.asNative(z)
            }
            if (this._chunks[0].byteLength > A) {
                let z = this._chunks[0],
                    _ = this.asNative(z, A);
                return this._chunks[0] = z.slice(A), this._totalLength -= A, _
            }
            let q = this.allocNative(A),
                K = 0,
                Y = 0;
            while (A > 0) {
                let z = this._chunks[Y];
                if (z.byteLength > A) {
                    let _ = z.slice(0, A);
                    q.set(_, K), K += A, this._chunks[Y] = z.slice(A), this._totalLength -= A, A -= A
                } else q.set(z, K), K += z.byteLength, this._chunks.shift(), this._totalLength -= z.byteLength, A -= z.byteLength
            }
            return q
        }
    }
    Xo4.AbstractMessageBuffer = Do4
})
// @from(Ln 340790, Col 4)
Lo4 = x((No4) => {
    Object.defineProperty(No4, "__esModule", {
        value: !0
    });
    No4.createMessageConnection = No4.ConnectionOptions = No4.MessageStrategy = No4.CancellationStrategy = No4.CancellationSenderStrategy = No4.CancellationReceiverStrategy = No4.RequestCancellationReceiverStrategy = No4.IdCancellationReceiverStrategy = No4.ConnectionStrategy = No4.ConnectionError = No4.ConnectionErrors = No4.LogTraceNotification = No4.SetTraceNotification = No4.TraceFormat = No4.TraceValues = No4.Trace = No4.NullLogger = No4.ProgressType = No4.ProgressToken = void 0;
    var Zo4 = B66(),
        KH = nf6(),
        BK = Pm8(),
        Go4 = Zm8(),
        Gl6 = rf6(),
        hm8 = RV1(),
        vl6;
    (function(A) {
        A.type = new BK.NotificationType("$/cancelRequest")
    })(vl6 || (vl6 = {}));
    var Sm8;
    (function(A) {
        function q(K) {
            return typeof K === "string" || typeof K === "number"
        }
        A.is = q
    })(Sm8 || (No4.ProgressToken = Sm8 = {}));
    var fl6;
    (function(A) {
        A.type = new BK.NotificationType("$/progress")
    })(fl6 || (fl6 = {}));
    class vo4 {
        constructor() {}
    }
    No4.ProgressType = vo4;
    var Cm8;
    (function(A) {
        function q(K) {
            return KH.func(K)
        }
        A.is = q
    })(Cm8 || (Cm8 = {}));
    No4.NullLogger = Object.freeze({
        error: () => {},
        warn: () => {},
        info: () => {},
        log: () => {}
    });
    var nz;
    (function(A) {
        A[A.Off = 0] = "Off", A[A.Messages = 1] = "Messages", A[A.Compact = 2] = "Compact", A[A.Verbose = 3] = "Verbose"
    })(nz || (No4.Trace = nz = {}));
    var fo4;
    (function(A) {
        A.Off = "off", A.Messages = "messages", A.Compact = "compact", A.Verbose = "verbose"
    })(fo4 || (No4.TraceValues = fo4 = {}));
    (function(A) {
        function q(Y) {
            if (!KH.string(Y)) return A.Off;
            switch (Y = Y.toLowerCase(), Y) {
                case "off":
                    return A.Off;
                case "messages":
                    return A.Messages;
                case "compact":
                    return A.Compact;
                case "verbose":
                    return A.Verbose;
                default:
                    return A.Off
            }
        }
        A.fromString = q;

        function K(Y) {
            switch (Y) {
                case A.Off:
                    return "off";
                case A.Messages:
                    return "messages";
                case A.Compact:
                    return "compact";
                case A.Verbose:
                    return "verbose";
                default:
                    return "off"
            }
        }
        A.toString = K
    })(nz || (No4.Trace = nz = {}));
    var XE;
    (function(A) {
        A.Text = "text", A.JSON = "json"
    })(XE || (No4.TraceFormat = XE = {}));
    (function(A) {
        function q(K) {
            if (!KH.string(K)) return A.Text;
            if (K = K.toLowerCase(), K === "json") return A.JSON;
            else return A.Text
        }
        A.fromString = q
    })(XE || (No4.TraceFormat = XE = {}));
    var Im8;
    (function(A) {
        A.type = new BK.NotificationType("$/setTrace")
    })(Im8 || (No4.SetTraceNotification = Im8 = {}));
    var hV1;
    (function(A) {
        A.type = new BK.NotificationType("$/logTrace")
    })(hV1 || (No4.LogTraceNotification = hV1 = {}));
    var Tl6;
    (function(A) {
        A[A.Closed = 1] = "Closed", A[A.Disposed = 2] = "Disposed", A[A.AlreadyListening = 3] = "AlreadyListening"
    })(Tl6 || (No4.ConnectionErrors = Tl6 = {}));
    class af6 extends Error {
        constructor(A, q) {
            super(q);
            this.code = A, Object.setPrototypeOf(this, af6.prototype)
        }
    }
    No4.ConnectionError = af6;
    var bm8;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && KH.func(Y.cancelUndispatched)
        }
        A.is = q
    })(bm8 || (No4.ConnectionStrategy = bm8 = {}));
    var SV1;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && (Y.kind === void 0 || Y.kind === "id") && KH.func(Y.createCancellationTokenSource) && (Y.dispose === void 0 || KH.func(Y.dispose))
        }
        A.is = q
    })(SV1 || (No4.IdCancellationReceiverStrategy = SV1 = {}));
    var xm8;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && Y.kind === "request" && KH.func(Y.createCancellationTokenSource) && (Y.dispose === void 0 || KH.func(Y.dispose))
        }
        A.is = q
    })(xm8 || (No4.RequestCancellationReceiverStrategy = xm8 = {}));
    var CV1;
    (function(A) {
        A.Message = Object.freeze({
            createCancellationTokenSource(K) {
                return new hm8.CancellationTokenSource
            }
        });

        function q(K) {
            return SV1.is(K) || xm8.is(K)
        }
        A.is = q
    })(CV1 || (No4.CancellationReceiverStrategy = CV1 = {}));
    var IV1;
    (function(A) {
        A.Message = Object.freeze({
            sendCancellation(K, Y) {
                return K.sendNotification(vl6.type, {
                    id: Y
                })
            },
            cleanup(K) {}
        });

        function q(K) {
            let Y = K;
            return Y && KH.func(Y.sendCancellation) && KH.func(Y.cleanup)
        }
        A.is = q
    })(IV1 || (No4.CancellationSenderStrategy = IV1 = {}));
    var bV1;
    (function(A) {
        A.Message = Object.freeze({
            receiver: CV1.Message,
            sender: IV1.Message
        });

        function q(K) {
            let Y = K;
            return Y && CV1.is(Y.receiver) && IV1.is(Y.sender)
        }
        A.is = q
    })(bV1 || (No4.CancellationStrategy = bV1 = {}));
    var xV1;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && KH.func(Y.handleMessage)
        }
        A.is = q
    })(xV1 || (No4.MessageStrategy = xV1 = {}));
    var To4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && (bV1.is(Y.cancellationStrategy) || bm8.is(Y.connectionStrategy) || xV1.is(Y.messageStrategy))
        }
        A.is = q
    })(To4 || (No4.ConnectionOptions = To4 = {}));
    var Cb;
    (function(A) {
        A[A.New = 1] = "New", A[A.Listening = 2] = "Listening", A[A.Closed = 3] = "Closed", A[A.Disposed = 4] = "Disposed"
    })(Cb || (Cb = {}));

    function XEY(A, q, K, Y) {
        let z = K !== void 0 ? K : No4.NullLogger,
            _ = 0,
            w = 0,
            O = 0,
            $ = "2.0",
            H = void 0,
            j = new Map,
            J = void 0,
            M = new Map,
            D = new Map,
            X, P = new Go4.LinkedMap,
            W = new Map,
            Z = new Set,
            G = new Map,
            f = nz.Off,
            v = XE.Text,
            N, V = Cb.New,
            L = new Gl6.Emitter,
            h = new Gl6.Emitter,
            R = new Gl6.Emitter,
            u = new Gl6.Emitter,
            I = new Gl6.Emitter,
            g = Y && Y.cancellationStrategy ? Y.cancellationStrategy : bV1.Message;

        function B(V6) {
            if (V6 === null) throw Error("Can't send requests with id null since the response can't be correlated.");
            return "req-" + V6.toString()
        }

        function b(V6) {
            if (V6 === null) return "res-unknown-" + (++O).toString();
            else return "res-" + V6.toString()
        }

        function p() {
            return "not-" + (++w).toString()
        }

        function Q(V6, b6) {
            if (BK.Message.isRequest(b6)) V6.set(B(b6.id), b6);
            else if (BK.Message.isResponse(b6)) V6.set(b(b6.id), b6);
            else V6.set(p(), b6)
        }

        function U(V6) {
            return
        }

        function r() {
            return V === Cb.Listening
        }

        function e() {
            return V === Cb.Closed
        }

        function Y6() {
            return V === Cb.Disposed
        }

        function H6() {
            if (V === Cb.New || V === Cb.Listening) V = Cb.Closed, h.fire(void 0)
        }

        function J6(V6) {
            L.fire([V6, void 0, void 0])
        }

        function K6(V6) {
            L.fire(V6)
        }
        A.onClose(H6), A.onError(J6), q.onClose(H6), q.onError(K6);

        function s() {
            if (X || P.size === 0) return;
            X = (0, Zo4.default)().timer.setImmediate(() => {
                X = void 0, z6()
            })
        }

        function X6(V6) {
            if (BK.Message.isRequest(V6)) $6(V6);
            else if (BK.Message.isNotification(V6)) o(V6);
            else if (BK.Message.isResponse(V6)) n(V6);
            else a(V6)
        }

        function z6() {
            if (P.size === 0) return;
            let V6 = P.shift();
            try {
                let b6 = Y?.messageStrategy;
                if (xV1.is(b6)) b6.handleMessage(V6, X6);
                else X6(V6)
            } finally {
                s()
            }
        }
        let N6 = (V6) => {
            try {
                if (BK.Message.isNotification(V6) && V6.method === vl6.type.method) {
                    let b6 = V6.params.id,
                        E6 = B(b6),
                        U6 = P.get(E6);
                    if (BK.Message.isRequest(U6)) {
                        let K1 = Y?.connectionStrategy,
                            j6 = K1 && K1.cancelUndispatched ? K1.cancelUndispatched(U6, U) : U(U6);
                        if (j6 && (j6.error !== void 0 || j6.result !== void 0)) {
                            P.delete(E6), G.delete(b6), j6.id = U6.id, w6(j6, V6.method, Date.now()), q.write(j6).catch(() => z.error("Sending response for canceled message failed."));
                            return
                        }
                    }
                    let c6 = G.get(b6);
                    if (c6 !== void 0) {
                        c6.cancel(), L6(V6);
                        return
                    } else Z.add(b6)
                }
                Q(P, V6)
            } finally {
                s()
            }
        };

        function $6(V6) {
            if (Y6()) return;

            function b6(n6, d6, S6) {
                let g6 = {
                    jsonrpc: $,
                    id: V6.id
                };
                if (n6 instanceof BK.ResponseError) g6.error = n6.toJson();
                else g6.result = n6 === void 0 ? null : n6;
                w6(g6, d6, S6), q.write(g6).catch(() => z.error("Sending response failed."))
            }

            function E6(n6, d6, S6) {
                let g6 = {
                    jsonrpc: $,
                    id: V6.id,
                    error: n6.toJson()
                };
                w6(g6, d6, S6), q.write(g6).catch(() => z.error("Sending response failed."))
            }

            function U6(n6, d6, S6) {
                if (n6 === void 0) n6 = null;
                let g6 = {
                    jsonrpc: $,
                    id: V6.id,
                    result: n6
                };
                w6(g6, d6, S6), q.write(g6).catch(() => z.error("Sending response failed."))
            }
            O6(V6);
            let c6 = j.get(V6.method),
                K1, j6;
            if (c6) K1 = c6.type, j6 = c6.handler;
            let W6 = Date.now();
            if (j6 || H) {
                let n6 = V6.id ?? String(Date.now()),
                    d6 = SV1.is(g.receiver) ? g.receiver.createCancellationTokenSource(n6) : g.receiver.createCancellationTokenSource(V6);
                if (V6.id !== null && Z.has(V6.id)) d6.cancel();
                if (V6.id !== null) G.set(n6, d6);
                try {
                    let S6;
                    if (j6)
                        if (V6.params === void 0) {
                            if (K1 !== void 0 && K1.numberOfParams !== 0) {
                                E6(new BK.ResponseError(BK.ErrorCodes.InvalidParams, `Request ${V6.method} defines ${K1.numberOfParams} params but received none.`), V6.method, W6);
                                return
                            }
                            S6 = j6(d6.token)
                        } else if (Array.isArray(V6.params)) {
                        if (K1 !== void 0 && K1.parameterStructures === BK.ParameterStructures.byName) {
                            E6(new BK.ResponseError(BK.ErrorCodes.InvalidParams, `Request ${V6.method} defines parameters by name but received parameters by position`), V6.method, W6);
                            return
                        }
                        S6 = j6(...V6.params, d6.token)
                    } else {
                        if (K1 !== void 0 && K1.parameterStructures === BK.ParameterStructures.byPosition) {
                            E6(new BK.ResponseError(BK.ErrorCodes.InvalidParams, `Request ${V6.method} defines parameters by position but received parameters by name`), V6.method, W6);
                            return
                        }
                        S6 = j6(V6.params, d6.token)
                    } else if (H) S6 = H(V6.method, V6.params, d6.token);
                    let g6 = S6;
                    if (!S6) G.delete(n6), U6(S6, V6.method, W6);
                    else if (g6.then) g6.then((D1) => {
                        G.delete(n6), b6(D1, V6.method, W6)
                    }, (D1) => {
                        if (G.delete(n6), D1 instanceof BK.ResponseError) E6(D1, V6.method, W6);
                        else if (D1 && KH.string(D1.message)) E6(new BK.ResponseError(BK.ErrorCodes.InternalError, `Request ${V6.method} failed with message: ${D1.message}`), V6.method, W6);
                        else E6(new BK.ResponseError(BK.ErrorCodes.InternalError, `Request ${V6.method} failed unexpectedly without providing any details.`), V6.method, W6)
                    });
                    else G.delete(n6), b6(S6, V6.method, W6)
                } catch (S6) {
                    if (G.delete(n6), S6 instanceof BK.ResponseError) b6(S6, V6.method, W6);
                    else if (S6 && KH.string(S6.message)) E6(new BK.ResponseError(BK.ErrorCodes.InternalError, `Request ${V6.method} failed with message: ${S6.message}`), V6.method, W6);
                    else E6(new BK.ResponseError(BK.ErrorCodes.InternalError, `Request ${V6.method} failed unexpectedly without providing any details.`), V6.method, W6)
                }
            } else E6(new BK.ResponseError(BK.ErrorCodes.MethodNotFound, `Unhandled method ${V6.method}`), V6.method, W6)
        }

        function n(V6) {
            if (Y6()) return;
            if (V6.id === null)
                if (V6.error) z.error(`Received response message without id: Error is: 
${JSON.stringify(V6.error,void 0,4)}`);
                else z.error("Received response message without id. No further error information provided.");
            else {
                let b6 = V6.id,
                    E6 = W.get(b6);
                if (y6(V6, E6), E6 !== void 0) {
                    W.delete(b6);
                    try {
                        if (V6.error) {
                            let U6 = V6.error;
                            E6.reject(new BK.ResponseError(U6.code, U6.message, U6.data))
                        } else if (V6.result !== void 0) E6.resolve(V6.result);
                        else throw Error("Should never happen.")
                    } catch (U6) {
                        if (U6.message) z.error(`Response handler '${E6.method}' failed with message: ${U6.message}`);
                        else z.error(`Response handler '${E6.method}' failed unexpectedly.`)
                    }
                }
            }
        }

        function o(V6) {
            if (Y6()) return;
            let b6 = void 0,
                E6;
            if (V6.method === vl6.type.method) {
                let U6 = V6.params.id;
                Z.delete(U6), L6(V6);
                return
            } else {
                let U6 = M.get(V6.method);
                if (U6) E6 = U6.handler, b6 = U6.type
            }
            if (E6 || J) try {
                if (L6(V6), E6)
                    if (V6.params === void 0) {
                        if (b6 !== void 0) {
                            if (b6.numberOfParams !== 0 && b6.parameterStructures !== BK.ParameterStructures.byName) z.error(`Notification ${V6.method} defines ${b6.numberOfParams} params but received none.`)
                        }
                        E6()
                    } else if (Array.isArray(V6.params)) {
                    let U6 = V6.params;
                    if (V6.method === fl6.type.method && U6.length === 2 && Sm8.is(U6[0])) E6({
                        token: U6[0],
                        value: U6[1]
                    });
                    else {
                        if (b6 !== void 0) {
                            if (b6.parameterStructures === BK.ParameterStructures.byName) z.error(`Notification ${V6.method} defines parameters by name but received parameters by position`);
                            if (b6.numberOfParams !== V6.params.length) z.error(`Notification ${V6.method} defines ${b6.numberOfParams} params but received ${U6.length} arguments`)
                        }
                        E6(...U6)
                    }
                } else {
                    if (b6 !== void 0 && b6.parameterStructures === BK.ParameterStructures.byPosition) z.error(`Notification ${V6.method} defines parameters by position but received parameters by name`);
                    E6(V6.params)
                } else if (J) J(V6.method, V6.params)
            } catch (U6) {
                if (U6.message) z.error(`Notification handler '${V6.method}' failed with message: ${U6.message}`);
                else z.error(`Notification handler '${V6.method}' failed unexpectedly.`)
            } else R.fire(V6)
        }

        function a(V6) {
            if (!V6) {
                z.error("Received empty message.");
                return
            }
            z.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(V6,null,4)}`);
            let b6 = V6;
            if (KH.string(b6.id) || KH.number(b6.id)) {
                let E6 = b6.id,
                    U6 = W.get(E6);
                if (U6) U6.reject(Error("The received response has neither a result nor an error property."))
            }
        }

        function i(V6) {
            if (V6 === void 0 || V6 === null) return;
            switch (f) {
                case nz.Verbose:
                    return JSON.stringify(V6, null, 4);
                case nz.Compact:
                    return JSON.stringify(V6);
                default:
                    return
            }
        }

        function l(V6) {
            if (f === nz.Off || !N) return;
            if (v === XE.Text) {
                let b6 = void 0;
                if ((f === nz.Verbose || f === nz.Compact) && V6.params) b6 = `Params: ${i(V6.params)}

`;
                N.log(`Sending request '${V6.method} - (${V6.id})'.`, b6)
            } else G6("send-request", V6)
        }

        function q6(V6) {
            if (f === nz.Off || !N) return;
            if (v === XE.Text) {
                let b6 = void 0;
                if (f === nz.Verbose || f === nz.Compact)
                    if (V6.params) b6 = `Params: ${i(V6.params)}

`;
                    else b6 = `No parameters provided.

`;
                N.log(`Sending notification '${V6.method}'.`, b6)
            } else G6("send-notification", V6)
        }

        function w6(V6, b6, E6) {
            if (f === nz.Off || !N) return;
            if (v === XE.Text) {
                let U6 = void 0;
                if (f === nz.Verbose || f === nz.Compact) {
                    if (V6.error && V6.error.data) U6 = `Error data: ${i(V6.error.data)}

`;
                    else if (V6.result) U6 = `Result: ${i(V6.result)}

`;
                    else if (V6.error === void 0) U6 = `No result returned.

`
                }
                N.log(`Sending response '${b6} - (${V6.id})'. Processing request took ${Date.now()-E6}ms`, U6)
            } else G6("send-response", V6)
        }

        function O6(V6) {
            if (f === nz.Off || !N) return;
            if (v === XE.Text) {
                let b6 = void 0;
                if ((f === nz.Verbose || f === nz.Compact) && V6.params) b6 = `Params: ${i(V6.params)}

`;
                N.log(`Received request '${V6.method} - (${V6.id})'.`, b6)
            } else G6("receive-request", V6)
        }

        function L6(V6) {
            if (f === nz.Off || !N || V6.method === hV1.type.method) return;
            if (v === XE.Text) {
                let b6 = void 0;
                if (f === nz.Verbose || f === nz.Compact)
                    if (V6.params) b6 = `Params: ${i(V6.params)}

`;
                    else b6 = `No parameters provided.

`;
                N.log(`Received notification '${V6.method}'.`, b6)
            } else G6("receive-notification", V6)
        }

        function y6(V6, b6) {
            if (f === nz.Off || !N) return;
            if (v === XE.Text) {
                let E6 = void 0;
                if (f === nz.Verbose || f === nz.Compact) {
                    if (V6.error && V6.error.data) E6 = `Error data: ${i(V6.error.data)}

`;
                    else if (V6.result) E6 = `Result: ${i(V6.result)}

`;
                    else if (V6.error === void 0) E6 = `No result returned.

`
                }
                if (b6) {
                    let U6 = V6.error ? ` Request failed: ${V6.error.message} (${V6.error.code}).` : "";
                    N.log(`Received response '${b6.method} - (${V6.id})' in ${Date.now()-b6.timerStart}ms.${U6}`, E6)
                } else N.log(`Received response ${V6.id} without active response promise.`, E6)
            } else G6("receive-response", V6)
        }

        function G6(V6, b6) {
            if (!N || f === nz.Off) return;
            let E6 = {
                isLSPMessage: !0,
                type: V6,
                message: b6,
                timestamp: Date.now()
            };
            N.log(E6)
        }

        function R6() {
            if (e()) throw new af6(Tl6.Closed, "Connection is closed.");
            if (Y6()) throw new af6(Tl6.Disposed, "Connection is disposed.")
        }

        function T6() {
            if (r()) throw new af6(Tl6.AlreadyListening, "Connection is already listening")
        }

        function D6() {
            if (!r()) throw Error("Call listen() first.")
        }

        function Q6(V6) {
            if (V6 === void 0) return null;
            else return V6
        }

        function k6(V6) {
            if (V6 === null) return;
            else return V6
        }

        function Z6(V6) {
            return V6 !== void 0 && V6 !== null && !Array.isArray(V6) && typeof V6 === "object"
        }

        function u6(V6, b6) {
            switch (V6) {
                case BK.ParameterStructures.auto:
                    if (Z6(b6)) return k6(b6);
                    else return [Q6(b6)];
                case BK.ParameterStructures.byName:
                    if (!Z6(b6)) throw Error("Received parameters by name but param is not an object literal.");
                    return k6(b6);
                case BK.ParameterStructures.byPosition:
                    return [Q6(b6)];
                default:
                    throw Error(`Unknown parameter structure ${V6.toString()}`)
            }
        }

        function C6(V6, b6) {
            let E6, U6 = V6.numberOfParams;
            switch (U6) {
                case 0:
                    E6 = void 0;
                    break;
                case 1:
                    E6 = u6(V6.parameterStructures, b6[0]);
                    break;
                default:
                    E6 = [];
                    for (let c6 = 0; c6 < b6.length && c6 < U6; c6++) E6.push(Q6(b6[c6]));
                    if (b6.length < U6)
                        for (let c6 = b6.length; c6 < U6; c6++) E6.push(null);
                    break
            }
            return E6
        }
        let o6 = {
            sendNotification: (V6, ...b6) => {
                R6();
                let E6, U6;
                if (KH.string(V6)) {
                    E6 = V6;
                    let K1 = b6[0],
                        j6 = 0,
                        W6 = BK.ParameterStructures.auto;
                    if (BK.ParameterStructures.is(K1)) j6 = 1, W6 = K1;
                    let n6 = b6.length,
                        d6 = n6 - j6;
                    switch (d6) {
                        case 0:
                            U6 = void 0;
                            break;
                        case 1:
                            U6 = u6(W6, b6[j6]);
                            break;
                        default:
                            if (W6 === BK.ParameterStructures.byName) throw Error(`Received ${d6} parameters for 'by Name' notification parameter structure.`);
                            U6 = b6.slice(j6, n6).map((S6) => Q6(S6));
                            break
                    }
                } else {
                    let K1 = b6;
                    E6 = V6.method, U6 = C6(V6, K1)
                }
                let c6 = {
                    jsonrpc: $,
                    method: E6,
                    params: U6
                };
                return q6(c6), q.write(c6).catch((K1) => {
                    throw z.error("Sending notification failed."), K1
                })
            },
            onNotification: (V6, b6) => {
                R6();
                let E6;
                if (KH.func(V6)) J = V6;
                else if (b6)
                    if (KH.string(V6)) E6 = V6, M.set(V6, {
                        type: void 0,
                        handler: b6
                    });
                    else E6 = V6.method, M.set(V6.method, {
                        type: V6,
                        handler: b6
                    });
                return {
                    dispose: () => {
                        if (E6 !== void 0) M.delete(E6);
                        else J = void 0
                    }
                }
            },
            onProgress: (V6, b6, E6) => {
                if (D.has(b6)) throw Error(`Progress handler for token ${b6} already registered`);
                return D.set(b6, E6), {
                    dispose: () => {
                        D.delete(b6)
                    }
                }
            },
            sendProgress: (V6, b6, E6) => {
                return o6.sendNotification(fl6.type, {
                    token: b6,
                    value: E6
                })
            },
            onUnhandledProgress: u.event,
            sendRequest: (V6, ...b6) => {
                R6(), D6();
                let E6, U6, c6 = void 0;
                if (KH.string(V6)) {
                    E6 = V6;
                    let n6 = b6[0],
                        d6 = b6[b6.length - 1],
                        S6 = 0,
                        g6 = BK.ParameterStructures.auto;
                    if (BK.ParameterStructures.is(n6)) S6 = 1, g6 = n6;
                    let D1 = b6.length;
                    if (hm8.CancellationToken.is(d6)) D1 = D1 - 1, c6 = d6;
                    let J1 = D1 - S6;
                    switch (J1) {
                        case 0:
                            U6 = void 0;
                            break;
                        case 1:
                            U6 = u6(g6, b6[S6]);
                            break;
                        default:
                            if (g6 === BK.ParameterStructures.byName) throw Error(`Received ${J1} parameters for 'by Name' request parameter structure.`);
                            U6 = b6.slice(S6, D1).map((E1) => Q6(E1));
                            break
                    }
                } else {
                    let n6 = b6;
                    E6 = V6.method, U6 = C6(V6, n6);
                    let d6 = V6.numberOfParams;
                    c6 = hm8.CancellationToken.is(n6[d6]) ? n6[d6] : void 0
                }
                let K1 = _++,
                    j6;
                if (c6) j6 = c6.onCancellationRequested(() => {
                    let n6 = g.sender.sendCancellation(o6, K1);
                    if (n6 === void 0) return z.log(`Received no promise from cancellation strategy when cancelling id ${K1}`), Promise.resolve();
                    else return n6.catch(() => {
                        z.log(`Sending cancellation messages for id ${K1} failed`)
                    })
                });
                let W6 = {
                    jsonrpc: $,
                    id: K1,
                    method: E6,
                    params: U6
                };
                if (l(W6), typeof g.sender.enableCancellation === "function") g.sender.enableCancellation(W6);
                return new Promise(async (n6, d6) => {
                    let S6 = (J1) => {
                            n6(J1), g.sender.cleanup(K1), j6?.dispose()
                        },
                        g6 = (J1) => {
                            d6(J1), g.sender.cleanup(K1), j6?.dispose()
                        },
                        D1 = {
                            method: E6,
                            timerStart: Date.now(),
                            resolve: S6,
                            reject: g6
                        };
                    try {
                        W.set(K1, D1), await q.write(W6)
                    } catch (J1) {
                        throw W.delete(K1), D1.reject(new BK.ResponseError(BK.ErrorCodes.MessageWriteError, J1.message ? J1.message : "Unknown reason")), z.error("Sending request failed."), J1
                    }
                })
            },
            onRequest: (V6, b6) => {
                R6();
                let E6 = null;
                if (Cm8.is(V6)) E6 = void 0, H = V6;
                else if (KH.string(V6)) {
                    if (E6 = null, b6 !== void 0) E6 = V6, j.set(V6, {
                        handler: b6,
                        type: void 0
                    })
                } else if (b6 !== void 0) E6 = V6.method, j.set(V6.method, {
                    type: V6,
                    handler: b6
                });
                return {
                    dispose: () => {
                        if (E6 === null) return;
                        if (E6 !== void 0) j.delete(E6);
                        else H = void 0
                    }
                }
            },
            hasPendingResponse: () => {
                return W.size > 0
            },
            trace: async (V6, b6, E6) => {
                let U6 = !1,
                    c6 = XE.Text;
                if (E6 !== void 0)
                    if (KH.boolean(E6)) U6 = E6;
                    else U6 = E6.sendNotification || !1, c6 = E6.traceFormat || XE.Text;
                if (f = V6, v = c6, f === nz.Off) N = void 0;
                else N = b6;
                if (U6 && !e() && !Y6()) await o6.sendNotification(Im8.type, {
                    value: nz.toString(V6)
                })
            },
            onError: L.event,
            onClose: h.event,
            onUnhandledNotification: R.event,
            onDispose: I.event,
            end: () => {
                q.end()
            },
            dispose: () => {
                if (Y6()) return;
                V = Cb.Disposed, I.fire(void 0);
                let V6 = new BK.ResponseError(BK.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
                for (let b6 of W.values()) b6.reject(V6);
                if (W = new Map, G = new Map, Z = new Set, P = new Go4.LinkedMap, KH.func(q.dispose)) q.dispose();
                if (KH.func(A.dispose)) A.dispose()
            },
            listen: () => {
                R6(), T6(), V = Cb.Listening, A.listen(N6)
            },
            inspect: () => {
                (0, Zo4.default)().console.log("inspect")
            }
        };
        return o6.onNotification(hV1.type, (V6) => {
            if (f === nz.Off || !N) return;
            let b6 = f === nz.Verbose || f === nz.Compact;
            N.log(V6.message, b6 ? V6.verbose : void 0)
        }), o6.onNotification(fl6.type, (V6) => {
            let b6 = D.get(V6.token);
            if (b6) b6(V6.value);
            else u.fire(V6)
        }), o6
    }
    No4.createMessageConnection = XEY
})
// @from(Ln 341667, Col 4)
uV1 = x((qq) => {
    Object.defineProperty(qq, "__esModule", {
        value: !0
    });
    qq.ProgressType = qq.ProgressToken = qq.createMessageConnection = qq.NullLogger = qq.ConnectionOptions = qq.ConnectionStrategy = qq.AbstractMessageBuffer = qq.WriteableStreamMessageWriter = qq.AbstractMessageWriter = qq.MessageWriter = qq.ReadableStreamMessageReader = qq.AbstractMessageReader = qq.MessageReader = qq.SharedArrayReceiverStrategy = qq.SharedArraySenderStrategy = qq.CancellationToken = qq.CancellationTokenSource = qq.Emitter = qq.Event = qq.Disposable = qq.LRUCache = qq.Touch = qq.LinkedMap = qq.ParameterStructures = qq.NotificationType9 = qq.NotificationType8 = qq.NotificationType7 = qq.NotificationType6 = qq.NotificationType5 = qq.NotificationType4 = qq.NotificationType3 = qq.NotificationType2 = qq.NotificationType1 = qq.NotificationType0 = qq.NotificationType = qq.ErrorCodes = qq.ResponseError = qq.RequestType9 = qq.RequestType8 = qq.RequestType7 = qq.RequestType6 = qq.RequestType5 = qq.RequestType4 = qq.RequestType3 = qq.RequestType2 = qq.RequestType1 = qq.RequestType0 = qq.RequestType = qq.Message = qq.RAL = void 0;
    qq.MessageStrategy = qq.CancellationStrategy = qq.CancellationSenderStrategy = qq.CancellationReceiverStrategy = qq.ConnectionError = qq.ConnectionErrors = qq.LogTraceNotification = qq.SetTraceNotification = qq.TraceFormat = qq.TraceValues = qq.Trace = void 0;
    var Uw = Pm8();
    Object.defineProperty(qq, "Message", {
        enumerable: !0,
        get: function() {
            return Uw.Message
        }
    });
    Object.defineProperty(qq, "RequestType", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType
        }
    });
    Object.defineProperty(qq, "RequestType0", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType0
        }
    });
    Object.defineProperty(qq, "RequestType1", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType1
        }
    });
    Object.defineProperty(qq, "RequestType2", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType2
        }
    });
    Object.defineProperty(qq, "RequestType3", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType3
        }
    });
    Object.defineProperty(qq, "RequestType4", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType4
        }
    });
    Object.defineProperty(qq, "RequestType5", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType5
        }
    });
    Object.defineProperty(qq, "RequestType6", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType6
        }
    });
    Object.defineProperty(qq, "RequestType7", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType7
        }
    });
    Object.defineProperty(qq, "RequestType8", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType8
        }
    });
    Object.defineProperty(qq, "RequestType9", {
        enumerable: !0,
        get: function() {
            return Uw.RequestType9
        }
    });
    Object.defineProperty(qq, "ResponseError", {
        enumerable: !0,
        get: function() {
            return Uw.ResponseError
        }
    });
    Object.defineProperty(qq, "ErrorCodes", {
        enumerable: !0,
        get: function() {
            return Uw.ErrorCodes
        }
    });
    Object.defineProperty(qq, "NotificationType", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType
        }
    });
    Object.defineProperty(qq, "NotificationType0", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType0
        }
    });
    Object.defineProperty(qq, "NotificationType1", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType1
        }
    });
    Object.defineProperty(qq, "NotificationType2", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType2
        }
    });
    Object.defineProperty(qq, "NotificationType3", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType3
        }
    });
    Object.defineProperty(qq, "NotificationType4", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType4
        }
    });
    Object.defineProperty(qq, "NotificationType5", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType5
        }
    });
    Object.defineProperty(qq, "NotificationType6", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType6
        }
    });
    Object.defineProperty(qq, "NotificationType7", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType7
        }
    });
    Object.defineProperty(qq, "NotificationType8", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType8
        }
    });
    Object.defineProperty(qq, "NotificationType9", {
        enumerable: !0,
        get: function() {
            return Uw.NotificationType9
        }
    });
    Object.defineProperty(qq, "ParameterStructures", {
        enumerable: !0,
        get: function() {
            return Uw.ParameterStructures
        }
    });
    var um8 = Zm8();
    Object.defineProperty(qq, "LinkedMap", {
        enumerable: !0,
        get: function() {
            return um8.LinkedMap
        }
    });
    Object.defineProperty(qq, "LRUCache", {
        enumerable: !0,
        get: function() {
            return um8.LRUCache
        }
    });
    Object.defineProperty(qq, "Touch", {
        enumerable: !0,
        get: function() {
            return um8.Touch
        }
    });
    var SEY = ur4();
    Object.defineProperty(qq, "Disposable", {
        enumerable: !0,
        get: function() {
            return SEY.Disposable
        }
    });
    var Ro4 = rf6();
    Object.defineProperty(qq, "Event", {
        enumerable: !0,
        get: function() {
            return Ro4.Event
        }
    });
    Object.defineProperty(qq, "Emitter", {
        enumerable: !0,
        get: function() {
            return Ro4.Emitter
        }
    });
    var ho4 = RV1();
    Object.defineProperty(qq, "CancellationTokenSource", {
        enumerable: !0,
        get: function() {
            return ho4.CancellationTokenSource
        }
    });
    Object.defineProperty(qq, "CancellationToken", {
        enumerable: !0,
        get: function() {
            return ho4.CancellationToken
        }
    });
    var So4 = ar4();
    Object.defineProperty(qq, "SharedArraySenderStrategy", {
        enumerable: !0,
        get: function() {
            return So4.SharedArraySenderStrategy
        }
    });
    Object.defineProperty(qq, "SharedArrayReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return So4.SharedArrayReceiverStrategy
        }
    });
    var mm8 = zo4();
    Object.defineProperty(qq, "MessageReader", {
        enumerable: !0,
        get: function() {
            return mm8.MessageReader
        }
    });
    Object.defineProperty(qq, "AbstractMessageReader", {
        enumerable: !0,
        get: function() {
            return mm8.AbstractMessageReader
        }
    });
    Object.defineProperty(qq, "ReadableStreamMessageReader", {
        enumerable: !0,
        get: function() {
            return mm8.ReadableStreamMessageReader
        }
    });
    var Bm8 = Mo4();
    Object.defineProperty(qq, "MessageWriter", {
        enumerable: !0,
        get: function() {
            return Bm8.MessageWriter
        }
    });
    Object.defineProperty(qq, "AbstractMessageWriter", {
        enumerable: !0,
        get: function() {
            return Bm8.AbstractMessageWriter
        }
    });
    Object.defineProperty(qq, "WriteableStreamMessageWriter", {
        enumerable: !0,
        get: function() {
            return Bm8.WriteableStreamMessageWriter
        }
    });
    var CEY = Wo4();
    Object.defineProperty(qq, "AbstractMessageBuffer", {
        enumerable: !0,
        get: function() {
            return CEY.AbstractMessageBuffer
        }
    });
    var b0 = Lo4();
    Object.defineProperty(qq, "ConnectionStrategy", {
        enumerable: !0,
        get: function() {
            return b0.ConnectionStrategy
        }
    });
    Object.defineProperty(qq, "ConnectionOptions", {
        enumerable: !0,
        get: function() {
            return b0.ConnectionOptions
        }
    });
    Object.defineProperty(qq, "NullLogger", {
        enumerable: !0,
        get: function() {
            return b0.NullLogger
        }
    });
    Object.defineProperty(qq, "createMessageConnection", {
        enumerable: !0,
        get: function() {
            return b0.createMessageConnection
        }
    });
    Object.defineProperty(qq, "ProgressToken", {
        enumerable: !0,
        get: function() {
            return b0.ProgressToken
        }
    });
    Object.defineProperty(qq, "ProgressType", {
        enumerable: !0,
        get: function() {
            return b0.ProgressType
        }
    });
    Object.defineProperty(qq, "Trace", {
        enumerable: !0,
        get: function() {
            return b0.Trace
        }
    });
    Object.defineProperty(qq, "TraceValues", {
        enumerable: !0,
        get: function() {
            return b0.TraceValues
        }
    });
    Object.defineProperty(qq, "TraceFormat", {
        enumerable: !0,
        get: function() {
            return b0.TraceFormat
        }
    });
    Object.defineProperty(qq, "SetTraceNotification", {
        enumerable: !0,
        get: function() {
            return b0.SetTraceNotification
        }
    });
    Object.defineProperty(qq, "LogTraceNotification", {
        enumerable: !0,
        get: function() {
            return b0.LogTraceNotification
        }
    });
    Object.defineProperty(qq, "ConnectionErrors", {
        enumerable: !0,
        get: function() {
            return b0.ConnectionErrors
        }
    });
    Object.defineProperty(qq, "ConnectionError", {
        enumerable: !0,
        get: function() {
            return b0.ConnectionError
        }
    });
    Object.defineProperty(qq, "CancellationReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return b0.CancellationReceiverStrategy
        }
    });
    Object.defineProperty(qq, "CancellationSenderStrategy", {
        enumerable: !0,
        get: function() {
            return b0.CancellationSenderStrategy
        }
    });
    Object.defineProperty(qq, "CancellationStrategy", {
        enumerable: !0,
        get: function() {
            return b0.CancellationStrategy
        }
    });
    Object.defineProperty(qq, "MessageStrategy", {
        enumerable: !0,
        get: function() {
            return b0.MessageStrategy
        }
    });
    var IEY = B66();
    qq.RAL = IEY.default
})
// @from(Ln 342046, Col 4)
mo4 = x((uo4) => {
    Object.defineProperty(uo4, "__esModule", {
        value: !0
    });
    var Co4 = x6("util"),
        Gl = uV1();
    class mV1 extends Gl.AbstractMessageBuffer {
        constructor(A = "utf-8") {
            super(A)
        }
        emptyBuffer() {
            return mV1.emptyBuffer
        }
        fromString(A, q) {
            return Buffer.from(A, q)
        }
        toString(A, q) {
            if (A instanceof Buffer) return A.toString(q);
            else return new Co4.TextDecoder(q).decode(A)
        }
        asNative(A, q) {
            if (q === void 0) return A instanceof Buffer ? A : Buffer.from(A);
            else return A instanceof Buffer ? A.slice(0, q) : Buffer.from(A, 0, q)
        }
        allocNative(A) {
            return Buffer.allocUnsafe(A)
        }
    }
    mV1.emptyBuffer = Buffer.allocUnsafe(0);
    class Io4 {
        constructor(A) {
            this.stream = A
        }
        onClose(A) {
            return this.stream.on("close", A), Gl.Disposable.create(() => this.stream.off("close", A))
        }
        onError(A) {
            return this.stream.on("error", A), Gl.Disposable.create(() => this.stream.off("error", A))
        }
        onEnd(A) {
            return this.stream.on("end", A), Gl.Disposable.create(() => this.stream.off("end", A))
        }
        onData(A) {
            return this.stream.on("data", A), Gl.Disposable.create(() => this.stream.off("data", A))
        }
    }
    class bo4 {
        constructor(A) {
            this.stream = A
        }
        onClose(A) {
            return this.stream.on("close", A), Gl.Disposable.create(() => this.stream.off("close", A))
        }
        onError(A) {
            return this.stream.on("error", A), Gl.Disposable.create(() => this.stream.off("error", A))
        }
        onEnd(A) {
            return this.stream.on("end", A), Gl.Disposable.create(() => this.stream.off("end", A))
        }
        write(A, q) {
            return new Promise((K, Y) => {
                let z = (_) => {
                    if (_ === void 0 || _ === null) K();
                    else Y(_)
                };
                if (typeof A === "string") this.stream.write(A, q, z);
                else this.stream.write(A, z)
            })
        }
        end() {
            this.stream.end()
        }
    }
    var xo4 = Object.freeze({
        messageBuffer: Object.freeze({
            create: (A) => new mV1(A)
        }),
        applicationJson: Object.freeze({
            encoder: Object.freeze({
                name: "application/json",
                encode: (A, q) => {
                    try {
                        return Promise.resolve(Buffer.from(JSON.stringify(A, void 0, 0), q.charset))
                    } catch (K) {
                        return Promise.reject(K)
                    }
                }
            }),
            decoder: Object.freeze({
                name: "application/json",
                decode: (A, q) => {
                    try {
                        if (A instanceof Buffer) return Promise.resolve(JSON.parse(A.toString(q.charset)));
                        else return Promise.resolve(JSON.parse(new Co4.TextDecoder(q.charset).decode(A)))
                    } catch (K) {
                        return Promise.reject(K)
                    }
                }
            })
        }),
        stream: Object.freeze({
            asReadableStream: (A) => new Io4(A),
            asWritableStream: (A) => new bo4(A)
        }),
        console,
        timer: Object.freeze({
            setTimeout(A, q, ...K) {
                let Y = setTimeout(A, q, ...K);
                return {
                    dispose: () => clearTimeout(Y)
                }
            },
            setImmediate(A, ...q) {
                let K = setImmediate(A, ...q);
                return {
                    dispose: () => clearImmediate(K)
                }
            },
            setInterval(A, q, ...K) {
                let Y = setInterval(A, q, ...K);
                return {
                    dispose: () => clearInterval(Y)
                }
            }
        })
    });

    function gm8() {
        return xo4
    }(function(A) {
        function q() {
            Gl.RAL.install(xo4)
        }
        A.install = q
    })(gm8 || (gm8 = {}));
    uo4.default = gm8
})