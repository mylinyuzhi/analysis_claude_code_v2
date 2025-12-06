
// @from(Start 9546223, End 9546470)
function DJ5(A, Q) {
  if (A.indexOf(Q[1]) === -1) return -1;
  let B = 0;
  for (let G = 0; G < A.length; G++)
    if (A[G] === "\\") G++;
    else if (A[G] === Q[0]) B++;
  else if (A[G] === Q[1]) {
    if (B--, B < 0) return G
  }
  return -1
}
// @from(Start 9546472, End 9546914)
function m32(A, Q, B, G, Z) {
  let I = Q.href,
    Y = Q.title || null,
    J = A[1].replace(Z.other.outputLinkReplace, "$1");
  if (A[0].charAt(0) !== "!") {
    G.state.inLink = !0;
    let W = {
      type: "link",
      raw: B,
      href: I,
      title: Y,
      text: J,
      tokens: G.inlineTokens(J)
    };
    return G.state.inLink = !1, W
  }
  return {
    type: "image",
    raw: B,
    href: I,
    title: Y,
    text: J
  }
}
// @from(Start 9546916, End 9547247)
function HJ5(A, Q, B) {
  let G = A.match(B.other.indentCodeCompensation);
  if (G === null) return Q;
  let Z = G[1];
  return Q.split(`
`).map((I) => {
    let Y = I.match(B.other.beginningSpace);
    if (Y === null) return I;
    let [J] = Y;
    if (J.length >= Z.length) return I.slice(Z.length);
    return I
  }).join(`
`)
}
// @from(Start 9547248, End 9562337)
class VMA {
  options;
  rules;
  lexer;
  constructor(A) {
    this.options = A || C1A
  }
  space(A) {
    let Q = this.rules.block.newline.exec(A);
    if (Q && Q[0].length > 0) return {
      type: "space",
      raw: Q[0]
    }
  }
  code(A) {
    let Q = this.rules.block.code.exec(A);
    if (Q) {
      let B = Q[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: Q[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? JMA(B, `
`) : B
      }
    }
  }
  fences(A) {
    let Q = this.rules.block.fences.exec(A);
    if (Q) {
      let B = Q[0],
        G = HJ5(B, Q[3] || "", this.rules);
      return {
        type: "code",
        raw: B,
        lang: Q[2] ? Q[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : Q[2],
        text: G
      }
    }
  }
  heading(A) {
    let Q = this.rules.block.heading.exec(A);
    if (Q) {
      let B = Q[2].trim();
      if (this.rules.other.endingHash.test(B)) {
        let G = JMA(B, "#");
        if (this.options.pedantic) B = G.trim();
        else if (!G || this.rules.other.endingSpaceChar.test(G)) B = G.trim()
      }
      return {
        type: "heading",
        raw: Q[0],
        depth: Q[1].length,
        text: B,
        tokens: this.lexer.inline(B)
      }
    }
  }
  hr(A) {
    let Q = this.rules.block.hr.exec(A);
    if (Q) return {
      type: "hr",
      raw: JMA(Q[0], `
`)
    }
  }
  blockquote(A) {
    let Q = this.rules.block.blockquote.exec(A);
    if (Q) {
      let B = JMA(Q[0], `
`).split(`
`),
        G = "",
        Z = "",
        I = [];
      while (B.length > 0) {
        let Y = !1,
          J = [],
          W;
        for (W = 0; W < B.length; W++)
          if (this.rules.other.blockquoteStart.test(B[W])) J.push(B[W]), Y = !0;
          else if (!Y) J.push(B[W]);
        else break;
        B = B.slice(W);
        let X = J.join(`
`),
          V = X.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        G = G ? `${G}
${X}` : X, Z = Z ? `${Z}
${V}` : V;
        let F = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(V, I, !0), this.lexer.state.top = F, B.length === 0) break;
        let K = I.at(-1);
        if (K?.type === "code") break;
        else if (K?.type === "blockquote") {
          let D = K,
            H = D.raw + `
` + B.join(`
`),
            C = this.blockquote(H);
          I[I.length - 1] = C, G = G.substring(0, G.length - D.raw.length) + C.raw, Z = Z.substring(0, Z.length - D.text.length) + C.text;
          break
        } else if (K?.type === "list") {
          let D = K,
            H = D.raw + `
` + B.join(`
`),
            C = this.list(H);
          I[I.length - 1] = C, G = G.substring(0, G.length - K.raw.length) + C.raw, Z = Z.substring(0, Z.length - D.raw.length) + C.raw, B = H.substring(I.at(-1).raw.length).split(`
`);
          continue
        }
      }
      return {
        type: "blockquote",
        raw: G,
        tokens: I,
        text: Z
      }
    }
  }
  list(A) {
    let Q = this.rules.block.list.exec(A);
    if (Q) {
      let B = Q[1].trim(),
        G = B.length > 1,
        Z = {
          type: "list",
          raw: "",
          ordered: G,
          start: G ? +B.slice(0, -1) : "",
          loose: !1,
          items: []
        };
      if (B = G ? `\\d{1,9}\\${B.slice(-1)}` : `\\${B}`, this.options.pedantic) B = G ? B : "[*+-]";
      let I = this.rules.other.listItemRegex(B),
        Y = !1;
      while (A) {
        let W = !1,
          X = "",
          V = "";
        if (!(Q = I.exec(A))) break;
        if (this.rules.block.hr.test(A)) break;
        X = Q[0], A = A.substring(X.length);
        let F = Q[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (U) => " ".repeat(3 * U.length)),
          K = A.split(`
`, 1)[0],
          D = !F.trim(),
          H = 0;
        if (this.options.pedantic) H = 2, V = F.trimStart();
        else if (D) H = Q[1].length + 1;
        else H = Q[2].search(this.rules.other.nonSpaceChar), H = H > 4 ? 1 : H, V = F.slice(H), H += Q[1].length;
        if (D && this.rules.other.blankLine.test(K)) X += K + `
`, A = A.substring(K.length + 1), W = !0;
        if (!W) {
          let U = this.rules.other.nextBulletRegex(H),
            q = this.rules.other.hrRegex(H),
            w = this.rules.other.fencesBeginRegex(H),
            N = this.rules.other.headingBeginRegex(H),
            R = this.rules.other.htmlBeginRegex(H);
          while (A) {
            let T = A.split(`
`, 1)[0],
              y;
            if (K = T, this.options.pedantic) K = K.replace(this.rules.other.listReplaceNesting, "  "), y = K;
            else y = K.replace(this.rules.other.tabCharGlobal, "    ");
            if (w.test(K)) break;
            if (N.test(K)) break;
            if (R.test(K)) break;
            if (U.test(K)) break;
            if (q.test(K)) break;
            if (y.search(this.rules.other.nonSpaceChar) >= H || !K.trim()) V += `
` + y.slice(H);
            else {
              if (D) break;
              if (F.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
              if (w.test(F)) break;
              if (N.test(F)) break;
              if (q.test(F)) break;
              V += `
` + K
            }
            if (!D && !K.trim()) D = !0;
            X += T + `
`, A = A.substring(T.length + 1), F = y.slice(H)
          }
        }
        if (!Z.loose) {
          if (Y) Z.loose = !0;
          else if (this.rules.other.doubleBlankLine.test(X)) Y = !0
        }
        let C = null,
          E;
        if (this.options.gfm) {
          if (C = this.rules.other.listIsTask.exec(V), C) E = C[0] !== "[ ] ", V = V.replace(this.rules.other.listReplaceTask, "")
        }
        Z.items.push({
          type: "list_item",
          raw: X,
          task: !!C,
          checked: E,
          loose: !1,
          text: V,
          tokens: []
        }), Z.raw += X
      }
      let J = Z.items.at(-1);
      if (J) J.raw = J.raw.trimEnd(), J.text = J.text.trimEnd();
      else return;
      Z.raw = Z.raw.trimEnd();
      for (let W = 0; W < Z.items.length; W++)
        if (this.lexer.state.top = !1, Z.items[W].tokens = this.lexer.blockTokens(Z.items[W].text, []), !Z.loose) {
          let X = Z.items[W].tokens.filter((F) => F.type === "space"),
            V = X.length > 0 && X.some((F) => this.rules.other.anyLine.test(F.raw));
          Z.loose = V
        } if (Z.loose)
        for (let W = 0; W < Z.items.length; W++) Z.items[W].loose = !0;
      return Z
    }
  }
  html(A) {
    let Q = this.rules.block.html.exec(A);
    if (Q) return {
      type: "html",
      block: !0,
      raw: Q[0],
      pre: Q[1] === "pre" || Q[1] === "script" || Q[1] === "style",
      text: Q[0]
    }
  }
  def(A) {
    let Q = this.rules.block.def.exec(A);
    if (Q) {
      let B = Q[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
        G = Q[2] ? Q[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
        Z = Q[3] ? Q[3].substring(1, Q[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : Q[3];
      return {
        type: "def",
        tag: B,
        raw: Q[0],
        href: G,
        title: Z
      }
    }
  }
  table(A) {
    let Q = this.rules.block.table.exec(A);
    if (!Q) return;
    if (!this.rules.other.tableDelimiter.test(Q[2])) return;
    let B = u32(Q[1]),
      G = Q[2].replace(this.rules.other.tableAlignChars, "").split("|"),
      Z = Q[3]?.trim() ? Q[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [],
      I = {
        type: "table",
        raw: Q[0],
        header: [],
        align: [],
        rows: []
      };
    if (B.length !== G.length) return;
    for (let Y of G)
      if (this.rules.other.tableAlignRight.test(Y)) I.align.push("right");
      else if (this.rules.other.tableAlignCenter.test(Y)) I.align.push("center");
    else if (this.rules.other.tableAlignLeft.test(Y)) I.align.push("left");
    else I.align.push(null);
    for (let Y = 0; Y < B.length; Y++) I.header.push({
      text: B[Y],
      tokens: this.lexer.inline(B[Y]),
      header: !0,
      align: I.align[Y]
    });
    for (let Y of Z) I.rows.push(u32(Y, I.header.length).map((J, W) => {
      return {
        text: J,
        tokens: this.lexer.inline(J),
        header: !1,
        align: I.align[W]
      }
    }));
    return I
  }
  lheading(A) {
    let Q = this.rules.block.lheading.exec(A);
    if (Q) return {
      type: "heading",
      raw: Q[0],
      depth: Q[2].charAt(0) === "=" ? 1 : 2,
      text: Q[1],
      tokens: this.lexer.inline(Q[1])
    }
  }
  paragraph(A) {
    let Q = this.rules.block.paragraph.exec(A);
    if (Q) {
      let B = Q[1].charAt(Q[1].length - 1) === `
` ? Q[1].slice(0, -1) : Q[1];
      return {
        type: "paragraph",
        raw: Q[0],
        text: B,
        tokens: this.lexer.inline(B)
      }
    }
  }
  text(A) {
    let Q = this.rules.block.text.exec(A);
    if (Q) return {
      type: "text",
      raw: Q[0],
      text: Q[0],
      tokens: this.lexer.inline(Q[0])
    }
  }
  escape(A) {
    let Q = this.rules.inline.escape.exec(A);
    if (Q) return {
      type: "escape",
      raw: Q[0],
      text: Q[1]
    }
  }
  tag(A) {
    let Q = this.rules.inline.tag.exec(A);
    if (Q) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(Q[0])) this.lexer.state.inLink = !0;
      else if (this.lexer.state.inLink && this.rules.other.endATag.test(Q[0])) this.lexer.state.inLink = !1;
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(Q[0])) this.lexer.state.inRawBlock = !0;
      else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(Q[0])) this.lexer.state.inRawBlock = !1;
      return {
        type: "html",
        raw: Q[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: Q[0]
      }
    }
  }
  link(A) {
    let Q = this.rules.inline.link.exec(A);
    if (Q) {
      let B = Q[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(B)) {
        if (!this.rules.other.endAngleBracket.test(B)) return;
        let I = JMA(B.slice(0, -1), "\\");
        if ((B.length - I.length) % 2 === 0) return
      } else {
        let I = DJ5(Q[2], "()");
        if (I > -1) {
          let J = (Q[0].indexOf("!") === 0 ? 5 : 4) + Q[1].length + I;
          Q[2] = Q[2].substring(0, I), Q[0] = Q[0].substring(0, J).trim(), Q[3] = ""
        }
      }
      let G = Q[2],
        Z = "";
      if (this.options.pedantic) {
        let I = this.rules.other.pedanticHrefTitle.exec(G);
        if (I) G = I[1], Z = I[3]
      } else Z = Q[3] ? Q[3].slice(1, -1) : "";
      if (G = G.trim(), this.rules.other.startAngleBracket.test(G))
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(B)) G = G.slice(1);
        else G = G.slice(1, -1);
      return m32(Q, {
        href: G ? G.replace(this.rules.inline.anyPunctuation, "$1") : G,
        title: Z ? Z.replace(this.rules.inline.anyPunctuation, "$1") : Z
      }, Q[0], this.lexer, this.rules)
    }
  }
  reflink(A, Q) {
    let B;
    if ((B = this.rules.inline.reflink.exec(A)) || (B = this.rules.inline.nolink.exec(A))) {
      let G = (B[2] || B[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
        Z = Q[G.toLowerCase()];
      if (!Z) {
        let I = B[0].charAt(0);
        return {
          type: "text",
          raw: I,
          text: I
        }
      }
      return m32(B, Z, B[0], this.lexer, this.rules)
    }
  }
  emStrong(A, Q, B = "") {
    let G = this.rules.inline.emStrongLDelim.exec(A);
    if (!G) return;
    if (G[3] && B.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(G[1] || G[2]) || !B || this.rules.inline.punctuation.exec(B)) {
      let I = [...G[0]].length - 1,
        Y, J, W = I,
        X = 0,
        V = G[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      V.lastIndex = 0, Q = Q.slice(-1 * A.length + I);
      while ((G = V.exec(Q)) != null) {
        if (Y = G[1] || G[2] || G[3] || G[4] || G[5] || G[6], !Y) continue;
        if (J = [...Y].length, G[3] || G[4]) {
          W += J;
          continue
        } else if (G[5] || G[6]) {
          if (I % 3 && !((I + J) % 3)) {
            X += J;
            continue
          }
        }
        if (W -= J, W > 0) continue;
        J = Math.min(J, J + W + X);
        let F = [...G[0]][0].length,
          K = A.slice(0, I + G.index + F + J);
        if (Math.min(I, J) % 2) {
          let H = K.slice(1, -1);
          return {
            type: "em",
            raw: K,
            text: H,
            tokens: this.lexer.inlineTokens(H)
          }
        }
        let D = K.slice(2, -2);
        return {
          type: "strong",
          raw: K,
          text: D,
          tokens: this.lexer.inlineTokens(D)
        }
      }
    }
  }
  codespan(A) {
    let Q = this.rules.inline.code.exec(A);
    if (Q) {
      let B = Q[2].replace(this.rules.other.newLineCharGlobal, " "),
        G = this.rules.other.nonSpaceChar.test(B),
        Z = this.rules.other.startingSpaceChar.test(B) && this.rules.other.endingSpaceChar.test(B);
      if (G && Z) B = B.substring(1, B.length - 1);
      return {
        type: "codespan",
        raw: Q[0],
        text: B
      }
    }
  }
  br(A) {
    let Q = this.rules.inline.br.exec(A);
    if (Q) return {
      type: "br",
      raw: Q[0]
    }
  }
  del(A) {
    let Q = this.rules.inline.del.exec(A);
    if (Q) return {
      type: "del",
      raw: Q[0],
      text: Q[2],
      tokens: this.lexer.inlineTokens(Q[2])
    }
  }
  autolink(A) {
    let Q = this.rules.inline.autolink.exec(A);
    if (Q) {
      let B, G;
      if (Q[2] === "@") B = Q[1], G = "mailto:" + B;
      else B = Q[1], G = B;
      return {
        type: "link",
        raw: Q[0],
        text: B,
        href: G,
        tokens: [{
          type: "text",
          raw: B,
          text: B
        }]
      }
    }
  }
  url(A) {
    let Q;
    if (Q = this.rules.inline.url.exec(A)) {
      let B, G;
      if (Q[2] === "@") B = Q[0], G = "mailto:" + B;
      else {
        let Z;
        do Z = Q[0], Q[0] = this.rules.inline._backpedal.exec(Q[0])?.[0] ?? ""; while (Z !== Q[0]);
        if (B = Q[0], Q[1] === "www.") G = "http://" + Q[0];
        else G = Q[0]
      }
      return {
        type: "link",
        raw: Q[0],
        text: B,
        href: G,
        tokens: [{
          type: "text",
          raw: B,
          text: B
        }]
      }
    }
  }
  inlineText(A) {
    let Q = this.rules.inline.text.exec(A);
    if (Q) {
      let B = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: Q[0],
        text: Q[0],
        escaped: B
      }
    }
  }
}
// @from(Start 9562338, End 9570600)
class vE {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(A) {
    this.tokens = [], this.tokens.links = Object.create(null), this.options = A || C1A, this.options.tokenizer = this.options.tokenizer || new VMA, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    let Q = {
      other: xE,
      block: w21.normal,
      inline: YMA.normal
    };
    if (this.options.pedantic) Q.block = w21.pedantic, Q.inline = YMA.pedantic;
    else if (this.options.gfm)
      if (Q.block = w21.gfm, this.options.breaks) Q.inline = YMA.breaks;
      else Q.inline = YMA.gfm;
    this.tokenizer.rules = Q
  }
  static get rules() {
    return {
      block: w21,
      inline: YMA
    }
  }
  static lex(A, Q) {
    return new vE(Q).lex(A)
  }
  static lexInline(A, Q) {
    return new vE(Q).inlineTokens(A)
  }
  lex(A) {
    A = A.replace(xE.carriageReturn, `
`), this.blockTokens(A, this.tokens);
    for (let Q = 0; Q < this.inlineQueue.length; Q++) {
      let B = this.inlineQueue[Q];
      this.inlineTokens(B.src, B.tokens)
    }
    return this.inlineQueue = [], this.tokens
  }
  blockTokens(A, Q = [], B = !1) {
    if (this.options.pedantic) A = A.replace(xE.tabCharGlobal, "    ").replace(xE.spaceLine, "");
    while (A) {
      let G;
      if (this.options.extensions?.block?.some((I) => {
          if (G = I.call({
              lexer: this
            }, A, Q)) return A = A.substring(G.raw.length), Q.push(G), !0;
          return !1
        })) continue;
      if (G = this.tokenizer.space(A)) {
        A = A.substring(G.raw.length);
        let I = Q.at(-1);
        if (G.raw.length === 1 && I !== void 0) I.raw += `
`;
        else Q.push(G);
        continue
      }
      if (G = this.tokenizer.code(A)) {
        A = A.substring(G.raw.length);
        let I = Q.at(-1);
        if (I?.type === "paragraph" || I?.type === "text") I.raw += `
` + G.raw, I.text += `
` + G.text, this.inlineQueue.at(-1).src = I.text;
        else Q.push(G);
        continue
      }
      if (G = this.tokenizer.fences(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.heading(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.hr(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.blockquote(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.list(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.html(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.def(A)) {
        A = A.substring(G.raw.length);
        let I = Q.at(-1);
        if (I?.type === "paragraph" || I?.type === "text") I.raw += `
` + G.raw, I.text += `
` + G.raw, this.inlineQueue.at(-1).src = I.text;
        else if (!this.tokens.links[G.tag]) this.tokens.links[G.tag] = {
          href: G.href,
          title: G.title
        };
        continue
      }
      if (G = this.tokenizer.table(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      if (G = this.tokenizer.lheading(A)) {
        A = A.substring(G.raw.length), Q.push(G);
        continue
      }
      let Z = A;
      if (this.options.extensions?.startBlock) {
        let I = 1 / 0,
          Y = A.slice(1),
          J;
        if (this.options.extensions.startBlock.forEach((W) => {
            if (J = W.call({
                lexer: this
              }, Y), typeof J === "number" && J >= 0) I = Math.min(I, J)
          }), I < 1 / 0 && I >= 0) Z = A.substring(0, I + 1)
      }
      if (this.state.top && (G = this.tokenizer.paragraph(Z))) {
        let I = Q.at(-1);
        if (B && I?.type === "paragraph") I.raw += `
` + G.raw, I.text += `
` + G.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = I.text;
        else Q.push(G);
        B = Z.length !== A.length, A = A.substring(G.raw.length);
        continue
      }
      if (G = this.tokenizer.text(A)) {
        A = A.substring(G.raw.length);
        let I = Q.at(-1);
        if (I?.type === "text") I.raw += `
` + G.raw, I.text += `
` + G.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = I.text;
        else Q.push(G);
        continue
      }
      if (A) {
        let I = "Infinite loop on byte: " + A.charCodeAt(0);
        if (this.options.silent) {
          console.error(I);
          break
        } else throw Error(I)
      }
    }
    return this.state.top = !0, Q
  }
  inline(A, Q = []) {
    return this.inlineQueue.push({
      src: A,
      tokens: Q
    }), Q
  }
  inlineTokens(A, Q = []) {
    let B = A,
      G = null;
    if (this.tokens.links) {
      let Y = Object.keys(this.tokens.links);
      if (Y.length > 0) {
        while ((G = this.tokenizer.rules.inline.reflinkSearch.exec(B)) != null)
          if (Y.includes(G[0].slice(G[0].lastIndexOf("[") + 1, -1))) B = B.slice(0, G.index) + "[" + "a".repeat(G[0].length - 2) + "]" + B.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)
      }
    }
    while ((G = this.tokenizer.rules.inline.blockSkip.exec(B)) != null) B = B.slice(0, G.index) + "[" + "a".repeat(G[0].length - 2) + "]" + B.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    while ((G = this.tokenizer.rules.inline.anyPunctuation.exec(B)) != null) B = B.slice(0, G.index) + "++" + B.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let Z = !1,
      I = "";
    while (A) {
      if (!Z) I = "";
      Z = !1;
      let Y;
      if (this.options.extensions?.inline?.some((W) => {
          if (Y = W.call({
              lexer: this
            }, A, Q)) return A = A.substring(Y.raw.length), Q.push(Y), !0;
          return !1
        })) continue;
      if (Y = this.tokenizer.escape(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.tag(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.link(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.reflink(A, this.tokens.links)) {
        A = A.substring(Y.raw.length);
        let W = Q.at(-1);
        if (Y.type === "text" && W?.type === "text") W.raw += Y.raw, W.text += Y.text;
        else Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.emStrong(A, B, I)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.codespan(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.br(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.del(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (Y = this.tokenizer.autolink(A)) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      if (!this.state.inLink && (Y = this.tokenizer.url(A))) {
        A = A.substring(Y.raw.length), Q.push(Y);
        continue
      }
      let J = A;
      if (this.options.extensions?.startInline) {
        let W = 1 / 0,
          X = A.slice(1),
          V;
        if (this.options.extensions.startInline.forEach((F) => {
            if (V = F.call({
                lexer: this
              }, X), typeof V === "number" && V >= 0) W = Math.min(W, V)
          }), W < 1 / 0 && W >= 0) J = A.substring(0, W + 1)
      }
      if (Y = this.tokenizer.inlineText(J)) {
        if (A = A.substring(Y.raw.length), Y.raw.slice(-1) !== "_") I = Y.raw.slice(-1);
        Z = !0;
        let W = Q.at(-1);
        if (W?.type === "text") W.raw += Y.raw, W.text += Y.text;
        else Q.push(Y);
        continue
      }
      if (A) {
        let W = "Infinite loop on byte: " + A.charCodeAt(0);
        if (this.options.silent) {
          console.error(W);
          break
        } else throw Error(W)
      }
    }
    return Q
  }
}
// @from(Start 9570601, End 9574334)
class FMA {
  options;
  parser;
  constructor(A) {
    this.options = A || C1A
  }
  space(A) {
    return ""
  }
  code({
    text: A,
    lang: Q,
    escaped: B
  }) {
    let G = (Q || "").match(xE.notSpaceStart)?.[0],
      Z = A.replace(xE.endingNewline, "") + `
`;
    if (!G) return "<pre><code>" + (B ? Z : hk(Z, !0)) + `</code></pre>
`;
    return '<pre><code class="language-' + hk(G) + '">' + (B ? Z : hk(Z, !0)) + `</code></pre>
`
  }
  blockquote({
    tokens: A
  }) {
    return `<blockquote>
${this.parser.parse(A)}</blockquote>
`
  }
  html({
    text: A
  }) {
    return A
  }
  heading({
    tokens: A,
    depth: Q
  }) {
    return `<h${Q}>${this.parser.parseInline(A)}</h${Q}>
`
  }
  hr(A) {
    return `<hr>
`
  }
  list(A) {
    let {
      ordered: Q,
      start: B
    } = A, G = "";
    for (let Y = 0; Y < A.items.length; Y++) {
      let J = A.items[Y];
      G += this.listitem(J)
    }
    let Z = Q ? "ol" : "ul",
      I = Q && B !== 1 ? ' start="' + B + '"' : "";
    return "<" + Z + I + `>
` + G + "</" + Z + `>
`
  }
  listitem(A) {
    let Q = "";
    if (A.task) {
      let B = this.checkbox({
        checked: !!A.checked
      });
      if (A.loose)
        if (A.tokens[0]?.type === "paragraph") {
          if (A.tokens[0].text = B + " " + A.tokens[0].text, A.tokens[0].tokens && A.tokens[0].tokens.length > 0 && A.tokens[0].tokens[0].type === "text") A.tokens[0].tokens[0].text = B + " " + hk(A.tokens[0].tokens[0].text), A.tokens[0].tokens[0].escaped = !0
        } else A.tokens.unshift({
          type: "text",
          raw: B + " ",
          text: B + " ",
          escaped: !0
        });
      else Q += B + " "
    }
    return Q += this.parser.parse(A.tokens, !!A.loose), `<li>${Q}</li>
`
  }
  checkbox({
    checked: A
  }) {
    return "<input " + (A ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
  }
  paragraph({
    tokens: A
  }) {
    return `<p>${this.parser.parseInline(A)}</p>
`
  }
  table(A) {
    let Q = "",
      B = "";
    for (let Z = 0; Z < A.header.length; Z++) B += this.tablecell(A.header[Z]);
    Q += this.tablerow({
      text: B
    });
    let G = "";
    for (let Z = 0; Z < A.rows.length; Z++) {
      let I = A.rows[Z];
      B = "";
      for (let Y = 0; Y < I.length; Y++) B += this.tablecell(I[Y]);
      G += this.tablerow({
        text: B
      })
    }
    if (G) G = `<tbody>${G}</tbody>`;
    return `<table>
<thead>
` + Q + `</thead>
` + G + `</table>
`
  }
  tablerow({
    text: A
  }) {
    return `<tr>
${A}</tr>
`
  }
  tablecell(A) {
    let Q = this.parser.parseInline(A.tokens),
      B = A.header ? "th" : "td";
    return (A.align ? `<${B} align="${A.align}">` : `<${B}>`) + Q + `</${B}>
`
  }
  strong({
    tokens: A
  }) {
    return `<strong>${this.parser.parseInline(A)}</strong>`
  }
  em({
    tokens: A
  }) {
    return `<em>${this.parser.parseInline(A)}</em>`
  }
  codespan({
    text: A
  }) {
    return `<code>${hk(A,!0)}</code>`
  }
  br(A) {
    return "<br>"
  }
  del({
    tokens: A
  }) {
    return `<del>${this.parser.parseInline(A)}</del>`
  }
  link({
    href: A,
    title: Q,
    tokens: B
  }) {
    let G = this.parser.parseInline(B),
      Z = g32(A);
    if (Z === null) return G;
    A = Z;
    let I = '<a href="' + A + '"';
    if (Q) I += ' title="' + hk(Q) + '"';
    return I += ">" + G + "</a>", I
  }
  image({
    href: A,
    title: Q,
    text: B
  }) {
    let G = g32(A);
    if (G === null) return hk(B);
    A = G;
    let Z = `<img src="${A}" alt="${B}"`;
    if (Q) Z += ` title="${hk(Q)}"`;
    return Z += ">", Z
  }
  text(A) {
    return "tokens" in A && A.tokens ? this.parser.parseInline(A.tokens) : ("escaped" in A) && A.escaped ? A.text : hk(A.text)
  }
}
// @from(Start 9574335, End 9574749)
class M21 {
  strong({
    text: A
  }) {
    return A
  }
  em({
    text: A
  }) {
    return A
  }
  codespan({
    text: A
  }) {
    return A
  }
  del({
    text: A
  }) {
    return A
  }
  html({
    text: A
  }) {
    return A
  }
  text({
    text: A
  }) {
    return A
  }
  link({
    text: A
  }) {
    return "" + A
  }
  image({
    text: A
  }) {
    return "" + A
  }
  br() {
    return ""
  }
}
// @from(Start 9574750, End 9578756)
class eM {
  options;
  renderer;
  textRenderer;
  constructor(A) {
    this.options = A || C1A, this.options.renderer = this.options.renderer || new FMA, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new M21
  }
  static parse(A, Q) {
    return new eM(Q).parse(A)
  }
  static parseInline(A, Q) {
    return new eM(Q).parseInline(A)
  }
  parse(A, Q = !0) {
    let B = "";
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      if (this.options.extensions?.renderers?.[Z.type]) {
        let Y = Z,
          J = this.options.extensions.renderers[Y.type].call({
            parser: this
          }, Y);
        if (J !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(Y.type)) {
          B += J || "";
          continue
        }
      }
      let I = Z;
      switch (I.type) {
        case "space": {
          B += this.renderer.space(I);
          continue
        }
        case "hr": {
          B += this.renderer.hr(I);
          continue
        }
        case "heading": {
          B += this.renderer.heading(I);
          continue
        }
        case "code": {
          B += this.renderer.code(I);
          continue
        }
        case "table": {
          B += this.renderer.table(I);
          continue
        }
        case "blockquote": {
          B += this.renderer.blockquote(I);
          continue
        }
        case "list": {
          B += this.renderer.list(I);
          continue
        }
        case "html": {
          B += this.renderer.html(I);
          continue
        }
        case "paragraph": {
          B += this.renderer.paragraph(I);
          continue
        }
        case "text": {
          let Y = I,
            J = this.renderer.text(Y);
          while (G + 1 < A.length && A[G + 1].type === "text") Y = A[++G], J += `
` + this.renderer.text(Y);
          if (Q) B += this.renderer.paragraph({
            type: "paragraph",
            raw: J,
            text: J,
            tokens: [{
              type: "text",
              raw: J,
              text: J,
              escaped: !0
            }]
          });
          else B += J;
          continue
        }
        default: {
          let Y = 'Token with "' + I.type + '" type was not found.';
          if (this.options.silent) return console.error(Y), "";
          else throw Error(Y)
        }
      }
    }
    return B
  }
  parseInline(A, Q = this.renderer) {
    let B = "";
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      if (this.options.extensions?.renderers?.[Z.type]) {
        let Y = this.options.extensions.renderers[Z.type].call({
          parser: this
        }, Z);
        if (Y !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(Z.type)) {
          B += Y || "";
          continue
        }
      }
      let I = Z;
      switch (I.type) {
        case "escape": {
          B += Q.text(I);
          break
        }
        case "html": {
          B += Q.html(I);
          break
        }
        case "link": {
          B += Q.link(I);
          break
        }
        case "image": {
          B += Q.image(I);
          break
        }
        case "strong": {
          B += Q.strong(I);
          break
        }
        case "em": {
          B += Q.em(I);
          break
        }
        case "codespan": {
          B += Q.codespan(I);
          break
        }
        case "br": {
          B += Q.br(I);
          break
        }
        case "del": {
          B += Q.del(I);
          break
        }
        case "text": {
          B += Q.text(I);
          break
        }
        default: {
          let Y = 'Token with "' + I.type + '" type was not found.';
          if (this.options.silent) return console.error(Y), "";
          else throw Error(Y)
        }
      }
    }
    return B
  }
}
// @from(Start 9578757, End 9585520)
class e32 {
  defaults = h10();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = eM;
  Renderer = FMA;
  TextRenderer = M21;
  Lexer = vE;
  Tokenizer = VMA;
  Hooks = XMA;
  constructor(...A) {
    this.use(...A)
  }
  walkTokens(A, Q) {
    let B = [];
    for (let G of A) switch (B = B.concat(Q.call(this, G)), G.type) {
      case "table": {
        let Z = G;
        for (let I of Z.header) B = B.concat(this.walkTokens(I.tokens, Q));
        for (let I of Z.rows)
          for (let Y of I) B = B.concat(this.walkTokens(Y.tokens, Q));
        break
      }
      case "list": {
        let Z = G;
        B = B.concat(this.walkTokens(Z.items, Q));
        break
      }
      default: {
        let Z = G;
        if (this.defaults.extensions?.childTokens?.[Z.type]) this.defaults.extensions.childTokens[Z.type].forEach((I) => {
          let Y = Z[I].flat(1 / 0);
          B = B.concat(this.walkTokens(Y, Q))
        });
        else if (Z.tokens) B = B.concat(this.walkTokens(Z.tokens, Q))
      }
    }
    return B
  }
  use(...A) {
    let Q = this.defaults.extensions || {
      renderers: {},
      childTokens: {}
    };
    return A.forEach((B) => {
      let G = {
        ...B
      };
      if (G.async = this.defaults.async || G.async || !1, B.extensions) B.extensions.forEach((Z) => {
        if (!Z.name) throw Error("extension name required");
        if ("renderer" in Z) {
          let I = Q.renderers[Z.name];
          if (I) Q.renderers[Z.name] = function(...Y) {
            let J = Z.renderer.apply(this, Y);
            if (J === !1) J = I.apply(this, Y);
            return J
          };
          else Q.renderers[Z.name] = Z.renderer
        }
        if ("tokenizer" in Z) {
          if (!Z.level || Z.level !== "block" && Z.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
          let I = Q[Z.level];
          if (I) I.unshift(Z.tokenizer);
          else Q[Z.level] = [Z.tokenizer];
          if (Z.start) {
            if (Z.level === "block")
              if (Q.startBlock) Q.startBlock.push(Z.start);
              else Q.startBlock = [Z.start];
            else if (Z.level === "inline")
              if (Q.startInline) Q.startInline.push(Z.start);
              else Q.startInline = [Z.start]
          }
        }
        if ("childTokens" in Z && Z.childTokens) Q.childTokens[Z.name] = Z.childTokens
      }), G.extensions = Q;
      if (B.renderer) {
        let Z = this.defaults.renderer || new FMA(this.defaults);
        for (let I in B.renderer) {
          if (!(I in Z)) throw Error(`renderer '${I}' does not exist`);
          if (["options", "parser"].includes(I)) continue;
          let Y = I,
            J = B.renderer[Y],
            W = Z[Y];
          Z[Y] = (...X) => {
            let V = J.apply(Z, X);
            if (V === !1) V = W.apply(Z, X);
            return V || ""
          }
        }
        G.renderer = Z
      }
      if (B.tokenizer) {
        let Z = this.defaults.tokenizer || new VMA(this.defaults);
        for (let I in B.tokenizer) {
          if (!(I in Z)) throw Error(`tokenizer '${I}' does not exist`);
          if (["options", "rules", "lexer"].includes(I)) continue;
          let Y = I,
            J = B.tokenizer[Y],
            W = Z[Y];
          Z[Y] = (...X) => {
            let V = J.apply(Z, X);
            if (V === !1) V = W.apply(Z, X);
            return V
          }
        }
        G.tokenizer = Z
      }
      if (B.hooks) {
        let Z = this.defaults.hooks || new XMA;
        for (let I in B.hooks) {
          if (!(I in Z)) throw Error(`hook '${I}' does not exist`);
          if (["options", "block"].includes(I)) continue;
          let Y = I,
            J = B.hooks[Y],
            W = Z[Y];
          if (XMA.passThroughHooks.has(I)) Z[Y] = (X) => {
            if (this.defaults.async) return Promise.resolve(J.call(Z, X)).then((F) => {
              return W.call(Z, F)
            });
            let V = J.call(Z, X);
            return W.call(Z, V)
          };
          else Z[Y] = (...X) => {
            let V = J.apply(Z, X);
            if (V === !1) V = W.apply(Z, X);
            return V
          }
        }
        G.hooks = Z
      }
      if (B.walkTokens) {
        let Z = this.defaults.walkTokens,
          I = B.walkTokens;
        G.walkTokens = function(Y) {
          let J = [];
          if (J.push(I.call(this, Y)), Z) J = J.concat(Z.call(this, Y));
          return J
        }
      }
      this.defaults = {
        ...this.defaults,
        ...G
      }
    }), this
  }
  setOptions(A) {
    return this.defaults = {
      ...this.defaults,
      ...A
    }, this
  }
  lexer(A, Q) {
    return vE.lex(A, Q ?? this.defaults)
  }
  parser(A, Q) {
    return eM.parse(A, Q ?? this.defaults)
  }
  parseMarkdown(A) {
    return (B, G) => {
      let Z = {
          ...G
        },
        I = {
          ...this.defaults,
          ...Z
        },
        Y = this.onError(!!I.silent, !!I.async);
      if (this.defaults.async === !0 && Z.async === !1) return Y(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof B > "u" || B === null) return Y(Error("marked(): input parameter is undefined or null"));
      if (typeof B !== "string") return Y(Error("marked(): input parameter is of type " + Object.prototype.toString.call(B) + ", string expected"));
      if (I.hooks) I.hooks.options = I, I.hooks.block = A;
      let J = I.hooks ? I.hooks.provideLexer() : A ? vE.lex : vE.lexInline,
        W = I.hooks ? I.hooks.provideParser() : A ? eM.parse : eM.parseInline;
      if (I.async) return Promise.resolve(I.hooks ? I.hooks.preprocess(B) : B).then((X) => J(X, I)).then((X) => I.hooks ? I.hooks.processAllTokens(X) : X).then((X) => I.walkTokens ? Promise.all(this.walkTokens(X, I.walkTokens)).then(() => X) : X).then((X) => W(X, I)).then((X) => I.hooks ? I.hooks.postprocess(X) : X).catch(Y);
      try {
        if (I.hooks) B = I.hooks.preprocess(B);
        let X = J(B, I);
        if (I.hooks) X = I.hooks.processAllTokens(X);
        if (I.walkTokens) this.walkTokens(X, I.walkTokens);
        let V = W(X, I);
        if (I.hooks) V = I.hooks.postprocess(V);
        return V
      } catch (X) {
        return Y(X)
      }
    }
  }
  onError(A, Q) {
    return (B) => {
      if (B.message += `
Please report this to https://github.com/markedjs/marked.`, A) {
        let G = "<p>An error occurred:</p><pre>" + hk(B.message + "", !0) + "</pre>";
        if (Q) return Promise.resolve(G);
        return G
      }
      if (Q) return Promise.reject(B);
      throw B
    }
  }
}
// @from(Start 9585522, End 9585568)
function a7(A, Q) {
  return H1A.parse(A, Q)
}
// @from(Start 9585573, End 9585576)
C1A
// @from(Start 9585578, End 9585581)
WMA
// @from(Start 9585583, End 9585585)
xE
// @from(Start 9585587, End 9585590)
vY5
// @from(Start 9585592, End 9585595)
bY5
// @from(Start 9585597, End 9585600)
fY5
// @from(Start 9585602, End 9585605)
KMA
// @from(Start 9585607, End 9585610)
hY5
// @from(Start 9585612, End 9585615)
c32
// @from(Start 9585617, End 9585620)
p32
// @from(Start 9585622, End 9585625)
g10
// @from(Start 9585627, End 9585630)
gY5
// @from(Start 9585632, End 9585635)
u10
// @from(Start 9585637, End 9585640)
uY5
// @from(Start 9585642, End 9585645)
mY5
// @from(Start 9585647, End 9586004)
N21 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"
// @from(Start 9586008, End 9586011)
m10
// @from(Start 9586013, End 9586016)
dY5
// @from(Start 9586018, End 9586021)
l32
// @from(Start 9586023, End 9586026)
cY5
// @from(Start 9586028, End 9586031)
d10
// @from(Start 9586033, End 9586036)
f32
// @from(Start 9586038, End 9586041)
pY5
// @from(Start 9586043, End 9586046)
lY5
// @from(Start 9586048, End 9586051)
iY5
// @from(Start 9586053, End 9586056)
nY5
// @from(Start 9586058, End 9586061)
i32
// @from(Start 9586063, End 9586066)
aY5
// @from(Start 9586068, End 9586071)
L21
// @from(Start 9586073, End 9586076)
c10
// @from(Start 9586078, End 9586081)
n32
// @from(Start 9586083, End 9586086)
sY5
// @from(Start 9586088, End 9586091)
a32
// @from(Start 9586093, End 9586096)
rY5
// @from(Start 9586098, End 9586101)
oY5
// @from(Start 9586103, End 9586106)
tY5
// @from(Start 9586108, End 9586111)
s32
// @from(Start 9586113, End 9586116)
eY5
// @from(Start 9586118, End 9586121)
AJ5
// @from(Start 9586123, End 9586392)
r32 = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)"
// @from(Start 9586396, End 9586399)
QJ5
// @from(Start 9586401, End 9586404)
BJ5
// @from(Start 9586406, End 9586409)
GJ5
// @from(Start 9586411, End 9586414)
ZJ5
// @from(Start 9586416, End 9586419)
IJ5
// @from(Start 9586421, End 9586424)
YJ5
// @from(Start 9586426, End 9586429)
JJ5
// @from(Start 9586431, End 9586434)
q21
// @from(Start 9586436, End 9586439)
WJ5
// @from(Start 9586441, End 9586444)
o32
// @from(Start 9586446, End 9586449)
t32
// @from(Start 9586451, End 9586454)
XJ5
// @from(Start 9586456, End 9586459)
p10
// @from(Start 9586461, End 9586464)
VJ5
// @from(Start 9586466, End 9586469)
f10
// @from(Start 9586471, End 9586474)
FJ5
// @from(Start 9586476, End 9586479)
w21
// @from(Start 9586481, End 9586484)
YMA
// @from(Start 9586486, End 9586489)
KJ5
// @from(Start 9586491, End 9586510)
h32 = (A) => KJ5[A]
// @from(Start 9586514, End 9586517)
XMA
// @from(Start 9586519, End 9586522)
H1A
// @from(Start 9586524, End 9586527)
t_G
// @from(Start 9586529, End 9586532)
e_G
// @from(Start 9586534, End 9586537)
AkG
// @from(Start 9586539, End 9586542)
QkG
// @from(Start 9586544, End 9586547)
BkG
// @from(Start 9586549, End 9586552)
GkG
// @from(Start 9586554, End 9586557)
ZkG
// @from(Start 9586563, End 9598713)
l10 = L(() => {
  C1A = h10();
  WMA = {
    exec: () => null
  };
  xE = {
    codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceTabs: /^\t+/,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] /,
    listReplaceTask: /^\[[ xX]\] +/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (A) => new RegExp(`^( {0,3}${A})((?:[	 ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
    hrRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
    fencesBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:\`\`\`|~~~)`),
    headingBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}#`),
    htmlBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}<(?:[a-z].*>|!--)`, "i")
  }, vY5 = /^(?:[ \t]*(?:\n|$))+/, bY5 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, fY5 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, KMA = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, hY5 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, c32 = /(?:[*+-]|\d{1,9}[.)])/, p32 = CG(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, c32).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), g10 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, gY5 = /^[^\n]+/, u10 = /(?!\s*\])(?:\\.|[^\[\]\\])+/, uY5 = CG(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", u10).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), mY5 = CG(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, c32).getRegex(), m10 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, dY5 = CG("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", m10).replace("tag", N21).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), l32 = CG(g10).replace("hr", KMA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N21).getRegex(), cY5 = CG(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", l32).getRegex(), d10 = {
    blockquote: cY5,
    code: bY5,
    def: uY5,
    fences: fY5,
    heading: hY5,
    hr: KMA,
    html: dY5,
    lheading: p32,
    list: mY5,
    newline: vY5,
    paragraph: l32,
    table: WMA,
    text: gY5
  }, f32 = CG("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", KMA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N21).getRegex(), pY5 = {
    ...d10,
    table: f32,
    paragraph: CG(g10).replace("hr", KMA).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", f32).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N21).getRegex()
  }, lY5 = {
    ...d10,
    html: CG(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", m10).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: WMA,
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: CG(g10).replace("hr", KMA).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", p32).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  }, iY5 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, nY5 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, i32 = /^( {2,}|\\)\n(?!\s*$)/, aY5 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, L21 = /[\p{P}\p{S}]/u, c10 = /[\s\p{P}\p{S}]/u, n32 = /[^\s\p{P}\p{S}]/u, sY5 = CG(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, c10).getRegex(), a32 = /(?!~)[\p{P}\p{S}]/u, rY5 = /(?!~)[\s\p{P}\p{S}]/u, oY5 = /(?:[^\s\p{P}\p{S}]|~)/u, tY5 = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, s32 = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, eY5 = CG(s32, "u").replace(/punct/g, L21).getRegex(), AJ5 = CG(s32, "u").replace(/punct/g, a32).getRegex(), QJ5 = CG(r32, "gu").replace(/notPunctSpace/g, n32).replace(/punctSpace/g, c10).replace(/punct/g, L21).getRegex(), BJ5 = CG(r32, "gu").replace(/notPunctSpace/g, oY5).replace(/punctSpace/g, rY5).replace(/punct/g, a32).getRegex(), GJ5 = CG("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, n32).replace(/punctSpace/g, c10).replace(/punct/g, L21).getRegex(), ZJ5 = CG(/\\(punct)/, "gu").replace(/punct/g, L21).getRegex(), IJ5 = CG(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), YJ5 = CG(m10).replace("(?:-->|$)", "-->").getRegex(), JJ5 = CG("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", YJ5).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), q21 = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, WJ5 = CG(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", q21).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), o32 = CG(/^!?\[(label)\]\[(ref)\]/).replace("label", q21).replace("ref", u10).getRegex(), t32 = CG(/^!?\[(ref)\](?:\[\])?/).replace("ref", u10).getRegex(), XJ5 = CG("reflink|nolink(?!\\()", "g").replace("reflink", o32).replace("nolink", t32).getRegex(), p10 = {
    _backpedal: WMA,
    anyPunctuation: ZJ5,
    autolink: IJ5,
    blockSkip: tY5,
    br: i32,
    code: nY5,
    del: WMA,
    emStrongLDelim: eY5,
    emStrongRDelimAst: QJ5,
    emStrongRDelimUnd: GJ5,
    escape: iY5,
    link: WJ5,
    nolink: t32,
    punctuation: sY5,
    reflink: o32,
    reflinkSearch: XJ5,
    tag: JJ5,
    text: aY5,
    url: WMA
  }, VJ5 = {
    ...p10,
    link: CG(/^!?\[(label)\]\((.*?)\)/).replace("label", q21).getRegex(),
    reflink: CG(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q21).getRegex()
  }, f10 = {
    ...p10,
    emStrongRDelimAst: BJ5,
    emStrongLDelim: AJ5,
    url: CG(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  }, FJ5 = {
    ...f10,
    br: CG(i32).replace("{2,}", "*").getRegex(),
    text: CG(f10.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  }, w21 = {
    normal: d10,
    gfm: pY5,
    pedantic: lY5
  }, YMA = {
    normal: p10,
    gfm: f10,
    breaks: FJ5,
    pedantic: VJ5
  }, KJ5 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  XMA = class XMA {
    options;
    block;
    constructor(A) {
      this.options = A || C1A
    }
    static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(A) {
      return A
    }
    postprocess(A) {
      return A
    }
    processAllTokens(A) {
      return A
    }
    provideLexer() {
      return this.block ? vE.lex : vE.lexInline
    }
    provideParser() {
      return this.block ? eM.parse : eM.parseInline
    }
  };
  H1A = new e32;
  a7.options = a7.setOptions = function(A) {
    return H1A.setOptions(A), a7.defaults = H1A.defaults, d32(a7.defaults), a7
  };
  a7.getDefaults = h10;
  a7.defaults = C1A;
  a7.use = function(...A) {
    return H1A.use(...A), a7.defaults = H1A.defaults, d32(a7.defaults), a7
  };
  a7.walkTokens = function(A, Q) {
    return H1A.walkTokens(A, Q)
  };
  a7.parseInline = H1A.parseInline;
  a7.Parser = eM;
  a7.parser = eM.parse;
  a7.Renderer = FMA;
  a7.TextRenderer = M21;
  a7.Lexer = vE;
  a7.lexer = vE.lex;
  a7.Tokenizer = VMA;
  a7.Hooks = XMA;
  a7.parse = a7;
  t_G = a7.options, e_G = a7.setOptions, AkG = a7.use, QkG = a7.walkTokens, BkG = a7.parseInline, GkG = eM.parse, ZkG = vE.lex
})
// @from(Start 9598719, End 9600616)
O21 = z((EJ5) => {
  var CJ5 = [65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
  EJ5.REPLACEMENT_CHARACTER = "�";
  EJ5.CODE_POINTS = {
    EOF: -1,
    NULL: 0,
    TABULATION: 9,
    CARRIAGE_RETURN: 13,
    LINE_FEED: 10,
    FORM_FEED: 12,
    SPACE: 32,
    EXCLAMATION_MARK: 33,
    QUOTATION_MARK: 34,
    NUMBER_SIGN: 35,
    AMPERSAND: 38,
    APOSTROPHE: 39,
    HYPHEN_MINUS: 45,
    SOLIDUS: 47,
    DIGIT_0: 48,
    DIGIT_9: 57,
    SEMICOLON: 59,
    LESS_THAN_SIGN: 60,
    EQUALS_SIGN: 61,
    GREATER_THAN_SIGN: 62,
    QUESTION_MARK: 63,
    LATIN_CAPITAL_A: 65,
    LATIN_CAPITAL_F: 70,
    LATIN_CAPITAL_X: 88,
    LATIN_CAPITAL_Z: 90,
    RIGHT_SQUARE_BRACKET: 93,
    GRAVE_ACCENT: 96,
    LATIN_SMALL_A: 97,
    LATIN_SMALL_F: 102,
    LATIN_SMALL_X: 120,
    LATIN_SMALL_Z: 122,
    REPLACEMENT_CHARACTER: 65533
  };
  EJ5.CODE_POINT_SEQUENCES = {
    DASH_DASH_STRING: [45, 45],
    DOCTYPE_STRING: [68, 79, 67, 84, 89, 80, 69],
    CDATA_START_STRING: [91, 67, 68, 65, 84, 65, 91],
    SCRIPT_STRING: [115, 99, 114, 105, 112, 116],
    PUBLIC_STRING: [80, 85, 66, 76, 73, 67],
    SYSTEM_STRING: [83, 89, 83, 84, 69, 77]
  };
  EJ5.isSurrogate = function(A) {
    return A >= 55296 && A <= 57343
  };
  EJ5.isSurrogatePair = function(A) {
    return A >= 56320 && A <= 57343
  };
  EJ5.getSurrogatePairCodePoint = function(A, Q) {
    return (A - 55296) * 1024 + 9216 + Q
  };
  EJ5.isControlCodePoint = function(A) {
    return A !== 32 && A !== 10 && A !== 13 && A !== 9 && A !== 12 && A >= 1 && A <= 31 || A >= 127 && A <= 159
  };
  EJ5.isUndefinedCodePoint = function(A) {
    return A >= 64976 && A <= 65007 || CJ5.indexOf(A) > -1
  }
})
// @from(Start 9600622, End 9604878)
R21 = z((JkG, A72) => {
  A72.exports = {
    controlCharacterInInputStream: "control-character-in-input-stream",
    noncharacterInInputStream: "noncharacter-in-input-stream",
    surrogateInInputStream: "surrogate-in-input-stream",
    nonVoidHtmlElementStartTagWithTrailingSolidus: "non-void-html-element-start-tag-with-trailing-solidus",
    endTagWithAttributes: "end-tag-with-attributes",
    endTagWithTrailingSolidus: "end-tag-with-trailing-solidus",
    unexpectedSolidusInTag: "unexpected-solidus-in-tag",
    unexpectedNullCharacter: "unexpected-null-character",
    unexpectedQuestionMarkInsteadOfTagName: "unexpected-question-mark-instead-of-tag-name",
    invalidFirstCharacterOfTagName: "invalid-first-character-of-tag-name",
    unexpectedEqualsSignBeforeAttributeName: "unexpected-equals-sign-before-attribute-name",
    missingEndTagName: "missing-end-tag-name",
    unexpectedCharacterInAttributeName: "unexpected-character-in-attribute-name",
    unknownNamedCharacterReference: "unknown-named-character-reference",
    missingSemicolonAfterCharacterReference: "missing-semicolon-after-character-reference",
    unexpectedCharacterAfterDoctypeSystemIdentifier: "unexpected-character-after-doctype-system-identifier",
    unexpectedCharacterInUnquotedAttributeValue: "unexpected-character-in-unquoted-attribute-value",
    eofBeforeTagName: "eof-before-tag-name",
    eofInTag: "eof-in-tag",
    missingAttributeValue: "missing-attribute-value",
    missingWhitespaceBetweenAttributes: "missing-whitespace-between-attributes",
    missingWhitespaceAfterDoctypePublicKeyword: "missing-whitespace-after-doctype-public-keyword",
    missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers: "missing-whitespace-between-doctype-public-and-system-identifiers",
    missingWhitespaceAfterDoctypeSystemKeyword: "missing-whitespace-after-doctype-system-keyword",
    missingQuoteBeforeDoctypePublicIdentifier: "missing-quote-before-doctype-public-identifier",
    missingQuoteBeforeDoctypeSystemIdentifier: "missing-quote-before-doctype-system-identifier",
    missingDoctypePublicIdentifier: "missing-doctype-public-identifier",
    missingDoctypeSystemIdentifier: "missing-doctype-system-identifier",
    abruptDoctypePublicIdentifier: "abrupt-doctype-public-identifier",
    abruptDoctypeSystemIdentifier: "abrupt-doctype-system-identifier",
    cdataInHtmlContent: "cdata-in-html-content",
    incorrectlyOpenedComment: "incorrectly-opened-comment",
    eofInScriptHtmlCommentLikeText: "eof-in-script-html-comment-like-text",
    eofInDoctype: "eof-in-doctype",
    nestedComment: "nested-comment",
    abruptClosingOfEmptyComment: "abrupt-closing-of-empty-comment",
    eofInComment: "eof-in-comment",
    incorrectlyClosedComment: "incorrectly-closed-comment",
    eofInCdata: "eof-in-cdata",
    absenceOfDigitsInNumericCharacterReference: "absence-of-digits-in-numeric-character-reference",
    nullCharacterReference: "null-character-reference",
    surrogateCharacterReference: "surrogate-character-reference",
    characterReferenceOutsideUnicodeRange: "character-reference-outside-unicode-range",
    controlCharacterReference: "control-character-reference",
    noncharacterCharacterReference: "noncharacter-character-reference",
    missingWhitespaceBeforeDoctypeName: "missing-whitespace-before-doctype-name",
    missingDoctypeName: "missing-doctype-name",
    invalidCharacterSequenceAfterDoctypeName: "invalid-character-sequence-after-doctype-name",
    duplicateAttribute: "duplicate-attribute",
    nonConformingDoctype: "non-conforming-doctype",
    missingDoctype: "missing-doctype",
    misplacedDoctype: "misplaced-doctype",
    endTagWithoutMatchingOpenElement: "end-tag-without-matching-open-element",
    closingOfElementWithOpenChildElements: "closing-of-element-with-open-child-elements",
    disallowedContentInNoscriptInHead: "disallowed-content-in-noscript-in-head",
    openElementsLeftAfterEof: "open-elements-left-after-eof",
    abandonedHeadElementChild: "abandoned-head-element-child",
    misplacedStartTagForHeadElement: "misplaced-start-tag-for-head-element",
    nestedNoscriptInHead: "nested-noscript-in-head",
    eofInElementThatCanContainOnlyText: "eof-in-element-that-can-contain-only-text"
  }
})
// @from(Start 9604884, End 9607312)
G72 = z((WkG, B72) => {
  var YYA = O21(),
    i10 = R21(),
    E1A = YYA.CODE_POINTS;
  class Q72 {
    constructor() {
      this.html = null, this.pos = -1, this.lastGapPos = -1, this.lastCharPos = -1, this.gapStack = [], this.skipNextNewLine = !1, this.lastChunkWritten = !1, this.endOfChunkHit = !1, this.bufferWaterline = 65536
    }
    _err() {}
    _addGap() {
      this.gapStack.push(this.lastGapPos), this.lastGapPos = this.pos
    }
    _processSurrogate(A) {
      if (this.pos !== this.lastCharPos) {
        let Q = this.html.charCodeAt(this.pos + 1);
        if (YYA.isSurrogatePair(Q)) return this.pos++, this._addGap(), YYA.getSurrogatePairCodePoint(A, Q)
      } else if (!this.lastChunkWritten) return this.endOfChunkHit = !0, E1A.EOF;
      return this._err(i10.surrogateInInputStream), A
    }
    dropParsedChunk() {
      if (this.pos > this.bufferWaterline) this.lastCharPos -= this.pos, this.html = this.html.substring(this.pos), this.pos = 0, this.lastGapPos = -1, this.gapStack = []
    }
    write(A, Q) {
      if (this.html) this.html += A;
      else this.html = A;
      this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1, this.lastChunkWritten = Q
    }
    insertHtmlAtCurrentPos(A) {
      this.html = this.html.substring(0, this.pos + 1) + A + this.html.substring(this.pos + 1, this.html.length), this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1
    }
    advance() {
      if (this.pos++, this.pos > this.lastCharPos) return this.endOfChunkHit = !this.lastChunkWritten, E1A.EOF;
      let A = this.html.charCodeAt(this.pos);
      if (this.skipNextNewLine && A === E1A.LINE_FEED) return this.skipNextNewLine = !1, this._addGap(), this.advance();
      if (A === E1A.CARRIAGE_RETURN) return this.skipNextNewLine = !0, E1A.LINE_FEED;
      if (this.skipNextNewLine = !1, YYA.isSurrogate(A)) A = this._processSurrogate(A);
      if (!(A > 31 && A < 127 || A === E1A.LINE_FEED || A === E1A.CARRIAGE_RETURN || A > 159 && A < 64976)) this._checkForProblematicCharacters(A);
      return A
    }
    _checkForProblematicCharacters(A) {
      if (YYA.isControlCodePoint(A)) this._err(i10.controlCharacterInInputStream);
      else if (YYA.isUndefinedCodePoint(A)) this._err(i10.noncharacterInInputStream)
    }
    retreat() {
      if (this.pos === this.lastGapPos) this.lastGapPos = this.gapStack.pop(), this.pos--;
      this.pos--
    }
  }
  B72.exports = Q72
})