
// @from(Ln 335682, Col 4)
L48 = p((rYK, oYK) => {
    (function() {
        oYK.exports = {
            None: 0,
            OpenTag: 1,
            InsideTag: 2,
            CloseTag: 3
        }
    }).call(rYK)
})
// @from(Ln 335692, Col 4)
V17 = p((aYK, sYK) => {
    (function() {
        var q, K, _, z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z = {}.hasOwnProperty;
        ({
            assign: D
        } = bl()), q = yM(), $ = $F8(), j = MF8(), _ = OF8(), z = wF8(), J = AF8(), M = PF8(), P = WF8(), X = DF8(), H = v17(), Y = jF8(), A = JF8(), O = HF8(), w = XF8(), K = L48(), sYK.exports = W = class {
            constructor(f) {
                var v, V, k;
                f || (f = {}), this.options = f, V = f.writer || {};
                for (v in V) {
                    if (!Z.call(V, v)) continue;
                    k = V[v], this["_" + v] = this[v], this[v] = k
                }
            }
            filterOptions(f) {
                var v, V, k, N, R, h, C, x, B;
                if (f || (f = {}), f = D({}, this.options, f), v = {
                        writer: this
                    }, v.pretty = f.pretty || !1, v.allowEmpty = f.allowEmpty || !1, v.indent = (V = f.indent) != null ? V : "  ", v.newline = (k = f.newline) != null ? k : `
`, v.offset = (N = f.offset) != null ? N : 0, v.width = (R = f.width) != null ? R : 0, v.dontPrettyTextNodes = (h = (C = f.dontPrettyTextNodes) != null ? C : f.dontprettytextnodes) != null ? h : 0, v.spaceBeforeSlash = (x = (B = f.spaceBeforeSlash) != null ? B : f.spacebeforeslash) != null ? x : "", v.spaceBeforeSlash === !0) v.spaceBeforeSlash = " ";
                return v.suppressPrettyCount = 0, v.user = {}, v.state = K.None, v
            }
            indent(f, v, V) {
                var k;
                if (!v.pretty || v.suppressPrettyCount) return "";
                else if (v.pretty) {
                    if (k = (V || 0) + v.offset + 1, k > 0) return Array(k).join(v.indent)
                }
                return ""
            }
            endline(f, v, V) {
                if (!v.pretty || v.suppressPrettyCount) return "";
                else return v.newline
            }
            attribute(f, v, V) {
                var k;
                if (this.openAttribute(f, v, V), v.pretty && v.width > 0) k = f.name + '="' + f.value + '"';
                else k = " " + f.name + '="' + f.value + '"';
                return this.closeAttribute(f, v, V), k
            }
            cdata(f, v, V) {
                var k;
                return this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<![CDATA[", v.state = K.InsideTag, k += f.value, v.state = K.CloseTag, k += "]]>" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            comment(f, v, V) {
                var k;
                return this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<!-- ", v.state = K.InsideTag, k += f.value, v.state = K.CloseTag, k += " -->" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            declaration(f, v, V) {
                var k;
                if (this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<?xml", v.state = K.InsideTag, k += ' version="' + f.version + '"', f.encoding != null) k += ' encoding="' + f.encoding + '"';
                if (f.standalone != null) k += ' standalone="' + f.standalone + '"';
                return v.state = K.CloseTag, k += v.spaceBeforeSlash + "?>", k += this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            docType(f, v, V) {
                var k, N, R, h, C;
                if (V || (V = 0), this.openNode(f, v, V), v.state = K.OpenTag, h = this.indent(f, v, V), h += "<!DOCTYPE " + f.root().name, f.pubID && f.sysID) h += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                else if (f.sysID) h += ' SYSTEM "' + f.sysID + '"';
                if (f.children.length > 0) {
                    h += " [", h += this.endline(f, v, V), v.state = K.InsideTag, C = f.children;
                    for (N = 0, R = C.length; N < R; N++) k = C[N], h += this.writeChildNode(k, v, V + 1);
                    v.state = K.CloseTag, h += "]"
                }
                return v.state = K.CloseTag, h += v.spaceBeforeSlash + ">", h += this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), h
            }
            element(f, v, V) {
                var k, N, R, h, C, x, B, m, S, F, U, g, c, n, l, z6, A6, e, i;
                if (V || (V = 0), g = !1, this.openNode(f, v, V), v.state = K.OpenTag, c = this.indent(f, v, V) + "<" + f.name, v.pretty && v.width > 0) {
                    m = c.length, l = f.attribs;
                    for (U in l) {
                        if (!Z.call(l, U)) continue;
                        if (k = l[U], n = this.attribute(k, v, V), N = n.length, m + N > v.width) i = this.indent(f, v, V + 1) + n, c += this.endline(f, v, V) + i, m = i.length;
                        else i = " " + n, c += i, m += i.length
                    }
                } else {
                    z6 = f.attribs;
                    for (U in z6) {
                        if (!Z.call(z6, U)) continue;
                        k = z6[U], c += this.attribute(k, v, V)
                    }
                }
                if (h = f.children.length, C = h === 0 ? null : f.children[0], h === 0 || f.children.every(function(O6) {
                        return (O6.type === q.Text || O6.type === q.Raw || O6.type === q.CData) && O6.value === ""
                    }))
                    if (v.allowEmpty) c += ">", v.state = K.CloseTag, c += "</" + f.name + ">" + this.endline(f, v, V);
                    else v.state = K.CloseTag, c += v.spaceBeforeSlash + "/>" + this.endline(f, v, V);
                else if (v.pretty && h === 1 && (C.type === q.Text || C.type === q.Raw || C.type === q.CData) && C.value != null) c += ">", v.state = K.InsideTag, v.suppressPrettyCount++, g = !0, c += this.writeChildNode(C, v, V + 1), v.suppressPrettyCount--, g = !1, v.state = K.CloseTag, c += "</" + f.name + ">" + this.endline(f, v, V);
                else {
                    if (v.dontPrettyTextNodes) {
                        A6 = f.children;
                        for (x = 0, S = A6.length; x < S; x++)
                            if (R = A6[x], (R.type === q.Text || R.type === q.Raw || R.type === q.CData) && R.value != null) {
                                v.suppressPrettyCount++, g = !0;
                                break
                            }
                    }
                    c += ">" + this.endline(f, v, V), v.state = K.InsideTag, e = f.children;
                    for (B = 0, F = e.length; B < F; B++) R = e[B], c += this.writeChildNode(R, v, V + 1);
                    if (v.state = K.CloseTag, c += this.indent(f, v, V) + "</" + f.name + ">", g) v.suppressPrettyCount--;
                    c += this.endline(f, v, V), v.state = K.None
                }
                return this.closeNode(f, v, V), c
            }
            writeChildNode(f, v, V) {
                switch (f.type) {
                    case q.CData:
                        return this.cdata(f, v, V);
                    case q.Comment:
                        return this.comment(f, v, V);
                    case q.Element:
                        return this.element(f, v, V);
                    case q.Raw:
                        return this.raw(f, v, V);
                    case q.Text:
                        return this.text(f, v, V);
                    case q.ProcessingInstruction:
                        return this.processingInstruction(f, v, V);
                    case q.Dummy:
                        return "";
                    case q.Declaration:
                        return this.declaration(f, v, V);
                    case q.DocType:
                        return this.docType(f, v, V);
                    case q.AttributeDeclaration:
                        return this.dtdAttList(f, v, V);
                    case q.ElementDeclaration:
                        return this.dtdElement(f, v, V);
                    case q.EntityDeclaration:
                        return this.dtdEntity(f, v, V);
                    case q.NotationDeclaration:
                        return this.dtdNotation(f, v, V);
                    default:
                        throw Error("Unknown XML node type: " + f.constructor.name)
                }
            }
            processingInstruction(f, v, V) {
                var k;
                if (this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<?", v.state = K.InsideTag, k += f.target, f.value) k += " " + f.value;
                return v.state = K.CloseTag, k += v.spaceBeforeSlash + "?>", k += this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            raw(f, v, V) {
                var k;
                return this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V), v.state = K.InsideTag, k += f.value, v.state = K.CloseTag, k += this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            text(f, v, V) {
                var k;
                return this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V), v.state = K.InsideTag, k += f.value, v.state = K.CloseTag, k += this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            dtdAttList(f, v, V) {
                var k;
                if (this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<!ATTLIST", v.state = K.InsideTag, k += " " + f.elementName + " " + f.attributeName + " " + f.attributeType, f.defaultValueType !== "#DEFAULT") k += " " + f.defaultValueType;
                if (f.defaultValue) k += ' "' + f.defaultValue + '"';
                return v.state = K.CloseTag, k += v.spaceBeforeSlash + ">" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            dtdElement(f, v, V) {
                var k;
                return this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<!ELEMENT", v.state = K.InsideTag, k += " " + f.name + " " + f.value, v.state = K.CloseTag, k += v.spaceBeforeSlash + ">" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            dtdEntity(f, v, V) {
                var k;
                if (this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<!ENTITY", v.state = K.InsideTag, f.pe) k += " %";
                if (k += " " + f.name, f.value) k += ' "' + f.value + '"';
                else {
                    if (f.pubID && f.sysID) k += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                    else if (f.sysID) k += ' SYSTEM "' + f.sysID + '"';
                    if (f.nData) k += " NDATA " + f.nData
                }
                return v.state = K.CloseTag, k += v.spaceBeforeSlash + ">" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            dtdNotation(f, v, V) {
                var k;
                if (this.openNode(f, v, V), v.state = K.OpenTag, k = this.indent(f, v, V) + "<!NOTATION", v.state = K.InsideTag, k += " " + f.name, f.pubID && f.sysID) k += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                else if (f.pubID) k += ' PUBLIC "' + f.pubID + '"';
                else if (f.sysID) k += ' SYSTEM "' + f.sysID + '"';
                return v.state = K.CloseTag, k += v.spaceBeforeSlash + ">" + this.endline(f, v, V), v.state = K.None, this.closeNode(f, v, V), k
            }
            openNode(f, v, V) {}
            closeNode(f, v, V) {}
            openAttribute(f, v, V) {}
            closeAttribute(f, v, V) {}
        }
    }).call(aYK)
})
// @from(Ln 335875, Col 4)
ZF8 = p((tYK, eYK) => {
    (function() {
        var q, K;
        K = V17(), eYK.exports = q = class extends K {
            constructor(z) {
                super(z)
            }
            document(z, Y) {
                var A, O, w, $, j;
                Y = this.filterOptions(Y), $ = "", j = z.children;
                for (O = 0, w = j.length; O < w; O++) A = j[O], $ += this.writeChildNode(A, Y, 0);
                if (Y.pretty && $.slice(-Y.newline.length) === Y.newline) $ = $.slice(0, -Y.newline.length);
                return $
            }
        }
    }).call(tYK)
})
// @from(Ln 335892, Col 4)
k17 = p((qAK, KAK) => {
    (function() {
        var q, K, _, z, Y, A, O, w;
        ({
            isPlainObject: w
        } = bl()), _ = f17(), K = zYK(), Y = YS(), q = yM(), O = T17(), A = ZF8(), KAK.exports = z = function() {
            class $ extends Y {
                constructor(j) {
                    super(null);
                    if (this.name = "#document", this.type = q.Document, this.documentURI = null, this.domConfig = new K, j || (j = {}), !j.writer) j.writer = new A;
                    this.options = j, this.stringify = new O(j)
                }
                end(j) {
                    var H = {};
                    if (!j) j = this.options.writer;
                    else if (w(j)) H = j, j = this.options.writer;
                    return j.document(this, j.filterOptions(H))
                }
                toString(j) {
                    return this.options.writer.document(this, this.options.writer.filterOptions(j))
                }
                createElement(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createDocumentFragment() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTextNode(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createComment(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createCDATASection(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createProcessingInstruction(j, H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttribute(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEntityReference(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagName(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                importNode(j, H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createElementNS(j, H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttributeNS(j, H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagNameNS(j, H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementById(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                adoptNode(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                normalizeDocument() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                renameNode(j, H, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByClassName(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEvent(j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createRange() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createNodeIterator(j, H, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTreeWalker(j, H, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }
            return Object.defineProperty($.prototype, "implementation", {
                value: new _
            }), Object.defineProperty($.prototype, "doctype", {
                get: function() {
                    var j, H, J, X;
                    X = this.children;
                    for (H = 0, J = X.length; H < J; H++)
                        if (j = X[H], j.type === q.DocType) return j;
                    return null
                }
            }), Object.defineProperty($.prototype, "documentElement", {
                get: function() {
                    return this.rootObject || null
                }
            }), Object.defineProperty($.prototype, "inputEncoding", {
                get: function() {
                    return null
                }
            }), Object.defineProperty($.prototype, "strictErrorChecking", {
                get: function() {
                    return !1
                }
            }), Object.defineProperty($.prototype, "xmlEncoding", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === q.Declaration) return this.children[0].encoding;
                    else return null
                }
            }), Object.defineProperty($.prototype, "xmlStandalone", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === q.Declaration) return this.children[0].standalone === "yes";
                    else return !1
                }
            }), Object.defineProperty($.prototype, "xmlVersion", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === q.Declaration) return this.children[0].version;
                    else return "1.0"
                }
            }), Object.defineProperty($.prototype, "URL", {
                get: function() {
                    return this.documentURI
                }
            }), Object.defineProperty($.prototype, "origin", {
                get: function() {
                    return null
                }
            }), Object.defineProperty($.prototype, "compatMode", {
                get: function() {
                    return null
                }
            }), Object.defineProperty($.prototype, "characterSet", {
                get: function() {
                    return null
                }
            }), Object.defineProperty($.prototype, "contentType", {
                get: function() {
                    return null
                }
            }), $
        }.call(this)
    }).call(qAK)
})
// @from(Ln 336041, Col 4)
YAK = p((_AK, zAK) => {
    (function() {
        var q, K, _, z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f, v, V, k, N = {}.hasOwnProperty;
        ({
            isObject: V,
            isFunction: v,
            isPlainObject: k,
            getValue: f
        } = bl()), q = yM(), J = k17(), M = AF8(), z = OF8(), Y = wF8(), W = PF8(), G = WF8(), P = DF8(), j = $F8(), H = MF8(), A = jF8(), w = HF8(), O = JF8(), $ = XF8(), _ = G17(), Z = T17(), D = ZF8(), K = L48(), zAK.exports = X = class {
            constructor(h, C, x) {
                var B;
                if (this.name = "?xml", this.type = q.Document, h || (h = {}), B = {}, !h.writer) h.writer = new D;
                else if (k(h.writer)) B = h.writer, h.writer = new D;
                this.options = h, this.writer = h.writer, this.writerOptions = this.writer.filterOptions(B), this.stringify = new Z(h), this.onDataCallback = C || function() {}, this.onEndCallback = x || function() {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
            }
            createChildNode(h) {
                var C, x, B, m, S, F, U, g;
                switch (h.type) {
                    case q.CData:
                        this.cdata(h.value);
                        break;
                    case q.Comment:
                        this.comment(h.value);
                        break;
                    case q.Element:
                        B = {}, U = h.attribs;
                        for (x in U) {
                            if (!N.call(U, x)) continue;
                            C = U[x], B[x] = C.value
                        }
                        this.node(h.name, B);
                        break;
                    case q.Dummy:
                        this.dummy();
                        break;
                    case q.Raw:
                        this.raw(h.value);
                        break;
                    case q.Text:
                        this.text(h.value);
                        break;
                    case q.ProcessingInstruction:
                        this.instruction(h.target, h.value);
                        break;
                    default:
                        throw Error("This XML node type is not supported in a JS object: " + h.constructor.name)
                }
                g = h.children;
                for (S = 0, F = g.length; S < F; S++)
                    if (m = g[S], this.createChildNode(m), m.type === q.Element) this.up();
                return this
            }
            dummy() {
                return this
            }
            node(h, C, x) {
                if (h == null) throw Error("Missing node name.");
                if (this.root && this.currentLevel === -1) throw Error("Document can only have one root node. " + this.debugInfo(h));
                if (this.openCurrent(), h = f(h), C == null) C = {};
                if (C = f(C), !V(C))[x, C] = [C, x];
                if (this.currentNode = new M(this, h, C), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, x != null) this.text(x);
                return this
            }
            element(h, C, x) {
                var B, m, S, F, U, g;
                if (this.currentNode && this.currentNode.type === q.DocType) this.dtdElement(...arguments);
                else if (Array.isArray(h) || V(h) || v(h)) {
                    F = this.options.noValidation, this.options.noValidation = !0, g = new J(this.options).element("TEMP_ROOT"), g.element(h), this.options.noValidation = F, U = g.children;
                    for (m = 0, S = U.length; m < S; m++)
                        if (B = U[m], this.createChildNode(B), B.type === q.Element) this.up()
                } else this.node(h, C, x);
                return this
            }
            attribute(h, C) {
                var x, B;
                if (!this.currentNode || this.currentNode.children) throw Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(h));
                if (h != null) h = f(h);
                if (V(h))
                    for (x in h) {
                        if (!N.call(h, x)) continue;
                        B = h[x], this.attribute(x, B)
                    } else {
                        if (v(C)) C = C.apply();
                        if (this.options.keepNullAttributes && C == null) this.currentNode.attribs[h] = new _(this, h, "");
                        else if (C != null) this.currentNode.attribs[h] = new _(this, h, C)
                    }
                return this
            }
            text(h) {
                var C;
                return this.openCurrent(), C = new G(this, h), this.onData(this.writer.text(C, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            cdata(h) {
                var C;
                return this.openCurrent(), C = new z(this, h), this.onData(this.writer.cdata(C, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            comment(h) {
                var C;
                return this.openCurrent(), C = new Y(this, h), this.onData(this.writer.comment(C, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            raw(h) {
                var C;
                return this.openCurrent(), C = new W(this, h), this.onData(this.writer.raw(C, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            instruction(h, C) {
                var x, B, m, S, F;
                if (this.openCurrent(), h != null) h = f(h);
                if (C != null) C = f(C);
                if (Array.isArray(h))
                    for (x = 0, S = h.length; x < S; x++) B = h[x], this.instruction(B);
                else if (V(h))
                    for (B in h) {
                        if (!N.call(h, B)) continue;
                        m = h[B], this.instruction(B, m)
                    } else {
                        if (v(C)) C = C.apply();
                        F = new P(this, h, C), this.onData(this.writer.processingInstruction(F, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1)
                    }
                return this
            }
            declaration(h, C, x) {
                var B;
                if (this.openCurrent(), this.documentStarted) throw Error("declaration() must be the first node.");
                return B = new j(this, h, C, x), this.onData(this.writer.declaration(B, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            doctype(h, C, x) {
                if (this.openCurrent(), h == null) throw Error("Missing root node name.");
                if (this.root) throw Error("dtd() must come before the root node.");
                return this.currentNode = new H(this, C, x), this.currentNode.rootNodeName = h, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
            }
            dtdElement(h, C) {
                var x;
                return this.openCurrent(), x = new O(this, h, C), this.onData(this.writer.dtdElement(x, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            attList(h, C, x, B, m) {
                var S;
                return this.openCurrent(), S = new A(this, h, C, x, B, m), this.onData(this.writer.dtdAttList(S, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            entity(h, C) {
                var x;
                return this.openCurrent(), x = new w(this, !1, h, C), this.onData(this.writer.dtdEntity(x, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            pEntity(h, C) {
                var x;
                return this.openCurrent(), x = new w(this, !0, h, C), this.onData(this.writer.dtdEntity(x, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            notation(h, C) {
                var x;
                return this.openCurrent(), x = new $(this, h, C), this.onData(this.writer.dtdNotation(x, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
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
            openNode(h) {
                var C, x, B, m;
                if (!h.isOpen) {
                    if (!this.root && this.currentLevel === 0 && h.type === q.Element) this.root = h;
                    if (x = "", h.type === q.Element) {
                        this.writerOptions.state = K.OpenTag, x = this.writer.indent(h, this.writerOptions, this.currentLevel) + "<" + h.name, m = h.attribs;
                        for (B in m) {
                            if (!N.call(m, B)) continue;
                            C = m[B], x += this.writer.attribute(C, this.writerOptions, this.currentLevel)
                        }
                        x += (h.children ? ">" : "/>") + this.writer.endline(h, this.writerOptions, this.currentLevel), this.writerOptions.state = K.InsideTag
                    } else {
                        if (this.writerOptions.state = K.OpenTag, x = this.writer.indent(h, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + h.rootNodeName, h.pubID && h.sysID) x += ' PUBLIC "' + h.pubID + '" "' + h.sysID + '"';
                        else if (h.sysID) x += ' SYSTEM "' + h.sysID + '"';
                        if (h.children) x += " [", this.writerOptions.state = K.InsideTag;
                        else this.writerOptions.state = K.CloseTag, x += ">";
                        x += this.writer.endline(h, this.writerOptions, this.currentLevel)
                    }
                    return this.onData(x, this.currentLevel), h.isOpen = !0
                }
            }
            closeNode(h) {
                var C;
                if (!h.isClosed) {
                    if (C = "", this.writerOptions.state = K.CloseTag, h.type === q.Element) C = this.writer.indent(h, this.writerOptions, this.currentLevel) + "</" + h.name + ">" + this.writer.endline(h, this.writerOptions, this.currentLevel);
                    else C = this.writer.indent(h, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(h, this.writerOptions, this.currentLevel);
                    return this.writerOptions.state = K.None, this.onData(C, this.currentLevel), h.isClosed = !0
                }
            }
            onData(h, C) {
                return this.documentStarted = !0, this.onDataCallback(h, C + 1)
            }
            onEnd() {
                return this.documentCompleted = !0, this.onEndCallback()
            }
            debugInfo(h) {
                if (h == null) return "";
                else return "node: <" + h + ">"
            }
            ele() {
                return this.element(...arguments)
            }
            nod(h, C, x) {
                return this.node(h, C, x)
            }
            txt(h) {
                return this.text(h)
            }
            dat(h) {
                return this.cdata(h)
            }
            com(h) {
                return this.comment(h)
            }
            ins(h, C) {
                return this.instruction(h, C)
            }
            dec(h, C, x) {
                return this.declaration(h, C, x)
            }
            dtd(h, C, x) {
                return this.doctype(h, C, x)
            }
            e(h, C, x) {
                return this.element(h, C, x)
            }
            n(h, C, x) {
                return this.node(h, C, x)
            }
            t(h) {
                return this.text(h)
            }
            d(h) {
                return this.cdata(h)
            }
            c(h) {
                return this.comment(h)
            }
            r(h) {
                return this.raw(h)
            }
            i(h, C) {
                return this.instruction(h, C)
            }
            att() {
                if (this.currentNode && this.currentNode.type === q.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            a() {
                if (this.currentNode && this.currentNode.type === q.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            ent(h, C) {
                return this.entity(h, C)
            }
            pent(h, C) {
                return this.pEntity(h, C)
            }
            not(h, C) {
                return this.notation(h, C)
            }
        }
    }).call(_AK)
})
// @from(Ln 336311, Col 4)
wAK = p((AAK, OAK) => {
    (function() {
        var q, K, _, z, Y = {}.hasOwnProperty;
        q = yM(), z = V17(), K = L48(), OAK.exports = _ = class extends z {
            constructor(O, w) {
                super(w);
                this.stream = O
            }
            endline(O, w, $) {
                if (O.isLastRootNode && w.state === K.CloseTag) return "";
                else return super.endline(O, w, $)
            }
            document(O, w) {
                var $, j, H, J, X, M, P, W, D;
                P = O.children;
                for (j = H = 0, X = P.length; H < X; j = ++H) $ = P[j], $.isLastRootNode = j === O.children.length - 1;
                w = this.filterOptions(w), W = O.children, D = [];
                for (J = 0, M = W.length; J < M; J++) $ = W[J], D.push(this.writeChildNode($, w, 0));
                return D
            }
            cdata(O, w, $) {
                return this.stream.write(super.cdata(O, w, $))
            }
            comment(O, w, $) {
                return this.stream.write(super.comment(O, w, $))
            }
            declaration(O, w, $) {
                return this.stream.write(super.declaration(O, w, $))
            }
            docType(O, w, $) {
                var j, H, J, X;
                if ($ || ($ = 0), this.openNode(O, w, $), w.state = K.OpenTag, this.stream.write(this.indent(O, w, $)), this.stream.write("<!DOCTYPE " + O.root().name), O.pubID && O.sysID) this.stream.write(' PUBLIC "' + O.pubID + '" "' + O.sysID + '"');
                else if (O.sysID) this.stream.write(' SYSTEM "' + O.sysID + '"');
                if (O.children.length > 0) {
                    this.stream.write(" ["), this.stream.write(this.endline(O, w, $)), w.state = K.InsideTag, X = O.children;
                    for (H = 0, J = X.length; H < J; H++) j = X[H], this.writeChildNode(j, w, $ + 1);
                    w.state = K.CloseTag, this.stream.write("]")
                }
                return w.state = K.CloseTag, this.stream.write(w.spaceBeforeSlash + ">"), this.stream.write(this.endline(O, w, $)), w.state = K.None, this.closeNode(O, w, $)
            }
            element(O, w, $) {
                var j, H, J, X, M, P, W, D, Z, G, f, v, V, k, N, R;
                if ($ || ($ = 0), this.openNode(O, w, $), w.state = K.OpenTag, f = this.indent(O, w, $) + "<" + O.name, w.pretty && w.width > 0) {
                    W = f.length, V = O.attribs;
                    for (Z in V) {
                        if (!Y.call(V, Z)) continue;
                        if (j = V[Z], v = this.attribute(j, w, $), H = v.length, W + H > w.width) R = this.indent(O, w, $ + 1) + v, f += this.endline(O, w, $) + R, W = R.length;
                        else R = " " + v, f += R, W += R.length
                    }
                } else {
                    k = O.attribs;
                    for (Z in k) {
                        if (!Y.call(k, Z)) continue;
                        j = k[Z], f += this.attribute(j, w, $)
                    }
                }
                if (this.stream.write(f), X = O.children.length, M = X === 0 ? null : O.children[0], X === 0 || O.children.every(function(h) {
                        return (h.type === q.Text || h.type === q.Raw || h.type === q.CData) && h.value === ""
                    }))
                    if (w.allowEmpty) this.stream.write(">"), w.state = K.CloseTag, this.stream.write("</" + O.name + ">");
                    else w.state = K.CloseTag, this.stream.write(w.spaceBeforeSlash + "/>");
                else if (w.pretty && X === 1 && (M.type === q.Text || M.type === q.Raw || M.type === q.CData) && M.value != null) this.stream.write(">"), w.state = K.InsideTag, w.suppressPrettyCount++, G = !0, this.writeChildNode(M, w, $ + 1), w.suppressPrettyCount--, G = !1, w.state = K.CloseTag, this.stream.write("</" + O.name + ">");
                else {
                    this.stream.write(">" + this.endline(O, w, $)), w.state = K.InsideTag, N = O.children;
                    for (P = 0, D = N.length; P < D; P++) J = N[P], this.writeChildNode(J, w, $ + 1);
                    w.state = K.CloseTag, this.stream.write(this.indent(O, w, $) + "</" + O.name + ">")
                }
                return this.stream.write(this.endline(O, w, $)), w.state = K.None, this.closeNode(O, w, $)
            }
            processingInstruction(O, w, $) {
                return this.stream.write(super.processingInstruction(O, w, $))
            }
            raw(O, w, $) {
                return this.stream.write(super.raw(O, w, $))
            }
            text(O, w, $) {
                return this.stream.write(super.text(O, w, $))
            }
            dtdAttList(O, w, $) {
                return this.stream.write(super.dtdAttList(O, w, $))
            }
            dtdElement(O, w, $) {
                return this.stream.write(super.dtdElement(O, w, $))
            }
            dtdEntity(O, w, $) {
                return this.stream.write(super.dtdEntity(O, w, $))
            }
            dtdNotation(O, w, $) {
                return this.stream.write(super.dtdNotation(O, w, $))
            }
        }
    }).call(AAK)
})
// @from(Ln 336404, Col 4)
jAK = p(($AK, O96) => {
    (function() {
        var q, K, _, z, Y, A, O, w, $;
        ({
            assign: w,
            isFunction: $
        } = bl()), _ = f17(), z = k17(), Y = YAK(), O = ZF8(), A = wAK(), q = yM(), K = L48(), $AK.create = function(j, H, J, X) {
            var M, P;
            if (j == null) throw Error("Root element needs a name.");
            if (X = w({}, H, J, X), M = new z(X), P = M.element(j), !X.headless) {
                if (M.declaration(X), X.pubID != null || X.sysID != null) M.dtd(X)
            }
            return P
        }, $AK.begin = function(j, H, J) {
            if ($(j))[H, J] = [j, H], j = {};
            if (H) return new Y(j, H, J);
            else return new z(j)
        }, $AK.stringWriter = function(j) {
            return new O(j)
        }, $AK.streamWriter = function(j, H) {
            return new A(j, H)
        }, $AK.implementation = new _, $AK.nodeType = q, $AK.writerState = K
    }).call($AK)
})
// @from(Ln 336428, Col 4)
XAK = p((I6Y) => {
    var HAK = Ah1(),
        R6Y = jAK();
    I6Y.build = b6Y;

    function S6Y(q) {
        function K(_) {
            return _ < 10 ? "0" + _ : _
        }
        return q.getUTCFullYear() + "-" + K(q.getUTCMonth() + 1) + "-" + K(q.getUTCDate()) + "T" + K(q.getUTCHours()) + ":" + K(q.getUTCMinutes()) + ":" + K(q.getUTCSeconds()) + "Z"
    }
    var C6Y = Object.prototype.toString;

    function JAK(q) {
        var K = C6Y.call(q).match(/\[object (.*)\]/);
        return K ? K[1] : K
    }

    function b6Y(q, K) {
        var _ = {
                version: "1.0",
                encoding: "UTF-8"
            },
            z = {
                pubid: "-//Apple//DTD PLIST 1.0//EN",
                sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
            },
            Y = R6Y.create("plist");
        if (Y.dec(_.version, _.encoding, _.standalone), Y.dtd(z.pubid, z.sysid), Y.att("version", "1.0"), N17(q, Y), !K) K = {};
        return K.pretty = K.pretty !== !1, Y.end(K)
    }

    function N17(q, K) {
        var _, z, Y, A = JAK(q);
        if (A == "Undefined") return;
        else if (Array.isArray(q)) {
            K = K.ele("array");
            for (z = 0; z < q.length; z++) N17(q[z], K)
        } else if (Buffer.isBuffer(q)) K.ele("data").raw(q.toString("base64"));
        else if (A == "Object") {
            K = K.ele("dict");
            for (Y in q)
                if (q.hasOwnProperty(Y)) K.ele("key").txt(Y), N17(q[Y], K)
        } else if (A == "Number") _ = q % 1 === 0 ? "integer" : "real", K.ele(_).txt(q.toString());
        else if (A == "BigInt") K.ele("integer").txt(q);
        else if (A == "Date") K.ele("date").txt(S6Y(new Date(q)));
        else if (A == "Boolean") K.ele(q ? "true" : "false");
        else if (A == "String") K.ele("string").txt(q);
        else if (A == "ArrayBuffer") K.ele("data").raw(HAK.fromByteArray(q));
        else if (q && q.buffer && JAK(q.buffer) == "ArrayBuffer") K.ele("data").raw(HAK.fromByteArray(new Uint8Array(q.buffer), K));
        else if (A === "Null") K.ele("null").txt("")
    }
})
// @from(Ln 336481, Col 4)
WAK = p((E17) => {
    var MAK = lzK();
    Object.keys(MAK).forEach(function(q) {
        E17[q] = MAK[q]
    });
    var PAK = XAK();
    Object.keys(PAK).forEach(function(q) {
        E17[q] = PAK[q]
    })
})
// @from(Ln 336491, Col 0)
async function Il(q, K) {
    let z = H8().preferredNotifChannel;
    await lx(q);
    let Y = await u6Y(z, q, K);
    d("tengu_notification_method_used", {
        configured_channel: z,
        method_used: Y,
        term: X7.terminal
    })
}
// @from(Ln 336501, Col 0)
async function u6Y(q, K, _) {
    let z = K.title || DAK;
    try {
        switch (q) {
            case "auto":
                return m6Y(K, _);
            case "iterm2":
                return _.notifyITerm2(K), "iterm2";
            case "iterm2_with_bell":
                return _.notifyITerm2(K), _.notifyBell(), "iterm2_with_bell";
            case "kitty":
                return _.notifyKitty({
                    ...K,
                    title: z,
                    id: ZAK()
                }), "kitty";
            case "ghostty":
                return _.notifyGhostty({
                    ...K,
                    title: z
                }), "ghostty";
            case "terminal_bell":
                return _.notifyBell(), "terminal_bell";
            case "notifications_disabled":
                return "disabled";
            default:
                return "none"
        }
    } catch {
        return "error"
    }
}
// @from(Ln 336533, Col 0)
async function m6Y(q, K) {
    let _ = q.title || DAK;
    switch (X7.terminal) {
        case "Apple_Terminal": {
            if (await B6Y()) return K.notifyBell(), "terminal_bell";
            return "no_method_available"
        }
        case "iTerm.app":
            return K.notifyITerm2(q), "iterm2";
        case "kitty":
            return K.notifyKitty({
                ...q,
                title: _,
                id: ZAK()
            }), "kitty";
        case "ghostty":
            return K.notifyGhostty({
                ...q,
                title: _
            }), "ghostty";
        default:
            return "no_method_available"
    }
}
// @from(Ln 336558, Col 0)
function ZAK() {
    return Math.floor(Math.random() * 1e4)
}
// @from(Ln 336561, Col 0)
async function B6Y() {
    try {
        if (X7.terminal !== "Apple_Terminal") return !1;
        let K = (await w1("osascript", ["-e", 'tell application "Terminal" to name of current settings of front window'])).stdout.trim();
        if (!K) return !1;
        let _ = await w1("defaults", ["export", "com.apple.Terminal", "-"]);
        if (_.code !== 0) return !1;
        let O = (await Promise.resolve().then(() => K6(WAK(), 1))).parse(_.stdout)?.["Window Settings"]?.[K];
        if (!O) return !1;
        return O.Bell === !1
    } catch (q) {
        return j6(q), !1
    }
}
// @from(Ln 336575, Col 4)
DAK = "Claude Code"
// @from(Ln 336576, Col 4)
h48 = L(() => {
    h1();
    D_();
    Q4();
    K9();
    U8();
    C8()
})
// @from(Ln 336585, Col 0)
function LX6(q) {
    let K = s(38),
        {
            steps: _,
            initialData: z,
            onComplete: Y,
            onCancel: A,
            children: O,
            title: w,
            showStepCounter: $
        } = q,
        j;
    if (K[0] !== z) j = z === void 0 ? {} : z, K[0] = z, K[1] = j;
    else j = K[1];
    let H = j,
        J = $ === void 0 ? !0 : $,
        [X, M] = nx.useState(0),
        [P, W] = nx.useState(H),
        [D, Z] = nx.useState(!1),
        G;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) G = [], K[2] = G;
    else G = K[2];
    let [f, v] = nx.useState(G);
    $3();
    let V, k;
    if (K[3] !== D || K[4] !== Y || K[5] !== P) V = () => {
        if (D) v([]), Y(P)
    }, k = [D, P, Y], K[3] = D, K[4] = Y, K[5] = P, K[6] = V, K[7] = k;
    else V = K[6], k = K[7];
    nx.useEffect(V, k);
    let N;
    if (K[8] !== X || K[9] !== f || K[10] !== _.length) N = () => {
        if (X < _.length - 1) {
            if (f.length > 0) v((A6) => [...A6, X]);
            M(g6Y)
        } else Z(!0)
    }, K[8] = X, K[9] = f, K[10] = _.length, K[11] = N;
    else N = K[11];
    let R = N,
        h;
    if (K[12] !== X || K[13] !== f || K[14] !== A) h = () => {
        if (f.length > 0) {
            let A6 = f[f.length - 1];
            if (A6 !== void 0) v(F6Y), M(A6)
        } else if (X > 0) M(p6Y);
        else if (A) A()
    }, K[12] = X, K[13] = f, K[14] = A, K[15] = h;
    else h = K[15];
    let C = h,
        x;
    if (K[16] !== X || K[17] !== _.length) x = (A6) => {
        if (A6 >= 0 && A6 < _.length) v((e) => [...e, X]), M(A6)
    }, K[16] = X, K[17] = _.length, K[18] = x;
    else x = K[18];
    let B = x,
        m;
    if (K[19] !== A) m = () => {
        if (v([]), A) A()
    }, K[19] = A, K[20] = m;
    else m = K[20];
    let S = m,
        F;
    if (K[21] === Symbol.for("react.memo_cache_sentinel")) F = (A6) => {
        W((e) => ({
            ...e,
            ...A6
        }))
    }, K[21] = F;
    else F = K[21];
    let U = F,
        g;
    if (K[22] !== S || K[23] !== X || K[24] !== C || K[25] !== R || K[26] !== B || K[27] !== J || K[28] !== _.length || K[29] !== w || K[30] !== P) g = {
        currentStepIndex: X,
        totalSteps: _.length,
        wizardData: P,
        setWizardData: W,
        updateWizardData: U,
        goNext: R,
        goBack: C,
        goToStep: B,
        cancel: S,
        title: w,
        showStepCounter: J
    }, K[22] = S, K[23] = X, K[24] = C, K[25] = R, K[26] = B, K[27] = J, K[28] = _.length, K[29] = w, K[30] = P, K[31] = g;
    else g = K[31];
    let c = g,
        n = _[X];
    if (!n || D) return null;
    let l;
    if (K[32] !== n || K[33] !== O) l = O || nx.default.createElement(n, null), K[32] = n, K[33] = O, K[34] = l;
    else l = K[34];
    let z6;
    if (K[35] !== c || K[36] !== l) z6 = nx.default.createElement(y17.Provider, {
        value: c
    }, l), K[35] = c, K[36] = l, K[37] = z6;
    else z6 = K[37];
    return z6
}
// @from(Ln 336684, Col 0)
function p6Y(q) {
    return q - 1
}
// @from(Ln 336688, Col 0)
function F6Y(q) {
    return q.slice(0, -1)
}
// @from(Ln 336692, Col 0)
function g6Y(q) {
    return q + 1
}
// @from(Ln 336695, Col 4)
nx
// @from(Ln 336695, Col 8)
y17
// @from(Ln 336696, Col 4)
L17 = L(() => {
    o6();
    C$();
    nx = K6(P6(), 1), y17 = nx.createContext(null)
})
// @from(Ln 336702, Col 0)
function QK() {
    let q = fAK.useContext(y17);
    if (!q) throw Error("useWizard must be used within a WizardProvider");
    return q
}
// @from(Ln 336707, Col 4)
fAK
// @from(Ln 336708, Col 4)
h17 = L(() => {
    L17();
    fAK = K6(P6(), 1)
})
// @from(Ln 336713, Col 0)
function R17({
    instructions: q = hX6.default.createElement(z1, null, hX6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), hX6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), hX6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))
}) {
    let K = $3();
    return hX6.default.createElement(u, {
        marginLeft: 3,
        marginTop: 1
    }, hX6.default.createElement(T, {
        dimColor: !0
    }, K.pending ? `Press ${K.keyName} again to exit` : q))
}
// @from(Ln 336738, Col 4)
hX6
// @from(Ln 336739, Col 4)
S17 = L(() => {
    C$();
    g6();
    bK();
    Nq();
    u7();
    hX6 = K6(P6(), 1)
})
// @from(Ln 336748, Col 0)
function HK(q) {
    let K = s(11),
        {
            title: _,
            color: z,
            children: Y,
            subtitle: A,
            footerText: O
        } = q,
        w = z === void 0 ? "suggestion" : z,
        {
            currentStepIndex: $,
            totalSteps: j,
            title: H,
            showStepCounter: J,
            goBack: X
        } = QK(),
        M = _ || H || "Wizard",
        P = J !== !1 ? ` (${$+1}/${j})` : "",
        W = `${M}${P}`,
        D;
    if (K[0] !== Y || K[1] !== w || K[2] !== X || K[3] !== A || K[4] !== W) D = R48.default.createElement(R1, {
        title: W,
        subtitle: A,
        onCancel: X,
        color: w,
        hideInputGuide: !0,
        isCancelActive: !1
    }, Y), K[0] = Y, K[1] = w, K[2] = X, K[3] = A, K[4] = W, K[5] = D;
    else D = K[5];
    let Z;
    if (K[6] !== O) Z = R48.default.createElement(R17, {
        instructions: O
    }), K[6] = O, K[7] = Z;
    else Z = K[7];
    let G;
    if (K[8] !== D || K[9] !== Z) G = R48.default.createElement(R48.default.Fragment, null, D, Z), K[8] = D, K[9] = Z, K[10] = G;
    else G = K[10];
    return G
}
// @from(Ln 336788, Col 4)
R48
// @from(Ln 336789, Col 4)
Kw = L(() => {
    o6();
    S4();
    h17();
    S17();
    R48 = K6(P6(), 1)
})
// @from(Ln 336796, Col 4)
xA = L(() => {
    h17();
    Kw();
    S17();
    L17()
})
// @from(Ln 336803, Col 0)
function GAK() {
    let q = s(15),
        {
            goBack: K,
            goNext: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = gy.useState(Y.accessKeyId ?? ""),
        [w, $] = gy.useState(A.length),
        [j, H] = gy.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let G = A.trim();
        if (!G) {
            H("Access key ID is required");
            return
        }
        H(null), z({
            accessKeyId: G
        }), _()
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = gy.default.createElement(z1, null, gy.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), gy.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W;
    if (q[6] !== w || q[7] !== M || q[8] !== A) W = gy.default.createElement(u, {
        marginTop: 1
    }, gy.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        placeholder: "AKIA…",
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[6] = w, q[7] = M, q[8] = A, q[9] = W;
    else W = q[9];
    let D;
    if (q[10] !== j) D = j && gy.default.createElement(u, {
        marginTop: 1
    }, gy.default.createElement(T, {
        color: "error"
    }, j)), q[10] = j, q[11] = D;
    else D = q[11];
    let Z;
    if (q[12] !== W || q[13] !== D) Z = gy.default.createElement(HK, {
        subtitle: "AWS access key ID",
        footerText: P
    }, gy.default.createElement(u, {
        flexDirection: "column"
    }, W, D)), q[12] = W, q[13] = D, q[14] = Z;
    else Z = q[14];
    return Z
}
// @from(Ln 336876, Col 4)
gy
// @from(Ln 336877, Col 4)
vAK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    gy = K6(P6(), 1)
})
// @from(Ln 336889, Col 4)
ut
// @from(Ln 336890, Col 4)
fF8 = L(() => {
    ut = {
        AUTH_METHOD: 0,
        PROFILE: 1,
        BEARER: 2,
        ACCESS_KEY_ID: 3,
        SECRET_KEY: 4,
        SESSION_TOKEN: 5,
        REGION: 6,
        VERIFY: 7,
        PIN_MODELS: 8,
        CONFIRM: 9
    }
})
// @from(Ln 336905, Col 0)
function TAK() {
    let q = s(12),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z
        } = QK(),
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        label: "AWS profile (SSO or named profile)",
        value: "profile"
    }, q[0] = Y;
    else Y = q[0];
    let A;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) A = {
        label: "Bedrock API key (bearer token)",
        value: "bearer"
    }, q[1] = A;
    else A = q[1];
    let O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = {
        label: "Access key + secret",
        value: "accessKey"
    }, q[2] = O;
    else O = q[2];
    let w;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) w = [Y, A, O, {
        label: "Use credentials already in my environment",
        value: "environment"
    }], q[3] = w;
    else w = q[3];
    let $ = w,
        j;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = {
        profile: ut.PROFILE,
        bearer: ut.BEARER,
        accessKey: ut.ACCESS_KEY_ID,
        environment: ut.REGION
    }, q[4] = j;
    else j = q[4];
    let H = j,
        J;
    if (q[5] !== _ || q[6] !== z) J = (W) => {
        let D = W;
        z({
            authMethod: D
        }), _(H[D])
    }, q[5] = _, q[6] = z, q[7] = J;
    else J = q[7];
    let X = J,
        M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = S48.default.createElement(T, {
        dimColor: !0
    }, "Claude Code uses the standard AWS credential chain. Pick the method you already use with the AWS CLI."), q[8] = M;
    else M = q[8];
    let P;
    if (q[9] !== K || q[10] !== X) P = S48.default.createElement(HK, {
        subtitle: "How do you authenticate to AWS?"
    }, S48.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, M, S48.default.createElement(A1, {
        options: $,
        onChange: X,
        onCancel: K
    }))), q[9] = K, q[10] = X, q[11] = P;
    else P = q[11];
    return P
}
// @from(Ln 336974, Col 4)
S48
// @from(Ln 336975, Col 4)
VAK = L(() => {
    o6();
    g6();
    gK();
    xA();
    Kw();
    fF8();
    S48 = K6(P6(), 1)
})
// @from(Ln 336985, Col 0)
function kAK() {
    let q = s(17),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = fT.useState(Y.bearerToken ?? ""),
        [w, $] = fT.useState(A.length),
        [j, H] = fT.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let v = A.trim();
        if (!v) {
            H("API key is required");
            return
        }
        H(null), z({
            bearerToken: v
        }), _(ut.REGION)
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = fT.default.createElement(z1, null, fT.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), fT.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W, D;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = fT.default.createElement(T, null, "Paste your Bedrock API key."), D = fT.default.createElement(T, {
        dimColor: !0
    }, "Generate one in the AWS console under Bedrock → API keys."), q[6] = W, q[7] = D;
    else W = q[6], D = q[7];
    let Z;
    if (q[8] !== w || q[9] !== M || q[10] !== A) Z = fT.default.createElement(u, {
        marginTop: 1
    }, fT.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        placeholder: "bedrock-api-key-…",
        mask: "*",
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[8] = w, q[9] = M, q[10] = A, q[11] = Z;
    else Z = q[11];
    let G;
    if (q[12] !== j) G = j && fT.default.createElement(u, {
        marginTop: 1
    }, fT.default.createElement(T, {
        color: "error"
    }, j)), q[12] = j, q[13] = G;
    else G = q[13];
    let f;
    if (q[14] !== Z || q[15] !== G) f = fT.default.createElement(HK, {
        subtitle: "Bedrock API key",
        footerText: P
    }, fT.default.createElement(u, {
        flexDirection: "column"
    }, W, D, Z, G)), q[14] = Z, q[15] = G, q[16] = f;
    else f = q[16];
    return f
}
// @from(Ln 337064, Col 4)
fT
// @from(Ln 337065, Col 4)
NAK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    fF8();
    fT = K6(P6(), 1)
})
// @from(Ln 337079, Col 0)
function U6Y(q) {
    let K = {
        CLAUDE_CODE_USE_BEDROCK: "1",
        CLAUDE_CODE_USE_VERTEX: void 0,
        CLAUDE_CODE_USE_FOUNDRY: void 0,
        CLAUDE_CODE_USE_ANTHROPIC_AWS: void 0,
        AWS_REGION: q.region,
        AWS_PROFILE: void 0,
        AWS_BEARER_TOKEN_BEDROCK: void 0,
        AWS_ACCESS_KEY_ID: void 0,
        AWS_SECRET_ACCESS_KEY: void 0,
        AWS_SESSION_TOKEN: void 0,
        ANTHROPIC_DEFAULT_SONNET_MODEL: void 0,
        ANTHROPIC_DEFAULT_OPUS_MODEL: void 0,
        ANTHROPIC_DEFAULT_HAIKU_MODEL: void 0,
        ANTHROPIC_SMALL_FAST_MODEL: void 0
    };
    switch (q.authMethod) {
        case "profile":
            K.AWS_PROFILE = q.awsProfile;
            break;
        case "bearer":
            K.AWS_BEARER_TOKEN_BEDROCK = q.bearerToken;
            break;
        case "accessKey":
            if (K.AWS_ACCESS_KEY_ID = q.accessKeyId, K.AWS_SECRET_ACCESS_KEY = q.secretAccessKey, q.sessionToken) K.AWS_SESSION_TOKEN = q.sessionToken;
            break;
        case "environment":
        case void 0:
            break
    }
    if (q.pinSonnet) K.ANTHROPIC_DEFAULT_SONNET_MODEL = q.pinSonnet;
    if (q.pinOpus) K.ANTHROPIC_DEFAULT_OPUS_MODEL = q.pinOpus;
    if (q.pinHaiku) K.ANTHROPIC_DEFAULT_HAIKU_MODEL = q.pinHaiku;
    return K
}
// @from(Ln 337116, Col 0)
function EAK(q) {
    let K = s(33),
        {
            onComplete: _
        } = q,
        {
            goBack: z,
            wizardData: Y
        } = QK(),
        [A, O] = Uy.useState(null),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = DJ8(Ww("userSettings") ?? "~/.claude/settings.json"), K[0] = w;
    else w = K[0];
    let $ = w,
        j;
    if (K[1] !== Y) j = U6Y(Y), K[1] = Y, K[2] = j;
    else j = K[2];
    let H = j,
        J;
    if (K[3] !== H) J = Object.entries(H).filter(c6Y), K[3] = H, K[4] = J;
    else J = K[4];
    let X = J,
        M;
    if (K[5] !== H || K[6] !== _ || K[7] !== Y.authMethod || K[8] !== Y.awsProfile || K[9] !== Y.pinHaiku || K[10] !== Y.pinOpus || K[11] !== Y.pinSonnet || K[12] !== Y.verifiedIdentity) M = () => {
        let {
            error: N
        } = P7("userSettings", {
            env: H
        });
        if (N) {
            O(N.message);
            return
        }
        d("tengu_bedrock_setup_complete", {
            auth_method: Y.authMethod,
            pinned_models: String(Boolean(Y.pinSonnet || Y.pinOpus || Y.pinHaiku)),
            verified: String(Boolean(Y.verifiedIdentity))
        }), _(`Bedrock configuration saved to ${$}.${Y.authMethod==="profile"?` When your SSO session expires (typically 8 hours), run \`aws sso login --profile ${Y.awsProfile}\` — Claude Code picks up refreshed credentials automatically.`:""}`)
    }, K[5] = H, K[6] = _, K[7] = Y.authMethod, K[8] = Y.awsProfile, K[9] = Y.pinHaiku, K[10] = Y.pinOpus, K[11] = Y.pinSonnet, K[12] = Y.verifiedIdentity, K[13] = M;
    else M = K[13];
    let P = M,
        W;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) W = Uy.default.createElement(T, null, "These will be written to ", $, " under env:"), K[14] = W;
    else W = K[14];
    let D;
    if (K[15] !== X) D = Uy.default.createElement(u, {
        flexDirection: "column"
    }, X.map(d6Y)), K[15] = X, K[16] = D;
    else D = K[16];
    let Z;
    if (K[17] !== Y.verifiedIdentity) Z = Y.verifiedIdentity && Uy.default.createElement(T, {
        dimColor: !0
    }, Uy.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "Verified as ", Y.verifiedIdentity), K[17] = Y.verifiedIdentity, K[18] = Z;
    else Z = K[18];
    let G;
    if (K[19] !== A) G = A && Uy.default.createElement(T, {
        color: "error"
    }, A), K[19] = A, K[20] = G;
    else G = K[20];
    let f;
    if (K[21] === Symbol.for("react.memo_cache_sentinel")) f = [{
        label: "Save",
        value: "save"
    }, {
        label: "Cancel",
        value: "cancel"
    }], K[21] = f;
    else f = K[21];
    let v;
    if (K[22] !== z || K[23] !== P) v = (N) => {
        if (N === "save") P();
        else z()
    }, K[22] = z, K[23] = P, K[24] = v;
    else v = K[24];
    let V;
    if (K[25] !== z || K[26] !== v) V = Uy.default.createElement(A1, {
        options: f,
        onChange: v,
        onCancel: z
    }), K[25] = z, K[26] = v, K[27] = V;
    else V = K[27];
    let k;
    if (K[28] !== V || K[29] !== D || K[30] !== Z || K[31] !== G) k = Uy.default.createElement(HK, {
        subtitle: "Confirm and save"
    }, Uy.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, W, D, Z, G, V)), K[28] = V, K[29] = D, K[30] = Z, K[31] = G, K[32] = k;
    else k = K[32];
    return k
}
// @from(Ln 337211, Col 0)
function d6Y(q) {
    let [K, _] = q;
    return Uy.default.createElement(T, {
        key: K
    }, "  ", Uy.default.createElement(T, {
        color: "suggestion"
    }, K), " =", " ", Q6Y.has(K) ? Uy.default.createElement(T, {
        dimColor: !0
    }, "(hidden)") : _)
}
// @from(Ln 337222, Col 0)
function c6Y(q) {
    return q[1] !== void 0
}
// @from(Ln 337225, Col 4)
Uy
// @from(Ln 337225, Col 8)
Q6Y
// @from(Ln 337226, Col 4)
yAK = L(() => {
    o6();
    g6();
    C8();
    b9();
    a1();
    gK();
    Y2();
    xA();
    Kw();
    Uy = K6(P6(), 1);
    Q6Y = new Set(["AWS_BEARER_TOKEN_BEDROCK", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"])
})
// @from(Ln 337240, Col 0)
function w96() {
    let q = new Date,
        K = String(q.getHours()).padStart(2, "0"),
        _ = String(q.getMinutes()).padStart(2, "0"),
        z = String(q.getSeconds()).padStart(2, "0");
    return `${K}:${_}:${z}`
}
// @from(Ln 337248, Col 0)
function C48(q, K) {
    return `${$U1(void 0,K)}/code?environment=${q}`
}
// @from(Ln 337252, Col 0)
function RAK(q, K) {
    let _ = K + 20;
    return K + 10 - q % _
}
// @from(Ln 337257, Col 0)
function GF8(q, K) {
    let _ = N1(q),
        z = K - 1,
        Y = K + 1;
    if (z >= _ || Y < 0) return {
        before: q,
        shimmer: "",
        after: ""
    };
    let A = Math.max(0, z),
        O = 0,
        w = "",
        $ = "",
        j = "";
    for (let {
            segment: H
        }
        of rH().segment(q)) {
        let J = N1(H);
        if (O + J <= A) w += H;
        else if (O > Y) j += H;
        else $ += H;
        O += J
    }
    return {
        before: w,
        shimmer: $,
        after: j
    }
}
// @from(Ln 337288, Col 0)
function vF8({
    error: q,
    connected: K,
    sessionActive: _,
    reconnecting: z
}) {
    if (q) return {
        label: "Remote Control failed",
        color: "error"
    };
    if (z) return {
        label: "Remote Control reconnecting",
        color: "warning"
    };
    if (_ || K) return {
        label: "Remote Control active",
        color: "success"
    };
    return {
        label: "Remote Control connecting…",
        color: "warning"
    }
}
// @from(Ln 337312, Col 0)
function TF8(q) {
    return `Code everywhere with the Claude app or ${q}`
}
// @from(Ln 337316, Col 0)
function VF8(q) {
    return `Continue coding in the Claude app or ${q}`
}
// @from(Ln 337320, Col 0)
function SAK(q, K) {
    return `\x1B]8;;${K}\x07${q}\x1B]8;;\x07`
}
// @from(Ln 337323, Col 4)
LAK = 30000
// @from(Ln 337324, Col 4)
hAK = 150
// @from(Ln 337325, Col 4)
kF8 = "Something went wrong, please try again"
// @from(Ln 337326, Col 4)
$96 = L(() => {
    n5();
    c7();
    IZ()
})
// @from(Ln 337331, Col 0)
class xl {
    activeOperations = new Set;
    lastUserActivityTime = 0;
    lastCLIRecordedTime;
    isCLIActive = !1;
    USER_ACTIVITY_TIMEOUT_MS = 5000;
    getNow;
    getActiveTimeCounter;
    static instance = null;
    constructor(q) {
        this.getNow = q?.getNow ?? (() => Date.now()), this.getActiveTimeCounter = q?.getActiveTimeCounter ?? _81, this.lastCLIRecordedTime = this.getNow()
    }
    static getInstance() {
        if (!xl.instance) xl.instance = new xl;
        return xl.instance
    }
    static resetInstance() {
        xl.instance = null
    }
    static createInstance(q) {
        return xl.instance = new xl(q), xl.instance
    }
    recordUserActivity() {
        if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
            let K = (this.getNow() - this.lastUserActivityTime) / 1000;
            if (K > 0) {
                let _ = this.getActiveTimeCounter();
                if (_) {
                    let z = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
                    if (K < z) _.add(K, {
                        type: "user"
                    })
                }
            }
        }
        this.lastUserActivityTime = this.getNow()
    }
    startCLIActivity(q) {
        if (this.activeOperations.has(q)) this.endCLIActivity(q);
        let K = this.activeOperations.size === 0;
        if (this.activeOperations.add(q), K) this.isCLIActive = !0, this.lastCLIRecordedTime = this.getNow()
    }
    endCLIActivity(q) {
        if (this.activeOperations.delete(q), this.activeOperations.size === 0) {
            let K = this.getNow(),
                _ = (K - this.lastCLIRecordedTime) / 1000;
            if (_ > 0) {
                let z = this.getActiveTimeCounter();
                if (z) z.add(_, {
                    type: "cli"
                })
            }
            this.lastCLIRecordedTime = K, this.isCLIActive = !1
        }
    }
    async trackOperation(q, K) {
        this.startCLIActivity(q);
        try {
            return await K()
        } finally {
            this.endCLIActivity(q)
        }
    }
    getActivityStates() {
        return {
            isUserActive: (this.getNow() - this.lastUserActivityTime) / 1000 < this.USER_ACTIVITY_TIMEOUT_MS / 1000,
            isCLIActive: this.isCLIActive,
            activeOperationCount: this.activeOperations.size
        }
    }
}
// @from(Ln 337402, Col 4)
mt
// @from(Ln 337403, Col 4)
C17 = L(() => {
    y8();
    mt = xl.getInstance()
})
// @from(Ln 337408, Col 0)
function b48(q, K) {
    let _ = parseInt(q.id, 10),
        z = parseInt(K.id, 10);
    if (!isNaN(_) && !isNaN(z)) return _ - z;
    return q.id.localeCompare(K.id)
}
// @from(Ln 337415, Col 0)
function NF8({
    tasks: q,
    isStandalone: K = !1
}) {
    let _ = M8((R) => R.teamContext),
        z = M8((R) => R.tasks),
        [, Y] = E5.useState(0),
        {
            rows: A,
            columns: O
        } = s1(),
        w = E5.useRef(new Map),
        $ = E5.useRef(null);
    if ($.current === null) $.current = new Set(q.filter((R) => R.status === "completed").map((R) => R.id));
    let j = A <= 10 ? 0 : Math.min(10, Math.max(3, A - 14)),
        H = new Set(q.filter((R) => R.status === "completed").map((R) => R.id)),
        J = Date.now();
    for (let R of H)
        if (!$.current.has(R)) w.current.set(R, J);
    for (let R of w.current.keys())
        if (!H.has(R)) w.current.delete(R);
    if ($.current = H, E5.useEffect(() => {
            if (w.current.size === 0) return;
            let R = Date.now(),
                h = 1 / 0;
            for (let x of w.current.values()) {
                let B = x + CAK;
                if (B > R && B < h) h = B
            }
            if (h === 1 / 0) return;
            let C = setTimeout((x) => x((B) => B + 1), h - R, Y);
            return () => clearTimeout(C)
        }, [q]), !kJ()) return null;
    if (q.length === 0) return null;
    let X = {};
    if (z4() && _?.teammates) {
        for (let R of Object.values(_.teammates))
            if (R.color) {
                let h = QP[R.color];
                if (h) X[R.name] = h
            }
    }
    let M = {},
        P = new Set;
    if (z4()) {
        for (let R of Object.values(z))
            if (EJ(R) && R.status === "running") {
                P.add(R.identity.agentName), P.add(R.identity.agentId);
                let h = R.progress?.recentActivities,
                    C = (h && kC6(h)) ?? R.progress?.lastActivity?.activityDescription;
                if (C) M[R.identity.agentName] = C, M[R.identity.agentId] = C
            }
    }
    let W = w7(q, (R) => R.status === "completed"),
        D = w7(q, (R) => R.status === "pending"),
        Z = q.length - W - D,
        G = new Set(q.filter((R) => R.status !== "completed").map((R) => R.id)),
        f = q.length > j,
        v, V;
    if (f) {
        let R = [],
            h = [];
        for (let m of q.filter((S) => S.status === "completed")) {
            let S = w.current.get(m.id);
            if (S && J - S < CAK) R.push(m);
            else h.push(m)
        }
        R.sort(b48), h.sort(b48);
        let C = q.filter((m) => m.status === "in_progress").sort(b48),
            x = q.filter((m) => m.status === "pending").sort((m, S) => {
                let F = m.blockedBy.some((g) => G.has(g)),
                    U = S.blockedBy.some((g) => G.has(g));
                if (F !== U) return F ? 1 : -1;
                return b48(m, S)
            }),
            B = [...R, ...C, ...x, ...h];
        v = B.slice(0, j), V = B.slice(j)
    } else v = [...q].sort(b48), V = [];
    let k = "";
    if (V.length > 0) {
        let R = [],
            h = w7(V, (B) => B.status === "pending"),
            C = w7(V, (B) => B.status === "in_progress"),
            x = w7(V, (B) => B.status === "completed");
        if (C > 0) R.push(`${C} in progress`);
        if (h > 0) R.push(`${h} pending`);
        if (x > 0) R.push(`${x} completed`);
        k = ` … +${R.join(", ")}`
    }
    let N = E5.createElement(E5.Fragment, null, v.map((R) => E5.createElement(n6Y, {
        key: R.id,
        task: R,
        ownerColor: R.owner ? X[R.owner] : void 0,
        openBlockers: R.blockedBy.filter((h) => G.has(h)),
        activity: R.owner ? M[R.owner] : void 0,
        ownerActive: R.owner ? P.has(R.owner) : !1,
        columns: O
    })), j > 0 && k && E5.createElement(T, {
        dimColor: !0
    }, k));
    if (K) return E5.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        marginLeft: 2
    }, E5.createElement(u, null, E5.createElement(T, {
        dimColor: !0
    }, E5.createElement(T, {
        bold: !0
    }, q.length), " tasks (", E5.createElement(T, {
        bold: !0
    }, W), " done, ", Z > 0 && E5.createElement(E5.Fragment, null, E5.createElement(T, {
        bold: !0
    }, Z), " in progress, "), E5.createElement(T, {
        bold: !0
    }, D), " open)")), N);
    return E5.createElement(u, {
        flexDirection: "column"
    }, N)
}
// @from(Ln 337535, Col 0)
function l6Y(q) {
    switch (q) {
        case "completed":
            return {
                icon: e6.tick, color: "success"
            };
        case "in_progress":
            return {
                icon: e6.squareSmallFilled, color: "claude"
            };
        case "pending":
            return {
                icon: e6.squareSmall, color: void 0
            }
    }
}
// @from(Ln 337552, Col 0)
function n6Y(q) {
    let K = s(37),
        {
            task: _,
            ownerColor: z,
            openBlockers: Y,
            activity: A,
            ownerActive: O,
            columns: w
        } = q,
        $ = _.status === "completed",
        j = _.status === "in_progress",
        H = Y.length > 0,
        J;
    if (K[0] !== _.status) J = l6Y(_.status), K[0] = _.status, K[1] = J;
    else J = K[1];
    let {
        icon: X,
        color: M
    } = J, P = j && !H && A, W = w >= 60 && _.owner && O, D;
    if (K[2] !== W || K[3] !== _.owner) D = W ? N1(` (@${_.owner})`) : 0, K[2] = W, K[3] = _.owner, K[4] = D;
    else D = K[4];
    let Z = D,
        G = Math.max(15, w - 15 - Z),
        f;
    if (K[5] !== G || K[6] !== _.subject) f = j4(_.subject, G), K[5] = G, K[6] = _.subject, K[7] = f;
    else f = K[7];
    let v = f,
        V = Math.max(15, w - 15),
        k;
    if (K[8] !== A || K[9] !== V) k = A ? j4(A, V) : void 0, K[8] = A, K[9] = V, K[10] = k;
    else k = K[10];
    let N = k,
        R;
    if (K[11] !== M || K[12] !== X) R = E5.createElement(T, {
        color: M
    }, X, " "), K[11] = M, K[12] = X, K[13] = R;
    else R = K[13];
    let h = $ || H,
        C;
    if (K[14] !== v || K[15] !== $ || K[16] !== j || K[17] !== h) C = E5.createElement(T, {
        bold: j,
        strikethrough: $,
        dimColor: h
    }, v), K[14] = v, K[15] = $, K[16] = j, K[17] = h, K[18] = C;
    else C = K[18];
    let x;
    if (K[19] !== z || K[20] !== W || K[21] !== _.owner) x = W && E5.createElement(T, {
        dimColor: !0
    }, " (", z ? E5.createElement(T, {
        color: z
    }, "@", _.owner) : `@${_.owner}`, ")"), K[19] = z, K[20] = W, K[21] = _.owner, K[22] = x;
    else x = K[22];
    let B;
    if (K[23] !== H || K[24] !== Y) B = H && E5.createElement(T, {
        dimColor: !0
    }, " ", e6.pointerSmall, " blocked by", " ", [...Y].sort(r6Y).map(i6Y).join(", ")), K[23] = H, K[24] = Y, K[25] = B;
    else B = K[25];
    let m;
    if (K[26] !== R || K[27] !== C || K[28] !== x || K[29] !== B) m = E5.createElement(u, null, R, C, x, B), K[26] = R, K[27] = C, K[28] = x, K[29] = B, K[30] = m;
    else m = K[30];
    let S;
    if (K[31] !== N || K[32] !== P) S = P && N && E5.createElement(u, null, E5.createElement(T, {
        dimColor: !0
    }, "  ", N, e6.ellipsis)), K[31] = N, K[32] = P, K[33] = S;
    else S = K[33];
    let F;
    if (K[34] !== m || K[35] !== S) F = E5.createElement(u, {
        flexDirection: "column"
    }, m, S), K[34] = m, K[35] = S, K[36] = F;
    else F = K[36];
    return F
}
// @from(Ln 337626, Col 0)
function i6Y(q) {
    return `#${q}`
}
// @from(Ln 337630, Col 0)
function r6Y(q, K) {
    return parseInt(q, 10) - parseInt(K, 10)
}
// @from(Ln 337633, Col 4)
E5
// @from(Ln 337633, Col 8)
CAK = 30000
// @from(Ln 337634, Col 4)
b17 = L(() => {
    o6();
    Qq();
    I4();
    n5();
    g6();
    N7();
    Uf();
    fO();
    Bt();
    c7();
    PX();
    dN6();
    E5 = K6(P6(), 1)
})
// @from(Ln 337652, Col 0)
class bAK {
    #q = void 0;
    #K = !1;
    #_ = null;
    #Y = null;
    #z = null;
    #w = null;
    #A = null;
    #$ = null;
    #H = l5();
    #j = 0;
    #O = !1;
    getSnapshot = () => {
        return this.#K ? void 0 : this.#q
    };
    subscribe = (q) => {
        let K = this.#H.subscribe(q);
        if (this.#j++, !this.#O) this.#O = !0, this.#$ = YR4(this.#P), this.#J();
        let _ = !1;
        return () => {
            if (_) return;
            if (_ = !0, K(), this.#j--, this.#j === 0) this.#G()
        }
    };
    #X() {
        this.#H.emit()
    }
    #D(q) {
        if (q === this.#Y && this.#_ !== null) return;
        this.#_?.close(), this.#_ = null, this.#Y = q;
        try {
            this.#_ = o6Y(q, this.#P), this.#_.unref()
        } catch {}
    }
    #P = () => {
        if (this.#w) clearTimeout(this.#w);
        this.#w = setTimeout(() => void this.#J(), s6Y), this.#w.unref()
    };
    #J = async () => {
        let q = AT();
        this.#D(gp(q));
        let K = (await Qf(q)).filter((z) => !z.metadata?._internal);
        this.#q = K;
        let _ = K.some((z) => z.status !== "completed");
        if (_ || K.length === 0) this.#K = K.length === 0, this.#W();
        else if (this.#z === null && !this.#K) this.#z = setTimeout(this.#Z.bind(this, q), a6Y), this.#z.unref();
        if (this.#X(), this.#A) clearTimeout(this.#A), this.#A = null;
        if (_) this.#A = setTimeout(this.#P, t6Y), this.#A.unref()
    };
    #Z(q) {
        this.#z = null;
        let K = AT();
        if (K !== q) return;
        Qf(K).then(async (_) => {
            if (_.length > 0 && _.every((Y) => Y.status === "completed")) await xb8(K), this.#q = [], this.#K = !0;
            this.#X()
        })
    }
    #W() {
        if (this.#z) clearTimeout(this.#z), this.#z = null
    }
    #G() {
        if (this.#_?.close(), this.#_ = null, this.#Y = null, this.#$?.(), this.#$ = null, this.#W(), this.#w) clearTimeout(this.#w);
        if (this.#A) clearTimeout(this.#A);
        this.#w = null, this.#A = null, this.#O = !1
    }
}
// @from(Ln 337720, Col 0)
function q8Y() {
    return e6Y ??= new bAK
}
// @from(Ln 337724, Col 0)
function I48() {
    let q = M8((z) => z.teamContext),
        _ = kJ() && (!q || Sv(q)) ? q8Y() : null;
    return EF8.useSyncExternalStore(_ ? _.subscribe : _8Y, _ ? _.getSnapshot : z8Y)
}
// @from(Ln 337730, Col 0)
function IAK() {
    let q = I48(),
        K = R7(),
        _ = q === void 0;
    return EF8.useEffect(() => {
        if (!_) return;
        K((z) => {
            if (z.expandedView !== "tasks") return z;
            return {
                ...z,
                expandedView: "none"
            }
        })
    }, [_, K]), q
}
// @from(Ln 337745, Col 4)
EF8
// @from(Ln 337745, Col 9)
a6Y = 5000
// @from(Ln 337746, Col 4)
s6Y = 50
// @from(Ln 337747, Col 4)
t6Y = 5000
// @from(Ln 337748, Col 4)
e6Y = null
// @from(Ln 337749, Col 4)
K8Y = () => {}
// @from(Ln 337750, Col 4)
_8Y = () => K8Y
// @from(Ln 337751, Col 4)
z8Y = () => {
        return
    }
// @from(Ln 337754, Col 4)
yF8 = L(() => {
    N7();
    nH();
    PX();
    zY();
    EF8 = K6(P6(), 1)
})
// @from(Ln 337761, Col 4)
Y8Y
// @from(Ln 337762, Col 4)
xAK = L(() => {
    o6();
    g6();
    tB();
    Bd();
    Y8Y = K6(P6(), 1)
})
// @from(Ln 337770, Col 0)
function x48(q) {
    let K = s(75),
        {
            message: _,
            mode: z,
            messageColor: Y,
            glimmerIndex: A,
            flashOpacity: O,
            shimmerColor: w,
            stalledIntensity: $
        } = q,
        j = $ === void 0 ? 0 : $,
        [H] = Zq(),
        J, X, M;
    if (K[0] !== O || K[1] !== _ || K[2] !== Y || K[3] !== z || K[4] !== w || K[5] !== j || K[6] !== H) {
        M = Symbol.for("react.early_return_sentinel");
        q: {
            let C = DD(H),
                x;
            if (K[10] !== _) {
                x = [];
                for (let {
                        segment: S
                    }
                    of rH().segment(_)) x.push({
                    segment: S,
                    width: N1(S)
                });
                K[10] = _, K[11] = x
            } else x = K[11];
            let B;
            if (K[12] !== _) B = N1(_),
            K[12] = _,
            K[13] = B;
            else B = K[13];
            let m;
            if (K[14] !== x || K[15] !== B) m = {
                segments: x,
                messageWidth: B
            },
            K[14] = x,
            K[15] = B,
            K[16] = m;
            else m = K[16];
            if ({
                    segments: X,
                    messageWidth: J
                } = m, !_) {
                M = null;
                break q
            }
            if (j > 0) {
                let S = C[Y],
                    F = S ? t$6(S) : null;
                if (F) {
                    let l = $p(F, A8Y, j),
                        z6 = fR(l),
                        A6;
                    if (K[17] !== z6) A6 = B5.createElement(T, {
                        color: z6
                    }, " "), K[17] = z6, K[18] = A6;
                    else A6 = K[18];
                    M = B5.createElement(B5.Fragment, null, B5.createElement(T, {
                        color: z6
                    }, _), A6);
                    break q
                }
                let U = j > 0.5 ? "error" : Y,
                    g;
                if (K[19] !== U || K[20] !== _) g = B5.createElement(T, {
                    color: U
                }, _), K[19] = U, K[20] = _, K[21] = g;
                else g = K[21];
                let c;
                if (K[22] !== U) c = B5.createElement(T, {
                    color: U
                }, " "), K[22] = U, K[23] = c;
                else c = K[23];
                let n;
                if (K[24] !== g || K[25] !== c) n = B5.createElement(B5.Fragment, null, g, c), K[24] = g, K[25] = c, K[26] = n;
                else n = K[26];
                M = n;
                break q
            }
            if (z === "tool-use") {
                let S = C[Y],
                    F = C[w],
                    U = S ? t$6(S) : null,
                    g = F ? t$6(F) : null;
                if (U && g) {
                    let A6 = $p(U, g, O),
                        e = B5.createElement(T, {
                            color: fR(A6)
                        }, _),
                        i;
                    if (K[27] !== Y) i = B5.createElement(T, {
                        color: Y
                    }, " "), K[27] = Y, K[28] = i;
                    else i = K[28];
                    let O6;
                    if (K[29] !== e || K[30] !== i) O6 = B5.createElement(B5.Fragment, null, e, i), K[29] = e, K[30] = i, K[31] = O6;
                    else O6 = K[31];
                    M = O6;
                    break q
                }
                let c = O > 0.5 ? w : Y,
                    n;
                if (K[32] !== c || K[33] !== _) n = B5.createElement(T, {
                    color: c
                }, _), K[32] = c, K[33] = _, K[34] = n;
                else n = K[34];
                let l;
                if (K[35] !== Y) l = B5.createElement(T, {
                    color: Y
                }, " "), K[35] = Y, K[36] = l;
                else l = K[36];
                let z6;
                if (K[37] !== n || K[38] !== l) z6 = B5.createElement(B5.Fragment, null, n, l), K[37] = n, K[38] = l, K[39] = z6;
                else z6 = K[39];
                M = z6;
                break q
            }
        }
        K[0] = O, K[1] = _, K[2] = Y, K[3] = z, K[4] = w, K[5] = j, K[6] = H, K[7] = J, K[8] = X, K[9] = M
    } else J = K[7], X = K[8], M = K[9];
    if (M !== Symbol.for("react.early_return_sentinel")) return M;
    let P = A - 1,
        W = A + 1;
    if (P >= J || W < 0) {
        let C;
        if (K[40] !== _ || K[41] !== Y) C = B5.createElement(T, {
            color: Y
        }, _), K[40] = _, K[41] = Y, K[42] = C;
        else C = K[42];
        let x;
        if (K[43] !== Y) x = B5.createElement(T, {
            color: Y
        }, " "), K[43] = Y, K[44] = x;
        else x = K[44];
        let B;
        if (K[45] !== C || K[46] !== x) B = B5.createElement(B5.Fragment, null, C, x), K[45] = C, K[46] = x, K[47] = B;
        else B = K[47];
        return B
    }
    let D = Math.max(0, P),
        Z = 0,
        G = "",
        f = "",
        v = "";
    if (K[48] !== v || K[49] !== G || K[50] !== D || K[51] !== Z || K[52] !== X || K[53] !== f || K[54] !== W) {
        for (let {
                segment: C,
                width: x
            }
            of X) {
            if (Z + x <= D) G = G + C;
            else if (Z > W) v = v + C;
            else f = f + C;
            Z = Z + x
        }
        K[48] = v, K[49] = G, K[50] = D, K[51] = Z, K[52] = X, K[53] = f, K[54] = W, K[55] = G, K[56] = v, K[57] = f, K[58] = Z
    } else G = K[55], v = K[56], f = K[57], Z = K[58];
    let V;
    if (K[59] !== G || K[60] !== Y) V = G && B5.createElement(T, {
        color: Y
    }, G), K[59] = G, K[60] = Y, K[61] = V;
    else V = K[61];
    let k;
    if (K[62] !== f || K[63] !== w) k = B5.createElement(T, {
        color: w
    }, f), K[62] = f, K[63] = w, K[64] = k;
    else k = K[64];
    let N;
    if (K[65] !== v || K[66] !== Y) N = v && B5.createElement(T, {
        color: Y
    }, v), K[65] = v, K[66] = Y, K[67] = N;
    else N = K[67];
    let R;
    if (K[68] !== Y) R = B5.createElement(T, {
        color: Y
    }, " "), K[68] = Y, K[69] = R;
    else R = K[69];
    let h;
    if (K[70] !== V || K[71] !== k || K[72] !== N || K[73] !== R) h = B5.createElement(B5.Fragment, null, V, k, N, R), K[70] = V, K[71] = k, K[72] = N, K[73] = R, K[74] = h;
    else h = K[74];
    return h
}
// @from(Ln 337957, Col 4)
B5
// @from(Ln 337957, Col 8)
A8Y
// @from(Ln 337958, Col 4)
LF8 = L(() => {
    o6();
    n5();
    g6();
    IZ();
    tB();
    Bd();
    B5 = K6(P6(), 1), A8Y = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 337972, Col 0)
function j96(q) {
    let K = s(9),
        {
            frame: _,
            messageColor: z,
            stalledIntensity: Y,
            reducedMotion: A,
            time: O
        } = q,
        w = Y === void 0 ? 0 : Y,
        $ = A === void 0 ? !1 : A,
        j = O === void 0 ? 0 : O,
        [H] = Zq(),
        J = DD(H);
    if ($) {
        let P = Math.floor(j / (w8Y / 2)) % 2 === 1,
            W;
        if (K[0] !== P || K[1] !== z) W = qG.createElement(u, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, qG.createElement(T, {
            color: z,
            dimColor: P
        }, O8Y)), K[0] = P, K[1] = z, K[2] = W;
        else W = K[2];
        return W
    }
    let X = mAK[_ % mAK.length];
    if (w > 0) {
        let P = J[z],
            W = P ? t$6(P) : null;
        if (W) {
            let G = $p(W, $8Y, w);
            return qG.createElement(u, {
                flexWrap: "wrap",
                height: 1,
                width: 2
            }, qG.createElement(T, {
                color: fR(G)
            }, X))
        }
        let D = w > 0.5 ? "error" : z,
            Z;
        if (K[3] !== D || K[4] !== X) Z = qG.createElement(u, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, qG.createElement(T, {
            color: D
        }, X)), K[3] = D, K[4] = X, K[5] = Z;
        else Z = K[5];
        return Z
    }
    let M;
    if (K[6] !== z || K[7] !== X) M = qG.createElement(u, {
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, qG.createElement(T, {
        color: z
    }, X)), K[6] = z, K[7] = X, K[8] = M;
    else M = K[8];
    return M
}
// @from(Ln 338037, Col 4)
qG
// @from(Ln 338037, Col 8)
uAK
// @from(Ln 338037, Col 13)
mAK
// @from(Ln 338037, Col 18)
O8Y = "●"
// @from(Ln 338038, Col 4)
w8Y = 2000
// @from(Ln 338039, Col 4)
$8Y
// @from(Ln 338040, Col 4)
u48 = L(() => {
    o6();
    g6();
    tB();
    Bd();
    qG = K6(P6(), 1), uAK = bE6(), mAK = [...uAK, ...[...uAK].reverse()], $8Y = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 338052, Col 0)
function hF8(q, K, _) {
    let z = q === "requesting" ? 50 : 200,
        [Y, A] = _O(_ ? null : z),
        O = BAK.useMemo(() => N1(K), [K]);
    if (_) return [Y, -100];
    let w = Math.floor(A / z),
        $ = O + 20;
    if (q === "requesting") return [Y, w % $ - 10];
    return [Y, O + 10 - w % $]
}
// @from(Ln 338062, Col 4)
BAK
// @from(Ln 338063, Col 4)
RF8 = L(() => {
    n5();
    g6();
    BAK = K6(P6(), 1)
})
// @from(Ln 338069, Col 0)
function I17(q, K, _ = !1, z = !1) {
    let Y = m48.useRef(q),
        A = m48.useRef(K),
        O = m48.useRef(0),
        w = m48.useRef(q);
    if (K > A.current) Y.current = q, A.current = K, O.current = 0, w.current = q;
    let $;
    if (_) $ = 0, Y.current = q;
    else $ = q - Y.current;
    let j = $ > 1e4 && !_,
        H = j ? Math.min(($ - 1e4) / 1e4, 1) : 0;
    if (!z && (H > 0 || O.current > 0)) {
        let X = q - w.current;
        if (X >= 50) {
            let M = Math.floor(X / 50),
                P = O.current;
            for (let W = 0; W < M; W++) {
                let D = H - P;
                if (Math.abs(D) < 0.01) {
                    P = H;
                    break
                }
                P += D * 0.1
            }
            O.current = P, w.current = q
        }
    } else O.current = H, w.current = q;
    let J = z ? H : O.current;
    return {
        isStalled: j,
        stalledIntensity: J
    }
}
// @from(Ln 338102, Col 4)
m48
// @from(Ln 338103, Col 4)
x17 = L(() => {
    m48 = K6(P6(), 1)
})
// @from(Ln 338106, Col 4)
pAK = L(() => {
    xAK();
    LF8();
    Is6();
    u48();
    RF8();
    x17();
    Bd()
})
// @from(Ln 338116, Col 0)
function FAK() {
    return u17.useSyncExternalStore(AS.subscribe, AS.getState)
}
// @from(Ln 338120, Col 0)
function gAK() {
    return u17.useSyncExternalStore(AS.subscribe, () => AS.getState().mode === "thinking")
}
// @from(Ln 338124, Col 0)
function B48(q) {
    AS.setState((K) => K.mode === q ? K : {
        ...K,
        mode: q
    })
}
// @from(Ln 338131, Col 0)
function m17(q) {
    AS.setState((K) => K.overrideMessage === q ? K : {
        ...K,
        overrideMessage: q
    })
}
// @from(Ln 338138, Col 0)
function UAK(q, K) {
    AS.setState((_) => _.overrideColor === q && _.overrideShimmerColor === K ? _ : {
        ..._,
        overrideColor: q,
        overrideShimmerColor: K
    })
}
// @from(Ln 338146, Col 0)
function B17() {
    AS.setState((q) => q.overrideMessage === null && q.overrideColor === null && q.overrideShimmerColor === null ? q : {
        ...q,
        overrideMessage: null,
        overrideColor: null,
        overrideShimmerColor: null
    })
}
// @from(Ln 338154, Col 4)
u17
// @from(Ln 338154, Col 9)
j8Y
// @from(Ln 338154, Col 14)
AS
// @from(Ln 338155, Col 4)
p48 = L(() => {
    u17 = K6(P6(), 1), j8Y = {
        mode: "responding",
        overrideMessage: null,
        overrideColor: null,
        overrideShimmerColor: null
    }, AS = rE(j8Y)
})
// @from(Ln 338164, Col 0)
function KG(q) {
    if (!q) return H8Y;
    let K = QP[q];
    if (K) return K;
    return `ansi:${q}`
}
// @from(Ln 338170, Col 4)
H8Y = "cyan_FOR_SUBAGENTS_ONLY"
// @from(Ln 338171, Col 4)
pt = L(() => {
    Uf()
})
// @from(Ln 338175, Col 0)
function cAK({
    mode: q,
    reducedMotion: K,
    hasActiveTools: _,
    responseLengthRef: z,
    message: Y,
    messageColor: A,
    shimmerColor: O,
    overrideColor: w,
    loadingStartTimeRef: $,
    totalPausedMsRef: j,
    pauseStartTimeRef: H,
    spinnerSuffix: J,
    verbose: X,
    columns: M,
    hasRunningTeammates: P,
    teammateTokens: W,
    foregroundedTeammate: D,
    leaderIsIdle: Z = !1,
    thinkingStatus: G,
    effortSuffix: f
}) {
    let [v, V] = _O(K ? null : 50), k = Date.now(), N = H.current !== null ? H.current - $.current - j.current : k - $.current - j.current, R = k - N, h = F48.useRef(R);
    if (!P || R < h.current) h.current = R;
    let C = z.current,
        {
            isStalled: x,
            stalledIntensity: B
        } = I17(V, C, _ || Z || q === "thinking", K),
        m = K ? 0 : Math.floor(V / 120),
        S = q === "requesting" ? 50 : 200,
        F = F48.useMemo(() => N1(Y), [Y]),
        U = F + 20,
        g = Math.floor(V / S),
        c = K ? -100 : x ? -100 : q === "requesting" ? g % U - 10 : F + 10 - g % U,
        n = K ? 0 : q === "tool-use" ? (Math.sin(V / 1000 * Math.PI) + 1) / 2 : 0,
        l = F48.useRef(C);
    if (K) l.current = C;
    else {
        let N8 = C - l.current;
        if (N8 > 0) {
            let R6;
            if (N8 < 70) R6 = 3;
            else if (N8 < 200) R6 = Math.max(8, Math.ceil(N8 * 0.15));
            else R6 = 50;
            l.current = Math.min(l.current + R6, C)
        }
    }
    let z6 = l.current,
        A6 = Math.round(z6 / 4),
        e = P ? Math.max(N, k - h.current) : N,
        i = C5(e),
        O6 = N1(i),
        J6 = D && !D.isIdle ? D.progress?.tokenCount ?? 0 : A6 + W,
        $6 = iK(J6),
        H6 = P ? `${$6} tokens` : `${e6.arrowDown} ${$6} tokens`,
        q6 = N1(H6),
        o = G === "thinking" ? `thinking${f}` : typeof G === "number" ? `thought for ${Math.max(1,Math.round(G/1000))}s` : null,
        _6 = o ? N1(o) : 0,
        r = F + 2,
        t = J8Y,
        Y6 = G !== null,
        X6 = X || P || e > X8Y,
        M6 = M - r - 5,
        W6 = Y6 && M6 > _6;
    if (!W6 && Y6 && G === "thinking" && f) {
        if (M6 > QAK) o = "thinking", _6 = QAK, W6 = !0
    }
    let V6 = W6 ? _6 + t : 0,
        f6 = X6 && M6 > V6 + O6,
        G6 = V6 + (f6 ? O6 + t : 0),
        k6 = X6 && J6 > 0 && M6 > G6 + q6,
        T6 = W6 && G === "thinking" && !J && !f6 && !k6 && !0,
        v6 = (V - dAK) / 1000,
        L6 = V < dAK ? 0 : (Math.sin(v6 * Math.PI * 2 / W8Y) + 1) / 2,
        y6 = fR($p(M8Y, P8Y, L6)),
        c6 = [...J ? [p5.createElement(T, {
            dimColor: !0,
            key: "suffix"
        }, J)] : [], ...f6 ? [p5.createElement(T, {
            dimColor: !0,
            key: "elapsedTime"
        }, i)] : [], ...k6 ? [p5.createElement(u, {
            flexDirection: "row",
            key: "tokens"
        }, !P && p5.createElement(D8Y, {
            mode: q
        }), p5.createElement(T, {
            dimColor: !0
        }, $6, " tokens"))] : [], ...W6 && o ? [G === "thinking" && !K ? p5.createElement(T, {
            key: "thinking",
            color: y6
        }, T6 ? `(${o})` : o) : p5.createElement(T, {
            dimColor: !0,
            key: "thinking"
        }, o)] : []],
        Z8 = D && !D.isIdle ? p5.createElement(p5.Fragment, null, p5.createElement(T, {
            dimColor: !0
        }, "(", p5.createElement(A8, {
            chord: "escape",
            action: "interrupt",
            format: {
                keyCase: "lower"
            }
        }), " "), p5.createElement(T, {
            color: KG(D.identity.color)
        }, D.identity.agentName), p5.createElement(T, {
            dimColor: !0
        }, ")")) : !D && c6.length > 0 ? T6 ? p5.createElement(z1, null, c6) : p5.createElement(p5.Fragment, null, p5.createElement(T, {
            dimColor: !0
        }, "("), p5.createElement(z1, null, c6), p5.createElement(T, {
            dimColor: !0
        }, ")")) : null;
    return p5.createElement(u, {
        ref: v,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 1,
        width: "100%"
    }, p5.createElement(j96, {
        frame: m,
        messageColor: A,
        stalledIntensity: w ? 0 : B,
        reducedMotion: K,
        time: V
    }), p5.createElement(x48, {
        message: Y,
        mode: q,
        messageColor: A,
        glimmerIndex: c,
        flashOpacity: n,
        shimmerColor: O,
        stalledIntensity: w ? 0 : B
    }), Z8)
}
// @from(Ln 338311, Col 0)
function D8Y(q) {
    let K = s(2),
        {
            mode: _
        } = q;
    switch (_) {
        case "tool-input":
        case "tool-use":
        case "responding":
        case "thinking": {
            let z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = p5.createElement(u, {
                width: 2
            }, p5.createElement(T, {
                dimColor: !0
            }, e6.arrowDown)), K[0] = z;
            else z = K[0];
            return z
        }
        case "requesting": {
            let z;
            if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = p5.createElement(u, {
                width: 2
            }, p5.createElement(T, {
                dimColor: !0
            }, e6.arrowUp)), K[1] = z;
            else z = K[1];
            return z
        }
    }
}
// @from(Ln 338342, Col 4)
p5
// @from(Ln 338342, Col 8)
F48
// @from(Ln 338342, Col 13)
J8Y
// @from(Ln 338342, Col 18)
QAK
// @from(Ln 338342, Col 23)
X8Y = 16000
// @from(Ln 338343, Col 4)
M8Y
// @from(Ln 338343, Col 9)
P8Y
// @from(Ln 338343, Col 14)
dAK = 3000
// @from(Ln 338344, Col 4)
W8Y = 2
// @from(Ln 338345, Col 4)
lAK = L(() => {
    o6();
    Qq();
    n5();
    g6();
    c7();
    pt();
    Nq();
    u7();
    LF8();
    u48();
    x17();
    Bd();
    p5 = K6(P6(), 1), F48 = K6(P6(), 1), J8Y = N1(" · "), QAK = N1("thinking"), M8Y = {
        r: 153,
        g: 153,
        b: 153
    }, P8Y = {
        r: 185,
        g: 185,
        b: 185
    }
})
// @from(Ln 338369, Col 0)
function yH(q) {
    if (q.status !== "running" && q.status !== "pending") return !1;
    if ("isBackgrounded" in q && q.isBackgrounded === !1) return !1;
    return !0
}
// @from(Ln 338375, Col 0)
function RF(q, K, _ = 1000, z = 0, Y) {
    let A = () => C5(Math.max(0, (Y ?? Date.now()) - q - z)),
        O = SF8.useCallback((w) => {
            if (!K) return () => {};
            let $ = setInterval(w, _);
            return () => clearInterval($)
        }, [K, _]);
    return SF8.useSyncExternalStore(O, A, A)
}
// @from(Ln 338384, Col 4)
SF8
// @from(Ln 338385, Col 4)
NC6 = L(() => {
    c7();
    SF8 = K6(P6(), 1)
})
// @from(Ln 338389, Col 4)
g48 = "shift + ↑/↓ to select"
// @from(Ln 338391, Col 0)
function Z8Y(q) {
    if (!q?.length) return [];
    let K = [],
        _ = 80;
    for (let z = q.length - 1; z >= 0 && K.length < 3; z--) {
        let Y = q[z];
        if (!Y || Y.type !== "user" && Y.type !== "assistant" || !Y.message?.content?.length) continue;
        let A = Y.message.content;
        for (let O of A) {
            if (K.length >= 3) break;
            if (!O || typeof O !== "object") continue;
            if ("type" in O && O.type === "tool_use" && "name" in O) {
                let w = "input" in O ? O.input : null,
                    $ = `Using ${O.name}…`;
                if (w) {
                    let j = w.description || w.prompt || w.command || w.query || w.pattern;
                    if (j) $ = oY(j)
                }
                K.push(j4($, _))
            } else if ("type" in O && O.type === "text" && "text" in O) {
                let w = O.text.split(`
`).filter(($) => $.trim());
                for (let $ = w.length - 1; $ >= 0 && K.length < 3; $--) {
                    let j = w[$];
                    if (!j) continue;
                    K.push(j4(j, _))
                }
            }
        }
    }
    return K.reverse()
}