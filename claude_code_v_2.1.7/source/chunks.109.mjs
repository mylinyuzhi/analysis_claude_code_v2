
// @from(Ln 315484, Col 4)
RO = U((PM2, SM2) => {
  (function () {
    var A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H, E, z, $, O = {}.hasOwnProperty,
      L = [].splice;
    ({
      isObject: $,
      isFunction: z,
      isEmpty: E,
      getValue: H
    } = Hf()), X = null, B = null, G = null, Z = null, Y = null, V = null, F = null, K = null, J = null, Q = null, W = null, I = null, A = null, SM2.exports = D = function () {
      class M {
        constructor(_) {
          if (this.parent = _, this.parent) this.options = this.parent.options, this.stringify = this.parent.stringify;
          if (this.value = null, this.children = [], this.baseURI = null, !X) X = cI1(), B = pI1(), G = lI1(), Z = iI1(), Y = sI1(), V = tI1(), F = eI1(), K = AD1(), J = jE0(), Q = tD(), W = RM2(), I = dI1(), A = TM2()
        }
        setParent(_) {
          var j, x, b, S, u;
          if (this.parent = _, _) this.options = _.options, this.stringify = _.stringify;
          S = this.children, u = [];
          for (x = 0, b = S.length; x < b; x++) j = S[x], u.push(j.setParent(this));
          return u
        }
        element(_, j, x) {
          var b, S, u, f, AA, n, y, p, GA;
          if (n = null, j === null && x == null)[j, x] = [{}, null];
          if (j == null) j = {};
          if (j = H(j), !$(j))[x, j] = [j, x];
          if (_ != null) _ = H(_);
          if (Array.isArray(_))
            for (u = 0, y = _.length; u < y; u++) S = _[u], n = this.element(S);
          else if (z(_)) n = this.element(_.apply());
          else if ($(_))
            for (AA in _) {
              if (!O.call(_, AA)) continue;
              if (GA = _[AA], z(GA)) GA = GA.apply();
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && AA.indexOf(this.stringify.convertAttKey) === 0) n = this.attribute(AA.substr(this.stringify.convertAttKey.length), GA);
              else if (!this.options.separateArrayItems && Array.isArray(GA) && E(GA)) n = this.dummy();
              else if ($(GA) && E(GA)) n = this.element(AA);
              else if (!this.options.keepNullNodes && GA == null) n = this.dummy();
              else if (!this.options.separateArrayItems && Array.isArray(GA))
                for (f = 0, p = GA.length; f < p; f++) S = GA[f], b = {}, b[AA] = S, n = this.element(b);
              else if ($(GA))
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && AA.indexOf(this.stringify.convertTextKey) === 0) n = this.element(GA);
                else n = this.element(AA), n.element(GA);
              else n = this.element(AA, GA)
            } else if (!this.options.keepNullNodes && x === null) n = this.dummy();
            else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && _.indexOf(this.stringify.convertTextKey) === 0) n = this.text(x);
          else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && _.indexOf(this.stringify.convertCDataKey) === 0) n = this.cdata(x);
          else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && _.indexOf(this.stringify.convertCommentKey) === 0) n = this.comment(x);
          else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && _.indexOf(this.stringify.convertRawKey) === 0) n = this.raw(x);
          else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && _.indexOf(this.stringify.convertPIKey) === 0) n = this.instruction(_.substr(this.stringify.convertPIKey.length), x);
          else n = this.node(_, j, x);
          if (n == null) throw Error("Could not create any elements with: " + _ + ". " + this.debugInfo());
          return n
        }
        insertBefore(_, j, x) {
          var b, S, u, f, AA;
          if (_ != null ? _.type : void 0) {
            if (u = _, f = j, u.setParent(this), f) S = children.indexOf(f), AA = children.splice(S), children.push(u), Array.prototype.push.apply(children, AA);
            else children.push(u);
            return u
          } else {
            if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(_));
            return S = this.parent.children.indexOf(this), AA = this.parent.children.splice(S), b = this.parent.element(_, j, x), Array.prototype.push.apply(this.parent.children, AA), b
          }
        }
        insertAfter(_, j, x) {
          var b, S, u;
          if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(_));
          return S = this.parent.children.indexOf(this), u = this.parent.children.splice(S + 1), b = this.parent.element(_, j, x), Array.prototype.push.apply(this.parent.children, u), b
        }
        remove() {
          var _, j;
          if (this.isRoot) throw Error("Cannot remove the root element. " + this.debugInfo());
          return _ = this.parent.children.indexOf(this), L.apply(this.parent.children, [_, _ - _ + 1].concat(j = [])), this.parent
        }
        node(_, j, x) {
          var b;
          if (_ != null) _ = H(_);
          if (j || (j = {}), j = H(j), !$(j))[x, j] = [j, x];
          if (b = new X(this, _, j), x != null) b.text(x);
          return this.children.push(b), b
        }
        text(_) {
          var j;
          if ($(_)) this.element(_);
          return j = new F(this, _), this.children.push(j), this
        }
        cdata(_) {
          var j = new B(this, _);
          return this.children.push(j), this
        }
        comment(_) {
          var j = new G(this, _);
          return this.children.push(j), this
        }
        commentBefore(_) {
          var j, x, b;
          return x = this.parent.children.indexOf(this), b = this.parent.children.splice(x), j = this.parent.comment(_), Array.prototype.push.apply(this.parent.children, b), this
        }
        commentAfter(_) {
          var j, x, b;
          return x = this.parent.children.indexOf(this), b = this.parent.children.splice(x + 1), j = this.parent.comment(_), Array.prototype.push.apply(this.parent.children, b), this
        }
        raw(_) {
          var j = new V(this, _);
          return this.children.push(j), this
        }
        dummy() {
          var _ = new J(this);
          return _
        }
        instruction(_, j) {
          var x, b, S, u, f;
          if (_ != null) _ = H(_);
          if (j != null) j = H(j);
          if (Array.isArray(_))
            for (u = 0, f = _.length; u < f; u++) x = _[u], this.instruction(x);
          else if ($(_))
            for (x in _) {
              if (!O.call(_, x)) continue;
              b = _[x], this.instruction(x, b)
            } else {
              if (z(j)) j = j.apply();
              S = new K(this, _, j), this.children.push(S)
            }
          return this
        }
        instructionBefore(_, j) {
          var x, b, S;
          return b = this.parent.children.indexOf(this), S = this.parent.children.splice(b), x = this.parent.instruction(_, j), Array.prototype.push.apply(this.parent.children, S), this
        }
        instructionAfter(_, j) {
          var x, b, S;
          return b = this.parent.children.indexOf(this), S = this.parent.children.splice(b + 1), x = this.parent.instruction(_, j), Array.prototype.push.apply(this.parent.children, S), this
        }
        declaration(_, j, x) {
          var b, S;
          if (b = this.document(), S = new Z(b, _, j, x), b.children.length === 0) b.children.unshift(S);
          else if (b.children[0].type === Q.Declaration) b.children[0] = S;
          else b.children.unshift(S);
          return b.root() || b
        }
        dtd(_, j) {
          var x, b, S, u, f, AA, n, y, p, GA;
          b = this.document(), S = new Y(b, _, j), p = b.children;
          for (u = f = 0, n = p.length; f < n; u = ++f)
            if (x = p[u], x.type === Q.DocType) return b.children[u] = S, S;
          GA = b.children;
          for (u = AA = 0, y = GA.length; AA < y; u = ++AA)
            if (x = GA[u], x.isRoot) return b.children.splice(u, 0, S), S;
          return b.children.push(S), S
        }
        up() {
          if (this.isRoot) throw Error("The root node has no parent. Use doc() if you need to get the document object.");
          return this.parent
        }
        root() {
          var _ = this;
          while (_)
            if (_.type === Q.Document) return _.rootObject;
            else if (_.isRoot) return _;
          else _ = _.parent
        }
        document() {
          var _ = this;
          while (_)
            if (_.type === Q.Document) return _;
            else _ = _.parent
        }
        end(_) {
          return this.document().end(_)
        }
        prev() {
          var _ = this.parent.children.indexOf(this);
          if (_ < 1) throw Error("Already at the first node. " + this.debugInfo());
          return this.parent.children[_ - 1]
        }
        next() {
          var _ = this.parent.children.indexOf(this);
          if (_ === -1 || _ === this.parent.children.length - 1) throw Error("Already at the last node. " + this.debugInfo());
          return this.parent.children[_ + 1]
        }
        importDocument(_) {
          var j, x, b, S, u;
          if (x = _.root().clone(), x.parent = this, x.isRoot = !1, this.children.push(x), this.type === Q.Document) {
            if (x.isRoot = !0, x.documentObject = this, this.rootObject = x, this.children) {
              u = this.children;
              for (b = 0, S = u.length; b < S; b++)
                if (j = u[b], j.type === Q.DocType) {
                  j.name = x.name;
                  break
                }
            }
          }
          return this
        }
        debugInfo(_) {
          var j, x;
          if (_ = _ || this.name, _ == null && !((j = this.parent) != null ? j.name : void 0)) return "";
          else if (_ == null) return "parent: <" + this.parent.name + ">";
          else if (!((x = this.parent) != null ? x.name : void 0)) return "node: <" + _ + ">";
          else return "node: <" + _ + ">, parent: <" + this.parent.name + ">"
        }
        ele(_, j, x) {
          return this.element(_, j, x)
        }
        nod(_, j, x) {
          return this.node(_, j, x)
        }
        txt(_) {
          return this.text(_)
        }
        dat(_) {
          return this.cdata(_)
        }
        com(_) {
          return this.comment(_)
        }
        ins(_, j) {
          return this.instruction(_, j)
        }
        doc() {
          return this.document()
        }
        dec(_, j, x) {
          return this.declaration(_, j, x)
        }
        e(_, j, x) {
          return this.element(_, j, x)
        }
        n(_, j, x) {
          return this.node(_, j, x)
        }
        t(_) {
          return this.text(_)
        }
        d(_) {
          return this.cdata(_)
        }
        c(_) {
          return this.comment(_)
        }
        r(_) {
          return this.raw(_)
        }
        i(_, j) {
          return this.instruction(_, j)
        }
        u() {
          return this.up()
        }
        importXMLBuilder(_) {
          return this.importDocument(_)
        }
        attribute(_, j) {
          throw Error("attribute() applies to element nodes only.")
        }
        att(_, j) {
          return this.attribute(_, j)
        }
        a(_, j) {
          return this.attribute(_, j)
        }
        removeAttribute(_) {
          throw Error("attribute() applies to element nodes only.")
        }
        replaceChild(_, j) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        removeChild(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        appendChild(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        hasChildNodes() {
          return this.children.length !== 0
        }
        cloneNode(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        normalize() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isSupported(_, j) {
          return !0
        }
        hasAttributes() {
          return this.attribs.length !== 0
        }
        compareDocumentPosition(_) {
          var j, x;
          if (j = this, j === _) return 0;
          else if (this.document() !== _.document()) {
            if (x = A.Disconnected | A.ImplementationSpecific, Math.random() < 0.5) x |= A.Preceding;
            else x |= A.Following;
            return x
          } else if (j.isAncestor(_)) return A.Contains | A.Preceding;
          else if (j.isDescendant(_)) return A.Contains | A.Following;
          else if (j.isPreceding(_)) return A.Preceding;
          else return A.Following
        }
        isSameNode(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        lookupPrefix(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isDefaultNamespace(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        lookupNamespaceURI(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isEqualNode(_) {
          var j, x, b;
          if (_.nodeType !== this.nodeType) return !1;
          if (_.children.length !== this.children.length) return !1;
          for (j = x = 0, b = this.children.length - 1; 0 <= b ? x <= b : x >= b; j = 0 <= b ? ++x : --x)
            if (!this.children[j].isEqualNode(_.children[j])) return !1;
          return !0
        }
        getFeature(_, j) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        setUserData(_, j, x) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getUserData(_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        contains(_) {
          if (!_) return !1;
          return _ === this || this.isDescendant(_)
        }
        isDescendant(_) {
          var j, x, b, S, u;
          u = this.children;
          for (b = 0, S = u.length; b < S; b++) {
            if (j = u[b], _ === j) return !0;
            if (x = j.isDescendant(_), x) return !0
          }
          return !1
        }
        isAncestor(_) {
          return _.isDescendant(this)
        }
        isPreceding(_) {
          var j, x;
          if (j = this.treePosition(_), x = this.treePosition(this), j === -1 || x === -1) return !1;
          else return j < x
        }
        isFollowing(_) {
          var j, x;
          if (j = this.treePosition(_), x = this.treePosition(this), j === -1 || x === -1) return !1;
          else return j > x
        }
        treePosition(_) {
          var j, x;
          if (x = 0, j = !1, this.foreachTreeNode(this.document(), function (b) {
              if (x++, !j && b === _) return j = !0
            }), j) return x;
          else return -1
        }
        foreachTreeNode(_, j) {
          var x, b, S, u, f;
          _ || (_ = this.document()), u = _.children;
          for (b = 0, S = u.length; b < S; b++)
            if (x = u[b], f = j(x)) return f;
            else if (f = this.foreachTreeNode(x, j), f) return f
        }
      }
      return Object.defineProperty(M.prototype, "nodeName", {
        get: function () {
          return this.name
        }
      }), Object.defineProperty(M.prototype, "nodeType", {
        get: function () {
          return this.type
        }
      }), Object.defineProperty(M.prototype, "nodeValue", {
        get: function () {
          return this.value
        }
      }), Object.defineProperty(M.prototype, "parentNode", {
        get: function () {
          return this.parent
        }
      }), Object.defineProperty(M.prototype, "childNodes", {
        get: function () {
          if (!this.childNodeList || !this.childNodeList.nodes) this.childNodeList = new W(this.children);
          return this.childNodeList
        }
      }), Object.defineProperty(M.prototype, "firstChild", {
        get: function () {
          return this.children[0] || null
        }
      }), Object.defineProperty(M.prototype, "lastChild", {
        get: function () {
          return this.children[this.children.length - 1] || null
        }
      }), Object.defineProperty(M.prototype, "previousSibling", {
        get: function () {
          var _ = this.parent.children.indexOf(this);
          return this.parent.children[_ - 1] || null
        }
      }), Object.defineProperty(M.prototype, "nextSibling", {
        get: function () {
          var _ = this.parent.children.indexOf(this);
          return this.parent.children[_ + 1] || null
        }
      }), Object.defineProperty(M.prototype, "ownerDocument", {
        get: function () {
          return this.document() || null
        }
      }), Object.defineProperty(M.prototype, "textContent", {
        get: function () {
          var _, j, x, b, S;
          if (this.nodeType === Q.Element || this.nodeType === Q.DocumentFragment) {
            S = "", b = this.children;
            for (j = 0, x = b.length; j < x; j++)
              if (_ = b[j], _.textContent) S += _.textContent;
            return S
          } else return null
        },
        set: function (_) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
      }), M
    }.call(this)
  }).call(PM2)
})
// @from(Ln 315917, Col 4)
TE0 = U((xM2, yM2) => {
  (function () {
    var A, Q = {}.hasOwnProperty;
    yM2.exports = A = function () {
      class B {
        constructor(G) {
          var Z, Y, J;
          if (this.assertLegalChar = this.assertLegalChar.bind(this), this.assertLegalName = this.assertLegalName.bind(this), G || (G = {}), this.options = G, !this.options.version) this.options.version = "1.0";
          Y = G.stringify || {};
          for (Z in Y) {
            if (!Q.call(Y, Z)) continue;
            J = Y[Z], this[Z] = J
          }
        }
        name(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalName("" + G || "")
        }
        text(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar(this.textEscape("" + G || ""))
        }
        cdata(G) {
          if (this.options.noValidation) return G;
          return G = "" + G || "", G = G.replace("]]>", "]]]]><![CDATA[>"), this.assertLegalChar(G)
        }
        comment(G) {
          if (this.options.noValidation) return G;
          if (G = "" + G || "", G.match(/--/)) throw Error("Comment text cannot contain double-hypen: " + G);
          return this.assertLegalChar(G)
        }
        raw(G) {
          if (this.options.noValidation) return G;
          return "" + G || ""
        }
        attValue(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar(this.attEscape(G = "" + G || ""))
        }
        insTarget(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        insValue(G) {
          if (this.options.noValidation) return G;
          if (G = "" + G || "", G.match(/\?>/)) throw Error("Invalid processing instruction value: " + G);
          return this.assertLegalChar(G)
        }
        xmlVersion(G) {
          if (this.options.noValidation) return G;
          if (G = "" + G || "", !G.match(/1\.[0-9]+/)) throw Error("Invalid version number: " + G);
          return G
        }
        xmlEncoding(G) {
          if (this.options.noValidation) return G;
          if (G = "" + G || "", !G.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw Error("Invalid encoding: " + G);
          return this.assertLegalChar(G)
        }
        xmlStandalone(G) {
          if (this.options.noValidation) return G;
          if (G) return "yes";
          else return "no"
        }
        dtdPubID(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdSysID(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdElementValue(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdAttType(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdAttDefault(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdEntityValue(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        dtdNData(G) {
          if (this.options.noValidation) return G;
          return this.assertLegalChar("" + G || "")
        }
        assertLegalChar(G) {
          var Z, Y;
          if (this.options.noValidation) return G;
          if (this.options.version === "1.0") {
            if (Z = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) G = G.replace(Z, this.options.invalidCharReplacement);
            else if (Y = G.match(Z)) throw Error(`Invalid character in string: ${G} at index ${Y.index}`)
          } else if (this.options.version === "1.1") {
            if (Z = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) G = G.replace(Z, this.options.invalidCharReplacement);
            else if (Y = G.match(Z)) throw Error(`Invalid character in string: ${G} at index ${Y.index}`)
          }
          return G
        }
        assertLegalName(G) {
          var Z;
          if (this.options.noValidation) return G;
          if (G = this.assertLegalChar(G), Z = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/, !G.match(Z)) throw Error(`Invalid character in name: ${G}`);
          return G
        }
        textEscape(G) {
          var Z;
          if (this.options.noValidation) return G;
          return Z = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g, G.replace(Z, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;")
        }
        attEscape(G) {
          var Z;
          if (this.options.noValidation) return G;
          return Z = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g, G.replace(Z, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;")
        }
      }
      return B.prototype.convertAttKey = "@", B.prototype.convertPIKey = "?", B.prototype.convertTextKey = "#text", B.prototype.convertCDataKey = "#cdata", B.prototype.convertCommentKey = "#comment", B.prototype.convertRawKey = "#raw", B
    }.call(this)
  }).call(xM2)
})
// @from(Ln 316041, Col 4)
OkA = U((vM2, kM2) => {
  (function () {
    kM2.exports = {
      None: 0,
      OpenTag: 1,
      InsideTag: 2,
      CloseTag: 3
    }
  }).call(vM2)
})
// @from(Ln 316051, Col 4)
PE0 = U((bM2, fM2) => {
  (function () {
    var A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H, E, z, $ = {}.hasOwnProperty;
    ({
      assign: z
    } = Hf()), A = tD(), I = iI1(), D = sI1(), B = pI1(), G = lI1(), K = cI1(), F = tI1(), H = eI1(), V = AD1(), W = jE0(), Z = nI1(), Y = oI1(), J = aI1(), X = rI1(), Q = OkA(), fM2.exports = E = class {
      constructor(L) {
        var M, _, j;
        L || (L = {}), this.options = L, _ = L.writer || {};
        for (M in _) {
          if (!$.call(_, M)) continue;
          j = _[M], this["_" + M] = this[M], this[M] = j
        }
      }
      filterOptions(L) {
        var M, _, j, x, b, S, u, f, AA;
        if (L || (L = {}), L = z({}, this.options, L), M = {
            writer: this
          }, M.pretty = L.pretty || !1, M.allowEmpty = L.allowEmpty || !1, M.indent = (_ = L.indent) != null ? _ : "  ", M.newline = (j = L.newline) != null ? j : `
`, M.offset = (x = L.offset) != null ? x : 0, M.width = (b = L.width) != null ? b : 0, M.dontPrettyTextNodes = (S = (u = L.dontPrettyTextNodes) != null ? u : L.dontprettytextnodes) != null ? S : 0, M.spaceBeforeSlash = (f = (AA = L.spaceBeforeSlash) != null ? AA : L.spacebeforeslash) != null ? f : "", M.spaceBeforeSlash === !0) M.spaceBeforeSlash = " ";
        return M.suppressPrettyCount = 0, M.user = {}, M.state = Q.None, M
      }
      indent(L, M, _) {
        var j;
        if (!M.pretty || M.suppressPrettyCount) return "";
        else if (M.pretty) {
          if (j = (_ || 0) + M.offset + 1, j > 0) return Array(j).join(M.indent)
        }
        return ""
      }
      endline(L, M, _) {
        if (!M.pretty || M.suppressPrettyCount) return "";
        else return M.newline
      }
      attribute(L, M, _) {
        var j;
        if (this.openAttribute(L, M, _), M.pretty && M.width > 0) j = L.name + '="' + L.value + '"';
        else j = " " + L.name + '="' + L.value + '"';
        return this.closeAttribute(L, M, _), j
      }
      cdata(L, M, _) {
        var j;
        return this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<![CDATA[", M.state = Q.InsideTag, j += L.value, M.state = Q.CloseTag, j += "]]>" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      comment(L, M, _) {
        var j;
        return this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<!-- ", M.state = Q.InsideTag, j += L.value, M.state = Q.CloseTag, j += " -->" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      declaration(L, M, _) {
        var j;
        if (this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<?xml", M.state = Q.InsideTag, j += ' version="' + L.version + '"', L.encoding != null) j += ' encoding="' + L.encoding + '"';
        if (L.standalone != null) j += ' standalone="' + L.standalone + '"';
        return M.state = Q.CloseTag, j += M.spaceBeforeSlash + "?>", j += this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      docType(L, M, _) {
        var j, x, b, S, u;
        if (_ || (_ = 0), this.openNode(L, M, _), M.state = Q.OpenTag, S = this.indent(L, M, _), S += "<!DOCTYPE " + L.root().name, L.pubID && L.sysID) S += ' PUBLIC "' + L.pubID + '" "' + L.sysID + '"';
        else if (L.sysID) S += ' SYSTEM "' + L.sysID + '"';
        if (L.children.length > 0) {
          S += " [", S += this.endline(L, M, _), M.state = Q.InsideTag, u = L.children;
          for (x = 0, b = u.length; x < b; x++) j = u[x], S += this.writeChildNode(j, M, _ + 1);
          M.state = Q.CloseTag, S += "]"
        }
        return M.state = Q.CloseTag, S += M.spaceBeforeSlash + ">", S += this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), S
      }
      element(L, M, _) {
        var j, x, b, S, u, f, AA, n, y, p, GA, WA, MA, TA, bA, jA, OA, IA, HA;
        if (_ || (_ = 0), WA = !1, this.openNode(L, M, _), M.state = Q.OpenTag, MA = this.indent(L, M, _) + "<" + L.name, M.pretty && M.width > 0) {
          n = MA.length, bA = L.attribs;
          for (GA in bA) {
            if (!$.call(bA, GA)) continue;
            if (j = bA[GA], TA = this.attribute(j, M, _), x = TA.length, n + x > M.width) HA = this.indent(L, M, _ + 1) + TA, MA += this.endline(L, M, _) + HA, n = HA.length;
            else HA = " " + TA, MA += HA, n += HA.length
          }
        } else {
          jA = L.attribs;
          for (GA in jA) {
            if (!$.call(jA, GA)) continue;
            j = jA[GA], MA += this.attribute(j, M, _)
          }
        }
        if (S = L.children.length, u = S === 0 ? null : L.children[0], S === 0 || L.children.every(function (ZA) {
            return (ZA.type === A.Text || ZA.type === A.Raw || ZA.type === A.CData) && ZA.value === ""
          }))
          if (M.allowEmpty) MA += ">", M.state = Q.CloseTag, MA += "</" + L.name + ">" + this.endline(L, M, _);
          else M.state = Q.CloseTag, MA += M.spaceBeforeSlash + "/>" + this.endline(L, M, _);
        else if (M.pretty && S === 1 && (u.type === A.Text || u.type === A.Raw || u.type === A.CData) && u.value != null) MA += ">", M.state = Q.InsideTag, M.suppressPrettyCount++, WA = !0, MA += this.writeChildNode(u, M, _ + 1), M.suppressPrettyCount--, WA = !1, M.state = Q.CloseTag, MA += "</" + L.name + ">" + this.endline(L, M, _);
        else {
          if (M.dontPrettyTextNodes) {
            OA = L.children;
            for (f = 0, y = OA.length; f < y; f++)
              if (b = OA[f], (b.type === A.Text || b.type === A.Raw || b.type === A.CData) && b.value != null) {
                M.suppressPrettyCount++, WA = !0;
                break
              }
          }
          MA += ">" + this.endline(L, M, _), M.state = Q.InsideTag, IA = L.children;
          for (AA = 0, p = IA.length; AA < p; AA++) b = IA[AA], MA += this.writeChildNode(b, M, _ + 1);
          if (M.state = Q.CloseTag, MA += this.indent(L, M, _) + "</" + L.name + ">", WA) M.suppressPrettyCount--;
          MA += this.endline(L, M, _), M.state = Q.None
        }
        return this.closeNode(L, M, _), MA
      }
      writeChildNode(L, M, _) {
        switch (L.type) {
          case A.CData:
            return this.cdata(L, M, _);
          case A.Comment:
            return this.comment(L, M, _);
          case A.Element:
            return this.element(L, M, _);
          case A.Raw:
            return this.raw(L, M, _);
          case A.Text:
            return this.text(L, M, _);
          case A.ProcessingInstruction:
            return this.processingInstruction(L, M, _);
          case A.Dummy:
            return "";
          case A.Declaration:
            return this.declaration(L, M, _);
          case A.DocType:
            return this.docType(L, M, _);
          case A.AttributeDeclaration:
            return this.dtdAttList(L, M, _);
          case A.ElementDeclaration:
            return this.dtdElement(L, M, _);
          case A.EntityDeclaration:
            return this.dtdEntity(L, M, _);
          case A.NotationDeclaration:
            return this.dtdNotation(L, M, _);
          default:
            throw Error("Unknown XML node type: " + L.constructor.name)
        }
      }
      processingInstruction(L, M, _) {
        var j;
        if (this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<?", M.state = Q.InsideTag, j += L.target, L.value) j += " " + L.value;
        return M.state = Q.CloseTag, j += M.spaceBeforeSlash + "?>", j += this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      raw(L, M, _) {
        var j;
        return this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _), M.state = Q.InsideTag, j += L.value, M.state = Q.CloseTag, j += this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      text(L, M, _) {
        var j;
        return this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _), M.state = Q.InsideTag, j += L.value, M.state = Q.CloseTag, j += this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      dtdAttList(L, M, _) {
        var j;
        if (this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<!ATTLIST", M.state = Q.InsideTag, j += " " + L.elementName + " " + L.attributeName + " " + L.attributeType, L.defaultValueType !== "#DEFAULT") j += " " + L.defaultValueType;
        if (L.defaultValue) j += ' "' + L.defaultValue + '"';
        return M.state = Q.CloseTag, j += M.spaceBeforeSlash + ">" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      dtdElement(L, M, _) {
        var j;
        return this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<!ELEMENT", M.state = Q.InsideTag, j += " " + L.name + " " + L.value, M.state = Q.CloseTag, j += M.spaceBeforeSlash + ">" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      dtdEntity(L, M, _) {
        var j;
        if (this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<!ENTITY", M.state = Q.InsideTag, L.pe) j += " %";
        if (j += " " + L.name, L.value) j += ' "' + L.value + '"';
        else {
          if (L.pubID && L.sysID) j += ' PUBLIC "' + L.pubID + '" "' + L.sysID + '"';
          else if (L.sysID) j += ' SYSTEM "' + L.sysID + '"';
          if (L.nData) j += " NDATA " + L.nData
        }
        return M.state = Q.CloseTag, j += M.spaceBeforeSlash + ">" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      dtdNotation(L, M, _) {
        var j;
        if (this.openNode(L, M, _), M.state = Q.OpenTag, j = this.indent(L, M, _) + "<!NOTATION", M.state = Q.InsideTag, j += " " + L.name, L.pubID && L.sysID) j += ' PUBLIC "' + L.pubID + '" "' + L.sysID + '"';
        else if (L.pubID) j += ' PUBLIC "' + L.pubID + '"';
        else if (L.sysID) j += ' SYSTEM "' + L.sysID + '"';
        return M.state = Q.CloseTag, j += M.spaceBeforeSlash + ">" + this.endline(L, M, _), M.state = Q.None, this.closeNode(L, M, _), j
      }
      openNode(L, M, _) {}
      closeNode(L, M, _) {}
      openAttribute(L, M, _) {}
      closeAttribute(L, M, _) {}
    }
  }).call(bM2)
})
// @from(Ln 316234, Col 4)
QD1 = U((hM2, gM2) => {
  (function () {
    var A, Q;
    Q = PE0(), gM2.exports = A = class extends Q {
      constructor(G) {
        super(G)
      }
      document(G, Z) {
        var Y, J, X, I, D;
        Z = this.filterOptions(Z), I = "", D = G.children;
        for (J = 0, X = D.length; J < X; J++) Y = D[J], I += this.writeChildNode(Y, Z, 0);
        if (Z.pretty && I.slice(-Z.newline.length) === Z.newline) I = I.slice(0, -Z.newline.length);
        return I
      }
    }
  }).call(hM2)
})
// @from(Ln 316251, Col 4)
SE0 = U((uM2, mM2) => {
  (function () {
    var A, Q, B, G, Z, Y, J, X;
    ({
      isPlainObject: X
    } = Hf()), B = RE0(), Q = cO2(), Z = RO(), A = tD(), J = TE0(), Y = QD1(), mM2.exports = G = function () {
      class I extends Z {
        constructor(D) {
          super(null);
          if (this.name = "#document", this.type = A.Document, this.documentURI = null, this.domConfig = new Q, D || (D = {}), !D.writer) D.writer = new Y;
          this.options = D, this.stringify = new J(D)
        }
        end(D) {
          var W = {};
          if (!D) D = this.options.writer;
          else if (X(D)) W = D, D = this.options.writer;
          return D.document(this, D.filterOptions(W))
        }
        toString(D) {
          return this.options.writer.document(this, this.options.writer.filterOptions(D))
        }
        createElement(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createDocumentFragment() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createTextNode(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createComment(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createCDATASection(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createProcessingInstruction(D, W) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createAttribute(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createEntityReference(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByTagName(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        importNode(D, W) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createElementNS(D, W) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createAttributeNS(D, W) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByTagNameNS(D, W) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementById(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        adoptNode(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        normalizeDocument() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        renameNode(D, W, K) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByClassName(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createEvent(D) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createRange() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createNodeIterator(D, W, K) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createTreeWalker(D, W, K) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
      }
      return Object.defineProperty(I.prototype, "implementation", {
        value: new B
      }), Object.defineProperty(I.prototype, "doctype", {
        get: function () {
          var D, W, K, V;
          V = this.children;
          for (W = 0, K = V.length; W < K; W++)
            if (D = V[W], D.type === A.DocType) return D;
          return null
        }
      }), Object.defineProperty(I.prototype, "documentElement", {
        get: function () {
          return this.rootObject || null
        }
      }), Object.defineProperty(I.prototype, "inputEncoding", {
        get: function () {
          return null
        }
      }), Object.defineProperty(I.prototype, "strictErrorChecking", {
        get: function () {
          return !1
        }
      }), Object.defineProperty(I.prototype, "xmlEncoding", {
        get: function () {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].encoding;
          else return null
        }
      }), Object.defineProperty(I.prototype, "xmlStandalone", {
        get: function () {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].standalone === "yes";
          else return !1
        }
      }), Object.defineProperty(I.prototype, "xmlVersion", {
        get: function () {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].version;
          else return "1.0"
        }
      }), Object.defineProperty(I.prototype, "URL", {
        get: function () {
          return this.documentURI
        }
      }), Object.defineProperty(I.prototype, "origin", {
        get: function () {
          return null
        }
      }), Object.defineProperty(I.prototype, "compatMode", {
        get: function () {
          return null
        }
      }), Object.defineProperty(I.prototype, "characterSet", {
        get: function () {
          return null
        }
      }), Object.defineProperty(I.prototype, "contentType", {
        get: function () {
          return null
        }
      }), I
    }.call(this)
  }).call(uM2)
})
// @from(Ln 316400, Col 4)
pM2 = U((dM2, cM2) => {
  (function () {
    var A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H, E, z, $, O, L, M, _, j, x = {}.hasOwnProperty;
    ({
      isObject: _,
      isFunction: M,
      isPlainObject: j,
      getValue: L
    } = Hf()), A = tD(), K = SE0(), F = cI1(), G = pI1(), Z = lI1(), E = tI1(), O = eI1(), H = AD1(), D = iI1(), W = sI1(), Y = nI1(), X = aI1(), J = oI1(), I = rI1(), B = _E0(), $ = TE0(), z = QD1(), Q = OkA(), cM2.exports = V = class {
      constructor(S, u, f) {
        var AA;
        if (this.name = "?xml", this.type = A.Document, S || (S = {}), AA = {}, !S.writer) S.writer = new z;
        else if (j(S.writer)) AA = S.writer, S.writer = new z;
        this.options = S, this.writer = S.writer, this.writerOptions = this.writer.filterOptions(AA), this.stringify = new $(S), this.onDataCallback = u || function () {}, this.onEndCallback = f || function () {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
      }
      createChildNode(S) {
        var u, f, AA, n, y, p, GA, WA;
        switch (S.type) {
          case A.CData:
            this.cdata(S.value);
            break;
          case A.Comment:
            this.comment(S.value);
            break;
          case A.Element:
            AA = {}, GA = S.attribs;
            for (f in GA) {
              if (!x.call(GA, f)) continue;
              u = GA[f], AA[f] = u.value
            }
            this.node(S.name, AA);
            break;
          case A.Dummy:
            this.dummy();
            break;
          case A.Raw:
            this.raw(S.value);
            break;
          case A.Text:
            this.text(S.value);
            break;
          case A.ProcessingInstruction:
            this.instruction(S.target, S.value);
            break;
          default:
            throw Error("This XML node type is not supported in a JS object: " + S.constructor.name)
        }
        WA = S.children;
        for (y = 0, p = WA.length; y < p; y++)
          if (n = WA[y], this.createChildNode(n), n.type === A.Element) this.up();
        return this
      }
      dummy() {
        return this
      }
      node(S, u, f) {
        if (S == null) throw Error("Missing node name.");
        if (this.root && this.currentLevel === -1) throw Error("Document can only have one root node. " + this.debugInfo(S));
        if (this.openCurrent(), S = L(S), u == null) u = {};
        if (u = L(u), !_(u))[f, u] = [u, f];
        if (this.currentNode = new F(this, S, u), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, f != null) this.text(f);
        return this
      }
      element(S, u, f) {
        var AA, n, y, p, GA, WA;
        if (this.currentNode && this.currentNode.type === A.DocType) this.dtdElement(...arguments);
        else if (Array.isArray(S) || _(S) || M(S)) {
          p = this.options.noValidation, this.options.noValidation = !0, WA = new K(this.options).element("TEMP_ROOT"), WA.element(S), this.options.noValidation = p, GA = WA.children;
          for (n = 0, y = GA.length; n < y; n++)
            if (AA = GA[n], this.createChildNode(AA), AA.type === A.Element) this.up()
        } else this.node(S, u, f);
        return this
      }
      attribute(S, u) {
        var f, AA;
        if (!this.currentNode || this.currentNode.children) throw Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(S));
        if (S != null) S = L(S);
        if (_(S))
          for (f in S) {
            if (!x.call(S, f)) continue;
            AA = S[f], this.attribute(f, AA)
          } else {
            if (M(u)) u = u.apply();
            if (this.options.keepNullAttributes && u == null) this.currentNode.attribs[S] = new B(this, S, "");
            else if (u != null) this.currentNode.attribs[S] = new B(this, S, u)
          }
        return this
      }
      text(S) {
        var u;
        return this.openCurrent(), u = new O(this, S), this.onData(this.writer.text(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      cdata(S) {
        var u;
        return this.openCurrent(), u = new G(this, S), this.onData(this.writer.cdata(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      comment(S) {
        var u;
        return this.openCurrent(), u = new Z(this, S), this.onData(this.writer.comment(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      raw(S) {
        var u;
        return this.openCurrent(), u = new E(this, S), this.onData(this.writer.raw(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      instruction(S, u) {
        var f, AA, n, y, p;
        if (this.openCurrent(), S != null) S = L(S);
        if (u != null) u = L(u);
        if (Array.isArray(S))
          for (f = 0, y = S.length; f < y; f++) AA = S[f], this.instruction(AA);
        else if (_(S))
          for (AA in S) {
            if (!x.call(S, AA)) continue;
            n = S[AA], this.instruction(AA, n)
          } else {
            if (M(u)) u = u.apply();
            p = new H(this, S, u), this.onData(this.writer.processingInstruction(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1)
          }
        return this
      }
      declaration(S, u, f) {
        var AA;
        if (this.openCurrent(), this.documentStarted) throw Error("declaration() must be the first node.");
        return AA = new D(this, S, u, f), this.onData(this.writer.declaration(AA, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      doctype(S, u, f) {
        if (this.openCurrent(), S == null) throw Error("Missing root node name.");
        if (this.root) throw Error("dtd() must come before the root node.");
        return this.currentNode = new W(this, u, f), this.currentNode.rootNodeName = S, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
      }
      dtdElement(S, u) {
        var f;
        return this.openCurrent(), f = new J(this, S, u), this.onData(this.writer.dtdElement(f, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      attList(S, u, f, AA, n) {
        var y;
        return this.openCurrent(), y = new Y(this, S, u, f, AA, n), this.onData(this.writer.dtdAttList(y, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      entity(S, u) {
        var f;
        return this.openCurrent(), f = new X(this, !1, S, u), this.onData(this.writer.dtdEntity(f, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      pEntity(S, u) {
        var f;
        return this.openCurrent(), f = new X(this, !0, S, u), this.onData(this.writer.dtdEntity(f, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      notation(S, u) {
        var f;
        return this.openCurrent(), f = new I(this, S, u), this.onData(this.writer.dtdNotation(f, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      up() {
        if (this.currentLevel < 0) throw Error("The document node has no parent.");
        if (this.currentNode) {
          if (this.currentNode.children) this.closeNode(this.currentNode);
          else this.openNode(this.currentNode);
          this.currentNode = null
        } else this.closeNode(this.openTags[this.currentLevel]);
        return delete this.openTags[this.currentLevel], this.currentLevel--, this
      }
      end() {
        while (this.currentLevel >= 0) this.up();
        return this.onEnd()
      }
      openCurrent() {
        if (this.currentNode) return this.currentNode.children = !0, this.openNode(this.currentNode)
      }
      openNode(S) {
        var u, f, AA, n;
        if (!S.isOpen) {
          if (!this.root && this.currentLevel === 0 && S.type === A.Element) this.root = S;
          if (f = "", S.type === A.Element) {
            this.writerOptions.state = Q.OpenTag, f = this.writer.indent(S, this.writerOptions, this.currentLevel) + "<" + S.name, n = S.attribs;
            for (AA in n) {
              if (!x.call(n, AA)) continue;
              u = n[AA], f += this.writer.attribute(u, this.writerOptions, this.currentLevel)
            }
            f += (S.children ? ">" : "/>") + this.writer.endline(S, this.writerOptions, this.currentLevel), this.writerOptions.state = Q.InsideTag
          } else {
            if (this.writerOptions.state = Q.OpenTag, f = this.writer.indent(S, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + S.rootNodeName, S.pubID && S.sysID) f += ' PUBLIC "' + S.pubID + '" "' + S.sysID + '"';
            else if (S.sysID) f += ' SYSTEM "' + S.sysID + '"';
            if (S.children) f += " [", this.writerOptions.state = Q.InsideTag;
            else this.writerOptions.state = Q.CloseTag, f += ">";
            f += this.writer.endline(S, this.writerOptions, this.currentLevel)
          }
          return this.onData(f, this.currentLevel), S.isOpen = !0
        }
      }
      closeNode(S) {
        var u;
        if (!S.isClosed) {
          if (u = "", this.writerOptions.state = Q.CloseTag, S.type === A.Element) u = this.writer.indent(S, this.writerOptions, this.currentLevel) + "</" + S.name + ">" + this.writer.endline(S, this.writerOptions, this.currentLevel);
          else u = this.writer.indent(S, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(S, this.writerOptions, this.currentLevel);
          return this.writerOptions.state = Q.None, this.onData(u, this.currentLevel), S.isClosed = !0
        }
      }
      onData(S, u) {
        return this.documentStarted = !0, this.onDataCallback(S, u + 1)
      }
      onEnd() {
        return this.documentCompleted = !0, this.onEndCallback()
      }
      debugInfo(S) {
        if (S == null) return "";
        else return "node: <" + S + ">"
      }
      ele() {
        return this.element(...arguments)
      }
      nod(S, u, f) {
        return this.node(S, u, f)
      }
      txt(S) {
        return this.text(S)
      }
      dat(S) {
        return this.cdata(S)
      }
      com(S) {
        return this.comment(S)
      }
      ins(S, u) {
        return this.instruction(S, u)
      }
      dec(S, u, f) {
        return this.declaration(S, u, f)
      }
      dtd(S, u, f) {
        return this.doctype(S, u, f)
      }
      e(S, u, f) {
        return this.element(S, u, f)
      }
      n(S, u, f) {
        return this.node(S, u, f)
      }
      t(S) {
        return this.text(S)
      }
      d(S) {
        return this.cdata(S)
      }
      c(S) {
        return this.comment(S)
      }
      r(S) {
        return this.raw(S)
      }
      i(S, u) {
        return this.instruction(S, u)
      }
      att() {
        if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
        else return this.attribute(...arguments)
      }
      a() {
        if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
        else return this.attribute(...arguments)
      }
      ent(S, u) {
        return this.entity(S, u)
      }
      pent(S, u) {
        return this.pEntity(S, u)
      }
      not(S, u) {
        return this.notation(S, u)
      }
    }
  }).call(dM2)
})
// @from(Ln 316670, Col 4)
nM2 = U((lM2, iM2) => {
  (function () {
    var A, Q, B, G, Z = {}.hasOwnProperty;
    A = tD(), G = PE0(), Q = OkA(), iM2.exports = B = class extends G {
      constructor(J, X) {
        super(X);
        this.stream = J
      }
      endline(J, X, I) {
        if (J.isLastRootNode && X.state === Q.CloseTag) return "";
        else return super.endline(J, X, I)
      }
      document(J, X) {
        var I, D, W, K, V, F, H, E, z;
        H = J.children;
        for (D = W = 0, V = H.length; W < V; D = ++W) I = H[D], I.isLastRootNode = D === J.children.length - 1;
        X = this.filterOptions(X), E = J.children, z = [];
        for (K = 0, F = E.length; K < F; K++) I = E[K], z.push(this.writeChildNode(I, X, 0));
        return z
      }
      cdata(J, X, I) {
        return this.stream.write(super.cdata(J, X, I))
      }
      comment(J, X, I) {
        return this.stream.write(super.comment(J, X, I))
      }
      declaration(J, X, I) {
        return this.stream.write(super.declaration(J, X, I))
      }
      docType(J, X, I) {
        var D, W, K, V;
        if (I || (I = 0), this.openNode(J, X, I), X.state = Q.OpenTag, this.stream.write(this.indent(J, X, I)), this.stream.write("<!DOCTYPE " + J.root().name), J.pubID && J.sysID) this.stream.write(' PUBLIC "' + J.pubID + '" "' + J.sysID + '"');
        else if (J.sysID) this.stream.write(' SYSTEM "' + J.sysID + '"');
        if (J.children.length > 0) {
          this.stream.write(" ["), this.stream.write(this.endline(J, X, I)), X.state = Q.InsideTag, V = J.children;
          for (W = 0, K = V.length; W < K; W++) D = V[W], this.writeChildNode(D, X, I + 1);
          X.state = Q.CloseTag, this.stream.write("]")
        }
        return X.state = Q.CloseTag, this.stream.write(X.spaceBeforeSlash + ">"), this.stream.write(this.endline(J, X, I)), X.state = Q.None, this.closeNode(J, X, I)
      }
      element(J, X, I) {
        var D, W, K, V, F, H, E, z, $, O, L, M, _, j, x, b;
        if (I || (I = 0), this.openNode(J, X, I), X.state = Q.OpenTag, L = this.indent(J, X, I) + "<" + J.name, X.pretty && X.width > 0) {
          E = L.length, _ = J.attribs;
          for ($ in _) {
            if (!Z.call(_, $)) continue;
            if (D = _[$], M = this.attribute(D, X, I), W = M.length, E + W > X.width) b = this.indent(J, X, I + 1) + M, L += this.endline(J, X, I) + b, E = b.length;
            else b = " " + M, L += b, E += b.length
          }
        } else {
          j = J.attribs;
          for ($ in j) {
            if (!Z.call(j, $)) continue;
            D = j[$], L += this.attribute(D, X, I)
          }
        }
        if (this.stream.write(L), V = J.children.length, F = V === 0 ? null : J.children[0], V === 0 || J.children.every(function (S) {
            return (S.type === A.Text || S.type === A.Raw || S.type === A.CData) && S.value === ""
          }))
          if (X.allowEmpty) this.stream.write(">"), X.state = Q.CloseTag, this.stream.write("</" + J.name + ">");
          else X.state = Q.CloseTag, this.stream.write(X.spaceBeforeSlash + "/>");
        else if (X.pretty && V === 1 && (F.type === A.Text || F.type === A.Raw || F.type === A.CData) && F.value != null) this.stream.write(">"), X.state = Q.InsideTag, X.suppressPrettyCount++, O = !0, this.writeChildNode(F, X, I + 1), X.suppressPrettyCount--, O = !1, X.state = Q.CloseTag, this.stream.write("</" + J.name + ">");
        else {
          this.stream.write(">" + this.endline(J, X, I)), X.state = Q.InsideTag, x = J.children;
          for (H = 0, z = x.length; H < z; H++) K = x[H], this.writeChildNode(K, X, I + 1);
          X.state = Q.CloseTag, this.stream.write(this.indent(J, X, I) + "</" + J.name + ">")
        }
        return this.stream.write(this.endline(J, X, I)), X.state = Q.None, this.closeNode(J, X, I)
      }
      processingInstruction(J, X, I) {
        return this.stream.write(super.processingInstruction(J, X, I))
      }
      raw(J, X, I) {
        return this.stream.write(super.raw(J, X, I))
      }
      text(J, X, I) {
        return this.stream.write(super.text(J, X, I))
      }
      dtdAttList(J, X, I) {
        return this.stream.write(super.dtdAttList(J, X, I))
      }
      dtdElement(J, X, I) {
        return this.stream.write(super.dtdElement(J, X, I))
      }
      dtdEntity(J, X, I) {
        return this.stream.write(super.dtdEntity(J, X, I))
      }
      dtdNotation(J, X, I) {
        return this.stream.write(super.dtdNotation(J, X, I))
      }
    }
  }).call(lM2)
})
// @from(Ln 316763, Col 4)
oM2 = U((aM2, Rs) => {
  (function () {
    var A, Q, B, G, Z, Y, J, X, I;
    ({
      assign: X,
      isFunction: I
    } = Hf()), B = RE0(), G = SE0(), Z = pM2(), J = QD1(), Y = nM2(), A = tD(), Q = OkA(), aM2.create = function (D, W, K, V) {
      var F, H;
      if (D == null) throw Error("Root element needs a name.");
      if (V = X({}, W, K, V), F = new G(V), H = F.element(D), !V.headless) {
        if (F.declaration(V), V.pubID != null || V.sysID != null) F.dtd(V)
      }
      return H
    }, aM2.begin = function (D, W, K) {
      if (I(D))[W, K] = [D, W], D = {};
      if (W) return new Z(D, W, K);
      else return new G(D)
    }, aM2.stringWriter = function (D) {
      return new J(D)
    }, aM2.streamWriter = function (D, W) {
      return new Y(D, W)
    }, aM2.implementation = new B, aM2.nodeType = A, aM2.writerState = Q
  }).call(aM2)
})
// @from(Ln 316787, Col 4)
tM2 = U((Ry5) => {
  var rM2 = o40(),
    wy5 = oM2();
  Ry5.build = My5;

  function Ly5(A) {
    function Q(B) {
      return B < 10 ? "0" + B : B
    }
    return A.getUTCFullYear() + "-" + Q(A.getUTCMonth() + 1) + "-" + Q(A.getUTCDate()) + "T" + Q(A.getUTCHours()) + ":" + Q(A.getUTCMinutes()) + ":" + Q(A.getUTCSeconds()) + "Z"
  }
  var Oy5 = Object.prototype.toString;

  function sM2(A) {
    var Q = Oy5.call(A).match(/\[object (.*)\]/);
    return Q ? Q[1] : Q
  }

  function My5(A, Q) {
    var B = {
        version: "1.0",
        encoding: "UTF-8"
      },
      G = {
        pubid: "-//Apple//DTD PLIST 1.0//EN",
        sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
      },
      Z = wy5.create("plist");
    if (Z.dec(B.version, B.encoding, B.standalone), Z.dtd(G.pubid, G.sysid), Z.att("version", "1.0"), xE0(A, Z), !Q) Q = {};
    return Q.pretty = Q.pretty !== !1, Z.end(Q)
  }

  function xE0(A, Q) {
    var B, G, Z, Y = sM2(A);
    if (Y == "Undefined") return;
    else if (Array.isArray(A)) {
      Q = Q.ele("array");
      for (G = 0; G < A.length; G++) xE0(A[G], Q)
    } else if (Buffer.isBuffer(A)) Q.ele("data").raw(A.toString("base64"));
    else if (Y == "Object") {
      Q = Q.ele("dict");
      for (Z in A)
        if (A.hasOwnProperty(Z)) Q.ele("key").txt(Z), xE0(A[Z], Q)
    } else if (Y == "Number") B = A % 1 === 0 ? "integer" : "real", Q.ele(B).txt(A.toString());
    else if (Y == "BigInt") Q.ele("integer").txt(A);
    else if (Y == "Date") Q.ele("date").txt(Ly5(new Date(A)));
    else if (Y == "Boolean") Q.ele(A ? "true" : "false");
    else if (Y == "String") Q.ele("string").txt(A);
    else if (Y == "ArrayBuffer") Q.ele("data").raw(rM2.fromByteArray(A));
    else if (A && A.buffer && sM2(A.buffer) == "ArrayBuffer") Q.ele("data").raw(rM2.fromByteArray(new Uint8Array(A.buffer), Q));
    else if (Y === "Null") Q.ele("null").txt("")
  }
})
// @from(Ln 316840, Col 4)
QR2 = U((yE0) => {
  var eM2 = SO2();
  Object.keys(eM2).forEach(function (A) {
    yE0[A] = eM2[A]
  });
  var AR2 = tM2();
  Object.keys(AR2).forEach(function (A) {
    yE0[A] = AR2[A]
  })
})
// @from(Ln 316850, Col 0)
async function Dc(A, Q) {
  let G = L1().preferredNotifChannel;
  await vE0(A);
  let Z = await jy5(G, A, Q);
  l("tengu_notification_method_used", {
    configured_channel: G,
    method_used: Z,
    term: l0.terminal
  })
}
// @from(Ln 316860, Col 0)
async function jy5(A, Q, B) {
  let G = Q.title || GR2;
  try {
    switch (A) {
      case "auto":
        return Ty5(Q, B);
      case "iterm2":
        return B.notifyITerm2(Q), "iterm2";
      case "iterm2_with_bell":
        return B.notifyITerm2(Q), B.notifyBell(), "iterm2_with_bell";
      case "kitty":
        return B.notifyKitty({
          ...Q,
          title: G,
          id: ZR2()
        }), "kitty";
      case "terminal_bell":
        return B.notifyBell(), "terminal_bell";
      case "notifications_disabled":
        return "disabled";
      default:
        return "none"
    }
  } catch {
    return "error"
  }
}
// @from(Ln 316887, Col 0)
async function Ty5(A, Q) {
  let B = A.title || GR2;
  switch (l0.terminal) {
    case "Apple_Terminal": {
      if (await Py5()) return Q.notifyBell(), "terminal_bell";
      return "no_method_available"
    }
    case "iTerm.app":
      return Q.notifyITerm2(A), "iterm2";
    case "kitty":
      return Q.notifyKitty({
        ...A,
        title: B,
        id: ZR2()
      }), "kitty";
    case "ghostty":
      return Q.notifyGhostty({
        ...A,
        title: B
      }), "ghostty";
    default:
      return "no_method_available"
  }
}
// @from(Ln 316912, Col 0)
function ZR2() {
  return Math.floor(Math.random() * 1e4)
}
// @from(Ln 316915, Col 0)
async function Py5() {
  try {
    if (l0.terminal !== "Apple_Terminal") return !1;
    let Q = (await TQ("osascript", ["-e", 'tell application "Terminal" to name of current settings of front window'])).stdout.trim();
    if (!Q) return !1;
    let B = await TQ("defaults", ["export", "com.apple.Terminal", "-"]);
    if (B.code !== 0) return !1;
    let Y = BR2.default.parse(B.stdout)?.["Window Settings"]?.[Q];
    if (!Y) return !1;
    return Y.Bell === !1
  } catch (A) {
    return e(A instanceof Error ? A : Error(String(A))), !1
  }
}
// @from(Ln 316929, Col 4)
BR2
// @from(Ln 316929, Col 9)
GR2 = "Claude Code"
// @from(Ln 316930, Col 4)
MkA = w(() => {
  GQ();
  t4();
  Z0();
  p3();
  v1();
  zO();
  BR2 = c(QR2(), 1)
})
// @from(Ln 316939, Col 0)
async function YR2(A, Q, B) {
  try {
    let G = CJ();
    if (G.error) return;
    let Z = {
        "Content-Type": "application/json",
        "User-Agent": PD(),
        ...G.headers
      },
      Y = {
        vcs_type: "github",
        vcs_host: Q,
        vcs_username: A,
        git_user_email: B
      },
      J = "https://api.anthropic.com/api/claude_code/link_vcs_account";
    await xQ.post(J, Y, {
      headers: Z,
      timeout: 5000
    })
  } catch (G) {}
}
// @from(Ln 316961, Col 4)
JR2 = w(() => {
  j5();
  qz()
})
// @from(Ln 316965, Col 0)
async function Sy5() {
  try {
    let A = await TQ("gh", ["auth", "status", "--active", "--json", "hosts"], {
      useCwd: !1,
      timeout: 5000
    });
    if (A.code !== 0 || !A.stdout.trim()) return null;
    let B = AQ(A.stdout)?.hosts;
    if (!B || typeof B !== "object") return null;
    for (let [G, Z] of Object.entries(B)) {
      if (!Array.isArray(Z) || Z.length === 0) continue;
      let Y = Z[0];
      if (Y?.login) return {
        username: Y.login,
        hostname: G
      }
    }
    return null
  } catch (A) {
    return null
  }
}
// @from(Ln 316987, Col 0)
async function xy5() {
  try {
    let A = await TQ("git", ["config", "--get", "user.email"], {
      useCwd: !1,
      timeout: 5000
    });
    if (A.code === 0 && A.stdout.trim()) return A.stdout.trim();
    return null
  } catch (A) {
    return null
  }
}
// @from(Ln 316999, Col 0)
async function kE0() {
  if (!eZ(!0) && !p2()) return;
  if (Yk()) return;
  if (!0) {
    let Z = await UI1();
    if (Z.hasError || !Z.vcsAccountLinkingEnabled) return
  }
  let [B, G] = await Promise.all([Sy5(), xy5()]);
  if (B || G) YR2(B?.username ?? "", B?.hostname ?? "", G ?? "")
}
// @from(Ln 317009, Col 4)
XR2 = w(() => {
  t4();
  JR2();
  Q2();
  PH0();
  GQ();
  C0();
  A0()
})
// @from(Ln 317019, Col 0)
function _s({
  onDone: A,
  startingMessage: Q,
  mode: B = "login",
  forceLoginMethod: G
}) {
  let Z = jQ() || {},
    Y = G ?? Z.forceLoginMethod,
    J = Z.forceLoginOrgUUID,
    X = Y === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : Y === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null,
    I = Tk(),
    [D, W] = P2.useState(() => {
      if (B === "setup-token") return {
        state: "ready_to_start"
      };
      if (Y === "claudeai" || Y === "console") return {
        state: "ready_to_start"
      };
      return {
        state: "idle"
      }
    }),
    [K, V] = P2.useState(""),
    [F, H] = P2.useState(0),
    [E] = P2.useState(() => new YkA),
    [z, $] = P2.useState(() => {
      return B === "setup-token" || Y === "claudeai"
    }),
    [O, L] = P2.useState(!1),
    M = ZB().columns - IR2.length - 1;
  P2.useEffect(() => {
    if (Y === "claudeai") l("tengu_oauth_claudeai_forced", {});
    else if (Y === "console") l("tengu_oauth_console_forced", {})
  }, [Y]), P2.useEffect(() => {
    if (D.state === "about_to_retry") setTimeout(() => {
      W(D.nextState)
    }, 1000)
  }, [D]), J0(async (S, u) => {
    if (u.return) {
      if (D.state === "success" && B !== "setup-token") l("tengu_oauth_success", {
        loginWithClaudeAi: z
      }), A();
      else if (D.state === "error" && D.toRetry) V(""), W({
        state: "about_to_retry",
        nextState: D.toRetry
      })
    }
  });
  async function _(S, u) {
    try {
      let [f, AA] = S.split("#");
      if (!f || !AA) {
        W({
          state: "error",
          message: "Invalid code. Please make sure the full code was copied",
          toRetry: {
            state: "waiting_for_login",
            url: u
          }
        });
        return
      }
      l("tengu_oauth_manual_entry", {}), E.handleManualAuthCodeInput({
        authorizationCode: f,
        state: AA
      })
    } catch (f) {
      e(f instanceof Error ? f : Error(String(f))), W({
        state: "error",
        message: f.message,
        toRetry: {
          state: "waiting_for_login",
          url: u
        }
      })
    }
  }
  let j = P2.useCallback(async () => {
      try {
        l("tengu_oauth_flow_start", {
          loginWithClaudeAi: z
        });
        let S = await E.startOAuthFlow(async (u) => {
          W({
            state: "waiting_for_login",
            url: u
          }), setTimeout(() => L(!0), 3000)
        }, {
          loginWithClaudeAi: z,
          inferenceOnly: B === "setup-token",
          expiresIn: B === "setup-token" ? 31536000 : void 0,
          orgUUID: J
        }).catch((u) => {
          let f = u.message.includes("Token exchange failed");
          throw W({
            state: "error",
            message: f ? "Failed to exchange authorization code for access token. Please try again." : u.message,
            toRetry: B === "setup-token" ? {
              state: "ready_to_start"
            } : {
              state: "idle"
            }
          }), l("tengu_oauth_token_exchange_error", {
            error: u.message
          }), u
        });
        if (B === "setup-token") W({
          state: "success",
          token: S.accessToken
        });
        else {
          let u = XXA(S);
          if (u.warning) l("tengu_oauth_storage_warning", {
            warning: u.warning
          });
          if (await REQ(S.accessToken).catch((f) => {
              throw W({
                state: "error",
                message: "Failed to fetch user roles: " + f.message,
                toRetry: {
                  state: "idle"
                }
              }), l("tengu_oauth_user_roles_error", {
                error: f.message
              }), f
            }), xg(S.scopes)) await ZeQ(), RI1(), W({
            state: "success"
          }), Dc({
            message: "Claude Code login successful",
            notificationType: "auth_success"
          }, I), kE0();
          else if (W({
              state: "creating_api_key"
            }), await _EQ(S.accessToken).catch((AA) => {
              throw W({
                state: "error",
                message: "Failed to create API key: " + AA.message,
                toRetry: {
                  state: "idle"
                }
              }), l("tengu_oauth_api_key_error", {
                error: AA.message
              }), AA
            })) RI1(), W({
            state: "success"
          }), Dc({
            message: "Claude Code login successful",
            notificationType: "auth_success"
          }, I), kE0();
          else W({
            state: "error",
            message: "Unable to create API key. The server accepted the request but didn't return a key.",
            toRetry: {
              state: "idle"
            }
          }), l("tengu_oauth_api_key_error", {
            error: "server_returned_no_key"
          })
        }
      } catch (S) {
        let u = S.message;
        l("tengu_oauth_error", {
          error: u
        })
      }
    }, [E, L, z, B, J]),
    x = P2.useRef(!1);
  P2.useEffect(() => {
    if (D.state === "ready_to_start" && !x.current) x.current = !0, process.nextTick(() => {
      j(), x.current = !1
    })
  }, [D.state, j]), P2.useEffect(() => {
    if (B === "setup-token" && D.state === "success") {
      let S = setTimeout(async () => {
        l("tengu_oauth_success", {
          loginWithClaudeAi: z
        }), A()
      }, 500);
      return () => clearTimeout(S)
    }
  }, [B, D, z, A]), P2.useEffect(() => {
    return () => {
      E.cleanup()
    }
  }, [E]);

  function b() {
    switch (D.state) {
      case "idle":
        return P2.default.createElement(T, {
          flexDirection: "column",
          gap: 1,
          marginTop: 1
        }, P2.default.createElement(C, {
          bold: !0
        }, Q ? Q : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."), P2.default.createElement(C, null, "Select login method:"), P2.default.createElement(T, null, P2.default.createElement(k0, {
          options: [{
            label: P2.default.createElement(C, null, "Claude account with subscription ·", " ", P2.default.createElement(C, {
              dimColor: !0
            }, "Pro, Max, Team, or Enterprise"), `
`),
            value: "claudeai"
          }, {
            label: P2.default.createElement(C, null, "Anthropic Console account ·", " ", P2.default.createElement(C, {
              dimColor: !0
            }, "API usage billing"), `
`),
            value: "console"
          }],
          onCancel: () => {},
          onChange: (S) => {
            if (W({
                state: "ready_to_start"
              }), S === "claudeai") l("tengu_oauth_claudeai_selected", {}), $(!0);
            else l("tengu_oauth_console_selected", {}), $(!1)
          }
        })));
      case "waiting_for_login":
        return P2.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, X && P2.default.createElement(T, null, P2.default.createElement(C, {
          dimColor: !0
        }, X)), !O && P2.default.createElement(T, null, P2.default.createElement(W9, null), P2.default.createElement(C, null, "Opening browser to sign in…")), O && P2.default.createElement(T, null, P2.default.createElement(C, null, IR2), P2.default.createElement(p4, {
          value: K,
          onChange: V,
          onSubmit: (S) => _(S, D.url),
          cursorOffset: F,
          onChangeCursorOffset: H,
          columns: M
        })));
      case "creating_api_key":
        return P2.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, P2.default.createElement(T, null, P2.default.createElement(W9, null), P2.default.createElement(C, null, "Creating API key for Claude Code…")));
      case "about_to_retry":
        return P2.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, P2.default.createElement(C, {
          color: "permission"
        }, "Retrying…"));
      case "success":
        return P2.default.createElement(T, {
          flexDirection: "column"
        }, B === "setup-token" && D.token ? null : P2.default.createElement(P2.default.Fragment, null, v3()?.emailAddress ? P2.default.createElement(C, {
          dimColor: !0
        }, "Logged in as", " ", P2.default.createElement(C, null, v3()?.emailAddress)) : null, P2.default.createElement(C, {
          color: "success"
        }, "Login successful. Press ", P2.default.createElement(C, {
          bold: !0
        }, "Enter"), " to continue…")));
      case "error":
        return P2.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, P2.default.createElement(C, {
          color: "error"
        }, "OAuth error: ", D.message), D.toRetry && P2.default.createElement(T, {
          marginTop: 1
        }, P2.default.createElement(C, {
          color: "permission"
        }, "Press ", P2.default.createElement(C, {
          bold: !0
        }, "Enter"), " to retry.")));
      default:
        return null
    }
  }
  return P2.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, D.state === "waiting_for_login" && O && P2.default.createElement(T, {
    flexDirection: "column",
    key: "urlToCopy",
    gap: 1,
    paddingBottom: 1
  }, P2.default.createElement(T, {
    paddingX: 1
  }, P2.default.createElement(C, {
    dimColor: !0
  }, "Browser didn't open? Use the url below to sign in:")), P2.default.createElement(b4A, null, P2.default.createElement(i2, {
    url: D.url
  }, P2.default.createElement(C, {
    dimColor: !0
  }, D.url)))), B === "setup-token" && D.state === "success" && D.token && P2.default.createElement(T, {
    key: "tokenOutput",
    flexDirection: "column",
    gap: 1,
    paddingTop: 1
  }, P2.default.createElement(C, {
    color: "success"
  }, "✓ Long-lived authentication token created successfully!"), P2.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, P2.default.createElement(C, null, "Your OAuth token (valid for 1 year):"), P2.default.createElement(b4A, null, P2.default.createElement(C, {
    color: "warning"
  }, D.token)), P2.default.createElement(C, {
    dimColor: !0
  }, "Store this token securely. You won't be able to see it again."), P2.default.createElement(C, {
    dimColor: !0
  }, "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"))), P2.default.createElement(T, {
    paddingLeft: 1,
    flexDirection: "column",
    gap: 1
  }, b()))
}
// @from(Ln 317327, Col 4)
P2
// @from(Ln 317327, Col 8)
IR2 = "Paste code here if prompted > "
// @from(Ln 317328, Col 4)
RkA = w(() => {
  fA();
  sY1();
  IY();
  tH0();
  JL();
  Q2();
  Z0();
  P4();
  v1();
  yG();
  MkA();
  nBA();
  W8();
  _I1();
  GB();
  l2();
  XR2();
  P2 = c(QA(), 1)
})
// @from(Ln 317349, Col 0)
function js() {
  let [{
    mainLoopModel: A,
    mainLoopModelForSession: Q
  }] = a0();
  return DR2.useMemo(() => {
    return FX(Q ?? A ?? EQA())
  }, [Q, A])
}
// @from(Ln 317358, Col 4)
DR2
// @from(Ln 317359, Col 4)
_kA = w(() => {
  l2();
  hB();
  DR2 = c(QA(), 1)
})
// @from(Ln 317364, Col 4)
KR2 = U((WR2) => {
  Object.defineProperty(WR2, "__esModule", {
    value: !0
  })
})
// @from(Ln 317369, Col 4)
FR2 = U((VR2) => {
  Object.defineProperty(VR2, "__esModule", {
    value: !0
  })
})
// @from(Ln 317374, Col 4)
bE0 = U((HR2) => {
  Object.defineProperty(HR2, "__esModule", {
    value: !0
  })
})
// @from(Ln 317379, Col 4)
fE0 = U((vy5) => {
  function yy5(A, Q, B) {
    Q.split && (Q = Q.split("."));
    var G = 0,
      Z = Q.length,
      Y = A,
      J, X;
    while (G < Z) {
      if (X = "" + Q[G++], X === "__proto__" || X === "constructor" || X === "prototype") break;
      Y = Y[X] = G === Z ? B : typeof (J = Y[X]) === typeof Q ? J : Q[G] * 0 !== 0 || !!~("" + Q[G]).indexOf(".") ? {} : []
    }
  }
  vy5.dset = yy5
})
// @from(Ln 317393, Col 4)
$R2 = U((ER2) => {
  Object.defineProperty(ER2, "__esModule", {
    value: !0
  });
  ER2.pickBy = void 0;
  var by5 = function (A, Q) {
    return Object.keys(A).filter(function (B) {
      return Q(B, A[B])
    }).reduce(function (B, G) {
      return B[G] = A[G], B
    }, {})
  };
  ER2.pickBy = by5
})
// @from(Ln 317407, Col 4)
hE0 = U((CR2) => {
  Object.defineProperty(CR2, "__esModule", {
    value: !0
  });
  CR2.ValidationError = void 0;
  var fy5 = LZ(),
    hy5 = function (A) {
      fy5.__extends(Q, A);

      function Q(B, G) {
        var Z = A.call(this, "".concat(B, " ").concat(G)) || this;
        return Z.field = B, Z
      }
      return Q
    }(Error);
  CR2.ValidationError = hy5
})
// @from(Ln 317424, Col 4)
gE0 = U((qR2) => {
  Object.defineProperty(qR2, "__esModule", {
    value: !0
  });
  qR2.isPlainObject = qR2.exists = qR2.isFunction = qR2.isNumber = qR2.isString = void 0;

  function gy5(A) {
    return typeof A === "string"
  }
  qR2.isString = gy5;

  function uy5(A) {
    return typeof A === "number"
  }
  qR2.isNumber = uy5;

  function my5(A) {
    return typeof A === "function"
  }
  qR2.isFunction = my5;

  function dy5(A) {
    return A !== void 0 && A !== null
  }
  qR2.exists = dy5;

  function cy5(A) {
    return Object.prototype.toString.call(A).slice(8, -1).toLowerCase() === "object"
  }
  qR2.isPlainObject = cy5
})
// @from(Ln 317455, Col 4)
dE0 = U((TR2) => {
  Object.defineProperty(TR2, "__esModule", {
    value: !0
  });
  TR2.validateEvent = TR2.assertTraits = TR2.assertTrackEventProperties = TR2.assertTrackEventName = TR2.assertEventType = TR2.assertEventExists = TR2.assertUserIdentity = void 0;
  var Ts = hE0(),
    q6A = gE0(),
    uE0 = "is not a string",
    mE0 = "is not an object",
    wR2 = "is nil";

  function LR2(A) {
    var Q = ".userId/anonymousId/previousId/groupId",
      B = function (Z) {
        var Y, J, X;
        return (X = (J = (Y = Z.userId) !== null && Y !== void 0 ? Y : Z.anonymousId) !== null && J !== void 0 ? J : Z.groupId) !== null && X !== void 0 ? X : Z.previousId
      },
      G = B(A);
    if (!(0, q6A.exists)(G)) throw new Ts.ValidationError(Q, wR2);
    else if (!(0, q6A.isString)(G)) throw new Ts.ValidationError(Q, uE0)
  }
  TR2.assertUserIdentity = LR2;

  function OR2(A) {
    if (!(0, q6A.exists)(A)) throw new Ts.ValidationError("Event", wR2);
    if (typeof A !== "object") throw new Ts.ValidationError("Event", mE0)
  }
  TR2.assertEventExists = OR2;

  function MR2(A) {
    if (!(0, q6A.isString)(A.type)) throw new Ts.ValidationError(".type", uE0)
  }
  TR2.assertEventType = MR2;

  function RR2(A) {
    if (!(0, q6A.isString)(A.event)) throw new Ts.ValidationError(".event", uE0)
  }
  TR2.assertTrackEventName = RR2;

  function _R2(A) {
    if (!(0, q6A.isPlainObject)(A.properties)) throw new Ts.ValidationError(".properties", mE0)
  }
  TR2.assertTrackEventProperties = _R2;

  function jR2(A) {
    if (!(0, q6A.isPlainObject)(A.traits)) throw new Ts.ValidationError(".traits", mE0)
  }
  TR2.assertTraits = jR2;

  function ay5(A) {
    if (OR2(A), MR2(A), A.type === "track") RR2(A), _R2(A);
    if (["group", "identify"].includes(A.type)) jR2(A);
    LR2(A)
  }
  TR2.validateEvent = ay5
})
// @from(Ln 317511, Col 4)
yR2 = U((cE0) => {
  Object.defineProperty(cE0, "__esModule", {
    value: !0
  });
  cE0.EventFactory = void 0;
  var m8 = LZ();
  m8.__exportStar(bE0(), cE0);
  var SR2 = fE0(),
    Qv5 = $R2(),
    Bv5 = dE0(),
    Gv5 = function () {
      function A(Q) {
        this.user = Q.user, this.createMessageId = Q.createMessageId
      }
      return A.prototype.track = function (Q, B, G, Z) {
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), {
          event: Q,
          type: "track",
          properties: B !== null && B !== void 0 ? B : {},
          options: m8.__assign({}, G),
          integrations: m8.__assign({}, Z)
        }))
      }, A.prototype.page = function (Q, B, G, Z, Y) {
        var J, X = {
          type: "page",
          properties: m8.__assign({}, G),
          options: m8.__assign({}, Z),
          integrations: m8.__assign({}, Y)
        };
        if (Q !== null) X.category = Q, X.properties = (J = X.properties) !== null && J !== void 0 ? J : {}, X.properties.category = Q;
        if (B !== null) X.name = B;
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), X))
      }, A.prototype.screen = function (Q, B, G, Z, Y) {
        var J = {
          type: "screen",
          properties: m8.__assign({}, G),
          options: m8.__assign({}, Z),
          integrations: m8.__assign({}, Y)
        };
        if (Q !== null) J.category = Q;
        if (B !== null) J.name = B;
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), J))
      }, A.prototype.identify = function (Q, B, G, Z) {
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), {
          type: "identify",
          userId: Q,
          traits: B !== null && B !== void 0 ? B : {},
          options: m8.__assign({}, G),
          integrations: Z
        }))
      }, A.prototype.group = function (Q, B, G, Z) {
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), {
          type: "group",
          traits: B !== null && B !== void 0 ? B : {},
          options: m8.__assign({}, G),
          integrations: m8.__assign({}, Z),
          groupId: Q
        }))
      }, A.prototype.alias = function (Q, B, G, Z) {
        var Y = {
          userId: Q,
          type: "alias",
          options: m8.__assign({}, G),
          integrations: m8.__assign({}, Z)
        };
        if (B !== null) Y.previousId = B;
        if (Q === void 0) return this.normalize(m8.__assign(m8.__assign({}, Y), this.baseEvent()));
        return this.normalize(m8.__assign(m8.__assign({}, this.baseEvent()), Y))
      }, A.prototype.baseEvent = function () {
        var Q = {
          integrations: {},
          options: {}
        };
        if (!this.user) return Q;
        var B = this.user;
        if (B.id()) Q.userId = B.id();
        if (B.anonymousId()) Q.anonymousId = B.anonymousId();
        return Q
      }, A.prototype.context = function (Q) {
        var B, G = ["userId", "anonymousId", "timestamp"];
        delete Q.integrations;
        var Z = Object.keys(Q),
          Y = (B = Q.context) !== null && B !== void 0 ? B : {},
          J = {};
        return Z.forEach(function (X) {
          if (X === "context") return;
          if (G.includes(X))(0, SR2.dset)(J, X, Q[X]);
          else(0, SR2.dset)(Y, X, Q[X])
        }), [Y, J]
      }, A.prototype.normalize = function (Q) {
        var B, G, Z = Object.keys((B = Q.integrations) !== null && B !== void 0 ? B : {}).reduce(function (F, H) {
          var E, z;
          return m8.__assign(m8.__assign({}, F), (E = {}, E[H] = Boolean((z = Q.integrations) === null || z === void 0 ? void 0 : z[H]), E))
        }, {});
        Q.options = (0, Qv5.pickBy)(Q.options || {}, function (F, H) {
          return H !== void 0
        });
        var Y = m8.__assign(m8.__assign({}, Z), (G = Q.options) === null || G === void 0 ? void 0 : G.integrations),
          J = Q.options ? this.context(Q.options) : [],
          X = J[0],
          I = J[1],
          D = Q.options,
          W = m8.__rest(Q, ["options"]),
          K = m8.__assign(m8.__assign(m8.__assign({
            timestamp: new Date
          }, W), {
            integrations: Y,
            context: X
          }), I),
          V = m8.__assign(m8.__assign({}, K), {
            messageId: this.createMessageId()
          });
        return (0, Bv5.validateEvent)(V), V
      }, A
    }();
  cE0.EventFactory = Gv5
})
// @from(Ln 317628, Col 4)
pE0 = U((bR2) => {
  Object.defineProperty(bR2, "__esModule", {
    value: !0
  });
  bR2.invokeCallback = bR2.sleep = bR2.pTimeout = void 0;

  function vR2(A, Q) {
    return new Promise(function (B, G) {
      var Z = setTimeout(function () {
        G(Error("Promise timed out"))
      }, Q);
      A.then(function (Y) {
        return clearTimeout(Z), B(Y)
      }).catch(G)
    })
  }
  bR2.pTimeout = vR2;

  function kR2(A) {
    return new Promise(function (Q) {
      return setTimeout(Q, A)
    })
  }
  bR2.sleep = kR2;

  function Zv5(A, Q, B) {
    var G = function () {
      try {
        return Promise.resolve(Q(A))
      } catch (Z) {
        return Promise.reject(Z)
      }
    };
    return kR2(B).then(function () {
      return vR2(G(), 1000)
    }).catch(function (Z) {
      A === null || A === void 0 || A.log("warn", "Callback Error", {
        error: Z
      }), A === null || A === void 0 || A.stats.increment("callback_error")
    }).then(function () {
      return A
    })
  }
  bR2.invokeCallback = Zv5
})
// @from(Ln 317673, Col 4)
uR2 = U((hR2) => {
  Object.defineProperty(hR2, "__esModule", {
    value: !0
  });
  hR2.createDeferred = void 0;
  var Xv5 = function () {
    var A, Q, B = new Promise(function (G, Z) {
      A = G, Q = Z
    });
    return {
      resolve: A,
      reject: Q,
      promise: B
    }
  };
  hR2.createDeferred = Xv5
})
// @from(Ln 317690, Col 4)
mR2 = U((lE0) => {
  Object.defineProperty(lE0, "__esModule", {
    value: !0
  });
  var Iv5 = LZ();
  Iv5.__exportStar(uR2(), lE0)
})
// @from(Ln 317697, Col 4)
pR2 = U((dR2) => {
  Object.defineProperty(dR2, "__esModule", {
    value: !0
  });
  dR2.Emitter = void 0;
  var Dv5 = function () {
    function A(Q) {
      var B;
      this.callbacks = {}, this.warned = !1, this.maxListeners = (B = Q === null || Q === void 0 ? void 0 : Q.maxListeners) !== null && B !== void 0 ? B : 10
    }
    return A.prototype.warnIfPossibleMemoryLeak = function (Q) {
      if (this.warned) return;
      if (this.maxListeners && this.callbacks[Q].length > this.maxListeners) console.warn("Event Emitter: Possible memory leak detected; ".concat(String(Q), " has exceeded ").concat(this.maxListeners, " listeners.")), this.warned = !0
    }, A.prototype.on = function (Q, B) {
      if (!this.callbacks[Q]) this.callbacks[Q] = [B];
      else this.callbacks[Q].push(B), this.warnIfPossibleMemoryLeak(Q);
      return this
    }, A.prototype.once = function (Q, B) {
      var G = this,
        Z = function () {
          var Y = [];
          for (var J = 0; J < arguments.length; J++) Y[J] = arguments[J];
          G.off(Q, Z), B.apply(G, Y)
        };
      return this.on(Q, Z), this
    }, A.prototype.off = function (Q, B) {
      var G, Z = (G = this.callbacks[Q]) !== null && G !== void 0 ? G : [],
        Y = Z.filter(function (J) {
          return J !== B
        });
      return this.callbacks[Q] = Y, this
    }, A.prototype.emit = function (Q) {
      var B = this,
        G, Z = [];
      for (var Y = 1; Y < arguments.length; Y++) Z[Y - 1] = arguments[Y];
      var J = (G = this.callbacks[Q]) !== null && G !== void 0 ? G : [];
      return J.forEach(function (X) {
        X.apply(B, Z)
      }), this
    }, A
  }();
  dR2.Emitter = Dv5
})
// @from(Ln 317740, Col 4)
lR2 = U((iE0) => {
  Object.defineProperty(iE0, "__esModule", {
    value: !0
  });
  var Wv5 = LZ();
  Wv5.__exportStar(pR2(), iE0)
})
// @from(Ln 317747, Col 4)
JHA = U((BD1) => {
  Object.defineProperty(BD1, "__esModule", {
    value: !0
  });
  var iR2 = LZ();
  iR2.__exportStar(mR2(), BD1);
  iR2.__exportStar(lR2(), BD1)
})
// @from(Ln 317755, Col 4)
nE0 = U((nR2) => {
  Object.defineProperty(nR2, "__esModule", {
    value: !0
  });
  nR2.backoff = void 0;

  function Kv5(A) {
    var Q = Math.random() + 1,
      B = A.minTimeout,
      G = B === void 0 ? 500 : B,
      Z = A.factor,
      Y = Z === void 0 ? 2 : Z,
      J = A.attempt,
      X = A.maxTimeout,
      I = X === void 0 ? 1 / 0 : X;
    return Math.min(Q * G * Math.pow(Y, J), I)
  }
  nR2.backoff = Kv5
})
// @from(Ln 317774, Col 4)
aE0 = U((oR2) => {
  Object.defineProperty(oR2, "__esModule", {
    value: !0
  });
  oR2.PriorityQueue = oR2.ON_REMOVE_FROM_FUTURE = void 0;
  var Vv5 = LZ(),
    Fv5 = JHA(),
    Hv5 = nE0();
  oR2.ON_REMOVE_FROM_FUTURE = "onRemoveFromFuture";
  var Ev5 = function (A) {
    Vv5.__extends(Q, A);

    function Q(B, G, Z) {
      var Y = A.call(this) || this;
      return Y.future = [], Y.maxAttempts = B, Y.queue = G, Y.seen = Z !== null && Z !== void 0 ? Z : {}, Y
    }
    return Q.prototype.push = function () {
      var B = this,
        G = [];
      for (var Z = 0; Z < arguments.length; Z++) G[Z] = arguments[Z];
      var Y = G.map(function (J) {
        var X = B.updateAttempts(J);
        if (X > B.maxAttempts || B.includes(J)) return !1;
        return B.queue.push(J), !0
      });
      return this.queue = this.queue.sort(function (J, X) {
        return B.getAttempts(J) - B.getAttempts(X)
      }), Y
    }, Q.prototype.pushWithBackoff = function (B) {
      var G = this;
      if (this.getAttempts(B) === 0) return this.push(B)[0];
      var Z = this.updateAttempts(B);
      if (Z > this.maxAttempts || this.includes(B)) return !1;
      var Y = (0, Hv5.backoff)({
        attempt: Z - 1
      });
      return setTimeout(function () {
        G.queue.push(B), G.future = G.future.filter(function (J) {
          return J.id !== B.id
        }), G.emit(oR2.ON_REMOVE_FROM_FUTURE)
      }, Y), this.future.push(B), !0
    }, Q.prototype.getAttempts = function (B) {
      var G;
      return (G = this.seen[B.id]) !== null && G !== void 0 ? G : 0
    }, Q.prototype.updateAttempts = function (B) {
      return this.seen[B.id] = this.getAttempts(B) + 1, this.getAttempts(B)
    }, Q.prototype.includes = function (B) {
      return this.queue.includes(B) || this.future.includes(B) || Boolean(this.queue.find(function (G) {
        return G.id === B.id
      })) || Boolean(this.future.find(function (G) {
        return G.id === B.id
      }))
    }, Q.prototype.pop = function () {
      return this.queue.shift()
    }, Object.defineProperty(Q.prototype, "length", {
      get: function () {
        return this.queue.length
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(Q.prototype, "todo", {
      get: function () {
        return this.queue.length + this.future.length
      },
      enumerable: !1,
      configurable: !0
    }), Q
  }(Fv5.Emitter);
  oR2.PriorityQueue = Ev5
})
// @from(Ln 317844, Col 4)
oE0 = U(($v5) => {
  var N6A = 256,
    ZD1 = [],
    GD1;
  while (N6A--) ZD1[N6A] = (N6A + 256).toString(16).substring(1);

  function zv5() {
    var A = 0,
      Q, B = "";
    if (!GD1 || N6A + 16 > 256) {
      GD1 = Array(A = 256);
      while (A--) GD1[A] = 256 * Math.random() | 0;
      A = N6A = 0
    }
    for (; A < 16; A++) {
      if (Q = GD1[N6A + A], A == 6) B += ZD1[Q & 15 | 64];
      else if (A == 8) B += ZD1[Q & 63 | 128];
      else B += ZD1[Q];
      if (A & 1 && A > 1 && A < 11) B += "-"
    }
    return N6A++, B
  }
  $v5.v4 = zv5
})
// @from(Ln 317868, Col 4)
rE0 = U((tR2) => {
  Object.defineProperty(tR2, "__esModule", {
    value: !0
  });
  tR2.CoreLogger = void 0;
  var YD1 = LZ(),
    Uv5 = function () {
      function A() {
        this._logs = []
      }
      return A.prototype.log = function (Q, B, G) {
        var Z = new Date;
        this._logs.push({
          level: Q,
          message: B,
          time: Z,
          extras: G
        })
      }, Object.defineProperty(A.prototype, "logs", {
        get: function () {
          return this._logs
        },
        enumerable: !1,
        configurable: !0
      }), A.prototype.flush = function () {
        if (this.logs.length > 1) {
          var Q = this._logs.reduce(function (B, G) {
            var Z, Y, J, X = YD1.__assign(YD1.__assign({}, G), {
              json: JSON.stringify(G.extras, null, " "),
              extras: G.extras
            });
            delete X.time;
            var I = (J = (Y = G.time) === null || Y === void 0 ? void 0 : Y.toISOString()) !== null && J !== void 0 ? J : "";
            if (B[I]) I = "".concat(I, "-").concat(Math.random());
            return YD1.__assign(YD1.__assign({}, B), (Z = {}, Z[I] = X, Z))
          }, {});
          if (console.table) console.table(Q);
          else console.log(Q)
        } else this.logs.forEach(function (B) {
          var {
            level: G,
            message: Z,
            extras: Y
          } = B;
          if (G === "info" || G === "debug") console.log(Z, Y !== null && Y !== void 0 ? Y : "");
          else console[G](Z, Y !== null && Y !== void 0 ? Y : "")
        });
        this._logs = []
      }, A
    }();
  tR2.CoreLogger = Uv5
})
// @from(Ln 317920, Col 4)
tE0 = U((Q_2) => {
  Object.defineProperty(Q_2, "__esModule", {
    value: !0
  });
  Q_2.NullStats = Q_2.CoreStats = void 0;
  var sE0 = LZ(),
    qv5 = function (A) {
      var Q = {
        gauge: "g",
        counter: "c"
      };
      return Q[A]
    },
    A_2 = function () {
      function A() {
        this.metrics = []
      }
      return A.prototype.increment = function (Q, B, G) {
        if (B === void 0) B = 1;
        this.metrics.push({
          metric: Q,
          value: B,
          tags: G !== null && G !== void 0 ? G : [],
          type: "counter",
          timestamp: Date.now()
        })
      }, A.prototype.gauge = function (Q, B, G) {
        this.metrics.push({
          metric: Q,
          value: B,
          tags: G !== null && G !== void 0 ? G : [],
          type: "gauge",
          timestamp: Date.now()
        })
      }, A.prototype.flush = function () {
        var Q = this.metrics.map(function (B) {
          return sE0.__assign(sE0.__assign({}, B), {
            tags: B.tags.join(",")
          })
        });
        if (console.table) console.table(Q);
        else console.log(Q);
        this.metrics = []
      }, A.prototype.serialize = function () {
        return this.metrics.map(function (Q) {
          return {
            m: Q.metric,
            v: Q.value,
            t: Q.tags,
            k: qv5(Q.type),
            e: Q.timestamp
          }
        })
      }, A
    }();
  Q_2.CoreStats = A_2;
  var Nv5 = function (A) {
    sE0.__extends(Q, A);

    function Q() {
      return A !== null && A.apply(this, arguments) || this
    }
    return Q.prototype.gauge = function () {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.increment = function () {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.flush = function () {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.serialize = function () {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G];
      return []
    }, Q
  }(A_2);
  Q_2.NullStats = Nv5
})
// @from(Ln 317999, Col 4)
JD1 = U((Z_2) => {
  Object.defineProperty(Z_2, "__esModule", {
    value: !0
  });
  Z_2.CoreContext = Z_2.ContextCancelation = void 0;
  var Lv5 = oE0(),
    Ov5 = fE0(),
    Mv5 = rE0(),
    Rv5 = tE0(),
    G_2 = function () {
      function A(Q) {
        var B, G, Z;
        this.retry = (B = Q.retry) !== null && B !== void 0 ? B : !0, this.type = (G = Q.type) !== null && G !== void 0 ? G : "plugin Error", this.reason = (Z = Q.reason) !== null && Z !== void 0 ? Z : ""
      }
      return A
    }();
  Z_2.ContextCancelation = G_2;
  var _v5 = function () {
    function A(Q, B, G, Z) {
      if (B === void 0) B = (0, Lv5.v4)();
      if (G === void 0) G = new Rv5.NullStats;
      if (Z === void 0) Z = new Mv5.CoreLogger;
      this.attempts = 0, this.event = Q, this._id = B, this.logger = Z, this.stats = G
    }
    return A.system = function () {}, A.prototype.isSame = function (Q) {
      return Q.id === this.id
    }, A.prototype.cancel = function (Q) {
      if (Q) throw Q;
      throw new G_2({
        reason: "Context Cancel"
      })
    }, A.prototype.log = function (Q, B, G) {
      this.logger.log(Q, B, G)
    }, Object.defineProperty(A.prototype, "id", {
      get: function () {
        return this._id
      },
      enumerable: !1,
      configurable: !0
    }), A.prototype.updateEvent = function (Q, B) {
      var G;
      if (Q.split(".")[0] === "integrations") {
        var Z = Q.split(".")[1];
        if (((G = this.event.integrations) === null || G === void 0 ? void 0 : G[Z]) === !1) return this.event
      }
      return (0, Ov5.dset)(this.event, Q, B), this.event
    }, A.prototype.failedDelivery = function () {
      return this._failedDelivery
    }, A.prototype.setFailedDelivery = function (Q) {
      this._failedDelivery = Q
    }, A.prototype.logs = function () {
      return this.logger.logs
    }, A.prototype.flush = function () {
      this.logger.flush(), this.stats.flush()
    }, A.prototype.toJSON = function () {
      return {
        id: this._id,
        event: this.event,
        logs: this.logger.logs,
        metrics: this.stats.metrics
      }
    }, A
  }();
  Z_2.CoreContext = _v5
})
// @from(Ln 318064, Col 4)
D_2 = U((X_2) => {
  Object.defineProperty(X_2, "__esModule", {
    value: !0
  });
  X_2.groupBy = void 0;
  var J_2 = LZ();

  function Tv5(A, Q) {
    var B = {};
    return A.forEach(function (G) {
      var Z, Y = void 0;
      if (typeof Q === "string") {
        var J = G[Q];
        Y = typeof J !== "string" ? JSON.stringify(J) : J
      } else if (Q instanceof Function) Y = Q(G);
      if (Y === void 0) return;
      B[Y] = J_2.__spreadArray(J_2.__spreadArray([], (Z = B[Y]) !== null && Z !== void 0 ? Z : [], !0), [G], !1)
    }), B
  }
  X_2.groupBy = Tv5
})
// @from(Ln 318085, Col 4)
V_2 = U((W_2) => {
  Object.defineProperty(W_2, "__esModule", {
    value: !0
  });
  W_2.isThenable = void 0;
  var Pv5 = function (A) {
    return typeof A === "object" && A !== null && "then" in A && typeof A.then === "function"
  };
  W_2.isThenable = Pv5
})
// @from(Ln 318095, Col 4)
E_2 = U((F_2) => {
  Object.defineProperty(F_2, "__esModule", {
    value: !0
  });
  F_2.createTaskGroup = void 0;
  var Sv5 = V_2(),
    xv5 = function () {
      var A, Q, B = 0;
      return {
        done: function () {
          return A
        },
        run: function (G) {
          var Z = G();
          if ((0, Sv5.isThenable)(Z)) {
            if (++B === 1) A = new Promise(function (Y) {
              return Q = Y
            });
            Z.finally(function () {
              return --B === 0 && Q()
            })
          }
          return Z
        }
      }
    };
  F_2.createTaskGroup = xv5
})
// @from(Ln 318123, Col 4)
Az0 = U((C_2) => {
  Object.defineProperty(C_2, "__esModule", {
    value: !0
  });
  C_2.ensure = C_2.attempt = void 0;
  var z_2 = LZ(),
    eE0 = JD1();

  function yv5(A) {
    return z_2.__awaiter(this, void 0, void 0, function () {
      var Q;
      return z_2.__generator(this, function (B) {
        switch (B.label) {
          case 0:
            return B.trys.push([0, 2, , 3]), [4, A()];
          case 1:
            return [2, B.sent()];
          case 2:
            return Q = B.sent(), [2, Promise.reject(Q)];
          case 3:
            return [2]
        }
      })
    })
  }

  function $_2(A, Q) {
    A.log("debug", "plugin", {
      plugin: Q.name
    });
    var B = new Date().getTime(),
      G = Q[A.event.type];
    if (G === void 0) return Promise.resolve(A);
    var Z = yv5(function () {
      return G.apply(Q, [A])
    }).then(function (Y) {
      var J = new Date().getTime() - B;
      return Y.stats.gauge("plugin_time", J, ["plugin:".concat(Q.name)]), Y
    }).catch(function (Y) {
      if (Y instanceof eE0.ContextCancelation && Y.type === "middleware_cancellation") throw Y;
      if (Y instanceof eE0.ContextCancelation) return A.log("warn", Y.type, {
        plugin: Q.name,
        error: Y
      }), Y;
      return A.log("error", "plugin Error", {
        plugin: Q.name,
        error: Y
      }), A.stats.increment("plugin_error", 1, ["plugin:".concat(Q.name)]), Y
    });
    return Z
  }
  C_2.attempt = $_2;

  function vv5(A, Q) {
    return $_2(A, Q).then(function (B) {
      if (B instanceof eE0.CoreContext) return B;
      A.log("debug", "Context canceled"), A.stats.increment("context_canceled"), A.cancel(B)
    })
  }
  C_2.ensure = vv5
})