
// @from(Ln 338316, Col 4)
_W1 = U((Zd5) => {
  Zd5.isValidName = Bd5;
  Zd5.isValidQName = Gd5;
  var rm5 = /^[_:A-Za-z][-.:\w]+$/,
    sm5 = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
    CbA = "_A-Za-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
    UbA = "-._A-Za-z0-9·À-ÖØ-öø-˿̀-ͽͿ-῿‌‍‿⁀⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
    l6A = "[" + CbA + "][" + UbA + "]*",
    $C0 = CbA + ":",
    CC0 = UbA + ":",
    tm5 = new RegExp("^[" + $C0 + "][" + CC0 + "]*$"),
    em5 = new RegExp("^(" + l6A + "|" + l6A + ":" + l6A + ")$"),
    uk2 = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
    mk2 = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
    dk2 = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
  CbA += "\uD800-\uDB7F\uDC00-\uDFFF";
  UbA += "\uD800-\uDB7F\uDC00-\uDFFF";
  l6A = "[" + CbA + "][" + UbA + "]*";
  $C0 = CbA + ":";
  CC0 = UbA + ":";
  var Ad5 = new RegExp("^[" + $C0 + "][" + CC0 + "]*$"),
    Qd5 = new RegExp("^(" + l6A + "|" + l6A + ":" + l6A + ")$");

  function Bd5(A) {
    if (rm5.test(A)) return !0;
    if (tm5.test(A)) return !0;
    if (!uk2.test(A)) return !1;
    if (!Ad5.test(A)) return !1;
    var Q = A.match(mk2),
      B = A.match(dk2);
    return B !== null && 2 * B.length === Q.length
  }

  function Gd5(A) {
    if (sm5.test(A)) return !0;
    if (em5.test(A)) return !0;
    if (!uk2.test(A)) return !1;
    if (!Qd5.test(A)) return !1;
    var Q = A.match(mk2),
      B = A.match(dk2);
    return B !== null && 2 * B.length === Q.length
  }
})
// @from(Ln 338359, Col 4)
UC0 = U((Id5) => {
  var ck2 = BD();
  Id5.property = function (A) {
    if (Array.isArray(A.type)) {
      var Q = Object.create(null);
      A.type.forEach(function (Z) {
        Q[Z.value || Z] = Z.alias || Z
      });
      var B = A.missing;
      if (B === void 0) B = null;
      var G = A.invalid;
      if (G === void 0) G = B;
      return {
        get: function () {
          var Z = this._getattr(A.name);
          if (Z === null) return B;
          if (Z = Q[Z.toLowerCase()], Z !== void 0) return Z;
          if (G !== null) return G;
          return Z
        },
        set: function (Z) {
          this._setattr(A.name, Z)
        }
      }
    } else if (A.type === Boolean) return {
      get: function () {
        return this.hasAttribute(A.name)
      },
      set: function (Z) {
        if (Z) this._setattr(A.name, "");
        else this.removeAttribute(A.name)
      }
    };
    else if (A.type === Number || A.type === "long" || A.type === "unsigned long" || A.type === "limited unsigned long with fallback") return Xd5(A);
    else if (!A.type || A.type === String) return {
      get: function () {
        return this._getattr(A.name) || ""
      },
      set: function (Z) {
        if (A.treatNullAsEmptyString && Z === null) Z = "";
        this._setattr(A.name, Z)
      }
    };
    else if (typeof A.type === "function") return A.type(A.name, A);
    throw Error("Invalid attribute definition")
  };

  function Xd5(A) {
    var Q;
    if (typeof A.default === "function") Q = A.default;
    else if (typeof A.default === "number") Q = function () {
      return A.default
    };
    else Q = function () {
      ck2.assert(!1, typeof A.default)
    };
    var B = A.type === "unsigned long",
      G = A.type === "long",
      Z = A.type === "limited unsigned long with fallback",
      Y = A.min,
      J = A.max,
      X = A.setmin;
    if (Y === void 0) {
      if (B) Y = 0;
      if (G) Y = -2147483648;
      if (Z) Y = 1
    }
    if (J === void 0) {
      if (B || G || Z) J = 2147483647
    }
    return {
      get: function () {
        var I = this._getattr(A.name),
          D = A.float ? parseFloat(I) : parseInt(I, 10);
        if (I === null || !isFinite(D) || Y !== void 0 && D < Y || J !== void 0 && D > J) return Q.call(this);
        if (B || G || Z) {
          if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(I)) return Q.call(this);
          D = D | 0
        }
        return D
      },
      set: function (I) {
        if (!A.float) I = Math.floor(I);
        if (X !== void 0 && I < X) ck2.IndexSizeError(A.name + " set to " + I);
        if (B) I = I < 0 || I > 2147483647 ? Q.call(this) : I | 0;
        else if (Z) I = I < 1 || I > 2147483647 ? Q.call(this) : I | 0;
        else if (G) I = I < -2147483648 || I > 2147483647 ? Q.call(this) : I | 0;
        this._setattr(A.name, String(I))
      }
    }
  }
  Id5.registerChangeHandler = function (A, Q, B) {
    var G = A.prototype;
    if (!Object.prototype.hasOwnProperty.call(G, "_attributeChangeHandlers")) G._attributeChangeHandlers = Object.create(G._attributeChangeHandlers || null);
    G._attributeChangeHandlers[Q] = B
  }
})
// @from(Ln 338456, Col 4)
ik2 = U((U0Y, lk2) => {
  lk2.exports = pk2;
  var Kd5 = ME();

  function pk2(A, Q) {
    this.root = A, this.filter = Q, this.lastModTime = A.lastModTime, this.done = !1, this.cache = [], this.traverse()
  }
  pk2.prototype = Object.create(Object.prototype, {
    length: {
      get: function () {
        if (this.checkcache(), !this.done) this.traverse();
        return this.cache.length
      }
    },
    item: {
      value: function (A) {
        if (this.checkcache(), !this.done && A >= this.cache.length) this.traverse();
        return this.cache[A]
      }
    },
    checkcache: {
      value: function () {
        if (this.lastModTime !== this.root.lastModTime) {
          for (var A = this.cache.length - 1; A >= 0; A--) this[A] = void 0;
          this.cache.length = 0, this.done = !1, this.lastModTime = this.root.lastModTime
        }
      }
    },
    traverse: {
      value: function (A) {
        if (A !== void 0) A++;
        var Q;
        while ((Q = this.next()) !== null)
          if (this[this.cache.length] = Q, this.cache.push(Q), A && this.cache.length === A) return;
        this.done = !0
      }
    },
    next: {
      value: function () {
        var A = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1],
          Q;
        if (A.nodeType === Kd5.DOCUMENT_NODE) Q = A.documentElement;
        else Q = A.nextElement(this.root);
        while (Q) {
          if (this.filter(Q)) return Q;
          Q = Q.nextElement(this.root)
        }
        return null
      }
    }
  })
})
// @from(Ln 338508, Col 4)
NC0 = U((q0Y, ok2) => {
  var qC0 = BD();
  ok2.exports = ak2;

  function ak2(A, Q) {
    this._getString = A, this._setString = Q, this._length = 0, this._lastStringValue = "", this._update()
  }
  Object.defineProperties(ak2.prototype, {
    length: {
      get: function () {
        return this._length
      }
    },
    item: {
      value: function (A) {
        var Q = xHA(this);
        if (A < 0 || A >= Q.length) return null;
        return Q[A]
      }
    },
    contains: {
      value: function (A) {
        A = String(A);
        var Q = xHA(this);
        return Q.indexOf(A) > -1
      }
    },
    add: {
      value: function () {
        var A = xHA(this);
        for (var Q = 0, B = arguments.length; Q < B; Q++) {
          var G = qbA(arguments[Q]);
          if (A.indexOf(G) < 0) A.push(G)
        }
        this._update(A)
      }
    },
    remove: {
      value: function () {
        var A = xHA(this);
        for (var Q = 0, B = arguments.length; Q < B; Q++) {
          var G = qbA(arguments[Q]),
            Z = A.indexOf(G);
          if (Z > -1) A.splice(Z, 1)
        }
        this._update(A)
      }
    },
    toggle: {
      value: function (Q, B) {
        if (Q = qbA(Q), this.contains(Q)) {
          if (B === void 0 || B === !1) return this.remove(Q), !1;
          return !0
        } else {
          if (B === void 0 || B === !0) return this.add(Q), !0;
          return !1
        }
      }
    },
    replace: {
      value: function (Q, B) {
        if (String(B) === "") qC0.SyntaxError();
        Q = qbA(Q), B = qbA(B);
        var G = xHA(this),
          Z = G.indexOf(Q);
        if (Z < 0) return !1;
        var Y = G.indexOf(B);
        if (Y < 0) G[Z] = B;
        else if (Z < Y) G[Z] = B, G.splice(Y, 1);
        else G.splice(Z, 1);
        return this._update(G), !0
      }
    },
    toString: {
      value: function () {
        return this._getString()
      }
    },
    value: {
      get: function () {
        return this._getString()
      },
      set: function (A) {
        this._setString(A), this._update()
      }
    },
    _update: {
      value: function (A) {
        if (A) nk2(this, A), this._setString(A.join(" ").trim());
        else nk2(this, xHA(this));
        this._lastStringValue = this._getString()
      }
    }
  });

  function nk2(A, Q) {
    var B = A._length,
      G;
    A._length = Q.length;
    for (G = 0; G < Q.length; G++) A[G] = Q[G];
    for (; G < B; G++) A[G] = void 0
  }

  function qbA(A) {
    if (A = String(A), A === "") qC0.SyntaxError();
    if (/[ \t\r\n\f]/.test(A)) qC0.InvalidCharacterError();
    return A
  }

  function Vd5(A) {
    var Q = A._length,
      B = Array(Q);
    for (var G = 0; G < Q; G++) B[G] = A[G];
    return B
  }

  function xHA(A) {
    var Q = A._getString();
    if (Q === A._lastStringValue) return Vd5(A);
    var B = Q.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
    if (B === "") return [];
    else {
      var G = Object.create(null);
      return B.split(/[ \t\r\n\f]+/g).filter(function (Z) {
        var Y = "$" + Z;
        if (G[Y]) return !1;
        return G[Y] = !0, !0
      })
    }
  }
})
// @from(Ln 338639, Col 4)
SW1 = U((kHA, Qb2) => {
  var jW1 = Object.create(null, {
      location: {
        get: function () {
          throw Error("window.location is not supported.")
        }
      }
    }),
    Fd5 = function (A, Q) {
      return A.compareDocumentPosition(Q)
    },
    Hd5 = function (A, Q) {
      return Fd5(A, Q) & 2 ? 1 : -1
    },
    PW1 = function (A) {
      while ((A = A.nextSibling) && A.nodeType !== 1);
      return A
    },
    vHA = function (A) {
      while ((A = A.previousSibling) && A.nodeType !== 1);
      return A
    },
    Ed5 = function (A) {
      if (A = A.firstChild)
        while (A.nodeType !== 1 && (A = A.nextSibling));
      return A
    },
    zd5 = function (A) {
      if (A = A.lastChild)
        while (A.nodeType !== 1 && (A = A.previousSibling));
      return A
    },
    yHA = function (A) {
      if (!A.parentNode) return !1;
      var Q = A.parentNode.nodeType;
      return Q === 1 || Q === 9
    },
    rk2 = function (A) {
      if (!A) return A;
      var Q = A[0];
      if (Q === '"' || Q === "'") {
        if (A[A.length - 1] === Q) A = A.slice(1, -1);
        else A = A.slice(1);
        return A.replace(G6.str_escape, function (B) {
          var G = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(B);
          if (!G) return B.slice(1);
          if (G[2]) return "";
          var Z = parseInt(G[1], 16);
          return String.fromCodePoint ? String.fromCodePoint(Z) : String.fromCharCode(Z)
        })
      } else if (G6.ident.test(A)) return rs(A);
      else return A
    },
    rs = function (A) {
      return A.replace(G6.escape, function (Q) {
        var B = /^\\([0-9A-Fa-f]+)/.exec(Q);
        if (!B) return Q[1];
        var G = parseInt(B[1], 16);
        return String.fromCodePoint ? String.fromCodePoint(G) : String.fromCharCode(G)
      })
    },
    $d5 = function () {
      if (Array.prototype.indexOf) return Array.prototype.indexOf;
      return function (A, Q) {
        var B = this.length;
        while (B--)
          if (this[B] === Q) return B;
        return -1
      }
    }(),
    tk2 = function (A, Q) {
      var B = G6.inside.source.replace(/</g, A).replace(/>/g, Q);
      return new RegExp(B)
    },
    Aw = function (A, Q, B) {
      return A = A.source, A = A.replace(Q, B.source || B), new RegExp(A)
    },
    sk2 = function (A, Q) {
      return A.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", Q).join("/")
    },
    Cd5 = function (A, Q) {
      var B = A.replace(/\s+/g, ""),
        G;
      if (B === "even") B = "2n+0";
      else if (B === "odd") B = "2n+1";
      else if (B.indexOf("n") === -1) B = "0n" + B;
      return G = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(B), {
        group: G[1] === "-" ? -(G[2] || 1) : +(G[2] || 1),
        offset: G[4] ? G[3] === "-" ? -G[4] : +G[4] : 0
      }
    },
    wC0 = function (A, Q, B) {
      var G = Cd5(A),
        Z = G.group,
        Y = G.offset,
        J = !B ? Ed5 : zd5,
        X = !B ? PW1 : vHA;
      return function (I) {
        if (!yHA(I)) return;
        var D = J(I.parentNode),
          W = 0;
        while (D) {
          if (Q(D, I)) W++;
          if (D === I) return W -= Y, Z && W ? W % Z === 0 && W < 0 === Z < 0 : !W;
          D = X(D)
        }
      }
    },
    bF = {
      "*": function () {
        return function () {
          return !0
        }
      }(),
      type: function (A) {
        return A = A.toLowerCase(),
          function (Q) {
            return Q.nodeName.toLowerCase() === A
          }
      },
      attr: function (A, Q, B, G) {
        return Q = ek2[Q],
          function (Z) {
            var Y;
            switch (A) {
              case "for":
                Y = Z.htmlFor;
                break;
              case "class":
                if (Y = Z.className, Y === "" && Z.getAttribute("class") == null) Y = null;
                break;
              case "href":
              case "src":
                Y = Z.getAttribute(A, 2);
                break;
              case "title":
                Y = Z.getAttribute("title") || null;
                break;
              case "id":
              case "lang":
              case "dir":
              case "accessKey":
              case "hidden":
              case "tabIndex":
              case "style":
                if (Z.getAttribute) {
                  Y = Z.getAttribute(A);
                  break
                }
              default:
                if (Z.hasAttribute && !Z.hasAttribute(A)) break;
                Y = Z[A] != null ? Z[A] : Z.getAttribute && Z.getAttribute(A);
                break
            }
            if (Y == null) return;
            if (Y = Y + "", G) Y = Y.toLowerCase(), B = B.toLowerCase();
            return Q(Y, B)
          }
      },
      ":first-child": function (A) {
        return !vHA(A) && yHA(A)
      },
      ":last-child": function (A) {
        return !PW1(A) && yHA(A)
      },
      ":only-child": function (A) {
        return !vHA(A) && !PW1(A) && yHA(A)
      },
      ":nth-child": function (A, Q) {
        return wC0(A, function () {
          return !0
        }, Q)
      },
      ":nth-last-child": function (A) {
        return bF[":nth-child"](A, !0)
      },
      ":root": function (A) {
        return A.ownerDocument.documentElement === A
      },
      ":empty": function (A) {
        return !A.firstChild
      },
      ":not": function (A) {
        var Q = OC0(A);
        return function (B) {
          return !Q(B)
        }
      },
      ":first-of-type": function (A) {
        if (!yHA(A)) return;
        var Q = A.nodeName;
        while (A = vHA(A))
          if (A.nodeName === Q) return;
        return !0
      },
      ":last-of-type": function (A) {
        if (!yHA(A)) return;
        var Q = A.nodeName;
        while (A = PW1(A))
          if (A.nodeName === Q) return;
        return !0
      },
      ":only-of-type": function (A) {
        return bF[":first-of-type"](A) && bF[":last-of-type"](A)
      },
      ":nth-of-type": function (A, Q) {
        return wC0(A, function (B, G) {
          return B.nodeName === G.nodeName
        }, Q)
      },
      ":nth-last-of-type": function (A) {
        return bF[":nth-of-type"](A, !0)
      },
      ":checked": function (A) {
        return !!(A.checked || A.selected)
      },
      ":indeterminate": function (A) {
        return !bF[":checked"](A)
      },
      ":enabled": function (A) {
        return !A.disabled && A.type !== "hidden"
      },
      ":disabled": function (A) {
        return !!A.disabled
      },
      ":target": function (A) {
        return A.id === jW1.location.hash.substring(1)
      },
      ":focus": function (A) {
        return A === A.ownerDocument.activeElement
      },
      ":is": function (A) {
        return OC0(A)
      },
      ":matches": function (A) {
        return bF[":is"](A)
      },
      ":nth-match": function (A, Q) {
        var B = A.split(/\s*,\s*/),
          G = B.shift(),
          Z = OC0(B.join(","));
        return wC0(G, Z, Q)
      },
      ":nth-last-match": function (A) {
        return bF[":nth-match"](A, !0)
      },
      ":links-here": function (A) {
        return A + "" === jW1.location + ""
      },
      ":lang": function (A) {
        return function (Q) {
          while (Q) {
            if (Q.lang) return Q.lang.indexOf(A) === 0;
            Q = Q.parentNode
          }
        }
      },
      ":dir": function (A) {
        return function (Q) {
          while (Q) {
            if (Q.dir) return Q.dir === A;
            Q = Q.parentNode
          }
        }
      },
      ":scope": function (A, Q) {
        var B = Q || A.ownerDocument;
        if (B.nodeType === 9) return A === B.documentElement;
        return A === B
      },
      ":any-link": function (A) {
        return typeof A.href === "string"
      },
      ":local-link": function (A) {
        if (A.nodeName) return A.href && A.host === jW1.location.host;
        var Q = +A + 1;
        return function (B) {
          if (!B.href) return;
          var G = jW1.location + "",
            Z = B + "";
          return sk2(G, Q) === sk2(Z, Q)
        }
      },
      ":default": function (A) {
        return !!A.defaultSelected
      },
      ":valid": function (A) {
        return A.willValidate || A.validity && A.validity.valid
      },
      ":invalid": function (A) {
        return !bF[":valid"](A)
      },
      ":in-range": function (A) {
        return A.value > A.min && A.value <= A.max
      },
      ":out-of-range": function (A) {
        return !bF[":in-range"](A)
      },
      ":required": function (A) {
        return !!A.required
      },
      ":optional": function (A) {
        return !A.required
      },
      ":read-only": function (A) {
        if (A.readOnly) return !0;
        var Q = A.getAttribute("contenteditable"),
          B = A.contentEditable,
          G = A.nodeName.toLowerCase();
        return G = G !== "input" && G !== "textarea", (G || A.disabled) && Q == null && B !== "true"
      },
      ":read-write": function (A) {
        return !bF[":read-only"](A)
      },
      ":hover": function () {
        throw Error(":hover is not supported.")
      },
      ":active": function () {
        throw Error(":active is not supported.")
      },
      ":link": function () {
        throw Error(":link is not supported.")
      },
      ":visited": function () {
        throw Error(":visited is not supported.")
      },
      ":column": function () {
        throw Error(":column is not supported.")
      },
      ":nth-column": function () {
        throw Error(":nth-column is not supported.")
      },
      ":nth-last-column": function () {
        throw Error(":nth-last-column is not supported.")
      },
      ":current": function () {
        throw Error(":current is not supported.")
      },
      ":past": function () {
        throw Error(":past is not supported.")
      },
      ":future": function () {
        throw Error(":future is not supported.")
      },
      ":contains": function (A) {
        return function (Q) {
          var B = Q.innerText || Q.textContent || Q.value || "";
          return B.indexOf(A) !== -1
        }
      },
      ":has": function (A) {
        return function (Q) {
          return Ab2(A, Q).length > 0
        }
      }
    },
    ek2 = {
      "-": function () {
        return !0
      },
      "=": function (A, Q) {
        return A === Q
      },
      "*=": function (A, Q) {
        return A.indexOf(Q) !== -1
      },
      "~=": function (A, Q) {
        var B, G, Z, Y;
        for (G = 0;; G = B + 1) {
          if (B = A.indexOf(Q, G), B === -1) return !1;
          if (Z = A[B - 1], Y = A[B + Q.length], (!Z || Z === " ") && (!Y || Y === " ")) return !0
        }
      },
      "|=": function (A, Q) {
        var B = A.indexOf(Q),
          G;
        if (B !== 0) return;
        return G = A[B + Q.length], G === "-" || !G
      },
      "^=": function (A, Q) {
        return A.indexOf(Q) === 0
      },
      "$=": function (A, Q) {
        var B = A.lastIndexOf(Q);
        return B !== -1 && B + Q.length === A.length
      },
      "!=": function (A, Q) {
        return A !== Q
      }
    },
    NbA = {
      " ": function (A) {
        return function (Q) {
          while (Q = Q.parentNode)
            if (A(Q)) return Q
        }
      },
      ">": function (A) {
        return function (Q) {
          if (Q = Q.parentNode) return A(Q) && Q
        }
      },
      "+": function (A) {
        return function (Q) {
          if (Q = vHA(Q)) return A(Q) && Q
        }
      },
      "~": function (A) {
        return function (Q) {
          while (Q = vHA(Q))
            if (A(Q)) return Q
        }
      },
      noop: function (A) {
        return function (Q) {
          return A(Q) && Q
        }
      },
      ref: function (A, Q) {
        var B;

        function G(Z) {
          var Y = Z.ownerDocument,
            J = Y.getElementsByTagName("*"),
            X = J.length;
          while (X--)
            if (B = J[X], G.test(Z)) return B = null, !0;
          B = null
        }
        return G.combinator = function (Z) {
          if (!B || !B.getAttribute) return;
          var Y = B.getAttribute(Q) || "";
          if (Y[0] === "#") Y = Y.substring(1);
          if (Y === Z.id && A(B)) return B
        }, G
      }
    },
    G6 = {
      escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
      str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
      nonascii: /[\u00A0-\uFFFF]/,
      cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
      qname: /^ *(cssid|\*)/,
      simple: /^(?:([.#]cssid)|pseudo|attr)/,
      ref: /^ *\/(cssid)\/ */,
      combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
      attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
      pseudo: /^(:cssid)(?:\((inside)\))?/,
      inside: /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
      ident: /^(cssid)$/
    };
  G6.cssid = Aw(G6.cssid, "nonascii", G6.nonascii);
  G6.cssid = Aw(G6.cssid, "escape", G6.escape);
  G6.qname = Aw(G6.qname, "cssid", G6.cssid);
  G6.simple = Aw(G6.simple, "cssid", G6.cssid);
  G6.ref = Aw(G6.ref, "cssid", G6.cssid);
  G6.attr = Aw(G6.attr, "cssid", G6.cssid);
  G6.pseudo = Aw(G6.pseudo, "cssid", G6.cssid);
  G6.inside = Aw(G6.inside, `[^"'>]*`, G6.inside);
  G6.attr = Aw(G6.attr, "inside", tk2("\\[", "\\]"));
  G6.pseudo = Aw(G6.pseudo, "inside", tk2("\\(", "\\)"));
  G6.simple = Aw(G6.simple, "pseudo", G6.pseudo);
  G6.simple = Aw(G6.simple, "attr", G6.attr);
  G6.ident = Aw(G6.ident, "cssid", G6.cssid);
  G6.str_escape = Aw(G6.str_escape, "escape", G6.escape);
  var wbA = function (A) {
      var Q = A.replace(/^\s+|\s+$/g, ""),
        B, G = [],
        Z = [],
        Y, J, X, I, D;
      while (Q) {
        if (X = G6.qname.exec(Q)) Q = Q.substring(X[0].length), J = rs(X[1]), Z.push(TW1(J, !0));
        else if (X = G6.simple.exec(Q)) Q = Q.substring(X[0].length), J = "*", Z.push(TW1(J, !0)), Z.push(TW1(X));
        else throw SyntaxError("Invalid selector.");
        while (X = G6.simple.exec(Q)) Q = Q.substring(X[0].length), Z.push(TW1(X));
        if (Q[0] === "!") Q = Q.substring(1), Y = qd5(), Y.qname = J, Z.push(Y.simple);
        if (X = G6.ref.exec(Q)) {
          Q = Q.substring(X[0].length), D = NbA.ref(LC0(Z), rs(X[1])), G.push(D.combinator), Z = [];
          continue
        }
        if (X = G6.combinator.exec(Q)) {
          if (Q = Q.substring(X[0].length), I = X[1] || X[2] || X[3], I === ",") {
            G.push(NbA.noop(LC0(Z)));
            break
          }
        } else I = "noop";
        if (!NbA[I]) throw SyntaxError("Bad combinator.");
        G.push(NbA[I](LC0(Z))), Z = []
      }
      if (B = Ud5(G), B.qname = J, B.sel = Q, Y) Y.lname = B.qname, Y.test = B, Y.qname = Y.qname, Y.sel = B.sel, B = Y;
      if (D) D.test = B, D.qname = B.qname, D.sel = B.sel, B = D;
      return B
    },
    TW1 = function (A, Q) {
      if (Q) return A === "*" ? bF["*"] : bF.type(A);
      if (A[1]) return A[1][0] === "." ? bF.attr("class", "~=", rs(A[1].substring(1)), !1) : bF.attr("id", "=", rs(A[1].substring(1)), !1);
      if (A[2]) return A[3] ? bF[rs(A[2])](rk2(A[3])) : bF[rs(A[2])];
      if (A[4]) {
        var B = A[6],
          G = /["'\s]\s*I$/i.test(B);
        if (G) B = B.replace(/\s*I$/i, "");
        return bF.attr(rs(A[4]), A[5] || "-", rk2(B), G)
      }
      throw SyntaxError("Unknown Selector.")
    },
    LC0 = function (A) {
      var Q = A.length,
        B;
      if (Q < 2) return A[0];
      return function (G) {
        if (!G) return;
        for (B = 0; B < Q; B++)
          if (!A[B](G)) return;
        return !0
      }
    },
    Ud5 = function (A) {
      if (A.length < 2) return function (Q) {
        return !!A[0](Q)
      };
      return function (Q) {
        var B = A.length;
        while (B--)
          if (!(Q = A[B](Q))) return;
        return !0
      }
    },
    qd5 = function () {
      var A;

      function Q(B) {
        var G = B.ownerDocument,
          Z = G.getElementsByTagName(Q.lname),
          Y = Z.length;
        while (Y--)
          if (Q.test(Z[Y]) && A === B) return A = null, !0;
        A = null
      }
      return Q.simple = function (B) {
        return A = B, !0
      }, Q
    },
    OC0 = function (A) {
      var Q = wbA(A),
        B = [Q];
      while (Q.sel) Q = wbA(Q.sel), B.push(Q);
      if (B.length < 2) return Q;
      return function (G) {
        var Z = B.length,
          Y = 0;
        for (; Y < Z; Y++)
          if (B[Y](G)) return !0
      }
    },
    Ab2 = function (A, Q) {
      var B = [],
        G = wbA(A),
        Z = Q.getElementsByTagName(G.qname),
        Y = 0,
        J;
      while (J = Z[Y++])
        if (G(J)) B.push(J);
      if (G.sel) {
        while (G.sel) {
          G = wbA(G.sel), Z = Q.getElementsByTagName(G.qname), Y = 0;
          while (J = Z[Y++])
            if (G(J) && $d5.call(B, J) === -1) B.push(J)
        }
        B.sort(Hd5)
      }
      return B
    };
  Qb2.exports = kHA = function (A, Q) {
    var B, G;
    if (Q.nodeType !== 11 && A.indexOf(" ") === -1) {
      if (A[0] === "#" && Q.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(A)) {
        if (Q.doc._hasMultipleElementsWithId) {
          if (B = A.substring(1), !Q.doc._hasMultipleElementsWithId(B)) return G = Q.doc.getElementById(B), G ? [G] : []
        }
      }
      if (A[0] === "." && /^\.\w+$/.test(A)) return Q.getElementsByClassName(A.substring(1));
      if (/^\w+$/.test(A)) return Q.getElementsByTagName(A)
    }
    return Ab2(A, Q)
  };
  kHA.selectors = bF;
  kHA.operators = ek2;
  kHA.combinators = NbA;
  kHA.matches = function (A, Q) {
    var B = {
      sel: Q
    };
    do
      if (B = wbA(B.sel), B(A)) return !0; while (B.sel);
    return !1
  }
})
// @from(Ln 339236, Col 4)
xW1 = U((N0Y, Bb2) => {
  var Nd5 = ME(),
    wd5 = JC0(),
    MC0 = function (A, Q) {
      var B = A.createDocumentFragment();
      for (var G = 0; G < Q.length; G++) {
        var Z = Q[G],
          Y = Z instanceof Nd5;
        B.appendChild(Y ? Z : A.createTextNode(String(Z)))
      }
      return B
    },
    Ld5 = {
      after: {
        value: function () {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.nextSibling;
          if (B === null) return;
          while (G && Q.some(function (Y) {
              return Y === G
            })) G = G.nextSibling;
          var Z = MC0(this.doc, Q);
          B.insertBefore(Z, G)
        }
      },
      before: {
        value: function () {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.previousSibling;
          if (B === null) return;
          while (G && Q.some(function (J) {
              return J === G
            })) G = G.previousSibling;
          var Z = MC0(this.doc, Q),
            Y = G ? G.nextSibling : B.firstChild;
          B.insertBefore(Z, Y)
        }
      },
      remove: {
        value: function () {
          if (this.parentNode === null) return;
          if (this.doc) {
            if (this.doc._preremoveNodeIterators(this), this.rooted) this.doc.mutateRemove(this)
          }
          this._remove(), this.parentNode = null
        }
      },
      _remove: {
        value: function () {
          var Q = this.parentNode;
          if (Q === null) return;
          if (Q._childNodes) Q._childNodes.splice(this.index, 1);
          else if (Q._firstChild === this)
            if (this._nextSibling === this) Q._firstChild = null;
            else Q._firstChild = this._nextSibling;
          wd5.remove(this), Q.modify()
        }
      },
      replaceWith: {
        value: function () {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.nextSibling;
          if (B === null) return;
          while (G && Q.some(function (Y) {
              return Y === G
            })) G = G.nextSibling;
          var Z = MC0(this.doc, Q);
          if (this.parentNode === B) B.replaceChild(Z, this);
          else B.insertBefore(Z, G)
        }
      }
    };
  Bb2.exports = Ld5
})
// @from(Ln 339313, Col 4)
RC0 = U((w0Y, Zb2) => {
  var Gb2 = ME(),
    Od5 = {
      nextElementSibling: {
        get: function () {
          if (this.parentNode) {
            for (var A = this.nextSibling; A !== null; A = A.nextSibling)
              if (A.nodeType === Gb2.ELEMENT_NODE) return A
          }
          return null
        }
      },
      previousElementSibling: {
        get: function () {
          if (this.parentNode) {
            for (var A = this.previousSibling; A !== null; A = A.previousSibling)
              if (A.nodeType === Gb2.ELEMENT_NODE) return A
          }
          return null
        }
      }
    };
  Zb2.exports = Od5
})
// @from(Ln 339337, Col 4)
_C0 = U((L0Y, Jb2) => {
  Jb2.exports = Yb2;
  var bHA = BD();

  function Yb2(A) {
    this.element = A
  }
  Object.defineProperties(Yb2.prototype, {
    length: {
      get: bHA.shouldOverride
    },
    item: {
      value: bHA.shouldOverride
    },
    getNamedItem: {
      value: function (Q) {
        return this.element.getAttributeNode(Q)
      }
    },
    getNamedItemNS: {
      value: function (Q, B) {
        return this.element.getAttributeNodeNS(Q, B)
      }
    },
    setNamedItem: {
      value: bHA.nyi
    },
    setNamedItemNS: {
      value: bHA.nyi
    },
    removeNamedItem: {
      value: function (Q) {
        var B = this.element.getAttributeNode(Q);
        if (B) return this.element.removeAttribute(Q), B;
        bHA.NotFoundError()
      }
    },
    removeNamedItemNS: {
      value: function (Q, B) {
        var G = this.element.getAttributeNodeNS(Q, B);
        if (G) return this.element.removeAttributeNS(Q, B), G;
        bHA.NotFoundError()
      }
    }
  })
})
// @from(Ln 339383, Col 4)
hHA = U((O0Y, Kb2) => {
  Kb2.exports = ss;
  var jC0 = _W1(),
    $I = BD(),
    Nf = $I.NAMESPACE,
    vW1 = UC0(),
    Dx = ME(),
    TC0 = p6A(),
    Md5 = XC0(),
    yW1 = ik2(),
    fHA = wW1(),
    Rd5 = NC0(),
    PC0 = SW1(),
    Ib2 = RW1(),
    _d5 = xW1(),
    jd5 = RC0(),
    Db2 = _C0(),
    Xb2 = Object.create(null);

  function ss(A, Q, B, G) {
    Ib2.call(this), this.nodeType = Dx.ELEMENT_NODE, this.ownerDocument = A, this.localName = Q, this.namespaceURI = B, this.prefix = G, this._tagName = void 0, this._attrsByQName = Object.create(null), this._attrsByLName = Object.create(null), this._attrKeys = []
  }

  function SC0(A, Q) {
    if (A.nodeType === Dx.TEXT_NODE) Q.push(A._data);
    else
      for (var B = 0, G = A.childNodes.length; B < G; B++) SC0(A.childNodes[B], Q)
  }
  ss.prototype = Object.create(Ib2.prototype, {
    isHTML: {
      get: function () {
        return this.namespaceURI === Nf.HTML && this.ownerDocument.isHTML
      }
    },
    tagName: {
      get: function () {
        if (this._tagName === void 0) {
          var Q;
          if (this.prefix === null) Q = this.localName;
          else Q = this.prefix + ":" + this.localName;
          if (this.isHTML) {
            var B = Xb2[Q];
            if (!B) Xb2[Q] = B = $I.toASCIIUpperCase(Q);
            Q = B
          }
          this._tagName = Q
        }
        return this._tagName
      }
    },
    nodeName: {
      get: function () {
        return this.tagName
      }
    },
    nodeValue: {
      get: function () {
        return null
      },
      set: function () {}
    },
    textContent: {
      get: function () {
        var A = [];
        return SC0(this, A), A.join("")
      },
      set: function (A) {
        if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
      }
    },
    innerText: {
      get: function () {
        var A = [];
        return SC0(this, A), A.join("").replace(/[ \t\n\f\r]+/g, " ").trim()
      },
      set: function (A) {
        if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
      }
    },
    innerHTML: {
      get: function () {
        return this.serialize()
      },
      set: $I.nyi
    },
    outerHTML: {
      get: function () {
        return Md5.serializeOne(this, {
          nodeType: 0
        })
      },
      set: function (A) {
        var Q = this.ownerDocument,
          B = this.parentNode;
        if (B === null) return;
        if (B.nodeType === Dx.DOCUMENT_NODE) $I.NoModificationAllowedError();
        if (B.nodeType === Dx.DOCUMENT_FRAGMENT_NODE) B = B.ownerDocument.createElement("body");
        var G = Q.implementation.mozHTMLParser(Q._address, B);
        G.parse(A === null ? "" : String(A), !0), this.replaceWith(G._asDocumentFragment())
      }
    },
    _insertAdjacent: {
      value: function (Q, B) {
        var G = !1;
        switch (Q) {
          case "beforebegin":
            G = !0;
          case "afterend":
            var Z = this.parentNode;
            if (Z === null) return null;
            return Z.insertBefore(B, G ? this : this.nextSibling);
          case "afterbegin":
            G = !0;
          case "beforeend":
            return this.insertBefore(B, G ? this.firstChild : null);
          default:
            return $I.SyntaxError()
        }
      }
    },
    insertAdjacentElement: {
      value: function (Q, B) {
        if (B.nodeType !== Dx.ELEMENT_NODE) throw TypeError("not an element");
        return Q = $I.toASCIILowerCase(String(Q)), this._insertAdjacent(Q, B)
      }
    },
    insertAdjacentText: {
      value: function (Q, B) {
        var G = this.ownerDocument.createTextNode(B);
        Q = $I.toASCIILowerCase(String(Q)), this._insertAdjacent(Q, G)
      }
    },
    insertAdjacentHTML: {
      value: function (Q, B) {
        Q = $I.toASCIILowerCase(String(Q)), B = String(B);
        var G;
        switch (Q) {
          case "beforebegin":
          case "afterend":
            if (G = this.parentNode, G === null || G.nodeType === Dx.DOCUMENT_NODE) $I.NoModificationAllowedError();
            break;
          case "afterbegin":
          case "beforeend":
            G = this;
            break;
          default:
            $I.SyntaxError()
        }
        if (!(G instanceof ss) || G.ownerDocument.isHTML && G.localName === "html" && G.namespaceURI === Nf.HTML) G = G.ownerDocument.createElementNS(Nf.HTML, "body");
        var Z = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, G);
        Z.parse(B, !0), this._insertAdjacent(Q, Z._asDocumentFragment())
      }
    },
    children: {
      get: function () {
        if (!this._children) this._children = new Wb2(this);
        return this._children
      }
    },
    attributes: {
      get: function () {
        if (!this._attributes) this._attributes = new yC0(this);
        return this._attributes
      }
    },
    firstElementChild: {
      get: function () {
        for (var A = this.firstChild; A !== null; A = A.nextSibling)
          if (A.nodeType === Dx.ELEMENT_NODE) return A;
        return null
      }
    },
    lastElementChild: {
      get: function () {
        for (var A = this.lastChild; A !== null; A = A.previousSibling)
          if (A.nodeType === Dx.ELEMENT_NODE) return A;
        return null
      }
    },
    childElementCount: {
      get: function () {
        return this.children.length
      }
    },
    nextElement: {
      value: function (A) {
        if (!A) A = this.ownerDocument.documentElement;
        var Q = this.firstElementChild;
        if (!Q) {
          if (this === A) return null;
          Q = this.nextElementSibling
        }
        if (Q) return Q;
        for (var B = this.parentElement; B && B !== A; B = B.parentElement)
          if (Q = B.nextElementSibling, Q) return Q;
        return null
      }
    },
    getElementsByTagName: {
      value: function (Q) {
        var B;
        if (!Q) return new TC0;
        if (Q === "*") B = function () {
          return !0
        };
        else if (this.isHTML) B = Td5(Q);
        else B = xC0(Q);
        return new yW1(this, B)
      }
    },
    getElementsByTagNameNS: {
      value: function (Q, B) {
        var G;
        if (Q === "*" && B === "*") G = function () {
          return !0
        };
        else if (Q === "*") G = xC0(B);
        else if (B === "*") G = Pd5(Q);
        else G = Sd5(Q, B);
        return new yW1(this, G)
      }
    },
    getElementsByClassName: {
      value: function (Q) {
        if (Q = String(Q).trim(), Q === "") {
          var B = new TC0;
          return B
        }
        return Q = Q.split(/[ \t\r\n\f]+/), new yW1(this, xd5(Q))
      }
    },
    getElementsByName: {
      value: function (Q) {
        return new yW1(this, yd5(String(Q)))
      }
    },
    clone: {
      value: function () {
        var Q;
        if (this.namespaceURI !== Nf.HTML || this.prefix || !this.ownerDocument.isHTML) Q = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName);
        else Q = this.ownerDocument.createElement(this.localName);
        for (var B = 0, G = this._attrKeys.length; B < G; B++) {
          var Z = this._attrKeys[B],
            Y = this._attrsByLName[Z],
            J = Y.cloneNode();
          J._setOwnerElement(Q), Q._attrsByLName[Z] = J, Q._addQName(J)
        }
        return Q._attrKeys = this._attrKeys.concat(), Q
      }
    },
    isEqual: {
      value: function (Q) {
        if (this.localName !== Q.localName || this.namespaceURI !== Q.namespaceURI || this.prefix !== Q.prefix || this._numattrs !== Q._numattrs) return !1;
        for (var B = 0, G = this._numattrs; B < G; B++) {
          var Z = this._attr(B);
          if (!Q.hasAttributeNS(Z.namespaceURI, Z.localName)) return !1;
          if (Q.getAttributeNS(Z.namespaceURI, Z.localName) !== Z.value) return !1
        }
        return !0
      }
    },
    _lookupNamespacePrefix: {
      value: function (Q, B) {
        if (this.namespaceURI && this.namespaceURI === Q && this.prefix !== null && B.lookupNamespaceURI(this.prefix) === Q) return this.prefix;
        for (var G = 0, Z = this._numattrs; G < Z; G++) {
          var Y = this._attr(G);
          if (Y.prefix === "xmlns" && Y.value === Q && B.lookupNamespaceURI(Y.localName) === Q) return Y.localName
        }
        var J = this.parentElement;
        return J ? J._lookupNamespacePrefix(Q, B) : null
      }
    },
    lookupNamespaceURI: {
      value: function (Q) {
        if (Q === "" || Q === void 0) Q = null;
        if (this.namespaceURI !== null && this.prefix === Q) return this.namespaceURI;
        for (var B = 0, G = this._numattrs; B < G; B++) {
          var Z = this._attr(B);
          if (Z.namespaceURI === Nf.XMLNS) {
            if (Z.prefix === "xmlns" && Z.localName === Q || Q === null && Z.prefix === null && Z.localName === "xmlns") return Z.value || null
          }
        }
        var Y = this.parentElement;
        return Y ? Y.lookupNamespaceURI(Q) : null
      }
    },
    getAttribute: {
      value: function (Q) {
        var B = this.getAttributeNode(Q);
        return B ? B.value : null
      }
    },
    getAttributeNS: {
      value: function (Q, B) {
        var G = this.getAttributeNodeNS(Q, B);
        return G ? G.value : null
      }
    },
    getAttributeNode: {
      value: function (Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = $I.toASCIILowerCase(Q);
        var B = this._attrsByQName[Q];
        if (!B) return null;
        if (Array.isArray(B)) B = B[0];
        return B
      }
    },
    getAttributeNodeNS: {
      value: function (Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = this._attrsByLName[Q + "|" + B];
        return G ? G : null
      }
    },
    hasAttribute: {
      value: function (Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = $I.toASCIILowerCase(Q);
        return this._attrsByQName[Q] !== void 0
      }
    },
    hasAttributeNS: {
      value: function (Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = Q + "|" + B;
        return this._attrsByLName[G] !== void 0
      }
    },
    hasAttributes: {
      value: function () {
        return this._numattrs > 0
      }
    },
    toggleAttribute: {
      value: function (Q, B) {
        if (Q = String(Q), !jC0.isValidName(Q)) $I.InvalidCharacterError();
        if (/[A-Z]/.test(Q) && this.isHTML) Q = $I.toASCIILowerCase(Q);
        var G = this._attrsByQName[Q];
        if (G === void 0) {
          if (B === void 0 || B === !0) return this._setAttribute(Q, ""), !0;
          return !1
        } else {
          if (B === void 0 || B === !1) return this.removeAttribute(Q), !1;
          return !0
        }
      }
    },
    _setAttribute: {
      value: function (Q, B) {
        var G = this._attrsByQName[Q],
          Z;
        if (!G) G = this._newattr(Q), Z = !0;
        else if (Array.isArray(G)) G = G[0];
        if (G.value = B, this._attributes) this._attributes[Q] = G;
        if (Z && this._newattrhook) this._newattrhook(Q, B)
      }
    },
    setAttribute: {
      value: function (Q, B) {
        if (Q = String(Q), !jC0.isValidName(Q)) $I.InvalidCharacterError();
        if (/[A-Z]/.test(Q) && this.isHTML) Q = $I.toASCIILowerCase(Q);
        this._setAttribute(Q, String(B))
      }
    },
    _setAttributeNS: {
      value: function (Q, B, G) {
        var Z = B.indexOf(":"),
          Y, J;
        if (Z < 0) Y = null, J = B;
        else Y = B.substring(0, Z), J = B.substring(Z + 1);
        if (Q === "" || Q === void 0) Q = null;
        var X = (Q === null ? "" : Q) + "|" + J,
          I = this._attrsByLName[X],
          D;
        if (!I) {
          if (I = new LbA(this, J, Y, Q), D = !0, this._attrsByLName[X] = I, this._attributes) this._attributes[this._attrKeys.length] = I;
          this._attrKeys.push(X), this._addQName(I)
        }
        if (I.value = G, D && this._newattrhook) this._newattrhook(B, G)
      }
    },
    setAttributeNS: {
      value: function (Q, B, G) {
        if (Q = Q === null || Q === void 0 || Q === "" ? null : String(Q), B = String(B), !jC0.isValidQName(B)) $I.InvalidCharacterError();
        var Z = B.indexOf(":"),
          Y = Z < 0 ? null : B.substring(0, Z);
        if (Y !== null && Q === null || Y === "xml" && Q !== Nf.XML || (B === "xmlns" || Y === "xmlns") && Q !== Nf.XMLNS || Q === Nf.XMLNS && !(B === "xmlns" || Y === "xmlns")) $I.NamespaceError();
        this._setAttributeNS(Q, B, String(G))
      }
    },
    setAttributeNode: {
      value: function (Q) {
        if (Q.ownerElement !== null && Q.ownerElement !== this) throw new fHA(fHA.INUSE_ATTRIBUTE_ERR);
        var B = null,
          G = this._attrsByQName[Q.name];
        if (G) {
          if (!Array.isArray(G)) G = [G];
          if (G.some(function (Z) {
              return Z === Q
            })) return Q;
          else if (Q.ownerElement !== null) throw new fHA(fHA.INUSE_ATTRIBUTE_ERR);
          G.forEach(function (Z) {
            this.removeAttributeNode(Z)
          }, this), B = G[0]
        }
        return this.setAttributeNodeNS(Q), B
      }
    },
    setAttributeNodeNS: {
      value: function (Q) {
        if (Q.ownerElement !== null) throw new fHA(fHA.INUSE_ATTRIBUTE_ERR);
        var B = Q.namespaceURI,
          G = (B === null ? "" : B) + "|" + Q.localName,
          Z = this._attrsByLName[G];
        if (Z) this.removeAttributeNode(Z);
        if (Q._setOwnerElement(this), this._attrsByLName[G] = Q, this._attributes) this._attributes[this._attrKeys.length] = Q;
        if (this._attrKeys.push(G), this._addQName(Q), this._newattrhook) this._newattrhook(Q.name, Q.value);
        return Z || null
      }
    },
    removeAttribute: {
      value: function (Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = $I.toASCIILowerCase(Q);
        var B = this._attrsByQName[Q];
        if (!B) return;
        if (Array.isArray(B))
          if (B.length > 2) B = B.shift();
          else this._attrsByQName[Q] = B[1], B = B[0];
        else this._attrsByQName[Q] = void 0;
        var G = B.namespaceURI,
          Z = (G === null ? "" : G) + "|" + B.localName;
        this._attrsByLName[Z] = void 0;
        var Y = this._attrKeys.indexOf(Z);
        if (this._attributes) Array.prototype.splice.call(this._attributes, Y, 1), this._attributes[Q] = void 0;
        this._attrKeys.splice(Y, 1);
        var J = B.onchange;
        if (B._setOwnerElement(null), J) J.call(B, this, B.localName, B.value, null);
        if (this.rooted) this.ownerDocument.mutateRemoveAttr(B)
      }
    },
    removeAttributeNS: {
      value: function (Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = Q + "|" + B,
          Z = this._attrsByLName[G];
        if (!Z) return;
        this._attrsByLName[G] = void 0;
        var Y = this._attrKeys.indexOf(G);
        if (this._attributes) Array.prototype.splice.call(this._attributes, Y, 1);
        this._attrKeys.splice(Y, 1), this._removeQName(Z);
        var J = Z.onchange;
        if (Z._setOwnerElement(null), J) J.call(Z, this, Z.localName, Z.value, null);
        if (this.rooted) this.ownerDocument.mutateRemoveAttr(Z)
      }
    },
    removeAttributeNode: {
      value: function (Q) {
        var B = Q.namespaceURI,
          G = (B === null ? "" : B) + "|" + Q.localName;
        if (this._attrsByLName[G] !== Q) $I.NotFoundError();
        return this.removeAttributeNS(B, Q.localName), Q
      }
    },
    getAttributeNames: {
      value: function () {
        var Q = this;
        return this._attrKeys.map(function (B) {
          return Q._attrsByLName[B].name
        })
      }
    },
    _getattr: {
      value: function (Q) {
        var B = this._attrsByQName[Q];
        return B ? B.value : null
      }
    },
    _setattr: {
      value: function (Q, B) {
        var G = this._attrsByQName[Q],
          Z;
        if (!G) G = this._newattr(Q), Z = !0;
        if (G.value = String(B), this._attributes) this._attributes[Q] = G;
        if (Z && this._newattrhook) this._newattrhook(Q, B)
      }
    },
    _newattr: {
      value: function (Q) {
        var B = new LbA(this, Q, null, null),
          G = "|" + Q;
        if (this._attrsByQName[Q] = B, this._attrsByLName[G] = B, this._attributes) this._attributes[this._attrKeys.length] = B;
        return this._attrKeys.push(G), B
      }
    },
    _addQName: {
      value: function (A) {
        var Q = A.name,
          B = this._attrsByQName[Q];
        if (!B) this._attrsByQName[Q] = A;
        else if (Array.isArray(B)) B.push(A);
        else this._attrsByQName[Q] = [B, A];
        if (this._attributes) this._attributes[Q] = A
      }
    },
    _removeQName: {
      value: function (A) {
        var Q = A.name,
          B = this._attrsByQName[Q];
        if (Array.isArray(B)) {
          var G = B.indexOf(A);
          if ($I.assert(G !== -1), B.length === 2) {
            if (this._attrsByQName[Q] = B[1 - G], this._attributes) this._attributes[Q] = this._attrsByQName[Q]
          } else if (B.splice(G, 1), this._attributes && this._attributes[Q] === A) this._attributes[Q] = B[0]
        } else if ($I.assert(B === A), this._attrsByQName[Q] = void 0, this._attributes) this._attributes[Q] = void 0
      }
    },
    _numattrs: {
      get: function () {
        return this._attrKeys.length
      }
    },
    _attr: {
      value: function (A) {
        return this._attrsByLName[this._attrKeys[A]]
      }
    },
    id: vW1.property({
      name: "id"
    }),
    className: vW1.property({
      name: "class"
    }),
    classList: {
      get: function () {
        var A = this;
        if (this._classList) return this._classList;
        var Q = new Rd5(function () {
          return A.className || ""
        }, function (B) {
          A.className = B
        });
        return this._classList = Q, Q
      },
      set: function (A) {
        this.className = A
      }
    },
    matches: {
      value: function (A) {
        return PC0.matches(this, A)
      }
    },
    closest: {
      value: function (A) {
        var Q = this;
        do {
          if (Q.matches && Q.matches(A)) return Q;
          Q = Q.parentElement || Q.parentNode
        } while (Q !== null && Q.nodeType === Dx.ELEMENT_NODE);
        return null
      }
    },
    querySelector: {
      value: function (A) {
        return PC0(A, this)[0]
      }
    },
    querySelectorAll: {
      value: function (A) {
        var Q = PC0(A, this);
        return Q.item ? Q : new TC0(Q)
      }
    }
  });
  Object.defineProperties(ss.prototype, _d5);
  Object.defineProperties(ss.prototype, jd5);
  vW1.registerChangeHandler(ss, "id", function (A, Q, B, G) {
    if (A.rooted) {
      if (B) A.ownerDocument.delId(B, A);
      if (G) A.ownerDocument.addId(G, A)
    }
  });
  vW1.registerChangeHandler(ss, "class", function (A, Q, B, G) {
    if (A._classList) A._classList._update()
  });

  function LbA(A, Q, B, G, Z) {
    this.localName = Q, this.prefix = B === null || B === "" ? null : "" + B, this.namespaceURI = G === null || G === "" ? null : "" + G, this.data = Z, this._setOwnerElement(A)
  }
  LbA.prototype = Object.create(Object.prototype, {
    ownerElement: {
      get: function () {
        return this._ownerElement
      }
    },
    _setOwnerElement: {
      value: function (Q) {
        if (this._ownerElement = Q, this.prefix === null && this.namespaceURI === null && Q) this.onchange = Q._attributeChangeHandlers[this.localName];
        else this.onchange = null
      }
    },
    name: {
      get: function () {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName
      }
    },
    specified: {
      get: function () {
        return !0
      }
    },
    value: {
      get: function () {
        return this.data
      },
      set: function (A) {
        var Q = this.data;
        if (A = A === void 0 ? "" : A + "", A === Q) return;
        if (this.data = A, this.ownerElement) {
          if (this.onchange) this.onchange(this.ownerElement, this.localName, Q, A);
          if (this.ownerElement.rooted) this.ownerElement.ownerDocument.mutateAttr(this, Q)
        }
      }
    },
    cloneNode: {
      value: function (Q) {
        return new LbA(null, this.localName, this.prefix, this.namespaceURI, this.data)
      }
    },
    nodeType: {
      get: function () {
        return Dx.ATTRIBUTE_NODE
      }
    },
    nodeName: {
      get: function () {
        return this.name
      }
    },
    nodeValue: {
      get: function () {
        return this.value
      },
      set: function (A) {
        this.value = A
      }
    },
    textContent: {
      get: function () {
        return this.value
      },
      set: function (A) {
        if (A === null || A === void 0) A = "";
        this.value = A
      }
    },
    innerText: {
      get: function () {
        return this.value
      },
      set: function (A) {
        if (A === null || A === void 0) A = "";
        this.value = A
      }
    }
  });
  ss._Attr = LbA;

  function yC0(A) {
    Db2.call(this, A);
    for (var Q in A._attrsByQName) this[Q] = A._attrsByQName[Q];
    for (var B = 0; B < A._attrKeys.length; B++) this[B] = A._attrsByLName[A._attrKeys[B]]
  }
  yC0.prototype = Object.create(Db2.prototype, {
    length: {
      get: function () {
        return this.element._attrKeys.length
      },
      set: function () {}
    },
    item: {
      value: function (A) {
        if (A = A >>> 0, A >= this.length) return null;
        return this.element._attrsByLName[this.element._attrKeys[A]]
      }
    }
  });
  if (globalThis.Symbol?.iterator) yC0.prototype[globalThis.Symbol.iterator] = function () {
    var A = 0,
      Q = this.length,
      B = this;
    return {
      next: function () {
        if (A < Q) return {
          value: B.item(A++)
        };
        return {
          done: !0
        }
      }
    }
  };

  function Wb2(A) {
    this.element = A, this.updateCache()
  }
  Wb2.prototype = Object.create(Object.prototype, {
    length: {
      get: function () {
        return this.updateCache(), this.childrenByNumber.length
      }
    },
    item: {
      value: function (Q) {
        return this.updateCache(), this.childrenByNumber[Q] || null
      }
    },
    namedItem: {
      value: function (Q) {
        return this.updateCache(), this.childrenByName[Q] || null
      }
    },
    namedItems: {
      get: function () {
        return this.updateCache(), this.childrenByName
      }
    },
    updateCache: {
      value: function () {
        var Q = /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
        if (this.lastModTime !== this.element.lastModTime) {
          this.lastModTime = this.element.lastModTime;
          var B = this.childrenByNumber && this.childrenByNumber.length || 0;
          for (var G = 0; G < B; G++) this[G] = void 0;
          this.childrenByNumber = [], this.childrenByName = Object.create(null);
          for (var Z = this.element.firstChild; Z !== null; Z = Z.nextSibling)
            if (Z.nodeType === Dx.ELEMENT_NODE) {
              this[this.childrenByNumber.length] = Z, this.childrenByNumber.push(Z);
              var Y = Z.getAttribute("id");
              if (Y && !this.childrenByName[Y]) this.childrenByName[Y] = Z;
              var J = Z.getAttribute("name");
              if (J && this.element.namespaceURI === Nf.HTML && Q.test(this.element.localName) && !this.childrenByName[J]) this.childrenByName[Y] = Z
            }
        }
      }
    }
  });

  function xC0(A) {
    return function (Q) {
      return Q.localName === A
    }
  }

  function Td5(A) {
    var Q = $I.toASCIILowerCase(A);
    if (Q === A) return xC0(A);
    return function (B) {
      return B.isHTML ? B.localName === Q : B.localName === A
    }
  }

  function Pd5(A) {
    return function (Q) {
      return Q.namespaceURI === A
    }
  }

  function Sd5(A, Q) {
    return function (B) {
      return B.namespaceURI === A && B.localName === Q
    }
  }

  function xd5(A) {
    return function (Q) {
      return A.every(function (B) {
        return Q.classList.contains(B)
      })
    }
  }

  function yd5(A) {
    return function (Q) {
      if (Q.namespaceURI !== Nf.HTML) return !1;
      return Q.getAttribute("name") === A
    }
  }
})
// @from(Ln 340171, Col 4)
vC0 = U((M0Y, zb2) => {
  zb2.exports = Eb2;
  var Fb2 = ME(),
    vd5 = p6A(),
    Hb2 = BD(),
    Vb2 = Hb2.HierarchyRequestError,
    kd5 = Hb2.NotFoundError;

  function Eb2() {
    Fb2.call(this)
  }
  Eb2.prototype = Object.create(Fb2.prototype, {
    hasChildNodes: {
      value: function () {
        return !1
      }
    },
    firstChild: {
      value: null
    },
    lastChild: {
      value: null
    },
    insertBefore: {
      value: function (A, Q) {
        if (!A.nodeType) throw TypeError("not a node");
        Vb2()
      }
    },
    replaceChild: {
      value: function (A, Q) {
        if (!A.nodeType) throw TypeError("not a node");
        Vb2()
      }
    },
    removeChild: {
      value: function (A) {
        if (!A.nodeType) throw TypeError("not a node");
        kd5()
      }
    },
    removeChildren: {
      value: function () {}
    },
    childNodes: {
      get: function () {
        if (!this._childNodes) this._childNodes = new vd5;
        return this._childNodes
      }
    }
  })
})
// @from(Ln 340223, Col 4)
ObA = U((R0Y, Ub2) => {
  Ub2.exports = kW1;
  var Cb2 = vC0(),
    $b2 = BD(),
    bd5 = xW1(),
    fd5 = RC0();

  function kW1() {
    Cb2.call(this)
  }
  kW1.prototype = Object.create(Cb2.prototype, {
    substringData: {
      value: function (Q, B) {
        if (arguments.length < 2) throw TypeError("Not enough arguments");
        if (Q = Q >>> 0, B = B >>> 0, Q > this.data.length || Q < 0 || B < 0) $b2.IndexSizeError();
        return this.data.substring(Q, Q + B)
      }
    },
    appendData: {
      value: function (Q) {
        if (arguments.length < 1) throw TypeError("Not enough arguments");
        this.data += String(Q)
      }
    },
    insertData: {
      value: function (Q, B) {
        return this.replaceData(Q, 0, B)
      }
    },
    deleteData: {
      value: function (Q, B) {
        return this.replaceData(Q, B, "")
      }
    },
    replaceData: {
      value: function (Q, B, G) {
        var Z = this.data,
          Y = Z.length;
        if (Q = Q >>> 0, B = B >>> 0, G = String(G), Q > Y || Q < 0) $b2.IndexSizeError();
        if (Q + B > Y) B = Y - Q;
        var J = Z.substring(0, Q),
          X = Z.substring(Q + B);
        this.data = J + G + X
      }
    },
    isEqual: {
      value: function (Q) {
        return this._data === Q._data
      }
    },
    length: {
      get: function () {
        return this.data.length
      }
    }
  });
  Object.defineProperties(kW1.prototype, bd5);
  Object.defineProperties(kW1.prototype, fd5)
})
// @from(Ln 340282, Col 4)
bC0 = U((_0Y, Lb2) => {
  Lb2.exports = kC0;
  var qb2 = BD(),
    Nb2 = ME(),
    wb2 = ObA();

  function kC0(A, Q) {
    wb2.call(this), this.nodeType = Nb2.TEXT_NODE, this.ownerDocument = A, this._data = Q, this._index = void 0
  }
  var MbA = {
    get: function () {
      return this._data
    },
    set: function (A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (A === this._data) return;
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this);
      if (this.parentNode && this.parentNode._textchangehook) this.parentNode._textchangehook(this)
    }
  };
  kC0.prototype = Object.create(wb2.prototype, {
    nodeName: {
      value: "#text"
    },
    nodeValue: MbA,
    textContent: MbA,
    innerText: MbA,
    data: {
      get: MbA.get,
      set: function (A) {
        MbA.set.call(this, A === null ? "" : String(A))
      }
    },
    splitText: {
      value: function (Q) {
        if (Q > this._data.length || Q < 0) qb2.IndexSizeError();
        var B = this._data.substring(Q),
          G = this.ownerDocument.createTextNode(B);
        this.data = this.data.substring(0, Q);
        var Z = this.parentNode;
        if (Z !== null) Z.insertBefore(G, this.nextSibling);
        return G
      }
    },
    wholeText: {
      get: function () {
        var Q = this.textContent;
        for (var B = this.nextSibling; B; B = B.nextSibling) {
          if (B.nodeType !== Nb2.TEXT_NODE) break;
          Q += B.textContent
        }
        return Q
      }
    },
    replaceWholeText: {
      value: qb2.nyi
    },
    clone: {
      value: function () {
        return new kC0(this.ownerDocument, this._data)
      }
    }
  })
})
// @from(Ln 340347, Col 4)
hC0 = U((j0Y, Mb2) => {
  Mb2.exports = fC0;
  var hd5 = ME(),
    Ob2 = ObA();

  function fC0(A, Q) {
    Ob2.call(this), this.nodeType = hd5.COMMENT_NODE, this.ownerDocument = A, this._data = Q
  }
  var RbA = {
    get: function () {
      return this._data
    },
    set: function (A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
    }
  };
  fC0.prototype = Object.create(Ob2.prototype, {
    nodeName: {
      value: "#comment"
    },
    nodeValue: RbA,
    textContent: RbA,
    innerText: RbA,
    data: {
      get: RbA.get,
      set: function (A) {
        RbA.set.call(this, A === null ? "" : String(A))
      }
    },
    clone: {
      value: function () {
        return new fC0(this.ownerDocument, this._data)
      }
    }
  })
})
// @from(Ln 340385, Col 4)
uC0 = U((T0Y, jb2) => {
  jb2.exports = gC0;
  var gd5 = ME(),
    ud5 = p6A(),
    _b2 = RW1(),
    bW1 = hHA(),
    md5 = SW1(),
    Rb2 = BD();

  function gC0(A) {
    _b2.call(this), this.nodeType = gd5.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = A
  }
  gC0.prototype = Object.create(_b2.prototype, {
    nodeName: {
      value: "#document-fragment"
    },
    nodeValue: {
      get: function () {
        return null
      },
      set: function () {}
    },
    textContent: Object.getOwnPropertyDescriptor(bW1.prototype, "textContent"),
    innerText: Object.getOwnPropertyDescriptor(bW1.prototype, "innerText"),
    querySelector: {
      value: function (A) {
        var Q = this.querySelectorAll(A);
        return Q.length ? Q[0] : null
      }
    },
    querySelectorAll: {
      value: function (A) {
        var Q = Object.create(this);
        Q.isHTML = !0, Q.getElementsByTagName = bW1.prototype.getElementsByTagName, Q.nextElement = Object.getOwnPropertyDescriptor(bW1.prototype, "firstElementChild").get;
        var B = md5(A, Q);
        return B.item ? B : new ud5(B)
      }
    },
    clone: {
      value: function () {
        return new gC0(this.ownerDocument)
      }
    },
    isEqual: {
      value: function (Q) {
        return !0
      }
    },
    innerHTML: {
      get: function () {
        return this.serialize()
      },
      set: Rb2.nyi
    },
    outerHTML: {
      get: function () {
        return this.serialize()
      },
      set: Rb2.nyi
    }
  })
})
// @from(Ln 340447, Col 4)
dC0 = U((P0Y, Pb2) => {
  Pb2.exports = mC0;
  var dd5 = ME(),
    Tb2 = ObA();

  function mC0(A, Q, B) {
    Tb2.call(this), this.nodeType = dd5.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = A, this.target = Q, this._data = B
  }
  var _bA = {
    get: function () {
      return this._data
    },
    set: function (A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
    }
  };
  mC0.prototype = Object.create(Tb2.prototype, {
    nodeName: {
      get: function () {
        return this.target
      }
    },
    nodeValue: _bA,
    textContent: _bA,
    innerText: _bA,
    data: {
      get: _bA.get,
      set: function (A) {
        _bA.set.call(this, A === null ? "" : String(A))
      }
    },
    clone: {
      value: function () {
        return new mC0(this.ownerDocument, this.target, this._data)
      }
    },
    isEqual: {
      value: function (Q) {
        return this.target === Q.target && this._data === Q._data
      }
    }
  })
})
// @from(Ln 340492, Col 4)
jbA = U((S0Y, Sb2) => {
  var cC0 = {
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2,
    FILTER_SKIP: 3,
    SHOW_ALL: 4294967295,
    SHOW_ELEMENT: 1,
    SHOW_ATTRIBUTE: 2,
    SHOW_TEXT: 4,
    SHOW_CDATA_SECTION: 8,
    SHOW_ENTITY_REFERENCE: 16,
    SHOW_ENTITY: 32,
    SHOW_PROCESSING_INSTRUCTION: 64,
    SHOW_COMMENT: 128,
    SHOW_DOCUMENT: 256,
    SHOW_DOCUMENT_TYPE: 512,
    SHOW_DOCUMENT_FRAGMENT: 1024,
    SHOW_NOTATION: 2048
  };
  Sb2.exports = cC0.constructor = cC0.prototype = cC0
})
// @from(Ln 340513, Col 4)
lC0 = U((y0Y, yb2) => {
  var x0Y = yb2.exports = {
    nextSkippingChildren: cd5,
    nextAncestorSibling: pC0,
    next: pd5,
    previous: ld5,
    deepLastChild: xb2
  };

  function cd5(A, Q) {
    if (A === Q) return null;
    if (A.nextSibling !== null) return A.nextSibling;
    return pC0(A, Q)
  }

  function pC0(A, Q) {
    for (A = A.parentNode; A !== null; A = A.parentNode) {
      if (A === Q) return null;
      if (A.nextSibling !== null) return A.nextSibling
    }
    return null
  }

  function pd5(A, Q) {
    var B = A.firstChild;
    if (B !== null) return B;
    if (A === Q) return null;
    if (B = A.nextSibling, B !== null) return B;
    return pC0(A, Q)
  }

  function xb2(A) {
    while (A.lastChild) A = A.lastChild;
    return A
  }

  function ld5(A, Q) {
    var B = A.previousSibling;
    if (B !== null) return xb2(B);
    if (B = A.parentNode, B === Q) return null;
    return B
  }
})
// @from(Ln 340556, Col 4)
ub2 = U((v0Y, gb2) => {
  gb2.exports = hb2;
  var id5 = ME(),
    RE = jbA(),
    vb2 = lC0(),
    fb2 = BD(),
    iC0 = {
      first: "firstChild",
      last: "lastChild",
      next: "firstChild",
      previous: "lastChild"
    },
    nC0 = {
      first: "nextSibling",
      last: "previousSibling",
      next: "nextSibling",
      previous: "previousSibling"
    };

  function kb2(A, Q) {
    var B, G, Z, Y, J;
    G = A._currentNode[iC0[Q]];
    while (G !== null) {
      if (Y = A._internalFilter(G), Y === RE.FILTER_ACCEPT) return A._currentNode = G, G;
      if (Y === RE.FILTER_SKIP) {
        if (B = G[iC0[Q]], B !== null) {
          G = B;
          continue
        }
      }
      while (G !== null) {
        if (J = G[nC0[Q]], J !== null) {
          G = J;
          break
        }
        if (Z = G.parentNode, Z === null || Z === A.root || Z === A._currentNode) return null;
        else G = Z
      }
    }
    return null
  }

  function bb2(A, Q) {
    var B, G, Z;
    if (B = A._currentNode, B === A.root) return null;
    while (!0) {
      Z = B[nC0[Q]];
      while (Z !== null) {
        if (B = Z, G = A._internalFilter(B), G === RE.FILTER_ACCEPT) return A._currentNode = B, B;
        if (Z = B[iC0[Q]], G === RE.FILTER_REJECT || Z === null) Z = B[nC0[Q]]
      }
      if (B = B.parentNode, B === null || B === A.root) return null;
      if (A._internalFilter(B) === RE.FILTER_ACCEPT) return null
    }
  }

  function hb2(A, Q, B) {
    if (!A || !A.nodeType) fb2.NotSupportedError();
    this._root = A, this._whatToShow = Number(Q) || 0, this._filter = B || null, this._active = !1, this._currentNode = A
  }
  Object.defineProperties(hb2.prototype, {
    root: {
      get: function () {
        return this._root
      }
    },
    whatToShow: {
      get: function () {
        return this._whatToShow
      }
    },
    filter: {
      get: function () {
        return this._filter
      }
    },
    currentNode: {
      get: function () {
        return this._currentNode
      },
      set: function (Q) {
        if (!(Q instanceof id5)) throw TypeError("Not a Node");
        this._currentNode = Q
      }
    },
    _internalFilter: {
      value: function (Q) {
        var B, G;
        if (this._active) fb2.InvalidStateError();
        if (!(1 << Q.nodeType - 1 & this._whatToShow)) return RE.FILTER_SKIP;
        if (G = this._filter, G === null) B = RE.FILTER_ACCEPT;
        else {
          this._active = !0;
          try {
            if (typeof G === "function") B = G(Q);
            else B = G.acceptNode(Q)
          } finally {
            this._active = !1
          }
        }
        return +B
      }
    },
    parentNode: {
      value: function () {
        var Q = this._currentNode;
        while (Q !== this.root) {
          if (Q = Q.parentNode, Q === null) return null;
          if (this._internalFilter(Q) === RE.FILTER_ACCEPT) return this._currentNode = Q, Q
        }
        return null
      }
    },
    firstChild: {
      value: function () {
        return kb2(this, "first")
      }
    },
    lastChild: {
      value: function () {
        return kb2(this, "last")
      }
    },
    previousSibling: {
      value: function () {
        return bb2(this, "previous")
      }
    },
    nextSibling: {
      value: function () {
        return bb2(this, "next")
      }
    },
    previousNode: {
      value: function () {
        var Q, B, G, Z;
        Q = this._currentNode;
        while (Q !== this._root) {
          for (G = Q.previousSibling; G; G = Q.previousSibling) {
            if (Q = G, B = this._internalFilter(Q), B === RE.FILTER_REJECT) continue;
            for (Z = Q.lastChild; Z; Z = Q.lastChild)
              if (Q = Z, B = this._internalFilter(Q), B === RE.FILTER_REJECT) break;
            if (B === RE.FILTER_ACCEPT) return this._currentNode = Q, Q
          }
          if (Q === this.root || Q.parentNode === null) return null;
          if (Q = Q.parentNode, this._internalFilter(Q) === RE.FILTER_ACCEPT) return this._currentNode = Q, Q
        }
        return null
      }
    },
    nextNode: {
      value: function () {
        var Q, B, G, Z;
        Q = this._currentNode, B = RE.FILTER_ACCEPT;
        A: while (!0) {
          for (G = Q.firstChild; G; G = Q.firstChild)
            if (Q = G, B = this._internalFilter(Q), B === RE.FILTER_ACCEPT) return this._currentNode = Q, Q;
            else if (B === RE.FILTER_REJECT) break;
          for (Z = vb2.nextSkippingChildren(Q, this.root); Z; Z = vb2.nextSkippingChildren(Q, this.root))
            if (Q = Z, B = this._internalFilter(Q), B === RE.FILTER_ACCEPT) return this._currentNode = Q, Q;
            else if (B === RE.FILTER_SKIP) continue A;
          return null
        }
      }
    },
    toString: {
      value: function () {
        return "[object TreeWalker]"
      }
    }
  })
})
// @from(Ln 340728, Col 4)
ib2 = U((k0Y, lb2) => {
  lb2.exports = pb2;
  var aC0 = jbA(),
    oC0 = lC0(),
    cb2 = BD();

  function nd5(A, Q, B) {
    if (B) return oC0.next(A, Q);
    else {
      if (A === Q) return null;
      return oC0.previous(A, null)
    }
  }

  function mb2(A, Q) {
    for (; Q; Q = Q.parentNode)
      if (A === Q) return !0;
    return !1
  }

  function db2(A, Q) {
    var B, G;
    B = A._referenceNode, G = A._pointerBeforeReferenceNode;
    while (!0) {
      if (G === Q) G = !G;
      else if (B = nd5(B, A._root, Q), B === null) return null;
      var Z = A._internalFilter(B);
      if (Z === aC0.FILTER_ACCEPT) break
    }
    return A._referenceNode = B, A._pointerBeforeReferenceNode = G, B
  }

  function pb2(A, Q, B) {
    if (!A || !A.nodeType) cb2.NotSupportedError();
    this._root = A, this._referenceNode = A, this._pointerBeforeReferenceNode = !0, this._whatToShow = Number(Q) || 0, this._filter = B || null, this._active = !1, A.doc._attachNodeIterator(this)
  }
  Object.defineProperties(pb2.prototype, {
    root: {
      get: function () {
        return this._root
      }
    },
    referenceNode: {
      get: function () {
        return this._referenceNode
      }
    },
    pointerBeforeReferenceNode: {
      get: function () {
        return this._pointerBeforeReferenceNode
      }
    },
    whatToShow: {
      get: function () {
        return this._whatToShow
      }
    },
    filter: {
      get: function () {
        return this._filter
      }
    },
    _internalFilter: {
      value: function (Q) {
        var B, G;
        if (this._active) cb2.InvalidStateError();
        if (!(1 << Q.nodeType - 1 & this._whatToShow)) return aC0.FILTER_SKIP;
        if (G = this._filter, G === null) B = aC0.FILTER_ACCEPT;
        else {
          this._active = !0;
          try {
            if (typeof G === "function") B = G(Q);
            else B = G.acceptNode(Q)
          } finally {
            this._active = !1
          }
        }
        return +B
      }
    },
    _preremove: {
      value: function (Q) {
        if (mb2(Q, this._root)) return;
        if (!mb2(Q, this._referenceNode)) return;
        if (this._pointerBeforeReferenceNode) {
          var B = Q;
          while (B.lastChild) B = B.lastChild;
          if (B = oC0.next(B, this.root), B) {
            this._referenceNode = B;
            return
          }
          this._pointerBeforeReferenceNode = !1
        }
        if (Q.previousSibling === null) this._referenceNode = Q.parentNode;
        else {
          this._referenceNode = Q.previousSibling;
          var G;
          for (G = this._referenceNode.lastChild; G; G = this._referenceNode.lastChild) this._referenceNode = G
        }
      }
    },
    nextNode: {
      value: function () {
        return db2(this, !0)
      }
    },
    previousNode: {
      value: function () {
        return db2(this, !1)
      }
    },
    detach: {
      value: function () {}
    },
    toString: {
      value: function () {
        return "[object NodeIterator]"
      }
    }
  })
})
// @from(Ln 340849, Col 4)
fW1 = U((b0Y, nb2) => {
  nb2.exports = _E;

  function _E(A) {
    if (!A) return Object.create(_E.prototype);
    this.url = A.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
    var Q = _E.pattern.exec(this.url);
    if (Q) {
      if (Q[2]) this.scheme = Q[2];
      if (Q[4]) {
        var B = Q[4].match(_E.userinfoPattern);
        if (B) this.username = B[1], this.password = B[3], Q[4] = Q[4].substring(B[0].length);
        if (Q[4].match(_E.portPattern)) {
          var G = Q[4].lastIndexOf(":");
          this.host = Q[4].substring(0, G), this.port = Q[4].substring(G + 1)
        } else this.host = Q[4]
      }
      if (Q[5]) this.path = Q[5];
      if (Q[6]) this.query = Q[7];
      if (Q[8]) this.fragment = Q[9]
    }
  }
  _E.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
  _E.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
  _E.portPattern = /:\d+$/;
  _E.authorityPattern = /^[^:\/?#]+:\/\//;
  _E.hierarchyPattern = /^[^:\/?#]+:\//;
  _E.percentEncode = function (Q) {
    var B = Q.charCodeAt(0);
    if (B < 256) return "%" + B.toString(16);
    else throw Error("can't percent-encode codepoints > 255 yet")
  };
  _E.prototype = {
    constructor: _E,
    isAbsolute: function () {
      return !!this.scheme
    },
    isAuthorityBased: function () {
      return _E.authorityPattern.test(this.url)
    },
    isHierarchical: function () {
      return _E.hierarchyPattern.test(this.url)
    },
    toString: function () {
      var A = "";
      if (this.scheme !== void 0) A += this.scheme + ":";
      if (this.isAbsolute()) {
        if (A += "//", this.username || this.password) {
          if (A += this.username || "", this.password) A += ":" + this.password;
          A += "@"
        }
        if (this.host) A += this.host
      }
      if (this.port !== void 0) A += ":" + this.port;
      if (this.path !== void 0) A += this.path;
      if (this.query !== void 0) A += "?" + this.query;
      if (this.fragment !== void 0) A += "#" + this.fragment;
      return A
    },
    resolve: function (A) {
      var Q = this,
        B = new _E(A),
        G = new _E;
      if (B.scheme !== void 0) G.scheme = B.scheme, G.username = B.username, G.password = B.password, G.host = B.host, G.port = B.port, G.path = Y(B.path), G.query = B.query;
      else if (G.scheme = Q.scheme, B.host !== void 0) G.username = B.username, G.password = B.password, G.host = B.host, G.port = B.port, G.path = Y(B.path), G.query = B.query;
      else if (G.username = Q.username, G.password = Q.password, G.host = Q.host, G.port = Q.port, !B.path)
        if (G.path = Q.path, B.query !== void 0) G.query = B.query;
        else G.query = Q.query;
      else {
        if (B.path.charAt(0) === "/") G.path = Y(B.path);
        else G.path = Z(Q.path, B.path), G.path = Y(G.path);
        G.query = B.query
      }
      return G.fragment = B.fragment, G.toString();

      function Z(J, X) {
        if (Q.host !== void 0 && !Q.path) return "/" + X;
        var I = J.lastIndexOf("/");
        if (I === -1) return X;
        else return J.substring(0, I + 1) + X
      }

      function Y(J) {
        if (!J) return J;
        var X = "";
        while (J.length > 0) {
          if (J === "." || J === "..") {
            J = "";
            break
          }
          var I = J.substring(0, 2),
            D = J.substring(0, 3),
            W = J.substring(0, 4);
          if (D === "../") J = J.substring(3);
          else if (I === "./") J = J.substring(2);
          else if (D === "/./") J = "/" + J.substring(3);
          else if (I === "/." && J.length === 2) J = "/";
          else if (W === "/../" || D === "/.." && J.length === 3) J = "/" + J.substring(4), X = X.replace(/\/?[^\/]*$/, "");
          else {
            var K = J.match(/(\/?([^\/]*))/)[0];
            X += K, J = J.substring(K.length)
          }
        }
        return X
      }
    }
  }
})
// @from(Ln 340957, Col 4)
rb2 = U((f0Y, ob2) => {
  ob2.exports = rC0;
  var ab2 = SHA();

  function rC0(A, Q) {
    ab2.call(this, A, Q)
  }
  rC0.prototype = Object.create(ab2.prototype, {
    constructor: {
      value: rC0
    }
  })
})
// @from(Ln 340970, Col 4)
sC0 = U((h0Y, sb2) => {
  sb2.exports = {
    Event: SHA(),
    UIEvent: BC0(),
    MouseEvent: ZC0(),
    CustomEvent: rb2()
  }
})
// @from(Ln 340978, Col 4)
Qf2 = U((eb2) => {
  Object.defineProperty(eb2, "__esModule", {
    value: !0
  });
  eb2.hyphenate = eb2.parse = void 0;

  function ad5(A) {
    let Q = [],
      B = 0,
      G = 0,
      Z = 0,
      Y = 0,
      J = 0,
      X = null;
    while (B < A.length) switch (A.charCodeAt(B++)) {
      case 40:
        G++;
        break;
      case 41:
        G--;
        break;
      case 39:
        if (Z === 0) Z = 39;
        else if (Z === 39 && A.charCodeAt(B - 1) !== 92) Z = 0;
        break;
      case 34:
        if (Z === 0) Z = 34;
        else if (Z === 34 && A.charCodeAt(B - 1) !== 92) Z = 0;
        break;
      case 58:
        if (!X && G === 0 && Z === 0) X = tb2(A.substring(J, B - 1).trim()), Y = B;
        break;
      case 59:
        if (X && Y > 0 && G === 0 && Z === 0) {
          let D = A.substring(Y, B - 1).trim();
          Q.push(X, D), J = B, Y = 0, X = null
        }
        break
    }
    if (X && Y) {
      let I = A.slice(Y).trim();
      Q.push(X, I)
    }
    return Q
  }
  eb2.parse = ad5;

  function tb2(A) {
    return A.replace(/[a-z][A-Z]/g, (Q) => {
      return Q.charAt(0) + "-" + Q.charAt(1)
    }).toLowerCase()
  }
  eb2.hyphenate = tb2
})
// @from(Ln 341032, Col 4)
hW1 = U((u0Y, Jf2) => {
  var {
    parse: rd5
  } = Qf2();
  Jf2.exports = function (A) {
    let Q = new Yf2(A);
    return new Proxy(Q, {
      get: function (G, Z) {
        return Z in G ? G[Z] : G.getPropertyValue(Bf2(Z))
      },
      has: function (G, Z) {
        return !0
      },
      set: function (G, Z, Y) {
        if (Z in G) G[Z] = Y;
        else G.setProperty(Bf2(Z), Y ?? void 0);
        return !0
      }
    })
  };

  function Bf2(A) {
    return A.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  }

  function Yf2(A) {
    this._element = A
  }
  var Gf2 = "!important";

  function Zf2(A) {
    let Q = {
      property: {},
      priority: {}
    };
    if (!A) return Q;
    let B = rd5(A);
    if (B.length < 2) return Q;
    for (let G = 0; G < B.length; G += 2) {
      let Z = B[G],
        Y = B[G + 1];
      if (Y.endsWith(Gf2)) Q.priority[Z] = "important", Y = Y.slice(0, -Gf2.length).trim();
      Q.property[Z] = Y
    }
    return Q
  }
  var gHA = {};
  Yf2.prototype = Object.create(Object.prototype, {
    _parsed: {
      get: function () {
        if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
          var A = this.cssText;
          this._parsedStyles = Zf2(A), this._lastParsedText = A, delete this._names
        }
        return this._parsedStyles
      }
    },
    _serialize: {
      value: function () {
        var A = this._parsed,
          Q = "";
        for (var B in A.property) {
          if (Q) Q += " ";
          if (Q += B + ": " + A.property[B], A.priority[B]) Q += " !" + A.priority[B];
          Q += ";"
        }
        this.cssText = Q, this._lastParsedText = Q, delete this._names
      }
    },
    cssText: {
      get: function () {
        return this._element.getAttribute("style")
      },
      set: function (A) {
        this._element.setAttribute("style", A)
      }
    },
    length: {
      get: function () {
        if (!this._names) this._names = Object.getOwnPropertyNames(this._parsed.property);
        return this._names.length
      }
    },
    item: {
      value: function (A) {
        if (!this._names) this._names = Object.getOwnPropertyNames(this._parsed.property);
        return this._names[A]
      }
    },
    getPropertyValue: {
      value: function (A) {
        return A = A.toLowerCase(), this._parsed.property[A] || ""
      }
    },
    getPropertyPriority: {
      value: function (A) {
        return A = A.toLowerCase(), this._parsed.priority[A] || ""
      }
    },
    setProperty: {
      value: function (A, Q, B) {
        if (A = A.toLowerCase(), Q === null || Q === void 0) Q = "";
        if (B === null || B === void 0) B = "";
        if (Q !== gHA) Q = "" + Q;
        if (Q = Q.trim(), Q === "") {
          this.removeProperty(A);
          return
        }
        if (B !== "" && B !== gHA && !/^important$/i.test(B)) return;
        var G = this._parsed;
        if (Q === gHA) {
          if (!G.property[A]) return;
          if (B !== "") G.priority[A] = "important";
          else delete G.priority[A]
        } else {
          if (Q.indexOf(";") !== -1) return;
          var Z = Zf2(A + ":" + Q);
          if (Object.getOwnPropertyNames(Z.property).length === 0) return;
          if (Object.getOwnPropertyNames(Z.priority).length !== 0) return;
          for (var Y in Z.property)
            if (G.property[Y] = Z.property[Y], B === gHA) continue;
            else if (B !== "") G.priority[Y] = "important";
          else if (G.priority[Y]) delete G.priority[Y]
        }
        this._serialize()
      }
    },
    setPropertyValue: {
      value: function (A, Q) {
        return this.setProperty(A, Q, gHA)
      }
    },
    setPropertyPriority: {
      value: function (A, Q) {
        return this.setProperty(A, gHA, Q)
      }
    },
    removeProperty: {
      value: function (A) {
        A = A.toLowerCase();
        var Q = this._parsed;
        if (A in Q.property) delete Q.property[A], delete Q.priority[A], this._serialize()
      }
    }
  })
})
// @from(Ln 341178, Col 4)
tC0 = U((m0Y, Xf2) => {
  var fF = fW1();
  Xf2.exports = TbA;

  function TbA() {}
  TbA.prototype = Object.create(Object.prototype, {
    _url: {
      get: function () {
        return new fF(this.href)
      }
    },
    protocol: {
      get: function () {
        var A = this._url;
        if (A && A.scheme) return A.scheme + ":";
        else return ":"
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute()) {
          if (A = A.replace(/:+$/, ""), A = A.replace(/[^-+\.a-zA-Z0-9]/g, fF.percentEncode), A.length > 0) B.scheme = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    host: {
      get: function () {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased()) return A.host + (A.port ? ":" + A.port : "");
        else return ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, fF.percentEncode), A.length > 0) B.host = A, delete B.port, Q = B.toString()
        }
        this.href = Q
      }
    },
    hostname: {
      get: function () {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased()) return A.host;
        else return ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = A.replace(/^\/+/, ""), A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, fF.percentEncode), A.length > 0) B.host = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    port: {
      get: function () {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased() && A.port !== void 0) return A.port;
        else return ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = "" + A, A = A.replace(/[^0-9].*$/, ""), A = A.replace(/^0+/, ""), A.length === 0) A = "0";
          if (parseInt(A, 10) <= 65535) B.port = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    pathname: {
      get: function () {
        var A = this._url;
        if (A.isAbsolute() && A.isHierarchical()) return A.path;
        else return ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute() && B.isHierarchical()) {
          if (A.charAt(0) !== "/") A = "/" + A;
          A = A.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, fF.percentEncode), B.path = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    search: {
      get: function () {
        var A = this._url;
        if (A.isAbsolute() && A.isHierarchical() && A.query !== void 0) return "?" + A.query;
        else return ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute() && B.isHierarchical()) {
          if (A.charAt(0) === "?") A = A.substring(1);
          A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, fF.percentEncode), B.query = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    hash: {
      get: function () {
        var A = this._url;
        if (A == null || A.fragment == null || A.fragment === "") return "";
        else return "#" + A.fragment
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (A.charAt(0) === "#") A = A.substring(1);
        A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, fF.percentEncode), B.fragment = A, Q = B.toString(), this.href = Q
      }
    },
    username: {
      get: function () {
        var A = this._url;
        return A.username || ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute()) A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, fF.percentEncode), B.username = A, Q = B.toString();
        this.href = Q
      }
    },
    password: {
      get: function () {
        var A = this._url;
        return A.password || ""
      },
      set: function (A) {
        var Q = this.href,
          B = new fF(Q);
        if (B.isAbsolute()) {
          if (A === "") B.password = null;
          else A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, fF.percentEncode), B.password = A;
          Q = B.toString()
        }
        this.href = Q
      }
    },
    origin: {
      get: function () {
        var A = this._url;
        if (A == null) return "";
        var Q = function (B) {
          var G = [A.scheme, A.host, +A.port || B];
          return G[0] + "://" + G[1] + (G[2] === B ? "" : ":" + G[2])
        };
        switch (A.scheme) {
          case "ftp":
            return Q(21);
          case "gopher":
            return Q(70);
          case "http":
          case "ws":
            return Q(80);
          case "https":
          case "wss":
            return Q(443);
          default:
            return A.scheme + "://"
        }
      }
    }
  });
  TbA._inherit = function (A) {
    Object.getOwnPropertyNames(TbA.prototype).forEach(function (Q) {
      if (Q === "constructor" || Q === "href") return;
      var B = Object.getOwnPropertyDescriptor(TbA.prototype, Q);
      Object.defineProperty(A, Q, B)
    })
  }
})
// @from(Ln 341356, Col 4)
eC0 = U((d0Y, Wf2) => {
  var If2 = UC0(),
    sd5 = LW1().isApiWritable;
  Wf2.exports = function (A, Q, B, G) {
    var Z = A.ctor;
    if (Z) {
      var Y = A.props || {};
      if (A.attributes)
        for (var J in A.attributes) {
          var X = A.attributes[J];
          if (typeof X !== "object" || Array.isArray(X)) X = {
            type: X
          };
          if (!X.name) X.name = J.toLowerCase();
          Y[J] = If2.property(X)
        }
      if (Y.constructor = {
          value: Z,
          writable: sd5
        }, Z.prototype = Object.create((A.superclass || Q).prototype, Y), A.events) ed5(Z, A.events);
      B[A.name] = Z
    } else Z = Q;
    return (A.tags || A.tag && [A.tag] || []).forEach(function (I) {
      G[I] = Z
    }), Z
  };

  function Df2(A, Q, B, G) {
    this.body = A, this.document = Q, this.form = B, this.element = G
  }
  Df2.prototype.build = function () {
    return () => {}
  };

  function td5(A, Q, B, G) {
    var Z = A.ownerDocument || Object.create(null),
      Y = A.form || Object.create(null);
    A[Q] = new Df2(G, Z, Y, A).build()
  }

  function ed5(A, Q) {
    var B = A.prototype;
    Q.forEach(function (G) {
      Object.defineProperty(B, "on" + G, {
        get: function () {
          return this._getEventHandler(G)
        },
        set: function (Z) {
          this._setEventHandler(G, Z)
        }
      }), If2.registerChangeHandler(A, "on" + G, td5)
    })
  }
})