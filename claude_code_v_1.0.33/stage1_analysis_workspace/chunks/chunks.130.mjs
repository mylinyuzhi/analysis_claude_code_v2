
// @from(Start 12286070, End 12287879)
hTA = z((zWZ, ou2) => {
  ou2.exports = ru2;
  var au2 = b31(),
    su2 = h31(),
    Qo5 = l31(),
    i31 = dJ(),
    Bo5 = q31();

  function ru2(A) {
    this.contextObject = A
  }
  var Go5 = {
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
  ru2.prototype = {
    hasFeature: function(Q, B) {
      var G = Go5[(Q || "").toLowerCase()];
      return G && G[B || ""] || !1
    },
    createDocumentType: function(Q, B, G) {
      if (!Bo5.isValidQName(Q)) i31.InvalidCharacterError();
      return new su2(this.contextObject, Q, B, G)
    },
    createDocument: function(Q, B, G) {
      var Z = new au2(!1, null),
        I;
      if (B) I = Z.createElementNS(Q, B);
      else I = null;
      if (G) Z.appendChild(G);
      if (I) Z.appendChild(I);
      if (Q === i31.NAMESPACE.HTML) Z._contentType = "application/xhtml+xml";
      else if (Q === i31.NAMESPACE.SVG) Z._contentType = "image/svg+xml";
      else Z._contentType = "application/xml";
      return Z
    },
    createHTMLDocument: function(Q) {
      var B = new au2(!0, null);
      B.appendChild(new su2(B, "html"));
      var G = B.createElement("html");
      B.appendChild(G);
      var Z = B.createElement("head");
      if (G.appendChild(Z), Q !== void 0) {
        var I = B.createElement("title");
        Z.appendChild(I), I.appendChild(B.createTextNode(Q))
      }
      return G.appendChild(B.createElement("body")), B.modclock = 1, B
    },
    mozSetOutputMutationHandler: function(A, Q) {
      A.mutationHandler = Q
    },
    mozGetInputMutationHandler: function(A) {
      i31.nyi()
    },
    mozHTMLParser: Qo5
  }
})
// @from(Start 12287885, End 12288655)
eu2 = z((UWZ, tu2) => {
  var Zo5 = _31(),
    Io5 = TG0();
  tu2.exports = mG0;

  function mG0(A, Q) {
    this._window = A, this._href = Q
  }
  mG0.prototype = Object.create(Io5.prototype, {
    constructor: {
      value: mG0
    },
    href: {
      get: function() {
        return this._href
      },
      set: function(A) {
        this.assign(A)
      }
    },
    assign: {
      value: function(A) {
        var Q = new Zo5(this._href),
          B = Q.resolve(A);
        this._href = B
      }
    },
    replace: {
      value: function(A) {
        this.assign(A)
      }
    },
    reload: {
      value: function() {
        this.assign(this.href)
      }
    },
    toString: {
      value: function() {
        return this.href
      }
    }
  })
})
// @from(Start 12288661, End 12289212)
Qm2 = z(($WZ, Am2) => {
  var Yo5 = Object.create(null, {
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
      value: function() {
        return !1
      }
    }
  });
  Am2.exports = Yo5
})
// @from(Start 12289218, End 12289352)
Gm2 = z((wWZ, Bm2) => {
  var Jo5 = {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  Bm2.exports = Jo5
})
// @from(Start 12289358, End 12289953)
cG0 = z((gTA, Zm2) => {
  var dG0 = dJ();
  gTA = Zm2.exports = {
    CSSStyleDeclaration: k31(),
    CharacterData: jTA(),
    Comment: DG0(),
    DOMException: E31(),
    DOMImplementation: hTA(),
    DOMTokenList: r70(),
    Document: b31(),
    DocumentFragment: CG0(),
    DocumentType: h31(),
    Element: cWA(),
    HTMLParser: l31(),
    NamedNodeMap: BG0(),
    Node: nD(),
    NodeList: h0A(),
    NodeFilter: yTA(),
    ProcessingInstruction: zG0(),
    Text: FG0(),
    Window: pG0()
  };
  dG0.merge(gTA, RG0());
  dG0.merge(gTA, x31().elements);
  dG0.merge(gTA, kG0().elements)
})
// @from(Start 12289959, End 12291354)
pG0 = z((qWZ, Im2) => {
  var Wo5 = hTA(),
    Xo5 = x70(),
    Vo5 = eu2(),
    uTA = dJ();
  Im2.exports = n31;

  function n31(A) {
    this.document = A || new Wo5(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new Vo5(this, this.document._address || "about:blank")
  }
  n31.prototype = Object.create(Xo5.prototype, {
    console: {
      value: console
    },
    history: {
      value: {
        back: uTA.nyi,
        forward: uTA.nyi,
        go: uTA.nyi
      }
    },
    navigator: {
      value: Qm2()
    },
    window: {
      get: function() {
        return this
      }
    },
    self: {
      get: function() {
        return this
      }
    },
    frames: {
      get: function() {
        return this
      }
    },
    parent: {
      get: function() {
        return this
      }
    },
    top: {
      get: function() {
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
      get: function() {
        return this._getEventHandler("load")
      },
      set: function(A) {
        this._setEventHandler("load", A)
      }
    },
    getComputedStyle: {
      value: function(Q) {
        return Q.style
      }
    }
  });
  uTA.expose(Gm2(), n31);
  uTA.expose(cG0(), n31)
})
// @from(Start 12291360, End 12292335)
Vm2 = z((Fo5) => {
  var Ym2 = hTA(),
    Jm2 = l31(),
    NWZ = pG0(),
    Wm2 = cG0();
  Fo5.createDOMImplementation = function() {
    return new Ym2(null)
  };
  Fo5.createDocument = function(A, Q) {
    if (A || Q) {
      var B = new Jm2;
      return B.parse(A || "", !0), B.document()
    }
    return new Ym2(null).createHTMLDocument("")
  };
  Fo5.createIncrementalHTMLParser = function() {
    var A = new Jm2;
    return {
      write: function(Q) {
        if (Q.length > 0) A.parse(Q, !1, function() {
          return !0
        })
      },
      end: function(Q) {
        A.parse(Q || "", !0, function() {
          return !0
        })
      },
      process: function(Q) {
        return A.parse("", !1, Q)
      },
      document: function() {
        return A.document()
      }
    }
  };
  Fo5.createWindow = function(A, Q) {
    var B = Fo5.createDocument(A);
    if (Q !== void 0) B._address = Q;
    return new Wm2.Window(B)
  };
  Fo5.impl = Wm2
})
// @from(Start 12292341, End 12307409)
Nm2 = z((MWZ, qm2) => {
  function Eo5(A) {
    for (var Q = 1; Q < arguments.length; Q++) {
      var B = arguments[Q];
      for (var G in B)
        if (B.hasOwnProperty(G)) A[G] = B[G]
    }
    return A
  }

  function aG0(A, Q) {
    return Array(Q + 1).join(A)
  }

  function zo5(A) {
    return A.replace(/^\n*/, "")
  }

  function Uo5(A) {
    var Q = A.length;
    while (Q > 0 && A[Q - 1] === `
`) Q--;
    return A.substring(0, Q)
  }
  var $o5 = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];

  function sG0(A) {
    return rG0(A, $o5)
  }
  var Dm2 = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

  function Hm2(A) {
    return rG0(A, Dm2)
  }

  function wo5(A) {
    return Em2(A, Dm2)
  }
  var Cm2 = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];

  function qo5(A) {
    return rG0(A, Cm2)
  }

  function No5(A) {
    return Em2(A, Cm2)
  }

  function rG0(A, Q) {
    return Q.indexOf(A.nodeName) >= 0
  }

  function Em2(A, Q) {
    return A.getElementsByTagName && Q.some(function(B) {
      return A.getElementsByTagName(B).length
    })
  }
  var HC = {};
  HC.paragraph = {
    filter: "p",
    replacement: function(A) {
      return `

` + A + `

`
    }
  };
  HC.lineBreak = {
    filter: "br",
    replacement: function(A, Q, B) {
      return B.br + `
`
    }
  };
  HC.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function(A, Q, B) {
      var G = Number(Q.nodeName.charAt(1));
      if (B.headingStyle === "setext" && G < 3) {
        var Z = aG0(G === 1 ? "=" : "-", A.length);
        return `

` + A + `
` + Z + `

`
      } else return `

` + aG0("#", G) + " " + A + `

`
    }
  };
  HC.blockquote = {
    filter: "blockquote",
    replacement: function(A) {
      return A = A.replace(/^\n+|\n+$/g, ""), A = A.replace(/^/gm, "> "), `

` + A + `

`
    }
  };
  HC.list = {
    filter: ["ul", "ol"],
    replacement: function(A, Q) {
      var B = Q.parentNode;
      if (B.nodeName === "LI" && B.lastElementChild === Q) return `
` + A;
      else return `

` + A + `

`
    }
  };
  HC.listItem = {
    filter: "li",
    replacement: function(A, Q, B) {
      A = A.replace(/^\n+/, "").replace(/\n+$/, `
`).replace(/\n/gm, `
    `);
      var G = B.bulletListMarker + "   ",
        Z = Q.parentNode;
      if (Z.nodeName === "OL") {
        var I = Z.getAttribute("start"),
          Y = Array.prototype.indexOf.call(Z.children, Q);
        G = (I ? Number(I) + Y : Y + 1) + ".  "
      }
      return G + A + (Q.nextSibling && !/\n$/.test(A) ? `
` : "")
    }
  };
  HC.indentedCodeBlock = {
    filter: function(A, Q) {
      return Q.codeBlockStyle === "indented" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
    },
    replacement: function(A, Q, B) {
      return `

    ` + Q.firstChild.textContent.replace(/\n/g, `
    `) + `

`
    }
  };
  HC.fencedCodeBlock = {
    filter: function(A, Q) {
      return Q.codeBlockStyle === "fenced" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
    },
    replacement: function(A, Q, B) {
      var G = Q.firstChild.getAttribute("class") || "",
        Z = (G.match(/language-(\S+)/) || [null, ""])[1],
        I = Q.firstChild.textContent,
        Y = B.fence.charAt(0),
        J = 3,
        W = new RegExp("^" + Y + "{3,}", "gm"),
        X;
      while (X = W.exec(I))
        if (X[0].length >= J) J = X[0].length + 1;
      var V = aG0(Y, J);
      return `

` + V + Z + `
` + I.replace(/\n$/, "") + `
` + V + `

`
    }
  };
  HC.horizontalRule = {
    filter: "hr",
    replacement: function(A, Q, B) {
      return `

` + B.hr + `

`
    }
  };
  HC.inlineLink = {
    filter: function(A, Q) {
      return Q.linkStyle === "inlined" && A.nodeName === "A" && A.getAttribute("href")
    },
    replacement: function(A, Q) {
      var B = Q.getAttribute("href");
      if (B) B = B.replace(/([()])/g, "\\$1");
      var G = a31(Q.getAttribute("title"));
      if (G) G = ' "' + G.replace(/"/g, "\\\"") + '"';
      return "[" + A + "](" + B + G + ")"
    }
  };
  HC.referenceLink = {
    filter: function(A, Q) {
      return Q.linkStyle === "referenced" && A.nodeName === "A" && A.getAttribute("href")
    },
    replacement: function(A, Q, B) {
      var G = Q.getAttribute("href"),
        Z = a31(Q.getAttribute("title"));
      if (Z) Z = ' "' + Z + '"';
      var I, Y;
      switch (B.linkReferenceStyle) {
        case "collapsed":
          I = "[" + A + "][]", Y = "[" + A + "]: " + G + Z;
          break;
        case "shortcut":
          I = "[" + A + "]", Y = "[" + A + "]: " + G + Z;
          break;
        default:
          var J = this.references.length + 1;
          I = "[" + A + "][" + J + "]", Y = "[" + J + "]: " + G + Z
      }
      return this.references.push(Y), I
    },
    references: [],
    append: function(A) {
      var Q = "";
      if (this.references.length) Q = `

` + this.references.join(`
`) + `

`, this.references = [];
      return Q
    }
  };
  HC.emphasis = {
    filter: ["em", "i"],
    replacement: function(A, Q, B) {
      if (!A.trim()) return "";
      return B.emDelimiter + A + B.emDelimiter
    }
  };
  HC.strong = {
    filter: ["strong", "b"],
    replacement: function(A, Q, B) {
      if (!A.trim()) return "";
      return B.strongDelimiter + A + B.strongDelimiter
    }
  };
  HC.code = {
    filter: function(A) {
      var Q = A.previousSibling || A.nextSibling,
        B = A.parentNode.nodeName === "PRE" && !Q;
      return A.nodeName === "CODE" && !B
    },
    replacement: function(A) {
      if (!A) return "";
      A = A.replace(/\r?\n|\r/g, " ");
      var Q = /^`|^ .*?[^ ].* $|`$/.test(A) ? " " : "",
        B = "`",
        G = A.match(/`+/gm) || [];
      while (G.indexOf(B) !== -1) B = B + "`";
      return B + Q + A + Q + B
    }
  };
  HC.image = {
    filter: "img",
    replacement: function(A, Q) {
      var B = a31(Q.getAttribute("alt")),
        G = Q.getAttribute("src") || "",
        Z = a31(Q.getAttribute("title")),
        I = Z ? ' "' + Z + '"' : "";
      return G ? "![" + B + "](" + G + I + ")" : ""
    }
  };

  function a31(A) {
    return A ? A.replace(/(\n+\s*)+/g, `
`) : ""
  }

  function zm2(A) {
    this.options = A, this._keep = [], this._remove = [], this.blankRule = {
      replacement: A.blankReplacement
    }, this.keepReplacement = A.keepReplacement, this.defaultRule = {
      replacement: A.defaultReplacement
    }, this.array = [];
    for (var Q in A.rules) this.array.push(A.rules[Q])
  }
  zm2.prototype = {
    add: function(A, Q) {
      this.array.unshift(Q)
    },
    keep: function(A) {
      this._keep.unshift({
        filter: A,
        replacement: this.keepReplacement
      })
    },
    remove: function(A) {
      this._remove.unshift({
        filter: A,
        replacement: function() {
          return ""
        }
      })
    },
    forNode: function(A) {
      if (A.isBlank) return this.blankRule;
      var Q;
      if (Q = lG0(this.array, A, this.options)) return Q;
      if (Q = lG0(this._keep, A, this.options)) return Q;
      if (Q = lG0(this._remove, A, this.options)) return Q;
      return this.defaultRule
    },
    forEach: function(A) {
      for (var Q = 0; Q < this.array.length; Q++) A(this.array[Q], Q)
    }
  };

  function lG0(A, Q, B) {
    for (var G = 0; G < A.length; G++) {
      var Z = A[G];
      if (Lo5(Z, Q, B)) return Z
    }
    return
  }

  function Lo5(A, Q, B) {
    var G = A.filter;
    if (typeof G === "string") {
      if (G === Q.nodeName.toLowerCase()) return !0
    } else if (Array.isArray(G)) {
      if (G.indexOf(Q.nodeName.toLowerCase()) > -1) return !0
    } else if (typeof G === "function") {
      if (G.call(A, Q, B)) return !0
    } else throw TypeError("`filter` needs to be a string, array, or function")
  }

  function Mo5(A) {
    var {
      element: Q,
      isBlock: B,
      isVoid: G
    } = A, Z = A.isPre || function(F) {
      return F.nodeName === "PRE"
    };
    if (!Q.firstChild || Z(Q)) return;
    var I = null,
      Y = !1,
      J = null,
      W = Fm2(J, Q, Z);
    while (W !== Q) {
      if (W.nodeType === 3 || W.nodeType === 4) {
        var X = W.data.replace(/[ \r\n\t]+/g, " ");
        if ((!I || / $/.test(I.data)) && !Y && X[0] === " ") X = X.substr(1);
        if (!X) {
          W = iG0(W);
          continue
        }
        W.data = X, I = W
      } else if (W.nodeType === 1) {
        if (B(W) || W.nodeName === "BR") {
          if (I) I.data = I.data.replace(/ $/, "");
          I = null, Y = !1
        } else if (G(W) || Z(W)) I = null, Y = !0;
        else if (I) Y = !1
      } else {
        W = iG0(W);
        continue
      }
      var V = Fm2(J, W, Z);
      J = W, W = V
    }
    if (I) {
      if (I.data = I.data.replace(/ $/, ""), !I.data) iG0(I)
    }
  }

  function iG0(A) {
    var Q = A.nextSibling || A.parentNode;
    return A.parentNode.removeChild(A), Q
  }

  function Fm2(A, Q, B) {
    if (A && A.parentNode === Q || B(Q)) return Q.nextSibling || Q.parentNode;
    return Q.firstChild || Q.nextSibling || Q.parentNode
  }
  var Um2 = typeof window < "u" ? window : {};

  function Oo5() {
    var A = Um2.DOMParser,
      Q = !1;
    try {
      if (new A().parseFromString("", "text/html")) Q = !0
    } catch (B) {}
    return Q
  }

  function Ro5() {
    var A = function() {};
    {
      var Q = Vm2();
      A.prototype.parseFromString = function(B) {
        return Q.createDocument(B)
      }
    }
    return A
  }
  var To5 = Oo5() ? Um2.DOMParser : Ro5();

  function Po5(A, Q) {
    var B;
    if (typeof A === "string") {
      var G = jo5().parseFromString('<x-turndown id="turndown-root">' + A + "</x-turndown>", "text/html");
      B = G.getElementById("turndown-root")
    } else B = A.cloneNode(!0);
    return Mo5({
      element: B,
      isBlock: sG0,
      isVoid: Hm2,
      isPre: Q.preformattedCode ? So5 : null
    }), B
  }
  var nG0;

  function jo5() {
    return nG0 = nG0 || new To5, nG0
  }

  function So5(A) {
    return A.nodeName === "PRE" || A.nodeName === "CODE"
  }

  function _o5(A, Q) {
    return A.isBlock = sG0(A), A.isCode = A.nodeName === "CODE" || A.parentNode.isCode, A.isBlank = ko5(A), A.flankingWhitespace = yo5(A, Q), A
  }

  function ko5(A) {
    return !Hm2(A) && !qo5(A) && /^\s*$/i.test(A.textContent) && !wo5(A) && !No5(A)
  }

  function yo5(A, Q) {
    if (A.isBlock || Q.preformattedCode && A.isCode) return {
      leading: "",
      trailing: ""
    };
    var B = xo5(A.textContent);
    if (B.leadingAscii && Km2("left", A, Q)) B.leading = B.leadingNonAscii;
    if (B.trailingAscii && Km2("right", A, Q)) B.trailing = B.trailingNonAscii;
    return {
      leading: B.leading,
      trailing: B.trailing
    }
  }

  function xo5(A) {
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

  function Km2(A, Q, B) {
    var G, Z, I;
    if (A === "left") G = Q.previousSibling, Z = / $/;
    else G = Q.nextSibling, Z = /^ /;
    if (G) {
      if (G.nodeType === 3) I = Z.test(G.nodeValue);
      else if (B.preformattedCode && G.nodeName === "CODE") I = !1;
      else if (G.nodeType === 1 && !sG0(G)) I = Z.test(G.textContent)
    }
    return I
  }
  var vo5 = Array.prototype.reduce,
    bo5 = [
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

  function s31(A) {
    if (!(this instanceof s31)) return new s31(A);
    var Q = {
      rules: HC,
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
      blankReplacement: function(B, G) {
        return G.isBlock ? `

` : ""
      },
      keepReplacement: function(B, G) {
        return G.isBlock ? `

` + G.outerHTML + `

` : G.outerHTML
      },
      defaultReplacement: function(B, G) {
        return G.isBlock ? `

` + B + `

` : B
      }
    };
    this.options = Eo5({}, Q, A), this.rules = new zm2(this.options)
  }
  s31.prototype = {
    turndown: function(A) {
      if (!go5(A)) throw TypeError(A + " is not a string, or an element/document/fragment node.");
      if (A === "") return "";
      var Q = $m2.call(this, new Po5(A, this.options));
      return fo5.call(this, Q)
    },
    use: function(A) {
      if (Array.isArray(A))
        for (var Q = 0; Q < A.length; Q++) this.use(A[Q]);
      else if (typeof A === "function") A(this);
      else throw TypeError("plugin must be a Function or an Array of Functions");
      return this
    },
    addRule: function(A, Q) {
      return this.rules.add(A, Q), this
    },
    keep: function(A) {
      return this.rules.keep(A), this
    },
    remove: function(A) {
      return this.rules.remove(A), this
    },
    escape: function(A) {
      return bo5.reduce(function(Q, B) {
        return Q.replace(B[0], B[1])
      }, A)
    }
  };

  function $m2(A) {
    var Q = this;
    return vo5.call(A.childNodes, function(B, G) {
      G = new _o5(G, Q.options);
      var Z = "";
      if (G.nodeType === 3) Z = G.isCode ? G.nodeValue : Q.escape(G.nodeValue);
      else if (G.nodeType === 1) Z = ho5.call(Q, G);
      return wm2(B, Z)
    }, "")
  }

  function fo5(A) {
    var Q = this;
    return this.rules.forEach(function(B) {
      if (typeof B.append === "function") A = wm2(A, B.append(Q.options))
    }), A.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
  }

  function ho5(A) {
    var Q = this.rules.forNode(A),
      B = $m2.call(this, A),
      G = A.flankingWhitespace;
    if (G.leading || G.trailing) B = B.trim();
    return G.leading + Q.replacement(B, A, this.options) + G.trailing
  }

  function wm2(A, Q) {
    var B = Uo5(A),
      G = zo5(Q),
      Z = Math.max(A.length - B.length, Q.length - G.length),
      I = `

`.substring(0, Z);
    return B + I + G
  }

  function go5(A) {
    return A != null && (typeof A === "string" || A.nodeType && (A.nodeType === 1 || A.nodeType === 9 || A.nodeType === 11))
  }
  qm2.exports = s31
})
// @from(Start 12307412, End 12307533)
function uo5() {
  let A = Date.now();
  for (let [Q, B] of r31.entries())
    if (A - B.timestamp > Om2) r31.delete(Q)
}
// @from(Start 12307535, End 12307759)
function co5(A) {
  if (A.length > mo5) return !1;
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
// @from(Start 12307760, End 12308221)
async function po5(A) {
  try {
    let Q = await YQ.get(`https://claude.ai/api/web/domain_info?domain=${encodeURIComponent(A)}`);
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
    return AA(Q), {
      status: "check_failed",
      error: Q
    }
  }
}
// @from(Start 12308223, End 12308575)
function lo5(A, Q) {
  try {
    let B = new URL(A),
      G = new URL(Q);
    if (G.protocol !== B.protocol) return !1;
    if (G.port !== B.port) return !1;
    if (G.username || G.password) return !1;
    let Z = (J) => J.replace(/^www\./, ""),
      I = Z(B.hostname),
      Y = Z(G.hostname);
    return I === Y
  } catch (B) {
    return !1
  }
}
// @from(Start 12308576, End 12309288)
async function Rm2(A, Q, B) {
  try {
    return await YQ.get(A, {
      signal: Q,
      maxRedirects: 0,
      responseType: "arraybuffer",
      maxContentLength: do5,
      headers: {
        Accept: "text/markdown, text/html, */*"
      }
    })
  } catch (G) {
    if (YQ.isAxiosError(G) && G.response && [301, 302, 307, 308].includes(G.response.status)) {
      let Z = G.response.headers.location;
      if (!Z) throw Error("Redirect missing Location header");
      let I = new URL(Z, A).toString();
      if (B(A, I)) return Rm2(I, Q, B);
      else return {
        type: "redirect",
        originalUrl: A,
        redirectUrl: I,
        statusCode: G.response.status
      }
    }
    throw G
  }
}
// @from(Start 12309290, End 12309355)
function io5(A) {
  return "type" in A && A.type === "redirect"
}
// @from(Start 12309356, End 12310594)
async function Tm2(A, Q) {
  if (!co5(A)) throw Error("Invalid URL");
  uo5();
  let B = Date.now(),
    G = r31.get(A);
  if (G && B - G.timestamp < Om2) return {
    bytes: G.bytes,
    code: G.code,
    codeText: G.codeText,
    content: G.content
  };
  let Z, I = A;
  try {
    if (Z = new URL(A), Z.protocol === "http:") Z.protocol = "https:", I = Z.toString();
    let F = Z.hostname;
    if (!l0().skipWebFetchPreflight) switch ((await po5(F)).status) {
      case "allowed":
        break;
      case "blocked":
        throw new oG0(F);
      case "check_failed":
        throw new tG0(F)
    }
  } catch (F) {
    if (AA(F), F instanceof oG0 || F instanceof tG0) throw F
  }
  let Y = await Rm2(I, Q.signal, lo5);
  if (io5(Y)) return Y;
  let J = Buffer.from(Y.data).toString("utf-8"),
    W = Y.headers["content-type"] ?? "",
    X = Buffer.byteLength(J),
    V;
  if (W.includes("text/html")) V = new Mm2.default().turndown(J);
  else V = J;
  if (V.length > Lm2) V = V.substring(0, Lm2) + "...[content truncated]";
  return r31.set(A, {
    bytes: X,
    code: Y.status,
    codeText: Y.statusText,
    content: V,
    timestamp: B
  }), {
    code: Y.status,
    codeText: Y.statusText,
    content: V,
    bytes: X
  }
}
// @from(Start 12310595, End 12311134)
async function Pm2(A, Q, B, G) {
  let Z = ld0(Q, A),
    I = await uX({
      systemPrompt: [],
      userPrompt: Z,
      signal: B,
      options: {
        querySource: "web_fetch_apply",
        agents: [],
        isNonInteractiveSession: G,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        agentIdOrSessionId: e1()
      }
    });
  if (B.aborted) throw new WW;
  let {
    content: Y
  } = I.message;
  if (Y.length > 0) {
    let J = Y[0];
    if ("text" in J) return J.text
  }
  return "No response from model"
}
// @from(Start 12311139, End 12311142)
Mm2
// @from(Start 12311144, End 12311147)
oG0
// @from(Start 12311149, End 12311152)
tG0
// @from(Start 12311154, End 12311157)
r31
// @from(Start 12311159, End 12311171)
Om2 = 900000
// @from(Start 12311175, End 12311185)
mo5 = 2000
// @from(Start 12311189, End 12311203)
do5 = 10485760
// @from(Start 12311207, End 12311216)
Lm2 = 1e5
// @from(Start 12311222, End 12311763)
jm2 = L(() => {
  O3();
  fZ();
  q0();
  RZ();
  g1();
  MB();
  _0();
  Mm2 = BA(Nm2(), 1);
  oG0 = class oG0 extends Error {
    constructor(A) {
      super(`Claude Code is unable to fetch from ${A}`);
      this.name = "DomainBlockedError"
    }
  };
  tG0 = class tG0 extends Error {
    constructor(A) {
      super(`Unable to verify if domain ${A} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
      this.name = "DomainCheckFailedError"
    }
  };
  r31 = new Map
})
// @from(Start 12311769, End 12311772)
Sm2
// @from(Start 12311778, End 12313390)
_m2 = L(() => {
  Sm2 = new Set(["docs.anthropic.com", "docs.claude.com", "code.claude.com", "modelcontextprotocol.io", "docs.python.org", "en.cppreference.com", "docs.oracle.com", "learn.microsoft.com", "developer.mozilla.org", "go.dev", "www.php.net", "docs.swift.org", "kotlinlang.org", "ruby-doc.org", "doc.rust-lang.org", "www.typescriptlang.org", "react.dev", "angular.io", "vuejs.org", "nextjs.org", "expressjs.com", "nodejs.org", "jquery.com", "getbootstrap.com", "tailwindcss.com", "d3js.org", "threejs.org", "redux.js.org", "webpack.js.org", "jestjs.io", "reactrouter.com", "docs.djangoproject.com", "flask.palletsprojects.com", "fastapi.tiangolo.com", "pandas.pydata.org", "numpy.org", "www.tensorflow.org", "pytorch.org", "scikit-learn.org", "matplotlib.org", "requests.readthedocs.io", "jupyter.org", "laravel.com", "symfony.com", "wordpress.org", "docs.spring.io", "hibernate.org", "tomcat.apache.org", "gradle.org", "maven.apache.org", "asp.net", "dotnet.microsoft.com", "nuget.org", "blazor.net", "reactnative.dev", "docs.flutter.dev", "developer.apple.com", "developer.android.com", "keras.io", "spark.apache.org", "huggingface.co", "www.kaggle.com", "www.mongodb.com", "redis.io", "www.postgresql.org", "dev.mysql.com", "www.sqlite.org", "graphql.org", "prisma.io", "docs.aws.amazon.com", "cloud.google.com", "learn.microsoft.com", "kubernetes.io", "www.docker.com", "www.terraform.io", "www.ansible.com", "vercel.com/docs", "docs.netlify.com", "devcenter.heroku.com/", "cypress.io", "selenium.dev", "docs.unity.com", "docs.unrealengine.com", "git-scm.com", "nginx.org", "httpd.apache.org"])
})
// @from(Start 12313393, End 12313548)
function km2({
  url: A,
  prompt: Q
}, {
  verbose: B
}) {
  if (!A) return null;
  if (B) return `url: "${A}"${B&&Q?`, prompt: "${Q}"`:""}`;
  return A
}
// @from(Start 12313550, End 12313612)
function ym2() {
  return H$.default.createElement(k5, null)
}
// @from(Start 12313614, End 12313726)
function xm2(A, {
  verbose: Q
}) {
  return H$.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 12313728, End 12313871)
function vm2() {
  return H$.default.createElement(S0, {
    height: 1
  }, H$.default.createElement($, {
    dimColor: !0
  }, "Fetching…"))
}
// @from(Start 12313873, End 12314518)
function bm2({
  bytes: A,
  code: Q,
  codeText: B,
  result: G
}, Z, {
  verbose: I
}) {
  let Y = UJ(A);
  if (I) return H$.default.createElement(S, {
    flexDirection: "column"
  }, H$.default.createElement(S0, {
    height: 1
  }, H$.default.createElement($, null, "Received ", H$.default.createElement($, {
    bold: !0
  }, Y), " (", Q, " ", B, ")")), H$.default.createElement(S, {
    flexDirection: "column"
  }, H$.default.createElement($, null, G)));
  return H$.default.createElement(S0, {
    height: 1
  }, H$.default.createElement($, null, "Received ", H$.default.createElement($, {
    bold: !0
  }, Y), " (", Q, " ", B, ")"))
}
// @from(Start 12314520, End 12314590)
function fm2(A) {
  if (!A?.url) return null;
  return J7(A.url, $k)
}
// @from(Start 12314595, End 12314597)
H$
// @from(Start 12314603, End 12314680)
hm2 = L(() => {
  hA();
  q8();
  iX();
  yJ();
  R9();
  H$ = BA(VA(), 1)
})
// @from(Start 12314683, End 12314936)
function so5(A) {
  try {
    let Q = nV.inputSchema.safeParse(A);
    if (!Q.success) return `input:${A.toString()}`;
    let {
      url: B
    } = Q.data;
    return `domain:${new URL(B).hostname}`
  } catch {
    return `input:${A.toString()}`
  }
}
// @from(Start 12314941, End 12314944)
no5
// @from(Start 12314946, End 12314949)
ao5
// @from(Start 12314951, End 12314953)
nV
// @from(Start 12314959, End 12319982)
oWA = L(() => {
  Q2();
  jm2();
  AZ();
  _m2();
  hm2();
  no5 = j.strictObject({
    url: j.string().url().describe("The URL to fetch content from"),
    prompt: j.string().describe("The prompt to run on the fetched content")
  }), ao5 = j.object({
    bytes: j.number().describe("Size of the fetched content in bytes"),
    code: j.number().describe("HTTP response code"),
    codeText: j.string().describe("HTTP response code text"),
    result: j.string().describe("Processed result from applying the prompt to the content"),
    durationMs: j.number().describe("Time taken to fetch and process the content"),
    url: j.string().describe("The URL that was fetched")
  });
  nV = {
    name: $X,
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
    getToolUseSummary: fm2,
    isEnabled() {
      return !0
    },
    inputSchema: no5,
    outputSchema: ao5,
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
          url: W
        } = A, X = new URL(W), V = X.hostname, F = X.pathname;
        for (let K of Sm2)
          if (K.includes("/")) {
            let [D, ...H] = K.split("/"), C = "/" + H.join("/");
            if (V === D && F.startsWith(C)) return {
              behavior: "allow",
              updatedInput: A,
              decisionReason: {
                type: "other",
                reason: "Preapproved host and path"
              }
            }
          } else if (V === K) return {
          behavior: "allow",
          updatedInput: A,
          decisionReason: {
            type: "other",
            reason: "Preapproved host"
          }
        }
      } catch {}
      let Z = so5(A),
        I = fU(G, nV, "deny").get(Z);
      if (I) return {
        behavior: "deny",
        message: `${nV.name} denied access to ${Z}.`,
        decisionReason: {
          type: "rule",
          rule: I
        }
      };
      let Y = fU(G, nV, "ask").get(Z);
      if (Y) return {
        behavior: "ask",
        message: `Claude requested permissions to use ${nV.name}, but you haven't granted it yet.`,
        decisionReason: {
          type: "rule",
          rule: Y
        }
      };
      let J = fU(G, nV, "allow").get(Z);
      if (J) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
          type: "rule",
          rule: J
        }
      };
      return {
        behavior: "ask",
        message: `Claude requested permissions to use ${nV.name}, but you haven't granted it yet.`
      }
    },
    async prompt() {
      return pd0
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
    renderToolUseMessage: km2,
    renderToolUseRejectedMessage: ym2,
    renderToolUseErrorMessage: xm2,
    renderToolUseProgressMessage: vm2,
    renderToolResultMessage: bm2,
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
        I = await Tm2(A, B);
      if ("type" in I && I.type === "redirect") {
        let K = I.statusCode === 301 ? "Moved Permanently" : I.statusCode === 308 ? "Permanent Redirect" : I.statusCode === 307 ? "Temporary Redirect" : "Found",
          D = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${I.originalUrl}
Redirect URL: ${I.redirectUrl}
Status: ${I.statusCode} ${K}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${I.redirectUrl}"
- prompt: "${Q}"`;
        return {
          data: {
            bytes: Buffer.byteLength(D),
            code: I.statusCode,
            codeText: K,
            result: D,
            durationMs: Date.now() - Z,
            url: A
          }
        }
      }
      let {
        content: Y,
        bytes: J,
        code: W,
        codeText: X
      } = I, V = await Pm2(Q, Y, B.signal, G);
      return {
        data: {
          bytes: J,
          code: W,
          codeText: X,
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
// @from(Start 12319985, End 12320238)
function ro5(A) {
  try {
    let Q = nV.inputSchema.safeParse(A);
    if (!Q.success) return `input:${A.toString()}`;
    let {
      url: B
    } = Q.data;
    return `domain:${new URL(B).hostname}`
  } catch {
    return `input:${A.toString()}`
  }
}
// @from(Start 12320240, End 12322096)
function gm2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G
}) {
  let [Z] = qB(), {
    url: I
  } = A.input, Y = new URL(I).hostname, J = mP.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  V$(A, J);
  let W = [{
    label: "Yes",
    value: "yes"
  }, {
    label: `Yes, and don't ask again for ${tA.bold(Y)}`,
    value: "yes-dont-ask-again-domain"
  }, {
    label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
    value: "no"
  }];

  function X(V) {
    switch (V) {
      case "yes":
        fn("tool_use_single", A, "accept"), A.onAllow(A.input, []), Q();
        break;
      case "yes-dont-ask-again-domain": {
        fn("tool_use_single", A, "accept");
        let F = ro5(A.input),
          K = {
            toolName: A.tool.name,
            ruleContent: F
          };
        A.onAllow(A.input, [{
          type: "addRules",
          rules: [K],
          behavior: "allow",
          destination: "localSettings"
        }]), Q();
        break
      }
      case "no":
        fn("tool_use_single", A, "reject"), A.onReject(), B(), Q();
        break
    }
  }
  return mP.default.createElement(uJ, {
    title: "Fetch"
  }, mP.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, mP.default.createElement($, null, nV.renderToolUseMessage(A.input, {
    theme: Z,
    verbose: G
  })), mP.default.createElement($, {
    dimColor: !0
  }, A.description)), mP.default.createElement(S, {
    flexDirection: "column"
  }, mP.default.createElement(VC, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), mP.default.createElement($, null, "Do you want to allow Claude to fetch this content?"), mP.default.createElement(M0, {
    options: W,
    onChange: X,
    onCancel: () => X("no")
  })))
}
// @from(Start 12322101, End 12322103)
mP
// @from(Start 12322109, End 12322212)
um2 = L(() => {
  hA();
  oWA();
  vn();
  wO();
  R70();
  S5();
  F9();
  Gg();
  mP = BA(VA(), 1)
})
// @from(Start 12322257, End 12324765)
function mm2({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z = "replace",
  verbose: I,
  width: Y
}) {
  let J = tWA.useMemo(() => RA().existsSync(A), [A]),
    W = tWA.useMemo(() => {
      if (!J) return null;
      try {
        let D = _q(A);
        return f7(D)
      } catch (D) {
        return null
      }
    }, [A, J]),
    X = tWA.useMemo(() => {
      if (!W || !Q) return "";
      let D = S$A(Q);
      if (D !== void 0) {
        if (W.cells[D]) {
          let C = W.cells[D].source;
          return Array.isArray(C) ? C.join("") : C
        }
        return ""
      }
      let H = W.cells.find((C) => C.id === Q);
      if (!H) return "";
      return Array.isArray(H.source) ? H.source.join("") : H.source
    }, [W, Q]),
    V = tWA.useMemo(() => {
      if (!W || !W.metadata.language_info) return "python";
      return W.metadata.language_info.name || "python"
    }, [W]),
    F = tWA.useMemo(() => {
      if (!J || Z === "insert" || Z === "delete") return null;
      return Uq({
        filePath: A,
        fileContents: X,
        edits: [{
          old_string: X,
          new_string: B,
          replace_all: !1
        }],
        ignoreWhitespace: !1
      })
    }, [J, A, X, B, Z]),
    K;
  switch (Z) {
    case "insert":
      K = "Insert new cell";
      break;
    case "delete":
      K = "Delete cell";
      break;
    default:
      K = "Replace cell contents"
  }
  return MI.createElement(S, {
    flexDirection: "column"
  }, MI.createElement(S, {
    borderDimColor: !0,
    borderStyle: "round",
    flexDirection: "column",
    paddingX: 1
  }, MI.createElement(S, {
    paddingBottom: 1,
    flexDirection: "column"
  }, MI.createElement($, {
    bold: !0
  }, I ? A : oo5(W0(), A)), MI.createElement($, {
    dimColor: !0
  }, K, " for cell ", Q, G ? ` (${G})` : "")), Z === "delete" ? MI.createElement(S, {
    flexDirection: "column",
    paddingLeft: 2
  }, MI.createElement(CO, {
    code: X,
    language: V
  })) : Z === "insert" ? MI.createElement(S, {
    flexDirection: "column",
    paddingLeft: 2
  }, MI.createElement(CO, {
    code: B,
    language: G === "markdown" ? "markdown" : V
  })) : F ? dV(F.map((D) => MI.createElement(J$, {
    key: D.newStart,
    patch: D,
    dim: !1,
    width: Y,
    filePath: A
  })), (D) => MI.createElement($, {
    dimColor: !0,
    key: `ellipsis-${D}`
  }, "...")) : MI.createElement(CO, {
    code: B,
    language: G === "markdown" ? "markdown" : V
  })))
}
// @from(Start 12324770, End 12324772)
MI
// @from(Start 12324774, End 12324777)
tWA
// @from(Start 12324783, End 12324913)
dm2 = L(() => {
  En();
  hA();
  U2();
  FWA();
  Rh();
  R9();
  LF();
  AQ();
  LrA();
  MI = BA(VA(), 1), tWA = BA(VA(), 1)
})
// @from(Start 12324958, End 12326230)
function cm2(A) {
  let Q = (W) => {
      let X = kP.inputSchema.safeParse(W);
      if (!X.success) return AA(Error(`Failed to parse notebook edit input: ${X.error.message}`)), {
        notebook_path: "",
        new_source: "",
        cell_id: ""
      };
      return X.data
    },
    B = Q(A.toolUseConfirm.input),
    {
      notebook_path: G,
      edit_mode: Z,
      cell_type: I
    } = B,
    Y = I === "markdown" ? "markdown" : "python",
    J = Z === "insert" ? "insert this cell into" : Z === "delete" ? "delete this cell from" : "make this edit to";
  return mTA.default.createElement(bn, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: "Edit notebook",
    question: mTA.default.createElement($, null, "Do you want to ", J, " ", mTA.default.createElement($, {
      bold: !0
    }, to5(G)), "?"),
    content: mTA.default.createElement(mm2, {
      notebook_path: B.notebook_path,
      cell_id: B.cell_id,
      new_source: B.new_source,
      cell_type: B.cell_type,
      edit_mode: B.edit_mode,
      verbose: A.verbose,
      width: A.verbose ? 120 : 80
    }),
    path: G,
    completionType: "tool_use_single",
    languageName: Y,
    parseInput: Q
  })
}
// @from(Start 12326235, End 12326238)
mTA
// @from(Start 12326244, End 12326325)
pm2 = L(() => {
  hA();
  DWA();
  dm2();
  UTA();
  g1();
  mTA = BA(VA(), 1)
})
// @from(Start 12326331, End 12326353)
pJ = "AskUserQuestion"
// @from(Start 12326357, End 12326365)
lm2 = 12
// @from(Start 12326369, End 12326520)
im2 = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."
// @from(Start 12326524, End 12326984)
nm2 = `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
`
// @from(Start 12326990, End 12326993)
TXZ
// @from(Start 12326995, End 12326998)
am2
// @from(Start 12327004, End 12330373)
sm2 = L(() => {
  TXZ = `Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the ${pJ} tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use ${pJ} first, then use exit plan mode tool after clarifying the approach.
`, am2 = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the ${pJ} tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Edit your plan file to incorporate user feedback
5. Only proceed with ExitPlanMode after resolving ambiguities and updating the plan file

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use ${pJ} first, then use exit plan mode tool after clarifying the approach.
`
})
// @from(Start 12330379, End 12330381)
rD
// @from(Start 12330387, End 12330456)
dn = L(() => {
  c5();
  rD = d0.platform === "darwin" ? "⏺" : "●"
})
// @from(Start 12330459, End 12330879)
function o31({
  plan: A,
  themeName: Q
}) {
  return dP.createElement(S0, null, dP.createElement(S, {
    flexDirection: "column"
  }, dP.createElement($, {
    color: "error"
  }, "User rejected Claude's plan:"), dP.createElement(S, {
    borderStyle: "round",
    borderColor: "planMode",
    borderDimColor: !0,
    paddingX: 1,
    overflow: "hidden"
  }, dP.createElement($, {
    dimColor: !0
  }, fD(A, Q)))))
}
// @from(Start 12330884, End 12330886)
dP
// @from(Start 12330892, End 12330953)
eG0 = L(() => {
  hA();
  wh();
  q8();
  dP = BA(VA(), 1)
})
// @from(Start 12330956, End 12330988)
function rm2() {
  return null
}
// @from(Start 12330990, End 12331022)
function om2() {
  return null
}
// @from(Start 12331024, End 12331633)
function tm2(A, Q, {
  theme: B
}) {
  let {
    plan: G
  } = A, Z = "filePath" in A ? A.filePath : void 0, I = Z ? Q5(Z) : "";
  return mW.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, mW.createElement(S, {
    flexDirection: "row"
  }, mW.createElement($, {
    color: ZS("plan")
  }, rD), mW.createElement($, null, " User approved Claude's plan")), mW.createElement(S0, null, mW.createElement(S, {
    flexDirection: "column"
  }, Z && mW.createElement($, {
    dimColor: !0
  }, "Plan saved to: ", I, " · /plan to edit"), mW.createElement($, {
    dimColor: !0
  }, fD(G, B)))))
}
// @from(Start 12331635, End 12331846)
function em2({
  plan: A
}, {
  theme: Q
}) {
  let B = A ?? xU() ?? "No plan found";
  return mW.createElement(S, {
    flexDirection: "column"
  }, mW.createElement(o31, {
    plan: B,
    themeName: Q
  }))
}
// @from(Start 12331848, End 12331880)
function Ad2() {
  return null
}
// @from(Start 12331885, End 12331887)
mW
// @from(Start 12331893, End 12331995)
Qd2 = L(() => {
  hA();
  wh();
  q8();
  dn();
  eG0();
  Zw();
  NE();
  R9();
  mW = BA(VA(), 1)
})
// @from(Start 12332001, End 12332004)
eo5
// @from(Start 12332006, End 12332009)
At5
// @from(Start 12332011, End 12332013)
gq
// @from(Start 12332019, End 12334045)
dTA = L(() => {
  Q2();
  _0();
  sm2();
  Qd2();
  NE();
  eo5 = j.strictObject({}).passthrough(), At5 = j.object({
    plan: j.string().describe("The plan that was presented to the user"),
    isAgent: j.boolean(),
    filePath: j.string().optional().describe("The file path where the plan was saved")
  }), gq = {
    name: rRA,
    async description() {
      return "Prompts the user to exit plan mode and start coding"
    },
    async prompt() {
      return am2
    },
    inputSchema: eo5,
    outputSchema: At5,
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
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: A
      }
    },
    renderToolUseMessage: rm2,
    renderToolUseProgressMessage: om2,
    renderToolResultMessage: tm2,
    renderToolUseRejectedMessage: em2,
    renderToolUseErrorMessage: Ad2,
    async call(A, Q) {
      let B = e1(),
        G = Q.agentId !== B,
        Z = yU(Q.agentId),
        I = xU(Q.agentId);
      if (!I) throw Error(`No plan file found at ${Z}. Please write your plan to this file before calling ExitPlanMode.`);
      return {
        data: {
          plan: I,
          isAgent: G,
          filePath: Z
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      isAgent: A,
      plan: Q,
      filePath: B
    }, G) {
      if (A) return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: G
      };
      return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${B}
You can refer back to it if needed during implementation.

## Approved Plan:
${Q}`,
        tool_use_id: G
      }
    }
  }
})
// @from(Start 12334099, End 12334281)
function Qt5(A) {
  try {
    let Q = process.platform === "win32" ? "where" : "which";
    return Bd2(`${Q} ${A}`, {
      stdio: "ignore"
    }), !0
  } catch {
    return !1
  }
}
// @from(Start 12334282, End 12334417)
async function cn(A) {
  let Q = Jg();
  if (!Q) throw Error("No editor available");
  Bd2(`${Q} "${A}"`, {
    stdio: "inherit"
  })
}
// @from(Start 12334422, End 12334424)
Jg
// @from(Start 12334430, End 12334740)
pn = L(() => {
  l2();
  Jg = s1(() => {
    if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
    if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
    if (process.platform === "win32") return "start /wait notepad";
    return ["code", "vi", "nano"].find((Q) => Qt5(Q))
  })
})
// @from(Start 12334865, End 12334967)
function t31(A = "claude-prompt", Q = ".md") {
  let B = Zt5();
  return Bt5(Gt5(), `${A}-${B}${Q}`)
}
// @from(Start 12334972, End 12334986)
AZ0 = () => {}
// @from(Start 12335040, End 12335132)
function Wt5(A) {
  let Q = A.split(" ")[0] ?? "";
  return Jt5.some((B) => Q.includes(B))
}
// @from(Start 12335134, End 12335784)
function QZ0(A) {
  let Q = RA(),
    B = Qf.get(process.stdout);
  if (!B) throw Error("Ink instance not found - cannot pause rendering");
  let G = Jg();
  if (!G) return null;
  if (!Q.existsSync(A)) return null;
  let Z = !Wt5(G);
  try {
    if (B.pause(), B.suspendStdin(), Z) process.stdout.write("\x1B[?1049h\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H");
    let I = Yt5[G] ?? G;
    return It5(`${I} "${A}"`, {
      stdio: "inherit"
    }), Q.readFileSync(A, {
      encoding: "utf-8"
    })
  } catch (I) {
    return null
  } finally {
    if (Z) process.stdout.write("\x1B[?1049l\x1B[?1004h\x1B[?25l");
    B.resumeStdin(), B.resume()
  }
}
// @from(Start 12335786, End 12336142)
function e31(A) {
  let Q = RA(),
    B = t31();
  try {
    Q.writeFileSync(B, A, {
      encoding: "utf-8",
      flush: !0
    });
    let G = QZ0(B);
    if (G === null) return null;
    if (G.endsWith(`
`) && !G.endsWith(`

`)) return G.slice(0, -1);
    return G
  } finally {
    try {
      if (Q.existsSync(B)) Q.unlinkSync(B)
    } catch {}
  }
}
// @from(Start 12336147, End 12336150)
Yt5
// @from(Start 12336152, End 12336155)
Jt5
// @from(Start 12336161, End 12336337)
BZ0 = L(() => {
  pn();
  AQ();
  AZ0();
  uaA();
  Yt5 = {
    code: "code -w",
    subl: "subl --wait"
  }, Jt5 = ["code", "subl", "atom", "gedit", "notepad++", "notepad"]
})
// @from(Start 12336340, End 12340477)
function Gd2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  let [G] = qB(), [Z] = OQ(), [I, Y] = qG.useState(""), [J, W] = qG.useState(null), X = A.input.plan, V = X === void 0, F = V ? yU(e1()) : void 0, [K, D] = qG.useState(() => {
    if (X) return X;
    return xU(e1()) ?? "No plan found. Please write your plan to the plan file first."
  }), [H, C] = qG.useState(!1);
  qG.useEffect(() => {
    if (H) {
      let w = setTimeout(() => {
        C(!1)
      }, 5000);
      return () => clearTimeout(w)
    }
  }, [H]), f1((w, N) => {
    if (N.ctrl && w.toLowerCase() === "g")
      if (GA("tengu_plan_external_editor_used", {}), V && F) {
        let R = QZ0(F);
        if (R !== null) D(R), C(!0)
      } else {
        let R = e31(K);
        if (R !== null && R !== K) D(R), C(!0)
      }
  });

  function E(w) {
    let N = V ? {} : {
      plan: K
    };
    if (w === "yes-bypass-permissions") GA("tengu_plan_exit", {
      planLengthChars: K.length,
      outcome: w
    }), ou(!0), Q(), A.onAllow(N, [{
      type: "setMode",
      mode: "bypassPermissions",
      destination: "session"
    }]);
    else if (w === "yes-accept-edits") GA("tengu_plan_exit", {
      planLengthChars: K.length,
      outcome: w
    }), ou(!0), Q(), A.onAllow(N, [{
      type: "setMode",
      mode: "acceptEdits",
      destination: "session"
    }]);
    else if (w === "yes-default") GA("tengu_plan_exit", {
      planLengthChars: K.length,
      outcome: w
    }), ou(!0), Q(), A.onAllow(N, [{
      type: "setMode",
      mode: "default",
      destination: "session"
    }]);
    else {
      let R = I.trim();
      if (!R) {
        W("no");
        return
      }
      GA("tengu_plan_exit", {
        planLengthChars: K.length,
        outcome: "no"
      }), Q(), B(), A.onReject(R)
    }
  }
  let U = Jg(),
    q = U ? aF(U) : null;
  return qG.default.createElement(qG.default.Fragment, null, qG.default.createElement(uJ, {
    color: "planMode",
    title: "Ready to code?",
    innerPaddingX: 0
  }, qG.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, qG.default.createElement(S, {
    paddingX: 1
  }, qG.default.createElement($, null, "Here is Claude's plan:")), qG.default.createElement(S, {
    borderDimColor: !0,
    borderColor: "subtle",
    borderStyle: "dashed",
    flexDirection: "column",
    borderLeft: !1,
    borderRight: !1,
    paddingX: 1,
    marginBottom: 1,
    overflow: "hidden"
  }, qG.default.createElement($, null, fD(K, G))), qG.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, qG.default.createElement(VC, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), qG.default.createElement($, {
    dimColor: !0
  }, "Would you like to proceed?"), qG.default.createElement(S, {
    marginTop: 1
  }, qG.default.createElement(M0, {
    options: [...Z.toolPermissionContext.isBypassPermissionsModeAvailable ? [{
      label: "Yes, and bypass permissions",
      value: "yes-bypass-permissions"
    }] : [{
      label: "Yes, and auto-accept edits",
      value: "yes-accept-edits"
    }], {
      label: "Yes, and manually approve edits",
      value: "yes-default"
    }, {
      type: "input",
      label: "No, keep planning",
      value: "no",
      placeholder: "Type here to tell Claude what to change",
      onChange: Y
    }],
    onChange: (w) => E(w),
    onCancel: () => {
      GA("tengu_plan_exit", {
        planLengthChars: K.length,
        outcome: "no"
      }), Q(), B(), A.onReject()
    },
    onFocus: W,
    focusValue: J || void 0
  }))))), q && qG.default.createElement(S, {
    flexDirection: "row",
    gap: 1,
    paddingX: 1,
    marginTop: 1
  }, qG.default.createElement(S, null, qG.default.createElement($, {
    dimColor: !0
  }, "ctrl-g to edit in "), qG.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, q), V && F && qG.default.createElement($, {
    dimColor: !0
  }, " · ", F)), H && qG.default.createElement(S, null, qG.default.createElement($, {
    dimColor: !0
  }, " · "), qG.default.createElement($, {
    color: "success"
  }, H1.tick, "Plan saved!"))))
}
// @from(Start 12340482, End 12340484)
qG
// @from(Start 12340490, End 12340632)
Zd2 = L(() => {
  hA();
  J5();
  wO();
  wh();
  Gg();
  z9();
  BZ0();
  q0();
  V9();
  pn();
  nY();
  NE();
  _0();
  qG = BA(VA(), 1)
})
// @from(Start 12340638, End 12340641)
Id2
// @from(Start 12340647, End 12343855)
Yd2 = L(() => {
  Id2 = `Use this tool when you encounter a complex task that requires careful planning and exploration before implementation. This tool transitions you into plan mode where you can thoroughly explore the codebase and design an implementation approach.

## When to Use This Tool

Use EnterPlanMode when ANY of these conditions apply:

1. **Multiple Valid Approaches**: The task can be solved in several different ways, each with trade-offs
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

2. **Significant Architectural Decisions**: The task requires choosing between architectural patterns
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

3. **Large-Scale Changes**: The task touches many files or systems
   - Example: "Refactor the authentication system"
   - Example: "Migrate from REST to GraphQL"

4. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

5. **User Input Needed**: You'll need to ask clarifying questions before starting
   - If you would use ${pJ} to clarify the approach, consider EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Do NOT use EnterPlanMode for:
- Simple, straightforward tasks with obvious implementation
- Small bug fixes where the solution is clear
- Adding a single function or small feature
- Tasks you're already confident how to implement
- Research-only tasks (use the Task tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${pJ} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- This requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- Be thoughtful about when to use it - unnecessary plan mode slows down simple tasks
- If unsure whether to use it, err on the side of starting implementation
- You can always ask the user "Would you like me to plan this out first?"
`
})
// @from(Start 12343858, End 12343890)
function Jd2() {
  return null
}
// @from(Start 12343892, End 12343924)
function Wd2() {
  return null
}
// @from(Start 12343926, End 12344368)
function Xd2(A, Q, B) {
  return aV.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, aV.createElement(S, {
    flexDirection: "row"
  }, aV.createElement($, {
    color: ZS("plan")
  }, rD), aV.createElement($, null, " Entered plan mode")), aV.createElement(S, {
    marginTop: 1,
    paddingLeft: 2
  }, aV.createElement($, {
    dimColor: !0
  }, "Claude is now exploring and designing an implementation approach.")))
}
// @from(Start 12344370, End 12344588)
function Vd2() {
  return aV.createElement(S, {
    flexDirection: "row",
    marginTop: 1
  }, aV.createElement($, {
    color: ZS("default")
  }, rD), aV.createElement($, null, " User declined to enter plan mode"))
}
// @from(Start 12344590, End 12344622)
function Fd2() {
  return null
}
// @from(Start 12344627, End 12344629)
aV
// @from(Start 12344635, End 12344696)
Kd2 = L(() => {
  hA();
  dn();
  Zw();
  aV = BA(VA(), 1)
})
// @from(Start 12344702, End 12344723)
A71 = "EnterPlanMode"
// @from(Start 12344729, End 12344732)
Xt5
// @from(Start 12344734, End 12344737)
Vt5
// @from(Start 12344739, End 12344742)
cTA
// @from(Start 12344748, End 12346661)
GZ0 = L(() => {
  Q2();
  _0();
  Yd2();
  Kd2();
  Xt5 = j.strictObject({}), Vt5 = j.object({
    message: j.string().describe("Confirmation that plan mode was entered")
  }), cTA = {
    name: A71,
    async description() {
      return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() {
      return Id2
    },
    inputSchema: Xt5,
    outputSchema: Vt5,
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
    async checkPermissions(A) {
      return {
        behavior: "ask",
        message: "Enter plan mode?",
        updatedInput: A
      }
    },
    renderToolUseMessage: Jd2,
    renderToolUseProgressMessage: Wd2,
    renderToolResultMessage: Xd2,
    renderToolUseRejectedMessage: Vd2,
    renderToolUseErrorMessage: Fd2,
    async call(A, Q) {
      let B = e1();
      if (Q.agentId !== B) throw Error("EnterPlanMode tool cannot be used in agent contexts");
      return {
        data: {
          message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      message: A
    }, Q) {
      return {
        type: "tool_result",
        content: `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
        tool_use_id: Q
      }
    }
  }
})
// @from(Start 12346664, End 12348206)
function Dd2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  function G(Z) {
    if (Z === "yes") Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",
      destination: "session"
    }]);
    else Q(), B(), A.onReject()
  }
  return C$.default.createElement(uJ, {
    color: "planMode",
    title: "Enter plan mode?"
  }, C$.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    paddingX: 1
  }, C$.default.createElement($, null, "Claude wants to enter plan mode to explore and design an implementation approach."), C$.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, C$.default.createElement($, {
    dimColor: !0
  }, "In plan mode, Claude will:"), C$.default.createElement($, {
    dimColor: !0
  }, " · Explore the codebase thoroughly"), C$.default.createElement($, {
    dimColor: !0
  }, " · Identify existing patterns"), C$.default.createElement($, {
    dimColor: !0
  }, " · Design an implementation strategy"), C$.default.createElement($, {
    dimColor: !0
  }, " · Present a plan for your approval")), C$.default.createElement(S, {
    marginTop: 1
  }, C$.default.createElement($, {
    dimColor: !0
  }, "No code changes will be made until you approve the plan.")), C$.default.createElement(S, {
    marginTop: 1
  }, C$.default.createElement(M0, {
    options: [{
      label: "Yes, enter plan mode",
      value: "yes"
    }, {
      label: "No, start implementing now",
      value: "no"
    }],
    onChange: G,
    onCancel: () => G("no")
  }))))
}
// @from(Start 12348211, End 12348213)
C$
// @from(Start 12348219, End 12348280)
Hd2 = L(() => {
  hA();
  J5();
  wO();
  C$ = BA(VA(), 1)
})
// @from(Start 12348283, End 12348636)
function Cd2(A, Q, {
  verbose: B
}) {
  let G = [];
  if (A.allowedTools && A.allowedTools.length > 0) {
    let Z = A.allowedTools.length;
    G.push(`${Z} tool${Z===1?"":"s"} allowed`)
  }
  if (A.model) G.push(A.model);
  if (G.length === 0) return null;
  return uq.createElement(S0, {
    height: 1
  }, uq.createElement($, null, G.join(" · ")))
}
// @from(Start 12348638, End 12348722)
function Ed2({
  skill: A
}, {
  verbose: Q
}) {
  if (!A) return null;
  return A
}
// @from(Start 12348724, End 12348850)
function zd2() {
  return uq.createElement(S0, {
    height: 1
  }, uq.createElement($, {
    dimColor: !0
  }, "Loading…"))
}
// @from(Start 12348852, End 12348906)
function Ud2() {
  return uq.createElement(k5, null)
}
// @from(Start 12348908, End 12349012)
function $d2(A, {
  verbose: Q
}) {
  return uq.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 12349017, End 12349019)
uq
// @from(Start 12349025, End 12349094)
wd2 = L(() => {
  hA();
  yJ();
  iX();
  q8();
  uq = BA(VA(), 1)
})
// @from(Start 12349097, End 12349261)
function Q71(A, Q) {
  if (!Q) return A;
  return A.map((B) => {
    if (B.type === "user") return {
      ...B,
      sourceToolUseID: Q
    };
    return B
  })
}
// @from(Start 12349263, End 12349417)
function B71(A, Q) {
  let B = A.message.content.find((G) => G.type === "tool_use" && G.name === Q);
  return B && B.type === "tool_use" ? B.id : void 0
}
// @from(Start 12349422, End 12349425)
Ft5
// @from(Start 12349427, End 12349430)
Kt5
// @from(Start 12349432, End 12349434)
ln
// @from(Start 12349440, End 12355221)
G71 = L(() => {
  Q2();
  cE();
  AZ();
  vRA();
  K70();
  wd2();
  q0();
  V0();
  Ft5 = j.object({
    skill: j.string().describe('The skill name (no arguments). E.g., "pdf" or "xlsx"')
  }), Kt5 = j.object({
    success: j.boolean().describe("Whether the skill is valid"),
    commandName: j.string().describe("The name of the skill"),
    allowedTools: j.array(j.string()).optional().describe("Tools allowed by this skill"),
    model: j.string().optional().describe("Model override if specified")
  }), ln = {
    name: kq,
    inputSchema: Ft5,
    outputSchema: Kt5,
    description: async ({
      skill: A
    }) => `Execute skill: ${A}`,
    prompt: async () => _b2(),
    userFacingName: () => kq,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    async validateInput({
      skill: A
    }, Q) {
      let B = A.trim();
      if (!B) return {
        result: !1,
        message: `Invalid skill format: ${A}`,
        errorCode: 1
      };
      let G = B.startsWith("/") ? B.substring(1) : B,
        Z = await sE();
      if (!ph(G, Z)) return {
        result: !1,
        message: `Unknown skill: ${G}`,
        errorCode: 2
      };
      let I = Pq(G, Z);
      if (!I) return {
        result: !1,
        message: `Could not load skill: ${G}`,
        errorCode: 3
      };
      if (I.disableModelInvocation) return {
        result: !1,
        message: `Skill ${G} cannot be used with ${kq} tool due to disable-model-invocation`,
        errorCode: 4
      };
      if (I.type !== "prompt") return {
        result: !1,
        message: `Skill ${G} is not a prompt-based skill`,
        errorCode: 5
      };
      return {
        result: !0
      }
    },
    async checkPermissions({
      skill: A
    }, Q) {
      let B = A.trim(),
        G = B.startsWith("/") ? B.substring(1) : B,
        I = (await Q.getAppState()).toolPermissionContext,
        Y = await sE(),
        J = Pq(G, Y),
        W = (K) => {
          if (K === A) return !0;
          if (K.endsWith(":*")) {
            let D = K.slice(0, -2);
            return A.startsWith(D)
          }
          return !1
        },
        X = fU(I, ln, "deny");
      for (let [K, D] of X.entries())
        if (W(K)) return {
          behavior: "deny",
          message: "Skill execution blocked by permission rules",
          decisionReason: {
            type: "rule",
            rule: D
          }
        };
      let V = fU(I, ln, "allow");
      for (let [K, D] of V.entries())
        if (W(K)) return {
          behavior: "allow",
          updatedInput: {
            skill: A
          },
          decisionReason: {
            type: "rule",
            rule: D
          }
        };
      let F = [{
        type: "addRules",
        rules: [{
          toolName: kq,
          ruleContent: A
        }],
        behavior: "allow",
        destination: "localSettings"
      }];
      return {
        behavior: "ask",
        message: `Execute skill: ${G}`,
        decisionReason: void 0,
        suggestions: F,
        metadata: {
          command: J
        }
      }
    },
    async call({
      skill: A
    }, Q, B, G) {
      let Z = A.trim(),
        I = Z.startsWith("/") ? Z.substring(1) : Z,
        Y = await sE(),
        J = await s61(I, "", Y, Q);
      if (!J.shouldQuery) throw Error("Command processing failed");
      let W = J.allowedTools || [],
        X = J.model,
        V = J.maxThinkingTokens,
        F = Ny().has(I) ? I : "custom";
      GA("tengu_skill_tool_invocation", {
        command_name: F
      });
      let K = B71(G, kq),
        D = Q71(J.messages.filter((H) => {
          if (H.type === "progress") return !1;
          if (H.type === "user" && "message" in H) {
            let C = H.message.content;
            if (typeof C === "string" && C.includes("<command-message>")) return !1
          }
          return !0
        }), K);
      return g(`SkillTool returning ${D.length} newMessages for skill ${I}`), D.forEach((H, C) => {
        if (H.type === "user" && "message" in H) {
          let E = typeof H.message.content === "string" ? H.message.content : JSON.stringify(H.message.content);
          g(`  newMessage ${C+1}: ${E.substring(0,150)}...`)
        }
      }), {
        data: {
          success: !0,
          commandName: I,
          allowedTools: W.length > 0 ? W : void 0,
          model: X
        },
        newMessages: D,
        contextModifier(H) {
          let C = H;
          if (W.length > 0) C = {
            ...C,
            async getAppState() {
              let E = await Q.getAppState();
              return {
                ...E,
                toolPermissionContext: {
                  ...E.toolPermissionContext,
                  alwaysAllowRules: {
                    ...E.toolPermissionContext.alwaysAllowRules,
                    command: [...new Set([...E.toolPermissionContext.alwaysAllowRules.command || [], ...W])]
                  }
                }
              }
            }
          };
          if (X) C = {
            ...C,
            options: {
              ...C.options,
              mainLoopModel: X
            }
          };
          if (V !== void 0) C = {
            ...C,
            options: {
              ...C.options,
              maxThinkingTokens: V
            }
          };
          return C
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        type: "tool_result",
        tool_use_id: Q,
        content: `Launching skill: ${A.commandName}`
      }
    },
    renderToolResultMessage: Cd2,
    renderToolUseMessage: Ed2,
    renderToolUseProgressMessage: zd2,
    renderToolUseRejectedMessage: Ud2,
    renderToolUseErrorMessage: $d2
  }
})
// @from(Start 12355227, End 12355246)
cP = "SlashCommand"
// @from(Start 12355249, End 12355336)
function Dt5() {
  return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) || 15000
}
// @from(Start 12355338, End 12355532)
function qd2(A) {
  let Q = `/${A.name}`,
    B = A.argumentHint ? ` ${A.argumentHint}` : "",
    G = A.whenToUse ? `- ${A.whenToUse}` : "";
  return `- ${Q}${B}: ${A.description} ${G}`.trim()
}
// @from(Start 12355534, End 12355693)
function Ht5(A) {
  let Q = [],
    B = 0;
  for (let G of A) {
    let Z = qd2(G);
    if (B += Z.length + 1, B > Dt5()) break;
    Q.push(G)
  }
  return Q
}
// @from(Start 12355695, End 12355757)
function Ct5(A) {
  return {
    limitedCommands: Ht5(A)
  }
}
// @from(Start 12355762, End 12355765)
Nd2
// @from(Start 12355771, End 12357602)
Ld2 = L(() => {
  cE();
  V0();
  $9A();
  Nd2 = s1(async () => {
    let A = await Z71(),
      {
        limitedCommands: Q
      } = Ct5(A),
      B = Q.length > 0 ? Q.map((Y) => qd2(Y)).join(`
`) : "",
      G = Q.map((Y) => `/${Y.userFacingName()}`).join(", ");
    g(`Slash commands included in SlashCommand tool: ${G}`);
    let Z = A.length > Q.length ? `
(Showing ${Q.length} of ${A.length} commands due to token limits)` : "";
    return `Execute a slash command within the main conversation

How slash commands work:
When you use this tool or when a user types a slash command, you will see <command-message>{name} is running…</command-message> followed by the expanded prompt. For example, if .claude/commands/foo.md contains "Print today's date", then /foo expands to that prompt in the next message.

Usage:
- \`command\` (required): The slash command to execute, including any arguments
- Example: \`command: "/review-pr 123"\`

IMPORTANT: Only use this tool for custom slash commands that appear in the Available Commands list below. Do NOT use for:
- Built-in CLI commands (like /help, /clear, etc.)
- Commands not shown in the list
- Commands you think might exist but aren't listed

${B?`Available Commands:
${B}${Z}
`:""}Notes:
- When a user requests multiple slash commands, execute each one sequentially and check for <command-message>{name} is running…</command-message> to verify each has been processed
- Do not invoke a command that is already running. For example, if you see <command-message>foo is running…</command-message>, do NOT use this tool with "/foo" - process the expanded prompt in the following message
- Only custom slash commands with descriptions are listed in Available Commands. If a user's command is not listed, ask them to check the slash command file and consult the docs.
`
  })
})
// @from(Start 12357605, End 12357637)
function Md2() {
  return null
}
// @from(Start 12357639, End 12357671)
function Od2() {
  return null
}
// @from(Start 12357673, End 12357705)
function Rd2() {
  return null
}
// @from(Start 12357707, End 12357762)
function Td2() {
  return pTA.createElement(k5, null)
}
// @from(Start 12357764, End 12357869)
function Pd2(A, {
  verbose: Q
}) {
  return pTA.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 12357874, End 12357877)
pTA
// @from(Start 12357883, End 12357937)
jd2 = L(() => {
  yJ();
  iX();
  pTA = BA(VA(), 1)
})
// @from(Start 12357943, End 12357946)
Et5
// @from(Start 12357948, End 12357951)
zt5
// @from(Start 12357953, End 12357955)
nn
// @from(Start 12357961, End 12363298)
I71 = L(() => {
  Q2();
  cE();
  AZ();
  vRA();
  Ld2();
  jd2();
  q0();
  Et5 = j.object({
    command: j.string().describe('The slash command to execute with its arguments, e.g., "/review-pr 123"')
  }), zt5 = j.object({
    success: j.boolean().describe("Whether the slash command is valid"),
    commandName: j.string().describe("The name of the slash command")
  }), nn = {
    name: cP,
    inputSchema: Et5,
    outputSchema: zt5,
    description: async ({
      command: A
    }) => `Execute slash command: ${A}`,
    prompt: async () => Nd2(),
    userFacingName: () => cP,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    async validateInput({
      command: A
    }, Q) {
      let B = rJA(A);
      if (!B) return {
        result: !1,
        message: `Invalid slash command format: ${A}`,
        errorCode: 1
      };
      let {
        commandName: G
      } = B, Z = await sE();
      if (!ph(G, Z)) return {
        result: !1,
        message: `Unknown slash command: ${G}`,
        errorCode: 2
      };
      let I = Pq(G, Z);
      if (!I) return {
        result: !1,
        message: `Could not load slash command: ${G}`,
        errorCode: 3
      };
      if (I.disableModelInvocation) return {
        result: !1,
        message: `Slash command ${G} cannot be used with ${cP} tool due to disable-model-invocation`,
        errorCode: 4
      };
      if (I.type !== "prompt") return {
        result: !1,
        message: `Slash command ${G} is not a prompt-based command`,
        errorCode: 5
      };
      return {
        result: !0
      }
    },
    async checkPermissions({
      command: A
    }, Q) {
      let {
        commandName: B
      } = rJA(A) || {
        commandName: "unknown"
      }, Z = (await Q.getAppState()).toolPermissionContext, I = await sE(), Y = Pq(B, I), J = (K) => {
        if (K === A) return !0;
        if (K.endsWith(":*")) {
          let D = K.slice(0, -2);
          return A.startsWith(D)
        }
        return !1
      }, W = fU(Z, nn, "deny");
      for (let [K, D] of W.entries())
        if (J(K)) return {
          behavior: "deny",
          message: "Slash command execution blocked by permission rules",
          decisionReason: {
            type: "rule",
            rule: D
          }
        };
      let X = fU(Z, nn, "allow");
      for (let [K, D] of X.entries())
        if (J(K)) return {
          behavior: "allow",
          updatedInput: {
            command: A
          },
          decisionReason: {
            type: "rule",
            rule: D
          }
        };
      let V = [{
          type: "addRules",
          rules: [{
            toolName: cP,
            ruleContent: A
          }],
          behavior: "allow",
          destination: "localSettings"
        }],
        F = A.indexOf(" ");
      if (F > 0) {
        let K = A.substring(0, F);
        V.push({
          type: "addRules",
          rules: [{
            toolName: cP,
            ruleContent: `${K}:*`
          }],
          behavior: "allow",
          destination: "localSettings"
        })
      }
      return {
        behavior: "ask",
        message: `Execute slash command: /${B}`,
        decisionReason: void 0,
        suggestions: V,
        metadata: {
          command: Y
        }
      }
    },
    async call({
      command: A
    }, Q, B, G) {
      let {
        commandName: Z,
        args: I
      } = rJA(A), Y = await sE(), J = await s61(Z, I, Y, Q);
      if (!J.shouldQuery) throw Error("Command processing failed");
      let W = J.allowedTools || [],
        X = J.model,
        V = J.maxThinkingTokens,
        F = Ny().has(Z) ? Z : "custom";
      GA("tengu_slash_command_tool_invocation", {
        command_name: F
      });
      let K = B71(G, cP),
        D = Q71(J.messages.filter((H) => H.type !== "progress"), K);
      return {
        data: {
          success: !0,
          commandName: Z
        },
        newMessages: D,
        contextModifier(H) {
          let C = H;
          if (W.length > 0) C = {
            ...C,
            async getAppState() {
              let E = await Q.getAppState();
              return {
                ...E,
                toolPermissionContext: {
                  ...E.toolPermissionContext,
                  alwaysAllowRules: {
                    ...E.toolPermissionContext.alwaysAllowRules,
                    command: [...new Set([...E.toolPermissionContext.alwaysAllowRules.command || [], ...W])]
                  }
                }
              }
            }
          };
          if (X) C = {
            ...C,
            options: {
              ...C.options,
              mainLoopModel: X
            }
          };
          if (V !== void 0) C = {
            ...C,
            options: {
              ...C.options,
              maxThinkingTokens: V
            }
          };
          return C
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        type: "tool_result",
        tool_use_id: Q,
        content: `Launching command: /${A.commandName}`
      }
    },
    renderToolResultMessage: Md2,
    renderToolUseMessage: Od2,
    renderToolUseProgressMessage: Rd2,
    renderToolUseRejectedMessage: Td2,
    renderToolUseErrorMessage: Pd2
  }
})
// @from(Start 12363301, End 12367185)
function Sd2(A) {
  let {
    toolUseConfirm: Q,
    onDone: B,
    onReject: G,
    verbose: Z
  } = A, Y = ((K) => {
    let D = ln.inputSchema.safeParse(K);
    if (!D.success) return AA(Error(`Failed to parse skill tool input: ${D.error.message}`)), "";
    return D.data.skill
  })(Q.input), J = Q.permissionResult.behavior === "ask" && Q.permissionResult.metadata && "command" in Q.permissionResult.metadata ? Q.permissionResult.metadata.command : void 0, W = LO.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  V$(Q, W);
  let X = uQ(),
    V = LO.useMemo(() => {
      let K = [{
          label: "Yes",
          value: "yes"
        }],
        D = {
          label: `Yes, and don't ask again for ${tA.bold(Y)} in ${tA.bold(X)}`,
          value: "yes-exact"
        },
        H = Y.indexOf(" "),
        C = [];
      if (H > 0) {
        let U = Y.substring(0, H);
        C.push({
          label: `Yes, and don't ask again for ${tA.bold(U+":*")} commands in ${tA.bold(X)}`,
          value: "yes-prefix"
        })
      }
      let E = {
        label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
        value: "no"
      };
      return [...K, D, ...C, E]
    }, [Y, X]),
    F = (K) => {
      switch (K) {
        case "yes":
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onAllow(Q.input, []), B();
          break;
        case "yes-exact": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: kq,
              ruleContent: Y
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "yes-prefix": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          });
          let D = Y.indexOf(" "),
            H = D > 0 ? Y.substring(0, D) : Y;
          Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: kq,
              ruleContent: `${H}:*`
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "no":
          CY({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onReject(), G(), B();
          break
      }
    };
  return LO.default.createElement(uJ, {
    title: `Use skill "${Y}"?`
  }, LO.default.createElement($, null, "Claude may use instructions, code, or files from this Skill."), LO.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, LO.default.createElement($, {
    dimColor: !0
  }, J?.description)), LO.default.createElement(S, {
    flexDirection: "column"
  }, LO.default.createElement(VC, {
    permissionResult: Q.permissionResult,
    toolType: "tool"
  }), LO.default.createElement($, null, "Do you want to proceed?"), LO.default.createElement(M0, {
    options: V,
    onChange: F,
    onCancel: () => F("no")
  })))
}
// @from(Start 12367190, End 12367192)
LO
// @from(Start 12367198, End 12367324)
_d2 = L(() => {
  hA();
  J5();
  wO();
  xn();
  c5();
  _0();
  F9();
  vn();
  Gg();
  G71();
  g1();
  LO = BA(VA(), 1)
})
// @from(Start 12367327, End 12371143)
function kd2(A) {
  let {
    toolUseConfirm: Q,
    onDone: B,
    onReject: G,
    verbose: Z
  } = A, Y = ((K) => {
    let D = nn.inputSchema.safeParse(K);
    if (!D.success) return AA(Error(`Failed to parse slash command tool input: ${D.error.message}`)), "";
    return D.data.command
  })(Q.input), J = Q.permissionResult.behavior === "ask" && Q.permissionResult.metadata && "command" in Q.permissionResult.metadata ? Q.permissionResult.metadata.command : void 0, W = MO.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  V$(Q, W);
  let X = uQ(),
    V = MO.useMemo(() => {
      let K = [{
          label: "Yes",
          value: "yes"
        }],
        D = {
          label: `Yes, and don't ask again for ${tA.bold(Y)} in ${tA.bold(X)}`,
          value: "yes-exact"
        },
        H = Y.indexOf(" "),
        C = [];
      if (H > 0) {
        let U = Y.substring(0, H);
        C.push({
          label: `Yes, and don't ask again for ${tA.bold(U+":*")} commands in ${tA.bold(X)}`,
          value: "yes-prefix"
        })
      }
      let E = {
        label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
        value: "no"
      };
      return [...K, D, ...C, E]
    }, [Y, X]),
    F = (K) => {
      switch (K) {
        case "yes":
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onAllow(Q.input, []), B();
          break;
        case "yes-exact": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: cP,
              ruleContent: Y
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "yes-prefix": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          });
          let D = Y.indexOf(" "),
            H = D > 0 ? Y.substring(0, D) : Y;
          Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: cP,
              ruleContent: `${H}:*`
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "no":
          CY({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: d0.platform
            }
          }), Q.onReject(), G(), B();
          break
      }
    };
  return MO.default.createElement(uJ, {
    title: cP
  }, MO.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, MO.default.createElement($, null, Y), MO.default.createElement($, {
    dimColor: !0
  }, J?.description)), MO.default.createElement(S, {
    flexDirection: "column"
  }, MO.default.createElement(VC, {
    permissionResult: Q.permissionResult,
    toolType: "tool"
  }), MO.default.createElement($, null, "Do you want to proceed?"), MO.default.createElement(M0, {
    options: V,
    onChange: F,
    onCancel: () => F("no")
  })))
}
// @from(Start 12371148, End 12371150)
MO
// @from(Start 12371156, End 12371282)
yd2 = L(() => {
  hA();
  J5();
  wO();
  xn();
  c5();
  _0();
  F9();
  vn();
  Gg();
  I71();
  g1();
  MO = BA(VA(), 1)
})
// @from(Start 12371285, End 12371780)
function $t5({
  answers: A
}) {
  return tY.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, tY.createElement(S, {
    flexDirection: "row"
  }, tY.createElement($, {
    color: ZS("default")
  }, rD, " "), tY.createElement($, null, "User answered Claude's questions:")), tY.createElement(S0, null, tY.createElement(S, {
    flexDirection: "column"
  }, Object.entries(A).map(([Q, B]) => tY.createElement($, {
    key: Q,
    color: "inactive"
  }, "· ", Q, " → ", B)))))
}
// @from(Start 12371785, End 12371787)
tY
// @from(Start 12371789, End 12371792)
Ut5
// @from(Start 12371794, End 12371797)
xd2
// @from(Start 12371799, End 12371802)
ZZ0
// @from(Start 12371804, End 12371807)
GKZ
// @from(Start 12371809, End 12371812)
Y71
// @from(Start 12371818, End 12375713)
J71 = L(() => {
  Q2();
  hA();
  q8();
  dn();
  Zw();
  _0();
  hQ();
  tY = BA(VA(), 1), Ut5 = j.object({
    label: j.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
    description: j.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications.")
  }), xd2 = j.object({
    question: j.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
    header: j.string().describe(`Very short label displayed as a chip/tag (max ${lm2} chars). Examples: "Auth method", "Library", "Approach".`),
    options: j.array(Ut5).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
    multiSelect: j.boolean().describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
  }), ZZ0 = j.strictObject({
    questions: j.array(xd2).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
    answers: j.record(j.string(), j.string()).optional().describe("User answers collected by the permission component")
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
  }), GKZ = j.object({
    questions: j.array(xd2).describe("The questions that were asked"),
    answers: j.record(j.string(), j.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)")
  });
  Y71 = {
    name: pJ,
    async description() {
      return im2
    },
    async prompt() {
      return nm2
    },
    inputSchema: ZZ0,
    userFacingName() {
      return ""
    },
    isEnabled() {
      return wkA() || Y0(process.env.CLAUDE_CODE_ENABLE_ASK_USER_QUESTION_TOOL)
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
      return tY.createElement($t5, {
        answers: A
      })
    },
    renderToolUseRejectedMessage() {
      return tY.createElement(S, {
        flexDirection: "row",
        marginTop: 1
      }, tY.createElement($, {
        color: ZS("default")
      }, rD, " "), tY.createElement($, null, "User declined to answer questions"))
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
// @from(Start 12375716, End 12376885)
function wt5(A, Q) {
  switch (Q.type) {
    case "next-question":
      return {
        ...A, currentQuestionIndex: A.currentQuestionIndex + 1, isInTextInput: !1
      };
    case "prev-question":
      return {
        ...A, currentQuestionIndex: Math.max(0, A.currentQuestionIndex - 1), isInTextInput: !1
      };
    case "update-question-state": {
      let B = A.questionStates[Q.questionText],
        G = {
          selectedValue: Q.updates.selectedValue ?? B?.selectedValue ?? (Q.isMultiSelect ? [] : void 0),
          textInputValue: Q.updates.textInputValue ?? B?.textInputValue ?? ""
        };
      return {
        ...A,
        questionStates: {
          ...A.questionStates,
          [Q.questionText]: G
        }
      }
    }
    case "set-answer": {
      let B = {
        ...A,
        answers: {
          ...A.answers,
          [Q.questionText]: Q.answer
        }
      };
      if (Q.shouldAdvance) return {
        ...B,
        currentQuestionIndex: B.currentQuestionIndex + 1,
        isInTextInput: !1
      };
      return B
    }
    case "set-text-input-mode":
      return {
        ...A, isInTextInput: Q.isInInput
      }
  }
}
// @from(Start 12376887, End 12377800)
function vd2() {
  let [A, Q] = an.useReducer(wt5, qt5), B = an.useCallback(() => {
    Q({
      type: "next-question"
    })
  }, []), G = an.useCallback(() => {
    Q({
      type: "prev-question"
    })
  }, []), Z = an.useCallback((J, W, X) => {
    Q({
      type: "update-question-state",
      questionText: J,
      updates: W,
      isMultiSelect: X
    })
  }, []), I = an.useCallback((J, W, X = !0) => {
    Q({
      type: "set-answer",
      questionText: J,
      answer: W,
      shouldAdvance: X
    })
  }, []), Y = an.useCallback((J) => {
    Q({
      type: "set-text-input-mode",
      isInInput: J
    })
  }, []);
  return {
    currentQuestionIndex: A.currentQuestionIndex,
    answers: A.answers,
    questionStates: A.questionStates,
    isInTextInput: A.isInTextInput,
    nextQuestion: B,
    prevQuestion: G,
    updateQuestionState: Z,
    setAnswer: I,
    setTextInputMode: Y
  }
}
// @from(Start 12377805, End 12377807)
an
// @from(Start 12377809, End 12377812)
qt5
// @from(Start 12377818, End 12377962)
bd2 = L(() => {
  an = BA(VA(), 1);
  qt5 = {
    currentQuestionIndex: 0,
    answers: {},
    questionStates: {},
    isInTextInput: !1
  }
})
// @from(Start 12377965, End 12380171)
function W71({
  questions: A,
  currentQuestionIndex: Q,
  answers: B,
  hideSubmitTab: G = !1
}) {
  let {
    columns: Z
  } = WB(), I = OO.useMemo(() => {
    let X = G ? "" : ` ${H1.tick} Submit `,
      V = 2,
      F = 2,
      K = $D("← ") + $D(" →") + $D(X),
      D = Z - K;
    if (D <= 0) return A.map((v, x) => {
      let p = v?.header || `Q${x+1}`;
      return x === Q ? p.slice(0, 3) : ""
    });
    let H = A.map((v, x) => v?.header || `Q${x+1}`);
    if (H.map((v) => 4 + $D(v)).reduce((v, x) => v + x, 0) <= D) return H;
    let U = H[Q] || "",
      q = 4 + $D(U),
      w = 6,
      N = Math.min(q, D / 2),
      R = D - N,
      T = A.length - 1,
      y = Math.max(w, Math.floor(R / Math.max(T, 1)));
    return H.map((v, x) => {
      if (x === Q) {
        let p = N - 2 - 2;
        if ($D(v) <= p) return v;
        let u = v;
        while ($D(u + "…") > p && u.length > 1) u = u.slice(0, -1);
        return u + "…"
      } else {
        let p = y - 2 - 2;
        if ($D(v) <= p) return v;
        let u = v;
        while ($D(u + "…") > p && u.length > 1) u = u.slice(0, -1);
        return u.length > 0 ? u + "…" : v[0] + "…"
      }
    })
  }, [A, Q, Z, G]), Y = A.length === 1 && G;
  return OO.default.createElement(S, {
    flexDirection: "row",
    marginBottom: 1
  }, !Y && OO.default.createElement($, {
    color: Q === 0 ? "inactive" : void 0
  }, "←", " "), A.map((J, W) => {
    let X = W === Q,
      F = J?.question && !!B[J.question] ? H1.checkboxOn : H1.checkboxOff,
      K = I[W] || J?.header || `Q${W+1}`;
    return OO.default.createElement(S, {
      key: J?.question || `question-${W}`
    }, X ? OO.default.createElement($, {
      backgroundColor: "permission",
      color: "inverseText"
    }, " ", F, " ", K, " ") : OO.default.createElement($, null, " ", F, " ", K, " "))
  }), !G && OO.default.createElement(S, {
    key: "submit"
  }, Q === A.length ? OO.default.createElement($, {
    backgroundColor: "permission",
    color: "inverseText"
  }, " ", H1.tick, " Submit", " ") : OO.default.createElement($, null, " ", H1.tick, " Submit ")), !Y && OO.default.createElement($, {
    color: Q === A.length ? "inactive" : void 0
  }, " ", "→"))
}
// @from(Start 12380176, End 12380178)
OO
// @from(Start 12380184, End 12380254)
IZ0 = L(() => {
  V9();
  hA();
  i8();
  jUA();
  OO = BA(VA(), 1)
})