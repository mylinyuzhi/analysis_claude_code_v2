
// @from(Start 11338984, End 11356541)
Tq = z((qT2, NT2) => {
  (function() {
    var A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H, C, E, U, q = {}.hasOwnProperty,
      w = [].splice;
    ({
      isObject: U,
      isFunction: E,
      isEmpty: C,
      getValue: H
    } = Uy()), J = null, B = null, G = null, Z = null, I = null, K = null, D = null, F = null, Y = null, Q = null, V = null, W = null, A = null, NT2.exports = X = function() {
      class N {
        constructor(R) {
          if (this.parent = R, this.parent) this.options = this.parent.options, this.stringify = this.parent.stringify;
          if (this.value = null, this.children = [], this.baseURI = null, !J) J = O61(), B = R61(), G = T61(), Z = P61(), I = y61(), K = x61(), D = v61(), F = b61(), Y = a80(), Q = hW(), V = zT2(), W = M61(), A = wT2()
        }
        setParent(R) {
          var T, y, v, x, p;
          if (this.parent = R, R) this.options = R.options, this.stringify = R.stringify;
          x = this.children, p = [];
          for (y = 0, v = x.length; y < v; y++) T = x[y], p.push(T.setParent(this));
          return p
        }
        element(R, T, y) {
          var v, x, p, u, e, l, k, m, o;
          if (l = null, T === null && y == null)[T, y] = [{}, null];
          if (T == null) T = {};
          if (T = H(T), !U(T))[y, T] = [T, y];
          if (R != null) R = H(R);
          if (Array.isArray(R))
            for (p = 0, k = R.length; p < k; p++) x = R[p], l = this.element(x);
          else if (E(R)) l = this.element(R.apply());
          else if (U(R))
            for (e in R) {
              if (!q.call(R, e)) continue;
              if (o = R[e], E(o)) o = o.apply();
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && e.indexOf(this.stringify.convertAttKey) === 0) l = this.attribute(e.substr(this.stringify.convertAttKey.length), o);
              else if (!this.options.separateArrayItems && Array.isArray(o) && C(o)) l = this.dummy();
              else if (U(o) && C(o)) l = this.element(e);
              else if (!this.options.keepNullNodes && o == null) l = this.dummy();
              else if (!this.options.separateArrayItems && Array.isArray(o))
                for (u = 0, m = o.length; u < m; u++) x = o[u], v = {}, v[e] = x, l = this.element(v);
              else if (U(o))
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && e.indexOf(this.stringify.convertTextKey) === 0) l = this.element(o);
                else l = this.element(e), l.element(o);
              else l = this.element(e, o)
            } else if (!this.options.keepNullNodes && y === null) l = this.dummy();
            else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && R.indexOf(this.stringify.convertTextKey) === 0) l = this.text(y);
          else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && R.indexOf(this.stringify.convertCDataKey) === 0) l = this.cdata(y);
          else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && R.indexOf(this.stringify.convertCommentKey) === 0) l = this.comment(y);
          else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && R.indexOf(this.stringify.convertRawKey) === 0) l = this.raw(y);
          else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && R.indexOf(this.stringify.convertPIKey) === 0) l = this.instruction(R.substr(this.stringify.convertPIKey.length), y);
          else l = this.node(R, T, y);
          if (l == null) throw Error("Could not create any elements with: " + R + ". " + this.debugInfo());
          return l
        }
        insertBefore(R, T, y) {
          var v, x, p, u, e;
          if (R != null ? R.type : void 0) {
            if (p = R, u = T, p.setParent(this), u) x = children.indexOf(u), e = children.splice(x), children.push(p), Array.prototype.push.apply(children, e);
            else children.push(p);
            return p
          } else {
            if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(R));
            return x = this.parent.children.indexOf(this), e = this.parent.children.splice(x), v = this.parent.element(R, T, y), Array.prototype.push.apply(this.parent.children, e), v
          }
        }
        insertAfter(R, T, y) {
          var v, x, p;
          if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(R));
          return x = this.parent.children.indexOf(this), p = this.parent.children.splice(x + 1), v = this.parent.element(R, T, y), Array.prototype.push.apply(this.parent.children, p), v
        }
        remove() {
          var R, T;
          if (this.isRoot) throw Error("Cannot remove the root element. " + this.debugInfo());
          return R = this.parent.children.indexOf(this), w.apply(this.parent.children, [R, R - R + 1].concat(T = [])), this.parent
        }
        node(R, T, y) {
          var v;
          if (R != null) R = H(R);
          if (T || (T = {}), T = H(T), !U(T))[y, T] = [T, y];
          if (v = new J(this, R, T), y != null) v.text(y);
          return this.children.push(v), v
        }
        text(R) {
          var T;
          if (U(R)) this.element(R);
          return T = new D(this, R), this.children.push(T), this
        }
        cdata(R) {
          var T = new B(this, R);
          return this.children.push(T), this
        }
        comment(R) {
          var T = new G(this, R);
          return this.children.push(T), this
        }
        commentBefore(R) {
          var T, y, v;
          return y = this.parent.children.indexOf(this), v = this.parent.children.splice(y), T = this.parent.comment(R), Array.prototype.push.apply(this.parent.children, v), this
        }
        commentAfter(R) {
          var T, y, v;
          return y = this.parent.children.indexOf(this), v = this.parent.children.splice(y + 1), T = this.parent.comment(R), Array.prototype.push.apply(this.parent.children, v), this
        }
        raw(R) {
          var T = new K(this, R);
          return this.children.push(T), this
        }
        dummy() {
          var R = new Y(this);
          return R
        }
        instruction(R, T) {
          var y, v, x, p, u;
          if (R != null) R = H(R);
          if (T != null) T = H(T);
          if (Array.isArray(R))
            for (p = 0, u = R.length; p < u; p++) y = R[p], this.instruction(y);
          else if (U(R))
            for (y in R) {
              if (!q.call(R, y)) continue;
              v = R[y], this.instruction(y, v)
            } else {
              if (E(T)) T = T.apply();
              x = new F(this, R, T), this.children.push(x)
            }
          return this
        }
        instructionBefore(R, T) {
          var y, v, x;
          return v = this.parent.children.indexOf(this), x = this.parent.children.splice(v), y = this.parent.instruction(R, T), Array.prototype.push.apply(this.parent.children, x), this
        }
        instructionAfter(R, T) {
          var y, v, x;
          return v = this.parent.children.indexOf(this), x = this.parent.children.splice(v + 1), y = this.parent.instruction(R, T), Array.prototype.push.apply(this.parent.children, x), this
        }
        declaration(R, T, y) {
          var v, x;
          if (v = this.document(), x = new Z(v, R, T, y), v.children.length === 0) v.children.unshift(x);
          else if (v.children[0].type === Q.Declaration) v.children[0] = x;
          else v.children.unshift(x);
          return v.root() || v
        }
        dtd(R, T) {
          var y, v, x, p, u, e, l, k, m, o;
          v = this.document(), x = new I(v, R, T), m = v.children;
          for (p = u = 0, l = m.length; u < l; p = ++u)
            if (y = m[p], y.type === Q.DocType) return v.children[p] = x, x;
          o = v.children;
          for (p = e = 0, k = o.length; e < k; p = ++e)
            if (y = o[p], y.isRoot) return v.children.splice(p, 0, x), x;
          return v.children.push(x), x
        }
        up() {
          if (this.isRoot) throw Error("The root node has no parent. Use doc() if you need to get the document object.");
          return this.parent
        }
        root() {
          var R = this;
          while (R)
            if (R.type === Q.Document) return R.rootObject;
            else if (R.isRoot) return R;
          else R = R.parent
        }
        document() {
          var R = this;
          while (R)
            if (R.type === Q.Document) return R;
            else R = R.parent
        }
        end(R) {
          return this.document().end(R)
        }
        prev() {
          var R = this.parent.children.indexOf(this);
          if (R < 1) throw Error("Already at the first node. " + this.debugInfo());
          return this.parent.children[R - 1]
        }
        next() {
          var R = this.parent.children.indexOf(this);
          if (R === -1 || R === this.parent.children.length - 1) throw Error("Already at the last node. " + this.debugInfo());
          return this.parent.children[R + 1]
        }
        importDocument(R) {
          var T, y, v, x, p;
          if (y = R.root().clone(), y.parent = this, y.isRoot = !1, this.children.push(y), this.type === Q.Document) {
            if (y.isRoot = !0, y.documentObject = this, this.rootObject = y, this.children) {
              p = this.children;
              for (v = 0, x = p.length; v < x; v++)
                if (T = p[v], T.type === Q.DocType) {
                  T.name = y.name;
                  break
                }
            }
          }
          return this
        }
        debugInfo(R) {
          var T, y;
          if (R = R || this.name, R == null && !((T = this.parent) != null ? T.name : void 0)) return "";
          else if (R == null) return "parent: <" + this.parent.name + ">";
          else if (!((y = this.parent) != null ? y.name : void 0)) return "node: <" + R + ">";
          else return "node: <" + R + ">, parent: <" + this.parent.name + ">"
        }
        ele(R, T, y) {
          return this.element(R, T, y)
        }
        nod(R, T, y) {
          return this.node(R, T, y)
        }
        txt(R) {
          return this.text(R)
        }
        dat(R) {
          return this.cdata(R)
        }
        com(R) {
          return this.comment(R)
        }
        ins(R, T) {
          return this.instruction(R, T)
        }
        doc() {
          return this.document()
        }
        dec(R, T, y) {
          return this.declaration(R, T, y)
        }
        e(R, T, y) {
          return this.element(R, T, y)
        }
        n(R, T, y) {
          return this.node(R, T, y)
        }
        t(R) {
          return this.text(R)
        }
        d(R) {
          return this.cdata(R)
        }
        c(R) {
          return this.comment(R)
        }
        r(R) {
          return this.raw(R)
        }
        i(R, T) {
          return this.instruction(R, T)
        }
        u() {
          return this.up()
        }
        importXMLBuilder(R) {
          return this.importDocument(R)
        }
        attribute(R, T) {
          throw Error("attribute() applies to element nodes only.")
        }
        att(R, T) {
          return this.attribute(R, T)
        }
        a(R, T) {
          return this.attribute(R, T)
        }
        removeAttribute(R) {
          throw Error("attribute() applies to element nodes only.")
        }
        replaceChild(R, T) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        removeChild(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        appendChild(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        hasChildNodes() {
          return this.children.length !== 0
        }
        cloneNode(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        normalize() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isSupported(R, T) {
          return !0
        }
        hasAttributes() {
          return this.attribs.length !== 0
        }
        compareDocumentPosition(R) {
          var T, y;
          if (T = this, T === R) return 0;
          else if (this.document() !== R.document()) {
            if (y = A.Disconnected | A.ImplementationSpecific, Math.random() < 0.5) y |= A.Preceding;
            else y |= A.Following;
            return y
          } else if (T.isAncestor(R)) return A.Contains | A.Preceding;
          else if (T.isDescendant(R)) return A.Contains | A.Following;
          else if (T.isPreceding(R)) return A.Preceding;
          else return A.Following
        }
        isSameNode(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        lookupPrefix(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isDefaultNamespace(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        lookupNamespaceURI(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        isEqualNode(R) {
          var T, y, v;
          if (R.nodeType !== this.nodeType) return !1;
          if (R.children.length !== this.children.length) return !1;
          for (T = y = 0, v = this.children.length - 1; 0 <= v ? y <= v : y >= v; T = 0 <= v ? ++y : --y)
            if (!this.children[T].isEqualNode(R.children[T])) return !1;
          return !0
        }
        getFeature(R, T) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        setUserData(R, T, y) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getUserData(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        contains(R) {
          if (!R) return !1;
          return R === this || this.isDescendant(R)
        }
        isDescendant(R) {
          var T, y, v, x, p;
          p = this.children;
          for (v = 0, x = p.length; v < x; v++) {
            if (T = p[v], R === T) return !0;
            if (y = T.isDescendant(R), y) return !0
          }
          return !1
        }
        isAncestor(R) {
          return R.isDescendant(this)
        }
        isPreceding(R) {
          var T, y;
          if (T = this.treePosition(R), y = this.treePosition(this), T === -1 || y === -1) return !1;
          else return T < y
        }
        isFollowing(R) {
          var T, y;
          if (T = this.treePosition(R), y = this.treePosition(this), T === -1 || y === -1) return !1;
          else return T > y
        }
        treePosition(R) {
          var T, y;
          if (y = 0, T = !1, this.foreachTreeNode(this.document(), function(v) {
              if (y++, !T && v === R) return T = !0
            }), T) return y;
          else return -1
        }
        foreachTreeNode(R, T) {
          var y, v, x, p, u;
          R || (R = this.document()), p = R.children;
          for (v = 0, x = p.length; v < x; v++)
            if (y = p[v], u = T(y)) return u;
            else if (u = this.foreachTreeNode(y, T), u) return u
        }
      }
      return Object.defineProperty(N.prototype, "nodeName", {
        get: function() {
          return this.name
        }
      }), Object.defineProperty(N.prototype, "nodeType", {
        get: function() {
          return this.type
        }
      }), Object.defineProperty(N.prototype, "nodeValue", {
        get: function() {
          return this.value
        }
      }), Object.defineProperty(N.prototype, "parentNode", {
        get: function() {
          return this.parent
        }
      }), Object.defineProperty(N.prototype, "childNodes", {
        get: function() {
          if (!this.childNodeList || !this.childNodeList.nodes) this.childNodeList = new V(this.children);
          return this.childNodeList
        }
      }), Object.defineProperty(N.prototype, "firstChild", {
        get: function() {
          return this.children[0] || null
        }
      }), Object.defineProperty(N.prototype, "lastChild", {
        get: function() {
          return this.children[this.children.length - 1] || null
        }
      }), Object.defineProperty(N.prototype, "previousSibling", {
        get: function() {
          var R = this.parent.children.indexOf(this);
          return this.parent.children[R - 1] || null
        }
      }), Object.defineProperty(N.prototype, "nextSibling", {
        get: function() {
          var R = this.parent.children.indexOf(this);
          return this.parent.children[R + 1] || null
        }
      }), Object.defineProperty(N.prototype, "ownerDocument", {
        get: function() {
          return this.document() || null
        }
      }), Object.defineProperty(N.prototype, "textContent", {
        get: function() {
          var R, T, y, v, x;
          if (this.nodeType === Q.Element || this.nodeType === Q.DocumentFragment) {
            x = "", v = this.children;
            for (T = 0, y = v.length; T < y; T++)
              if (R = v[T], R.textContent) x += R.textContent;
            return x
          } else return null
        },
        set: function(R) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
      }), N
    }.call(this)
  }).call(qT2)
})
// @from(Start 11356547, End 11362376)
s80 = z((LT2, MT2) => {
  (function() {
    var A, Q = {}.hasOwnProperty;
    MT2.exports = A = function() {
      class B {
        constructor(G) {
          var Z, I, Y;
          if (this.assertLegalChar = this.assertLegalChar.bind(this), this.assertLegalName = this.assertLegalName.bind(this), G || (G = {}), this.options = G, !this.options.version) this.options.version = "1.0";
          I = G.stringify || {};
          for (Z in I) {
            if (!Q.call(I, Z)) continue;
            Y = I[Z], this[Z] = Y
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
          var Z, I;
          if (this.options.noValidation) return G;
          if (this.options.version === "1.0") {
            if (Z = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) G = G.replace(Z, this.options.invalidCharReplacement);
            else if (I = G.match(Z)) throw Error(`Invalid character in string: ${G} at index ${I.index}`)
          } else if (this.options.version === "1.1") {
            if (Z = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) G = G.replace(Z, this.options.invalidCharReplacement);
            else if (I = G.match(Z)) throw Error(`Invalid character in string: ${G} at index ${I.index}`)
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
  }).call(LT2)
})
// @from(Start 11362382, End 11362536)
jRA = z((OT2, RT2) => {
  (function() {
    RT2.exports = {
      None: 0,
      OpenTag: 1,
      InsideTag: 2,
      CloseTag: 3
    }
  }).call(OT2)
})
// @from(Start 11362542, End 11372731)
r80 = z((TT2, PT2) => {
  (function() {
    var A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H, C, E, U = {}.hasOwnProperty;
    ({
      assign: E
    } = Uy()), A = hW(), W = P61(), X = y61(), B = R61(), G = T61(), F = O61(), D = x61(), H = v61(), K = b61(), V = a80(), Z = j61(), I = _61(), Y = S61(), J = k61(), Q = jRA(), PT2.exports = C = class {
      constructor(w) {
        var N, R, T;
        w || (w = {}), this.options = w, R = w.writer || {};
        for (N in R) {
          if (!U.call(R, N)) continue;
          T = R[N], this["_" + N] = this[N], this[N] = T
        }
      }
      filterOptions(w) {
        var N, R, T, y, v, x, p, u, e;
        if (w || (w = {}), w = E({}, this.options, w), N = {
            writer: this
          }, N.pretty = w.pretty || !1, N.allowEmpty = w.allowEmpty || !1, N.indent = (R = w.indent) != null ? R : "  ", N.newline = (T = w.newline) != null ? T : `
`, N.offset = (y = w.offset) != null ? y : 0, N.width = (v = w.width) != null ? v : 0, N.dontPrettyTextNodes = (x = (p = w.dontPrettyTextNodes) != null ? p : w.dontprettytextnodes) != null ? x : 0, N.spaceBeforeSlash = (u = (e = w.spaceBeforeSlash) != null ? e : w.spacebeforeslash) != null ? u : "", N.spaceBeforeSlash === !0) N.spaceBeforeSlash = " ";
        return N.suppressPrettyCount = 0, N.user = {}, N.state = Q.None, N
      }
      indent(w, N, R) {
        var T;
        if (!N.pretty || N.suppressPrettyCount) return "";
        else if (N.pretty) {
          if (T = (R || 0) + N.offset + 1, T > 0) return Array(T).join(N.indent)
        }
        return ""
      }
      endline(w, N, R) {
        if (!N.pretty || N.suppressPrettyCount) return "";
        else return N.newline
      }
      attribute(w, N, R) {
        var T;
        if (this.openAttribute(w, N, R), N.pretty && N.width > 0) T = w.name + '="' + w.value + '"';
        else T = " " + w.name + '="' + w.value + '"';
        return this.closeAttribute(w, N, R), T
      }
      cdata(w, N, R) {
        var T;
        return this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<![CDATA[", N.state = Q.InsideTag, T += w.value, N.state = Q.CloseTag, T += "]]>" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      comment(w, N, R) {
        var T;
        return this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<!-- ", N.state = Q.InsideTag, T += w.value, N.state = Q.CloseTag, T += " -->" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      declaration(w, N, R) {
        var T;
        if (this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<?xml", N.state = Q.InsideTag, T += ' version="' + w.version + '"', w.encoding != null) T += ' encoding="' + w.encoding + '"';
        if (w.standalone != null) T += ' standalone="' + w.standalone + '"';
        return N.state = Q.CloseTag, T += N.spaceBeforeSlash + "?>", T += this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      docType(w, N, R) {
        var T, y, v, x, p;
        if (R || (R = 0), this.openNode(w, N, R), N.state = Q.OpenTag, x = this.indent(w, N, R), x += "<!DOCTYPE " + w.root().name, w.pubID && w.sysID) x += ' PUBLIC "' + w.pubID + '" "' + w.sysID + '"';
        else if (w.sysID) x += ' SYSTEM "' + w.sysID + '"';
        if (w.children.length > 0) {
          x += " [", x += this.endline(w, N, R), N.state = Q.InsideTag, p = w.children;
          for (y = 0, v = p.length; y < v; y++) T = p[y], x += this.writeChildNode(T, N, R + 1);
          N.state = Q.CloseTag, x += "]"
        }
        return N.state = Q.CloseTag, x += N.spaceBeforeSlash + ">", x += this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), x
      }
      element(w, N, R) {
        var T, y, v, x, p, u, e, l, k, m, o, IA, FA, zA, NA, OA, mA, wA, qA;
        if (R || (R = 0), IA = !1, this.openNode(w, N, R), N.state = Q.OpenTag, FA = this.indent(w, N, R) + "<" + w.name, N.pretty && N.width > 0) {
          l = FA.length, NA = w.attribs;
          for (o in NA) {
            if (!U.call(NA, o)) continue;
            if (T = NA[o], zA = this.attribute(T, N, R), y = zA.length, l + y > N.width) qA = this.indent(w, N, R + 1) + zA, FA += this.endline(w, N, R) + qA, l = qA.length;
            else qA = " " + zA, FA += qA, l += qA.length
          }
        } else {
          OA = w.attribs;
          for (o in OA) {
            if (!U.call(OA, o)) continue;
            T = OA[o], FA += this.attribute(T, N, R)
          }
        }
        if (x = w.children.length, p = x === 0 ? null : w.children[0], x === 0 || w.children.every(function(KA) {
            return (KA.type === A.Text || KA.type === A.Raw || KA.type === A.CData) && KA.value === ""
          }))
          if (N.allowEmpty) FA += ">", N.state = Q.CloseTag, FA += "</" + w.name + ">" + this.endline(w, N, R);
          else N.state = Q.CloseTag, FA += N.spaceBeforeSlash + "/>" + this.endline(w, N, R);
        else if (N.pretty && x === 1 && (p.type === A.Text || p.type === A.Raw || p.type === A.CData) && p.value != null) FA += ">", N.state = Q.InsideTag, N.suppressPrettyCount++, IA = !0, FA += this.writeChildNode(p, N, R + 1), N.suppressPrettyCount--, IA = !1, N.state = Q.CloseTag, FA += "</" + w.name + ">" + this.endline(w, N, R);
        else {
          if (N.dontPrettyTextNodes) {
            mA = w.children;
            for (u = 0, k = mA.length; u < k; u++)
              if (v = mA[u], (v.type === A.Text || v.type === A.Raw || v.type === A.CData) && v.value != null) {
                N.suppressPrettyCount++, IA = !0;
                break
              }
          }
          FA += ">" + this.endline(w, N, R), N.state = Q.InsideTag, wA = w.children;
          for (e = 0, m = wA.length; e < m; e++) v = wA[e], FA += this.writeChildNode(v, N, R + 1);
          if (N.state = Q.CloseTag, FA += this.indent(w, N, R) + "</" + w.name + ">", IA) N.suppressPrettyCount--;
          FA += this.endline(w, N, R), N.state = Q.None
        }
        return this.closeNode(w, N, R), FA
      }
      writeChildNode(w, N, R) {
        switch (w.type) {
          case A.CData:
            return this.cdata(w, N, R);
          case A.Comment:
            return this.comment(w, N, R);
          case A.Element:
            return this.element(w, N, R);
          case A.Raw:
            return this.raw(w, N, R);
          case A.Text:
            return this.text(w, N, R);
          case A.ProcessingInstruction:
            return this.processingInstruction(w, N, R);
          case A.Dummy:
            return "";
          case A.Declaration:
            return this.declaration(w, N, R);
          case A.DocType:
            return this.docType(w, N, R);
          case A.AttributeDeclaration:
            return this.dtdAttList(w, N, R);
          case A.ElementDeclaration:
            return this.dtdElement(w, N, R);
          case A.EntityDeclaration:
            return this.dtdEntity(w, N, R);
          case A.NotationDeclaration:
            return this.dtdNotation(w, N, R);
          default:
            throw Error("Unknown XML node type: " + w.constructor.name)
        }
      }
      processingInstruction(w, N, R) {
        var T;
        if (this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<?", N.state = Q.InsideTag, T += w.target, w.value) T += " " + w.value;
        return N.state = Q.CloseTag, T += N.spaceBeforeSlash + "?>", T += this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      raw(w, N, R) {
        var T;
        return this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R), N.state = Q.InsideTag, T += w.value, N.state = Q.CloseTag, T += this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      text(w, N, R) {
        var T;
        return this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R), N.state = Q.InsideTag, T += w.value, N.state = Q.CloseTag, T += this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      dtdAttList(w, N, R) {
        var T;
        if (this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<!ATTLIST", N.state = Q.InsideTag, T += " " + w.elementName + " " + w.attributeName + " " + w.attributeType, w.defaultValueType !== "#DEFAULT") T += " " + w.defaultValueType;
        if (w.defaultValue) T += ' "' + w.defaultValue + '"';
        return N.state = Q.CloseTag, T += N.spaceBeforeSlash + ">" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      dtdElement(w, N, R) {
        var T;
        return this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<!ELEMENT", N.state = Q.InsideTag, T += " " + w.name + " " + w.value, N.state = Q.CloseTag, T += N.spaceBeforeSlash + ">" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      dtdEntity(w, N, R) {
        var T;
        if (this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<!ENTITY", N.state = Q.InsideTag, w.pe) T += " %";
        if (T += " " + w.name, w.value) T += ' "' + w.value + '"';
        else {
          if (w.pubID && w.sysID) T += ' PUBLIC "' + w.pubID + '" "' + w.sysID + '"';
          else if (w.sysID) T += ' SYSTEM "' + w.sysID + '"';
          if (w.nData) T += " NDATA " + w.nData
        }
        return N.state = Q.CloseTag, T += N.spaceBeforeSlash + ">" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      dtdNotation(w, N, R) {
        var T;
        if (this.openNode(w, N, R), N.state = Q.OpenTag, T = this.indent(w, N, R) + "<!NOTATION", N.state = Q.InsideTag, T += " " + w.name, w.pubID && w.sysID) T += ' PUBLIC "' + w.pubID + '" "' + w.sysID + '"';
        else if (w.pubID) T += ' PUBLIC "' + w.pubID + '"';
        else if (w.sysID) T += ' SYSTEM "' + w.sysID + '"';
        return N.state = Q.CloseTag, T += N.spaceBeforeSlash + ">" + this.endline(w, N, R), N.state = Q.None, this.closeNode(w, N, R), T
      }
      openNode(w, N, R) {}
      closeNode(w, N, R) {}
      openAttribute(w, N, R) {}
      closeAttribute(w, N, R) {}
    }
  }).call(TT2)
})
// @from(Start 11372737, End 11373239)
f61 = z((jT2, ST2) => {
  (function() {
    var A, Q;
    Q = r80(), ST2.exports = A = class extends Q {
      constructor(G) {
        super(G)
      }
      document(G, Z) {
        var I, Y, J, W, X;
        Z = this.filterOptions(Z), W = "", X = G.children;
        for (Y = 0, J = X.length; Y < J; Y++) I = X[Y], W += this.writeChildNode(I, Z, 0);
        if (Z.pretty && W.slice(-Z.newline.length) === Z.newline) W = W.slice(0, -Z.newline.length);
        return W
      }
    }
  }).call(jT2)
})
// @from(Start 11373245, End 11378902)
o80 = z((_T2, kT2) => {
  (function() {
    var A, Q, B, G, Z, I, Y, J;
    ({
      isPlainObject: J
    } = Uy()), B = i80(), Q = xR2(), Z = Tq(), A = hW(), Y = s80(), I = f61(), kT2.exports = G = function() {
      class W extends Z {
        constructor(X) {
          super(null);
          if (this.name = "#document", this.type = A.Document, this.documentURI = null, this.domConfig = new Q, X || (X = {}), !X.writer) X.writer = new I;
          this.options = X, this.stringify = new Y(X)
        }
        end(X) {
          var V = {};
          if (!X) X = this.options.writer;
          else if (J(X)) V = X, X = this.options.writer;
          return X.document(this, X.filterOptions(V))
        }
        toString(X) {
          return this.options.writer.document(this, this.options.writer.filterOptions(X))
        }
        createElement(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createDocumentFragment() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createTextNode(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createComment(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createCDATASection(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createProcessingInstruction(X, V) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createAttribute(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createEntityReference(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByTagName(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        importNode(X, V) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createElementNS(X, V) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createAttributeNS(X, V) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByTagNameNS(X, V) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementById(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        adoptNode(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        normalizeDocument() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        renameNode(X, V, F) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        getElementsByClassName(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createEvent(X) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createRange() {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createNodeIterator(X, V, F) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
        createTreeWalker(X, V, F) {
          throw Error("This DOM method is not implemented." + this.debugInfo())
        }
      }
      return Object.defineProperty(W.prototype, "implementation", {
        value: new B
      }), Object.defineProperty(W.prototype, "doctype", {
        get: function() {
          var X, V, F, K;
          K = this.children;
          for (V = 0, F = K.length; V < F; V++)
            if (X = K[V], X.type === A.DocType) return X;
          return null
        }
      }), Object.defineProperty(W.prototype, "documentElement", {
        get: function() {
          return this.rootObject || null
        }
      }), Object.defineProperty(W.prototype, "inputEncoding", {
        get: function() {
          return null
        }
      }), Object.defineProperty(W.prototype, "strictErrorChecking", {
        get: function() {
          return !1
        }
      }), Object.defineProperty(W.prototype, "xmlEncoding", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].encoding;
          else return null
        }
      }), Object.defineProperty(W.prototype, "xmlStandalone", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].standalone === "yes";
          else return !1
        }
      }), Object.defineProperty(W.prototype, "xmlVersion", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].version;
          else return "1.0"
        }
      }), Object.defineProperty(W.prototype, "URL", {
        get: function() {
          return this.documentURI
        }
      }), Object.defineProperty(W.prototype, "origin", {
        get: function() {
          return null
        }
      }), Object.defineProperty(W.prototype, "compatMode", {
        get: function() {
          return null
        }
      }), Object.defineProperty(W.prototype, "characterSet", {
        get: function() {
          return null
        }
      }), Object.defineProperty(W.prototype, "contentType", {
        get: function() {
          return null
        }
      }), W
    }.call(this)
  }).call(_T2)
})
// @from(Start 11378908, End 11390376)
vT2 = z((yT2, xT2) => {
  (function() {
    var A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H, C, E, U, q, w, N, R, T, y = {}.hasOwnProperty;
    ({
      isObject: R,
      isFunction: N,
      isPlainObject: T,
      getValue: w
    } = Uy()), A = hW(), F = o80(), D = O61(), G = R61(), Z = T61(), C = x61(), q = v61(), H = b61(), X = P61(), V = y61(), I = j61(), J = S61(), Y = _61(), W = k61(), B = n80(), U = s80(), E = f61(), Q = jRA(), xT2.exports = K = class {
      constructor(x, p, u) {
        var e;
        if (this.name = "?xml", this.type = A.Document, x || (x = {}), e = {}, !x.writer) x.writer = new E;
        else if (T(x.writer)) e = x.writer, x.writer = new E;
        this.options = x, this.writer = x.writer, this.writerOptions = this.writer.filterOptions(e), this.stringify = new U(x), this.onDataCallback = p || function() {}, this.onEndCallback = u || function() {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
      }
      createChildNode(x) {
        var p, u, e, l, k, m, o, IA;
        switch (x.type) {
          case A.CData:
            this.cdata(x.value);
            break;
          case A.Comment:
            this.comment(x.value);
            break;
          case A.Element:
            e = {}, o = x.attribs;
            for (u in o) {
              if (!y.call(o, u)) continue;
              p = o[u], e[u] = p.value
            }
            this.node(x.name, e);
            break;
          case A.Dummy:
            this.dummy();
            break;
          case A.Raw:
            this.raw(x.value);
            break;
          case A.Text:
            this.text(x.value);
            break;
          case A.ProcessingInstruction:
            this.instruction(x.target, x.value);
            break;
          default:
            throw Error("This XML node type is not supported in a JS object: " + x.constructor.name)
        }
        IA = x.children;
        for (k = 0, m = IA.length; k < m; k++)
          if (l = IA[k], this.createChildNode(l), l.type === A.Element) this.up();
        return this
      }
      dummy() {
        return this
      }
      node(x, p, u) {
        if (x == null) throw Error("Missing node name.");
        if (this.root && this.currentLevel === -1) throw Error("Document can only have one root node. " + this.debugInfo(x));
        if (this.openCurrent(), x = w(x), p == null) p = {};
        if (p = w(p), !R(p))[u, p] = [p, u];
        if (this.currentNode = new D(this, x, p), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, u != null) this.text(u);
        return this
      }
      element(x, p, u) {
        var e, l, k, m, o, IA;
        if (this.currentNode && this.currentNode.type === A.DocType) this.dtdElement(...arguments);
        else if (Array.isArray(x) || R(x) || N(x)) {
          m = this.options.noValidation, this.options.noValidation = !0, IA = new F(this.options).element("TEMP_ROOT"), IA.element(x), this.options.noValidation = m, o = IA.children;
          for (l = 0, k = o.length; l < k; l++)
            if (e = o[l], this.createChildNode(e), e.type === A.Element) this.up()
        } else this.node(x, p, u);
        return this
      }
      attribute(x, p) {
        var u, e;
        if (!this.currentNode || this.currentNode.children) throw Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(x));
        if (x != null) x = w(x);
        if (R(x))
          for (u in x) {
            if (!y.call(x, u)) continue;
            e = x[u], this.attribute(u, e)
          } else {
            if (N(p)) p = p.apply();
            if (this.options.keepNullAttributes && p == null) this.currentNode.attribs[x] = new B(this, x, "");
            else if (p != null) this.currentNode.attribs[x] = new B(this, x, p)
          }
        return this
      }
      text(x) {
        var p;
        return this.openCurrent(), p = new q(this, x), this.onData(this.writer.text(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      cdata(x) {
        var p;
        return this.openCurrent(), p = new G(this, x), this.onData(this.writer.cdata(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      comment(x) {
        var p;
        return this.openCurrent(), p = new Z(this, x), this.onData(this.writer.comment(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      raw(x) {
        var p;
        return this.openCurrent(), p = new C(this, x), this.onData(this.writer.raw(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      instruction(x, p) {
        var u, e, l, k, m;
        if (this.openCurrent(), x != null) x = w(x);
        if (p != null) p = w(p);
        if (Array.isArray(x))
          for (u = 0, k = x.length; u < k; u++) e = x[u], this.instruction(e);
        else if (R(x))
          for (e in x) {
            if (!y.call(x, e)) continue;
            l = x[e], this.instruction(e, l)
          } else {
            if (N(p)) p = p.apply();
            m = new H(this, x, p), this.onData(this.writer.processingInstruction(m, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1)
          }
        return this
      }
      declaration(x, p, u) {
        var e;
        if (this.openCurrent(), this.documentStarted) throw Error("declaration() must be the first node.");
        return e = new X(this, x, p, u), this.onData(this.writer.declaration(e, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      doctype(x, p, u) {
        if (this.openCurrent(), x == null) throw Error("Missing root node name.");
        if (this.root) throw Error("dtd() must come before the root node.");
        return this.currentNode = new V(this, p, u), this.currentNode.rootNodeName = x, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
      }
      dtdElement(x, p) {
        var u;
        return this.openCurrent(), u = new Y(this, x, p), this.onData(this.writer.dtdElement(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      attList(x, p, u, e, l) {
        var k;
        return this.openCurrent(), k = new I(this, x, p, u, e, l), this.onData(this.writer.dtdAttList(k, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      entity(x, p) {
        var u;
        return this.openCurrent(), u = new J(this, !1, x, p), this.onData(this.writer.dtdEntity(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      pEntity(x, p) {
        var u;
        return this.openCurrent(), u = new J(this, !0, x, p), this.onData(this.writer.dtdEntity(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
      }
      notation(x, p) {
        var u;
        return this.openCurrent(), u = new W(this, x, p), this.onData(this.writer.dtdNotation(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
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
      openNode(x) {
        var p, u, e, l;
        if (!x.isOpen) {
          if (!this.root && this.currentLevel === 0 && x.type === A.Element) this.root = x;
          if (u = "", x.type === A.Element) {
            this.writerOptions.state = Q.OpenTag, u = this.writer.indent(x, this.writerOptions, this.currentLevel) + "<" + x.name, l = x.attribs;
            for (e in l) {
              if (!y.call(l, e)) continue;
              p = l[e], u += this.writer.attribute(p, this.writerOptions, this.currentLevel)
            }
            u += (x.children ? ">" : "/>") + this.writer.endline(x, this.writerOptions, this.currentLevel), this.writerOptions.state = Q.InsideTag
          } else {
            if (this.writerOptions.state = Q.OpenTag, u = this.writer.indent(x, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + x.rootNodeName, x.pubID && x.sysID) u += ' PUBLIC "' + x.pubID + '" "' + x.sysID + '"';
            else if (x.sysID) u += ' SYSTEM "' + x.sysID + '"';
            if (x.children) u += " [", this.writerOptions.state = Q.InsideTag;
            else this.writerOptions.state = Q.CloseTag, u += ">";
            u += this.writer.endline(x, this.writerOptions, this.currentLevel)
          }
          return this.onData(u, this.currentLevel), x.isOpen = !0
        }
      }
      closeNode(x) {
        var p;
        if (!x.isClosed) {
          if (p = "", this.writerOptions.state = Q.CloseTag, x.type === A.Element) p = this.writer.indent(x, this.writerOptions, this.currentLevel) + "</" + x.name + ">" + this.writer.endline(x, this.writerOptions, this.currentLevel);
          else p = this.writer.indent(x, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(x, this.writerOptions, this.currentLevel);
          return this.writerOptions.state = Q.None, this.onData(p, this.currentLevel), x.isClosed = !0
        }
      }
      onData(x, p) {
        return this.documentStarted = !0, this.onDataCallback(x, p + 1)
      }
      onEnd() {
        return this.documentCompleted = !0, this.onEndCallback()
      }
      debugInfo(x) {
        if (x == null) return "";
        else return "node: <" + x + ">"
      }
      ele() {
        return this.element(...arguments)
      }
      nod(x, p, u) {
        return this.node(x, p, u)
      }
      txt(x) {
        return this.text(x)
      }
      dat(x) {
        return this.cdata(x)
      }
      com(x) {
        return this.comment(x)
      }
      ins(x, p) {
        return this.instruction(x, p)
      }
      dec(x, p, u) {
        return this.declaration(x, p, u)
      }
      dtd(x, p, u) {
        return this.doctype(x, p, u)
      }
      e(x, p, u) {
        return this.element(x, p, u)
      }
      n(x, p, u) {
        return this.node(x, p, u)
      }
      t(x) {
        return this.text(x)
      }
      d(x) {
        return this.cdata(x)
      }
      c(x) {
        return this.comment(x)
      }
      r(x) {
        return this.raw(x)
      }
      i(x, p) {
        return this.instruction(x, p)
      }
      att() {
        if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
        else return this.attribute(...arguments)
      }
      a() {
        if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
        else return this.attribute(...arguments)
      }
      ent(x, p) {
        return this.entity(x, p)
      }
      pent(x, p) {
        return this.pEntity(x, p)
      }
      not(x, p) {
        return this.notation(x, p)
      }
    }
  }).call(yT2)
})
// @from(Start 11390382, End 11394882)
hT2 = z((bT2, fT2) => {
  (function() {
    var A, Q, B, G, Z = {}.hasOwnProperty;
    A = hW(), G = r80(), Q = jRA(), fT2.exports = B = class extends G {
      constructor(Y, J) {
        super(J);
        this.stream = Y
      }
      endline(Y, J, W) {
        if (Y.isLastRootNode && J.state === Q.CloseTag) return "";
        else return super.endline(Y, J, W)
      }
      document(Y, J) {
        var W, X, V, F, K, D, H, C, E;
        H = Y.children;
        for (X = V = 0, K = H.length; V < K; X = ++V) W = H[X], W.isLastRootNode = X === Y.children.length - 1;
        J = this.filterOptions(J), C = Y.children, E = [];
        for (F = 0, D = C.length; F < D; F++) W = C[F], E.push(this.writeChildNode(W, J, 0));
        return E
      }
      cdata(Y, J, W) {
        return this.stream.write(super.cdata(Y, J, W))
      }
      comment(Y, J, W) {
        return this.stream.write(super.comment(Y, J, W))
      }
      declaration(Y, J, W) {
        return this.stream.write(super.declaration(Y, J, W))
      }
      docType(Y, J, W) {
        var X, V, F, K;
        if (W || (W = 0), this.openNode(Y, J, W), J.state = Q.OpenTag, this.stream.write(this.indent(Y, J, W)), this.stream.write("<!DOCTYPE " + Y.root().name), Y.pubID && Y.sysID) this.stream.write(' PUBLIC "' + Y.pubID + '" "' + Y.sysID + '"');
        else if (Y.sysID) this.stream.write(' SYSTEM "' + Y.sysID + '"');
        if (Y.children.length > 0) {
          this.stream.write(" ["), this.stream.write(this.endline(Y, J, W)), J.state = Q.InsideTag, K = Y.children;
          for (V = 0, F = K.length; V < F; V++) X = K[V], this.writeChildNode(X, J, W + 1);
          J.state = Q.CloseTag, this.stream.write("]")
        }
        return J.state = Q.CloseTag, this.stream.write(J.spaceBeforeSlash + ">"), this.stream.write(this.endline(Y, J, W)), J.state = Q.None, this.closeNode(Y, J, W)
      }
      element(Y, J, W) {
        var X, V, F, K, D, H, C, E, U, q, w, N, R, T, y, v;
        if (W || (W = 0), this.openNode(Y, J, W), J.state = Q.OpenTag, w = this.indent(Y, J, W) + "<" + Y.name, J.pretty && J.width > 0) {
          C = w.length, R = Y.attribs;
          for (U in R) {
            if (!Z.call(R, U)) continue;
            if (X = R[U], N = this.attribute(X, J, W), V = N.length, C + V > J.width) v = this.indent(Y, J, W + 1) + N, w += this.endline(Y, J, W) + v, C = v.length;
            else v = " " + N, w += v, C += v.length
          }
        } else {
          T = Y.attribs;
          for (U in T) {
            if (!Z.call(T, U)) continue;
            X = T[U], w += this.attribute(X, J, W)
          }
        }
        if (this.stream.write(w), K = Y.children.length, D = K === 0 ? null : Y.children[0], K === 0 || Y.children.every(function(x) {
            return (x.type === A.Text || x.type === A.Raw || x.type === A.CData) && x.value === ""
          }))
          if (J.allowEmpty) this.stream.write(">"), J.state = Q.CloseTag, this.stream.write("</" + Y.name + ">");
          else J.state = Q.CloseTag, this.stream.write(J.spaceBeforeSlash + "/>");
        else if (J.pretty && K === 1 && (D.type === A.Text || D.type === A.Raw || D.type === A.CData) && D.value != null) this.stream.write(">"), J.state = Q.InsideTag, J.suppressPrettyCount++, q = !0, this.writeChildNode(D, J, W + 1), J.suppressPrettyCount--, q = !1, J.state = Q.CloseTag, this.stream.write("</" + Y.name + ">");
        else {
          this.stream.write(">" + this.endline(Y, J, W)), J.state = Q.InsideTag, y = Y.children;
          for (H = 0, E = y.length; H < E; H++) F = y[H], this.writeChildNode(F, J, W + 1);
          J.state = Q.CloseTag, this.stream.write(this.indent(Y, J, W) + "</" + Y.name + ">")
        }
        return this.stream.write(this.endline(Y, J, W)), J.state = Q.None, this.closeNode(Y, J, W)
      }
      processingInstruction(Y, J, W) {
        return this.stream.write(super.processingInstruction(Y, J, W))
      }
      raw(Y, J, W) {
        return this.stream.write(super.raw(Y, J, W))
      }
      text(Y, J, W) {
        return this.stream.write(super.text(Y, J, W))
      }
      dtdAttList(Y, J, W) {
        return this.stream.write(super.dtdAttList(Y, J, W))
      }
      dtdElement(Y, J, W) {
        return this.stream.write(super.dtdElement(Y, J, W))
      }
      dtdEntity(Y, J, W) {
        return this.stream.write(super.dtdEntity(Y, J, W))
      }
      dtdNotation(Y, J, W) {
        return this.stream.write(super.dtdNotation(Y, J, W))
      }
    }
  }).call(bT2)
})
// @from(Start 11394888, End 11395750)
uT2 = z((gT2, Xn) => {
  (function() {
    var A, Q, B, G, Z, I, Y, J, W;
    ({
      assign: J,
      isFunction: W
    } = Uy()), B = i80(), G = o80(), Z = vT2(), Y = f61(), I = hT2(), A = hW(), Q = jRA(), gT2.create = function(X, V, F, K) {
      var D, H;
      if (X == null) throw Error("Root element needs a name.");
      if (K = J({}, V, F, K), D = new G(K), H = D.element(X), !K.headless) {
        if (D.declaration(K), K.pubID != null || K.sysID != null) D.dtd(K)
      }
      return H
    }, gT2.begin = function(X, V, F) {
      if (W(X))[V, F] = [X, V], X = {};
      if (V) return new Z(X, V, F);
      else return new G(X)
    }, gT2.stringWriter = function(X) {
      return new Y(X)
    }, gT2.streamWriter = function(X, V) {
      return new I(X, V)
    }, gT2.implementation = new B, gT2.nodeType = A, gT2.writerState = Q
  }).call(gT2)
})
// @from(Start 11395756, End 11397660)
cT2 = z((Nf5) => {
  var mT2 = Nl1(),
    Uf5 = uT2();
  Nf5.build = qf5;

  function $f5(A) {
    function Q(B) {
      return B < 10 ? "0" + B : B
    }
    return A.getUTCFullYear() + "-" + Q(A.getUTCMonth() + 1) + "-" + Q(A.getUTCDate()) + "T" + Q(A.getUTCHours()) + ":" + Q(A.getUTCMinutes()) + ":" + Q(A.getUTCSeconds()) + "Z"
  }
  var wf5 = Object.prototype.toString;

  function dT2(A) {
    var Q = wf5.call(A).match(/\[object (.*)\]/);
    return Q ? Q[1] : Q
  }

  function qf5(A, Q) {
    var B = {
        version: "1.0",
        encoding: "UTF-8"
      },
      G = {
        pubid: "-//Apple//DTD PLIST 1.0//EN",
        sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
      },
      Z = Uf5.create("plist");
    if (Z.dec(B.version, B.encoding, B.standalone), Z.dtd(G.pubid, G.sysid), Z.att("version", "1.0"), t80(A, Z), !Q) Q = {};
    return Q.pretty = Q.pretty !== !1, Z.end(Q)
  }

  function t80(A, Q) {
    var B, G, Z, I = dT2(A);
    if (I == "Undefined") return;
    else if (Array.isArray(A)) {
      Q = Q.ele("array");
      for (G = 0; G < A.length; G++) t80(A[G], Q)
    } else if (Buffer.isBuffer(A)) Q.ele("data").raw(A.toString("base64"));
    else if (I == "Object") {
      Q = Q.ele("dict");
      for (Z in A)
        if (A.hasOwnProperty(Z)) Q.ele("key").txt(Z), t80(A[Z], Q)
    } else if (I == "Number") B = A % 1 === 0 ? "integer" : "real", Q.ele(B).txt(A.toString());
    else if (I == "BigInt") Q.ele("integer").txt(A);
    else if (I == "Date") Q.ele("date").txt($f5(new Date(A)));
    else if (I == "Boolean") Q.ele(A ? "true" : "false");
    else if (I == "String") Q.ele("string").txt(A);
    else if (I == "ArrayBuffer") Q.ele("data").raw(mT2.fromByteArray(A));
    else if (A && A.buffer && dT2(A.buffer) == "ArrayBuffer") Q.ele("data").raw(mT2.fromByteArray(new Uint8Array(A.buffer), Q));
    else if (I === "Null") Q.ele("null").txt("")
  }
})
// @from(Start 11397666, End 11397858)
iT2 = z((e80) => {
  var pT2 = NR2();
  Object.keys(pT2).forEach(function(A) {
    e80[A] = pT2[A]
  });
  var lT2 = cT2();
  Object.keys(lT2).forEach(function(A) {
    e80[A] = lT2[A]
  })
})
// @from(Start 11397861, End 11398006)
function A60({
  message: A,
  title: Q
}) {
  let B = Q ? `${Q}:
${A}` : A;
  try {
    process.stdout.write(`\x1B]9;

${B}\x07`)
  } catch {}
}
// @from(Start 11398008, End 11398318)
function nT2({
  message: A,
  title: Q
}) {
  try {
    let B = Math.floor(Math.random() * 1e4);
    process.stdout.write(`\x1B]99;i=${B}:d=0:p=title;${Q||"Claude Code"}\x1B\\`), process.stdout.write(`\x1B]99;i=${B}:p=body;${A}\x1B\\`), process.stdout.write(`\x1B]99;i=${B}:d=1:a=focus;\x1B\\`)
  } catch {}
}
// @from(Start 11398320, End 11398477)
function Mf5({
  message: A,
  title: Q
}) {
  try {
    let B = Q || "Claude Code";
    process.stdout.write(`\x1B]777;notify;${B};${A}\x07`)
  } catch {}
}
// @from(Start 11398479, End 11398528)
function Q60() {
  process.stdout.write("\x07")
}
// @from(Start 11398529, End 11399073)
async function Of5() {
  try {
    if (d0.terminal !== "Apple_Terminal") return !1;
    let Q = (await QQ("osascript", ["-e", 'tell application "Terminal" to name of current settings of front window'])).stdout.trim();
    if (!Q) return !1;
    let B = await QQ("defaults", ["export", "com.apple.Terminal", "-"]);
    if (B.code !== 0) return !1;
    let I = aT2.default.parse(B.stdout)?.["Window Settings"]?.[Q];
    if (!I) return !1;
    return I.Bell === !1
  } catch (A) {
    return AA(A instanceof Error ? A : Error(String(A))), !1
  }
}
// @from(Start 11399074, End 11400045)
async function E0A(A) {
  let B = N1().preferredNotifChannel,
    G = "none";
  switch (await B60(A), B) {
    case "auto":
      if (d0.terminal === "Apple_Terminal")
        if (await Of5()) Q60(), G = "terminal_bell";
        else G = "no_method_available";
      else if (d0.terminal === "iTerm.app") A60(A), G = "iterm2";
      else if (d0.terminal === "kitty") nT2(A), G = "kitty";
      else if (d0.terminal === "ghostty") Mf5(A), G = "ghostty";
      else G = "no_method_available";
      break;
    case "iterm2":
      A60(A), G = "iterm2";
      break;
    case "terminal_bell":
      Q60(), G = "terminal_bell";
      break;
    case "iterm2_with_bell":
      A60(A), Q60(), G = "iterm2_with_bell";
      break;
    case "kitty":
      nT2(A), G = "kitty";
      break;
    case "notifications_disabled":
      G = "disabled";
      break
  }
  GA("tengu_notification_method_used", {
    configured_channel: B,
    method_used: G,
    term: d0.terminal
  })
}
// @from(Start 11400050, End 11400053)
aT2
// @from(Start 11400059, End 11400146)
h61 = L(() => {
  jQ();
  _8();
  q0();
  c5();
  g1();
  YO();
  aT2 = BA(iT2(), 1)
})
// @from(Start 11400148, End 11400627)
async function sT2(A, Q, B) {
  try {
    let G = DI();
    if (G.error) return;
    let Z = {
        "Content-Type": "application/json",
        "User-Agent": TV(),
        ...G.headers
      },
      I = {
        vcs_type: "github",
        vcs_host: Q,
        vcs_username: A,
        git_user_email: B
      },
      Y = "https://api.anthropic.com/api/claude_code/link_vcs_account";
    await YQ.post(Y, I, {
      headers: Z,
      timeout: 5000
    })
  } catch (G) {}
}
// @from(Start 11400632, End 11400665)
rT2 = L(() => {
  O3();
  AE()
})
// @from(Start 11400667, End 11401234)
async function Rf5() {
  try {
    let A = await QQ("gh", ["auth", "status", "--active", "--json", "hosts"], {
      useCwd: !1,
      timeout: 5000
    });
    if (A.code !== 0 || !A.stdout.trim()) return null;
    let B = JSON.parse(A.stdout)?.hosts;
    if (!B || typeof B !== "object") return null;
    for (let [G, Z] of Object.entries(B)) {
      if (!Array.isArray(Z) || Z.length === 0) continue;
      let I = Z[0];
      if (I?.login) return {
        username: I.login,
        hostname: G
      }
    }
    return null
  } catch (A) {
    return null
  }
}
// @from(Start 11401235, End 11401495)
async function Tf5() {
  try {
    let A = await QQ("git", ["config", "--get", "user.email"], {
      useCwd: !1,
      timeout: 5000
    });
    if (A.code === 0 && A.stdout.trim()) return A.stdout.trim();
    return null
  } catch (A) {
    return null
  }
}
// @from(Start 11401496, End 11401754)
async function G60() {
  if (N_()) return;
  if (!0) {
    let G = await J61();
    if (G.hasError || !G.vcsAccountLinkingEnabled) return
  }
  let [Q, B] = await Promise.all([Rf5(), Tf5()]);
  if (Q || B) sT2(Q?.username ?? "", Q?.hostname ?? "", B ?? "")
}
// @from(Start 11401759, End 11401810)
oT2 = L(() => {
  _8();
  rT2();
  gB();
  Y80()
})
// @from(Start 11401813, End 11412157)
function Vn({
  onDone: A,
  startingMessage: Q,
  mode: B = "login",
  forceLoginMethod: G
}) {
  let Z = l0() || {},
    I = G ?? Z.forceLoginMethod,
    Y = Z.forceLoginOrgUUID,
    J = I === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : I === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null,
    [W, X] = q2.useState(() => {
      if (B === "setup-token") return {
        state: "ready_to_start"
      };
      if (I === "claudeai" || I === "console") return {
        state: "ready_to_start"
      };
      return {
        state: "idle"
      }
    }),
    [V, F] = q2.useState(""),
    [K, D] = q2.useState(0),
    [H] = q2.useState(() => new KRA),
    [C, E] = q2.useState(() => {
      return B === "setup-token" || I === "claudeai"
    }),
    [U, q] = q2.useState(!1),
    w = WB().columns - tT2.length - 1;
  q2.useEffect(() => {
    if (I === "claudeai") GA("tengu_oauth_claudeai_forced", {});
    else if (I === "console") GA("tengu_oauth_console_forced", {})
  }, [I]), q2.useEffect(() => {
    if (W.state === "about_to_retry") setTimeout(() => {
      X(W.nextState)
    }, 1000)
  }, [W]), f1(async (v, x) => {
    if (x.return) {
      if (W.state === "success" && B !== "setup-token") GA("tengu_oauth_success", {
        loginWithClaudeAi: C
      }), A();
      else if (W.state === "error" && W.toRetry) F(""), X({
        state: "about_to_retry",
        nextState: W.toRetry
      })
    }
  });
  async function N(v, x) {
    try {
      let [p, u] = v.split("#");
      if (!p || !u) {
        X({
          state: "error",
          message: "Invalid code. Please make sure the full code was copied",
          toRetry: {
            state: "waiting_for_login",
            url: x
          }
        });
        return
      }
      GA("tengu_oauth_manual_entry", {}), H.handleManualAuthCodeInput({
        authorizationCode: p,
        state: u
      })
    } catch (p) {
      AA(p instanceof Error ? p : Error(String(p))), X({
        state: "error",
        message: p.message,
        toRetry: {
          state: "waiting_for_login",
          url: x
        }
      })
    }
  }
  let R = q2.useCallback(async () => {
      try {
        GA("tengu_oauth_flow_start", {
          loginWithClaudeAi: C
        });
        let v = await H.startOAuthFlow(async (p) => {
            X({
              state: "waiting_for_login",
              url: p
            }), setTimeout(() => q(!0), 3000)
          }, {
            loginWithClaudeAi: C,
            inferenceOnly: B === "setup-token",
            expiresIn: B === "setup-token" ? 31536000 : void 0,
            orgUUID: Y
          }).catch((p) => {
            let u = p.message.includes("Token exchange failed");
            throw X({
              state: "error",
              message: u ? "Failed to exchange authorization code for access token. Please try again." : p.message,
              toRetry: B === "setup-token" ? {
                state: "ready_to_start"
              } : {
                state: "idle"
              }
            }), GA("tengu_oauth_token_exchange_error", {
              error: p.message
            }), p
          }),
          x = gzA(v);
        if (x.warning) GA("tengu_oauth_storage_warning", {
          warning: x.warning
        });
        if (B === "setup-token") X({
          state: "success",
          token: v.accessToken
        });
        else if (await Oo0(v.accessToken).catch((p) => {
            throw X({
              state: "error",
              message: "Failed to fetch user roles: " + p.message,
              toRetry: {
                state: "idle"
              }
            }), GA("tengu_oauth_user_roles_error", {
              error: p.message
            }), p
          }), wv(v.scopes)) await ECB(), K61(), X({
          state: "success"
        }), E0A({
          message: "Claude Code login successful",
          notificationType: "auth_success"
        }), G60();
        else if (X({
            state: "creating_api_key"
          }), await Ro0(v.accessToken).catch((u) => {
            throw X({
              state: "error",
              message: "Failed to create API key: " + u.message,
              toRetry: {
                state: "idle"
              }
            }), GA("tengu_oauth_api_key_error", {
              error: u.message
            }), u
          })) K61(), X({
          state: "success"
        }), E0A({
          message: "Claude Code login successful",
          notificationType: "auth_success"
        }), G60();
        else X({
          state: "error",
          message: "Unable to create API key. The server accepted the request but didn't return a key.",
          toRetry: {
            state: "idle"
          }
        }), GA("tengu_oauth_api_key_error", {
          error: "server_returned_no_key"
        })
      } catch (v) {
        let x = v.message;
        GA("tengu_oauth_error", {
          error: x
        })
      }
    }, [H, q, C, B, Y]),
    T = q2.useRef(!1);
  q2.useEffect(() => {
    if (W.state === "ready_to_start" && !T.current) T.current = !0, process.nextTick(() => {
      R(), T.current = !1
    })
  }, [W.state, R]), q2.useEffect(() => {
    if (B === "setup-token" && W.state === "success") {
      let v = setTimeout(async () => {
        GA("tengu_oauth_success", {
          loginWithClaudeAi: C
        }), A()
      }, 500);
      return () => clearTimeout(v)
    }
  }, [B, W, C, A]), q2.useEffect(() => {
    return () => {
      H.cleanup()
    }
  }, [H]);

  function y() {
    switch (W.state) {
      case "idle":
        return q2.default.createElement(S, {
          flexDirection: "column",
          gap: 1,
          marginTop: 1
        }, q2.default.createElement($, {
          bold: !0
        }, Q ? Q : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."), q2.default.createElement($, null, "Select login method:"), q2.default.createElement(S, null, q2.default.createElement(M0, {
          options: [{
            label: `Claude account with subscription · ${tA.dim("Pro, Max, Team, or Enterprise")}
`,
            value: "claudeai"
          }, {
            label: `Anthropic Console account · ${tA.dim("API usage billing")}
`,
            value: "console"
          }],
          onCancel: () => {},
          onChange: (v) => {
            if (X({
                state: "ready_to_start"
              }), v === "claudeai") GA("tengu_oauth_claudeai_selected", {}), E(!0);
            else GA("tengu_oauth_console_selected", {}), E(!1)
          }
        })));
      case "waiting_for_login":
        return q2.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, J && q2.default.createElement(S, null, q2.default.createElement($, {
          dimColor: !0
        }, J)), !U && q2.default.createElement(S, null, q2.default.createElement(g4, null), q2.default.createElement($, null, "Opening browser to sign in…")), U && q2.default.createElement(S, null, q2.default.createElement($, null, tT2), q2.default.createElement(s4, {
          value: V,
          onChange: F,
          onSubmit: (v) => N(v, W.url),
          cursorOffset: K,
          onChangeCursorOffset: D,
          columns: w
        })));
      case "creating_api_key":
        return q2.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, q2.default.createElement(S, null, q2.default.createElement(g4, null), q2.default.createElement($, null, "Creating API key for Claude Code…")));
      case "about_to_retry":
        return q2.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, q2.default.createElement($, {
          color: "permission"
        }, "Retrying…"));
      case "success":
        return q2.default.createElement(S, {
          flexDirection: "column"
        }, B === "setup-token" && W.token ? null : q2.default.createElement(q2.default.Fragment, null, t6()?.emailAddress ? q2.default.createElement($, {
          dimColor: !0
        }, "Logged in as", " ", q2.default.createElement($, null, t6()?.emailAddress)) : null, q2.default.createElement($, {
          color: "success"
        }, "Login successful. Press ", q2.default.createElement($, {
          bold: !0
        }, "Enter"), " to continue…")));
      case "error":
        return q2.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, q2.default.createElement($, {
          color: "error"
        }, "OAuth error: ", W.message), W.toRetry && q2.default.createElement(S, {
          marginTop: 1
        }, q2.default.createElement($, {
          color: "permission"
        }, "Press ", q2.default.createElement($, {
          bold: !0
        }, "Enter"), " to retry.")));
      default:
        return null
    }
  }
  return q2.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, W.state === "waiting_for_login" && U && q2.default.createElement(S, {
    flexDirection: "column",
    key: "urlToCopy",
    gap: 1,
    paddingBottom: 1
  }, q2.default.createElement(S, {
    paddingX: 1
  }, q2.default.createElement($, {
    dimColor: !0
  }, "Browser didn't open? Use the url below to sign in:")), q2.default.createElement(S, {
    width: 1000
  }, q2.default.createElement($, {
    dimColor: !0
  }, W.url))), B === "setup-token" && W.state === "success" && W.token && q2.default.createElement(S, {
    key: "tokenOutput",
    flexDirection: "column",
    gap: 1,
    paddingTop: 1
  }, q2.default.createElement($, {
    color: "success"
  }, "✓ Long-lived authentication token created successfully!"), q2.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, q2.default.createElement($, null, "Your OAuth token (valid for 1 year):"), q2.default.createElement(S, {
    width: 1000
  }, q2.default.createElement($, {
    color: "warning"
  }, W.token)), q2.default.createElement($, {
    dimColor: !0
  }, "Store this token securely. You won't be able to see it again."), q2.default.createElement($, {
    dimColor: !0
  }, "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"))), q2.default.createElement(S, {
    paddingLeft: 1,
    flexDirection: "column",
    gap: 1
  }, y()))
}
// @from(Start 11412162, End 11412164)
q2
// @from(Start 11412166, End 11412204)
tT2 = "Paste code here if prompted > "
// @from(Start 11412210, End 11412379)
SRA = L(() => {
  hA();
  ZY();
  q80();
  AL();
  gB();
  q0();
  i8();
  g1();
  DY();
  h61();
  S5();
  D61();
  F9();
  MB();
  t2();
  oT2();
  q2 = BA(VA(), 1)
})
// @from(Start 11412382, End 11415160)
function eT2({
  onStashAndContinue: A,
  onCancel: Q
}) {
  let [B, G] = $G.useState(null), Z = B !== null ? [...B.tracked, ...B.untracked] : [], [I, Y] = $G.useState(!0), [J, W] = $G.useState(!1), [X, V] = $G.useState(null);
  $G.useEffect(() => {
    (async () => {
      try {
        let C = await $h1();
        G(C)
      } catch (C) {
        let E = C instanceof Error ? C.message : String(C);
        g(`Error getting changed files: ${E}`, {
          level: "error"
        }), V("Failed to get changed files")
      } finally {
        Y(!1)
      }
    })()
  }, []);
  let F = async () => {
    W(!0);
    try {
      if (g("Stashing changes before teleport..."), await lCB("Teleport auto-stash")) g("Successfully stashed changes"), A();
      else V("Failed to stash changes")
    } catch (H) {
      let C = H instanceof Error ? H.message : String(H);
      g(`Error stashing changes: ${C}`, {
        level: "error"
      }), V("Failed to stash changes")
    } finally {
      W(!1)
    }
  }, K = (H) => {
    if (H === "stash") F();
    else Q()
  };
  if (I) return $G.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, $G.default.createElement(S, {
    marginBottom: 1
  }, $G.default.createElement(g4, null), $G.default.createElement($, null, " Checking git status", H1.ellipsis)));
  if (X) return $G.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, $G.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Error: ", X), $G.default.createElement(S, {
    marginTop: 1
  }, $G.default.createElement($, {
    dimColor: !0
  }, "Press "), $G.default.createElement($, {
    bold: !0
  }, "Escape"), $G.default.createElement($, {
    dimColor: !0
  }, " to cancel")));
  let D = Z.length > 8;
  return $G.default.createElement(hD, {
    title: "Working Directory Has Changes",
    onCancel: Q,
    borderDimColor: !0
  }, $G.default.createElement($, null, "Teleport will switch git branches. The following changes were found:"), $G.default.createElement(S, {
    flexDirection: "column",
    paddingLeft: 2
  }, Z.length > 0 ? D ? $G.default.createElement($, null, Z.length, " files changed") : Z.map((H, C) => $G.default.createElement($, {
    key: C
  }, H)) : $G.default.createElement($, {
    dimColor: !0
  }, "No changes detected")), $G.default.createElement($, null, "Would you like to stash these changes and continue with teleport?"), J ? $G.default.createElement(S, null, $G.default.createElement(g4, null), $G.default.createElement($, null, " Stashing changes...")) : $G.default.createElement(M0, {
    options: [{
      label: "Stash changes and continue",
      value: "stash"
    }, {
      label: "Exit",
      value: "exit"
    }],
    onChange: K,
    onCancel: () => Q()
  }))
}
// @from(Start 11415165, End 11415167)
$G
// @from(Start 11415173, End 11415266)
AP2 = L(() => {
  hA();
  PV();
  V0();
  DY();
  J5();
  V9();
  Mi();
  $G = BA(VA(), 1)
})
// @from(Start 11415268, End 11415670)
async function DO() {
  let A = W0();
  if (_RA.has(A)) return _RA.get(A) ?? null;
  try {
    let Q = await onA();
    if (g(`Git remote URL: ${Q}`), !Q) return g("No git remote URL found"), _RA.set(A, null), null;
    let B = dh(Q);
    return g(`Parsed repository: ${B} from URL: ${Q}`), _RA.set(A, B), B
  } catch (Q) {
    return g(`Error detecting repository: ${Q}`), _RA.set(A, null), null
  }
}
// @from(Start 11415672, End 11416195)
function dh(A) {
  let Q = A.trim(),
    B = [/github\.com[:/]([^/]+\/[^/.]+?)(\.git)?$/, /github\.com[:/]([^/]+\/[^/.]+)$/];
  for (let G of B) {
    let Z = Q.match(G);
    if (Z && Z[1]) return g(`Parsed repository: ${Z[1]} from ${Q}`), Z[1]
  }
  if (!Q.includes("://") && !Q.includes("@") && Q.includes("/")) {
    let G = Q.split("/");
    if (G.length === 2 && G[0] && G[1]) {
      let Z = G[1].replace(/\.git$/, "");
      return `${G[0]}/${Z}`
    }
  }
  return g(`Could not parse repository from: ${Q}`), null
}
// @from(Start 11416200, End 11416203)
_RA
// @from(Start 11416209, End 11416267)
z0A = L(() => {
  PV();
  V0();
  U2();
  _RA = new Map
})
// @from(Start 11416315, End 11416735)
async function U0A() {
  let A = M6()?.accessToken;
  if (A === void 0) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let Q = await HS();
  if (!Q) throw Error("Unable to get organization UUID");
  return {
    accessToken: A,
    orgUUID: Q
  }
}
// @from(Start 11416736, End 11417856)
async function QP2() {
  let {
    accessToken: A,
    orgUUID: Q
  } = await U0A(), B = `${e9().BASE_API_URL}/v1/sessions`;
  try {
    let G = {
        ...IC(A),
        "x-organization-uuid": Q
      },
      Z = await YQ.get(B, {
        headers: G
      });
    if (Z.status !== 200) throw Error(`Failed to fetch code sessions: ${Z.statusText}`);
    return Z.data.data.map((Y) => {
      let J = Y.session_context.sources.find((X) => X.type === "git_repository"),
        W = null;
      if (J?.url) {
        let X = dh(J.url);
        if (X) {
          let [V, F] = X.split("/");
          if (V && F) W = {
            name: F,
            owner: {
              login: V
            },
            default_branch: J.revision || void 0
          }
        }
      }
      return {
        id: Y.id,
        title: Y.title || "Untitled",
        description: "",
        status: Y.session_status,
        repo: W,
        turns: [],
        created_at: Y.created_at,
        updated_at: Y.updated_at
      }
    })
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw AA(Z), G
  }
}
// @from(Start 11417858, End 11418003)
function IC(A) {
  return {
    Authorization: `Bearer ${A}`,
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  }
}
// @from(Start 11418004, End 11418625)
async function BP2(A, Q) {
  try {
    let {
      accessToken: B,
      orgUUID: G
    } = await U0A(), Z = `${e9().BASE_API_URL}/v1/sessions/${A}/events`, I = {
      ...IC(B),
      "x-organization-uuid": G
    }, J = {
      events: [{
        uuid: Pf5(),
        session_id: A,
        type: "user",
        parent_tool_use_id: null,
        message: {
          role: "user",
          content: Q
        }
      }]
    }, W = await YQ.post(Z, J, {
      headers: I,
      validateStatus: (X) => X < 500
    });
    if (W.status === 200 || W.status === 201) return !0;
    return !1
  } catch {
    return !1
  }
}
// @from(Start 11418630, End 11418633)
jf5
// @from(Start 11418635, End 11418638)
HoG
// @from(Start 11418644, End 11419206)
Fn = L(() => {
  NX();
  gB();
  O3();
  AL();
  g1();
  z0A();
  Q2();
  jf5 = W2.object({
    id: W2.string(),
    title: W2.string(),
    description: W2.string(),
    status: W2.enum(["idle", "working", "waiting", "completed", "archived", "cancelled", "rejected"]),
    repo: W2.object({
      name: W2.string(),
      owner: W2.object({
        login: W2.string()
      }),
      default_branch: W2.string().optional()
    }).nullable(),
    turns: W2.array(W2.string()),
    created_at: W2.string(),
    updated_at: W2.string()
  }), HoG = W2.array(jf5)
})
// @from(Start 11419208, End 11420065)
async function nJA() {
  let A = M6()?.accessToken;
  if (!A) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let Q = await HS();
  if (!Q) throw Error("Unable to get organization UUID");
  let B = `${e9().BASE_API_URL}/v1/environment_providers`;
  try {
    let G = {
        ...IC(A),
        "x-organization-uuid": Q
      },
      Z = await YQ.get(B, {
        headers: G,
        timeout: 15000
      });
    if (Z.status !== 200) throw Error(`Failed to fetch environments: ${Z.status} ${Z.statusText}`);
    return Z.data.environments
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw AA(Z), Error(`Failed to fetch environments: ${Z.message}`)
  }
}
// @from(Start 11420070, End 11420135)
g61 = L(() => {
  O3();
  NX();
  gB();
  AL();
  g1();
  Fn()
})
// @from(Start 11420137, End 11420199)
async function u61() {
  if (!BB()) return !1;
  return Qt()
}
// @from(Start 11420200, End 11420244)
async function GP2() {
  return await _t()
}
// @from(Start 11420245, End 11420429)
async function ZP2() {
  try {
    return (await nJA()).length > 0
  } catch (A) {
    return g(`checkHasRemoteEnvironment failed: ${A instanceof Error?A.message:String(A)}`), !1
  }
}
// @from(Start 11420430, End 11420483)
async function IP2() {
  return await DO() !== null
}
// @from(Start 11420484, End 11421637)
async function YP2(A, Q) {
  try {
    let B = M6()?.accessToken;
    if (!B) return g("checkGithubAppInstalled: No access token found, assuming app not installed"), !1;
    let G = await HS();
    if (!G) return g("checkGithubAppInstalled: No org UUID found, assuming app not installed"), !1;
    let Z = `${e9().BASE_API_URL}/api/oauth/organizations/${G}/code/repos/${A}/${Q}`,
      I = {
        ...IC(B),
        "x-organization-uuid": G
      };
    g(`Checking GitHub app installation for ${A}/${Q}`);
    let Y = await YQ.get(Z, {
      headers: I,
      timeout: 15000
    });
    if (Y.status === 200 && Y.data.status) {
      let J = Y.data.status.app_installed;
      return g(`GitHub app ${J?"is":"is not"} installed on ${A}/${Q}`), J
    }
    return g(`checkGithubAppInstalled: Unexpected response status ${Y.status}`), !1
  } catch (B) {
    if (YQ.isAxiosError(B)) {
      let G = B.response?.status;
      if (G && G >= 400 && G < 500) return g(`checkGithubAppInstalled: Got ${G} error, app likely not installed on ${A}/${Q}`), !1
    }
    return g(`checkGithubAppInstalled error: ${B instanceof Error?B.message:String(B)}`), !1
  }
}
// @from(Start 11421642, End 11421733)
Z60 = L(() => {
  PV();
  gB();
  z0A();
  g61();
  AL();
  NX();
  Fn();
  O3();
  V0()
})
// @from(Start 11421736, End 11423543)
function m61({
  onComplete: A,
  errorsToIgnore: Q = new Set
}) {
  let [B, G] = AV.useState(null), [Z, I] = AV.useState(!1), Y = AV.useCallback(async () => {
    let K = await I60(),
      D = new Set(Array.from(K).filter((H) => !Q.has(H)));
    if (D.size === 0) {
      A();
      return
    }
    if (D.has("needsLogin")) G("needsLogin");
    else if (D.has("needsGitStash")) G("needsGitStash")
  }, [A, Q]);
  AV.useEffect(() => {
    Y()
  }, [Y]);
  let J = AV.useCallback(() => {
      l5(0)
    }, []),
    W = AV.useCallback(() => {
      I(!1), Y()
    }, [Y]),
    X = AV.useCallback(() => {
      I(!0)
    }, [I]),
    V = AV.useCallback((K) => {
      if (K === "login") X();
      else J()
    }, [X, J]),
    F = AV.useCallback(() => {
      Y()
    }, [Y]);
  if (!B) return null;
  switch (B) {
    case "needsGitStash":
      return AV.default.createElement(eT2, {
        onStashAndContinue: F,
        onCancel: J
      });
    case "needsLogin": {
      if (Z) return AV.default.createElement(Vn, {
        onDone: W,
        mode: "login",
        forceLoginMethod: "claudeai"
      });
      return AV.default.createElement(hD, {
        title: "Log in to Claude",
        onCancel: J,
        borderDimColor: !0
      }, AV.default.createElement(S, {
        flexDirection: "column"
      }, AV.default.createElement($, {
        dimColor: !0
      }, "Teleport requires a Claude.ai account."), AV.default.createElement($, {
        dimColor: !0
      }, "Your Claude Pro/Max subscription will be used by Claude Code.")), AV.default.createElement(M0, {
        options: [{
          label: "Login with Claude account",
          value: "login"
        }, {
          label: "Exit",
          value: "exit"
        }],
        onChange: V,
        onCancel: J
      }))
    }
  }
}
// @from(Start 11423544, End 11423710)
async function I60() {
  let A = new Set,
    [Q, B] = await Promise.all([u61(), GP2()]);
  if (Q) A.add("needsLogin");
  if (!B) A.add("needsGitStash");
  return A
}
// @from(Start 11423715, End 11423717)
AV
// @from(Start 11423723, End 11423819)
Y60 = L(() => {
  hA();
  Mi();
  J5();
  SRA();
  AP2();
  kW();
  Z60();
  AV = BA(VA(), 1)
})
// @from(Start 11423822, End 11424037)
function JP2(A) {
  if (!A) throw GA("tengu_teleport_error_no_url_or_session_id", {}), new XI("No URL or session ID provided for teleport", tA.red(`Error: No URL or session ID provided for teleport
`));
  return A
}
// @from(Start 11424039, End 11424524)
function WP2(A) {
  if (!A) return {};
  try {
    let Q = JSON.parse(A);
    if (typeof Q !== "object" || Q === null || Array.isArray(Q)) throw Error("TELEPORT_HEADERS must be a JSON object");
    return Q
  } catch (Q) {
    let B = Q instanceof Error ? Q : Error(String(Q));
    throw AA(B), GA("tengu_teleport_error_invalid_teleport_headers_json", {}), new XI(`Invalid JSON in TELEPORT_HEADERS: ${B.message}`, tA.red(`Error: Invalid JSON in TELEPORT_HEADERS: ${B.message}
`))
  }
}
// @from(Start 11424526, End 11424743)
function XP2(A) {
  for (let [Q, B] of Object.entries(A))
    if (typeof B !== "string") {
      let G = Error(`Invalid header value for "${Q}": headers must be strings, got ${typeof B}`);
      throw AA(G), G
    }
}
// @from(Start 11424748, End 11424797)
VP2 = L(() => {
  RZ();
  F9();
  q0();
  g1()
})
// @from(Start 11424846, End 11425050)
function _f5(A) {
  if (A === null) return $y("Session resumed", "suggestion");
  let Q = A instanceof XI ? A.formattedMessage : A.message;
  return $y(`Session resumed without branch: ${Q}`, "warning")
}
// @from(Start 11425052, End 11425251)
function kf5() {
  return R0({
    content: `This session is being continued from another machine. Application state may have changed. The updated working directory is ${uQ()}`,
    isMeta: !0
  })
}
// @from(Start 11425252, End 11426295)
async function xf5(A, Q) {
  let B = A.length > 75 ? A.slice(0, 75) + "…" : A,
    G = "claude/task";
  try {
    let Z = yf5.replace("{description}", A),
      I = "<title>",
      J = (await uX({
        systemPrompt: [],
        userPrompt: Z,
        assistantPrompt: "<title>",
        signal: Q,
        options: {
          querySource: "teleport_generate_title",
          agents: [],
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          mcpTools: [],
          agentIdOrSessionId: e1()
        }
      })).message.content[0];
    if (J?.type === "text") {
      let W = "<title>" + J.text.trim(),
        X = W.match(/<title>(.*?)<\/title>/s),
        V = X ? X[1]?.trim() : B,
        F = W.match(/<branch>(.*?)<\/branch>/s),
        K = F ? F[1]?.trim() : "claude/task";
      return {
        title: V || B,
        branchName: K || "claude/task"
      }
    }
  } catch (Z) {
    AA(Error(`Error generating title and branch: ${Z}`))
  }
  return {
    title: B,
    branchName: "claude/task"
  }
}
// @from(Start 11426296, End 11426614)
async function c61() {
  if (!await _t()) throw GA("tengu_teleport_error_git_not_clean", {}), new XI("Git working directory is not clean. Please commit or stash your changes before using --teleport.", tA.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`))
}
// @from(Start 11426615, End 11427132)
async function vf5(A) {
  let Q = A ? ["fetch", "origin", `${A}:${A}`] : ["fetch", "origin"],
    {
      code: B,
      stderr: G
    } = await QQ("git", Q);
  if (B !== 0)
    if (A && G.includes("refspec")) {
      g(`Specific branch fetch failed, trying to fetch ref: ${A}`);
      let {
        code: Z,
        stderr: I
      } = await QQ("git", ["fetch", "origin", A]);
      if (Z !== 0) AA(Error(`Failed to fetch from remote origin: ${I}`))
    } else AA(Error(`Failed to fetch from remote origin: ${G}`))
}
// @from(Start 11427133, End 11427802)
async function bf5(A) {
  let {
    code: Q
  } = await QQ("git", ["rev-parse", "--abbrev-ref", `${A}@{upstream}`]);
  if (Q === 0) {
    g(`Branch '${A}' already has upstream set`);
    return
  }
  let {
    code: B
  } = await QQ("git", ["rev-parse", "--verify", `origin/${A}`]);
  if (B === 0) {
    g(`Setting upstream for '${A}' to 'origin/${A}'`);
    let {
      code: G,
      stderr: Z
    } = await QQ("git", ["branch", "--set-upstream-to", `origin/${A}`, A]);
    if (G !== 0) g(`Failed to set upstream for '${A}': ${Z}`);
    else g(`Successfully set upstream for '${A}'`)
  } else g(`Remote branch 'origin/${A}' does not exist, skipping upstream setup`)
}
// @from(Start 11427803, End 11428479)
async function ff5(A) {
  let {
    code: Q,
    stderr: B
  } = await QQ("git", ["checkout", A]);
  if (Q !== 0) {
    g(`Local checkout failed, trying to checkout from origin: ${B}`);
    let G = await QQ("git", ["checkout", "-b", A, "--track", `origin/${A}`]);
    if (Q = G.code, B = G.stderr, Q !== 0) {
      g(`Remote checkout with -b failed, trying without -b: ${B}`);
      let Z = await QQ("git", ["checkout", "--track", `origin/${A}`]);
      Q = Z.code, B = Z.stderr
    }
  }
  if (Q !== 0) throw GA("tengu_teleport_error_branch_checkout_failed", {}), new XI(`Failed to checkout branch '${A}': ${B}`, tA.red(`Failed to checkout branch '${A}'
`));
  await bf5(A)
}
// @from(Start 11428480, End 11428597)
async function d61() {
  let {
    stdout: A
  } = await QQ("git", ["branch", "--show-current"]);
  return A.trim()
}
// @from(Start 11428599, End 11428657)
function FP2(A, Q) {
  return [...nMA(A), kf5(), _f5(Q)]
}
// @from(Start 11428658, End 11429284)
async function kRA(A, Q) {
  try {
    let B = await d61();
    if (g(`Current branch before teleport: '${B}'`), Q) {
      g(`Switching to branch '${Q}'...`), await vf5(Q), await ff5(Q);
      let Z = await d61();
      g(`Branch after checkout: '${Z}'`)
    } else g("No branch specified, staying on current branch");
    let G = await d61();
    return {
      messages: FP2(A, null),
      branchName: G,
      branchError: null
    }
  } catch (B) {
    let G = await d61(),
      Z = B instanceof Error ? B : Error(String(B));
    return {
      messages: FP2(A, Z),
      branchName: G,
      branchError: Z
    }
  }
}
// @from(Start 11429285, End 11431812)
async function hf5(A, Q, B) {
  let G = await DO(),
    Z = `${e9().BASE_API_URL}/v1/sessions/${A}`,
    I = {
      ...B,
      "x-organization-uuid": Q
    };
  if (!G) {
    g(`Not in git repo, fetching session metadata to provide guidance: ${Z}`);
    let J;
    try {
      J = await YQ.get(Z, {
        headers: I,
        timeout: 15000
      })
    } catch (W) {
      if (YQ.isAxiosError(W)) g(`Failed to fetch session metadata - Status: ${W.response?.status}, Message: ${W.message}`);
      throw GA("tengu_teleport_error_repo_validation_failed_sessions_api", {
        sessionId: A
      }), new XI(`You must run claude --teleport ${A} from a checkout of the git repo the session was created in.`, tA.red(`You must run claude --teleport ${A} from a checkout of the git repo the session was created in.
`))
    }
    if (J.status === 200) {
      let X = J.data.session_context.sources.find((V) => V.type === "git_repository");
      if (X?.url) {
        let V = dh(X.url);
        if (V) throw GA("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
          sessionId: A
        }), new XI(`You must run claude --teleport ${A} from a checkout of ${V}.`, tA.red(`You must run claude --teleport ${A} from a checkout of ${tA.bold(V)}.
`))
      } else g("Session has no repo requirement and not in git directory, proceeding")
    }
    return
  }
  g(`Fetching session metadata from: ${Z}`);
  let Y;
  try {
    Y = await YQ.get(Z, {
      headers: I,
      timeout: 15000
    })
  } catch (J) {
    if (YQ.isAxiosError(J)) {
      if (g(`Failed to fetch session metadata - Status: ${J.response?.status}, Message: ${J.message}`), J.response?.data) g(`Error response data: ${JSON.stringify(J.response.data)}`)
    } else g(`Could not fetch session metadata: ${J}`);
    return
  }
  if (Y.status === 200) {
    let W = Y.data.session_context.sources.find((X) => X.type === "git_repository");
    if (W?.url) {
      let X = dh(W.url);
      if (X) {
        if (g(`Session is for repository: ${X}, current repo: ${G}`), G.toLowerCase() !== X.toLowerCase()) throw GA("tengu_teleport_error_repo_mismatch_sessions_api", {
          sessionId: A
        }), new XI(`You must run claude --teleport ${A} from a checkout of ${X}.
This repo is ${G}.`, tA.red(`You must run claude --teleport ${A} from a checkout of ${tA.bold(X)}.
This repo is ${tA.bold(G)}.
`));
        g("Repository matches, proceeding with teleport")
      }
    } else g("Session has no associated repository, proceeding without validation")
  }
}
// @from(Start 11431813, End 11433495)
async function DP2(A) {
  try {
    let Q = M6()?.accessToken;
    if (!Q) return {
      status: "error",
      errorMessage: "OAuth authentication required for teleport"
    };
    let B = await HS();
    if (!B) return {
      status: "error",
      errorMessage: "Unable to get organization UUID"
    };
    let G = IC(Q),
      Z = await DO(),
      I = `${e9().BASE_API_URL}/v1/sessions/${A}`,
      Y = {
        ...G,
        "x-organization-uuid": B
      },
      J;
    try {
      J = await YQ.get(I, {
        headers: Y,
        timeout: 15000
      })
    } catch (F) {
      if (YQ.isAxiosError(F)) g(`Failed to fetch session metadata - Status: ${F.response?.status}, Message: ${F.message}`);
      return {
        status: "error",
        errorMessage: "Failed to fetch session metadata"
      }
    }
    if (J.status !== 200) return {
      status: "error",
      errorMessage: `Unexpected session response status: ${J.status}`
    };
    let X = J.data.session_context.sources.find((F) => F.type === "git_repository");
    if (!X?.url) return {
      status: "no_repo_required"
    };
    let V = dh(X.url);
    if (!V) return {
      status: "no_repo_required"
    };
    if (!Z) return {
      status: "not_in_repo",
      sessionRepo: V,
      currentRepo: null
    };
    if (Z.toLowerCase() === V.toLowerCase()) return {
      status: "match",
      sessionRepo: V,
      currentRepo: Z
    };
    return {
      status: "mismatch",
      sessionRepo: V,
      currentRepo: Z
    }
  } catch (Q) {
    return g(`Error validating session repository: ${Q}`), {
      status: "error",
      errorMessage: Q instanceof Error ? Q.message : String(Q)
    }
  }
}
// @from(Start 11433496, End 11434600)
async function yRA(A) {
  g(`Resuming code session ID: ${A}`);
  try {
    let Q = process.env.TELEPORT_RESUME_URL;
    if (Q) return g("Using TELEPORT_RESUME_URL from environment"), await HP2(Q, void 0);
    let B = M6()?.accessToken;
    if (!B) throw GA("tengu_teleport_resume_error", {
      error_type: "no_access_token"
    }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let G = await HS();
    if (!G) throw GA("tengu_teleport_resume_error", {
      error_type: "no_org_uuid"
    }), Error("Unable to get organization UUID for constructing session URL");
    let Z = IC(B);
    return g("Using Sessions API for resume"), await hf5(A, G, Z), await uf5(A, G, B)
  } catch (Q) {
    if (Q instanceof XI) throw Q;
    let B = Q instanceof Error ? Q : Error(String(Q));
    throw AA(B), GA("tengu_teleport_resume_error", {
      error_type: "resume_session_id_catch"
    }), new XI(B.message, tA.red(`Error: ${B.message}
`))
  }
}
// @from(Start 11434601, End 11435037)
async function HP2(A, Q) {
  g(`Teleporting from URL: ${A}`);
  let B = WP2(process.env.TELEPORT_HEADERS);
  if (Object.keys(B).length > 0) g(`Parsed ${Object.keys(B).length} headers from TELEPORT_HEADERS`);
  else g("No TELEPORT_HEADERS environment variable found");
  if (Q) {
    XP2(Q);
    let G = {
      ...B,
      ...Q
    };
    return g(`Added ${Object.keys(Q).length} additional headers`), KP2(A, G)
  }
  return KP2(A, B)
}
// @from(Start 11435038, End 11436093)
async function KP2(A, Q) {
  try {
    g("Fetching conversation from remote URL...");
    let B = await zY2(A, Q);
    if (!B) throw AA(Error("Remote URL returned empty response")), GA("tengu_teleport_resume_error", {
      error_type: "empty_response",
      url_type: A.startsWith("http") ? "http(s)" : "other"
    }), GA("tengu_teleport_error_failed_to_load_conversation", {}), new XI("Failed to load conversation from remote URL", tA.red(`Error: Failed to load conversation from remote URL
`));
    return g("Successfully loaded conversation from remote URL"), g(`Response contains ${B.log?.length||0} messages`), g(`Response branch: ${B.branch||"none specified"}`), GA("tengu_teleport_resume_success", {
      messages_count: B.log?.length || 0,
      has_branch: !!B.branch
    }), B
  } catch (B) {
    if (B instanceof XI) throw B;
    let G = B instanceof Error ? B : Error(String(B));
    throw AA(G), GA("tengu_teleport_resume_error", {
      error_type: "teleport_from_url_catch"
    }), new XI(G.message, tA.red(`Error: ${G.message}
`))
  }
}
// @from(Start 11436094, End 11436231)
async function xRA(A) {
  let Q = JP2(A);
  if (Q.startsWith("http:") || Q.startsWith("https:")) return HP2(Q, void 0);
  return yRA(Q)
}