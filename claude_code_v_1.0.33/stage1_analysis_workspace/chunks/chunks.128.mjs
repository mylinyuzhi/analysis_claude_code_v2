
// @from(Start 12082141, End 12099896)
b31 = z((HWZ, Nu2) => {
  Nu2.exports = fTA;
  var FC = nD(),
    zr5 = h0A(),
    Uu2 = w31(),
    mn = cWA(),
    Ur5 = FG0(),
    $r5 = DG0(),
    bTA = bWA(),
    wr5 = CG0(),
    qr5 = zG0(),
    Nr5 = hTA(),
    Lr5 = vg2(),
    Mr5 = mg2(),
    Du2 = yTA(),
    Hu2 = _31(),
    Cu2 = O31(),
    Or5 = RG0(),
    v31 = q31(),
    yG0 = x31(),
    Rr5 = kG0(),
    X7 = dJ(),
    iWA = Ku2(),
    aWA = X7.NAMESPACE,
    xG0 = z31().isApiWritable;

  function fTA(A, Q) {
    Uu2.call(this), this.nodeType = FC.DOCUMENT_NODE, this.isHTML = A, this._address = Q || "about:blank", this.readyState = "loading", this.implementation = new Nr5(this), this.ownerDocument = null, this._contentType = A ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0
  }
  var Tr5 = {
      event: "Event",
      customevent: "CustomEvent",
      uievent: "UIEvent",
      mouseevent: "MouseEvent"
    },
    Pr5 = {
      events: "event",
      htmlevents: "event",
      mouseevents: "mouseevent",
      mutationevents: "mutationevent",
      uievents: "uievent"
    },
    nWA = function(A, Q, B) {
      return {
        get: function() {
          var G = A.call(this);
          if (G) return G[Q];
          return B
        },
        set: function(G) {
          var Z = A.call(this);
          if (Z) Z[Q] = G
        }
      }
    };

  function Eu2(A, Q) {
    var B, G, Z;
    if (A === "") A = null;
    if (!v31.isValidQName(Q)) X7.InvalidCharacterError();
    if (B = null, G = Q, Z = Q.indexOf(":"), Z >= 0) B = Q.substring(0, Z), G = Q.substring(Z + 1);
    if (B !== null && A === null) X7.NamespaceError();
    if (B === "xml" && A !== aWA.XML) X7.NamespaceError();
    if ((B === "xmlns" || Q === "xmlns") && A !== aWA.XMLNS) X7.NamespaceError();
    if (A === aWA.XMLNS && !(B === "xmlns" || Q === "xmlns")) X7.NamespaceError();
    return {
      namespace: A,
      prefix: B,
      localName: G
    }
  }
  fTA.prototype = Object.create(Uu2.prototype, {
    _setMutationHandler: {
      value: function(A) {
        this.mutationHandler = A
      }
    },
    _dispatchRendererEvent: {
      value: function(A, Q, B) {
        var G = this._nodes[A];
        if (!G) return;
        G._dispatchEvent(new bTA(Q, B), !0)
      }
    },
    nodeName: {
      value: "#document"
    },
    nodeValue: {
      get: function() {
        return null
      },
      set: function() {}
    },
    documentURI: {
      get: function() {
        return this._address
      },
      set: X7.nyi
    },
    compatMode: {
      get: function() {
        return this._quirks ? "BackCompat" : "CSS1Compat"
      }
    },
    createTextNode: {
      value: function(A) {
        return new Ur5(this, String(A))
      }
    },
    createComment: {
      value: function(A) {
        return new $r5(this, A)
      }
    },
    createDocumentFragment: {
      value: function() {
        return new wr5(this)
      }
    },
    createProcessingInstruction: {
      value: function(A, Q) {
        if (!v31.isValidName(A) || Q.indexOf("?>") !== -1) X7.InvalidCharacterError();
        return new qr5(this, A, Q)
      }
    },
    createAttribute: {
      value: function(A) {
        if (A = String(A), !v31.isValidName(A)) X7.InvalidCharacterError();
        if (this.isHTML) A = X7.toASCIILowerCase(A);
        return new mn._Attr(null, A, null, null, "")
      }
    },
    createAttributeNS: {
      value: function(A, Q) {
        A = A === null || A === void 0 || A === "" ? null : String(A), Q = String(Q);
        var B = Eu2(A, Q);
        return new mn._Attr(null, B.localName, B.prefix, B.namespace, "")
      }
    },
    createElement: {
      value: function(A) {
        if (A = String(A), !v31.isValidName(A)) X7.InvalidCharacterError();
        if (this.isHTML) {
          if (/[A-Z]/.test(A)) A = X7.toASCIILowerCase(A);
          return yG0.createElement(this, A, null)
        } else if (this.contentType === "application/xhtml+xml") return yG0.createElement(this, A, null);
        else return new mn(this, A, null, null)
      },
      writable: xG0
    },
    createElementNS: {
      value: function(A, Q) {
        A = A === null || A === void 0 || A === "" ? null : String(A), Q = String(Q);
        var B = Eu2(A, Q);
        return this._createElementNS(B.localName, B.namespace, B.prefix)
      },
      writable: xG0
    },
    _createElementNS: {
      value: function(A, Q, B) {
        if (Q === aWA.HTML) return yG0.createElement(this, A, B);
        else if (Q === aWA.SVG) return Rr5.createElement(this, A, B);
        return new mn(this, A, Q, B)
      }
    },
    createEvent: {
      value: function(Q) {
        Q = Q.toLowerCase();
        var B = Pr5[Q] || Q,
          G = Or5[Tr5[B]];
        if (G) {
          var Z = new G;
          return Z._initialized = !1, Z
        } else X7.NotSupportedError()
      }
    },
    createTreeWalker: {
      value: function(A, Q, B) {
        if (!A) throw TypeError("root argument is required");
        if (!(A instanceof FC)) throw TypeError("root not a node");
        return Q = Q === void 0 ? Du2.SHOW_ALL : +Q, B = B === void 0 ? null : B, new Lr5(A, Q, B)
      }
    },
    createNodeIterator: {
      value: function(A, Q, B) {
        if (!A) throw TypeError("root argument is required");
        if (!(A instanceof FC)) throw TypeError("root not a node");
        return Q = Q === void 0 ? Du2.SHOW_ALL : +Q, B = B === void 0 ? null : B, new Mr5(A, Q, B)
      }
    },
    _attachNodeIterator: {
      value: function(A) {
        if (!this._nodeIterators) this._nodeIterators = [];
        this._nodeIterators.push(A)
      }
    },
    _detachNodeIterator: {
      value: function(A) {
        var Q = this._nodeIterators.indexOf(A);
        this._nodeIterators.splice(Q, 1)
      }
    },
    _preremoveNodeIterators: {
      value: function(A) {
        if (this._nodeIterators) this._nodeIterators.forEach(function(Q) {
          Q._preremove(A)
        })
      }
    },
    _updateDocTypeElement: {
      value: function() {
        this.doctype = this.documentElement = null;
        for (var Q = this.firstChild; Q !== null; Q = Q.nextSibling)
          if (Q.nodeType === FC.DOCUMENT_TYPE_NODE) this.doctype = Q;
          else if (Q.nodeType === FC.ELEMENT_NODE) this.documentElement = Q
      }
    },
    insertBefore: {
      value: function(Q, B) {
        return FC.prototype.insertBefore.call(this, Q, B), this._updateDocTypeElement(), Q
      }
    },
    replaceChild: {
      value: function(Q, B) {
        return FC.prototype.replaceChild.call(this, Q, B), this._updateDocTypeElement(), B
      }
    },
    removeChild: {
      value: function(Q) {
        return FC.prototype.removeChild.call(this, Q), this._updateDocTypeElement(), Q
      }
    },
    getElementById: {
      value: function(A) {
        var Q = this.byId[A];
        if (!Q) return null;
        if (Q instanceof Yg) return Q.getFirst();
        return Q
      }
    },
    _hasMultipleElementsWithId: {
      value: function(A) {
        return this.byId[A] instanceof Yg
      }
    },
    getElementsByName: {
      value: mn.prototype.getElementsByName
    },
    getElementsByTagName: {
      value: mn.prototype.getElementsByTagName
    },
    getElementsByTagNameNS: {
      value: mn.prototype.getElementsByTagNameNS
    },
    getElementsByClassName: {
      value: mn.prototype.getElementsByClassName
    },
    adoptNode: {
      value: function(Q) {
        if (Q.nodeType === FC.DOCUMENT_NODE) X7.NotSupportedError();
        if (Q.nodeType === FC.ATTRIBUTE_NODE) return Q;
        if (Q.parentNode) Q.parentNode.removeChild(Q);
        if (Q.ownerDocument !== this) qu2(Q, this);
        return Q
      }
    },
    importNode: {
      value: function(Q, B) {
        return this.adoptNode(Q.cloneNode(B))
      },
      writable: xG0
    },
    origin: {
      get: function() {
        return null
      }
    },
    characterSet: {
      get: function() {
        return "UTF-8"
      }
    },
    contentType: {
      get: function() {
        return this._contentType
      }
    },
    URL: {
      get: function() {
        return this._address
      }
    },
    domain: {
      get: X7.nyi,
      set: X7.nyi
    },
    referrer: {
      get: X7.nyi
    },
    cookie: {
      get: X7.nyi,
      set: X7.nyi
    },
    lastModified: {
      get: X7.nyi
    },
    location: {
      get: function() {
        return this.defaultView ? this.defaultView.location : null
      },
      set: X7.nyi
    },
    _titleElement: {
      get: function() {
        return this.getElementsByTagName("title").item(0) || null
      }
    },
    title: {
      get: function() {
        var A = this._titleElement,
          Q = A ? A.textContent : "";
        return Q.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "")
      },
      set: function(A) {
        var Q = this._titleElement,
          B = this.head;
        if (!Q && !B) return;
        if (!Q) Q = this.createElement("title"), B.appendChild(Q);
        Q.textContent = A
      }
    },
    dir: nWA(function() {
      var A = this.documentElement;
      if (A && A.tagName === "HTML") return A
    }, "dir", ""),
    fgColor: nWA(function() {
      return this.body
    }, "text", ""),
    linkColor: nWA(function() {
      return this.body
    }, "link", ""),
    vlinkColor: nWA(function() {
      return this.body
    }, "vLink", ""),
    alinkColor: nWA(function() {
      return this.body
    }, "aLink", ""),
    bgColor: nWA(function() {
      return this.body
    }, "bgColor", ""),
    charset: {
      get: function() {
        return this.characterSet
      }
    },
    inputEncoding: {
      get: function() {
        return this.characterSet
      }
    },
    scrollingElement: {
      get: function() {
        return this._quirks ? this.body : this.documentElement
      }
    },
    body: {
      get: function() {
        return zu2(this.documentElement, "body")
      },
      set: X7.nyi
    },
    head: {
      get: function() {
        return zu2(this.documentElement, "head")
      }
    },
    images: {
      get: X7.nyi
    },
    embeds: {
      get: X7.nyi
    },
    plugins: {
      get: X7.nyi
    },
    links: {
      get: X7.nyi
    },
    forms: {
      get: X7.nyi
    },
    scripts: {
      get: X7.nyi
    },
    applets: {
      get: function() {
        return []
      }
    },
    activeElement: {
      get: function() {
        return null
      }
    },
    innerHTML: {
      get: function() {
        return this.serialize()
      },
      set: X7.nyi
    },
    outerHTML: {
      get: function() {
        return this.serialize()
      },
      set: X7.nyi
    },
    write: {
      value: function(A) {
        if (!this.isHTML) X7.InvalidStateError();
        if (!this._parser) return;
        if (!this._parser);
        var Q = arguments.join("");
        this._parser.parse(Q)
      }
    },
    writeln: {
      value: function(Q) {
        this.write(Array.prototype.join.call(arguments, "") + `
`)
      }
    },
    open: {
      value: function() {
        this.documentElement = null
      }
    },
    close: {
      value: function() {
        if (this.readyState = "interactive", this._dispatchEvent(new bTA("readystatechange"), !0), this._dispatchEvent(new bTA("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new bTA("readystatechange"), !0), this.defaultView) this.defaultView._dispatchEvent(new bTA("load"), !0)
      }
    },
    clone: {
      value: function() {
        var Q = new fTA(this.isHTML, this._address);
        return Q._quirks = this._quirks, Q._contentType = this._contentType, Q
      }
    },
    cloneNode: {
      value: function(Q) {
        var B = FC.prototype.cloneNode.call(this, !1);
        if (Q)
          for (var G = this.firstChild; G !== null; G = G.nextSibling) B._appendChild(B.importNode(G, !0));
        return B._updateDocTypeElement(), B
      }
    },
    isEqual: {
      value: function(Q) {
        return !0
      }
    },
    mutateValue: {
      value: function(A) {
        if (this.mutationHandler) this.mutationHandler({
          type: iWA.VALUE,
          target: A,
          data: A.data
        })
      }
    },
    mutateAttr: {
      value: function(A, Q) {
        if (this.mutationHandler) this.mutationHandler({
          type: iWA.ATTR,
          target: A.ownerElement,
          attr: A
        })
      }
    },
    mutateRemoveAttr: {
      value: function(A) {
        if (this.mutationHandler) this.mutationHandler({
          type: iWA.REMOVE_ATTR,
          target: A.ownerElement,
          attr: A
        })
      }
    },
    mutateRemove: {
      value: function(A) {
        if (this.mutationHandler) this.mutationHandler({
          type: iWA.REMOVE,
          target: A.parentNode,
          node: A
        });
        wu2(A)
      }
    },
    mutateInsert: {
      value: function(A) {
        if ($u2(A), this.mutationHandler) this.mutationHandler({
          type: iWA.INSERT,
          target: A.parentNode,
          node: A
        })
      }
    },
    mutateMove: {
      value: function(A) {
        if (this.mutationHandler) this.mutationHandler({
          type: iWA.MOVE,
          target: A
        })
      }
    },
    addId: {
      value: function(Q, B) {
        var G = this.byId[Q];
        if (!G) this.byId[Q] = B;
        else {
          if (!(G instanceof Yg)) G = new Yg(G), this.byId[Q] = G;
          G.add(B)
        }
      }
    },
    delId: {
      value: function(Q, B) {
        var G = this.byId[Q];
        if (X7.assert(G), G instanceof Yg) {
          if (G.del(B), G.length === 1) this.byId[Q] = G.downgrade()
        } else this.byId[Q] = void 0
      }
    },
    _resolve: {
      value: function(A) {
        return new Hu2(this._documentBaseURL).resolve(A)
      }
    },
    _documentBaseURL: {
      get: function() {
        var A = this._address;
        if (A === "about:blank") A = "/";
        var Q = this.querySelector("base[href]");
        if (Q) return new Hu2(A).resolve(Q.getAttribute("href"));
        return A
      }
    },
    _templateDoc: {
      get: function() {
        if (!this._templateDocCache) {
          var A = new fTA(this.isHTML, this._address);
          this._templateDocCache = A._templateDocCache = A
        }
        return this._templateDocCache
      }
    },
    querySelector: {
      value: function(A) {
        return Cu2(A, this)[0]
      }
    },
    querySelectorAll: {
      value: function(A) {
        var Q = Cu2(A, this);
        return Q.item ? Q : new zr5(Q)
      }
    }
  });
  var jr5 = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
  jr5.forEach(function(A) {
    Object.defineProperty(fTA.prototype, "on" + A, {
      get: function() {
        return this._getEventHandler(A)
      },
      set: function(Q) {
        this._setEventHandler(A, Q)
      }
    })
  });

  function zu2(A, Q) {
    if (A && A.isHTML) {
      for (var B = A.firstChild; B !== null; B = B.nextSibling)
        if (B.nodeType === FC.ELEMENT_NODE && B.localName === Q && B.namespaceURI === aWA.HTML) return B
    }
    return null
  }

  function Sr5(A) {
    if (A._nid = A.ownerDocument._nextnid++, A.ownerDocument._nodes[A._nid] = A, A.nodeType === FC.ELEMENT_NODE) {
      var Q = A.getAttribute("id");
      if (Q) A.ownerDocument.addId(Q, A);
      if (A._roothook) A._roothook()
    }
  }

  function _r5(A) {
    if (A.nodeType === FC.ELEMENT_NODE) {
      var Q = A.getAttribute("id");
      if (Q) A.ownerDocument.delId(Q, A)
    }
    A.ownerDocument._nodes[A._nid] = void 0, A._nid = void 0
  }

  function $u2(A) {
    if (Sr5(A), A.nodeType === FC.ELEMENT_NODE)
      for (var Q = A.firstChild; Q !== null; Q = Q.nextSibling) $u2(Q)
  }

  function wu2(A) {
    _r5(A);
    for (var Q = A.firstChild; Q !== null; Q = Q.nextSibling) wu2(Q)
  }

  function qu2(A, Q) {
    if (A.ownerDocument = Q, A._lastModTime = void 0, Object.prototype.hasOwnProperty.call(A, "_tagName")) A._tagName = void 0;
    for (var B = A.firstChild; B !== null; B = B.nextSibling) qu2(B, Q)
  }

  function Yg(A) {
    this.nodes = Object.create(null), this.nodes[A._nid] = A, this.length = 1, this.firstNode = void 0
  }
  Yg.prototype.add = function(A) {
    if (!this.nodes[A._nid]) this.nodes[A._nid] = A, this.length++, this.firstNode = void 0
  };
  Yg.prototype.del = function(A) {
    if (this.nodes[A._nid]) delete this.nodes[A._nid], this.length--, this.firstNode = void 0
  };
  Yg.prototype.getFirst = function() {
    if (!this.firstNode) {
      var A;
      for (A in this.nodes)
        if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[A]) & FC.DOCUMENT_POSITION_PRECEDING) this.firstNode = this.nodes[A]
    }
    return this.firstNode
  };
  Yg.prototype.downgrade = function() {
    if (this.length === 1) {
      var A;
      for (A in this.nodes) return this.nodes[A]
    }
    return this
  }
})
// @from(Start 12099902, End 12100768)
h31 = z((CWZ, Mu2) => {
  Mu2.exports = f31;
  var kr5 = nD(),
    Lu2 = XG0(),
    yr5 = R31();

  function f31(A, Q, B, G) {
    Lu2.call(this), this.nodeType = kr5.DOCUMENT_TYPE_NODE, this.ownerDocument = A || null, this.name = Q, this.publicId = B || "", this.systemId = G || ""
  }
  f31.prototype = Object.create(Lu2.prototype, {
    nodeName: {
      get: function() {
        return this.name
      }
    },
    nodeValue: {
      get: function() {
        return null
      },
      set: function() {}
    },
    clone: {
      value: function() {
        return new f31(this.ownerDocument, this.name, this.publicId, this.systemId)
      }
    },
    isEqual: {
      value: function(Q) {
        return this.name === Q.name && this.publicId === Q.publicId && this.systemId === Q.systemId
      }
    }
  });
  Object.defineProperties(f31.prototype, yr5)
})