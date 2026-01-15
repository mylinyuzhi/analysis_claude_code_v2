
// @from(Ln 272447, Col 4)
RyA = U((sOZ, g52) => {
  var NY5 = y52(),
    kZ = wY1(),
    T4A = k52(),
    RQ = LY1(),
    O1 = kZ.CODE_POINTS,
    _4A = kZ.CODE_POINT_SEQUENCES,
    wY5 = {
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

  function SJ(A) {
    return A === O1.SPACE || A === O1.LINE_FEED || A === O1.TABULATION || A === O1.FORM_FEED
  }

  function MyA(A) {
    return A >= O1.DIGIT_0 && A <= O1.DIGIT_9
  }

  function jS(A) {
    return A >= O1.LATIN_CAPITAL_A && A <= O1.LATIN_CAPITAL_Z
  }

  function j4A(A) {
    return A >= O1.LATIN_SMALL_A && A <= O1.LATIN_SMALL_Z
  }

  function dr(A) {
    return j4A(A) || jS(A)
  }

  function $D0(A) {
    return dr(A) || MyA(A)
  }

  function f52(A) {
    return A >= O1.LATIN_CAPITAL_A && A <= O1.LATIN_CAPITAL_F
  }

  function h52(A) {
    return A >= O1.LATIN_SMALL_A && A <= O1.LATIN_SMALL_F
  }

  function LY5(A) {
    return MyA(A) || f52(A) || h52(A)
  }

  function OY1(A) {
    return A + 32
  }

  function tI(A) {
    if (A <= 65535) return String.fromCharCode(A);
    return A -= 65536, String.fromCharCode(A >>> 10 & 1023 | 55296) + String.fromCharCode(56320 | A & 1023)
  }

  function mr(A) {
    return String.fromCharCode(OY1(A))
  }

  function b52(A, Q) {
    let B = T4A[++A],
      G = ++A,
      Z = G + B - 1;
    while (G <= Z) {
      let Y = G + Z >>> 1,
        J = T4A[Y];
      if (J < Q) G = Y + 1;
      else if (J > Q) Z = Y - 1;
      else return T4A[Y + B]
    }
    return -1
  }
  class sY {
    constructor() {
      this.preprocessor = new NY5, this.tokenQueue = [], this.allowCDATA = !1, this.state = "DATA_STATE", this.returnState = "", this.charRefCode = -1, this.tempBuff = [], this.lastStartTagName = "", this.consumedAfterSnapshot = -1, this.active = !1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = null
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
    write(A, Q) {
      this.active = !0, this.preprocessor.write(A, Q)
    }
    insertHtmlAtCurrentPos(A) {
      this.active = !0, this.preprocessor.insertHtmlAtCurrentPos(A)
    }
    _ensureHibernation() {
      if (this.preprocessor.endOfChunkHit) {
        for (; this.consumedAfterSnapshot > 0; this.consumedAfterSnapshot--) this.preprocessor.retreat();
        return this.active = !1, this.tokenQueue.push({
          type: sY.HIBERNATION_TOKEN
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
    _consumeSequenceIfMatch(A, Q, B) {
      let G = 0,
        Z = !0,
        Y = A.length,
        J = 0,
        X = Q,
        I = void 0;
      for (; J < Y; J++) {
        if (J > 0) X = this._consume(), G++;
        if (X === O1.EOF) {
          Z = !1;
          break
        }
        if (I = A[J], X !== I && (B || X !== OY1(I))) {
          Z = !1;
          break
        }
      }
      if (!Z)
        while (G--) this._unconsume();
      return Z
    }
    _isTempBufferEqualToScriptString() {
      if (this.tempBuff.length !== _4A.SCRIPT_STRING.length) return !1;
      for (let A = 0; A < this.tempBuff.length; A++)
        if (this.tempBuff[A] !== _4A.SCRIPT_STRING[A]) return !1;
      return !0
    }
    _createStartTagToken() {
      this.currentToken = {
        type: sY.START_TAG_TOKEN,
        tagName: "",
        selfClosing: !1,
        ackSelfClosing: !1,
        attrs: []
      }
    }
    _createEndTagToken() {
      this.currentToken = {
        type: sY.END_TAG_TOKEN,
        tagName: "",
        selfClosing: !1,
        attrs: []
      }
    }
    _createCommentToken() {
      this.currentToken = {
        type: sY.COMMENT_TOKEN,
        data: ""
      }
    }
    _createDoctypeToken(A) {
      this.currentToken = {
        type: sY.DOCTYPE_TOKEN,
        name: A,
        forceQuirks: !1,
        publicId: null,
        systemId: null
      }
    }
    _createCharacterToken(A, Q) {
      this.currentCharacterToken = {
        type: A,
        chars: Q
      }
    }
    _createEOFToken() {
      this.currentToken = {
        type: sY.EOF_TOKEN
      }
    }
    _createAttr(A) {
      this.currentAttr = {
        name: A,
        value: ""
      }
    }
    _leaveAttrName(A) {
      if (sY.getTokenAttr(this.currentToken, this.currentAttr.name) === null) this.currentToken.attrs.push(this.currentAttr);
      else this._err(RQ.duplicateAttribute);
      this.state = A
    }
    _leaveAttrValue(A) {
      this.state = A
    }
    _emitCurrentToken() {
      this._emitCurrentCharacterToken();
      let A = this.currentToken;
      if (this.currentToken = null, A.type === sY.START_TAG_TOKEN) this.lastStartTagName = A.tagName;
      else if (A.type === sY.END_TAG_TOKEN) {
        if (A.attrs.length > 0) this._err(RQ.endTagWithAttributes);
        if (A.selfClosing) this._err(RQ.endTagWithTrailingSolidus)
      }
      this.tokenQueue.push(A)
    }
    _emitCurrentCharacterToken() {
      if (this.currentCharacterToken) this.tokenQueue.push(this.currentCharacterToken), this.currentCharacterToken = null
    }
    _emitEOFToken() {
      this._createEOFToken(), this._emitCurrentToken()
    }
    _appendCharToCurrentCharacterToken(A, Q) {
      if (this.currentCharacterToken && this.currentCharacterToken.type !== A) this._emitCurrentCharacterToken();
      if (this.currentCharacterToken) this.currentCharacterToken.chars += Q;
      else this._createCharacterToken(A, Q)
    }
    _emitCodePoint(A) {
      let Q = sY.CHARACTER_TOKEN;
      if (SJ(A)) Q = sY.WHITESPACE_CHARACTER_TOKEN;
      else if (A === O1.NULL) Q = sY.NULL_CHARACTER_TOKEN;
      this._appendCharToCurrentCharacterToken(Q, tI(A))
    }
    _emitSeveralCodePoints(A) {
      for (let Q = 0; Q < A.length; Q++) this._emitCodePoint(A[Q])
    }
    _emitChars(A) {
      this._appendCharToCurrentCharacterToken(sY.CHARACTER_TOKEN, A)
    }
    _matchNamedCharacterReference(A) {
      let Q = null,
        B = 1,
        G = b52(0, A);
      this.tempBuff.push(A);
      while (G > -1) {
        let Z = T4A[G],
          Y = Z < 7;
        if (Y && Z & 1) Q = Z & 2 ? [T4A[++G], T4A[++G]] : [T4A[++G]], B = 0;
        let X = this._consume();
        if (this.tempBuff.push(X), B++, X === O1.EOF) break;
        if (Y) G = Z & 4 ? b52(G, X) : -1;
        else G = X === Z ? ++G : -1
      }
      while (B--) this.tempBuff.pop(), this._unconsume();
      return Q
    }
    _isCharacterReferenceInAttribute() {
      return this.returnState === "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE" || this.returnState === "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE" || this.returnState === "ATTRIBUTE_VALUE_UNQUOTED_STATE"
    }
    _isCharacterReferenceAttributeQuirk(A) {
      if (!A && this._isCharacterReferenceInAttribute()) {
        let Q = this._consume();
        return this._unconsume(), Q === O1.EQUALS_SIGN || $D0(Q)
      }
      return !1
    }
    _flushCodePointsConsumedAsCharacterReference() {
      if (this._isCharacterReferenceInAttribute())
        for (let A = 0; A < this.tempBuff.length; A++) this.currentAttr.value += tI(this.tempBuff[A]);
      else this._emitSeveralCodePoints(this.tempBuff);
      this.tempBuff = []
    } ["DATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === O1.LESS_THAN_SIGN) this.state = "TAG_OPEN_STATE";
      else if (A === O1.AMPERSAND) this.returnState = "DATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitCodePoint(A);
      else if (A === O1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["RCDATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === O1.AMPERSAND) this.returnState = "RCDATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === O1.LESS_THAN_SIGN) this.state = "RCDATA_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["RAWTEXT_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === O1.LESS_THAN_SIGN) this.state = "RAWTEXT_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["PLAINTEXT_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["TAG_OPEN_STATE"](A) {
      if (A === O1.EXCLAMATION_MARK) this.state = "MARKUP_DECLARATION_OPEN_STATE";
      else if (A === O1.SOLIDUS) this.state = "END_TAG_OPEN_STATE";
      else if (dr(A)) this._createStartTagToken(), this._reconsumeInState("TAG_NAME_STATE");
      else if (A === O1.QUESTION_MARK) this._err(RQ.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE");
      else if (A === O1.EOF) this._err(RQ.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
      else this._err(RQ.invalidFirstCharacterOfTagName), this._emitChars("<"), this._reconsumeInState("DATA_STATE")
    } ["END_TAG_OPEN_STATE"](A) {
      if (dr(A)) this._createEndTagToken(), this._reconsumeInState("TAG_NAME_STATE");
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingEndTagName), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
      else this._err(RQ.invalidFirstCharacterOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
    } ["TAG_NAME_STATE"](A) {
      if (SJ(A)) this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
      else if (A === O1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (jS(A)) this.currentToken.tagName += mr(A);
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.tagName += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this.currentToken.tagName += tI(A)
    } ["RCDATA_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.SOLIDUS) this.tempBuff = [], this.state = "RCDATA_END_TAG_OPEN_STATE";
      else this._emitChars("<"), this._reconsumeInState("RCDATA_STATE")
    } ["RCDATA_END_TAG_OPEN_STATE"](A) {
      if (dr(A)) this._createEndTagToken(), this._reconsumeInState("RCDATA_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("RCDATA_STATE")
    } ["RCDATA_END_TAG_NAME_STATE"](A) {
      if (jS(A)) this.currentToken.tagName += mr(A), this.tempBuff.push(A);
      else if (j4A(A)) this.currentToken.tagName += tI(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (SJ(A)) {
            this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            return
          }
          if (A === O1.SOLIDUS) {
            this.state = "SELF_CLOSING_START_TAG_STATE";
            return
          }
          if (A === O1.GREATER_THAN_SIGN) {
            this.state = "DATA_STATE", this._emitCurrentToken();
            return
          }
        }
        this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RCDATA_STATE")
      }
    } ["RAWTEXT_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.SOLIDUS) this.tempBuff = [], this.state = "RAWTEXT_END_TAG_OPEN_STATE";
      else this._emitChars("<"), this._reconsumeInState("RAWTEXT_STATE")
    } ["RAWTEXT_END_TAG_OPEN_STATE"](A) {
      if (dr(A)) this._createEndTagToken(), this._reconsumeInState("RAWTEXT_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("RAWTEXT_STATE")
    } ["RAWTEXT_END_TAG_NAME_STATE"](A) {
      if (jS(A)) this.currentToken.tagName += mr(A), this.tempBuff.push(A);
      else if (j4A(A)) this.currentToken.tagName += tI(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (SJ(A)) {
            this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            return
          }
          if (A === O1.SOLIDUS) {
            this.state = "SELF_CLOSING_START_TAG_STATE";
            return
          }
          if (A === O1.GREATER_THAN_SIGN) {
            this._emitCurrentToken(), this.state = "DATA_STATE";
            return
          }
        }
        this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("RAWTEXT_STATE")
      }
    } ["SCRIPT_DATA_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_END_TAG_OPEN_STATE";
      else if (A === O1.EXCLAMATION_MARK) this.state = "SCRIPT_DATA_ESCAPE_START_STATE", this._emitChars("<!");
      else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_STATE")
    } ["SCRIPT_DATA_END_TAG_OPEN_STATE"](A) {
      if (dr(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_STATE")
    } ["SCRIPT_DATA_END_TAG_NAME_STATE"](A) {
      if (jS(A)) this.currentToken.tagName += mr(A), this.tempBuff.push(A);
      else if (j4A(A)) this.currentToken.tagName += tI(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (SJ(A)) {
            this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            return
          } else if (A === O1.SOLIDUS) {
            this.state = "SELF_CLOSING_START_TAG_STATE";
            return
          } else if (A === O1.GREATER_THAN_SIGN) {
            this._emitCurrentToken(), this.state = "DATA_STATE";
            return
          }
        }
        this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_STATE")
      }
    } ["SCRIPT_DATA_ESCAPE_START_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPE_START_DASH_STATE", this._emitChars("-");
      else this._reconsumeInState("SCRIPT_DATA_STATE")
    } ["SCRIPT_DATA_ESCAPE_START_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
      else this._reconsumeInState("SCRIPT_DATA_STATE")
    } ["SCRIPT_DATA_ESCAPED_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_STATE", this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_DASH_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE";
      else if (dr(A)) this.tempBuff = [], this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE");
      else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE"](A) {
      if (dr(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE"](A) {
      if (jS(A)) this.currentToken.tagName += mr(A), this.tempBuff.push(A);
      else if (j4A(A)) this.currentToken.tagName += tI(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (SJ(A)) {
            this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
            return
          }
          if (A === O1.SOLIDUS) {
            this.state = "SELF_CLOSING_START_TAG_STATE";
            return
          }
          if (A === O1.GREATER_THAN_SIGN) {
            this._emitCurrentToken(), this.state = "DATA_STATE";
            return
          }
        }
        this._emitChars("</"), this._emitSeveralCodePoints(this.tempBuff), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
      }
    } ["SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE"](A) {
      if (SJ(A) || A === O1.SOLIDUS || A === O1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_DOUBLE_ESCAPED_STATE" : "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A);
      else if (jS(A)) this.tempBuff.push(OY1(A)), this._emitCodePoint(A);
      else if (j4A(A)) this.tempBuff.push(A), this._emitCodePoint(A);
      else this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE", this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this._emitChars("-");
      else if (A === O1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === O1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(kZ.REPLACEMENT_CHARACTER);
      else if (A === O1.EOF) this._err(RQ.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE", this._emitChars("/");
      else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
    } ["SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE"](A) {
      if (SJ(A) || A === O1.SOLIDUS || A === O1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_ESCAPED_STATE" : "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A);
      else if (jS(A)) this.tempBuff.push(OY1(A)), this._emitCodePoint(A);
      else if (j4A(A)) this.tempBuff.push(A), this._emitCodePoint(A);
      else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
    } ["BEFORE_ATTRIBUTE_NAME_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.SOLIDUS || A === O1.GREATER_THAN_SIGN || A === O1.EOF) this._reconsumeInState("AFTER_ATTRIBUTE_NAME_STATE");
      else if (A === O1.EQUALS_SIGN) this._err(RQ.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = "ATTRIBUTE_NAME_STATE";
      else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
    } ["ATTRIBUTE_NAME_STATE"](A) {
      if (SJ(A) || A === O1.SOLIDUS || A === O1.GREATER_THAN_SIGN || A === O1.EOF) this._leaveAttrName("AFTER_ATTRIBUTE_NAME_STATE"), this._unconsume();
      else if (A === O1.EQUALS_SIGN) this._leaveAttrName("BEFORE_ATTRIBUTE_VALUE_STATE");
      else if (jS(A)) this.currentAttr.name += mr(A);
      else if (A === O1.QUOTATION_MARK || A === O1.APOSTROPHE || A === O1.LESS_THAN_SIGN) this._err(RQ.unexpectedCharacterInAttributeName), this.currentAttr.name += tI(A);
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentAttr.name += kZ.REPLACEMENT_CHARACTER;
      else this.currentAttr.name += tI(A)
    } ["AFTER_ATTRIBUTE_NAME_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
      else if (A === O1.EQUALS_SIGN) this.state = "BEFORE_ATTRIBUTE_VALUE_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
    } ["BEFORE_ATTRIBUTE_VALUE_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.QUOTATION_MARK) this.state = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this.state = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingAttributeValue), this.state = "DATA_STATE", this._emitCurrentToken();
      else this._reconsumeInState("ATTRIBUTE_VALUE_UNQUOTED_STATE")
    } ["ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE"](A) {
      if (A === O1.QUOTATION_MARK) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
      else if (A === O1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentAttr.value += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += tI(A)
    } ["ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE"](A) {
      if (A === O1.APOSTROPHE) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
      else if (A === O1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentAttr.value += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += tI(A)
    } ["ATTRIBUTE_VALUE_UNQUOTED_STATE"](A) {
      if (SJ(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
      else if (A === O1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_UNQUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentAttr.value += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.QUOTATION_MARK || A === O1.APOSTROPHE || A === O1.LESS_THAN_SIGN || A === O1.EQUALS_SIGN || A === O1.GRAVE_ACCENT) this._err(RQ.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += tI(A);
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += tI(A)
    } ["AFTER_ATTRIBUTE_VALUE_QUOTED_STATE"](A) {
      if (SJ(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
      else if (A === O1.SOLIDUS) this._leaveAttrValue("SELF_CLOSING_START_TAG_STATE");
      else if (A === O1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this._err(RQ.missingWhitespaceBetweenAttributes), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
    } ["SELF_CLOSING_START_TAG_STATE"](A) {
      if (A === O1.GREATER_THAN_SIGN) this.currentToken.selfClosing = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInTag), this._emitEOFToken();
      else this._err(RQ.unexpectedSolidusInTag), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
    } ["BOGUS_COMMENT_STATE"](A) {
      if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._emitCurrentToken(), this._emitEOFToken();
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.data += kZ.REPLACEMENT_CHARACTER;
      else this.currentToken.data += tI(A)
    } ["MARKUP_DECLARATION_OPEN_STATE"](A) {
      if (this._consumeSequenceIfMatch(_4A.DASH_DASH_STRING, A, !0)) this._createCommentToken(), this.state = "COMMENT_START_STATE";
      else if (this._consumeSequenceIfMatch(_4A.DOCTYPE_STRING, A, !1)) this.state = "DOCTYPE_STATE";
      else if (this._consumeSequenceIfMatch(_4A.CDATA_START_STRING, A, !0))
        if (this.allowCDATA) this.state = "CDATA_SECTION_STATE";
        else this._err(RQ.cdataInHtmlContent), this._createCommentToken(), this.currentToken.data = "[CDATA[", this.state = "BOGUS_COMMENT_STATE";
      else if (!this._ensureHibernation()) this._err(RQ.incorrectlyOpenedComment), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
    } ["COMMENT_START_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_START_DASH_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_START_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_END_DASH_STATE";
      else if (A === O1.LESS_THAN_SIGN) this.currentToken.data += "<", this.state = "COMMENT_LESS_THAN_SIGN_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.data += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.EOF) this._err(RQ.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += tI(A)
    } ["COMMENT_LESS_THAN_SIGN_STATE"](A) {
      if (A === O1.EXCLAMATION_MARK) this.currentToken.data += "!", this.state = "COMMENT_LESS_THAN_SIGN_BANG_STATE";
      else if (A === O1.LESS_THAN_SIGN) this.currentToken.data += "!";
      else this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_LESS_THAN_SIGN_BANG_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE";
      else this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE";
      else this._reconsumeInState("COMMENT_END_DASH_STATE")
    } ["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE"](A) {
      if (A !== O1.GREATER_THAN_SIGN && A !== O1.EOF) this._err(RQ.nestedComment);
      this._reconsumeInState("COMMENT_END_STATE")
    } ["COMMENT_END_DASH_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_END_STATE"](A) {
      if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EXCLAMATION_MARK) this.state = "COMMENT_END_BANG_STATE";
      else if (A === O1.HYPHEN_MINUS) this.currentToken.data += "-";
      else if (A === O1.EOF) this._err(RQ.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "--", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_END_BANG_STATE"](A) {
      if (A === O1.HYPHEN_MINUS) this.currentToken.data += "--!", this.state = "COMMENT_END_DASH_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.incorrectlyClosedComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "--!", this._reconsumeInState("COMMENT_STATE")
    } ["DOCTYPE_STATE"](A) {
      if (SJ(A)) this.state = "BEFORE_DOCTYPE_NAME_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE");
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingWhitespaceBeforeDoctypeName), this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE")
    } ["BEFORE_DOCTYPE_NAME_STATE"](A) {
      if (SJ(A)) return;
      if (jS(A)) this._createDoctypeToken(mr(A)), this.state = "DOCTYPE_NAME_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this._createDoctypeToken(kZ.REPLACEMENT_CHARACTER), this.state = "DOCTYPE_NAME_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingDoctypeName), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._createDoctypeToken(tI(A)), this.state = "DOCTYPE_NAME_STATE"
    } ["DOCTYPE_NAME_STATE"](A) {
      if (SJ(A)) this.state = "AFTER_DOCTYPE_NAME_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (jS(A)) this.currentToken.name += mr(A);
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.name += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.name += tI(A)
    } ["AFTER_DOCTYPE_NAME_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else if (this._consumeSequenceIfMatch(_4A.PUBLIC_STRING, A, !1)) this.state = "AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE";
      else if (this._consumeSequenceIfMatch(_4A.SYSTEM_STRING, A, !1)) this.state = "AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE";
      else if (!this._ensureHibernation()) this._err(RQ.invalidCharacterSequenceAfterDoctypeName), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE"](A) {
      if (SJ(A)) this.state = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === O1.QUOTATION_MARK) this._err(RQ.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this._err(RQ.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.QUOTATION_MARK) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
      if (A === O1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.publicId += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.publicId += tI(A)
    } ["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
      if (A === O1.APOSTROPHE) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.publicId += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.publicId += tI(A)
    } ["AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
      if (SJ(A)) this.state = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.QUOTATION_MARK) this._err(RQ.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this._err(RQ.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE"](A) {
      if (SJ(A)) this.state = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === O1.QUOTATION_MARK) this._err(RQ.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this._err(RQ.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === O1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
      if (A === O1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.systemId += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.systemId += tI(A)
    } ["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
      if (A === O1.APOSTROPHE) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter), this.currentToken.systemId += kZ.REPLACEMENT_CHARACTER;
      else if (A === O1.GREATER_THAN_SIGN) this._err(RQ.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.systemId += tI(A)
    } ["AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
      if (SJ(A)) return;
      if (A === O1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(RQ.unexpectedCharacterAfterDoctypeSystemIdentifier), this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BOGUS_DOCTYPE_STATE"](A) {
      if (A === O1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === O1.NULL) this._err(RQ.unexpectedNullCharacter);
      else if (A === O1.EOF) this._emitCurrentToken(), this._emitEOFToken()
    } ["CDATA_SECTION_STATE"](A) {
      if (A === O1.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_BRACKET_STATE";
      else if (A === O1.EOF) this._err(RQ.eofInCdata), this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["CDATA_SECTION_BRACKET_STATE"](A) {
      if (A === O1.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_END_STATE";
      else this._emitChars("]"), this._reconsumeInState("CDATA_SECTION_STATE")
    } ["CDATA_SECTION_END_STATE"](A) {
      if (A === O1.GREATER_THAN_SIGN) this.state = "DATA_STATE";
      else if (A === O1.RIGHT_SQUARE_BRACKET) this._emitChars("]");
      else this._emitChars("]]"), this._reconsumeInState("CDATA_SECTION_STATE")
    } ["CHARACTER_REFERENCE_STATE"](A) {
      if (this.tempBuff = [O1.AMPERSAND], A === O1.NUMBER_SIGN) this.tempBuff.push(A), this.state = "NUMERIC_CHARACTER_REFERENCE_STATE";
      else if ($D0(A)) this._reconsumeInState("NAMED_CHARACTER_REFERENCE_STATE");
      else this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["NAMED_CHARACTER_REFERENCE_STATE"](A) {
      let Q = this._matchNamedCharacterReference(A);
      if (this._ensureHibernation()) this.tempBuff = [O1.AMPERSAND];
      else if (Q) {
        let B = this.tempBuff[this.tempBuff.length - 1] === O1.SEMICOLON;
        if (!this._isCharacterReferenceAttributeQuirk(B)) {
          if (!B) this._errOnNextCodePoint(RQ.missingSemicolonAfterCharacterReference);
          this.tempBuff = Q
        }
        this._flushCodePointsConsumedAsCharacterReference(), this.state = this.returnState
      } else this._flushCodePointsConsumedAsCharacterReference(), this.state = "AMBIGUOS_AMPERSAND_STATE"
    } ["AMBIGUOS_AMPERSAND_STATE"](A) {
      if ($D0(A))
        if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += tI(A);
        else this._emitCodePoint(A);
      else {
        if (A === O1.SEMICOLON) this._err(RQ.unknownNamedCharacterReference);
        this._reconsumeInState(this.returnState)
      }
    } ["NUMERIC_CHARACTER_REFERENCE_STATE"](A) {
      if (this.charRefCode = 0, A === O1.LATIN_SMALL_X || A === O1.LATIN_CAPITAL_X) this.tempBuff.push(A), this.state = "HEXADEMICAL_CHARACTER_REFERENCE_START_STATE";
      else this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_START_STATE")
    } ["HEXADEMICAL_CHARACTER_REFERENCE_START_STATE"](A) {
      if (LY5(A)) this._reconsumeInState("HEXADEMICAL_CHARACTER_REFERENCE_STATE");
      else this._err(RQ.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["DECIMAL_CHARACTER_REFERENCE_START_STATE"](A) {
      if (MyA(A)) this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_STATE");
      else this._err(RQ.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["HEXADEMICAL_CHARACTER_REFERENCE_STATE"](A) {
      if (f52(A)) this.charRefCode = this.charRefCode * 16 + A - 55;
      else if (h52(A)) this.charRefCode = this.charRefCode * 16 + A - 87;
      else if (MyA(A)) this.charRefCode = this.charRefCode * 16 + A - 48;
      else if (A === O1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
      else this._err(RQ.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
    } ["DECIMAL_CHARACTER_REFERENCE_STATE"](A) {
      if (MyA(A)) this.charRefCode = this.charRefCode * 10 + A - 48;
      else if (A === O1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
      else this._err(RQ.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
    } ["NUMERIC_CHARACTER_REFERENCE_END_STATE"]() {
      if (this.charRefCode === O1.NULL) this._err(RQ.nullCharacterReference), this.charRefCode = O1.REPLACEMENT_CHARACTER;
      else if (this.charRefCode > 1114111) this._err(RQ.characterReferenceOutsideUnicodeRange), this.charRefCode = O1.REPLACEMENT_CHARACTER;
      else if (kZ.isSurrogate(this.charRefCode)) this._err(RQ.surrogateCharacterReference), this.charRefCode = O1.REPLACEMENT_CHARACTER;
      else if (kZ.isUndefinedCodePoint(this.charRefCode)) this._err(RQ.noncharacterCharacterReference);
      else if (kZ.isControlCodePoint(this.charRefCode) || this.charRefCode === O1.CARRIAGE_RETURN) {
        this._err(RQ.controlCharacterReference);
        let A = wY5[this.charRefCode];
        if (A) this.charRefCode = A
      }
      this.tempBuff = [this.charRefCode], this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    }
  }
  sY.CHARACTER_TOKEN = "CHARACTER_TOKEN";
  sY.NULL_CHARACTER_TOKEN = "NULL_CHARACTER_TOKEN";
  sY.WHITESPACE_CHARACTER_TOKEN = "WHITESPACE_CHARACTER_TOKEN";
  sY.START_TAG_TOKEN = "START_TAG_TOKEN";
  sY.END_TAG_TOKEN = "END_TAG_TOKEN";
  sY.COMMENT_TOKEN = "COMMENT_TOKEN";
  sY.DOCTYPE_TOKEN = "DOCTYPE_TOKEN";
  sY.EOF_TOKEN = "EOF_TOKEN";
  sY.HIBERNATION_TOKEN = "HIBERNATION_TOKEN";
  sY.MODE = {
    DATA: "DATA_STATE",
    RCDATA: "RCDATA_STATE",
    RAWTEXT: "RAWTEXT_STATE",
    SCRIPT_DATA: "SCRIPT_DATA_STATE",
    PLAINTEXT: "PLAINTEXT_STATE"
  };
  sY.getTokenAttr = function (A, Q) {
    for (let B = A.attrs.length - 1; B >= 0; B--)
      if (A.attrs[B].name === Q) return A.attrs[B].value;
    return null
  };
  g52.exports = sY
})
// @from(Ln 273243, Col 4)
cr = U((OY5) => {
  var CD0 = OY5.NAMESPACES = {
    HTML: "http://www.w3.org/1999/xhtml",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/"
  };
  OY5.ATTRS = {
    TYPE: "type",
    ACTION: "action",
    ENCODING: "encoding",
    PROMPT: "prompt",
    NAME: "name",
    COLOR: "color",
    FACE: "face",
    SIZE: "size"
  };
  OY5.DOCUMENT_MODE = {
    NO_QUIRKS: "no-quirks",
    QUIRKS: "quirks",
    LIMITED_QUIRKS: "limited-quirks"
  };
  var NB = OY5.TAG_NAMES = {
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
  OY5.SPECIAL_ELEMENTS = {
    [CD0.HTML]: {
      [NB.ADDRESS]: !0,
      [NB.APPLET]: !0,
      [NB.AREA]: !0,
      [NB.ARTICLE]: !0,
      [NB.ASIDE]: !0,
      [NB.BASE]: !0,
      [NB.BASEFONT]: !0,
      [NB.BGSOUND]: !0,
      [NB.BLOCKQUOTE]: !0,
      [NB.BODY]: !0,
      [NB.BR]: !0,
      [NB.BUTTON]: !0,
      [NB.CAPTION]: !0,
      [NB.CENTER]: !0,
      [NB.COL]: !0,
      [NB.COLGROUP]: !0,
      [NB.DD]: !0,
      [NB.DETAILS]: !0,
      [NB.DIR]: !0,
      [NB.DIV]: !0,
      [NB.DL]: !0,
      [NB.DT]: !0,
      [NB.EMBED]: !0,
      [NB.FIELDSET]: !0,
      [NB.FIGCAPTION]: !0,
      [NB.FIGURE]: !0,
      [NB.FOOTER]: !0,
      [NB.FORM]: !0,
      [NB.FRAME]: !0,
      [NB.FRAMESET]: !0,
      [NB.H1]: !0,
      [NB.H2]: !0,
      [NB.H3]: !0,
      [NB.H4]: !0,
      [NB.H5]: !0,
      [NB.H6]: !0,
      [NB.HEAD]: !0,
      [NB.HEADER]: !0,
      [NB.HGROUP]: !0,
      [NB.HR]: !0,
      [NB.HTML]: !0,
      [NB.IFRAME]: !0,
      [NB.IMG]: !0,
      [NB.INPUT]: !0,
      [NB.LI]: !0,
      [NB.LINK]: !0,
      [NB.LISTING]: !0,
      [NB.MAIN]: !0,
      [NB.MARQUEE]: !0,
      [NB.MENU]: !0,
      [NB.META]: !0,
      [NB.NAV]: !0,
      [NB.NOEMBED]: !0,
      [NB.NOFRAMES]: !0,
      [NB.NOSCRIPT]: !0,
      [NB.OBJECT]: !0,
      [NB.OL]: !0,
      [NB.P]: !0,
      [NB.PARAM]: !0,
      [NB.PLAINTEXT]: !0,
      [NB.PRE]: !0,
      [NB.SCRIPT]: !0,
      [NB.SECTION]: !0,
      [NB.SELECT]: !0,
      [NB.SOURCE]: !0,
      [NB.STYLE]: !0,
      [NB.SUMMARY]: !0,
      [NB.TABLE]: !0,
      [NB.TBODY]: !0,
      [NB.TD]: !0,
      [NB.TEMPLATE]: !0,
      [NB.TEXTAREA]: !0,
      [NB.TFOOT]: !0,
      [NB.TH]: !0,
      [NB.THEAD]: !0,
      [NB.TITLE]: !0,
      [NB.TR]: !0,
      [NB.TRACK]: !0,
      [NB.UL]: !0,
      [NB.WBR]: !0,
      [NB.XMP]: !0
    },
    [CD0.MATHML]: {
      [NB.MI]: !0,
      [NB.MO]: !0,
      [NB.MN]: !0,
      [NB.MS]: !0,
      [NB.MTEXT]: !0,
      [NB.ANNOTATION_XML]: !0
    },
    [CD0.SVG]: {
      [NB.TITLE]: !0,
      [NB.FOREIGN_OBJECT]: !0,
      [NB.DESC]: !0
    }
  }
})
// @from(Ln 273490, Col 4)
p52 = U((QMZ, c52) => {
  var m52 = cr(),
    SB = m52.TAG_NAMES,
    bZ = m52.NAMESPACES;

  function u52(A) {
    switch (A.length) {
      case 1:
        return A === SB.P;
      case 2:
        return A === SB.RB || A === SB.RP || A === SB.RT || A === SB.DD || A === SB.DT || A === SB.LI;
      case 3:
        return A === SB.RTC;
      case 6:
        return A === SB.OPTION;
      case 8:
        return A === SB.OPTGROUP
    }
    return !1
  }

  function jY5(A) {
    switch (A.length) {
      case 1:
        return A === SB.P;
      case 2:
        return A === SB.RB || A === SB.RP || A === SB.RT || A === SB.DD || A === SB.DT || A === SB.LI || A === SB.TD || A === SB.TH || A === SB.TR;
      case 3:
        return A === SB.RTC;
      case 5:
        return A === SB.TBODY || A === SB.TFOOT || A === SB.THEAD;
      case 6:
        return A === SB.OPTION;
      case 7:
        return A === SB.CAPTION;
      case 8:
        return A === SB.OPTGROUP || A === SB.COLGROUP
    }
    return !1
  }

  function MY1(A, Q) {
    switch (A.length) {
      case 2:
        if (A === SB.TD || A === SB.TH) return Q === bZ.HTML;
        else if (A === SB.MI || A === SB.MO || A === SB.MN || A === SB.MS) return Q === bZ.MATHML;
        break;
      case 4:
        if (A === SB.HTML) return Q === bZ.HTML;
        else if (A === SB.DESC) return Q === bZ.SVG;
        break;
      case 5:
        if (A === SB.TABLE) return Q === bZ.HTML;
        else if (A === SB.MTEXT) return Q === bZ.MATHML;
        else if (A === SB.TITLE) return Q === bZ.SVG;
        break;
      case 6:
        return (A === SB.APPLET || A === SB.OBJECT) && Q === bZ.HTML;
      case 7:
        return (A === SB.CAPTION || A === SB.MARQUEE) && Q === bZ.HTML;
      case 8:
        return A === SB.TEMPLATE && Q === bZ.HTML;
      case 13:
        return A === SB.FOREIGN_OBJECT && Q === bZ.SVG;
      case 14:
        return A === SB.ANNOTATION_XML && Q === bZ.MATHML
    }
    return !1
  }
  class d52 {
    constructor(A, Q) {
      this.stackTop = -1, this.items = [], this.current = A, this.currentTagName = null, this.currentTmplContent = null, this.tmplCount = 0, this.treeAdapter = Q
    }
    _indexOf(A) {
      let Q = -1;
      for (let B = this.stackTop; B >= 0; B--)
        if (this.items[B] === A) {
          Q = B;
          break
        } return Q
    }
    _isInTemplate() {
      return this.currentTagName === SB.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === bZ.HTML
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
    replace(A, Q) {
      let B = this._indexOf(A);
      if (this.items[B] = Q, B === this.stackTop) this._updateCurrentElement()
    }
    insertAfter(A, Q) {
      let B = this._indexOf(A) + 1;
      if (this.items.splice(B, 0, Q), B === ++this.stackTop) this._updateCurrentElement()
    }
    popUntilTagNamePopped(A) {
      while (this.stackTop > -1) {
        let Q = this.currentTagName,
          B = this.treeAdapter.getNamespaceURI(this.current);
        if (this.pop(), Q === A && B === bZ.HTML) break
      }
    }
    popUntilElementPopped(A) {
      while (this.stackTop > -1) {
        let Q = this.current;
        if (this.pop(), Q === A) break
      }
    }
    popUntilNumberedHeaderPopped() {
      while (this.stackTop > -1) {
        let A = this.currentTagName,
          Q = this.treeAdapter.getNamespaceURI(this.current);
        if (this.pop(), A === SB.H1 || A === SB.H2 || A === SB.H3 || A === SB.H4 || A === SB.H5 || A === SB.H6 && Q === bZ.HTML) break
      }
    }
    popUntilTableCellPopped() {
      while (this.stackTop > -1) {
        let A = this.currentTagName,
          Q = this.treeAdapter.getNamespaceURI(this.current);
        if (this.pop(), A === SB.TD || A === SB.TH && Q === bZ.HTML) break
      }
    }
    popAllUpToHtmlElement() {
      this.stackTop = 0, this._updateCurrentElement()
    }
    clearBackToTableContext() {
      while (this.currentTagName !== SB.TABLE && this.currentTagName !== SB.TEMPLATE && this.currentTagName !== SB.HTML || this.treeAdapter.getNamespaceURI(this.current) !== bZ.HTML) this.pop()
    }
    clearBackToTableBodyContext() {
      while (this.currentTagName !== SB.TBODY && this.currentTagName !== SB.TFOOT && this.currentTagName !== SB.THEAD && this.currentTagName !== SB.TEMPLATE && this.currentTagName !== SB.HTML || this.treeAdapter.getNamespaceURI(this.current) !== bZ.HTML) this.pop()
    }
    clearBackToTableRowContext() {
      while (this.currentTagName !== SB.TR && this.currentTagName !== SB.TEMPLATE && this.currentTagName !== SB.HTML || this.treeAdapter.getNamespaceURI(this.current) !== bZ.HTML) this.pop()
    }
    remove(A) {
      for (let Q = this.stackTop; Q >= 0; Q--)
        if (this.items[Q] === A) {
          this.items.splice(Q, 1), this.stackTop--, this._updateCurrentElement();
          break
        }
    }
    tryPeekProperlyNestedBodyElement() {
      let A = this.items[1];
      return A && this.treeAdapter.getTagName(A) === SB.BODY ? A : null
    }
    contains(A) {
      return this._indexOf(A) > -1
    }
    getCommonAncestor(A) {
      let Q = this._indexOf(A);
      return --Q >= 0 ? this.items[Q] : null
    }
    isRootHtmlElementCurrent() {
      return this.stackTop === 0 && this.currentTagName === SB.HTML
    }
    hasInScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === bZ.HTML) return !0;
        if (MY1(B, G)) return !1
      }
      return !0
    }
    hasNumberedHeaderInScope() {
      for (let A = this.stackTop; A >= 0; A--) {
        let Q = this.treeAdapter.getTagName(this.items[A]),
          B = this.treeAdapter.getNamespaceURI(this.items[A]);
        if ((Q === SB.H1 || Q === SB.H2 || Q === SB.H3 || Q === SB.H4 || Q === SB.H5 || Q === SB.H6) && B === bZ.HTML) return !0;
        if (MY1(Q, B)) return !1
      }
      return !0
    }
    hasInListItemScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === bZ.HTML) return !0;
        if ((B === SB.UL || B === SB.OL) && G === bZ.HTML || MY1(B, G)) return !1
      }
      return !0
    }
    hasInButtonScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === bZ.HTML) return !0;
        if (B === SB.BUTTON && G === bZ.HTML || MY1(B, G)) return !1
      }
      return !0
    }
    hasInTableScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]);
        if (this.treeAdapter.getNamespaceURI(this.items[Q]) !== bZ.HTML) continue;
        if (B === A) return !0;
        if (B === SB.TABLE || B === SB.TEMPLATE || B === SB.HTML) return !1
      }
      return !0
    }
    hasTableBodyContextInTableScope() {
      for (let A = this.stackTop; A >= 0; A--) {
        let Q = this.treeAdapter.getTagName(this.items[A]);
        if (this.treeAdapter.getNamespaceURI(this.items[A]) !== bZ.HTML) continue;
        if (Q === SB.TBODY || Q === SB.THEAD || Q === SB.TFOOT) return !0;
        if (Q === SB.TABLE || Q === SB.HTML) return !1
      }
      return !0
    }
    hasInSelectScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]);
        if (this.treeAdapter.getNamespaceURI(this.items[Q]) !== bZ.HTML) continue;
        if (B === A) return !0;
        if (B !== SB.OPTION && B !== SB.OPTGROUP) return !1
      }
      return !0
    }
    generateImpliedEndTags() {
      while (u52(this.currentTagName)) this.pop()
    }
    generateImpliedEndTagsThoroughly() {
      while (jY5(this.currentTagName)) this.pop()
    }
    generateImpliedEndTagsWithExclusion(A) {
      while (u52(this.currentTagName) && this.currentTagName !== A) this.pop()
    }
  }
  c52.exports = d52
})
// @from(Ln 273727, Col 4)
i52 = U((BMZ, l52) => {
  class TS {
    constructor(A) {
      this.length = 0, this.entries = [], this.treeAdapter = A, this.bookmark = null
    }
    _getNoahArkConditionCandidates(A) {
      let Q = [];
      if (this.length >= 3) {
        let B = this.treeAdapter.getAttrList(A).length,
          G = this.treeAdapter.getTagName(A),
          Z = this.treeAdapter.getNamespaceURI(A);
        for (let Y = this.length - 1; Y >= 0; Y--) {
          let J = this.entries[Y];
          if (J.type === TS.MARKER_ENTRY) break;
          let X = J.element,
            I = this.treeAdapter.getAttrList(X);
          if (this.treeAdapter.getTagName(X) === G && this.treeAdapter.getNamespaceURI(X) === Z && I.length === B) Q.push({
            idx: Y,
            attrs: I
          })
        }
      }
      return Q.length < 3 ? [] : Q
    }
    _ensureNoahArkCondition(A) {
      let Q = this._getNoahArkConditionCandidates(A),
        B = Q.length;
      if (B) {
        let G = this.treeAdapter.getAttrList(A),
          Z = G.length,
          Y = Object.create(null);
        for (let J = 0; J < Z; J++) {
          let X = G[J];
          Y[X.name] = X.value
        }
        for (let J = 0; J < Z; J++)
          for (let X = 0; X < B; X++) {
            let I = Q[X].attrs[J];
            if (Y[I.name] !== I.value) Q.splice(X, 1), B--;
            if (Q.length < 3) return
          }
        for (let J = B - 1; J >= 2; J--) this.entries.splice(Q[J].idx, 1), this.length--
      }
    }
    insertMarker() {
      this.entries.push({
        type: TS.MARKER_ENTRY
      }), this.length++
    }
    pushElement(A, Q) {
      this._ensureNoahArkCondition(A), this.entries.push({
        type: TS.ELEMENT_ENTRY,
        element: A,
        token: Q
      }), this.length++
    }
    insertElementAfterBookmark(A, Q) {
      let B = this.length - 1;
      for (; B >= 0; B--)
        if (this.entries[B] === this.bookmark) break;
      this.entries.splice(B + 1, 0, {
        type: TS.ELEMENT_ENTRY,
        element: A,
        token: Q
      }), this.length++
    }
    removeEntry(A) {
      for (let Q = this.length - 1; Q >= 0; Q--)
        if (this.entries[Q] === A) {
          this.entries.splice(Q, 1), this.length--;
          break
        }
    }
    clearToLastMarker() {
      while (this.length) {
        let A = this.entries.pop();
        if (this.length--, A.type === TS.MARKER_ENTRY) break
      }
    }
    getElementEntryInScopeWithTagName(A) {
      for (let Q = this.length - 1; Q >= 0; Q--) {
        let B = this.entries[Q];
        if (B.type === TS.MARKER_ENTRY) return null;
        if (this.treeAdapter.getTagName(B.element) === A) return B
      }
      return null
    }
    getElementEntry(A) {
      for (let Q = this.length - 1; Q >= 0; Q--) {
        let B = this.entries[Q];
        if (B.type === TS.ELEMENT_ENTRY && B.element === A) return B
      }
      return null
    }
  }
  TS.MARKER_ENTRY = "MARKER_ENTRY";
  TS.ELEMENT_ENTRY = "ELEMENT_ENTRY";
  l52.exports = TS
})
// @from(Ln 273826, Col 4)
db = U((GMZ, n52) => {
  class UD0 {
    constructor(A) {
      let Q = {},
        B = this._getOverriddenMethods(this, Q);
      for (let G of Object.keys(B))
        if (typeof B[G] === "function") Q[G] = A[G], A[G] = B[G]
    }
    _getOverriddenMethods() {
      throw Error("Not implemented")
    }
  }
  UD0.install = function (A, Q, B) {
    if (!A.__mixins) A.__mixins = [];
    for (let Z = 0; Z < A.__mixins.length; Z++)
      if (A.__mixins[Z].constructor === Q) return A.__mixins[Z];
    let G = new Q(A, B);
    return A.__mixins.push(G), G
  };
  n52.exports = UD0
})
// @from(Ln 273847, Col 4)
qD0 = U((ZMZ, o52) => {
  var TY5 = db();
  class a52 extends TY5 {
    constructor(A) {
      super(A);
      this.preprocessor = A, this.isEol = !1, this.lineStartPos = 0, this.droppedBufferSize = 0, this.offset = 0, this.col = 0, this.line = 1
    }
    _getOverriddenMethods(A, Q) {
      return {
        advance() {
          let B = this.pos + 1,
            G = this.html[B];
          if (A.isEol) A.isEol = !1, A.line++, A.lineStartPos = B;
          if (G === `
` || G === "\r" && this.html[B + 1] !== `
`) A.isEol = !0;
          return A.col = B - A.lineStartPos + 1, A.offset = A.droppedBufferSize + B, Q.advance.call(this)
        },
        retreat() {
          Q.retreat.call(this), A.isEol = !1, A.col = this.pos - A.lineStartPos + 1
        },
        dropParsedChunk() {
          let B = this.pos;
          Q.dropParsedChunk.call(this);
          let G = B - this.pos;
          A.lineStartPos -= G, A.droppedBufferSize += G, A.offset = A.droppedBufferSize + this.pos
        }
      }
    }
  }
  o52.exports = a52
})
// @from(Ln 273879, Col 4)
wD0 = U((YMZ, t52) => {
  var r52 = db(),
    ND0 = RyA(),
    PY5 = qD0();
  class s52 extends r52 {
    constructor(A) {
      super(A);
      this.tokenizer = A, this.posTracker = r52.install(A.preprocessor, PY5), this.currentAttrLocation = null, this.ctLoc = null
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
        Q = this.tokenizer.currentAttr;
      if (!A.location.attrs) A.location.attrs = Object.create(null);
      A.location.attrs[Q.name] = this.currentAttrLocation
    }
    _getOverriddenMethods(A, Q) {
      let B = {
        _createStartTagToken() {
          Q._createStartTagToken.call(this), this.currentToken.location = A.ctLoc
        },
        _createEndTagToken() {
          Q._createEndTagToken.call(this), this.currentToken.location = A.ctLoc
        },
        _createCommentToken() {
          Q._createCommentToken.call(this), this.currentToken.location = A.ctLoc
        },
        _createDoctypeToken(G) {
          Q._createDoctypeToken.call(this, G), this.currentToken.location = A.ctLoc
        },
        _createCharacterToken(G, Z) {
          Q._createCharacterToken.call(this, G, Z), this.currentCharacterToken.location = A.ctLoc
        },
        _createEOFToken() {
          Q._createEOFToken.call(this), this.currentToken.location = A._getCurrentLocation()
        },
        _createAttr(G) {
          Q._createAttr.call(this, G), A.currentAttrLocation = A._getCurrentLocation()
        },
        _leaveAttrName(G) {
          Q._leaveAttrName.call(this, G), A._attachCurrentAttrLocationInfo()
        },
        _leaveAttrValue(G) {
          Q._leaveAttrValue.call(this, G), A._attachCurrentAttrLocationInfo()
        },
        _emitCurrentToken() {
          let G = this.currentToken.location;
          if (this.currentCharacterToken) this.currentCharacterToken.location.endLine = G.startLine, this.currentCharacterToken.location.endCol = G.startCol, this.currentCharacterToken.location.endOffset = G.startOffset;
          if (this.currentToken.type === ND0.EOF_TOKEN) G.endLine = G.startLine, G.endCol = G.startCol, G.endOffset = G.startOffset;
          else G.endLine = A.posTracker.line, G.endCol = A.posTracker.col + 1, G.endOffset = A.posTracker.offset + 1;
          Q._emitCurrentToken.call(this)
        },
        _emitCurrentCharacterToken() {
          let G = this.currentCharacterToken && this.currentCharacterToken.location;
          if (G && G.endOffset === -1) G.endLine = A.posTracker.line, G.endCol = A.posTracker.col, G.endOffset = A.posTracker.offset;
          Q._emitCurrentCharacterToken.call(this)
        }
      };
      return Object.keys(ND0.MODE).forEach((G) => {
        let Z = ND0.MODE[G];
        B[Z] = function (Y) {
          A.ctLoc = A._getCurrentLocation(), Q[Z].call(this, Y)
        }
      }), B
    }
  }
  t52.exports = s52
})
// @from(Ln 273957, Col 4)
Q72 = U((JMZ, A72) => {
  var SY5 = db();
  class e52 extends SY5 {
    constructor(A, Q) {
      super(A);
      this.onItemPop = Q.onItemPop
    }
    _getOverriddenMethods(A, Q) {
      return {
        pop() {
          A.onItemPop(this.current), Q.pop.call(this)
        },
        popAllUpToHtmlElement() {
          for (let B = this.stackTop; B > 0; B--) A.onItemPop(this.items[B]);
          Q.popAllUpToHtmlElement.call(this)
        },
        remove(B) {
          A.onItemPop(this.current), Q.remove.call(this, B)
        }
      }
    }
  }
  A72.exports = e52
})
// @from(Ln 273981, Col 4)
Y72 = U((XMZ, Z72) => {
  var LD0 = db(),
    B72 = RyA(),
    xY5 = wD0(),
    yY5 = Q72(),
    vY5 = cr(),
    OD0 = vY5.TAG_NAMES;
  class G72 extends LD0 {
    constructor(A) {
      super(A);
      this.parser = A, this.treeAdapter = this.parser.treeAdapter, this.posTracker = null, this.lastStartTagToken = null, this.lastFosterParentingLocation = null, this.currentToken = null
    }
    _setStartLocation(A) {
      let Q = null;
      if (this.lastStartTagToken) Q = Object.assign({}, this.lastStartTagToken.location), Q.startTag = this.lastStartTagToken.location;
      this.treeAdapter.setNodeSourceCodeLocation(A, Q)
    }
    _setEndLocation(A, Q) {
      let B = this.treeAdapter.getNodeSourceCodeLocation(A);
      if (B) {
        if (Q.location) {
          let G = Q.location,
            Z = this.treeAdapter.getTagName(A);
          if (Q.type === B72.END_TAG_TOKEN && Z === Q.tagName) B.endTag = Object.assign({}, G), B.endLine = G.endLine, B.endCol = G.endCol, B.endOffset = G.endOffset;
          else B.endLine = G.startLine, B.endCol = G.startCol, B.endOffset = G.startOffset
        }
      }
    }
    _getOverriddenMethods(A, Q) {
      return {
        _bootstrap(B, G) {
          Q._bootstrap.call(this, B, G), A.lastStartTagToken = null, A.lastFosterParentingLocation = null, A.currentToken = null;
          let Z = LD0.install(this.tokenizer, xY5);
          A.posTracker = Z.posTracker, LD0.install(this.openElements, yY5, {
            onItemPop: function (Y) {
              A._setEndLocation(Y, A.currentToken)
            }
          })
        },
        _runParsingLoop(B) {
          Q._runParsingLoop.call(this, B);
          for (let G = this.openElements.stackTop; G >= 0; G--) A._setEndLocation(this.openElements.items[G], A.currentToken)
        },
        _processTokenInForeignContent(B) {
          A.currentToken = B, Q._processTokenInForeignContent.call(this, B)
        },
        _processToken(B) {
          if (A.currentToken = B, Q._processToken.call(this, B), B.type === B72.END_TAG_TOKEN && (B.tagName === OD0.HTML || B.tagName === OD0.BODY && this.openElements.hasInScope(OD0.BODY)))
            for (let Z = this.openElements.stackTop; Z >= 0; Z--) {
              let Y = this.openElements.items[Z];
              if (this.treeAdapter.getTagName(Y) === B.tagName) {
                A._setEndLocation(Y, B);
                break
              }
            }
        },
        _setDocumentType(B) {
          Q._setDocumentType.call(this, B);
          let G = this.treeAdapter.getChildNodes(this.document),
            Z = G.length;
          for (let Y = 0; Y < Z; Y++) {
            let J = G[Y];
            if (this.treeAdapter.isDocumentTypeNode(J)) {
              this.treeAdapter.setNodeSourceCodeLocation(J, B.location);
              break
            }
          }
        },
        _attachElementToTree(B) {
          A._setStartLocation(B), A.lastStartTagToken = null, Q._attachElementToTree.call(this, B)
        },
        _appendElement(B, G) {
          A.lastStartTagToken = B, Q._appendElement.call(this, B, G)
        },
        _insertElement(B, G) {
          A.lastStartTagToken = B, Q._insertElement.call(this, B, G)
        },
        _insertTemplate(B) {
          A.lastStartTagToken = B, Q._insertTemplate.call(this, B);
          let G = this.treeAdapter.getTemplateContent(this.openElements.current);
          this.treeAdapter.setNodeSourceCodeLocation(G, null)
        },
        _insertFakeRootElement() {
          Q._insertFakeRootElement.call(this), this.treeAdapter.setNodeSourceCodeLocation(this.openElements.current, null)
        },
        _appendCommentNode(B, G) {
          Q._appendCommentNode.call(this, B, G);
          let Z = this.treeAdapter.getChildNodes(G),
            Y = Z[Z.length - 1];
          this.treeAdapter.setNodeSourceCodeLocation(Y, B.location)
        },
        _findFosterParentingLocation() {
          return A.lastFosterParentingLocation = Q._findFosterParentingLocation.call(this), A.lastFosterParentingLocation
        },
        _insertCharacters(B) {
          Q._insertCharacters.call(this, B);
          let G = this._shouldFosterParentOnInsertion(),
            Z = G && A.lastFosterParentingLocation.parent || this.openElements.currentTmplContent || this.openElements.current,
            Y = this.treeAdapter.getChildNodes(Z),
            J = G && A.lastFosterParentingLocation.beforeElement ? Y.indexOf(A.lastFosterParentingLocation.beforeElement) - 1 : Y.length - 1,
            X = Y[J],
            I = this.treeAdapter.getNodeSourceCodeLocation(X);
          if (I) I.endLine = B.location.endLine, I.endCol = B.location.endCol, I.endOffset = B.location.endOffset;
          else this.treeAdapter.setNodeSourceCodeLocation(X, B.location)
        }
      }
    }
  }
  Z72.exports = G72
})
// @from(Ln 274091, Col 4)
RY1 = U((IMZ, X72) => {
  var kY5 = db();
  class J72 extends kY5 {
    constructor(A, Q) {
      super(A);
      this.posTracker = null, this.onParseError = Q.onParseError
    }
    _setErrorLocation(A) {
      A.startLine = A.endLine = this.posTracker.line, A.startCol = A.endCol = this.posTracker.col, A.startOffset = A.endOffset = this.posTracker.offset
    }
    _reportError(A) {
      let Q = {
        code: A,
        startLine: -1,
        startCol: -1,
        startOffset: -1,
        endLine: -1,
        endCol: -1,
        endOffset: -1
      };
      this._setErrorLocation(Q), this.onParseError(Q)
    }
    _getOverriddenMethods(A) {
      return {
        _err(Q) {
          A._reportError(Q)
        }
      }
    }
  }
  X72.exports = J72
})
// @from(Ln 274123, Col 4)
W72 = U((DMZ, D72) => {
  var bY5 = RY1(),
    fY5 = qD0(),
    hY5 = db();
  class I72 extends bY5 {
    constructor(A, Q) {
      super(A, Q);
      this.posTracker = hY5.install(A, fY5), this.lastErrOffset = -1
    }
    _reportError(A) {
      if (this.lastErrOffset !== this.posTracker.offset) this.lastErrOffset = this.posTracker.offset, super._reportError(A)
    }
  }
  D72.exports = I72
})
// @from(Ln 274138, Col 4)
F72 = U((WMZ, V72) => {
  var gY5 = RY1(),
    uY5 = W72(),
    mY5 = db();
  class K72 extends gY5 {
    constructor(A, Q) {
      super(A, Q);
      let B = mY5.install(A.preprocessor, uY5, Q);
      this.posTracker = B.posTracker
    }
  }
  V72.exports = K72
})
// @from(Ln 274151, Col 4)
$72 = U((KMZ, z72) => {
  var dY5 = RY1(),
    cY5 = F72(),
    pY5 = wD0(),
    H72 = db();
  class E72 extends dY5 {
    constructor(A, Q) {
      super(A, Q);
      this.opts = Q, this.ctLoc = null, this.locBeforeToken = !1
    }
    _setErrorLocation(A) {
      if (this.ctLoc) A.startLine = this.ctLoc.startLine, A.startCol = this.ctLoc.startCol, A.startOffset = this.ctLoc.startOffset, A.endLine = this.locBeforeToken ? this.ctLoc.startLine : this.ctLoc.endLine, A.endCol = this.locBeforeToken ? this.ctLoc.startCol : this.ctLoc.endCol, A.endOffset = this.locBeforeToken ? this.ctLoc.startOffset : this.ctLoc.endOffset
    }
    _getOverriddenMethods(A, Q) {
      return {
        _bootstrap(B, G) {
          Q._bootstrap.call(this, B, G), H72.install(this.tokenizer, cY5, A.opts), H72.install(this.tokenizer, pY5)
        },
        _processInputToken(B) {
          A.ctLoc = B.location, Q._processInputToken.call(this, B)
        },
        _err(B, G) {
          A.locBeforeToken = G && G.beforeToken, A._reportError(B)
        }
      }
    }
  }
  z72.exports = E72
})
// @from(Ln 274180, Col 4)
MD0 = U((nY5) => {
  var {
    DOCUMENT_MODE: lY5
  } = cr();
  nY5.createDocument = function () {
    return {
      nodeName: "#document",
      mode: lY5.NO_QUIRKS,
      childNodes: []
    }
  };
  nY5.createDocumentFragment = function () {
    return {
      nodeName: "#document-fragment",
      childNodes: []
    }
  };
  nY5.createElement = function (A, Q, B) {
    return {
      nodeName: A,
      tagName: A,
      attrs: B,
      namespaceURI: Q,
      childNodes: [],
      parentNode: null
    }
  };
  nY5.createCommentNode = function (A) {
    return {
      nodeName: "#comment",
      data: A,
      parentNode: null
    }
  };
  var C72 = function (A) {
      return {
        nodeName: "#text",
        value: A,
        parentNode: null
      }
    },
    U72 = nY5.appendChild = function (A, Q) {
      A.childNodes.push(Q), Q.parentNode = A
    },
    iY5 = nY5.insertBefore = function (A, Q, B) {
      let G = A.childNodes.indexOf(B);
      A.childNodes.splice(G, 0, Q), Q.parentNode = A
    };
  nY5.setTemplateContent = function (A, Q) {
    A.content = Q
  };
  nY5.getTemplateContent = function (A) {
    return A.content
  };
  nY5.setDocumentType = function (A, Q, B, G) {
    let Z = null;
    for (let Y = 0; Y < A.childNodes.length; Y++)
      if (A.childNodes[Y].nodeName === "#documentType") {
        Z = A.childNodes[Y];
        break
      } if (Z) Z.name = Q, Z.publicId = B, Z.systemId = G;
    else U72(A, {
      nodeName: "#documentType",
      name: Q,
      publicId: B,
      systemId: G
    })
  };
  nY5.setDocumentMode = function (A, Q) {
    A.mode = Q
  };
  nY5.getDocumentMode = function (A) {
    return A.mode
  };
  nY5.detachNode = function (A) {
    if (A.parentNode) {
      let Q = A.parentNode.childNodes.indexOf(A);
      A.parentNode.childNodes.splice(Q, 1), A.parentNode = null
    }
  };
  nY5.insertText = function (A, Q) {
    if (A.childNodes.length) {
      let B = A.childNodes[A.childNodes.length - 1];
      if (B.nodeName === "#text") {
        B.value += Q;
        return
      }
    }
    U72(A, C72(Q))
  };
  nY5.insertTextBefore = function (A, Q, B) {
    let G = A.childNodes[A.childNodes.indexOf(B) - 1];
    if (G && G.nodeName === "#text") G.value += Q;
    else iY5(A, C72(Q), B)
  };
  nY5.adoptAttributes = function (A, Q) {
    let B = [];
    for (let G = 0; G < A.attrs.length; G++) B.push(A.attrs[G].name);
    for (let G = 0; G < Q.length; G++)
      if (B.indexOf(Q[G].name) === -1) A.attrs.push(Q[G])
  };
  nY5.getFirstChild = function (A) {
    return A.childNodes[0]
  };
  nY5.getChildNodes = function (A) {
    return A.childNodes
  };
  nY5.getParentNode = function (A) {
    return A.parentNode
  };
  nY5.getAttrList = function (A) {
    return A.attrs
  };
  nY5.getTagName = function (A) {
    return A.tagName
  };
  nY5.getNamespaceURI = function (A) {
    return A.namespaceURI
  };
  nY5.getTextNodeContent = function (A) {
    return A.value
  };
  nY5.getCommentNodeContent = function (A) {
    return A.data
  };
  nY5.getDocumentTypeNodeName = function (A) {
    return A.name
  };
  nY5.getDocumentTypeNodePublicId = function (A) {
    return A.publicId
  };
  nY5.getDocumentTypeNodeSystemId = function (A) {
    return A.systemId
  };
  nY5.isTextNode = function (A) {
    return A.nodeName === "#text"
  };
  nY5.isCommentNode = function (A) {
    return A.nodeName === "#comment"
  };
  nY5.isDocumentTypeNode = function (A) {
    return A.nodeName === "#documentType"
  };
  nY5.isElementNode = function (A) {
    return !!A.tagName
  };
  nY5.setNodeSourceCodeLocation = function (A, Q) {
    A.sourceCodeLocation = Q
  };
  nY5.getNodeSourceCodeLocation = function (A) {
    return A.sourceCodeLocation
  }
})
// @from(Ln 274333, Col 4)
RD0 = U((EMZ, q72) => {
  q72.exports = function (Q, B) {
    return B = B || Object.create(null), [Q, B].reduce((G, Z) => {
      return Object.keys(Z).forEach((Y) => {
        G[Y] = Z[Y]
      }), G
    }, Object.create(null))
  }
})
// @from(Ln 274342, Col 4)
_D0 = U((_J5) => {
  var {
    DOCUMENT_MODE: uVA
  } = cr(), L72 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], OJ5 = L72.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), MJ5 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], O72 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], RJ5 = O72.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

  function N72(A) {
    let Q = A.indexOf('"') !== -1 ? "'" : '"';
    return Q + A + Q
  }

  function w72(A, Q) {
    for (let B = 0; B < Q.length; B++)
      if (A.indexOf(Q[B]) === 0) return !0;
    return !1
  }
  _J5.isConforming = function (A) {
    return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
  };
  _J5.getDocumentMode = function (A) {
    if (A.name !== "html") return uVA.QUIRKS;
    let Q = A.systemId;
    if (Q && Q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return uVA.QUIRKS;
    let B = A.publicId;
    if (B !== null) {
      if (B = B.toLowerCase(), MJ5.indexOf(B) > -1) return uVA.QUIRKS;
      let G = Q === null ? OJ5 : L72;
      if (w72(B, G)) return uVA.QUIRKS;
      if (G = Q === null ? O72 : RJ5, w72(B, G)) return uVA.LIMITED_QUIRKS
    }
    return uVA.NO_QUIRKS
  };
  _J5.serializeContent = function (A, Q, B) {
    let G = "!DOCTYPE ";
    if (A) G += A;
    if (Q) G += " PUBLIC " + N72(Q);
    else if (B) G += " SYSTEM";
    if (B !== null) G += " " + N72(B);
    return G
  }
})
// @from(Ln 274382, Col 4)
R72 = U((fJ5) => {
  var jD0 = RyA(),
    TD0 = cr(),
    I4 = TD0.TAG_NAMES,
    WE = TD0.NAMESPACES,
    _Y1 = TD0.ATTRS,
    M72 = {
      TEXT_HTML: "text/html",
      APPLICATION_XML: "application/xhtml+xml"
    },
    SJ5 = {
      attributename: "attributeName",
      attributetype: "attributeType",
      basefrequency: "baseFrequency",
      baseprofile: "baseProfile",
      calcmode: "calcMode",
      clippathunits: "clipPathUnits",
      diffuseconstant: "diffuseConstant",
      edgemode: "edgeMode",
      filterunits: "filterUnits",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      limitingconeangle: "limitingConeAngle",
      markerheight: "markerHeight",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      numoctaves: "numOctaves",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      refx: "refX",
      refy: "refY",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stitchtiles: "stitchTiles",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textlength: "textLength",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      xchannelselector: "xChannelSelector",
      ychannelselector: "yChannelSelector",
      zoomandpan: "zoomAndPan"
    },
    xJ5 = {
      "xlink:actuate": {
        prefix: "xlink",
        name: "actuate",
        namespace: WE.XLINK
      },
      "xlink:arcrole": {
        prefix: "xlink",
        name: "arcrole",
        namespace: WE.XLINK
      },
      "xlink:href": {
        prefix: "xlink",
        name: "href",
        namespace: WE.XLINK
      },
      "xlink:role": {
        prefix: "xlink",
        name: "role",
        namespace: WE.XLINK
      },
      "xlink:show": {
        prefix: "xlink",
        name: "show",
        namespace: WE.XLINK
      },
      "xlink:title": {
        prefix: "xlink",
        name: "title",
        namespace: WE.XLINK
      },
      "xlink:type": {
        prefix: "xlink",
        name: "type",
        namespace: WE.XLINK
      },
      "xml:base": {
        prefix: "xml",
        name: "base",
        namespace: WE.XML
      },
      "xml:lang": {
        prefix: "xml",
        name: "lang",
        namespace: WE.XML
      },
      "xml:space": {
        prefix: "xml",
        name: "space",
        namespace: WE.XML
      },
      xmlns: {
        prefix: "",
        name: "xmlns",
        namespace: WE.XMLNS
      },
      "xmlns:xlink": {
        prefix: "xmlns",
        name: "xlink",
        namespace: WE.XMLNS
      }
    },
    yJ5 = fJ5.SVG_TAG_NAMES_ADJUSTMENT_MAP = {
      altglyph: "altGlyph",
      altglyphdef: "altGlyphDef",
      altglyphitem: "altGlyphItem",
      animatecolor: "animateColor",
      animatemotion: "animateMotion",
      animatetransform: "animateTransform",
      clippath: "clipPath",
      feblend: "feBlend",
      fecolormatrix: "feColorMatrix",
      fecomponenttransfer: "feComponentTransfer",
      fecomposite: "feComposite",
      feconvolvematrix: "feConvolveMatrix",
      fediffuselighting: "feDiffuseLighting",
      fedisplacementmap: "feDisplacementMap",
      fedistantlight: "feDistantLight",
      feflood: "feFlood",
      fefunca: "feFuncA",
      fefuncb: "feFuncB",
      fefuncg: "feFuncG",
      fefuncr: "feFuncR",
      fegaussianblur: "feGaussianBlur",
      feimage: "feImage",
      femerge: "feMerge",
      femergenode: "feMergeNode",
      femorphology: "feMorphology",
      feoffset: "feOffset",
      fepointlight: "fePointLight",
      fespecularlighting: "feSpecularLighting",
      fespotlight: "feSpotLight",
      fetile: "feTile",
      feturbulence: "feTurbulence",
      foreignobject: "foreignObject",
      glyphref: "glyphRef",
      lineargradient: "linearGradient",
      radialgradient: "radialGradient",
      textpath: "textPath"
    },
    vJ5 = {
      [I4.B]: !0,
      [I4.BIG]: !0,
      [I4.BLOCKQUOTE]: !0,
      [I4.BODY]: !0,
      [I4.BR]: !0,
      [I4.CENTER]: !0,
      [I4.CODE]: !0,
      [I4.DD]: !0,
      [I4.DIV]: !0,
      [I4.DL]: !0,
      [I4.DT]: !0,
      [I4.EM]: !0,
      [I4.EMBED]: !0,
      [I4.H1]: !0,
      [I4.H2]: !0,
      [I4.H3]: !0,
      [I4.H4]: !0,
      [I4.H5]: !0,
      [I4.H6]: !0,
      [I4.HEAD]: !0,
      [I4.HR]: !0,
      [I4.I]: !0,
      [I4.IMG]: !0,
      [I4.LI]: !0,
      [I4.LISTING]: !0,
      [I4.MENU]: !0,
      [I4.META]: !0,
      [I4.NOBR]: !0,
      [I4.OL]: !0,
      [I4.P]: !0,
      [I4.PRE]: !0,
      [I4.RUBY]: !0,
      [I4.S]: !0,
      [I4.SMALL]: !0,
      [I4.SPAN]: !0,
      [I4.STRONG]: !0,
      [I4.STRIKE]: !0,
      [I4.SUB]: !0,
      [I4.SUP]: !0,
      [I4.TABLE]: !0,
      [I4.TT]: !0,
      [I4.U]: !0,
      [I4.UL]: !0,
      [I4.VAR]: !0
    };
  fJ5.causesExit = function (A) {
    let Q = A.tagName;
    return Q === I4.FONT && (jD0.getTokenAttr(A, _Y1.COLOR) !== null || jD0.getTokenAttr(A, _Y1.SIZE) !== null || jD0.getTokenAttr(A, _Y1.FACE) !== null) ? !0 : vJ5[Q]
  };
  fJ5.adjustTokenMathMLAttrs = function (A) {
    for (let Q = 0; Q < A.attrs.length; Q++)
      if (A.attrs[Q].name === "definitionurl") {
        A.attrs[Q].name = "definitionURL";
        break
      }
  };
  fJ5.adjustTokenSVGAttrs = function (A) {
    for (let Q = 0; Q < A.attrs.length; Q++) {
      let B = SJ5[A.attrs[Q].name];
      if (B) A.attrs[Q].name = B
    }
  };
  fJ5.adjustTokenXMLAttrs = function (A) {
    for (let Q = 0; Q < A.attrs.length; Q++) {
      let B = xJ5[A.attrs[Q].name];
      if (B) A.attrs[Q].prefix = B.prefix, A.attrs[Q].name = B.name, A.attrs[Q].namespace = B.namespace
    }
  };
  fJ5.adjustTokenSVGTagName = function (A) {
    let Q = yJ5[A.tagName];
    if (Q) A.tagName = Q
  };

  function kJ5(A, Q) {
    return Q === WE.MATHML && (A === I4.MI || A === I4.MO || A === I4.MN || A === I4.MS || A === I4.MTEXT)
  }

  function bJ5(A, Q, B) {
    if (Q === WE.MATHML && A === I4.ANNOTATION_XML) {
      for (let G = 0; G < B.length; G++)
        if (B[G].name === _Y1.ENCODING) {
          let Z = B[G].value.toLowerCase();
          return Z === M72.TEXT_HTML || Z === M72.APPLICATION_XML
        }
    }
    return Q === WE.SVG && (A === I4.FOREIGN_OBJECT || A === I4.DESC || A === I4.TITLE)
  }
  fJ5.isIntegrationPoint = function (A, Q, B, G) {
    if ((!G || G === WE.HTML) && bJ5(A, Q, B)) return !0;
    if ((!G || G === WE.MATHML) && kJ5(A, Q)) return !0;
    return !1
  }
})