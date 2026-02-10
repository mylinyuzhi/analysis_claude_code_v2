
// @from(Ln 60361, Col 4)
G08 = R((P12, W08) => {
    (() => {
        var A = {
                d: (P1, k1) => {
                    for (var o1 in k1) A.o(k1, o1) && !A.o(P1, o1) && Object.defineProperty(P1, o1, {
                        enumerable: !0,
                        get: k1[o1]
                    })
                },
                o: (P1, k1) => Object.prototype.hasOwnProperty.call(P1, k1),
                r: (P1) => {
                    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(P1, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(P1, "__esModule", {
                        value: !0
                    })
                }
            },
            q = {};
        A.r(q), A.d(q, {
            XMLBuilder: () => K6,
            XMLParser: () => y1,
            XMLValidator: () => F6
        });
        let K = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
            Y = new RegExp("^[" + K + "][" + K + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");

        function z(P1, k1) {
            let o1 = [],
                _6 = k1.exec(P1);
            for (; _6;) {
                let z6 = [];
                z6.startIndex = k1.lastIndex - _6[0].length;
                let w6 = _6.length;
                for (let r6 = 0; r6 < w6; r6++) z6.push(_6[r6]);
                o1.push(z6), _6 = k1.exec(P1)
            }
            return o1
        }
        let w = function(P1) {
                return Y.exec(P1) != null
            },
            H = {
                allowBooleanAttributes: !1,
                unpairedTags: []
            };

        function $(P1, k1) {
            k1 = Object.assign({}, H, k1);
            let o1 = [],
                _6 = !1,
                z6 = !1;
            P1[0] === "\uFEFF" && (P1 = P1.substr(1));
            for (let w6 = 0; w6 < P1.length; w6++)
                if (P1[w6] === "<" && P1[w6 + 1] === "?") {
                    if (w6 += 2, w6 = _(P1, w6), w6.err) return w6
                } else {
                    if (P1[w6] !== "<") {
                        if (O(P1[w6])) continue;
                        return G("InvalidChar", "char '" + P1[w6] + "' is not expected.", Z(P1, w6))
                    } {
                        let r6 = w6;
                        if (w6++, P1[w6] === "!") {
                            w6 = J(P1, w6);
                            continue
                        } {
                            let G6 = !1;
                            P1[w6] === "/" && (G6 = !0, w6++);
                            let L6 = "";
                            for (; w6 < P1.length && P1[w6] !== ">" && P1[w6] !== " " && P1[w6] !== "\t" && P1[w6] !== `
` && P1[w6] !== "\r"; w6++) L6 += P1[w6];
                            if (L6 = L6.trim(), L6[L6.length - 1] === "/" && (L6 = L6.substring(0, L6.length - 1), w6--), !w(L6)) {
                                let lA;
                                return lA = L6.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + L6 + "' is an invalid name.", G("InvalidTag", lA, Z(P1, w6))
                            }
                            let OA = j(P1, w6);
                            if (OA === !1) return G("InvalidAttr", "Attributes for '" + L6 + "' have open quote.", Z(P1, w6));
                            let bA = OA.value;
                            if (w6 = OA.index, bA[bA.length - 1] === "/") {
                                let lA = w6 - bA.length;
                                bA = bA.substring(0, bA.length - 1);
                                let E7 = P(bA, k1);
                                if (E7 !== !0) return G(E7.err.code, E7.err.msg, Z(P1, lA + E7.err.line));
                                _6 = !0
                            } else if (G6) {
                                if (!OA.tagClosed) return G("InvalidTag", "Closing tag '" + L6 + "' doesn't have proper closing.", Z(P1, w6));
                                if (bA.trim().length > 0) return G("InvalidTag", "Closing tag '" + L6 + "' can't have attributes or invalid starting.", Z(P1, r6));
                                if (o1.length === 0) return G("InvalidTag", "Closing tag '" + L6 + "' has not been opened.", Z(P1, r6));
                                {
                                    let lA = o1.pop();
                                    if (L6 !== lA.tagName) {
                                        let E7 = Z(P1, lA.tagStartPos);
                                        return G("InvalidTag", "Expected closing tag '" + lA.tagName + "' (opened in line " + E7.line + ", col " + E7.col + ") instead of closing tag '" + L6 + "'.", Z(P1, r6))
                                    }
                                    o1.length == 0 && (z6 = !0)
                                }
                            } else {
                                let lA = P(bA, k1);
                                if (lA !== !0) return G(lA.err.code, lA.err.msg, Z(P1, w6 - bA.length + lA.err.line));
                                if (z6 === !0) return G("InvalidXml", "Multiple possible root nodes found.", Z(P1, w6));
                                k1.unpairedTags.indexOf(L6) !== -1 || o1.push({
                                    tagName: L6,
                                    tagStartPos: r6
                                }), _6 = !0
                            }
                            for (w6++; w6 < P1.length; w6++)
                                if (P1[w6] === "<") {
                                    if (P1[w6 + 1] === "!") {
                                        w6++, w6 = J(P1, w6);
                                        continue
                                    }
                                    if (P1[w6 + 1] !== "?") break;
                                    if (w6 = _(P1, ++w6), w6.err) return w6
                                } else if (P1[w6] === "&") {
                                let lA = W(P1, w6);
                                if (lA == -1) return G("InvalidChar", "char '&' is not expected.", Z(P1, w6));
                                w6 = lA
                            } else if (z6 === !0 && !O(P1[w6])) return G("InvalidXml", "Extra text at the end", Z(P1, w6));
                            P1[w6] === "<" && w6--
                        }
                    }
                } return _6 ? o1.length == 1 ? G("InvalidTag", "Unclosed tag '" + o1[0].tagName + "'.", Z(P1, o1[0].tagStartPos)) : !(o1.length > 0) || G("InvalidXml", "Invalid '" + JSON.stringify(o1.map((w6) => w6.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
                line: 1,
                col: 1
            }) : G("InvalidXml", "Start tag expected.", 1)
        }

        function O(P1) {
            return P1 === " " || P1 === "\t" || P1 === `
` || P1 === "\r"
        }

        function _(P1, k1) {
            let o1 = k1;
            for (; k1 < P1.length; k1++)
                if (P1[k1] != "?" && P1[k1] != " ");
                else {
                    let _6 = P1.substr(o1, k1 - o1);
                    if (k1 > 5 && _6 === "xml") return G("InvalidXml", "XML declaration allowed only at the start of the document.", Z(P1, k1));
                    if (P1[k1] == "?" && P1[k1 + 1] == ">") {
                        k1++;
                        break
                    }
                } return k1
        }

        function J(P1, k1) {
            if (P1.length > k1 + 5 && P1[k1 + 1] === "-" && P1[k1 + 2] === "-") {
                for (k1 += 3; k1 < P1.length; k1++)
                    if (P1[k1] === "-" && P1[k1 + 1] === "-" && P1[k1 + 2] === ">") {
                        k1 += 2;
                        break
                    }
            } else if (P1.length > k1 + 8 && P1[k1 + 1] === "D" && P1[k1 + 2] === "O" && P1[k1 + 3] === "C" && P1[k1 + 4] === "T" && P1[k1 + 5] === "Y" && P1[k1 + 6] === "P" && P1[k1 + 7] === "E") {
                let o1 = 1;
                for (k1 += 8; k1 < P1.length; k1++)
                    if (P1[k1] === "<") o1++;
                    else if (P1[k1] === ">" && (o1--, o1 === 0)) break
            } else if (P1.length > k1 + 9 && P1[k1 + 1] === "[" && P1[k1 + 2] === "C" && P1[k1 + 3] === "D" && P1[k1 + 4] === "A" && P1[k1 + 5] === "T" && P1[k1 + 6] === "A" && P1[k1 + 7] === "[") {
                for (k1 += 8; k1 < P1.length; k1++)
                    if (P1[k1] === "]" && P1[k1 + 1] === "]" && P1[k1 + 2] === ">") {
                        k1 += 2;
                        break
                    }
            }
            return k1
        }
        let X = '"',
            D = "'";

        function j(P1, k1) {
            let o1 = "",
                _6 = "",
                z6 = !1;
            for (; k1 < P1.length; k1++) {
                if (P1[k1] === X || P1[k1] === D) _6 === "" ? _6 = P1[k1] : _6 !== P1[k1] || (_6 = "");
                else if (P1[k1] === ">" && _6 === "") {
                    z6 = !0;
                    break
                }
                o1 += P1[k1]
            }
            return _6 === "" && {
                value: o1,
                index: k1,
                tagClosed: z6
            }
        }
        let M = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");

        function P(P1, k1) {
            let o1 = z(P1, M),
                _6 = {};
            for (let z6 = 0; z6 < o1.length; z6++) {
                if (o1[z6][1].length === 0) return G("InvalidAttr", "Attribute '" + o1[z6][2] + "' has no space in starting.", N(o1[z6]));
                if (o1[z6][3] !== void 0 && o1[z6][4] === void 0) return G("InvalidAttr", "Attribute '" + o1[z6][2] + "' is without value.", N(o1[z6]));
                if (o1[z6][3] === void 0 && !k1.allowBooleanAttributes) return G("InvalidAttr", "boolean attribute '" + o1[z6][2] + "' is not allowed.", N(o1[z6]));
                let w6 = o1[z6][2];
                if (!f(w6)) return G("InvalidAttr", "Attribute '" + w6 + "' is an invalid name.", N(o1[z6]));
                if (_6.hasOwnProperty(w6)) return G("InvalidAttr", "Attribute '" + w6 + "' is repeated.", N(o1[z6]));
                _6[w6] = 1
            }
            return !0
        }

        function W(P1, k1) {
            if (P1[++k1] === ";") return -1;
            if (P1[k1] === "#") return function(_6, z6) {
                let w6 = /\d/;
                for (_6[z6] === "x" && (z6++, w6 = /[\da-fA-F]/); z6 < _6.length; z6++) {
                    if (_6[z6] === ";") return z6;
                    if (!_6[z6].match(w6)) break
                }
                return -1
            }(P1, ++k1);
            let o1 = 0;
            for (; k1 < P1.length; k1++, o1++)
                if (!(P1[k1].match(/\w/) && o1 < 20)) {
                    if (P1[k1] === ";") break;
                    return -1
                } return k1
        }

        function G(P1, k1, o1) {
            return {
                err: {
                    code: P1,
                    msg: k1,
                    line: o1.line || o1,
                    col: o1.col
                }
            }
        }

        function f(P1) {
            return w(P1)
        }

        function Z(P1, k1) {
            let o1 = P1.substring(0, k1).split(/\r?\n/);
            return {
                line: o1.length,
                col: o1[o1.length - 1].length + 1
            }
        }

        function N(P1) {
            return P1.startIndex + P1[1].length
        }
        let T = {
                preserveOrder: !1,
                attributeNamePrefix: "@_",
                attributesGroupName: !1,
                textNodeName: "#text",
                ignoreAttributes: !0,
                removeNSPrefix: !1,
                allowBooleanAttributes: !1,
                parseTagValue: !0,
                parseAttributeValue: !1,
                trimValues: !0,
                cdataPropName: !1,
                numberParseOptions: {
                    hex: !0,
                    leadingZeros: !0,
                    eNotation: !0
                },
                tagValueProcessor: function(P1, k1) {
                    return k1
                },
                attributeValueProcessor: function(P1, k1) {
                    return k1
                },
                stopNodes: [],
                alwaysCreateTextNode: !1,
                isArray: () => !1,
                commentPropName: !1,
                unpairedTags: [],
                processEntities: !0,
                htmlEntities: !1,
                ignoreDeclaration: !1,
                ignorePiTags: !1,
                transformTagName: !1,
                transformAttributeName: !1,
                updateTag: function(P1, k1, o1) {
                    return P1
                },
                captureMetaData: !1
            },
            k;
        k = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");
        class y {
            constructor(P1) {
                this.tagname = P1, this.child = [], this[":@"] = {}
            }
            add(P1, k1) {
                P1 === "__proto__" && (P1 = "#__proto__"), this.child.push({
                    [P1]: k1
                })
            }
            addChild(P1, k1) {
                P1.tagname === "__proto__" && (P1.tagname = "#__proto__"), P1[":@"] && Object.keys(P1[":@"]).length > 0 ? this.child.push({
                    [P1.tagname]: P1.child,
                    ":@": P1[":@"]
                }) : this.child.push({
                    [P1.tagname]: P1.child
                }), k1 !== void 0 && (this.child[this.child.length - 1][k] = {
                    startIndex: k1
                })
            }
            static getMetaDataSymbol() {
                return k
            }
        }

        function B(P1, k1) {
            let o1 = {};
            if (P1[k1 + 3] !== "O" || P1[k1 + 4] !== "C" || P1[k1 + 5] !== "T" || P1[k1 + 6] !== "Y" || P1[k1 + 7] !== "P" || P1[k1 + 8] !== "E") throw Error("Invalid Tag instead of DOCTYPE");
            {
                k1 += 9;
                let _6 = 1,
                    z6 = !1,
                    w6 = !1,
                    r6 = "";
                for (; k1 < P1.length; k1++)
                    if (P1[k1] !== "<" || w6)
                        if (P1[k1] === ">") {
                            if (w6 ? P1[k1 - 1] === "-" && P1[k1 - 2] === "-" && (w6 = !1, _6--) : _6--, _6 === 0) break
                        } else P1[k1] === "[" ? z6 = !0 : r6 += P1[k1];
                else {
                    if (z6 && x(P1, "!ENTITY", k1)) {
                        let G6, L6;
                        k1 += 7, [G6, L6, k1] = m(P1, k1 + 1), L6.indexOf("&") === -1 && (o1[G6] = {
                            regx: RegExp(`&${G6};`, "g"),
                            val: L6
                        })
                    } else if (z6 && x(P1, "!ELEMENT", k1)) {
                        k1 += 8;
                        let {
                            index: G6
                        } = U(P1, k1 + 1);
                        k1 = G6
                    } else if (z6 && x(P1, "!ATTLIST", k1)) k1 += 8;
                    else if (z6 && x(P1, "!NOTATION", k1)) {
                        k1 += 9;
                        let {
                            index: G6
                        } = b(P1, k1 + 1);
                        k1 = G6
                    } else {
                        if (!x(P1, "!--", k1)) throw Error("Invalid DOCTYPE");
                        w6 = !0
                    }
                    _6++, r6 = ""
                }
                if (_6 !== 0) throw Error("Unclosed DOCTYPE")
            }
            return {
                entities: o1,
                i: k1
            }
        }
        let S = (P1, k1) => {
            for (; k1 < P1.length && /\s/.test(P1[k1]);) k1++;
            return k1
        };

        function m(P1, k1) {
            k1 = S(P1, k1);
            let o1 = "";
            for (; k1 < P1.length && !/\s/.test(P1[k1]) && P1[k1] !== '"' && P1[k1] !== "'";) o1 += P1[k1], k1++;
            if (p(o1), k1 = S(P1, k1), P1.substring(k1, k1 + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
            if (P1[k1] === "%") throw Error("Parameter entities are not supported");
            let _6 = "";
            return [k1, _6] = g(P1, k1, "entity"), [o1, _6, --k1]
        }

        function b(P1, k1) {
            k1 = S(P1, k1);
            let o1 = "";
            for (; k1 < P1.length && !/\s/.test(P1[k1]);) o1 += P1[k1], k1++;
            p(o1), k1 = S(P1, k1);
            let _6 = P1.substring(k1, k1 + 6).toUpperCase();
            if (_6 !== "SYSTEM" && _6 !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${_6}"`);
            k1 += _6.length, k1 = S(P1, k1);
            let z6 = null,
                w6 = null;
            if (_6 === "PUBLIC")[k1, z6] = g(P1, k1, "publicIdentifier"), P1[k1 = S(P1, k1)] !== '"' && P1[k1] !== "'" || ([k1, w6] = g(P1, k1, "systemIdentifier"));
            else if (_6 === "SYSTEM" && ([k1, w6] = g(P1, k1, "systemIdentifier"), !w6)) throw Error("Missing mandatory system identifier for SYSTEM notation");
            return {
                notationName: o1,
                publicIdentifier: z6,
                systemIdentifier: w6,
                index: --k1
            }
        }

        function g(P1, k1, o1) {
            let _6 = "",
                z6 = P1[k1];
            if (z6 !== '"' && z6 !== "'") throw Error(`Expected quoted string, found "${z6}"`);
            for (k1++; k1 < P1.length && P1[k1] !== z6;) _6 += P1[k1], k1++;
            if (P1[k1] !== z6) throw Error(`Unterminated ${o1} value`);
            return [++k1, _6]
        }

        function U(P1, k1) {
            k1 = S(P1, k1);
            let o1 = "";
            for (; k1 < P1.length && !/\s/.test(P1[k1]);) o1 += P1[k1], k1++;
            if (!p(o1)) throw Error(`Invalid element name: "${o1}"`);
            let _6 = "";
            if (P1[k1 = S(P1, k1)] === "E" && x(P1, "MPTY", k1)) k1 += 4;
            else if (P1[k1] === "A" && x(P1, "NY", k1)) k1 += 2;
            else {
                if (P1[k1] !== "(") throw Error(`Invalid Element Expression, found "${P1[k1]}"`);
                for (k1++; k1 < P1.length && P1[k1] !== ")";) _6 += P1[k1], k1++;
                if (P1[k1] !== ")") throw Error("Unterminated content model")
            }
            return {
                elementName: o1,
                contentModel: _6.trim(),
                index: k1
            }
        }

        function x(P1, k1, o1) {
            for (let _6 = 0; _6 < k1.length; _6++)
                if (k1[_6] !== P1[o1 + _6 + 1]) return !1;
            return !0
        }

        function p(P1) {
            if (w(P1)) return P1;
            throw Error(`Invalid entity name ${P1}`)
        }
        let l = /^[-+]?0x[a-fA-F0-9]+$/,
            r = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
            s = {
                hex: !0,
                leadingZeros: !0,
                decimalPoint: ".",
                eNotation: !0
            },
            O1 = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;

        function T1(P1) {
            return typeof P1 == "function" ? P1 : Array.isArray(P1) ? (k1) => {
                for (let o1 of P1) {
                    if (typeof o1 == "string" && k1 === o1) return !0;
                    if (o1 instanceof RegExp && o1.test(k1)) return !0
                }
            } : () => !1
        }
        class N1 {
            constructor(P1) {
                this.options = P1, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
                    apos: {
                        regex: /&(apos|#39|#x27);/g,
                        val: "'"
                    },
                    gt: {
                        regex: /&(gt|#62|#x3E);/g,
                        val: ">"
                    },
                    lt: {
                        regex: /&(lt|#60|#x3C);/g,
                        val: "<"
                    },
                    quot: {
                        regex: /&(quot|#34|#x22);/g,
                        val: '"'
                    }
                }, this.ampEntity = {
                    regex: /&(amp|#38|#x26);/g,
                    val: "&"
                }, this.htmlEntities = {
                    space: {
                        regex: /&(nbsp|#160);/g,
                        val: " "
                    },
                    cent: {
                        regex: /&(cent|#162);/g,
                        val: "¢"
                    },
                    pound: {
                        regex: /&(pound|#163);/g,
                        val: "£"
                    },
                    yen: {
                        regex: /&(yen|#165);/g,
                        val: "¥"
                    },
                    euro: {
                        regex: /&(euro|#8364);/g,
                        val: "€"
                    },
                    copyright: {
                        regex: /&(copy|#169);/g,
                        val: "©"
                    },
                    reg: {
                        regex: /&(reg|#174);/g,
                        val: "®"
                    },
                    inr: {
                        regex: /&(inr|#8377);/g,
                        val: "₹"
                    },
                    num_dec: {
                        regex: /&#([0-9]{1,7});/g,
                        val: (k1, o1) => String.fromCodePoint(Number.parseInt(o1, 10))
                    },
                    num_hex: {
                        regex: /&#x([0-9a-fA-F]{1,6});/g,
                        val: (k1, o1) => String.fromCodePoint(Number.parseInt(o1, 16))
                    }
                }, this.addExternalEntities = j1, this.parseXml = Z1, this.parseTextData = q1, this.resolveNameSpace = t, this.buildAttributesMap = D1, this.isItStopNode = M1, this.replaceEntitiesValue = a, this.readStopNodeData = _1, this.saveTextToParentTag = A1, this.addChild = E1, this.ignoreAttributesFn = T1(this.options.ignoreAttributes)
            }
        }

        function j1(P1) {
            let k1 = Object.keys(P1);
            for (let o1 = 0; o1 < k1.length; o1++) {
                let _6 = k1[o1];
                this.lastEntities[_6] = {
                    regex: new RegExp("&" + _6 + ";", "g"),
                    val: P1[_6]
                }
            }
        }

        function q1(P1, k1, o1, _6, z6, w6, r6) {
            if (P1 !== void 0 && (this.options.trimValues && !_6 && (P1 = P1.trim()), P1.length > 0)) {
                r6 || (P1 = this.replaceEntitiesValue(P1));
                let G6 = this.options.tagValueProcessor(k1, P1, o1, z6, w6);
                return G6 == null ? P1 : typeof G6 != typeof P1 || G6 !== P1 ? G6 : this.options.trimValues || P1.trim() === P1 ? $1(P1, this.options.parseTagValue, this.options.numberParseOptions) : P1
            }
        }

        function t(P1) {
            if (this.options.removeNSPrefix) {
                let k1 = P1.split(":"),
                    o1 = P1.charAt(0) === "/" ? "/" : "";
                if (k1[0] === "xmlns") return "";
                k1.length === 2 && (P1 = o1 + k1[1])
            }
            return P1
        }
        let J1 = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");

        function D1(P1, k1, o1) {
            if (this.options.ignoreAttributes !== !0 && typeof P1 == "string") {
                let _6 = z(P1, J1),
                    z6 = _6.length,
                    w6 = {};
                for (let r6 = 0; r6 < z6; r6++) {
                    let G6 = this.resolveNameSpace(_6[r6][1]);
                    if (this.ignoreAttributesFn(G6, k1)) continue;
                    let L6 = _6[r6][4],
                        OA = this.options.attributeNamePrefix + G6;
                    if (G6.length)
                        if (this.options.transformAttributeName && (OA = this.options.transformAttributeName(OA)), OA === "__proto__" && (OA = "#__proto__"), L6 !== void 0) {
                            this.options.trimValues && (L6 = L6.trim()), L6 = this.replaceEntitiesValue(L6);
                            let bA = this.options.attributeValueProcessor(G6, L6, k1);
                            w6[OA] = bA == null ? L6 : typeof bA != typeof L6 || bA !== L6 ? bA : $1(L6, this.options.parseAttributeValue, this.options.numberParseOptions)
                        } else this.options.allowBooleanAttributes && (w6[OA] = !0)
                }
                if (!Object.keys(w6).length) return;
                if (this.options.attributesGroupName) {
                    let r6 = {};
                    return r6[this.options.attributesGroupName] = w6, r6
                }
                return w6
            }
        }
        let Z1 = function(P1) {
            P1 = P1.replace(/\r\n?/g, `
`);
            let k1 = new y("!xml"),
                o1 = k1,
                _6 = "",
                z6 = "";
            for (let w6 = 0; w6 < P1.length; w6++)
                if (P1[w6] === "<")
                    if (P1[w6 + 1] === "/") {
                        let r6 = z1(P1, ">", w6, "Closing Tag is not closed."),
                            G6 = P1.substring(w6 + 2, r6).trim();
                        if (this.options.removeNSPrefix) {
                            let bA = G6.indexOf(":");
                            bA !== -1 && (G6 = G6.substr(bA + 1))
                        }
                        this.options.transformTagName && (G6 = this.options.transformTagName(G6)), o1 && (_6 = this.saveTextToParentTag(_6, o1, z6));
                        let L6 = z6.substring(z6.lastIndexOf(".") + 1);
                        if (G6 && this.options.unpairedTags.indexOf(G6) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${G6}>`);
                        let OA = 0;
                        L6 && this.options.unpairedTags.indexOf(L6) !== -1 ? (OA = z6.lastIndexOf(".", z6.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : OA = z6.lastIndexOf("."), z6 = z6.substring(0, OA), o1 = this.tagsNodeStack.pop(), _6 = "", w6 = r6
                    } else if (P1[w6 + 1] === "?") {
                let r6 = Y1(P1, w6, !1, "?>");
                if (!r6) throw Error("Pi Tag is not closed.");
                if (_6 = this.saveTextToParentTag(_6, o1, z6), this.options.ignoreDeclaration && r6.tagName === "?xml" || this.options.ignorePiTags);
                else {
                    let G6 = new y(r6.tagName);
                    G6.add(this.options.textNodeName, ""), r6.tagName !== r6.tagExp && r6.attrExpPresent && (G6[":@"] = this.buildAttributesMap(r6.tagExp, z6, r6.tagName)), this.addChild(o1, G6, z6, w6)
                }
                w6 = r6.closeIndex + 1
            } else if (P1.substr(w6 + 1, 3) === "!--") {
                let r6 = z1(P1, "-->", w6 + 4, "Comment is not closed.");
                if (this.options.commentPropName) {
                    let G6 = P1.substring(w6 + 4, r6 - 2);
                    _6 = this.saveTextToParentTag(_6, o1, z6), o1.add(this.options.commentPropName, [{
                        [this.options.textNodeName]: G6
                    }])
                }
                w6 = r6
            } else if (P1.substr(w6 + 1, 2) === "!D") {
                let r6 = B(P1, w6);
                this.docTypeEntities = r6.entities, w6 = r6.i
            } else if (P1.substr(w6 + 1, 2) === "![") {
                let r6 = z1(P1, "]]>", w6, "CDATA is not closed.") - 2,
                    G6 = P1.substring(w6 + 9, r6);
                _6 = this.saveTextToParentTag(_6, o1, z6);
                let L6 = this.parseTextData(G6, o1.tagname, z6, !0, !1, !0, !0);
                L6 == null && (L6 = ""), this.options.cdataPropName ? o1.add(this.options.cdataPropName, [{
                    [this.options.textNodeName]: G6
                }]) : o1.add(this.options.textNodeName, L6), w6 = r6 + 2
            } else {
                let r6 = Y1(P1, w6, this.options.removeNSPrefix),
                    G6 = r6.tagName,
                    L6 = r6.rawTagName,
                    OA = r6.tagExp,
                    bA = r6.attrExpPresent,
                    lA = r6.closeIndex;
                this.options.transformTagName && (G6 = this.options.transformTagName(G6)), o1 && _6 && o1.tagname !== "!xml" && (_6 = this.saveTextToParentTag(_6, o1, z6, !1));
                let E7 = o1;
                E7 && this.options.unpairedTags.indexOf(E7.tagname) !== -1 && (o1 = this.tagsNodeStack.pop(), z6 = z6.substring(0, z6.lastIndexOf("."))), G6 !== k1.tagname && (z6 += z6 ? "." + G6 : G6);
                let V4 = w6;
                if (this.isItStopNode(this.options.stopNodes, z6, G6)) {
                    let RA = "";
                    if (OA.length > 0 && OA.lastIndexOf("/") === OA.length - 1) G6[G6.length - 1] === "/" ? (G6 = G6.substr(0, G6.length - 1), z6 = z6.substr(0, z6.length - 1), OA = G6) : OA = OA.substr(0, OA.length - 1), w6 = r6.closeIndex;
                    else if (this.options.unpairedTags.indexOf(G6) !== -1) w6 = r6.closeIndex;
                    else {
                        let tK = this.readStopNodeData(P1, L6, lA + 1);
                        if (!tK) throw Error(`Unexpected end of ${L6}`);
                        w6 = tK.i, RA = tK.tagContent
                    }
                    let O7 = new y(G6);
                    G6 !== OA && bA && (O7[":@"] = this.buildAttributesMap(OA, z6, G6)), RA && (RA = this.parseTextData(RA, G6, z6, !0, bA, !0, !0)), z6 = z6.substr(0, z6.lastIndexOf(".")), O7.add(this.options.textNodeName, RA), this.addChild(o1, O7, z6, V4)
                } else {
                    if (OA.length > 0 && OA.lastIndexOf("/") === OA.length - 1) {
                        G6[G6.length - 1] === "/" ? (G6 = G6.substr(0, G6.length - 1), z6 = z6.substr(0, z6.length - 1), OA = G6) : OA = OA.substr(0, OA.length - 1), this.options.transformTagName && (G6 = this.options.transformTagName(G6));
                        let RA = new y(G6);
                        G6 !== OA && bA && (RA[":@"] = this.buildAttributesMap(OA, z6, G6)), this.addChild(o1, RA, z6, V4), z6 = z6.substr(0, z6.lastIndexOf("."))
                    } else {
                        let RA = new y(G6);
                        this.tagsNodeStack.push(o1), G6 !== OA && bA && (RA[":@"] = this.buildAttributesMap(OA, z6, G6)), this.addChild(o1, RA, z6, V4), o1 = RA
                    }
                    _6 = "", w6 = lA
                }
            } else _6 += P1[w6];
            return k1.child
        };

        function E1(P1, k1, o1, _6) {
            this.options.captureMetaData || (_6 = void 0);
            let z6 = this.options.updateTag(k1.tagname, o1, k1[":@"]);
            z6 === !1 || (typeof z6 == "string" ? (k1.tagname = z6, P1.addChild(k1, _6)) : P1.addChild(k1, _6))
        }
        let a = function(P1) {
            if (this.options.processEntities) {
                for (let k1 in this.docTypeEntities) {
                    let o1 = this.docTypeEntities[k1];
                    P1 = P1.replace(o1.regx, o1.val)
                }
                for (let k1 in this.lastEntities) {
                    let o1 = this.lastEntities[k1];
                    P1 = P1.replace(o1.regex, o1.val)
                }
                if (this.options.htmlEntities)
                    for (let k1 in this.htmlEntities) {
                        let o1 = this.htmlEntities[k1];
                        P1 = P1.replace(o1.regex, o1.val)
                    }
                P1 = P1.replace(this.ampEntity.regex, this.ampEntity.val)
            }
            return P1
        };

        function A1(P1, k1, o1, _6) {
            return P1 && (_6 === void 0 && (_6 = k1.child.length === 0), (P1 = this.parseTextData(P1, k1.tagname, o1, !1, !!k1[":@"] && Object.keys(k1[":@"]).length !== 0, _6)) !== void 0 && P1 !== "" && k1.add(this.options.textNodeName, P1), P1 = ""), P1
        }

        function M1(P1, k1, o1) {
            let _6 = "*." + o1;
            for (let z6 in P1) {
                let w6 = P1[z6];
                if (_6 === w6 || k1 === w6) return !0
            }
            return !1
        }

        function z1(P1, k1, o1, _6) {
            let z6 = P1.indexOf(k1, o1);
            if (z6 === -1) throw Error(_6);
            return z6 + k1.length - 1
        }

        function Y1(P1, k1, o1, _6 = ">") {
            let z6 = function(lA, E7, V4 = ">") {
                let RA, O7 = "";
                for (let tK = E7; tK < lA.length; tK++) {
                    let gq = lA[tK];
                    if (RA) gq === RA && (RA = "");
                    else if (gq === '"' || gq === "'") RA = gq;
                    else if (gq === V4[0]) {
                        if (!V4[1]) return {
                            data: O7,
                            index: tK
                        };
                        if (lA[tK + 1] === V4[1]) return {
                            data: O7,
                            index: tK
                        }
                    } else gq === "\t" && (gq = " ");
                    O7 += gq
                }
            }(P1, k1 + 1, _6);
            if (!z6) return;
            let {
                data: w6,
                index: r6
            } = z6, G6 = w6.search(/\s/), L6 = w6, OA = !0;
            G6 !== -1 && (L6 = w6.substring(0, G6), w6 = w6.substring(G6 + 1).trimStart());
            let bA = L6;
            if (o1) {
                let lA = L6.indexOf(":");
                lA !== -1 && (L6 = L6.substr(lA + 1), OA = L6 !== z6.data.substr(lA + 1))
            }
            return {
                tagName: L6,
                tagExp: w6,
                closeIndex: r6,
                attrExpPresent: OA,
                rawTagName: bA
            }
        }

        function _1(P1, k1, o1) {
            let _6 = o1,
                z6 = 1;
            for (; o1 < P1.length; o1++)
                if (P1[o1] === "<")
                    if (P1[o1 + 1] === "/") {
                        let w6 = z1(P1, ">", o1, `${k1} is not closed`);
                        if (P1.substring(o1 + 2, w6).trim() === k1 && (z6--, z6 === 0)) return {
                            tagContent: P1.substring(_6, o1),
                            i: w6
                        };
                        o1 = w6
                    } else if (P1[o1 + 1] === "?") o1 = z1(P1, "?>", o1 + 1, "StopNode is not closed.");
            else if (P1.substr(o1 + 1, 3) === "!--") o1 = z1(P1, "-->", o1 + 3, "StopNode is not closed.");
            else if (P1.substr(o1 + 1, 2) === "![") o1 = z1(P1, "]]>", o1, "StopNode is not closed.") - 2;
            else {
                let w6 = Y1(P1, o1, ">");
                w6 && ((w6 && w6.tagName) === k1 && w6.tagExp[w6.tagExp.length - 1] !== "/" && z6++, o1 = w6.closeIndex)
            }
        }

        function $1(P1, k1, o1) {
            if (k1 && typeof P1 == "string") {
                let _6 = P1.trim();
                return _6 === "true" || _6 !== "false" && function(z6, w6 = {}) {
                    if (w6 = Object.assign({}, s, w6), !z6 || typeof z6 != "string") return z6;
                    let r6 = z6.trim();
                    if (w6.skipLike !== void 0 && w6.skipLike.test(r6)) return z6;
                    if (z6 === "0") return 0;
                    if (w6.hex && l.test(r6)) return function(L6) {
                        if (parseInt) return parseInt(L6, 16);
                        if (Number.parseInt) return Number.parseInt(L6, 16);
                        if (window && window.parseInt) return window.parseInt(L6, 16);
                        throw Error("parseInt, Number.parseInt, window.parseInt are not supported")
                    }(r6);
                    if (r6.search(/.+[eE].+/) !== -1) return function(L6, OA, bA) {
                        if (!bA.eNotation) return L6;
                        let lA = OA.match(O1);
                        if (lA) {
                            let E7 = lA[1] || "",
                                V4 = lA[3].indexOf("e") === -1 ? "E" : "e",
                                RA = lA[2],
                                O7 = E7 ? L6[RA.length + 1] === V4 : L6[RA.length] === V4;
                            return RA.length > 1 && O7 ? L6 : RA.length !== 1 || !lA[3].startsWith(`.${V4}`) && lA[3][0] !== V4 ? bA.leadingZeros && !O7 ? (OA = (lA[1] || "") + lA[3], Number(OA)) : L6 : Number(OA)
                        }
                        return L6
                    }(z6, r6, w6);
                    {
                        let L6 = r.exec(r6);
                        if (L6) {
                            let OA = L6[1] || "",
                                bA = L6[2],
                                lA = (G6 = L6[3]) && G6.indexOf(".") !== -1 ? ((G6 = G6.replace(/0+$/, "")) === "." ? G6 = "0" : G6[0] === "." ? G6 = "0" + G6 : G6[G6.length - 1] === "." && (G6 = G6.substring(0, G6.length - 1)), G6) : G6,
                                E7 = OA ? z6[bA.length + 1] === "." : z6[bA.length] === ".";
                            if (!w6.leadingZeros && (bA.length > 1 || bA.length === 1 && !E7)) return z6;
                            {
                                let V4 = Number(r6),
                                    RA = String(V4);
                                if (V4 === 0 || V4 === -0) return V4;
                                if (RA.search(/[eE]/) !== -1) return w6.eNotation ? V4 : z6;
                                if (r6.indexOf(".") !== -1) return RA === "0" || RA === lA || RA === `${OA}${lA}` ? V4 : z6;
                                let O7 = bA ? lA : r6;
                                return bA ? O7 === RA || OA + O7 === RA ? V4 : z6 : O7 === RA || O7 === OA + RA ? V4 : z6
                            }
                        }
                        return z6
                    }
                    var G6
                }(P1, o1)
            }
            return P1 !== void 0 ? P1 : ""
        }
        let G1 = y.getMetaDataSymbol();

        function L1(P1, k1) {
            return x1(P1, k1)
        }

        function x1(P1, k1, o1) {
            let _6, z6 = {};
            for (let w6 = 0; w6 < P1.length; w6++) {
                let r6 = P1[w6],
                    G6 = f1(r6),
                    L6 = "";
                if (L6 = o1 === void 0 ? G6 : o1 + "." + G6, G6 === k1.textNodeName) _6 === void 0 ? _6 = r6[G6] : _6 += "" + r6[G6];
                else {
                    if (G6 === void 0) continue;
                    if (r6[G6]) {
                        let OA = x1(r6[G6], k1, L6),
                            bA = H1(OA, k1);
                        r6[G1] !== void 0 && (OA[G1] = r6[G1]), r6[":@"] ? R1(OA, r6[":@"], L6, k1) : Object.keys(OA).length !== 1 || OA[k1.textNodeName] === void 0 || k1.alwaysCreateTextNode ? Object.keys(OA).length === 0 && (k1.alwaysCreateTextNode ? OA[k1.textNodeName] = "" : OA = "") : OA = OA[k1.textNodeName], z6[G6] !== void 0 && z6.hasOwnProperty(G6) ? (Array.isArray(z6[G6]) || (z6[G6] = [z6[G6]]), z6[G6].push(OA)) : k1.isArray(G6, L6, bA) ? z6[G6] = [OA] : z6[G6] = OA
                    }
                }
            }
            return typeof _6 == "string" ? _6.length > 0 && (z6[k1.textNodeName] = _6) : _6 !== void 0 && (z6[k1.textNodeName] = _6), z6
        }

        function f1(P1) {
            let k1 = Object.keys(P1);
            for (let o1 = 0; o1 < k1.length; o1++) {
                let _6 = k1[o1];
                if (_6 !== ":@") return _6
            }
        }

        function R1(P1, k1, o1, _6) {
            if (k1) {
                let z6 = Object.keys(k1),
                    w6 = z6.length;
                for (let r6 = 0; r6 < w6; r6++) {
                    let G6 = z6[r6];
                    _6.isArray(G6, o1 + "." + G6, !0, !0) ? P1[G6] = [k1[G6]] : P1[G6] = k1[G6]
                }
            }
        }

        function H1(P1, k1) {
            let {
                textNodeName: o1
            } = k1, _6 = Object.keys(P1).length;
            return _6 === 0 || !(_6 !== 1 || !P1[o1] && typeof P1[o1] != "boolean" && P1[o1] !== 0)
        }
        class y1 {
            constructor(P1) {
                this.externalEntities = {}, this.options = function(k1) {
                    return Object.assign({}, T, k1)
                }(P1)
            }
            parse(P1, k1) {
                if (typeof P1 == "string");
                else {
                    if (!P1.toString) throw Error("XML data is accepted in String or Bytes[] form.");
                    P1 = P1.toString()
                }
                if (k1) {
                    k1 === !0 && (k1 = {});
                    let z6 = $(P1, k1);
                    if (z6 !== !0) throw Error(`${z6.err.msg}:${z6.err.line}:${z6.err.col}`)
                }
                let o1 = new N1(this.options);
                o1.addExternalEntities(this.externalEntities);
                let _6 = o1.parseXml(P1);
                return this.options.preserveOrder || _6 === void 0 ? _6 : L1(_6, this.options)
            }
            addEntity(P1, k1) {
                if (k1.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
                if (P1.indexOf("&") !== -1 || P1.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
                if (k1 === "&") throw Error("An entity with value '&' is not permitted");
                this.externalEntities[P1] = k1
            }
            static getMetaDataSymbol() {
                return y.getMetaDataSymbol()
            }
        }

        function B1(P1, k1) {
            let o1 = "";
            return k1.format && k1.indentBy.length > 0 && (o1 = `
`), A6(P1, k1, "", o1)
        }

        function A6(P1, k1, o1, _6) {
            let z6 = "",
                w6 = !1;
            for (let r6 = 0; r6 < P1.length; r6++) {
                let G6 = P1[r6],
                    L6 = O6(G6);
                if (L6 === void 0) continue;
                let OA = "";
                if (OA = o1.length === 0 ? L6 : `${o1}.${L6}`, L6 === k1.textNodeName) {
                    let V4 = G6[L6];
                    V6(OA, k1) || (V4 = k1.tagValueProcessor(L6, V4), V4 = q6(V4, k1)), w6 && (z6 += _6), z6 += V4, w6 = !1;
                    continue
                }
                if (L6 === k1.cdataPropName) {
                    w6 && (z6 += _6), z6 += `<![CDATA[${G6[L6][0][k1.textNodeName]}]]>`, w6 = !1;
                    continue
                }
                if (L6 === k1.commentPropName) {
                    z6 += _6 + `<!--${G6[L6][0][k1.textNodeName]}-->`, w6 = !0;
                    continue
                }
                if (L6[0] === "?") {
                    let V4 = P6(G6[":@"], k1),
                        RA = L6 === "?xml" ? "" : _6,
                        O7 = G6[L6][0][k1.textNodeName];
                    O7 = O7.length !== 0 ? " " + O7 : "", z6 += RA + `<${L6}${O7}${V4}?>`, w6 = !0;
                    continue
                }
                let bA = _6;
                bA !== "" && (bA += k1.indentBy);
                let lA = _6 + `<${L6}${P6(G6[":@"],k1)}`,
                    E7 = A6(G6[L6], k1, OA, bA);
                k1.unpairedTags.indexOf(L6) !== -1 ? k1.suppressUnpairedNode ? z6 += lA + ">" : z6 += lA + "/>" : E7 && E7.length !== 0 || !k1.suppressEmptyNode ? E7 && E7.endsWith(">") ? z6 += lA + `>${E7}${_6}</${L6}>` : (z6 += lA + ">", E7 && _6 !== "" && (E7.includes("/>") || E7.includes("</")) ? z6 += _6 + k1.indentBy + E7 + _6 : z6 += E7, z6 += `</${L6}>`) : z6 += lA + "/>", w6 = !0
            }
            return z6
        }

        function O6(P1) {
            let k1 = Object.keys(P1);
            for (let o1 = 0; o1 < k1.length; o1++) {
                let _6 = k1[o1];
                if (P1.hasOwnProperty(_6) && _6 !== ":@") return _6
            }
        }

        function P6(P1, k1) {
            let o1 = "";
            if (P1 && !k1.ignoreAttributes)
                for (let _6 in P1) {
                    if (!P1.hasOwnProperty(_6)) continue;
                    let z6 = k1.attributeValueProcessor(_6, P1[_6]);
                    z6 = q6(z6, k1), z6 === !0 && k1.suppressBooleanAttributes ? o1 += ` ${_6.substr(k1.attributeNamePrefix.length)}` : o1 += ` ${_6.substr(k1.attributeNamePrefix.length)}="${z6}"`
                }
            return o1
        }

        function V6(P1, k1) {
            let o1 = (P1 = P1.substr(0, P1.length - k1.textNodeName.length - 1)).substr(P1.lastIndexOf(".") + 1);
            for (let _6 in k1.stopNodes)
                if (k1.stopNodes[_6] === P1 || k1.stopNodes[_6] === "*." + o1) return !0;
            return !1
        }

        function q6(P1, k1) {
            if (P1 && P1.length > 0 && k1.processEntities)
                for (let o1 = 0; o1 < k1.entities.length; o1++) {
                    let _6 = k1.entities[o1];
                    P1 = P1.replace(_6.regex, _6.val)
                }
            return P1
        }
        let p1 = {
            attributeNamePrefix: "@_",
            attributesGroupName: !1,
            textNodeName: "#text",
            ignoreAttributes: !0,
            cdataPropName: !1,
            format: !1,
            indentBy: "  ",
            suppressEmptyNode: !1,
            suppressUnpairedNode: !0,
            suppressBooleanAttributes: !0,
            tagValueProcessor: function(P1, k1) {
                return k1
            },
            attributeValueProcessor: function(P1, k1) {
                return k1
            },
            preserveOrder: !1,
            commentPropName: !1,
            unpairedTags: [],
            entities: [{
                regex: new RegExp("&", "g"),
                val: "&amp;"
            }, {
                regex: new RegExp(">", "g"),
                val: "&gt;"
            }, {
                regex: new RegExp("<", "g"),
                val: "&lt;"
            }, {
                regex: new RegExp("'", "g"),
                val: "&apos;"
            }, {
                regex: new RegExp('"', "g"),
                val: "&quot;"
            }],
            processEntities: !0,
            stopNodes: [],
            oneListGroup: !1
        };

        function K6(P1) {
            this.options = Object.assign({}, p1, P1), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
                return !1
            } : (this.ignoreAttributesFn = T1(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = N6), this.processTextOrObjNode = j6, this.options.format ? (this.indentate = M6, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
                return ""
            }, this.tagEndChar = ">", this.newLine = "")
        }

        function j6(P1, k1, o1, _6) {
            let z6 = this.j2x(P1, o1 + 1, _6.concat(k1));
            return P1[this.options.textNodeName] !== void 0 && Object.keys(P1).length === 1 ? this.buildTextValNode(P1[this.options.textNodeName], k1, z6.attrStr, o1) : this.buildObjectNode(z6.val, k1, z6.attrStr, o1)
        }

        function M6(P1) {
            return this.options.indentBy.repeat(P1)
        }

        function N6(P1) {
            return !(!P1.startsWith(this.options.attributeNamePrefix) || P1 === this.options.textNodeName) && P1.substr(this.attrPrefixLen)
        }
        K6.prototype.build = function(P1) {
            return this.options.preserveOrder ? B1(P1, this.options) : (Array.isArray(P1) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (P1 = {
                [this.options.arrayNodeName]: P1
            }), this.j2x(P1, 0, []).val)
        }, K6.prototype.j2x = function(P1, k1, o1) {
            let _6 = "",
                z6 = "",
                w6 = o1.join(".");
            for (let r6 in P1)
                if (Object.prototype.hasOwnProperty.call(P1, r6))
                    if (P1[r6] === void 0) this.isAttribute(r6) && (z6 += "");
                    else if (P1[r6] === null) this.isAttribute(r6) || r6 === this.options.cdataPropName ? z6 += "" : r6[0] === "?" ? z6 += this.indentate(k1) + "<" + r6 + "?" + this.tagEndChar : z6 += this.indentate(k1) + "<" + r6 + "/" + this.tagEndChar;
            else if (P1[r6] instanceof Date) z6 += this.buildTextValNode(P1[r6], r6, "", k1);
            else if (typeof P1[r6] != "object") {
                let G6 = this.isAttribute(r6);
                if (G6 && !this.ignoreAttributesFn(G6, w6)) _6 += this.buildAttrPairStr(G6, "" + P1[r6]);
                else if (!G6)
                    if (r6 === this.options.textNodeName) {
                        let L6 = this.options.tagValueProcessor(r6, "" + P1[r6]);
                        z6 += this.replaceEntitiesValue(L6)
                    } else z6 += this.buildTextValNode(P1[r6], r6, "", k1)
            } else if (Array.isArray(P1[r6])) {
                let G6 = P1[r6].length,
                    L6 = "",
                    OA = "";
                for (let bA = 0; bA < G6; bA++) {
                    let lA = P1[r6][bA];
                    if (lA === void 0);
                    else if (lA === null) r6[0] === "?" ? z6 += this.indentate(k1) + "<" + r6 + "?" + this.tagEndChar : z6 += this.indentate(k1) + "<" + r6 + "/" + this.tagEndChar;
                    else if (typeof lA == "object")
                        if (this.options.oneListGroup) {
                            let E7 = this.j2x(lA, k1 + 1, o1.concat(r6));
                            L6 += E7.val, this.options.attributesGroupName && lA.hasOwnProperty(this.options.attributesGroupName) && (OA += E7.attrStr)
                        } else L6 += this.processTextOrObjNode(lA, r6, k1, o1);
                    else if (this.options.oneListGroup) {
                        let E7 = this.options.tagValueProcessor(r6, lA);
                        E7 = this.replaceEntitiesValue(E7), L6 += E7
                    } else L6 += this.buildTextValNode(lA, r6, "", k1)
                }
                this.options.oneListGroup && (L6 = this.buildObjectNode(L6, r6, OA, k1)), z6 += L6
            } else if (this.options.attributesGroupName && r6 === this.options.attributesGroupName) {
                let G6 = Object.keys(P1[r6]),
                    L6 = G6.length;
                for (let OA = 0; OA < L6; OA++) _6 += this.buildAttrPairStr(G6[OA], "" + P1[r6][G6[OA]])
            } else z6 += this.processTextOrObjNode(P1[r6], r6, k1, o1);
            return {
                attrStr: _6,
                val: z6
            }
        }, K6.prototype.buildAttrPairStr = function(P1, k1) {
            return k1 = this.options.attributeValueProcessor(P1, "" + k1), k1 = this.replaceEntitiesValue(k1), this.options.suppressBooleanAttributes && k1 === "true" ? " " + P1 : " " + P1 + '="' + k1 + '"'
        }, K6.prototype.buildObjectNode = function(P1, k1, o1, _6) {
            if (P1 === "") return k1[0] === "?" ? this.indentate(_6) + "<" + k1 + o1 + "?" + this.tagEndChar : this.indentate(_6) + "<" + k1 + o1 + this.closeTag(k1) + this.tagEndChar;
            {
                let z6 = "</" + k1 + this.tagEndChar,
                    w6 = "";
                return k1[0] === "?" && (w6 = "?", z6 = ""), !o1 && o1 !== "" || P1.indexOf("<") !== -1 ? this.options.commentPropName !== !1 && k1 === this.options.commentPropName && w6.length === 0 ? this.indentate(_6) + `<!--${P1}-->` + this.newLine : this.indentate(_6) + "<" + k1 + o1 + w6 + this.tagEndChar + P1 + this.indentate(_6) + z6 : this.indentate(_6) + "<" + k1 + o1 + w6 + ">" + P1 + z6
            }
        }, K6.prototype.closeTag = function(P1) {
            let k1 = "";
            return this.options.unpairedTags.indexOf(P1) !== -1 ? this.options.suppressUnpairedNode || (k1 = "/") : k1 = this.options.suppressEmptyNode ? "/" : `></${P1}`, k1
        }, K6.prototype.buildTextValNode = function(P1, k1, o1, _6) {
            if (this.options.cdataPropName !== !1 && k1 === this.options.cdataPropName) return this.indentate(_6) + `<![CDATA[${P1}]]>` + this.newLine;
            if (this.options.commentPropName !== !1 && k1 === this.options.commentPropName) return this.indentate(_6) + `<!--${P1}-->` + this.newLine;
            if (k1[0] === "?") return this.indentate(_6) + "<" + k1 + o1 + "?" + this.tagEndChar;
            {
                let z6 = this.options.tagValueProcessor(k1, P1);
                return z6 = this.replaceEntitiesValue(z6), z6 === "" ? this.indentate(_6) + "<" + k1 + o1 + this.closeTag(k1) + this.tagEndChar : this.indentate(_6) + "<" + k1 + o1 + ">" + z6 + "</" + k1 + this.tagEndChar
            }
        }, K6.prototype.replaceEntitiesValue = function(P1) {
            if (P1 && P1.length > 0 && this.options.processEntities)
                for (let k1 = 0; k1 < this.options.entities.length; k1++) {
                    let o1 = this.options.entities[k1];
                    P1 = P1.replace(o1.regex, o1.val)
                }
            return P1
        };
        let F6 = {
            validate: $
        };
        W08.exports = q
    })()
})
// @from(Ln 61485, Col 4)
f08 = R((Z08) => {
    Object.defineProperty(Z08, "__esModule", {
        value: !0
    });
    Z08.parseXML = VEK;
    var fEK = G08(),
        uU6 = new fEK.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: (A, q) => q.trim() === "" && q.includes(`
`) ? "" : void 0
        });
    uU6.addEntity("#xD", "\r");
    uU6.addEntity("#10", `
`);

    function VEK(A) {
        return uU6.parse(A, !0)
    }
})
// @from(Ln 61509, Col 4)
mU6 = R((V08) => {
    var TEK = f08();

    function vEK(A) {
        return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }

    function EEK(A) {
        return A.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;")
    }
    class BU6 {
        value;
        constructor(A) {
            this.value = A
        }
        toString() {
            return EEK("" + this.value)
        }
    }
    class fE1 {
        name;
        children;
        attributes = {};
        static of (A, q, K) {
            let Y = new fE1(A);
            if (q !== void 0) Y.addChildNode(new BU6(q));
            if (K !== void 0) Y.withName(K);
            return Y
        }
        constructor(A, q = []) {
            this.name = A, this.children = q
        }
        withName(A) {
            return this.name = A, this
        }
        addAttribute(A, q) {
            return this.attributes[A] = q, this
        }
        addChildNode(A) {
            return this.children.push(A), this
        }
        removeAttribute(A) {
            return delete this.attributes[A], this
        }
        n(A) {
            return this.name = A, this
        }
        c(A) {
            return this.children.push(A), this
        }
        a(A, q) {
            if (q != null) this.attributes[A] = q;
            return this
        }
        cc(A, q, K = q) {
            if (A[q] != null) {
                let Y = fE1.of(q, A[q]).withName(K);
                this.c(Y)
            }
        }
        l(A, q, K, Y) {
            if (A[q] != null) Y().map((w) => {
                w.withName(K), this.c(w)
            })
        }
        lc(A, q, K, Y) {
            if (A[q] != null) {
                let z = Y(),
                    w = new fE1(K);
                z.map((H) => {
                    w.c(H)
                }), this.c(w)
            }
        }
        toString() {
            let A = Boolean(this.children.length),
                q = `<${this.name}`,
                K = this.attributes;
            for (let Y of Object.keys(K)) {
                let z = K[Y];
                if (z != null) q += ` ${Y}="${vEK(""+z)}"`
            }
            return q += !A ? "/>" : `>${this.children.map((Y)=>Y.toString()).join("")}</${this.name}>`
        }
    }
    Object.defineProperty(V08, "parseXML", {
        enumerable: !0,
        get: function() {
            return TEK.parseXML
        }
    });
    V08.XmlNode = fE1;
    V08.XmlText = BU6
})