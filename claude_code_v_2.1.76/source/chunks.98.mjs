
// @from(Ln 255509, Col 4)
Y$4 = x((W4w, K$4) => {
    function yd9(A) {
        let K = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
            Y = "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
            z = {
                $pattern: K,
                "builtin-name": "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
            },
            _ = "[-+]?\\d+(\\.\\d+)?",
            w = {
                begin: K,
                relevance: 0
            },
            O = {
                className: "number",
                begin: "[-+]?\\d+(\\.\\d+)?",
                relevance: 0
            },
            $ = A.inherit(A.QUOTE_STRING_MODE, {
                illegal: null
            }),
            H = A.COMMENT(";", "$", {
                relevance: 0
            }),
            j = {
                className: "literal",
                begin: /\b(true|false|nil)\b/
            },
            J = {
                begin: "[\\[\\{]",
                end: "[\\]\\}]"
            },
            M = {
                className: "comment",
                begin: "\\^" + K
            },
            D = A.COMMENT("\\^\\{", "\\}"),
            X = {
                className: "symbol",
                begin: "[:]{1,2}" + K
            },
            P = {
                begin: "\\(",
                end: "\\)"
            },
            W = {
                endsWithParent: !0,
                relevance: 0
            },
            Z = {
                keywords: z,
                className: "name",
                begin: K,
                relevance: 0,
                starts: W
            },
            G = [P, $, M, D, H, X, J, O, j, w],
            f = {
                beginKeywords: "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
                lexemes: K,
                end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
                contains: [{
                    className: "title",
                    begin: K,
                    relevance: 0,
                    excludeEnd: !0,
                    endsParent: !0
                }].concat(G)
            };
        return P.contains = [A.COMMENT("comment", ""), f, Z, W], W.contains = G, J.contains = G, D.contains = [J], {
            name: "Clojure",
            aliases: ["clj"],
            illegal: /\S/,
            contains: [P, $, M, D, H, X, J, O, j]
        }
    }
    K$4.exports = yd9
})
// @from(Ln 255587, Col 4)
_$4 = x((Z4w, z$4) => {
    function Ld9(A) {
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
    z$4.exports = Ld9
})
// @from(Ln 255603, Col 4)
O$4 = x((G4w, w$4) => {
    function Rd9(A) {
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
            }, A.HASH_COMMENT_MODE, A.QUOTE_STRING_MODE, A.NUMBER_MODE]
        }
    }
    w$4.exports = Rd9
})
// @from(Ln 255621, Col 4)
H$4 = x((f4w, $$4) => {
    var hd9 = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
        Sd9 = ["true", "false", "null", "undefined", "NaN", "Infinity"],
        Cd9 = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
        Id9 = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
        bd9 = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
        xd9 = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
        ud9 = [].concat(bd9, xd9, Cd9, Id9);

    function md9(A) {
        let q = ["npm", "print"],
            K = ["yes", "no", "on", "off"],
            Y = ["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"],
            z = ["var", "const", "let", "function", "static"],
            _ = (D) => (X) => !D.includes(X),
            w = {
                keyword: hd9.concat(Y).filter(_(z)),
                literal: Sd9.concat(K),
                built_in: ud9.concat(q)
            },
            O = "[A-Za-z$_][0-9A-Za-z$_]*",
            $ = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: w
            },
            H = [A.BINARY_NUMBER_MODE, A.inherit(A.C_NUMBER_MODE, {
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
                    contains: [A.BACKSLASH_ESCAPE, $]
                }, {
                    begin: /"/,
                    end: /"/,
                    contains: [A.BACKSLASH_ESCAPE, $]
                }]
            }, {
                className: "regexp",
                variants: [{
                    begin: "///",
                    end: "///",
                    contains: [$, A.HASH_COMMENT_MODE]
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
        $.contains = H;
        let j = A.inherit(A.TITLE_MODE, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*"
            }),
            J = "(\\(.*\\)\\s*)?\\B[-=]>",
            M = {
                className: "params",
                begin: "\\([^\\(]",
                returnBegin: !0,
                contains: [{
                    begin: /\(/,
                    end: /\)/,
                    keywords: w,
                    contains: ["self"].concat(H)
                }]
            };
        return {
            name: "CoffeeScript",
            aliases: ["coffee", "cson", "iced"],
            keywords: w,
            illegal: /\/\*/,
            contains: H.concat([A.COMMENT("###", "###"), A.HASH_COMMENT_MODE, {
                className: "function",
                begin: "^\\s*[A-Za-z$_][0-9A-Za-z$_]*\\s*=\\s*" + J,
                end: "[-=]>",
                returnBegin: !0,
                contains: [j, M]
            }, {
                begin: /[:\(,=]\s*/,
                relevance: 0,
                contains: [{
                    className: "function",
                    begin: J,
                    end: "[-=]>",
                    returnBegin: !0,
                    contains: [M]
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
                    contains: [j]
                }, j]
            }, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*:",
                end: ":",
                returnBegin: !0,
                returnEnd: !0,
                relevance: 0
            }])
        }
    }
    $$4.exports = md9
})
// @from(Ln 255757, Col 4)
J$4 = x((T4w, j$4) => {
    function Bd9(A) {
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
    j$4.exports = Bd9
})
// @from(Ln 255777, Col 4)
D$4 = x((v4w, M$4) => {
    function gd9(A) {
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
    M$4.exports = gd9
})
// @from(Ln 255839, Col 4)
P$4 = x((N4w, X$4) => {
    function Fd9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function pd9(A) {
        return bE8("(?=", A, ")")
    }

    function bW1(A) {
        return bE8("(", A, ")?")
    }

    function bE8(...A) {
        return A.map((K) => Fd9(K)).join("")
    }

    function Qd9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            _ = "(decltype\\(auto\\)|" + bW1("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + bW1("<[^<>]+>") + ")",
            w = {
                className: "keyword",
                begin: "\\b[a-z\\d_]*_t\\b"
            },
            O = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
            $ = {
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
            H = {
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
            j = {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, A.inherit($, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/
                }, q, A.C_BLOCK_COMMENT_MODE]
            },
            J = {
                className: "title",
                begin: bW1("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            M = bW1("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
            X = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "_Bool _Complex _Imaginary",
                _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
                literal: "true false nullptr NULL"
            },
            P = {
                className: "function.dispatch",
                relevance: 0,
                keywords: X,
                begin: bE8(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, pd9(/\s*\(/))
            },
            W = [P, j, w, q, A.C_BLOCK_COMMENT_MODE, H, $],
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
                keywords: X,
                contains: W.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: X,
                    contains: W.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            G = {
                className: "function",
                begin: "(" + _ + "[\\*&\\s]+)+" + M,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: X,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: X,
                    relevance: 0
                }, {
                    begin: M,
                    returnBegin: !0,
                    contains: [J],
                    relevance: 0
                }, {
                    begin: /::/,
                    relevance: 0
                }, {
                    begin: /:/,
                    endsWithParent: !0,
                    contains: [$, H]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: X,
                    relevance: 0,
                    contains: [q, A.C_BLOCK_COMMENT_MODE, $, H, w, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: X,
                        relevance: 0,
                        contains: ["self", q, A.C_BLOCK_COMMENT_MODE, $, H, w]
                    }]
                }, w, q, A.C_BLOCK_COMMENT_MODE, j]
            };
        return {
            name: "C++",
            aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
            keywords: X,
            illegal: "</",
            classNameAliases: {
                "function.dispatch": "built_in"
            },
            contains: [].concat(Z, G, P, W, [j, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: X,
                contains: ["self", w]
            }, {
                begin: A.IDENT_RE + "::",
                keywords: X
            }, {
                className: "class",
                beginKeywords: "enum class struct union",
                end: /[{;:<>=]/,
                contains: [{
                    beginKeywords: "final class struct"
                }, A.TITLE_MODE]
            }]),
            exports: {
                preprocessor: j,
                strings: $,
                keywords: X
            }
        }
    }
    X$4.exports = Qd9
})
// @from(Ln 256029, Col 4)
Z$4 = x((V4w, W$4) => {
    function Ud9(A) {
        let K = "group clone ms master location colocation order fencing_topology rsc_ticket acl_target acl_group user role tag xml",
            Y = "property rsc_defaults op_defaults",
            z = "params meta operations op rule attributes utilization",
            _ = "read write deny defined not_defined in_range date spec in ref reference attribute type xpath version and or lt gt tag lte gte eq ne \\",
            w = "number string",
            O = "Master Started Slave Stopped start promote demote stop monitor true false";
        return {
            name: "crmsh",
            aliases: ["crm", "pcmk"],
            case_insensitive: !0,
            keywords: {
                keyword: "params meta operations op rule attributes utilization " + _ + " number string",
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
    W$4.exports = Ud9
})
// @from(Ln 256102, Col 4)
f$4 = x((k4w, G$4) => {
    function dd9(A) {
        let w = {
                $pattern: "[a-zA-Z_]\\w*[!?=]?",
                keyword: "abstract alias annotation as as? asm begin break case class def do else elsif end ensure enum extend for fun if include instance_sizeof is_a? lib macro module next nil? of out pointerof private protected rescue responds_to? return require select self sizeof struct super then type typeof union uninitialized unless until verbatim when while with yield __DIR__ __END_LINE__ __FILE__ __LINE__",
                literal: "false nil true"
            },
            O = {
                className: "subst",
                begin: /#\{/,
                end: /\}/,
                keywords: w
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
                keywords: w
            };

        function H(W, Z) {
            let G = [{
                begin: W,
                end: Z
            }];
            return G[0].contains = G, G
        }
        let j = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE, O],
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
                    contains: H("\\(", "\\)")
                }, {
                    begin: "%[Qwi]?\\[",
                    end: "\\]",
                    contains: H("\\[", "\\]")
                }, {
                    begin: "%[Qwi]?\\{",
                    end: /\}/,
                    contains: H(/\{/, /\}/)
                }, {
                    begin: "%[Qwi]?<",
                    end: ">",
                    contains: H("<", ">")
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
                    contains: H("\\(", "\\)")
                }, {
                    begin: "%q\\[",
                    end: "\\]",
                    contains: H("\\[", "\\]")
                }, {
                    begin: "%q\\{",
                    end: /\}/,
                    contains: H(/\{/, /\}/)
                }, {
                    begin: "%q<",
                    end: ">",
                    contains: H("<", ">")
                }, {
                    begin: "%q\\|",
                    end: "\\|"
                }, {
                    begin: /<<-'\w+'$/,
                    end: /^\s*\w+$/
                }],
                relevance: 0
            },
            M = {
                begin: "(?!%\\})(" + A.RE_STARTERS_RE + "|\\n|\\b(case|if|select|unless|until|when|while)\\b)\\s*",
                keywords: "case if select unless until when while",
                contains: [{
                    className: "regexp",
                    contains: [A.BACKSLASH_ESCAPE, O],
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
            D = {
                className: "regexp",
                contains: [A.BACKSLASH_ESCAPE, O],
                variants: [{
                    begin: "%r\\(",
                    end: "\\)",
                    contains: H("\\(", "\\)")
                }, {
                    begin: "%r\\[",
                    end: "\\]",
                    contains: H("\\[", "\\]")
                }, {
                    begin: "%r\\{",
                    end: /\}/,
                    contains: H(/\{/, /\}/)
                }, {
                    begin: "%r<",
                    end: ">",
                    contains: H("<", ">")
                }, {
                    begin: "%r\\|",
                    end: "\\|"
                }],
                relevance: 0
            },
            X = {
                className: "meta",
                begin: "@\\[",
                end: "\\]",
                contains: [A.inherit(A.QUOTE_STRING_MODE, {
                    className: "meta-string"
                })]
            },
            P = [$, j, J, D, M, X, A.HASH_COMMENT_MODE, {
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
                contains: [j, {
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
        return O.contains = P, $.contains = P.slice(1), {
            name: "Crystal",
            aliases: ["cr"],
            keywords: w,
            contains: P
        }
    }
    G$4.exports = dd9
})
// @from(Ln 256325, Col 4)
v$4 = x((E4w, T$4) => {
    function cd9(A) {
        let q = ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
            K = ["public", "private", "protected", "static", "internal", "protected", "abstract", "async", "extern", "override", "unsafe", "virtual", "new", "sealed", "partial"],
            Y = ["default", "false", "null", "true"],
            z = ["abstract", "as", "base", "break", "case", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"],
            _ = ["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"],
            w = {
                keyword: z.concat(_),
                built_in: q,
                literal: Y
            },
            O = A.inherit(A.TITLE_MODE, {
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
            H = {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [{
                    begin: '""'
                }]
            },
            j = A.inherit(H, {
                illegal: /\n/
            }),
            J = {
                className: "subst",
                begin: /\{/,
                end: /\}/,
                keywords: w
            },
            M = A.inherit(J, {
                illegal: /\n/
            }),
            D = {
                className: "string",
                begin: /\$"/,
                end: '"',
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, A.BACKSLASH_ESCAPE, M]
            },
            X = {
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
            P = A.inherit(X, {
                illegal: /\n/,
                contains: [{
                    begin: /\{\{/
                }, {
                    begin: /\}\}/
                }, {
                    begin: '""'
                }, M]
            });
        J.contains = [X, D, H, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, $, A.C_BLOCK_COMMENT_MODE], M.contains = [P, D, j, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, $, A.inherit(A.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/
        })];
        let W = {
                variants: [X, D, H, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
            },
            Z = {
                begin: "<",
                end: ">",
                contains: [{
                    beginKeywords: "in out"
                }, O]
            },
            G = A.IDENT_RE + "(<" + A.IDENT_RE + "(\\s*,\\s*" + A.IDENT_RE + ")*>)?(\\[\\])?",
            f = {
                begin: "@" + A.IDENT_RE,
                relevance: 0
            };
        return {
            name: "C#",
            aliases: ["cs", "c#"],
            keywords: w,
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
            }, W, $, {
                beginKeywords: "class interface",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:,]/,
                contains: [{
                    beginKeywords: "where class"
                }, O, Z, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "namespace",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [O, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "record",
                relevance: 0,
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [O, Z, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
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
                begin: "(" + G + "\\s+)+" + A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                returnBegin: !0,
                end: /\s*[{;=]/,
                excludeEnd: !0,
                keywords: w,
                contains: [{
                    beginKeywords: K.join(" "),
                    relevance: 0
                }, {
                    begin: A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
                    returnBegin: !0,
                    contains: [A.TITLE_MODE, Z],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: w,
                    relevance: 0,
                    contains: [W, $, A.C_BLOCK_COMMENT_MODE]
                }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, f]
        }
    }
    T$4.exports = cd9
})
// @from(Ln 256512, Col 4)
V$4 = x((y4w, N$4) => {
    function ld9(A) {
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
    N$4.exports = ld9
})
// @from(Ln 256535, Col 4)
E$4 = x((L4w, k$4) => {
    var id9 = (A) => {
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
        nd9 = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
        rd9 = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
        od9 = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
        ad9 = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
        sd9 = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "auto", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "clip-path", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-variation-settings", "font-weight", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inherit", "initial", "justify-content", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "mask", "max-height", "max-width", "min-height", "min-width", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "right", "src", "tab-size", "table-layout", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index"].reverse();

    function td9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function ed9(A) {
        return Ac9("(?=", A, ")")
    }

    function Ac9(...A) {
        return A.map((K) => td9(K)).join("")
    }

    function qc9(A) {
        let q = id9(A),
            K = {
                className: "built_in",
                begin: /[\w-]+(?=\()/
            },
            Y = {
                begin: /-(webkit|moz|ms|o)-(?=[a-z])/
            },
            z = "and or not only",
            _ = /@-?\w[\w]*(-\w+)*/,
            w = "[a-zA-Z-][a-zA-Z0-9_-]*",
            O = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE];
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
                    begin: ":(" + od9.join("|") + ")"
                }, {
                    begin: "::(" + ad9.join("|") + ")"
                }]
            }, {
                className: "attribute",
                begin: "\\b(" + sd9.join("|") + ")\\b"
            }, {
                begin: ":",
                end: "[;}]",
                contains: [q.HEXCOLOR, q.IMPORTANT, A.CSS_NUMBER_MODE, ...O, {
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
                begin: ed9(/@/),
                end: "[{;]",
                relevance: 0,
                illegal: /:/,
                contains: [{
                    className: "keyword",
                    begin: _
                }, {
                    begin: /\s/,
                    endsWithParent: !0,
                    excludeEnd: !0,
                    relevance: 0,
                    keywords: {
                        $pattern: /[a-z-]+/,
                        keyword: "and or not only",
                        attribute: rd9.join(" ")
                    },
                    contains: [{
                        begin: /[a-z-]+(?=:)/,
                        className: "attribute"
                    }, ...O, A.CSS_NUMBER_MODE]
                }]
            }, {
                className: "selector-tag",
                begin: "\\b(" + nd9.join("|") + ")\\b"
            }]
        }
    }
    k$4.exports = qc9
})
// @from(Ln 256664, Col 4)
L$4 = x((R4w, y$4) => {
    function Kc9(A) {
        let q = {
                $pattern: A.UNDERSCORE_IDENT_RE,
                keyword: "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
                built_in: "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
                literal: "false null true"
            },
            K = "(0|[1-9][\\d_]*)",
            Y = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
            z = "0[bB][01_]+",
            _ = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            w = "0[xX]([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
            O = "([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            $ = "((0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)(\\.\\d*|" + O + ")|\\d+\\.(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)|\\.(0|[1-9][\\d_]*)" + O + "?)",
            H = "(0[xX](([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)\\.([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)|\\.?([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))[pP][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
            j = "((0|[1-9][\\d_]*)|0[bB][01_]+|" + w + ")",
            J = "(" + H + "|" + $ + ")",
            M = `\\\\(['"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};`,
            D = {
                className: "number",
                begin: "\\b" + j + "(L|u|U|Lu|LU|uL|UL)?",
                relevance: 0
            },
            X = {
                className: "number",
                begin: "\\b(" + J + "([fF]|L|i|[fF]i|Li)?|" + j + "(i|[fF]i|Li))",
                relevance: 0
            },
            P = {
                className: "string",
                begin: "'(" + M + "|.)",
                end: "'",
                illegal: "."
            },
            Z = {
                className: "string",
                begin: '"',
                contains: [{
                    begin: M,
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
            N = {
                className: "string",
                begin: 'q"\\{',
                end: '\\}"'
            },
            V = {
                className: "meta",
                begin: "^#!",
                end: "$",
                relevance: 5
            },
            L = {
                className: "meta",
                begin: "#(line)",
                end: "$",
                relevance: 5
            },
            h = {
                className: "keyword",
                begin: "@[a-zA-Z_][a-zA-Z_\\d]*"
            },
            R = A.COMMENT("\\/\\+", "\\+\\/", {
                contains: ["self"],
                relevance: 10
            });
        return {
            name: "D",
            keywords: q,
            contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, R, v, Z, G, f, N, X, D, P, V, L, h]
        }
    }
    y$4.exports = Kc9
})
// @from(Ln 256757, Col 4)
h$4 = x((h4w, R$4) => {
    function Yc9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function zc9(...A) {
        return A.map((K) => Yc9(K)).join("")
    }

    function _c9(A) {
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
            _ = {
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
            O = {
                variants: [{
                    begin: /\[.+?\]\[.*?\]/,
                    relevance: 0
                }, {
                    begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
                    relevance: 2
                }, {
                    begin: zc9(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
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
            $ = {
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
            H = {
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
        $.contains.push(H), H.contains.push($);
        let j = [q, O];
        return $.contains = $.contains.concat(j), H.contains = H.contains.concat(j), j = j.concat($, H), {
            name: "Markdown",
            aliases: ["md", "mkdown", "mkd"],
            contains: [{
                className: "section",
                variants: [{
                    begin: "^#{1,6}",
                    end: "$",
                    contains: j
                }, {
                    begin: "(?=^.+?\\n[=-]{2,}$)",
                    contains: [{
                        begin: "^[=-]*$"
                    }, {
                        begin: "^",
                        end: "\\n",
                        contains: j
                    }]
                }]
            }, q, z, $, H, {
                className: "quote",
                begin: "^>\\s+",
                contains: j,
                end: "$"
            }, Y, K, O, _]
        }
    }
    R$4.exports = _c9
})
// @from(Ln 256919, Col 4)
C$4 = x((S4w, S$4) => {
    function wc9(A) {
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
            _ = z.map((O) => `${O}?`);
        return {
            name: "Dart",
            keywords: {
                keyword: "abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory false final finally for Function get hide if implements import in inferface is late library mixin new null on operator part required rethrow return set show static super switch sync this throw true try typedef var void while with yield",
                built_in: z.concat(_).concat(["Never", "Null", "dynamic", "print", "document", "querySelector", "querySelectorAll", "window"]),
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
    S$4.exports = wc9
})
// @from(Ln 257009, Col 4)
b$4 = x((C4w, I$4) => {
    function Oc9(A) {
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
            _ = {
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
            w = {
                className: "string",
                begin: /(#\d+)+/
            },
            O = {
                begin: A.IDENT_RE + "\\s*=\\s*class\\s*\\(",
                returnBegin: !0,
                contains: [A.TITLE_MODE]
            },
            $ = {
                className: "function",
                beginKeywords: "function constructor destructor procedure",
                end: /[:;]/,
                keywords: "function constructor|10 destructor|10 procedure|10",
                contains: [A.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: q,
                    contains: [z, w, Y].concat(K)
                }, Y].concat(K)
            };
        return {
            name: "Delphi",
            aliases: ["dpr", "dfm", "pas", "pascal", "freepascal", "lazarus", "lpr", "lfm"],
            case_insensitive: !0,
            keywords: q,
            illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
            contains: [z, w, A.NUMBER_MODE, _, O, $, Y].concat(K)
        }
    }
    I$4.exports = Oc9
})
// @from(Ln 257079, Col 4)
u$4 = x((I4w, x$4) => {
    function $c9(A) {
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
    x$4.exports = $c9
})
// @from(Ln 257137, Col 4)
B$4 = x((b4w, m$4) => {
    function Hc9(A) {
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
    m$4.exports = Hc9
})
// @from(Ln 257178, Col 4)
F$4 = x((x4w, g$4) => {
    function jc9(A) {
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
    g$4.exports = jc9
})
// @from(Ln 257204, Col 4)
Q$4 = x((u4w, p$4) => {
    function Jc9(A) {
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
    p$4.exports = Jc9
})
// @from(Ln 257223, Col 4)
d$4 = x((m4w, U$4) => {
    function Mc9(A) {
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
    U$4.exports = Mc9
})
// @from(Ln 257260, Col 4)
l$4 = x((B4w, c$4) => {
    function Dc9(A) {
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
    c$4.exports = Dc9
})
// @from(Ln 257305, Col 4)
n$4 = x((g4w, i$4) => {
    function Xc9(A) {
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
            _ = {
                className: "meta-keyword",
                begin: "/[a-z][a-z\\d-]*/"
            },
            w = {
                className: "symbol",
                begin: "^\\s*[a-zA-Z_][a-zA-Z\\d_]*:"
            },
            O = {
                className: "params",
                begin: "<",
                end: ">",
                contains: [K, z]
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
                contains: [z, _, w, $, O, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, K, q]
            }, z, _, w, $, O, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, K, q, Y, {
                begin: A.IDENT_RE + "::",
                keywords: ""
            }]
        }
    }
    i$4.exports = Xc9
})
// @from(Ln 257398, Col 4)
o$4 = x((F4w, r$4) => {
    function Pc9(A) {
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
    r$4.exports = Pc9
})
// @from(Ln 257430, Col 4)
s$4 = x((p4w, a$4) => {
    function Wc9(A) {
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
    a$4.exports = Wc9
})
// @from(Ln 257459, Col 4)
e$4 = x((Q4w, t$4) => {
    function Zc9(A) {
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
            _ = {
                className: "number",
                begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[1-9][0-9_]*(\\.[0-9_]+([eE][-+]?[0-9]+)?)?)",
                relevance: 0
            },
            w = `[/|([{<"']`,
            O = {
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
            H = {
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
            j = {
                className: "function",
                beginKeywords: "def defp defmacro",
                end: /\B\b/,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
                    endsParent: !0
                })]
            },
            J = A.inherit(j, {
                className: "class",
                beginKeywords: "defimpl defmodule defprotocol defrecord",
                end: /\bdo\b|$|;/
            }),
            M = [H, $, O, A.HASH_COMMENT_MODE, J, j, {
                begin: "::"
            }, {
                className: "symbol",
                begin: ":(?![\\s:])",
                contains: [H, {
                    begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?"
                }],
                relevance: 0
            }, {
                className: "symbol",
                begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?:(?!:)",
                relevance: 0
            }, _, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|@@?)(\\w+))"
            }, {
                begin: "->"
            }, {
                begin: "(" + A.RE_STARTERS_RE + ")\\s*",
                contains: [A.HASH_COMMENT_MODE, {
                    begin: /\/: (?=\d+\s*[,\]])/,
                    relevance: 0,
                    contains: [_]
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
        return z.contains = M, {
            name: "Elixir",
            keywords: Y,
            contains: M
        }
    }
    t$4.exports = Zc9
})
// @from(Ln 257634, Col 4)
qH4 = x((U4w, AH4) => {
    function Gc9(A) {
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
            _ = {
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
            }, _, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, K, A.inherit(A.TITLE_MODE, {
                begin: "^[_a-z][\\w']*"
            }), q, {
                begin: "->|<-"
            }],
            illegal: /;/
        }
    }
    AH4.exports = Gc9
})