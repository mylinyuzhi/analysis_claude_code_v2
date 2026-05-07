
// @from(Ln 228148, Col 4)
xe6 = L(() => {
    oj6 = CU1();
    Re6 = {
        exec: () => null
    };
    Ek = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (q) => new RegExp(`^( {0,3}${q})((?:[	 ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: (q) => new RegExp(`^ {0,${Math.min(3,q-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
        hrRegex: (q) => new RegExp(`^ {0,${Math.min(3,q-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
        fencesBeginRegex: (q) => new RegExp(`^ {0,${Math.min(3,q-1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: (q) => new RegExp(`^ {0,${Math.min(3,q-1)}}#`),
        htmlBeginRegex: (q) => new RegExp(`^ {0,${Math.min(3,q-1)}}<(?:[a-z].*>|!--)`, "i")
    }, wKz = /^(?:[ \t]*(?:\n|$))+/, $Kz = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, jKz = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ie6 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, HKz = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, HD4 = /(?:[*+-]|\d{1,9}[.)])/, JD4 = Lw(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, HD4).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), bU1 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, JKz = /^[^\n]+/, IU1 = /(?!\s*\])(?:\\.|[^\[\]\\])+/, XKz = Lw(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", IU1).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), MKz = Lw(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, HD4).getRegex(), xU1 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, PKz = Lw("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", xU1).replace("tag", KS8).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), XD4 = Lw(bU1).replace("hr", Ie6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KS8).getRegex(), WKz = Lw(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", XD4).getRegex(), uU1 = {
        blockquote: WKz,
        code: $Kz,
        def: XKz,
        fences: jKz,
        heading: HKz,
        hr: Ie6,
        html: PKz,
        lheading: JD4,
        list: MKz,
        newline: wKz,
        paragraph: XD4,
        table: Re6,
        text: JKz
    }, YD4 = Lw("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ie6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KS8).getRegex(), DKz = {
        ...uU1,
        table: YD4,
        paragraph: Lw(bU1).replace("hr", Ie6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", YD4).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", KS8).getRegex()
    }, ZKz = {
        ...uU1,
        html: Lw(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", xU1).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: Re6,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: Lw(bU1).replace("hr", Ie6).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", JD4).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
    }, fKz = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, GKz = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, MD4 = /^( {2,}|\\)\n(?!\s*$)/, vKz = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, _S8 = /[\p{P}\p{S}]/u, mU1 = /[\s\p{P}\p{S}]/u, PD4 = /[^\s\p{P}\p{S}]/u, TKz = Lw(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, mU1).getRegex(), WD4 = /(?!~)[\p{P}\p{S}]/u, VKz = /(?!~)[\s\p{P}\p{S}]/u, kKz = /(?:[^\s\p{P}\p{S}]|~)/u, NKz = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, DD4 = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, EKz = Lw(DD4, "u").replace(/punct/g, _S8).getRegex(), yKz = Lw(DD4, "u").replace(/punct/g, WD4).getRegex(), LKz = Lw(ZD4, "gu").replace(/notPunctSpace/g, PD4).replace(/punctSpace/g, mU1).replace(/punct/g, _S8).getRegex(), hKz = Lw(ZD4, "gu").replace(/notPunctSpace/g, kKz).replace(/punctSpace/g, VKz).replace(/punct/g, WD4).getRegex(), RKz = Lw("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, PD4).replace(/punctSpace/g, mU1).replace(/punct/g, _S8).getRegex(), SKz = Lw(/\\(punct)/, "gu").replace(/punct/g, _S8).getRegex(), CKz = Lw(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), bKz = Lw(xU1).replace("(?:-->|$)", "-->").getRegex(), IKz = Lw("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", bKz).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), qS8 = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, xKz = Lw(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", qS8).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), fD4 = Lw(/^!?\[(label)\]\[(ref)\]/).replace("label", qS8).replace("ref", IU1).getRegex(), GD4 = Lw(/^!?\[(ref)\](?:\[\])?/).replace("ref", IU1).getRegex(), uKz = Lw("reflink|nolink(?!\\()", "g").replace("reflink", fD4).replace("nolink", GD4).getRegex(), BU1 = {
        _backpedal: Re6,
        anyPunctuation: SKz,
        autolink: CKz,
        blockSkip: NKz,
        br: MD4,
        code: GKz,
        del: Re6,
        emStrongLDelim: EKz,
        emStrongRDelimAst: LKz,
        emStrongRDelimUnd: RKz,
        escape: fKz,
        link: xKz,
        nolink: GD4,
        punctuation: TKz,
        reflink: fD4,
        reflinkSearch: uKz,
        tag: IKz,
        text: vKz,
        url: Re6
    }, mKz = {
        ...BU1,
        link: Lw(/^!?\[(label)\]\((.*?)\)/).replace("label", qS8).getRegex(),
        reflink: Lw(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", qS8).getRegex()
    }, SU1 = {
        ...BU1,
        emStrongRDelimAst: hKz,
        emStrongLDelim: yKz,
        url: Lw(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    }, BKz = {
        ...SU1,
        br: Lw(MD4).replace("{2,}", "*").getRegex(),
        text: Lw(SU1.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    }, eR8 = {
        normal: uU1,
        gfm: DKz,
        pedantic: ZKz
    }, Le6 = {
        normal: BU1,
        gfm: SU1,
        breaks: BKz,
        pedantic: mKz
    }, pKz = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    Se6 = class Se6 {
        options;
        block;
        constructor(q) {
            this.options = q || oj6
        }
        static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
        preprocess(q) {
            return q
        }
        postprocess(q) {
            return q
        }
        processAllTokens(q) {
            return q
        }
        provideLexer() {
            return this.block ? yk.lex : yk.lexInline
        }
        provideParser() {
            return this.block ? rI.parse : rI.parseInline
        }
    };
    rj6 = new vD4;
    wY.options = wY.setOptions = function(q) {
        return rj6.setOptions(q), wY.defaults = rj6.defaults, jD4(wY.defaults), wY
    };
    wY.getDefaults = CU1;
    wY.defaults = oj6;
    wY.use = function(...q) {
        return rj6.use(...q), wY.defaults = rj6.defaults, jD4(wY.defaults), wY
    };
    wY.walkTokens = function(q, K) {
        return rj6.walkTokens(q, K)
    };
    wY.parseInline = rj6.parseInline;
    wY.Parser = rI;
    wY.parser = rI.parse;
    wY.Renderer = be6;
    wY.TextRenderer = zS8;
    wY.Lexer = yk;
    wY.lexer = yk.lex;
    wY.Tokenizer = Ce6;
    wY.Hooks = Se6;
    wY.parse = wY;
    TGw = wY.options, VGw = wY.setOptions, kGw = wY.use, NGw = wY.walkTokens, EGw = wY.parseInline, yGw = rI.parse, LGw = yk.lex
})
// @from(Ln 228336, Col 4)
ue6 = p((RGw, VD4) => {
    var TD4 = {
            DOT_LITERAL: "\\.",
            PLUS_LITERAL: "\\+",
            QMARK_LITERAL: "\\?",
            SLASH_LITERAL: "\\/",
            ONE_CHAR: "(?=.)",
            QMARK: "[^/]",
            END_ANCHOR: "(?:\\/|$)",
            DOTS_SLASH: "\\.{1,2}(?:\\/|$)",
            NO_DOT: "(?!\\.)",
            NO_DOTS: "(?!(?:^|\\/)\\.{1,2}(?:\\/|$))",
            NO_DOT_SLASH: "(?!\\.{0,1}(?:\\/|$))",
            NO_DOTS_SLASH: "(?!\\.{1,2}(?:\\/|$))",
            QMARK_NO_DOT: "[^.\\/]",
            STAR: "[^/]*?",
            START_ANCHOR: "(?:^|\\/)",
            SEP: "/"
        },
        UKz = {
            ...TD4,
            SLASH_LITERAL: "[\\\\/]",
            QMARK: "[^\\\\/]",
            STAR: "[^\\\\/]*?",
            DOTS_SLASH: "\\.{1,2}(?:[\\\\/]|$)",
            NO_DOT: "(?!\\.)",
            NO_DOTS: "(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))",
            NO_DOT_SLASH: "(?!\\.{0,1}(?:[\\\\/]|$))",
            NO_DOTS_SLASH: "(?!\\.{1,2}(?:[\\\\/]|$))",
            QMARK_NO_DOT: "[^.\\\\/]",
            START_ANCHOR: "(?:^|[\\\\/])",
            END_ANCHOR: "(?:[\\\\/]|$)",
            SEP: "\\"
        },
        QKz = {
            alnum: "a-zA-Z0-9",
            alpha: "a-zA-Z",
            ascii: "\\x00-\\x7F",
            blank: " \\t",
            cntrl: "\\x00-\\x1F\\x7F",
            digit: "0-9",
            graph: "\\x21-\\x7E",
            lower: "a-z",
            print: "\\x20-\\x7E ",
            punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
            space: " \\t\\r\\n\\v\\f",
            upper: "A-Z",
            word: "A-Za-z0-9_",
            xdigit: "A-Fa-f0-9"
        };
    VD4.exports = {
        MAX_LENGTH: 65536,
        POSIX_REGEX_SOURCE: QKz,
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        REPLACEMENTS: {
            __proto__: null,
            "***": "*",
            "**/**": "**",
            "**/**/**": "**"
        },
        CHAR_0: 48,
        CHAR_9: 57,
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        extglobChars(q) {
            return {
                "!": {
                    type: "negate",
                    open: "(?:(?!(?:",
                    close: `))${q.STAR})`
                },
                "?": {
                    type: "qmark",
                    open: "(?:",
                    close: ")?"
                },
                "+": {
                    type: "plus",
                    open: "(?:",
                    close: ")+"
                },
                "*": {
                    type: "star",
                    open: "(?:",
                    close: ")*"
                },
                "@": {
                    type: "at",
                    open: "(?:",
                    close: ")"
                }
            }
        },
        globChars(q) {
            return q === !0 ? UKz : TD4
        }
    }
})
// @from(Ln 228478, Col 4)
me6 = p((iKz) => {
    var {
        REGEX_BACKSLASH: dKz,
        REGEX_REMOVE_BACKSLASH: cKz,
        REGEX_SPECIAL_CHARS: lKz,
        REGEX_SPECIAL_CHARS_GLOBAL: nKz
    } = ue6();
    iKz.isObject = (q) => q !== null && typeof q === "object" && !Array.isArray(q);
    iKz.hasRegexChars = (q) => lKz.test(q);
    iKz.isRegexChar = (q) => q.length === 1 && iKz.hasRegexChars(q);
    iKz.escapeRegex = (q) => q.replace(nKz, "\\$1");
    iKz.toPosixSlashes = (q) => q.replace(dKz, "/");
    iKz.isWindows = () => {
        if (typeof navigator < "u" && navigator.platform) {
            let q = navigator.platform.toLowerCase();
            return q === "win32" || q === "windows"
        }
        if (typeof process < "u" && process.platform) return process.platform === "win32";
        return !1
    };
    iKz.removeBackslashes = (q) => {
        return q.replace(cKz, (K) => {
            return K === "\\" ? "" : K
        })
    };
    iKz.escapeLast = (q, K, _) => {
        let z = q.lastIndexOf(K, _);
        if (z === -1) return q;
        if (q[z - 1] === "\\") return iKz.escapeLast(q, K, z - 1);
        return `${q.slice(0,z)}\\${q.slice(z)}`
    };
    iKz.removePrefix = (q, K = {}) => {
        let _ = q;
        if (_.startsWith("./")) _ = _.slice(2), K.prefix = "./";
        return _
    };
    iKz.wrapOutput = (q, K = {}, _ = {}) => {
        let z = _.contains ? "" : "^",
            Y = _.contains ? "" : "$",
            A = `${z}(?:${q})${Y}`;
        if (K.negated === !0) A = `(?:^(?!${A}).*$)`;
        return A
    };
    iKz.basename = (q, {
        windows: K
    } = {}) => {
        let _ = q.split(K ? /[\\/]/ : "/"),
            z = _[_.length - 1];
        if (z === "") return _[_.length - 2];
        return z
    }
})
// @from(Ln 228530, Col 4)
bD4 = p((CGw, CD4) => {
    var ED4 = me6(),
        {
            CHAR_ASTERISK: pU1,
            CHAR_AT: z5z,
            CHAR_BACKWARD_SLASH: Be6,
            CHAR_COMMA: Y5z,
            CHAR_DOT: FU1,
            CHAR_EXCLAMATION_MARK: gU1,
            CHAR_FORWARD_SLASH: SD4,
            CHAR_LEFT_CURLY_BRACE: UU1,
            CHAR_LEFT_PARENTHESES: QU1,
            CHAR_LEFT_SQUARE_BRACKET: A5z,
            CHAR_PLUS: O5z,
            CHAR_QUESTION_MARK: yD4,
            CHAR_RIGHT_CURLY_BRACE: w5z,
            CHAR_RIGHT_PARENTHESES: LD4,
            CHAR_RIGHT_SQUARE_BRACKET: $5z
        } = ue6(),
        hD4 = (q) => {
            return q === SD4 || q === Be6
        },
        RD4 = (q) => {
            if (q.isPrefix !== !0) q.depth = q.isGlobstar ? 1 / 0 : 1
        },
        j5z = (q, K) => {
            let _ = K || {},
                z = q.length - 1,
                Y = _.parts === !0 || _.scanToEnd === !0,
                A = [],
                O = [],
                w = [],
                $ = q,
                j = -1,
                H = 0,
                J = 0,
                X = !1,
                M = !1,
                P = !1,
                W = !1,
                D = !1,
                Z = !1,
                G = !1,
                f = !1,
                v = !1,
                V = !1,
                k = 0,
                N, R, h = {
                    value: "",
                    depth: 0,
                    isGlob: !1
                },
                C = () => j >= z,
                x = () => $.charCodeAt(j + 1),
                B = () => {
                    return N = R, $.charCodeAt(++j)
                };
            while (j < z) {
                R = B();
                let g;
                if (R === Be6) {
                    if (G = h.backslashes = !0, R = B(), R === UU1) Z = !0;
                    continue
                }
                if (Z === !0 || R === UU1) {
                    k++;
                    while (C() !== !0 && (R = B())) {
                        if (R === Be6) {
                            G = h.backslashes = !0, B();
                            continue
                        }
                        if (R === UU1) {
                            k++;
                            continue
                        }
                        if (Z !== !0 && R === FU1 && (R = B()) === FU1) {
                            if (X = h.isBrace = !0, P = h.isGlob = !0, V = !0, Y === !0) continue;
                            break
                        }
                        if (Z !== !0 && R === Y5z) {
                            if (X = h.isBrace = !0, P = h.isGlob = !0, V = !0, Y === !0) continue;
                            break
                        }
                        if (R === w5z) {
                            if (k--, k === 0) {
                                Z = !1, X = h.isBrace = !0, V = !0;
                                break
                            }
                        }
                    }
                    if (Y === !0) continue;
                    break
                }
                if (R === SD4) {
                    if (A.push(j), O.push(h), h = {
                            value: "",
                            depth: 0,
                            isGlob: !1
                        }, V === !0) continue;
                    if (N === FU1 && j === H + 1) {
                        H += 2;
                        continue
                    }
                    J = j + 1;
                    continue
                }
                if (_.noext !== !0) {
                    if ((R === O5z || R === z5z || R === pU1 || R === yD4 || R === gU1) === !0 && x() === QU1) {
                        if (P = h.isGlob = !0, W = h.isExtglob = !0, V = !0, R === gU1 && j === H) v = !0;
                        if (Y === !0) {
                            while (C() !== !0 && (R = B())) {
                                if (R === Be6) {
                                    G = h.backslashes = !0, R = B();
                                    continue
                                }
                                if (R === LD4) {
                                    P = h.isGlob = !0, V = !0;
                                    break
                                }
                            }
                            continue
                        }
                        break
                    }
                }
                if (R === pU1) {
                    if (N === pU1) D = h.isGlobstar = !0;
                    if (P = h.isGlob = !0, V = !0, Y === !0) continue;
                    break
                }
                if (R === yD4) {
                    if (P = h.isGlob = !0, V = !0, Y === !0) continue;
                    break
                }
                if (R === A5z) {
                    while (C() !== !0 && (g = B())) {
                        if (g === Be6) {
                            G = h.backslashes = !0, B();
                            continue
                        }
                        if (g === $5z) {
                            M = h.isBracket = !0, P = h.isGlob = !0, V = !0;
                            break
                        }
                    }
                    if (Y === !0) continue;
                    break
                }
                if (_.nonegate !== !0 && R === gU1 && j === H) {
                    f = h.negated = !0, H++;
                    continue
                }
                if (_.noparen !== !0 && R === QU1) {
                    if (P = h.isGlob = !0, Y === !0) {
                        while (C() !== !0 && (R = B())) {
                            if (R === QU1) {
                                G = h.backslashes = !0, R = B();
                                continue
                            }
                            if (R === LD4) {
                                V = !0;
                                break
                            }
                        }
                        continue
                    }
                    break
                }
                if (P === !0) {
                    if (V = !0, Y === !0) continue;
                    break
                }
            }
            if (_.noext === !0) W = !1, P = !1;
            let m = $,
                S = "",
                F = "";
            if (H > 0) S = $.slice(0, H), $ = $.slice(H), J -= H;
            if (m && P === !0 && J > 0) m = $.slice(0, J), F = $.slice(J);
            else if (P === !0) m = "", F = $;
            else m = $;
            if (m && m !== "" && m !== "/" && m !== $) {
                if (hD4(m.charCodeAt(m.length - 1))) m = m.slice(0, -1)
            }
            if (_.unescape === !0) {
                if (F) F = ED4.removeBackslashes(F);
                if (m && G === !0) m = ED4.removeBackslashes(m)
            }
            let U = {
                prefix: S,
                input: q,
                start: H,
                base: m,
                glob: F,
                isBrace: X,
                isBracket: M,
                isGlob: P,
                isExtglob: W,
                isGlobstar: D,
                negated: f,
                negatedExtglob: v
            };
            if (_.tokens === !0) {
                if (U.maxDepth = 0, !hD4(R)) O.push(h);
                U.tokens = O
            }
            if (_.parts === !0 || _.tokens === !0) {
                let g;
                for (let c = 0; c < A.length; c++) {
                    let n = g ? g + 1 : H,
                        l = A[c],
                        z6 = q.slice(n, l);
                    if (_.tokens) {
                        if (c === 0 && H !== 0) O[c].isPrefix = !0, O[c].value = S;
                        else O[c].value = z6;
                        RD4(O[c]), U.maxDepth += O[c].depth
                    }
                    if (c !== 0 || z6 !== "") w.push(z6);
                    g = l
                }
                if (g && g + 1 < q.length) {
                    let c = q.slice(g + 1);
                    if (w.push(c), _.tokens) O[O.length - 1].value = c, RD4(O[O.length - 1]), U.maxDepth += O[O.length - 1].depth
                }
                U.slashes = A, U.parts = w
            }
            return U
        };
    CD4.exports = j5z
})
// @from(Ln 228760, Col 4)
uD4 = p((bGw, xD4) => {
    var YS8 = ue6(),
        Yc = me6(),
        {
            MAX_LENGTH: AS8,
            POSIX_REGEX_SOURCE: H5z,
            REGEX_NON_SPECIAL_CHARS: J5z,
            REGEX_SPECIAL_CHARS_BACKREF: X5z,
            REPLACEMENTS: ID4
        } = YS8,
        M5z = (q, K) => {
            if (typeof K.expandRange === "function") return K.expandRange(...q, K);
            q.sort();
            let _ = `[${q.join("-")}]`;
            try {
                new RegExp(_)
            } catch (z) {
                return q.map((Y) => Yc.escapeRegex(Y)).join("..")
            }
            return _
        },
        ry6 = (q, K) => {
            return `Missing ${q}: "${K}" - use "\\\\${K}" to match literal characters`
        },
        dU1 = (q, K) => {
            if (typeof q !== "string") throw TypeError("Expected a string");
            q = ID4[q] || q;
            let _ = {
                    ...K
                },
                z = typeof _.maxLength === "number" ? Math.min(AS8, _.maxLength) : AS8,
                Y = q.length;
            if (Y > z) throw SyntaxError(`Input length: ${Y}, exceeds maximum allowed length: ${z}`);
            let A = {
                    type: "bos",
                    value: "",
                    output: _.prepend || ""
                },
                O = [A],
                w = _.capture ? "" : "?:",
                $ = YS8.globChars(_.windows),
                j = YS8.extglobChars($),
                {
                    DOT_LITERAL: H,
                    PLUS_LITERAL: J,
                    SLASH_LITERAL: X,
                    ONE_CHAR: M,
                    DOTS_SLASH: P,
                    NO_DOT: W,
                    NO_DOT_SLASH: D,
                    NO_DOTS_SLASH: Z,
                    QMARK: G,
                    QMARK_NO_DOT: f,
                    STAR: v,
                    START_ANCHOR: V
                } = $,
                k = (H6) => {
                    return `(${w}(?:(?!${V}${H6.dot?P:H}).)*?)`
                },
                N = _.dot ? "" : W,
                R = _.dot ? G : f,
                h = _.bash === !0 ? k(_) : v;
            if (_.capture) h = `(${h})`;
            if (typeof _.noext === "boolean") _.noextglob = _.noext;
            let C = {
                input: q,
                index: -1,
                start: 0,
                dot: _.dot === !0,
                consumed: "",
                output: "",
                prefix: "",
                backtrack: !1,
                negated: !1,
                brackets: 0,
                braces: 0,
                parens: 0,
                quotes: 0,
                globstar: !1,
                tokens: O
            };
            q = Yc.removePrefix(q, C), Y = q.length;
            let x = [],
                B = [],
                m = [],
                S = A,
                F, U = () => C.index === Y - 1,
                g = C.peek = (H6 = 1) => q[C.index + H6],
                c = C.advance = () => q[++C.index] || "",
                n = () => q.slice(C.index + 1),
                l = (H6 = "", q6 = 0) => {
                    C.consumed += H6, C.index += q6
                },
                z6 = (H6) => {
                    C.output += H6.output != null ? H6.output : H6.value, l(H6.value)
                },
                A6 = () => {
                    let H6 = 1;
                    while (g() === "!" && (g(2) !== "(" || g(3) === "?")) c(), C.start++, H6++;
                    if (H6 % 2 === 0) return !1;
                    return C.negated = !0, C.start++, !0
                },
                e = (H6) => {
                    C[H6]++, m.push(H6)
                },
                i = (H6) => {
                    C[H6]--, m.pop()
                },
                O6 = (H6) => {
                    if (S.type === "globstar") {
                        let q6 = C.braces > 0 && (H6.type === "comma" || H6.type === "brace"),
                            o = H6.extglob === !0 || x.length && (H6.type === "pipe" || H6.type === "paren");
                        if (H6.type !== "slash" && H6.type !== "paren" && !q6 && !o) C.output = C.output.slice(0, -S.output.length), S.type = "star", S.value = "*", S.output = h, C.output += S.output
                    }
                    if (x.length && H6.type !== "paren") x[x.length - 1].inner += H6.value;
                    if (H6.value || H6.output) z6(H6);
                    if (S && S.type === "text" && H6.type === "text") {
                        S.output = (S.output || S.value) + H6.value, S.value += H6.value;
                        return
                    }
                    H6.prev = S, O.push(H6), S = H6
                },
                J6 = (H6, q6) => {
                    let o = {
                        ...j[q6],
                        conditions: 1,
                        inner: ""
                    };
                    o.prev = S, o.parens = C.parens, o.output = C.output;
                    let _6 = (_.capture ? "(" : "") + o.open;
                    e("parens"), O6({
                        type: H6,
                        value: q6,
                        output: C.output ? "" : M
                    }), O6({
                        type: "paren",
                        extglob: !0,
                        value: c(),
                        output: _6
                    }), x.push(o)
                },
                $6 = (H6) => {
                    let q6 = H6.close + (_.capture ? ")" : ""),
                        o;
                    if (H6.type === "negate") {
                        let _6 = h;
                        if (H6.inner && H6.inner.length > 1 && H6.inner.includes("/")) _6 = k(_);
                        if (_6 !== h || U() || /^\)+$/.test(n())) q6 = H6.close = `)$))${_6}`;
                        if (H6.inner.includes("*") && (o = n()) && /^\.[^\\/.]+$/.test(o)) {
                            let r = dU1(o, {
                                ...K,
                                fastpaths: !1
                            }).output;
                            q6 = H6.close = `)${r})${_6})`
                        }
                        if (H6.prev.type === "bos") C.negatedExtglob = !0
                    }
                    O6({
                        type: "paren",
                        extglob: !0,
                        value: F,
                        output: q6
                    }), i("parens")
                };
            if (_.fastpaths !== !1 && !/(^[*!]|[/()[\]{}"])/.test(q)) {
                let H6 = !1,
                    q6 = q.replace(X5z, (o, _6, r, t, Y6, X6) => {
                        if (t === "\\") return H6 = !0, o;
                        if (t === "?") {
                            if (_6) return _6 + t + (Y6 ? G.repeat(Y6.length) : "");
                            if (X6 === 0) return R + (Y6 ? G.repeat(Y6.length) : "");
                            return G.repeat(r.length)
                        }
                        if (t === ".") return H.repeat(r.length);
                        if (t === "*") {
                            if (_6) return _6 + t + (Y6 ? h : "");
                            return h
                        }
                        return _6 ? o : `\\${o}`
                    });
                if (H6 === !0)
                    if (_.unescape === !0) q6 = q6.replace(/\\/g, "");
                    else q6 = q6.replace(/\\+/g, (o) => {
                        return o.length % 2 === 0 ? "\\\\" : o ? "\\" : ""
                    });
                if (q6 === q && _.contains === !0) return C.output = q, C;
                return C.output = Yc.wrapOutput(q6, C, K), C
            }
            while (!U()) {
                if (F = c(), F === "\x00") continue;
                if (F === "\\") {
                    let o = g();
                    if (o === "/" && _.bash !== !0) continue;
                    if (o === "." || o === ";") continue;
                    if (!o) {
                        F += "\\", O6({
                            type: "text",
                            value: F
                        });
                        continue
                    }
                    let _6 = /^\\+/.exec(n()),
                        r = 0;
                    if (_6 && _6[0].length > 2) {
                        if (r = _6[0].length, C.index += r, r % 2 !== 0) F += "\\"
                    }
                    if (_.unescape === !0) F = c();
                    else F += c();
                    if (C.brackets === 0) {
                        O6({
                            type: "text",
                            value: F
                        });
                        continue
                    }
                }
                if (C.brackets > 0 && (F !== "]" || S.value === "[" || S.value === "[^")) {
                    if (_.posix !== !1 && F === ":") {
                        let o = S.value.slice(1);
                        if (o.includes("[")) {
                            if (S.posix = !0, o.includes(":")) {
                                let _6 = S.value.lastIndexOf("["),
                                    r = S.value.slice(0, _6),
                                    t = S.value.slice(_6 + 2),
                                    Y6 = H5z[t];
                                if (Y6) {
                                    if (S.value = r + Y6, C.backtrack = !0, c(), !A.output && O.indexOf(S) === 1) A.output = M;
                                    continue
                                }
                            }
                        }
                    }
                    if (F === "[" && g() !== ":" || F === "-" && g() === "]") F = `\\${F}`;
                    if (F === "]" && (S.value === "[" || S.value === "[^")) F = `\\${F}`;
                    if (_.posix === !0 && F === "!" && S.value === "[") F = "^";
                    S.value += F, z6({
                        value: F
                    });
                    continue
                }
                if (C.quotes === 1 && F !== '"') {
                    F = Yc.escapeRegex(F), S.value += F, z6({
                        value: F
                    });
                    continue
                }
                if (F === '"') {
                    if (C.quotes = C.quotes === 1 ? 0 : 1, _.keepQuotes === !0) O6({
                        type: "text",
                        value: F
                    });
                    continue
                }
                if (F === "(") {
                    e("parens"), O6({
                        type: "paren",
                        value: F
                    });
                    continue
                }
                if (F === ")") {
                    if (C.parens === 0 && _.strictBrackets === !0) throw SyntaxError(ry6("opening", "("));
                    let o = x[x.length - 1];
                    if (o && C.parens === o.parens + 1) {
                        $6(x.pop());
                        continue
                    }
                    O6({
                        type: "paren",
                        value: F,
                        output: C.parens ? ")" : "\\)"
                    }), i("parens");
                    continue
                }
                if (F === "[") {
                    if (_.nobracket === !0 || !n().includes("]")) {
                        if (_.nobracket !== !0 && _.strictBrackets === !0) throw SyntaxError(ry6("closing", "]"));
                        F = `\\${F}`
                    } else e("brackets");
                    O6({
                        type: "bracket",
                        value: F
                    });
                    continue
                }
                if (F === "]") {
                    if (_.nobracket === !0 || S && S.type === "bracket" && S.value.length === 1) {
                        O6({
                            type: "text",
                            value: F,
                            output: `\\${F}`
                        });
                        continue
                    }
                    if (C.brackets === 0) {
                        if (_.strictBrackets === !0) throw SyntaxError(ry6("opening", "["));
                        O6({
                            type: "text",
                            value: F,
                            output: `\\${F}`
                        });
                        continue
                    }
                    i("brackets");
                    let o = S.value.slice(1);
                    if (S.posix !== !0 && o[0] === "^" && !o.includes("/")) F = `/${F}`;
                    if (S.value += F, z6({
                            value: F
                        }), _.literalBrackets === !1 || Yc.hasRegexChars(o)) continue;
                    let _6 = Yc.escapeRegex(S.value);
                    if (C.output = C.output.slice(0, -S.value.length), _.literalBrackets === !0) {
                        C.output += _6, S.value = _6;
                        continue
                    }
                    S.value = `(${w}${_6}|${S.value})`, C.output += S.value;
                    continue
                }
                if (F === "{" && _.nobrace !== !0) {
                    e("braces");
                    let o = {
                        type: "brace",
                        value: F,
                        output: "(",
                        outputIndex: C.output.length,
                        tokensIndex: C.tokens.length
                    };
                    B.push(o), O6(o);
                    continue
                }
                if (F === "}") {
                    let o = B[B.length - 1];
                    if (_.nobrace === !0 || !o) {
                        O6({
                            type: "text",
                            value: F,
                            output: F
                        });
                        continue
                    }
                    let _6 = ")";
                    if (o.dots === !0) {
                        let r = O.slice(),
                            t = [];
                        for (let Y6 = r.length - 1; Y6 >= 0; Y6--) {
                            if (O.pop(), r[Y6].type === "brace") break;
                            if (r[Y6].type !== "dots") t.unshift(r[Y6].value)
                        }
                        _6 = M5z(t, _), C.backtrack = !0
                    }
                    if (o.comma !== !0 && o.dots !== !0) {
                        let r = C.output.slice(0, o.outputIndex),
                            t = C.tokens.slice(o.tokensIndex);
                        o.value = o.output = "\\{", F = _6 = "\\}", C.output = r;
                        for (let Y6 of t) C.output += Y6.output || Y6.value
                    }
                    O6({
                        type: "brace",
                        value: F,
                        output: _6
                    }), i("braces"), B.pop();
                    continue
                }
                if (F === "|") {
                    if (x.length > 0) x[x.length - 1].conditions++;
                    O6({
                        type: "text",
                        value: F
                    });
                    continue
                }
                if (F === ",") {
                    let o = F,
                        _6 = B[B.length - 1];
                    if (_6 && m[m.length - 1] === "braces") _6.comma = !0, o = "|";
                    O6({
                        type: "comma",
                        value: F,
                        output: o
                    });
                    continue
                }
                if (F === "/") {
                    if (S.type === "dot" && C.index === C.start + 1) {
                        C.start = C.index + 1, C.consumed = "", C.output = "", O.pop(), S = A;
                        continue
                    }
                    O6({
                        type: "slash",
                        value: F,
                        output: X
                    });
                    continue
                }
                if (F === ".") {
                    if (C.braces > 0 && S.type === "dot") {
                        if (S.value === ".") S.output = H;
                        let o = B[B.length - 1];
                        S.type = "dots", S.output += F, S.value += F, o.dots = !0;
                        continue
                    }
                    if (C.braces + C.parens === 0 && S.type !== "bos" && S.type !== "slash") {
                        O6({
                            type: "text",
                            value: F,
                            output: H
                        });
                        continue
                    }
                    O6({
                        type: "dot",
                        value: F,
                        output: H
                    });
                    continue
                }
                if (F === "?") {
                    if (!(S && S.value === "(") && _.noextglob !== !0 && g() === "(" && g(2) !== "?") {
                        J6("qmark", F);
                        continue
                    }
                    if (S && S.type === "paren") {
                        let _6 = g(),
                            r = F;
                        if (S.value === "(" && !/[!=<:]/.test(_6) || _6 === "<" && !/<([!=]|\w+>)/.test(n())) r = `\\${F}`;
                        O6({
                            type: "text",
                            value: F,
                            output: r
                        });
                        continue
                    }
                    if (_.dot !== !0 && (S.type === "slash" || S.type === "bos")) {
                        O6({
                            type: "qmark",
                            value: F,
                            output: f
                        });
                        continue
                    }
                    O6({
                        type: "qmark",
                        value: F,
                        output: G
                    });
                    continue
                }
                if (F === "!") {
                    if (_.noextglob !== !0 && g() === "(") {
                        if (g(2) !== "?" || !/[!=<:]/.test(g(3))) {
                            J6("negate", F);
                            continue
                        }
                    }
                    if (_.nonegate !== !0 && C.index === 0) {
                        A6();
                        continue
                    }
                }
                if (F === "+") {
                    if (_.noextglob !== !0 && g() === "(" && g(2) !== "?") {
                        J6("plus", F);
                        continue
                    }
                    if (S && S.value === "(" || _.regex === !1) {
                        O6({
                            type: "plus",
                            value: F,
                            output: J
                        });
                        continue
                    }
                    if (S && (S.type === "bracket" || S.type === "paren" || S.type === "brace") || C.parens > 0) {
                        O6({
                            type: "plus",
                            value: F
                        });
                        continue
                    }
                    O6({
                        type: "plus",
                        value: J
                    });
                    continue
                }
                if (F === "@") {
                    if (_.noextglob !== !0 && g() === "(" && g(2) !== "?") {
                        O6({
                            type: "at",
                            extglob: !0,
                            value: F,
                            output: ""
                        });
                        continue
                    }
                    O6({
                        type: "text",
                        value: F
                    });
                    continue
                }
                if (F !== "*") {
                    if (F === "$" || F === "^") F = `\\${F}`;
                    let o = J5z.exec(n());
                    if (o) F += o[0], C.index += o[0].length;
                    O6({
                        type: "text",
                        value: F
                    });
                    continue
                }
                if (S && (S.type === "globstar" || S.star === !0)) {
                    S.type = "star", S.star = !0, S.value += F, S.output = h, C.backtrack = !0, C.globstar = !0, l(F);
                    continue
                }
                let H6 = n();
                if (_.noextglob !== !0 && /^\([^?]/.test(H6)) {
                    J6("star", F);
                    continue
                }
                if (S.type === "star") {
                    if (_.noglobstar === !0) {
                        l(F);
                        continue
                    }
                    let o = S.prev,
                        _6 = o.prev,
                        r = o.type === "slash" || o.type === "bos",
                        t = _6 && (_6.type === "star" || _6.type === "globstar");
                    if (_.bash === !0 && (!r || H6[0] && H6[0] !== "/")) {
                        O6({
                            type: "star",
                            value: F,
                            output: ""
                        });
                        continue
                    }
                    let Y6 = C.braces > 0 && (o.type === "comma" || o.type === "brace"),
                        X6 = x.length && (o.type === "pipe" || o.type === "paren");
                    if (!r && o.type !== "paren" && !Y6 && !X6) {
                        O6({
                            type: "star",
                            value: F,
                            output: ""
                        });
                        continue
                    }
                    while (H6.slice(0, 3) === "/**") {
                        let M6 = q[C.index + 4];
                        if (M6 && M6 !== "/") break;
                        H6 = H6.slice(3), l("/**", 3)
                    }
                    if (o.type === "bos" && U()) {
                        S.type = "globstar", S.value += F, S.output = k(_), C.output = S.output, C.globstar = !0, l(F);
                        continue
                    }
                    if (o.type === "slash" && o.prev.type !== "bos" && !t && U()) {
                        C.output = C.output.slice(0, -(o.output + S.output).length), o.output = `(?:${o.output}`, S.type = "globstar", S.output = k(_) + (_.strictSlashes ? ")" : "|$)"), S.value += F, C.globstar = !0, C.output += o.output + S.output, l(F);
                        continue
                    }
                    if (o.type === "slash" && o.prev.type !== "bos" && H6[0] === "/") {
                        let M6 = H6[1] !== void 0 ? "|$" : "";
                        C.output = C.output.slice(0, -(o.output + S.output).length), o.output = `(?:${o.output}`, S.type = "globstar", S.output = `${k(_)}${X}|${X}${M6})`, S.value += F, C.output += o.output + S.output, C.globstar = !0, l(F + c()), O6({
                            type: "slash",
                            value: "/",
                            output: ""
                        });
                        continue
                    }
                    if (o.type === "bos" && H6[0] === "/") {
                        S.type = "globstar", S.value += F, S.output = `(?:^|${X}|${k(_)}${X})`, C.output = S.output, C.globstar = !0, l(F + c()), O6({
                            type: "slash",
                            value: "/",
                            output: ""
                        });
                        continue
                    }
                    C.output = C.output.slice(0, -S.output.length), S.type = "globstar", S.output = k(_), S.value += F, C.output += S.output, C.globstar = !0, l(F);
                    continue
                }
                let q6 = {
                    type: "star",
                    value: F,
                    output: h
                };
                if (_.bash === !0) {
                    if (q6.output = ".*?", S.type === "bos" || S.type === "slash") q6.output = N + q6.output;
                    O6(q6);
                    continue
                }
                if (S && (S.type === "bracket" || S.type === "paren") && _.regex === !0) {
                    q6.output = F, O6(q6);
                    continue
                }
                if (C.index === C.start || S.type === "slash" || S.type === "dot") {
                    if (S.type === "dot") C.output += D, S.output += D;
                    else if (_.dot === !0) C.output += Z, S.output += Z;
                    else C.output += N, S.output += N;
                    if (g() !== "*") C.output += M, S.output += M
                }
                O6(q6)
            }
            while (C.brackets > 0) {
                if (_.strictBrackets === !0) throw SyntaxError(ry6("closing", "]"));
                C.output = Yc.escapeLast(C.output, "["), i("brackets")
            }
            while (C.parens > 0) {
                if (_.strictBrackets === !0) throw SyntaxError(ry6("closing", ")"));
                C.output = Yc.escapeLast(C.output, "("), i("parens")
            }
            while (C.braces > 0) {
                if (_.strictBrackets === !0) throw SyntaxError(ry6("closing", "}"));
                C.output = Yc.escapeLast(C.output, "{"), i("braces")
            }
            if (_.strictSlashes !== !0 && (S.type === "star" || S.type === "bracket")) O6({
                type: "maybe_slash",
                value: "",
                output: `${X}?`
            });
            if (C.backtrack === !0) {
                C.output = "";
                for (let H6 of C.tokens)
                    if (C.output += H6.output != null ? H6.output : H6.value, H6.suffix) C.output += H6.suffix
            }
            return C
        };
    dU1.fastpaths = (q, K) => {
        let _ = {
                ...K
            },
            z = typeof _.maxLength === "number" ? Math.min(AS8, _.maxLength) : AS8,
            Y = q.length;
        if (Y > z) throw SyntaxError(`Input length: ${Y}, exceeds maximum allowed length: ${z}`);
        q = ID4[q] || q;
        let {
            DOT_LITERAL: A,
            SLASH_LITERAL: O,
            ONE_CHAR: w,
            DOTS_SLASH: $,
            NO_DOT: j,
            NO_DOTS: H,
            NO_DOTS_SLASH: J,
            STAR: X,
            START_ANCHOR: M
        } = YS8.globChars(_.windows), P = _.dot ? H : j, W = _.dot ? J : j, D = _.capture ? "" : "?:", Z = {
            negated: !1,
            prefix: ""
        }, G = _.bash === !0 ? ".*?" : X;
        if (_.capture) G = `(${G})`;
        let f = (N) => {
                if (N.noglobstar === !0) return G;
                return `(${D}(?:(?!${M}${N.dot?$:A}).)*?)`
            },
            v = (N) => {
                switch (N) {
                    case "*":
                        return `${P}${w}${G}`;
                    case ".*":
                        return `${A}${w}${G}`;
                    case "*.*":
                        return `${P}${G}${A}${w}${G}`;
                    case "*/*":
                        return `${P}${G}${O}${w}${W}${G}`;
                    case "**":
                        return P + f(_);
                    case "**/*":
                        return `(?:${P}${f(_)}${O})?${W}${w}${G}`;
                    case "**/*.*":
                        return `(?:${P}${f(_)}${O})?${W}${G}${A}${w}${G}`;
                    case "**/.*":
                        return `(?:${P}${f(_)}${O})?${A}${w}${G}`;
                    default: {
                        let R = /^(.*?)\.(\w+)$/.exec(N);
                        if (!R) return;
                        let h = v(R[1]);
                        if (!h) return;
                        return h + A + R[2]
                    }
                }
            },
            V = Yc.removePrefix(q, Z),
            k = v(V);
        if (k && _.strictSlashes !== !0) k += `${O}?`;
        return k
    };
    xD4.exports = dU1
})
// @from(Ln 229446, Col 4)
pD4 = p((IGw, BD4) => {
    var P5z = bD4(),
        cU1 = uD4(),
        mD4 = me6(),
        W5z = ue6(),
        D5z = (q) => q && typeof q === "object" && !Array.isArray(q),
        MM = (q, K, _ = !1) => {
            if (Array.isArray(q)) {
                let H = q.map((X) => MM(X, K, _));
                return (X) => {
                    for (let M of H) {
                        let P = M(X);
                        if (P) return P
                    }
                    return !1
                }
            }
            let z = D5z(q) && q.tokens && q.input;
            if (q === "" || typeof q !== "string" && !z) throw TypeError("Expected pattern to be a non-empty string");
            let Y = K || {},
                A = Y.windows,
                O = z ? MM.compileRe(q, K) : MM.makeRe(q, K, !1, !0),
                w = O.state;
            delete O.state;
            let $ = () => !1;
            if (Y.ignore) {
                let H = {
                    ...K,
                    ignore: null,
                    onMatch: null,
                    onResult: null
                };
                $ = MM(Y.ignore, H, _)
            }
            let j = (H, J = !1) => {
                let {
                    isMatch: X,
                    match: M,
                    output: P
                } = MM.test(H, O, K, {
                    glob: q,
                    posix: A
                }), W = {
                    glob: q,
                    state: w,
                    regex: O,
                    posix: A,
                    input: H,
                    output: P,
                    match: M,
                    isMatch: X
                };
                if (typeof Y.onResult === "function") Y.onResult(W);
                if (X === !1) return W.isMatch = !1, J ? W : !1;
                if ($(H)) {
                    if (typeof Y.onIgnore === "function") Y.onIgnore(W);
                    return W.isMatch = !1, J ? W : !1
                }
                if (typeof Y.onMatch === "function") Y.onMatch(W);
                return J ? W : !0
            };
            if (_) j.state = w;
            return j
        };
    MM.test = (q, K, _, {
        glob: z,
        posix: Y
    } = {}) => {
        if (typeof q !== "string") throw TypeError("Expected input to be a string");
        if (q === "") return {
            isMatch: !1,
            output: ""
        };
        let A = _ || {},
            O = A.format || (Y ? mD4.toPosixSlashes : null),
            w = q === z,
            $ = w && O ? O(q) : q;
        if (w === !1) $ = O ? O(q) : q, w = $ === z;
        if (w === !1 || A.capture === !0)
            if (A.matchBase === !0 || A.basename === !0) w = MM.matchBase(q, K, _, Y);
            else w = K.exec($);
        return {
            isMatch: Boolean(w),
            match: w,
            output: $
        }
    };
    MM.matchBase = (q, K, _) => {
        return (K instanceof RegExp ? K : MM.makeRe(K, _)).test(mD4.basename(q))
    };
    MM.isMatch = (q, K, _) => MM(K, _)(q);
    MM.parse = (q, K) => {
        if (Array.isArray(q)) return q.map((_) => MM.parse(_, K));
        return cU1(q, {
            ...K,
            fastpaths: !1
        })
    };
    MM.scan = (q, K) => P5z(q, K);
    MM.compileRe = (q, K, _ = !1, z = !1) => {
        if (_ === !0) return q.output;
        let Y = K || {},
            A = Y.contains ? "" : "^",
            O = Y.contains ? "" : "$",
            w = `${A}(?:${q.output})${O}`;
        if (q && q.negated === !0) w = `^(?!${w}).*$`;
        let $ = MM.toRegex(w, K);
        if (z === !0) $.state = q;
        return $
    };
    MM.makeRe = (q, K = {}, _ = !1, z = !1) => {
        if (!q || typeof q !== "string") throw TypeError("Expected a non-empty string");
        let Y = {
            negated: !1,
            fastpaths: !0
        };
        if (K.fastpaths !== !1 && (q[0] === "." || q[0] === "*")) Y.output = cU1.fastpaths(q, K);
        if (!Y.output) Y = cU1(q, K);
        return MM.compileRe(Y, K, _, z)
    };
    MM.toRegex = (q, K) => {
        try {
            let _ = K || {};
            return new RegExp(q, _.flags || (_.nocase ? "i" : ""))
        } catch (_) {
            if (K && K.debug === !0) throw _;
            return /$^/
        }
    };
    MM.constants = W5z;
    BD4.exports = MM
})
// @from(Ln 229578, Col 4)
QD4 = p((xGw, UD4) => {
    var FD4 = pD4(),
        Z5z = me6();

    function gD4(q, K, _ = !1) {
        if (K && (K.windows === null || K.windows === void 0)) K = {
            ...K,
            windows: Z5z.isWindows()
        };
        return FD4(q, K, _)
    }
    Object.assign(gD4, FD4);
    UD4.exports = gD4
})
// @from(Ln 229599, Col 0)
function dD4(q) {
    if (typeof Bun < "u") return Bun.hash(q).toString(36);
    return f5z("sha1").update(q).digest("base64url")
}
// @from(Ln 229604, Col 0)
function Ac(q, K) {
    if (q.contentHash !== void 0) return q.contentHash === dD4(K);
    return q.content === K
}
// @from(Ln 229608, Col 0)
class cD4 {
    cache;
    constructor(q, K) {
        this.cache = new iN({
            max: q,
            maxSize: K,
            sizeCalculation: (_) => Math.max(1, Buffer.byteLength(_.content))
        })
    }
    get(q) {
        return this.cache.get(OS8(q))
    }
    set(q, K) {
        let _ = OS8(q),
            z = this.cache.get(_),
            Y = K.keepContent ?? z?.keepContent,
            A = K.contentHash ?? dD4(K.content),
            O = K.contentLength ?? K.content.length,
            w = Y && K.content === "" && A === z?.contentHash && z.content ? z.content : K.content,
            $ = Y || Buffer.byteLength(w) <= v5z ? w : "";
        return this.cache.set(_, {
            ...K,
            keepContent: Y,
            contentHash: A,
            contentLength: O,
            content: $
        }), this
    }
    has(q) {
        return this.cache.has(OS8(q))
    }
    delete(q) {
        return this.cache.delete(OS8(q))
    }
    clear() {
        this.cache.clear()
    }
    get size() {
        return this.cache.size
    }
    get max() {
        return this.cache.max
    }
    get maxSize() {
        return this.cache.maxSize
    }
    get calculatedSize() {
        return this.cache.calculatedSize
    }
    keys() {
        return this.cache.keys()
    }
    entries() {
        return this.cache.entries()
    }
    dump() {
        return this.cache.dump()
    }
    load(q) {
        this.cache.load(q)
    }
}
// @from(Ln 229671, Col 0)
function CR(q, K = G5z) {
    return new cD4(q, K)
}
// @from(Ln 229675, Col 0)
function pe6(q) {
    return Object.fromEntries(q.entries())
}
// @from(Ln 229679, Col 0)
function gK6(q) {
    return Array.from(q.keys())
}
// @from(Ln 229683, Col 0)
function Cs(q) {
    let K = CR(q.max, q.maxSize);
    return K.load(q.dump()), K
}
// @from(Ln 229688, Col 0)
function oy6(q, K) {
    let _ = Cs(q);
    for (let [z, Y] of K.entries()) {
        let A = _.get(z);
        if (!A || Y.timestamp > A.timestamp) _.set(z, Y)
    }
    return _
}
// @from(Ln 229696, Col 4)
oI = 100
// @from(Ln 229697, Col 4)
G5z = 26214400
// @from(Ln 229698, Col 4)
v5z = 4096
// @from(Ln 229699, Col 4)
FP = L(() => {
    If6()
})
// @from(Ln 229702, Col 4)
qZ4 = {}
// @from(Ln 229735, Col 0)
function oD4(q) {
    return iE(q, Y7())
}
// @from(Ln 229739, Col 0)
function L5z(q) {
    let {
        frontmatter: K,
        content: _
    } = p2(q);
    if (!K.paths) return {
        content: _
    };
    let z = Lt6(K.paths).map((Y) => {
        return Y.endsWith("/**") ? Y.slice(0, -3) : Y
    }).filter((Y) => Y.length > 0);
    if (z.length === 0 || z.every((Y) => Y === "**")) return {
        content: _
    };
    return {
        content: _,
        paths: z
    }
}
// @from(Ln 229759, Col 0)
function h5z(q) {
    if (!q.includes("<!--")) return {
        content: q,
        stripped: !1
    };
    return aD4(new yk({
        gfm: !1
    }).lex(q))
}
// @from(Ln 229769, Col 0)
function aD4(q) {
    let K = "",
        _ = !1,
        z = /<!--[\s\S]*?-->/g;
    for (let Y of q) {
        if (Y.type === "html") {
            let A = Y.raw.trimStart();
            if (A.startsWith("<!--") && A.includes("-->")) {
                let O = Y.raw.replace(z, "");
                if (_ = !0, O.trim().length > 0) K += O;
                continue
            }
        }
        K += Y.raw
    }
    return {
        content: K,
        stripped: _
    }
}
// @from(Ln 229790, Col 0)
function R5z(q, K, _, z) {
    let Y = V5z(K).toLowerCase();
    if (Y && !y5z.has(Y)) return E(`Skipping non-text file in @include: ${K}`), {
        info: null,
        includePaths: []
    };
    let {
        content: A,
        paths: O
    } = L5z(q), w = A.includes("<!--"), $ = w || z !== void 0 ? new yk({
        gfm: !1
    }).lex(A) : void 0, j = w && $ ? aD4($).content : A, H = $ && z !== void 0 ? C5z($, z) : [], J = j;
    if (_ === "AutoMem") J = eU1(j).content;
    let X = J !== q;
    return {
        info: {
            path: K,
            type: _,
            content: J,
            globs: O,
            contentDiffersFromDisk: X,
            rawContent: X ? q : void 0
        },
        includePaths: H
    }
}
// @from(Ln 229817, Col 0)
function S5z(q, K) {
    let _ = Q1(q);
    if (_ === "ENOENT" || _ === "EISDIR") return;
    if (_ === "EACCES") d("tengu_claude_md_permission_error", {
        is_access_error: 1,
        has_home_dir: K.includes(A7()) ? 1 : 0
    })
}
// @from(Ln 229825, Col 0)
async function sD4(q, K, _) {
    try {
        let Y = await V8().readFile(q, {
            encoding: "utf-8"
        });
        return R5z(Y, q, K, _)
    } catch (z) {
        return S5z(z, q), {
            info: null,
            includePaths: []
        }
    }
}
// @from(Ln 229839, Col 0)
function C5z(q, K) {
    let _ = new Set;

    function z(A) {
        let O = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,
            w;
        while ((w = O.exec(A)) !== null) {
            let $ = w[1];
            if (!$) continue;
            let j = $.indexOf("#");
            if (j !== -1) $ = $.substring(0, j);
            if (!$) continue;
            if ($ = $.replaceAll("\\ ", " "), $) {
                if ($.startsWith("./") || $.startsWith("~/") || $.startsWith("/") && $ !== "/" || !$.startsWith("@") && !$.match(/^[#%^&*()]+/) && $.match(/^[a-zA-Z0-9._-]/)) {
                    let J = Wq($, Fe6(K));
                    _.add(J)
                }
            }
        }
    }

    function Y(A) {
        for (let O of A) {
            if (O.type === "code" || O.type === "codespan") continue;
            if (O.type === "html") {
                let w = O.raw || "",
                    $ = w.trimStart();
                if ($.startsWith("<!--") && $.includes("-->")) {
                    let j = /<!--[\s\S]*?-->/g,
                        H = w.replace(j, "");
                    if (H.trim().length > 0) z(H)
                }
                continue
            }
            if (O.type === "text") z(O.text || "");
            if (O.tokens) Y(O.tokens);
            if (O.items) Y(O.items)
        }
    }
    return Y(q), [..._]
}
// @from(Ln 229881, Col 0)
function I5z(q, K) {
    if (K !== "User" && K !== "Project" && K !== "Local") return !1;
    let _ = v7().claudeMdExcludes;
    if (!_ || _.length === 0) return !1;
    let z = {
            dot: !0
        },
        Y = q.replaceAll("\\", "/"),
        A = x5z(_).filter((O) => O.length > 0);
    if (A.length === 0) return !1;
    return rD4.default.isMatch(Y, A, z)
}
// @from(Ln 229894, Col 0)
function x5z(q) {
    let K = V8(),
        _ = q.map((z) => z.replaceAll("\\", "/"));
    for (let z of _) {
        if (!z.startsWith("/")) continue;
        let Y = z.search(/[*?{[]/),
            A = Y === -1 ? z : z.slice(0, Y),
            O = Fe6(A);
        try {
            let w = K.realpathSync(O).replaceAll("\\", "/");
            if (w !== O) {
                let $ = w + z.slice(O.length);
                _.push($)
            }
        } catch {}
    }
    return _
}
// @from(Ln 229912, Col 0)
async function Hy(q, K, _, z, Y = 0, A) {
    let O = tX(q);
    if (_.has(O) || Y >= b5z) return [];
    if (I5z(q, K)) return [];
    let {
        resolvedPath: w,
        isSymlink: $
    } = vA(V8(), q);
    if (_.add(O), $) _.add(tX(w));
    let {
        info: j,
        includePaths: H
    } = await sD4(q, K, w);
    if (!j || !j.content.trim()) return [];
    if (A) j.parent = A;
    let J = [];
    J.push(j);
    for (let X of H) {
        if (!oD4(X) && !z) continue;
        let P = await Hy(X, K, _, z, Y + 1, q);
        J.push(...P)
    }
    return J
}
// @from(Ln 229936, Col 0)
async function UK6({
    rulesDir: q,
    type: K,
    processedPaths: _,
    includeExternal: z,
    conditionalRule: Y,
    visitedDirs: A = new Set
}) {
    if (A.has(q)) return [];
    try {
        let O = V8(),
            {
                resolvedPath: w,
                isSymlink: $
            } = vA(O, q);
        if (A.add(q), $) A.add(w);
        let j = [],
            H;
        try {
            H = await O.readdir(w)
        } catch (J) {
            let X = Q1(J);
            if (X === "ENOENT" || X === "EACCES" || X === "ENOTDIR") return [];
            throw J
        }
        for (let J of H) {
            let X = jy(q, J.name),
                {
                    resolvedPath: M,
                    isSymlink: P
                } = vA(O, X),
                W = P ? await O.stat(M) : null,
                D = W ? W.isDirectory() : J.isDirectory(),
                Z = W ? W.isFile() : J.isFile();
            if (D) j.push(...await UK6({
                rulesDir: M,
                type: K,
                processedPaths: _,
                includeExternal: z,
                conditionalRule: Y,
                visitedDirs: A
            }));
            else if (Z && J.name.endsWith(".md")) {
                let G = await Hy(M, K, _, z);
                j.push(...G.filter((f) => Y ? f.globs : !f.globs))
            }
        }
        return j
    } catch (O) {
        if (O instanceof Error && O.message.includes("EACCES")) d("tengu_claude_rules_md_permission_error", {
            is_access_error: 1,
            has_home_dir: q.includes(A7()) ? 1 : 0
        });
        return []
    }
}
// @from(Ln 229993, Col 0)
function tD4(q) {
    return q === "User" || q === "Project" || q === "Local" || q === "Managed"
}
// @from(Ln 229997, Col 0)
function u5z() {
    if (!iU1) return;
    iU1 = !1;
    let q = nU1;
    return nU1 = "session_start", q
}
// @from(Ln 230004, Col 0)
function Lk() {
    GJ.cache?.clear?.()
}
// @from(Ln 230008, Col 0)
function Ue6(q = "session_start") {
    nU1 = q, iU1 = !0, Lk()
}
// @from(Ln 230012, Col 0)
function QK6(q) {
    return q.filter((K) => tD4(K.type) && K.content.length > Oc)
}
// @from(Ln 230016, Col 0)
function Qe6(q) {
    if (!u8("tengu_moth_copse", !1)) return q;
    return q.filter((_) => _.type !== "AutoMem")
}
// @from(Ln 230020, Col 0)
async function oU1(q, K) {
    let _ = [],
        z = pk8();
    if (_.push(...await ge6(q, z, "Managed", K, !1)), L2("userSettings")) {
        let Y = Fk8();
        _.push(...await ge6(q, Y, "User", K, !0))
    }
    return _
}
// @from(Ln 230029, Col 0)
async function aU1(q, K, _) {
    let z = [];
    if (L2("projectSettings")) {
        let O = jy(q, "CLAUDE.md");
        z.push(...await Hy(O, "Project", _, !1));
        let w = jy(q, ".claude", "CLAUDE.md");
        z.push(...await Hy(w, "Project", _, !1))
    }
    if (L2("localSettings")) {
        let O = jy(q, "CLAUDE.local.md");
        z.push(...await Hy(O, "Local", _, !1))
    }
    let Y = jy(q, ".claude", "rules"),
        A = new Set(_);
    z.push(...await UK6({
        rulesDir: Y,
        type: "Project",
        processedPaths: A,
        includeExternal: !1,
        conditionalRule: !1
    })), z.push(...await ge6(K, Y, "Project", _, !1));
    for (let O of A) _.add(O);
    return z
}
// @from(Ln 230053, Col 0)
async function sU1(q, K, _) {
    let z = jy(q, ".claude", "rules");
    return ge6(K, z, "Project", _, !1)
}
// @from(Ln 230057, Col 0)
async function ge6(q, K, _, z, Y) {
    return (await UK6({
        rulesDir: K,
        type: _,
        processedPaths: z,
        includeExternal: Y,
        conditionalRule: !0
    })).filter((O) => {
        if (!O.globs || O.globs.length === 0) return !1;
        let w = _ === "Project" ? Fe6(Fe6(K)) : Y7(),
            $ = lD4(q) ? N5z(w, q) : q;
        if (!$ || $.startsWith("..") || lD4($)) return !1;
        return iD4.default().add(O.globs).ignores($)
    })
}
// @from(Ln 230073, Col 0)
function ay6(q) {
    let K = [];
    for (let _ of q)
        if (_.type !== "User" && _.parent && !oD4(_.path)) K.push({
            path: _.path,
            parent: _.parent
        });
    return K
}
// @from(Ln 230083, Col 0)
function wS8(q) {
    return ay6(q).length > 0
}
// @from(Ln 230086, Col 0)
async function tU1() {
    let q = Ew();
    if (q.hasClaudeMdExternalIncludesApproved || q.hasClaudeMdExternalIncludesWarningShown) return !1;
    return wS8(await GJ(!0))
}
// @from(Ln 230092, Col 0)
function eD4(q) {
    let K = T5z(q);
    if (K === "CLAUDE.md" || K === "CLAUDE.local.md") return !0;
    if (K.endsWith(".md") && q.includes(`${lU1}.claude${lU1}rules${lU1}`)) return !0;
    return !1
}
// @from(Ln 230099, Col 0)
function m5z(q, K) {
    let _ = new Set;
    for (let z of q)
        if (z.content.trim().length > 0) _.add(z.path);
    for (let z of gK6(K))
        if (eD4(z)) _.add(z);
    return Array.from(_)
}
// @from(Ln 230107, Col 4)
iD4
// @from(Ln 230107, Col 9)
rD4
// @from(Ln 230107, Col 14)
nD4 = !1
// @from(Ln 230108, Col 4)
E5z = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."
// @from(Ln 230109, Col 4)
Oc = 40000
// @from(Ln 230110, Col 4)
y5z
// @from(Ln 230110, Col 9)
b5z = 5
// @from(Ln 230111, Col 4)
GJ
// @from(Ln 230111, Col 8)
nU1 = "session_start"
// @from(Ln 230112, Col 4)
iU1 = !0
// @from(Ln 230113, Col 4)
rU1 = (q, K) => {
        let _ = [],
            z = u8("tengu_paper_halyard", !1);
        for (let Y of q) {
            if (K && !K(Y.type)) continue;
            if (z && (Y.type === "Project" || Y.type === "Local")) continue;
            if (Y.content) {
                let A = Y.type === "Project" ? " (project instructions, checked into the codebase)" : Y.type === "Local" ? " (user's private project instructions, not checked in)" : Y.type === "AutoMem" ? " (user's auto-memory, persists across conversations)" : " (user's private global instructions for all projects)",
                    O = Y.content.trim();
                _.push(`Contents of ${Y.path}${A}:

${O}`)
            }
        }
        if (_.length === 0) return "";
        return `${E5z}

${_.join(`

`)}`
    }
// @from(Ln 230134, Col 4)
PM = L(() => {
    U4();
    xe6();
    C8();
    y8();
    sy6();
    VY();
    B1();
    h1();
    K8();
    VA();
    Q8();
    m8();
    eK();
    FP();
    Lf();
    Yq();
    pK();
    K9();
    b9();
    Sz();
    aY();
    a1();
    iD4 = K6(X$6(), 1), rD4 = K6(QD4(), 1), y5z = new Set([".md", ".txt", ".text", ".json", ".yaml", ".yml", ".toml", ".xml", ".csv", ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".py", ".pyi", ".pyw", ".rb", ".erb", ".rake", ".go", ".rs", ".java", ".kt", ".kts", ".scala", ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hxx", ".cs", ".swift", ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd", ".env", ".ini", ".cfg", ".conf", ".config", ".properties", ".sql", ".graphql", ".gql", ".proto", ".vue", ".svelte", ".astro", ".ejs", ".hbs", ".pug", ".jade", ".php", ".pl", ".pm", ".lua", ".r", ".R", ".dart", ".ex", ".exs", ".erl", ".hrl", ".clj", ".cljs", ".cljc", ".edn", ".hs", ".lhs", ".elm", ".ml", ".mli", ".f", ".f90", ".f95", ".for", ".cmake", ".make", ".makefile", ".gradle", ".sbt", ".rst", ".adoc", ".asciidoc", ".org", ".tex", ".latex", ".lock", ".log", ".diff", ".patch"]);
    GJ = P1(async (q = !1) => {
        let K = Date.now();
        j1("info", "memory_files_started");
        let _ = [],
            z = new Set,
            Y = Ew(),
            A = q || Y.hasClaudeMdExternalIncludesApproved || !1,
            O = H$6("Managed");
        _.push(...await Hy(O, "Managed", z, A));
        let w = pk8();
        if (_.push(...await UK6({
                rulesDir: w,
                type: "Managed",
                processedPaths: z,
                includeExternal: A,
                conditionalRule: !1
            })), L2("userSettings")) {
            let D = H$6("User");
            _.push(...await Hy(D, "User", z, !0));
            let Z = Fk8();
            _.push(...await UK6({
                rulesDir: Z,
                type: "User",
                processedPaths: z,
                includeExternal: !0,
                conditionalRule: !1
            }))
        }
        let $ = [],
            j = Y7(),
            H = j;
        while (H !== k5z(H).root) $.push(H), H = Fe6(H);
        let J = ez(j),
            X = zj(j),
            M = J !== null && X !== null && tX(J) !== tX(X) && iE(J, X);
        for (let D of $.reverse()) {
            let Z = M && iE(D, X) && !iE(D, J);
            if (L2("projectSettings") && !Z) {
                let G = jy(D, "CLAUDE.md");
                _.push(...await Hy(G, "Project", z, A));
                let f = jy(D, ".claude", "CLAUDE.md");
                _.push(...await Hy(f, "Project", z, A));
                let v = jy(D, ".claude", "rules");
                _.push(...await UK6({
                    rulesDir: v,
                    type: "Project",
                    processedPaths: z,
                    includeExternal: A,
                    conditionalRule: !1
                }))
            }
            if (L2("localSettings")) {
                let G = jy(D, "CLAUDE.local.md");
                _.push(...await Hy(G, "Local", z, A))
            }
        }
        if (S6(process.env.CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD)) {
            let D = tG();
            for (let Z of D) {
                let G = jy(Z, "CLAUDE.md");
                _.push(...await Hy(G, "Project", z, A));
                let f = jy(Z, ".claude", "CLAUDE.md");
                _.push(...await Hy(f, "Project", z, A));
                let v = jy(Z, ".claude", "rules");
                if (_.push(...await UK6({
                        rulesDir: v,
                        type: "Project",
                        processedPaths: z,
                        includeExternal: A,
                        conditionalRule: !1
                    })), L2("localSettings")) {
                    let V = jy(Z, "CLAUDE.local.md");
                    _.push(...await Hy(V, "Local", z, A))
                }
            }
        }
        if (x3()) {
            let {
                info: D
            } = await sD4(Rk8(), "AutoMem");
            if (D) {
                let Z = tX(D.path);
                if (!z.has(Z)) z.add(Z), _.push(D)
            }
        }
        let P = _.reduce((D, Z) => D + Z.content.length, 0);
        j1("info", "memory_files_completed", {
            duration_ms: Date.now() - K,
            file_count: _.length,
            total_content_length: P
        });
        let W = {};
        for (let D of _) W[D.type] = (W[D.type] ?? 0) + 1;
        if (!nD4) nD4 = !0, d("tengu_claudemd__initial_load", {
            file_count: _.length,
            total_content_length: P,
            user_count: W.User ?? 0,
            project_count: W.Project ?? 0,
            local_count: W.Local ?? 0,
            managed_count: W.Managed ?? 0,
            automem_count: W.AutoMem ?? 0,
            duration_ms: Date.now() - K
        });
        if (!q) {
            let D = u5z();
            if (D !== void 0 && de6())
                for (let Z of _) {
                    if (!tD4(Z.type)) continue;
                    let G = Z.parent ? "include" : D;
                    aj6(Z.path, Z.type, G, {
                        globs: Z.globs,
                        parentFilePath: Z.parent
                    })
                }
        }
        return _
    })
})
// @from(Ln 230277, Col 0)
function $S8() {
    let q = process.env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS;
    if (S6(q)) return !1;
    if (c5(q)) return !0;
    return v7().includeGitInstructions ?? !0
}
// @from(Ln 230283, Col 4)
qQ1 = L(() => {
    Q8();
    a1()
})
// @from(Ln 230287, Col 4)
KQ1 = 2000
// @from(Ln 230288, Col 4)
_Q1
// @from(Ln 230288, Col 9)
fj
// @from(Ln 230288, Col 13)
$2
// @from(Ln 230289, Col 4)
hk = L(() => {
    U4();
    y8();
    Rj6();
    zD4();
    T7();
    PM();
    VA();
    Q8();
    Q4();
    pK();
    qQ1();
    U8();
    _Q1 = P1(async () => {
        let q = Date.now();
        j1("info", "git_status_started");
        let K = Date.now(),
            _ = await qX();
        if (j1("info", "git_is_git_check_completed", {
                duration_ms: Date.now() - K,
                is_git: _
            }), !_) return j1("info", "git_status_skipped_not_git", {
            duration_ms: Date.now() - q
        }), null;
        try {
            let z = Date.now(),
                [Y, A, O, w, $] = await Promise.all([rj(), UZ(), w1(D7(), ["--no-optional-locks", "status", "--short"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: H
                }) => H.trim()), w1(D7(), ["--no-optional-locks", "log", "--oneline", "-n", "5"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: H
                }) => H.trim()), w1(D7(), ["config", "user.name"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: H
                }) => H.trim())]);
            j1("info", "git_commands_completed", {
                duration_ms: Date.now() - z,
                status_length: O.length
            });
            let j = O.length > KQ1 ? O.substring(0, KQ1) + `
... (truncated because it exceeds 2k characters. If you need more information, run "git status" using BashTool)` : O;
            return j1("info", "git_status_completed", {
                duration_ms: Date.now() - q,
                truncated: O.length > KQ1
            }), ["This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.", `Current branch: ${Y}`, `Main branch (you will usually use this for PRs): ${A}`, ...$ ? [`Git user: ${$}`] : [], `Status:
${j||"(clean)"}`, `Recent commits:
${w}`].join(`

`)
        } catch (z) {
            return j1("error", "git_status_failed", {
                duration_ms: Date.now() - q
            }), j6(z), null
        }
    }), fj = P1(async (q) => {
        let K = Date.now();
        j1("info", "system_context_started");
        let _ = S6(process.env.CLAUDE_CODE_REMOTE) || !$S8() ? null : await _Q1();
        return j1("info", "system_context_completed", {
            duration_ms: Date.now() - K,
            has_git_status: _ !== null,
            has_injection: q !== void 0
        }), {
            ..._ && {
                gitStatus: _
            },
            ...S6(process.env.CLAUDE_CODE_PERFORCE_MODE) && {
                perforceMode: "This is a Perforce workspace. Files not yet opened for edit are read-only; if a file is read-only, run `p4 edit <file>` via Bash to check it out before modifying. Files that are already writable have been opened and can be edited directly."
            },
            ...{}
        }
    }), $2 = P1(async () => {
        let q = Date.now();
        j1("info", "user_context_started");
        let K = S6(process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) || S9() && tG().length === 0,
            _ = K ? null : rU1(Qe6(await GJ()));
        N81(_ || null), j1("info", "user_context_completed", {
            duration_ms: Date.now() - q,
            claudemd_length: _?.length ?? 0,
            claudemd_disabled: Boolean(K)
        });
        let z = k_()?.emailAddress;
        return {
            ..._ && {
                claudeMd: _
            },
            ...z && {
                userEmail: `The user's email address is ${z}.`
            },
            currentDate: _D4(LK6())
        }
    })
})
// @from(Ln 230387, Col 0)
function Lp(q, K, _, z) {
    if (!K) return {
        effective: _,
        status: "valid"
    };
    let Y = parseInt(K, 10);
    if (isNaN(Y) || Y <= 0) {
        let A = {
            effective: _,
            status: "invalid",
            message: `Invalid value "${K}" (using default: ${_})`
        };
        return E(`${q} ${A.message}`), A
    }
    if (Y > z) {
        let A = {
            effective: z,
            status: "capped",
            message: `Capped from ${Y} to ${z}`
        };
        return E(`${q} ${A.message}`), A
    }
    return {
        effective: Y,
        status: "valid"
    }
}
// @from(Ln 230414, Col 4)
ty6 = L(() => {
    K8()
})
// @from(Ln 230417, Col 4)
_Z4 = {}
// @from(Ln 230430, Col 0)
function aI(q) {
    if (q?.type === "assistant" && "usage" in q.message && !(q.message.content[0]?.type === "text" && SK6.has(q.message.content[0].text)) && q.message.model !== $c) return q.message.usage;
    return
}
// @from(Ln 230435, Col 0)
function KZ4(q) {
    if (q?.type === "assistant" && "id" in q.message && q.message.model !== $c) return q.message.id;
    return
}
// @from(Ln 230440, Col 0)
function ey6(q) {
    return q.input_tokens + (q.cache_creation_input_tokens ?? 0) + (q.cache_read_input_tokens ?? 0) + q.output_tokens
}
// @from(Ln 230444, Col 0)
function sI(q) {
    let K = q.length - 1;
    while (K >= 0) {
        let _ = q[K],
            z = _ ? aI(_) : void 0;
        if (z) return ey6(z);
        K--
    }
    return 0
}
// @from(Ln 230455, Col 0)
function jS8(q) {
    let K = q.length - 1;
    while (K >= 0) {
        let _ = q[K],
            z = _ ? aI(_) : void 0;
        if (z) {
            let Y = z.iterations;
            if (Y && Y.length > 0) {
                let A = Y.at(-1);
                return A.input_tokens + A.output_tokens
            }
            return z.input_tokens + z.output_tokens
        }
        K--
    }
    return 0
}
// @from(Ln 230473, Col 0)
function B5z(q) {
    let K = q.length - 1;
    while (K >= 0) {
        let _ = q[K],
            z = _ ? aI(_) : void 0;
        if (z) return z.output_tokens;
        K--
    }
    return 0
}
// @from(Ln 230484, Col 0)
function ce6(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K],
            z = _ ? aI(_) : void 0;
        if (z) return {
            input_tokens: z.input_tokens,
            output_tokens: z.output_tokens,
            cache_creation_input_tokens: z.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: z.cache_read_input_tokens ?? 0
        }
    }
    return null
}
// @from(Ln 230498, Col 0)
function le6(q) {
    let _ = q.findLast((Y) => Y.type === "assistant");
    if (!_) return !1;
    let z = aI(_);
    return z ? ey6(z) > 200000 : !1
}
// @from(Ln 230505, Col 0)
function ne6(q) {
    let K = 0;
    for (let _ of q.message.content)
        if (_.type === "text") K += _.text.length;
        else if (_.type === "thinking") K += _.thinking.length;
    else if (_.type === "redacted_thinking") K += _.data.length;
    else if (_.type === "tool_use") K += I6(_.input).length;
    return K
}
// @from(Ln 230515, Col 0)
function vJ(q) {
    let K = q.length - 1;
    while (K >= 0) {
        let _ = q[K],
            z = _ ? aI(_) : void 0;
        if (_ && z) {
            let Y = KZ4(_);
            if (Y) {
                let A = K - 1;
                while (A >= 0) {
                    let O = q[A],
                        w = O ? KZ4(O) : void 0;
                    if (w === Y) K = A;
                    else if (w !== void 0) break;
                    A--
                }
            }
            return ey6(z) + qT(q.slice(K + 1))
        }
        K--
    }
    return qT(q)
}
// @from(Ln 230538, Col 4)
kD = L(() => {
    wc();
    _7();
    e8()
})
// @from(Ln 230544, Col 0)
function p5z() {
    return {
        config: {
            ...ie6
        },
        lastSummarizedMessageId: void 0,
        extractionStartedAt: void 0,
        tokensAtLastExtraction: 0,
        initialized: !1
    }
}
// @from(Ln 230556, Col 0)
function bs(q) {
    bR.lastSummarizedMessageId = q
}
// @from(Ln 230560, Col 0)
function zZ4() {
    bR.extractionStartedAt = Date.now()
}
// @from(Ln 230564, Col 0)
function YZ4() {
    bR.extractionStartedAt = void 0
}
// @from(Ln 230568, Col 0)
function AZ4(q) {
    bR.config = {
        ...bR.config,
        ...q
    }
}
// @from(Ln 230575, Col 0)
function OZ4() {
    return {
        ...bR.config
    }
}
// @from(Ln 230581, Col 0)
function wZ4(q) {
    bR.tokensAtLastExtraction = q
}
// @from(Ln 230585, Col 0)
function $Z4() {
    return bR.initialized
}
// @from(Ln 230589, Col 0)
function jZ4() {
    bR.initialized = !0
}
// @from(Ln 230593, Col 0)
function HZ4(q) {
    return q >= bR.config.minimumMessageTokensToInit
}
// @from(Ln 230597, Col 0)
function JZ4(q) {
    return q - bR.tokensAtLastExtraction >= bR.config.minimumTokensBetweenUpdate
}
// @from(Ln 230601, Col 0)
function XZ4() {
    return bR.config.toolCallsBetweenUpdates
}
// @from(Ln 230604, Col 4)
ie6
// @from(Ln 230604, Col 9)
bR
// @from(Ln 230605, Col 4)
re6 = L(() => {
    m8();
    Yq();
    Sz();
    C8();
    ie6 = {
        minimumMessageTokensToInit: 1e4,
        minimumTokensBetweenUpdate: 5000,
        toolCallsBetweenUpdates: 3
    };
    bR = p5z()
})
// @from(Ln 230618, Col 0)
function F5z(q, K, _, z) {
    var Y = q.length,
        A = _ + (z ? 1 : -1);
    while (z ? A-- : ++A < Y)
        if (K(q[A], A, q)) return A;
    return -1
}
// @from(Ln 230625, Col 4)
MZ4
// @from(Ln 230626, Col 4)
PZ4 = L(() => {
    MZ4 = F5z
})
// @from(Ln 230630, Col 0)
function g5z(q) {
    return q !== q
}
// @from(Ln 230633, Col 4)
WZ4
// @from(Ln 230634, Col 4)
DZ4 = L(() => {
    WZ4 = g5z
})
// @from(Ln 230638, Col 0)
function U5z(q, K, _) {
    var z = _ - 1,
        Y = q.length;
    while (++z < Y)
        if (q[z] === K) return z;
    return -1
}
// @from(Ln 230645, Col 4)
ZZ4
// @from(Ln 230646, Col 4)
fZ4 = L(() => {
    ZZ4 = U5z
})
// @from(Ln 230650, Col 0)
function Q5z(q, K, _) {
    return K === K ? ZZ4(q, K, _) : MZ4(q, WZ4, _)
}
// @from(Ln 230653, Col 4)
GZ4
// @from(Ln 230654, Col 4)
vZ4 = L(() => {
    PZ4();
    DZ4();
    fZ4();
    GZ4 = Q5z
})
// @from(Ln 230661, Col 0)
function d5z(q, K) {
    var _ = q == null ? 0 : q.length;
    return !!_ && GZ4(q, K, 0) > -1
}
// @from(Ln 230665, Col 4)
TZ4
// @from(Ln 230666, Col 4)
VZ4 = L(() => {
    vZ4();
    TZ4 = d5z
})
// @from(Ln 230671, Col 0)
function c5z(q, K, _) {
    var z = -1,
        Y = q == null ? 0 : q.length;
    while (++z < Y)
        if (_(K, q[z])) return !0;
    return !1
}
// @from(Ln 230678, Col 4)
kZ4
// @from(Ln 230679, Col 4)
NZ4 = L(() => {
    kZ4 = c5z
})
// @from(Ln 230682, Col 4)
l5z = 1 / 0
// @from(Ln 230683, Col 4)
n5z
// @from(Ln 230683, Col 9)
EZ4
// @from(Ln 230684, Col 4)
yZ4 = L(() => {
    X61();
    eb1();
    zO8();
    n5z = !(v86 && 1 / AD6(new v86([, -0]))[1] == l5z) ? xa : function(q) {
        return new v86(q)
    }, EZ4 = n5z
})
// @from(Ln 230693, Col 0)
function r5z(q, K, _) {
    var z = -1,
        Y = TZ4,
        A = q.length,
        O = !0,
        w = [],
        $ = w;
    if (_) O = !1, Y = kZ4;
    else if (A >= i5z) {
        var j = K ? null : EZ4(q);
        if (j) return AD6(j);
        O = !1, Y = KO8, $ = new qO8
    } else $ = K ? [] : w;
    q: while (++z < A) {
        var H = q[z],
            J = K ? K(H) : H;
        if (H = _ || H !== 0 ? H : 0, O && J === J) {
            var X = $.length;
            while (X--)
                if ($[X] === J) continue q;
            if (K) $.push(J);
            w.push(H)
        } else if (!Y($, J, _)) {
            if ($ !== w) $.push(J);
            w.push(H)
        }
    }
    return w
}
// @from(Ln 230722, Col 4)
i5z = 200
// @from(Ln 230723, Col 4)
LZ4
// @from(Ln 230724, Col 4)
hZ4 = L(() => {
    ee8();
    VZ4();
    NZ4();
    q61();
    yZ4();
    zO8();
    LZ4 = r5z
})
// @from(Ln 230734, Col 0)
function o5z(q, K) {
    return q && q.length ? LZ4(q, xN(K, 2)) : []
}
// @from(Ln 230737, Col 4)
j2
// @from(Ln 230738, Col 4)
tI = L(() => {
    N86();
    hZ4();
    j2 = o5z
})
// @from(Ln 230744, Col 0)
function dK6() {
    return {
        stateByDir: new Map,
        lastUsage: null
    }
}
// @from(Ln 230751, Col 0)
function sj6(q) {
    if (!q) return;
    q.stateByDir.clear(), q.lastUsage = null
}
// @from(Ln 230756, Col 0)
function AQ1(q, K) {
    return q.stateByDir.get(K)
}
// @from(Ln 230760, Col 0)
function OQ1(q, K, _, z, Y) {
    let A = {
        memories: _,
        byFilename: new Map(_.map((O) => [O.filename, O])),
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: `Available memories:
${z}`,
                ...Y && {
                    cache_control: Y
                }
            }]
        }]
    };
    return q.stateByDir.set(K, A), A
}
// @from(Ln 230779, Col 0)
function wQ1(q, K, _, z) {
    let Y = q.stateByDir.get(K);
    if (!Y) return;
    q.stateByDir.set(K, {
        ...Y,
        messages: [...Y.messages, {
            role: "user",
            content: [{
                type: "text",
                text: _
            }]
        }, {
            role: "assistant",
            content: [{
                type: "text",
                text: z
            }]
        }]
    })
}
// @from(Ln 230799, Col 4)
YQ1 = "memdir_relevance"
// @from(Ln 230801, Col 0)
function a5z(q) {
    return Math.max(0, Math.floor((Date.now() - q) / 86400000))
}
// @from(Ln 230805, Col 0)
function $Q1(q) {
    let K = a5z(q);
    if (K <= 1) return "";
    return `This memory is ${K} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}
// @from(Ln 230811, Col 0)
function RZ4(q) {
    let K = $Q1(q);
    if (!K) return "";
    return `<system-reminder>${K}</system-reminder>
`
}
// @from(Ln 230818, Col 0)
function jQ1(q) {
    if (!q || !q.trim()) return [];
    let K = XM(q);
    return K.length > 0 ? K : q.split(/\s+/).filter(Boolean)
}
// @from(Ln 230824, Col 0)
function HS8(q) {
    if (!q) return [];
    let K = (_) => typeof _ === "string" && _.trim() !== "" && !/^\d+$/.test(_);
    if (Array.isArray(q)) return q.filter(K);
    if (typeof q === "string") return q.split(/\s+/).filter(K);
    return []
}
// @from(Ln 230832, Col 0)
function SZ4(q, K) {
    let _ = q.slice(K.length);
    if (_.length === 0) return;
    return _.map((z) => `[${z}]`).join(" ")
}
// @from(Ln 230838, Col 0)
function qL6(q, K, _ = !0, z = []) {
    if (K === void 0 || K === null) return q;
    let Y = jQ1(K),
        A = q;
    for (let O = 0; O < z.length; O++) {
        let w = z[O];
        if (!w) continue;
        q = q.replace(new RegExp(`\\$${w}(?![\\[\\w])`, "g"), Y[O] ?? "")
    }
    if (q = q.replace(/\$ARGUMENTS\[(\d+)\]/g, (O, w) => {
            let $ = parseInt(w, 10);
            return Y[$] ?? ""
        }), q = q.replace(/\$(\d+)(?!\w)/g, (O, w) => {
            let $ = parseInt(w, 10);
            return Y[$] ?? ""
        }), q = q.replaceAll("$ARGUMENTS", K), q === A && _ && K) q = q + `

ARGUMENTS: ${K}`;
    return q
}
// @from(Ln 230858, Col 4)
oe6 = L(() => {
    vD()
})
// @from(Ln 230869, Col 0)
function JS8(q, K, _ = uP4) {
    if (!Number.isFinite(K)) return K;
    let Y = u8(K3z, {})?.[q];
    if (typeof Y === "number" && Number.isFinite(Y) && Y > 0) return Y;
    return Math.min(K, _)
}
// @from(Ln 230876, Col 0)
function _3z() {
    return HQ1(mf6(Y7()), I8())
}
// @from(Ln 230880, Col 0)
function cK6() {
    return HQ1(_3z(), JQ1)
}
// @from(Ln 230884, Col 0)
function ae6(q, K) {
    let _ = K ? "json" : "txt";
    return HQ1(cK6(), `${q}.${_}`)
}
// @from(Ln 230888, Col 0)
async function tj6() {
    try {
        await s5z(cK6(), {
            recursive: !0
        })
    } catch {}
}
// @from(Ln 230895, Col 0)
async function _L6(q, K) {
    let _ = Array.isArray(q);
    if (_) {
        if (q.some(($) => $.type !== "text")) return {
            error: "Cannot persist tool results containing non-text content"
        }
    }
    await tj6();
    let z = ae6(K, _),
        Y = _ ? I6(q, null, 2) : q;
    try {
        await t5z(z, Y, {
            encoding: "utf-8",
            flag: "wx"
        }), E(`Persisted tool result to ${z} (${o4(Y.length)})`)
    } catch (w) {
        if (Q1(w) !== "EEXIST") return j6(r1(w)), {
            error: X3z(r1(w))
        }
    }
    let {
        preview: A,
        hasMore: O
    } = se6(Y, KL6);
    return {
        filepath: z,
        originalSize: Y.length,
        isJson: _,
        preview: A,
        hasMore: O
    }
}
// @from(Ln 230928, Col 0)
function lK6(q) {
    let K = `${CZ4}
`;
    return K += `Output too large (${o4(q.originalSize)}). Full output saved to: ${q.filepath}

`, K += `Preview (first ${o4(KL6)}):
`, K += q.preview, K += q.hasMore ? `
...
` : `
`, K += e5z, K
}
// @from(Ln 230939, Col 0)
async function zL6(q, K, _) {
    let z = q.mapToolResultToToolResultBlockParam(K, _);
    return IZ4(z, q.name, JS8(q.name, q.maxResultSizeChars, q.persistenceThresholdCeiling))
}
// @from(Ln 230943, Col 0)
async function bZ4(q, K, _, z) {
    return IZ4(q, K, JS8(K, _, z))
}
// @from(Ln 230947, Col 0)
function z3z(q) {
    if (!q) return !0;
    if (typeof q === "string") return q.trim() === "";
    if (!Array.isArray(q)) return !1;
    if (q.length === 0) return !0;
    return q.every((K) => typeof K === "object" && ("type" in K) && K.type === "text" && ("text" in K) && (typeof K.text !== "string" || K.text.trim() === ""))
}
// @from(Ln 230954, Col 0)
async function IZ4(q, K, _) {
    let z = q.content;
    if (z3z(z)) return d("tengu_tool_empty_result", {
        toolName: PK(K)
    }), {
        ...q,
        content: `(${K} completed with no output)`
    };
    if (!z) return q;
    if (mZ4(z)) return q;
    let Y = BZ4(z),
        A = _ ?? mP4;
    if (Y <= A) return q;
    let O = await _L6(z, q.tool_use_id);
    if (YL6(O)) return q;
    let w = lK6(O);
    return d("tengu_tool_result_persisted", {
        toolName: PK(K),
        originalSizeBytes: O.originalSize,
        persistedSizeBytes: w.length,
        estimatedOriginalTokens: Math.ceil(O.originalSize / et6),
        estimatedPersistedTokens: Math.ceil(w.length / et6),
        thresholdUsed: A
    }), {
        ...q,
        content: w
    }
}
// @from(Ln 230983, Col 0)
function se6(q, K) {
    if (q.length <= K) return {
        preview: q,
        hasMore: !1
    };
    let z = q.slice(0, K).lastIndexOf(`
`),
        Y = z > K * 0.5 ? z : K;
    return {
        preview: q.slice(0, Y),
        hasMore: !0
    }
}
// @from(Ln 230997, Col 0)
function YL6(q) {
    return "error" in q
}
// @from(Ln 231001, Col 0)
function te6() {
    return {
        seenIds: new Set,
        replacements: new Map
    }
}