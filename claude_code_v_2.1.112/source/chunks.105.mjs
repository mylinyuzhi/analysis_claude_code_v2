
// @from(Ln 274569, Col 4)
rm4 = p((Ciw, im4) => {
    function OGz(q) {
        let K = "exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure absolute reintroduce operator as is abstract alias assembler bitpacked break continue cppdecl cvar enumerator experimental platform deprecated unimplemented dynamic export far16 forward generic helper implements interrupt iochecks local name nodefault noreturn nostackframe oldfpccall otherwise saveregisters softfloat specialize strict unaligned varargs ",
            _ = [q.C_LINE_COMMENT_MODE, q.COMMENT(/\{/, /\}/, {
                relevance: 0
            }), q.COMMENT(/\(\*/, /\*\)/, {
                relevance: 10
            })],
            z = {
                className: "meta",
                variants: [{
                    begin: /\{\$/,
                    end: /\}/
                }, {
                    begin: /\(\*\$/,
                    end: /\*\)/
                }]
            },
            Y = {
                className: "string",
                begin: /'/,
                end: /'/,
                contains: [{
                    begin: /''/
                }]
            },
            A = {
                className: "number",
                relevance: 0,
                variants: [{
                    begin: "\\$[0-9A-Fa-f]+"
                }, {
                    begin: "&[0-7]+"
                }, {
                    begin: "%[01]+"
                }]
            },
            O = {
                className: "string",
                begin: /(#\d+)+/
            },
            w = {
                begin: q.IDENT_RE + "\\s*=\\s*class\\s*\\(",
                returnBegin: !0,
                contains: [q.TITLE_MODE]
            },
            $ = {
                className: "function",
                beginKeywords: "function constructor destructor procedure",
                end: /[:;]/,
                keywords: "function constructor|10 destructor|10 procedure|10",
                contains: [q.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: K,
                    contains: [Y, O, z].concat(_)
                }, z].concat(_)
            };
        return {
            name: "Delphi",
            aliases: ["dpr", "dfm", "pas", "pascal", "freepascal", "lazarus", "lpr", "lfm"],
            case_insensitive: !0,
            keywords: K,
            illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
            contains: [Y, O, q.NUMBER_MODE, A, w, $, z].concat(_)
        }
    }
    im4.exports = OGz
})
// @from(Ln 274639, Col 4)
am4 = p((biw, om4) => {
    function wGz(q) {
        return {
            name: "Diff",
            aliases: ["patch"],
            contains: [{
                className: "meta",
                relevance: 10,
                variants: [{
                    begin: /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/
                }, {
                    begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/
                }, {
                    begin: /^--- +\d+,\d+ +----$/
                }]
            }, {
                className: "comment",
                variants: [{
                    begin: /Index: /,
                    end: /$/
                }, {
                    begin: /^index/,
                    end: /$/
                }, {
                    begin: /={3,}/,
                    end: /$/
                }, {
                    begin: /^-{3}/,
                    end: /$/
                }, {
                    begin: /^\*{3} /,
                    end: /$/
                }, {
                    begin: /^\+{3}/,
                    end: /$/
                }, {
                    begin: /^\*{15}$/
                }, {
                    begin: /^diff --git/,
                    end: /$/
                }]
            }, {
                className: "addition",
                begin: /^\+/,
                end: /$/
            }, {
                className: "deletion",
                begin: /^-/,
                end: /$/
            }, {
                className: "addition",
                begin: /^!/,
                end: /$/
            }]
        }
    }
    om4.exports = wGz
})
// @from(Ln 274697, Col 4)
tm4 = p((Iiw, sm4) => {
    function $Gz(q) {
        let K = {
            begin: /\|[A-Za-z]+:?/,
            keywords: {
                name: "truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone"
            },
            contains: [q.QUOTE_STRING_MODE, q.APOS_STRING_MODE]
        };
        return {
            name: "Django",
            aliases: ["jinja"],
            case_insensitive: !0,
            subLanguage: "xml",
            contains: [q.COMMENT(/\{%\s*comment\s*%\}/, /\{%\s*endcomment\s*%\}/), q.COMMENT(/\{#/, /#\}/), {
                className: "template-tag",
                begin: /\{%/,
                end: /%\}/,
                contains: [{
                    className: "name",
                    begin: /\w+/,
                    keywords: {
                        name: "comment endcomment load templatetag ifchanged endifchanged if endif firstof for endfor ifnotequal endifnotequal widthratio extends include spaceless endspaceless regroup ifequal endifequal ssi now with cycle url filter endfilter debug block endblock else autoescape endautoescape csrf_token empty elif endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix plural get_current_language language get_available_languages get_current_language_bidi get_language_info get_language_info_list localize endlocalize localtime endlocaltime timezone endtimezone get_current_timezone verbatim"
                    },
                    starts: {
                        endsWithParent: !0,
                        keywords: "in by as",
                        contains: [K],
                        relevance: 0
                    }
                }]
            }, {
                className: "template-variable",
                begin: /\{\{/,
                end: /\}\}/,
                contains: [K]
            }]
        }
    }
    sm4.exports = $Gz
})
// @from(Ln 274738, Col 4)
qB4 = p((xiw, em4) => {
    function jGz(q) {
        return {
            name: "DNS Zone",
            aliases: ["bind", "zone"],
            keywords: {
                keyword: "IN A AAAA AFSDB APL CAA CDNSKEY CDS CERT CNAME DHCID DLV DNAME DNSKEY DS HIP IPSECKEY KEY KX LOC MX NAPTR NS NSEC NSEC3 NSEC3PARAM PTR RRSIG RP SIG SOA SRV SSHFP TA TKEY TLSA TSIG TXT"
            },
            contains: [q.COMMENT(";", "$", {
                relevance: 0
            }), {
                className: "meta",
                begin: /^\$(TTL|GENERATE|INCLUDE|ORIGIN)\b/
            }, {
                className: "number",
                begin: "((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))\\b"
            }, {
                className: "number",
                begin: "((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\b"
            }, q.inherit(q.NUMBER_MODE, {
                begin: /\b\d+[dhwm]?/
            })]
        }
    }
    em4.exports = jGz
})
// @from(Ln 274764, Col 4)
_B4 = p((uiw, KB4) => {
    function HGz(q) {
        return {
            name: "Dockerfile",
            aliases: ["docker"],
            case_insensitive: !0,
            keywords: "from maintainer expose env arg user onbuild stopsignal",
            contains: [q.HASH_COMMENT_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.NUMBER_MODE, {
                beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
                starts: {
                    end: /[^\\]$/,
                    subLanguage: "bash"
                }
            }],
            illegal: "</"
        }
    }
    KB4.exports = HGz
})
// @from(Ln 274783, Col 4)
YB4 = p((miw, zB4) => {
    function JGz(q) {
        let K = q.COMMENT(/^\s*@?rem\b/, /$/, {
            relevance: 10
        });
        return {
            name: "Batch file (DOS)",
            aliases: ["bat", "cmd"],
            case_insensitive: !0,
            illegal: /\/\*/,
            keywords: {
                keyword: "if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq",
                built_in: "prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux shift cd dir echo setlocal endlocal set pause copy append assoc at attrib break cacls cd chcp chdir chkdsk chkntfs cls cmd color comp compact convert date dir diskcomp diskcopy doskey erase fs find findstr format ftype graftabl help keyb label md mkdir mode more move path pause print popd pushd promt rd recover rem rename replace restore rmdir shift sort start subst time title tree type ver verify vol ping net ipconfig taskkill xcopy ren del"
            },
            contains: [{
                className: "variable",
                begin: /%%[^ ]|%[^ ]+?%|![^ ]+?!/
            }, {
                className: "function",
                begin: {
                    className: "symbol",
                    begin: "^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)",
                    relevance: 0
                }.begin,
                end: "goto:eof",
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                }), K]
            }, {
                className: "number",
                begin: "\\b\\d+",
                relevance: 0
            }, K]
        }
    }
    zB4.exports = JGz
})
// @from(Ln 274820, Col 4)
OB4 = p((Biw, AB4) => {
    function XGz(q) {
        return {
            keywords: "dsconfig",
            contains: [{
                className: "keyword",
                begin: "^dsconfig",
                end: /\s/,
                excludeEnd: !0,
                relevance: 10
            }, {
                className: "built_in",
                begin: /(list|create|get|set|delete)-(\w+)/,
                end: /\s/,
                excludeEnd: !0,
                illegal: "!@#$%^&*()",
                relevance: 10
            }, {
                className: "built_in",
                begin: /--(\w+)/,
                end: /\s/,
                excludeEnd: !0
            }, {
                className: "string",
                begin: /"/,
                end: /"/
            }, {
                className: "string",
                begin: /'/,
                end: /'/
            }, {
                className: "string",
                begin: /[\w\-?]+:\w+/,
                end: /\W/,
                relevance: 0
            }, {
                className: "string",
                begin: /\w+(\-\w+)*/,
                end: /(?=\W)/,
                relevance: 0
            }, q.HASH_COMMENT_MODE]
        }
    }
    AB4.exports = XGz
})
// @from(Ln 274865, Col 4)
$B4 = p((piw, wB4) => {
    function MGz(q) {
        let K = {
                className: "string",
                variants: [q.inherit(q.QUOTE_STRING_MODE, {
                    begin: '((u8?|U)|L)?"'
                }), {
                    begin: '(u8?|U)?R"',
                    end: '"',
                    contains: [q.BACKSLASH_ESCAPE]
                }, {
                    begin: "'\\\\?.",
                    end: "'",
                    illegal: "."
                }]
            },
            _ = {
                className: "number",
                variants: [{
                    begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"
                }, {
                    begin: q.C_NUMBER_RE
                }],
                relevance: 0
            },
            z = {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": "if else elif endif define undef ifdef ifndef"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, {
                    beginKeywords: "include",
                    end: "$",
                    keywords: {
                        "meta-keyword": "include"
                    },
                    contains: [q.inherit(K, {
                        className: "meta-string"
                    }), {
                        className: "meta-string",
                        begin: "<",
                        end: ">",
                        illegal: "\\n"
                    }]
                }, K, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
            },
            Y = {
                className: "variable",
                begin: /&[a-z\d_]*\b/
            },
            A = {
                className: "meta-keyword",
                begin: "/[a-z][a-z\\d-]*/"
            },
            O = {
                className: "symbol",
                begin: "^\\s*[a-zA-Z_][a-zA-Z\\d_]*:"
            },
            w = {
                className: "params",
                begin: "<",
                end: ">",
                contains: [_, Y]
            },
            $ = {
                className: "class",
                begin: /[a-zA-Z_][a-zA-Z\d_@]*\s\{/,
                end: /[{;=]/,
                returnBegin: !0,
                excludeEnd: !0
            };
        return {
            name: "Device Tree",
            keywords: "",
            contains: [{
                className: "class",
                begin: "/\\s*\\{",
                end: /\};/,
                relevance: 10,
                contains: [Y, A, O, $, w, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, _, K]
            }, Y, A, O, $, w, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, _, K, z, {
                begin: q.IDENT_RE + "::",
                keywords: ""
            }]
        }
    }
    wB4.exports = MGz
})
// @from(Ln 274958, Col 4)
HB4 = p((Fiw, jB4) => {
    function PGz(q) {
        return {
            name: "Dust",
            aliases: ["dst"],
            case_insensitive: !0,
            subLanguage: "xml",
            contains: [{
                className: "template-tag",
                begin: /\{[#\/]/,
                end: /\}/,
                illegal: /;/,
                contains: [{
                    className: "name",
                    begin: /[a-zA-Z\.-]+/,
                    starts: {
                        endsWithParent: !0,
                        relevance: 0,
                        contains: [q.QUOTE_STRING_MODE]
                    }
                }]
            }, {
                className: "template-variable",
                begin: /\{/,
                end: /\}/,
                illegal: /;/,
                keywords: "if eq ne lt lte gt gte select default math sep"
            }]
        }
    }
    jB4.exports = PGz
})
// @from(Ln 274990, Col 4)
XB4 = p((giw, JB4) => {
    function WGz(q) {
        let K = q.COMMENT(/\(\*/, /\*\)/),
            _ = {
                className: "attribute",
                begin: /^[ ]*[a-zA-Z]+([\s_-]+[a-zA-Z]+)*/
            },
            Y = {
                begin: /=/,
                end: /[.;]/,
                contains: [K, {
                    className: "meta",
                    begin: /\?.*\?/
                }, {
                    className: "string",
                    variants: [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, {
                        begin: "`",
                        end: "`"
                    }]
                }]
            };
        return {
            name: "Extended Backus-Naur Form",
            illegal: /\S/,
            contains: [K, _, Y]
        }
    }
    JB4.exports = WGz
})
// @from(Ln 275019, Col 4)
PB4 = p((Uiw, MB4) => {
    function DGz(q) {
        let z = {
                $pattern: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
                keyword: "and false then defined module in return redo retry end for true self when next until do begin unless nil break not case cond alias while ensure or include use alias fn quote require import with|0"
            },
            Y = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: z
            },
            A = {
                className: "number",
                begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[1-9][0-9_]*(\\.[0-9_]+([eE][-+]?[0-9]+)?)?)",
                relevance: 0
            },
            O = `[/|([{<"']`,
            w = {
                className: "string",
                begin: `~[a-z](?=[/|([{<"'])`,
                contains: [{
                    endsParent: !0,
                    contains: [{
                        contains: [q.BACKSLASH_ESCAPE, Y],
                        variants: [{
                            begin: /"/,
                            end: /"/
                        }, {
                            begin: /'/,
                            end: /'/
                        }, {
                            begin: /\//,
                            end: /\//
                        }, {
                            begin: /\|/,
                            end: /\|/
                        }, {
                            begin: /\(/,
                            end: /\)/
                        }, {
                            begin: /\[/,
                            end: /\]/
                        }, {
                            begin: /\{/,
                            end: /\}/
                        }, {
                            begin: /</,
                            end: />/
                        }]
                    }]
                }]
            },
            $ = {
                className: "string",
                begin: `~[A-Z](?=[/|([{<"'])`,
                contains: [{
                    begin: /"/,
                    end: /"/
                }, {
                    begin: /'/,
                    end: /'/
                }, {
                    begin: /\//,
                    end: /\//
                }, {
                    begin: /\|/,
                    end: /\|/
                }, {
                    begin: /\(/,
                    end: /\)/
                }, {
                    begin: /\[/,
                    end: /\]/
                }, {
                    begin: /\{/,
                    end: /\}/
                }, {
                    begin: /</,
                    end: />/
                }]
            },
            j = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE, Y],
                variants: [{
                    begin: /"""/,
                    end: /"""/
                }, {
                    begin: /'''/,
                    end: /'''/
                }, {
                    begin: /~S"""/,
                    end: /"""/,
                    contains: []
                }, {
                    begin: /~S"/,
                    end: /"/,
                    contains: []
                }, {
                    begin: /~S'''/,
                    end: /'''/,
                    contains: []
                }, {
                    begin: /~S'/,
                    end: /'/,
                    contains: []
                }, {
                    begin: /'/,
                    end: /'/
                }, {
                    begin: /"/,
                    end: /"/
                }]
            },
            H = {
                className: "function",
                beginKeywords: "def defp defmacro",
                end: /\B\b/,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
                    endsParent: !0
                })]
            },
            J = q.inherit(H, {
                className: "class",
                beginKeywords: "defimpl defmodule defprotocol defrecord",
                end: /\bdo\b|$|;/
            }),
            X = [j, $, w, q.HASH_COMMENT_MODE, J, H, {
                begin: "::"
            }, {
                className: "symbol",
                begin: ":(?![\\s:])",
                contains: [j, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?"
                }],
                relevance: 0
            }, {
                className: "symbol",
                begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?:(?!:)",
                relevance: 0
            }, A, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|@@?)(\\w+))"
            }, {
                begin: "->"
            }, {
                begin: "(" + q.RE_STARTERS_RE + ")\\s*",
                contains: [q.HASH_COMMENT_MODE, {
                    begin: /\/: (?=\d+\s*[,\]])/,
                    relevance: 0,
                    contains: [A]
                }, {
                    className: "regexp",
                    illegal: "\\n",
                    contains: [q.BACKSLASH_ESCAPE, Y],
                    variants: [{
                        begin: "/",
                        end: "/[a-z]*"
                    }, {
                        begin: "%r\\[",
                        end: "\\][a-z]*"
                    }]
                }],
                relevance: 0
            }];
        return Y.contains = X, {
            name: "Elixir",
            keywords: z,
            contains: X
        }
    }
    MB4.exports = DGz
})
// @from(Ln 275194, Col 4)
DB4 = p((Qiw, WB4) => {
    function ZGz(q) {
        let K = {
                variants: [q.COMMENT("--", "$"), q.COMMENT(/\{-/, /-\}/, {
                    contains: ["self"]
                })]
            },
            _ = {
                className: "type",
                begin: "\\b[A-Z][\\w']*",
                relevance: 0
            },
            z = {
                begin: "\\(",
                end: "\\)",
                illegal: '"',
                contains: [{
                    className: "type",
                    begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"
                }, K]
            },
            Y = {
                begin: /\{/,
                end: /\}/,
                contains: z.contains
            },
            A = {
                className: "string",
                begin: "'\\\\?.",
                end: "'",
                illegal: "."
            };
        return {
            name: "Elm",
            keywords: "let in if then else case of where module import exposing type alias as infix infixl infixr port effect command subscription",
            contains: [{
                beginKeywords: "port effect module",
                end: "exposing",
                keywords: "port effect module where command subscription exposing",
                contains: [z, K],
                illegal: "\\W\\.|;"
            }, {
                begin: "import",
                end: "$",
                keywords: "import as exposing",
                contains: [z, K],
                illegal: "\\W\\.|;"
            }, {
                begin: "type",
                end: "$",
                keywords: "type alias",
                contains: [_, z, Y, K]
            }, {
                beginKeywords: "infix infixl infixr",
                end: "$",
                contains: [q.C_NUMBER_MODE, K]
            }, {
                begin: "port",
                end: "$",
                keywords: "port",
                contains: [K]
            }, A, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE, _, q.inherit(q.TITLE_MODE, {
                begin: "^[_a-z][\\w']*"
            }), K, {
                begin: "->|<-"
            }],
            illegal: /;/
        }
    }
    WB4.exports = ZGz
})
// @from(Ln 275265, Col 4)
fB4 = p((diw, ZB4) => {
    function fGz(q) {
        return {
            name: "ERB",
            subLanguage: "xml",
            contains: [q.COMMENT("<%#", "%>"), {
                begin: "<%[%=-]?",
                end: "[%-]?%>",
                subLanguage: "ruby",
                excludeBegin: !0,
                excludeEnd: !0
            }]
        }
    }
    ZB4.exports = fGz
})
// @from(Ln 275281, Col 4)
vB4 = p((ciw, GB4) => {
    function GGz(q) {
        let _ = "([a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*|[a-z'][a-zA-Z0-9_']*)",
            z = {
                keyword: "after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun if let not of orelse|10 query receive rem try when xor",
                literal: "false true"
            },
            Y = q.COMMENT("%", "$"),
            A = {
                className: "number",
                begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
                relevance: 0
            },
            O = {
                begin: "fun\\s+[a-z'][a-zA-Z0-9_']*/\\d+"
            },
            w = {
                begin: _ + "\\(",
                end: "\\)",
                returnBegin: !0,
                relevance: 0,
                contains: [{
                    begin: _,
                    relevance: 0
                }, {
                    begin: "\\(",
                    end: "\\)",
                    endsWithParent: !0,
                    returnEnd: !0,
                    relevance: 0
                }]
            },
            $ = {
                begin: /\{/,
                end: /\}/,
                relevance: 0
            },
            j = {
                begin: "\\b_([A-Z][A-Za-z0-9_]*)?",
                relevance: 0
            },
            H = {
                begin: "[A-Z][a-zA-Z0-9_]*",
                relevance: 0
            },
            J = {
                begin: "#" + q.UNDERSCORE_IDENT_RE,
                relevance: 0,
                returnBegin: !0,
                contains: [{
                    begin: "#" + q.UNDERSCORE_IDENT_RE,
                    relevance: 0
                }, {
                    begin: /\{/,
                    end: /\}/,
                    relevance: 0
                }]
            },
            X = {
                beginKeywords: "fun receive if try case",
                end: "end",
                keywords: z
            };
        X.contains = [Y, O, q.inherit(q.APOS_STRING_MODE, {
            className: ""
        }), X, w, q.QUOTE_STRING_MODE, A, $, j, H, J];
        let M = [Y, O, X, w, q.QUOTE_STRING_MODE, A, $, j, H, J];
        w.contains[1].contains = M, $.contains = M, J.contains[1].contains = M;
        let P = ["-module", "-record", "-undef", "-export", "-ifdef", "-ifndef", "-author", "-copyright", "-doc", "-vsn", "-import", "-include", "-include_lib", "-compile", "-define", "-else", "-endif", "-file", "-behaviour", "-behavior", "-spec"],
            W = {
                className: "params",
                begin: "\\(",
                end: "\\)",
                contains: M
            };
        return {
            name: "Erlang",
            aliases: ["erl"],
            keywords: z,
            illegal: "(</|\\*=|\\+=|-=|/\\*|\\*/|\\(\\*|\\*\\))",
            contains: [{
                className: "function",
                begin: "^[a-z'][a-zA-Z0-9_']*\\s*\\(",
                end: "->",
                returnBegin: !0,
                illegal: "\\(|#|//|/\\*|\\\\|:|;",
                contains: [W, q.inherit(q.TITLE_MODE, {
                    begin: "[a-z'][a-zA-Z0-9_']*"
                })],
                starts: {
                    end: ";|\\.",
                    keywords: z,
                    contains: M
                }
            }, Y, {
                begin: "^-",
                end: "\\.",
                relevance: 0,
                excludeEnd: !0,
                returnBegin: !0,
                keywords: {
                    $pattern: "-" + q.IDENT_RE,
                    keyword: P.map((D) => `${D}|1.5`).join(" ")
                },
                contains: [W]
            }, A, q.QUOTE_STRING_MODE, J, j, H, $, {
                begin: /\.$/
            }]
        }
    }
    GB4.exports = GGz
})
// @from(Ln 275393, Col 4)
VB4 = p((liw, TB4) => {
    function vGz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function TGz(...q) {
        return q.map((_) => vGz(_)).join("")
    }

    function VGz(q) {
        return {
            name: "Erlang REPL",
            keywords: {
                built_in: "spawn spawn_link self",
                keyword: "after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"
            },
            contains: [{
                className: "meta",
                begin: "^[0-9]+> ",
                relevance: 10
            }, q.COMMENT("%", "$"), {
                className: "number",
                begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
                relevance: 0
            }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, {
                begin: TGz(/\?(::)?/, /([A-Z]\w*)/, /((::)[A-Z]\w*)*/)
            }, {
                begin: "->"
            }, {
                begin: "ok"
            }, {
                begin: "!"
            }, {
                begin: "(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",
                relevance: 0
            }, {
                begin: "[A-Z][a-zA-Z0-9_']*",
                relevance: 0
            }]
        }
    }
    TB4.exports = VGz
})
// @from(Ln 275438, Col 4)
NB4 = p((niw, kB4) => {
    function kGz(q) {
        return {
            name: "Excel formulae",
            aliases: ["xlsx", "xls"],
            case_insensitive: !0,
            keywords: {
                $pattern: /[a-zA-Z][\w\.]*/,
                built_in: "ABS ACCRINT ACCRINTM ACOS ACOSH ACOT ACOTH AGGREGATE ADDRESS AMORDEGRC AMORLINC AND ARABIC AREAS ASC ASIN ASINH ATAN ATAN2 ATANH AVEDEV AVERAGE AVERAGEA AVERAGEIF AVERAGEIFS BAHTTEXT BASE BESSELI BESSELJ BESSELK BESSELY BETADIST BETA.DIST BETAINV BETA.INV BIN2DEC BIN2HEX BIN2OCT BINOMDIST BINOM.DIST BINOM.DIST.RANGE BINOM.INV BITAND BITLSHIFT BITOR BITRSHIFT BITXOR CALL CEILING CEILING.MATH CEILING.PRECISE CELL CHAR CHIDIST CHIINV CHITEST CHISQ.DIST CHISQ.DIST.RT CHISQ.INV CHISQ.INV.RT CHISQ.TEST CHOOSE CLEAN CODE COLUMN COLUMNS COMBIN COMBINA COMPLEX CONCAT CONCATENATE CONFIDENCE CONFIDENCE.NORM CONFIDENCE.T CONVERT CORREL COS COSH COT COTH COUNT COUNTA COUNTBLANK COUNTIF COUNTIFS COUPDAYBS COUPDAYS COUPDAYSNC COUPNCD COUPNUM COUPPCD COVAR COVARIANCE.P COVARIANCE.S CRITBINOM CSC CSCH CUBEKPIMEMBER CUBEMEMBER CUBEMEMBERPROPERTY CUBERANKEDMEMBER CUBESET CUBESETCOUNT CUBEVALUE CUMIPMT CUMPRINC DATE DATEDIF DATEVALUE DAVERAGE DAY DAYS DAYS360 DB DBCS DCOUNT DCOUNTA DDB DEC2BIN DEC2HEX DEC2OCT DECIMAL DEGREES DELTA DEVSQ DGET DISC DMAX DMIN DOLLAR DOLLARDE DOLLARFR DPRODUCT DSTDEV DSTDEVP DSUM DURATION DVAR DVARP EDATE EFFECT ENCODEURL EOMONTH ERF ERF.PRECISE ERFC ERFC.PRECISE ERROR.TYPE EUROCONVERT EVEN EXACT EXP EXPON.DIST EXPONDIST FACT FACTDOUBLE FALSE|0 F.DIST FDIST F.DIST.RT FILTERXML FIND FINDB F.INV F.INV.RT FINV FISHER FISHERINV FIXED FLOOR FLOOR.MATH FLOOR.PRECISE FORECAST FORECAST.ETS FORECAST.ETS.CONFINT FORECAST.ETS.SEASONALITY FORECAST.ETS.STAT FORECAST.LINEAR FORMULATEXT FREQUENCY F.TEST FTEST FV FVSCHEDULE GAMMA GAMMA.DIST GAMMADIST GAMMA.INV GAMMAINV GAMMALN GAMMALN.PRECISE GAUSS GCD GEOMEAN GESTEP GETPIVOTDATA GROWTH HARMEAN HEX2BIN HEX2DEC HEX2OCT HLOOKUP HOUR HYPERLINK HYPGEOM.DIST HYPGEOMDIST IF IFERROR IFNA IFS IMABS IMAGINARY IMARGUMENT IMCONJUGATE IMCOS IMCOSH IMCOT IMCSC IMCSCH IMDIV IMEXP IMLN IMLOG10 IMLOG2 IMPOWER IMPRODUCT IMREAL IMSEC IMSECH IMSIN IMSINH IMSQRT IMSUB IMSUM IMTAN INDEX INDIRECT INFO INT INTERCEPT INTRATE IPMT IRR ISBLANK ISERR ISERROR ISEVEN ISFORMULA ISLOGICAL ISNA ISNONTEXT ISNUMBER ISODD ISREF ISTEXT ISO.CEILING ISOWEEKNUM ISPMT JIS KURT LARGE LCM LEFT LEFTB LEN LENB LINEST LN LOG LOG10 LOGEST LOGINV LOGNORM.DIST LOGNORMDIST LOGNORM.INV LOOKUP LOWER MATCH MAX MAXA MAXIFS MDETERM MDURATION MEDIAN MID MIDBs MIN MINIFS MINA MINUTE MINVERSE MIRR MMULT MOD MODE MODE.MULT MODE.SNGL MONTH MROUND MULTINOMIAL MUNIT N NA NEGBINOM.DIST NEGBINOMDIST NETWORKDAYS NETWORKDAYS.INTL NOMINAL NORM.DIST NORMDIST NORMINV NORM.INV NORM.S.DIST NORMSDIST NORM.S.INV NORMSINV NOT NOW NPER NPV NUMBERVALUE OCT2BIN OCT2DEC OCT2HEX ODD ODDFPRICE ODDFYIELD ODDLPRICE ODDLYIELD OFFSET OR PDURATION PEARSON PERCENTILE.EXC PERCENTILE.INC PERCENTILE PERCENTRANK.EXC PERCENTRANK.INC PERCENTRANK PERMUT PERMUTATIONA PHI PHONETIC PI PMT POISSON.DIST POISSON POWER PPMT PRICE PRICEDISC PRICEMAT PROB PRODUCT PROPER PV QUARTILE QUARTILE.EXC QUARTILE.INC QUOTIENT RADIANS RAND RANDBETWEEN RANK.AVG RANK.EQ RANK RATE RECEIVED REGISTER.ID REPLACE REPLACEB REPT RIGHT RIGHTB ROMAN ROUND ROUNDDOWN ROUNDUP ROW ROWS RRI RSQ RTD SEARCH SEARCHB SEC SECH SECOND SERIESSUM SHEET SHEETS SIGN SIN SINH SKEW SKEW.P SLN SLOPE SMALL SQL.REQUEST SQRT SQRTPI STANDARDIZE STDEV STDEV.P STDEV.S STDEVA STDEVP STDEVPA STEYX SUBSTITUTE SUBTOTAL SUM SUMIF SUMIFS SUMPRODUCT SUMSQ SUMX2MY2 SUMX2PY2 SUMXMY2 SWITCH SYD T TAN TANH TBILLEQ TBILLPRICE TBILLYIELD T.DIST T.DIST.2T T.DIST.RT TDIST TEXT TEXTJOIN TIME TIMEVALUE T.INV T.INV.2T TINV TODAY TRANSPOSE TREND TRIM TRIMMEAN TRUE|0 TRUNC T.TEST TTEST TYPE UNICHAR UNICODE UPPER VALUE VAR VAR.P VAR.S VARA VARP VARPA VDB VLOOKUP WEBSERVICE WEEKDAY WEEKNUM WEIBULL WEIBULL.DIST WORKDAY WORKDAY.INTL XIRR XNPV XOR YEAR YEARFRAC YIELD YIELDDISC YIELDMAT Z.TEST ZTEST"
            },
            contains: [{
                begin: /^=/,
                end: /[^=]/,
                returnEnd: !0,
                illegal: /=/,
                relevance: 10
            }, {
                className: "symbol",
                begin: /\b[A-Z]{1,2}\d+\b/,
                end: /[^\d]/,
                excludeEnd: !0,
                relevance: 0
            }, {
                className: "symbol",
                begin: /[A-Z]{0,2}\d*:[A-Z]{0,2}\d*/,
                relevance: 0
            }, q.BACKSLASH_ESCAPE, q.QUOTE_STRING_MODE, {
                className: "number",
                begin: q.NUMBER_RE + "(%)?",
                relevance: 0
            }, q.COMMENT(/\bN\(/, /\)/, {
                excludeBegin: !0,
                excludeEnd: !0,
                illegal: /\n/
            })]
        }
    }
    kB4.exports = kGz
})
// @from(Ln 275477, Col 4)
yB4 = p((iiw, EB4) => {
    function NGz(q) {
        return {
            name: "FIX",
            contains: [{
                begin: /[^\u2401\u0001]+/,
                end: /[\u2401\u0001]/,
                excludeEnd: !0,
                returnBegin: !0,
                returnEnd: !1,
                contains: [{
                    begin: /([^\u2401\u0001=]+)/,
                    end: /=([^\u2401\u0001=]+)/,
                    returnEnd: !0,
                    returnBegin: !1,
                    className: "attr"
                }, {
                    begin: /=/,
                    end: /([\u2401\u0001])/,
                    excludeEnd: !0,
                    excludeBegin: !0,
                    className: "string"
                }]
            }],
            case_insensitive: !0
        }
    }
    EB4.exports = NGz
})
// @from(Ln 275506, Col 4)
hB4 = p((riw, LB4) => {
    function EGz(q) {
        let K = {
                className: "string",
                begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/
            },
            _ = {
                className: "string",
                variants: [{
                    begin: '"',
                    end: '"'
                }]
            },
            Y = {
                className: "function",
                beginKeywords: "def",
                end: /[:={\[(\n;]/,
                excludeEnd: !0,
                contains: [{
                    className: "title",
                    relevance: 0,
                    begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/
                }]
            };
        return {
            name: "Flix",
            keywords: {
                literal: "true false",
                keyword: "case class def else enum if impl import in lat rel index let match namespace switch type yield with"
            },
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, K, _, Y, q.C_NUMBER_MODE]
        }
    }
    LB4.exports = EGz
})
// @from(Ln 275541, Col 4)
SB4 = p((oiw, RB4) => {
    function yGz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Ko1(...q) {
        return q.map((_) => yGz(_)).join("")
    }

    function LGz(q) {
        let K = {
                className: "params",
                begin: "\\(",
                end: "\\)"
            },
            _ = {
                variants: [q.COMMENT("!", "$", {
                    relevance: 0
                }), q.COMMENT("^C[ ]", "$", {
                    relevance: 0
                }), q.COMMENT("^C$", "$", {
                    relevance: 0
                })]
            },
            z = /(_[a-z_\d]+)?/,
            Y = /([de][+-]?\d+)?/,
            A = {
                className: "number",
                variants: [{
                    begin: Ko1(/\b\d+/, /\.(\d*)/, Y, z)
                }, {
                    begin: Ko1(/\b\d+/, Y, z)
                }, {
                    begin: Ko1(/\.\d+/, Y, z)
                }],
                relevance: 0
            },
            O = {
                className: "function",
                beginKeywords: "subroutine function program",
                illegal: "[${=\\n]",
                contains: [q.UNDERSCORE_TITLE_MODE, K]
            },
            w = {
                className: "string",
                relevance: 0,
                variants: [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
            };
        return {
            name: "Fortran",
            case_insensitive: !0,
            aliases: ["f90", "f95"],
            keywords: {
                literal: ".False. .True.",
                keyword: "kind do concurrent local shared while private call intrinsic where elsewhere type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then block endblock endassociate public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. goto save else use module select case access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit continue format pause cycle exit c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg synchronous nopass non_overridable pass protected volatile abstract extends import non_intrinsic value deferred generic final enumerator class associate bind enum c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure impure integer real character complex logical codimension dimension allocatable|10 parameter external implicit|10 none double precision assign intent optional pointer target in out common equivalence data",
                built_in: "alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr num_images parity popcnt poppar shifta shiftl shiftr this_image sync change team co_broadcast co_max co_min co_sum co_reduce"
            },
            illegal: /\/\*/,
            contains: [w, O, {
                begin: /^C\s*=(?!=)/,
                relevance: 0
            }, _, A]
        }
    }
    RB4.exports = LGz
})
// @from(Ln 275609, Col 4)
bB4 = p((aiw, CB4) => {
    function hGz(q) {
        let K = {
            begin: "<",
            end: ">",
            contains: [q.inherit(q.TITLE_MODE, {
                begin: /'[a-zA-Z0-9_]+/
            })]
        };
        return {
            name: "F#",
            aliases: ["fs"],
            keywords: "abstract and as assert base begin class default delegate do done downcast downto elif else end exception extern false finally for fun function global if in inherit inline interface internal lazy let match member module mutable namespace new null of open or override private public rec return sig static struct then to true try type upcast use val void when while with yield",
            illegal: /\/\*/,
            contains: [{
                className: "keyword",
                begin: /\b(yield|return|let|do)!/
            }, {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [{
                    begin: '""'
                }]
            }, {
                className: "string",
                begin: '"""',
                end: '"""'
            }, q.COMMENT("\\(\\*(\\s)", "\\*\\)", {
                contains: ["self"]
            }), {
                className: "class",
                beginKeywords: "type",
                end: "\\(|=|$",
                excludeEnd: !0,
                contains: [q.UNDERSCORE_TITLE_MODE, K]
            }, {
                className: "meta",
                begin: "\\[<",
                end: ">\\]",
                relevance: 10
            }, {
                className: "symbol",
                begin: "\\B('[A-Za-z])\\b",
                contains: [q.BACKSLASH_ESCAPE]
            }, q.C_LINE_COMMENT_MODE, q.inherit(q.QUOTE_STRING_MODE, {
                illegal: null
            }), q.C_NUMBER_MODE]
        }
    }
    CB4.exports = hGz
})
// @from(Ln 275661, Col 4)
xB4 = p((siw, IB4) => {
    function RGz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function SGz(q) {
        return _o1("(", q, ")*")
    }

    function _o1(...q) {
        return q.map((_) => RGz(_)).join("")
    }

    function CGz(q) {
        let K = {
                keyword: "abort acronym acronyms alias all and assign binary card diag display else eq file files for free ge gt if integer le loop lt maximizing minimizing model models ne negative no not option options or ord positive prod put putpage puttl repeat sameas semicont semiint smax smin solve sos1 sos2 sum system table then until using while xor yes",
                literal: "eps inf na",
                built_in: "abs arccos arcsin arctan arctan2 Beta betaReg binomial ceil centropy cos cosh cvPower div div0 eDist entropy errorf execSeed exp fact floor frac gamma gammaReg log logBeta logGamma log10 log2 mapVal max min mod ncpCM ncpF ncpVUpow ncpVUsin normal pi poly power randBinomial randLinear randTriangle round rPower sigmoid sign signPower sin sinh slexp sllog10 slrec sqexp sqlog10 sqr sqrec sqrt tan tanh trunc uniform uniformInt vcPower bool_and bool_eqv bool_imp bool_not bool_or bool_xor ifThen rel_eq rel_ge rel_gt rel_le rel_lt rel_ne gday gdow ghour gleap gmillisec gminute gmonth gsecond gyear jdate jnow jstart jtime errorLevel execError gamsRelease gamsVersion handleCollect handleDelete handleStatus handleSubmit heapFree heapLimit heapSize jobHandle jobKill jobStatus jobTerminate licenseLevel licenseStatus maxExecError sleep timeClose timeComp timeElapsed timeExec timeStart"
            },
            _ = {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0
            },
            z = {
                className: "symbol",
                variants: [{
                    begin: /=[lgenxc]=/
                }, {
                    begin: /\$/
                }]
            },
            Y = {
                className: "comment",
                variants: [{
                    begin: "'",
                    end: "'"
                }, {
                    begin: '"',
                    end: '"'
                }],
                illegal: "\\n",
                contains: [q.BACKSLASH_ESCAPE]
            },
            A = {
                begin: "/",
                end: "/",
                keywords: K,
                contains: [Y, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, q.C_NUMBER_MODE]
            },
            O = /[a-z0-9&#*=?@\\><:,()$[\]_.{}!+%^-]+/,
            w = {
                begin: /[a-z][a-z0-9_]*(\([a-z0-9_, ]*\))?[ \t]+/,
                excludeBegin: !0,
                end: "$",
                endsWithParent: !0,
                contains: [Y, A, {
                    className: "comment",
                    begin: _o1(O, SGz(_o1(/[ ]+/, O))),
                    relevance: 0
                }]
            };
        return {
            name: "GAMS",
            aliases: ["gms"],
            case_insensitive: !0,
            keywords: K,
            contains: [q.COMMENT(/^\$ontext/, /^\$offtext/), {
                className: "meta",
                begin: "^\\$[a-z0-9]+",
                end: "$",
                returnBegin: !0,
                contains: [{
                    className: "meta-keyword",
                    begin: "^\\$[a-z0-9]+"
                }]
            }, q.COMMENT("^\\*", "$"), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, {
                beginKeywords: "set sets parameter parameters variable variables scalar scalars equation equations",
                end: ";",
                contains: [q.COMMENT("^\\*", "$"), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, A, w]
            }, {
                beginKeywords: "table",
                end: ";",
                returnBegin: !0,
                contains: [{
                    beginKeywords: "table",
                    end: "$",
                    contains: [w]
                }, q.COMMENT("^\\*", "$"), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, q.C_NUMBER_MODE]
            }, {
                className: "function",
                begin: /^[a-z][a-z0-9_,\-+' ()$]+\.{2}/,
                returnBegin: !0,
                contains: [{
                    className: "title",
                    begin: /^[a-z0-9_]+/
                }, _, z]
            }, q.C_NUMBER_MODE, z]
        }
    }
    IB4.exports = CGz
})
// @from(Ln 275767, Col 4)
mB4 = p((tiw, uB4) => {
    function bGz(q) {
        let K = {
                keyword: "bool break call callexe checkinterrupt clear clearg closeall cls comlog compile continue create debug declare delete disable dlibrary dllcall do dos ed edit else elseif enable end endfor endif endp endo errorlog errorlogat expr external fn for format goto gosub graph if keyword let lib library line load loadarray loadexe loadf loadk loadm loadp loads loadx local locate loopnextindex lprint lpwidth lshow matrix msym ndpclex new open output outwidth plot plotsym pop prcsn print printdos proc push retp return rndcon rndmod rndmult rndseed run save saveall screen scroll setarray show sparse stop string struct system trace trap threadfor threadendfor threadbegin threadjoin threadstat threadend until use while winprint ne ge le gt lt and xor or not eq eqv",
                built_in: "abs acf aconcat aeye amax amean AmericanBinomCall AmericanBinomCall_Greeks AmericanBinomCall_ImpVol AmericanBinomPut AmericanBinomPut_Greeks AmericanBinomPut_ImpVol AmericanBSCall AmericanBSCall_Greeks AmericanBSCall_ImpVol AmericanBSPut AmericanBSPut_Greeks AmericanBSPut_ImpVol amin amult annotationGetDefaults annotationSetBkd annotationSetFont annotationSetLineColor annotationSetLineStyle annotationSetLineThickness annualTradingDays arccos arcsin areshape arrayalloc arrayindex arrayinit arraytomat asciiload asclabel astd astds asum atan atan2 atranspose axmargin balance band bandchol bandcholsol bandltsol bandrv bandsolpd bar base10 begwind besselj bessely beta box boxcox cdfBeta cdfBetaInv cdfBinomial cdfBinomialInv cdfBvn cdfBvn2 cdfBvn2e cdfCauchy cdfCauchyInv cdfChic cdfChii cdfChinc cdfChincInv cdfExp cdfExpInv cdfFc cdfFnc cdfFncInv cdfGam cdfGenPareto cdfHyperGeo cdfLaplace cdfLaplaceInv cdfLogistic cdfLogisticInv cdfmControlCreate cdfMvn cdfMvn2e cdfMvnce cdfMvne cdfMvt2e cdfMvtce cdfMvte cdfN cdfN2 cdfNc cdfNegBinomial cdfNegBinomialInv cdfNi cdfPoisson cdfPoissonInv cdfRayleigh cdfRayleighInv cdfTc cdfTci cdfTnc cdfTvn cdfWeibull cdfWeibullInv cdir ceil ChangeDir chdir chiBarSquare chol choldn cholsol cholup chrs close code cols colsf combinate combinated complex con cond conj cons ConScore contour conv convertsatostr convertstrtosa corrm corrms corrvc corrx corrxs cos cosh counts countwts crossprd crout croutp csrcol csrlin csvReadM csvReadSA cumprodc cumsumc curve cvtos datacreate datacreatecomplex datalist dataload dataloop dataopen datasave date datestr datestring datestrymd dayinyr dayofweek dbAddDatabase dbClose dbCommit dbCreateQuery dbExecQuery dbGetConnectOptions dbGetDatabaseName dbGetDriverName dbGetDrivers dbGetHostName dbGetLastErrorNum dbGetLastErrorText dbGetNumericalPrecPolicy dbGetPassword dbGetPort dbGetTableHeaders dbGetTables dbGetUserName dbHasFeature dbIsDriverAvailable dbIsOpen dbIsOpenError dbOpen dbQueryBindValue dbQueryClear dbQueryCols dbQueryExecPrepared dbQueryFetchAllM dbQueryFetchAllSA dbQueryFetchOneM dbQueryFetchOneSA dbQueryFinish dbQueryGetBoundValue dbQueryGetBoundValues dbQueryGetField dbQueryGetLastErrorNum dbQueryGetLastErrorText dbQueryGetLastInsertID dbQueryGetLastQuery dbQueryGetPosition dbQueryIsActive dbQueryIsForwardOnly dbQueryIsNull dbQueryIsSelect dbQueryIsValid dbQueryPrepare dbQueryRows dbQuerySeek dbQuerySeekFirst dbQuerySeekLast dbQuerySeekNext dbQuerySeekPrevious dbQuerySetForwardOnly dbRemoveDatabase dbRollback dbSetConnectOptions dbSetDatabaseName dbSetHostName dbSetNumericalPrecPolicy dbSetPort dbSetUserName dbTransaction DeleteFile delif delrows denseToSp denseToSpRE denToZero design det detl dfft dffti diag diagrv digamma doswin DOSWinCloseall DOSWinOpen dotfeq dotfeqmt dotfge dotfgemt dotfgt dotfgtmt dotfle dotflemt dotflt dotfltmt dotfne dotfnemt draw drop dsCreate dstat dstatmt dstatmtControlCreate dtdate dtday dttime dttodtv dttostr dttoutc dtvnormal dtvtodt dtvtoutc dummy dummybr dummydn eig eigh eighv eigv elapsedTradingDays endwind envget eof eqSolve eqSolvemt eqSolvemtControlCreate eqSolvemtOutCreate eqSolveset erf erfc erfccplx erfcplx error etdays ethsec etstr EuropeanBinomCall EuropeanBinomCall_Greeks EuropeanBinomCall_ImpVol EuropeanBinomPut EuropeanBinomPut_Greeks EuropeanBinomPut_ImpVol EuropeanBSCall EuropeanBSCall_Greeks EuropeanBSCall_ImpVol EuropeanBSPut EuropeanBSPut_Greeks EuropeanBSPut_ImpVol exctsmpl exec execbg exp extern eye fcheckerr fclearerr feq feqmt fflush fft ffti fftm fftmi fftn fge fgemt fgets fgetsa fgetsat fgetst fgt fgtmt fileinfo filesa fle flemt floor flt fltmt fmod fne fnemt fonts fopen formatcv formatnv fputs fputst fseek fstrerror ftell ftocv ftos ftostrC gamma gammacplx gammaii gausset gdaAppend gdaCreate gdaDStat gdaDStatMat gdaGetIndex gdaGetName gdaGetNames gdaGetOrders gdaGetType gdaGetTypes gdaGetVarInfo gdaIsCplx gdaLoad gdaPack gdaRead gdaReadByIndex gdaReadSome gdaReadSparse gdaReadStruct gdaReportVarInfo gdaSave gdaUpdate gdaUpdateAndPack gdaVars gdaWrite gdaWrite32 gdaWriteSome getarray getdims getf getGAUSShome getmatrix getmatrix4D getname getnamef getNextTradingDay getNextWeekDay getnr getorders getpath getPreviousTradingDay getPreviousWeekDay getRow getscalar3D getscalar4D getTrRow getwind glm gradcplx gradMT gradMTm gradMTT gradMTTm gradp graphprt graphset hasimag header headermt hess hessMT hessMTg hessMTgw hessMTm hessMTmw hessMTT hessMTTg hessMTTgw hessMTTm hessMTw hessp hist histf histp hsec imag indcv indexcat indices indices2 indicesf indicesfn indnv indsav integrate1d integrateControlCreate intgrat2 intgrat3 inthp1 inthp2 inthp3 inthp4 inthpControlCreate intquad1 intquad2 intquad3 intrleav intrleavsa intrsect intsimp inv invpd invswp iscplx iscplxf isden isinfnanmiss ismiss key keyav keyw lag lag1 lagn lapEighb lapEighi lapEighvb lapEighvi lapgEig lapgEigh lapgEighv lapgEigv lapgSchur lapgSvdcst lapgSvds lapgSvdst lapSvdcusv lapSvds lapSvdusv ldlp ldlsol linSolve listwise ln lncdfbvn lncdfbvn2 lncdfmvn lncdfn lncdfn2 lncdfnc lnfact lngammacplx lnpdfmvn lnpdfmvt lnpdfn lnpdft loadd loadstruct loadwind loess loessmt loessmtControlCreate log loglog logx logy lower lowmat lowmat1 ltrisol lu lusol machEpsilon make makevars makewind margin matalloc matinit mattoarray maxbytes maxc maxindc maxv maxvec mbesselei mbesselei0 mbesselei1 mbesseli mbesseli0 mbesseli1 meanc median mergeby mergevar minc minindc minv miss missex missrv moment momentd movingave movingaveExpwgt movingaveWgt nextindex nextn nextnevn nextwind ntos null null1 numCombinations ols olsmt olsmtControlCreate olsqr olsqr2 olsqrmt ones optn optnevn orth outtyp pacf packedToSp packr parse pause pdfCauchy pdfChi pdfExp pdfGenPareto pdfHyperGeo pdfLaplace pdfLogistic pdfn pdfPoisson pdfRayleigh pdfWeibull pi pinv pinvmt plotAddArrow plotAddBar plotAddBox plotAddHist plotAddHistF plotAddHistP plotAddPolar plotAddScatter plotAddShape plotAddTextbox plotAddTS plotAddXY plotArea plotBar plotBox plotClearLayout plotContour plotCustomLayout plotGetDefaults plotHist plotHistF plotHistP plotLayout plotLogLog plotLogX plotLogY plotOpenWindow plotPolar plotSave plotScatter plotSetAxesPen plotSetBar plotSetBarFill plotSetBarStacked plotSetBkdColor plotSetFill plotSetGrid plotSetLegend plotSetLineColor plotSetLineStyle plotSetLineSymbol plotSetLineThickness plotSetNewWindow plotSetTitle plotSetWhichYAxis plotSetXAxisShow plotSetXLabel plotSetXRange plotSetXTicInterval plotSetXTicLabel plotSetYAxisShow plotSetYLabel plotSetYRange plotSetZAxisShow plotSetZLabel plotSurface plotTS plotXY polar polychar polyeval polygamma polyint polymake polymat polymroot polymult polyroot pqgwin previousindex princomp printfm printfmt prodc psi putarray putf putvals pvCreate pvGetIndex pvGetParNames pvGetParVector pvLength pvList pvPack pvPacki pvPackm pvPackmi pvPacks pvPacksi pvPacksm pvPacksmi pvPutParVector pvTest pvUnpack QNewton QNewtonmt QNewtonmtControlCreate QNewtonmtOutCreate QNewtonSet QProg QProgmt QProgmtInCreate qqr qqre qqrep qr qre qrep qrsol qrtsol qtyr qtyre qtyrep quantile quantiled qyr qyre qyrep qz rank rankindx readr real reclassify reclassifyCuts recode recserar recsercp recserrc rerun rescale reshape rets rev rfft rffti rfftip rfftn rfftnp rfftp rndBernoulli rndBeta rndBinomial rndCauchy rndChiSquare rndCon rndCreateState rndExp rndGamma rndGeo rndGumbel rndHyperGeo rndi rndKMbeta rndKMgam rndKMi rndKMn rndKMnb rndKMp rndKMu rndKMvm rndLaplace rndLCbeta rndLCgam rndLCi rndLCn rndLCnb rndLCp rndLCu rndLCvm rndLogNorm rndMTu rndMVn rndMVt rndn rndnb rndNegBinomial rndp rndPoisson rndRayleigh rndStateSkip rndu rndvm rndWeibull rndWishart rotater round rows rowsf rref sampleData satostrC saved saveStruct savewind scale scale3d scalerr scalinfnanmiss scalmiss schtoc schur searchsourcepath seekr select selif seqa seqm setdif setdifsa setvars setvwrmode setwind shell shiftr sin singleindex sinh sleep solpd sortc sortcc sortd sorthc sorthcc sortind sortindc sortmc sortr sortrc spBiconjGradSol spChol spConjGradSol spCreate spDenseSubmat spDiagRvMat spEigv spEye spLDL spline spLU spNumNZE spOnes spreadSheetReadM spreadSheetReadSA spreadSheetWrite spScale spSubmat spToDense spTrTDense spTScalar spZeros sqpSolve sqpSolveMT sqpSolveMTControlCreate sqpSolveMTlagrangeCreate sqpSolveMToutCreate sqpSolveSet sqrt statements stdc stdsc stocv stof strcombine strindx strlen strput strrindx strsect strsplit strsplitPad strtodt strtof strtofcplx strtriml strtrimr strtrunc strtruncl strtruncpad strtruncr submat subscat substute subvec sumc sumr surface svd svd1 svd2 svdcusv svds svdusv sysstate tab tan tanh tempname time timedt timestr timeutc title tkf2eps tkf2ps tocart todaydt toeplitz token topolar trapchk trigamma trimr trunc type typecv typef union unionsa uniqindx uniqindxsa unique uniquesa upmat upmat1 upper utctodt utctodtv utrisol vals varCovMS varCovXS varget vargetl varmall varmares varput varputl vartypef vcm vcms vcx vcxs vec vech vecr vector vget view viewxyz vlist vnamecv volume vput vread vtypecv wait waitc walkindex where window writer xlabel xlsGetSheetCount xlsGetSheetSize xlsGetSheetTypes xlsMakeRange xlsReadM xlsReadSA xlsWrite xlsWriteM xlsWriteSA xpnd xtics xy xyz ylabel ytics zeros zeta zlabel ztics cdfEmpirical dot h5create h5open h5read h5readAttribute h5write h5writeAttribute ldl plotAddErrorBar plotAddSurface plotCDFEmpirical plotSetColormap plotSetContourLabels plotSetLegendFont plotSetTextInterpreter plotSetXTicCount plotSetYTicCount plotSetZLevels powerm strjoin sylvester strtrim",
                literal: "DB_AFTER_LAST_ROW DB_ALL_TABLES DB_BATCH_OPERATIONS DB_BEFORE_FIRST_ROW DB_BLOB DB_EVENT_NOTIFICATIONS DB_FINISH_QUERY DB_HIGH_PRECISION DB_LAST_INSERT_ID DB_LOW_PRECISION_DOUBLE DB_LOW_PRECISION_INT32 DB_LOW_PRECISION_INT64 DB_LOW_PRECISION_NUMBERS DB_MULTIPLE_RESULT_SETS DB_NAMED_PLACEHOLDERS DB_POSITIONAL_PLACEHOLDERS DB_PREPARED_QUERIES DB_QUERY_SIZE DB_SIMPLE_LOCKING DB_SYSTEM_TABLES DB_TABLES DB_TRANSACTIONS DB_UNICODE DB_VIEWS __STDIN __STDOUT __STDERR __FILE_DIR"
            },
            _ = q.COMMENT("@", "@"),
            z = {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": "define definecs|10 undef ifdef ifndef iflight ifdllcall ifmac ifos2win ifunix else endif lineson linesoff srcfile srcline"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, {
                    beginKeywords: "include",
                    end: "$",
                    keywords: {
                        "meta-keyword": "include"
                    },
                    contains: [{
                        className: "meta-string",
                        begin: '"',
                        end: '"',
                        illegal: "\\n"
                    }]
                }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, _]
            },
            Y = {
                begin: /\bstruct\s+/,
                end: /\s/,
                keywords: "struct",
                contains: [{
                    className: "type",
                    begin: q.UNDERSCORE_IDENT_RE,
                    relevance: 0
                }]
            },
            A = [{
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                endsWithParent: !0,
                relevance: 0,
                contains: [{
                    className: "literal",
                    begin: /\.\.\./
                }, q.C_NUMBER_MODE, q.C_BLOCK_COMMENT_MODE, _, Y]
            }],
            O = {
                className: "title",
                begin: q.UNDERSCORE_IDENT_RE,
                relevance: 0
            },
            w = function(X, M, P) {
                let W = q.inherit({
                    className: "function",
                    beginKeywords: X,
                    end: M,
                    excludeEnd: !0,
                    contains: [].concat(A)
                }, P || {});
                return W.contains.push(O), W.contains.push(q.C_NUMBER_MODE), W.contains.push(q.C_BLOCK_COMMENT_MODE), W.contains.push(_), W
            },
            $ = {
                className: "built_in",
                begin: "\\b(" + K.built_in.split(" ").join("|") + ")\\b"
            },
            j = {
                className: "string",
                begin: '"',
                end: '"',
                contains: [q.BACKSLASH_ESCAPE],
                relevance: 0
            },
            H = {
                begin: q.UNDERSCORE_IDENT_RE + "\\s*\\(",
                returnBegin: !0,
                keywords: K,
                relevance: 0,
                contains: [{
                    beginKeywords: K.keyword
                }, $, {
                    className: "built_in",
                    begin: q.UNDERSCORE_IDENT_RE,
                    relevance: 0
                }]
            },
            J = {
                begin: /\(/,
                end: /\)/,
                relevance: 0,
                keywords: {
                    built_in: K.built_in,
                    literal: K.literal
                },
                contains: [q.C_NUMBER_MODE, q.C_BLOCK_COMMENT_MODE, _, $, H, j, "self"]
            };
        return H.contains.push(J), {
            name: "GAUSS",
            aliases: ["gss"],
            case_insensitive: !0,
            keywords: K,
            illegal: /(\{[%#]|[%#]\}| <- )/,
            contains: [q.C_NUMBER_MODE, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, _, j, z, {
                className: "keyword",
                begin: /\bexternal (matrix|string|array|sparse matrix|struct|proc|keyword|fn)/
            }, w("proc keyword", ";"), w("fn", "="), {
                beginKeywords: "for threadfor",
                end: /;/,
                relevance: 0,
                contains: [q.C_BLOCK_COMMENT_MODE, _, J]
            }, {
                variants: [{
                    begin: q.UNDERSCORE_IDENT_RE + "\\." + q.UNDERSCORE_IDENT_RE
                }, {
                    begin: q.UNDERSCORE_IDENT_RE + "\\s*="
                }],
                relevance: 0
            }, H, Y]
        }
    }
    uB4.exports = bGz
})
// @from(Ln 275897, Col 4)
pB4 = p((eiw, BB4) => {
    function IGz(q) {
        let z = {
                $pattern: "[A-Z_][A-Z0-9_.]*",
                keyword: "IF DO WHILE ENDWHILE CALL ENDIF SUB ENDSUB GOTO REPEAT ENDREPEAT EQ LT GT NE GE LE OR XOR"
            },
            Y = {
                className: "meta",
                begin: "([O])([0-9]+)"
            },
            A = q.inherit(q.C_NUMBER_MODE, {
                begin: "([-+]?((\\.\\d+)|(\\d+)(\\.\\d*)?))|" + q.C_NUMBER_RE
            }),
            O = [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.COMMENT(/\(/, /\)/), A, q.inherit(q.APOS_STRING_MODE, {
                illegal: null
            }), q.inherit(q.QUOTE_STRING_MODE, {
                illegal: null
            }), {
                className: "name",
                begin: "([G])([0-9]+\\.?[0-9]?)"
            }, {
                className: "name",
                begin: "([M])([0-9]+\\.?[0-9]?)"
            }, {
                className: "attr",
                begin: "(VC|VS|#)",
                end: "(\\d+)"
            }, {
                className: "attr",
                begin: "(VZOFX|VZOFY|VZOFZ)"
            }, {
                className: "built_in",
                begin: "(ATAN|ABS|ACOS|ASIN|SIN|COS|EXP|FIX|FUP|ROUND|LN|TAN)(\\[)",
                contains: [A],
                end: "\\]"
            }, {
                className: "symbol",
                variants: [{
                    begin: "N",
                    end: "\\d+",
                    illegal: "\\W"
                }]
            }];
        return {
            name: "G-code (ISO 6983)",
            aliases: ["nc"],
            case_insensitive: !0,
            keywords: z,
            contains: [{
                className: "meta",
                begin: "%"
            }, Y].concat(O)
        }
    }
    BB4.exports = IGz
})
// @from(Ln 275953, Col 4)
gB4 = p((qrw, FB4) => {
    function xGz(q) {
        return {
            name: "Gherkin",
            aliases: ["feature"],
            keywords: "Feature Background Ability Business Need Scenario Scenarios Scenario Outline Scenario Template Examples Given And Then But When",
            contains: [{
                className: "symbol",
                begin: "\\*",
                relevance: 0
            }, {
                className: "meta",
                begin: "@[^@\\s]+"
            }, {
                begin: "\\|",
                end: "\\|\\w*$",
                contains: [{
                    className: "string",
                    begin: "[^|]+"
                }]
            }, {
                className: "variable",
                begin: "<",
                end: ">"
            }, q.HASH_COMMENT_MODE, {
                className: "string",
                begin: '"""',
                end: '"""'
            }, q.QUOTE_STRING_MODE]
        }
    }
    FB4.exports = xGz
})
// @from(Ln 275986, Col 4)
QB4 = p((Krw, UB4) => {
    function uGz(q) {
        return {
            name: "GLSL",
            keywords: {
                keyword: "break continue discard do else for if return while switch case default attribute binding buffer ccw centroid centroid varying coherent column_major const cw depth_any depth_greater depth_less depth_unchanged early_fragment_tests equal_spacing flat fractional_even_spacing fractional_odd_spacing highp in index inout invariant invocations isolines layout line_strip lines lines_adjacency local_size_x local_size_y local_size_z location lowp max_vertices mediump noperspective offset origin_upper_left out packed patch pixel_center_integer point_mode points precise precision quads r11f_g11f_b10f r16 r16_snorm r16f r16i r16ui r32f r32i r32ui r8 r8_snorm r8i r8ui readonly restrict rg16 rg16_snorm rg16f rg16i rg16ui rg32f rg32i rg32ui rg8 rg8_snorm rg8i rg8ui rgb10_a2 rgb10_a2ui rgba16 rgba16_snorm rgba16f rgba16i rgba16ui rgba32f rgba32i rgba32ui rgba8 rgba8_snorm rgba8i rgba8ui row_major sample shared smooth std140 std430 stream triangle_strip triangles triangles_adjacency uniform varying vertices volatile writeonly",
                type: "atomic_uint bool bvec2 bvec3 bvec4 dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 dmat3x4 dmat4 dmat4x2 dmat4x3 dmat4x4 double dvec2 dvec3 dvec4 float iimage1D iimage1DArray iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer iimageCube iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray image2DRect image3D imageBuffer imageCube imageCubeArray int isampler1D isampler1DArray isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D isamplerBuffer isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 mat2 mat2x2 mat2x3 mat2x4 mat3 mat3x2 mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 sampler1D sampler1DArray sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray sampler2DArrayShadow sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow sampler3D samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow image1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray uimage2DRect uimage3D uimageBuffer uimageCube uimageCubeArray uint usampler1D usampler1DArray usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D samplerBuffer usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 vec2 vec3 vec4 void",
                built_in: "gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize gl_MaxClipDistances gl_MaxClipPlanes gl_MaxCombinedAtomicCounterBuffers gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms gl_MaxCombinedImageUnitsAndFragmentOutputs gl_MaxCombinedTextureImageUnits gl_MaxComputeAtomicCounterBuffers gl_MaxComputeAtomicCounters gl_MaxComputeImageUniforms gl_MaxComputeTextureImageUnits gl_MaxComputeUniformComponents gl_MaxComputeWorkGroupCount gl_MaxComputeWorkGroupSize gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers gl_MaxFragmentAtomicCounters gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents gl_MaxFragmentInputVectors gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs gl_MaxVertexImageUniforms gl_MaxVertexOutputComponents gl_MaxVertexOutputVectors gl_MaxVertexTextureImageUnits gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffset gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial gl_FrontSecondaryColor gl_GlobalInvocationID gl_InstanceID gl_InvocationID gl_Layer gl_LightModel gl_LightSource gl_LocalInvocationID gl_LocalInvocationIndex gl_ModelViewMatrix gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose gl_ModelViewMatrixTranspose gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse gl_ModelViewProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixTranspose gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_Normal gl_NormalMatrix gl_NormalScale gl_NumSamples gl_NumWorkGroups gl_ObjectPlaneQ gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn gl_Point gl_PointCoord gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn gl_ProjectionMatrix gl_ProjectionMatrixInverse gl_ProjectionMatrixInverseTranspose gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask gl_SampleMaskIn gl_SamplePosition gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter gl_TexCoord gl_TextureEnvColor gl_TextureMatrix gl_TextureMatrixInverse gl_TextureMatrixInverseTranspose gl_TextureMatrixTranspose gl_Vertex gl_VertexID gl_ViewportIndex gl_WorkGroupID gl_WorkGroupSize gl_in gl_out EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive abs acos acosh all any asin asinh atan atanh atomicAdd atomicAnd atomicCompSwap atomicCounter atomicCounterDecrement atomicCounterIncrement atomicExchange atomicMax atomicMin atomicOr atomicXor barrier bitCount bitfieldExtract bitfieldInsert bitfieldReverse ceil clamp cos cosh cross dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward findLSB findMSB floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan greaterThanEqual groupMemoryBarrier imageAtomicAdd imageAtomicAnd imageAtomicCompSwap imageAtomicExchange imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad imageSize imageStore imulExtended intBitsToFloat interpolateAtCentroid interpolateAtOffset interpolateAtSample inverse inversesqrt isinf isnan ldexp length lessThan lessThanEqual log log2 matrixCompMult max memoryBarrier memoryBarrierAtomicCounter memoryBarrierBuffer memoryBarrierImage memoryBarrierShared min mix mod modf noise1 noise2 noise3 noise4 normalize not notEqual outerProduct packDouble2x32 packHalf2x16 packSnorm2x16 packSnorm4x8 packUnorm2x16 packUnorm4x8 pow radians reflect refract round roundEven shadow1D shadow1DLod shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj shadow2DProjLod sign sin sinh smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture texture1D texture1DLod texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj texture2DProjLod texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset textureLod textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset textureProjLod textureProjLodOffset textureProjOffset textureQueryLevels textureQueryLod textureSize transpose trunc uaddCarry uintBitsToFloat umulExtended unpackDouble2x32 unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 unpackUnorm2x16 unpackUnorm4x8 usubBorrow",
                literal: "true false"
            },
            illegal: '"',
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.C_NUMBER_MODE, {
                className: "meta",
                begin: "#",
                end: "$"
            }]
        }
    }
    UB4.exports = uGz
})