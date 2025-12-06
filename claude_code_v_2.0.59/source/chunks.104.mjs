
// @from(Start 9700325, End 9747721)
HMA = z((VkG, X72) => {
  var OJ5 = G72(),
    uG = O21(),
    $1A = I72(),
    t0 = R21(),
    L1 = uG.CODE_POINTS,
    z1A = uG.CODE_POINT_SEQUENCES,
    RJ5 = {
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

  function qI(A) {
    return A === L1.SPACE || A === L1.LINE_FEED || A === L1.TABULATION || A === L1.FORM_FEED
  }

  function DMA(A) {
    return A >= L1.DIGIT_0 && A <= L1.DIGIT_9
  }

  function IP(A) {
    return A >= L1.LATIN_CAPITAL_A && A <= L1.LATIN_CAPITAL_Z
  }

  function U1A(A) {
    return A >= L1.LATIN_SMALL_A && A <= L1.LATIN_SMALL_Z
  }

  function zi(A) {
    return U1A(A) || IP(A)
  }

  function n10(A) {
    return zi(A) || DMA(A)
  }

  function J72(A) {
    return A >= L1.LATIN_CAPITAL_A && A <= L1.LATIN_CAPITAL_F
  }

  function W72(A) {
    return A >= L1.LATIN_SMALL_A && A <= L1.LATIN_SMALL_F
  }

  function TJ5(A) {
    return DMA(A) || J72(A) || W72(A)
  }

  function T21(A) {
    return A + 32
  }

  function bJ(A) {
    if (A <= 65535) return String.fromCharCode(A);
    return A -= 65536, String.fromCharCode(A >>> 10 & 1023 | 55296) + String.fromCharCode(56320 | A & 1023)
  }

  function Ei(A) {
    return String.fromCharCode(T21(A))
  }

  function Y72(A, Q) {
    let B = $1A[++A],
      G = ++A,
      Z = G + B - 1;
    while (G <= Z) {
      let I = G + Z >>> 1,
        Y = $1A[I];
      if (Y < Q) G = I + 1;
      else if (Y > Q) Z = I - 1;
      else return $1A[I + B]
    }
    return -1
  }
  class nZ {
    constructor() {
      this.preprocessor = new OJ5, this.tokenQueue = [], this.allowCDATA = !1, this.state = "DATA_STATE", this.returnState = "", this.charRefCode = -1, this.tempBuff = [], this.lastStartTagName = "", this.consumedAfterSnapshot = -1, this.active = !1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = null
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
          type: nZ.HIBERNATION_TOKEN
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
        I = A.length,
        Y = 0,
        J = Q,
        W = void 0;
      for (; Y < I; Y++) {
        if (Y > 0) J = this._consume(), G++;
        if (J === L1.EOF) {
          Z = !1;
          break
        }
        if (W = A[Y], J !== W && (B || J !== T21(W))) {
          Z = !1;
          break
        }
      }
      if (!Z)
        while (G--) this._unconsume();
      return Z
    }
    _isTempBufferEqualToScriptString() {
      if (this.tempBuff.length !== z1A.SCRIPT_STRING.length) return !1;
      for (let A = 0; A < this.tempBuff.length; A++)
        if (this.tempBuff[A] !== z1A.SCRIPT_STRING[A]) return !1;
      return !0
    }
    _createStartTagToken() {
      this.currentToken = {
        type: nZ.START_TAG_TOKEN,
        tagName: "",
        selfClosing: !1,
        ackSelfClosing: !1,
        attrs: []
      }
    }
    _createEndTagToken() {
      this.currentToken = {
        type: nZ.END_TAG_TOKEN,
        tagName: "",
        selfClosing: !1,
        attrs: []
      }
    }
    _createCommentToken() {
      this.currentToken = {
        type: nZ.COMMENT_TOKEN,
        data: ""
      }
    }
    _createDoctypeToken(A) {
      this.currentToken = {
        type: nZ.DOCTYPE_TOKEN,
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
        type: nZ.EOF_TOKEN
      }
    }
    _createAttr(A) {
      this.currentAttr = {
        name: A,
        value: ""
      }
    }
    _leaveAttrName(A) {
      if (nZ.getTokenAttr(this.currentToken, this.currentAttr.name) === null) this.currentToken.attrs.push(this.currentAttr);
      else this._err(t0.duplicateAttribute);
      this.state = A
    }
    _leaveAttrValue(A) {
      this.state = A
    }
    _emitCurrentToken() {
      this._emitCurrentCharacterToken();
      let A = this.currentToken;
      if (this.currentToken = null, A.type === nZ.START_TAG_TOKEN) this.lastStartTagName = A.tagName;
      else if (A.type === nZ.END_TAG_TOKEN) {
        if (A.attrs.length > 0) this._err(t0.endTagWithAttributes);
        if (A.selfClosing) this._err(t0.endTagWithTrailingSolidus)
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
      let Q = nZ.CHARACTER_TOKEN;
      if (qI(A)) Q = nZ.WHITESPACE_CHARACTER_TOKEN;
      else if (A === L1.NULL) Q = nZ.NULL_CHARACTER_TOKEN;
      this._appendCharToCurrentCharacterToken(Q, bJ(A))
    }
    _emitSeveralCodePoints(A) {
      for (let Q = 0; Q < A.length; Q++) this._emitCodePoint(A[Q])
    }
    _emitChars(A) {
      this._appendCharToCurrentCharacterToken(nZ.CHARACTER_TOKEN, A)
    }
    _matchNamedCharacterReference(A) {
      let Q = null,
        B = 1,
        G = Y72(0, A);
      this.tempBuff.push(A);
      while (G > -1) {
        let Z = $1A[G],
          I = Z < 7;
        if (I && Z & 1) Q = Z & 2 ? [$1A[++G], $1A[++G]] : [$1A[++G]], B = 0;
        let J = this._consume();
        if (this.tempBuff.push(J), B++, J === L1.EOF) break;
        if (I) G = Z & 4 ? Y72(G, J) : -1;
        else G = J === Z ? ++G : -1
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
        return this._unconsume(), Q === L1.EQUALS_SIGN || n10(Q)
      }
      return !1
    }
    _flushCodePointsConsumedAsCharacterReference() {
      if (this._isCharacterReferenceInAttribute())
        for (let A = 0; A < this.tempBuff.length; A++) this.currentAttr.value += bJ(this.tempBuff[A]);
      else this._emitSeveralCodePoints(this.tempBuff);
      this.tempBuff = []
    } ["DATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "TAG_OPEN_STATE";
      else if (A === L1.AMPERSAND) this.returnState = "DATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitCodePoint(A);
      else if (A === L1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["RCDATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === L1.AMPERSAND) this.returnState = "RCDATA_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === L1.LESS_THAN_SIGN) this.state = "RCDATA_LESS_THAN_SIGN_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["RAWTEXT_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "RAWTEXT_LESS_THAN_SIGN_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_LESS_THAN_SIGN_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["PLAINTEXT_STATE"](A) {
      if (this.preprocessor.dropParsedChunk(), A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["TAG_OPEN_STATE"](A) {
      if (A === L1.EXCLAMATION_MARK) this.state = "MARKUP_DECLARATION_OPEN_STATE";
      else if (A === L1.SOLIDUS) this.state = "END_TAG_OPEN_STATE";
      else if (zi(A)) this._createStartTagToken(), this._reconsumeInState("TAG_NAME_STATE");
      else if (A === L1.QUESTION_MARK) this._err(t0.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE");
      else if (A === L1.EOF) this._err(t0.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
      else this._err(t0.invalidFirstCharacterOfTagName), this._emitChars("<"), this._reconsumeInState("DATA_STATE")
    } ["END_TAG_OPEN_STATE"](A) {
      if (zi(A)) this._createEndTagToken(), this._reconsumeInState("TAG_NAME_STATE");
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingEndTagName), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
      else this._err(t0.invalidFirstCharacterOfTagName), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
    } ["TAG_NAME_STATE"](A) {
      if (qI(A)) this.state = "BEFORE_ATTRIBUTE_NAME_STATE";
      else if (A === L1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (IP(A)) this.currentToken.tagName += Ei(A);
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.tagName += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this.currentToken.tagName += bJ(A)
    } ["RCDATA_LESS_THAN_SIGN_STATE"](A) {
      if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "RCDATA_END_TAG_OPEN_STATE";
      else this._emitChars("<"), this._reconsumeInState("RCDATA_STATE")
    } ["RCDATA_END_TAG_OPEN_STATE"](A) {
      if (zi(A)) this._createEndTagToken(), this._reconsumeInState("RCDATA_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("RCDATA_STATE")
    } ["RCDATA_END_TAG_NAME_STATE"](A) {
      if (IP(A)) this.currentToken.tagName += Ei(A), this.tempBuff.push(A);
      else if (U1A(A)) this.currentToken.tagName += bJ(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (qI(A)) {
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
      if (zi(A)) this._createEndTagToken(), this._reconsumeInState("RAWTEXT_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("RAWTEXT_STATE")
    } ["RAWTEXT_END_TAG_NAME_STATE"](A) {
      if (IP(A)) this.currentToken.tagName += Ei(A), this.tempBuff.push(A);
      else if (U1A(A)) this.currentToken.tagName += bJ(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (qI(A)) {
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
      if (zi(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_STATE")
    } ["SCRIPT_DATA_END_TAG_NAME_STATE"](A) {
      if (IP(A)) this.currentToken.tagName += Ei(A), this.tempBuff.push(A);
      else if (U1A(A)) this.currentToken.tagName += bJ(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (qI(A)) {
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
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
      else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_DASH_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this._emitChars("-");
      else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
      if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE";
      else if (zi(A)) this.tempBuff = [], this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE");
      else this._emitChars("<"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE"](A) {
      if (zi(A)) this._createEndTagToken(), this._reconsumeInState("SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE");
      else this._emitChars("</"), this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE"](A) {
      if (IP(A)) this.currentToken.tagName += Ei(A), this.tempBuff.push(A);
      else if (U1A(A)) this.currentToken.tagName += bJ(A), this.tempBuff.push(A);
      else {
        if (this.lastStartTagName === this.currentToken.tagName) {
          if (qI(A)) {
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
      if (qI(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_DOUBLE_ESCAPED_STATE" : "SCRIPT_DATA_ESCAPED_STATE", this._emitCodePoint(A);
      else if (IP(A)) this.tempBuff.push(T21(A)), this._emitCodePoint(A);
      else if (U1A(A)) this.tempBuff.push(A), this._emitCodePoint(A);
      else this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE")
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE", this._emitChars("-");
      else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE", this._emitChars("-");
      else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this._emitChars("-");
      else if (A === L1.LESS_THAN_SIGN) this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE", this._emitChars("<");
      else if (A === L1.GREATER_THAN_SIGN) this.state = "SCRIPT_DATA_STATE", this._emitChars(">");
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitChars(uG.REPLACEMENT_CHARACTER);
      else if (A === L1.EOF) this._err(t0.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
      else this.state = "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A)
    } ["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE"](A) {
      if (A === L1.SOLIDUS) this.tempBuff = [], this.state = "SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE", this._emitChars("/");
      else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
    } ["SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE"](A) {
      if (qI(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN) this.state = this._isTempBufferEqualToScriptString() ? "SCRIPT_DATA_ESCAPED_STATE" : "SCRIPT_DATA_DOUBLE_ESCAPED_STATE", this._emitCodePoint(A);
      else if (IP(A)) this.tempBuff.push(T21(A)), this._emitCodePoint(A);
      else if (U1A(A)) this.tempBuff.push(A), this._emitCodePoint(A);
      else this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE")
    } ["BEFORE_ATTRIBUTE_NAME_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN || A === L1.EOF) this._reconsumeInState("AFTER_ATTRIBUTE_NAME_STATE");
      else if (A === L1.EQUALS_SIGN) this._err(t0.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = "ATTRIBUTE_NAME_STATE";
      else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
    } ["ATTRIBUTE_NAME_STATE"](A) {
      if (qI(A) || A === L1.SOLIDUS || A === L1.GREATER_THAN_SIGN || A === L1.EOF) this._leaveAttrName("AFTER_ATTRIBUTE_NAME_STATE"), this._unconsume();
      else if (A === L1.EQUALS_SIGN) this._leaveAttrName("BEFORE_ATTRIBUTE_VALUE_STATE");
      else if (IP(A)) this.currentAttr.name += Ei(A);
      else if (A === L1.QUOTATION_MARK || A === L1.APOSTROPHE || A === L1.LESS_THAN_SIGN) this._err(t0.unexpectedCharacterInAttributeName), this.currentAttr.name += bJ(A);
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentAttr.name += uG.REPLACEMENT_CHARACTER;
      else this.currentAttr.name += bJ(A)
    } ["AFTER_ATTRIBUTE_NAME_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.SOLIDUS) this.state = "SELF_CLOSING_START_TAG_STATE";
      else if (A === L1.EQUALS_SIGN) this.state = "BEFORE_ATTRIBUTE_VALUE_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this._createAttr(""), this._reconsumeInState("ATTRIBUTE_NAME_STATE")
    } ["BEFORE_ATTRIBUTE_VALUE_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.QUOTATION_MARK) this.state = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this.state = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingAttributeValue), this.state = "DATA_STATE", this._emitCurrentToken();
      else this._reconsumeInState("ATTRIBUTE_VALUE_UNQUOTED_STATE")
    } ["ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE"](A) {
      if (A === L1.QUOTATION_MARK) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
      else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentAttr.value += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += bJ(A)
    } ["ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE"](A) {
      if (A === L1.APOSTROPHE) this.state = "AFTER_ATTRIBUTE_VALUE_QUOTED_STATE";
      else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentAttr.value += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += bJ(A)
    } ["ATTRIBUTE_VALUE_UNQUOTED_STATE"](A) {
      if (qI(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
      else if (A === L1.AMPERSAND) this.returnState = "ATTRIBUTE_VALUE_UNQUOTED_STATE", this.state = "CHARACTER_REFERENCE_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentAttr.value += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.QUOTATION_MARK || A === L1.APOSTROPHE || A === L1.LESS_THAN_SIGN || A === L1.EQUALS_SIGN || A === L1.GRAVE_ACCENT) this._err(t0.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += bJ(A);
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this.currentAttr.value += bJ(A)
    } ["AFTER_ATTRIBUTE_VALUE_QUOTED_STATE"](A) {
      if (qI(A)) this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE");
      else if (A === L1.SOLIDUS) this._leaveAttrValue("SELF_CLOSING_START_TAG_STATE");
      else if (A === L1.GREATER_THAN_SIGN) this._leaveAttrValue("DATA_STATE"), this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this._err(t0.missingWhitespaceBetweenAttributes), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
    } ["SELF_CLOSING_START_TAG_STATE"](A) {
      if (A === L1.GREATER_THAN_SIGN) this.currentToken.selfClosing = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInTag), this._emitEOFToken();
      else this._err(t0.unexpectedSolidusInTag), this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE")
    } ["BOGUS_COMMENT_STATE"](A) {
      if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._emitCurrentToken(), this._emitEOFToken();
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.data += uG.REPLACEMENT_CHARACTER;
      else this.currentToken.data += bJ(A)
    } ["MARKUP_DECLARATION_OPEN_STATE"](A) {
      if (this._consumeSequenceIfMatch(z1A.DASH_DASH_STRING, A, !0)) this._createCommentToken(), this.state = "COMMENT_START_STATE";
      else if (this._consumeSequenceIfMatch(z1A.DOCTYPE_STRING, A, !1)) this.state = "DOCTYPE_STATE";
      else if (this._consumeSequenceIfMatch(z1A.CDATA_START_STRING, A, !0))
        if (this.allowCDATA) this.state = "CDATA_SECTION_STATE";
        else this._err(t0.cdataInHtmlContent), this._createCommentToken(), this.currentToken.data = "[CDATA[", this.state = "BOGUS_COMMENT_STATE";
      else if (!this._ensureHibernation()) this._err(t0.incorrectlyOpenedComment), this._createCommentToken(), this._reconsumeInState("BOGUS_COMMENT_STATE")
    } ["COMMENT_START_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_START_DASH_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_START_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptClosingOfEmptyComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_DASH_STATE";
      else if (A === L1.LESS_THAN_SIGN) this.currentToken.data += "<", this.state = "COMMENT_LESS_THAN_SIGN_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.data += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.EOF) this._err(t0.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += bJ(A)
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
      if (A !== L1.GREATER_THAN_SIGN && A !== L1.EOF) this._err(t0.nestedComment);
      this._reconsumeInState("COMMENT_END_STATE")
    } ["COMMENT_END_DASH_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.state = "COMMENT_END_STATE";
      else if (A === L1.EOF) this._err(t0.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "-", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_END_STATE"](A) {
      if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EXCLAMATION_MARK) this.state = "COMMENT_END_BANG_STATE";
      else if (A === L1.HYPHEN_MINUS) this.currentToken.data += "-";
      else if (A === L1.EOF) this._err(t0.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "--", this._reconsumeInState("COMMENT_STATE")
    } ["COMMENT_END_BANG_STATE"](A) {
      if (A === L1.HYPHEN_MINUS) this.currentToken.data += "--!", this.state = "COMMENT_END_DASH_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.incorrectlyClosedComment), this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInComment), this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.data += "--!", this._reconsumeInState("COMMENT_STATE")
    } ["DOCTYPE_STATE"](A) {
      if (qI(A)) this.state = "BEFORE_DOCTYPE_NAME_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE");
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingWhitespaceBeforeDoctypeName), this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE")
    } ["BEFORE_DOCTYPE_NAME_STATE"](A) {
      if (qI(A)) return;
      if (IP(A)) this._createDoctypeToken(Ei(A)), this.state = "DOCTYPE_NAME_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this._createDoctypeToken(uG.REPLACEMENT_CHARACTER), this.state = "DOCTYPE_NAME_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingDoctypeName), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this._createDoctypeToken(null), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._createDoctypeToken(bJ(A)), this.state = "DOCTYPE_NAME_STATE"
    } ["DOCTYPE_NAME_STATE"](A) {
      if (qI(A)) this.state = "AFTER_DOCTYPE_NAME_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (IP(A)) this.currentToken.name += Ei(A);
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.name += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.name += bJ(A)
    } ["AFTER_DOCTYPE_NAME_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else if (this._consumeSequenceIfMatch(z1A.PUBLIC_STRING, A, !1)) this.state = "AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE";
      else if (this._consumeSequenceIfMatch(z1A.SYSTEM_STRING, A, !1)) this.state = "AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE";
      else if (!this._ensureHibernation()) this._err(t0.invalidCharacterSequenceAfterDoctypeName), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE"](A) {
      if (qI(A)) this.state = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === L1.QUOTATION_MARK) this._err(t0.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this._err(t0.missingWhitespaceAfterDoctypePublicKeyword), this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.QUOTATION_MARK) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this.currentToken.publicId = "", this.state = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
      if (A === L1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.publicId += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.publicId += bJ(A)
    } ["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
      if (A === L1.APOSTROPHE) this.state = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.publicId += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptDoctypePublicIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.publicId += bJ(A)
    } ["AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE"](A) {
      if (qI(A)) this.state = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.QUOTATION_MARK) this._err(t0.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this._err(t0.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE"](A) {
      if (qI(A)) this.state = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === L1.QUOTATION_MARK) this._err(t0.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this._err(t0.missingWhitespaceAfterDoctypeSystemKeyword), this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.QUOTATION_MARK) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE";
      else if (A === L1.APOSTROPHE) this.currentToken.systemId = "", this.state = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE";
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.missingDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this.state = "DATA_STATE", this._emitCurrentToken();
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.missingQuoteBeforeDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"](A) {
      if (A === L1.QUOTATION_MARK) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.systemId += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.systemId += bJ(A)
    } ["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"](A) {
      if (A === L1.APOSTROPHE) this.state = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter), this.currentToken.systemId += uG.REPLACEMENT_CHARACTER;
      else if (A === L1.GREATER_THAN_SIGN) this._err(t0.abruptDoctypeSystemIdentifier), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this.currentToken.systemId += bJ(A)
    } ["AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE"](A) {
      if (qI(A)) return;
      if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.EOF) this._err(t0.eofInDoctype), this.currentToken.forceQuirks = !0, this._emitCurrentToken(), this._emitEOFToken();
      else this._err(t0.unexpectedCharacterAfterDoctypeSystemIdentifier), this._reconsumeInState("BOGUS_DOCTYPE_STATE")
    } ["BOGUS_DOCTYPE_STATE"](A) {
      if (A === L1.GREATER_THAN_SIGN) this._emitCurrentToken(), this.state = "DATA_STATE";
      else if (A === L1.NULL) this._err(t0.unexpectedNullCharacter);
      else if (A === L1.EOF) this._emitCurrentToken(), this._emitEOFToken()
    } ["CDATA_SECTION_STATE"](A) {
      if (A === L1.RIGHT_SQUARE_BRACKET) this.state = "CDATA_SECTION_BRACKET_STATE";
      else if (A === L1.EOF) this._err(t0.eofInCdata), this._emitEOFToken();
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
      else if (n10(A)) this._reconsumeInState("NAMED_CHARACTER_REFERENCE_STATE");
      else this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["NAMED_CHARACTER_REFERENCE_STATE"](A) {
      let Q = this._matchNamedCharacterReference(A);
      if (this._ensureHibernation()) this.tempBuff = [L1.AMPERSAND];
      else if (Q) {
        let B = this.tempBuff[this.tempBuff.length - 1] === L1.SEMICOLON;
        if (!this._isCharacterReferenceAttributeQuirk(B)) {
          if (!B) this._errOnNextCodePoint(t0.missingSemicolonAfterCharacterReference);
          this.tempBuff = Q
        }
        this._flushCodePointsConsumedAsCharacterReference(), this.state = this.returnState
      } else this._flushCodePointsConsumedAsCharacterReference(), this.state = "AMBIGUOS_AMPERSAND_STATE"
    } ["AMBIGUOS_AMPERSAND_STATE"](A) {
      if (n10(A))
        if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += bJ(A);
        else this._emitCodePoint(A);
      else {
        if (A === L1.SEMICOLON) this._err(t0.unknownNamedCharacterReference);
        this._reconsumeInState(this.returnState)
      }
    } ["NUMERIC_CHARACTER_REFERENCE_STATE"](A) {
      if (this.charRefCode = 0, A === L1.LATIN_SMALL_X || A === L1.LATIN_CAPITAL_X) this.tempBuff.push(A), this.state = "HEXADEMICAL_CHARACTER_REFERENCE_START_STATE";
      else this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_START_STATE")
    } ["HEXADEMICAL_CHARACTER_REFERENCE_START_STATE"](A) {
      if (TJ5(A)) this._reconsumeInState("HEXADEMICAL_CHARACTER_REFERENCE_STATE");
      else this._err(t0.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["DECIMAL_CHARACTER_REFERENCE_START_STATE"](A) {
      if (DMA(A)) this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_STATE");
      else this._err(t0.absenceOfDigitsInNumericCharacterReference), this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    } ["HEXADEMICAL_CHARACTER_REFERENCE_STATE"](A) {
      if (J72(A)) this.charRefCode = this.charRefCode * 16 + A - 55;
      else if (W72(A)) this.charRefCode = this.charRefCode * 16 + A - 87;
      else if (DMA(A)) this.charRefCode = this.charRefCode * 16 + A - 48;
      else if (A === L1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
      else this._err(t0.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
    } ["DECIMAL_CHARACTER_REFERENCE_STATE"](A) {
      if (DMA(A)) this.charRefCode = this.charRefCode * 10 + A - 48;
      else if (A === L1.SEMICOLON) this.state = "NUMERIC_CHARACTER_REFERENCE_END_STATE";
      else this._err(t0.missingSemicolonAfterCharacterReference), this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE")
    } ["NUMERIC_CHARACTER_REFERENCE_END_STATE"]() {
      if (this.charRefCode === L1.NULL) this._err(t0.nullCharacterReference), this.charRefCode = L1.REPLACEMENT_CHARACTER;
      else if (this.charRefCode > 1114111) this._err(t0.characterReferenceOutsideUnicodeRange), this.charRefCode = L1.REPLACEMENT_CHARACTER;
      else if (uG.isSurrogate(this.charRefCode)) this._err(t0.surrogateCharacterReference), this.charRefCode = L1.REPLACEMENT_CHARACTER;
      else if (uG.isUndefinedCodePoint(this.charRefCode)) this._err(t0.noncharacterCharacterReference);
      else if (uG.isControlCodePoint(this.charRefCode) || this.charRefCode === L1.CARRIAGE_RETURN) {
        this._err(t0.controlCharacterReference);
        let A = RJ5[this.charRefCode];
        if (A) this.charRefCode = A
      }
      this.tempBuff = [this.charRefCode], this._flushCodePointsConsumedAsCharacterReference(), this._reconsumeInState(this.returnState)
    }
  }
  nZ.CHARACTER_TOKEN = "CHARACTER_TOKEN";
  nZ.NULL_CHARACTER_TOKEN = "NULL_CHARACTER_TOKEN";
  nZ.WHITESPACE_CHARACTER_TOKEN = "WHITESPACE_CHARACTER_TOKEN";
  nZ.START_TAG_TOKEN = "START_TAG_TOKEN";
  nZ.END_TAG_TOKEN = "END_TAG_TOKEN";
  nZ.COMMENT_TOKEN = "COMMENT_TOKEN";
  nZ.DOCTYPE_TOKEN = "DOCTYPE_TOKEN";
  nZ.EOF_TOKEN = "EOF_TOKEN";
  nZ.HIBERNATION_TOKEN = "HIBERNATION_TOKEN";
  nZ.MODE = {
    DATA: "DATA_STATE",
    RCDATA: "RCDATA_STATE",
    RAWTEXT: "RAWTEXT_STATE",
    SCRIPT_DATA: "SCRIPT_DATA_STATE",
    PLAINTEXT: "PLAINTEXT_STATE"
  };
  nZ.getTokenAttr = function(A, Q) {
    for (let B = A.attrs.length - 1; B >= 0; B--)
      if (A.attrs[B].name === Q) return A.attrs[B].value;
    return null
  };
  X72.exports = nZ
})
// @from(Start 9747727, End 9752806)
Ui = z((PJ5) => {
  var a10 = PJ5.NAMESPACES = {
    HTML: "http://www.w3.org/1999/xhtml",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/"
  };
  PJ5.ATTRS = {
    TYPE: "type",
    ACTION: "action",
    ENCODING: "encoding",
    PROMPT: "prompt",
    NAME: "name",
    COLOR: "color",
    FACE: "face",
    SIZE: "size"
  };
  PJ5.DOCUMENT_MODE = {
    NO_QUIRKS: "no-quirks",
    QUIRKS: "quirks",
    LIMITED_QUIRKS: "limited-quirks"
  };
  var bQ = PJ5.TAG_NAMES = {
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
  PJ5.SPECIAL_ELEMENTS = {
    [a10.HTML]: {
      [bQ.ADDRESS]: !0,
      [bQ.APPLET]: !0,
      [bQ.AREA]: !0,
      [bQ.ARTICLE]: !0,
      [bQ.ASIDE]: !0,
      [bQ.BASE]: !0,
      [bQ.BASEFONT]: !0,
      [bQ.BGSOUND]: !0,
      [bQ.BLOCKQUOTE]: !0,
      [bQ.BODY]: !0,
      [bQ.BR]: !0,
      [bQ.BUTTON]: !0,
      [bQ.CAPTION]: !0,
      [bQ.CENTER]: !0,
      [bQ.COL]: !0,
      [bQ.COLGROUP]: !0,
      [bQ.DD]: !0,
      [bQ.DETAILS]: !0,
      [bQ.DIR]: !0,
      [bQ.DIV]: !0,
      [bQ.DL]: !0,
      [bQ.DT]: !0,
      [bQ.EMBED]: !0,
      [bQ.FIELDSET]: !0,
      [bQ.FIGCAPTION]: !0,
      [bQ.FIGURE]: !0,
      [bQ.FOOTER]: !0,
      [bQ.FORM]: !0,
      [bQ.FRAME]: !0,
      [bQ.FRAMESET]: !0,
      [bQ.H1]: !0,
      [bQ.H2]: !0,
      [bQ.H3]: !0,
      [bQ.H4]: !0,
      [bQ.H5]: !0,
      [bQ.H6]: !0,
      [bQ.HEAD]: !0,
      [bQ.HEADER]: !0,
      [bQ.HGROUP]: !0,
      [bQ.HR]: !0,
      [bQ.HTML]: !0,
      [bQ.IFRAME]: !0,
      [bQ.IMG]: !0,
      [bQ.INPUT]: !0,
      [bQ.LI]: !0,
      [bQ.LINK]: !0,
      [bQ.LISTING]: !0,
      [bQ.MAIN]: !0,
      [bQ.MARQUEE]: !0,
      [bQ.MENU]: !0,
      [bQ.META]: !0,
      [bQ.NAV]: !0,
      [bQ.NOEMBED]: !0,
      [bQ.NOFRAMES]: !0,
      [bQ.NOSCRIPT]: !0,
      [bQ.OBJECT]: !0,
      [bQ.OL]: !0,
      [bQ.P]: !0,
      [bQ.PARAM]: !0,
      [bQ.PLAINTEXT]: !0,
      [bQ.PRE]: !0,
      [bQ.SCRIPT]: !0,
      [bQ.SECTION]: !0,
      [bQ.SELECT]: !0,
      [bQ.SOURCE]: !0,
      [bQ.STYLE]: !0,
      [bQ.SUMMARY]: !0,
      [bQ.TABLE]: !0,
      [bQ.TBODY]: !0,
      [bQ.TD]: !0,
      [bQ.TEMPLATE]: !0,
      [bQ.TEXTAREA]: !0,
      [bQ.TFOOT]: !0,
      [bQ.TH]: !0,
      [bQ.THEAD]: !0,
      [bQ.TITLE]: !0,
      [bQ.TR]: !0,
      [bQ.TRACK]: !0,
      [bQ.UL]: !0,
      [bQ.WBR]: !0,
      [bQ.XMP]: !0
    },
    [a10.MATHML]: {
      [bQ.MI]: !0,
      [bQ.MO]: !0,
      [bQ.MN]: !0,
      [bQ.MS]: !0,
      [bQ.MTEXT]: !0,
      [bQ.ANNOTATION_XML]: !0
    },
    [a10.SVG]: {
      [bQ.TITLE]: !0,
      [bQ.FOREIGN_OBJECT]: !0,
      [bQ.DESC]: !0
    }
  }
})
// @from(Start 9752812, End 9761437)
H72 = z((HkG, D72) => {
  var F72 = Ui(),
    pQ = F72.TAG_NAMES,
    mG = F72.NAMESPACES;

  function V72(A) {
    switch (A.length) {
      case 1:
        return A === pQ.P;
      case 2:
        return A === pQ.RB || A === pQ.RP || A === pQ.RT || A === pQ.DD || A === pQ.DT || A === pQ.LI;
      case 3:
        return A === pQ.RTC;
      case 6:
        return A === pQ.OPTION;
      case 8:
        return A === pQ.OPTGROUP
    }
    return !1
  }

  function kJ5(A) {
    switch (A.length) {
      case 1:
        return A === pQ.P;
      case 2:
        return A === pQ.RB || A === pQ.RP || A === pQ.RT || A === pQ.DD || A === pQ.DT || A === pQ.LI || A === pQ.TD || A === pQ.TH || A === pQ.TR;
      case 3:
        return A === pQ.RTC;
      case 5:
        return A === pQ.TBODY || A === pQ.TFOOT || A === pQ.THEAD;
      case 6:
        return A === pQ.OPTION;
      case 7:
        return A === pQ.CAPTION;
      case 8:
        return A === pQ.OPTGROUP || A === pQ.COLGROUP
    }
    return !1
  }

  function P21(A, Q) {
    switch (A.length) {
      case 2:
        if (A === pQ.TD || A === pQ.TH) return Q === mG.HTML;
        else if (A === pQ.MI || A === pQ.MO || A === pQ.MN || A === pQ.MS) return Q === mG.MATHML;
        break;
      case 4:
        if (A === pQ.HTML) return Q === mG.HTML;
        else if (A === pQ.DESC) return Q === mG.SVG;
        break;
      case 5:
        if (A === pQ.TABLE) return Q === mG.HTML;
        else if (A === pQ.MTEXT) return Q === mG.MATHML;
        else if (A === pQ.TITLE) return Q === mG.SVG;
        break;
      case 6:
        return (A === pQ.APPLET || A === pQ.OBJECT) && Q === mG.HTML;
      case 7:
        return (A === pQ.CAPTION || A === pQ.MARQUEE) && Q === mG.HTML;
      case 8:
        return A === pQ.TEMPLATE && Q === mG.HTML;
      case 13:
        return A === pQ.FOREIGN_OBJECT && Q === mG.SVG;
      case 14:
        return A === pQ.ANNOTATION_XML && Q === mG.MATHML
    }
    return !1
  }
  class K72 {
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
      return this.currentTagName === pQ.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === mG.HTML
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
        if (this.pop(), Q === A && B === mG.HTML) break
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
        if (this.pop(), A === pQ.H1 || A === pQ.H2 || A === pQ.H3 || A === pQ.H4 || A === pQ.H5 || A === pQ.H6 && Q === mG.HTML) break
      }
    }
    popUntilTableCellPopped() {
      while (this.stackTop > -1) {
        let A = this.currentTagName,
          Q = this.treeAdapter.getNamespaceURI(this.current);
        if (this.pop(), A === pQ.TD || A === pQ.TH && Q === mG.HTML) break
      }
    }
    popAllUpToHtmlElement() {
      this.stackTop = 0, this._updateCurrentElement()
    }
    clearBackToTableContext() {
      while (this.currentTagName !== pQ.TABLE && this.currentTagName !== pQ.TEMPLATE && this.currentTagName !== pQ.HTML || this.treeAdapter.getNamespaceURI(this.current) !== mG.HTML) this.pop()
    }
    clearBackToTableBodyContext() {
      while (this.currentTagName !== pQ.TBODY && this.currentTagName !== pQ.TFOOT && this.currentTagName !== pQ.THEAD && this.currentTagName !== pQ.TEMPLATE && this.currentTagName !== pQ.HTML || this.treeAdapter.getNamespaceURI(this.current) !== mG.HTML) this.pop()
    }
    clearBackToTableRowContext() {
      while (this.currentTagName !== pQ.TR && this.currentTagName !== pQ.TEMPLATE && this.currentTagName !== pQ.HTML || this.treeAdapter.getNamespaceURI(this.current) !== mG.HTML) this.pop()
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
      return A && this.treeAdapter.getTagName(A) === pQ.BODY ? A : null
    }
    contains(A) {
      return this._indexOf(A) > -1
    }
    getCommonAncestor(A) {
      let Q = this._indexOf(A);
      return --Q >= 0 ? this.items[Q] : null
    }
    isRootHtmlElementCurrent() {
      return this.stackTop === 0 && this.currentTagName === pQ.HTML
    }
    hasInScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === mG.HTML) return !0;
        if (P21(B, G)) return !1
      }
      return !0
    }
    hasNumberedHeaderInScope() {
      for (let A = this.stackTop; A >= 0; A--) {
        let Q = this.treeAdapter.getTagName(this.items[A]),
          B = this.treeAdapter.getNamespaceURI(this.items[A]);
        if ((Q === pQ.H1 || Q === pQ.H2 || Q === pQ.H3 || Q === pQ.H4 || Q === pQ.H5 || Q === pQ.H6) && B === mG.HTML) return !0;
        if (P21(Q, B)) return !1
      }
      return !0
    }
    hasInListItemScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === mG.HTML) return !0;
        if ((B === pQ.UL || B === pQ.OL) && G === mG.HTML || P21(B, G)) return !1
      }
      return !0
    }
    hasInButtonScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]),
          G = this.treeAdapter.getNamespaceURI(this.items[Q]);
        if (B === A && G === mG.HTML) return !0;
        if (B === pQ.BUTTON && G === mG.HTML || P21(B, G)) return !1
      }
      return !0
    }
    hasInTableScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]);
        if (this.treeAdapter.getNamespaceURI(this.items[Q]) !== mG.HTML) continue;
        if (B === A) return !0;
        if (B === pQ.TABLE || B === pQ.TEMPLATE || B === pQ.HTML) return !1
      }
      return !0
    }
    hasTableBodyContextInTableScope() {
      for (let A = this.stackTop; A >= 0; A--) {
        let Q = this.treeAdapter.getTagName(this.items[A]);
        if (this.treeAdapter.getNamespaceURI(this.items[A]) !== mG.HTML) continue;
        if (Q === pQ.TBODY || Q === pQ.THEAD || Q === pQ.TFOOT) return !0;
        if (Q === pQ.TABLE || Q === pQ.HTML) return !1
      }
      return !0
    }
    hasInSelectScope(A) {
      for (let Q = this.stackTop; Q >= 0; Q--) {
        let B = this.treeAdapter.getTagName(this.items[Q]);
        if (this.treeAdapter.getNamespaceURI(this.items[Q]) !== mG.HTML) continue;
        if (B === A) return !0;
        if (B !== pQ.OPTION && B !== pQ.OPTGROUP) return !1
      }
      return !0
    }
    generateImpliedEndTags() {
      while (V72(this.currentTagName)) this.pop()
    }
    generateImpliedEndTagsThoroughly() {
      while (kJ5(this.currentTagName)) this.pop()
    }
    generateImpliedEndTagsWithExclusion(A) {
      while (V72(this.currentTagName) && this.currentTagName !== A) this.pop()
    }
  }
  D72.exports = K72
})
// @from(Start 9761443, End 9764462)
E72 = z((CkG, C72) => {
  class YP {
    constructor(A) {
      this.length = 0, this.entries = [], this.treeAdapter = A, this.bookmark = null
    }
    _getNoahArkConditionCandidates(A) {
      let Q = [];
      if (this.length >= 3) {
        let B = this.treeAdapter.getAttrList(A).length,
          G = this.treeAdapter.getTagName(A),
          Z = this.treeAdapter.getNamespaceURI(A);
        for (let I = this.length - 1; I >= 0; I--) {
          let Y = this.entries[I];
          if (Y.type === YP.MARKER_ENTRY) break;
          let J = Y.element,
            W = this.treeAdapter.getAttrList(J);
          if (this.treeAdapter.getTagName(J) === G && this.treeAdapter.getNamespaceURI(J) === Z && W.length === B) Q.push({
            idx: I,
            attrs: W
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
          I = Object.create(null);
        for (let Y = 0; Y < Z; Y++) {
          let J = G[Y];
          I[J.name] = J.value
        }
        for (let Y = 0; Y < Z; Y++)
          for (let J = 0; J < B; J++) {
            let W = Q[J].attrs[Y];
            if (I[W.name] !== W.value) Q.splice(J, 1), B--;
            if (Q.length < 3) return
          }
        for (let Y = B - 1; Y >= 2; Y--) this.entries.splice(Q[Y].idx, 1), this.length--
      }
    }
    insertMarker() {
      this.entries.push({
        type: YP.MARKER_ENTRY
      }), this.length++
    }
    pushElement(A, Q) {
      this._ensureNoahArkCondition(A), this.entries.push({
        type: YP.ELEMENT_ENTRY,
        element: A,
        token: Q
      }), this.length++
    }
    insertElementAfterBookmark(A, Q) {
      let B = this.length - 1;
      for (; B >= 0; B--)
        if (this.entries[B] === this.bookmark) break;
      this.entries.splice(B + 1, 0, {
        type: YP.ELEMENT_ENTRY,
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
        if (this.length--, A.type === YP.MARKER_ENTRY) break
      }
    }
    getElementEntryInScopeWithTagName(A) {
      for (let Q = this.length - 1; Q >= 0; Q--) {
        let B = this.entries[Q];
        if (B.type === YP.MARKER_ENTRY) return null;
        if (this.treeAdapter.getTagName(B.element) === A) return B
      }
      return null
    }
    getElementEntry(A) {
      for (let Q = this.length - 1; Q >= 0; Q--) {
        let B = this.entries[Q];
        if (B.type === YP.ELEMENT_ENTRY && B.element === A) return B
      }
      return null
    }
  }
  YP.MARKER_ENTRY = "MARKER_ENTRY";
  YP.ELEMENT_ENTRY = "ELEMENT_ENTRY";
  C72.exports = YP
})
// @from(Start 9764468, End 9765049)
gk = z((EkG, z72) => {
  class s10 {
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
  s10.install = function(A, Q, B) {
    if (!A.__mixins) A.__mixins = [];
    for (let Z = 0; Z < A.__mixins.length; Z++)
      if (A.__mixins[Z].constructor === Q) return A.__mixins[Z];
    let G = new Q(A, B);
    return A.__mixins.push(G), G
  };
  z72.exports = s10
})
// @from(Start 9765055, End 9766096)
r10 = z((zkG, $72) => {
  var yJ5 = gk();
  class U72 extends yJ5 {
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
  $72.exports = U72
})
// @from(Start 9766102, End 9769396)
t10 = z((UkG, N72) => {
  var w72 = gk(),
    o10 = HMA(),
    xJ5 = r10();
  class q72 extends w72 {
    constructor(A) {
      super(A);
      this.tokenizer = A, this.posTracker = w72.install(A.preprocessor, xJ5), this.currentAttrLocation = null, this.ctLoc = null
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
          if (this.currentToken.type === o10.EOF_TOKEN) G.endLine = G.startLine, G.endCol = G.startCol, G.endOffset = G.startOffset;
          else G.endLine = A.posTracker.line, G.endCol = A.posTracker.col + 1, G.endOffset = A.posTracker.offset + 1;
          Q._emitCurrentToken.call(this)
        },
        _emitCurrentCharacterToken() {
          let G = this.currentCharacterToken && this.currentCharacterToken.location;
          if (G && G.endOffset === -1) G.endLine = A.posTracker.line, G.endCol = A.posTracker.col, G.endOffset = A.posTracker.offset;
          Q._emitCurrentCharacterToken.call(this)
        }
      };
      return Object.keys(o10.MODE).forEach((G) => {
        let Z = o10.MODE[G];
        B[Z] = function(I) {
          A.ctLoc = A._getCurrentLocation(), Q[Z].call(this, I)
        }
      }), B
    }
  }
  N72.exports = q72
})
// @from(Start 9769402, End 9769979)
O72 = z(($kG, M72) => {
  var vJ5 = gk();
  class L72 extends vJ5 {
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
  M72.exports = L72
})
// @from(Start 9769985, End 9774822)
j72 = z((wkG, P72) => {
  var e10 = gk(),
    R72 = HMA(),
    bJ5 = t10(),
    fJ5 = O72(),
    hJ5 = Ui(),
    A00 = hJ5.TAG_NAMES;
  class T72 extends e10 {
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
          if (Q.type === R72.END_TAG_TOKEN && Z === Q.tagName) B.endTag = Object.assign({}, G), B.endLine = G.endLine, B.endCol = G.endCol, B.endOffset = G.endOffset;
          else B.endLine = G.startLine, B.endCol = G.startCol, B.endOffset = G.startOffset
        }
      }
    }
    _getOverriddenMethods(A, Q) {
      return {
        _bootstrap(B, G) {
          Q._bootstrap.call(this, B, G), A.lastStartTagToken = null, A.lastFosterParentingLocation = null, A.currentToken = null;
          let Z = e10.install(this.tokenizer, bJ5);
          A.posTracker = Z.posTracker, e10.install(this.openElements, fJ5, {
            onItemPop: function(I) {
              A._setEndLocation(I, A.currentToken)
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
          if (A.currentToken = B, Q._processToken.call(this, B), B.type === R72.END_TAG_TOKEN && (B.tagName === A00.HTML || B.tagName === A00.BODY && this.openElements.hasInScope(A00.BODY)))
            for (let Z = this.openElements.stackTop; Z >= 0; Z--) {
              let I = this.openElements.items[Z];
              if (this.treeAdapter.getTagName(I) === B.tagName) {
                A._setEndLocation(I, B);
                break
              }
            }
        },
        _setDocumentType(B) {
          Q._setDocumentType.call(this, B);
          let G = this.treeAdapter.getChildNodes(this.document),
            Z = G.length;
          for (let I = 0; I < Z; I++) {
            let Y = G[I];
            if (this.treeAdapter.isDocumentTypeNode(Y)) {
              this.treeAdapter.setNodeSourceCodeLocation(Y, B.location);
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
            I = Z[Z.length - 1];
          this.treeAdapter.setNodeSourceCodeLocation(I, B.location)
        },
        _findFosterParentingLocation() {
          return A.lastFosterParentingLocation = Q._findFosterParentingLocation.call(this), A.lastFosterParentingLocation
        },
        _insertCharacters(B) {
          Q._insertCharacters.call(this, B);
          let G = this._shouldFosterParentOnInsertion(),
            Z = G && A.lastFosterParentingLocation.parent || this.openElements.currentTmplContent || this.openElements.current,
            I = this.treeAdapter.getChildNodes(Z),
            Y = G && A.lastFosterParentingLocation.beforeElement ? I.indexOf(A.lastFosterParentingLocation.beforeElement) - 1 : I.length - 1,
            J = I[Y],
            W = this.treeAdapter.getNodeSourceCodeLocation(J);
          if (W) W.endLine = B.location.endLine, W.endCol = B.location.endCol, W.endOffset = B.location.endOffset;
          else this.treeAdapter.setNodeSourceCodeLocation(J, B.location)
        }
      }
    }
  }
  P72.exports = T72
})
// @from(Start 9774828, End 9775591)
j21 = z((qkG, _72) => {
  var gJ5 = gk();
  class S72 extends gJ5 {
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
  _72.exports = S72
})
// @from(Start 9775597, End 9775995)
x72 = z((NkG, y72) => {
  var uJ5 = j21(),
    mJ5 = r10(),
    dJ5 = gk();
  class k72 extends uJ5 {
    constructor(A, Q) {
      super(A, Q);
      this.posTracker = dJ5.install(A, mJ5), this.lastErrOffset = -1
    }
    _reportError(A) {
      if (this.lastErrOffset !== this.posTracker.offset) this.lastErrOffset = this.posTracker.offset, super._reportError(A)
    }
  }
  y72.exports = k72
})
// @from(Start 9776001, End 9776266)
f72 = z((LkG, b72) => {
  var cJ5 = j21(),
    pJ5 = x72(),
    lJ5 = gk();
  class v72 extends cJ5 {
    constructor(A, Q) {
      super(A, Q);
      let B = lJ5.install(A.preprocessor, pJ5, Q);
      this.posTracker = B.posTracker
    }
  }
  b72.exports = v72
})
// @from(Start 9776272, End 9777354)
m72 = z((MkG, u72) => {
  var iJ5 = j21(),
    nJ5 = f72(),
    aJ5 = t10(),
    h72 = gk();
  class g72 extends iJ5 {
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
          Q._bootstrap.call(this, B, G), h72.install(this.tokenizer, nJ5, A.opts), h72.install(this.tokenizer, aJ5)
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
  u72.exports = g72
})
// @from(Start 9777360, End 9781057)
Q00 = z((oJ5) => {
  var {
    DOCUMENT_MODE: sJ5
  } = Ui();
  oJ5.createDocument = function() {
    return {
      nodeName: "#document",
      mode: sJ5.NO_QUIRKS,
      childNodes: []
    }
  };
  oJ5.createDocumentFragment = function() {
    return {
      nodeName: "#document-fragment",
      childNodes: []
    }
  };
  oJ5.createElement = function(A, Q, B) {
    return {
      nodeName: A,
      tagName: A,
      attrs: B,
      namespaceURI: Q,
      childNodes: [],
      parentNode: null
    }
  };
  oJ5.createCommentNode = function(A) {
    return {
      nodeName: "#comment",
      data: A,
      parentNode: null
    }
  };
  var d72 = function(A) {
      return {
        nodeName: "#text",
        value: A,
        parentNode: null
      }
    },
    c72 = oJ5.appendChild = function(A, Q) {
      A.childNodes.push(Q), Q.parentNode = A
    },
    rJ5 = oJ5.insertBefore = function(A, Q, B) {
      let G = A.childNodes.indexOf(B);
      A.childNodes.splice(G, 0, Q), Q.parentNode = A
    };
  oJ5.setTemplateContent = function(A, Q) {
    A.content = Q
  };
  oJ5.getTemplateContent = function(A) {
    return A.content
  };
  oJ5.setDocumentType = function(A, Q, B, G) {
    let Z = null;
    for (let I = 0; I < A.childNodes.length; I++)
      if (A.childNodes[I].nodeName === "#documentType") {
        Z = A.childNodes[I];
        break
      } if (Z) Z.name = Q, Z.publicId = B, Z.systemId = G;
    else c72(A, {
      nodeName: "#documentType",
      name: Q,
      publicId: B,
      systemId: G
    })
  };
  oJ5.setDocumentMode = function(A, Q) {
    A.mode = Q
  };
  oJ5.getDocumentMode = function(A) {
    return A.mode
  };
  oJ5.detachNode = function(A) {
    if (A.parentNode) {
      let Q = A.parentNode.childNodes.indexOf(A);
      A.parentNode.childNodes.splice(Q, 1), A.parentNode = null
    }
  };
  oJ5.insertText = function(A, Q) {
    if (A.childNodes.length) {
      let B = A.childNodes[A.childNodes.length - 1];
      if (B.nodeName === "#text") {
        B.value += Q;
        return
      }
    }
    c72(A, d72(Q))
  };
  oJ5.insertTextBefore = function(A, Q, B) {
    let G = A.childNodes[A.childNodes.indexOf(B) - 1];
    if (G && G.nodeName === "#text") G.value += Q;
    else rJ5(A, d72(Q), B)
  };
  oJ5.adoptAttributes = function(A, Q) {
    let B = [];
    for (let G = 0; G < A.attrs.length; G++) B.push(A.attrs[G].name);
    for (let G = 0; G < Q.length; G++)
      if (B.indexOf(Q[G].name) === -1) A.attrs.push(Q[G])
  };
  oJ5.getFirstChild = function(A) {
    return A.childNodes[0]
  };
  oJ5.getChildNodes = function(A) {
    return A.childNodes
  };
  oJ5.getParentNode = function(A) {
    return A.parentNode
  };
  oJ5.getAttrList = function(A) {
    return A.attrs
  };
  oJ5.getTagName = function(A) {
    return A.tagName
  };
  oJ5.getNamespaceURI = function(A) {
    return A.namespaceURI
  };
  oJ5.getTextNodeContent = function(A) {
    return A.value
  };
  oJ5.getCommentNodeContent = function(A) {
    return A.data
  };
  oJ5.getDocumentTypeNodeName = function(A) {
    return A.name
  };
  oJ5.getDocumentTypeNodePublicId = function(A) {
    return A.publicId
  };
  oJ5.getDocumentTypeNodeSystemId = function(A) {
    return A.systemId
  };
  oJ5.isTextNode = function(A) {
    return A.nodeName === "#text"
  };
  oJ5.isCommentNode = function(A) {
    return A.nodeName === "#comment"
  };
  oJ5.isDocumentTypeNode = function(A) {
    return A.nodeName === "#documentType"
  };
  oJ5.isElementNode = function(A) {
    return !!A.tagName
  };
  oJ5.setNodeSourceCodeLocation = function(A, Q) {
    A.sourceCodeLocation = Q
  };
  oJ5.getNodeSourceCodeLocation = function(A) {
    return A.sourceCodeLocation
  }
})
// @from(Start 9781063, End 9781298)
B00 = z((PkG, p72) => {
  p72.exports = function(Q, B) {
    return B = B || Object.create(null), [Q, B].reduce((G, Z) => {
      return Object.keys(Z).forEach((I) => {
        G[I] = Z[I]
      }), G
    }, Object.create(null))
  }
})
// @from(Start 9781304, End 9785099)
G00 = z((_W5) => {
  var {
    DOCUMENT_MODE: JYA
  } = Ui(), n72 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], PW5 = n72.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), jW5 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], a72 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], SW5 = a72.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

  function l72(A) {
    let Q = A.indexOf('"') !== -1 ? "'" : '"';
    return Q + A + Q
  }

  function i72(A, Q) {
    for (let B = 0; B < Q.length; B++)
      if (A.indexOf(Q[B]) === 0) return !0;
    return !1
  }
  _W5.isConforming = function(A) {
    return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
  };
  _W5.getDocumentMode = function(A) {
    if (A.name !== "html") return JYA.QUIRKS;
    let Q = A.systemId;
    if (Q && Q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return JYA.QUIRKS;
    let B = A.publicId;
    if (B !== null) {
      if (B = B.toLowerCase(), jW5.indexOf(B) > -1) return JYA.QUIRKS;
      let G = Q === null ? PW5 : n72;
      if (i72(B, G)) return JYA.QUIRKS;
      if (G = Q === null ? a72 : SW5, i72(B, G)) return JYA.LIMITED_QUIRKS
    }
    return JYA.NO_QUIRKS
  };
  _W5.serializeContent = function(A, Q, B) {
    let G = "!DOCTYPE ";
    if (A) G += A;
    if (Q) G += " PUBLIC " + l72(Q);
    else if (B) G += " SYSTEM";
    if (B !== null) G += " " + l72(B);
    return G
  }
})
// @from(Start 9785105, End 9792540)
r72 = z((mW5) => {
  var Z00 = HMA(),
    I00 = Ui(),
    S9 = I00.TAG_NAMES,
    vD = I00.NAMESPACES,
    S21 = I00.ATTRS,
    s72 = {
      TEXT_HTML: "text/html",
      APPLICATION_XML: "application/xhtml+xml"
    },
    vW5 = {
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
    bW5 = {
      "xlink:actuate": {
        prefix: "xlink",
        name: "actuate",
        namespace: vD.XLINK
      },
      "xlink:arcrole": {
        prefix: "xlink",
        name: "arcrole",
        namespace: vD.XLINK
      },
      "xlink:href": {
        prefix: "xlink",
        name: "href",
        namespace: vD.XLINK
      },
      "xlink:role": {
        prefix: "xlink",
        name: "role",
        namespace: vD.XLINK
      },
      "xlink:show": {
        prefix: "xlink",
        name: "show",
        namespace: vD.XLINK
      },
      "xlink:title": {
        prefix: "xlink",
        name: "title",
        namespace: vD.XLINK
      },
      "xlink:type": {
        prefix: "xlink",
        name: "type",
        namespace: vD.XLINK
      },
      "xml:base": {
        prefix: "xml",
        name: "base",
        namespace: vD.XML
      },
      "xml:lang": {
        prefix: "xml",
        name: "lang",
        namespace: vD.XML
      },
      "xml:space": {
        prefix: "xml",
        name: "space",
        namespace: vD.XML
      },
      xmlns: {
        prefix: "",
        name: "xmlns",
        namespace: vD.XMLNS
      },
      "xmlns:xlink": {
        prefix: "xmlns",
        name: "xlink",
        namespace: vD.XMLNS
      }
    },
    fW5 = mW5.SVG_TAG_NAMES_ADJUSTMENT_MAP = {
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
    hW5 = {
      [S9.B]: !0,
      [S9.BIG]: !0,
      [S9.BLOCKQUOTE]: !0,
      [S9.BODY]: !0,
      [S9.BR]: !0,
      [S9.CENTER]: !0,
      [S9.CODE]: !0,
      [S9.DD]: !0,
      [S9.DIV]: !0,
      [S9.DL]: !0,
      [S9.DT]: !0,
      [S9.EM]: !0,
      [S9.EMBED]: !0,
      [S9.H1]: !0,
      [S9.H2]: !0,
      [S9.H3]: !0,
      [S9.H4]: !0,
      [S9.H5]: !0,
      [S9.H6]: !0,
      [S9.HEAD]: !0,
      [S9.HR]: !0,
      [S9.I]: !0,
      [S9.IMG]: !0,
      [S9.LI]: !0,
      [S9.LISTING]: !0,
      [S9.MENU]: !0,
      [S9.META]: !0,
      [S9.NOBR]: !0,
      [S9.OL]: !0,
      [S9.P]: !0,
      [S9.PRE]: !0,
      [S9.RUBY]: !0,
      [S9.S]: !0,
      [S9.SMALL]: !0,
      [S9.SPAN]: !0,
      [S9.STRONG]: !0,
      [S9.STRIKE]: !0,
      [S9.SUB]: !0,
      [S9.SUP]: !0,
      [S9.TABLE]: !0,
      [S9.TT]: !0,
      [S9.U]: !0,
      [S9.UL]: !0,
      [S9.VAR]: !0
    };
  mW5.causesExit = function(A) {
    let Q = A.tagName;
    return Q === S9.FONT && (Z00.getTokenAttr(A, S21.COLOR) !== null || Z00.getTokenAttr(A, S21.SIZE) !== null || Z00.getTokenAttr(A, S21.FACE) !== null) ? !0 : hW5[Q]
  };
  mW5.adjustTokenMathMLAttrs = function(A) {
    for (let Q = 0; Q < A.attrs.length; Q++)
      if (A.attrs[Q].name === "definitionurl") {
        A.attrs[Q].name = "definitionURL";
        break
      }
  };
  mW5.adjustTokenSVGAttrs = function(A) {
    for (let Q = 0; Q < A.attrs.length; Q++) {
      let B = vW5[A.attrs[Q].name];
      if (B) A.attrs[Q].name = B
    }
  };
  mW5.adjustTokenXMLAttrs = function(A) {
    for (let Q = 0; Q < A.attrs.length; Q++) {
      let B = bW5[A.attrs[Q].name];
      if (B) A.attrs[Q].prefix = B.prefix, A.attrs[Q].name = B.name, A.attrs[Q].namespace = B.namespace
    }
  };
  mW5.adjustTokenSVGTagName = function(A) {
    let Q = fW5[A.tagName];
    if (Q) A.tagName = Q
  };

  function gW5(A, Q) {
    return Q === vD.MATHML && (A === S9.MI || A === S9.MO || A === S9.MN || A === S9.MS || A === S9.MTEXT)
  }

  function uW5(A, Q, B) {
    if (Q === vD.MATHML && A === S9.ANNOTATION_XML) {
      for (let G = 0; G < B.length; G++)
        if (B[G].name === S21.ENCODING) {
          let Z = B[G].value.toLowerCase();
          return Z === s72.TEXT_HTML || Z === s72.APPLICATION_XML
        }
    }
    return Q === vD.SVG && (A === S9.FOREIGN_OBJECT || A === S9.DESC || A === S9.TITLE)
  }
  mW5.isIntegrationPoint = function(A, Q, B, G) {
    if ((!G || G === vD.HTML) && uW5(A, Q, B)) return !0;
    if ((!G || G === vD.MATHML) && gW5(A, Q)) return !0;
    return !1
  }
})