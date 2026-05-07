
// @from(Ln 330024, Col 4)
P17 = p((ctz) => {
    var cx = vX6(),
        Sl = cx.find,
        Ltz = cx.hasDefaultHTMLNamespace,
        JC6 = cx.hasOwn,
        htz = cx.isHTMLMimeType,
        Rtz = cx.isHTMLRawTextElement,
        Stz = cx.isHTMLVoidElement,
        Z48 = cx.MIME_TYPE,
        Cl = cx.NAMESPACE,
        ok = Symbol(),
        _zK = H48(),
        X3 = _zK.DOMException,
        Ctz = _zK.DOMExceptionName,
        Rl = $17();

    function By(q) {
        if (q !== ok) throw TypeError("Illegal constructor")
    }

    function btz(q) {
        return q !== ""
    }

    function Itz(q) {
        return q ? q.split(/[\t\n\f\r ]+/).filter(btz) : []
    }

    function xtz(q, K) {
        if (!JC6(q, K)) q[K] = !0;
        return q
    }

    function a_K(q) {
        if (!q) return [];
        var K = Itz(q);
        return Object.keys(K.reduce(xtz, {}))
    }

    function utz(q) {
        return function(K) {
            return q && q.indexOf(K) !== -1
        }
    }

    function zzK(q) {
        if (!Rl.QName_exact.test(q)) throw new X3(X3.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + q + '"')
    }

    function H17(q, K) {
        zzK(K), q = q || null;
        var _ = null,
            z = K;
        if (K.indexOf(":") >= 0) {
            var Y = K.split(":");
            _ = Y[0], z = Y[1]
        }
        if (_ !== null && q === null) throw new X3(X3.NAMESPACE_ERR, "prefix is non-null and namespace is null");
        if (_ === "xml" && q !== cx.NAMESPACE.XML) throw new X3(X3.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
        if ((_ === "xmlns" || K === "xmlns") && q !== cx.NAMESPACE.XMLNS) throw new X3(X3.NAMESPACE_ERR, 'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace');
        if (q === cx.NAMESPACE.XMLNS && _ !== "xmlns" && K !== "xmlns") throw new X3(X3.NAMESPACE_ERR, 'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"');
        return [q, _, z]
    }

    function PC6(q, K) {
        for (var _ in q)
            if (JC6(q, _)) K[_] = q[_]
    }

    function py(q, K) {
        var _ = q.prototype;
        if (!(_ instanceof K)) {
            let z = function() {};
            z.prototype = K.prototype, z = new z, PC6(_, z), q.prototype = _ = z
        }
        if (_.constructor != q) {
            if (typeof q != "function") console.error("unknown Class:" + q);
            _.constructor = q
        }
    }
    var Fy = {},
        hF = Fy.ELEMENT_NODE = 1,
        XC6 = Fy.ATTRIBUTE_NODE = 2,
        cp8 = Fy.TEXT_NODE = 3,
        YzK = Fy.CDATA_SECTION_NODE = 4,
        AzK = Fy.ENTITY_REFERENCE_NODE = 5,
        mtz = Fy.ENTITY_NODE = 6,
        OzK = Fy.PROCESSING_INSTRUCTION_NODE = 7,
        wzK = Fy.COMMENT_NODE = 8,
        G48 = Fy.DOCUMENT_NODE = 9,
        $zK = Fy.DOCUMENT_TYPE_NODE = 10,
        q96 = Fy.DOCUMENT_FRAGMENT_NODE = 11,
        Btz = Fy.NOTATION_NODE = 12,
        NX = cx.freeze({
            DOCUMENT_POSITION_DISCONNECTED: 1,
            DOCUMENT_POSITION_PRECEDING: 2,
            DOCUMENT_POSITION_FOLLOWING: 4,
            DOCUMENT_POSITION_CONTAINS: 8,
            DOCUMENT_POSITION_CONTAINED_BY: 16,
            DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
        });

    function jzK(q, K) {
        if (K.length < q.length) return jzK(K, q);
        var _ = null;
        for (var z in q) {
            if (q[z] !== K[z]) return _;
            _ = q[z]
        }
        return _
    }

    function s_K(q) {
        if (!q.guid) q.guid = Math.random();
        return q.guid
    }

    function A0() {}
    A0.prototype = {
        length: 0,
        item: function(q) {
            return q >= 0 && q < this.length ? this[q] : null
        },
        toString: function(q) {
            for (var K = [], _ = 0; _ < this.length; _++) HC6(this[_], K, q);
            return K.join("")
        },
        filter: function(q) {
            return Array.prototype.filter.call(this, q)
        },
        indexOf: function(q) {
            return Array.prototype.indexOf.call(this, q)
        }
    };
    A0.prototype[Symbol.iterator] = function() {
        var q = this,
            K = 0;
        return {
            next: function() {
                if (K < q.length) return {
                    value: q[K++],
                    done: !1
                };
                else return {
                    done: !0
                }
            },
            return: function() {
                return {
                    done: !0
                }
            }
        }
    };

    function kX6(q, K) {
        this._node = q, this._refresh = K, np8(this)
    }

    function np8(q) {
        var K = q._node._inc || q._node.ownerDocument._inc;
        if (q._inc !== K) {
            var _ = q._refresh(q._node);
            if (TzK(q, "length", _.length), !q.$$length || _.length < q.$$length) {
                for (var z = _.length; z in q; z++)
                    if (JC6(q, z)) delete q[z]
            }
            PC6(_, q), q._inc = K
        }
    }
    kX6.prototype.item = function(q) {
        return np8(this), this[q] || null
    };
    py(kX6, A0);

    function MC6() {}

    function HzK(q, K) {
        var _ = 0;
        while (_ < q.length) {
            if (q[_] === K) return _;
            _++
        }
    }

    function ptz(q, K, _, z) {
        if (z) K[HzK(K, z)] = _;
        else K[K.length] = _, K.length++;
        if (q) {
            _.ownerElement = q;
            var Y = q.ownerDocument;
            if (Y) z && MzK(Y, q, z), Ftz(Y, q, _)
        }
    }

    function t_K(q, K, _) {
        var z = HzK(K, _);
        if (z >= 0) {
            var Y = K.length - 1;
            while (z <= Y) K[z] = K[++z];
            if (K.length = Y, q) {
                var A = q.ownerDocument;
                if (A) MzK(A, q, _);
                _.ownerElement = null
            }
        }
    }
    MC6.prototype = {
        length: 0,
        item: A0.prototype.item,
        getNamedItem: function(q) {
            if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) q = q.toLowerCase();
            var K = 0;
            while (K < this.length) {
                var _ = this[K];
                if (_.nodeName === q) return _;
                K++
            }
            return null
        },
        setNamedItem: function(q) {
            var K = q.ownerElement;
            if (K && K !== this._ownerElement) throw new X3(X3.INUSE_ATTRIBUTE_ERR);
            var _ = this.getNamedItemNS(q.namespaceURI, q.localName);
            if (_ === q) return q;
            return ptz(this._ownerElement, this, q, _), _
        },
        setNamedItemNS: function(q) {
            return this.setNamedItem(q)
        },
        removeNamedItem: function(q) {
            var K = this.getNamedItem(q);
            if (!K) throw new X3(X3.NOT_FOUND_ERR, q);
            return t_K(this._ownerElement, this, K), K
        },
        removeNamedItemNS: function(q, K) {
            var _ = this.getNamedItemNS(q, K);
            if (!_) throw new X3(X3.NOT_FOUND_ERR, q ? q + " : " + K : K);
            return t_K(this._ownerElement, this, _), _
        },
        getNamedItemNS: function(q, K) {
            if (!q) q = null;
            var _ = 0;
            while (_ < this.length) {
                var z = this[_];
                if (z.localName === K && z.namespaceURI === q) return z;
                _++
            }
            return null
        }
    };
    MC6.prototype[Symbol.iterator] = function() {
        var q = this,
            K = 0;
        return {
            next: function() {
                if (K < q.length) return {
                    value: q[K++],
                    done: !1
                };
                else return {
                    done: !0
                }
            },
            return: function() {
                return {
                    done: !0
                }
            }
        }
    };

    function JzK() {}
    JzK.prototype = {
        hasFeature: function(q, K) {
            return !0
        },
        createDocument: function(q, K, _) {
            var z = Z48.XML_APPLICATION;
            if (q === Cl.HTML) z = Z48.XML_XHTML_APPLICATION;
            else if (q === Cl.SVG) z = Z48.XML_SVG_IMAGE;
            var Y = new K96(ok, {
                contentType: z
            });
            if (Y.implementation = this, Y.childNodes = new A0, Y.doctype = _ || null, _) Y.appendChild(_);
            if (K) {
                var A = Y.createElementNS(q, K);
                Y.appendChild(A)
            }
            return Y
        },
        createDocumentType: function(q, K, _, z) {
            zzK(q);
            var Y = new op8(ok);
            return Y.name = q, Y.nodeName = q, Y.publicId = K || "", Y.systemId = _ || "", Y.internalSubset = z || "", Y.childNodes = new A0, Y
        },
        createHTMLDocument: function(q) {
            var K = new K96(ok, {
                contentType: Z48.HTML
            });
            if (K.implementation = this, K.childNodes = new A0, q !== !1) {
                K.doctype = this.createDocumentType("html"), K.doctype.ownerDocument = K, K.appendChild(K.doctype);
                var _ = K.createElement("html");
                K.appendChild(_);
                var z = K.createElement("head");
                if (_.appendChild(z), typeof q === "string") {
                    var Y = K.createElement("title");
                    Y.appendChild(K.createTextNode(q)), z.appendChild(Y)
                }
                _.appendChild(K.createElement("body"))
            }
            return K
        }
    };

    function XA(q) {
        By(q)
    }
    XA.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        parentNode: null,
        get parentElement() {
            return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null
        },
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        baseURI: "about:blank",
        get isConnected() {
            var q = this.getRootNode();
            return q && q.nodeType === q.DOCUMENT_NODE
        },
        contains: function(q) {
            if (!q) return !1;
            var K = q;
            do {
                if (this === K) return !0;
                K = q.parentNode
            } while (K);
            return !1
        },
        getRootNode: function(q) {
            var K = this;
            do {
                if (!K.parentNode) return K;
                K = K.parentNode
            } while (K)
        },
        isEqualNode: function(q) {
            if (!q) return !1;
            if (this.nodeType !== q.nodeType) return !1;
            switch (this.nodeType) {
                case this.DOCUMENT_TYPE_NODE:
                    if (this.name !== q.name) return !1;
                    if (this.publicId !== q.publicId) return !1;
                    if (this.systemId !== q.systemId) return !1;
                    break;
                case this.ELEMENT_NODE:
                    if (this.namespaceURI !== q.namespaceURI) return !1;
                    if (this.prefix !== q.prefix) return !1;
                    if (this.localName !== q.localName) return !1;
                    if (this.attributes.length !== q.attributes.length) return !1;
                    for (var K = 0; K < this.attributes.length; K++) {
                        var _ = this.attributes.item(K);
                        if (!_.isEqualNode(q.getAttributeNodeNS(_.namespaceURI, _.localName))) return !1
                    }
                    break;
                case this.ATTRIBUTE_NODE:
                    if (this.namespaceURI !== q.namespaceURI) return !1;
                    if (this.localName !== q.localName) return !1;
                    if (this.value !== q.value) return !1;
                    break;
                case this.PROCESSING_INSTRUCTION_NODE:
                    if (this.target !== q.target || this.data !== q.data) return !1;
                    break;
                case this.TEXT_NODE:
                case this.COMMENT_NODE:
                    if (this.data !== q.data) return !1;
                    break
            }
            if (this.childNodes.length !== q.childNodes.length) return !1;
            for (var K = 0; K < this.childNodes.length; K++)
                if (!this.childNodes[K].isEqualNode(q.childNodes[K])) return !1;
            return !0
        },
        isSameNode: function(q) {
            return this === q
        },
        insertBefore: function(q, K) {
            return lp8(this, q, K)
        },
        replaceChild: function(q, K) {
            if (lp8(this, q, K, ZzK), K) this.removeChild(K)
        },
        removeChild: function(q) {
            return WzK(this, q)
        },
        appendChild: function(q) {
            return this.insertBefore(q, null)
        },
        hasChildNodes: function() {
            return this.firstChild != null
        },
        cloneNode: function(q) {
            return J17(this.ownerDocument || this, this, q)
        },
        normalize: function() {
            var q = this.firstChild;
            while (q) {
                var K = q.nextSibling;
                if (K && K.nodeType == cp8 && q.nodeType == cp8) this.removeChild(K), q.appendData(K.data);
                else q.normalize(), q = K
            }
        },
        isSupported: function(q, K) {
            return this.ownerDocument.implementation.hasFeature(q, K)
        },
        lookupPrefix: function(q) {
            var K = this;
            while (K) {
                var _ = K._nsMap;
                if (_) {
                    for (var z in _)
                        if (JC6(_, z) && _[z] === q) return z
                }
                K = K.nodeType == XC6 ? K.ownerDocument : K.parentNode
            }
            return null
        },
        lookupNamespaceURI: function(q) {
            var K = this;
            while (K) {
                var _ = K._nsMap;
                if (_) {
                    if (JC6(_, q)) return _[q]
                }
                K = K.nodeType == XC6 ? K.ownerDocument : K.parentNode
            }
            return null
        },
        isDefaultNamespace: function(q) {
            var K = this.lookupPrefix(q);
            return K == null
        },
        compareDocumentPosition: function(q) {
            if (this === q) return 0;
            var K = q,
                _ = this,
                z = null,
                Y = null;
            if (K instanceof NX6) z = K, K = z.ownerElement;
            if (_ instanceof NX6) {
                if (Y = _, _ = Y.ownerElement, z && K && _ === K)
                    for (var A = 0, O; O = _.attributes[A]; A++) {
                        if (O === z) return NX.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + NX.DOCUMENT_POSITION_PRECEDING;
                        if (O === Y) return NX.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + NX.DOCUMENT_POSITION_FOLLOWING
                    }
            }
            if (!K || !_ || _.ownerDocument !== K.ownerDocument) return NX.DOCUMENT_POSITION_DISCONNECTED + NX.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (s_K(_.ownerDocument) > s_K(K.ownerDocument) ? NX.DOCUMENT_POSITION_FOLLOWING : NX.DOCUMENT_POSITION_PRECEDING);
            if (Y && K === _) return NX.DOCUMENT_POSITION_CONTAINS + NX.DOCUMENT_POSITION_PRECEDING;
            if (z && K === _) return NX.DOCUMENT_POSITION_CONTAINED_BY + NX.DOCUMENT_POSITION_FOLLOWING;
            var w = [],
                $ = K.parentNode;
            while ($) {
                if (!Y && $ === _) return NX.DOCUMENT_POSITION_CONTAINED_BY + NX.DOCUMENT_POSITION_FOLLOWING;
                w.push($), $ = $.parentNode
            }
            w.reverse();
            var j = [],
                H = _.parentNode;
            while (H) {
                if (!z && H === K) return NX.DOCUMENT_POSITION_CONTAINS + NX.DOCUMENT_POSITION_PRECEDING;
                j.push(H), H = H.parentNode
            }
            j.reverse();
            var J = jzK(w, j);
            for (var X in J.childNodes) {
                var M = J.childNodes[X];
                if (M === _) return NX.DOCUMENT_POSITION_FOLLOWING;
                if (M === K) return NX.DOCUMENT_POSITION_PRECEDING;
                if (j.indexOf(M) >= 0) return NX.DOCUMENT_POSITION_FOLLOWING;
                if (w.indexOf(M) >= 0) return NX.DOCUMENT_POSITION_PRECEDING
            }
            return 0
        }
    };

    function XzK(q) {
        return q == "<" && "&lt;" || q == ">" && "&gt;" || q == "&" && "&amp;" || q == '"' && "&quot;" || "&#" + q.charCodeAt() + ";"
    }
    PC6(Fy, XA);
    PC6(Fy, XA.prototype);
    PC6(NX, XA);
    PC6(NX, XA.prototype);

    function f48(q, K) {
        if (K(q)) return !0;
        if (q = q.firstChild)
            do
                if (f48(q, K)) return !0; while (q = q.nextSibling)
    }

    function K96(q, K) {
        By(q);
        var _ = K || {};
        this.ownerDocument = this, this.contentType = _.contentType || Z48.XML_APPLICATION, this.type = htz(this.contentType) ? "html" : "xml"
    }

    function Ftz(q, K, _) {
        q && q._inc++;
        var z = _.namespaceURI;
        if (z === Cl.XMLNS) K._nsMap[_.prefix ? _.localName : ""] = _.value
    }

    function MzK(q, K, _, z) {
        q && q._inc++;
        var Y = _.namespaceURI;
        if (Y === Cl.XMLNS) delete K._nsMap[_.prefix ? _.localName : ""]
    }

    function PzK(q, K, _) {
        if (q && q._inc) {
            q._inc++;
            var z = K.childNodes;
            if (_ && !_.nextSibling) z[z.length++] = _;
            else {
                var Y = K.firstChild,
                    A = 0;
                while (Y) z[A++] = Y, Y = Y.nextSibling;
                z.length = A, delete z[z.length]
            }
        }
    }

    function WzK(q, K) {
        if (q !== K.parentNode) throw new X3(X3.NOT_FOUND_ERR, "child's parent is not parent");
        var {
            previousSibling: _,
            nextSibling: z
        } = K;
        if (_) _.nextSibling = z;
        else q.firstChild = z;
        if (z) z.previousSibling = _;
        else q.lastChild = _;
        return PzK(q.ownerDocument, q), K.parentNode = null, K.previousSibling = null, K.nextSibling = null, K
    }

    function gtz(q) {
        return q && (q.nodeType === XA.DOCUMENT_NODE || q.nodeType === XA.DOCUMENT_FRAGMENT_NODE || q.nodeType === XA.ELEMENT_NODE)
    }

    function Utz(q) {
        return q && (q.nodeType === XA.CDATA_SECTION_NODE || q.nodeType === XA.COMMENT_NODE || q.nodeType === XA.DOCUMENT_FRAGMENT_NODE || q.nodeType === XA.DOCUMENT_TYPE_NODE || q.nodeType === XA.ELEMENT_NODE || q.nodeType === XA.PROCESSING_INSTRUCTION_NODE || q.nodeType === XA.TEXT_NODE)
    }

    function _96(q) {
        return q && q.nodeType === XA.DOCUMENT_TYPE_NODE
    }

    function It(q) {
        return q && q.nodeType === XA.ELEMENT_NODE
    }

    function DzK(q) {
        return q && q.nodeType === XA.TEXT_NODE
    }

    function e_K(q, K) {
        var _ = q.childNodes || [];
        if (Sl(_, It) || _96(K)) return !1;
        var z = Sl(_, _96);
        return !(K && z && _.indexOf(z) > _.indexOf(K))
    }

    function qzK(q, K) {
        var _ = q.childNodes || [];

        function z(A) {
            return It(A) && A !== K
        }
        if (Sl(_, z)) return !1;
        var Y = Sl(_, _96);
        return !(K && Y && _.indexOf(Y) > _.indexOf(K))
    }

    function Qtz(q, K, _) {
        if (!gtz(q)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + q.nodeType);
        if (_ && _.parentNode !== q) throw new X3(X3.NOT_FOUND_ERR, "child not in parent");
        if (!Utz(K) || _96(K) && q.nodeType !== XA.DOCUMENT_NODE) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Unexpected node type " + K.nodeType + " for parent node type " + q.nodeType)
    }

    function dtz(q, K, _) {
        var z = q.childNodes || [],
            Y = K.childNodes || [];
        if (K.nodeType === XA.DOCUMENT_FRAGMENT_NODE) {
            var A = Y.filter(It);
            if (A.length > 1 || Sl(Y, DzK)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
            if (A.length === 1 && !e_K(q, _)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype")
        }
        if (It(K)) {
            if (!e_K(q, _)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype")
        }
        if (_96(K)) {
            if (Sl(z, _96)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
            var O = Sl(z, It);
            if (_ && z.indexOf(O) < z.indexOf(_)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
            if (!_ && O) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present")
        }
    }

    function ZzK(q, K, _) {
        var z = q.childNodes || [],
            Y = K.childNodes || [];
        if (K.nodeType === XA.DOCUMENT_FRAGMENT_NODE) {
            var A = Y.filter(It);
            if (A.length > 1 || Sl(Y, DzK)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
            if (A.length === 1 && !qzK(q, _)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype")
        }
        if (It(K)) {
            if (!qzK(q, _)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype")
        }
        if (_96(K)) {
            if (Sl(z, function($) {
                    return _96($) && $ !== _
                })) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
            var O = Sl(z, It);
            if (_ && z.indexOf(O) < z.indexOf(_)) throw new X3(X3.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element")
        }
    }

    function lp8(q, K, _, z) {
        if (Qtz(q, K, _), q.nodeType === XA.DOCUMENT_NODE)(z || dtz)(q, K, _);
        var Y = K.parentNode;
        if (Y) Y.removeChild(K);
        if (K.nodeType === q96) {
            var A = K.firstChild;
            if (A == null) return K;
            var O = K.lastChild
        } else A = O = K;
        var w = _ ? _.previousSibling : q.lastChild;
        if (A.previousSibling = w, O.nextSibling = _, w) w.nextSibling = A;
        else q.firstChild = A;
        if (_ == null) q.lastChild = O;
        else _.previousSibling = O;
        do A.parentNode = q; while (A !== O && (A = A.nextSibling));
        if (PzK(q.ownerDocument || q, q, K), K.nodeType == q96) K.firstChild = K.lastChild = null;
        return K
    }
    K96.prototype = {
        implementation: null,
        nodeName: "#document",
        nodeType: G48,
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(q, K) {
            if (q.nodeType === q96) {
                var _ = q.firstChild;
                while (_) {
                    var z = _.nextSibling;
                    this.insertBefore(_, K), _ = z
                }
                return q
            }
            if (lp8(this, q, K), q.ownerDocument = this, this.documentElement === null && q.nodeType === hF) this.documentElement = q;
            return q
        },
        removeChild: function(q) {
            var K = WzK(this, q);
            if (K === this.documentElement) this.documentElement = null;
            return K
        },
        replaceChild: function(q, K) {
            if (lp8(this, q, K, ZzK), q.ownerDocument = this, K) this.removeChild(K);
            if (It(q)) this.documentElement = q
        },
        importNode: function(q, K) {
            return vzK(this, q, K)
        },
        getElementById: function(q) {
            var K = null;
            return f48(this.documentElement, function(_) {
                if (_.nodeType == hF) {
                    if (_.getAttribute("id") == q) return K = _, !0
                }
            }), K
        },
        createElement: function(q) {
            var K = new z96(ok);
            if (K.ownerDocument = this, this.type === "html") q = q.toLowerCase();
            if (Ltz(this.contentType)) K.namespaceURI = Cl.HTML;
            K.nodeName = q, K.tagName = q, K.localName = q, K.childNodes = new A0;
            var _ = K.attributes = new MC6;
            return _._ownerElement = K, K
        },
        createDocumentFragment: function() {
            var q = new T48(ok);
            return q.ownerDocument = this, q.childNodes = new A0, q
        },
        createTextNode: function(q) {
            var K = new v48(ok);
            return K.ownerDocument = this, K.childNodes = new A0, K.appendData(q), K
        },
        createComment: function(q) {
            var K = new ip8(ok);
            return K.ownerDocument = this, K.childNodes = new A0, K.appendData(q), K
        },
        createCDATASection: function(q) {
            var K = new rp8(ok);
            return K.ownerDocument = this, K.childNodes = new A0, K.appendData(q), K
        },
        createProcessingInstruction: function(q, K) {
            var _ = new sp8(ok);
            return _.ownerDocument = this, _.childNodes = new A0, _.nodeName = _.target = q, _.nodeValue = _.data = K, _
        },
        createAttribute: function(q) {
            if (!Rl.QName_exact.test(q)) throw new X3(X3.INVALID_CHARACTER_ERR, 'invalid character in name "' + q + '"');
            if (this.type === "html") q = q.toLowerCase();
            return this._createAttribute(q)
        },
        _createAttribute: function(q) {
            var K = new NX6(ok);
            return K.ownerDocument = this, K.childNodes = new A0, K.name = q, K.nodeName = q, K.localName = q, K.specified = !0, K
        },
        createEntityReference: function(q) {
            if (!Rl.Name.test(q)) throw new X3(X3.INVALID_CHARACTER_ERR, 'not a valid xml name "' + q + '"');
            if (this.type === "html") throw new X3("document is an html document", Ctz.NotSupportedError);
            var K = new ap8(ok);
            return K.ownerDocument = this, K.childNodes = new A0, K.nodeName = q, K
        },
        createElementNS: function(q, K) {
            var _ = H17(q, K),
                z = new z96(ok),
                Y = z.attributes = new MC6;
            return z.childNodes = new A0, z.ownerDocument = this, z.nodeName = K, z.tagName = K, z.namespaceURI = _[0], z.prefix = _[1], z.localName = _[2], Y._ownerElement = z, z
        },
        createAttributeNS: function(q, K) {
            var _ = H17(q, K),
                z = new NX6(ok);
            return z.ownerDocument = this, z.childNodes = new A0, z.nodeName = K, z.name = K, z.specified = !0, z.namespaceURI = _[0], z.prefix = _[1], z.localName = _[2], z
        }
    };
    py(K96, XA);

    function z96(q) {
        By(q), this._nsMap = Object.create(null)
    }
    z96.prototype = {
        nodeType: hF,
        attributes: null,
        getQualifiedName: function() {
            return this.prefix ? this.prefix + ":" + this.localName : this.localName
        },
        _isInHTMLDocumentAndNamespace: function() {
            return this.ownerDocument.type === "html" && this.namespaceURI === Cl.HTML
        },
        hasAttributes: function() {
            return !!(this.attributes && this.attributes.length)
        },
        hasAttribute: function(q) {
            return !!this.getAttributeNode(q)
        },
        getAttribute: function(q) {
            var K = this.getAttributeNode(q);
            return K ? K.value : null
        },
        getAttributeNode: function(q) {
            if (this._isInHTMLDocumentAndNamespace()) q = q.toLowerCase();
            return this.attributes.getNamedItem(q)
        },
        setAttribute: function(q, K) {
            if (this._isInHTMLDocumentAndNamespace()) q = q.toLowerCase();
            var _ = this.getAttributeNode(q);
            if (_) _.value = _.nodeValue = "" + K;
            else _ = this.ownerDocument._createAttribute(q), _.value = _.nodeValue = "" + K, this.setAttributeNode(_)
        },
        removeAttribute: function(q) {
            var K = this.getAttributeNode(q);
            K && this.removeAttributeNode(K)
        },
        setAttributeNode: function(q) {
            return this.attributes.setNamedItem(q)
        },
        setAttributeNodeNS: function(q) {
            return this.attributes.setNamedItemNS(q)
        },
        removeAttributeNode: function(q) {
            return this.attributes.removeNamedItem(q.nodeName)
        },
        removeAttributeNS: function(q, K) {
            var _ = this.getAttributeNodeNS(q, K);
            _ && this.removeAttributeNode(_)
        },
        hasAttributeNS: function(q, K) {
            return this.getAttributeNodeNS(q, K) != null
        },
        getAttributeNS: function(q, K) {
            var _ = this.getAttributeNodeNS(q, K);
            return _ ? _.value : null
        },
        setAttributeNS: function(q, K, _) {
            var z = H17(q, K),
                Y = z[2],
                A = this.getAttributeNodeNS(q, Y);
            if (A) A.value = A.nodeValue = "" + _;
            else A = this.ownerDocument.createAttributeNS(q, K), A.value = A.nodeValue = "" + _, this.setAttributeNode(A)
        },
        getAttributeNodeNS: function(q, K) {
            return this.attributes.getNamedItemNS(q, K)
        },
        getElementsByClassName: function(q) {
            var K = a_K(q);
            return new kX6(this, function(_) {
                var z = [];
                if (K.length > 0) f48(_, function(Y) {
                    if (Y !== _ && Y.nodeType === hF) {
                        var A = Y.getAttribute("class");
                        if (A) {
                            var O = q === A;
                            if (!O) {
                                var w = a_K(A);
                                O = K.every(utz(w))
                            }
                            if (O) z.push(Y)
                        }
                    }
                });
                return z
            })
        },
        getElementsByTagName: function(q) {
            var K = (this.nodeType === G48 ? this : this.ownerDocument).type === "html",
                _ = q.toLowerCase();
            return new kX6(this, function(z) {
                var Y = [];
                return f48(z, function(A) {
                    if (A === z || A.nodeType !== hF) return;
                    if (q === "*") Y.push(A);
                    else {
                        var O = A.getQualifiedName(),
                            w = K && A.namespaceURI === Cl.HTML ? _ : q;
                        if (O === w) Y.push(A)
                    }
                }), Y
            })
        },
        getElementsByTagNameNS: function(q, K) {
            return new kX6(this, function(_) {
                var z = [];
                return f48(_, function(Y) {
                    if (Y !== _ && Y.nodeType === hF && (q === "*" || Y.namespaceURI === q) && (K === "*" || Y.localName == K)) z.push(Y)
                }), z
            })
        }
    };
    K96.prototype.getElementsByClassName = z96.prototype.getElementsByClassName;
    K96.prototype.getElementsByTagName = z96.prototype.getElementsByTagName;
    K96.prototype.getElementsByTagNameNS = z96.prototype.getElementsByTagNameNS;
    py(z96, XA);

    function NX6(q) {
        By(q), this.namespaceURI = null, this.prefix = null, this.ownerElement = null
    }
    NX6.prototype.nodeType = XC6;
    py(NX6, XA);

    function WC6(q) {
        By(q)
    }
    WC6.prototype = {
        data: "",
        substringData: function(q, K) {
            return this.data.substring(q, q + K)
        },
        appendData: function(q) {
            q = this.data + q, this.nodeValue = this.data = q, this.length = q.length
        },
        insertData: function(q, K) {
            this.replaceData(q, 0, K)
        },
        deleteData: function(q, K) {
            this.replaceData(q, K, "")
        },
        replaceData: function(q, K, _) {
            var z = this.data.substring(0, q),
                Y = this.data.substring(q + K);
            _ = z + _ + Y, this.nodeValue = this.data = _, this.length = _.length
        }
    };
    py(WC6, XA);

    function v48(q) {
        By(q)
    }
    v48.prototype = {
        nodeName: "#text",
        nodeType: cp8,
        splitText: function(q) {
            var K = this.data,
                _ = K.substring(q);
            K = K.substring(0, q), this.data = this.nodeValue = K, this.length = K.length;
            var z = this.ownerDocument.createTextNode(_);
            if (this.parentNode) this.parentNode.insertBefore(z, this.nextSibling);
            return z
        }
    };
    py(v48, WC6);

    function ip8(q) {
        By(q)
    }
    ip8.prototype = {
        nodeName: "#comment",
        nodeType: wzK
    };
    py(ip8, WC6);

    function rp8(q) {
        By(q)
    }
    rp8.prototype = {
        nodeName: "#cdata-section",
        nodeType: YzK
    };
    py(rp8, v48);

    function op8(q) {
        By(q)
    }
    op8.prototype.nodeType = $zK;
    py(op8, XA);

    function X17(q) {
        By(q)
    }
    X17.prototype.nodeType = Btz;
    py(X17, XA);

    function M17(q) {
        By(q)
    }
    M17.prototype.nodeType = mtz;
    py(M17, XA);

    function ap8(q) {
        By(q)
    }
    ap8.prototype.nodeType = AzK;
    py(ap8, XA);

    function T48(q) {
        By(q)
    }
    T48.prototype.nodeName = "#document-fragment";
    T48.prototype.nodeType = q96;
    py(T48, XA);

    function sp8(q) {
        By(q)
    }
    sp8.prototype.nodeType = OzK;
    py(sp8, WC6);

    function fzK() {}
    fzK.prototype.serializeToString = function(q, K) {
        return GzK.call(q, K)
    };
    XA.prototype.toString = GzK;

    function GzK(q) {
        var K = [],
            _ = this.nodeType === G48 && this.documentElement || this,
            z = _.prefix,
            Y = _.namespaceURI;
        if (Y && z == null) {
            var z = _.lookupPrefix(Y);
            if (z == null) var A = [{
                namespace: Y,
                prefix: null
            }]
        }
        return HC6(this, K, q, A), K.join("")
    }

    function KzK(q, K, _) {
        var z = q.prefix || "",
            Y = q.namespaceURI;
        if (!Y) return !1;
        if (z === "xml" && Y === Cl.XML || Y === Cl.XMLNS) return !1;
        var A = _.length;
        while (A--) {
            var O = _[A];
            if (O.prefix === z) return O.namespace !== Y
        }
        return !0
    }

    function j17(q, K, _) {
        q.push(" ", K, '="', _.replace(/[<>&"\t\n\r]/g, XzK), '"')
    }

    function HC6(q, K, _, z) {
        if (!z) z = [];
        var Y = q.nodeType === G48 ? q : q.ownerDocument,
            A = Y.type === "html";
        if (_)
            if (q = _(q), q) {
                if (typeof q == "string") {
                    K.push(q);
                    return
                }
            } else return;
        switch (q.nodeType) {
            case hF:
                var O = q.attributes,
                    w = O.length,
                    f = q.firstChild,
                    $ = q.tagName,
                    j = $;
                if (!A && !q.prefix && q.namespaceURI) {
                    var H;
                    for (var J = 0; J < O.length; J++)
                        if (O.item(J).name === "xmlns") {
                            H = O.item(J).value;
                            break
                        } if (!H)
                        for (var X = z.length - 1; X >= 0; X--) {
                            var M = z[X];
                            if (M.prefix === "" && M.namespace === q.namespaceURI) {
                                H = M.namespace;
                                break
                            }
                        }
                    if (H !== q.namespaceURI)
                        for (var X = z.length - 1; X >= 0; X--) {
                            var M = z[X];
                            if (M.namespace === q.namespaceURI) {
                                if (M.prefix) j = M.prefix + ":" + $;
                                break
                            }
                        }
                }
                K.push("<", j);
                for (var P = 0; P < w; P++) {
                    var W = O.item(P);
                    if (W.prefix == "xmlns") z.push({
                        prefix: W.localName,
                        namespace: W.value
                    });
                    else if (W.nodeName == "xmlns") z.push({
                        prefix: "",
                        namespace: W.value
                    })
                }
                for (var P = 0; P < w; P++) {
                    var W = O.item(P);
                    if (KzK(W, A, z)) {
                        var D = W.prefix || "",
                            Z = W.namespaceURI;
                        j17(K, D ? "xmlns:" + D : "xmlns", Z), z.push({
                            prefix: D,
                            namespace: Z
                        })
                    }
                    HC6(W, K, _, z)
                }
                if ($ === j && KzK(q, A, z)) {
                    var D = q.prefix || "",
                        Z = q.namespaceURI;
                    j17(K, D ? "xmlns:" + D : "xmlns", Z), z.push({
                        prefix: D,
                        namespace: Z
                    })
                }
                var G = !f;
                if (G && (A || q.namespaceURI === Cl.HTML)) G = Stz($);
                if (G) K.push("/>");
                else {
                    if (K.push(">"), A && Rtz($))
                        while (f) {
                            if (f.data) K.push(f.data);
                            else HC6(f, K, _, z.slice());
                            f = f.nextSibling
                        } else
                            while (f) HC6(f, K, _, z.slice()), f = f.nextSibling;
                    K.push("</", j, ">")
                }
                return;
            case G48:
            case q96:
                var f = q.firstChild;
                while (f) HC6(f, K, _, z.slice()), f = f.nextSibling;
                return;
            case XC6:
                return j17(K, q.name, q.value);
            case cp8:
                return K.push(q.data.replace(/[<&>]/g, XzK));
            case YzK:
                return K.push(Rl.CDATA_START, q.data, Rl.CDATA_END);
            case wzK:
                return K.push(Rl.COMMENT_START, q.data, Rl.COMMENT_END);
            case $zK:
                var {
                    publicId: v, systemId: V
                } = q;
                if (K.push(Rl.DOCTYPE_DECL_START, " ", q.name), v) {
                    if (K.push(" ", Rl.PUBLIC, " ", v), V && V !== ".") K.push(" ", V)
                } else if (V && V !== ".") K.push(" ", Rl.SYSTEM, " ", V);
                if (q.internalSubset) K.push(" [", q.internalSubset, "]");
                K.push(">");
                return;
            case OzK:
                return K.push("<?", q.target, " ", q.data, "?>");
            case AzK:
                return K.push("&", q.nodeName, ";");
            default:
                K.push("??", q.nodeName)
        }
    }

    function vzK(q, K, _) {
        var z;
        switch (K.nodeType) {
            case hF:
                z = K.cloneNode(!1), z.ownerDocument = q;
            case q96:
                break;
            case XC6:
                _ = !0;
                break
        }
        if (!z) z = K.cloneNode(!1);
        if (z.ownerDocument = q, z.parentNode = null, _) {
            var Y = K.firstChild;
            while (Y) z.appendChild(vzK(q, Y, _)), Y = Y.nextSibling
        }
        return z
    }

    function J17(q, K, _) {
        var z = new K.constructor(ok);
        for (var Y in K)
            if (JC6(K, Y)) {
                var A = K[Y];
                if (typeof A != "object") {
                    if (A != z[Y]) z[Y] = A
                }
            } if (K.childNodes) z.childNodes = new A0;
        switch (z.ownerDocument = q, z.nodeType) {
            case hF:
                var O = K.attributes,
                    w = z.attributes = new MC6,
                    $ = O.length;
                w._ownerElement = z;
                for (var j = 0; j < $; j++) z.setAttributeNode(J17(q, O.item(j), !0));
                break;
            case XC6:
                _ = !0
        }
        if (_) {
            var H = K.firstChild;
            while (H) z.appendChild(J17(q, H, _)), H = H.nextSibling
        }
        return z
    }

    function TzK(q, K, _) {
        q[K] = _
    }
    try {
        if (Object.defineProperty) {
            let q = function(K) {
                switch (K.nodeType) {
                    case hF:
                    case q96:
                        var _ = [];
                        K = K.firstChild;
                        while (K) {
                            if (K.nodeType !== 7 && K.nodeType !== 8) _.push(q(K));
                            K = K.nextSibling
                        }
                        return _.join("");
                    default:
                        return K.nodeValue
                }
            };
            Object.defineProperty(kX6.prototype, "length", {
                get: function() {
                    return np8(this), this.$$length
                }
            }), Object.defineProperty(XA.prototype, "textContent", {
                get: function() {
                    return q(this)
                },
                set: function(K) {
                    switch (this.nodeType) {
                        case hF:
                        case q96:
                            while (this.firstChild) this.removeChild(this.firstChild);
                            if (K || String(K)) this.appendChild(this.ownerDocument.createTextNode(K));
                            break;
                        default:
                            this.data = K, this.value = K, this.nodeValue = K
                    }
                }
            }), TzK = function(K, _, z) {
                K["$$" + _] = z
            }
        }
    } catch (q) {}
    ctz._updateLiveList = np8;
    ctz.Attr = NX6;
    ctz.CDATASection = rp8;
    ctz.CharacterData = WC6;
    ctz.Comment = ip8;
    ctz.Document = K96;
    ctz.DocumentFragment = T48;
    ctz.DocumentType = op8;
    ctz.DOMImplementation = JzK;
    ctz.Element = z96;
    ctz.Entity = M17;
    ctz.EntityReference = ap8;
    ctz.LiveNodeList = kX6;
    ctz.NamedNodeMap = MC6;
    ctz.Node = XA;
    ctz.NodeList = A0;
    ctz.Notation = X17;
    ctz.Text = v48;
    ctz.ProcessingInstruction = sp8;
    ctz.XMLSerializer = fzK
})
// @from(Ln 331261, Col 4)
NzK = p((Jez) => {
    var VzK = vX6().freeze;
    Jez.XML_ENTITIES = VzK({
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        quot: '"'
    });
    Jez.HTML_ENTITIES = VzK({
        Aacute: "Á",
        aacute: "á",
        Abreve: "Ă",
        abreve: "ă",
        ac: "∾",
        acd: "∿",
        acE: "∾̳",
        Acirc: "Â",
        acirc: "â",
        acute: "´",
        Acy: "А",
        acy: "а",
        AElig: "Æ",
        aelig: "æ",
        af: "⁡",
        Afr: "\uD835\uDD04",
        afr: "\uD835\uDD1E",
        Agrave: "À",
        agrave: "à",
        alefsym: "ℵ",
        aleph: "ℵ",
        Alpha: "Α",
        alpha: "α",
        Amacr: "Ā",
        amacr: "ā",
        amalg: "⨿",
        AMP: "&",
        amp: "&",
        And: "⩓",
        and: "∧",
        andand: "⩕",
        andd: "⩜",
        andslope: "⩘",
        andv: "⩚",
        ang: "∠",
        ange: "⦤",
        angle: "∠",
        angmsd: "∡",
        angmsdaa: "⦨",
        angmsdab: "⦩",
        angmsdac: "⦪",
        angmsdad: "⦫",
        angmsdae: "⦬",
        angmsdaf: "⦭",
        angmsdag: "⦮",
        angmsdah: "⦯",
        angrt: "∟",
        angrtvb: "⊾",
        angrtvbd: "⦝",
        angsph: "∢",
        angst: "Å",
        angzarr: "⍼",
        Aogon: "Ą",
        aogon: "ą",
        Aopf: "\uD835\uDD38",
        aopf: "\uD835\uDD52",
        ap: "≈",
        apacir: "⩯",
        apE: "⩰",
        ape: "≊",
        apid: "≋",
        apos: "'",
        ApplyFunction: "⁡",
        approx: "≈",
        approxeq: "≊",
        Aring: "Å",
        aring: "å",
        Ascr: "\uD835\uDC9C",
        ascr: "\uD835\uDCB6",
        Assign: "≔",
        ast: "*",
        asymp: "≈",
        asympeq: "≍",
        Atilde: "Ã",
        atilde: "ã",
        Auml: "Ä",
        auml: "ä",
        awconint: "∳",
        awint: "⨑",
        backcong: "≌",
        backepsilon: "϶",
        backprime: "‵",
        backsim: "∽",
        backsimeq: "⋍",
        Backslash: "∖",
        Barv: "⫧",
        barvee: "⊽",
        Barwed: "⌆",
        barwed: "⌅",
        barwedge: "⌅",
        bbrk: "⎵",
        bbrktbrk: "⎶",
        bcong: "≌",
        Bcy: "Б",
        bcy: "б",
        bdquo: "„",
        becaus: "∵",
        Because: "∵",
        because: "∵",
        bemptyv: "⦰",
        bepsi: "϶",
        bernou: "ℬ",
        Bernoullis: "ℬ",
        Beta: "Β",
        beta: "β",
        beth: "ℶ",
        between: "≬",
        Bfr: "\uD835\uDD05",
        bfr: "\uD835\uDD1F",
        bigcap: "⋂",
        bigcirc: "◯",
        bigcup: "⋃",
        bigodot: "⨀",
        bigoplus: "⨁",
        bigotimes: "⨂",
        bigsqcup: "⨆",
        bigstar: "★",
        bigtriangledown: "▽",
        bigtriangleup: "△",
        biguplus: "⨄",
        bigvee: "⋁",
        bigwedge: "⋀",
        bkarow: "⤍",
        blacklozenge: "⧫",
        blacksquare: "▪",
        blacktriangle: "▴",
        blacktriangledown: "▾",
        blacktriangleleft: "◂",
        blacktriangleright: "▸",
        blank: "␣",
        blk12: "▒",
        blk14: "░",
        blk34: "▓",
        block: "█",
        bne: "=⃥",
        bnequiv: "≡⃥",
        bNot: "⫭",
        bnot: "⌐",
        Bopf: "\uD835\uDD39",
        bopf: "\uD835\uDD53",
        bot: "⊥",
        bottom: "⊥",
        bowtie: "⋈",
        boxbox: "⧉",
        boxDL: "╗",
        boxDl: "╖",
        boxdL: "╕",
        boxdl: "┐",
        boxDR: "╔",
        boxDr: "╓",
        boxdR: "╒",
        boxdr: "┌",
        boxH: "═",
        boxh: "─",
        boxHD: "╦",
        boxHd: "╤",
        boxhD: "╥",
        boxhd: "┬",
        boxHU: "╩",
        boxHu: "╧",
        boxhU: "╨",
        boxhu: "┴",
        boxminus: "⊟",
        boxplus: "⊞",
        boxtimes: "⊠",
        boxUL: "╝",
        boxUl: "╜",
        boxuL: "╛",
        boxul: "┘",
        boxUR: "╚",
        boxUr: "╙",
        boxuR: "╘",
        boxur: "└",
        boxV: "║",
        boxv: "│",
        boxVH: "╬",
        boxVh: "╫",
        boxvH: "╪",
        boxvh: "┼",
        boxVL: "╣",
        boxVl: "╢",
        boxvL: "╡",
        boxvl: "┤",
        boxVR: "╠",
        boxVr: "╟",
        boxvR: "╞",
        boxvr: "├",
        bprime: "‵",
        Breve: "˘",
        breve: "˘",
        brvbar: "¦",
        Bscr: "ℬ",
        bscr: "\uD835\uDCB7",
        bsemi: "⁏",
        bsim: "∽",
        bsime: "⋍",
        bsol: "\\",
        bsolb: "⧅",
        bsolhsub: "⟈",
        bull: "•",
        bullet: "•",
        bump: "≎",
        bumpE: "⪮",
        bumpe: "≏",
        Bumpeq: "≎",
        bumpeq: "≏",
        Cacute: "Ć",
        cacute: "ć",
        Cap: "⋒",
        cap: "∩",
        capand: "⩄",
        capbrcup: "⩉",
        capcap: "⩋",
        capcup: "⩇",
        capdot: "⩀",
        CapitalDifferentialD: "ⅅ",
        caps: "∩︀",
        caret: "⁁",
        caron: "ˇ",
        Cayleys: "ℭ",
        ccaps: "⩍",
        Ccaron: "Č",
        ccaron: "č",
        Ccedil: "Ç",
        ccedil: "ç",
        Ccirc: "Ĉ",
        ccirc: "ĉ",
        Cconint: "∰",
        ccups: "⩌",
        ccupssm: "⩐",
        Cdot: "Ċ",
        cdot: "ċ",
        cedil: "¸",
        Cedilla: "¸",
        cemptyv: "⦲",
        cent: "¢",
        CenterDot: "·",
        centerdot: "·",
        Cfr: "ℭ",
        cfr: "\uD835\uDD20",
        CHcy: "Ч",
        chcy: "ч",
        check: "✓",
        checkmark: "✓",
        Chi: "Χ",
        chi: "χ",
        cir: "○",
        circ: "ˆ",
        circeq: "≗",
        circlearrowleft: "↺",
        circlearrowright: "↻",
        circledast: "⊛",
        circledcirc: "⊚",
        circleddash: "⊝",
        CircleDot: "⊙",
        circledR: "®",
        circledS: "Ⓢ",
        CircleMinus: "⊖",
        CirclePlus: "⊕",
        CircleTimes: "⊗",
        cirE: "⧃",
        cire: "≗",
        cirfnint: "⨐",
        cirmid: "⫯",
        cirscir: "⧂",
        ClockwiseContourIntegral: "∲",
        CloseCurlyDoubleQuote: "”",
        CloseCurlyQuote: "’",
        clubs: "♣",
        clubsuit: "♣",
        Colon: "∷",
        colon: ":",
        Colone: "⩴",
        colone: "≔",
        coloneq: "≔",
        comma: ",",
        commat: "@",
        comp: "∁",
        compfn: "∘",
        complement: "∁",
        complexes: "ℂ",
        cong: "≅",
        congdot: "⩭",
        Congruent: "≡",
        Conint: "∯",
        conint: "∮",
        ContourIntegral: "∮",
        Copf: "ℂ",
        copf: "\uD835\uDD54",
        coprod: "∐",
        Coproduct: "∐",
        COPY: "©",
        copy: "©",
        copysr: "℗",
        CounterClockwiseContourIntegral: "∳",
        crarr: "↵",
        Cross: "⨯",
        cross: "✗",
        Cscr: "\uD835\uDC9E",
        cscr: "\uD835\uDCB8",
        csub: "⫏",
        csube: "⫑",
        csup: "⫐",
        csupe: "⫒",
        ctdot: "⋯",
        cudarrl: "⤸",
        cudarrr: "⤵",
        cuepr: "⋞",
        cuesc: "⋟",
        cularr: "↶",
        cularrp: "⤽",
        Cup: "⋓",
        cup: "∪",
        cupbrcap: "⩈",
        CupCap: "≍",
        cupcap: "⩆",
        cupcup: "⩊",
        cupdot: "⊍",
        cupor: "⩅",
        cups: "∪︀",
        curarr: "↷",
        curarrm: "⤼",
        curlyeqprec: "⋞",
        curlyeqsucc: "⋟",
        curlyvee: "⋎",
        curlywedge: "⋏",
        curren: "¤",
        curvearrowleft: "↶",
        curvearrowright: "↷",
        cuvee: "⋎",
        cuwed: "⋏",
        cwconint: "∲",
        cwint: "∱",
        cylcty: "⌭",
        Dagger: "‡",
        dagger: "†",
        daleth: "ℸ",
        Darr: "↡",
        dArr: "⇓",
        darr: "↓",
        dash: "‐",
        Dashv: "⫤",
        dashv: "⊣",
        dbkarow: "⤏",
        dblac: "˝",
        Dcaron: "Ď",
        dcaron: "ď",
        Dcy: "Д",
        dcy: "д",
        DD: "ⅅ",
        dd: "ⅆ",
        ddagger: "‡",
        ddarr: "⇊",
        DDotrahd: "⤑",
        ddotseq: "⩷",
        deg: "°",
        Del: "∇",
        Delta: "Δ",
        delta: "δ",
        demptyv: "⦱",
        dfisht: "⥿",
        Dfr: "\uD835\uDD07",
        dfr: "\uD835\uDD21",
        dHar: "⥥",
        dharl: "⇃",
        dharr: "⇂",
        DiacriticalAcute: "´",
        DiacriticalDot: "˙",
        DiacriticalDoubleAcute: "˝",
        DiacriticalGrave: "`",
        DiacriticalTilde: "˜",
        diam: "⋄",
        Diamond: "⋄",
        diamond: "⋄",
        diamondsuit: "♦",
        diams: "♦",
        die: "¨",
        DifferentialD: "ⅆ",
        digamma: "ϝ",
        disin: "⋲",
        div: "÷",
        divide: "÷",
        divideontimes: "⋇",
        divonx: "⋇",
        DJcy: "Ђ",
        djcy: "ђ",
        dlcorn: "⌞",
        dlcrop: "⌍",
        dollar: "$",
        Dopf: "\uD835\uDD3B",
        dopf: "\uD835\uDD55",
        Dot: "¨",
        dot: "˙",
        DotDot: "⃜",
        doteq: "≐",
        doteqdot: "≑",
        DotEqual: "≐",
        dotminus: "∸",
        dotplus: "∔",
        dotsquare: "⊡",
        doublebarwedge: "⌆",
        DoubleContourIntegral: "∯",
        DoubleDot: "¨",
        DoubleDownArrow: "⇓",
        DoubleLeftArrow: "⇐",
        DoubleLeftRightArrow: "⇔",
        DoubleLeftTee: "⫤",
        DoubleLongLeftArrow: "⟸",
        DoubleLongLeftRightArrow: "⟺",
        DoubleLongRightArrow: "⟹",
        DoubleRightArrow: "⇒",
        DoubleRightTee: "⊨",
        DoubleUpArrow: "⇑",
        DoubleUpDownArrow: "⇕",
        DoubleVerticalBar: "∥",
        DownArrow: "↓",
        Downarrow: "⇓",
        downarrow: "↓",
        DownArrowBar: "⤓",
        DownArrowUpArrow: "⇵",
        DownBreve: "̑",
        downdownarrows: "⇊",
        downharpoonleft: "⇃",
        downharpoonright: "⇂",
        DownLeftRightVector: "⥐",
        DownLeftTeeVector: "⥞",
        DownLeftVector: "↽",
        DownLeftVectorBar: "⥖",
        DownRightTeeVector: "⥟",
        DownRightVector: "⇁",
        DownRightVectorBar: "⥗",
        DownTee: "⊤",
        DownTeeArrow: "↧",
        drbkarow: "⤐",
        drcorn: "⌟",
        drcrop: "⌌",
        Dscr: "\uD835\uDC9F",
        dscr: "\uD835\uDCB9",
        DScy: "Ѕ",
        dscy: "ѕ",
        dsol: "⧶",
        Dstrok: "Đ",
        dstrok: "đ",
        dtdot: "⋱",
        dtri: "▿",
        dtrif: "▾",
        duarr: "⇵",
        duhar: "⥯",
        dwangle: "⦦",
        DZcy: "Џ",
        dzcy: "џ",
        dzigrarr: "⟿",
        Eacute: "É",
        eacute: "é",
        easter: "⩮",
        Ecaron: "Ě",
        ecaron: "ě",
        ecir: "≖",
        Ecirc: "Ê",
        ecirc: "ê",
        ecolon: "≕",
        Ecy: "Э",
        ecy: "э",
        eDDot: "⩷",
        Edot: "Ė",
        eDot: "≑",
        edot: "ė",
        ee: "ⅇ",
        efDot: "≒",
        Efr: "\uD835\uDD08",
        efr: "\uD835\uDD22",
        eg: "⪚",
        Egrave: "È",
        egrave: "è",
        egs: "⪖",
        egsdot: "⪘",
        el: "⪙",
        Element: "∈",
        elinters: "⏧",
        ell: "ℓ",
        els: "⪕",
        elsdot: "⪗",
        Emacr: "Ē",
        emacr: "ē",
        empty: "∅",
        emptyset: "∅",
        EmptySmallSquare: "◻",
        emptyv: "∅",
        EmptyVerySmallSquare: "▫",
        emsp: " ",
        emsp13: " ",
        emsp14: " ",
        ENG: "Ŋ",
        eng: "ŋ",
        ensp: " ",
        Eogon: "Ę",
        eogon: "ę",
        Eopf: "\uD835\uDD3C",
        eopf: "\uD835\uDD56",
        epar: "⋕",
        eparsl: "⧣",
        eplus: "⩱",
        epsi: "ε",
        Epsilon: "Ε",
        epsilon: "ε",
        epsiv: "ϵ",
        eqcirc: "≖",
        eqcolon: "≕",
        eqsim: "≂",
        eqslantgtr: "⪖",
        eqslantless: "⪕",
        Equal: "⩵",
        equals: "=",
        EqualTilde: "≂",
        equest: "≟",
        Equilibrium: "⇌",
        equiv: "≡",
        equivDD: "⩸",
        eqvparsl: "⧥",
        erarr: "⥱",
        erDot: "≓",
        Escr: "ℰ",
        escr: "ℯ",
        esdot: "≐",
        Esim: "⩳",
        esim: "≂",
        Eta: "Η",
        eta: "η",
        ETH: "Ð",
        eth: "ð",
        Euml: "Ë",
        euml: "ë",
        euro: "€",
        excl: "!",
        exist: "∃",
        Exists: "∃",
        expectation: "ℰ",
        ExponentialE: "ⅇ",
        exponentiale: "ⅇ",
        fallingdotseq: "≒",
        Fcy: "Ф",
        fcy: "ф",
        female: "♀",
        ffilig: "ﬃ",
        fflig: "ﬀ",
        ffllig: "ﬄ",
        Ffr: "\uD835\uDD09",
        ffr: "\uD835\uDD23",
        filig: "ﬁ",
        FilledSmallSquare: "◼",
        FilledVerySmallSquare: "▪",
        fjlig: "fj",
        flat: "♭",
        fllig: "ﬂ",
        fltns: "▱",
        fnof: "ƒ",
        Fopf: "\uD835\uDD3D",
        fopf: "\uD835\uDD57",
        ForAll: "∀",
        forall: "∀",
        fork: "⋔",
        forkv: "⫙",
        Fouriertrf: "ℱ",
        fpartint: "⨍",
        frac12: "½",
        frac13: "⅓",
        frac14: "¼",
        frac15: "⅕",
        frac16: "⅙",
        frac18: "⅛",
        frac23: "⅔",
        frac25: "⅖",
        frac34: "¾",
        frac35: "⅗",
        frac38: "⅜",
        frac45: "⅘",
        frac56: "⅚",
        frac58: "⅝",
        frac78: "⅞",
        frasl: "⁄",
        frown: "⌢",
        Fscr: "ℱ",
        fscr: "\uD835\uDCBB",
        gacute: "ǵ",
        Gamma: "Γ",
        gamma: "γ",
        Gammad: "Ϝ",
        gammad: "ϝ",
        gap: "⪆",
        Gbreve: "Ğ",
        gbreve: "ğ",
        Gcedil: "Ģ",
        Gcirc: "Ĝ",
        gcirc: "ĝ",
        Gcy: "Г",
        gcy: "г",
        Gdot: "Ġ",
        gdot: "ġ",
        gE: "≧",
        ge: "≥",
        gEl: "⪌",
        gel: "⋛",
        geq: "≥",
        geqq: "≧",
        geqslant: "⩾",
        ges: "⩾",
        gescc: "⪩",
        gesdot: "⪀",
        gesdoto: "⪂",
        gesdotol: "⪄",
        gesl: "⋛︀",
        gesles: "⪔",
        Gfr: "\uD835\uDD0A",
        gfr: "\uD835\uDD24",
        Gg: "⋙",
        gg: "≫",
        ggg: "⋙",
        gimel: "ℷ",
        GJcy: "Ѓ",
        gjcy: "ѓ",
        gl: "≷",
        gla: "⪥",
        glE: "⪒",
        glj: "⪤",
        gnap: "⪊",
        gnapprox: "⪊",
        gnE: "≩",
        gne: "⪈",
        gneq: "⪈",
        gneqq: "≩",
        gnsim: "⋧",
        Gopf: "\uD835\uDD3E",
        gopf: "\uD835\uDD58",
        grave: "`",
        GreaterEqual: "≥",
        GreaterEqualLess: "⋛",
        GreaterFullEqual: "≧",
        GreaterGreater: "⪢",
        GreaterLess: "≷",
        GreaterSlantEqual: "⩾",
        GreaterTilde: "≳",
        Gscr: "\uD835\uDCA2",
        gscr: "ℊ",
        gsim: "≳",
        gsime: "⪎",
        gsiml: "⪐",
        Gt: "≫",
        GT: ">",
        gt: ">",
        gtcc: "⪧",
        gtcir: "⩺",
        gtdot: "⋗",
        gtlPar: "⦕",
        gtquest: "⩼",
        gtrapprox: "⪆",
        gtrarr: "⥸",
        gtrdot: "⋗",
        gtreqless: "⋛",
        gtreqqless: "⪌",
        gtrless: "≷",
        gtrsim: "≳",
        gvertneqq: "≩︀",
        gvnE: "≩︀",
        Hacek: "ˇ",
        hairsp: " ",
        half: "½",
        hamilt: "ℋ",
        HARDcy: "Ъ",
        hardcy: "ъ",
        hArr: "⇔",
        harr: "↔",
        harrcir: "⥈",
        harrw: "↭",
        Hat: "^",
        hbar: "ℏ",
        Hcirc: "Ĥ",
        hcirc: "ĥ",
        hearts: "♥",
        heartsuit: "♥",
        hellip: "…",
        hercon: "⊹",
        Hfr: "ℌ",
        hfr: "\uD835\uDD25",
        HilbertSpace: "ℋ",
        hksearow: "⤥",
        hkswarow: "⤦",
        hoarr: "⇿",
        homtht: "∻",
        hookleftarrow: "↩",
        hookrightarrow: "↪",
        Hopf: "ℍ",
        hopf: "\uD835\uDD59",
        horbar: "―",
        HorizontalLine: "─",
        Hscr: "ℋ",
        hscr: "\uD835\uDCBD",
        hslash: "ℏ",
        Hstrok: "Ħ",
        hstrok: "ħ",
        HumpDownHump: "≎",
        HumpEqual: "≏",
        hybull: "⁃",
        hyphen: "‐",
        Iacute: "Í",
        iacute: "í",
        ic: "⁣",
        Icirc: "Î",
        icirc: "î",
        Icy: "И",
        icy: "и",
        Idot: "İ",
        IEcy: "Е",
        iecy: "е",
        iexcl: "¡",
        iff: "⇔",
        Ifr: "ℑ",
        ifr: "\uD835\uDD26",
        Igrave: "Ì",
        igrave: "ì",
        ii: "ⅈ",
        iiiint: "⨌",
        iiint: "∭",
        iinfin: "⧜",
        iiota: "℩",
        IJlig: "Ĳ",
        ijlig: "ĳ",
        Im: "ℑ",
        Imacr: "Ī",
        imacr: "ī",
        image: "ℑ",
        ImaginaryI: "ⅈ",
        imagline: "ℐ",
        imagpart: "ℑ",
        imath: "ı",
        imof: "⊷",
        imped: "Ƶ",
        Implies: "⇒",
        in: "∈",
        incare: "℅",
        infin: "∞",
        infintie: "⧝",
        inodot: "ı",
        Int: "∬",
        int: "∫",
        intcal: "⊺",
        integers: "ℤ",
        Integral: "∫",
        intercal: "⊺",
        Intersection: "⋂",
        intlarhk: "⨗",
        intprod: "⨼",
        InvisibleComma: "⁣",
        InvisibleTimes: "⁢",
        IOcy: "Ё",
        iocy: "ё",
        Iogon: "Į",
        iogon: "į",
        Iopf: "\uD835\uDD40",
        iopf: "\uD835\uDD5A",
        Iota: "Ι",
        iota: "ι",
        iprod: "⨼",
        iquest: "¿",
        Iscr: "ℐ",
        iscr: "\uD835\uDCBE",
        isin: "∈",
        isindot: "⋵",
        isinE: "⋹",
        isins: "⋴",
        isinsv: "⋳",
        isinv: "∈",
        it: "⁢",
        Itilde: "Ĩ",
        itilde: "ĩ",
        Iukcy: "І",
        iukcy: "і",
        Iuml: "Ï",
        iuml: "ï",
        Jcirc: "Ĵ",
        jcirc: "ĵ",
        Jcy: "Й",
        jcy: "й",
        Jfr: "\uD835\uDD0D",
        jfr: "\uD835\uDD27",
        jmath: "ȷ",
        Jopf: "\uD835\uDD41",
        jopf: "\uD835\uDD5B",
        Jscr: "\uD835\uDCA5",
        jscr: "\uD835\uDCBF",
        Jsercy: "Ј",
        jsercy: "ј",
        Jukcy: "Є",
        jukcy: "є",
        Kappa: "Κ",
        kappa: "κ",
        kappav: "ϰ",
        Kcedil: "Ķ",
        kcedil: "ķ",
        Kcy: "К",
        kcy: "к",
        Kfr: "\uD835\uDD0E",
        kfr: "\uD835\uDD28",
        kgreen: "ĸ",
        KHcy: "Х",
        khcy: "х",
        KJcy: "Ќ",
        kjcy: "ќ",
        Kopf: "\uD835\uDD42",
        kopf: "\uD835\uDD5C",
        Kscr: "\uD835\uDCA6",
        kscr: "\uD835\uDCC0",
        lAarr: "⇚",
        Lacute: "Ĺ",
        lacute: "ĺ",
        laemptyv: "⦴",
        lagran: "ℒ",
        Lambda: "Λ",
        lambda: "λ",
        Lang: "⟪",
        lang: "⟨",
        langd: "⦑",
        langle: "⟨",
        lap: "⪅",
        Laplacetrf: "ℒ",
        laquo: "«",
        Larr: "↞",
        lArr: "⇐",
        larr: "←",
        larrb: "⇤",
        larrbfs: "⤟",
        larrfs: "⤝",
        larrhk: "↩",
        larrlp: "↫",
        larrpl: "⤹",
        larrsim: "⥳",
        larrtl: "↢",
        lat: "⪫",
        lAtail: "⤛",
        latail: "⤙",
        late: "⪭",
        lates: "⪭︀",
        lBarr: "⤎",
        lbarr: "⤌",
        lbbrk: "❲",
        lbrace: "{",
        lbrack: "[",
        lbrke: "⦋",
        lbrksld: "⦏",
        lbrkslu: "⦍",
        Lcaron: "Ľ",
        lcaron: "ľ",
        Lcedil: "Ļ",
        lcedil: "ļ",
        lceil: "⌈",
        lcub: "{",
        Lcy: "Л",
        lcy: "л",
        ldca: "⤶",
        ldquo: "“",
        ldquor: "„",
        ldrdhar: "⥧",
        ldrushar: "⥋",
        ldsh: "↲",
        lE: "≦",
        le: "≤",
        LeftAngleBracket: "⟨",
        LeftArrow: "←",
        Leftarrow: "⇐",
        leftarrow: "←",
        LeftArrowBar: "⇤",
        LeftArrowRightArrow: "⇆",
        leftarrowtail: "↢",
        LeftCeiling: "⌈",
        LeftDoubleBracket: "⟦",
        LeftDownTeeVector: "⥡",
        LeftDownVector: "⇃",
        LeftDownVectorBar: "⥙",
        LeftFloor: "⌊",
        leftharpoondown: "↽",
        leftharpoonup: "↼",
        leftleftarrows: "⇇",
        LeftRightArrow: "↔",
        Leftrightarrow: "⇔",
        leftrightarrow: "↔",
        leftrightarrows: "⇆",
        leftrightharpoons: "⇋",
        leftrightsquigarrow: "↭",
        LeftRightVector: "⥎",
        LeftTee: "⊣",
        LeftTeeArrow: "↤",
        LeftTeeVector: "⥚",
        leftthreetimes: "⋋",
        LeftTriangle: "⊲",
        LeftTriangleBar: "⧏",
        LeftTriangleEqual: "⊴",
        LeftUpDownVector: "⥑",
        LeftUpTeeVector: "⥠",
        LeftUpVector: "↿",
        LeftUpVectorBar: "⥘",
        LeftVector: "↼",
        LeftVectorBar: "⥒",
        lEg: "⪋",
        leg: "⋚",
        leq: "≤",
        leqq: "≦",
        leqslant: "⩽",
        les: "⩽",
        lescc: "⪨",
        lesdot: "⩿",
        lesdoto: "⪁",
        lesdotor: "⪃",
        lesg: "⋚︀",
        lesges: "⪓",
        lessapprox: "⪅",
        lessdot: "⋖",
        lesseqgtr: "⋚",
        lesseqqgtr: "⪋",
        LessEqualGreater: "⋚",
        LessFullEqual: "≦",
        LessGreater: "≶",
        lessgtr: "≶",
        LessLess: "⪡",
        lesssim: "≲",
        LessSlantEqual: "⩽",
        LessTilde: "≲",
        lfisht: "⥼",
        lfloor: "⌊",
        Lfr: "\uD835\uDD0F",
        lfr: "\uD835\uDD29",
        lg: "≶",
        lgE: "⪑",
        lHar: "⥢",
        lhard: "↽",
        lharu: "↼",
        lharul: "⥪",
        lhblk: "▄",
        LJcy: "Љ",
        ljcy: "љ",
        Ll: "⋘",
        ll: "≪",
        llarr: "⇇",
        llcorner: "⌞",
        Lleftarrow: "⇚",
        llhard: "⥫",
        lltri: "◺",
        Lmidot: "Ŀ",
        lmidot: "ŀ",
        lmoust: "⎰",
        lmoustache: "⎰",
        lnap: "⪉",
        lnapprox: "⪉",
        lnE: "≨",
        lne: "⪇",
        lneq: "⪇",
        lneqq: "≨",
        lnsim: "⋦",
        loang: "⟬",
        loarr: "⇽",
        lobrk: "⟦",
        LongLeftArrow: "⟵",
        Longleftarrow: "⟸",
        longleftarrow: "⟵",
        LongLeftRightArrow: "⟷",
        Longleftrightarrow: "⟺",
        longleftrightarrow: "⟷",
        longmapsto: "⟼",
        LongRightArrow: "⟶",
        Longrightarrow: "⟹",
        longrightarrow: "⟶",
        looparrowleft: "↫",
        looparrowright: "↬",
        lopar: "⦅",
        Lopf: "\uD835\uDD43",
        lopf: "\uD835\uDD5D",
        loplus: "⨭",
        lotimes: "⨴",
        lowast: "∗",
        lowbar: "_",
        LowerLeftArrow: "↙",
        LowerRightArrow: "↘",
        loz: "◊",
        lozenge: "◊",
        lozf: "⧫",
        lpar: "(",
        lparlt: "⦓",
        lrarr: "⇆",
        lrcorner: "⌟",
        lrhar: "⇋",
        lrhard: "⥭",
        lrm: "‎",
        lrtri: "⊿",
        lsaquo: "‹",
        Lscr: "ℒ",
        lscr: "\uD835\uDCC1",
        Lsh: "↰",
        lsh: "↰",
        lsim: "≲",
        lsime: "⪍",
        lsimg: "⪏",
        lsqb: "[",
        lsquo: "‘",
        lsquor: "‚",
        Lstrok: "Ł",
        lstrok: "ł",
        Lt: "≪",
        LT: "<",
        lt: "<",
        ltcc: "⪦",
        ltcir: "⩹",
        ltdot: "⋖",
        lthree: "⋋",
        ltimes: "⋉",
        ltlarr: "⥶",
        ltquest: "⩻",
        ltri: "◃",
        ltrie: "⊴",
        ltrif: "◂",
        ltrPar: "⦖",
        lurdshar: "⥊",
        luruhar: "⥦",
        lvertneqq: "≨︀",
        lvnE: "≨︀",
        macr: "¯",
        male: "♂",
        malt: "✠",
        maltese: "✠",
        Map: "⤅",
        map: "↦",
        mapsto: "↦",
        mapstodown: "↧",
        mapstoleft: "↤",
        mapstoup: "↥",
        marker: "▮",
        mcomma: "⨩",
        Mcy: "М",
        mcy: "м",
        mdash: "—",
        mDDot: "∺",
        measuredangle: "∡",
        MediumSpace: " ",
        Mellintrf: "ℳ",
        Mfr: "\uD835\uDD10",
        mfr: "\uD835\uDD2A",
        mho: "℧",
        micro: "µ",
        mid: "∣",
        midast: "*",
        midcir: "⫰",
        middot: "·",
        minus: "−",
        minusb: "⊟",
        minusd: "∸",
        minusdu: "⨪",
        MinusPlus: "∓",
        mlcp: "⫛",
        mldr: "…",
        mnplus: "∓",
        models: "⊧",
        Mopf: "\uD835\uDD44",
        mopf: "\uD835\uDD5E",
        mp: "∓",
        Mscr: "ℳ",
        mscr: "\uD835\uDCC2",
        mstpos: "∾",
        Mu: "Μ",
        mu: "μ",
        multimap: "⊸",
        mumap: "⊸",
        nabla: "∇",
        Nacute: "Ń",
        nacute: "ń",
        nang: "∠⃒",
        nap: "≉",
        napE: "⩰̸",
        napid: "≋̸",
        napos: "ŉ",
        napprox: "≉",
        natur: "♮",
        natural: "♮",
        naturals: "ℕ",
        nbsp: " ",
        nbump: "≎̸",
        nbumpe: "≏̸",
        ncap: "⩃",
        Ncaron: "Ň",
        ncaron: "ň",
        Ncedil: "Ņ",
        ncedil: "ņ",
        ncong: "≇",
        ncongdot: "⩭̸",
        ncup: "⩂",
        Ncy: "Н",
        ncy: "н",
        ndash: "–",
        ne: "≠",
        nearhk: "⤤",
        neArr: "⇗",
        nearr: "↗",
        nearrow: "↗",
        nedot: "≐̸",
        NegativeMediumSpace: "​",
        NegativeThickSpace: "​",
        NegativeThinSpace: "​",
        NegativeVeryThinSpace: "​",
        nequiv: "≢",
        nesear: "⤨",
        nesim: "≂̸",
        NestedGreaterGreater: "≫",
        NestedLessLess: "≪",
        NewLine: `
`,
        nexist: "∄",
        nexists: "∄",
        Nfr: "\uD835\uDD11",
        nfr: "\uD835\uDD2B",
        ngE: "≧̸",
        nge: "≱",
        ngeq: "≱",
        ngeqq: "≧̸",
        ngeqslant: "⩾̸",
        nges: "⩾̸",
        nGg: "⋙̸",
        ngsim: "≵",
        nGt: "≫⃒",
        ngt: "≯",
        ngtr: "≯",
        nGtv: "≫̸",
        nhArr: "⇎",
        nharr: "↮",
        nhpar: "⫲",
        ni: "∋",
        nis: "⋼",
        nisd: "⋺",
        niv: "∋",
        NJcy: "Њ",
        njcy: "њ",
        nlArr: "⇍",
        nlarr: "↚",
        nldr: "‥",
        nlE: "≦̸",
        nle: "≰",
        nLeftarrow: "⇍",
        nleftarrow: "↚",
        nLeftrightarrow: "⇎",
        nleftrightarrow: "↮",
        nleq: "≰",
        nleqq: "≦̸",
        nleqslant: "⩽̸",
        nles: "⩽̸",
        nless: "≮",
        nLl: "⋘̸",
        nlsim: "≴",
        nLt: "≪⃒",
        nlt: "≮",
        nltri: "⋪",
        nltrie: "⋬",
        nLtv: "≪̸",
        nmid: "∤",
        NoBreak: "⁠",
        NonBreakingSpace: " ",
        Nopf: "ℕ",
        nopf: "\uD835\uDD5F",
        Not: "⫬",
        not: "¬",
        NotCongruent: "≢",
        NotCupCap: "≭",
        NotDoubleVerticalBar: "∦",
        NotElement: "∉",
        NotEqual: "≠",
        NotEqualTilde: "≂̸",
        NotExists: "∄",
        NotGreater: "≯",
        NotGreaterEqual: "≱",
        NotGreaterFullEqual: "≧̸",
        NotGreaterGreater: "≫̸",
        NotGreaterLess: "≹",
        NotGreaterSlantEqual: "⩾̸",
        NotGreaterTilde: "≵",
        NotHumpDownHump: "≎̸",
        NotHumpEqual: "≏̸",
        notin: "∉",
        notindot: "⋵̸",
        notinE: "⋹̸",
        notinva: "∉",
        notinvb: "⋷",
        notinvc: "⋶",
        NotLeftTriangle: "⋪",
        NotLeftTriangleBar: "⧏̸",
        NotLeftTriangleEqual: "⋬",
        NotLess: "≮",
        NotLessEqual: "≰",
        NotLessGreater: "≸",
        NotLessLess: "≪̸",
        NotLessSlantEqual: "⩽̸",
        NotLessTilde: "≴",
        NotNestedGreaterGreater: "⪢̸",
        NotNestedLessLess: "⪡̸",
        notni: "∌",
        notniva: "∌",
        notnivb: "⋾",
        notnivc: "⋽",
        NotPrecedes: "⊀",
        NotPrecedesEqual: "⪯̸",
        NotPrecedesSlantEqual: "⋠",
        NotReverseElement: "∌",
        NotRightTriangle: "⋫",
        NotRightTriangleBar: "⧐̸",
        NotRightTriangleEqual: "⋭",
        NotSquareSubset: "⊏̸",
        NotSquareSubsetEqual: "⋢",
        NotSquareSuperset: "⊐̸",
        NotSquareSupersetEqual: "⋣",
        NotSubset: "⊂⃒",
        NotSubsetEqual: "⊈",
        NotSucceeds: "⊁",
        NotSucceedsEqual: "⪰̸",
        NotSucceedsSlantEqual: "⋡",
        NotSucceedsTilde: "≿̸",
        NotSuperset: "⊃⃒",
        NotSupersetEqual: "⊉",
        NotTilde: "≁",
        NotTildeEqual: "≄",
        NotTildeFullEqual: "≇",
        NotTildeTilde: "≉",
        NotVerticalBar: "∤",
        npar: "∦",
        nparallel: "∦",
        nparsl: "⫽⃥",
        npart: "∂̸",
        npolint: "⨔",
        npr: "⊀",
        nprcue: "⋠",
        npre: "⪯̸",
        nprec: "⊀",
        npreceq: "⪯̸",
        nrArr: "⇏",
        nrarr: "↛",
        nrarrc: "⤳̸",
        nrarrw: "↝̸",
        nRightarrow: "⇏",
        nrightarrow: "↛",
        nrtri: "⋫",
        nrtrie: "⋭",
        nsc: "⊁",
        nsccue: "⋡",
        nsce: "⪰̸",
        Nscr: "\uD835\uDCA9",
        nscr: "\uD835\uDCC3",
        nshortmid: "∤",
        nshortparallel: "∦",
        nsim: "≁",
        nsime: "≄",
        nsimeq: "≄",
        nsmid: "∤",
        nspar: "∦",
        nsqsube: "⋢",
        nsqsupe: "⋣",
        nsub: "⊄",
        nsubE: "⫅̸",
        nsube: "⊈",
        nsubset: "⊂⃒",
        nsubseteq: "⊈",
        nsubseteqq: "⫅̸",
        nsucc: "⊁",
        nsucceq: "⪰̸",
        nsup: "⊅",
        nsupE: "⫆̸",
        nsupe: "⊉",
        nsupset: "⊃⃒",
        nsupseteq: "⊉",
        nsupseteqq: "⫆̸",
        ntgl: "≹",
        Ntilde: "Ñ",
        ntilde: "ñ",
        ntlg: "≸",
        ntriangleleft: "⋪",
        ntrianglelefteq: "⋬",
        ntriangleright: "⋫",
        ntrianglerighteq: "⋭",
        Nu: "Ν",
        nu: "ν",
        num: "#",
        numero: "№",
        numsp: " ",
        nvap: "≍⃒",
        nVDash: "⊯",
        nVdash: "⊮",
        nvDash: "⊭",
        nvdash: "⊬",
        nvge: "≥⃒",
        nvgt: ">⃒",
        nvHarr: "⤄",
        nvinfin: "⧞",
        nvlArr: "⤂",
        nvle: "≤⃒",
        nvlt: "<⃒",
        nvltrie: "⊴⃒",
        nvrArr: "⤃",
        nvrtrie: "⊵⃒",
        nvsim: "∼⃒",
        nwarhk: "⤣",
        nwArr: "⇖",
        nwarr: "↖",
        nwarrow: "↖",
        nwnear: "⤧",
        Oacute: "Ó",
        oacute: "ó",
        oast: "⊛",
        ocir: "⊚",
        Ocirc: "Ô",
        ocirc: "ô",
        Ocy: "О",
        ocy: "о",
        odash: "⊝",
        Odblac: "Ő",
        odblac: "ő",
        odiv: "⨸",
        odot: "⊙",
        odsold: "⦼",
        OElig: "Œ",
        oelig: "œ",
        ofcir: "⦿",
        Ofr: "\uD835\uDD12",
        ofr: "\uD835\uDD2C",
        ogon: "˛",
        Ograve: "Ò",
        ograve: "ò",
        ogt: "⧁",
        ohbar: "⦵",
        ohm: "Ω",
        oint: "∮",
        olarr: "↺",
        olcir: "⦾",
        olcross: "⦻",
        oline: "‾",
        olt: "⧀",
        Omacr: "Ō",
        omacr: "ō",
        Omega: "Ω",
        omega: "ω",
        Omicron: "Ο",
        omicron: "ο",
        omid: "⦶",
        ominus: "⊖",
        Oopf: "\uD835\uDD46",
        oopf: "\uD835\uDD60",
        opar: "⦷",
        OpenCurlyDoubleQuote: "“",
        OpenCurlyQuote: "‘",
        operp: "⦹",
        oplus: "⊕",
        Or: "⩔",
        or: "∨",
        orarr: "↻",
        ord: "⩝",
        order: "ℴ",
        orderof: "ℴ",
        ordf: "ª",
        ordm: "º",
        origof: "⊶",
        oror: "⩖",
        orslope: "⩗",
        orv: "⩛",
        oS: "Ⓢ",
        Oscr: "\uD835\uDCAA",
        oscr: "ℴ",
        Oslash: "Ø",
        oslash: "ø",
        osol: "⊘",
        Otilde: "Õ",
        otilde: "õ",
        Otimes: "⨷",
        otimes: "⊗",
        otimesas: "⨶",
        Ouml: "Ö",
        ouml: "ö",
        ovbar: "⌽",
        OverBar: "‾",
        OverBrace: "⏞",
        OverBracket: "⎴",
        OverParenthesis: "⏜",
        par: "∥",
        para: "¶",
        parallel: "∥",
        parsim: "⫳",
        parsl: "⫽",
        part: "∂",
        PartialD: "∂",
        Pcy: "П",
        pcy: "п",
        percnt: "%",
        period: ".",
        permil: "‰",
        perp: "⊥",
        pertenk: "‱",
        Pfr: "\uD835\uDD13",
        pfr: "\uD835\uDD2D",
        Phi: "Φ",
        phi: "φ",
        phiv: "ϕ",
        phmmat: "ℳ",
        phone: "☎",
        Pi: "Π",
        pi: "π",
        pitchfork: "⋔",
        piv: "ϖ",
        planck: "ℏ",
        planckh: "ℎ",
        plankv: "ℏ",
        plus: "+",
        plusacir: "⨣",
        plusb: "⊞",
        pluscir: "⨢",
        plusdo: "∔",
        plusdu: "⨥",
        pluse: "⩲",
        PlusMinus: "±",
        plusmn: "±",
        plussim: "⨦",
        plustwo: "⨧",
        pm: "±",
        Poincareplane: "ℌ",
        pointint: "⨕",
        Popf: "ℙ",
        popf: "\uD835\uDD61",
        pound: "£",
        Pr: "⪻",
        pr: "≺",
        prap: "⪷",
        prcue: "≼",
        prE: "⪳",
        pre: "⪯",
        prec: "≺",
        precapprox: "⪷",
        preccurlyeq: "≼",
        Precedes: "≺",
        PrecedesEqual: "⪯",
        PrecedesSlantEqual: "≼",
        PrecedesTilde: "≾",
        preceq: "⪯",
        precnapprox: "⪹",
        precneqq: "⪵",
        precnsim: "⋨",
        precsim: "≾",
        Prime: "″",
        prime: "′",
        primes: "ℙ",
        prnap: "⪹",
        prnE: "⪵",
        prnsim: "⋨",
        prod: "∏",
        Product: "∏",
        profalar: "⌮",
        profline: "⌒",
        profsurf: "⌓",
        prop: "∝",
        Proportion: "∷",
        Proportional: "∝",
        propto: "∝",
        prsim: "≾",
        prurel: "⊰",
        Pscr: "\uD835\uDCAB",
        pscr: "\uD835\uDCC5",
        Psi: "Ψ",
        psi: "ψ",
        puncsp: " ",
        Qfr: "\uD835\uDD14",
        qfr: "\uD835\uDD2E",
        qint: "⨌",
        Qopf: "ℚ",
        qopf: "\uD835\uDD62",
        qprime: "⁗",
        Qscr: "\uD835\uDCAC",
        qscr: "\uD835\uDCC6",
        quaternions: "ℍ",
        quatint: "⨖",
        quest: "?",
        questeq: "≟",
        QUOT: '"',
        quot: '"',
        rAarr: "⇛",
        race: "∽̱",
        Racute: "Ŕ",
        racute: "ŕ",
        radic: "√",
        raemptyv: "⦳",
        Rang: "⟫",
        rang: "⟩",
        rangd: "⦒",
        range: "⦥",
        rangle: "⟩",
        raquo: "»",
        Rarr: "↠",
        rArr: "⇒",
        rarr: "→",
        rarrap: "⥵",
        rarrb: "⇥",
        rarrbfs: "⤠",
        rarrc: "⤳",
        rarrfs: "⤞",
        rarrhk: "↪",
        rarrlp: "↬",
        rarrpl: "⥅",
        rarrsim: "⥴",
        Rarrtl: "⤖",
        rarrtl: "↣",
        rarrw: "↝",
        rAtail: "⤜",
        ratail: "⤚",
        ratio: "∶",
        rationals: "ℚ",
        RBarr: "⤐",
        rBarr: "⤏",
        rbarr: "⤍",
        rbbrk: "❳",
        rbrace: "}",
        rbrack: "]",
        rbrke: "⦌",
        rbrksld: "⦎",
        rbrkslu: "⦐",
        Rcaron: "Ř",
        rcaron: "ř",
        Rcedil: "Ŗ",
        rcedil: "ŗ",
        rceil: "⌉",
        rcub: "}",
        Rcy: "Р",
        rcy: "р",
        rdca: "⤷",
        rdldhar: "⥩",
        rdquo: "”",
        rdquor: "”",
        rdsh: "↳",
        Re: "ℜ",
        real: "ℜ",
        realine: "ℛ",
        realpart: "ℜ",
        reals: "ℝ",
        rect: "▭",
        REG: "®",
        reg: "®",
        ReverseElement: "∋",
        ReverseEquilibrium: "⇋",
        ReverseUpEquilibrium: "⥯",
        rfisht: "⥽",
        rfloor: "⌋",
        Rfr: "ℜ",
        rfr: "\uD835\uDD2F",
        rHar: "⥤",
        rhard: "⇁",
        rharu: "⇀",
        rharul: "⥬",
        Rho: "Ρ",
        rho: "ρ",
        rhov: "ϱ",
        RightAngleBracket: "⟩",
        RightArrow: "→",
        Rightarrow: "⇒",
        rightarrow: "→",
        RightArrowBar: "⇥",
        RightArrowLeftArrow: "⇄",
        rightarrowtail: "↣",
        RightCeiling: "⌉",
        RightDoubleBracket: "⟧",
        RightDownTeeVector: "⥝",
        RightDownVector: "⇂",
        RightDownVectorBar: "⥕",
        RightFloor: "⌋",
        rightharpoondown: "⇁",
        rightharpoonup: "⇀",
        rightleftarrows: "⇄",
        rightleftharpoons: "⇌",
        rightrightarrows: "⇉",
        rightsquigarrow: "↝",
        RightTee: "⊢",
        RightTeeArrow: "↦",
        RightTeeVector: "⥛",
        rightthreetimes: "⋌",
        RightTriangle: "⊳",
        RightTriangleBar: "⧐",
        RightTriangleEqual: "⊵",
        RightUpDownVector: "⥏",
        RightUpTeeVector: "⥜",
        RightUpVector: "↾",
        RightUpVectorBar: "⥔",
        RightVector: "⇀",
        RightVectorBar: "⥓",
        ring: "˚",
        risingdotseq: "≓",
        rlarr: "⇄",
        rlhar: "⇌",
        rlm: "‏",
        rmoust: "⎱",
        rmoustache: "⎱",
        rnmid: "⫮",
        roang: "⟭",
        roarr: "⇾",
        robrk: "⟧",
        ropar: "⦆",
        Ropf: "ℝ",
        ropf: "\uD835\uDD63",
        roplus: "⨮",
        rotimes: "⨵",
        RoundImplies: "⥰",
        rpar: ")",
        rpargt: "⦔",
        rppolint: "⨒",
        rrarr: "⇉",
        Rrightarrow: "⇛",
        rsaquo: "›",
        Rscr: "ℛ",
        rscr: "\uD835\uDCC7",
        Rsh: "↱",
        rsh: "↱",
        rsqb: "]",
        rsquo: "’",
        rsquor: "’",
        rthree: "⋌",
        rtimes: "⋊",
        rtri: "▹",
        rtrie: "⊵",
        rtrif: "▸",
        rtriltri: "⧎",
        RuleDelayed: "⧴",
        ruluhar: "⥨",
        rx: "℞",
        Sacute: "Ś",
        sacute: "ś",
        sbquo: "‚",
        Sc: "⪼",
        sc: "≻",
        scap: "⪸",
        Scaron: "Š",
        scaron: "š",
        sccue: "≽",
        scE: "⪴",
        sce: "⪰",
        Scedil: "Ş",
        scedil: "ş",
        Scirc: "Ŝ",
        scirc: "ŝ",
        scnap: "⪺",
        scnE: "⪶",
        scnsim: "⋩",
        scpolint: "⨓",
        scsim: "≿",
        Scy: "С",
        scy: "с",
        sdot: "⋅",
        sdotb: "⊡",
        sdote: "⩦",
        searhk: "⤥",
        seArr: "⇘",
        searr: "↘",
        searrow: "↘",
        sect: "§",
        semi: ";",
        seswar: "⤩",
        setminus: "∖",
        setmn: "∖",
        sext: "✶",
        Sfr: "\uD835\uDD16",
        sfr: "\uD835\uDD30",
        sfrown: "⌢",
        sharp: "♯",
        SHCHcy: "Щ",
        shchcy: "щ",
        SHcy: "Ш",
        shcy: "ш",
        ShortDownArrow: "↓",
        ShortLeftArrow: "←",
        shortmid: "∣",
        shortparallel: "∥",
        ShortRightArrow: "→",
        ShortUpArrow: "↑",
        shy: "­",
        Sigma: "Σ",
        sigma: "σ",
        sigmaf: "ς",
        sigmav: "ς",
        sim: "∼",
        simdot: "⩪",
        sime: "≃",
        simeq: "≃",
        simg: "⪞",
        simgE: "⪠",
        siml: "⪝",
        simlE: "⪟",
        simne: "≆",
        simplus: "⨤",
        simrarr: "⥲",
        slarr: "←",
        SmallCircle: "∘",
        smallsetminus: "∖",
        smashp: "⨳",
        smeparsl: "⧤",
        smid: "∣",
        smile: "⌣",
        smt: "⪪",
        smte: "⪬",
        smtes: "⪬︀",
        SOFTcy: "Ь",
        softcy: "ь",
        sol: "/",
        solb: "⧄",
        solbar: "⌿",
        Sopf: "\uD835\uDD4A",
        sopf: "\uD835\uDD64",
        spades: "♠",
        spadesuit: "♠",
        spar: "∥",
        sqcap: "⊓",
        sqcaps: "⊓︀",
        sqcup: "⊔",
        sqcups: "⊔︀",
        Sqrt: "√",
        sqsub: "⊏",
        sqsube: "⊑",
        sqsubset: "⊏",
        sqsubseteq: "⊑",
        sqsup: "⊐",
        sqsupe: "⊒",
        sqsupset: "⊐",
        sqsupseteq: "⊒",
        squ: "□",
        Square: "□",
        square: "□",
        SquareIntersection: "⊓",
        SquareSubset: "⊏",
        SquareSubsetEqual: "⊑",
        SquareSuperset: "⊐",
        SquareSupersetEqual: "⊒",
        SquareUnion: "⊔",
        squarf: "▪",
        squf: "▪",
        srarr: "→",
        Sscr: "\uD835\uDCAE",
        sscr: "\uD835\uDCC8",
        ssetmn: "∖",
        ssmile: "⌣",
        sstarf: "⋆",
        Star: "⋆",
        star: "☆",
        starf: "★",
        straightepsilon: "ϵ",
        straightphi: "ϕ",
        strns: "¯",
        Sub: "⋐",
        sub: "⊂",
        subdot: "⪽",
        subE: "⫅",
        sube: "⊆",
        subedot: "⫃",
        submult: "⫁",
        subnE: "⫋",
        subne: "⊊",
        subplus: "⪿",
        subrarr: "⥹",
        Subset: "⋐",
        subset: "⊂",
        subseteq: "⊆",
        subseteqq: "⫅",
        SubsetEqual: "⊆",
        subsetneq: "⊊",
        subsetneqq: "⫋",
        subsim: "⫇",
        subsub: "⫕",
        subsup: "⫓",
        succ: "≻",
        succapprox: "⪸",
        succcurlyeq: "≽",
        Succeeds: "≻",
        SucceedsEqual: "⪰",
        SucceedsSlantEqual: "≽",
        SucceedsTilde: "≿",
        succeq: "⪰",
        succnapprox: "⪺",
        succneqq: "⪶",
        succnsim: "⋩",
        succsim: "≿",
        SuchThat: "∋",
        Sum: "∑",
        sum: "∑",
        sung: "♪",
        Sup: "⋑",
        sup: "⊃",
        sup1: "¹",
        sup2: "²",
        sup3: "³",
        supdot: "⪾",
        supdsub: "⫘",
        supE: "⫆",
        supe: "⊇",
        supedot: "⫄",
        Superset: "⊃",
        SupersetEqual: "⊇",
        suphsol: "⟉",
        suphsub: "⫗",
        suplarr: "⥻",
        supmult: "⫂",
        supnE: "⫌",
        supne: "⊋",
        supplus: "⫀",
        Supset: "⋑",
        supset: "⊃",
        supseteq: "⊇",
        supseteqq: "⫆",
        supsetneq: "⊋",
        supsetneqq: "⫌",
        supsim: "⫈",
        supsub: "⫔",
        supsup: "⫖",
        swarhk: "⤦",
        swArr: "⇙",
        swarr: "↙",
        swarrow: "↙",
        swnwar: "⤪",
        szlig: "ß",
        Tab: "\t",
        target: "⌖",
        Tau: "Τ",
        tau: "τ",
        tbrk: "⎴",
        Tcaron: "Ť",
        tcaron: "ť",
        Tcedil: "Ţ",
        tcedil: "ţ",
        Tcy: "Т",
        tcy: "т",
        tdot: "⃛",
        telrec: "⌕",
        Tfr: "\uD835\uDD17",
        tfr: "\uD835\uDD31",
        there4: "∴",
        Therefore: "∴",
        therefore: "∴",
        Theta: "Θ",
        theta: "θ",
        thetasym: "ϑ",
        thetav: "ϑ",
        thickapprox: "≈",
        thicksim: "∼",
        ThickSpace: "  ",
        thinsp: " ",
        ThinSpace: " ",
        thkap: "≈",
        thksim: "∼",
        THORN: "Þ",
        thorn: "þ",
        Tilde: "∼",
        tilde: "˜",
        TildeEqual: "≃",
        TildeFullEqual: "≅",
        TildeTilde: "≈",
        times: "×",
        timesb: "⊠",
        timesbar: "⨱",
        timesd: "⨰",
        tint: "∭",
        toea: "⤨",
        top: "⊤",
        topbot: "⌶",
        topcir: "⫱",
        Topf: "\uD835\uDD4B",
        topf: "\uD835\uDD65",
        topfork: "⫚",
        tosa: "⤩",
        tprime: "‴",
        TRADE: "™",
        trade: "™",
        triangle: "▵",
        triangledown: "▿",
        triangleleft: "◃",
        trianglelefteq: "⊴",
        triangleq: "≜",
        triangleright: "▹",
        trianglerighteq: "⊵",
        tridot: "◬",
        trie: "≜",
        triminus: "⨺",
        TripleDot: "⃛",
        triplus: "⨹",
        trisb: "⧍",
        tritime: "⨻",
        trpezium: "⏢",
        Tscr: "\uD835\uDCAF",
        tscr: "\uD835\uDCC9",
        TScy: "Ц",
        tscy: "ц",
        TSHcy: "Ћ",
        tshcy: "ћ",
        Tstrok: "Ŧ",
        tstrok: "ŧ",
        twixt: "≬",
        twoheadleftarrow: "↞",
        twoheadrightarrow: "↠",
        Uacute: "Ú",
        uacute: "ú",
        Uarr: "↟",
        uArr: "⇑",
        uarr: "↑",
        Uarrocir: "⥉",
        Ubrcy: "Ў",
        ubrcy: "ў",
        Ubreve: "Ŭ",
        ubreve: "ŭ",
        Ucirc: "Û",
        ucirc: "û",
        Ucy: "У",
        ucy: "у",
        udarr: "⇅",
        Udblac: "Ű",
        udblac: "ű",
        udhar: "⥮",
        ufisht: "⥾",
        Ufr: "\uD835\uDD18",
        ufr: "\uD835\uDD32",
        Ugrave: "Ù",
        ugrave: "ù",
        uHar: "⥣",
        uharl: "↿",
        uharr: "↾",
        uhblk: "▀",
        ulcorn: "⌜",
        ulcorner: "⌜",
        ulcrop: "⌏",
        ultri: "◸",
        Umacr: "Ū",
        umacr: "ū",
        uml: "¨",
        UnderBar: "_",
        UnderBrace: "⏟",
        UnderBracket: "⎵",
        UnderParenthesis: "⏝",
        Union: "⋃",
        UnionPlus: "⊎",
        Uogon: "Ų",
        uogon: "ų",
        Uopf: "\uD835\uDD4C",
        uopf: "\uD835\uDD66",
        UpArrow: "↑",
        Uparrow: "⇑",
        uparrow: "↑",
        UpArrowBar: "⤒",
        UpArrowDownArrow: "⇅",
        UpDownArrow: "↕",
        Updownarrow: "⇕",
        updownarrow: "↕",
        UpEquilibrium: "⥮",
        upharpoonleft: "↿",
        upharpoonright: "↾",
        uplus: "⊎",
        UpperLeftArrow: "↖",
        UpperRightArrow: "↗",
        Upsi: "ϒ",
        upsi: "υ",
        upsih: "ϒ",
        Upsilon: "Υ",
        upsilon: "υ",
        UpTee: "⊥",
        UpTeeArrow: "↥",
        upuparrows: "⇈",
        urcorn: "⌝",
        urcorner: "⌝",
        urcrop: "⌎",
        Uring: "Ů",
        uring: "ů",
        urtri: "◹",
        Uscr: "\uD835\uDCB0",
        uscr: "\uD835\uDCCA",
        utdot: "⋰",
        Utilde: "Ũ",
        utilde: "ũ",
        utri: "▵",
        utrif: "▴",
        uuarr: "⇈",
        Uuml: "Ü",
        uuml: "ü",
        uwangle: "⦧",
        vangrt: "⦜",
        varepsilon: "ϵ",
        varkappa: "ϰ",
        varnothing: "∅",
        varphi: "ϕ",
        varpi: "ϖ",
        varpropto: "∝",
        vArr: "⇕",
        varr: "↕",
        varrho: "ϱ",
        varsigma: "ς",
        varsubsetneq: "⊊︀",
        varsubsetneqq: "⫋︀",
        varsupsetneq: "⊋︀",
        varsupsetneqq: "⫌︀",
        vartheta: "ϑ",
        vartriangleleft: "⊲",
        vartriangleright: "⊳",
        Vbar: "⫫",
        vBar: "⫨",
        vBarv: "⫩",
        Vcy: "В",
        vcy: "в",
        VDash: "⊫",
        Vdash: "⊩",
        vDash: "⊨",
        vdash: "⊢",
        Vdashl: "⫦",
        Vee: "⋁",
        vee: "∨",
        veebar: "⊻",
        veeeq: "≚",
        vellip: "⋮",
        Verbar: "‖",
        verbar: "|",
        Vert: "‖",
        vert: "|",
        VerticalBar: "∣",
        VerticalLine: "|",
        VerticalSeparator: "❘",
        VerticalTilde: "≀",
        VeryThinSpace: " ",
        Vfr: "\uD835\uDD19",
        vfr: "\uD835\uDD33",
        vltri: "⊲",
        vnsub: "⊂⃒",
        vnsup: "⊃⃒",
        Vopf: "\uD835\uDD4D",
        vopf: "\uD835\uDD67",
        vprop: "∝",
        vrtri: "⊳",
        Vscr: "\uD835\uDCB1",
        vscr: "\uD835\uDCCB",
        vsubnE: "⫋︀",
        vsubne: "⊊︀",
        vsupnE: "⫌︀",
        vsupne: "⊋︀",
        Vvdash: "⊪",
        vzigzag: "⦚",
        Wcirc: "Ŵ",
        wcirc: "ŵ",
        wedbar: "⩟",
        Wedge: "⋀",
        wedge: "∧",
        wedgeq: "≙",
        weierp: "℘",
        Wfr: "\uD835\uDD1A",
        wfr: "\uD835\uDD34",
        Wopf: "\uD835\uDD4E",
        wopf: "\uD835\uDD68",
        wp: "℘",
        wr: "≀",
        wreath: "≀",
        Wscr: "\uD835\uDCB2",
        wscr: "\uD835\uDCCC",
        xcap: "⋂",
        xcirc: "◯",
        xcup: "⋃",
        xdtri: "▽",
        Xfr: "\uD835\uDD1B",
        xfr: "\uD835\uDD35",
        xhArr: "⟺",
        xharr: "⟷",
        Xi: "Ξ",
        xi: "ξ",
        xlArr: "⟸",
        xlarr: "⟵",
        xmap: "⟼",
        xnis: "⋻",
        xodot: "⨀",
        Xopf: "\uD835\uDD4F",
        xopf: "\uD835\uDD69",
        xoplus: "⨁",
        xotime: "⨂",
        xrArr: "⟹",
        xrarr: "⟶",
        Xscr: "\uD835\uDCB3",
        xscr: "\uD835\uDCCD",
        xsqcup: "⨆",
        xuplus: "⨄",
        xutri: "△",
        xvee: "⋁",
        xwedge: "⋀",
        Yacute: "Ý",
        yacute: "ý",
        YAcy: "Я",
        yacy: "я",
        Ycirc: "Ŷ",
        ycirc: "ŷ",
        Ycy: "Ы",
        ycy: "ы",
        yen: "¥",
        Yfr: "\uD835\uDD1C",
        yfr: "\uD835\uDD36",
        YIcy: "Ї",
        yicy: "ї",
        Yopf: "\uD835\uDD50",
        yopf: "\uD835\uDD6A",
        Yscr: "\uD835\uDCB4",
        yscr: "\uD835\uDCCE",
        YUcy: "Ю",
        yucy: "ю",
        Yuml: "Ÿ",
        yuml: "ÿ",
        Zacute: "Ź",
        zacute: "ź",
        Zcaron: "Ž",
        zcaron: "ž",
        Zcy: "З",
        zcy: "з",
        Zdot: "Ż",
        zdot: "ż",
        zeetrf: "ℨ",
        ZeroWidthSpace: "​",
        Zeta: "Ζ",
        zeta: "ζ",
        Zfr: "ℨ",
        zfr: "\uD835\uDD37",
        ZHcy: "Ж",
        zhcy: "ж",
        zigrarr: "⇝",
        Zopf: "ℤ",
        zopf: "\uD835\uDD6B",
        Zscr: "\uD835\uDCB5",
        zscr: "\uD835\uDCCF",
        zwj: "‍",
        zwnj: "‌"
    });
    Jez.entityMap = Jez.HTML_ENTITIES
})