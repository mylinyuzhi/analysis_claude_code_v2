
// @from(Ln 261002, Col 4)
yB1 = R((XEw, a64) => {
    var cx9 = c64(),
        $w = bJ6(),
        gK1 = i64(),
        P8 = uJ6(),
        R6 = $w.CODE_POINTS,
        FK1 = $w.CODE_POINT_SEQUENCES,
        lx9 = {
            128: 8364,
            130: 8218,
            131: 402,
            132: 8222,
            133: 8230,
            134: 8224,
            135: 8225,
            136: 710,
            137: 8240,
            138: 352,
            139: 8249,
            140: 338,
            142: 381,
            145: 8216,
            146: 8217,
            147: 8220,
            148: 8221,
            149: 8226,
            150: 8211,
            151: 8212,
            152: 732,
            153: 8482,
            154: 353,
            155: 8250,
            156: 339,
            158: 382,
            159: 376
        };

    function z$(A) {
        return A === R6.SPACE || A === R6.LINE_FEED || A === R6.TABULATION || A === R6.FORM_FEED
    }

    function RB1(A) {
        return A >= R6.DIGIT_0 && A <= R6.DIGIT_9
    }

    function Ih(A) {
        return A >= R6.LATIN_CAPITAL_A && A <= R6.LATIN_CAPITAL_Z
    }

    function QK1(A) {
        return A >= R6.LATIN_SMALL_A && A <= R6.LATIN_SMALL_Z
    }

    function zs(A) {
        return QK1(A) || Ih(A)
    }

    function hPA(A) {
        return zs(A) || RB1(A)
    }

    function r64(A) {
        return A >= R6.LATIN_CAPITAL_A && A <= R6.LATIN_CAPITAL_F
    }

    function o64(A) {
        return A >= R6.LATIN_SMALL_A && A <= R6.LATIN_SMALL_F
    }

    function ix9(A) {
        return RB1(A) || r64(A) || o64(A)
    }

    function BJ6(A) {
        return A + 32
    }

    function x_(A) {
        if (A <= 65535) return String.fromCharCode(A);
        return A -= 65536, String.fromCharCode(A >>> 10 & 1023 | 55296) + String.fromCharCode(56320 | A & 1023)
    }

    function Ys(A) {
        return String.fromCharCode(BJ6(A))
    }

    function n64(A, q) {
        let K = gK1[++A],
            Y = ++A,
            z = Y + K - 1;
        while (Y <= z) {
            let w = Y + z >>> 1,
                H = gK1[w];
            if (H < q) Y = w + 1;
            else if (H > q) z = w - 1;
            else return gK1[w + K]
        }
        return -1
    }
    class vH {
        constructor() {
            this.preprocessor = new cx9, this.tokenQueue = [], this.allowCDATA = !1, this.state = "DATA_STATE", this.returnState = "", this.charRefCode = -1, this.tempBuff = [], this.lastStartTagName = "", this.consumedAfterSnapshot = -1, this.active = !1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = null
        }
        _err() {}
        _errOnNextCodePoint(A) {
            this._consume(), this._err(A), this._unconsume()
        }
        getNextToken() {
            while (!this.tokenQueue.length && this.active) {
                this.consumedAfterSnapshot = 0;
                let A = this._consume();
                if (!this._ensureHibernation()) this[this.state](A)
            }
            return this.tokenQueue.shift()
        }
        write(A, q) {
            this.active = !0, this.preprocessor.write(A, q)
        }
        insertHtmlAtCurrentPos(A) {
            this.active = !0, this.preprocessor.insertHtmlAtCurrentPos(A)
        }
        _ensureHibernation() {
            if (this.preprocessor.endOfChunkHit) {
                for (; this.consumedAfterSnapshot > 0; this.consumedAfterSnapshot--) this.preprocessor.retreat();
                return this.active = !1, this.tokenQueue.push({
                    type: vH.HIBERNATION_TOKEN
                }), !0
            }
            return !1
        }
        _consume() {
            return this.consumedAfterSnapshot++, this.preprocessor.advance()
        }
        _unconsume() {
            this.consumedAfterSnapshot--, this.preprocessor.retreat()
        }
        _reconsumeInState(A) {
            this.state = A, this._unconsume()
        }
        _consumeSequenceIfMatch(A, q, K) {
            let Y = 0,
                z = !0,
                w = A.length,
                H = 0,
                $ = q,
                O = void 0;
            for (; H < w; H++) {
                if (H > 0) $ = this._consume(), Y++;
                if ($ === R6.EOF) {
                    z = !1;
                    break
                }
                if (O = A[H], $ !== O && (K || $ !== BJ6(O))) {
                    z = !1;
                    break
                }
            }
            if (!z)
                while (Y--) this._unconsume();
            return z
        }
        _isTempBufferEqualToScriptString() {
            if (this.tempBuff.length !== FK1.SCRIPT_STRING.length) return !1;
            for (let A = 0; A < this.tempBuff.length; A++)
                if (this.tempBuff[A] !== FK1.SCRIPT_STRING[A]) return !1;
            return !0
        }
        _createStartTagToken() {
            this.currentToken = {
                type: vH.START_TAG_TOKEN,
                tagName: "",
                selfClosing: !1,
                ackSelfClosing: !1,
                attrs: []
            }
        }
        _createEndTagToken() {
            this.currentToken = {
                type: vH.END_TAG_TOKEN,
                tagName: "",
                selfClosing: !1,
                attrs: []
            }
        }
        _createCommentToken() {
            this.currentToken = {
                type: vH.COMMENT_TOKEN,
                data: ""
            }
        }
        _createDoctypeToken(A) {
            this.currentToken = {
                type: vH.DOCTYPE_TOKEN,
                name: A,
                forceQuirks: !1,
                publicId: null,
                systemId: null
            }
        }
        _createCharacterToken(A, q) {
            this.currentCharacterToken = {
                type: A,
                chars: q
            }
        }
        _createEOFToken() {
            this.currentToken = {
                type: vH.EOF_TOKEN
            }
        }
        _createAttr(A) {
            this.currentAttr = {
                name: A,
                value: ""
            }
        }
        _leaveAttrName(A) {
            if (vH.getTokenAttr(this.currentToken, this.currentAttr.name) === null) this.currentToken.attrs.push(this.currentAttr);
            else this._err(P8.duplicateAttribute);
            this.state = A
        }
        _leaveAttrValue(A) {
            this.state = A
        }
        _emitCurrentToken() {
            this._emitCurrentCharacterToken();
            let A = this.currentToken;
            if (this.currentToken = null, A.type === vH.START_TAG_TOKEN) this.lastStartTagName = A.tagName;
            else if (A.type === vH.END_TAG_TOKEN) {
                if (A.attrs.length > 0) this._err(P8.endTagWithAttributes);
                if (A.selfClosing) this._err(P8.endTagWithTrailingSolidus)
            }
            this.tokenQueue.push(A)
        }
        _emitCurrentCharacterToken() {
            if (this.currentCharacterToken) this.tokenQueue.push(this.currentCharacterToken), this.currentCharacterToken = null
        }
        _emitEOFToken() {
            this._createEOFToken(), this._emitCurrentToken()
        }
        _appendCharToCurrentCharacterToken(A, q) {
            if (this.currentCharacterToken && this.currentCharacterToken.type !== A) this._emitCurrentCharacterToken();
            if (this.currentCharacterToken) this.currentCharacterToken.chars += q;
            else this._createCharacterToken(A, q)
        }
        _emitCodePoint(A) {
            let q = vH.CHARACTER_TOKEN;
            if (z$(A)) q = vH.WHITESPACE_CHARACTER_TOKEN;
            else if (A === R6.NULL) q = vH.NULL_CHARACTER_TOKEN;
            this._appendCharToCurrentCharacterToken(q, x_(A))
        }
        _emitSeveralCodePoints(A) {
            for (let q = 0; q < A.length; q++) this._emitCodePoint(A[q])
        }
        _emitChars(A) {
            this._appendCharToCurrentCharacterToken(vH.CHARACTER_TOKEN, A)
        }
        _matchNamedCharacterReference(A) {
            let q = null,
                K = 1,
                Y = n64(0, A);
            this.tempBuff.push(A);
            while (Y > -1) {
                let z = gK1[Y],
                    w = z < 7;
                if (w && z & 1) q = z & 2 ? [gK1[++Y], gK1[++Y]] : [gK1[++Y]], K = 0;
                let $ = this._consume();
                if (this.tempBuff.push($), K++, $ === R6.EOF) break;
                if (w) Y = z & 4 ? n64(Y, $) : -1;
                else Y = $ === z ? ++Y : -1
            }
            while (K--) this.tempBuff.pop(), this._unconsume();
            return q
        }
        _isCharacterReferenceInAttribute() {
            return this.returnState === "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE" || this.returnState === "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE" || this.returnState === "ATTRIBUTE_VALUE_UNQUOTED_STATE"
        }
        _isCharacterReferenceAttributeQuirk(A) {
            if (!A && this._isCharacterReferenceInAttribute()) {
                let q = this._consume();
                return this._unconsume(), q === R6.EQUALS_SIGN || hPA(q)
            }
            return !1
        }
        _flushCodePointsConsumedAsCharacterReference() {
            if (this._isCharacterReferenceInAttribute())
                for (let A = 0; A < this.tempBuff.length; A++) this.currentAttr.value += x_(this.tempBuff[A]);
            else this._emitSeveralCodePoints(this.tempBuff);
            this.tempBuff = []
        } ["DATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === R6.LESS_THAN_SIGN) this.state = "TAG_OPEN_STATE";
            else if (A === R6.AMPERSAND) this.returnState = "DATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitCodePoint(A);
            else if (A === R6.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["RCDATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === R6.AMPERSAND) this.returnState = "RCDATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === R6.LESS_THAN_SIGN) this.state = "RCDATA_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["RAWTEXT_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === R6.LESS_THAN_SIGN) this.state = "RAWTEXT_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["PLAINTEXT_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["TAG_OPEN_STATE"](A) {
            if (A === R6.EXCLAMATION_MARK) this.state = "MARKUP_DECLARATION_OPEN_STATE";
            else if (A === R6.SOLIDUS) this.state = "END_TAG_OPEN_STATE";
            else if (zs(A)) this._createStartTagToken(), this._reconsumeInState("TAG_NAME_STATE");
            else if (A === R6.QUESTION_MARK) this._err(P8.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE");
            else if (A === R6.EOF) this._err(P8.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
            else this._err(P8.invalidFirstCharacterOfTagName), this._emitChars("<"), this._reconsumeInState("DATA_STATE")
        } ["END_TAG_OPEN_STATE"](A) {
            if (zs(A)) this._createEndTagToken(), this._reconsumeInState("TAG_NAME_STATE");
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingEndTagName), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
            else this._err(P8.invalidFirstCharacterOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
        } ["TAG_NAME_STATE"](A) {
            if (z$(A)) this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            else if (A === R6.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (Ih(A)) this.currentToken.tagName += Ys(A);
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.tagName += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this.currentToken.tagName += x_(A)
        } ["RCDATA_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.SOLIDUS) this.tempBuff = [], this.state = "RCDATA_END_TAG_OPEN_STATE";
            else this._emitChars("<"), this._reconsumeInState("RCDATA_STATE")
        } ["RCDATA_END_TAG_OPEN_STATE"](A) {
            if (zs(A)) this._createEndTagToken(), this._reconsumeInState("RCDATA_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("RCDATA_STATE")
        } ["RCDATA_END_TAG_NAME_STATE"](A) {
            if (Ih(A)) this.currentToken.tagName += Ys(A), this.tempBuff.push(A);
            else if (QK1(A)) this.currentToken.tagName += x_(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (z$(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === R6.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === R6.GREATER_THAN_SIGN) {
                        this.state = "DATA_STATE", this._emitCurrentToken();
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RCDATA_STATE")
            }
        } ["RAWTEXT_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.SOLIDUS) this.tempBuff = [], this.state = "RAWTEXT_END_TAG_OPEN_STATE";
            else this._emitChars("<"), this._reconsumeInState("RAWTEXT_STATE")
        } ["RAWTEXT_END_TAG_OPEN_STATE"](A) {
            if (zs(A)) this._createEndTagToken(), this._reconsumeInState("RAWTEXT_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("RAWTEXT_STATE")
        } ["RAWTEXT_END_TAG_NAME_STATE"](A) {
            if (Ih(A)) this.currentToken.tagName += Ys(A), this.tempBuff.push(A);
            else if (QK1(A)) this.currentToken.tagName += x_(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (z$(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === R6.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === R6.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RAWTEXT_STATE")
            }
        } ["SCRIPT_DATA_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_END_TAG_OPEN_STATE";
            else if (A === R6.EXCLAMATION_MARK) this.state = "SCRIPT_DATA_ESCAPE_START_STATE", this._emitChars("<!");
            else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_END_TAG_OPEN_STATE"](A) {
            if (zs(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_END_TAG_NAME_STATE"](A) {
            if (Ih(A)) this.currentToken.tagName += Ys(A), this.tempBuff.push(A);
            else if (QK1(A)) this.currentToken.tagName += x_(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (z$(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    } else if (A === R6.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    } else if (A === R6.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_STATE")
            }
        } ["SCRIPT_DATA_ESCAPE_START_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPE_START_DASH_STATE", this._emitChars("-");
            else this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_ESCAPE_START_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_ESCAPED_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_STATE", this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_DASH_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE";
            else if (zs(A)) this.tempBuff = [], this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE");
            else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE"](A) {
            if (zs(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE"](A) {
            if (Ih(A)) this.currentToken.tagName += Ys(A), this.tempBuff.push(A);
            else if (QK1(A)) this.currentToken.tagName += x_(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (z$(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === R6.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === R6.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
            }
        } ["SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE"](A) {
            if (z$(A) || A === R6.SOLIDUS || A === R6.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_DOUBLE_ESCAPED_STATE" : "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A);
            else if (Ih(A)) this.tempBuff.push(BJ6(A)), this._emitCodePoint(A);
            else if (QK1(A)) this.tempBuff.push(A), this._emitCodePoint(A);
            else this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE", this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this._emitChars("-");
            else if (A === R6.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === R6.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars($w.REPLACEMENT_CHARACTER);
            else if (A === R6.EOF) this._err(P8.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE", this._emitChars("/");
            else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
        } ["SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE"](A) {
            if (z$(A) || A === R6.SOLIDUS || A === R6.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_ESCAPED_STATE" : "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A);
            else if (Ih(A)) this.tempBuff.push(BJ6(A)), this._emitCodePoint(A);
            else if (QK1(A)) this.tempBuff.push(A), this._emitCodePoint(A);
            else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
        } ["BEFORE_ATTRIBUTE_NAME_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.SOLIDUS || A === R6.GREATER_THAN_SIGN || A === R6.EOF) this._reconsumeInState("AFTER_ATTRIBUTE_NAME_STATE");
            else if (A === R6.EQUALS_SIGN) this._err(P8.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = "ATTRIBUTE_NAME_STATE";
            else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
        } ["ATTRIBUTE_NAME_STATE"](A) {
            if (z$(A) || A === R6.SOLIDUS || A === R6.GREATER_THAN_SIGN || A === R6.EOF) this._leaveAttrName("AFTER_ATTRIBUTE_NAME_STATE"), this._unconsume();
            else if (A === R6.EQUALS_SIGN) this._leaveAttrName("BEFORE_ATTRIBUTE_VALUE_STATE");
            else if (Ih(A)) this.currentAttr.name += Ys(A);
            else if (A === R6.QUOTATION_MARK || A === R6.APOSTROPHE || A === R6.LESS_THAN_SIGN) this._err(P8.unexpectedCharacterInAttributeName), this.currentAttr.name += x_(A);
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentAttr.name += $w.REPLACEMENT_CHARACTER;
            else this.currentAttr.name += x_(A)
        } ["AFTER_ATTRIBUTE_NAME_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
            else if (A === R6.EQUALS_SIGN) this.state = "BEFORE_ATTRIBUTE_VALUE_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
        } ["BEFORE_ATTRIBUTE_VALUE_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.QUOTATION_MARK) this.state = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this.state = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingAttributeValue), this.state = "DATA_STATE", this._emitCurrentToken();
            else this._reconsumeInState("ATTRIBUTE_VALUE_UNQUOTED_STATE")
        } ["ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE"](A) {
            if (A === R6.QUOTATION_MARK) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
            else if (A === R6.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentAttr.value += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += x_(A)
        } ["ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE"](A) {
            if (A === R6.APOSTROPHE) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
            else if (A === R6.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentAttr.value += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += x_(A)
        } ["ATTRIBUTE_VALUE_UNQUOTED_STATE"](A) {
            if (z$(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
            else if (A === R6.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_UNQUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentAttr.value += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.QUOTATION_MARK || A === R6.APOSTROPHE || A === R6.LESS_THAN_SIGN || A === R6.EQUALS_SIGN || A === R6.GRAVE_ACCENT) this._err(P8.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += x_(A);
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += x_(A)
        } ["AFTER_ATTRIBUTE_VALUE_QUOTED_STATE"](A) {
            if (z$(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
            else if (A === R6.SOLIDUS) this._leaveAttrValue("SELF_CLOSING_START_TAG_STATE");
            else if (A === R6.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this._err(P8.missingWhitespaceBetweenAttributes), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
        } ["SELF_CLOSING_START_TAG_STATE"](A) {
            if (A === R6.GREATER_THAN_SIGN) this.currentToken.selfClosing = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInTag), this._emitEOFToken();
            else this._err(P8.unexpectedSolidusInTag), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
        } ["BOGUS_COMMENT_STATE"](A) {
            if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._emitCurrentToken(), this._emitEOFToken();
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.data += $w.REPLACEMENT_CHARACTER;
            else this.currentToken.data += x_(A)
        } ["MARKUP_DECLARATION_OPEN_STATE"](A) {
            if (this._consumeSequenceIfMatch(FK1.DASH_DASH_STRING, A, !0)) this._createCommentToken(), this.state = "COMMENT_START_STATE";
            else if (this._consumeSequenceIfMatch(FK1.DOCTYPE_STRING, A, !1)) this.state = "DOCTYPE_STATE";
            else if (this._consumeSequenceIfMatch(FK1.CDATA_START_STRING, A, !0))
                if (this.allowCDATA) this.state = "CDATA_SECTION_STATE";
                else this._err(P8.cdataInHtmlContent), this._createCommentToken(), this.currentToken.data = "[CDATA[", this.state = "BOGUS_COMMENT_STATE";
            else if (!this._ensureHibernation()) this._err(P8.incorrectlyOpenedComment), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
        } ["COMMENT_START_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_START_DASH_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_START_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_END_DASH_STATE";
            else if (A === R6.LESS_THAN_SIGN) this.currentToken.data += "<", this.state = "COMMENT_LESS_THAN_SIGN_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.data += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.EOF) this._err(P8.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += x_(A)
        } ["COMMENT_LESS_THAN_SIGN_STATE"](A) {
            if (A === R6.EXCLAMATION_MARK) this.currentToken.data += "!", this.state = "COMMENT_LESS_THAN_SIGN_BANG_STATE";
            else if (A === R6.LESS_THAN_SIGN) this.currentToken.data += "!";
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE";
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE";
            else this._reconsumeInState("COMMENT_END_DASH_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE"](A) {
            if (A !== R6.GREATER_THAN_SIGN && A !== R6.EOF) this._err(P8.nestedComment);
            this._reconsumeInState("COMMENT_END_STATE")
        } ["COMMENT_END_DASH_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
            else if (A === R6.EOF) this._err(P8.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_END_STATE"](A) {
            if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EXCLAMATION_MARK) this.state = "COMMENT_END_BANG_STATE";
            else if (A === R6.HYPHEN_MINUS) this.currentToken.data += "-";
            else if (A === R6.EOF) this._err(P8.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "--", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_END_BANG_STATE"](A) {
            if (A === R6.HYPHEN_MINUS) this.currentToken.data += "--!", this.state = "COMMENT_END_DASH_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.incorrectlyClosedComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "--!", this._reconsumeInState("COMMENT_STATE")
        } ["DOCTYPE_STATE"](A) {
            if (z$(A)) this.state = "BEFORE_DOCTYPE_NAME_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE");
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingWhitespaceBeforeDoctypeName), this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE")
        } ["BEFORE_DOCTYPE_NAME_STATE"](A) {
            if (z$(A)) return;
            if (Ih(A)) this._createDoctypeToken(Ys(A)), this.state = "DOCTYPE_NAME_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this._createDoctypeToken($w.REPLACEMENT_CHARACTER), this.state = "DOCTYPE_NAME_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingDoctypeName), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._createDoctypeToken(x_(A)), this.state = "DOCTYPE_NAME_STATE"
        } ["DOCTYPE_NAME_STATE"](A) {
            if (z$(A)) this.state = "AFTER_DOCTYPE_NAME_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (Ih(A)) this.currentToken.name += Ys(A);
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.name += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.name += x_(A)
        } ["AFTER_DOCTYPE_NAME_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else if (this._consumeSequenceIfMatch(FK1.PUBLIC_STRING, A, !1)) this.state = "AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE";
            else if (this._consumeSequenceIfMatch(FK1.SYSTEM_STRING, A, !1)) this.state = "AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE";
            else if (!this._ensureHibernation()) this._err(P8.invalidCharacterSequenceAfterDoctypeName), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE"](A) {
            if (z$(A)) this.state = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === R6.QUOTATION_MARK) this._err(P8.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this._err(P8.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.QUOTATION_MARK) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
            if (A === R6.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.publicId += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.publicId += x_(A)
        } ["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
            if (A === R6.APOSTROPHE) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.publicId += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.publicId += x_(A)
        } ["AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
            if (z$(A)) this.state = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.QUOTATION_MARK) this._err(P8.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this._err(P8.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE"](A) {
            if (z$(A)) this.state = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === R6.QUOTATION_MARK) this._err(P8.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this._err(P8.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === R6.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
            if (A === R6.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.systemId += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.systemId += x_(A)
        } ["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
            if (A === R6.APOSTROPHE) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter), this.currentToken.systemId += $w.REPLACEMENT_CHARACTER;
            else if (A === R6.GREATER_THAN_SIGN) this._err(P8.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.systemId += x_(A)
        } ["AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
            if (z$(A)) return;
            if (A === R6.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.EOF) this._err(P8.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(P8.unexpectedCharacterAfterDoctypeSystemIdentifier), this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BOGUS_DOCTYPE_STATE"](A) {
            if (A === R6.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === R6.NULL) this._err(P8.unexpectedNullCharacter);
            else if (A === R6.EOF) this._emitCurrentToken(), this._emitEOFToken()
        } ["CDATA_SECTION_STATE"](A) {
            if (A === R6.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_BRACKET_STATE";
            else if (A === R6.EOF) this._err(P8.eofInCdata), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["CDATA_SECTION_BRACKET_STATE"](A) {
            if (A === R6.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_END_STATE";
            else this._emitChars("]"), this._reconsumeInState("CDATA_SECTION_STATE")
        } ["CDATA_SECTION_END_STATE"](A) {
            if (A === R6.GREATER_THAN_SIGN) this.state = "DATA_STATE";
            else if (A === R6.RIGHT_SQUARE_BRACKET) this._emitChars("]");
            else this._emitChars("]]"), this._reconsumeInState("CDATA_SECTION_STATE")
        } ["CHARACTER_REFERENCE_STATE"](A) {
            if (this.tempBuff = [R6.AMPERSAND], A === R6.NUMBER_SIGN) this.tempBuff.push(A), this.state = "NUMERIC_CHARACTER_REFERENCE_STATE";
            else if (hPA(A)) this._reconsumeInState("NAMED_CHARACTER_REFERENCE_STATE");
            else this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["NAMED_CHARACTER_REFERENCE_STATE"](A) {
            let q = this._matchNamedCharacterReference(A);
            if (this._ensureHibernation()) this.tempBuff = [R6.AMPERSAND];
            else if (q) {
                let K = this.tempBuff[this.tempBuff.length - 1] === R6.SEMICOLON;
                if (!this._isCharacterReferenceAttributeQuirk(K)) {
                    if (!K) this._errOnNextCodePoint(P8.missingSemicolonAfterCharacterReference);
                    this.tempBuff = q
                }
                this._flushCodePointsConsumedAsCharacterReference(), this.state = this.returnState
            } else this._flushCodePointsConsumedAsCharacterReference(), this.state = "AMBIGUOS_AMPERSAND_STATE"
        } ["AMBIGUOS_AMPERSAND_STATE"](A) {
            if (hPA(A))
                if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += x_(A);
                else this._emitCodePoint(A);
            else {
                if (A === R6.SEMICOLON) this._err(P8.unknownNamedCharacterReference);
                this._reconsumeInState(this.returnState)
            }
        } ["NUMERIC_CHARACTER_REFERENCE_STATE"](A) {
            if (this.charRefCode = 0, A === R6.LATIN_SMALL_X || A === R6.LATIN_CAPITAL_X) this.tempBuff.push(A), this.state = "HEXADEMICAL_CHARACTER_REFERENCE_START_STATE";
            else this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_START_STATE")
        } ["HEXADEMICAL_CHARACTER_REFERENCE_START_STATE"](A) {
            if (ix9(A)) this._reconsumeInState("HEXADEMICAL_CHARACTER_REFERENCE_STATE");
            else this._err(P8.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["DECIMAL_CHARACTER_REFERENCE_START_STATE"](A) {
            if (RB1(A)) this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_STATE");
            else this._err(P8.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["HEXADEMICAL_CHARACTER_REFERENCE_STATE"](A) {
            if (r64(A)) this.charRefCode = this.charRefCode * 16 + A - 55;
            else if (o64(A)) this.charRefCode = this.charRefCode * 16 + A - 87;
            else if (RB1(A)) this.charRefCode = this.charRefCode * 16 + A - 48;
            else if (A === R6.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
            else this._err(P8.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
        } ["DECIMAL_CHARACTER_REFERENCE_STATE"](A) {
            if (RB1(A)) this.charRefCode = this.charRefCode * 10 + A - 48;
            else if (A === R6.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
            else this._err(P8.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
        } ["NUMERIC_CHARACTER_REFERENCE_END_STATE"]() {
            if (this.charRefCode === R6.NULL) this._err(P8.nullCharacterReference), this.charRefCode = R6.REPLACEMENT_CHARACTER;
            else if (this.charRefCode > 1114111) this._err(P8.characterReferenceOutsideUnicodeRange), this.charRefCode = R6.REPLACEMENT_CHARACTER;
            else if ($w.isSurrogate(this.charRefCode)) this._err(P8.surrogateCharacterReference), this.charRefCode = R6.REPLACEMENT_CHARACTER;
            else if ($w.isUndefinedCodePoint(this.charRefCode)) this._err(P8.noncharacterCharacterReference);
            else if ($w.isControlCodePoint(this.charRefCode) || this.charRefCode === R6.CARRIAGE_RETURN) {
                this._err(P8.controlCharacterReference);
                let A = lx9[this.charRefCode];
                if (A) this.charRefCode = A
            }
            this.tempBuff = [this.charRefCode], this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        }
    }
    vH.CHARACTER_TOKEN = "CHARACTER_TOKEN";
    vH.NULL_CHARACTER_TOKEN = "NULL_CHARACTER_TOKEN";
    vH.WHITESPACE_CHARACTER_TOKEN = "WHITESPACE_CHARACTER_TOKEN";
    vH.START_TAG_TOKEN = "START_TAG_TOKEN";
    vH.END_TAG_TOKEN = "END_TAG_TOKEN";
    vH.COMMENT_TOKEN = "COMMENT_TOKEN";
    vH.DOCTYPE_TOKEN = "DOCTYPE_TOKEN";
    vH.EOF_TOKEN = "EOF_TOKEN";
    vH.HIBERNATION_TOKEN = "HIBERNATION_TOKEN";
    vH.MODE = {
        DATA: "DATA_STATE",
        RCDATA: "RCDATA_STATE",
        RAWTEXT: "RAWTEXT_STATE",
        SCRIPT_DATA: "SCRIPT_DATA_STATE",
        PLAINTEXT: "PLAINTEXT_STATE"
    };
    vH.getTokenAttr = function(A, q) {
        for (let K = A.attrs.length - 1; K >= 0; K--)
            if (A.attrs[K].name === q) return A.attrs[K].value;
        return null
    };
    a64.exports = vH
})
// @from(Ln 261798, Col 4)
ws = R((nx9) => {
    var IPA = nx9.NAMESPACES = {
        HTML: "http://www.w3.org/1999/xhtml",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/"
    };
    nx9.ATTRS = {
        TYPE: "type",
        ACTION: "action",
        ENCODING: "encoding",
        PROMPT: "prompt",
        NAME: "name",
        COLOR: "color",
        FACE: "face",
        SIZE: "size"
    };
    nx9.DOCUMENT_MODE = {
        NO_QUIRKS: "no-quirks",
        QUIRKS: "quirks",
        LIMITED_QUIRKS: "limited-quirks"
    };
    var P7 = nx9.TAG_NAMES = {
        A: "a",
        ADDRESS: "address",
        ANNOTATION_XML: "annotation-xml",
        APPLET: "applet",
        AREA: "area",
        ARTICLE: "article",
        ASIDE: "aside",
        B: "b",
        BASE: "base",
        BASEFONT: "basefont",
        BGSOUND: "bgsound",
        BIG: "big",
        BLOCKQUOTE: "blockquote",
        BODY: "body",
        BR: "br",
        BUTTON: "button",
        CAPTION: "caption",
        CENTER: "center",
        CODE: "code",
        COL: "col",
        COLGROUP: "colgroup",
        DD: "dd",
        DESC: "desc",
        DETAILS: "details",
        DIALOG: "dialog",
        DIR: "dir",
        DIV: "div",
        DL: "dl",
        DT: "dt",
        EM: "em",
        EMBED: "embed",
        FIELDSET: "fieldset",
        FIGCAPTION: "figcaption",
        FIGURE: "figure",
        FONT: "font",
        FOOTER: "footer",
        FOREIGN_OBJECT: "foreignObject",
        FORM: "form",
        FRAME: "frame",
        FRAMESET: "frameset",
        H1: "h1",
        H2: "h2",
        H3: "h3",
        H4: "h4",
        H5: "h5",
        H6: "h6",
        HEAD: "head",
        HEADER: "header",
        HGROUP: "hgroup",
        HR: "hr",
        HTML: "html",
        I: "i",
        IMG: "img",
        IMAGE: "image",
        INPUT: "input",
        IFRAME: "iframe",
        KEYGEN: "keygen",
        LABEL: "label",
        LI: "li",
        LINK: "link",
        LISTING: "listing",
        MAIN: "main",
        MALIGNMARK: "malignmark",
        MARQUEE: "marquee",
        MATH: "math",
        MENU: "menu",
        META: "meta",
        MGLYPH: "mglyph",
        MI: "mi",
        MO: "mo",
        MN: "mn",
        MS: "ms",
        MTEXT: "mtext",
        NAV: "nav",
        NOBR: "nobr",
        NOFRAMES: "noframes",
        NOEMBED: "noembed",
        NOSCRIPT: "noscript",
        OBJECT: "object",
        OL: "ol",
        OPTGROUP: "optgroup",
        OPTION: "option",
        P: "p",
        PARAM: "param",
        PLAINTEXT: "plaintext",
        PRE: "pre",
        RB: "rb",
        RP: "rp",
        RT: "rt",
        RTC: "rtc",
        RUBY: "ruby",
        S: "s",
        SCRIPT: "script",
        SECTION: "section",
        SELECT: "select",
        SOURCE: "source",
        SMALL: "small",
        SPAN: "span",
        STRIKE: "strike",
        STRONG: "strong",
        STYLE: "style",
        SUB: "sub",
        SUMMARY: "summary",
        SUP: "sup",
        TABLE: "table",
        TBODY: "tbody",
        TEMPLATE: "template",
        TEXTAREA: "textarea",
        TFOOT: "tfoot",
        TD: "td",
        TH: "th",
        THEAD: "thead",
        TITLE: "title",
        TR: "tr",
        TRACK: "track",
        TT: "tt",
        U: "u",
        UL: "ul",
        SVG: "svg",
        VAR: "var",
        WBR: "wbr",
        XMP: "xmp"
    };
    nx9.SPECIAL_ELEMENTS = {
        [IPA.HTML]: {
            [P7.ADDRESS]: !0,
            [P7.APPLET]: !0,
            [P7.AREA]: !0,
            [P7.ARTICLE]: !0,
            [P7.ASIDE]: !0,
            [P7.BASE]: !0,
            [P7.BASEFONT]: !0,
            [P7.BGSOUND]: !0,
            [P7.BLOCKQUOTE]: !0,
            [P7.BODY]: !0,
            [P7.BR]: !0,
            [P7.BUTTON]: !0,
            [P7.CAPTION]: !0,
            [P7.CENTER]: !0,
            [P7.COL]: !0,
            [P7.COLGROUP]: !0,
            [P7.DD]: !0,
            [P7.DETAILS]: !0,
            [P7.DIR]: !0,
            [P7.DIV]: !0,
            [P7.DL]: !0,
            [P7.DT]: !0,
            [P7.EMBED]: !0,
            [P7.FIELDSET]: !0,
            [P7.FIGCAPTION]: !0,
            [P7.FIGURE]: !0,
            [P7.FOOTER]: !0,
            [P7.FORM]: !0,
            [P7.FRAME]: !0,
            [P7.FRAMESET]: !0,
            [P7.H1]: !0,
            [P7.H2]: !0,
            [P7.H3]: !0,
            [P7.H4]: !0,
            [P7.H5]: !0,
            [P7.H6]: !0,
            [P7.HEAD]: !0,
            [P7.HEADER]: !0,
            [P7.HGROUP]: !0,
            [P7.HR]: !0,
            [P7.HTML]: !0,
            [P7.IFRAME]: !0,
            [P7.IMG]: !0,
            [P7.INPUT]: !0,
            [P7.LI]: !0,
            [P7.LINK]: !0,
            [P7.LISTING]: !0,
            [P7.MAIN]: !0,
            [P7.MARQUEE]: !0,
            [P7.MENU]: !0,
            [P7.META]: !0,
            [P7.NAV]: !0,
            [P7.NOEMBED]: !0,
            [P7.NOFRAMES]: !0,
            [P7.NOSCRIPT]: !0,
            [P7.OBJECT]: !0,
            [P7.OL]: !0,
            [P7.P]: !0,
            [P7.PARAM]: !0,
            [P7.PLAINTEXT]: !0,
            [P7.PRE]: !0,
            [P7.SCRIPT]: !0,
            [P7.SECTION]: !0,
            [P7.SELECT]: !0,
            [P7.SOURCE]: !0,
            [P7.STYLE]: !0,
            [P7.SUMMARY]: !0,
            [P7.TABLE]: !0,
            [P7.TBODY]: !0,
            [P7.TD]: !0,
            [P7.TEMPLATE]: !0,
            [P7.TEXTAREA]: !0,
            [P7.TFOOT]: !0,
            [P7.TH]: !0,
            [P7.THEAD]: !0,
            [P7.TITLE]: !0,
            [P7.TR]: !0,
            [P7.TRACK]: !0,
            [P7.UL]: !0,
            [P7.WBR]: !0,
            [P7.XMP]: !0
        },
        [IPA.MATHML]: {
            [P7.MI]: !0,
            [P7.MO]: !0,
            [P7.MN]: !0,
            [P7.MS]: !0,
            [P7.MTEXT]: !0,
            [P7.ANNOTATION_XML]: !0
        },
        [IPA.SVG]: {
            [P7.TITLE]: !0,
            [P7.FOREIGN_OBJECT]: !0,
            [P7.DESC]: !0
        }
    }
})
// @from(Ln 262045, Col 4)
qA4 = R((PEw, AA4) => {
    var t64 = ws(),
        v7 = t64.TAG_NAMES,
        Ow = t64.NAMESPACES;

    function s64(A) {
        switch (A.length) {
            case 1:
                return A === v7.P;
            case 2:
                return A === v7.RB || A === v7.RP || A === v7.RT || A === v7.DD || A === v7.DT || A === v7.LI;
            case 3:
                return A === v7.RTC;
            case 6:
                return A === v7.OPTION;
            case 8:
                return A === v7.OPTGROUP
        }
        return !1
    }

    function sx9(A) {
        switch (A.length) {
            case 1:
                return A === v7.P;
            case 2:
                return A === v7.RB || A === v7.RP || A === v7.RT || A === v7.DD || A === v7.DT || A === v7.LI || A === v7.TD || A === v7.TH || A === v7.TR;
            case 3:
                return A === v7.RTC;
            case 5:
                return A === v7.TBODY || A === v7.TFOOT || A === v7.THEAD;
            case 6:
                return A === v7.OPTION;
            case 7:
                return A === v7.CAPTION;
            case 8:
                return A === v7.OPTGROUP || A === v7.COLGROUP
        }
        return !1
    }

    function mJ6(A, q) {
        switch (A.length) {
            case 2:
                if (A === v7.TD || A === v7.TH) return q === Ow.HTML;
                else if (A === v7.MI || A === v7.MO || A === v7.MN || A === v7.MS) return q === Ow.MATHML;
                break;
            case 4:
                if (A === v7.HTML) return q === Ow.HTML;
                else if (A === v7.DESC) return q === Ow.SVG;
                break;
            case 5:
                if (A === v7.TABLE) return q === Ow.HTML;
                else if (A === v7.MTEXT) return q === Ow.MATHML;
                else if (A === v7.TITLE) return q === Ow.SVG;
                break;
            case 6:
                return (A === v7.APPLET || A === v7.OBJECT) && q === Ow.HTML;
            case 7:
                return (A === v7.CAPTION || A === v7.MARQUEE) && q === Ow.HTML;
            case 8:
                return A === v7.TEMPLATE && q === Ow.HTML;
            case 13:
                return A === v7.FOREIGN_OBJECT && q === Ow.SVG;
            case 14:
                return A === v7.ANNOTATION_XML && q === Ow.MATHML
        }
        return !1
    }
    class e64 {
        constructor(A, q) {
            this.stackTop = -1, this.items = [], this.current = A, this.currentTagName = null, this.currentTmplContent = null, this.tmplCount = 0, this.treeAdapter = q
        }
        _indexOf(A) {
            let q = -1;
            for (let K = this.stackTop; K >= 0; K--)
                if (this.items[K] === A) {
                    q = K;
                    break
                } return q
        }
        _isInTemplate() {
            return this.currentTagName === v7.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === Ow.HTML
        }
        _updateCurrentElement() {
            this.current = this.items[this.stackTop], this.currentTagName = this.current && this.treeAdapter.getTagName(this.current), this.currentTmplContent = this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : null
        }
        push(A) {
            if (this.items[++this.stackTop] = A, this._updateCurrentElement(), this._isInTemplate()) this.tmplCount++
        }
        pop() {
            if (this.stackTop--, this.tmplCount > 0 && this._isInTemplate()) this.tmplCount--;
            this._updateCurrentElement()
        }
        replace(A, q) {
            let K = this._indexOf(A);
            if (this.items[K] = q, K === this.stackTop) this._updateCurrentElement()
        }
        insertAfter(A, q) {
            let K = this._indexOf(A) + 1;
            if (this.items.splice(K, 0, q), K === ++this.stackTop) this._updateCurrentElement()
        }
        popUntilTagNamePopped(A) {
            while (this.stackTop > -1) {
                let q = this.currentTagName,
                    K = this.treeAdapter.getNamespaceURI(this.current);
                if (this.pop(), q === A && K === Ow.HTML) break
            }
        }
        popUntilElementPopped(A) {
            while (this.stackTop > -1) {
                let q = this.current;
                if (this.pop(), q === A) break
            }
        }
        popUntilNumberedHeaderPopped() {
            while (this.stackTop > -1) {
                let A = this.currentTagName,
                    q = this.treeAdapter.getNamespaceURI(this.current);
                if (this.pop(), A === v7.H1 || A === v7.H2 || A === v7.H3 || A === v7.H4 || A === v7.H5 || A === v7.H6 && q === Ow.HTML) break
            }
        }
        popUntilTableCellPopped() {
            while (this.stackTop > -1) {
                let A = this.currentTagName,
                    q = this.treeAdapter.getNamespaceURI(this.current);
                if (this.pop(), A === v7.TD || A === v7.TH && q === Ow.HTML) break
            }
        }
        popAllUpToHtmlElement() {
            this.stackTop = 0, this._updateCurrentElement()
        }
        clearBackToTableContext() {
            while (this.currentTagName !== v7.TABLE && this.currentTagName !== v7.TEMPLATE && this.currentTagName !== v7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== Ow.HTML) this.pop()
        }
        clearBackToTableBodyContext() {
            while (this.currentTagName !== v7.TBODY && this.currentTagName !== v7.TFOOT && this.currentTagName !== v7.THEAD && this.currentTagName !== v7.TEMPLATE && this.currentTagName !== v7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== Ow.HTML) this.pop()
        }
        clearBackToTableRowContext() {
            while (this.currentTagName !== v7.TR && this.currentTagName !== v7.TEMPLATE && this.currentTagName !== v7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== Ow.HTML) this.pop()
        }
        remove(A) {
            for (let q = this.stackTop; q >= 0; q--)
                if (this.items[q] === A) {
                    this.items.splice(q, 1), this.stackTop--, this._updateCurrentElement();
                    break
                }
        }
        tryPeekProperlyNestedBodyElement() {
            let A = this.items[1];
            return A && this.treeAdapter.getTagName(A) === v7.BODY ? A : null
        }
        contains(A) {
            return this._indexOf(A) > -1
        }
        getCommonAncestor(A) {
            let q = this._indexOf(A);
            return --q >= 0 ? this.items[q] : null
        }
        isRootHtmlElementCurrent() {
            return this.stackTop === 0 && this.currentTagName === v7.HTML
        }
        hasInScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === Ow.HTML) return !0;
                if (mJ6(K, Y)) return !1
            }
            return !0
        }
        hasNumberedHeaderInScope() {
            for (let A = this.stackTop; A >= 0; A--) {
                let q = this.treeAdapter.getTagName(this.items[A]),
                    K = this.treeAdapter.getNamespaceURI(this.items[A]);
                if ((q === v7.H1 || q === v7.H2 || q === v7.H3 || q === v7.H4 || q === v7.H5 || q === v7.H6) && K === Ow.HTML) return !0;
                if (mJ6(q, K)) return !1
            }
            return !0
        }
        hasInListItemScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === Ow.HTML) return !0;
                if ((K === v7.UL || K === v7.OL) && Y === Ow.HTML || mJ6(K, Y)) return !1
            }
            return !0
        }
        hasInButtonScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === Ow.HTML) return !0;
                if (K === v7.BUTTON && Y === Ow.HTML || mJ6(K, Y)) return !1
            }
            return !0
        }
        hasInTableScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]);
                if (this.treeAdapter.getNamespaceURI(this.items[q]) !== Ow.HTML) continue;
                if (K === A) return !0;
                if (K === v7.TABLE || K === v7.TEMPLATE || K === v7.HTML) return !1
            }
            return !0
        }
        hasTableBodyContextInTableScope() {
            for (let A = this.stackTop; A >= 0; A--) {
                let q = this.treeAdapter.getTagName(this.items[A]);
                if (this.treeAdapter.getNamespaceURI(this.items[A]) !== Ow.HTML) continue;
                if (q === v7.TBODY || q === v7.THEAD || q === v7.TFOOT) return !0;
                if (q === v7.TABLE || q === v7.HTML) return !1
            }
            return !0
        }
        hasInSelectScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]);
                if (this.treeAdapter.getNamespaceURI(this.items[q]) !== Ow.HTML) continue;
                if (K === A) return !0;
                if (K !== v7.OPTION && K !== v7.OPTGROUP) return !1
            }
            return !0
        }
        generateImpliedEndTags() {
            while (s64(this.currentTagName)) this.pop()
        }
        generateImpliedEndTagsThoroughly() {
            while (sx9(this.currentTagName)) this.pop()
        }
        generateImpliedEndTagsWithExclusion(A) {
            while (s64(this.currentTagName) && this.currentTagName !== A) this.pop()
        }
    }
    AA4.exports = e64
})
// @from(Ln 262282, Col 4)
YA4 = R((WEw, KA4) => {
    class xh {
        constructor(A) {
            this.length = 0, this.entries = [], this.treeAdapter = A, this.bookmark = null
        }
        _getNoahArkConditionCandidates(A) {
            let q = [];
            if (this.length >= 3) {
                let K = this.treeAdapter.getAttrList(A).length,
                    Y = this.treeAdapter.getTagName(A),
                    z = this.treeAdapter.getNamespaceURI(A);
                for (let w = this.length - 1; w >= 0; w--) {
                    let H = this.entries[w];
                    if (H.type === xh.MARKER_ENTRY) break;
                    let $ = H.element,
                        O = this.treeAdapter.getAttrList($);
                    if (this.treeAdapter.getTagName($) === Y && this.treeAdapter.getNamespaceURI($) === z && O.length === K) q.push({
                        idx: w,
                        attrs: O
                    })
                }
            }
            return q.length < 3 ? [] : q
        }
        _ensureNoahArkCondition(A) {
            let q = this._getNoahArkConditionCandidates(A),
                K = q.length;
            if (K) {
                let Y = this.treeAdapter.getAttrList(A),
                    z = Y.length,
                    w = Object.create(null);
                for (let H = 0; H < z; H++) {
                    let $ = Y[H];
                    w[$.name] = $.value
                }
                for (let H = 0; H < z; H++)
                    for (let $ = 0; $ < K; $++) {
                        let O = q[$].attrs[H];
                        if (w[O.name] !== O.value) q.splice($, 1), K--;
                        if (q.length < 3) return
                    }
                for (let H = K - 1; H >= 2; H--) this.entries.splice(q[H].idx, 1), this.length--
            }
        }
        insertMarker() {
            this.entries.push({
                type: xh.MARKER_ENTRY
            }), this.length++
        }
        pushElement(A, q) {
            this._ensureNoahArkCondition(A), this.entries.push({
                type: xh.ELEMENT_ENTRY,
                element: A,
                token: q
            }), this.length++
        }
        insertElementAfterBookmark(A, q) {
            let K = this.length - 1;
            for (; K >= 0; K--)
                if (this.entries[K] === this.bookmark) break;
            this.entries.splice(K + 1, 0, {
                type: xh.ELEMENT_ENTRY,
                element: A,
                token: q
            }), this.length++
        }
        removeEntry(A) {
            for (let q = this.length - 1; q >= 0; q--)
                if (this.entries[q] === A) {
                    this.entries.splice(q, 1), this.length--;
                    break
                }
        }
        clearToLastMarker() {
            while (this.length) {
                let A = this.entries.pop();
                if (this.length--, A.type === xh.MARKER_ENTRY) break
            }
        }
        getElementEntryInScopeWithTagName(A) {
            for (let q = this.length - 1; q >= 0; q--) {
                let K = this.entries[q];
                if (K.type === xh.MARKER_ENTRY) return null;
                if (this.treeAdapter.getTagName(K.element) === A) return K
            }
            return null
        }
        getElementEntry(A) {
            for (let q = this.length - 1; q >= 0; q--) {
                let K = this.entries[q];
                if (K.type === xh.ELEMENT_ENTRY && K.element === A) return K
            }
            return null
        }
    }
    xh.MARKER_ENTRY = "MARKER_ENTRY";
    xh.ELEMENT_ENTRY = "ELEMENT_ENTRY";
    KA4.exports = xh
})
// @from(Ln 262381, Col 4)
aB = R((GEw, zA4) => {
    class xPA {
        constructor(A) {
            let q = {},
                K = this._getOverriddenMethods(this, q);
            for (let Y of Object.keys(K))
                if (typeof K[Y] === "function") q[Y] = A[Y], A[Y] = K[Y]
        }
        _getOverriddenMethods() {
            throw Error("Not implemented")
        }
    }
    xPA.install = function(A, q, K) {
        if (!A.__mixins) A.__mixins = [];
        for (let z = 0; z < A.__mixins.length; z++)
            if (A.__mixins[z].constructor === q) return A.__mixins[z];
        let Y = new q(A, K);
        return A.__mixins.push(Y), Y
    };
    zA4.exports = xPA
})
// @from(Ln 262402, Col 4)
bPA = R((ZEw, HA4) => {
    var tx9 = aB();
    class wA4 extends tx9 {
        constructor(A) {
            super(A);
            this.preprocessor = A, this.isEol = !1, this.lineStartPos = 0, this.droppedBufferSize = 0, this.offset = 0, this.col = 0, this.line = 1
        }
        _getOverriddenMethods(A, q) {
            return {
                advance() {
                    let K = this.pos + 1,
                        Y = this.html[K];
                    if (A.isEol) A.isEol = !1, A.line++, A.lineStartPos = K;
                    if (Y === `
` || Y === "\r" && this.html[K + 1] !== `
`) A.isEol = !0;
                    return A.col = K - A.lineStartPos + 1, A.offset = A.droppedBufferSize + K, q.advance.call(this)
                },
                retreat() {
                    q.retreat.call(this), A.isEol = !1, A.col = this.pos - A.lineStartPos + 1
                },
                dropParsedChunk() {
                    let K = this.pos;
                    q.dropParsedChunk.call(this);
                    let Y = K - this.pos;
                    A.lineStartPos -= Y, A.droppedBufferSize += Y, A.offset = A.droppedBufferSize + this.pos
                }
            }
        }
    }
    HA4.exports = wA4
})
// @from(Ln 262434, Col 4)
BPA = R((fEw, _A4) => {
    var $A4 = aB(),
        uPA = yB1(),
        ex9 = bPA();
    class OA4 extends $A4 {
        constructor(A) {
            super(A);
            this.tokenizer = A, this.posTracker = $A4.install(A.preprocessor, ex9), this.currentAttrLocation = null, this.ctLoc = null
        }
        _getCurrentLocation() {
            return {
                startLine: this.posTracker.line,
                startCol: this.posTracker.col,
                startOffset: this.posTracker.offset,
                endLine: -1,
                endCol: -1,
                endOffset: -1
            }
        }
        _attachCurrentAttrLocationInfo() {
            this.currentAttrLocation.endLine = this.posTracker.line, this.currentAttrLocation.endCol = this.posTracker.col, this.currentAttrLocation.endOffset = this.posTracker.offset;
            let A = this.tokenizer.currentToken,
                q = this.tokenizer.currentAttr;
            if (!A.location.attrs) A.location.attrs = Object.create(null);
            A.location.attrs[q.name] = this.currentAttrLocation
        }
        _getOverriddenMethods(A, q) {
            let K = {
                _createStartTagToken() {
                    q._createStartTagToken.call(this), this.currentToken.location = A.ctLoc
                },
                _createEndTagToken() {
                    q._createEndTagToken.call(this), this.currentToken.location = A.ctLoc
                },
                _createCommentToken() {
                    q._createCommentToken.call(this), this.currentToken.location = A.ctLoc
                },
                _createDoctypeToken(Y) {
                    q._createDoctypeToken.call(this, Y), this.currentToken.location = A.ctLoc
                },
                _createCharacterToken(Y, z) {
                    q._createCharacterToken.call(this, Y, z), this.currentCharacterToken.location = A.ctLoc
                },
                _createEOFToken() {
                    q._createEOFToken.call(this), this.currentToken.location = A._getCurrentLocation()
                },
                _createAttr(Y) {
                    q._createAttr.call(this, Y), A.currentAttrLocation = A._getCurrentLocation()
                },
                _leaveAttrName(Y) {
                    q._leaveAttrName.call(this, Y), A._attachCurrentAttrLocationInfo()
                },
                _leaveAttrValue(Y) {
                    q._leaveAttrValue.call(this, Y), A._attachCurrentAttrLocationInfo()
                },
                _emitCurrentToken() {
                    let Y = this.currentToken.location;
                    if (this.currentCharacterToken) this.currentCharacterToken.location.endLine = Y.startLine, this.currentCharacterToken.location.endCol = Y.startCol, this.currentCharacterToken.location.endOffset = Y.startOffset;
                    if (this.currentToken.type === uPA.EOF_TOKEN) Y.endLine = Y.startLine, Y.endCol = Y.startCol, Y.endOffset = Y.startOffset;
                    else Y.endLine = A.posTracker.line, Y.endCol = A.posTracker.col + 1, Y.endOffset = A.posTracker.offset + 1;
                    q._emitCurrentToken.call(this)
                },
                _emitCurrentCharacterToken() {
                    let Y = this.currentCharacterToken && this.currentCharacterToken.location;
                    if (Y && Y.endOffset === -1) Y.endLine = A.posTracker.line, Y.endCol = A.posTracker.col, Y.endOffset = A.posTracker.offset;
                    q._emitCurrentCharacterToken.call(this)
                }
            };
            return Object.keys(uPA.MODE).forEach((Y) => {
                let z = uPA.MODE[Y];
                K[z] = function(w) {
                    A.ctLoc = A._getCurrentLocation(), q[z].call(this, w)
                }
            }), K
        }
    }
    _A4.exports = OA4
})
// @from(Ln 262512, Col 4)
DA4 = R((VEw, XA4) => {
    var Ab9 = aB();
    class JA4 extends Ab9 {
        constructor(A, q) {
            super(A);
            this.onItemPop = q.onItemPop
        }
        _getOverriddenMethods(A, q) {
            return {
                pop() {
                    A.onItemPop(this.current), q.pop.call(this)
                },
                popAllUpToHtmlElement() {
                    for (let K = this.stackTop; K > 0; K--) A.onItemPop(this.items[K]);
                    q.popAllUpToHtmlElement.call(this)
                },
                remove(K) {
                    A.onItemPop(this.current), q.remove.call(this, K)
                }
            }
        }
    }
    XA4.exports = JA4
})
// @from(Ln 262536, Col 4)
WA4 = R((NEw, PA4) => {
    var mPA = aB(),
        jA4 = yB1(),
        qb9 = BPA(),
        Kb9 = DA4(),
        Yb9 = ws(),
        FPA = Yb9.TAG_NAMES;
    class MA4 extends mPA {
        constructor(A) {
            super(A);
            this.parser = A, this.treeAdapter = this.parser.treeAdapter, this.posTracker = null, this.lastStartTagToken = null, this.lastFosterParentingLocation = null, this.currentToken = null
        }
        _setStartLocation(A) {
            let q = null;
            if (this.lastStartTagToken) q = Object.assign({}, this.lastStartTagToken.location), q.startTag = this.lastStartTagToken.location;
            this.treeAdapter.setNodeSourceCodeLocation(A, q)
        }
        _setEndLocation(A, q) {
            let K = this.treeAdapter.getNodeSourceCodeLocation(A);
            if (K) {
                if (q.location) {
                    let Y = q.location,
                        z = this.treeAdapter.getTagName(A);
                    if (q.type === jA4.END_TAG_TOKEN && z === q.tagName) K.endTag = Object.assign({}, Y), K.endLine = Y.endLine, K.endCol = Y.endCol, K.endOffset = Y.endOffset;
                    else K.endLine = Y.startLine, K.endCol = Y.startCol, K.endOffset = Y.startOffset
                }
            }
        }
        _getOverriddenMethods(A, q) {
            return {
                _bootstrap(K, Y) {
                    q._bootstrap.call(this, K, Y), A.lastStartTagToken = null, A.lastFosterParentingLocation = null, A.currentToken = null;
                    let z = mPA.install(this.tokenizer, qb9);
                    A.posTracker = z.posTracker, mPA.install(this.openElements, Kb9, {
                        onItemPop: function(w) {
                            A._setEndLocation(w, A.currentToken)
                        }
                    })
                },
                _runParsingLoop(K) {
                    q._runParsingLoop.call(this, K);
                    for (let Y = this.openElements.stackTop; Y >= 0; Y--) A._setEndLocation(this.openElements.items[Y], A.currentToken)
                },
                _processTokenInForeignContent(K) {
                    A.currentToken = K, q._processTokenInForeignContent.call(this, K)
                },
                _processToken(K) {
                    if (A.currentToken = K, q._processToken.call(this, K), K.type === jA4.END_TAG_TOKEN && (K.tagName === FPA.HTML || K.tagName === FPA.BODY && this.openElements.hasInScope(FPA.BODY)))
                        for (let z = this.openElements.stackTop; z >= 0; z--) {
                            let w = this.openElements.items[z];
                            if (this.treeAdapter.getTagName(w) === K.tagName) {
                                A._setEndLocation(w, K);
                                break
                            }
                        }
                },
                _setDocumentType(K) {
                    q._setDocumentType.call(this, K);
                    let Y = this.treeAdapter.getChildNodes(this.document),
                        z = Y.length;
                    for (let w = 0; w < z; w++) {
                        let H = Y[w];
                        if (this.treeAdapter.isDocumentTypeNode(H)) {
                            this.treeAdapter.setNodeSourceCodeLocation(H, K.location);
                            break
                        }
                    }
                },
                _attachElementToTree(K) {
                    A._setStartLocation(K), A.lastStartTagToken = null, q._attachElementToTree.call(this, K)
                },
                _appendElement(K, Y) {
                    A.lastStartTagToken = K, q._appendElement.call(this, K, Y)
                },
                _insertElement(K, Y) {
                    A.lastStartTagToken = K, q._insertElement.call(this, K, Y)
                },
                _insertTemplate(K) {
                    A.lastStartTagToken = K, q._insertTemplate.call(this, K);
                    let Y = this.treeAdapter.getTemplateContent(this.openElements.current);
                    this.treeAdapter.setNodeSourceCodeLocation(Y, null)
                },
                _insertFakeRootElement() {
                    q._insertFakeRootElement.call(this), this.treeAdapter.setNodeSourceCodeLocation(this.openElements.current, null)
                },
                _appendCommentNode(K, Y) {
                    q._appendCommentNode.call(this, K, Y);
                    let z = this.treeAdapter.getChildNodes(Y),
                        w = z[z.length - 1];
                    this.treeAdapter.setNodeSourceCodeLocation(w, K.location)
                },
                _findFosterParentingLocation() {
                    return A.lastFosterParentingLocation = q._findFosterParentingLocation.call(this), A.lastFosterParentingLocation
                },
                _insertCharacters(K) {
                    q._insertCharacters.call(this, K);
                    let Y = this._shouldFosterParentOnInsertion(),
                        z = Y && A.lastFosterParentingLocation.parent || this.openElements.currentTmplContent || this.openElements.current,
                        w = this.treeAdapter.getChildNodes(z),
                        H = Y && A.lastFosterParentingLocation.beforeElement ? w.indexOf(A.lastFosterParentingLocation.beforeElement) - 1 : w.length - 1,
                        $ = w[H],
                        O = this.treeAdapter.getNodeSourceCodeLocation($);
                    if (O) O.endLine = K.location.endLine, O.endCol = K.location.endCol, O.endOffset = K.location.endOffset;
                    else this.treeAdapter.setNodeSourceCodeLocation($, K.location)
                }
            }
        }
    }
    PA4.exports = MA4
})
// @from(Ln 262646, Col 4)
FJ6 = R((TEw, ZA4) => {
    var zb9 = aB();
    class GA4 extends zb9 {
        constructor(A, q) {
            super(A);
            this.posTracker = null, this.onParseError = q.onParseError
        }
        _setErrorLocation(A) {
            A.startLine = A.endLine = this.posTracker.line, A.startCol = A.endCol = this.posTracker.col, A.startOffset = A.endOffset = this.posTracker.offset
        }
        _reportError(A) {
            let q = {
                code: A,
                startLine: -1,
                startCol: -1,
                startOffset: -1,
                endLine: -1,
                endCol: -1,
                endOffset: -1
            };
            this._setErrorLocation(q), this.onParseError(q)
        }
        _getOverriddenMethods(A) {
            return {
                _err(q) {
                    A._reportError(q)
                }
            }
        }
    }
    ZA4.exports = GA4
})
// @from(Ln 262678, Col 4)
NA4 = R((vEw, VA4) => {
    var wb9 = FJ6(),
        Hb9 = bPA(),
        $b9 = aB();
    class fA4 extends wb9 {
        constructor(A, q) {
            super(A, q);
            this.posTracker = $b9.install(A, Hb9), this.lastErrOffset = -1
        }
        _reportError(A) {
            if (this.lastErrOffset !== this.posTracker.offset) this.lastErrOffset = this.posTracker.offset, super._reportError(A)
        }
    }
    VA4.exports = fA4
})
// @from(Ln 262693, Col 4)
EA4 = R((EEw, vA4) => {
    var Ob9 = FJ6(),
        _b9 = NA4(),
        Jb9 = aB();
    class TA4 extends Ob9 {
        constructor(A, q) {
            super(A, q);
            let K = Jb9.install(A.preprocessor, _b9, q);
            this.posTracker = K.posTracker
        }
    }
    vA4.exports = TA4
})
// @from(Ln 262706, Col 4)
yA4 = R((kEw, RA4) => {
    var Xb9 = FJ6(),
        Db9 = EA4(),
        jb9 = BPA(),
        kA4 = aB();
    class LA4 extends Xb9 {
        constructor(A, q) {
            super(A, q);
            this.opts = q, this.ctLoc = null, this.locBeforeToken = !1
        }
        _setErrorLocation(A) {
            if (this.ctLoc) A.startLine = this.ctLoc.startLine, A.startCol = this.ctLoc.startCol, A.startOffset = this.ctLoc.startOffset, A.endLine = this.locBeforeToken ? this.ctLoc.startLine : this.ctLoc.endLine, A.endCol = this.locBeforeToken ? this.ctLoc.startCol : this.ctLoc.endCol, A.endOffset = this.locBeforeToken ? this.ctLoc.startOffset : this.ctLoc.endOffset
        }
        _getOverriddenMethods(A, q) {
            return {
                _bootstrap(K, Y) {
                    q._bootstrap.call(this, K, Y), kA4.install(this.tokenizer, Db9, A.opts), kA4.install(this.tokenizer, jb9)
                },
                _processInputToken(K) {
                    A.ctLoc = K.location, q._processInputToken.call(this, K)
                },
                _err(K, Y) {
                    A.locBeforeToken = Y && Y.beforeToken, A._reportError(K)
                }
            }
        }
    }
    RA4.exports = LA4
})
// @from(Ln 262735, Col 4)
QPA = R((Wb9) => {
    var {
        DOCUMENT_MODE: Mb9
    } = ws();
    Wb9.createDocument = function() {
        return {
            nodeName: "#document",
            mode: Mb9.NO_QUIRKS,
            childNodes: []
        }
    };
    Wb9.createDocumentFragment = function() {
        return {
            nodeName: "#document-fragment",
            childNodes: []
        }
    };
    Wb9.createElement = function(A, q, K) {
        return {
            nodeName: A,
            tagName: A,
            attrs: K,
            namespaceURI: q,
            childNodes: [],
            parentNode: null
        }
    };
    Wb9.createCommentNode = function(A) {
        return {
            nodeName: "#comment",
            data: A,
            parentNode: null
        }
    };
    var CA4 = function(A) {
            return {
                nodeName: "#text",
                value: A,
                parentNode: null
            }
        },
        SA4 = Wb9.appendChild = function(A, q) {
            A.childNodes.push(q), q.parentNode = A
        },
        Pb9 = Wb9.insertBefore = function(A, q, K) {
            let Y = A.childNodes.indexOf(K);
            A.childNodes.splice(Y, 0, q), q.parentNode = A
        };
    Wb9.setTemplateContent = function(A, q) {
        A.content = q
    };
    Wb9.getTemplateContent = function(A) {
        return A.content
    };
    Wb9.setDocumentType = function(A, q, K, Y) {
        let z = null;
        for (let w = 0; w < A.childNodes.length; w++)
            if (A.childNodes[w].nodeName === "#documentType") {
                z = A.childNodes[w];
                break
            } if (z) z.name = q, z.publicId = K, z.systemId = Y;
        else SA4(A, {
            nodeName: "#documentType",
            name: q,
            publicId: K,
            systemId: Y
        })
    };
    Wb9.setDocumentMode = function(A, q) {
        A.mode = q
    };
    Wb9.getDocumentMode = function(A) {
        return A.mode
    };
    Wb9.detachNode = function(A) {
        if (A.parentNode) {
            let q = A.parentNode.childNodes.indexOf(A);
            A.parentNode.childNodes.splice(q, 1), A.parentNode = null
        }
    };
    Wb9.insertText = function(A, q) {
        if (A.childNodes.length) {
            let K = A.childNodes[A.childNodes.length - 1];
            if (K.nodeName === "#text") {
                K.value += q;
                return
            }
        }
        SA4(A, CA4(q))
    };
    Wb9.insertTextBefore = function(A, q, K) {
        let Y = A.childNodes[A.childNodes.indexOf(K) - 1];
        if (Y && Y.nodeName === "#text") Y.value += q;
        else Pb9(A, CA4(q), K)
    };
    Wb9.adoptAttributes = function(A, q) {
        let K = [];
        for (let Y = 0; Y < A.attrs.length; Y++) K.push(A.attrs[Y].name);
        for (let Y = 0; Y < q.length; Y++)
            if (K.indexOf(q[Y].name) === -1) A.attrs.push(q[Y])
    };
    Wb9.getFirstChild = function(A) {
        return A.childNodes[0]
    };
    Wb9.getChildNodes = function(A) {
        return A.childNodes
    };
    Wb9.getParentNode = function(A) {
        return A.parentNode
    };
    Wb9.getAttrList = function(A) {
        return A.attrs
    };
    Wb9.getTagName = function(A) {
        return A.tagName
    };
    Wb9.getNamespaceURI = function(A) {
        return A.namespaceURI
    };
    Wb9.getTextNodeContent = function(A) {
        return A.value
    };
    Wb9.getCommentNodeContent = function(A) {
        return A.data
    };
    Wb9.getDocumentTypeNodeName = function(A) {
        return A.name
    };
    Wb9.getDocumentTypeNodePublicId = function(A) {
        return A.publicId
    };
    Wb9.getDocumentTypeNodeSystemId = function(A) {
        return A.systemId
    };
    Wb9.isTextNode = function(A) {
        return A.nodeName === "#text"
    };
    Wb9.isCommentNode = function(A) {
        return A.nodeName === "#comment"
    };
    Wb9.isDocumentTypeNode = function(A) {
        return A.nodeName === "#documentType"
    };
    Wb9.isElementNode = function(A) {
        return !!A.tagName
    };
    Wb9.setNodeSourceCodeLocation = function(A, q) {
        A.sourceCodeLocation = q
    };
    Wb9.getNodeSourceCodeLocation = function(A) {
        return A.sourceCodeLocation
    }
})
// @from(Ln 262888, Col 4)
gPA = R((CEw, hA4) => {
    hA4.exports = function(q, K) {
        return K = K || Object.create(null), [q, K].reduce((Y, z) => {
            return Object.keys(z).forEach((w) => {
                Y[w] = z[w]
            }), Y
        }, Object.create(null))
    }
})
// @from(Ln 262897, Col 4)
UPA = R((ab9) => {
    var {
        DOCUMENT_MODE: KM1
    } = ws(), bA4 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], nb9 = bA4.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), rb9 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], uA4 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], ob9 = uA4.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

    function IA4(A) {
        let q = A.indexOf('"') !== -1 ? "'" : '"';
        return q + A + q
    }

    function xA4(A, q) {
        for (let K = 0; K < q.length; K++)
            if (A.indexOf(q[K]) === 0) return !0;
        return !1
    }
    ab9.isConforming = function(A) {
        return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
    };
    ab9.getDocumentMode = function(A) {
        if (A.name !== "html") return KM1.QUIRKS;
        let q = A.systemId;
        if (q && q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return KM1.QUIRKS;
        let K = A.publicId;
        if (K !== null) {
            if (K = K.toLowerCase(), rb9.indexOf(K) > -1) return KM1.QUIRKS;
            let Y = q === null ? nb9 : bA4;
            if (xA4(K, Y)) return KM1.QUIRKS;
            if (Y = q === null ? uA4 : ob9, xA4(K, Y)) return KM1.LIMITED_QUIRKS
        }
        return KM1.NO_QUIRKS
    };
    ab9.serializeContent = function(A, q, K) {
        let Y = "!DOCTYPE ";
        if (A) Y += A;
        if (q) Y += " PUBLIC " + IA4(q);
        else if (K) Y += " SYSTEM";
        if (K !== null) Y += " " + IA4(K);
        return Y
    }
})