
// @from(Ln 272433, Col 4)
au4 = p((Aiw, ou4) => {
    function jfz(q) {
        let K = {
                className: "variable",
                variants: [{
                    begin: /\$[\w\d#@][\w\d_]*/
                }, {
                    begin: /\$\{(.*?)\}/
                }]
            },
            _ = "BEGIN END if else while do for in break continue delete next nextfile function func exit|10",
            z = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE],
                variants: [{
                    begin: /(u|b)?r?'''/,
                    end: /'''/,
                    relevance: 10
                }, {
                    begin: /(u|b)?r?"""/,
                    end: /"""/,
                    relevance: 10
                }, {
                    begin: /(u|r|ur)'/,
                    end: /'/,
                    relevance: 10
                }, {
                    begin: /(u|r|ur)"/,
                    end: /"/,
                    relevance: 10
                }, {
                    begin: /(b|br)'/,
                    end: /'/
                }, {
                    begin: /(b|br)"/,
                    end: /"/
                }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
            };
        return {
            name: "Awk",
            keywords: {
                keyword: "BEGIN END if else while do for in break continue delete next nextfile function func exit|10"
            },
            contains: [K, z, q.REGEXP_MODE, q.HASH_COMMENT_MODE, q.NUMBER_MODE]
        }
    }
    ou4.exports = jfz
})
// @from(Ln 272481, Col 4)
tu4 = p((Oiw, su4) => {
    function Hfz(q) {
        return {
            name: "X++",
            aliases: ["x++"],
            keywords: {
                keyword: ["abstract", "as", "asc", "avg", "break", "breakpoint", "by", "byref", "case", "catch", "changecompany", "class", "client", "client", "common", "const", "continue", "count", "crosscompany", "delegate", "delete_from", "desc", "display", "div", "do", "edit", "else", "eventhandler", "exists", "extends", "final", "finally", "firstfast", "firstonly", "firstonly1", "firstonly10", "firstonly100", "firstonly1000", "flush", "for", "forceliterals", "forcenestedloop", "forceplaceholders", "forceselectorder", "forupdate", "from", "generateonly", "group", "hint", "if", "implements", "in", "index", "insert_recordset", "interface", "internal", "is", "join", "like", "maxof", "minof", "mod", "namespace", "new", "next", "nofetch", "notexists", "optimisticlock", "order", "outer", "pessimisticlock", "print", "private", "protected", "public", "readonly", "repeatableread", "retry", "return", "reverse", "select", "server", "setting", "static", "sum", "super", "switch", "this", "throw", "try", "ttsabort", "ttsbegin", "ttscommit", "unchecked", "update_recordset", "using", "validtimestate", "void", "where", "while"],
                built_in: ["anytype", "boolean", "byte", "char", "container", "date", "double", "enum", "guid", "int", "int64", "long", "real", "short", "str", "utcdatetime", "var"],
                literal: ["default", "false", "null", "true"]
            },
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE, {
                className: "meta",
                begin: "#",
                end: "$"
            }, {
                className: "class",
                beginKeywords: "class interface",
                end: /\{/,
                excludeEnd: !0,
                illegal: ":",
                contains: [{
                    beginKeywords: "extends implements"
                }, q.UNDERSCORE_TITLE_MODE]
            }]
        }
    }
    su4.exports = Hfz
})
// @from(Ln 272509, Col 4)
qm4 = p((wiw, eu4) => {
    function Jfz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Xfz(...q) {
        return q.map((_) => Jfz(_)).join("")
    }

    function Mfz(q) {
        let K = {},
            _ = {
                begin: /\$\{/,
                end: /\}/,
                contains: ["self", {
                    begin: /:-/,
                    contains: [K]
                }]
            };
        Object.assign(K, {
            className: "variable",
            variants: [{
                begin: Xfz(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
            }, _]
        });
        let z = {
                className: "subst",
                begin: /\$\(/,
                end: /\)/,
                contains: [q.BACKSLASH_ESCAPE]
            },
            Y = {
                begin: /<<-?\s*(?=\w+)/,
                starts: {
                    contains: [q.END_SAME_AS_BEGIN({
                        begin: /(\w+)/,
                        end: /(\w+)/,
                        className: "string"
                    })]
                }
            },
            A = {
                className: "string",
                begin: /"/,
                end: /"/,
                contains: [q.BACKSLASH_ESCAPE, K, z]
            };
        z.contains.push(A);
        let O = {
                className: "",
                begin: /\\"/
            },
            w = {
                className: "string",
                begin: /'/,
                end: /'/
            },
            $ = {
                begin: /\$\(\(/,
                end: /\)\)/,
                contains: [{
                    begin: /\d+#[0-9a-f]+/,
                    className: "number"
                }, q.NUMBER_MODE, K]
            },
            j = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
            H = q.SHEBANG({
                binary: `(${j.join("|")})`,
                relevance: 10
            }),
            J = {
                className: "function",
                begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                returnBegin: !0,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: /\w[\w\d_]*/
                })],
                relevance: 0
            };
        return {
            name: "Bash",
            aliases: ["sh", "zsh"],
            keywords: {
                $pattern: /\b[a-z._-]+\b/,
                keyword: "if then else elif fi for while in do done case esac function",
                literal: "true false",
                built_in: "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp"
            },
            contains: [H, q.SHEBANG(), J, $, q.HASH_COMMENT_MODE, Y, A, O, w, K]
        }
    }
    eu4.exports = Mfz
})
// @from(Ln 272604, Col 4)
_m4 = p(($iw, Km4) => {
    function Pfz(q) {
        return {
            name: "BASIC",
            case_insensitive: !0,
            illegal: "^.",
            keywords: {
                $pattern: "[a-zA-Z][a-zA-Z0-9_$%!#]*",
                keyword: "ABS ASC AND ATN AUTO|0 BEEP BLOAD|10 BSAVE|10 CALL CALLS CDBL CHAIN CHDIR CHR$|10 CINT CIRCLE CLEAR CLOSE CLS COLOR COM COMMON CONT COS CSNG CSRLIN CVD CVI CVS DATA DATE$ DEFDBL DEFINT DEFSNG DEFSTR DEF|0 SEG USR DELETE DIM DRAW EDIT END ENVIRON ENVIRON$ EOF EQV ERASE ERDEV ERDEV$ ERL ERR ERROR EXP FIELD FILES FIX FOR|0 FRE GET GOSUB|10 GOTO HEX$ IF THEN ELSE|0 INKEY$ INP INPUT INPUT# INPUT$ INSTR IMP INT IOCTL IOCTL$ KEY ON OFF LIST KILL LEFT$ LEN LET LINE LLIST LOAD LOC LOCATE LOF LOG LPRINT USING LSET MERGE MID$ MKDIR MKD$ MKI$ MKS$ MOD NAME NEW NEXT NOISE NOT OCT$ ON OR PEN PLAY STRIG OPEN OPTION BASE OUT PAINT PALETTE PCOPY PEEK PMAP POINT POKE POS PRINT PRINT] PSET PRESET PUT RANDOMIZE READ REM RENUM RESET|0 RESTORE RESUME RETURN|0 RIGHT$ RMDIR RND RSET RUN SAVE SCREEN SGN SHELL SIN SOUND SPACE$ SPC SQR STEP STICK STOP STR$ STRING$ SWAP SYSTEM TAB TAN TIME$ TIMER TROFF TRON TO USR VAL VARPTR VARPTR$ VIEW WAIT WHILE WEND WIDTH WINDOW WRITE XOR"
            },
            contains: [q.QUOTE_STRING_MODE, q.COMMENT("REM", "$", {
                relevance: 10
            }), q.COMMENT("'", "$", {
                relevance: 0
            }), {
                className: "symbol",
                begin: "^[0-9]+ ",
                relevance: 10
            }, {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?([edED]\\d+)?[#!]?",
                relevance: 0
            }, {
                className: "number",
                begin: "(&[hH][0-9a-fA-F]{1,4})"
            }, {
                className: "number",
                begin: "(&[oO][0-7]{1,6})"
            }]
        }
    }
    Km4.exports = Pfz
})
// @from(Ln 272637, Col 4)
Ym4 = p((jiw, zm4) => {
    function Wfz(q) {
        return {
            name: "Backus–Naur Form",
            contains: [{
                className: "attribute",
                begin: /</,
                end: />/
            }, {
                begin: /::=/,
                end: /$/,
                contains: [{
                    begin: /</,
                    end: />/
                }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
            }]
        }
    }
    zm4.exports = Wfz
})
// @from(Ln 272657, Col 4)
Om4 = p((Hiw, Am4) => {
    function Dfz(q) {
        let K = {
            className: "literal",
            begin: /[+-]/,
            relevance: 0
        };
        return {
            name: "Brainfuck",
            aliases: ["bf"],
            contains: [q.COMMENT(`[^\\[\\]\\.,\\+\\-<> \r
]`, `[\\[\\]\\.,\\+\\-<> \r
]`, {
                returnEnd: !0,
                relevance: 0
            }), {
                className: "title",
                begin: "[\\[\\]]",
                relevance: 0
            }, {
                className: "string",
                begin: "[\\.,]",
                relevance: 0
            }, {
                begin: /(?:\+\+|--)/,
                contains: [K]
            }, K]
        }
    }
    Am4.exports = Dfz
})
// @from(Ln 272688, Col 4)
$m4 = p((Jiw, wm4) => {
    function Zfz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function nx8(q) {
        return ffz("(", q, ")?")
    }

    function ffz(...q) {
        return q.map((_) => Zfz(_)).join("")
    }

    function Gfz(q) {
        let K = q.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            _ = "decltype\\(auto\\)",
            z = "[a-zA-Z_]\\w*::",
            Y = "<[^<>]+>",
            A = "(decltype\\(auto\\)|" + nx8("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + nx8("<[^<>]+>") + ")",
            O = {
                className: "keyword",
                begin: "\\b[a-z\\d_]*_t\\b"
            },
            w = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
            $ = {
                className: "string",
                variants: [{
                    begin: '(u8?|U|L)?"',
                    end: '"',
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                    end: "'",
                    illegal: "."
                }, q.END_SAME_AS_BEGIN({
                    begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                    end: /\)([^()\\ ]{0,16})"/
                })]
            },
            j = {
                className: "number",
                variants: [{
                    begin: "\\b(0b[01']+)"
                }, {
                    begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                }, {
                    begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                }],
                relevance: 0
            },
            H = {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, q.inherit($, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/
                }, K, q.C_BLOCK_COMMENT_MODE]
            },
            J = {
                className: "title",
                begin: nx8("[a-zA-Z_]\\w*::") + q.IDENT_RE,
                relevance: 0
            },
            X = nx8("[a-zA-Z_]\\w*::") + q.IDENT_RE + "\\s*\\(",
            M = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
                literal: "true false nullptr NULL"
            },
            P = [H, O, K, q.C_BLOCK_COMMENT_MODE, j, $],
            W = {
                variants: [{
                    begin: /=/,
                    end: /;/
                }, {
                    begin: /\(/,
                    end: /\)/
                }, {
                    beginKeywords: "new throw return else",
                    end: /;/
                }],
                keywords: M,
                contains: P.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: M,
                    contains: P.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            D = {
                className: "function",
                begin: "(" + A + "[\\*&\\s]+)+" + X,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: M,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: M,
                    relevance: 0
                }, {
                    begin: X,
                    returnBegin: !0,
                    contains: [J],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: M,
                    relevance: 0,
                    contains: [K, q.C_BLOCK_COMMENT_MODE, $, j, O, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: M,
                        relevance: 0,
                        contains: ["self", K, q.C_BLOCK_COMMENT_MODE, $, j, O]
                    }]
                }, O, K, q.C_BLOCK_COMMENT_MODE, H]
            };
        return {
            name: "C",
            aliases: ["h"],
            keywords: M,
            disableAutodetect: !0,
            illegal: "</",
            contains: [].concat(W, D, P, [H, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: M,
                contains: ["self", O]
            }, {
                begin: q.IDENT_RE + "::",
                keywords: M
            }, {
                className: "class",
                beginKeywords: "enum class struct union",
                end: /[{;:<>=]/,
                contains: [{
                    beginKeywords: "final class struct"
                }, q.TITLE_MODE]
            }]),
            exports: {
                preprocessor: H,
                strings: $,
                keywords: M
            }
        }
    }
    wm4.exports = Gfz
})
// @from(Ln 272858, Col 4)
Hm4 = p((Xiw, jm4) => {
    function vfz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Tfz(q) {
        return er1("(?=", q, ")")
    }

    function ix8(q) {
        return er1("(", q, ")?")
    }

    function er1(...q) {
        return q.map((_) => vfz(_)).join("")
    }

    function Vfz(q) {
        let K = q.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            _ = "decltype\\(auto\\)",
            z = "[a-zA-Z_]\\w*::",
            Y = "<[^<>]+>",
            A = "(decltype\\(auto\\)|" + ix8("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + ix8("<[^<>]+>") + ")",
            O = {
                className: "keyword",
                begin: "\\b[a-z\\d_]*_t\\b"
            },
            w = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
            $ = {
                className: "string",
                variants: [{
                    begin: '(u8?|U|L)?"',
                    end: '"',
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                    end: "'",
                    illegal: "."
                }, q.END_SAME_AS_BEGIN({
                    begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                    end: /\)([^()\\ ]{0,16})"/
                })]
            },
            j = {
                className: "number",
                variants: [{
                    begin: "\\b(0b[01']+)"
                }, {
                    begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                }, {
                    begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                }],
                relevance: 0
            },
            H = {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, q.inherit($, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/
                }, K, q.C_BLOCK_COMMENT_MODE]
            },
            J = {
                className: "title",
                begin: ix8("[a-zA-Z_]\\w*::") + q.IDENT_RE,
                relevance: 0
            },
            X = ix8("[a-zA-Z_]\\w*::") + q.IDENT_RE + "\\s*\\(",
            P = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "_Bool _Complex _Imaginary",
                _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
                literal: "true false nullptr NULL"
            },
            W = {
                className: "function.dispatch",
                relevance: 0,
                keywords: P,
                begin: er1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, q.IDENT_RE, Tfz(/\s*\(/))
            },
            D = [W, H, O, K, q.C_BLOCK_COMMENT_MODE, j, $],
            Z = {
                variants: [{
                    begin: /=/,
                    end: /;/
                }, {
                    begin: /\(/,
                    end: /\)/
                }, {
                    beginKeywords: "new throw return else",
                    end: /;/
                }],
                keywords: P,
                contains: D.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: P,
                    contains: D.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            G = {
                className: "function",
                begin: "(" + A + "[\\*&\\s]+)+" + X,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: P,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: P,
                    relevance: 0
                }, {
                    begin: X,
                    returnBegin: !0,
                    contains: [J],
                    relevance: 0
                }, {
                    begin: /::/,
                    relevance: 0
                }, {
                    begin: /:/,
                    endsWithParent: !0,
                    contains: [$, j]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: P,
                    relevance: 0,
                    contains: [K, q.C_BLOCK_COMMENT_MODE, $, j, O, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: P,
                        relevance: 0,
                        contains: ["self", K, q.C_BLOCK_COMMENT_MODE, $, j, O]
                    }]
                }, O, K, q.C_BLOCK_COMMENT_MODE, H]
            };
        return {
            name: "C++",
            aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
            keywords: P,
            illegal: "</",
            classNameAliases: {
                "function.dispatch": "built_in"
            },
            contains: [].concat(Z, G, W, D, [H, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: P,
                contains: ["self", O]
            }, {
                begin: q.IDENT_RE + "::",
                keywords: P
            }, {
                className: "class",
                beginKeywords: "enum class struct union",
                end: /[{;:<>=]/,
                contains: [{
                    beginKeywords: "final class struct"
                }, q.TITLE_MODE]
            }]),
            exports: {
                preprocessor: H,
                strings: $,
                keywords: P
            }
        }
    }

    function kfz(q) {
        let K = Vfz(q),
            _ = ["c", "h"],
            z = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
        if (K.disableAutodetect = !0, K.aliases = [], !q.getLanguage("c")) K.aliases.push(..._);
        if (!q.getLanguage("cpp")) K.aliases.push(...z);
        return K
    }
    jm4.exports = kfz
})
// @from(Ln 273057, Col 4)
Xm4 = p((Miw, Jm4) => {
    function Nfz(q) {
        let K = "div mod in and or not xor asserterror begin case do downto else end exit for if of repeat then to until while with var",
            _ = "false true",
            z = [q.C_LINE_COMMENT_MODE, q.COMMENT(/\{/, /\}/, {
                relevance: 0
            }), q.COMMENT(/\(\*/, /\*\)/, {
                relevance: 10
            })],
            Y = {
                className: "string",
                begin: /'/,
                end: /'/,
                contains: [{
                    begin: /''/
                }]
            },
            A = {
                className: "string",
                begin: /(#\d+)+/
            },
            O = {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?(DT|D|T)",
                relevance: 0
            },
            w = {
                className: "string",
                begin: '"',
                end: '"'
            },
            $ = {
                className: "function",
                beginKeywords: "procedure",
                end: /[:;]/,
                keywords: "procedure|10",
                contains: [q.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: K,
                    contains: [Y, A]
                }].concat(z)
            },
            j = {
                className: "class",
                begin: "OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)",
                returnBegin: !0,
                contains: [q.TITLE_MODE, $]
            };
        return {
            name: "C/AL",
            case_insensitive: !0,
            keywords: {
                keyword: K,
                literal: "false true"
            },
            illegal: /\/\*/,
            contains: [Y, A, O, w, q.NUMBER_MODE, j, $]
        }
    }
    Jm4.exports = Nfz
})
// @from(Ln 273120, Col 4)
Pm4 = p((Piw, Mm4) => {
    function Efz(q) {
        return {
            name: "Cap’n Proto",
            aliases: ["capnp"],
            keywords: {
                keyword: "struct enum interface union group import using const annotation extends in of on as with from fixed",
                built_in: "Void Bool Int8 Int16 Int32 Int64 UInt8 UInt16 UInt32 UInt64 Float32 Float64 Text Data AnyPointer AnyStruct Capability List",
                literal: "true false"
            },
            contains: [q.QUOTE_STRING_MODE, q.NUMBER_MODE, q.HASH_COMMENT_MODE, {
                className: "meta",
                begin: /@0x[\w\d]{16};/,
                illegal: /\n/
            }, {
                className: "symbol",
                begin: /@\d+\b/
            }, {
                className: "class",
                beginKeywords: "struct enum",
                end: /\{/,
                illegal: /\n/,
                contains: [q.inherit(q.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0
                    }
                })]
            }, {
                className: "class",
                beginKeywords: "interface",
                end: /\{/,
                illegal: /\n/,
                contains: [q.inherit(q.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0
                    }
                })]
            }]
        }
    }
    Mm4.exports = Efz
})
// @from(Ln 273164, Col 4)
Dm4 = p((Wiw, Wm4) => {
    function yfz(q) {
        let K = "assembly module package import alias class interface object given value assign void function new of extends satisfies abstracts in out return break continue throw assert dynamic if else switch case for while try catch finally then let this outer super is exists nonempty",
            _ = "shared abstract formal default actual variable late native deprecated final sealed annotation suppressWarnings small",
            z = "doc by license see throws tagged",
            Y = {
                className: "subst",
                excludeBegin: !0,
                excludeEnd: !0,
                begin: /``/,
                end: /``/,
                keywords: K,
                relevance: 10
            },
            A = [{
                className: "string",
                begin: '"""',
                end: '"""',
                relevance: 10
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: [Y]
            }, {
                className: "string",
                begin: "'",
                end: "'"
            }, {
                className: "number",
                begin: "#[0-9a-fA-F_]+|\\$[01_]+|[0-9_]+(?:\\.[0-9_](?:[eE][+-]?\\d+)?)?[kMGTPmunpf]?",
                relevance: 0
            }];
        return Y.contains = A, {
            name: "Ceylon",
            keywords: {
                keyword: K + " " + _,
                meta: "doc by license see throws tagged"
            },
            illegal: "\\$[^01]|#[^0-9a-fA-F]",
            contains: [q.C_LINE_COMMENT_MODE, q.COMMENT("/\\*", "\\*/", {
                contains: ["self"]
            }), {
                className: "meta",
                begin: '@[a-z]\\w*(?::"[^"]*")?'
            }].concat(A)
        }
    }
    Wm4.exports = yfz
})
// @from(Ln 273214, Col 4)
fm4 = p((Diw, Zm4) => {
    function Lfz(q) {
        return {
            name: "Clean",
            aliases: ["icl", "dcl"],
            keywords: {
                keyword: "if let in with where case of class instance otherwise implementation definition system module from import qualified as special code inline foreign export ccall stdcall generic derive infix infixl infixr",
                built_in: "Int Real Char Bool",
                literal: "True False"
            },
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE, {
                begin: "->|<-[|:]?|#!?|>>=|\\{\\||\\|\\}|:==|=:|<>"
            }]
        }
    }
    Zm4.exports = Lfz
})
// @from(Ln 273231, Col 4)
vm4 = p((Ziw, Gm4) => {
    function hfz(q) {
        let _ = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
            z = "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
            Y = {
                $pattern: _,
                "builtin-name": "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
            },
            A = "[-+]?\\d+(\\.\\d+)?",
            O = {
                begin: _,
                relevance: 0
            },
            w = {
                className: "number",
                begin: "[-+]?\\d+(\\.\\d+)?",
                relevance: 0
            },
            $ = q.inherit(q.QUOTE_STRING_MODE, {
                illegal: null
            }),
            j = q.COMMENT(";", "$", {
                relevance: 0
            }),
            H = {
                className: "literal",
                begin: /\b(true|false|nil)\b/
            },
            J = {
                begin: "[\\[\\{]",
                end: "[\\]\\}]"
            },
            X = {
                className: "comment",
                begin: "\\^" + _
            },
            M = q.COMMENT("\\^\\{", "\\}"),
            P = {
                className: "symbol",
                begin: "[:]{1,2}" + _
            },
            W = {
                begin: "\\(",
                end: "\\)"
            },
            D = {
                endsWithParent: !0,
                relevance: 0
            },
            Z = {
                keywords: Y,
                className: "name",
                begin: _,
                relevance: 0,
                starts: D
            },
            G = [W, $, X, M, j, P, J, w, H, O],
            f = {
                beginKeywords: "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
                lexemes: _,
                end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
                contains: [{
                    className: "title",
                    begin: _,
                    relevance: 0,
                    excludeEnd: !0,
                    endsParent: !0
                }].concat(G)
            };
        return W.contains = [q.COMMENT("comment", ""), f, Z, D], D.contains = G, J.contains = G, M.contains = [J], {
            name: "Clojure",
            aliases: ["clj"],
            illegal: /\S/,
            contains: [W, $, X, M, j, P, J, w, H]
        }
    }
    Gm4.exports = hfz
})
// @from(Ln 273309, Col 4)
Vm4 = p((fiw, Tm4) => {
    function Rfz(q) {
        return {
            name: "Clojure REPL",
            contains: [{
                className: "meta",
                begin: /^([\w.-]+|\s*#_)?=>/,
                starts: {
                    end: /$/,
                    subLanguage: "clojure"
                }
            }]
        }
    }
    Tm4.exports = Rfz
})
// @from(Ln 273325, Col 4)
Nm4 = p((Giw, km4) => {
    function Sfz(q) {
        return {
            name: "CMake",
            aliases: ["cmake.in"],
            case_insensitive: !0,
            keywords: {
                keyword: "break cmake_host_system_information cmake_minimum_required cmake_parse_arguments cmake_policy configure_file continue elseif else endforeach endfunction endif endmacro endwhile execute_process file find_file find_library find_package find_path find_program foreach function get_cmake_property get_directory_property get_filename_component get_property if include include_guard list macro mark_as_advanced math message option return separate_arguments set_directory_properties set_property set site_name string unset variable_watch while add_compile_definitions add_compile_options add_custom_command add_custom_target add_definitions add_dependencies add_executable add_library add_link_options add_subdirectory add_test aux_source_directory build_command create_test_sourcelist define_property enable_language enable_testing export fltk_wrap_ui get_source_file_property get_target_property get_test_property include_directories include_external_msproject include_regular_expression install link_directories link_libraries load_cache project qt_wrap_cpp qt_wrap_ui remove_definitions set_source_files_properties set_target_properties set_tests_properties source_group target_compile_definitions target_compile_features target_compile_options target_include_directories target_link_directories target_link_libraries target_link_options target_sources try_compile try_run ctest_build ctest_configure ctest_coverage ctest_empty_binary_directory ctest_memcheck ctest_read_custom_files ctest_run_script ctest_sleep ctest_start ctest_submit ctest_test ctest_update ctest_upload build_name exec_program export_library_dependencies install_files install_programs install_targets load_command make_directory output_required_files remove subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file qt5_use_modules qt5_use_package qt5_wrap_cpp on off true false and or not command policy target test exists is_newer_than is_directory is_symlink is_absolute matches less greater equal less_equal greater_equal strless strgreater strequal strless_equal strgreater_equal version_less version_greater version_equal version_less_equal version_greater_equal in_list defined"
            },
            contains: [{
                className: "variable",
                begin: /\$\{/,
                end: /\}/
            }, q.HASH_COMMENT_MODE, q.QUOTE_STRING_MODE, q.NUMBER_MODE]
        }
    }
    km4.exports = Sfz
})
// @from(Ln 273343, Col 4)
ym4 = p((viw, Em4) => {
    var Cfz = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
        bfz = ["true", "false", "null", "undefined", "NaN", "Infinity"],
        Ifz = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
        xfz = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
        ufz = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
        mfz = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
        Bfz = [].concat(ufz, mfz, Ifz, xfz);

    function pfz(q) {
        let K = ["npm", "print"],
            _ = ["yes", "no", "on", "off"],
            z = ["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"],
            Y = ["var", "const", "let", "function", "static"],
            A = (M) => (P) => !M.includes(P),
            O = {
                keyword: Cfz.concat(z).filter(A(Y)),
                literal: bfz.concat(_),
                built_in: Bfz.concat(K)
            },
            w = "[A-Za-z$_][0-9A-Za-z$_]*",
            $ = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: O
            },
            j = [q.BINARY_NUMBER_MODE, q.inherit(q.C_NUMBER_MODE, {
                starts: {
                    end: "(\\s*/)?",
                    relevance: 0
                }
            }), {
                className: "string",
                variants: [{
                    begin: /'''/,
                    end: /'''/,
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: /'/,
                    end: /'/,
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: /"""/,
                    end: /"""/,
                    contains: [q.BACKSLASH_ESCAPE, $]
                }, {
                    begin: /"/,
                    end: /"/,
                    contains: [q.BACKSLASH_ESCAPE, $]
                }]
            }, {
                className: "regexp",
                variants: [{
                    begin: "///",
                    end: "///",
                    contains: [$, q.HASH_COMMENT_MODE]
                }, {
                    begin: "//[gim]{0,3}(?=\\W)",
                    relevance: 0
                }, {
                    begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/
                }]
            }, {
                begin: "@[A-Za-z$_][0-9A-Za-z$_]*"
            }, {
                subLanguage: "javascript",
                excludeBegin: !0,
                excludeEnd: !0,
                variants: [{
                    begin: "```",
                    end: "```"
                }, {
                    begin: "`",
                    end: "`"
                }]
            }];
        $.contains = j;
        let H = q.inherit(q.TITLE_MODE, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*"
            }),
            J = "(\\(.*\\)\\s*)?\\B[-=]>",
            X = {
                className: "params",
                begin: "\\([^\\(]",
                returnBegin: !0,
                contains: [{
                    begin: /\(/,
                    end: /\)/,
                    keywords: O,
                    contains: ["self"].concat(j)
                }]
            };
        return {
            name: "CoffeeScript",
            aliases: ["coffee", "cson", "iced"],
            keywords: O,
            illegal: /\/\*/,
            contains: j.concat([q.COMMENT("###", "###"), q.HASH_COMMENT_MODE, {
                className: "function",
                begin: "^\\s*[A-Za-z$_][0-9A-Za-z$_]*\\s*=\\s*" + J,
                end: "[-=]>",
                returnBegin: !0,
                contains: [H, X]
            }, {
                begin: /[:\(,=]\s*/,
                relevance: 0,
                contains: [{
                    className: "function",
                    begin: J,
                    end: "[-=]>",
                    returnBegin: !0,
                    contains: [X]
                }]
            }, {
                className: "class",
                beginKeywords: "class",
                end: "$",
                illegal: /[:="\[\]]/,
                contains: [{
                    beginKeywords: "extends",
                    endsWithParent: !0,
                    illegal: /[:="\[\]]/,
                    contains: [H]
                }, H]
            }, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*:",
                end: ":",
                returnBegin: !0,
                returnEnd: !0,
                relevance: 0
            }])
        }
    }
    Em4.exports = pfz
})
// @from(Ln 273479, Col 4)
hm4 = p((Tiw, Lm4) => {
    function Ffz(q) {
        return {
            name: "Coq",
            keywords: {
                keyword: "_|0 as at cofix else end exists exists2 fix for forall fun if IF in let match mod Prop return Set then Type using where with Abort About Add Admit Admitted All Arguments Assumptions Axiom Back BackTo Backtrack Bind Blacklist Canonical Cd Check Class Classes Close Coercion Coercions CoFixpoint CoInductive Collection Combined Compute Conjecture Conjectures Constant constr Constraint Constructors Context Corollary CreateHintDb Cut Declare Defined Definition Delimit Dependencies Dependent Derive Drop eauto End Equality Eval Example Existential Existentials Existing Export exporting Extern Extract Extraction Fact Field Fields File Fixpoint Focus for From Function Functional Generalizable Global Goal Grab Grammar Graph Guarded Heap Hint HintDb Hints Hypotheses Hypothesis ident Identity If Immediate Implicit Import Include Inductive Infix Info Initial Inline Inspect Instance Instances Intro Intros Inversion Inversion_clear Language Left Lemma Let Libraries Library Load LoadPath Local Locate Ltac ML Mode Module Modules Monomorphic Morphism Next NoInline Notation Obligation Obligations Opaque Open Optimize Options Parameter Parameters Parametric Path Paths pattern Polymorphic Preterm Print Printing Program Projections Proof Proposition Pwd Qed Quit Rec Record Recursive Redirect Relation Remark Remove Require Reserved Reset Resolve Restart Rewrite Right Ring Rings Save Scheme Scope Scopes Script Search SearchAbout SearchHead SearchPattern SearchRewrite Section Separate Set Setoid Show Solve Sorted Step Strategies Strategy Structure SubClass Table Tables Tactic Term Test Theorem Time Timeout Transparent Type Typeclasses Types Undelimit Undo Unfocus Unfocused Unfold Universe Universes Unset Unshelve using Variable Variables Variant Verbose Visibility where with",
                built_in: "abstract absurd admit after apply as assert assumption at auto autorewrite autounfold before bottom btauto by case case_eq cbn cbv change classical_left classical_right clear clearbody cofix compare compute congruence constr_eq constructor contradict contradiction cut cutrewrite cycle decide decompose dependent destruct destruction dintuition discriminate discrR do double dtauto eapply eassumption eauto ecase econstructor edestruct ediscriminate eelim eexact eexists einduction einjection eleft elim elimtype enough equality erewrite eright esimplify_eq esplit evar exact exactly_once exfalso exists f_equal fail field field_simplify field_simplify_eq first firstorder fix fold fourier functional generalize generalizing gfail give_up has_evar hnf idtac in induction injection instantiate intro intro_pattern intros intuition inversion inversion_clear is_evar is_var lapply lazy left lia lra move native_compute nia nsatz omega once pattern pose progress proof psatz quote record red refine reflexivity remember rename repeat replace revert revgoals rewrite rewrite_strat right ring ring_simplify rtauto set setoid_reflexivity setoid_replace setoid_rewrite setoid_symmetry setoid_transitivity shelve shelve_unifiable simpl simple simplify_eq solve specialize split split_Rabs split_Rmult stepl stepr subst sum swap symmetry tactic tauto time timeout top transitivity trivial try tryif unfold unify until using vm_compute with"
            },
            contains: [q.QUOTE_STRING_MODE, q.COMMENT("\\(\\*", "\\*\\)"), q.C_NUMBER_MODE, {
                className: "type",
                excludeBegin: !0,
                begin: "\\|\\s*",
                end: "\\w+"
            }, {
                begin: /[-=]>/
            }]
        }
    }
    Lm4.exports = Ffz
})
// @from(Ln 273499, Col 4)
Sm4 = p((Viw, Rm4) => {
    function gfz(q) {
        return {
            name: "Caché Object Script",
            case_insensitive: !0,
            aliases: ["cls"],
            keywords: "property parameter class classmethod clientmethod extends as break catch close continue do d|0 else elseif for goto halt hang h|0 if job j|0 kill k|0 lock l|0 merge new open quit q|0 read r|0 return set s|0 tcommit throw trollback try tstart use view while write w|0 xecute x|0 zkill znspace zn ztrap zwrite zw zzdump zzwrite print zbreak zinsert zload zprint zremove zsave zzprint mv mvcall mvcrt mvdim mvprint zquit zsync ascii",
            contains: [{
                className: "number",
                begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)",
                relevance: 0
            }, {
                className: "string",
                variants: [{
                    begin: '"',
                    end: '"',
                    contains: [{
                        begin: '""',
                        relevance: 0
                    }]
                }]
            }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "comment",
                begin: /;/,
                end: "$",
                relevance: 0
            }, {
                className: "built_in",
                begin: /(?:\$\$?|\.\.)\^?[a-zA-Z]+/
            }, {
                className: "built_in",
                begin: /\$\$\$[a-zA-Z]+/
            }, {
                className: "built_in",
                begin: /%[a-z]+(?:\.[a-z]+)*/
            }, {
                className: "symbol",
                begin: /\^%?[a-zA-Z][\w]*/
            }, {
                className: "keyword",
                begin: /##class|##super|#define|#dim/
            }, {
                begin: /&sql\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                subLanguage: "sql"
            }, {
                begin: /&(js|jscript|javascript)</,
                end: />/,
                excludeBegin: !0,
                excludeEnd: !0,
                subLanguage: "javascript"
            }, {
                begin: /&html<\s*</,
                end: />\s*>/,
                subLanguage: "xml"
            }]
        }
    }
    Rm4.exports = gfz
})
// @from(Ln 273561, Col 4)
bm4 = p((kiw, Cm4) => {
    function Ufz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Qfz(q) {
        return qo1("(?=", q, ")")
    }

    function rx8(q) {
        return qo1("(", q, ")?")
    }

    function qo1(...q) {
        return q.map((_) => Ufz(_)).join("")
    }

    function dfz(q) {
        let K = q.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            _ = "decltype\\(auto\\)",
            z = "[a-zA-Z_]\\w*::",
            Y = "<[^<>]+>",
            A = "(decltype\\(auto\\)|" + rx8("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + rx8("<[^<>]+>") + ")",
            O = {
                className: "keyword",
                begin: "\\b[a-z\\d_]*_t\\b"
            },
            w = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
            $ = {
                className: "string",
                variants: [{
                    begin: '(u8?|U|L)?"',
                    end: '"',
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                    end: "'",
                    illegal: "."
                }, q.END_SAME_AS_BEGIN({
                    begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                    end: /\)([^()\\ ]{0,16})"/
                })]
            },
            j = {
                className: "number",
                variants: [{
                    begin: "\\b(0b[01']+)"
                }, {
                    begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                }, {
                    begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                }],
                relevance: 0
            },
            H = {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, q.inherit($, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/
                }, K, q.C_BLOCK_COMMENT_MODE]
            },
            J = {
                className: "title",
                begin: rx8("[a-zA-Z_]\\w*::") + q.IDENT_RE,
                relevance: 0
            },
            X = rx8("[a-zA-Z_]\\w*::") + q.IDENT_RE + "\\s*\\(",
            P = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "_Bool _Complex _Imaginary",
                _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
                literal: "true false nullptr NULL"
            },
            W = {
                className: "function.dispatch",
                relevance: 0,
                keywords: P,
                begin: qo1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, q.IDENT_RE, Qfz(/\s*\(/))
            },
            D = [W, H, O, K, q.C_BLOCK_COMMENT_MODE, j, $],
            Z = {
                variants: [{
                    begin: /=/,
                    end: /;/
                }, {
                    begin: /\(/,
                    end: /\)/
                }, {
                    beginKeywords: "new throw return else",
                    end: /;/
                }],
                keywords: P,
                contains: D.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: P,
                    contains: D.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            G = {
                className: "function",
                begin: "(" + A + "[\\*&\\s]+)+" + X,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: P,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: P,
                    relevance: 0
                }, {
                    begin: X,
                    returnBegin: !0,
                    contains: [J],
                    relevance: 0
                }, {
                    begin: /::/,
                    relevance: 0
                }, {
                    begin: /:/,
                    endsWithParent: !0,
                    contains: [$, j]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: P,
                    relevance: 0,
                    contains: [K, q.C_BLOCK_COMMENT_MODE, $, j, O, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: P,
                        relevance: 0,
                        contains: ["self", K, q.C_BLOCK_COMMENT_MODE, $, j, O]
                    }]
                }, O, K, q.C_BLOCK_COMMENT_MODE, H]
            };
        return {
            name: "C++",
            aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
            keywords: P,
            illegal: "</",
            classNameAliases: {
                "function.dispatch": "built_in"
            },
            contains: [].concat(Z, G, W, D, [H, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: P,
                contains: ["self", O]
            }, {
                begin: q.IDENT_RE + "::",
                keywords: P
            }, {
                className: "class",
                beginKeywords: "enum class struct union",
                end: /[{;:<>=]/,
                contains: [{
                    beginKeywords: "final class struct"
                }, q.TITLE_MODE]
            }]),
            exports: {
                preprocessor: H,
                strings: $,
                keywords: P
            }
        }
    }
    Cm4.exports = dfz
})
// @from(Ln 273751, Col 4)
xm4 = p((Niw, Im4) => {
    function cfz(q) {
        let _ = "group clone ms master location colocation order fencing_topology rsc_ticket acl_target acl_group user role tag xml",
            z = "property rsc_defaults op_defaults",
            Y = "params meta operations op rule attributes utilization",
            A = "read write deny defined not_defined in_range date spec in ref reference attribute type xpath version and or lt gt tag lte gte eq ne \\",
            O = "number string",
            w = "Master Started Slave Stopped start promote demote stop monitor true false";
        return {
            name: "crmsh",
            aliases: ["crm", "pcmk"],
            case_insensitive: !0,
            keywords: {
                keyword: "params meta operations op rule attributes utilization " + A + " number string",
                literal: "Master Started Slave Stopped start promote demote stop monitor true false"
            },
            contains: [q.HASH_COMMENT_MODE, {
                beginKeywords: "node",
                starts: {
                    end: "\\s*([\\w_-]+:)?",
                    starts: {
                        className: "title",
                        end: "\\s*[\\$\\w_][\\w_-]*"
                    }
                }
            }, {
                beginKeywords: "primitive rsc_template",
                starts: {
                    className: "title",
                    end: "\\s*[\\$\\w_][\\w_-]*",
                    starts: {
                        end: "\\s*@?[\\w_][\\w_\\.:-]*"
                    }
                }
            }, {
                begin: "\\b(" + _.split(" ").join("|") + ")\\s+",
                keywords: _,
                starts: {
                    className: "title",
                    end: "[\\$\\w_][\\w_-]*"
                }
            }, {
                beginKeywords: "property rsc_defaults op_defaults",
                starts: {
                    className: "title",
                    end: "\\s*([\\w_-]+:)?"
                }
            }, q.QUOTE_STRING_MODE, {
                className: "meta",
                begin: "(ocf|systemd|service|lsb):[\\w_:-]+",
                relevance: 0
            }, {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?(ms|s|h|m)?",
                relevance: 0
            }, {
                className: "literal",
                begin: "[-]?(infinity|inf)",
                relevance: 0
            }, {
                className: "attr",
                begin: /([A-Za-z$_#][\w_-]+)=/,
                relevance: 0
            }, {
                className: "tag",
                begin: "</?",
                end: "/?>",
                relevance: 0
            }]
        }
    }
    Im4.exports = cfz
})
// @from(Ln 273824, Col 4)
mm4 = p((Eiw, um4) => {
    function lfz(q) {
        let O = {
                $pattern: "[a-zA-Z_]\\w*[!?=]?",
                keyword: "abstract alias annotation as as? asm begin break case class def do else elsif end ensure enum extend for fun if include instance_sizeof is_a? lib macro module next nil? of out pointerof private protected rescue responds_to? return require select self sizeof struct super then type typeof union uninitialized unless until verbatim when while with yield __DIR__ __END_LINE__ __FILE__ __LINE__",
                literal: "false nil true"
            },
            w = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: O
            },
            $ = {
                className: "template-variable",
                variants: [{
                    begin: "\\{\\{",
                    end: "\\}\\}"
                }, {
                    begin: "\\{%",
                    end: "%\\}"
                }],
                keywords: O
            };

        function j(D, Z) {
            let G = [{
                begin: D,
                end: Z
            }];
            return G[0].contains = G, G
        }
        let H = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE, w],
                variants: [{
                    begin: /'/,
                    end: /'/
                }, {
                    begin: /"/,
                    end: /"/
                }, {
                    begin: /`/,
                    end: /`/
                }, {
                    begin: "%[Qwi]?\\(",
                    end: "\\)",
                    contains: j("\\(", "\\)")
                }, {
                    begin: "%[Qwi]?\\[",
                    end: "\\]",
                    contains: j("\\[", "\\]")
                }, {
                    begin: "%[Qwi]?\\{",
                    end: /\}/,
                    contains: j(/\{/, /\}/)
                }, {
                    begin: "%[Qwi]?<",
                    end: ">",
                    contains: j("<", ">")
                }, {
                    begin: "%[Qwi]?\\|",
                    end: "\\|"
                }, {
                    begin: /<<-\w+$/,
                    end: /^\s*\w+$/
                }],
                relevance: 0
            },
            J = {
                className: "string",
                variants: [{
                    begin: "%q\\(",
                    end: "\\)",
                    contains: j("\\(", "\\)")
                }, {
                    begin: "%q\\[",
                    end: "\\]",
                    contains: j("\\[", "\\]")
                }, {
                    begin: "%q\\{",
                    end: /\}/,
                    contains: j(/\{/, /\}/)
                }, {
                    begin: "%q<",
                    end: ">",
                    contains: j("<", ">")
                }, {
                    begin: "%q\\|",
                    end: "\\|"
                }, {
                    begin: /<<-'\w+'$/,
                    end: /^\s*\w+$/
                }],
                relevance: 0
            },
            X = {
                begin: "(?!%\\})(" + q.RE_STARTERS_RE + "|\\n|\\b(case|if|select|unless|until|when|while)\\b)\\s*",
                keywords: "case if select unless until when while",
                contains: [{
                    className: "regexp",
                    contains: [q.BACKSLASH_ESCAPE, w],
                    variants: [{
                        begin: "//[a-z]*",
                        relevance: 0
                    }, {
                        begin: "/(?!\\/)",
                        end: "/[a-z]*"
                    }]
                }],
                relevance: 0
            },
            M = {
                className: "regexp",
                contains: [q.BACKSLASH_ESCAPE, w],
                variants: [{
                    begin: "%r\\(",
                    end: "\\)",
                    contains: j("\\(", "\\)")
                }, {
                    begin: "%r\\[",
                    end: "\\]",
                    contains: j("\\[", "\\]")
                }, {
                    begin: "%r\\{",
                    end: /\}/,
                    contains: j(/\{/, /\}/)
                }, {
                    begin: "%r<",
                    end: ">",
                    contains: j("<", ">")
                }, {
                    begin: "%r\\|",
                    end: "\\|"
                }],
                relevance: 0
            },
            P = {
                className: "meta",
                begin: "@\\[",
                end: "\\]",
                contains: [q.inherit(q.QUOTE_STRING_MODE, {
                    className: "meta-string"
                })]
            },
            W = [$, H, J, M, X, P, q.HASH_COMMENT_MODE, {
                className: "class",
                beginKeywords: "class module struct",
                end: "$|;",
                illegal: /=/,
                contains: [q.HASH_COMMENT_MODE, q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                }), {
                    begin: "<"
                }]
            }, {
                className: "class",
                beginKeywords: "lib enum union",
                end: "$|;",
                illegal: /=/,
                contains: [q.HASH_COMMENT_MODE, q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                })]
            }, {
                beginKeywords: "annotation",
                end: "$|;",
                illegal: /=/,
                contains: [q.HASH_COMMENT_MODE, q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                })],
                relevance: 2
            }, {
                className: "function",
                beginKeywords: "def",
                end: /\B\b/,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
                    endsParent: !0
                })]
            }, {
                className: "function",
                beginKeywords: "fun macro",
                end: /\B\b/,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
                    endsParent: !0
                })],
                relevance: 2
            }, {
                className: "symbol",
                begin: q.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
                relevance: 0
            }, {
                className: "symbol",
                begin: ":",
                contains: [H, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?"
                }],
                relevance: 0
            }, {
                className: "number",
                variants: [{
                    begin: "\\b0b([01_]+)(_?[ui](8|16|32|64|128))?"
                }, {
                    begin: "\\b0o([0-7_]+)(_?[ui](8|16|32|64|128))?"
                }, {
                    begin: "\\b0x([A-Fa-f0-9_]+)(_?[ui](8|16|32|64|128))?"
                }, {
                    begin: "\\b([1-9][0-9_]*[0-9]|[0-9])(\\.[0-9][0-9_]*)?([eE]_?[-+]?[0-9_]*)?(_?f(32|64))?(?!_)"
                }, {
                    begin: "\\b([1-9][0-9_]*|0)(_?[ui](8|16|32|64|128))?"
                }],
                relevance: 0
            }];
        return w.contains = W, $.contains = W.slice(1), {
            name: "Crystal",
            aliases: ["cr"],
            keywords: O,
            contains: W
        }
    }
    um4.exports = lfz
})
// @from(Ln 274047, Col 4)
pm4 = p((yiw, Bm4) => {
    function nfz(q) {
        let K = ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
            _ = ["public", "private", "protected", "static", "internal", "protected", "abstract", "async", "extern", "override", "unsafe", "virtual", "new", "sealed", "partial"],
            z = ["default", "false", "null", "true"],
            Y = ["abstract", "as", "base", "break", "case", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"],
            A = ["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"],
            O = {
                keyword: Y.concat(A),
                built_in: K,
                literal: z
            },
            w = q.inherit(q.TITLE_MODE, {
                begin: "[a-zA-Z](\\.?\\w)*"
            }),
            $ = {
                className: "number",
                variants: [{
                    begin: "\\b(0b[01']+)"
                }, {
                    begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
                }, {
                    begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                }],
                relevance: 0
            },
            j = {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [{
                    begin: '""'
                }]
            },
            H = q.inherit(j, {
                illegal: /\n/
            }),
            J = {
                className: "subst",
                begin: /\{/,
                end: /\}/,
                keywords: O
            },
            X = q.inherit(J, {
                illegal: /\n/
            }),
            M = {
                className: "string",
                begin: /\$"/,
                end: '"',
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, q.BACKSLASH_ESCAPE, X]
            },
            P = {
                className: "string",
                begin: /\$@"/,
                end: '"',
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, {
                    begin: '""'
                }, J]
            },
            W = q.inherit(P, {
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, {
                    begin: '""'
                }, X]
            });
        J.contains = [P, M, j, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, $, q.C_BLOCK_COMMENT_MODE], X.contains = [W, M, H, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, $, q.inherit(q.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/
        })];
        let D = {
                variants: [P, M, j, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
            },
            Z = {
                begin: "<",
                end: ">",
                contains: [{
                    beginKeywords: "in out"
                }, w]
            },
            G = q.IDENT_RE + "(<" + q.IDENT_RE + "(\\s*,\\s*" + q.IDENT_RE + ")*>)?(\\[\\])?",
            f = {
                begin: "@" + q.IDENT_RE,
                relevance: 0
            };
        return {
            name: "C#",
            aliases: ["cs", "c#"],
            keywords: O,
            illegal: /::/,
            contains: [q.COMMENT("///", "$", {
                returnBegin: !0,
                contains: [{
                    className: "doctag",
                    variants: [{
                        begin: "///",
                        relevance: 0
                    }, {
                        begin: "<!--|-->"
                    }, {
                        begin: "</?",
                        end: ">"
                    }]
                }]
            }), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line region endregion pragma checksum"
                }
            }, D, $, {
                beginKeywords: "class interface",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:,]/,
                contains: [{
                    beginKeywords: "where class"
                }, w, Z, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "namespace",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [w, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "record",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [w, Z, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
            }, {
                className: "meta",
                begin: "^\\s*\\[",
                excludeBegin: !0,
                end: "\\]",
                excludeEnd: !0,
                contains: [{
                    className: "meta-string",
                    begin: /"/,
                    end: /"/
                }]
            }, {
                beginKeywords: "new return throw await else",
                relevance: 0
            }, {
                className: "function",
                begin: "(" + G + "\\s+)+" + q.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                returnBegin: !0,
                end: /\s*[{;=]/,
                excludeEnd: !0,
                keywords: O,
                contains: [{
                    beginKeywords: _.join(" "),
                    relevance: 0
                }, {
                    begin: q.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                    returnBegin: !0,
                    contains: [q.TITLE_MODE, Z],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: O,
                    relevance: 0,
                    contains: [D, $, q.C_BLOCK_COMMENT_MODE]
                }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
            }, f]
        }
    }
    Bm4.exports = nfz
})
// @from(Ln 274234, Col 4)
gm4 = p((Liw, Fm4) => {
    function ifz(q) {
        return {
            name: "CSP",
            case_insensitive: !1,
            keywords: {
                $pattern: "[a-zA-Z][a-zA-Z0-9_-]*",
                keyword: "base-uri child-src connect-src default-src font-src form-action frame-ancestors frame-src img-src media-src object-src plugin-types report-uri sandbox script-src style-src"
            },
            contains: [{
                className: "string",
                begin: "'",
                end: "'"
            }, {
                className: "attribute",
                begin: "^Content",
                end: ":",
                excludeEnd: !0
            }]
        }
    }
    Fm4.exports = ifz
})
// @from(Ln 274257, Col 4)
Qm4 = p((hiw, Um4) => {
    var rfz = (q) => {
            return {
                IMPORTANT: {
                    className: "meta",
                    begin: "!important"
                },
                HEXCOLOR: {
                    className: "number",
                    begin: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
                },
                ATTRIBUTE_SELECTOR_MODE: {
                    className: "selector-attr",
                    begin: /\[/,
                    end: /\]/,
                    illegal: "$",
                    contains: [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
                }
            }
        },
        ofz = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
        afz = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
        sfz = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
        tfz = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
        efz = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "auto", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "clip-path", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-variation-settings", "font-weight", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inherit", "initial", "justify-content", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "mask", "max-height", "max-width", "min-height", "min-width", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "right", "src", "tab-size", "table-layout", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index"].reverse();

    function qGz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function KGz(q) {
        return _Gz("(?=", q, ")")
    }

    function _Gz(...q) {
        return q.map((_) => qGz(_)).join("")
    }

    function zGz(q) {
        let K = rfz(q),
            _ = {
                className: "built_in",
                begin: /[\w-]+(?=\()/
            },
            z = {
                begin: /-(webkit|moz|ms|o)-(?=[a-z])/
            },
            Y = "and or not only",
            A = /@-?\w[\w]*(-\w+)*/,
            O = "[a-zA-Z-][a-zA-Z0-9_-]*",
            w = [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE];
        return {
            name: "CSS",
            case_insensitive: !0,
            illegal: /[=|'\$]/,
            keywords: {
                keyframePosition: "from to"
            },
            classNameAliases: {
                keyframePosition: "selector-tag"
            },
            contains: [q.C_BLOCK_COMMENT_MODE, z, q.CSS_NUMBER_MODE, {
                className: "selector-id",
                begin: /#[A-Za-z0-9_-]+/,
                relevance: 0
            }, {
                className: "selector-class",
                begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
                relevance: 0
            }, K.ATTRIBUTE_SELECTOR_MODE, {
                className: "selector-pseudo",
                variants: [{
                    begin: ":(" + sfz.join("|") + ")"
                }, {
                    begin: "::(" + tfz.join("|") + ")"
                }]
            }, {
                className: "attribute",
                begin: "\\b(" + efz.join("|") + ")\\b"
            }, {
                begin: ":",
                end: "[;}]",
                contains: [K.HEXCOLOR, K.IMPORTANT, q.CSS_NUMBER_MODE, ...w, {
                    begin: /(url|data-uri)\(/,
                    end: /\)/,
                    relevance: 0,
                    keywords: {
                        built_in: "url data-uri"
                    },
                    contains: [{
                        className: "string",
                        begin: /[^)]/,
                        endsWithParent: !0,
                        excludeEnd: !0
                    }]
                }, _]
            }, {
                begin: KGz(/@/),
                end: "[{;]",
                relevance: 0,
                illegal: /:/,
                contains: [{
                    className: "keyword",
                    begin: A
                }, {
                    begin: /\s/,
                    endsWithParent: !0,
                    excludeEnd: !0,
                    relevance: 0,
                    keywords: {
                        $pattern: /[a-z-]+/,
                        keyword: "and or not only",
                        attribute: afz.join(" ")
                    },
                    contains: [{
                        begin: /[a-z-]+(?=:)/,
                        className: "attribute"
                    }, ...w, q.CSS_NUMBER_MODE]
                }]
            }, {
                className: "selector-tag",
                begin: "\\b(" + ofz.join("|") + ")\\b"
            }]
        }
    }
    Um4.exports = zGz
})
// @from(Ln 274386, Col 4)
cm4 = p((Riw, dm4) => {
    function YGz(q) {
        let K = {
                $pattern: q.UNDERSCORE_IDENT_RE,
                keyword: "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
                built_in: "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
                literal: "false null true"
            },
            _ = "(0|[1-9][\\d_]*)",
            z = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
            Y = "0[bB][01_]+",
            A = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            O = "0[xX]([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            w = "([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            $ = "((0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)(\\.\\d*|" + w + ")|\\d+\\.(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)|\\.(0|[1-9][\\d_]*)" + w + "?)",
            j = "(0[xX](([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)\\.([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)|\\.?([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))[pP][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            H = "((0|[1-9][\\d_]*)|0[bB][01_]+|" + O + ")",
            J = "(" + j + "|" + $ + ")",
            X = `\\\\(['"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};`,
            M = {
                className: "number",
                begin: "\\b" + H + "(L|u|U|Lu|LU|uL|UL)?",
                relevance: 0
            },
            P = {
                className: "number",
                begin: "\\b(" + J + "([fF]|L|i|[fF]i|Li)?|" + H + "(i|[fF]i|Li))",
                relevance: 0
            },
            W = {
                className: "string",
                begin: "'(" + X + "|.)",
                end: "'",
                illegal: "."
            },
            Z = {
                className: "string",
                begin: '"',
                contains: [{
                    begin: X,
                    relevance: 0
                }],
                end: '"[cwd]?'
            },
            G = {
                className: "string",
                begin: '[rq]"',
                end: '"[cwd]?',
                relevance: 5
            },
            f = {
                className: "string",
                begin: "`",
                end: "`[cwd]?"
            },
            v = {
                className: "string",
                begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
                relevance: 10
            },
            V = {
                className: "string",
                begin: 'q"\\{',
                end: '\\}"'
            },
            k = {
                className: "meta",
                begin: "^#!",
                end: "$",
                relevance: 5
            },
            N = {
                className: "meta",
                begin: "#(line)",
                end: "$",
                relevance: 5
            },
            R = {
                className: "keyword",
                begin: "@[a-zA-Z_][a-zA-Z_\\d]*"
            },
            h = q.COMMENT("\\/\\+", "\\+\\/", {
                contains: ["self"],
                relevance: 10
            });
        return {
            name: "D",
            keywords: K,
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, h, v, Z, G, f, V, P, M, W, k, N, R]
        }
    }
    dm4.exports = YGz
})
// @from(Ln 274479, Col 4)
nm4 = p((Siw, lm4) => {
    function AGz(q) {
        let K = {
                className: "subst",
                variants: [{
                    begin: "\\$[A-Za-z0-9_]+"
                }]
            },
            _ = {
                className: "subst",
                variants: [{
                    begin: /\$\{/,
                    end: /\}/
                }],
                keywords: "true false null this is new super"
            },
            z = {
                className: "string",
                variants: [{
                    begin: "r'''",
                    end: "'''"
                }, {
                    begin: 'r"""',
                    end: '"""'
                }, {
                    begin: "r'",
                    end: "'",
                    illegal: "\\n"
                }, {
                    begin: 'r"',
                    end: '"',
                    illegal: "\\n"
                }, {
                    begin: "'''",
                    end: "'''",
                    contains: [q.BACKSLASH_ESCAPE, K, _]
                }, {
                    begin: '"""',
                    end: '"""',
                    contains: [q.BACKSLASH_ESCAPE, K, _]
                }, {
                    begin: "'",
                    end: "'",
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE, K, _]
                }, {
                    begin: '"',
                    end: '"',
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE, K, _]
                }]
            };
        _.contains = [q.C_NUMBER_MODE, z];
        let Y = ["Comparable", "DateTime", "Duration", "Function", "Iterable", "Iterator", "List", "Map", "Match", "Object", "Pattern", "RegExp", "Set", "Stopwatch", "String", "StringBuffer", "StringSink", "Symbol", "Type", "Uri", "bool", "double", "int", "num", "Element", "ElementList"],
            A = Y.map((w) => `${w}?`);
        return {
            name: "Dart",
            keywords: {
                keyword: "abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory false final finally for Function get hide if implements import in inferface is late library mixin new null on operator part required rethrow return set show static super switch sync this throw true try typedef var void while with yield",
                built_in: Y.concat(A).concat(["Never", "Null", "dynamic", "print", "document", "querySelector", "querySelectorAll", "window"]),
                $pattern: /[A-Za-z][A-Za-z0-9_]*\??/
            },
            contains: [z, q.COMMENT(/\/\*\*(?!\/)/, /\*\//, {
                subLanguage: "markdown",
                relevance: 0
            }), q.COMMENT(/\/{3,} ?/, /$/, {
                contains: [{
                    subLanguage: "markdown",
                    begin: ".",
                    end: "$",
                    relevance: 0
                }]
            }), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "class",
                beginKeywords: "class interface",
                end: /\{/,
                excludeEnd: !0,
                contains: [{
                    beginKeywords: "extends implements"
                }, q.UNDERSCORE_TITLE_MODE]
            }, q.C_NUMBER_MODE, {
                className: "meta",
                begin: "@[A-Za-z]+"
            }, {
                begin: "=>"
            }]
        }
    }
    lm4.exports = AGz
})