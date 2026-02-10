
// @from(Ln 248526, Col 4)
fo7 = R((_Nw, Zo7) => {
    var py9 = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
        dy9 = ["true", "false", "null", "undefined", "NaN", "Infinity"],
        cy9 = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
        ly9 = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
        iy9 = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
        ny9 = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
        ry9 = [].concat(iy9, ny9, cy9, ly9);

    function oy9(A) {
        let q = ["npm", "print"],
            K = ["yes", "no", "on", "off"],
            Y = ["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"],
            z = ["var", "const", "let", "function", "static"],
            w = (j) => (M) => !j.includes(M),
            H = {
                keyword: py9.concat(Y).filter(w(z)),
                literal: dy9.concat(K),
                built_in: ry9.concat(q)
            },
            $ = "[A-Za-z$_][0-9A-Za-z$_]*",
            O = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: H
            },
            _ = [A.BINARY_NUMBER_MODE, A.inherit(A.C_NUMBER_MODE, {
                starts: {
                    end: "(\\s*/)?",
                    relevance: 0
                }
            }), {
                className: "string",
                variants: [{
                    begin: /'''/,
                    end: /'''/,
                    contains: [A.BACKSLASH_ESCAPE]
                }, {
                    begin: /'/,
                    end: /'/,
                    contains: [A.BACKSLASH_ESCAPE]
                }, {
                    begin: /"""/,
                    end: /"""/,
                    contains: [A.BACKSLASH_ESCAPE, O]
                }, {
                    begin: /"/,
                    end: /"/,
                    contains: [A.BACKSLASH_ESCAPE, O]
                }]
            }, {
                className: "regexp",
                variants: [{
                    begin: "///",
                    end: "///",
                    contains: [O, A.HASH_COMMENT_MODE]
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
        O.contains = _;
        let J = A.inherit(A.TITLE_MODE, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*"
            }),
            X = "(\\(.*\\)\\s*)?\\B[-=]>",
            D = {
                className: "params",
                begin: "\\([^\\(]",
                returnBegin: !0,
                contains: [{
                    begin: /\(/,
                    end: /\)/,
                    keywords: H,
                    contains: ["self"].concat(_)
                }]
            };
        return {
            name: "CoffeeScript",
            aliases: ["coffee", "cson", "iced"],
            keywords: H,
            illegal: /\/\*/,
            contains: _.concat([A.COMMENT("###", "###"), A.HASH_COMMENT_MODE, {
                className: "function",
                begin: "^\\s*[A-Za-z$_][0-9A-Za-z$_]*\\s*=\\s*" + X,
                end: "[-=]>",
                returnBegin: !0,
                contains: [J, D]
            }, {
                begin: /[:\(,=]\s*/,
                relevance: 0,
                contains: [{
                    className: "function",
                    begin: X,
                    end: "[-=]>",
                    returnBegin: !0,
                    contains: [D]
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
                    contains: [J]
                }, J]
            }, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*:",
                end: ":",
                returnBegin: !0,
                returnEnd: !0,
                relevance: 0
            }])
        }
    }
    Zo7.exports = oy9
})
// @from(Ln 248662, Col 4)
No7 = R((JNw, Vo7) => {
    function ay9(A) {
        return {
            name: "Coq",
            keywords: {
                keyword: "_|0 as at cofix else end exists exists2 fix for forall fun if IF in let match mod Prop return Set then Type using where with Abort About Add Admit Admitted All Arguments Assumptions Axiom Back BackTo Backtrack Bind Blacklist Canonical Cd Check Class Classes Close Coercion Coercions CoFixpoint CoInductive Collection Combined Compute Conjecture Conjectures Constant constr Constraint Constructors Context Corollary CreateHintDb Cut Declare Defined Definition Delimit Dependencies Dependent Derive Drop eauto End Equality Eval Example Existential Existentials Existing Export exporting Extern Extract Extraction Fact Field Fields File Fixpoint Focus for From Function Functional Generalizable Global Goal Grab Grammar Graph Guarded Heap Hint HintDb Hints Hypotheses Hypothesis ident Identity If Immediate Implicit Import Include Inductive Infix Info Initial Inline Inspect Instance Instances Intro Intros Inversion Inversion_clear Language Left Lemma Let Libraries Library Load LoadPath Local Locate Ltac ML Mode Module Modules Monomorphic Morphism Next NoInline Notation Obligation Obligations Opaque Open Optimize Options Parameter Parameters Parametric Path Paths pattern Polymorphic Preterm Print Printing Program Projections Proof Proposition Pwd Qed Quit Rec Record Recursive Redirect Relation Remark Remove Require Reserved Reset Resolve Restart Rewrite Right Ring Rings Save Scheme Scope Scopes Script Search SearchAbout SearchHead SearchPattern SearchRewrite Section Separate Set Setoid Show Solve Sorted Step Strategies Strategy Structure SubClass Table Tables Tactic Term Test Theorem Time Timeout Transparent Type Typeclasses Types Undelimit Undo Unfocus Unfocused Unfold Universe Universes Unset Unshelve using Variable Variables Variant Verbose Visibility where with",
                built_in: "abstract absurd admit after apply as assert assumption at auto autorewrite autounfold before bottom btauto by case case_eq cbn cbv change classical_left classical_right clear clearbody cofix compare compute congruence constr_eq constructor contradict contradiction cut cutrewrite cycle decide decompose dependent destruct destruction dintuition discriminate discrR do double dtauto eapply eassumption eauto ecase econstructor edestruct ediscriminate eelim eexact eexists einduction einjection eleft elim elimtype enough equality erewrite eright esimplify_eq esplit evar exact exactly_once exfalso exists f_equal fail field field_simplify field_simplify_eq first firstorder fix fold fourier functional generalize generalizing gfail give_up has_evar hnf idtac in induction injection instantiate intro intro_pattern intros intuition inversion inversion_clear is_evar is_var lapply lazy left lia lra move native_compute nia nsatz omega once pattern pose progress proof psatz quote record red refine reflexivity remember rename repeat replace revert revgoals rewrite rewrite_strat right ring ring_simplify rtauto set setoid_reflexivity setoid_replace setoid_rewrite setoid_symmetry setoid_transitivity shelve shelve_unifiable simpl simple simplify_eq solve specialize split split_Rabs split_Rmult stepl stepr subst sum swap symmetry tactic tauto time timeout top transitivity trivial try tryif unfold unify until using vm_compute with"
            },
            contains: [A.QUOTE_STRING_MODE, A.COMMENT("\\(\\*", "\\*\\)"), A.C_NUMBER_MODE, {
                className: "type",
                excludeBegin: !0,
                begin: "\\|\\s*",
                end: "\\w+"
            }, {
                begin: /[-=]>/
            }]
        }
    }
    Vo7.exports = ay9
})
// @from(Ln 248682, Col 4)
vo7 = R((XNw, To7) => {
    function sy9(A) {
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
            }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
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
    To7.exports = sy9
})
// @from(Ln 248744, Col 4)
ko7 = R((DNw, Eo7) => {
    function ty9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function ey9(A) {
        return MPA("(?=", A, ")")
    }

    function kJ6(A) {
        return MPA("(", A, ")?")
    }

    function MPA(...A) {
        return A.map((K) => ty9(K)).join("")
    }

    function AC9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            w = "(decltype\\(auto\\)|" + kJ6("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + kJ6("<[^<>]+>") + ")",
            H = {
                className: "keyword",
                begin: "\\b[a-z\\d_]*_t\\b"
            },
            $ = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
            O = {
                className: "string",
                variants: [{
                    begin: '(u8?|U|L)?"',
                    end: '"',
                    illegal: "\\n",
                    contains: [A.BACKSLASH_ESCAPE]
                }, {
                    begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                    end: "'",
                    illegal: "."
                }, A.END_SAME_AS_BEGIN({
                    begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                    end: /\)([^()\\ ]{0,16})"/
                })]
            },
            _ = {
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
            J = {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, A.inherit(O, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/
                }, q, A.C_BLOCK_COMMENT_MODE]
            },
            X = {
                className: "title",
                begin: kJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            D = kJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
            M = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "_Bool _Complex _Imaginary",
                _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
                literal: "true false nullptr NULL"
            },
            P = {
                className: "function.dispatch",
                relevance: 0,
                keywords: M,
                begin: MPA(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, ey9(/\s*\(/))
            },
            W = [P, J, H, q, A.C_BLOCK_COMMENT_MODE, _, O],
            G = {
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
                contains: W.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: M,
                    contains: W.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            f = {
                className: "function",
                begin: "(" + w + "[\\*&\\s]+)+" + D,
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
                    begin: D,
                    returnBegin: !0,
                    contains: [X],
                    relevance: 0
                }, {
                    begin: /::/,
                    relevance: 0
                }, {
                    begin: /:/,
                    endsWithParent: !0,
                    contains: [O, _]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: M,
                    relevance: 0,
                    contains: [q, A.C_BLOCK_COMMENT_MODE, O, _, H, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: M,
                        relevance: 0,
                        contains: ["self", q, A.C_BLOCK_COMMENT_MODE, O, _, H]
                    }]
                }, H, q, A.C_BLOCK_COMMENT_MODE, J]
            };
        return {
            name: "C++",
            aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
            keywords: M,
            illegal: "</",
            classNameAliases: {
                "function.dispatch": "built_in"
            },
            contains: [].concat(G, f, P, W, [J, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: M,
                contains: ["self", H]
            }, {
                begin: A.IDENT_RE + "::",
                keywords: M
            }, {
                className: "class",
                beginKeywords: "enum class struct union",
                end: /[{;:<>=]/,
                contains: [{
                    beginKeywords: "final class struct"
                }, A.TITLE_MODE]
            }]),
            exports: {
                preprocessor: J,
                strings: O,
                keywords: M
            }
        }
    }
    Eo7.exports = AC9
})
// @from(Ln 248934, Col 4)
Ro7 = R((jNw, Lo7) => {
    function qC9(A) {
        let K = "group clone ms master location colocation order fencing_topology rsc_ticket acl_target acl_group user role tag xml",
            Y = "property rsc_defaults op_defaults",
            z = "params meta operations op rule attributes utilization",
            w = "read write deny defined not_defined in_range date spec in ref reference attribute type xpath version and or lt gt tag lte gte eq ne \\",
            H = "number string",
            $ = "Master Started Slave Stopped start promote demote stop monitor true false";
        return {
            name: "crmsh",
            aliases: ["crm", "pcmk"],
            case_insensitive: !0,
            keywords: {
                keyword: "params meta operations op rule attributes utilization " + w + " number string",
                literal: "Master Started Slave Stopped start promote demote stop monitor true false"
            },
            contains: [A.HASH_COMMENT_MODE, {
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
                begin: "\\b(" + K.split(" ").join("|") + ")\\s+",
                keywords: K,
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
            }, A.QUOTE_STRING_MODE, {
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
    Lo7.exports = qC9
})
// @from(Ln 249007, Col 4)
Co7 = R((MNw, yo7) => {
    function KC9(A) {
        let H = {
                $pattern: "[a-zA-Z_]\\w*[!?=]?",
                keyword: "abstract alias annotation as as? asm begin break case class def do else elsif end ensure enum extend for fun if include instance_sizeof is_a? lib macro module next nil? of out pointerof private protected rescue responds_to? return require select self sizeof struct super then type typeof union uninitialized unless until verbatim when while with yield __DIR__ __END_LINE__ __FILE__ __LINE__",
                literal: "false nil true"
            },
            $ = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: H
            },
            O = {
                className: "template-variable",
                variants: [{
                    begin: "\\{\\{",
                    end: "\\}\\}"
                }, {
                    begin: "\\{%",
                    end: "%\\}"
                }],
                keywords: H
            };

        function _(W, G) {
            let f = [{
                begin: W,
                end: G
            }];
            return f[0].contains = f, f
        }
        let J = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE, $],
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
                    contains: _("\\(", "\\)")
                }, {
                    begin: "%[Qwi]?\\[",
                    end: "\\]",
                    contains: _("\\[", "\\]")
                }, {
                    begin: "%[Qwi]?\\{",
                    end: /\}/,
                    contains: _(/\{/, /\}/)
                }, {
                    begin: "%[Qwi]?<",
                    end: ">",
                    contains: _("<", ">")
                }, {
                    begin: "%[Qwi]?\\|",
                    end: "\\|"
                }, {
                    begin: /<<-\w+$/,
                    end: /^\s*\w+$/
                }],
                relevance: 0
            },
            X = {
                className: "string",
                variants: [{
                    begin: "%q\\(",
                    end: "\\)",
                    contains: _("\\(", "\\)")
                }, {
                    begin: "%q\\[",
                    end: "\\]",
                    contains: _("\\[", "\\]")
                }, {
                    begin: "%q\\{",
                    end: /\}/,
                    contains: _(/\{/, /\}/)
                }, {
                    begin: "%q<",
                    end: ">",
                    contains: _("<", ">")
                }, {
                    begin: "%q\\|",
                    end: "\\|"
                }, {
                    begin: /<<-'\w+'$/,
                    end: /^\s*\w+$/
                }],
                relevance: 0
            },
            D = {
                begin: "(?!%\\})(" + A.RE_STARTERS_RE + "|\\n|\\b(case|if|select|unless|until|when|while)\\b)\\s*",
                keywords: "case if select unless until when while",
                contains: [{
                    className: "regexp",
                    contains: [A.BACKSLASH_ESCAPE, $],
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
            j = {
                className: "regexp",
                contains: [A.BACKSLASH_ESCAPE, $],
                variants: [{
                    begin: "%r\\(",
                    end: "\\)",
                    contains: _("\\(", "\\)")
                }, {
                    begin: "%r\\[",
                    end: "\\]",
                    contains: _("\\[", "\\]")
                }, {
                    begin: "%r\\{",
                    end: /\}/,
                    contains: _(/\{/, /\}/)
                }, {
                    begin: "%r<",
                    end: ">",
                    contains: _("<", ">")
                }, {
                    begin: "%r\\|",
                    end: "\\|"
                }],
                relevance: 0
            },
            M = {
                className: "meta",
                begin: "@\\[",
                end: "\\]",
                contains: [A.inherit(A.QUOTE_STRING_MODE, {
                    className: "meta-string"
                })]
            },
            P = [O, J, X, j, D, M, A.HASH_COMMENT_MODE, {
                className: "class",
                beginKeywords: "class module struct",
                end: "$|;",
                illegal: /=/,
                contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                }), {
                    begin: "<"
                }]
            }, {
                className: "class",
                beginKeywords: "lib enum union",
                end: "$|;",
                illegal: /=/,
                contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                })]
            }, {
                beginKeywords: "annotation",
                end: "$|;",
                illegal: /=/,
                contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                })],
                relevance: 2
            }, {
                className: "function",
                beginKeywords: "def",
                end: /\B\b/,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
                    endsParent: !0
                })]
            }, {
                className: "function",
                beginKeywords: "fun macro",
                end: /\B\b/,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
                    endsParent: !0
                })],
                relevance: 2
            }, {
                className: "symbol",
                begin: A.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
                relevance: 0
            }, {
                className: "symbol",
                begin: ":",
                contains: [J, {
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
        return $.contains = P, O.contains = P.slice(1), {
            name: "Crystal",
            aliases: ["cr"],
            keywords: H,
            contains: P
        }
    }
    yo7.exports = KC9
})
// @from(Ln 249230, Col 4)
ho7 = R((PNw, So7) => {
    function YC9(A) {
        let q = ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
            K = ["public", "private", "protected", "static", "internal", "protected", "abstract", "async", "extern", "override", "unsafe", "virtual", "new", "sealed", "partial"],
            Y = ["default", "false", "null", "true"],
            z = ["abstract", "as", "base", "break", "case", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"],
            w = ["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"],
            H = {
                keyword: z.concat(w),
                built_in: q,
                literal: Y
            },
            $ = A.inherit(A.TITLE_MODE, {
                begin: "[a-zA-Z](\\.?\\w)*"
            }),
            O = {
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
            _ = {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [{
                    begin: '""'
                }]
            },
            J = A.inherit(_, {
                illegal: /\n/
            }),
            X = {
                className: "subst",
                begin: /\{/,
                end: /\}/,
                keywords: H
            },
            D = A.inherit(X, {
                illegal: /\n/
            }),
            j = {
                className: "string",
                begin: /\$"/,
                end: '"',
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, A.BACKSLASH_ESCAPE, D]
            },
            M = {
                className: "string",
                begin: /\$@"/,
                end: '"',
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, {
                    begin: '""'
                }, X]
            },
            P = A.inherit(M, {
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, {
                    begin: '""'
                }, D]
            });
        X.contains = [M, j, _, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, O, A.C_BLOCK_COMMENT_MODE], D.contains = [P, j, J, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, O, A.inherit(A.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/
        })];
        let W = {
                variants: [M, j, _, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
            },
            G = {
                begin: "<",
                end: ">",
                contains: [{
                    beginKeywords: "in out"
                }, $]
            },
            f = A.IDENT_RE + "(<" + A.IDENT_RE + "(\\s*,\\s*" + A.IDENT_RE + ")*>)?(\\[\\])?",
            Z = {
                begin: "@" + A.IDENT_RE,
                relevance: 0
            };
        return {
            name: "C#",
            aliases: ["cs", "c#"],
            keywords: H,
            illegal: /::/,
            contains: [A.COMMENT("///", "$", {
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
            }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line region endregion pragma checksum"
                }
            }, W, O, {
                beginKeywords: "class interface",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:,]/,
                contains: [{
                    beginKeywords: "where class"
                }, $, G, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "namespace",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [$, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "record",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [$, G, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
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
                begin: "(" + f + "\\s+)+" + A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                returnBegin: !0,
                end: /\s*[{;=]/,
                excludeEnd: !0,
                keywords: H,
                contains: [{
                    beginKeywords: K.join(" "),
                    relevance: 0
                }, {
                    begin: A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                    returnBegin: !0,
                    contains: [A.TITLE_MODE, G],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: H,
                    relevance: 0,
                    contains: [W, O, A.C_BLOCK_COMMENT_MODE]
                }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, Z]
        }
    }
    So7.exports = YC9
})
// @from(Ln 249417, Col 4)
xo7 = R((WNw, Io7) => {
    function zC9(A) {
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
    Io7.exports = zC9
})
// @from(Ln 249440, Col 4)
uo7 = R((GNw, bo7) => {
    var wC9 = (A) => {
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
                    contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
                }
            }
        },
        HC9 = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
        $C9 = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
        OC9 = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
        _C9 = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
        JC9 = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "auto", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "clip-path", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-variation-settings", "font-weight", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inherit", "initial", "justify-content", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "mask", "max-height", "max-width", "min-height", "min-width", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "right", "src", "tab-size", "table-layout", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index"].reverse();

    function XC9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function DC9(A) {
        return jC9("(?=", A, ")")
    }

    function jC9(...A) {
        return A.map((K) => XC9(K)).join("")
    }

    function MC9(A) {
        let q = wC9(A),
            K = {
                className: "built_in",
                begin: /[\w-]+(?=\()/
            },
            Y = {
                begin: /-(webkit|moz|ms|o)-(?=[a-z])/
            },
            z = "and or not only",
            w = /@-?\w[\w]*(-\w+)*/,
            H = "[a-zA-Z-][a-zA-Z0-9_-]*",
            $ = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE];
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
            contains: [A.C_BLOCK_COMMENT_MODE, Y, A.CSS_NUMBER_MODE, {
                className: "selector-id",
                begin: /#[A-Za-z0-9_-]+/,
                relevance: 0
            }, {
                className: "selector-class",
                begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
                relevance: 0
            }, q.ATTRIBUTE_SELECTOR_MODE, {
                className: "selector-pseudo",
                variants: [{
                    begin: ":(" + OC9.join("|") + ")"
                }, {
                    begin: "::(" + _C9.join("|") + ")"
                }]
            }, {
                className: "attribute",
                begin: "\\b(" + JC9.join("|") + ")\\b"
            }, {
                begin: ":",
                end: "[;}]",
                contains: [q.HEXCOLOR, q.IMPORTANT, A.CSS_NUMBER_MODE, ...$, {
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
                }, K]
            }, {
                begin: DC9(/@/),
                end: "[{;]",
                relevance: 0,
                illegal: /:/,
                contains: [{
                    className: "keyword",
                    begin: w
                }, {
                    begin: /\s/,
                    endsWithParent: !0,
                    excludeEnd: !0,
                    relevance: 0,
                    keywords: {
                        $pattern: /[a-z-]+/,
                        keyword: "and or not only",
                        attribute: $C9.join(" ")
                    },
                    contains: [{
                        begin: /[a-z-]+(?=:)/,
                        className: "attribute"
                    }, ...$, A.CSS_NUMBER_MODE]
                }]
            }, {
                className: "selector-tag",
                begin: "\\b(" + HC9.join("|") + ")\\b"
            }]
        }
    }
    bo7.exports = MC9
})
// @from(Ln 249569, Col 4)
mo7 = R((ZNw, Bo7) => {
    function PC9(A) {
        let q = {
                $pattern: A.UNDERSCORE_IDENT_RE,
                keyword: "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
                built_in: "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
                literal: "false null true"
            },
            K = "(0|[1-9][\\d_]*)",
            Y = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
            z = "0[bB][01_]+",
            w = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            H = "0[xX]([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            $ = "([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            O = "((0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)(\\.\\d*|" + $ + ")|\\d+\\.(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)|\\.(0|[1-9][\\d_]*)" + $ + "?)",
            _ = "(0[xX](([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)\\.([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)|\\.?([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))[pP][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            J = "((0|[1-9][\\d_]*)|0[bB][01_]+|" + H + ")",
            X = "(" + _ + "|" + O + ")",
            D = `\\\\(['"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};`,
            j = {
                className: "number",
                begin: "\\b" + J + "(L|u|U|Lu|LU|uL|UL)?",
                relevance: 0
            },
            M = {
                className: "number",
                begin: "\\b(" + X + "([fF]|L|i|[fF]i|Li)?|" + J + "(i|[fF]i|Li))",
                relevance: 0
            },
            P = {
                className: "string",
                begin: "'(" + D + "|.)",
                end: "'",
                illegal: "."
            },
            G = {
                className: "string",
                begin: '"',
                contains: [{
                    begin: D,
                    relevance: 0
                }],
                end: '"[cwd]?'
            },
            f = {
                className: "string",
                begin: '[rq]"',
                end: '"[cwd]?',
                relevance: 5
            },
            Z = {
                className: "string",
                begin: "`",
                end: "`[cwd]?"
            },
            N = {
                className: "string",
                begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
                relevance: 10
            },
            T = {
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
            y = {
                className: "meta",
                begin: "#(line)",
                end: "$",
                relevance: 5
            },
            B = {
                className: "keyword",
                begin: "@[a-zA-Z_][a-zA-Z_\\d]*"
            },
            S = A.COMMENT("\\/\\+", "\\+\\/", {
                contains: ["self"],
                relevance: 10
            });
        return {
            name: "D",
            keywords: q,
            contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, S, N, G, f, Z, T, M, j, P, k, y, B]
        }
    }
    Bo7.exports = PC9
})
// @from(Ln 249662, Col 4)
Qo7 = R((fNw, Fo7) => {
    function WC9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function GC9(...A) {
        return A.map((K) => WC9(K)).join("")
    }

    function ZC9(A) {
        let q = {
                begin: /<\/?[A-Za-z_]/,
                end: ">",
                subLanguage: "xml",
                relevance: 0
            },
            K = {
                begin: "^[-\\*]{3,}",
                end: "$"
            },
            Y = {
                className: "code",
                variants: [{
                    begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*"
                }, {
                    begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
                }, {
                    begin: "```",
                    end: "```+[ ]*$"
                }, {
                    begin: "~~~",
                    end: "~~~+[ ]*$"
                }, {
                    begin: "`.+?`"
                }, {
                    begin: "(?=^( {4}|\\t))",
                    contains: [{
                        begin: "^( {4}|\\t)",
                        end: "(\\n)$"
                    }],
                    relevance: 0
                }]
            },
            z = {
                className: "bullet",
                begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
                end: "\\s+",
                excludeEnd: !0
            },
            w = {
                begin: /^\[[^\n]+\]:/,
                returnBegin: !0,
                contains: [{
                    className: "symbol",
                    begin: /\[/,
                    end: /\]/,
                    excludeBegin: !0,
                    excludeEnd: !0
                }, {
                    className: "link",
                    begin: /:\s*/,
                    end: /$/,
                    excludeBegin: !0
                }]
            },
            $ = {
                variants: [{
                    begin: /\[.+?\]\[.*?\]/,
                    relevance: 0
                }, {
                    begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
                    relevance: 2
                }, {
                    begin: GC9(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
                    relevance: 2
                }, {
                    begin: /\[.+?\]\([./?&#].*?\)/,
                    relevance: 1
                }, {
                    begin: /\[.+?\]\(.*?\)/,
                    relevance: 0
                }],
                returnBegin: !0,
                contains: [{
                    className: "string",
                    relevance: 0,
                    begin: "\\[",
                    end: "\\]",
                    excludeBegin: !0,
                    returnEnd: !0
                }, {
                    className: "link",
                    relevance: 0,
                    begin: "\\]\\(",
                    end: "\\)",
                    excludeBegin: !0,
                    excludeEnd: !0
                }, {
                    className: "symbol",
                    relevance: 0,
                    begin: "\\]\\[",
                    end: "\\]",
                    excludeBegin: !0,
                    excludeEnd: !0
                }]
            },
            O = {
                className: "strong",
                contains: [],
                variants: [{
                    begin: /_{2}/,
                    end: /_{2}/
                }, {
                    begin: /\*{2}/,
                    end: /\*{2}/
                }]
            },
            _ = {
                className: "emphasis",
                contains: [],
                variants: [{
                    begin: /\*(?!\*)/,
                    end: /\*/
                }, {
                    begin: /_(?!_)/,
                    end: /_/,
                    relevance: 0
                }]
            };
        O.contains.push(_), _.contains.push(O);
        let J = [q, $];
        return O.contains = O.contains.concat(J), _.contains = _.contains.concat(J), J = J.concat(O, _), {
            name: "Markdown",
            aliases: ["md", "mkdown", "mkd"],
            contains: [{
                className: "section",
                variants: [{
                    begin: "^#{1,6}",
                    end: "$",
                    contains: J
                }, {
                    begin: "(?=^.+?\\n[=-]{2,}$)",
                    contains: [{
                        begin: "^[=-]*$"
                    }, {
                        begin: "^",
                        end: "\\n",
                        contains: J
                    }]
                }]
            }, q, z, O, _, {
                className: "quote",
                begin: "^>\\s+",
                contains: J,
                end: "$"
            }, Y, K, $, w]
        }
    }
    Fo7.exports = ZC9
})
// @from(Ln 249824, Col 4)
Uo7 = R((VNw, go7) => {
    function fC9(A) {
        let q = {
                className: "subst",
                variants: [{
                    begin: "\\$[A-Za-z0-9_]+"
                }]
            },
            K = {
                className: "subst",
                variants: [{
                    begin: /\$\{/,
                    end: /\}/
                }],
                keywords: "true false null this is new super"
            },
            Y = {
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
                    contains: [A.BACKSLASH_ESCAPE, q, K]
                }, {
                    begin: '"""',
                    end: '"""',
                    contains: [A.BACKSLASH_ESCAPE, q, K]
                }, {
                    begin: "'",
                    end: "'",
                    illegal: "\\n",
                    contains: [A.BACKSLASH_ESCAPE, q, K]
                }, {
                    begin: '"',
                    end: '"',
                    illegal: "\\n",
                    contains: [A.BACKSLASH_ESCAPE, q, K]
                }]
            };
        K.contains = [A.C_NUMBER_MODE, Y];
        let z = ["Comparable", "DateTime", "Duration", "Function", "Iterable", "Iterator", "List", "Map", "Match", "Object", "Pattern", "RegExp", "Set", "Stopwatch", "String", "StringBuffer", "StringSink", "Symbol", "Type", "Uri", "bool", "double", "int", "num", "Element", "ElementList"],
            w = z.map(($) => `${$}?`);
        return {
            name: "Dart",
            keywords: {
                keyword: "abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory false final finally for Function get hide if implements import in inferface is late library mixin new null on operator part required rethrow return set show static super switch sync this throw true try typedef var void while with yield",
                built_in: z.concat(w).concat(["Never", "Null", "dynamic", "print", "document", "querySelector", "querySelectorAll", "window"]),
                $pattern: /[A-Za-z][A-Za-z0-9_]*\??/
            },
            contains: [Y, A.COMMENT(/\/\*\*(?!\/)/, /\*\//, {
                subLanguage: "markdown",
                relevance: 0
            }), A.COMMENT(/\/{3,} ?/, /$/, {
                contains: [{
                    subLanguage: "markdown",
                    begin: ".",
                    end: "$",
                    relevance: 0
                }]
            }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
                className: "class",
                beginKeywords: "class interface",
                end: /\{/,
                excludeEnd: !0,
                contains: [{
                    beginKeywords: "extends implements"
                }, A.UNDERSCORE_TITLE_MODE]
            }, A.C_NUMBER_MODE, {
                className: "meta",
                begin: "@[A-Za-z]+"
            }, {
                begin: "=>"
            }]
        }
    }
    go7.exports = fC9
})
// @from(Ln 249914, Col 4)
do7 = R((NNw, po7) => {
    function VC9(A) {
        let q = "exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure absolute reintroduce operator as is abstract alias assembler bitpacked break continue cppdecl cvar enumerator experimental platform deprecated unimplemented dynamic export far16 forward generic helper implements interrupt iochecks local name nodefault noreturn nostackframe oldfpccall otherwise saveregisters softfloat specialize strict unaligned varargs ",
            K = [A.C_LINE_COMMENT_MODE, A.COMMENT(/\{/, /\}/, {
                relevance: 0
            }), A.COMMENT(/\(\*/, /\*\)/, {
                relevance: 10
            })],
            Y = {
                className: "meta",
                variants: [{
                    begin: /\{\$/,
                    end: /\}/
                }, {
                    begin: /\(\*\$/,
                    end: /\*\)/
                }]
            },
            z = {
                className: "string",
                begin: /'/,
                end: /'/,
                contains: [{
                    begin: /''/
                }]
            },
            w = {
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
            H = {
                className: "string",
                begin: /(#\d+)+/
            },
            $ = {
                begin: A.IDENT_RE + "\\s*=\\s*class\\s*\\(",
                returnBegin: !0,
                contains: [A.TITLE_MODE]
            },
            O = {
                className: "function",
                beginKeywords: "function constructor destructor procedure",
                end: /[:;]/,
                keywords: "function constructor|10 destructor|10 procedure|10",
                contains: [A.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: q,
                    contains: [z, H, Y].concat(K)
                }, Y].concat(K)
            };
        return {
            name: "Delphi",
            aliases: ["dpr", "dfm", "pas", "pascal", "freepascal", "lazarus", "lpr", "lfm"],
            case_insensitive: !0,
            keywords: q,
            illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
            contains: [z, H, A.NUMBER_MODE, w, $, O, Y].concat(K)
        }
    }
    po7.exports = VC9
})
// @from(Ln 249984, Col 4)
lo7 = R((TNw, co7) => {
    function NC9(A) {
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
    co7.exports = NC9
})
// @from(Ln 250042, Col 4)
no7 = R((vNw, io7) => {
    function TC9(A) {
        let q = {
            begin: /\|[A-Za-z]+:?/,
            keywords: {
                name: "truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone"
            },
            contains: [A.QUOTE_STRING_MODE, A.APOS_STRING_MODE]
        };
        return {
            name: "Django",
            aliases: ["jinja"],
            case_insensitive: !0,
            subLanguage: "xml",
            contains: [A.COMMENT(/\{%\s*comment\s*%\}/, /\{%\s*endcomment\s*%\}/), A.COMMENT(/\{#/, /#\}/), {
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
                        contains: [q],
                        relevance: 0
                    }
                }]
            }, {
                className: "template-variable",
                begin: /\{\{/,
                end: /\}\}/,
                contains: [q]
            }]
        }
    }
    io7.exports = TC9
})
// @from(Ln 250083, Col 4)
oo7 = R((ENw, ro7) => {
    function vC9(A) {
        return {
            name: "DNS Zone",
            aliases: ["bind", "zone"],
            keywords: {
                keyword: "IN A AAAA AFSDB APL CAA CDNSKEY CDS CERT CNAME DHCID DLV DNAME DNSKEY DS HIP IPSECKEY KEY KX LOC MX NAPTR NS NSEC NSEC3 NSEC3PARAM PTR RRSIG RP SIG SOA SRV SSHFP TA TKEY TLSA TSIG TXT"
            },
            contains: [A.COMMENT(";", "$", {
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
            }, A.inherit(A.NUMBER_MODE, {
                begin: /\b\d+[dhwm]?/
            })]
        }
    }
    ro7.exports = vC9
})
// @from(Ln 250109, Col 4)
so7 = R((kNw, ao7) => {
    function EC9(A) {
        return {
            name: "Dockerfile",
            aliases: ["docker"],
            case_insensitive: !0,
            keywords: "from maintainer expose env arg user onbuild stopsignal",
            contains: [A.HASH_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.NUMBER_MODE, {
                beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
                starts: {
                    end: /[^\\]$/,
                    subLanguage: "bash"
                }
            }],
            illegal: "</"
        }
    }
    ao7.exports = EC9
})
// @from(Ln 250128, Col 4)
eo7 = R((LNw, to7) => {
    function kC9(A) {
        let q = A.COMMENT(/^\s*@?rem\b/, /$/, {
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
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                }), q]
            }, {
                className: "number",
                begin: "\\b\\d+",
                relevance: 0
            }, q]
        }
    }
    to7.exports = kC9
})
// @from(Ln 250165, Col 4)
qa7 = R((RNw, Aa7) => {
    function LC9(A) {
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
            }, A.HASH_COMMENT_MODE]
        }
    }
    Aa7.exports = LC9
})
// @from(Ln 250210, Col 4)
Ya7 = R((yNw, Ka7) => {
    function RC9(A) {
        let q = {
                className: "string",
                variants: [A.inherit(A.QUOTE_STRING_MODE, {
                    begin: '((u8?|U)|L)?"'
                }), {
                    begin: '(u8?|U)?R"',
                    end: '"',
                    contains: [A.BACKSLASH_ESCAPE]
                }, {
                    begin: "'\\\\?.",
                    end: "'",
                    illegal: "."
                }]
            },
            K = {
                className: "number",
                variants: [{
                    begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"
                }, {
                    begin: A.C_NUMBER_RE
                }],
                relevance: 0
            },
            Y = {
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
                    contains: [A.inherit(q, {
                        className: "meta-string"
                    }), {
                        className: "meta-string",
                        begin: "<",
                        end: ">",
                        illegal: "\\n"
                    }]
                }, q, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            },
            z = {
                className: "variable",
                begin: /&[a-z\d_]*\b/
            },
            w = {
                className: "meta-keyword",
                begin: "/[a-z][a-z\\d-]*/"
            },
            H = {
                className: "symbol",
                begin: "^\\s*[a-zA-Z_][a-zA-Z\\d_]*:"
            },
            $ = {
                className: "params",
                begin: "<",
                end: ">",
                contains: [K, z]
            },
            O = {
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
                contains: [z, w, H, O, $, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, K, q]
            }, z, w, H, O, $, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, K, q, Y, {
                begin: A.IDENT_RE + "::",
                keywords: ""
            }]
        }
    }
    Ka7.exports = RC9
})
// @from(Ln 250303, Col 4)
wa7 = R((CNw, za7) => {
    function yC9(A) {
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
                        contains: [A.QUOTE_STRING_MODE]
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
    za7.exports = yC9
})
// @from(Ln 250335, Col 4)
$a7 = R((SNw, Ha7) => {
    function CC9(A) {
        let q = A.COMMENT(/\(\*/, /\*\)/),
            K = {
                className: "attribute",
                begin: /^[ ]*[a-zA-Z]+([\s_-]+[a-zA-Z]+)*/
            },
            z = {
                begin: /=/,
                end: /[.;]/,
                contains: [q, {
                    className: "meta",
                    begin: /\?.*\?/
                }, {
                    className: "string",
                    variants: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, {
                        begin: "`",
                        end: "`"
                    }]
                }]
            };
        return {
            name: "Extended Backus-Naur Form",
            illegal: /\S/,
            contains: [q, K, z]
        }
    }
    Ha7.exports = CC9
})
// @from(Ln 250364, Col 4)
_a7 = R((hNw, Oa7) => {
    function SC9(A) {
        let Y = {
                $pattern: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
                keyword: "and false then defined module in return redo retry end for true self when next until do begin unless nil break not case cond alias while ensure or include use alias fn quote require import with|0"
            },
            z = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: Y
            },
            w = {
                className: "number",
                begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[1-9][0-9_]*(\\.[0-9_]+([eE][-+]?[0-9]+)?)?)",
                relevance: 0
            },
            H = `[/|([{<"']`,
            $ = {
                className: "string",
                begin: `~[a-z](?=[/|([{<"'])`,
                contains: [{
                    endsParent: !0,
                    contains: [{
                        contains: [A.BACKSLASH_ESCAPE, z],
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
            O = {
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
            _ = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE, z],
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
            J = {
                className: "function",
                beginKeywords: "def defp defmacro",
                end: /\B\b/,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
                    endsParent: !0
                })]
            },
            X = A.inherit(J, {
                className: "class",
                beginKeywords: "defimpl defmodule defprotocol defrecord",
                end: /\bdo\b|$|;/
            }),
            D = [_, O, $, A.HASH_COMMENT_MODE, X, J, {
                begin: "::"
            }, {
                className: "symbol",
                begin: ":(?![\\s:])",
                contains: [_, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?"
                }],
                relevance: 0
            }, {
                className: "symbol",
                begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?:(?!:)",
                relevance: 0
            }, w, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|@@?)(\\w+))"
            }, {
                begin: "->"
            }, {
                begin: "(" + A.RE_STARTERS_RE + ")\\s*",
                contains: [A.HASH_COMMENT_MODE, {
                    begin: /\/: (?=\d+\s*[,\]])/,
                    relevance: 0,
                    contains: [w]
                }, {
                    className: "regexp",
                    illegal: "\\n",
                    contains: [A.BACKSLASH_ESCAPE, z],
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
        return z.contains = D, {
            name: "Elixir",
            keywords: Y,
            contains: D
        }
    }
    Oa7.exports = SC9
})
// @from(Ln 250539, Col 4)
Xa7 = R((INw, Ja7) => {
    function hC9(A) {
        let q = {
                variants: [A.COMMENT("--", "$"), A.COMMENT(/\{-/, /-\}/, {
                    contains: ["self"]
                })]
            },
            K = {
                className: "type",
                begin: "\\b[A-Z][\\w']*",
                relevance: 0
            },
            Y = {
                begin: "\\(",
                end: "\\)",
                illegal: '"',
                contains: [{
                    className: "type",
                    begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"
                }, q]
            },
            z = {
                begin: /\{/,
                end: /\}/,
                contains: Y.contains
            },
            w = {
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
                contains: [Y, q],
                illegal: "\\W\\.|;"
            }, {
                begin: "import",
                end: "$",
                keywords: "import as exposing",
                contains: [Y, q],
                illegal: "\\W\\.|;"
            }, {
                begin: "type",
                end: "$",
                keywords: "type alias",
                contains: [K, Y, z, q]
            }, {
                beginKeywords: "infix infixl infixr",
                end: "$",
                contains: [A.C_NUMBER_MODE, q]
            }, {
                begin: "port",
                end: "$",
                keywords: "port",
                contains: [q]
            }, w, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, K, A.inherit(A.TITLE_MODE, {
                begin: "^[_a-z][\\w']*"
            }), q, {
                begin: "->|<-"
            }],
            illegal: /;/
        }
    }
    Ja7.exports = hC9
})
// @from(Ln 250610, Col 4)
Ma7 = R((xNw, ja7) => {
    function IC9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function xC9(A) {
        return Da7("(?=", A, ")")
    }

    function Da7(...A) {
        return A.map((K) => IC9(K)).join("")
    }

    function bC9(A) {
        let K = {
                keyword: "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",
                built_in: "proc lambda",
                literal: "true false nil"
            },
            Y = {
                className: "doctag",
                begin: "@[A-Za-z]+"
            },
            z = {
                begin: "#<",
                end: ">"
            },
            w = [A.COMMENT("#", "$", {
                contains: [Y]
            }), A.COMMENT("^=begin", "^=end", {
                contains: [Y],
                relevance: 10
            }), A.COMMENT("^__END__", "\\n$")],
            H = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: K
            },
            $ = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE, H],
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
                    begin: /%[qQwWx]?\(/,
                    end: /\)/
                }, {
                    begin: /%[qQwWx]?\[/,
                    end: /\]/
                }, {
                    begin: /%[qQwWx]?\{/,
                    end: /\}/
                }, {
                    begin: /%[qQwWx]?</,
                    end: />/
                }, {
                    begin: /%[qQwWx]?\//,
                    end: /\//
                }, {
                    begin: /%[qQwWx]?%/,
                    end: /%/
                }, {
                    begin: /%[qQwWx]?-/,
                    end: /-/
                }, {
                    begin: /%[qQwWx]?\|/,
                    end: /\|/
                }, {
                    begin: /\B\?(\\\d{1,3})/
                }, {
                    begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
                }, {
                    begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/
                }, {
                    begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
                }, {
                    begin: /\B\?\\(c|C-)[\x20-\x7e]/
                }, {
                    begin: /\B\?\\?\S/
                }, {
                    begin: /<<[-~]?'?(\w+)\n(?:[^\n]*\n)*?\s*\1\b/,
                    returnBegin: !0,
                    contains: [{
                        begin: /<<[-~]?'?/
                    }, A.END_SAME_AS_BEGIN({
                        begin: /(\w+)/,
                        end: /(\w+)/,
                        contains: [A.BACKSLASH_ESCAPE, H]
                    })]
                }]
            },
            O = "[1-9](_?[0-9])*|0",
            _ = "[0-9](_?[0-9])*",
            J = {
                className: "number",
                relevance: 0,
                variants: [{
                    begin: "\\b([1-9](_?[0-9])*|0)(\\.([0-9](_?[0-9])*))?([eE][+-]?([0-9](_?[0-9])*)|r)?i?\\b"
                }, {
                    begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
                }, {
                    begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
                }, {
                    begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b"
                }, {
                    begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
                }, {
                    begin: "\\b0(_?[0-7])+r?i?\\b"
                }]
            },
            X = {
                className: "params",
                begin: "\\(",
                end: "\\)",
                endsParent: !0,
                keywords: K
            },
            D = [$, {
                className: "class",
                beginKeywords: "class module",
                end: "$|;",
                illegal: /=/,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
                }), {
                    begin: "<\\s*",
                    contains: [{
                        begin: "(" + A.IDENT_RE + "::)?" + A.IDENT_RE,
                        relevance: 0
                    }]
                }].concat(w)
            }, {
                className: "function",
                begin: Da7(/def\s+/, xC9("([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)\\s*(\\(|;|$)")),
                relevance: 0,
                keywords: "def",
                end: "$|;",
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)"
                }), X].concat(w)
            }, {
                begin: A.IDENT_RE + "::"
            }, {
                className: "symbol",
                begin: A.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
                relevance: 0
            }, {
                className: "symbol",
                begin: ":(?!\\s)",
                contains: [$, {
                    begin: "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)"
                }],
                relevance: 0
            }, J, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
            }, {
                className: "params",
                begin: /\|/,
                end: /\|/,
                relevance: 0,
                keywords: K
            }, {
                begin: "(" + A.RE_STARTERS_RE + "|unless)\\s*",
                keywords: "unless",
                contains: [{
                    className: "regexp",
                    contains: [A.BACKSLASH_ESCAPE, H],
                    illegal: /\n/,
                    variants: [{
                        begin: "/",
                        end: "/[a-z]*"
                    }, {
                        begin: /%r\{/,
                        end: /\}[a-z]*/
                    }, {
                        begin: "%r\\(",
                        end: "\\)[a-z]*"
                    }, {
                        begin: "%r!",
                        end: "![a-z]*"
                    }, {
                        begin: "%r\\[",
                        end: "\\][a-z]*"
                    }]
                }].concat(z, w),
                relevance: 0
            }].concat(z, w);
        H.contains = D, X.contains = D;
        let j = "[>?]>",
            M = "[\\w#]+\\(\\w+\\):\\d+:\\d+>",
            P = "(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>",
            W = [{
                begin: /^\s*=>/,
                starts: {
                    end: "$",
                    contains: D
                }
            }, {
                className: "meta",
                begin: "^(" + j + "|" + M + "|" + P + ")(?=[ ])",
                starts: {
                    end: "$",
                    contains: D
                }
            }];
        return w.unshift(z), {
            name: "Ruby",
            aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
            keywords: K,
            illegal: /\/\*/,
            contains: [A.SHEBANG({
                binary: "ruby"
            })].concat(W).concat(w).concat(D)
        }
    }
    ja7.exports = bC9
})
// @from(Ln 250838, Col 4)
Wa7 = R((bNw, Pa7) => {
    function uC9(A) {
        return {
            name: "ERB",
            subLanguage: "xml",
            contains: [A.COMMENT("<%#", "%>"), {
                begin: "<%[%=-]?",
                end: "[%-]?%>",
                subLanguage: "ruby",
                excludeBegin: !0,
                excludeEnd: !0
            }]
        }
    }
    Pa7.exports = uC9
})
// @from(Ln 250854, Col 4)
Za7 = R((uNw, Ga7) => {
    function BC9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function mC9(...A) {
        return A.map((K) => BC9(K)).join("")
    }

    function FC9(A) {
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
            }, A.COMMENT("%", "$"), {
                className: "number",
                begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
                relevance: 0
            }, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, {
                begin: mC9(/\?(::)?/, /([A-Z]\w*)/, /((::)[A-Z]\w*)*/)
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
    Ga7.exports = FC9
})