
// @from(Start 11987010, End 12011627)
cWA = z((cJZ, Yg2) => {
  Yg2.exports = un;
  var GG0 = q31(),
    oY = dJ(),
    yy = oY.NAMESPACE,
    P31 = a70(),
    hP = nD(),
    ZG0 = h0A(),
    _s5 = b70(),
    T31 = mh2(),
    dWA = E31(),
    ks5 = r70(),
    IG0 = O31(),
    Gg2 = w31(),
    ys5 = R31(),
    xs5 = QG0(),
    Zg2 = BG0(),
    Bg2 = Object.create(null);

  function un(A, Q, B, G) {
    Gg2.call(this), this.nodeType = hP.ELEMENT_NODE, this.ownerDocument = A, this.localName = Q, this.namespaceURI = B, this.prefix = G, this._tagName = void 0, this._attrsByQName = Object.create(null), this._attrsByLName = Object.create(null), this._attrKeys = []
  }

  function YG0(A, Q) {
    if (A.nodeType === hP.TEXT_NODE) Q.push(A._data);
    else
      for (var B = 0, G = A.childNodes.length; B < G; B++) YG0(A.childNodes[B], Q)
  }
  un.prototype = Object.create(Gg2.prototype, {
    isHTML: {
      get: function() {
        return this.namespaceURI === yy.HTML && this.ownerDocument.isHTML
      }
    },
    tagName: {
      get: function() {
        if (this._tagName === void 0) {
          var Q;
          if (this.prefix === null) Q = this.localName;
          else Q = this.prefix + ":" + this.localName;
          if (this.isHTML) {
            var B = Bg2[Q];
            if (!B) Bg2[Q] = B = oY.toASCIIUpperCase(Q);
            Q = B
          }
          this._tagName = Q
        }
        return this._tagName
      }
    },
    nodeName: {
      get: function() {
        return this.tagName
      }
    },
    nodeValue: {
      get: function() {
        return null
      },
      set: function() {}
    },
    textContent: {
      get: function() {
        var A = [];
        return YG0(this, A), A.join("")
      },
      set: function(A) {
        if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
      }
    },
    innerText: {
      get: function() {
        var A = [];
        return YG0(this, A), A.join("").replace(/[ \t\n\f\r]+/g, " ").trim()
      },
      set: function(A) {
        if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
      }
    },
    innerHTML: {
      get: function() {
        return this.serialize()
      },
      set: oY.nyi
    },
    outerHTML: {
      get: function() {
        return _s5.serializeOne(this, {
          nodeType: 0
        })
      },
      set: function(A) {
        var Q = this.ownerDocument,
          B = this.parentNode;
        if (B === null) return;
        if (B.nodeType === hP.DOCUMENT_NODE) oY.NoModificationAllowedError();
        if (B.nodeType === hP.DOCUMENT_FRAGMENT_NODE) B = B.ownerDocument.createElement("body");
        var G = Q.implementation.mozHTMLParser(Q._address, B);
        G.parse(A === null ? "" : String(A), !0), this.replaceWith(G._asDocumentFragment())
      }
    },
    _insertAdjacent: {
      value: function(Q, B) {
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
            return oY.SyntaxError()
        }
      }
    },
    insertAdjacentElement: {
      value: function(Q, B) {
        if (B.nodeType !== hP.ELEMENT_NODE) throw TypeError("not an element");
        return Q = oY.toASCIILowerCase(String(Q)), this._insertAdjacent(Q, B)
      }
    },
    insertAdjacentText: {
      value: function(Q, B) {
        var G = this.ownerDocument.createTextNode(B);
        Q = oY.toASCIILowerCase(String(Q)), this._insertAdjacent(Q, G)
      }
    },
    insertAdjacentHTML: {
      value: function(Q, B) {
        Q = oY.toASCIILowerCase(String(Q)), B = String(B);
        var G;
        switch (Q) {
          case "beforebegin":
          case "afterend":
            if (G = this.parentNode, G === null || G.nodeType === hP.DOCUMENT_NODE) oY.NoModificationAllowedError();
            break;
          case "afterbegin":
          case "beforeend":
            G = this;
            break;
          default:
            oY.SyntaxError()
        }
        if (!(G instanceof un) || G.ownerDocument.isHTML && G.localName === "html" && G.namespaceURI === yy.HTML) G = G.ownerDocument.createElementNS(yy.HTML, "body");
        var Z = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, G);
        Z.parse(B, !0), this._insertAdjacent(Q, Z._asDocumentFragment())
      }
    },
    children: {
      get: function() {
        if (!this._children) this._children = new Ig2(this);
        return this._children
      }
    },
    attributes: {
      get: function() {
        if (!this._attributes) this._attributes = new WG0(this);
        return this._attributes
      }
    },
    firstElementChild: {
      get: function() {
        for (var A = this.firstChild; A !== null; A = A.nextSibling)
          if (A.nodeType === hP.ELEMENT_NODE) return A;
        return null
      }
    },
    lastElementChild: {
      get: function() {
        for (var A = this.lastChild; A !== null; A = A.previousSibling)
          if (A.nodeType === hP.ELEMENT_NODE) return A;
        return null
      }
    },
    childElementCount: {
      get: function() {
        return this.children.length
      }
    },
    nextElement: {
      value: function(A) {
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
      value: function(Q) {
        var B;
        if (!Q) return new ZG0;
        if (Q === "*") B = function() {
          return !0
        };
        else if (this.isHTML) B = vs5(Q);
        else B = JG0(Q);
        return new T31(this, B)
      }
    },
    getElementsByTagNameNS: {
      value: function(Q, B) {
        var G;
        if (Q === "*" && B === "*") G = function() {
          return !0
        };
        else if (Q === "*") G = JG0(B);
        else if (B === "*") G = bs5(Q);
        else G = fs5(Q, B);
        return new T31(this, G)
      }
    },
    getElementsByClassName: {
      value: function(Q) {
        if (Q = String(Q).trim(), Q === "") {
          var B = new ZG0;
          return B
        }
        return Q = Q.split(/[ \t\r\n\f]+/), new T31(this, hs5(Q))
      }
    },
    getElementsByName: {
      value: function(Q) {
        return new T31(this, gs5(String(Q)))
      }
    },
    clone: {
      value: function() {
        var Q;
        if (this.namespaceURI !== yy.HTML || this.prefix || !this.ownerDocument.isHTML) Q = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName);
        else Q = this.ownerDocument.createElement(this.localName);
        for (var B = 0, G = this._attrKeys.length; B < G; B++) {
          var Z = this._attrKeys[B],
            I = this._attrsByLName[Z],
            Y = I.cloneNode();
          Y._setOwnerElement(Q), Q._attrsByLName[Z] = Y, Q._addQName(Y)
        }
        return Q._attrKeys = this._attrKeys.concat(), Q
      }
    },
    isEqual: {
      value: function(Q) {
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
      value: function(Q, B) {
        if (this.namespaceURI && this.namespaceURI === Q && this.prefix !== null && B.lookupNamespaceURI(this.prefix) === Q) return this.prefix;
        for (var G = 0, Z = this._numattrs; G < Z; G++) {
          var I = this._attr(G);
          if (I.prefix === "xmlns" && I.value === Q && B.lookupNamespaceURI(I.localName) === Q) return I.localName
        }
        var Y = this.parentElement;
        return Y ? Y._lookupNamespacePrefix(Q, B) : null
      }
    },
    lookupNamespaceURI: {
      value: function(Q) {
        if (Q === "" || Q === void 0) Q = null;
        if (this.namespaceURI !== null && this.prefix === Q) return this.namespaceURI;
        for (var B = 0, G = this._numattrs; B < G; B++) {
          var Z = this._attr(B);
          if (Z.namespaceURI === yy.XMLNS) {
            if (Z.prefix === "xmlns" && Z.localName === Q || Q === null && Z.prefix === null && Z.localName === "xmlns") return Z.value || null
          }
        }
        var I = this.parentElement;
        return I ? I.lookupNamespaceURI(Q) : null
      }
    },
    getAttribute: {
      value: function(Q) {
        var B = this.getAttributeNode(Q);
        return B ? B.value : null
      }
    },
    getAttributeNS: {
      value: function(Q, B) {
        var G = this.getAttributeNodeNS(Q, B);
        return G ? G.value : null
      }
    },
    getAttributeNode: {
      value: function(Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = oY.toASCIILowerCase(Q);
        var B = this._attrsByQName[Q];
        if (!B) return null;
        if (Array.isArray(B)) B = B[0];
        return B
      }
    },
    getAttributeNodeNS: {
      value: function(Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = this._attrsByLName[Q + "|" + B];
        return G ? G : null
      }
    },
    hasAttribute: {
      value: function(Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = oY.toASCIILowerCase(Q);
        return this._attrsByQName[Q] !== void 0
      }
    },
    hasAttributeNS: {
      value: function(Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = Q + "|" + B;
        return this._attrsByLName[G] !== void 0
      }
    },
    hasAttributes: {
      value: function() {
        return this._numattrs > 0
      }
    },
    toggleAttribute: {
      value: function(Q, B) {
        if (Q = String(Q), !GG0.isValidName(Q)) oY.InvalidCharacterError();
        if (/[A-Z]/.test(Q) && this.isHTML) Q = oY.toASCIILowerCase(Q);
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
      value: function(Q, B) {
        var G = this._attrsByQName[Q],
          Z;
        if (!G) G = this._newattr(Q), Z = !0;
        else if (Array.isArray(G)) G = G[0];
        if (G.value = B, this._attributes) this._attributes[Q] = G;
        if (Z && this._newattrhook) this._newattrhook(Q, B)
      }
    },
    setAttribute: {
      value: function(Q, B) {
        if (Q = String(Q), !GG0.isValidName(Q)) oY.InvalidCharacterError();
        if (/[A-Z]/.test(Q) && this.isHTML) Q = oY.toASCIILowerCase(Q);
        this._setAttribute(Q, String(B))
      }
    },
    _setAttributeNS: {
      value: function(Q, B, G) {
        var Z = B.indexOf(":"),
          I, Y;
        if (Z < 0) I = null, Y = B;
        else I = B.substring(0, Z), Y = B.substring(Z + 1);
        if (Q === "" || Q === void 0) Q = null;
        var J = (Q === null ? "" : Q) + "|" + Y,
          W = this._attrsByLName[J],
          X;
        if (!W) {
          if (W = new PTA(this, Y, I, Q), X = !0, this._attrsByLName[J] = W, this._attributes) this._attributes[this._attrKeys.length] = W;
          this._attrKeys.push(J), this._addQName(W)
        }
        if (W.value = G, X && this._newattrhook) this._newattrhook(B, G)
      }
    },
    setAttributeNS: {
      value: function(Q, B, G) {
        if (Q = Q === null || Q === void 0 || Q === "" ? null : String(Q), B = String(B), !GG0.isValidQName(B)) oY.InvalidCharacterError();
        var Z = B.indexOf(":"),
          I = Z < 0 ? null : B.substring(0, Z);
        if (I !== null && Q === null || I === "xml" && Q !== yy.XML || (B === "xmlns" || I === "xmlns") && Q !== yy.XMLNS || Q === yy.XMLNS && !(B === "xmlns" || I === "xmlns")) oY.NamespaceError();
        this._setAttributeNS(Q, B, String(G))
      }
    },
    setAttributeNode: {
      value: function(Q) {
        if (Q.ownerElement !== null && Q.ownerElement !== this) throw new dWA(dWA.INUSE_ATTRIBUTE_ERR);
        var B = null,
          G = this._attrsByQName[Q.name];
        if (G) {
          if (!Array.isArray(G)) G = [G];
          if (G.some(function(Z) {
              return Z === Q
            })) return Q;
          else if (Q.ownerElement !== null) throw new dWA(dWA.INUSE_ATTRIBUTE_ERR);
          G.forEach(function(Z) {
            this.removeAttributeNode(Z)
          }, this), B = G[0]
        }
        return this.setAttributeNodeNS(Q), B
      }
    },
    setAttributeNodeNS: {
      value: function(Q) {
        if (Q.ownerElement !== null) throw new dWA(dWA.INUSE_ATTRIBUTE_ERR);
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
      value: function(Q) {
        if (Q = String(Q), /[A-Z]/.test(Q) && this.isHTML) Q = oY.toASCIILowerCase(Q);
        var B = this._attrsByQName[Q];
        if (!B) return;
        if (Array.isArray(B))
          if (B.length > 2) B = B.shift();
          else this._attrsByQName[Q] = B[1], B = B[0];
        else this._attrsByQName[Q] = void 0;
        var G = B.namespaceURI,
          Z = (G === null ? "" : G) + "|" + B.localName;
        this._attrsByLName[Z] = void 0;
        var I = this._attrKeys.indexOf(Z);
        if (this._attributes) Array.prototype.splice.call(this._attributes, I, 1), this._attributes[Q] = void 0;
        this._attrKeys.splice(I, 1);
        var Y = B.onchange;
        if (B._setOwnerElement(null), Y) Y.call(B, this, B.localName, B.value, null);
        if (this.rooted) this.ownerDocument.mutateRemoveAttr(B)
      }
    },
    removeAttributeNS: {
      value: function(Q, B) {
        Q = Q === void 0 || Q === null ? "" : String(Q), B = String(B);
        var G = Q + "|" + B,
          Z = this._attrsByLName[G];
        if (!Z) return;
        this._attrsByLName[G] = void 0;
        var I = this._attrKeys.indexOf(G);
        if (this._attributes) Array.prototype.splice.call(this._attributes, I, 1);
        this._attrKeys.splice(I, 1), this._removeQName(Z);
        var Y = Z.onchange;
        if (Z._setOwnerElement(null), Y) Y.call(Z, this, Z.localName, Z.value, null);
        if (this.rooted) this.ownerDocument.mutateRemoveAttr(Z)
      }
    },
    removeAttributeNode: {
      value: function(Q) {
        var B = Q.namespaceURI,
          G = (B === null ? "" : B) + "|" + Q.localName;
        if (this._attrsByLName[G] !== Q) oY.NotFoundError();
        return this.removeAttributeNS(B, Q.localName), Q
      }
    },
    getAttributeNames: {
      value: function() {
        var Q = this;
        return this._attrKeys.map(function(B) {
          return Q._attrsByLName[B].name
        })
      }
    },
    _getattr: {
      value: function(Q) {
        var B = this._attrsByQName[Q];
        return B ? B.value : null
      }
    },
    _setattr: {
      value: function(Q, B) {
        var G = this._attrsByQName[Q],
          Z;
        if (!G) G = this._newattr(Q), Z = !0;
        if (G.value = String(B), this._attributes) this._attributes[Q] = G;
        if (Z && this._newattrhook) this._newattrhook(Q, B)
      }
    },
    _newattr: {
      value: function(Q) {
        var B = new PTA(this, Q, null, null),
          G = "|" + Q;
        if (this._attrsByQName[Q] = B, this._attrsByLName[G] = B, this._attributes) this._attributes[this._attrKeys.length] = B;
        return this._attrKeys.push(G), B
      }
    },
    _addQName: {
      value: function(A) {
        var Q = A.name,
          B = this._attrsByQName[Q];
        if (!B) this._attrsByQName[Q] = A;
        else if (Array.isArray(B)) B.push(A);
        else this._attrsByQName[Q] = [B, A];
        if (this._attributes) this._attributes[Q] = A
      }
    },
    _removeQName: {
      value: function(A) {
        var Q = A.name,
          B = this._attrsByQName[Q];
        if (Array.isArray(B)) {
          var G = B.indexOf(A);
          if (oY.assert(G !== -1), B.length === 2) {
            if (this._attrsByQName[Q] = B[1 - G], this._attributes) this._attributes[Q] = this._attrsByQName[Q]
          } else if (B.splice(G, 1), this._attributes && this._attributes[Q] === A) this._attributes[Q] = B[0]
        } else if (oY.assert(B === A), this._attrsByQName[Q] = void 0, this._attributes) this._attributes[Q] = void 0
      }
    },
    _numattrs: {
      get: function() {
        return this._attrKeys.length
      }
    },
    _attr: {
      value: function(A) {
        return this._attrsByLName[this._attrKeys[A]]
      }
    },
    id: P31.property({
      name: "id"
    }),
    className: P31.property({
      name: "class"
    }),
    classList: {
      get: function() {
        var A = this;
        if (this._classList) return this._classList;
        var Q = new ks5(function() {
          return A.className || ""
        }, function(B) {
          A.className = B
        });
        return this._classList = Q, Q
      },
      set: function(A) {
        this.className = A
      }
    },
    matches: {
      value: function(A) {
        return IG0.matches(this, A)
      }
    },
    closest: {
      value: function(A) {
        var Q = this;
        do {
          if (Q.matches && Q.matches(A)) return Q;
          Q = Q.parentElement || Q.parentNode
        } while (Q !== null && Q.nodeType === hP.ELEMENT_NODE);
        return null
      }
    },
    querySelector: {
      value: function(A) {
        return IG0(A, this)[0]
      }
    },
    querySelectorAll: {
      value: function(A) {
        var Q = IG0(A, this);
        return Q.item ? Q : new ZG0(Q)
      }
    }
  });
  Object.defineProperties(un.prototype, ys5);
  Object.defineProperties(un.prototype, xs5);
  P31.registerChangeHandler(un, "id", function(A, Q, B, G) {
    if (A.rooted) {
      if (B) A.ownerDocument.delId(B, A);
      if (G) A.ownerDocument.addId(G, A)
    }
  });
  P31.registerChangeHandler(un, "class", function(A, Q, B, G) {
    if (A._classList) A._classList._update()
  });

  function PTA(A, Q, B, G, Z) {
    this.localName = Q, this.prefix = B === null || B === "" ? null : "" + B, this.namespaceURI = G === null || G === "" ? null : "" + G, this.data = Z, this._setOwnerElement(A)
  }
  PTA.prototype = Object.create(Object.prototype, {
    ownerElement: {
      get: function() {
        return this._ownerElement
      }
    },
    _setOwnerElement: {
      value: function(Q) {
        if (this._ownerElement = Q, this.prefix === null && this.namespaceURI === null && Q) this.onchange = Q._attributeChangeHandlers[this.localName];
        else this.onchange = null
      }
    },
    name: {
      get: function() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName
      }
    },
    specified: {
      get: function() {
        return !0
      }
    },
    value: {
      get: function() {
        return this.data
      },
      set: function(A) {
        var Q = this.data;
        if (A = A === void 0 ? "" : A + "", A === Q) return;
        if (this.data = A, this.ownerElement) {
          if (this.onchange) this.onchange(this.ownerElement, this.localName, Q, A);
          if (this.ownerElement.rooted) this.ownerElement.ownerDocument.mutateAttr(this, Q)
        }
      }
    },
    cloneNode: {
      value: function(Q) {
        return new PTA(null, this.localName, this.prefix, this.namespaceURI, this.data)
      }
    },
    nodeType: {
      get: function() {
        return hP.ATTRIBUTE_NODE
      }
    },
    nodeName: {
      get: function() {
        return this.name
      }
    },
    nodeValue: {
      get: function() {
        return this.value
      },
      set: function(A) {
        this.value = A
      }
    },
    textContent: {
      get: function() {
        return this.value
      },
      set: function(A) {
        if (A === null || A === void 0) A = "";
        this.value = A
      }
    },
    innerText: {
      get: function() {
        return this.value
      },
      set: function(A) {
        if (A === null || A === void 0) A = "";
        this.value = A
      }
    }
  });
  un._Attr = PTA;

  function WG0(A) {
    Zg2.call(this, A);
    for (var Q in A._attrsByQName) this[Q] = A._attrsByQName[Q];
    for (var B = 0; B < A._attrKeys.length; B++) this[B] = A._attrsByLName[A._attrKeys[B]]
  }
  WG0.prototype = Object.create(Zg2.prototype, {
    length: {
      get: function() {
        return this.element._attrKeys.length
      },
      set: function() {}
    },
    item: {
      value: function(A) {
        if (A = A >>> 0, A >= this.length) return null;
        return this.element._attrsByLName[this.element._attrKeys[A]]
      }
    }
  });
  if (globalThis.Symbol?.iterator) WG0.prototype[globalThis.Symbol.iterator] = function() {
    var A = 0,
      Q = this.length,
      B = this;
    return {
      next: function() {
        if (A < Q) return {
          value: B.item(A++)
        };
        return {
          done: !0
        }
      }
    }
  };

  function Ig2(A) {
    this.element = A, this.updateCache()
  }
  Ig2.prototype = Object.create(Object.prototype, {
    length: {
      get: function() {
        return this.updateCache(), this.childrenByNumber.length
      }
    },
    item: {
      value: function(Q) {
        return this.updateCache(), this.childrenByNumber[Q] || null
      }
    },
    namedItem: {
      value: function(Q) {
        return this.updateCache(), this.childrenByName[Q] || null
      }
    },
    namedItems: {
      get: function() {
        return this.updateCache(), this.childrenByName
      }
    },
    updateCache: {
      value: function() {
        var Q = /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
        if (this.lastModTime !== this.element.lastModTime) {
          this.lastModTime = this.element.lastModTime;
          var B = this.childrenByNumber && this.childrenByNumber.length || 0;
          for (var G = 0; G < B; G++) this[G] = void 0;
          this.childrenByNumber = [], this.childrenByName = Object.create(null);
          for (var Z = this.element.firstChild; Z !== null; Z = Z.nextSibling)
            if (Z.nodeType === hP.ELEMENT_NODE) {
              this[this.childrenByNumber.length] = Z, this.childrenByNumber.push(Z);
              var I = Z.getAttribute("id");
              if (I && !this.childrenByName[I]) this.childrenByName[I] = Z;
              var Y = Z.getAttribute("name");
              if (Y && this.element.namespaceURI === yy.HTML && Q.test(this.element.localName) && !this.childrenByName[Y]) this.childrenByName[I] = Z
            }
        }
      }
    }
  });

  function JG0(A) {
    return function(Q) {
      return Q.localName === A
    }
  }

  function vs5(A) {
    var Q = oY.toASCIILowerCase(A);
    if (Q === A) return JG0(A);
    return function(B) {
      return B.isHTML ? B.localName === Q : B.localName === A
    }
  }

  function bs5(A) {
    return function(Q) {
      return Q.namespaceURI === A
    }
  }

  function fs5(A, Q) {
    return function(B) {
      return B.namespaceURI === A && B.localName === Q
    }
  }

  function hs5(A) {
    return function(Q) {
      return A.every(function(B) {
        return Q.classList.contains(B)
      })
    }
  }

  function gs5(A) {
    return function(Q) {
      if (Q.namespaceURI !== yy.HTML) return !1;
      return Q.getAttribute("name") === A
    }
  }
})
// @from(Start 12011633, End 12012663)
XG0 = z((pJZ, Fg2) => {
  Fg2.exports = Vg2;
  var Wg2 = nD(),
    us5 = h0A(),
    Xg2 = dJ(),
    Jg2 = Xg2.HierarchyRequestError,
    ms5 = Xg2.NotFoundError;

  function Vg2() {
    Wg2.call(this)
  }
  Vg2.prototype = Object.create(Wg2.prototype, {
    hasChildNodes: {
      value: function() {
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
      value: function(A, Q) {
        if (!A.nodeType) throw TypeError("not a node");
        Jg2()
      }
    },
    replaceChild: {
      value: function(A, Q) {
        if (!A.nodeType) throw TypeError("not a node");
        Jg2()
      }
    },
    removeChild: {
      value: function(A) {
        if (!A.nodeType) throw TypeError("not a node");
        ms5()
      }
    },
    removeChildren: {
      value: function() {}
    },
    childNodes: {
      get: function() {
        if (!this._childNodes) this._childNodes = new us5;
        return this._childNodes
      }
    }
  })
})
// @from(Start 12012669, End 12014158)
jTA = z((lJZ, Hg2) => {
  Hg2.exports = j31;
  var Dg2 = XG0(),
    Kg2 = dJ(),
    ds5 = R31(),
    cs5 = QG0();

  function j31() {
    Dg2.call(this)
  }
  j31.prototype = Object.create(Dg2.prototype, {
    substringData: {
      value: function(Q, B) {
        if (arguments.length < 2) throw TypeError("Not enough arguments");
        if (Q = Q >>> 0, B = B >>> 0, Q > this.data.length || Q < 0 || B < 0) Kg2.IndexSizeError();
        return this.data.substring(Q, Q + B)
      }
    },
    appendData: {
      value: function(Q) {
        if (arguments.length < 1) throw TypeError("Not enough arguments");
        this.data += String(Q)
      }
    },
    insertData: {
      value: function(Q, B) {
        return this.replaceData(Q, 0, B)
      }
    },
    deleteData: {
      value: function(Q, B) {
        return this.replaceData(Q, B, "")
      }
    },
    replaceData: {
      value: function(Q, B, G) {
        var Z = this.data,
          I = Z.length;
        if (Q = Q >>> 0, B = B >>> 0, G = String(G), Q > I || Q < 0) Kg2.IndexSizeError();
        if (Q + B > I) B = I - Q;
        var Y = Z.substring(0, Q),
          J = Z.substring(Q + B);
        this.data = Y + G + J
      }
    },
    isEqual: {
      value: function(Q) {
        return this._data === Q._data
      }
    },
    length: {
      get: function() {
        return this.data.length
      }
    }
  });
  Object.defineProperties(j31.prototype, ds5);
  Object.defineProperties(j31.prototype, cs5)
})
// @from(Start 12014164, End 12015872)
FG0 = z((iJZ, Ug2) => {
  Ug2.exports = VG0;
  var Cg2 = dJ(),
    Eg2 = nD(),
    zg2 = jTA();

  function VG0(A, Q) {
    zg2.call(this), this.nodeType = Eg2.TEXT_NODE, this.ownerDocument = A, this._data = Q, this._index = void 0
  }
  var STA = {
    get: function() {
      return this._data
    },
    set: function(A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (A === this._data) return;
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this);
      if (this.parentNode && this.parentNode._textchangehook) this.parentNode._textchangehook(this)
    }
  };
  VG0.prototype = Object.create(zg2.prototype, {
    nodeName: {
      value: "#text"
    },
    nodeValue: STA,
    textContent: STA,
    innerText: STA,
    data: {
      get: STA.get,
      set: function(A) {
        STA.set.call(this, A === null ? "" : String(A))
      }
    },
    splitText: {
      value: function(Q) {
        if (Q > this._data.length || Q < 0) Cg2.IndexSizeError();
        var B = this._data.substring(Q),
          G = this.ownerDocument.createTextNode(B);
        this.data = this.data.substring(0, Q);
        var Z = this.parentNode;
        if (Z !== null) Z.insertBefore(G, this.nextSibling);
        return G
      }
    },
    wholeText: {
      get: function() {
        var Q = this.textContent;
        for (var B = this.nextSibling; B; B = B.nextSibling) {
          if (B.nodeType !== Eg2.TEXT_NODE) break;
          Q += B.textContent
        }
        return Q
      }
    },
    replaceWholeText: {
      value: Cg2.nyi
    },
    clone: {
      value: function() {
        return new VG0(this.ownerDocument, this._data)
      }
    }
  })
})
// @from(Start 12015878, End 12016729)
DG0 = z((nJZ, wg2) => {
  wg2.exports = KG0;
  var ps5 = nD(),
    $g2 = jTA();

  function KG0(A, Q) {
    $g2.call(this), this.nodeType = ps5.COMMENT_NODE, this.ownerDocument = A, this._data = Q
  }
  var _TA = {
    get: function() {
      return this._data
    },
    set: function(A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
    }
  };
  KG0.prototype = Object.create($g2.prototype, {
    nodeName: {
      value: "#comment"
    },
    nodeValue: _TA,
    textContent: _TA,
    innerText: _TA,
    data: {
      get: _TA.get,
      set: function(A) {
        _TA.set.call(this, A === null ? "" : String(A))
      }
    },
    clone: {
      value: function() {
        return new KG0(this.ownerDocument, this._data)
      }
    }
  })
})
// @from(Start 12016735, End 12018237)
CG0 = z((aJZ, Lg2) => {
  Lg2.exports = HG0;
  var ls5 = nD(),
    is5 = h0A(),
    Ng2 = w31(),
    S31 = cWA(),
    ns5 = O31(),
    qg2 = dJ();

  function HG0(A) {
    Ng2.call(this), this.nodeType = ls5.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = A
  }
  HG0.prototype = Object.create(Ng2.prototype, {
    nodeName: {
      value: "#document-fragment"
    },
    nodeValue: {
      get: function() {
        return null
      },
      set: function() {}
    },
    textContent: Object.getOwnPropertyDescriptor(S31.prototype, "textContent"),
    innerText: Object.getOwnPropertyDescriptor(S31.prototype, "innerText"),
    querySelector: {
      value: function(A) {
        var Q = this.querySelectorAll(A);
        return Q.length ? Q[0] : null
      }
    },
    querySelectorAll: {
      value: function(A) {
        var Q = Object.create(this);
        Q.isHTML = !0, Q.getElementsByTagName = S31.prototype.getElementsByTagName, Q.nextElement = Object.getOwnPropertyDescriptor(S31.prototype, "firstElementChild").get;
        var B = ns5(A, Q);
        return B.item ? B : new is5(B)
      }
    },
    clone: {
      value: function() {
        return new HG0(this.ownerDocument)
      }
    },
    isEqual: {
      value: function(Q) {
        return !0
      }
    },
    innerHTML: {
      get: function() {
        return this.serialize()
      },
      set: qg2.nyi
    },
    outerHTML: {
      get: function() {
        return this.serialize()
      },
      set: qg2.nyi
    }
  })
})
// @from(Start 12018243, End 12019300)
zG0 = z((sJZ, Og2) => {
  Og2.exports = EG0;
  var as5 = nD(),
    Mg2 = jTA();

  function EG0(A, Q, B) {
    Mg2.call(this), this.nodeType = as5.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = A, this.target = Q, this._data = B
  }
  var kTA = {
    get: function() {
      return this._data
    },
    set: function(A) {
      if (A === null || A === void 0) A = "";
      else A = String(A);
      if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
    }
  };
  EG0.prototype = Object.create(Mg2.prototype, {
    nodeName: {
      get: function() {
        return this.target
      }
    },
    nodeValue: kTA,
    textContent: kTA,
    innerText: kTA,
    data: {
      get: kTA.get,
      set: function(A) {
        kTA.set.call(this, A === null ? "" : String(A))
      }
    },
    clone: {
      value: function() {
        return new EG0(this.ownerDocument, this.target, this._data)
      }
    },
    isEqual: {
      value: function(Q) {
        return this.target === Q.target && this._data === Q._data
      }
    }
  })
})
// @from(Start 12019306, End 12019807)
yTA = z((rJZ, Rg2) => {
  var UG0 = {
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
  Rg2.exports = UG0.constructor = UG0.prototype = UG0
})
// @from(Start 12019813, End 12020737)
wG0 = z((tJZ, Pg2) => {
  var oJZ = Pg2.exports = {
    nextSkippingChildren: ss5,
    nextAncestorSibling: $G0,
    next: rs5,
    previous: os5,
    deepLastChild: Tg2
  };

  function ss5(A, Q) {
    if (A === Q) return null;
    if (A.nextSibling !== null) return A.nextSibling;
    return $G0(A, Q)
  }

  function $G0(A, Q) {
    for (A = A.parentNode; A !== null; A = A.parentNode) {
      if (A === Q) return null;
      if (A.nextSibling !== null) return A.nextSibling
    }
    return null
  }

  function rs5(A, Q) {
    var B = A.firstChild;
    if (B !== null) return B;
    if (A === Q) return null;
    if (B = A.nextSibling, B !== null) return B;
    return $G0(A, Q)
  }

  function Tg2(A) {
    while (A.lastChild) A = A.lastChild;
    return A
  }

  function os5(A, Q) {
    var B = A.previousSibling;
    if (B !== null) return Tg2(B);
    if (B = A.parentNode, B === Q) return null;
    return B
  }
})
// @from(Start 12020743, End 12025617)
vg2 = z((eJZ, xg2) => {
  xg2.exports = yg2;
  var ts5 = nD(),
    aD = yTA(),
    jg2 = wG0(),
    kg2 = dJ(),
    qG0 = {
      first: "firstChild",
      last: "lastChild",
      next: "firstChild",
      previous: "lastChild"
    },
    NG0 = {
      first: "nextSibling",
      last: "previousSibling",
      next: "nextSibling",
      previous: "previousSibling"
    };

  function Sg2(A, Q) {
    var B, G, Z, I, Y;
    G = A._currentNode[qG0[Q]];
    while (G !== null) {
      if (I = A._internalFilter(G), I === aD.FILTER_ACCEPT) return A._currentNode = G, G;
      if (I === aD.FILTER_SKIP) {
        if (B = G[qG0[Q]], B !== null) {
          G = B;
          continue
        }
      }
      while (G !== null) {
        if (Y = G[NG0[Q]], Y !== null) {
          G = Y;
          break
        }
        if (Z = G.parentNode, Z === null || Z === A.root || Z === A._currentNode) return null;
        else G = Z
      }
    }
    return null
  }

  function _g2(A, Q) {
    var B, G, Z;
    if (B = A._currentNode, B === A.root) return null;
    while (!0) {
      Z = B[NG0[Q]];
      while (Z !== null) {
        if (B = Z, G = A._internalFilter(B), G === aD.FILTER_ACCEPT) return A._currentNode = B, B;
        if (Z = B[qG0[Q]], G === aD.FILTER_REJECT || Z === null) Z = B[NG0[Q]]
      }
      if (B = B.parentNode, B === null || B === A.root) return null;
      if (A._internalFilter(B) === aD.FILTER_ACCEPT) return null
    }
  }

  function yg2(A, Q, B) {
    if (!A || !A.nodeType) kg2.NotSupportedError();
    this._root = A, this._whatToShow = Number(Q) || 0, this._filter = B || null, this._active = !1, this._currentNode = A
  }
  Object.defineProperties(yg2.prototype, {
    root: {
      get: function() {
        return this._root
      }
    },
    whatToShow: {
      get: function() {
        return this._whatToShow
      }
    },
    filter: {
      get: function() {
        return this._filter
      }
    },
    currentNode: {
      get: function() {
        return this._currentNode
      },
      set: function(Q) {
        if (!(Q instanceof ts5)) throw TypeError("Not a Node");
        this._currentNode = Q
      }
    },
    _internalFilter: {
      value: function(Q) {
        var B, G;
        if (this._active) kg2.InvalidStateError();
        if (!(1 << Q.nodeType - 1 & this._whatToShow)) return aD.FILTER_SKIP;
        if (G = this._filter, G === null) B = aD.FILTER_ACCEPT;
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
      value: function() {
        var Q = this._currentNode;
        while (Q !== this.root) {
          if (Q = Q.parentNode, Q === null) return null;
          if (this._internalFilter(Q) === aD.FILTER_ACCEPT) return this._currentNode = Q, Q
        }
        return null
      }
    },
    firstChild: {
      value: function() {
        return Sg2(this, "first")
      }
    },
    lastChild: {
      value: function() {
        return Sg2(this, "last")
      }
    },
    previousSibling: {
      value: function() {
        return _g2(this, "previous")
      }
    },
    nextSibling: {
      value: function() {
        return _g2(this, "next")
      }
    },
    previousNode: {
      value: function() {
        var Q, B, G, Z;
        Q = this._currentNode;
        while (Q !== this._root) {
          for (G = Q.previousSibling; G; G = Q.previousSibling) {
            if (Q = G, B = this._internalFilter(Q), B === aD.FILTER_REJECT) continue;
            for (Z = Q.lastChild; Z; Z = Q.lastChild)
              if (Q = Z, B = this._internalFilter(Q), B === aD.FILTER_REJECT) break;
            if (B === aD.FILTER_ACCEPT) return this._currentNode = Q, Q
          }
          if (Q === this.root || Q.parentNode === null) return null;
          if (Q = Q.parentNode, this._internalFilter(Q) === aD.FILTER_ACCEPT) return this._currentNode = Q, Q
        }
        return null
      }
    },
    nextNode: {
      value: function() {
        var Q, B, G, Z;
        Q = this._currentNode, B = aD.FILTER_ACCEPT;
        A: while (!0) {
          for (G = Q.firstChild; G; G = Q.firstChild)
            if (Q = G, B = this._internalFilter(Q), B === aD.FILTER_ACCEPT) return this._currentNode = Q, Q;
            else if (B === aD.FILTER_REJECT) break;
          for (Z = jg2.nextSkippingChildren(Q, this.root); Z; Z = jg2.nextSkippingChildren(Q, this.root))
            if (Q = Z, B = this._internalFilter(Q), B === aD.FILTER_ACCEPT) return this._currentNode = Q, Q;
            else if (B === aD.FILTER_SKIP) continue A;
          return null
        }
      }
    },
    toString: {
      value: function() {
        return "[object TreeWalker]"
      }
    }
  })
})
// @from(Start 12025623, End 12028686)
mg2 = z((AWZ, ug2) => {
  ug2.exports = gg2;
  var LG0 = yTA(),
    MG0 = wG0(),
    hg2 = dJ();

  function es5(A, Q, B) {
    if (B) return MG0.next(A, Q);
    else {
      if (A === Q) return null;
      return MG0.previous(A, null)
    }
  }

  function bg2(A, Q) {
    for (; Q; Q = Q.parentNode)
      if (A === Q) return !0;
    return !1
  }

  function fg2(A, Q) {
    var B, G;
    B = A._referenceNode, G = A._pointerBeforeReferenceNode;
    while (!0) {
      if (G === Q) G = !G;
      else if (B = es5(B, A._root, Q), B === null) return null;
      var Z = A._internalFilter(B);
      if (Z === LG0.FILTER_ACCEPT) break
    }
    return A._referenceNode = B, A._pointerBeforeReferenceNode = G, B
  }

  function gg2(A, Q, B) {
    if (!A || !A.nodeType) hg2.NotSupportedError();
    this._root = A, this._referenceNode = A, this._pointerBeforeReferenceNode = !0, this._whatToShow = Number(Q) || 0, this._filter = B || null, this._active = !1, A.doc._attachNodeIterator(this)
  }
  Object.defineProperties(gg2.prototype, {
    root: {
      get: function() {
        return this._root
      }
    },
    referenceNode: {
      get: function() {
        return this._referenceNode
      }
    },
    pointerBeforeReferenceNode: {
      get: function() {
        return this._pointerBeforeReferenceNode
      }
    },
    whatToShow: {
      get: function() {
        return this._whatToShow
      }
    },
    filter: {
      get: function() {
        return this._filter
      }
    },
    _internalFilter: {
      value: function(Q) {
        var B, G;
        if (this._active) hg2.InvalidStateError();
        if (!(1 << Q.nodeType - 1 & this._whatToShow)) return LG0.FILTER_SKIP;
        if (G = this._filter, G === null) B = LG0.FILTER_ACCEPT;
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
      value: function(Q) {
        if (bg2(Q, this._root)) return;
        if (!bg2(Q, this._referenceNode)) return;
        if (this._pointerBeforeReferenceNode) {
          var B = Q;
          while (B.lastChild) B = B.lastChild;
          if (B = MG0.next(B, this.root), B) {
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
      value: function() {
        return fg2(this, !0)
      }
    },
    previousNode: {
      value: function() {
        return fg2(this, !1)
      }
    },
    detach: {
      value: function() {}
    },
    toString: {
      value: function() {
        return "[object NodeIterator]"
      }
    }
  })
})
// @from(Start 12028692, End 12032607)
_31 = z((QWZ, dg2) => {
  dg2.exports = sD;

  function sD(A) {
    if (!A) return Object.create(sD.prototype);
    this.url = A.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
    var Q = sD.pattern.exec(this.url);
    if (Q) {
      if (Q[2]) this.scheme = Q[2];
      if (Q[4]) {
        var B = Q[4].match(sD.userinfoPattern);
        if (B) this.username = B[1], this.password = B[3], Q[4] = Q[4].substring(B[0].length);
        if (Q[4].match(sD.portPattern)) {
          var G = Q[4].lastIndexOf(":");
          this.host = Q[4].substring(0, G), this.port = Q[4].substring(G + 1)
        } else this.host = Q[4]
      }
      if (Q[5]) this.path = Q[5];
      if (Q[6]) this.query = Q[7];
      if (Q[8]) this.fragment = Q[9]
    }
  }
  sD.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
  sD.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
  sD.portPattern = /:\d+$/;
  sD.authorityPattern = /^[^:\/?#]+:\/\//;
  sD.hierarchyPattern = /^[^:\/?#]+:\//;
  sD.percentEncode = function(Q) {
    var B = Q.charCodeAt(0);
    if (B < 256) return "%" + B.toString(16);
    else throw Error("can't percent-encode codepoints > 255 yet")
  };
  sD.prototype = {
    constructor: sD,
    isAbsolute: function() {
      return !!this.scheme
    },
    isAuthorityBased: function() {
      return sD.authorityPattern.test(this.url)
    },
    isHierarchical: function() {
      return sD.hierarchyPattern.test(this.url)
    },
    toString: function() {
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
    resolve: function(A) {
      var Q = this,
        B = new sD(A),
        G = new sD;
      if (B.scheme !== void 0) G.scheme = B.scheme, G.username = B.username, G.password = B.password, G.host = B.host, G.port = B.port, G.path = I(B.path), G.query = B.query;
      else if (G.scheme = Q.scheme, B.host !== void 0) G.username = B.username, G.password = B.password, G.host = B.host, G.port = B.port, G.path = I(B.path), G.query = B.query;
      else if (G.username = Q.username, G.password = Q.password, G.host = Q.host, G.port = Q.port, !B.path)
        if (G.path = Q.path, B.query !== void 0) G.query = B.query;
        else G.query = Q.query;
      else {
        if (B.path.charAt(0) === "/") G.path = I(B.path);
        else G.path = Z(Q.path, B.path), G.path = I(G.path);
        G.query = B.query
      }
      return G.fragment = B.fragment, G.toString();

      function Z(Y, J) {
        if (Q.host !== void 0 && !Q.path) return "/" + J;
        var W = Y.lastIndexOf("/");
        if (W === -1) return J;
        else return Y.substring(0, W + 1) + J
      }

      function I(Y) {
        if (!Y) return Y;
        var J = "";
        while (Y.length > 0) {
          if (Y === "." || Y === "..") {
            Y = "";
            break
          }
          var W = Y.substring(0, 2),
            X = Y.substring(0, 3),
            V = Y.substring(0, 4);
          if (X === "../") Y = Y.substring(3);
          else if (W === "./") Y = Y.substring(2);
          else if (X === "/./") Y = "/" + Y.substring(3);
          else if (W === "/." && Y.length === 2) Y = "/";
          else if (V === "/../" || X === "/.." && Y.length === 3) Y = "/" + Y.substring(4), J = J.replace(/\/?[^\/]*$/, "");
          else {
            var F = Y.match(/(\/?([^\/]*))/)[0];
            J += F, Y = Y.substring(F.length)
          }
        }
        return J
      }
    }
  }
})
// @from(Start 12032613, End 12032828)
lg2 = z((BWZ, pg2) => {
  pg2.exports = OG0;
  var cg2 = bWA();

  function OG0(A, Q) {
    cg2.call(this, A, Q)
  }
  OG0.prototype = Object.create(cg2.prototype, {
    constructor: {
      value: OG0
    }
  })
})
// @from(Start 12032834, End 12032966)
RG0 = z((GWZ, ig2) => {
  ig2.exports = {
    Event: bWA(),
    UIEvent: _70(),
    MouseEvent: y70(),
    CustomEvent: lg2()
  }
})
// @from(Start 12032972, End 12034172)
rg2 = z((ag2) => {
  Object.defineProperty(ag2, "__esModule", {
    value: !0
  });
  ag2.hyphenate = ag2.parse = void 0;

  function Ar5(A) {
    let Q = [],
      B = 0,
      G = 0,
      Z = 0,
      I = 0,
      Y = 0,
      J = null;
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
        if (!J && G === 0 && Z === 0) J = ng2(A.substring(Y, B - 1).trim()), I = B;
        break;
      case 59:
        if (J && I > 0 && G === 0 && Z === 0) {
          let X = A.substring(I, B - 1).trim();
          Q.push(J, X), Y = B, I = 0, J = null
        }
        break
    }
    if (J && I) {
      let W = A.slice(I).trim();
      Q.push(J, W)
    }
    return Q
  }
  ag2.parse = Ar5;

  function ng2(A) {
    return A.replace(/[a-z][A-Z]/g, (Q) => {
      return Q.charAt(0) + "-" + Q.charAt(1)
    }).toLowerCase()
  }
  ag2.hyphenate = ng2
})
// @from(Start 12034178, End 12038200)
k31 = z((IWZ, Qu2) => {
  var {
    parse: Br5
  } = rg2();
  Qu2.exports = function(A) {
    let Q = new Au2(A);
    return new Proxy(Q, {
      get: function(G, Z) {
        return Z in G ? G[Z] : G.getPropertyValue(og2(Z))
      },
      has: function(G, Z) {
        return !0
      },
      set: function(G, Z, I) {
        if (Z in G) G[Z] = I;
        else G.setProperty(og2(Z), I ?? void 0);
        return !0
      }
    })
  };

  function og2(A) {
    return A.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  }

  function Au2(A) {
    this._element = A
  }
  var tg2 = "!important";

  function eg2(A) {
    let Q = {
      property: {},
      priority: {}
    };
    if (!A) return Q;
    let B = Br5(A);
    if (B.length < 2) return Q;
    for (let G = 0; G < B.length; G += 2) {
      let Z = B[G],
        I = B[G + 1];
      if (I.endsWith(tg2)) Q.priority[Z] = "important", I = I.slice(0, -tg2.length).trim();
      Q.property[Z] = I
    }
    return Q
  }
  var pWA = {};
  Au2.prototype = Object.create(Object.prototype, {
    _parsed: {
      get: function() {
        if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
          var A = this.cssText;
          this._parsedStyles = eg2(A), this._lastParsedText = A, delete this._names
        }
        return this._parsedStyles
      }
    },
    _serialize: {
      value: function() {
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
      get: function() {
        return this._element.getAttribute("style")
      },
      set: function(A) {
        this._element.setAttribute("style", A)
      }
    },
    length: {
      get: function() {
        if (!this._names) this._names = Object.getOwnPropertyNames(this._parsed.property);
        return this._names.length
      }
    },
    item: {
      value: function(A) {
        if (!this._names) this._names = Object.getOwnPropertyNames(this._parsed.property);
        return this._names[A]
      }
    },
    getPropertyValue: {
      value: function(A) {
        return A = A.toLowerCase(), this._parsed.property[A] || ""
      }
    },
    getPropertyPriority: {
      value: function(A) {
        return A = A.toLowerCase(), this._parsed.priority[A] || ""
      }
    },
    setProperty: {
      value: function(A, Q, B) {
        if (A = A.toLowerCase(), Q === null || Q === void 0) Q = "";
        if (B === null || B === void 0) B = "";
        if (Q !== pWA) Q = "" + Q;
        if (Q = Q.trim(), Q === "") {
          this.removeProperty(A);
          return
        }
        if (B !== "" && B !== pWA && !/^important$/i.test(B)) return;
        var G = this._parsed;
        if (Q === pWA) {
          if (!G.property[A]) return;
          if (B !== "") G.priority[A] = "important";
          else delete G.priority[A]
        } else {
          if (Q.indexOf(";") !== -1) return;
          var Z = eg2(A + ":" + Q);
          if (Object.getOwnPropertyNames(Z.property).length === 0) return;
          if (Object.getOwnPropertyNames(Z.priority).length !== 0) return;
          for (var I in Z.property)
            if (G.property[I] = Z.property[I], B === pWA) continue;
            else if (B !== "") G.priority[I] = "important";
          else if (G.priority[I]) delete G.priority[I]
        }
        this._serialize()
      }
    },
    setPropertyValue: {
      value: function(A, Q) {
        return this.setProperty(A, Q, pWA)
      }
    },
    setPropertyPriority: {
      value: function(A, Q) {
        return this.setProperty(A, pWA, Q)
      }
    },
    removeProperty: {
      value: function(A) {
        A = A.toLowerCase();
        var Q = this._parsed;
        if (A in Q.property) delete Q.property[A], delete Q.priority[A], this._serialize()
      }
    }
  })
})
// @from(Start 12038206, End 12043579)
TG0 = z((YWZ, Bu2) => {
  var CK = _31();
  Bu2.exports = xTA;

  function xTA() {}
  xTA.prototype = Object.create(Object.prototype, {
    _url: {
      get: function() {
        return new CK(this.href)
      }
    },
    protocol: {
      get: function() {
        var A = this._url;
        if (A && A.scheme) return A.scheme + ":";
        else return ":"
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute()) {
          if (A = A.replace(/:+$/, ""), A = A.replace(/[^-+\.a-zA-Z0-9]/g, CK.percentEncode), A.length > 0) B.scheme = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    host: {
      get: function() {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased()) return A.host + (A.port ? ":" + A.port : "");
        else return ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, CK.percentEncode), A.length > 0) B.host = A, delete B.port, Q = B.toString()
        }
        this.href = Q
      }
    },
    hostname: {
      get: function() {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased()) return A.host;
        else return ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = A.replace(/^\/+/, ""), A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, CK.percentEncode), A.length > 0) B.host = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    port: {
      get: function() {
        var A = this._url;
        if (A.isAbsolute() && A.isAuthorityBased() && A.port !== void 0) return A.port;
        else return ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute() && B.isAuthorityBased()) {
          if (A = "" + A, A = A.replace(/[^0-9].*$/, ""), A = A.replace(/^0+/, ""), A.length === 0) A = "0";
          if (parseInt(A, 10) <= 65535) B.port = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    pathname: {
      get: function() {
        var A = this._url;
        if (A.isAbsolute() && A.isHierarchical()) return A.path;
        else return ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute() && B.isHierarchical()) {
          if (A.charAt(0) !== "/") A = "/" + A;
          A = A.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, CK.percentEncode), B.path = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    search: {
      get: function() {
        var A = this._url;
        if (A.isAbsolute() && A.isHierarchical() && A.query !== void 0) return "?" + A.query;
        else return ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute() && B.isHierarchical()) {
          if (A.charAt(0) === "?") A = A.substring(1);
          A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, CK.percentEncode), B.query = A, Q = B.toString()
        }
        this.href = Q
      }
    },
    hash: {
      get: function() {
        var A = this._url;
        if (A == null || A.fragment == null || A.fragment === "") return "";
        else return "#" + A.fragment
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (A.charAt(0) === "#") A = A.substring(1);
        A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, CK.percentEncode), B.fragment = A, Q = B.toString(), this.href = Q
      }
    },
    username: {
      get: function() {
        var A = this._url;
        return A.username || ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute()) A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, CK.percentEncode), B.username = A, Q = B.toString();
        this.href = Q
      }
    },
    password: {
      get: function() {
        var A = this._url;
        return A.password || ""
      },
      set: function(A) {
        var Q = this.href,
          B = new CK(Q);
        if (B.isAbsolute()) {
          if (A === "") B.password = null;
          else A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, CK.percentEncode), B.password = A;
          Q = B.toString()
        }
        this.href = Q
      }
    },
    origin: {
      get: function() {
        var A = this._url;
        if (A == null) return "";
        var Q = function(B) {
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
  xTA._inherit = function(A) {
    Object.getOwnPropertyNames(xTA.prototype).forEach(function(Q) {
      if (Q === "constructor" || Q === "href") return;
      var B = Object.getOwnPropertyDescriptor(xTA.prototype, Q);
      Object.defineProperty(A, Q, B)
    })
  }
})
// @from(Start 12043585, End 12045028)
PG0 = z((JWZ, Iu2) => {
  var Gu2 = a70(),
    Gr5 = z31().isApiWritable;
  Iu2.exports = function(A, Q, B, G) {
    var Z = A.ctor;
    if (Z) {
      var I = A.props || {};
      if (A.attributes)
        for (var Y in A.attributes) {
          var J = A.attributes[Y];
          if (typeof J !== "object" || Array.isArray(J)) J = {
            type: J
          };
          if (!J.name) J.name = Y.toLowerCase();
          I[Y] = Gu2.property(J)
        }
      if (I.constructor = {
          value: Z,
          writable: Gr5
        }, Z.prototype = Object.create((A.superclass || Q).prototype, I), A.events) Ir5(Z, A.events);
      B[A.name] = Z
    } else Z = Q;
    return (A.tags || A.tag && [A.tag] || []).forEach(function(W) {
      G[W] = Z
    }), Z
  };

  function Zu2(A, Q, B, G) {
    this.body = A, this.document = Q, this.form = B, this.element = G
  }
  Zu2.prototype.build = function() {
    return () => {}
  };

  function Zr5(A, Q, B, G) {
    var Z = A.ownerDocument || Object.create(null),
      I = A.form || Object.create(null);
    A[Q] = new Zu2(G, Z, I, A).build()
  }

  function Ir5(A, Q) {
    var B = A.prototype;
    Q.forEach(function(G) {
      Object.defineProperty(B, "on" + G, {
        get: function() {
          return this._getEventHandler(G)
        },
        set: function(Z) {
          this._setEventHandler(G, Z)
        }
      }), Gu2.registerChangeHandler(A, "on" + G, Zr5)
    })
  }
})
// @from(Start 12045034, End 12080065)
x31 = z((Vr5) => {
  var jG0 = nD(),
    Yu2 = cWA(),
    Yr5 = k31(),
    hq = dJ(),
    Ju2 = TG0(),
    Jr5 = PG0(),
    Ig = Vr5.elements = {},
    vTA = Object.create(null);
  Vr5.createElement = function(A, Q, B) {
    var G = vTA[Q] || Xr5;
    return new G(A, Q, B)
  };

  function xB(A) {
    return Jr5(A, G9, Ig, vTA)
  }

  function cJ(A) {
    return {
      get: function() {
        var Q = this._getattr(A);
        if (Q === null) return "";
        var B = this.doc._resolve(Q);
        return B === null ? Q : B
      },
      set: function(Q) {
        this._setattr(A, Q)
      }
    }
  }

  function y31(A) {
    return {
      get: function() {
        var Q = this._getattr(A);
        if (Q === null) return null;
        if (Q.toLowerCase() === "use-credentials") return "use-credentials";
        return "anonymous"
      },
      set: function(Q) {
        if (Q === null || Q === void 0) this.removeAttribute(A);
        else this._setattr(A, Q)
      }
    }
  }
  var lWA = {
      type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
      missing: ""
    },
    Wr5 = {
      A: !0,
      LINK: !0,
      BUTTON: !0,
      INPUT: !0,
      SELECT: !0,
      TEXTAREA: !0,
      COMMAND: !0
    },
    gP = function(A, Q, B) {
      G9.call(this, A, Q, B), this._form = null
    },
    G9 = Vr5.HTMLElement = xB({
      superclass: Yu2,
      name: "HTMLElement",
      ctor: function(Q, B, G) {
        Yu2.call(this, Q, B, hq.NAMESPACE.HTML, G)
      },
      props: {
        dangerouslySetInnerHTML: {
          set: function(A) {
            this._innerHTML = A
          }
        },
        innerHTML: {
          get: function() {
            return this.serialize()
          },
          set: function(A) {
            var Q = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
            Q.parse(A === null ? "" : String(A), !0);
            var B = this instanceof vTA.template ? this.content : this;
            while (B.hasChildNodes()) B.removeChild(B.firstChild);
            B.appendChild(Q._asDocumentFragment())
          }
        },
        style: {
          get: function() {
            if (!this._style) this._style = new Yr5(this);
            return this._style
          },
          set: function(A) {
            if (A === null || A === void 0) A = "";
            this._setattr("style", String(A))
          }
        },
        blur: {
          value: function() {}
        },
        focus: {
          value: function() {}
        },
        forceSpellCheck: {
          value: function() {}
        },
        click: {
          value: function() {
            if (this._click_in_progress) return;
            this._click_in_progress = !0;
            try {
              if (this._pre_click_activation_steps) this._pre_click_activation_steps();
              var A = this.ownerDocument.createEvent("MouseEvent");
              A.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
              var Q = this.dispatchEvent(A);
              if (Q) {
                if (this._post_click_activation_steps) this._post_click_activation_steps(A)
              } else if (this._cancelled_activation_steps) this._cancelled_activation_steps()
            } finally {
              this._click_in_progress = !1
            }
          }
        },
        submit: {
          value: hq.nyi
        }
      },
      attributes: {
        title: String,
        lang: String,
        dir: {
          type: ["ltr", "rtl", "auto"],
          missing: ""
        },
        draggable: {
          type: ["true", "false"],
          treatNullAsEmptyString: !0
        },
        spellcheck: {
          type: ["true", "false"],
          missing: ""
        },
        enterKeyHint: {
          type: ["enter", "done", "go", "next", "previous", "search", "send"],
          missing: ""
        },
        autoCapitalize: {
          type: ["off", "on", "none", "sentences", "words", "characters"],
          missing: ""
        },
        autoFocus: Boolean,
        accessKey: String,
        nonce: String,
        hidden: Boolean,
        translate: {
          type: ["no", "yes"],
          missing: ""
        },
        tabIndex: {
          type: "long",
          default: function() {
            if (this.tagName in Wr5 || this.contentEditable) return 0;
            else return -1
          }
        }
      },
      events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"]
    }),
    Xr5 = xB({
      name: "HTMLUnknownElement",
      ctor: function(Q, B, G) {
        G9.call(this, Q, B, G)
      }
    }),
    uP = {
      form: {
        get: function() {
          return this._form
        }
      }
    };
  xB({
    tag: "a",
    name: "HTMLAnchorElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      _post_click_activation_steps: {
        value: function(A) {
          if (this.href) this.ownerDocument.defaultView.location = this.href
        }
      }
    },
    attributes: {
      href: cJ,
      ping: String,
      download: String,
      target: String,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      referrerPolicy: lWA,
      coords: String,
      charset: String,
      name: String,
      rev: String,
      shape: String
    }
  });
  Ju2._inherit(vTA.a.prototype);
  xB({
    tag: "area",
    name: "HTMLAreaElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      alt: String,
      target: String,
      download: String,
      rel: String,
      media: String,
      href: cJ,
      hreflang: String,
      type: String,
      shape: String,
      coords: String,
      ping: String,
      referrerPolicy: lWA,
      noHref: Boolean
    }
  });
  Ju2._inherit(vTA.area.prototype);
  xB({
    tag: "br",
    name: "HTMLBRElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      clear: String
    }
  });
  xB({
    tag: "base",
    name: "HTMLBaseElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      target: String
    }
  });
  xB({
    tag: "body",
    name: "HTMLBodyElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    events: ["afterprint", "beforeprint", "beforeunload", "blur", "error", "focus", "hashchange", "load", "message", "offline", "online", "pagehide", "pageshow", "popstate", "resize", "scroll", "storage", "unload"],
    attributes: {
      text: {
        type: String,
        treatNullAsEmptyString: !0
      },
      link: {
        type: String,
        treatNullAsEmptyString: !0
      },
      vLink: {
        type: String,
        treatNullAsEmptyString: !0
      },
      aLink: {
        type: String,
        treatNullAsEmptyString: !0
      },
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      },
      background: String
    }
  });
  xB({
    tag: "button",
    name: "HTMLButtonElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      name: String,
      value: String,
      disabled: Boolean,
      autofocus: Boolean,
      type: {
        type: ["submit", "reset", "button", "menu"],
        missing: "submit"
      },
      formTarget: String,
      formAction: cJ,
      formNoValidate: Boolean,
      formMethod: {
        type: ["get", "post", "dialog"],
        invalid: "get",
        missing: ""
      },
      formEnctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: ""
      }
    }
  });
  xB({
    tag: "dl",
    name: "HTMLDListElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      compact: Boolean
    }
  });
  xB({
    tag: "data",
    name: "HTMLDataElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      value: String
    }
  });
  xB({
    tag: "datalist",
    name: "HTMLDataListElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    }
  });
  xB({
    tag: "details",
    name: "HTMLDetailsElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      open: Boolean
    }
  });
  xB({
    tag: "div",
    name: "HTMLDivElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  xB({
    tag: "embed",
    name: "HTMLEmbedElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      src: cJ,
      type: String,
      width: String,
      height: String,
      align: String,
      name: String
    }
  });
  xB({
    tag: "fieldset",
    name: "HTMLFieldSetElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      disabled: Boolean,
      name: String
    }
  });
  xB({
    tag: "form",
    name: "HTMLFormElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      action: String,
      autocomplete: {
        type: ["on", "off"],
        missing: "on"
      },
      name: String,
      acceptCharset: {
        name: "accept-charset"
      },
      target: String,
      noValidate: Boolean,
      method: {
        type: ["get", "post", "dialog"],
        invalid: "get",
        missing: "get"
      },
      enctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: "application/x-www-form-urlencoded"
      },
      encoding: {
        name: "enctype",
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: "application/x-www-form-urlencoded"
      }
    }
  });
  xB({
    tag: "hr",
    name: "HTMLHRElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String,
      color: String,
      noShade: Boolean,
      size: String,
      width: String
    }
  });
  xB({
    tag: "head",
    name: "HTMLHeadElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    }
  });
  xB({
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    name: "HTMLHeadingElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  xB({
    tag: "html",
    name: "HTMLHtmlElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      xmlns: cJ,
      version: String
    }
  });
  xB({
    tag: "iframe",
    name: "HTMLIFrameElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      src: cJ,
      srcdoc: String,
      name: String,
      width: String,
      height: String,
      seamless: Boolean,
      allow: Boolean,
      allowFullscreen: Boolean,
      allowUserMedia: Boolean,
      allowPaymentRequest: Boolean,
      referrerPolicy: lWA,
      loading: {
        type: ["eager", "lazy"],
        treatNullAsEmptyString: !0
      },
      align: String,
      scrolling: String,
      frameBorder: String,
      longDesc: cJ,
      marginHeight: {
        type: String,
        treatNullAsEmptyString: !0
      },
      marginWidth: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tag: "img",
    name: "HTMLImageElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      alt: String,
      src: cJ,
      srcset: String,
      crossOrigin: y31,
      useMap: String,
      isMap: Boolean,
      sizes: String,
      height: {
        type: "unsigned long",
        default: 0
      },
      width: {
        type: "unsigned long",
        default: 0
      },
      referrerPolicy: lWA,
      loading: {
        type: ["eager", "lazy"],
        missing: ""
      },
      name: String,
      lowsrc: cJ,
      align: String,
      hspace: {
        type: "unsigned long",
        default: 0
      },
      vspace: {
        type: "unsigned long",
        default: 0
      },
      longDesc: cJ,
      border: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tag: "input",
    name: "HTMLInputElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: {
      form: uP.form,
      _post_click_activation_steps: {
        value: function(A) {
          if (this.type === "checkbox") this.checked = !this.checked;
          else if (this.type === "radio") {
            var Q = this.form.getElementsByName(this.name);
            for (var B = Q.length - 1; B >= 0; B--) {
              var G = Q[B];
              G.checked = G === this
            }
          }
        }
      }
    },
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      accept: String,
      alt: String,
      max: String,
      min: String,
      pattern: String,
      placeholder: String,
      step: String,
      dirName: String,
      defaultValue: {
        name: "value"
      },
      multiple: Boolean,
      required: Boolean,
      readOnly: Boolean,
      checked: Boolean,
      value: String,
      src: cJ,
      defaultChecked: {
        name: "checked",
        type: Boolean
      },
      size: {
        type: "unsigned long",
        default: 20,
        min: 1,
        setmin: 1
      },
      width: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: 0
      },
      height: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: 0
      },
      minLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      maxLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      autocomplete: String,
      type: {
        type: ["text", "hidden", "search", "tel", "url", "email", "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio", "file", "submit", "image", "reset", "button"],
        missing: "text"
      },
      formTarget: String,
      formNoValidate: Boolean,
      formMethod: {
        type: ["get", "post"],
        invalid: "get",
        missing: ""
      },
      formEnctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: ""
      },
      inputMode: {
        type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
        missing: ""
      },
      align: String,
      useMap: String
    }
  });
  xB({
    tag: "keygen",
    name: "HTMLKeygenElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      challenge: String,
      keytype: {
        type: ["rsa"],
        missing: ""
      }
    }
  });
  xB({
    tag: "li",
    name: "HTMLLIElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      value: {
        type: "long",
        default: 0
      },
      type: String
    }
  });
  xB({
    tag: "label",
    name: "HTMLLabelElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      htmlFor: {
        name: "for",
        type: String
      }
    }
  });
  xB({
    tag: "legend",
    name: "HTMLLegendElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  xB({
    tag: "link",
    name: "HTMLLinkElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      href: cJ,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      crossOrigin: y31,
      nonce: String,
      integrity: String,
      referrerPolicy: lWA,
      imageSizes: String,
      imageSrcset: String,
      charset: String,
      rev: String,
      target: String
    }
  });
  xB({
    tag: "map",
    name: "HTMLMapElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      name: String
    }
  });
  xB({
    tag: "menu",
    name: "HTMLMenuElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      type: {
        type: ["context", "popup", "toolbar"],
        missing: "toolbar"
      },
      label: String,
      compact: Boolean
    }
  });
  xB({
    tag: "meta",
    name: "HTMLMetaElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      name: String,
      content: String,
      httpEquiv: {
        name: "http-equiv",
        type: String
      },
      scheme: String
    }
  });
  xB({
    tag: "meter",
    name: "HTMLMeterElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP
  });
  xB({
    tags: ["ins", "del"],
    name: "HTMLModElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      cite: cJ,
      dateTime: String
    }
  });
  xB({
    tag: "ol",
    name: "HTMLOListElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      _numitems: {
        get: function() {
          var A = 0;
          return this.childNodes.forEach(function(Q) {
            if (Q.nodeType === jG0.ELEMENT_NODE && Q.tagName === "LI") A++
          }), A
        }
      }
    },
    attributes: {
      type: String,
      reversed: Boolean,
      start: {
        type: "long",
        default: function() {
          if (this.reversed) return this._numitems;
          else return 1
        }
      },
      compact: Boolean
    }
  });
  xB({
    tag: "object",
    name: "HTMLObjectElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      data: cJ,
      type: String,
      name: String,
      useMap: String,
      typeMustMatch: Boolean,
      width: String,
      height: String,
      align: String,
      archive: String,
      code: String,
      declare: Boolean,
      hspace: {
        type: "unsigned long",
        default: 0
      },
      standby: String,
      vspace: {
        type: "unsigned long",
        default: 0
      },
      codeBase: cJ,
      codeType: String,
      border: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tag: "optgroup",
    name: "HTMLOptGroupElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      disabled: Boolean,
      label: String
    }
  });
  xB({
    tag: "option",
    name: "HTMLOptionElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      form: {
        get: function() {
          var A = this.parentNode;
          while (A && A.nodeType === jG0.ELEMENT_NODE) {
            if (A.localName === "select") return A.form;
            A = A.parentNode
          }
        }
      },
      value: {
        get: function() {
          return this._getattr("value") || this.text
        },
        set: function(A) {
          this._setattr("value", A)
        }
      },
      text: {
        get: function() {
          return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim()
        },
        set: function(A) {
          this.textContent = A
        }
      }
    },
    attributes: {
      disabled: Boolean,
      defaultSelected: {
        name: "selected",
        type: Boolean
      },
      label: String
    }
  });
  xB({
    tag: "output",
    name: "HTMLOutputElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      name: String
    }
  });
  xB({
    tag: "p",
    name: "HTMLParagraphElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  xB({
    tag: "param",
    name: "HTMLParamElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      name: String,
      value: String,
      type: String,
      valueType: String
    }
  });
  xB({
    tags: ["pre", "listing", "xmp"],
    name: "HTMLPreElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      width: {
        type: "long",
        default: 0
      }
    }
  });
  xB({
    tag: "progress",
    name: "HTMLProgressElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: uP,
    attributes: {
      max: {
        type: Number,
        float: !0,
        default: 1,
        min: 0
      }
    }
  });
  xB({
    tags: ["q", "blockquote"],
    name: "HTMLQuoteElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      cite: cJ
    }
  });
  xB({
    tag: "script",
    name: "HTMLScriptElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      text: {
        get: function() {
          var A = "";
          for (var Q = 0, B = this.childNodes.length; Q < B; Q++) {
            var G = this.childNodes[Q];
            if (G.nodeType === jG0.TEXT_NODE) A += G._data
          }
          return A
        },
        set: function(A) {
          if (this.removeChildren(), A !== null && A !== "") this.appendChild(this.ownerDocument.createTextNode(A))
        }
      }
    },
    attributes: {
      src: cJ,
      type: String,
      charset: String,
      referrerPolicy: lWA,
      defer: Boolean,
      async: Boolean,
      nomodule: Boolean,
      crossOrigin: y31,
      nonce: String,
      integrity: String
    }
  });
  xB({
    tag: "select",
    name: "HTMLSelectElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: {
      form: uP.form,
      options: {
        get: function() {
          return this.getElementsByTagName("option")
        }
      }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      multiple: Boolean,
      required: Boolean,
      size: {
        type: "unsigned long",
        default: 0
      }
    }
  });
  xB({
    tag: "span",
    name: "HTMLSpanElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    }
  });
  xB({
    tag: "style",
    name: "HTMLStyleElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      media: String,
      type: String,
      scoped: Boolean
    }
  });
  xB({
    tag: "caption",
    name: "HTMLTableCaptionElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  xB({
    name: "HTMLTableCellElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      colSpan: {
        type: "unsigned long",
        default: 1
      },
      rowSpan: {
        type: "unsigned long",
        default: 1
      },
      scope: {
        type: ["row", "col", "rowgroup", "colgroup"],
        missing: ""
      },
      abbr: String,
      align: String,
      axis: String,
      height: String,
      width: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      noWrap: Boolean,
      vAlign: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tags: ["col", "colgroup"],
    name: "HTMLTableColElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      span: {
        type: "limited unsigned long with fallback",
        default: 1,
        min: 1
      },
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String,
      width: String
    }
  });
  xB({
    tag: "table",
    name: "HTMLTableElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      rows: {
        get: function() {
          return this.getElementsByTagName("tr")
        }
      }
    },
    attributes: {
      align: String,
      border: String,
      frame: String,
      rules: String,
      summary: String,
      width: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      },
      cellPadding: {
        type: String,
        treatNullAsEmptyString: !0
      },
      cellSpacing: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tag: "template",
    name: "HTMLTemplateElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G), this._contentFragment = Q._templateDoc.createDocumentFragment()
    },
    props: {
      content: {
        get: function() {
          return this._contentFragment
        }
      },
      serialize: {
        value: function() {
          return this.content.serialize()
        }
      }
    }
  });
  xB({
    tag: "tr",
    name: "HTMLTableRowElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      cells: {
        get: function() {
          return this.querySelectorAll("td,th")
        }
      }
    },
    attributes: {
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  xB({
    tags: ["thead", "tfoot", "tbody"],
    name: "HTMLTableSectionElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      rows: {
        get: function() {
          return this.getElementsByTagName("tr")
        }
      }
    },
    attributes: {
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String
    }
  });
  xB({
    tag: "textarea",
    name: "HTMLTextAreaElement",
    ctor: function(Q, B, G) {
      gP.call(this, Q, B, G)
    },
    props: {
      form: uP.form,
      type: {
        get: function() {
          return "textarea"
        }
      },
      defaultValue: {
        get: function() {
          return this.textContent
        },
        set: function(A) {
          this.textContent = A
        }
      },
      value: {
        get: function() {
          return this.defaultValue
        },
        set: function(A) {
          this.defaultValue = A
        }
      },
      textLength: {
        get: function() {
          return this.value.length
        }
      }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      placeholder: String,
      wrap: String,
      dirName: String,
      required: Boolean,
      readOnly: Boolean,
      rows: {
        type: "limited unsigned long with fallback",
        default: 2
      },
      cols: {
        type: "limited unsigned long with fallback",
        default: 20
      },
      maxLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      minLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      inputMode: {
        type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
        missing: ""
      }
    }
  });
  xB({
    tag: "time",
    name: "HTMLTimeElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      dateTime: String,
      pubDate: Boolean
    }
  });
  xB({
    tag: "title",
    name: "HTMLTitleElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      text: {
        get: function() {
          return this.textContent
        }
      }
    }
  });
  xB({
    tag: "ul",
    name: "HTMLUListElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      type: String,
      compact: Boolean
    }
  });
  xB({
    name: "HTMLMediaElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      src: cJ,
      crossOrigin: y31,
      preload: {
        type: ["metadata", "none", "auto", {
          value: "",
          alias: "auto"
        }],
        missing: "auto"
      },
      loop: Boolean,
      autoplay: Boolean,
      mediaGroup: String,
      controls: Boolean,
      defaultMuted: {
        name: "muted",
        type: Boolean
      }
    }
  });
  xB({
    name: "HTMLAudioElement",
    tag: "audio",
    superclass: Ig.HTMLMediaElement,
    ctor: function(Q, B, G) {
      Ig.HTMLMediaElement.call(this, Q, B, G)
    }
  });
  xB({
    name: "HTMLVideoElement",
    tag: "video",
    superclass: Ig.HTMLMediaElement,
    ctor: function(Q, B, G) {
      Ig.HTMLMediaElement.call(this, Q, B, G)
    },
    attributes: {
      poster: cJ,
      width: {
        type: "unsigned long",
        min: 0,
        default: 0
      },
      height: {
        type: "unsigned long",
        min: 0,
        default: 0
      }
    }
  });
  xB({
    tag: "td",
    name: "HTMLTableDataCellElement",
    superclass: Ig.HTMLTableCellElement,
    ctor: function(Q, B, G) {
      Ig.HTMLTableCellElement.call(this, Q, B, G)
    }
  });
  xB({
    tag: "th",
    name: "HTMLTableHeaderCellElement",
    superclass: Ig.HTMLTableCellElement,
    ctor: function(Q, B, G) {
      Ig.HTMLTableCellElement.call(this, Q, B, G)
    }
  });
  xB({
    tag: "frameset",
    name: "HTMLFrameSetElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    }
  });
  xB({
    tag: "frame",
    name: "HTMLFrameElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    }
  });
  xB({
    tag: "canvas",
    name: "HTMLCanvasElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      getContext: {
        value: hq.nyi
      },
      probablySupportsContext: {
        value: hq.nyi
      },
      setContext: {
        value: hq.nyi
      },
      transferControlToProxy: {
        value: hq.nyi
      },
      toDataURL: {
        value: hq.nyi
      },
      toBlob: {
        value: hq.nyi
      }
    },
    attributes: {
      width: {
        type: "unsigned long",
        default: 300
      },
      height: {
        type: "unsigned long",
        default: 150
      }
    }
  });
  xB({
    tag: "dialog",
    name: "HTMLDialogElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      show: {
        value: hq.nyi
      },
      showModal: {
        value: hq.nyi
      },
      close: {
        value: hq.nyi
      }
    },
    attributes: {
      open: Boolean,
      returnValue: String
    }
  });
  xB({
    tag: "menuitem",
    name: "HTMLMenuItemElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    props: {
      _label: {
        get: function() {
          var A = this._getattr("label");
          if (A !== null && A !== "") return A;
          return A = this.textContent, A.replace(/[ \t\n\f\r]+/g, " ").trim()
        }
      },
      label: {
        get: function() {
          var A = this._getattr("label");
          if (A !== null) return A;
          return this._label
        },
        set: function(A) {
          this._setattr("label", A)
        }
      }
    },
    attributes: {
      type: {
        type: ["command", "checkbox", "radio"],
        missing: "command"
      },
      icon: cJ,
      disabled: Boolean,
      checked: Boolean,
      radiogroup: String,
      default: Boolean
    }
  });
  xB({
    tag: "source",
    name: "HTMLSourceElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      srcset: String,
      sizes: String,
      media: String,
      src: cJ,
      type: String,
      width: String,
      height: String
    }
  });
  xB({
    tag: "track",
    name: "HTMLTrackElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      src: cJ,
      srclang: String,
      label: String,
      default: Boolean,
      kind: {
        type: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
        missing: "subtitles",
        invalid: "metadata"
      }
    },
    props: {
      NONE: {
        get: function() {
          return 0
        }
      },
      LOADING: {
        get: function() {
          return 1
        }
      },
      LOADED: {
        get: function() {
          return 2
        }
      },
      ERROR: {
        get: function() {
          return 3
        }
      },
      readyState: {
        get: hq.nyi
      },
      track: {
        get: hq.nyi
      }
    }
  });
  xB({
    tag: "font",
    name: "HTMLFontElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      color: {
        type: String,
        treatNullAsEmptyString: !0
      },
      face: {
        type: String
      },
      size: {
        type: String
      }
    }
  });
  xB({
    tag: "dir",
    name: "HTMLDirectoryElement",
    ctor: function(Q, B, G) {
      G9.call(this, Q, B, G)
    },
    attributes: {
      compact: Boolean
    }
  });
  xB({
    tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "content", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"]
  })
})
// @from(Start 12080071, End 12081992)
kG0 = z((Er5) => {
  var Wu2 = cWA(),
    Kr5 = PG0(),
    Dr5 = dJ(),
    Hr5 = k31(),
    Cr5 = Er5.elements = {},
    Xu2 = Object.create(null);
  Er5.createElement = function(A, Q, B) {
    var G = Xu2[Q] || _G0;
    return new G(A, Q, B)
  };

  function SG0(A) {
    return Kr5(A, _G0, Cr5, Xu2)
  }
  var _G0 = SG0({
    superclass: Wu2,
    name: "SVGElement",
    ctor: function(Q, B, G) {
      Wu2.call(this, Q, B, Dr5.NAMESPACE.SVG, G)
    },
    props: {
      style: {
        get: function() {
          if (!this._style) this._style = new Hr5(this);
          return this._style
        }
      }
    }
  });
  SG0({
    name: "SVGSVGElement",
    ctor: function(Q, B, G) {
      _G0.call(this, Q, B, G)
    },
    tag: "svg",
    props: {
      createSVGRect: {
        value: function() {
          return Er5.createElement(this.ownerDocument, "rect", null)
        }
      }
    }
  });
  SG0({
    tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"]
  })
})
// @from(Start 12081998, End 12082135)
Ku2 = z((DWZ, Fu2) => {
  Fu2.exports = {
    VALUE: 1,
    ATTR: 2,
    REMOVE_ATTR: 3,
    REMOVE: 4,
    MOVE: 5,
    INSERT: 6
  }
})