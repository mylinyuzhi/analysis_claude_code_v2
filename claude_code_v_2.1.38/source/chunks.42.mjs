
// @from(Ln 111351, Col 4)
d6A = R((d_5) => {
    var QR1 = b76();

    function iC(A) {
        switch (A) {
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
    var _r8 = new Set("0123456789ABCDEFabcdef"),
        U_5 = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
        u76 = new Set(",[]{}"),
        p_5 = new Set(` ,[]{}
\r	`),
        p6A = (A) => !A || p_5.has(A);
    class Jr8 {
        constructor() {
            this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0
        }* lex(A, q = !1) {
            if (A) {
                if (typeof A !== "string") throw TypeError("source is not a string");
                this.buffer = this.buffer ? this.buffer + A : A, this.lineEndPos = null
            }
            this.atEnd = !q;
            let K = this.next ?? "stream";
            while (K && (q || this.hasChars(1))) K = yield* this.parseNext(K)
        }
        atLineEnd() {
            let A = this.pos,
                q = this.buffer[A];
            while (q === " " || q === "\t") q = this.buffer[++A];
            if (!q || q === "#" || q === `
`) return !0;
            if (q === "\r") return this.buffer[A + 1] === `
`;
            return !1
        }
        charAt(A) {
            return this.buffer[this.pos + A]
        }
        continueScalar(A) {
            let q = this.buffer[A];
            if (this.indentNext > 0) {
                let K = 0;
                while (q === " ") q = this.buffer[++K + A];
                if (q === "\r") {
                    let Y = this.buffer[K + A + 1];
                    if (Y === `
` || !Y && !this.atEnd) return A + K + 1
                }
                return q === `
` || K >= this.indentNext || !q && !this.atEnd ? A + K : -1
            }
            if (q === "-" || q === ".") {
                let K = this.buffer.substr(A, 3);
                if ((K === "---" || K === "...") && iC(this.buffer[A + 3])) return -1
            }
            return A
        }
        getLine() {
            let A = this.lineEndPos;
            if (typeof A !== "number" || A !== -1 && A < this.pos) A = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = A;
            if (A === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
            if (this.buffer[A - 1] === "\r") A -= 1;
            return this.buffer.substring(this.pos, A)
        }
        hasChars(A) {
            return this.pos + A <= this.buffer.length
        }
        setNext(A) {
            return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = A, null
        }
        peek(A) {
            return this.buffer.substr(this.pos, A)
        }* parseNext(A) {
            switch (A) {
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
            let A = this.getLine();
            if (A === null) return this.setNext("stream");
            if (A[0] === QR1.BOM) yield* this.pushCount(1), A = A.substring(1);
            if (A[0] === "%") {
                let q = A.length,
                    K = A.indexOf("#");
                while (K !== -1) {
                    let z = A[K - 1];
                    if (z === " " || z === "\t") {
                        q = K - 1;
                        break
                    } else K = A.indexOf("#", K + 1)
                }
                while (!0) {
                    let z = A[q - 1];
                    if (z === " " || z === "\t") q -= 1;
                    else break
                }
                let Y = (yield* this.pushCount(q)) + (yield* this.pushSpaces(!0));
                return yield* this.pushCount(A.length - Y), this.pushNewline(), "stream"
            }
            if (this.atLineEnd()) {
                let q = yield* this.pushSpaces(!0);
                return yield* this.pushCount(A.length - q), yield* this.pushNewline(), "stream"
            }
            return yield QR1.DOCUMENT, yield* this.parseLineStart()
        }* parseLineStart() {
            let A = this.charAt(0);
            if (!A && !this.atEnd) return this.setNext("line-start");
            if (A === "-" || A === ".") {
                if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
                let q = this.peek(3);
                if ((q === "---" || q === "...") && iC(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, q === "---" ? "doc" : "stream"
            }
            if (this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !iC(this.charAt(1))) this.indentNext = this.indentValue;
            return yield* this.parseBlockStart()
        }* parseBlockStart() {
            let [A, q] = this.peek(2);
            if (!q && !this.atEnd) return this.setNext("block-start");
            if ((A === "-" || A === "?" || A === ":") && iC(q)) {
                let K = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
                return this.indentNext = this.indentValue + 1, this.indentValue += K, yield* this.parseBlockStart()
            }
            return "doc"
        }* parseDocument() {
            yield* this.pushSpaces(!0);
            let A = this.getLine();
            if (A === null) return this.setNext("doc");
            let q = yield* this.pushIndicators();
            switch (A[q]) {
                case "#":
                    yield* this.pushCount(A.length - q);
                case void 0:
                    return yield* this.pushNewline(), yield* this.parseLineStart();
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), "doc";
                case "*":
                    return yield* this.pushUntil(p6A), "doc";
                case '"':
                case "'":
                    return yield* this.parseQuotedScalar();
                case "|":
                case ">":
                    return q += yield* this.parseBlockScalarHeader(), q += yield* this.pushSpaces(!0), yield* this.pushCount(A.length - q), yield* this.pushNewline(), yield* this.parseBlockScalar();
                default:
                    return yield* this.parsePlainScalar()
            }
        }* parseFlowCollection() {
            let A, q, K = -1;
            do {
                if (A = yield* this.pushNewline(), A > 0) q = yield* this.pushSpaces(!1), this.indentValue = K = q;
                else q = 0;
                q += yield* this.pushSpaces(!0)
            } while (A + q > 0);
            let Y = this.getLine();
            if (Y === null) return this.setNext("flow");
            if (K !== -1 && K < this.indentNext && Y[0] !== "#" || K === 0 && (Y.startsWith("---") || Y.startsWith("...")) && iC(Y[3])) {
                if (!(K === this.indentNext - 1 && this.flowLevel === 1 && (Y[0] === "]" || Y[0] === "}"))) return this.flowLevel = 0, yield QR1.FLOW_END, yield* this.parseLineStart()
            }
            let z = 0;
            while (Y[z] === ",") z += yield* this.pushCount(1), z += yield* this.pushSpaces(!0), this.flowKey = !1;
            switch (z += yield* this.pushIndicators(), Y[z]) {
                case void 0:
                    return "flow";
                case "#":
                    return yield* this.pushCount(Y.length - z), "flow";
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
                case "*":
                    return yield* this.pushUntil(p6A), "flow";
                case '"':
                case "'":
                    return this.flowKey = !0, yield* this.parseQuotedScalar();
                case ":": {
                    let w = this.charAt(1);
                    if (this.flowKey || iC(w) || w === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow"
                }
                default:
                    return this.flowKey = !1, yield* this.parsePlainScalar()
            }
        }* parseQuotedScalar() {
            let A = this.charAt(0),
                q = this.buffer.indexOf(A, this.pos + 1);
            if (A === "'")
                while (q !== -1 && this.buffer[q + 1] === "'") q = this.buffer.indexOf("'", q + 2);
            else
                while (q !== -1) {
                    let z = 0;
                    while (this.buffer[q - 1 - z] === "\\") z += 1;
                    if (z % 2 === 0) break;
                    q = this.buffer.indexOf('"', q + 1)
                }
            let K = this.buffer.substring(0, q),
                Y = K.indexOf(`
`, this.pos);
            if (Y !== -1) {
                while (Y !== -1) {
                    let z = this.continueScalar(Y + 1);
                    if (z === -1) break;
                    Y = K.indexOf(`
`, z)
                }
                if (Y !== -1) q = Y - (K[Y - 1] === "\r" ? 2 : 1)
            }
            if (q === -1) {
                if (!this.atEnd) return this.setNext("quoted-scalar");
                q = this.buffer.length
            }
            return yield* this.pushToIndex(q + 1, !1), this.flowLevel ? "flow" : "doc"
        }* parseBlockScalarHeader() {
            this.blockScalarIndent = -1, this.blockScalarKeep = !1;
            let A = this.pos;
            while (!0) {
                let q = this.buffer[++A];
                if (q === "+") this.blockScalarKeep = !0;
                else if (q > "0" && q <= "9") this.blockScalarIndent = Number(q) - 1;
                else if (q !== "-") break
            }
            return yield* this.pushUntil((q) => iC(q) || q === "#")
        }* parseBlockScalar() {
            let A = this.pos - 1,
                q = 0,
                K;
            A: for (let z = this.pos; K = this.buffer[z]; ++z) switch (K) {
                case " ":
                    q += 1;
                    break;
                case `
`:
                    A = z, q = 0;
                    break;
                case "\r": {
                    let w = this.buffer[z + 1];
                    if (!w && !this.atEnd) return this.setNext("block-scalar");
                    if (w === `
`) break
                }
                default:
                    break A
            }
            if (!K && !this.atEnd) return this.setNext("block-scalar");
            if (q >= this.indentNext) {
                if (this.blockScalarIndent === -1) this.indentNext = q;
                else this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
                do {
                    let z = this.continueScalar(A + 1);
                    if (z === -1) break;
                    A = this.buffer.indexOf(`
`, z)
                } while (A !== -1);
                if (A === -1) {
                    if (!this.atEnd) return this.setNext("block-scalar");
                    A = this.buffer.length
                }
            }
            let Y = A + 1;
            K = this.buffer[Y];
            while (K === " ") K = this.buffer[++Y];
            if (K === "\t") {
                while (K === "\t" || K === " " || K === "\r" || K === `
`) K = this.buffer[++Y];
                A = Y - 1
            } else if (!this.blockScalarKeep)
                do {
                    let z = A - 1,
                        w = this.buffer[z];
                    if (w === "\r") w = this.buffer[--z];
                    let H = z;
                    while (w === " ") w = this.buffer[--z];
                    if (w === `
` && z >= this.pos && z + 1 + q > H) A = z;
                    else break
                } while (!0);
            return yield QR1.SCALAR, yield* this.pushToIndex(A + 1, !0), yield* this.parseLineStart()
        }* parsePlainScalar() {
            let A = this.flowLevel > 0,
                q = this.pos - 1,
                K = this.pos - 1,
                Y;
            while (Y = this.buffer[++K])
                if (Y === ":") {
                    let z = this.buffer[K + 1];
                    if (iC(z) || A && u76.has(z)) break;
                    q = K
                } else if (iC(Y)) {
                let z = this.buffer[K + 1];
                if (Y === "\r")
                    if (z === `
`) K += 1, Y = `
`, z = this.buffer[K + 1];
                    else q = K;
                if (z === "#" || A && u76.has(z)) break;
                if (Y === `
`) {
                    let w = this.continueScalar(K + 1);
                    if (w === -1) break;
                    K = Math.max(K, w - 2)
                }
            } else {
                if (A && u76.has(Y)) break;
                q = K
            }
            if (!Y && !this.atEnd) return this.setNext("plain-scalar");
            return yield QR1.SCALAR, yield* this.pushToIndex(q + 1, !0), A ? "flow" : "doc"
        }* pushCount(A) {
            if (A > 0) return yield this.buffer.substr(this.pos, A), this.pos += A, A;
            return 0
        }* pushToIndex(A, q) {
            let K = this.buffer.slice(this.pos, A);
            if (K) return yield K, this.pos += K.length, K.length;
            else if (q) yield "";
            return 0
        }* pushIndicators() {
            switch (this.charAt(0)) {
                case "!":
                    return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "&":
                    return (yield* this.pushUntil(p6A)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "-":
                case "?":
                case ":": {
                    let A = this.flowLevel > 0,
                        q = this.charAt(1);
                    if (iC(q) || A && u76.has(q)) {
                        if (!A) this.indentNext = this.indentValue + 1;
                        else if (this.flowKey) this.flowKey = !1;
                        return (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators())
                    }
                }
            }
            return 0
        }* pushTag() {
            if (this.charAt(1) === "<") {
                let A = this.pos + 2,
                    q = this.buffer[A];
                while (!iC(q) && q !== ">") q = this.buffer[++A];
                return yield* this.pushToIndex(q === ">" ? A + 1 : A, !1)
            } else {
                let A = this.pos + 1,
                    q = this.buffer[A];
                while (q)
                    if (U_5.has(q)) q = this.buffer[++A];
                    else if (q === "%" && _r8.has(this.buffer[A + 1]) && _r8.has(this.buffer[A + 2])) q = this.buffer[A += 3];
                else break;
                return yield* this.pushToIndex(A, !1)
            }
        }* pushNewline() {
            let A = this.buffer[this.pos];
            if (A === `
`) return yield* this.pushCount(1);
            else if (A === "\r" && this.charAt(1) === `
`) return yield* this.pushCount(2);
            else return 0
        }* pushSpaces(A) {
            let q = this.pos - 1,
                K;
            do K = this.buffer[++q]; while (K === " " || A && K === "\t");
            let Y = q - this.pos;
            if (Y > 0) yield this.buffer.substr(this.pos, Y), this.pos = q;
            return Y
        }* pushUntil(A) {
            let q = this.pos,
                K = this.buffer[q];
            while (!A(K)) K = this.buffer[++q];
            return yield* this.pushToIndex(q, !1)
        }
    }
    d_5.Lexer = Jr8
})
// @from(Ln 111750, Col 4)
c6A = R((l_5) => {
    class Xr8 {
        constructor() {
            this.lineStarts = [], this.addNewLine = (A) => this.lineStarts.push(A), this.linePos = (A) => {
                let q = 0,
                    K = this.lineStarts.length;
                while (q < K) {
                    let z = q + K >> 1;
                    if (this.lineStarts[z] < A) q = z + 1;
                    else K = z
                }
                if (this.lineStarts[q] === A) return {
                    line: q + 1,
                    col: 1
                };
                if (q === 0) return {
                    line: 0,
                    col: A
                };
                let Y = this.lineStarts[q - 1];
                return {
                    line: q,
                    col: A - Y + 1
                }
            }
        }
    }
    l_5.LineCounter = Xr8
})
// @from(Ln 111779, Col 4)
l6A = R((o_5) => {
    var n_5 = h1("process"),
        Dr8 = b76(),
        r_5 = d6A();

    function Fn(A, q) {
        for (let K = 0; K < A.length; ++K)
            if (A[K].type === q) return !0;
        return !1
    }

    function jr8(A) {
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

    function Pr8(A) {
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

    function B76(A) {
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

    function QO1(A) {
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

    function Mr8(A) {
        if (A.start.type === "flow-seq-start") {
            for (let q of A.items)
                if (q.sep && !q.value && !Fn(q.start, "explicit-key-ind") && !Fn(q.sep, "map-value-ind")) {
                    if (q.key) q.value = q.key;
                    if (delete q.key, Pr8(q.value))
                        if (q.value.end) Array.prototype.push.apply(q.value.end, q.sep);
                        else q.value.end = q.sep;
                    else Array.prototype.push.apply(q.start, q.sep);
                    delete q.sep
                }
        }
    }
    class Wr8 {
        constructor(A) {
            this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new r_5.Lexer, this.onNewLine = A
        }* parse(A, q = !1) {
            if (this.onNewLine && this.offset === 0) this.onNewLine(0);
            for (let K of this.lexer.lex(A, q)) yield* this.next(K);
            if (!q) yield* this.end()
        }* next(A) {
            if (this.source = A, n_5.env.LOG_TOKENS) console.log("|", Dr8.prettyToken(A));
            if (this.atScalar) {
                this.atScalar = !1, yield* this.step(), this.offset += A.length;
                return
            }
            let q = Dr8.tokenType(A);
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
                if (q.type === "flow-collection") Mr8(q);
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
                    if (Y && !Y.sep && !Y.value && Y.start.length > 0 && jr8(Y.start) === -1 && (q.indent === 0 || Y.start.every((z) => z.type !== "comment" || z.indent < q.indent))) {
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
                    if (jr8(A.start) !== -1) yield* this.pop(), yield* this.step();
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
                let q = B76(this.peek(2)),
                    K = QO1(q),
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
                    let w = [];
                    for (let H = 0; H < q.sep.length; ++H) {
                        let $ = q.sep[H];
                        switch ($.type) {
                            case "newline":
                                w.push(H);
                                break;
                            case "space":
                                break;
                            case "comment":
                                if ($.indent > A.indent) w.length = 0;
                                break;
                            default:
                                w.length = 0
                        }
                    }
                    if (w.length >= 2) z = q.sep.splice(w[1])
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
                                if (Fn(q.start, "newline")) Object.assign(q, {
                                    key: null,
                                    sep: [this.sourceToken]
                                });
                                else {
                                    let w = QO1(q.start);
                                    this.stack.push({
                                        type: "block-map",
                                        offset: this.offset,
                                        indent: this.indent,
                                        items: [{
                                            start: w,
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
                        else if (Fn(q.sep, "map-value-ind")) this.stack.push({
                            type: "block-map",
                            offset: this.offset,
                            indent: this.indent,
                            items: [{
                                start: z,
                                key: null,
                                sep: [this.sourceToken]
                            }]
                        });
                        else if (Pr8(q.key) && !Fn(q.sep, "newline")) {
                            let w = QO1(q.start),
                                H = q.key,
                                $ = q.sep;
                            $.push(this.sourceToken), delete q.key, delete q.sep, this.stack.push({
                                type: "block-map",
                                offset: this.offset,
                                indent: this.indent,
                                items: [{
                                    start: w,
                                    key: H,
                                    sep: $
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
                        else if (Fn(q.sep, "map-value-ind")) this.stack.push({
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
                        let w = this.flowScalar(this.type);
                        if (Y || q.value) A.items.push({
                            start: z,
                            key: w,
                            sep: []
                        }), this.onKeyLine = !0;
                        else if (q.sep) this.stack.push(w);
                        else Object.assign(q, {
                            key: w,
                            sep: []
                        }), this.onKeyLine = !0;
                        return
                    }
                    default: {
                        let w = this.startBlockValue(A);
                        if (w) {
                            if (w.type === "block-seq") {
                                if (!q.explicitKey && q.sep && !Fn(q.sep, "newline")) {
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
                            this.stack.push(w);
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
                    if (q.value || Fn(q.start, "seq-item-ind")) A.items.push({
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
                    let Y = B76(K),
                        z = QO1(Y);
                    Mr8(A);
                    let w = A.end.splice(1, A.end.length);
                    w.push(this.sourceToken);
                    let H = {
                        type: "block-map",
                        offset: A.offset,
                        indent: A.indent,
                        items: [{
                            start: z,
                            key: A,
                            sep: w
                        }]
                    };
                    this.onKeyLine = !0, this.stack[this.stack.length - 1] = H
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
                    let q = B76(A),
                        K = QO1(q);
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
                    let q = B76(A),
                        K = QO1(q);
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
    o_5.Parser = Wr8
})
// @from(Ln 112545, Col 4)
Nr8 = R((zJ5) => {
    var Gr8 = b6A(),
        s_5 = bR1(),
        gR1 = uR1(),
        t_5 = c1A(),
        e_5 = kY(),
        AJ5 = c6A(),
        Zr8 = l6A();

    function fr8(A) {
        let q = A.prettyErrors !== !1;
        return {
            lineCounter: A.lineCounter || q && new AJ5.LineCounter || null,
            prettyErrors: q
        }
    }

    function qJ5(A, q = {}) {
        let {
            lineCounter: K,
            prettyErrors: Y
        } = fr8(q), z = new Zr8.Parser(K?.addNewLine), w = new Gr8.Composer(q), H = Array.from(w.compose(z.parse(A)));
        if (Y && K)
            for (let $ of H) $.errors.forEach(gR1.prettifyError(A, K)), $.warnings.forEach(gR1.prettifyError(A, K));
        if (H.length > 0) return H;
        return Object.assign([], {
            empty: !0
        }, w.streamInfo())
    }

    function Vr8(A, q = {}) {
        let {
            lineCounter: K,
            prettyErrors: Y
        } = fr8(q), z = new Zr8.Parser(K?.addNewLine), w = new Gr8.Composer(q), H = null;
        for (let $ of w.compose(z.parse(A), !0, A.length))
            if (!H) H = $;
            else if (H.options.logLevel !== "silent") {
            H.errors.push(new gR1.YAMLParseError($.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
            break
        }
        if (Y && K) H.errors.forEach(gR1.prettifyError(A, K)), H.warnings.forEach(gR1.prettifyError(A, K));
        return H
    }

    function KJ5(A, q, K) {
        let Y = void 0;
        if (typeof q === "function") Y = q;
        else if (K === void 0 && q && typeof q === "object") K = q;
        let z = Vr8(A, K);
        if (!z) return null;
        if (z.warnings.forEach((w) => t_5.warn(z.options.logLevel, w)), z.errors.length > 0)
            if (z.options.logLevel !== "silent") throw z.errors[0];
            else z.errors = [];
        return z.toJS(Object.assign({
            reviver: Y
        }, K))
    }

    function YJ5(A, q, K) {
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
        if (e_5.isDocument(A) && !Y) return A.toString(K);
        return new s_5.Document(A, Y, K).toString(K)
    }
    zJ5.parse = KJ5;
    zJ5.parseAllDocuments = qJ5;
    zJ5.parseDocument = Vr8;
    zJ5.stringify = YJ5
})
// @from(Ln 112631, Col 4)
_J5
// @from(Ln 112631, Col 9)
JJ5
// @from(Ln 112631, Col 14)
XJ5
// @from(Ln 112631, Col 19)
i6A
// @from(Ln 112631, Col 24)
DJ5
// @from(Ln 112631, Col 29)
Qn
// @from(Ln 112631, Col 33)
jJ5
// @from(Ln 112631, Col 38)
MJ5
// @from(Ln 112631, Col 43)
PJ5
// @from(Ln 112631, Col 48)
WJ5
// @from(Ln 112631, Col 53)
a52
// @from(Ln 112631, Col 58)
GJ5
// @from(Ln 112631, Col 63)
ZJ5
// @from(Ln 112631, Col 68)
fJ5
// @from(Ln 112631, Col 73)
m76
// @from(Ln 112631, Col 78)
Tr8
// @from(Ln 112631, Col 83)
VJ5
// @from(Ln 112631, Col 88)
NJ5
// @from(Ln 112631, Col 93)
TJ5
// @from(Ln 112631, Col 98)
vJ5
// @from(Ln 112631, Col 103)
EJ5
// @from(Ln 112631, Col 108)
kJ5
// @from(Ln 112631, Col 113)
LJ5
// @from(Ln 112631, Col 118)
RJ5
// @from(Ln 112631, Col 123)
yJ5
// @from(Ln 112631, Col 128)
CJ5
// @from(Ln 112631, Col 133)
SJ5
// @from(Ln 112631, Col 138)
hJ5
// @from(Ln 112631, Col 143)
IJ5
// @from(Ln 112631, Col 148)
xJ5
// @from(Ln 112631, Col 153)
bJ5
// @from(Ln 112631, Col 158)
uJ5
// @from(Ln 112631, Col 163)
BJ5
// @from(Ln 112631, Col 168)
mJ5
// @from(Ln 112631, Col 173)
FJ5
// @from(Ln 112631, Col 178)
QJ5
// @from(Ln 112631, Col 183)
gJ5
// @from(Ln 112631, Col 188)
UJ5
// @from(Ln 112631, Col 193)
n6A
// @from(Ln 112631, Col 198)
pJ5
// @from(Ln 112631, Col 203)
dJ5
// @from(Ln 112631, Col 208)
cJ5
// @from(Ln 112631, Col 213)
lJ5
// @from(Ln 112631, Col 218)
iJ5
// @from(Ln 112632, Col 4)
vr8 = v(() => {
    _J5 = b6A(), JJ5 = bR1(), XJ5 = Z6A(), i6A = uR1(), DJ5 = fR1(), Qn = kY(), jJ5 = bn(), MJ5 = MX(), PJ5 = Bn(), WJ5 = mn(), a52 = b76(), GJ5 = d6A(), ZJ5 = c6A(), fJ5 = l6A(), m76 = Nr8(), Tr8 = GR1();
    VJ5 = _J5.Composer, NJ5 = JJ5.Document, TJ5 = XJ5.Schema, vJ5 = i6A.YAMLError, EJ5 = i6A.YAMLParseError, kJ5 = i6A.YAMLWarning, LJ5 = DJ5.Alias, RJ5 = Qn.isAlias, yJ5 = Qn.isCollection, CJ5 = Qn.isDocument, SJ5 = Qn.isMap, hJ5 = Qn.isNode, IJ5 = Qn.isPair, xJ5 = Qn.isScalar, bJ5 = Qn.isSeq, uJ5 = jJ5.Pair, BJ5 = MJ5.Scalar, mJ5 = PJ5.YAMLMap, FJ5 = WJ5.YAMLSeq, QJ5 = GJ5.Lexer, gJ5 = ZJ5.LineCounter, UJ5 = fJ5.Parser, n6A = m76.parse, pJ5 = m76.parseAllDocuments, dJ5 = m76.parseDocument, cJ5 = m76.stringify, lJ5 = Tr8.visit, iJ5 = Tr8.visitAsync
})
// @from(Ln 112637, Col 0)
function r6A(A) {
    if (typeof Bun < "u") return Bun.YAML.parse(A);
    return n6A(A)
}
// @from(Ln 112641, Col 4)
Er8 = v(() => {
    vr8()
})
// @from(Ln 112645, Col 0)
function rJ5(A) {
    let q = A.split(`
`),
        K = [];
    for (let Y of q) {
        let z = Y.match(/^([a-zA-Z_-]+):\s+(.+)$/);
        if (z) {
            let [, w, H] = z;
            if (!w || !H) {
                K.push(Y);
                continue
            }
            if (H.startsWith('"') && H.endsWith('"') || H.startsWith("'") && H.endsWith("'")) {
                K.push(Y);
                continue
            }
            if (nJ5.test(H)) {
                let $ = H.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                K.push(`${w}: "${$}"`);
                continue
            }
        }
        K.push(Y)
    }
    return K.join(`
`)
}
// @from(Ln 112673, Col 0)
function yD(A, q) {
    let K = /^---\s*\n([\s\S]*?)---\s*\n?/,
        Y = A.match(K);
    if (!Y) return {
        frontmatter: {},
        content: A
    };
    let z = Y[1] || "",
        w = A.slice(Y[0].length),
        H = {};
    try {
        let $ = r6A(z);
        if ($ && typeof $ === "object" && !Array.isArray($)) H = $
    } catch {
        try {
            let $ = rJ5(z),
                O = r6A($);
            if (O && typeof O === "object" && !Array.isArray(O)) H = O
        } catch ($) {
            let O = q ? ` in ${q}` : "";
            h(`Failed to parse YAML frontmatter${O}: ${$ instanceof Error?$.message:$}`, {
                level: "warn"
            })
        }
    }
    return {
        frontmatter: H,
        content: w
    }
}
// @from(Ln 112704, Col 0)
function F76(A) {
    let q = [],
        K = "",
        Y = 0;
    for (let w = 0; w < A.length; w++) {
        let H = A[w];
        if (H === "{") Y++, K += H;
        else if (H === "}") Y--, K += H;
        else if (H === "," && Y === 0) {
            let $ = K.trim();
            if ($) q.push($);
            K = ""
        } else K += H
    }
    let z = K.trim();
    if (z) q.push(z);
    return q.filter((w) => w.length > 0).flatMap((w) => kr8(w))
}
// @from(Ln 112723, Col 0)
function kr8(A) {
    let q = A.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    if (!q) return [A];
    let K = q[1] || "",
        Y = q[2] || "",
        z = q[3] || "",
        w = Y.split(",").map(($) => $.trim()),
        H = [];
    for (let $ of w) {
        let O = K + $ + z,
            _ = kr8(O);
        H.push(..._)
    }
    return H
}
// @from(Ln 112739, Col 0)
function Lr8(A) {
    if (A === void 0 || A === null) return;
    let q = typeof A === "number" ? A : parseInt(String(A), 10);
    if (Number.isInteger(q) && q > 0) return q;
    return
}
// @from(Ln 112745, Col 4)
nJ5
// @from(Ln 112746, Col 4)
Lg = v(() => {
    Er8();
    Z6();
    nJ5 = /[{}[\]*&#!|>%@`]/
})
// @from(Ln 112752, Col 0)
function pR1() {
    return y7("policySettings")?.allowManagedPermissionRulesOnly === !0
}
// @from(Ln 112756, Col 0)
function tb() {
    return !pR1()
}
// @from(Ln 112760, Col 0)
function aJ5(A) {
    let q = Vw(A);
    if (!q || !b1().existsSync(q)) return null;
    try {
        let {
            resolvedPath: K
        } = QH(b1(), q), Y = $J(K);
        if (Y.trim() === "") return {};
        let z = j9(Y, !1);
        return z && typeof z === "object" ? z : null
    } catch {
        return null
    }
}
// @from(Ln 112775, Col 0)
function sJ5(A, q) {
    if (!A || !A.permissions) return [];
    let {
        permissions: K
    } = A, Y = [];
    for (let z of oJ5) {
        let w = K[z];
        if (w)
            for (let H of w) Y.push({
                source: q,
                ruleBehavior: z,
                ruleValue: lP(H)
            })
    }
    return Y
}
// @from(Ln 112792, Col 0)
function Q76() {
    if (pR1()) return UR1("policySettings");
    let A = [];
    for (let q of Ei()) A.push(...UR1(q));
    return A
}
// @from(Ln 112799, Col 0)
function UR1(A) {
    let q = y7(A);
    return sJ5(q, A)
}
// @from(Ln 112804, Col 0)
function Rr8(A) {
    if (!tJ5.includes(A.source)) return !1;
    let q = M9(A.ruleValue),
        K = y7(A.source);
    if (!K || !K.permissions) return !1;
    let Y = K.permissions[A.ruleBehavior];
    if (!Y || !Y.includes(q)) return !1;
    try {
        let z = {
                ...K,
                permissions: {
                    ...K.permissions,
                    [A.ruleBehavior]: Y.filter((H) => H !== q)
                }
            },
            {
                error: w
            } = Z7(A.source, z);
        if (w) return !1;
        return !0
    } catch (z) {
        return K1(z instanceof Error ? z : Error(String(z))), !1
    }
}
// @from(Ln 112829, Col 0)
function eJ5() {
    return {
        permissions: {}
    }
}
// @from(Ln 112835, Col 0)
function g76({
    ruleValues: A,
    ruleBehavior: q
}, K) {
    if (pR1()) return !1;
    if (A.length < 1) return !0;
    let Y = A.map(M9),
        z = y7(K) || aJ5(K) || eJ5();
    try {
        let w = z.permissions || {},
            H = w[q] || [],
            $ = new Set(H),
            O = Y.filter((X) => !$.has(X));
        if (O.length === 0) return !0;
        let _ = {
                ...z,
                permissions: {
                    ...w,
                    [q]: [...H, ...O]
                }
            },
            J = Z7(K, _);
        if (J.error) throw J.error;
        return !0
    } catch (w) {
        return K1(w instanceof Error ? w : Error(String(w))), !1
    }
}
// @from(Ln 112863, Col 4)
oJ5
// @from(Ln 112863, Col 9)
tJ5
// @from(Ln 112864, Col 4)
KL = v(() => {
    y6();
    E$();
    p8();
    _8();
    wq();
    AH();
    oJ5 = ["allow", "deny", "ask"];
    tJ5 = ["userSettings", "projectSettings", "localSettings"]
})
// @from(Ln 112878, Col 0)
function I81(A) {
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
// @from(Ln 112890, Col 0)
function a2(A, q) {
    switch (q.type) {
        case "setMode":
            return h(`Applying permission update: Setting mode to '${q.mode}'`), {
                ...A,
                mode: q.mode
            };
        case "addRules": {
            let K = q.rules.map((z) => M9(z));
            h(`Applying permission update: Adding ${q.rules.length} ${q.behavior} rule(s) to destination '${q.destination}': ${Q1(K)}`);
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
            let K = q.rules.map((z) => M9(z));
            h(`Replacing all ${q.behavior} rules for destination '${q.destination}' with ${q.rules.length} rule(s): ${Q1(K)}`);
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
            h(`Applying permission update: Adding ${q.directories.length} director${q.directories.length===1?"y":"ies"} with destination '${q.destination}': ${Q1(q.directories)}`);
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
            let K = q.rules.map(($) => M9($));
            h(`Applying permission update: Removing ${q.rules.length} ${q.behavior} rule(s) from source '${q.destination}': ${Q1(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
                z = A[Y][q.destination] || [],
                w = new Set(K),
                H = z.filter(($) => !w.has($));
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: H
                }
            }
        }
        case "removeDirectories": {
            h(`Applying permission update: Removing ${q.directories.length} director${q.directories.length===1?"y":"ies"}: ${Q1(q.directories)}`);
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
// @from(Ln 112962, Col 0)
function WV(A, q) {
    let K = A;
    for (let Y of q) K = a2(K, Y);
    return K
}
// @from(Ln 112968, Col 0)
function o6A(A) {
    return A === "localSettings" || A === "userSettings" || A === "projectSettings"
}
// @from(Ln 112972, Col 0)
function eb(A) {
    if (!o6A(A.destination)) return;
    switch (h(`Persisting permission update: ${A.type} to source '${A.destination}'`), A.type) {
        case "addRules": {
            h(`Persisting ${A.rules.length} ${A.behavior} rule(s) to ${A.destination}`), g76({
                ruleValues: A.rules,
                ruleBehavior: A.behavior
            }, A.destination);
            break
        }
        case "addDirectories": {
            h(`Persisting ${A.directories.length} director${A.directories.length===1?"y":"ies"} to ${A.destination}`);
            let K = y7(A.destination)?.permissions?.additionalDirectories || [],
                Y = A.directories.filter((z) => !K.includes(z));
            if (Y.length > 0) {
                let z = [...K, ...Y];
                Z7(A.destination, {
                    permissions: {
                        additionalDirectories: z
                    }
                })
            }
            break
        }
        case "removeRules": {
            h(`Removing ${A.rules.length} ${A.behavior} rule(s) from ${A.destination}`);
            let Y = (y7(A.destination)?.permissions || {})[A.behavior] || [],
                z = new Set(A.rules.map(M9)),
                w = Y.filter((H) => {
                    let $ = M9(lP(H));
                    return !z.has($)
                });
            Z7(A.destination, {
                permissions: {
                    [A.behavior]: w
                }
            });
            break
        }
        case "removeDirectories": {
            h(`Removing ${A.directories.length} director${A.directories.length===1?"y":"ies"} from ${A.destination}`);
            let K = y7(A.destination)?.permissions?.additionalDirectories || [],
                Y = new Set(A.directories),
                z = K.filter((w) => !Y.has(w));
            Z7(A.destination, {
                permissions: {
                    additionalDirectories: z
                }
            });
            break
        }
        case "setMode": {
            h(`Persisting mode '${A.mode}' to ${A.destination}`), Z7(A.destination, {
                permissions: {
                    defaultMode: A.mode
                }
            });
            break
        }
        case "replaceRules": {
            h(`Replacing all ${A.behavior} rules in ${A.destination} with ${A.rules.length} rule(s)`);
            let q = A.rules.map(M9);
            Z7(A.destination, {
                permissions: {
                    [A.behavior]: q
                }
            });
            break
        }
    }
}
// @from(Ln 113044, Col 0)
function nC(A) {
    for (let q of A) eb(q)
}
// @from(Ln 113048, Col 0)
function U76(A, q = "session") {
    try {
        if (b1().statSync(A).isDirectory()) {
            let Y = p76(A);
            if (Y === "/") return;
            return {
                type: "addRules",
                rules: [{
                    toolName: "Read",
                    ruleContent: AX5.isAbsolute(Y) ? `/${Y}/**` : `${Y}/**`
                }],
                behavior: "allow",
                destination: q
            }
        }
    } catch {}
    return
}
// @from(Ln 113066, Col 4)
CO = v(() => {
    Z6();
    p8();
    KL();
    _8();
    E2();
    m6()
})
// @from(Ln 113075, Col 0)
function n7(A, q, K, Y, z) {
    if (Y === "m") throw TypeError("Private method is not writable");
    if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
    if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
    return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
}
// @from(Ln 113082, Col 0)
function ZA(A, q, K, Y) {
    if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
    if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
    return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
}
// @from(Ln 113087, Col 4)
Rg = () => {}
// @from(Ln 113088, Col 4)
a6A = function() {
    let {
        crypto: A
    } = globalThis;
    if (A?.randomUUID) return a6A = A.randomUUID.bind(A), A.randomUUID();
    let q = new Uint8Array(1),
        K = A ? () => A.getRandomValues(q)[0] : () => Math.random() * 255 & 255;
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (Y) => (+Y ^ K() & 15 >> +Y / 4).toString(16))
}
// @from(Ln 113098, Col 0)
function yg(A) {
    return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 113101, Col 4)
dR1 = (A) => {
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
// @from(Ln 113121, Col 4)
r7
// @from(Ln 113121, Col 8)
k4
// @from(Ln 113121, Col 12)
Oz
// @from(Ln 113121, Col 16)
OW
// @from(Ln 113121, Col 20)
Au
// @from(Ln 113121, Col 24)
cR1
// @from(Ln 113121, Col 29)
x81
// @from(Ln 113121, Col 34)
lR1
// @from(Ln 113121, Col 39)
b81
// @from(Ln 113121, Col 44)
iR1
// @from(Ln 113121, Col 49)
nR1
// @from(Ln 113121, Col 54)
rR1
// @from(Ln 113121, Col 59)
oR1
// @from(Ln 113122, Col 4)
_W = v(() => {
    r7 = class r7 extends Error {};
    k4 = class k4 extends r7 {
        constructor(A, q, K, Y) {
            super(`${k4.makeMessage(A,q,K)}`);
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
            if (!A || !Y) return new OW({
                message: K,
                cause: dR1(q)
            });
            let z = q;
            if (A === 400) return new cR1(A, z, K, Y);
            if (A === 401) return new x81(A, z, K, Y);
            if (A === 403) return new lR1(A, z, K, Y);
            if (A === 404) return new b81(A, z, K, Y);
            if (A === 409) return new iR1(A, z, K, Y);
            if (A === 422) return new nR1(A, z, K, Y);
            if (A === 429) return new rR1(A, z, K, Y);
            if (A >= 500) return new oR1(A, z, K, Y);
            return new k4(A, z, K, Y)
        }
    };
    Oz = class Oz extends k4 {
        constructor({
            message: A
        } = {}) {
            super(void 0, void 0, A || "Request was aborted.", void 0)
        }
    };
    OW = class OW extends k4 {
        constructor({
            message: A,
            cause: q
        }) {
            super(void 0, void 0, A || "Connection error.", void 0);
            if (q) this.cause = q
        }
    };
    Au = class Au extends OW {
        constructor({
            message: A
        } = {}) {
            super({
                message: A ?? "Request timed out."
            })
        }
    };
    cR1 = class cR1 extends k4 {};
    x81 = class x81 extends k4 {};
    lR1 = class lR1 extends k4 {};
    b81 = class b81 extends k4 {};
    iR1 = class iR1 extends k4 {};
    nR1 = class nR1 extends k4 {};
    rR1 = class rR1 extends k4 {};
    oR1 = class oR1 extends k4 {}
})
// @from(Ln 113188, Col 0)
function d76(A) {
    if (typeof A !== "object") return {};
    return A ?? {}
}
// @from(Ln 113193, Col 0)
function Cr8(A) {
    if (!A) return !0;
    for (let q in A) return !1;
    return !0
}
// @from(Ln 113199, Col 0)
function Sr8(A, q) {
    return Object.prototype.hasOwnProperty.call(A, q)
}
// @from(Ln 113202, Col 4)
KX5
// @from(Ln 113202, Col 9)
yr8 = (A) => {
        return KX5.test(A)
    }
// @from(Ln 113205, Col 4)
s6A = (A) => (s6A = Array.isArray, s6A(A))
// @from(Ln 113206, Col 4)
t6A
// @from(Ln 113206, Col 9)
hr8 = (A, q) => {
        if (typeof q !== "number" || !Number.isInteger(q)) throw new r7(`${A} must be an integer`);
        if (q < 0) throw new r7(`${A} must be a positive integer`);
        return q
    }
// @from(Ln 113211, Col 4)
c76 = (A) => {
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }
// @from(Ln 113218, Col 4)
u81 = v(() => {
    _W();
    KX5 = /^[a-z][a-z0-9+.-]*:/i, t6A = s6A
})
// @from(Ln 113222, Col 4)
Ir8 = (A) => new Promise((q) => setTimeout(q, A))
// @from(Ln 113223, Col 4)
gn = "0.73.0"
// @from(Ln 113225, Col 0)
function YX5() {
    if (typeof Deno < "u" && Deno.build != null) return "deno";
    if (typeof EdgeRuntime < "u") return "edge";
    if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]") return "node";
    return "unknown"
}
// @from(Ln 113232, Col 0)
function wX5() {
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
                w = Y[2] || 0,
                H = Y[3] || 0;
            return {
                browser: q,
                version: `${z}.${w}.${H}`
            }
        }
    }
    return null
}
// @from(Ln 113271, Col 4)
Br8 = () => {
        return typeof window < "u" && typeof window.document < "u" && typeof navigator < "u"
    }
// @from(Ln 113274, Col 4)
zX5 = () => {
        let A = YX5();
        if (A === "deno") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": gn,
            "X-Stainless-OS": br8(Deno.build.os),
            "X-Stainless-Arch": xr8(Deno.build.arch),
            "X-Stainless-Runtime": "deno",
            "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
        if (typeof EdgeRuntime < "u") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": gn,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": `other:${EdgeRuntime}`,
            "X-Stainless-Runtime": "edge",
            "X-Stainless-Runtime-Version": globalThis.process.version
        };
        if (A === "node") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": gn,
            "X-Stainless-OS": br8(globalThis.process.platform ?? "unknown"),
            "X-Stainless-Arch": xr8(globalThis.process.arch ?? "unknown"),
            "X-Stainless-Runtime": "node",
            "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
        };
        let q = wX5();
        if (q) return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": gn,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": `browser:${q.browser}`,
            "X-Stainless-Runtime-Version": q.version
        };
        return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": gn,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": "unknown",
            "X-Stainless-Runtime-Version": "unknown"
        }
    }
// @from(Ln 113318, Col 4)
xr8 = (A) => {
        if (A === "x32") return "x32";
        if (A === "x86_64" || A === "x64") return "x64";
        if (A === "arm") return "arm";
        if (A === "aarch64" || A === "arm64") return "arm64";
        if (A) return `other:${A}`;
        return "unknown"
    }
// @from(Ln 113326, Col 4)
br8 = (A) => {
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
// @from(Ln 113337, Col 4)
ur8
// @from(Ln 113337, Col 9)
mr8 = () => {
        return ur8 ?? (ur8 = zX5())
    }
// @from(Ln 113340, Col 4)
e6A = () => {}
// @from(Ln 113342, Col 0)
function Fr8() {
    if (typeof fetch < "u") return fetch;
    throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")
}
// @from(Ln 113347, Col 0)
function AAA(...A) {
    let q = globalThis.ReadableStream;
    if (typeof q > "u") throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
    return new q(...A)
}
// @from(Ln 113353, Col 0)
function l76(A) {
    let q = Symbol.asyncIterator in A ? A[Symbol.asyncIterator]() : A[Symbol.iterator]();
    return AAA({
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
// @from(Ln 113371, Col 0)
function aR1(A) {
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
// @from(Ln 113396, Col 0)
async function Qr8(A) {
    if (A === null || typeof A !== "object") return;
    if (A[Symbol.asyncIterator]) {
        await A[Symbol.asyncIterator]().return?.();
        return
    }
    let q = A.getReader(),
        K = q.cancel();
    q.releaseLock(), await K
}
// @from(Ln 113406, Col 4)
gr8 = ({
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
// @from(Ln 113418, Col 0)
function dr8(A) {
    let q = 0;
    for (let z of A) q += z.length;
    let K = new Uint8Array(q),
        Y = 0;
    for (let z of A) K.set(z, Y), Y += z.length;
    return K
}
// @from(Ln 113427, Col 0)
function sR1(A) {
    let q;
    return (Ur8 ?? (q = new globalThis.TextEncoder, Ur8 = q.encode.bind(q)))(A)
}
// @from(Ln 113432, Col 0)
function qAA(A) {
    let q;
    return (pr8 ?? (q = new globalThis.TextDecoder, pr8 = q.decode.bind(q)))(A)
}
// @from(Ln 113436, Col 4)
Ur8
// @from(Ln 113436, Col 9)
pr8
// @from(Ln 113437, Col 0)
class Un {
    constructor() {
        iT.set(this, void 0), nT.set(this, void 0), n7(this, iT, new Uint8Array, "f"), n7(this, nT, null, "f")
    }
    decode(A) {
        if (A == null) return [];
        let q = A instanceof ArrayBuffer ? new Uint8Array(A) : typeof A === "string" ? sR1(A) : A;
        n7(this, iT, dr8([ZA(this, iT, "f"), q]), "f");
        let K = [],
            Y;
        while ((Y = OX5(ZA(this, iT, "f"), ZA(this, nT, "f"))) != null) {
            if (Y.carriage && ZA(this, nT, "f") == null) {
                n7(this, nT, Y.index, "f");
                continue
            }
            if (ZA(this, nT, "f") != null && (Y.index !== ZA(this, nT, "f") + 1 || Y.carriage)) {
                K.push(qAA(ZA(this, iT, "f").subarray(0, ZA(this, nT, "f") - 1))), n7(this, iT, ZA(this, iT, "f").subarray(ZA(this, nT, "f")), "f"), n7(this, nT, null, "f");
                continue
            }
            let z = ZA(this, nT, "f") !== null ? Y.preceding - 1 : Y.preceding,
                w = qAA(ZA(this, iT, "f").subarray(0, z));
            K.push(w), n7(this, iT, ZA(this, iT, "f").subarray(Y.index), "f"), n7(this, nT, null, "f")
        }
        return K
    }
    flush() {
        if (!ZA(this, iT, "f").length) return [];
        return this.decode(`
`)
    }
}
// @from(Ln 113469, Col 0)
function OX5(A, q) {
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
// @from(Ln 113485, Col 0)
function cr8(A) {
    for (let Y = 0; Y < A.length - 1; Y++) {
        if (A[Y] === 10 && A[Y + 1] === 10) return Y + 2;
        if (A[Y] === 13 && A[Y + 1] === 13) return Y + 2;
        if (A[Y] === 13 && A[Y + 1] === 10 && Y + 3 < A.length && A[Y + 2] === 13 && A[Y + 3] === 10) return Y + 4
    }
    return -1
}
// @from(Ln 113493, Col 4)
iT
// @from(Ln 113493, Col 8)
nT
// @from(Ln 113494, Col 4)
KAA = v(() => {
    Rg();
    iT = new WeakMap, nT = new WeakMap;
    Un.NEWLINE_CHARS = new Set([`
`, "\r"]);
    Un.NEWLINE_REGEXP = /\r\n|[\n\r]/g
})
// @from(Ln 113502, Col 0)
function tR1() {}
// @from(Ln 113504, Col 0)
function i76(A, q, K) {
    if (!q || n76[A] > n76[K]) return tR1;
    else return q[A].bind(q)
}
// @from(Ln 113509, Col 0)
function b0(A) {
    let q = A.logger,
        K = A.logLevel ?? "off";
    if (!q) return _X5;
    let Y = lr8.get(q);
    if (Y && Y[0] === K) return Y[1];
    let z = {
        error: i76("error", q, K),
        warn: i76("warn", q, K),
        info: i76("info", q, K),
        debug: i76("debug", q, K)
    };
    return lr8.set(q, [K, z]), z
}
// @from(Ln 113523, Col 4)
n76
// @from(Ln 113523, Col 9)
YAA = (A, q, K) => {
        if (!A) return;
        if (Sr8(n76, A)) return A;
        b0(K).warn(`${q} was set to ${JSON.stringify(A)}, expected one of ${JSON.stringify(Object.keys(n76))}`);
        return
    }
// @from(Ln 113529, Col 4)
_X5
// @from(Ln 113529, Col 9)
lr8
// @from(Ln 113529, Col 14)
Cg = (A) => {
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
// @from(Ln 113540, Col 4)
r76 = v(() => {
    u81();
    n76 = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    _X5 = {
        error: tR1,
        warn: tR1,
        info: tR1,
        debug: tR1
    }, lr8 = new WeakMap
})
// @from(Ln 113556, Col 0)
async function* JX5(A, q) {
    if (!A.body) {
        if (q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new r7("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new r7("Attempted to iterate over a response with no body")
    }
    let K = new ir8,
        Y = new Un,
        z = aR1(A.body);
    for await (let w of XX5(z)) for (let H of Y.decode(w)) {
        let $ = K.decode(H);
        if ($) yield $
    }
    for (let w of Y.flush()) {
        let H = K.decode(w);
        if (H) yield H
    }
}
// @from(Ln 113573, Col 0)
async function* XX5(A) {
    let q = new Uint8Array;
    for await (let K of A) {
        if (K == null) continue;
        let Y = K instanceof ArrayBuffer ? new Uint8Array(K) : typeof K === "string" ? sR1(K) : K,
            z = new Uint8Array(q.length + Y.length);
        z.set(q), z.set(Y, q.length), q = z;
        let w;
        while ((w = cr8(q)) !== -1) yield q.slice(0, w), q = q.slice(w)
    }
    if (q.length > 0) yield q
}
// @from(Ln 113585, Col 0)
class ir8 {
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
        let [q, K, Y] = DX5(A, ":");
        if (Y.startsWith(" ")) Y = Y.substring(1);
        if (q === "event") this.event = Y;
        else if (q === "data") this.data.push(Y);
        return null
    }
}
// @from(Ln 113610, Col 0)
function DX5(A, q) {
    let K = A.indexOf(q);
    if (K !== -1) return [A.substring(0, K), q, A.substring(K + q.length)];
    return [A, "", ""]
}
// @from(Ln 113615, Col 4)
eR1
// @from(Ln 113615, Col 9)
pG
// @from(Ln 113616, Col 4)
zAA = v(() => {
    Rg();
    _W();
    KAA();
    u81();
    r76();
    _W();
    pG = class pG {
        constructor(A, q, K) {
            this.iterator = A, eR1.set(this, void 0), this.controller = q, n7(this, eR1, K, "f")
        }
        static fromSSEResponse(A, q, K) {
            let Y = !1,
                z = K ? b0(K) : console;
            async function* w() {
                if (Y) throw new r7("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let H = !1;
                try {
                    for await (let $ of JX5(A, q)) {
                        if ($.event === "completion") try {
                            yield JSON.parse($.data)
                        } catch (O) {
                            throw z.error("Could not parse message into JSON:", $.data), z.error("From chunk:", $.raw), O
                        }
                        if ($.event === "message_start" || $.event === "message_delta" || $.event === "message_stop" || $.event === "content_block_start" || $.event === "content_block_delta" || $.event === "content_block_stop") try {
                            yield JSON.parse($.data)
                        } catch (O) {
                            throw z.error("Could not parse message into JSON:", $.data), z.error("From chunk:", $.raw), O
                        }
                        if ($.event === "ping") continue;
                        if ($.event === "error") throw new k4(void 0, c76($.data) ?? $.data, void 0, A.headers)
                    }
                    H = !0
                } catch ($) {
                    if (yg($)) return;
                    throw $
                } finally {
                    if (!H) q.abort()
                }
            }
            return new pG(w, q, K)
        }
        static fromReadableStream(A, q, K) {
            let Y = !1;
            async function* z() {
                let H = new Un,
                    $ = aR1(A);
                for await (let O of $) for (let _ of H.decode(O)) yield _;
                for (let O of H.flush()) yield O
            }
            async function* w() {
                if (Y) throw new r7("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let H = !1;
                try {
                    for await (let $ of z()) {
                        if (H) continue;
                        if ($) yield JSON.parse($)
                    }
                    H = !0
                } catch ($) {
                    if (yg($)) return;
                    throw $
                } finally {
                    if (!H) q.abort()
                }
            }
            return new pG(w, q, K)
        } [(eR1 = new WeakMap, Symbol.asyncIterator)]() {
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
                                let w = K.next();
                                A.push(w), q.push(w)
                            }
                            return z.shift()
                        }
                    }
                };
            return [new pG(() => Y(A), this.controller, ZA(this, eR1, "f")), new pG(() => Y(q), this.controller, ZA(this, eR1, "f"))]
        }
        toReadableStream() {
            let A = this,
                q;
            return AAA({
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
                        let w = sR1(JSON.stringify(Y) + `
`);
                        K.enqueue(w)
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
// @from(Ln 113733, Col 0)
async function o76(A, q) {
    let {
        response: K,
        requestLogID: Y,
        retryOfRequestLogID: z,
        startTime: w
    } = q, H = await (async () => {
        if (q.options.stream) {
            if (b0(A).debug("response", K.status, K.url, K.headers, K.body), q.options.__streamClass) return q.options.__streamClass.fromSSEResponse(K, q.controller);
            return pG.fromSSEResponse(K, q.controller)
        }
        if (K.status === 204) return null;
        if (q.options.__binaryResponse) return K;
        let O = K.headers.get("content-type")?.split(";")[0]?.trim();
        if (O?.includes("application/json") || O?.endsWith("+json")) {
            if (K.headers.get("content-length") === "0") return;
            let D = await K.json();
            return wAA(D, K)
        }
        return await K.text()
    })();
    return b0(A).debug(`[${Y}] response parsed`, Cg({
        retryOfRequestLogID: z,
        url: K.url,
        status: K.status,
        body: H,
        durationMs: Date.now() - w
    })), H
}
// @from(Ln 113763, Col 0)
function wAA(A, q) {
    if (!A || typeof A !== "object" || Array.isArray(A)) return A;
    return Object.defineProperty(A, "_request_id", {
        value: q.headers.get("request-id"),
        enumerable: !1
    })
}
// @from(Ln 113770, Col 4)
HAA = v(() => {
    zAA();
    r76()
})
// @from(Ln 113774, Col 4)
Ay1
// @from(Ln 113774, Col 9)
B81
// @from(Ln 113775, Col 4)
a76 = v(() => {
    Rg();
    HAA();
    B81 = class B81 extends Promise {
        constructor(A, q, K = o76) {
            super((Y) => {
                Y(null)
            });
            this.responsePromise = q, this.parseResponse = K, Ay1.set(this, void 0), n7(this, Ay1, A, "f")
        }
        _thenUnwrap(A) {
            return new B81(ZA(this, Ay1, "f"), this.responsePromise, async (q, K) => wAA(A(await this.parseResponse(q, K), K), K.response))
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
            if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((A) => this.parseResponse(ZA(this, Ay1, "f"), A));
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
    Ay1 = new WeakMap
})
// @from(Ln 113813, Col 4)
s76
// @from(Ln 113813, Col 9)
$AA
// @from(Ln 113813, Col 14)
t76
// @from(Ln 113813, Col 19)
rC
// @from(Ln 113813, Col 23)
qy1
// @from(Ln 113814, Col 4)
qu = v(() => {
    Rg();
    _W();
    HAA();
    a76();
    u81();
    $AA = class $AA {
        constructor(A, q, K, Y) {
            s76.set(this, void 0), n7(this, s76, A, "f"), this.options = Y, this.response = q, this.body = K
        }
        hasNextPage() {
            if (!this.getPaginatedItems().length) return !1;
            return this.nextPageRequestOptions() != null
        }
        async getNextPage() {
            let A = this.nextPageRequestOptions();
            if (!A) throw new r7("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
            return await ZA(this, s76, "f").requestAPIList(this.constructor, A)
        }
        async * iterPages() {
            let A = this;
            yield A;
            while (A.hasNextPage()) A = await A.getNextPage(), yield A
        }
        async * [(s76 = new WeakMap, Symbol.asyncIterator)]() {
            for await (let A of this.iterPages()) for (let q of A.getPaginatedItems()) yield q
        }
    };
    t76 = class t76 extends B81 {
        constructor(A, q, K) {
            super(A, q, async (Y, z) => new K(Y, z.response, await o76(Y, z), z.options))
        }
        async * [Symbol.asyncIterator]() {
            let A = await this;
            for await (let q of A) yield q
        }
    };
    rC = class rC extends $AA {
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
                        ...d76(this.options.query),
                        before_id: q
                    }
                }
            }
            let A = this.last_id;
            if (!A) return null;
            return {
                ...this.options,
                query: {
                    ...d76(this.options.query),
                    after_id: A
                }
            }
        }
    };
    qy1 = class qy1 extends $AA {
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
                    ...d76(this.options.query),
                    page: A
                }
            }
        }
    }
})
// @from(Ln 113912, Col 0)
function m81(A, q, K) {
    return _AA(), new File(A, q ?? "unknown_file", K)
}
// @from(Ln 113916, Col 0)
function Ky1(A, q) {
    let K = typeof A === "object" && A !== null && (("name" in A) && A.name && String(A.name) || ("url" in A) && A.url && String(A.url) || ("filename" in A) && A.filename && String(A.filename) || ("path" in A) && A.path && String(A.path)) || "";
    return q ? K.split(/[\\/]/).pop() || void 0 : K
}
// @from(Ln 113921, Col 0)
function MX5(A) {
    let q = typeof A === "function" ? A : A.fetch,
        K = nr8.get(q);
    if (K) return K;
    let Y = (async () => {
        try {
            let z = "Response" in q ? q.Response : (await q("data:,")).constructor,
                w = new FormData;
            if (w.toString() === await new z(w).text()) return !1;
            return !0
        } catch {
            return !0
        }
    })();
    return nr8.set(q, Y), Y
}
// @from(Ln 113937, Col 4)
_AA = () => {
        if (typeof File > "u") {
            let {
                process: A
            } = globalThis, q = typeof A?.versions?.node === "string" && parseInt(A.versions.node.split(".")) < 20;
            throw Error("`File` is not defined as a global, which is required for file uploads." + (q ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""))
        }
    }
// @from(Ln 113945, Col 4)
JAA = (A) => A != null && typeof A === "object" && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 113946, Col 4)
gO1 = async (A, q, K = !0) => {
        return {
            ...A,
            body: await PX5(A.body, q, K)
        }
    }
// @from(Ln 113951, Col 7)
nr8
// @from(Ln 113951, Col 12)
PX5 = async (A, q, K = !0) => {
        if (!await MX5(q)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
        let Y = new FormData;
        return await Promise.all(Object.entries(A || {}).map(([z, w]) => OAA(Y, z, w, K))), Y
    }
// @from(Ln 113955, Col 7)
WX5 = (A) => A instanceof Blob && ("name" in A)
// @from(Ln 113955, Col 56)
OAA = async (A, q, K, Y) => {
        if (K === void 0) return;
        if (K == null) throw TypeError(`Received null for "${q}"; to pass null in FormData, you must use the string 'null'`);
        if (typeof K === "string" || typeof K === "number" || typeof K === "boolean") A.append(q, String(K));
        else if (K instanceof Response) {
            let z = {},
                w = K.headers.get("Content-Type");
            if (w) z = {
                type: w
            };
            A.append(q, m81([await K.blob()], Ky1(K, Y), z))
        } else if (JAA(K)) A.append(q, m81([await new Response(l76(K)).blob()], Ky1(K, Y)));
        else if (WX5(K)) A.append(q, m81([K], Ky1(K, Y), {
            type: K.type
        }));
        else if (Array.isArray(K)) await Promise.all(K.map((z) => OAA(A, q + "[]", z, Y)));
        else if (typeof K === "object") await Promise.all(Object.entries(K).map(([z, w]) => OAA(A, `${q}[${z}]`, w, Y)));
        else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${K} instead`)
    }
// @from(Ln 113974, Col 4)
UO1 = v(() => {
    nr8 = new WeakMap
})