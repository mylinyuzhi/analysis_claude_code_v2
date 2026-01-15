
// @from(Ln 350992, Col 4)
ybA = U((t0Y, Bh2) => {
  Bh2.exports = Qh2;
  var ef2 = dW1(),
    Ah2 = pW1(),
    oc5 = sW1(),
    tW1 = BD(),
    rc5 = _W1();

  function Qh2(A) {
    this.contextObject = A
  }
  var sc5 = {
    xml: {
      "": !0,
      "1.0": !0,
      "2.0": !0
    },
    core: {
      "": !0,
      "2.0": !0
    },
    html: {
      "": !0,
      "1.0": !0,
      "2.0": !0
    },
    xhtml: {
      "": !0,
      "1.0": !0,
      "2.0": !0
    }
  };
  Qh2.prototype = {
    hasFeature: function (Q, B) {
      var G = sc5[(Q || "").toLowerCase()];
      return G && G[B || ""] || !1
    },
    createDocumentType: function (Q, B, G) {
      if (!rc5.isValidQName(Q)) tW1.InvalidCharacterError();
      return new Ah2(this.contextObject, Q, B, G)
    },
    createDocument: function (Q, B, G) {
      var Z = new ef2(!1, null),
        Y;
      if (B) Y = Z.createElementNS(Q, B);
      else Y = null;
      if (G) Z.appendChild(G);
      if (Y) Z.appendChild(Y);
      if (Q === tW1.NAMESPACE.HTML) Z._contentType = "application/xhtml+xml";
      else if (Q === tW1.NAMESPACE.SVG) Z._contentType = "image/svg+xml";
      else Z._contentType = "application/xml";
      return Z
    },
    createHTMLDocument: function (Q) {
      var B = new ef2(!0, null);
      B.appendChild(new Ah2(B, "html"));
      var G = B.createElement("html");
      B.appendChild(G);
      var Z = B.createElement("head");
      if (G.appendChild(Z), Q !== void 0) {
        var Y = B.createElement("title");
        Z.appendChild(Y), Y.appendChild(B.createTextNode(Q))
      }
      return G.appendChild(B.createElement("body")), B.modclock = 1, B
    },
    mozSetOutputMutationHandler: function (A, Q) {
      A.mutationHandler = Q
    },
    mozGetInputMutationHandler: function (A) {
      tW1.nyi()
    },
    mozHTMLParser: oc5
  }
})
// @from(Ln 351066, Col 4)
Zh2 = U((e0Y, Gh2) => {
  var tc5 = fW1(),
    ec5 = tC0();
  Gh2.exports = VU0;

  function VU0(A, Q) {
    this._window = A, this._href = Q
  }
  VU0.prototype = Object.create(ec5.prototype, {
    constructor: {
      value: VU0
    },
    href: {
      get: function () {
        return this._href
      },
      set: function (A) {
        this.assign(A)
      }
    },
    assign: {
      value: function (A) {
        var Q = new tc5(this._href),
          B = Q.resolve(A);
        this._href = B
      }
    },
    replace: {
      value: function (A) {
        this.assign(A)
      }
    },
    reload: {
      value: function () {
        this.assign(this.href)
      }
    },
    toString: {
      value: function () {
        return this.href
      }
    }
  })
})
// @from(Ln 351110, Col 4)
Jh2 = U((AQY, Yh2) => {
  var Ap5 = Object.create(null, {
    appCodeName: {
      value: "Mozilla"
    },
    appName: {
      value: "Netscape"
    },
    appVersion: {
      value: "4.0"
    },
    platform: {
      value: ""
    },
    product: {
      value: "Gecko"
    },
    productSub: {
      value: "20100101"
    },
    userAgent: {
      value: ""
    },
    vendor: {
      value: ""
    },
    vendorSub: {
      value: ""
    },
    taintEnabled: {
      value: function () {
        return !1
      }
    }
  });
  Yh2.exports = Ap5
})
// @from(Ln 351147, Col 4)
Ih2 = U((QQY, Xh2) => {
  var Qp5 = {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  Xh2.exports = Qp5
})
// @from(Ln 351156, Col 4)
HU0 = U((vbA, Dh2) => {
  var FU0 = BD();
  vbA = Dh2.exports = {
    CSSStyleDeclaration: hW1(),
    CharacterData: ObA(),
    Comment: hC0(),
    DOMException: wW1(),
    DOMImplementation: ybA(),
    DOMTokenList: NC0(),
    Document: dW1(),
    DocumentFragment: uC0(),
    DocumentType: pW1(),
    Element: hHA(),
    HTMLParser: sW1(),
    NamedNodeMap: _C0(),
    Node: ME(),
    NodeList: p6A(),
    NodeFilter: jbA(),
    ProcessingInstruction: dC0(),
    Text: bC0(),
    Window: EU0()
  };
  FU0.merge(vbA, sC0());
  FU0.merge(vbA, uW1().elements);
  FU0.merge(vbA, GU0().elements)
})
// @from(Ln 351182, Col 4)
EU0 = U((BQY, Wh2) => {
  var Bp5 = ybA(),
    Gp5 = YC0(),
    Zp5 = Zh2(),
    kbA = BD();
  Wh2.exports = eW1;

  function eW1(A) {
    this.document = A || new Bp5(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new Zp5(this, this.document._address || "about:blank")
  }
  eW1.prototype = Object.create(Gp5.prototype, {
    console: {
      value: console
    },
    history: {
      value: {
        back: kbA.nyi,
        forward: kbA.nyi,
        go: kbA.nyi
      }
    },
    navigator: {
      value: Jh2()
    },
    window: {
      get: function () {
        return this
      }
    },
    self: {
      get: function () {
        return this
      }
    },
    frames: {
      get: function () {
        return this
      }
    },
    parent: {
      get: function () {
        return this
      }
    },
    top: {
      get: function () {
        return this
      }
    },
    length: {
      value: 0
    },
    frameElement: {
      value: null
    },
    opener: {
      value: null
    },
    onload: {
      get: function () {
        return this._getEventHandler("load")
      },
      set: function (A) {
        this._setEventHandler("load", A)
      }
    },
    getComputedStyle: {
      value: function (Q) {
        return Q.style
      }
    }
  });
  kbA.expose(Ih2(), eW1);
  kbA.expose(HU0(), eW1)
})
// @from(Ln 351257, Col 4)
Eh2 = U((Yp5) => {
  var Kh2 = ybA(),
    Vh2 = sW1(),
    GQY = EU0(),
    Fh2 = HU0();
  Yp5.createDOMImplementation = function () {
    return new Kh2(null)
  };
  Yp5.createDocument = function (A, Q) {
    if (A || Q) {
      var B = new Vh2;
      return B.parse(A || "", !0), B.document()
    }
    return new Kh2(null).createHTMLDocument("")
  };
  Yp5.createIncrementalHTMLParser = function () {
    var A = new Vh2;
    return {
      write: function (Q) {
        if (Q.length > 0) A.parse(Q, !1, function () {
          return !0
        })
      },
      end: function (Q) {
        A.parse(Q || "", !0, function () {
          return !0
        })
      },
      process: function (Q) {
        return A.parse("", !1, Q)
      },
      document: function () {
        return A.document()
      }
    }
  };
  Yp5.createWindow = function (A, Q) {
    var B = Yp5.createDocument(A);
    if (Q !== void 0) B._address = Q;
    return new Fh2.Window(B)
  };
  Yp5.impl = Fh2
})
// @from(Ln 351300, Col 4)
_h2 = U((YQY, Rh2) => {
  function Wp5(A) {
    for (var Q = 1; Q < arguments.length; Q++) {
      var B = arguments[Q];
      for (var G in B)
        if (B.hasOwnProperty(G)) A[G] = B[G]
    }
    return A
  }

  function UU0(A, Q) {
    return Array(Q + 1).join(A)
  }

  function Kp5(A) {
    return A.replace(/^\n*/, "")
  }

  function Vp5(A) {
    var Q = A.length;
    while (Q > 0 && A[Q - 1] === `
`) Q--;
    return A.substring(0, Q)
  }
  var Fp5 = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];

  function qU0(A) {
    return NU0(A, Fp5)
  }
  var Ch2 = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

  function Uh2(A) {
    return NU0(A, Ch2)
  }

  function Hp5(A) {
    return Nh2(A, Ch2)
  }
  var qh2 = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];

  function Ep5(A) {
    return NU0(A, qh2)
  }

  function zp5(A) {
    return Nh2(A, qh2)
  }

  function NU0(A, Q) {
    return Q.indexOf(A.nodeName) >= 0
  }

  function Nh2(A, Q) {
    return A.getElementsByTagName && Q.some(function (B) {
      return A.getElementsByTagName(B).length
    })
  }
  var K$ = {};
  K$.paragraph = {
    filter: "p",
    replacement: function (A) {
      return `

` + A + `

`
    }
  };
  K$.lineBreak = {
    filter: "br",
    replacement: function (A, Q, B) {
      return B.br + `
`
    }
  };
  K$.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (A, Q, B) {
      var G = Number(Q.nodeName.charAt(1));
      if (B.headingStyle === "setext" && G < 3) {
        var Z = UU0(G === 1 ? "=" : "-", A.length);
        return `

` + A + `
` + Z + `

`
      } else return `

` + UU0("#", G) + " " + A + `

`
    }
  };
  K$.blockquote = {
    filter: "blockquote",
    replacement: function (A) {
      return A = A.replace(/^\n+|\n+$/g, ""), A = A.replace(/^/gm, "> "), `

` + A + `

`
    }
  };
  K$.list = {
    filter: ["ul", "ol"],
    replacement: function (A, Q) {
      var B = Q.parentNode;
      if (B.nodeName === "LI" && B.lastElementChild === Q) return `
` + A;
      else return `

` + A + `

`
    }
  };
  K$.listItem = {
    filter: "li",
    replacement: function (A, Q, B) {
      A = A.replace(/^\n+/, "").replace(/\n+$/, `
`).replace(/\n/gm, `
    `);
      var G = B.bulletListMarker + "   ",
        Z = Q.parentNode;
      if (Z.nodeName === "OL") {
        var Y = Z.getAttribute("start"),
          J = Array.prototype.indexOf.call(Z.children, Q);
        G = (Y ? Number(Y) + J : J + 1) + ".  "
      }
      return G + A + (Q.nextSibling && !/\n$/.test(A) ? `
` : "")
    }
  };
  K$.indentedCodeBlock = {
    filter: function (A, Q) {
      return Q.codeBlockStyle === "indented" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
    },
    replacement: function (A, Q, B) {
      return `

    ` + Q.firstChild.textContent.replace(/\n/g, `
    `) + `

`
    }
  };
  K$.fencedCodeBlock = {
    filter: function (A, Q) {
      return Q.codeBlockStyle === "fenced" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
    },
    replacement: function (A, Q, B) {
      var G = Q.firstChild.getAttribute("class") || "",
        Z = (G.match(/language-(\S+)/) || [null, ""])[1],
        Y = Q.firstChild.textContent,
        J = B.fence.charAt(0),
        X = 3,
        I = new RegExp("^" + J + "{3,}", "gm"),
        D;
      while (D = I.exec(Y))
        if (D[0].length >= X) X = D[0].length + 1;
      var W = UU0(J, X);
      return `

` + W + Z + `
` + Y.replace(/\n$/, "") + `
` + W + `

`
    }
  };
  K$.horizontalRule = {
    filter: "hr",
    replacement: function (A, Q, B) {
      return `

` + B.hr + `

`
    }
  };
  K$.inlineLink = {
    filter: function (A, Q) {
      return Q.linkStyle === "inlined" && A.nodeName === "A" && A.getAttribute("href")
    },
    replacement: function (A, Q) {
      var B = Q.getAttribute("href");
      if (B) B = B.replace(/([()])/g, "\\$1");
      var G = AK1(Q.getAttribute("title"));
      if (G) G = ' "' + G.replace(/"/g, "\\\"") + '"';
      return "[" + A + "](" + B + G + ")"
    }
  };
  K$.referenceLink = {
    filter: function (A, Q) {
      return Q.linkStyle === "referenced" && A.nodeName === "A" && A.getAttribute("href")
    },
    replacement: function (A, Q, B) {
      var G = Q.getAttribute("href"),
        Z = AK1(Q.getAttribute("title"));
      if (Z) Z = ' "' + Z + '"';
      var Y, J;
      switch (B.linkReferenceStyle) {
        case "collapsed":
          Y = "[" + A + "][]", J = "[" + A + "]: " + G + Z;
          break;
        case "shortcut":
          Y = "[" + A + "]", J = "[" + A + "]: " + G + Z;
          break;
        default:
          var X = this.references.length + 1;
          Y = "[" + A + "][" + X + "]", J = "[" + X + "]: " + G + Z
      }
      return this.references.push(J), Y
    },
    references: [],
    append: function (A) {
      var Q = "";
      if (this.references.length) Q = `

` + this.references.join(`
`) + `

`, this.references = [];
      return Q
    }
  };
  K$.emphasis = {
    filter: ["em", "i"],
    replacement: function (A, Q, B) {
      if (!A.trim()) return "";
      return B.emDelimiter + A + B.emDelimiter
    }
  };
  K$.strong = {
    filter: ["strong", "b"],
    replacement: function (A, Q, B) {
      if (!A.trim()) return "";
      return B.strongDelimiter + A + B.strongDelimiter
    }
  };
  K$.code = {
    filter: function (A) {
      var Q = A.previousSibling || A.nextSibling,
        B = A.parentNode.nodeName === "PRE" && !Q;
      return A.nodeName === "CODE" && !B
    },
    replacement: function (A) {
      if (!A) return "";
      A = A.replace(/\r?\n|\r/g, " ");
      var Q = /^`|^ .*?[^ ].* $|`$/.test(A) ? " " : "",
        B = "`",
        G = A.match(/`+/gm) || [];
      while (G.indexOf(B) !== -1) B = B + "`";
      return B + Q + A + Q + B
    }
  };
  K$.image = {
    filter: "img",
    replacement: function (A, Q) {
      var B = AK1(Q.getAttribute("alt")),
        G = Q.getAttribute("src") || "",
        Z = AK1(Q.getAttribute("title")),
        Y = Z ? ' "' + Z + '"' : "";
      return G ? "![" + B + "](" + G + Y + ")" : ""
    }
  };

  function AK1(A) {
    return A ? A.replace(/(\n+\s*)+/g, `
`) : ""
  }

  function wh2(A) {
    this.options = A, this._keep = [], this._remove = [], this.blankRule = {
      replacement: A.blankReplacement
    }, this.keepReplacement = A.keepReplacement, this.defaultRule = {
      replacement: A.defaultReplacement
    }, this.array = [];
    for (var Q in A.rules) this.array.push(A.rules[Q])
  }
  wh2.prototype = {
    add: function (A, Q) {
      this.array.unshift(Q)
    },
    keep: function (A) {
      this._keep.unshift({
        filter: A,
        replacement: this.keepReplacement
      })
    },
    remove: function (A) {
      this._remove.unshift({
        filter: A,
        replacement: function () {
          return ""
        }
      })
    },
    forNode: function (A) {
      if (A.isBlank) return this.blankRule;
      var Q;
      if (Q = zU0(this.array, A, this.options)) return Q;
      if (Q = zU0(this._keep, A, this.options)) return Q;
      if (Q = zU0(this._remove, A, this.options)) return Q;
      return this.defaultRule
    },
    forEach: function (A) {
      for (var Q = 0; Q < this.array.length; Q++) A(this.array[Q], Q)
    }
  };

  function zU0(A, Q, B) {
    for (var G = 0; G < A.length; G++) {
      var Z = A[G];
      if ($p5(Z, Q, B)) return Z
    }
    return
  }

  function $p5(A, Q, B) {
    var G = A.filter;
    if (typeof G === "string") {
      if (G === Q.nodeName.toLowerCase()) return !0
    } else if (Array.isArray(G)) {
      if (G.indexOf(Q.nodeName.toLowerCase()) > -1) return !0
    } else if (typeof G === "function") {
      if (G.call(A, Q, B)) return !0
    } else throw TypeError("`filter` needs to be a string, array, or function")
  }

  function Cp5(A) {
    var {
      element: Q,
      isBlock: B,
      isVoid: G
    } = A, Z = A.isPre || function (K) {
      return K.nodeName === "PRE"
    };
    if (!Q.firstChild || Z(Q)) return;
    var Y = null,
      J = !1,
      X = null,
      I = zh2(X, Q, Z);
    while (I !== Q) {
      if (I.nodeType === 3 || I.nodeType === 4) {
        var D = I.data.replace(/[ \r\n\t]+/g, " ");
        if ((!Y || / $/.test(Y.data)) && !J && D[0] === " ") D = D.substr(1);
        if (!D) {
          I = $U0(I);
          continue
        }
        I.data = D, Y = I
      } else if (I.nodeType === 1) {
        if (B(I) || I.nodeName === "BR") {
          if (Y) Y.data = Y.data.replace(/ $/, "");
          Y = null, J = !1
        } else if (G(I) || Z(I)) Y = null, J = !0;
        else if (Y) J = !1
      } else {
        I = $U0(I);
        continue
      }
      var W = zh2(X, I, Z);
      X = I, I = W
    }
    if (Y) {
      if (Y.data = Y.data.replace(/ $/, ""), !Y.data) $U0(Y)
    }
  }

  function $U0(A) {
    var Q = A.nextSibling || A.parentNode;
    return A.parentNode.removeChild(A), Q
  }

  function zh2(A, Q, B) {
    if (A && A.parentNode === Q || B(Q)) return Q.nextSibling || Q.parentNode;
    return Q.firstChild || Q.nextSibling || Q.parentNode
  }
  var Lh2 = typeof window < "u" ? window : {};

  function Up5() {
    var A = Lh2.DOMParser,
      Q = !1;
    try {
      if (new A().parseFromString("", "text/html")) Q = !0
    } catch (B) {}
    return Q
  }

  function qp5() {
    var A = function () {};
    {
      var Q = Eh2();
      A.prototype.parseFromString = function (B) {
        return Q.createDocument(B)
      }
    }
    return A
  }
  var Np5 = Up5() ? Lh2.DOMParser : qp5();

  function wp5(A, Q) {
    var B;
    if (typeof A === "string") {
      var G = Lp5().parseFromString('<x-turndown id="turndown-root">' + A + "</x-turndown>", "text/html");
      B = G.getElementById("turndown-root")
    } else B = A.cloneNode(!0);
    return Cp5({
      element: B,
      isBlock: qU0,
      isVoid: Uh2,
      isPre: Q.preformattedCode ? Op5 : null
    }), B
  }
  var CU0;

  function Lp5() {
    return CU0 = CU0 || new Np5, CU0
  }

  function Op5(A) {
    return A.nodeName === "PRE" || A.nodeName === "CODE"
  }

  function Mp5(A, Q) {
    return A.isBlock = qU0(A), A.isCode = A.nodeName === "CODE" || A.parentNode.isCode, A.isBlank = Rp5(A), A.flankingWhitespace = _p5(A, Q), A
  }

  function Rp5(A) {
    return !Uh2(A) && !Ep5(A) && /^\s*$/i.test(A.textContent) && !Hp5(A) && !zp5(A)
  }

  function _p5(A, Q) {
    if (A.isBlock || Q.preformattedCode && A.isCode) return {
      leading: "",
      trailing: ""
    };
    var B = jp5(A.textContent);
    if (B.leadingAscii && $h2("left", A, Q)) B.leading = B.leadingNonAscii;
    if (B.trailingAscii && $h2("right", A, Q)) B.trailing = B.trailingNonAscii;
    return {
      leading: B.leading,
      trailing: B.trailing
    }
  }

  function jp5(A) {
    var Q = A.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
    return {
      leading: Q[1],
      leadingAscii: Q[2],
      leadingNonAscii: Q[3],
      trailing: Q[4],
      trailingNonAscii: Q[5],
      trailingAscii: Q[6]
    }
  }

  function $h2(A, Q, B) {
    var G, Z, Y;
    if (A === "left") G = Q.previousSibling, Z = / $/;
    else G = Q.nextSibling, Z = /^ /;
    if (G) {
      if (G.nodeType === 3) Y = Z.test(G.nodeValue);
      else if (B.preformattedCode && G.nodeName === "CODE") Y = !1;
      else if (G.nodeType === 1 && !qU0(G)) Y = Z.test(G.textContent)
    }
    return Y
  }
  var Tp5 = Array.prototype.reduce,
    Pp5 = [
      [/\\/g, "\\\\"],
      [/\*/g, "\\*"],
      [/^-/g, "\\-"],
      [/^\+ /g, "\\+ "],
      [/^(=+)/g, "\\$1"],
      [/^(#{1,6}) /g, "\\$1 "],
      [/`/g, "\\`"],
      [/^~~~/g, "\\~~~"],
      [/\[/g, "\\["],
      [/\]/g, "\\]"],
      [/^>/g, "\\>"],
      [/_/g, "\\_"],
      [/^(\d+)\. /g, "$1\\. "]
    ];

  function QK1(A) {
    if (!(this instanceof QK1)) return new QK1(A);
    var Q = {
      rules: K$,
      headingStyle: "setext",
      hr: "* * *",
      bulletListMarker: "*",
      codeBlockStyle: "indented",
      fence: "```",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
      br: "  ",
      preformattedCode: !1,
      blankReplacement: function (B, G) {
        return G.isBlock ? `

` : ""
      },
      keepReplacement: function (B, G) {
        return G.isBlock ? `

` + G.outerHTML + `

` : G.outerHTML
      },
      defaultReplacement: function (B, G) {
        return G.isBlock ? `

` + B + `

` : B
      }
    };
    this.options = Wp5({}, Q, A), this.rules = new wh2(this.options)
  }
  QK1.prototype = {
    turndown: function (A) {
      if (!yp5(A)) throw TypeError(A + " is not a string, or an element/document/fragment node.");
      if (A === "") return "";
      var Q = Oh2.call(this, new wp5(A, this.options));
      return Sp5.call(this, Q)
    },
    use: function (A) {
      if (Array.isArray(A))
        for (var Q = 0; Q < A.length; Q++) this.use(A[Q]);
      else if (typeof A === "function") A(this);
      else throw TypeError("plugin must be a Function or an Array of Functions");
      return this
    },
    addRule: function (A, Q) {
      return this.rules.add(A, Q), this
    },
    keep: function (A) {
      return this.rules.keep(A), this
    },
    remove: function (A) {
      return this.rules.remove(A), this
    },
    escape: function (A) {
      return Pp5.reduce(function (Q, B) {
        return Q.replace(B[0], B[1])
      }, A)
    }
  };

  function Oh2(A) {
    var Q = this;
    return Tp5.call(A.childNodes, function (B, G) {
      G = new Mp5(G, Q.options);
      var Z = "";
      if (G.nodeType === 3) Z = G.isCode ? G.nodeValue : Q.escape(G.nodeValue);
      else if (G.nodeType === 1) Z = xp5.call(Q, G);
      return Mh2(B, Z)
    }, "")
  }

  function Sp5(A) {
    var Q = this;
    return this.rules.forEach(function (B) {
      if (typeof B.append === "function") A = Mh2(A, B.append(Q.options))
    }), A.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
  }

  function xp5(A) {
    var Q = this.rules.forNode(A),
      B = Oh2.call(this, A),
      G = A.flankingWhitespace;
    if (G.leading || G.trailing) B = B.trim();
    return G.leading + Q.replacement(B, A, this.options) + G.trailing
  }

  function Mh2(A, Q) {
    var B = Vp5(A),
      G = Kp5(Q),
      Z = Math.max(A.length - B.length, Q.length - G.length),
      Y = `

`.substring(0, Z);
    return B + Y + G
  }

  function yp5(A) {
    return A != null && (typeof A === "string" || A.nodeType && (A.nodeType === 1 || A.nodeType === 9 || A.nodeType === 11))
  }
  Rh2.exports = QK1
})
// @from(Ln 351896, Col 4)
BK1
// @from(Ln 351897, Col 4)
wU0 = w(() => {
  BK1 = new Set(["platform.claude.com", "code.claude.com", "modelcontextprotocol.io", "github.com/anthropics", "agentskills.io", "docs.python.org", "en.cppreference.com", "docs.oracle.com", "learn.microsoft.com", "developer.mozilla.org", "go.dev", "pkg.go.dev", "www.php.net", "docs.swift.org", "kotlinlang.org", "ruby-doc.org", "doc.rust-lang.org", "www.typescriptlang.org", "react.dev", "angular.io", "vuejs.org", "nextjs.org", "expressjs.com", "nodejs.org", "bun.sh", "jquery.com", "getbootstrap.com", "tailwindcss.com", "d3js.org", "threejs.org", "redux.js.org", "webpack.js.org", "jestjs.io", "reactrouter.com", "docs.djangoproject.com", "flask.palletsprojects.com", "fastapi.tiangolo.com", "pandas.pydata.org", "numpy.org", "www.tensorflow.org", "pytorch.org", "scikit-learn.org", "matplotlib.org", "requests.readthedocs.io", "jupyter.org", "laravel.com", "symfony.com", "wordpress.org", "docs.spring.io", "hibernate.org", "tomcat.apache.org", "gradle.org", "maven.apache.org", "asp.net", "dotnet.microsoft.com", "nuget.org", "blazor.net", "reactnative.dev", "docs.flutter.dev", "developer.apple.com", "developer.android.com", "keras.io", "spark.apache.org", "huggingface.co", "www.kaggle.com", "www.mongodb.com", "redis.io", "www.postgresql.org", "dev.mysql.com", "www.sqlite.org", "graphql.org", "prisma.io", "docs.aws.amazon.com", "cloud.google.com", "learn.microsoft.com", "kubernetes.io", "www.docker.com", "www.terraform.io", "www.ansible.com", "vercel.com/docs", "docs.netlify.com", "devcenter.heroku.com/", "cypress.io", "selenium.dev", "docs.unity.com", "docs.unrealengine.com", "git-scm.com", "nginx.org", "httpd.apache.org"])
})
// @from(Ln 351901, Col 0)
function Sh2(A) {
  try {
    let Q = new URL(A),
      B = Q.hostname,
      G = Q.pathname;
    for (let Z of BK1)
      if (Z.includes("/")) {
        let [Y, ...J] = Z.split("/"), X = "/" + J.join("/");
        if (B === Y && G.startsWith(X)) return !0
      } else if (B === Z) return !0;
    return !1
  } catch {
    return !1
  }
}
// @from(Ln 351917, Col 0)
function hp5(A) {
  if (A.length > bp5) return !1;
  let Q;
  try {
    Q = new URL(A)
  } catch {
    return !1
  }
  if (Q.username || Q.password) return !1;
  if (Q.hostname.split(".").length < 2) return !1;
  return !0
}
// @from(Ln 351929, Col 0)
async function gp5(A) {
  try {
    let Q = await xQ.get(`https://claude.ai/api/web/domain_info?domain=${encodeURIComponent(A)}`);
    if (Q.status === 200) return Q.data.can_fetch === !0 ? {
      status: "allowed"
    } : {
      status: "blocked"
    };
    return {
      status: "check_failed",
      error: Error(`Domain check returned status ${Q.status}`)
    }
  } catch (Q) {
    return e(Q), {
      status: "check_failed",
      error: Q
    }
  }
}
// @from(Ln 351949, Col 0)
function up5(A, Q) {
  try {
    let B = new URL(A),
      G = new URL(Q);
    if (G.protocol !== B.protocol) return !1;
    if (G.port !== B.port) return !1;
    if (G.username || G.password) return !1;
    let Z = (X) => X.replace(/^www\./, ""),
      Y = Z(B.hostname),
      J = Z(G.hostname);
    return Y === J
  } catch (B) {
    return !1
  }
}
// @from(Ln 351964, Col 0)
async function xh2(A, Q, B) {
  try {
    return await xQ.get(A, {
      signal: Q,
      maxRedirects: 0,
      responseType: "arraybuffer",
      maxContentLength: fp5,
      headers: {
        Accept: "text/markdown, text/html, */*"
      }
    })
  } catch (G) {
    if (xQ.isAxiosError(G) && G.response && [301, 302, 307, 308].includes(G.response.status)) {
      let Z = G.response.headers.location;
      if (!Z) throw Error("Redirect missing Location header");
      let Y = new URL(Z, A).toString();
      if (B(A, Y)) return xh2(Y, Q, B);
      else return {
        type: "redirect",
        originalUrl: A,
        redirectUrl: Y,
        statusCode: G.response.status
      }
    }
    throw G
  }
}
// @from(Ln 351992, Col 0)
function mp5(A) {
  return "type" in A && A.type === "redirect"
}
// @from(Ln 351995, Col 0)
async function yh2(A, Q) {
  if (!hp5(A)) throw Error("Invalid URL");
  let B = jh2.get(A);
  if (B) return {
    bytes: B.bytes,
    code: B.code,
    codeText: B.codeText,
    content: B.content,
    contentType: B.contentType
  };
  let G, Z = A;
  try {
    if (G = new URL(A), G.protocol === "http:") G.protocol = "https:", Z = G.toString();
    let W = G.hostname;
    if (!jQ().skipWebFetchPreflight) switch ((await gp5(W)).status) {
      case "allowed":
        break;
      case "blocked":
        throw new LU0(W);
      case "check_failed":
        throw new OU0(W)
    }
  } catch (W) {
    if (e(W), W instanceof LU0 || W instanceof OU0) throw W
  }
  let Y = await xh2(Z, Q.signal, up5);
  if (mp5(Y)) return Y;
  let J = Buffer.from(Y.data).toString("utf-8"),
    X = Y.headers["content-type"] ?? "",
    I = Buffer.byteLength(J),
    D;
  if (X.includes("text/html")) D = new Th2.default().turndown(J);
  else D = J;
  return jh2.set(A, {
    bytes: I,
    code: Y.status,
    codeText: Y.statusText,
    content: D,
    contentType: X
  }), {
    code: Y.status,
    codeText: Y.statusText,
    content: D,
    contentType: X,
    bytes: I
  }
}
// @from(Ln 352042, Col 0)
async function vh2(A, Q, B, G, Z) {
  let Y = jEB(Q, A, Z),
    J = await CF({
      systemPrompt: [],
      userPrompt: Y,
      signal: B,
      options: {
        querySource: "web_fetch_apply",
        agents: [],
        isNonInteractiveSession: G,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    });
  if (B.aborted) throw new aG;
  let {
    content: X
  } = J.message;
  if (X.length > 0) {
    let I = X[0];
    if ("text" in I) return I.text
  }
  return "No response from model"
}
// @from(Ln 352066, Col 4)
Th2
// @from(Ln 352066, Col 9)
LU0
// @from(Ln 352066, Col 14)
OU0
// @from(Ln 352066, Col 19)
vp5 = 900000
// @from(Ln 352067, Col 2)
kp5 = 52428800
// @from(Ln 352068, Col 2)
jh2
// @from(Ln 352068, Col 7)
bp5 = 2000
// @from(Ln 352069, Col 2)
fp5 = 10485760
// @from(Ln 352070, Col 2)
Ph2 = 1e5
// @from(Ln 352071, Col 4)
kh2 = w(() => {
  j5();
  eqA();
  nY();
  Z0();
  XX();
  v1();
  GB();
  wU0();
  Th2 = c(_h2(), 1);
  LU0 = class LU0 extends Error {
    constructor(A) {
      super(`Claude Code is unable to fetch from ${A}`);
      this.name = "DomainBlockedError"
    }
  };
  OU0 = class OU0 extends Error {
    constructor(A) {
      super(`Unable to verify if domain ${A} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
      this.name = "DomainCheckFailedError"
    }
  };
  jh2 = new jT({
    maxSize: kp5,
    sizeCalculation: (A) => Buffer.byteLength(A.content),
    ttl: vp5
  })
})
// @from(Ln 352100, Col 0)
function bh2({
  url: A,
  prompt: Q
}, {
  verbose: B
}) {
  if (!A) return null;
  if (B) return `url: "${A}"${B&&Q?`, prompt: "${Q}"`:""}`;
  return A
}
// @from(Ln 352111, Col 0)
function fh2() {
  return Qw.default.createElement(w7, null)
}
// @from(Ln 352115, Col 0)
function hh2(A, {
  verbose: Q
}) {
  return Qw.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 352124, Col 0)
function gh2() {
  return Qw.default.createElement(x0, {
    height: 1
  }, Qw.default.createElement(C, {
    dimColor: !0
  }, "Fetching…"))
}
// @from(Ln 352132, Col 0)
function uh2({
  bytes: A,
  code: Q,
  codeText: B,
  result: G
}, Z, {
  verbose: Y
}) {
  let J = xD(A);
  if (Y) return Qw.default.createElement(T, {
    flexDirection: "column"
  }, Qw.default.createElement(x0, {
    height: 1
  }, Qw.default.createElement(C, null, "Received ", Qw.default.createElement(C, {
    bold: !0
  }, J), " (", Q, " ", B, ")")), Qw.default.createElement(T, {
    flexDirection: "column"
  }, Qw.default.createElement(C, null, G)));
  return Qw.default.createElement(x0, {
    height: 1
  }, Qw.default.createElement(C, null, "Received ", Qw.default.createElement(C, {
    bold: !0
  }, J), " (", Q, " ", B, ")"))
}
// @from(Ln 352157, Col 0)
function mh2(A) {
  if (!A?.url) return null;
  return YG(A.url, Mb)
}
// @from(Ln 352161, Col 4)
Qw
// @from(Ln 352162, Col 4)
dh2 = w(() => {
  fA();
  c4();
  tH();
  eW();
  y9();
  Qw = c(QA(), 1)
})
// @from(Ln 352171, Col 0)
function pp5(A) {
  try {
    let Q = hF.inputSchema.safeParse(A);
    if (!Q.success) return `input:${A.toString()}`;
    let {
      url: B
    } = Q.data;
    return `domain:${new URL(B).hostname}`
  } catch {
    return `input:${A.toString()}`
  }
}
// @from(Ln 352183, Col 4)
dp5
// @from(Ln 352183, Col 9)
cp5
// @from(Ln 352183, Col 14)
hF
// @from(Ln 352184, Col 4)
iHA = w(() => {
  j9();
  kh2();
  YZ();
  wU0();
  dh2();
  dp5 = m.strictObject({
    url: m.string().url().describe("The URL to fetch content from"),
    prompt: m.string().describe("The prompt to run on the fetched content")
  }), cp5 = m.object({
    bytes: m.number().describe("Size of the fetched content in bytes"),
    code: m.number().describe("HTTP response code"),
    codeText: m.string().describe("HTTP response code text"),
    result: m.string().describe("Processed result from applying the prompt to the content"),
    durationMs: m.number().describe("Time taken to fetch and process the content"),
    url: m.string().describe("The URL that was fetched")
  });
  hF = {
    name: cI,
    maxResultSizeChars: 1e5,
    async description(A) {
      let {
        url: Q
      } = A;
      try {
        return `Claude wants to fetch content from ${new URL(Q).hostname}`
      } catch {
        return "Claude wants to fetch content from this URL"
      }
    },
    userFacingName() {
      return "Fetch"
    },
    getToolUseSummary: mh2,
    isEnabled() {
      return !0
    },
    inputSchema: dp5,
    outputSchema: cp5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A, Q) {
      let G = (await Q.getAppState()).toolPermissionContext;
      try {
        let {
          url: I
        } = A, D = new URL(I), W = D.hostname, K = D.pathname;
        for (let V of BK1)
          if (V.includes("/")) {
            let [F, ...H] = V.split("/"), E = "/" + H.join("/");
            if (W === F && K.startsWith(E)) return {
              behavior: "allow",
              updatedInput: A,
              decisionReason: {
                type: "other",
                reason: "Preapproved host and path"
              }
            }
          } else if (W === V) return {
          behavior: "allow",
          updatedInput: A,
          decisionReason: {
            type: "other",
            reason: "Preapproved host"
          }
        }
      } catch {}
      let Z = pp5(A),
        Y = Bx(G, hF, "deny").get(Z);
      if (Y) return {
        behavior: "deny",
        message: `${hF.name} denied access to ${Z}.`,
        decisionReason: {
          type: "rule",
          rule: Y
        }
      };
      let J = Bx(G, hF, "ask").get(Z);
      if (J) return {
        behavior: "ask",
        message: `Claude requested permissions to use ${hF.name}, but you haven't granted it yet.`,
        decisionReason: {
          type: "rule",
          rule: J
        }
      };
      let X = Bx(G, hF, "allow").get(Z);
      if (X) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
          type: "rule",
          rule: X
        }
      };
      return {
        behavior: "ask",
        message: `Claude requested permissions to use ${hF.name}, but you haven't granted it yet.`
      }
    },
    async prompt() {
      return _EB
    },
    async validateInput(A) {
      let {
        url: Q
      } = A;
      try {
        new URL(Q)
      } catch {
        return {
          result: !1,
          message: `Error: Invalid URL "${Q}". The URL provided could not be parsed.`,
          meta: {
            reason: "invalid_url"
          },
          errorCode: 1
        }
      }
      return {
        result: !0
      }
    },
    renderToolUseMessage: bh2,
    renderToolUseRejectedMessage: fh2,
    renderToolUseErrorMessage: hh2,
    renderToolUseProgressMessage: gh2,
    renderToolResultMessage: uh2,
    async call({
      url: A,
      prompt: Q
    }, {
      abortController: B,
      options: {
        isNonInteractiveSession: G
      }
    }) {
      let Z = Date.now(),
        Y = await yh2(A, B);
      if ("type" in Y && Y.type === "redirect") {
        let H = Y.statusCode === 301 ? "Moved Permanently" : Y.statusCode === 308 ? "Permanent Redirect" : Y.statusCode === 307 ? "Temporary Redirect" : "Found",
          E = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${Y.originalUrl}
Redirect URL: ${Y.redirectUrl}
Status: ${Y.statusCode} ${H}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${Y.redirectUrl}"
- prompt: "${Q}"`;
        return {
          data: {
            bytes: Buffer.byteLength(E),
            code: Y.statusCode,
            codeText: H,
            result: E,
            durationMs: Date.now() - Z,
            url: A
          }
        }
      }
      let {
        content: J,
        bytes: X,
        code: I,
        codeText: D,
        contentType: W
      } = Y, K = Sh2(A), V;
      if (K && W.includes("text/markdown") && J.length < Ph2) V = J;
      else V = await vh2(Q, J, B.signal, G, K);
      return {
        data: {
          bytes: X,
          code: I,
          codeText: D,
          result: V,
          durationMs: Date.now() - Z,
          url: A
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      result: A
    }, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A
      }
    }
  }
})
// @from(Ln 352380, Col 4)
GK1 = "KillShell"
// @from(Ln 352381, Col 2)
ch2 = `
- Kills a running background bash shell by its ID
- Takes a shell_id parameter identifying the shell to kill
- Returns a success or failure status 
- Use this tool when you need to terminate a long-running shell
- Shell IDs can be found using the /tasks command
`
// @from(Ln 352389, Col 0)
function ph2({
  shell_id: A
}) {
  if (!A) return null;
  return `Kill shell: ${A}`
}
// @from(Ln 352396, Col 0)
function lh2() {
  return null
}
// @from(Ln 352400, Col 0)
function ih2() {
  return nHA.default.createElement(w7, null)
}
// @from(Ln 352404, Col 0)
function nh2(A, {
  verbose: Q
}) {
  return nHA.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 352413, Col 0)
function ah2(A) {
  return nHA.default.createElement(T, null, nHA.default.createElement(C, null, "  ⎿  "), nHA.default.createElement(C, null, "Shell ", A.shell_id, " killed"))
}
// @from(Ln 352416, Col 4)
nHA
// @from(Ln 352417, Col 4)
oh2 = w(() => {
  fA();
  tH();
  eW();
  nHA = c(QA(), 1)
})
// @from(Ln 352423, Col 4)
lp5
// @from(Ln 352423, Col 9)
ip5
// @from(Ln 352423, Col 14)
ZK1
// @from(Ln 352424, Col 4)
MU0 = w(() => {
  j9();
  v6A();
  oh2();
  A0();
  lp5 = m.strictObject({
    shell_id: m.string().describe("The ID of the background shell to kill")
  }), ip5 = m.object({
    message: m.string().describe("Status message about the operation"),
    shell_id: m.string().describe("The ID of the shell that was killed")
  }), ZK1 = {
    name: GK1,
    maxResultSizeChars: 1e5,
    userFacingName: () => "Kill Shell",
    inputSchema: lp5,
    outputSchema: ip5,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    async validateInput({
      shell_id: A
    }, {
      getAppState: Q
    }) {
      let G = (await Q()).tasks?.[A];
      if (!G) return {
        result: !1,
        message: `No shell found with ID: ${A}`,
        errorCode: 1
      };
      if (G.type !== "local_bash") return {
        result: !1,
        message: `Task ${A} is not a local bash task`,
        errorCode: 2
      };
      return {
        result: !0
      }
    },
    async description() {
      return "Kill a background bash shell by ID"
    },
    async prompt() {
      return ch2
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: eA(A)
      }
    },
    renderToolUseMessage: ph2,
    renderToolUseProgressMessage: lh2,
    renderToolUseRejectedMessage: ih2,
    renderToolUseErrorMessage: nh2,
    renderToolResultMessage: ah2,
    async call({
      shell_id: A
    }, {
      getAppState: Q,
      setAppState: B,
      abortController: G
    }) {
      let Y = (await Q()).tasks?.[A];
      if (!Y) throw Error(`No shell found with ID: ${A}`);
      if (Y.type !== "local_bash") throw Error(`Task ${A} is not a local bash task`);
      if (Y.status !== "running") throw Error(`Shell ${A} is not running, so cannot be killed (status: ${Y.status})`);
      return await es.kill(A, {
        abortController: G,
        getAppState: Q,
        setAppState: B
      }), {
        data: {
          message: `Successfully killed shell: ${A} (${Y.command})`,
          shell_id: A
        }
      }
    }
  }
})
// @from(Ln 352517, Col 4)
aHA = "TaskOutput"
// @from(Ln 352519, Col 0)
function np5() {
  let A = Eb0.validate(process.env.TASK_MAX_OUTPUT_LENGTH);
  if (A.status === "capped") k(`TASK_MAX_OUTPUT_LENGTH ${A.message}`);
  return A.effective
}
// @from(Ln 352525, Col 0)
function bbA(A, Q) {
  let B = np5();
  if (A.length <= B) return {
    content: A,
    wasTruncated: !1
  };
  let Z = `[Truncated. Full output: ${aY(Q)}]

`,
    Y = B - Z.length,
    J = A.slice(-Y);
  return {
    content: Z + J,
    wasTruncated: !0
  }
}
// @from(Ln 352541, Col 4)
RU0 = w(() => {
  TCA();
  cC();
  T1()
})
// @from(Ln 352547, Col 0)
function YK1(A) {
  let Q = K71(A.id),
    B = {
      task_id: A.id,
      task_type: A.type,
      status: A.status,
      description: A.description,
      output: Q
    };
  if (A.type === "local_bash") return {
    ...B,
    exitCode: A.result?.code ?? null
  };
  if (A.type === "local_agent") {
    let G = A;
    return {
      ...B,
      prompt: G.prompt,
      result: Q,
      error: G.error
    }
  }
  if (A.type === "remote_agent") return {
    ...B,
    prompt: A.command
  };
  return B
}
// @from(Ln 352575, Col 0)
async function op5(A, Q, B, G) {
  let Z = Date.now();
  while (Date.now() - Z < B) {
    if (G?.signal.aborted) throw new aG;
    let X = (await Q()).tasks?.[A];
    if (!X) return null;
    if (X.status !== "running" && X.status !== "pending") return X;
    await new Promise((I) => setTimeout(I, 100))
  }
  return (await Q()).tasks?.[A] ?? null
}
// @from(Ln 352587, Col 0)
function rp5({
  content: A,
  verbose: Q = !1,
  theme: B
}) {
  let G = J3("app:toggleTranscript", "Global", "ctrl+o"),
    Z = typeof A === "string" ? AQ(A) : A;
  if (!Z.task) return F8.default.createElement(x0, null, F8.default.createElement(C, {
    dimColor: !0
  }, "No task output available"));
  let {
    task: Y
  } = Z;
  if (Y.task_type === "local_bash") {
    let J = {
      stdout: Y.output,
      stderr: "",
      isImage: !1,
      dangerouslyDisableSandbox: !0,
      returnCodeInterpretation: Y.error
    };
    return F8.default.createElement(M6A, {
      content: J,
      verbose: Q
    })
  }
  if (Y.task_type === "local_agent") {
    let J = Y.result ? Y.result.split(`
`).length : 0;
    if (Z.retrieval_status === "success") {
      if (Q) return F8.default.createElement(T, {
        flexDirection: "column"
      }, F8.default.createElement(C, null, Y.description, " (", J, " lines)"), F8.default.createElement(T, {
        flexDirection: "column",
        paddingLeft: 2,
        marginTop: 1
      }, Y.prompt && F8.default.createElement(mkA, {
        prompt: Y.prompt,
        theme: B,
        dim: !0
      }), Y.result && F8.default.createElement(T, {
        marginTop: 1
      }, F8.default.createElement(Rz0, {
        content: [{
          type: "text",
          text: Y.result
        }],
        theme: B
      })), Y.error && F8.default.createElement(T, {
        flexDirection: "column",
        marginTop: 1
      }, F8.default.createElement(C, {
        color: "error",
        bold: !0
      }, "Error:"), F8.default.createElement(T, {
        paddingLeft: 2
      }, F8.default.createElement(C, {
        color: "error"
      }, Y.error)))));
      return F8.default.createElement(x0, null, F8.default.createElement(C, {
        dimColor: !0
      }, "Read output (", G, " to expand)"))
    }
    if (Z.retrieval_status === "timeout" || Y.status === "running") return F8.default.createElement(x0, null, F8.default.createElement(C, {
      dimColor: !0
    }, "Task is still running…"));
    if (Z.retrieval_status === "not_ready") return F8.default.createElement(x0, null, F8.default.createElement(C, {
      dimColor: !0
    }, "Task is still running…"));
    return F8.default.createElement(x0, null, F8.default.createElement(C, {
      dimColor: !0
    }, "Task not ready"))
  }
  if (Y.task_type === "remote_agent") return F8.default.createElement(T, {
    flexDirection: "column"
  }, F8.default.createElement(C, null, "  ", Y.description, " [", Y.status, "]"), Y.output && Q && F8.default.createElement(T, {
    paddingLeft: 4,
    marginTop: 1
  }, F8.default.createElement(C, null, Y.output)), !Q && Y.output && F8.default.createElement(C, {
    dimColor: !0
  }, "     ", "(", G, " to expand)"));
  return F8.default.createElement(T, {
    flexDirection: "column"
  }, F8.default.createElement(C, null, "  ", Y.description, " [", Y.status, "]"), Y.output && F8.default.createElement(T, {
    paddingLeft: 4
  }, F8.default.createElement(C, null, Y.output.slice(0, 500))))
}
// @from(Ln 352674, Col 4)
F8
// @from(Ln 352674, Col 8)
ap5
// @from(Ln 352674, Col 13)
JK1
// @from(Ln 352675, Col 4)
_U0 = w(() => {
  j9();
  fA();
  XX();
  tH();
  eW();
  c4();
  cC();
  xr();
  FD1();
  LD1();
  A0();
  RU0();
  NX();
  F8 = c(QA(), 1), ap5 = m.strictObject({
    task_id: m.string().describe("The task ID to get output from"),
    block: m.boolean().default(!0).describe("Whether to wait for completion"),
    timeout: m.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
  });
  JK1 = {
    name: aHA,
    maxResultSizeChars: 1e5,
    aliases: ["AgentOutputTool", "BashOutputTool"],
    userFacingName() {
      return "Task Output"
    },
    inputSchema: ap5,
    async description() {
      return "Retrieves output from a running or completed task"
    },
    isConcurrencySafe(A) {
      return this.isReadOnly(A)
    },
    isEnabled() {
      return !0
    },
    isReadOnly(A) {
      return !0
    },
    async checkPermissions(A, Q) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    async prompt() {
      return `- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`
    },
    async validateInput({
      task_id: A
    }, {
      getAppState: Q
    }) {
      if (!A) return {
        result: !1,
        message: "Task ID is required",
        errorCode: 1
      };
      if (!(await Q()).tasks?.[A]) return {
        result: !1,
        message: `No task found with ID: ${A}`,
        errorCode: 2
      };
      return {
        result: !0
      }
    },
    async call(A, Q, B, G, Z) {
      let {
        task_id: Y,
        block: J,
        timeout: X
      } = A, D = (await Q.getAppState()).tasks?.[Y];
      if (!D) throw Error(`No task found with ID: ${Y}`);
      if (!J) {
        if (D.status !== "running" && D.status !== "pending") return oY(Y, Q.setAppState, (K) => ({
          ...K,
          notified: !0
        })), {
          data: {
            retrieval_status: "success",
            task: YK1(D)
          }
        };
        return {
          data: {
            retrieval_status: "not_ready",
            task: YK1(D)
          }
        }
      }
      if (Z) Z({
        toolUseID: `task-output-waiting-${Date.now()}`,
        data: {
          type: "waiting_for_task",
          taskDescription: D.description,
          taskType: D.type
        }
      });
      let W = await op5(Y, Q.getAppState, X, Q.abortController);
      if (!W) return {
        data: {
          retrieval_status: "timeout",
          task: null
        }
      };
      if (W.status === "running" || W.status === "pending") return {
        data: {
          retrieval_status: "timeout",
          task: YK1(W)
        }
      };
      return oY(Y, Q.setAppState, (K) => ({
        ...K,
        notified: !0
      })), {
        data: {
          retrieval_status: "success",
          task: YK1(W)
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let B = [];
      if (B.push(`<retrieval_status>${A.retrieval_status}</retrieval_status>`), A.task) {
        if (B.push(`<task_id>${A.task.task_id}</task_id>`), B.push(`<task_type>${A.task.task_type}</task_type>`), B.push(`<status>${A.task.status}</status>`), A.task.exitCode !== void 0 && A.task.exitCode !== null) B.push(`<exit_code>${A.task.exitCode}</exit_code>`);
        if (A.task.output?.trim()) {
          let {
            content: G
          } = bbA(A.task.output, A.task.task_id);
          B.push(`<output>
${G.trimEnd()}
</output>`)
        }
        if (A.task.error) B.push(`<error>${A.task.error}</error>`)
      }
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: B.join(`

`)
      }
    },
    renderToolUseMessage(A) {
      let {
        block: Q = !0
      } = A;
      if (!Q) return "non-blocking";
      return ""
    },
    renderToolUseTag(A) {
      if (!A.task_id) return null;
      return F8.default.createElement(T, {
        flexWrap: "nowrap",
        marginLeft: 1
      }, F8.default.createElement(C, {
        dimColor: !0
      }, A.task_id))
    },
    renderToolUseProgressMessage(A) {
      let B = A[A.length - 1]?.data;
      return F8.default.createElement(T, {
        flexDirection: "column"
      }, B?.taskDescription && F8.default.createElement(C, null, "  ", B.taskDescription), F8.default.createElement(C, null, "     Waiting for task", " ", F8.default.createElement(C, {
        dimColor: !0
      }, "(esc to give additional instructions)")))
    },
    renderToolResultMessage(A, Q, {
      verbose: B,
      theme: G
    }) {
      return F8.default.createElement(rp5, {
        content: A,
        verbose: B,
        theme: G
      })
    },
    renderToolUseRejectedMessage() {
      return F8.default.createElement(w7, null)
    },
    renderToolUseErrorMessage(A, {
      verbose: Q
    }) {
      return F8.default.createElement(X5, {
        result: A,
        verbose: Q
      })
    }
  }
})
// @from(Ln 352873, Col 0)
function sp5(A) {
  let Q = 0,
    B = 0;
  for (let G of A)
    if (typeof G !== "string") Q++, B += G.content.length;
  return {
    searchCount: Q,
    totalResultCount: B
  }
}
// @from(Ln 352884, Col 0)
function rh2({
  query: A,
  allowed_domains: Q,
  blocked_domains: B
}, {
  verbose: G
}) {
  if (!A) return null;
  let Z = "";
  if (A) Z += `"${A}"`;
  if (G) {
    if (Q && Q.length > 0) Z += `, only allowing domains: ${Q.join(", ")}`;
    if (B && B.length > 0) Z += `, blocking domains: ${B.join(", ")}`
  }
  return Z
}
// @from(Ln 352901, Col 0)
function sh2() {
  return Of.default.createElement(w7, null)
}
// @from(Ln 352905, Col 0)
function th2(A, {
  verbose: Q
}) {
  return Of.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 352914, Col 0)
function eh2(A) {
  if (A.length === 0) return null;
  let Q = A[A.length - 1];
  if (!Q?.data) return null;
  let B = Q.data;
  switch (B.type) {
    case "query_update":
      return Of.default.createElement(x0, null, Of.default.createElement(C, {
        dimColor: !0
      }, "Searching: ", B.query));
    case "search_results_received":
      return Of.default.createElement(x0, null, Of.default.createElement(C, {
        dimColor: !0
      }, "Found ", B.resultCount, ' results for "', B.query, '"'));
    default:
      return null
  }
}
// @from(Ln 352933, Col 0)
function Ag2(A) {
  let {
    searchCount: Q
  } = sp5(A.results), B = A.durationSeconds >= 1 ? `${Math.round(A.durationSeconds)}s` : `${Math.round(A.durationSeconds*1000)}ms`;
  return Of.default.createElement(T, {
    justifyContent: "space-between",
    width: "100%"
  }, Of.default.createElement(x0, {
    height: 1
  }, Of.default.createElement(C, null, "Did ", Q, " search", Q !== 1 ? "es" : "", " in ", B)))
}
// @from(Ln 352945, Col 0)
function Qg2(A) {
  if (!A?.query) return null;
  return YG(A.query, Mb)
}
// @from(Ln 352949, Col 4)
Of
// @from(Ln 352950, Col 4)
Bg2 = w(() => {
  fA();
  c4();
  tH();
  eW();
  Of = c(QA(), 1)
})
// @from(Ln 352958, Col 0)
function Gl5(A, Q, B) {
  let G = [],
    Z = "",
    Y = !0;
  for (let J of A) {
    if (J.type === "server_tool_use") {
      if (Y) {
        if (Y = !1, Z.trim().length > 0) G.push(Z.trim());
        Z = ""
      }
      continue
    }
    if (J.type === "web_search_tool_result") {
      if (!Array.isArray(J.content)) {
        let I = `Web search error: ${J.content.error_code}`;
        e(Error(I)), G.push(I);
        continue
      }
      let X = J.content.map((I) => ({
        title: I.title,
        url: I.url
      }));
      G.push({
        tool_use_id: J.tool_use_id,
        content: X
      })
    }
    if (J.type === "text")
      if (Y) Z += J.text;
      else Y = !0, Z = J.text
  }
  if (Z.length) G.push(Z.trim());
  return {
    query: Q,
    results: G,
    durationSeconds: B
  }
}
// @from(Ln 352996, Col 4)
tp5
// @from(Ln 352996, Col 9)
ep5
// @from(Ln 352996, Col 14)
Al5
// @from(Ln 352996, Col 19)
Ql5
// @from(Ln 352996, Col 24)
Bl5 = (A) => {
    return {
      type: "web_search_20250305",
      name: "web_search",
      allowed_domains: A.allowed_domains,
      blocked_domains: A.blocked_domains,
      max_uses: 8
    }
  }
// @from(Ln 353005, Col 2)
XK1
// @from(Ln 353006, Col 4)
jU0 = w(() => {
  j9();
  MBA();
  nY();
  tQ();
  l2();
  MD();
  v1();
  Bg2();
  A0();
  tp5 = m.strictObject({
    query: m.string().min(2).describe("The search query to use"),
    allowed_domains: m.array(m.string()).optional().describe("Only include search results from these domains"),
    blocked_domains: m.array(m.string()).optional().describe("Never include search results from these domains")
  }), ep5 = m.object({
    title: m.string().describe("The title of the search result"),
    url: m.string().describe("The URL of the search result")
  }), Al5 = m.object({
    tool_use_id: m.string().describe("ID of the tool use"),
    content: m.array(ep5).describe("Array of search hits")
  }), Ql5 = m.object({
    query: m.string().describe("The search query that was executed"),
    results: m.array(m.union([Al5, m.string()])).describe("Search results and/or text commentary from the model"),
    durationSeconds: m.number().describe("Time taken to complete the search operation")
  });
  XK1 = {
    name: aR,
    maxResultSizeChars: 1e5,
    async description(A) {
      return `Claude wants to search the web for: ${A.query}`
    },
    userFacingName() {
      return "Web Search"
    },
    getToolUseSummary: Qg2,
    isEnabled() {
      let A = R4(),
        Q = B5();
      if (A === "firstParty") return !0;
      if (A === "vertex") return Q.includes("claude-opus-4") || Q.includes("claude-sonnet-4") || Q.includes("claude-haiku-4");
      if (A === "foundry") return !0;
      return !1
    },
    inputSchema: tp5,
    outputSchema: Ql5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "passthrough",
        message: "WebSearchTool requires permission."
      }
    },
    async prompt() {
      return BCB()
    },
    renderToolUseMessage: rh2,
    renderToolUseRejectedMessage: sh2,
    renderToolUseErrorMessage: th2,
    renderToolUseProgressMessage: eh2,
    renderToolResultMessage: Ag2,
    async validateInput(A) {
      let {
        query: Q,
        allowed_domains: B,
        blocked_domains: G
      } = A;
      if (!Q.length) return {
        result: !1,
        message: "Error: Missing query",
        errorCode: 1
      };
      if (B && G) return {
        result: !1,
        message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
        errorCode: 2
      };
      return {
        result: !0
      }
    },
    async call(A, Q, B, G, Z) {
      let Y = performance.now(),
        {
          query: J
        } = A,
        X = H0({
          content: "Perform a web search for the query: " + J
        }),
        I = Bl5(A),
        D = oHA({
          messages: [X],
          systemPrompt: ["You are an assistant for performing a web search tool use"],
          maxThinkingTokens: Q.options.maxThinkingTokens,
          tools: [],
          signal: Q.abortController.signal,
          options: {
            getToolPermissionContext: async () => {
              return (await Q.getAppState()).toolPermissionContext
            },
            model: Q.options.mainLoopModel,
            toolChoice: void 0,
            isNonInteractiveSession: Q.options.isNonInteractiveSession,
            hasAppendSystemPrompt: !!Q.options.appendSystemPrompt,
            extraToolSchemas: [I],
            querySource: "web_search_tool",
            agents: Q.options.agentDefinitions.activeAgents,
            mcpTools: [],
            agentId: Q.agentId
          }
        }),
        W = [],
        K = null,
        V = "",
        F = 0,
        H = new Map;
      for await (let M of D) {
        if (W.push(M), M.type === "stream_event" && M.event?.type === "content_block_start") {
          let _ = M.event.content_block;
          if (_ && _.type === "server_tool_use") {
            K = _.id, V = "";
            continue
          }
        }
        if (K && M.type === "stream_event" && M.event?.type === "content_block_delta") {
          let _ = M.event.delta;
          if (_?.type === "input_json_delta" && _.partial_json) {
            V += _.partial_json;
            try {
              let j = V.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
              if (j && j[1]) {
                let x = AQ('"' + j[1] + '"');
                if (!H.has(K) || H.get(K) !== x) {
                  if (H.set(K, x), F++, Z) Z({
                    toolUseID: `search-progress-${F}`,
                    data: {
                      type: "query_update",
                      query: x
                    }
                  })
                }
              }
            } catch {}
          }
        }
        if (M.type === "stream_event" && M.event?.type === "content_block_start") {
          let _ = M.event.content_block;
          if (_ && _.type === "web_search_tool_result") {
            let j = _.tool_use_id,
              x = H.get(j) || J,
              b = _.content;
            if (F++, Z) Z({
              toolUseID: j || `search-progress-${F}`,
              data: {
                type: "search_results_received",
                resultCount: Array.isArray(b) ? b.length : 0,
                query: x
              }
            })
          }
        }
      }
      let z = W.filter((M) => M.type === "assistant").flatMap((M) => M.message.content),
        O = (performance.now() - Y) / 1000;
      return {
        data: Gl5(z, J, O)
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        query: B,
        results: G
      } = A, Z = `Web search results for query: "${B}"

`;
      return G.forEach((Y) => {
        if (typeof Y === "string") Z += Y + `

`;
        else if (Y.content.length > 0) Z += `Links: ${eA(Y.content)}

`;
        else Z += `No links found.

`
      }), Z += `
REMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.`, {
        tool_use_id: Q,
        type: "tool_result",
        content: Z.trim()
      }
    }
  }
})
// @from(Ln 353204, Col 4)
zY = "AskUserQuestion"
// @from(Ln 353205, Col 2)
Gg2 = 12
// @from(Ln 353206, Col 2)
Zg2 = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."
// @from(Ln 353207, Col 2)
Yg2 = `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ExitPlanMode for plan approval.
`
// @from(Ln 353220, Col 4)
Jg2 = `- Scope permissions narrowly, like a security-conscious human would:
  - **Never combine multiple actions into one permission** - split them into separate, specific permissions (e.g. "list pods in namespace X", "view logs in namespace X")
  - Prefer "run read-only database queries" over "run database queries"
  - Prefer "run tests in the project" over "run code"
  - Add constraints like "read-only", "local", "non-destructive" whenever possible. If you only need read-only access, you must only request read-only access.
  - Prefer not to request overly broad permissions that would grant dangerous access, especially any access to production data or to make irrecoverable changes
  - When interacting with cloud environments, add constraints like "in the foobar project", "in the baz namespace", "in the foo DB table"
  - Never request broad tool access like "run k8s commands" - always scope to specific actions and namespaces, ideally with constraints such as read-only`
// @from(Ln 353228, Col 4)
SBY
// @from(Ln 353228, Col 9)
Xg2
// @from(Ln 353229, Col 4)
Ig2 = w(() => {
  SBY = `Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the ${zY} tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use ${zY} first, then use exit plan mode tool after clarifying the approach.
`, Xg2 = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## Requesting Permissions (allowedPrompts)
When calling this tool, you can request prompt-based permissions for bash commands your plan will need. These are semantic descriptions of actions, not literal commands.

**How to use:**
\`\`\`json
{
  "allowedPrompts": [
    { "tool": "Bash", "prompt": "run tests" },
    { "tool": "Bash", "prompt": "install dependencies" },
    { "tool": "Bash", "prompt": "build the project" }
  ]
}
\`\`\`

**Guidelines for prompts:**
- Use semantic descriptions that capture the action's purpose, not specific commands
- "run tests" matches: npm test, pytest, go test, bun test, etc.
- "install dependencies" matches: npm install, pip install, cargo build, etc.
- "build the project" matches: npm run build, make, cargo build, etc.
- Keep descriptions concise but descriptive
- Only request permissions you actually need for the plan
${Jg2}

**Benefits:**
- Commands matching approved prompts won't require additional permission prompts
- The user sees the requested permissions when approving the plan
- Permissions are session-scoped and cleared when the session ends

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Before Using This Tool
Ensure your plan is complete and unambiguous:
- If you have unresolved questions about requirements or approach, use ${zY} first (in earlier phases)
- Once your plan is finalized, use THIS tool to request approval

**Important:** Do NOT use ${zY} to ask "Is this plan okay?" or "Should I proceed?" - that's exactly what THIS tool does. ExitPlanMode inherently requests user approval of your plan.

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use ${zY} first, then use exit plan mode tool after clarifying the approach.
`
})
// @from(Ln 353299, Col 0)
function Dg2() {
  return null
}
// @from(Ln 353303, Col 0)
function Wg2() {
  return null
}
// @from(Ln 353307, Col 0)
function Kg2(A, Q, {
  theme: B
}) {
  let {
    plan: G
  } = A, Z = !G || G.trim() === "", Y = "filePath" in A ? A.filePath : void 0, J = Y ? k6(Y) : "", X = "awaitingLeaderApproval" in A ? A.awaitingLeaderApproval : !1;
  if (Z) return r6.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, r6.createElement(T, {
    flexDirection: "row"
  }, r6.createElement(C, {
    color: iR("plan")
  }, xJ), r6.createElement(C, null, " Exited plan mode")));
  if (X) return r6.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, r6.createElement(T, {
    flexDirection: "row"
  }, r6.createElement(C, {
    color: iR("plan")
  }, xJ), r6.createElement(C, null, " Plan submitted for team lead approval")), r6.createElement(x0, null, r6.createElement(T, {
    flexDirection: "column"
  }, Y && r6.createElement(C, {
    dimColor: !0
  }, "Plan file: ", J), r6.createElement(C, {
    dimColor: !0
  }, "Waiting for team lead to review and approve..."))));
  return r6.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, r6.createElement(T, {
    flexDirection: "row"
  }, r6.createElement(C, {
    color: iR("plan")
  }, xJ), r6.createElement(C, null, " User approved Claude's plan")), r6.createElement(x0, null, r6.createElement(T, {
    flexDirection: "column"
  }, Y && r6.createElement(C, {
    dimColor: !0
  }, "Plan saved to: ", J, " · /plan to edit"), r6.createElement(JV, null, G))))
}
// @from(Ln 353349, Col 0)
function Vg2({
  plan: A
}, {
  theme: Q
}) {
  let B = A ?? AK() ?? "No plan found";
  return r6.createElement(T, {
    flexDirection: "column"
  }, r6.createElement(iY1, {
    plan: B
  }))
}
// @from(Ln 353362, Col 0)
function Fg2() {
  return null
}
// @from(Ln 353365, Col 4)
r6
// @from(Ln 353366, Col 4)
Hg2 = w(() => {
  fA();
  pb();
  c4();
  vS();
  oD0();
  mL();
  UF();
  y9();
  r6 = c(QA(), 1)
})
// @from(Ln 353377, Col 4)
Zl5
// @from(Ln 353377, Col 9)
Yl5
// @from(Ln 353377, Col 14)
Jl5
// @from(Ln 353377, Col 19)
V$
// @from(Ln 353378, Col 4)
fbA = w(() => {
  j9();
  Ig2();
  Hg2();
  UF();
  A0();
  dW();
  C0();
  Zl5 = m.object({
    tool: m.enum(["Bash"]).describe("The tool this prompt applies to"),
    prompt: m.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"')
  }), Yl5 = m.strictObject({
    allowedPrompts: m.array(Zl5).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands."),
    ...{}
  }).passthrough(), Jl5 = m.object({
    plan: m.string().nullable().describe("The plan that was presented to the user"),
    isAgent: m.boolean(),
    filePath: m.string().optional().describe("The file path where the plan was saved"),
    ...{}
  }), V$ = {
    name: vd,
    maxResultSizeChars: 1e5,
    async description() {
      return "Prompts the user to exit plan mode and start coding"
    },
    async prompt() {
      return Xg2
    },
    inputSchema: Yl5,
    outputSchema: Jl5,
    userFacingName() {
      return ""
    },
    isEnabled() {
      if (process.env.CLAUDE_CODE_REMOTE === "true") return !1;
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !1
    },
    requiresUserInteraction() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: A
      }
    },
    renderToolUseMessage: Dg2,
    renderToolUseProgressMessage: Wg2,
    renderToolResultMessage: Kg2,
    renderToolUseRejectedMessage: Vg2,
    renderToolUseErrorMessage: Fg2,
    async call(A, Q) {
      let B = !!Q.agentId,
        G = dC(Q.agentId),
        Z = AK(Q.agentId),
        Y = void 0,
        J = void 0;
      return Q.setAppState((X) => {
        if (X.toolPermissionContext.mode !== "plan") return X;
        return Iq(!0), lw(!0), {
          ...X,
          toolPermissionContext: UJ(X.toolPermissionContext, {
            type: "setMode",
            mode: "default",
            destination: "session"
          })
        }
      }), {
        data: {
          plan: Z,
          isAgent: B,
          filePath: G,
          ...{}
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      isAgent: A,
      plan: Q,
      filePath: B,
      awaitingLeaderApproval: G,
      requestId: Z,
      ...Y
    }, J) {
      if (G) return {
        type: "tool_result",
        content: `Your plan has been submitted to the team lead for approval.

Plan file: ${B}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${Z}`,
        tool_use_id: J
      };
      if (A) return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: J
      };
      if (!Q || Q.trim() === "") return {
        type: "tool_result",
        content: "User has approved exiting plan mode. You can now proceed.",
        tool_use_id: J
      };
      return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${B}
You can refer back to it if needed during implementation.

## Approved Plan:
${Q}`,
        tool_use_id: J
      }
    }
  }
})
// @from(Ln 353510, Col 4)
G2Y
// @from(Ln 353511, Col 4)
Eg2 = w(() => {
  j9();
  G2Y = m.strictObject({})
})
// @from(Ln 353516, Col 0)
function Il5({
  answers: A
}) {
  return CI.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, CI.createElement(T, {
    flexDirection: "row"
  }, CI.createElement(C, {
    color: iR("default")
  }, xJ, " "), CI.createElement(C, null, "User answered Claude's questions:")), CI.createElement(x0, null, CI.createElement(T, {
    flexDirection: "column"
  }, Object.entries(A).map(([Q, B]) => CI.createElement(C, {
    key: Q,
    color: "inactive"
  }, "· ", Q, " → ", B)))))
}
// @from(Ln 353533, Col 4)
CI
// @from(Ln 353533, Col 8)
Xl5
// @from(Ln 353533, Col 13)
zg2
// @from(Ln 353533, Col 18)
TU0
// @from(Ln 353533, Col 23)
V2Y
// @from(Ln 353533, Col 28)
IK1
// @from(Ln 353534, Col 4)
DK1 = w(() => {
  j9();
  fA();
  c4();
  vS();
  mL();
  CI = c(QA(), 1), Xl5 = m.object({
    label: m.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
    description: m.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications.")
  }), zg2 = m.object({
    question: m.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
    header: m.string().describe(`Very short label displayed as a chip/tag (max ${Gg2} chars). Examples: "Auth method", "Library", "Approach".`),
    options: m.array(Xl5).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
    multiSelect: m.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
  }), TU0 = m.strictObject({
    questions: m.array(zg2).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
    answers: m.record(m.string(), m.string()).optional().describe("User answers collected by the permission component"),
    metadata: m.object({
      source: m.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.')
    }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
  }).refine((A) => {
    let Q = A.questions.map((B) => B.question);
    if (Q.length !== new Set(Q).size) return !1;
    for (let B of A.questions) {
      let G = B.options.map((Z) => Z.label);
      if (G.length !== new Set(G).size) return !1
    }
    return !0
  }, {
    message: "Question texts must be unique, option labels must be unique within each question"
  }), V2Y = m.object({
    questions: m.array(zg2).describe("The questions that were asked"),
    answers: m.record(m.string(), m.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)")
  });
  IK1 = {
    name: zY,
    maxResultSizeChars: 1e5,
    async description() {
      return Zg2
    },
    async prompt() {
      return Yg2
    },
    inputSchema: TU0,
    userFacingName() {
      return ""
    },
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    requiresUserInteraction() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "ask",
        message: "Answer questions?",
        updatedInput: A
      }
    },
    renderToolUseMessage() {
      return null
    },
    renderToolUseProgressMessage() {
      return null
    },
    renderToolResultMessage({
      answers: A
    }, Q) {
      return CI.createElement(Il5, {
        answers: A
      })
    },
    renderToolUseRejectedMessage() {
      return CI.createElement(T, {
        flexDirection: "row",
        marginTop: 1
      }, CI.createElement(C, {
        color: iR("default")
      }, xJ, " "), CI.createElement(C, null, "User declined to answer questions"))
    },
    renderToolUseErrorMessage() {
      return null
    },
    async call({
      questions: A,
      answers: Q = {}
    }, B) {
      return {
        data: {
          questions: A,
          answers: Q
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      answers: A
    }, Q) {
      return {
        type: "tool_result",
        content: `User has answered your questions: ${Object.entries(A).map(([G,Z])=>`"${G}"="${Z}"`).join(", ")}. You can now continue with the user's answers in mind.`,
        tool_use_id: Q
      }
    }
  }
})
// @from(Ln 353646, Col 4)
Dl5
// @from(Ln 353646, Col 9)
Wl5
// @from(Ln 353646, Col 14)
Kl5
// @from(Ln 353646, Col 19)
Vl5
// @from(Ln 353646, Col 24)
Fl5
// @from(Ln 353646, Col 29)
Hl5
// @from(Ln 353646, Col 34)
El5
// @from(Ln 353646, Col 39)
zl5
// @from(Ln 353646, Col 44)
$l5
// @from(Ln 353646, Col 49)
$g2
// @from(Ln 353647, Col 4)
Cg2 = w(() => {
  j9();
  Dl5 = m.strictObject({
    operation: m.literal("goToDefinition"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Wl5 = m.strictObject({
    operation: m.literal("findReferences"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Kl5 = m.strictObject({
    operation: m.literal("hover"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Vl5 = m.strictObject({
    operation: m.literal("documentSymbol"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Fl5 = m.strictObject({
    operation: m.literal("workspaceSymbol"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), Hl5 = m.strictObject({
    operation: m.literal("goToImplementation"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), El5 = m.strictObject({
    operation: m.literal("prepareCallHierarchy"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), zl5 = m.strictObject({
    operation: m.literal("incomingCalls"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), $l5 = m.strictObject({
    operation: m.literal("outgoingCalls"),
    filePath: m.string().describe("The absolute or relative path to the file"),
    line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  }), $g2 = m.discriminatedUnion("operation", [Dl5, Wl5, Kl5, Vl5, Fl5, Hl5, El5, zl5, $l5])
})
// @from(Ln 353700, Col 0)
function hbA(A, Q) {
  if (!A) return k("formatUri called with undefined URI - indicates malformed LSP server response", {
    level: "warn"
  }), "<unknown location>";
  let B = A.replace(/^file:\/\//, "");
  try {
    B = decodeURIComponent(B)
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    k(`Failed to decode LSP URI '${A}': ${Z}. Using un-decoded path: ${B}`, {
      level: "warn"
    })
  }
  if (Q) {
    let G = Cl5(Q, B);
    if (G.length < B.length && !G.startsWith("../../")) return G
  }
  return B
}
// @from(Ln 353720, Col 0)
function wg2(A, Q) {
  let B = new Map;
  for (let G of A) {
    let Z = "uri" in G ? G.uri : G.location.uri,
      Y = hbA(Z, Q),
      J = B.get(Y);
    if (J) J.push(G);
    else B.set(Y, [G])
  }
  return B
}
// @from(Ln 353732, Col 0)
function WK1(A, Q) {
  let B = hbA(A.uri, Q),
    G = A.range.start.line + 1,
    Z = A.range.start.character + 1;
  return `${B}:${G}:${Z}`
}
// @from(Ln 353739, Col 0)
function Ug2(A) {
  return {
    uri: A.targetUri,
    range: A.targetSelectionRange || A.targetRange
  }
}
// @from(Ln 353746, Col 0)
function qg2(A) {
  return "targetUri" in A
}
// @from(Ln 353750, Col 0)
function PU0(A, Q) {
  if (!A) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  if (Array.isArray(A)) {
    let G = A.map((X) => qg2(X) ? Ug2(X) : X),
      Z = G.filter((X) => !X || !X.uri);
    if (Z.length > 0) k(`formatGoToDefinitionResult: Filtering out ${Z.length} invalid location(s) - this should have been caught earlier`, {
      level: "warn"
    });
    let Y = G.filter((X) => X && X.uri);
    if (Y.length === 0) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    if (Y.length === 1) return `Defined in ${WK1(Y[0],Q)}`;
    let J = Y.map((X) => `  ${WK1(X,Q)}`).join(`
`);
    return `Found ${Y.length} definitions:
${J}`
  }
  let B = qg2(A) ? Ug2(A) : A;
  return `Defined in ${WK1(B,Q)}`
}
// @from(Ln 353770, Col 0)
function Lg2(A, Q) {
  if (!A || A.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  let B = A.filter((J) => !J || !J.uri);
  if (B.length > 0) k(`formatFindReferencesResult: Filtering out ${B.length} invalid location(s) - this should have been caught earlier`, {
    level: "warn"
  });
  let G = A.filter((J) => J && J.uri);
  if (G.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  if (G.length === 1) return `Found 1 reference:
  ${WK1(G[0],Q)}`;
  let Z = wg2(G, Q),
    Y = [`Found ${G.length} references across ${Z.size} files:`];
  for (let [J, X] of Z) {
    Y.push(`
${J}:`);
    for (let I of X) {
      let D = I.range.start.line + 1,
        W = I.range.start.character + 1;
      Y.push(`  Line ${D}:${W}`)
    }
  }
  return Y.join(`
`)
}
// @from(Ln 353795, Col 0)
function Ul5(A) {
  if (Array.isArray(A)) return A.map((Q) => {
    if (typeof Q === "string") return Q;
    return Q.value
  }).join(`

`);
  if (typeof A === "string") return A;
  if ("kind" in A) return A.value;
  return A.value
}
// @from(Ln 353807, Col 0)
function Og2(A, Q) {
  if (!A) return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
  let B = Ul5(A.contents);
  if (A.range) {
    let G = A.range.start.line + 1,
      Z = A.range.start.character + 1;
    return `Hover info at ${G}:${Z}:

${B}`
  }
  return B
}
// @from(Ln 353820, Col 0)
function rHA(A) {
  return {
    [1]: "File",
    [2]: "Module",
    [3]: "Namespace",
    [4]: "Package",
    [5]: "Class",
    [6]: "Method",
    [7]: "Property",
    [8]: "Field",
    [9]: "Constructor",
    [10]: "Enum",
    [11]: "Interface",
    [12]: "Function",
    [13]: "Variable",
    [14]: "Constant",
    [15]: "String",
    [16]: "Number",
    [17]: "Boolean",
    [18]: "Array",
    [19]: "Object",
    [20]: "Key",
    [21]: "Null",
    [22]: "EnumMember",
    [23]: "Struct",
    [24]: "Event",
    [25]: "Operator",
    [26]: "TypeParameter"
  } [A] || "Unknown"
}
// @from(Ln 353851, Col 0)
function Mg2(A, Q = 0) {
  let B = [],
    G = "  ".repeat(Q),
    Z = rHA(A.kind),
    Y = `${G}${A.name} (${Z})`;
  if (A.detail) Y += ` ${A.detail}`;
  let J = A.range.start.line + 1;
  if (Y += ` - Line ${J}`, B.push(Y), A.children && A.children.length > 0)
    for (let X of A.children) B.push(...Mg2(X, Q + 1));
  return B
}
// @from(Ln 353863, Col 0)
function Rg2(A, Q) {
  if (!A || A.length === 0) return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
  let B = A[0];
  if (B && "location" in B) return SU0(A, Q);
  let Z = ["Document symbols:"];
  for (let Y of A) Z.push(...Mg2(Y));
  return Z.join(`
`)
}
// @from(Ln 353873, Col 0)
function SU0(A, Q) {
  if (!A || A.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  let B = A.filter((J) => !J || !J.location || !J.location.uri);
  if (B.length > 0) k(`formatWorkspaceSymbolResult: Filtering out ${B.length} invalid symbol(s) - this should have been caught earlier`, {
    level: "warn"
  });
  let G = A.filter((J) => J && J.location && J.location.uri);
  if (G.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  let Z = [`Found ${G.length} symbol${G.length===1?"":"s"} in workspace:`],
    Y = wg2(G, Q);
  for (let [J, X] of Y) {
    Z.push(`
${J}:`);
    for (let I of X) {
      let D = rHA(I.kind),
        W = I.location.range.start.line + 1,
        K = `  ${I.name} (${D}) - Line ${W}`;
      if (I.containerName) K += ` in ${I.containerName}`;
      Z.push(K)
    }
  }
  return Z.join(`
`)
}
// @from(Ln 353898, Col 0)
function Ng2(A, Q) {
  if (!A.uri) return k("formatCallHierarchyItem: CallHierarchyItem has undefined URI", {
    level: "warn"
  }), `${A.name} (${rHA(A.kind)}) - <unknown location>`;
  let B = hbA(A.uri, Q),
    G = A.range.start.line + 1,
    Z = rHA(A.kind),
    Y = `${A.name} (${Z}) - ${B}:${G}`;
  if (A.detail) Y += ` [${A.detail}]`;
  return Y
}
// @from(Ln 353910, Col 0)
function _g2(A, Q) {
  if (!A || A.length === 0) return "No call hierarchy item found at this position";
  if (A.length === 1) return `Call hierarchy item: ${Ng2(A[0],Q)}`;
  let B = [`Found ${A.length} call hierarchy items:`];
  for (let G of A) B.push(`  ${Ng2(G,Q)}`);
  return B.join(`
`)
}
// @from(Ln 353919, Col 0)
function jg2(A, Q) {
  if (!A || A.length === 0) return "No incoming calls found (nothing calls this function)";
  let B = [`Found ${A.length} incoming call${A.length===1?"":"s"}:`],
    G = new Map;
  for (let Z of A) {
    if (!Z.from) {
      k("formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field", {
        level: "warn"
      });
      continue
    }
    let Y = hbA(Z.from.uri, Q),
      J = G.get(Y);
    if (J) J.push(Z);
    else G.set(Y, [Z])
  }
  for (let [Z, Y] of G) {
    B.push(`
${Z}:`);
    for (let J of Y) {
      if (!J.from) continue;
      let X = rHA(J.from.kind),
        I = J.from.range.start.line + 1,
        D = `  ${J.from.name} (${X}) - Line ${I}`;
      if (J.fromRanges && J.fromRanges.length > 0) {
        let W = J.fromRanges.map((K) => `${K.start.line+1}:${K.start.character+1}`).join(", ");
        D += ` [calls at: ${W}]`
      }
      B.push(D)
    }
  }
  return B.join(`
`)
}
// @from(Ln 353954, Col 0)
function Tg2(A, Q) {
  if (!A || A.length === 0) return "No outgoing calls found (this function calls nothing)";
  let B = [`Found ${A.length} outgoing call${A.length===1?"":"s"}:`],
    G = new Map;
  for (let Z of A) {
    if (!Z.to) {
      k("formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field", {
        level: "warn"
      });
      continue
    }
    let Y = hbA(Z.to.uri, Q),
      J = G.get(Y);
    if (J) J.push(Z);
    else G.set(Y, [Z])
  }
  for (let [Z, Y] of G) {
    B.push(`
${Z}:`);
    for (let J of Y) {
      if (!J.to) continue;
      let X = rHA(J.to.kind),
        I = J.to.range.start.line + 1,
        D = `  ${J.to.name} (${X}) - Line ${I}`;
      if (J.fromRanges && J.fromRanges.length > 0) {
        let W = J.fromRanges.map((K) => `${K.start.line+1}:${K.start.character+1}`).join(", ");
        D += ` [called from: ${W}]`
      }
      B.push(D)
    }
  }
  return B.join(`
`)
}
// @from(Ln 353988, Col 4)
Pg2 = w(() => {
  T1()
})
// @from(Ln 353991, Col 4)
Sg2 = "LSP"
// @from(Ln 353992, Col 2)
xU0 = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`
// @from(Ln 354012, Col 0)
function xg2(A, Q, B) {
  try {
    let G = vA(),
      Z = Y4(A);
    if (!G.existsSync(Z)) return null;
    let J = G.readFileSync(Z, {
      encoding: "utf-8"
    }).split(`
`);
    if (Q < 0 || Q >= J.length) return null;
    let X = J[Q];
    if (!X || B < 0 || B >= X.length) return null;
    let I = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
      D;
    while ((D = I.exec(X)) !== null) {
      let W = D.index,
        K = W + D[0].length;
      if (B >= W && B < K) {
        let V = D[0];
        return V.length > 30 ? V.slice(0, 27) + "..." : V
      }
    }
    return null
  } catch (G) {
    if (G instanceof Error) k(`Symbol extraction failed for ${A}:${Q}:${B}: ${G.message}`, {
      level: "warn"
    });
    return null
  }
}
// @from(Ln 354042, Col 4)
yg2 = w(() => {
  DQ();
  oZ();
  T1()
})
// @from(Ln 354048, Col 0)
function Nl5({
  operation: A,
  resultCount: Q,
  fileCount: B,
  content: G,
  verbose: Z
}) {
  let Y = ql5[A] || {
      singular: "result",
      plural: "results"
    },
    J = Q === 1 ? Y.singular : Y.plural,
    X = A === "hover" && Q > 0 && Y.special ? BW.default.createElement(C, null, "Hover info ", Y.special) : BW.default.createElement(C, null, "Found ", BW.default.createElement(C, {
      bold: !0
    }, Q, " "), J),
    I = B > 1 ? BW.default.createElement(C, null, " ", "across ", BW.default.createElement(C, {
      bold: !0
    }, B, " "), "files") : null;
  if (Z) return BW.default.createElement(T, {
    flexDirection: "column"
  }, BW.default.createElement(T, {
    flexDirection: "row"
  }, BW.default.createElement(C, null, "  ⎿  ", X, I)), BW.default.createElement(T, {
    marginLeft: 5
  }, BW.default.createElement(C, null, G)));
  return BW.default.createElement(x0, {
    height: 1
  }, BW.default.createElement(C, null, X, I, " ", Q > 0 && BW.default.createElement(VS, null)))
}
// @from(Ln 354078, Col 0)
function vg2() {
  return "LSP"
}
// @from(Ln 354082, Col 0)
function kg2(A, {
  verbose: Q
}) {
  if (!A.operation) return null;
  let B = [];
  if ((A.operation === "goToDefinition" || A.operation === "findReferences" || A.operation === "hover" || A.operation === "goToImplementation") && A.filePath && A.line !== void 0 && A.character !== void 0) {
    let G = xg2(A.filePath, A.line - 1, A.character - 1),
      Z = Q ? A.filePath : k6(A.filePath);
    if (G) B.push(`operation: "${A.operation}"`), B.push(`symbol: "${G}"`), B.push(`in: "${Z}"`);
    else B.push(`operation: "${A.operation}"`), B.push(`file: "${Z}"`), B.push(`position: ${A.line}:${A.character}`);
    return B.join(", ")
  }
  if (B.push(`operation: "${A.operation}"`), A.filePath) {
    let G = Q ? A.filePath : k6(A.filePath);
    B.push(`file: "${G}"`)
  }
  return B.join(", ")
}
// @from(Ln 354101, Col 0)
function bg2() {
  return BW.default.createElement(w7, null)
}
// @from(Ln 354105, Col 0)
function fg2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && Q9(A, "tool_use_error")) return BW.default.createElement(x0, null, BW.default.createElement(C, {
    color: "error"
  }, "LSP operation failed"));
  return BW.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 354117, Col 0)
function hg2() {
  return null
}
// @from(Ln 354121, Col 0)
function gg2(A, Q, {
  verbose: B
}) {
  if (A.resultCount !== void 0 && A.fileCount !== void 0) return BW.default.createElement(Nl5, {
    operation: A.operation,
    resultCount: A.resultCount,
    fileCount: A.fileCount,
    content: A.result,
    verbose: B
  });
  return BW.default.createElement(x0, null, BW.default.createElement(C, null, A.result))
}
// @from(Ln 354133, Col 4)
BW
// @from(Ln 354133, Col 8)
ql5
// @from(Ln 354134, Col 4)
ug2 = w(() => {
  fA();
  tH();
  eW();
  c4();
  Gr();
  tQ();
  y9();
  yg2();
  BW = c(QA(), 1), ql5 = {
    goToDefinition: {
      singular: "definition",
      plural: "definitions"
    },
    findReferences: {
      singular: "reference",
      plural: "references"
    },
    documentSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    workspaceSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    hover: {
      singular: "hover info",
      plural: "hover info",
      special: "available"
    },
    goToImplementation: {
      singular: "implementation",
      plural: "implementations"
    },
    prepareCallHierarchy: {
      singular: "call item",
      plural: "call items"
    },
    incomingCalls: {
      singular: "caller",
      plural: "callers"
    },
    outgoingCalls: {
      singular: "callee",
      plural: "callees"
    }
  }
})
// @from(Ln 354191, Col 0)
function Rl5(A, Q) {
  let B = Ll5(Q).href,
    G = {
      line: A.line - 1,
      character: A.character - 1
    };
  switch (A.operation) {
    case "goToDefinition":
      return {
        method: "textDocument/definition", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "findReferences":
      return {
        method: "textDocument/references", params: {
          textDocument: {
            uri: B
          },
          position: G,
          context: {
            includeDeclaration: !0
          }
        }
      };
    case "hover":
      return {
        method: "textDocument/hover", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "documentSymbol":
      return {
        method: "textDocument/documentSymbol", params: {
          textDocument: {
            uri: B
          }
        }
      };
    case "workspaceSymbol":
      return {
        method: "workspace/symbol", params: {
          query: ""
        }
      };
    case "goToImplementation":
      return {
        method: "textDocument/implementation", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "prepareCallHierarchy":
      return {
        method: "textDocument/prepareCallHierarchy", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "incomingCalls":
      return {
        method: "textDocument/prepareCallHierarchy", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "outgoingCalls":
      return {
        method: "textDocument/prepareCallHierarchy", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      }
  }
}
// @from(Ln 354281, Col 0)
function dg2(A) {
  let Q = A.length;
  for (let B of A)
    if (B.children && B.children.length > 0) Q += dg2(B.children);
  return Q
}
// @from(Ln 354288, Col 0)
function KK1(A) {
  return new Set(A.map((Q) => Q.uri)).size
}
// @from(Ln 354292, Col 0)
function _l5(A) {
  return "targetUri" in A
}
// @from(Ln 354296, Col 0)
function mg2(A) {
  if (_l5(A)) return {
    uri: A.targetUri,
    range: A.targetSelectionRange || A.targetRange
  };
  return A
}
// @from(Ln 354304, Col 0)
function jl5(A, Q, B) {
  switch (A) {
    case "goToDefinition": {
      let Z = (Array.isArray(Q) ? Q : Q ? [Q] : []).map(mg2),
        Y = Z.filter((X) => !X || !X.uri);
      if (Y.length > 0) e(Error(`LSP server returned ${Y.length} location(s) with undefined URI for goToDefinition on ${B}. This indicates malformed data from the LSP server.`));
      let J = Z.filter((X) => X && X.uri);
      return {
        formatted: PU0(Q, B),
        resultCount: J.length,
        fileCount: KK1(J)
      }
    }
    case "findReferences": {
      let G = Q || [],
        Z = G.filter((J) => !J || !J.uri);
      if (Z.length > 0) e(Error(`LSP server returned ${Z.length} location(s) with undefined URI for findReferences on ${B}. This indicates malformed data from the LSP server.`));
      let Y = G.filter((J) => J && J.uri);
      return {
        formatted: Lg2(Q, B),
        resultCount: Y.length,
        fileCount: KK1(Y)
      }
    }
    case "hover":
      return {
        formatted: Og2(Q, B), resultCount: Q ? 1 : 0, fileCount: Q ? 1 : 0
      };
    case "documentSymbol": {
      let G = Q || [],
        Y = G.length > 0 && G[0] && "range" in G[0] ? dg2(G) : G.length;
      return {
        formatted: Rg2(Q, B),
        resultCount: Y,
        fileCount: G.length > 0 ? 1 : 0
      }
    }
    case "workspaceSymbol": {
      let G = Q || [],
        Z = G.filter((X) => !X || !X.location || !X.location.uri);
      if (Z.length > 0) e(Error(`LSP server returned ${Z.length} symbol(s) with undefined location URI for workspaceSymbol on ${B}. This indicates malformed data from the LSP server.`));
      let Y = G.filter((X) => X && X.location && X.location.uri),
        J = Y.map((X) => X.location);
      return {
        formatted: SU0(Q, B),
        resultCount: Y.length,
        fileCount: KK1(J)
      }
    }
    case "goToImplementation": {
      let Z = (Array.isArray(Q) ? Q : Q ? [Q] : []).map(mg2),
        Y = Z.filter((X) => !X || !X.uri);
      if (Y.length > 0) e(Error(`LSP server returned ${Y.length} location(s) with undefined URI for goToImplementation on ${B}. This indicates malformed data from the LSP server.`));
      let J = Z.filter((X) => X && X.uri);
      return {
        formatted: PU0(Q, B),
        resultCount: J.length,
        fileCount: KK1(J)
      }
    }
    case "prepareCallHierarchy": {
      let G = Q || [];
      return {
        formatted: _g2(Q, B),
        resultCount: G.length,
        fileCount: G.length > 0 ? Tl5(G) : 0
      }
    }
    case "incomingCalls": {
      let G = Q || [];
      return {
        formatted: jg2(Q, B),
        resultCount: G.length,
        fileCount: G.length > 0 ? Pl5(G) : 0
      }
    }
    case "outgoingCalls": {
      let G = Q || [];
      return {
        formatted: Tg2(Q, B),
        resultCount: G.length,
        fileCount: G.length > 0 ? Sl5(G) : 0
      }
    }
  }
}
// @from(Ln 354391, Col 0)
function Tl5(A) {
  let Q = A.map((B) => B.uri).filter((B) => B);
  return new Set(Q).size
}
// @from(Ln 354396, Col 0)
function Pl5(A) {
  let Q = A.map((B) => B.from?.uri).filter((B) => B);
  return new Set(Q).size
}
// @from(Ln 354401, Col 0)
function Sl5(A) {
  let Q = A.map((B) => B.to?.uri).filter((B) => B);
  return new Set(Q).size
}
// @from(Ln 354405, Col 4)
Ol5
// @from(Ln 354405, Col 9)
Ml5
// @from(Ln 354405, Col 14)
vU0