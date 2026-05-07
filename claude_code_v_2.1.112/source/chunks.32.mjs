
// @from(Ln 77463, Col 4)
Bqq = p((IAO, mqq) => {
    (() => {
        var q = {
                d: (w6, D6) => {
                    for (var U6 in D6) q.o(D6, U6) && !q.o(w6, U6) && Object.defineProperty(w6, U6, {
                        enumerable: !0,
                        get: D6[U6]
                    })
                },
                o: (w6, D6) => Object.prototype.hasOwnProperty.call(w6, D6),
                r: (w6) => {
                    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(w6, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(w6, "__esModule", {
                        value: !0
                    })
                }
            },
            K = {};
        q.r(K), q.d(K, {
            XMLBuilder: () => f1,
            XMLParser: () => w8,
            XMLValidator: () => g8
        });
        let _ = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
            z = new RegExp("^[" + _ + "][" + _ + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");

        function Y(w6, D6) {
            let U6 = [],
                F6 = D6.exec(w6);
            for (; F6;) {
                let z8 = [];
                z8.startIndex = D6.lastIndex - F6[0].length;
                let l6 = F6.length;
                for (let j8 = 0; j8 < l6; j8++) z8.push(F6[j8]);
                U6.push(z8), F6 = D6.exec(w6)
            }
            return U6
        }
        let A = function(w6) {
                return z.exec(w6) != null
            },
            O = ["hasOwnProperty", "toString", "valueOf", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"],
            w = ["__proto__", "constructor", "prototype"],
            $ = {
                allowBooleanAttributes: !1,
                unpairedTags: []
            };

        function j(w6, D6) {
            D6 = Object.assign({}, $, D6);
            let U6 = [],
                F6 = !1,
                z8 = !1;
            w6[0] === "\uFEFF" && (w6 = w6.substr(1));
            for (let l6 = 0; l6 < w6.length; l6++)
                if (w6[l6] === "<" && w6[l6 + 1] === "?") {
                    if (l6 += 2, l6 = J(w6, l6), l6.err) return l6
                } else {
                    if (w6[l6] !== "<") {
                        if (H(w6[l6])) continue;
                        return f("InvalidChar", "char '" + w6[l6] + "' is not expected.", k(w6, l6))
                    } {
                        let j8 = l6;
                        if (l6++, w6[l6] === "!") {
                            l6 = X(w6, l6);
                            continue
                        } {
                            let f8 = !1;
                            w6[l6] === "/" && (f8 = !0, l6++);
                            let p8 = "";
                            for (; l6 < w6.length && w6[l6] !== ">" && w6[l6] !== " " && w6[l6] !== "\t" && w6[l6] !== `
` && w6[l6] !== "\r"; l6++) p8 += w6[l6];
                            if (p8 = p8.trim(), p8[p8.length - 1] === "/" && (p8 = p8.substring(0, p8.length - 1), l6--), !V(p8)) {
                                let c1;
                                return c1 = p8.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + p8 + "' is an invalid name.", f("InvalidTag", c1, k(w6, l6))
                            }
                            let o8 = W(w6, l6);
                            if (o8 === !1) return f("InvalidAttr", "Attributes for '" + p8 + "' have open quote.", k(w6, l6));
                            let n1 = o8.value;
                            if (l6 = o8.index, n1[n1.length - 1] === "/") {
                                let c1 = l6 - n1.length;
                                n1 = n1.substring(0, n1.length - 1);
                                let dq = Z(n1, D6);
                                if (dq !== !0) return f(dq.err.code, dq.err.msg, k(w6, c1 + dq.err.line));
                                F6 = !0
                            } else if (f8) {
                                if (!o8.tagClosed) return f("InvalidTag", "Closing tag '" + p8 + "' doesn't have proper closing.", k(w6, l6));
                                if (n1.trim().length > 0) return f("InvalidTag", "Closing tag '" + p8 + "' can't have attributes or invalid starting.", k(w6, j8));
                                if (U6.length === 0) return f("InvalidTag", "Closing tag '" + p8 + "' has not been opened.", k(w6, j8));
                                {
                                    let c1 = U6.pop();
                                    if (p8 !== c1.tagName) {
                                        let dq = k(w6, c1.tagStartPos);
                                        return f("InvalidTag", "Expected closing tag '" + c1.tagName + "' (opened in line " + dq.line + ", col " + dq.col + ") instead of closing tag '" + p8 + "'.", k(w6, j8))
                                    }
                                    U6.length == 0 && (z8 = !0)
                                }
                            } else {
                                let c1 = Z(n1, D6);
                                if (c1 !== !0) return f(c1.err.code, c1.err.msg, k(w6, l6 - n1.length + c1.err.line));
                                if (z8 === !0) return f("InvalidXml", "Multiple possible root nodes found.", k(w6, l6));
                                D6.unpairedTags.indexOf(p8) !== -1 || U6.push({
                                    tagName: p8,
                                    tagStartPos: j8
                                }), F6 = !0
                            }
                            for (l6++; l6 < w6.length; l6++)
                                if (w6[l6] === "<") {
                                    if (w6[l6 + 1] === "!") {
                                        l6++, l6 = X(w6, l6);
                                        continue
                                    }
                                    if (w6[l6 + 1] !== "?") break;
                                    if (l6 = J(w6, ++l6), l6.err) return l6
                                } else if (w6[l6] === "&") {
                                let c1 = G(w6, l6);
                                if (c1 == -1) return f("InvalidChar", "char '&' is not expected.", k(w6, l6));
                                l6 = c1
                            } else if (z8 === !0 && !H(w6[l6])) return f("InvalidXml", "Extra text at the end", k(w6, l6));
                            w6[l6] === "<" && l6--
                        }
                    }
                } return F6 ? U6.length == 1 ? f("InvalidTag", "Unclosed tag '" + U6[0].tagName + "'.", k(w6, U6[0].tagStartPos)) : !(U6.length > 0) || f("InvalidXml", "Invalid '" + JSON.stringify(U6.map((l6) => l6.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
                line: 1,
                col: 1
            }) : f("InvalidXml", "Start tag expected.", 1)
        }

        function H(w6) {
            return w6 === " " || w6 === "\t" || w6 === `
` || w6 === "\r"
        }

        function J(w6, D6) {
            let U6 = D6;
            for (; D6 < w6.length; D6++)
                if (w6[D6] == "?" || w6[D6] == " ") {
                    let F6 = w6.substr(U6, D6 - U6);
                    if (D6 > 5 && F6 === "xml") return f("InvalidXml", "XML declaration allowed only at the start of the document.", k(w6, D6));
                    if (w6[D6] == "?" && w6[D6 + 1] == ">") {
                        D6++;
                        break
                    }
                    continue
                } return D6
        }

        function X(w6, D6) {
            if (w6.length > D6 + 5 && w6[D6 + 1] === "-" && w6[D6 + 2] === "-") {
                for (D6 += 3; D6 < w6.length; D6++)
                    if (w6[D6] === "-" && w6[D6 + 1] === "-" && w6[D6 + 2] === ">") {
                        D6 += 2;
                        break
                    }
            } else if (w6.length > D6 + 8 && w6[D6 + 1] === "D" && w6[D6 + 2] === "O" && w6[D6 + 3] === "C" && w6[D6 + 4] === "T" && w6[D6 + 5] === "Y" && w6[D6 + 6] === "P" && w6[D6 + 7] === "E") {
                let U6 = 1;
                for (D6 += 8; D6 < w6.length; D6++)
                    if (w6[D6] === "<") U6++;
                    else if (w6[D6] === ">" && (U6--, U6 === 0)) break
            } else if (w6.length > D6 + 9 && w6[D6 + 1] === "[" && w6[D6 + 2] === "C" && w6[D6 + 3] === "D" && w6[D6 + 4] === "A" && w6[D6 + 5] === "T" && w6[D6 + 6] === "A" && w6[D6 + 7] === "[") {
                for (D6 += 8; D6 < w6.length; D6++)
                    if (w6[D6] === "]" && w6[D6 + 1] === "]" && w6[D6 + 2] === ">") {
                        D6 += 2;
                        break
                    }
            }
            return D6
        }
        let M = '"',
            P = "'";

        function W(w6, D6) {
            let U6 = "",
                F6 = "",
                z8 = !1;
            for (; D6 < w6.length; D6++) {
                if (w6[D6] === M || w6[D6] === P) F6 === "" ? F6 = w6[D6] : F6 !== w6[D6] || (F6 = "");
                else if (w6[D6] === ">" && F6 === "") {
                    z8 = !0;
                    break
                }
                U6 += w6[D6]
            }
            return F6 === "" && {
                value: U6,
                index: D6,
                tagClosed: z8
            }
        }
        let D = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");

        function Z(w6, D6) {
            let U6 = Y(w6, D),
                F6 = {};
            for (let z8 = 0; z8 < U6.length; z8++) {
                if (U6[z8][1].length === 0) return f("InvalidAttr", "Attribute '" + U6[z8][2] + "' has no space in starting.", N(U6[z8]));
                if (U6[z8][3] !== void 0 && U6[z8][4] === void 0) return f("InvalidAttr", "Attribute '" + U6[z8][2] + "' is without value.", N(U6[z8]));
                if (U6[z8][3] === void 0 && !D6.allowBooleanAttributes) return f("InvalidAttr", "boolean attribute '" + U6[z8][2] + "' is not allowed.", N(U6[z8]));
                let l6 = U6[z8][2];
                if (!v(l6)) return f("InvalidAttr", "Attribute '" + l6 + "' is an invalid name.", N(U6[z8]));
                if (Object.prototype.hasOwnProperty.call(F6, l6)) return f("InvalidAttr", "Attribute '" + l6 + "' is repeated.", N(U6[z8]));
                F6[l6] = 1
            }
            return !0
        }

        function G(w6, D6) {
            if (w6[++D6] === ";") return -1;
            if (w6[D6] === "#") return function(F6, z8) {
                let l6 = /\d/;
                for (F6[z8] === "x" && (z8++, l6 = /[\da-fA-F]/); z8 < F6.length; z8++) {
                    if (F6[z8] === ";") return z8;
                    if (!F6[z8].match(l6)) break
                }
                return -1
            }(w6, ++D6);
            let U6 = 0;
            for (; D6 < w6.length; D6++, U6++)
                if (!(w6[D6].match(/\w/) && U6 < 20)) {
                    if (w6[D6] === ";") break;
                    return -1
                } return D6
        }

        function f(w6, D6, U6) {
            return {
                err: {
                    code: w6,
                    msg: D6,
                    line: U6.line || U6,
                    col: U6.col
                }
            }
        }

        function v(w6) {
            return A(w6)
        }

        function V(w6) {
            return A(w6)
        }

        function k(w6, D6) {
            let U6 = w6.substring(0, D6).split(/\r?\n/);
            return {
                line: U6.length,
                col: U6[U6.length - 1].length + 1
            }
        }

        function N(w6) {
            return w6.startIndex + w6[1].length
        }
        let R = (w6) => O.includes(w6) ? "__" + w6 : w6,
            h = {
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
                tagValueProcessor: function(w6, D6) {
                    return D6
                },
                attributeValueProcessor: function(w6, D6) {
                    return D6
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
                updateTag: function(w6, D6, U6) {
                    return w6
                },
                captureMetaData: !1,
                maxNestedTags: 100,
                strictReservedNames: !0,
                jPath: !0,
                onDangerousProperty: R
            };

        function C(w6, D6) {
            if (typeof w6 != "string") return;
            let U6 = w6.toLowerCase();
            if (O.some((F6) => U6 === F6.toLowerCase())) throw Error(`[SECURITY] Invalid ${D6}: "${w6}" is a reserved JavaScript keyword that could cause prototype pollution`);
            if (w.some((F6) => U6 === F6.toLowerCase())) throw Error(`[SECURITY] Invalid ${D6}: "${w6}" is a reserved JavaScript keyword that could cause prototype pollution`)
        }

        function x(w6) {
            return typeof w6 == "boolean" ? {
                enabled: w6,
                maxEntitySize: 1e4,
                maxExpansionDepth: 10,
                maxTotalExpansions: 1000,
                maxExpandedLength: 1e5,
                maxEntityCount: 100,
                allowedTags: null,
                tagFilter: null
            } : typeof w6 == "object" && w6 !== null ? {
                enabled: w6.enabled !== !1,
                maxEntitySize: Math.max(1, w6.maxEntitySize ?? 1e4),
                maxExpansionDepth: Math.max(1, w6.maxExpansionDepth ?? 10),
                maxTotalExpansions: Math.max(1, w6.maxTotalExpansions ?? 1000),
                maxExpandedLength: Math.max(1, w6.maxExpandedLength ?? 1e5),
                maxEntityCount: Math.max(1, w6.maxEntityCount ?? 100),
                allowedTags: w6.allowedTags ?? null,
                tagFilter: w6.tagFilter ?? null
            } : x(!0)
        }
        let B = function(w6) {
                let D6 = Object.assign({}, h, w6),
                    U6 = [{
                        value: D6.attributeNamePrefix,
                        name: "attributeNamePrefix"
                    }, {
                        value: D6.attributesGroupName,
                        name: "attributesGroupName"
                    }, {
                        value: D6.textNodeName,
                        name: "textNodeName"
                    }, {
                        value: D6.cdataPropName,
                        name: "cdataPropName"
                    }, {
                        value: D6.commentPropName,
                        name: "commentPropName"
                    }];
                for (let {
                        value: F6,
                        name: z8
                    }
                    of U6) F6 && C(F6, z8);
                return D6.onDangerousProperty === null && (D6.onDangerousProperty = R), D6.processEntities = x(D6.processEntities), D6.stopNodes && Array.isArray(D6.stopNodes) && (D6.stopNodes = D6.stopNodes.map((F6) => typeof F6 == "string" && F6.startsWith("*.") ? ".." + F6.substring(2) : F6)), D6
            },
            m;
        m = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");
        class S {
            constructor(w6) {
                this.tagname = w6, this.child = [], this[":@"] = Object.create(null)
            }
            add(w6, D6) {
                w6 === "__proto__" && (w6 = "#__proto__"), this.child.push({
                    [w6]: D6
                })
            }
            addChild(w6, D6) {
                w6.tagname === "__proto__" && (w6.tagname = "#__proto__"), w6[":@"] && Object.keys(w6[":@"]).length > 0 ? this.child.push({
                    [w6.tagname]: w6.child,
                    ":@": w6[":@"]
                }) : this.child.push({
                    [w6.tagname]: w6.child
                }), D6 !== void 0 && (this.child[this.child.length - 1][m] = {
                    startIndex: D6
                })
            }
            static getMetaDataSymbol() {
                return m
            }
        }
        class F {
            constructor(w6) {
                this.suppressValidationErr = !w6, this.options = w6
            }
            readDocType(w6, D6) {
                let U6 = Object.create(null),
                    F6 = 0;
                if (w6[D6 + 3] !== "O" || w6[D6 + 4] !== "C" || w6[D6 + 5] !== "T" || w6[D6 + 6] !== "Y" || w6[D6 + 7] !== "P" || w6[D6 + 8] !== "E") throw Error("Invalid Tag instead of DOCTYPE");
                {
                    D6 += 9;
                    let z8 = 1,
                        l6 = !1,
                        j8 = !1,
                        f8 = "";
                    for (; D6 < w6.length; D6++)
                        if (w6[D6] !== "<" || j8)
                            if (w6[D6] === ">") {
                                if (j8 ? w6[D6 - 1] === "-" && w6[D6 - 2] === "-" && (j8 = !1, z8--) : z8--, z8 === 0) break
                            } else w6[D6] === "[" ? l6 = !0 : f8 += w6[D6];
                    else {
                        if (l6 && g(w6, "!ENTITY", D6)) {
                            let p8, o8;
                            if (D6 += 7, [p8, o8, D6] = this.readEntityExp(w6, D6 + 1, this.suppressValidationErr), o8.indexOf("&") === -1) {
                                if (this.options.enabled !== !1 && this.options.maxEntityCount != null && F6 >= this.options.maxEntityCount) throw Error(`Entity count (${F6+1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
                                let n1 = p8.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                U6[p8] = {
                                    regx: RegExp(`&${n1};`, "g"),
                                    val: o8
                                }, F6++
                            }
                        } else if (l6 && g(w6, "!ELEMENT", D6)) {
                            D6 += 8;
                            let {
                                index: p8
                            } = this.readElementExp(w6, D6 + 1);
                            D6 = p8
                        } else if (l6 && g(w6, "!ATTLIST", D6)) D6 += 8;
                        else if (l6 && g(w6, "!NOTATION", D6)) {
                            D6 += 9;
                            let {
                                index: p8
                            } = this.readNotationExp(w6, D6 + 1, this.suppressValidationErr);
                            D6 = p8
                        } else {
                            if (!g(w6, "!--", D6)) throw Error("Invalid DOCTYPE");
                            j8 = !0
                        }
                        z8++, f8 = ""
                    }
                    if (z8 !== 0) throw Error("Unclosed DOCTYPE")
                }
                return {
                    entities: U6,
                    i: D6
                }
            }
            readEntityExp(w6, D6) {
                let U6 = D6 = U(w6, D6);
                for (; D6 < w6.length && !/\s/.test(w6[D6]) && w6[D6] !== '"' && w6[D6] !== "'";) D6++;
                let F6 = w6.substring(U6, D6);
                if (c(F6), D6 = U(w6, D6), !this.suppressValidationErr) {
                    if (w6.substring(D6, D6 + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
                    if (w6[D6] === "%") throw Error("Parameter entities are not supported")
                }
                let z8 = "";
                if ([D6, z8] = this.readIdentifierVal(w6, D6, "entity"), this.options.enabled !== !1 && this.options.maxEntitySize != null && z8.length > this.options.maxEntitySize) throw Error(`Entity "${F6}" size (${z8.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
                return [F6, z8, --D6]
            }
            readNotationExp(w6, D6) {
                let U6 = D6 = U(w6, D6);
                for (; D6 < w6.length && !/\s/.test(w6[D6]);) D6++;
                let F6 = w6.substring(U6, D6);
                !this.suppressValidationErr && c(F6), D6 = U(w6, D6);
                let z8 = w6.substring(D6, D6 + 6).toUpperCase();
                if (!this.suppressValidationErr && z8 !== "SYSTEM" && z8 !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${z8}"`);
                D6 += z8.length, D6 = U(w6, D6);
                let l6 = null,
                    j8 = null;
                if (z8 === "PUBLIC")[D6, l6] = this.readIdentifierVal(w6, D6, "publicIdentifier"), w6[D6 = U(w6, D6)] !== '"' && w6[D6] !== "'" || ([D6, j8] = this.readIdentifierVal(w6, D6, "systemIdentifier"));
                else if (z8 === "SYSTEM" && ([D6, j8] = this.readIdentifierVal(w6, D6, "systemIdentifier"), !this.suppressValidationErr && !j8)) throw Error("Missing mandatory system identifier for SYSTEM notation");
                return {
                    notationName: F6,
                    publicIdentifier: l6,
                    systemIdentifier: j8,
                    index: --D6
                }
            }
            readIdentifierVal(w6, D6, U6) {
                let F6 = "",
                    z8 = w6[D6];
                if (z8 !== '"' && z8 !== "'") throw Error(`Expected quoted string, found "${z8}"`);
                let l6 = ++D6;
                for (; D6 < w6.length && w6[D6] !== z8;) D6++;
                if (F6 = w6.substring(l6, D6), w6[D6] !== z8) throw Error(`Unterminated ${U6} value`);
                return [++D6, F6]
            }
            readElementExp(w6, D6) {
                let U6 = D6 = U(w6, D6);
                for (; D6 < w6.length && !/\s/.test(w6[D6]);) D6++;
                let F6 = w6.substring(U6, D6);
                if (!this.suppressValidationErr && !A(F6)) throw Error(`Invalid element name: "${F6}"`);
                let z8 = "";
                if (w6[D6 = U(w6, D6)] === "E" && g(w6, "MPTY", D6)) D6 += 4;
                else if (w6[D6] === "A" && g(w6, "NY", D6)) D6 += 2;
                else if (w6[D6] === "(") {
                    let l6 = ++D6;
                    for (; D6 < w6.length && w6[D6] !== ")";) D6++;
                    if (z8 = w6.substring(l6, D6), w6[D6] !== ")") throw Error("Unterminated content model")
                } else if (!this.suppressValidationErr) throw Error(`Invalid Element Expression, found "${w6[D6]}"`);
                return {
                    elementName: F6,
                    contentModel: z8.trim(),
                    index: D6
                }
            }
            readAttlistExp(w6, D6) {
                let U6 = D6 = U(w6, D6);
                for (; D6 < w6.length && !/\s/.test(w6[D6]);) D6++;
                let F6 = w6.substring(U6, D6);
                for (c(F6), U6 = D6 = U(w6, D6); D6 < w6.length && !/\s/.test(w6[D6]);) D6++;
                let z8 = w6.substring(U6, D6);
                if (!c(z8)) throw Error(`Invalid attribute name: "${z8}"`);
                D6 = U(w6, D6);
                let l6 = "";
                if (w6.substring(D6, D6 + 8).toUpperCase() === "NOTATION") {
                    if (l6 = "NOTATION", w6[D6 = U(w6, D6 += 8)] !== "(") throw Error(`Expected '(', found "${w6[D6]}"`);
                    D6++;
                    let f8 = [];
                    for (; D6 < w6.length && w6[D6] !== ")";) {
                        let p8 = D6;
                        for (; D6 < w6.length && w6[D6] !== "|" && w6[D6] !== ")";) D6++;
                        let o8 = w6.substring(p8, D6);
                        if (o8 = o8.trim(), !c(o8)) throw Error(`Invalid notation name: "${o8}"`);
                        f8.push(o8), w6[D6] === "|" && (D6++, D6 = U(w6, D6))
                    }
                    if (w6[D6] !== ")") throw Error("Unterminated list of notations");
                    D6++, l6 += " (" + f8.join("|") + ")"
                } else {
                    let f8 = D6;
                    for (; D6 < w6.length && !/\s/.test(w6[D6]);) D6++;
                    l6 += w6.substring(f8, D6);
                    let p8 = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
                    if (!this.suppressValidationErr && !p8.includes(l6.toUpperCase())) throw Error(`Invalid attribute type: "${l6}"`)
                }
                D6 = U(w6, D6);
                let j8 = "";
                return w6.substring(D6, D6 + 8).toUpperCase() === "#REQUIRED" ? (j8 = "#REQUIRED", D6 += 8) : w6.substring(D6, D6 + 7).toUpperCase() === "#IMPLIED" ? (j8 = "#IMPLIED", D6 += 7) : [D6, j8] = this.readIdentifierVal(w6, D6, "ATTLIST"), {
                    elementName: F6,
                    attributeName: z8,
                    attributeType: l6,
                    defaultValue: j8,
                    index: D6
                }
            }
        }
        let U = (w6, D6) => {
            for (; D6 < w6.length && /\s/.test(w6[D6]);) D6++;
            return D6
        };

        function g(w6, D6, U6) {
            for (let F6 = 0; F6 < D6.length; F6++)
                if (D6[F6] !== w6[U6 + F6 + 1]) return !1;
            return !0
        }

        function c(w6) {
            if (A(w6)) return w6;
            throw Error(`Invalid entity name ${w6}`)
        }
        let n = /^[-+]?0x[a-fA-F0-9]+$/,
            l = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
            z6 = {
                hex: !0,
                leadingZeros: !0,
                decimalPoint: ".",
                eNotation: !0,
                infinity: "original"
            },
            A6 = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/,
            e = new Set(["push", "pop", "reset", "updateCurrent", "restore"]);
        class i {
            constructor(w6 = {}) {
                this.separator = w6.separator || ".", this.path = [], this.siblingStacks = []
            }
            push(w6, D6 = null, U6 = null) {
                this.path.length > 0 && (this.path[this.path.length - 1].values = void 0);
                let F6 = this.path.length;
                this.siblingStacks[F6] || (this.siblingStacks[F6] = new Map);
                let z8 = this.siblingStacks[F6],
                    l6 = U6 ? `${U6}:${w6}` : w6,
                    j8 = z8.get(l6) || 0,
                    f8 = 0;
                for (let o8 of z8.values()) f8 += o8;
                z8.set(l6, j8 + 1);
                let p8 = {
                    tag: w6,
                    position: f8,
                    counter: j8
                };
                U6 != null && (p8.namespace = U6), D6 != null && (p8.values = D6), this.path.push(p8)
            }
            pop() {
                if (this.path.length === 0) return;
                let w6 = this.path.pop();
                return this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1), w6
            }
            updateCurrent(w6) {
                if (this.path.length > 0) {
                    let D6 = this.path[this.path.length - 1];
                    w6 != null && (D6.values = w6)
                }
            }
            getCurrentTag() {
                return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0
            }
            getCurrentNamespace() {
                return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0
            }
            getAttrValue(w6) {
                if (this.path.length === 0) return;
                return this.path[this.path.length - 1].values?.[w6]
            }
            hasAttr(w6) {
                if (this.path.length === 0) return !1;
                let D6 = this.path[this.path.length - 1];
                return D6.values !== void 0 && w6 in D6.values
            }
            getPosition() {
                return this.path.length === 0 ? -1 : this.path[this.path.length - 1].position ?? 0
            }
            getCounter() {
                return this.path.length === 0 ? -1 : this.path[this.path.length - 1].counter ?? 0
            }
            getIndex() {
                return this.getPosition()
            }
            getDepth() {
                return this.path.length
            }
            toString(w6, D6 = !0) {
                let U6 = w6 || this.separator;
                return this.path.map((F6) => D6 && F6.namespace ? `${F6.namespace}:${F6.tag}` : F6.tag).join(U6)
            }
            toArray() {
                return this.path.map((w6) => w6.tag)
            }
            reset() {
                this.path = [], this.siblingStacks = []
            }
            matches(w6) {
                let D6 = w6.segments;
                return D6.length !== 0 && (w6.hasDeepWildcard() ? this._matchWithDeepWildcard(D6) : this._matchSimple(D6))
            }
            _matchSimple(w6) {
                if (this.path.length !== w6.length) return !1;
                for (let D6 = 0; D6 < w6.length; D6++) {
                    let U6 = w6[D6],
                        F6 = this.path[D6],
                        z8 = D6 === this.path.length - 1;
                    if (!this._matchSegment(U6, F6, z8)) return !1
                }
                return !0
            }
            _matchWithDeepWildcard(w6) {
                let D6 = this.path.length - 1,
                    U6 = w6.length - 1;
                for (; U6 >= 0 && D6 >= 0;) {
                    let F6 = w6[U6];
                    if (F6.type === "deep-wildcard") {
                        if (U6--, U6 < 0) return !0;
                        let z8 = w6[U6],
                            l6 = !1;
                        for (let j8 = D6; j8 >= 0; j8--) {
                            let f8 = j8 === this.path.length - 1;
                            if (this._matchSegment(z8, this.path[j8], f8)) {
                                D6 = j8 - 1, U6--, l6 = !0;
                                break
                            }
                        }
                        if (!l6) return !1
                    } else {
                        let z8 = D6 === this.path.length - 1;
                        if (!this._matchSegment(F6, this.path[D6], z8)) return !1;
                        D6--, U6--
                    }
                }
                return U6 < 0
            }
            _matchSegment(w6, D6, U6) {
                if (w6.tag !== "*" && w6.tag !== D6.tag) return !1;
                if (w6.namespace !== void 0 && w6.namespace !== "*" && w6.namespace !== D6.namespace) return !1;
                if (w6.attrName !== void 0) {
                    if (!U6) return !1;
                    if (!D6.values || !(w6.attrName in D6.values)) return !1;
                    if (w6.attrValue !== void 0) {
                        let F6 = D6.values[w6.attrName];
                        if (String(F6) !== String(w6.attrValue)) return !1
                    }
                }
                if (w6.position !== void 0) {
                    if (!U6) return !1;
                    let F6 = D6.counter ?? 0;
                    if (w6.position === "first" && F6 !== 0) return !1;
                    if (w6.position === "odd" && F6 % 2 != 1) return !1;
                    if (w6.position === "even" && F6 % 2 != 0) return !1;
                    if (w6.position === "nth" && F6 !== w6.positionValue) return !1
                }
                return !0
            }
            snapshot() {
                return {
                    path: this.path.map((w6) => ({
                        ...w6
                    })),
                    siblingStacks: this.siblingStacks.map((w6) => new Map(w6))
                }
            }
            restore(w6) {
                this.path = w6.path.map((D6) => ({
                    ...D6
                })), this.siblingStacks = w6.siblingStacks.map((D6) => new Map(D6))
            }
            readOnly() {
                return new Proxy(this, {
                    get(w6, D6, U6) {
                        if (e.has(D6)) return () => {
                            throw TypeError(`Cannot call '${D6}' on a read-only Matcher. Obtain a writable instance to mutate state.`)
                        };
                        let F6 = Reflect.get(w6, D6, U6);
                        return D6 === "path" || D6 === "siblingStacks" ? Object.freeze(Array.isArray(F6) ? F6.map((z8) => z8 instanceof Map ? Object.freeze(new Map(z8)) : Object.freeze({
                            ...z8
                        })) : F6) : typeof F6 == "function" ? F6.bind(w6) : F6
                    },
                    set(w6, D6) {
                        throw TypeError(`Cannot set property '${String(D6)}' on a read-only Matcher.`)
                    },
                    deleteProperty(w6, D6) {
                        throw TypeError(`Cannot delete property '${String(D6)}' from a read-only Matcher.`)
                    }
                })
            }
        }
        class O6 {
            constructor(w6, D6 = {}) {
                this.pattern = w6, this.separator = D6.separator || ".", this.segments = this._parse(w6), this._hasDeepWildcard = this.segments.some((U6) => U6.type === "deep-wildcard"), this._hasAttributeCondition = this.segments.some((U6) => U6.attrName !== void 0), this._hasPositionSelector = this.segments.some((U6) => U6.position !== void 0)
            }
            _parse(w6) {
                let D6 = [],
                    U6 = 0,
                    F6 = "";
                for (; U6 < w6.length;) w6[U6] === this.separator ? U6 + 1 < w6.length && w6[U6 + 1] === this.separator ? (F6.trim() && (D6.push(this._parseSegment(F6.trim())), F6 = ""), D6.push({
                    type: "deep-wildcard"
                }), U6 += 2) : (F6.trim() && D6.push(this._parseSegment(F6.trim())), F6 = "", U6++) : (F6 += w6[U6], U6++);
                return F6.trim() && D6.push(this._parseSegment(F6.trim())), D6
            }
            _parseSegment(w6) {
                let D6 = {
                        type: "tag"
                    },
                    U6 = null,
                    F6 = w6,
                    z8 = w6.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
                if (z8 && (F6 = z8[1] + z8[3], z8[2])) {
                    let o8 = z8[2].slice(1, -1);
                    o8 && (U6 = o8)
                }
                let l6, j8, f8 = F6;
                if (F6.includes("::")) {
                    let o8 = F6.indexOf("::");
                    if (l6 = F6.substring(0, o8).trim(), f8 = F6.substring(o8 + 2).trim(), !l6) throw Error(`Invalid namespace in pattern: ${w6}`)
                }
                let p8 = null;
                if (f8.includes(":")) {
                    let o8 = f8.lastIndexOf(":"),
                        n1 = f8.substring(0, o8).trim(),
                        c1 = f8.substring(o8 + 1).trim();
                    ["first", "last", "odd", "even"].includes(c1) || /^nth\(\d+\)$/.test(c1) ? (j8 = n1, p8 = c1) : j8 = f8
                } else j8 = f8;
                if (!j8) throw Error(`Invalid segment pattern: ${w6}`);
                if (D6.tag = j8, l6 && (D6.namespace = l6), U6)
                    if (U6.includes("=")) {
                        let o8 = U6.indexOf("=");
                        D6.attrName = U6.substring(0, o8).trim(), D6.attrValue = U6.substring(o8 + 1).trim()
                    } else D6.attrName = U6.trim();
                if (p8) {
                    let o8 = p8.match(/^nth\((\d+)\)$/);
                    o8 ? (D6.position = "nth", D6.positionValue = parseInt(o8[1], 10)) : D6.position = p8
                }
                return D6
            }
            get length() {
                return this.segments.length
            }
            hasDeepWildcard() {
                return this._hasDeepWildcard
            }
            hasAttributeCondition() {
                return this._hasAttributeCondition
            }
            hasPositionSelector() {
                return this._hasPositionSelector
            }
            toString() {
                return this.pattern
            }
        }

        function J6(w6, D6) {
            if (!w6) return {};
            let U6 = D6.attributesGroupName ? w6[D6.attributesGroupName] : w6;
            if (!U6) return {};
            let F6 = {};
            for (let z8 in U6) z8.startsWith(D6.attributeNamePrefix) ? F6[z8.substring(D6.attributeNamePrefix.length)] = U6[z8] : F6[z8] = U6[z8];
            return F6
        }

        function $6(w6) {
            if (!w6 || typeof w6 != "string") return;
            let D6 = w6.indexOf(":");
            if (D6 !== -1 && D6 > 0) {
                let U6 = w6.substring(0, D6);
                if (U6 !== "xmlns") return U6
            }
        }
        class H6 {
            constructor(w6) {
                var D6;
                if (this.options = w6, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
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
                            val: (U6, F6) => v6(F6, 10, "&#")
                        },
                        num_hex: {
                            regex: /&#x([0-9a-fA-F]{1,6});/g,
                            val: (U6, F6) => v6(F6, 16, "&#x")
                        }
                    }, this.addExternalEntities = q6, this.parseXml = Y6, this.parseTextData = o, this.resolveNameSpace = _6, this.buildAttributesMap = t, this.isItStopNode = V6, this.replaceEntitiesValue = M6, this.readStopNodeData = k6, this.saveTextToParentTag = W6, this.addChild = X6, this.ignoreAttributesFn = typeof(D6 = this.options.ignoreAttributes) == "function" ? D6 : Array.isArray(D6) ? (U6) => {
                        for (let F6 of D6) {
                            if (typeof F6 == "string" && U6 === F6) return !0;
                            if (F6 instanceof RegExp && F6.test(U6)) return !0
                        }
                    } : () => !1, this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.matcher = new i, this.readonlyMatcher = this.matcher.readOnly(), this.isCurrentNodeStopNode = !1, this.options.stopNodes && this.options.stopNodes.length > 0) {
                    this.stopNodeExpressions = [];
                    for (let U6 = 0; U6 < this.options.stopNodes.length; U6++) {
                        let F6 = this.options.stopNodes[U6];
                        typeof F6 == "string" ? this.stopNodeExpressions.push(new O6(F6)) : F6 instanceof O6 && this.stopNodeExpressions.push(F6)
                    }
                }
            }
        }

        function q6(w6) {
            let D6 = Object.keys(w6);
            for (let U6 = 0; U6 < D6.length; U6++) {
                let F6 = D6[U6],
                    z8 = F6.replace(/[.\-+*:]/g, "\\.");
                this.lastEntities[F6] = {
                    regex: new RegExp("&" + z8 + ";", "g"),
                    val: w6[F6]
                }
            }
        }

        function o(w6, D6, U6, F6, z8, l6, j8) {
            if (w6 !== void 0 && (this.options.trimValues && !F6 && (w6 = w6.trim()), w6.length > 0)) {
                j8 || (w6 = this.replaceEntitiesValue(w6, D6, U6));
                let f8 = this.options.jPath ? U6.toString() : U6,
                    p8 = this.options.tagValueProcessor(D6, w6, f8, z8, l6);
                return p8 == null ? w6 : typeof p8 != typeof w6 || p8 !== w6 ? p8 : this.options.trimValues || w6.trim() === w6 ? T6(w6, this.options.parseTagValue, this.options.numberParseOptions) : w6
            }
        }

        function _6(w6) {
            if (this.options.removeNSPrefix) {
                let D6 = w6.split(":"),
                    U6 = w6.charAt(0) === "/" ? "/" : "";
                if (D6[0] === "xmlns") return "";
                D6.length === 2 && (w6 = U6 + D6[1])
            }
            return w6
        }
        let r = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");

        function t(w6, D6, U6) {
            if (this.options.ignoreAttributes !== !0 && typeof w6 == "string") {
                let F6 = Y(w6, r),
                    z8 = F6.length,
                    l6 = {},
                    j8 = {};
                for (let f8 = 0; f8 < z8; f8++) {
                    let p8 = this.resolveNameSpace(F6[f8][1]),
                        o8 = F6[f8][4];
                    if (p8.length && o8 !== void 0) {
                        let n1 = o8;
                        this.options.trimValues && (n1 = n1.trim()), n1 = this.replaceEntitiesValue(n1, U6, this.readonlyMatcher), j8[p8] = n1
                    }
                }
                Object.keys(j8).length > 0 && typeof D6 == "object" && D6.updateCurrent && D6.updateCurrent(j8);
                for (let f8 = 0; f8 < z8; f8++) {
                    let p8 = this.resolveNameSpace(F6[f8][1]),
                        o8 = this.options.jPath ? D6.toString() : this.readonlyMatcher;
                    if (this.ignoreAttributesFn(p8, o8)) continue;
                    let n1 = F6[f8][4],
                        c1 = this.options.attributeNamePrefix + p8;
                    if (p8.length)
                        if (this.options.transformAttributeName && (c1 = this.options.transformAttributeName(c1)), c1 = y6(c1, this.options), n1 !== void 0) {
                            this.options.trimValues && (n1 = n1.trim()), n1 = this.replaceEntitiesValue(n1, U6, this.readonlyMatcher);
                            let dq = this.options.jPath ? D6.toString() : this.readonlyMatcher,
                                uq = this.options.attributeValueProcessor(p8, n1, dq);
                            l6[c1] = uq == null ? n1 : typeof uq != typeof n1 || uq !== n1 ? uq : T6(n1, this.options.parseAttributeValue, this.options.numberParseOptions)
                        } else this.options.allowBooleanAttributes && (l6[c1] = !0)
                }
                if (!Object.keys(l6).length) return;
                if (this.options.attributesGroupName) {
                    let f8 = {};
                    return f8[this.options.attributesGroupName] = l6, f8
                }
                return l6
            }
        }
        let Y6 = function(w6) {
            w6 = w6.replace(/\r\n?/g, `
`);
            let D6 = new S("!xml"),
                U6 = D6,
                F6 = "";
            this.matcher.reset(), this.entityExpansionCount = 0, this.currentExpandedLength = 0;
            let z8 = new F(this.options.processEntities);
            for (let l6 = 0; l6 < w6.length; l6++)
                if (w6[l6] === "<")
                    if (w6[l6 + 1] === "/") {
                        let j8 = f6(w6, ">", l6, "Closing Tag is not closed."),
                            f8 = w6.substring(l6 + 2, j8).trim();
                        if (this.options.removeNSPrefix) {
                            let o8 = f8.indexOf(":");
                            o8 !== -1 && (f8 = f8.substr(o8 + 1))
                        }
                        f8 = L6(this.options.transformTagName, f8, "", this.options).tagName, U6 && (F6 = this.saveTextToParentTag(F6, U6, this.readonlyMatcher));
                        let p8 = this.matcher.getCurrentTag();
                        if (f8 && this.options.unpairedTags.indexOf(f8) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${f8}>`);
                        p8 && this.options.unpairedTags.indexOf(p8) !== -1 && (this.matcher.pop(), this.tagsNodeStack.pop()), this.matcher.pop(), this.isCurrentNodeStopNode = !1, U6 = this.tagsNodeStack.pop(), F6 = "", l6 = j8
                    } else if (w6[l6 + 1] === "?") {
                let j8 = G6(w6, l6, !1, "?>");
                if (!j8) throw Error("Pi Tag is not closed.");
                if (F6 = this.saveTextToParentTag(F6, U6, this.readonlyMatcher), this.options.ignoreDeclaration && j8.tagName === "?xml" || this.options.ignorePiTags);
                else {
                    let f8 = new S(j8.tagName);
                    f8.add(this.options.textNodeName, ""), j8.tagName !== j8.tagExp && j8.attrExpPresent && (f8[":@"] = this.buildAttributesMap(j8.tagExp, this.matcher, j8.tagName)), this.addChild(U6, f8, this.readonlyMatcher, l6)
                }
                l6 = j8.closeIndex + 1
            } else if (w6.substr(l6 + 1, 3) === "!--") {
                let j8 = f6(w6, "-->", l6 + 4, "Comment is not closed.");
                if (this.options.commentPropName) {
                    let f8 = w6.substring(l6 + 4, j8 - 2);
                    F6 = this.saveTextToParentTag(F6, U6, this.readonlyMatcher), U6.add(this.options.commentPropName, [{
                        [this.options.textNodeName]: f8
                    }])
                }
                l6 = j8
            } else if (w6.substr(l6 + 1, 2) === "!D") {
                let j8 = z8.readDocType(w6, l6);
                this.docTypeEntities = j8.entities, l6 = j8.i
            } else if (w6.substr(l6 + 1, 2) === "![") {
                let j8 = f6(w6, "]]>", l6, "CDATA is not closed.") - 2,
                    f8 = w6.substring(l6 + 9, j8);
                F6 = this.saveTextToParentTag(F6, U6, this.readonlyMatcher);
                let p8 = this.parseTextData(f8, U6.tagname, this.readonlyMatcher, !0, !1, !0, !0);
                p8 == null && (p8 = ""), this.options.cdataPropName ? U6.add(this.options.cdataPropName, [{
                    [this.options.textNodeName]: f8
                }]) : U6.add(this.options.textNodeName, p8), l6 = j8 + 2
            } else {
                let j8 = G6(w6, l6, this.options.removeNSPrefix);
                if (!j8) {
                    let $4 = w6.substring(Math.max(0, l6 - 50), Math.min(w6.length, l6 + 50));
                    throw Error(`readTagExp returned undefined at position ${l6}. Context: "${$4}"`)
                }
                let {
                    tagName: f8,
                    rawTagName: p8,
                    tagExp: o8,
                    attrExpPresent: n1,
                    closeIndex: c1
                } = j8;
                if ({
                        tagName: f8,
                        tagExp: o8
                    } = L6(this.options.transformTagName, f8, o8, this.options), this.options.strictReservedNames && (f8 === this.options.commentPropName || f8 === this.options.cdataPropName || f8 === this.options.textNodeName || f8 === this.options.attributesGroupName)) throw Error(`Invalid tag name: ${f8}`);
                U6 && F6 && U6.tagname !== "!xml" && (F6 = this.saveTextToParentTag(F6, U6, this.readonlyMatcher, !1));
                let dq = U6;
                dq && this.options.unpairedTags.indexOf(dq.tagname) !== -1 && (U6 = this.tagsNodeStack.pop(), this.matcher.pop());
                let uq = !1;
                o8.length > 0 && o8.lastIndexOf("/") === o8.length - 1 && (uq = !0, f8[f8.length - 1] === "/" ? (f8 = f8.substr(0, f8.length - 1), o8 = f8) : o8 = o8.substr(0, o8.length - 1), n1 = f8 !== o8);
                let h4, cq = null,
                    C1 = {};
                h4 = $6(p8), f8 !== D6.tagname && this.matcher.push(f8, {}, h4), f8 !== o8 && n1 && (cq = this.buildAttributesMap(o8, this.matcher, f8), cq && (C1 = J6(cq, this.options))), f8 !== D6.tagname && (this.isCurrentNodeStopNode = this.isItStopNode(this.stopNodeExpressions, this.matcher));
                let W7 = l6;
                if (this.isCurrentNodeStopNode) {
                    let $4 = "";
                    if (uq) l6 = j8.closeIndex;
                    else if (this.options.unpairedTags.indexOf(f8) !== -1) l6 = j8.closeIndex;
                    else {
                        let x4 = this.readStopNodeData(w6, p8, c1 + 1);
                        if (!x4) throw Error(`Unexpected end of ${p8}`);
                        l6 = x4.i, $4 = x4.tagContent
                    }
                    let t4 = new S(f8);
                    cq && (t4[":@"] = cq), t4.add(this.options.textNodeName, $4), this.matcher.pop(), this.isCurrentNodeStopNode = !1, this.addChild(U6, t4, this.readonlyMatcher, W7)
                } else {
                    if (uq) {
                        ({
                            tagName: f8,
                            tagExp: o8
                        } = L6(this.options.transformTagName, f8, o8, this.options));
                        let $4 = new S(f8);
                        cq && ($4[":@"] = cq), this.addChild(U6, $4, this.readonlyMatcher, W7), this.matcher.pop(), this.isCurrentNodeStopNode = !1
                    } else {
                        if (this.options.unpairedTags.indexOf(f8) !== -1) {
                            let $4 = new S(f8);
                            cq && ($4[":@"] = cq), this.addChild(U6, $4, this.readonlyMatcher, W7), this.matcher.pop(), this.isCurrentNodeStopNode = !1, l6 = j8.closeIndex;
                            continue
                        } {
                            let $4 = new S(f8);
                            if (this.tagsNodeStack.length > this.options.maxNestedTags) throw Error("Maximum nested tags exceeded");
                            this.tagsNodeStack.push(U6), cq && ($4[":@"] = cq), this.addChild(U6, $4, this.readonlyMatcher, W7), U6 = $4
                        }
                    }
                    F6 = "", l6 = c1
                }
            } else F6 += w6[l6];
            return D6.child
        };

        function X6(w6, D6, U6, F6) {
            this.options.captureMetaData || (F6 = void 0);
            let z8 = this.options.jPath ? U6.toString() : U6,
                l6 = this.options.updateTag(D6.tagname, z8, D6[":@"]);
            l6 === !1 || (typeof l6 == "string" ? (D6.tagname = l6, w6.addChild(D6, F6)) : w6.addChild(D6, F6))
        }

        function M6(w6, D6, U6) {
            let F6 = this.options.processEntities;
            if (!F6 || !F6.enabled) return w6;
            if (F6.allowedTags) {
                let z8 = this.options.jPath ? U6.toString() : U6;
                if (!(Array.isArray(F6.allowedTags) ? F6.allowedTags.includes(D6) : F6.allowedTags(D6, z8))) return w6
            }
            if (F6.tagFilter) {
                let z8 = this.options.jPath ? U6.toString() : U6;
                if (!F6.tagFilter(D6, z8)) return w6
            }
            for (let z8 of Object.keys(this.docTypeEntities)) {
                let l6 = this.docTypeEntities[z8],
                    j8 = w6.match(l6.regx);
                if (j8) {
                    if (this.entityExpansionCount += j8.length, F6.maxTotalExpansions && this.entityExpansionCount > F6.maxTotalExpansions) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${F6.maxTotalExpansions}`);
                    let f8 = w6.length;
                    if (w6 = w6.replace(l6.regx, l6.val), F6.maxExpandedLength && (this.currentExpandedLength += w6.length - f8, this.currentExpandedLength > F6.maxExpandedLength)) throw Error(`Total expanded content size exceeded: ${this.currentExpandedLength} > ${F6.maxExpandedLength}`)
                }
            }
            for (let z8 of Object.keys(this.lastEntities)) {
                let l6 = this.lastEntities[z8],
                    j8 = w6.match(l6.regex);
                if (j8 && (this.entityExpansionCount += j8.length, F6.maxTotalExpansions && this.entityExpansionCount > F6.maxTotalExpansions)) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${F6.maxTotalExpansions}`);
                w6 = w6.replace(l6.regex, l6.val)
            }
            if (w6.indexOf("&") === -1) return w6;
            if (this.options.htmlEntities)
                for (let z8 of Object.keys(this.htmlEntities)) {
                    let l6 = this.htmlEntities[z8],
                        j8 = w6.match(l6.regex);
                    if (j8 && (this.entityExpansionCount += j8.length, F6.maxTotalExpansions && this.entityExpansionCount > F6.maxTotalExpansions)) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${F6.maxTotalExpansions}`);
                    w6 = w6.replace(l6.regex, l6.val)
                }
            return w6.replace(this.ampEntity.regex, this.ampEntity.val)
        }

        function W6(w6, D6, U6, F6) {
            return w6 && (F6 === void 0 && (F6 = D6.child.length === 0), (w6 = this.parseTextData(w6, D6.tagname, U6, !1, !!D6[":@"] && Object.keys(D6[":@"]).length !== 0, F6)) !== void 0 && w6 !== "" && D6.add(this.options.textNodeName, w6), w6 = ""), w6
        }

        function V6(w6, D6) {
            if (!w6 || w6.length === 0) return !1;
            for (let U6 = 0; U6 < w6.length; U6++)
                if (D6.matches(w6[U6])) return !0;
            return !1
        }

        function f6(w6, D6, U6, F6) {
            let z8 = w6.indexOf(D6, U6);
            if (z8 === -1) throw Error(F6);
            return z8 + D6.length - 1
        }

        function G6(w6, D6, U6, F6 = ">") {
            let z8 = function(c1, dq, uq = ">") {
                let h4, cq = "";
                for (let C1 = dq; C1 < c1.length; C1++) {
                    let W7 = c1[C1];
                    if (h4) W7 === h4 && (h4 = "");
                    else if (W7 === '"' || W7 === "'") h4 = W7;
                    else if (W7 === uq[0]) {
                        if (!uq[1]) return {
                            data: cq,
                            index: C1
                        };
                        if (c1[C1 + 1] === uq[1]) return {
                            data: cq,
                            index: C1
                        }
                    } else W7 === "\t" && (W7 = " ");
                    cq += W7
                }
            }(w6, D6 + 1, F6);
            if (!z8) return;
            let {
                data: l6,
                index: j8
            } = z8, f8 = l6.search(/\s/), p8 = l6, o8 = !0;
            f8 !== -1 && (p8 = l6.substring(0, f8), l6 = l6.substring(f8 + 1).trimStart());
            let n1 = p8;
            if (U6) {
                let c1 = p8.indexOf(":");
                c1 !== -1 && (p8 = p8.substr(c1 + 1), o8 = p8 !== z8.data.substr(c1 + 1))
            }
            return {
                tagName: p8,
                tagExp: l6,
                closeIndex: j8,
                attrExpPresent: o8,
                rawTagName: n1
            }
        }

        function k6(w6, D6, U6) {
            let F6 = U6,
                z8 = 1;
            for (; U6 < w6.length; U6++)
                if (w6[U6] === "<")
                    if (w6[U6 + 1] === "/") {
                        let l6 = f6(w6, ">", U6, `${D6} is not closed`);
                        if (w6.substring(U6 + 2, l6).trim() === D6 && (z8--, z8 === 0)) return {
                            tagContent: w6.substring(F6, U6),
                            i: l6
                        };
                        U6 = l6
                    } else if (w6[U6 + 1] === "?") U6 = f6(w6, "?>", U6 + 1, "StopNode is not closed.");
            else if (w6.substr(U6 + 1, 3) === "!--") U6 = f6(w6, "-->", U6 + 3, "StopNode is not closed.");
            else if (w6.substr(U6 + 1, 2) === "![") U6 = f6(w6, "]]>", U6, "StopNode is not closed.") - 2;
            else {
                let l6 = G6(w6, U6, ">");
                l6 && ((l6 && l6.tagName) === D6 && l6.tagExp[l6.tagExp.length - 1] !== "/" && z8++, U6 = l6.closeIndex)
            }
        }

        function T6(w6, D6, U6) {
            if (D6 && typeof w6 == "string") {
                let F6 = w6.trim();
                return F6 === "true" || F6 !== "false" && function(z8, l6 = {}) {
                    if (l6 = Object.assign({}, z6, l6), !z8 || typeof z8 != "string") return z8;
                    let j8 = z8.trim();
                    if (l6.skipLike !== void 0 && l6.skipLike.test(j8)) return z8;
                    if (z8 === "0") return 0;
                    if (l6.hex && n.test(j8)) return function(p8) {
                        if (parseInt) return parseInt(p8, 16);
                        if (Number.parseInt) return Number.parseInt(p8, 16);
                        if (window && window.parseInt) return window.parseInt(p8, 16);
                        throw Error("parseInt, Number.parseInt, window.parseInt are not supported")
                    }(j8);
                    if (isFinite(j8)) {
                        if (j8.includes("e") || j8.includes("E")) return function(p8, o8, n1) {
                            if (!n1.eNotation) return p8;
                            let c1 = o8.match(A6);
                            if (c1) {
                                let dq = c1[1] || "",
                                    uq = c1[3].indexOf("e") === -1 ? "E" : "e",
                                    h4 = c1[2],
                                    cq = dq ? p8[h4.length + 1] === uq : p8[h4.length] === uq;
                                return h4.length > 1 && cq ? p8 : (h4.length !== 1 || !c1[3].startsWith(`.${uq}`) && c1[3][0] !== uq) && h4.length > 0 ? n1.leadingZeros && !cq ? (o8 = (c1[1] || "") + c1[3], Number(o8)) : p8 : Number(o8)
                            }
                            return p8
                        }(z8, j8, l6);
                        {
                            let p8 = l.exec(j8);
                            if (p8) {
                                let o8 = p8[1] || "",
                                    n1 = p8[2],
                                    c1 = (f8 = p8[3]) && f8.indexOf(".") !== -1 ? ((f8 = f8.replace(/0+$/, "")) === "." ? f8 = "0" : f8[0] === "." ? f8 = "0" + f8 : f8[f8.length - 1] === "." && (f8 = f8.substring(0, f8.length - 1)), f8) : f8,
                                    dq = o8 ? z8[n1.length + 1] === "." : z8[n1.length] === ".";
                                if (!l6.leadingZeros && (n1.length > 1 || n1.length === 1 && !dq)) return z8;
                                {
                                    let uq = Number(j8),
                                        h4 = String(uq);
                                    if (uq === 0) return uq;
                                    if (h4.search(/[eE]/) !== -1) return l6.eNotation ? uq : z8;
                                    if (j8.indexOf(".") !== -1) return h4 === "0" || h4 === c1 || h4 === `${o8}${c1}` ? uq : z8;
                                    let cq = n1 ? c1 : j8;
                                    return n1 ? cq === h4 || o8 + cq === h4 ? uq : z8 : cq === h4 || cq === o8 + h4 ? uq : z8
                                }
                            }
                            return z8
                        }
                    }
                    var f8;
                    return function(p8, o8, n1) {
                        let c1 = o8 === 1 / 0;
                        switch (n1.infinity.toLowerCase()) {
                            case "null":
                                return null;
                            case "infinity":
                                return o8;
                            case "string":
                                return c1 ? "Infinity" : "-Infinity";
                            default:
                                return p8
                        }
                    }(z8, Number(j8), l6)
                }(w6, U6)
            }
            return w6 !== void 0 ? w6 : ""
        }

        function v6(w6, D6, U6) {
            let F6 = Number.parseInt(w6, D6);
            return F6 >= 0 && F6 <= 1114111 ? String.fromCodePoint(F6) : U6 + w6 + ";"
        }

        function L6(w6, D6, U6, F6) {
            if (w6) {
                let z8 = w6(D6);
                U6 === D6 && (U6 = z8), D6 = z8
            }
            return {
                tagName: D6 = y6(D6, F6),
                tagExp: U6
            }
        }

        function y6(w6, D6) {
            if (w.includes(w6)) throw Error(`[SECURITY] Invalid name: "${w6}" is a reserved JavaScript keyword that could cause prototype pollution`);
            return O.includes(w6) ? D6.onDangerousProperty(w6) : w6
        }
        let c6 = S.getMetaDataSymbol();

        function Z8(w6, D6) {
            if (!w6 || typeof w6 != "object") return {};
            if (!D6) return w6;
            let U6 = {};
            for (let F6 in w6) F6.startsWith(D6) ? U6[F6.substring(D6.length)] = w6[F6] : U6[F6] = w6[F6];
            return U6
        }

        function N8(w6, D6, U6, F6) {
            return R6(w6, D6, U6, F6)
        }

        function R6(w6, D6, U6, F6) {
            let z8, l6 = {};
            for (let j8 = 0; j8 < w6.length; j8++) {
                let f8 = w6[j8],
                    p8 = p6(f8);
                if (p8 !== void 0 && p8 !== D6.textNodeName) {
                    let o8 = Z8(f8[":@"] || {}, D6.attributeNamePrefix);
                    U6.push(p8, o8)
                }
                if (p8 === D6.textNodeName) z8 === void 0 ? z8 = f8[p8] : z8 += "" + f8[p8];
                else {
                    if (p8 === void 0) continue;
                    if (f8[p8]) {
                        let o8 = R6(f8[p8], D6, U6, F6),
                            n1 = L8(o8, D6);
                        if (f8[":@"] ? q8(o8, f8[":@"], F6, D6) : Object.keys(o8).length !== 1 || o8[D6.textNodeName] === void 0 || D6.alwaysCreateTextNode ? Object.keys(o8).length === 0 && (D6.alwaysCreateTextNode ? o8[D6.textNodeName] = "" : o8 = "") : o8 = o8[D6.textNodeName], f8[c6] !== void 0 && typeof o8 == "object" && o8 !== null && (o8[c6] = f8[c6]), l6[p8] !== void 0 && Object.prototype.hasOwnProperty.call(l6, p8)) Array.isArray(l6[p8]) || (l6[p8] = [l6[p8]]), l6[p8].push(o8);
                        else {
                            let c1 = D6.jPath ? F6.toString() : F6;
                            D6.isArray(p8, c1, n1) ? l6[p8] = [o8] : l6[p8] = o8
                        }
                        p8 !== void 0 && p8 !== D6.textNodeName && U6.pop()
                    }
                }
            }
            return typeof z8 == "string" ? z8.length > 0 && (l6[D6.textNodeName] = z8) : z8 !== void 0 && (l6[D6.textNodeName] = z8), l6
        }

        function p6(w6) {
            let D6 = Object.keys(w6);
            for (let U6 = 0; U6 < D6.length; U6++) {
                let F6 = D6[U6];
                if (F6 !== ":@") return F6
            }
        }

        function q8(w6, D6, U6, F6) {
            if (D6) {
                let z8 = Object.keys(D6),
                    l6 = z8.length;
                for (let j8 = 0; j8 < l6; j8++) {
                    let f8 = z8[j8],
                        p8 = f8.startsWith(F6.attributeNamePrefix) ? f8.substring(F6.attributeNamePrefix.length) : f8,
                        o8 = F6.jPath ? U6.toString() + "." + p8 : U6;
                    F6.isArray(f8, o8, !0, !0) ? w6[f8] = [D6[f8]] : w6[f8] = D6[f8]
                }
            }
        }

        function L8(w6, D6) {
            let {
                textNodeName: U6
            } = D6, F6 = Object.keys(w6).length;
            return F6 === 0 || !(F6 !== 1 || !w6[U6] && typeof w6[U6] != "boolean" && w6[U6] !== 0)
        }
        class w8 {
            constructor(w6) {
                this.externalEntities = {}, this.options = B(w6)
            }
            parse(w6, D6) {
                if (typeof w6 != "string" && w6.toString) w6 = w6.toString();
                else if (typeof w6 != "string") throw Error("XML data is accepted in String or Bytes[] form.");
                if (D6) {
                    D6 === !0 && (D6 = {});
                    let z8 = j(w6, D6);
                    if (z8 !== !0) throw Error(`${z8.err.msg}:${z8.err.line}:${z8.err.col}`)
                }
                let U6 = new H6(this.options);
                U6.addExternalEntities(this.externalEntities);
                let F6 = U6.parseXml(w6);
                return this.options.preserveOrder || F6 === void 0 ? F6 : N8(F6, this.options, U6.matcher, U6.readonlyMatcher)
            }
            addEntity(w6, D6) {
                if (D6.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
                if (w6.indexOf("&") !== -1 || w6.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
                if (D6 === "&") throw Error("An entity with value '&' is not permitted");
                this.externalEntities[w6] = D6
            }
            static getMetaDataSymbol() {
                return S.getMetaDataSymbol()
            }
        }

        function x8(w6, D6) {
            let U6 = "";
            D6.format && D6.indentBy.length > 0 && (U6 = `
`);
            let F6 = [];
            if (D6.stopNodes && Array.isArray(D6.stopNodes))
                for (let z8 = 0; z8 < D6.stopNodes.length; z8++) {
                    let l6 = D6.stopNodes[z8];
                    typeof l6 == "string" ? F6.push(new O6(l6)) : l6 instanceof O6 && F6.push(l6)
                }
            return a6(w6, D6, U6, new i, F6)
        }

        function a6(w6, D6, U6, F6, z8) {
            let l6 = "",
                j8 = !1;
            if (D6.maxNestedTags && F6.getDepth() > D6.maxNestedTags) throw Error("Maximum nested tags exceeded");
            if (!Array.isArray(w6)) {
                if (w6 != null) {
                    let f8 = w6.toString();
                    return f8 = h6(f8, D6), f8
                }
                return ""
            }
            for (let f8 = 0; f8 < w6.length; f8++) {
                let p8 = w6[f8],
                    o8 = G8(p8);
                if (o8 === void 0) continue;
                let n1 = D8(p8[":@"], D6);
                F6.push(o8, n1);
                let c1 = u6(F6, z8);
                if (o8 === D6.textNodeName) {
                    let cq = p8[o8];
                    c1 || (cq = D6.tagValueProcessor(o8, cq), cq = h6(cq, D6)), j8 && (l6 += U6), l6 += cq, j8 = !1, F6.pop();
                    continue
                }
                if (o8 === D6.cdataPropName) {
                    j8 && (l6 += U6), l6 += `<![CDATA[${p8[o8][0][D6.textNodeName]}]]>`, j8 = !1, F6.pop();
                    continue
                }
                if (o8 === D6.commentPropName) {
                    l6 += U6 + `<!--${p8[o8][0][D6.textNodeName]}-->`, j8 = !0, F6.pop();
                    continue
                }
                if (o8[0] === "?") {
                    let cq = s6(p8[":@"], D6, c1),
                        C1 = o8 === "?xml" ? "" : U6,
                        W7 = p8[o8][0][D6.textNodeName];
                    W7 = W7.length !== 0 ? " " + W7 : "", l6 += C1 + `<${o8}${W7}${cq}?>`, j8 = !0, F6.pop();
                    continue
                }
                let dq = U6;
                dq !== "" && (dq += D6.indentBy);
                let uq = U6 + `<${o8}${s6(p8[":@"],D6,c1)}`,
                    h4;
                h4 = c1 ? Q6(p8[o8], D6) : a6(p8[o8], D6, dq, F6, z8), D6.unpairedTags.indexOf(o8) !== -1 ? D6.suppressUnpairedNode ? l6 += uq + ">" : l6 += uq + "/>" : h4 && h4.length !== 0 || !D6.suppressEmptyNode ? h4 && h4.endsWith(">") ? l6 += uq + `>${h4}${U6}</${o8}>` : (l6 += uq + ">", h4 && U6 !== "" && (h4.includes("/>") || h4.includes("</")) ? l6 += U6 + D6.indentBy + h4 + U6 : l6 += h4, l6 += `</${o8}>`) : l6 += uq + "/>", j8 = !0, F6.pop()
            }
            return l6
        }

        function D8(w6, D6) {
            if (!w6 || D6.ignoreAttributes) return null;
            let U6 = {},
                F6 = !1;
            for (let z8 in w6) Object.prototype.hasOwnProperty.call(w6, z8) && (U6[z8.startsWith(D6.attributeNamePrefix) ? z8.substr(D6.attributeNamePrefix.length) : z8] = w6[z8], F6 = !0);
            return F6 ? U6 : null
        }

        function Q6(w6, D6) {
            if (!Array.isArray(w6)) return w6 != null ? w6.toString() : "";
            let U6 = "";
            for (let F6 = 0; F6 < w6.length; F6++) {
                let z8 = w6[F6],
                    l6 = G8(z8);
                if (l6 === D6.textNodeName) U6 += z8[l6];
                else if (l6 === D6.cdataPropName) U6 += z8[l6][0][D6.textNodeName];
                else if (l6 === D6.commentPropName) U6 += z8[l6][0][D6.textNodeName];
                else {
                    if (l6 && l6[0] === "?") continue;
                    if (l6) {
                        let j8 = W8(z8[":@"], D6),
                            f8 = Q6(z8[l6], D6);
                        f8 && f8.length !== 0 ? U6 += `<${l6}${j8}>${f8}</${l6}>` : U6 += `<${l6}${j8}/>`
                    }
                }
            }
            return U6
        }

        function W8(w6, D6) {
            let U6 = "";
            if (w6 && !D6.ignoreAttributes)
                for (let F6 in w6) {
                    if (!Object.prototype.hasOwnProperty.call(w6, F6)) continue;
                    let z8 = w6[F6];
                    z8 === !0 && D6.suppressBooleanAttributes ? U6 += ` ${F6.substr(D6.attributeNamePrefix.length)}` : U6 += ` ${F6.substr(D6.attributeNamePrefix.length)}="${z8}"`
                }
            return U6
        }

        function G8(w6) {
            let D6 = Object.keys(w6);
            for (let U6 = 0; U6 < D6.length; U6++) {
                let F6 = D6[U6];
                if (Object.prototype.hasOwnProperty.call(w6, F6) && F6 !== ":@") return F6
            }
        }

        function s6(w6, D6, U6) {
            let F6 = "";
            if (w6 && !D6.ignoreAttributes)
                for (let z8 in w6) {
                    if (!Object.prototype.hasOwnProperty.call(w6, z8)) continue;
                    let l6;
                    U6 ? l6 = w6[z8] : (l6 = D6.attributeValueProcessor(z8, w6[z8]), l6 = h6(l6, D6)), l6 === !0 && D6.suppressBooleanAttributes ? F6 += ` ${z8.substr(D6.attributeNamePrefix.length)}` : F6 += ` ${z8.substr(D6.attributeNamePrefix.length)}="${l6}"`
                }
            return F6
        }

        function u6(w6, D6) {
            if (!D6 || D6.length === 0) return !1;
            for (let U6 = 0; U6 < D6.length; U6++)
                if (w6.matches(D6[U6])) return !0;
            return !1
        }

        function h6(w6, D6) {
            if (w6 && w6.length > 0 && D6.processEntities)
                for (let U6 = 0; U6 < D6.entities.length; U6++) {
                    let F6 = D6.entities[U6];
                    w6 = w6.replace(F6.regex, F6.val)
                }
            return w6
        }
        let _8 = {
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
            tagValueProcessor: function(w6, D6) {
                return D6
            },
            attributeValueProcessor: function(w6, D6) {
                return D6
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
            oneListGroup: !1,
            maxNestedTags: 100,
            jPath: !0
        };

        function R8(w6) {
            if (this.options = Object.assign({}, _8, w6), this.options.stopNodes && Array.isArray(this.options.stopNodes) && (this.options.stopNodes = this.options.stopNodes.map((U6) => typeof U6 == "string" && U6.startsWith("*.") ? ".." + U6.substring(2) : U6)), this.stopNodeExpressions = [], this.options.stopNodes && Array.isArray(this.options.stopNodes))
                for (let U6 = 0; U6 < this.options.stopNodes.length; U6++) {
                    let F6 = this.options.stopNodes[U6];
                    typeof F6 == "string" ? this.stopNodeExpressions.push(new O6(F6)) : F6 instanceof O6 && this.stopNodeExpressions.push(F6)
                }
            var D6;
            this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
                return !1
            } : (this.ignoreAttributesFn = typeof(D6 = this.options.ignoreAttributes) == "function" ? D6 : Array.isArray(D6) ? (U6) => {
                for (let F6 of D6) {
                    if (typeof F6 == "string" && U6 === F6) return !0;
                    if (F6 instanceof RegExp && F6.test(U6)) return !0
                }
            } : () => !1, this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = v8), this.processTextOrObjNode = x6, this.options.format ? (this.indentate = i6, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
                return ""
            }, this.tagEndChar = ">", this.newLine = "")
        }

        function x6(w6, D6, U6, F6) {
            let z8 = this.extractAttributes(w6);
            if (F6.push(D6, z8), this.checkStopNode(F6)) {
                let j8 = this.buildRawContent(w6),
                    f8 = this.buildAttributesForStopNode(w6);
                return F6.pop(), this.buildObjectNode(j8, D6, f8, U6)
            }
            let l6 = this.j2x(w6, U6 + 1, F6);
            return F6.pop(), w6[this.options.textNodeName] !== void 0 && Object.keys(w6).length === 1 ? this.buildTextValNode(w6[this.options.textNodeName], D6, l6.attrStr, U6, F6) : this.buildObjectNode(l6.val, D6, l6.attrStr, U6)
        }

        function i6(w6) {
            return this.options.indentBy.repeat(w6)
        }

        function v8(w6) {
            return !(!w6.startsWith(this.options.attributeNamePrefix) || w6 === this.options.textNodeName) && w6.substr(this.attrPrefixLen)
        }
        R8.prototype.build = function(w6) {
            if (this.options.preserveOrder) return x8(w6, this.options);
            {
                Array.isArray(w6) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (w6 = {
                    [this.options.arrayNodeName]: w6
                });
                let D6 = new i;
                return this.j2x(w6, 0, D6).val
            }
        }, R8.prototype.j2x = function(w6, D6, U6) {
            let F6 = "",
                z8 = "";
            if (this.options.maxNestedTags && U6.getDepth() >= this.options.maxNestedTags) throw Error("Maximum nested tags exceeded");
            let l6 = this.options.jPath ? U6.toString() : U6,
                j8 = this.checkStopNode(U6);
            for (let f8 in w6)
                if (Object.prototype.hasOwnProperty.call(w6, f8))
                    if (w6[f8] === void 0) this.isAttribute(f8) && (z8 += "");
                    else if (w6[f8] === null) this.isAttribute(f8) || f8 === this.options.cdataPropName ? z8 += "" : f8[0] === "?" ? z8 += this.indentate(D6) + "<" + f8 + "?" + this.tagEndChar : z8 += this.indentate(D6) + "<" + f8 + "/" + this.tagEndChar;
            else if (w6[f8] instanceof Date) z8 += this.buildTextValNode(w6[f8], f8, "", D6, U6);
            else if (typeof w6[f8] != "object") {
                let p8 = this.isAttribute(f8);
                if (p8 && !this.ignoreAttributesFn(p8, l6)) F6 += this.buildAttrPairStr(p8, "" + w6[f8], j8);
                else if (!p8)
                    if (f8 === this.options.textNodeName) {
                        let o8 = this.options.tagValueProcessor(f8, "" + w6[f8]);
                        z8 += this.replaceEntitiesValue(o8)
                    } else {
                        U6.push(f8);
                        let o8 = this.checkStopNode(U6);
                        if (U6.pop(), o8) {
                            let n1 = "" + w6[f8];
                            z8 += n1 === "" ? this.indentate(D6) + "<" + f8 + this.closeTag(f8) + this.tagEndChar : this.indentate(D6) + "<" + f8 + ">" + n1 + "</" + f8 + this.tagEndChar
                        } else z8 += this.buildTextValNode(w6[f8], f8, "", D6, U6)
                    }
            } else if (Array.isArray(w6[f8])) {
                let p8 = w6[f8].length,
                    o8 = "",
                    n1 = "";
                for (let c1 = 0; c1 < p8; c1++) {
                    let dq = w6[f8][c1];
                    if (dq === void 0);
                    else if (dq === null) f8[0] === "?" ? z8 += this.indentate(D6) + "<" + f8 + "?" + this.tagEndChar : z8 += this.indentate(D6) + "<" + f8 + "/" + this.tagEndChar;
                    else if (typeof dq == "object")
                        if (this.options.oneListGroup) {
                            U6.push(f8);
                            let uq = this.j2x(dq, D6 + 1, U6);
                            U6.pop(), o8 += uq.val, this.options.attributesGroupName && dq.hasOwnProperty(this.options.attributesGroupName) && (n1 += uq.attrStr)
                        } else o8 += this.processTextOrObjNode(dq, f8, D6, U6);
                    else if (this.options.oneListGroup) {
                        let uq = this.options.tagValueProcessor(f8, dq);
                        uq = this.replaceEntitiesValue(uq), o8 += uq
                    } else {
                        U6.push(f8);
                        let uq = this.checkStopNode(U6);
                        if (U6.pop(), uq) {
                            let h4 = "" + dq;
                            o8 += h4 === "" ? this.indentate(D6) + "<" + f8 + this.closeTag(f8) + this.tagEndChar : this.indentate(D6) + "<" + f8 + ">" + h4 + "</" + f8 + this.tagEndChar
                        } else o8 += this.buildTextValNode(dq, f8, "", D6, U6)
                    }
                }
                this.options.oneListGroup && (o8 = this.buildObjectNode(o8, f8, n1, D6)), z8 += o8
            } else if (this.options.attributesGroupName && f8 === this.options.attributesGroupName) {
                let p8 = Object.keys(w6[f8]),
                    o8 = p8.length;
                for (let n1 = 0; n1 < o8; n1++) F6 += this.buildAttrPairStr(p8[n1], "" + w6[f8][p8[n1]], j8)
            } else z8 += this.processTextOrObjNode(w6[f8], f8, D6, U6);
            return {
                attrStr: F6,
                val: z8
            }
        }, R8.prototype.buildAttrPairStr = function(w6, D6, U6) {
            return U6 || (D6 = this.options.attributeValueProcessor(w6, "" + D6), D6 = this.replaceEntitiesValue(D6)), this.options.suppressBooleanAttributes && D6 === "true" ? " " + w6 : " " + w6 + '="' + D6 + '"'
        }, R8.prototype.extractAttributes = function(w6) {
            if (!w6 || typeof w6 != "object") return null;
            let D6 = {},
                U6 = !1;
            if (this.options.attributesGroupName && w6[this.options.attributesGroupName]) {
                let F6 = w6[this.options.attributesGroupName];
                for (let z8 in F6) Object.prototype.hasOwnProperty.call(F6, z8) && (D6[z8.startsWith(this.options.attributeNamePrefix) ? z8.substring(this.options.attributeNamePrefix.length) : z8] = F6[z8], U6 = !0)
            } else
                for (let F6 in w6) {
                    if (!Object.prototype.hasOwnProperty.call(w6, F6)) continue;
                    let z8 = this.isAttribute(F6);
                    z8 && (D6[z8] = w6[F6], U6 = !0)
                }
            return U6 ? D6 : null
        }, R8.prototype.buildRawContent = function(w6) {
            if (typeof w6 == "string") return w6;
            if (typeof w6 != "object" || w6 === null) return String(w6);
            if (w6[this.options.textNodeName] !== void 0) return w6[this.options.textNodeName];
            let D6 = "";
            for (let U6 in w6) {
                if (!Object.prototype.hasOwnProperty.call(w6, U6)) continue;
                if (this.isAttribute(U6)) continue;
                if (this.options.attributesGroupName && U6 === this.options.attributesGroupName) continue;
                let F6 = w6[U6];
                if (U6 === this.options.textNodeName) D6 += F6;
                else if (Array.isArray(F6)) {
                    for (let z8 of F6)
                        if (typeof z8 == "string" || typeof z8 == "number") D6 += `<${U6}>${z8}</${U6}>`;
                        else if (typeof z8 == "object" && z8 !== null) {
                        let l6 = this.buildRawContent(z8),
                            j8 = this.buildAttributesForStopNode(z8);
                        D6 += l6 === "" ? `<${U6}${j8}/>` : `<${U6}${j8}>${l6}</${U6}>`
                    }
                } else if (typeof F6 == "object" && F6 !== null) {
                    let z8 = this.buildRawContent(F6),
                        l6 = this.buildAttributesForStopNode(F6);
                    D6 += z8 === "" ? `<${U6}${l6}/>` : `<${U6}${l6}>${z8}</${U6}>`
                } else D6 += `<${U6}>${F6}</${U6}>`
            }
            return D6
        }, R8.prototype.buildAttributesForStopNode = function(w6) {
            if (!w6 || typeof w6 != "object") return "";
            let D6 = "";
            if (this.options.attributesGroupName && w6[this.options.attributesGroupName]) {
                let U6 = w6[this.options.attributesGroupName];
                for (let F6 in U6) {
                    if (!Object.prototype.hasOwnProperty.call(U6, F6)) continue;
                    let z8 = F6.startsWith(this.options.attributeNamePrefix) ? F6.substring(this.options.attributeNamePrefix.length) : F6,
                        l6 = U6[F6];
                    l6 === !0 && this.options.suppressBooleanAttributes ? D6 += " " + z8 : D6 += " " + z8 + '="' + l6 + '"'
                }
            } else
                for (let U6 in w6) {
                    if (!Object.prototype.hasOwnProperty.call(w6, U6)) continue;
                    let F6 = this.isAttribute(U6);
                    if (F6) {
                        let z8 = w6[U6];
                        z8 === !0 && this.options.suppressBooleanAttributes ? D6 += " " + F6 : D6 += " " + F6 + '="' + z8 + '"'
                    }
                }
            return D6
        }, R8.prototype.buildObjectNode = function(w6, D6, U6, F6) {
            if (w6 === "") return D6[0] === "?" ? this.indentate(F6) + "<" + D6 + U6 + "?" + this.tagEndChar : this.indentate(F6) + "<" + D6 + U6 + this.closeTag(D6) + this.tagEndChar;
            {
                let z8 = "</" + D6 + this.tagEndChar,
                    l6 = "";
                return D6[0] === "?" && (l6 = "?", z8 = ""), !U6 && U6 !== "" || w6.indexOf("<") !== -1 ? this.options.commentPropName !== !1 && D6 === this.options.commentPropName && l6.length === 0 ? this.indentate(F6) + `<!--${w6}-->` + this.newLine : this.indentate(F6) + "<" + D6 + U6 + l6 + this.tagEndChar + w6 + this.indentate(F6) + z8 : this.indentate(F6) + "<" + D6 + U6 + l6 + ">" + w6 + z8
            }
        }, R8.prototype.closeTag = function(w6) {
            let D6 = "";
            return this.options.unpairedTags.indexOf(w6) !== -1 ? this.options.suppressUnpairedNode || (D6 = "/") : D6 = this.options.suppressEmptyNode ? "/" : `></${w6}`, D6
        }, R8.prototype.checkStopNode = function(w6) {
            if (!this.stopNodeExpressions || this.stopNodeExpressions.length === 0) return !1;
            for (let D6 = 0; D6 < this.stopNodeExpressions.length; D6++)
                if (w6.matches(this.stopNodeExpressions[D6])) return !0;
            return !1
        }, R8.prototype.buildTextValNode = function(w6, D6, U6, F6, z8) {
            if (this.options.cdataPropName !== !1 && D6 === this.options.cdataPropName) return this.indentate(F6) + `<![CDATA[${w6}]]>` + this.newLine;
            if (this.options.commentPropName !== !1 && D6 === this.options.commentPropName) return this.indentate(F6) + `<!--${w6}-->` + this.newLine;
            if (D6[0] === "?") return this.indentate(F6) + "<" + D6 + U6 + "?" + this.tagEndChar;
            {
                let l6 = this.options.tagValueProcessor(D6, w6);
                return l6 = this.replaceEntitiesValue(l6), l6 === "" ? this.indentate(F6) + "<" + D6 + U6 + this.closeTag(D6) + this.tagEndChar : this.indentate(F6) + "<" + D6 + U6 + ">" + l6 + "</" + D6 + this.tagEndChar
            }
        }, R8.prototype.replaceEntitiesValue = function(w6) {
            if (w6 && w6.length > 0 && this.options.processEntities)
                for (let D6 = 0; D6 < this.options.entities.length; D6++) {
                    let U6 = this.options.entities[D6];
                    w6 = w6.replace(U6.regex, U6.val)
                }
            return w6
        };
        let f1 = R8,
            g8 = {
                validate: j
            };
        mqq.exports = K
    })()
})
// @from(Ln 79219, Col 4)
Fqq = p((pqq) => {
    Object.defineProperty(pqq, "__esModule", {
        value: !0
    });
    pqq.parseXML = DZ3;
    var WZ3 = Bqq(),
        lJ1 = new WZ3.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: (q, K) => K.trim() === "" && K.includes(`
`) ? "" : void 0
        });
    lJ1.addEntity("#xD", "\r");
    lJ1.addEntity("#10", `
`);

    function DZ3(q) {
        return lJ1.parse(q, !0)
    }
})
// @from(Ln 79243, Col 4)
iJ1 = p((gqq) => {
    var fZ3 = Fqq();

    function GZ3(q) {
        return q.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }

    function vZ3(q) {
        return q.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;")
    }
    class nJ1 {
        value;
        constructor(q) {
            this.value = q
        }
        toString() {
            return vZ3("" + this.value)
        }
    }
    class Cc6 {
        name;
        children;
        attributes = {};
        static of (q, K, _) {
            let z = new Cc6(q);
            if (K !== void 0) z.addChildNode(new nJ1(K));
            if (_ !== void 0) z.withName(_);
            return z
        }
        constructor(q, K = []) {
            this.name = q, this.children = K
        }
        withName(q) {
            return this.name = q, this
        }
        addAttribute(q, K) {
            return this.attributes[q] = K, this
        }
        addChildNode(q) {
            return this.children.push(q), this
        }
        removeAttribute(q) {
            return delete this.attributes[q], this
        }
        n(q) {
            return this.name = q, this
        }
        c(q) {
            return this.children.push(q), this
        }
        a(q, K) {
            if (K != null) this.attributes[q] = K;
            return this
        }
        cc(q, K, _ = K) {
            if (q[K] != null) {
                let z = Cc6.of(K, q[K]).withName(_);
                this.c(z)
            }
        }
        l(q, K, _, z) {
            if (q[K] != null) z().map((A) => {
                A.withName(_), this.c(A)
            })
        }
        lc(q, K, _, z) {
            if (q[K] != null) {
                let Y = z(),
                    A = new Cc6(_);
                Y.map((O) => {
                    A.c(O)
                }), this.c(A)
            }
        }
        toString() {
            let q = Boolean(this.children.length),
                K = `<${this.name}`,
                _ = this.attributes;
            for (let z of Object.keys(_)) {
                let Y = _[z];
                if (Y != null) K += ` ${z}="${GZ3(""+Y)}"`
            }
            return K += !q ? "/>" : `>${this.children.map((z)=>z.toString()).join("")}</${this.name}>`
        }
    }
    Object.defineProperty(gqq, "parseXML", {
        enumerable: !0,
        get: function() {
            return fZ3.parseXML
        }
    });
    gqq.XmlNode = Cc6;
    gqq.XmlText = nJ1
})