
// @from(Ln 359106, Col 0)
async function $M6(q, K = []) {
    let _ = {},
        z = eKY(q.path, ".lsp.json");
    try {
        let Y = await ZJK(z, "utf-8"),
            A = n8(Y),
            O = y.record(y.string(), _G6()).safeParse(A);
        if (O.success) Object.assign(_, O.data);
        else {
            let w = `LSP config validation failed for .lsp.json in plugin ${q.name}: ${O.error.message}`;
            j6(Error(w)), K.push({
                type: "lsp-config-invalid",
                plugin: q.name,
                serverName: ".lsp.json",
                validationError: O.error.message,
                source: q.repository
            })
        }
    } catch (Y) {
        if (!t1(Y)) {
            let A = Y instanceof Error ? `Failed to read/parse .lsp.json in plugin ${q.name}: ${Y.message}` : `Failed to read/parse .lsp.json file in plugin ${q.name}`;
            j6(r1(Y)), K.push({
                type: "lsp-config-invalid",
                plugin: q.name,
                serverName: ".lsp.json",
                validationError: Y instanceof Error ? `Failed to parse JSON: ${Y.message}` : "Failed to parse JSON file",
                source: q.repository
            })
        }
    }
    if (q.manifest.lspServers) {
        let Y = await _5Y(q.manifest.lspServers, q, K);
        if (Y) Object.assign(_, Y)
    }
    return Object.keys(_).length > 0 ? _ : void 0
}
// @from(Ln 359142, Col 0)
async function _5Y(q, K, _) {
    let z = {},
        Y = Array.isArray(q) ? q : [q];
    for (let A of Y)
        if (typeof A === "string") {
            let O = K5Y(K.path, A);
            if (!O) {
                let w = `Security: Path traversal attempt blocked in plugin ${K.name}: ${A}`;
                j6(Error(w)), E(w, {
                    level: "warn"
                }), _.push({
                    type: "lsp-config-invalid",
                    plugin: K.name,
                    serverName: A,
                    validationError: "Invalid path: must be relative and within plugin directory",
                    source: K.repository
                });
                continue
            }
            try {
                let w = await ZJK(O, "utf-8"),
                    $ = n8(w),
                    j = y.record(y.string(), _G6()).safeParse($);
                if (j.success) Object.assign(z, j.data);
                else {
                    let H = `LSP config validation failed for ${A} in plugin ${K.name}: ${j.error.message}`;
                    j6(Error(H)), _.push({
                        type: "lsp-config-invalid",
                        plugin: K.name,
                        serverName: A,
                        validationError: j.error.message,
                        source: K.repository
                    })
                }
            } catch (w) {
                let $ = w instanceof Error ? `Failed to read/parse LSP config from ${A} in plugin ${K.name}: ${w.message}` : `Failed to read/parse LSP config file ${A} in plugin ${K.name}`;
                j6(r1(w)), _.push({
                    type: "lsp-config-invalid",
                    plugin: K.name,
                    serverName: A,
                    validationError: w instanceof Error ? `Failed to parse JSON: ${w.message}` : "Failed to parse JSON file",
                    source: K.repository
                })
            }
        } else
            for (let [O, w] of Object.entries(A)) {
                let $ = _G6().safeParse(w);
                if ($.success) z[O] = $.data;
                else {
                    let j = `LSP config validation failed for inline server "${O}" in plugin ${K.name}: ${$.error.message}`;
                    j6(Error(j)), _.push({
                        type: "lsp-config-invalid",
                        plugin: K.name,
                        serverName: O,
                        validationError: $.error.message,
                        source: K.repository
                    })
                }
            }
    return Object.keys(z).length > 0 ? z : void 0
}
// @from(Ln 359204, Col 0)
function z5Y(q, K, _, z) {
    let Y = [],
        A = ($) => {
            let j = fx($, K);
            if (_) j = I56(j, _);
            let {
                expanded: H,
                missingVars: J
            } = o36(j);
            return Y.push(...J), H
        },
        O = {
            ...q
        };
    if (O.command) O.command = A(O.command);
    if (O.args) O.args = O.args.map(($) => A($));
    let w = {
        CLAUDE_PLUGIN_ROOT: K.path,
        CLAUDE_PLUGIN_DATA: Is(K.source),
        ...O.env || {}
    };
    for (let [$, j] of Object.entries(w))
        if ($ !== "CLAUDE_PLUGIN_ROOT" && $ !== "CLAUDE_PLUGIN_DATA") w[$] = A(j);
    if (O.env = w, O.workspaceFolder) O.workspaceFolder = A(O.workspaceFolder);
    if (Y.length > 0) {
        let j = `Missing environment variables in plugin LSP config: ${F4(Y).join(", ")}`;
        j6(Error(j)), E(j, {
            level: "warn"
        })
    }
    return O
}
// @from(Ln 359237, Col 0)
function Y5Y(q, K) {
    let _ = {};
    for (let [z, Y] of Object.entries(q)) {
        let A = `plugin:${K}:${z}`;
        _[A] = {
            ...Y,
            scope: "dynamic",
            source: K
        }
    }
    return _
}
// @from(Ln 359249, Col 0)
async function fJK(q, K = []) {
    if (!q.enabled) return;
    let _ = q.lspServers || await $M6(q, K);
    if (!_) return;
    let z = q.manifest.userConfig ? ID(uH6(q)) : void 0,
        Y = {};
    for (let [A, O] of Object.entries(_)) Y[A] = z5Y(O, q, z, K);
    return Y5Y(Y, q.name)
}
// @from(Ln 359258, Col 4)
aK8 = L(() => {
    p7();
    K8();
    m8();
    U8();
    e8();
    Jy();
    Gx();
    Hv()
})
// @from(Ln 359268, Col 0)
async function GJK() {
    let q = {};
    try {
        let {
            enabled: K
        } = await Gj(), _ = await Promise.all(K.map(async (z) => {
            let Y = [];
            try {
                let A = await fJK(z, Y);
                return {
                    plugin: z,
                    scopedServers: A,
                    errors: Y
                }
            } catch (A) {
                return E(`Failed to load LSP servers for plugin ${z.name}: ${A}`, {
                    level: "error"
                }), {
                    plugin: z,
                    scopedServers: void 0,
                    errors: Y
                }
            }
        }));
        for (let {
                plugin: z,
                scopedServers: Y,
                errors: A
            }
            of _) {
            let O = Y ? Object.keys(Y).length : 0;
            if (O > 0) Object.assign(q, Y), E(`Loaded ${O} LSP server(s) from plugin: ${z.name}`);
            if (A.length > 0) E(`${A.length} error(s) loading LSP servers from plugin: ${z.name}`)
        }
        E(`Total LSP servers loaded: ${Object.keys(q).length}`)
    } catch (K) {
        j6(r1(K)), E(`Error loading LSP servers: ${b6(K)}`)
    }
    return {
        servers: q
    }
}
// @from(Ln 359310, Col 4)
vJK = L(() => {
    K8();
    m8();
    U8();
    aK8();
    vH()
})
// @from(Ln 359317, Col 4)
jb6 = p((kJK) => {
    Object.defineProperty(kJK, "__esModule", {
        value: !0
    });
    kJK.stringArray = kJK.array = kJK.func = kJK.error = kJK.number = kJK.string = kJK.boolean = void 0;

    function A5Y(q) {
        return q === !0 || q === !1
    }
    kJK.boolean = A5Y;

    function TJK(q) {
        return typeof q === "string" || q instanceof String
    }
    kJK.string = TJK;

    function O5Y(q) {
        return typeof q === "number" || q instanceof Number
    }
    kJK.number = O5Y;

    function w5Y(q) {
        return q instanceof Error
    }
    kJK.error = w5Y;

    function $5Y(q) {
        return typeof q === "function"
    }
    kJK.func = $5Y;

    function VJK(q) {
        return Array.isArray(q)
    }
    kJK.array = VJK;

    function j5Y(q) {
        return VJK(q) && q.every((K) => TJK(K))
    }
    kJK.stringArray = j5Y
})
// @from(Ln 359358, Col 4)
Uq7 = p((rJK) => {
    Object.defineProperty(rJK, "__esModule", {
        value: !0
    });
    rJK.Message = rJK.NotificationType9 = rJK.NotificationType8 = rJK.NotificationType7 = rJK.NotificationType6 = rJK.NotificationType5 = rJK.NotificationType4 = rJK.NotificationType3 = rJK.NotificationType2 = rJK.NotificationType1 = rJK.NotificationType0 = rJK.NotificationType = rJK.RequestType9 = rJK.RequestType8 = rJK.RequestType7 = rJK.RequestType6 = rJK.RequestType5 = rJK.RequestType4 = rJK.RequestType3 = rJK.RequestType2 = rJK.RequestType1 = rJK.RequestType = rJK.RequestType0 = rJK.AbstractMessageSignature = rJK.ParameterStructures = rJK.ResponseError = rJK.ErrorCodes = void 0;
    var jM6 = jb6(),
        Fq7;
    (function(q) {
        q.ParseError = -32700, q.InvalidRequest = -32600, q.MethodNotFound = -32601, q.InvalidParams = -32602, q.InternalError = -32603, q.jsonrpcReservedErrorRangeStart = -32099, q.serverErrorStart = -32099, q.MessageWriteError = -32099, q.MessageReadError = -32098, q.PendingResponseRejected = -32097, q.ConnectionInactive = -32096, q.ServerNotInitialized = -32002, q.UnknownErrorCode = -32001, q.jsonrpcReservedErrorRangeEnd = -32000, q.serverErrorEnd = -32000
    })(Fq7 || (rJK.ErrorCodes = Fq7 = {}));
    class gq7 extends Error {
        constructor(q, K, _) {
            super(K);
            this.code = jM6.number(q) ? q : Fq7.UnknownErrorCode, this.data = _, Object.setPrototypeOf(this, gq7.prototype)
        }
        toJson() {
            let q = {
                code: this.code,
                message: this.message
            };
            if (this.data !== void 0) q.data = this.data;
            return q
        }
    }
    rJK.ResponseError = gq7;
    class NT {
        constructor(q) {
            this.kind = q
        }
        static is(q) {
            return q === NT.auto || q === NT.byName || q === NT.byPosition
        }
        toString() {
            return this.kind
        }
    }
    rJK.ParameterStructures = NT;
    NT.auto = new NT("auto");
    NT.byPosition = new NT("byPosition");
    NT.byName = new NT("byName");
    class hH {
        constructor(q, K) {
            this.method = q, this.numberOfParams = K
        }
        get parameterStructures() {
            return NT.auto
        }
    }
    rJK.AbstractMessageSignature = hH;
    class yJK extends hH {
        constructor(q) {
            super(q, 0)
        }
    }
    rJK.RequestType0 = yJK;
    class LJK extends hH {
        constructor(q, K = NT.auto) {
            super(q, 1);
            this._parameterStructures = K
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    rJK.RequestType = LJK;
    class hJK extends hH {
        constructor(q, K = NT.auto) {
            super(q, 1);
            this._parameterStructures = K
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    rJK.RequestType1 = hJK;
    class RJK extends hH {
        constructor(q) {
            super(q, 2)
        }
    }
    rJK.RequestType2 = RJK;
    class SJK extends hH {
        constructor(q) {
            super(q, 3)
        }
    }
    rJK.RequestType3 = SJK;
    class CJK extends hH {
        constructor(q) {
            super(q, 4)
        }
    }
    rJK.RequestType4 = CJK;
    class bJK extends hH {
        constructor(q) {
            super(q, 5)
        }
    }
    rJK.RequestType5 = bJK;
    class IJK extends hH {
        constructor(q) {
            super(q, 6)
        }
    }
    rJK.RequestType6 = IJK;
    class xJK extends hH {
        constructor(q) {
            super(q, 7)
        }
    }
    rJK.RequestType7 = xJK;
    class uJK extends hH {
        constructor(q) {
            super(q, 8)
        }
    }
    rJK.RequestType8 = uJK;
    class mJK extends hH {
        constructor(q) {
            super(q, 9)
        }
    }
    rJK.RequestType9 = mJK;
    class BJK extends hH {
        constructor(q, K = NT.auto) {
            super(q, 1);
            this._parameterStructures = K
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    rJK.NotificationType = BJK;
    class pJK extends hH {
        constructor(q) {
            super(q, 0)
        }
    }
    rJK.NotificationType0 = pJK;
    class FJK extends hH {
        constructor(q, K = NT.auto) {
            super(q, 1);
            this._parameterStructures = K
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    rJK.NotificationType1 = FJK;
    class gJK extends hH {
        constructor(q) {
            super(q, 2)
        }
    }
    rJK.NotificationType2 = gJK;
    class UJK extends hH {
        constructor(q) {
            super(q, 3)
        }
    }
    rJK.NotificationType3 = UJK;
    class QJK extends hH {
        constructor(q) {
            super(q, 4)
        }
    }
    rJK.NotificationType4 = QJK;
    class dJK extends hH {
        constructor(q) {
            super(q, 5)
        }
    }
    rJK.NotificationType5 = dJK;
    class cJK extends hH {
        constructor(q) {
            super(q, 6)
        }
    }
    rJK.NotificationType6 = cJK;
    class lJK extends hH {
        constructor(q) {
            super(q, 7)
        }
    }
    rJK.NotificationType7 = lJK;
    class nJK extends hH {
        constructor(q) {
            super(q, 8)
        }
    }
    rJK.NotificationType8 = nJK;
    class iJK extends hH {
        constructor(q) {
            super(q, 9)
        }
    }
    rJK.NotificationType9 = iJK;
    var EJK;
    (function(q) {
        function K(Y) {
            let A = Y;
            return A && jM6.string(A.method) && (jM6.string(A.id) || jM6.number(A.id))
        }
        q.isRequest = K;

        function _(Y) {
            let A = Y;
            return A && jM6.string(A.method) && Y.id === void 0
        }
        q.isNotification = _;

        function z(Y) {
            let A = Y;
            return A && (A.result !== void 0 || !!A.error) && (jM6.string(A.id) || jM6.number(A.id) || A.id === null)
        }
        q.isResponse = z
    })(EJK || (rJK.Message = EJK = {}))
})
// @from(Ln 359576, Col 4)
dq7 = p((tJK) => {
    var aJK;
    Object.defineProperty(tJK, "__esModule", {
        value: !0
    });
    tJK.LRUCache = tJK.LinkedMap = tJK.Touch = void 0;
    var ET;
    (function(q) {
        q.None = 0, q.First = 1, q.AsOld = q.First, q.Last = 2, q.AsNew = q.Last
    })(ET || (tJK.Touch = ET = {}));
    class Qq7 {
        constructor() {
            this[aJK] = "LinkedMap", this._map = new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0
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
        has(q) {
            return this._map.has(q)
        }
        get(q, K = ET.None) {
            let _ = this._map.get(q);
            if (!_) return;
            if (K !== ET.None) this.touch(_, K);
            return _.value
        }
        set(q, K, _ = ET.None) {
            let z = this._map.get(q);
            if (z) {
                if (z.value = K, _ !== ET.None) this.touch(z, _)
            } else {
                switch (z = {
                        key: q,
                        value: K,
                        next: void 0,
                        previous: void 0
                    }, _) {
                    case ET.None:
                        this.addItemLast(z);
                        break;
                    case ET.First:
                        this.addItemFirst(z);
                        break;
                    case ET.Last:
                        this.addItemLast(z);
                        break;
                    default:
                        this.addItemLast(z);
                        break
                }
                this._map.set(q, z), this._size++
            }
            return this
        }
        delete(q) {
            return !!this.remove(q)
        }
        remove(q) {
            let K = this._map.get(q);
            if (!K) return;
            return this._map.delete(q), this.removeItem(K), this._size--, K.value
        }
        shift() {
            if (!this._head && !this._tail) return;
            if (!this._head || !this._tail) throw Error("Invalid list");
            let q = this._head;
            return this._map.delete(q.key), this.removeItem(q), this._size--, q.value
        }
        forEach(q, K) {
            let _ = this._state,
                z = this._head;
            while (z) {
                if (K) q.bind(K)(z.value, z.key, this);
                else q(z.value, z.key, this);
                if (this._state !== _) throw Error("LinkedMap got modified during iteration.");
                z = z.next
            }
        }
        keys() {
            let q = this._state,
                K = this._head,
                _ = {
                    [Symbol.iterator]: () => {
                        return _
                    },
                    next: () => {
                        if (this._state !== q) throw Error("LinkedMap got modified during iteration.");
                        if (K) {
                            let z = {
                                value: K.key,
                                done: !1
                            };
                            return K = K.next, z
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return _
        }
        values() {
            let q = this._state,
                K = this._head,
                _ = {
                    [Symbol.iterator]: () => {
                        return _
                    },
                    next: () => {
                        if (this._state !== q) throw Error("LinkedMap got modified during iteration.");
                        if (K) {
                            let z = {
                                value: K.value,
                                done: !1
                            };
                            return K = K.next, z
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return _
        }
        entries() {
            let q = this._state,
                K = this._head,
                _ = {
                    [Symbol.iterator]: () => {
                        return _
                    },
                    next: () => {
                        if (this._state !== q) throw Error("LinkedMap got modified during iteration.");
                        if (K) {
                            let z = {
                                value: [K.key, K.value],
                                done: !1
                            };
                            return K = K.next, z
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return _
        } [(aJK = Symbol.toStringTag, Symbol.iterator)]() {
            return this.entries()
        }
        trimOld(q) {
            if (q >= this.size) return;
            if (q === 0) {
                this.clear();
                return
            }
            let K = this._head,
                _ = this.size;
            while (K && _ > q) this._map.delete(K.key), K = K.next, _--;
            if (this._head = K, this._size = _, K) K.previous = void 0;
            this._state++
        }
        addItemFirst(q) {
            if (!this._head && !this._tail) this._tail = q;
            else if (!this._head) throw Error("Invalid list");
            else q.next = this._head, this._head.previous = q;
            this._head = q, this._state++
        }
        addItemLast(q) {
            if (!this._head && !this._tail) this._head = q;
            else if (!this._tail) throw Error("Invalid list");
            else q.previous = this._tail, this._tail.next = q;
            this._tail = q, this._state++
        }
        removeItem(q) {
            if (q === this._head && q === this._tail) this._head = void 0, this._tail = void 0;
            else if (q === this._head) {
                if (!q.next) throw Error("Invalid list");
                q.next.previous = void 0, this._head = q.next
            } else if (q === this._tail) {
                if (!q.previous) throw Error("Invalid list");
                q.previous.next = void 0, this._tail = q.previous
            } else {
                let {
                    next: K,
                    previous: _
                } = q;
                if (!K || !_) throw Error("Invalid list");
                K.previous = _, _.next = K
            }
            q.next = void 0, q.previous = void 0, this._state++
        }
        touch(q, K) {
            if (!this._head || !this._tail) throw Error("Invalid list");
            if (K !== ET.First && K !== ET.Last) return;
            if (K === ET.First) {
                if (q === this._head) return;
                let {
                    next: _,
                    previous: z
                } = q;
                if (q === this._tail) z.next = void 0, this._tail = z;
                else _.previous = z, z.next = _;
                q.previous = void 0, q.next = this._head, this._head.previous = q, this._head = q, this._state++
            } else if (K === ET.Last) {
                if (q === this._tail) return;
                let {
                    next: _,
                    previous: z
                } = q;
                if (q === this._head) _.previous = void 0, this._head = _;
                else _.previous = z, z.next = _;
                q.next = void 0, q.previous = this._tail, this._tail.next = q, this._tail = q, this._state++
            }
        }
        toJSON() {
            let q = [];
            return this.forEach((K, _) => {
                q.push([_, K])
            }), q
        }
        fromJSON(q) {
            this.clear();
            for (let [K, _] of q) this.set(K, _)
        }
    }
    tJK.LinkedMap = Qq7;
    class sJK extends Qq7 {
        constructor(q, K = 1) {
            super();
            this._limit = q, this._ratio = Math.min(Math.max(0, K), 1)
        }
        get limit() {
            return this._limit
        }
        set limit(q) {
            this._limit = q, this.checkTrim()
        }
        get ratio() {
            return this._ratio
        }
        set ratio(q) {
            this._ratio = Math.min(Math.max(0, q), 1), this.checkTrim()
        }
        get(q, K = ET.AsNew) {
            return super.get(q, K)
        }
        peek(q) {
            return super.get(q, ET.None)
        }
        set(q, K) {
            return super.set(q, K, ET.Last), this.checkTrim(), this
        }
        checkTrim() {
            if (this.size > this._limit) this.trimOld(Math.round(this._limit * this._ratio))
        }
    }
    tJK.LRUCache = sJK
})
// @from(Ln 359846, Col 4)
zXK = p((KXK) => {
    Object.defineProperty(KXK, "__esModule", {
        value: !0
    });
    KXK.Disposable = void 0;
    var qXK;
    (function(q) {
        function K(_) {
            return {
                dispose: _
            }
        }
        q.create = K
    })(qXK || (KXK.Disposable = qXK = {}))
})
// @from(Ln 359861, Col 4)
B96 = p((YXK) => {
    Object.defineProperty(YXK, "__esModule", {
        value: !0
    });
    var cq7;

    function lq7() {
        if (cq7 === void 0) throw Error("No runtime abstraction layer installed");
        return cq7
    }(function(q) {
        function K(_) {
            if (_ === void 0) throw Error("No runtime abstraction layer provided");
            cq7 = _
        }
        q.install = K
    })(lq7 || (lq7 = {}));
    YXK.default = lq7
})
// @from(Ln 359879, Col 4)
Hb6 = p((wXK) => {
    Object.defineProperty(wXK, "__esModule", {
        value: !0
    });
    wXK.Emitter = wXK.Event = void 0;
    var l5Y = B96(),
        AXK;
    (function(q) {
        let K = {
            dispose() {}
        };
        q.None = function() {
            return K
        }
    })(AXK || (wXK.Event = AXK = {}));
    class OXK {
        add(q, K = null, _) {
            if (!this._callbacks) this._callbacks = [], this._contexts = [];
            if (this._callbacks.push(q), this._contexts.push(K), Array.isArray(_)) _.push({
                dispose: () => this.remove(q, K)
            })
        }
        remove(q, K = null) {
            if (!this._callbacks) return;
            let _ = !1;
            for (let z = 0, Y = this._callbacks.length; z < Y; z++)
                if (this._callbacks[z] === q)
                    if (this._contexts[z] === K) {
                        this._callbacks.splice(z, 1), this._contexts.splice(z, 1);
                        return
                    } else _ = !0;
            if (_) throw Error("When adding a listener with a context, you should remove it with the same context")
        }
        invoke(...q) {
            if (!this._callbacks) return [];
            let K = [],
                _ = this._callbacks.slice(0),
                z = this._contexts.slice(0);
            for (let Y = 0, A = _.length; Y < A; Y++) try {
                K.push(_[Y].apply(z[Y], q))
            } catch (O) {
                (0, l5Y.default)().console.error(O)
            }
            return K
        }
        isEmpty() {
            return !this._callbacks || this._callbacks.length === 0
        }
        dispose() {
            this._callbacks = void 0, this._contexts = void 0
        }
    }
    class MU8 {
        constructor(q) {
            this._options = q
        }
        get event() {
            if (!this._event) this._event = (q, K, _) => {
                if (!this._callbacks) this._callbacks = new OXK;
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
                this._callbacks.add(q, K);
                let z = {
                    dispose: () => {
                        if (!this._callbacks) return;
                        if (this._callbacks.remove(q, K), z.dispose = MU8._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this)
                    }
                };
                if (Array.isArray(_)) _.push(z);
                return z
            };
            return this._event
        }
        fire(q) {
            if (this._callbacks) this._callbacks.invoke.call(this._callbacks, q)
        }
        dispose() {
            if (this._callbacks) this._callbacks.dispose(), this._callbacks = void 0
        }
    }
    wXK.Emitter = MU8;
    MU8._noop = function() {}
})
// @from(Ln 359961, Col 4)
WU8 = p((HXK) => {
    Object.defineProperty(HXK, "__esModule", {
        value: !0
    });
    HXK.CancellationTokenSource = HXK.CancellationToken = void 0;
    var i5Y = B96(),
        r5Y = jb6(),
        nq7 = Hb6(),
        PU8;
    (function(q) {
        q.None = Object.freeze({
            isCancellationRequested: !1,
            onCancellationRequested: nq7.Event.None
        }), q.Cancelled = Object.freeze({
            isCancellationRequested: !0,
            onCancellationRequested: nq7.Event.None
        });

        function K(_) {
            let z = _;
            return z && (z === q.None || z === q.Cancelled || r5Y.boolean(z.isCancellationRequested) && !!z.onCancellationRequested)
        }
        q.is = K
    })(PU8 || (HXK.CancellationToken = PU8 = {}));
    var o5Y = Object.freeze(function(q, K) {
        let _ = (0, i5Y.default)().timer.setTimeout(q.bind(K), 0);
        return {
            dispose() {
                _.dispose()
            }
        }
    });
    class iq7 {
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
            if (this._isCancelled) return o5Y;
            if (!this._emitter) this._emitter = new nq7.Emitter;
            return this._emitter.event
        }
        dispose() {
            if (this._emitter) this._emitter.dispose(), this._emitter = void 0
        }
    }
    class jXK {
        get token() {
            if (!this._token) this._token = new iq7;
            return this._token
        }
        cancel() {
            if (!this._token) this._token = PU8.Cancelled;
            else this._token.cancel()
        }
        dispose() {
            if (!this._token) this._token = PU8.None;
            else if (this._token instanceof iq7) this._token.dispose()
        }
    }
    HXK.CancellationTokenSource = jXK
})
// @from(Ln 360030, Col 4)
fXK = p((DXK) => {
    Object.defineProperty(DXK, "__esModule", {
        value: !0
    });
    DXK.SharedArrayReceiverStrategy = DXK.SharedArraySenderStrategy = void 0;
    var s5Y = WU8(),
        sK8;
    (function(q) {
        q.Continue = 0, q.Cancelled = 1
    })(sK8 || (sK8 = {}));
    class XXK {
        constructor() {
            this.buffers = new Map
        }
        enableCancellation(q) {
            if (q.id === null) return;
            let K = new SharedArrayBuffer(4),
                _ = new Int32Array(K, 0, 1);
            _[0] = sK8.Continue, this.buffers.set(q.id, K), q.$cancellationData = K
        }
        async sendCancellation(q, K) {
            let _ = this.buffers.get(K);
            if (_ === void 0) return;
            let z = new Int32Array(_, 0, 1);
            Atomics.store(z, 0, sK8.Cancelled)
        }
        cleanup(q) {
            this.buffers.delete(q)
        }
        dispose() {
            this.buffers.clear()
        }
    }
    DXK.SharedArraySenderStrategy = XXK;
    class MXK {
        constructor(q) {
            this.data = new Int32Array(q, 0, 1)
        }
        get isCancellationRequested() {
            return Atomics.load(this.data, 0) === sK8.Cancelled
        }
        get onCancellationRequested() {
            throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")
        }
    }
    class PXK {
        constructor(q) {
            this.token = new MXK(q)
        }
        cancel() {}
        dispose() {}
    }
    class WXK {
        constructor() {
            this.kind = "request"
        }
        createCancellationTokenSource(q) {
            let K = q.$cancellationData;
            if (K === void 0) return new s5Y.CancellationTokenSource;
            return new PXK(K)
        }
    }
    DXK.SharedArrayReceiverStrategy = WXK
})
// @from(Ln 360094, Col 4)
rq7 = p((vXK) => {
    Object.defineProperty(vXK, "__esModule", {
        value: !0
    });
    vXK.Semaphore = void 0;
    var e5Y = B96();
    class GXK {
        constructor(q = 1) {
            if (q <= 0) throw Error("Capacity must be greater than 0");
            this._capacity = q, this._active = 0, this._waiting = []
        }
        lock(q) {
            return new Promise((K, _) => {
                this._waiting.push({
                    thunk: q,
                    resolve: K,
                    reject: _
                }), this.runNext()
            })
        }
        get active() {
            return this._active
        }
        runNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            (0, e5Y.default)().timer.setImmediate(() => this.doRunNext())
        }
        doRunNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            let q = this._waiting.shift();
            if (this._active++, this._active > this._capacity) throw Error("To many thunks active");
            try {
                let K = q.thunk();
                if (K instanceof Promise) K.then((_) => {
                    this._active--, q.resolve(_), this.runNext()
                }, (_) => {
                    this._active--, q.reject(_), this.runNext()
                });
                else this._active--, q.resolve(K), this.runNext()
            } catch (K) {
                this._active--, q.reject(K), this.runNext()
            }
        }
    }
    vXK.Semaphore = GXK
})
// @from(Ln 360140, Col 4)
yXK = p((NXK) => {
    Object.defineProperty(NXK, "__esModule", {
        value: !0
    });
    NXK.ReadableStreamMessageReader = NXK.AbstractMessageReader = NXK.MessageReader = void 0;
    var aq7 = B96(),
        Jb6 = jb6(),
        oq7 = Hb6(),
        q3Y = rq7(),
        VXK;
    (function(q) {
        function K(_) {
            let z = _;
            return z && Jb6.func(z.listen) && Jb6.func(z.dispose) && Jb6.func(z.onError) && Jb6.func(z.onClose) && Jb6.func(z.onPartialMessage)
        }
        q.is = K
    })(VXK || (NXK.MessageReader = VXK = {}));
    class tq7 {
        constructor() {
            this.errorEmitter = new oq7.Emitter, this.closeEmitter = new oq7.Emitter, this.partialMessageEmitter = new oq7.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(q) {
            this.errorEmitter.fire(this.asError(q))
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
        firePartialMessage(q) {
            this.partialMessageEmitter.fire(q)
        }
        asError(q) {
            if (q instanceof Error) return q;
            else return Error(`Reader received error. Reason: ${Jb6.string(q.message)?q.message:"unknown"}`)
        }
    }
    NXK.AbstractMessageReader = tq7;
    var sq7;
    (function(q) {
        function K(_) {
            let z, Y, A, O = new Map,
                w, $ = new Map;
            if (_ === void 0 || typeof _ === "string") z = _ ?? "utf-8";
            else {
                if (z = _.charset ?? "utf-8", _.contentDecoder !== void 0) A = _.contentDecoder, O.set(A.name, A);
                if (_.contentDecoders !== void 0)
                    for (let j of _.contentDecoders) O.set(j.name, j);
                if (_.contentTypeDecoder !== void 0) w = _.contentTypeDecoder, $.set(w.name, w);
                if (_.contentTypeDecoders !== void 0)
                    for (let j of _.contentTypeDecoders) $.set(j.name, j)
            }
            if (w === void 0) w = (0, aq7.default)().applicationJson.decoder, $.set(w.name, w);
            return {
                charset: z,
                contentDecoder: A,
                contentDecoders: O,
                contentTypeDecoder: w,
                contentTypeDecoders: $
            }
        }
        q.fromOptions = K
    })(sq7 || (sq7 = {}));
    class kXK extends tq7 {
        constructor(q, K) {
            super();
            this.readable = q, this.options = sq7.fromOptions(K), this.buffer = (0, aq7.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new q3Y.Semaphore(1)
        }
        set partialMessageTimeout(q) {
            this._partialMessageTimeout = q
        }
        get partialMessageTimeout() {
            return this._partialMessageTimeout
        }
        listen(q) {
            this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = q;
            let K = this.readable.onData((_) => {
                this.onData(_)
            });
            return this.readable.onError((_) => this.fireError(_)), this.readable.onClose(() => this.fireClose()), K
        }
        onData(q) {
            try {
                this.buffer.append(q);
                while (!0) {
                    if (this.nextMessageLength === -1) {
                        let _ = this.buffer.tryReadHeaders(!0);
                        if (!_) return;
                        let z = _.get("content-length");
                        if (!z) {
                            this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(_))}`));
                            return
                        }
                        let Y = parseInt(z);
                        if (isNaN(Y)) {
                            this.fireError(Error(`Content-Length value must be a number. Got ${z}`));
                            return
                        }
                        this.nextMessageLength = Y
                    }
                    let K = this.buffer.tryReadBody(this.nextMessageLength);
                    if (K === void 0) {
                        this.setPartialMessageTimer();
                        return
                    }
                    this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
                        let _ = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(K) : K,
                            z = await this.options.contentTypeDecoder.decode(_, this.options);
                        this.callback(z)
                    }).catch((_) => {
                        this.fireError(_)
                    })
                }
            } catch (K) {
                this.fireError(K)
            }
        }
        clearPartialMessageTimer() {
            if (this.partialMessageTimer) this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0
        }
        setPartialMessageTimer() {
            if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0) return;
            this.partialMessageTimer = (0, aq7.default)().timer.setTimeout((q, K) => {
                if (this.partialMessageTimer = void 0, q === this.messageToken) this.firePartialMessage({
                    messageToken: q,
                    waitingTime: K
                }), this.setPartialMessageTimer()
            }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout)
        }
    }
    NXK.ReadableStreamMessageReader = kXK
})
// @from(Ln 360283, Col 4)
xXK = p((bXK) => {
    Object.defineProperty(bXK, "__esModule", {
        value: !0
    });
    bXK.WriteableStreamMessageWriter = bXK.AbstractMessageWriter = bXK.MessageWriter = void 0;
    var LXK = B96(),
        tK8 = jb6(),
        z3Y = rq7(),
        hXK = Hb6(),
        Y3Y = "Content-Length: ",
        RXK = `\r
`,
        SXK;
    (function(q) {
        function K(_) {
            let z = _;
            return z && tK8.func(z.dispose) && tK8.func(z.onClose) && tK8.func(z.onError) && tK8.func(z.write)
        }
        q.is = K
    })(SXK || (bXK.MessageWriter = SXK = {}));
    class q47 {
        constructor() {
            this.errorEmitter = new hXK.Emitter, this.closeEmitter = new hXK.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(q, K, _) {
            this.errorEmitter.fire([this.asError(q), K, _])
        }
        get onClose() {
            return this.closeEmitter.event
        }
        fireClose() {
            this.closeEmitter.fire(void 0)
        }
        asError(q) {
            if (q instanceof Error) return q;
            else return Error(`Writer received error. Reason: ${tK8.string(q.message)?q.message:"unknown"}`)
        }
    }
    bXK.AbstractMessageWriter = q47;
    var eq7;
    (function(q) {
        function K(_) {
            if (_ === void 0 || typeof _ === "string") return {
                charset: _ ?? "utf-8",
                contentTypeEncoder: (0, LXK.default)().applicationJson.encoder
            };
            else return {
                charset: _.charset ?? "utf-8",
                contentEncoder: _.contentEncoder,
                contentTypeEncoder: _.contentTypeEncoder ?? (0, LXK.default)().applicationJson.encoder
            }
        }
        q.fromOptions = K
    })(eq7 || (eq7 = {}));
    class CXK extends q47 {
        constructor(q, K) {
            super();
            this.writable = q, this.options = eq7.fromOptions(K), this.errorCount = 0, this.writeSemaphore = new z3Y.Semaphore(1), this.writable.onError((_) => this.fireError(_)), this.writable.onClose(() => this.fireClose())
        }
        async write(q) {
            return this.writeSemaphore.lock(async () => {
                return this.options.contentTypeEncoder.encode(q, this.options).then((_) => {
                    if (this.options.contentEncoder !== void 0) return this.options.contentEncoder.encode(_);
                    else return _
                }).then((_) => {
                    let z = [];
                    return z.push(Y3Y, _.byteLength.toString(), RXK), z.push(RXK), this.doWrite(q, z, _)
                }, (_) => {
                    throw this.fireError(_), _
                })
            })
        }
        async doWrite(q, K, _) {
            try {
                return await this.writable.write(K.join(""), "ascii"), this.writable.write(_)
            } catch (z) {
                return this.handleError(z, q), Promise.reject(z)
            }
        }
        handleError(q, K) {
            this.errorCount++, this.fireError(q, K, this.errorCount)
        }
        end() {
            this.writable.end()
        }
    }
    bXK.WriteableStreamMessageWriter = CXK
})
// @from(Ln 360377, Col 4)
pXK = p((mXK) => {
    Object.defineProperty(mXK, "__esModule", {
        value: !0
    });
    mXK.AbstractMessageBuffer = void 0;
    var w3Y = 13,
        $3Y = 10,
        j3Y = `\r
`;
    class uXK {
        constructor(q = "utf-8") {
            this._encoding = q, this._chunks = [], this._totalLength = 0
        }
        get encoding() {
            return this._encoding
        }
        append(q) {
            let K = typeof q === "string" ? this.fromString(q, this._encoding) : q;
            this._chunks.push(K), this._totalLength += K.byteLength
        }
        tryReadHeaders(q = !1) {
            if (this._chunks.length === 0) return;
            let K = 0,
                _ = 0,
                z = 0,
                Y = 0;
            q: while (_ < this._chunks.length) {
                let $ = this._chunks[_];
                z = 0;
                K: while (z < $.length) {
                    switch ($[z]) {
                        case w3Y:
                            switch (K) {
                                case 0:
                                    K = 1;
                                    break;
                                case 2:
                                    K = 3;
                                    break;
                                default:
                                    K = 0
                            }
                            break;
                        case $3Y:
                            switch (K) {
                                case 1:
                                    K = 2;
                                    break;
                                case 3:
                                    K = 4, z++;
                                    break q;
                                default:
                                    K = 0
                            }
                            break;
                        default:
                            K = 0
                    }
                    z++
                }
                Y += $.byteLength, _++
            }
            if (K !== 4) return;
            let A = this._read(Y + z),
                O = new Map,
                w = this.toString(A, "ascii").split(j3Y);
            if (w.length < 2) return O;
            for (let $ = 0; $ < w.length - 2; $++) {
                let j = w[$],
                    H = j.indexOf(":");
                if (H === -1) throw Error(`Message header must separate key and value using ':'
${j}`);
                let J = j.substr(0, H),
                    X = j.substr(H + 1).trim();
                O.set(q ? J.toLowerCase() : J, X)
            }
            return O
        }
        tryReadBody(q) {
            if (this._totalLength < q) return;
            return this._read(q)
        }
        get numberOfBytes() {
            return this._totalLength
        }
        _read(q) {
            if (q === 0) return this.emptyBuffer();
            if (q > this._totalLength) throw Error("Cannot read so many bytes!");
            if (this._chunks[0].byteLength === q) {
                let Y = this._chunks[0];
                return this._chunks.shift(), this._totalLength -= q, this.asNative(Y)
            }
            if (this._chunks[0].byteLength > q) {
                let Y = this._chunks[0],
                    A = this.asNative(Y, q);
                return this._chunks[0] = Y.slice(q), this._totalLength -= q, A
            }
            let K = this.allocNative(q),
                _ = 0,
                z = 0;
            while (q > 0) {
                let Y = this._chunks[z];
                if (Y.byteLength > q) {
                    let A = Y.slice(0, q);
                    K.set(A, _), _ += q, this._chunks[z] = Y.slice(q), this._totalLength -= q, q -= q
                } else K.set(Y, _), _ += Y.byteLength, this._chunks.shift(), this._totalLength -= Y.byteLength, q -= Y.byteLength
            }
            return K
        }
    }
    mXK.AbstractMessageBuffer = uXK
})
// @from(Ln 360489, Col 4)
oXK = p((cXK) => {
    Object.defineProperty(cXK, "__esModule", {
        value: !0
    });
    cXK.createMessageConnection = cXK.ConnectionOptions = cXK.MessageStrategy = cXK.CancellationStrategy = cXK.CancellationSenderStrategy = cXK.CancellationReceiverStrategy = cXK.RequestCancellationReceiverStrategy = cXK.IdCancellationReceiverStrategy = cXK.ConnectionStrategy = cXK.ConnectionError = cXK.ConnectionErrors = cXK.LogTraceNotification = cXK.SetTraceNotification = cXK.TraceFormat = cXK.TraceValues = cXK.Trace = cXK.NullLogger = cXK.ProgressType = cXK.ProgressToken = void 0;
    var FXK = B96(),
        IJ = jb6(),
        F3 = Uq7(),
        gXK = dq7(),
        eK8 = Hb6(),
        K47 = WU8(),
        _58;
    (function(q) {
        q.type = new F3.NotificationType("$/cancelRequest")
    })(_58 || (_58 = {}));
    var _47;
    (function(q) {
        function K(_) {
            return typeof _ === "string" || typeof _ === "number"
        }
        q.is = K
    })(_47 || (cXK.ProgressToken = _47 = {}));
    var q58;
    (function(q) {
        q.type = new F3.NotificationType("$/progress")
    })(q58 || (q58 = {}));
    class dXK {
        constructor() {}
    }
    cXK.ProgressType = dXK;
    var z47;
    (function(q) {
        function K(_) {
            return IJ.func(_)
        }
        q.is = K
    })(z47 || (z47 = {}));
    cXK.NullLogger = Object.freeze({
        error: () => {},
        warn: () => {},
        info: () => {},
        log: () => {}
    });
    var EO;
    (function(q) {
        q[q.Off = 0] = "Off", q[q.Messages = 1] = "Messages", q[q.Compact = 2] = "Compact", q[q.Verbose = 3] = "Verbose"
    })(EO || (cXK.Trace = EO = {}));
    var UXK;
    (function(q) {
        q.Off = "off", q.Messages = "messages", q.Compact = "compact", q.Verbose = "verbose"
    })(UXK || (cXK.TraceValues = UXK = {}));
    (function(q) {
        function K(z) {
            if (!IJ.string(z)) return q.Off;
            switch (z = z.toLowerCase(), z) {
                case "off":
                    return q.Off;
                case "messages":
                    return q.Messages;
                case "compact":
                    return q.Compact;
                case "verbose":
                    return q.Verbose;
                default:
                    return q.Off
            }
        }
        q.fromString = K;

        function _(z) {
            switch (z) {
                case q.Off:
                    return "off";
                case q.Messages:
                    return "messages";
                case q.Compact:
                    return "compact";
                case q.Verbose:
                    return "verbose";
                default:
                    return "off"
            }
        }
        q.toString = _
    })(EO || (cXK.Trace = EO = {}));
    var XS;
    (function(q) {
        q.Text = "text", q.JSON = "json"
    })(XS || (cXK.TraceFormat = XS = {}));
    (function(q) {
        function K(_) {
            if (!IJ.string(_)) return q.Text;
            if (_ = _.toLowerCase(), _ === "json") return q.JSON;
            else return q.Text
        }
        q.fromString = K
    })(XS || (cXK.TraceFormat = XS = {}));
    var Y47;
    (function(q) {
        q.type = new F3.NotificationType("$/setTrace")
    })(Y47 || (cXK.SetTraceNotification = Y47 = {}));
    var DU8;
    (function(q) {
        q.type = new F3.NotificationType("$/logTrace")
    })(DU8 || (cXK.LogTraceNotification = DU8 = {}));
    var K58;
    (function(q) {
        q[q.Closed = 1] = "Closed", q[q.Disposed = 2] = "Disposed", q[q.AlreadyListening = 3] = "AlreadyListening"
    })(K58 || (cXK.ConnectionErrors = K58 = {}));
    class Xb6 extends Error {
        constructor(q, K) {
            super(K);
            this.code = q, Object.setPrototypeOf(this, Xb6.prototype)
        }
    }
    cXK.ConnectionError = Xb6;
    var A47;
    (function(q) {
        function K(_) {
            let z = _;
            return z && IJ.func(z.cancelUndispatched)
        }
        q.is = K
    })(A47 || (cXK.ConnectionStrategy = A47 = {}));
    var ZU8;
    (function(q) {
        function K(_) {
            let z = _;
            return z && (z.kind === void 0 || z.kind === "id") && IJ.func(z.createCancellationTokenSource) && (z.dispose === void 0 || IJ.func(z.dispose))
        }
        q.is = K
    })(ZU8 || (cXK.IdCancellationReceiverStrategy = ZU8 = {}));
    var O47;
    (function(q) {
        function K(_) {
            let z = _;
            return z && z.kind === "request" && IJ.func(z.createCancellationTokenSource) && (z.dispose === void 0 || IJ.func(z.dispose))
        }
        q.is = K
    })(O47 || (cXK.RequestCancellationReceiverStrategy = O47 = {}));
    var fU8;
    (function(q) {
        q.Message = Object.freeze({
            createCancellationTokenSource(_) {
                return new K47.CancellationTokenSource
            }
        });

        function K(_) {
            return ZU8.is(_) || O47.is(_)
        }
        q.is = K
    })(fU8 || (cXK.CancellationReceiverStrategy = fU8 = {}));
    var GU8;
    (function(q) {
        q.Message = Object.freeze({
            sendCancellation(_, z) {
                return _.sendNotification(_58.type, {
                    id: z
                })
            },
            cleanup(_) {}
        });

        function K(_) {
            let z = _;
            return z && IJ.func(z.sendCancellation) && IJ.func(z.cleanup)
        }
        q.is = K
    })(GU8 || (cXK.CancellationSenderStrategy = GU8 = {}));
    var vU8;
    (function(q) {
        q.Message = Object.freeze({
            receiver: fU8.Message,
            sender: GU8.Message
        });

        function K(_) {
            let z = _;
            return z && fU8.is(z.receiver) && GU8.is(z.sender)
        }
        q.is = K
    })(vU8 || (cXK.CancellationStrategy = vU8 = {}));
    var TU8;
    (function(q) {
        function K(_) {
            let z = _;
            return z && IJ.func(z.handleMessage)
        }
        q.is = K
    })(TU8 || (cXK.MessageStrategy = TU8 = {}));
    var QXK;
    (function(q) {
        function K(_) {
            let z = _;
            return z && (vU8.is(z.cancellationStrategy) || A47.is(z.connectionStrategy) || TU8.is(z.messageStrategy))
        }
        q.is = K
    })(QXK || (cXK.ConnectionOptions = QXK = {}));
    var dF;
    (function(q) {
        q[q.New = 1] = "New", q[q.Listening = 2] = "Listening", q[q.Closed = 3] = "Closed", q[q.Disposed = 4] = "Disposed"
    })(dF || (dF = {}));

    function H3Y(q, K, _, z) {
        let Y = _ !== void 0 ? _ : cXK.NullLogger,
            A = 0,
            O = 0,
            w = 0,
            $ = "2.0",
            j = void 0,
            H = new Map,
            J = void 0,
            X = new Map,
            M = new Map,
            P, W = new gXK.LinkedMap,
            D = new Map,
            Z = new Set,
            G = new Map,
            f = EO.Off,
            v = XS.Text,
            V, k = dF.New,
            N = new eK8.Emitter,
            R = new eK8.Emitter,
            h = new eK8.Emitter,
            C = new eK8.Emitter,
            x = new eK8.Emitter,
            B = z && z.cancellationStrategy ? z.cancellationStrategy : vU8.Message;

        function m(R6) {
            if (R6 === null) throw Error("Can't send requests with id null since the response can't be correlated.");
            return "req-" + R6.toString()
        }

        function S(R6) {
            if (R6 === null) return "res-unknown-" + (++w).toString();
            else return "res-" + R6.toString()
        }

        function F() {
            return "not-" + (++O).toString()
        }

        function U(R6, p6) {
            if (F3.Message.isRequest(p6)) R6.set(m(p6.id), p6);
            else if (F3.Message.isResponse(p6)) R6.set(S(p6.id), p6);
            else R6.set(F(), p6)
        }

        function g(R6) {
            return
        }

        function c() {
            return k === dF.Listening
        }

        function n() {
            return k === dF.Closed
        }

        function l() {
            return k === dF.Disposed
        }

        function z6() {
            if (k === dF.New || k === dF.Listening) k = dF.Closed, R.fire(void 0)
        }

        function A6(R6) {
            N.fire([R6, void 0, void 0])
        }

        function e(R6) {
            N.fire(R6)
        }
        q.onClose(z6), q.onError(A6), K.onClose(z6), K.onError(e);

        function i() {
            if (P || W.size === 0) return;
            P = (0, FXK.default)().timer.setImmediate(() => {
                P = void 0, J6()
            })
        }

        function O6(R6) {
            if (F3.Message.isRequest(R6)) H6(R6);
            else if (F3.Message.isNotification(R6)) o(R6);
            else if (F3.Message.isResponse(R6)) q6(R6);
            else _6(R6)
        }

        function J6() {
            if (W.size === 0) return;
            let R6 = W.shift();
            try {
                let p6 = z?.messageStrategy;
                if (TU8.is(p6)) p6.handleMessage(R6, O6);
                else O6(R6)
            } finally {
                i()
            }
        }
        let $6 = (R6) => {
            try {
                if (F3.Message.isNotification(R6) && R6.method === _58.type.method) {
                    let p6 = R6.params.id,
                        q8 = m(p6),
                        L8 = W.get(q8);
                    if (F3.Message.isRequest(L8)) {
                        let x8 = z?.connectionStrategy,
                            a6 = x8 && x8.cancelUndispatched ? x8.cancelUndispatched(L8, g) : g(L8);
                        if (a6 && (a6.error !== void 0 || a6.result !== void 0)) {
                            W.delete(q8), G.delete(p6), a6.id = L8.id, X6(a6, R6.method, Date.now()), K.write(a6).catch(() => Y.error("Sending response for canceled message failed."));
                            return
                        }
                    }
                    let w8 = G.get(p6);
                    if (w8 !== void 0) {
                        w8.cancel(), W6(R6);
                        return
                    } else Z.add(p6)
                }
                U(W, R6)
            } finally {
                i()
            }
        };

        function H6(R6) {
            if (l()) return;

            function p6(Q6, W8, G8) {
                let s6 = {
                    jsonrpc: $,
                    id: R6.id
                };
                if (Q6 instanceof F3.ResponseError) s6.error = Q6.toJson();
                else s6.result = Q6 === void 0 ? null : Q6;
                X6(s6, W8, G8), K.write(s6).catch(() => Y.error("Sending response failed."))
            }

            function q8(Q6, W8, G8) {
                let s6 = {
                    jsonrpc: $,
                    id: R6.id,
                    error: Q6.toJson()
                };
                X6(s6, W8, G8), K.write(s6).catch(() => Y.error("Sending response failed."))
            }

            function L8(Q6, W8, G8) {
                if (Q6 === void 0) Q6 = null;
                let s6 = {
                    jsonrpc: $,
                    id: R6.id,
                    result: Q6
                };
                X6(s6, W8, G8), K.write(s6).catch(() => Y.error("Sending response failed."))
            }
            M6(R6);
            let w8 = H.get(R6.method),
                x8, a6;
            if (w8) x8 = w8.type, a6 = w8.handler;
            let D8 = Date.now();
            if (a6 || j) {
                let Q6 = R6.id ?? String(Date.now()),
                    W8 = ZU8.is(B.receiver) ? B.receiver.createCancellationTokenSource(Q6) : B.receiver.createCancellationTokenSource(R6);
                if (R6.id !== null && Z.has(R6.id)) W8.cancel();
                if (R6.id !== null) G.set(Q6, W8);
                try {
                    let G8;
                    if (a6)
                        if (R6.params === void 0) {
                            if (x8 !== void 0 && x8.numberOfParams !== 0) {
                                q8(new F3.ResponseError(F3.ErrorCodes.InvalidParams, `Request ${R6.method} defines ${x8.numberOfParams} params but received none.`), R6.method, D8);
                                return
                            }
                            G8 = a6(W8.token)
                        } else if (Array.isArray(R6.params)) {
                        if (x8 !== void 0 && x8.parameterStructures === F3.ParameterStructures.byName) {
                            q8(new F3.ResponseError(F3.ErrorCodes.InvalidParams, `Request ${R6.method} defines parameters by name but received parameters by position`), R6.method, D8);
                            return
                        }
                        G8 = a6(...R6.params, W8.token)
                    } else {
                        if (x8 !== void 0 && x8.parameterStructures === F3.ParameterStructures.byPosition) {
                            q8(new F3.ResponseError(F3.ErrorCodes.InvalidParams, `Request ${R6.method} defines parameters by position but received parameters by name`), R6.method, D8);
                            return
                        }
                        G8 = a6(R6.params, W8.token)
                    } else if (j) G8 = j(R6.method, R6.params, W8.token);
                    let s6 = G8;
                    if (!G8) G.delete(Q6), L8(G8, R6.method, D8);
                    else if (s6.then) s6.then((u6) => {
                        G.delete(Q6), p6(u6, R6.method, D8)
                    }, (u6) => {
                        if (G.delete(Q6), u6 instanceof F3.ResponseError) q8(u6, R6.method, D8);
                        else if (u6 && IJ.string(u6.message)) q8(new F3.ResponseError(F3.ErrorCodes.InternalError, `Request ${R6.method} failed with message: ${u6.message}`), R6.method, D8);
                        else q8(new F3.ResponseError(F3.ErrorCodes.InternalError, `Request ${R6.method} failed unexpectedly without providing any details.`), R6.method, D8)
                    });
                    else G.delete(Q6), p6(G8, R6.method, D8)
                } catch (G8) {
                    if (G.delete(Q6), G8 instanceof F3.ResponseError) p6(G8, R6.method, D8);
                    else if (G8 && IJ.string(G8.message)) q8(new F3.ResponseError(F3.ErrorCodes.InternalError, `Request ${R6.method} failed with message: ${G8.message}`), R6.method, D8);
                    else q8(new F3.ResponseError(F3.ErrorCodes.InternalError, `Request ${R6.method} failed unexpectedly without providing any details.`), R6.method, D8)
                }
            } else q8(new F3.ResponseError(F3.ErrorCodes.MethodNotFound, `Unhandled method ${R6.method}`), R6.method, D8)
        }

        function q6(R6) {
            if (l()) return;
            if (R6.id === null)
                if (R6.error) Y.error(`Received response message without id: Error is: 
${JSON.stringify(R6.error,void 0,4)}`);
                else Y.error("Received response message without id. No further error information provided.");
            else {
                let p6 = R6.id,
                    q8 = D.get(p6);
                if (V6(R6, q8), q8 !== void 0) {
                    D.delete(p6);
                    try {
                        if (R6.error) {
                            let L8 = R6.error;
                            q8.reject(new F3.ResponseError(L8.code, L8.message, L8.data))
                        } else if (R6.result !== void 0) q8.resolve(R6.result);
                        else throw Error("Should never happen.")
                    } catch (L8) {
                        if (L8.message) Y.error(`Response handler '${q8.method}' failed with message: ${L8.message}`);
                        else Y.error(`Response handler '${q8.method}' failed unexpectedly.`)
                    }
                }
            }
        }

        function o(R6) {
            if (l()) return;
            let p6 = void 0,
                q8;
            if (R6.method === _58.type.method) {
                let L8 = R6.params.id;
                Z.delete(L8), W6(R6);
                return
            } else {
                let L8 = X.get(R6.method);
                if (L8) q8 = L8.handler, p6 = L8.type
            }
            if (q8 || J) try {
                if (W6(R6), q8)
                    if (R6.params === void 0) {
                        if (p6 !== void 0) {
                            if (p6.numberOfParams !== 0 && p6.parameterStructures !== F3.ParameterStructures.byName) Y.error(`Notification ${R6.method} defines ${p6.numberOfParams} params but received none.`)
                        }
                        q8()
                    } else if (Array.isArray(R6.params)) {
                    let L8 = R6.params;
                    if (R6.method === q58.type.method && L8.length === 2 && _47.is(L8[0])) q8({
                        token: L8[0],
                        value: L8[1]
                    });
                    else {
                        if (p6 !== void 0) {
                            if (p6.parameterStructures === F3.ParameterStructures.byName) Y.error(`Notification ${R6.method} defines parameters by name but received parameters by position`);
                            if (p6.numberOfParams !== R6.params.length) Y.error(`Notification ${R6.method} defines ${p6.numberOfParams} params but received ${L8.length} arguments`)
                        }
                        q8(...L8)
                    }
                } else {
                    if (p6 !== void 0 && p6.parameterStructures === F3.ParameterStructures.byPosition) Y.error(`Notification ${R6.method} defines parameters by position but received parameters by name`);
                    q8(R6.params)
                } else if (J) J(R6.method, R6.params)
            } catch (L8) {
                if (L8.message) Y.error(`Notification handler '${R6.method}' failed with message: ${L8.message}`);
                else Y.error(`Notification handler '${R6.method}' failed unexpectedly.`)
            } else h.fire(R6)
        }

        function _6(R6) {
            if (!R6) {
                Y.error("Received empty message.");
                return
            }
            Y.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(R6,null,4)}`);
            let p6 = R6;
            if (IJ.string(p6.id) || IJ.number(p6.id)) {
                let q8 = p6.id,
                    L8 = D.get(q8);
                if (L8) L8.reject(Error("The received response has neither a result nor an error property."))
            }
        }

        function r(R6) {
            if (R6 === void 0 || R6 === null) return;
            switch (f) {
                case EO.Verbose:
                    return JSON.stringify(R6, null, 4);
                case EO.Compact:
                    return JSON.stringify(R6);
                default:
                    return
            }
        }

        function t(R6) {
            if (f === EO.Off || !V) return;
            if (v === XS.Text) {
                let p6 = void 0;
                if ((f === EO.Verbose || f === EO.Compact) && R6.params) p6 = `Params: ${r(R6.params)}

`;
                V.log(`Sending request '${R6.method} - (${R6.id})'.`, p6)
            } else f6("send-request", R6)
        }

        function Y6(R6) {
            if (f === EO.Off || !V) return;
            if (v === XS.Text) {
                let p6 = void 0;
                if (f === EO.Verbose || f === EO.Compact)
                    if (R6.params) p6 = `Params: ${r(R6.params)}

`;
                    else p6 = `No parameters provided.

`;
                V.log(`Sending notification '${R6.method}'.`, p6)
            } else f6("send-notification", R6)
        }

        function X6(R6, p6, q8) {
            if (f === EO.Off || !V) return;
            if (v === XS.Text) {
                let L8 = void 0;
                if (f === EO.Verbose || f === EO.Compact) {
                    if (R6.error && R6.error.data) L8 = `Error data: ${r(R6.error.data)}

`;
                    else if (R6.result) L8 = `Result: ${r(R6.result)}

`;
                    else if (R6.error === void 0) L8 = `No result returned.

`
                }
                V.log(`Sending response '${p6} - (${R6.id})'. Processing request took ${Date.now()-q8}ms`, L8)
            } else f6("send-response", R6)
        }

        function M6(R6) {
            if (f === EO.Off || !V) return;
            if (v === XS.Text) {
                let p6 = void 0;
                if ((f === EO.Verbose || f === EO.Compact) && R6.params) p6 = `Params: ${r(R6.params)}

`;
                V.log(`Received request '${R6.method} - (${R6.id})'.`, p6)
            } else f6("receive-request", R6)
        }

        function W6(R6) {
            if (f === EO.Off || !V || R6.method === DU8.type.method) return;
            if (v === XS.Text) {
                let p6 = void 0;
                if (f === EO.Verbose || f === EO.Compact)
                    if (R6.params) p6 = `Params: ${r(R6.params)}

`;
                    else p6 = `No parameters provided.

`;
                V.log(`Received notification '${R6.method}'.`, p6)
            } else f6("receive-notification", R6)
        }

        function V6(R6, p6) {
            if (f === EO.Off || !V) return;
            if (v === XS.Text) {
                let q8 = void 0;
                if (f === EO.Verbose || f === EO.Compact) {
                    if (R6.error && R6.error.data) q8 = `Error data: ${r(R6.error.data)}

`;
                    else if (R6.result) q8 = `Result: ${r(R6.result)}

`;
                    else if (R6.error === void 0) q8 = `No result returned.

`
                }
                if (p6) {
                    let L8 = R6.error ? ` Request failed: ${R6.error.message} (${R6.error.code}).` : "";
                    V.log(`Received response '${p6.method} - (${R6.id})' in ${Date.now()-p6.timerStart}ms.${L8}`, q8)
                } else V.log(`Received response ${R6.id} without active response promise.`, q8)
            } else f6("receive-response", R6)
        }

        function f6(R6, p6) {
            if (!V || f === EO.Off) return;
            let q8 = {
                isLSPMessage: !0,
                type: R6,
                message: p6,
                timestamp: Date.now()
            };
            V.log(q8)
        }

        function G6() {
            if (n()) throw new Xb6(K58.Closed, "Connection is closed.");
            if (l()) throw new Xb6(K58.Disposed, "Connection is disposed.")
        }

        function k6() {
            if (c()) throw new Xb6(K58.AlreadyListening, "Connection is already listening")
        }

        function T6() {
            if (!c()) throw Error("Call listen() first.")
        }

        function v6(R6) {
            if (R6 === void 0) return null;
            else return R6
        }

        function L6(R6) {
            if (R6 === null) return;
            else return R6
        }

        function y6(R6) {
            return R6 !== void 0 && R6 !== null && !Array.isArray(R6) && typeof R6 === "object"
        }

        function c6(R6, p6) {
            switch (R6) {
                case F3.ParameterStructures.auto:
                    if (y6(p6)) return L6(p6);
                    else return [v6(p6)];
                case F3.ParameterStructures.byName:
                    if (!y6(p6)) throw Error("Received parameters by name but param is not an object literal.");
                    return L6(p6);
                case F3.ParameterStructures.byPosition:
                    return [v6(p6)];
                default:
                    throw Error(`Unknown parameter structure ${R6.toString()}`)
            }
        }

        function Z8(R6, p6) {
            let q8, L8 = R6.numberOfParams;
            switch (L8) {
                case 0:
                    q8 = void 0;
                    break;
                case 1:
                    q8 = c6(R6.parameterStructures, p6[0]);
                    break;
                default:
                    q8 = [];
                    for (let w8 = 0; w8 < p6.length && w8 < L8; w8++) q8.push(v6(p6[w8]));
                    if (p6.length < L8)
                        for (let w8 = p6.length; w8 < L8; w8++) q8.push(null);
                    break
            }
            return q8
        }
        let N8 = {
            sendNotification: (R6, ...p6) => {
                G6();
                let q8, L8;
                if (IJ.string(R6)) {
                    q8 = R6;
                    let x8 = p6[0],
                        a6 = 0,
                        D8 = F3.ParameterStructures.auto;
                    if (F3.ParameterStructures.is(x8)) a6 = 1, D8 = x8;
                    let Q6 = p6.length,
                        W8 = Q6 - a6;
                    switch (W8) {
                        case 0:
                            L8 = void 0;
                            break;
                        case 1:
                            L8 = c6(D8, p6[a6]);
                            break;
                        default:
                            if (D8 === F3.ParameterStructures.byName) throw Error(`Received ${W8} parameters for 'by Name' notification parameter structure.`);
                            L8 = p6.slice(a6, Q6).map((G8) => v6(G8));
                            break
                    }
                } else {
                    let x8 = p6;
                    q8 = R6.method, L8 = Z8(R6, x8)
                }
                let w8 = {
                    jsonrpc: $,
                    method: q8,
                    params: L8
                };
                return Y6(w8), K.write(w8).catch((x8) => {
                    throw Y.error("Sending notification failed."), x8
                })
            },
            onNotification: (R6, p6) => {
                G6();
                let q8;
                if (IJ.func(R6)) J = R6;
                else if (p6)
                    if (IJ.string(R6)) q8 = R6, X.set(R6, {
                        type: void 0,
                        handler: p6
                    });
                    else q8 = R6.method, X.set(R6.method, {
                        type: R6,
                        handler: p6
                    });
                return {
                    dispose: () => {
                        if (q8 !== void 0) X.delete(q8);
                        else J = void 0
                    }
                }
            },
            onProgress: (R6, p6, q8) => {
                if (M.has(p6)) throw Error(`Progress handler for token ${p6} already registered`);
                return M.set(p6, q8), {
                    dispose: () => {
                        M.delete(p6)
                    }
                }
            },
            sendProgress: (R6, p6, q8) => {
                return N8.sendNotification(q58.type, {
                    token: p6,
                    value: q8
                })
            },
            onUnhandledProgress: C.event,
            sendRequest: (R6, ...p6) => {
                G6(), T6();
                let q8, L8, w8 = void 0;
                if (IJ.string(R6)) {
                    q8 = R6;
                    let Q6 = p6[0],
                        W8 = p6[p6.length - 1],
                        G8 = 0,
                        s6 = F3.ParameterStructures.auto;
                    if (F3.ParameterStructures.is(Q6)) G8 = 1, s6 = Q6;
                    let u6 = p6.length;
                    if (K47.CancellationToken.is(W8)) u6 = u6 - 1, w8 = W8;
                    let h6 = u6 - G8;
                    switch (h6) {
                        case 0:
                            L8 = void 0;
                            break;
                        case 1:
                            L8 = c6(s6, p6[G8]);
                            break;
                        default:
                            if (s6 === F3.ParameterStructures.byName) throw Error(`Received ${h6} parameters for 'by Name' request parameter structure.`);
                            L8 = p6.slice(G8, u6).map((_8) => v6(_8));
                            break
                    }
                } else {
                    let Q6 = p6;
                    q8 = R6.method, L8 = Z8(R6, Q6);
                    let W8 = R6.numberOfParams;
                    w8 = K47.CancellationToken.is(Q6[W8]) ? Q6[W8] : void 0
                }
                let x8 = A++,
                    a6;
                if (w8) a6 = w8.onCancellationRequested(() => {
                    let Q6 = B.sender.sendCancellation(N8, x8);
                    if (Q6 === void 0) return Y.log(`Received no promise from cancellation strategy when cancelling id ${x8}`), Promise.resolve();
                    else return Q6.catch(() => {
                        Y.log(`Sending cancellation messages for id ${x8} failed`)
                    })
                });
                let D8 = {
                    jsonrpc: $,
                    id: x8,
                    method: q8,
                    params: L8
                };
                if (t(D8), typeof B.sender.enableCancellation === "function") B.sender.enableCancellation(D8);
                return new Promise(async (Q6, W8) => {
                    let G8 = (h6) => {
                            Q6(h6), B.sender.cleanup(x8), a6?.dispose()
                        },
                        s6 = (h6) => {
                            W8(h6), B.sender.cleanup(x8), a6?.dispose()
                        },
                        u6 = {
                            method: q8,
                            timerStart: Date.now(),
                            resolve: G8,
                            reject: s6
                        };
                    try {
                        D.set(x8, u6), await K.write(D8)
                    } catch (h6) {
                        throw D.delete(x8), u6.reject(new F3.ResponseError(F3.ErrorCodes.MessageWriteError, h6.message ? h6.message : "Unknown reason")), Y.error("Sending request failed."), h6
                    }
                })
            },
            onRequest: (R6, p6) => {
                G6();
                let q8 = null;
                if (z47.is(R6)) q8 = void 0, j = R6;
                else if (IJ.string(R6)) {
                    if (q8 = null, p6 !== void 0) q8 = R6, H.set(R6, {
                        handler: p6,
                        type: void 0
                    })
                } else if (p6 !== void 0) q8 = R6.method, H.set(R6.method, {
                    type: R6,
                    handler: p6
                });
                return {
                    dispose: () => {
                        if (q8 === null) return;
                        if (q8 !== void 0) H.delete(q8);
                        else j = void 0
                    }
                }
            },
            hasPendingResponse: () => {
                return D.size > 0
            },
            trace: async (R6, p6, q8) => {
                let L8 = !1,
                    w8 = XS.Text;
                if (q8 !== void 0)
                    if (IJ.boolean(q8)) L8 = q8;
                    else L8 = q8.sendNotification || !1, w8 = q8.traceFormat || XS.Text;
                if (f = R6, v = w8, f === EO.Off) V = void 0;
                else V = p6;
                if (L8 && !n() && !l()) await N8.sendNotification(Y47.type, {
                    value: EO.toString(R6)
                })
            },
            onError: N.event,
            onClose: R.event,
            onUnhandledNotification: h.event,
            onDispose: x.event,
            end: () => {
                K.end()
            },
            dispose: () => {
                if (l()) return;
                k = dF.Disposed, x.fire(void 0);
                let R6 = new F3.ResponseError(F3.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
                for (let p6 of D.values()) p6.reject(R6);
                if (D = new Map, G = new Map, Z = new Set, W = new gXK.LinkedMap, IJ.func(K.dispose)) K.dispose();
                if (IJ.func(q.dispose)) q.dispose()
            },
            listen: () => {
                G6(), k6(), k = dF.Listening, q.listen($6)
            },
            inspect: () => {
                (0, FXK.default)().console.log("inspect")
            }
        };
        return N8.onNotification(DU8.type, (R6) => {
            if (f === EO.Off || !V) return;
            let p6 = f === EO.Verbose || f === EO.Compact;
            V.log(R6.message, p6 ? R6.verbose : void 0)
        }), N8.onNotification(q58.type, (R6) => {
            let p6 = M.get(R6.token);
            if (p6) p6(R6.value);
            else C.fire(R6)
        }), N8
    }
    cXK.createMessageConnection = H3Y
})
// @from(Ln 361366, Col 4)
VU8 = p((xK) => {
    Object.defineProperty(xK, "__esModule", {
        value: !0
    });
    xK.ProgressType = xK.ProgressToken = xK.createMessageConnection = xK.NullLogger = xK.ConnectionOptions = xK.ConnectionStrategy = xK.AbstractMessageBuffer = xK.WriteableStreamMessageWriter = xK.AbstractMessageWriter = xK.MessageWriter = xK.ReadableStreamMessageReader = xK.AbstractMessageReader = xK.MessageReader = xK.SharedArrayReceiverStrategy = xK.SharedArraySenderStrategy = xK.CancellationToken = xK.CancellationTokenSource = xK.Emitter = xK.Event = xK.Disposable = xK.LRUCache = xK.Touch = xK.LinkedMap = xK.ParameterStructures = xK.NotificationType9 = xK.NotificationType8 = xK.NotificationType7 = xK.NotificationType6 = xK.NotificationType5 = xK.NotificationType4 = xK.NotificationType3 = xK.NotificationType2 = xK.NotificationType1 = xK.NotificationType0 = xK.NotificationType = xK.ErrorCodes = xK.ResponseError = xK.RequestType9 = xK.RequestType8 = xK.RequestType7 = xK.RequestType6 = xK.RequestType5 = xK.RequestType4 = xK.RequestType3 = xK.RequestType2 = xK.RequestType1 = xK.RequestType0 = xK.RequestType = xK.Message = xK.RAL = void 0;
    xK.MessageStrategy = xK.CancellationStrategy = xK.CancellationSenderStrategy = xK.CancellationReceiverStrategy = xK.ConnectionError = xK.ConnectionErrors = xK.LogTraceNotification = xK.SetTraceNotification = xK.TraceFormat = xK.TraceValues = xK.Trace = void 0;
    var c$ = Uq7();
    Object.defineProperty(xK, "Message", {
        enumerable: !0,
        get: function() {
            return c$.Message
        }
    });
    Object.defineProperty(xK, "RequestType", {
        enumerable: !0,
        get: function() {
            return c$.RequestType
        }
    });
    Object.defineProperty(xK, "RequestType0", {
        enumerable: !0,
        get: function() {
            return c$.RequestType0
        }
    });
    Object.defineProperty(xK, "RequestType1", {
        enumerable: !0,
        get: function() {
            return c$.RequestType1
        }
    });
    Object.defineProperty(xK, "RequestType2", {
        enumerable: !0,
        get: function() {
            return c$.RequestType2
        }
    });
    Object.defineProperty(xK, "RequestType3", {
        enumerable: !0,
        get: function() {
            return c$.RequestType3
        }
    });
    Object.defineProperty(xK, "RequestType4", {
        enumerable: !0,
        get: function() {
            return c$.RequestType4
        }
    });
    Object.defineProperty(xK, "RequestType5", {
        enumerable: !0,
        get: function() {
            return c$.RequestType5
        }
    });
    Object.defineProperty(xK, "RequestType6", {
        enumerable: !0,
        get: function() {
            return c$.RequestType6
        }
    });
    Object.defineProperty(xK, "RequestType7", {
        enumerable: !0,
        get: function() {
            return c$.RequestType7
        }
    });
    Object.defineProperty(xK, "RequestType8", {
        enumerable: !0,
        get: function() {
            return c$.RequestType8
        }
    });
    Object.defineProperty(xK, "RequestType9", {
        enumerable: !0,
        get: function() {
            return c$.RequestType9
        }
    });
    Object.defineProperty(xK, "ResponseError", {
        enumerable: !0,
        get: function() {
            return c$.ResponseError
        }
    });
    Object.defineProperty(xK, "ErrorCodes", {
        enumerable: !0,
        get: function() {
            return c$.ErrorCodes
        }
    });
    Object.defineProperty(xK, "NotificationType", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType
        }
    });
    Object.defineProperty(xK, "NotificationType0", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType0
        }
    });
    Object.defineProperty(xK, "NotificationType1", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType1
        }
    });
    Object.defineProperty(xK, "NotificationType2", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType2
        }
    });
    Object.defineProperty(xK, "NotificationType3", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType3
        }
    });
    Object.defineProperty(xK, "NotificationType4", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType4
        }
    });
    Object.defineProperty(xK, "NotificationType5", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType5
        }
    });
    Object.defineProperty(xK, "NotificationType6", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType6
        }
    });
    Object.defineProperty(xK, "NotificationType7", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType7
        }
    });
    Object.defineProperty(xK, "NotificationType8", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType8
        }
    });
    Object.defineProperty(xK, "NotificationType9", {
        enumerable: !0,
        get: function() {
            return c$.NotificationType9
        }
    });
    Object.defineProperty(xK, "ParameterStructures", {
        enumerable: !0,
        get: function() {
            return c$.ParameterStructures
        }
    });
    var w47 = dq7();
    Object.defineProperty(xK, "LinkedMap", {
        enumerable: !0,
        get: function() {
            return w47.LinkedMap
        }
    });
    Object.defineProperty(xK, "LRUCache", {
        enumerable: !0,
        get: function() {
            return w47.LRUCache
        }
    });
    Object.defineProperty(xK, "Touch", {
        enumerable: !0,
        get: function() {
            return w47.Touch
        }
    });
    var y3Y = zXK();
    Object.defineProperty(xK, "Disposable", {
        enumerable: !0,
        get: function() {
            return y3Y.Disposable
        }
    });
    var aXK = Hb6();
    Object.defineProperty(xK, "Event", {
        enumerable: !0,
        get: function() {
            return aXK.Event
        }
    });
    Object.defineProperty(xK, "Emitter", {
        enumerable: !0,
        get: function() {
            return aXK.Emitter
        }
    });
    var sXK = WU8();
    Object.defineProperty(xK, "CancellationTokenSource", {
        enumerable: !0,
        get: function() {
            return sXK.CancellationTokenSource
        }
    });
    Object.defineProperty(xK, "CancellationToken", {
        enumerable: !0,
        get: function() {
            return sXK.CancellationToken
        }
    });
    var tXK = fXK();
    Object.defineProperty(xK, "SharedArraySenderStrategy", {
        enumerable: !0,
        get: function() {
            return tXK.SharedArraySenderStrategy
        }
    });
    Object.defineProperty(xK, "SharedArrayReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return tXK.SharedArrayReceiverStrategy
        }
    });
    var $47 = yXK();
    Object.defineProperty(xK, "MessageReader", {
        enumerable: !0,
        get: function() {
            return $47.MessageReader
        }
    });
    Object.defineProperty(xK, "AbstractMessageReader", {
        enumerable: !0,
        get: function() {
            return $47.AbstractMessageReader
        }
    });
    Object.defineProperty(xK, "ReadableStreamMessageReader", {
        enumerable: !0,
        get: function() {
            return $47.ReadableStreamMessageReader
        }
    });
    var j47 = xXK();
    Object.defineProperty(xK, "MessageWriter", {
        enumerable: !0,
        get: function() {
            return j47.MessageWriter
        }
    });
    Object.defineProperty(xK, "AbstractMessageWriter", {
        enumerable: !0,
        get: function() {
            return j47.AbstractMessageWriter
        }
    });
    Object.defineProperty(xK, "WriteableStreamMessageWriter", {
        enumerable: !0,
        get: function() {
            return j47.WriteableStreamMessageWriter
        }
    });
    var L3Y = pXK();
    Object.defineProperty(xK, "AbstractMessageBuffer", {
        enumerable: !0,
        get: function() {
            return L3Y.AbstractMessageBuffer
        }
    });
    var OG = oXK();
    Object.defineProperty(xK, "ConnectionStrategy", {
        enumerable: !0,
        get: function() {
            return OG.ConnectionStrategy
        }
    });
    Object.defineProperty(xK, "ConnectionOptions", {
        enumerable: !0,
        get: function() {
            return OG.ConnectionOptions
        }
    });
    Object.defineProperty(xK, "NullLogger", {
        enumerable: !0,
        get: function() {
            return OG.NullLogger
        }
    });
    Object.defineProperty(xK, "createMessageConnection", {
        enumerable: !0,
        get: function() {
            return OG.createMessageConnection
        }
    });
    Object.defineProperty(xK, "ProgressToken", {
        enumerable: !0,
        get: function() {
            return OG.ProgressToken
        }
    });
    Object.defineProperty(xK, "ProgressType", {
        enumerable: !0,
        get: function() {
            return OG.ProgressType
        }
    });
    Object.defineProperty(xK, "Trace", {
        enumerable: !0,
        get: function() {
            return OG.Trace
        }
    });
    Object.defineProperty(xK, "TraceValues", {
        enumerable: !0,
        get: function() {
            return OG.TraceValues
        }
    });
    Object.defineProperty(xK, "TraceFormat", {
        enumerable: !0,
        get: function() {
            return OG.TraceFormat
        }
    });
    Object.defineProperty(xK, "SetTraceNotification", {
        enumerable: !0,
        get: function() {
            return OG.SetTraceNotification
        }
    });
    Object.defineProperty(xK, "LogTraceNotification", {
        enumerable: !0,
        get: function() {
            return OG.LogTraceNotification
        }
    });
    Object.defineProperty(xK, "ConnectionErrors", {
        enumerable: !0,
        get: function() {
            return OG.ConnectionErrors
        }
    });
    Object.defineProperty(xK, "ConnectionError", {
        enumerable: !0,
        get: function() {
            return OG.ConnectionError
        }
    });
    Object.defineProperty(xK, "CancellationReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return OG.CancellationReceiverStrategy
        }
    });
    Object.defineProperty(xK, "CancellationSenderStrategy", {
        enumerable: !0,
        get: function() {
            return OG.CancellationSenderStrategy
        }
    });
    Object.defineProperty(xK, "CancellationStrategy", {
        enumerable: !0,
        get: function() {
            return OG.CancellationStrategy
        }
    });
    Object.defineProperty(xK, "MessageStrategy", {
        enumerable: !0,
        get: function() {
            return OG.MessageStrategy
        }
    });
    var h3Y = B96();
    xK.RAL = h3Y.default
})
// @from(Ln 361745, Col 4)
YMK = p((zMK) => {
    Object.defineProperty(zMK, "__esModule", {
        value: !0
    });
    var eXK = d6("util"),
        ze = VU8();
    class kU8 extends ze.AbstractMessageBuffer {
        constructor(q = "utf-8") {
            super(q)
        }
        emptyBuffer() {
            return kU8.emptyBuffer
        }
        fromString(q, K) {
            return Buffer.from(q, K)
        }
        toString(q, K) {
            if (q instanceof Buffer) return q.toString(K);
            else return new eXK.TextDecoder(K).decode(q)
        }
        asNative(q, K) {
            if (K === void 0) return q instanceof Buffer ? q : Buffer.from(q);
            else return q instanceof Buffer ? q.slice(0, K) : Buffer.from(q, 0, K)
        }
        allocNative(q) {
            return Buffer.allocUnsafe(q)
        }
    }
    kU8.emptyBuffer = Buffer.allocUnsafe(0);
    class qMK {
        constructor(q) {
            this.stream = q
        }
        onClose(q) {
            return this.stream.on("close", q), ze.Disposable.create(() => this.stream.off("close", q))
        }
        onError(q) {
            return this.stream.on("error", q), ze.Disposable.create(() => this.stream.off("error", q))
        }
        onEnd(q) {
            return this.stream.on("end", q), ze.Disposable.create(() => this.stream.off("end", q))
        }
        onData(q) {
            return this.stream.on("data", q), ze.Disposable.create(() => this.stream.off("data", q))
        }
    }
    class KMK {
        constructor(q) {
            this.stream = q
        }
        onClose(q) {
            return this.stream.on("close", q), ze.Disposable.create(() => this.stream.off("close", q))
        }
        onError(q) {
            return this.stream.on("error", q), ze.Disposable.create(() => this.stream.off("error", q))
        }
        onEnd(q) {
            return this.stream.on("end", q), ze.Disposable.create(() => this.stream.off("end", q))
        }
        write(q, K) {
            return new Promise((_, z) => {
                let Y = (A) => {
                    if (A === void 0 || A === null) _();
                    else z(A)
                };
                if (typeof q === "string") this.stream.write(q, K, Y);
                else this.stream.write(q, Y)
            })
        }
        end() {
            this.stream.end()
        }
    }
    var _MK = Object.freeze({
        messageBuffer: Object.freeze({
            create: (q) => new kU8(q)
        }),
        applicationJson: Object.freeze({
            encoder: Object.freeze({
                name: "application/json",
                encode: (q, K) => {
                    try {
                        return Promise.resolve(Buffer.from(JSON.stringify(q, void 0, 0), K.charset))
                    } catch (_) {
                        return Promise.reject(_)
                    }
                }
            }),
            decoder: Object.freeze({
                name: "application/json",
                decode: (q, K) => {
                    try {
                        if (q instanceof Buffer) return Promise.resolve(JSON.parse(q.toString(K.charset)));
                        else return Promise.resolve(JSON.parse(new eXK.TextDecoder(K.charset).decode(q)))
                    } catch (_) {
                        return Promise.reject(_)
                    }
                }
            })
        }),
        stream: Object.freeze({
            asReadableStream: (q) => new qMK(q),
            asWritableStream: (q) => new KMK(q)
        }),
        console,
        timer: Object.freeze({
            setTimeout(q, K, ..._) {
                let z = setTimeout(q, K, ..._);
                return {
                    dispose: () => clearTimeout(z)
                }
            },
            setImmediate(q, ...K) {
                let _ = setImmediate(q, ...K);
                return {
                    dispose: () => clearImmediate(_)
                }
            },
            setInterval(q, K, ..._) {
                let z = setInterval(q, K, ..._);
                return {
                    dispose: () => clearInterval(z)
                }
            }
        })
    });

    function H47() {
        return _MK
    }(function(q) {
        function K() {
            ze.RAL.install(_MK)
        }
        q.install = K
    })(H47 || (H47 = {}));
    zMK.default = H47
})