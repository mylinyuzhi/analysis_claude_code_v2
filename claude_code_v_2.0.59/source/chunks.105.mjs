
// @from(Start 9792546, End 9852028)
CG2 = z((kkG, HG2) => {
  var P1 = HMA(),
    aW5 = H72(),
    o72 = E72(),
    sW5 = j72(),
    rW5 = m72(),
    t72 = gk(),
    oW5 = Q00(),
    tW5 = B00(),
    e72 = G00(),
    uk = r72(),
    bD = R21(),
    eW5 = O21(),
    q1A = Ui(),
    XA = q1A.TAG_NAMES,
    w2 = q1A.NAMESPACES,
    XG2 = q1A.ATTRS,
    AX5 = {
      scriptingEnabled: !0,
      sourceCodeLocationInfo: !1,
      onParseError: null,
      treeAdapter: oW5
    },
    QX5 = {
      [XA.TR]: "IN_ROW_MODE",
      [XA.TBODY]: "IN_TABLE_BODY_MODE",
      [XA.THEAD]: "IN_TABLE_BODY_MODE",
      [XA.TFOOT]: "IN_TABLE_BODY_MODE",
      [XA.CAPTION]: "IN_CAPTION_MODE",
      [XA.COLGROUP]: "IN_COLUMN_GROUP_MODE",
      [XA.TABLE]: "IN_TABLE_MODE",
      [XA.BODY]: "IN_BODY_MODE",
      [XA.FRAMESET]: "IN_FRAMESET_MODE"
    },
    BX5 = {
      [XA.CAPTION]: "IN_TABLE_MODE",
      [XA.COLGROUP]: "IN_TABLE_MODE",
      [XA.TBODY]: "IN_TABLE_MODE",
      [XA.TFOOT]: "IN_TABLE_MODE",
      [XA.THEAD]: "IN_TABLE_MODE",
      [XA.COL]: "IN_COLUMN_GROUP_MODE",
      [XA.TR]: "IN_TABLE_BODY_MODE",
      [XA.TD]: "IN_ROW_MODE",
      [XA.TH]: "IN_ROW_MODE"
    },
    AG2 = {
      ["INITIAL_MODE"]: {
        [P1.CHARACTER_TOKEN]: EMA,
        [P1.NULL_CHARACTER_TOKEN]: EMA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: x5,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: VX5,
        [P1.START_TAG_TOKEN]: EMA,
        [P1.END_TAG_TOKEN]: EMA,
        [P1.EOF_TOKEN]: EMA
      },
      ["BEFORE_HTML_MODE"]: {
        [P1.CHARACTER_TOKEN]: UMA,
        [P1.NULL_CHARACTER_TOKEN]: UMA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: x5,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: FX5,
        [P1.END_TAG_TOKEN]: KX5,
        [P1.EOF_TOKEN]: UMA
      },
      ["BEFORE_HEAD_MODE"]: {
        [P1.CHARACTER_TOKEN]: $MA,
        [P1.NULL_CHARACTER_TOKEN]: $MA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: x5,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: _21,
        [P1.START_TAG_TOKEN]: DX5,
        [P1.END_TAG_TOKEN]: HX5,
        [P1.EOF_TOKEN]: $MA
      },
      ["IN_HEAD_MODE"]: {
        [P1.CHARACTER_TOKEN]: wMA,
        [P1.NULL_CHARACTER_TOKEN]: wMA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: _21,
        [P1.START_TAG_TOKEN]: AK,
        [P1.END_TAG_TOKEN]: N1A,
        [P1.EOF_TOKEN]: wMA
      },
      ["IN_HEAD_NO_SCRIPT_MODE"]: {
        [P1.CHARACTER_TOKEN]: qMA,
        [P1.NULL_CHARACTER_TOKEN]: qMA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: _21,
        [P1.START_TAG_TOKEN]: CX5,
        [P1.END_TAG_TOKEN]: EX5,
        [P1.EOF_TOKEN]: qMA
      },
      ["AFTER_HEAD_MODE"]: {
        [P1.CHARACTER_TOKEN]: NMA,
        [P1.NULL_CHARACTER_TOKEN]: NMA,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: _21,
        [P1.START_TAG_TOKEN]: zX5,
        [P1.END_TAG_TOKEN]: UX5,
        [P1.EOF_TOKEN]: NMA
      },
      ["IN_BODY_MODE"]: {
        [P1.CHARACTER_TOKEN]: k21,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: aU,
        [P1.END_TAG_TOKEN]: Y00,
        [P1.EOF_TOKEN]: Uh
      },
      ["TEXT_MODE"]: {
        [P1.CHARACTER_TOKEN]: nU,
        [P1.NULL_CHARACTER_TOKEN]: nU,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: x5,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: x5,
        [P1.END_TAG_TOKEN]: sX5,
        [P1.EOF_TOKEN]: rX5
      },
      ["IN_TABLE_MODE"]: {
        [P1.CHARACTER_TOKEN]: $h,
        [P1.NULL_CHARACTER_TOKEN]: $h,
        [P1.WHITESPACE_CHARACTER_TOKEN]: $h,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: J00,
        [P1.END_TAG_TOKEN]: W00,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_TABLE_TEXT_MODE"]: {
        [P1.CHARACTER_TOKEN]: YV5,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: IV5,
        [P1.COMMENT_TOKEN]: zMA,
        [P1.DOCTYPE_TOKEN]: zMA,
        [P1.START_TAG_TOKEN]: zMA,
        [P1.END_TAG_TOKEN]: zMA,
        [P1.EOF_TOKEN]: zMA
      },
      ["IN_CAPTION_MODE"]: {
        [P1.CHARACTER_TOKEN]: k21,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: JV5,
        [P1.END_TAG_TOKEN]: WV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_COLUMN_GROUP_MODE"]: {
        [P1.CHARACTER_TOKEN]: x21,
        [P1.NULL_CHARACTER_TOKEN]: x21,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: XV5,
        [P1.END_TAG_TOKEN]: VV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_TABLE_BODY_MODE"]: {
        [P1.CHARACTER_TOKEN]: $h,
        [P1.NULL_CHARACTER_TOKEN]: $h,
        [P1.WHITESPACE_CHARACTER_TOKEN]: $h,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: FV5,
        [P1.END_TAG_TOKEN]: KV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_ROW_MODE"]: {
        [P1.CHARACTER_TOKEN]: $h,
        [P1.NULL_CHARACTER_TOKEN]: $h,
        [P1.WHITESPACE_CHARACTER_TOKEN]: $h,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: DV5,
        [P1.END_TAG_TOKEN]: HV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_CELL_MODE"]: {
        [P1.CHARACTER_TOKEN]: k21,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: CV5,
        [P1.END_TAG_TOKEN]: EV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_SELECT_MODE"]: {
        [P1.CHARACTER_TOKEN]: nU,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: FG2,
        [P1.END_TAG_TOKEN]: KG2,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_SELECT_IN_TABLE_MODE"]: {
        [P1.CHARACTER_TOKEN]: nU,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: zV5,
        [P1.END_TAG_TOKEN]: UV5,
        [P1.EOF_TOKEN]: Uh
      },
      ["IN_TEMPLATE_MODE"]: {
        [P1.CHARACTER_TOKEN]: k21,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: $V5,
        [P1.END_TAG_TOKEN]: wV5,
        [P1.EOF_TOKEN]: DG2
      },
      ["AFTER_BODY_MODE"]: {
        [P1.CHARACTER_TOKEN]: v21,
        [P1.NULL_CHARACTER_TOKEN]: v21,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: XX5,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: qV5,
        [P1.END_TAG_TOKEN]: NV5,
        [P1.EOF_TOKEN]: CMA
      },
      ["IN_FRAMESET_MODE"]: {
        [P1.CHARACTER_TOKEN]: x5,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: LV5,
        [P1.END_TAG_TOKEN]: MV5,
        [P1.EOF_TOKEN]: CMA
      },
      ["AFTER_FRAMESET_MODE"]: {
        [P1.CHARACTER_TOKEN]: x5,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: nU,
        [P1.COMMENT_TOKEN]: hV,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: OV5,
        [P1.END_TAG_TOKEN]: RV5,
        [P1.EOF_TOKEN]: CMA
      },
      ["AFTER_AFTER_BODY_MODE"]: {
        [P1.CHARACTER_TOKEN]: y21,
        [P1.NULL_CHARACTER_TOKEN]: y21,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: QG2,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: TV5,
        [P1.END_TAG_TOKEN]: y21,
        [P1.EOF_TOKEN]: CMA
      },
      ["AFTER_AFTER_FRAMESET_MODE"]: {
        [P1.CHARACTER_TOKEN]: x5,
        [P1.NULL_CHARACTER_TOKEN]: x5,
        [P1.WHITESPACE_CHARACTER_TOKEN]: w1A,
        [P1.COMMENT_TOKEN]: QG2,
        [P1.DOCTYPE_TOKEN]: x5,
        [P1.START_TAG_TOKEN]: PV5,
        [P1.END_TAG_TOKEN]: x5,
        [P1.EOF_TOKEN]: CMA
      }
    };
  class VG2 {
    constructor(A) {
      if (this.options = tW5(AX5, A), this.treeAdapter = this.options.treeAdapter, this.pendingScript = null, this.options.sourceCodeLocationInfo) t72.install(this, sW5);
      if (this.options.onParseError) t72.install(this, rW5, {
        onParseError: this.options.onParseError
      })
    }
    parse(A) {
      let Q = this.treeAdapter.createDocument();
      return this._bootstrap(Q, null), this.tokenizer.write(A, !0), this._runParsingLoop(null), Q
    }
    parseFragment(A, Q) {
      if (!Q) Q = this.treeAdapter.createElement(XA.TEMPLATE, w2.HTML, []);
      let B = this.treeAdapter.createElement("documentmock", w2.HTML, []);
      if (this._bootstrap(B, Q), this.treeAdapter.getTagName(Q) === XA.TEMPLATE) this._pushTmplInsertionMode("IN_TEMPLATE_MODE");
      this._initTokenizerForFragmentParsing(), this._insertFakeRootElement(), this._resetInsertionMode(), this._findFormInFragmentContext(), this.tokenizer.write(A, !0), this._runParsingLoop(null);
      let G = this.treeAdapter.getFirstChild(B),
        Z = this.treeAdapter.createDocumentFragment();
      return this._adoptNodes(G, Z), Z
    }
    _bootstrap(A, Q) {
      this.tokenizer = new P1(this.options), this.stopped = !1, this.insertionMode = "INITIAL_MODE", this.originalInsertionMode = "", this.document = A, this.fragmentContext = Q, this.headElement = null, this.formElement = null, this.openElements = new aW5(this.document, this.treeAdapter), this.activeFormattingElements = new o72(this.treeAdapter), this.tmplInsertionModeStack = [], this.tmplInsertionModeStackTop = -1, this.currentTmplInsertionMode = null, this.pendingCharacterTokens = [], this.hasNonWhitespacePendingCharacterToken = !1, this.framesetOk = !0, this.skipNextNewLine = !1, this.fosterParentingEnabled = !1
    }
    _err() {}
    _runParsingLoop(A) {
      while (!this.stopped) {
        this._setupTokenizerCDATAMode();
        let Q = this.tokenizer.getNextToken();
        if (Q.type === P1.HIBERNATION_TOKEN) break;
        if (this.skipNextNewLine) {
          if (this.skipNextNewLine = !1, Q.type === P1.WHITESPACE_CHARACTER_TOKEN && Q.chars[0] === `
`) {
            if (Q.chars.length === 1) continue;
            Q.chars = Q.chars.substr(1)
          }
        }
        if (this._processInputToken(Q), A && this.pendingScript) break
      }
    }
    runParsingLoopForCurrentChunk(A, Q) {
      if (this._runParsingLoop(Q), Q && this.pendingScript) {
        let B = this.pendingScript;
        this.pendingScript = null, Q(B);
        return
      }
      if (A) A()
    }
    _setupTokenizerCDATAMode() {
      let A = this._getAdjustedCurrentElement();
      this.tokenizer.allowCDATA = A && A !== this.document && this.treeAdapter.getNamespaceURI(A) !== w2.HTML && !this._isIntegrationPoint(A)
    }
    _switchToTextParsing(A, Q) {
      this._insertElement(A, w2.HTML), this.tokenizer.state = Q, this.originalInsertionMode = this.insertionMode, this.insertionMode = "TEXT_MODE"
    }
    switchToPlaintextParsing() {
      this.insertionMode = "TEXT_MODE", this.originalInsertionMode = "IN_BODY_MODE", this.tokenizer.state = P1.MODE.PLAINTEXT
    }
    _getAdjustedCurrentElement() {
      return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current
    }
    _findFormInFragmentContext() {
      let A = this.fragmentContext;
      do {
        if (this.treeAdapter.getTagName(A) === XA.FORM) {
          this.formElement = A;
          break
        }
        A = this.treeAdapter.getParentNode(A)
      } while (A)
    }
    _initTokenizerForFragmentParsing() {
      if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === w2.HTML) {
        let A = this.treeAdapter.getTagName(this.fragmentContext);
        if (A === XA.TITLE || A === XA.TEXTAREA) this.tokenizer.state = P1.MODE.RCDATA;
        else if (A === XA.STYLE || A === XA.XMP || A === XA.IFRAME || A === XA.NOEMBED || A === XA.NOFRAMES || A === XA.NOSCRIPT) this.tokenizer.state = P1.MODE.RAWTEXT;
        else if (A === XA.SCRIPT) this.tokenizer.state = P1.MODE.SCRIPT_DATA;
        else if (A === XA.PLAINTEXT) this.tokenizer.state = P1.MODE.PLAINTEXT
      }
    }
    _setDocumentType(A) {
      let Q = A.name || "",
        B = A.publicId || "",
        G = A.systemId || "";
      this.treeAdapter.setDocumentType(this.document, Q, B, G)
    }
    _attachElementToTree(A) {
      if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(A);
      else {
        let Q = this.openElements.currentTmplContent || this.openElements.current;
        this.treeAdapter.appendChild(Q, A)
      }
    }
    _appendElement(A, Q) {
      let B = this.treeAdapter.createElement(A.tagName, Q, A.attrs);
      this._attachElementToTree(B)
    }
    _insertElement(A, Q) {
      let B = this.treeAdapter.createElement(A.tagName, Q, A.attrs);
      this._attachElementToTree(B), this.openElements.push(B)
    }
    _insertFakeElement(A) {
      let Q = this.treeAdapter.createElement(A, w2.HTML, []);
      this._attachElementToTree(Q), this.openElements.push(Q)
    }
    _insertTemplate(A) {
      let Q = this.treeAdapter.createElement(A.tagName, w2.HTML, A.attrs),
        B = this.treeAdapter.createDocumentFragment();
      this.treeAdapter.setTemplateContent(Q, B), this._attachElementToTree(Q), this.openElements.push(Q)
    }
    _insertFakeRootElement() {
      let A = this.treeAdapter.createElement(XA.HTML, w2.HTML, []);
      this.treeAdapter.appendChild(this.openElements.current, A), this.openElements.push(A)
    }
    _appendCommentNode(A, Q) {
      let B = this.treeAdapter.createCommentNode(A.data);
      this.treeAdapter.appendChild(Q, B)
    }
    _insertCharacters(A) {
      if (this._shouldFosterParentOnInsertion()) this._fosterParentText(A.chars);
      else {
        let Q = this.openElements.currentTmplContent || this.openElements.current;
        this.treeAdapter.insertText(Q, A.chars)
      }
    }
    _adoptNodes(A, Q) {
      for (let B = this.treeAdapter.getFirstChild(A); B; B = this.treeAdapter.getFirstChild(A)) this.treeAdapter.detachNode(B), this.treeAdapter.appendChild(Q, B)
    }
    _shouldProcessTokenInForeignContent(A) {
      let Q = this._getAdjustedCurrentElement();
      if (!Q || Q === this.document) return !1;
      let B = this.treeAdapter.getNamespaceURI(Q);
      if (B === w2.HTML) return !1;
      if (this.treeAdapter.getTagName(Q) === XA.ANNOTATION_XML && B === w2.MATHML && A.type === P1.START_TAG_TOKEN && A.tagName === XA.SVG) return !1;
      let G = A.type === P1.CHARACTER_TOKEN || A.type === P1.NULL_CHARACTER_TOKEN || A.type === P1.WHITESPACE_CHARACTER_TOKEN;
      if ((A.type === P1.START_TAG_TOKEN && A.tagName !== XA.MGLYPH && A.tagName !== XA.MALIGNMARK || G) && this._isIntegrationPoint(Q, w2.MATHML)) return !1;
      if ((A.type === P1.START_TAG_TOKEN || G) && this._isIntegrationPoint(Q, w2.HTML)) return !1;
      return A.type !== P1.EOF_TOKEN
    }
    _processToken(A) {
      AG2[this.insertionMode][A.type](this, A)
    }
    _processTokenInBodyMode(A) {
      AG2.IN_BODY_MODE[A.type](this, A)
    }
    _processTokenInForeignContent(A) {
      if (A.type === P1.CHARACTER_TOKEN) SV5(this, A);
      else if (A.type === P1.NULL_CHARACTER_TOKEN) jV5(this, A);
      else if (A.type === P1.WHITESPACE_CHARACTER_TOKEN) nU(this, A);
      else if (A.type === P1.COMMENT_TOKEN) hV(this, A);
      else if (A.type === P1.START_TAG_TOKEN) _V5(this, A);
      else if (A.type === P1.END_TAG_TOKEN) kV5(this, A)
    }
    _processInputToken(A) {
      if (this._shouldProcessTokenInForeignContent(A)) this._processTokenInForeignContent(A);
      else this._processToken(A);
      if (A.type === P1.START_TAG_TOKEN && A.selfClosing && !A.ackSelfClosing) this._err(bD.nonVoidHtmlElementStartTagWithTrailingSolidus)
    }
    _isIntegrationPoint(A, Q) {
      let B = this.treeAdapter.getTagName(A),
        G = this.treeAdapter.getNamespaceURI(A),
        Z = this.treeAdapter.getAttrList(A);
      return uk.isIntegrationPoint(B, G, Z, Q)
    }
    _reconstructActiveFormattingElements() {
      let A = this.activeFormattingElements.length;
      if (A) {
        let Q = A,
          B = null;
        do
          if (Q--, B = this.activeFormattingElements.entries[Q], B.type === o72.MARKER_ENTRY || this.openElements.contains(B.element)) {
            Q++;
            break
          } while (Q > 0);
        for (let G = Q; G < A; G++) B = this.activeFormattingElements.entries[G], this._insertElement(B.token, this.treeAdapter.getNamespaceURI(B.element)), B.element = this.openElements.current
      }
    }
    _closeTableCell() {
      this.openElements.generateImpliedEndTags(), this.openElements.popUntilTableCellPopped(), this.activeFormattingElements.clearToLastMarker(), this.insertionMode = "IN_ROW_MODE"
    }
    _closePElement() {
      this.openElements.generateImpliedEndTagsWithExclusion(XA.P), this.openElements.popUntilTagNamePopped(XA.P)
    }
    _resetInsertionMode() {
      for (let A = this.openElements.stackTop, Q = !1; A >= 0; A--) {
        let B = this.openElements.items[A];
        if (A === 0) {
          if (Q = !0, this.fragmentContext) B = this.fragmentContext
        }
        let G = this.treeAdapter.getTagName(B),
          Z = QX5[G];
        if (Z) {
          this.insertionMode = Z;
          break
        } else if (!Q && (G === XA.TD || G === XA.TH)) {
          this.insertionMode = "IN_CELL_MODE";
          break
        } else if (!Q && G === XA.HEAD) {
          this.insertionMode = "IN_HEAD_MODE";
          break
        } else if (G === XA.SELECT) {
          this._resetInsertionModeForSelect(A);
          break
        } else if (G === XA.TEMPLATE) {
          this.insertionMode = this.currentTmplInsertionMode;
          break
        } else if (G === XA.HTML) {
          this.insertionMode = this.headElement ? "AFTER_HEAD_MODE" : "BEFORE_HEAD_MODE";
          break
        } else if (Q) {
          this.insertionMode = "IN_BODY_MODE";
          break
        }
      }
    }
    _resetInsertionModeForSelect(A) {
      if (A > 0)
        for (let Q = A - 1; Q > 0; Q--) {
          let B = this.openElements.items[Q],
            G = this.treeAdapter.getTagName(B);
          if (G === XA.TEMPLATE) break;
          else if (G === XA.TABLE) {
            this.insertionMode = "IN_SELECT_IN_TABLE_MODE";
            return
          }
        }
      this.insertionMode = "IN_SELECT_MODE"
    }
    _pushTmplInsertionMode(A) {
      this.tmplInsertionModeStack.push(A), this.tmplInsertionModeStackTop++, this.currentTmplInsertionMode = A
    }
    _popTmplInsertionMode() {
      this.tmplInsertionModeStack.pop(), this.tmplInsertionModeStackTop--, this.currentTmplInsertionMode = this.tmplInsertionModeStack[this.tmplInsertionModeStackTop]
    }
    _isElementCausesFosterParenting(A) {
      let Q = this.treeAdapter.getTagName(A);
      return Q === XA.TABLE || Q === XA.TBODY || Q === XA.TFOOT || Q === XA.THEAD || Q === XA.TR
    }
    _shouldFosterParentOnInsertion() {
      return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.current)
    }
    _findFosterParentingLocation() {
      let A = {
        parent: null,
        beforeElement: null
      };
      for (let Q = this.openElements.stackTop; Q >= 0; Q--) {
        let B = this.openElements.items[Q],
          G = this.treeAdapter.getTagName(B),
          Z = this.treeAdapter.getNamespaceURI(B);
        if (G === XA.TEMPLATE && Z === w2.HTML) {
          A.parent = this.treeAdapter.getTemplateContent(B);
          break
        } else if (G === XA.TABLE) {
          if (A.parent = this.treeAdapter.getParentNode(B), A.parent) A.beforeElement = B;
          else A.parent = this.openElements.items[Q - 1];
          break
        }
      }
      if (!A.parent) A.parent = this.openElements.items[0];
      return A
    }
    _fosterParentElement(A) {
      let Q = this._findFosterParentingLocation();
      if (Q.beforeElement) this.treeAdapter.insertBefore(Q.parent, A, Q.beforeElement);
      else this.treeAdapter.appendChild(Q.parent, A)
    }
    _fosterParentText(A) {
      let Q = this._findFosterParentingLocation();
      if (Q.beforeElement) this.treeAdapter.insertTextBefore(Q.parent, A, Q.beforeElement);
      else this.treeAdapter.insertText(Q.parent, A)
    }
    _isSpecialElement(A) {
      let Q = this.treeAdapter.getTagName(A),
        B = this.treeAdapter.getNamespaceURI(A);
      return q1A.SPECIAL_ELEMENTS[B][Q]
    }
  }
  HG2.exports = VG2;

  function GX5(A, Q) {
    let B = A.activeFormattingElements.getElementEntryInScopeWithTagName(Q.tagName);
    if (B) {
      if (!A.openElements.contains(B.element)) A.activeFormattingElements.removeEntry(B), B = null;
      else if (!A.openElements.hasInScope(Q.tagName)) B = null
    } else JP(A, Q);
    return B
  }

  function ZX5(A, Q) {
    let B = null;
    for (let G = A.openElements.stackTop; G >= 0; G--) {
      let Z = A.openElements.items[G];
      if (Z === Q.element) break;
      if (A._isSpecialElement(Z)) B = Z
    }
    if (!B) A.openElements.popUntilElementPopped(Q.element), A.activeFormattingElements.removeEntry(Q);
    return B
  }

  function IX5(A, Q, B) {
    let G = Q,
      Z = A.openElements.getCommonAncestor(Q);
    for (let I = 0, Y = Z; Y !== B; I++, Y = Z) {
      Z = A.openElements.getCommonAncestor(Y);
      let J = A.activeFormattingElements.getElementEntry(Y),
        W = J && I >= 3;
      if (!J || W) {
        if (W) A.activeFormattingElements.removeEntry(J);
        A.openElements.remove(Y)
      } else {
        if (Y = YX5(A, J), G === Q) A.activeFormattingElements.bookmark = J;
        A.treeAdapter.detachNode(G), A.treeAdapter.appendChild(Y, G), G = Y
      }
    }
    return G
  }

  function YX5(A, Q) {
    let B = A.treeAdapter.getNamespaceURI(Q.element),
      G = A.treeAdapter.createElement(Q.token.tagName, B, Q.token.attrs);
    return A.openElements.replace(Q.element, G), Q.element = G, G
  }

  function JX5(A, Q, B) {
    if (A._isElementCausesFosterParenting(Q)) A._fosterParentElement(B);
    else {
      let G = A.treeAdapter.getTagName(Q),
        Z = A.treeAdapter.getNamespaceURI(Q);
      if (G === XA.TEMPLATE && Z === w2.HTML) Q = A.treeAdapter.getTemplateContent(Q);
      A.treeAdapter.appendChild(Q, B)
    }
  }

  function WX5(A, Q, B) {
    let G = A.treeAdapter.getNamespaceURI(B.element),
      Z = B.token,
      I = A.treeAdapter.createElement(Z.tagName, G, Z.attrs);
    A._adoptNodes(Q, I), A.treeAdapter.appendChild(Q, I), A.activeFormattingElements.insertElementAfterBookmark(I, B.token), A.activeFormattingElements.removeEntry(B), A.openElements.remove(B.element), A.openElements.insertAfter(Q, I)
  }

  function wi(A, Q) {
    let B;
    for (let G = 0; G < 8; G++) {
      if (B = GX5(A, Q, B), !B) break;
      let Z = ZX5(A, B);
      if (!Z) break;
      A.activeFormattingElements.bookmark = B;
      let I = IX5(A, Z, B.element),
        Y = A.openElements.getCommonAncestor(B.element);
      A.treeAdapter.detachNode(I), JX5(A, Y, I), WX5(A, Z, B)
    }
  }

  function x5() {}

  function _21(A) {
    A._err(bD.misplacedDoctype)
  }

  function hV(A, Q) {
    A._appendCommentNode(Q, A.openElements.currentTmplContent || A.openElements.current)
  }

  function XX5(A, Q) {
    A._appendCommentNode(Q, A.openElements.items[0])
  }

  function QG2(A, Q) {
    A._appendCommentNode(Q, A.document)
  }

  function nU(A, Q) {
    A._insertCharacters(Q)
  }

  function CMA(A) {
    A.stopped = !0
  }

  function VX5(A, Q) {
    A._setDocumentType(Q);
    let B = Q.forceQuirks ? q1A.DOCUMENT_MODE.QUIRKS : e72.getDocumentMode(Q);
    if (!e72.isConforming(Q)) A._err(bD.nonConformingDoctype);
    A.treeAdapter.setDocumentMode(A.document, B), A.insertionMode = "BEFORE_HTML_MODE"
  }

  function EMA(A, Q) {
    A._err(bD.missingDoctype, {
      beforeToken: !0
    }), A.treeAdapter.setDocumentMode(A.document, q1A.DOCUMENT_MODE.QUIRKS), A.insertionMode = "BEFORE_HTML_MODE", A._processToken(Q)
  }

  function FX5(A, Q) {
    if (Q.tagName === XA.HTML) A._insertElement(Q, w2.HTML), A.insertionMode = "BEFORE_HEAD_MODE";
    else UMA(A, Q)
  }

  function KX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML || B === XA.HEAD || B === XA.BODY || B === XA.BR) UMA(A, Q)
  }

  function UMA(A, Q) {
    A._insertFakeRootElement(), A.insertionMode = "BEFORE_HEAD_MODE", A._processToken(Q)
  }

  function DX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.HEAD) A._insertElement(Q, w2.HTML), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE";
    else $MA(A, Q)
  }

  function HX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HEAD || B === XA.BODY || B === XA.HTML || B === XA.BR) $MA(A, Q);
    else A._err(bD.endTagWithoutMatchingOpenElement)
  }

  function $MA(A, Q) {
    A._insertFakeElement(XA.HEAD), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE", A._processToken(Q)
  }

  function AK(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.BASE || B === XA.BASEFONT || B === XA.BGSOUND || B === XA.LINK || B === XA.META) A._appendElement(Q, w2.HTML), Q.ackSelfClosing = !0;
    else if (B === XA.TITLE) A._switchToTextParsing(Q, P1.MODE.RCDATA);
    else if (B === XA.NOSCRIPT)
      if (A.options.scriptingEnabled) A._switchToTextParsing(Q, P1.MODE.RAWTEXT);
      else A._insertElement(Q, w2.HTML), A.insertionMode = "IN_HEAD_NO_SCRIPT_MODE";
    else if (B === XA.NOFRAMES || B === XA.STYLE) A._switchToTextParsing(Q, P1.MODE.RAWTEXT);
    else if (B === XA.SCRIPT) A._switchToTextParsing(Q, P1.MODE.SCRIPT_DATA);
    else if (B === XA.TEMPLATE) A._insertTemplate(Q, w2.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1, A.insertionMode = "IN_TEMPLATE_MODE", A._pushTmplInsertionMode("IN_TEMPLATE_MODE");
    else if (B === XA.HEAD) A._err(bD.misplacedStartTagForHeadElement);
    else wMA(A, Q)
  }

  function N1A(A, Q) {
    let B = Q.tagName;
    if (B === XA.HEAD) A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE";
    else if (B === XA.BODY || B === XA.BR || B === XA.HTML) wMA(A, Q);
    else if (B === XA.TEMPLATE)
      if (A.openElements.tmplCount > 0) {
        if (A.openElements.generateImpliedEndTagsThoroughly(), A.openElements.currentTagName !== XA.TEMPLATE) A._err(bD.closingOfElementWithOpenChildElements);
        A.openElements.popUntilTagNamePopped(XA.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode()
      } else A._err(bD.endTagWithoutMatchingOpenElement);
    else A._err(bD.endTagWithoutMatchingOpenElement)
  }

  function wMA(A, Q) {
    A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE", A._processToken(Q)
  }

  function CX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.BASEFONT || B === XA.BGSOUND || B === XA.HEAD || B === XA.LINK || B === XA.META || B === XA.NOFRAMES || B === XA.STYLE) AK(A, Q);
    else if (B === XA.NOSCRIPT) A._err(bD.nestedNoscriptInHead);
    else qMA(A, Q)
  }

  function EX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.NOSCRIPT) A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE";
    else if (B === XA.BR) qMA(A, Q);
    else A._err(bD.endTagWithoutMatchingOpenElement)
  }

  function qMA(A, Q) {
    let B = Q.type === P1.EOF_TOKEN ? bD.openElementsLeftAfterEof : bD.disallowedContentInNoscriptInHead;
    A._err(B), A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE", A._processToken(Q)
  }

  function zX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.BODY) A._insertElement(Q, w2.HTML), A.framesetOk = !1, A.insertionMode = "IN_BODY_MODE";
    else if (B === XA.FRAMESET) A._insertElement(Q, w2.HTML), A.insertionMode = "IN_FRAMESET_MODE";
    else if (B === XA.BASE || B === XA.BASEFONT || B === XA.BGSOUND || B === XA.LINK || B === XA.META || B === XA.NOFRAMES || B === XA.SCRIPT || B === XA.STYLE || B === XA.TEMPLATE || B === XA.TITLE) A._err(bD.abandonedHeadElementChild), A.openElements.push(A.headElement), AK(A, Q), A.openElements.remove(A.headElement);
    else if (B === XA.HEAD) A._err(bD.misplacedStartTagForHeadElement);
    else NMA(A, Q)
  }

  function UX5(A, Q) {
    let B = Q.tagName;
    if (B === XA.BODY || B === XA.HTML || B === XA.BR) NMA(A, Q);
    else if (B === XA.TEMPLATE) N1A(A, Q);
    else A._err(bD.endTagWithoutMatchingOpenElement)
  }

  function NMA(A, Q) {
    A._insertFakeElement(XA.BODY), A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function w1A(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertCharacters(Q)
  }

  function k21(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertCharacters(Q), A.framesetOk = !1
  }

  function $X5(A, Q) {
    if (A.openElements.tmplCount === 0) A.treeAdapter.adoptAttributes(A.openElements.items[0], Q.attrs)
  }

  function wX5(A, Q) {
    let B = A.openElements.tryPeekProperlyNestedBodyElement();
    if (B && A.openElements.tmplCount === 0) A.framesetOk = !1, A.treeAdapter.adoptAttributes(B, Q.attrs)
  }

  function qX5(A, Q) {
    let B = A.openElements.tryPeekProperlyNestedBodyElement();
    if (A.framesetOk && B) A.treeAdapter.detachNode(B), A.openElements.popAllUpToHtmlElement(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_FRAMESET_MODE"
  }

  function zh(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML)
  }

  function NX5(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    let B = A.openElements.currentTagName;
    if (B === XA.H1 || B === XA.H2 || B === XA.H3 || B === XA.H4 || B === XA.H5 || B === XA.H6) A.openElements.pop();
    A._insertElement(Q, w2.HTML)
  }

  function BG2(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML), A.skipNextNewLine = !0, A.framesetOk = !1
  }

  function LX5(A, Q) {
    let B = A.openElements.tmplCount > 0;
    if (!A.formElement || B) {
      if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
      if (A._insertElement(Q, w2.HTML), !B) A.formElement = A.openElements.current
    }
  }

  function MX5(A, Q) {
    A.framesetOk = !1;
    let B = Q.tagName;
    for (let G = A.openElements.stackTop; G >= 0; G--) {
      let Z = A.openElements.items[G],
        I = A.treeAdapter.getTagName(Z),
        Y = null;
      if (B === XA.LI && I === XA.LI) Y = XA.LI;
      else if ((B === XA.DD || B === XA.DT) && (I === XA.DD || I === XA.DT)) Y = I;
      if (Y) {
        A.openElements.generateImpliedEndTagsWithExclusion(Y), A.openElements.popUntilTagNamePopped(Y);
        break
      }
      if (I !== XA.ADDRESS && I !== XA.DIV && I !== XA.P && A._isSpecialElement(Z)) break
    }
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML)
  }

  function OX5(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML), A.tokenizer.state = P1.MODE.PLAINTEXT
  }

  function RX5(A, Q) {
    if (A.openElements.hasInScope(XA.BUTTON)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(XA.BUTTON);
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML), A.framesetOk = !1
  }

  function TX5(A, Q) {
    let B = A.activeFormattingElements.getElementEntryInScopeWithTagName(XA.A);
    if (B) wi(A, Q), A.openElements.remove(B.element), A.activeFormattingElements.removeEntry(B);
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function WYA(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function PX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), A.openElements.hasInScope(XA.NOBR)) wi(A, Q), A._reconstructActiveFormattingElements();
    A._insertElement(Q, w2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function GG2(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1
  }

  function jX5(A, Q) {
    if (A.treeAdapter.getDocumentMode(A.document) !== q1A.DOCUMENT_MODE.QUIRKS && A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML), A.framesetOk = !1, A.insertionMode = "IN_TABLE_MODE"
  }

  function XYA(A, Q) {
    A._reconstructActiveFormattingElements(), A._appendElement(Q, w2.HTML), A.framesetOk = !1, Q.ackSelfClosing = !0
  }

  function SX5(A, Q) {
    A._reconstructActiveFormattingElements(), A._appendElement(Q, w2.HTML);
    let B = P1.getTokenAttr(Q, XG2.TYPE);
    if (!B || B.toLowerCase() !== "hidden") A.framesetOk = !1;
    Q.ackSelfClosing = !0
  }

  function ZG2(A, Q) {
    A._appendElement(Q, w2.HTML), Q.ackSelfClosing = !0
  }

  function _X5(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._appendElement(Q, w2.HTML), A.framesetOk = !1, A.ackSelfClosing = !0
  }

  function kX5(A, Q) {
    Q.tagName = XA.IMG, XYA(A, Q)
  }

  function yX5(A, Q) {
    A._insertElement(Q, w2.HTML), A.skipNextNewLine = !0, A.tokenizer.state = P1.MODE.RCDATA, A.originalInsertionMode = A.insertionMode, A.framesetOk = !1, A.insertionMode = "TEXT_MODE"
  }

  function xX5(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._reconstructActiveFormattingElements(), A.framesetOk = !1, A._switchToTextParsing(Q, P1.MODE.RAWTEXT)
  }

  function vX5(A, Q) {
    A.framesetOk = !1, A._switchToTextParsing(Q, P1.MODE.RAWTEXT)
  }

  function IG2(A, Q) {
    A._switchToTextParsing(Q, P1.MODE.RAWTEXT)
  }

  function bX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML), A.framesetOk = !1, A.insertionMode === "IN_TABLE_MODE" || A.insertionMode === "IN_CAPTION_MODE" || A.insertionMode === "IN_TABLE_BODY_MODE" || A.insertionMode === "IN_ROW_MODE" || A.insertionMode === "IN_CELL_MODE") A.insertionMode = "IN_SELECT_IN_TABLE_MODE";
    else A.insertionMode = "IN_SELECT_MODE"
  }

  function YG2(A, Q) {
    if (A.openElements.currentTagName === XA.OPTION) A.openElements.pop();
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML)
  }

  function JG2(A, Q) {
    if (A.openElements.hasInScope(XA.RUBY)) A.openElements.generateImpliedEndTags();
    A._insertElement(Q, w2.HTML)
  }

  function fX5(A, Q) {
    if (A.openElements.hasInScope(XA.RUBY)) A.openElements.generateImpliedEndTagsWithExclusion(XA.RTC);
    A._insertElement(Q, w2.HTML)
  }

  function hX5(A, Q) {
    if (A.openElements.hasInButtonScope(XA.P)) A._closePElement();
    A._insertElement(Q, w2.HTML)
  }

  function gX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), uk.adjustTokenMathMLAttrs(Q), uk.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, w2.MATHML);
    else A._insertElement(Q, w2.MATHML);
    Q.ackSelfClosing = !0
  }

  function uX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), uk.adjustTokenSVGAttrs(Q), uk.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, w2.SVG);
    else A._insertElement(Q, w2.SVG);
    Q.ackSelfClosing = !0
  }

  function AO(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, w2.HTML)
  }

  function aU(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 1:
        if (B === XA.I || B === XA.S || B === XA.B || B === XA.U) WYA(A, Q);
        else if (B === XA.P) zh(A, Q);
        else if (B === XA.A) TX5(A, Q);
        else AO(A, Q);
        break;
      case 2:
        if (B === XA.DL || B === XA.OL || B === XA.UL) zh(A, Q);
        else if (B === XA.H1 || B === XA.H2 || B === XA.H3 || B === XA.H4 || B === XA.H5 || B === XA.H6) NX5(A, Q);
        else if (B === XA.LI || B === XA.DD || B === XA.DT) MX5(A, Q);
        else if (B === XA.EM || B === XA.TT) WYA(A, Q);
        else if (B === XA.BR) XYA(A, Q);
        else if (B === XA.HR) _X5(A, Q);
        else if (B === XA.RB) JG2(A, Q);
        else if (B === XA.RT || B === XA.RP) fX5(A, Q);
        else if (B !== XA.TH && B !== XA.TD && B !== XA.TR) AO(A, Q);
        break;
      case 3:
        if (B === XA.DIV || B === XA.DIR || B === XA.NAV) zh(A, Q);
        else if (B === XA.PRE) BG2(A, Q);
        else if (B === XA.BIG) WYA(A, Q);
        else if (B === XA.IMG || B === XA.WBR) XYA(A, Q);
        else if (B === XA.XMP) xX5(A, Q);
        else if (B === XA.SVG) uX5(A, Q);
        else if (B === XA.RTC) JG2(A, Q);
        else if (B !== XA.COL) AO(A, Q);
        break;
      case 4:
        if (B === XA.HTML) $X5(A, Q);
        else if (B === XA.BASE || B === XA.LINK || B === XA.META) AK(A, Q);
        else if (B === XA.BODY) wX5(A, Q);
        else if (B === XA.MAIN || B === XA.MENU) zh(A, Q);
        else if (B === XA.FORM) LX5(A, Q);
        else if (B === XA.CODE || B === XA.FONT) WYA(A, Q);
        else if (B === XA.NOBR) PX5(A, Q);
        else if (B === XA.AREA) XYA(A, Q);
        else if (B === XA.MATH) gX5(A, Q);
        else if (B === XA.MENU) hX5(A, Q);
        else if (B !== XA.HEAD) AO(A, Q);
        break;
      case 5:
        if (B === XA.STYLE || B === XA.TITLE) AK(A, Q);
        else if (B === XA.ASIDE) zh(A, Q);
        else if (B === XA.SMALL) WYA(A, Q);
        else if (B === XA.TABLE) jX5(A, Q);
        else if (B === XA.EMBED) XYA(A, Q);
        else if (B === XA.INPUT) SX5(A, Q);
        else if (B === XA.PARAM || B === XA.TRACK) ZG2(A, Q);
        else if (B === XA.IMAGE) kX5(A, Q);
        else if (B !== XA.FRAME && B !== XA.TBODY && B !== XA.TFOOT && B !== XA.THEAD) AO(A, Q);
        break;
      case 6:
        if (B === XA.SCRIPT) AK(A, Q);
        else if (B === XA.CENTER || B === XA.FIGURE || B === XA.FOOTER || B === XA.HEADER || B === XA.HGROUP || B === XA.DIALOG) zh(A, Q);
        else if (B === XA.BUTTON) RX5(A, Q);
        else if (B === XA.STRIKE || B === XA.STRONG) WYA(A, Q);
        else if (B === XA.APPLET || B === XA.OBJECT) GG2(A, Q);
        else if (B === XA.KEYGEN) XYA(A, Q);
        else if (B === XA.SOURCE) ZG2(A, Q);
        else if (B === XA.IFRAME) vX5(A, Q);
        else if (B === XA.SELECT) bX5(A, Q);
        else if (B === XA.OPTION) YG2(A, Q);
        else AO(A, Q);
        break;
      case 7:
        if (B === XA.BGSOUND) AK(A, Q);
        else if (B === XA.DETAILS || B === XA.ADDRESS || B === XA.ARTICLE || B === XA.SECTION || B === XA.SUMMARY) zh(A, Q);
        else if (B === XA.LISTING) BG2(A, Q);
        else if (B === XA.MARQUEE) GG2(A, Q);
        else if (B === XA.NOEMBED) IG2(A, Q);
        else if (B !== XA.CAPTION) AO(A, Q);
        break;
      case 8:
        if (B === XA.BASEFONT) AK(A, Q);
        else if (B === XA.FRAMESET) qX5(A, Q);
        else if (B === XA.FIELDSET) zh(A, Q);
        else if (B === XA.TEXTAREA) yX5(A, Q);
        else if (B === XA.TEMPLATE) AK(A, Q);
        else if (B === XA.NOSCRIPT)
          if (A.options.scriptingEnabled) IG2(A, Q);
          else AO(A, Q);
        else if (B === XA.OPTGROUP) YG2(A, Q);
        else if (B !== XA.COLGROUP) AO(A, Q);
        break;
      case 9:
        if (B === XA.PLAINTEXT) OX5(A, Q);
        else AO(A, Q);
        break;
      case 10:
        if (B === XA.BLOCKQUOTE || B === XA.FIGCAPTION) zh(A, Q);
        else AO(A, Q);
        break;
      default:
        AO(A, Q)
    }
  }

  function mX5(A) {
    if (A.openElements.hasInScope(XA.BODY)) A.insertionMode = "AFTER_BODY_MODE"
  }

  function dX5(A, Q) {
    if (A.openElements.hasInScope(XA.BODY)) A.insertionMode = "AFTER_BODY_MODE", A._processToken(Q)
  }

  function $i(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B)
  }

  function cX5(A) {
    let Q = A.openElements.tmplCount > 0,
      B = A.formElement;
    if (!Q) A.formElement = null;
    if ((B || Q) && A.openElements.hasInScope(XA.FORM))
      if (A.openElements.generateImpliedEndTags(), Q) A.openElements.popUntilTagNamePopped(XA.FORM);
      else A.openElements.remove(B)
  }

  function pX5(A) {
    if (!A.openElements.hasInButtonScope(XA.P)) A._insertFakeElement(XA.P);
    A._closePElement()
  }

  function lX5(A) {
    if (A.openElements.hasInListItemScope(XA.LI)) A.openElements.generateImpliedEndTagsWithExclusion(XA.LI), A.openElements.popUntilTagNamePopped(XA.LI)
  }

  function iX5(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTagsWithExclusion(B), A.openElements.popUntilTagNamePopped(B)
  }

  function nX5(A) {
    if (A.openElements.hasNumberedHeaderInScope()) A.openElements.generateImpliedEndTags(), A.openElements.popUntilNumberedHeaderPopped()
  }

  function WG2(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B), A.activeFormattingElements.clearToLastMarker()
  }

  function aX5(A) {
    A._reconstructActiveFormattingElements(), A._insertFakeElement(XA.BR), A.openElements.pop(), A.framesetOk = !1
  }

  function JP(A, Q) {
    let B = Q.tagName;
    for (let G = A.openElements.stackTop; G > 0; G--) {
      let Z = A.openElements.items[G];
      if (A.treeAdapter.getTagName(Z) === B) {
        A.openElements.generateImpliedEndTagsWithExclusion(B), A.openElements.popUntilElementPopped(Z);
        break
      }
      if (A._isSpecialElement(Z)) break
    }
  }

  function Y00(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 1:
        if (B === XA.A || B === XA.B || B === XA.I || B === XA.S || B === XA.U) wi(A, Q);
        else if (B === XA.P) pX5(A, Q);
        else JP(A, Q);
        break;
      case 2:
        if (B === XA.DL || B === XA.UL || B === XA.OL) $i(A, Q);
        else if (B === XA.LI) lX5(A, Q);
        else if (B === XA.DD || B === XA.DT) iX5(A, Q);
        else if (B === XA.H1 || B === XA.H2 || B === XA.H3 || B === XA.H4 || B === XA.H5 || B === XA.H6) nX5(A, Q);
        else if (B === XA.BR) aX5(A, Q);
        else if (B === XA.EM || B === XA.TT) wi(A, Q);
        else JP(A, Q);
        break;
      case 3:
        if (B === XA.BIG) wi(A, Q);
        else if (B === XA.DIR || B === XA.DIV || B === XA.NAV || B === XA.PRE) $i(A, Q);
        else JP(A, Q);
        break;
      case 4:
        if (B === XA.BODY) mX5(A, Q);
        else if (B === XA.HTML) dX5(A, Q);
        else if (B === XA.FORM) cX5(A, Q);
        else if (B === XA.CODE || B === XA.FONT || B === XA.NOBR) wi(A, Q);
        else if (B === XA.MAIN || B === XA.MENU) $i(A, Q);
        else JP(A, Q);
        break;
      case 5:
        if (B === XA.ASIDE) $i(A, Q);
        else if (B === XA.SMALL) wi(A, Q);
        else JP(A, Q);
        break;
      case 6:
        if (B === XA.CENTER || B === XA.FIGURE || B === XA.FOOTER || B === XA.HEADER || B === XA.HGROUP || B === XA.DIALOG) $i(A, Q);
        else if (B === XA.APPLET || B === XA.OBJECT) WG2(A, Q);
        else if (B === XA.STRIKE || B === XA.STRONG) wi(A, Q);
        else JP(A, Q);
        break;
      case 7:
        if (B === XA.ADDRESS || B === XA.ARTICLE || B === XA.DETAILS || B === XA.SECTION || B === XA.SUMMARY || B === XA.LISTING) $i(A, Q);
        else if (B === XA.MARQUEE) WG2(A, Q);
        else JP(A, Q);
        break;
      case 8:
        if (B === XA.FIELDSET) $i(A, Q);
        else if (B === XA.TEMPLATE) N1A(A, Q);
        else JP(A, Q);
        break;
      case 10:
        if (B === XA.BLOCKQUOTE || B === XA.FIGCAPTION) $i(A, Q);
        else JP(A, Q);
        break;
      default:
        JP(A, Q)
    }
  }

  function Uh(A, Q) {
    if (A.tmplInsertionModeStackTop > -1) DG2(A, Q);
    else A.stopped = !0
  }

  function sX5(A, Q) {
    if (Q.tagName === XA.SCRIPT) A.pendingScript = A.openElements.current;
    A.openElements.pop(), A.insertionMode = A.originalInsertionMode
  }

  function rX5(A, Q) {
    A._err(bD.eofInElementThatCanContainOnlyText), A.openElements.pop(), A.insertionMode = A.originalInsertionMode, A._processToken(Q)
  }

  function $h(A, Q) {
    let B = A.openElements.currentTagName;
    if (B === XA.TABLE || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD || B === XA.TR) A.pendingCharacterTokens = [], A.hasNonWhitespacePendingCharacterToken = !1, A.originalInsertionMode = A.insertionMode, A.insertionMode = "IN_TABLE_TEXT_MODE", A._processToken(Q);
    else QO(A, Q)
  }

  function oX5(A, Q) {
    A.openElements.clearBackToTableContext(), A.activeFormattingElements.insertMarker(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_CAPTION_MODE"
  }

  function tX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_COLUMN_GROUP_MODE"
  }

  function eX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertFakeElement(XA.COLGROUP), A.insertionMode = "IN_COLUMN_GROUP_MODE", A._processToken(Q)
  }

  function AV5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_TABLE_BODY_MODE"
  }

  function QV5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertFakeElement(XA.TBODY), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
  }

  function BV5(A, Q) {
    if (A.openElements.hasInTableScope(XA.TABLE)) A.openElements.popUntilTagNamePopped(XA.TABLE), A._resetInsertionMode(), A._processToken(Q)
  }

  function GV5(A, Q) {
    let B = P1.getTokenAttr(Q, XG2.TYPE);
    if (B && B.toLowerCase() === "hidden") A._appendElement(Q, w2.HTML);
    else QO(A, Q);
    Q.ackSelfClosing = !0
  }

  function ZV5(A, Q) {
    if (!A.formElement && A.openElements.tmplCount === 0) A._insertElement(Q, w2.HTML), A.formElement = A.openElements.current, A.openElements.pop()
  }

  function J00(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 2:
        if (B === XA.TD || B === XA.TH || B === XA.TR) QV5(A, Q);
        else QO(A, Q);
        break;
      case 3:
        if (B === XA.COL) eX5(A, Q);
        else QO(A, Q);
        break;
      case 4:
        if (B === XA.FORM) ZV5(A, Q);
        else QO(A, Q);
        break;
      case 5:
        if (B === XA.TABLE) BV5(A, Q);
        else if (B === XA.STYLE) AK(A, Q);
        else if (B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD) AV5(A, Q);
        else if (B === XA.INPUT) GV5(A, Q);
        else QO(A, Q);
        break;
      case 6:
        if (B === XA.SCRIPT) AK(A, Q);
        else QO(A, Q);
        break;
      case 7:
        if (B === XA.CAPTION) oX5(A, Q);
        else QO(A, Q);
        break;
      case 8:
        if (B === XA.COLGROUP) tX5(A, Q);
        else if (B === XA.TEMPLATE) AK(A, Q);
        else QO(A, Q);
        break;
      default:
        QO(A, Q)
    }
  }

  function W00(A, Q) {
    let B = Q.tagName;
    if (B === XA.TABLE) {
      if (A.openElements.hasInTableScope(XA.TABLE)) A.openElements.popUntilTagNamePopped(XA.TABLE), A._resetInsertionMode()
    } else if (B === XA.TEMPLATE) N1A(A, Q);
    else if (B !== XA.BODY && B !== XA.CAPTION && B !== XA.COL && B !== XA.COLGROUP && B !== XA.HTML && B !== XA.TBODY && B !== XA.TD && B !== XA.TFOOT && B !== XA.TH && B !== XA.THEAD && B !== XA.TR) QO(A, Q)
  }

  function QO(A, Q) {
    let B = A.fosterParentingEnabled;
    A.fosterParentingEnabled = !0, A._processTokenInBodyMode(Q), A.fosterParentingEnabled = B
  }

  function IV5(A, Q) {
    A.pendingCharacterTokens.push(Q)
  }

  function YV5(A, Q) {
    A.pendingCharacterTokens.push(Q), A.hasNonWhitespacePendingCharacterToken = !0
  }

  function zMA(A, Q) {
    let B = 0;
    if (A.hasNonWhitespacePendingCharacterToken)
      for (; B < A.pendingCharacterTokens.length; B++) QO(A, A.pendingCharacterTokens[B]);
    else
      for (; B < A.pendingCharacterTokens.length; B++) A._insertCharacters(A.pendingCharacterTokens[B]);
    A.insertionMode = A.originalInsertionMode, A._processToken(Q)
  }

  function JV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.CAPTION || B === XA.COL || B === XA.COLGROUP || B === XA.TBODY || B === XA.TD || B === XA.TFOOT || B === XA.TH || B === XA.THEAD || B === XA.TR) {
      if (A.openElements.hasInTableScope(XA.CAPTION)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(XA.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else aU(A, Q)
  }

  function WV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.CAPTION || B === XA.TABLE) {
      if (A.openElements.hasInTableScope(XA.CAPTION)) {
        if (A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(XA.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", B === XA.TABLE) A._processToken(Q)
      }
    } else if (B !== XA.BODY && B !== XA.COL && B !== XA.COLGROUP && B !== XA.HTML && B !== XA.TBODY && B !== XA.TD && B !== XA.TFOOT && B !== XA.TH && B !== XA.THEAD && B !== XA.TR) Y00(A, Q)
  }

  function XV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.COL) A._appendElement(Q, w2.HTML), Q.ackSelfClosing = !0;
    else if (B === XA.TEMPLATE) AK(A, Q);
    else x21(A, Q)
  }

  function VV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.COLGROUP) {
      if (A.openElements.currentTagName === XA.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
    } else if (B === XA.TEMPLATE) N1A(A, Q);
    else if (B !== XA.COL) x21(A, Q)
  }

  function x21(A, Q) {
    if (A.openElements.currentTagName === XA.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
  }

  function FV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.TR) A.openElements.clearBackToTableBodyContext(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_ROW_MODE";
    else if (B === XA.TH || B === XA.TD) A.openElements.clearBackToTableBodyContext(), A._insertFakeElement(XA.TR), A.insertionMode = "IN_ROW_MODE", A._processToken(Q);
    else if (B === XA.CAPTION || B === XA.COL || B === XA.COLGROUP || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD) {
      if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else J00(A, Q)
  }

  function KV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD) {
      if (A.openElements.hasInTableScope(B)) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
    } else if (B === XA.TABLE) {
      if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else if (B !== XA.BODY && B !== XA.CAPTION && B !== XA.COL && B !== XA.COLGROUP || B !== XA.HTML && B !== XA.TD && B !== XA.TH && B !== XA.TR) W00(A, Q)
  }

  function DV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.TH || B === XA.TD) A.openElements.clearBackToTableRowContext(), A._insertElement(Q, w2.HTML), A.insertionMode = "IN_CELL_MODE", A.activeFormattingElements.insertMarker();
    else if (B === XA.CAPTION || B === XA.COL || B === XA.COLGROUP || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD || B === XA.TR) {
      if (A.openElements.hasInTableScope(XA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else J00(A, Q)
  }

  function HV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.TR) {
      if (A.openElements.hasInTableScope(XA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE"
    } else if (B === XA.TABLE) {
      if (A.openElements.hasInTableScope(XA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else if (B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD) {
      if (A.openElements.hasInTableScope(B) || A.openElements.hasInTableScope(XA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else if (B !== XA.BODY && B !== XA.CAPTION && B !== XA.COL && B !== XA.COLGROUP || B !== XA.HTML && B !== XA.TD && B !== XA.TH) W00(A, Q)
  }

  function CV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.CAPTION || B === XA.COL || B === XA.COLGROUP || B === XA.TBODY || B === XA.TD || B === XA.TFOOT || B === XA.TH || B === XA.THEAD || B === XA.TR) {
      if (A.openElements.hasInTableScope(XA.TD) || A.openElements.hasInTableScope(XA.TH)) A._closeTableCell(), A._processToken(Q)
    } else aU(A, Q)
  }

  function EV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.TD || B === XA.TH) {
      if (A.openElements.hasInTableScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_ROW_MODE"
    } else if (B === XA.TABLE || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD || B === XA.TR) {
      if (A.openElements.hasInTableScope(B)) A._closeTableCell(), A._processToken(Q)
    } else if (B !== XA.BODY && B !== XA.CAPTION && B !== XA.COL && B !== XA.COLGROUP && B !== XA.HTML) Y00(A, Q)
  }

  function FG2(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.OPTION) {
      if (A.openElements.currentTagName === XA.OPTION) A.openElements.pop();
      A._insertElement(Q, w2.HTML)
    } else if (B === XA.OPTGROUP) {
      if (A.openElements.currentTagName === XA.OPTION) A.openElements.pop();
      if (A.openElements.currentTagName === XA.OPTGROUP) A.openElements.pop();
      A._insertElement(Q, w2.HTML)
    } else if (B === XA.INPUT || B === XA.KEYGEN || B === XA.TEXTAREA || B === XA.SELECT) {
      if (A.openElements.hasInSelectScope(XA.SELECT)) {
        if (A.openElements.popUntilTagNamePopped(XA.SELECT), A._resetInsertionMode(), B !== XA.SELECT) A._processToken(Q)
      }
    } else if (B === XA.SCRIPT || B === XA.TEMPLATE) AK(A, Q)
  }

  function KG2(A, Q) {
    let B = Q.tagName;
    if (B === XA.OPTGROUP) {
      let G = A.openElements.items[A.openElements.stackTop - 1],
        Z = G && A.treeAdapter.getTagName(G);
      if (A.openElements.currentTagName === XA.OPTION && Z === XA.OPTGROUP) A.openElements.pop();
      if (A.openElements.currentTagName === XA.OPTGROUP) A.openElements.pop()
    } else if (B === XA.OPTION) {
      if (A.openElements.currentTagName === XA.OPTION) A.openElements.pop()
    } else if (B === XA.SELECT && A.openElements.hasInSelectScope(XA.SELECT)) A.openElements.popUntilTagNamePopped(XA.SELECT), A._resetInsertionMode();
    else if (B === XA.TEMPLATE) N1A(A, Q)
  }

  function zV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.CAPTION || B === XA.TABLE || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD || B === XA.TR || B === XA.TD || B === XA.TH) A.openElements.popUntilTagNamePopped(XA.SELECT), A._resetInsertionMode(), A._processToken(Q);
    else FG2(A, Q)
  }

  function UV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.CAPTION || B === XA.TABLE || B === XA.TBODY || B === XA.TFOOT || B === XA.THEAD || B === XA.TR || B === XA.TD || B === XA.TH) {
      if (A.openElements.hasInTableScope(B)) A.openElements.popUntilTagNamePopped(XA.SELECT), A._resetInsertionMode(), A._processToken(Q)
    } else KG2(A, Q)
  }

  function $V5(A, Q) {
    let B = Q.tagName;
    if (B === XA.BASE || B === XA.BASEFONT || B === XA.BGSOUND || B === XA.LINK || B === XA.META || B === XA.NOFRAMES || B === XA.SCRIPT || B === XA.STYLE || B === XA.TEMPLATE || B === XA.TITLE) AK(A, Q);
    else {
      let G = BX5[B] || "IN_BODY_MODE";
      A._popTmplInsertionMode(), A._pushTmplInsertionMode(G), A.insertionMode = G, A._processToken(Q)
    }
  }

  function wV5(A, Q) {
    if (Q.tagName === XA.TEMPLATE) N1A(A, Q)
  }

  function DG2(A, Q) {
    if (A.openElements.tmplCount > 0) A.openElements.popUntilTagNamePopped(XA.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode(), A._processToken(Q);
    else A.stopped = !0
  }

  function qV5(A, Q) {
    if (Q.tagName === XA.HTML) aU(A, Q);
    else v21(A, Q)
  }

  function NV5(A, Q) {
    if (Q.tagName === XA.HTML) {
      if (!A.fragmentContext) A.insertionMode = "AFTER_AFTER_BODY_MODE"
    } else v21(A, Q)
  }

  function v21(A, Q) {
    A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function LV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.FRAMESET) A._insertElement(Q, w2.HTML);
    else if (B === XA.FRAME) A._appendElement(Q, w2.HTML), Q.ackSelfClosing = !0;
    else if (B === XA.NOFRAMES) AK(A, Q)
  }

  function MV5(A, Q) {
    if (Q.tagName === XA.FRAMESET && !A.openElements.isRootHtmlElementCurrent()) {
      if (A.openElements.pop(), !A.fragmentContext && A.openElements.currentTagName !== XA.FRAMESET) A.insertionMode = "AFTER_FRAMESET_MODE"
    }
  }

  function OV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.NOFRAMES) AK(A, Q)
  }

  function RV5(A, Q) {
    if (Q.tagName === XA.HTML) A.insertionMode = "AFTER_AFTER_FRAMESET_MODE"
  }

  function TV5(A, Q) {
    if (Q.tagName === XA.HTML) aU(A, Q);
    else y21(A, Q)
  }

  function y21(A, Q) {
    A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function PV5(A, Q) {
    let B = Q.tagName;
    if (B === XA.HTML) aU(A, Q);
    else if (B === XA.NOFRAMES) AK(A, Q)
  }

  function jV5(A, Q) {
    Q.chars = eW5.REPLACEMENT_CHARACTER, A._insertCharacters(Q)
  }

  function SV5(A, Q) {
    A._insertCharacters(Q), A.framesetOk = !1
  }

  function _V5(A, Q) {
    if (uk.causesExit(Q) && !A.fragmentContext) {
      while (A.treeAdapter.getNamespaceURI(A.openElements.current) !== w2.HTML && !A._isIntegrationPoint(A.openElements.current)) A.openElements.pop();
      A._processToken(Q)
    } else {
      let B = A._getAdjustedCurrentElement(),
        G = A.treeAdapter.getNamespaceURI(B);
      if (G === w2.MATHML) uk.adjustTokenMathMLAttrs(Q);
      else if (G === w2.SVG) uk.adjustTokenSVGTagName(Q), uk.adjustTokenSVGAttrs(Q);
      if (uk.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, G);
      else A._insertElement(Q, G);
      Q.ackSelfClosing = !0
    }
  }

  function kV5(A, Q) {
    for (let B = A.openElements.stackTop; B > 0; B--) {
      let G = A.openElements.items[B];
      if (A.treeAdapter.getNamespaceURI(G) === w2.HTML) {
        A._processToken(Q);
        break
      }
      if (A.treeAdapter.getTagName(G).toLowerCase() === Q.tagName) {
        A.openElements.popUntilElementPopped(G);
        break
      }
    }
  }
})
// @from(Start 9852034, End 9855393)
UG2 = z((ykG, zG2) => {
  var yV5 = Q00(),
    xV5 = B00(),
    vV5 = G00(),
    EG2 = Ui(),
    EZ = EG2.TAG_NAMES,
    b21 = EG2.NAMESPACES,
    bV5 = {
      treeAdapter: yV5
    },
    fV5 = /&/g,
    hV5 = /\u00a0/g,
    gV5 = /"/g,
    uV5 = /</g,
    mV5 = />/g;
  class LMA {
    constructor(A, Q) {
      this.options = xV5(bV5, Q), this.treeAdapter = this.options.treeAdapter, this.html = "", this.startNode = A
    }
    serialize() {
      return this._serializeChildNodes(this.startNode), this.html
    }
    _serializeChildNodes(A) {
      let Q = this.treeAdapter.getChildNodes(A);
      if (Q)
        for (let B = 0, G = Q.length; B < G; B++) {
          let Z = Q[B];
          if (this.treeAdapter.isElementNode(Z)) this._serializeElement(Z);
          else if (this.treeAdapter.isTextNode(Z)) this._serializeTextNode(Z);
          else if (this.treeAdapter.isCommentNode(Z)) this._serializeCommentNode(Z);
          else if (this.treeAdapter.isDocumentTypeNode(Z)) this._serializeDocumentTypeNode(Z)
        }
    }
    _serializeElement(A) {
      let Q = this.treeAdapter.getTagName(A),
        B = this.treeAdapter.getNamespaceURI(A);
      if (this.html += "<" + Q, this._serializeAttributes(A), this.html += ">", Q !== EZ.AREA && Q !== EZ.BASE && Q !== EZ.BASEFONT && Q !== EZ.BGSOUND && Q !== EZ.BR && Q !== EZ.COL && Q !== EZ.EMBED && Q !== EZ.FRAME && Q !== EZ.HR && Q !== EZ.IMG && Q !== EZ.INPUT && Q !== EZ.KEYGEN && Q !== EZ.LINK && Q !== EZ.META && Q !== EZ.PARAM && Q !== EZ.SOURCE && Q !== EZ.TRACK && Q !== EZ.WBR) {
        let G = Q === EZ.TEMPLATE && B === b21.HTML ? this.treeAdapter.getTemplateContent(A) : A;
        this._serializeChildNodes(G), this.html += "</" + Q + ">"
      }
    }
    _serializeAttributes(A) {
      let Q = this.treeAdapter.getAttrList(A);
      for (let B = 0, G = Q.length; B < G; B++) {
        let Z = Q[B],
          I = LMA.escapeString(Z.value, !0);
        if (this.html += " ", !Z.namespace) this.html += Z.name;
        else if (Z.namespace === b21.XML) this.html += "xml:" + Z.name;
        else if (Z.namespace === b21.XMLNS) {
          if (Z.name !== "xmlns") this.html += "xmlns:";
          this.html += Z.name
        } else if (Z.namespace === b21.XLINK) this.html += "xlink:" + Z.name;
        else this.html += Z.prefix + ":" + Z.name;
        this.html += '="' + I + '"'
      }
    }
    _serializeTextNode(A) {
      let Q = this.treeAdapter.getTextNodeContent(A),
        B = this.treeAdapter.getParentNode(A),
        G = void 0;
      if (B && this.treeAdapter.isElementNode(B)) G = this.treeAdapter.getTagName(B);
      if (G === EZ.STYLE || G === EZ.SCRIPT || G === EZ.XMP || G === EZ.IFRAME || G === EZ.NOEMBED || G === EZ.NOFRAMES || G === EZ.PLAINTEXT || G === EZ.NOSCRIPT) this.html += Q;
      else this.html += LMA.escapeString(Q, !1)
    }
    _serializeCommentNode(A) {
      this.html += "<!--" + this.treeAdapter.getCommentNodeContent(A) + "-->"
    }
    _serializeDocumentTypeNode(A) {
      let Q = this.treeAdapter.getDocumentTypeNodeName(A);
      this.html += "<" + vV5.serializeContent(Q, null, null) + ">"
    }
  }
  LMA.escapeString = function(A, Q) {
    if (A = A.replace(fV5, "&amp;").replace(hV5, "&nbsp;"), Q) A = A.replace(gV5, "&quot;");
    else A = A.replace(uV5, "&lt;").replace(mV5, "&gt;");
    return A
  };
  zG2.exports = LMA
})
// @from(Start 9855399, End 9855743)
wG2 = z((cV5) => {
  var $G2 = CG2(),
    dV5 = UG2();
  cV5.parse = function(Q, B) {
    return new $G2(B).parse(Q)
  };
  cV5.parseFragment = function(Q, B, G) {
    if (typeof Q === "string") G = B, B = Q, Q = null;
    return new $G2(G).parseFragment(B, Q)
  };
  cV5.serialize = function(A, Q) {
    return new dV5(A, Q).serialize()
  }
})
// @from(Start 9855749, End 9860829)
V00 = z((nV5) => {
  var X00 = nV5.NAMESPACES = {
    HTML: "http://www.w3.org/1999/xhtml",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/"
  };
  nV5.ATTRS = {
    TYPE: "type",
    ACTION: "action",
    ENCODING: "encoding",
    PROMPT: "prompt",
    NAME: "name",
    COLOR: "color",
    FACE: "face",
    SIZE: "size"
  };
  nV5.DOCUMENT_MODE = {
    NO_QUIRKS: "no-quirks",
    QUIRKS: "quirks",
    LIMITED_QUIRKS: "limited-quirks"
  };
  var fQ = nV5.TAG_NAMES = {
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
  nV5.SPECIAL_ELEMENTS = {
    [X00.HTML]: {
      [fQ.ADDRESS]: !0,
      [fQ.APPLET]: !0,
      [fQ.AREA]: !0,
      [fQ.ARTICLE]: !0,
      [fQ.ASIDE]: !0,
      [fQ.BASE]: !0,
      [fQ.BASEFONT]: !0,
      [fQ.BGSOUND]: !0,
      [fQ.BLOCKQUOTE]: !0,
      [fQ.BODY]: !0,
      [fQ.BR]: !0,
      [fQ.BUTTON]: !0,
      [fQ.CAPTION]: !0,
      [fQ.CENTER]: !0,
      [fQ.COL]: !0,
      [fQ.COLGROUP]: !0,
      [fQ.DD]: !0,
      [fQ.DETAILS]: !0,
      [fQ.DIR]: !0,
      [fQ.DIV]: !0,
      [fQ.DL]: !0,
      [fQ.DT]: !0,
      [fQ.EMBED]: !0,
      [fQ.FIELDSET]: !0,
      [fQ.FIGCAPTION]: !0,
      [fQ.FIGURE]: !0,
      [fQ.FOOTER]: !0,
      [fQ.FORM]: !0,
      [fQ.FRAME]: !0,
      [fQ.FRAMESET]: !0,
      [fQ.H1]: !0,
      [fQ.H2]: !0,
      [fQ.H3]: !0,
      [fQ.H4]: !0,
      [fQ.H5]: !0,
      [fQ.H6]: !0,
      [fQ.HEAD]: !0,
      [fQ.HEADER]: !0,
      [fQ.HGROUP]: !0,
      [fQ.HR]: !0,
      [fQ.HTML]: !0,
      [fQ.IFRAME]: !0,
      [fQ.IMG]: !0,
      [fQ.INPUT]: !0,
      [fQ.LI]: !0,
      [fQ.LINK]: !0,
      [fQ.LISTING]: !0,
      [fQ.MAIN]: !0,
      [fQ.MARQUEE]: !0,
      [fQ.MENU]: !0,
      [fQ.META]: !0,
      [fQ.NAV]: !0,
      [fQ.NOEMBED]: !0,
      [fQ.NOFRAMES]: !0,
      [fQ.NOSCRIPT]: !0,
      [fQ.OBJECT]: !0,
      [fQ.OL]: !0,
      [fQ.P]: !0,
      [fQ.PARAM]: !0,
      [fQ.PLAINTEXT]: !0,
      [fQ.PRE]: !0,
      [fQ.SCRIPT]: !0,
      [fQ.SECTION]: !0,
      [fQ.SELECT]: !0,
      [fQ.SOURCE]: !0,
      [fQ.STYLE]: !0,
      [fQ.SUMMARY]: !0,
      [fQ.TABLE]: !0,
      [fQ.TBODY]: !0,
      [fQ.TD]: !0,
      [fQ.TEMPLATE]: !0,
      [fQ.TEXTAREA]: !0,
      [fQ.TFOOT]: !0,
      [fQ.TH]: !0,
      [fQ.THEAD]: !0,
      [fQ.TITLE]: !0,
      [fQ.TR]: !0,
      [fQ.TRACK]: !0,
      [fQ.UL]: !0,
      [fQ.WBR]: !0,
      [fQ.XMP]: !0
    },
    [X00.MATHML]: {
      [fQ.MI]: !0,
      [fQ.MO]: !0,
      [fQ.MN]: !0,
      [fQ.MS]: !0,
      [fQ.MTEXT]: !0,
      [fQ.ANNOTATION_XML]: !0
    },
    [X00.SVG]: {
      [fQ.TITLE]: !0,
      [fQ.FOREIGN_OBJECT]: !0,
      [fQ.DESC]: !0
    }
  }
})
// @from(Start 9860835, End 9864631)
OG2 = z((AF5) => {
  var {
    DOCUMENT_MODE: VYA
  } = V00(), LG2 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], oV5 = LG2.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), tV5 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], MG2 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], eV5 = MG2.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

  function qG2(A) {
    let Q = A.indexOf('"') !== -1 ? "'" : '"';
    return Q + A + Q
  }

  function NG2(A, Q) {
    for (let B = 0; B < Q.length; B++)
      if (A.indexOf(Q[B]) === 0) return !0;
    return !1
  }
  AF5.isConforming = function(A) {
    return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
  };
  AF5.getDocumentMode = function(A) {
    if (A.name !== "html") return VYA.QUIRKS;
    let Q = A.systemId;
    if (Q && Q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return VYA.QUIRKS;
    let B = A.publicId;
    if (B !== null) {
      if (B = B.toLowerCase(), tV5.indexOf(B) > -1) return VYA.QUIRKS;
      let G = Q === null ? oV5 : LG2;
      if (NG2(B, G)) return VYA.QUIRKS;
      if (G = Q === null ? MG2 : eV5, NG2(B, G)) return VYA.LIMITED_QUIRKS
    }
    return VYA.NO_QUIRKS
  };
  AF5.serializeContent = function(A, Q, B) {
    let G = "!DOCTYPE ";
    if (A) G += A;
    if (Q) G += " PUBLIC " + qG2(Q);
    else if (B) G += " SYSTEM";
    if (B !== null) G += " " + qG2(B);
    return G
  }
})
// @from(Start 9864637, End 9870466)
jG2 = z((JF5) => {
  var ZF5 = OG2(),
    {
      DOCUMENT_MODE: IF5
    } = V00(),
    RG2 = {
      element: 1,
      text: 3,
      cdata: 4,
      comment: 8
    },
    TG2 = {
      tagName: "name",
      childNodes: "children",
      parentNode: "parent",
      previousSibling: "prev",
      nextSibling: "next",
      nodeValue: "data"
    };
  class qi {
    constructor(A) {
      for (let Q of Object.keys(A)) this[Q] = A[Q]
    }
    get firstChild() {
      let A = this.children;
      return A && A[0] || null
    }
    get lastChild() {
      let A = this.children;
      return A && A[A.length - 1] || null
    }
    get nodeType() {
      return RG2[this.type] || RG2.element
    }
  }
  Object.keys(TG2).forEach((A) => {
    let Q = TG2[A];
    Object.defineProperty(qi.prototype, A, {
      get: function() {
        return this[Q] || null
      },
      set: function(B) {
        return this[Q] = B, B
      }
    })
  });
  JF5.createDocument = function() {
    return new qi({
      type: "root",
      name: "root",
      parent: null,
      prev: null,
      next: null,
      children: [],
      "x-mode": IF5.NO_QUIRKS
    })
  };
  JF5.createDocumentFragment = function() {
    return new qi({
      type: "root",
      name: "root",
      parent: null,
      prev: null,
      next: null,
      children: []
    })
  };
  JF5.createElement = function(A, Q, B) {
    let G = Object.create(null),
      Z = Object.create(null),
      I = Object.create(null);
    for (let Y = 0; Y < B.length; Y++) {
      let J = B[Y].name;
      G[J] = B[Y].value, Z[J] = B[Y].namespace, I[J] = B[Y].prefix
    }
    return new qi({
      type: A === "script" || A === "style" ? A : "tag",
      name: A,
      namespace: Q,
      attribs: G,
      "x-attribsNamespace": Z,
      "x-attribsPrefix": I,
      children: [],
      parent: null,
      prev: null,
      next: null
    })
  };
  JF5.createCommentNode = function(A) {
    return new qi({
      type: "comment",
      data: A,
      parent: null,
      prev: null,
      next: null
    })
  };
  var PG2 = function(A) {
      return new qi({
        type: "text",
        data: A,
        parent: null,
        prev: null,
        next: null
      })
    },
    F00 = JF5.appendChild = function(A, Q) {
      let B = A.children[A.children.length - 1];
      if (B) B.next = Q, Q.prev = B;
      A.children.push(Q), Q.parent = A
    },
    YF5 = JF5.insertBefore = function(A, Q, B) {
      let G = A.children.indexOf(B),
        Z = B.prev;
      if (Z) Z.next = Q, Q.prev = Z;
      B.prev = Q, Q.next = B, A.children.splice(G, 0, Q), Q.parent = A
    };
  JF5.setTemplateContent = function(A, Q) {
    F00(A, Q)
  };
  JF5.getTemplateContent = function(A) {
    return A.children[0]
  };
  JF5.setDocumentType = function(A, Q, B, G) {
    let Z = ZF5.serializeContent(Q, B, G),
      I = null;
    for (let Y = 0; Y < A.children.length; Y++)
      if (A.children[Y].type === "directive" && A.children[Y].name === "!doctype") {
        I = A.children[Y];
        break
      } if (I) I.data = Z, I["x-name"] = Q, I["x-publicId"] = B, I["x-systemId"] = G;
    else F00(A, new qi({
      type: "directive",
      name: "!doctype",
      data: Z,
      "x-name": Q,
      "x-publicId": B,
      "x-systemId": G
    }))
  };
  JF5.setDocumentMode = function(A, Q) {
    A["x-mode"] = Q
  };
  JF5.getDocumentMode = function(A) {
    return A["x-mode"]
  };
  JF5.detachNode = function(A) {
    if (A.parent) {
      let Q = A.parent.children.indexOf(A),
        B = A.prev,
        G = A.next;
      if (A.prev = null, A.next = null, B) B.next = G;
      if (G) G.prev = B;
      A.parent.children.splice(Q, 1), A.parent = null
    }
  };
  JF5.insertText = function(A, Q) {
    let B = A.children[A.children.length - 1];
    if (B && B.type === "text") B.data += Q;
    else F00(A, PG2(Q))
  };
  JF5.insertTextBefore = function(A, Q, B) {
    let G = A.children[A.children.indexOf(B) - 1];
    if (G && G.type === "text") G.data += Q;
    else YF5(A, PG2(Q), B)
  };
  JF5.adoptAttributes = function(A, Q) {
    for (let B = 0; B < Q.length; B++) {
      let G = Q[B].name;
      if (typeof A.attribs[G] > "u") A.attribs[G] = Q[B].value, A["x-attribsNamespace"][G] = Q[B].namespace, A["x-attribsPrefix"][G] = Q[B].prefix
    }
  };
  JF5.getFirstChild = function(A) {
    return A.children[0]
  };
  JF5.getChildNodes = function(A) {
    return A.children
  };
  JF5.getParentNode = function(A) {
    return A.parent
  };
  JF5.getAttrList = function(A) {
    let Q = [];
    for (let B in A.attribs) Q.push({
      name: B,
      value: A.attribs[B],
      namespace: A["x-attribsNamespace"][B],
      prefix: A["x-attribsPrefix"][B]
    });
    return Q
  };
  JF5.getTagName = function(A) {
    return A.name
  };
  JF5.getNamespaceURI = function(A) {
    return A.namespace
  };
  JF5.getTextNodeContent = function(A) {
    return A.data
  };
  JF5.getCommentNodeContent = function(A) {
    return A.data
  };
  JF5.getDocumentTypeNodeName = function(A) {
    return A["x-name"]
  };
  JF5.getDocumentTypeNodePublicId = function(A) {
    return A["x-publicId"]
  };
  JF5.getDocumentTypeNodeSystemId = function(A) {
    return A["x-systemId"]
  };
  JF5.isTextNode = function(A) {
    return A.type === "text"
  };
  JF5.isCommentNode = function(A) {
    return A.type === "comment"
  };
  JF5.isDocumentTypeNode = function(A) {
    return A.type === "directive" && A.name === "!doctype"
  };
  JF5.isElementNode = function(A) {
    return !!A.attribs
  };
  JF5.setNodeSourceCodeLocation = function(A, Q) {
    A.sourceCodeLocation = Q
  };
  JF5.getNodeSourceCodeLocation = function(A) {
    return A.sourceCodeLocation
  };
  JF5.updateNodeSourceCodeLocation = function(A, Q) {
    A.sourceCodeLocation = Object.assign(A.sourceCodeLocation, Q)
  }
})
// @from(Start 9870472, End 9873908)
vG2 = z((dkG, xG2) => {
  var SG2 = (A, Q) => (...B) => {
      return `\x1B[${A(...B)+Q}m`
    },
    _G2 = (A, Q) => (...B) => {
      let G = A(...B);
      return `\x1B[${38+Q};5;${G}m`
    },
    kG2 = (A, Q) => (...B) => {
      let G = A(...B);
      return `\x1B[${38+Q};2;${G[0]};${G[1]};${G[2]}m`
    },
    f21 = (A) => A,
    yG2 = (A, Q, B) => [A, Q, B],
    FYA = (A, Q, B) => {
      Object.defineProperty(A, Q, {
        get: () => {
          let G = B();
          return Object.defineProperty(A, Q, {
            value: G,
            enumerable: !0,
            configurable: !0
          }), G
        },
        enumerable: !0,
        configurable: !0
      })
    },
    K00, KYA = (A, Q, B, G) => {
      if (K00 === void 0) K00 = tu1();
      let Z = G ? 10 : 0,
        I = {};
      for (let [Y, J] of Object.entries(K00)) {
        let W = Y === "ansi16" ? "ansi" : Y;
        if (Y === Q) I[W] = A(B, Z);
        else if (typeof J === "object") I[W] = A(J[Q], Z)
      }
      return I
    };

  function gF5() {
    let A = new Map,
      Q = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
    Q.color.gray = Q.color.blackBright, Q.bgColor.bgGray = Q.bgColor.bgBlackBright, Q.color.grey = Q.color.blackBright, Q.bgColor.bgGrey = Q.bgColor.bgBlackBright;
    for (let [B, G] of Object.entries(Q)) {
      for (let [Z, I] of Object.entries(G)) Q[Z] = {
        open: `\x1B[${I[0]}m`,
        close: `\x1B[${I[1]}m`
      }, G[Z] = Q[Z], A.set(I[0], I[1]);
      Object.defineProperty(Q, B, {
        value: G,
        enumerable: !1
      })
    }
    return Object.defineProperty(Q, "codes", {
      value: A,
      enumerable: !1
    }), Q.color.close = "\x1B[39m", Q.bgColor.close = "\x1B[49m", FYA(Q.color, "ansi", () => KYA(SG2, "ansi16", f21, !1)), FYA(Q.color, "ansi256", () => KYA(_G2, "ansi256", f21, !1)), FYA(Q.color, "ansi16m", () => KYA(kG2, "rgb", yG2, !1)), FYA(Q.bgColor, "ansi", () => KYA(SG2, "ansi16", f21, !0)), FYA(Q.bgColor, "ansi256", () => KYA(_G2, "ansi256", f21, !0)), FYA(Q.bgColor, "ansi16m", () => KYA(kG2, "rgb", yG2, !0)), Q
  }
  Object.defineProperty(xG2, "exports", {
    enumerable: !0,
    get: gF5
  })
})
// @from(Start 9873914, End 9876065)
hG2 = z((ckG, fG2) => {
  var uF5 = UA("os"),
    bG2 = UA("tty"),
    BO = uFA(),
    {
      env: QK
    } = process,
    Ni;
  if (BO("no-color") || BO("no-colors") || BO("color=false") || BO("color=never")) Ni = 0;
  else if (BO("color") || BO("colors") || BO("color=true") || BO("color=always")) Ni = 1;
  if ("FORCE_COLOR" in QK)
    if (QK.FORCE_COLOR === "true") Ni = 1;
    else if (QK.FORCE_COLOR === "false") Ni = 0;
  else Ni = QK.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(QK.FORCE_COLOR, 10), 3);

  function D00(A) {
    if (A === 0) return !1;
    return {
      level: A,
      hasBasic: !0,
      has256: A >= 2,
      has16m: A >= 3
    }
  }

  function H00(A, Q) {
    if (Ni === 0) return 0;
    if (BO("color=16m") || BO("color=full") || BO("color=truecolor")) return 3;
    if (BO("color=256")) return 2;
    if (A && !Q && Ni === void 0) return 0;
    let B = Ni || 0;
    if (QK.TERM === "dumb") return B;
    if (process.platform === "win32") {
      let G = uF5.release().split(".");
      if (Number(G[0]) >= 10 && Number(G[2]) >= 10586) return Number(G[2]) >= 14931 ? 3 : 2;
      return 1
    }
    if ("CI" in QK) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((G) => (G in QK)) || QK.CI_NAME === "codeship") return 1;
      return B
    }
    if ("TEAMCITY_VERSION" in QK) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(QK.TEAMCITY_VERSION) ? 1 : 0;
    if (QK.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in QK) {
      let G = parseInt((QK.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (QK.TERM_PROGRAM) {
        case "iTerm.app":
          return G >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2
      }
    }
    if (/-256(color)?$/i.test(QK.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(QK.TERM)) return 1;
    if ("COLORTERM" in QK) return 1;
    return B
  }

  function mF5(A) {
    let Q = H00(A, A && A.isTTY);
    return D00(Q)
  }
  fG2.exports = {
    supportsColor: mF5,
    stdout: D00(H00(!0, bG2.isatty(1))),
    stderr: D00(H00(!0, bG2.isatty(2)))
  }
})
// @from(Start 9876071, End 9876739)
uG2 = z((pkG, gG2) => {
  var dF5 = (A, Q, B) => {
      let G = A.indexOf(Q);
      if (G === -1) return A;
      let Z = Q.length,
        I = 0,
        Y = "";
      do Y += A.substr(I, G - I) + Q + B, I = G + Z, G = A.indexOf(Q, I); while (G !== -1);
      return Y += A.substr(I), Y
    },
    cF5 = (A, Q, B, G) => {
      let Z = 0,
        I = "";
      do {
        let Y = A[G - 1] === "\r";
        I += A.substr(Z, (Y ? G - 1 : G) - Z) + Q + (Y ? `\r
` : `
`) + B, Z = G + 1, G = A.indexOf(`
`, Z)
      } while (G !== -1);
      return I += A.substr(Z), I
    };
  gG2.exports = {
    stringReplaceAll: dF5,
    stringEncaseCRLFWithFirstIndex: cF5
  }
})
// @from(Start 9876745, End 9879355)
lG2 = z((lkG, pG2) => {
  var pF5 = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    mG2 = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    lF5 = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    iF5 = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
    nF5 = new Map([
      ["n", `
`],
      ["r", "\r"],
      ["t", "\t"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\x00"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);

  function cG2(A) {
    let Q = A[0] === "u",
      B = A[1] === "{";
    if (Q && !B && A.length === 5 || A[0] === "x" && A.length === 3) return String.fromCharCode(parseInt(A.slice(1), 16));
    if (Q && B) return String.fromCodePoint(parseInt(A.slice(2, -1), 16));
    return nF5.get(A) || A
  }

  function aF5(A, Q) {
    let B = [],
      G = Q.trim().split(/\s*,\s*/g),
      Z;
    for (let I of G) {
      let Y = Number(I);
      if (!Number.isNaN(Y)) B.push(Y);
      else if (Z = I.match(lF5)) B.push(Z[2].replace(iF5, (J, W, X) => W ? cG2(W) : X));
      else throw Error(`Invalid Chalk template style argument: ${I} (in style '${A}')`)
    }
    return B
  }

  function sF5(A) {
    mG2.lastIndex = 0;
    let Q = [],
      B;
    while ((B = mG2.exec(A)) !== null) {
      let G = B[1];
      if (B[2]) {
        let Z = aF5(G, B[2]);
        Q.push([G].concat(Z))
      } else Q.push([G])
    }
    return Q
  }

  function dG2(A, Q) {
    let B = {};
    for (let Z of Q)
      for (let I of Z.styles) B[I[0]] = Z.inverse ? null : I.slice(1);
    let G = A;
    for (let [Z, I] of Object.entries(B)) {
      if (!Array.isArray(I)) continue;
      if (!(Z in G)) throw Error(`Unknown Chalk style: ${Z}`);
      G = I.length > 0 ? G[Z](...I) : G[Z]
    }
    return G
  }
  pG2.exports = (A, Q) => {
    let B = [],
      G = [],
      Z = [];
    if (Q.replace(pF5, (I, Y, J, W, X, V) => {
        if (Y) Z.push(cG2(Y));
        else if (W) {
          let F = Z.join("");
          Z = [], G.push(B.length === 0 ? F : dG2(A, B)(F)), B.push({
            inverse: J,
            styles: sF5(W)
          })
        } else if (X) {
          if (B.length === 0) throw Error("Found extraneous } in Chalk template literal");
          G.push(dG2(A, B)(Z.join(""))), Z = [], B.pop()
        } else Z.push(V)
      }), G.push(Z.join("")), B.length > 0) {
      let I = `Chalk template literal is missing ${B.length} closing bracket${B.length===1?"":"s"} (\`}\`)`;
      throw Error(I)
    }
    return G.join("")
  }
})
// @from(Start 9879361, End 9883250)
eG2 = z((ikG, tG2) => {
  var MMA = vG2(),
    {
      stdout: E00,
      stderr: z00
    } = hG2(),
    {
      stringReplaceAll: rF5,
      stringEncaseCRLFWithFirstIndex: oF5
    } = uG2(),
    {
      isArray: h21
    } = Array,
    nG2 = ["ansi", "ansi", "ansi256", "ansi16m"],
    DYA = Object.create(null),
    tF5 = (A, Q = {}) => {
      if (Q.level && !(Number.isInteger(Q.level) && Q.level >= 0 && Q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
      let B = E00 ? E00.level : 0;
      A.level = Q.level === void 0 ? B : Q.level
    };
  class aG2 {
    constructor(A) {
      return sG2(A)
    }
  }
  var sG2 = (A) => {
    let Q = {};
    return tF5(Q, A), Q.template = (...B) => oG2(Q.template, ...B), Object.setPrototypeOf(Q, g21.prototype), Object.setPrototypeOf(Q.template, Q), Q.template.constructor = () => {
      throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.")
    }, Q.template.Instance = aG2, Q.template
  };

  function g21(A) {
    return sG2(A)
  }
  for (let [A, Q] of Object.entries(MMA)) DYA[A] = {
    get() {
      let B = u21(this, U00(Q.open, Q.close, this._styler), this._isEmpty);
      return Object.defineProperty(this, A, {
        value: B
      }), B
    }
  };
  DYA.visible = {
    get() {
      let A = u21(this, this._styler, !0);
      return Object.defineProperty(this, "visible", {
        value: A
      }), A
    }
  };
  var rG2 = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (let A of rG2) DYA[A] = {
    get() {
      let {
        level: Q
      } = this;
      return function(...B) {
        let G = U00(MMA.color[nG2[Q]][A](...B), MMA.color.close, this._styler);
        return u21(this, G, this._isEmpty)
      }
    }
  };
  for (let A of rG2) {
    let Q = "bg" + A[0].toUpperCase() + A.slice(1);
    DYA[Q] = {
      get() {
        let {
          level: B
        } = this;
        return function(...G) {
          let Z = U00(MMA.bgColor[nG2[B]][A](...G), MMA.bgColor.close, this._styler);
          return u21(this, Z, this._isEmpty)
        }
      }
    }
  }
  var eF5 = Object.defineProperties(() => {}, {
      ...DYA,
      level: {
        enumerable: !0,
        get() {
          return this._generator.level
        },
        set(A) {
          this._generator.level = A
        }
      }
    }),
    U00 = (A, Q, B) => {
      let G, Z;
      if (B === void 0) G = A, Z = Q;
      else G = B.openAll + A, Z = Q + B.closeAll;
      return {
        open: A,
        close: Q,
        openAll: G,
        closeAll: Z,
        parent: B
      }
    },
    u21 = (A, Q, B) => {
      let G = (...Z) => {
        if (h21(Z[0]) && h21(Z[0].raw)) return iG2(G, oG2(G, ...Z));
        return iG2(G, Z.length === 1 ? "" + Z[0] : Z.join(" "))
      };
      return Object.setPrototypeOf(G, eF5), G._generator = A, G._styler = Q, G._isEmpty = B, G
    },
    iG2 = (A, Q) => {
      if (A.level <= 0 || !Q) return A._isEmpty ? "" : Q;
      let B = A._styler;
      if (B === void 0) return Q;
      let {
        openAll: G,
        closeAll: Z
      } = B;
      if (Q.indexOf("\x1B") !== -1)
        while (B !== void 0) Q = rF5(Q, B.close, B.open), B = B.parent;
      let I = Q.indexOf(`
`);
      if (I !== -1) Q = oF5(Q, Z, G, I);
      return G + Q + Z
    },
    C00, oG2 = (A, ...Q) => {
      let [B] = Q;
      if (!h21(B) || !h21(B.raw)) return Q.join(" ");
      let G = Q.slice(1),
        Z = [B.raw[0]];
      for (let I = 1; I < B.length; I++) Z.push(String(G[I - 1]).replace(/[{}\\]/g, "\\$&"), String(B.raw[I]));
      if (C00 === void 0) C00 = lG2();
      return C00(A, Z.join(""))
    };
  Object.defineProperties(g21.prototype, DYA);
  var m21 = g21();
  m21.supportsColor = E00;
  m21.stderr = g21({
    level: z00 ? z00.level : 0
  });
  m21.stderr.supportsColor = z00;
  tG2.exports = m21
})
// @from(Start 9883256, End 9885530)
$00 = z((C6) => {
  var AK5 = C6 && C6.__importDefault || function(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  };
  Object.defineProperty(C6, "__esModule", {
    value: !0
  });
  C6.parse = C6.stringify = C6.toJson = C6.fromJson = C6.DEFAULT_THEME = C6.plain = void 0;
  var fJ = AK5(eG2()),
    QK5 = function(A) {
      return A
    };
  C6.plain = QK5;
  C6.DEFAULT_THEME = {
    keyword: fJ.default.blue,
    built_in: fJ.default.cyan,
    type: fJ.default.cyan.dim,
    literal: fJ.default.blue,
    number: fJ.default.green,
    regexp: fJ.default.red,
    string: fJ.default.red,
    subst: C6.plain,
    symbol: C6.plain,
    class: fJ.default.blue,
    function: fJ.default.yellow,
    title: C6.plain,
    params: C6.plain,
    comment: fJ.default.green,
    doctag: fJ.default.green,
    meta: fJ.default.grey,
    "meta-keyword": C6.plain,
    "meta-string": C6.plain,
    section: C6.plain,
    tag: fJ.default.grey,
    name: fJ.default.blue,
    "builtin-name": C6.plain,
    attr: fJ.default.cyan,
    attribute: C6.plain,
    variable: C6.plain,
    bullet: C6.plain,
    code: C6.plain,
    emphasis: fJ.default.italic,
    strong: fJ.default.bold,
    formula: C6.plain,
    link: fJ.default.underline,
    quote: C6.plain,
    "selector-tag": C6.plain,
    "selector-id": C6.plain,
    "selector-class": C6.plain,
    "selector-attr": C6.plain,
    "selector-pseudo": C6.plain,
    "template-tag": C6.plain,
    "template-variable": C6.plain,
    addition: fJ.default.green,
    deletion: fJ.default.red,
    default: C6.plain
  };

  function AZ2(A) {
    var Q = {};
    for (var B = 0, G = Object.keys(A); B < G.length; B++) {
      var Z = G[B],
        I = A[Z];
      if (Array.isArray(I)) Q[Z] = I.reduce(function(Y, J) {
        return J === "plain" ? C6.plain : Y[J]
      }, fJ.default);
      else Q[Z] = fJ.default[I]
    }
    return Q
  }
  C6.fromJson = AZ2;

  function QZ2(A) {
    var Q = {};
    for (var B = 0, G = Object.keys(Q); B < G.length; B++) {
      var Z = G[B],
        I = Q[Z];
      Q[Z] = I._styles
    }
    return Q
  }
  C6.toJson = QZ2;

  function BK5(A) {
    return JSON.stringify(QZ2(A))
  }
  C6.stringify = BK5;

  function GK5(A) {
    return AZ2(JSON.parse(A))
  }
  C6.parse = GK5
})
// @from(Start 9885536, End 9888309)
p21 = z((rX) => {
  var BZ2 = rX && rX.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      })
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    ZK5 = rX && rX.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    GZ2 = rX && rX.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) BZ2(Q, A, B)
      }
      return ZK5(Q, A), Q
    },
    IK5 = rX && rX.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) BZ2(Q, A, B)
    },
    YK5 = rX && rX.__importDefault || function(A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(rX, "__esModule", {
    value: !0
  });
  rX.supportsLanguage = rX.listLanguages = rX.highlight = void 0;
  var c21 = GZ2(rD1()),
    JK5 = GZ2(wG2()),
    WK5 = YK5(jG2()),
    d21 = $00();

  function w00(A, Q, B) {
    if (Q === void 0) Q = {};
    switch (A.type) {
      case "text": {
        var G = A.data;
        if (B === void 0) return (Q.default || d21.DEFAULT_THEME.default || d21.plain)(G);
        return G
      }
      case "tag": {
        var Z = /hljs-(\w+)/.exec(A.attribs.class);
        if (Z) {
          var I = Z[1],
            Y = A.childNodes.map(function(J) {
              return w00(J, Q, I)
            }).join("");
          return (Q[I] || d21.DEFAULT_THEME[I] || d21.plain)(Y)
        }
        return A.childNodes.map(function(J) {
          return w00(J, Q)
        }).join("")
      }
    }
    throw Error("Invalid node type " + A.type)
  }

  function XK5(A, Q) {
    if (Q === void 0) Q = {};
    var B = JK5.parseFragment(A, {
      treeAdapter: WK5.default
    });
    return B.childNodes.map(function(G) {
      return w00(G, Q)
    }).join("")
  }

  function ZZ2(A, Q) {
    if (Q === void 0) Q = {};
    var B;
    if (Q.language) B = c21.highlight(A, {
      language: Q.language,
      ignoreIllegals: Q.ignoreIllegals
    }).value;
    else B = c21.highlightAuto(A, Q.languageSubset).value;
    return XK5(B, Q.theme)
  }
  rX.highlight = ZZ2;

  function VK5() {
    return c21.listLanguages()
  }
  rX.listLanguages = VK5;

  function FK5(A) {
    return !!c21.getLanguage(A)
  }
  rX.supportsLanguage = FK5;
  rX.default = ZZ2;
  IK5($00(), rX)
})
// @from(Start 9888312, End 9888421)
function JZ2(A) {
  if (!EsA()) return A;
  let Q = tA.blue(A);
  return `${IZ2}${A}${YZ2}${Q}${IZ2}${YZ2}`
}
// @from(Start 9888426, End 9888442)
IZ2 = "\x1B]8;;"
// @from(Start 9888446, End 9888458)
YZ2 = "\x07"
// @from(Start 9888464, End 9888498)
WZ2 = L(() => {
  F9();
  Su1()
})
// @from(Start 9888535, End 9888619)
function fD(A, Q) {
  return a7.lexer(RMA(A)).map((B) => bE(B, Q)).join("").trim()
}