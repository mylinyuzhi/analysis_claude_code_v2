
// @from(Ln 347930, Col 4)
RB8 = x((oRY) => {
    var _t4 = Hj();
    oRY.property = function(A) {
        if (Array.isArray(A.type)) {
            var q = Object.create(null);
            A.type.forEach(function(z) {
                q[z.value || z] = z.alias || z
            });
            var K = A.missing;
            if (K === void 0) K = null;
            var Y = A.invalid;
            if (Y === void 0) Y = K;
            return {
                get: function() {
                    var z = this._getattr(A.name);
                    if (z === null) return K;
                    if (z = q[z.toLowerCase()], z !== void 0) return z;
                    if (Y !== null) return Y;
                    return z
                },
                set: function(z) {
                    this._setattr(A.name, z)
                }
            }
        } else if (A.type === Boolean) return {
            get: function() {
                return this.hasAttribute(A.name)
            },
            set: function(z) {
                if (z) this._setattr(A.name, "");
                else this.removeAttribute(A.name)
            }
        };
        else if (A.type === Number || A.type === "long" || A.type === "unsigned long" || A.type === "limited unsigned long with fallback") return rRY(A);
        else if (!A.type || A.type === String) return {
            get: function() {
                return this._getattr(A.name) || ""
            },
            set: function(z) {
                if (A.treatNullAsEmptyString && z === null) z = "";
                this._setattr(A.name, z)
            }
        };
        else if (typeof A.type === "function") return A.type(A.name, A);
        throw Error("Invalid attribute definition")
    };

    function rRY(A) {
        var q;
        if (typeof A.default === "function") q = A.default;
        else if (typeof A.default === "number") q = function() {
            return A.default
        };
        else q = function() {
            _t4.assert(!1, typeof A.default)
        };
        var K = A.type === "unsigned long",
            Y = A.type === "long",
            z = A.type === "limited unsigned long with fallback",
            _ = A.min,
            w = A.max,
            O = A.setmin;
        if (_ === void 0) {
            if (K) _ = 0;
            if (Y) _ = -2147483648;
            if (z) _ = 1
        }
        if (w === void 0) {
            if (K || Y || z) w = 2147483647
        }
        return {
            get: function() {
                var $ = this._getattr(A.name),
                    H = A.float ? parseFloat($) : parseInt($, 10);
                if ($ === null || !isFinite(H) || _ !== void 0 && H < _ || w !== void 0 && H > w) return q.call(this);
                if (K || Y || z) {
                    if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test($)) return q.call(this);
                    H = H | 0
                }
                return H
            },
            set: function($) {
                if (!A.float) $ = Math.floor($);
                if (O !== void 0 && $ < O) _t4.IndexSizeError(A.name + " set to " + $);
                if (K) $ = $ < 0 || $ > 2147483647 ? q.call(this) : $ | 0;
                else if (z) $ = $ < 1 || $ > 2147483647 ? q.call(this) : $ | 0;
                else if (Y) $ = $ < -2147483648 || $ > 2147483647 ? q.call(this) : $ | 0;
                this._setattr(A.name, String($))
            }
        }
    }
    oRY.registerChangeHandler = function(A, q, K) {
        var Y = A.prototype;
        if (!Object.prototype.hasOwnProperty.call(Y, "_attributeChangeHandlers")) Y._attributeChangeHandlers = Object.create(Y._attributeChangeHandlers || null);
        Y._attributeChangeHandlers[q] = K
    }
})
// @from(Ln 348027, Col 4)
$t4 = x((grw, Ot4) => {
    Ot4.exports = wt4;
    var tRY = u0();

    function wt4(A, q) {
        this.root = A, this.filter = q, this.lastModTime = A.lastModTime, this.done = !1, this.cache = [], this.traverse()
    }
    wt4.prototype = Object.create(Object.prototype, {
        length: {
            get: function() {
                if (this.checkcache(), !this.done) this.traverse();
                return this.cache.length
            }
        },
        item: {
            value: function(A) {
                if (this.checkcache(), !this.done && A >= this.cache.length) this.traverse();
                return this.cache[A]
            }
        },
        checkcache: {
            value: function() {
                if (this.lastModTime !== this.root.lastModTime) {
                    for (var A = this.cache.length - 1; A >= 0; A--) this[A] = void 0;
                    this.cache.length = 0, this.done = !1, this.lastModTime = this.root.lastModTime
                }
            }
        },
        traverse: {
            value: function(A) {
                if (A !== void 0) A++;
                var q;
                while ((q = this.next()) !== null)
                    if (this[this.cache.length] = q, this.cache.push(q), A && this.cache.length === A) return;
                this.done = !0
            }
        },
        next: {
            value: function() {
                var A = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1],
                    q;
                if (A.nodeType === tRY.DOCUMENT_NODE) q = A.documentElement;
                else q = A.nextElement(this.root);
                while (q) {
                    if (this.filter(q)) return q;
                    q = q.nextElement(this.root)
                }
                return null
            }
        }
    })
})
// @from(Ln 348079, Col 4)
SB8 = x((Frw, Jt4) => {
    var hB8 = Hj();
    Jt4.exports = jt4;

    function jt4(A, q) {
        this._getString = A, this._setString = q, this._length = 0, this._lastStringValue = "", this._update()
    }
    Object.defineProperties(jt4.prototype, {
        length: {
            get: function() {
                return this._length
            }
        },
        item: {
            value: function(A) {
                var q = OT6(this);
                if (A < 0 || A >= q.length) return null;
                return q[A]
            }
        },
        contains: {
            value: function(A) {
                A = String(A);
                var q = OT6(this);
                return q.indexOf(A) > -1
            }
        },
        add: {
            value: function() {
                var A = OT6(this);
                for (var q = 0, K = arguments.length; q < K; q++) {
                    var Y = bl6(arguments[q]);
                    if (A.indexOf(Y) < 0) A.push(Y)
                }
                this._update(A)
            }
        },
        remove: {
            value: function() {
                var A = OT6(this);
                for (var q = 0, K = arguments.length; q < K; q++) {
                    var Y = bl6(arguments[q]),
                        z = A.indexOf(Y);
                    if (z > -1) A.splice(z, 1)
                }
                this._update(A)
            }
        },
        toggle: {
            value: function(q, K) {
                if (q = bl6(q), this.contains(q)) {
                    if (K === void 0 || K === !1) return this.remove(q), !1;
                    return !0
                } else {
                    if (K === void 0 || K === !0) return this.add(q), !0;
                    return !1
                }
            }
        },
        replace: {
            value: function(q, K) {
                if (String(K) === "") hB8.SyntaxError();
                q = bl6(q), K = bl6(K);
                var Y = OT6(this),
                    z = Y.indexOf(q);
                if (z < 0) return !1;
                var _ = Y.indexOf(K);
                if (_ < 0) Y[z] = K;
                else if (z < _) Y[z] = K, Y.splice(_, 1);
                else Y.splice(z, 1);
                return this._update(Y), !0
            }
        },
        toString: {
            value: function() {
                return this._getString()
            }
        },
        value: {
            get: function() {
                return this._getString()
            },
            set: function(A) {
                this._setString(A), this._update()
            }
        },
        _update: {
            value: function(A) {
                if (A) Ht4(this, A), this._setString(A.join(" ").trim());
                else Ht4(this, OT6(this));
                this._lastStringValue = this._getString()
            }
        }
    });

    function Ht4(A, q) {
        var K = A._length,
            Y;
        A._length = q.length;
        for (Y = 0; Y < q.length; Y++) A[Y] = q[Y];
        for (; Y < K; Y++) A[Y] = void 0
    }

    function bl6(A) {
        if (A = String(A), A === "") hB8.SyntaxError();
        if (/[ \t\r\n\f]/.test(A)) hB8.InvalidCharacterError();
        return A
    }

    function eRY(A) {
        var q = A._length,
            K = Array(q);
        for (var Y = 0; Y < q; Y++) K[Y] = A[Y];
        return K
    }

    function OT6(A) {
        var q = A._getString();
        if (q === A._lastStringValue) return eRY(A);
        var K = q.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (K === "") return [];
        else {
            var Y = Object.create(null);
            return K.split(/[ \t\r\n\f]+/g).filter(function(z) {
                var _ = "$" + z;
                if (Y[_]) return !1;
                return Y[_] = !0, !0
            })
        }
    }
})
// @from(Ln 348210, Col 4)
Dk1 = x((jT6, Zt4) => {
    var jk1 = Object.create(null, {
            location: {
                get: function() {
                    throw Error("window.location is not supported.")
                }
            }
        }),
        AhY = function(A, q) {
            return A.compareDocumentPosition(q)
        },
        qhY = function(A, q) {
            return AhY(A, q) & 2 ? 1 : -1
        },
        Mk1 = function(A) {
            while ((A = A.nextSibling) && A.nodeType !== 1);
            return A
        },
        HT6 = function(A) {
            while ((A = A.previousSibling) && A.nodeType !== 1);
            return A
        },
        KhY = function(A) {
            if (A = A.firstChild)
                while (A.nodeType !== 1 && (A = A.nextSibling));
            return A
        },
        YhY = function(A) {
            if (A = A.lastChild)
                while (A.nodeType !== 1 && (A = A.previousSibling));
            return A
        },
        $T6 = function(A) {
            if (!A.parentNode) return !1;
            var q = A.parentNode.nodeType;
            return q === 1 || q === 9
        },
        Mt4 = function(A) {
            if (!A) return A;
            var q = A[0];
            if (q === '"' || q === "'") {
                if (A[A.length - 1] === q) A = A.slice(1, -1);
                else A = A.slice(1);
                return A.replace(FK.str_escape, function(K) {
                    var Y = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(K);
                    if (!Y) return K.slice(1);
                    if (Y[2]) return "";
                    var z = parseInt(Y[1], 16);
                    return String.fromCodePoint ? String.fromCodePoint(z) : String.fromCharCode(z)
                })
            } else if (FK.ident.test(A)) return r66(A);
            else return A
        },
        r66 = function(A) {
            return A.replace(FK.escape, function(q) {
                var K = /^\\([0-9A-Fa-f]+)/.exec(q);
                if (!K) return q[1];
                var Y = parseInt(K[1], 16);
                return String.fromCodePoint ? String.fromCodePoint(Y) : String.fromCharCode(Y)
            })
        },
        zhY = function() {
            if (Array.prototype.indexOf) return Array.prototype.indexOf;
            return function(A, q) {
                var K = this.length;
                while (K--)
                    if (this[K] === q) return K;
                return -1
            }
        }(),
        Xt4 = function(A, q) {
            var K = FK.inside.source.replace(/</g, A).replace(/>/g, q);
            return new RegExp(K)
        },
        PN = function(A, q, K) {
            return A = A.source, A = A.replace(q, K.source || K), new RegExp(A)
        },
        Dt4 = function(A, q) {
            return A.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", q).join("/")
        },
        _hY = function(A, q) {
            var K = A.replace(/\s+/g, ""),
                Y;
            if (K === "even") K = "2n+0";
            else if (K === "odd") K = "2n+1";
            else if (K.indexOf("n") === -1) K = "0n" + K;
            return Y = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(K), {
                group: Y[1] === "-" ? -(Y[2] || 1) : +(Y[2] || 1),
                offset: Y[4] ? Y[3] === "-" ? -Y[4] : +Y[4] : 0
            }
        },
        CB8 = function(A, q, K) {
            var Y = _hY(A),
                z = Y.group,
                _ = Y.offset,
                w = !K ? KhY : YhY,
                O = !K ? Mk1 : HT6;
            return function($) {
                if (!$T6($)) return;
                var H = w($.parentNode),
                    j = 0;
                while (H) {
                    if (q(H, $)) j++;
                    if (H === $) return j -= _, z && j ? j % z === 0 && j < 0 === z < 0 : !j;
                    H = O(H)
                }
            }
        },
        uX = {
            "*": function() {
                return function() {
                    return !0
                }
            }(),
            type: function(A) {
                return A = A.toLowerCase(),
                    function(q) {
                        return q.nodeName.toLowerCase() === A
                    }
            },
            attr: function(A, q, K, Y) {
                return q = Pt4[q],
                    function(z) {
                        var _;
                        switch (A) {
                            case "for":
                                _ = z.htmlFor;
                                break;
                            case "class":
                                if (_ = z.className, _ === "" && z.getAttribute("class") == null) _ = null;
                                break;
                            case "href":
                            case "src":
                                _ = z.getAttribute(A, 2);
                                break;
                            case "title":
                                _ = z.getAttribute("title") || null;
                                break;
                            case "id":
                            case "lang":
                            case "dir":
                            case "accessKey":
                            case "hidden":
                            case "tabIndex":
                            case "style":
                                if (z.getAttribute) {
                                    _ = z.getAttribute(A);
                                    break
                                }
                            default:
                                if (z.hasAttribute && !z.hasAttribute(A)) break;
                                _ = z[A] != null ? z[A] : z.getAttribute && z.getAttribute(A);
                                break
                        }
                        if (_ == null) return;
                        if (_ = _ + "", Y) _ = _.toLowerCase(), K = K.toLowerCase();
                        return q(_, K)
                    }
            },
            ":first-child": function(A) {
                return !HT6(A) && $T6(A)
            },
            ":last-child": function(A) {
                return !Mk1(A) && $T6(A)
            },
            ":only-child": function(A) {
                return !HT6(A) && !Mk1(A) && $T6(A)
            },
            ":nth-child": function(A, q) {
                return CB8(A, function() {
                    return !0
                }, q)
            },
            ":nth-last-child": function(A) {
                return uX[":nth-child"](A, !0)
            },
            ":root": function(A) {
                return A.ownerDocument.documentElement === A
            },
            ":empty": function(A) {
                return !A.firstChild
            },
            ":not": function(A) {
                var q = bB8(A);
                return function(K) {
                    return !q(K)
                }
            },
            ":first-of-type": function(A) {
                if (!$T6(A)) return;
                var q = A.nodeName;
                while (A = HT6(A))
                    if (A.nodeName === q) return;
                return !0
            },
            ":last-of-type": function(A) {
                if (!$T6(A)) return;
                var q = A.nodeName;
                while (A = Mk1(A))
                    if (A.nodeName === q) return;
                return !0
            },
            ":only-of-type": function(A) {
                return uX[":first-of-type"](A) && uX[":last-of-type"](A)
            },
            ":nth-of-type": function(A, q) {
                return CB8(A, function(K, Y) {
                    return K.nodeName === Y.nodeName
                }, q)
            },
            ":nth-last-of-type": function(A) {
                return uX[":nth-of-type"](A, !0)
            },
            ":checked": function(A) {
                return !!(A.checked || A.selected)
            },
            ":indeterminate": function(A) {
                return !uX[":checked"](A)
            },
            ":enabled": function(A) {
                return !A.disabled && A.type !== "hidden"
            },
            ":disabled": function(A) {
                return !!A.disabled
            },
            ":target": function(A) {
                return A.id === jk1.location.hash.substring(1)
            },
            ":focus": function(A) {
                return A === A.ownerDocument.activeElement
            },
            ":is": function(A) {
                return bB8(A)
            },
            ":matches": function(A) {
                return uX[":is"](A)
            },
            ":nth-match": function(A, q) {
                var K = A.split(/\s*,\s*/),
                    Y = K.shift(),
                    z = bB8(K.join(","));
                return CB8(Y, z, q)
            },
            ":nth-last-match": function(A) {
                return uX[":nth-match"](A, !0)
            },
            ":links-here": function(A) {
                return A + "" === jk1.location + ""
            },
            ":lang": function(A) {
                return function(q) {
                    while (q) {
                        if (q.lang) return q.lang.indexOf(A) === 0;
                        q = q.parentNode
                    }
                }
            },
            ":dir": function(A) {
                return function(q) {
                    while (q) {
                        if (q.dir) return q.dir === A;
                        q = q.parentNode
                    }
                }
            },
            ":scope": function(A, q) {
                var K = q || A.ownerDocument;
                if (K.nodeType === 9) return A === K.documentElement;
                return A === K
            },
            ":any-link": function(A) {
                return typeof A.href === "string"
            },
            ":local-link": function(A) {
                if (A.nodeName) return A.href && A.host === jk1.location.host;
                var q = +A + 1;
                return function(K) {
                    if (!K.href) return;
                    var Y = jk1.location + "",
                        z = K + "";
                    return Dt4(Y, q) === Dt4(z, q)
                }
            },
            ":default": function(A) {
                return !!A.defaultSelected
            },
            ":valid": function(A) {
                return A.willValidate || A.validity && A.validity.valid
            },
            ":invalid": function(A) {
                return !uX[":valid"](A)
            },
            ":in-range": function(A) {
                return A.value > A.min && A.value <= A.max
            },
            ":out-of-range": function(A) {
                return !uX[":in-range"](A)
            },
            ":required": function(A) {
                return !!A.required
            },
            ":optional": function(A) {
                return !A.required
            },
            ":read-only": function(A) {
                if (A.readOnly) return !0;
                var q = A.getAttribute("contenteditable"),
                    K = A.contentEditable,
                    Y = A.nodeName.toLowerCase();
                return Y = Y !== "input" && Y !== "textarea", (Y || A.disabled) && q == null && K !== "true"
            },
            ":read-write": function(A) {
                return !uX[":read-only"](A)
            },
            ":hover": function() {
                throw Error(":hover is not supported.")
            },
            ":active": function() {
                throw Error(":active is not supported.")
            },
            ":link": function() {
                throw Error(":link is not supported.")
            },
            ":visited": function() {
                throw Error(":visited is not supported.")
            },
            ":column": function() {
                throw Error(":column is not supported.")
            },
            ":nth-column": function() {
                throw Error(":nth-column is not supported.")
            },
            ":nth-last-column": function() {
                throw Error(":nth-last-column is not supported.")
            },
            ":current": function() {
                throw Error(":current is not supported.")
            },
            ":past": function() {
                throw Error(":past is not supported.")
            },
            ":future": function() {
                throw Error(":future is not supported.")
            },
            ":contains": function(A) {
                return function(q) {
                    var K = q.innerText || q.textContent || q.value || "";
                    return K.indexOf(A) !== -1
                }
            },
            ":has": function(A) {
                return function(q) {
                    return Wt4(A, q).length > 0
                }
            }
        },
        Pt4 = {
            "-": function() {
                return !0
            },
            "=": function(A, q) {
                return A === q
            },
            "*=": function(A, q) {
                return A.indexOf(q) !== -1
            },
            "~=": function(A, q) {
                var K, Y, z, _;
                for (Y = 0;; Y = K + 1) {
                    if (K = A.indexOf(q, Y), K === -1) return !1;
                    if (z = A[K - 1], _ = A[K + q.length], (!z || z === " ") && (!_ || _ === " ")) return !0
                }
            },
            "|=": function(A, q) {
                var K = A.indexOf(q),
                    Y;
                if (K !== 0) return;
                return Y = A[K + q.length], Y === "-" || !Y
            },
            "^=": function(A, q) {
                return A.indexOf(q) === 0
            },
            "$=": function(A, q) {
                var K = A.lastIndexOf(q);
                return K !== -1 && K + q.length === A.length
            },
            "!=": function(A, q) {
                return A !== q
            }
        },
        xl6 = {
            " ": function(A) {
                return function(q) {
                    while (q = q.parentNode)
                        if (A(q)) return q
                }
            },
            ">": function(A) {
                return function(q) {
                    if (q = q.parentNode) return A(q) && q
                }
            },
            "+": function(A) {
                return function(q) {
                    if (q = HT6(q)) return A(q) && q
                }
            },
            "~": function(A) {
                return function(q) {
                    while (q = HT6(q))
                        if (A(q)) return q
                }
            },
            noop: function(A) {
                return function(q) {
                    return A(q) && q
                }
            },
            ref: function(A, q) {
                var K;

                function Y(z) {
                    var _ = z.ownerDocument,
                        w = _.getElementsByTagName("*"),
                        O = w.length;
                    while (O--)
                        if (K = w[O], Y.test(z)) return K = null, !0;
                    K = null
                }
                return Y.combinator = function(z) {
                    if (!K || !K.getAttribute) return;
                    var _ = K.getAttribute(q) || "";
                    if (_[0] === "#") _ = _.substring(1);
                    if (_ === z.id && A(K)) return K
                }, Y
            }
        },
        FK = {
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
    FK.cssid = PN(FK.cssid, "nonascii", FK.nonascii);
    FK.cssid = PN(FK.cssid, "escape", FK.escape);
    FK.qname = PN(FK.qname, "cssid", FK.cssid);
    FK.simple = PN(FK.simple, "cssid", FK.cssid);
    FK.ref = PN(FK.ref, "cssid", FK.cssid);
    FK.attr = PN(FK.attr, "cssid", FK.cssid);
    FK.pseudo = PN(FK.pseudo, "cssid", FK.cssid);
    FK.inside = PN(FK.inside, `[^"'>]*`, FK.inside);
    FK.attr = PN(FK.attr, "inside", Xt4("\\[", "\\]"));
    FK.pseudo = PN(FK.pseudo, "inside", Xt4("\\(", "\\)"));
    FK.simple = PN(FK.simple, "pseudo", FK.pseudo);
    FK.simple = PN(FK.simple, "attr", FK.attr);
    FK.ident = PN(FK.ident, "cssid", FK.cssid);
    FK.str_escape = PN(FK.str_escape, "escape", FK.escape);
    var ul6 = function(A) {
            var q = A.replace(/^\s+|\s+$/g, ""),
                K, Y = [],
                z = [],
                _, w, O, $, H;
            while (q) {
                if (O = FK.qname.exec(q)) q = q.substring(O[0].length), w = r66(O[1]), z.push(Jk1(w, !0));
                else if (O = FK.simple.exec(q)) q = q.substring(O[0].length), w = "*", z.push(Jk1(w, !0)), z.push(Jk1(O));
                else throw SyntaxError("Invalid selector.");
                while (O = FK.simple.exec(q)) q = q.substring(O[0].length), z.push(Jk1(O));
                if (q[0] === "!") q = q.substring(1), _ = OhY(), _.qname = w, z.push(_.simple);
                if (O = FK.ref.exec(q)) {
                    q = q.substring(O[0].length), H = xl6.ref(IB8(z), r66(O[1])), Y.push(H.combinator), z = [];
                    continue
                }
                if (O = FK.combinator.exec(q)) {
                    if (q = q.substring(O[0].length), $ = O[1] || O[2] || O[3], $ === ",") {
                        Y.push(xl6.noop(IB8(z)));
                        break
                    }
                } else $ = "noop";
                if (!xl6[$]) throw SyntaxError("Bad combinator.");
                Y.push(xl6[$](IB8(z))), z = []
            }
            if (K = whY(Y), K.qname = w, K.sel = q, _) _.lname = K.qname, _.test = K, _.qname = _.qname, _.sel = K.sel, K = _;
            if (H) H.test = K, H.qname = K.qname, H.sel = K.sel, K = H;
            return K
        },
        Jk1 = function(A, q) {
            if (q) return A === "*" ? uX["*"] : uX.type(A);
            if (A[1]) return A[1][0] === "." ? uX.attr("class", "~=", r66(A[1].substring(1)), !1) : uX.attr("id", "=", r66(A[1].substring(1)), !1);
            if (A[2]) return A[3] ? uX[r66(A[2])](Mt4(A[3])) : uX[r66(A[2])];
            if (A[4]) {
                var K = A[6],
                    Y = /["'\s]\s*I$/i.test(K);
                if (Y) K = K.replace(/\s*I$/i, "");
                return uX.attr(r66(A[4]), A[5] || "-", Mt4(K), Y)
            }
            throw SyntaxError("Unknown Selector.")
        },
        IB8 = function(A) {
            var q = A.length,
                K;
            if (q < 2) return A[0];
            return function(Y) {
                if (!Y) return;
                for (K = 0; K < q; K++)
                    if (!A[K](Y)) return;
                return !0
            }
        },
        whY = function(A) {
            if (A.length < 2) return function(q) {
                return !!A[0](q)
            };
            return function(q) {
                var K = A.length;
                while (K--)
                    if (!(q = A[K](q))) return;
                return !0
            }
        },
        OhY = function() {
            var A;

            function q(K) {
                var Y = K.ownerDocument,
                    z = Y.getElementsByTagName(q.lname),
                    _ = z.length;
                while (_--)
                    if (q.test(z[_]) && A === K) return A = null, !0;
                A = null
            }
            return q.simple = function(K) {
                return A = K, !0
            }, q
        },
        bB8 = function(A) {
            var q = ul6(A),
                K = [q];
            while (q.sel) q = ul6(q.sel), K.push(q);
            if (K.length < 2) return q;
            return function(Y) {
                var z = K.length,
                    _ = 0;
                for (; _ < z; _++)
                    if (K[_](Y)) return !0
            }
        },
        Wt4 = function(A, q) {
            var K = [],
                Y = ul6(A),
                z = q.getElementsByTagName(Y.qname),
                _ = 0,
                w;
            while (w = z[_++])
                if (Y(w)) K.push(w);
            if (Y.sel) {
                while (Y.sel) {
                    Y = ul6(Y.sel), z = q.getElementsByTagName(Y.qname), _ = 0;
                    while (w = z[_++])
                        if (Y(w) && zhY.call(K, w) === -1) K.push(w)
                }
                K.sort(qhY)
            }
            return K
        };
    Zt4.exports = jT6 = function(A, q) {
        var K, Y;
        if (q.nodeType !== 11 && A.indexOf(" ") === -1) {
            if (A[0] === "#" && q.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(A)) {
                if (q.doc._hasMultipleElementsWithId) {
                    if (K = A.substring(1), !q.doc._hasMultipleElementsWithId(K)) return Y = q.doc.getElementById(K), Y ? [Y] : []
                }
            }
            if (A[0] === "." && /^\.\w+$/.test(A)) return q.getElementsByClassName(A.substring(1));
            if (/^\w+$/.test(A)) return q.getElementsByTagName(A)
        }
        return Wt4(A, q)
    };
    jT6.selectors = uX;
    jT6.operators = Pt4;
    jT6.combinators = xl6;
    jT6.matches = function(A, q) {
        var K = {
            sel: q
        };
        do
            if (K = ul6(K.sel), K(A)) return !0; while (K.sel);
        return !1
    }
})
// @from(Ln 348807, Col 4)
Xk1 = x((prw, Gt4) => {
    var $hY = u0(),
        HhY = PB8(),
        xB8 = function(A, q) {
            var K = A.createDocumentFragment();
            for (var Y = 0; Y < q.length; Y++) {
                var z = q[Y],
                    _ = z instanceof $hY;
                K.appendChild(_ ? z : A.createTextNode(String(z)))
            }
            return K
        },
        jhY = {
            after: {
                value: function() {
                    var q = Array.prototype.slice.call(arguments),
                        K = this.parentNode,
                        Y = this.nextSibling;
                    if (K === null) return;
                    while (Y && q.some(function(_) {
                            return _ === Y
                        })) Y = Y.nextSibling;
                    var z = xB8(this.doc, q);
                    K.insertBefore(z, Y)
                }
            },
            before: {
                value: function() {
                    var q = Array.prototype.slice.call(arguments),
                        K = this.parentNode,
                        Y = this.previousSibling;
                    if (K === null) return;
                    while (Y && q.some(function(w) {
                            return w === Y
                        })) Y = Y.previousSibling;
                    var z = xB8(this.doc, q),
                        _ = Y ? Y.nextSibling : K.firstChild;
                    K.insertBefore(z, _)
                }
            },
            remove: {
                value: function() {
                    if (this.parentNode === null) return;
                    if (this.doc) {
                        if (this.doc._preremoveNodeIterators(this), this.rooted) this.doc.mutateRemove(this)
                    }
                    this._remove(), this.parentNode = null
                }
            },
            _remove: {
                value: function() {
                    var q = this.parentNode;
                    if (q === null) return;
                    if (q._childNodes) q._childNodes.splice(this.index, 1);
                    else if (q._firstChild === this)
                        if (this._nextSibling === this) q._firstChild = null;
                        else q._firstChild = this._nextSibling;
                    HhY.remove(this), q.modify()
                }
            },
            replaceWith: {
                value: function() {
                    var q = Array.prototype.slice.call(arguments),
                        K = this.parentNode,
                        Y = this.nextSibling;
                    if (K === null) return;
                    while (Y && q.some(function(_) {
                            return _ === Y
                        })) Y = Y.nextSibling;
                    var z = xB8(this.doc, q);
                    if (this.parentNode === K) K.replaceChild(z, this);
                    else K.insertBefore(z, Y)
                }
            }
        };
    Gt4.exports = jhY
})
// @from(Ln 348884, Col 4)
uB8 = x((Qrw, Tt4) => {
    var ft4 = u0(),
        JhY = {
            nextElementSibling: {
                get: function() {
                    if (this.parentNode) {
                        for (var A = this.nextSibling; A !== null; A = A.nextSibling)
                            if (A.nodeType === ft4.ELEMENT_NODE) return A
                    }
                    return null
                }
            },
            previousElementSibling: {
                get: function() {
                    if (this.parentNode) {
                        for (var A = this.previousSibling; A !== null; A = A.previousSibling)
                            if (A.nodeType === ft4.ELEMENT_NODE) return A
                    }
                    return null
                }
            }
        };
    Tt4.exports = JhY
})
// @from(Ln 348908, Col 4)
mB8 = x((Urw, Nt4) => {
    Nt4.exports = vt4;
    var JT6 = Hj();

    function vt4(A) {
        this.element = A
    }
    Object.defineProperties(vt4.prototype, {
        length: {
            get: JT6.shouldOverride
        },
        item: {
            value: JT6.shouldOverride
        },
        getNamedItem: {
            value: function(q) {
                return this.element.getAttributeNode(q)
            }
        },
        getNamedItemNS: {
            value: function(q, K) {
                return this.element.getAttributeNodeNS(q, K)
            }
        },
        setNamedItem: {
            value: JT6.nyi
        },
        setNamedItemNS: {
            value: JT6.nyi
        },
        removeNamedItem: {
            value: function(q) {
                var K = this.element.getAttributeNode(q);
                if (K) return this.element.removeAttribute(q), K;
                JT6.NotFoundError()
            }
        },
        removeNamedItemNS: {
            value: function(q, K) {
                var Y = this.element.getAttributeNodeNS(q, K);
                if (Y) return this.element.removeAttributeNS(q, K), Y;
                JT6.NotFoundError()
            }
        }
    })
})
// @from(Ln 348954, Col 4)
DT6 = x((drw, Lt4) => {
    Lt4.exports = o66;
    var BB8 = Hk1(),
        _H = Hj(),
        og = _H.NAMESPACE,
        Wk1 = RB8(),
        xb = u0(),
        gB8 = Tz6(),
        MhY = WB8(),
        Pk1 = $t4(),
        MT6 = zk1(),
        DhY = SB8(),
        FB8 = Dk1(),
        kt4 = $k1(),
        XhY = Xk1(),
        PhY = uB8(),
        Et4 = mB8(),
        Vt4 = Object.create(null);

    function o66(A, q, K, Y) {
        kt4.call(this), this.nodeType = xb.ELEMENT_NODE, this.ownerDocument = A, this.localName = q, this.namespaceURI = K, this.prefix = Y, this._tagName = void 0, this._attrsByQName = Object.create(null), this._attrsByLName = Object.create(null), this._attrKeys = []
    }

    function pB8(A, q) {
        if (A.nodeType === xb.TEXT_NODE) q.push(A._data);
        else
            for (var K = 0, Y = A.childNodes.length; K < Y; K++) pB8(A.childNodes[K], q)
    }
    o66.prototype = Object.create(kt4.prototype, {
        isHTML: {
            get: function() {
                return this.namespaceURI === og.HTML && this.ownerDocument.isHTML
            }
        },
        tagName: {
            get: function() {
                if (this._tagName === void 0) {
                    var q;
                    if (this.prefix === null) q = this.localName;
                    else q = this.prefix + ":" + this.localName;
                    if (this.isHTML) {
                        var K = Vt4[q];
                        if (!K) Vt4[q] = K = _H.toASCIIUpperCase(q);
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
                return pB8(this, A), A.join("")
            },
            set: function(A) {
                if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
            }
        },
        innerText: {
            get: function() {
                var A = [];
                return pB8(this, A), A.join("").replace(/[ \t\n\f\r]+/g, " ").trim()
            },
            set: function(A) {
                if (this.removeChildren(), A !== null && A !== void 0 && A !== "") this._appendChild(this.ownerDocument.createTextNode(A))
            }
        },
        innerHTML: {
            get: function() {
                return this.serialize()
            },
            set: _H.nyi
        },
        outerHTML: {
            get: function() {
                return MhY.serializeOne(this, {
                    nodeType: 0
                })
            },
            set: function(A) {
                var q = this.ownerDocument,
                    K = this.parentNode;
                if (K === null) return;
                if (K.nodeType === xb.DOCUMENT_NODE) _H.NoModificationAllowedError();
                if (K.nodeType === xb.DOCUMENT_FRAGMENT_NODE) K = K.ownerDocument.createElement("body");
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
                        return _H.SyntaxError()
                }
            }
        },
        insertAdjacentElement: {
            value: function(q, K) {
                if (K.nodeType !== xb.ELEMENT_NODE) throw TypeError("not an element");
                return q = _H.toASCIILowerCase(String(q)), this._insertAdjacent(q, K)
            }
        },
        insertAdjacentText: {
            value: function(q, K) {
                var Y = this.ownerDocument.createTextNode(K);
                q = _H.toASCIILowerCase(String(q)), this._insertAdjacent(q, Y)
            }
        },
        insertAdjacentHTML: {
            value: function(q, K) {
                q = _H.toASCIILowerCase(String(q)), K = String(K);
                var Y;
                switch (q) {
                    case "beforebegin":
                    case "afterend":
                        if (Y = this.parentNode, Y === null || Y.nodeType === xb.DOCUMENT_NODE) _H.NoModificationAllowedError();
                        break;
                    case "afterbegin":
                    case "beforeend":
                        Y = this;
                        break;
                    default:
                        _H.SyntaxError()
                }
                if (!(Y instanceof o66) || Y.ownerDocument.isHTML && Y.localName === "html" && Y.namespaceURI === og.HTML) Y = Y.ownerDocument.createElementNS(og.HTML, "body");
                var z = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, Y);
                z.parse(K, !0), this._insertAdjacent(q, z._asDocumentFragment())
            }
        },
        children: {
            get: function() {
                if (!this._children) this._children = new yt4(this);
                return this._children
            }
        },
        attributes: {
            get: function() {
                if (!this._attributes) this._attributes = new UB8(this);
                return this._attributes
            }
        },
        firstElementChild: {
            get: function() {
                for (var A = this.firstChild; A !== null; A = A.nextSibling)
                    if (A.nodeType === xb.ELEMENT_NODE) return A;
                return null
            }
        },
        lastElementChild: {
            get: function() {
                for (var A = this.lastChild; A !== null; A = A.previousSibling)
                    if (A.nodeType === xb.ELEMENT_NODE) return A;
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
                if (!q) return new gB8;
                if (q === "*") K = function() {
                    return !0
                };
                else if (this.isHTML) K = WhY(q);
                else K = QB8(q);
                return new Pk1(this, K)
            }
        },
        getElementsByTagNameNS: {
            value: function(q, K) {
                var Y;
                if (q === "*" && K === "*") Y = function() {
                    return !0
                };
                else if (q === "*") Y = QB8(K);
                else if (K === "*") Y = ZhY(q);
                else Y = GhY(q, K);
                return new Pk1(this, Y)
            }
        },
        getElementsByClassName: {
            value: function(q) {
                if (q = String(q).trim(), q === "") {
                    var K = new gB8;
                    return K
                }
                return q = q.split(/[ \t\r\n\f]+/), new Pk1(this, fhY(q))
            }
        },
        getElementsByName: {
            value: function(q) {
                return new Pk1(this, ThY(String(q)))
            }
        },
        clone: {
            value: function() {
                var q;
                if (this.namespaceURI !== og.HTML || this.prefix || !this.ownerDocument.isHTML) q = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName);
                else q = this.ownerDocument.createElement(this.localName);
                for (var K = 0, Y = this._attrKeys.length; K < Y; K++) {
                    var z = this._attrKeys[K],
                        _ = this._attrsByLName[z],
                        w = _.cloneNode();
                    w._setOwnerElement(q), q._attrsByLName[z] = w, q._addQName(w)
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
                    var _ = this._attr(Y);
                    if (_.prefix === "xmlns" && _.value === q && K.lookupNamespaceURI(_.localName) === q) return _.localName
                }
                var w = this.parentElement;
                return w ? w._lookupNamespacePrefix(q, K) : null
            }
        },
        lookupNamespaceURI: {
            value: function(q) {
                if (q === "" || q === void 0) q = null;
                if (this.namespaceURI !== null && this.prefix === q) return this.namespaceURI;
                for (var K = 0, Y = this._numattrs; K < Y; K++) {
                    var z = this._attr(K);
                    if (z.namespaceURI === og.XMLNS) {
                        if (z.prefix === "xmlns" && z.localName === q || q === null && z.prefix === null && z.localName === "xmlns") return z.value || null
                    }
                }
                var _ = this.parentElement;
                return _ ? _.lookupNamespaceURI(q) : null
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
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = _H.toASCIILowerCase(q);
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
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = _H.toASCIILowerCase(q);
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
                if (q = String(q), !BB8.isValidName(q)) _H.InvalidCharacterError();
                if (/[A-Z]/.test(q) && this.isHTML) q = _H.toASCIILowerCase(q);
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
                if (q = String(q), !BB8.isValidName(q)) _H.InvalidCharacterError();
                if (/[A-Z]/.test(q) && this.isHTML) q = _H.toASCIILowerCase(q);
                this._setAttribute(q, String(K))
            }
        },
        _setAttributeNS: {
            value: function(q, K, Y) {
                var z = K.indexOf(":"),
                    _, w;
                if (z < 0) _ = null, w = K;
                else _ = K.substring(0, z), w = K.substring(z + 1);
                if (q === "" || q === void 0) q = null;
                var O = (q === null ? "" : q) + "|" + w,
                    $ = this._attrsByLName[O],
                    H;
                if (!$) {
                    if ($ = new ml6(this, w, _, q), H = !0, this._attrsByLName[O] = $, this._attributes) this._attributes[this._attrKeys.length] = $;
                    this._attrKeys.push(O), this._addQName($)
                }
                if ($.value = Y, H && this._newattrhook) this._newattrhook(K, Y)
            }
        },
        setAttributeNS: {
            value: function(q, K, Y) {
                if (q = q === null || q === void 0 || q === "" ? null : String(q), K = String(K), !BB8.isValidQName(K)) _H.InvalidCharacterError();
                var z = K.indexOf(":"),
                    _ = z < 0 ? null : K.substring(0, z);
                if (_ !== null && q === null || _ === "xml" && q !== og.XML || (K === "xmlns" || _ === "xmlns") && q !== og.XMLNS || q === og.XMLNS && !(K === "xmlns" || _ === "xmlns")) _H.NamespaceError();
                this._setAttributeNS(q, K, String(Y))
            }
        },
        setAttributeNode: {
            value: function(q) {
                if (q.ownerElement !== null && q.ownerElement !== this) throw new MT6(MT6.INUSE_ATTRIBUTE_ERR);
                var K = null,
                    Y = this._attrsByQName[q.name];
                if (Y) {
                    if (!Array.isArray(Y)) Y = [Y];
                    if (Y.some(function(z) {
                            return z === q
                        })) return q;
                    else if (q.ownerElement !== null) throw new MT6(MT6.INUSE_ATTRIBUTE_ERR);
                    Y.forEach(function(z) {
                        this.removeAttributeNode(z)
                    }, this), K = Y[0]
                }
                return this.setAttributeNodeNS(q), K
            }
        },
        setAttributeNodeNS: {
            value: function(q) {
                if (q.ownerElement !== null) throw new MT6(MT6.INUSE_ATTRIBUTE_ERR);
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
                if (q = String(q), /[A-Z]/.test(q) && this.isHTML) q = _H.toASCIILowerCase(q);
                var K = this._attrsByQName[q];
                if (!K) return;
                if (Array.isArray(K))
                    if (K.length > 2) K = K.shift();
                    else this._attrsByQName[q] = K[1], K = K[0];
                else this._attrsByQName[q] = void 0;
                var Y = K.namespaceURI,
                    z = (Y === null ? "" : Y) + "|" + K.localName;
                this._attrsByLName[z] = void 0;
                var _ = this._attrKeys.indexOf(z);
                if (this._attributes) Array.prototype.splice.call(this._attributes, _, 1), this._attributes[q] = void 0;
                this._attrKeys.splice(_, 1);
                var w = K.onchange;
                if (K._setOwnerElement(null), w) w.call(K, this, K.localName, K.value, null);
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
                var _ = this._attrKeys.indexOf(Y);
                if (this._attributes) Array.prototype.splice.call(this._attributes, _, 1);
                this._attrKeys.splice(_, 1), this._removeQName(z);
                var w = z.onchange;
                if (z._setOwnerElement(null), w) w.call(z, this, z.localName, z.value, null);
                if (this.rooted) this.ownerDocument.mutateRemoveAttr(z)
            }
        },
        removeAttributeNode: {
            value: function(q) {
                var K = q.namespaceURI,
                    Y = (K === null ? "" : K) + "|" + q.localName;
                if (this._attrsByLName[Y] !== q) _H.NotFoundError();
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
                var K = new ml6(this, q, null, null),
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
                    if (_H.assert(Y !== -1), K.length === 2) {
                        if (this._attrsByQName[q] = K[1 - Y], this._attributes) this._attributes[q] = this._attrsByQName[q]
                    } else if (K.splice(Y, 1), this._attributes && this._attributes[q] === A) this._attributes[q] = K[0]
                } else if (_H.assert(K === A), this._attrsByQName[q] = void 0, this._attributes) this._attributes[q] = void 0
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
        id: Wk1.property({
            name: "id"
        }),
        className: Wk1.property({
            name: "class"
        }),
        classList: {
            get: function() {
                var A = this;
                if (this._classList) return this._classList;
                var q = new DhY(function() {
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
                return FB8.matches(this, A)
            }
        },
        closest: {
            value: function(A) {
                var q = this;
                do {
                    if (q.matches && q.matches(A)) return q;
                    q = q.parentElement || q.parentNode
                } while (q !== null && q.nodeType === xb.ELEMENT_NODE);
                return null
            }
        },
        querySelector: {
            value: function(A) {
                return FB8(A, this)[0]
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = FB8(A, this);
                return q.item ? q : new gB8(q)
            }
        }
    });
    Object.defineProperties(o66.prototype, XhY);
    Object.defineProperties(o66.prototype, PhY);
    Wk1.registerChangeHandler(o66, "id", function(A, q, K, Y) {
        if (A.rooted) {
            if (K) A.ownerDocument.delId(K, A);
            if (Y) A.ownerDocument.addId(Y, A)
        }
    });
    Wk1.registerChangeHandler(o66, "class", function(A, q, K, Y) {
        if (A._classList) A._classList._update()
    });

    function ml6(A, q, K, Y, z) {
        this.localName = q, this.prefix = K === null || K === "" ? null : "" + K, this.namespaceURI = Y === null || Y === "" ? null : "" + Y, this.data = z, this._setOwnerElement(A)
    }
    ml6.prototype = Object.create(Object.prototype, {
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
                return new ml6(null, this.localName, this.prefix, this.namespaceURI, this.data)
            }
        },
        nodeType: {
            get: function() {
                return xb.ATTRIBUTE_NODE
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
    o66._Attr = ml6;

    function UB8(A) {
        Et4.call(this, A);
        for (var q in A._attrsByQName) this[q] = A._attrsByQName[q];
        for (var K = 0; K < A._attrKeys.length; K++) this[K] = A._attrsByLName[A._attrKeys[K]]
    }
    UB8.prototype = Object.create(Et4.prototype, {
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
    if (globalThis.Symbol?.iterator) UB8.prototype[globalThis.Symbol.iterator] = function() {
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

    function yt4(A) {
        this.element = A, this.updateCache()
    }
    yt4.prototype = Object.create(Object.prototype, {
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
                        if (z.nodeType === xb.ELEMENT_NODE) {
                            this[this.childrenByNumber.length] = z, this.childrenByNumber.push(z);
                            var _ = z.getAttribute("id");
                            if (_ && !this.childrenByName[_]) this.childrenByName[_] = z;
                            var w = z.getAttribute("name");
                            if (w && this.element.namespaceURI === og.HTML && q.test(this.element.localName) && !this.childrenByName[w]) this.childrenByName[_] = z
                        }
                }
            }
        }
    });

    function QB8(A) {
        return function(q) {
            return q.localName === A
        }
    }

    function WhY(A) {
        var q = _H.toASCIILowerCase(A);
        if (q === A) return QB8(A);
        return function(K) {
            return K.isHTML ? K.localName === q : K.localName === A
        }
    }

    function ZhY(A) {
        return function(q) {
            return q.namespaceURI === A
        }
    }

    function GhY(A, q) {
        return function(K) {
            return K.namespaceURI === A && K.localName === q
        }
    }

    function fhY(A) {
        return function(q) {
            return A.every(function(K) {
                return q.classList.contains(K)
            })
        }
    }

    function ThY(A) {
        return function(q) {
            if (q.namespaceURI !== og.HTML) return !1;
            return q.getAttribute("name") === A
        }
    }
})
// @from(Ln 349742, Col 4)
dB8 = x((crw, It4) => {
    It4.exports = Ct4;
    var ht4 = u0(),
        vhY = Tz6(),
        St4 = Hj(),
        Rt4 = St4.HierarchyRequestError,
        NhY = St4.NotFoundError;

    function Ct4() {
        ht4.call(this)
    }
    Ct4.prototype = Object.create(ht4.prototype, {
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
                Rt4()
            }
        },
        replaceChild: {
            value: function(A, q) {
                if (!A.nodeType) throw TypeError("not a node");
                Rt4()
            }
        },
        removeChild: {
            value: function(A) {
                if (!A.nodeType) throw TypeError("not a node");
                NhY()
            }
        },
        removeChildren: {
            value: function() {}
        },
        childNodes: {
            get: function() {
                if (!this._childNodes) this._childNodes = new vhY;
                return this._childNodes
            }
        }
    })
})
// @from(Ln 349794, Col 4)
Bl6 = x((lrw, ut4) => {
    ut4.exports = Zk1;
    var xt4 = dB8(),
        bt4 = Hj(),
        VhY = Xk1(),
        khY = uB8();

    function Zk1() {
        xt4.call(this)
    }
    Zk1.prototype = Object.create(xt4.prototype, {
        substringData: {
            value: function(q, K) {
                if (arguments.length < 2) throw TypeError("Not enough arguments");
                if (q = q >>> 0, K = K >>> 0, q > this.data.length || q < 0 || K < 0) bt4.IndexSizeError();
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
                    _ = z.length;
                if (q = q >>> 0, K = K >>> 0, Y = String(Y), q > _ || q < 0) bt4.IndexSizeError();
                if (q + K > _) K = _ - q;
                var w = z.substring(0, q),
                    O = z.substring(q + K);
                this.data = w + Y + O
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
    Object.defineProperties(Zk1.prototype, VhY);
    Object.defineProperties(Zk1.prototype, khY)
})
// @from(Ln 349853, Col 4)
lB8 = x((irw, Ft4) => {
    Ft4.exports = cB8;
    var mt4 = Hj(),
        Bt4 = u0(),
        gt4 = Bl6();

    function cB8(A, q) {
        gt4.call(this), this.nodeType = Bt4.TEXT_NODE, this.ownerDocument = A, this._data = q, this._index = void 0
    }
    var gl6 = {
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
    cB8.prototype = Object.create(gt4.prototype, {
        nodeName: {
            value: "#text"
        },
        nodeValue: gl6,
        textContent: gl6,
        innerText: gl6,
        data: {
            get: gl6.get,
            set: function(A) {
                gl6.set.call(this, A === null ? "" : String(A))
            }
        },
        splitText: {
            value: function(q) {
                if (q > this._data.length || q < 0) mt4.IndexSizeError();
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
                    if (K.nodeType !== Bt4.TEXT_NODE) break;
                    q += K.textContent
                }
                return q
            }
        },
        replaceWholeText: {
            value: mt4.nyi
        },
        clone: {
            value: function() {
                return new cB8(this.ownerDocument, this._data)
            }
        }
    })
})
// @from(Ln 349918, Col 4)
nB8 = x((nrw, Qt4) => {
    Qt4.exports = iB8;
    var EhY = u0(),
        pt4 = Bl6();

    function iB8(A, q) {
        pt4.call(this), this.nodeType = EhY.COMMENT_NODE, this.ownerDocument = A, this._data = q
    }
    var Fl6 = {
        get: function() {
            return this._data
        },
        set: function(A) {
            if (A === null || A === void 0) A = "";
            else A = String(A);
            if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
        }
    };
    iB8.prototype = Object.create(pt4.prototype, {
        nodeName: {
            value: "#comment"
        },
        nodeValue: Fl6,
        textContent: Fl6,
        innerText: Fl6,
        data: {
            get: Fl6.get,
            set: function(A) {
                Fl6.set.call(this, A === null ? "" : String(A))
            }
        },
        clone: {
            value: function() {
                return new iB8(this.ownerDocument, this._data)
            }
        }
    })
})
// @from(Ln 349956, Col 4)
oB8 = x((rrw, ct4) => {
    ct4.exports = rB8;
    var yhY = u0(),
        LhY = Tz6(),
        dt4 = $k1(),
        Gk1 = DT6(),
        RhY = Dk1(),
        Ut4 = Hj();

    function rB8(A) {
        dt4.call(this), this.nodeType = yhY.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = A
    }
    rB8.prototype = Object.create(dt4.prototype, {
        nodeName: {
            value: "#document-fragment"
        },
        nodeValue: {
            get: function() {
                return null
            },
            set: function() {}
        },
        textContent: Object.getOwnPropertyDescriptor(Gk1.prototype, "textContent"),
        innerText: Object.getOwnPropertyDescriptor(Gk1.prototype, "innerText"),
        querySelector: {
            value: function(A) {
                var q = this.querySelectorAll(A);
                return q.length ? q[0] : null
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = Object.create(this);
                q.isHTML = !0, q.getElementsByTagName = Gk1.prototype.getElementsByTagName, q.nextElement = Object.getOwnPropertyDescriptor(Gk1.prototype, "firstElementChild").get;
                var K = RhY(A, q);
                return K.item ? K : new LhY(K)
            }
        },
        clone: {
            value: function() {
                return new rB8(this.ownerDocument)
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
            set: Ut4.nyi
        },
        outerHTML: {
            get: function() {
                return this.serialize()
            },
            set: Ut4.nyi
        }
    })
})
// @from(Ln 350018, Col 4)
sB8 = x((orw, it4) => {
    it4.exports = aB8;
    var hhY = u0(),
        lt4 = Bl6();

    function aB8(A, q, K) {
        lt4.call(this), this.nodeType = hhY.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = A, this.target = q, this._data = K
    }
    var pl6 = {
        get: function() {
            return this._data
        },
        set: function(A) {
            if (A === null || A === void 0) A = "";
            else A = String(A);
            if (this._data = A, this.rooted) this.ownerDocument.mutateValue(this)
        }
    };
    aB8.prototype = Object.create(lt4.prototype, {
        nodeName: {
            get: function() {
                return this.target
            }
        },
        nodeValue: pl6,
        textContent: pl6,
        innerText: pl6,
        data: {
            get: pl6.get,
            set: function(A) {
                pl6.set.call(this, A === null ? "" : String(A))
            }
        },
        clone: {
            value: function() {
                return new aB8(this.ownerDocument, this.target, this._data)
            }
        },
        isEqual: {
            value: function(q) {
                return this.target === q.target && this._data === q._data
            }
        }
    })
})
// @from(Ln 350063, Col 4)
Ql6 = x((arw, nt4) => {
    var tB8 = {
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
    nt4.exports = tB8.constructor = tB8.prototype = tB8
})
// @from(Ln 350084, Col 4)
Ag8 = x((trw, ot4) => {
    var srw = ot4.exports = {
        nextSkippingChildren: ShY,
        nextAncestorSibling: eB8,
        next: ChY,
        previous: IhY,
        deepLastChild: rt4
    };

    function ShY(A, q) {
        if (A === q) return null;
        if (A.nextSibling !== null) return A.nextSibling;
        return eB8(A, q)
    }

    function eB8(A, q) {
        for (A = A.parentNode; A !== null; A = A.parentNode) {
            if (A === q) return null;
            if (A.nextSibling !== null) return A.nextSibling
        }
        return null
    }

    function ChY(A, q) {
        var K = A.firstChild;
        if (K !== null) return K;
        if (A === q) return null;
        if (K = A.nextSibling, K !== null) return K;
        return eB8(A, q)
    }

    function rt4(A) {
        while (A.lastChild) A = A.lastChild;
        return A
    }

    function IhY(A, q) {
        var K = A.previousSibling;
        if (K !== null) return rt4(K);
        if (K = A.parentNode, K === q) return null;
        return K
    }
})
// @from(Ln 350127, Col 4)
Ke4 = x((erw, qe4) => {
    qe4.exports = Ae4;
    var bhY = u0(),
        m0 = Ql6(),
        at4 = Ag8(),
        et4 = Hj(),
        qg8 = {
            first: "firstChild",
            last: "lastChild",
            next: "firstChild",
            previous: "lastChild"
        },
        Kg8 = {
            first: "nextSibling",
            last: "previousSibling",
            next: "nextSibling",
            previous: "previousSibling"
        };

    function st4(A, q) {
        var K, Y, z, _, w;
        Y = A._currentNode[qg8[q]];
        while (Y !== null) {
            if (_ = A._internalFilter(Y), _ === m0.FILTER_ACCEPT) return A._currentNode = Y, Y;
            if (_ === m0.FILTER_SKIP) {
                if (K = Y[qg8[q]], K !== null) {
                    Y = K;
                    continue
                }
            }
            while (Y !== null) {
                if (w = Y[Kg8[q]], w !== null) {
                    Y = w;
                    break
                }
                if (z = Y.parentNode, z === null || z === A.root || z === A._currentNode) return null;
                else Y = z
            }
        }
        return null
    }

    function tt4(A, q) {
        var K, Y, z;
        if (K = A._currentNode, K === A.root) return null;
        while (!0) {
            z = K[Kg8[q]];
            while (z !== null) {
                if (K = z, Y = A._internalFilter(K), Y === m0.FILTER_ACCEPT) return A._currentNode = K, K;
                if (z = K[qg8[q]], Y === m0.FILTER_REJECT || z === null) z = K[Kg8[q]]
            }
            if (K = K.parentNode, K === null || K === A.root) return null;
            if (A._internalFilter(K) === m0.FILTER_ACCEPT) return null
        }
    }

    function Ae4(A, q, K) {
        if (!A || !A.nodeType) et4.NotSupportedError();
        this._root = A, this._whatToShow = Number(q) || 0, this._filter = K || null, this._active = !1, this._currentNode = A
    }
    Object.defineProperties(Ae4.prototype, {
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
                if (!(q instanceof bhY)) throw TypeError("Not a Node");
                this._currentNode = q
            }
        },
        _internalFilter: {
            value: function(q) {
                var K, Y;
                if (this._active) et4.InvalidStateError();
                if (!(1 << q.nodeType - 1 & this._whatToShow)) return m0.FILTER_SKIP;
                if (Y = this._filter, Y === null) K = m0.FILTER_ACCEPT;
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
                    if (this._internalFilter(q) === m0.FILTER_ACCEPT) return this._currentNode = q, q
                }
                return null
            }
        },
        firstChild: {
            value: function() {
                return st4(this, "first")
            }
        },
        lastChild: {
            value: function() {
                return st4(this, "last")
            }
        },
        previousSibling: {
            value: function() {
                return tt4(this, "previous")
            }
        },
        nextSibling: {
            value: function() {
                return tt4(this, "next")
            }
        },
        previousNode: {
            value: function() {
                var q, K, Y, z;
                q = this._currentNode;
                while (q !== this._root) {
                    for (Y = q.previousSibling; Y; Y = q.previousSibling) {
                        if (q = Y, K = this._internalFilter(q), K === m0.FILTER_REJECT) continue;
                        for (z = q.lastChild; z; z = q.lastChild)
                            if (q = z, K = this._internalFilter(q), K === m0.FILTER_REJECT) break;
                        if (K === m0.FILTER_ACCEPT) return this._currentNode = q, q
                    }
                    if (q === this.root || q.parentNode === null) return null;
                    if (q = q.parentNode, this._internalFilter(q) === m0.FILTER_ACCEPT) return this._currentNode = q, q
                }
                return null
            }
        },
        nextNode: {
            value: function() {
                var q, K, Y, z;
                q = this._currentNode, K = m0.FILTER_ACCEPT;
                A: while (!0) {
                    for (Y = q.firstChild; Y; Y = q.firstChild)
                        if (q = Y, K = this._internalFilter(q), K === m0.FILTER_ACCEPT) return this._currentNode = q, q;
                        else if (K === m0.FILTER_REJECT) break;
                    for (z = at4.nextSkippingChildren(q, this.root); z; z = at4.nextSkippingChildren(q, this.root))
                        if (q = z, K = this._internalFilter(q), K === m0.FILTER_ACCEPT) return this._currentNode = q, q;
                        else if (K === m0.FILTER_SKIP) continue A;
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
// @from(Ln 350299, Col 4)
$e4 = x((Aow, Oe4) => {
    Oe4.exports = we4;
    var Yg8 = Ql6(),
        zg8 = Ag8(),
        _e4 = Hj();

    function xhY(A, q, K) {
        if (K) return zg8.next(A, q);
        else {
            if (A === q) return null;
            return zg8.previous(A, null)
        }
    }

    function Ye4(A, q) {
        for (; q; q = q.parentNode)
            if (A === q) return !0;
        return !1
    }

    function ze4(A, q) {
        var K, Y;
        K = A._referenceNode, Y = A._pointerBeforeReferenceNode;
        while (!0) {
            if (Y === q) Y = !Y;
            else if (K = xhY(K, A._root, q), K === null) return null;
            var z = A._internalFilter(K);
            if (z === Yg8.FILTER_ACCEPT) break
        }
        return A._referenceNode = K, A._pointerBeforeReferenceNode = Y, K
    }

    function we4(A, q, K) {
        if (!A || !A.nodeType) _e4.NotSupportedError();
        this._root = A, this._referenceNode = A, this._pointerBeforeReferenceNode = !0, this._whatToShow = Number(q) || 0, this._filter = K || null, this._active = !1, A.doc._attachNodeIterator(this)
    }
    Object.defineProperties(we4.prototype, {
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
                if (this._active) _e4.InvalidStateError();
                if (!(1 << q.nodeType - 1 & this._whatToShow)) return Yg8.FILTER_SKIP;
                if (Y = this._filter, Y === null) K = Yg8.FILTER_ACCEPT;
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
                if (Ye4(q, this._root)) return;
                if (!Ye4(q, this._referenceNode)) return;
                if (this._pointerBeforeReferenceNode) {
                    var K = q;
                    while (K.lastChild) K = K.lastChild;
                    if (K = zg8.next(K, this.root), K) {
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
                return ze4(this, !0)
            }
        },
        previousNode: {
            value: function() {
                return ze4(this, !1)
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
// @from(Ln 350420, Col 4)
fk1 = x((qow, He4) => {
    He4.exports = B0;

    function B0(A) {
        if (!A) return Object.create(B0.prototype);
        this.url = A.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var q = B0.pattern.exec(this.url);
        if (q) {
            if (q[2]) this.scheme = q[2];
            if (q[4]) {
                var K = q[4].match(B0.userinfoPattern);
                if (K) this.username = K[1], this.password = K[3], q[4] = q[4].substring(K[0].length);
                if (q[4].match(B0.portPattern)) {
                    var Y = q[4].lastIndexOf(":");
                    this.host = q[4].substring(0, Y), this.port = q[4].substring(Y + 1)
                } else this.host = q[4]
            }
            if (q[5]) this.path = q[5];
            if (q[6]) this.query = q[7];
            if (q[8]) this.fragment = q[9]
        }
    }
    B0.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
    B0.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
    B0.portPattern = /:\d+$/;
    B0.authorityPattern = /^[^:\/?#]+:\/\//;
    B0.hierarchyPattern = /^[^:\/?#]+:\//;
    B0.percentEncode = function(q) {
        var K = q.charCodeAt(0);
        if (K < 256) return "%" + K.toString(16);
        else throw Error("can't percent-encode codepoints > 255 yet")
    };
    B0.prototype = {
        constructor: B0,
        isAbsolute: function() {
            return !!this.scheme
        },
        isAuthorityBased: function() {
            return B0.authorityPattern.test(this.url)
        },
        isHierarchical: function() {
            return B0.hierarchyPattern.test(this.url)
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
                K = new B0(A),
                Y = new B0;
            if (K.scheme !== void 0) Y.scheme = K.scheme, Y.username = K.username, Y.password = K.password, Y.host = K.host, Y.port = K.port, Y.path = _(K.path), Y.query = K.query;
            else if (Y.scheme = q.scheme, K.host !== void 0) Y.username = K.username, Y.password = K.password, Y.host = K.host, Y.port = K.port, Y.path = _(K.path), Y.query = K.query;
            else if (Y.username = q.username, Y.password = q.password, Y.host = q.host, Y.port = q.port, !K.path)
                if (Y.path = q.path, K.query !== void 0) Y.query = K.query;
                else Y.query = q.query;
            else {
                if (K.path.charAt(0) === "/") Y.path = _(K.path);
                else Y.path = z(q.path, K.path), Y.path = _(Y.path);
                Y.query = K.query
            }
            return Y.fragment = K.fragment, Y.toString();

            function z(w, O) {
                if (q.host !== void 0 && !q.path) return "/" + O;
                var $ = w.lastIndexOf("/");
                if ($ === -1) return O;
                else return w.substring(0, $ + 1) + O
            }

            function _(w) {
                if (!w) return w;
                var O = "";
                while (w.length > 0) {
                    if (w === "." || w === "..") {
                        w = "";
                        break
                    }
                    var $ = w.substring(0, 2),
                        H = w.substring(0, 3),
                        j = w.substring(0, 4);
                    if (H === "../") w = w.substring(3);
                    else if ($ === "./") w = w.substring(2);
                    else if (H === "/./") w = "/" + w.substring(3);
                    else if ($ === "/." && w.length === 2) w = "/";
                    else if (j === "/../" || H === "/.." && w.length === 3) w = "/" + w.substring(4), O = O.replace(/\/?[^\/]*$/, "");
                    else {
                        var J = w.match(/(\/?([^\/]*))/)[0];
                        O += J, w = w.substring(J.length)
                    }
                }
                return O
            }
        }
    }
})
// @from(Ln 350528, Col 4)
Me4 = x((Kow, Je4) => {
    Je4.exports = _g8;
    var je4 = wT6();

    function _g8(A, q) {
        je4.call(this, A, q)
    }
    _g8.prototype = Object.create(je4.prototype, {
        constructor: {
            value: _g8
        }
    })
})
// @from(Ln 350541, Col 4)
wg8 = x((Yow, De4) => {
    De4.exports = {
        Event: wT6(),
        UIEvent: JB8(),
        MouseEvent: DB8(),
        CustomEvent: Me4()
    }
})
// @from(Ln 350549, Col 4)
Ze4 = x((Pe4) => {
    Object.defineProperty(Pe4, "__esModule", {
        value: !0
    });
    Pe4.hyphenate = Pe4.parse = void 0;

    function uhY(A) {
        let q = [],
            K = 0,
            Y = 0,
            z = 0,
            _ = 0,
            w = 0,
            O = null;
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
                if (!O && Y === 0 && z === 0) O = Xe4(A.substring(w, K - 1).trim()), _ = K;
                break;
            case 59:
                if (O && _ > 0 && Y === 0 && z === 0) {
                    let H = A.substring(_, K - 1).trim();
                    q.push(O, H), w = K, _ = 0, O = null
                }
                break
        }
        if (O && _) {
            let $ = A.slice(_).trim();
            q.push(O, $)
        }
        return q
    }
    Pe4.parse = uhY;

    function Xe4(A) {
        return A.replace(/[a-z][A-Z]/g, (q) => {
            return q.charAt(0) + "-" + q.charAt(1)
        }).toLowerCase()
    }
    Pe4.hyphenate = Xe4
})
// @from(Ln 350603, Col 4)
Tk1 = x((_ow, Ne4) => {
    var {
        parse: BhY
    } = Ze4();
    Ne4.exports = function(A) {
        let q = new ve4(A);
        return new Proxy(q, {
            get: function(Y, z) {
                return z in Y ? Y[z] : Y.getPropertyValue(Ge4(z))
            },
            has: function(Y, z) {
                return !0
            },
            set: function(Y, z, _) {
                if (z in Y) Y[z] = _;
                else Y.setProperty(Ge4(z), _ ?? void 0);
                return !0
            }
        })
    };

    function Ge4(A) {
        return A.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    }

    function ve4(A) {
        this._element = A
    }
    var fe4 = "!important";

    function Te4(A) {
        let q = {
            property: {},
            priority: {}
        };
        if (!A) return q;
        let K = BhY(A);
        if (K.length < 2) return q;
        for (let Y = 0; Y < K.length; Y += 2) {
            let z = K[Y],
                _ = K[Y + 1];
            if (_.endsWith(fe4)) q.priority[z] = "important", _ = _.slice(0, -fe4.length).trim();
            q.property[z] = _
        }
        return q
    }
    var XT6 = {};
    ve4.prototype = Object.create(Object.prototype, {
        _parsed: {
            get: function() {
                if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
                    var A = this.cssText;
                    this._parsedStyles = Te4(A), this._lastParsedText = A, delete this._names
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
                if (q !== XT6) q = "" + q;
                if (q = q.trim(), q === "") {
                    this.removeProperty(A);
                    return
                }
                if (K !== "" && K !== XT6 && !/^important$/i.test(K)) return;
                var Y = this._parsed;
                if (q === XT6) {
                    if (!Y.property[A]) return;
                    if (K !== "") Y.priority[A] = "important";
                    else delete Y.priority[A]
                } else {
                    if (q.indexOf(";") !== -1) return;
                    var z = Te4(A + ":" + q);
                    if (Object.getOwnPropertyNames(z.property).length === 0) return;
                    if (Object.getOwnPropertyNames(z.priority).length !== 0) return;
                    for (var _ in z.property)
                        if (Y.property[_] = z.property[_], K === XT6) continue;
                        else if (K !== "") Y.priority[_] = "important";
                    else if (Y.priority[_]) delete Y.priority[_]
                }
                this._serialize()
            }
        },
        setPropertyValue: {
            value: function(A, q) {
                return this.setProperty(A, q, XT6)
            }
        },
        setPropertyPriority: {
            value: function(A, q) {
                return this.setProperty(A, XT6, q)
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