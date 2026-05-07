
// @from(Ln 210947, Col 4)
PF1 = p((Je_) => {
    var MF1 = uP(),
        ze_ = Ky6();

    function Ye_(q, K, _) {
        let {
            offset: z,
            type: Y,
            source: A,
            end: O
        } = q, w, $, j = (X, M, P) => _(z + X, M, P);
        switch (Y) {
            case "scalar":
                w = MF1.Scalar.PLAIN, $ = Ae_(A, j);
                break;
            case "single-quoted-scalar":
                w = MF1.Scalar.QUOTE_SINGLE, $ = Oe_(A, j);
                break;
            case "double-quoted-scalar":
                w = MF1.Scalar.QUOTE_DOUBLE, $ = we_(A, j);
                break;
            default:
                return _(q, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${Y}`), {
                    value: "",
                    type: null,
                    comment: "",
                    range: [z, z + A.length, z + A.length]
                }
        }
        let H = z + A.length,
            J = ze_.resolveEnd(O, H, K, _);
        return {
            value: $,
            type: w,
            comment: J.comment,
            range: [z, H, J.offset]
        }
    }

    function Ae_(q, K) {
        let _ = "";
        switch (q[0]) {
            case "\t":
                _ = "a tab character";
                break;
            case ",":
                _ = "flow indicator character ,";
                break;
            case "%":
                _ = "directive indicator character %";
                break;
            case "|":
            case ">": {
                _ = `block scalar indicator ${q[0]}`;
                break
            }
            case "@":
            case "`": {
                _ = `reserved character ${q[0]}`;
                break
            }
        }
        if (_) K(0, "BAD_SCALAR_START", `Plain value cannot start with ${_}`);
        return BX4(q)
    }

    function Oe_(q, K) {
        if (q[q.length - 1] !== "'" || q.length === 1) K(q.length, "MISSING_CHAR", "Missing closing 'quote");
        return BX4(q.slice(1, -1)).replace(/''/g, "'")
    }

    function BX4(q) {
        let K, _;
        try {
            K = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), _ = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy")
        } catch {
            K = /(.*?)[ \t]*\r?\n/sy, _ = /[ \t]*(.*?)[ \t]*\r?\n/sy
        }
        let z = K.exec(q);
        if (!z) return q;
        let Y = z[1],
            A = " ",
            O = K.lastIndex;
        _.lastIndex = O;
        while (z = _.exec(q)) {
            if (z[1] === "")
                if (A === `
`) Y += A;
                else A = `
`;
            else Y += A + z[1], A = " ";
            O = _.lastIndex
        }
        let w = /[ \t]*(.*)/sy;
        return w.lastIndex = O, z = w.exec(q), Y + A + (z?.[1] ?? "")
    }

    function we_(q, K) {
        let _ = "";
        for (let z = 1; z < q.length - 1; ++z) {
            let Y = q[z];
            if (Y === "\r" && q[z + 1] === `
`) continue;
            if (Y === `
`) {
                let {
                    fold: A,
                    offset: O
                } = $e_(q, z);
                _ += A, z = O
            } else if (Y === "\\") {
                let A = q[++z],
                    O = je_[A];
                if (O) _ += O;
                else if (A === `
`) {
                    A = q[z + 1];
                    while (A === " " || A === "\t") A = q[++z + 1]
                } else if (A === "\r" && q[z + 1] === `
`) {
                    A = q[++z + 1];
                    while (A === " " || A === "\t") A = q[++z + 1]
                } else if (A === "x" || A === "u" || A === "U") {
                    let w = {
                        x: 2,
                        u: 4,
                        U: 8
                    } [A];
                    _ += He_(q, z + 1, w, K), z += w
                } else {
                    let w = q.substr(z - 1, 2);
                    K(z - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${w}`), _ += w
                }
            } else if (Y === " " || Y === "\t") {
                let A = z,
                    O = q[z + 1];
                while (O === " " || O === "\t") O = q[++z + 1];
                if (O !== `
` && !(O === "\r" && q[z + 2] === `
`)) _ += z > A ? q.slice(A, z + 1) : Y
            } else _ += Y
        }
        if (q[q.length - 1] !== '"' || q.length === 1) K(q.length, "MISSING_CHAR", 'Missing closing "quote');
        return _
    }

    function $e_(q, K) {
        let _ = "",
            z = q[K + 1];
        while (z === " " || z === "\t" || z === `
` || z === "\r") {
            if (z === "\r" && q[K + 2] !== `
`) break;
            if (z === `
`) _ += `
`;
            K += 1, z = q[K + 1]
        }
        if (!_) _ = " ";
        return {
            fold: _,
            offset: K
        }
    }
    var je_ = {
        "0": "\x00",
        a: "\x07",
        b: "\b",
        e: "\x1B",
        f: "\f",
        n: `
`,
        r: "\r",
        t: "\t",
        v: "\v",
        N: "",
        _: " ",
        L: "\u2028",
        P: "\u2029",
        " ": " ",
        '"': '"',
        "/": "/",
        "\\": "\\",
        "\t": "\t"
    };

    function He_(q, K, _, z) {
        let Y = q.substr(K, _),
            O = Y.length === _ && /^[0-9a-fA-F]+$/.test(Y) ? parseInt(Y, 16) : NaN;
        if (isNaN(O)) {
            let w = q.substr(K - 2, _ + 2);
            return z(K - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${w}`), w
        }
        return String.fromCodePoint(O)
    }
    Je_.resolveFlowScalar = Ye_
})
// @from(Ln 211146, Col 4)
FX4 = p((fe_) => {
    var Wj6 = YA(),
        pX4 = uP(),
        Me_ = XF1(),
        Pe_ = PF1();

    function We_(q, K, _, z) {
        let {
            value: Y,
            type: A,
            comment: O,
            range: w
        } = K.type === "block-scalar" ? Me_.resolveBlockScalar(q, K, z) : Pe_.resolveFlowScalar(K, q.options.strict, z), $ = _ ? q.directives.tagName(_.source, (J) => z(_, "TAG_RESOLVE_FAILED", J)) : null, j;
        if (q.options.stringKeys && q.atKey) j = q.schema[Wj6.SCALAR];
        else if ($) j = De_(q.schema, Y, $, _, z);
        else if (K.type === "scalar") j = Ze_(q, Y, K, z);
        else j = q.schema[Wj6.SCALAR];
        let H;
        try {
            let J = j.resolve(Y, (X) => z(_ ?? K, "TAG_RESOLVE_FAILED", X), q.options);
            H = Wj6.isScalar(J) ? J : new pX4.Scalar(J)
        } catch (J) {
            let X = J instanceof Error ? J.message : String(J);
            z(_ ?? K, "TAG_RESOLVE_FAILED", X), H = new pX4.Scalar(Y)
        }
        if (H.range = w, H.source = Y, A) H.type = A;
        if ($) H.tag = $;
        if (j.format) H.format = j.format;
        if (O) H.comment = O;
        return H
    }

    function De_(q, K, _, z, Y) {
        if (_ === "!") return q[Wj6.SCALAR];
        let A = [];
        for (let w of q.tags)
            if (!w.collection && w.tag === _)
                if (w.default && w.test) A.push(w);
                else return w;
        for (let w of A)
            if (w.test?.test(K)) return w;
        let O = q.knownTags[_];
        if (O && !O.collection) return q.tags.push(Object.assign({}, O, {
            default: !1,
            test: void 0
        })), O;
        return Y(z, "TAG_RESOLVE_FAILED", `Unresolved tag: ${_}`, _ !== "tag:yaml.org,2002:str"), q[Wj6.SCALAR]
    }

    function Ze_({
        atKey: q,
        directives: K,
        schema: _
    }, z, Y, A) {
        let O = _.tags.find((w) => (w.default === !0 || q && w.default === "key") && w.test?.test(z)) || _[Wj6.SCALAR];
        if (_.compat) {
            let w = _.compat.find(($) => $.default && $.test?.test(z)) ?? _[Wj6.SCALAR];
            if (O.tag !== w.tag) {
                let $ = K.tagString(O.tag),
                    j = K.tagString(w.tag),
                    H = `Value may be parsed as either ${$} or ${j}`;
                A(Y, "TAG_RESOLVE_FAILED", H, !0)
            }
        }
        return O
    }
    fe_.composeScalar = We_
})
// @from(Ln 211214, Col 4)
gX4 = p((Te_) => {
    function ve_(q, K, _) {
        if (K) {
            _ ?? (_ = K.length);
            for (let z = _ - 1; z >= 0; --z) {
                let Y = K[z];
                switch (Y.type) {
                    case "space":
                    case "comment":
                    case "newline":
                        q -= Y.source.length;
                        continue
                }
                Y = K[++z];
                while (Y?.type === "space") q += Y.source.length, Y = K[++z];
                break
            }
        }
        return q
    }
    Te_.emptyScalarPosition = ve_
})
// @from(Ln 211236, Col 4)
dX4 = p((Se_) => {
    var ke_ = Yt6(),
        Ne_ = YA(),
        Ee_ = mX4(),
        UX4 = FX4(),
        ye_ = Ky6(),
        Le_ = gX4(),
        he_ = {
            composeNode: QX4,
            composeEmptyNode: WF1
        };

    function QX4(q, K, _, z) {
        let Y = q.atKey,
            {
                spaceBefore: A,
                comment: O,
                anchor: w,
                tag: $
            } = _,
            j, H = !0;
        switch (K.type) {
            case "alias":
                if (j = Re_(q, K, z), w || $) z(K, "ALIAS_PROPS", "An alias node must not specify any properties");
                break;
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
            case "block-scalar":
                if (j = UX4.composeScalar(q, K, $, z), w) j.anchor = w.source.substring(1);
                break;
            case "block-map":
            case "block-seq":
            case "flow-collection":
                if (j = Ee_.composeCollection(he_, q, K, _, z), w) j.anchor = w.source.substring(1);
                break;
            default: {
                let J = K.type === "error" ? K.message : `Unsupported token (type: ${K.type})`;
                z(K, "UNEXPECTED_TOKEN", J), j = WF1(q, K.offset, void 0, null, _, z), H = !1
            }
        }
        if (w && j.anchor === "") z(w, "BAD_ALIAS", "Anchor cannot be an empty string");
        if (Y && q.options.stringKeys && (!Ne_.isScalar(j) || typeof j.value !== "string" || j.tag && j.tag !== "tag:yaml.org,2002:str")) z($ ?? K, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
        if (A) j.spaceBefore = !0;
        if (O)
            if (K.type === "scalar" && K.source === "") j.comment = O;
            else j.commentBefore = O;
        if (q.options.keepSourceTokens && H) j.srcToken = K;
        return j
    }

    function WF1(q, K, _, z, {
        spaceBefore: Y,
        comment: A,
        anchor: O,
        tag: w,
        end: $
    }, j) {
        let H = {
                type: "scalar",
                offset: Le_.emptyScalarPosition(K, _, z),
                indent: -1,
                source: ""
            },
            J = UX4.composeScalar(q, H, w, j);
        if (O) {
            if (J.anchor = O.source.substring(1), J.anchor === "") j(O, "BAD_ALIAS", "Anchor cannot be an empty string")
        }
        if (Y) J.spaceBefore = !0;
        if (A) J.comment = A, J.range[2] = $;
        return J
    }

    function Re_({
        options: q
    }, {
        offset: K,
        source: _,
        end: z
    }, Y) {
        let A = new ke_.Alias(_.substring(1));
        if (A.source === "") Y(K, "BAD_ALIAS", "Alias cannot be an empty string");
        if (A.source.endsWith(":")) Y(K + _.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
        let O = K + _.length,
            w = ye_.resolveEnd(z, O, q.strict, Y);
        if (A.range = [K, O, w.offset], w.comment) A.comment = w.comment;
        return A
    }
    Se_.composeEmptyNode = WF1;
    Se_.composeNode = QX4
})
// @from(Ln 211327, Col 4)
lX4 = p((Be_) => {
    var Ie_ = Gt6(),
        cX4 = dX4(),
        xe_ = Ky6(),
        ue_ = Tt6();

    function me_(q, K, {
        offset: _,
        start: z,
        value: Y,
        end: A
    }, O) {
        let w = Object.assign({
                _directives: K
            }, q),
            $ = new Ie_.Document(void 0, w),
            j = {
                atKey: !1,
                atRoot: !0,
                directives: $.directives,
                options: $.options,
                schema: $.schema
            },
            H = ue_.resolveProps(z, {
                indicator: "doc-start",
                next: Y ?? A?.[0],
                offset: _,
                onError: O,
                parentIndent: 0,
                startOnNewline: !0
            });
        if (H.found) {
            if ($.directives.docStart = !0, Y && (Y.type === "block-map" || Y.type === "block-seq") && !H.hasNewline) O(H.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")
        }
        $.contents = Y ? cX4.composeNode(j, Y, H, O) : cX4.composeEmptyNode(j, H.end, z, null, H, O);
        let J = $.contents.range[2],
            X = xe_.resolveEnd(A, J, !1, O);
        if (X.comment) $.comment = X.comment;
        return $.range = [_, J, X.offset], $
    }
    Be_.composeDoc = me_
})
// @from(Ln 211369, Col 4)
DF1 = p((ce_) => {
    var Fe_ = d6("process"),
        ge_ = vp1(),
        Ue_ = Gt6(),
        Vt6 = vt6(),
        nX4 = YA(),
        Qe_ = lX4(),
        de_ = Ky6();

    function kt6(q) {
        if (typeof q === "number") return [q, q + 1];
        if (Array.isArray(q)) return q.length === 2 ? q : [q[0], q[1]];
        let {
            offset: K,
            source: _
        } = q;
        return [K, K + (typeof _ === "string" ? _.length : 1)]
    }

    function iX4(q) {
        let K = "",
            _ = !1,
            z = !1;
        for (let Y = 0; Y < q.length; ++Y) {
            let A = q[Y];
            switch (A[0]) {
                case "#":
                    K += (K === "" ? "" : z ? `

` : `
`) + (A.substring(1) || " "), _ = !0, z = !1;
                    break;
                case "%":
                    if (q[Y + 1]?.[0] !== "#") Y += 1;
                    _ = !1;
                    break;
                default:
                    if (!_) z = !0;
                    _ = !1
            }
        }
        return {
            comment: K,
            afterEmptyLine: z
        }
    }
    class rX4 {
        constructor(q = {}) {
            this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (K, _, z, Y) => {
                let A = kt6(K);
                if (Y) this.warnings.push(new Vt6.YAMLWarning(A, _, z));
                else this.errors.push(new Vt6.YAMLParseError(A, _, z))
            }, this.directives = new ge_.Directives({
                version: q.version || "1.2"
            }), this.options = q
        }
        decorate(q, K) {
            let {
                comment: _,
                afterEmptyLine: z
            } = iX4(this.prelude);
            if (_) {
                let Y = q.contents;
                if (K) q.comment = q.comment ? `${q.comment}
${_}` : _;
                else if (z || q.directives.docStart || !Y) q.commentBefore = _;
                else if (nX4.isCollection(Y) && !Y.flow && Y.items.length > 0) {
                    let A = Y.items[0];
                    if (nX4.isPair(A)) A = A.key;
                    let O = A.commentBefore;
                    A.commentBefore = O ? `${_}
${O}` : _
                } else {
                    let A = Y.commentBefore;
                    Y.commentBefore = A ? `${_}
${A}` : _
                }
            }
            if (K) Array.prototype.push.apply(q.errors, this.errors), Array.prototype.push.apply(q.warnings, this.warnings);
            else q.errors = this.errors, q.warnings = this.warnings;
            this.prelude = [], this.errors = [], this.warnings = []
        }
        streamInfo() {
            return {
                comment: iX4(this.prelude).comment,
                directives: this.directives,
                errors: this.errors,
                warnings: this.warnings
            }
        }* compose(q, K = !1, _ = -1) {
            for (let z of q) yield* this.next(z);
            yield* this.end(K, _)
        }* next(q) {
            if (Fe_.env.LOG_STREAM) console.dir(q, {
                depth: null
            });
            switch (q.type) {
                case "directive":
                    this.directives.add(q.source, (K, _, z) => {
                        let Y = kt6(q);
                        Y[0] += K, this.onError(Y, "BAD_DIRECTIVE", _, z)
                    }), this.prelude.push(q.source), this.atDirectives = !0;
                    break;
                case "document": {
                    let K = Qe_.composeDoc(this.options, this.directives, q, this.onError);
                    if (this.atDirectives && !K.directives.docStart) this.onError(q, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
                    if (this.decorate(K, !1), this.doc) yield this.doc;
                    this.doc = K, this.atDirectives = !1;
                    break
                }
                case "byte-order-mark":
                case "space":
                    break;
                case "comment":
                case "newline":
                    this.prelude.push(q.source);
                    break;
                case "error": {
                    let K = q.source ? `${q.message}: ${JSON.stringify(q.source)}` : q.message,
                        _ = new Vt6.YAMLParseError(kt6(q), "UNEXPECTED_TOKEN", K);
                    if (this.atDirectives || !this.doc) this.errors.push(_);
                    else this.doc.errors.push(_);
                    break
                }
                case "doc-end": {
                    if (!this.doc) {
                        this.errors.push(new Vt6.YAMLParseError(kt6(q), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
                        break
                    }
                    this.doc.directives.docEnd = !0;
                    let K = de_.resolveEnd(q.end, q.offset + q.source.length, this.doc.options.strict, this.onError);
                    if (this.decorate(this.doc, !0), K.comment) {
                        let _ = this.doc.comment;
                        this.doc.comment = _ ? `${_}
${K.comment}` : K.comment
                    }
                    this.doc.range[2] = K.offset;
                    break
                }
                default:
                    this.errors.push(new Vt6.YAMLParseError(kt6(q), "UNEXPECTED_TOKEN", `Unsupported token ${q.type}`))
            }
        }* end(q = !1, K = -1) {
            if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
            else if (q) {
                let _ = Object.assign({
                        _directives: this.directives
                    }, this.options),
                    z = new Ue_.Document(void 0, _);
                if (this.atDirectives) this.onError(K, "MISSING_CHAR", "Missing directives-end indicator line");
                z.range = [0, K, K], this.decorate(z, !1), yield z
            }
        }
    }
    ce_.Composer = rX4
})
// @from(Ln 211525, Col 4)
sX4 = p((ee_) => {
    var ne_ = XF1(),
        ie_ = PF1(),
        re_ = vt6(),
        oX4 = $t6();

    function oe_(q, K = !0, _) {
        if (q) {
            let z = (Y, A, O) => {
                let w = typeof Y === "number" ? Y : Array.isArray(Y) ? Y[0] : Y.offset;
                if (_) _(w, A, O);
                else throw new re_.YAMLParseError([w, w + 1], A, O)
            };
            switch (q.type) {
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return ie_.resolveFlowScalar(q, K, z);
                case "block-scalar":
                    return ne_.resolveBlockScalar({
                        options: {
                            strict: K
                        }
                    }, q, z)
            }
        }
        return null
    }

    function ae_(q, K) {
        let {
            implicitKey: _ = !1,
            indent: z,
            inFlow: Y = !1,
            offset: A = -1,
            type: O = "PLAIN"
        } = K, w = oX4.stringifyString({
            type: O,
            value: q
        }, {
            implicitKey: _,
            indent: z > 0 ? " ".repeat(z) : "",
            inFlow: Y,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        }), $ = K.end ?? [{
            type: "newline",
            offset: -1,
            indent: z,
            source: `
`
        }];
        switch (w[0]) {
            case "|":
            case ">": {
                let j = w.indexOf(`
`),
                    H = w.substring(0, j),
                    J = w.substring(j + 1) + `
`,
                    X = [{
                        type: "block-scalar-header",
                        offset: A,
                        indent: z,
                        source: H
                    }];
                if (!aX4(X, $)) X.push({
                    type: "newline",
                    offset: -1,
                    indent: z,
                    source: `
`
                });
                return {
                    type: "block-scalar",
                    offset: A,
                    indent: z,
                    props: X,
                    source: J
                }
            }
            case '"':
                return {
                    type: "double-quoted-scalar", offset: A, indent: z, source: w, end: $
                };
            case "'":
                return {
                    type: "single-quoted-scalar", offset: A, indent: z, source: w, end: $
                };
            default:
                return {
                    type: "scalar", offset: A, indent: z, source: w, end: $
                }
        }
    }

    function se_(q, K, _ = {}) {
        let {
            afterKey: z = !1,
            implicitKey: Y = !1,
            inFlow: A = !1,
            type: O
        } = _, w = "indent" in q ? q.indent : null;
        if (z && typeof w === "number") w += 2;
        if (!O) switch (q.type) {
            case "single-quoted-scalar":
                O = "QUOTE_SINGLE";
                break;
            case "double-quoted-scalar":
                O = "QUOTE_DOUBLE";
                break;
            case "block-scalar": {
                let j = q.props[0];
                if (j.type !== "block-scalar-header") throw Error("Invalid block scalar header");
                O = j.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
                break
            }
            default:
                O = "PLAIN"
        }
        let $ = oX4.stringifyString({
            type: O,
            value: K
        }, {
            implicitKey: Y || w === null,
            indent: w !== null && w > 0 ? " ".repeat(w) : "",
            inFlow: A,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        });
        switch ($[0]) {
            case "|":
            case ">":
                te_(q, $);
                break;
            case '"':
                ZF1(q, $, "double-quoted-scalar");
                break;
            case "'":
                ZF1(q, $, "single-quoted-scalar");
                break;
            default:
                ZF1(q, $, "scalar")
        }
    }

    function te_(q, K) {
        let _ = K.indexOf(`
`),
            z = K.substring(0, _),
            Y = K.substring(_ + 1) + `
`;
        if (q.type === "block-scalar") {
            let A = q.props[0];
            if (A.type !== "block-scalar-header") throw Error("Invalid block scalar header");
            A.source = z, q.source = Y
        } else {
            let {
                offset: A
            } = q, O = "indent" in q ? q.indent : -1, w = [{
                type: "block-scalar-header",
                offset: A,
                indent: O,
                source: z
            }];
            if (!aX4(w, "end" in q ? q.end : void 0)) w.push({
                type: "newline",
                offset: -1,
                indent: O,
                source: `
`
            });
            for (let $ of Object.keys(q))
                if ($ !== "type" && $ !== "offset") delete q[$];
            Object.assign(q, {
                type: "block-scalar",
                indent: O,
                props: w,
                source: Y
            })
        }
    }

    function aX4(q, K) {
        if (K)
            for (let _ of K) switch (_.type) {
                case "space":
                case "comment":
                    q.push(_);
                    break;
                case "newline":
                    return q.push(_), !0
            }
        return !1
    }

    function ZF1(q, K, _) {
        switch (q.type) {
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                q.type = _, q.source = K;
                break;
            case "block-scalar": {
                let z = q.props.slice(1),
                    Y = K.length;
                if (q.props[0].type === "block-scalar-header") Y -= q.props[0].source.length;
                for (let A of z) A.offset += Y;
                delete q.props, Object.assign(q, {
                    type: _,
                    source: K,
                    end: z
                });
                break
            }
            case "block-map":
            case "block-seq": {
                let Y = {
                    type: "newline",
                    offset: q.offset + K.length,
                    indent: q.indent,
                    source: `
`
                };
                delete q.items, Object.assign(q, {
                    type: _,
                    source: K,
                    end: [Y]
                });
                break
            }
            default: {
                let z = "indent" in q ? q.indent : -1,
                    Y = "end" in q && Array.isArray(q.end) ? q.end.filter((A) => A.type === "space" || A.type === "comment" || A.type === "newline") : [];
                for (let A of Object.keys(q))
                    if (A !== "type" && A !== "offset") delete q[A];
                Object.assign(q, {
                    type: _,
                    indent: z,
                    source: K,
                    end: Y
                })
            }
        }
    }
    ee_.createScalarToken = ae_;
    ee_.resolveAsScalar = oe_;
    ee_.setScalarValue = se_
})
// @from(Ln 211778, Col 4)
tX4 = p((Y6z) => {
    var z6z = (q) => ("type" in q) ? Ph8(q) : Mh8(q);

    function Ph8(q) {
        switch (q.type) {
            case "block-scalar": {
                let K = "";
                for (let _ of q.props) K += Ph8(_);
                return K + q.source
            }
            case "block-map":
            case "block-seq": {
                let K = "";
                for (let _ of q.items) K += Mh8(_);
                return K
            }
            case "flow-collection": {
                let K = q.start.source;
                for (let _ of q.items) K += Mh8(_);
                for (let _ of q.end) K += _.source;
                return K
            }
            case "document": {
                let K = Mh8(q);
                if (q.end)
                    for (let _ of q.end) K += _.source;
                return K
            }
            default: {
                let K = q.source;
                if ("end" in q && q.end)
                    for (let _ of q.end) K += _.source;
                return K
            }
        }
    }

    function Mh8({
        start: q,
        key: K,
        sep: _,
        value: z
    }) {
        let Y = "";
        for (let A of q) Y += A.source;
        if (K) Y += Ph8(K);
        if (_)
            for (let A of _) Y += A.source;
        if (z) Y += Ph8(z);
        return Y
    }
    Y6z.stringify = z6z
})
// @from(Ln 211831, Col 4)
KM4 = p((w6z) => {
    var fF1 = Symbol("break visit"),
        O6z = Symbol("skip children"),
        eX4 = Symbol("remove item");

    function Dj6(q, K) {
        if ("type" in q && q.type === "document") q = {
            start: q.start,
            value: q.value
        };
        qM4(Object.freeze([]), q, K)
    }
    Dj6.BREAK = fF1;
    Dj6.SKIP = O6z;
    Dj6.REMOVE = eX4;
    Dj6.itemAtPath = (q, K) => {
        let _ = q;
        for (let [z, Y] of K) {
            let A = _?.[z];
            if (A && "items" in A) _ = A.items[Y];
            else return
        }
        return _
    };
    Dj6.parentCollection = (q, K) => {
        let _ = Dj6.itemAtPath(q, K.slice(0, -1)),
            z = K[K.length - 1][0],
            Y = _?.[z];
        if (Y && "items" in Y) return Y;
        throw Error("Parent collection not found")
    };

    function qM4(q, K, _) {
        let z = _(K, q);
        if (typeof z === "symbol") return z;
        for (let Y of ["key", "value"]) {
            let A = K[Y];
            if (A && "items" in A) {
                for (let O = 0; O < A.items.length; ++O) {
                    let w = qM4(Object.freeze(q.concat([
                        [Y, O]
                    ])), A.items[O], _);
                    if (typeof w === "number") O = w - 1;
                    else if (w === fF1) return fF1;
                    else if (w === eX4) A.items.splice(O, 1), O -= 1
                }
                if (typeof z === "function" && Y === "key") z = z(K, q)
            }
        }
        return typeof z === "function" ? z(K, q) : z
    }
    w6z.visit = Dj6
})
// @from(Ln 211884, Col 4)
Wh8 = p((W6z) => {
    var GF1 = sX4(),
        j6z = tX4(),
        H6z = KM4(),
        vF1 = "\uFEFF",
        TF1 = "\x02",
        VF1 = "\x18",
        kF1 = "\x1F",
        J6z = (q) => !!q && ("items" in q),
        X6z = (q) => !!q && (q.type === "scalar" || q.type === "single-quoted-scalar" || q.type === "double-quoted-scalar" || q.type === "block-scalar");

    function M6z(q) {
        switch (q) {
            case vF1:
                return "<BOM>";
            case TF1:
                return "<DOC>";
            case VF1:
                return "<FLOW_END>";
            case kF1:
                return "<SCALAR>";
            default:
                return JSON.stringify(q)
        }
    }

    function P6z(q) {
        switch (q) {
            case vF1:
                return "byte-order-mark";
            case TF1:
                return "doc-mode";
            case VF1:
                return "flow-error-end";
            case kF1:
                return "scalar";
            case "---":
                return "doc-start";
            case "...":
                return "doc-end";
            case "":
            case `
`:
            case `\r
`:
                return "newline";
            case "-":
                return "seq-item-ind";
            case "?":
                return "explicit-key-ind";
            case ":":
                return "map-value-ind";
            case "{":
                return "flow-map-start";
            case "}":
                return "flow-map-end";
            case "[":
                return "flow-seq-start";
            case "]":
                return "flow-seq-end";
            case ",":
                return "comma"
        }
        switch (q[0]) {
            case " ":
            case "\t":
                return "space";
            case "#":
                return "comment";
            case "%":
                return "directive-line";
            case "*":
                return "alias";
            case "&":
                return "anchor";
            case "!":
                return "tag";
            case "'":
                return "single-quoted-scalar";
            case '"':
                return "double-quoted-scalar";
            case "|":
            case ">":
                return "block-scalar-header"
        }
        return null
    }
    W6z.createScalarToken = GF1.createScalarToken;
    W6z.resolveAsScalar = GF1.resolveAsScalar;
    W6z.setScalarValue = GF1.setScalarValue;
    W6z.stringify = j6z.stringify;
    W6z.visit = H6z.visit;
    W6z.BOM = vF1;
    W6z.DOCUMENT = TF1;
    W6z.FLOW_END = VF1;
    W6z.SCALAR = kF1;
    W6z.isCollection = J6z;
    W6z.isScalar = X6z;
    W6z.prettyToken = M6z;
    W6z.tokenType = P6z
})
// @from(Ln 211985, Col 4)
EF1 = p((C6z) => {
    var Nt6 = Wh8();

    function Pp(q) {
        switch (q) {
            case void 0:
            case " ":
            case `
`:
            case "\r":
            case "\t":
                return !0;
            default:
                return !1
        }
    }
    var _M4 = new Set("0123456789ABCDEFabcdef"),
        R6z = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
        Dh8 = new Set(",[]{}"),
        S6z = new Set(` ,[]{}
\r	`),
        NF1 = (q) => !q || S6z.has(q);
    class zM4 {
        constructor() {
            this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0
        }* lex(q, K = !1) {
            if (q) {
                if (typeof q !== "string") throw TypeError("source is not a string");
                this.buffer = this.buffer ? this.buffer + q : q, this.lineEndPos = null
            }
            this.atEnd = !K;
            let _ = this.next ?? "stream";
            while (_ && (K || this.hasChars(1))) _ = yield* this.parseNext(_)
        }
        atLineEnd() {
            let q = this.pos,
                K = this.buffer[q];
            while (K === " " || K === "\t") K = this.buffer[++q];
            if (!K || K === "#" || K === `
`) return !0;
            if (K === "\r") return this.buffer[q + 1] === `
`;
            return !1
        }
        charAt(q) {
            return this.buffer[this.pos + q]
        }
        continueScalar(q) {
            let K = this.buffer[q];
            if (this.indentNext > 0) {
                let _ = 0;
                while (K === " ") K = this.buffer[++_ + q];
                if (K === "\r") {
                    let z = this.buffer[_ + q + 1];
                    if (z === `
` || !z && !this.atEnd) return q + _ + 1
                }
                return K === `
` || _ >= this.indentNext || !K && !this.atEnd ? q + _ : -1
            }
            if (K === "-" || K === ".") {
                let _ = this.buffer.substr(q, 3);
                if ((_ === "---" || _ === "...") && Pp(this.buffer[q + 3])) return -1
            }
            return q
        }
        getLine() {
            let q = this.lineEndPos;
            if (typeof q !== "number" || q !== -1 && q < this.pos) q = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = q;
            if (q === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
            if (this.buffer[q - 1] === "\r") q -= 1;
            return this.buffer.substring(this.pos, q)
        }
        hasChars(q) {
            return this.pos + q <= this.buffer.length
        }
        setNext(q) {
            return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = q, null
        }
        peek(q) {
            return this.buffer.substr(this.pos, q)
        }* parseNext(q) {
            switch (q) {
                case "stream":
                    return yield* this.parseStream();
                case "line-start":
                    return yield* this.parseLineStart();
                case "block-start":
                    return yield* this.parseBlockStart();
                case "doc":
                    return yield* this.parseDocument();
                case "flow":
                    return yield* this.parseFlowCollection();
                case "quoted-scalar":
                    return yield* this.parseQuotedScalar();
                case "block-scalar":
                    return yield* this.parseBlockScalar();
                case "plain-scalar":
                    return yield* this.parsePlainScalar()
            }
        }* parseStream() {
            let q = this.getLine();
            if (q === null) return this.setNext("stream");
            if (q[0] === Nt6.BOM) yield* this.pushCount(1), q = q.substring(1);
            if (q[0] === "%") {
                let K = q.length,
                    _ = q.indexOf("#");
                while (_ !== -1) {
                    let Y = q[_ - 1];
                    if (Y === " " || Y === "\t") {
                        K = _ - 1;
                        break
                    } else _ = q.indexOf("#", _ + 1)
                }
                while (!0) {
                    let Y = q[K - 1];
                    if (Y === " " || Y === "\t") K -= 1;
                    else break
                }
                let z = (yield* this.pushCount(K)) + (yield* this.pushSpaces(!0));
                return yield* this.pushCount(q.length - z), this.pushNewline(), "stream"
            }
            if (this.atLineEnd()) {
                let K = yield* this.pushSpaces(!0);
                return yield* this.pushCount(q.length - K), yield* this.pushNewline(), "stream"
            }
            return yield Nt6.DOCUMENT, yield* this.parseLineStart()
        }* parseLineStart() {
            let q = this.charAt(0);
            if (!q && !this.atEnd) return this.setNext("line-start");
            if (q === "-" || q === ".") {
                if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
                let K = this.peek(3);
                if ((K === "---" || K === "...") && Pp(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, K === "---" ? "doc" : "stream"
            }
            if (this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !Pp(this.charAt(1))) this.indentNext = this.indentValue;
            return yield* this.parseBlockStart()
        }* parseBlockStart() {
            let [q, K] = this.peek(2);
            if (!K && !this.atEnd) return this.setNext("block-start");
            if ((q === "-" || q === "?" || q === ":") && Pp(K)) {
                let _ = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
                return this.indentNext = this.indentValue + 1, this.indentValue += _, yield* this.parseBlockStart()
            }
            return "doc"
        }* parseDocument() {
            yield* this.pushSpaces(!0);
            let q = this.getLine();
            if (q === null) return this.setNext("doc");
            let K = yield* this.pushIndicators();
            switch (q[K]) {
                case "#":
                    yield* this.pushCount(q.length - K);
                case void 0:
                    return yield* this.pushNewline(), yield* this.parseLineStart();
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), "doc";
                case "*":
                    return yield* this.pushUntil(NF1), "doc";
                case '"':
                case "'":
                    return yield* this.parseQuotedScalar();
                case "|":
                case ">":
                    return K += yield* this.parseBlockScalarHeader(), K += yield* this.pushSpaces(!0), yield* this.pushCount(q.length - K), yield* this.pushNewline(), yield* this.parseBlockScalar();
                default:
                    return yield* this.parsePlainScalar()
            }
        }* parseFlowCollection() {
            let q, K, _ = -1;
            do {
                if (q = yield* this.pushNewline(), q > 0) K = yield* this.pushSpaces(!1), this.indentValue = _ = K;
                else K = 0;
                K += yield* this.pushSpaces(!0)
            } while (q + K > 0);
            let z = this.getLine();
            if (z === null) return this.setNext("flow");
            if (_ !== -1 && _ < this.indentNext && z[0] !== "#" || _ === 0 && (z.startsWith("---") || z.startsWith("...")) && Pp(z[3])) {
                if (!(_ === this.indentNext - 1 && this.flowLevel === 1 && (z[0] === "]" || z[0] === "}"))) return this.flowLevel = 0, yield Nt6.FLOW_END, yield* this.parseLineStart()
            }
            let Y = 0;
            while (z[Y] === ",") Y += yield* this.pushCount(1), Y += yield* this.pushSpaces(!0), this.flowKey = !1;
            switch (Y += yield* this.pushIndicators(), z[Y]) {
                case void 0:
                    return "flow";
                case "#":
                    return yield* this.pushCount(z.length - Y), "flow";
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
                case "*":
                    return yield* this.pushUntil(NF1), "flow";
                case '"':
                case "'":
                    return this.flowKey = !0, yield* this.parseQuotedScalar();
                case ":": {
                    let A = this.charAt(1);
                    if (this.flowKey || Pp(A) || A === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow"
                }
                default:
                    return this.flowKey = !1, yield* this.parsePlainScalar()
            }
        }* parseQuotedScalar() {
            let q = this.charAt(0),
                K = this.buffer.indexOf(q, this.pos + 1);
            if (q === "'")
                while (K !== -1 && this.buffer[K + 1] === "'") K = this.buffer.indexOf("'", K + 2);
            else
                while (K !== -1) {
                    let Y = 0;
                    while (this.buffer[K - 1 - Y] === "\\") Y += 1;
                    if (Y % 2 === 0) break;
                    K = this.buffer.indexOf('"', K + 1)
                }
            let _ = this.buffer.substring(0, K),
                z = _.indexOf(`
`, this.pos);
            if (z !== -1) {
                while (z !== -1) {
                    let Y = this.continueScalar(z + 1);
                    if (Y === -1) break;
                    z = _.indexOf(`
`, Y)
                }
                if (z !== -1) K = z - (_[z - 1] === "\r" ? 2 : 1)
            }
            if (K === -1) {
                if (!this.atEnd) return this.setNext("quoted-scalar");
                K = this.buffer.length
            }
            return yield* this.pushToIndex(K + 1, !1), this.flowLevel ? "flow" : "doc"
        }* parseBlockScalarHeader() {
            this.blockScalarIndent = -1, this.blockScalarKeep = !1;
            let q = this.pos;
            while (!0) {
                let K = this.buffer[++q];
                if (K === "+") this.blockScalarKeep = !0;
                else if (K > "0" && K <= "9") this.blockScalarIndent = Number(K) - 1;
                else if (K !== "-") break
            }
            return yield* this.pushUntil((K) => Pp(K) || K === "#")
        }* parseBlockScalar() {
            let q = this.pos - 1,
                K = 0,
                _;
            q: for (let Y = this.pos; _ = this.buffer[Y]; ++Y) switch (_) {
                case " ":
                    K += 1;
                    break;
                case `
`:
                    q = Y, K = 0;
                    break;
                case "\r": {
                    let A = this.buffer[Y + 1];
                    if (!A && !this.atEnd) return this.setNext("block-scalar");
                    if (A === `
`) break
                }
                default:
                    break q
            }
            if (!_ && !this.atEnd) return this.setNext("block-scalar");
            if (K >= this.indentNext) {
                if (this.blockScalarIndent === -1) this.indentNext = K;
                else this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
                do {
                    let Y = this.continueScalar(q + 1);
                    if (Y === -1) break;
                    q = this.buffer.indexOf(`
`, Y)
                } while (q !== -1);
                if (q === -1) {
                    if (!this.atEnd) return this.setNext("block-scalar");
                    q = this.buffer.length
                }
            }
            let z = q + 1;
            _ = this.buffer[z];
            while (_ === " ") _ = this.buffer[++z];
            if (_ === "\t") {
                while (_ === "\t" || _ === " " || _ === "\r" || _ === `
`) _ = this.buffer[++z];
                q = z - 1
            } else if (!this.blockScalarKeep)
                do {
                    let Y = q - 1,
                        A = this.buffer[Y];
                    if (A === "\r") A = this.buffer[--Y];
                    let O = Y;
                    while (A === " ") A = this.buffer[--Y];
                    if (A === `
` && Y >= this.pos && Y + 1 + K > O) q = Y;
                    else break
                } while (!0);
            return yield Nt6.SCALAR, yield* this.pushToIndex(q + 1, !0), yield* this.parseLineStart()
        }* parsePlainScalar() {
            let q = this.flowLevel > 0,
                K = this.pos - 1,
                _ = this.pos - 1,
                z;
            while (z = this.buffer[++_])
                if (z === ":") {
                    let Y = this.buffer[_ + 1];
                    if (Pp(Y) || q && Dh8.has(Y)) break;
                    K = _
                } else if (Pp(z)) {
                let Y = this.buffer[_ + 1];
                if (z === "\r")
                    if (Y === `
`) _ += 1, z = `
`, Y = this.buffer[_ + 1];
                    else K = _;
                if (Y === "#" || q && Dh8.has(Y)) break;
                if (z === `
`) {
                    let A = this.continueScalar(_ + 1);
                    if (A === -1) break;
                    _ = Math.max(_, A - 2)
                }
            } else {
                if (q && Dh8.has(z)) break;
                K = _
            }
            if (!z && !this.atEnd) return this.setNext("plain-scalar");
            return yield Nt6.SCALAR, yield* this.pushToIndex(K + 1, !0), q ? "flow" : "doc"
        }* pushCount(q) {
            if (q > 0) return yield this.buffer.substr(this.pos, q), this.pos += q, q;
            return 0
        }* pushToIndex(q, K) {
            let _ = this.buffer.slice(this.pos, q);
            if (_) return yield _, this.pos += _.length, _.length;
            else if (K) yield "";
            return 0
        }* pushIndicators() {
            switch (this.charAt(0)) {
                case "!":
                    return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "&":
                    return (yield* this.pushUntil(NF1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "-":
                case "?":
                case ":": {
                    let q = this.flowLevel > 0,
                        K = this.charAt(1);
                    if (Pp(K) || q && Dh8.has(K)) {
                        if (!q) this.indentNext = this.indentValue + 1;
                        else if (this.flowKey) this.flowKey = !1;
                        return (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators())
                    }
                }
            }
            return 0
        }* pushTag() {
            if (this.charAt(1) === "<") {
                let q = this.pos + 2,
                    K = this.buffer[q];
                while (!Pp(K) && K !== ">") K = this.buffer[++q];
                return yield* this.pushToIndex(K === ">" ? q + 1 : q, !1)
            } else {
                let q = this.pos + 1,
                    K = this.buffer[q];
                while (K)
                    if (R6z.has(K)) K = this.buffer[++q];
                    else if (K === "%" && _M4.has(this.buffer[q + 1]) && _M4.has(this.buffer[q + 2])) K = this.buffer[q += 3];
                else break;
                return yield* this.pushToIndex(q, !1)
            }
        }* pushNewline() {
            let q = this.buffer[this.pos];
            if (q === `
`) return yield* this.pushCount(1);
            else if (q === "\r" && this.charAt(1) === `
`) return yield* this.pushCount(2);
            else return 0
        }* pushSpaces(q) {
            let K = this.pos - 1,
                _;
            do _ = this.buffer[++K]; while (_ === " " || q && _ === "\t");
            let z = K - this.pos;
            if (z > 0) yield this.buffer.substr(this.pos, z), this.pos = K;
            return z
        }* pushUntil(q) {
            let K = this.pos,
                _ = this.buffer[K];
            while (!q(_)) _ = this.buffer[++K];
            return yield* this.pushToIndex(K, !1)
        }
    }
    C6z.Lexer = zM4
})
// @from(Ln 212384, Col 4)
yF1 = p((I6z) => {
    class YM4 {
        constructor() {
            this.lineStarts = [], this.addNewLine = (q) => this.lineStarts.push(q), this.linePos = (q) => {
                let K = 0,
                    _ = this.lineStarts.length;
                while (K < _) {
                    let Y = K + _ >> 1;
                    if (this.lineStarts[Y] < q) K = Y + 1;
                    else _ = Y
                }
                if (this.lineStarts[K] === q) return {
                    line: K + 1,
                    col: 1
                };
                if (K === 0) return {
                    line: 0,
                    col: q
                };
                let z = this.lineStarts[K - 1];
                return {
                    line: K,
                    col: q - z + 1
                }
            }
        }
    }
    I6z.LineCounter = YM4
})
// @from(Ln 212413, Col 4)
LF1 = p((B6z) => {
    var u6z = d6("process"),
        AM4 = Wh8(),
        m6z = EF1();

    function PK6(q, K) {
        for (let _ = 0; _ < q.length; ++_)
            if (q[_].type === K) return !0;
        return !1
    }

    function OM4(q) {
        for (let K = 0; K < q.length; ++K) switch (q[K].type) {
            case "space":
            case "comment":
            case "newline":
                break;
            default:
                return K
        }
        return -1
    }

    function $M4(q) {
        switch (q?.type) {
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
            case "flow-collection":
                return !0;
            default:
                return !1
        }
    }

    function Zh8(q) {
        switch (q.type) {
            case "document":
                return q.start;
            case "block-map": {
                let K = q.items[q.items.length - 1];
                return K.sep ?? K.start
            }
            case "block-seq":
                return q.items[q.items.length - 1].start;
            default:
                return []
        }
    }

    function _y6(q) {
        if (q.length === 0) return [];
        let K = q.length;
        q: while (--K >= 0) switch (q[K].type) {
            case "doc-start":
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
            case "newline":
                break q
        }
        while (q[++K]?.type === "space");
        return q.splice(K, q.length)
    }

    function wM4(q) {
        if (q.start.type === "flow-seq-start") {
            for (let K of q.items)
                if (K.sep && !K.value && !PK6(K.start, "explicit-key-ind") && !PK6(K.sep, "map-value-ind")) {
                    if (K.key) K.value = K.key;
                    if (delete K.key, $M4(K.value))
                        if (K.value.end) Array.prototype.push.apply(K.value.end, K.sep);
                        else K.value.end = K.sep;
                    else Array.prototype.push.apply(K.start, K.sep);
                    delete K.sep
                }
        }
    }
    class jM4 {
        constructor(q) {
            this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new m6z.Lexer, this.onNewLine = q
        }* parse(q, K = !1) {
            if (this.onNewLine && this.offset === 0) this.onNewLine(0);
            for (let _ of this.lexer.lex(q, K)) yield* this.next(_);
            if (!K) yield* this.end()
        }* next(q) {
            if (this.source = q, u6z.env.LOG_TOKENS) console.log("|", AM4.prettyToken(q));
            if (this.atScalar) {
                this.atScalar = !1, yield* this.step(), this.offset += q.length;
                return
            }
            let K = AM4.tokenType(q);
            if (!K) {
                let _ = `Not a YAML token: ${q}`;
                yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: _,
                    source: q
                }), this.offset += q.length
            } else if (K === "scalar") this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
            else {
                switch (this.type = K, yield* this.step(), K) {
                    case "newline":
                        if (this.atNewLine = !0, this.indent = 0, this.onNewLine) this.onNewLine(this.offset + q.length);
                        break;
                    case "space":
                        if (this.atNewLine && q[0] === " ") this.indent += q.length;
                        break;
                    case "explicit-key-ind":
                    case "map-value-ind":
                    case "seq-item-ind":
                        if (this.atNewLine) this.indent += q.length;
                        break;
                    case "doc-mode":
                    case "flow-error-end":
                        return;
                    default:
                        this.atNewLine = !1
                }
                this.offset += q.length
            }
        }* end() {
            while (this.stack.length > 0) yield* this.pop()
        }
        get sourceToken() {
            return {
                type: this.type,
                offset: this.offset,
                indent: this.indent,
                source: this.source
            }
        }* step() {
            let q = this.peek(1);
            if (this.type === "doc-end" && (!q || q.type !== "doc-end")) {
                while (this.stack.length > 0) yield* this.pop();
                this.stack.push({
                    type: "doc-end",
                    offset: this.offset,
                    source: this.source
                });
                return
            }
            if (!q) return yield* this.stream();
            switch (q.type) {
                case "document":
                    return yield* this.document(q);
                case "alias":
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return yield* this.scalar(q);
                case "block-scalar":
                    return yield* this.blockScalar(q);
                case "block-map":
                    return yield* this.blockMap(q);
                case "block-seq":
                    return yield* this.blockSequence(q);
                case "flow-collection":
                    return yield* this.flowCollection(q);
                case "doc-end":
                    return yield* this.documentEnd(q)
            }
            yield* this.pop()
        }
        peek(q) {
            return this.stack[this.stack.length - q]
        }* pop(q) {
            let K = q ?? this.stack.pop();
            if (!K) yield {
                type: "error",
                offset: this.offset,
                source: "",
                message: "Tried to pop an empty stack"
            };
            else if (this.stack.length === 0) yield K;
            else {
                let _ = this.peek(1);
                if (K.type === "block-scalar") K.indent = "indent" in _ ? _.indent : 0;
                else if (K.type === "flow-collection" && _.type === "document") K.indent = 0;
                if (K.type === "flow-collection") wM4(K);
                switch (_.type) {
                    case "document":
                        _.value = K;
                        break;
                    case "block-scalar":
                        _.props.push(K);
                        break;
                    case "block-map": {
                        let z = _.items[_.items.length - 1];
                        if (z.value) {
                            _.items.push({
                                start: [],
                                key: K,
                                sep: []
                            }), this.onKeyLine = !0;
                            return
                        } else if (z.sep) z.value = K;
                        else {
                            Object.assign(z, {
                                key: K,
                                sep: []
                            }), this.onKeyLine = !z.explicitKey;
                            return
                        }
                        break
                    }
                    case "block-seq": {
                        let z = _.items[_.items.length - 1];
                        if (z.value) _.items.push({
                            start: [],
                            value: K
                        });
                        else z.value = K;
                        break
                    }
                    case "flow-collection": {
                        let z = _.items[_.items.length - 1];
                        if (!z || z.value) _.items.push({
                            start: [],
                            key: K,
                            sep: []
                        });
                        else if (z.sep) z.value = K;
                        else Object.assign(z, {
                            key: K,
                            sep: []
                        });
                        return
                    }
                    default:
                        yield* this.pop(), yield* this.pop(K)
                }
                if ((_.type === "document" || _.type === "block-map" || _.type === "block-seq") && (K.type === "block-map" || K.type === "block-seq")) {
                    let z = K.items[K.items.length - 1];
                    if (z && !z.sep && !z.value && z.start.length > 0 && OM4(z.start) === -1 && (K.indent === 0 || z.start.every((Y) => Y.type !== "comment" || Y.indent < K.indent))) {
                        if (_.type === "document") _.end = z.start;
                        else _.items.push({
                            start: z.start
                        });
                        K.items.splice(-1, 1)
                    }
                }
            }
        }* stream() {
            switch (this.type) {
                case "directive-line":
                    yield {
                        type: "directive", offset: this.offset, source: this.source
                    };
                    return;
                case "byte-order-mark":
                case "space":
                case "comment":
                case "newline":
                    yield this.sourceToken;
                    return;
                case "doc-mode":
                case "doc-start": {
                    let q = {
                        type: "document",
                        offset: this.offset,
                        start: []
                    };
                    if (this.type === "doc-start") q.start.push(this.sourceToken);
                    this.stack.push(q);
                    return
                }
            }
            yield {
                type: "error",
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML stream`,
                source: this.source
            }
        }* document(q) {
            if (q.value) return yield* this.lineEnd(q);
            switch (this.type) {
                case "doc-start": {
                    if (OM4(q.start) !== -1) yield* this.pop(), yield* this.step();
                    else q.start.push(this.sourceToken);
                    return
                }
                case "anchor":
                case "tag":
                case "space":
                case "comment":
                case "newline":
                    q.start.push(this.sourceToken);
                    return
            }
            let K = this.startBlockValue(q);
            if (K) this.stack.push(K);
            else yield {
                type: "error",
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML document`,
                source: this.source
            }
        }* scalar(q) {
            if (this.type === "map-value-ind") {
                let K = Zh8(this.peek(2)),
                    _ = _y6(K),
                    z;
                if (q.end) z = q.end, z.push(this.sourceToken), delete q.end;
                else z = [this.sourceToken];
                let Y = {
                    type: "block-map",
                    offset: q.offset,
                    indent: q.indent,
                    items: [{
                        start: _,
                        key: q,
                        sep: z
                    }]
                };
                this.onKeyLine = !0, this.stack[this.stack.length - 1] = Y
            } else yield* this.lineEnd(q)
        }* blockScalar(q) {
            switch (this.type) {
                case "space":
                case "comment":
                case "newline":
                    q.props.push(this.sourceToken);
                    return;
                case "scalar":
                    if (q.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
                        let K = this.source.indexOf(`
`) + 1;
                        while (K !== 0) this.onNewLine(this.offset + K), K = this.source.indexOf(`
`, K) + 1
                    }
                    yield* this.pop();
                    break;
                default:
                    yield* this.pop(), yield* this.step()
            }
        }* blockMap(q) {
            let K = q.items[q.items.length - 1];
            switch (this.type) {
                case "newline":
                    if (this.onKeyLine = !1, K.value) {
                        let _ = "end" in K.value ? K.value.end : void 0;
                        if ((Array.isArray(_) ? _[_.length - 1] : void 0)?.type === "comment") _?.push(this.sourceToken);
                        else q.items.push({
                            start: [this.sourceToken]
                        })
                    } else if (K.sep) K.sep.push(this.sourceToken);
                    else K.start.push(this.sourceToken);
                    return;
                case "space":
                case "comment":
                    if (K.value) q.items.push({
                        start: [this.sourceToken]
                    });
                    else if (K.sep) K.sep.push(this.sourceToken);
                    else {
                        if (this.atIndentedComment(K.start, q.indent)) {
                            let z = q.items[q.items.length - 2]?.value?.end;
                            if (Array.isArray(z)) {
                                Array.prototype.push.apply(z, K.start), z.push(this.sourceToken), q.items.pop();
                                return
                            }
                        }
                        K.start.push(this.sourceToken)
                    }
                    return
            }
            if (this.indent >= q.indent) {
                let _ = !this.onKeyLine && this.indent === q.indent,
                    z = _ && (K.sep || K.explicitKey) && this.type !== "seq-item-ind",
                    Y = [];
                if (z && K.sep && !K.value) {
                    let A = [];
                    for (let O = 0; O < K.sep.length; ++O) {
                        let w = K.sep[O];
                        switch (w.type) {
                            case "newline":
                                A.push(O);
                                break;
                            case "space":
                                break;
                            case "comment":
                                if (w.indent > q.indent) A.length = 0;
                                break;
                            default:
                                A.length = 0
                        }
                    }
                    if (A.length >= 2) Y = K.sep.splice(A[1])
                }
                switch (this.type) {
                    case "anchor":
                    case "tag":
                        if (z || K.value) Y.push(this.sourceToken), q.items.push({
                            start: Y
                        }), this.onKeyLine = !0;
                        else if (K.sep) K.sep.push(this.sourceToken);
                        else K.start.push(this.sourceToken);
                        return;
                    case "explicit-key-ind":
                        if (!K.sep && !K.explicitKey) K.start.push(this.sourceToken), K.explicitKey = !0;
                        else if (z || K.value) Y.push(this.sourceToken), q.items.push({
                            start: Y,
                            explicitKey: !0
                        });
                        else this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: [this.sourceToken],
                                explicitKey: !0
                            }]
                        });
                        this.onKeyLine = !0;
                        return;
                    case "map-value-ind":
                        if (K.explicitKey)
                            if (!K.sep)
                                if (PK6(K.start, "newline")) Object.assign(K, {
                                    key: null,
                                    sep: [this.sourceToken]
                                });
                                else {
                                    let A = _y6(K.start);
                                    this.stack.push({
                                        type: "block-map",
                                        offset: this.offset,
                                        indent: this.indent,
                                        items: [{
                                            start: A,
                                            key: null,
                                            sep: [this.sourceToken]
                                        }]
                                    })
                                }
                        else if (K.value) q.items.push({
                            start: [],
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (PK6(K.sep, "map-value-ind")) this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: Y,
                                key: null,
                                sep: [this.sourceToken]
                            }]
                        });
                        else if ($M4(K.key) && !PK6(K.sep, "newline")) {
                            let A = _y6(K.start),
                                O = K.key,
                                w = K.sep;
                            w.push(this.sourceToken), delete K.key, delete K.sep, this.stack.push({
                                type: "block-map",
                                offset: this.offset,
                                indent: this.indent,
                                items: [{
                                    start: A,
                                    key: O,
                                    sep: w
                                }]
                            })
                        } else if (Y.length > 0) K.sep = K.sep.concat(Y, this.sourceToken);
                        else K.sep.push(this.sourceToken);
                        else if (!K.sep) Object.assign(K, {
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (K.value || z) q.items.push({
                            start: Y,
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (PK6(K.sep, "map-value-ind")) this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: [],
                                key: null,
                                sep: [this.sourceToken]
                            }]
                        });
                        else K.sep.push(this.sourceToken);
                        this.onKeyLine = !0;
                        return;
                    case "alias":
                    case "scalar":
                    case "single-quoted-scalar":
                    case "double-quoted-scalar": {
                        let A = this.flowScalar(this.type);
                        if (z || K.value) q.items.push({
                            start: Y,
                            key: A,
                            sep: []
                        }), this.onKeyLine = !0;
                        else if (K.sep) this.stack.push(A);
                        else Object.assign(K, {
                            key: A,
                            sep: []
                        }), this.onKeyLine = !0;
                        return
                    }
                    default: {
                        let A = this.startBlockValue(q);
                        if (A) {
                            if (A.type === "block-seq") {
                                if (!K.explicitKey && K.sep && !PK6(K.sep, "newline")) {
                                    yield* this.pop({
                                        type: "error",
                                        offset: this.offset,
                                        message: "Unexpected block-seq-ind on same line with key",
                                        source: this.source
                                    });
                                    return
                                }
                            } else if (_) q.items.push({
                                start: Y
                            });
                            this.stack.push(A);
                            return
                        }
                    }
                }
            }
            yield* this.pop(), yield* this.step()
        }* blockSequence(q) {
            let K = q.items[q.items.length - 1];
            switch (this.type) {
                case "newline":
                    if (K.value) {
                        let _ = "end" in K.value ? K.value.end : void 0;
                        if ((Array.isArray(_) ? _[_.length - 1] : void 0)?.type === "comment") _?.push(this.sourceToken);
                        else q.items.push({
                            start: [this.sourceToken]
                        })
                    } else K.start.push(this.sourceToken);
                    return;
                case "space":
                case "comment":
                    if (K.value) q.items.push({
                        start: [this.sourceToken]
                    });
                    else {
                        if (this.atIndentedComment(K.start, q.indent)) {
                            let z = q.items[q.items.length - 2]?.value?.end;
                            if (Array.isArray(z)) {
                                Array.prototype.push.apply(z, K.start), z.push(this.sourceToken), q.items.pop();
                                return
                            }
                        }
                        K.start.push(this.sourceToken)
                    }
                    return;
                case "anchor":
                case "tag":
                    if (K.value || this.indent <= q.indent) break;
                    K.start.push(this.sourceToken);
                    return;
                case "seq-item-ind":
                    if (this.indent !== q.indent) break;
                    if (K.value || PK6(K.start, "seq-item-ind")) q.items.push({
                        start: [this.sourceToken]
                    });
                    else K.start.push(this.sourceToken);
                    return
            }
            if (this.indent > q.indent) {
                let _ = this.startBlockValue(q);
                if (_) {
                    this.stack.push(_);
                    return
                }
            }
            yield* this.pop(), yield* this.step()
        }* flowCollection(q) {
            let K = q.items[q.items.length - 1];
            if (this.type === "flow-error-end") {
                let _;
                do yield* this.pop(), _ = this.peek(1); while (_ && _.type === "flow-collection")
            } else if (q.end.length === 0) {
                switch (this.type) {
                    case "comma":
                    case "explicit-key-ind":
                        if (!K || K.sep) q.items.push({
                            start: [this.sourceToken]
                        });
                        else K.start.push(this.sourceToken);
                        return;
                    case "map-value-ind":
                        if (!K || K.value) q.items.push({
                            start: [],
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (K.sep) K.sep.push(this.sourceToken);
                        else Object.assign(K, {
                            key: null,
                            sep: [this.sourceToken]
                        });
                        return;
                    case "space":
                    case "comment":
                    case "newline":
                    case "anchor":
                    case "tag":
                        if (!K || K.value) q.items.push({
                            start: [this.sourceToken]
                        });
                        else if (K.sep) K.sep.push(this.sourceToken);
                        else K.start.push(this.sourceToken);
                        return;
                    case "alias":
                    case "scalar":
                    case "single-quoted-scalar":
                    case "double-quoted-scalar": {
                        let z = this.flowScalar(this.type);
                        if (!K || K.value) q.items.push({
                            start: [],
                            key: z,
                            sep: []
                        });
                        else if (K.sep) this.stack.push(z);
                        else Object.assign(K, {
                            key: z,
                            sep: []
                        });
                        return
                    }
                    case "flow-map-end":
                    case "flow-seq-end":
                        q.end.push(this.sourceToken);
                        return
                }
                let _ = this.startBlockValue(q);
                if (_) this.stack.push(_);
                else yield* this.pop(), yield* this.step()
            } else {
                let _ = this.peek(2);
                if (_.type === "block-map" && (this.type === "map-value-ind" && _.indent === q.indent || this.type === "newline" && !_.items[_.items.length - 1].sep)) yield* this.pop(), yield* this.step();
                else if (this.type === "map-value-ind" && _.type !== "flow-collection") {
                    let z = Zh8(_),
                        Y = _y6(z);
                    wM4(q);
                    let A = q.end.splice(1, q.end.length);
                    A.push(this.sourceToken);
                    let O = {
                        type: "block-map",
                        offset: q.offset,
                        indent: q.indent,
                        items: [{
                            start: Y,
                            key: q,
                            sep: A
                        }]
                    };
                    this.onKeyLine = !0, this.stack[this.stack.length - 1] = O
                } else yield* this.lineEnd(q)
            }
        }
        flowScalar(q) {
            if (this.onNewLine) {
                let K = this.source.indexOf(`
`) + 1;
                while (K !== 0) this.onNewLine(this.offset + K), K = this.source.indexOf(`
`, K) + 1
            }
            return {
                type: q,
                offset: this.offset,
                indent: this.indent,
                source: this.source
            }
        }
        startBlockValue(q) {
            switch (this.type) {
                case "alias":
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return this.flowScalar(this.type);
                case "block-scalar-header":
                    return {
                        type: "block-scalar", offset: this.offset, indent: this.indent, props: [this.sourceToken], source: ""
                    };
                case "flow-map-start":
                case "flow-seq-start":
                    return {
                        type: "flow-collection", offset: this.offset, indent: this.indent, start: this.sourceToken, items: [], end: []
                    };
                case "seq-item-ind":
                    return {
                        type: "block-seq", offset: this.offset, indent: this.indent, items: [{
                            start: [this.sourceToken]
                        }]
                    };
                case "explicit-key-ind": {
                    this.onKeyLine = !0;
                    let K = Zh8(q),
                        _ = _y6(K);
                    return _.push(this.sourceToken), {
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{
                            start: _,
                            explicitKey: !0
                        }]
                    }
                }
                case "map-value-ind": {
                    this.onKeyLine = !0;
                    let K = Zh8(q),
                        _ = _y6(K);
                    return {
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{
                            start: _,
                            key: null,
                            sep: [this.sourceToken]
                        }]
                    }
                }
            }
            return null
        }
        atIndentedComment(q, K) {
            if (this.type !== "comment") return !1;
            if (this.indent <= K) return !1;
            return q.every((_) => _.type === "newline" || _.type === "space")
        }* documentEnd(q) {
            if (this.type !== "doc-mode") {
                if (q.end) q.end.push(this.sourceToken);
                else q.end = [this.sourceToken];
                if (this.type === "newline") yield* this.pop()
            }
        }* lineEnd(q) {
            switch (this.type) {
                case "comma":
                case "doc-start":
                case "doc-end":
                case "flow-seq-end":
                case "flow-map-end":
                case "map-value-ind":
                    yield* this.pop(), yield* this.step();
                    break;
                case "newline":
                    this.onKeyLine = !1;
                case "space":
                case "comment":
                default:
                    if (q.end) q.end.push(this.sourceToken);
                    else q.end = [this.sourceToken];
                    if (this.type === "newline") yield* this.pop()
            }
        }
    }
    B6z.Parser = jM4
})
// @from(Ln 213179, Col 4)
PM4 = p((n6z) => {
    var HM4 = DF1(),
        F6z = Gt6(),
        Et6 = vt6(),
        g6z = yp1(),
        U6z = YA(),
        Q6z = yF1(),
        JM4 = LF1();

    function XM4(q) {
        let K = q.prettyErrors !== !1;
        return {
            lineCounter: q.lineCounter || K && new Q6z.LineCounter || null,
            prettyErrors: K
        }
    }

    function d6z(q, K = {}) {
        let {
            lineCounter: _,
            prettyErrors: z
        } = XM4(K), Y = new JM4.Parser(_?.addNewLine), A = new HM4.Composer(K), O = Array.from(A.compose(Y.parse(q)));
        if (z && _)
            for (let w of O) w.errors.forEach(Et6.prettifyError(q, _)), w.warnings.forEach(Et6.prettifyError(q, _));
        if (O.length > 0) return O;
        return Object.assign([], {
            empty: !0
        }, A.streamInfo())
    }

    function MM4(q, K = {}) {
        let {
            lineCounter: _,
            prettyErrors: z
        } = XM4(K), Y = new JM4.Parser(_?.addNewLine), A = new HM4.Composer(K), O = null;
        for (let w of A.compose(Y.parse(q), !0, q.length))
            if (!O) O = w;
            else if (O.options.logLevel !== "silent") {
            O.errors.push(new Et6.YAMLParseError(w.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
            break
        }
        if (z && _) O.errors.forEach(Et6.prettifyError(q, _)), O.warnings.forEach(Et6.prettifyError(q, _));
        return O
    }

    function c6z(q, K, _) {
        let z = void 0;
        if (typeof K === "function") z = K;
        else if (_ === void 0 && K && typeof K === "object") _ = K;
        let Y = MM4(q, _);
        if (!Y) return null;
        if (Y.warnings.forEach((A) => g6z.warn(Y.options.logLevel, A)), Y.errors.length > 0)
            if (Y.options.logLevel !== "silent") throw Y.errors[0];
            else Y.errors = [];
        return Y.toJS(Object.assign({
            reviver: z
        }, _))
    }

    function l6z(q, K, _) {
        let z = null;
        if (typeof K === "function" || Array.isArray(K)) z = K;
        else if (_ === void 0 && K) _ = K;
        if (typeof _ === "string") _ = _.length;
        if (typeof _ === "number") {
            let Y = Math.round(_);
            _ = Y < 1 ? void 0 : Y > 8 ? {
                indent: 8
            } : {
                indent: Y
            }
        }
        if (q === void 0) {
            let {
                keepUndefined: Y
            } = _ ?? K ?? {};
            if (!Y) return
        }
        if (U6z.isDocument(q) && !z) return q.toString(_);
        return new F6z.Document(q, z, _).toString(_)
    }
    n6z.parse = c6z;
    n6z.parseAllDocuments = d6z;
    n6z.parseDocument = MM4;
    n6z.stringify = l6z
})
// @from(Ln 213265, Col 4)
RF1 = p((j8z) => {
    var s6z = DF1(),
        t6z = Gt6(),
        e6z = qF1(),
        hF1 = vt6(),
        q8z = Yt6(),
        WK6 = YA(),
        K8z = HK6(),
        _8z = uP(),
        z8z = XK6(),
        Y8z = MK6(),
        A8z = Wh8(),
        O8z = EF1(),
        w8z = yF1(),
        $8z = LF1(),
        fh8 = PM4(),
        WM4 = _t6();
    j8z.Composer = s6z.Composer;
    j8z.Document = t6z.Document;
    j8z.Schema = e6z.Schema;
    j8z.YAMLError = hF1.YAMLError;
    j8z.YAMLParseError = hF1.YAMLParseError;
    j8z.YAMLWarning = hF1.YAMLWarning;
    j8z.Alias = q8z.Alias;
    j8z.isAlias = WK6.isAlias;
    j8z.isCollection = WK6.isCollection;
    j8z.isDocument = WK6.isDocument;
    j8z.isMap = WK6.isMap;
    j8z.isNode = WK6.isNode;
    j8z.isPair = WK6.isPair;
    j8z.isScalar = WK6.isScalar;
    j8z.isSeq = WK6.isSeq;
    j8z.Pair = K8z.Pair;
    j8z.Scalar = _8z.Scalar;
    j8z.YAMLMap = z8z.YAMLMap;
    j8z.YAMLSeq = Y8z.YAMLSeq;
    j8z.CST = A8z;
    j8z.Lexer = O8z.Lexer;
    j8z.LineCounter = w8z.LineCounter;
    j8z.Parser = $8z.Parser;
    j8z.parse = fh8.parse;
    j8z.parseAllDocuments = fh8.parseAllDocuments;
    j8z.parseDocument = fh8.parseDocument;
    j8z.stringify = fh8.stringify;
    j8z.visit = WM4.visit;
    j8z.visitAsync = WM4.visitAsync
})
// @from(Ln 213313, Col 0)
function yt6(q) {
    if (typeof Bun < "u") return Bun.YAML.parse(q);
    return RF1().parse(q)
}
// @from(Ln 213318, Col 0)
function DM4(q) {
    if (typeof Bun < "u") return Bun.YAML.stringify(q, null, 2) + `
`;
    return RF1().stringify(q)
}
// @from(Ln 213324, Col 0)
function g8z(q) {
    let K = q.split(`
`),
        _ = [];
    for (let z of K) {
        let Y = z.match(/^([a-zA-Z_-]+):\s+(.+)$/);
        if (Y) {
            let [, A, O] = Y;
            if (!A || !O) {
                _.push(z);
                continue
            }
            if (O.startsWith('"') && O.endsWith('"') || O.startsWith("'") && O.endsWith("'")) {
                _.push(z);
                continue
            }
            if (F8z.test(O)) {
                let w = O.replaceAll("\\", "\\\\").replaceAll('"', "\\\"");
                _.push(`${A}: "${w}"`);
                continue
            }
        }
        _.push(z)
    }
    return _.join(`
`)
}
// @from(Ln 213352, Col 0)
function p2(q, K) {
    let _ = q.match(zy6);
    if (!_) return {
        frontmatter: {},
        content: q
    };
    let z = _[1] || "",
        Y = q.slice(_[0].length),
        A = {};
    try {
        let O = yt6(z);
        if (O && typeof O === "object" && !Array.isArray(O)) A = O
    } catch {
        try {
            let O = g8z(z),
                w = yt6(O);
            if (w && typeof w === "object" && !Array.isArray(w)) A = w
        } catch (O) {
            let w = K ? ` in ${K}` : "";
            E(`Failed to parse YAML frontmatter${w}: ${O instanceof Error?O.message:O}`, {
                level: "warn"
            })
        }
    }
    return {
        frontmatter: A,
        content: Y
    }
}
// @from(Ln 213382, Col 0)
function Lt6(q) {
    if (Array.isArray(q)) return q.flatMap(Lt6);
    if (typeof q !== "string") return [];
    let K = [],
        _ = "",
        z = 0;
    for (let A = 0; A < q.length; A++) {
        let O = q[A];
        if (O === "{") z++, _ += O;
        else if (O === "}") z--, _ += O;
        else if (O === "," && z === 0) {
            let w = _.trim();
            if (w) K.push(w);
            _ = ""
        } else _ += O
    }
    let Y = _.trim();
    if (Y) K.push(Y);
    return K.filter((A) => A.length > 0).flatMap((A) => fM4(A))
}
// @from(Ln 213403, Col 0)
function fM4(q) {
    let K = q.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    if (!K) return [q];
    let _ = K[1] || "",
        z = K[2] || "",
        Y = K[3] || "",
        A = z.split(",").map((w) => w.trim()),
        O = [];
    for (let w of A) {
        let $ = _ + w + Y,
            j = fM4($);
        O.push(...j)
    }
    return O
}
// @from(Ln 213419, Col 0)
function Gh8(q) {
    if (q === void 0 || q === null) return;
    let K = typeof q === "number" ? q : parseInt(String(q), 10);
    if (Number.isInteger(K) && K > 0) return K;
    return
}
// @from(Ln 213426, Col 0)
function Wp(q, K, _) {
    if (q == null) return null;
    if (typeof q === "string") return q.trim() || null;
    if (typeof q === "number" || typeof q === "boolean") return String(q);
    let z = _ ? `${_}:${K}` : K ?? "unknown";
    return E(`Description invalid for ${z} - omitting`, {
        level: "warn"
    }), null
}
// @from(Ln 213436, Col 0)
function Yy6(q) {
    return q === !0 || q === "true"
}
// @from(Ln 213440, Col 0)
function ht6(q) {
    if (q === !0 || q === "true") return !0;
    if (q === !1 || q === "false") return !1;
    return
}
// @from(Ln 213446, Col 0)
function vh8(q, K) {
    if (q == null) return;
    let _ = String(q).trim().toLowerCase();
    if (_ === "") return;
    if (ZM4.includes(_)) return _;
    E(`Frontmatter 'shell: ${q}' in ${K} is not recognized. Valid values: ${ZM4.join(", ")}. Falling back to bash.`, {
        level: "warn"
    });
    return
}
// @from(Ln 213456, Col 4)
F8z
// @from(Ln 213456, Col 9)
zy6
// @from(Ln 213456, Col 14)
ZM4
// @from(Ln 213457, Col 4)
Lf = L(() => {
    K8();
    F8z = /[{}[\]*&#!|>%@`]|: /;
    zy6 = /^---\s*\n([\s\S]*?)---\s*\n?/;
    ZM4 = ["bash", "powershell"]
})
// @from(Ln 213464, Col 0)
function GM4(q) {
    if (typeof q !== "object" || q === null) return !1;
    if (!("type" in q) || q.type !== "image") return !1;
    if (!("source" in q) || typeof q.source !== "object" || q.source === null) return !1;
    let K = q.source;
    return "type" in K && K.type === "base64" && "data" in K && typeof K.data === "string"
}
// @from(Ln 213472, Col 0)
function U8z(q) {
    if (typeof q !== "object" || q === null) return !1;
    if (!("type" in q) || q.type !== "tool_result") return !1;
    return "content" in q && Array.isArray(q.content)
}
// @from(Ln 213478, Col 0)
function vM4(q, K, _, z) {
    let Y = q.source.data.length;
    if (Y > _) d("tengu_image_api_validation_failed", {
        base64_size_bytes: Y,
        max_bytes: _
    }), z.push({
        index: K,
        size: Y
    })
}
// @from(Ln 213489, Col 0)
function Rt6(q, K) {
    let _ = [],
        z = 0;
    for (let Y of q) {
        if (typeof Y !== "object" || Y === null) continue;
        if (!("type" in Y) || Y.type !== "user") continue;
        if (!("message" in Y) || typeof Y.message !== "object" || Y.message === null) continue;
        let A = Y.message;
        if (!("content" in A) || !Array.isArray(A.content)) continue;
        for (let O of A.content) {
            if (GM4(O)) {
                vM4(O, ++z, K, _);
                continue
            }
            if (U8z(O)) {
                for (let w of O.content)
                    if (GM4(w)) vM4(w, ++z, K, _)
            }
        }
    }
    if (_.length > 0) throw new Ay6(_, K)
}
// @from(Ln 213511, Col 4)
Ay6
// @from(Ln 213512, Col 4)
Th8 = L(() => {
    C8();
    c7();
    Ay6 = class Ay6 extends Error {
        constructor(q, K) {
            let _, z = q[0];
            if (q.length === 1 && z) _ = `Image base64 size (${o4(z.size)}) exceeds API limit (${o4(K)}). Please resize the image before sending.`;
            else _ = `${q.length} images exceed the API limit (${o4(K)}): ` + q.map((Y) => `Image ${Y.index}: ${o4(Y.size)}`).join(", ") + ". Please resize these images before sending.";
            super(_);
            this.name = "ImageSizeError"
        }
    }
})
// @from(Ln 213526, Col 0)
function SF1(q) {
    if (PT6()) return MMq(q);
    return q
}
// @from(Ln 213531, Col 0)
function Oy6(q) {
    return q || PT6()
}
// @from(Ln 213535, Col 0)
function TM4(q) {
    return PT6() && q.status === 429
}
// @from(Ln 213538, Col 4)
St6 = L(() => {
    eG();
    dl6()
})
// @from(Ln 213543, Col 0)
function Ps() {
    return u8("tengu_turtle_carbon", !0)
}
// @from(Ln 213547, Col 0)
function VM4(q) {
    return /\bultrathink\b/i.test(q)
}
// @from(Ln 213551, Col 0)
function Vh8(q) {
    let K = [],
        _ = q.matchAll(/\bultrathink\b/gi);
    for (let z of _)
        if (z.index !== void 0) K.push({
            word: z[0],
            start: z.index,
            end: z.index + z[0].length
        });
    return K
}
// @from(Ln 213563, Col 0)
function Dp(q, K = !1) {
    let _ = K ? d8z : Q8z;
    return _[q % _.length]
}
// @from(Ln 213568, Col 0)
function kM4(q) {
    let K = $a(q, "thinking");
    if (K !== void 0) return K;
    return !o5(q).includes("claude-3-")
}
// @from(Ln 213574, Col 0)
function kh8(q) {
    let K = $a(q, "adaptive_thinking");
    if (K !== void 0) return K;
    let _ = o5(q);
    if (_.includes("opus-4-7") || _.includes("opus-4-6") || _.includes("sonnet-4-6")) return !0;
    if (_.includes("opus") || _.includes("sonnet") || _.includes("haiku")) return !1;
    return $Q(YM(q))
}
// @from(Ln 213583, Col 0)
function DK6() {
    if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
    let {
        settings: q
    } = bm();
    if (q.alwaysThinkingEnabled === !1) return !1;
    return !0
}
// @from(Ln 213591, Col 4)
Q8z
// @from(Ln 213591, Col 9)
d8z
// @from(Ln 213592, Col 4)
NR = L(() => {
    B1();
    Sq();
    PV8();
    x9();
    a1();
    Q8z = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"], d8z = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer", "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer", "rainbow_violet_shimmer"]
})
// @from(Ln 213601, Col 0)
function QI(q) {
    if (S6(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return !0;
    let K = $a(q, "effort");
    if (K !== void 0) return K;
    let _ = o5(q);
    if (_.includes("opus-4-7") || _.includes("opus-4-6") || _.includes("sonnet-4-6")) return !0;
    if (_.includes("haiku") || _.includes("sonnet") || _.includes("opus")) return !1;
    return $Q(YM(q))
}
// @from(Ln 213611, Col 0)
function l8z(q) {
    let K = q.toLowerCase(),
        _ = K.match(/claude-[a-z0-9-]+/),
        z = _ ? _[0] : K;
    return z = z.replace(/-v\d+(:\d+)?$/, ""), z = z.replace(/-\d{8}$/, ""), z
}
// @from(Ln 213618, Col 0)
function Ct6(q) {
    let K = $a(q, "max_effort");
    if (K !== void 0) return K;
    if (q.toLowerCase().includes("haiku")) return !1;
    return !c8z.has(l8z(q))
}
// @from(Ln 213625, Col 0)
function bt6(q) {
    let K = $a(q, "xhigh_effort");
    if (K !== void 0) return K;
    return o5(q).includes("opus-4-7")
}
// @from(Ln 213631, Col 0)
function Nh8(q) {
    return UI.includes(q)
}
// @from(Ln 213635, Col 0)
function id(q) {
    if (q === void 0 || q === null || q === "") return;
    if (typeof q === "number" && NM4(q)) return q;
    let K = String(q).toLowerCase();
    if (Nh8(K)) return K;
    let _ = parseInt(K, 10);
    if (!isNaN(_) && NM4(_)) return _;
    return
}
// @from(Ln 213645, Col 0)
function It6(q) {
    if (q === "low" || q === "medium" || q === "high" || q === "xhigh") return q;
    return
}
// @from(Ln 213650, Col 0)
function n8z() {
    return It6(v7().effortLevel)
}
// @from(Ln 213654, Col 0)
function EM4(q, K, _, z) {
    return _ !== void 0 || z || q !== K ? q : void 0
}
// @from(Ln 213658, Col 0)
function Zj6() {
    let q = process.env.CLAUDE_CODE_EFFORT_LEVEL;
    return q?.toLowerCase() === "unset" || q?.toLowerCase() === "auto" ? null : id(q)
}
// @from(Ln 213663, Col 0)
function wy6(q, K) {
    let _ = o5(q).includes("opus-4-7") && !H8().unpinOpus47LaunchEffort,
        z = IF1(q),
        Y = Zj6();
    if (Y === null) return _ ? z : void 0;
    let A = Y ?? (_ ? z : void 0) ?? K ?? z;
    if (A === "max" && !Ct6(q)) return "high";
    if (A === "xhigh" && !bt6(q)) return "high";
    return A
}
// @from(Ln 213674, Col 0)
function CF1(q) {
    let K = id(q);
    if (K !== void 0) d8((_) => _.unpinOpus47LaunchEffort ? _ : {
        ..._,
        unpinOpus47LaunchEffort: !0
    });
    return K ?? n8z()
}
// @from(Ln 213683, Col 0)
function $y6(q, K) {
    let _ = wy6(q, K) ?? "high";
    return xt6(_)
}
// @from(Ln 213688, Col 0)
function jy6(q, K) {
    if (K === void 0) return "";
    let _ = wy6(q, K);
    if (_ === void 0) return "";
    return ` with ${xt6(_)} effort`
}
// @from(Ln 213695, Col 0)
function NM4(q) {
    return Number.isInteger(q)
}
// @from(Ln 213699, Col 0)
function xt6(q) {
    if (typeof q === "string") return Nh8(q) ? q : "high";
    return "high"
}
// @from(Ln 213704, Col 0)
function i8z(q) {
    switch (q) {
        case "low":
            return "Quick, straightforward implementation with minimal overhead";
        case "medium":
            return "Balanced approach with standard implementation and testing";
        case "high":
            return "Comprehensive implementation with extensive testing and documentation";
        case "xhigh":
            return "Deeper reasoning than high, just below maximum (Opus 4.7 only)";
        case "max":
            return "Maximum capability with deepest reasoning"
    }
}
// @from(Ln 213719, Col 0)
function bF1(q) {
    if (typeof q === "string") {
        let K = i8z(q);
        if (q === "high" && JB() && u8("tengu_slate_finch", !1)) return `${K} · burns fastest — medium handles most tasks`;
        return K
    }
    return "Balanced approach with standard implementation and testing"
}
// @from(Ln 213728, Col 0)
function IF1(q) {
    let K = o5(q);
    if (K.includes("opus-4-7")) return "xhigh";
    if (K.includes("opus-4-6")) {
        if (JB() || ch()) return "medium"
    }
    if (Ps() && (JB() || ch())) return "medium";
    return "high"
}
// @from(Ln 213737, Col 4)
UI
// @from(Ln 213737, Col 8)
c8z
// @from(Ln 213738, Col 4)
hf = L(() => {
    NR();
    a1();
    T7();
    B1();
    x9();
    PV8();
    Sq();
    Q8();
    h1();
    UI = ["low", "medium", "high", "xhigh", "max"];
    c8z = new Set(["claude-3-opus", "claude-3-sonnet", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-sonnet-4", "claude-sonnet-4-0", "claude-sonnet-4-5", "claude-opus-4", "claude-opus-4-0", "claude-opus-4-1", "claude-opus-4-5"])
})
// @from(Ln 213752, Col 0)
function yM4(q) {
    return r8z.some((K) => q.startsWith(K))
}
// @from(Ln 213756, Col 0)
function LM4(q, K) {
    if (q.isUsingOverage) {
        if (q.overageStatus === "allowed_warning") return {
            message: "You're close to your extra usage spending limit",
            severity: "warning"
        };
        return null
    }
    if (q.status === "rejected") return {
        message: o8z(q, K),
        severity: "error"
    };
    if (q.status === "allowed_warning") {
        if (q.utilization !== void 0 && q.utilization < 0.7) return null;
        let z = MK(),
            Y = z === "team" || z === "enterprise",
            A = k_()?.hasExtraUsageEnabled === !0;
        if (Y && A && !Ib()) return null;
        let O = a8z(q);
        if (O) return {
            message: O,
            severity: "warning"
        }
    }
    return null
}