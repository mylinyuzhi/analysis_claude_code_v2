
// @from(Ln 339412, Col 4)
IW1 = R((MzH, Og4) => {
    Og4.exports = Tt;
    var MLA = iP6(),
        oO = F_(),
        ym = oO.NAMESPACE,
        eP6 = wLA(),
        WI = XP(),
        PLA = k51(),
        TLY = nkA(),
        tP6 = dQ4(),
        hW1 = UP6(),
        vLY = $LA(),
        WLA = aP6(),
        wg4 = lP6(),
        ELY = sP6(),
        kLY = DLA(),
        Hg4 = jLA(),
        zg4 = Object.create(null);

    function Tt(A, q, K, Y) {
        wg4.call(this), this.nodeType = WI.ELEMENT_NODE, this.ownerDocument = A, this.localName = q, this.namespaceURI = K, this.prefix = Y, this._tagName = void 0, this._attrsByQName = Object.create(null), this._attrsByLName = Object.create(null), this._attrKeys = []
    }

    function GLA(A, q) {
        if (A.nodeType === WI.TEXT_NODE) q.push(A._data);
        else
            for (var K = 0, Y = A.childNodes.length; K < Y; K++) GLA(A.childNodes[K], q)
    }
    Tt.prototype = Object.create(wg4.prototype, {
        isHTML: {
            get: function() {
                return this.namespaceURI === ym.HTML && this.ownerDocument.isHTML
            }
        },
        tagName: {
            get: function() {
                if (this._tagName === void 0) {
                    var q;
                    if (this.prefix === null) q = this.localName;
                    else q = this.prefix + ":" + this.localName;
                    if (this.isHTML) {
                        var K = zg4[q];
                        if (!K) zg4[q] = K = oO.toASCIIUpperCase(q);
                        q = K
                    }
                    this._tagName = q
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
                return GLA(this, A), A.join("")
            },
            set: function(A) {
                if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
            }
        },
        innerText: {
            get: function() {
                var A = [];
                return GLA(this, A), A.join("").replace(/[ \t\n\f\r]+/g, " ").trim()
            },
            set: function(A) {
                if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
            }
        },
        innerHTML: {
            get: function() {
                return this.serialize()
            },
            set: oO.nyi
        },
        outerHTML: {
            get: function() {
                return TLY.serializeOne(this, {
                    nodeType: 0
                })
            },
            set: function(A) {
                var q = this.ownerDocument,
                    K = this.parentNode;
                if (K === null) return;
                if (K.nodeType === WI.DOCUMENT_NODE) oO.NoModificationAllowedError();
                if (K.nodeType === WI.DOCUMENT_FRAGMENT_NODE) K = K.ownerDocument.createElement("body");
                var Y = q.implementation.mozHTMLParser(q._address, K);
                Y.parse(A === null ? "" : String(A), !0), this.replaceWith(Y._asDocumentFragment())
            }
        },
        _insertAdjacent: {
            value: function(q, K) {
                var Y = !1;
                switch (q) {
                    case "beforebegin":
                        Y = !0;
                    case "afterend":
                        var z = this.parentNode;
                        if (z === null) return null;
                        return z.insertBefore(K, Y ? this : this.nextSibling);
                    case "afterbegin":
                        Y = !0;
                    case "beforeend":
                        return this.insertBefore(K, Y ? this.firstChild : null);
                    default:
                        return oO.SyntaxError()
                }
            }
        },
        insertAdjacentElement: {
            value: function(q, K) {
                if (K.nodeType !== WI.ELEMENT_NODE) throw TypeError("not an element");
                return q = oO.toASCIILowerCase(String(q)), this._insertAdjacent(q, K)
            }
        },
        insertAdjacentText: {
            value: function(q, K) {
                var Y = this.ownerDocument.createTextNode(K);
                q = oO.toASCIILowerCase(String(q)), this._insertAdjacent(q, Y)
            }
        },
        insertAdjacentHTML: {
            value: function(q, K) {
                q = oO.toASCIILowerCase(String(q)), K = String(K);
                var Y;
                switch (q) {
                    case "beforebegin":
                    case "afterend":
                        if (Y = this.parentNode, Y === null || Y.nodeType === WI.DOCUMENT_NODE) oO.NoModificationAllowedError();
                        break;
                    case "afterbegin":
                    case "beforeend":
                        Y = this;
                        break;
                    default:
                        oO.SyntaxError()
                }
                if (!(Y instanceof Tt) || Y.ownerDocument.isHTML && Y.localName === "html" && Y.namespaceURI === ym.HTML) Y = Y.ownerDocument.createElementNS(ym.HTML, "body");
                var z = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, Y);
                z.parse(K, !0), this._insertAdjacent(q, z._asDocumentFragment())
            }
        },
        children: {
            get: function() {
                if (!this._children) this._children = new $g4(this);
                return this._children
            }
        },
        attributes: {
            get: function() {
                if (!this._attributes) this._attributes = new fLA(this);
                return this._attributes
            }
        },
        firstElementChild: {
            get: function() {
                for (var A = this.firstChild; A !== null; A = A.nextSibling)
                    if (A.nodeType === WI.ELEMENT_NODE) return A;
                return null
            }
        },
        lastElementChild: {
            get: function() {
                for (var A = this.lastChild; A !== null; A = A.previousSibling)
                    if (A.nodeType === WI.ELEMENT_NODE) return A;
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
                var q = this.firstElementChild;
                if (!q) {
                    if (this === A) return null;
                    q = this.nextElementSibling
                }
                if (q) return q;
                for (var K = this.parentElement; K && K !== A; K = K.parentElement)
                    if (q = K.nextElementSibling, q) return q;
                return null
            }
        },
        getElementsByTagName: {
            value: function(q) {
                var K;
                if (!q) return new PLA;
                if (q === "*") K = function() {
                    return !0
                };
                else if (this.isHTML) K = LLY(q);
                else K = ZLA(q);
                return new tP6(this, K)
            }
        },
        getElementsByTagNameNS: {
            value: function(q, K) {
                var Y;
                if (q === "*" && K === "*") Y = function() {
                    return !0
                };
                else if (q === "*") Y = ZLA(K);
                else if (K === "*") Y = RLY(q);
                else Y = yLY(q, K);
                return new tP6(this, Y)
            }
        },
        getElementsByClassName: {
            value: function(q) {
                if (q = String(q).trim(), q === "") {
                    var K = new PLA;
                    return K
                }
                return q = q.split(/[ \t\r\n\f]+/), new tP6(this, CLY(q))
            }
        },
        getElementsByName: {
            value: function(q) {
                return new tP6(this, SLY(String(q)))
            }
        },
        clone: {
            value: function() {
                var q;
                if (this.namespaceURI !== ym.HTML || this.prefix || !this.ownerDocument.isHTML) q = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName);
                else q = this.ownerDocument.createElement(this.localName);
                for (var K = 0, Y = this._attrKeys.length; K < Y; K++) {
                    var z = this._attrKeys[K],
                        w = this._attrsByLName[z],
                        H = w.cloneNode();
                    H._setOwnerElement(q), q._attrsByLName[z] = H, q._addQName(H)
                }
                return q._attrKeys = this._attrKeys.concat(), q
            }
        },
        isEqual: {
            value: function(q) {
                if (this.localName !== q.localName || this.namespaceURI !== q.namespaceURI || this.prefix !== q.prefix || this._numattrs !== q._numattrs) return !1;
                for (var K = 0, Y = this._numattrs; K < Y; K++) {
                    var z = this._attr(K);
                    if (!q.hasAttributeNS(z.namespaceURI, z.localName)) return !1;
                    if (q.getAttributeNS(z.namespaceURI, z.localName) !== z.value) return !1
                }
                return !0
            }
        },
        _lookupNamespacePrefix: {
            value: function(q, K) {
                if (this.namespaceURI && this.namespaceURI === q && this.prefix !== null && K.lookupNamespaceURI(this.prefix) === q) return this.prefix;
                for (var Y = 0, z = this._numattrs; Y < z; Y++) {
                    var w = this._attr(Y);
                    if (w.prefix === "xmlns" && w.value === q && K.lookupNamespaceURI(w.localName) === q) return w.localName
                }
                var H = this.parentElement;
                return H ? H._lookupNamespacePrefix(q, K) : null
            }
        },
        lookupNamespaceURI: {
            value: function(q) {
                if (q === "" || q === void 0) q = null;
                if (this.namespaceURI !== null && this.prefix === q) return this.namespaceURI;
                for (var K = 0, Y = this._numattrs; K < Y; K++) {
                    var z = this._attr(K);
                    if (z.namespaceURI === ym.XMLNS) {
                        if (z.prefix === "xmlns" && z.localName === q || q === null && z.prefix === null && z.localName === "xmlns") return z.value || null
                    }
                }
                var w = this.parentElement;
                return w ? w.lookupNamespaceURI(q) : null
            }
        },
        getAttribute: {
            value: function(q) {
                var K = this.getAttributeNode(q);
                return K ? K.value : null
            }
        },
        getAttributeNS: {
            value: function(q, K) {
                var Y = this.getAttributeNodeNS(q, K);
                return Y ? Y.value : null
            }
        },
        getAttributeNode: {
            value: function(q) {
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = oO.toASCIILowerCase(q);
                var K = this._attrsByQName[q];
                if (!K) return null;
                if (Array.isArray(K)) K = K[0];
                return K
            }
        },
        getAttributeNodeNS: {
            value: function(q, K) {
                q = q === void 0 || q === null ? "" : String(q), K = String(K);
                var Y = this._attrsByLName[q + "|" + K];
                return Y ? Y : null
            }
        },
        hasAttribute: {
            value: function(q) {
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = oO.toASCIILowerCase(q);
                return this._attrsByQName[q] !== void 0
            }
        },
        hasAttributeNS: {
            value: function(q, K) {
                q = q === void 0 || q === null ? "" : String(q), K = String(K);
                var Y = q + "|" + K;
                return this._attrsByLName[Y] !== void 0
            }
        },
        hasAttributes: {
            value: function() {
                return this._numattrs > 0
            }
        },
        toggleAttribute: {
            value: function(q, K) {
                if (q = String(q), !MLA.isValidName(q)) oO.InvalidCharacterError();
                if (/[A-Z]/.test(q) && this.isHTML) q = oO.toASCIILowerCase(q);
                var Y = this._attrsByQName[q];
                if (Y === void 0) {
                    if (K === void 0 || K === !0) return this._setAttribute(q, ""), !0;
                    return !1
                } else {
                    if (K === void 0 || K === !1) return this.removeAttribute(q), !1;
                    return !0
                }
            }
        },
        _setAttribute: {
            value: function(q, K) {
                var Y = this._attrsByQName[q],
                    z;
                if (!Y) Y = this._newattr(q), z = !0;
                else if (Array.isArray(Y)) Y = Y[0];
                if (Y.value = K, this._attributes) this._attributes[q] = Y;
                if (z && this._newattrhook) this._newattrhook(q, K)
            }
        },
        setAttribute: {
            value: function(q, K) {
                if (q = String(q), !MLA.isValidName(q)) oO.InvalidCharacterError();
                if (/[A-Z]/.test(q) && this.isHTML) q = oO.toASCIILowerCase(q);
                this._setAttribute(q, String(K))
            }
        },
        _setAttributeNS: {
            value: function(q, K, Y) {
                var z = K.indexOf(":"),
                    w, H;
                if (z < 0) w = null, H = K;
                else w = K.substring(0, z), H = K.substring(z + 1);
                if (q === "" || q === void 0) q = null;
                var $ = (q === null ? "" : q) + "|" + H,
                    O = this._attrsByLName[$],
                    _;
                if (!O) {
                    if (O = new Hg1(this, H, w, q), _ = !0, this._attrsByLName[$] = O, this._attributes) this._attributes[this._attrKeys.length] = O;
                    this._attrKeys.push($), this._addQName(O)
                }
                if (O.value = Y, _ && this._newattrhook) this._newattrhook(K, Y)
            }
        },
        setAttributeNS: {
            value: function(q, K, Y) {
                if (q = q === null || q === void 0 || q === "" ? null : String(q), K = String(K), !MLA.isValidQName(K)) oO.InvalidCharacterError();
                var z = K.indexOf(":"),
                    w = z < 0 ? null : K.substring(0, z);
                if (w !== null && q === null || w === "xml" && q !== ym.XML || (K === "xmlns" || w === "xmlns") && q !== ym.XMLNS || q === ym.XMLNS && !(K === "xmlns" || w === "xmlns")) oO.NamespaceError();
                this._setAttributeNS(q, K, String(Y))
            }
        },
        setAttributeNode: {
            value: function(q) {
                if (q.ownerElement !== null && q.ownerElement !== this) throw new hW1(hW1.INUSE_ATTRIBUTE_ERR);
                var K = null,
                    Y = this._attrsByQName[q.name];
                if (Y) {
                    if (!Array.isArray(Y)) Y = [Y];
                    if (Y.some(function(z) {
                            return z === q
                        })) return q;
                    else if (q.ownerElement !== null) throw new hW1(hW1.INUSE_ATTRIBUTE_ERR);
                    Y.forEach(function(z) {
                        this.removeAttributeNode(z)
                    }, this), K = Y[0]
                }
                return this.setAttributeNodeNS(q), K
            }
        },
        setAttributeNodeNS: {
            value: function(q) {
                if (q.ownerElement !== null) throw new hW1(hW1.INUSE_ATTRIBUTE_ERR);
                var K = q.namespaceURI,
                    Y = (K === null ? "" : K) + "|" + q.localName,
                    z = this._attrsByLName[Y];
                if (z) this.removeAttributeNode(z);
                if (q._setOwnerElement(this), this._attrsByLName[Y] = q, this._attributes) this._attributes[this._attrKeys.length] = q;
                if (this._attrKeys.push(Y), this._addQName(q), this._newattrhook) this._newattrhook(q.name, q.value);
                return z || null
            }
        },
        removeAttribute: {
            value: function(q) {
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = oO.toASCIILowerCase(q);
                var K = this._attrsByQName[q];
                if (!K) return;
                if (Array.isArray(K))
                    if (K.length > 2) K = K.shift();
                    else this._attrsByQName[q] = K[1], K = K[0];
                else this._attrsByQName[q] = void 0;
                var Y = K.namespaceURI,
                    z = (Y === null ? "" : Y) + "|" + K.localName;
                this._attrsByLName[z] = void 0;
                var w = this._attrKeys.indexOf(z);
                if (this._attributes) Array.prototype.splice.call(this._attributes, w, 1), this._attributes[q] = void 0;
                this._attrKeys.splice(w, 1);
                var H = K.onchange;
                if (K._setOwnerElement(null), H) H.call(K, this, K.localName, K.value, null);
                if (this.rooted) this.ownerDocument.mutateRemoveAttr(K)
            }
        },
        removeAttributeNS: {
            value: function(q, K) {
                q = q === void 0 || q === null ? "" : String(q), K = String(K);
                var Y = q + "|" + K,
                    z = this._attrsByLName[Y];
                if (!z) return;
                this._attrsByLName[Y] = void 0;
                var w = this._attrKeys.indexOf(Y);
                if (this._attributes) Array.prototype.splice.call(this._attributes, w, 1);
                this._attrKeys.splice(w, 1), this._removeQName(z);
                var H = z.onchange;
                if (z._setOwnerElement(null), H) H.call(z, this, z.localName, z.value, null);
                if (this.rooted) this.ownerDocument.mutateRemoveAttr(z)
            }
        },
        removeAttributeNode: {
            value: function(q) {
                var K = q.namespaceURI,
                    Y = (K === null ? "" : K) + "|" + q.localName;
                if (this._attrsByLName[Y] !== q) oO.NotFoundError();
                return this.removeAttributeNS(K, q.localName), q
            }
        },
        getAttributeNames: {
            value: function() {
                var q = this;
                return this._attrKeys.map(function(K) {
                    return q._attrsByLName[K].name
                })
            }
        },
        _getattr: {
            value: function(q) {
                var K = this._attrsByQName[q];
                return K ? K.value : null
            }
        },
        _setattr: {
            value: function(q, K) {
                var Y = this._attrsByQName[q],
                    z;
                if (!Y) Y = this._newattr(q), z = !0;
                if (Y.value = String(K), this._attributes) this._attributes[q] = Y;
                if (z && this._newattrhook) this._newattrhook(q, K)
            }
        },
        _newattr: {
            value: function(q) {
                var K = new Hg1(this, q, null, null),
                    Y = "|" + q;
                if (this._attrsByQName[q] = K, this._attrsByLName[Y] = K, this._attributes) this._attributes[this._attrKeys.length] = K;
                return this._attrKeys.push(Y), K
            }
        },
        _addQName: {
            value: function(A) {
                var q = A.name,
                    K = this._attrsByQName[q];
                if (!K) this._attrsByQName[q] = A;
                else if (Array.isArray(K)) K.push(A);
                else this._attrsByQName[q] = [K, A];
                if (this._attributes) this._attributes[q] = A
            }
        },
        _removeQName: {
            value: function(A) {
                var q = A.name,
                    K = this._attrsByQName[q];
                if (Array.isArray(K)) {
                    var Y = K.indexOf(A);
                    if (oO.assert(Y !== -1), K.length === 2) {
                        if (this._attrsByQName[q] = K[1 - Y], this._attributes) this._attributes[q] = this._attrsByQName[q]
                    } else if (K.splice(Y, 1), this._attributes && this._attributes[q] === A) this._attributes[q] = K[0]
                } else if (oO.assert(K === A), this._attrsByQName[q] = void 0, this._attributes) this._attributes[q] = void 0
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
        id: eP6.property({
            name: "id"
        }),
        className: eP6.property({
            name: "class"
        }),
        classList: {
            get: function() {
                var A = this;
                if (this._classList) return this._classList;
                var q = new vLY(function() {
                    return A.className || ""
                }, function(K) {
                    A.className = K
                });
                return this._classList = q, q
            },
            set: function(A) {
                this.className = A
            }
        },
        matches: {
            value: function(A) {
                return WLA.matches(this, A)
            }
        },
        closest: {
            value: function(A) {
                var q = this;
                do {
                    if (q.matches && q.matches(A)) return q;
                    q = q.parentElement || q.parentNode
                } while (q !== null && q.nodeType === WI.ELEMENT_NODE);
                return null
            }
        },
        querySelector: {
            value: function(A) {
                return WLA(A, this)[0]
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = WLA(A, this);
                return q.item ? q : new PLA(q)
            }
        }
    });
    Object.defineProperties(Tt.prototype, ELY);
    Object.defineProperties(Tt.prototype, kLY);
    eP6.registerChangeHandler(Tt, "id", function(A, q, K, Y) {
        if (A.rooted) {
            if (K) A.ownerDocument.delId(K, A);
            if (Y) A.ownerDocument.addId(Y, A)
        }
    });
    eP6.registerChangeHandler(Tt, "class", function(A, q, K, Y) {
        if (A._classList) A._classList._update()
    });

    function Hg1(A, q, K, Y, z) {
        this.localName = q, this.prefix = K === null || K === "" ? null : "" + K, this.namespaceURI = Y === null || Y === "" ? null : "" + Y, this.data = z, this._setOwnerElement(A)
    }
    Hg1.prototype = Object.create(Object.prototype, {
        ownerElement: {
            get: function() {
                return this._ownerElement
            }
        },
        _setOwnerElement: {
            value: function(q) {
                if (this._ownerElement = q, this.prefix === null && this.namespaceURI === null && q) this.onchange = q._attributeChangeHandlers[this.localName];
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
                var q = this.data;
                if (A = A === void 0 ? "" : A + "", A === q) return;
                if (this.data = A, this.ownerElement) {
                    if (this.onchange) this.onchange(this.ownerElement, this.localName, q, A);
                    if (this.ownerElement.rooted) this.ownerElement.ownerDocument.mutateAttr(this, q)
                }
            }
        },
        cloneNode: {
            value: function(q) {
                return new Hg1(null, this.localName, this.prefix, this.namespaceURI, this.data)
            }
        },
        nodeType: {
            get: function() {
                return WI.ATTRIBUTE_NODE
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
    Tt._Attr = Hg1;

    function fLA(A) {
        Hg4.call(this, A);
        for (var q in A._attrsByQName) this[q] = A._attrsByQName[q];
        for (var K = 0; K < A._attrKeys.length; K++) this[K] = A._attrsByLName[A._attrKeys[K]]
    }
    fLA.prototype = Object.create(Hg4.prototype, {
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
    if (globalThis.Symbol?.iterator) fLA.prototype[globalThis.Symbol.iterator] = function() {
        var A = 0,
            q = this.length,
            K = this;
        return {
            next: function() {
                if (A < q) return {
                    value: K.item(A++)
                };
                return {
                    done: !0
                }
            }
        }
    };

    function $g4(A) {
        this.element = A, this.updateCache()
    }
    $g4.prototype = Object.create(Object.prototype, {
        length: {
            get: function() {
                return this.updateCache(), this.childrenByNumber.length
            }
        },
        item: {
            value: function(q) {
                return this.updateCache(), this.childrenByNumber[q] || null
            }
        },
        namedItem: {
            value: function(q) {
                return this.updateCache(), this.childrenByName[q] || null
            }
        },
        namedItems: {
            get: function() {
                return this.updateCache(), this.childrenByName
            }
        },
        updateCache: {
            value: function() {
                var q = /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
                if (this.lastModTime !== this.element.lastModTime) {
                    this.lastModTime = this.element.lastModTime;
                    var K = this.childrenByNumber && this.childrenByNumber.length || 0;
                    for (var Y = 0; Y < K; Y++) this[Y] = void 0;
                    this.childrenByNumber = [], this.childrenByName = Object.create(null);
                    for (var z = this.element.firstChild; z !== null; z = z.nextSibling)
                        if (z.nodeType === WI.ELEMENT_NODE) {
                            this[this.childrenByNumber.length] = z, this.childrenByNumber.push(z);
                            var w = z.getAttribute("id");
                            if (w && !this.childrenByName[w]) this.childrenByName[w] = z;
                            var H = z.getAttribute("name");
                            if (H && this.element.namespaceURI === ym.HTML && q.test(this.element.localName) && !this.childrenByName[H]) this.childrenByName[w] = z
                        }
                }
            }
        }
    });

    function ZLA(A) {
        return function(q) {
            return q.localName === A
        }
    }

    function LLY(A) {
        var q = oO.toASCIILowerCase(A);
        if (q === A) return ZLA(A);
        return function(K) {
            return K.isHTML ? K.localName === q : K.localName === A
        }
    }

    function RLY(A) {
        return function(q) {
            return q.namespaceURI === A
        }
    }

    function yLY(A, q) {
        return function(K) {
            return K.namespaceURI === A && K.localName === q
        }
    }

    function CLY(A) {
        return function(q) {
            return A.every(function(K) {
                return q.classList.contains(K)
            })
        }
    }

    function SLY(A) {
        return function(q) {
            if (q.namespaceURI !== ym.HTML) return !1;
            return q.getAttribute("name") === A
        }
    }
})
// @from(Ln 340200, Col 4)
VLA = R((PzH, jg4) => {
    jg4.exports = Dg4;
    var Jg4 = XP(),
        hLY = k51(),
        Xg4 = F_(),
        _g4 = Xg4.HierarchyRequestError,
        ILY = Xg4.NotFoundError;

    function Dg4() {
        Jg4.call(this)
    }
    Dg4.prototype = Object.create(Jg4.prototype, {
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
            value: function(A, q) {
                if (!A.nodeType) throw TypeError("not a node");
                _g4()
            }
        },
        replaceChild: {
            value: function(A, q) {
                if (!A.nodeType) throw TypeError("not a node");
                _g4()
            }
        },
        removeChild: {
            value: function(A) {
                if (!A.nodeType) throw TypeError("not a node");
                ILY()
            }
        },
        removeChildren: {
            value: function() {}
        },
        childNodes: {
            get: function() {
                if (!this._childNodes) this._childNodes = new hLY;
                return this._childNodes
            }
        }
    })
})
// @from(Ln 340252, Col 4)
$g1 = R((WzH, Wg4) => {
    Wg4.exports = AW6;
    var Pg4 = VLA(),
        Mg4 = F_(),
        xLY = sP6(),
        bLY = DLA();

    function AW6() {
        Pg4.call(this)
    }
    AW6.prototype = Object.create(Pg4.prototype, {
        substringData: {
            value: function(q, K) {
                if (arguments.length < 2) throw TypeError("Not enough arguments");
                if (q = q >>> 0, K = K >>> 0, q > this.data.length || q < 0 || K < 0) Mg4.IndexSizeError();
                return this.data.substring(q, q + K)
            }
        },
        appendData: {
            value: function(q) {
                if (arguments.length < 1) throw TypeError("Not enough arguments");
                this.data += String(q)
            }
        },
        insertData: {
            value: function(q, K) {
                return this.replaceData(q, 0, K)
            }
        },
        deleteData: {
            value: function(q, K) {
                return this.replaceData(q, K, "")
            }
        },
        replaceData: {
            value: function(q, K, Y) {
                var z = this.data,
                    w = z.length;
                if (q = q >>> 0, K = K >>> 0, Y = String(Y), q > w || q < 0) Mg4.IndexSizeError();
                if (q + K > w) K = w - q;
                var H = z.substring(0, q),
                    $ = z.substring(q + K);
                this.data = H + Y + $
            }
        },
        isEqual: {
            value: function(q) {
                return this._data === q._data
            }
        },
        length: {
            get: function() {
                return this.data.length
            }
        }
    });
    Object.defineProperties(AW6.prototype, xLY);
    Object.defineProperties(AW6.prototype, bLY)
})
// @from(Ln 340311, Col 4)
TLA = R((GzH, Vg4) => {
    Vg4.exports = NLA;
    var Gg4 = F_(),
        Zg4 = XP(),
        fg4 = $g1();

    function NLA(A, q) {
        fg4.call(this), this.nodeType = Zg4.TEXT_NODE, this.ownerDocument = A, this._data = q, this._index = void 0
    }
    var Og1 = {
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
    NLA.prototype = Object.create(fg4.prototype, {
        nodeName: {
            value: "#text"
        },
        nodeValue: Og1,
        textContent: Og1,
        innerText: Og1,
        data: {
            get: Og1.get,
            set: function(A) {
                Og1.set.call(this, A === null ? "" : String(A))
            }
        },
        splitText: {
            value: function(q) {
                if (q > this._data.length || q < 0) Gg4.IndexSizeError();
                var K = this._data.substring(q),
                    Y = this.ownerDocument.createTextNode(K);
                this.data = this.data.substring(0, q);
                var z = this.parentNode;
                if (z !== null) z.insertBefore(Y, this.nextSibling);
                return Y
            }
        },
        wholeText: {
            get: function() {
                var q = this.textContent;
                for (var K = this.nextSibling; K; K = K.nextSibling) {
                    if (K.nodeType !== Zg4.TEXT_NODE) break;
                    q += K.textContent
                }
                return q
            }
        },
        replaceWholeText: {
            value: Gg4.nyi
        },
        clone: {
            value: function() {
                return new NLA(this.ownerDocument, this._data)
            }
        }
    })
})
// @from(Ln 340376, Col 4)
ELA = R((ZzH, Tg4) => {
    Tg4.exports = vLA;
    var uLY = XP(),
        Ng4 = $g1();

    function vLA(A, q) {
        Ng4.call(this), this.nodeType = uLY.COMMENT_NODE, this.ownerDocument = A, this._data = q
    }
    var _g1 = {
        get: function() {
            return this._data
        },
        set: function(A) {
            if (A === null || A === void 0) A = "";
            else A = String(A);
            if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
        }
    };
    vLA.prototype = Object.create(Ng4.prototype, {
        nodeName: {
            value: "#comment"
        },
        nodeValue: _g1,
        textContent: _g1,
        innerText: _g1,
        data: {
            get: _g1.get,
            set: function(A) {
                _g1.set.call(this, A === null ? "" : String(A))
            }
        },
        clone: {
            value: function() {
                return new vLA(this.ownerDocument, this._data)
            }
        }
    })
})
// @from(Ln 340414, Col 4)
LLA = R((fzH, kg4) => {
    kg4.exports = kLA;
    var BLY = XP(),
        mLY = k51(),
        Eg4 = lP6(),
        qW6 = IW1(),
        FLY = aP6(),
        vg4 = F_();

    function kLA(A) {
        Eg4.call(this), this.nodeType = BLY.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = A
    }
    kLA.prototype = Object.create(Eg4.prototype, {
        nodeName: {
            value: "#document-fragment"
        },
        nodeValue: {
            get: function() {
                return null
            },
            set: function() {}
        },
        textContent: Object.getOwnPropertyDescriptor(qW6.prototype, "textContent"),
        innerText: Object.getOwnPropertyDescriptor(qW6.prototype, "innerText"),
        querySelector: {
            value: function(A) {
                var q = this.querySelectorAll(A);
                return q.length ? q[0] : null
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = Object.create(this);
                q.isHTML = !0, q.getElementsByTagName = qW6.prototype.getElementsByTagName, q.nextElement = Object.getOwnPropertyDescriptor(qW6.prototype, "firstElementChild").get;
                var K = FLY(A, q);
                return K.item ? K : new mLY(K)
            }
        },
        clone: {
            value: function() {
                return new kLA(this.ownerDocument)
            }
        },
        isEqual: {
            value: function(q) {
                return !0
            }
        },
        innerHTML: {
            get: function() {
                return this.serialize()
            },
            set: vg4.nyi
        },
        outerHTML: {
            get: function() {
                return this.serialize()
            },
            set: vg4.nyi
        }
    })
})
// @from(Ln 340476, Col 4)
yLA = R((VzH, Rg4) => {
    Rg4.exports = RLA;
    var QLY = XP(),
        Lg4 = $g1();

    function RLA(A, q, K) {
        Lg4.call(this), this.nodeType = QLY.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = A, this.target = q, this._data = K
    }
    var Jg1 = {
        get: function() {
            return this._data
        },
        set: function(A) {
            if (A === null || A === void 0) A = "";
            else A = String(A);
            if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
        }
    };
    RLA.prototype = Object.create(Lg4.prototype, {
        nodeName: {
            get: function() {
                return this.target
            }
        },
        nodeValue: Jg1,
        textContent: Jg1,
        innerText: Jg1,
        data: {
            get: Jg1.get,
            set: function(A) {
                Jg1.set.call(this, A === null ? "" : String(A))
            }
        },
        clone: {
            value: function() {
                return new RLA(this.ownerDocument, this.target, this._data)
            }
        },
        isEqual: {
            value: function(q) {
                return this.target === q.target && this._data === q._data
            }
        }
    })
})
// @from(Ln 340521, Col 4)
Xg1 = R((NzH, yg4) => {
    var CLA = {
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
    yg4.exports = CLA.constructor = CLA.prototype = CLA
})
// @from(Ln 340542, Col 4)
hLA = R((vzH, Sg4) => {
    var TzH = Sg4.exports = {
        nextSkippingChildren: gLY,
        nextAncestorSibling: SLA,
        next: ULY,
        previous: pLY,
        deepLastChild: Cg4
    };

    function gLY(A, q) {
        if (A === q) return null;
        if (A.nextSibling !== null) return A.nextSibling;
        return SLA(A, q)
    }

    function SLA(A, q) {
        for (A = A.parentNode; A !== null; A = A.parentNode) {
            if (A === q) return null;
            if (A.nextSibling !== null) return A.nextSibling
        }
        return null
    }

    function ULY(A, q) {
        var K = A.firstChild;
        if (K !== null) return K;
        if (A === q) return null;
        if (K = A.nextSibling, K !== null) return K;
        return SLA(A, q)
    }

    function Cg4(A) {
        while (A.lastChild) A = A.lastChild;
        return A
    }

    function pLY(A, q) {
        var K = A.previousSibling;
        if (K !== null) return Cg4(K);
        if (K = A.parentNode, K === q) return null;
        return K
    }
})
// @from(Ln 340585, Col 4)
mg4 = R((EzH, Bg4) => {
    Bg4.exports = ug4;
    var dLY = XP(),
        DP = Xg1(),
        hg4 = hLA(),
        bg4 = F_(),
        ILA = {
            first: "firstChild",
            last: "lastChild",
            next: "firstChild",
            previous: "lastChild"
        },
        xLA = {
            first: "nextSibling",
            last: "previousSibling",
            next: "nextSibling",
            previous: "previousSibling"
        };

    function Ig4(A, q) {
        var K, Y, z, w, H;
        Y = A._currentNode[ILA[q]];
        while (Y !== null) {
            if (w = A._internalFilter(Y), w === DP.FILTER_ACCEPT) return A._currentNode = Y, Y;
            if (w === DP.FILTER_SKIP) {
                if (K = Y[ILA[q]], K !== null) {
                    Y = K;
                    continue
                }
            }
            while (Y !== null) {
                if (H = Y[xLA[q]], H !== null) {
                    Y = H;
                    break
                }
                if (z = Y.parentNode, z === null || z === A.root || z === A._currentNode) return null;
                else Y = z
            }
        }
        return null
    }

    function xg4(A, q) {
        var K, Y, z;
        if (K = A._currentNode, K === A.root) return null;
        while (!0) {
            z = K[xLA[q]];
            while (z !== null) {
                if (K = z, Y = A._internalFilter(K), Y === DP.FILTER_ACCEPT) return A._currentNode = K, K;
                if (z = K[ILA[q]], Y === DP.FILTER_REJECT || z === null) z = K[xLA[q]]
            }
            if (K = K.parentNode, K === null || K === A.root) return null;
            if (A._internalFilter(K) === DP.FILTER_ACCEPT) return null
        }
    }

    function ug4(A, q, K) {
        if (!A || !A.nodeType) bg4.NotSupportedError();
        this._root = A, this._whatToShow = Number(q) || 0, this._filter = K || null, this._active = !1, this._currentNode = A
    }
    Object.defineProperties(ug4.prototype, {
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
            set: function(q) {
                if (!(q instanceof dLY)) throw TypeError("Not a Node");
                this._currentNode = q
            }
        },
        _internalFilter: {
            value: function(q) {
                var K, Y;
                if (this._active) bg4.InvalidStateError();
                if (!(1 << q.nodeType - 1 & this._whatToShow)) return DP.FILTER_SKIP;
                if (Y = this._filter, Y === null) K = DP.FILTER_ACCEPT;
                else {
                    this._active = !0;
                    try {
                        if (typeof Y === "function") K = Y(q);
                        else K = Y.acceptNode(q)
                    } finally {
                        this._active = !1
                    }
                }
                return +K
            }
        },
        parentNode: {
            value: function() {
                var q = this._currentNode;
                while (q !== this.root) {
                    if (q = q.parentNode, q === null) return null;
                    if (this._internalFilter(q) === DP.FILTER_ACCEPT) return this._currentNode = q, q
                }
                return null
            }
        },
        firstChild: {
            value: function() {
                return Ig4(this, "first")
            }
        },
        lastChild: {
            value: function() {
                return Ig4(this, "last")
            }
        },
        previousSibling: {
            value: function() {
                return xg4(this, "previous")
            }
        },
        nextSibling: {
            value: function() {
                return xg4(this, "next")
            }
        },
        previousNode: {
            value: function() {
                var q, K, Y, z;
                q = this._currentNode;
                while (q !== this._root) {
                    for (Y = q.previousSibling; Y; Y = q.previousSibling) {
                        if (q = Y, K = this._internalFilter(q), K === DP.FILTER_REJECT) continue;
                        for (z = q.lastChild; z; z = q.lastChild)
                            if (q = z, K = this._internalFilter(q), K === DP.FILTER_REJECT) break;
                        if (K === DP.FILTER_ACCEPT) return this._currentNode = q, q
                    }
                    if (q === this.root || q.parentNode === null) return null;
                    if (q = q.parentNode, this._internalFilter(q) === DP.FILTER_ACCEPT) return this._currentNode = q, q
                }
                return null
            }
        },
        nextNode: {
            value: function() {
                var q, K, Y, z;
                q = this._currentNode, K = DP.FILTER_ACCEPT;
                A: while (!0) {
                    for (Y = q.firstChild; Y; Y = q.firstChild)
                        if (q = Y, K = this._internalFilter(q), K === DP.FILTER_ACCEPT) return this._currentNode = q, q;
                        else if (K === DP.FILTER_REJECT) break;
                    for (z = hg4.nextSkippingChildren(q, this.root); z; z = hg4.nextSkippingChildren(q, this.root))
                        if (q = z, K = this._internalFilter(q), K === DP.FILTER_ACCEPT) return this._currentNode = q, q;
                        else if (K === DP.FILTER_SKIP) continue A;
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
// @from(Ln 340757, Col 4)
dg4 = R((kzH, pg4) => {
    pg4.exports = Ug4;
    var bLA = Xg1(),
        uLA = hLA(),
        gg4 = F_();

    function cLY(A, q, K) {
        if (K) return uLA.next(A, q);
        else {
            if (A === q) return null;
            return uLA.previous(A, null)
        }
    }

    function Fg4(A, q) {
        for (; q; q = q.parentNode)
            if (A === q) return !0;
        return !1
    }

    function Qg4(A, q) {
        var K, Y;
        K = A._referenceNode, Y = A._pointerBeforeReferenceNode;
        while (!0) {
            if (Y === q) Y = !Y;
            else if (K = cLY(K, A._root, q), K === null) return null;
            var z = A._internalFilter(K);
            if (z === bLA.FILTER_ACCEPT) break
        }
        return A._referenceNode = K, A._pointerBeforeReferenceNode = Y, K
    }

    function Ug4(A, q, K) {
        if (!A || !A.nodeType) gg4.NotSupportedError();
        this._root = A, this._referenceNode = A, this._pointerBeforeReferenceNode = !0, this._whatToShow = Number(q) || 0, this._filter = K || null, this._active = !1, A.doc._attachNodeIterator(this)
    }
    Object.defineProperties(Ug4.prototype, {
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
            value: function(q) {
                var K, Y;
                if (this._active) gg4.InvalidStateError();
                if (!(1 << q.nodeType - 1 & this._whatToShow)) return bLA.FILTER_SKIP;
                if (Y = this._filter, Y === null) K = bLA.FILTER_ACCEPT;
                else {
                    this._active = !0;
                    try {
                        if (typeof Y === "function") K = Y(q);
                        else K = Y.acceptNode(q)
                    } finally {
                        this._active = !1
                    }
                }
                return +K
            }
        },
        _preremove: {
            value: function(q) {
                if (Fg4(q, this._root)) return;
                if (!Fg4(q, this._referenceNode)) return;
                if (this._pointerBeforeReferenceNode) {
                    var K = q;
                    while (K.lastChild) K = K.lastChild;
                    if (K = uLA.next(K, this.root), K) {
                        this._referenceNode = K;
                        return
                    }
                    this._pointerBeforeReferenceNode = !1
                }
                if (q.previousSibling === null) this._referenceNode = q.parentNode;
                else {
                    this._referenceNode = q.previousSibling;
                    var Y;
                    for (Y = this._referenceNode.lastChild; Y; Y = this._referenceNode.lastChild) this._referenceNode = Y
                }
            }
        },
        nextNode: {
            value: function() {
                return Qg4(this, !0)
            }
        },
        previousNode: {
            value: function() {
                return Qg4(this, !1)
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
// @from(Ln 340878, Col 4)
KW6 = R((LzH, cg4) => {
    cg4.exports = jP;

    function jP(A) {
        if (!A) return Object.create(jP.prototype);
        this.url = A.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var q = jP.pattern.exec(this.url);
        if (q) {
            if (q[2]) this.scheme = q[2];
            if (q[4]) {
                var K = q[4].match(jP.userinfoPattern);
                if (K) this.username = K[1], this.password = K[3], q[4] = q[4].substring(K[0].length);
                if (q[4].match(jP.portPattern)) {
                    var Y = q[4].lastIndexOf(":");
                    this.host = q[4].substring(0, Y), this.port = q[4].substring(Y + 1)
                } else this.host = q[4]
            }
            if (q[5]) this.path = q[5];
            if (q[6]) this.query = q[7];
            if (q[8]) this.fragment = q[9]
        }
    }
    jP.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
    jP.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
    jP.portPattern = /:\d+$/;
    jP.authorityPattern = /^[^:\/?#]+:\/\//;
    jP.hierarchyPattern = /^[^:\/?#]+:\//;
    jP.percentEncode = function(q) {
        var K = q.charCodeAt(0);
        if (K < 256) return "%" + K.toString(16);
        else throw Error("can't percent-encode codepoints > 255 yet")
    };
    jP.prototype = {
        constructor: jP,
        isAbsolute: function() {
            return !!this.scheme
        },
        isAuthorityBased: function() {
            return jP.authorityPattern.test(this.url)
        },
        isHierarchical: function() {
            return jP.hierarchyPattern.test(this.url)
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
            var q = this,
                K = new jP(A),
                Y = new jP;
            if (K.scheme !== void 0) Y.scheme = K.scheme, Y.username = K.username, Y.password = K.password, Y.host = K.host, Y.port = K.port, Y.path = w(K.path), Y.query = K.query;
            else if (Y.scheme = q.scheme, K.host !== void 0) Y.username = K.username, Y.password = K.password, Y.host = K.host, Y.port = K.port, Y.path = w(K.path), Y.query = K.query;
            else if (Y.username = q.username, Y.password = q.password, Y.host = q.host, Y.port = q.port, !K.path)
                if (Y.path = q.path, K.query !== void 0) Y.query = K.query;
                else Y.query = q.query;
            else {
                if (K.path.charAt(0) === "/") Y.path = w(K.path);
                else Y.path = z(q.path, K.path), Y.path = w(Y.path);
                Y.query = K.query
            }
            return Y.fragment = K.fragment, Y.toString();

            function z(H, $) {
                if (q.host !== void 0 && !q.path) return "/" + $;
                var O = H.lastIndexOf("/");
                if (O === -1) return $;
                else return H.substring(0, O + 1) + $
            }

            function w(H) {
                if (!H) return H;
                var $ = "";
                while (H.length > 0) {
                    if (H === "." || H === "..") {
                        H = "";
                        break
                    }
                    var O = H.substring(0, 2),
                        _ = H.substring(0, 3),
                        J = H.substring(0, 4);
                    if (_ === "../") H = H.substring(3);
                    else if (O === "./") H = H.substring(2);
                    else if (_ === "/./") H = "/" + H.substring(3);
                    else if (O === "/." && H.length === 2) H = "/";
                    else if (J === "/../" || _ === "/.." && H.length === 3) H = "/" + H.substring(4), $ = $.replace(/\/?[^\/]*$/, "");
                    else {
                        var X = H.match(/(\/?([^\/]*))/)[0];
                        $ += X, H = H.substring(X.length)
                    }
                }
                return $
            }
        }
    }
})
// @from(Ln 340986, Col 4)
ng4 = R((RzH, ig4) => {
    ig4.exports = BLA;
    var lg4 = kW1();

    function BLA(A, q) {
        lg4.call(this, A, q)
    }
    BLA.prototype = Object.create(lg4.prototype, {
        constructor: {
            value: BLA
        }
    })
})
// @from(Ln 340999, Col 4)
mLA = R((yzH, rg4) => {
    rg4.exports = {
        Event: kW1(),
        UIEvent: pkA(),
        MouseEvent: ckA(),
        CustomEvent: ng4()
    }
})
// @from(Ln 341007, Col 4)
tg4 = R((ag4) => {
    Object.defineProperty(ag4, "__esModule", {
        value: !0
    });
    ag4.hyphenate = ag4.parse = void 0;

    function lLY(A) {
        let q = [],
            K = 0,
            Y = 0,
            z = 0,
            w = 0,
            H = 0,
            $ = null;
        while (K < A.length) switch (A.charCodeAt(K++)) {
            case 40:
                Y++;
                break;
            case 41:
                Y--;
                break;
            case 39:
                if (z === 0) z = 39;
                else if (z === 39 && A.charCodeAt(K - 1) !== 92) z = 0;
                break;
            case 34:
                if (z === 0) z = 34;
                else if (z === 34 && A.charCodeAt(K - 1) !== 92) z = 0;
                break;
            case 58:
                if (!$ && Y === 0 && z === 0) $ = og4(A.substring(H, K - 1).trim()), w = K;
                break;
            case 59:
                if ($ && w > 0 && Y === 0 && z === 0) {
                    let _ = A.substring(w, K - 1).trim();
                    q.push($, _), H = K, w = 0, $ = null
                }
                break
        }
        if ($ && w) {
            let O = A.slice(w).trim();
            q.push($, O)
        }
        return q
    }
    ag4.parse = lLY;

    function og4(A) {
        return A.replace(/[a-z][A-Z]/g, (q) => {
            return q.charAt(0) + "-" + q.charAt(1)
        }).toLowerCase()
    }
    ag4.hyphenate = og4
})
// @from(Ln 341061, Col 4)
YW6 = R((SzH, YU4) => {
    var {
        parse: nLY
    } = tg4();
    YU4.exports = function(A) {
        let q = new KU4(A);
        return new Proxy(q, {
            get: function(Y, z) {
                return z in Y ? Y[z] : Y.getPropertyValue(eg4(z))
            },
            has: function(Y, z) {
                return !0
            },
            set: function(Y, z, w) {
                if (z in Y) Y[z] = w;
                else Y.setProperty(eg4(z), w ?? void 0);
                return !0
            }
        })
    };

    function eg4(A) {
        return A.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    }

    function KU4(A) {
        this._element = A
    }
    var AU4 = "!important";

    function qU4(A) {
        let q = {
            property: {},
            priority: {}
        };
        if (!A) return q;
        let K = nLY(A);
        if (K.length < 2) return q;
        for (let Y = 0; Y < K.length; Y += 2) {
            let z = K[Y],
                w = K[Y + 1];
            if (w.endsWith(AU4)) q.priority[z] = "important", w = w.slice(0, -AU4.length).trim();
            q.property[z] = w
        }
        return q
    }
    var xW1 = {};
    KU4.prototype = Object.create(Object.prototype, {
        _parsed: {
            get: function() {
                if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
                    var A = this.cssText;
                    this._parsedStyles = qU4(A), this._lastParsedText = A, delete this._names
                }
                return this._parsedStyles
            }
        },
        _serialize: {
            value: function() {
                var A = this._parsed,
                    q = "";
                for (var K in A.property) {
                    if (q) q += " ";
                    if (q += K + ": " + A.property[K], A.priority[K]) q += " !" + A.priority[K];
                    q += ";"
                }
                this.cssText = q, this._lastParsedText = q, delete this._names
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
            value: function(A, q, K) {
                if (A = A.toLowerCase(), q === null || q === void 0) q = "";
                if (K === null || K === void 0) K = "";
                if (q !== xW1) q = "" + q;
                if (q = q.trim(), q === "") {
                    this.removeProperty(A);
                    return
                }
                if (K !== "" && K !== xW1 && !/^important$/i.test(K)) return;
                var Y = this._parsed;
                if (q === xW1) {
                    if (!Y.property[A]) return;
                    if (K !== "") Y.priority[A] = "important";
                    else delete Y.priority[A]
                } else {
                    if (q.indexOf(";") !== -1) return;
                    var z = qU4(A + ":" + q);
                    if (Object.getOwnPropertyNames(z.property).length === 0) return;
                    if (Object.getOwnPropertyNames(z.priority).length !== 0) return;
                    for (var w in z.property)
                        if (Y.property[w] = z.property[w], K === xW1) continue;
                        else if (K !== "") Y.priority[w] = "important";
                    else if (Y.priority[w]) delete Y.priority[w]
                }
                this._serialize()
            }
        },
        setPropertyValue: {
            value: function(A, q) {
                return this.setProperty(A, q, xW1)
            }
        },
        setPropertyPriority: {
            value: function(A, q) {
                return this.setProperty(A, xW1, q)
            }
        },
        removeProperty: {
            value: function(A) {
                A = A.toLowerCase();
                var q = this._parsed;
                if (A in q.property) delete q.property[A], delete q.priority[A], this._serialize()
            }
        }
    })
})
// @from(Ln 341207, Col 4)
FLA = R((hzH, zU4) => {
    var fj = KW6();
    zU4.exports = Dg1;

    function Dg1() {}
    Dg1.prototype = Object.create(Object.prototype, {
        _url: {
            get: function() {
                return new fj(this.href)
            }
        },
        protocol: {
            get: function() {
                var A = this._url;
                if (A && A.scheme) return A.scheme + ":";
                else return ":"
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute()) {
                    if (A = A.replace(/:+$/, ""), A = A.replace(/[^-+\.a-zA-Z0-9]/g, fj.percentEncode), A.length > 0) K.scheme = A, q = K.toString()
                }
                this.href = q
            }
        },
        host: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased()) return A.host + (A.port ? ":" + A.port : "");
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, fj.percentEncode), A.length > 0) K.host = A, delete K.port, q = K.toString()
                }
                this.href = q
            }
        },
        hostname: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased()) return A.host;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = A.replace(/^\/+/, ""), A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, fj.percentEncode), A.length > 0) K.host = A, q = K.toString()
                }
                this.href = q
            }
        },
        port: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased() && A.port !== void 0) return A.port;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = "" + A, A = A.replace(/[^0-9].*$/, ""), A = A.replace(/^0+/, ""), A.length === 0) A = "0";
                    if (parseInt(A, 10) <= 65535) K.port = A, q = K.toString()
                }
                this.href = q
            }
        },
        pathname: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isHierarchical()) return A.path;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute() && K.isHierarchical()) {
                    if (A.charAt(0) !== "/") A = "/" + A;
                    A = A.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, fj.percentEncode), K.path = A, q = K.toString()
                }
                this.href = q
            }
        },
        search: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isHierarchical() && A.query !== void 0) return "?" + A.query;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute() && K.isHierarchical()) {
                    if (A.charAt(0) === "?") A = A.substring(1);
                    A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, fj.percentEncode), K.query = A, q = K.toString()
                }
                this.href = q
            }
        },
        hash: {
            get: function() {
                var A = this._url;
                if (A == null || A.fragment == null || A.fragment === "") return "";
                else return "#" + A.fragment
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (A.charAt(0) === "#") A = A.substring(1);
                A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, fj.percentEncode), K.fragment = A, q = K.toString(), this.href = q
            }
        },
        username: {
            get: function() {
                var A = this._url;
                return A.username || ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute()) A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, fj.percentEncode), K.username = A, q = K.toString();
                this.href = q
            }
        },
        password: {
            get: function() {
                var A = this._url;
                return A.password || ""
            },
            set: function(A) {
                var q = this.href,
                    K = new fj(q);
                if (K.isAbsolute()) {
                    if (A === "") K.password = null;
                    else A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, fj.percentEncode), K.password = A;
                    q = K.toString()
                }
                this.href = q
            }
        },
        origin: {
            get: function() {
                var A = this._url;
                if (A == null) return "";
                var q = function(K) {
                    var Y = [A.scheme, A.host, +A.port || K];
                    return Y[0] + "://" + Y[1] + (Y[2] === K ? "" : ":" + Y[2])
                };
                switch (A.scheme) {
                    case "ftp":
                        return q(21);
                    case "gopher":
                        return q(70);
                    case "http":
                    case "ws":
                        return q(80);
                    case "https":
                    case "wss":
                        return q(443);
                    default:
                        return A.scheme + "://"
                }
            }
        }
    });
    Dg1._inherit = function(A) {
        Object.getOwnPropertyNames(Dg1.prototype).forEach(function(q) {
            if (q === "constructor" || q === "href") return;
            var K = Object.getOwnPropertyDescriptor(Dg1.prototype, q);
            Object.defineProperty(A, q, K)
        })
    }
})
// @from(Ln 341385, Col 4)
QLA = R((IzH, $U4) => {
    var wU4 = wLA(),
        rLY = pP6().isApiWritable;
    $U4.exports = function(A, q, K, Y) {
        var z = A.ctor;
        if (z) {
            var w = A.props || {};
            if (A.attributes)
                for (var H in A.attributes) {
                    var $ = A.attributes[H];
                    if (typeof $ !== "object" || Array.isArray($)) $ = {
                        type: $
                    };
                    if (!$.name) $.name = H.toLowerCase();
                    w[H] = wU4.property($)
                }
            if (w.constructor = {
                    value: z,
                    writable: rLY
                }, z.prototype = Object.create((A.superclass || q).prototype, w), A.events) aLY(z, A.events);
            K[A.name] = z
        } else z = q;
        return (A.tags || A.tag && [A.tag] || []).forEach(function(O) {
            Y[O] = z
        }), z
    };

    function HU4(A, q, K, Y) {
        this.body = A, this.document = q, this.form = K, this.element = Y
    }
    HU4.prototype.build = function() {
        return () => {}
    };

    function oLY(A, q, K, Y) {
        var z = A.ownerDocument || Object.create(null),
            w = A.form || Object.create(null);
        A[q] = new HU4(Y, z, w, A).build()
    }

    function aLY(A, q) {
        var K = A.prototype;
        q.forEach(function(Y) {
            Object.defineProperty(K, "on" + Y, {
                get: function() {
                    return this._getEventHandler(Y)
                },
                set: function(z) {
                    this._setEventHandler(Y, z)
                }
            }), wU4.registerChangeHandler(A, "on" + Y, oLY)
        })
    }
})