
// @from(Ln 268097, Col 4)
TQ6 = x((v5w, pX4) => {
    var Cr9 = xX4(),
        G2 = UW1(),
        N96 = mX4(),
        MA = dW1(),
        L1 = G2.CODE_POINTS,
        T96 = G2.CODE_POINT_SEQUENCES,
        Ir9 = {
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

    function yO(A) {
        return A === L1.SPACE || A === L1.LINE_FEED || A === L1.TABULATION || A === L1.FORM_FEED
    }

    function fQ6(A) {
        return A >= L1.DIGIT_0 && A <= L1.DIGIT_9
    }

    function cI(A) {
        return A >= L1.LATIN_CAPITAL_A && A <= L1.LATIN_CAPITAL_Z
    }

    function v96(A) {
        return A >= L1.LATIN_SMALL_A && A <= L1.LATIN_SMALL_Z
    }

    function We(A) {
        return v96(A) || cI(A)
    }

    function aE8(A) {
        return We(A) || fQ6(A)
    }

    function gX4(A) {
        return A >= L1.LATIN_CAPITAL_A && A <= L1.LATIN_CAPITAL_F
    }

    function FX4(A) {
        return A >= L1.LATIN_SMALL_A && A <= L1.LATIN_SMALL_F
    }

    function br9(A) {
        return fQ6(A) || gX4(A) || FX4(A)
    }

    function cW1(A) {
        return A + 32
    }

    function Aj(A) {
        if (A <= 65535) return String.fromCharCode(A);
        return A -= 65536, String.fromCharCode(A >>> 10 & 1023 | 55296) + String.fromCharCode(56320 | A & 1023)
    }

    function Pe(A) {
        return String.fromCharCode(cW1(A))
    }

    function BX4(A, q) {
        let K = N96[++A],
            Y = ++A,
            z = Y + K - 1;
        while (Y <= z) {
            let _ = Y + z >>> 1,
                w = N96[_];
            if (w < q) Y = _ + 1;
            else if (w > q) z = _ - 1;
            else return N96[_ + K]
        }
        return -1
    }
    class Qw {
        constructor() {
            this.preprocessor = new Cr9, this.tokenQueue = [], this.allowCDATA = !1, this.state = "DATA_STATE", this.returnState = "", this.charRefCode = -1, this.tempBuff = [], this.lastStartTagName = "", this.consumedAfterSnapshot = -1, this.active = !1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = null
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
                    type: Qw.HIBERNATION_TOKEN
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
                _ = A.length,
                w = 0,
                O = q,
                $ = void 0;
            for (; w < _; w++) {
                if (w > 0) O = this._consume(), Y++;
                if (O === L1.EOF) {
                    z = !1;
                    break
                }
                if ($ = A[w], O !== $ && (K || O !== cW1($))) {
                    z = !1;
                    break
                }
            }
            if (!z)
                while (Y--) this._unconsume();
            return z
        }
        _isTempBufferEqualToScriptString() {
            if (this.tempBuff.length !== T96.SCRIPT_STRING.length) return !1;
            for (let A = 0; A < this.tempBuff.length; A++)
                if (this.tempBuff[A] !== T96.SCRIPT_STRING[A]) return !1;
            return !0
        }
        _createStartTagToken() {
            this.currentToken = {
                type: Qw.START_TAG_TOKEN,
                tagName: "",
                selfClosing: !1,
                ackSelfClosing: !1,
                attrs: []
            }
        }
        _createEndTagToken() {
            this.currentToken = {
                type: Qw.END_TAG_TOKEN,
                tagName: "",
                selfClosing: !1,
                attrs: []
            }
        }
        _createCommentToken() {
            this.currentToken = {
                type: Qw.COMMENT_TOKEN,
                data: ""
            }
        }
        _createDoctypeToken(A) {
            this.currentToken = {
                type: Qw.DOCTYPE_TOKEN,
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
                type: Qw.EOF_TOKEN
            }
        }
        _createAttr(A) {
            this.currentAttr = {
                name: A,
                value: ""
            }
        }
        _leaveAttrName(A) {
            if (Qw.getTokenAttr(this.currentToken, this.currentAttr.name) === null) this.currentToken.attrs.push(this.currentAttr);
            else this._err(MA.duplicateAttribute);
            this.state = A
        }
        _leaveAttrValue(A) {
            this.state = A
        }
        _emitCurrentToken() {
            this._emitCurrentCharacterToken();
            let A = this.currentToken;
            if (this.currentToken = null, A.type === Qw.START_TAG_TOKEN) this.lastStartTagName = A.tagName;
            else if (A.type === Qw.END_TAG_TOKEN) {
                if (A.attrs.length > 0) this._err(MA.endTagWithAttributes);
                if (A.selfClosing) this._err(MA.endTagWithTrailingSolidus)
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
            let q = Qw.CHARACTER_TOKEN;
            if (yO(A)) q = Qw.WHITESPACE_CHARACTER_TOKEN;
            else if (A === L1.NULL) q = Qw.NULL_CHARACTER_TOKEN;
            this._appendCharToCurrentCharacterToken(q, Aj(A))
        }
        _emitSeveralCodePoints(A) {
            for (let q = 0; q < A.length; q++) this._emitCodePoint(A[q])
        }
        _emitChars(A) {
            this._appendCharToCurrentCharacterToken(Qw.CHARACTER_TOKEN, A)
        }
        _matchNamedCharacterReference(A) {
            let q = null,
                K = 1,
                Y = BX4(0, A);
            this.tempBuff.push(A);
            while (Y > -1) {
                let z = N96[Y],
                    _ = z < 7;
                if (_ && z & 1) q = z & 2 ? [N96[++Y], N96[++Y]] : [N96[++Y]], K = 0;
                let O = this._consume();
                if (this.tempBuff.push(O), K++, O === L1.EOF) break;
                if (_) Y = z & 4 ? BX4(Y, O) : -1;
                else Y = O === z ? ++Y : -1
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
                return this._unconsume(), q === L1.EQUALS_SIGN || aE8(q)
            }
            return !1
        }
        _flushCodePointsConsumedAsCharacterReference() {
            if (this._isCharacterReferenceInAttribute())
                for (let A = 0; A < this.tempBuff.length; A++) this.currentAttr.value += Aj(this.tempBuff[A]);
            else this._emitSeveralCodePoints(this.tempBuff);
            this.tempBuff = []
        } ["DATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "TAG_OPEN_STATE";
            else if (A === L1.AMPERSAND) this.returnState = "DATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitCodePoint(A);
            else if (A === L1.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["RCDATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === L1.AMPERSAND) this.returnState = "RCDATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === L1.LESS_THAN_SIGN) this.state = "RCDATA_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["RAWTEXT_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "RAWTEXT_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["PLAINTEXT_STATE"](A) {
            if (this.preprocessor.dropParsedChunk(), A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["TAG_OPEN_STATE"](A) {
            if (A === L1.EXCLAMATION_MARK) this.state = "MARKUP_DECLARATION_OPEN_STATE";
            else if (A === L1.SOLIDUS) this.state = "END_TAG_OPEN_STATE";
            else if (We(A)) this._createStartTagToken(), this._reconsumeInState("TAG_NAME_STATE");
            else if (A === L1.QUESTION_MARK) this._err(MA.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE");
            else if (A === L1.EOF) this._err(MA.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
            else this._err(MA.invalidFirstCharacterOfTagName), this._emitChars("<"), this._reconsumeInState("DATA_STATE")
        } ["END_TAG_OPEN_STATE"](A) {
            if (We(A)) this._createEndTagToken(), this._reconsumeInState("TAG_NAME_STATE");
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingEndTagName), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
            else this._err(MA.invalidFirstCharacterOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
        } ["TAG_NAME_STATE"](A) {
            if (yO(A)) this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            else if (A === L1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (cI(A)) this.currentToken.tagName += Pe(A);
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.tagName += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this.currentToken.tagName += Aj(A)
        } ["RCDATA_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "RCDATA_END_TAG_OPEN_STATE";
            else this._emitChars("<"), this._reconsumeInState("RCDATA_STATE")
        } ["RCDATA_END_TAG_OPEN_STATE"](A) {
            if (We(A)) this._createEndTagToken(), this._reconsumeInState("RCDATA_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("RCDATA_STATE")
        } ["RCDATA_END_TAG_NAME_STATE"](A) {
            if (cI(A)) this.currentToken.tagName += Pe(A), this.tempBuff.push(A);
            else if (v96(A)) this.currentToken.tagName += Aj(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (yO(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === L1.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === L1.GREATER_THAN_SIGN) {
                        this.state = "DATA_STATE", this._emitCurrentToken();
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RCDATA_STATE")
            }
        } ["RAWTEXT_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "RAWTEXT_END_TAG_OPEN_STATE";
            else this._emitChars("<"), this._reconsumeInState("RAWTEXT_STATE")
        } ["RAWTEXT_END_TAG_OPEN_STATE"](A) {
            if (We(A)) this._createEndTagToken(), this._reconsumeInState("RAWTEXT_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("RAWTEXT_STATE")
        } ["RAWTEXT_END_TAG_NAME_STATE"](A) {
            if (cI(A)) this.currentToken.tagName += Pe(A), this.tempBuff.push(A);
            else if (v96(A)) this.currentToken.tagName += Aj(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (yO(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === L1.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === L1.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RAWTEXT_STATE")
            }
        } ["SCRIPT_DATA_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_END_TAG_OPEN_STATE";
            else if (A === L1.EXCLAMATION_MARK) this.state = "SCRIPT_DATA_ESCAPE_START_STATE", this._emitChars("<!");
            else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_END_TAG_OPEN_STATE"](A) {
            if (We(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_END_TAG_NAME_STATE"](A) {
            if (cI(A)) this.currentToken.tagName += Pe(A), this.tempBuff.push(A);
            else if (v96(A)) this.currentToken.tagName += Aj(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (yO(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    } else if (A === L1.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    } else if (A === L1.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_STATE")
            }
        } ["SCRIPT_DATA_ESCAPE_START_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPE_START_DASH_STATE", this._emitChars("-");
            else this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_ESCAPE_START_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else this._reconsumeInState("SCRIPT_DATA_STATE")
        } ["SCRIPT_DATA_ESCAPED_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_STATE", this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_DASH_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE";
            else if (We(A)) this.tempBuff = [], this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE");
            else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE"](A) {
            if (We(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE");
            else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE"](A) {
            if (cI(A)) this.currentToken.tagName += Pe(A), this.tempBuff.push(A);
            else if (v96(A)) this.currentToken.tagName += Aj(A), this.tempBuff.push(A);
            else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (yO(A)) {
                        this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
                        return
                    }
                    if (A === L1.SOLIDUS) {
                        this.state = "SELF_CLOSING_START_TAG_STATE";
                        return
                    }
                    if (A === L1.GREATER_THAN_SIGN) {
                        this._emitCurrentToken(), this.state = "DATA_STATE";
                        return
                    }
                }
                this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
            }
        } ["SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE"](A) {
            if (yO(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_DOUBLE_ESCAPED_STATE" : "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A);
            else if (cI(A)) this.tempBuff.push(cW1(A)), this._emitCodePoint(A);
            else if (v96(A)) this.tempBuff.push(A), this._emitCodePoint(A);
            else this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE", this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this._emitChars("-");
            else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
            else if (A === L1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(G2.REPLACEMENT_CHARACTER);
            else if (A === L1.EOF) this._err(MA.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
            else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
        } ["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE", this._emitChars("/");
            else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
        } ["SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE"](A) {
            if (yO(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_ESCAPED_STATE" : "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A);
            else if (cI(A)) this.tempBuff.push(cW1(A)), this._emitCodePoint(A);
            else if (v96(A)) this.tempBuff.push(A), this._emitCodePoint(A);
            else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
        } ["BEFORE_ATTRIBUTE_NAME_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN || A === L1.EOF) this._reconsumeInState("AFTER_ATTRIBUTE_NAME_STATE");
            else if (A === L1.EQUALS_SIGN) this._err(MA.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = "ATTRIBUTE_NAME_STATE";
            else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
        } ["ATTRIBUTE_NAME_STATE"](A) {
            if (yO(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN || A === L1.EOF) this._leaveAttrName("AFTER_ATTRIBUTE_NAME_STATE"), this._unconsume();
            else if (A === L1.EQUALS_SIGN) this._leaveAttrName("BEFORE_ATTRIBUTE_VALUE_STATE");
            else if (cI(A)) this.currentAttr.name += Pe(A);
            else if (A === L1.QUOTATION_MARK || A === L1.APOSTROPHE || A === L1.LESS_THAN_SIGN) this._err(MA.unexpectedCharacterInAttributeName), this.currentAttr.name += Aj(A);
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentAttr.name += G2.REPLACEMENT_CHARACTER;
            else this.currentAttr.name += Aj(A)
        } ["AFTER_ATTRIBUTE_NAME_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
            else if (A === L1.EQUALS_SIGN) this.state = "BEFORE_ATTRIBUTE_VALUE_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
        } ["BEFORE_ATTRIBUTE_VALUE_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.QUOTATION_MARK) this.state = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this.state = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingAttributeValue), this.state = "DATA_STATE", this._emitCurrentToken();
            else this._reconsumeInState("ATTRIBUTE_VALUE_UNQUOTED_STATE")
        } ["ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE"](A) {
            if (A === L1.QUOTATION_MARK) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
            else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentAttr.value += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += Aj(A)
        } ["ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE"](A) {
            if (A === L1.APOSTROPHE) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
            else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentAttr.value += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += Aj(A)
        } ["ATTRIBUTE_VALUE_UNQUOTED_STATE"](A) {
            if (yO(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
            else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_UNQUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentAttr.value += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.QUOTATION_MARK || A === L1.APOSTROPHE || A === L1.LESS_THAN_SIGN || A === L1.EQUALS_SIGN || A === L1.GRAVE_ACCENT) this._err(MA.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += Aj(A);
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this.currentAttr.value += Aj(A)
        } ["AFTER_ATTRIBUTE_VALUE_QUOTED_STATE"](A) {
            if (yO(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
            else if (A === L1.SOLIDUS) this._leaveAttrValue("SELF_CLOSING_START_TAG_STATE");
            else if (A === L1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this._err(MA.missingWhitespaceBetweenAttributes), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
        } ["SELF_CLOSING_START_TAG_STATE"](A) {
            if (A === L1.GREATER_THAN_SIGN) this.currentToken.selfClosing = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInTag), this._emitEOFToken();
            else this._err(MA.unexpectedSolidusInTag), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
        } ["BOGUS_COMMENT_STATE"](A) {
            if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._emitCurrentToken(), this._emitEOFToken();
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.data += G2.REPLACEMENT_CHARACTER;
            else this.currentToken.data += Aj(A)
        } ["MARKUP_DECLARATION_OPEN_STATE"](A) {
            if (this._consumeSequenceIfMatch(T96.DASH_DASH_STRING, A, !0)) this._createCommentToken(), this.state = "COMMENT_START_STATE";
            else if (this._consumeSequenceIfMatch(T96.DOCTYPE_STRING, A, !1)) this.state = "DOCTYPE_STATE";
            else if (this._consumeSequenceIfMatch(T96.CDATA_START_STRING, A, !0))
                if (this.allowCDATA) this.state = "CDATA_SECTION_STATE";
                else this._err(MA.cdataInHtmlContent), this._createCommentToken(), this.currentToken.data = "[CDATA[", this.state = "BOGUS_COMMENT_STATE";
            else if (!this._ensureHibernation()) this._err(MA.incorrectlyOpenedComment), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
        } ["COMMENT_START_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_START_DASH_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_START_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_DASH_STATE";
            else if (A === L1.LESS_THAN_SIGN) this.currentToken.data += "<", this.state = "COMMENT_LESS_THAN_SIGN_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.data += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.EOF) this._err(MA.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += Aj(A)
        } ["COMMENT_LESS_THAN_SIGN_STATE"](A) {
            if (A === L1.EXCLAMATION_MARK) this.currentToken.data += "!", this.state = "COMMENT_LESS_THAN_SIGN_BANG_STATE";
            else if (A === L1.LESS_THAN_SIGN) this.currentToken.data += "!";
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE";
            else this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE";
            else this._reconsumeInState("COMMENT_END_DASH_STATE")
        } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE"](A) {
            if (A !== L1.GREATER_THAN_SIGN && A !== L1.EOF) this._err(MA.nestedComment);
            this._reconsumeInState("COMMENT_END_STATE")
        } ["COMMENT_END_DASH_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
            else if (A === L1.EOF) this._err(MA.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_END_STATE"](A) {
            if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EXCLAMATION_MARK) this.state = "COMMENT_END_BANG_STATE";
            else if (A === L1.HYPHEN_MINUS) this.currentToken.data += "-";
            else if (A === L1.EOF) this._err(MA.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "--", this._reconsumeInState("COMMENT_STATE")
        } ["COMMENT_END_BANG_STATE"](A) {
            if (A === L1.HYPHEN_MINUS) this.currentToken.data += "--!", this.state = "COMMENT_END_DASH_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.incorrectlyClosedComment), this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.data += "--!", this._reconsumeInState("COMMENT_STATE")
        } ["DOCTYPE_STATE"](A) {
            if (yO(A)) this.state = "BEFORE_DOCTYPE_NAME_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE");
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingWhitespaceBeforeDoctypeName), this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE")
        } ["BEFORE_DOCTYPE_NAME_STATE"](A) {
            if (yO(A)) return;
            if (cI(A)) this._createDoctypeToken(Pe(A)), this.state = "DOCTYPE_NAME_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this._createDoctypeToken(G2.REPLACEMENT_CHARACTER), this.state = "DOCTYPE_NAME_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingDoctypeName), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._createDoctypeToken(Aj(A)), this.state = "DOCTYPE_NAME_STATE"
        } ["DOCTYPE_NAME_STATE"](A) {
            if (yO(A)) this.state = "AFTER_DOCTYPE_NAME_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (cI(A)) this.currentToken.name += Pe(A);
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.name += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.name += Aj(A)
        } ["AFTER_DOCTYPE_NAME_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else if (this._consumeSequenceIfMatch(T96.PUBLIC_STRING, A, !1)) this.state = "AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE";
            else if (this._consumeSequenceIfMatch(T96.SYSTEM_STRING, A, !1)) this.state = "AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE";
            else if (!this._ensureHibernation()) this._err(MA.invalidCharacterSequenceAfterDoctypeName), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE"](A) {
            if (yO(A)) this.state = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === L1.QUOTATION_MARK) this._err(MA.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this._err(MA.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.QUOTATION_MARK) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
            if (A === L1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.publicId += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.publicId += Aj(A)
        } ["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
            if (A === L1.APOSTROPHE) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.publicId += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.publicId += Aj(A)
        } ["AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
            if (yO(A)) this.state = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.QUOTATION_MARK) this._err(MA.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this._err(MA.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE"](A) {
            if (yO(A)) this.state = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === L1.QUOTATION_MARK) this._err(MA.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this._err(MA.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
            else if (A === L1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
            if (A === L1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.systemId += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.systemId += Aj(A)
        } ["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
            if (A === L1.APOSTROPHE) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter), this.currentToken.systemId += G2.REPLACEMENT_CHARACTER;
            else if (A === L1.GREATER_THAN_SIGN) this._err(MA.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this.currentToken.systemId += Aj(A)
        } ["AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
            if (yO(A)) return;
            if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.EOF) this._err(MA.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
            else this._err(MA.unexpectedCharacterAfterDoctypeSystemIdentifier), this._reconsumeInState("BOGUS_DOCTYPE_STATE")
        } ["BOGUS_DOCTYPE_STATE"](A) {
            if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
            else if (A === L1.NULL) this._err(MA.unexpectedNullCharacter);
            else if (A === L1.EOF) this._emitCurrentToken(), this._emitEOFToken()
        } ["CDATA_SECTION_STATE"](A) {
            if (A === L1.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_BRACKET_STATE";
            else if (A === L1.EOF) this._err(MA.eofInCdata), this._emitEOFToken();
            else this._emitCodePoint(A)
        } ["CDATA_SECTION_BRACKET_STATE"](A) {
            if (A === L1.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_END_STATE";
            else this._emitChars("]"), this._reconsumeInState("CDATA_SECTION_STATE")
        } ["CDATA_SECTION_END_STATE"](A) {
            if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE";
            else if (A === L1.RIGHT_SQUARE_BRACKET) this._emitChars("]");
            else this._emitChars("]]"), this._reconsumeInState("CDATA_SECTION_STATE")
        } ["CHARACTER_REFERENCE_STATE"](A) {
            if (this.tempBuff = [L1.AMPERSAND], A === L1.NUMBER_SIGN) this.tempBuff.push(A), this.state = "NUMERIC_CHARACTER_REFERENCE_STATE";
            else if (aE8(A)) this._reconsumeInState("NAMED_CHARACTER_REFERENCE_STATE");
            else this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["NAMED_CHARACTER_REFERENCE_STATE"](A) {
            let q = this._matchNamedCharacterReference(A);
            if (this._ensureHibernation()) this.tempBuff = [L1.AMPERSAND];
            else if (q) {
                let K = this.tempBuff[this.tempBuff.length - 1] === L1.SEMICOLON;
                if (!this._isCharacterReferenceAttributeQuirk(K)) {
                    if (!K) this._errOnNextCodePoint(MA.missingSemicolonAfterCharacterReference);
                    this.tempBuff = q
                }
                this._flushCodePointsConsumedAsCharacterReference(), this.state = this.returnState
            } else this._flushCodePointsConsumedAsCharacterReference(), this.state = "AMBIGUOS_AMPERSAND_STATE"
        } ["AMBIGUOS_AMPERSAND_STATE"](A) {
            if (aE8(A))
                if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += Aj(A);
                else this._emitCodePoint(A);
            else {
                if (A === L1.SEMICOLON) this._err(MA.unknownNamedCharacterReference);
                this._reconsumeInState(this.returnState)
            }
        } ["NUMERIC_CHARACTER_REFERENCE_STATE"](A) {
            if (this.charRefCode = 0, A === L1.LATIN_SMALL_X || A === L1.LATIN_CAPITAL_X) this.tempBuff.push(A), this.state = "HEXADEMICAL_CHARACTER_REFERENCE_START_STATE";
            else this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_START_STATE")
        } ["HEXADEMICAL_CHARACTER_REFERENCE_START_STATE"](A) {
            if (br9(A)) this._reconsumeInState("HEXADEMICAL_CHARACTER_REFERENCE_STATE");
            else this._err(MA.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["DECIMAL_CHARACTER_REFERENCE_START_STATE"](A) {
            if (fQ6(A)) this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_STATE");
            else this._err(MA.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        } ["HEXADEMICAL_CHARACTER_REFERENCE_STATE"](A) {
            if (gX4(A)) this.charRefCode = this.charRefCode * 16 + A - 55;
            else if (FX4(A)) this.charRefCode = this.charRefCode * 16 + A - 87;
            else if (fQ6(A)) this.charRefCode = this.charRefCode * 16 + A - 48;
            else if (A === L1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
            else this._err(MA.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
        } ["DECIMAL_CHARACTER_REFERENCE_STATE"](A) {
            if (fQ6(A)) this.charRefCode = this.charRefCode * 10 + A - 48;
            else if (A === L1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
            else this._err(MA.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
        } ["NUMERIC_CHARACTER_REFERENCE_END_STATE"]() {
            if (this.charRefCode === L1.NULL) this._err(MA.nullCharacterReference), this.charRefCode = L1.REPLACEMENT_CHARACTER;
            else if (this.charRefCode > 1114111) this._err(MA.characterReferenceOutsideUnicodeRange), this.charRefCode = L1.REPLACEMENT_CHARACTER;
            else if (G2.isSurrogate(this.charRefCode)) this._err(MA.surrogateCharacterReference), this.charRefCode = L1.REPLACEMENT_CHARACTER;
            else if (G2.isUndefinedCodePoint(this.charRefCode)) this._err(MA.noncharacterCharacterReference);
            else if (G2.isControlCodePoint(this.charRefCode) || this.charRefCode === L1.CARRIAGE_RETURN) {
                this._err(MA.controlCharacterReference);
                let A = Ir9[this.charRefCode];
                if (A) this.charRefCode = A
            }
            this.tempBuff = [this.charRefCode], this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
        }
    }
    Qw.CHARACTER_TOKEN = "CHARACTER_TOKEN";
    Qw.NULL_CHARACTER_TOKEN = "NULL_CHARACTER_TOKEN";
    Qw.WHITESPACE_CHARACTER_TOKEN = "WHITESPACE_CHARACTER_TOKEN";
    Qw.START_TAG_TOKEN = "START_TAG_TOKEN";
    Qw.END_TAG_TOKEN = "END_TAG_TOKEN";
    Qw.COMMENT_TOKEN = "COMMENT_TOKEN";
    Qw.DOCTYPE_TOKEN = "DOCTYPE_TOKEN";
    Qw.EOF_TOKEN = "EOF_TOKEN";
    Qw.HIBERNATION_TOKEN = "HIBERNATION_TOKEN";
    Qw.MODE = {
        DATA: "DATA_STATE",
        RCDATA: "RCDATA_STATE",
        RAWTEXT: "RAWTEXT_STATE",
        SCRIPT_DATA: "SCRIPT_DATA_STATE",
        PLAINTEXT: "PLAINTEXT_STATE"
    };
    Qw.getTokenAttr = function(A, q) {
        for (let K = A.attrs.length - 1; K >= 0; K--)
            if (A.attrs[K].name === q) return A.attrs[K].value;
        return null
    };
    pX4.exports = Qw
})
// @from(Ln 268893, Col 4)
Ze = x((xr9) => {
    var sE8 = xr9.NAMESPACES = {
        HTML: "http://www.w3.org/1999/xhtml",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/"
    };
    xr9.ATTRS = {
        TYPE: "type",
        ACTION: "action",
        ENCODING: "encoding",
        PROMPT: "prompt",
        NAME: "name",
        COLOR: "color",
        FACE: "face",
        SIZE: "size"
    };
    xr9.DOCUMENT_MODE = {
        NO_QUIRKS: "no-quirks",
        QUIRKS: "quirks",
        LIMITED_QUIRKS: "limited-quirks"
    };
    var O7 = xr9.TAG_NAMES = {
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
    xr9.SPECIAL_ELEMENTS = {
        [sE8.HTML]: {
            [O7.ADDRESS]: !0,
            [O7.APPLET]: !0,
            [O7.AREA]: !0,
            [O7.ARTICLE]: !0,
            [O7.ASIDE]: !0,
            [O7.BASE]: !0,
            [O7.BASEFONT]: !0,
            [O7.BGSOUND]: !0,
            [O7.BLOCKQUOTE]: !0,
            [O7.BODY]: !0,
            [O7.BR]: !0,
            [O7.BUTTON]: !0,
            [O7.CAPTION]: !0,
            [O7.CENTER]: !0,
            [O7.COL]: !0,
            [O7.COLGROUP]: !0,
            [O7.DD]: !0,
            [O7.DETAILS]: !0,
            [O7.DIR]: !0,
            [O7.DIV]: !0,
            [O7.DL]: !0,
            [O7.DT]: !0,
            [O7.EMBED]: !0,
            [O7.FIELDSET]: !0,
            [O7.FIGCAPTION]: !0,
            [O7.FIGURE]: !0,
            [O7.FOOTER]: !0,
            [O7.FORM]: !0,
            [O7.FRAME]: !0,
            [O7.FRAMESET]: !0,
            [O7.H1]: !0,
            [O7.H2]: !0,
            [O7.H3]: !0,
            [O7.H4]: !0,
            [O7.H5]: !0,
            [O7.H6]: !0,
            [O7.HEAD]: !0,
            [O7.HEADER]: !0,
            [O7.HGROUP]: !0,
            [O7.HR]: !0,
            [O7.HTML]: !0,
            [O7.IFRAME]: !0,
            [O7.IMG]: !0,
            [O7.INPUT]: !0,
            [O7.LI]: !0,
            [O7.LINK]: !0,
            [O7.LISTING]: !0,
            [O7.MAIN]: !0,
            [O7.MARQUEE]: !0,
            [O7.MENU]: !0,
            [O7.META]: !0,
            [O7.NAV]: !0,
            [O7.NOEMBED]: !0,
            [O7.NOFRAMES]: !0,
            [O7.NOSCRIPT]: !0,
            [O7.OBJECT]: !0,
            [O7.OL]: !0,
            [O7.P]: !0,
            [O7.PARAM]: !0,
            [O7.PLAINTEXT]: !0,
            [O7.PRE]: !0,
            [O7.SCRIPT]: !0,
            [O7.SECTION]: !0,
            [O7.SELECT]: !0,
            [O7.SOURCE]: !0,
            [O7.STYLE]: !0,
            [O7.SUMMARY]: !0,
            [O7.TABLE]: !0,
            [O7.TBODY]: !0,
            [O7.TD]: !0,
            [O7.TEMPLATE]: !0,
            [O7.TEXTAREA]: !0,
            [O7.TFOOT]: !0,
            [O7.TH]: !0,
            [O7.THEAD]: !0,
            [O7.TITLE]: !0,
            [O7.TR]: !0,
            [O7.TRACK]: !0,
            [O7.UL]: !0,
            [O7.WBR]: !0,
            [O7.XMP]: !0
        },
        [sE8.MATHML]: {
            [O7.MI]: !0,
            [O7.MO]: !0,
            [O7.MN]: !0,
            [O7.MS]: !0,
            [O7.MTEXT]: !0,
            [O7.ANNOTATION_XML]: !0
        },
        [sE8.SVG]: {
            [O7.TITLE]: !0,
            [O7.FOREIGN_OBJECT]: !0,
            [O7.DESC]: !0
        }
    }
})
// @from(Ln 269140, Col 4)
lX4 = x((E5w, cX4) => {
    var UX4 = Ze(),
        X7 = UX4.TAG_NAMES,
        f2 = UX4.NAMESPACES;

    function QX4(A) {
        switch (A.length) {
            case 1:
                return A === X7.P;
            case 2:
                return A === X7.RB || A === X7.RP || A === X7.RT || A === X7.DD || A === X7.DT || A === X7.LI;
            case 3:
                return A === X7.RTC;
            case 6:
                return A === X7.OPTION;
            case 8:
                return A === X7.OPTGROUP
        }
        return !1
    }

    function gr9(A) {
        switch (A.length) {
            case 1:
                return A === X7.P;
            case 2:
                return A === X7.RB || A === X7.RP || A === X7.RT || A === X7.DD || A === X7.DT || A === X7.LI || A === X7.TD || A === X7.TH || A === X7.TR;
            case 3:
                return A === X7.RTC;
            case 5:
                return A === X7.TBODY || A === X7.TFOOT || A === X7.THEAD;
            case 6:
                return A === X7.OPTION;
            case 7:
                return A === X7.CAPTION;
            case 8:
                return A === X7.OPTGROUP || A === X7.COLGROUP
        }
        return !1
    }

    function lW1(A, q) {
        switch (A.length) {
            case 2:
                if (A === X7.TD || A === X7.TH) return q === f2.HTML;
                else if (A === X7.MI || A === X7.MO || A === X7.MN || A === X7.MS) return q === f2.MATHML;
                break;
            case 4:
                if (A === X7.HTML) return q === f2.HTML;
                else if (A === X7.DESC) return q === f2.SVG;
                break;
            case 5:
                if (A === X7.TABLE) return q === f2.HTML;
                else if (A === X7.MTEXT) return q === f2.MATHML;
                else if (A === X7.TITLE) return q === f2.SVG;
                break;
            case 6:
                return (A === X7.APPLET || A === X7.OBJECT) && q === f2.HTML;
            case 7:
                return (A === X7.CAPTION || A === X7.MARQUEE) && q === f2.HTML;
            case 8:
                return A === X7.TEMPLATE && q === f2.HTML;
            case 13:
                return A === X7.FOREIGN_OBJECT && q === f2.SVG;
            case 14:
                return A === X7.ANNOTATION_XML && q === f2.MATHML
        }
        return !1
    }
    class dX4 {
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
            return this.currentTagName === X7.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === f2.HTML
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
                if (this.pop(), q === A && K === f2.HTML) break
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
                if (this.pop(), A === X7.H1 || A === X7.H2 || A === X7.H3 || A === X7.H4 || A === X7.H5 || A === X7.H6 && q === f2.HTML) break
            }
        }
        popUntilTableCellPopped() {
            while (this.stackTop > -1) {
                let A = this.currentTagName,
                    q = this.treeAdapter.getNamespaceURI(this.current);
                if (this.pop(), A === X7.TD || A === X7.TH && q === f2.HTML) break
            }
        }
        popAllUpToHtmlElement() {
            this.stackTop = 0, this._updateCurrentElement()
        }
        clearBackToTableContext() {
            while (this.currentTagName !== X7.TABLE && this.currentTagName !== X7.TEMPLATE && this.currentTagName !== X7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== f2.HTML) this.pop()
        }
        clearBackToTableBodyContext() {
            while (this.currentTagName !== X7.TBODY && this.currentTagName !== X7.TFOOT && this.currentTagName !== X7.THEAD && this.currentTagName !== X7.TEMPLATE && this.currentTagName !== X7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== f2.HTML) this.pop()
        }
        clearBackToTableRowContext() {
            while (this.currentTagName !== X7.TR && this.currentTagName !== X7.TEMPLATE && this.currentTagName !== X7.HTML || this.treeAdapter.getNamespaceURI(this.current) !== f2.HTML) this.pop()
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
            return A && this.treeAdapter.getTagName(A) === X7.BODY ? A : null
        }
        contains(A) {
            return this._indexOf(A) > -1
        }
        getCommonAncestor(A) {
            let q = this._indexOf(A);
            return --q >= 0 ? this.items[q] : null
        }
        isRootHtmlElementCurrent() {
            return this.stackTop === 0 && this.currentTagName === X7.HTML
        }
        hasInScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === f2.HTML) return !0;
                if (lW1(K, Y)) return !1
            }
            return !0
        }
        hasNumberedHeaderInScope() {
            for (let A = this.stackTop; A >= 0; A--) {
                let q = this.treeAdapter.getTagName(this.items[A]),
                    K = this.treeAdapter.getNamespaceURI(this.items[A]);
                if ((q === X7.H1 || q === X7.H2 || q === X7.H3 || q === X7.H4 || q === X7.H5 || q === X7.H6) && K === f2.HTML) return !0;
                if (lW1(q, K)) return !1
            }
            return !0
        }
        hasInListItemScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === f2.HTML) return !0;
                if ((K === X7.UL || K === X7.OL) && Y === f2.HTML || lW1(K, Y)) return !1
            }
            return !0
        }
        hasInButtonScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]),
                    Y = this.treeAdapter.getNamespaceURI(this.items[q]);
                if (K === A && Y === f2.HTML) return !0;
                if (K === X7.BUTTON && Y === f2.HTML || lW1(K, Y)) return !1
            }
            return !0
        }
        hasInTableScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]);
                if (this.treeAdapter.getNamespaceURI(this.items[q]) !== f2.HTML) continue;
                if (K === A) return !0;
                if (K === X7.TABLE || K === X7.TEMPLATE || K === X7.HTML) return !1
            }
            return !0
        }
        hasTableBodyContextInTableScope() {
            for (let A = this.stackTop; A >= 0; A--) {
                let q = this.treeAdapter.getTagName(this.items[A]);
                if (this.treeAdapter.getNamespaceURI(this.items[A]) !== f2.HTML) continue;
                if (q === X7.TBODY || q === X7.THEAD || q === X7.TFOOT) return !0;
                if (q === X7.TABLE || q === X7.HTML) return !1
            }
            return !0
        }
        hasInSelectScope(A) {
            for (let q = this.stackTop; q >= 0; q--) {
                let K = this.treeAdapter.getTagName(this.items[q]);
                if (this.treeAdapter.getNamespaceURI(this.items[q]) !== f2.HTML) continue;
                if (K === A) return !0;
                if (K !== X7.OPTION && K !== X7.OPTGROUP) return !1
            }
            return !0
        }
        generateImpliedEndTags() {
            while (QX4(this.currentTagName)) this.pop()
        }
        generateImpliedEndTagsThoroughly() {
            while (gr9(this.currentTagName)) this.pop()
        }
        generateImpliedEndTagsWithExclusion(A) {
            while (QX4(this.currentTagName) && this.currentTagName !== A) this.pop()
        }
    }
    cX4.exports = dX4
})
// @from(Ln 269377, Col 4)
nX4 = x((y5w, iX4) => {
    class lI {
        constructor(A) {
            this.length = 0, this.entries = [], this.treeAdapter = A, this.bookmark = null
        }
        _getNoahArkConditionCandidates(A) {
            let q = [];
            if (this.length >= 3) {
                let K = this.treeAdapter.getAttrList(A).length,
                    Y = this.treeAdapter.getTagName(A),
                    z = this.treeAdapter.getNamespaceURI(A);
                for (let _ = this.length - 1; _ >= 0; _--) {
                    let w = this.entries[_];
                    if (w.type === lI.MARKER_ENTRY) break;
                    let O = w.element,
                        $ = this.treeAdapter.getAttrList(O);
                    if (this.treeAdapter.getTagName(O) === Y && this.treeAdapter.getNamespaceURI(O) === z && $.length === K) q.push({
                        idx: _,
                        attrs: $
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
                    _ = Object.create(null);
                for (let w = 0; w < z; w++) {
                    let O = Y[w];
                    _[O.name] = O.value
                }
                for (let w = 0; w < z; w++)
                    for (let O = 0; O < K; O++) {
                        let $ = q[O].attrs[w];
                        if (_[$.name] !== $.value) q.splice(O, 1), K--;
                        if (q.length < 3) return
                    }
                for (let w = K - 1; w >= 2; w--) this.entries.splice(q[w].idx, 1), this.length--
            }
        }
        insertMarker() {
            this.entries.push({
                type: lI.MARKER_ENTRY
            }), this.length++
        }
        pushElement(A, q) {
            this._ensureNoahArkCondition(A), this.entries.push({
                type: lI.ELEMENT_ENTRY,
                element: A,
                token: q
            }), this.length++
        }
        insertElementAfterBookmark(A, q) {
            let K = this.length - 1;
            for (; K >= 0; K--)
                if (this.entries[K] === this.bookmark) break;
            this.entries.splice(K + 1, 0, {
                type: lI.ELEMENT_ENTRY,
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
                if (this.length--, A.type === lI.MARKER_ENTRY) break
            }
        }
        getElementEntryInScopeWithTagName(A) {
            for (let q = this.length - 1; q >= 0; q--) {
                let K = this.entries[q];
                if (K.type === lI.MARKER_ENTRY) return null;
                if (this.treeAdapter.getTagName(K.element) === A) return K
            }
            return null
        }
        getElementEntry(A) {
            for (let q = this.length - 1; q >= 0; q--) {
                let K = this.entries[q];
                if (K.type === lI.ELEMENT_ENTRY && K.element === A) return K
            }
            return null
        }
    }
    lI.MARKER_ENTRY = "MARKER_ENTRY";
    lI.ELEMENT_ENTRY = "ELEMENT_ENTRY";
    iX4.exports = lI
})
// @from(Ln 269476, Col 4)
Ag = x((L5w, rX4) => {
    class tE8 {
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
    tE8.install = function(A, q, K) {
        if (!A.__mixins) A.__mixins = [];
        for (let z = 0; z < A.__mixins.length; z++)
            if (A.__mixins[z].constructor === q) return A.__mixins[z];
        let Y = new q(A, K);
        return A.__mixins.push(Y), Y
    };
    rX4.exports = tE8
})
// @from(Ln 269497, Col 4)
eE8 = x((R5w, aX4) => {
    var Fr9 = Ag();
    class oX4 extends Fr9 {
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
    aX4.exports = oX4
})
// @from(Ln 269529, Col 4)
qy8 = x((h5w, eX4) => {
    var sX4 = Ag(),
        Ay8 = TQ6(),
        pr9 = eE8();
    class tX4 extends sX4 {
        constructor(A) {
            super(A);
            this.tokenizer = A, this.posTracker = sX4.install(A.preprocessor, pr9), this.currentAttrLocation = null, this.ctLoc = null
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
                    if (this.currentToken.type === Ay8.EOF_TOKEN) Y.endLine = Y.startLine, Y.endCol = Y.startCol, Y.endOffset = Y.startOffset;
                    else Y.endLine = A.posTracker.line, Y.endCol = A.posTracker.col + 1, Y.endOffset = A.posTracker.offset + 1;
                    q._emitCurrentToken.call(this)
                },
                _emitCurrentCharacterToken() {
                    let Y = this.currentCharacterToken && this.currentCharacterToken.location;
                    if (Y && Y.endOffset === -1) Y.endLine = A.posTracker.line, Y.endCol = A.posTracker.col, Y.endOffset = A.posTracker.offset;
                    q._emitCurrentCharacterToken.call(this)
                }
            };
            return Object.keys(Ay8.MODE).forEach((Y) => {
                let z = Ay8.MODE[Y];
                K[z] = function(_) {
                    A.ctLoc = A._getCurrentLocation(), q[z].call(this, _)
                }
            }), K
        }
    }
    eX4.exports = tX4
})
// @from(Ln 269607, Col 4)
KP4 = x((S5w, qP4) => {
    var Qr9 = Ag();
    class AP4 extends Qr9 {
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
    qP4.exports = AP4
})
// @from(Ln 269631, Col 4)
wP4 = x((C5w, _P4) => {
    var Ky8 = Ag(),
        YP4 = TQ6(),
        Ur9 = qy8(),
        dr9 = KP4(),
        cr9 = Ze(),
        Yy8 = cr9.TAG_NAMES;
    class zP4 extends Ky8 {
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
                    if (q.type === YP4.END_TAG_TOKEN && z === q.tagName) K.endTag = Object.assign({}, Y), K.endLine = Y.endLine, K.endCol = Y.endCol, K.endOffset = Y.endOffset;
                    else K.endLine = Y.startLine, K.endCol = Y.startCol, K.endOffset = Y.startOffset
                }
            }
        }
        _getOverriddenMethods(A, q) {
            return {
                _bootstrap(K, Y) {
                    q._bootstrap.call(this, K, Y), A.lastStartTagToken = null, A.lastFosterParentingLocation = null, A.currentToken = null;
                    let z = Ky8.install(this.tokenizer, Ur9);
                    A.posTracker = z.posTracker, Ky8.install(this.openElements, dr9, {
                        onItemPop: function(_) {
                            A._setEndLocation(_, A.currentToken)
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
                    if (A.currentToken = K, q._processToken.call(this, K), K.type === YP4.END_TAG_TOKEN && (K.tagName === Yy8.HTML || K.tagName === Yy8.BODY && this.openElements.hasInScope(Yy8.BODY)))
                        for (let z = this.openElements.stackTop; z >= 0; z--) {
                            let _ = this.openElements.items[z];
                            if (this.treeAdapter.getTagName(_) === K.tagName) {
                                A._setEndLocation(_, K);
                                break
                            }
                        }
                },
                _setDocumentType(K) {
                    q._setDocumentType.call(this, K);
                    let Y = this.treeAdapter.getChildNodes(this.document),
                        z = Y.length;
                    for (let _ = 0; _ < z; _++) {
                        let w = Y[_];
                        if (this.treeAdapter.isDocumentTypeNode(w)) {
                            this.treeAdapter.setNodeSourceCodeLocation(w, K.location);
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
                        _ = z[z.length - 1];
                    this.treeAdapter.setNodeSourceCodeLocation(_, K.location)
                },
                _findFosterParentingLocation() {
                    return A.lastFosterParentingLocation = q._findFosterParentingLocation.call(this), A.lastFosterParentingLocation
                },
                _insertCharacters(K) {
                    q._insertCharacters.call(this, K);
                    let Y = this._shouldFosterParentOnInsertion(),
                        z = Y && A.lastFosterParentingLocation.parent || this.openElements.currentTmplContent || this.openElements.current,
                        _ = this.treeAdapter.getChildNodes(z),
                        w = Y && A.lastFosterParentingLocation.beforeElement ? _.indexOf(A.lastFosterParentingLocation.beforeElement) - 1 : _.length - 1,
                        O = _[w],
                        $ = this.treeAdapter.getNodeSourceCodeLocation(O);
                    if ($) $.endLine = K.location.endLine, $.endCol = K.location.endCol, $.endOffset = K.location.endOffset;
                    else this.treeAdapter.setNodeSourceCodeLocation(O, K.location)
                }
            }
        }
    }
    _P4.exports = zP4
})
// @from(Ln 269741, Col 4)
iW1 = x((I5w, $P4) => {
    var lr9 = Ag();
    class OP4 extends lr9 {
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
    $P4.exports = OP4
})
// @from(Ln 269773, Col 4)
JP4 = x((b5w, jP4) => {
    var ir9 = iW1(),
        nr9 = eE8(),
        rr9 = Ag();
    class HP4 extends ir9 {
        constructor(A, q) {
            super(A, q);
            this.posTracker = rr9.install(A, nr9), this.lastErrOffset = -1
        }
        _reportError(A) {
            if (this.lastErrOffset !== this.posTracker.offset) this.lastErrOffset = this.posTracker.offset, super._reportError(A)
        }
    }
    jP4.exports = HP4
})
// @from(Ln 269788, Col 4)
XP4 = x((x5w, DP4) => {
    var or9 = iW1(),
        ar9 = JP4(),
        sr9 = Ag();
    class MP4 extends or9 {
        constructor(A, q) {
            super(A, q);
            let K = sr9.install(A.preprocessor, ar9, q);
            this.posTracker = K.posTracker
        }
    }
    DP4.exports = MP4
})
// @from(Ln 269801, Col 4)
GP4 = x((u5w, ZP4) => {
    var tr9 = iW1(),
        er9 = XP4(),
        Ao9 = qy8(),
        PP4 = Ag();
    class WP4 extends tr9 {
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
                    q._bootstrap.call(this, K, Y), PP4.install(this.tokenizer, er9, A.opts), PP4.install(this.tokenizer, Ao9)
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
    ZP4.exports = WP4
})
// @from(Ln 269830, Col 4)
zy8 = x((Yo9) => {
    var {
        DOCUMENT_MODE: qo9
    } = Ze();
    Yo9.createDocument = function() {
        return {
            nodeName: "#document",
            mode: qo9.NO_QUIRKS,
            childNodes: []
        }
    };
    Yo9.createDocumentFragment = function() {
        return {
            nodeName: "#document-fragment",
            childNodes: []
        }
    };
    Yo9.createElement = function(A, q, K) {
        return {
            nodeName: A,
            tagName: A,
            attrs: K,
            namespaceURI: q,
            childNodes: [],
            parentNode: null
        }
    };
    Yo9.createCommentNode = function(A) {
        return {
            nodeName: "#comment",
            data: A,
            parentNode: null
        }
    };
    var fP4 = function(A) {
            return {
                nodeName: "#text",
                value: A,
                parentNode: null
            }
        },
        TP4 = Yo9.appendChild = function(A, q) {
            A.childNodes.push(q), q.parentNode = A
        },
        Ko9 = Yo9.insertBefore = function(A, q, K) {
            let Y = A.childNodes.indexOf(K);
            A.childNodes.splice(Y, 0, q), q.parentNode = A
        };
    Yo9.setTemplateContent = function(A, q) {
        A.content = q
    };
    Yo9.getTemplateContent = function(A) {
        return A.content
    };
    Yo9.setDocumentType = function(A, q, K, Y) {
        let z = null;
        for (let _ = 0; _ < A.childNodes.length; _++)
            if (A.childNodes[_].nodeName === "#documentType") {
                z = A.childNodes[_];
                break
            } if (z) z.name = q, z.publicId = K, z.systemId = Y;
        else TP4(A, {
            nodeName: "#documentType",
            name: q,
            publicId: K,
            systemId: Y
        })
    };
    Yo9.setDocumentMode = function(A, q) {
        A.mode = q
    };
    Yo9.getDocumentMode = function(A) {
        return A.mode
    };
    Yo9.detachNode = function(A) {
        if (A.parentNode) {
            let q = A.parentNode.childNodes.indexOf(A);
            A.parentNode.childNodes.splice(q, 1), A.parentNode = null
        }
    };
    Yo9.insertText = function(A, q) {
        if (A.childNodes.length) {
            let K = A.childNodes[A.childNodes.length - 1];
            if (K.nodeName === "#text") {
                K.value += q;
                return
            }
        }
        TP4(A, fP4(q))
    };
    Yo9.insertTextBefore = function(A, q, K) {
        let Y = A.childNodes[A.childNodes.indexOf(K) - 1];
        if (Y && Y.nodeName === "#text") Y.value += q;
        else Ko9(A, fP4(q), K)
    };
    Yo9.adoptAttributes = function(A, q) {
        let K = [];
        for (let Y = 0; Y < A.attrs.length; Y++) K.push(A.attrs[Y].name);
        for (let Y = 0; Y < q.length; Y++)
            if (K.indexOf(q[Y].name) === -1) A.attrs.push(q[Y])
    };
    Yo9.getFirstChild = function(A) {
        return A.childNodes[0]
    };
    Yo9.getChildNodes = function(A) {
        return A.childNodes
    };
    Yo9.getParentNode = function(A) {
        return A.parentNode
    };
    Yo9.getAttrList = function(A) {
        return A.attrs
    };
    Yo9.getTagName = function(A) {
        return A.tagName
    };
    Yo9.getNamespaceURI = function(A) {
        return A.namespaceURI
    };
    Yo9.getTextNodeContent = function(A) {
        return A.value
    };
    Yo9.getCommentNodeContent = function(A) {
        return A.data
    };
    Yo9.getDocumentTypeNodeName = function(A) {
        return A.name
    };
    Yo9.getDocumentTypeNodePublicId = function(A) {
        return A.publicId
    };
    Yo9.getDocumentTypeNodeSystemId = function(A) {
        return A.systemId
    };
    Yo9.isTextNode = function(A) {
        return A.nodeName === "#text"
    };
    Yo9.isCommentNode = function(A) {
        return A.nodeName === "#comment"
    };
    Yo9.isDocumentTypeNode = function(A) {
        return A.nodeName === "#documentType"
    };
    Yo9.isElementNode = function(A) {
        return !!A.tagName
    };
    Yo9.setNodeSourceCodeLocation = function(A, q) {
        A.sourceCodeLocation = q
    };
    Yo9.getNodeSourceCodeLocation = function(A) {
        return A.sourceCodeLocation
    }
})
// @from(Ln 269983, Col 4)
_y8 = x((F5w, vP4) => {
    vP4.exports = function(q, K) {
        return K = K || Object.create(null), [q, K].reduce((Y, z) => {
            return Object.keys(z).forEach((_) => {
                Y[_] = z[_]
            }), Y
        }, Object.create(null))
    }
})
// @from(Ln 269992, Col 4)
wy8 = x((Bo9) => {
    var {
        DOCUMENT_MODE: fZ6
    } = Ze(), kP4 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], xo9 = kP4.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), uo9 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], EP4 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], mo9 = EP4.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

    function NP4(A) {
        let q = A.indexOf('"') !== -1 ? "'" : '"';
        return q + A + q
    }

    function VP4(A, q) {
        for (let K = 0; K < q.length; K++)
            if (A.indexOf(q[K]) === 0) return !0;
        return !1
    }
    Bo9.isConforming = function(A) {
        return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
    };
    Bo9.getDocumentMode = function(A) {
        if (A.name !== "html") return fZ6.QUIRKS;
        let q = A.systemId;
        if (q && q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return fZ6.QUIRKS;
        let K = A.publicId;
        if (K !== null) {
            if (K = K.toLowerCase(), uo9.indexOf(K) > -1) return fZ6.QUIRKS;
            let Y = q === null ? xo9 : kP4;
            if (VP4(K, Y)) return fZ6.QUIRKS;
            if (Y = q === null ? EP4 : mo9, VP4(K, Y)) return fZ6.LIMITED_QUIRKS
        }
        return fZ6.NO_QUIRKS
    };
    Bo9.serializeContent = function(A, q, K) {
        let Y = "!DOCTYPE ";
        if (A) Y += A;
        if (q) Y += " PUBLIC " + NP4(q);
        else if (K) Y += " SYSTEM";
        if (K !== null) Y += " " + NP4(K);
        return Y
    }
})