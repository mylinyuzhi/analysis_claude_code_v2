
// @from(Ln 81250, Col 4)
VOQ = U((WGG, KOQ) => {
  (() => {
    var A = {
        d: (UA, RA) => {
          for (var D1 in RA) A.o(RA, D1) && !A.o(UA, D1) && Object.defineProperty(UA, D1, {
            enumerable: !0,
            get: RA[D1]
          })
        },
        o: (UA, RA) => Object.prototype.hasOwnProperty.call(UA, RA),
        r: (UA) => {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(UA, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(UA, "__esModule", {
            value: !0
          })
        }
      },
      Q = {};
    A.r(Q), A.d(Q, {
      XMLBuilder: () => $1,
      XMLParser: () => S1,
      XMLValidator: () => b0
    });
    let B = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
      G = new RegExp("^[" + B + "][" + B + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");

    function Z(UA, RA) {
      let D1 = [],
        U1 = RA.exec(UA);
      for (; U1;) {
        let V1 = [];
        V1.startIndex = RA.lastIndex - U1[0].length;
        let H1 = U1.length;
        for (let Y0 = 0; Y0 < H1; Y0++) V1.push(U1[Y0]);
        D1.push(V1), U1 = RA.exec(UA)
      }
      return D1
    }
    let Y = function (UA) {
        return G.exec(UA) != null
      },
      J = {
        allowBooleanAttributes: !1,
        unpairedTags: []
      };

    function X(UA, RA) {
      RA = Object.assign({}, J, RA);
      let D1 = [],
        U1 = !1,
        V1 = !1;
      UA[0] === "\uFEFF" && (UA = UA.substr(1));
      for (let H1 = 0; H1 < UA.length; H1++)
        if (UA[H1] === "<" && UA[H1 + 1] === "?") {
          if (H1 += 2, H1 = D(UA, H1), H1.err) return H1
        } else {
          if (UA[H1] !== "<") {
            if (I(UA[H1])) continue;
            return $("InvalidChar", "char '" + UA[H1] + "' is not expected.", L(UA, H1))
          } {
            let Y0 = H1;
            if (H1++, UA[H1] === "!") {
              H1 = W(UA, H1);
              continue
            } {
              let c1 = !1;
              UA[H1] === "/" && (c1 = !0, H1++);
              let p0 = "";
              for (; H1 < UA.length && UA[H1] !== ">" && UA[H1] !== " " && UA[H1] !== "\t" && UA[H1] !== `
` && UA[H1] !== "\r"; H1++) p0 += UA[H1];
              if (p0 = p0.trim(), p0[p0.length - 1] === "/" && (p0 = p0.substring(0, p0.length - 1), H1--), !Y(p0)) {
                let AB;
                return AB = p0.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + p0 + "' is an invalid name.", $("InvalidTag", AB, L(UA, H1))
              }
              let HQ = F(UA, H1);
              if (HQ === !1) return $("InvalidAttr", "Attributes for '" + p0 + "' have open quote.", L(UA, H1));
              let nB = HQ.value;
              if (H1 = HQ.index, nB[nB.length - 1] === "/") {
                let AB = H1 - nB.length;
                nB = nB.substring(0, nB.length - 1);
                let RB = E(nB, RA);
                if (RB !== !0) return $(RB.err.code, RB.err.msg, L(UA, AB + RB.err.line));
                U1 = !0
              } else if (c1) {
                if (!HQ.tagClosed) return $("InvalidTag", "Closing tag '" + p0 + "' doesn't have proper closing.", L(UA, H1));
                if (nB.trim().length > 0) return $("InvalidTag", "Closing tag '" + p0 + "' can't have attributes or invalid starting.", L(UA, Y0));
                if (D1.length === 0) return $("InvalidTag", "Closing tag '" + p0 + "' has not been opened.", L(UA, Y0));
                {
                  let AB = D1.pop();
                  if (p0 !== AB.tagName) {
                    let RB = L(UA, AB.tagStartPos);
                    return $("InvalidTag", "Expected closing tag '" + AB.tagName + "' (opened in line " + RB.line + ", col " + RB.col + ") instead of closing tag '" + p0 + "'.", L(UA, Y0))
                  }
                  D1.length == 0 && (V1 = !0)
                }
              } else {
                let AB = E(nB, RA);
                if (AB !== !0) return $(AB.err.code, AB.err.msg, L(UA, H1 - nB.length + AB.err.line));
                if (V1 === !0) return $("InvalidXml", "Multiple possible root nodes found.", L(UA, H1));
                RA.unpairedTags.indexOf(p0) !== -1 || D1.push({
                  tagName: p0,
                  tagStartPos: Y0
                }), U1 = !0
              }
              for (H1++; H1 < UA.length; H1++)
                if (UA[H1] === "<") {
                  if (UA[H1 + 1] === "!") {
                    H1++, H1 = W(UA, H1);
                    continue
                  }
                  if (UA[H1 + 1] !== "?") break;
                  if (H1 = D(UA, ++H1), H1.err) return H1
                } else if (UA[H1] === "&") {
                let AB = z(UA, H1);
                if (AB == -1) return $("InvalidChar", "char '&' is not expected.", L(UA, H1));
                H1 = AB
              } else if (V1 === !0 && !I(UA[H1])) return $("InvalidXml", "Extra text at the end", L(UA, H1));
              UA[H1] === "<" && H1--
            }
          }
        } return U1 ? D1.length == 1 ? $("InvalidTag", "Unclosed tag '" + D1[0].tagName + "'.", L(UA, D1[0].tagStartPos)) : !(D1.length > 0) || $("InvalidXml", "Invalid '" + JSON.stringify(D1.map((H1) => H1.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
        line: 1,
        col: 1
      }) : $("InvalidXml", "Start tag expected.", 1)
    }

    function I(UA) {
      return UA === " " || UA === "\t" || UA === `
` || UA === "\r"
    }

    function D(UA, RA) {
      let D1 = RA;
      for (; RA < UA.length; RA++)
        if (UA[RA] != "?" && UA[RA] != " ");
        else {
          let U1 = UA.substr(D1, RA - D1);
          if (RA > 5 && U1 === "xml") return $("InvalidXml", "XML declaration allowed only at the start of the document.", L(UA, RA));
          if (UA[RA] == "?" && UA[RA + 1] == ">") {
            RA++;
            break
          }
        } return RA
    }

    function W(UA, RA) {
      if (UA.length > RA + 5 && UA[RA + 1] === "-" && UA[RA + 2] === "-") {
        for (RA += 3; RA < UA.length; RA++)
          if (UA[RA] === "-" && UA[RA + 1] === "-" && UA[RA + 2] === ">") {
            RA += 2;
            break
          }
      } else if (UA.length > RA + 8 && UA[RA + 1] === "D" && UA[RA + 2] === "O" && UA[RA + 3] === "C" && UA[RA + 4] === "T" && UA[RA + 5] === "Y" && UA[RA + 6] === "P" && UA[RA + 7] === "E") {
        let D1 = 1;
        for (RA += 8; RA < UA.length; RA++)
          if (UA[RA] === "<") D1++;
          else if (UA[RA] === ">" && (D1--, D1 === 0)) break
      } else if (UA.length > RA + 9 && UA[RA + 1] === "[" && UA[RA + 2] === "C" && UA[RA + 3] === "D" && UA[RA + 4] === "A" && UA[RA + 5] === "T" && UA[RA + 6] === "A" && UA[RA + 7] === "[") {
        for (RA += 8; RA < UA.length; RA++)
          if (UA[RA] === "]" && UA[RA + 1] === "]" && UA[RA + 2] === ">") {
            RA += 2;
            break
          }
      }
      return RA
    }
    let K = '"',
      V = "'";

    function F(UA, RA) {
      let D1 = "",
        U1 = "",
        V1 = !1;
      for (; RA < UA.length; RA++) {
        if (UA[RA] === K || UA[RA] === V) U1 === "" ? U1 = UA[RA] : U1 !== UA[RA] || (U1 = "");
        else if (UA[RA] === ">" && U1 === "") {
          V1 = !0;
          break
        }
        D1 += UA[RA]
      }
      return U1 === "" && {
        value: D1,
        index: RA,
        tagClosed: V1
      }
    }
    let H = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");

    function E(UA, RA) {
      let D1 = Z(UA, H),
        U1 = {};
      for (let V1 = 0; V1 < D1.length; V1++) {
        if (D1[V1][1].length === 0) return $("InvalidAttr", "Attribute '" + D1[V1][2] + "' has no space in starting.", M(D1[V1]));
        if (D1[V1][3] !== void 0 && D1[V1][4] === void 0) return $("InvalidAttr", "Attribute '" + D1[V1][2] + "' is without value.", M(D1[V1]));
        if (D1[V1][3] === void 0 && !RA.allowBooleanAttributes) return $("InvalidAttr", "boolean attribute '" + D1[V1][2] + "' is not allowed.", M(D1[V1]));
        let H1 = D1[V1][2];
        if (!O(H1)) return $("InvalidAttr", "Attribute '" + H1 + "' is an invalid name.", M(D1[V1]));
        if (U1.hasOwnProperty(H1)) return $("InvalidAttr", "Attribute '" + H1 + "' is repeated.", M(D1[V1]));
        U1[H1] = 1
      }
      return !0
    }

    function z(UA, RA) {
      if (UA[++RA] === ";") return -1;
      if (UA[RA] === "#") return function (U1, V1) {
        let H1 = /\d/;
        for (U1[V1] === "x" && (V1++, H1 = /[\da-fA-F]/); V1 < U1.length; V1++) {
          if (U1[V1] === ";") return V1;
          if (!U1[V1].match(H1)) break
        }
        return -1
      }(UA, ++RA);
      let D1 = 0;
      for (; RA < UA.length; RA++, D1++)
        if (!(UA[RA].match(/\w/) && D1 < 20)) {
          if (UA[RA] === ";") break;
          return -1
        } return RA
    }

    function $(UA, RA, D1) {
      return {
        err: {
          code: UA,
          msg: RA,
          line: D1.line || D1,
          col: D1.col
        }
      }
    }

    function O(UA) {
      return Y(UA)
    }

    function L(UA, RA) {
      let D1 = UA.substring(0, RA).split(/\r?\n/);
      return {
        line: D1.length,
        col: D1[D1.length - 1].length + 1
      }
    }

    function M(UA) {
      return UA.startIndex + UA[1].length
    }
    let _ = {
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
        tagValueProcessor: function (UA, RA) {
          return RA
        },
        attributeValueProcessor: function (UA, RA) {
          return RA
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
        updateTag: function (UA, RA, D1) {
          return UA
        },
        captureMetaData: !1
      },
      j;
    j = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");
    class x {
      constructor(UA) {
        this.tagname = UA, this.child = [], this[":@"] = {}
      }
      add(UA, RA) {
        UA === "__proto__" && (UA = "#__proto__"), this.child.push({
          [UA]: RA
        })
      }
      addChild(UA, RA) {
        UA.tagname === "__proto__" && (UA.tagname = "#__proto__"), UA[":@"] && Object.keys(UA[":@"]).length > 0 ? this.child.push({
          [UA.tagname]: UA.child,
          ":@": UA[":@"]
        }) : this.child.push({
          [UA.tagname]: UA.child
        }), RA !== void 0 && (this.child[this.child.length - 1][j] = {
          startIndex: RA
        })
      }
      static getMetaDataSymbol() {
        return j
      }
    }

    function b(UA, RA) {
      let D1 = {};
      if (UA[RA + 3] !== "O" || UA[RA + 4] !== "C" || UA[RA + 5] !== "T" || UA[RA + 6] !== "Y" || UA[RA + 7] !== "P" || UA[RA + 8] !== "E") throw Error("Invalid Tag instead of DOCTYPE");
      {
        RA += 9;
        let U1 = 1,
          V1 = !1,
          H1 = !1,
          Y0 = "";
        for (; RA < UA.length; RA++)
          if (UA[RA] !== "<" || H1)
            if (UA[RA] === ">") {
              if (H1 ? UA[RA - 1] === "-" && UA[RA - 2] === "-" && (H1 = !1, U1--) : U1--, U1 === 0) break
            } else UA[RA] === "[" ? V1 = !0 : Y0 += UA[RA];
        else {
          if (V1 && y(UA, "!ENTITY", RA)) {
            let c1, p0;
            RA += 7, [c1, p0, RA] = u(UA, RA + 1), p0.indexOf("&") === -1 && (D1[c1] = {
              regx: RegExp(`&${c1};`, "g"),
              val: p0
            })
          } else if (V1 && y(UA, "!ELEMENT", RA)) {
            RA += 8;
            let {
              index: c1
            } = n(UA, RA + 1);
            RA = c1
          } else if (V1 && y(UA, "!ATTLIST", RA)) RA += 8;
          else if (V1 && y(UA, "!NOTATION", RA)) {
            RA += 9;
            let {
              index: c1
            } = f(UA, RA + 1);
            RA = c1
          } else {
            if (!y(UA, "!--", RA)) throw Error("Invalid DOCTYPE");
            H1 = !0
          }
          U1++, Y0 = ""
        }
        if (U1 !== 0) throw Error("Unclosed DOCTYPE")
      }
      return {
        entities: D1,
        i: RA
      }
    }
    let S = (UA, RA) => {
      for (; RA < UA.length && /\s/.test(UA[RA]);) RA++;
      return RA
    };

    function u(UA, RA) {
      RA = S(UA, RA);
      let D1 = "";
      for (; RA < UA.length && !/\s/.test(UA[RA]) && UA[RA] !== '"' && UA[RA] !== "'";) D1 += UA[RA], RA++;
      if (p(D1), RA = S(UA, RA), UA.substring(RA, RA + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
      if (UA[RA] === "%") throw Error("Parameter entities are not supported");
      let U1 = "";
      return [RA, U1] = AA(UA, RA, "entity"), [D1, U1, --RA]
    }

    function f(UA, RA) {
      RA = S(UA, RA);
      let D1 = "";
      for (; RA < UA.length && !/\s/.test(UA[RA]);) D1 += UA[RA], RA++;
      p(D1), RA = S(UA, RA);
      let U1 = UA.substring(RA, RA + 6).toUpperCase();
      if (U1 !== "SYSTEM" && U1 !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${U1}"`);
      RA += U1.length, RA = S(UA, RA);
      let V1 = null,
        H1 = null;
      if (U1 === "PUBLIC")[RA, V1] = AA(UA, RA, "publicIdentifier"), UA[RA = S(UA, RA)] !== '"' && UA[RA] !== "'" || ([RA, H1] = AA(UA, RA, "systemIdentifier"));
      else if (U1 === "SYSTEM" && ([RA, H1] = AA(UA, RA, "systemIdentifier"), !H1)) throw Error("Missing mandatory system identifier for SYSTEM notation");
      return {
        notationName: D1,
        publicIdentifier: V1,
        systemIdentifier: H1,
        index: --RA
      }
    }

    function AA(UA, RA, D1) {
      let U1 = "",
        V1 = UA[RA];
      if (V1 !== '"' && V1 !== "'") throw Error(`Expected quoted string, found "${V1}"`);
      for (RA++; RA < UA.length && UA[RA] !== V1;) U1 += UA[RA], RA++;
      if (UA[RA] !== V1) throw Error(`Unterminated ${D1} value`);
      return [++RA, U1]
    }

    function n(UA, RA) {
      RA = S(UA, RA);
      let D1 = "";
      for (; RA < UA.length && !/\s/.test(UA[RA]);) D1 += UA[RA], RA++;
      if (!p(D1)) throw Error(`Invalid element name: "${D1}"`);
      let U1 = "";
      if (UA[RA = S(UA, RA)] === "E" && y(UA, "MPTY", RA)) RA += 4;
      else if (UA[RA] === "A" && y(UA, "NY", RA)) RA += 2;
      else {
        if (UA[RA] !== "(") throw Error(`Invalid Element Expression, found "${UA[RA]}"`);
        for (RA++; RA < UA.length && UA[RA] !== ")";) U1 += UA[RA], RA++;
        if (UA[RA] !== ")") throw Error("Unterminated content model")
      }
      return {
        elementName: D1,
        contentModel: U1.trim(),
        index: RA
      }
    }

    function y(UA, RA, D1) {
      for (let U1 = 0; U1 < RA.length; U1++)
        if (RA[U1] !== UA[D1 + U1 + 1]) return !1;
      return !0
    }

    function p(UA) {
      if (Y(UA)) return UA;
      throw Error(`Invalid entity name ${UA}`)
    }
    let GA = /^[-+]?0x[a-fA-F0-9]+$/,
      WA = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
      MA = {
        hex: !0,
        leadingZeros: !0,
        decimalPoint: ".",
        eNotation: !0
      },
      TA = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;

    function bA(UA) {
      return typeof UA == "function" ? UA : Array.isArray(UA) ? (RA) => {
        for (let D1 of UA) {
          if (typeof D1 == "string" && RA === D1) return !0;
          if (D1 instanceof RegExp && D1.test(RA)) return !0
        }
      } : () => !1
    }
    class jA {
      constructor(UA) {
        this.options = UA, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
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
            val: (RA, D1) => String.fromCodePoint(Number.parseInt(D1, 10))
          },
          num_hex: {
            regex: /&#x([0-9a-fA-F]{1,6});/g,
            val: (RA, D1) => String.fromCodePoint(Number.parseInt(D1, 16))
          }
        }, this.addExternalEntities = OA, this.parseXml = wA, this.parseTextData = IA, this.resolveNameSpace = HA, this.buildAttributesMap = zA, this.isItStopNode = BA, this.replaceEntitiesValue = s, this.readStopNodeData = FA, this.saveTextToParentTag = t, this.addChild = _A, this.ignoreAttributesFn = bA(this.options.ignoreAttributes)
      }
    }

    function OA(UA) {
      let RA = Object.keys(UA);
      for (let D1 = 0; D1 < RA.length; D1++) {
        let U1 = RA[D1];
        this.lastEntities[U1] = {
          regex: new RegExp("&" + U1 + ";", "g"),
          val: UA[U1]
        }
      }
    }

    function IA(UA, RA, D1, U1, V1, H1, Y0) {
      if (UA !== void 0 && (this.options.trimValues && !U1 && (UA = UA.trim()), UA.length > 0)) {
        Y0 || (UA = this.replaceEntitiesValue(UA));
        let c1 = this.options.tagValueProcessor(RA, UA, D1, V1, H1);
        return c1 == null ? UA : typeof c1 != typeof UA || c1 !== UA ? c1 : this.options.trimValues || UA.trim() === UA ? xA(UA, this.options.parseTagValue, this.options.numberParseOptions) : UA
      }
    }

    function HA(UA) {
      if (this.options.removeNSPrefix) {
        let RA = UA.split(":"),
          D1 = UA.charAt(0) === "/" ? "/" : "";
        if (RA[0] === "xmlns") return "";
        RA.length === 2 && (UA = D1 + RA[1])
      }
      return UA
    }
    let ZA = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");

    function zA(UA, RA, D1) {
      if (this.options.ignoreAttributes !== !0 && typeof UA == "string") {
        let U1 = Z(UA, ZA),
          V1 = U1.length,
          H1 = {};
        for (let Y0 = 0; Y0 < V1; Y0++) {
          let c1 = this.resolveNameSpace(U1[Y0][1]);
          if (this.ignoreAttributesFn(c1, RA)) continue;
          let p0 = U1[Y0][4],
            HQ = this.options.attributeNamePrefix + c1;
          if (c1.length)
            if (this.options.transformAttributeName && (HQ = this.options.transformAttributeName(HQ)), HQ === "__proto__" && (HQ = "#__proto__"), p0 !== void 0) {
              this.options.trimValues && (p0 = p0.trim()), p0 = this.replaceEntitiesValue(p0);
              let nB = this.options.attributeValueProcessor(c1, p0, RA);
              H1[HQ] = nB == null ? p0 : typeof nB != typeof p0 || nB !== p0 ? nB : xA(p0, this.options.parseAttributeValue, this.options.numberParseOptions)
            } else this.options.allowBooleanAttributes && (H1[HQ] = !0)
        }
        if (!Object.keys(H1).length) return;
        if (this.options.attributesGroupName) {
          let Y0 = {};
          return Y0[this.options.attributesGroupName] = H1, Y0
        }
        return H1
      }
    }
    let wA = function (UA) {
      UA = UA.replace(/\r\n?/g, `
`);
      let RA = new x("!xml"),
        D1 = RA,
        U1 = "",
        V1 = "";
      for (let H1 = 0; H1 < UA.length; H1++)
        if (UA[H1] === "<")
          if (UA[H1 + 1] === "/") {
            let Y0 = DA(UA, ">", H1, "Closing Tag is not closed."),
              c1 = UA.substring(H1 + 2, Y0).trim();
            if (this.options.removeNSPrefix) {
              let nB = c1.indexOf(":");
              nB !== -1 && (c1 = c1.substr(nB + 1))
            }
            this.options.transformTagName && (c1 = this.options.transformTagName(c1)), D1 && (U1 = this.saveTextToParentTag(U1, D1, V1));
            let p0 = V1.substring(V1.lastIndexOf(".") + 1);
            if (c1 && this.options.unpairedTags.indexOf(c1) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${c1}>`);
            let HQ = 0;
            p0 && this.options.unpairedTags.indexOf(p0) !== -1 ? (HQ = V1.lastIndexOf(".", V1.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : HQ = V1.lastIndexOf("."), V1 = V1.substring(0, HQ), D1 = this.tagsNodeStack.pop(), U1 = "", H1 = Y0
          } else if (UA[H1 + 1] === "?") {
        let Y0 = CA(UA, H1, !1, "?>");
        if (!Y0) throw Error("Pi Tag is not closed.");
        if (U1 = this.saveTextToParentTag(U1, D1, V1), this.options.ignoreDeclaration && Y0.tagName === "?xml" || this.options.ignorePiTags);
        else {
          let c1 = new x(Y0.tagName);
          c1.add(this.options.textNodeName, ""), Y0.tagName !== Y0.tagExp && Y0.attrExpPresent && (c1[":@"] = this.buildAttributesMap(Y0.tagExp, V1, Y0.tagName)), this.addChild(D1, c1, V1, H1)
        }
        H1 = Y0.closeIndex + 1
      } else if (UA.substr(H1 + 1, 3) === "!--") {
        let Y0 = DA(UA, "-->", H1 + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          let c1 = UA.substring(H1 + 4, Y0 - 2);
          U1 = this.saveTextToParentTag(U1, D1, V1), D1.add(this.options.commentPropName, [{
            [this.options.textNodeName]: c1
          }])
        }
        H1 = Y0
      } else if (UA.substr(H1 + 1, 2) === "!D") {
        let Y0 = b(UA, H1);
        this.docTypeEntities = Y0.entities, H1 = Y0.i
      } else if (UA.substr(H1 + 1, 2) === "![") {
        let Y0 = DA(UA, "]]>", H1, "CDATA is not closed.") - 2,
          c1 = UA.substring(H1 + 9, Y0);
        U1 = this.saveTextToParentTag(U1, D1, V1);
        let p0 = this.parseTextData(c1, D1.tagname, V1, !0, !1, !0, !0);
        p0 == null && (p0 = ""), this.options.cdataPropName ? D1.add(this.options.cdataPropName, [{
          [this.options.textNodeName]: c1
        }]) : D1.add(this.options.textNodeName, p0), H1 = Y0 + 2
      } else {
        let Y0 = CA(UA, H1, this.options.removeNSPrefix),
          c1 = Y0.tagName,
          p0 = Y0.rawTagName,
          HQ = Y0.tagExp,
          nB = Y0.attrExpPresent,
          AB = Y0.closeIndex;
        this.options.transformTagName && (c1 = this.options.transformTagName(c1)), D1 && U1 && D1.tagname !== "!xml" && (U1 = this.saveTextToParentTag(U1, D1, V1, !1));
        let RB = D1;
        RB && this.options.unpairedTags.indexOf(RB.tagname) !== -1 && (D1 = this.tagsNodeStack.pop(), V1 = V1.substring(0, V1.lastIndexOf("."))), c1 !== RA.tagname && (V1 += V1 ? "." + c1 : c1);
        let C9 = H1;
        if (this.isItStopNode(this.options.stopNodes, V1, c1)) {
          let vB = "";
          if (HQ.length > 0 && HQ.lastIndexOf("/") === HQ.length - 1) c1[c1.length - 1] === "/" ? (c1 = c1.substr(0, c1.length - 1), V1 = V1.substr(0, V1.length - 1), HQ = c1) : HQ = HQ.substr(0, HQ.length - 1), H1 = Y0.closeIndex;
          else if (this.options.unpairedTags.indexOf(c1) !== -1) H1 = Y0.closeIndex;
          else {
            let F9 = this.readStopNodeData(UA, p0, AB + 1);
            if (!F9) throw Error(`Unexpected end of ${p0}`);
            H1 = F9.i, vB = F9.tagContent
          }
          let c2 = new x(c1);
          c1 !== HQ && nB && (c2[":@"] = this.buildAttributesMap(HQ, V1, c1)), vB && (vB = this.parseTextData(vB, c1, V1, !0, nB, !0, !0)), V1 = V1.substr(0, V1.lastIndexOf(".")), c2.add(this.options.textNodeName, vB), this.addChild(D1, c2, V1, C9)
        } else {
          if (HQ.length > 0 && HQ.lastIndexOf("/") === HQ.length - 1) {
            c1[c1.length - 1] === "/" ? (c1 = c1.substr(0, c1.length - 1), V1 = V1.substr(0, V1.length - 1), HQ = c1) : HQ = HQ.substr(0, HQ.length - 1), this.options.transformTagName && (c1 = this.options.transformTagName(c1));
            let vB = new x(c1);
            c1 !== HQ && nB && (vB[":@"] = this.buildAttributesMap(HQ, V1, c1)), this.addChild(D1, vB, V1, C9), V1 = V1.substr(0, V1.lastIndexOf("."))
          } else {
            let vB = new x(c1);
            this.tagsNodeStack.push(D1), c1 !== HQ && nB && (vB[":@"] = this.buildAttributesMap(HQ, V1, c1)), this.addChild(D1, vB, V1, C9), D1 = vB
          }
          U1 = "", H1 = AB
        }
      } else U1 += UA[H1];
      return RA.child
    };

    function _A(UA, RA, D1, U1) {
      this.options.captureMetaData || (U1 = void 0);
      let V1 = this.options.updateTag(RA.tagname, D1, RA[":@"]);
      V1 === !1 || (typeof V1 == "string" ? (RA.tagname = V1, UA.addChild(RA, U1)) : UA.addChild(RA, U1))
    }
    let s = function (UA) {
      if (this.options.processEntities) {
        for (let RA in this.docTypeEntities) {
          let D1 = this.docTypeEntities[RA];
          UA = UA.replace(D1.regx, D1.val)
        }
        for (let RA in this.lastEntities) {
          let D1 = this.lastEntities[RA];
          UA = UA.replace(D1.regex, D1.val)
        }
        if (this.options.htmlEntities)
          for (let RA in this.htmlEntities) {
            let D1 = this.htmlEntities[RA];
            UA = UA.replace(D1.regex, D1.val)
          }
        UA = UA.replace(this.ampEntity.regex, this.ampEntity.val)
      }
      return UA
    };

    function t(UA, RA, D1, U1) {
      return UA && (U1 === void 0 && (U1 = RA.child.length === 0), (UA = this.parseTextData(UA, RA.tagname, D1, !1, !!RA[":@"] && Object.keys(RA[":@"]).length !== 0, U1)) !== void 0 && UA !== "" && RA.add(this.options.textNodeName, UA), UA = ""), UA
    }

    function BA(UA, RA, D1) {
      let U1 = "*." + D1;
      for (let V1 in UA) {
        let H1 = UA[V1];
        if (U1 === H1 || RA === H1) return !0
      }
      return !1
    }

    function DA(UA, RA, D1, U1) {
      let V1 = UA.indexOf(RA, D1);
      if (V1 === -1) throw Error(U1);
      return V1 + RA.length - 1
    }

    function CA(UA, RA, D1, U1 = ">") {
      let V1 = function (AB, RB, C9 = ">") {
        let vB, c2 = "";
        for (let F9 = RB; F9 < AB.length; F9++) {
          let m3 = AB[F9];
          if (vB) m3 === vB && (vB = "");
          else if (m3 === '"' || m3 === "'") vB = m3;
          else if (m3 === C9[0]) {
            if (!C9[1]) return {
              data: c2,
              index: F9
            };
            if (AB[F9 + 1] === C9[1]) return {
              data: c2,
              index: F9
            }
          } else m3 === "\t" && (m3 = " ");
          c2 += m3
        }
      }(UA, RA + 1, U1);
      if (!V1) return;
      let {
        data: H1,
        index: Y0
      } = V1, c1 = H1.search(/\s/), p0 = H1, HQ = !0;
      c1 !== -1 && (p0 = H1.substring(0, c1), H1 = H1.substring(c1 + 1).trimStart());
      let nB = p0;
      if (D1) {
        let AB = p0.indexOf(":");
        AB !== -1 && (p0 = p0.substr(AB + 1), HQ = p0 !== V1.data.substr(AB + 1))
      }
      return {
        tagName: p0,
        tagExp: H1,
        closeIndex: Y0,
        attrExpPresent: HQ,
        rawTagName: nB
      }
    }

    function FA(UA, RA, D1) {
      let U1 = D1,
        V1 = 1;
      for (; D1 < UA.length; D1++)
        if (UA[D1] === "<")
          if (UA[D1 + 1] === "/") {
            let H1 = DA(UA, ">", D1, `${RA} is not closed`);
            if (UA.substring(D1 + 2, H1).trim() === RA && (V1--, V1 === 0)) return {
              tagContent: UA.substring(U1, D1),
              i: H1
            };
            D1 = H1
          } else if (UA[D1 + 1] === "?") D1 = DA(UA, "?>", D1 + 1, "StopNode is not closed.");
      else if (UA.substr(D1 + 1, 3) === "!--") D1 = DA(UA, "-->", D1 + 3, "StopNode is not closed.");
      else if (UA.substr(D1 + 1, 2) === "![") D1 = DA(UA, "]]>", D1, "StopNode is not closed.") - 2;
      else {
        let H1 = CA(UA, D1, ">");
        H1 && ((H1 && H1.tagName) === RA && H1.tagExp[H1.tagExp.length - 1] !== "/" && V1++, D1 = H1.closeIndex)
      }
    }

    function xA(UA, RA, D1) {
      if (RA && typeof UA == "string") {
        let U1 = UA.trim();
        return U1 === "true" || U1 !== "false" && function (V1, H1 = {}) {
          if (H1 = Object.assign({}, MA, H1), !V1 || typeof V1 != "string") return V1;
          let Y0 = V1.trim();
          if (H1.skipLike !== void 0 && H1.skipLike.test(Y0)) return V1;
          if (V1 === "0") return 0;
          if (H1.hex && GA.test(Y0)) return function (p0) {
            if (parseInt) return parseInt(p0, 16);
            if (Number.parseInt) return Number.parseInt(p0, 16);
            if (window && window.parseInt) return window.parseInt(p0, 16);
            throw Error("parseInt, Number.parseInt, window.parseInt are not supported")
          }(Y0);
          if (Y0.search(/.+[eE].+/) !== -1) return function (p0, HQ, nB) {
            if (!nB.eNotation) return p0;
            let AB = HQ.match(TA);
            if (AB) {
              let RB = AB[1] || "",
                C9 = AB[3].indexOf("e") === -1 ? "E" : "e",
                vB = AB[2],
                c2 = RB ? p0[vB.length + 1] === C9 : p0[vB.length] === C9;
              return vB.length > 1 && c2 ? p0 : vB.length !== 1 || !AB[3].startsWith(`.${C9}`) && AB[3][0] !== C9 ? nB.leadingZeros && !c2 ? (HQ = (AB[1] || "") + AB[3], Number(HQ)) : p0 : Number(HQ)
            }
            return p0
          }(V1, Y0, H1);
          {
            let p0 = WA.exec(Y0);
            if (p0) {
              let HQ = p0[1] || "",
                nB = p0[2],
                AB = (c1 = p0[3]) && c1.indexOf(".") !== -1 ? ((c1 = c1.replace(/0+$/, "")) === "." ? c1 = "0" : c1[0] === "." ? c1 = "0" + c1 : c1[c1.length - 1] === "." && (c1 = c1.substring(0, c1.length - 1)), c1) : c1,
                RB = HQ ? V1[nB.length + 1] === "." : V1[nB.length] === ".";
              if (!H1.leadingZeros && (nB.length > 1 || nB.length === 1 && !RB)) return V1;
              {
                let C9 = Number(Y0),
                  vB = String(C9);
                if (C9 === 0 || C9 === -0) return C9;
                if (vB.search(/[eE]/) !== -1) return H1.eNotation ? C9 : V1;
                if (Y0.indexOf(".") !== -1) return vB === "0" || vB === AB || vB === `${HQ}${AB}` ? C9 : V1;
                let c2 = nB ? AB : Y0;
                return nB ? c2 === vB || HQ + c2 === vB ? C9 : V1 : c2 === vB || c2 === HQ + vB ? C9 : V1
              }
            }
            return V1
          }
          var c1
        }(UA, D1)
      }
      return UA !== void 0 ? UA : ""
    }
    let mA = x.getMetaDataSymbol();

    function G1(UA, RA) {
      return J1(UA, RA)
    }

    function J1(UA, RA, D1) {
      let U1, V1 = {};
      for (let H1 = 0; H1 < UA.length; H1++) {
        let Y0 = UA[H1],
          c1 = SA(Y0),
          p0 = "";
        if (p0 = D1 === void 0 ? c1 : D1 + "." + c1, c1 === RA.textNodeName) U1 === void 0 ? U1 = Y0[c1] : U1 += "" + Y0[c1];
        else {
          if (c1 === void 0) continue;
          if (Y0[c1]) {
            let HQ = J1(Y0[c1], RA, p0),
              nB = n1(HQ, RA);
            Y0[mA] !== void 0 && (HQ[mA] = Y0[mA]), Y0[":@"] ? A1(HQ, Y0[":@"], p0, RA) : Object.keys(HQ).length !== 1 || HQ[RA.textNodeName] === void 0 || RA.alwaysCreateTextNode ? Object.keys(HQ).length === 0 && (RA.alwaysCreateTextNode ? HQ[RA.textNodeName] = "" : HQ = "") : HQ = HQ[RA.textNodeName], V1[c1] !== void 0 && V1.hasOwnProperty(c1) ? (Array.isArray(V1[c1]) || (V1[c1] = [V1[c1]]), V1[c1].push(HQ)) : RA.isArray(c1, p0, nB) ? V1[c1] = [HQ] : V1[c1] = HQ
          }
        }
      }
      return typeof U1 == "string" ? U1.length > 0 && (V1[RA.textNodeName] = U1) : U1 !== void 0 && (V1[RA.textNodeName] = U1), V1
    }

    function SA(UA) {
      let RA = Object.keys(UA);
      for (let D1 = 0; D1 < RA.length; D1++) {
        let U1 = RA[D1];
        if (U1 !== ":@") return U1
      }
    }

    function A1(UA, RA, D1, U1) {
      if (RA) {
        let V1 = Object.keys(RA),
          H1 = V1.length;
        for (let Y0 = 0; Y0 < H1; Y0++) {
          let c1 = V1[Y0];
          U1.isArray(c1, D1 + "." + c1, !0, !0) ? UA[c1] = [RA[c1]] : UA[c1] = RA[c1]
        }
      }
    }

    function n1(UA, RA) {
      let {
        textNodeName: D1
      } = RA, U1 = Object.keys(UA).length;
      return U1 === 0 || !(U1 !== 1 || !UA[D1] && typeof UA[D1] != "boolean" && UA[D1] !== 0)
    }
    class S1 {
      constructor(UA) {
        this.externalEntities = {}, this.options = function (RA) {
          return Object.assign({}, _, RA)
        }(UA)
      }
      parse(UA, RA) {
        if (typeof UA == "string");
        else {
          if (!UA.toString) throw Error("XML data is accepted in String or Bytes[] form.");
          UA = UA.toString()
        }
        if (RA) {
          RA === !0 && (RA = {});
          let V1 = X(UA, RA);
          if (V1 !== !0) throw Error(`${V1.err.msg}:${V1.err.line}:${V1.err.col}`)
        }
        let D1 = new jA(this.options);
        D1.addExternalEntities(this.externalEntities);
        let U1 = D1.parseXml(UA);
        return this.options.preserveOrder || U1 === void 0 ? U1 : G1(U1, this.options)
      }
      addEntity(UA, RA) {
        if (RA.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
        if (UA.indexOf("&") !== -1 || UA.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        if (RA === "&") throw Error("An entity with value '&' is not permitted");
        this.externalEntities[UA] = RA
      }
      static getMetaDataSymbol() {
        return x.getMetaDataSymbol()
      }
    }

    function L0(UA, RA) {
      let D1 = "";
      return RA.format && RA.indentBy.length > 0 && (D1 = `
`), VQ(UA, RA, "", D1)
    }

    function VQ(UA, RA, D1, U1) {
      let V1 = "",
        H1 = !1;
      for (let Y0 = 0; Y0 < UA.length; Y0++) {
        let c1 = UA[Y0],
          p0 = t0(c1);
        if (p0 === void 0) continue;
        let HQ = "";
        if (HQ = D1.length === 0 ? p0 : `${D1}.${p0}`, p0 === RA.textNodeName) {
          let C9 = c1[p0];
          y1(HQ, RA) || (C9 = RA.tagValueProcessor(p0, C9), C9 = qQ(C9, RA)), H1 && (V1 += U1), V1 += C9, H1 = !1;
          continue
        }
        if (p0 === RA.cdataPropName) {
          H1 && (V1 += U1), V1 += `<![CDATA[${c1[p0][0][RA.textNodeName]}]]>`, H1 = !1;
          continue
        }
        if (p0 === RA.commentPropName) {
          V1 += U1 + `<!--${c1[p0][0][RA.textNodeName]}-->`, H1 = !0;
          continue
        }
        if (p0[0] === "?") {
          let C9 = QQ(c1[":@"], RA),
            vB = p0 === "?xml" ? "" : U1,
            c2 = c1[p0][0][RA.textNodeName];
          c2 = c2.length !== 0 ? " " + c2 : "", V1 += vB + `<${p0}${c2}${C9}?>`, H1 = !0;
          continue
        }
        let nB = U1;
        nB !== "" && (nB += RA.indentBy);
        let AB = U1 + `<${p0}${QQ(c1[":@"],RA)}`,
          RB = VQ(c1[p0], RA, HQ, nB);
        RA.unpairedTags.indexOf(p0) !== -1 ? RA.suppressUnpairedNode ? V1 += AB + ">" : V1 += AB + "/>" : RB && RB.length !== 0 || !RA.suppressEmptyNode ? RB && RB.endsWith(">") ? V1 += AB + `>${RB}${U1}</${p0}>` : (V1 += AB + ">", RB && U1 !== "" && (RB.includes("/>") || RB.includes("</")) ? V1 += U1 + RA.indentBy + RB + U1 : V1 += RB, V1 += `</${p0}>`) : V1 += AB + "/>", H1 = !0
      }
      return V1
    }

    function t0(UA) {
      let RA = Object.keys(UA);
      for (let D1 = 0; D1 < RA.length; D1++) {
        let U1 = RA[D1];
        if (UA.hasOwnProperty(U1) && U1 !== ":@") return U1
      }
    }

    function QQ(UA, RA) {
      let D1 = "";
      if (UA && !RA.ignoreAttributes)
        for (let U1 in UA) {
          if (!UA.hasOwnProperty(U1)) continue;
          let V1 = RA.attributeValueProcessor(U1, UA[U1]);
          V1 = qQ(V1, RA), V1 === !0 && RA.suppressBooleanAttributes ? D1 += ` ${U1.substr(RA.attributeNamePrefix.length)}` : D1 += ` ${U1.substr(RA.attributeNamePrefix.length)}="${V1}"`
        }
      return D1
    }

    function y1(UA, RA) {
      let D1 = (UA = UA.substr(0, UA.length - RA.textNodeName.length - 1)).substr(UA.lastIndexOf(".") + 1);
      for (let U1 in RA.stopNodes)
        if (RA.stopNodes[U1] === UA || RA.stopNodes[U1] === "*." + D1) return !0;
      return !1
    }

    function qQ(UA, RA) {
      if (UA && UA.length > 0 && RA.processEntities)
        for (let D1 = 0; D1 < RA.entities.length; D1++) {
          let U1 = RA.entities[D1];
          UA = UA.replace(U1.regex, U1.val)
        }
      return UA
    }
    let K1 = {
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
      tagValueProcessor: function (UA, RA) {
        return RA
      },
      attributeValueProcessor: function (UA, RA) {
        return RA
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

    function $1(UA) {
      this.options = Object.assign({}, K1, UA), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function () {
        return !1
      } : (this.ignoreAttributesFn = bA(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = c0), this.processTextOrObjNode = i1, this.options.format ? (this.indentate = Q0, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function () {
        return ""
      }, this.tagEndChar = ">", this.newLine = "")
    }

    function i1(UA, RA, D1, U1) {
      let V1 = this.j2x(UA, D1 + 1, U1.concat(RA));
      return UA[this.options.textNodeName] !== void 0 && Object.keys(UA).length === 1 ? this.buildTextValNode(UA[this.options.textNodeName], RA, V1.attrStr, D1) : this.buildObjectNode(V1.val, RA, V1.attrStr, D1)
    }

    function Q0(UA) {
      return this.options.indentBy.repeat(UA)
    }

    function c0(UA) {
      return !(!UA.startsWith(this.options.attributeNamePrefix) || UA === this.options.textNodeName) && UA.substr(this.attrPrefixLen)
    }
    $1.prototype.build = function (UA) {
      return this.options.preserveOrder ? L0(UA, this.options) : (Array.isArray(UA) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (UA = {
        [this.options.arrayNodeName]: UA
      }), this.j2x(UA, 0, []).val)
    }, $1.prototype.j2x = function (UA, RA, D1) {
      let U1 = "",
        V1 = "",
        H1 = D1.join(".");
      for (let Y0 in UA)
        if (Object.prototype.hasOwnProperty.call(UA, Y0))
          if (UA[Y0] === void 0) this.isAttribute(Y0) && (V1 += "");
          else if (UA[Y0] === null) this.isAttribute(Y0) || Y0 === this.options.cdataPropName ? V1 += "" : Y0[0] === "?" ? V1 += this.indentate(RA) + "<" + Y0 + "?" + this.tagEndChar : V1 += this.indentate(RA) + "<" + Y0 + "/" + this.tagEndChar;
      else if (UA[Y0] instanceof Date) V1 += this.buildTextValNode(UA[Y0], Y0, "", RA);
      else if (typeof UA[Y0] != "object") {
        let c1 = this.isAttribute(Y0);
        if (c1 && !this.ignoreAttributesFn(c1, H1)) U1 += this.buildAttrPairStr(c1, "" + UA[Y0]);
        else if (!c1)
          if (Y0 === this.options.textNodeName) {
            let p0 = this.options.tagValueProcessor(Y0, "" + UA[Y0]);
            V1 += this.replaceEntitiesValue(p0)
          } else V1 += this.buildTextValNode(UA[Y0], Y0, "", RA)
      } else if (Array.isArray(UA[Y0])) {
        let c1 = UA[Y0].length,
          p0 = "",
          HQ = "";
        for (let nB = 0; nB < c1; nB++) {
          let AB = UA[Y0][nB];
          if (AB === void 0);
          else if (AB === null) Y0[0] === "?" ? V1 += this.indentate(RA) + "<" + Y0 + "?" + this.tagEndChar : V1 += this.indentate(RA) + "<" + Y0 + "/" + this.tagEndChar;
          else if (typeof AB == "object")
            if (this.options.oneListGroup) {
              let RB = this.j2x(AB, RA + 1, D1.concat(Y0));
              p0 += RB.val, this.options.attributesGroupName && AB.hasOwnProperty(this.options.attributesGroupName) && (HQ += RB.attrStr)
            } else p0 += this.processTextOrObjNode(AB, Y0, RA, D1);
          else if (this.options.oneListGroup) {
            let RB = this.options.tagValueProcessor(Y0, AB);
            RB = this.replaceEntitiesValue(RB), p0 += RB
          } else p0 += this.buildTextValNode(AB, Y0, "", RA)
        }
        this.options.oneListGroup && (p0 = this.buildObjectNode(p0, Y0, HQ, RA)), V1 += p0
      } else if (this.options.attributesGroupName && Y0 === this.options.attributesGroupName) {
        let c1 = Object.keys(UA[Y0]),
          p0 = c1.length;
        for (let HQ = 0; HQ < p0; HQ++) U1 += this.buildAttrPairStr(c1[HQ], "" + UA[Y0][c1[HQ]])
      } else V1 += this.processTextOrObjNode(UA[Y0], Y0, RA, D1);
      return {
        attrStr: U1,
        val: V1
      }
    }, $1.prototype.buildAttrPairStr = function (UA, RA) {
      return RA = this.options.attributeValueProcessor(UA, "" + RA), RA = this.replaceEntitiesValue(RA), this.options.suppressBooleanAttributes && RA === "true" ? " " + UA : " " + UA + '="' + RA + '"'
    }, $1.prototype.buildObjectNode = function (UA, RA, D1, U1) {
      if (UA === "") return RA[0] === "?" ? this.indentate(U1) + "<" + RA + D1 + "?" + this.tagEndChar : this.indentate(U1) + "<" + RA + D1 + this.closeTag(RA) + this.tagEndChar;
      {
        let V1 = "</" + RA + this.tagEndChar,
          H1 = "";
        return RA[0] === "?" && (H1 = "?", V1 = ""), !D1 && D1 !== "" || UA.indexOf("<") !== -1 ? this.options.commentPropName !== !1 && RA === this.options.commentPropName && H1.length === 0 ? this.indentate(U1) + `<!--${UA}-->` + this.newLine : this.indentate(U1) + "<" + RA + D1 + H1 + this.tagEndChar + UA + this.indentate(U1) + V1 : this.indentate(U1) + "<" + RA + D1 + H1 + ">" + UA + V1
      }
    }, $1.prototype.closeTag = function (UA) {
      let RA = "";
      return this.options.unpairedTags.indexOf(UA) !== -1 ? this.options.suppressUnpairedNode || (RA = "/") : RA = this.options.suppressEmptyNode ? "/" : `></${UA}`, RA
    }, $1.prototype.buildTextValNode = function (UA, RA, D1, U1) {
      if (this.options.cdataPropName !== !1 && RA === this.options.cdataPropName) return this.indentate(U1) + `<![CDATA[${UA}]]>` + this.newLine;
      if (this.options.commentPropName !== !1 && RA === this.options.commentPropName) return this.indentate(U1) + `<!--${UA}-->` + this.newLine;
      if (RA[0] === "?") return this.indentate(U1) + "<" + RA + D1 + "?" + this.tagEndChar;
      {
        let V1 = this.options.tagValueProcessor(RA, UA);
        return V1 = this.replaceEntitiesValue(V1), V1 === "" ? this.indentate(U1) + "<" + RA + D1 + this.closeTag(RA) + this.tagEndChar : this.indentate(U1) + "<" + RA + D1 + ">" + V1 + "</" + RA + this.tagEndChar
      }
    }, $1.prototype.replaceEntitiesValue = function (UA) {
      if (UA && UA.length > 0 && this.options.processEntities)
        for (let RA = 0; RA < this.options.entities.length; RA++) {
          let D1 = this.options.entities[RA];
          UA = UA.replace(D1.regex, D1.val)
        }
      return UA
    };
    let b0 = {
      validate: X
    };
    KOQ.exports = Q
  })()
})
// @from(Ln 82374, Col 4)
HOQ = U((FOQ) => {
  Object.defineProperty(FOQ, "__esModule", {
    value: !0
  });
  FOQ.parseXML = g26;
  var h26 = VOQ(),
    Ty1 = new h26.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: !0,
      ignoreAttributes: !1,
      ignoreDeclaration: !0,
      parseTagValue: !1,
      trimValues: !1,
      tagValueProcessor: (A, Q) => Q.trim() === "" && Q.includes(`
`) ? "" : void 0
    });
  Ty1.addEntity("#xD", "\r");
  Ty1.addEntity("#10", `
`);

  function g26(A) {
    return Ty1.parse(A, !0)
  }
})
// @from(Ln 82398, Col 4)
Sy1 = U((EOQ) => {
  var m26 = HOQ();

  function d26(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }

  function c26(A) {
    return A.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;")
  }
  class Py1 {
    value;
    constructor(A) {
      this.value = A
    }
    toString() {
      return c26("" + this.value)
    }
  }
  class eNA {
    name;
    children;
    attributes = {};
    static of (A, Q, B) {
      let G = new eNA(A);
      if (Q !== void 0) G.addChildNode(new Py1(Q));
      if (B !== void 0) G.withName(B);
      return G
    }
    constructor(A, Q = []) {
      this.name = A, this.children = Q
    }
    withName(A) {
      return this.name = A, this
    }
    addAttribute(A, Q) {
      return this.attributes[A] = Q, this
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
    a(A, Q) {
      if (Q != null) this.attributes[A] = Q;
      return this
    }
    cc(A, Q, B = Q) {
      if (A[Q] != null) {
        let G = eNA.of(Q, A[Q]).withName(B);
        this.c(G)
      }
    }
    l(A, Q, B, G) {
      if (A[Q] != null) G().map((Y) => {
        Y.withName(B), this.c(Y)
      })
    }
    lc(A, Q, B, G) {
      if (A[Q] != null) {
        let Z = G(),
          Y = new eNA(B);
        Z.map((J) => {
          Y.c(J)
        }), this.c(Y)
      }
    }
    toString() {
      let A = Boolean(this.children.length),
        Q = `<${this.name}`,
        B = this.attributes;
      for (let G of Object.keys(B)) {
        let Z = B[G];
        if (Z != null) Q += ` ${G}="${d26(""+Z)}"`
      }
      return Q += !A ? "/>" : `>${this.children.map((G)=>G.toString()).join("")}</${this.name}>`
    }
  }
  Object.defineProperty(EOQ, "parseXML", {
    enumerable: !0,
    get: function () {
      return m26.parseXML
    }
  });
  EOQ.XmlNode = eNA;
  EOQ.XmlText = Py1
})
// @from(Ln 82492, Col 4)
hY = U((V96) => {
  var yy1 = IoA(),
    li = rG(),
    zOQ = PW(),
    i26 = Rq(),
    $OQ = Gy1(),
    COQ = $y1(),
    sG = WX(),
    ng = My1(),
    MH = Mq(),
    nV = Oq(),
    QwA = jy1(),
    MOQ = oG(),
    rM = Sy1(),
    xy1 = {
      warningEmitted: !1
    },
    n26 = (A) => {
      if (A && !xy1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) xy1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    };

  function a26(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }

  function o26(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }

  function r26(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  var UOQ = (A) => yy1.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
    vy1 = (A) => new Date(Date.now() + A),
    s26 = (A, Q) => Math.abs(vy1(Q).getTime() - A) >= 300000,
    qOQ = (A, Q) => {
      let B = Date.parse(A);
      if (s26(B, Q)) return B - Date.now();
      return Q
    },
    AwA = (A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    },
    ky1 = async (A) => {
      let Q = AwA("context", A.context),
        B = AwA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        Y = await AwA("signer", B.signer)(G),
        J = A?.signingRegion,
        X = A?.signingRegionSet,
        I = A?.signingName;
      return {
        config: B,
        signer: Y,
        signingRegion: J,
        signingRegionSet: X,
        signingName: I
      }
    };
  class NoA {
    async sign(A, Q, B) {
      if (!yy1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let G = await ky1(B),
        {
          config: Z,
          signer: Y
        } = G,
        {
          signingRegion: J,
          signingName: X
        } = G,
        I = B.context;
      if (I?.authSchemes?.length ?? !1) {
        let [W, K] = I.authSchemes;
        if (W?.name === "sigv4a" && K?.name === "sigv4") J = K?.signingRegion ?? J, X = K?.signingName ?? X
      }
      return await Y.sign(A, {
        signingDate: vy1(Z.systemClockOffset),
        signingRegion: J,
        signingService: X
      })
    }
    errorHandler(A) {
      return (Q) => {
        let B = Q.ServerTime ?? UOQ(Q.$response);
        if (B) {
          let G = AwA("config", A.config),
            Z = G.systemClockOffset;
          if (G.systemClockOffset = qOQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
        }
        throw Q
      }
    }
    successHandler(A, Q) {
      let B = UOQ(A);
      if (B) {
        let G = AwA("config", Q.config);
        G.systemClockOffset = qOQ(B, G.systemClockOffset)
      }
    }
  }
  var t26 = NoA;
  class ROQ extends NoA {
    async sign(A, Q, B) {
      if (!yy1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let {
        config: G,
        signer: Z,
        signingRegion: Y,
        signingRegionSet: J,
        signingName: X
      } = await ky1(B), D = (await G.sigv4aSigningRegionSet?.() ?? J ?? [Y]).join(",");
      return await Z.sign(A, {
        signingDate: vy1(G.systemClockOffset),
        signingRegion: D,
        signingService: X
      })
    }
  }
  var NOQ = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [],
    _OQ = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
    wOQ = "AWS_AUTH_SCHEME_PREFERENCE",
    LOQ = "auth_scheme_preference",
    e26 = {
      environmentVariableSelector: (A, Q) => {
        if (Q?.signingName) {
          if (_OQ(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(wOQ in A)) return;
        return NOQ(A[wOQ])
      },
      configFileSelector: (A) => {
        if (!(LOQ in A)) return;
        return NOQ(A[LOQ])
      },
      default: []
    },
    A96 = (A) => {
      return A.sigv4aSigningRegionSet = li.normalizeProvider(A.sigv4aSigningRegionSet), A
    },
    Q96 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new zOQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new zOQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    jOQ = (A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(D) {
          if (D && D !== Q && D !== G) B = !0;
          Q = D;
          let W = G96(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            K = Z96(A, W);
          if (B && !K.attributed) G = async (V) => K(V).then((F) => i26.setCredentialFeature(F, "CREDENTIALS_CODE", "e")), G.memoized = K.memoized, G.configBound = K.configBound, G.attributed = !0;
          else G = K
        },
        get() {
          return G
        },
        enumerable: !0,
        configurable: !0
      }), A.credentials = Q;
      let {
        signingEscapePath: Z = !0,
        systemClockOffset: Y = A.systemClockOffset || 0,
        sha256: J
      } = A, X;
      if (A.signer) X = li.normalizeProvider(A.signer);
      else if (A.regionInfoProvider) X = () => li.normalizeProvider(A.region)().then(async (D) => [await A.regionInfoProvider(D, {
        useFipsEndpoint: await A.useFipsEndpoint(),
        useDualstackEndpoint: await A.useDualstackEndpoint()
      }) || {}, D]).then(([D, W]) => {
        let {
          signingRegion: K,
          signingService: V
        } = D;
        A.signingRegion = A.signingRegion || K || W, A.signingName = A.signingName || V || A.serviceId;
        let F = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: J,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || $OQ.SignatureV4)(F)
      });
      else X = async (D) => {
        D = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await li.normalizeProvider(A.region)(),
          properties: {}
        }, D);
        let {
          signingRegion: W,
          signingName: K
        } = D;
        A.signingRegion = A.signingRegion || W, A.signingName = A.signingName || K || A.serviceId;
        let V = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: J,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || $OQ.SignatureV4)(V)
      };
      return Object.assign(A, {
        systemClockOffset: Y,
        signingEscapePath: Z,
        signer: X
      })
    },
    B96 = jOQ;

  function G96(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = li.memoizeIdentityProvider(Q, li.isIdentityExpired, li.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = li.normalizeProvider(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    };
    return G.memoized = !0, G
  }

  function Z96(A, Q) {
    if (Q.configBound) return Q;
    let B = async (G) => Q({
      ...G,
      callerClientConfig: A
    });
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  class ZYA {
    queryCompat;
    constructor(A = !1) {
      this.queryCompat = A
    }
    resolveRestContentType(A, Q) {
      let B = Q.getMemberSchemas(),
        G = Object.values(B).find((Z) => {
          return !!Z.getMergedTraits().httpPayload
        });
      if (G) {
        let Z = G.getMergedTraits().mediaType;
        if (Z) return Z;
        else if (G.isStringSchema()) return "text/plain";
        else if (G.isBlobSchema()) return "application/octet-stream";
        else return A
      } else if (!Q.isUnitSchema()) {
        if (Object.values(B).find((Y) => {
            let {
              httpQuery: J,
              httpQueryParams: X,
              httpHeader: I,
              httpLabel: D,
              httpPrefixHeaders: W
            } = Y.getMergedTraits();
            return !J && !X && !I && !D && W === void 0
          })) return A
      }
    }
    async getErrorSchemaOrThrowBaseException(A, Q, B, G, Z, Y) {
      let J = Q,
        X = A;
      if (A.includes("#"))[J, X] = A.split("#");
      let I = {
          $metadata: Z,
          $fault: B.statusCode < 500 ? "client" : "server"
        },
        D = sG.TypeRegistry.for(J);
      try {
        return {
          errorSchema: Y?.(D, X) ?? D.getSchema(A),
          errorMetadata: I
        }
      } catch (W) {
        G.message = G.message ?? G.Message ?? "UnknownError";
        let K = sG.TypeRegistry.for("smithy.ts.sdk.synthetic." + J),
          V = K.getBaseException();
        if (V) {
          let F = K.getErrorCtor(V) ?? Error;
          throw this.decorateServiceException(Object.assign(new F({
            name: X
          }), I), G)
        }
        throw this.decorateServiceException(Object.assign(Error(X), I), G)
      }
    }
    decorateServiceException(A, Q = {}) {
      if (this.queryCompat) {
        let B = A.Message ?? Q.Message,
          G = ng.decorateServiceException(A, Q);
        if (B) G.Message = B, G.message = B;
        return G
      }
      return ng.decorateServiceException(A, Q)
    }
    setQueryCompatError(A, Q) {
      let B = Q.headers?.["x-amzn-query-error"];
      if (A !== void 0 && B != null) {
        let [G, Z] = B.split(";"), Y = Object.entries(A), J = {
          Code: G,
          Type: Z
        };
        Object.assign(A, J);
        for (let [X, I] of Y) J[X] = I;
        delete J.__type, A.Error = J
      }
    }
    queryCompatOutput(A, Q) {
      if (A.Error) Q.Error = A.Error;
      if (A.Type) Q.Type = A.Type;
      if (A.Code) Q.Code = A.Code
    }
  }
  class TOQ extends COQ.SmithyRpcV2CborProtocol {
    awsQueryCompatible;
    mixin;
    constructor({
      defaultNamespace: A,
      awsQueryCompatible: Q
    }) {
      super({
        defaultNamespace: A
      });
      this.awsQueryCompatible = !!Q, this.mixin = new ZYA(this.awsQueryCompatible)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (this.awsQueryCompatible) G.headers["x-amzn-query-mode"] = "true";
      return G
    }
    async handleError(A, Q, B, G, Z) {
      if (this.awsQueryCompatible) this.mixin.setQueryCompatError(G, B);
      let Y = COQ.loadSmithyRpcV2CborErrorCode(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = sG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(sG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D),
        V = {};
      for (let [F, H] of I.structIterator()) V[F] = this.deserializer.readValue(H, G[F]);
      if (this.awsQueryCompatible) this.mixin.queryCompatOutput(G, V);
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
  }
  var Y96 = (A) => {
      if (A == null) return A;
      if (typeof A === "number" || typeof A === "bigint") {
        let Q = Error(`Received number ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      if (typeof A === "boolean") {
        let Q = Error(`Received boolean ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      return A
    },
    J96 = (A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (A !== "" && Q !== "false" && Q !== "true") {
          let B = Error(`Received string "${A}" where a boolean was expected.`);
          B.name = "Warning", console.warn(B)
        }
        return A !== "" && Q !== "false"
      }
      return A
    },
    X96 = (A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = Number(A);
        if (Q.toString() !== A) {
          let B = Error(`Received string "${A}" where a number was expected.`);
          return B.name = "Warning", console.warn(B), A
        }
        return Q
      }
      return A
    };
  class ii {
    serdeContext;
    setSerdeContext(A) {
      this.serdeContext = A
    }
  }

  function I96(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new nV.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  var POQ = (A, Q) => ng.collectBody(A, Q).then((B) => (Q?.utf8Encoder ?? MOQ.toUtf8)(B)),
    by1 = (A, Q) => POQ(A, Q).then((B) => {
      if (B.length) try {
        return JSON.parse(B)
      } catch (G) {
        if (G?.name === "SyntaxError") Object.defineProperty(G, "$responseBodyText", {
          value: B
        });
        throw G
      }
      return {}
    }),
    D96 = async (A, Q) => {
      let B = await by1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, fy1 = (A, Q) => {
      let B = (Y, J) => Object.keys(Y).find((X) => X.toLowerCase() === J.toLowerCase()),
        G = (Y) => {
          let J = Y;
          if (typeof J === "number") J = J.toString();
          if (J.indexOf(",") >= 0) J = J.split(",")[0];
          if (J.indexOf(":") >= 0) J = J.split(":")[0];
          if (J.indexOf("#") >= 0) J = J.split("#")[1];
          return J
        },
        Z = B(A.headers, "x-amzn-errortype");
      if (Z !== void 0) return G(A.headers[Z]);
      if (Q && typeof Q === "object") {
        let Y = B(Q, "code");
        if (Y && Q[Y] !== void 0) return G(Q[Y]);
        if (Q.__type !== void 0) return G(Q.__type)
      }
    };
  class hy1 extends ii {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    async read(A, Q) {
      return this._read(A, typeof Q === "string" ? JSON.parse(Q, I96) : await by1(Q, this.serdeContext))
    }
    readObject(A, Q) {
      return this._read(A, Q)
    }
    _read(A, Q) {
      let B = Q !== null && typeof Q === "object",
        G = sG.NormalizedSchema.of(A);
      if (G.isListSchema() && Array.isArray(Q)) {
        let Y = G.getValueSchema(),
          J = [],
          X = !!G.getMergedTraits().sparse;
        for (let I of Q)
          if (X || I != null) J.push(this._read(Y, I));
        return J
      } else if (G.isMapSchema() && B) {
        let Y = G.getValueSchema(),
          J = {},
          X = !!G.getMergedTraits().sparse;
        for (let [I, D] of Object.entries(Q))
          if (X || D != null) J[I] = this._read(Y, D);
        return J
      } else if (G.isStructSchema() && B) {
        let Y = {};
        for (let [J, X] of G.structIterator()) {
          let I = this.settings.jsonName ? X.getMergedTraits().jsonName ?? J : J,
            D = this._read(X, Q[I]);
          if (D != null) Y[J] = D
        }
        return Y
      }
      if (G.isBlobSchema() && typeof Q === "string") return QwA.fromBase64(Q);
      let Z = G.getMergedTraits().mediaType;
      if (G.isStringSchema() && typeof Q === "string" && Z) {
        if (Z === "application/json" || Z.endsWith("+json")) return nV.LazyJsonString.from(Q)
      }
      if (G.isTimestampSchema() && Q != null) switch (MH.determineTimestampFormat(G, this.settings)) {
        case 5:
          return nV.parseRfc3339DateTimeWithOffset(Q);
        case 6:
          return nV.parseRfc7231DateTime(Q);
        case 7:
          return nV.parseEpochTimestamp(Q);
        default:
          return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
      }
      if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
      if (G.isBigDecimalSchema() && Q != null) {
        if (Q instanceof nV.NumericValue) return Q;
        let Y = Q;
        if (Y.type === "bigDecimal" && "string" in Y) return new nV.NumericValue(Y.string, Y.type);
        return new nV.NumericValue(String(Q), "bigDecimal")
      }
      if (G.isNumericSchema() && typeof Q === "string") switch (Q) {
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        case "NaN":
          return NaN
      }
      if (G.isDocumentSchema())
        if (B) {
          let Y = Array.isArray(Q) ? [] : {};
          for (let [J, X] of Object.entries(Q))
            if (X instanceof nV.NumericValue) Y[J] = X;
            else Y[J] = this._read(G, X);
          return Y
        } else return structuredClone(Q);
      return Q
    }
  }
  var OOQ = String.fromCharCode(925);
  class SOQ {
    values = new Map;
    counter = 0;
    stage = 0;
    createReplacer() {
      if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
      if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      return this.stage = 1, (A, Q) => {
        if (Q instanceof nV.NumericValue) {
          let B = `${OOQ+"nv"+this.counter++}_` + Q.string;
          return this.values.set(`"${B}"`, Q.string), B
        }
        if (typeof Q === "bigint") {
          let B = Q.toString(),
            G = `${OOQ+"b"+this.counter++}_` + B;
          return this.values.set(`"${G}"`, B), G
        }
        return Q
      }
    }
    replaceInJson(A) {
      if (this.stage === 0) throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
      if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      if (this.stage = 2, this.counter === 0) return A;
      for (let [Q, B] of this.values) A = A.replace(Q, B);
      return A
    }
  }
  class gy1 extends ii {
    settings;
    buffer;
    rootSchema;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q) {
      this.rootSchema = sG.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
    }
    writeDiscriminatedDocument(A, Q) {
      if (this.write(A, Q), typeof this.buffer === "object") this.buffer.__type = sG.NormalizedSchema.of(A).getName(!0)
    }
    flush() {
      let {
        rootSchema: A
      } = this;
      if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
        let Q = new SOQ;
        return Q.replaceInJson(JSON.stringify(this.buffer, Q.createReplacer(), 0))
      }
      return this.buffer
    }
    _write(A, Q, B) {
      let G = Q !== null && typeof Q === "object",
        Z = sG.NormalizedSchema.of(A);
      if (Z.isListSchema() && Array.isArray(Q)) {
        let Y = Z.getValueSchema(),
          J = [],
          X = !!Z.getMergedTraits().sparse;
        for (let I of Q)
          if (X || I != null) J.push(this._write(Y, I));
        return J
      } else if (Z.isMapSchema() && G) {
        let Y = Z.getValueSchema(),
          J = {},
          X = !!Z.getMergedTraits().sparse;
        for (let [I, D] of Object.entries(Q))
          if (X || D != null) J[I] = this._write(Y, D);
        return J
      } else if (Z.isStructSchema() && G) {
        let Y = {};
        for (let [J, X] of Z.structIterator()) {
          let I = this.settings.jsonName ? X.getMergedTraits().jsonName ?? J : J,
            D = this._write(X, Q[J], Z);
          if (D !== void 0) Y[I] = D
        }
        return Y
      }
      if (Q === null && B?.isStructSchema()) return;
      if (Z.isBlobSchema() && (Q instanceof Uint8Array || typeof Q === "string") || Z.isDocumentSchema() && Q instanceof Uint8Array) {
        if (Z === this.rootSchema) return Q;
        return (this.serdeContext?.base64Encoder ?? QwA.toBase64)(Q)
      }
      if ((Z.isTimestampSchema() || Z.isDocumentSchema()) && Q instanceof Date) switch (MH.determineTimestampFormat(Z, this.settings)) {
        case 5:
          return Q.toISOString().replace(".000Z", "Z");
        case 6:
          return nV.dateToUtcString(Q);
        case 7:
          return Q.getTime() / 1000;
        default:
          return console.warn("Missing timestamp format, using epoch seconds", Q), Q.getTime() / 1000
      }
      if (Z.isNumericSchema() && typeof Q === "number") {
        if (Math.abs(Q) === 1 / 0 || isNaN(Q)) return String(Q)
      }
      if (Z.isStringSchema()) {
        if (typeof Q > "u" && Z.isIdempotencyToken()) return nV.generateIdempotencyToken();
        let Y = Z.getMergedTraits().mediaType;
        if (Q != null && Y) {
          if (Y === "application/json" || Y.endsWith("+json")) return nV.LazyJsonString.from(Q)
        }
      }
      if (Z.isDocumentSchema())
        if (G) {
          let Y = Array.isArray(Q) ? [] : {};
          for (let [J, X] of Object.entries(Q))
            if (X instanceof nV.NumericValue) Y[J] = X;
            else Y[J] = this._write(Z, X);
          return Y
        } else return structuredClone(Q);
      return Q
    }
  }
  class woA extends ii {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    createSerializer() {
      let A = new gy1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
    createDeserializer() {
      let A = new hy1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
  }
  class LoA extends MH.RpcProtocol {
    serializer;
    deserializer;
    serviceTarget;
    codec;
    mixin;
    awsQueryCompatible;
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A
      });
      this.serviceTarget = Q, this.codec = new woA({
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        jsonName: !1
      }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!B, this.mixin = new ZYA(this.awsQueryCompatible)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (!G.path.endsWith("/")) G.path += "/";
      if (Object.assign(G.headers, {
          "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
          "x-amz-target": `${this.serviceTarget}.${A.name}`
        }), this.awsQueryCompatible) G.headers["x-amzn-query-mode"] = "true";
      if (sG.deref(A.input) === "unit" || !G.body) G.body = "{}";
      return G
    }
    getPayloadCodec() {
      return this.codec
    }
    async handleError(A, Q, B, G, Z) {
      if (this.awsQueryCompatible) this.mixin.setQueryCompatError(G, B);
      let Y = fy1(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = sG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(sG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D),
        V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().jsonName ?? F;
        V[F] = this.codec.createDeserializer().readObject(H, G[E])
      }
      if (this.awsQueryCompatible) this.mixin.queryCompatOutput(G, V);
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
  }
  class xOQ extends LoA {
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A,
        serviceTarget: Q,
        awsQueryCompatible: B
      })
    }
    getShapeId() {
      return "aws.protocols#awsJson1_0"
    }
    getJsonRpcVersion() {
      return "1.0"
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.0"
    }
  }
  class yOQ extends LoA {
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A,
        serviceTarget: Q,
        awsQueryCompatible: B
      })
    }
    getShapeId() {
      return "aws.protocols#awsJson1_1"
    }
    getJsonRpcVersion() {
      return "1.1"
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.1"
    }
  }
  class vOQ extends MH.HttpBindingProtocol {
    serializer;
    deserializer;
    codec;
    mixin = new ZYA;
    constructor({
      defaultNamespace: A
    }) {
      super({
        defaultNamespace: A
      });
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        httpBindings: !0,
        jsonName: !0
      };
      this.codec = new woA(Q), this.serializer = new MH.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new MH.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
    }
    getShapeId() {
      return "aws.protocols#restJson1"
    }
    getPayloadCodec() {
      return this.codec
    }
    setSerdeContext(A) {
      this.codec.setSerdeContext(A), super.setSerdeContext(A)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B),
        Z = sG.NormalizedSchema.of(A.input);
      if (!G.headers["content-type"]) {
        let Y = this.mixin.resolveRestContentType(this.getDefaultContentType(), Z);
        if (Y) G.headers["content-type"] = Y
      }
      if (G.body == null && G.headers["content-type"] === this.getDefaultContentType()) G.body = "{}";
      return G
    }
    async deserializeResponse(A, Q, B) {
      let G = await super.deserializeResponse(A, Q, B),
        Z = sG.NormalizedSchema.of(A.output);
      for (let [Y, J] of Z.structIterator())
        if (J.getMemberTraits().httpPayload && !(Y in G)) G[Y] = null;
      return G
    }
    async handleError(A, Q, B, G, Z) {
      let Y = fy1(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = sG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(sG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D);
      await this.deserializeHttpMessage(J, Q, B, G);
      let V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().jsonName ?? F;
        V[F] = this.codec.createDeserializer().readObject(H, G[E])
      }
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
    getDefaultContentType() {
      return "application/json"
    }
  }
  var W96 = (A) => {
    if (A == null) return;
    if (typeof A === "object" && "__type" in A) delete A.__type;
    return ng.expectUnion(A)
  };
  class OoA extends ii {
    settings;
    stringDeserializer;
    constructor(A) {
      super();
      this.settings = A, this.stringDeserializer = new MH.FromStringShapeDeserializer(A)
    }
    setSerdeContext(A) {
      this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
    }
    read(A, Q, B) {
      let G = sG.NormalizedSchema.of(A),
        Z = G.getMemberSchemas();
      if (G.isStructSchema() && G.isMemberSchema() && !!Object.values(Z).find((I) => {
          return !!I.getMemberTraits().eventPayload
        })) {
        let I = {},
          D = Object.keys(Z)[0];
        if (Z[D].isBlobSchema()) I[D] = Q;
        else I[D] = this.read(Z[D], Q);
        return I
      }
      let J = (this.serdeContext?.utf8Encoder ?? MOQ.toUtf8)(Q),
        X = this.parseXml(J);
      return this.readSchema(A, B ? X[B] : X)
    }
    readSchema(A, Q) {
      let B = sG.NormalizedSchema.of(A);
      if (B.isUnitSchema()) return;
      let G = B.getMergedTraits();
      if (B.isListSchema() && !Array.isArray(Q)) return this.readSchema(B, [Q]);
      if (Q == null) return Q;
      if (typeof Q === "object") {
        let Z = !!G.sparse,
          Y = !!G.xmlFlattened;
        if (B.isListSchema()) {
          let X = B.getValueSchema(),
            I = [],
            D = X.getMergedTraits().xmlName ?? "member",
            W = Y ? Q : (Q[0] ?? Q)[D],
            K = Array.isArray(W) ? W : [W];
          for (let V of K)
            if (V != null || Z) I.push(this.readSchema(X, V));
          return I
        }
        let J = {};
        if (B.isMapSchema()) {
          let X = B.getKeySchema(),
            I = B.getValueSchema(),
            D;
          if (Y) D = Array.isArray(Q) ? Q : [Q];
          else D = Array.isArray(Q.entry) ? Q.entry : [Q.entry];
          let W = X.getMergedTraits().xmlName ?? "key",
            K = I.getMergedTraits().xmlName ?? "value";
          for (let V of D) {
            let F = V[W],
              H = V[K];
            if (H != null || Z) J[F] = this.readSchema(I, H)
          }
          return J
        }
        if (B.isStructSchema()) {
          for (let [X, I] of B.structIterator()) {
            let D = I.getMergedTraits(),
              W = !D.httpPayload ? I.getMemberTraits().xmlName ?? X : D.xmlName ?? I.getName();
            if (Q[W] != null) J[X] = this.readSchema(I, Q[W])
          }
          return J
        }
        if (B.isDocumentSchema()) return Q;
        throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${B.getName(!0)}`)
      }
      if (B.isListSchema()) return [];
      if (B.isMapSchema() || B.isStructSchema()) return {};
      return this.stringDeserializer.read(B, Q)
    }
    parseXml(A) {
      if (A.length) {
        let Q;
        try {
          Q = rM.parseXML(A)
        } catch (Y) {
          if (Y && typeof Y === "object") Object.defineProperty(Y, "$responseBodyText", {
            value: A
          });
          throw Y
        }
        let B = "#text",
          G = Object.keys(Q)[0],
          Z = Q[G];
        if (Z[B]) Z[G] = Z[B], delete Z[B];
        return ng.getValueFromTextNode(Z)
      }
      return {}
    }
  }
  class kOQ extends ii {
    settings;
    buffer;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q, B = "") {
      if (this.buffer === void 0) this.buffer = "";
      let G = sG.NormalizedSchema.of(A);
      if (B && !B.endsWith(".")) B += ".";
      if (G.isBlobSchema()) {
        if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? QwA.toBase64)(Q))
      } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(String(Q));
        else if (G.isIdempotencyToken()) this.writeKey(B), this.writeValue(nV.generateIdempotencyToken())
      } else if (G.isBigIntegerSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(String(Q))
      } else if (G.isBigDecimalSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(Q instanceof nV.NumericValue ? Q.string : String(Q))
      } else if (G.isTimestampSchema()) {
        if (Q instanceof Date) switch (this.writeKey(B), MH.determineTimestampFormat(G, this.settings)) {
          case 5:
            this.writeValue(Q.toISOString().replace(".000Z", "Z"));
            break;
          case 6:
            this.writeValue(ng.dateToUtcString(Q));
            break;
          case 7:
            this.writeValue(String(Q.getTime() / 1000));
            break
        }
      } else if (G.isDocumentSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${G.getName(!0)}`);
      else if (G.isListSchema()) {
        if (Array.isArray(Q))
          if (Q.length === 0) {
            if (this.settings.serializeEmptyLists) this.writeKey(B), this.writeValue("")
          } else {
            let Z = G.getValueSchema(),
              Y = this.settings.flattenLists || G.getMergedTraits().xmlFlattened,
              J = 1;
            for (let X of Q) {
              if (X == null) continue;
              let I = this.getKey("member", Z.getMergedTraits().xmlName),
                D = Y ? `${B}${J}` : `${B}${I}.${J}`;
              this.write(Z, X, D), ++J
            }
          }
      } else if (G.isMapSchema()) {
        if (Q && typeof Q === "object") {
          let Z = G.getKeySchema(),
            Y = G.getValueSchema(),
            J = G.getMergedTraits().xmlFlattened,
            X = 1;
          for (let [I, D] of Object.entries(Q)) {
            if (D == null) continue;
            let W = this.getKey("key", Z.getMergedTraits().xmlName),
              K = J ? `${B}${X}.${W}` : `${B}entry.${X}.${W}`,
              V = this.getKey("value", Y.getMergedTraits().xmlName),
              F = J ? `${B}${X}.${V}` : `${B}entry.${X}.${V}`;
            this.write(Z, I, K), this.write(Y, D, F), ++X
          }
        }
      } else if (G.isStructSchema()) {
        if (Q && typeof Q === "object")
          for (let [Z, Y] of G.structIterator()) {
            if (Q[Z] == null && !Y.isIdempotencyToken()) continue;
            let J = this.getKey(Z, Y.getMergedTraits().xmlName),
              X = `${B}${J}`;
            this.write(Y, Q[Z], X)
          }
      } else if (G.isUnitSchema());
      else throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${G.getName(!0)}`)
    }
    flush() {
      if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
      let A = this.buffer;
      return delete this.buffer, A
    }
    getKey(A, Q) {
      let B = Q ?? A;
      if (this.settings.capitalizeKeys) return B[0].toUpperCase() + B.slice(1);
      return B
    }
    writeKey(A) {
      if (A.endsWith(".")) A = A.slice(0, A.length - 1);
      this.buffer += `&${MH.extendedEncodeURIComponent(A)}=`
    }
    writeValue(A) {
      this.buffer += MH.extendedEncodeURIComponent(A)
    }
  }
  class uy1 extends MH.RpcProtocol {
    options;
    serializer;
    deserializer;
    mixin = new ZYA;
    constructor(A) {
      super({
        defaultNamespace: A.defaultNamespace
      });
      this.options = A;
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !1,
        xmlNamespace: A.xmlNamespace,
        serviceNamespace: A.defaultNamespace,
        serializeEmptyLists: !0
      };
      this.serializer = new kOQ(Q), this.deserializer = new OoA(Q)
    }
    getShapeId() {
      return "aws.protocols#awsQuery"
    }
    setSerdeContext(A) {
      this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A)
    }
    getPayloadCodec() {
      throw Error("AWSQuery protocol has no payload codec.")
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (!G.path.endsWith("/")) G.path += "/";
      if (Object.assign(G.headers, {
          "content-type": "application/x-www-form-urlencoded"
        }), sG.deref(A.input) === "unit" || !G.body) G.body = "";
      let Z = A.name.split("#")[1] ?? A.name;
      if (G.body = `Action=${Z}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
      return G
    }
    async deserializeResponse(A, Q, B) {
      let G = this.deserializer,
        Z = sG.NormalizedSchema.of(A.output),
        Y = {};
      if (B.statusCode >= 300) {
        let W = await MH.collectBody(B.body, Q);
        if (W.byteLength > 0) Object.assign(Y, await G.read(15, W));
        await this.handleError(A, Q, B, Y, this.deserializeMetadata(B))
      }
      for (let W in B.headers) {
        let K = B.headers[W];
        delete B.headers[W], B.headers[W.toLowerCase()] = K
      }
      let J = A.name.split("#")[1] ?? A.name,
        X = Z.isStructSchema() && this.useNestedResult() ? J + "Result" : void 0,
        I = await MH.collectBody(B.body, Q);
      if (I.byteLength > 0) Object.assign(Y, await G.read(Z, I, X));
      return {
        $metadata: this.deserializeMetadata(B),
        ...Y
      }
    }
    useNestedResult() {
      return !0
    }
    async handleError(A, Q, B, G, Z) {
      let Y = this.loadQueryErrorCode(B, G) ?? "Unknown",
        J = this.loadQueryError(G),
        X = this.loadQueryErrorMessage(G);
      J.message = X, J.Error = {
        Type: J.Type,
        Code: J.Code,
        Message: X
      };
      let {
        errorSchema: I,
        errorMetadata: D
      } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, J, Z, (H, E) => {
        try {
          return H.getSchema(E)
        } catch (z) {
          return H.find(($) => sG.NormalizedSchema.of($).getMergedTraits().awsQueryError?.[0] === E)
        }
      }), W = sG.NormalizedSchema.of(I), V = new(sG.TypeRegistry.for(I[1]).getErrorCtor(I) ?? Error)(X), F = {
        Error: J.Error
      };
      for (let [H, E] of W.structIterator()) {
        let z = E.getMergedTraits().xmlName ?? H,
          $ = J[z] ?? G[z];
        F[H] = this.deserializer.readSchema(E, $)
      }
      throw this.mixin.decorateServiceException(Object.assign(V, D, {
        $fault: W.getMergedTraits().error,
        message: X
      }, F), G)
    }
    loadQueryErrorCode(A, Q) {
      let B = (Q.Errors?.[0]?.Error ?? Q.Errors?.Error ?? Q.Error)?.Code;
      if (B !== void 0) return B;
      if (A.statusCode == 404) return "NotFound"
    }
    loadQueryError(A) {
      return A.Errors?.[0]?.Error ?? A.Errors?.Error ?? A.Error
    }
    loadQueryErrorMessage(A) {
      let Q = this.loadQueryError(A);
      return Q?.message ?? Q?.Message ?? A.message ?? A.Message ?? "Unknown"
    }
    getDefaultContentType() {
      return "application/x-www-form-urlencoded"
    }
  }
  class bOQ extends uy1 {
    options;
    constructor(A) {
      super(A);
      this.options = A;
      let Q = {
        capitalizeKeys: !0,
        flattenLists: !0,
        serializeEmptyLists: !1
      };
      Object.assign(this.serializer.settings, Q)
    }
    useNestedResult() {
      return !1
    }
  }
  var fOQ = (A, Q) => POQ(A, Q).then((B) => {
      if (B.length) {
        let G;
        try {
          G = rM.parseXML(B)
        } catch (X) {
          if (X && typeof X === "object") Object.defineProperty(X, "$responseBodyText", {
            value: B
          });
          throw X
        }
        let Z = "#text",
          Y = Object.keys(G)[0],
          J = G[Y];
        if (J[Z]) J[Y] = J[Z], delete J[Z];
        return ng.getValueFromTextNode(J)
      }
      return {}
    }),
    K96 = async (A, Q) => {
      let B = await fOQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, hOQ = (A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    };
  class my1 extends ii {
    settings;
    stringBuffer;
    byteBuffer;
    buffer;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q) {
      let B = sG.NormalizedSchema.of(A);
      if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
      else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? QwA.fromBase64)(Q);
      else {
        this.buffer = this.writeStruct(B, Q, void 0);
        let G = B.getMergedTraits();
        if (G.httpPayload && !G.xmlName) this.buffer.withName(B.getName())
      }
    }
    flush() {
      if (this.byteBuffer !== void 0) {
        let Q = this.byteBuffer;
        return delete this.byteBuffer, Q
      }
      if (this.stringBuffer !== void 0) {
        let Q = this.stringBuffer;
        return delete this.stringBuffer, Q
      }
      let A = this.buffer;
      if (this.settings.xmlNamespace) {
        if (!A?.attributes?.xmlns) A.addAttribute("xmlns", this.settings.xmlNamespace)
      }
      return delete this.buffer, A.toString()
    }
    writeStruct(A, Q, B) {
      let G = A.getMergedTraits(),
        Z = A.isMemberSchema() && !G.httpPayload ? A.getMemberTraits().xmlName ?? A.getMemberName() : G.xmlName ?? A.getName();
      if (!Z || !A.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${A.getName(!0)}.`);
      let Y = rM.XmlNode.of(Z),
        [J, X] = this.getXmlnsAttribute(A, B);
      for (let [I, D] of A.structIterator()) {
        let W = Q[I];
        if (W != null || D.isIdempotencyToken()) {
          if (D.getMergedTraits().xmlAttribute) {
            Y.addAttribute(D.getMergedTraits().xmlName ?? I, this.writeSimple(D, W));
            continue
          }
          if (D.isListSchema()) this.writeList(D, W, Y, X);
          else if (D.isMapSchema()) this.writeMap(D, W, Y, X);
          else if (D.isStructSchema()) Y.addChildNode(this.writeStruct(D, W, X));
          else {
            let K = rM.XmlNode.of(D.getMergedTraits().xmlName ?? D.getMemberName());
            this.writeSimpleInto(D, W, K, X), Y.addChildNode(K)
          }
        }
      }
      if (X) Y.addAttribute(J, X);
      return Y
    }
    writeList(A, Q, B, G) {
      if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
      let Z = A.getMergedTraits(),
        Y = A.getValueSchema(),
        J = Y.getMergedTraits(),
        X = !!J.sparse,
        I = !!Z.xmlFlattened,
        [D, W] = this.getXmlnsAttribute(A, G),
        K = (V, F) => {
          if (Y.isListSchema()) this.writeList(Y, Array.isArray(F) ? F : [F], V, W);
          else if (Y.isMapSchema()) this.writeMap(Y, F, V, W);
          else if (Y.isStructSchema()) {
            let H = this.writeStruct(Y, F, W);
            V.addChildNode(H.withName(I ? Z.xmlName ?? A.getMemberName() : J.xmlName ?? "member"))
          } else {
            let H = rM.XmlNode.of(I ? Z.xmlName ?? A.getMemberName() : J.xmlName ?? "member");
            this.writeSimpleInto(Y, F, H, W), V.addChildNode(H)
          }
        };
      if (I) {
        for (let V of Q)
          if (X || V != null) K(B, V)
      } else {
        let V = rM.XmlNode.of(Z.xmlName ?? A.getMemberName());
        if (W) V.addAttribute(D, W);
        for (let F of Q)
          if (X || F != null) K(V, F);
        B.addChildNode(V)
      }
    }
    writeMap(A, Q, B, G, Z = !1) {
      if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
      let Y = A.getMergedTraits(),
        J = A.getKeySchema(),
        I = J.getMergedTraits().xmlName ?? "key",
        D = A.getValueSchema(),
        W = D.getMergedTraits(),
        K = W.xmlName ?? "value",
        V = !!W.sparse,
        F = !!Y.xmlFlattened,
        [H, E] = this.getXmlnsAttribute(A, G),
        z = ($, O, L) => {
          let M = rM.XmlNode.of(I, O),
            [_, j] = this.getXmlnsAttribute(J, E);
          if (j) M.addAttribute(_, j);
          $.addChildNode(M);
          let x = rM.XmlNode.of(K);
          if (D.isListSchema()) this.writeList(D, L, x, E);
          else if (D.isMapSchema()) this.writeMap(D, L, x, E, !0);
          else if (D.isStructSchema()) x = this.writeStruct(D, L, E);
          else this.writeSimpleInto(D, L, x, E);
          $.addChildNode(x)
        };
      if (F) {
        for (let [$, O] of Object.entries(Q))
          if (V || O != null) {
            let L = rM.XmlNode.of(Y.xmlName ?? A.getMemberName());
            z(L, $, O), B.addChildNode(L)
          }
      } else {
        let $;
        if (!Z) {
          if ($ = rM.XmlNode.of(Y.xmlName ?? A.getMemberName()), E) $.addAttribute(H, E);
          B.addChildNode($)
        }
        for (let [O, L] of Object.entries(Q))
          if (V || L != null) {
            let M = rM.XmlNode.of("entry");
            z(M, O, L), (Z ? B : $).addChildNode(M)
          }
      }
    }
    writeSimple(A, Q) {
      if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
      let B = sG.NormalizedSchema.of(A),
        G = null;
      if (Q && typeof Q === "object")
        if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? QwA.toBase64)(Q);
        else if (B.isTimestampSchema() && Q instanceof Date) switch (MH.determineTimestampFormat(B, this.settings)) {
        case 5:
          G = Q.toISOString().replace(".000Z", "Z");
          break;
        case 6:
          G = ng.dateToUtcString(Q);
          break;
        case 7:
          G = String(Q.getTime() / 1000);
          break;
        default:
          console.warn("Missing timestamp format, using http date", Q), G = ng.dateToUtcString(Q);
          break
      } else if (B.isBigDecimalSchema() && Q) {
        if (Q instanceof nV.NumericValue) return Q.string;
        return String(Q)
      } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
      else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
      if (B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
      if (B.isStringSchema())
        if (Q === void 0 && B.isIdempotencyToken()) G = nV.generateIdempotencyToken();
        else G = String(Q);
      if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
      return G
    }
    writeSimpleInto(A, Q, B, G) {
      let Z = this.writeSimple(A, Q),
        Y = sG.NormalizedSchema.of(A),
        J = new rM.XmlText(Z),
        [X, I] = this.getXmlnsAttribute(Y, G);
      if (I) B.addAttribute(X, I);
      B.addChildNode(J)
    }
    getXmlnsAttribute(A, Q) {
      let B = A.getMergedTraits(),
        [G, Z] = B.xmlNamespace ?? [];
      if (Z && Z !== Q) return [G ? `xmlns:${G}` : "xmlns", Z];
      return [void 0, void 0]
    }
  }
  class dy1 extends ii {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    createSerializer() {
      let A = new my1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
    createDeserializer() {
      let A = new OoA(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
  }
  class gOQ extends MH.HttpBindingProtocol {
    codec;
    serializer;
    deserializer;
    mixin = new ZYA;
    constructor(A) {
      super(A);
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !0,
        xmlNamespace: A.xmlNamespace,
        serviceNamespace: A.defaultNamespace
      };
      this.codec = new dy1(Q), this.serializer = new MH.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new MH.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
    }
    getPayloadCodec() {
      return this.codec
    }
    getShapeId() {
      return "aws.protocols#restXml"
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B),
        Z = sG.NormalizedSchema.of(A.input);
      if (!G.headers["content-type"]) {
        let Y = this.mixin.resolveRestContentType(this.getDefaultContentType(), Z);
        if (Y) G.headers["content-type"] = Y
      }
      if (G.headers["content-type"] === this.getDefaultContentType()) {
        if (typeof G.body === "string") G.body = '<?xml version="1.0" encoding="UTF-8"?>' + G.body
      }
      return G
    }
    async deserializeResponse(A, Q, B) {
      return super.deserializeResponse(A, Q, B)
    }
    async handleError(A, Q, B, G, Z) {
      let Y = hOQ(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = sG.NormalizedSchema.of(J),
        D = G.Error?.message ?? G.Error?.Message ?? G.message ?? G.Message ?? "Unknown",
        K = new(sG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D);
      await this.deserializeHttpMessage(J, Q, B, G);
      let V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().xmlName ?? F,
          z = G.Error?.[E] ?? G[E];
        V[F] = this.codec.createDeserializer().readSchema(H, z)
      }
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
    getDefaultContentType() {
      return "application/xml"
    }
  }
  V96.AWSSDKSigV4Signer = t26;
  V96.AwsEc2QueryProtocol = bOQ;
  V96.AwsJson1_0Protocol = xOQ;
  V96.AwsJson1_1Protocol = yOQ;
  V96.AwsJsonRpcProtocol = LoA;
  V96.AwsQueryProtocol = uy1;
  V96.AwsRestJsonProtocol = vOQ;
  V96.AwsRestXmlProtocol = gOQ;
  V96.AwsSdkSigV4ASigner = ROQ;
  V96.AwsSdkSigV4Signer = NoA;
  V96.AwsSmithyRpcV2CborProtocol = TOQ;
  V96.JsonCodec = woA;
  V96.JsonShapeDeserializer = hy1;
  V96.JsonShapeSerializer = gy1;
  V96.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = e26;
  V96.NODE_SIGV4A_CONFIG_OPTIONS = Q96;
  V96.XmlCodec = dy1;
  V96.XmlShapeDeserializer = OoA;
  V96.XmlShapeSerializer = my1;
  V96._toBool = J96;
  V96._toNum = X96;
  V96._toStr = Y96;
  V96.awsExpectUnion = W96;
  V96.emitWarningIfUnsupportedVersion = n26;
  V96.getBearerTokenEnvKey = _OQ;
  V96.loadRestJsonErrorCode = fy1;
  V96.loadRestXmlErrorCode = hOQ;
  V96.parseJsonBody = by1;
  V96.parseJsonErrorBody = D96;
  V96.parseXmlBody = fOQ;
  V96.parseXmlErrorBody = K96;
  V96.resolveAWSSDKSigV4Config = B96;
  V96.resolveAwsSdkSigV4AConfig = A96;
  V96.resolveAwsSdkSigV4Config = jOQ;
  V96.setCredentialFeature = a26;
  V96.setFeature = o26;
  V96.setTokenFeature = r26;
  V96.state = xy1;
  V96.validateSigningProperties = ky1
})