
// @from(Ln 274646, Col 4)
l72 = U((UMZ, p72) => {
  var x1 = RyA(),
    pJ5 = p52(),
    _72 = i52(),
    lJ5 = Y72(),
    iJ5 = $72(),
    j72 = db(),
    nJ5 = MD0(),
    aJ5 = RD0(),
    T72 = _D0(),
    cb = R72(),
    KE = LY1(),
    oJ5 = wY1(),
    S4A = cr(),
    qA = S4A.TAG_NAMES,
    r2 = S4A.NAMESPACES,
    g72 = S4A.ATTRS,
    rJ5 = {
      scriptingEnabled: !0,
      sourceCodeLocationInfo: !1,
      onParseError: null,
      treeAdapter: nJ5
    },
    sJ5 = {
      [qA.TR]: "IN_ROW_MODE",
      [qA.TBODY]: "IN_TABLE_BODY_MODE",
      [qA.THEAD]: "IN_TABLE_BODY_MODE",
      [qA.TFOOT]: "IN_TABLE_BODY_MODE",
      [qA.CAPTION]: "IN_CAPTION_MODE",
      [qA.COLGROUP]: "IN_COLUMN_GROUP_MODE",
      [qA.TABLE]: "IN_TABLE_MODE",
      [qA.BODY]: "IN_BODY_MODE",
      [qA.FRAMESET]: "IN_FRAMESET_MODE"
    },
    tJ5 = {
      [qA.CAPTION]: "IN_TABLE_MODE",
      [qA.COLGROUP]: "IN_TABLE_MODE",
      [qA.TBODY]: "IN_TABLE_MODE",
      [qA.TFOOT]: "IN_TABLE_MODE",
      [qA.THEAD]: "IN_TABLE_MODE",
      [qA.COL]: "IN_COLUMN_GROUP_MODE",
      [qA.TR]: "IN_TABLE_BODY_MODE",
      [qA.TD]: "IN_ROW_MODE",
      [qA.TH]: "IN_ROW_MODE"
    },
    P72 = {
      ["INITIAL_MODE"]: {
        [x1.CHARACTER_TOKEN]: jyA,
        [x1.NULL_CHARACTER_TOKEN]: jyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: k5,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: JX5,
        [x1.START_TAG_TOKEN]: jyA,
        [x1.END_TAG_TOKEN]: jyA,
        [x1.EOF_TOKEN]: jyA
      },
      ["BEFORE_HTML_MODE"]: {
        [x1.CHARACTER_TOKEN]: PyA,
        [x1.NULL_CHARACTER_TOKEN]: PyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: k5,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: XX5,
        [x1.END_TAG_TOKEN]: IX5,
        [x1.EOF_TOKEN]: PyA
      },
      ["BEFORE_HEAD_MODE"]: {
        [x1.CHARACTER_TOKEN]: SyA,
        [x1.NULL_CHARACTER_TOKEN]: SyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: k5,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: jY1,
        [x1.START_TAG_TOKEN]: DX5,
        [x1.END_TAG_TOKEN]: WX5,
        [x1.EOF_TOKEN]: SyA
      },
      ["IN_HEAD_MODE"]: {
        [x1.CHARACTER_TOKEN]: xyA,
        [x1.NULL_CHARACTER_TOKEN]: xyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: jY1,
        [x1.START_TAG_TOKEN]: MF,
        [x1.END_TAG_TOKEN]: x4A,
        [x1.EOF_TOKEN]: xyA
      },
      ["IN_HEAD_NO_SCRIPT_MODE"]: {
        [x1.CHARACTER_TOKEN]: yyA,
        [x1.NULL_CHARACTER_TOKEN]: yyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: jY1,
        [x1.START_TAG_TOKEN]: KX5,
        [x1.END_TAG_TOKEN]: VX5,
        [x1.EOF_TOKEN]: yyA
      },
      ["AFTER_HEAD_MODE"]: {
        [x1.CHARACTER_TOKEN]: vyA,
        [x1.NULL_CHARACTER_TOKEN]: vyA,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: jY1,
        [x1.START_TAG_TOKEN]: FX5,
        [x1.END_TAG_TOKEN]: HX5,
        [x1.EOF_TOKEN]: vyA
      },
      ["IN_BODY_MODE"]: {
        [x1.CHARACTER_TOKEN]: TY1,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: yN,
        [x1.END_TAG_TOKEN]: PD0,
        [x1.EOF_TOKEN]: hd
      },
      ["TEXT_MODE"]: {
        [x1.CHARACTER_TOKEN]: xN,
        [x1.NULL_CHARACTER_TOKEN]: xN,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: k5,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: k5,
        [x1.END_TAG_TOKEN]: lX5,
        [x1.EOF_TOKEN]: iX5
      },
      ["IN_TABLE_MODE"]: {
        [x1.CHARACTER_TOKEN]: gd,
        [x1.NULL_CHARACTER_TOKEN]: gd,
        [x1.WHITESPACE_CHARACTER_TOKEN]: gd,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: SD0,
        [x1.END_TAG_TOKEN]: xD0,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_TABLE_TEXT_MODE"]: {
        [x1.CHARACTER_TOKEN]: BI5,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: QI5,
        [x1.COMMENT_TOKEN]: TyA,
        [x1.DOCTYPE_TOKEN]: TyA,
        [x1.START_TAG_TOKEN]: TyA,
        [x1.END_TAG_TOKEN]: TyA,
        [x1.EOF_TOKEN]: TyA
      },
      ["IN_CAPTION_MODE"]: {
        [x1.CHARACTER_TOKEN]: TY1,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: GI5,
        [x1.END_TAG_TOKEN]: ZI5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_COLUMN_GROUP_MODE"]: {
        [x1.CHARACTER_TOKEN]: SY1,
        [x1.NULL_CHARACTER_TOKEN]: SY1,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: YI5,
        [x1.END_TAG_TOKEN]: JI5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_TABLE_BODY_MODE"]: {
        [x1.CHARACTER_TOKEN]: gd,
        [x1.NULL_CHARACTER_TOKEN]: gd,
        [x1.WHITESPACE_CHARACTER_TOKEN]: gd,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: XI5,
        [x1.END_TAG_TOKEN]: II5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_ROW_MODE"]: {
        [x1.CHARACTER_TOKEN]: gd,
        [x1.NULL_CHARACTER_TOKEN]: gd,
        [x1.WHITESPACE_CHARACTER_TOKEN]: gd,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: DI5,
        [x1.END_TAG_TOKEN]: WI5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_CELL_MODE"]: {
        [x1.CHARACTER_TOKEN]: TY1,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: KI5,
        [x1.END_TAG_TOKEN]: VI5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_SELECT_MODE"]: {
        [x1.CHARACTER_TOKEN]: xN,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: m72,
        [x1.END_TAG_TOKEN]: d72,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_SELECT_IN_TABLE_MODE"]: {
        [x1.CHARACTER_TOKEN]: xN,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: FI5,
        [x1.END_TAG_TOKEN]: HI5,
        [x1.EOF_TOKEN]: hd
      },
      ["IN_TEMPLATE_MODE"]: {
        [x1.CHARACTER_TOKEN]: TY1,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: EI5,
        [x1.END_TAG_TOKEN]: zI5,
        [x1.EOF_TOKEN]: c72
      },
      ["AFTER_BODY_MODE"]: {
        [x1.CHARACTER_TOKEN]: xY1,
        [x1.NULL_CHARACTER_TOKEN]: xY1,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: YX5,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: $I5,
        [x1.END_TAG_TOKEN]: CI5,
        [x1.EOF_TOKEN]: _yA
      },
      ["IN_FRAMESET_MODE"]: {
        [x1.CHARACTER_TOKEN]: k5,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: UI5,
        [x1.END_TAG_TOKEN]: qI5,
        [x1.EOF_TOKEN]: _yA
      },
      ["AFTER_FRAMESET_MODE"]: {
        [x1.CHARACTER_TOKEN]: k5,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: xN,
        [x1.COMMENT_TOKEN]: YV,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: NI5,
        [x1.END_TAG_TOKEN]: wI5,
        [x1.EOF_TOKEN]: _yA
      },
      ["AFTER_AFTER_BODY_MODE"]: {
        [x1.CHARACTER_TOKEN]: PY1,
        [x1.NULL_CHARACTER_TOKEN]: PY1,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: S72,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: LI5,
        [x1.END_TAG_TOKEN]: PY1,
        [x1.EOF_TOKEN]: _yA
      },
      ["AFTER_AFTER_FRAMESET_MODE"]: {
        [x1.CHARACTER_TOKEN]: k5,
        [x1.NULL_CHARACTER_TOKEN]: k5,
        [x1.WHITESPACE_CHARACTER_TOKEN]: P4A,
        [x1.COMMENT_TOKEN]: S72,
        [x1.DOCTYPE_TOKEN]: k5,
        [x1.START_TAG_TOKEN]: OI5,
        [x1.END_TAG_TOKEN]: k5,
        [x1.EOF_TOKEN]: _yA
      }
    };
  class u72 {
    constructor(A) {
      if (this.options = aJ5(rJ5, A), this.treeAdapter = this.options.treeAdapter, this.pendingScript = null, this.options.sourceCodeLocationInfo) j72.install(this, lJ5);
      if (this.options.onParseError) j72.install(this, iJ5, {
        onParseError: this.options.onParseError
      })
    }
    parse(A) {
      let Q = this.treeAdapter.createDocument();
      return this._bootstrap(Q, null), this.tokenizer.write(A, !0), this._runParsingLoop(null), Q
    }
    parseFragment(A, Q) {
      if (!Q) Q = this.treeAdapter.createElement(qA.TEMPLATE, r2.HTML, []);
      let B = this.treeAdapter.createElement("documentmock", r2.HTML, []);
      if (this._bootstrap(B, Q), this.treeAdapter.getTagName(Q) === qA.TEMPLATE) this._pushTmplInsertionMode("IN_TEMPLATE_MODE");
      this._initTokenizerForFragmentParsing(), this._insertFakeRootElement(), this._resetInsertionMode(), this._findFormInFragmentContext(), this.tokenizer.write(A, !0), this._runParsingLoop(null);
      let G = this.treeAdapter.getFirstChild(B),
        Z = this.treeAdapter.createDocumentFragment();
      return this._adoptNodes(G, Z), Z
    }
    _bootstrap(A, Q) {
      this.tokenizer = new x1(this.options), this.stopped = !1, this.insertionMode = "INITIAL_MODE", this.originalInsertionMode = "", this.document = A, this.fragmentContext = Q, this.headElement = null, this.formElement = null, this.openElements = new pJ5(this.document, this.treeAdapter), this.activeFormattingElements = new _72(this.treeAdapter), this.tmplInsertionModeStack = [], this.tmplInsertionModeStackTop = -1, this.currentTmplInsertionMode = null, this.pendingCharacterTokens = [], this.hasNonWhitespacePendingCharacterToken = !1, this.framesetOk = !0, this.skipNextNewLine = !1, this.fosterParentingEnabled = !1
    }
    _err() {}
    _runParsingLoop(A) {
      while (!this.stopped) {
        this._setupTokenizerCDATAMode();
        let Q = this.tokenizer.getNextToken();
        if (Q.type === x1.HIBERNATION_TOKEN) break;
        if (this.skipNextNewLine) {
          if (this.skipNextNewLine = !1, Q.type === x1.WHITESPACE_CHARACTER_TOKEN && Q.chars[0] === `
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
      this.tokenizer.allowCDATA = A && A !== this.document && this.treeAdapter.getNamespaceURI(A) !== r2.HTML && !this._isIntegrationPoint(A)
    }
    _switchToTextParsing(A, Q) {
      this._insertElement(A, r2.HTML), this.tokenizer.state = Q, this.originalInsertionMode = this.insertionMode, this.insertionMode = "TEXT_MODE"
    }
    switchToPlaintextParsing() {
      this.insertionMode = "TEXT_MODE", this.originalInsertionMode = "IN_BODY_MODE", this.tokenizer.state = x1.MODE.PLAINTEXT
    }
    _getAdjustedCurrentElement() {
      return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current
    }
    _findFormInFragmentContext() {
      let A = this.fragmentContext;
      do {
        if (this.treeAdapter.getTagName(A) === qA.FORM) {
          this.formElement = A;
          break
        }
        A = this.treeAdapter.getParentNode(A)
      } while (A)
    }
    _initTokenizerForFragmentParsing() {
      if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === r2.HTML) {
        let A = this.treeAdapter.getTagName(this.fragmentContext);
        if (A === qA.TITLE || A === qA.TEXTAREA) this.tokenizer.state = x1.MODE.RCDATA;
        else if (A === qA.STYLE || A === qA.XMP || A === qA.IFRAME || A === qA.NOEMBED || A === qA.NOFRAMES || A === qA.NOSCRIPT) this.tokenizer.state = x1.MODE.RAWTEXT;
        else if (A === qA.SCRIPT) this.tokenizer.state = x1.MODE.SCRIPT_DATA;
        else if (A === qA.PLAINTEXT) this.tokenizer.state = x1.MODE.PLAINTEXT
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
      let Q = this.treeAdapter.createElement(A, r2.HTML, []);
      this._attachElementToTree(Q), this.openElements.push(Q)
    }
    _insertTemplate(A) {
      let Q = this.treeAdapter.createElement(A.tagName, r2.HTML, A.attrs),
        B = this.treeAdapter.createDocumentFragment();
      this.treeAdapter.setTemplateContent(Q, B), this._attachElementToTree(Q), this.openElements.push(Q)
    }
    _insertFakeRootElement() {
      let A = this.treeAdapter.createElement(qA.HTML, r2.HTML, []);
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
      if (B === r2.HTML) return !1;
      if (this.treeAdapter.getTagName(Q) === qA.ANNOTATION_XML && B === r2.MATHML && A.type === x1.START_TAG_TOKEN && A.tagName === qA.SVG) return !1;
      let G = A.type === x1.CHARACTER_TOKEN || A.type === x1.NULL_CHARACTER_TOKEN || A.type === x1.WHITESPACE_CHARACTER_TOKEN;
      if ((A.type === x1.START_TAG_TOKEN && A.tagName !== qA.MGLYPH && A.tagName !== qA.MALIGNMARK || G) && this._isIntegrationPoint(Q, r2.MATHML)) return !1;
      if ((A.type === x1.START_TAG_TOKEN || G) && this._isIntegrationPoint(Q, r2.HTML)) return !1;
      return A.type !== x1.EOF_TOKEN
    }
    _processToken(A) {
      P72[this.insertionMode][A.type](this, A)
    }
    _processTokenInBodyMode(A) {
      P72.IN_BODY_MODE[A.type](this, A)
    }
    _processTokenInForeignContent(A) {
      if (A.type === x1.CHARACTER_TOKEN) RI5(this, A);
      else if (A.type === x1.NULL_CHARACTER_TOKEN) MI5(this, A);
      else if (A.type === x1.WHITESPACE_CHARACTER_TOKEN) xN(this, A);
      else if (A.type === x1.COMMENT_TOKEN) YV(this, A);
      else if (A.type === x1.START_TAG_TOKEN) _I5(this, A);
      else if (A.type === x1.END_TAG_TOKEN) jI5(this, A)
    }
    _processInputToken(A) {
      if (this._shouldProcessTokenInForeignContent(A)) this._processTokenInForeignContent(A);
      else this._processToken(A);
      if (A.type === x1.START_TAG_TOKEN && A.selfClosing && !A.ackSelfClosing) this._err(KE.nonVoidHtmlElementStartTagWithTrailingSolidus)
    }
    _isIntegrationPoint(A, Q) {
      let B = this.treeAdapter.getTagName(A),
        G = this.treeAdapter.getNamespaceURI(A),
        Z = this.treeAdapter.getAttrList(A);
      return cb.isIntegrationPoint(B, G, Z, Q)
    }
    _reconstructActiveFormattingElements() {
      let A = this.activeFormattingElements.length;
      if (A) {
        let Q = A,
          B = null;
        do
          if (Q--, B = this.activeFormattingElements.entries[Q], B.type === _72.MARKER_ENTRY || this.openElements.contains(B.element)) {
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
      this.openElements.generateImpliedEndTagsWithExclusion(qA.P), this.openElements.popUntilTagNamePopped(qA.P)
    }
    _resetInsertionMode() {
      for (let A = this.openElements.stackTop, Q = !1; A >= 0; A--) {
        let B = this.openElements.items[A];
        if (A === 0) {
          if (Q = !0, this.fragmentContext) B = this.fragmentContext
        }
        let G = this.treeAdapter.getTagName(B),
          Z = sJ5[G];
        if (Z) {
          this.insertionMode = Z;
          break
        } else if (!Q && (G === qA.TD || G === qA.TH)) {
          this.insertionMode = "IN_CELL_MODE";
          break
        } else if (!Q && G === qA.HEAD) {
          this.insertionMode = "IN_HEAD_MODE";
          break
        } else if (G === qA.SELECT) {
          this._resetInsertionModeForSelect(A);
          break
        } else if (G === qA.TEMPLATE) {
          this.insertionMode = this.currentTmplInsertionMode;
          break
        } else if (G === qA.HTML) {
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
          if (G === qA.TEMPLATE) break;
          else if (G === qA.TABLE) {
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
      return Q === qA.TABLE || Q === qA.TBODY || Q === qA.TFOOT || Q === qA.THEAD || Q === qA.TR
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
        if (G === qA.TEMPLATE && Z === r2.HTML) {
          A.parent = this.treeAdapter.getTemplateContent(B);
          break
        } else if (G === qA.TABLE) {
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
      return S4A.SPECIAL_ELEMENTS[B][Q]
    }
  }
  p72.exports = u72;

  function eJ5(A, Q) {
    let B = A.activeFormattingElements.getElementEntryInScopeWithTagName(Q.tagName);
    if (B) {
      if (!A.openElements.contains(B.element)) A.activeFormattingElements.removeEntry(B), B = null;
      else if (!A.openElements.hasInScope(Q.tagName)) B = null
    } else PS(A, Q);
    return B
  }

  function AX5(A, Q) {
    let B = null;
    for (let G = A.openElements.stackTop; G >= 0; G--) {
      let Z = A.openElements.items[G];
      if (Z === Q.element) break;
      if (A._isSpecialElement(Z)) B = Z
    }
    if (!B) A.openElements.popUntilElementPopped(Q.element), A.activeFormattingElements.removeEntry(Q);
    return B
  }

  function QX5(A, Q, B) {
    let G = Q,
      Z = A.openElements.getCommonAncestor(Q);
    for (let Y = 0, J = Z; J !== B; Y++, J = Z) {
      Z = A.openElements.getCommonAncestor(J);
      let X = A.activeFormattingElements.getElementEntry(J),
        I = X && Y >= 3;
      if (!X || I) {
        if (I) A.activeFormattingElements.removeEntry(X);
        A.openElements.remove(J)
      } else {
        if (J = BX5(A, X), G === Q) A.activeFormattingElements.bookmark = X;
        A.treeAdapter.detachNode(G), A.treeAdapter.appendChild(J, G), G = J
      }
    }
    return G
  }

  function BX5(A, Q) {
    let B = A.treeAdapter.getNamespaceURI(Q.element),
      G = A.treeAdapter.createElement(Q.token.tagName, B, Q.token.attrs);
    return A.openElements.replace(Q.element, G), Q.element = G, G
  }

  function GX5(A, Q, B) {
    if (A._isElementCausesFosterParenting(Q)) A._fosterParentElement(B);
    else {
      let G = A.treeAdapter.getTagName(Q),
        Z = A.treeAdapter.getNamespaceURI(Q);
      if (G === qA.TEMPLATE && Z === r2.HTML) Q = A.treeAdapter.getTemplateContent(Q);
      A.treeAdapter.appendChild(Q, B)
    }
  }

  function ZX5(A, Q, B) {
    let G = A.treeAdapter.getNamespaceURI(B.element),
      Z = B.token,
      Y = A.treeAdapter.createElement(Z.tagName, G, Z.attrs);
    A._adoptNodes(Q, Y), A.treeAdapter.appendChild(Q, Y), A.activeFormattingElements.insertElementAfterBookmark(Y, B.token), A.activeFormattingElements.removeEntry(B), A.openElements.remove(B.element), A.openElements.insertAfter(Q, Y)
  }

  function lr(A, Q) {
    let B;
    for (let G = 0; G < 8; G++) {
      if (B = eJ5(A, Q, B), !B) break;
      let Z = AX5(A, B);
      if (!Z) break;
      A.activeFormattingElements.bookmark = B;
      let Y = QX5(A, Z, B.element),
        J = A.openElements.getCommonAncestor(B.element);
      A.treeAdapter.detachNode(Y), GX5(A, J, Y), ZX5(A, Z, B)
    }
  }

  function k5() {}

  function jY1(A) {
    A._err(KE.misplacedDoctype)
  }

  function YV(A, Q) {
    A._appendCommentNode(Q, A.openElements.currentTmplContent || A.openElements.current)
  }

  function YX5(A, Q) {
    A._appendCommentNode(Q, A.openElements.items[0])
  }

  function S72(A, Q) {
    A._appendCommentNode(Q, A.document)
  }

  function xN(A, Q) {
    A._insertCharacters(Q)
  }

  function _yA(A) {
    A.stopped = !0
  }

  function JX5(A, Q) {
    A._setDocumentType(Q);
    let B = Q.forceQuirks ? S4A.DOCUMENT_MODE.QUIRKS : T72.getDocumentMode(Q);
    if (!T72.isConforming(Q)) A._err(KE.nonConformingDoctype);
    A.treeAdapter.setDocumentMode(A.document, B), A.insertionMode = "BEFORE_HTML_MODE"
  }

  function jyA(A, Q) {
    A._err(KE.missingDoctype, {
      beforeToken: !0
    }), A.treeAdapter.setDocumentMode(A.document, S4A.DOCUMENT_MODE.QUIRKS), A.insertionMode = "BEFORE_HTML_MODE", A._processToken(Q)
  }

  function XX5(A, Q) {
    if (Q.tagName === qA.HTML) A._insertElement(Q, r2.HTML), A.insertionMode = "BEFORE_HEAD_MODE";
    else PyA(A, Q)
  }

  function IX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML || B === qA.HEAD || B === qA.BODY || B === qA.BR) PyA(A, Q)
  }

  function PyA(A, Q) {
    A._insertFakeRootElement(), A.insertionMode = "BEFORE_HEAD_MODE", A._processToken(Q)
  }

  function DX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.HEAD) A._insertElement(Q, r2.HTML), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE";
    else SyA(A, Q)
  }

  function WX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HEAD || B === qA.BODY || B === qA.HTML || B === qA.BR) SyA(A, Q);
    else A._err(KE.endTagWithoutMatchingOpenElement)
  }

  function SyA(A, Q) {
    A._insertFakeElement(qA.HEAD), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE", A._processToken(Q)
  }

  function MF(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.BASE || B === qA.BASEFONT || B === qA.BGSOUND || B === qA.LINK || B === qA.META) A._appendElement(Q, r2.HTML), Q.ackSelfClosing = !0;
    else if (B === qA.TITLE) A._switchToTextParsing(Q, x1.MODE.RCDATA);
    else if (B === qA.NOSCRIPT)
      if (A.options.scriptingEnabled) A._switchToTextParsing(Q, x1.MODE.RAWTEXT);
      else A._insertElement(Q, r2.HTML), A.insertionMode = "IN_HEAD_NO_SCRIPT_MODE";
    else if (B === qA.NOFRAMES || B === qA.STYLE) A._switchToTextParsing(Q, x1.MODE.RAWTEXT);
    else if (B === qA.SCRIPT) A._switchToTextParsing(Q, x1.MODE.SCRIPT_DATA);
    else if (B === qA.TEMPLATE) A._insertTemplate(Q, r2.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1, A.insertionMode = "IN_TEMPLATE_MODE", A._pushTmplInsertionMode("IN_TEMPLATE_MODE");
    else if (B === qA.HEAD) A._err(KE.misplacedStartTagForHeadElement);
    else xyA(A, Q)
  }

  function x4A(A, Q) {
    let B = Q.tagName;
    if (B === qA.HEAD) A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE";
    else if (B === qA.BODY || B === qA.BR || B === qA.HTML) xyA(A, Q);
    else if (B === qA.TEMPLATE)
      if (A.openElements.tmplCount > 0) {
        if (A.openElements.generateImpliedEndTagsThoroughly(), A.openElements.currentTagName !== qA.TEMPLATE) A._err(KE.closingOfElementWithOpenChildElements);
        A.openElements.popUntilTagNamePopped(qA.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode()
      } else A._err(KE.endTagWithoutMatchingOpenElement);
    else A._err(KE.endTagWithoutMatchingOpenElement)
  }

  function xyA(A, Q) {
    A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE", A._processToken(Q)
  }

  function KX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.BASEFONT || B === qA.BGSOUND || B === qA.HEAD || B === qA.LINK || B === qA.META || B === qA.NOFRAMES || B === qA.STYLE) MF(A, Q);
    else if (B === qA.NOSCRIPT) A._err(KE.nestedNoscriptInHead);
    else yyA(A, Q)
  }

  function VX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.NOSCRIPT) A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE";
    else if (B === qA.BR) yyA(A, Q);
    else A._err(KE.endTagWithoutMatchingOpenElement)
  }

  function yyA(A, Q) {
    let B = Q.type === x1.EOF_TOKEN ? KE.openElementsLeftAfterEof : KE.disallowedContentInNoscriptInHead;
    A._err(B), A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE", A._processToken(Q)
  }

  function FX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.BODY) A._insertElement(Q, r2.HTML), A.framesetOk = !1, A.insertionMode = "IN_BODY_MODE";
    else if (B === qA.FRAMESET) A._insertElement(Q, r2.HTML), A.insertionMode = "IN_FRAMESET_MODE";
    else if (B === qA.BASE || B === qA.BASEFONT || B === qA.BGSOUND || B === qA.LINK || B === qA.META || B === qA.NOFRAMES || B === qA.SCRIPT || B === qA.STYLE || B === qA.TEMPLATE || B === qA.TITLE) A._err(KE.abandonedHeadElementChild), A.openElements.push(A.headElement), MF(A, Q), A.openElements.remove(A.headElement);
    else if (B === qA.HEAD) A._err(KE.misplacedStartTagForHeadElement);
    else vyA(A, Q)
  }

  function HX5(A, Q) {
    let B = Q.tagName;
    if (B === qA.BODY || B === qA.HTML || B === qA.BR) vyA(A, Q);
    else if (B === qA.TEMPLATE) x4A(A, Q);
    else A._err(KE.endTagWithoutMatchingOpenElement)
  }

  function vyA(A, Q) {
    A._insertFakeElement(qA.BODY), A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function P4A(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertCharacters(Q)
  }

  function TY1(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertCharacters(Q), A.framesetOk = !1
  }

  function EX5(A, Q) {
    if (A.openElements.tmplCount === 0) A.treeAdapter.adoptAttributes(A.openElements.items[0], Q.attrs)
  }

  function zX5(A, Q) {
    let B = A.openElements.tryPeekProperlyNestedBodyElement();
    if (B && A.openElements.tmplCount === 0) A.framesetOk = !1, A.treeAdapter.adoptAttributes(B, Q.attrs)
  }

  function $X5(A, Q) {
    let B = A.openElements.tryPeekProperlyNestedBodyElement();
    if (A.framesetOk && B) A.treeAdapter.detachNode(B), A.openElements.popAllUpToHtmlElement(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_FRAMESET_MODE"
  }

  function fd(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML)
  }

  function CX5(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    let B = A.openElements.currentTagName;
    if (B === qA.H1 || B === qA.H2 || B === qA.H3 || B === qA.H4 || B === qA.H5 || B === qA.H6) A.openElements.pop();
    A._insertElement(Q, r2.HTML)
  }

  function x72(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML), A.skipNextNewLine = !0, A.framesetOk = !1
  }

  function UX5(A, Q) {
    let B = A.openElements.tmplCount > 0;
    if (!A.formElement || B) {
      if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
      if (A._insertElement(Q, r2.HTML), !B) A.formElement = A.openElements.current
    }
  }

  function qX5(A, Q) {
    A.framesetOk = !1;
    let B = Q.tagName;
    for (let G = A.openElements.stackTop; G >= 0; G--) {
      let Z = A.openElements.items[G],
        Y = A.treeAdapter.getTagName(Z),
        J = null;
      if (B === qA.LI && Y === qA.LI) J = qA.LI;
      else if ((B === qA.DD || B === qA.DT) && (Y === qA.DD || Y === qA.DT)) J = Y;
      if (J) {
        A.openElements.generateImpliedEndTagsWithExclusion(J), A.openElements.popUntilTagNamePopped(J);
        break
      }
      if (Y !== qA.ADDRESS && Y !== qA.DIV && Y !== qA.P && A._isSpecialElement(Z)) break
    }
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML)
  }

  function NX5(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML), A.tokenizer.state = x1.MODE.PLAINTEXT
  }

  function wX5(A, Q) {
    if (A.openElements.hasInScope(qA.BUTTON)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(qA.BUTTON);
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML), A.framesetOk = !1
  }

  function LX5(A, Q) {
    let B = A.activeFormattingElements.getElementEntryInScopeWithTagName(qA.A);
    if (B) lr(A, Q), A.openElements.remove(B.element), A.activeFormattingElements.removeEntry(B);
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function mVA(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function OX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), A.openElements.hasInScope(qA.NOBR)) lr(A, Q), A._reconstructActiveFormattingElements();
    A._insertElement(Q, r2.HTML), A.activeFormattingElements.pushElement(A.openElements.current, Q)
  }

  function y72(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1
  }

  function MX5(A, Q) {
    if (A.treeAdapter.getDocumentMode(A.document) !== S4A.DOCUMENT_MODE.QUIRKS && A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML), A.framesetOk = !1, A.insertionMode = "IN_TABLE_MODE"
  }

  function dVA(A, Q) {
    A._reconstructActiveFormattingElements(), A._appendElement(Q, r2.HTML), A.framesetOk = !1, Q.ackSelfClosing = !0
  }

  function RX5(A, Q) {
    A._reconstructActiveFormattingElements(), A._appendElement(Q, r2.HTML);
    let B = x1.getTokenAttr(Q, g72.TYPE);
    if (!B || B.toLowerCase() !== "hidden") A.framesetOk = !1;
    Q.ackSelfClosing = !0
  }

  function v72(A, Q) {
    A._appendElement(Q, r2.HTML), Q.ackSelfClosing = !0
  }

  function _X5(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._appendElement(Q, r2.HTML), A.framesetOk = !1, A.ackSelfClosing = !0
  }

  function jX5(A, Q) {
    Q.tagName = qA.IMG, dVA(A, Q)
  }

  function TX5(A, Q) {
    A._insertElement(Q, r2.HTML), A.skipNextNewLine = !0, A.tokenizer.state = x1.MODE.RCDATA, A.originalInsertionMode = A.insertionMode, A.framesetOk = !1, A.insertionMode = "TEXT_MODE"
  }

  function PX5(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._reconstructActiveFormattingElements(), A.framesetOk = !1, A._switchToTextParsing(Q, x1.MODE.RAWTEXT)
  }

  function SX5(A, Q) {
    A.framesetOk = !1, A._switchToTextParsing(Q, x1.MODE.RAWTEXT)
  }

  function k72(A, Q) {
    A._switchToTextParsing(Q, x1.MODE.RAWTEXT)
  }

  function xX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML), A.framesetOk = !1, A.insertionMode === "IN_TABLE_MODE" || A.insertionMode === "IN_CAPTION_MODE" || A.insertionMode === "IN_TABLE_BODY_MODE" || A.insertionMode === "IN_ROW_MODE" || A.insertionMode === "IN_CELL_MODE") A.insertionMode = "IN_SELECT_IN_TABLE_MODE";
    else A.insertionMode = "IN_SELECT_MODE"
  }

  function b72(A, Q) {
    if (A.openElements.currentTagName === qA.OPTION) A.openElements.pop();
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML)
  }

  function f72(A, Q) {
    if (A.openElements.hasInScope(qA.RUBY)) A.openElements.generateImpliedEndTags();
    A._insertElement(Q, r2.HTML)
  }

  function yX5(A, Q) {
    if (A.openElements.hasInScope(qA.RUBY)) A.openElements.generateImpliedEndTagsWithExclusion(qA.RTC);
    A._insertElement(Q, r2.HTML)
  }

  function vX5(A, Q) {
    if (A.openElements.hasInButtonScope(qA.P)) A._closePElement();
    A._insertElement(Q, r2.HTML)
  }

  function kX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), cb.adjustTokenMathMLAttrs(Q), cb.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, r2.MATHML);
    else A._insertElement(Q, r2.MATHML);
    Q.ackSelfClosing = !0
  }

  function bX5(A, Q) {
    if (A._reconstructActiveFormattingElements(), cb.adjustTokenSVGAttrs(Q), cb.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, r2.SVG);
    else A._insertElement(Q, r2.SVG);
    Q.ackSelfClosing = !0
  }

  function l_(A, Q) {
    A._reconstructActiveFormattingElements(), A._insertElement(Q, r2.HTML)
  }

  function yN(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 1:
        if (B === qA.I || B === qA.S || B === qA.B || B === qA.U) mVA(A, Q);
        else if (B === qA.P) fd(A, Q);
        else if (B === qA.A) LX5(A, Q);
        else l_(A, Q);
        break;
      case 2:
        if (B === qA.DL || B === qA.OL || B === qA.UL) fd(A, Q);
        else if (B === qA.H1 || B === qA.H2 || B === qA.H3 || B === qA.H4 || B === qA.H5 || B === qA.H6) CX5(A, Q);
        else if (B === qA.LI || B === qA.DD || B === qA.DT) qX5(A, Q);
        else if (B === qA.EM || B === qA.TT) mVA(A, Q);
        else if (B === qA.BR) dVA(A, Q);
        else if (B === qA.HR) _X5(A, Q);
        else if (B === qA.RB) f72(A, Q);
        else if (B === qA.RT || B === qA.RP) yX5(A, Q);
        else if (B !== qA.TH && B !== qA.TD && B !== qA.TR) l_(A, Q);
        break;
      case 3:
        if (B === qA.DIV || B === qA.DIR || B === qA.NAV) fd(A, Q);
        else if (B === qA.PRE) x72(A, Q);
        else if (B === qA.BIG) mVA(A, Q);
        else if (B === qA.IMG || B === qA.WBR) dVA(A, Q);
        else if (B === qA.XMP) PX5(A, Q);
        else if (B === qA.SVG) bX5(A, Q);
        else if (B === qA.RTC) f72(A, Q);
        else if (B !== qA.COL) l_(A, Q);
        break;
      case 4:
        if (B === qA.HTML) EX5(A, Q);
        else if (B === qA.BASE || B === qA.LINK || B === qA.META) MF(A, Q);
        else if (B === qA.BODY) zX5(A, Q);
        else if (B === qA.MAIN || B === qA.MENU) fd(A, Q);
        else if (B === qA.FORM) UX5(A, Q);
        else if (B === qA.CODE || B === qA.FONT) mVA(A, Q);
        else if (B === qA.NOBR) OX5(A, Q);
        else if (B === qA.AREA) dVA(A, Q);
        else if (B === qA.MATH) kX5(A, Q);
        else if (B === qA.MENU) vX5(A, Q);
        else if (B !== qA.HEAD) l_(A, Q);
        break;
      case 5:
        if (B === qA.STYLE || B === qA.TITLE) MF(A, Q);
        else if (B === qA.ASIDE) fd(A, Q);
        else if (B === qA.SMALL) mVA(A, Q);
        else if (B === qA.TABLE) MX5(A, Q);
        else if (B === qA.EMBED) dVA(A, Q);
        else if (B === qA.INPUT) RX5(A, Q);
        else if (B === qA.PARAM || B === qA.TRACK) v72(A, Q);
        else if (B === qA.IMAGE) jX5(A, Q);
        else if (B !== qA.FRAME && B !== qA.TBODY && B !== qA.TFOOT && B !== qA.THEAD) l_(A, Q);
        break;
      case 6:
        if (B === qA.SCRIPT) MF(A, Q);
        else if (B === qA.CENTER || B === qA.FIGURE || B === qA.FOOTER || B === qA.HEADER || B === qA.HGROUP || B === qA.DIALOG) fd(A, Q);
        else if (B === qA.BUTTON) wX5(A, Q);
        else if (B === qA.STRIKE || B === qA.STRONG) mVA(A, Q);
        else if (B === qA.APPLET || B === qA.OBJECT) y72(A, Q);
        else if (B === qA.KEYGEN) dVA(A, Q);
        else if (B === qA.SOURCE) v72(A, Q);
        else if (B === qA.IFRAME) SX5(A, Q);
        else if (B === qA.SELECT) xX5(A, Q);
        else if (B === qA.OPTION) b72(A, Q);
        else l_(A, Q);
        break;
      case 7:
        if (B === qA.BGSOUND) MF(A, Q);
        else if (B === qA.DETAILS || B === qA.ADDRESS || B === qA.ARTICLE || B === qA.SECTION || B === qA.SUMMARY) fd(A, Q);
        else if (B === qA.LISTING) x72(A, Q);
        else if (B === qA.MARQUEE) y72(A, Q);
        else if (B === qA.NOEMBED) k72(A, Q);
        else if (B !== qA.CAPTION) l_(A, Q);
        break;
      case 8:
        if (B === qA.BASEFONT) MF(A, Q);
        else if (B === qA.FRAMESET) $X5(A, Q);
        else if (B === qA.FIELDSET) fd(A, Q);
        else if (B === qA.TEXTAREA) TX5(A, Q);
        else if (B === qA.TEMPLATE) MF(A, Q);
        else if (B === qA.NOSCRIPT)
          if (A.options.scriptingEnabled) k72(A, Q);
          else l_(A, Q);
        else if (B === qA.OPTGROUP) b72(A, Q);
        else if (B !== qA.COLGROUP) l_(A, Q);
        break;
      case 9:
        if (B === qA.PLAINTEXT) NX5(A, Q);
        else l_(A, Q);
        break;
      case 10:
        if (B === qA.BLOCKQUOTE || B === qA.FIGCAPTION) fd(A, Q);
        else l_(A, Q);
        break;
      default:
        l_(A, Q)
    }
  }

  function fX5(A) {
    if (A.openElements.hasInScope(qA.BODY)) A.insertionMode = "AFTER_BODY_MODE"
  }

  function hX5(A, Q) {
    if (A.openElements.hasInScope(qA.BODY)) A.insertionMode = "AFTER_BODY_MODE", A._processToken(Q)
  }

  function pr(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B)
  }

  function gX5(A) {
    let Q = A.openElements.tmplCount > 0,
      B = A.formElement;
    if (!Q) A.formElement = null;
    if ((B || Q) && A.openElements.hasInScope(qA.FORM))
      if (A.openElements.generateImpliedEndTags(), Q) A.openElements.popUntilTagNamePopped(qA.FORM);
      else A.openElements.remove(B)
  }

  function uX5(A) {
    if (!A.openElements.hasInButtonScope(qA.P)) A._insertFakeElement(qA.P);
    A._closePElement()
  }

  function mX5(A) {
    if (A.openElements.hasInListItemScope(qA.LI)) A.openElements.generateImpliedEndTagsWithExclusion(qA.LI), A.openElements.popUntilTagNamePopped(qA.LI)
  }

  function dX5(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTagsWithExclusion(B), A.openElements.popUntilTagNamePopped(B)
  }

  function cX5(A) {
    if (A.openElements.hasNumberedHeaderInScope()) A.openElements.generateImpliedEndTags(), A.openElements.popUntilNumberedHeaderPopped()
  }

  function h72(A, Q) {
    let B = Q.tagName;
    if (A.openElements.hasInScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B), A.activeFormattingElements.clearToLastMarker()
  }

  function pX5(A) {
    A._reconstructActiveFormattingElements(), A._insertFakeElement(qA.BR), A.openElements.pop(), A.framesetOk = !1
  }

  function PS(A, Q) {
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

  function PD0(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 1:
        if (B === qA.A || B === qA.B || B === qA.I || B === qA.S || B === qA.U) lr(A, Q);
        else if (B === qA.P) uX5(A, Q);
        else PS(A, Q);
        break;
      case 2:
        if (B === qA.DL || B === qA.UL || B === qA.OL) pr(A, Q);
        else if (B === qA.LI) mX5(A, Q);
        else if (B === qA.DD || B === qA.DT) dX5(A, Q);
        else if (B === qA.H1 || B === qA.H2 || B === qA.H3 || B === qA.H4 || B === qA.H5 || B === qA.H6) cX5(A, Q);
        else if (B === qA.BR) pX5(A, Q);
        else if (B === qA.EM || B === qA.TT) lr(A, Q);
        else PS(A, Q);
        break;
      case 3:
        if (B === qA.BIG) lr(A, Q);
        else if (B === qA.DIR || B === qA.DIV || B === qA.NAV || B === qA.PRE) pr(A, Q);
        else PS(A, Q);
        break;
      case 4:
        if (B === qA.BODY) fX5(A, Q);
        else if (B === qA.HTML) hX5(A, Q);
        else if (B === qA.FORM) gX5(A, Q);
        else if (B === qA.CODE || B === qA.FONT || B === qA.NOBR) lr(A, Q);
        else if (B === qA.MAIN || B === qA.MENU) pr(A, Q);
        else PS(A, Q);
        break;
      case 5:
        if (B === qA.ASIDE) pr(A, Q);
        else if (B === qA.SMALL) lr(A, Q);
        else PS(A, Q);
        break;
      case 6:
        if (B === qA.CENTER || B === qA.FIGURE || B === qA.FOOTER || B === qA.HEADER || B === qA.HGROUP || B === qA.DIALOG) pr(A, Q);
        else if (B === qA.APPLET || B === qA.OBJECT) h72(A, Q);
        else if (B === qA.STRIKE || B === qA.STRONG) lr(A, Q);
        else PS(A, Q);
        break;
      case 7:
        if (B === qA.ADDRESS || B === qA.ARTICLE || B === qA.DETAILS || B === qA.SECTION || B === qA.SUMMARY || B === qA.LISTING) pr(A, Q);
        else if (B === qA.MARQUEE) h72(A, Q);
        else PS(A, Q);
        break;
      case 8:
        if (B === qA.FIELDSET) pr(A, Q);
        else if (B === qA.TEMPLATE) x4A(A, Q);
        else PS(A, Q);
        break;
      case 10:
        if (B === qA.BLOCKQUOTE || B === qA.FIGCAPTION) pr(A, Q);
        else PS(A, Q);
        break;
      default:
        PS(A, Q)
    }
  }

  function hd(A, Q) {
    if (A.tmplInsertionModeStackTop > -1) c72(A, Q);
    else A.stopped = !0
  }

  function lX5(A, Q) {
    if (Q.tagName === qA.SCRIPT) A.pendingScript = A.openElements.current;
    A.openElements.pop(), A.insertionMode = A.originalInsertionMode
  }

  function iX5(A, Q) {
    A._err(KE.eofInElementThatCanContainOnlyText), A.openElements.pop(), A.insertionMode = A.originalInsertionMode, A._processToken(Q)
  }

  function gd(A, Q) {
    let B = A.openElements.currentTagName;
    if (B === qA.TABLE || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD || B === qA.TR) A.pendingCharacterTokens = [], A.hasNonWhitespacePendingCharacterToken = !1, A.originalInsertionMode = A.insertionMode, A.insertionMode = "IN_TABLE_TEXT_MODE", A._processToken(Q);
    else i_(A, Q)
  }

  function nX5(A, Q) {
    A.openElements.clearBackToTableContext(), A.activeFormattingElements.insertMarker(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_CAPTION_MODE"
  }

  function aX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_COLUMN_GROUP_MODE"
  }

  function oX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertFakeElement(qA.COLGROUP), A.insertionMode = "IN_COLUMN_GROUP_MODE", A._processToken(Q)
  }

  function rX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_TABLE_BODY_MODE"
  }

  function sX5(A, Q) {
    A.openElements.clearBackToTableContext(), A._insertFakeElement(qA.TBODY), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
  }

  function tX5(A, Q) {
    if (A.openElements.hasInTableScope(qA.TABLE)) A.openElements.popUntilTagNamePopped(qA.TABLE), A._resetInsertionMode(), A._processToken(Q)
  }

  function eX5(A, Q) {
    let B = x1.getTokenAttr(Q, g72.TYPE);
    if (B && B.toLowerCase() === "hidden") A._appendElement(Q, r2.HTML);
    else i_(A, Q);
    Q.ackSelfClosing = !0
  }

  function AI5(A, Q) {
    if (!A.formElement && A.openElements.tmplCount === 0) A._insertElement(Q, r2.HTML), A.formElement = A.openElements.current, A.openElements.pop()
  }

  function SD0(A, Q) {
    let B = Q.tagName;
    switch (B.length) {
      case 2:
        if (B === qA.TD || B === qA.TH || B === qA.TR) sX5(A, Q);
        else i_(A, Q);
        break;
      case 3:
        if (B === qA.COL) oX5(A, Q);
        else i_(A, Q);
        break;
      case 4:
        if (B === qA.FORM) AI5(A, Q);
        else i_(A, Q);
        break;
      case 5:
        if (B === qA.TABLE) tX5(A, Q);
        else if (B === qA.STYLE) MF(A, Q);
        else if (B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD) rX5(A, Q);
        else if (B === qA.INPUT) eX5(A, Q);
        else i_(A, Q);
        break;
      case 6:
        if (B === qA.SCRIPT) MF(A, Q);
        else i_(A, Q);
        break;
      case 7:
        if (B === qA.CAPTION) nX5(A, Q);
        else i_(A, Q);
        break;
      case 8:
        if (B === qA.COLGROUP) aX5(A, Q);
        else if (B === qA.TEMPLATE) MF(A, Q);
        else i_(A, Q);
        break;
      default:
        i_(A, Q)
    }
  }

  function xD0(A, Q) {
    let B = Q.tagName;
    if (B === qA.TABLE) {
      if (A.openElements.hasInTableScope(qA.TABLE)) A.openElements.popUntilTagNamePopped(qA.TABLE), A._resetInsertionMode()
    } else if (B === qA.TEMPLATE) x4A(A, Q);
    else if (B !== qA.BODY && B !== qA.CAPTION && B !== qA.COL && B !== qA.COLGROUP && B !== qA.HTML && B !== qA.TBODY && B !== qA.TD && B !== qA.TFOOT && B !== qA.TH && B !== qA.THEAD && B !== qA.TR) i_(A, Q)
  }

  function i_(A, Q) {
    let B = A.fosterParentingEnabled;
    A.fosterParentingEnabled = !0, A._processTokenInBodyMode(Q), A.fosterParentingEnabled = B
  }

  function QI5(A, Q) {
    A.pendingCharacterTokens.push(Q)
  }

  function BI5(A, Q) {
    A.pendingCharacterTokens.push(Q), A.hasNonWhitespacePendingCharacterToken = !0
  }

  function TyA(A, Q) {
    let B = 0;
    if (A.hasNonWhitespacePendingCharacterToken)
      for (; B < A.pendingCharacterTokens.length; B++) i_(A, A.pendingCharacterTokens[B]);
    else
      for (; B < A.pendingCharacterTokens.length; B++) A._insertCharacters(A.pendingCharacterTokens[B]);
    A.insertionMode = A.originalInsertionMode, A._processToken(Q)
  }

  function GI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.CAPTION || B === qA.COL || B === qA.COLGROUP || B === qA.TBODY || B === qA.TD || B === qA.TFOOT || B === qA.TH || B === qA.THEAD || B === qA.TR) {
      if (A.openElements.hasInTableScope(qA.CAPTION)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(qA.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else yN(A, Q)
  }

  function ZI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.CAPTION || B === qA.TABLE) {
      if (A.openElements.hasInTableScope(qA.CAPTION)) {
        if (A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(qA.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", B === qA.TABLE) A._processToken(Q)
      }
    } else if (B !== qA.BODY && B !== qA.COL && B !== qA.COLGROUP && B !== qA.HTML && B !== qA.TBODY && B !== qA.TD && B !== qA.TFOOT && B !== qA.TH && B !== qA.THEAD && B !== qA.TR) PD0(A, Q)
  }

  function YI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.COL) A._appendElement(Q, r2.HTML), Q.ackSelfClosing = !0;
    else if (B === qA.TEMPLATE) MF(A, Q);
    else SY1(A, Q)
  }

  function JI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.COLGROUP) {
      if (A.openElements.currentTagName === qA.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
    } else if (B === qA.TEMPLATE) x4A(A, Q);
    else if (B !== qA.COL) SY1(A, Q)
  }

  function SY1(A, Q) {
    if (A.openElements.currentTagName === qA.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
  }

  function XI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.TR) A.openElements.clearBackToTableBodyContext(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_ROW_MODE";
    else if (B === qA.TH || B === qA.TD) A.openElements.clearBackToTableBodyContext(), A._insertFakeElement(qA.TR), A.insertionMode = "IN_ROW_MODE", A._processToken(Q);
    else if (B === qA.CAPTION || B === qA.COL || B === qA.COLGROUP || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD) {
      if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else SD0(A, Q)
  }

  function II5(A, Q) {
    let B = Q.tagName;
    if (B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD) {
      if (A.openElements.hasInTableScope(B)) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
    } else if (B === qA.TABLE) {
      if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(Q)
    } else if (B !== qA.BODY && B !== qA.CAPTION && B !== qA.COL && B !== qA.COLGROUP || B !== qA.HTML && B !== qA.TD && B !== qA.TH && B !== qA.TR) xD0(A, Q)
  }

  function DI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.TH || B === qA.TD) A.openElements.clearBackToTableRowContext(), A._insertElement(Q, r2.HTML), A.insertionMode = "IN_CELL_MODE", A.activeFormattingElements.insertMarker();
    else if (B === qA.CAPTION || B === qA.COL || B === qA.COLGROUP || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD || B === qA.TR) {
      if (A.openElements.hasInTableScope(qA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else SD0(A, Q)
  }

  function WI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.TR) {
      if (A.openElements.hasInTableScope(qA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE"
    } else if (B === qA.TABLE) {
      if (A.openElements.hasInTableScope(qA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else if (B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD) {
      if (A.openElements.hasInTableScope(B) || A.openElements.hasInTableScope(qA.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(Q)
    } else if (B !== qA.BODY && B !== qA.CAPTION && B !== qA.COL && B !== qA.COLGROUP || B !== qA.HTML && B !== qA.TD && B !== qA.TH) xD0(A, Q)
  }

  function KI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.CAPTION || B === qA.COL || B === qA.COLGROUP || B === qA.TBODY || B === qA.TD || B === qA.TFOOT || B === qA.TH || B === qA.THEAD || B === qA.TR) {
      if (A.openElements.hasInTableScope(qA.TD) || A.openElements.hasInTableScope(qA.TH)) A._closeTableCell(), A._processToken(Q)
    } else yN(A, Q)
  }

  function VI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.TD || B === qA.TH) {
      if (A.openElements.hasInTableScope(B)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(B), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_ROW_MODE"
    } else if (B === qA.TABLE || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD || B === qA.TR) {
      if (A.openElements.hasInTableScope(B)) A._closeTableCell(), A._processToken(Q)
    } else if (B !== qA.BODY && B !== qA.CAPTION && B !== qA.COL && B !== qA.COLGROUP && B !== qA.HTML) PD0(A, Q)
  }

  function m72(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.OPTION) {
      if (A.openElements.currentTagName === qA.OPTION) A.openElements.pop();
      A._insertElement(Q, r2.HTML)
    } else if (B === qA.OPTGROUP) {
      if (A.openElements.currentTagName === qA.OPTION) A.openElements.pop();
      if (A.openElements.currentTagName === qA.OPTGROUP) A.openElements.pop();
      A._insertElement(Q, r2.HTML)
    } else if (B === qA.INPUT || B === qA.KEYGEN || B === qA.TEXTAREA || B === qA.SELECT) {
      if (A.openElements.hasInSelectScope(qA.SELECT)) {
        if (A.openElements.popUntilTagNamePopped(qA.SELECT), A._resetInsertionMode(), B !== qA.SELECT) A._processToken(Q)
      }
    } else if (B === qA.SCRIPT || B === qA.TEMPLATE) MF(A, Q)
  }

  function d72(A, Q) {
    let B = Q.tagName;
    if (B === qA.OPTGROUP) {
      let G = A.openElements.items[A.openElements.stackTop - 1],
        Z = G && A.treeAdapter.getTagName(G);
      if (A.openElements.currentTagName === qA.OPTION && Z === qA.OPTGROUP) A.openElements.pop();
      if (A.openElements.currentTagName === qA.OPTGROUP) A.openElements.pop()
    } else if (B === qA.OPTION) {
      if (A.openElements.currentTagName === qA.OPTION) A.openElements.pop()
    } else if (B === qA.SELECT && A.openElements.hasInSelectScope(qA.SELECT)) A.openElements.popUntilTagNamePopped(qA.SELECT), A._resetInsertionMode();
    else if (B === qA.TEMPLATE) x4A(A, Q)
  }

  function FI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.CAPTION || B === qA.TABLE || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD || B === qA.TR || B === qA.TD || B === qA.TH) A.openElements.popUntilTagNamePopped(qA.SELECT), A._resetInsertionMode(), A._processToken(Q);
    else m72(A, Q)
  }

  function HI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.CAPTION || B === qA.TABLE || B === qA.TBODY || B === qA.TFOOT || B === qA.THEAD || B === qA.TR || B === qA.TD || B === qA.TH) {
      if (A.openElements.hasInTableScope(B)) A.openElements.popUntilTagNamePopped(qA.SELECT), A._resetInsertionMode(), A._processToken(Q)
    } else d72(A, Q)
  }

  function EI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.BASE || B === qA.BASEFONT || B === qA.BGSOUND || B === qA.LINK || B === qA.META || B === qA.NOFRAMES || B === qA.SCRIPT || B === qA.STYLE || B === qA.TEMPLATE || B === qA.TITLE) MF(A, Q);
    else {
      let G = tJ5[B] || "IN_BODY_MODE";
      A._popTmplInsertionMode(), A._pushTmplInsertionMode(G), A.insertionMode = G, A._processToken(Q)
    }
  }

  function zI5(A, Q) {
    if (Q.tagName === qA.TEMPLATE) x4A(A, Q)
  }

  function c72(A, Q) {
    if (A.openElements.tmplCount > 0) A.openElements.popUntilTagNamePopped(qA.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode(), A._processToken(Q);
    else A.stopped = !0
  }

  function $I5(A, Q) {
    if (Q.tagName === qA.HTML) yN(A, Q);
    else xY1(A, Q)
  }

  function CI5(A, Q) {
    if (Q.tagName === qA.HTML) {
      if (!A.fragmentContext) A.insertionMode = "AFTER_AFTER_BODY_MODE"
    } else xY1(A, Q)
  }

  function xY1(A, Q) {
    A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function UI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.FRAMESET) A._insertElement(Q, r2.HTML);
    else if (B === qA.FRAME) A._appendElement(Q, r2.HTML), Q.ackSelfClosing = !0;
    else if (B === qA.NOFRAMES) MF(A, Q)
  }

  function qI5(A, Q) {
    if (Q.tagName === qA.FRAMESET && !A.openElements.isRootHtmlElementCurrent()) {
      if (A.openElements.pop(), !A.fragmentContext && A.openElements.currentTagName !== qA.FRAMESET) A.insertionMode = "AFTER_FRAMESET_MODE"
    }
  }

  function NI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.NOFRAMES) MF(A, Q)
  }

  function wI5(A, Q) {
    if (Q.tagName === qA.HTML) A.insertionMode = "AFTER_AFTER_FRAMESET_MODE"
  }

  function LI5(A, Q) {
    if (Q.tagName === qA.HTML) yN(A, Q);
    else PY1(A, Q)
  }

  function PY1(A, Q) {
    A.insertionMode = "IN_BODY_MODE", A._processToken(Q)
  }

  function OI5(A, Q) {
    let B = Q.tagName;
    if (B === qA.HTML) yN(A, Q);
    else if (B === qA.NOFRAMES) MF(A, Q)
  }

  function MI5(A, Q) {
    Q.chars = oJ5.REPLACEMENT_CHARACTER, A._insertCharacters(Q)
  }

  function RI5(A, Q) {
    A._insertCharacters(Q), A.framesetOk = !1
  }

  function _I5(A, Q) {
    if (cb.causesExit(Q) && !A.fragmentContext) {
      while (A.treeAdapter.getNamespaceURI(A.openElements.current) !== r2.HTML && !A._isIntegrationPoint(A.openElements.current)) A.openElements.pop();
      A._processToken(Q)
    } else {
      let B = A._getAdjustedCurrentElement(),
        G = A.treeAdapter.getNamespaceURI(B);
      if (G === r2.MATHML) cb.adjustTokenMathMLAttrs(Q);
      else if (G === r2.SVG) cb.adjustTokenSVGTagName(Q), cb.adjustTokenSVGAttrs(Q);
      if (cb.adjustTokenXMLAttrs(Q), Q.selfClosing) A._appendElement(Q, G);
      else A._insertElement(Q, G);
      Q.ackSelfClosing = !0
    }
  }

  function jI5(A, Q) {
    for (let B = A.openElements.stackTop; B > 0; B--) {
      let G = A.openElements.items[B];
      if (A.treeAdapter.getNamespaceURI(G) === r2.HTML) {
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
// @from(Ln 276187, Col 4)
a72 = U((qMZ, n72) => {
  var TI5 = MD0(),
    PI5 = RD0(),
    SI5 = _D0(),
    i72 = cr(),
    DY = i72.TAG_NAMES,
    yY1 = i72.NAMESPACES,
    xI5 = {
      treeAdapter: TI5
    },
    yI5 = /&/g,
    vI5 = /\u00a0/g,
    kI5 = /"/g,
    bI5 = /</g,
    fI5 = />/g;
  class kyA {
    constructor(A, Q) {
      this.options = PI5(xI5, Q), this.treeAdapter = this.options.treeAdapter, this.html = "", this.startNode = A
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
      if (this.html += "<" + Q, this._serializeAttributes(A), this.html += ">", Q !== DY.AREA && Q !== DY.BASE && Q !== DY.BASEFONT && Q !== DY.BGSOUND && Q !== DY.BR && Q !== DY.COL && Q !== DY.EMBED && Q !== DY.FRAME && Q !== DY.HR && Q !== DY.IMG && Q !== DY.INPUT && Q !== DY.KEYGEN && Q !== DY.LINK && Q !== DY.META && Q !== DY.PARAM && Q !== DY.SOURCE && Q !== DY.TRACK && Q !== DY.WBR) {
        let G = Q === DY.TEMPLATE && B === yY1.HTML ? this.treeAdapter.getTemplateContent(A) : A;
        this._serializeChildNodes(G), this.html += "</" + Q + ">"
      }
    }
    _serializeAttributes(A) {
      let Q = this.treeAdapter.getAttrList(A);
      for (let B = 0, G = Q.length; B < G; B++) {
        let Z = Q[B],
          Y = kyA.escapeString(Z.value, !0);
        if (this.html += " ", !Z.namespace) this.html += Z.name;
        else if (Z.namespace === yY1.XML) this.html += "xml:" + Z.name;
        else if (Z.namespace === yY1.XMLNS) {
          if (Z.name !== "xmlns") this.html += "xmlns:";
          this.html += Z.name
        } else if (Z.namespace === yY1.XLINK) this.html += "xlink:" + Z.name;
        else this.html += Z.prefix + ":" + Z.name;
        this.html += '="' + Y + '"'
      }
    }
    _serializeTextNode(A) {
      let Q = this.treeAdapter.getTextNodeContent(A),
        B = this.treeAdapter.getParentNode(A),
        G = void 0;
      if (B && this.treeAdapter.isElementNode(B)) G = this.treeAdapter.getTagName(B);
      if (G === DY.STYLE || G === DY.SCRIPT || G === DY.XMP || G === DY.IFRAME || G === DY.NOEMBED || G === DY.NOFRAMES || G === DY.PLAINTEXT || G === DY.NOSCRIPT) this.html += Q;
      else this.html += kyA.escapeString(Q, !1)
    }
    _serializeCommentNode(A) {
      this.html += "<!--" + this.treeAdapter.getCommentNodeContent(A) + "-->"
    }
    _serializeDocumentTypeNode(A) {
      let Q = this.treeAdapter.getDocumentTypeNodeName(A);
      this.html += "<" + SI5.serializeContent(Q, null, null) + ">"
    }
  }
  kyA.escapeString = function (A, Q) {
    if (A = A.replace(yI5, "&amp;").replace(vI5, "&nbsp;"), Q) A = A.replace(kI5, "&quot;");
    else A = A.replace(bI5, "&lt;").replace(fI5, "&gt;");
    return A
  };
  n72.exports = kyA
})
// @from(Ln 276266, Col 4)
r72 = U((gI5) => {
  var o72 = l72(),
    hI5 = a72();
  gI5.parse = function (Q, B) {
    return new o72(B).parse(Q)
  };
  gI5.parseFragment = function (Q, B, G) {
    if (typeof Q === "string") G = B, B = Q, Q = null;
    return new o72(G).parseFragment(B, Q)
  };
  gI5.serialize = function (A, Q) {
    return new hI5(A, Q).serialize()
  }
})
// @from(Ln 276280, Col 4)
vD0 = U((cI5) => {
  var yD0 = cI5.NAMESPACES = {
    HTML: "http://www.w3.org/1999/xhtml",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/"
  };
  cI5.ATTRS = {
    TYPE: "type",
    ACTION: "action",
    ENCODING: "encoding",
    PROMPT: "prompt",
    NAME: "name",
    COLOR: "color",
    FACE: "face",
    SIZE: "size"
  };
  cI5.DOCUMENT_MODE = {
    NO_QUIRKS: "no-quirks",
    QUIRKS: "quirks",
    LIMITED_QUIRKS: "limited-quirks"
  };
  var wB = cI5.TAG_NAMES = {
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
  cI5.SPECIAL_ELEMENTS = {
    [yD0.HTML]: {
      [wB.ADDRESS]: !0,
      [wB.APPLET]: !0,
      [wB.AREA]: !0,
      [wB.ARTICLE]: !0,
      [wB.ASIDE]: !0,
      [wB.BASE]: !0,
      [wB.BASEFONT]: !0,
      [wB.BGSOUND]: !0,
      [wB.BLOCKQUOTE]: !0,
      [wB.BODY]: !0,
      [wB.BR]: !0,
      [wB.BUTTON]: !0,
      [wB.CAPTION]: !0,
      [wB.CENTER]: !0,
      [wB.COL]: !0,
      [wB.COLGROUP]: !0,
      [wB.DD]: !0,
      [wB.DETAILS]: !0,
      [wB.DIR]: !0,
      [wB.DIV]: !0,
      [wB.DL]: !0,
      [wB.DT]: !0,
      [wB.EMBED]: !0,
      [wB.FIELDSET]: !0,
      [wB.FIGCAPTION]: !0,
      [wB.FIGURE]: !0,
      [wB.FOOTER]: !0,
      [wB.FORM]: !0,
      [wB.FRAME]: !0,
      [wB.FRAMESET]: !0,
      [wB.H1]: !0,
      [wB.H2]: !0,
      [wB.H3]: !0,
      [wB.H4]: !0,
      [wB.H5]: !0,
      [wB.H6]: !0,
      [wB.HEAD]: !0,
      [wB.HEADER]: !0,
      [wB.HGROUP]: !0,
      [wB.HR]: !0,
      [wB.HTML]: !0,
      [wB.IFRAME]: !0,
      [wB.IMG]: !0,
      [wB.INPUT]: !0,
      [wB.LI]: !0,
      [wB.LINK]: !0,
      [wB.LISTING]: !0,
      [wB.MAIN]: !0,
      [wB.MARQUEE]: !0,
      [wB.MENU]: !0,
      [wB.META]: !0,
      [wB.NAV]: !0,
      [wB.NOEMBED]: !0,
      [wB.NOFRAMES]: !0,
      [wB.NOSCRIPT]: !0,
      [wB.OBJECT]: !0,
      [wB.OL]: !0,
      [wB.P]: !0,
      [wB.PARAM]: !0,
      [wB.PLAINTEXT]: !0,
      [wB.PRE]: !0,
      [wB.SCRIPT]: !0,
      [wB.SECTION]: !0,
      [wB.SELECT]: !0,
      [wB.SOURCE]: !0,
      [wB.STYLE]: !0,
      [wB.SUMMARY]: !0,
      [wB.TABLE]: !0,
      [wB.TBODY]: !0,
      [wB.TD]: !0,
      [wB.TEMPLATE]: !0,
      [wB.TEXTAREA]: !0,
      [wB.TFOOT]: !0,
      [wB.TH]: !0,
      [wB.THEAD]: !0,
      [wB.TITLE]: !0,
      [wB.TR]: !0,
      [wB.TRACK]: !0,
      [wB.UL]: !0,
      [wB.WBR]: !0,
      [wB.XMP]: !0
    },
    [yD0.MATHML]: {
      [wB.MI]: !0,
      [wB.MO]: !0,
      [wB.MN]: !0,
      [wB.MS]: !0,
      [wB.MTEXT]: !0,
      [wB.ANNOTATION_XML]: !0
    },
    [yD0.SVG]: {
      [wB.TITLE]: !0,
      [wB.FOREIGN_OBJECT]: !0,
      [wB.DESC]: !0
    }
  }
})
// @from(Ln 276527, Col 4)
QG2 = U((rI5) => {
  var {
    DOCUMENT_MODE: cVA
  } = vD0(), e72 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], nI5 = e72.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), aI5 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], AG2 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], oI5 = AG2.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

  function s72(A) {
    let Q = A.indexOf('"') !== -1 ? "'" : '"';
    return Q + A + Q
  }

  function t72(A, Q) {
    for (let B = 0; B < Q.length; B++)
      if (A.indexOf(Q[B]) === 0) return !0;
    return !1
  }
  rI5.isConforming = function (A) {
    return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
  };
  rI5.getDocumentMode = function (A) {
    if (A.name !== "html") return cVA.QUIRKS;
    let Q = A.systemId;
    if (Q && Q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return cVA.QUIRKS;
    let B = A.publicId;
    if (B !== null) {
      if (B = B.toLowerCase(), aI5.indexOf(B) > -1) return cVA.QUIRKS;
      let G = Q === null ? nI5 : e72;
      if (t72(B, G)) return cVA.QUIRKS;
      if (G = Q === null ? AG2 : oI5, t72(B, G)) return cVA.LIMITED_QUIRKS
    }
    return cVA.NO_QUIRKS
  };
  rI5.serializeContent = function (A, Q, B) {
    let G = "!DOCTYPE ";
    if (A) G += A;
    if (Q) G += " PUBLIC " + s72(Q);
    else if (B) G += " SYSTEM";
    if (B !== null) G += " " + s72(B);
    return G
  }
})
// @from(Ln 276567, Col 4)
YG2 = U((GD5) => {
  var AD5 = QG2(),
    {
      DOCUMENT_MODE: QD5
    } = vD0(),
    BG2 = {
      element: 1,
      text: 3,
      cdata: 4,
      comment: 8
    },
    GG2 = {
      tagName: "name",
      childNodes: "children",
      parentNode: "parent",
      previousSibling: "prev",
      nextSibling: "next",
      nodeValue: "data"
    };
  class ir {
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
      return BG2[this.type] || BG2.element
    }
  }
  Object.keys(GG2).forEach((A) => {
    let Q = GG2[A];
    Object.defineProperty(ir.prototype, A, {
      get: function () {
        return this[Q] || null
      },
      set: function (B) {
        return this[Q] = B, B
      }
    })
  });
  GD5.createDocument = function () {
    return new ir({
      type: "root",
      name: "root",
      parent: null,
      prev: null,
      next: null,
      children: [],
      "x-mode": QD5.NO_QUIRKS
    })
  };
  GD5.createDocumentFragment = function () {
    return new ir({
      type: "root",
      name: "root",
      parent: null,
      prev: null,
      next: null,
      children: []
    })
  };
  GD5.createElement = function (A, Q, B) {
    let G = Object.create(null),
      Z = Object.create(null),
      Y = Object.create(null);
    for (let J = 0; J < B.length; J++) {
      let X = B[J].name;
      G[X] = B[J].value, Z[X] = B[J].namespace, Y[X] = B[J].prefix
    }
    return new ir({
      type: A === "script" || A === "style" ? A : "tag",
      name: A,
      namespace: Q,
      attribs: G,
      "x-attribsNamespace": Z,
      "x-attribsPrefix": Y,
      children: [],
      parent: null,
      prev: null,
      next: null
    })
  };
  GD5.createCommentNode = function (A) {
    return new ir({
      type: "comment",
      data: A,
      parent: null,
      prev: null,
      next: null
    })
  };
  var ZG2 = function (A) {
      return new ir({
        type: "text",
        data: A,
        parent: null,
        prev: null,
        next: null
      })
    },
    kD0 = GD5.appendChild = function (A, Q) {
      let B = A.children[A.children.length - 1];
      if (B) B.next = Q, Q.prev = B;
      A.children.push(Q), Q.parent = A
    },
    BD5 = GD5.insertBefore = function (A, Q, B) {
      let G = A.children.indexOf(B),
        Z = B.prev;
      if (Z) Z.next = Q, Q.prev = Z;
      B.prev = Q, Q.next = B, A.children.splice(G, 0, Q), Q.parent = A
    };
  GD5.setTemplateContent = function (A, Q) {
    kD0(A, Q)
  };
  GD5.getTemplateContent = function (A) {
    return A.children[0]
  };
  GD5.setDocumentType = function (A, Q, B, G) {
    let Z = AD5.serializeContent(Q, B, G),
      Y = null;
    for (let J = 0; J < A.children.length; J++)
      if (A.children[J].type === "directive" && A.children[J].name === "!doctype") {
        Y = A.children[J];
        break
      } if (Y) Y.data = Z, Y["x-name"] = Q, Y["x-publicId"] = B, Y["x-systemId"] = G;
    else kD0(A, new ir({
      type: "directive",
      name: "!doctype",
      data: Z,
      "x-name": Q,
      "x-publicId": B,
      "x-systemId": G
    }))
  };
  GD5.setDocumentMode = function (A, Q) {
    A["x-mode"] = Q
  };
  GD5.getDocumentMode = function (A) {
    return A["x-mode"]
  };
  GD5.detachNode = function (A) {
    if (A.parent) {
      let Q = A.parent.children.indexOf(A),
        B = A.prev,
        G = A.next;
      if (A.prev = null, A.next = null, B) B.next = G;
      if (G) G.prev = B;
      A.parent.children.splice(Q, 1), A.parent = null
    }
  };
  GD5.insertText = function (A, Q) {
    let B = A.children[A.children.length - 1];
    if (B && B.type === "text") B.data += Q;
    else kD0(A, ZG2(Q))
  };
  GD5.insertTextBefore = function (A, Q, B) {
    let G = A.children[A.children.indexOf(B) - 1];
    if (G && G.type === "text") G.data += Q;
    else BD5(A, ZG2(Q), B)
  };
  GD5.adoptAttributes = function (A, Q) {
    for (let B = 0; B < Q.length; B++) {
      let G = Q[B].name;
      if (typeof A.attribs[G] > "u") A.attribs[G] = Q[B].value, A["x-attribsNamespace"][G] = Q[B].namespace, A["x-attribsPrefix"][G] = Q[B].prefix
    }
  };
  GD5.getFirstChild = function (A) {
    return A.children[0]
  };
  GD5.getChildNodes = function (A) {
    return A.children
  };
  GD5.getParentNode = function (A) {
    return A.parent
  };
  GD5.getAttrList = function (A) {
    let Q = [];
    for (let B in A.attribs) Q.push({
      name: B,
      value: A.attribs[B],
      namespace: A["x-attribsNamespace"][B],
      prefix: A["x-attribsPrefix"][B]
    });
    return Q
  };
  GD5.getTagName = function (A) {
    return A.name
  };
  GD5.getNamespaceURI = function (A) {
    return A.namespace
  };
  GD5.getTextNodeContent = function (A) {
    return A.data
  };
  GD5.getCommentNodeContent = function (A) {
    return A.data
  };
  GD5.getDocumentTypeNodeName = function (A) {
    return A["x-name"]
  };
  GD5.getDocumentTypeNodePublicId = function (A) {
    return A["x-publicId"]
  };
  GD5.getDocumentTypeNodeSystemId = function (A) {
    return A["x-systemId"]
  };
  GD5.isTextNode = function (A) {
    return A.type === "text"
  };
  GD5.isCommentNode = function (A) {
    return A.type === "comment"
  };
  GD5.isDocumentTypeNode = function (A) {
    return A.type === "directive" && A.name === "!doctype"
  };
  GD5.isElementNode = function (A) {
    return !!A.attribs
  };
  GD5.setNodeSourceCodeLocation = function (A, Q) {
    A.sourceCodeLocation = Q
  };
  GD5.getNodeSourceCodeLocation = function (A) {
    return A.sourceCodeLocation
  };
  GD5.updateNodeSourceCodeLocation = function (A, Q) {
    A.sourceCodeLocation = Object.assign(A.sourceCodeLocation, Q)
  }
})
// @from(Ln 276801, Col 4)
KG2 = U((TMZ, WG2) => {
  var JG2 = (A, Q) => (...B) => {
      return `\x1B[${A(...B)+Q}m`
    },
    XG2 = (A, Q) => (...B) => {
      let G = A(...B);
      return `\x1B[${38+Q};5;${G}m`
    },
    IG2 = (A, Q) => (...B) => {
      let G = A(...B);
      return `\x1B[${38+Q};2;${G[0]};${G[1]};${G[2]}m`
    },
    vY1 = (A) => A,
    DG2 = (A, Q, B) => [A, Q, B],
    pVA = (A, Q, B) => {
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
    bD0, lVA = (A, Q, B, G) => {
      if (bD0 === void 0) bD0 = XZ0();
      let Z = G ? 10 : 0,
        Y = {};
      for (let [J, X] of Object.entries(bD0)) {
        let I = J === "ansi16" ? "ansi" : J;
        if (J === Q) Y[I] = A(B, Z);
        else if (typeof X === "object") Y[I] = A(X[Q], Z)
      }
      return Y
    };

  function kD5() {
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
      for (let [Z, Y] of Object.entries(G)) Q[Z] = {
        open: `\x1B[${Y[0]}m`,
        close: `\x1B[${Y[1]}m`
      }, G[Z] = Q[Z], A.set(Y[0], Y[1]);
      Object.defineProperty(Q, B, {
        value: G,
        enumerable: !1
      })
    }
    return Object.defineProperty(Q, "codes", {
      value: A,
      enumerable: !1
    }), Q.color.close = "\x1B[39m", Q.bgColor.close = "\x1B[49m", pVA(Q.color, "ansi", () => lVA(JG2, "ansi16", vY1, !1)), pVA(Q.color, "ansi256", () => lVA(XG2, "ansi256", vY1, !1)), pVA(Q.color, "ansi16m", () => lVA(IG2, "rgb", DG2, !1)), pVA(Q.bgColor, "ansi", () => lVA(JG2, "ansi16", vY1, !0)), pVA(Q.bgColor, "ansi256", () => lVA(XG2, "ansi256", vY1, !0)), pVA(Q.bgColor, "ansi16m", () => lVA(IG2, "rgb", DG2, !0)), Q
  }
  Object.defineProperty(WG2, "exports", {
    enumerable: !0,
    get: kD5
  })
})
// @from(Ln 276912, Col 4)
HG2 = U((PMZ, FG2) => {
  var bD5 = NA("os"),
    VG2 = NA("tty"),
    n_ = QUA(),
    {
      env: RF
    } = process,
    nr;
  if (n_("no-color") || n_("no-colors") || n_("color=false") || n_("color=never")) nr = 0;
  else if (n_("color") || n_("colors") || n_("color=true") || n_("color=always")) nr = 1;
  if ("FORCE_COLOR" in RF)
    if (RF.FORCE_COLOR === "true") nr = 1;
    else if (RF.FORCE_COLOR === "false") nr = 0;
  else nr = RF.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(RF.FORCE_COLOR, 10), 3);

  function fD0(A) {
    if (A === 0) return !1;
    return {
      level: A,
      hasBasic: !0,
      has256: A >= 2,
      has16m: A >= 3
    }
  }

  function hD0(A, Q) {
    if (nr === 0) return 0;
    if (n_("color=16m") || n_("color=full") || n_("color=truecolor")) return 3;
    if (n_("color=256")) return 2;
    if (A && !Q && nr === void 0) return 0;
    let B = nr || 0;
    if (RF.TERM === "dumb") return B;
    if (process.platform === "win32") {
      let G = bD5.release().split(".");
      if (Number(G[0]) >= 10 && Number(G[2]) >= 10586) return Number(G[2]) >= 14931 ? 3 : 2;
      return 1
    }
    if ("CI" in RF) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((G) => (G in RF)) || RF.CI_NAME === "codeship") return 1;
      return B
    }
    if ("TEAMCITY_VERSION" in RF) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(RF.TEAMCITY_VERSION) ? 1 : 0;
    if (RF.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in RF) {
      let G = parseInt((RF.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (RF.TERM_PROGRAM) {
        case "iTerm.app":
          return G >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2
      }
    }
    if (/-256(color)?$/i.test(RF.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(RF.TERM)) return 1;
    if ("COLORTERM" in RF) return 1;
    return B
  }

  function fD5(A) {
    let Q = hD0(A, A && A.isTTY);
    return fD0(Q)
  }
  FG2.exports = {
    supportsColor: fD5,
    stdout: fD0(hD0(!0, VG2.isatty(1))),
    stderr: fD0(hD0(!0, VG2.isatty(2)))
  }
})
// @from(Ln 276980, Col 4)
zG2 = U((SMZ, EG2) => {
  var hD5 = (A, Q, B) => {
      let G = A.indexOf(Q);
      if (G === -1) return A;
      let Z = Q.length,
        Y = 0,
        J = "";
      do J += A.substr(Y, G - Y) + Q + B, Y = G + Z, G = A.indexOf(Q, Y); while (G !== -1);
      return J += A.substr(Y), J
    },
    gD5 = (A, Q, B, G) => {
      let Z = 0,
        Y = "";
      do {
        let J = A[G - 1] === "\r";
        Y += A.substr(Z, (J ? G - 1 : G) - Z) + Q + (J ? `\r
` : `
`) + B, Z = G + 1, G = A.indexOf(`
`, Z)
      } while (G !== -1);
      return Y += A.substr(Z), Y
    };
  EG2.exports = {
    stringReplaceAll: hD5,
    stringEncaseCRLFWithFirstIndex: gD5
  }
})
// @from(Ln 277007, Col 4)
NG2 = U((xMZ, qG2) => {
  var uD5 = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    $G2 = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    mD5 = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    dD5 = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
    cD5 = new Map([
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

  function UG2(A) {
    let Q = A[0] === "u",
      B = A[1] === "{";
    if (Q && !B && A.length === 5 || A[0] === "x" && A.length === 3) return String.fromCharCode(parseInt(A.slice(1), 16));
    if (Q && B) return String.fromCodePoint(parseInt(A.slice(2, -1), 16));
    return cD5.get(A) || A
  }

  function pD5(A, Q) {
    let B = [],
      G = Q.trim().split(/\s*,\s*/g),
      Z;
    for (let Y of G) {
      let J = Number(Y);
      if (!Number.isNaN(J)) B.push(J);
      else if (Z = Y.match(mD5)) B.push(Z[2].replace(dD5, (X, I, D) => I ? UG2(I) : D));
      else throw Error(`Invalid Chalk template style argument: ${Y} (in style '${A}')`)
    }
    return B
  }

  function lD5(A) {
    $G2.lastIndex = 0;
    let Q = [],
      B;
    while ((B = $G2.exec(A)) !== null) {
      let G = B[1];
      if (B[2]) {
        let Z = pD5(G, B[2]);
        Q.push([G].concat(Z))
      } else Q.push([G])
    }
    return Q
  }

  function CG2(A, Q) {
    let B = {};
    for (let Z of Q)
      for (let Y of Z.styles) B[Y[0]] = Z.inverse ? null : Y.slice(1);
    let G = A;
    for (let [Z, Y] of Object.entries(B)) {
      if (!Array.isArray(Y)) continue;
      if (!(Z in G)) throw Error(`Unknown Chalk style: ${Z}`);
      G = Y.length > 0 ? G[Z](...Y) : G[Z]
    }
    return G
  }
  qG2.exports = (A, Q) => {
    let B = [],
      G = [],
      Z = [];
    if (Q.replace(uD5, (Y, J, X, I, D, W) => {
        if (J) Z.push(UG2(J));
        else if (I) {
          let K = Z.join("");
          Z = [], G.push(B.length === 0 ? K : CG2(A, B)(K)), B.push({
            inverse: X,
            styles: lD5(I)
          })
        } else if (D) {
          if (B.length === 0) throw Error("Found extraneous } in Chalk template literal");
          G.push(CG2(A, B)(Z.join(""))), Z = [], B.pop()
        } else Z.push(W)
      }), G.push(Z.join("")), B.length > 0) {
      let Y = `Chalk template literal is missing ${B.length} closing bracket${B.length===1?"":"s"} (\`}\`)`;
      throw Error(Y)
    }
    return G.join("")
  }
})
// @from(Ln 277096, Col 4)
TG2 = U((yMZ, jG2) => {
  var byA = KG2(),
    {
      stdout: uD0,
      stderr: mD0
    } = HG2(),
    {
      stringReplaceAll: iD5,
      stringEncaseCRLFWithFirstIndex: nD5
    } = zG2(),
    {
      isArray: kY1
    } = Array,
    LG2 = ["ansi", "ansi", "ansi256", "ansi16m"],
    iVA = Object.create(null),
    aD5 = (A, Q = {}) => {
      if (Q.level && !(Number.isInteger(Q.level) && Q.level >= 0 && Q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
      let B = uD0 ? uD0.level : 0;
      A.level = Q.level === void 0 ? B : Q.level
    };
  class OG2 {
    constructor(A) {
      return MG2(A)
    }
  }
  var MG2 = (A) => {
    let Q = {};
    return aD5(Q, A), Q.template = (...B) => _G2(Q.template, ...B), Object.setPrototypeOf(Q, bY1.prototype), Object.setPrototypeOf(Q.template, Q), Q.template.constructor = () => {
      throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.")
    }, Q.template.Instance = OG2, Q.template
  };

  function bY1(A) {
    return MG2(A)
  }
  for (let [A, Q] of Object.entries(byA)) iVA[A] = {
    get() {
      let B = fY1(this, dD0(Q.open, Q.close, this._styler), this._isEmpty);
      return Object.defineProperty(this, A, {
        value: B
      }), B
    }
  };
  iVA.visible = {
    get() {
      let A = fY1(this, this._styler, !0);
      return Object.defineProperty(this, "visible", {
        value: A
      }), A
    }
  };
  var RG2 = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (let A of RG2) iVA[A] = {
    get() {
      let {
        level: Q
      } = this;
      return function (...B) {
        let G = dD0(byA.color[LG2[Q]][A](...B), byA.color.close, this._styler);
        return fY1(this, G, this._isEmpty)
      }
    }
  };
  for (let A of RG2) {
    let Q = "bg" + A[0].toUpperCase() + A.slice(1);
    iVA[Q] = {
      get() {
        let {
          level: B
        } = this;
        return function (...G) {
          let Z = dD0(byA.bgColor[LG2[B]][A](...G), byA.bgColor.close, this._styler);
          return fY1(this, Z, this._isEmpty)
        }
      }
    }
  }
  var oD5 = Object.defineProperties(() => {}, {
      ...iVA,
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
    dD0 = (A, Q, B) => {
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
    fY1 = (A, Q, B) => {
      let G = (...Z) => {
        if (kY1(Z[0]) && kY1(Z[0].raw)) return wG2(G, _G2(G, ...Z));
        return wG2(G, Z.length === 1 ? "" + Z[0] : Z.join(" "))
      };
      return Object.setPrototypeOf(G, oD5), G._generator = A, G._styler = Q, G._isEmpty = B, G
    },
    wG2 = (A, Q) => {
      if (A.level <= 0 || !Q) return A._isEmpty ? "" : Q;
      let B = A._styler;
      if (B === void 0) return Q;
      let {
        openAll: G,
        closeAll: Z
      } = B;
      if (Q.indexOf("\x1B") !== -1)
        while (B !== void 0) Q = iD5(Q, B.close, B.open), B = B.parent;
      let Y = Q.indexOf(`
`);
      if (Y !== -1) Q = nD5(Q, Z, G, Y);
      return G + Q + Z
    },
    gD0, _G2 = (A, ...Q) => {
      let [B] = Q;
      if (!kY1(B) || !kY1(B.raw)) return Q.join(" ");
      let G = Q.slice(1),
        Z = [B.raw[0]];
      for (let Y = 1; Y < B.length; Y++) Z.push(String(G[Y - 1]).replace(/[{}\\]/g, "\\$&"), String(B.raw[Y]));
      if (gD0 === void 0) gD0 = NG2();
      return gD0(A, Z.join(""))
    };
  Object.defineProperties(bY1.prototype, iVA);
  var hY1 = bY1();
  hY1.supportsColor = uD0;
  hY1.stderr = bY1({
    level: mD0 ? mD0.level : 0
  });
  hY1.stderr.supportsColor = mD0;
  jG2.exports = hY1
})
// @from(Ln 277237, Col 4)
cD0 = U((_8) => {
  var rD5 = _8 && _8.__importDefault || function (A) {
    return A && A.__esModule ? A : {
      default: A
    }
  };
  Object.defineProperty(_8, "__esModule", {
    value: !0
  });
  _8.parse = _8.stringify = _8.toJson = _8.fromJson = _8.DEFAULT_THEME = _8.plain = void 0;
  var eI = rD5(TG2()),
    sD5 = function (A) {
      return A
    };
  _8.plain = sD5;
  _8.DEFAULT_THEME = {
    keyword: eI.default.blue,
    built_in: eI.default.cyan,
    type: eI.default.cyan.dim,
    literal: eI.default.blue,
    number: eI.default.green,
    regexp: eI.default.red,
    string: eI.default.red,
    subst: _8.plain,
    symbol: _8.plain,
    class: eI.default.blue,
    function: eI.default.yellow,
    title: _8.plain,
    params: _8.plain,
    comment: eI.default.green,
    doctag: eI.default.green,
    meta: eI.default.grey,
    "meta-keyword": _8.plain,
    "meta-string": _8.plain,
    section: _8.plain,
    tag: eI.default.grey,
    name: eI.default.blue,
    "builtin-name": _8.plain,
    attr: eI.default.cyan,
    attribute: _8.plain,
    variable: _8.plain,
    bullet: _8.plain,
    code: _8.plain,
    emphasis: eI.default.italic,
    strong: eI.default.bold,
    formula: _8.plain,
    link: eI.default.underline,
    quote: _8.plain,
    "selector-tag": _8.plain,
    "selector-id": _8.plain,
    "selector-class": _8.plain,
    "selector-attr": _8.plain,
    "selector-pseudo": _8.plain,
    "template-tag": _8.plain,
    "template-variable": _8.plain,
    addition: eI.default.green,
    deletion: eI.default.red,
    default: _8.plain
  };

  function PG2(A) {
    var Q = {};
    for (var B = 0, G = Object.keys(A); B < G.length; B++) {
      var Z = G[B],
        Y = A[Z];
      if (Array.isArray(Y)) Q[Z] = Y.reduce(function (J, X) {
        return X === "plain" ? _8.plain : J[X]
      }, eI.default);
      else Q[Z] = eI.default[Y]
    }
    return Q
  }
  _8.fromJson = PG2;

  function SG2(A) {
    var Q = {};
    for (var B = 0, G = Object.keys(Q); B < G.length; B++) {
      var Z = G[B],
        Y = Q[Z];
      Q[Z] = Y._styles
    }
    return Q
  }
  _8.toJson = SG2;

  function tD5(A) {
    return JSON.stringify(SG2(A))
  }
  _8.stringify = tD5;

  function eD5(A) {
    return PG2(JSON.parse(A))
  }
  _8.parse = eD5
})
// @from(Ln 277332, Col 4)
mY1 = U((XK) => {
  var xG2 = XK && XK.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      })
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    AW5 = XK && XK.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    yG2 = XK && XK.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) xG2(Q, A, B)
      }
      return AW5(Q, A), Q
    },
    QW5 = XK && XK.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) xG2(Q, A, B)
    },
    BW5 = XK && XK.__importDefault || function (A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(XK, "__esModule", {
    value: !0
  });
  XK.supportsLanguage = XK.listLanguages = XK.highlight = void 0;
  var uY1 = yG2(MO1()),
    GW5 = yG2(r72()),
    ZW5 = BW5(YG2()),
    gY1 = cD0();

  function pD0(A, Q, B) {
    if (Q === void 0) Q = {};
    switch (A.type) {
      case "text": {
        var G = A.data;
        if (B === void 0) return (Q.default || gY1.DEFAULT_THEME.default || gY1.plain)(G);
        return G
      }
      case "tag": {
        var Z = /hljs-(\w+)/.exec(A.attribs.class);
        if (Z) {
          var Y = Z[1],
            J = A.childNodes.map(function (X) {
              return pD0(X, Q, Y)
            }).join("");
          return (Q[Y] || gY1.DEFAULT_THEME[Y] || gY1.plain)(J)
        }
        return A.childNodes.map(function (X) {
          return pD0(X, Q)
        }).join("")
      }
    }
    throw Error("Invalid node type " + A.type)
  }

  function YW5(A, Q) {
    if (Q === void 0) Q = {};
    var B = GW5.parseFragment(A, {
      treeAdapter: ZW5.default
    });
    return B.childNodes.map(function (G) {
      return pD0(G, Q)
    }).join("")
  }

  function vG2(A, Q) {
    if (Q === void 0) Q = {};
    var B;
    if (Q.language) B = uY1.highlight(A, {
      language: Q.language,
      ignoreIllegals: Q.ignoreIllegals
    }).value;
    else B = uY1.highlightAuto(A, Q.languageSubset).value;
    return YW5(B, Q.theme)
  }
  XK.highlight = vG2;

  function JW5() {
    return uY1.listLanguages()
  }
  XK.listLanguages = JW5;

  function XW5(A) {
    return !!uY1.getLanguage(A)
  }
  XK.supportsLanguage = XW5;
  XK.default = vG2;
  QW5(cD0(), XK)
})
// @from(Ln 277440, Col 0)
function lD0(A, Q) {
  if (!Sk()) return A;
  let B = Q ?? A,
    G = I1.blue(B);
  return `${kG2}${A}${bG2}${G}${kG2}${bG2}`
}
// @from(Ln 277446, Col 4)
kG2 = "\x1B]8;;"
// @from(Ln 277447, Col 2)
bG2 = "\x07"
// @from(Ln 277448, Col 4)
iD0 = w(() => {
  Z3();
  DDA()
})
// @from(Ln 277456, Col 0)
function hG2() {
  if (fG2) return;
  fG2 = !0, n7.use({
    tokenizer: {
      del() {
        return
      }
    }
  })
}