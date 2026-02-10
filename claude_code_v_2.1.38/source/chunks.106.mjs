
// @from(Ln 262937, Col 4)
mA4 = R((Hu9) => {
    var pPA = yB1(),
        dPA = ws(),
        _K = dPA.TAG_NAMES,
        iM = dPA.NAMESPACES,
        QJ6 = dPA.ATTRS,
        BA4 = {
            TEXT_HTML: "text/html",
            APPLICATION_XML: "application/xhtml+xml"
        },
        Au9 = {
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
        qu9 = {
            "xlink:actuate": {
                prefix: "xlink",
                name: "actuate",
                namespace: iM.XLINK
            },
            "xlink:arcrole": {
                prefix: "xlink",
                name: "arcrole",
                namespace: iM.XLINK
            },
            "xlink:href": {
                prefix: "xlink",
                name: "href",
                namespace: iM.XLINK
            },
            "xlink:role": {
                prefix: "xlink",
                name: "role",
                namespace: iM.XLINK
            },
            "xlink:show": {
                prefix: "xlink",
                name: "show",
                namespace: iM.XLINK
            },
            "xlink:title": {
                prefix: "xlink",
                name: "title",
                namespace: iM.XLINK
            },
            "xlink:type": {
                prefix: "xlink",
                name: "type",
                namespace: iM.XLINK
            },
            "xml:base": {
                prefix: "xml",
                name: "base",
                namespace: iM.XML
            },
            "xml:lang": {
                prefix: "xml",
                name: "lang",
                namespace: iM.XML
            },
            "xml:space": {
                prefix: "xml",
                name: "space",
                namespace: iM.XML
            },
            xmlns: {
                prefix: "",
                name: "xmlns",
                namespace: iM.XMLNS
            },
            "xmlns:xlink": {
                prefix: "xmlns",
                name: "xlink",
                namespace: iM.XMLNS
            }
        },
        Ku9 = Hu9.SVG_TAG_NAMES_ADJUSTMENT_MAP = {
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
        Yu9 = {
            [_K.B]: !0,
            [_K.BIG]: !0,
            [_K.BLOCKQUOTE]: !0,
            [_K.BODY]: !0,
            [_K.BR]: !0,
            [_K.CENTER]: !0,
            [_K.CODE]: !0,
            [_K.DD]: !0,
            [_K.DIV]: !0,
            [_K.DL]: !0,
            [_K.DT]: !0,
            [_K.EM]: !0,
            [_K.EMBED]: !0,
            [_K.H1]: !0,
            [_K.H2]: !0,
            [_K.H3]: !0,
            [_K.H4]: !0,
            [_K.H5]: !0,
            [_K.H6]: !0,
            [_K.HEAD]: !0,
            [_K.HR]: !0,
            [_K.I]: !0,
            [_K.IMG]: !0,
            [_K.LI]: !0,
            [_K.LISTING]: !0,
            [_K.MENU]: !0,
            [_K.META]: !0,
            [_K.NOBR]: !0,
            [_K.OL]: !0,
            [_K.P]: !0,
            [_K.PRE]: !0,
            [_K.RUBY]: !0,
            [_K.S]: !0,
            [_K.SMALL]: !0,
            [_K.SPAN]: !0,
            [_K.STRONG]: !0,
            [_K.STRIKE]: !0,
            [_K.SUB]: !0,
            [_K.SUP]: !0,
            [_K.TABLE]: !0,
            [_K.TT]: !0,
            [_K.U]: !0,
            [_K.UL]: !0,
            [_K.VAR]: !0
        };
    Hu9.causesExit = function(A) {
        let q = A.tagName;
        return q === _K.FONT && (pPA.getTokenAttr(A, QJ6.COLOR) !== null || pPA.getTokenAttr(A, QJ6.SIZE) !== null || pPA.getTokenAttr(A, QJ6.FACE) !== null) ? !0 : Yu9[q]
    };
    Hu9.adjustTokenMathMLAttrs = function(A) {
        for (let q = 0; q < A.attrs.length; q++)
            if (A.attrs[q].name === "definitionurl") {
                A.attrs[q].name = "definitionURL";
                break
            }
    };
    Hu9.adjustTokenSVGAttrs = function(A) {
        for (let q = 0; q < A.attrs.length; q++) {
            let K = Au9[A.attrs[q].name];
            if (K) A.attrs[q].name = K
        }
    };
    Hu9.adjustTokenXMLAttrs = function(A) {
        for (let q = 0; q < A.attrs.length; q++) {
            let K = qu9[A.attrs[q].name];
            if (K) A.attrs[q].prefix = K.prefix, A.attrs[q].name = K.name, A.attrs[q].namespace = K.namespace
        }
    };
    Hu9.adjustTokenSVGTagName = function(A) {
        let q = Ku9[A.tagName];
        if (q) A.tagName = q
    };

    function zu9(A, q) {
        return q === iM.MATHML && (A === _K.MI || A === _K.MO || A === _K.MN || A === _K.MS || A === _K.MTEXT)
    }

    function wu9(A, q, K) {
        if (q === iM.MATHML && A === _K.ANNOTATION_XML) {
            for (let Y = 0; Y < K.length; Y++)
                if (K[Y].name === QJ6.ENCODING) {
                    let z = K[Y].value.toLowerCase();
                    return z === BA4.TEXT_HTML || z === BA4.APPLICATION_XML
                }
        }
        return q === iM.SVG && (A === _K.FOREIGN_OBJECT || A === _K.DESC || A === _K.TITLE)
    }
    Hu9.isIntegrationPoint = function(A, q, K, Y) {
        if ((!Y || Y === iM.HTML) && wu9(A, q, K)) return !0;
        if ((!Y || Y === iM.MATHML) && zu9(A, q)) return !0;
        return !1
    }
})
// @from(Ln 263201, Col 4)
K84 = R((xEw, q84) => {
    var b6 = yB1(),
        ju9 = qA4(),
        FA4 = YA4(),
        Mu9 = WA4(),
        Pu9 = yA4(),
        QA4 = aB(),
        Wu9 = QPA(),
        Gu9 = gPA(),
        gA4 = UPA(),
        sB = mA4(),
        nM = uJ6(),
        Zu9 = bJ6(),
        pK1 = ws(),
        C1 = pK1.TAG_NAMES,
        n4 = pK1.NAMESPACES,
        aA4 = pK1.ATTRS,
        fu9 = {
            scriptingEnabled: !0,
            sourceCodeLocationInfo: !1,
            onParseError: null,
            treeAdapter: Wu9
        },
        Vu9 = {
            [C1.TR]: "IN_ROW_MODE",
            [C1.TBODY]: "IN_TABLE_BODY_MODE",
            [C1.THEAD]: "IN_TABLE_BODY_MODE",
            [C1.TFOOT]: "IN_TABLE_BODY_MODE",
            [C1.CAPTION]: "IN_CAPTION_MODE",
            [C1.COLGROUP]: "IN_COLUMN_GROUP_MODE",
            [C1.TABLE]: "IN_TABLE_MODE",
            [C1.BODY]: "IN_BODY_MODE",
            [C1.FRAMESET]: "IN_FRAMESET_MODE"
        },
        Nu9 = {
            [C1.CAPTION]: "IN_TABLE_MODE",
            [C1.COLGROUP]: "IN_TABLE_MODE",
            [C1.TBODY]: "IN_TABLE_MODE",
            [C1.TFOOT]: "IN_TABLE_MODE",
            [C1.THEAD]: "IN_TABLE_MODE",
            [C1.COL]: "IN_COLUMN_GROUP_MODE",
            [C1.TR]: "IN_TABLE_BODY_MODE",
            [C1.TD]: "IN_ROW_MODE",
            [C1.TH]: "IN_ROW_MODE"
        },
        UA4 = {
            ["INITIAL_MODE"]: {
                [b6.CHARACTER_TOKEN]: SB1,
                [b6.NULL_CHARACTER_TOKEN]: SB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: YY,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: Cu9,
                [b6.START_TAG_TOKEN]: SB1,
                [b6.END_TAG_TOKEN]: SB1,
                [b6.EOF_TOKEN]: SB1
            },
            ["BEFORE_HTML_MODE"]: {
                [b6.CHARACTER_TOKEN]: IB1,
                [b6.NULL_CHARACTER_TOKEN]: IB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: YY,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: Su9,
                [b6.END_TAG_TOKEN]: hu9,
                [b6.EOF_TOKEN]: IB1
            },
            ["BEFORE_HEAD_MODE"]: {
                [b6.CHARACTER_TOKEN]: xB1,
                [b6.NULL_CHARACTER_TOKEN]: xB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: YY,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: gJ6,
                [b6.START_TAG_TOKEN]: Iu9,
                [b6.END_TAG_TOKEN]: xu9,
                [b6.EOF_TOKEN]: xB1
            },
            ["IN_HEAD_MODE"]: {
                [b6.CHARACTER_TOKEN]: bB1,
                [b6.NULL_CHARACTER_TOKEN]: bB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: gJ6,
                [b6.START_TAG_TOKEN]: wj,
                [b6.END_TAG_TOKEN]: dK1,
                [b6.EOF_TOKEN]: bB1
            },
            ["IN_HEAD_NO_SCRIPT_MODE"]: {
                [b6.CHARACTER_TOKEN]: uB1,
                [b6.NULL_CHARACTER_TOKEN]: uB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: gJ6,
                [b6.START_TAG_TOKEN]: bu9,
                [b6.END_TAG_TOKEN]: uu9,
                [b6.EOF_TOKEN]: uB1
            },
            ["AFTER_HEAD_MODE"]: {
                [b6.CHARACTER_TOKEN]: BB1,
                [b6.NULL_CHARACTER_TOKEN]: BB1,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: gJ6,
                [b6.START_TAG_TOKEN]: Bu9,
                [b6.END_TAG_TOKEN]: mu9,
                [b6.EOF_TOKEN]: BB1
            },
            ["IN_BODY_MODE"]: {
                [b6.CHARACTER_TOKEN]: UJ6,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: KN,
                [b6.END_TAG_TOKEN]: cPA,
                [b6.EOF_TOKEN]: pp
            },
            ["TEXT_MODE"]: {
                [b6.CHARACTER_TOKEN]: qN,
                [b6.NULL_CHARACTER_TOKEN]: qN,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: YY,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: YY,
                [b6.END_TAG_TOKEN]: MB9,
                [b6.EOF_TOKEN]: PB9
            },
            ["IN_TABLE_MODE"]: {
                [b6.CHARACTER_TOKEN]: dp,
                [b6.NULL_CHARACTER_TOKEN]: dp,
                [b6.WHITESPACE_CHARACTER_TOKEN]: dp,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: lPA,
                [b6.END_TAG_TOKEN]: iPA,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_TABLE_TEXT_MODE"]: {
                [b6.CHARACTER_TOKEN]: kB9,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: EB9,
                [b6.COMMENT_TOKEN]: hB1,
                [b6.DOCTYPE_TOKEN]: hB1,
                [b6.START_TAG_TOKEN]: hB1,
                [b6.END_TAG_TOKEN]: hB1,
                [b6.EOF_TOKEN]: hB1
            },
            ["IN_CAPTION_MODE"]: {
                [b6.CHARACTER_TOKEN]: UJ6,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: LB9,
                [b6.END_TAG_TOKEN]: RB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_COLUMN_GROUP_MODE"]: {
                [b6.CHARACTER_TOKEN]: dJ6,
                [b6.NULL_CHARACTER_TOKEN]: dJ6,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: yB9,
                [b6.END_TAG_TOKEN]: CB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_TABLE_BODY_MODE"]: {
                [b6.CHARACTER_TOKEN]: dp,
                [b6.NULL_CHARACTER_TOKEN]: dp,
                [b6.WHITESPACE_CHARACTER_TOKEN]: dp,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: SB9,
                [b6.END_TAG_TOKEN]: hB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_ROW_MODE"]: {
                [b6.CHARACTER_TOKEN]: dp,
                [b6.NULL_CHARACTER_TOKEN]: dp,
                [b6.WHITESPACE_CHARACTER_TOKEN]: dp,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: IB9,
                [b6.END_TAG_TOKEN]: xB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_CELL_MODE"]: {
                [b6.CHARACTER_TOKEN]: UJ6,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: bB9,
                [b6.END_TAG_TOKEN]: uB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_SELECT_MODE"]: {
                [b6.CHARACTER_TOKEN]: qN,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: tA4,
                [b6.END_TAG_TOKEN]: eA4,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_SELECT_IN_TABLE_MODE"]: {
                [b6.CHARACTER_TOKEN]: qN,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: BB9,
                [b6.END_TAG_TOKEN]: mB9,
                [b6.EOF_TOKEN]: pp
            },
            ["IN_TEMPLATE_MODE"]: {
                [b6.CHARACTER_TOKEN]: UJ6,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: FB9,
                [b6.END_TAG_TOKEN]: QB9,
                [b6.EOF_TOKEN]: A84
            },
            ["AFTER_BODY_MODE"]: {
                [b6.CHARACTER_TOKEN]: cJ6,
                [b6.NULL_CHARACTER_TOKEN]: cJ6,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: yu9,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: gB9,
                [b6.END_TAG_TOKEN]: UB9,
                [b6.EOF_TOKEN]: CB1
            },
            ["IN_FRAMESET_MODE"]: {
                [b6.CHARACTER_TOKEN]: YY,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: pB9,
                [b6.END_TAG_TOKEN]: dB9,
                [b6.EOF_TOKEN]: CB1
            },
            ["AFTER_FRAMESET_MODE"]: {
                [b6.CHARACTER_TOKEN]: YY,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: qN,
                [b6.COMMENT_TOKEN]: nD,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: cB9,
                [b6.END_TAG_TOKEN]: lB9,
                [b6.EOF_TOKEN]: CB1
            },
            ["AFTER_AFTER_BODY_MODE"]: {
                [b6.CHARACTER_TOKEN]: pJ6,
                [b6.NULL_CHARACTER_TOKEN]: pJ6,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: pA4,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: iB9,
                [b6.END_TAG_TOKEN]: pJ6,
                [b6.EOF_TOKEN]: CB1
            },
            ["AFTER_AFTER_FRAMESET_MODE"]: {
                [b6.CHARACTER_TOKEN]: YY,
                [b6.NULL_CHARACTER_TOKEN]: YY,
                [b6.WHITESPACE_CHARACTER_TOKEN]: UK1,
                [b6.COMMENT_TOKEN]: pA4,
                [b6.DOCTYPE_TOKEN]: YY,
                [b6.START_TAG_TOKEN]: nB9,
                [b6.END_TAG_TOKEN]: YY,
                [b6.EOF_TOKEN]: CB1
            }
        };
    class sA4 {
        constructor(A) {
            if (this.options = Gu9(fu9, A), this.treeAdapter = this.options.treeAdapter, this.pendingScript = null, this.options.sourceCodeLocationInfo) QA4.install(this, Mu9);
            if (this.options.onParseError) QA4.install(this, Pu9, {
                onParseError: this.options.onParseError
            })
        }
        parse(A) {
            let q = this.treeAdapter.createDocument();
            return this._bootstrap(q, null), this.tokenizer.write(A, !0), this._runParsingLoop(null), q
        }
        parseFragment(A, q) {
            if (!q) q = this.treeAdapter.createElement(C1.TEMPLATE, n4.HTML, []);
            let K = this.treeAdapter.createElement("documentmock", n4.HTML, []);
            if (this._bootstrap(K, q), this.treeAdapter.getTagName(q) === C1.TEMPLATE) this._pushTmplInsertionMode("IN_TEMPLATE_MODE");
            this._initTokenizerForFragmentParsing(), this._insertFakeRootElement(), this._resetInsertionMode(), this._findFormInFragmentContext(), this.tokenizer.write(A, !0), this._runParsingLoop(null);
            let Y = this.treeAdapter.getFirstChild(K),
                z = this.treeAdapter.createDocumentFragment();
            return this._adoptNodes(Y, z), z
        }
        _bootstrap(A, q) {
            this.tokenizer = new b6(this.options), this.stopped = !1, this.insertionMode = "INITIAL_MODE", this.originalInsertionMode = "", this.document = A, this.fragmentContext = q, this.headElement = null, this.formElement = null, this.openElements = new ju9(this.document, this.treeAdapter), this.activeFormattingElements = new FA4(this.treeAdapter), this.tmplInsertionModeStack = [], this.tmplInsertionModeStackTop = -1, this.currentTmplInsertionMode = null, this.pendingCharacterTokens = [], this.hasNonWhitespacePendingCharacterToken = !1, this.framesetOk = !0, this.skipNextNewLine = !1, this.fosterParentingEnabled = !1
        }
        _err() {}
        _runParsingLoop(A) {
            while (!this.stopped) {
                this._setupTokenizerCDATAMode();
                let q = this.tokenizer.getNextToken();
                if (q.type === b6.HIBERNATION_TOKEN) break;
                if (this.skipNextNewLine) {
                    if (this.skipNextNewLine = !1, q.type === b6.WHITESPACE_CHARACTER_TOKEN && q.chars[0] === `
`) {
                        if (q.chars.length === 1) continue;
                        q.chars = q.chars.substr(1)
                    }
                }
                if (this._processInputToken(q), A && this.pendingScript) break
            }
        }
        runParsingLoopForCurrentChunk(A, q) {
            if (this._runParsingLoop(q), q && this.pendingScript) {
                let K = this.pendingScript;
                this.pendingScript = null, q(K);
                return
            }
            if (A) A()
        }
        _setupTokenizerCDATAMode() {
            let A = this._getAdjustedCurrentElement();
            this.tokenizer.allowCDATA = A && A !== this.document && this.treeAdapter.getNamespaceURI(A) !== n4.HTML && !this._isIntegrationPoint(A)
        }
        _switchToTextParsing(A, q) {
            this._insertElement(A, n4.HTML), this.tokenizer.state = q, this.originalInsertionMode = this.insertionMode, this.insertionMode = "TEXT_MODE"
        }
        switchToPlaintextParsing() {
            this.insertionMode = "TEXT_MODE", this.originalInsertionMode = "IN_BODY_MODE", this.tokenizer.state = b6.MODE.PLAINTEXT
        }
        _getAdjustedCurrentElement() {
            return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current
        }
        _findFormInFragmentContext() {
            let A = this.fragmentContext;
            do {
                if (this.treeAdapter.getTagName(A) === C1.FORM) {
                    this.formElement = A;
                    break
                }
                A = this.treeAdapter.getParentNode(A)
            } while (A)
        }
        _initTokenizerForFragmentParsing() {
            if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === n4.HTML) {
                let A = this.treeAdapter.getTagName(this.fragmentContext);
                if (A === C1.TITLE || A === C1.TEXTAREA) this.tokenizer.state = b6.MODE.RCDATA;
                else if (A === C1.STYLE || A === C1.XMP || A === C1.IFRAME || A === C1.NOEMBED || A === C1.NOFRAMES || A === C1.NOSCRIPT) this.tokenizer.state = b6.MODE.RAWTEXT;
                else if (A === C1.SCRIPT) this.tokenizer.state = b6.MODE.SCRIPT_DATA;
                else if (A === C1.PLAINTEXT) this.tokenizer.state = b6.MODE.PLAINTEXT
            }
        }
        _setDocumentType(A) {
            let q = A.name || "",
                K = A.publicId || "",
                Y = A.systemId || "";
            this.treeAdapter.setDocumentType(this.document, q, K, Y)
        }
        _attachElementToTree(A) {
            if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(A);
            else {
                let q = this.openElements.currentTmplContent || this.openElements.current;
                this.treeAdapter.appendChild(q, A)
            }
        }
        _appendElement(A, q) {
            let K = this.treeAdapter.createElement(A.tagName, q, A.attrs);
            this._attachElementToTree(K)
        }
        _insertElement(A, q) {
            let K = this.treeAdapter.createElement(A.tagName, q, A.attrs);
            this._attachElementToTree(K), this.openElements.push(K)
        }
        _insertFakeElement(A) {
            let q = this.treeAdapter.createElement(A, n4.HTML, []);
            this._attachElementToTree(q), this.openElements.push(q)
        }
        _insertTemplate(A) {
            let q = this.treeAdapter.createElement(A.tagName, n4.HTML, A.attrs),
                K = this.treeAdapter.createDocumentFragment();
            this.treeAdapter.setTemplateContent(q, K), this._attachElementToTree(q), this.openElements.push(q)
        }
        _insertFakeRootElement() {
            let A = this.treeAdapter.createElement(C1.HTML, n4.HTML, []);
            this.treeAdapter.appendChild(this.openElements.current, A), this.openElements.push(A)
        }
        _appendCommentNode(A, q) {
            let K = this.treeAdapter.createCommentNode(A.data);
            this.treeAdapter.appendChild(q, K)
        }
        _insertCharacters(A) {
            if (this._shouldFosterParentOnInsertion()) this._fosterParentText(A.chars);
            else {
                let q = this.openElements.currentTmplContent || this.openElements.current;
                this.treeAdapter.insertText(q, A.chars)
            }
        }
        _adoptNodes(A, q) {
            for (let K = this.treeAdapter.getFirstChild(A); K; K = this.treeAdapter.getFirstChild(A)) this.treeAdapter.detachNode(K), this.treeAdapter.appendChild(q, K)
        }
        _shouldProcessTokenInForeignContent(A) {
            let q = this._getAdjustedCurrentElement();
            if (!q || q === this.document) return !1;
            let K = this.treeAdapter.getNamespaceURI(q);
            if (K === n4.HTML) return !1;
            if (this.treeAdapter.getTagName(q) === C1.ANNOTATION_XML && K === n4.MATHML && A.type === b6.START_TAG_TOKEN && A.tagName === C1.SVG) return !1;
            let Y = A.type === b6.CHARACTER_TOKEN || A.type === b6.NULL_CHARACTER_TOKEN || A.type === b6.WHITESPACE_CHARACTER_TOKEN;
            if ((A.type === b6.START_TAG_TOKEN && A.tagName !== C1.MGLYPH && A.tagName !== C1.MALIGNMARK || Y) && this._isIntegrationPoint(q, n4.MATHML)) return !1;
            if ((A.type === b6.START_TAG_TOKEN || Y) && this._isIntegrationPoint(q, n4.HTML)) return !1;
            return A.type !== b6.EOF_TOKEN
        }
        _processToken(A) {
            UA4[this.insertionMode][A.type](this, A)
        }
        _processTokenInBodyMode(A) {
            UA4.IN_BODY_MODE[A.type](this, A)
        }
        _processTokenInForeignContent(A) {
            if (A.type === b6.CHARACTER_TOKEN) oB9(this, A);
            else if (A.type === b6.NULL_CHARACTER_TOKEN) rB9(this, A);
            else if (A.type === b6.WHITESPACE_CHARACTER_TOKEN) qN(this, A);
            else if (A.type === b6.COMMENT_TOKEN) nD(this, A);
            else if (A.type === b6.START_TAG_TOKEN) aB9(this, A);
            else if (A.type === b6.END_TAG_TOKEN) sB9(this, A)
        }
        _processInputToken(A) {
            if (this._shouldProcessTokenInForeignContent(A)) this._processTokenInForeignContent(A);
            else this._processToken(A);
            if (A.type === b6.START_TAG_TOKEN && A.selfClosing && !A.ackSelfClosing) this._err(nM.nonVoidHtmlElementStartTagWithTrailingSolidus)
        }
        _isIntegrationPoint(A, q) {
            let K = this.treeAdapter.getTagName(A),
                Y = this.treeAdapter.getNamespaceURI(A),
                z = this.treeAdapter.getAttrList(A);
            return sB.isIntegrationPoint(K, Y, z, q)
        }
        _reconstructActiveFormattingElements() {
            let A = this.activeFormattingElements.length;
            if (A) {
                let q = A,
                    K = null;
                do
                    if (q--, K = this.activeFormattingElements.entries[q], K.type === FA4.MARKER_ENTRY || this.openElements.contains(K.element)) {
                        q++;
                        break
                    } while (q > 0);
                for (let Y = q; Y < A; Y++) K = this.activeFormattingElements.entries[Y], this._insertElement(K.token, this.treeAdapter.getNamespaceURI(K.element)), K.element = this.openElements.current
            }
        }
        _closeTableCell() {
            this.openElements.generateImpliedEndTags(), this.openElements.popUntilTableCellPopped(), this.activeFormattingElements.clearToLastMarker(), this.insertionMode = "IN_ROW_MODE"
        }
        _closePElement() {
            this.openElements.generateImpliedEndTagsWithExclusion(C1.P), this.openElements.popUntilTagNamePopped(C1.P)
        }
        _resetInsertionMode() {
            for (let A = this.openElements.stackTop, q = !1; A >= 0; A--) {
                let K = this.openElements.items[A];
                if (A === 0) {
                    if (q = !0, this.fragmentContext) K = this.fragmentContext
                }
                let Y = this.treeAdapter.getTagName(K),
                    z = Vu9[Y];
                if (z) {
                    this.insertionMode = z;
                    break
                } else if (!q && (Y === C1.TD || Y === C1.TH)) {
                    this.insertionMode = "IN_CELL_MODE";
                    break
                } else if (!q && Y === C1.HEAD) {
                    this.insertionMode = "IN_HEAD_MODE";
                    break
                } else if (Y === C1.SELECT) {
                    this._resetInsertionModeForSelect(A);
                    break
                } else if (Y === C1.TEMPLATE) {
                    this.insertionMode = this.currentTmplInsertionMode;
                    break
                } else if (Y === C1.HTML) {
                    this.insertionMode = this.headElement ? "AFTER_HEAD_MODE" : "BEFORE_HEAD_MODE";
                    break
                } else if (q) {
                    this.insertionMode = "IN_BODY_MODE";
                    break
                }
            }
        }
        _resetInsertionModeForSelect(A) {
            if (A > 0)
                for (let q = A - 1; q > 0; q--) {
                    let K = this.openElements.items[q],
                        Y = this.treeAdapter.getTagName(K);
                    if (Y === C1.TEMPLATE) break;
                    else if (Y === C1.TABLE) {
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
            let q = this.treeAdapter.getTagName(A);
            return q === C1.TABLE || q === C1.TBODY || q === C1.TFOOT || q === C1.THEAD || q === C1.TR
        }
        _shouldFosterParentOnInsertion() {
            return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.current)
        }
        _findFosterParentingLocation() {
            let A = {
                parent: null,
                beforeElement: null
            };
            for (let q = this.openElements.stackTop; q >= 0; q--) {
                let K = this.openElements.items[q],
                    Y = this.treeAdapter.getTagName(K),
                    z = this.treeAdapter.getNamespaceURI(K);
                if (Y === C1.TEMPLATE && z === n4.HTML) {
                    A.parent = this.treeAdapter.getTemplateContent(K);
                    break
                } else if (Y === C1.TABLE) {
                    if (A.parent = this.treeAdapter.getParentNode(K), A.parent) A.beforeElement = K;
                    else A.parent = this.openElements.items[q - 1];
                    break
                }
            }
            if (!A.parent) A.parent = this.openElements.items[0];
            return A
        }
        _fosterParentElement(A) {
            let q = this._findFosterParentingLocation();
            if (q.beforeElement) this.treeAdapter.insertBefore(q.parent, A, q.beforeElement);
            else this.treeAdapter.appendChild(q.parent, A)
        }
        _fosterParentText(A) {
            let q = this._findFosterParentingLocation();
            if (q.beforeElement) this.treeAdapter.insertTextBefore(q.parent, A, q.beforeElement);
            else this.treeAdapter.insertText(q.parent, A)
        }
        _isSpecialElement(A) {
            let q = this.treeAdapter.getTagName(A),
                K = this.treeAdapter.getNamespaceURI(A);
            return pK1.SPECIAL_ELEMENTS[K][q]
        }
    }
    q84.exports = sA4;

    function Tu9(A, q) {
        let K = A.activeFormattingElements.getElementEntryInScopeWithTagName(q.tagName);
        if (K) {
            if (!A.openElements.contains(K.element)) A.activeFormattingElements.removeEntry(K), K = null;
            else if (!A.openElements.hasInScope(q.tagName)) K = null
        } else bh(A, q);
        return K
    }

    function vu9(A, q) {
        let K = null;
        for (let Y = A.openElements.stackTop; Y >= 0; Y--) {
            let z = A.openElements.items[Y];
            if (z === q.element) break;
            if (A._isSpecialElement(z)) K = z
        }
        if (!K) A.openElements.popUntilElementPopped(q.element), A.activeFormattingElements.removeEntry(q);
        return K
    }

    function Eu9(A, q, K) {
        let Y = q,
            z = A.openElements.getCommonAncestor(q);
        for (let w = 0, H = z; H !== K; w++, H = z) {
            z = A.openElements.getCommonAncestor(H);
            let $ = A.activeFormattingElements.getElementEntry(H),
                O = $ && w >= 3;
            if (!$ || O) {
                if (O) A.activeFormattingElements.removeEntry($);
                A.openElements.remove(H)
            } else {
                if (H = ku9(A, $), Y === q) A.activeFormattingElements.bookmark = $;
                A.treeAdapter.detachNode(Y), A.treeAdapter.appendChild(H, Y), Y = H
            }
        }
        return Y
    }

    function ku9(A, q) {
        let K = A.treeAdapter.getNamespaceURI(q.element),
            Y = A.treeAdapter.createElement(q.token.tagName, K, q.token.attrs);
        return A.openElements.replace(q.element, Y), q.element = Y, Y
    }

    function Lu9(A, q, K) {
        if (A._isElementCausesFosterParenting(q)) A._fosterParentElement(K);
        else {
            let Y = A.treeAdapter.getTagName(q),
                z = A.treeAdapter.getNamespaceURI(q);
            if (Y === C1.TEMPLATE && z === n4.HTML) q = A.treeAdapter.getTemplateContent(q);
            A.treeAdapter.appendChild(q, K)
        }
    }

    function Ru9(A, q, K) {
        let Y = A.treeAdapter.getNamespaceURI(K.element),
            z = K.token,
            w = A.treeAdapter.createElement(z.tagName, Y, z.attrs);
        A._adoptNodes(q, w), A.treeAdapter.appendChild(q, w), A.activeFormattingElements.insertElementAfterBookmark(w, K.token), A.activeFormattingElements.removeEntry(K), A.openElements.remove(K.element), A.openElements.insertAfter(q, w)
    }

    function $s(A, q) {
        let K;
        for (let Y = 0; Y < 8; Y++) {
            if (K = Tu9(A, q, K), !K) break;
            let z = vu9(A, K);
            if (!z) break;
            A.activeFormattingElements.bookmark = K;
            let w = Eu9(A, z, K.element),
                H = A.openElements.getCommonAncestor(K.element);
            A.treeAdapter.detachNode(w), Lu9(A, H, w), Ru9(A, z, K)
        }
    }

    function YY() {}

    function gJ6(A) {
        A._err(nM.misplacedDoctype)
    }

    function nD(A, q) {
        A._appendCommentNode(q, A.openElements.currentTmplContent || A.openElements.current)
    }

    function yu9(A, q) {
        A._appendCommentNode(q, A.openElements.items[0])
    }

    function pA4(A, q) {
        A._appendCommentNode(q, A.document)
    }

    function qN(A, q) {
        A._insertCharacters(q)
    }

    function CB1(A) {
        A.stopped = !0
    }

    function Cu9(A, q) {
        A._setDocumentType(q);
        let K = q.forceQuirks ? pK1.DOCUMENT_MODE.QUIRKS : gA4.getDocumentMode(q);
        if (!gA4.isConforming(q)) A._err(nM.nonConformingDoctype);
        A.treeAdapter.setDocumentMode(A.document, K), A.insertionMode = "BEFORE_HTML_MODE"
    }

    function SB1(A, q) {
        A._err(nM.missingDoctype, {
            beforeToken: !0
        }), A.treeAdapter.setDocumentMode(A.document, pK1.DOCUMENT_MODE.QUIRKS), A.insertionMode = "BEFORE_HTML_MODE", A._processToken(q)
    }

    function Su9(A, q) {
        if (q.tagName === C1.HTML) A._insertElement(q, n4.HTML), A.insertionMode = "BEFORE_HEAD_MODE";
        else IB1(A, q)
    }

    function hu9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML || K === C1.HEAD || K === C1.BODY || K === C1.BR) IB1(A, q)
    }

    function IB1(A, q) {
        A._insertFakeRootElement(), A.insertionMode = "BEFORE_HEAD_MODE", A._processToken(q)
    }

    function Iu9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.HEAD) A._insertElement(q, n4.HTML), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE";
        else xB1(A, q)
    }

    function xu9(A, q) {
        let K = q.tagName;
        if (K === C1.HEAD || K === C1.BODY || K === C1.HTML || K === C1.BR) xB1(A, q);
        else A._err(nM.endTagWithoutMatchingOpenElement)
    }

    function xB1(A, q) {
        A._insertFakeElement(C1.HEAD), A.headElement = A.openElements.current, A.insertionMode = "IN_HEAD_MODE", A._processToken(q)
    }

    function wj(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.BASE || K === C1.BASEFONT || K === C1.BGSOUND || K === C1.LINK || K === C1.META) A._appendElement(q, n4.HTML), q.ackSelfClosing = !0;
        else if (K === C1.TITLE) A._switchToTextParsing(q, b6.MODE.RCDATA);
        else if (K === C1.NOSCRIPT)
            if (A.options.scriptingEnabled) A._switchToTextParsing(q, b6.MODE.RAWTEXT);
            else A._insertElement(q, n4.HTML), A.insertionMode = "IN_HEAD_NO_SCRIPT_MODE";
        else if (K === C1.NOFRAMES || K === C1.STYLE) A._switchToTextParsing(q, b6.MODE.RAWTEXT);
        else if (K === C1.SCRIPT) A._switchToTextParsing(q, b6.MODE.SCRIPT_DATA);
        else if (K === C1.TEMPLATE) A._insertTemplate(q, n4.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1, A.insertionMode = "IN_TEMPLATE_MODE", A._pushTmplInsertionMode("IN_TEMPLATE_MODE");
        else if (K === C1.HEAD) A._err(nM.misplacedStartTagForHeadElement);
        else bB1(A, q)
    }

    function dK1(A, q) {
        let K = q.tagName;
        if (K === C1.HEAD) A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE";
        else if (K === C1.BODY || K === C1.BR || K === C1.HTML) bB1(A, q);
        else if (K === C1.TEMPLATE)
            if (A.openElements.tmplCount > 0) {
                if (A.openElements.generateImpliedEndTagsThoroughly(), A.openElements.currentTagName !== C1.TEMPLATE) A._err(nM.closingOfElementWithOpenChildElements);
                A.openElements.popUntilTagNamePopped(C1.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode()
            } else A._err(nM.endTagWithoutMatchingOpenElement);
        else A._err(nM.endTagWithoutMatchingOpenElement)
    }

    function bB1(A, q) {
        A.openElements.pop(), A.insertionMode = "AFTER_HEAD_MODE", A._processToken(q)
    }

    function bu9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.BASEFONT || K === C1.BGSOUND || K === C1.HEAD || K === C1.LINK || K === C1.META || K === C1.NOFRAMES || K === C1.STYLE) wj(A, q);
        else if (K === C1.NOSCRIPT) A._err(nM.nestedNoscriptInHead);
        else uB1(A, q)
    }

    function uu9(A, q) {
        let K = q.tagName;
        if (K === C1.NOSCRIPT) A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE";
        else if (K === C1.BR) uB1(A, q);
        else A._err(nM.endTagWithoutMatchingOpenElement)
    }

    function uB1(A, q) {
        let K = q.type === b6.EOF_TOKEN ? nM.openElementsLeftAfterEof : nM.disallowedContentInNoscriptInHead;
        A._err(K), A.openElements.pop(), A.insertionMode = "IN_HEAD_MODE", A._processToken(q)
    }

    function Bu9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.BODY) A._insertElement(q, n4.HTML), A.framesetOk = !1, A.insertionMode = "IN_BODY_MODE";
        else if (K === C1.FRAMESET) A._insertElement(q, n4.HTML), A.insertionMode = "IN_FRAMESET_MODE";
        else if (K === C1.BASE || K === C1.BASEFONT || K === C1.BGSOUND || K === C1.LINK || K === C1.META || K === C1.NOFRAMES || K === C1.SCRIPT || K === C1.STYLE || K === C1.TEMPLATE || K === C1.TITLE) A._err(nM.abandonedHeadElementChild), A.openElements.push(A.headElement), wj(A, q), A.openElements.remove(A.headElement);
        else if (K === C1.HEAD) A._err(nM.misplacedStartTagForHeadElement);
        else BB1(A, q)
    }

    function mu9(A, q) {
        let K = q.tagName;
        if (K === C1.BODY || K === C1.HTML || K === C1.BR) BB1(A, q);
        else if (K === C1.TEMPLATE) dK1(A, q);
        else A._err(nM.endTagWithoutMatchingOpenElement)
    }

    function BB1(A, q) {
        A._insertFakeElement(C1.BODY), A.insertionMode = "IN_BODY_MODE", A._processToken(q)
    }

    function UK1(A, q) {
        A._reconstructActiveFormattingElements(), A._insertCharacters(q)
    }

    function UJ6(A, q) {
        A._reconstructActiveFormattingElements(), A._insertCharacters(q), A.framesetOk = !1
    }

    function Fu9(A, q) {
        if (A.openElements.tmplCount === 0) A.treeAdapter.adoptAttributes(A.openElements.items[0], q.attrs)
    }

    function Qu9(A, q) {
        let K = A.openElements.tryPeekProperlyNestedBodyElement();
        if (K && A.openElements.tmplCount === 0) A.framesetOk = !1, A.treeAdapter.adoptAttributes(K, q.attrs)
    }

    function gu9(A, q) {
        let K = A.openElements.tryPeekProperlyNestedBodyElement();
        if (A.framesetOk && K) A.treeAdapter.detachNode(K), A.openElements.popAllUpToHtmlElement(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_FRAMESET_MODE"
    }

    function Up(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML)
    }

    function Uu9(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        let K = A.openElements.currentTagName;
        if (K === C1.H1 || K === C1.H2 || K === C1.H3 || K === C1.H4 || K === C1.H5 || K === C1.H6) A.openElements.pop();
        A._insertElement(q, n4.HTML)
    }

    function dA4(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML), A.skipNextNewLine = !0, A.framesetOk = !1
    }

    function pu9(A, q) {
        let K = A.openElements.tmplCount > 0;
        if (!A.formElement || K) {
            if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
            if (A._insertElement(q, n4.HTML), !K) A.formElement = A.openElements.current
        }
    }

    function du9(A, q) {
        A.framesetOk = !1;
        let K = q.tagName;
        for (let Y = A.openElements.stackTop; Y >= 0; Y--) {
            let z = A.openElements.items[Y],
                w = A.treeAdapter.getTagName(z),
                H = null;
            if (K === C1.LI && w === C1.LI) H = C1.LI;
            else if ((K === C1.DD || K === C1.DT) && (w === C1.DD || w === C1.DT)) H = w;
            if (H) {
                A.openElements.generateImpliedEndTagsWithExclusion(H), A.openElements.popUntilTagNamePopped(H);
                break
            }
            if (w !== C1.ADDRESS && w !== C1.DIV && w !== C1.P && A._isSpecialElement(z)) break
        }
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML)
    }

    function cu9(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML), A.tokenizer.state = b6.MODE.PLAINTEXT
    }

    function lu9(A, q) {
        if (A.openElements.hasInScope(C1.BUTTON)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(C1.BUTTON);
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML), A.framesetOk = !1
    }

    function iu9(A, q) {
        let K = A.activeFormattingElements.getElementEntryInScopeWithTagName(C1.A);
        if (K) $s(A, q), A.openElements.remove(K.element), A.activeFormattingElements.removeEntry(K);
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML), A.activeFormattingElements.pushElement(A.openElements.current, q)
    }

    function YM1(A, q) {
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML), A.activeFormattingElements.pushElement(A.openElements.current, q)
    }

    function nu9(A, q) {
        if (A._reconstructActiveFormattingElements(), A.openElements.hasInScope(C1.NOBR)) $s(A, q), A._reconstructActiveFormattingElements();
        A._insertElement(q, n4.HTML), A.activeFormattingElements.pushElement(A.openElements.current, q)
    }

    function cA4(A, q) {
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML), A.activeFormattingElements.insertMarker(), A.framesetOk = !1
    }

    function ru9(A, q) {
        if (A.treeAdapter.getDocumentMode(A.document) !== pK1.DOCUMENT_MODE.QUIRKS && A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML), A.framesetOk = !1, A.insertionMode = "IN_TABLE_MODE"
    }

    function zM1(A, q) {
        A._reconstructActiveFormattingElements(), A._appendElement(q, n4.HTML), A.framesetOk = !1, q.ackSelfClosing = !0
    }

    function ou9(A, q) {
        A._reconstructActiveFormattingElements(), A._appendElement(q, n4.HTML);
        let K = b6.getTokenAttr(q, aA4.TYPE);
        if (!K || K.toLowerCase() !== "hidden") A.framesetOk = !1;
        q.ackSelfClosing = !0
    }

    function lA4(A, q) {
        A._appendElement(q, n4.HTML), q.ackSelfClosing = !0
    }

    function au9(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._appendElement(q, n4.HTML), A.framesetOk = !1, A.ackSelfClosing = !0
    }

    function su9(A, q) {
        q.tagName = C1.IMG, zM1(A, q)
    }

    function tu9(A, q) {
        A._insertElement(q, n4.HTML), A.skipNextNewLine = !0, A.tokenizer.state = b6.MODE.RCDATA, A.originalInsertionMode = A.insertionMode, A.framesetOk = !1, A.insertionMode = "TEXT_MODE"
    }

    function eu9(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._reconstructActiveFormattingElements(), A.framesetOk = !1, A._switchToTextParsing(q, b6.MODE.RAWTEXT)
    }

    function AB9(A, q) {
        A.framesetOk = !1, A._switchToTextParsing(q, b6.MODE.RAWTEXT)
    }

    function iA4(A, q) {
        A._switchToTextParsing(q, b6.MODE.RAWTEXT)
    }

    function qB9(A, q) {
        if (A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML), A.framesetOk = !1, A.insertionMode === "IN_TABLE_MODE" || A.insertionMode === "IN_CAPTION_MODE" || A.insertionMode === "IN_TABLE_BODY_MODE" || A.insertionMode === "IN_ROW_MODE" || A.insertionMode === "IN_CELL_MODE") A.insertionMode = "IN_SELECT_IN_TABLE_MODE";
        else A.insertionMode = "IN_SELECT_MODE"
    }

    function nA4(A, q) {
        if (A.openElements.currentTagName === C1.OPTION) A.openElements.pop();
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML)
    }

    function rA4(A, q) {
        if (A.openElements.hasInScope(C1.RUBY)) A.openElements.generateImpliedEndTags();
        A._insertElement(q, n4.HTML)
    }

    function KB9(A, q) {
        if (A.openElements.hasInScope(C1.RUBY)) A.openElements.generateImpliedEndTagsWithExclusion(C1.RTC);
        A._insertElement(q, n4.HTML)
    }

    function YB9(A, q) {
        if (A.openElements.hasInButtonScope(C1.P)) A._closePElement();
        A._insertElement(q, n4.HTML)
    }

    function zB9(A, q) {
        if (A._reconstructActiveFormattingElements(), sB.adjustTokenMathMLAttrs(q), sB.adjustTokenXMLAttrs(q), q.selfClosing) A._appendElement(q, n4.MATHML);
        else A._insertElement(q, n4.MATHML);
        q.ackSelfClosing = !0
    }

    function wB9(A, q) {
        if (A._reconstructActiveFormattingElements(), sB.adjustTokenSVGAttrs(q), sB.adjustTokenXMLAttrs(q), q.selfClosing) A._appendElement(q, n4.SVG);
        else A._insertElement(q, n4.SVG);
        q.ackSelfClosing = !0
    }

    function ER(A, q) {
        A._reconstructActiveFormattingElements(), A._insertElement(q, n4.HTML)
    }

    function KN(A, q) {
        let K = q.tagName;
        switch (K.length) {
            case 1:
                if (K === C1.I || K === C1.S || K === C1.B || K === C1.U) YM1(A, q);
                else if (K === C1.P) Up(A, q);
                else if (K === C1.A) iu9(A, q);
                else ER(A, q);
                break;
            case 2:
                if (K === C1.DL || K === C1.OL || K === C1.UL) Up(A, q);
                else if (K === C1.H1 || K === C1.H2 || K === C1.H3 || K === C1.H4 || K === C1.H5 || K === C1.H6) Uu9(A, q);
                else if (K === C1.LI || K === C1.DD || K === C1.DT) du9(A, q);
                else if (K === C1.EM || K === C1.TT) YM1(A, q);
                else if (K === C1.BR) zM1(A, q);
                else if (K === C1.HR) au9(A, q);
                else if (K === C1.RB) rA4(A, q);
                else if (K === C1.RT || K === C1.RP) KB9(A, q);
                else if (K !== C1.TH && K !== C1.TD && K !== C1.TR) ER(A, q);
                break;
            case 3:
                if (K === C1.DIV || K === C1.DIR || K === C1.NAV) Up(A, q);
                else if (K === C1.PRE) dA4(A, q);
                else if (K === C1.BIG) YM1(A, q);
                else if (K === C1.IMG || K === C1.WBR) zM1(A, q);
                else if (K === C1.XMP) eu9(A, q);
                else if (K === C1.SVG) wB9(A, q);
                else if (K === C1.RTC) rA4(A, q);
                else if (K !== C1.COL) ER(A, q);
                break;
            case 4:
                if (K === C1.HTML) Fu9(A, q);
                else if (K === C1.BASE || K === C1.LINK || K === C1.META) wj(A, q);
                else if (K === C1.BODY) Qu9(A, q);
                else if (K === C1.MAIN || K === C1.MENU) Up(A, q);
                else if (K === C1.FORM) pu9(A, q);
                else if (K === C1.CODE || K === C1.FONT) YM1(A, q);
                else if (K === C1.NOBR) nu9(A, q);
                else if (K === C1.AREA) zM1(A, q);
                else if (K === C1.MATH) zB9(A, q);
                else if (K === C1.MENU) YB9(A, q);
                else if (K !== C1.HEAD) ER(A, q);
                break;
            case 5:
                if (K === C1.STYLE || K === C1.TITLE) wj(A, q);
                else if (K === C1.ASIDE) Up(A, q);
                else if (K === C1.SMALL) YM1(A, q);
                else if (K === C1.TABLE) ru9(A, q);
                else if (K === C1.EMBED) zM1(A, q);
                else if (K === C1.INPUT) ou9(A, q);
                else if (K === C1.PARAM || K === C1.TRACK) lA4(A, q);
                else if (K === C1.IMAGE) su9(A, q);
                else if (K !== C1.FRAME && K !== C1.TBODY && K !== C1.TFOOT && K !== C1.THEAD) ER(A, q);
                break;
            case 6:
                if (K === C1.SCRIPT) wj(A, q);
                else if (K === C1.CENTER || K === C1.FIGURE || K === C1.FOOTER || K === C1.HEADER || K === C1.HGROUP || K === C1.DIALOG) Up(A, q);
                else if (K === C1.BUTTON) lu9(A, q);
                else if (K === C1.STRIKE || K === C1.STRONG) YM1(A, q);
                else if (K === C1.APPLET || K === C1.OBJECT) cA4(A, q);
                else if (K === C1.KEYGEN) zM1(A, q);
                else if (K === C1.SOURCE) lA4(A, q);
                else if (K === C1.IFRAME) AB9(A, q);
                else if (K === C1.SELECT) qB9(A, q);
                else if (K === C1.OPTION) nA4(A, q);
                else ER(A, q);
                break;
            case 7:
                if (K === C1.BGSOUND) wj(A, q);
                else if (K === C1.DETAILS || K === C1.ADDRESS || K === C1.ARTICLE || K === C1.SECTION || K === C1.SUMMARY) Up(A, q);
                else if (K === C1.LISTING) dA4(A, q);
                else if (K === C1.MARQUEE) cA4(A, q);
                else if (K === C1.NOEMBED) iA4(A, q);
                else if (K !== C1.CAPTION) ER(A, q);
                break;
            case 8:
                if (K === C1.BASEFONT) wj(A, q);
                else if (K === C1.FRAMESET) gu9(A, q);
                else if (K === C1.FIELDSET) Up(A, q);
                else if (K === C1.TEXTAREA) tu9(A, q);
                else if (K === C1.TEMPLATE) wj(A, q);
                else if (K === C1.NOSCRIPT)
                    if (A.options.scriptingEnabled) iA4(A, q);
                    else ER(A, q);
                else if (K === C1.OPTGROUP) nA4(A, q);
                else if (K !== C1.COLGROUP) ER(A, q);
                break;
            case 9:
                if (K === C1.PLAINTEXT) cu9(A, q);
                else ER(A, q);
                break;
            case 10:
                if (K === C1.BLOCKQUOTE || K === C1.FIGCAPTION) Up(A, q);
                else ER(A, q);
                break;
            default:
                ER(A, q)
        }
    }

    function HB9(A) {
        if (A.openElements.hasInScope(C1.BODY)) A.insertionMode = "AFTER_BODY_MODE"
    }

    function $B9(A, q) {
        if (A.openElements.hasInScope(C1.BODY)) A.insertionMode = "AFTER_BODY_MODE", A._processToken(q)
    }

    function Hs(A, q) {
        let K = q.tagName;
        if (A.openElements.hasInScope(K)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(K)
    }

    function OB9(A) {
        let q = A.openElements.tmplCount > 0,
            K = A.formElement;
        if (!q) A.formElement = null;
        if ((K || q) && A.openElements.hasInScope(C1.FORM))
            if (A.openElements.generateImpliedEndTags(), q) A.openElements.popUntilTagNamePopped(C1.FORM);
            else A.openElements.remove(K)
    }

    function _B9(A) {
        if (!A.openElements.hasInButtonScope(C1.P)) A._insertFakeElement(C1.P);
        A._closePElement()
    }

    function JB9(A) {
        if (A.openElements.hasInListItemScope(C1.LI)) A.openElements.generateImpliedEndTagsWithExclusion(C1.LI), A.openElements.popUntilTagNamePopped(C1.LI)
    }

    function XB9(A, q) {
        let K = q.tagName;
        if (A.openElements.hasInScope(K)) A.openElements.generateImpliedEndTagsWithExclusion(K), A.openElements.popUntilTagNamePopped(K)
    }

    function DB9(A) {
        if (A.openElements.hasNumberedHeaderInScope()) A.openElements.generateImpliedEndTags(), A.openElements.popUntilNumberedHeaderPopped()
    }

    function oA4(A, q) {
        let K = q.tagName;
        if (A.openElements.hasInScope(K)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(K), A.activeFormattingElements.clearToLastMarker()
    }

    function jB9(A) {
        A._reconstructActiveFormattingElements(), A._insertFakeElement(C1.BR), A.openElements.pop(), A.framesetOk = !1
    }

    function bh(A, q) {
        let K = q.tagName;
        for (let Y = A.openElements.stackTop; Y > 0; Y--) {
            let z = A.openElements.items[Y];
            if (A.treeAdapter.getTagName(z) === K) {
                A.openElements.generateImpliedEndTagsWithExclusion(K), A.openElements.popUntilElementPopped(z);
                break
            }
            if (A._isSpecialElement(z)) break
        }
    }

    function cPA(A, q) {
        let K = q.tagName;
        switch (K.length) {
            case 1:
                if (K === C1.A || K === C1.B || K === C1.I || K === C1.S || K === C1.U) $s(A, q);
                else if (K === C1.P) _B9(A, q);
                else bh(A, q);
                break;
            case 2:
                if (K === C1.DL || K === C1.UL || K === C1.OL) Hs(A, q);
                else if (K === C1.LI) JB9(A, q);
                else if (K === C1.DD || K === C1.DT) XB9(A, q);
                else if (K === C1.H1 || K === C1.H2 || K === C1.H3 || K === C1.H4 || K === C1.H5 || K === C1.H6) DB9(A, q);
                else if (K === C1.BR) jB9(A, q);
                else if (K === C1.EM || K === C1.TT) $s(A, q);
                else bh(A, q);
                break;
            case 3:
                if (K === C1.BIG) $s(A, q);
                else if (K === C1.DIR || K === C1.DIV || K === C1.NAV || K === C1.PRE) Hs(A, q);
                else bh(A, q);
                break;
            case 4:
                if (K === C1.BODY) HB9(A, q);
                else if (K === C1.HTML) $B9(A, q);
                else if (K === C1.FORM) OB9(A, q);
                else if (K === C1.CODE || K === C1.FONT || K === C1.NOBR) $s(A, q);
                else if (K === C1.MAIN || K === C1.MENU) Hs(A, q);
                else bh(A, q);
                break;
            case 5:
                if (K === C1.ASIDE) Hs(A, q);
                else if (K === C1.SMALL) $s(A, q);
                else bh(A, q);
                break;
            case 6:
                if (K === C1.CENTER || K === C1.FIGURE || K === C1.FOOTER || K === C1.HEADER || K === C1.HGROUP || K === C1.DIALOG) Hs(A, q);
                else if (K === C1.APPLET || K === C1.OBJECT) oA4(A, q);
                else if (K === C1.STRIKE || K === C1.STRONG) $s(A, q);
                else bh(A, q);
                break;
            case 7:
                if (K === C1.ADDRESS || K === C1.ARTICLE || K === C1.DETAILS || K === C1.SECTION || K === C1.SUMMARY || K === C1.LISTING) Hs(A, q);
                else if (K === C1.MARQUEE) oA4(A, q);
                else bh(A, q);
                break;
            case 8:
                if (K === C1.FIELDSET) Hs(A, q);
                else if (K === C1.TEMPLATE) dK1(A, q);
                else bh(A, q);
                break;
            case 10:
                if (K === C1.BLOCKQUOTE || K === C1.FIGCAPTION) Hs(A, q);
                else bh(A, q);
                break;
            default:
                bh(A, q)
        }
    }

    function pp(A, q) {
        if (A.tmplInsertionModeStackTop > -1) A84(A, q);
        else A.stopped = !0
    }

    function MB9(A, q) {
        if (q.tagName === C1.SCRIPT) A.pendingScript = A.openElements.current;
        A.openElements.pop(), A.insertionMode = A.originalInsertionMode
    }

    function PB9(A, q) {
        A._err(nM.eofInElementThatCanContainOnlyText), A.openElements.pop(), A.insertionMode = A.originalInsertionMode, A._processToken(q)
    }

    function dp(A, q) {
        let K = A.openElements.currentTagName;
        if (K === C1.TABLE || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD || K === C1.TR) A.pendingCharacterTokens = [], A.hasNonWhitespacePendingCharacterToken = !1, A.originalInsertionMode = A.insertionMode, A.insertionMode = "IN_TABLE_TEXT_MODE", A._processToken(q);
        else kR(A, q)
    }

    function WB9(A, q) {
        A.openElements.clearBackToTableContext(), A.activeFormattingElements.insertMarker(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_CAPTION_MODE"
    }

    function GB9(A, q) {
        A.openElements.clearBackToTableContext(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_COLUMN_GROUP_MODE"
    }

    function ZB9(A, q) {
        A.openElements.clearBackToTableContext(), A._insertFakeElement(C1.COLGROUP), A.insertionMode = "IN_COLUMN_GROUP_MODE", A._processToken(q)
    }

    function fB9(A, q) {
        A.openElements.clearBackToTableContext(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_TABLE_BODY_MODE"
    }

    function VB9(A, q) {
        A.openElements.clearBackToTableContext(), A._insertFakeElement(C1.TBODY), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(q)
    }

    function NB9(A, q) {
        if (A.openElements.hasInTableScope(C1.TABLE)) A.openElements.popUntilTagNamePopped(C1.TABLE), A._resetInsertionMode(), A._processToken(q)
    }

    function TB9(A, q) {
        let K = b6.getTokenAttr(q, aA4.TYPE);
        if (K && K.toLowerCase() === "hidden") A._appendElement(q, n4.HTML);
        else kR(A, q);
        q.ackSelfClosing = !0
    }

    function vB9(A, q) {
        if (!A.formElement && A.openElements.tmplCount === 0) A._insertElement(q, n4.HTML), A.formElement = A.openElements.current, A.openElements.pop()
    }

    function lPA(A, q) {
        let K = q.tagName;
        switch (K.length) {
            case 2:
                if (K === C1.TD || K === C1.TH || K === C1.TR) VB9(A, q);
                else kR(A, q);
                break;
            case 3:
                if (K === C1.COL) ZB9(A, q);
                else kR(A, q);
                break;
            case 4:
                if (K === C1.FORM) vB9(A, q);
                else kR(A, q);
                break;
            case 5:
                if (K === C1.TABLE) NB9(A, q);
                else if (K === C1.STYLE) wj(A, q);
                else if (K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD) fB9(A, q);
                else if (K === C1.INPUT) TB9(A, q);
                else kR(A, q);
                break;
            case 6:
                if (K === C1.SCRIPT) wj(A, q);
                else kR(A, q);
                break;
            case 7:
                if (K === C1.CAPTION) WB9(A, q);
                else kR(A, q);
                break;
            case 8:
                if (K === C1.COLGROUP) GB9(A, q);
                else if (K === C1.TEMPLATE) wj(A, q);
                else kR(A, q);
                break;
            default:
                kR(A, q)
        }
    }

    function iPA(A, q) {
        let K = q.tagName;
        if (K === C1.TABLE) {
            if (A.openElements.hasInTableScope(C1.TABLE)) A.openElements.popUntilTagNamePopped(C1.TABLE), A._resetInsertionMode()
        } else if (K === C1.TEMPLATE) dK1(A, q);
        else if (K !== C1.BODY && K !== C1.CAPTION && K !== C1.COL && K !== C1.COLGROUP && K !== C1.HTML && K !== C1.TBODY && K !== C1.TD && K !== C1.TFOOT && K !== C1.TH && K !== C1.THEAD && K !== C1.TR) kR(A, q)
    }

    function kR(A, q) {
        let K = A.fosterParentingEnabled;
        A.fosterParentingEnabled = !0, A._processTokenInBodyMode(q), A.fosterParentingEnabled = K
    }

    function EB9(A, q) {
        A.pendingCharacterTokens.push(q)
    }

    function kB9(A, q) {
        A.pendingCharacterTokens.push(q), A.hasNonWhitespacePendingCharacterToken = !0
    }

    function hB1(A, q) {
        let K = 0;
        if (A.hasNonWhitespacePendingCharacterToken)
            for (; K < A.pendingCharacterTokens.length; K++) kR(A, A.pendingCharacterTokens[K]);
        else
            for (; K < A.pendingCharacterTokens.length; K++) A._insertCharacters(A.pendingCharacterTokens[K]);
        A.insertionMode = A.originalInsertionMode, A._processToken(q)
    }

    function LB9(A, q) {
        let K = q.tagName;
        if (K === C1.CAPTION || K === C1.COL || K === C1.COLGROUP || K === C1.TBODY || K === C1.TD || K === C1.TFOOT || K === C1.TH || K === C1.THEAD || K === C1.TR) {
            if (A.openElements.hasInTableScope(C1.CAPTION)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(C1.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", A._processToken(q)
        } else KN(A, q)
    }

    function RB9(A, q) {
        let K = q.tagName;
        if (K === C1.CAPTION || K === C1.TABLE) {
            if (A.openElements.hasInTableScope(C1.CAPTION)) {
                if (A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(C1.CAPTION), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_TABLE_MODE", K === C1.TABLE) A._processToken(q)
            }
        } else if (K !== C1.BODY && K !== C1.COL && K !== C1.COLGROUP && K !== C1.HTML && K !== C1.TBODY && K !== C1.TD && K !== C1.TFOOT && K !== C1.TH && K !== C1.THEAD && K !== C1.TR) cPA(A, q)
    }

    function yB9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.COL) A._appendElement(q, n4.HTML), q.ackSelfClosing = !0;
        else if (K === C1.TEMPLATE) wj(A, q);
        else dJ6(A, q)
    }

    function CB9(A, q) {
        let K = q.tagName;
        if (K === C1.COLGROUP) {
            if (A.openElements.currentTagName === C1.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
        } else if (K === C1.TEMPLATE) dK1(A, q);
        else if (K !== C1.COL) dJ6(A, q)
    }

    function dJ6(A, q) {
        if (A.openElements.currentTagName === C1.COLGROUP) A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(q)
    }

    function SB9(A, q) {
        let K = q.tagName;
        if (K === C1.TR) A.openElements.clearBackToTableBodyContext(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_ROW_MODE";
        else if (K === C1.TH || K === C1.TD) A.openElements.clearBackToTableBodyContext(), A._insertFakeElement(C1.TR), A.insertionMode = "IN_ROW_MODE", A._processToken(q);
        else if (K === C1.CAPTION || K === C1.COL || K === C1.COLGROUP || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD) {
            if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(q)
        } else lPA(A, q)
    }

    function hB9(A, q) {
        let K = q.tagName;
        if (K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD) {
            if (A.openElements.hasInTableScope(K)) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE"
        } else if (K === C1.TABLE) {
            if (A.openElements.hasTableBodyContextInTableScope()) A.openElements.clearBackToTableBodyContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_MODE", A._processToken(q)
        } else if (K !== C1.BODY && K !== C1.CAPTION && K !== C1.COL && K !== C1.COLGROUP || K !== C1.HTML && K !== C1.TD && K !== C1.TH && K !== C1.TR) iPA(A, q)
    }

    function IB9(A, q) {
        let K = q.tagName;
        if (K === C1.TH || K === C1.TD) A.openElements.clearBackToTableRowContext(), A._insertElement(q, n4.HTML), A.insertionMode = "IN_CELL_MODE", A.activeFormattingElements.insertMarker();
        else if (K === C1.CAPTION || K === C1.COL || K === C1.COLGROUP || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD || K === C1.TR) {
            if (A.openElements.hasInTableScope(C1.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(q)
        } else lPA(A, q)
    }

    function xB9(A, q) {
        let K = q.tagName;
        if (K === C1.TR) {
            if (A.openElements.hasInTableScope(C1.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE"
        } else if (K === C1.TABLE) {
            if (A.openElements.hasInTableScope(C1.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(q)
        } else if (K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD) {
            if (A.openElements.hasInTableScope(K) || A.openElements.hasInTableScope(C1.TR)) A.openElements.clearBackToTableRowContext(), A.openElements.pop(), A.insertionMode = "IN_TABLE_BODY_MODE", A._processToken(q)
        } else if (K !== C1.BODY && K !== C1.CAPTION && K !== C1.COL && K !== C1.COLGROUP || K !== C1.HTML && K !== C1.TD && K !== C1.TH) iPA(A, q)
    }

    function bB9(A, q) {
        let K = q.tagName;
        if (K === C1.CAPTION || K === C1.COL || K === C1.COLGROUP || K === C1.TBODY || K === C1.TD || K === C1.TFOOT || K === C1.TH || K === C1.THEAD || K === C1.TR) {
            if (A.openElements.hasInTableScope(C1.TD) || A.openElements.hasInTableScope(C1.TH)) A._closeTableCell(), A._processToken(q)
        } else KN(A, q)
    }

    function uB9(A, q) {
        let K = q.tagName;
        if (K === C1.TD || K === C1.TH) {
            if (A.openElements.hasInTableScope(K)) A.openElements.generateImpliedEndTags(), A.openElements.popUntilTagNamePopped(K), A.activeFormattingElements.clearToLastMarker(), A.insertionMode = "IN_ROW_MODE"
        } else if (K === C1.TABLE || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD || K === C1.TR) {
            if (A.openElements.hasInTableScope(K)) A._closeTableCell(), A._processToken(q)
        } else if (K !== C1.BODY && K !== C1.CAPTION && K !== C1.COL && K !== C1.COLGROUP && K !== C1.HTML) cPA(A, q)
    }

    function tA4(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.OPTION) {
            if (A.openElements.currentTagName === C1.OPTION) A.openElements.pop();
            A._insertElement(q, n4.HTML)
        } else if (K === C1.OPTGROUP) {
            if (A.openElements.currentTagName === C1.OPTION) A.openElements.pop();
            if (A.openElements.currentTagName === C1.OPTGROUP) A.openElements.pop();
            A._insertElement(q, n4.HTML)
        } else if (K === C1.INPUT || K === C1.KEYGEN || K === C1.TEXTAREA || K === C1.SELECT) {
            if (A.openElements.hasInSelectScope(C1.SELECT)) {
                if (A.openElements.popUntilTagNamePopped(C1.SELECT), A._resetInsertionMode(), K !== C1.SELECT) A._processToken(q)
            }
        } else if (K === C1.SCRIPT || K === C1.TEMPLATE) wj(A, q)
    }

    function eA4(A, q) {
        let K = q.tagName;
        if (K === C1.OPTGROUP) {
            let Y = A.openElements.items[A.openElements.stackTop - 1],
                z = Y && A.treeAdapter.getTagName(Y);
            if (A.openElements.currentTagName === C1.OPTION && z === C1.OPTGROUP) A.openElements.pop();
            if (A.openElements.currentTagName === C1.OPTGROUP) A.openElements.pop()
        } else if (K === C1.OPTION) {
            if (A.openElements.currentTagName === C1.OPTION) A.openElements.pop()
        } else if (K === C1.SELECT && A.openElements.hasInSelectScope(C1.SELECT)) A.openElements.popUntilTagNamePopped(C1.SELECT), A._resetInsertionMode();
        else if (K === C1.TEMPLATE) dK1(A, q)
    }

    function BB9(A, q) {
        let K = q.tagName;
        if (K === C1.CAPTION || K === C1.TABLE || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD || K === C1.TR || K === C1.TD || K === C1.TH) A.openElements.popUntilTagNamePopped(C1.SELECT), A._resetInsertionMode(), A._processToken(q);
        else tA4(A, q)
    }

    function mB9(A, q) {
        let K = q.tagName;
        if (K === C1.CAPTION || K === C1.TABLE || K === C1.TBODY || K === C1.TFOOT || K === C1.THEAD || K === C1.TR || K === C1.TD || K === C1.TH) {
            if (A.openElements.hasInTableScope(K)) A.openElements.popUntilTagNamePopped(C1.SELECT), A._resetInsertionMode(), A._processToken(q)
        } else eA4(A, q)
    }

    function FB9(A, q) {
        let K = q.tagName;
        if (K === C1.BASE || K === C1.BASEFONT || K === C1.BGSOUND || K === C1.LINK || K === C1.META || K === C1.NOFRAMES || K === C1.SCRIPT || K === C1.STYLE || K === C1.TEMPLATE || K === C1.TITLE) wj(A, q);
        else {
            let Y = Nu9[K] || "IN_BODY_MODE";
            A._popTmplInsertionMode(), A._pushTmplInsertionMode(Y), A.insertionMode = Y, A._processToken(q)
        }
    }

    function QB9(A, q) {
        if (q.tagName === C1.TEMPLATE) dK1(A, q)
    }

    function A84(A, q) {
        if (A.openElements.tmplCount > 0) A.openElements.popUntilTagNamePopped(C1.TEMPLATE), A.activeFormattingElements.clearToLastMarker(), A._popTmplInsertionMode(), A._resetInsertionMode(), A._processToken(q);
        else A.stopped = !0
    }

    function gB9(A, q) {
        if (q.tagName === C1.HTML) KN(A, q);
        else cJ6(A, q)
    }

    function UB9(A, q) {
        if (q.tagName === C1.HTML) {
            if (!A.fragmentContext) A.insertionMode = "AFTER_AFTER_BODY_MODE"
        } else cJ6(A, q)
    }

    function cJ6(A, q) {
        A.insertionMode = "IN_BODY_MODE", A._processToken(q)
    }

    function pB9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.FRAMESET) A._insertElement(q, n4.HTML);
        else if (K === C1.FRAME) A._appendElement(q, n4.HTML), q.ackSelfClosing = !0;
        else if (K === C1.NOFRAMES) wj(A, q)
    }

    function dB9(A, q) {
        if (q.tagName === C1.FRAMESET && !A.openElements.isRootHtmlElementCurrent()) {
            if (A.openElements.pop(), !A.fragmentContext && A.openElements.currentTagName !== C1.FRAMESET) A.insertionMode = "AFTER_FRAMESET_MODE"
        }
    }

    function cB9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.NOFRAMES) wj(A, q)
    }

    function lB9(A, q) {
        if (q.tagName === C1.HTML) A.insertionMode = "AFTER_AFTER_FRAMESET_MODE"
    }

    function iB9(A, q) {
        if (q.tagName === C1.HTML) KN(A, q);
        else pJ6(A, q)
    }

    function pJ6(A, q) {
        A.insertionMode = "IN_BODY_MODE", A._processToken(q)
    }

    function nB9(A, q) {
        let K = q.tagName;
        if (K === C1.HTML) KN(A, q);
        else if (K === C1.NOFRAMES) wj(A, q)
    }

    function rB9(A, q) {
        q.chars = Zu9.REPLACEMENT_CHARACTER, A._insertCharacters(q)
    }

    function oB9(A, q) {
        A._insertCharacters(q), A.framesetOk = !1
    }

    function aB9(A, q) {
        if (sB.causesExit(q) && !A.fragmentContext) {
            while (A.treeAdapter.getNamespaceURI(A.openElements.current) !== n4.HTML && !A._isIntegrationPoint(A.openElements.current)) A.openElements.pop();
            A._processToken(q)
        } else {
            let K = A._getAdjustedCurrentElement(),
                Y = A.treeAdapter.getNamespaceURI(K);
            if (Y === n4.MATHML) sB.adjustTokenMathMLAttrs(q);
            else if (Y === n4.SVG) sB.adjustTokenSVGTagName(q), sB.adjustTokenSVGAttrs(q);
            if (sB.adjustTokenXMLAttrs(q), q.selfClosing) A._appendElement(q, Y);
            else A._insertElement(q, Y);
            q.ackSelfClosing = !0
        }
    }

    function sB9(A, q) {
        for (let K = A.openElements.stackTop; K > 0; K--) {
            let Y = A.openElements.items[K];
            if (A.treeAdapter.getNamespaceURI(Y) === n4.HTML) {
                A._processToken(q);
                break
            }
            if (A.treeAdapter.getTagName(Y).toLowerCase() === q.tagName) {
                A.openElements.popUntilElementPopped(Y);
                break
            }
        }
    }
})
// @from(Ln 264742, Col 4)
w84 = R((bEw, z84) => {
    var tB9 = QPA(),
        eB9 = gPA(),
        Am9 = UPA(),
        Y84 = ws(),
        uw = Y84.TAG_NAMES,
        lJ6 = Y84.NAMESPACES,
        qm9 = {
            treeAdapter: tB9
        },
        Km9 = /&/g,
        Ym9 = /\u00a0/g,
        zm9 = /"/g,
        wm9 = /</g,
        Hm9 = />/g;
    class mB1 {
        constructor(A, q) {
            this.options = eB9(qm9, q), this.treeAdapter = this.options.treeAdapter, this.html = "", this.startNode = A
        }
        serialize() {
            return this._serializeChildNodes(this.startNode), this.html
        }
        _serializeChildNodes(A) {
            let q = this.treeAdapter.getChildNodes(A);
            if (q)
                for (let K = 0, Y = q.length; K < Y; K++) {
                    let z = q[K];
                    if (this.treeAdapter.isElementNode(z)) this._serializeElement(z);
                    else if (this.treeAdapter.isTextNode(z)) this._serializeTextNode(z);
                    else if (this.treeAdapter.isCommentNode(z)) this._serializeCommentNode(z);
                    else if (this.treeAdapter.isDocumentTypeNode(z)) this._serializeDocumentTypeNode(z)
                }
        }
        _serializeElement(A) {
            let q = this.treeAdapter.getTagName(A),
                K = this.treeAdapter.getNamespaceURI(A);
            if (this.html += "<" + q, this._serializeAttributes(A), this.html += ">", q !== uw.AREA && q !== uw.BASE && q !== uw.BASEFONT && q !== uw.BGSOUND && q !== uw.BR && q !== uw.COL && q !== uw.EMBED && q !== uw.FRAME && q !== uw.HR && q !== uw.IMG && q !== uw.INPUT && q !== uw.KEYGEN && q !== uw.LINK && q !== uw.META && q !== uw.PARAM && q !== uw.SOURCE && q !== uw.TRACK && q !== uw.WBR) {
                let Y = q === uw.TEMPLATE && K === lJ6.HTML ? this.treeAdapter.getTemplateContent(A) : A;
                this._serializeChildNodes(Y), this.html += "</" + q + ">"
            }
        }
        _serializeAttributes(A) {
            let q = this.treeAdapter.getAttrList(A);
            for (let K = 0, Y = q.length; K < Y; K++) {
                let z = q[K],
                    w = mB1.escapeString(z.value, !0);
                if (this.html += " ", !z.namespace) this.html += z.name;
                else if (z.namespace === lJ6.XML) this.html += "xml:" + z.name;
                else if (z.namespace === lJ6.XMLNS) {
                    if (z.name !== "xmlns") this.html += "xmlns:";
                    this.html += z.name
                } else if (z.namespace === lJ6.XLINK) this.html += "xlink:" + z.name;
                else this.html += z.prefix + ":" + z.name;
                this.html += '="' + w + '"'
            }
        }
        _serializeTextNode(A) {
            let q = this.treeAdapter.getTextNodeContent(A),
                K = this.treeAdapter.getParentNode(A),
                Y = void 0;
            if (K && this.treeAdapter.isElementNode(K)) Y = this.treeAdapter.getTagName(K);
            if (Y === uw.STYLE || Y === uw.SCRIPT || Y === uw.XMP || Y === uw.IFRAME || Y === uw.NOEMBED || Y === uw.NOFRAMES || Y === uw.PLAINTEXT || Y === uw.NOSCRIPT) this.html += q;
            else this.html += mB1.escapeString(q, !1)
        }
        _serializeCommentNode(A) {
            this.html += "<!--" + this.treeAdapter.getCommentNodeContent(A) + "-->"
        }
        _serializeDocumentTypeNode(A) {
            let q = this.treeAdapter.getDocumentTypeNodeName(A);
            this.html += "<" + Am9.serializeContent(q, null, null) + ">"
        }
    }
    mB1.escapeString = function(A, q) {
        if (A = A.replace(Km9, "&amp;").replace(Ym9, "&nbsp;"), q) A = A.replace(zm9, "&quot;");
        else A = A.replace(wm9, "&lt;").replace(Hm9, "&gt;");
        return A
    };
    z84.exports = mB1
})
// @from(Ln 264821, Col 4)
$84 = R((Om9) => {
    var H84 = K84(),
        $m9 = w84();
    Om9.parse = function(q, K) {
        return new H84(K).parse(q)
    };
    Om9.parseFragment = function(q, K, Y) {
        if (typeof q === "string") Y = K, K = q, q = null;
        return new H84(Y).parseFragment(K, q)
    };
    Om9.serialize = function(A, q) {
        return new $m9(A, q).serialize()
    }
})
// @from(Ln 264835, Col 4)
rPA = R((Dm9) => {
    var nPA = Dm9.NAMESPACES = {
        HTML: "http://www.w3.org/1999/xhtml",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/"
    };
    Dm9.ATTRS = {
        TYPE: "type",
        ACTION: "action",
        ENCODING: "encoding",
        PROMPT: "prompt",
        NAME: "name",
        COLOR: "color",
        FACE: "face",
        SIZE: "size"
    };
    Dm9.DOCUMENT_MODE = {
        NO_QUIRKS: "no-quirks",
        QUIRKS: "quirks",
        LIMITED_QUIRKS: "limited-quirks"
    };
    var W7 = Dm9.TAG_NAMES = {
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
    Dm9.SPECIAL_ELEMENTS = {
        [nPA.HTML]: {
            [W7.ADDRESS]: !0,
            [W7.APPLET]: !0,
            [W7.AREA]: !0,
            [W7.ARTICLE]: !0,
            [W7.ASIDE]: !0,
            [W7.BASE]: !0,
            [W7.BASEFONT]: !0,
            [W7.BGSOUND]: !0,
            [W7.BLOCKQUOTE]: !0,
            [W7.BODY]: !0,
            [W7.BR]: !0,
            [W7.BUTTON]: !0,
            [W7.CAPTION]: !0,
            [W7.CENTER]: !0,
            [W7.COL]: !0,
            [W7.COLGROUP]: !0,
            [W7.DD]: !0,
            [W7.DETAILS]: !0,
            [W7.DIR]: !0,
            [W7.DIV]: !0,
            [W7.DL]: !0,
            [W7.DT]: !0,
            [W7.EMBED]: !0,
            [W7.FIELDSET]: !0,
            [W7.FIGCAPTION]: !0,
            [W7.FIGURE]: !0,
            [W7.FOOTER]: !0,
            [W7.FORM]: !0,
            [W7.FRAME]: !0,
            [W7.FRAMESET]: !0,
            [W7.H1]: !0,
            [W7.H2]: !0,
            [W7.H3]: !0,
            [W7.H4]: !0,
            [W7.H5]: !0,
            [W7.H6]: !0,
            [W7.HEAD]: !0,
            [W7.HEADER]: !0,
            [W7.HGROUP]: !0,
            [W7.HR]: !0,
            [W7.HTML]: !0,
            [W7.IFRAME]: !0,
            [W7.IMG]: !0,
            [W7.INPUT]: !0,
            [W7.LI]: !0,
            [W7.LINK]: !0,
            [W7.LISTING]: !0,
            [W7.MAIN]: !0,
            [W7.MARQUEE]: !0,
            [W7.MENU]: !0,
            [W7.META]: !0,
            [W7.NAV]: !0,
            [W7.NOEMBED]: !0,
            [W7.NOFRAMES]: !0,
            [W7.NOSCRIPT]: !0,
            [W7.OBJECT]: !0,
            [W7.OL]: !0,
            [W7.P]: !0,
            [W7.PARAM]: !0,
            [W7.PLAINTEXT]: !0,
            [W7.PRE]: !0,
            [W7.SCRIPT]: !0,
            [W7.SECTION]: !0,
            [W7.SELECT]: !0,
            [W7.SOURCE]: !0,
            [W7.STYLE]: !0,
            [W7.SUMMARY]: !0,
            [W7.TABLE]: !0,
            [W7.TBODY]: !0,
            [W7.TD]: !0,
            [W7.TEMPLATE]: !0,
            [W7.TEXTAREA]: !0,
            [W7.TFOOT]: !0,
            [W7.TH]: !0,
            [W7.THEAD]: !0,
            [W7.TITLE]: !0,
            [W7.TR]: !0,
            [W7.TRACK]: !0,
            [W7.UL]: !0,
            [W7.WBR]: !0,
            [W7.XMP]: !0
        },
        [nPA.MATHML]: {
            [W7.MI]: !0,
            [W7.MO]: !0,
            [W7.MN]: !0,
            [W7.MS]: !0,
            [W7.MTEXT]: !0,
            [W7.ANNOTATION_XML]: !0
        },
        [nPA.SVG]: {
            [W7.TITLE]: !0,
            [W7.FOREIGN_OBJECT]: !0,
            [W7.DESC]: !0
        }
    }
})
// @from(Ln 265082, Col 4)
D84 = R((fm9) => {
    var {
        DOCUMENT_MODE: wM1
    } = rPA(), J84 = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"], Wm9 = J84.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]), Gm9 = ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"], X84 = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], Zm9 = X84.concat(["-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]);

    function O84(A) {
        let q = A.indexOf('"') !== -1 ? "'" : '"';
        return q + A + q
    }

    function _84(A, q) {
        for (let K = 0; K < q.length; K++)
            if (A.indexOf(q[K]) === 0) return !0;
        return !1
    }
    fm9.isConforming = function(A) {
        return A.name === "html" && A.publicId === null && (A.systemId === null || A.systemId === "about:legacy-compat")
    };
    fm9.getDocumentMode = function(A) {
        if (A.name !== "html") return wM1.QUIRKS;
        let q = A.systemId;
        if (q && q.toLowerCase() === "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") return wM1.QUIRKS;
        let K = A.publicId;
        if (K !== null) {
            if (K = K.toLowerCase(), Gm9.indexOf(K) > -1) return wM1.QUIRKS;
            let Y = q === null ? Wm9 : J84;
            if (_84(K, Y)) return wM1.QUIRKS;
            if (Y = q === null ? X84 : Zm9, _84(K, Y)) return wM1.LIMITED_QUIRKS
        }
        return wM1.NO_QUIRKS
    };
    fm9.serializeContent = function(A, q, K) {
        let Y = "!DOCTYPE ";
        if (A) Y += A;
        if (q) Y += " PUBLIC " + O84(q);
        else if (K) Y += " SYSTEM";
        if (K !== null) Y += " " + O84(K);
        return Y
    }
})
// @from(Ln 265122, Col 4)
W84 = R((Lm9) => {
    var vm9 = D84(),
        {
            DOCUMENT_MODE: Em9
        } = rPA(),
        j84 = {
            element: 1,
            text: 3,
            cdata: 4,
            comment: 8
        },
        M84 = {
            tagName: "name",
            childNodes: "children",
            parentNode: "parent",
            previousSibling: "prev",
            nextSibling: "next",
            nodeValue: "data"
        };
    class Os {
        constructor(A) {
            for (let q of Object.keys(A)) this[q] = A[q]
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
            return j84[this.type] || j84.element
        }
    }
    Object.keys(M84).forEach((A) => {
        let q = M84[A];
        Object.defineProperty(Os.prototype, A, {
            get: function() {
                return this[q] || null
            },
            set: function(K) {
                return this[q] = K, K
            }
        })
    });
    Lm9.createDocument = function() {
        return new Os({
            type: "root",
            name: "root",
            parent: null,
            prev: null,
            next: null,
            children: [],
            "x-mode": Em9.NO_QUIRKS
        })
    };
    Lm9.createDocumentFragment = function() {
        return new Os({
            type: "root",
            name: "root",
            parent: null,
            prev: null,
            next: null,
            children: []
        })
    };
    Lm9.createElement = function(A, q, K) {
        let Y = Object.create(null),
            z = Object.create(null),
            w = Object.create(null);
        for (let H = 0; H < K.length; H++) {
            let $ = K[H].name;
            Y[$] = K[H].value, z[$] = K[H].namespace, w[$] = K[H].prefix
        }
        return new Os({
            type: A === "script" || A === "style" ? A : "tag",
            name: A,
            namespace: q,
            attribs: Y,
            "x-attribsNamespace": z,
            "x-attribsPrefix": w,
            children: [],
            parent: null,
            prev: null,
            next: null
        })
    };
    Lm9.createCommentNode = function(A) {
        return new Os({
            type: "comment",
            data: A,
            parent: null,
            prev: null,
            next: null
        })
    };
    var P84 = function(A) {
            return new Os({
                type: "text",
                data: A,
                parent: null,
                prev: null,
                next: null
            })
        },
        oPA = Lm9.appendChild = function(A, q) {
            let K = A.children[A.children.length - 1];
            if (K) K.next = q, q.prev = K;
            A.children.push(q), q.parent = A
        },
        km9 = Lm9.insertBefore = function(A, q, K) {
            let Y = A.children.indexOf(K),
                z = K.prev;
            if (z) z.next = q, q.prev = z;
            K.prev = q, q.next = K, A.children.splice(Y, 0, q), q.parent = A
        };
    Lm9.setTemplateContent = function(A, q) {
        oPA(A, q)
    };
    Lm9.getTemplateContent = function(A) {
        return A.children[0]
    };
    Lm9.setDocumentType = function(A, q, K, Y) {
        let z = vm9.serializeContent(q, K, Y),
            w = null;
        for (let H = 0; H < A.children.length; H++)
            if (A.children[H].type === "directive" && A.children[H].name === "!doctype") {
                w = A.children[H];
                break
            } if (w) w.data = z, w["x-name"] = q, w["x-publicId"] = K, w["x-systemId"] = Y;
        else oPA(A, new Os({
            type: "directive",
            name: "!doctype",
            data: z,
            "x-name": q,
            "x-publicId": K,
            "x-systemId": Y
        }))
    };
    Lm9.setDocumentMode = function(A, q) {
        A["x-mode"] = q
    };
    Lm9.getDocumentMode = function(A) {
        return A["x-mode"]
    };
    Lm9.detachNode = function(A) {
        if (A.parent) {
            let q = A.parent.children.indexOf(A),
                K = A.prev,
                Y = A.next;
            if (A.prev = null, A.next = null, K) K.next = Y;
            if (Y) Y.prev = K;
            A.parent.children.splice(q, 1), A.parent = null
        }
    };
    Lm9.insertText = function(A, q) {
        let K = A.children[A.children.length - 1];
        if (K && K.type === "text") K.data += q;
        else oPA(A, P84(q))
    };
    Lm9.insertTextBefore = function(A, q, K) {
        let Y = A.children[A.children.indexOf(K) - 1];
        if (Y && Y.type === "text") Y.data += q;
        else km9(A, P84(q), K)
    };
    Lm9.adoptAttributes = function(A, q) {
        for (let K = 0; K < q.length; K++) {
            let Y = q[K].name;
            if (typeof A.attribs[Y] > "u") A.attribs[Y] = q[K].value, A["x-attribsNamespace"][Y] = q[K].namespace, A["x-attribsPrefix"][Y] = q[K].prefix
        }
    };
    Lm9.getFirstChild = function(A) {
        return A.children[0]
    };
    Lm9.getChildNodes = function(A) {
        return A.children
    };
    Lm9.getParentNode = function(A) {
        return A.parent
    };
    Lm9.getAttrList = function(A) {
        let q = [];
        for (let K in A.attribs) q.push({
            name: K,
            value: A.attribs[K],
            namespace: A["x-attribsNamespace"][K],
            prefix: A["x-attribsPrefix"][K]
        });
        return q
    };
    Lm9.getTagName = function(A) {
        return A.name
    };
    Lm9.getNamespaceURI = function(A) {
        return A.namespace
    };
    Lm9.getTextNodeContent = function(A) {
        return A.data
    };
    Lm9.getCommentNodeContent = function(A) {
        return A.data
    };
    Lm9.getDocumentTypeNodeName = function(A) {
        return A["x-name"]
    };
    Lm9.getDocumentTypeNodePublicId = function(A) {
        return A["x-publicId"]
    };
    Lm9.getDocumentTypeNodeSystemId = function(A) {
        return A["x-systemId"]
    };
    Lm9.isTextNode = function(A) {
        return A.type === "text"
    };
    Lm9.isCommentNode = function(A) {
        return A.type === "comment"
    };
    Lm9.isDocumentTypeNode = function(A) {
        return A.type === "directive" && A.name === "!doctype"
    };
    Lm9.isElementNode = function(A) {
        return !!A.attribs
    };
    Lm9.setNodeSourceCodeLocation = function(A, q) {
        A.sourceCodeLocation = q
    };
    Lm9.getNodeSourceCodeLocation = function(A) {
        return A.sourceCodeLocation
    };
    Lm9.updateNodeSourceCodeLocation = function(A, q) {
        A.sourceCodeLocation = Object.assign(A.sourceCodeLocation, q)
    }
})