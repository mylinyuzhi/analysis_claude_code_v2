
// @from(Ln 310898, Col 4)
rj6 = R((ny4, ry4) => {
    (function() {
        var A, q, K;
        K = lv(), A = SJ(), ry4.exports = q = class extends K {
            constructor(z, w, H) {
                super(z);
                if (w == null) throw Error("Missing DTD element name. " + this.debugInfo());
                if (!H) H = "(#PCDATA)";
                if (Array.isArray(H)) H = "(" + H.join(",") + ")";
                this.name = this.stringify.name(w), this.type = A.ElementDeclaration, this.value = this.stringify.dtdElementValue(H)
            }
            toString(z) {
                return this.options.writer.dtdElement(this, this.options.writer.filterOptions(z))
            }
        }
    }).call(ny4)
})
// @from(Ln 310915, Col 4)
oj6 = R((oy4, ay4) => {
    (function() {
        var A, q, K;
        K = lv(), A = SJ(), ay4.exports = q = function() {
            class Y extends K {
                constructor(z, w, H) {
                    super(z);
                    if (w == null) throw Error("Missing DTD notation name. " + this.debugInfo(w));
                    if (!H.pubID && !H.sysID) throw Error("Public or system identifiers are required for an external entity. " + this.debugInfo(w));
                    if (this.name = this.stringify.name(w), this.type = A.NotationDeclaration, H.pubID != null) this.pubID = this.stringify.dtdPubID(H.pubID);
                    if (H.sysID != null) this.sysID = this.stringify.dtdSysID(H.sysID)
                }
                toString(z) {
                    return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(z))
                }
            }
            return Object.defineProperty(Y.prototype, "publicId", {
                get: function() {
                    return this.pubID
                }
            }), Object.defineProperty(Y.prototype, "systemId", {
                get: function() {
                    return this.sysID
                }
            }), Y
        }.call(this)
    }).call(oy4)
})
// @from(Ln 310943, Col 4)
aj6 = R((sy4, ty4) => {
    (function() {
        var A, q, K, Y, z, w, H, $, O;
        ({
            isObject: O
        } = Vm()), $ = lv(), A = SJ(), q = ij6(), Y = nj6(), K = rj6(), z = oj6(), H = Uj6(), ty4.exports = w = function() {
            class _ extends $ {
                constructor(J, X, D) {
                    var j, M, P, W;
                    super(J);
                    if (this.type = A.DocType, J.children) {
                        W = J.children;
                        for (M = 0, P = W.length; M < P; M++)
                            if (j = W[M], j.type === A.Element) {
                                this.name = j.name;
                                break
                            }
                    }
                    if (this.documentObject = J, O(X))({
                        pubID: X,
                        sysID: D
                    } = X);
                    if (D == null)[D, X] = [X, D];
                    if (X != null) this.pubID = this.stringify.dtdPubID(X);
                    if (D != null) this.sysID = this.stringify.dtdSysID(D)
                }
                element(J, X) {
                    var D = new K(this, J, X);
                    return this.children.push(D), this
                }
                attList(J, X, D, j, M) {
                    var P = new q(this, J, X, D, j, M);
                    return this.children.push(P), this
                }
                entity(J, X) {
                    var D = new Y(this, !1, J, X);
                    return this.children.push(D), this
                }
                pEntity(J, X) {
                    var D = new Y(this, !0, J, X);
                    return this.children.push(D), this
                }
                notation(J, X) {
                    var D = new z(this, J, X);
                    return this.children.push(D), this
                }
                toString(J) {
                    return this.options.writer.docType(this, this.options.writer.filterOptions(J))
                }
                ele(J, X) {
                    return this.element(J, X)
                }
                att(J, X, D, j, M) {
                    return this.attList(J, X, D, j, M)
                }
                ent(J, X) {
                    return this.entity(J, X)
                }
                pent(J, X) {
                    return this.pEntity(J, X)
                }
                not(J, X) {
                    return this.notation(J, X)
                }
                up() {
                    return this.root() || this.documentObject
                }
                isEqualNode(J) {
                    if (!super.isEqualNode(J)) return !1;
                    if (J.name !== this.name) return !1;
                    if (J.publicId !== this.publicId) return !1;
                    if (J.systemId !== this.systemId) return !1;
                    return !0
                }
            }
            return Object.defineProperty(_.prototype, "entities", {
                get: function() {
                    var J, X, D, j, M;
                    j = {}, M = this.children;
                    for (X = 0, D = M.length; X < D; X++)
                        if (J = M[X], J.type === A.EntityDeclaration && !J.pe) j[J.name] = J;
                    return new H(j)
                }
            }), Object.defineProperty(_.prototype, "notations", {
                get: function() {
                    var J, X, D, j, M;
                    j = {}, M = this.children;
                    for (X = 0, D = M.length; X < D; X++)
                        if (J = M[X], J.type === A.NotationDeclaration) j[J.name] = J;
                    return new H(j)
                }
            }), Object.defineProperty(_.prototype, "publicId", {
                get: function() {
                    return this.pubID
                }
            }), Object.defineProperty(_.prototype, "systemId", {
                get: function() {
                    return this.sysID
                }
            }), Object.defineProperty(_.prototype, "internalSubset", {
                get: function() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }), _
        }.call(this)
    }).call(sy4)
})
// @from(Ln 311050, Col 4)
sj6 = R((ey4, AC4) => {
    (function() {
        var A, q, K;
        A = SJ(), q = lv(), AC4.exports = K = class extends q {
            constructor(z, w) {
                super(z);
                if (w == null) throw Error("Missing raw text. " + this.debugInfo());
                this.type = A.Raw, this.value = this.stringify.raw(w)
            }
            clone() {
                return Object.create(this)
            }
            toString(z) {
                return this.options.writer.raw(this, this.options.writer.filterOptions(z))
            }
        }
    }).call(ey4)
})
// @from(Ln 311068, Col 4)
tj6 = R((qC4, KC4) => {
    (function() {
        var A, q, K;
        A = SJ(), q = rF1(), KC4.exports = K = function() {
            class Y extends q {
                constructor(z, w) {
                    super(z);
                    if (w == null) throw Error("Missing element text. " + this.debugInfo());
                    this.name = "#text", this.type = A.Text, this.value = this.stringify.text(w)
                }
                clone() {
                    return Object.create(this)
                }
                toString(z) {
                    return this.options.writer.text(this, this.options.writer.filterOptions(z))
                }
                splitText(z) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                replaceWholeText(z) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }
            return Object.defineProperty(Y.prototype, "isElementContentWhitespace", {
                get: function() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }), Object.defineProperty(Y.prototype, "wholeText", {
                get: function() {
                    var z, w, H;
                    H = "", w = this.previousSibling;
                    while (w) H = w.data + H, w = w.previousSibling;
                    H += this.data, z = this.nextSibling;
                    while (z) H = H + z.data, z = z.nextSibling;
                    return H
                }
            }), Y
        }.call(this)
    }).call(qC4)
})
// @from(Ln 311108, Col 4)
ej6 = R((YC4, zC4) => {
    (function() {
        var A, q, K;
        A = SJ(), q = rF1(), zC4.exports = K = class extends q {
            constructor(z, w, H) {
                super(z);
                if (w == null) throw Error("Missing instruction target. " + this.debugInfo());
                if (this.type = A.ProcessingInstruction, this.target = this.stringify.insTarget(w), this.name = this.target, H) this.value = this.stringify.insValue(H)
            }
            clone() {
                return Object.create(this)
            }
            toString(z) {
                return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(z))
            }
            isEqualNode(z) {
                if (!super.isEqualNode(z)) return !1;
                if (z.target !== this.target) return !1;
                return !0
            }
        }
    }).call(YC4)
})
// @from(Ln 311131, Col 4)
uTA = R((wC4, HC4) => {
    (function() {
        var A, q, K;
        K = lv(), A = SJ(), HC4.exports = q = class extends K {
            constructor(z) {
                super(z);
                this.type = A.Dummy
            }
            clone() {
                return Object.create(this)
            }
            toString(z) {
                return ""
            }
        }
    }).call(wC4)
})
// @from(Ln 311148, Col 4)
_C4 = R(($C4, OC4) => {
    (function() {
        var A;
        OC4.exports = A = function() {
            class q {
                constructor(K) {
                    this.nodes = K
                }
                clone() {
                    return this.nodes = null
                }
                item(K) {
                    return this.nodes[K] || null
                }
            }
            return Object.defineProperty(q.prototype, "length", {
                get: function() {
                    return this.nodes.length || 0
                }
            }), q
        }.call(this)
    }).call($C4)
})
// @from(Ln 311171, Col 4)
DC4 = R((JC4, XC4) => {
    (function() {
        XC4.exports = {
            Disconnected: 1,
            Preceding: 2,
            Following: 4,
            Contains: 8,
            ContainedBy: 16,
            ImplementationSpecific: 32
        }
    }).call(JC4)
})
// @from(Ln 311183, Col 4)
lv = R((jC4, MC4) => {
    (function() {
        var A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f = {}.hasOwnProperty,
            Z = [].splice;
        ({
            isObject: G,
            isFunction: W,
            isEmpty: P,
            getValue: M
        } = Vm()), $ = null, K = null, Y = null, z = null, w = null, D = null, j = null, X = null, H = null, q = null, J = null, O = null, A = null, MC4.exports = _ = function() {
            class N {
                constructor(T) {
                    if (this.parent = T, this.parent) this.options = this.parent.options, this.stringify = this.parent.stringify;
                    if (this.value = null, this.children = [], this.baseURI = null, !$) $ = pj6(), K = dj6(), Y = cj6(), z = lj6(), w = aj6(), D = sj6(), j = tj6(), X = ej6(), H = uTA(), q = SJ(), J = _C4(), O = Uj6(), A = DC4()
                }
                setParent(T) {
                    var k, y, B, S, m;
                    if (this.parent = T, T) this.options = T.options, this.stringify = T.stringify;
                    S = this.children, m = [];
                    for (y = 0, B = S.length; y < B; y++) k = S[y], m.push(k.setParent(this));
                    return m
                }
                element(T, k, y) {
                    var B, S, m, b, g, U, x, p, l;
                    if (U = null, k === null && y == null)[k, y] = [{}, null];
                    if (k == null) k = {};
                    if (k = M(k), !G(k))[y, k] = [k, y];
                    if (T != null) T = M(T);
                    if (Array.isArray(T))
                        for (m = 0, x = T.length; m < x; m++) S = T[m], U = this.element(S);
                    else if (W(T)) U = this.element(T.apply());
                    else if (G(T))
                        for (g in T) {
                            if (!f.call(T, g)) continue;
                            if (l = T[g], W(l)) l = l.apply();
                            if (!this.options.ignoreDecorators && this.stringify.convertAttKey && g.indexOf(this.stringify.convertAttKey) === 0) U = this.attribute(g.substr(this.stringify.convertAttKey.length), l);
                            else if (!this.options.separateArrayItems && Array.isArray(l) && P(l)) U = this.dummy();
                            else if (G(l) && P(l)) U = this.element(g);
                            else if (!this.options.keepNullNodes && l == null) U = this.dummy();
                            else if (!this.options.separateArrayItems && Array.isArray(l))
                                for (b = 0, p = l.length; b < p; b++) S = l[b], B = {}, B[g] = S, U = this.element(B);
                            else if (G(l))
                                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && g.indexOf(this.stringify.convertTextKey) === 0) U = this.element(l);
                                else U = this.element(g), U.element(l);
                            else U = this.element(g, l)
                        } else if (!this.options.keepNullNodes && y === null) U = this.dummy();
                        else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && T.indexOf(this.stringify.convertTextKey) === 0) U = this.text(y);
                    else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && T.indexOf(this.stringify.convertCDataKey) === 0) U = this.cdata(y);
                    else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && T.indexOf(this.stringify.convertCommentKey) === 0) U = this.comment(y);
                    else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && T.indexOf(this.stringify.convertRawKey) === 0) U = this.raw(y);
                    else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && T.indexOf(this.stringify.convertPIKey) === 0) U = this.instruction(T.substr(this.stringify.convertPIKey.length), y);
                    else U = this.node(T, k, y);
                    if (U == null) throw Error("Could not create any elements with: " + T + ". " + this.debugInfo());
                    return U
                }
                insertBefore(T, k, y) {
                    var B, S, m, b, g;
                    if (T != null ? T.type : void 0) {
                        if (m = T, b = k, m.setParent(this), b) S = children.indexOf(b), g = children.splice(S), children.push(m), Array.prototype.push.apply(children, g);
                        else children.push(m);
                        return m
                    } else {
                        if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(T));
                        return S = this.parent.children.indexOf(this), g = this.parent.children.splice(S), B = this.parent.element(T, k, y), Array.prototype.push.apply(this.parent.children, g), B
                    }
                }
                insertAfter(T, k, y) {
                    var B, S, m;
                    if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(T));
                    return S = this.parent.children.indexOf(this), m = this.parent.children.splice(S + 1), B = this.parent.element(T, k, y), Array.prototype.push.apply(this.parent.children, m), B
                }
                remove() {
                    var T, k;
                    if (this.isRoot) throw Error("Cannot remove the root element. " + this.debugInfo());
                    return T = this.parent.children.indexOf(this), Z.apply(this.parent.children, [T, T - T + 1].concat(k = [])), this.parent
                }
                node(T, k, y) {
                    var B;
                    if (T != null) T = M(T);
                    if (k || (k = {}), k = M(k), !G(k))[y, k] = [k, y];
                    if (B = new $(this, T, k), y != null) B.text(y);
                    return this.children.push(B), B
                }
                text(T) {
                    var k;
                    if (G(T)) this.element(T);
                    return k = new j(this, T), this.children.push(k), this
                }
                cdata(T) {
                    var k = new K(this, T);
                    return this.children.push(k), this
                }
                comment(T) {
                    var k = new Y(this, T);
                    return this.children.push(k), this
                }
                commentBefore(T) {
                    var k, y, B;
                    return y = this.parent.children.indexOf(this), B = this.parent.children.splice(y), k = this.parent.comment(T), Array.prototype.push.apply(this.parent.children, B), this
                }
                commentAfter(T) {
                    var k, y, B;
                    return y = this.parent.children.indexOf(this), B = this.parent.children.splice(y + 1), k = this.parent.comment(T), Array.prototype.push.apply(this.parent.children, B), this
                }
                raw(T) {
                    var k = new D(this, T);
                    return this.children.push(k), this
                }
                dummy() {
                    var T = new H(this);
                    return T
                }
                instruction(T, k) {
                    var y, B, S, m, b;
                    if (T != null) T = M(T);
                    if (k != null) k = M(k);
                    if (Array.isArray(T))
                        for (m = 0, b = T.length; m < b; m++) y = T[m], this.instruction(y);
                    else if (G(T))
                        for (y in T) {
                            if (!f.call(T, y)) continue;
                            B = T[y], this.instruction(y, B)
                        } else {
                            if (W(k)) k = k.apply();
                            S = new X(this, T, k), this.children.push(S)
                        }
                    return this
                }
                instructionBefore(T, k) {
                    var y, B, S;
                    return B = this.parent.children.indexOf(this), S = this.parent.children.splice(B), y = this.parent.instruction(T, k), Array.prototype.push.apply(this.parent.children, S), this
                }
                instructionAfter(T, k) {
                    var y, B, S;
                    return B = this.parent.children.indexOf(this), S = this.parent.children.splice(B + 1), y = this.parent.instruction(T, k), Array.prototype.push.apply(this.parent.children, S), this
                }
                declaration(T, k, y) {
                    var B, S;
                    if (B = this.document(), S = new z(B, T, k, y), B.children.length === 0) B.children.unshift(S);
                    else if (B.children[0].type === q.Declaration) B.children[0] = S;
                    else B.children.unshift(S);
                    return B.root() || B
                }
                dtd(T, k) {
                    var y, B, S, m, b, g, U, x, p, l;
                    B = this.document(), S = new w(B, T, k), p = B.children;
                    for (m = b = 0, U = p.length; b < U; m = ++b)
                        if (y = p[m], y.type === q.DocType) return B.children[m] = S, S;
                    l = B.children;
                    for (m = g = 0, x = l.length; g < x; m = ++g)
                        if (y = l[m], y.isRoot) return B.children.splice(m, 0, S), S;
                    return B.children.push(S), S
                }
                up() {
                    if (this.isRoot) throw Error("The root node has no parent. Use doc() if you need to get the document object.");
                    return this.parent
                }
                root() {
                    var T = this;
                    while (T)
                        if (T.type === q.Document) return T.rootObject;
                        else if (T.isRoot) return T;
                    else T = T.parent
                }
                document() {
                    var T = this;
                    while (T)
                        if (T.type === q.Document) return T;
                        else T = T.parent
                }
                end(T) {
                    return this.document().end(T)
                }
                prev() {
                    var T = this.parent.children.indexOf(this);
                    if (T < 1) throw Error("Already at the first node. " + this.debugInfo());
                    return this.parent.children[T - 1]
                }
                next() {
                    var T = this.parent.children.indexOf(this);
                    if (T === -1 || T === this.parent.children.length - 1) throw Error("Already at the last node. " + this.debugInfo());
                    return this.parent.children[T + 1]
                }
                importDocument(T) {
                    var k, y, B, S, m;
                    if (y = T.root().clone(), y.parent = this, y.isRoot = !1, this.children.push(y), this.type === q.Document) {
                        if (y.isRoot = !0, y.documentObject = this, this.rootObject = y, this.children) {
                            m = this.children;
                            for (B = 0, S = m.length; B < S; B++)
                                if (k = m[B], k.type === q.DocType) {
                                    k.name = y.name;
                                    break
                                }
                        }
                    }
                    return this
                }
                debugInfo(T) {
                    var k, y;
                    if (T = T || this.name, T == null && !((k = this.parent) != null ? k.name : void 0)) return "";
                    else if (T == null) return "parent: <" + this.parent.name + ">";
                    else if (!((y = this.parent) != null ? y.name : void 0)) return "node: <" + T + ">";
                    else return "node: <" + T + ">, parent: <" + this.parent.name + ">"
                }
                ele(T, k, y) {
                    return this.element(T, k, y)
                }
                nod(T, k, y) {
                    return this.node(T, k, y)
                }
                txt(T) {
                    return this.text(T)
                }
                dat(T) {
                    return this.cdata(T)
                }
                com(T) {
                    return this.comment(T)
                }
                ins(T, k) {
                    return this.instruction(T, k)
                }
                doc() {
                    return this.document()
                }
                dec(T, k, y) {
                    return this.declaration(T, k, y)
                }
                e(T, k, y) {
                    return this.element(T, k, y)
                }
                n(T, k, y) {
                    return this.node(T, k, y)
                }
                t(T) {
                    return this.text(T)
                }
                d(T) {
                    return this.cdata(T)
                }
                c(T) {
                    return this.comment(T)
                }
                r(T) {
                    return this.raw(T)
                }
                i(T, k) {
                    return this.instruction(T, k)
                }
                u() {
                    return this.up()
                }
                importXMLBuilder(T) {
                    return this.importDocument(T)
                }
                attribute(T, k) {
                    throw Error("attribute() applies to element nodes only.")
                }
                att(T, k) {
                    return this.attribute(T, k)
                }
                a(T, k) {
                    return this.attribute(T, k)
                }
                removeAttribute(T) {
                    throw Error("attribute() applies to element nodes only.")
                }
                replaceChild(T, k) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                removeChild(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                appendChild(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                hasChildNodes() {
                    return this.children.length !== 0
                }
                cloneNode(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                normalize() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isSupported(T, k) {
                    return !0
                }
                hasAttributes() {
                    return this.attribs.length !== 0
                }
                compareDocumentPosition(T) {
                    var k, y;
                    if (k = this, k === T) return 0;
                    else if (this.document() !== T.document()) {
                        if (y = A.Disconnected | A.ImplementationSpecific, Math.random() < 0.5) y |= A.Preceding;
                        else y |= A.Following;
                        return y
                    } else if (k.isAncestor(T)) return A.Contains | A.Preceding;
                    else if (k.isDescendant(T)) return A.Contains | A.Following;
                    else if (k.isPreceding(T)) return A.Preceding;
                    else return A.Following
                }
                isSameNode(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                lookupPrefix(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isDefaultNamespace(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                lookupNamespaceURI(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isEqualNode(T) {
                    var k, y, B;
                    if (T.nodeType !== this.nodeType) return !1;
                    if (T.children.length !== this.children.length) return !1;
                    for (k = y = 0, B = this.children.length - 1; 0 <= B ? y <= B : y >= B; k = 0 <= B ? ++y : --y)
                        if (!this.children[k].isEqualNode(T.children[k])) return !1;
                    return !0
                }
                getFeature(T, k) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                setUserData(T, k, y) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getUserData(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                contains(T) {
                    if (!T) return !1;
                    return T === this || this.isDescendant(T)
                }
                isDescendant(T) {
                    var k, y, B, S, m;
                    m = this.children;
                    for (B = 0, S = m.length; B < S; B++) {
                        if (k = m[B], T === k) return !0;
                        if (y = k.isDescendant(T), y) return !0
                    }
                    return !1
                }
                isAncestor(T) {
                    return T.isDescendant(this)
                }
                isPreceding(T) {
                    var k, y;
                    if (k = this.treePosition(T), y = this.treePosition(this), k === -1 || y === -1) return !1;
                    else return k < y
                }
                isFollowing(T) {
                    var k, y;
                    if (k = this.treePosition(T), y = this.treePosition(this), k === -1 || y === -1) return !1;
                    else return k > y
                }
                treePosition(T) {
                    var k, y;
                    if (y = 0, k = !1, this.foreachTreeNode(this.document(), function(B) {
                            if (y++, !k && B === T) return k = !0
                        }), k) return y;
                    else return -1
                }
                foreachTreeNode(T, k) {
                    var y, B, S, m, b;
                    T || (T = this.document()), m = T.children;
                    for (B = 0, S = m.length; B < S; B++)
                        if (y = m[B], b = k(y)) return b;
                        else if (b = this.foreachTreeNode(y, k), b) return b
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
                    if (!this.childNodeList || !this.childNodeList.nodes) this.childNodeList = new J(this.children);
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
                    var T = this.parent.children.indexOf(this);
                    return this.parent.children[T - 1] || null
                }
            }), Object.defineProperty(N.prototype, "nextSibling", {
                get: function() {
                    var T = this.parent.children.indexOf(this);
                    return this.parent.children[T + 1] || null
                }
            }), Object.defineProperty(N.prototype, "ownerDocument", {
                get: function() {
                    return this.document() || null
                }
            }), Object.defineProperty(N.prototype, "textContent", {
                get: function() {
                    var T, k, y, B, S;
                    if (this.nodeType === q.Element || this.nodeType === q.DocumentFragment) {
                        S = "", B = this.children;
                        for (k = 0, y = B.length; k < y; k++)
                            if (T = B[k], T.textContent) S += T.textContent;
                        return S
                    } else return null
                },
                set: function(T) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }), N
        }.call(this)
    }).call(jC4)
})
// @from(Ln 311616, Col 4)
BTA = R((PC4, WC4) => {
    (function() {
        var A, q = {}.hasOwnProperty;
        WC4.exports = A = function() {
            class K {
                constructor(Y) {
                    var z, w, H;
                    if (this.assertLegalChar = this.assertLegalChar.bind(this), this.assertLegalName = this.assertLegalName.bind(this), Y || (Y = {}), this.options = Y, !this.options.version) this.options.version = "1.0";
                    w = Y.stringify || {};
                    for (z in w) {
                        if (!q.call(w, z)) continue;
                        H = w[z], this[z] = H
                    }
                }
                name(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalName("" + Y || "")
                }
                text(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar(this.textEscape("" + Y || ""))
                }
                cdata(Y) {
                    if (this.options.noValidation) return Y;
                    return Y = "" + Y || "", Y = Y.replace("]]>", "]]]]><![CDATA[>"), this.assertLegalChar(Y)
                }
                comment(Y) {
                    if (this.options.noValidation) return Y;
                    if (Y = "" + Y || "", Y.match(/--/)) throw Error("Comment text cannot contain double-hypen: " + Y);
                    return this.assertLegalChar(Y)
                }
                raw(Y) {
                    if (this.options.noValidation) return Y;
                    return "" + Y || ""
                }
                attValue(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar(this.attEscape(Y = "" + Y || ""))
                }
                insTarget(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                insValue(Y) {
                    if (this.options.noValidation) return Y;
                    if (Y = "" + Y || "", Y.match(/\?>/)) throw Error("Invalid processing instruction value: " + Y);
                    return this.assertLegalChar(Y)
                }
                xmlVersion(Y) {
                    if (this.options.noValidation) return Y;
                    if (Y = "" + Y || "", !Y.match(/1\.[0-9]+/)) throw Error("Invalid version number: " + Y);
                    return Y
                }
                xmlEncoding(Y) {
                    if (this.options.noValidation) return Y;
                    if (Y = "" + Y || "", !Y.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw Error("Invalid encoding: " + Y);
                    return this.assertLegalChar(Y)
                }
                xmlStandalone(Y) {
                    if (this.options.noValidation) return Y;
                    if (Y) return "yes";
                    else return "no"
                }
                dtdPubID(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdSysID(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdElementValue(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdAttType(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdAttDefault(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdEntityValue(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                dtdNData(Y) {
                    if (this.options.noValidation) return Y;
                    return this.assertLegalChar("" + Y || "")
                }
                assertLegalChar(Y) {
                    var z, w;
                    if (this.options.noValidation) return Y;
                    if (this.options.version === "1.0") {
                        if (z = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) Y = Y.replace(z, this.options.invalidCharReplacement);
                        else if (w = Y.match(z)) throw Error(`Invalid character in string: ${Y} at index ${w.index}`)
                    } else if (this.options.version === "1.1") {
                        if (z = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) Y = Y.replace(z, this.options.invalidCharReplacement);
                        else if (w = Y.match(z)) throw Error(`Invalid character in string: ${Y} at index ${w.index}`)
                    }
                    return Y
                }
                assertLegalName(Y) {
                    var z;
                    if (this.options.noValidation) return Y;
                    if (Y = this.assertLegalChar(Y), z = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/, !Y.match(z)) throw Error(`Invalid character in name: ${Y}`);
                    return Y
                }
                textEscape(Y) {
                    var z;
                    if (this.options.noValidation) return Y;
                    return z = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g, Y.replace(z, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;")
                }
                attEscape(Y) {
                    var z;
                    if (this.options.noValidation) return Y;
                    return z = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g, Y.replace(z, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;")
                }
            }
            return K.prototype.convertAttKey = "@", K.prototype.convertPIKey = "?", K.prototype.convertTextKey = "#text", K.prototype.convertCDataKey = "#cdata", K.prototype.convertCommentKey = "#comment", K.prototype.convertRawKey = "#raw", K
        }.call(this)
    }).call(PC4)
})
// @from(Ln 311740, Col 4)
oF1 = R((GC4, ZC4) => {
    (function() {
        ZC4.exports = {
            None: 0,
            OpenTag: 1,
            InsideTag: 2,
            CloseTag: 3
        }
    }).call(GC4)
})
// @from(Ln 311750, Col 4)
mTA = R((fC4, VC4) => {
    (function() {
        var A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G = {}.hasOwnProperty;
        ({
            assign: W
        } = Vm()), A = SJ(), O = lj6(), _ = aj6(), K = dj6(), Y = cj6(), X = pj6(), j = sj6(), M = tj6(), D = ej6(), J = uTA(), z = ij6(), w = rj6(), H = nj6(), $ = oj6(), q = oF1(), VC4.exports = P = class {
            constructor(Z) {
                var N, T, k;
                Z || (Z = {}), this.options = Z, T = Z.writer || {};
                for (N in T) {
                    if (!G.call(T, N)) continue;
                    k = T[N], this["_" + N] = this[N], this[N] = k
                }
            }
            filterOptions(Z) {
                var N, T, k, y, B, S, m, b, g;
                if (Z || (Z = {}), Z = W({}, this.options, Z), N = {
                        writer: this
                    }, N.pretty = Z.pretty || !1, N.allowEmpty = Z.allowEmpty || !1, N.indent = (T = Z.indent) != null ? T : "  ", N.newline = (k = Z.newline) != null ? k : `
`, N.offset = (y = Z.offset) != null ? y : 0, N.width = (B = Z.width) != null ? B : 0, N.dontPrettyTextNodes = (S = (m = Z.dontPrettyTextNodes) != null ? m : Z.dontprettytextnodes) != null ? S : 0, N.spaceBeforeSlash = (b = (g = Z.spaceBeforeSlash) != null ? g : Z.spacebeforeslash) != null ? b : "", N.spaceBeforeSlash === !0) N.spaceBeforeSlash = " ";
                return N.suppressPrettyCount = 0, N.user = {}, N.state = q.None, N
            }
            indent(Z, N, T) {
                var k;
                if (!N.pretty || N.suppressPrettyCount) return "";
                else if (N.pretty) {
                    if (k = (T || 0) + N.offset + 1, k > 0) return Array(k).join(N.indent)
                }
                return ""
            }
            endline(Z, N, T) {
                if (!N.pretty || N.suppressPrettyCount) return "";
                else return N.newline
            }
            attribute(Z, N, T) {
                var k;
                if (this.openAttribute(Z, N, T), N.pretty && N.width > 0) k = Z.name + '="' + Z.value + '"';
                else k = " " + Z.name + '="' + Z.value + '"';
                return this.closeAttribute(Z, N, T), k
            }
            cdata(Z, N, T) {
                var k;
                return this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<![CDATA[", N.state = q.InsideTag, k += Z.value, N.state = q.CloseTag, k += "]]>" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            comment(Z, N, T) {
                var k;
                return this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<!-- ", N.state = q.InsideTag, k += Z.value, N.state = q.CloseTag, k += " -->" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            declaration(Z, N, T) {
                var k;
                if (this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<?xml", N.state = q.InsideTag, k += ' version="' + Z.version + '"', Z.encoding != null) k += ' encoding="' + Z.encoding + '"';
                if (Z.standalone != null) k += ' standalone="' + Z.standalone + '"';
                return N.state = q.CloseTag, k += N.spaceBeforeSlash + "?>", k += this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            docType(Z, N, T) {
                var k, y, B, S, m;
                if (T || (T = 0), this.openNode(Z, N, T), N.state = q.OpenTag, S = this.indent(Z, N, T), S += "<!DOCTYPE " + Z.root().name, Z.pubID && Z.sysID) S += ' PUBLIC "' + Z.pubID + '" "' + Z.sysID + '"';
                else if (Z.sysID) S += ' SYSTEM "' + Z.sysID + '"';
                if (Z.children.length > 0) {
                    S += " [", S += this.endline(Z, N, T), N.state = q.InsideTag, m = Z.children;
                    for (y = 0, B = m.length; y < B; y++) k = m[y], S += this.writeChildNode(k, N, T + 1);
                    N.state = q.CloseTag, S += "]"
                }
                return N.state = q.CloseTag, S += N.spaceBeforeSlash + ">", S += this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), S
            }
            element(Z, N, T) {
                var k, y, B, S, m, b, g, U, x, p, l, r, s, O1, T1, N1, j1, q1, t;
                if (T || (T = 0), r = !1, this.openNode(Z, N, T), N.state = q.OpenTag, s = this.indent(Z, N, T) + "<" + Z.name, N.pretty && N.width > 0) {
                    U = s.length, T1 = Z.attribs;
                    for (l in T1) {
                        if (!G.call(T1, l)) continue;
                        if (k = T1[l], O1 = this.attribute(k, N, T), y = O1.length, U + y > N.width) t = this.indent(Z, N, T + 1) + O1, s += this.endline(Z, N, T) + t, U = t.length;
                        else t = " " + O1, s += t, U += t.length
                    }
                } else {
                    N1 = Z.attribs;
                    for (l in N1) {
                        if (!G.call(N1, l)) continue;
                        k = N1[l], s += this.attribute(k, N, T)
                    }
                }
                if (S = Z.children.length, m = S === 0 ? null : Z.children[0], S === 0 || Z.children.every(function(J1) {
                        return (J1.type === A.Text || J1.type === A.Raw || J1.type === A.CData) && J1.value === ""
                    }))
                    if (N.allowEmpty) s += ">", N.state = q.CloseTag, s += "</" + Z.name + ">" + this.endline(Z, N, T);
                    else N.state = q.CloseTag, s += N.spaceBeforeSlash + "/>" + this.endline(Z, N, T);
                else if (N.pretty && S === 1 && (m.type === A.Text || m.type === A.Raw || m.type === A.CData) && m.value != null) s += ">", N.state = q.InsideTag, N.suppressPrettyCount++, r = !0, s += this.writeChildNode(m, N, T + 1), N.suppressPrettyCount--, r = !1, N.state = q.CloseTag, s += "</" + Z.name + ">" + this.endline(Z, N, T);
                else {
                    if (N.dontPrettyTextNodes) {
                        j1 = Z.children;
                        for (b = 0, x = j1.length; b < x; b++)
                            if (B = j1[b], (B.type === A.Text || B.type === A.Raw || B.type === A.CData) && B.value != null) {
                                N.suppressPrettyCount++, r = !0;
                                break
                            }
                    }
                    s += ">" + this.endline(Z, N, T), N.state = q.InsideTag, q1 = Z.children;
                    for (g = 0, p = q1.length; g < p; g++) B = q1[g], s += this.writeChildNode(B, N, T + 1);
                    if (N.state = q.CloseTag, s += this.indent(Z, N, T) + "</" + Z.name + ">", r) N.suppressPrettyCount--;
                    s += this.endline(Z, N, T), N.state = q.None
                }
                return this.closeNode(Z, N, T), s
            }
            writeChildNode(Z, N, T) {
                switch (Z.type) {
                    case A.CData:
                        return this.cdata(Z, N, T);
                    case A.Comment:
                        return this.comment(Z, N, T);
                    case A.Element:
                        return this.element(Z, N, T);
                    case A.Raw:
                        return this.raw(Z, N, T);
                    case A.Text:
                        return this.text(Z, N, T);
                    case A.ProcessingInstruction:
                        return this.processingInstruction(Z, N, T);
                    case A.Dummy:
                        return "";
                    case A.Declaration:
                        return this.declaration(Z, N, T);
                    case A.DocType:
                        return this.docType(Z, N, T);
                    case A.AttributeDeclaration:
                        return this.dtdAttList(Z, N, T);
                    case A.ElementDeclaration:
                        return this.dtdElement(Z, N, T);
                    case A.EntityDeclaration:
                        return this.dtdEntity(Z, N, T);
                    case A.NotationDeclaration:
                        return this.dtdNotation(Z, N, T);
                    default:
                        throw Error("Unknown XML node type: " + Z.constructor.name)
                }
            }
            processingInstruction(Z, N, T) {
                var k;
                if (this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<?", N.state = q.InsideTag, k += Z.target, Z.value) k += " " + Z.value;
                return N.state = q.CloseTag, k += N.spaceBeforeSlash + "?>", k += this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            raw(Z, N, T) {
                var k;
                return this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T), N.state = q.InsideTag, k += Z.value, N.state = q.CloseTag, k += this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            text(Z, N, T) {
                var k;
                return this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T), N.state = q.InsideTag, k += Z.value, N.state = q.CloseTag, k += this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            dtdAttList(Z, N, T) {
                var k;
                if (this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<!ATTLIST", N.state = q.InsideTag, k += " " + Z.elementName + " " + Z.attributeName + " " + Z.attributeType, Z.defaultValueType !== "#DEFAULT") k += " " + Z.defaultValueType;
                if (Z.defaultValue) k += ' "' + Z.defaultValue + '"';
                return N.state = q.CloseTag, k += N.spaceBeforeSlash + ">" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            dtdElement(Z, N, T) {
                var k;
                return this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<!ELEMENT", N.state = q.InsideTag, k += " " + Z.name + " " + Z.value, N.state = q.CloseTag, k += N.spaceBeforeSlash + ">" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            dtdEntity(Z, N, T) {
                var k;
                if (this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<!ENTITY", N.state = q.InsideTag, Z.pe) k += " %";
                if (k += " " + Z.name, Z.value) k += ' "' + Z.value + '"';
                else {
                    if (Z.pubID && Z.sysID) k += ' PUBLIC "' + Z.pubID + '" "' + Z.sysID + '"';
                    else if (Z.sysID) k += ' SYSTEM "' + Z.sysID + '"';
                    if (Z.nData) k += " NDATA " + Z.nData
                }
                return N.state = q.CloseTag, k += N.spaceBeforeSlash + ">" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            dtdNotation(Z, N, T) {
                var k;
                if (this.openNode(Z, N, T), N.state = q.OpenTag, k = this.indent(Z, N, T) + "<!NOTATION", N.state = q.InsideTag, k += " " + Z.name, Z.pubID && Z.sysID) k += ' PUBLIC "' + Z.pubID + '" "' + Z.sysID + '"';
                else if (Z.pubID) k += ' PUBLIC "' + Z.pubID + '"';
                else if (Z.sysID) k += ' SYSTEM "' + Z.sysID + '"';
                return N.state = q.CloseTag, k += N.spaceBeforeSlash + ">" + this.endline(Z, N, T), N.state = q.None, this.closeNode(Z, N, T), k
            }
            openNode(Z, N, T) {}
            closeNode(Z, N, T) {}
            openAttribute(Z, N, T) {}
            closeAttribute(Z, N, T) {}
        }
    }).call(fC4)
})
// @from(Ln 311933, Col 4)
AM6 = R((NC4, TC4) => {
    (function() {
        var A, q;
        q = mTA(), TC4.exports = A = class extends q {
            constructor(Y) {
                super(Y)
            }
            document(Y, z) {
                var w, H, $, O, _;
                z = this.filterOptions(z), O = "", _ = Y.children;
                for (H = 0, $ = _.length; H < $; H++) w = _[H], O += this.writeChildNode(w, z, 0);
                if (z.pretty && O.slice(-z.newline.length) === z.newline) O = O.slice(0, -z.newline.length);
                return O
            }
        }
    }).call(NC4)
})
// @from(Ln 311950, Col 4)
FTA = R((vC4, EC4) => {
    (function() {
        var A, q, K, Y, z, w, H, $;
        ({
            isPlainObject: $
        } = Vm()), K = xTA(), q = Ly4(), z = lv(), A = SJ(), H = BTA(), w = AM6(), EC4.exports = Y = function() {
            class O extends z {
                constructor(_) {
                    super(null);
                    if (this.name = "#document", this.type = A.Document, this.documentURI = null, this.domConfig = new q, _ || (_ = {}), !_.writer) _.writer = new w;
                    this.options = _, this.stringify = new H(_)
                }
                end(_) {
                    var J = {};
                    if (!_) _ = this.options.writer;
                    else if ($(_)) J = _, _ = this.options.writer;
                    return _.document(this, _.filterOptions(J))
                }
                toString(_) {
                    return this.options.writer.document(this, this.options.writer.filterOptions(_))
                }
                createElement(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createDocumentFragment() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTextNode(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createComment(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createCDATASection(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createProcessingInstruction(_, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttribute(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEntityReference(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagName(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                importNode(_, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createElementNS(_, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttributeNS(_, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagNameNS(_, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementById(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                adoptNode(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                normalizeDocument() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                renameNode(_, J, X) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByClassName(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEvent(_) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createRange() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createNodeIterator(_, J, X) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTreeWalker(_, J, X) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }
            return Object.defineProperty(O.prototype, "implementation", {
                value: new K
            }), Object.defineProperty(O.prototype, "doctype", {
                get: function() {
                    var _, J, X, D;
                    D = this.children;
                    for (J = 0, X = D.length; J < X; J++)
                        if (_ = D[J], _.type === A.DocType) return _;
                    return null
                }
            }), Object.defineProperty(O.prototype, "documentElement", {
                get: function() {
                    return this.rootObject || null
                }
            }), Object.defineProperty(O.prototype, "inputEncoding", {
                get: function() {
                    return null
                }
            }), Object.defineProperty(O.prototype, "strictErrorChecking", {
                get: function() {
                    return !1
                }
            }), Object.defineProperty(O.prototype, "xmlEncoding", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].encoding;
                    else return null
                }
            }), Object.defineProperty(O.prototype, "xmlStandalone", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].standalone === "yes";
                    else return !1
                }
            }), Object.defineProperty(O.prototype, "xmlVersion", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].version;
                    else return "1.0"
                }
            }), Object.defineProperty(O.prototype, "URL", {
                get: function() {
                    return this.documentURI
                }
            }), Object.defineProperty(O.prototype, "origin", {
                get: function() {
                    return null
                }
            }), Object.defineProperty(O.prototype, "compatMode", {
                get: function() {
                    return null
                }
            }), Object.defineProperty(O.prototype, "characterSet", {
                get: function() {
                    return null
                }
            }), Object.defineProperty(O.prototype, "contentType", {
                get: function() {
                    return null
                }
            }), O
        }.call(this)
    }).call(vC4)
})
// @from(Ln 312099, Col 4)
RC4 = R((kC4, LC4) => {
    (function() {
        var A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f, Z, N, T, k, y = {}.hasOwnProperty;
        ({
            isObject: T,
            isFunction: N,
            isPlainObject: k,
            getValue: Z
        } = Vm()), A = SJ(), X = FTA(), j = pj6(), Y = dj6(), z = cj6(), P = sj6(), f = tj6(), M = ej6(), _ = lj6(), J = aj6(), w = ij6(), $ = nj6(), H = rj6(), O = oj6(), K = bTA(), G = BTA(), W = AM6(), q = oF1(), LC4.exports = D = class {
            constructor(S, m, b) {
                var g;
                if (this.name = "?xml", this.type = A.Document, S || (S = {}), g = {}, !S.writer) S.writer = new W;
                else if (k(S.writer)) g = S.writer, S.writer = new W;
                this.options = S, this.writer = S.writer, this.writerOptions = this.writer.filterOptions(g), this.stringify = new G(S), this.onDataCallback = m || function() {}, this.onEndCallback = b || function() {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
            }
            createChildNode(S) {
                var m, b, g, U, x, p, l, r;
                switch (S.type) {
                    case A.CData:
                        this.cdata(S.value);
                        break;
                    case A.Comment:
                        this.comment(S.value);
                        break;
                    case A.Element:
                        g = {}, l = S.attribs;
                        for (b in l) {
                            if (!y.call(l, b)) continue;
                            m = l[b], g[b] = m.value
                        }
                        this.node(S.name, g);
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
                r = S.children;
                for (x = 0, p = r.length; x < p; x++)
                    if (U = r[x], this.createChildNode(U), U.type === A.Element) this.up();
                return this
            }
            dummy() {
                return this
            }
            node(S, m, b) {
                if (S == null) throw Error("Missing node name.");
                if (this.root && this.currentLevel === -1) throw Error("Document can only have one root node. " + this.debugInfo(S));
                if (this.openCurrent(), S = Z(S), m == null) m = {};
                if (m = Z(m), !T(m))[b, m] = [m, b];
                if (this.currentNode = new j(this, S, m), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, b != null) this.text(b);
                return this
            }
            element(S, m, b) {
                var g, U, x, p, l, r;
                if (this.currentNode && this.currentNode.type === A.DocType) this.dtdElement(...arguments);
                else if (Array.isArray(S) || T(S) || N(S)) {
                    p = this.options.noValidation, this.options.noValidation = !0, r = new X(this.options).element("TEMP_ROOT"), r.element(S), this.options.noValidation = p, l = r.children;
                    for (U = 0, x = l.length; U < x; U++)
                        if (g = l[U], this.createChildNode(g), g.type === A.Element) this.up()
                } else this.node(S, m, b);
                return this
            }
            attribute(S, m) {
                var b, g;
                if (!this.currentNode || this.currentNode.children) throw Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(S));
                if (S != null) S = Z(S);
                if (T(S))
                    for (b in S) {
                        if (!y.call(S, b)) continue;
                        g = S[b], this.attribute(b, g)
                    } else {
                        if (N(m)) m = m.apply();
                        if (this.options.keepNullAttributes && m == null) this.currentNode.attribs[S] = new K(this, S, "");
                        else if (m != null) this.currentNode.attribs[S] = new K(this, S, m)
                    }
                return this
            }
            text(S) {
                var m;
                return this.openCurrent(), m = new f(this, S), this.onData(this.writer.text(m, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            cdata(S) {
                var m;
                return this.openCurrent(), m = new Y(this, S), this.onData(this.writer.cdata(m, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            comment(S) {
                var m;
                return this.openCurrent(), m = new z(this, S), this.onData(this.writer.comment(m, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            raw(S) {
                var m;
                return this.openCurrent(), m = new P(this, S), this.onData(this.writer.raw(m, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            instruction(S, m) {
                var b, g, U, x, p;
                if (this.openCurrent(), S != null) S = Z(S);
                if (m != null) m = Z(m);
                if (Array.isArray(S))
                    for (b = 0, x = S.length; b < x; b++) g = S[b], this.instruction(g);
                else if (T(S))
                    for (g in S) {
                        if (!y.call(S, g)) continue;
                        U = S[g], this.instruction(g, U)
                    } else {
                        if (N(m)) m = m.apply();
                        p = new M(this, S, m), this.onData(this.writer.processingInstruction(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1)
                    }
                return this
            }
            declaration(S, m, b) {
                var g;
                if (this.openCurrent(), this.documentStarted) throw Error("declaration() must be the first node.");
                return g = new _(this, S, m, b), this.onData(this.writer.declaration(g, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            doctype(S, m, b) {
                if (this.openCurrent(), S == null) throw Error("Missing root node name.");
                if (this.root) throw Error("dtd() must come before the root node.");
                return this.currentNode = new J(this, m, b), this.currentNode.rootNodeName = S, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
            }
            dtdElement(S, m) {
                var b;
                return this.openCurrent(), b = new H(this, S, m), this.onData(this.writer.dtdElement(b, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            attList(S, m, b, g, U) {
                var x;
                return this.openCurrent(), x = new w(this, S, m, b, g, U), this.onData(this.writer.dtdAttList(x, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            entity(S, m) {
                var b;
                return this.openCurrent(), b = new $(this, !1, S, m), this.onData(this.writer.dtdEntity(b, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            pEntity(S, m) {
                var b;
                return this.openCurrent(), b = new $(this, !0, S, m), this.onData(this.writer.dtdEntity(b, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            notation(S, m) {
                var b;
                return this.openCurrent(), b = new O(this, S, m), this.onData(this.writer.dtdNotation(b, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
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
                var m, b, g, U;
                if (!S.isOpen) {
                    if (!this.root && this.currentLevel === 0 && S.type === A.Element) this.root = S;
                    if (b = "", S.type === A.Element) {
                        this.writerOptions.state = q.OpenTag, b = this.writer.indent(S, this.writerOptions, this.currentLevel) + "<" + S.name, U = S.attribs;
                        for (g in U) {
                            if (!y.call(U, g)) continue;
                            m = U[g], b += this.writer.attribute(m, this.writerOptions, this.currentLevel)
                        }
                        b += (S.children ? ">" : "/>") + this.writer.endline(S, this.writerOptions, this.currentLevel), this.writerOptions.state = q.InsideTag
                    } else {
                        if (this.writerOptions.state = q.OpenTag, b = this.writer.indent(S, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + S.rootNodeName, S.pubID && S.sysID) b += ' PUBLIC "' + S.pubID + '" "' + S.sysID + '"';
                        else if (S.sysID) b += ' SYSTEM "' + S.sysID + '"';
                        if (S.children) b += " [", this.writerOptions.state = q.InsideTag;
                        else this.writerOptions.state = q.CloseTag, b += ">";
                        b += this.writer.endline(S, this.writerOptions, this.currentLevel)
                    }
                    return this.onData(b, this.currentLevel), S.isOpen = !0
                }
            }
            closeNode(S) {
                var m;
                if (!S.isClosed) {
                    if (m = "", this.writerOptions.state = q.CloseTag, S.type === A.Element) m = this.writer.indent(S, this.writerOptions, this.currentLevel) + "</" + S.name + ">" + this.writer.endline(S, this.writerOptions, this.currentLevel);
                    else m = this.writer.indent(S, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(S, this.writerOptions, this.currentLevel);
                    return this.writerOptions.state = q.None, this.onData(m, this.currentLevel), S.isClosed = !0
                }
            }
            onData(S, m) {
                return this.documentStarted = !0, this.onDataCallback(S, m + 1)
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
            nod(S, m, b) {
                return this.node(S, m, b)
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
            ins(S, m) {
                return this.instruction(S, m)
            }
            dec(S, m, b) {
                return this.declaration(S, m, b)
            }
            dtd(S, m, b) {
                return this.doctype(S, m, b)
            }
            e(S, m, b) {
                return this.element(S, m, b)
            }
            n(S, m, b) {
                return this.node(S, m, b)
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
            i(S, m) {
                return this.instruction(S, m)
            }
            att() {
                if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            a() {
                if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            ent(S, m) {
                return this.entity(S, m)
            }
            pent(S, m) {
                return this.pEntity(S, m)
            }
            not(S, m) {
                return this.notation(S, m)
            }
        }
    }).call(kC4)
})
// @from(Ln 312369, Col 4)
SC4 = R((yC4, CC4) => {
    (function() {
        var A, q, K, Y, z = {}.hasOwnProperty;
        A = SJ(), Y = mTA(), q = oF1(), CC4.exports = K = class extends Y {
            constructor(H, $) {
                super($);
                this.stream = H
            }
            endline(H, $, O) {
                if (H.isLastRootNode && $.state === q.CloseTag) return "";
                else return super.endline(H, $, O)
            }
            document(H, $) {
                var O, _, J, X, D, j, M, P, W;
                M = H.children;
                for (_ = J = 0, D = M.length; J < D; _ = ++J) O = M[_], O.isLastRootNode = _ === H.children.length - 1;
                $ = this.filterOptions($), P = H.children, W = [];
                for (X = 0, j = P.length; X < j; X++) O = P[X], W.push(this.writeChildNode(O, $, 0));
                return W
            }
            cdata(H, $, O) {
                return this.stream.write(super.cdata(H, $, O))
            }
            comment(H, $, O) {
                return this.stream.write(super.comment(H, $, O))
            }
            declaration(H, $, O) {
                return this.stream.write(super.declaration(H, $, O))
            }
            docType(H, $, O) {
                var _, J, X, D;
                if (O || (O = 0), this.openNode(H, $, O), $.state = q.OpenTag, this.stream.write(this.indent(H, $, O)), this.stream.write("<!DOCTYPE " + H.root().name), H.pubID && H.sysID) this.stream.write(' PUBLIC "' + H.pubID + '" "' + H.sysID + '"');
                else if (H.sysID) this.stream.write(' SYSTEM "' + H.sysID + '"');
                if (H.children.length > 0) {
                    this.stream.write(" ["), this.stream.write(this.endline(H, $, O)), $.state = q.InsideTag, D = H.children;
                    for (J = 0, X = D.length; J < X; J++) _ = D[J], this.writeChildNode(_, $, O + 1);
                    $.state = q.CloseTag, this.stream.write("]")
                }
                return $.state = q.CloseTag, this.stream.write($.spaceBeforeSlash + ">"), this.stream.write(this.endline(H, $, O)), $.state = q.None, this.closeNode(H, $, O)
            }
            element(H, $, O) {
                var _, J, X, D, j, M, P, W, G, f, Z, N, T, k, y, B;
                if (O || (O = 0), this.openNode(H, $, O), $.state = q.OpenTag, Z = this.indent(H, $, O) + "<" + H.name, $.pretty && $.width > 0) {
                    P = Z.length, T = H.attribs;
                    for (G in T) {
                        if (!z.call(T, G)) continue;
                        if (_ = T[G], N = this.attribute(_, $, O), J = N.length, P + J > $.width) B = this.indent(H, $, O + 1) + N, Z += this.endline(H, $, O) + B, P = B.length;
                        else B = " " + N, Z += B, P += B.length
                    }
                } else {
                    k = H.attribs;
                    for (G in k) {
                        if (!z.call(k, G)) continue;
                        _ = k[G], Z += this.attribute(_, $, O)
                    }
                }
                if (this.stream.write(Z), D = H.children.length, j = D === 0 ? null : H.children[0], D === 0 || H.children.every(function(S) {
                        return (S.type === A.Text || S.type === A.Raw || S.type === A.CData) && S.value === ""
                    }))
                    if ($.allowEmpty) this.stream.write(">"), $.state = q.CloseTag, this.stream.write("</" + H.name + ">");
                    else $.state = q.CloseTag, this.stream.write($.spaceBeforeSlash + "/>");
                else if ($.pretty && D === 1 && (j.type === A.Text || j.type === A.Raw || j.type === A.CData) && j.value != null) this.stream.write(">"), $.state = q.InsideTag, $.suppressPrettyCount++, f = !0, this.writeChildNode(j, $, O + 1), $.suppressPrettyCount--, f = !1, $.state = q.CloseTag, this.stream.write("</" + H.name + ">");
                else {
                    this.stream.write(">" + this.endline(H, $, O)), $.state = q.InsideTag, y = H.children;
                    for (M = 0, W = y.length; M < W; M++) X = y[M], this.writeChildNode(X, $, O + 1);
                    $.state = q.CloseTag, this.stream.write(this.indent(H, $, O) + "</" + H.name + ">")
                }
                return this.stream.write(this.endline(H, $, O)), $.state = q.None, this.closeNode(H, $, O)
            }
            processingInstruction(H, $, O) {
                return this.stream.write(super.processingInstruction(H, $, O))
            }
            raw(H, $, O) {
                return this.stream.write(super.raw(H, $, O))
            }
            text(H, $, O) {
                return this.stream.write(super.text(H, $, O))
            }
            dtdAttList(H, $, O) {
                return this.stream.write(super.dtdAttList(H, $, O))
            }
            dtdElement(H, $, O) {
                return this.stream.write(super.dtdElement(H, $, O))
            }
            dtdEntity(H, $, O) {
                return this.stream.write(super.dtdEntity(H, $, O))
            }
            dtdNotation(H, $, O) {
                return this.stream.write(super.dtdNotation(H, $, O))
            }
        }
    }).call(yC4)
})
// @from(Ln 312462, Col 4)
IC4 = R((hC4, ls) => {
    (function() {
        var A, q, K, Y, z, w, H, $, O;
        ({
            assign: $,
            isFunction: O
        } = Vm()), K = xTA(), Y = FTA(), z = RC4(), H = AM6(), w = SC4(), A = SJ(), q = oF1(), hC4.create = function(_, J, X, D) {
            var j, M;
            if (_ == null) throw Error("Root element needs a name.");
            if (D = $({}, J, X, D), j = new Y(D), M = j.element(_), !D.headless) {
                if (j.declaration(D), D.pubID != null || D.sysID != null) j.dtd(D)
            }
            return M
        }, hC4.begin = function(_, J, X) {
            if (O(_))[J, X] = [_, J], _ = {};
            if (J) return new z(_, J, X);
            else return new Y(_)
        }, hC4.stringWriter = function(_) {
            return new H(_)
        }, hC4.streamWriter = function(_, J) {
            return new w(_, J)
        }, hC4.implementation = new K, hC4.nodeType = A, hC4.writerState = q
    }).call(hC4)
})
// @from(Ln 312486, Col 4)
uC4 = R((HPY) => {
    var xC4 = AwA(),
        KPY = IC4();
    HPY.build = wPY;

    function YPY(A) {
        function q(K) {
            return K < 10 ? "0" + K : K
        }
        return A.getUTCFullYear() + "-" + q(A.getUTCMonth() + 1) + "-" + q(A.getUTCDate()) + "T" + q(A.getUTCHours()) + ":" + q(A.getUTCMinutes()) + ":" + q(A.getUTCSeconds()) + "Z"
    }
    var zPY = Object.prototype.toString;

    function bC4(A) {
        var q = zPY.call(A).match(/\[object (.*)\]/);
        return q ? q[1] : q
    }

    function wPY(A, q) {
        var K = {
                version: "1.0",
                encoding: "UTF-8"
            },
            Y = {
                pubid: "-//Apple//DTD PLIST 1.0//EN",
                sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
            },
            z = KPY.create("plist");
        if (z.dec(K.version, K.encoding, K.standalone), z.dtd(Y.pubid, Y.sysid), z.att("version", "1.0"), QTA(A, z), !q) q = {};
        return q.pretty = q.pretty !== !1, z.end(q)
    }

    function QTA(A, q) {
        var K, Y, z, w = bC4(A);
        if (w == "Undefined") return;
        else if (Array.isArray(A)) {
            q = q.ele("array");
            for (Y = 0; Y < A.length; Y++) QTA(A[Y], q)
        } else if (Buffer.isBuffer(A)) q.ele("data").raw(A.toString("base64"));
        else if (w == "Object") {
            q = q.ele("dict");
            for (z in A)
                if (A.hasOwnProperty(z)) q.ele("key").txt(z), QTA(A[z], q)
        } else if (w == "Number") K = A % 1 === 0 ? "integer" : "real", q.ele(K).txt(A.toString());
        else if (w == "BigInt") q.ele("integer").txt(A);
        else if (w == "Date") q.ele("date").txt(YPY(new Date(A)));
        else if (w == "Boolean") q.ele(A ? "true" : "false");
        else if (w == "String") q.ele("string").txt(A);
        else if (w == "ArrayBuffer") q.ele("data").raw(xC4.fromByteArray(A));
        else if (A && A.buffer && bC4(A.buffer) == "ArrayBuffer") q.ele("data").raw(xC4.fromByteArray(new Uint8Array(A.buffer), q));
        else if (w === "Null") q.ele("null").txt("")
    }
})
// @from(Ln 312539, Col 4)
FC4 = R((gTA) => {
    var BC4 = My4();
    Object.keys(BC4).forEach(function(A) {
        gTA[A] = BC4[A]
    });
    var mC4 = uC4();
    Object.keys(mC4).forEach(function(A) {
        gTA[A] = mC4[A]
    })
})
// @from(Ln 312549, Col 0)
async function Nm(A, q) {
    let Y = f6().preferredNotifChannel;
    await UTA(A);
    let z = await OPY(Y, A, q);
    c("tengu_notification_method_used", {
        configured_channel: Y,
        method_used: z,
        term: xA.terminal
    })
}
// @from(Ln 312559, Col 0)
async function OPY(A, q, K) {
    let Y = q.title || gC4;
    try {
        switch (A) {
            case "auto":
                return _PY(q, K);
            case "iterm2":
                return K.notifyITerm2(q), "iterm2";
            case "iterm2_with_bell":
                return K.notifyITerm2(q), K.notifyBell(), "iterm2_with_bell";
            case "kitty":
                return K.notifyKitty({
                    ...q,
                    title: Y,
                    id: UC4()
                }), "kitty";
            case "terminal_bell":
                return K.notifyBell(), "terminal_bell";
            case "notifications_disabled":
                return "disabled";
            default:
                return "none"
        }
    } catch {
        return "error"
    }
}
// @from(Ln 312586, Col 0)
async function _PY(A, q) {
    let K = A.title || gC4;
    switch (xA.terminal) {
        case "Apple_Terminal": {
            if (await JPY()) return q.notifyBell(), "terminal_bell";
            return "no_method_available"
        }
        case "iTerm.app":
            return q.notifyITerm2(A), "iterm2";
        case "kitty":
            return q.notifyKitty({
                ...A,
                title: K,
                id: UC4()
            }), "kitty";
        case "ghostty":
            return q.notifyGhostty({
                ...A,
                title: K
            }), "ghostty";
        default:
            return "no_method_available"
    }
}
// @from(Ln 312611, Col 0)
function UC4() {
    return Math.floor(Math.random() * 1e4)
}
// @from(Ln 312614, Col 0)
async function JPY() {
    try {
        if (xA.terminal !== "Apple_Terminal") return !1;
        let q = (await IA("osascript", ["-e", 'tell application "Terminal" to name of current settings of front window'])).stdout.trim();
        if (!q) return !1;
        let K = await IA("defaults", ["export", "com.apple.Terminal", "-"]);
        if (K.code !== 0) return !1;
        let w = QC4.default.parse(K.stdout)?.["Window Settings"]?.[q];
        if (!w) return !1;
        return w.Bell === !1
    } catch (A) {
        return K1(A instanceof Error ? A : Error(String(A))), !1
    }
}
// @from(Ln 312628, Col 4)
QC4
// @from(Ln 312628, Col 9)
gC4 = "Claude Code"
// @from(Ln 312629, Col 4)
aF1 = v(() => {
    cA();
    tq();
    u6();
    G5();
    y6();
    aM();
    QC4 = o(FC4(), 1)
})
// @from(Ln 312638, Col 0)
async function pC4(A, q, K) {
    try {
        let Y = DH();
        if (Y.error) return;
        let z = {
                "Content-Type": "application/json",
                "User-Agent": XH(),
                ...Y.headers
            },
            w = {
                vcs_type: "github",
                vcs_host: q,
                vcs_username: A,
                git_user_email: K
            },
            H = "https://api.anthropic.com/api/claude_code/link_vcs_account";
        await sA.post(H, w, {
            headers: z,
            timeout: 5000
        })
    } catch (Y) {}
}
// @from(Ln 312660, Col 4)
dC4 = v(() => {
    y5();
    B0()
})
// @from(Ln 312664, Col 0)
async function XPY() {
    try {
        let A = await IA("gh", ["auth", "status", "--active", "--json", "hosts"], {
            useCwd: !1,
            timeout: 5000
        });
        if (A.code !== 0 || !A.stdout.trim()) return null;
        let K = _A(A.stdout)?.hosts;
        if (!K || typeof K !== "object") return null;
        for (let [Y, z] of Object.entries(K)) {
            if (!Array.isArray(z) || z.length === 0) continue;
            let w = z[0];
            if (w?.login) return {
                username: w.login,
                hostname: Y
            }
        }
        return null
    } catch (A) {
        return null
    }
}
// @from(Ln 312686, Col 0)
async function DPY() {
    try {
        let A = await IA(pq(), ["config", "--get", "user.email"], {
            useCwd: !1,
            timeout: 5000
        });
        if (A.code === 0 && A.stdout.trim()) return A.stdout.trim();
        return null
    } catch (A) {
        return null
    }
}
// @from(Ln 312698, Col 0)
async function pTA() {
    if (!$H(!0) && !w4()) return;
    if (cC()) return;
    if (!0) {
        let z = await Dj6();
        if (z.hasError || !z.vcsAccountLinkingEnabled) return
    }
    let [K, Y] = await Promise.all([XPY(), DPY()]);
    if (K || Y) pC4(K?.username ?? "", K?.hostname ?? "", Y ?? "")
}
// @from(Ln 312708, Col 4)
cC4 = v(() => {
    tq();
    dC4();
    J7();
    rNA();
    cA();
    B6();
    m6();
    h9()
})
// @from(Ln 312718, Col 4)
iC4 = {}