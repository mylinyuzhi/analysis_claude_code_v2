
// @from(Ln 27853, Col 4)
B_ = p((UN) => {
    Object.defineProperty(UN, "__esModule", {
        value: !0
    });
    UN.or = UN.and = UN.not = UN.CodeGen = UN.operators = UN.varKinds = UN.ValueScopeName = UN.ValueScope = UN.Scope = UN.Name = UN.regexpCode = UN.stringify = UN.getProperty = UN.nil = UN.strConcat = UN.str = UN._ = void 0;
    var vY = gg6(),
        Dm = y91(),
        A16 = gg6();
    Object.defineProperty(UN, "_", {
        enumerable: !0,
        get: function() {
            return A16._
        }
    });
    Object.defineProperty(UN, "str", {
        enumerable: !0,
        get: function() {
            return A16.str
        }
    });
    Object.defineProperty(UN, "strConcat", {
        enumerable: !0,
        get: function() {
            return A16.strConcat
        }
    });
    Object.defineProperty(UN, "nil", {
        enumerable: !0,
        get: function() {
            return A16.nil
        }
    });
    Object.defineProperty(UN, "getProperty", {
        enumerable: !0,
        get: function() {
            return A16.getProperty
        }
    });
    Object.defineProperty(UN, "stringify", {
        enumerable: !0,
        get: function() {
            return A16.stringify
        }
    });
    Object.defineProperty(UN, "regexpCode", {
        enumerable: !0,
        get: function() {
            return A16.regexpCode
        }
    });
    Object.defineProperty(UN, "Name", {
        enumerable: !0,
        get: function() {
            return A16.Name
        }
    });
    var Aj8 = y91();
    Object.defineProperty(UN, "Scope", {
        enumerable: !0,
        get: function() {
            return Aj8.Scope
        }
    });
    Object.defineProperty(UN, "ValueScope", {
        enumerable: !0,
        get: function() {
            return Aj8.ValueScope
        }
    });
    Object.defineProperty(UN, "ValueScopeName", {
        enumerable: !0,
        get: function() {
            return Aj8.ValueScopeName
        }
    });
    Object.defineProperty(UN, "varKinds", {
        enumerable: !0,
        get: function() {
            return Aj8.varKinds
        }
    });
    UN.operators = {
        GT: new vY._Code(">"),
        GTE: new vY._Code(">="),
        LT: new vY._Code("<"),
        LTE: new vY._Code("<="),
        EQ: new vY._Code("==="),
        NEQ: new vY._Code("!=="),
        NOT: new vY._Code("!"),
        OR: new vY._Code("||"),
        AND: new vY._Code("&&"),
        ADD: new vY._Code("+")
    };
    class O16 {
        optimizeNodes() {
            return this
        }
        optimizeNames(q, K) {
            return this
        }
    }
    class IE7 extends O16 {
        constructor(q, K, _) {
            super();
            this.varKind = q, this.name = K, this.rhs = _
        }
        render({
            es5: q,
            _n: K
        }) {
            let _ = q ? Dm.varKinds.var : this.varKind,
                z = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
            return `${_} ${this.name}${z};` + K
        }
        optimizeNames(q, K) {
            if (!q[this.name.str]) return;
            if (this.rhs) this.rhs = UZ6(this.rhs, q, K);
            return this
        }
        get names() {
            return this.rhs instanceof vY._CodeOrName ? this.rhs.names : {}
        }
    }
    class R91 extends O16 {
        constructor(q, K, _) {
            super();
            this.lhs = q, this.rhs = K, this.sideEffects = _
        }
        render({
            _n: q
        }) {
            return `${this.lhs} = ${this.rhs};` + q
        }
        optimizeNames(q, K) {
            if (this.lhs instanceof vY.Name && !q[this.lhs.str] && !this.sideEffects) return;
            return this.rhs = UZ6(this.rhs, q, K), this
        }
        get names() {
            let q = this.lhs instanceof vY.Name ? {} : {
                ...this.lhs.names
            };
            return Yj8(q, this.rhs)
        }
    }
    class xE7 extends R91 {
        constructor(q, K, _, z) {
            super(q, _, z);
            this.op = K
        }
        render({
            _n: q
        }) {
            return `${this.lhs} ${this.op}= ${this.rhs};` + q
        }
    }
    class uE7 extends O16 {
        constructor(q) {
            super();
            this.label = q, this.names = {}
        }
        render({
            _n: q
        }) {
            return `${this.label}:` + q
        }
    }
    class mE7 extends O16 {
        constructor(q) {
            super();
            this.label = q, this.names = {}
        }
        render({
            _n: q
        }) {
            return `break${this.label?` ${this.label}`:""};` + q
        }
    }
    class BE7 extends O16 {
        constructor(q) {
            super();
            this.error = q
        }
        render({
            _n: q
        }) {
            return `throw ${this.error};` + q
        }
        get names() {
            return this.error.names
        }
    }
    class pE7 extends O16 {
        constructor(q) {
            super();
            this.code = q
        }
        render({
            _n: q
        }) {
            return `${this.code};` + q
        }
        optimizeNodes() {
            return `${this.code}` ? this : void 0
        }
        optimizeNames(q, K) {
            return this.code = UZ6(this.code, q, K), this
        }
        get names() {
            return this.code instanceof vY._CodeOrName ? this.code.names : {}
        }
    }
    class Oj8 extends O16 {
        constructor(q = []) {
            super();
            this.nodes = q
        }
        render(q) {
            return this.nodes.reduce((K, _) => K + _.render(q), "")
        }
        optimizeNodes() {
            let {
                nodes: q
            } = this, K = q.length;
            while (K--) {
                let _ = q[K].optimizeNodes();
                if (Array.isArray(_)) q.splice(K, 1, ..._);
                else if (_) q[K] = _;
                else q.splice(K, 1)
            }
            return q.length > 0 ? this : void 0
        }
        optimizeNames(q, K) {
            let {
                nodes: _
            } = this, z = _.length;
            while (z--) {
                let Y = _[z];
                if (Y.optimizeNames(q, K)) continue;
                wh5(q, Y.names), _.splice(z, 1)
            }
            return _.length > 0 ? this : void 0
        }
        get names() {
            return this.nodes.reduce((q, K) => sY6(q, K.names), {})
        }
    }
    class w16 extends Oj8 {
        render(q) {
            return "{" + q._n + super.render(q) + "}" + q._n
        }
    }
    class FE7 extends Oj8 {}
    class Ug6 extends w16 {}
    Ug6.kind = "else";
    class Hr extends w16 {
        constructor(q, K) {
            super(K);
            this.condition = q
        }
        render(q) {
            let K = `if(${this.condition})` + super.render(q);
            if (this.else) K += "else " + this.else.render(q);
            return K
        }
        optimizeNodes() {
            super.optimizeNodes();
            let q = this.condition;
            if (q === !0) return this.nodes;
            let K = this.else;
            if (K) {
                let _ = K.optimizeNodes();
                K = this.else = Array.isArray(_) ? new Ug6(_) : _
            }
            if (K) {
                if (q === !1) return K instanceof Hr ? K : K.nodes;
                if (this.nodes.length) return this;
                return new Hr(cE7(q), K instanceof Hr ? [K] : K.nodes)
            }
            if (q === !1 || !this.nodes.length) return;
            return this
        }
        optimizeNames(q, K) {
            var _;
            if (this.else = (_ = this.else) === null || _ === void 0 ? void 0 : _.optimizeNames(q, K), !(super.optimizeNames(q, K) || this.else)) return;
            return this.condition = UZ6(this.condition, q, K), this
        }
        get names() {
            let q = super.names;
            if (Yj8(q, this.condition), this.else) sY6(q, this.else.names);
            return q
        }
    }
    Hr.kind = "if";
    class gZ6 extends w16 {}
    gZ6.kind = "for";
    class gE7 extends gZ6 {
        constructor(q) {
            super();
            this.iteration = q
        }
        render(q) {
            return `for(${this.iteration})` + super.render(q)
        }
        optimizeNames(q, K) {
            if (!super.optimizeNames(q, K)) return;
            return this.iteration = UZ6(this.iteration, q, K), this
        }
        get names() {
            return sY6(super.names, this.iteration.names)
        }
    }
    class UE7 extends gZ6 {
        constructor(q, K, _, z) {
            super();
            this.varKind = q, this.name = K, this.from = _, this.to = z
        }
        render(q) {
            let K = q.es5 ? Dm.varKinds.var : this.varKind,
                {
                    name: _,
                    from: z,
                    to: Y
                } = this;
            return `for(${K} ${_}=${z}; ${_}<${Y}; ${_}++)` + super.render(q)
        }
        get names() {
            let q = Yj8(super.names, this.from);
            return Yj8(q, this.to)
        }
    }
    class L91 extends gZ6 {
        constructor(q, K, _, z) {
            super();
            this.loop = q, this.varKind = K, this.name = _, this.iterable = z
        }
        render(q) {
            return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(q)
        }
        optimizeNames(q, K) {
            if (!super.optimizeNames(q, K)) return;
            return this.iterable = UZ6(this.iterable, q, K), this
        }
        get names() {
            return sY6(super.names, this.iterable.names)
        }
    }
    class qj8 extends w16 {
        constructor(q, K, _) {
            super();
            this.name = q, this.args = K, this.async = _
        }
        render(q) {
            return `${this.async?"async ":""}function ${this.name}(${this.args})` + super.render(q)
        }
    }
    qj8.kind = "func";
    class Kj8 extends Oj8 {
        render(q) {
            return "return " + super.render(q)
        }
    }
    Kj8.kind = "return";
    class QE7 extends w16 {
        render(q) {
            let K = "try" + super.render(q);
            if (this.catch) K += this.catch.render(q);
            if (this.finally) K += this.finally.render(q);
            return K
        }
        optimizeNodes() {
            var q, K;
            return super.optimizeNodes(), (q = this.catch) === null || q === void 0 || q.optimizeNodes(), (K = this.finally) === null || K === void 0 || K.optimizeNodes(), this
        }
        optimizeNames(q, K) {
            var _, z;
            return super.optimizeNames(q, K), (_ = this.catch) === null || _ === void 0 || _.optimizeNames(q, K), (z = this.finally) === null || z === void 0 || z.optimizeNames(q, K), this
        }
        get names() {
            let q = super.names;
            if (this.catch) sY6(q, this.catch.names);
            if (this.finally) sY6(q, this.finally.names);
            return q
        }
    }
    class _j8 extends w16 {
        constructor(q) {
            super();
            this.error = q
        }
        render(q) {
            return `catch(${this.error})` + super.render(q)
        }
    }
    _j8.kind = "catch";
    class zj8 extends w16 {
        render(q) {
            return "finally" + super.render(q)
        }
    }
    zj8.kind = "finally";
    class dE7 {
        constructor(q, K = {}) {
            this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = {
                ...K,
                _n: K.lines ? `
` : ""
            }, this._extScope = q, this._scope = new Dm.Scope({
                parent: q
            }), this._nodes = [new FE7]
        }
        toString() {
            return this._root.render(this.opts)
        }
        name(q) {
            return this._scope.name(q)
        }
        scopeName(q) {
            return this._extScope.name(q)
        }
        scopeValue(q, K) {
            let _ = this._extScope.value(q, K);
            return (this._values[_.prefix] || (this._values[_.prefix] = new Set)).add(_), _
        }
        getScopeValue(q, K) {
            return this._extScope.getValue(q, K)
        }
        scopeRefs(q) {
            return this._extScope.scopeRefs(q, this._values)
        }
        scopeCode() {
            return this._extScope.scopeCode(this._values)
        }
        _def(q, K, _, z) {
            let Y = this._scope.toName(K);
            if (_ !== void 0 && z) this._constants[Y.str] = _;
            return this._leafNode(new IE7(q, Y, _)), Y
        }
        const (q, K, _) {
            return this._def(Dm.varKinds.const, q, K, _)
        }
        let (q, K, _) {
            return this._def(Dm.varKinds.let, q, K, _)
        }
        var (q, K, _) {
            return this._def(Dm.varKinds.var, q, K, _)
        }
        assign(q, K, _) {
            return this._leafNode(new R91(q, K, _))
        }
        add(q, K) {
            return this._leafNode(new xE7(q, UN.operators.ADD, K))
        }
        code(q) {
            if (typeof q == "function") q();
            else if (q !== vY.nil) this._leafNode(new pE7(q));
            return this
        }
        object(...q) {
            let K = ["{"];
            for (let [_, z] of q) {
                if (K.length > 1) K.push(",");
                if (K.push(_), _ !== z || this.opts.es5) K.push(":"), (0, vY.addCodeArg)(K, z)
            }
            return K.push("}"), new vY._Code(K)
        }
        if (q, K, _) {
            if (this._blockNode(new Hr(q)), K && _) this.code(K).else().code(_).endIf();
            else if (K) this.code(K).endIf();
            else if (_) throw Error('CodeGen: "else" body without "then" body');
            return this
        }
        elseIf(q) {
            return this._elseNode(new Hr(q))
        } else() {
            return this._elseNode(new Ug6)
        }
        endIf() {
            return this._endBlockNode(Hr, Ug6)
        }
        _for(q, K) {
            if (this._blockNode(q), K) this.code(K).endFor();
            return this
        }
        for (q, K) {
            return this._for(new gE7(q), K)
        }
        forRange(q, K, _, z, Y = this.opts.es5 ? Dm.varKinds.var : Dm.varKinds.let) {
            let A = this._scope.toName(q);
            return this._for(new UE7(Y, A, K, _), () => z(A))
        }
        forOf(q, K, _, z = Dm.varKinds.const) {
            let Y = this._scope.toName(q);
            if (this.opts.es5) {
                let A = K instanceof vY.Name ? K : this.var("_arr", K);
                return this.forRange("_i", 0, vY._`${A}.length`, (O) => {
                    this.var(Y, vY._`${A}[${O}]`), _(Y)
                })
            }
            return this._for(new L91("of", z, Y, K), () => _(Y))
        }
        forIn(q, K, _, z = this.opts.es5 ? Dm.varKinds.var : Dm.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(q, vY._`Object.keys(${K})`, _);
            let Y = this._scope.toName(q);
            return this._for(new L91("in", z, Y, K), () => _(Y))
        }
        endFor() {
            return this._endBlockNode(gZ6)
        }
        label(q) {
            return this._leafNode(new uE7(q))
        }
        break (q) {
            return this._leafNode(new mE7(q))
        }
        return (q) {
            let K = new Kj8;
            if (this._blockNode(K), this.code(q), K.nodes.length !== 1) throw Error('CodeGen: "return" should have one node');
            return this._endBlockNode(Kj8)
        }
        try (q, K, _) {
            if (!K && !_) throw Error('CodeGen: "try" without "catch" and "finally"');
            let z = new QE7;
            if (this._blockNode(z), this.code(q), K) {
                let Y = this.name("e");
                this._currNode = z.catch = new _j8(Y), K(Y)
            }
            if (_) this._currNode = z.finally = new zj8, this.code(_);
            return this._endBlockNode(_j8, zj8)
        }
        throw (q) {
            return this._leafNode(new BE7(q))
        }
        block(q, K) {
            if (this._blockStarts.push(this._nodes.length), q) this.code(q).endBlock(K);
            return this
        }
        endBlock(q) {
            let K = this._blockStarts.pop();
            if (K === void 0) throw Error("CodeGen: not in self-balancing block");
            let _ = this._nodes.length - K;
            if (_ < 0 || q !== void 0 && _ !== q) throw Error(`CodeGen: wrong number of nodes: ${_} vs ${q} expected`);
            return this._nodes.length = K, this
        }
        func(q, K = vY.nil, _, z) {
            if (this._blockNode(new qj8(q, K, _)), z) this.code(z).endFunc();
            return this
        }
        endFunc() {
            return this._endBlockNode(qj8)
        }
        optimize(q = 1) {
            while (q-- > 0) this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants)
        }
        _leafNode(q) {
            return this._currNode.nodes.push(q), this
        }
        _blockNode(q) {
            this._currNode.nodes.push(q), this._nodes.push(q)
        }
        _endBlockNode(q, K) {
            let _ = this._currNode;
            if (_ instanceof q || K && _ instanceof K) return this._nodes.pop(), this;
            throw Error(`CodeGen: not in block "${K?`${q.kind}/${K.kind}`:q.kind}"`)
        }
        _elseNode(q) {
            let K = this._currNode;
            if (!(K instanceof Hr)) throw Error('CodeGen: "else" without "if"');
            return this._currNode = K.else = q, this
        }
        get _root() {
            return this._nodes[0]
        }
        get _currNode() {
            let q = this._nodes;
            return q[q.length - 1]
        }
        set _currNode(q) {
            let K = this._nodes;
            K[K.length - 1] = q
        }
    }
    UN.CodeGen = dE7;

    function sY6(q, K) {
        for (let _ in K) q[_] = (q[_] || 0) + (K[_] || 0);
        return q
    }

    function Yj8(q, K) {
        return K instanceof vY._CodeOrName ? sY6(q, K.names) : q
    }

    function UZ6(q, K, _) {
        if (q instanceof vY.Name) return z(q);
        if (!Y(q)) return q;
        return new vY._Code(q._items.reduce((A, O) => {
            if (O instanceof vY.Name) O = z(O);
            if (O instanceof vY._Code) A.push(...O._items);
            else A.push(O);
            return A
        }, []));

        function z(A) {
            let O = _[A.str];
            if (O === void 0 || K[A.str] !== 1) return A;
            return delete K[A.str], O
        }

        function Y(A) {
            return A instanceof vY._Code && A._items.some((O) => O instanceof vY.Name && K[O.str] === 1 && _[O.str] !== void 0)
        }
    }

    function wh5(q, K) {
        for (let _ in K) q[_] = (q[_] || 0) - (K[_] || 0)
    }

    function cE7(q) {
        return typeof q == "boolean" || typeof q == "number" || q === null ? !q : vY._`!${h91(q)}`
    }
    UN.not = cE7;
    var $h5 = lE7(UN.operators.AND);

    function jh5(...q) {
        return q.reduce($h5)
    }
    UN.and = jh5;
    var Hh5 = lE7(UN.operators.OR);

    function Jh5(...q) {
        return q.reduce(Hh5)
    }
    UN.or = Jh5;

    function lE7(q) {
        return (K, _) => K === vY.nil ? _ : _ === vY.nil ? K : vY._`${h91(K)} ${q} ${h91(_)}`
    }

    function h91(q) {
        return q instanceof vY.Name ? q : vY._`(${q})`
    }
})
// @from(Ln 28495, Col 4)
nY = p((qy7) => {
    Object.defineProperty(qy7, "__esModule", {
        value: !0
    });
    qy7.checkStrictMode = qy7.getErrorPath = qy7.Type = qy7.useFunc = qy7.setEvaluated = qy7.evaluatedPropsToName = qy7.mergeEvaluated = qy7.eachItem = qy7.unescapeJsonPointer = qy7.escapeJsonPointer = qy7.escapeFragment = qy7.unescapeFragment = qy7.schemaRefOrVal = qy7.schemaHasRulesButRef = qy7.schemaHasRules = qy7.checkUnknownRules = qy7.alwaysValidSchema = qy7.toHash = void 0;
    var y2 = B_(),
        Wh5 = gg6();

    function Dh5(q) {
        let K = {};
        for (let _ of q) K[_] = !0;
        return K
    }
    qy7.toHash = Dh5;

    function Zh5(q, K) {
        if (typeof K == "boolean") return K;
        if (Object.keys(K).length === 0) return !0;
        return oE7(q, K), !aE7(K, q.self.RULES.all)
    }
    qy7.alwaysValidSchema = Zh5;

    function oE7(q, K = q.schema) {
        let {
            opts: _,
            self: z
        } = q;
        if (!_.strictSchema) return;
        if (typeof K === "boolean") return;
        let Y = z.RULES.keywords;
        for (let A in K)
            if (!Y[A]) eE7(q, `unknown keyword: "${A}"`)
    }
    qy7.checkUnknownRules = oE7;

    function aE7(q, K) {
        if (typeof q == "boolean") return !q;
        for (let _ in q)
            if (K[_]) return !0;
        return !1
    }
    qy7.schemaHasRules = aE7;

    function fh5(q, K) {
        if (typeof q == "boolean") return !q;
        for (let _ in q)
            if (_ !== "$ref" && K.all[_]) return !0;
        return !1
    }
    qy7.schemaHasRulesButRef = fh5;

    function Gh5({
        topSchemaRef: q,
        schemaPath: K
    }, _, z, Y) {
        if (!Y) {
            if (typeof _ == "number" || typeof _ == "boolean") return _;
            if (typeof _ == "string") return y2._`${_}`
        }
        return y2._`${q}${K}${(0,y2.getProperty)(z)}`
    }
    qy7.schemaRefOrVal = Gh5;

    function vh5(q) {
        return sE7(decodeURIComponent(q))
    }
    qy7.unescapeFragment = vh5;

    function Th5(q) {
        return encodeURIComponent(C91(q))
    }
    qy7.escapeFragment = Th5;

    function C91(q) {
        if (typeof q == "number") return `${q}`;
        return q.replace(/~/g, "~0").replace(/\//g, "~1")
    }
    qy7.escapeJsonPointer = C91;

    function sE7(q) {
        return q.replace(/~1/g, "/").replace(/~0/g, "~")
    }
    qy7.unescapeJsonPointer = sE7;

    function Vh5(q, K) {
        if (Array.isArray(q))
            for (let _ of q) K(_);
        else K(q)
    }
    qy7.eachItem = Vh5;

    function iE7({
        mergeNames: q,
        mergeToName: K,
        mergeValues: _,
        resultToName: z
    }) {
        return (Y, A, O, w) => {
            let $ = O === void 0 ? A : O instanceof y2.Name ? (A instanceof y2.Name ? q(Y, A, O) : K(Y, A, O), O) : A instanceof y2.Name ? (K(Y, O, A), A) : _(A, O);
            return w === y2.Name && !($ instanceof y2.Name) ? z(Y, $) : $
        }
    }
    qy7.mergeEvaluated = {
        props: iE7({
            mergeNames: (q, K, _) => q.if(y2._`${_} !== true && ${K} !== undefined`, () => {
                q.if(y2._`${K} === true`, () => q.assign(_, !0), () => q.assign(_, y2._`${_} || {}`).code(y2._`Object.assign(${_}, ${K})`))
            }),
            mergeToName: (q, K, _) => q.if(y2._`${_} !== true`, () => {
                if (K === !0) q.assign(_, !0);
                else q.assign(_, y2._`${_} || {}`), b91(q, _, K)
            }),
            mergeValues: (q, K) => q === !0 ? !0 : {
                ...q,
                ...K
            },
            resultToName: tE7
        }),
        items: iE7({
            mergeNames: (q, K, _) => q.if(y2._`${_} !== true && ${K} !== undefined`, () => q.assign(_, y2._`${K} === true ? true : ${_} > ${K} ? ${_} : ${K}`)),
            mergeToName: (q, K, _) => q.if(y2._`${_} !== true`, () => q.assign(_, K === !0 ? !0 : y2._`${_} > ${K} ? ${_} : ${K}`)),
            mergeValues: (q, K) => q === !0 ? !0 : Math.max(q, K),
            resultToName: (q, K) => q.var("items", K)
        })
    };

    function tE7(q, K) {
        if (K === !0) return q.var("props", !0);
        let _ = q.var("props", y2._`{}`);
        if (K !== void 0) b91(q, _, K);
        return _
    }
    qy7.evaluatedPropsToName = tE7;

    function b91(q, K, _) {
        Object.keys(_).forEach((z) => q.assign(y2._`${K}${(0,y2.getProperty)(z)}`, !0))
    }
    qy7.setEvaluated = b91;
    var rE7 = {};

    function kh5(q, K) {
        return q.scopeValue("func", {
            ref: K,
            code: rE7[K.code] || (rE7[K.code] = new Wh5._Code(K.code))
        })
    }
    qy7.useFunc = kh5;
    var S91;
    (function(q) {
        q[q.Num = 0] = "Num", q[q.Str = 1] = "Str"
    })(S91 || (qy7.Type = S91 = {}));

    function Nh5(q, K, _) {
        if (q instanceof y2.Name) {
            let z = K === S91.Num;
            return _ ? z ? y2._`"[" + ${q} + "]"` : y2._`"['" + ${q} + "']"` : z ? y2._`"/" + ${q}` : y2._`"/" + ${q}.replace(/~/g, "~0").replace(/\\//g, "~1")`
        }
        return _ ? (0, y2.getProperty)(q).toString() : "/" + C91(q)
    }
    qy7.getErrorPath = Nh5;

    function eE7(q, K, _ = q.opts.strictSchema) {
        if (!_) return;
        if (K = `strict mode: ${K}`, _ === !0) throw Error(K);
        q.self.logger.warn(K)
    }
    qy7.checkStrictMode = eE7
})
// @from(Ln 28662, Col 4)
Jr = p((_y7) => {
    Object.defineProperty(_y7, "__esModule", {
        value: !0
    });
    var Kv = B_(),
        Qh5 = {
            data: new Kv.Name("data"),
            valCxt: new Kv.Name("valCxt"),
            instancePath: new Kv.Name("instancePath"),
            parentData: new Kv.Name("parentData"),
            parentDataProperty: new Kv.Name("parentDataProperty"),
            rootData: new Kv.Name("rootData"),
            dynamicAnchors: new Kv.Name("dynamicAnchors"),
            vErrors: new Kv.Name("vErrors"),
            errors: new Kv.Name("errors"),
            this: new Kv.Name("this"),
            self: new Kv.Name("self"),
            scope: new Kv.Name("scope"),
            json: new Kv.Name("json"),
            jsonPos: new Kv.Name("jsonPos"),
            jsonLen: new Kv.Name("jsonLen"),
            jsonPart: new Kv.Name("jsonPart")
        };
    _y7.default = Qh5
})
// @from(Ln 28687, Col 4)
Qg6 = p((Oy7) => {
    Object.defineProperty(Oy7, "__esModule", {
        value: !0
    });
    Oy7.extendErrors = Oy7.resetErrorsCount = Oy7.reportExtraError = Oy7.reportError = Oy7.keyword$DataError = Oy7.keywordError = void 0;
    var iY = B_(),
        $j8 = nY(),
        fV = Jr();
    Oy7.keywordError = {
        message: ({
            keyword: q
        }) => iY.str`must pass "${q}" keyword validation`
    };
    Oy7.keyword$DataError = {
        message: ({
            keyword: q,
            schemaType: K
        }) => K ? iY.str`"${q}" keyword must be ${K} ($data)` : iY.str`"${q}" keyword is invalid ($data)`
    };

    function ch5(q, K = Oy7.keywordError, _, z) {
        let {
            it: Y
        } = q, {
            gen: A,
            compositeRule: O,
            allErrors: w
        } = Y, $ = Ay7(q, K, _);
        if (z !== null && z !== void 0 ? z : O || w) zy7(A, $);
        else Yy7(Y, iY._`[${$}]`)
    }
    Oy7.reportError = ch5;

    function lh5(q, K = Oy7.keywordError, _) {
        let {
            it: z
        } = q, {
            gen: Y,
            compositeRule: A,
            allErrors: O
        } = z, w = Ay7(q, K, _);
        if (zy7(Y, w), !(A || O)) Yy7(z, fV.default.vErrors)
    }
    Oy7.reportExtraError = lh5;

    function nh5(q, K) {
        q.assign(fV.default.errors, K), q.if(iY._`${fV.default.vErrors} !== null`, () => q.if(K, () => q.assign(iY._`${fV.default.vErrors}.length`, K), () => q.assign(fV.default.vErrors, null)))
    }
    Oy7.resetErrorsCount = nh5;

    function ih5({
        gen: q,
        keyword: K,
        schemaValue: _,
        data: z,
        errsCount: Y,
        it: A
    }) {
        if (Y === void 0) throw Error("ajv implementation error");
        let O = q.name("err");
        q.forRange("i", Y, fV.default.errors, (w) => {
            if (q.const(O, iY._`${fV.default.vErrors}[${w}]`), q.if(iY._`${O}.instancePath === undefined`, () => q.assign(iY._`${O}.instancePath`, (0, iY.strConcat)(fV.default.instancePath, A.errorPath))), q.assign(iY._`${O}.schemaPath`, iY.str`${A.errSchemaPath}/${K}`), A.opts.verbose) q.assign(iY._`${O}.schema`, _), q.assign(iY._`${O}.data`, z)
        })
    }
    Oy7.extendErrors = ih5;

    function zy7(q, K) {
        let _ = q.const("err", K);
        q.if(iY._`${fV.default.vErrors} === null`, () => q.assign(fV.default.vErrors, iY._`[${_}]`), iY._`${fV.default.vErrors}.push(${_})`), q.code(iY._`${fV.default.errors}++`)
    }

    function Yy7(q, K) {
        let {
            gen: _,
            validateName: z,
            schemaEnv: Y
        } = q;
        if (Y.$async) _.throw(iY._`new ${q.ValidationError}(${K})`);
        else _.assign(iY._`${z}.errors`, K), _.return(!1)
    }
    var tY6 = {
        keyword: new iY.Name("keyword"),
        schemaPath: new iY.Name("schemaPath"),
        params: new iY.Name("params"),
        propertyName: new iY.Name("propertyName"),
        message: new iY.Name("message"),
        schema: new iY.Name("schema"),
        parentSchema: new iY.Name("parentSchema")
    };

    function Ay7(q, K, _) {
        let {
            createErrors: z
        } = q.it;
        if (z === !1) return iY._`{}`;
        return rh5(q, K, _)
    }

    function rh5(q, K, _ = {}) {
        let {
            gen: z,
            it: Y
        } = q, A = [oh5(Y, _), ah5(q, _)];
        return sh5(q, K, A), z.object(...A)
    }

    function oh5({
        errorPath: q
    }, {
        instancePath: K
    }) {
        let _ = K ? iY.str`${q}${(0,$j8.getErrorPath)(K,$j8.Type.Str)}` : q;
        return [fV.default.instancePath, (0, iY.strConcat)(fV.default.instancePath, _)]
    }

    function ah5({
        keyword: q,
        it: {
            errSchemaPath: K
        }
    }, {
        schemaPath: _,
        parentSchema: z
    }) {
        let Y = z ? K : iY.str`${K}/${q}`;
        if (_) Y = iY.str`${Y}${(0,$j8.getErrorPath)(_,$j8.Type.Str)}`;
        return [tY6.schemaPath, Y]
    }

    function sh5(q, {
        params: K,
        message: _
    }, z) {
        let {
            keyword: Y,
            data: A,
            schemaValue: O,
            it: w
        } = q, {
            opts: $,
            propertyName: j,
            topSchemaRef: H,
            schemaPath: J
        } = w;
        if (z.push([tY6.keyword, Y], [tY6.params, typeof K == "function" ? K(q) : K || iY._`{}`]), $.messages) z.push([tY6.message, typeof _ == "function" ? _(q) : _]);
        if ($.verbose) z.push([tY6.schema, O], [tY6.parentSchema, iY._`${H}${J}`], [fV.default.data, A]);
        if (j) z.push([tY6.propertyName, j])
    }
})
// @from(Ln 28836, Col 4)
Jy7 = p((jy7) => {
    Object.defineProperty(jy7, "__esModule", {
        value: !0
    });
    jy7.boolOrEmptySchema = jy7.topBoolOrEmptySchema = void 0;
    var _R5 = Qg6(),
        zR5 = B_(),
        YR5 = Jr(),
        AR5 = {
            message: "boolean schema is false"
        };

    function OR5(q) {
        let {
            gen: K,
            schema: _,
            validateName: z
        } = q;
        if (_ === !1) $y7(q, !1);
        else if (typeof _ == "object" && _.$async === !0) K.return(YR5.default.data);
        else K.assign(zR5._`${z}.errors`, null), K.return(!0)
    }
    jy7.topBoolOrEmptySchema = OR5;

    function wR5(q, K) {
        let {
            gen: _,
            schema: z
        } = q;
        if (z === !1) _.var(K, !1), $y7(q);
        else _.var(K, !0)
    }
    jy7.boolOrEmptySchema = wR5;

    function $y7(q, K) {
        let {
            gen: _,
            data: z
        } = q, Y = {
            gen: _,
            keyword: "false schema",
            data: z,
            schema: !1,
            schemaCode: !1,
            schemaValue: !1,
            params: {},
            it: q
        };
        (0, _R5.reportError)(Y, AR5, void 0, K)
    }
})
// @from(Ln 28887, Col 4)
x91 = p((Xy7) => {
    Object.defineProperty(Xy7, "__esModule", {
        value: !0
    });
    Xy7.getRules = Xy7.isJSONType = void 0;
    var jR5 = ["string", "number", "integer", "boolean", "null", "object", "array"],
        HR5 = new Set(jR5);

    function JR5(q) {
        return typeof q == "string" && HR5.has(q)
    }
    Xy7.isJSONType = JR5;

    function XR5() {
        let q = {
            number: {
                type: "number",
                rules: []
            },
            string: {
                type: "string",
                rules: []
            },
            array: {
                type: "array",
                rules: []
            },
            object: {
                type: "object",
                rules: []
            }
        };
        return {
            types: {
                ...q,
                integer: !0,
                boolean: !0,
                null: !0
            },
            rules: [{
                rules: []
            }, q.number, q.string, q.array, q.object],
            post: {
                rules: []
            },
            all: {},
            keywords: {}
        }
    }
    Xy7.getRules = XR5
})
// @from(Ln 28938, Col 4)
u91 = p((Dy7) => {
    Object.defineProperty(Dy7, "__esModule", {
        value: !0
    });
    Dy7.shouldUseRule = Dy7.shouldUseGroup = Dy7.schemaHasRulesForType = void 0;

    function PR5({
        schema: q,
        self: K
    }, _) {
        let z = K.RULES.types[_];
        return z && z !== !0 && Py7(q, z)
    }
    Dy7.schemaHasRulesForType = PR5;

    function Py7(q, K) {
        return K.rules.some((_) => Wy7(q, _))
    }
    Dy7.shouldUseGroup = Py7;

    function Wy7(q, K) {
        var _;
        return q[K.keyword] !== void 0 || ((_ = K.definition.implements) === null || _ === void 0 ? void 0 : _.some((z) => q[z] !== void 0))
    }
    Dy7.shouldUseRule = Wy7
})
// @from(Ln 28964, Col 4)
dg6 = p((Ty7) => {
    Object.defineProperty(Ty7, "__esModule", {
        value: !0
    });
    Ty7.reportTypeError = Ty7.checkDataTypes = Ty7.checkDataType = Ty7.coerceAndCheckDataType = Ty7.getJSONTypes = Ty7.getSchemaTypes = Ty7.DataType = void 0;
    var ZR5 = x91(),
        fR5 = u91(),
        GR5 = Qg6(),
        W_ = B_(),
        fy7 = nY(),
        QZ6;
    (function(q) {
        q[q.Correct = 0] = "Correct", q[q.Wrong = 1] = "Wrong"
    })(QZ6 || (Ty7.DataType = QZ6 = {}));

    function vR5(q) {
        let K = Gy7(q.type);
        if (K.includes("null")) {
            if (q.nullable === !1) throw Error("type: null contradicts nullable: false")
        } else {
            if (!K.length && q.nullable !== void 0) throw Error('"nullable" cannot be used without "type"');
            if (q.nullable === !0) K.push("null")
        }
        return K
    }
    Ty7.getSchemaTypes = vR5;

    function Gy7(q) {
        let K = Array.isArray(q) ? q : q ? [q] : [];
        if (K.every(ZR5.isJSONType)) return K;
        throw Error("type must be JSONType or JSONType[]: " + K.join(","))
    }
    Ty7.getJSONTypes = Gy7;

    function TR5(q, K) {
        let {
            gen: _,
            data: z,
            opts: Y
        } = q, A = VR5(K, Y.coerceTypes), O = K.length > 0 && !(A.length === 0 && K.length === 1 && (0, fR5.schemaHasRulesForType)(q, K[0]));
        if (O) {
            let w = B91(K, z, Y.strictNumbers, QZ6.Wrong);
            _.if(w, () => {
                if (A.length) kR5(q, K, A);
                else p91(q)
            })
        }
        return O
    }
    Ty7.coerceAndCheckDataType = TR5;
    var vy7 = new Set(["string", "number", "integer", "boolean", "null"]);

    function VR5(q, K) {
        return K ? q.filter((_) => vy7.has(_) || K === "array" && _ === "array") : []
    }

    function kR5(q, K, _) {
        let {
            gen: z,
            data: Y,
            opts: A
        } = q, O = z.let("dataType", W_._`typeof ${Y}`), w = z.let("coerced", W_._`undefined`);
        if (A.coerceTypes === "array") z.if(W_._`${O} == 'object' && Array.isArray(${Y}) && ${Y}.length == 1`, () => z.assign(Y, W_._`${Y}[0]`).assign(O, W_._`typeof ${Y}`).if(B91(K, Y, A.strictNumbers), () => z.assign(w, Y)));
        z.if(W_._`${w} !== undefined`);
        for (let j of _)
            if (vy7.has(j) || j === "array" && A.coerceTypes === "array") $(j);
        z.else(), p91(q), z.endIf(), z.if(W_._`${w} !== undefined`, () => {
            z.assign(Y, w), NR5(q, w)
        });

        function $(j) {
            switch (j) {
                case "string":
                    z.elseIf(W_._`${O} == "number" || ${O} == "boolean"`).assign(w, W_._`"" + ${Y}`).elseIf(W_._`${Y} === null`).assign(w, W_._`""`);
                    return;
                case "number":
                    z.elseIf(W_._`${O} == "boolean" || ${Y} === null
              || (${O} == "string" && ${Y} && ${Y} == +${Y})`).assign(w, W_._`+${Y}`);
                    return;
                case "integer":
                    z.elseIf(W_._`${O} === "boolean" || ${Y} === null
              || (${O} === "string" && ${Y} && ${Y} == +${Y} && !(${Y} % 1))`).assign(w, W_._`+${Y}`);
                    return;
                case "boolean":
                    z.elseIf(W_._`${Y} === "false" || ${Y} === 0 || ${Y} === null`).assign(w, !1).elseIf(W_._`${Y} === "true" || ${Y} === 1`).assign(w, !0);
                    return;
                case "null":
                    z.elseIf(W_._`${Y} === "" || ${Y} === 0 || ${Y} === false`), z.assign(w, null);
                    return;
                case "array":
                    z.elseIf(W_._`${O} === "string" || ${O} === "number"
              || ${O} === "boolean" || ${Y} === null`).assign(w, W_._`[${Y}]`)
            }
        }
    }

    function NR5({
        gen: q,
        parentData: K,
        parentDataProperty: _
    }, z) {
        q.if(W_._`${K} !== undefined`, () => q.assign(W_._`${K}[${_}]`, z))
    }

    function m91(q, K, _, z = QZ6.Correct) {
        let Y = z === QZ6.Correct ? W_.operators.EQ : W_.operators.NEQ,
            A;
        switch (q) {
            case "null":
                return W_._`${K} ${Y} null`;
            case "array":
                A = W_._`Array.isArray(${K})`;
                break;
            case "object":
                A = W_._`${K} && typeof ${K} == "object" && !Array.isArray(${K})`;
                break;
            case "integer":
                A = O(W_._`!(${K} % 1) && !isNaN(${K})`);
                break;
            case "number":
                A = O();
                break;
            default:
                return W_._`typeof ${K} ${Y} ${q}`
        }
        return z === QZ6.Correct ? A : (0, W_.not)(A);

        function O(w = W_.nil) {
            return (0, W_.and)(W_._`typeof ${K} == "number"`, w, _ ? W_._`isFinite(${K})` : W_.nil)
        }
    }
    Ty7.checkDataType = m91;

    function B91(q, K, _, z) {
        if (q.length === 1) return m91(q[0], K, _, z);
        let Y, A = (0, fy7.toHash)(q);
        if (A.array && A.object) {
            let O = W_._`typeof ${K} != "object"`;
            Y = A.null ? O : W_._`!${K} || ${O}`, delete A.null, delete A.array, delete A.object
        } else Y = W_.nil;
        if (A.number) delete A.integer;
        for (let O in A) Y = (0, W_.and)(Y, m91(O, K, _, z));
        return Y
    }
    Ty7.checkDataTypes = B91;
    var ER5 = {
        message: ({
            schema: q
        }) => `must be ${q}`,
        params: ({
            schema: q,
            schemaValue: K
        }) => typeof q == "string" ? W_._`{type: ${q}}` : W_._`{type: ${K}}`
    };

    function p91(q) {
        let K = yR5(q);
        (0, GR5.reportError)(K, ER5)
    }
    Ty7.reportTypeError = p91;

    function yR5(q) {
        let {
            gen: K,
            data: _,
            schema: z
        } = q, Y = (0, fy7.schemaRefOrVal)(q, z, "type");
        return {
            gen: K,
            keyword: "type",
            data: _,
            schema: z.type,
            schemaCode: Y,
            schemaValue: Y,
            parentSchema: z,
            params: {},
            it: q
        }
    }
})
// @from(Ln 29144, Col 4)
yy7 = p((Ny7) => {
    Object.defineProperty(Ny7, "__esModule", {
        value: !0
    });
    Ny7.assignDefaults = void 0;
    var dZ6 = B_(),
        IR5 = nY();

    function xR5(q, K) {
        let {
            properties: _,
            items: z
        } = q.schema;
        if (K === "object" && _)
            for (let Y in _) ky7(q, Y, _[Y].default);
        else if (K === "array" && Array.isArray(z)) z.forEach((Y, A) => ky7(q, A, Y.default))
    }
    Ny7.assignDefaults = xR5;

    function ky7(q, K, _) {
        let {
            gen: z,
            compositeRule: Y,
            data: A,
            opts: O
        } = q;
        if (_ === void 0) return;
        let w = dZ6._`${A}${(0,dZ6.getProperty)(K)}`;
        if (Y) {
            (0, IR5.checkStrictMode)(q, `default is ignored for: ${w}`);
            return
        }
        let $ = dZ6._`${w} === undefined`;
        if (O.useDefaults === "empty") $ = dZ6._`${$} || ${w} === null || ${w} === ""`;
        z.if($, dZ6._`${w} = ${(0,dZ6.stringify)(_)}`)
    }
})
// @from(Ln 29181, Col 4)
pC = p((Ry7) => {
    Object.defineProperty(Ry7, "__esModule", {
        value: !0
    });
    Ry7.validateUnion = Ry7.validateArray = Ry7.usePattern = Ry7.callValidateCode = Ry7.schemaProperties = Ry7.allSchemaProperties = Ry7.noPropertyInData = Ry7.propertyInData = Ry7.isOwnProperty = Ry7.hasPropFunc = Ry7.reportMissingProp = Ry7.checkMissingProp = Ry7.checkReportMissingProp = void 0;
    var _j = B_(),
        F91 = nY(),
        $16 = Jr(),
        uR5 = nY();

    function mR5(q, K) {
        let {
            gen: _,
            data: z,
            it: Y
        } = q;
        _.if(U91(_, z, K, Y.opts.ownProperties), () => {
            q.setParams({
                missingProperty: _j._`${K}`
            }, !0), q.error()
        })
    }
    Ry7.checkReportMissingProp = mR5;

    function BR5({
        gen: q,
        data: K,
        it: {
            opts: _
        }
    }, z, Y) {
        return (0, _j.or)(...z.map((A) => (0, _j.and)(U91(q, K, A, _.ownProperties), _j._`${Y} = ${A}`)))
    }
    Ry7.checkMissingProp = BR5;

    function pR5(q, K) {
        q.setParams({
            missingProperty: K
        }, !0), q.error()
    }
    Ry7.reportMissingProp = pR5;

    function Ly7(q) {
        return q.scopeValue("func", {
            ref: Object.prototype.hasOwnProperty,
            code: _j._`Object.prototype.hasOwnProperty`
        })
    }
    Ry7.hasPropFunc = Ly7;

    function g91(q, K, _) {
        return _j._`${Ly7(q)}.call(${K}, ${_})`
    }
    Ry7.isOwnProperty = g91;

    function FR5(q, K, _, z) {
        let Y = _j._`${K}${(0,_j.getProperty)(_)} !== undefined`;
        return z ? _j._`${Y} && ${g91(q,K,_)}` : Y
    }
    Ry7.propertyInData = FR5;

    function U91(q, K, _, z) {
        let Y = _j._`${K}${(0,_j.getProperty)(_)} === undefined`;
        return z ? (0, _j.or)(Y, (0, _j.not)(g91(q, K, _))) : Y
    }
    Ry7.noPropertyInData = U91;

    function hy7(q) {
        return q ? Object.keys(q).filter((K) => K !== "__proto__") : []
    }
    Ry7.allSchemaProperties = hy7;

    function gR5(q, K) {
        return hy7(K).filter((_) => !(0, F91.alwaysValidSchema)(q, K[_]))
    }
    Ry7.schemaProperties = gR5;

    function UR5({
        schemaCode: q,
        data: K,
        it: {
            gen: _,
            topSchemaRef: z,
            schemaPath: Y,
            errorPath: A
        },
        it: O
    }, w, $, j) {
        let H = j ? _j._`${q}, ${K}, ${z}${Y}` : K,
            J = [
                [$16.default.instancePath, (0, _j.strConcat)($16.default.instancePath, A)],
                [$16.default.parentData, O.parentData],
                [$16.default.parentDataProperty, O.parentDataProperty],
                [$16.default.rootData, $16.default.rootData]
            ];
        if (O.opts.dynamicRef) J.push([$16.default.dynamicAnchors, $16.default.dynamicAnchors]);
        let X = _j._`${H}, ${_.object(...J)}`;
        return $ !== _j.nil ? _j._`${w}.call(${$}, ${X})` : _j._`${w}(${X})`
    }
    Ry7.callValidateCode = UR5;
    var QR5 = _j._`new RegExp`;

    function dR5({
        gen: q,
        it: {
            opts: K
        }
    }, _) {
        let z = K.unicodeRegExp ? "u" : "",
            {
                regExp: Y
            } = K.code,
            A = Y(_, z);
        return q.scopeValue("pattern", {
            key: A.toString(),
            ref: A,
            code: _j._`${Y.code==="new RegExp"?QR5:(0,uR5.useFunc)(q,Y)}(${_}, ${z})`
        })
    }
    Ry7.usePattern = dR5;

    function cR5(q) {
        let {
            gen: K,
            data: _,
            keyword: z,
            it: Y
        } = q, A = K.name("valid");
        if (Y.allErrors) {
            let w = K.let("valid", !0);
            return O(() => K.assign(w, !1)), w
        }
        return K.var(A, !0), O(() => K.break()), A;

        function O(w) {
            let $ = K.const("len", _j._`${_}.length`);
            K.forRange("i", 0, $, (j) => {
                q.subschema({
                    keyword: z,
                    dataProp: j,
                    dataPropType: F91.Type.Num
                }, A), K.if((0, _j.not)(A), w)
            })
        }
    }
    Ry7.validateArray = cR5;

    function lR5(q) {
        let {
            gen: K,
            schema: _,
            keyword: z,
            it: Y
        } = q;
        if (!Array.isArray(_)) throw Error("ajv implementation error");
        if (_.some(($) => (0, F91.alwaysValidSchema)(Y, $)) && !Y.opts.unevaluated) return;
        let O = K.let("valid", !1),
            w = K.name("_valid");
        K.block(() => _.forEach(($, j) => {
            let H = q.subschema({
                keyword: z,
                schemaProp: j,
                compositeRule: !0
            }, w);
            if (K.assign(O, _j._`${O} || ${w}`), !q.mergeValidEvaluated(H, w)) K.if((0, _j.not)(O))
        })), q.result(O, () => q.reset(), () => q.error(!0))
    }
    Ry7.validateUnion = lR5
})
// @from(Ln 29350, Col 4)
uy7 = p((Iy7) => {
    Object.defineProperty(Iy7, "__esModule", {
        value: !0
    });
    Iy7.validateKeywordUsage = Iy7.validSchemaType = Iy7.funcKeywordCode = Iy7.macroKeywordCode = void 0;
    var GV = B_(),
        eY6 = Jr(),
        YS5 = pC(),
        AS5 = Qg6();

    function OS5(q, K) {
        let {
            gen: _,
            keyword: z,
            schema: Y,
            parentSchema: A,
            it: O
        } = q, w = K.macro.call(O.self, Y, A, O), $ = by7(_, z, w);
        if (O.opts.validateSchema !== !1) O.self.validateSchema(w, !0);
        let j = _.name("valid");
        q.subschema({
            schema: w,
            schemaPath: GV.nil,
            errSchemaPath: `${O.errSchemaPath}/${z}`,
            topSchemaRef: $,
            compositeRule: !0
        }, j), q.pass(j, () => q.error(!0))
    }
    Iy7.macroKeywordCode = OS5;

    function wS5(q, K) {
        var _;
        let {
            gen: z,
            keyword: Y,
            schema: A,
            parentSchema: O,
            $data: w,
            it: $
        } = q;
        jS5($, K);
        let j = !w && K.compile ? K.compile.call($.self, A, O, $) : K.validate,
            H = by7(z, Y, j),
            J = z.let("valid");
        q.block$data(J, X), q.ok((_ = K.valid) !== null && _ !== void 0 ? _ : J);

        function X() {
            if (K.errors === !1) {
                if (W(), K.modifying) Cy7(q);
                D(() => q.error())
            } else {
                let Z = K.async ? M() : P();
                if (K.modifying) Cy7(q);
                D(() => $S5(q, Z))
            }
        }

        function M() {
            let Z = z.let("ruleErrs", null);
            return z.try(() => W(GV._`await `), (G) => z.assign(J, !1).if(GV._`${G} instanceof ${$.ValidationError}`, () => z.assign(Z, GV._`${G}.errors`), () => z.throw(G))), Z
        }

        function P() {
            let Z = GV._`${H}.errors`;
            return z.assign(Z, null), W(GV.nil), Z
        }

        function W(Z = K.async ? GV._`await ` : GV.nil) {
            let G = $.opts.passContext ? eY6.default.this : eY6.default.self,
                f = !(("compile" in K) && !w || K.schema === !1);
            z.assign(J, GV._`${Z}${(0,YS5.callValidateCode)(q,H,G,f)}`, K.modifying)
        }

        function D(Z) {
            var G;
            z.if((0, GV.not)((G = K.valid) !== null && G !== void 0 ? G : J), Z)
        }
    }
    Iy7.funcKeywordCode = wS5;

    function Cy7(q) {
        let {
            gen: K,
            data: _,
            it: z
        } = q;
        K.if(z.parentData, () => K.assign(_, GV._`${z.parentData}[${z.parentDataProperty}]`))
    }

    function $S5(q, K) {
        let {
            gen: _
        } = q;
        _.if(GV._`Array.isArray(${K})`, () => {
            _.assign(eY6.default.vErrors, GV._`${eY6.default.vErrors} === null ? ${K} : ${eY6.default.vErrors}.concat(${K})`).assign(eY6.default.errors, GV._`${eY6.default.vErrors}.length`), (0, AS5.extendErrors)(q)
        }, () => q.error())
    }

    function jS5({
        schemaEnv: q
    }, K) {
        if (K.async && !q.$async) throw Error("async keyword in sync schema")
    }

    function by7(q, K, _) {
        if (_ === void 0) throw Error(`keyword "${K}" failed to compile`);
        return q.scopeValue("keyword", typeof _ == "function" ? {
            ref: _
        } : {
            ref: _,
            code: (0, GV.stringify)(_)
        })
    }

    function HS5(q, K, _ = !1) {
        return !K.length || K.some((z) => z === "array" ? Array.isArray(q) : z === "object" ? q && typeof q == "object" && !Array.isArray(q) : typeof q == z || _ && typeof q > "u")
    }
    Iy7.validSchemaType = HS5;

    function JS5({
        schema: q,
        opts: K,
        self: _,
        errSchemaPath: z
    }, Y, A) {
        if (Array.isArray(Y.keyword) ? !Y.keyword.includes(A) : Y.keyword !== A) throw Error("ajv implementation error");
        let O = Y.dependencies;
        if (O === null || O === void 0 ? void 0 : O.some((w) => !Object.prototype.hasOwnProperty.call(q, w))) throw Error(`parent schema must have dependencies of ${A}: ${O.join(",")}`);
        if (Y.validateSchema) {
            if (!Y.validateSchema(q[A])) {
                let $ = `keyword "${A}" value is invalid at path "${z}": ` + _.errorsText(Y.validateSchema.errors);
                if (K.validateSchema === "log") _.logger.error($);
                else throw Error($)
            }
        }
    }
    Iy7.validateKeywordUsage = JS5
})
// @from(Ln 29488, Col 4)
Fy7 = p((By7) => {
    Object.defineProperty(By7, "__esModule", {
        value: !0
    });
    By7.extendSubschemaMode = By7.extendSubschemaData = By7.getSubschema = void 0;
    var AU = B_(),
        my7 = nY();

    function WS5(q, {
        keyword: K,
        schemaProp: _,
        schema: z,
        schemaPath: Y,
        errSchemaPath: A,
        topSchemaRef: O
    }) {
        if (K !== void 0 && z !== void 0) throw Error('both "keyword" and "schema" passed, only one allowed');
        if (K !== void 0) {
            let w = q.schema[K];
            return _ === void 0 ? {
                schema: w,
                schemaPath: AU._`${q.schemaPath}${(0,AU.getProperty)(K)}`,
                errSchemaPath: `${q.errSchemaPath}/${K}`
            } : {
                schema: w[_],
                schemaPath: AU._`${q.schemaPath}${(0,AU.getProperty)(K)}${(0,AU.getProperty)(_)}`,
                errSchemaPath: `${q.errSchemaPath}/${K}/${(0,my7.escapeFragment)(_)}`
            }
        }
        if (z !== void 0) {
            if (Y === void 0 || A === void 0 || O === void 0) throw Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return {
                schema: z,
                schemaPath: Y,
                topSchemaRef: O,
                errSchemaPath: A
            }
        }
        throw Error('either "keyword" or "schema" must be passed')
    }
    By7.getSubschema = WS5;

    function DS5(q, K, {
        dataProp: _,
        dataPropType: z,
        data: Y,
        dataTypes: A,
        propertyName: O
    }) {
        if (Y !== void 0 && _ !== void 0) throw Error('both "data" and "dataProp" passed, only one allowed');
        let {
            gen: w
        } = K;
        if (_ !== void 0) {
            let {
                errorPath: j,
                dataPathArr: H,
                opts: J
            } = K, X = w.let("data", AU._`${K.data}${(0,AU.getProperty)(_)}`, !0);
            $(X), q.errorPath = AU.str`${j}${(0,my7.getErrorPath)(_,z,J.jsPropertySyntax)}`, q.parentDataProperty = AU._`${_}`, q.dataPathArr = [...H, q.parentDataProperty]
        }
        if (Y !== void 0) {
            let j = Y instanceof AU.Name ? Y : w.let("data", Y, !0);
            if ($(j), O !== void 0) q.propertyName = O
        }
        if (A) q.dataTypes = A;

        function $(j) {
            q.data = j, q.dataLevel = K.dataLevel + 1, q.dataTypes = [], K.definedProperties = new Set, q.parentData = K.data, q.dataNames = [...K.dataNames, j]
        }
    }
    By7.extendSubschemaData = DS5;

    function ZS5(q, {
        jtdDiscriminator: K,
        jtdMetadata: _,
        compositeRule: z,
        createErrors: Y,
        allErrors: A
    }) {
        if (z !== void 0) q.compositeRule = z;
        if (Y !== void 0) q.createErrors = Y;
        if (A !== void 0) q.allErrors = A;
        q.jtdDiscriminator = K, q.jtdMetadata = _
    }
    By7.extendSubschemaMode = ZS5
})
// @from(Ln 29575, Col 4)
Q91 = p((gIA, gy7) => {
    gy7.exports = function q(K, _) {
        if (K === _) return !0;
        if (K && _ && typeof K == "object" && typeof _ == "object") {
            if (K.constructor !== _.constructor) return !1;
            var z, Y, A;
            if (Array.isArray(K)) {
                if (z = K.length, z != _.length) return !1;
                for (Y = z; Y-- !== 0;)
                    if (!q(K[Y], _[Y])) return !1;
                return !0
            }
            if (K.constructor === RegExp) return K.source === _.source && K.flags === _.flags;
            if (K.valueOf !== Object.prototype.valueOf) return K.valueOf() === _.valueOf();
            if (K.toString !== Object.prototype.toString) return K.toString() === _.toString();
            if (A = Object.keys(K), z = A.length, z !== Object.keys(_).length) return !1;
            for (Y = z; Y-- !== 0;)
                if (!Object.prototype.hasOwnProperty.call(_, A[Y])) return !1;
            for (Y = z; Y-- !== 0;) {
                var O = A[Y];
                if (!q(K[O], _[O])) return !1
            }
            return !0
        }
        return K !== K && _ !== _
    }
})
// @from(Ln 29602, Col 4)
Qy7 = p((UIA, Uy7) => {
    var j16 = Uy7.exports = function(q, K, _) {
        if (typeof K == "function") _ = K, K = {};
        _ = K.cb || _;
        var z = typeof _ == "function" ? _ : _.pre || function() {},
            Y = _.post || function() {};
        jj8(K, z, Y, q, "", q)
    };
    j16.keywords = {
        additionalItems: !0,
        items: !0,
        contains: !0,
        additionalProperties: !0,
        propertyNames: !0,
        not: !0,
        if: !0,
        then: !0,
        else: !0
    };
    j16.arrayKeywords = {
        items: !0,
        allOf: !0,
        anyOf: !0,
        oneOf: !0
    };
    j16.propsKeywords = {
        $defs: !0,
        definitions: !0,
        properties: !0,
        patternProperties: !0,
        dependencies: !0
    };
    j16.skipKeywords = {
        default: !0,
        enum: !0,
        const: !0,
        required: !0,
        maximum: !0,
        minimum: !0,
        exclusiveMaximum: !0,
        exclusiveMinimum: !0,
        multipleOf: !0,
        maxLength: !0,
        minLength: !0,
        pattern: !0,
        format: !0,
        maxItems: !0,
        minItems: !0,
        uniqueItems: !0,
        maxProperties: !0,
        minProperties: !0
    };

    function jj8(q, K, _, z, Y, A, O, w, $, j) {
        if (z && typeof z == "object" && !Array.isArray(z)) {
            K(z, Y, A, O, w, $, j);
            for (var H in z) {
                var J = z[H];
                if (Array.isArray(J)) {
                    if (H in j16.arrayKeywords)
                        for (var X = 0; X < J.length; X++) jj8(q, K, _, J[X], Y + "/" + H + "/" + X, A, Y, H, z, X)
                } else if (H in j16.propsKeywords) {
                    if (J && typeof J == "object")
                        for (var M in J) jj8(q, K, _, J[M], Y + "/" + H + "/" + vS5(M), A, Y, H, z, M)
                } else if (H in j16.keywords || q.allKeys && !(H in j16.skipKeywords)) jj8(q, K, _, J, Y + "/" + H, A, Y, H, z)
            }
            _(z, Y, A, O, w, $, j)
        }
    }

    function vS5(q) {
        return q.replace(/~/g, "~0").replace(/\//g, "~1")
    }
})
// @from(Ln 29676, Col 4)
cg6 = p((ny7) => {
    Object.defineProperty(ny7, "__esModule", {
        value: !0
    });
    ny7.getSchemaRefs = ny7.resolveUrl = ny7.normalizeId = ny7._getFullPath = ny7.getFullPath = ny7.inlineRef = void 0;
    var TS5 = nY(),
        VS5 = Q91(),
        kS5 = Qy7(),
        NS5 = new Set(["type", "format", "pattern", "maxLength", "minLength", "maxProperties", "minProperties", "maxItems", "minItems", "maximum", "minimum", "uniqueItems", "multipleOf", "required", "enum", "const"]);

    function ES5(q, K = !0) {
        if (typeof q == "boolean") return !0;
        if (K === !0) return !d91(q);
        if (!K) return !1;
        return dy7(q) <= K
    }
    ny7.inlineRef = ES5;
    var yS5 = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);

    function d91(q) {
        for (let K in q) {
            if (yS5.has(K)) return !0;
            let _ = q[K];
            if (Array.isArray(_) && _.some(d91)) return !0;
            if (typeof _ == "object" && d91(_)) return !0
        }
        return !1
    }

    function dy7(q) {
        let K = 0;
        for (let _ in q) {
            if (_ === "$ref") return 1 / 0;
            if (K++, NS5.has(_)) continue;
            if (typeof q[_] == "object")(0, TS5.eachItem)(q[_], (z) => K += dy7(z));
            if (K === 1 / 0) return 1 / 0
        }
        return K
    }

    function cy7(q, K = "", _) {
        if (_ !== !1) K = cZ6(K);
        let z = q.parse(K);
        return ly7(q, z)
    }
    ny7.getFullPath = cy7;

    function ly7(q, K) {
        return q.serialize(K).split("#")[0] + "#"
    }
    ny7._getFullPath = ly7;
    var LS5 = /#\/?$/;

    function cZ6(q) {
        return q ? q.replace(LS5, "") : ""
    }
    ny7.normalizeId = cZ6;

    function hS5(q, K, _) {
        return _ = cZ6(_), q.resolve(K, _)
    }
    ny7.resolveUrl = hS5;
    var RS5 = /^[a-z_][-a-z0-9._]*$/i;

    function SS5(q, K) {
        if (typeof q == "boolean") return {};
        let {
            schemaId: _,
            uriResolver: z
        } = this.opts, Y = cZ6(q[_] || K), A = {
            "": Y
        }, O = cy7(z, Y, !1), w = {}, $ = new Set;
        return kS5(q, {
            allKeys: !0
        }, (J, X, M, P) => {
            if (P === void 0) return;
            let W = O + X,
                D = A[P];
            if (typeof J[_] == "string") D = Z.call(this, J[_]);
            G.call(this, J.$anchor), G.call(this, J.$dynamicAnchor), A[X] = D;

            function Z(f) {
                let v = this.opts.uriResolver.resolve;
                if (f = cZ6(D ? v(D, f) : f), $.has(f)) throw H(f);
                $.add(f);
                let V = this.refs[f];
                if (typeof V == "string") V = this.refs[V];
                if (typeof V == "object") j(J, V.schema, f);
                else if (f !== cZ6(W))
                    if (f[0] === "#") j(J, w[f], f), w[f] = J;
                    else this.refs[f] = W;
                return f
            }

            function G(f) {
                if (typeof f == "string") {
                    if (!RS5.test(f)) throw Error(`invalid anchor "${f}"`);
                    Z.call(this, `#${f}`)
                }
            }
        }), w;

        function j(J, X, M) {
            if (X !== void 0 && !VS5(J, X)) throw H(M)
        }

        function H(J) {
            return Error(`reference "${J}" resolves to more than one schema`)
        }
    }
    ny7.getSchemaRefs = SS5
})
// @from(Ln 29788, Col 4)
ig6 = p(($L7) => {
    Object.defineProperty($L7, "__esModule", {
        value: !0
    });
    $L7.getData = $L7.KeywordCxt = $L7.validateFunctionCode = void 0;
    var ty7 = Jy7(),
        ry7 = dg6(),
        l91 = u91(),
        Hj8 = dg6(),
        mS5 = yy7(),
        ng6 = uy7(),
        c91 = Fy7(),
        tK = B_(),
        w9 = Jr(),
        BS5 = cg6(),
        Xr = nY(),
        lg6 = Qg6();

    function pS5(q) {
        if (KL7(q)) {
            if (_L7(q), qL7(q)) {
                US5(q);
                return
            }
        }
        ey7(q, () => (0, ty7.topBoolOrEmptySchema)(q))
    }
    $L7.validateFunctionCode = pS5;

    function ey7({
        gen: q,
        validateName: K,
        schema: _,
        schemaEnv: z,
        opts: Y
    }, A) {
        if (Y.code.es5) q.func(K, tK._`${w9.default.data}, ${w9.default.valCxt}`, z.$async, () => {
            q.code(tK._`"use strict"; ${oy7(_,Y)}`), gS5(q, Y), q.code(A)
        });
        else q.func(K, tK._`${w9.default.data}, ${FS5(Y)}`, z.$async, () => q.code(oy7(_, Y)).code(A))
    }

    function FS5(q) {
        return tK._`{${w9.default.instancePath}="", ${w9.default.parentData}, ${w9.default.parentDataProperty}, ${w9.default.rootData}=${w9.default.data}${q.dynamicRef?tK._`, ${w9.default.dynamicAnchors}={}`:tK.nil}}={}`
    }

    function gS5(q, K) {
        q.if(w9.default.valCxt, () => {
            if (q.var(w9.default.instancePath, tK._`${w9.default.valCxt}.${w9.default.instancePath}`), q.var(w9.default.parentData, tK._`${w9.default.valCxt}.${w9.default.parentData}`), q.var(w9.default.parentDataProperty, tK._`${w9.default.valCxt}.${w9.default.parentDataProperty}`), q.var(w9.default.rootData, tK._`${w9.default.valCxt}.${w9.default.rootData}`), K.dynamicRef) q.var(w9.default.dynamicAnchors, tK._`${w9.default.valCxt}.${w9.default.dynamicAnchors}`)
        }, () => {
            if (q.var(w9.default.instancePath, tK._`""`), q.var(w9.default.parentData, tK._`undefined`), q.var(w9.default.parentDataProperty, tK._`undefined`), q.var(w9.default.rootData, w9.default.data), K.dynamicRef) q.var(w9.default.dynamicAnchors, tK._`{}`)
        })
    }

    function US5(q) {
        let {
            schema: K,
            opts: _,
            gen: z
        } = q;
        ey7(q, () => {
            if (_.$comment && K.$comment) YL7(q);
            if (nS5(q), z.let(w9.default.vErrors, null), z.let(w9.default.errors, 0), _.unevaluated) QS5(q);
            zL7(q), oS5(q)
        });
        return
    }

    function QS5(q) {
        let {
            gen: K,
            validateName: _
        } = q;
        q.evaluated = K.const("evaluated", tK._`${_}.evaluated`), K.if(tK._`${q.evaluated}.dynamicProps`, () => K.assign(tK._`${q.evaluated}.props`, tK._`undefined`)), K.if(tK._`${q.evaluated}.dynamicItems`, () => K.assign(tK._`${q.evaluated}.items`, tK._`undefined`))
    }

    function oy7(q, K) {
        let _ = typeof q == "object" && q[K.schemaId];
        return _ && (K.code.source || K.code.process) ? tK._`/*# sourceURL=${_} */` : tK.nil
    }

    function dS5(q, K) {
        if (KL7(q)) {
            if (_L7(q), qL7(q)) {
                cS5(q, K);
                return
            }
        }(0, ty7.boolOrEmptySchema)(q, K)
    }

    function qL7({
        schema: q,
        self: K
    }) {
        if (typeof q == "boolean") return !q;
        for (let _ in q)
            if (K.RULES.all[_]) return !0;
        return !1
    }

    function KL7(q) {
        return typeof q.schema != "boolean"
    }

    function cS5(q, K) {
        let {
            schema: _,
            gen: z,
            opts: Y
        } = q;
        if (Y.$comment && _.$comment) YL7(q);
        iS5(q), rS5(q);
        let A = z.const("_errs", w9.default.errors);
        zL7(q, A), z.var(K, tK._`${A} === ${w9.default.errors}`)
    }

    function _L7(q) {
        (0, Xr.checkUnknownRules)(q), lS5(q)
    }

    function zL7(q, K) {
        if (q.opts.jtd) return ay7(q, [], !1, K);
        let _ = (0, ry7.getSchemaTypes)(q.schema),
            z = (0, ry7.coerceAndCheckDataType)(q, _);
        ay7(q, _, !z, K)
    }

    function lS5(q) {
        let {
            schema: K,
            errSchemaPath: _,
            opts: z,
            self: Y
        } = q;
        if (K.$ref && z.ignoreKeywordsWithRef && (0, Xr.schemaHasRulesButRef)(K, Y.RULES)) Y.logger.warn(`$ref: keywords ignored in schema at path "${_}"`)
    }

    function nS5(q) {
        let {
            schema: K,
            opts: _
        } = q;
        if (K.default !== void 0 && _.useDefaults && _.strictSchema)(0, Xr.checkStrictMode)(q, "default is ignored in the schema root")
    }

    function iS5(q) {
        let K = q.schema[q.opts.schemaId];
        if (K) q.baseId = (0, BS5.resolveUrl)(q.opts.uriResolver, q.baseId, K)
    }

    function rS5(q) {
        if (q.schema.$async && !q.schemaEnv.$async) throw Error("async schema in sync schema")
    }

    function YL7({
        gen: q,
        schemaEnv: K,
        schema: _,
        errSchemaPath: z,
        opts: Y
    }) {
        let A = _.$comment;
        if (Y.$comment === !0) q.code(tK._`${w9.default.self}.logger.log(${A})`);
        else if (typeof Y.$comment == "function") {
            let O = tK.str`${z}/$comment`,
                w = q.scopeValue("root", {
                    ref: K.root
                });
            q.code(tK._`${w9.default.self}.opts.$comment(${A}, ${O}, ${w}.schema)`)
        }
    }

    function oS5(q) {
        let {
            gen: K,
            schemaEnv: _,
            validateName: z,
            ValidationError: Y,
            opts: A
        } = q;
        if (_.$async) K.if(tK._`${w9.default.errors} === 0`, () => K.return(w9.default.data), () => K.throw(tK._`new ${Y}(${w9.default.vErrors})`));
        else {
            if (K.assign(tK._`${z}.errors`, w9.default.vErrors), A.unevaluated) aS5(q);
            K.return(tK._`${w9.default.errors} === 0`)
        }
    }

    function aS5({
        gen: q,
        evaluated: K,
        props: _,
        items: z
    }) {
        if (_ instanceof tK.Name) q.assign(tK._`${K}.props`, _);
        if (z instanceof tK.Name) q.assign(tK._`${K}.items`, z)
    }

    function ay7(q, K, _, z) {
        let {
            gen: Y,
            schema: A,
            data: O,
            allErrors: w,
            opts: $,
            self: j
        } = q, {
            RULES: H
        } = j;
        if (A.$ref && ($.ignoreKeywordsWithRef || !(0, Xr.schemaHasRulesButRef)(A, H))) {
            Y.block(() => OL7(q, "$ref", H.all.$ref.definition));
            return
        }
        if (!$.jtd) sS5(q, K);
        Y.block(() => {
            for (let X of H.rules) J(X);
            J(H.post)
        });

        function J(X) {
            if (!(0, l91.shouldUseGroup)(A, X)) return;
            if (X.type) {
                if (Y.if((0, Hj8.checkDataType)(X.type, O, $.strictNumbers)), sy7(q, X), K.length === 1 && K[0] === X.type && _) Y.else(), (0, Hj8.reportTypeError)(q);
                Y.endIf()
            } else sy7(q, X);
            if (!w) Y.if(tK._`${w9.default.errors} === ${z||0}`)
        }
    }

    function sy7(q, K) {
        let {
            gen: _,
            schema: z,
            opts: {
                useDefaults: Y
            }
        } = q;
        if (Y)(0, mS5.assignDefaults)(q, K.type);
        _.block(() => {
            for (let A of K.rules)
                if ((0, l91.shouldUseRule)(z, A)) OL7(q, A.keyword, A.definition, K.type)
        })
    }

    function sS5(q, K) {
        if (q.schemaEnv.meta || !q.opts.strictTypes) return;
        if (tS5(q, K), !q.opts.allowUnionTypes) eS5(q, K);
        qC5(q, q.dataTypes)
    }

    function tS5(q, K) {
        if (!K.length) return;
        if (!q.dataTypes.length) {
            q.dataTypes = K;
            return
        }
        K.forEach((_) => {
            if (!AL7(q.dataTypes, _)) n91(q, `type "${_}" not allowed by context "${q.dataTypes.join(",")}"`)
        }), _C5(q, K)
    }

    function eS5(q, K) {
        if (K.length > 1 && !(K.length === 2 && K.includes("null"))) n91(q, "use allowUnionTypes to allow union type keyword")
    }

    function qC5(q, K) {
        let _ = q.self.RULES.all;
        for (let z in _) {
            let Y = _[z];
            if (typeof Y == "object" && (0, l91.shouldUseRule)(q.schema, Y)) {
                let {
                    type: A
                } = Y.definition;
                if (A.length && !A.some((O) => KC5(K, O))) n91(q, `missing type "${A.join(",")}" for keyword "${z}"`)
            }
        }
    }

    function KC5(q, K) {
        return q.includes(K) || K === "number" && q.includes("integer")
    }

    function AL7(q, K) {
        return q.includes(K) || K === "integer" && q.includes("number")
    }

    function _C5(q, K) {
        let _ = [];
        for (let z of q.dataTypes)
            if (AL7(K, z)) _.push(z);
            else if (K.includes("integer") && z === "number") _.push("integer");
        q.dataTypes = _
    }

    function n91(q, K) {
        let _ = q.schemaEnv.baseId + q.errSchemaPath;
        K += ` at "${_}" (strictTypes)`, (0, Xr.checkStrictMode)(q, K, q.opts.strictTypes)
    }
    class i91 {
        constructor(q, K, _) {
            if ((0, ng6.validateKeywordUsage)(q, K, _), this.gen = q.gen, this.allErrors = q.allErrors, this.keyword = _, this.data = q.data, this.schema = q.schema[_], this.$data = K.$data && q.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Xr.schemaRefOrVal)(q, this.schema, _, this.$data), this.schemaType = K.schemaType, this.parentSchema = q.schema, this.params = {}, this.it = q, this.def = K, this.$data) this.schemaCode = q.gen.const("vSchema", wL7(this.$data, q));
            else if (this.schemaCode = this.schemaValue, !(0, ng6.validSchemaType)(this.schema, K.schemaType, K.allowUndefined)) throw Error(`${_} value must be ${JSON.stringify(K.schemaType)}`);
            if ("code" in K ? K.trackErrors : K.errors !== !1) this.errsCount = q.gen.const("_errs", w9.default.errors)
        }
        result(q, K, _) {
            this.failResult((0, tK.not)(q), K, _)
        }
        failResult(q, K, _) {
            if (this.gen.if(q), _) _();
            else this.error();
            if (K) {
                if (this.gen.else(), K(), this.allErrors) this.gen.endIf()
            } else if (this.allErrors) this.gen.endIf();
            else this.gen.else()
        }
        pass(q, K) {
            this.failResult((0, tK.not)(q), void 0, K)
        }
        fail(q) {
            if (q === void 0) {
                if (this.error(), !this.allErrors) this.gen.if(!1);
                return
            }
            if (this.gen.if(q), this.error(), this.allErrors) this.gen.endIf();
            else this.gen.else()
        }
        fail$data(q) {
            if (!this.$data) return this.fail(q);
            let {
                schemaCode: K
            } = this;
            this.fail(tK._`${K} !== undefined && (${(0,tK.or)(this.invalid$data(),q)})`)
        }
        error(q, K, _) {
            if (K) {
                this.setParams(K), this._error(q, _), this.setParams({});
                return
            }
            this._error(q, _)
        }
        _error(q, K) {
            (q ? lg6.reportExtraError : lg6.reportError)(this, this.def.error, K)
        }
        $dataError() {
            (0, lg6.reportError)(this, this.def.$dataError || lg6.keyword$DataError)
        }
        reset() {
            if (this.errsCount === void 0) throw Error('add "trackErrors" to keyword definition');
            (0, lg6.resetErrorsCount)(this.gen, this.errsCount)
        }
        ok(q) {
            if (!this.allErrors) this.gen.if(q)
        }
        setParams(q, K) {
            if (K) Object.assign(this.params, q);
            else this.params = q
        }
        block$data(q, K, _ = tK.nil) {
            this.gen.block(() => {
                this.check$data(q, _), K()
            })
        }
        check$data(q = tK.nil, K = tK.nil) {
            if (!this.$data) return;
            let {
                gen: _,
                schemaCode: z,
                schemaType: Y,
                def: A
            } = this;
            if (_.if((0, tK.or)(tK._`${z} === undefined`, K)), q !== tK.nil) _.assign(q, !0);
            if (Y.length || A.validateSchema) {
                if (_.elseIf(this.invalid$data()), this.$dataError(), q !== tK.nil) _.assign(q, !1)
            }
            _.else()
        }
        invalid$data() {
            let {
                gen: q,
                schemaCode: K,
                schemaType: _,
                def: z,
                it: Y
            } = this;
            return (0, tK.or)(A(), O());

            function A() {
                if (_.length) {
                    if (!(K instanceof tK.Name)) throw Error("ajv implementation error");
                    let w = Array.isArray(_) ? _ : [_];
                    return tK._`${(0,Hj8.checkDataTypes)(w,K,Y.opts.strictNumbers,Hj8.DataType.Wrong)}`
                }
                return tK.nil
            }

            function O() {
                if (z.validateSchema) {
                    let w = q.scopeValue("validate$data", {
                        ref: z.validateSchema
                    });
                    return tK._`!${w}(${K})`
                }
                return tK.nil
            }
        }
        subschema(q, K) {
            let _ = (0, c91.getSubschema)(this.it, q);
            (0, c91.extendSubschemaData)(_, this.it, q), (0, c91.extendSubschemaMode)(_, q);
            let z = {
                ...this.it,
                ..._,
                items: void 0,
                props: void 0
            };
            return dS5(z, K), z
        }
        mergeEvaluated(q, K) {
            let {
                it: _,
                gen: z
            } = this;
            if (!_.opts.unevaluated) return;
            if (_.props !== !0 && q.props !== void 0) _.props = Xr.mergeEvaluated.props(z, q.props, _.props, K);
            if (_.items !== !0 && q.items !== void 0) _.items = Xr.mergeEvaluated.items(z, q.items, _.items, K)
        }
        mergeValidEvaluated(q, K) {
            let {
                it: _,
                gen: z
            } = this;
            if (_.opts.unevaluated && (_.props !== !0 || _.items !== !0)) return z.if(K, () => this.mergeEvaluated(q, tK.Name)), !0
        }
    }
    $L7.KeywordCxt = i91;

    function OL7(q, K, _, z) {
        let Y = new i91(q, _, K);
        if ("code" in _) _.code(Y, z);
        else if (Y.$data && _.validate)(0, ng6.funcKeywordCode)(Y, _);
        else if ("macro" in _)(0, ng6.macroKeywordCode)(Y, _);
        else if (_.compile || _.validate)(0, ng6.funcKeywordCode)(Y, _)
    }
    var zC5 = /^\/(?:[^~]|~0|~1)*$/,
        YC5 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;

    function wL7(q, {
        dataLevel: K,
        dataNames: _,
        dataPathArr: z
    }) {
        let Y, A;
        if (q === "") return w9.default.rootData;
        if (q[0] === "/") {
            if (!zC5.test(q)) throw Error(`Invalid JSON-pointer: ${q}`);
            Y = q, A = w9.default.rootData
        } else {
            let j = YC5.exec(q);
            if (!j) throw Error(`Invalid JSON-pointer: ${q}`);
            let H = +j[1];
            if (Y = j[2], Y === "#") {
                if (H >= K) throw Error($("property/index", H));
                return z[K - H]
            }
            if (H > K) throw Error($("data", H));
            if (A = _[K - H], !Y) return A
        }
        let O = A,
            w = Y.split("/");
        for (let j of w)
            if (j) A = tK._`${A}${(0,tK.getProperty)((0,Xr.unescapeJsonPointer)(j))}`, O = tK._`${O} && ${A}`;
        return O;

        function $(j, H) {
            return `Cannot access ${j} ${H} levels up, current level is ${K}`
        }
    }
    $L7.getData = wL7
})
// @from(Ln 30265, Col 4)
Jj8 = p((JL7) => {
    Object.defineProperty(JL7, "__esModule", {
        value: !0
    });
    class HL7 extends Error {
        constructor(q) {
            super("validation failed");
            this.errors = q, this.ajv = this.validation = !0
        }
    }
    JL7.default = HL7
})
// @from(Ln 30277, Col 4)
rg6 = p((ML7) => {
    Object.defineProperty(ML7, "__esModule", {
        value: !0
    });
    var r91 = cg6();
    class XL7 extends Error {
        constructor(q, K, _, z) {
            super(z || `can't resolve reference ${_} from id ${K}`);
            this.missingRef = (0, r91.resolveUrl)(q, K, _), this.missingSchema = (0, r91.normalizeId)((0, r91.getFullPath)(q, this.missingRef))
        }
    }
    ML7.default = XL7
})
// @from(Ln 30290, Col 4)
Mj8 = p((DL7) => {
    Object.defineProperty(DL7, "__esModule", {
        value: !0
    });
    DL7.resolveSchema = DL7.getCompilingSchema = DL7.resolveRef = DL7.compileSchema = DL7.SchemaEnv = void 0;
    var Zm = B_(),
        jC5 = Jj8(),
        qA6 = Jr(),
        fm = cg6(),
        PL7 = nY(),
        HC5 = ig6();
    class og6 {
        constructor(q) {
            var K;
            this.refs = {}, this.dynamicAnchors = {};
            let _;
            if (typeof q.schema == "object") _ = q.schema;
            this.schema = q.schema, this.schemaId = q.schemaId, this.root = q.root || this, this.baseId = (K = q.baseId) !== null && K !== void 0 ? K : (0, fm.normalizeId)(_ === null || _ === void 0 ? void 0 : _[q.schemaId || "$id"]), this.schemaPath = q.schemaPath, this.localRefs = q.localRefs, this.meta = q.meta, this.$async = _ === null || _ === void 0 ? void 0 : _.$async, this.refs = {}
        }
    }
    DL7.SchemaEnv = og6;

    function a91(q) {
        let K = WL7.call(this, q);
        if (K) return K;
        let _ = (0, fm.getFullPath)(this.opts.uriResolver, q.root.baseId),
            {
                es5: z,
                lines: Y
            } = this.opts.code,
            {
                ownProperties: A
            } = this.opts,
            O = new Zm.CodeGen(this.scope, {
                es5: z,
                lines: Y,
                ownProperties: A
            }),
            w;
        if (q.$async) w = O.scopeValue("Error", {
            ref: jC5.default,
            code: Zm._`require("ajv/dist/runtime/validation_error").default`
        });
        let $ = O.scopeName("validate");
        q.validateName = $;
        let j = {
                gen: O,
                allErrors: this.opts.allErrors,
                data: qA6.default.data,
                parentData: qA6.default.parentData,
                parentDataProperty: qA6.default.parentDataProperty,
                dataNames: [qA6.default.data],
                dataPathArr: [Zm.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set,
                topSchemaRef: O.scopeValue("schema", this.opts.code.source === !0 ? {
                    ref: q.schema,
                    code: (0, Zm.stringify)(q.schema)
                } : {
                    ref: q.schema
                }),
                validateName: $,
                ValidationError: w,
                schema: q.schema,
                schemaEnv: q,
                rootId: _,
                baseId: q.baseId || _,
                schemaPath: Zm.nil,
                errSchemaPath: q.schemaPath || (this.opts.jtd ? "" : "#"),
                errorPath: Zm._`""`,
                opts: this.opts,
                self: this
            },
            H;
        try {
            this._compilations.add(q), (0, HC5.validateFunctionCode)(j), O.optimize(this.opts.code.optimize);
            let J = O.toString();
            if (H = `${O.scopeRefs(qA6.default.scope)}return ${J}`, this.opts.code.process) H = this.opts.code.process(H, q);
            let M = Function(`${qA6.default.self}`, `${qA6.default.scope}`, H)(this, this.scope.get());
            if (this.scope.value($, {
                    ref: M
                }), M.errors = null, M.schema = q.schema, M.schemaEnv = q, q.$async) M.$async = !0;
            if (this.opts.code.source === !0) M.source = {
                validateName: $,
                validateCode: J,
                scopeValues: O._values
            };
            if (this.opts.unevaluated) {
                let {
                    props: P,
                    items: W
                } = j;
                if (M.evaluated = {
                        props: P instanceof Zm.Name ? void 0 : P,
                        items: W instanceof Zm.Name ? void 0 : W,
                        dynamicProps: P instanceof Zm.Name,
                        dynamicItems: W instanceof Zm.Name
                    }, M.source) M.source.evaluated = (0, Zm.stringify)(M.evaluated)
            }
            return q.validate = M, q
        } catch (J) {
            if (delete q.validate, delete q.validateName, H) this.logger.error("Error compiling schema, function code:", H);
            throw J
        } finally {
            this._compilations.delete(q)
        }
    }
    DL7.compileSchema = a91;

    function JC5(q, K, _) {
        var z;
        _ = (0, fm.resolveUrl)(this.opts.uriResolver, K, _);
        let Y = q.refs[_];
        if (Y) return Y;
        let A = PC5.call(this, q, _);
        if (A === void 0) {
            let O = (z = q.localRefs) === null || z === void 0 ? void 0 : z[_],
                {
                    schemaId: w
                } = this.opts;
            if (O) A = new og6({
                schema: O,
                schemaId: w,
                root: q,
                baseId: K
            })
        }
        if (A === void 0) return;
        return q.refs[_] = XC5.call(this, A)
    }
    DL7.resolveRef = JC5;

    function XC5(q) {
        if ((0, fm.inlineRef)(q.schema, this.opts.inlineRefs)) return q.schema;
        return q.validate ? q : a91.call(this, q)
    }

    function WL7(q) {
        for (let K of this._compilations)
            if (MC5(K, q)) return K
    }
    DL7.getCompilingSchema = WL7;

    function MC5(q, K) {
        return q.schema === K.schema && q.root === K.root && q.baseId === K.baseId
    }

    function PC5(q, K) {
        let _;
        while (typeof(_ = this.refs[K]) == "string") K = _;
        return _ || this.schemas[K] || Xj8.call(this, q, K)
    }

    function Xj8(q, K) {
        let _ = this.opts.uriResolver.parse(K),
            z = (0, fm._getFullPath)(this.opts.uriResolver, _),
            Y = (0, fm.getFullPath)(this.opts.uriResolver, q.baseId, void 0);
        if (Object.keys(q.schema).length > 0 && z === Y) return o91.call(this, _, q);
        let A = (0, fm.normalizeId)(z),
            O = this.refs[A] || this.schemas[A];
        if (typeof O == "string") {
            let w = Xj8.call(this, q, O);
            if (typeof(w === null || w === void 0 ? void 0 : w.schema) !== "object") return;
            return o91.call(this, _, w)
        }
        if (typeof(O === null || O === void 0 ? void 0 : O.schema) !== "object") return;
        if (!O.validate) a91.call(this, O);
        if (A === (0, fm.normalizeId)(K)) {
            let {
                schema: w
            } = O, {
                schemaId: $
            } = this.opts, j = w[$];
            if (j) Y = (0, fm.resolveUrl)(this.opts.uriResolver, Y, j);
            return new og6({
                schema: w,
                schemaId: $,
                root: q,
                baseId: Y
            })
        }
        return o91.call(this, _, O)
    }
    DL7.resolveSchema = Xj8;
    var WC5 = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);

    function o91(q, {
        baseId: K,
        schema: _,
        root: z
    }) {
        var Y;
        if (((Y = q.fragment) === null || Y === void 0 ? void 0 : Y[0]) !== "/") return;
        for (let w of q.fragment.slice(1).split("/")) {
            if (typeof _ === "boolean") return;
            let $ = _[(0, PL7.unescapeFragment)(w)];
            if ($ === void 0) return;
            _ = $;
            let j = typeof _ === "object" && _[this.opts.schemaId];
            if (!WC5.has(w) && j) K = (0, fm.resolveUrl)(this.opts.uriResolver, K, j)
        }
        let A;
        if (typeof _ != "boolean" && _.$ref && !(0, PL7.schemaHasRulesButRef)(_, this.RULES)) {
            let w = (0, fm.resolveUrl)(this.opts.uriResolver, K, _.$ref);
            A = Xj8.call(this, z, w)
        }
        let {
            schemaId: O
        } = this.opts;
        if (A = A || new og6({
                schema: _,
                schemaId: O,
                root: z,
                baseId: K
            }), A.schema !== A.root.schema) return A;
        return
    }
})
// @from(Ln 30509, Col 4)
fL7 = p((iIA, vC5) => {
    vC5.exports = {
        $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
        description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
        type: "object",
        required: ["$data"],
        properties: {
            $data: {
                type: "string",
                anyOf: [{
                    format: "relative-json-pointer"
                }, {
                    format: "json-pointer"
                }]
            }
        },
        additionalProperties: !1
    }
})
// @from(Ln 30528, Col 4)
vL7 = p((rIA, GL7) => {
    var TC5 = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        A: 10,
        b: 11,
        B: 11,
        c: 12,
        C: 12,
        d: 13,
        D: 13,
        e: 14,
        E: 14,
        f: 15,
        F: 15
    };
    GL7.exports = {
        HEX: TC5
    }
})
// @from(Ln 30557, Col 4)
hL7 = p((oIA, LL7) => {
    var {
        HEX: VC5
    } = vL7(), kC5 = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;

    function NL7(q) {
        if (yL7(q, ".") < 3) return {
            host: q,
            isIPV4: !1
        };
        let K = q.match(kC5) || [],
            [_] = K;
        if (_) return {
            host: EC5(_, "."),
            isIPV4: !0
        };
        else return {
            host: q,
            isIPV4: !1
        }
    }

    function s91(q, K = !1) {
        let _ = "",
            z = !0;
        for (let Y of q) {
            if (VC5[Y] === void 0) return;
            if (Y !== "0" && z === !0) z = !1;
            if (!z) _ += Y
        }
        if (K && _.length === 0) _ = "0";
        return _
    }

    function NC5(q) {
        let K = 0,
            _ = {
                error: !1,
                address: "",
                zone: ""
            },
            z = [],
            Y = [],
            A = !1,
            O = !1,
            w = !1;

        function $() {
            if (Y.length) {
                if (A === !1) {
                    let j = s91(Y);
                    if (j !== void 0) z.push(j);
                    else return _.error = !0, !1
                }
                Y.length = 0
            }
            return !0
        }
        for (let j = 0; j < q.length; j++) {
            let H = q[j];
            if (H === "[" || H === "]") continue;
            if (H === ":") {
                if (O === !0) w = !0;
                if (!$()) break;
                if (K++, z.push(":"), K > 7) {
                    _.error = !0;
                    break
                }
                if (j - 1 >= 0 && q[j - 1] === ":") O = !0;
                continue
            } else if (H === "%") {
                if (!$()) break;
                A = !0
            } else {
                Y.push(H);
                continue
            }
        }
        if (Y.length)
            if (A) _.zone = Y.join("");
            else if (w) z.push(Y.join(""));
        else z.push(s91(Y));
        return _.address = z.join(""), _
    }

    function EL7(q) {
        if (yL7(q, ":") < 2) return {
            host: q,
            isIPV6: !1
        };
        let K = NC5(q);
        if (!K.error) {
            let {
                address: _,
                address: z
            } = K;
            if (K.zone) _ += "%" + K.zone, z += "%25" + K.zone;
            return {
                host: _,
                escapedHost: z,
                isIPV6: !0
            }
        } else return {
            host: q,
            isIPV6: !1
        }
    }

    function EC5(q, K) {
        let _ = "",
            z = !0,
            Y = q.length;
        for (let A = 0; A < Y; A++) {
            let O = q[A];
            if (O === "0" && z) {
                if (A + 1 <= Y && q[A + 1] === K || A + 1 === Y) _ += O, z = !1
            } else {
                if (O === K) z = !0;
                else z = !1;
                _ += O
            }
        }
        return _
    }

    function yL7(q, K) {
        let _ = 0;
        for (let z = 0; z < q.length; z++)
            if (q[z] === K) _++;
        return _
    }
    var TL7 = /^\.\.?\//u,
        VL7 = /^\/\.(?:\/|$)/u,
        kL7 = /^\/\.\.(?:\/|$)/u,
        yC5 = /^\/?(?:.|\n)*?(?=\/|$)/u;

    function LC5(q) {
        let K = [];
        while (q.length)
            if (q.match(TL7)) q = q.replace(TL7, "");
            else if (q.match(VL7)) q = q.replace(VL7, "/");
        else if (q.match(kL7)) q = q.replace(kL7, "/"), K.pop();
        else if (q === "." || q === "..") q = "";
        else {
            let _ = q.match(yC5);
            if (_) {
                let z = _[0];
                q = q.slice(z.length), K.push(z)
            } else throw Error("Unexpected dot segment condition")
        }
        return K.join("")
    }

    function hC5(q, K) {
        let _ = K !== !0 ? escape : unescape;
        if (q.scheme !== void 0) q.scheme = _(q.scheme);
        if (q.userinfo !== void 0) q.userinfo = _(q.userinfo);
        if (q.host !== void 0) q.host = _(q.host);
        if (q.path !== void 0) q.path = _(q.path);
        if (q.query !== void 0) q.query = _(q.query);
        if (q.fragment !== void 0) q.fragment = _(q.fragment);
        return q
    }

    function RC5(q) {
        let K = [];
        if (q.userinfo !== void 0) K.push(q.userinfo), K.push("@");
        if (q.host !== void 0) {
            let _ = unescape(q.host),
                z = NL7(_);
            if (z.isIPV4) _ = z.host;
            else {
                let Y = EL7(z.host);
                if (Y.isIPV6 === !0) _ = `[${Y.escapedHost}]`;
                else _ = q.host
            }
            K.push(_)
        }
        if (typeof q.port === "number" || typeof q.port === "string") K.push(":"), K.push(String(q.port));
        return K.length ? K.join("") : void 0
    }
    LL7.exports = {
        recomposeAuthority: RC5,
        normalizeComponentEncoding: hC5,
        removeDotSegments: LC5,
        normalizeIPv4: NL7,
        normalizeIPv6: EL7,
        stringArrayToHexStripped: s91
    }
})
// @from(Ln 30747, Col 4)
xL7 = p((aIA, IL7) => {
    var SC5 = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu,
        CC5 = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;

    function RL7(q) {
        return typeof q.secure === "boolean" ? q.secure : String(q.scheme).toLowerCase() === "wss"
    }

    function SL7(q) {
        if (!q.host) q.error = q.error || "HTTP URIs must have a host.";
        return q
    }

    function CL7(q) {
        let K = String(q.scheme).toLowerCase() === "https";
        if (q.port === (K ? 443 : 80) || q.port === "") q.port = void 0;
        if (!q.path) q.path = "/";
        return q
    }

    function bC5(q) {
        return q.secure = RL7(q), q.resourceName = (q.path || "/") + (q.query ? "?" + q.query : ""), q.path = void 0, q.query = void 0, q
    }

    function IC5(q) {
        if (q.port === (RL7(q) ? 443 : 80) || q.port === "") q.port = void 0;
        if (typeof q.secure === "boolean") q.scheme = q.secure ? "wss" : "ws", q.secure = void 0;
        if (q.resourceName) {
            let [K, _] = q.resourceName.split("?");
            q.path = K && K !== "/" ? K : void 0, q.query = _, q.resourceName = void 0
        }
        return q.fragment = void 0, q
    }

    function xC5(q, K) {
        if (!q.path) return q.error = "URN can not be parsed", q;
        let _ = q.path.match(CC5);
        if (_) {
            let z = K.scheme || q.scheme || "urn";
            q.nid = _[1].toLowerCase(), q.nss = _[2];
            let Y = `${z}:${K.nid||q.nid}`,
                A = t91[Y];
            if (q.path = void 0, A) q = A.parse(q, K)
        } else q.error = q.error || "URN can not be parsed.";
        return q
    }

    function uC5(q, K) {
        let _ = K.scheme || q.scheme || "urn",
            z = q.nid.toLowerCase(),
            Y = `${_}:${K.nid||z}`,
            A = t91[Y];
        if (A) q = A.serialize(q, K);
        let O = q,
            w = q.nss;
        return O.path = `${z||K.nid}:${w}`, K.skipEscape = !0, O
    }

    function mC5(q, K) {
        let _ = q;
        if (_.uuid = _.nss, _.nss = void 0, !K.tolerant && (!_.uuid || !SC5.test(_.uuid))) _.error = _.error || "UUID is not valid.";
        return _
    }

    function BC5(q) {
        let K = q;
        return K.nss = (q.uuid || "").toLowerCase(), K
    }
    var bL7 = {
            scheme: "http",
            domainHost: !0,
            parse: SL7,
            serialize: CL7
        },
        pC5 = {
            scheme: "https",
            domainHost: bL7.domainHost,
            parse: SL7,
            serialize: CL7
        },
        Pj8 = {
            scheme: "ws",
            domainHost: !0,
            parse: bC5,
            serialize: IC5
        },
        FC5 = {
            scheme: "wss",
            domainHost: Pj8.domainHost,
            parse: Pj8.parse,
            serialize: Pj8.serialize
        },
        gC5 = {
            scheme: "urn",
            parse: xC5,
            serialize: uC5,
            skipNormalize: !0
        },
        UC5 = {
            scheme: "urn:uuid",
            parse: mC5,
            serialize: BC5,
            skipNormalize: !0
        },
        t91 = {
            http: bL7,
            https: pC5,
            ws: Pj8,
            wss: FC5,
            urn: gC5,
            "urn:uuid": UC5
        };
    IL7.exports = t91
})