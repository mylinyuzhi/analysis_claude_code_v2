
// @from(Ln 130585, Col 4)
U_8 = x((cy3) => {
    var Uy3 = x6("process"),
        oD7 = nz1(),
        dy3 = p_8();

    function Na(A, q) {
        for (let K = 0; K < A.length; ++K)
            if (A[K].type === q) return !0;
        return !1
    }

    function aD7(A) {
        for (let q = 0; q < A.length; ++q) switch (A[q].type) {
            case "space":
            case "comment":
            case "newline":
                break;
            default:
                return q
        }
        return -1
    }

    function tD7(A) {
        switch (A?.type) {
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

    function oz1(A) {
        switch (A.type) {
            case "document":
                return A.start;
            case "block-map": {
                let q = A.items[A.items.length - 1];
                return q.sep ?? q.start
            }
            case "block-seq":
                return A.items[A.items.length - 1].start;
            default:
                return []
        }
    }

    function mM6(A) {
        if (A.length === 0) return [];
        let q = A.length;
        A: while (--q >= 0) switch (A[q].type) {
            case "doc-start":
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
            case "newline":
                break A
        }
        while (A[++q]?.type === "space");
        return A.splice(q, A.length)
    }

    function sD7(A) {
        if (A.start.type === "flow-seq-start") {
            for (let q of A.items)
                if (q.sep && !q.value && !Na(q.start, "explicit-key-ind") && !Na(q.sep, "map-value-ind")) {
                    if (q.key) q.value = q.key;
                    if (delete q.key, tD7(q.value))
                        if (q.value.end) Array.prototype.push.apply(q.value.end, q.sep);
                        else q.value.end = q.sep;
                    else Array.prototype.push.apply(q.start, q.sep);
                    delete q.sep
                }
        }
    }
    class eD7 {
        constructor(A) {
            this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new dy3.Lexer, this.onNewLine = A
        }* parse(A, q = !1) {
            if (this.onNewLine && this.offset === 0) this.onNewLine(0);
            for (let K of this.lexer.lex(A, q)) yield* this.next(K);
            if (!q) yield* this.end()
        }* next(A) {
            if (this.source = A, Uy3.env.LOG_TOKENS) console.log("|", oD7.prettyToken(A));
            if (this.atScalar) {
                this.atScalar = !1, yield* this.step(), this.offset += A.length;
                return
            }
            let q = oD7.tokenType(A);
            if (!q) {
                let K = `Not a YAML token: ${A}`;
                yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: K,
                    source: A
                }), this.offset += A.length
            } else if (q === "scalar") this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
            else {
                switch (this.type = q, yield* this.step(), q) {
                    case "newline":
                        if (this.atNewLine = !0, this.indent = 0, this.onNewLine) this.onNewLine(this.offset + A.length);
                        break;
                    case "space":
                        if (this.atNewLine && A[0] === " ") this.indent += A.length;
                        break;
                    case "explicit-key-ind":
                    case "map-value-ind":
                    case "seq-item-ind":
                        if (this.atNewLine) this.indent += A.length;
                        break;
                    case "doc-mode":
                    case "flow-error-end":
                        return;
                    default:
                        this.atNewLine = !1
                }
                this.offset += A.length
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
            let A = this.peek(1);
            if (this.type === "doc-end" && (!A || A.type !== "doc-end")) {
                while (this.stack.length > 0) yield* this.pop();
                this.stack.push({
                    type: "doc-end",
                    offset: this.offset,
                    source: this.source
                });
                return
            }
            if (!A) return yield* this.stream();
            switch (A.type) {
                case "document":
                    return yield* this.document(A);
                case "alias":
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return yield* this.scalar(A);
                case "block-scalar":
                    return yield* this.blockScalar(A);
                case "block-map":
                    return yield* this.blockMap(A);
                case "block-seq":
                    return yield* this.blockSequence(A);
                case "flow-collection":
                    return yield* this.flowCollection(A);
                case "doc-end":
                    return yield* this.documentEnd(A)
            }
            yield* this.pop()
        }
        peek(A) {
            return this.stack[this.stack.length - A]
        }* pop(A) {
            let q = A ?? this.stack.pop();
            if (!q) yield {
                type: "error",
                offset: this.offset,
                source: "",
                message: "Tried to pop an empty stack"
            };
            else if (this.stack.length === 0) yield q;
            else {
                let K = this.peek(1);
                if (q.type === "block-scalar") q.indent = "indent" in K ? K.indent : 0;
                else if (q.type === "flow-collection" && K.type === "document") q.indent = 0;
                if (q.type === "flow-collection") sD7(q);
                switch (K.type) {
                    case "document":
                        K.value = q;
                        break;
                    case "block-scalar":
                        K.props.push(q);
                        break;
                    case "block-map": {
                        let Y = K.items[K.items.length - 1];
                        if (Y.value) {
                            K.items.push({
                                start: [],
                                key: q,
                                sep: []
                            }), this.onKeyLine = !0;
                            return
                        } else if (Y.sep) Y.value = q;
                        else {
                            Object.assign(Y, {
                                key: q,
                                sep: []
                            }), this.onKeyLine = !Y.explicitKey;
                            return
                        }
                        break
                    }
                    case "block-seq": {
                        let Y = K.items[K.items.length - 1];
                        if (Y.value) K.items.push({
                            start: [],
                            value: q
                        });
                        else Y.value = q;
                        break
                    }
                    case "flow-collection": {
                        let Y = K.items[K.items.length - 1];
                        if (!Y || Y.value) K.items.push({
                            start: [],
                            key: q,
                            sep: []
                        });
                        else if (Y.sep) Y.value = q;
                        else Object.assign(Y, {
                            key: q,
                            sep: []
                        });
                        return
                    }
                    default:
                        yield* this.pop(), yield* this.pop(q)
                }
                if ((K.type === "document" || K.type === "block-map" || K.type === "block-seq") && (q.type === "block-map" || q.type === "block-seq")) {
                    let Y = q.items[q.items.length - 1];
                    if (Y && !Y.sep && !Y.value && Y.start.length > 0 && aD7(Y.start) === -1 && (q.indent === 0 || Y.start.every((z) => z.type !== "comment" || z.indent < q.indent))) {
                        if (K.type === "document") K.end = Y.start;
                        else K.items.push({
                            start: Y.start
                        });
                        q.items.splice(-1, 1)
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
                    let A = {
                        type: "document",
                        offset: this.offset,
                        start: []
                    };
                    if (this.type === "doc-start") A.start.push(this.sourceToken);
                    this.stack.push(A);
                    return
                }
            }
            yield {
                type: "error",
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML stream`,
                source: this.source
            }
        }* document(A) {
            if (A.value) return yield* this.lineEnd(A);
            switch (this.type) {
                case "doc-start": {
                    if (aD7(A.start) !== -1) yield* this.pop(), yield* this.step();
                    else A.start.push(this.sourceToken);
                    return
                }
                case "anchor":
                case "tag":
                case "space":
                case "comment":
                case "newline":
                    A.start.push(this.sourceToken);
                    return
            }
            let q = this.startBlockValue(A);
            if (q) this.stack.push(q);
            else yield {
                type: "error",
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML document`,
                source: this.source
            }
        }* scalar(A) {
            if (this.type === "map-value-ind") {
                let q = oz1(this.peek(2)),
                    K = mM6(q),
                    Y;
                if (A.end) Y = A.end, Y.push(this.sourceToken), delete A.end;
                else Y = [this.sourceToken];
                let z = {
                    type: "block-map",
                    offset: A.offset,
                    indent: A.indent,
                    items: [{
                        start: K,
                        key: A,
                        sep: Y
                    }]
                };
                this.onKeyLine = !0, this.stack[this.stack.length - 1] = z
            } else yield* this.lineEnd(A)
        }* blockScalar(A) {
            switch (this.type) {
                case "space":
                case "comment":
                case "newline":
                    A.props.push(this.sourceToken);
                    return;
                case "scalar":
                    if (A.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
                        let q = this.source.indexOf(`
`) + 1;
                        while (q !== 0) this.onNewLine(this.offset + q), q = this.source.indexOf(`
`, q) + 1
                    }
                    yield* this.pop();
                    break;
                default:
                    yield* this.pop(), yield* this.step()
            }
        }* blockMap(A) {
            let q = A.items[A.items.length - 1];
            switch (this.type) {
                case "newline":
                    if (this.onKeyLine = !1, q.value) {
                        let K = "end" in q.value ? q.value.end : void 0;
                        if ((Array.isArray(K) ? K[K.length - 1] : void 0)?.type === "comment") K?.push(this.sourceToken);
                        else A.items.push({
                            start: [this.sourceToken]
                        })
                    } else if (q.sep) q.sep.push(this.sourceToken);
                    else q.start.push(this.sourceToken);
                    return;
                case "space":
                case "comment":
                    if (q.value) A.items.push({
                        start: [this.sourceToken]
                    });
                    else if (q.sep) q.sep.push(this.sourceToken);
                    else {
                        if (this.atIndentedComment(q.start, A.indent)) {
                            let Y = A.items[A.items.length - 2]?.value?.end;
                            if (Array.isArray(Y)) {
                                Array.prototype.push.apply(Y, q.start), Y.push(this.sourceToken), A.items.pop();
                                return
                            }
                        }
                        q.start.push(this.sourceToken)
                    }
                    return
            }
            if (this.indent >= A.indent) {
                let K = !this.onKeyLine && this.indent === A.indent,
                    Y = K && (q.sep || q.explicitKey) && this.type !== "seq-item-ind",
                    z = [];
                if (Y && q.sep && !q.value) {
                    let _ = [];
                    for (let w = 0; w < q.sep.length; ++w) {
                        let O = q.sep[w];
                        switch (O.type) {
                            case "newline":
                                _.push(w);
                                break;
                            case "space":
                                break;
                            case "comment":
                                if (O.indent > A.indent) _.length = 0;
                                break;
                            default:
                                _.length = 0
                        }
                    }
                    if (_.length >= 2) z = q.sep.splice(_[1])
                }
                switch (this.type) {
                    case "anchor":
                    case "tag":
                        if (Y || q.value) z.push(this.sourceToken), A.items.push({
                            start: z
                        }), this.onKeyLine = !0;
                        else if (q.sep) q.sep.push(this.sourceToken);
                        else q.start.push(this.sourceToken);
                        return;
                    case "explicit-key-ind":
                        if (!q.sep && !q.explicitKey) q.start.push(this.sourceToken), q.explicitKey = !0;
                        else if (Y || q.value) z.push(this.sourceToken), A.items.push({
                            start: z,
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
                        if (q.explicitKey)
                            if (!q.sep)
                                if (Na(q.start, "newline")) Object.assign(q, {
                                    key: null,
                                    sep: [this.sourceToken]
                                });
                                else {
                                    let _ = mM6(q.start);
                                    this.stack.push({
                                        type: "block-map",
                                        offset: this.offset,
                                        indent: this.indent,
                                        items: [{
                                            start: _,
                                            key: null,
                                            sep: [this.sourceToken]
                                        }]
                                    })
                                }
                        else if (q.value) A.items.push({
                            start: [],
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (Na(q.sep, "map-value-ind")) this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: z,
                                key: null,
                                sep: [this.sourceToken]
                            }]
                        });
                        else if (tD7(q.key) && !Na(q.sep, "newline")) {
                            let _ = mM6(q.start),
                                w = q.key,
                                O = q.sep;
                            O.push(this.sourceToken), delete q.key, delete q.sep, this.stack.push({
                                type: "block-map",
                                offset: this.offset,
                                indent: this.indent,
                                items: [{
                                    start: _,
                                    key: w,
                                    sep: O
                                }]
                            })
                        } else if (z.length > 0) q.sep = q.sep.concat(z, this.sourceToken);
                        else q.sep.push(this.sourceToken);
                        else if (!q.sep) Object.assign(q, {
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (q.value || Y) A.items.push({
                            start: z,
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (Na(q.sep, "map-value-ind")) this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: [],
                                key: null,
                                sep: [this.sourceToken]
                            }]
                        });
                        else q.sep.push(this.sourceToken);
                        this.onKeyLine = !0;
                        return;
                    case "alias":
                    case "scalar":
                    case "single-quoted-scalar":
                    case "double-quoted-scalar": {
                        let _ = this.flowScalar(this.type);
                        if (Y || q.value) A.items.push({
                            start: z,
                            key: _,
                            sep: []
                        }), this.onKeyLine = !0;
                        else if (q.sep) this.stack.push(_);
                        else Object.assign(q, {
                            key: _,
                            sep: []
                        }), this.onKeyLine = !0;
                        return
                    }
                    default: {
                        let _ = this.startBlockValue(A);
                        if (_) {
                            if (_.type === "block-seq") {
                                if (!q.explicitKey && q.sep && !Na(q.sep, "newline")) {
                                    yield* this.pop({
                                        type: "error",
                                        offset: this.offset,
                                        message: "Unexpected block-seq-ind on same line with key",
                                        source: this.source
                                    });
                                    return
                                }
                            } else if (K) A.items.push({
                                start: z
                            });
                            this.stack.push(_);
                            return
                        }
                    }
                }
            }
            yield* this.pop(), yield* this.step()
        }* blockSequence(A) {
            let q = A.items[A.items.length - 1];
            switch (this.type) {
                case "newline":
                    if (q.value) {
                        let K = "end" in q.value ? q.value.end : void 0;
                        if ((Array.isArray(K) ? K[K.length - 1] : void 0)?.type === "comment") K?.push(this.sourceToken);
                        else A.items.push({
                            start: [this.sourceToken]
                        })
                    } else q.start.push(this.sourceToken);
                    return;
                case "space":
                case "comment":
                    if (q.value) A.items.push({
                        start: [this.sourceToken]
                    });
                    else {
                        if (this.atIndentedComment(q.start, A.indent)) {
                            let Y = A.items[A.items.length - 2]?.value?.end;
                            if (Array.isArray(Y)) {
                                Array.prototype.push.apply(Y, q.start), Y.push(this.sourceToken), A.items.pop();
                                return
                            }
                        }
                        q.start.push(this.sourceToken)
                    }
                    return;
                case "anchor":
                case "tag":
                    if (q.value || this.indent <= A.indent) break;
                    q.start.push(this.sourceToken);
                    return;
                case "seq-item-ind":
                    if (this.indent !== A.indent) break;
                    if (q.value || Na(q.start, "seq-item-ind")) A.items.push({
                        start: [this.sourceToken]
                    });
                    else q.start.push(this.sourceToken);
                    return
            }
            if (this.indent > A.indent) {
                let K = this.startBlockValue(A);
                if (K) {
                    this.stack.push(K);
                    return
                }
            }
            yield* this.pop(), yield* this.step()
        }* flowCollection(A) {
            let q = A.items[A.items.length - 1];
            if (this.type === "flow-error-end") {
                let K;
                do yield* this.pop(), K = this.peek(1); while (K && K.type === "flow-collection")
            } else if (A.end.length === 0) {
                switch (this.type) {
                    case "comma":
                    case "explicit-key-ind":
                        if (!q || q.sep) A.items.push({
                            start: [this.sourceToken]
                        });
                        else q.start.push(this.sourceToken);
                        return;
                    case "map-value-ind":
                        if (!q || q.value) A.items.push({
                            start: [],
                            key: null,
                            sep: [this.sourceToken]
                        });
                        else if (q.sep) q.sep.push(this.sourceToken);
                        else Object.assign(q, {
                            key: null,
                            sep: [this.sourceToken]
                        });
                        return;
                    case "space":
                    case "comment":
                    case "newline":
                    case "anchor":
                    case "tag":
                        if (!q || q.value) A.items.push({
                            start: [this.sourceToken]
                        });
                        else if (q.sep) q.sep.push(this.sourceToken);
                        else q.start.push(this.sourceToken);
                        return;
                    case "alias":
                    case "scalar":
                    case "single-quoted-scalar":
                    case "double-quoted-scalar": {
                        let Y = this.flowScalar(this.type);
                        if (!q || q.value) A.items.push({
                            start: [],
                            key: Y,
                            sep: []
                        });
                        else if (q.sep) this.stack.push(Y);
                        else Object.assign(q, {
                            key: Y,
                            sep: []
                        });
                        return
                    }
                    case "flow-map-end":
                    case "flow-seq-end":
                        A.end.push(this.sourceToken);
                        return
                }
                let K = this.startBlockValue(A);
                if (K) this.stack.push(K);
                else yield* this.pop(), yield* this.step()
            } else {
                let K = this.peek(2);
                if (K.type === "block-map" && (this.type === "map-value-ind" && K.indent === A.indent || this.type === "newline" && !K.items[K.items.length - 1].sep)) yield* this.pop(), yield* this.step();
                else if (this.type === "map-value-ind" && K.type !== "flow-collection") {
                    let Y = oz1(K),
                        z = mM6(Y);
                    sD7(A);
                    let _ = A.end.splice(1, A.end.length);
                    _.push(this.sourceToken);
                    let w = {
                        type: "block-map",
                        offset: A.offset,
                        indent: A.indent,
                        items: [{
                            start: z,
                            key: A,
                            sep: _
                        }]
                    };
                    this.onKeyLine = !0, this.stack[this.stack.length - 1] = w
                } else yield* this.lineEnd(A)
            }
        }
        flowScalar(A) {
            if (this.onNewLine) {
                let q = this.source.indexOf(`
`) + 1;
                while (q !== 0) this.onNewLine(this.offset + q), q = this.source.indexOf(`
`, q) + 1
            }
            return {
                type: A,
                offset: this.offset,
                indent: this.indent,
                source: this.source
            }
        }
        startBlockValue(A) {
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
                    let q = oz1(A),
                        K = mM6(q);
                    return K.push(this.sourceToken), {
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{
                            start: K,
                            explicitKey: !0
                        }]
                    }
                }
                case "map-value-ind": {
                    this.onKeyLine = !0;
                    let q = oz1(A),
                        K = mM6(q);
                    return {
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{
                            start: K,
                            key: null,
                            sep: [this.sourceToken]
                        }]
                    }
                }
            }
            return null
        }
        atIndentedComment(A, q) {
            if (this.type !== "comment") return !1;
            if (this.indent <= q) return !1;
            return A.every((K) => K.type === "newline" || K.type === "space")
        }* documentEnd(A) {
            if (this.type !== "doc-mode") {
                if (A.end) A.end.push(this.sourceToken);
                else A.end = [this.sourceToken];
                if (this.type === "newline") yield* this.pop()
            }
        }* lineEnd(A) {
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
                    if (A.end) A.end.push(this.sourceToken);
                    else A.end = [this.sourceToken];
                    if (this.type === "newline") yield* this.pop()
            }
        }
    }
    cy3.Parser = eD7
})
// @from(Ln 131351, Col 4)
zX7 = x((ey3) => {
    var AX7 = C_8(),
        iy3 = Zb6(),
        Vb6 = Gb6(),
        ny3 = Qz8(),
        ry3 = CY(),
        oy3 = Q_8(),
        qX7 = U_8();

    function KX7(A) {
        let q = A.prettyErrors !== !1;
        return {
            lineCounter: A.lineCounter || q && new oy3.LineCounter || null,
            prettyErrors: q
        }
    }

    function ay3(A, q = {}) {
        let {
            lineCounter: K,
            prettyErrors: Y
        } = KX7(q), z = new qX7.Parser(K?.addNewLine), _ = new AX7.Composer(q), w = Array.from(_.compose(z.parse(A)));
        if (Y && K)
            for (let O of w) O.errors.forEach(Vb6.prettifyError(A, K)), O.warnings.forEach(Vb6.prettifyError(A, K));
        if (w.length > 0) return w;
        return Object.assign([], {
            empty: !0
        }, _.streamInfo())
    }

    function YX7(A, q = {}) {
        let {
            lineCounter: K,
            prettyErrors: Y
        } = KX7(q), z = new qX7.Parser(K?.addNewLine), _ = new AX7.Composer(q), w = null;
        for (let O of _.compose(z.parse(A), !0, A.length))
            if (!w) w = O;
            else if (w.options.logLevel !== "silent") {
            w.errors.push(new Vb6.YAMLParseError(O.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
            break
        }
        if (Y && K) w.errors.forEach(Vb6.prettifyError(A, K)), w.warnings.forEach(Vb6.prettifyError(A, K));
        return w
    }

    function sy3(A, q, K) {
        let Y = void 0;
        if (typeof q === "function") Y = q;
        else if (K === void 0 && q && typeof q === "object") K = q;
        let z = YX7(A, K);
        if (!z) return null;
        if (z.warnings.forEach((_) => ny3.warn(z.options.logLevel, _)), z.errors.length > 0)
            if (z.options.logLevel !== "silent") throw z.errors[0];
            else z.errors = [];
        return z.toJS(Object.assign({
            reviver: Y
        }, K))
    }

    function ty3(A, q, K) {
        let Y = null;
        if (typeof q === "function" || Array.isArray(q)) Y = q;
        else if (K === void 0 && q) K = q;
        if (typeof K === "string") K = K.length;
        if (typeof K === "number") {
            let z = Math.round(K);
            K = z < 1 ? void 0 : z > 8 ? {
                indent: 8
            } : {
                indent: z
            }
        }
        if (A === void 0) {
            let {
                keepUndefined: z
            } = K ?? q ?? {};
            if (!z) return
        }
        if (ry3.isDocument(A) && !Y) return A.toString(K);
        return new iy3.Document(A, Y, K).toString(K)
    }
    ey3.parse = sy3;
    ey3.parseAllDocuments = ay3;
    ey3.parseDocument = YX7;
    ey3.stringify = ty3
})
// @from(Ln 131437, Col 4)
zL3
// @from(Ln 131437, Col 9)
_L3
// @from(Ln 131437, Col 14)
wL3
// @from(Ln 131437, Col 19)
d_8
// @from(Ln 131437, Col 24)
OL3
// @from(Ln 131437, Col 29)
Va
// @from(Ln 131437, Col 33)
$L3
// @from(Ln 131437, Col 38)
HL3
// @from(Ln 131437, Col 43)
jL3
// @from(Ln 131437, Col 48)
JL3
// @from(Ln 131437, Col 53)
RE_
// @from(Ln 131437, Col 58)
ML3
// @from(Ln 131437, Col 63)
DL3
// @from(Ln 131437, Col 68)
XL3
// @from(Ln 131437, Col 73)
az1
// @from(Ln 131437, Col 78)
_X7
// @from(Ln 131437, Col 83)
PL3
// @from(Ln 131437, Col 88)
WL3
// @from(Ln 131437, Col 93)
ZL3
// @from(Ln 131437, Col 98)
GL3
// @from(Ln 131437, Col 103)
fL3
// @from(Ln 131437, Col 108)
TL3
// @from(Ln 131437, Col 113)
vL3
// @from(Ln 131437, Col 118)
NL3
// @from(Ln 131437, Col 123)
VL3
// @from(Ln 131437, Col 128)
kL3
// @from(Ln 131437, Col 133)
EL3
// @from(Ln 131437, Col 138)
yL3
// @from(Ln 131437, Col 143)
LL3
// @from(Ln 131437, Col 148)
RL3
// @from(Ln 131437, Col 153)
hL3
// @from(Ln 131437, Col 158)
SL3
// @from(Ln 131437, Col 163)
CL3
// @from(Ln 131437, Col 168)
IL3
// @from(Ln 131437, Col 173)
bL3
// @from(Ln 131437, Col 178)
xL3
// @from(Ln 131437, Col 183)
uL3
// @from(Ln 131437, Col 188)
mL3
// @from(Ln 131437, Col 193)
c_8
// @from(Ln 131437, Col 198)
BL3
// @from(Ln 131437, Col 203)
gL3
// @from(Ln 131437, Col 208)
FL3
// @from(Ln 131437, Col 213)
pL3
// @from(Ln 131437, Col 218)
QL3
// @from(Ln 131438, Col 4)
wX7 = E(() => {
    zL3 = C_8(), _L3 = Zb6(), wL3 = P_8(), d_8 = Gb6(), OL3 = Kb6(), Va = CY(), $L3 = Ga(), HL3 = SJ(), jL3 = Ta(), JL3 = va(), RE_ = nz1(), ML3 = p_8(), DL3 = Q_8(), XL3 = U_8(), az1 = zX7(), _X7 = Ab6();
    PL3 = zL3.Composer, WL3 = _L3.Document, ZL3 = wL3.Schema, GL3 = d_8.YAMLError, fL3 = d_8.YAMLParseError, TL3 = d_8.YAMLWarning, vL3 = OL3.Alias, NL3 = Va.isAlias, VL3 = Va.isCollection, kL3 = Va.isDocument, EL3 = Va.isMap, yL3 = Va.isNode, LL3 = Va.isPair, RL3 = Va.isScalar, hL3 = Va.isSeq, SL3 = $L3.Pair, CL3 = HL3.Scalar, IL3 = jL3.YAMLMap, bL3 = JL3.YAMLSeq, xL3 = ML3.Lexer, uL3 = DL3.LineCounter, mL3 = XL3.Parser, c_8 = az1.parse, BL3 = az1.parseAllDocuments, gL3 = az1.parseDocument, FL3 = az1.stringify, pL3 = _X7.visit, QL3 = _X7.visitAsync
})
// @from(Ln 131443, Col 0)
function l_8(A) {
    if (typeof Bun < "u") return Bun.YAML.parse(A);
    return c_8(A)
}
// @from(Ln 131447, Col 4)
OX7 = E(() => {
    wX7()
})
// @from(Ln 131451, Col 0)
function dL3(A) {
    let q = A.split(`
`),
        K = [];
    for (let Y of q) {
        let z = Y.match(/^([a-zA-Z_-]+):\s+(.+)$/);
        if (z) {
            let [, _, w] = z;
            if (!_ || !w) {
                K.push(Y);
                continue
            }
            if (w.startsWith('"') && w.endsWith('"') || w.startsWith("'") && w.endsWith("'")) {
                K.push(Y);
                continue
            }
            if (UL3.test(w)) {
                let O = w.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                K.push(`${_}: "${O}"`);
                continue
            }
        }
        K.push(Y)
    }
    return K.join(`
`)
}
// @from(Ln 131479, Col 0)
function BH(A, q) {
    let K = /^---\s*\n([\s\S]*?)---\s*\n?/,
        Y = A.match(K);
    if (!Y) return {
        frontmatter: {},
        content: A
    };
    let z = Y[1] || "",
        _ = A.slice(Y[0].length),
        w = {};
    try {
        let O = l_8(z);
        if (O && typeof O === "object" && !Array.isArray(O)) w = O
    } catch {
        try {
            let O = dL3(z),
                $ = l_8(O);
            if ($ && typeof $ === "object" && !Array.isArray($)) w = $
        } catch (O) {
            let $ = q ? ` in ${q}` : "";
            k(`Failed to parse YAML frontmatter${$}: ${O instanceof Error?O.message:O}`, {
                level: "warn"
            })
        }
    }
    return {
        frontmatter: w,
        content: _
    }
}
// @from(Ln 131510, Col 0)
function sz1(A) {
    let q = [],
        K = "",
        Y = 0;
    for (let _ = 0; _ < A.length; _++) {
        let w = A[_];
        if (w === "{") Y++, K += w;
        else if (w === "}") Y--, K += w;
        else if (w === "," && Y === 0) {
            let O = K.trim();
            if (O) q.push(O);
            K = ""
        } else K += w
    }
    let z = K.trim();
    if (z) q.push(z);
    return q.filter((_) => _.length > 0).flatMap((_) => $X7(_))
}
// @from(Ln 131529, Col 0)
function $X7(A) {
    let q = A.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    if (!q) return [A];
    let K = q[1] || "",
        Y = q[2] || "",
        z = q[3] || "",
        _ = Y.split(",").map((O) => O.trim()),
        w = [];
    for (let O of _) {
        let $ = K + O + z,
            H = $X7($);
        w.push(...H)
    }
    return w
}
// @from(Ln 131545, Col 0)
function HX7(A) {
    if (A === void 0 || A === null) return;
    let q = typeof A === "number" ? A : parseInt(String(A), 10);
    if (Number.isInteger(q) && q > 0) return q;
    return
}
// @from(Ln 131552, Col 0)
function NL(A, q, K) {
    if (A == null) return null;
    if (typeof A === "string") return A.trim() || null;
    if (typeof A === "number" || typeof A === "boolean") return String(A);
    let Y = K ? `${K}:${q}` : q ?? "unknown";
    return k(`Description invalid for ${Y} - omitting`, {
        level: "warn"
    }), null
}
// @from(Ln 131562, Col 0)
function ka(A) {
    return A === !0 || A === "true"
}
// @from(Ln 131565, Col 4)
UL3
// @from(Ln 131566, Col 4)
BG = E(() => {
    OX7();
    H1();
    UL3 = /[{}[\]*&#!|>%@`]|: /
})
// @from(Ln 131572, Col 0)
function Eb6() {
    return L8("policySettings")?.allowManagedPermissionRulesOnly === !0
}
// @from(Ln 131576, Col 0)
function Ea() {
    return !Eb6()
}
// @from(Ln 131580, Col 0)
function lL3(A) {
    let q = F_(A);
    if (!q) return null;
    try {
        let {
            resolvedPath: K
        } = qO($1(), q), Y = IM(K);
        if (Y.trim() === "") return {};
        let z = WK(Y, !1);
        return z && typeof z === "object" ? z : null
    } catch {
        return null
    }
}
// @from(Ln 131595, Col 0)
function iL3(A, q) {
    if (!A || !A.permissions) return [];
    let {
        permissions: K
    } = A, Y = [];
    for (let z of cL3) {
        let _ = K[z];
        if (_)
            for (let w of _) Y.push({
                source: q,
                ruleBehavior: z,
                ruleValue: CH(w)
            })
    }
    return Y
}
// @from(Ln 131612, Col 0)
function tz1() {
    if (Eb6()) return kb6("policySettings");
    let A = [];
    for (let q of pQ()) A.push(...kb6(q));
    return A
}
// @from(Ln 131619, Col 0)
function kb6(A) {
    let q = L8(A);
    return iL3(q, A)
}
// @from(Ln 131624, Col 0)
function jX7(A) {
    if (!nL3.includes(A.source)) return !1;
    let q = L5(A.ruleValue),
        K = L8(A.source);
    if (!K || !K.permissions) return !1;
    let Y = K.permissions[A.ruleBehavior];
    if (!Y) return !1;
    let z = (_) => L5(CH(_));
    if (!Y.some((_) => z(_) === q)) return !1;
    try {
        let _ = {
                ...K,
                permissions: {
                    ...K.permissions,
                    [A.ruleBehavior]: Y.filter((O) => z(O) !== q)
                }
            },
            {
                error: w
            } = TA(A.source, _);
        if (w) return !1;
        return !0
    } catch (_) {
        return _6(_), !1
    }
}
// @from(Ln 131651, Col 0)
function rL3() {
    return {
        permissions: {}
    }
}
// @from(Ln 131657, Col 0)
function JX7({
    ruleValues: A,
    ruleBehavior: q
}, K) {
    if (Eb6()) return !1;
    if (A.length < 1) return !0;
    let Y = A.map(L5),
        z = L8(K) || lL3(K) || rL3();
    try {
        let _ = z.permissions || {},
            w = _[q] || [],
            O = new Set(w.map((J) => L5(CH(J)))),
            $ = Y.filter((J) => !O.has(J));
        if ($.length === 0) return !0;
        let H = {
                ...z,
                permissions: {
                    ..._,
                    [q]: [...w, ...$]
                }
            },
            j = TA(K, H);
        if (j.error) throw j.error;
        return !0
    } catch (_) {
        return _6(_), !1
    }
}
// @from(Ln 131685, Col 4)
cL3
// @from(Ln 131685, Col 9)
nL3
// @from(Ln 131686, Col 4)
Km = E(() => {
    k1();
    SP();
    O2();
    i8();
    SA();
    Z7();
    K_();
    cL3 = ["allow", "deny", "ask"];
    nL3 = ["userSettings", "projectSettings", "localSettings"]
})
// @from(Ln 131701, Col 0)
function ya(A) {
    if (!A) return [];
    return A.flatMap((q) => {
        switch (q.type) {
            case "addRules":
                return q.rules;
            default:
                return []
        }
    })
}
// @from(Ln 131713, Col 0)
function Ez(A, q) {
    switch (q.type) {
        case "setMode":
            return k(`Applying permission update: Setting mode to '${q.mode}'`), {
                ...A,
                mode: q.mode
            };
        case "addRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Applying permission update: Adding ${q.rules.length} ${q.behavior} rule(s) to destination '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: [...A[Y][q.destination] || [], ...K]
                }
            }
        }
        case "replaceRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Replacing all ${q.behavior} rules for destination '${q.destination}' with ${q.rules.length} rule(s): ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: K
                }
            }
        }
        case "addDirectories": {
            k(`Applying permission update: Adding ${q.directories.length} director${q.directories.length===1?"y":"ies"} with destination '${q.destination}': ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.set(Y, {
                path: Y,
                source: q.destination
            });
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        case "removeRules": {
            let K = q.rules.map((O) => L5(O));
            k(`Applying permission update: Removing ${q.rules.length} ${q.behavior} rule(s) from source '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
                z = A[Y][q.destination] || [],
                _ = new Set(K),
                w = z.filter((O) => !_.has(O));
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: w
                }
            }
        }
        case "removeDirectories": {
            k(`Applying permission update: Removing ${q.directories.length} director${q.directories.length===1?"y":"ies"}: ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.delete(Y);
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        default:
            return A
    }
}
// @from(Ln 131785, Col 0)
function _v(A, q) {
    let K = A;
    for (let Y of q) K = Ez(K, Y);
    return K
}
// @from(Ln 131791, Col 0)
function i_8(A) {
    return A === "localSettings" || A === "userSettings" || A === "projectSettings"
}
// @from(Ln 131795, Col 0)
function Ym(A) {
    if (!i_8(A.destination)) return;
    switch (k(`Persisting permission update: ${A.type} to source '${A.destination}'`), A.type) {
        case "addRules": {
            k(`Persisting ${A.rules.length} ${A.behavior} rule(s) to ${A.destination}`), JX7({
                ruleValues: A.rules,
                ruleBehavior: A.behavior
            }, A.destination);
            break
        }
        case "addDirectories": {
            k(`Persisting ${A.directories.length} director${A.directories.length===1?"y":"ies"} to ${A.destination}`);
            let K = L8(A.destination)?.permissions?.additionalDirectories || [],
                Y = A.directories.filter((z) => !K.includes(z));
            if (Y.length > 0) {
                let z = [...K, ...Y];
                TA(A.destination, {
                    permissions: {
                        additionalDirectories: z
                    }
                })
            }
            break
        }
        case "removeRules": {
            k(`Removing ${A.rules.length} ${A.behavior} rule(s) from ${A.destination}`);
            let Y = (L8(A.destination)?.permissions || {})[A.behavior] || [],
                z = new Set(A.rules.map(L5)),
                _ = Y.filter((w) => {
                    let O = L5(CH(w));
                    return !z.has(O)
                });
            TA(A.destination, {
                permissions: {
                    [A.behavior]: _
                }
            });
            break
        }
        case "removeDirectories": {
            k(`Removing ${A.directories.length} director${A.directories.length===1?"y":"ies"} from ${A.destination}`);
            let K = L8(A.destination)?.permissions?.additionalDirectories || [],
                Y = new Set(A.directories),
                z = K.filter((_) => !Y.has(_));
            TA(A.destination, {
                permissions: {
                    additionalDirectories: z
                }
            });
            break
        }
        case "setMode": {
            k(`Persisting mode '${A.mode}' to ${A.destination}`), TA(A.destination, {
                permissions: {
                    defaultMode: A.mode
                }
            });
            break
        }
        case "replaceRules": {
            k(`Replacing all ${A.behavior} rules in ${A.destination} with ${A.rules.length} rule(s)`);
            let q = A.rules.map(L5);
            TA(A.destination, {
                permissions: {
                    [A.behavior]: q
                }
            });
            break
        }
    }
}
// @from(Ln 131867, Col 0)
function NC(A) {
    for (let q of A) Ym(q)
}
// @from(Ln 131871, Col 0)
function ez1(A, q = "session") {
    let K = MX7(A);
    if (K === "/") return;
    return {
        type: "addRules",
        rules: [{
            toolName: "Read",
            ruleContent: oL3.isAbsolute(K) ? `/${K}/**` : `${K}/**`
        }],
        behavior: "allow",
        destination: q
    }
}
// @from(Ln 131884, Col 4)
F$ = E(() => {
    SP();
    H1();
    i8();
    Km();
    RY();
    g1()
})
// @from(Ln 131893, Col 0)
function i7(A, q, K, Y, z) {
    if (Y === "m") throw TypeError("Private method is not writable");
    if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
    if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
    return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
}
// @from(Ln 131900, Col 0)
function G8(A, q, K, Y) {
    if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
    if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
    return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
}
// @from(Ln 131905, Col 4)
zU = () => {}
// @from(Ln 131906, Col 4)
n_8 = function() {
    let {
        crypto: A
    } = globalThis;
    if (A?.randomUUID) return n_8 = A.randomUUID.bind(A), A.randomUUID();
    let q = new Uint8Array(1),
        K = A ? () => A.getRandomValues(q)[0] : () => Math.random() * 255 & 255;
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (Y) => (+Y ^ K() & 15 >> +Y / 4).toString(16))
}
// @from(Ln 131916, Col 0)
function _U(A) {
    return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 131919, Col 4)
yb6 = (A) => {
    if (A instanceof Error) return A;
    if (typeof A === "object" && A !== null) {
        try {
            if (Object.prototype.toString.call(A) === "[object Error]") {
                let q = Error(A.message, A.cause ? {
                    cause: A.cause
                } : {});
                if (A.stack) q.stack = A.stack;
                if (A.cause && !q.cause) q.cause = A.cause;
                if (A.name) q.name = A.name;
                return q
            }
        } catch {}
        try {
            return Error(JSON.stringify(A))
        } catch {}
    }
    return Error(A)
}
// @from(Ln 131939, Col 4)
n7
// @from(Ln 131939, Col 8)
a7
// @from(Ln 131939, Col 12)
Az
// @from(Ln 131939, Col 16)
mW
// @from(Ln 131939, Col 20)
zm
// @from(Ln 131939, Col 24)
Lb6
// @from(Ln 131939, Col 29)
yq6
// @from(Ln 131939, Col 34)
Rb6
// @from(Ln 131939, Col 39)
Lq6
// @from(Ln 131939, Col 44)
hb6
// @from(Ln 131939, Col 49)
Sb6
// @from(Ln 131939, Col 54)
Cb6
// @from(Ln 131939, Col 59)
Ib6
// @from(Ln 131940, Col 4)
BW = E(() => {
    n7 = class n7 extends Error {};
    a7 = class a7 extends n7 {
        constructor(A, q, K, Y) {
            super(`${a7.makeMessage(A,q,K)}`);
            this.status = A, this.headers = Y, this.requestID = Y?.get("request-id"), this.error = q
        }
        static makeMessage(A, q, K) {
            let Y = q?.message ? typeof q.message === "string" ? q.message : JSON.stringify(q.message) : q ? JSON.stringify(q) : K;
            if (A && Y) return `${A} ${Y}`;
            if (A) return `${A} status code (no body)`;
            if (Y) return Y;
            return "(no status code or body)"
        }
        static generate(A, q, K, Y) {
            if (!A || !Y) return new mW({
                message: K,
                cause: yb6(q)
            });
            let z = q;
            if (A === 400) return new Lb6(A, z, K, Y);
            if (A === 401) return new yq6(A, z, K, Y);
            if (A === 403) return new Rb6(A, z, K, Y);
            if (A === 404) return new Lq6(A, z, K, Y);
            if (A === 409) return new hb6(A, z, K, Y);
            if (A === 422) return new Sb6(A, z, K, Y);
            if (A === 429) return new Cb6(A, z, K, Y);
            if (A >= 500) return new Ib6(A, z, K, Y);
            return new a7(A, z, K, Y)
        }
    };
    Az = class Az extends a7 {
        constructor({
            message: A
        } = {}) {
            super(void 0, void 0, A || "Request was aborted.", void 0)
        }
    };
    mW = class mW extends a7 {
        constructor({
            message: A,
            cause: q
        }) {
            super(void 0, void 0, A || "Connection error.", void 0);
            if (q) this.cause = q
        }
    };
    zm = class zm extends mW {
        constructor({
            message: A
        } = {}) {
            super({
                message: A ?? "Request timed out."
            })
        }
    };
    Lb6 = class Lb6 extends a7 {};
    yq6 = class yq6 extends a7 {};
    Rb6 = class Rb6 extends a7 {};
    Lq6 = class Lq6 extends a7 {};
    hb6 = class hb6 extends a7 {};
    Sb6 = class Sb6 extends a7 {};
    Cb6 = class Cb6 extends a7 {};
    Ib6 = class Ib6 extends a7 {}
})
// @from(Ln 132006, Col 0)
function A_1(A) {
    if (typeof A !== "object") return {};
    return A ?? {}
}
// @from(Ln 132011, Col 0)
function XX7(A) {
    if (!A) return !0;
    for (let q in A) return !1;
    return !0
}
// @from(Ln 132017, Col 0)
function PX7(A, q) {
    return Object.prototype.hasOwnProperty.call(A, q)
}
// @from(Ln 132020, Col 4)
sL3
// @from(Ln 132020, Col 9)
DX7 = (A) => {
        return sL3.test(A)
    }
// @from(Ln 132023, Col 4)
r_8 = (A) => (r_8 = Array.isArray, r_8(A))
// @from(Ln 132024, Col 4)
o_8
// @from(Ln 132024, Col 9)
WX7 = (A, q) => {
        if (typeof q !== "number" || !Number.isInteger(q)) throw new n7(`${A} must be an integer`);
        if (q < 0) throw new n7(`${A} must be a positive integer`);
        return q
    }
// @from(Ln 132029, Col 4)
q_1 = (A) => {
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }
// @from(Ln 132036, Col 4)
Rq6 = E(() => {
    BW();
    sL3 = /^[a-z][a-z0-9+.-]*:/i, o_8 = r_8
})
// @from(Ln 132040, Col 4)
ZX7 = (A) => new Promise((q) => setTimeout(q, A))
// @from(Ln 132041, Col 4)
La = "0.74.0"
// @from(Ln 132043, Col 0)
function tL3() {
    if (typeof Deno < "u" && Deno.build != null) return "deno";
    if (typeof EdgeRuntime < "u") return "edge";
    if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]") return "node";
    return "unknown"
}
// @from(Ln 132050, Col 0)
function AR3() {
    if (typeof navigator > "u" || !navigator) return null;
    let A = [{
        key: "edge",
        pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "ie",
        pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "ie",
        pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "chrome",
        pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "firefox",
        pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "safari",
        pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
    }];
    for (let {
            key: q,
            pattern: K
        }
        of A) {
        let Y = K.exec(navigator.userAgent);
        if (Y) {
            let z = Y[1] || 0,
                _ = Y[2] || 0,
                w = Y[3] || 0;
            return {
                browser: q,
                version: `${z}.${_}.${w}`
            }
        }
    }
    return null
}
// @from(Ln 132089, Col 4)
vX7 = () => {
        return typeof window < "u" && typeof window.document < "u" && typeof navigator < "u"
    }
// @from(Ln 132092, Col 4)
eL3 = () => {
        let A = tL3();
        if (A === "deno") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": La,
            "X-Stainless-OS": fX7(Deno.build.os),
            "X-Stainless-Arch": GX7(Deno.build.arch),
            "X-Stainless-Runtime": "deno",
            "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
        if (typeof EdgeRuntime < "u") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": La,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": `other:${EdgeRuntime}`,
            "X-Stainless-Runtime": "edge",
            "X-Stainless-Runtime-Version": globalThis.process.version
        };
        if (A === "node") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": La,
            "X-Stainless-OS": fX7(globalThis.process.platform ?? "unknown"),
            "X-Stainless-Arch": GX7(globalThis.process.arch ?? "unknown"),
            "X-Stainless-Runtime": "node",
            "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
        };
        let q = AR3();
        if (q) return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": La,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": `browser:${q.browser}`,
            "X-Stainless-Runtime-Version": q.version
        };
        return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": La,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": "unknown",
            "X-Stainless-Runtime-Version": "unknown"
        }
    }
// @from(Ln 132136, Col 4)
GX7 = (A) => {
        if (A === "x32") return "x32";
        if (A === "x86_64" || A === "x64") return "x64";
        if (A === "arm") return "arm";
        if (A === "aarch64" || A === "arm64") return "arm64";
        if (A) return `other:${A}`;
        return "unknown"
    }
// @from(Ln 132144, Col 4)
fX7 = (A) => {
        if (A = A.toLowerCase(), A.includes("ios")) return "iOS";
        if (A === "android") return "Android";
        if (A === "darwin") return "MacOS";
        if (A === "win32") return "Windows";
        if (A === "freebsd") return "FreeBSD";
        if (A === "openbsd") return "OpenBSD";
        if (A === "linux") return "Linux";
        if (A) return `Other:${A}`;
        return "Unknown"
    }
// @from(Ln 132155, Col 4)
TX7
// @from(Ln 132155, Col 9)
NX7 = () => {
        return TX7 ?? (TX7 = eL3())
    }
// @from(Ln 132158, Col 4)
a_8 = () => {}
// @from(Ln 132160, Col 0)
function VX7() {
    if (typeof fetch < "u") return fetch;
    throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")
}
// @from(Ln 132165, Col 0)
function s_8(...A) {
    let q = globalThis.ReadableStream;
    if (typeof q > "u") throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
    return new q(...A)
}
// @from(Ln 132171, Col 0)
function K_1(A) {
    let q = Symbol.asyncIterator in A ? A[Symbol.asyncIterator]() : A[Symbol.iterator]();
    return s_8({
        start() {},
        async pull(K) {
            let {
                done: Y,
                value: z
            } = await q.next();
            if (Y) K.close();
            else K.enqueue(z)
        },
        async cancel() {
            await q.return?.()
        }
    })
}
// @from(Ln 132189, Col 0)
function bb6(A) {
    if (A[Symbol.asyncIterator]) return A;
    let q = A.getReader();
    return {
        async next() {
            try {
                let K = await q.read();
                if (K?.done) q.releaseLock();
                return K
            } catch (K) {
                throw q.releaseLock(), K
            }
        },
        async return () {
            let K = q.cancel();
            return q.releaseLock(), await K, {
                done: !0,
                value: void 0
            }
        },
        [Symbol.asyncIterator]() {
            return this
        }
    }
}
// @from(Ln 132214, Col 0)
async function kX7(A) {
    if (A === null || typeof A !== "object") return;
    if (A[Symbol.asyncIterator]) {
        await A[Symbol.asyncIterator]().return?.();
        return
    }
    let q = A.getReader(),
        K = q.cancel();
    q.releaseLock(), await K
}
// @from(Ln 132224, Col 4)
EX7 = ({
    headers: A,
    body: q
}) => {
    return {
        bodyHeaders: {
            "content-type": "application/json"
        },
        body: JSON.stringify(q)
    }
}
// @from(Ln 132236, Col 0)
function RX7(A) {
    let q = 0;
    for (let z of A) q += z.length;
    let K = new Uint8Array(q),
        Y = 0;
    for (let z of A) K.set(z, Y), Y += z.length;
    return K
}
// @from(Ln 132245, Col 0)
function xb6(A) {
    let q;
    return (yX7 ?? (q = new globalThis.TextEncoder, yX7 = q.encode.bind(q)))(A)
}
// @from(Ln 132250, Col 0)
function t_8(A) {
    let q;
    return (LX7 ?? (q = new globalThis.TextDecoder, LX7 = q.decode.bind(q)))(A)
}
// @from(Ln 132254, Col 4)
yX7
// @from(Ln 132254, Col 9)
LX7
// @from(Ln 132255, Col 0)
class Ra {
    constructor() {
        eV.set(this, void 0), Ak.set(this, void 0), i7(this, eV, new Uint8Array, "f"), i7(this, Ak, null, "f")
    }
    decode(A) {
        if (A == null) return [];
        let q = A instanceof ArrayBuffer ? new Uint8Array(A) : typeof A === "string" ? xb6(A) : A;
        i7(this, eV, RX7([G8(this, eV, "f"), q]), "f");
        let K = [],
            Y;
        while ((Y = YR3(G8(this, eV, "f"), G8(this, Ak, "f"))) != null) {
            if (Y.carriage && G8(this, Ak, "f") == null) {
                i7(this, Ak, Y.index, "f");
                continue
            }
            if (G8(this, Ak, "f") != null && (Y.index !== G8(this, Ak, "f") + 1 || Y.carriage)) {
                K.push(t_8(G8(this, eV, "f").subarray(0, G8(this, Ak, "f") - 1))), i7(this, eV, G8(this, eV, "f").subarray(G8(this, Ak, "f")), "f"), i7(this, Ak, null, "f");
                continue
            }
            let z = G8(this, Ak, "f") !== null ? Y.preceding - 1 : Y.preceding,
                _ = t_8(G8(this, eV, "f").subarray(0, z));
            K.push(_), i7(this, eV, G8(this, eV, "f").subarray(Y.index), "f"), i7(this, Ak, null, "f")
        }
        return K
    }
    flush() {
        if (!G8(this, eV, "f").length) return [];
        return this.decode(`
`)
    }
}
// @from(Ln 132287, Col 0)
function YR3(A, q) {
    for (let z = q ?? 0; z < A.length; z++) {
        if (A[z] === 10) return {
            preceding: z,
            index: z + 1,
            carriage: !1
        };
        if (A[z] === 13) return {
            preceding: z,
            index: z + 1,
            carriage: !0
        }
    }
    return null
}
// @from(Ln 132303, Col 0)
function hX7(A) {
    for (let Y = 0; Y < A.length - 1; Y++) {
        if (A[Y] === 10 && A[Y + 1] === 10) return Y + 2;
        if (A[Y] === 13 && A[Y + 1] === 13) return Y + 2;
        if (A[Y] === 13 && A[Y + 1] === 10 && Y + 3 < A.length && A[Y + 2] === 13 && A[Y + 3] === 10) return Y + 4
    }
    return -1
}
// @from(Ln 132311, Col 4)
eV
// @from(Ln 132311, Col 8)
Ak
// @from(Ln 132312, Col 4)
e_8 = E(() => {
    zU();
    eV = new WeakMap, Ak = new WeakMap;
    Ra.NEWLINE_CHARS = new Set([`
`, "\r"]);
    Ra.NEWLINE_REGEXP = /\r\n|[\n\r]/g
})
// @from(Ln 132320, Col 0)
function ub6() {}
// @from(Ln 132322, Col 0)
function Y_1(A, q, K) {
    if (!q || z_1[A] > z_1[K]) return ub6;
    else return q[A].bind(q)
}
// @from(Ln 132327, Col 0)
function KX(A) {
    let q = A.logger,
        K = A.logLevel ?? "off";
    if (!q) return zR3;
    let Y = SX7.get(q);
    if (Y && Y[0] === K) return Y[1];
    let z = {
        error: Y_1("error", q, K),
        warn: Y_1("warn", q, K),
        info: Y_1("info", q, K),
        debug: Y_1("debug", q, K)
    };
    return SX7.set(q, [K, z]), z
}
// @from(Ln 132341, Col 4)
z_1
// @from(Ln 132341, Col 9)
A28 = (A, q, K) => {
        if (!A) return;
        if (PX7(z_1, A)) return A;
        KX(K).warn(`${q} was set to ${JSON.stringify(A)}, expected one of ${JSON.stringify(Object.keys(z_1))}`);
        return
    }
// @from(Ln 132347, Col 4)
zR3
// @from(Ln 132347, Col 9)
SX7
// @from(Ln 132347, Col 14)
wU = (A) => {
        if (A.options) A.options = {
            ...A.options
        }, delete A.options.headers;
        if (A.headers) A.headers = Object.fromEntries((A.headers instanceof Headers ? [...A.headers] : Object.entries(A.headers)).map(([q, K]) => [q, q.toLowerCase() === "x-api-key" || q.toLowerCase() === "authorization" || q.toLowerCase() === "cookie" || q.toLowerCase() === "set-cookie" ? "***" : K]));
        if ("retryOfRequestLogID" in A) {
            if (A.retryOfRequestLogID) A.retryOf = A.retryOfRequestLogID;
            delete A.retryOfRequestLogID
        }
        return A
    }
// @from(Ln 132358, Col 4)
__1 = E(() => {
    Rq6();
    z_1 = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    zR3 = {
        error: ub6,
        warn: ub6,
        info: ub6,
        debug: ub6
    }, SX7 = new WeakMap
})
// @from(Ln 132374, Col 0)
async function* _R3(A, q) {
    if (!A.body) {
        if (q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new n7("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new n7("Attempted to iterate over a response with no body")
    }
    let K = new CX7,
        Y = new Ra,
        z = bb6(A.body);
    for await (let _ of wR3(z)) for (let w of Y.decode(_)) {
        let O = K.decode(w);
        if (O) yield O
    }
    for (let _ of Y.flush()) {
        let w = K.decode(_);
        if (w) yield w
    }
}
// @from(Ln 132391, Col 0)
async function* wR3(A) {
    let q = new Uint8Array;
    for await (let K of A) {
        if (K == null) continue;
        let Y = K instanceof ArrayBuffer ? new Uint8Array(K) : typeof K === "string" ? xb6(K) : K,
            z = new Uint8Array(q.length + Y.length);
        z.set(q), z.set(Y, q.length), q = z;
        let _;
        while ((_ = hX7(q)) !== -1) yield q.slice(0, _), q = q.slice(_)
    }
    if (q.length > 0) yield q
}
// @from(Ln 132403, Col 0)
class CX7 {
    constructor() {
        this.event = null, this.data = [], this.chunks = []
    }
    decode(A) {
        if (A.endsWith("\r")) A = A.substring(0, A.length - 1);
        if (!A) {
            if (!this.event && !this.data.length) return null;
            let z = {
                event: this.event,
                data: this.data.join(`
`),
                raw: this.chunks
            };
            return this.event = null, this.data = [], this.chunks = [], z
        }
        if (this.chunks.push(A), A.startsWith(":")) return null;
        let [q, K, Y] = OR3(A, ":");
        if (Y.startsWith(" ")) Y = Y.substring(1);
        if (q === "event") this.event = Y;
        else if (q === "data") this.data.push(Y);
        return null
    }
}
// @from(Ln 132428, Col 0)
function OR3(A, q) {
    let K = A.indexOf(q);
    if (K !== -1) return [A.substring(0, K), q, A.substring(K + q.length)];
    return [A, "", ""]
}
// @from(Ln 132433, Col 4)
mb6
// @from(Ln 132433, Col 9)
gG
// @from(Ln 132434, Col 4)
q28 = E(() => {
    zU();
    BW();
    e_8();
    Rq6();
    __1();
    BW();
    gG = class gG {
        constructor(A, q, K) {
            this.iterator = A, mb6.set(this, void 0), this.controller = q, i7(this, mb6, K, "f")
        }
        static fromSSEResponse(A, q, K) {
            let Y = !1,
                z = K ? KX(K) : console;
            async function* _() {
                if (Y) throw new n7("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let w = !1;
                try {
                    for await (let O of _R3(A, q)) {
                        if (O.event === "completion") try {
                            yield JSON.parse(O.data)
                        } catch ($) {
                            throw z.error("Could not parse message into JSON:", O.data), z.error("From chunk:", O.raw), $
                        }
                        if (O.event === "message_start" || O.event === "message_delta" || O.event === "message_stop" || O.event === "content_block_start" || O.event === "content_block_delta" || O.event === "content_block_stop") try {
                            yield JSON.parse(O.data)
                        } catch ($) {
                            throw z.error("Could not parse message into JSON:", O.data), z.error("From chunk:", O.raw), $
                        }
                        if (O.event === "ping") continue;
                        if (O.event === "error") throw new a7(void 0, q_1(O.data) ?? O.data, void 0, A.headers)
                    }
                    w = !0
                } catch (O) {
                    if (_U(O)) return;
                    throw O
                } finally {
                    if (!w) q.abort()
                }
            }
            return new gG(_, q, K)
        }
        static fromReadableStream(A, q, K) {
            let Y = !1;
            async function* z() {
                let w = new Ra,
                    O = bb6(A);
                for await (let $ of O) for (let H of w.decode($)) yield H;
                for (let $ of w.flush()) yield $
            }
            async function* _() {
                if (Y) throw new n7("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let w = !1;
                try {
                    for await (let O of z()) {
                        if (w) continue;
                        if (O) yield JSON.parse(O)
                    }
                    w = !0
                } catch (O) {
                    if (_U(O)) return;
                    throw O
                } finally {
                    if (!w) q.abort()
                }
            }
            return new gG(_, q, K)
        } [(mb6 = new WeakMap, Symbol.asyncIterator)]() {
            return this.iterator()
        }
        tee() {
            let A = [],
                q = [],
                K = this.iterator(),
                Y = (z) => {
                    return {
                        next: () => {
                            if (z.length === 0) {
                                let _ = K.next();
                                A.push(_), q.push(_)
                            }
                            return z.shift()
                        }
                    }
                };
            return [new gG(() => Y(A), this.controller, G8(this, mb6, "f")), new gG(() => Y(q), this.controller, G8(this, mb6, "f"))]
        }
        toReadableStream() {
            let A = this,
                q;
            return s_8({
                async start() {
                    q = A[Symbol.asyncIterator]()
                },
                async pull(K) {
                    try {
                        let {
                            value: Y,
                            done: z
                        } = await q.next();
                        if (z) return K.close();
                        let _ = xb6(JSON.stringify(Y) + `
`);
                        K.enqueue(_)
                    } catch (Y) {
                        K.error(Y)
                    }
                },
                async cancel() {
                    await q.return?.()
                }
            })
        }
    }
})
// @from(Ln 132551, Col 0)
async function w_1(A, q) {
    let {
        response: K,
        requestLogID: Y,
        retryOfRequestLogID: z,
        startTime: _
    } = q, w = await (async () => {
        if (q.options.stream) {
            if (KX(A).debug("response", K.status, K.url, K.headers, K.body), q.options.__streamClass) return q.options.__streamClass.fromSSEResponse(K, q.controller);
            return gG.fromSSEResponse(K, q.controller)
        }
        if (K.status === 204) return null;
        if (q.options.__binaryResponse) return K;
        let $ = K.headers.get("content-type")?.split(";")[0]?.trim();
        if ($?.includes("application/json") || $?.endsWith("+json")) {
            if (K.headers.get("content-length") === "0") return;
            let M = await K.json();
            return K28(M, K)
        }
        return await K.text()
    })();
    return KX(A).debug(`[${Y}] response parsed`, wU({
        retryOfRequestLogID: z,
        url: K.url,
        status: K.status,
        body: w,
        durationMs: Date.now() - _
    })), w
}
// @from(Ln 132581, Col 0)
function K28(A, q) {
    if (!A || typeof A !== "object" || Array.isArray(A)) return A;
    return Object.defineProperty(A, "_request_id", {
        value: q.headers.get("request-id"),
        enumerable: !1
    })
}
// @from(Ln 132588, Col 4)
Y28 = E(() => {
    q28();
    __1()
})
// @from(Ln 132592, Col 4)
Bb6
// @from(Ln 132592, Col 9)
hq6
// @from(Ln 132593, Col 4)
O_1 = E(() => {
    zU();
    Y28();
    hq6 = class hq6 extends Promise {
        constructor(A, q, K = w_1) {
            super((Y) => {
                Y(null)
            });
            this.responsePromise = q, this.parseResponse = K, Bb6.set(this, void 0), i7(this, Bb6, A, "f")
        }
        _thenUnwrap(A) {
            return new hq6(G8(this, Bb6, "f"), this.responsePromise, async (q, K) => K28(A(await this.parseResponse(q, K), K), K.response))
        }
        asResponse() {
            return this.responsePromise.then((A) => A.response)
        }
        async withResponse() {
            let [A, q] = await Promise.all([this.parse(), this.asResponse()]);
            return {
                data: A,
                response: q,
                request_id: q.headers.get("request-id")
            }
        }
        parse() {
            if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((A) => this.parseResponse(G8(this, Bb6, "f"), A));
            return this.parsedPromise
        }
        then(A, q) {
            return this.parse().then(A, q)
        } catch (A) {
            return this.parse().catch(A)
        } finally(A) {
            return this.parse().finally(A)
        }
    };
    Bb6 = new WeakMap
})
// @from(Ln 132631, Col 4)
$_1
// @from(Ln 132631, Col 9)
z28
// @from(Ln 132631, Col 14)
H_1
// @from(Ln 132631, Col 19)
VC
// @from(Ln 132631, Col 23)
gb6
// @from(Ln 132632, Col 4)
_m = E(() => {
    zU();
    BW();
    Y28();
    O_1();
    Rq6();
    z28 = class z28 {
        constructor(A, q, K, Y) {
            $_1.set(this, void 0), i7(this, $_1, A, "f"), this.options = Y, this.response = q, this.body = K
        }
        hasNextPage() {
            if (!this.getPaginatedItems().length) return !1;
            return this.nextPageRequestOptions() != null
        }
        async getNextPage() {
            let A = this.nextPageRequestOptions();
            if (!A) throw new n7("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
            return await G8(this, $_1, "f").requestAPIList(this.constructor, A)
        }
        async * iterPages() {
            let A = this;
            yield A;
            while (A.hasNextPage()) A = await A.getNextPage(), yield A
        }
        async * [($_1 = new WeakMap, Symbol.asyncIterator)]() {
            for await (let A of this.iterPages()) for (let q of A.getPaginatedItems()) yield q
        }
    };
    H_1 = class H_1 extends hq6 {
        constructor(A, q, K) {
            super(A, q, async (Y, z) => new K(Y, z.response, await w_1(Y, z), z.options))
        }
        async * [Symbol.asyncIterator]() {
            let A = await this;
            for await (let q of A) yield q
        }
    };
    VC = class VC extends z28 {
        constructor(A, q, K, Y) {
            super(A, q, K, Y);
            this.data = K.data || [], this.has_more = K.has_more || !1, this.first_id = K.first_id || null, this.last_id = K.last_id || null
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
                let q = this.first_id;
                if (!q) return null;
                return {
                    ...this.options,
                    query: {
                        ...A_1(this.options.query),
                        before_id: q
                    }
                }
            }
            let A = this.last_id;
            if (!A) return null;
            return {
                ...this.options,
                query: {
                    ...A_1(this.options.query),
                    after_id: A
                }
            }
        }
    };
    gb6 = class gb6 extends z28 {
        constructor(A, q, K, Y) {
            super(A, q, K, Y);
            this.data = K.data || [], this.has_more = K.has_more || !1, this.next_page = K.next_page || null
        }
        getPaginatedItems() {
            return this.data ?? []
        }
        hasNextPage() {
            if (this.has_more === !1) return !1;
            return super.hasNextPage()
        }
        nextPageRequestOptions() {
            let A = this.next_page;
            if (!A) return null;
            return {
                ...this.options,
                query: {
                    ...A_1(this.options.query),
                    page: A
                }
            }
        }
    }
})
// @from(Ln 132730, Col 0)
function Sq6(A, q, K) {
    return w28(), new File(A, q ?? "unknown_file", K)
}
// @from(Ln 132734, Col 0)
function Fb6(A, q) {
    let K = typeof A === "object" && A !== null && (("name" in A) && A.name && String(A.name) || ("url" in A) && A.url && String(A.url) || ("filename" in A) && A.filename && String(A.filename) || ("path" in A) && A.path && String(A.path)) || "";
    return q ? K.split(/[\\/]/).pop() || void 0 : K
}
// @from(Ln 132739, Col 0)
function HR3(A) {
    let q = typeof A === "function" ? A : A.fetch,
        K = IX7.get(q);
    if (K) return K;
    let Y = (async () => {
        try {
            let z = "Response" in q ? q.Response : (await q("data:,")).constructor,
                _ = new FormData;
            if (_.toString() === await new z(_).text()) return !1;
            return !0
        } catch {
            return !0
        }
    })();
    return IX7.set(q, Y), Y
}
// @from(Ln 132755, Col 4)
w28 = () => {
        if (typeof File > "u") {
            let {
                process: A
            } = globalThis, q = typeof A?.versions?.node === "string" && parseInt(A.versions.node.split(".")) < 20;
            throw Error("`File` is not defined as a global, which is required for file uploads." + (q ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""))
        }
    }
// @from(Ln 132763, Col 4)
O28 = (A) => A != null && typeof A === "object" && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 132764, Col 4)
BM6 = async (A, q, K = !0) => {
        return {
            ...A,
            body: await jR3(A.body, q, K)
        }
    }
// @from(Ln 132769, Col 7)
IX7
// @from(Ln 132769, Col 12)
jR3 = async (A, q, K = !0) => {
        if (!await HR3(q)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
        let Y = new FormData;
        return await Promise.all(Object.entries(A || {}).map(([z, _]) => _28(Y, z, _, K))), Y
    }
// @from(Ln 132773, Col 7)
JR3 = (A) => A instanceof Blob && ("name" in A)
// @from(Ln 132773, Col 56)
_28 = async (A, q, K, Y) => {
        if (K === void 0) return;
        if (K == null) throw TypeError(`Received null for "${q}"; to pass null in FormData, you must use the string 'null'`);
        if (typeof K === "string" || typeof K === "number" || typeof K === "boolean") A.append(q, String(K));
        else if (K instanceof Response) {
            let z = {},
                _ = K.headers.get("Content-Type");
            if (_) z = {
                type: _
            };
            A.append(q, Sq6([await K.blob()], Fb6(K, Y), z))
        } else if (O28(K)) A.append(q, Sq6([await new Response(K_1(K)).blob()], Fb6(K, Y)));
        else if (JR3(K)) A.append(q, Sq6([K], Fb6(K, Y), {
            type: K.type
        }));
        else if (Array.isArray(K)) await Promise.all(K.map((z) => _28(A, q + "[]", z, Y)));
        else if (typeof K === "object") await Promise.all(Object.entries(K).map(([z, _]) => _28(A, `${q}[${z}]`, _, Y)));
        else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${K} instead`)
    }
// @from(Ln 132792, Col 4)
gM6 = E(() => {
    IX7 = new WeakMap
})
// @from(Ln 132795, Col 0)
async function j_1(A, q, K) {
    if (w28(), A = await A, q || (q = Fb6(A, !0)), MR3(A)) {
        if (A instanceof File && q == null && K == null) return A;
        return Sq6([await A.arrayBuffer()], q ?? A.name, {
            type: A.type,
            lastModified: A.lastModified,
            ...K
        })
    }
    if (DR3(A)) {
        let z = await A.blob();
        return q || (q = new URL(A.url).pathname.split(/[\\/]/).pop()), Sq6(await $28(z), q, K)
    }
    let Y = await $28(A);
    if (!K?.type) {
        let z = Y.find((_) => typeof _ === "object" && ("type" in _) && _.type);
        if (typeof z === "string") K = {
            ...K,
            type: z
        }
    }
    return Sq6(Y, q, K)
}
// @from(Ln 132818, Col 0)
async function $28(A) {
    let q = [];
    if (typeof A === "string" || ArrayBuffer.isView(A) || A instanceof ArrayBuffer) q.push(A);
    else if (bX7(A)) q.push(A instanceof Blob ? A : await A.arrayBuffer());
    else if (O28(A))
        for await (let K of A) q.push(...await $28(K));
    else {
        let K = A?.constructor?.name;
        throw Error(`Unexpected data type: ${typeof A}${K?`; constructor: ${K}`:""}${XR3(A)}`)
    }
    return q
}
// @from(Ln 132831, Col 0)
function XR3(A) {
    if (typeof A !== "object" || A === null) return "";
    return `; props: [${Object.getOwnPropertyNames(A).map((K)=>`"${K}"`).join(", ")}]`
}
// @from(Ln 132835, Col 4)
bX7 = (A) => A != null && typeof A === "object" && typeof A.size === "number" && typeof A.type === "string" && typeof A.text === "function" && typeof A.slice === "function" && typeof A.arrayBuffer === "function"
// @from(Ln 132836, Col 4)
MR3 = (A) => A != null && typeof A === "object" && typeof A.name === "string" && typeof A.lastModified === "number" && bX7(A)
// @from(Ln 132837, Col 4)
DR3 = (A) => A != null && typeof A === "object" && typeof A.url === "string" && typeof A.blob === "function"
// @from(Ln 132838, Col 4)
xX7 = E(() => {
    gM6();
    gM6()
})
// @from(Ln 132842, Col 4)
H28 = E(() => {
    xX7()
})
// @from(Ln 132845, Col 4)
uX7 = () => {}
// @from(Ln 132846, Col 0)
class p$ {
    constructor(A) {
        this._client = A
    }
}
// @from(Ln 132852, Col 0)
function* WR3(A) {
    if (!A) return;
    if (mX7 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let _ of z) yield [_, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (o_8(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let _ = o_8(Y[1]) ? Y[1] : [Y[1]],
            w = !1;
        for (let O of _) {
            if (O === void 0) continue;
            if (q && !w) w = !0, yield [z, null];
            yield [z, O]
        }
    }
}
// @from(Ln 132880, Col 4)
mX7
// @from(Ln 132880, Col 9)
oK = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [_, w] of WR3(Y)) {
            let O = _.toLowerCase();
            if (!z.has(O)) q.delete(_), z.add(O);
            if (w === null) q.delete(_), K.add(O);
            else q.append(_, w), K.delete(O)
        }
    }
    return {
        [mX7]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 132898, Col 4)
qk = E(() => {
    Rq6();
    mX7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 132903, Col 0)
function J_1(A) {
    return typeof A === "object" && A !== null && pb6 in A
}
// @from(Ln 132907, Col 0)
function j28(A, q) {
    let K = new Set;
    if (A) {
        for (let Y of A)
            if (J_1(Y)) K.add(Y[pb6])
    }
    if (q)
        for (let Y of q) {
            if (J_1(Y)) K.add(Y[pb6]);
            if (Array.isArray(Y.content)) {
                for (let z of Y.content)
                    if (J_1(z)) K.add(z[pb6])
            }
        }
    return Array.from(K)
}
// @from(Ln 132924, Col 0)
function M_1(A, q) {
    let K = j28(A, q);
    if (K.length === 0) return {};
    return {
        "x-stainless-helper": K.join(", ")
    }
}
// @from(Ln 132932, Col 0)
function BX7(A) {
    if (J_1(A)) return {
        "x-stainless-helper": A[pb6]
    };
    return {}
}
// @from(Ln 132938, Col 4)
pb6
// @from(Ln 132939, Col 4)
Qb6 = E(() => {
    pb6 = Symbol("anthropic.sdk.stainlessHelper")
})
// @from(Ln 132943, Col 0)
function FX7(A) {
    return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 132946, Col 4)
gX7
// @from(Ln 132946, Col 9)
ZR3 = (A = FX7) => function(K, ...Y) {
        if (K.length === 1) return K[0];
        let z = !1,
            _ = [],
            w = K.reduce((j, J, M) => {
                if (/[?#]/.test(J)) z = !0;
                let D = Y[M],
                    X = (z ? encodeURIComponent : A)("" + D);
                if (M !== Y.length && (D == null || typeof D === "object" && D.toString === Object.getPrototypeOf(Object.getPrototypeOf(D.hasOwnProperty ?? gX7) ?? gX7)?.toString)) X = D + "", _.push({
                    start: j.length + J.length,
                    length: X.length,
                    error: `Value of type ${Object.prototype.toString.call(D).slice(8,-1)} is not a valid path parameter`
                });
                return j + J + (M === Y.length ? "" : X)
            }, ""),
            O = w.split(/[?#]/, 1)[0],
            $ = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            H;
        while ((H = $.exec(O)) !== null) _.push({
            start: H.index,
            length: H[0].length,
            error: `Value "${H[0]}" can't be safely passed as a path parameter`
        });
        if (_.sort((j, J) => j.start - J.start), _.length > 0) {
            let j = 0,
                J = _.reduce((M, D) => {
                    let X = " ".repeat(D.start - j),
                        P = "^".repeat(D.length);
                    return j = D.start + D.length, M + X + P
                }, "");
            throw new n7(`Path parameters result in path with invalid segments:
${_.map((M)=>M.error).join(`
`)}
${w}
${J}`)
        }
        return w
    }
// @from(Ln 132984, Col 4)
oO
// @from(Ln 132985, Col 4)
ha = E(() => {
    BW();
    gX7 = Object.freeze(Object.create(null)), oO = ZR3(FX7)
})
// @from(Ln 132989, Col 4)
Ub6
// @from(Ln 132990, Col 4)
J28 = E(() => {
    _m();
    qk();
    Qb6();
    gM6();
    ha();
    Ub6 = class Ub6 extends p$ {
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/files", VC, {
                query: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "files-api-2025-04-14"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(oO`/v1/files/${A}`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "files-api-2025-04-14"].toString()
                }, K?.headers])
            })
        }
        download(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(oO`/v1/files/${A}/content`, {
                ...K,
                headers: oK([{
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
            return this._client.get(oO`/v1/files/${A}`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "files-api-2025-04-14"].toString()
                }, K?.headers])
            })
        }
        upload(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/files", BM6({
                body: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "files-api-2025-04-14"].toString()
                }, BX7(Y.file), q?.headers])
            }, this._client))
        }
    }
})
// @from(Ln 133060, Col 4)
db6
// @from(Ln 133061, Col 4)
M28 = E(() => {
    _m();
    qk();
    ha();
    db6 = class db6 extends p$ {
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(oO`/v1/models/${A}?beta=true`, {
                ...K,
                headers: oK([{
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
            return this._client.getAPIList("/v1/models?beta=true", VC, {
                query: Y,
                ...q,
                headers: oK([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers])
            })
        }
    }
})
// @from(Ln 133096, Col 4)
Sa = E(() => {
    BW()
})
// @from(Ln 133099, Col 4)
D_1
// @from(Ln 133100, Col 4)
D28 = E(() => {
    D_1 = {
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
// @from(Ln 133113, Col 0)
function pX7(A) {
    return A?.output_format ?? A?.output_config?.format
}
// @from(Ln 133117, Col 0)
function X28(A, q, K) {
    let Y = pX7(q);
    if (!q || !("parse" in (Y ?? {}))) return {
        ...A,
        content: A.content.map((z) => {
            if (z.type === "text") {
                let _ = Object.defineProperty({
                    ...z
                }, "parsed_output", {
                    value: null,
                    enumerable: !1
                });
                return Object.defineProperty(_, "parsed", {
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
    return P28(A, q, K)
}
// @from(Ln 133143, Col 0)
function P28(A, q, K) {
    let Y = null,
        z = A.content.map((_) => {
            if (_.type === "text") {
                let w = TR3(q, _.text);
                if (Y === null) Y = w;
                let O = Object.defineProperty({
                    ..._
                }, "parsed_output", {
                    value: w,
                    enumerable: !1
                });
                return Object.defineProperty(O, "parsed", {
                    get() {
                        return K.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), w
                    },
                    enumerable: !1
                })
            }
            return _
        });
    return {
        ...A,
        content: z,
        parsed_output: Y
    }
}
// @from(Ln 133171, Col 0)
function TR3(A, q) {
    let K = pX7(A);
    if (K?.type !== "json_schema") return null;
    try {
        if ("parse" in K) return K.parse(q);
        return JSON.parse(q)
    } catch (Y) {
        throw new n7(`Failed to parse structured output: ${Y}`)
    }
}
// @from(Ln 133181, Col 4)
W28 = E(() => {
    BW()
})
// @from(Ln 133184, Col 4)
vR3 = (A) => {
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
                let O = "",
                    $ = !1;
                Y = A[++q];
                while (Y !== '"') {
                    if (q === A.length) {
                        $ = !0;
                        break
                    }
                    if (Y === "\\") {
                        if (q++, q === A.length) {
                            $ = !0;
                            break
                        }
                        O += Y + A[q], Y = A[++q]
                    } else O += Y, Y = A[++q]
                }
                if (Y = A[++q], !$) K.push({
                    type: "string",
                    value: O
                });
                continue
            }
            if (Y && /\s/.test(Y)) {
                q++;
                continue
            }
            let _ = /[0-9]/;
            if (Y && _.test(Y) || Y === "-" || Y === ".") {
                let O = "";
                if (Y === "-") O += Y, Y = A[++q];
                while (Y && _.test(Y) || Y === ".") O += Y, Y = A[++q];
                K.push({
                    type: "number",
                    value: O
                });
                continue
            }
            let w = /[a-z]/i;
            if (Y && w.test(Y)) {
                let O = "";
                while (Y && w.test(Y)) {
                    if (q === A.length) break;
                    O += Y, Y = A[++q]
                }
                if (O == "true" || O == "false" || O === "null") K.push({
                    type: "name",
                    value: O
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
// @from(Ln 133294, Col 4)
FM6 = (A) => {
        if (A.length === 0) return A;
        let q = A[A.length - 1];
        switch (q.type) {
            case "separator":
                return A = A.slice(0, A.length - 1), FM6(A);
                break;
            case "number":
                let K = q.value[q.value.length - 1];
                if (K === "." || K === "-") return A = A.slice(0, A.length - 1), FM6(A);
            case "string":
                let Y = A[A.length - 2];
                if (Y?.type === "delimiter") return A = A.slice(0, A.length - 1), FM6(A);
                else if (Y?.type === "brace" && Y.value === "{") return A = A.slice(0, A.length - 1), FM6(A);
                break;
            case "delimiter":
                return A = A.slice(0, A.length - 1), FM6(A);
                break
        }
        return A
    }
// @from(Ln 133315, Col 4)
NR3 = (A) => {
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
// @from(Ln 133336, Col 4)
VR3 = (A) => {
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
// @from(Ln 133349, Col 4)
X_1 = (A) => JSON.parse(VR3(NR3(FM6(vR3(A)))))
// @from(Ln 133350, Col 4)
Z28 = () => {}
// @from(Ln 133351, Col 4)
P_1 = E(() => {
    q28()
})
// @from(Ln 133355, Col 0)
function cX7(A) {
    return A.type === "tool_use" || A.type === "server_tool_use" || A.type === "mcp_tool_use"
}
// @from(Ln 133359, Col 0)
function lX7(A) {}
// @from(Ln 133360, Col 4)
VL
// @from(Ln 133360, Col 8)
Ca
// @from(Ln 133360, Col 12)
pM6
// @from(Ln 133360, Col 17)
cb6
// @from(Ln 133360, Col 22)
W_1
// @from(Ln 133360, Col 27)
lb6
// @from(Ln 133360, Col 32)
ib6
// @from(Ln 133360, Col 37)
Z_1
// @from(Ln 133360, Col 42)
nb6