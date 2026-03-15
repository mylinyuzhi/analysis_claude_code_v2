
// @from(Ln 282033, Col 4)
qG1 = x((QG4, UG4) => {
    (function() {
        var A, q, K;
        K = tk(), A = rj(), UG4.exports = q = class extends K {
            constructor(z, _, w) {
                super(z);
                if (_ == null) throw Error("Missing DTD element name. " + this.debugInfo());
                if (!w) w = "(#PCDATA)";
                if (Array.isArray(w)) w = "(" + w.join(",") + ")";
                this.name = this.stringify.name(_), this.type = A.ElementDeclaration, this.value = this.stringify.dtdElementValue(w)
            }
            toString(z) {
                return this.options.writer.dtdElement(this, this.options.writer.filterOptions(z))
            }
        }
    }).call(QG4)
})
// @from(Ln 282050, Col 4)
KG1 = x((dG4, cG4) => {
    (function() {
        var A, q, K;
        K = tk(), A = rj(), cG4.exports = q = function() {
            class Y extends K {
                constructor(z, _, w) {
                    super(z);
                    if (_ == null) throw Error("Missing DTD notation name. " + this.debugInfo(_));
                    if (!w.pubID && !w.sysID) throw Error("Public or system identifiers are required for an external entity. " + this.debugInfo(_));
                    if (this.name = this.stringify.name(_), this.type = A.NotationDeclaration, w.pubID != null) this.pubID = this.stringify.dtdPubID(w.pubID);
                    if (w.sysID != null) this.sysID = this.stringify.dtdSysID(w.sysID)
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
    }).call(dG4)
})
// @from(Ln 282078, Col 4)
YG1 = x((lG4, iG4) => {
    (function() {
        var A, q, K, Y, z, _, w, O, $;
        ({
            isObject: $
        } = $g()), O = tk(), A = rj(), q = eZ1(), Y = AG1(), K = qG1(), z = KG1(), w = rZ1(), iG4.exports = _ = function() {
            class H extends O {
                constructor(j, J, M) {
                    var D, X, P, W;
                    super(j);
                    if (this.type = A.DocType, j.children) {
                        W = j.children;
                        for (X = 0, P = W.length; X < P; X++)
                            if (D = W[X], D.type === A.Element) {
                                this.name = D.name;
                                break
                            }
                    }
                    if (this.documentObject = j, $(J))({
                        pubID: J,
                        sysID: M
                    } = J);
                    if (M == null)[M, J] = [J, M];
                    if (J != null) this.pubID = this.stringify.dtdPubID(J);
                    if (M != null) this.sysID = this.stringify.dtdSysID(M)
                }
                element(j, J) {
                    var M = new K(this, j, J);
                    return this.children.push(M), this
                }
                attList(j, J, M, D, X) {
                    var P = new q(this, j, J, M, D, X);
                    return this.children.push(P), this
                }
                entity(j, J) {
                    var M = new Y(this, !1, j, J);
                    return this.children.push(M), this
                }
                pEntity(j, J) {
                    var M = new Y(this, !0, j, J);
                    return this.children.push(M), this
                }
                notation(j, J) {
                    var M = new z(this, j, J);
                    return this.children.push(M), this
                }
                toString(j) {
                    return this.options.writer.docType(this, this.options.writer.filterOptions(j))
                }
                ele(j, J) {
                    return this.element(j, J)
                }
                att(j, J, M, D, X) {
                    return this.attList(j, J, M, D, X)
                }
                ent(j, J) {
                    return this.entity(j, J)
                }
                pent(j, J) {
                    return this.pEntity(j, J)
                }
                not(j, J) {
                    return this.notation(j, J)
                }
                up() {
                    return this.root() || this.documentObject
                }
                isEqualNode(j) {
                    if (!super.isEqualNode(j)) return !1;
                    if (j.name !== this.name) return !1;
                    if (j.publicId !== this.publicId) return !1;
                    if (j.systemId !== this.systemId) return !1;
                    return !0
                }
            }
            return Object.defineProperty(H.prototype, "entities", {
                get: function() {
                    var j, J, M, D, X;
                    D = {}, X = this.children;
                    for (J = 0, M = X.length; J < M; J++)
                        if (j = X[J], j.type === A.EntityDeclaration && !j.pe) D[j.name] = j;
                    return new w(D)
                }
            }), Object.defineProperty(H.prototype, "notations", {
                get: function() {
                    var j, J, M, D, X;
                    D = {}, X = this.children;
                    for (J = 0, M = X.length; J < M; J++)
                        if (j = X[J], j.type === A.NotationDeclaration) D[j.name] = j;
                    return new w(D)
                }
            }), Object.defineProperty(H.prototype, "publicId", {
                get: function() {
                    return this.pubID
                }
            }), Object.defineProperty(H.prototype, "systemId", {
                get: function() {
                    return this.sysID
                }
            }), Object.defineProperty(H.prototype, "internalSubset", {
                get: function() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }), H
        }.call(this)
    }).call(lG4)
})
// @from(Ln 282185, Col 4)
zG1 = x((nG4, rG4) => {
    (function() {
        var A, q, K;
        A = rj(), q = tk(), rG4.exports = K = class extends q {
            constructor(z, _) {
                super(z);
                if (_ == null) throw Error("Missing raw text. " + this.debugInfo());
                this.type = A.Raw, this.value = this.stringify.raw(_)
            }
            clone() {
                return Object.create(this)
            }
            toString(z) {
                return this.options.writer.raw(this, this.options.writer.filterOptions(z))
            }
        }
    }).call(nG4)
})
// @from(Ln 282203, Col 4)
_G1 = x((oG4, aG4) => {
    (function() {
        var A, q, K;
        A = rj(), q = JU6(), aG4.exports = K = function() {
            class Y extends q {
                constructor(z, _) {
                    super(z);
                    if (_ == null) throw Error("Missing element text. " + this.debugInfo());
                    this.name = "#text", this.type = A.Text, this.value = this.stringify.text(_)
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
                    var z, _, w;
                    w = "", _ = this.previousSibling;
                    while (_) w = _.data + w, _ = _.previousSibling;
                    w += this.data, z = this.nextSibling;
                    while (z) w = w + z.data, z = z.nextSibling;
                    return w
                }
            }), Y
        }.call(this)
    }).call(oG4)
})
// @from(Ln 282243, Col 4)
wG1 = x((sG4, tG4) => {
    (function() {
        var A, q, K;
        A = rj(), q = JU6(), tG4.exports = K = class extends q {
            constructor(z, _, w) {
                super(z);
                if (_ == null) throw Error("Missing instruction target. " + this.debugInfo());
                if (this.type = A.ProcessingInstruction, this.target = this.stringify.insTarget(_), this.name = this.target, w) this.value = this.stringify.insValue(w)
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
    }).call(sG4)
})
// @from(Ln 282266, Col 4)
NL8 = x((eG4, Af4) => {
    (function() {
        var A, q, K;
        K = tk(), A = rj(), Af4.exports = q = class extends K {
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
    }).call(eG4)
})
// @from(Ln 282283, Col 4)
Yf4 = x((qf4, Kf4) => {
    (function() {
        var A;
        Kf4.exports = A = function() {
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
    }).call(qf4)
})
// @from(Ln 282306, Col 4)
wf4 = x((zf4, _f4) => {
    (function() {
        _f4.exports = {
            Disconnected: 1,
            Preceding: 2,
            Following: 4,
            Contains: 8,
            ContainedBy: 16,
            ImplementationSpecific: 32
        }
    }).call(zf4)
})
// @from(Ln 282318, Col 4)
tk = x((Of4, $f4) => {
    (function() {
        var A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G = {}.hasOwnProperty,
            f = [].splice;
        ({
            isObject: Z,
            isFunction: W,
            isEmpty: P,
            getValue: X
        } = $g()), O = null, K = null, Y = null, z = null, _ = null, M = null, D = null, J = null, w = null, q = null, j = null, $ = null, A = null, $f4.exports = H = function() {
            class v {
                constructor(N) {
                    if (this.parent = N, this.parent) this.options = this.parent.options, this.stringify = this.parent.stringify;
                    if (this.value = null, this.children = [], this.baseURI = null, !O) O = oZ1(), K = aZ1(), Y = sZ1(), z = tZ1(), _ = YG1(), M = zG1(), D = _G1(), J = wG1(), w = NL8(), q = rj(), j = Yf4(), $ = rZ1(), A = wf4()
                }
                setParent(N) {
                    var V, L, h, R, u;
                    if (this.parent = N, N) this.options = N.options, this.stringify = N.stringify;
                    R = this.children, u = [];
                    for (L = 0, h = R.length; L < h; L++) V = R[L], u.push(V.setParent(this));
                    return u
                }
                element(N, V, L) {
                    var h, R, u, I, g, B, b, p, Q;
                    if (B = null, V === null && L == null)[V, L] = [{}, null];
                    if (V == null) V = {};
                    if (V = X(V), !Z(V))[L, V] = [V, L];
                    if (N != null) N = X(N);
                    if (Array.isArray(N))
                        for (u = 0, b = N.length; u < b; u++) R = N[u], B = this.element(R);
                    else if (W(N)) B = this.element(N.apply());
                    else if (Z(N))
                        for (g in N) {
                            if (!G.call(N, g)) continue;
                            if (Q = N[g], W(Q)) Q = Q.apply();
                            if (!this.options.ignoreDecorators && this.stringify.convertAttKey && g.indexOf(this.stringify.convertAttKey) === 0) B = this.attribute(g.substr(this.stringify.convertAttKey.length), Q);
                            else if (!this.options.separateArrayItems && Array.isArray(Q) && P(Q)) B = this.dummy();
                            else if (Z(Q) && P(Q)) B = this.element(g);
                            else if (!this.options.keepNullNodes && Q == null) B = this.dummy();
                            else if (!this.options.separateArrayItems && Array.isArray(Q))
                                for (I = 0, p = Q.length; I < p; I++) R = Q[I], h = {}, h[g] = R, B = this.element(h);
                            else if (Z(Q))
                                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && g.indexOf(this.stringify.convertTextKey) === 0) B = this.element(Q);
                                else B = this.element(g), B.element(Q);
                            else B = this.element(g, Q)
                        } else if (!this.options.keepNullNodes && L === null) B = this.dummy();
                        else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && N.indexOf(this.stringify.convertTextKey) === 0) B = this.text(L);
                    else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && N.indexOf(this.stringify.convertCDataKey) === 0) B = this.cdata(L);
                    else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && N.indexOf(this.stringify.convertCommentKey) === 0) B = this.comment(L);
                    else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && N.indexOf(this.stringify.convertRawKey) === 0) B = this.raw(L);
                    else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && N.indexOf(this.stringify.convertPIKey) === 0) B = this.instruction(N.substr(this.stringify.convertPIKey.length), L);
                    else B = this.node(N, V, L);
                    if (B == null) throw Error("Could not create any elements with: " + N + ". " + this.debugInfo());
                    return B
                }
                insertBefore(N, V, L) {
                    var h, R, u, I, g;
                    if (N != null ? N.type : void 0) {
                        if (u = N, I = V, u.setParent(this), I) R = children.indexOf(I), g = children.splice(R), children.push(u), Array.prototype.push.apply(children, g);
                        else children.push(u);
                        return u
                    } else {
                        if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(N));
                        return R = this.parent.children.indexOf(this), g = this.parent.children.splice(R), h = this.parent.element(N, V, L), Array.prototype.push.apply(this.parent.children, g), h
                    }
                }
                insertAfter(N, V, L) {
                    var h, R, u;
                    if (this.isRoot) throw Error("Cannot insert elements at root level. " + this.debugInfo(N));
                    return R = this.parent.children.indexOf(this), u = this.parent.children.splice(R + 1), h = this.parent.element(N, V, L), Array.prototype.push.apply(this.parent.children, u), h
                }
                remove() {
                    var N, V;
                    if (this.isRoot) throw Error("Cannot remove the root element. " + this.debugInfo());
                    return N = this.parent.children.indexOf(this), f.apply(this.parent.children, [N, N - N + 1].concat(V = [])), this.parent
                }
                node(N, V, L) {
                    var h;
                    if (N != null) N = X(N);
                    if (V || (V = {}), V = X(V), !Z(V))[L, V] = [V, L];
                    if (h = new O(this, N, V), L != null) h.text(L);
                    return this.children.push(h), h
                }
                text(N) {
                    var V;
                    if (Z(N)) this.element(N);
                    return V = new D(this, N), this.children.push(V), this
                }
                cdata(N) {
                    var V = new K(this, N);
                    return this.children.push(V), this
                }
                comment(N) {
                    var V = new Y(this, N);
                    return this.children.push(V), this
                }
                commentBefore(N) {
                    var V, L, h;
                    return L = this.parent.children.indexOf(this), h = this.parent.children.splice(L), V = this.parent.comment(N), Array.prototype.push.apply(this.parent.children, h), this
                }
                commentAfter(N) {
                    var V, L, h;
                    return L = this.parent.children.indexOf(this), h = this.parent.children.splice(L + 1), V = this.parent.comment(N), Array.prototype.push.apply(this.parent.children, h), this
                }
                raw(N) {
                    var V = new M(this, N);
                    return this.children.push(V), this
                }
                dummy() {
                    var N = new w(this);
                    return N
                }
                instruction(N, V) {
                    var L, h, R, u, I;
                    if (N != null) N = X(N);
                    if (V != null) V = X(V);
                    if (Array.isArray(N))
                        for (u = 0, I = N.length; u < I; u++) L = N[u], this.instruction(L);
                    else if (Z(N))
                        for (L in N) {
                            if (!G.call(N, L)) continue;
                            h = N[L], this.instruction(L, h)
                        } else {
                            if (W(V)) V = V.apply();
                            R = new J(this, N, V), this.children.push(R)
                        }
                    return this
                }
                instructionBefore(N, V) {
                    var L, h, R;
                    return h = this.parent.children.indexOf(this), R = this.parent.children.splice(h), L = this.parent.instruction(N, V), Array.prototype.push.apply(this.parent.children, R), this
                }
                instructionAfter(N, V) {
                    var L, h, R;
                    return h = this.parent.children.indexOf(this), R = this.parent.children.splice(h + 1), L = this.parent.instruction(N, V), Array.prototype.push.apply(this.parent.children, R), this
                }
                declaration(N, V, L) {
                    var h, R;
                    if (h = this.document(), R = new z(h, N, V, L), h.children.length === 0) h.children.unshift(R);
                    else if (h.children[0].type === q.Declaration) h.children[0] = R;
                    else h.children.unshift(R);
                    return h.root() || h
                }
                dtd(N, V) {
                    var L, h, R, u, I, g, B, b, p, Q;
                    h = this.document(), R = new _(h, N, V), p = h.children;
                    for (u = I = 0, B = p.length; I < B; u = ++I)
                        if (L = p[u], L.type === q.DocType) return h.children[u] = R, R;
                    Q = h.children;
                    for (u = g = 0, b = Q.length; g < b; u = ++g)
                        if (L = Q[u], L.isRoot) return h.children.splice(u, 0, R), R;
                    return h.children.push(R), R
                }
                up() {
                    if (this.isRoot) throw Error("The root node has no parent. Use doc() if you need to get the document object.");
                    return this.parent
                }
                root() {
                    var N = this;
                    while (N)
                        if (N.type === q.Document) return N.rootObject;
                        else if (N.isRoot) return N;
                    else N = N.parent
                }
                document() {
                    var N = this;
                    while (N)
                        if (N.type === q.Document) return N;
                        else N = N.parent
                }
                end(N) {
                    return this.document().end(N)
                }
                prev() {
                    var N = this.parent.children.indexOf(this);
                    if (N < 1) throw Error("Already at the first node. " + this.debugInfo());
                    return this.parent.children[N - 1]
                }
                next() {
                    var N = this.parent.children.indexOf(this);
                    if (N === -1 || N === this.parent.children.length - 1) throw Error("Already at the last node. " + this.debugInfo());
                    return this.parent.children[N + 1]
                }
                importDocument(N) {
                    var V, L, h, R, u;
                    if (L = N.root().clone(), L.parent = this, L.isRoot = !1, this.children.push(L), this.type === q.Document) {
                        if (L.isRoot = !0, L.documentObject = this, this.rootObject = L, this.children) {
                            u = this.children;
                            for (h = 0, R = u.length; h < R; h++)
                                if (V = u[h], V.type === q.DocType) {
                                    V.name = L.name;
                                    break
                                }
                        }
                    }
                    return this
                }
                debugInfo(N) {
                    var V, L;
                    if (N = N || this.name, N == null && !((V = this.parent) != null ? V.name : void 0)) return "";
                    else if (N == null) return "parent: <" + this.parent.name + ">";
                    else if (!((L = this.parent) != null ? L.name : void 0)) return "node: <" + N + ">";
                    else return "node: <" + N + ">, parent: <" + this.parent.name + ">"
                }
                ele(N, V, L) {
                    return this.element(N, V, L)
                }
                nod(N, V, L) {
                    return this.node(N, V, L)
                }
                txt(N) {
                    return this.text(N)
                }
                dat(N) {
                    return this.cdata(N)
                }
                com(N) {
                    return this.comment(N)
                }
                ins(N, V) {
                    return this.instruction(N, V)
                }
                doc() {
                    return this.document()
                }
                dec(N, V, L) {
                    return this.declaration(N, V, L)
                }
                e(N, V, L) {
                    return this.element(N, V, L)
                }
                n(N, V, L) {
                    return this.node(N, V, L)
                }
                t(N) {
                    return this.text(N)
                }
                d(N) {
                    return this.cdata(N)
                }
                c(N) {
                    return this.comment(N)
                }
                r(N) {
                    return this.raw(N)
                }
                i(N, V) {
                    return this.instruction(N, V)
                }
                u() {
                    return this.up()
                }
                importXMLBuilder(N) {
                    return this.importDocument(N)
                }
                attribute(N, V) {
                    throw Error("attribute() applies to element nodes only.")
                }
                att(N, V) {
                    return this.attribute(N, V)
                }
                a(N, V) {
                    return this.attribute(N, V)
                }
                removeAttribute(N) {
                    throw Error("attribute() applies to element nodes only.")
                }
                replaceChild(N, V) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                removeChild(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                appendChild(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                hasChildNodes() {
                    return this.children.length !== 0
                }
                cloneNode(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                normalize() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isSupported(N, V) {
                    return !0
                }
                hasAttributes() {
                    return this.attribs.length !== 0
                }
                compareDocumentPosition(N) {
                    var V, L;
                    if (V = this, V === N) return 0;
                    else if (this.document() !== N.document()) {
                        if (L = A.Disconnected | A.ImplementationSpecific, Math.random() < 0.5) L |= A.Preceding;
                        else L |= A.Following;
                        return L
                    } else if (V.isAncestor(N)) return A.Contains | A.Preceding;
                    else if (V.isDescendant(N)) return A.Contains | A.Following;
                    else if (V.isPreceding(N)) return A.Preceding;
                    else return A.Following
                }
                isSameNode(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                lookupPrefix(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isDefaultNamespace(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                lookupNamespaceURI(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                isEqualNode(N) {
                    var V, L, h;
                    if (N.nodeType !== this.nodeType) return !1;
                    if (N.children.length !== this.children.length) return !1;
                    for (V = L = 0, h = this.children.length - 1; 0 <= h ? L <= h : L >= h; V = 0 <= h ? ++L : --L)
                        if (!this.children[V].isEqualNode(N.children[V])) return !1;
                    return !0
                }
                getFeature(N, V) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                setUserData(N, V, L) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getUserData(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                contains(N) {
                    if (!N) return !1;
                    return N === this || this.isDescendant(N)
                }
                isDescendant(N) {
                    var V, L, h, R, u;
                    u = this.children;
                    for (h = 0, R = u.length; h < R; h++) {
                        if (V = u[h], N === V) return !0;
                        if (L = V.isDescendant(N), L) return !0
                    }
                    return !1
                }
                isAncestor(N) {
                    return N.isDescendant(this)
                }
                isPreceding(N) {
                    var V, L;
                    if (V = this.treePosition(N), L = this.treePosition(this), V === -1 || L === -1) return !1;
                    else return V < L
                }
                isFollowing(N) {
                    var V, L;
                    if (V = this.treePosition(N), L = this.treePosition(this), V === -1 || L === -1) return !1;
                    else return V > L
                }
                treePosition(N) {
                    var V, L;
                    if (L = 0, V = !1, this.foreachTreeNode(this.document(), function(h) {
                            if (L++, !V && h === N) return V = !0
                        }), V) return L;
                    else return -1
                }
                foreachTreeNode(N, V) {
                    var L, h, R, u, I;
                    N || (N = this.document()), u = N.children;
                    for (h = 0, R = u.length; h < R; h++)
                        if (L = u[h], I = V(L)) return I;
                        else if (I = this.foreachTreeNode(L, V), I) return I
                }
            }
            return Object.defineProperty(v.prototype, "nodeName", {
                get: function() {
                    return this.name
                }
            }), Object.defineProperty(v.prototype, "nodeType", {
                get: function() {
                    return this.type
                }
            }), Object.defineProperty(v.prototype, "nodeValue", {
                get: function() {
                    return this.value
                }
            }), Object.defineProperty(v.prototype, "parentNode", {
                get: function() {
                    return this.parent
                }
            }), Object.defineProperty(v.prototype, "childNodes", {
                get: function() {
                    if (!this.childNodeList || !this.childNodeList.nodes) this.childNodeList = new j(this.children);
                    return this.childNodeList
                }
            }), Object.defineProperty(v.prototype, "firstChild", {
                get: function() {
                    return this.children[0] || null
                }
            }), Object.defineProperty(v.prototype, "lastChild", {
                get: function() {
                    return this.children[this.children.length - 1] || null
                }
            }), Object.defineProperty(v.prototype, "previousSibling", {
                get: function() {
                    var N = this.parent.children.indexOf(this);
                    return this.parent.children[N - 1] || null
                }
            }), Object.defineProperty(v.prototype, "nextSibling", {
                get: function() {
                    var N = this.parent.children.indexOf(this);
                    return this.parent.children[N + 1] || null
                }
            }), Object.defineProperty(v.prototype, "ownerDocument", {
                get: function() {
                    return this.document() || null
                }
            }), Object.defineProperty(v.prototype, "textContent", {
                get: function() {
                    var N, V, L, h, R;
                    if (this.nodeType === q.Element || this.nodeType === q.DocumentFragment) {
                        R = "", h = this.children;
                        for (V = 0, L = h.length; V < L; V++)
                            if (N = h[V], N.textContent) R += N.textContent;
                        return R
                    } else return null
                },
                set: function(N) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }), v
        }.call(this)
    }).call(Of4)
})
// @from(Ln 282751, Col 4)
VL8 = x((Hf4, jf4) => {
    (function() {
        var A, q = {}.hasOwnProperty;
        jf4.exports = A = function() {
            class K {
                constructor(Y) {
                    var z, _, w;
                    if (this.assertLegalChar = this.assertLegalChar.bind(this), this.assertLegalName = this.assertLegalName.bind(this), Y || (Y = {}), this.options = Y, !this.options.version) this.options.version = "1.0";
                    _ = Y.stringify || {};
                    for (z in _) {
                        if (!q.call(_, z)) continue;
                        w = _[z], this[z] = w
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
                    var z, _;
                    if (this.options.noValidation) return Y;
                    if (this.options.version === "1.0") {
                        if (z = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) Y = Y.replace(z, this.options.invalidCharReplacement);
                        else if (_ = Y.match(z)) throw Error(`Invalid character in string: ${Y} at index ${_.index}`)
                    } else if (this.options.version === "1.1") {
                        if (z = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, this.options.invalidCharReplacement !== void 0) Y = Y.replace(z, this.options.invalidCharReplacement);
                        else if (_ = Y.match(z)) throw Error(`Invalid character in string: ${Y} at index ${_.index}`)
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
    }).call(Hf4)
})
// @from(Ln 282875, Col 4)
MU6 = x((Jf4, Mf4) => {
    (function() {
        Mf4.exports = {
            None: 0,
            OpenTag: 1,
            InsideTag: 2,
            CloseTag: 3
        }
    }).call(Jf4)
})
// @from(Ln 282885, Col 4)
kL8 = x((Df4, Xf4) => {
    (function() {
        var A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z = {}.hasOwnProperty;
        ({
            assign: W
        } = $g()), A = rj(), $ = tZ1(), H = YG1(), K = aZ1(), Y = sZ1(), J = oZ1(), D = zG1(), X = _G1(), M = wG1(), j = NL8(), z = eZ1(), _ = qG1(), w = AG1(), O = KG1(), q = MU6(), Xf4.exports = P = class {
            constructor(f) {
                var v, N, V;
                f || (f = {}), this.options = f, N = f.writer || {};
                for (v in N) {
                    if (!Z.call(N, v)) continue;
                    V = N[v], this["_" + v] = this[v], this[v] = V
                }
            }
            filterOptions(f) {
                var v, N, V, L, h, R, u, I, g;
                if (f || (f = {}), f = W({}, this.options, f), v = {
                        writer: this
                    }, v.pretty = f.pretty || !1, v.allowEmpty = f.allowEmpty || !1, v.indent = (N = f.indent) != null ? N : "  ", v.newline = (V = f.newline) != null ? V : `
`, v.offset = (L = f.offset) != null ? L : 0, v.width = (h = f.width) != null ? h : 0, v.dontPrettyTextNodes = (R = (u = f.dontPrettyTextNodes) != null ? u : f.dontprettytextnodes) != null ? R : 0, v.spaceBeforeSlash = (I = (g = f.spaceBeforeSlash) != null ? g : f.spacebeforeslash) != null ? I : "", v.spaceBeforeSlash === !0) v.spaceBeforeSlash = " ";
                return v.suppressPrettyCount = 0, v.user = {}, v.state = q.None, v
            }
            indent(f, v, N) {
                var V;
                if (!v.pretty || v.suppressPrettyCount) return "";
                else if (v.pretty) {
                    if (V = (N || 0) + v.offset + 1, V > 0) return Array(V).join(v.indent)
                }
                return ""
            }
            endline(f, v, N) {
                if (!v.pretty || v.suppressPrettyCount) return "";
                else return v.newline
            }
            attribute(f, v, N) {
                var V;
                if (this.openAttribute(f, v, N), v.pretty && v.width > 0) V = f.name + '="' + f.value + '"';
                else V = " " + f.name + '="' + f.value + '"';
                return this.closeAttribute(f, v, N), V
            }
            cdata(f, v, N) {
                var V;
                return this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<![CDATA[", v.state = q.InsideTag, V += f.value, v.state = q.CloseTag, V += "]]>" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            comment(f, v, N) {
                var V;
                return this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<!-- ", v.state = q.InsideTag, V += f.value, v.state = q.CloseTag, V += " -->" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            declaration(f, v, N) {
                var V;
                if (this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<?xml", v.state = q.InsideTag, V += ' version="' + f.version + '"', f.encoding != null) V += ' encoding="' + f.encoding + '"';
                if (f.standalone != null) V += ' standalone="' + f.standalone + '"';
                return v.state = q.CloseTag, V += v.spaceBeforeSlash + "?>", V += this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            docType(f, v, N) {
                var V, L, h, R, u;
                if (N || (N = 0), this.openNode(f, v, N), v.state = q.OpenTag, R = this.indent(f, v, N), R += "<!DOCTYPE " + f.root().name, f.pubID && f.sysID) R += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                else if (f.sysID) R += ' SYSTEM "' + f.sysID + '"';
                if (f.children.length > 0) {
                    R += " [", R += this.endline(f, v, N), v.state = q.InsideTag, u = f.children;
                    for (L = 0, h = u.length; L < h; L++) V = u[L], R += this.writeChildNode(V, v, N + 1);
                    v.state = q.CloseTag, R += "]"
                }
                return v.state = q.CloseTag, R += v.spaceBeforeSlash + ">", R += this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), R
            }
            element(f, v, N) {
                var V, L, h, R, u, I, g, B, b, p, Q, U, r, e, Y6, H6, J6, K6, s;
                if (N || (N = 0), U = !1, this.openNode(f, v, N), v.state = q.OpenTag, r = this.indent(f, v, N) + "<" + f.name, v.pretty && v.width > 0) {
                    B = r.length, Y6 = f.attribs;
                    for (Q in Y6) {
                        if (!Z.call(Y6, Q)) continue;
                        if (V = Y6[Q], e = this.attribute(V, v, N), L = e.length, B + L > v.width) s = this.indent(f, v, N + 1) + e, r += this.endline(f, v, N) + s, B = s.length;
                        else s = " " + e, r += s, B += s.length
                    }
                } else {
                    H6 = f.attribs;
                    for (Q in H6) {
                        if (!Z.call(H6, Q)) continue;
                        V = H6[Q], r += this.attribute(V, v, N)
                    }
                }
                if (R = f.children.length, u = R === 0 ? null : f.children[0], R === 0 || f.children.every(function(X6) {
                        return (X6.type === A.Text || X6.type === A.Raw || X6.type === A.CData) && X6.value === ""
                    }))
                    if (v.allowEmpty) r += ">", v.state = q.CloseTag, r += "</" + f.name + ">" + this.endline(f, v, N);
                    else v.state = q.CloseTag, r += v.spaceBeforeSlash + "/>" + this.endline(f, v, N);
                else if (v.pretty && R === 1 && (u.type === A.Text || u.type === A.Raw || u.type === A.CData) && u.value != null) r += ">", v.state = q.InsideTag, v.suppressPrettyCount++, U = !0, r += this.writeChildNode(u, v, N + 1), v.suppressPrettyCount--, U = !1, v.state = q.CloseTag, r += "</" + f.name + ">" + this.endline(f, v, N);
                else {
                    if (v.dontPrettyTextNodes) {
                        J6 = f.children;
                        for (I = 0, b = J6.length; I < b; I++)
                            if (h = J6[I], (h.type === A.Text || h.type === A.Raw || h.type === A.CData) && h.value != null) {
                                v.suppressPrettyCount++, U = !0;
                                break
                            }
                    }
                    r += ">" + this.endline(f, v, N), v.state = q.InsideTag, K6 = f.children;
                    for (g = 0, p = K6.length; g < p; g++) h = K6[g], r += this.writeChildNode(h, v, N + 1);
                    if (v.state = q.CloseTag, r += this.indent(f, v, N) + "</" + f.name + ">", U) v.suppressPrettyCount--;
                    r += this.endline(f, v, N), v.state = q.None
                }
                return this.closeNode(f, v, N), r
            }
            writeChildNode(f, v, N) {
                switch (f.type) {
                    case A.CData:
                        return this.cdata(f, v, N);
                    case A.Comment:
                        return this.comment(f, v, N);
                    case A.Element:
                        return this.element(f, v, N);
                    case A.Raw:
                        return this.raw(f, v, N);
                    case A.Text:
                        return this.text(f, v, N);
                    case A.ProcessingInstruction:
                        return this.processingInstruction(f, v, N);
                    case A.Dummy:
                        return "";
                    case A.Declaration:
                        return this.declaration(f, v, N);
                    case A.DocType:
                        return this.docType(f, v, N);
                    case A.AttributeDeclaration:
                        return this.dtdAttList(f, v, N);
                    case A.ElementDeclaration:
                        return this.dtdElement(f, v, N);
                    case A.EntityDeclaration:
                        return this.dtdEntity(f, v, N);
                    case A.NotationDeclaration:
                        return this.dtdNotation(f, v, N);
                    default:
                        throw Error("Unknown XML node type: " + f.constructor.name)
                }
            }
            processingInstruction(f, v, N) {
                var V;
                if (this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<?", v.state = q.InsideTag, V += f.target, f.value) V += " " + f.value;
                return v.state = q.CloseTag, V += v.spaceBeforeSlash + "?>", V += this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            raw(f, v, N) {
                var V;
                return this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N), v.state = q.InsideTag, V += f.value, v.state = q.CloseTag, V += this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            text(f, v, N) {
                var V;
                return this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N), v.state = q.InsideTag, V += f.value, v.state = q.CloseTag, V += this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            dtdAttList(f, v, N) {
                var V;
                if (this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<!ATTLIST", v.state = q.InsideTag, V += " " + f.elementName + " " + f.attributeName + " " + f.attributeType, f.defaultValueType !== "#DEFAULT") V += " " + f.defaultValueType;
                if (f.defaultValue) V += ' "' + f.defaultValue + '"';
                return v.state = q.CloseTag, V += v.spaceBeforeSlash + ">" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            dtdElement(f, v, N) {
                var V;
                return this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<!ELEMENT", v.state = q.InsideTag, V += " " + f.name + " " + f.value, v.state = q.CloseTag, V += v.spaceBeforeSlash + ">" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            dtdEntity(f, v, N) {
                var V;
                if (this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<!ENTITY", v.state = q.InsideTag, f.pe) V += " %";
                if (V += " " + f.name, f.value) V += ' "' + f.value + '"';
                else {
                    if (f.pubID && f.sysID) V += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                    else if (f.sysID) V += ' SYSTEM "' + f.sysID + '"';
                    if (f.nData) V += " NDATA " + f.nData
                }
                return v.state = q.CloseTag, V += v.spaceBeforeSlash + ">" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            dtdNotation(f, v, N) {
                var V;
                if (this.openNode(f, v, N), v.state = q.OpenTag, V = this.indent(f, v, N) + "<!NOTATION", v.state = q.InsideTag, V += " " + f.name, f.pubID && f.sysID) V += ' PUBLIC "' + f.pubID + '" "' + f.sysID + '"';
                else if (f.pubID) V += ' PUBLIC "' + f.pubID + '"';
                else if (f.sysID) V += ' SYSTEM "' + f.sysID + '"';
                return v.state = q.CloseTag, V += v.spaceBeforeSlash + ">" + this.endline(f, v, N), v.state = q.None, this.closeNode(f, v, N), V
            }
            openNode(f, v, N) {}
            closeNode(f, v, N) {}
            openAttribute(f, v, N) {}
            closeAttribute(f, v, N) {}
        }
    }).call(Df4)
})
// @from(Ln 283068, Col 4)
OG1 = x((Pf4, Wf4) => {
    (function() {
        var A, q;
        q = kL8(), Wf4.exports = A = class extends q {
            constructor(Y) {
                super(Y)
            }
            document(Y, z) {
                var _, w, O, $, H;
                z = this.filterOptions(z), $ = "", H = Y.children;
                for (w = 0, O = H.length; w < O; w++) _ = H[w], $ += this.writeChildNode(_, z, 0);
                if (z.pretty && $.slice(-z.newline.length) === z.newline) $ = $.slice(0, -z.newline.length);
                return $
            }
        }
    }).call(Pf4)
})
// @from(Ln 283085, Col 4)
EL8 = x((Zf4, Gf4) => {
    (function() {
        var A, q, K, Y, z, _, w, O;
        ({
            isPlainObject: O
        } = $g()), K = TL8(), q = TG4(), z = tk(), A = rj(), w = VL8(), _ = OG1(), Gf4.exports = Y = function() {
            class $ extends z {
                constructor(H) {
                    super(null);
                    if (this.name = "#document", this.type = A.Document, this.documentURI = null, this.domConfig = new q, H || (H = {}), !H.writer) H.writer = new _;
                    this.options = H, this.stringify = new w(H)
                }
                end(H) {
                    var j = {};
                    if (!H) H = this.options.writer;
                    else if (O(H)) j = H, H = this.options.writer;
                    return H.document(this, H.filterOptions(j))
                }
                toString(H) {
                    return this.options.writer.document(this, this.options.writer.filterOptions(H))
                }
                createElement(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createDocumentFragment() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTextNode(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createComment(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createCDATASection(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createProcessingInstruction(H, j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttribute(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEntityReference(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagName(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                importNode(H, j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createElementNS(H, j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createAttributeNS(H, j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByTagNameNS(H, j) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementById(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                adoptNode(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                normalizeDocument() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                renameNode(H, j, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                getElementsByClassName(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createEvent(H) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createRange() {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createNodeIterator(H, j, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
                createTreeWalker(H, j, J) {
                    throw Error("This DOM method is not implemented." + this.debugInfo())
                }
            }
            return Object.defineProperty($.prototype, "implementation", {
                value: new K
            }), Object.defineProperty($.prototype, "doctype", {
                get: function() {
                    var H, j, J, M;
                    M = this.children;
                    for (j = 0, J = M.length; j < J; j++)
                        if (H = M[j], H.type === A.DocType) return H;
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
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].encoding;
                    else return null
                }
            }), Object.defineProperty($.prototype, "xmlStandalone", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].standalone === "yes";
                    else return !1
                }
            }), Object.defineProperty($.prototype, "xmlVersion", {
                get: function() {
                    if (this.children.length !== 0 && this.children[0].type === A.Declaration) return this.children[0].version;
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
    }).call(Zf4)
})
// @from(Ln 283234, Col 4)
vf4 = x((ff4, Tf4) => {
    (function() {
        var A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G, f, v, N, V, L = {}.hasOwnProperty;
        ({
            isObject: N,
            isFunction: v,
            isPlainObject: V,
            getValue: f
        } = $g()), A = rj(), J = EL8(), D = oZ1(), Y = aZ1(), z = sZ1(), P = zG1(), G = _G1(), X = wG1(), H = tZ1(), j = YG1(), _ = eZ1(), O = AG1(), w = qG1(), $ = KG1(), K = vL8(), Z = VL8(), W = OG1(), q = MU6(), Tf4.exports = M = class {
            constructor(R, u, I) {
                var g;
                if (this.name = "?xml", this.type = A.Document, R || (R = {}), g = {}, !R.writer) R.writer = new W;
                else if (V(R.writer)) g = R.writer, R.writer = new W;
                this.options = R, this.writer = R.writer, this.writerOptions = this.writer.filterOptions(g), this.stringify = new Z(R), this.onDataCallback = u || function() {}, this.onEndCallback = I || function() {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
            }
            createChildNode(R) {
                var u, I, g, B, b, p, Q, U;
                switch (R.type) {
                    case A.CData:
                        this.cdata(R.value);
                        break;
                    case A.Comment:
                        this.comment(R.value);
                        break;
                    case A.Element:
                        g = {}, Q = R.attribs;
                        for (I in Q) {
                            if (!L.call(Q, I)) continue;
                            u = Q[I], g[I] = u.value
                        }
                        this.node(R.name, g);
                        break;
                    case A.Dummy:
                        this.dummy();
                        break;
                    case A.Raw:
                        this.raw(R.value);
                        break;
                    case A.Text:
                        this.text(R.value);
                        break;
                    case A.ProcessingInstruction:
                        this.instruction(R.target, R.value);
                        break;
                    default:
                        throw Error("This XML node type is not supported in a JS object: " + R.constructor.name)
                }
                U = R.children;
                for (b = 0, p = U.length; b < p; b++)
                    if (B = U[b], this.createChildNode(B), B.type === A.Element) this.up();
                return this
            }
            dummy() {
                return this
            }
            node(R, u, I) {
                if (R == null) throw Error("Missing node name.");
                if (this.root && this.currentLevel === -1) throw Error("Document can only have one root node. " + this.debugInfo(R));
                if (this.openCurrent(), R = f(R), u == null) u = {};
                if (u = f(u), !N(u))[I, u] = [u, I];
                if (this.currentNode = new D(this, R, u), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, I != null) this.text(I);
                return this
            }
            element(R, u, I) {
                var g, B, b, p, Q, U;
                if (this.currentNode && this.currentNode.type === A.DocType) this.dtdElement(...arguments);
                else if (Array.isArray(R) || N(R) || v(R)) {
                    p = this.options.noValidation, this.options.noValidation = !0, U = new J(this.options).element("TEMP_ROOT"), U.element(R), this.options.noValidation = p, Q = U.children;
                    for (B = 0, b = Q.length; B < b; B++)
                        if (g = Q[B], this.createChildNode(g), g.type === A.Element) this.up()
                } else this.node(R, u, I);
                return this
            }
            attribute(R, u) {
                var I, g;
                if (!this.currentNode || this.currentNode.children) throw Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(R));
                if (R != null) R = f(R);
                if (N(R))
                    for (I in R) {
                        if (!L.call(R, I)) continue;
                        g = R[I], this.attribute(I, g)
                    } else {
                        if (v(u)) u = u.apply();
                        if (this.options.keepNullAttributes && u == null) this.currentNode.attribs[R] = new K(this, R, "");
                        else if (u != null) this.currentNode.attribs[R] = new K(this, R, u)
                    }
                return this
            }
            text(R) {
                var u;
                return this.openCurrent(), u = new G(this, R), this.onData(this.writer.text(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            cdata(R) {
                var u;
                return this.openCurrent(), u = new Y(this, R), this.onData(this.writer.cdata(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            comment(R) {
                var u;
                return this.openCurrent(), u = new z(this, R), this.onData(this.writer.comment(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            raw(R) {
                var u;
                return this.openCurrent(), u = new P(this, R), this.onData(this.writer.raw(u, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            instruction(R, u) {
                var I, g, B, b, p;
                if (this.openCurrent(), R != null) R = f(R);
                if (u != null) u = f(u);
                if (Array.isArray(R))
                    for (I = 0, b = R.length; I < b; I++) g = R[I], this.instruction(g);
                else if (N(R))
                    for (g in R) {
                        if (!L.call(R, g)) continue;
                        B = R[g], this.instruction(g, B)
                    } else {
                        if (v(u)) u = u.apply();
                        p = new X(this, R, u), this.onData(this.writer.processingInstruction(p, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1)
                    }
                return this
            }
            declaration(R, u, I) {
                var g;
                if (this.openCurrent(), this.documentStarted) throw Error("declaration() must be the first node.");
                return g = new H(this, R, u, I), this.onData(this.writer.declaration(g, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            doctype(R, u, I) {
                if (this.openCurrent(), R == null) throw Error("Missing root node name.");
                if (this.root) throw Error("dtd() must come before the root node.");
                return this.currentNode = new j(this, u, I), this.currentNode.rootNodeName = R, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
            }
            dtdElement(R, u) {
                var I;
                return this.openCurrent(), I = new w(this, R, u), this.onData(this.writer.dtdElement(I, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            attList(R, u, I, g, B) {
                var b;
                return this.openCurrent(), b = new _(this, R, u, I, g, B), this.onData(this.writer.dtdAttList(b, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            entity(R, u) {
                var I;
                return this.openCurrent(), I = new O(this, !1, R, u), this.onData(this.writer.dtdEntity(I, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            pEntity(R, u) {
                var I;
                return this.openCurrent(), I = new O(this, !0, R, u), this.onData(this.writer.dtdEntity(I, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }
            notation(R, u) {
                var I;
                return this.openCurrent(), I = new $(this, R, u), this.onData(this.writer.dtdNotation(I, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
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
            openNode(R) {
                var u, I, g, B;
                if (!R.isOpen) {
                    if (!this.root && this.currentLevel === 0 && R.type === A.Element) this.root = R;
                    if (I = "", R.type === A.Element) {
                        this.writerOptions.state = q.OpenTag, I = this.writer.indent(R, this.writerOptions, this.currentLevel) + "<" + R.name, B = R.attribs;
                        for (g in B) {
                            if (!L.call(B, g)) continue;
                            u = B[g], I += this.writer.attribute(u, this.writerOptions, this.currentLevel)
                        }
                        I += (R.children ? ">" : "/>") + this.writer.endline(R, this.writerOptions, this.currentLevel), this.writerOptions.state = q.InsideTag
                    } else {
                        if (this.writerOptions.state = q.OpenTag, I = this.writer.indent(R, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + R.rootNodeName, R.pubID && R.sysID) I += ' PUBLIC "' + R.pubID + '" "' + R.sysID + '"';
                        else if (R.sysID) I += ' SYSTEM "' + R.sysID + '"';
                        if (R.children) I += " [", this.writerOptions.state = q.InsideTag;
                        else this.writerOptions.state = q.CloseTag, I += ">";
                        I += this.writer.endline(R, this.writerOptions, this.currentLevel)
                    }
                    return this.onData(I, this.currentLevel), R.isOpen = !0
                }
            }
            closeNode(R) {
                var u;
                if (!R.isClosed) {
                    if (u = "", this.writerOptions.state = q.CloseTag, R.type === A.Element) u = this.writer.indent(R, this.writerOptions, this.currentLevel) + "</" + R.name + ">" + this.writer.endline(R, this.writerOptions, this.currentLevel);
                    else u = this.writer.indent(R, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(R, this.writerOptions, this.currentLevel);
                    return this.writerOptions.state = q.None, this.onData(u, this.currentLevel), R.isClosed = !0
                }
            }
            onData(R, u) {
                return this.documentStarted = !0, this.onDataCallback(R, u + 1)
            }
            onEnd() {
                return this.documentCompleted = !0, this.onEndCallback()
            }
            debugInfo(R) {
                if (R == null) return "";
                else return "node: <" + R + ">"
            }
            ele() {
                return this.element(...arguments)
            }
            nod(R, u, I) {
                return this.node(R, u, I)
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
            ins(R, u) {
                return this.instruction(R, u)
            }
            dec(R, u, I) {
                return this.declaration(R, u, I)
            }
            dtd(R, u, I) {
                return this.doctype(R, u, I)
            }
            e(R, u, I) {
                return this.element(R, u, I)
            }
            n(R, u, I) {
                return this.node(R, u, I)
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
            i(R, u) {
                return this.instruction(R, u)
            }
            att() {
                if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            a() {
                if (this.currentNode && this.currentNode.type === A.DocType) return this.attList(...arguments);
                else return this.attribute(...arguments)
            }
            ent(R, u) {
                return this.entity(R, u)
            }
            pent(R, u) {
                return this.pEntity(R, u)
            }
            not(R, u) {
                return this.notation(R, u)
            }
        }
    }).call(ff4)
})
// @from(Ln 283504, Col 4)
kf4 = x((Nf4, Vf4) => {
    (function() {
        var A, q, K, Y, z = {}.hasOwnProperty;
        A = rj(), Y = kL8(), q = MU6(), Vf4.exports = K = class extends Y {
            constructor(w, O) {
                super(O);
                this.stream = w
            }
            endline(w, O, $) {
                if (w.isLastRootNode && O.state === q.CloseTag) return "";
                else return super.endline(w, O, $)
            }
            document(w, O) {
                var $, H, j, J, M, D, X, P, W;
                X = w.children;
                for (H = j = 0, M = X.length; j < M; H = ++j) $ = X[H], $.isLastRootNode = H === w.children.length - 1;
                O = this.filterOptions(O), P = w.children, W = [];
                for (J = 0, D = P.length; J < D; J++) $ = P[J], W.push(this.writeChildNode($, O, 0));
                return W
            }
            cdata(w, O, $) {
                return this.stream.write(super.cdata(w, O, $))
            }
            comment(w, O, $) {
                return this.stream.write(super.comment(w, O, $))
            }
            declaration(w, O, $) {
                return this.stream.write(super.declaration(w, O, $))
            }
            docType(w, O, $) {
                var H, j, J, M;
                if ($ || ($ = 0), this.openNode(w, O, $), O.state = q.OpenTag, this.stream.write(this.indent(w, O, $)), this.stream.write("<!DOCTYPE " + w.root().name), w.pubID && w.sysID) this.stream.write(' PUBLIC "' + w.pubID + '" "' + w.sysID + '"');
                else if (w.sysID) this.stream.write(' SYSTEM "' + w.sysID + '"');
                if (w.children.length > 0) {
                    this.stream.write(" ["), this.stream.write(this.endline(w, O, $)), O.state = q.InsideTag, M = w.children;
                    for (j = 0, J = M.length; j < J; j++) H = M[j], this.writeChildNode(H, O, $ + 1);
                    O.state = q.CloseTag, this.stream.write("]")
                }
                return O.state = q.CloseTag, this.stream.write(O.spaceBeforeSlash + ">"), this.stream.write(this.endline(w, O, $)), O.state = q.None, this.closeNode(w, O, $)
            }
            element(w, O, $) {
                var H, j, J, M, D, X, P, W, Z, G, f, v, N, V, L, h;
                if ($ || ($ = 0), this.openNode(w, O, $), O.state = q.OpenTag, f = this.indent(w, O, $) + "<" + w.name, O.pretty && O.width > 0) {
                    P = f.length, N = w.attribs;
                    for (Z in N) {
                        if (!z.call(N, Z)) continue;
                        if (H = N[Z], v = this.attribute(H, O, $), j = v.length, P + j > O.width) h = this.indent(w, O, $ + 1) + v, f += this.endline(w, O, $) + h, P = h.length;
                        else h = " " + v, f += h, P += h.length
                    }
                } else {
                    V = w.attribs;
                    for (Z in V) {
                        if (!z.call(V, Z)) continue;
                        H = V[Z], f += this.attribute(H, O, $)
                    }
                }
                if (this.stream.write(f), M = w.children.length, D = M === 0 ? null : w.children[0], M === 0 || w.children.every(function(R) {
                        return (R.type === A.Text || R.type === A.Raw || R.type === A.CData) && R.value === ""
                    }))
                    if (O.allowEmpty) this.stream.write(">"), O.state = q.CloseTag, this.stream.write("</" + w.name + ">");
                    else O.state = q.CloseTag, this.stream.write(O.spaceBeforeSlash + "/>");
                else if (O.pretty && M === 1 && (D.type === A.Text || D.type === A.Raw || D.type === A.CData) && D.value != null) this.stream.write(">"), O.state = q.InsideTag, O.suppressPrettyCount++, G = !0, this.writeChildNode(D, O, $ + 1), O.suppressPrettyCount--, G = !1, O.state = q.CloseTag, this.stream.write("</" + w.name + ">");
                else {
                    this.stream.write(">" + this.endline(w, O, $)), O.state = q.InsideTag, L = w.children;
                    for (X = 0, W = L.length; X < W; X++) J = L[X], this.writeChildNode(J, O, $ + 1);
                    O.state = q.CloseTag, this.stream.write(this.indent(w, O, $) + "</" + w.name + ">")
                }
                return this.stream.write(this.endline(w, O, $)), O.state = q.None, this.closeNode(w, O, $)
            }
            processingInstruction(w, O, $) {
                return this.stream.write(super.processingInstruction(w, O, $))
            }
            raw(w, O, $) {
                return this.stream.write(super.raw(w, O, $))
            }
            text(w, O, $) {
                return this.stream.write(super.text(w, O, $))
            }
            dtdAttList(w, O, $) {
                return this.stream.write(super.dtdAttList(w, O, $))
            }
            dtdElement(w, O, $) {
                return this.stream.write(super.dtdElement(w, O, $))
            }
            dtdEntity(w, O, $) {
                return this.stream.write(super.dtdEntity(w, O, $))
            }
            dtdNotation(w, O, $) {
                return this.stream.write(super.dtdNotation(w, O, $))
            }
        }
    }).call(Nf4)
})
// @from(Ln 283597, Col 4)
yf4 = x((Ef4, Le) => {
    (function() {
        var A, q, K, Y, z, _, w, O, $;
        ({
            assign: O,
            isFunction: $
        } = $g()), K = TL8(), Y = EL8(), z = vf4(), w = OG1(), _ = kf4(), A = rj(), q = MU6(), Ef4.create = function(H, j, J, M) {
            var D, X;
            if (H == null) throw Error("Root element needs a name.");
            if (M = O({}, j, J, M), D = new Y(M), X = D.element(H), !M.headless) {
                if (D.declaration(M), M.pubID != null || M.sysID != null) D.dtd(M)
            }
            return X
        }, Ef4.begin = function(H, j, J) {
            if ($(H))[j, J] = [H, j], H = {};
            if (j) return new z(H, j, J);
            else return new Y(H)
        }, Ef4.stringWriter = function(H) {
            return new w(H)
        }, Ef4.streamWriter = function(H, j) {
            return new _(H, j)
        }, Ef4.implementation = new K, Ef4.nodeType = A, Ef4.writerState = q
    }).call(Ef4)
})
// @from(Ln 283621, Col 4)
hf4 = x((q8Y) => {
    var Lf4 = eZ8(),
        s1Y = yf4();
    q8Y.build = A8Y;

    function t1Y(A) {
        function q(K) {
            return K < 10 ? "0" + K : K
        }
        return A.getUTCFullYear() + "-" + q(A.getUTCMonth() + 1) + "-" + q(A.getUTCDate()) + "T" + q(A.getUTCHours()) + ":" + q(A.getUTCMinutes()) + ":" + q(A.getUTCSeconds()) + "Z"
    }
    var e1Y = Object.prototype.toString;

    function Rf4(A) {
        var q = e1Y.call(A).match(/\[object (.*)\]/);
        return q ? q[1] : q
    }

    function A8Y(A, q) {
        var K = {
                version: "1.0",
                encoding: "UTF-8"
            },
            Y = {
                pubid: "-//Apple//DTD PLIST 1.0//EN",
                sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
            },
            z = s1Y.create("plist");
        if (z.dec(K.version, K.encoding, K.standalone), z.dtd(Y.pubid, Y.sysid), z.att("version", "1.0"), yL8(A, z), !q) q = {};
        return q.pretty = q.pretty !== !1, z.end(q)
    }

    function yL8(A, q) {
        var K, Y, z, _ = Rf4(A);
        if (_ == "Undefined") return;
        else if (Array.isArray(A)) {
            q = q.ele("array");
            for (Y = 0; Y < A.length; Y++) yL8(A[Y], q)
        } else if (Buffer.isBuffer(A)) q.ele("data").raw(A.toString("base64"));
        else if (_ == "Object") {
            q = q.ele("dict");
            for (z in A)
                if (A.hasOwnProperty(z)) q.ele("key").txt(z), yL8(A[z], q)
        } else if (_ == "Number") K = A % 1 === 0 ? "integer" : "real", q.ele(K).txt(A.toString());
        else if (_ == "BigInt") q.ele("integer").txt(A);
        else if (_ == "Date") q.ele("date").txt(t1Y(new Date(A)));
        else if (_ == "Boolean") q.ele(A ? "true" : "false");
        else if (_ == "String") q.ele("string").txt(A);
        else if (_ == "ArrayBuffer") q.ele("data").raw(Lf4.fromByteArray(A));
        else if (A && A.buffer && Rf4(A.buffer) == "ArrayBuffer") q.ele("data").raw(Lf4.fromByteArray(new Uint8Array(A.buffer), q));
        else if (_ === "Null") q.ele("null").txt("")
    }
})
// @from(Ln 283674, Col 4)
If4 = x((LL8) => {
    var Sf4 = $G4();
    Object.keys(Sf4).forEach(function(A) {
        LL8[A] = Sf4[A]
    });
    var Cf4 = hf4();
    Object.keys(Cf4).forEach(function(A) {
        LL8[A] = Cf4[A]
    })
})
// @from(Ln 283684, Col 0)
async function Hg(A, q) {
    let Y = X1().preferredNotifChannel;
    await Xm(A);
    let z = await Y8Y(Y, A, q);
    d("tengu_notification_method_used", {
        configured_channel: Y,
        method_used: z,
        term: Q8.terminal
    })
}
// @from(Ln 283694, Col 0)
async function Y8Y(A, q, K) {
    let Y = q.title || xf4;
    try {
        switch (A) {
            case "auto":
                return z8Y(q, K);
            case "iterm2":
                return K.notifyITerm2(q), "iterm2";
            case "iterm2_with_bell":
                return K.notifyITerm2(q), K.notifyBell(), "iterm2_with_bell";
            case "kitty":
                return K.notifyKitty({
                    ...q,
                    title: Y,
                    id: uf4()
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
// @from(Ln 283721, Col 0)
async function z8Y(A, q) {
    let K = A.title || xf4;
    switch (Q8.terminal) {
        case "Apple_Terminal": {
            if (await _8Y()) return q.notifyBell(), "terminal_bell";
            return "no_method_available"
        }
        case "iTerm.app":
            return q.notifyITerm2(A), "iterm2";
        case "kitty":
            return q.notifyKitty({
                ...A,
                title: K,
                id: uf4()
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
// @from(Ln 283746, Col 0)
function uf4() {
    return Math.floor(Math.random() * 1e4)
}
// @from(Ln 283749, Col 0)
async function _8Y() {
    try {
        if (Q8.terminal !== "Apple_Terminal") return !1;
        let q = (await z8("osascript", ["-e", 'tell application "Terminal" to name of current settings of front window'])).stdout.trim();
        if (!q) return !1;
        let K = await z8("defaults", ["export", "com.apple.Terminal", "-"]);
        if (K.code !== 0) return !1;
        let _ = bf4.default.parse(K.stdout)?.["Window Settings"]?.[q];
        if (!_) return !1;
        return _.Bell === !1
    } catch (A) {
        return _6(A), !1
    }
}
// @from(Ln 283763, Col 4)
bf4
// @from(Ln 283763, Col 9)
xf4 = "Claude Code"
// @from(Ln 283764, Col 4)
DU6 = E(() => {
    k8();
    Eq();
    V1();
    d3();
    k1();
    hw();
    bf4 = t(If4(), 1)
})
// @from(Ln 283774, Col 0)
function QR(A) {
    let q = A6(29),
        {
            isFocused: K,
            isSelected: Y,
            children: z,
            description: _,
            showScrollDown: w,
            showScrollUp: O,
            styled: $,
            disabled: H
        } = A,
        j = Y === void 0 ? !1 : Y,
        J = $ === void 0 ? !0 : $,
        M = H === void 0 ? !1 : H,
        D;
    if (q[0] !== M || q[1] !== K || q[2] !== w || q[3] !== O) D = function() {
        if (M) return pR.default.createElement(T, null, " ");
        if (K) return pR.default.createElement(T, {
            color: "suggestion"
        }, a6.pointer);
        if (w) return pR.default.createElement(T, {
            dimColor: !0
        }, a6.arrowDown);
        if (O) return pR.default.createElement(T, {
            dimColor: !0
        }, a6.arrowUp);
        return pR.default.createElement(T, null, " ")
    }, q[0] = M, q[1] = K, q[2] = w, q[3] = O, q[4] = D;
    else D = q[4];
    let X = D,
        P;
    if (q[5] !== M || q[6] !== K || q[7] !== j || q[8] !== J) P = function() {
        if (M) return "inactive";
        if (!J) return;
        if (j) return "success";
        if (K) return "suggestion"
    }(), q[5] = M, q[6] = K, q[7] = j, q[8] = J, q[9] = P;
    else P = q[9];
    let W = P,
        Z;
    if (q[10] !== X) Z = X(), q[10] = X, q[11] = Z;
    else Z = q[11];
    let G;
    if (q[12] !== z || q[13] !== M || q[14] !== J || q[15] !== W) G = J ? pR.default.createElement(T, {
        color: W,
        dimColor: M
    }, z) : z, q[12] = z, q[13] = M, q[14] = J, q[15] = W, q[16] = G;
    else G = q[16];
    let f;
    if (q[17] !== M || q[18] !== j) f = j && !M && pR.default.createElement(T, {
        color: "success"
    }, a6.tick), q[17] = M, q[18] = j, q[19] = f;
    else f = q[19];
    let v;
    if (q[20] !== Z || q[21] !== G || q[22] !== f) v = pR.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, Z, G, f), q[20] = Z, q[21] = G, q[22] = f, q[23] = v;
    else v = q[23];
    let N;
    if (q[24] !== _) N = _ && pR.default.createElement(m, {
        paddingLeft: 2
    }, pR.default.createElement(T, {
        color: "inactive"
    }, _)), q[24] = _, q[25] = N;
    else N = q[25];
    let V;
    if (q[26] !== N || q[27] !== v) V = pR.default.createElement(m, {
        flexDirection: "column"
    }, v, N), q[26] = N, q[27] = v, q[28] = V;
    else V = q[28];
    return V
}
// @from(Ln 283848, Col 4)
pR
// @from(Ln 283849, Col 4)
U96 = E(() => {
    e6();
    i6();
    b7();
    pR = t(P6(), 1)
})
// @from(Ln 283856, Col 0)
function Re(A) {
    let q = A6(7),
        {
            isFocused: K,
            isSelected: Y,
            children: z,
            description: _,
            shouldShowDownArrow: w,
            shouldShowUpArrow: O
        } = A,
        $;
    if (q[0] !== z || q[1] !== _ || q[2] !== K || q[3] !== Y || q[4] !== w || q[5] !== O) $ = mf4.default.createElement(QR, {
        isFocused: K,
        isSelected: Y,
        description: _,
        showScrollDown: w,
        showScrollUp: O,
        styled: !1
    }, z), q[0] = z, q[1] = _, q[2] = K, q[3] = Y, q[4] = w, q[5] = O, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 283878, Col 4)
mf4
// @from(Ln 283879, Col 4)
$G1 = E(() => {
    e6();
    U96();
    mf4 = t(P6(), 1)
})
// @from(Ln 283884, Col 4)
HG1
// @from(Ln 283885, Col 4)
Bf4 = E(() => {
    HG1 = class HG1 extends Map {
        first;
        last;
        constructor(A) {
            let q = [],
                K, Y, z, _ = 0;
            for (let w of A) {
                let O = {
                    label: w.label,
                    value: w.value,
                    description: w.description,
                    previous: z,
                    next: void 0,
                    index: _
                };
                if (z) z.next = O;
                K ||= O, Y = O, q.push([w.value, O]), _++, z = O
            }
            super(q);
            this.first = K, this.last = Y
        }
    }
})
// @from(Ln 283913, Col 0)
function jG1({
    visibleOptionCount: A = 5,
    options: q,
    initialFocusValue: K,
    onFocus: Y,
    focusValue: z
}) {
    let [_, w] = zM.useReducer(O8Y, {
        visibleOptionCount: A,
        options: q,
        initialFocusValue: z || K
    }, gf4), O = zM.useRef(Y);
    O.current = Y;
    let [$, H] = zM.useState(q);
    if (q !== $ && !w8Y(q, $)) w({
        type: "reset",
        state: gf4({
            visibleOptionCount: A,
            options: q,
            initialFocusValue: z ?? _.focusedValue ?? K,
            currentViewport: {
                visibleFromIndex: _.visibleFromIndex,
                visibleToIndex: _.visibleToIndex
            }
        })
    }), H(q);
    let j = zM.useCallback(() => {
            w({
                type: "focus-next-option"
            })
        }, []),
        J = zM.useCallback(() => {
            w({
                type: "focus-previous-option"
            })
        }, []),
        M = zM.useCallback(() => {
            w({
                type: "focus-next-page"
            })
        }, []),
        D = zM.useCallback(() => {
            w({
                type: "focus-previous-page"
            })
        }, []),
        X = zM.useCallback((f) => {
            if (f !== void 0) w({
                type: "set-focus",
                value: f
            })
        }, []),
        P = zM.useMemo(() => {
            return q.map((f, v) => ({
                ...f,
                index: v
            })).slice(_.visibleFromIndex, _.visibleToIndex)
        }, [q, _.visibleFromIndex, _.visibleToIndex]),
        W = zM.useMemo(() => {
            if (_.focusedValue === void 0) return;
            if (q.some((v) => v.value === _.focusedValue)) return _.focusedValue;
            return q[0]?.value
        }, [_.focusedValue, q]),
        Z = zM.useMemo(() => {
            return q.find((v) => v.value === W)?.type === "input"
        }, [W, q]);
    zM.useEffect(() => {
        if (W !== void 0) O.current?.(W)
    }, [W]), zM.useEffect(() => {
        if (z !== void 0) w({
            type: "set-focus",
            value: z
        })
    }, [z]);
    let G = zM.useMemo(() => {
        if (W === void 0) return 0;
        let f = q.findIndex((v) => v.value === W);
        return f >= 0 ? f + 1 : 0
    }, [W, q]);
    return {
        focusedValue: W,
        focusedIndex: G,
        visibleFromIndex: _.visibleFromIndex,
        visibleToIndex: _.visibleToIndex,
        visibleOptions: P,
        isInInput: Z ?? !1,
        focusNextOption: j,
        focusPreviousOption: J,
        focusNextPage: M,
        focusPreviousPage: D,
        focusOption: X,
        options: q
    }
}
// @from(Ln 284007, Col 4)
zM
// @from(Ln 284007, Col 8)
O8Y = (A, q) => {
        switch (q.type) {
            case "focus-next-option": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.next || A.optionMap.first;
                if (!Y) return A;
                if (!K.next && Y === A.optionMap.first) return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: 0,
                    visibleToIndex: A.visibleOptionCount
                };
                if (!(Y.index >= A.visibleToIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let _ = Math.min(A.optionMap.size, A.visibleToIndex + 1),
                    w = _ - A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: w,
                    visibleToIndex: _
                }
            }
            case "focus-previous-option": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.previous || A.optionMap.last;
                if (!Y) return A;
                if (!K.previous && Y === A.optionMap.last) {
                    let O = A.optionMap.size,
                        $ = Math.max(0, O - A.visibleOptionCount);
                    return {
                        ...A,
                        focusedValue: Y.value,
                        visibleFromIndex: $,
                        visibleToIndex: O
                    }
                }
                if (!(Y.index <= A.visibleFromIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let _ = Math.max(0, A.visibleFromIndex - 1),
                    w = _ + A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: _,
                    visibleToIndex: w
                }
            }
            case "focus-next-page": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = Math.min(A.optionMap.size - 1, K.index + A.visibleOptionCount),
                    z = A.optionMap.first;
                while (z && z.index < Y)
                    if (z.next) z = z.next;
                    else break;
                if (!z) return A;
                let _ = Math.min(A.optionMap.size, z.index + 1),
                    w = Math.max(0, _ - A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: z.value,
                    visibleFromIndex: w,
                    visibleToIndex: _
                }
            }
            case "focus-previous-page": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = Math.max(0, K.index - A.visibleOptionCount),
                    z = A.optionMap.first;
                while (z && z.index < Y)
                    if (z.next) z = z.next;
                    else break;
                if (!z) return A;
                let _ = Math.max(0, z.index),
                    w = Math.min(A.optionMap.size, _ + A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: z.value,
                    visibleFromIndex: _,
                    visibleToIndex: w
                }
            }
            case "reset":
                return q.state;
            case "set-focus": {
                if (A.focusedValue === q.value) return A;
                let K = A.optionMap.get(q.value);
                if (!K) return A;
                if (K.index >= A.visibleFromIndex && K.index < A.visibleToIndex) return {
                    ...A,
                    focusedValue: q.value
                };
                let Y, z;
                if (K.index < A.visibleFromIndex) Y = K.index, z = Math.min(A.optionMap.size, Y + A.visibleOptionCount);
                else z = Math.min(A.optionMap.size, K.index + 1), Y = Math.max(0, z - A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: q.value,
                    visibleFromIndex: Y,
                    visibleToIndex: z
                }
            }
        }
    }
// @from(Ln 284123, Col 4)
gf4 = ({
        visibleOptionCount: A,
        options: q,
        initialFocusValue: K,
        currentViewport: Y
    }) => {
        let z = typeof A === "number" ? Math.min(A, q.length) : q.length,
            _ = new HG1(q),
            w = K !== void 0 && _.get(K),
            O = w ? K : _.first?.value,
            $ = 0,
            H = z;
        if (w) {
            let j = w.index;
            if (Y)
                if (j >= Y.visibleFromIndex && j < Y.visibleToIndex) $ = Y.visibleFromIndex, H = Math.min(_.size, Y.visibleToIndex);
                else if (j < Y.visibleFromIndex) $ = j, H = Math.min(_.size, $ + z);
            else H = Math.min(_.size, j + 1), $ = Math.max(0, H - z);
            else if (j >= z) H = Math.min(_.size, j + 1), $ = Math.max(0, H - z);
            $ = Math.max(0, Math.min($, _.size - 1)), H = Math.min(_.size, Math.max(z, H))
        }
        return {
            optionMap: _,
            visibleOptionCount: z,
            focusedValue: O,
            visibleFromIndex: $,
            visibleToIndex: H
        }
    }
// @from(Ln 284152, Col 4)
RL8 = E(() => {
    Bf4();
    zM = t(P6(), 1)
})
// @from(Ln 284157, Col 0)
function Ff4({
    visibleOptionCount: A = 5,
    options: q,
    defaultValue: K,
    onChange: Y,
    onCancel: z,
    onFocus: _,
    focusValue: w
}) {
    let [O, $] = JG1.useState(K), H = jG1({
        visibleOptionCount: A,
        options: q,
        initialFocusValue: void 0,
        onFocus: _,
        focusValue: w
    }), j = JG1.useCallback(() => {
        $(H.focusedValue)
    }, [H.focusedValue]);
    return {
        ...H,
        value: O,
        selectFocusedOption: j,
        onChange: Y,
        onCancel: z
    }
}
// @from(Ln 284183, Col 4)
JG1
// @from(Ln 284184, Col 4)
pf4 = E(() => {
    RL8();
    JG1 = t(P6(), 1)
})
// @from(Ln 284189, Col 0)
function oj(A, q) {
    let K = A6(5),
        Y = q === void 0 ? !0 : q,
        _ = MG1.useContext(XU6)?.setState,
        w, O;
    if (K[0] !== Y || K[1] !== A || K[2] !== _) w = () => {
        if (!Y || !_) return;
        return _(($) => {
            if ($.activeOverlays.has(A)) return $;
            let H = new Set($.activeOverlays);
            return H.add(A), {
                ...$,
                activeOverlays: H
            }
        }), () => {
            _(($) => {
                if (!$.activeOverlays.has(A)) return $;
                let H = new Set($.activeOverlays);
                return H.delete(A), {
                    ...$,
                    activeOverlays: H
                }
            })
        }
    }, O = [A, Y, _], K[0] = Y, K[1] = A, K[2] = _, K[3] = w, K[4] = O;
    else w = K[3], O = K[4];
    MG1.useEffect(w, O)
}
// @from(Ln 284218, Col 0)
function Qf4() {
    return M1(H8Y)
}
// @from(Ln 284222, Col 0)
function H8Y(A) {
    return A.activeOverlays.size > 0
}
// @from(Ln 284226, Col 0)
function he() {
    return M1(j8Y)
}
// @from(Ln 284230, Col 0)
function j8Y(A) {
    for (let q of A.activeOverlays)
        if (!$8Y.has(q)) return !0;
    return !1
}
// @from(Ln 284235, Col 4)
MG1
// @from(Ln 284235, Col 9)
$8Y
// @from(Ln 284236, Col 4)
fZ = E(() => {
    e6();
    NA();
    MG1 = t(P6(), 1), $8Y = new Set(["autocomplete"])
})
// @from(Ln 284241, Col 4)
hL8