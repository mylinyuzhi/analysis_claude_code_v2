
// @from(Ln 141466, Col 4)
Gr1 = U((m38) => {
  var g38 = NA("process"),
    $FB = W01(),
    u38 = Qr1();

  function Xa(A, Q) {
    for (let B = 0; B < A.length; ++B)
      if (A[B].type === Q) return !0;
    return !1
  }

  function CFB(A) {
    for (let Q = 0; Q < A.length; ++Q) switch (A[Q].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return Q
    }
    return -1
  }

  function qFB(A) {
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

  function V01(A) {
    switch (A.type) {
      case "document":
        return A.start;
      case "block-map": {
        let Q = A.items[A.items.length - 1];
        return Q.sep ?? Q.start
      }
      case "block-seq":
        return A.items[A.items.length - 1].start;
      default:
        return []
    }
  }

  function fXA(A) {
    if (A.length === 0) return [];
    let Q = A.length;
    A: while (--Q >= 0) switch (A[Q].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break A
    }
    while (A[++Q]?.type === "space");
    return A.splice(Q, A.length)
  }

  function UFB(A) {
    if (A.start.type === "flow-seq-start") {
      for (let Q of A.items)
        if (Q.sep && !Q.value && !Xa(Q.start, "explicit-key-ind") && !Xa(Q.sep, "map-value-ind")) {
          if (Q.key) Q.value = Q.key;
          if (delete Q.key, qFB(Q.value))
            if (Q.value.end) Array.prototype.push.apply(Q.value.end, Q.sep);
            else Q.value.end = Q.sep;
          else Array.prototype.push.apply(Q.start, Q.sep);
          delete Q.sep
        }
    }
  }
  class NFB {
    constructor(A) {
      this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new u38.Lexer, this.onNewLine = A
    }* parse(A, Q = !1) {
      if (this.onNewLine && this.offset === 0) this.onNewLine(0);
      for (let B of this.lexer.lex(A, Q)) yield* this.next(B);
      if (!Q) yield* this.end()
    }* next(A) {
      if (this.source = A, g38.env.LOG_TOKENS) console.log("|", $FB.prettyToken(A));
      if (this.atScalar) {
        this.atScalar = !1, yield* this.step(), this.offset += A.length;
        return
      }
      let Q = $FB.tokenType(A);
      if (!Q) {
        let B = `Not a YAML token: ${A}`;
        yield* this.pop({
          type: "error",
          offset: this.offset,
          message: B,
          source: A
        }), this.offset += A.length
      } else if (Q === "scalar") this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = Q, yield* this.step(), Q) {
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
      let Q = A ?? this.stack.pop();
      if (!Q) yield {
        type: "error",
        offset: this.offset,
        source: "",
        message: "Tried to pop an empty stack"
      };
      else if (this.stack.length === 0) yield Q;
      else {
        let B = this.peek(1);
        if (Q.type === "block-scalar") Q.indent = "indent" in B ? B.indent : 0;
        else if (Q.type === "flow-collection" && B.type === "document") Q.indent = 0;
        if (Q.type === "flow-collection") UFB(Q);
        switch (B.type) {
          case "document":
            B.value = Q;
            break;
          case "block-scalar":
            B.props.push(Q);
            break;
          case "block-map": {
            let G = B.items[B.items.length - 1];
            if (G.value) {
              B.items.push({
                start: [],
                key: Q,
                sep: []
              }), this.onKeyLine = !0;
              return
            } else if (G.sep) G.value = Q;
            else {
              Object.assign(G, {
                key: Q,
                sep: []
              }), this.onKeyLine = !G.explicitKey;
              return
            }
            break
          }
          case "block-seq": {
            let G = B.items[B.items.length - 1];
            if (G.value) B.items.push({
              start: [],
              value: Q
            });
            else G.value = Q;
            break
          }
          case "flow-collection": {
            let G = B.items[B.items.length - 1];
            if (!G || G.value) B.items.push({
              start: [],
              key: Q,
              sep: []
            });
            else if (G.sep) G.value = Q;
            else Object.assign(G, {
              key: Q,
              sep: []
            });
            return
          }
          default:
            yield* this.pop(), yield* this.pop(Q)
        }
        if ((B.type === "document" || B.type === "block-map" || B.type === "block-seq") && (Q.type === "block-map" || Q.type === "block-seq")) {
          let G = Q.items[Q.items.length - 1];
          if (G && !G.sep && !G.value && G.start.length > 0 && CFB(G.start) === -1 && (Q.indent === 0 || G.start.every((Z) => Z.type !== "comment" || Z.indent < Q.indent))) {
            if (B.type === "document") B.end = G.start;
            else B.items.push({
              start: G.start
            });
            Q.items.splice(-1, 1)
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
          if (CFB(A.start) !== -1) yield* this.pop(), yield* this.step();
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
      let Q = this.startBlockValue(A);
      if (Q) this.stack.push(Q);
      else yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML document`,
        source: this.source
      }
    }* scalar(A) {
      if (this.type === "map-value-ind") {
        let Q = V01(this.peek(2)),
          B = fXA(Q),
          G;
        if (A.end) G = A.end, G.push(this.sourceToken), delete A.end;
        else G = [this.sourceToken];
        let Z = {
          type: "block-map",
          offset: A.offset,
          indent: A.indent,
          items: [{
            start: B,
            key: A,
            sep: G
          }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = Z
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
            let Q = this.source.indexOf(`
`) + 1;
            while (Q !== 0) this.onNewLine(this.offset + Q), Q = this.source.indexOf(`
`, Q) + 1
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop(), yield* this.step()
      }
    }* blockMap(A) {
      let Q = A.items[A.items.length - 1];
      switch (this.type) {
        case "newline":
          if (this.onKeyLine = !1, Q.value) {
            let B = "end" in Q.value ? Q.value.end : void 0;
            if ((Array.isArray(B) ? B[B.length - 1] : void 0)?.type === "comment") B?.push(this.sourceToken);
            else A.items.push({
              start: [this.sourceToken]
            })
          } else if (Q.sep) Q.sep.push(this.sourceToken);
          else Q.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (Q.value) A.items.push({
            start: [this.sourceToken]
          });
          else if (Q.sep) Q.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(Q.start, A.indent)) {
              let G = A.items[A.items.length - 2]?.value?.end;
              if (Array.isArray(G)) {
                Array.prototype.push.apply(G, Q.start), G.push(this.sourceToken), A.items.pop();
                return
              }
            }
            Q.start.push(this.sourceToken)
          }
          return
      }
      if (this.indent >= A.indent) {
        let B = !this.onKeyLine && this.indent === A.indent,
          G = B && (Q.sep || Q.explicitKey) && this.type !== "seq-item-ind",
          Z = [];
        if (G && Q.sep && !Q.value) {
          let Y = [];
          for (let J = 0; J < Q.sep.length; ++J) {
            let X = Q.sep[J];
            switch (X.type) {
              case "newline":
                Y.push(J);
                break;
              case "space":
                break;
              case "comment":
                if (X.indent > A.indent) Y.length = 0;
                break;
              default:
                Y.length = 0
            }
          }
          if (Y.length >= 2) Z = Q.sep.splice(Y[1])
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (G || Q.value) Z.push(this.sourceToken), A.items.push({
              start: Z
            }), this.onKeyLine = !0;
            else if (Q.sep) Q.sep.push(this.sourceToken);
            else Q.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            if (!Q.sep && !Q.explicitKey) Q.start.push(this.sourceToken), Q.explicitKey = !0;
            else if (G || Q.value) Z.push(this.sourceToken), A.items.push({
              start: Z,
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
            if (Q.explicitKey)
              if (!Q.sep)
                if (Xa(Q.start, "newline")) Object.assign(Q, {
                  key: null,
                  sep: [this.sourceToken]
                });
                else {
                  let Y = fXA(Q.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{
                      start: Y,
                      key: null,
                      sep: [this.sourceToken]
                    }]
                  })
                }
            else if (Q.value) A.items.push({
              start: [],
              key: null,
              sep: [this.sourceToken]
            });
            else if (Xa(Q.sep, "map-value-ind")) this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{
                start: Z,
                key: null,
                sep: [this.sourceToken]
              }]
            });
            else if (qFB(Q.key) && !Xa(Q.sep, "newline")) {
              let Y = fXA(Q.start),
                J = Q.key,
                X = Q.sep;
              X.push(this.sourceToken), delete Q.key, delete Q.sep, this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{
                  start: Y,
                  key: J,
                  sep: X
                }]
              })
            } else if (Z.length > 0) Q.sep = Q.sep.concat(Z, this.sourceToken);
            else Q.sep.push(this.sourceToken);
            else if (!Q.sep) Object.assign(Q, {
              key: null,
              sep: [this.sourceToken]
            });
            else if (Q.value || G) A.items.push({
              start: Z,
              key: null,
              sep: [this.sourceToken]
            });
            else if (Xa(Q.sep, "map-value-ind")) this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{
                start: [],
                key: null,
                sep: [this.sourceToken]
              }]
            });
            else Q.sep.push(this.sourceToken);
            this.onKeyLine = !0;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let Y = this.flowScalar(this.type);
            if (G || Q.value) A.items.push({
              start: Z,
              key: Y,
              sep: []
            }), this.onKeyLine = !0;
            else if (Q.sep) this.stack.push(Y);
            else Object.assign(Q, {
              key: Y,
              sep: []
            }), this.onKeyLine = !0;
            return
          }
          default: {
            let Y = this.startBlockValue(A);
            if (Y) {
              if (Y.type === "block-seq") {
                if (!Q.explicitKey && Q.sep && !Xa(Q.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source
                  });
                  return
                }
              } else if (B) A.items.push({
                start: Z
              });
              this.stack.push(Y);
              return
            }
          }
        }
      }
      yield* this.pop(), yield* this.step()
    }* blockSequence(A) {
      let Q = A.items[A.items.length - 1];
      switch (this.type) {
        case "newline":
          if (Q.value) {
            let B = "end" in Q.value ? Q.value.end : void 0;
            if ((Array.isArray(B) ? B[B.length - 1] : void 0)?.type === "comment") B?.push(this.sourceToken);
            else A.items.push({
              start: [this.sourceToken]
            })
          } else Q.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (Q.value) A.items.push({
            start: [this.sourceToken]
          });
          else {
            if (this.atIndentedComment(Q.start, A.indent)) {
              let G = A.items[A.items.length - 2]?.value?.end;
              if (Array.isArray(G)) {
                Array.prototype.push.apply(G, Q.start), G.push(this.sourceToken), A.items.pop();
                return
              }
            }
            Q.start.push(this.sourceToken)
          }
          return;
        case "anchor":
        case "tag":
          if (Q.value || this.indent <= A.indent) break;
          Q.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== A.indent) break;
          if (Q.value || Xa(Q.start, "seq-item-ind")) A.items.push({
            start: [this.sourceToken]
          });
          else Q.start.push(this.sourceToken);
          return
      }
      if (this.indent > A.indent) {
        let B = this.startBlockValue(A);
        if (B) {
          this.stack.push(B);
          return
        }
      }
      yield* this.pop(), yield* this.step()
    }* flowCollection(A) {
      let Q = A.items[A.items.length - 1];
      if (this.type === "flow-error-end") {
        let B;
        do yield* this.pop(), B = this.peek(1); while (B && B.type === "flow-collection")
      } else if (A.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!Q || Q.sep) A.items.push({
              start: [this.sourceToken]
            });
            else Q.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!Q || Q.value) A.items.push({
              start: [],
              key: null,
              sep: [this.sourceToken]
            });
            else if (Q.sep) Q.sep.push(this.sourceToken);
            else Object.assign(Q, {
              key: null,
              sep: [this.sourceToken]
            });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!Q || Q.value) A.items.push({
              start: [this.sourceToken]
            });
            else if (Q.sep) Q.sep.push(this.sourceToken);
            else Q.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let G = this.flowScalar(this.type);
            if (!Q || Q.value) A.items.push({
              start: [],
              key: G,
              sep: []
            });
            else if (Q.sep) this.stack.push(G);
            else Object.assign(Q, {
              key: G,
              sep: []
            });
            return
          }
          case "flow-map-end":
          case "flow-seq-end":
            A.end.push(this.sourceToken);
            return
        }
        let B = this.startBlockValue(A);
        if (B) this.stack.push(B);
        else yield* this.pop(), yield* this.step()
      } else {
        let B = this.peek(2);
        if (B.type === "block-map" && (this.type === "map-value-ind" && B.indent === A.indent || this.type === "newline" && !B.items[B.items.length - 1].sep)) yield* this.pop(), yield* this.step();
        else if (this.type === "map-value-ind" && B.type !== "flow-collection") {
          let G = V01(B),
            Z = fXA(G);
          UFB(A);
          let Y = A.end.splice(1, A.end.length);
          Y.push(this.sourceToken);
          let J = {
            type: "block-map",
            offset: A.offset,
            indent: A.indent,
            items: [{
              start: Z,
              key: A,
              sep: Y
            }]
          };
          this.onKeyLine = !0, this.stack[this.stack.length - 1] = J
        } else yield* this.lineEnd(A)
      }
    }
    flowScalar(A) {
      if (this.onNewLine) {
        let Q = this.source.indexOf(`
`) + 1;
        while (Q !== 0) this.onNewLine(this.offset + Q), Q = this.source.indexOf(`
`, Q) + 1
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
          let Q = V01(A),
            B = fXA(Q);
          return B.push(this.sourceToken), {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{
              start: B,
              explicitKey: !0
            }]
          }
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let Q = V01(A),
            B = fXA(Q);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{
              start: B,
              key: null,
              sep: [this.sourceToken]
            }]
          }
        }
      }
      return null
    }
    atIndentedComment(A, Q) {
      if (this.type !== "comment") return !1;
      if (this.indent <= Q) return !1;
      return A.every((B) => B.type === "newline" || B.type === "space")
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
  m38.Parser = NFB
})
// @from(Ln 142232, Col 4)
RFB = U((r38) => {
  var wFB = io1(),
    c38 = bMA(),
    dMA = fMA(),
    p38 = Bo1(),
    l38 = G7(),
    i38 = Br1(),
    LFB = Gr1();

  function OFB(A) {
    let Q = A.prettyErrors !== !1;
    return {
      lineCounter: A.lineCounter || Q && new i38.LineCounter || null,
      prettyErrors: Q
    }
  }

  function n38(A, Q = {}) {
    let {
      lineCounter: B,
      prettyErrors: G
    } = OFB(Q), Z = new LFB.Parser(B?.addNewLine), Y = new wFB.Composer(Q), J = Array.from(Y.compose(Z.parse(A)));
    if (G && B)
      for (let X of J) X.errors.forEach(dMA.prettifyError(A, B)), X.warnings.forEach(dMA.prettifyError(A, B));
    if (J.length > 0) return J;
    return Object.assign([], {
      empty: !0
    }, Y.streamInfo())
  }

  function MFB(A, Q = {}) {
    let {
      lineCounter: B,
      prettyErrors: G
    } = OFB(Q), Z = new LFB.Parser(B?.addNewLine), Y = new wFB.Composer(Q), J = null;
    for (let X of Y.compose(Z.parse(A), !0, A.length))
      if (!J) J = X;
      else if (J.options.logLevel !== "silent") {
      J.errors.push(new dMA.YAMLParseError(X.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break
    }
    if (G && B) J.errors.forEach(dMA.prettifyError(A, B)), J.warnings.forEach(dMA.prettifyError(A, B));
    return J
  }

  function a38(A, Q, B) {
    let G = void 0;
    if (typeof Q === "function") G = Q;
    else if (B === void 0 && Q && typeof Q === "object") B = Q;
    let Z = MFB(A, B);
    if (!Z) return null;
    if (Z.warnings.forEach((Y) => p38.warn(Z.options.logLevel, Y)), Z.errors.length > 0)
      if (Z.options.logLevel !== "silent") throw Z.errors[0];
      else Z.errors = [];
    return Z.toJS(Object.assign({
      reviver: G
    }, B))
  }

  function o38(A, Q, B) {
    let G = null;
    if (typeof Q === "function" || Array.isArray(Q)) G = Q;
    else if (B === void 0 && Q) B = Q;
    if (typeof B === "string") B = B.length;
    if (typeof B === "number") {
      let Z = Math.round(B);
      B = Z < 1 ? void 0 : Z > 8 ? {
        indent: 8
      } : {
        indent: Z
      }
    }
    if (A === void 0) {
      let {
        keepUndefined: Z
      } = B ?? Q ?? {};
      if (!Z) return
    }
    if (l38.isDocument(A) && !G) return A.toString(B);
    return new c38.Document(A, G, B).toString(B)
  }
  r38.parse = a38;
  r38.parseAllDocuments = n38;
  r38.parseDocument = MFB;
  r38.stringify = o38
})
// @from(Ln 142318, Col 4)
Q88
// @from(Ln 142318, Col 9)
B88
// @from(Ln 142318, Col 14)
G88
// @from(Ln 142318, Col 19)
Zr1
// @from(Ln 142318, Col 24)
Z88
// @from(Ln 142318, Col 29)
Ia
// @from(Ln 142318, Col 33)
Y88
// @from(Ln 142318, Col 38)
J88
// @from(Ln 142318, Col 43)
X88
// @from(Ln 142318, Col 48)
I88
// @from(Ln 142318, Col 53)
dqG
// @from(Ln 142318, Col 58)
D88
// @from(Ln 142318, Col 63)
W88
// @from(Ln 142318, Col 68)
K88
// @from(Ln 142318, Col 73)
F01
// @from(Ln 142318, Col 78)
_FB
// @from(Ln 142318, Col 83)
V88
// @from(Ln 142318, Col 88)
F88
// @from(Ln 142318, Col 93)
H88
// @from(Ln 142318, Col 98)
E88
// @from(Ln 142318, Col 103)
z88
// @from(Ln 142318, Col 108)
$88
// @from(Ln 142318, Col 113)
C88
// @from(Ln 142318, Col 118)
U88
// @from(Ln 142318, Col 123)
q88
// @from(Ln 142318, Col 128)
N88
// @from(Ln 142318, Col 133)
w88
// @from(Ln 142318, Col 138)
L88
// @from(Ln 142318, Col 143)
O88
// @from(Ln 142318, Col 148)
M88
// @from(Ln 142318, Col 153)
R88
// @from(Ln 142318, Col 158)
_88
// @from(Ln 142318, Col 163)
j88
// @from(Ln 142318, Col 168)
T88
// @from(Ln 142318, Col 173)
P88
// @from(Ln 142318, Col 178)
S88
// @from(Ln 142318, Col 183)
x88
// @from(Ln 142318, Col 188)
y88
// @from(Ln 142318, Col 193)
H01
// @from(Ln 142318, Col 198)
v88
// @from(Ln 142318, Col 203)
k88
// @from(Ln 142318, Col 208)
b88
// @from(Ln 142318, Col 213)
f88
// @from(Ln 142318, Col 218)
h88
// @from(Ln 142319, Col 4)
jFB = w(() => {
  Q88 = io1(), B88 = bMA(), G88 = Po1(), Zr1 = fMA(), Z88 = NMA(), Ia = G7(), Y88 = Ga(), J88 = mW(), X88 = Ya(), I88 = Ja(), dqG = W01(), D88 = Qr1(), W88 = Br1(), K88 = Gr1(), F01 = RFB(), _FB = UMA();
  V88 = Q88.Composer, F88 = B88.Document, H88 = G88.Schema, E88 = Zr1.YAMLError, z88 = Zr1.YAMLParseError, $88 = Zr1.YAMLWarning, C88 = Z88.Alias, U88 = Ia.isAlias, q88 = Ia.isCollection, N88 = Ia.isDocument, w88 = Ia.isMap, L88 = Ia.isNode, O88 = Ia.isPair, M88 = Ia.isScalar, R88 = Ia.isSeq, _88 = Y88.Pair, j88 = J88.Scalar, T88 = X88.YAMLMap, P88 = I88.YAMLSeq, S88 = D88.Lexer, x88 = W88.LineCounter, y88 = K88.Parser, H01 = F01.parse, v88 = F01.parseAllDocuments, k88 = F01.parseDocument, b88 = F01.stringify, f88 = _FB.visit, h88 = _FB.visitAsync
})
// @from(Ln 142324, Col 0)
function u88(A) {
  let Q = A.split(`
`),
    B = [];
  for (let G of Q) {
    let Z = G.match(/^([a-zA-Z_-]+):\s+(.+)$/);
    if (Z) {
      let [, Y, J] = Z;
      if (!Y || !J) {
        B.push(G);
        continue
      }
      if (J.startsWith('"') && J.endsWith('"') || J.startsWith("'") && J.endsWith("'")) {
        B.push(G);
        continue
      }
      if (g88.test(J)) {
        let X = J.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
        B.push(`${Y}: "${X}"`);
        continue
      }
    }
    B.push(G)
  }
  return B.join(`
`)
}
// @from(Ln 142352, Col 0)
function lK(A) {
  let Q = /^---\s*\n([\s\S]*?)---\s*\n?/,
    B = A.match(Q);
  if (!B) return {
    frontmatter: {},
    content: A
  };
  let G = B[1] || "",
    Z = A.slice(B[0].length),
    Y = {};
  try {
    let J = H01(G);
    if (J && typeof J === "object" && !Array.isArray(J)) Y = J
  } catch {
    try {
      let J = u88(G),
        X = H01(J);
      if (X && typeof X === "object" && !Array.isArray(X)) Y = X
    } catch {}
  }
  return {
    frontmatter: Y,
    content: Z
  }
}
// @from(Ln 142378, Col 0)
function TFB(A) {
  let Q = [],
    B = "",
    G = 0;
  for (let Y = 0; Y < A.length; Y++) {
    let J = A[Y];
    if (J === "{") G++, B += J;
    else if (J === "}") G--, B += J;
    else if (J === "," && G === 0) {
      let X = B.trim();
      if (X) Q.push(X);
      B = ""
    } else B += J
  }
  let Z = B.trim();
  if (Z) Q.push(Z);
  return Q.filter((Y) => Y.length > 0).flatMap((Y) => PFB(Y))
}
// @from(Ln 142397, Col 0)
function PFB(A) {
  let Q = A.match(/^([^{]*)\{([^}]+)\}(.*)$/);
  if (!Q) return [A];
  let B = Q[1] || "",
    G = Q[2] || "",
    Z = Q[3] || "",
    Y = G.split(",").map((X) => X.trim()),
    J = [];
  for (let X of Y) {
    let I = B + X + Z,
      D = PFB(I);
    J.push(...D)
  }
  return J
}
// @from(Ln 142412, Col 4)
g88
// @from(Ln 142413, Col 4)
Da = w(() => {
  jFB();
  g88 = /[{}[\]*&#!|>%@`]/
})
// @from(Ln 142418, Col 0)
function Wa(A) {
  switch (A) {
    case "userSettings":
      return "user";
    case "projectSettings":
      return "project";
    case "localSettings":
      return "project, gitignored";
    case "flagSettings":
      return "cli flag";
    case "policySettings":
      return "managed"
  }
}
// @from(Ln 142433, Col 0)
function E01(A) {
  switch (A) {
    case "userSettings":
      return "User";
    case "projectSettings":
      return "Project";
    case "localSettings":
      return "Local";
    case "flagSettings":
      return "Flag";
    case "policySettings":
      return "Managed";
    case "plugin":
      return "Plugin";
    case "built-in":
      return "Built-in"
  }
}
// @from(Ln 142452, Col 0)
function z01(A) {
  switch (A) {
    case "userSettings":
      return "user settings";
    case "projectSettings":
      return "shared project settings";
    case "localSettings":
      return "project local settings";
    case "flagSettings":
      return "command line arguments";
    case "policySettings":
      return "enterprise managed settings";
    case "cliArg":
      return "CLI argument";
    case "command":
      return "command configuration";
    case "session":
      return "current session"
  }
}
// @from(Ln 142473, Col 0)
function SFB(A) {
  switch (A) {
    case "userSettings":
      return "User settings";
    case "projectSettings":
      return "Shared project settings";
    case "localSettings":
      return "Project local settings";
    case "flagSettings":
      return "Command line arguments";
    case "policySettings":
      return "Enterprise managed settings";
    case "cliArg":
      return "CLI argument";
    case "command":
      return "Command configuration";
    case "session":
      return "Current session"
  }
}
// @from(Ln 142494, Col 0)
function xFB(A) {
  if (A === "") return [];
  let Q = A.split(",").map((G) => G.trim()),
    B = [];
  for (let G of Q) switch (G) {
    case "user":
      B.push("userSettings");
      break;
    case "project":
      B.push("projectSettings");
      break;
    case "local":
      B.push("localSettings");
      break;
    default:
      throw Error(`Invalid setting source: ${G}. Valid options are: user, project, local`)
  }
  return B
}
// @from(Ln 142514, Col 0)
function tQA() {
  let A = sb0(),
    Q = new Set(A);
  return Q.add("policySettings"), Q.add("flagSettings"), Array.from(Q)
}
// @from(Ln 142520, Col 0)
function iK(A) {
  return tQA().includes(A)
}
// @from(Ln 142523, Col 4)
yL
// @from(Ln 142523, Col 8)
yFB = "https://json.schemastore.org/claude-code-settings.json"
// @from(Ln 142524, Col 4)
YI = w(() => {
  C0();
  yL = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]
})
// @from(Ln 142529, Col 0)
function d88(A) {
  let Q = bH(A);
  if (!Q || !vA().existsSync(Q)) return null;
  try {
    let {
      resolvedPath: B
    } = xI(vA(), Q), G = nK(B);
    if (G.trim() === "") return {};
    let Z = c5(G, !1);
    return Z && typeof Z === "object" ? Z : null
  } catch {
    return null
  }
}
// @from(Ln 142544, Col 0)
function c88(A, Q) {
  if (!A || !A.permissions) return [];
  let {
    permissions: B
  } = A, G = [];
  for (let Z of m88) {
    let Y = B[Z];
    if (Y)
      for (let J of Y) G.push({
        source: Q,
        ruleBehavior: Z,
        ruleValue: mR(J)
      })
  }
  return G
}
// @from(Ln 142561, Col 0)
function $01() {
  let A = [];
  for (let Q of tQA()) A.push(...C01(Q));
  return A
}
// @from(Ln 142567, Col 0)
function C01(A) {
  let Q = dB(A);
  return c88(Q, A)
}
// @from(Ln 142572, Col 0)
function vFB(A) {
  if (!p88.includes(A.source)) return !1;
  let Q = S5(A.ruleValue),
    B = dB(A.source);
  if (!B || !B.permissions) return !1;
  let G = B.permissions[A.ruleBehavior];
  if (!G || !G.includes(Q)) return !1;
  try {
    let Z = {
        ...B,
        permissions: {
          ...B.permissions,
          [A.ruleBehavior]: G.filter((J) => J !== Q)
        }
      },
      {
        error: Y
      } = pB(A.source, Z);
    if (Y) return !1;
    return !0
  } catch (Z) {
    return e(Z instanceof Error ? Z : Error(String(Z))), !1
  }
}
// @from(Ln 142597, Col 0)
function l88() {
  return {
    permissions: {}
  }
}
// @from(Ln 142603, Col 0)
function U01({
  ruleValues: A,
  ruleBehavior: Q
}, B) {
  if (A.length < 1) return !0;
  let G = A.map(S5),
    Z = dB(B) || d88(B) || l88();
  try {
    let Y = Z.permissions || {},
      J = Y[Q] || [],
      X = new Set(J),
      I = G.filter((K) => !X.has(K));
    if (I.length === 0) return !0;
    let D = {
        ...Z,
        permissions: {
          ...Y,
          [Q]: [...J, ...I]
        }
      },
      W = pB(B, D);
    if (W.error) throw W.error;
    return !0
  } catch (Y) {
    return e(Y instanceof Error ? Y : Error(String(Y))), !1
  }
}
// @from(Ln 142630, Col 4)
m88
// @from(Ln 142630, Col 9)
p88
// @from(Ln 142631, Col 4)
eQA = w(() => {
  v1();
  YZ();
  YI();
  GB();
  DQ();
  y9();
  vI();
  m88 = ["allow", "deny", "ask"];
  p88 = ["userSettings", "projectSettings", "localSettings"]
})
// @from(Ln 142646, Col 0)
function ABA(A) {
  if (!A) return [];
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "addRules":
        return Q.rules;
      default:
        return []
    }
  })
}
// @from(Ln 142658, Col 0)
function UJ(A, Q) {
  switch (Q.type) {
    case "setMode":
      return k(`Applying permission update: Setting mode to '${Q.mode}'`), {
        ...A,
        mode: Q.mode
      };
    case "addRules": {
      let B = Q.rules.map((Z) => S5(Z));
      k(`Applying permission update: Adding ${Q.rules.length} ${Q.behavior} rule(s) to destination '${Q.destination}': ${eA(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: [...A[G][Q.destination] || [], ...B]
        }
      }
    }
    case "replaceRules": {
      let B = Q.rules.map((Z) => S5(Z));
      k(`Replacing all ${Q.behavior} rules for destination '${Q.destination}' with ${Q.rules.length} rule(s): ${eA(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: B
        }
      }
    }
    case "addDirectories": {
      k(`Applying permission update: Adding ${Q.directories.length} director${Q.directories.length===1?"y":"ies"} with destination '${Q.destination}': ${eA(Q.directories)}`);
      let B = new Map(A.additionalWorkingDirectories);
      for (let G of Q.directories) B.set(G, {
        path: G,
        source: Q.destination
      });
      return {
        ...A,
        additionalWorkingDirectories: B
      }
    }
    case "removeRules": {
      let B = Q.rules.map((X) => S5(X));
      k(`Applying permission update: Removing ${Q.rules.length} ${Q.behavior} rule(s) from source '${Q.destination}': ${eA(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
        Z = A[G][Q.destination] || [],
        Y = new Set(B),
        J = Z.filter((X) => !Y.has(X));
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: J
        }
      }
    }
    case "removeDirectories": {
      k(`Applying permission update: Removing ${Q.directories.length} director${Q.directories.length===1?"y":"ies"}: ${eA(Q.directories)}`);
      let B = new Map(A.additionalWorkingDirectories);
      for (let G of Q.directories) B.delete(G);
      return {
        ...A,
        additionalWorkingDirectories: B
      }
    }
    default:
      return A
  }
}
// @from(Ln 142730, Col 0)
function Wk(A, Q) {
  let B = A;
  for (let G of Q) B = UJ(B, G);
  return B
}
// @from(Ln 142736, Col 0)
function q01(A) {
  return A === "localSettings" || A === "userSettings" || A === "projectSettings"
}
// @from(Ln 142740, Col 0)
function Kk(A) {
  if (!q01(A.destination)) return;
  switch (k(`Persisting permission update: ${A.type} to source '${A.destination}'`), A.type) {
    case "addRules": {
      k(`Persisting ${A.rules.length} ${A.behavior} rule(s) to ${A.destination}`), U01({
        ruleValues: A.rules,
        ruleBehavior: A.behavior
      }, A.destination);
      break
    }
    case "addDirectories": {
      k(`Persisting ${A.directories.length} director${A.directories.length===1?"y":"ies"} to ${A.destination}`);
      let B = dB(A.destination)?.permissions?.additionalDirectories || [],
        G = A.directories.filter((Z) => !B.includes(Z));
      if (G.length > 0) {
        let Z = [...B, ...G];
        pB(A.destination, {
          permissions: {
            additionalDirectories: Z
          }
        })
      }
      break
    }
    case "removeRules": {
      k(`Removing ${A.rules.length} ${A.behavior} rule(s) from ${A.destination}`);
      let G = (dB(A.destination)?.permissions || {})[A.behavior] || [],
        Z = new Set(A.rules.map(S5)),
        Y = G.filter((J) => !Z.has(J));
      pB(A.destination, {
        permissions: {
          [A.behavior]: Y
        }
      });
      break
    }
    case "removeDirectories": {
      k(`Removing ${A.directories.length} director${A.directories.length===1?"y":"ies"} from ${A.destination}`);
      let B = dB(A.destination)?.permissions?.additionalDirectories || [],
        G = new Set(A.directories),
        Z = B.filter((Y) => !G.has(Y));
      pB(A.destination, {
        permissions: {
          additionalDirectories: Z
        }
      });
      break
    }
    case "setMode": {
      k(`Persisting mode '${A.mode}' to ${A.destination}`), pB(A.destination, {
        permissions: {
          defaultMode: A.mode
        }
      });
      break
    }
    case "replaceRules": {
      k(`Replacing all ${A.behavior} rules in ${A.destination} with ${A.rules.length} rule(s)`);
      let Q = A.rules.map(S5);
      pB(A.destination, {
        permissions: {
          [A.behavior]: Q
        }
      });
      break
    }
  }
}
// @from(Ln 142809, Col 0)
function cMA(A) {
  for (let Q of A) Kk(Q)
}
// @from(Ln 142813, Col 0)
function N01(A, Q = "session") {
  try {
    if (vA().statSync(A).isDirectory()) {
      let G = w01(A);
      if (G === "/") return;
      return {
        type: "addRules",
        rules: [{
          toolName: "Read",
          ruleContent: i88.isAbsolute(G) ? `/${G}/**` : `${G}/**`
        }],
        behavior: "allow",
        destination: Q
      }
    }
  } catch {}
  return
}
// @from(Ln 142831, Col 4)
dW = w(() => {
  YZ();
  T1();
  GB();
  eQA();
  DQ();
  AY();
  A0()
})
// @from(Ln 142840, Col 4)
X9 = "Bash"
// @from(Ln 142842, Col 0)
function DB(A, Q) {
  if (!process.env.SRT_DEBUG) return;
  let B = Q?.level || "info",
    G = "[SandboxDebug]";
  switch (B) {
    case "error":
      console.error(`${G} ${A}`);
      break;
    case "warn":
      console.warn(`${G} ${A}`);
      break;
    default:
      console.error(`${G} ${A}`)
  }
}
// @from(Ln 142873, Col 0)
function kFB(A) {
  let Q = n88();
  return Q.on("connect", async (B, G) => {
    G.on("error", (Z) => {
      DB(`Client socket error: ${Z.message}`, {
        level: "error"
      })
    });
    try {
      let [Z, Y] = B.url.split(":"), J = Y === void 0 ? void 0 : parseInt(Y, 10);
      if (!Z || !J) {
        DB(`Invalid CONNECT request: ${B.url}`, {
          level: "error"
        }), G.end(`HTTP/1.1 400 Bad Request\r
\r
`);
        return
      }
      if (!await A.filter(J, Z, G)) {
        DB(`Connection blocked to ${Z}:${J}`, {
          level: "error"
        }), G.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
        return
      }
      let I = r88(J, Z, () => {
        G.write(`HTTP/1.1 200 Connection Established\r
\r
`), I.pipe(G), G.pipe(I)
      });
      I.on("error", (D) => {
        DB(`CONNECT tunnel failed: ${D.message}`, {
          level: "error"
        }), G.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
      }), G.on("error", (D) => {
        DB(`Client socket error: ${D.message}`, {
          level: "error"
        }), I.destroy()
      }), G.on("end", () => I.end()), I.on("end", () => G.end())
    } catch (Z) {
      DB(`Error handling CONNECT: ${Z}`, {
        level: "error"
      }), G.end(`HTTP/1.1 500 Internal Server Error\r
\r
`)
    }
  }), Q.on("request", async (B, G) => {
    try {
      let Z = new s88(B.url),
        Y = Z.hostname,
        J = Z.port ? parseInt(Z.port, 10) : Z.protocol === "https:" ? 443 : 80;
      if (!await A.filter(J, Y, B.socket)) {
        DB(`HTTP request blocked to ${Y}:${J}`, {
          level: "error"
        }), G.writeHead(403, {
          "Content-Type": "text/plain",
          "X-Proxy-Error": "blocked-by-allowlist"
        }), G.end("Connection blocked by network allowlist");
        return
      }
      let D = (Z.protocol === "https:" ? o88 : a88)({
        hostname: Y,
        port: J,
        path: Z.pathname + Z.search,
        method: B.method,
        headers: {
          ...B.headers,
          host: Z.host
        }
      }, (W) => {
        G.writeHead(W.statusCode, W.headers), W.pipe(G)
      });
      D.on("error", (W) => {
        if (DB(`Proxy request failed: ${W.message}`, {
            level: "error"
          }), !G.headersSent) G.writeHead(502, {
          "Content-Type": "text/plain"
        }), G.end("Bad Gateway")
      }), B.pipe(D)
    } catch (Z) {
      DB(`Error handling HTTP request: ${Z}`, {
        level: "error"
      }), G.writeHead(500, {
        "Content-Type": "text/plain"
      }), G.end("Internal Server Error")
    }
  }), Q
}
// @from(Ln 142966, Col 4)
bFB = () => {}
// @from(Ln 142967, Col 4)
cFB = U((qNG, dFB) => {
  var {
    create: t88,
    defineProperty: L01,
    getOwnPropertyDescriptor: e88,
    getOwnPropertyNames: A58,
    getPrototypeOf: Q58
  } = Object, B58 = Object.prototype.hasOwnProperty, G58 = (A, Q) => {
    for (var B in Q) L01(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, fFB = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of A58(Q))
        if (!B58.call(A, Z) && Z !== B) L01(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = e88(Q, Z)) || G.enumerable
        })
    }
    return A
  }, hFB = (A, Q, B) => (B = A != null ? t88(Q58(A)) : {}, fFB(Q || !A || !A.__esModule ? L01(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Z58 = (A) => fFB(L01({}, "__esModule", {
    value: !0
  }), A), gFB = {};
  G58(gFB, {
    Socks5Server: () => mFB,
    createServer: () => I58,
    defaultConnectionHandler: () => Jr1
  });
  dFB.exports = Z58(gFB);
  var Y58 = hFB(NA("net")),
    uFB = ((A) => {
      return A[A.connect = 1] = "connect", A[A.bind = 2] = "bind", A[A.udp = 3] = "udp", A
    })(uFB || {}),
    Yr1 = ((A) => {
      return A[A.REQUEST_GRANTED = 0] = "REQUEST_GRANTED", A[A.GENERAL_FAILURE = 1] = "GENERAL_FAILURE", A[A.CONNECTION_NOT_ALLOWED = 2] = "CONNECTION_NOT_ALLOWED", A[A.NETWORK_UNREACHABLE = 3] = "NETWORK_UNREACHABLE", A[A.HOST_UNREACHABLE = 4] = "HOST_UNREACHABLE", A[A.CONNECTION_REFUSED = 5] = "CONNECTION_REFUSED", A[A.TTL_EXPIRED = 6] = "TTL_EXPIRED", A[A.COMMAND_NOT_SUPPORTED = 7] = "COMMAND_NOT_SUPPORTED", A[A.ADDRESS_TYPE_NOT_SUPPORTED = 8] = "ADDRESS_TYPE_NOT_SUPPORTED", A
    })(Yr1 || {}),
    J58 = class {
      constructor(A, Q) {
        this.errorHandler = () => {}, this.metadata = {}, this.socket = Q, this.server = A, Q.on("error", this.errorHandler), Q.pause(), this.handleGreeting()
      }
      readBytes(A) {
        return new Promise((Q) => {
          let B = Buffer.allocUnsafe(A),
            G = 0,
            Z = (Y) => {
              let J = Math.min(Y.length, A - G);
              if (Y.copy(B, G, 0, J), G += J, G < A) return;
              this.socket.removeListener("data", Z), this.socket.push(Y.subarray(J)), Q(B), this.socket.pause()
            };
          this.socket.on("data", Z), this.socket.resume()
        })
      }
      async handleGreeting() {
        if ((await this.readBytes(1)).readUInt8() !== 5) return this.socket.destroy();
        let Q = (await this.readBytes(1)).readUInt8();
        if (Q > 128 || Q === 0) return this.socket.destroy();
        let B = await this.readBytes(Q),
          G = this.server.authHandler ? 2 : 0;
        if (!B.includes(G)) return this.socket.write(Buffer.from([5, 255])), this.socket.destroy();
        if (this.socket.write(Buffer.from([5, G])), this.server.authHandler) this.handleUserPassword();
        else this.handleConnectionRequest()
      }
      async handleUserPassword() {
        await this.readBytes(1);
        let A = (await this.readBytes(1)).readUint8(),
          Q = (await this.readBytes(A)).toString(),
          B = (await this.readBytes(1)).readUint8(),
          G = (await this.readBytes(B)).toString();
        this.username = Q, this.password = G;
        let Z = !1,
          Y = () => {
            if (Z) return;
            Z = !0, this.socket.write(Buffer.from([1, 0])), this.handleConnectionRequest()
          },
          J = () => {
            if (Z) return;
            Z = !0, this.socket.write(Buffer.from([1, 1])), this.socket.destroy()
          },
          X = await this.server.authHandler(this, Y, J);
        if (X === !0) Y();
        else if (X === !1) J()
      }
      async handleConnectionRequest() {
        await this.readBytes(1);
        let A = (await this.readBytes(1))[0],
          Q = uFB[A];
        if (!Q) return this.socket.destroy();
        this.command = Q, await this.readBytes(1);
        let B = (await this.readBytes(1)).readUInt8(),
          G = "";
        switch (B) {
          case 1:
            G = (await this.readBytes(4)).join(".");
            break;
          case 3:
            let D = (await this.readBytes(1)).readUInt8();
            G = (await this.readBytes(D)).toString();
            break;
          case 4:
            let W = await this.readBytes(16);
            for (let K = 0; K < 16; K++) {
              if (K % 2 === 0 && K > 0) G += ":";
              G += `${W[K]<16?"0":""}${W[K].toString(16)}`
            }
            break;
          default:
            this.socket.destroy();
            return
        }
        let Z = (await this.readBytes(2)).readUInt16BE();
        if (!this.server.supportedCommands.has(Q)) return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
        this.destAddress = G, this.destPort = Z;
        let Y = !1,
          J = () => {
            if (Y) return;
            Y = !0, this.connect()
          };
        if (!this.server.rulesetValidator) return J();
        let X = () => {
            if (Y) return;
            Y = !0, this.socket.write(Buffer.from([5, 2, 0, 1, 0, 0, 0, 0, 0, 0])), this.socket.destroy()
          },
          I = await this.server.rulesetValidator(this, J, X);
        if (I === !0) J();
        else if (I === !1) X()
      }
      connect() {
        this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (A) => {
          if (Yr1[A] === void 0) throw Error(`"${A}" is not a valid status.`);
          if (this.socket.write(Buffer.from([5, Yr1[A], 0, 1, 0, 0, 0, 0, 0, 0])), A !== "REQUEST_GRANTED") this.socket.destroy()
        }), this.socket.resume()
      }
    },
    X58 = hFB(NA("net"));

  function Jr1(A, Q) {
    if (A.command !== "connect") return Q("COMMAND_NOT_SUPPORTED");
    A.socket.on("error", () => {});
    let B = X58.default.createConnection({
      host: A.destAddress,
      port: A.destPort
    });
    B.setNoDelay();
    let G = !1;
    return B.on("error", (Z) => {
      if (!G) switch (Z.code) {
        case "EINVAL":
        case "ENOENT":
        case "ENOTFOUND":
        case "ETIMEDOUT":
        case "EADDRNOTAVAIL":
        case "EHOSTUNREACH":
          Q("HOST_UNREACHABLE");
          break;
        case "ENETUNREACH":
          Q("NETWORK_UNREACHABLE");
          break;
        case "ECONNREFUSED":
          Q("CONNECTION_REFUSED");
          break;
        default:
          Q("GENERAL_FAILURE")
      }
    }), B.on("ready", () => {
      G = !0, Q("REQUEST_GRANTED"), A.socket.pipe(B).pipe(A.socket)
    }), A.socket.on("close", () => B.destroy()), B
  }
  var mFB = class {
    constructor() {
      this.supportedCommands = new Set(["connect"]), this.connectionHandler = Jr1, this.server = Y58.default.createServer((A) => {
        A.setNoDelay(), this._handleConnection(A)
      })
    }
    listen(...A) {
      return this.server.listen(...A), this
    }
    close(A) {
      return this.server.close(A), this
    }
    setAuthHandler(A) {
      return this.authHandler = A, this
    }
    disableAuthHandler() {
      return this.authHandler = void 0, this
    }
    setRulesetValidator(A) {
      return this.rulesetValidator = A, this
    }
    disableRulesetValidator() {
      return this.rulesetValidator = void 0, this
    }
    setConnectionHandler(A) {
      return this.connectionHandler = A, this
    }
    useDefaultConnectionHandler() {
      return this.connectionHandler = Jr1, this
    }
    _handleConnection(A) {
      return new J58(this, A), this
    }
  };

  function I58(A) {
    let Q = new mFB;
    if (A?.auth) Q.setAuthHandler((B) => {
      return B.username === A.auth.username && B.password === A.auth.password
    });
    if (A?.port) Q.listen(A.port, A.hostname);
    return Q
  }
})
// @from(Ln 143183, Col 0)
function lFB(A) {
  let Q = pFB.createServer();
  return Q.setRulesetValidator(async (B) => {
    try {
      let {
        destAddress: G,
        destPort: Z
      } = B;
      if (DB(`Connection request to ${G}:${Z}`), !await A.filter(Z, G)) return DB(`Connection blocked to ${G}:${Z}`, {
        level: "error"
      }), !1;
      return DB(`Connection allowed to ${G}:${Z}`), !0
    } catch (G) {
      return DB(`Error validating connection: ${G}`, {
        level: "error"
      }), !1
    }
  }), {
    server: Q,
    getPort() {
      try {
        let B = Q?.server;
        if (B && typeof B?.address === "function") {
          let G = B.address();
          if (G && typeof G === "object" && "port" in G) return G.port
        }
      } catch (B) {
        DB(`Error getting port: ${B}`, {
          level: "error"
        })
      }
      return
    },
    listen(B, G) {
      return new Promise((Z, Y) => {
        let J = () => {
          let X = this.getPort();
          if (X) DB(`SOCKS proxy listening on ${G}:${X}`), Z(X);
          else Y(Error("Failed to get SOCKS proxy server port"))
        };
        Q.listen(B, G, J)
      })
    },
    async close() {
      return new Promise((B, G) => {
        Q.close((Z) => {
          if (Z) {
            let Y = Z.message?.toLowerCase() || "";
            if (!(Y.includes("not running") || Y.includes("already closed") || Y.includes("not listening"))) {
              G(Z);
              return
            }
          }
          B()
        })
      })
    },
    unref() {
      try {
        let B = Q?.server;
        if (B && typeof B?.unref === "function") B.unref()
      } catch (B) {
        DB(`Error calling unref: ${B}`, {
          level: "error"
        })
      }
    }
  }
}
// @from(Ln 143252, Col 4)
pFB
// @from(Ln 143253, Col 4)
iFB = w(() => {
  pFB = c(cFB(), 1)
})
// @from(Ln 143257, Col 0)
function dR() {
  switch (process.platform) {
    case "darwin":
      return "macos";
    case "linux":
      return "linux";
    case "win32":
      return "windows";
    default:
      return "unknown"
  }
}
// @from(Ln 143276, Col 0)
function nFB() {
  try {
    return D58("which", ["rg"], {
      stdio: "ignore",
      timeout: 1000
    }).status === 0
  } catch {
    return !1
  }
}
// @from(Ln 143286, Col 0)
async function aFB(A, Q, B, G = {
  command: "rg"
}) {
  let {
    command: Z,
    args: Y = []
  } = G;
  return new Promise((J, X) => {
    W58(Z, [...Y, ...A, Q], {
      maxBuffer: 20000000,
      signal: B,
      timeout: 1e4
    }, (I, D, W) => {
      if (!I) {
        J(D.trim().split(`
`).filter(Boolean));
        return
      }
      if (I.code === 1) {
        J([]);
        return
      }
      X(Error(`ripgrep failed with exit code ${I.code}: ${W||I.message}`))
    })
  })
}
// @from(Ln 143312, Col 4)
Xr1 = () => {}
// @from(Ln 143319, Col 0)
function O01() {
  return [...K58.filter((A) => A !== ".git"), ".claude/commands", ".claude/agents"]
}
// @from(Ln 143323, Col 0)
function Wr1(A) {
  return A.toLowerCase()
}
// @from(Ln 143327, Col 0)
function WP(A) {
  return A.includes("*") || A.includes("?") || A.includes("[") || A.includes("]")
}
// @from(Ln 143331, Col 0)
function lMA(A) {
  return A.replace(/\/\*\*$/, "")
}
// @from(Ln 143335, Col 0)
function oFB(A, Q) {
  let B = vL.normalize(A),
    G = vL.normalize(Q);
  if (G === B) return !1;
  if (B.startsWith("/tmp/") && G === "/private" + B) return !1;
  if (B.startsWith("/var/") && G === "/private" + B) return !1;
  if (B.startsWith("/private/tmp/") && G === B) return !1;
  if (B.startsWith("/private/var/") && G === B) return !1;
  if (G === "/") return !0;
  if (G.split("/").filter(Boolean).length <= 1) return !0;
  if (B.startsWith(G + "/")) return !0;
  let Y = B;
  if (B.startsWith("/tmp/")) Y = "/private" + B;
  else if (B.startsWith("/var/")) Y = "/private" + B;
  if (Y !== B && Y.startsWith(G + "/")) return !0;
  let J = G.startsWith(B + "/"),
    X = Y !== B && G.startsWith(Y + "/");
  if (G !== B && !(Y !== B && G === Y) && !J && !X) return !0;
  return !1
}
// @from(Ln 143356, Col 0)
function KP(A) {
  let Q = process.cwd(),
    B = A;
  if (A === "~") B = Ir1();
  else if (A.startsWith("~/")) B = Ir1() + A.slice(1);
  else if (A.startsWith("./") || A.startsWith("../")) B = vL.resolve(Q, A);
  else if (!vL.isAbsolute(A)) B = vL.resolve(Q, A);
  if (WP(B)) {
    let G = B.split(/[*?[\]]/)[0];
    if (G && G !== "/") {
      let Z = G.endsWith("/") ? G.slice(0, -1) : vL.dirname(G);
      try {
        let Y = Dr1.realpathSync(Z);
        if (!oFB(Z, Y)) {
          let J = B.slice(Z.length);
          return Y + J
        }
      } catch {}
    }
    return B
  }
  try {
    let G = Dr1.realpathSync(B);
    if (oFB(B, G));
    else B = G
  } catch {}
  return B
}
// @from(Ln 143385, Col 0)
function iMA() {
  let A = Ir1();
  return ["/dev/stdout", "/dev/stderr", "/dev/null", "/dev/tty", "/dev/dtracehelper", "/dev/autofs_nowait", "/tmp/claude", "/private/tmp/claude", vL.join(A, ".npm/_logs"), vL.join(A, ".claude/debug")]
}
// @from(Ln 143390, Col 0)
function M01(A, Q) {
  let B = ["SANDBOX_RUNTIME=1", "TMPDIR=/tmp/claude"];
  if (!A && !Q) return B;
  let G = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
  if (B.push(`NO_PROXY=${G}`), B.push(`no_proxy=${G}`), A) B.push(`HTTP_PROXY=http://localhost:${A}`), B.push(`HTTPS_PROXY=http://localhost:${A}`), B.push(`http_proxy=http://localhost:${A}`), B.push(`https_proxy=http://localhost:${A}`);
  if (Q) {
    if (B.push(`ALL_PROXY=socks5h://localhost:${Q}`), B.push(`all_proxy=socks5h://localhost:${Q}`), dR() === "macos") B.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${Q} %h %p'`);
    if (B.push(`FTP_PROXY=socks5h://localhost:${Q}`), B.push(`ftp_proxy=socks5h://localhost:${Q}`), B.push(`RSYNC_PROXY=localhost:${Q}`), B.push(`DOCKER_HTTP_PROXY=http://localhost:${A||Q}`), B.push(`DOCKER_HTTPS_PROXY=http://localhost:${A||Q}`), A) B.push("CLOUDSDK_PROXY_TYPE=https"), B.push("CLOUDSDK_PROXY_ADDRESS=localhost"), B.push(`CLOUDSDK_PROXY_PORT=${A}`);
    B.push(`GRPC_PROXY=socks5h://localhost:${Q}`), B.push(`grpc_proxy=socks5h://localhost:${Q}`)
  }
  return B
}
// @from(Ln 143403, Col 0)
function R01(A) {
  let Q = A.slice(0, 100);
  return Buffer.from(Q).toString("base64")
}
// @from(Ln 143408, Col 0)
function rFB(A) {
  return Buffer.from(A, "base64").toString("utf8")
}
// @from(Ln 143411, Col 4)
pMA
// @from(Ln 143411, Col 9)
K58
// @from(Ln 143412, Col 4)
hXA = w(() => {
  pMA = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], K58 = [".git", ".vscode", ".idea"]
})
// @from(Ln 143424, Col 0)
function eFB() {
  let A = process.arch;
  switch (A) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      return DB("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
        level: "error"
      }), null;
    default:
      return DB(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
  }
}
// @from(Ln 143443, Col 0)
function Vr1() {
  let A = eFB();
  if (!A) return DB(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`), null;
  DB(`[SeccompFilter] Detected architecture: ${A}`);
  let Q = sFB(tFB(import.meta.url)),
    B = Ka("vendor", "seccomp", A, "unix-block.bpf"),
    G = [Ka(Q, B), Ka(Q, "..", "..", B), Ka(Q, "..", B)];
  for (let Z of G)
    if (Kr1.existsSync(Z)) return DB(`[SeccompFilter] Found pre-generated BPF filter: ${Z} (${A})`), Z;
  return DB(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${A})`), null
}
// @from(Ln 143455, Col 0)
function _01() {
  let A = eFB();
  if (!A) return DB(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
  DB(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${A}`);
  let Q = sFB(tFB(import.meta.url)),
    B = Ka("vendor", "seccomp", A, "apply-seccomp"),
    G = [Ka(Q, B), Ka(Q, "..", "..", B), Ka(Q, "..", B)];
  for (let Z of G)
    if (Kr1.existsSync(Z)) return DB(`[SeccompFilter] Found apply-seccomp binary: ${Z} (${A})`), Z;
  return DB(`[SeccompFilter] apply-seccomp binary not found in any expected location (${A})`), null
}
// @from(Ln 143467, Col 0)
function AHB() {
  let A = Vr1();
  if (A) return DB("[SeccompFilter] Using pre-generated BPF filter"), A;
  return DB("[SeccompFilter] Pre-generated BPF filter not available for this architecture. Only x64 and arm64 are supported.", {
    level: "error"
  }), null
}
// @from(Ln 143475, Col 0)
function Fr1(A) {}
// @from(Ln 143476, Col 4)
QHB = () => {}
// @from(Ln 143492, Col 0)
function F58(A, Q) {
  let B = A.split(Mz.sep),
    G = "";
  for (let Z of B) {
    if (!Z) continue;
    let Y = G + Mz.sep + Z;
    try {
      if (FC.lstatSync(Y).isSymbolicLink()) {
        if (Q.some((I) => Y.startsWith(I + "/") || Y === I)) return Y
      }
    } catch {
      break
    }
    G = Y
  }
  return null
}
// @from(Ln 143510, Col 0)
function H58(A) {
  let Q = A.split(Mz.sep),
    B = "";
  for (let G of Q) {
    if (!G) continue;
    let Z = B + Mz.sep + G;
    if (!FC.existsSync(Z)) return Z;
    B = Z
  }
  return A
}
// @from(Ln 143521, Col 0)
async function E58(A = {
  command: "rg"
}, Q = zr1, B = !1, G) {
  let Z = process.cwd(),
    Y = new AbortController,
    J = G ?? Y.signal,
    X = O01(),
    I = [...pMA.map((K) => Mz.resolve(Z, K)), ...X.map((K) => Mz.resolve(Z, K)), Mz.resolve(Z, ".git/hooks")];
  if (!B) I.push(Mz.resolve(Z, ".git/config"));
  let D = [];
  for (let K of pMA) D.push("--iglob", K);
  for (let K of X) D.push("--iglob", `**/${K}/**`);
  if (D.push("--iglob", "**/.git/hooks/**"), !B) D.push("--iglob", "**/.git/config");
  let W = [];
  try {
    W = await aFB(["--files", "--hidden", "--max-depth", String(Q), ...D, "-g", "!**/node_modules/**"], Z, J, A)
  } catch (K) {
    DB(`[Sandbox] ripgrep scan failed: ${K}`)
  }
  for (let K of W) {
    let V = Mz.resolve(Z, K),
      F = !1;
    for (let H of [...X, ".git"]) {
      let E = Wr1(H),
        z = V.split(Mz.sep),
        $ = z.findIndex((O) => Wr1(O) === E);
      if ($ !== -1) {
        if (H === ".git") {
          let O = z.slice(0, $ + 1).join(Mz.sep);
          if (K.includes(".git/hooks")) I.push(Mz.join(O, "hooks"));
          else if (K.includes(".git/config")) I.push(Mz.join(O, "config"))
        } else I.push(z.slice(0, $ + 1).join(Mz.sep));
        F = !0;
        break
      }
    }
    if (!F) I.push(V)
  }
  return [...new Set(I)]
}
// @from(Ln 143562, Col 0)
function z58() {
  if (YHB) return;
  process.on("exit", () => {
    for (let A of Er1) try {
      Fr1(A)
    } catch {}
  }), YHB = !0
}
// @from(Ln 143571, Col 0)
function JHB(A = !1) {
  try {
    let Q = Hr1("which", ["bwrap"], {
        stdio: "ignore",
        timeout: 1000
      }),
      B = Hr1("which", ["socat"], {
        stdio: "ignore",
        timeout: 1000
      }),
      G = Q.status === 0 && B.status === 0;
    if (!A) {
      let Z = Vr1() !== null,
        Y = _01() !== null;
      if (!Z || !Y) DB(`[Sandbox Linux] Seccomp filtering not available (missing binaries for ${process.arch}). Sandbox will run without Unix socket blocking (allowAllUnixSockets mode). This is less restrictive but still provides filesystem and network isolation.`, {
        level: "warn"
      })
    }
    return G
  } catch {
    return !1
  }
}
// @from(Ln 143594, Col 0)
async function XHB(A, Q) {
  let B = V58(8).toString("hex"),
    G = ZHB(GHB(), `claude-http-${B}.sock`),
    Z = ZHB(GHB(), `claude-socks-${B}.sock`),
    Y = [`UNIX-LISTEN:${G},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  DB(`Starting HTTP bridge: socat ${Y.join(" ")}`);
  let J = BHB("socat", Y, {
    stdio: "ignore"
  });
  if (!J.pid) throw Error("Failed to start HTTP bridge process");
  J.on("error", (W) => {
    DB(`HTTP bridge process error: ${W}`, {
      level: "error"
    })
  }), J.on("exit", (W, K) => {
    DB(`HTTP bridge process exited with code ${W}, signal ${K}`, {
      level: W === 0 ? "info" : "error"
    })
  });
  let X = [`UNIX-LISTEN:${Z},fork,reuseaddr`, `TCP:localhost:${Q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  DB(`Starting SOCKS bridge: socat ${X.join(" ")}`);
  let I = BHB("socat", X, {
    stdio: "ignore"
  });
  if (!I.pid) {
    if (J.pid) try {
      process.kill(J.pid, "SIGTERM")
    } catch {}
    throw Error("Failed to start SOCKS bridge process")
  }
  I.on("error", (W) => {
    DB(`SOCKS bridge process error: ${W}`, {
      level: "error"
    })
  }), I.on("exit", (W, K) => {
    DB(`SOCKS bridge process exited with code ${W}, signal ${K}`, {
      level: W === 0 ? "info" : "error"
    })
  });
  let D = 5;
  for (let W = 0; W < D; W++) {
    if (!J.pid || J.killed || !I.pid || I.killed) throw Error("Linux bridge process died unexpectedly");
    try {
      if (FC.existsSync(G) && FC.existsSync(Z)) {
        DB(`Linux bridges ready after ${W+1} attempts`);
        break
      }
    } catch (K) {
      DB(`Error checking sockets (attempt ${W+1}): ${K}`, {
        level: "error"
      })
    }
    if (W === D - 1) {
      if (J.pid) try {
        process.kill(J.pid, "SIGTERM")
      } catch {}
      if (I.pid) try {
        process.kill(I.pid, "SIGTERM")
      } catch {}
      throw Error(`Failed to create bridge sockets after ${D} attempts`)
    }
    await new Promise((K) => setTimeout(K, W * 100))
  }
  return {
    httpSocketPath: G,
    socksSocketPath: Z,
    httpBridgeProcess: J,
    socksBridgeProcess: I,
    httpProxyPort: A,
    socksProxyPort: Q
  }
}
// @from(Ln 143667, Col 0)
function $58(A, Q, B, G, Z) {
  let Y = Z || "bash",
    J = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${Q} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
  if (G) {
    let X = _01();
    if (!X) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
    let I = QBA.default.quote([X, G, Y, "-c", B]),
      D = [...J, I].join(`
`);
    return `${Y} -c ${QBA.default.quote([D])}`
  } else {
    let X = [...J, `eval ${QBA.default.quote([B])}`].join(`
`);
    return `${Y} -c ${QBA.default.quote([X])}`
  }
}
// @from(Ln 143683, Col 0)
async function C58(A, Q, B = {
  command: "rg"
}, G = zr1, Z = !1, Y) {
  let J = [];
  if (Q) {
    J.push("--ro-bind", "/", "/");
    let I = [];
    for (let W of Q.allowOnly || []) {
      let K = KP(W);
      if (DB(`[Sandbox Linux] Processing write path: ${W} -> ${K}`), K.startsWith("/dev/")) {
        DB(`[Sandbox Linux] Skipping /dev path: ${K}`);
        continue
      }
      if (!FC.existsSync(K)) {
        DB(`[Sandbox Linux] Skipping non-existent write path: ${K}`);
        continue
      }
      J.push("--bind", K, K), I.push(K)
    }
    let D = [...Q.denyWithinAllow || [], ...await E58(B, G, Z, Y)];
    for (let W of D) {
      let K = KP(W);
      if (K.startsWith("/dev/")) continue;
      let V = F58(K, I);
      if (V) {
        J.push("--ro-bind", "/dev/null", V), DB(`[Sandbox Linux] Mounted /dev/null at symlink ${V} to prevent symlink replacement attack`);
        continue
      }
      if (!FC.existsSync(K)) {
        let H = Mz.dirname(K);
        while (H !== "/" && !FC.existsSync(H)) H = Mz.dirname(H);
        if (I.some((z) => H.startsWith(z + "/") || H === z || K.startsWith(z + "/"))) {
          let z = H58(K);
          J.push("--ro-bind", "/dev/null", z), DB(`[Sandbox Linux] Mounted /dev/null at ${z} to block creation of ${K}`)
        } else DB(`[Sandbox Linux] Skipping non-existent deny path not within allowed paths: ${K}`);
        continue
      }
      if (I.some((H) => K.startsWith(H + "/") || K === H)) J.push("--ro-bind", K, K);
      else DB(`[Sandbox Linux] Skipping deny path not within allowed paths: ${K}`)
    }
  } else J.push("--bind", "/", "/");
  let X = [...A?.denyOnly || []];
  if (FC.existsSync("/etc/ssh/ssh_config.d")) X.push("/etc/ssh/ssh_config.d");
  for (let I of X) {
    let D = KP(I);
    if (!FC.existsSync(D)) {
      DB(`[Sandbox Linux] Skipping non-existent read deny path: ${D}`);
      continue
    }
    if (FC.statSync(D).isDirectory()) J.push("--tmpfs", D);
    else J.push("--ro-bind", "/dev/null", D)
  }
  return J
}
// @from(Ln 143737, Col 0)
async function IHB(A) {
  let {
    command: Q,
    needsNetworkRestriction: B,
    httpSocketPath: G,
    socksSocketPath: Z,
    httpProxyPort: Y,
    socksProxyPort: J,
    readConfig: X,
    writeConfig: I,
    enableWeakerNestedSandbox: D,
    allowAllUnixSockets: W,
    binShell: K,
    ripgrepConfig: V = {
      command: "rg"
    },
    mandatoryDenySearchDepth: F = zr1,
    allowGitConfig: H = !1,
    abortSignal: E
  } = A, z = X && X.denyOnly.length > 0, $ = I !== void 0;
  if (!B && !z && !$) return Q;
  let O = ["--new-session", "--die-with-parent"],
    L = void 0;
  try {
    if (!W)
      if (L = AHB() ?? void 0, !L) DB("[Sandbox Linux] Seccomp filter not available (missing binaries). Continuing without Unix socket blocking - sandbox will still provide filesystem and network isolation but Unix sockets will be allowed.", {
        level: "warn"
      });
      else {
        if (!L.includes("/vendor/seccomp/")) Er1.add(L), z58();
        DB("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking")
      }
    else if (W) DB("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    if (B) {
      if (O.push("--unshare-net"), G && Z) {
        if (!FC.existsSync(G)) throw Error(`Linux HTTP bridge socket does not exist: ${G}. The bridge process may have died. Try reinitializing the sandbox.`);
        if (!FC.existsSync(Z)) throw Error(`Linux SOCKS bridge socket does not exist: ${Z}. The bridge process may have died. Try reinitializing the sandbox.`);
        O.push("--bind", G, G), O.push("--bind", Z, Z);
        let u = M01(3128, 1080);
        if (O.push(...u.flatMap((f) => {
            let AA = f.indexOf("="),
              n = f.slice(0, AA),
              y = f.slice(AA + 1);
            return ["--setenv", n, y]
          })), Y !== void 0) O.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(Y));
        if (J !== void 0) O.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(J))
      }
    }
    let M = await C58(X, I, V, F, H, E);
    if (O.push(...M), O.push("--dev", "/dev"), O.push("--unshare-pid"), !D) O.push("--proc", "/proc");
    let _ = K || "bash",
      j = Hr1("which", [_], {
        encoding: "utf8"
      });
    if (j.status !== 0) throw Error(`Shell '${_}' not found in PATH`);
    let x = j.stdout.trim();
    if (O.push("--", x, "-c"), B && G && Z) {
      let u = $58(G, Z, Q, L, x);
      O.push(u)
    } else if (L) {
      let u = _01();
      if (!u) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
      let f = QBA.default.quote([u, L, x, "-c", Q]);
      O.push(f)
    } else O.push(Q);
    let b = QBA.default.quote(["bwrap", ...O]),
      S = [];
    if (B) S.push("network");
    if (z || $) S.push("filesystem");
    if (L) S.push("seccomp(unix-block)");
    return DB(`[Sandbox Linux] Wrapped command with bwrap (${S.join(", ")} restrictions)`), b
  } catch (M) {
    if (L && !L.includes("/vendor/seccomp/")) {
      Er1.delete(L);
      try {
        Fr1(L)
      } catch (_) {
        DB(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${_}`, {
          level: "error"
        })
      }
    }
    throw M
  }
}
// @from(Ln 143822, Col 4)
QBA
// @from(Ln 143822, Col 9)
zr1 = 3
// @from(Ln 143823, Col 2)
Er1
// @from(Ln 143823, Col 7)
YHB = !1
// @from(Ln 143824, Col 4)
DHB = w(() => {
  Xr1();
  hXA();
  QHB();
  QBA = c(TlA(), 1);
  Er1 = new Set
})
// @from(Ln 143837, Col 0)
function N58(A = !1) {
  let Q = process.cwd(),
    B = [];
  for (let G of pMA) B.push(mu.resolve(Q, G)), B.push(`**/${G}`);
  for (let G of O01()) B.push(mu.resolve(Q, G)), B.push(`**/${G}/**`);
  if (B.push(mu.resolve(Q, ".git/hooks")), B.push("**/.git/hooks/**"), !A) B.push(mu.resolve(Q, ".git/config")), B.push("**/.git/config");
  return [...new Set(B)]
}
// @from(Ln 143846, Col 0)
function j01(A) {
  return "^" + A.replace(/[.^$+{}()|\\]/g, "\\$&").replace(/\[([^\]]*?)$/g, "\\[$1").replace(/\*\*\//g, "__GLOBSTAR_SLASH__").replace(/\*\*/g, "__GLOBSTAR__").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]").replace(/__GLOBSTAR_SLASH__/g, "(.*/)?").replace(/__GLOBSTAR__/g, ".*") + "$"
}
// @from(Ln 143850, Col 0)
function w58(A) {
  return `CMD64_${R01(A)}_END_${VHB}`
}
// @from(Ln 143854, Col 0)
function WHB(A) {
  let Q = [],
    B = mu.dirname(A);
  while (B !== "/" && B !== ".") {
    Q.push(B);
    let G = mu.dirname(B);
    if (G === B) break;
    B = G
  }
  return Q
}
// @from(Ln 143866, Col 0)
function FHB(A, Q) {
  let B = [];
  for (let G of A) {
    let Z = KP(G);
    if (WP(Z)) {
      let Y = j01(Z);
      B.push("(deny file-write-unlink", `  (regex ${kL(Y)})`, `  (with message "${Q}"))`);
      let J = Z.split(/[*?[\]]/)[0];
      if (J && J !== "/") {
        let X = J.endsWith("/") ? J.slice(0, -1) : mu.dirname(J);
        B.push("(deny file-write-unlink", `  (literal ${kL(X)})`, `  (with message "${Q}"))`);
        for (let I of WHB(X)) B.push("(deny file-write-unlink", `  (literal ${kL(I)})`, `  (with message "${Q}"))`)
      }
    } else {
      B.push("(deny file-write-unlink", `  (subpath ${kL(Z)})`, `  (with message "${Q}"))`);
      for (let Y of WHB(Z)) B.push("(deny file-write-unlink", `  (literal ${kL(Y)})`, `  (with message "${Q}"))`)
    }
  }
  return B
}
// @from(Ln 143887, Col 0)
function L58(A, Q) {
  if (!A) return ["(allow file-read*)"];
  let B = [];
  B.push("(allow file-read*)");
  for (let G of A.denyOnly || []) {
    let Z = KP(G);
    if (WP(Z)) {
      let Y = j01(Z);
      B.push("(deny file-read*", `  (regex ${kL(Y)})`, `  (with message "${Q}"))`)
    } else B.push("(deny file-read*", `  (subpath ${kL(Z)})`, `  (with message "${Q}"))`)
  }
  return B.push(...FHB(A.denyOnly || [], Q)), B
}
// @from(Ln 143901, Col 0)
function O58(A, Q, B = !1) {
  if (!A) return ["(allow file-write*)"];
  let G = [],
    Z = R58();
  for (let J of Z) {
    let X = KP(J);
    G.push("(allow file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  for (let J of A.allowOnly || []) {
    let X = KP(J);
    if (WP(X)) {
      let I = j01(X);
      G.push("(allow file-write*", `  (regex ${kL(I)})`, `  (with message "${Q}"))`)
    } else G.push("(allow file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  let Y = [...A.denyWithinAllow || [], ...N58(B)];
  for (let J of Y) {
    let X = KP(J);
    if (WP(X)) {
      let I = j01(X);
      G.push("(deny file-write*", `  (regex ${kL(I)})`, `  (with message "${Q}"))`)
    } else G.push("(deny file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  return G.push(...FHB(Y, Q)), G
}
// @from(Ln 143927, Col 0)
function M58({
  readConfig: A,
  writeConfig: Q,
  httpProxyPort: B,
  socksProxyPort: G,
  needsNetworkRestriction: Z,
  allowUnixSockets: Y,
  allowAllUnixSockets: J,
  allowLocalBinding: X,
  allowPty: I,
  allowGitConfig: D = !1,
  logTag: W
}) {
  let K = ["(version 1)", `(deny default (with message "${W}"))`, "", `; LogTag: ${W}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.trustd.agent")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', '  (sysctl-name "hw.busfrequency_compat")', '  (sysctl-name "hw.byteorder")', '  (sysctl-name "hw.cacheconfig")', '  (sysctl-name "hw.cachelinesize_compat")', '  (sysctl-name "hw.cpufamily")', '  (sysctl-name "hw.cpufrequency")', '  (sysctl-name "hw.cpufrequency_compat")', '  (sysctl-name "hw.cputype")', '  (sysctl-name "hw.l1dcachesize_compat")', '  (sysctl-name "hw.l1icachesize_compat")', '  (sysctl-name "hw.l2cachesize_compat")', '  (sysctl-name "hw.l3cachesize_compat")', '  (sysctl-name "hw.logicalcpu")', '  (sysctl-name "hw.logicalcpu_max")', '  (sysctl-name "hw.machine")', '  (sysctl-name "hw.memsize")', '  (sysctl-name "hw.ncpu")', '  (sysctl-name "hw.nperflevels")', '  (sysctl-name "hw.packages")', '  (sysctl-name "hw.pagesize_compat")', '  (sysctl-name "hw.pagesize")', '  (sysctl-name "hw.physicalcpu")', '  (sysctl-name "hw.physicalcpu_max")', '  (sysctl-name "hw.tbfrequency_compat")', '  (sysctl-name "hw.vectorunit")', '  (sysctl-name "kern.argmax")', '  (sysctl-name "kern.bootargs")', '  (sysctl-name "kern.hostname")', '  (sysctl-name "kern.maxfiles")', '  (sysctl-name "kern.maxfilesperproc")', '  (sysctl-name "kern.maxproc")', '  (sysctl-name "kern.ngroups")', '  (sysctl-name "kern.osproductversion")', '  (sysctl-name "kern.osrelease")', '  (sysctl-name "kern.ostype")', '  (sysctl-name "kern.osvariant_status")', '  (sysctl-name "kern.osversion")', '  (sysctl-name "kern.secure_kernel")', '  (sysctl-name "kern.tcsm_available")', '  (sysctl-name "kern.tcsm_enable")', '  (sysctl-name "kern.usrstack64")', '  (sysctl-name "kern.version")', '  (sysctl-name "kern.willshutdown")', '  (sysctl-name "machdep.cpu.brand_string")', '  (sysctl-name "machdep.ptrauth_enabled")', '  (sysctl-name "security.mac.lockdown_mode_state")', '  (sysctl-name "sysctl.proc_cputype")', '  (sysctl-name "vm.loadavg")', '  (sysctl-name-prefix "hw.optional.arm")', '  (sysctl-name-prefix "hw.optional.arm.")', '  (sysctl-name-prefix "hw.optional.armv8_")', '  (sysctl-name-prefix "hw.perflevel")', '  (sysctl-name-prefix "kern.proc.all")', '  (sysctl-name-prefix "kern.proc.pgrp.")', '  (sysctl-name-prefix "kern.proc.pid.")', '  (sysctl-name-prefix "machdep.cpu.")', '  (sysctl-name-prefix "net.routetable.")', ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
  if (K.push("; Network"), !Z) K.push("(allow network*)");
  else {
    if (X) K.push('(allow network-bind (local ip "localhost:*"))'), K.push('(allow network-inbound (local ip "localhost:*"))'), K.push('(allow network-outbound (local ip "localhost:*"))');
    if (J) K.push('(allow network* (subpath "/"))');
    else if (Y && Y.length > 0)
      for (let V of Y) {
        let F = KP(V);
        K.push(`(allow network* (subpath ${kL(F)}))`)
      }
    if (B !== void 0) K.push(`(allow network-bind (local ip "localhost:${B}"))`), K.push(`(allow network-inbound (local ip "localhost:${B}"))`), K.push(`(allow network-outbound (remote ip "localhost:${B}"))`);
    if (G !== void 0) K.push(`(allow network-bind (local ip "localhost:${G}"))`), K.push(`(allow network-inbound (local ip "localhost:${G}"))`), K.push(`(allow network-outbound (remote ip "localhost:${G}"))`)
  }
  if (K.push(""), K.push("; File read"), K.push(...L58(A, W)), K.push(""), K.push("; File write"), K.push(...O58(Q, W, D)), I) K.push(""), K.push("; Pseudo-terminal (pty) support"), K.push("(allow pseudo-tty)"), K.push("(allow file-ioctl"), K.push('  (literal "/dev/ptmx")'), K.push('  (regex #"^/dev/ttys")'), K.push(")"), K.push("(allow file-read* file-write*"), K.push('  (literal "/dev/ptmx")'), K.push('  (regex #"^/dev/ttys")'), K.push(")");
  return K.join(`
`)
}
// @from(Ln 143958, Col 0)
function kL(A) {
  return JSON.stringify(A)
}
// @from(Ln 143962, Col 0)
function R58() {
  let A = process.env.TMPDIR;
  if (!A) return [];
  if (!A.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
  let B = A.replace(/\/T\/?$/, "");
  if (B.startsWith("/private/var/")) return [B, B.replace("/private", "")];
  else if (B.startsWith("/var/")) return [B, "/private" + B];
  return [B]
}
// @from(Ln 143972, Col 0)
function HHB(A) {
  let {
    command: Q,
    needsNetworkRestriction: B,
    httpProxyPort: G,
    socksProxyPort: Z,
    allowUnixSockets: Y,
    allowAllUnixSockets: J,
    allowLocalBinding: X,
    readConfig: I,
    writeConfig: D,
    allowPty: W,
    allowGitConfig: K = !1,
    binShell: V
  } = A, F = I && I.denyOnly.length > 0;
  if (!B && !F && D === void 0) return Q;
  let E = w58(Q),
    z = M58({
      readConfig: I,
      writeConfig: D,
      httpProxyPort: G,
      socksProxyPort: Z,
      needsNetworkRestriction: B,
      allowUnixSockets: Y,
      allowAllUnixSockets: J,
      allowLocalBinding: X,
      allowPty: W,
      allowGitConfig: K,
      logTag: E
    }),
    $ = M01(G, Z),
    O = V || "bash",
    L = q58("which", [O], {
      encoding: "utf8"
    });
  if (L.status !== 0) throw Error(`Shell '${O}' not found in PATH`);
  let M = L.stdout.trim(),
    _ = KHB.default.quote(["env", ...$, "sandbox-exec", "-p", z, M, "-c", Q]);
  return DB(`[Sandbox macOS] Applied restrictions - network: ${!!(G||Z)}, read: ${I?"allowAllExcept"in I?"allowAllExcept":"denyAllExcept":"none"}, write: ${D?"allowAllExcept"in D?"allowAllExcept":"denyAllExcept":"none"}`), _
}
// @from(Ln 144013, Col 0)
function EHB(A, Q) {
  let B = /CMD64_(.+?)_END/,
    G = /Sandbox:\s+(.+)$/,
    Z = Q?.["*"] || [],
    Y = Q ? Object.entries(Q).filter(([X]) => X !== "*") : [],
    J = U58("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${VHB}")`, "--style", "compact"]);
  return J.stdout?.on("data", (X) => {
    let I = X.toString().split(`
`),
      D = I.find((E) => E.includes("Sandbox:") && E.includes("deny")),
      W = I.find((E) => E.startsWith("CMD64_"));
    if (!D) return;
    let K = D.match(G);
    if (!K?.[1]) return;
    let V = K[1],
      F, H;
    if (W) {
      if (H = W.match(B)?.[1], H) try {
        F = rFB(H)
      } catch {}
    }
    if (V.includes("mDNSResponder") || V.includes("mach-lookup com.apple.diagnosticd") || V.includes("mach-lookup com.apple.analyticsd")) return;
    if (Q && F) {
      if (Z.length > 0) {
        if (Z.some((z) => V.includes(z))) return
      }
      for (let [E, z] of Y)
        if (F.includes(E)) {
          if (z.some((O) => V.includes(O))) return
        }
    }
    A({
      line: V,
      command: F,
      encodedCommand: H,
      timestamp: new Date
    })
  }), J.stderr?.on("data", (X) => {
    DB(`[Sandbox Monitor] Log stream stderr: ${X.toString()}`)
  }), J.on("error", (X) => {
    DB(`[Sandbox Monitor] Failed to start log stream: ${X.message}`)
  }), J.on("exit", (X) => {
    DB(`[Sandbox Monitor] Log stream exited with code: ${X}`)
  }), () => {
    DB("[Sandbox Monitor] Stopping log monitor"), J.kill("SIGTERM")
  }
}
// @from(Ln 144060, Col 4)
KHB
// @from(Ln 144060, Col 9)
VHB
// @from(Ln 144061, Col 4)
zHB = w(() => {
  hXA();
  KHB = c(TlA(), 1);
  VHB = `_${Math.random().toString(36).slice(2,11)}_SBX`
})
// @from(Ln 144066, Col 0)
class nMA {
  constructor() {
    this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
  }
  addViolation(A) {
    if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
    this.notifyListeners()
  }
  getViolations(A) {
    if (A === void 0) return [...this.violations];
    return this.violations.slice(-A)
  }
  getCount() {
    return this.violations.length
  }
  getTotalCount() {
    return this.totalCount
  }
  getViolationsForCommand(A) {
    let Q = R01(A);
    return this.violations.filter((B) => B.encodedCommand === Q)
  }
  clear() {
    this.violations = [], this.notifyListeners()
  }
  subscribe(A) {
    return this.listeners.add(A), A(this.getViolations()), () => {
      this.listeners.delete(A)
    }
  }
  notifyListeners() {
    let A = this.getViolations();
    this.listeners.forEach((Q) => Q(A))
  }
}
// @from(Ln 144101, Col 4)
$r1 = w(() => {
  hXA()
})
// @from(Ln 144109, Col 0)
function _58() {
  if ($HB) return;
  let A = () => qr1().catch((Q) => {
    DB(`Cleanup failed in registerCleanup ${Q}`, {
      level: "error"
    })
  });
  process.once("exit", A), process.once("SIGINT", A), process.once("SIGTERM", A), $HB = !0
}
// @from(Ln 144119, Col 0)
function CHB(A, Q) {
  if (Q.startsWith("*.")) {
    let B = Q.substring(2);
    return A.toLowerCase().endsWith("." + B.toLowerCase())
  }
  return A.toLowerCase() === Q.toLowerCase()
}
// @from(Ln 144126, Col 0)
async function NHB(A, Q, B) {
  if (!k3) return DB("No config available, denying network request"), !1;
  for (let G of k3.network.deniedDomains)
    if (CHB(Q, G)) return DB(`Denied by config rule: ${Q}:${A}`), !1;
  for (let G of k3.network.allowedDomains)
    if (CHB(Q, G)) return DB(`Allowed by config rule: ${Q}:${A}`), !0;
  if (!B) return DB(`No matching config rule, denying: ${Q}:${A}`), !1;
  DB(`No matching config rule, asking user: ${Q}:${A}`);
  try {
    if (await B({
        host: Q,
        port: A
      })) return DB(`User allowed: ${Q}:${A}`), !0;
    else return DB(`User denied: ${Q}:${A}`), !1
  } catch (G) {
    return DB(`Error in permission callback: ${G}`, {
      level: "error"
    }), !1
  }
}
// @from(Ln 144146, Col 0)
async function j58(A) {
  return gXA = kFB({
    filter: (Q, B) => NHB(Q, B, A)
  }), new Promise((Q, B) => {
    if (!gXA) {
      B(Error("HTTP proxy server undefined before listen"));
      return
    }
    let G = gXA;
    G.once("error", B), G.once("listening", () => {
      let Z = G.address();
      if (Z && typeof Z === "object") G.unref(), DB(`HTTP proxy listening on localhost:${Z.port}`), Q(Z.port);
      else B(Error("Failed to get proxy server address"))
    }), G.listen(0, "127.0.0.1")
  })
}
// @from(Ln 144162, Col 0)
async function T58(A) {
  return BBA = lFB({
    filter: (Q, B) => NHB(Q, B, A)
  }), new Promise((Q, B) => {
    if (!BBA) {
      B(Error("SOCKS proxy server undefined before listen"));
      return
    }
    BBA.listen(0, "127.0.0.1").then((G) => {
      BBA?.unref(), Q(G)
    }).catch(B)
  })
}
// @from(Ln 144175, Col 0)
async function P58(A, Q, B = !1) {
  if (Va) {
    await Va;
    return
  }
  if (k3 = A, !LHB()) {
    let G = dR(),
      Z = "Sandbox dependencies are not available on this system.";
    if (G === "linux") Z += " Required: ripgrep (rg), bubblewrap (bwrap), and socat.";
    else if (G === "macos") Z += " Required: ripgrep (rg).";
    else Z += ` Platform '${G}' is not supported.`;
    throw Error(Z)
  }
  if (B && dR() === "macos") T01 = EHB(P01.addViolation.bind(P01), k3.ignoreViolations), DB("Started macOS sandbox log monitor");
  _58(), Va = (async () => {
    try {
      let G;
      if (k3.network.httpProxyPort !== void 0) G = k3.network.httpProxyPort, DB(`Using external HTTP proxy on port ${G}`);
      else G = await j58(Q);
      let Z;
      if (k3.network.socksProxyPort !== void 0) Z = k3.network.socksProxyPort, DB(`Using external SOCKS proxy on port ${Z}`);
      else Z = await T58(Q);
      let Y;
      if (dR() === "linux") Y = await XHB(G, Z);
      let J = {
        httpProxyPort: G,
        socksProxyPort: Z,
        linuxBridge: Y
      };
      return cR = J, DB("Network infrastructure initialized"), J
    } catch (G) {
      throw Va = void 0, cR = void 0, qr1().catch((Z) => {
        DB(`Cleanup failed in initializationPromise ${Z}`, {
          level: "error"
        })
      }), G
    }
  })(), await Va
}
// @from(Ln 144215, Col 0)
function wHB(A) {
  return ["macos", "linux"].includes(A)
}
// @from(Ln 144219, Col 0)
function S58() {
  return k3 !== void 0
}
// @from(Ln 144223, Col 0)
function LHB(A) {
  let Q = dR();
  if (!wHB(Q)) return !1;
  if ((A ?? k3?.ripgrep)?.command === void 0) {
    if (!nFB()) return !1
  }
  if (Q === "linux") {
    let Z = k3?.network?.allowAllUnixSockets ?? !1;
    return JHB(Z)
  }
  return !0
}
// @from(Ln 144236, Col 0)
function x58() {
  if (!k3) return {
    denyOnly: []
  };
  return {
    denyOnly: k3.filesystem.denyRead.map((Q) => lMA(Q)).filter((Q) => {
      if (dR() === "linux" && WP(Q)) return DB(`Skipping glob pattern on Linux: ${Q}`), !1;
      return !0
    })
  }
}
// @from(Ln 144248, Col 0)
function y58() {
  if (!k3) return {
    allowOnly: iMA(),
    denyWithinAllow: []
  };
  let A = k3.filesystem.allowWrite.map((G) => lMA(G)).filter((G) => {
      if (dR() === "linux" && WP(G)) return DB(`Skipping glob pattern on Linux: ${G}`), !1;
      return !0
    }),
    Q = k3.filesystem.denyWrite.map((G) => lMA(G)).filter((G) => {
      if (dR() === "linux" && WP(G)) return DB(`Skipping glob pattern on Linux: ${G}`), !1;
      return !0
    });
  return {
    allowOnly: [...iMA(), ...A],
    denyWithinAllow: Q
  }
}
// @from(Ln 144267, Col 0)
function v58() {
  if (!k3) return {};
  let A = k3.network.allowedDomains,
    Q = k3.network.deniedDomains;
  return {
    ...A.length > 0 && {
      allowedHosts: A
    },
    ...Q.length > 0 && {
      deniedHosts: Q
    }
  }
}
// @from(Ln 144281, Col 0)
function OHB() {
  return k3?.network?.allowUnixSockets
}
// @from(Ln 144285, Col 0)
function UHB() {
  return k3?.network?.allowAllUnixSockets
}
// @from(Ln 144289, Col 0)
function MHB() {
  return k3?.network?.allowLocalBinding
}
// @from(Ln 144293, Col 0)
function RHB() {
  return k3?.ignoreViolations
}
// @from(Ln 144297, Col 0)
function _HB() {
  return k3?.enableWeakerNestedSandbox
}
// @from(Ln 144301, Col 0)
function k58() {
  return k3?.ripgrep ?? {
    command: "rg"
  }
}
// @from(Ln 144307, Col 0)
function b58() {
  return k3?.mandatoryDenySearchDepth ?? 3
}
// @from(Ln 144311, Col 0)
function qHB() {
  return k3?.filesystem?.allowGitConfig ?? !1
}
// @from(Ln 144315, Col 0)
function jHB() {
  return cR?.httpProxyPort
}
// @from(Ln 144319, Col 0)
function THB() {
  return cR?.socksProxyPort
}
// @from(Ln 144323, Col 0)
function PHB() {
  return cR?.linuxBridge?.httpSocketPath
}
// @from(Ln 144327, Col 0)
function SHB() {
  return cR?.linuxBridge?.socksSocketPath
}
// @from(Ln 144330, Col 0)
async function xHB() {
  if (!k3) return !1;
  if (Va) try {
    return await Va, !0
  } catch {
    return !1
  }
  return cR !== void 0
}
// @from(Ln 144339, Col 0)
async function f58(A, Q, B, G) {
  let Z = dR(),
    Y = B?.filesystem?.allowWrite ?? k3?.filesystem.allowWrite ?? [],
    J = {
      allowOnly: [...iMA(), ...Y],
      denyWithinAllow: B?.filesystem?.denyWrite ?? k3?.filesystem.denyWrite ?? []
    },
    X = {
      denyOnly: B?.filesystem?.denyRead ?? k3?.filesystem.denyRead ?? []
    },
    I = B?.network?.allowedDomains !== void 0 || k3?.network?.allowedDomains !== void 0,
    D = B?.network?.allowedDomains ?? k3?.network.allowedDomains ?? [],
    W = I,
    K = D.length > 0;
  if (K) await xHB();
  let V = B?.allowPty ?? k3?.allowPty;
  switch (Z) {
    case "macos":
      return HHB({
        command: A,
        needsNetworkRestriction: W,
        httpProxyPort: K ? jHB() : void 0,
        socksProxyPort: K ? THB() : void 0,
        readConfig: X,
        writeConfig: J,
        allowUnixSockets: OHB(),
        allowAllUnixSockets: UHB(),
        allowLocalBinding: MHB(),
        ignoreViolations: RHB(),
        allowPty: V,
        allowGitConfig: qHB(),
        binShell: Q
      });
    case "linux":
      return IHB({
        command: A,
        needsNetworkRestriction: W,
        httpSocketPath: K ? PHB() : void 0,
        socksSocketPath: K ? SHB() : void 0,
        httpProxyPort: K ? cR?.httpProxyPort : void 0,
        socksProxyPort: K ? cR?.socksProxyPort : void 0,
        readConfig: X,
        writeConfig: J,
        enableWeakerNestedSandbox: _HB(),
        allowAllUnixSockets: UHB(),
        binShell: Q,
        ripgrepConfig: k58(),
        mandatoryDenySearchDepth: b58(),
        allowGitConfig: qHB(),
        abortSignal: G
      });
    default:
      throw Error(`Sandbox configuration is not supported on platform: ${Z}`)
  }
}
// @from(Ln 144395, Col 0)
function h58() {
  return k3
}
// @from(Ln 144399, Col 0)
function g58(A) {
  k3 = gCA(A), DB("Sandbox configuration updated")
}
// @from(Ln 144402, Col 0)
async function qr1() {
  if (T01) T01(), T01 = void 0;
  if (cR?.linuxBridge) {
    let {
      httpSocketPath: Q,
      socksSocketPath: B,
      httpBridgeProcess: G,
      socksBridgeProcess: Z
    } = cR.linuxBridge, Y = [];
    if (G.pid && !G.killed) try {
      process.kill(G.pid, "SIGTERM"), DB("Sent SIGTERM to HTTP bridge process"), Y.push(new Promise((J) => {
        G.once("exit", () => {
          DB("HTTP bridge process exited"), J()
        }), setTimeout(() => {
          if (!G.killed) {
            DB("HTTP bridge did not exit, forcing SIGKILL", {
              level: "warn"
            });
            try {
              if (G.pid) process.kill(G.pid, "SIGKILL")
            } catch {}
          }
          J()
        }, 5000)
      }))
    } catch (J) {
      if (J.code !== "ESRCH") DB(`Error killing HTTP bridge: ${J}`, {
        level: "error"
      })
    }
    if (Z.pid && !Z.killed) try {
      process.kill(Z.pid, "SIGTERM"), DB("Sent SIGTERM to SOCKS bridge process"), Y.push(new Promise((J) => {
        Z.once("exit", () => {
          DB("SOCKS bridge process exited"), J()
        }), setTimeout(() => {
          if (!Z.killed) {
            DB("SOCKS bridge did not exit, forcing SIGKILL", {
              level: "warn"
            });
            try {
              if (Z.pid) process.kill(Z.pid, "SIGKILL")
            } catch {}
          }
          J()
        }, 5000)
      }))
    } catch (J) {
      if (J.code !== "ESRCH") DB(`Error killing SOCKS bridge: ${J}`, {
        level: "error"
      })
    }
    if (await Promise.all(Y), Q) try {
      Ur1.rmSync(Q, {
        force: !0
      }), DB("Cleaned up HTTP socket")
    } catch (J) {
      DB(`HTTP socket cleanup error: ${J}`, {
        level: "error"
      })
    }
    if (B) try {
      Ur1.rmSync(B, {
        force: !0
      }), DB("Cleaned up SOCKS socket")
    } catch (J) {
      DB(`SOCKS socket cleanup error: ${J}`, {
        level: "error"
      })
    }
  }
  let A = [];
  if (gXA) {
    let Q = gXA,
      B = new Promise((G) => {
        Q.close((Z) => {
          if (Z && Z.message !== "Server is not running.") DB(`Error closing HTTP proxy server: ${Z.message}`, {
            level: "error"
          });
          G()
        })
      });
    A.push(B)
  }
  if (BBA) {
    let Q = BBA.close().catch((B) => {
      DB(`Error closing SOCKS proxy server: ${B.message}`, {
        level: "error"
      })
    });
    A.push(Q)
  }
  await Promise.all(A), gXA = void 0, BBA = void 0, cR = void 0, Va = void 0
}
// @from(Ln 144496, Col 0)
function u58() {
  return P01
}
// @from(Ln 144500, Col 0)
function m58(A, Q) {
  if (!k3) return Q;
  let B = P01.getViolationsForCommand(A);
  if (B.length === 0) return Q;
  let G = Q;
  G += Cr1 + "<sandbox_violations>" + Cr1;
  for (let Z of B) G += Z.line + Cr1;
  return G += "</sandbox_violations>", G
}
// @from(Ln 144510, Col 0)
function d58() {
  if (dR() !== "linux" || !k3) return [];
  let A = [],
    Q = [...k3.filesystem.denyRead, ...k3.filesystem.allowWrite, ...k3.filesystem.denyWrite];
  for (let B of Q) {
    let G = lMA(B);
    if (WP(G)) A.push(B)
  }
  return A
}
// @from(Ln 144520, Col 4)
k3
// @from(Ln 144520, Col 8)
gXA
// @from(Ln 144520, Col 13)
BBA
// @from(Ln 144520, Col 18)
cR
// @from(Ln 144520, Col 22)
Va
// @from(Ln 144520, Col 26)
$HB = !1
// @from(Ln 144521, Col 2)
T01
// @from(Ln 144521, Col 7)
P01
// @from(Ln 144521, Col 12)
$X
// @from(Ln 144522, Col 4)
yHB = w(() => {
  bFB();
  iFB();
  zUA();
  DHB();
  zHB();
  hXA();
  Xr1();
  $r1();
  P01 = new nMA;
  $X = {
    initialize: P58,
    isSupportedPlatform: wHB,
    isSandboxingEnabled: S58,
    checkDependencies: LHB,
    getFsReadConfig: x58,
    getFsWriteConfig: y58,
    getNetworkRestrictionConfig: v58,
    getAllowUnixSockets: OHB,
    getAllowLocalBinding: MHB,
    getIgnoreViolations: RHB,
    getEnableWeakerNestedSandbox: _HB,
    getProxyPort: jHB,
    getSocksProxyPort: THB,
    getLinuxHttpSocketPath: PHB,
    getLinuxSocksSocketPath: SHB,
    waitForNetworkInitialization: xHB,
    wrapWithSandbox: f58,
    reset: qr1,
    getSandboxViolationStore: u58,
    annotateStderrWithSandboxFailures: m58,
    getLinuxGlobPatternWarnings: d58,
    getConfig: h58,
    updateConfig: g58
  }
})
// @from(Ln 144558, Col 4)
G5
// @from(Ln 144558, Col 8)
Nr1
// @from(Ln 144558, Col 13)
fB