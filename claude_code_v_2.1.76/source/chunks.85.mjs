
// @from(Ln 220020, Col 0)
class RK {
    measuredText;
    selection;
    offset;
    constructor(A, q = 0, K = 0) {
        this.measuredText = A;
        this.selection = K;
        this.offset = Math.max(0, Math.min(this.text.length, q))
    }
    static fromText(A, q, K = 0, Y = 0) {
        return new RK(new G84(A, q - 1), K, Y)
    }
    render(A, q, K, Y) {
        let {
            line: z,
            column: _
        } = this.getPosition();
        return this.measuredText.getWrappedText().map((w, O, $) => {
            let H = w;
            if (q && O === $.length - 1) {
                let Z = Array.from(bH().segment(w)),
                    G = Math.min(6, Z.length),
                    f = Z.length - G,
                    v = Z.length > G ? Z[f].index : 0;
                H = q.repeat(f) + w.slice(v)
            }
            if (z !== O) return H.trimEnd();
            let j = "",
                J = A,
                M = "",
                D = 0,
                X = !1;
            for (let {
                    segment: Z
                }
                of bH().segment(H)) {
                if (X) {
                    M += Z;
                    continue
                }
                let G = D + f8(Z);
                if (G > _) J = Z, X = !0;
                else D = G, j += Z
            }
            let P, W = "";
            if (Y && O === $.length - 1 && this.isAtEnd() && Y.text.length > 0) {
                let Z = lC6(Y.text) || Y.text[0];
                P = A ? K(Z) : Z;
                let G = Y.text.slice(Z.length);
                if (G.length > 0) W = Y.dim(G)
            } else P = A ? K(J) : J;
            return j + P + W + M.trimEnd()
        }).join(`
`)
    }
    left() {
        if (this.offset === 0) return this;
        let A = this.measuredText.prevOffset(this.offset);
        return new RK(this.measuredText, A)
    }
    right() {
        if (this.offset >= this.text.length) return this;
        let A = this.measuredText.nextOffset(this.offset);
        return new RK(this.measuredText, Math.min(A, this.text.length))
    }
    up() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (A === 0) return this;
        let K = this.measuredText.getWrappedText()[A - 1];
        if (K === void 0) return this;
        let Y = f8(K);
        if (q > Y) {
            let _ = this.getOffset({
                line: A - 1,
                column: Y
            });
            return new RK(this.measuredText, _, 0)
        }
        let z = this.getOffset({
            line: A - 1,
            column: q
        });
        return new RK(this.measuredText, z, 0)
    }
    down() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (A >= this.measuredText.lineCount - 1) return this;
        let K = this.measuredText.getWrappedText()[A + 1];
        if (K === void 0) return this;
        let Y = f8(K);
        if (q > Y) {
            let _ = this.getOffset({
                line: A + 1,
                column: Y
            });
            return new RK(this.measuredText, _, 0)
        }
        let z = this.getOffset({
            line: A + 1,
            column: q
        });
        return new RK(this.measuredText, z, 0)
    }
    startOfCurrentLine() {
        let {
            line: A
        } = this.getPosition();
        return new RK(this.measuredText, this.getOffset({
            line: A,
            column: 0
        }), 0)
    }
    startOfLine() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (q === 0 && A > 0) return new RK(this.measuredText, this.getOffset({
            line: A - 1,
            column: 0
        }), 0);
        return this.startOfCurrentLine()
    }
    firstNonBlankInLine() {
        let {
            line: A
        } = this.getPosition(), K = (this.measuredText.getWrappedText()[A] || "").match(/^\s*\S/), Y = K?.index ? K.index + K[0].length - 1 : 0, z = this.getOffset({
            line: A,
            column: Y
        });
        return new RK(this.measuredText, z, 0)
    }
    endOfLine() {
        let {
            line: A
        } = this.getPosition(), q = this.measuredText.getLineLength(A), K = this.getOffset({
            line: A,
            column: q
        });
        return new RK(this.measuredText, K, 0)
    }
    findLogicalLineStart(A = this.offset) {
        let q = this.text.lastIndexOf(`
`, A - 1);
        return q === -1 ? 0 : q + 1
    }
    findLogicalLineEnd(A = this.offset) {
        let q = this.text.indexOf(`
`, A);
        return q === -1 ? this.text.length : q
    }
    getLogicalLineBounds() {
        return {
            start: this.findLogicalLineStart(),
            end: this.findLogicalLineEnd()
        }
    }
    createCursorWithColumn(A, q, K) {
        let Y = q - A,
            z = Math.min(K, Y),
            _ = A + z,
            w = this.measuredText.snapToGraphemeBoundary(_);
        return new RK(this.measuredText, w, 0)
    }
    endOfLogicalLine() {
        return new RK(this.measuredText, this.findLogicalLineEnd(), 0)
    }
    startOfLogicalLine() {
        return new RK(this.measuredText, this.findLogicalLineStart(), 0)
    }
    firstNonBlankInLogicalLine() {
        let {
            start: A,
            end: q
        } = this.getLogicalLineBounds(), Y = this.text.slice(A, q).match(/\S/), z = A + (Y?.index ?? 0);
        return new RK(this.measuredText, z, 0)
    }
    upLogicalLine() {
        let {
            start: A
        } = this.getLogicalLineBounds();
        if (A === 0) return new RK(this.measuredText, 0, 0);
        let q = this.offset - A,
            K = A - 1,
            Y = this.findLogicalLineStart(K);
        return this.createCursorWithColumn(Y, K, q)
    }
    downLogicalLine() {
        let {
            start: A,
            end: q
        } = this.getLogicalLineBounds();
        if (q >= this.text.length) return new RK(this.measuredText, this.text.length, 0);
        let K = this.offset - A,
            Y = q + 1,
            z = this.findLogicalLineEnd(Y);
        return this.createCursorWithColumn(Y, z, K)
    }
    nextWord() {
        if (this.isAtEnd()) return this;
        let A = this.measuredText.getWordBoundaries();
        for (let q of A)
            if (q.isWordLike && q.start > this.offset) return new RK(this.measuredText, q.start);
        return new RK(this.measuredText, this.text.length)
    }
    endOfWord() {
        if (this.isAtEnd()) return this;
        let A = this.measuredText.getWordBoundaries();
        for (let q of A) {
            if (!q.isWordLike) continue;
            if (this.offset >= q.start && this.offset < q.end - 1) return new RK(this.measuredText, q.end - 1);
            if (this.offset === q.end - 1) {
                for (let K of A)
                    if (K.isWordLike && K.start > this.offset) return new RK(this.measuredText, K.end - 1);
                return this
            }
        }
        for (let q of A)
            if (q.isWordLike && q.start > this.offset) return new RK(this.measuredText, q.end - 1);
        return this
    }
    prevWord() {
        if (this.isAtStart()) return this;
        let A = this.measuredText.getWordBoundaries(),
            q = null;
        for (let K of A) {
            if (!K.isWordLike) continue;
            if (K.start < this.offset) {
                if (this.offset > K.start && this.offset <= K.end) return new RK(this.measuredText, K.start);
                q = K.start
            }
        }
        if (q !== null) return new RK(this.measuredText, q);
        return new RK(this.measuredText, 0)
    }
    nextVimWord() {
        if (this.isAtEnd()) return this;
        let A = this.offset,
            q = (Y) => this.measuredText.nextOffset(Y),
            K = this.graphemeAt(A);
        if (!K) return this;
        if (hd(K))
            while (A < this.text.length && hd(this.graphemeAt(A))) A = q(A);
        else if (Tt(K))
            while (A < this.text.length && Tt(this.graphemeAt(A))) A = q(A);
        while (A < this.text.length && LF6.test(this.graphemeAt(A))) A = q(A);
        return new RK(this.measuredText, A)
    }
    endOfVimWord() {
        if (this.isAtEnd()) return this;
        let A = this.text,
            q = this.offset,
            K = (z) => this.measuredText.nextOffset(z);
        if (this.graphemeAt(q) === "") return this;
        q = K(q);
        while (q < A.length && LF6.test(this.graphemeAt(q))) q = K(q);
        if (q >= A.length) return new RK(this.measuredText, A.length);
        let Y = this.graphemeAt(q);
        if (hd(Y))
            while (q < A.length) {
                let z = K(q);
                if (z >= A.length || !hd(this.graphemeAt(z))) break;
                q = z
            } else if (Tt(Y))
                while (q < A.length) {
                    let z = K(q);
                    if (z >= A.length || !Tt(this.graphemeAt(z))) break;
                    q = z
                }
        return new RK(this.measuredText, q)
    }
    prevVimWord() {
        if (this.isAtStart()) return this;
        let A = this.offset,
            q = (Y) => this.measuredText.prevOffset(Y);
        A = q(A);
        while (A > 0 && LF6.test(this.graphemeAt(A))) A = q(A);
        if (A === 0 && LF6.test(this.graphemeAt(0))) return new RK(this.measuredText, 0);
        let K = this.graphemeAt(A);
        if (hd(K))
            while (A > 0) {
                let Y = q(A);
                if (!hd(this.graphemeAt(Y))) break;
                A = Y
            } else if (Tt(K))
                while (A > 0) {
                    let Y = q(A);
                    if (!Tt(this.graphemeAt(Y))) break;
                    A = Y
                }
        return new RK(this.measuredText, A)
    }
    nextWORD() {
        let A = this;
        while (!A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
        while (A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
        return A
    }
    endOfWORD() {
        if (this.isAtEnd()) return this;
        let A = this;
        if (!A.isOverWhitespace() && (A.right().isOverWhitespace() || A.right().isAtEnd())) return A = A.right(), A.endOfWORD();
        if (A.isOverWhitespace()) A = A.nextWORD();
        while (!A.right().isOverWhitespace() && !A.isAtEnd()) A = A.right();
        return A
    }
    prevWORD() {
        let A = this;
        if (A.left().isOverWhitespace()) A = A.left();
        while (A.isOverWhitespace() && !A.isAtStart()) A = A.left();
        if (!A.isOverWhitespace())
            while (!A.left().isOverWhitespace() && !A.isAtStart()) A = A.left();
        return A
    }
    modifyText(A, q = "") {
        let K = this.offset,
            Y = A.offset,
            z = this.text.slice(0, K) + q + this.text.slice(Y);
        return RK.fromText(z, this.columns, K + q.normalize("NFC").length)
    }
    insert(A) {
        return this.modifyText(this, A)
    }
    del() {
        if (this.isAtEnd()) return this;
        return this.modifyText(this.right())
    }
    backspace() {
        if (this.isAtStart()) return this;
        return this.left().modifyText(this)
    }
    deleteToLineStart() {
        let A = this.startOfCurrentLine(),
            q = this.text.slice(A.offset, this.offset);
        return {
            cursor: A.modifyText(this),
            killed: q
        }
    }
    deleteToLineEnd() {
        if (this.text[this.offset] === `
`) return {
            cursor: this.modifyText(this.right()),
            killed: `
`
        };
        let A = this.endOfLine(),
            q = this.text.slice(this.offset, A.offset);
        return {
            cursor: this.modifyText(A),
            killed: q
        }
    }
    deleteToLogicalLineEnd() {
        if (this.text[this.offset] === `
`) return this.modifyText(this.right());
        return this.modifyText(this.endOfLogicalLine())
    }
    deleteWordBefore() {
        if (this.isAtStart()) return {
            cursor: this,
            killed: ""
        };
        let A = this.prevWord(),
            q = this.text.slice(A.offset, this.offset);
        return {
            cursor: A.modifyText(this),
            killed: q
        }
    }
    deleteTokenBefore() {
        if (this.isAtStart()) return null;
        let A = this.text[this.offset];
        if (A !== void 0 && !/\s/.test(A)) return null;
        let K = this.text.slice(0, this.offset).match(/(^|\s)\[(Pasted text #\d+(?: \+\d+ lines)?|\.\.\.Truncated text #\d+ \+\d+ lines\.\.\.)\]$/);
        if (K) {
            let Y = K.index + K[1].length;
            return new RK(this.measuredText, Y).modifyText(this)
        }
        return null
    }
    deleteWordAfter() {
        if (this.isAtEnd()) return this;
        return this.modifyText(this.nextWord())
    }
    graphemeAt(A) {
        if (A >= this.text.length) return "";
        let q = this.measuredText.nextOffset(A);
        return this.text.slice(A, q)
    }
    isOverWhitespace() {
        let A = this.text[this.offset] ?? "";
        return /\s/.test(A)
    }
    equals(A) {
        return this.offset === A.offset && this.measuredText === A.measuredText
    }
    isAtStart() {
        return this.offset === 0
    }
    isAtEnd() {
        return this.offset >= this.text.length
    }
    startOfFirstLine() {
        return new RK(this.measuredText, 0, 0)
    }
    startOfLastLine() {
        let A = this.text.lastIndexOf(`
`);
        if (A === -1) return this.startOfLine();
        return new RK(this.measuredText, A + 1, 0)
    }
    goToLine(A) {
        let q = this.text.split(`
`),
            K = Math.min(Math.max(0, A - 1), q.length - 1),
            Y = 0;
        for (let z = 0; z < K; z++) Y += (q[z]?.length ?? 0) + 1;
        return new RK(this.measuredText, Y, 0)
    }
    endOfFile() {
        return new RK(this.measuredText, this.text.length, 0)
    }
    get text() {
        return this.measuredText.text
    }
    get columns() {
        return this.measuredText.columns + 1
    }
    getPosition() {
        return this.measuredText.getPositionFromOffset(this.offset)
    }
    getOffset(A) {
        return this.measuredText.getOffsetFromPosition(A)
    }
    findCharacter(A, q, K = 1) {
        let Y = this.text,
            z = q === "f" || q === "t",
            _ = q === "t" || q === "T",
            w = 0;
        if (z) {
            let O = this.measuredText.nextOffset(this.offset);
            while (O < Y.length) {
                if (this.graphemeAt(O) === A) {
                    if (w++, w === K) return _ ? Math.max(this.offset, this.measuredText.prevOffset(O)) : O
                }
                O = this.measuredText.nextOffset(O)
            }
        } else {
            if (this.offset === 0) return null;
            let O = this.measuredText.prevOffset(this.offset);
            while (O >= 0) {
                if (this.graphemeAt(O) === A) {
                    if (w++, w === K) return _ ? Math.min(this.offset, this.measuredText.nextOffset(O)) : O
                }
                if (O === 0) break;
                O = this.measuredText.prevOffset(O)
            }
        }
        return null
    }
}
// @from(Ln 220488, Col 0)
class eD1 {
    text;
    startOffset;
    isPrecededByNewline;
    endsWithNewline;
    constructor(A, q, K, Y = !1) {
        this.text = A;
        this.startOffset = q;
        this.isPrecededByNewline = K;
        this.endsWithNewline = Y
    }
    equals(A) {
        return this.text === A.text && this.startOffset === A.startOffset
    }
    get length() {
        return this.text.length + (this.endsWithNewline ? 1 : 0)
    }
}
// @from(Ln 220506, Col 0)
class G84 {
    columns;
    _wrappedLines;
    text;
    navigationCache;
    graphemeBoundaries;
    constructor(A, q) {
        this.columns = q;
        this.text = A.normalize("NFC"), this.navigationCache = new Map
    }
    get wrappedLines() {
        if (!this._wrappedLines) this._wrappedLines = this.measureWrappedText();
        return this._wrappedLines
    }
    getGraphemeBoundaries() {
        if (!this.graphemeBoundaries) {
            this.graphemeBoundaries = [];
            for (let {
                    index: A
                }
                of bH().segment(this.text)) this.graphemeBoundaries.push(A);
            this.graphemeBoundaries.push(this.text.length)
        }
        return this.graphemeBoundaries
    }
    wordBoundariesCache;
    getWordBoundaries() {
        if (!this.wordBoundariesCache) {
            this.wordBoundariesCache = [];
            for (let A of e37().segment(this.text)) this.wordBoundariesCache.push({
                start: A.index,
                end: A.index + A.segment.length,
                isWordLike: A.isWordLike ?? !1
            })
        }
        return this.wordBoundariesCache
    }
    binarySearchBoundary(A, q, K) {
        let Y = 0,
            z = A.length - 1,
            _ = K ? this.text.length : 0;
        while (Y <= z) {
            let w = Math.floor((Y + z) / 2),
                O = A[w];
            if (O === void 0) break;
            if (K)
                if (O > q) _ = O, z = w - 1;
                else Y = w + 1;
            else if (O < q) _ = O, Y = w + 1;
            else z = w - 1
        }
        return _
    }
    stringIndexToDisplayWidth(A, q) {
        if (q <= 0) return 0;
        if (q >= A.length) return f8(A);
        return f8(A.substring(0, q))
    }
    displayWidthToStringIndex(A, q) {
        if (q <= 0) return 0;
        if (!A) return 0;
        if (A === this.text) return this.offsetAtDisplayWidth(q);
        let K = 0,
            Y = 0;
        for (let {
                segment: z,
                index: _
            }
            of bH().segment(A)) {
            let w = f8(z);
            if (K + w > q) break;
            K += w, Y = _ + z.length
        }
        return Y
    }
    offsetAtDisplayWidth(A) {
        if (A <= 0) return 0;
        let q = 0,
            K = this.getGraphemeBoundaries();
        for (let Y = 0; Y < K.length - 1; Y++) {
            let z = K[Y],
                _ = K[Y + 1];
            if (z === void 0 || _ === void 0) continue;
            let w = this.text.substring(z, _),
                O = f8(w);
            if (q + O > A) return z;
            q += O
        }
        return this.text.length
    }
    measureWrappedText() {
        let A = OK6(this.text, this.columns, {
                hard: !0,
                trim: !1
            }),
            q = [],
            K = 0,
            Y = -1,
            z = A.split(`
`);
        for (let _ = 0; _ < z.length; _++) {
            let w = z[_],
                O = ($) => _ === 0 || $ > 0 && this.text[$ - 1] === `
`;
            if (w.length === 0)
                if (Y = this.text.indexOf(`
`, Y + 1), Y !== -1) {
                    let $ = Y,
                        H = !0;
                    q.push(new eD1(w, $, O($), !0))
                } else {
                    let $ = this.text.length;
                    q.push(new eD1(w, $, O($), !1))
                }
            else {
                let $ = this.text.indexOf(w, K);
                if ($ === -1) throw Error("Failed to find wrapped line in text");
                K = $ + w.length;
                let H = $ + w.length,
                    j = H < this.text.length && this.text[H] === `
`;
                if (j) Y = H;
                q.push(new eD1(w, $, O($), j))
            }
        }
        return q
    }
    getWrappedText() {
        return this.wrappedLines.map((A) => A.isPrecededByNewline ? A.text : A.text.trimStart())
    }
    getWrappedLines() {
        return this.wrappedLines
    }
    getLine(A) {
        let q = this.wrappedLines;
        return q[Math.max(0, Math.min(A, q.length - 1))]
    }
    getOffsetFromPosition(A) {
        let q = this.getLine(A.line);
        if (q.text.length === 0 && q.endsWithNewline) return q.startOffset;
        let K = q.isPrecededByNewline ? 0 : q.text.length - q.text.trimStart().length,
            Y = A.column + K,
            z = this.displayWidthToStringIndex(q.text, Y),
            _ = q.startOffset + z,
            w = q.startOffset + q.text.length,
            O = w,
            $ = f8(q.text);
        if (q.endsWithNewline && A.column > $) O = w + 1;
        return Math.min(_, O)
    }
    getLineLength(A) {
        let q = this.getLine(A);
        return f8(q.text)
    }
    getPositionFromOffset(A) {
        let q = this.wrappedLines;
        for (let z = 0; z < q.length; z++) {
            let _ = q[z],
                w = q[z + 1];
            if (A >= _.startOffset && (!w || A < w.startOffset)) {
                let O = A - _.startOffset,
                    $;
                if (_.isPrecededByNewline) $ = this.stringIndexToDisplayWidth(_.text, O);
                else {
                    let H = _.text.length - _.text.trimStart().length;
                    if (O < H) $ = 0;
                    else {
                        let j = _.text.trimStart(),
                            J = O - H;
                        $ = this.stringIndexToDisplayWidth(j, J)
                    }
                }
                return {
                    line: z,
                    column: Math.max(0, $)
                }
            }
        }
        let K = q.length - 1,
            Y = this.wrappedLines[K];
        return {
            line: K,
            column: f8(Y.text)
        }
    }
    get lineCount() {
        return this.wrappedLines.length
    }
    withCache(A, q) {
        let K = this.navigationCache.get(A);
        if (K !== void 0) return K;
        let Y = q();
        return this.navigationCache.set(A, Y), Y
    }
    nextOffset(A) {
        return this.withCache(`next:${A}`, () => {
            let q = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(q, A, !0)
        })
    }
    prevOffset(A) {
        if (A <= 0) return 0;
        return this.withCache(`prev:${A}`, () => {
            let q = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(q, A, !1)
        })
    }
    snapToGraphemeBoundary(A) {
        if (A <= 0) return 0;
        if (A >= this.text.length) return this.text.length;
        let q = this.getGraphemeBoundaries(),
            K = 0,
            Y = q.length - 1;
        while (K < Y) {
            let z = K + Y + 1 >> 1;
            if (q[z] <= A) K = z;
            else Y = z - 1
        }
        return q[K]
    }
}
// @from(Ln 220727, Col 4)
JN9 = 10
// @from(Ln 220728, Col 4)
OR
// @from(Ln 220728, Col 8)
tD1 = 0
// @from(Ln 220729, Col 4)
HT8 = !1
// @from(Ln 220730, Col 4)
Z84 = 0
// @from(Ln 220731, Col 4)
jT8 = 0
// @from(Ln 220732, Col 4)
AX1 = !1
// @from(Ln 220733, Col 4)
MN9
// @from(Ln 220733, Col 9)
LF6
// @from(Ln 220733, Col 14)
hd = (A) => MN9.test(A)
// @from(Ln 220734, Col 4)
_X1 = (A) => LF6.test(A)
// @from(Ln 220735, Col 4)
Tt = (A) => A.length > 0 && !_X1(A) && !hd(A)
// @from(Ln 220736, Col 4)
j36 = E(() => {
    zO1();
    q3();
    AL();
    OR = [];
    MN9 = /^[\p{L}\p{N}\p{M}_]$/u, LF6 = /\s/
})
// @from(Ln 220747, Col 0)
function JT8() {
    let A = $1().existsSync(DN9(G1(), "CLAUDE.md")),
        q = N84(G1());
    return [{
        key: "workspace",
        text: "Ask Claude to create a new app or clone a repository",
        isComplete: !1,
        isCompletable: !0,
        isEnabled: q
    }, {
        key: "claudemd",
        text: "Run /init to create a CLAUDE.md file with instructions for Claude",
        isComplete: A,
        isCompletable: !0,
        isEnabled: !q
    }]
}
// @from(Ln 220765, Col 0)
function f84() {
    return JT8().filter(({
        isCompletable: A,
        isEnabled: q
    }) => A && q).every(({
        isComplete: A
    }) => A)
}
// @from(Ln 220774, Col 0)
function h06() {
    if (d2().hasCompletedProjectOnboarding) return;
    if (f84()) c2((A) => ({
        ...A,
        hasCompletedProjectOnboarding: !0
    }))
}
// @from(Ln 220782, Col 0)
function v84() {
    c2((A) => ({
        ...A,
        projectOnboardingSeenCount: A.projectOnboardingSeenCount + 1
    }))
}
// @from(Ln 220788, Col 4)
T84
// @from(Ln 220789, Col 4)
SF6 = E(() => {
    k8();
    Z7();
    lA();
    SA();
    U4();
    T84 = e1(() => {
        if (f84() || d2().projectOnboardingSeenCount >= 4 || process.env.IS_DEMO) return !1;
        return !0
    })
})
// @from(Ln 220810, Col 0)
function WN9(A) {
    d1((q) => ({
        ...q,
        appleTerminalSetupInProgress: !0,
        appleTerminalBackupPath: A
    }))
}
// @from(Ln 220818, Col 0)
function S06() {
    d1((A) => ({
        ...A,
        appleTerminalSetupInProgress: !1
    }))
}
// @from(Ln 220825, Col 0)
function ZN9() {
    let A = X1();
    return {
        inProgress: A.appleTerminalSetupInProgress ?? !1,
        backupPath: A.appleTerminalBackupPath || null
    }
}
// @from(Ln 220833, Col 0)
function C06() {
    return PN9(XN9(), "Library", "Preferences", "com.apple.Terminal.plist")
}
// @from(Ln 220836, Col 0)
async function k84() {
    let A = C06(),
        q = `${A}.bak`;
    try {
        let {
            code: K
        } = await z8("defaults", ["export", "com.apple.Terminal", A]);
        if (K !== 0) return null;
        try {
            await V84(A)
        } catch {
            return null
        }
        return await z8("defaults", ["export", "com.apple.Terminal", q]), WN9(q), q
    } catch (K) {
        return _6(K), null
    }
}
// @from(Ln 220854, Col 0)
async function wX1() {
    let {
        inProgress: A,
        backupPath: q
    } = ZN9();
    if (!A) return {
        status: "no_backup"
    };
    if (!q) return S06(), {
        status: "no_backup"
    };
    try {
        await V84(q)
    } catch {
        return S06(), {
            status: "no_backup"
        }
    }
    try {
        let {
            code: K
        } = await z8("defaults", ["import", "com.apple.Terminal", q]);
        if (K !== 0) return {
            status: "failed",
            backupPath: q
        };
        return await z8("killall", ["cfprefsd"]), S06(), {
            status: "restored"
        }
    } catch (K) {
        return _6(Error(`Failed to restore Terminal.app settings with: ${K}`)), S06(), {
            status: "failed",
            backupPath: q
        }
    }
}
// @from(Ln 220890, Col 4)
MT8 = E(() => {
    Eq();
    k1();
    k8()
})
// @from(Ln 220903, Col 0)
function fN9() {
    let A = process.env.SHELL || "",
        q = GN9(),
        K = vt(q, ".claude");
    if (A.endsWith("/zsh") || A.endsWith("/zsh.exe")) {
        let Y = vt(K, "completion.zsh");
        return {
            name: "zsh",
            rcFile: vt(q, ".zshrc"),
            cacheFile: Y,
            completionLine: `[[ -f "${Y}" ]] && source "${Y}"`,
            shellFlag: "zsh"
        }
    }
    if (A.endsWith("/bash") || A.endsWith("/bash.exe")) {
        let Y = vt(K, "completion.bash");
        return {
            name: "bash",
            rcFile: vt(q, ".bashrc"),
            cacheFile: Y,
            completionLine: `[ -f "${Y}" ] && source "${Y}"`,
            shellFlag: "bash"
        }
    }
    if (A.endsWith("/fish") || A.endsWith("/fish.exe")) {
        let Y = process.env.XDG_CONFIG_HOME || vt(q, ".config"),
            z = vt(K, "completion.fish");
        return {
            name: "fish",
            rcFile: vt(Y, "fish", "config.fish"),
            cacheFile: z,
            completionLine: `[ -f "${z}" ] && source "${z}"`,
            shellFlag: "fish"
        }
    }
    return null
}
// @from(Ln 220940, Col 0)
async function DT8() {
    let A = fN9();
    if (!A) return;
    k(`update: Regenerating ${A.name} completion cache`);
    let q = process.argv[1] || "claude";
    if ((await z8(q, ["completion", A.shellFlag, "--output", A.cacheFile])).code !== 0) {
        k(`update: Failed to regenerate ${A.name} completion cache`);
        return
    }
    k(`update: Regenerated ${A.name} completion cache at ${A.cacheFile}`)
}
// @from(Ln 220951, Col 4)
XT8 = E(() => {
    bK6();
    mU();
    H1();
    Eq();
    k1()
})
// @from(Ln 220958, Col 4)
L84 = {}
// @from(Ln 220989, Col 0)
function NN9() {
    let A = process.env.VSCODE_GIT_ASKPASS_MAIN ?? "",
        q = process.env.PATH ?? "";
    return A.includes(".vscode-server") || A.includes(".cursor-server") || A.includes(".windsurf-server") || q.includes(".vscode-server") || q.includes(".cursor-server") || q.includes(".windsurf-server")
}
// @from(Ln 220995, Col 0)
function NT8() {
    if (!Q8.terminal || !(Q8.terminal in $X1)) return null;
    return $X1[Q8.terminal] ?? null
}
// @from(Ln 221000, Col 0)
function $R(A) {
    if (!cG()) return A;
    return `\x1B]8;;${vN9(A).href}\x07${A}\x1B]8;;\x07`
}
// @from(Ln 221005, Col 0)
function I06() {
    return OX1() === "darwin" && Q8.terminal === "Apple_Terminal" || Q8.terminal === "vscode" || Q8.terminal === "cursor" || Q8.terminal === "windsurf" || Q8.terminal === "alacritty" || Q8.terminal === "zed"
}
// @from(Ln 221008, Col 0)
async function HX1(A) {
    let q = "";
    switch (Q8.terminal) {
        case "Apple_Terminal":
            q = await kN9(A);
            break;
        case "vscode":
            q = await PT8("VSCode", A);
            break;
        case "cursor":
            q = await PT8("Cursor", A);
            break;
        case "windsurf":
            q = await PT8("Windsurf", A);
            break;
        case "alacritty":
            q = await EN9(A);
            break;
        case "zed":
            q = await yN9(A);
            break;
        case null:
            break
    }
    return d1((K) => {
        if (["vscode", "cursor", "windsurf", "alacritty", "zed"].includes(Q8.terminal ?? "")) {
            if (K.shiftEnterKeyBindingInstalled === !0) return K;
            return {
                ...K,
                shiftEnterKeyBindingInstalled: !0
            }
        } else if (Q8.terminal === "Apple_Terminal") {
            if (K.optionAsMetaKeyInstalled === !0) return K;
            return {
                ...K,
                optionAsMetaKeyInstalled: !0
            }
        }
        return K
    }), h06(), q
}
// @from(Ln 221050, Col 0)
function VT8() {
    return X1().shiftEnterKeyBindingInstalled === !0
}
// @from(Ln 221054, Col 0)
function kT8() {
    return X1().hasUsedBackslashReturn === !0
}
// @from(Ln 221058, Col 0)
function ET8() {
    if (!X1().hasUsedBackslashReturn) d1((q) => ({
        ...q,
        hasUsedBackslashReturn: !0
    }))
}
// @from(Ln 221064, Col 0)
async function VN9(A, q, K) {
    if (Q8.terminal && Q8.terminal in $X1) {
        let z = `Shift+Enter is natively supported in ${$X1[Q8.terminal]}.

No configuration needed. Just use Shift+Enter to add newlines.`;
        return A(z), null
    }
    if (!I06()) {
        let z = Q8.terminal || "your current terminal",
            _ = y8(),
            w = "";
        if (_ === "macos") w = `   • macOS: Apple Terminal
`;
        else if (_ === "windows") w = `   • Windows: Windows Terminal
`;
        let O = `Terminal setup cannot be run from ${z}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${O1.dim("Note: You can already use backslash (\\\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${w}   • IDE: VSCode, Cursor, Windsurf, Zed
   • Other: Alacritty
3. Return to tmux/screen - settings will persist

${O1.dim("Note: iTerm2, WezTerm, Ghostty, Kitty, and Warp support Shift+Enter natively.")}`;
        return A(O), null
    }
    let Y = await HX1(q.options.theme);
    return A(Y), null
}
// @from(Ln 221097, Col 0)
async function PT8(A = "VSCode", q) {
    if (NN9()) return `${kA("warning",q)(`Cannot install keybindings from a remote ${A} session.`)}${E9}${E9}${A} keybindings must be installed on your local machine, not the remote server.${E9}${E9}To install the Shift+Enter keybinding:${E9}1. Open ${A} on your local machine (not connected to remote)${E9}2. Open the Command Palette (Cmd/Ctrl+Shift+P) → "Preferences: Open Keyboard Shortcuts (JSON)"${E9}3. Add this keybinding (the file must be a JSON array):${E9}${E9}${O1.dim(`[
  {
    "key": "shift+enter",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "\\u001b\\r" },
    "when": "terminalFocus"
  }
]`)}${E9}`;
    let K = A === "VSCode" ? "Code" : A,
        Y = XB(vT8(), OX1() === "win32" ? XB("AppData", "Roaming", K, "User") : OX1() === "darwin" ? XB("Library", "Application Support", K, "User") : XB(".config", K, "User")),
        z = XB(Y, "keybindings.json");
    try {
        await GT8(Y, {
            recursive: !0
        });
        let _ = "[]",
            w = [],
            O = !1;
        try {
            _ = await fT8(z, {
                encoding: "utf-8"
            }), O = !0, w = GjA(_) ?? []
        } catch (J) {
            let M = J.code;
            if (M !== "ENOENT" && M !== "EACCES" && M !== "EPERM") throw J
        }
        if (O) {
            let J = WT8(4).toString("hex"),
                M = `${z}.${J}.bak`;
            try {
                await ZT8(z, M)
            } catch {
                return `${kA("warning",q)(`Error backing up existing ${A} terminal keybindings. Bailing out.`)}${E9}${O1.dim(`See ${$R(z)}`)}${E9}${O1.dim(`Backup path: ${$R(M)}`)}${E9}`
            }
        }
        if (w.find((J) => J.key === "shift+enter" && J.command === "workbench.action.terminal.sendSequence" && J.when === "terminalFocus")) return `${kA("warning",q)(`Found existing ${A} terminal Shift+Enter key binding. Remove it to continue.`)}${E9}${O1.dim(`See ${$R(z)}`)}${E9}`;
        let j = TjA(_, {
            key: "shift+enter",
            command: "workbench.action.terminal.sendSequence",
            args: {
                text: "\x1B\r"
            },
            when: "terminalFocus"
        });
        return await TT8(z, j, {
            encoding: "utf-8"
        }), `${kA("success",q)(`Installed ${A} terminal Shift+Enter key binding`)}${E9}${O1.dim(`See ${$R(z)}`)}${E9}`
    } catch (_) {
        throw _6(_), Error(`Failed to install ${A} terminal Shift+Enter key binding`)
    }
}
// @from(Ln 221149, Col 0)
async function E84(A) {
    let {
        code: q
    } = await z8("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':useOptionAsMetaKey bool true`, C06()]);
    if (q !== 0) {
        let {
            code: K
        } = await z8("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':useOptionAsMetaKey true`, C06()]);
        if (K !== 0) return _6(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${A}`)), !1
    }
    return !0
}
// @from(Ln 221161, Col 0)
async function y84(A) {
    let {
        code: q
    } = await z8("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':Bell bool false`, C06()]);
    if (q !== 0) {
        let {
            code: K
        } = await z8("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':Bell false`, C06()]);
        if (K !== 0) return _6(Error(`Failed to disable audio bell for Terminal.app profile: ${A}`)), !1
    }
    return !0
}
// @from(Ln 221173, Col 0)
async function kN9(A) {
    try {
        if (!await k84()) throw Error("Failed to create backup of Terminal.app preferences, bailing out");
        let {
            stdout: K,
            code: Y
        } = await z8("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
        if (Y !== 0 || !K.trim()) throw Error("Failed to read default Terminal.app profile");
        let {
            stdout: z,
            code: _
        } = await z8("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
        if (_ !== 0 || !z.trim()) throw Error("Failed to read startup Terminal.app profile");
        let w = !1,
            O = K.trim(),
            $ = await E84(O),
            H = await y84(O);
        if ($ || H) w = !0;
        let j = z.trim();
        if (j !== O) {
            let J = await E84(j),
                M = await y84(j);
            if (J || M) w = !0
        }
        if (!w) throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
        return await z8("killall", ["cfprefsd"]), S06(), `${kA("success",A)("Configured Terminal.app settings:")}${E9}${kA("success",A)('- Enabled "Use Option as Meta key"')}${E9}${kA("success",A)("- Switched to visual bell")}${E9}${O1.dim("Option+Enter will now enter a newline.")}${E9}${O1.dim("You must restart Terminal.app for changes to take effect.",A)}${E9}`
    } catch (q) {
        _6(q);
        let K = await wX1(),
            Y = "Failed to enable Option as Meta key for Terminal.app.";
        if (K.status === "restored") throw Error(`${Y} Your settings have been restored from backup.`);
        else if (K.status === "failed") throw Error(`${Y} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${K.backupPath}`);
        else throw Error(`${Y} No backup was available to restore from.`)
    }
}
// @from(Ln 221208, Col 0)
async function EN9(A) {
    let K = [],
        Y = process.env.XDG_CONFIG_HOME;
    if (Y) K.push(XB(Y, "alacritty", "alacritty.toml"));
    else K.push(XB(vT8(), ".config", "alacritty", "alacritty.toml"));
    if (OX1() === "win32") {
        let O = process.env.APPDATA;
        if (O) K.push(XB(O, "alacritty", "alacritty.toml"))
    }
    let z = null,
        _ = "",
        w = !1;
    for (let O of K) try {
        _ = await fT8(O, {
            encoding: "utf-8"
        }), z = O, w = !0;
        break
    } catch ($) {
        let H = $.code;
        if (H !== "ENOENT" && H !== "EACCES" && H !== "EPERM") throw $
    }
    if (!z) z = K[0] ?? null;
    if (!z) throw Error("No valid config path found for Alacritty");
    try {
        if (w) {
            if (_.includes('mods = "Shift"') && _.includes('key = "Return"')) return `${kA("warning",A)("Found existing Alacritty Shift+Enter key binding. Remove it to continue.")}${E9}${O1.dim(`See ${$R(z)}`)}${E9}`;
            let $ = WT8(4).toString("hex"),
                H = `${z}.${$}.bak`;
            try {
                await ZT8(z, H)
            } catch {
                return `${kA("warning",A)("Error backing up existing Alacritty config. Bailing out.")}${E9}${O1.dim(`See ${$R(z)}`)}${E9}${O1.dim(`Backup path: ${$R(H)}`)}${E9}`
            }
        } else await GT8(TN9(z), {
            recursive: !0
        });
        let O = _;
        if (_ && !_.endsWith(`
`)) O += `
`;
        return O += `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\u001B\\r"
`, await TT8(z, O, {
            encoding: "utf-8"
        }), `${kA("success",A)("Installed Alacritty Shift+Enter key binding")}${E9}${kA("success",A)("You may need to restart Alacritty for changes to take effect")}${E9}${O1.dim(`See ${$R(z)}`)}${E9}`
    } catch (O) {
        throw _6(O), Error("Failed to install Alacritty Shift+Enter key binding")
    }
}
// @from(Ln 221260, Col 0)
async function yN9(A) {
    let q = XB(vT8(), ".config", "zed"),
        K = XB(q, "keymap.json");
    try {
        await GT8(q, {
            recursive: !0
        });
        let Y = "[]",
            z = !1;
        try {
            Y = await fT8(K, {
                encoding: "utf-8"
            }), z = !0
        } catch (w) {
            let O = w.code;
            if (O !== "ENOENT" && O !== "EACCES" && O !== "EPERM") throw w
        }
        if (z) {
            if (Y.includes("shift-enter")) return `${kA("warning",A)("Found existing Zed Shift+Enter key binding. Remove it to continue.")}${E9}${O1.dim(`See ${$R(K)}`)}${E9}`;
            let w = WT8(4).toString("hex"),
                O = `${K}.${w}.bak`;
            try {
                await ZT8(K, O)
            } catch {
                return `${kA("warning",A)("Error backing up existing Zed keymap. Bailing out.")}${E9}${O1.dim(`See ${$R(K)}`)}${E9}${O1.dim(`Backup path: ${$R(O)}`)}${E9}`
            }
        }
        let _;
        try {
            if (_ = i1(Y), !Array.isArray(_)) _ = []
        } catch {
            _ = []
        }
        return _.push({
            context: "Terminal",
            bindings: {
                "shift-enter": ["terminal::SendText", "\x1B\r"]
            }
        }), await TT8(K, B6(_, null, 2) + `
`, {
            encoding: "utf-8"
        }), `${kA("success",A)("Installed Zed Shift+Enter key binding")}${E9}${O1.dim(`See ${$R(K)}`)}${E9}`
    } catch (Y) {
        throw _6(Y), Error("Failed to install Zed Shift+Enter key binding")
    }
}
// @from(Ln 221306, Col 4)
E9 = `
`
// @from(Ln 221308, Col 4)
$X1
// @from(Ln 221309, Col 4)
J36 = E(() => {
    aK();
    mU();
    SF6();
    MT8();
    k8();
    d3();
    Eq();
    K_();
    k1();
    i6();
    YK();
    g1();
    XT8();
    $X1 = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm",
        WarpTerminal: "Warp"
    }
})
// @from(Ln 221346, Col 0)
function LT8() {
    return yT8(c8(), xN9)
}
// @from(Ln 221350, Col 0)
function R84(A) {
    return LN9("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Ln 221354, Col 0)
function h84(A) {
    return yT8(LT8(), `${A}.txt`)
}
// @from(Ln 221357, Col 0)
async function S84(A, q) {
    try {
        let K = LT8();
        await RN9(K, {
            recursive: !0
        });
        let Y = h84(A);
        await hN9(Y, q, {
            encoding: "utf8",
            mode: 384
        }), k(`Stored paste ${A} to ${Y}`)
    } catch (K) {
        k(`Failed to store paste: ${K}`)
    }
}
// @from(Ln 221372, Col 0)
async function C84(A) {
    try {
        let q = h84(A);
        return await SN9(q, {
            encoding: "utf8"
        })
    } catch (q) {
        if (q && typeof q === "object" && "code" in q) {
            if (q.code !== "ENOENT") k(`Failed to retrieve paste ${A}: ${q}`)
        }
        return null
    }
}
// @from(Ln 221385, Col 0)
async function I84(A) {
    let q = LT8(),
        K;
    try {
        K = await CN9(q)
    } catch {
        return
    }
    let Y = A.getTime();
    for (let z of K) {
        if (!z.endsWith(".txt")) continue;
        let _ = yT8(q, z);
        try {
            if ((await IN9(_)).mtimeMs < Y) await bN9(_), k(`Cleaned up old paste: ${_}`)
        } catch {}
    }
}
// @from(Ln 221402, Col 4)
xN9 = "paste-cache"
// @from(Ln 221403, Col 4)
RT8 = E(() => {
    A8();
    H1()
})
// @from(Ln 221415, Col 0)
function b06(A) {
    return (A.match(/\r\n|\r|\n/g) || []).length
}
// @from(Ln 221419, Col 0)
function JX1(A, q) {
    if (q === 0) return `[Pasted text #${A}]`;
    return `[Pasted text #${A} +${q} lines]`
}
// @from(Ln 221424, Col 0)
function x06(A) {
    let q = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
    return [...A.matchAll(q)].map((Y) => ({
        id: parseInt(Y[2] || "0"),
        match: Y[0]
    })).filter((Y) => Y.id > 0)
}
// @from(Ln 221432, Col 0)
function gN9(A) {
    return i1(A)
}
// @from(Ln 221435, Col 0)
async function* B84() {
    for (let q = Cd.length - 1; q >= 0; q--) yield Cd[q];
    let A = u84(c8(), "history.jsonl");
    try {
        for await (let q of BAA(A)) try {
            yield gN9(q)
        } catch (K) {
            k(`Failed to parse history line: ${K}`)
        }
    } catch (q) {
        if (q.code === "ENOENT") return;
        throw q
    }
}
// @from(Ln 221449, Col 0)
async function* CT8() {
    for await (let A of B84()) yield await ST8(A)
}
// @from(Ln 221452, Col 0)
async function* MX1() {
    let A = qY(),
        q = R1(),
        K = [],
        Y = 0;
    for await (let z of B84()) {
        if (!z || typeof z.project !== "string") continue;
        if (z.project !== A) continue;
        if (z.sessionId === q) yield await ST8(z), Y++;
        else K.push(z);
        if (Y + K.length >= b84) break
    }
    for (let z of K) {
        if (Y >= b84) return;
        yield await ST8(z), Y++
    }
}
// @from(Ln 221469, Col 0)
async function FN9(A) {
    if (A.content) return {
        id: A.id,
        type: A.type,
        content: A.content,
        mediaType: A.mediaType,
        filename: A.filename
    };
    if (A.contentHash) {
        let q = await C84(A.contentHash);
        if (q) return {
            id: A.id,
            type: A.type,
            content: q,
            mediaType: A.mediaType,
            filename: A.filename
        }
    }
    return null
}
// @from(Ln 221489, Col 0)
async function ST8(A) {
    let q = {};
    for (let [K, Y] of Object.entries(A.pastedContents || {})) {
        let z = await FN9(Y);
        if (z) q[Number(K)] = z
    }
    return {
        display: A.display,
        pastedContents: q
    }
}
// @from(Ln 221500, Col 0)
async function g84() {
    if (Cd.length === 0) return;
    let A;
    try {
        let q = u84(c8(), "history.jsonl");
        await mN9(q, "", {
            encoding: "utf8",
            mode: 384,
            flag: "a"
        }), A = await m84.lock(q, {
            stale: 1e4,
            retries: {
                retries: 3,
                minTimeout: 50
            }
        });
        let K = Cd.map((Y) => B6(Y) + `
`);
        Cd = [], await uN9(q, K.join(""), {
            mode: 384
        })
    } catch (q) {
        k(`Failed to write prompt history: ${q}`)
    } finally {
        if (A) await A()
    }
}
// @from(Ln 221527, Col 0)
async function F84(A) {
    if (hT8 || Cd.length === 0) return;
    if (A > 5) return;
    hT8 = !0;
    try {
        await g84()
    } finally {
        if (hT8 = !1, Cd.length > 0) await new Promise((q) => setTimeout(q, 500)), F84(A + 1)
    }
}
// @from(Ln 221537, Col 0)
async function pN9(A) {
    let q = typeof A === "string" ? {
            display: A,
            pastedContents: {}
        } : A,
        K = {};
    if (q.pastedContents)
        for (let [z, _] of Object.entries(q.pastedContents)) {
            if (_.type === "image") continue;
            if (_.content.length <= BN9) K[Number(z)] = {
                id: _.id,
                type: _.type,
                content: _.content,
                mediaType: _.mediaType,
                filename: _.filename
            };
            else {
                let w = R84(_.content);
                K[Number(z)] = {
                    id: _.id,
                    type: _.type,
                    contentHash: w,
                    mediaType: _.mediaType,
                    filename: _.filename
                }, S84(w, _.content)
            }
        }
    let Y = {
        ...q,
        pastedContents: K,
        timestamp: Date.now(),
        project: qY(),
        sessionId: R1()
    };
    Cd.push(Y), jX1 = F84(0)
}
// @from(Ln 221574, Col 0)
function M36(A) {
    if (t6(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)) return;
    if (!x84) x84 = !0, E4(async () => {
        if (jX1) await jX1;
        if (Cd.length > 0) await g84()
    });
    pN9(A)
}
// @from(Ln 221582, Col 4)
m84
// @from(Ln 221582, Col 9)
b84 = 100
// @from(Ln 221583, Col 4)
BN9 = 1024
// @from(Ln 221584, Col 4)
Cd
// @from(Ln 221584, Col 8)
hT8 = !1
// @from(Ln 221585, Col 4)
jX1 = null
// @from(Ln 221586, Col 4)
x84 = !1
// @from(Ln 221587, Col 4)
ZI = E(() => {
    A8();
    SA();
    T1();
    H1();
    KY();
    g1();
    RT8();
    m84 = t(nx(), 1);
    Cd = []
})
// @from(Ln 221599, Col 0)
function p84(A, q) {
    switch (q) {
        case "bash":
            return `!${A}`;
        default:
            return A
    }
}
// @from(Ln 221608, Col 0)
function PB(A) {
    if (A.startsWith("!")) return "bash";
    return "prompt"
}
// @from(Ln 221613, Col 0)
function D36(A) {
    if (PB(A) === "prompt") return A;
    return A.slice(1)
}
// @from(Ln 221618, Col 0)
function Q84(A) {
    return A === "!"
}
// @from(Ln 221622, Col 0)
function u06(A) {
    let q = DX1.useCallback((K) => {
        let Y = PA();
        A(K, Y)
    }, [A]);
    DX1.useEffect(() => tO.subscribe(q), [q])
}
// @from(Ln 221629, Col 4)
DX1
// @from(Ln 221630, Col 4)
XX1 = E(() => {
    Hm();
    i8();
    DX1 = t(P6(), 1)
})
// @from(Ln 221636, Col 0)
function GI() {
    return !w8("tengu_amber_quartz_disabled", !1)
}
// @from(Ln 221640, Col 0)
function IT8() {
    if (!iH()) return !1;
    let A = sA();
    return Boolean(A?.accessToken)
}
// @from(Ln 221646, Col 0)
function m06() {
    return IT8() && GI()
}
// @from(Ln 221649, Col 4)
Id = E(() => {
    HA();
    fA()
})
// @from(Ln 221654, Col 0)
function PX1(A, q) {
    let K = mA();
    k(`Settings changed from ${A}, updating app state`);
    let Y = tz1();
    gJ7(), q((z) => {
        let _ = U84(z.toolPermissionContext, Y);
        if (_.isBypassPermissionsModeAvailable && bd()) _ = X36(_);
        let w = z.settings.effortLevel,
            O = K.effortLevel;
        return {
            ...z,
            settings: K,
            toolPermissionContext: _,
            ...w !== O && O !== void 0 ? {
                effortValue: O
            } : {},
            ...{
                voiceEnabled: K.voiceEnabled === !0 && IT8()
            }
        }
    })
}
// @from(Ln 221676, Col 4)
bT8 = E(() => {
    i8();
    H1();
    Bj();
    Km();
    rJ();
    tI6();
    Id()
})
// @from(Ln 221685, Col 0)
class xT8 {
    queue = [];
    waiters = [];
    listeners = new Set;
    _revision = 0;
    get length() {
        return this.queue.length
    }
    get revision() {
        return this._revision
    }
    send(A) {
        this._revision++;
        let q = this.waiters.findIndex((K) => K.fn(A));
        if (q !== -1) {
            let K = this.waiters.splice(q, 1)[0];
            if (K) {
                K.resolve(A), this.notify();
                return
            }
        }
        this.queue.push(A), this.notify()
    }
    poll(A = () => !0) {
        let q = this.queue.findIndex(A);
        if (q === -1) return;
        return this.queue.splice(q, 1)[0]
    }
    receive(A = () => !0) {
        let q = this.queue.findIndex(A);
        if (q !== -1) {
            let K = this.queue.splice(q, 1)[0];
            if (K) return this.notify(), Promise.resolve(K)
        }
        return new Promise((K) => {
            this.waiters.push({
                fn: A,
                resolve: K
            })
        })
    }
    subscribe(A) {
        return this.listeners.add(A), () => {
            this.listeners.delete(A)
        }
    }
    notify() {
        for (let A of this.listeners) A()
    }
}
// @from(Ln 221736, Col 0)
function c84(A) {
    let q = A6(3),
        {
            children: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = new xT8, q[0] = Y;
    else Y = q[0];
    let z = Y,
        _;
    if (q[1] !== K) _ = B06.default.createElement(d84.Provider, {
        value: z
    }, K), q[1] = K, q[2] = _;
    else _ = q[2];
    return _
}
// @from(Ln 221753, Col 0)
function l84() {
    let A = B06.useContext(d84);
    if (!A) throw Error("useMailbox must be used within a MailboxProvider");
    return A
}
// @from(Ln 221758, Col 4)
B06
// @from(Ln 221758, Col 9)
d84
// @from(Ln 221759, Col 4)
uT8 = E(() => {
    e6();
    B06 = t(P6(), 1), d84 = B06.createContext(void 0)
})
// @from(Ln 221764, Col 0)
function WX1(A, q) {
    let K = A,
        Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K,
                w = z(_);
            if (Object.is(w, _)) return;
            K = w, q?.({
                newState: w,
                oldState: _
            });
            for (let O of Y) O()
        },
        subscribe: (z) => {
            return Y.add(z), () => Y.delete(z)
        }
    }
}
// @from(Ln 221791, Col 0)
function r84(A) {
    let q = i84.sep + A.split(dN9).join(i84.sep).replace(/^\/+/, ""),
        K = QN9(A).toLowerCase(),
        Y = UN9(A).toLowerCase();
    if (cN9.has(K)) return !0;
    if (n84.has(Y)) return !0;
    let z = K.split(".");
    if (z.length > 2) {
        let _ = "." + z.slice(-2).join(".");
        if (n84.has(_)) return !0
    }
    for (let _ of lN9)
        if (q.includes(_)) return !0;
    for (let _ of iN9)
        if (_.test(K)) return !0;
    return !1
}
// @from(Ln 221808, Col 4)
cN9
// @from(Ln 221808, Col 9)
n84
// @from(Ln 221808, Col 14)
lN9
// @from(Ln 221808, Col 19)
iN9
// @from(Ln 221809, Col 4)
o84 = E(() => {
    cN9 = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "bun.lock", "composer.lock", "gemfile.lock", "cargo.lock", "poetry.lock", "pipfile.lock", "shrinkwrap.json", "npm-shrinkwrap.json"]), n84 = new Set([".lock", ".min.js", ".min.css", ".min.html", ".bundle.js", ".bundle.css", ".generated.ts", ".generated.js", ".d.ts"]), lN9 = ["/dist/", "/build/", "/out/", "/output/", "/node_modules/", "/vendor/", "/vendored/", "/third_party/", "/third-party/", "/external/", "/.next/", "/.nuxt/", "/.svelte-kit/", "/coverage/", "/__pycache__/", "/.tox/", "/venv/", "/.venv/", "/target/release/", "/target/debug/"], iN9 = [/^.*\.min\.[a-z]+$/i, /^.*-min\.[a-z]+$/i, /^.*\.bundle\.[a-z]+$/i, /^.*\.generated\.[a-z]+$/i, /^.*\.gen\.[a-z]+$/i, /^.*\.auto\.[a-z]+$/i, /^.*_generated\.[a-z]+$/i, /^.*_gen\.[a-z]+$/i, /^.*\.pb\.(go|js|ts|py|rb)$/i, /^.*_pb2?\.py$/i, /^.*\.pb\.h$/i, /^.*\.grpc\.[a-z]+$/i, /^.*\.swagger\.[a-z]+$/i, /^.*\.openapi\.[a-z]+$/i]
})
// @from(Ln 221821, Col 0)
function ZX1() {
    let A = G1();
    return H_(A) ?? AA()
}
// @from(Ln 221826, Col 0)
function s84() {
    return CF6 === "internal"
}
// @from(Ln 221830, Col 0)
function e84(A) {
    if (A.includes("opus-4-6")) return "claude-opus-4-6";
    if (A.includes("opus-4-5")) return "claude-opus-4-5";
    if (A.includes("opus-4-1")) return "claude-opus-4-1";
    if (A.includes("opus-4")) return "claude-opus-4";
    if (A.includes("sonnet-4-6")) return "claude-sonnet-4-6";
    if (A.includes("sonnet-4-5")) return "claude-sonnet-4-5";
    if (A.includes("sonnet-4")) return "claude-sonnet-4";
    if (A.includes("sonnet-3-7")) return "claude-sonnet-3-7";
    if (A.includes("haiku-4-5")) return "claude-haiku-4-5";
    if (A.includes("haiku-3-5")) return "claude-haiku-3-5";
    return "claude"
}
// @from(Ln 221844, Col 0)
function aN9() {
    return process.env.CLAUDE_CODE_ENTRYPOINT ?? "cli"
}
// @from(Ln 221848, Col 0)
function g06() {
    return {
        fileStates: new Map,
        sessionBaselines: new Map,
        surface: aN9(),
        startingHeadSha: null,
        promptCount: 0,
        promptCountAtLastCommit: 0,
        permissionPromptCount: 0,
        permissionPromptCountAtLastCommit: 0,
        escapeCount: 0,
        escapeCountAtLastCommit: 0
    }
}
// @from(Ln 221862, Col 0)
async function AA4(A, q) {
    let K = ZX1(),
        Y = R1(),
        z = {},
        _ = [],
        w = new Set,
        O = {},
        $ = 0,
        H = 0,
        j = new Map,
        J = new Map;
    for (let W of A) {
        w.add(W.surface);
        let Z = W.sessionBaselines instanceof Map ? W.sessionBaselines : new Map(Object.entries(W.sessionBaselines ?? {}));
        for (let [f, v] of Z)
            if (!J.has(f)) J.set(f, v);
        let G = W.fileStates instanceof Map ? W.fileStates : new Map(Object.entries(W.fileStates ?? {}));
        for (let [f, v] of G) {
            let N = j.get(f);
            if (N) j.set(f, {
                ...v,
                claudeContribution: N.claudeContribution + v.claudeContribution
            });
            else j.set(f, v)
        }
    }
    let M = await Promise.all(q.map(async (W) => {
        if (r84(W)) return {
            type: "generated",
            file: W
        };
        let Z = nN9(K, W),
            G = j.get(W),
            f = J.get(W),
            v = A[0].surface,
            N = 0,
            V = 0;
        if (await sN9(W))
            if (G) N = G.claudeContribution, V = 0;
            else {
                let u = await a84(W);
                V = u > 0 ? u : 100
            }
        else try {
            let u = await rN9(Z);
            if (G) N = G.claudeContribution, V = 0;
            else if (f) {
                let I = await a84(W);
                V = I > 0 ? I : u.size
            } else V = u.size
        } catch {
            return null
        }
        N = Math.max(0, N), V = Math.max(0, V);
        let h = N + V,
            R = h > 0 ? Math.round(N / h * 100) : 0;
        return {
            type: "file",
            file: W,
            claudeChars: N,
            humanChars: V,
            percent: R,
            surface: v
        }
    }));
    for (let W of M) {
        if (!W) continue;
        if (W.type === "generated") {
            _.push(W.file);
            continue
        }
        z[W.file] = {
            claudeChars: W.claudeChars,
            humanChars: W.humanChars,
            percent: W.percent,
            surface: W.surface
        }, $ += W.claudeChars, H += W.humanChars, O[W.surface] = (O[W.surface] ?? 0) + W.claudeChars
    }
    let D = $ + H,
        X = D > 0 ? Math.round($ / D * 100) : 0,
        P = {};
    for (let [W, Z] of Object.entries(O)) {
        let G = D > 0 ? Math.round(Z / D * 100) : 0;
        P[W] = {
            claudeChars: Z,
            percent: G
        }
    }
    return {
        version: 1,
        summary: {
            claudePercent: X,
            claudeChars: $,
            humanChars: H,
            surfaces: Array.from(w)
        },
        files: z,
        surfaceBreakdown: P,
        excludedGenerated: _,
        sessions: [Y]
    }
}
// @from(Ln 221964, Col 0)
async function a84(A) {
    let q = ZX1();
    try {
        let K = await RA(hA(), ["diff", "--cached", "--stat", "--", A], {
            cwd: q,
            timeout: 5000
        });
        if (K.code !== 0 || !K.stdout) return 0;
        let Y = K.stdout.split(`
`).filter(Boolean),
            z = 0;
        for (let _ of Y)
            if (_.includes("file changed") || _.includes("files changed")) {
                let w = _.match(/(\d+) insertions?/),
                    O = _.match(/(\d+) deletions?/),
                    $ = w ? parseInt(w[1], 10) : 0,
                    H = O ? parseInt(O[1], 10) : 0;
                z += ($ + H) * 40
            } return z
    } catch {
        return 0
    }
}
// @from(Ln 221987, Col 0)
async function sN9(A) {
    let q = ZX1();
    try {
        let K = await RA(hA(), ["diff", "--cached", "--name-status", "--", A], {
            cwd: q,
            timeout: 5000
        });
        if (K.code === 0 && K.stdout) return K.stdout.trim().startsWith("D\t")
    } catch {}
    return !1
}
// @from(Ln 221998, Col 4)
oN9
// @from(Ln 221998, Col 9)
CF6 = null
// @from(Ln 221999, Col 4)
t84
// @from(Ln 222000, Col 4)
xd = E(() => {
    T1();
    SA();
    H1();
    k1();
    o84();
    Eq();
    z4();
    $5();
    yo();
    lA();
    oN9 = ["github.com:anthropics/claude-cli-internal", "github.com/anthropics/claude-cli-internal", "github.com:anthropics/anthropic", "github.com/anthropics/anthropic", "github.com:anthropics/apps", "github.com/anthropics/apps", "github.com:anthropics/casino", "github.com/anthropics/casino", "github.com:anthropics/dbt", "github.com/anthropics/dbt", "github.com:anthropics/dotfiles", "github.com/anthropics/dotfiles", "github.com:anthropics/terraform-config", "github.com/anthropics/terraform-config", "github.com:anthropics/hex-export", "github.com/anthropics/hex-export", "github.com:anthropics/feedback-v2", "github.com/anthropics/feedback-v2", "github.com:anthropics/labs", "github.com/anthropics/labs", "github.com:anthropics/argo-rollouts", "github.com/anthropics/argo-rollouts", "github.com:anthropics/starling-configs", "github.com/anthropics/starling-configs", "github.com:anthropics/ts-tools", "github.com/anthropics/ts-tools", "github.com:anthropics/ts-capsules", "github.com/anthropics/ts-capsules", "github.com:anthropics/feldspar-testing", "github.com/anthropics/feldspar-testing", "github.com:anthropics/trellis", "github.com/anthropics/trellis", "github.com:anthropics/claude-for-hiring", "github.com/anthropics/claude-for-hiring", "github.com:anthropics/forge-web", "github.com/anthropics/forge-web", "github.com:anthropics/infra-manifests", "github.com/anthropics/infra-manifests", "github.com:anthropics/mycro_manifests", "github.com/anthropics/mycro_manifests", "github.com:anthropics/mycro_configs", "github.com/anthropics/mycro_configs"];
    t84 = Bu(async () => {
        if (CF6 !== null) return CF6 === "internal";
        let A = ZX1(),
            q = await F31(A);
        if (!q) return CF6 = "none", !1;
        let K = oN9.some((Y) => q.includes(Y));
        return CF6 = K ? "internal" : "external", K
    })
})
// @from(Ln 222022, Col 0)
function KA4() {
    return null
}
// @from(Ln 222026, Col 0)
function YA4(A) {
    let q = KA4();
    if (!q) return A;
    let K = new globalThis.Headers(A);
    return Object.entries(q).forEach(([Y, z]) => {
        if (z !== void 0) K.set(Y, z)
    }), K
}
// @from(Ln 222035, Col 0)
function F06() {
    return GX1 && !1
}
// @from(Ln 222039, Col 0)
function zA4() {
    return null
}
// @from(Ln 222043, Col 0)
function _A4() {
    return GX1 && qA4 !== null && !1
}
// @from(Ln 222046, Col 4)
tN9
// @from(Ln 222046, Col 9)
GX1 = !1
// @from(Ln 222047, Col 4)
qA4 = null
// @from(Ln 222048, Col 4)
eN9 = "max"
// @from(Ln 222049, Col 4)
mT8 = E(() => {
    k8();
    tN9 = {}
})
// @from(Ln 222054, Col 0)
function BT8(A) {
    if (F06()) return YA4(A);
    return A
}
// @from(Ln 222059, Col 0)
function p06(A) {
    return A || F06()
}
// @from(Ln 222063, Col 0)
function OA4(A) {
    return F06() && A.status === 429
}
// @from(Ln 222066, Col 4)
IF6 = E(() => {
    mT8();
    wv()
})
// @from(Ln 222071, Col 0)
function $A4(A) {
    return AV9.some((q) => A.startsWith(q))
}
// @from(Ln 222075, Col 0)
function HA4(A, q) {
    if (A.isUsingOverage) {
        if (A.overageStatus === "allowed_warning") return {
            message: "You're close to your extra usage spending limit",
            severity: "warning"
        };
        return null
    }
    if (A.status === "rejected") return {
        message: qV9(A, q),
        severity: "error"
    };
    if (A.status === "allowed_warning") {
        if (A.utilization !== void 0 && A.utilization < 0.7) return null;
        let Y = CK(),
            z = Y === "team" || Y === "enterprise",
            _ = L3()?.hasExtraUsageEnabled === !0;
        if (z && _ && !fI()) return null;
        let w = KV9(A);
        if (w) return {
            message: w,
            severity: "warning"
        }
    }
    return null
}
// @from(Ln 222102, Col 0)
function gT8(A, q) {
    let K = HA4(A, q);
    if (K && K.severity === "error") return K.message;
    return null
}
// @from(Ln 222108, Col 0)
function FT8(A, q) {
    let K = HA4(A, q);
    if (K && K.severity === "warning") return K.message;
    return null
}
// @from(Ln 222114, Col 0)
function qV9(A, q) {
    let K = A.resetsAt,
        Y = K ? EJ6(K, !0) : void 0,
        z = A.overageResetsAt ? EJ6(A.overageResetsAt, !0) : void 0,
        _ = Y ? ` · resets ${Y}` : "";
    if (A.overageStatus === "rejected") {
        let w = "";
        if (K && A.overageResetsAt)
            if (K < A.overageResetsAt) w = ` · resets ${Y}`;
            else w = ` · resets ${z}`;
        else if (Y) w = ` · resets ${Y}`;
        else if (z) w = ` · resets ${z}`;
        if (A.overageDisabledReason === "out_of_credits") return `You're out of extra usage${w}`;
        return Q06("limit", w, q)
    }
    if (A.rateLimitType === "seven_day_sonnet") {
        let w = CK();
        return Q06(w === "pro" || w === "enterprise" ? "weekly limit" : "Sonnet limit", _, q)
    }
    if (A.rateLimitType === "seven_day_opus") return Q06("Opus limit", _, q);
    if (A.rateLimitType === "seven_day") return Q06("weekly limit", _, q);
    if (A.rateLimitType === "five_hour") return Q06("session limit", _, q);
    return Q06("usage limit", _, q)
}
// @from(Ln 222139, Col 0)
function KV9(A) {
    let q = null;
    switch (A.rateLimitType) {
        case "seven_day":
            q = "weekly limit";
            break;
        case "five_hour":
            q = "session limit";
            break;
        case "seven_day_opus":
            q = "Opus limit";
            break;
        case "seven_day_sonnet":
            q = "Sonnet limit";
            break;
        case "overage":
            q = "extra usage";
            break;
        case void 0:
            return null
    }
    let K = A.utilization ? Math.floor(A.utilization * 100) : void 0,
        Y = A.resetsAt ? EJ6(A.resetsAt, !0) : void 0,
        z = YV9(A.rateLimitType);
    if (K && Y) {
        let w = `You've used ${K}% of your ${q} · resets ${Y}`;
        return z ? `${w} · ${z}` : w
    }
    if (K) {
        let w = `You've used ${K}% of your ${q}`;
        return z ? `${w} · ${z}` : w
    }
    if (A.rateLimitType === "overage") q += " limit";
    if (Y) {
        let w = `Approaching ${q} · resets ${Y}`;
        return z ? `${w} · ${z}` : w
    }
    let _ = `Approaching ${q}`;
    return z ? `${_} · ${z}` : _
}
// @from(Ln 222180, Col 0)
function YV9(A) {
    let q = CK(),
        K = L3()?.hasExtraUsageEnabled === !0;
    if (A === "five_hour") {
        if (q === "team" || q === "enterprise") {
            if (!K && U06()) return "/extra-usage to request more";
            return null
        }
        if (q === "pro" || q === "max") return "/upgrade to keep using Claude Code"
    }
    if (A === "overage") {
        if (q === "team" || q === "enterprise") {
            if (!K && U06()) return "/extra-usage to request more"
        }
    }
    return null
}
// @from(Ln 222198, Col 0)
function pT8(A) {
    let q = A.resetsAt ? EJ6(A.resetsAt, !0) : "",
        K = "";
    if (A.rateLimitType === "five_hour") K = "session limit";
    else if (A.rateLimitType === "seven_day") K = "weekly limit";
    else if (A.rateLimitType === "seven_day_opus") K = "Opus limit";
    else if (A.rateLimitType === "seven_day_sonnet") {
        let z = CK();
        K = z === "pro" || z === "enterprise" ? "weekly limit" : "Sonnet limit"
    }
    if (!K) return "Now using extra usage";
    return `You're now using extra usage${q?` · Your ${K} resets ${q}`:""}`
}
// @from(Ln 222212, Col 0)
function Q06(A, q, K) {
    return `You've hit your ${A}${q}`
}
// @from(Ln 222215, Col 4)
AV9
// @from(Ln 222216, Col 4)
QT8 = E(() => {
    M4();
    fA();
    k8();
    AV9 = ["You've hit your", "You've used", "You're now using extra usage", "You're close to", "You're out of extra usage"]
})
// @from(Ln 222223, Col 0)
function wV9(A, q) {
    let K = Date.now() / 1000,
        Y = A - q,
        z = K - Y;
    return Math.max(0, Math.min(1, z / q))
}
// @from(Ln 222230, Col 0)
function UT8(A) {
    Jf = A, Nt.forEach((K) => K(A));
    let q = Math.round((A.resetsAt ? A.resetsAt - Date.now() / 1000 : 0) / 3600);
    d("tengu_claudeai_limits_status_changed", {
        status: A.status,
        unifiedRateLimitFallbackAvailable: A.unifiedRateLimitFallbackAvailable,
        hoursTillReset: q
    })
}
// @from(Ln 222239, Col 0)
async function OV9() {
    let A = lH(),
        q = await MI({
            maxRetries: 0,
            model: A,
            source: "quota_check"
        }),
        K = [{
            role: "user",
            content: "quota"
        }],
        Y = bk(A);
    return q.beta.messages.create({
        model: A,
        max_tokens: 1,
        messages: K,
        metadata: Vt(),
        ...Y.length > 0 ? {
            betas: Y
        } : {}
    }).asResponse()
}
// @from(Ln 222261, Col 0)
async function jA4() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    if (!p06(iA())) return;
    if (q7()) return;
    try {
        let A = await OV9();
        dT8(A.headers)
    } catch (A) {
        if (A instanceof a7) fX1(A)
    }
}
// @from(Ln 222273, Col 0)
function $V9(A, q) {
    for (let [K, Y] of Object.entries(_V9)) {
        let z = A.get(`anthropic-ratelimit-unified-${K}-surpassed-threshold`);
        if (z !== null) {
            let _ = A.get(`anthropic-ratelimit-unified-${K}-utilization`),
                w = A.get(`anthropic-ratelimit-unified-${K}-reset`),
                O = _ ? Number(_) : void 0;
            return {
                status: "allowed_warning",
                resetsAt: w ? Number(w) : void 0,
                rateLimitType: Y,
                utilization: O,
                unifiedRateLimitFallbackAvailable: q,
                isUsingOverage: !1,
                surpassedThreshold: Number(z)
            }
        }
    }
    return null
}
// @from(Ln 222294, Col 0)
function HV9(A, q, K) {
    let {
        rateLimitType: Y,
        claimAbbrev: z,
        windowSeconds: _,
        thresholds: w
    } = q, O = A.get(`anthropic-ratelimit-unified-${z}-utilization`), $ = A.get(`anthropic-ratelimit-unified-${z}-reset`);
    if (O === null || $ === null) return null;
    let H = Number(O),
        j = Number($),
        J = wV9(j, _);
    if (!w.some((D) => H >= D.utilization && J <= D.timePct)) return null;
    return {
        status: "allowed_warning",
        resetsAt: j,
        rateLimitType: Y,
        utilization: H,
        unifiedRateLimitFallbackAvailable: K,
        isUsingOverage: !1
    }
}
// @from(Ln 222316, Col 0)
function jV9(A, q) {
    let K = $V9(A, q);
    if (K) return K;
    for (let Y of zV9) {
        let z = HV9(A, Y, q);
        if (z) return z
    }
    return null
}
// @from(Ln 222326, Col 0)
function JA4(A) {
    let q = A.get("anthropic-ratelimit-unified-status") || "allowed",
        K = A.get("anthropic-ratelimit-unified-reset"),
        Y = K ? Number(K) : void 0,
        z = A.get("anthropic-ratelimit-unified-fallback") === "available",
        _ = A.get("anthropic-ratelimit-unified-representative-claim"),
        w = A.get("anthropic-ratelimit-unified-overage-status"),
        O = A.get("anthropic-ratelimit-unified-overage-reset"),
        $ = O ? Number(O) : void 0,
        H = A.get("anthropic-ratelimit-unified-overage-disabled-reason"),
        j = q === "rejected" && (w === "allowed" || w === "allowed_warning"),
        J = q;
    if (q === "allowed" || q === "allowed_warning") {
        let M = jV9(A, z);
        if (M) return M;
        J = "allowed"
    }
    return {
        status: J,
        resetsAt: Y,
        unifiedRateLimitFallbackAvailable: z,
        ..._ && {
            rateLimitType: _
        },
        ...w && {
            overageStatus: w
        },
        ...$ && {
            overageResetsAt: $
        },
        ...H && {
            overageDisabledReason: H
        },
        isUsingOverage: j
    }
}
// @from(Ln 222363, Col 0)
function MA4(A) {
    let q = A.get("anthropic-ratelimit-unified-overage-disabled-reason") ?? null;
    if (X1().cachedExtraUsageDisabledReason !== q) d1((Y) => ({
        ...Y,
        cachedExtraUsageDisabledReason: q
    }))
}
// @from(Ln 222371, Col 0)
function dT8(A) {
    let q = iA();
    if (!p06(q)) {
        if (Jf.status !== "allowed" || Jf.resetsAt) UT8({
            status: "allowed",
            unifiedRateLimitFallbackAvailable: !1,
            isUsingOverage: !1
        });
        return
    }
    let K = BT8(A),
        Y = JA4(K);
    if (MA4(K), !TP(Jf, Y)) UT8(Y)
}
// @from(Ln 222386, Col 0)
function fX1(A) {
    if (!p06(iA()) || A.status !== 429) return;
    try {
        let q = {
            ...Jf
        };
        if (A.headers) {
            let K = BT8(A.headers);
            q = JA4(K), MA4(K)
        }
        if (q.status = "rejected", !TP(Jf, q)) UT8(q)
    } catch (q) {
        _6(q)
    }
}
// @from(Ln 222401, Col 4)
zV9
// @from(Ln 222401, Col 9)
_V9
// @from(Ln 222401, Col 14)
Jf
// @from(Ln 222401, Col 18)
Nt
// @from(Ln 222402, Col 4)
ud = E(() => {
    ag6();
    k1();
    z4();
    V1();
    fA();
    Mf();
    wv();
    gw();
    Q$6();
    IF6();
    k8();
    T1();
    QT8();
    zV9 = [{
        rateLimitType: "five_hour",
        claimAbbrev: "5h",
        windowSeconds: 18000,
        thresholds: [{
            utilization: 0.9,
            timePct: 0.72
        }]
    }, {
        rateLimitType: "seven_day",
        claimAbbrev: "7d",
        windowSeconds: 604800,
        thresholds: [{
            utilization: 0.75,
            timePct: 0.6
        }, {
            utilization: 0.5,
            timePct: 0.35
        }, {
            utilization: 0.25,
            timePct: 0.15
        }]
    }], _V9 = {
        "5h": "five_hour",
        "7d": "seven_day",
        overage: "overage"
    };
    Jf = {
        status: "allowed",
        unifiedRateLimitFallbackAvailable: !1,
        isUsingOverage: !1
    }, Nt = new Set
})
// @from(Ln 222449, Col 4)
d06 = 5242880
// @from(Ln 222450, Col 4)
xk = 3932160
// @from(Ln 222451, Col 4)
WB = 2000
// @from(Ln 222452, Col 4)
ZB = 2000
// @from(Ln 222453, Col 4)
c06 = 20971520
// @from(Ln 222454, Col 4)
DA4 = 100
// @from(Ln 222455, Col 4)
XA4 = 3145728
// @from(Ln 222456, Col 4)
cT8 = 104857600
// @from(Ln 222457, Col 4)
P36 = 20
// @from(Ln 222458, Col 4)
TX1 = 10
// @from(Ln 222459, Col 4)
PA4 = 100
// @from(Ln 222461, Col 0)
function l06(A) {
    if (!A || typeof A !== "object") return null;
    let q = A,
        K = 5,
        Y = 0;
    while (q && Y < K) {
        if (q instanceof Error && "code" in q && typeof q.code === "string") {
            let z = q.code,
                _ = JV9.has(z);
            return {
                code: z,
                message: q.message,
                isSSLError: _
            }
        }
        if (q instanceof Error && "cause" in q && q.cause !== q) q = q.cause, Y++;
        else break
    }
    return null
}
// @from(Ln 222482, Col 0)
function kt(A) {
    let q = l06(A);
    if (!q?.isSSLError) return null;
    return `SSL certificate error (${q.code}). If you are behind a corporate proxy or TLS-intercepting firewall, set NODE_EXTRA_CA_CERTS to your CA bundle path, or ask IT to allowlist *.anthropic.com. Run /doctor for details.`
}
// @from(Ln 222488, Col 0)
function lT8(A) {
    if (A.includes("<!DOCTYPE html") || A.includes("<html")) {
        let q = A.match(/<title>([^<]+)<\/title>/);
        if (q && q[1]) return q[1].trim();
        return ""
    }
    return A
}
// @from(Ln 222497, Col 0)
function MV9(A) {
    let q = A.message;
    if (!q) return "";
    return lT8(q)
}
// @from(Ln 222503, Col 0)
function DV9(A) {
    return typeof A === "object" && A !== null && "error" in A && typeof A.error === "object" && A.error !== null
}
// @from(Ln 222507, Col 0)
function XV9(A) {
    if (!DV9(A)) return null;
    let K = A.error,
        Y = K?.error?.message;
    if (typeof Y === "string" && Y.length > 0) {
        let _ = lT8(Y);
        if (_.length > 0) return _
    }
    let z = K?.message;
    if (typeof z === "string" && z.length > 0) {
        let _ = lT8(z);
        if (_.length > 0) return _
    }
    return null
}
// @from(Ln 222523, Col 0)
function i06(A) {
    let q = l06(A);
    if (q) {
        let {
            code: Y,
            isSSLError: z
        } = q;
        if (Y === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";
        if (z) switch (Y) {
            case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
            case "UNABLE_TO_GET_ISSUER_CERT":
            case "UNABLE_TO_GET_ISSUER_CERT_LOCALLY":
                return "Unable to connect to API: SSL certificate verification failed. Check your proxy or corporate SSL certificates";
            case "CERT_HAS_EXPIRED":
                return "Unable to connect to API: SSL certificate has expired";
            case "CERT_REVOKED":
                return "Unable to connect to API: SSL certificate has been revoked";
            case "DEPTH_ZERO_SELF_SIGNED_CERT":
            case "SELF_SIGNED_CERT_IN_CHAIN":
                return "Unable to connect to API: Self-signed certificate detected. Check your proxy or corporate SSL certificates";
            case "ERR_TLS_CERT_ALTNAME_INVALID":
            case "HOSTNAME_MISMATCH":
                return "Unable to connect to API: SSL certificate hostname mismatch";
            case "CERT_NOT_YET_VALID":
                return "Unable to connect to API: SSL certificate is not yet valid";
            default:
                return `Unable to connect to API: SSL error (${Y})`
        }
    }
    if (A.message === "Connection error.") {
        if (q?.code) return `Unable to connect to API (${q.code})`;
        return "Unable to connect to API. Check your internet connection"
    }
    if (!A.message) return XV9(A) ?? `API error (status ${A.status??"unknown"})`;
    let K = MV9(A);
    return K !== A.message && K.length > 0 ? K : A.message
}
// @from(Ln 222560, Col 0)
async function uk(A, q) {
    await new Promise((K, Y) => {
        let z = setTimeout(K, A);
        if (q) {
            let _ = () => {
                clearTimeout(z), Y(new Az)
            };
            if (q.aborted) {
                _();
                return
            }
            q.addEventListener("abort", _, {
                once: !0
            }), setTimeout((w, O) => w.removeEventListener("abort", O), A, q, _)
        }
    })
}
// @from(Ln 222577, Col 4)
JV9
// @from(Ln 222578, Col 4)
uv = E(() => {
    wv();
    JV9 = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "CERT_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID", "CERT_HAS_EXPIRED", "CERT_REVOKED", "CERT_REJECTED", "CERT_UNTRUSTED", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN", "CERT_CHAIN_TOO_LONG", "PATH_LENGTH_EXCEEDED", "ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH", "ERR_TLS_HANDSHAKE_TIMEOUT", "ERR_SSL_WRONG_VERSION_NUMBER", "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC"])
})
// @from(Ln 222583, Col 0)
function PV9(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    if (q.type !== "image") return !1;
    if (typeof q.source !== "object" || q.source === null) return !1;
    let K = q.source;
    return K.type === "base64" && typeof K.data === "string"
}
// @from(Ln 222592, Col 0)
function WA4(A) {
    let q = [],
        K = 0;
    for (let Y of A) {
        if (typeof Y !== "object" || Y === null) continue;
        let z = Y;
        if (z.type !== "user") continue;
        let _ = z.message;
        if (!_) continue;
        let w = _.content;
        if (typeof w === "string" || !Array.isArray(w)) continue;
        for (let O of w)
            if (PV9(O)) {
                K++;
                let $ = O.source.data.length;
                if ($ > d06) d("tengu_image_api_validation_failed", {
                    base64_size_bytes: $,
                    max_bytes: d06
                }), q.push({
                    index: K,
                    size: $
                })
            }
    }
    if (q.length > 0) throw new n06(q, d06)
}
// @from(Ln 222618, Col 4)
n06
// @from(Ln 222619, Col 4)
vX1 = E(() => {
    V1();
    Z7();
    n06 = class n06 extends Error {
        constructor(A, q) {
            let K, Y = A[0];
            if (A.length === 1 && Y) K = `Image base64 size (${xq(Y.size)}) exceeds API limit (${xq(q)}). Please resize the image before sending.`;
            else K = `${A.length} images exceed the API limit (${xq(q)}): ` + A.map((z) => `Image ${z.index}: ${xq(z.size)}`).join(", ") + ". Please resize these images before sending.";
            super(K);
            this.name = "ImageSizeError"
        }
    }
})
// @from(Ln 222632, Col 4)
VX1 = {}
// @from(Ln 222639, Col 0)
function GA4() {
    if (ZA4) return NX1;
    ZA4 = !0;
    try {
        NX1 = (() => {
            throw new Error("Cannot require module " + "../../image-processor.node");
        })()
    } catch {
        NX1 = null
    }
    return NX1
}
// @from(Ln 222652, Col 0)
function fA4(A) {
    let q = null,
        K = [],
        Y = 0;
    async function z() {
        if (!q) q = (async () => {
            let O = GA4();
            if (!O) throw Error("Native image processor module not available");
            return O.processImage(A)
        })();
        return q
    }

    function _(O) {
        for (let $ = Y; $ < K.length; $++) {
            let H = K[$];
            if (H) H(O)
        }
        Y = K.length
    }
    let w = {
        async metadata() {
            return (await z()).metadata()
        },
        resize(O, $, H) {
            return K.push((j) => {
                j.resize(O, $, H)
            }), w
        },
        jpeg(O) {
            return K.push(($) => {
                $.jpeg(O?.quality)
            }), w
        },
        png(O) {
            return K.push(($) => {
                $.png(O)
            }), w
        },
        webp(O) {
            return K.push(($) => {
                $.webp(O?.quality)
            }), w
        },
        async toBuffer() {
            let O = await z();
            return _(O), O.toBuffer()
        }
    };
    return w
}
// @from(Ln 222703, Col 4)
NX1 = null
// @from(Ln 222704, Col 4)
ZA4 = !1
// @from(Ln 222705, Col 4)
WV9
// @from(Ln 222706, Col 4)
kX1 = E(() => {
    WV9 = fA4
})
// @from(Ln 222709, Col 4)
GB = x((FB2, vA4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var TA4 = (A) => typeof A < "u" && A !== null,
        ZV9 = (A) => typeof A === "object",
        GV9 = (A) => Object.prototype.toString.call(A) === "[object Object]",
        fV9 = (A) => typeof A === "function",
        TV9 = (A) => typeof A === "boolean",
        vV9 = (A) => A instanceof Buffer,
        NV9 = (A) => {
            if (TA4(A)) switch (A.constructor) {
                case Uint8Array:
                case Uint8ClampedArray:
                case Int8Array:
                case Uint16Array:
                case Int16Array:
                case Uint32Array:
                case Int32Array:
                case Float32Array:
                case Float64Array:
                    return !0
            }
            return !1
        },
        VV9 = (A) => A instanceof ArrayBuffer,
        kV9 = (A) => typeof A === "string" && A.length > 0,
        EV9 = (A) => typeof A === "number" && !Number.isNaN(A),
        yV9 = (A) => Number.isInteger(A),
        LV9 = (A, q, K) => A >= q && A <= K,
        RV9 = (A, q) => q.includes(A),
        hV9 = (A, q, K) => Error(`Expected ${q} for ${A} but received ${K} of type ${typeof K}`),
        SV9 = (A, q) => {
            return q.message = A.message, q
        };
    vA4.exports = {
        defined: TA4,
        object: ZV9,
        plainObject: GV9,
        fn: fV9,
        bool: TV9,
        buffer: vV9,
        typedArray: NV9,
        arrayBuffer: VV9,
        string: kV9,
        number: EV9,
        integer: yV9,
        inRange: LV9,
        inArray: RV9,
        invalidParameterError: hV9,
        nativeError: SV9
    }
})
// @from(Ln 222763, Col 4)
kA4 = x((pB2, VA4) => {
    var NA4 = () => process.platform === "linux",
        EX1 = null,
        CV9 = () => {
            if (!EX1)
                if (NA4() && process.report) {
                    let A = process.report.excludeNetwork;
                    process.report.excludeNetwork = !0, EX1 = process.report.getReport(), process.report.excludeNetwork = A
                } else EX1 = {};
            return EX1
        };
    VA4.exports = {
        isLinux: NA4,
        getReport: CV9
    }
})
// @from(Ln 222779, Col 4)
yA4 = x((QB2, EA4) => {
    var r06 = x6("fs"),
        IV9 = (A) => {
            let q = r06.openSync(A, "r"),
                K = Buffer.alloc(2048),
                Y = r06.readSync(q, K, 0, 2048, 0);
            return r06.close(q, () => {}), K.subarray(0, Y)
        },
        bV9 = (A) => new Promise((q, K) => {
            r06.open(A, "r", (Y, z) => {
                if (Y) K(Y);
                else {
                    let _ = Buffer.alloc(2048);
                    r06.read(z, _, 0, 2048, 0, (w, O) => {
                        q(_.subarray(0, O)), r06.close(z, () => {})
                    })
                }
            })
        });
    EA4.exports = {
        LDD_PATH: "/usr/bin/ldd",
        SELF_PATH: "/proc/self/exe",
        readFileSync: IV9,
        readFile: bV9
    }
})
// @from(Ln 222805, Col 4)
RA4 = x((UB2, LA4) => {
    var xV9 = (A) => {
        if (A.length < 64) return null;
        if (A.readUInt32BE(0) !== 2135247942) return null;
        if (A.readUInt8(4) !== 2) return null;
        if (A.readUInt8(5) !== 1) return null;
        let q = A.readUInt32LE(32),
            K = A.readUInt16LE(54),
            Y = A.readUInt16LE(56);
        for (let z = 0; z < Y; z++) {
            let _ = q + z * K;
            if (A.readUInt32LE(_) === 3) {
                let O = A.readUInt32LE(_ + 8),
                    $ = A.readUInt32LE(_ + 32);
                return A.subarray(O, O + $).toString().replace(/\0.*$/g, "")
            }
        }
        return null
    };
    LA4.exports = {
        interpreterPath: xV9
    }
})
// @from(Ln 222828, Col 4)
LX1 = x((dB2, lA4) => {
    var SA4 = x6("child_process"),
        {
            isLinux: o06,
            getReport: CA4
        } = kA4(),
        {
            LDD_PATH: yX1,
            SELF_PATH: IA4,
            readFile: iT8,
            readFileSync: nT8
        } = yA4(),
        {
            interpreterPath: bA4
        } = RA4(),
        fB, TB, vB, Et = "",
        xA4 = () => {
            if (!Et) return new Promise((A) => {
                SA4.exec("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", (q, K) => {
                    Et = q ? " " : K, A(Et)
                })
            });
            return Et
        },
        uA4 = () => {
            if (!Et) try {
                Et = SA4.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {
                    encoding: "utf8"
                })
            } catch (A) {
                Et = " "
            }
            return Et
        },
        md = "glibc",
        mA4 = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,
        W36 = "musl",
        uV9 = (A) => A.includes("libc.musl-") || A.includes("ld-musl-"),
        BA4 = () => {
            let A = CA4();
            if (A.header && A.header.glibcVersionRuntime) return md;
            if (Array.isArray(A.sharedObjects)) {
                if (A.sharedObjects.some(uV9)) return W36
            }
            return null
        },
        gA4 = (A) => {
            let [q, K] = A.split(/[\r\n]+/);
            if (q && q.includes(md)) return md;
            if (K && K.includes(W36)) return W36;
            return null
        },
        FA4 = (A) => {
            if (A) {
                if (A.includes("/ld-musl-")) return W36;
                else if (A.includes("/ld-linux-")) return md
            }
            return null
        },
        pA4 = (A) => {
            if (A = A.toString(), A.includes("musl")) return W36;
            if (A.includes("GNU C Library")) return md;
            return null
        },
        mV9 = async () => {
            if (TB !== void 0) return TB;
            TB = null;
            try {
                let A = await iT8(yX1);
                TB = pA4(A)
            } catch (A) {}
            return TB
        }, BV9 = () => {
            if (TB !== void 0) return TB;
            TB = null;
            try {
                let A = nT8(yX1);
                TB = pA4(A)
            } catch (A) {}
            return TB
        }, gV9 = async () => {
            if (fB !== void 0) return fB;
            fB = null;
            try {
                let A = await iT8(IA4),
                    q = bA4(A);
                fB = FA4(q)
            } catch (A) {}
            return fB
        }, FV9 = () => {
            if (fB !== void 0) return fB;
            fB = null;
            try {
                let A = nT8(IA4),
                    q = bA4(A);
                fB = FA4(q)
            } catch (A) {}
            return fB
        }, QA4 = async () => {
            let A = null;
            if (o06()) {
                if (A = await gV9(), !A) {
                    if (A = await mV9(), !A) A = BA4();
                    if (!A) {
                        let q = await xA4();
                        A = gA4(q)
                    }
                }
            }
            return A
        }, UA4 = () => {
            let A = null;
            if (o06()) {
                if (A = FV9(), !A) {
                    if (A = BV9(), !A) A = BA4();
                    if (!A) {
                        let q = uA4();
                        A = gA4(q)
                    }
                }
            }
            return A
        }, pV9 = async () => o06() && await QA4() !== md, QV9 = () => o06() && UA4() !== md, UV9 = async () => {
            if (vB !== void 0) return vB;
            vB = null;
            try {
                let q = (await iT8(yX1)).match(mA4);
                if (q) vB = q[1]
            } catch (A) {}
            return vB
        }, dV9 = () => {
            if (vB !== void 0) return vB;
            vB = null;
            try {
                let q = nT8(yX1).match(mA4);
                if (q) vB = q[1]
            } catch (A) {}
            return vB
        }, dA4 = () => {
            let A = CA4();
            if (A.header && A.header.glibcVersionRuntime) return A.header.glibcVersionRuntime;
            return null
        }, hA4 = (A) => A.trim().split(/\s+/)[1], cA4 = (A) => {
            let [q, K, Y] = A.split(/[\r\n]+/);
            if (q && q.includes(md)) return hA4(q);
            if (K && Y && K.includes(W36)) return hA4(Y);
            return null
        }, cV9 = async () => {
            let A = null;
            if (o06()) {
                if (A = await UV9(), !A) A = dA4();
                if (!A) {
                    let q = await xA4();
                    A = cA4(q)
                }
            }
            return A
        }, lV9 = () => {
            let A = null;
            if (o06()) {
                if (A = dV9(), !A) A = dA4();
                if (!A) {
                    let q = uA4();
                    A = cA4(q)
                }
            }
            return A
        };
    lA4.exports = {
        GLIBC: md,
        MUSL: W36,
        family: QA4,
        familySync: UA4,
        isNonGlibcLinux: pV9,
        isNonGlibcLinuxSync: QV9,
        version: cV9,
        versionSync: lV9
    }
})
// @from(Ln 223007, Col 4)
bF6 = x((cB2, iA4) => {
    var iV9 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    iA4.exports = iV9
})
// @from(Ln 223011, Col 4)
RX1 = x((lB2, nA4) => {
    var nV9 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        rV9 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    nA4.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: nV9,
        RELEASE_TYPES: rV9,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 223025, Col 4)
xF6 = x((NB, rA4) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: rT8,
        MAX_SAFE_BUILD_LENGTH: oV9,
        MAX_LENGTH: aV9
    } = RX1(), sV9 = bF6();
    NB = rA4.exports = {};
    var tV9 = NB.re = [],
        eV9 = NB.safeRe = [],
        b4 = NB.src = [],
        Ak9 = NB.safeSrc = [],
        x4 = NB.t = {},
        qk9 = 0,
        oT8 = "[a-zA-Z0-9-]",
        Kk9 = [
            ["\\s", 1],
            ["\\d", aV9],
            [oT8, oV9]
        ],
        Yk9 = (A) => {
            for (let [q, K] of Kk9) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        i5 = (A, q, K) => {
            let Y = Yk9(q),
                z = qk9++;
            sV9(A, z, q), x4[A] = z, b4[z] = q, Ak9[z] = Y, tV9[z] = new RegExp(q, K ? "g" : void 0), eV9[z] = new RegExp(Y, K ? "g" : void 0)
        };
    i5("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    i5("NUMERICIDENTIFIERLOOSE", "\\d+");
    i5("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${oT8}*`);
    i5("MAINVERSION", `(${b4[x4.NUMERICIDENTIFIER]})\\.(${b4[x4.NUMERICIDENTIFIER]})\\.(${b4[x4.NUMERICIDENTIFIER]})`);
    i5("MAINVERSIONLOOSE", `(${b4[x4.NUMERICIDENTIFIERLOOSE]})\\.(${b4[x4.NUMERICIDENTIFIERLOOSE]})\\.(${b4[x4.NUMERICIDENTIFIERLOOSE]})`);
    i5("PRERELEASEIDENTIFIER", `(?:${b4[x4.NONNUMERICIDENTIFIER]}|${b4[x4.NUMERICIDENTIFIER]})`);
    i5("PRERELEASEIDENTIFIERLOOSE", `(?:${b4[x4.NONNUMERICIDENTIFIER]}|${b4[x4.NUMERICIDENTIFIERLOOSE]})`);
    i5("PRERELEASE", `(?:-(${b4[x4.PRERELEASEIDENTIFIER]}(?:\\.${b4[x4.PRERELEASEIDENTIFIER]})*))`);
    i5("PRERELEASELOOSE", `(?:-?(${b4[x4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${b4[x4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    i5("BUILDIDENTIFIER", `${oT8}+`);
    i5("BUILD", `(?:\\+(${b4[x4.BUILDIDENTIFIER]}(?:\\.${b4[x4.BUILDIDENTIFIER]})*))`);
    i5("FULLPLAIN", `v?${b4[x4.MAINVERSION]}${b4[x4.PRERELEASE]}?${b4[x4.BUILD]}?`);
    i5("FULL", `^${b4[x4.FULLPLAIN]}$`);
    i5("LOOSEPLAIN", `[v=\\s]*${b4[x4.MAINVERSIONLOOSE]}${b4[x4.PRERELEASELOOSE]}?${b4[x4.BUILD]}?`);
    i5("LOOSE", `^${b4[x4.LOOSEPLAIN]}$`);
    i5("GTLT", "((?:<|>)?=?)");
    i5("XRANGEIDENTIFIERLOOSE", `${b4[x4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    i5("XRANGEIDENTIFIER", `${b4[x4.NUMERICIDENTIFIER]}|x|X|\\*`);
    i5("XRANGEPLAIN", `[v=\\s]*(${b4[x4.XRANGEIDENTIFIER]})(?:\\.(${b4[x4.XRANGEIDENTIFIER]})(?:\\.(${b4[x4.XRANGEIDENTIFIER]})(?:${b4[x4.PRERELEASE]})?${b4[x4.BUILD]}?)?)?`);
    i5("XRANGEPLAINLOOSE", `[v=\\s]*(${b4[x4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b4[x4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b4[x4.XRANGEIDENTIFIERLOOSE]})(?:${b4[x4.PRERELEASELOOSE]})?${b4[x4.BUILD]}?)?)?`);
    i5("XRANGE", `^${b4[x4.GTLT]}\\s*${b4[x4.XRANGEPLAIN]}$`);
    i5("XRANGELOOSE", `^${b4[x4.GTLT]}\\s*${b4[x4.XRANGEPLAINLOOSE]}$`);
    i5("COERCEPLAIN", `(^|[^\\d])(\\d{1,${rT8}})(?:\\.(\\d{1,${rT8}}))?(?:\\.(\\d{1,${rT8}}))?`);
    i5("COERCE", `${b4[x4.COERCEPLAIN]}(?:$|[^\\d])`);
    i5("COERCEFULL", b4[x4.COERCEPLAIN] + `(?:${b4[x4.PRERELEASE]})?(?:${b4[x4.BUILD]})?(?:$|[^\\d])`);
    i5("COERCERTL", b4[x4.COERCE], !0);
    i5("COERCERTLFULL", b4[x4.COERCEFULL], !0);
    i5("LONETILDE", "(?:~>?)");
    i5("TILDETRIM", `(\\s*)${b4[x4.LONETILDE]}\\s+`, !0);
    NB.tildeTrimReplace = "$1~";
    i5("TILDE", `^${b4[x4.LONETILDE]}${b4[x4.XRANGEPLAIN]}$`);
    i5("TILDELOOSE", `^${b4[x4.LONETILDE]}${b4[x4.XRANGEPLAINLOOSE]}$`);
    i5("LONECARET", "(?:\\^)");
    i5("CARETTRIM", `(\\s*)${b4[x4.LONECARET]}\\s+`, !0);
    NB.caretTrimReplace = "$1^";
    i5("CARET", `^${b4[x4.LONECARET]}${b4[x4.XRANGEPLAIN]}$`);
    i5("CARETLOOSE", `^${b4[x4.LONECARET]}${b4[x4.XRANGEPLAINLOOSE]}$`);
    i5("COMPARATORLOOSE", `^${b4[x4.GTLT]}\\s*(${b4[x4.LOOSEPLAIN]})$|^$`);
    i5("COMPARATOR", `^${b4[x4.GTLT]}\\s*(${b4[x4.FULLPLAIN]})$|^$`);
    i5("COMPARATORTRIM", `(\\s*)${b4[x4.GTLT]}\\s*(${b4[x4.LOOSEPLAIN]}|${b4[x4.XRANGEPLAIN]})`, !0);
    NB.comparatorTrimReplace = "$1$2$3";
    i5("HYPHENRANGE", `^\\s*(${b4[x4.XRANGEPLAIN]})\\s+-\\s+(${b4[x4.XRANGEPLAIN]})\\s*$`);
    i5("HYPHENRANGELOOSE", `^\\s*(${b4[x4.XRANGEPLAINLOOSE]})\\s+-\\s+(${b4[x4.XRANGEPLAINLOOSE]})\\s*$`);
    i5("STAR", "(<|>)?=?\\s*\\*");
    i5("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    i5("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 223100, Col 4)
hX1 = x((iB2, oA4) => {
    var zk9 = Object.freeze({
            loose: !0
        }),
        _k9 = Object.freeze({}),
        wk9 = (A) => {
            if (!A) return _k9;
            if (typeof A !== "object") return zk9;
            return A
        };
    oA4.exports = wk9
})
// @from(Ln 223112, Col 4)
eA4 = x((nB2, tA4) => {
    var aA4 = /^[0-9]+$/,
        sA4 = (A, q) => {
            if (typeof A === "number" && typeof q === "number") return A === q ? 0 : A < q ? -1 : 1;
            let K = aA4.test(A),
                Y = aA4.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        Ok9 = (A, q) => sA4(q, A);
    tA4.exports = {
        compareIdentifiers: sA4,
        rcompareIdentifiers: Ok9
    }
})