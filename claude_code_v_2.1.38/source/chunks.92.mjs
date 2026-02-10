
// @from(Ln 246561, Col 4)
Vr7 = R((FVw, fr7) => {
    function Zr7(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function Wr7(...A) {
        return A.map((K) => Zr7(K)).join("")
    }

    function Gr7(...A) {
        return "(" + A.map((K) => Zr7(K)).join("|") + ")"
    }

    function Yy9(A) {
        let q = A.inherit(A.QUOTE_STRING_MODE, {
                illegal: null
            }),
            K = {
                className: "params",
                begin: /\(/,
                end: /\)/,
                contains: ["self", A.C_NUMBER_MODE, q]
            },
            Y = A.COMMENT(/--/, /$/),
            z = A.COMMENT(/\(\*/, /\*\)/, {
                contains: ["self", Y]
            }),
            w = [Y, z, A.HASH_COMMENT_MODE],
            H = [/apart from/, /aside from/, /instead of/, /out of/, /greater than/, /isn't|(doesn't|does not) (equal|come before|come after|contain)/, /(greater|less) than( or equal)?/, /(starts?|ends|begins?) with/, /contained by/, /comes (before|after)/, /a (ref|reference)/, /POSIX (file|path)/, /(date|time) string/, /quoted form/],
            $ = [/clipboard info/, /the clipboard/, /info for/, /list (disks|folder)/, /mount volume/, /path to/, /(close|open for) access/, /(get|set) eof/, /current date/, /do shell script/, /get volume settings/, /random number/, /set volume/, /system attribute/, /system info/, /time to GMT/, /(load|run|store) script/, /scripting components/, /ASCII (character|number)/, /localized string/, /choose (application|color|file|file name|folder|from list|remote application|URL)/, /display (alert|dialog)/];
        return {
            name: "AppleScript",
            aliases: ["osascript"],
            keywords: {
                keyword: "about above after against and around as at back before beginning behind below beneath beside between but by considering contain contains continue copy div does eighth else end equal equals error every exit fifth first for fourth from front get given global if ignoring in into is it its last local me middle mod my ninth not of on onto or over prop property put ref reference repeat returning script second set seventh since sixth some tell tenth that the|0 then third through thru timeout times to transaction try until where while whose with without",
                literal: "AppleScript false linefeed return pi quote result space tab true",
                built_in: "alias application boolean class constant date file integer list number real record string text activate beep count delay launch log offset read round run say summarize write character characters contents day frontmost id item length month name paragraph paragraphs rest reverse running time version weekday word words year"
            },
            contains: [q, A.C_NUMBER_MODE, {
                className: "built_in",
                begin: Wr7(/\b/, Gr7(...$), /\b/)
            }, {
                className: "built_in",
                begin: /^\s*return\b/
            }, {
                className: "literal",
                begin: /\b(text item delimiters|current application|missing value)\b/
            }, {
                className: "keyword",
                begin: Wr7(/\b/, Gr7(...H), /\b/)
            }, {
                beginKeywords: "on",
                illegal: /[${=;\n]/,
                contains: [A.UNDERSCORE_TITLE_MODE, K]
            }, ...w],
            illegal: /\/\/|->|=>|\[\[/
        }
    }
    fr7.exports = Yy9
})
// @from(Ln 246623, Col 4)
Tr7 = R((QVw, Nr7) => {
    function zy9(A) {
        let K = {
                keyword: "if for while var new function do return void else break",
                literal: "BackSlash DoubleQuote false ForwardSlash Infinity NaN NewLine null PI SingleQuote Tab TextFormatting true undefined",
                built_in: "Abs Acos Angle Attachments Area AreaGeodetic Asin Atan Atan2 Average Bearing Boolean Buffer BufferGeodetic Ceil Centroid Clip Console Constrain Contains Cos Count Crosses Cut Date DateAdd DateDiff Day Decode DefaultValue Dictionary Difference Disjoint Distance DistanceGeodetic Distinct DomainCode DomainName Equals Exp Extent Feature FeatureSet FeatureSetByAssociation FeatureSetById FeatureSetByPortalItem FeatureSetByRelationshipName FeatureSetByTitle FeatureSetByUrl Filter First Floor Geometry GroupBy Guid HasKey Hour IIf IndexOf Intersection Intersects IsEmpty IsNan IsSelfIntersecting Length LengthGeodetic Log Max Mean Millisecond Min Minute Month MultiPartToSinglePart Multipoint NextSequenceValue Now Number OrderBy Overlaps Point Polygon Polyline Portal Pow Random Relate Reverse RingIsClockWise Round Second SetGeometry Sin Sort Sqrt Stdev Sum SymmetricDifference Tan Text Timestamp Today ToLocal Top Touches ToUTC TrackCurrentTime TrackGeometryWindow TrackIndex TrackStartTime TrackWindow TypeOf Union UrlEncode Variance Weekday When Within Year "
            },
            Y = {
                className: "symbol",
                begin: "\\$[datastore|feature|layer|map|measure|sourcefeature|sourcelayer|targetfeature|targetlayer|value|view]+"
            },
            z = {
                className: "number",
                variants: [{
                    begin: "\\b(0[bB][01]+)"
                }, {
                    begin: "\\b(0[oO][0-7]+)"
                }, {
                    begin: A.C_NUMBER_RE
                }],
                relevance: 0
            },
            w = {
                className: "subst",
                begin: "\\$\\{",
                end: "\\}",
                keywords: K,
                contains: []
            },
            H = {
                className: "string",
                begin: "`",
                end: "`",
                contains: [A.BACKSLASH_ESCAPE, w]
            };
        w.contains = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, H, z, A.REGEXP_MODE];
        let $ = w.contains.concat([A.C_BLOCK_COMMENT_MODE, A.C_LINE_COMMENT_MODE]);
        return {
            name: "ArcGIS Arcade",
            keywords: K,
            contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, H, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, Y, z, {
                begin: /[{,]\s*/,
                relevance: 0,
                contains: [{
                    begin: "[A-Za-z_][0-9A-Za-z_]*\\s*:",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [{
                        className: "attr",
                        begin: "[A-Za-z_][0-9A-Za-z_]*",
                        relevance: 0
                    }]
                }]
            }, {
                begin: "(" + A.RE_STARTERS_RE + "|\\b(return)\\b)\\s*",
                keywords: "return",
                contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.REGEXP_MODE, {
                    className: "function",
                    begin: "(\\(.*?\\)|[A-Za-z_][0-9A-Za-z_]*)\\s*=>",
                    returnBegin: !0,
                    end: "\\s*=>",
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: "[A-Za-z_][0-9A-Za-z_]*"
                        }, {
                            begin: /\(\s*\)/
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: K,
                            contains: $
                        }]
                    }]
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "function",
                end: /\{/,
                excludeEnd: !0,
                contains: [A.inherit(A.TITLE_MODE, {
                    begin: "[A-Za-z_][0-9A-Za-z_]*"
                }), {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    contains: $
                }],
                illegal: /\[|%/
            }, {
                begin: /\$[(.]/
            }],
            illegal: /#(?!!)/
        }
    }
    Nr7.exports = zy9
})
// @from(Ln 246725, Col 4)
Er7 = R((gVw, vr7) => {
    function wy9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function Hy9(A) {
        return XPA("(?=", A, ")")
    }

    function TJ6(A) {
        return XPA("(", A, ")?")
    }

    function XPA(...A) {
        return A.map((K) => wy9(K)).join("")
    }

    function $y9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            w = "(decltype\\(auto\\)|" + TJ6("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + TJ6("<[^<>]+>") + ")",
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
                begin: TJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            D = TJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
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
                begin: XPA(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, Hy9(/\s*\(/))
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

    function Oy9(A) {
        let q = {
                keyword: "boolean byte word String",
                built_in: "KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD ",
                _: "setup loop runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put",
                literal: "DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW"
            },
            K = $y9(A),
            Y = K.keywords;
        return Y.keyword += " " + q.keyword, Y.literal += " " + q.literal, Y.built_in += " " + q.built_in, Y._ += " " + q._, K.name = "Arduino", K.aliases = ["ino"], K.supersetOf = "cpp", K
    }
    vr7.exports = Oy9
})
// @from(Ln 246927, Col 4)
Lr7 = R((UVw, kr7) => {
    function _y9(A) {
        let q = {
            variants: [A.COMMENT("^[ \\t]*(?=#)", "$", {
                relevance: 0,
                excludeBegin: !0
            }), A.COMMENT("[;@]", "$", {
                relevance: 0
            }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
        };
        return {
            name: "ARM Assembly",
            case_insensitive: !0,
            aliases: ["arm"],
            keywords: {
                $pattern: "\\.?" + A.IDENT_RE,
                meta: ".2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ",
                built_in: "r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 pc lr sp ip sl sb fp a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf s0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 s16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 d0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 {PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @"
            },
            contains: [{
                className: "keyword",
                begin: "\\b(adc|(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|wfe|wfi|yield)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?[sptrx]?(?=\\s)"
            }, q, A.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "[^\\\\]'",
                relevance: 0
            }, {
                className: "title",
                begin: "\\|",
                end: "\\|",
                illegal: "\\n",
                relevance: 0
            }, {
                className: "number",
                variants: [{
                    begin: "[#$=]?0x[0-9a-f]+"
                }, {
                    begin: "[#$=]?0b[01]+"
                }, {
                    begin: "[#$=]\\d+"
                }, {
                    begin: "\\b\\d+"
                }],
                relevance: 0
            }, {
                className: "symbol",
                variants: [{
                    begin: "^[ \\t]*[a-z_\\.\\$][a-z0-9_\\.\\$]+:"
                }, {
                    begin: "^[a-z_\\.\\$][a-z0-9_\\.\\$]+"
                }, {
                    begin: "[=#]\\w+"
                }],
                relevance: 0
            }]
        }
    }
    kr7.exports = _y9
})
// @from(Ln 246987, Col 4)
Sr7 = R((pVw, Cr7) => {
    function yr7(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function Rr7(A) {
        return BK1("(?=", A, ")")
    }

    function Jy9(A) {
        return BK1("(", A, ")?")
    }

    function BK1(...A) {
        return A.map((K) => yr7(K)).join("")
    }

    function Xy9(...A) {
        return "(" + A.map((K) => yr7(K)).join("|") + ")"
    }

    function Dy9(A) {
        let q = BK1(/[A-Z_]/, Jy9(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
            K = /[A-Za-z0-9._:-]+/,
            Y = {
                className: "symbol",
                begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
            },
            z = {
                begin: /\s/,
                contains: [{
                    className: "meta-keyword",
                    begin: /#?[a-z_][a-z1-9_-]+/,
                    illegal: /\n/
                }]
            },
            w = A.inherit(z, {
                begin: /\(/,
                end: /\)/
            }),
            H = A.inherit(A.APOS_STRING_MODE, {
                className: "meta-string"
            }),
            $ = A.inherit(A.QUOTE_STRING_MODE, {
                className: "meta-string"
            }),
            O = {
                endsWithParent: !0,
                illegal: /</,
                relevance: 0,
                contains: [{
                    className: "attr",
                    begin: K,
                    relevance: 0
                }, {
                    begin: /=\s*/,
                    relevance: 0,
                    contains: [{
                        className: "string",
                        endsParent: !0,
                        variants: [{
                            begin: /"/,
                            end: /"/,
                            contains: [Y]
                        }, {
                            begin: /'/,
                            end: /'/,
                            contains: [Y]
                        }, {
                            begin: /[^\s"'=<>`]+/
                        }]
                    }]
                }]
            };
        return {
            name: "HTML, XML",
            aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
            case_insensitive: !0,
            contains: [{
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                relevance: 10,
                contains: [z, $, H, w, {
                    begin: /\[/,
                    end: /\]/,
                    contains: [{
                        className: "meta",
                        begin: /<![a-z]/,
                        end: />/,
                        contains: [z, w, $, H]
                    }]
                }]
            }, A.COMMENT(/<!--/, /-->/, {
                relevance: 10
            }), {
                begin: /<!\[CDATA\[/,
                end: /\]\]>/,
                relevance: 10
            }, Y, {
                className: "meta",
                begin: /<\?xml/,
                end: /\?>/,
                relevance: 10
            }, {
                className: "tag",
                begin: /<style(?=\s|>)/,
                end: />/,
                keywords: {
                    name: "style"
                },
                contains: [O],
                starts: {
                    end: /<\/style>/,
                    returnEnd: !0,
                    subLanguage: ["css", "xml"]
                }
            }, {
                className: "tag",
                begin: /<script(?=\s|>)/,
                end: />/,
                keywords: {
                    name: "script"
                },
                contains: [O],
                starts: {
                    end: /<\/script>/,
                    returnEnd: !0,
                    subLanguage: ["javascript", "handlebars", "xml"]
                }
            }, {
                className: "tag",
                begin: /<>|<\/>/
            }, {
                className: "tag",
                begin: BK1(/</, Rr7(BK1(q, Xy9(/\/>/, />/, /\s/)))),
                end: /\/?>/,
                contains: [{
                    className: "name",
                    begin: q,
                    relevance: 0,
                    starts: O
                }]
            }, {
                className: "tag",
                begin: BK1(/<\//, Rr7(BK1(q, />/))),
                contains: [{
                    className: "name",
                    begin: q,
                    relevance: 0
                }, {
                    begin: />/,
                    relevance: 0,
                    endsParent: !0
                }]
            }]
        }
    }
    Cr7.exports = Dy9
})
// @from(Ln 247149, Col 4)
xr7 = R((dVw, Ir7) => {
    function jy9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function hr7(...A) {
        return A.map((K) => jy9(K)).join("")
    }

    function My9(A) {
        let q = {
                begin: "^'{3,}[ \\t]*$",
                relevance: 10
            },
            K = [{
                begin: /\\[*_`]/
            }, {
                begin: /\\\\\*{2}[^\n]*?\*{2}/
            }, {
                begin: /\\\\_{2}[^\n]*_{2}/
            }, {
                begin: /\\\\`{2}[^\n]*`{2}/
            }, {
                begin: /[:;}][*_`](?![*_`])/
            }],
            Y = [{
                className: "strong",
                begin: /\*{2}([^\n]+?)\*{2}/
            }, {
                className: "strong",
                begin: hr7(/\*\*/, /((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/, /(\*(?!\*)|\\[^\n]|[^*\n\\])*/, /\*\*/),
                relevance: 0
            }, {
                className: "strong",
                begin: /\B\*(\S|\S[^\n]*?\S)\*(?!\w)/
            }, {
                className: "strong",
                begin: /\*[^\s]([^\n]+\n)+([^\n]+)\*/
            }],
            z = [{
                className: "emphasis",
                begin: /_{2}([^\n]+?)_{2}/
            }, {
                className: "emphasis",
                begin: hr7(/__/, /((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/, /(_(?!_)|\\[^\n]|[^_\n\\])*/, /__/),
                relevance: 0
            }, {
                className: "emphasis",
                begin: /\b_(\S|\S[^\n]*?\S)_(?!\w)/
            }, {
                className: "emphasis",
                begin: /_[^\s]([^\n]+\n)+([^\n]+)_/
            }, {
                className: "emphasis",
                begin: "\\B'(?!['\\s])",
                end: "(\\n{2}|')",
                contains: [{
                    begin: "\\\\'\\w",
                    relevance: 0
                }],
                relevance: 0
            }],
            w = {
                className: "symbol",
                begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
                relevance: 10
            },
            H = {
                className: "bullet",
                begin: "^(\\*+|-+|\\.+|[^\\n]+?::)\\s+"
            };
        return {
            name: "AsciiDoc",
            aliases: ["adoc"],
            contains: [A.COMMENT("^/{4,}\\n", "\\n/{4,}$", {
                relevance: 10
            }), A.COMMENT("^//", "$", {
                relevance: 0
            }), {
                className: "title",
                begin: "^\\.\\w.*$"
            }, {
                begin: "^[=\\*]{4,}\\n",
                end: "\\n^[=\\*]{4,}$",
                relevance: 10
            }, {
                className: "section",
                relevance: 10,
                variants: [{
                    begin: "^(={1,6})[ \t].+?([ \t]\\1)?$"
                }, {
                    begin: "^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$"
                }]
            }, {
                className: "meta",
                begin: "^:.+?:",
                end: "\\s",
                excludeEnd: !0,
                relevance: 10
            }, {
                className: "meta",
                begin: "^\\[.+?\\]$",
                relevance: 0
            }, {
                className: "quote",
                begin: "^_{4,}\\n",
                end: "\\n_{4,}$",
                relevance: 10
            }, {
                className: "code",
                begin: "^[\\-\\.]{4,}\\n",
                end: "\\n[\\-\\.]{4,}$",
                relevance: 10
            }, {
                begin: "^\\+{4,}\\n",
                end: "\\n\\+{4,}$",
                contains: [{
                    begin: "<",
                    end: ">",
                    subLanguage: "xml",
                    relevance: 0
                }],
                relevance: 10
            }, H, w, ...K, ...Y, ...z, {
                className: "string",
                variants: [{
                    begin: "``.+?''"
                }, {
                    begin: "`.+?'"
                }]
            }, {
                className: "code",
                begin: /`{2}/,
                end: /(\n{2}|`{2})/
            }, {
                className: "code",
                begin: "(`.+?`|\\+.+?\\+)",
                relevance: 0
            }, {
                className: "code",
                begin: "^[ \\t]",
                end: "$",
                relevance: 0
            }, q, {
                begin: "(link:)?(http|https|ftp|file|irc|image:?):\\S+?\\[[^[]*?\\]",
                returnBegin: !0,
                contains: [{
                    begin: "(link|image:?):",
                    relevance: 0
                }, {
                    className: "link",
                    begin: "\\w",
                    end: "[^\\[]+",
                    relevance: 0
                }, {
                    className: "string",
                    begin: "\\[",
                    end: "\\]",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    relevance: 0
                }],
                relevance: 10
            }]
        }
    }
    Ir7.exports = My9
})
// @from(Ln 247319, Col 4)
ur7 = R((cVw, br7) => {
    function Py9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function DPA(...A) {
        return A.map((K) => Py9(K)).join("")
    }

    function Wy9(A) {
        let q = "false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else extends implements break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws privileged aspectOf adviceexecution proceed cflowbelow cflow initialization preinitialization staticinitialization withincode target within execution getWithinTypeName handler thisJoinPoint thisJoinPointStaticPart thisEnclosingJoinPointStaticPart declare parents warning error soft precedence thisAspectInstance",
            K = "get set args call";
        return {
            name: "AspectJ",
            keywords: q,
            illegal: /<\/|#/,
            contains: [A.COMMENT(/\/\*\*/, /\*\//, {
                relevance: 0,
                contains: [{
                    begin: /\w+@/,
                    relevance: 0
                }, {
                    className: "doctag",
                    begin: /@[A-Za-z]+/
                }]
            }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, {
                className: "class",
                beginKeywords: "aspect",
                end: /[{;=]/,
                excludeEnd: !0,
                illegal: /[:;"\[\]]/,
                contains: [{
                    beginKeywords: "extends implements pertypewithin perthis pertarget percflowbelow percflow issingleton"
                }, A.UNDERSCORE_TITLE_MODE, {
                    begin: /\([^\)]*/,
                    end: /[)]+/,
                    keywords: q + " get set args call",
                    excludeEnd: !1
                }]
            }, {
                className: "class",
                beginKeywords: "class interface",
                end: /[{;=]/,
                excludeEnd: !0,
                relevance: 0,
                keywords: "class interface",
                illegal: /[:"\[\]]/,
                contains: [{
                    beginKeywords: "extends implements"
                }, A.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "pointcut after before around throwing returning",
                end: /[)]/,
                excludeEnd: !1,
                illegal: /["\[\]]/,
                contains: [{
                    begin: DPA(A.UNDERSCORE_IDENT_RE, /\s*\(/),
                    returnBegin: !0,
                    contains: [A.UNDERSCORE_TITLE_MODE]
                }]
            }, {
                begin: /[:]/,
                returnBegin: !0,
                end: /[{;]/,
                relevance: 0,
                excludeEnd: !1,
                keywords: q,
                illegal: /["\[\]]/,
                contains: [{
                    begin: DPA(A.UNDERSCORE_IDENT_RE, /\s*\(/),
                    keywords: q + " get set args call",
                    relevance: 0
                }, A.QUOTE_STRING_MODE]
            }, {
                beginKeywords: "new throw",
                relevance: 0
            }, {
                className: "function",
                begin: /\w+ +\w+(\.\w+)?\s*\([^\)]*\)\s*((throws)[\w\s,]+)?[\{;]/,
                returnBegin: !0,
                end: /[{;=]/,
                keywords: q,
                excludeEnd: !0,
                contains: [{
                    begin: DPA(A.UNDERSCORE_IDENT_RE, /\s*\(/),
                    returnBegin: !0,
                    relevance: 0,
                    contains: [A.UNDERSCORE_TITLE_MODE]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    relevance: 0,
                    keywords: q,
                    contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, A.C_BLOCK_COMMENT_MODE]
                }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
            }, A.C_NUMBER_MODE, {
                className: "meta",
                begin: /@[A-Za-z]+/
            }]
        }
    }
    br7.exports = Wy9
})
// @from(Ln 247425, Col 4)
mr7 = R((lVw, Br7) => {
    function Gy9(A) {
        let q = {
            begin: "`[\\s\\S]"
        };
        return {
            name: "AutoHotkey",
            case_insensitive: !0,
            aliases: ["ahk"],
            keywords: {
                keyword: "Break Continue Critical Exit ExitApp Gosub Goto New OnExit Pause return SetBatchLines SetTimer Suspend Thread Throw Until ahk_id ahk_class ahk_pid ahk_exe ahk_group",
                literal: "true false NOT AND OR",
                built_in: "ComSpec Clipboard ClipboardAll ErrorLevel"
            },
            contains: [q, A.inherit(A.QUOTE_STRING_MODE, {
                contains: [q]
            }), A.COMMENT(";", "$", {
                relevance: 0
            }), A.C_BLOCK_COMMENT_MODE, {
                className: "number",
                begin: A.NUMBER_RE,
                relevance: 0
            }, {
                className: "variable",
                begin: "%[a-zA-Z0-9#_$@]+%"
            }, {
                className: "built_in",
                begin: "^\\s*\\w+\\s*(,|%)"
            }, {
                className: "title",
                variants: [{
                    begin: '^[^\\n";]+::(?!=)'
                }, {
                    begin: '^[^\\n";]+:(?!=)',
                    relevance: 0
                }]
            }, {
                className: "meta",
                begin: "^\\s*#\\w+",
                end: "$",
                relevance: 0
            }, {
                className: "built_in",
                begin: "A_[a-zA-Z0-9]+"
            }, {
                begin: ",\\s*,"
            }]
        }
    }
    Br7.exports = Gy9
})
// @from(Ln 247476, Col 4)
Qr7 = R((iVw, Fr7) => {
    function Zy9(A) {
        let q = "ByRef Case Const ContinueCase ContinueLoop Dim Do Else ElseIf EndFunc EndIf EndSelect EndSwitch EndWith Enum Exit ExitLoop For Func Global If In Local Next ReDim Return Select Static Step Switch Then To Until Volatile WEnd While With",
            K = ["EndRegion", "forcedef", "forceref", "ignorefunc", "include", "include-once", "NoTrayIcon", "OnAutoItStartRegister", "pragma", "Region", "RequireAdmin", "Tidy_Off", "Tidy_On", "Tidy_Parameters"],
            Y = "True False And Null Not Or Default",
            z = "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
            w = {
                variants: [A.COMMENT(";", "$", {
                    relevance: 0
                }), A.COMMENT("#cs", "#ce"), A.COMMENT("#comments-start", "#comments-end")]
            },
            H = {
                begin: "\\$[A-z0-9_]+"
            },
            $ = {
                className: "string",
                variants: [{
                    begin: /"/,
                    end: /"/,
                    contains: [{
                        begin: /""/,
                        relevance: 0
                    }]
                }, {
                    begin: /'/,
                    end: /'/,
                    contains: [{
                        begin: /''/,
                        relevance: 0
                    }]
                }]
            },
            O = {
                variants: [A.BINARY_NUMBER_MODE, A.C_NUMBER_MODE]
            },
            _ = {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": K
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, {
                    beginKeywords: "include",
                    keywords: {
                        "meta-keyword": "include"
                    },
                    end: "$",
                    contains: [$, {
                        className: "meta-string",
                        variants: [{
                            begin: "<",
                            end: ">"
                        }, {
                            begin: /"/,
                            end: /"/,
                            contains: [{
                                begin: /""/,
                                relevance: 0
                            }]
                        }, {
                            begin: /'/,
                            end: /'/,
                            contains: [{
                                begin: /''/,
                                relevance: 0
                            }]
                        }]
                    }]
                }, $, w]
            },
            J = {
                className: "symbol",
                begin: "@[A-z0-9_]+"
            },
            X = {
                className: "function",
                beginKeywords: "Func",
                end: "$",
                illegal: "\\$|\\[|%",
                contains: [A.UNDERSCORE_TITLE_MODE, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    contains: [H, $, O]
                }]
            };
        return {
            name: "AutoIt",
            case_insensitive: !0,
            illegal: /\/\*/,
            keywords: {
                keyword: q,
                built_in: "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
                literal: "True False And Null Not Or Default"
            },
            contains: [w, H, $, O, _, J, X]
        }
    }
    Fr7.exports = Zy9
})
// @from(Ln 247580, Col 4)
Ur7 = R((nVw, gr7) => {
    function fy9(A) {
        return {
            name: "AVR Assembly",
            case_insensitive: !0,
            keywords: {
                $pattern: "\\.?" + A.IDENT_RE,
                keyword: "adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub subi swap tst wdr",
                built_in: "r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf",
                meta: ".byte .cseg .db .def .device .dseg .dw .endmacro .equ .eseg .exit .include .list .listmac .macro .nolist .org .set"
            },
            contains: [A.C_BLOCK_COMMENT_MODE, A.COMMENT(";", "$", {
                relevance: 0
            }), A.C_NUMBER_MODE, A.BINARY_NUMBER_MODE, {
                className: "number",
                begin: "\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)"
            }, A.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "[^\\\\]'",
                illegal: "[^\\\\][^']"
            }, {
                className: "symbol",
                begin: "^[A-Za-z0-9_.$]+:"
            }, {
                className: "meta",
                begin: "#",
                end: "$"
            }, {
                className: "subst",
                begin: "@[0-9]+"
            }]
        }
    }
    gr7.exports = fy9
})
// @from(Ln 247616, Col 4)
dr7 = R((rVw, pr7) => {
    function Vy9(A) {
        let q = {
                className: "variable",
                variants: [{
                    begin: /\$[\w\d#@][\w\d_]*/
                }, {
                    begin: /\$\{(.*?)\}/
                }]
            },
            K = "BEGIN END if else while do for in break continue delete next nextfile function func exit|10",
            Y = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE],
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
                }, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
            };
        return {
            name: "Awk",
            keywords: {
                keyword: "BEGIN END if else while do for in break continue delete next nextfile function func exit|10"
            },
            contains: [q, Y, A.REGEXP_MODE, A.HASH_COMMENT_MODE, A.NUMBER_MODE]
        }
    }
    pr7.exports = Vy9
})
// @from(Ln 247664, Col 4)
lr7 = R((oVw, cr7) => {
    function Ny9(A) {
        return {
            name: "X++",
            aliases: ["x++"],
            keywords: {
                keyword: ["abstract", "as", "asc", "avg", "break", "breakpoint", "by", "byref", "case", "catch", "changecompany", "class", "client", "client", "common", "const", "continue", "count", "crosscompany", "delegate", "delete_from", "desc", "display", "div", "do", "edit", "else", "eventhandler", "exists", "extends", "final", "finally", "firstfast", "firstonly", "firstonly1", "firstonly10", "firstonly100", "firstonly1000", "flush", "for", "forceliterals", "forcenestedloop", "forceplaceholders", "forceselectorder", "forupdate", "from", "generateonly", "group", "hint", "if", "implements", "in", "index", "insert_recordset", "interface", "internal", "is", "join", "like", "maxof", "minof", "mod", "namespace", "new", "next", "nofetch", "notexists", "optimisticlock", "order", "outer", "pessimisticlock", "print", "private", "protected", "public", "readonly", "repeatableread", "retry", "return", "reverse", "select", "server", "setting", "static", "sum", "super", "switch", "this", "throw", "try", "ttsabort", "ttsbegin", "ttscommit", "unchecked", "update_recordset", "using", "validtimestate", "void", "where", "while"],
                built_in: ["anytype", "boolean", "byte", "char", "container", "date", "double", "enum", "guid", "int", "int64", "long", "real", "short", "str", "utcdatetime", "var"],
                literal: ["default", "false", "null", "true"]
            },
            contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, {
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
                }, A.UNDERSCORE_TITLE_MODE]
            }]
        }
    }
    cr7.exports = Ny9
})
// @from(Ln 247692, Col 4)
nr7 = R((aVw, ir7) => {
    function Ty9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function vy9(...A) {
        return A.map((K) => Ty9(K)).join("")
    }

    function Ey9(A) {
        let q = {},
            K = {
                begin: /\$\{/,
                end: /\}/,
                contains: ["self", {
                    begin: /:-/,
                    contains: [q]
                }]
            };
        Object.assign(q, {
            className: "variable",
            variants: [{
                begin: vy9(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
            }, K]
        });
        let Y = {
                className: "subst",
                begin: /\$\(/,
                end: /\)/,
                contains: [A.BACKSLASH_ESCAPE]
            },
            z = {
                begin: /<<-?\s*(?=\w+)/,
                starts: {
                    contains: [A.END_SAME_AS_BEGIN({
                        begin: /(\w+)/,
                        end: /(\w+)/,
                        className: "string"
                    })]
                }
            },
            w = {
                className: "string",
                begin: /"/,
                end: /"/,
                contains: [A.BACKSLASH_ESCAPE, q, Y]
            };
        Y.contains.push(w);
        let H = {
                className: "",
                begin: /\\"/
            },
            $ = {
                className: "string",
                begin: /'/,
                end: /'/
            },
            O = {
                begin: /\$\(\(/,
                end: /\)\)/,
                contains: [{
                    begin: /\d+#[0-9a-f]+/,
                    className: "number"
                }, A.NUMBER_MODE, q]
            },
            _ = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
            J = A.SHEBANG({
                binary: `(${_.join("|")})`,
                relevance: 10
            }),
            X = {
                className: "function",
                begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                returnBegin: !0,
                contains: [A.inherit(A.TITLE_MODE, {
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
            contains: [J, A.SHEBANG(), X, O, A.HASH_COMMENT_MODE, z, w, H, $, q]
        }
    }
    ir7.exports = Ey9
})
// @from(Ln 247787, Col 4)
or7 = R((sVw, rr7) => {
    function ky9(A) {
        return {
            name: "BASIC",
            case_insensitive: !0,
            illegal: "^.",
            keywords: {
                $pattern: "[a-zA-Z][a-zA-Z0-9_$%!#]*",
                keyword: "ABS ASC AND ATN AUTO|0 BEEP BLOAD|10 BSAVE|10 CALL CALLS CDBL CHAIN CHDIR CHR$|10 CINT CIRCLE CLEAR CLOSE CLS COLOR COM COMMON CONT COS CSNG CSRLIN CVD CVI CVS DATA DATE$ DEFDBL DEFINT DEFSNG DEFSTR DEF|0 SEG USR DELETE DIM DRAW EDIT END ENVIRON ENVIRON$ EOF EQV ERASE ERDEV ERDEV$ ERL ERR ERROR EXP FIELD FILES FIX FOR|0 FRE GET GOSUB|10 GOTO HEX$ IF THEN ELSE|0 INKEY$ INP INPUT INPUT# INPUT$ INSTR IMP INT IOCTL IOCTL$ KEY ON OFF LIST KILL LEFT$ LEN LET LINE LLIST LOAD LOC LOCATE LOF LOG LPRINT USING LSET MERGE MID$ MKDIR MKD$ MKI$ MKS$ MOD NAME NEW NEXT NOISE NOT OCT$ ON OR PEN PLAY STRIG OPEN OPTION BASE OUT PAINT PALETTE PCOPY PEEK PMAP POINT POKE POS PRINT PRINT] PSET PRESET PUT RANDOMIZE READ REM RENUM RESET|0 RESTORE RESUME RETURN|0 RIGHT$ RMDIR RND RSET RUN SAVE SCREEN SGN SHELL SIN SOUND SPACE$ SPC SQR STEP STICK STOP STR$ STRING$ SWAP SYSTEM TAB TAN TIME$ TIMER TROFF TRON TO USR VAL VARPTR VARPTR$ VIEW WAIT WHILE WEND WIDTH WINDOW WRITE XOR"
            },
            contains: [A.QUOTE_STRING_MODE, A.COMMENT("REM", "$", {
                relevance: 10
            }), A.COMMENT("'", "$", {
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
    rr7.exports = ky9
})
// @from(Ln 247820, Col 4)
sr7 = R((tVw, ar7) => {
    function Ly9(A) {
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
                }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
            }]
        }
    }
    ar7.exports = Ly9
})
// @from(Ln 247840, Col 4)
er7 = R((eVw, tr7) => {
    function Ry9(A) {
        let q = {
            className: "literal",
            begin: /[+-]/,
            relevance: 0
        };
        return {
            name: "Brainfuck",
            aliases: ["bf"],
            contains: [A.COMMENT(`[^\\[\\]\\.,\\+\\-<> \r
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
                contains: [q]
            }, q]
        }
    }
    tr7.exports = Ry9
})
// @from(Ln 247871, Col 4)
qo7 = R((ANw, Ao7) => {
    function yy9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function Cy9(A) {
        return jPA("(?=", A, ")")
    }

    function vJ6(A) {
        return jPA("(", A, ")?")
    }

    function jPA(...A) {
        return A.map((K) => yy9(K)).join("")
    }

    function Sy9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            w = "(decltype\\(auto\\)|" + vJ6("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + vJ6("<[^<>]+>") + ")",
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
                begin: vJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            D = vJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
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
                begin: jPA(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, Cy9(/\s*\(/))
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

    function hy9(A) {
        let q = Sy9(A),
            K = ["c", "h"],
            Y = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
        if (q.disableAutodetect = !0, q.aliases = [], !A.getLanguage("c")) q.aliases.push(...K);
        if (!A.getLanguage("cpp")) q.aliases.push(...Y);
        return q
    }
    Ao7.exports = hy9
})
// @from(Ln 248070, Col 4)
Yo7 = R((qNw, Ko7) => {
    function Iy9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function EJ6(A) {
        return xy9("(", A, ")?")
    }

    function xy9(...A) {
        return A.map((K) => Iy9(K)).join("")
    }

    function by9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            w = "(decltype\\(auto\\)|" + EJ6("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + EJ6("<[^<>]+>") + ")",
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
                begin: EJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            D = EJ6("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
            j = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
                literal: "true false nullptr NULL"
            },
            M = [J, H, q, A.C_BLOCK_COMMENT_MODE, _, O],
            P = {
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
                keywords: j,
                contains: M.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: j,
                    contains: M.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            W = {
                className: "function",
                begin: "(" + w + "[\\*&\\s]+)+" + D,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: j,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: j,
                    relevance: 0
                }, {
                    begin: D,
                    returnBegin: !0,
                    contains: [X],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: j,
                    relevance: 0,
                    contains: [q, A.C_BLOCK_COMMENT_MODE, O, _, H, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: j,
                        relevance: 0,
                        contains: ["self", q, A.C_BLOCK_COMMENT_MODE, O, _, H]
                    }]
                }, H, q, A.C_BLOCK_COMMENT_MODE, J]
            };
        return {
            name: "C",
            aliases: ["h"],
            keywords: j,
            disableAutodetect: !0,
            illegal: "</",
            contains: [].concat(P, W, M, [J, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: j,
                contains: ["self", H]
            }, {
                begin: A.IDENT_RE + "::",
                keywords: j
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
                keywords: j
            }
        }
    }
    Ko7.exports = by9
})
// @from(Ln 248240, Col 4)
wo7 = R((KNw, zo7) => {
    function uy9(A) {
        let q = "div mod in and or not xor asserterror begin case do downto else end exit for if of repeat then to until while with var",
            K = "false true",
            Y = [A.C_LINE_COMMENT_MODE, A.COMMENT(/\{/, /\}/, {
                relevance: 0
            }), A.COMMENT(/\(\*/, /\*\)/, {
                relevance: 10
            })],
            z = {
                className: "string",
                begin: /'/,
                end: /'/,
                contains: [{
                    begin: /''/
                }]
            },
            w = {
                className: "string",
                begin: /(#\d+)+/
            },
            H = {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?(DT|D|T)",
                relevance: 0
            },
            $ = {
                className: "string",
                begin: '"',
                end: '"'
            },
            O = {
                className: "function",
                beginKeywords: "procedure",
                end: /[:;]/,
                keywords: "procedure|10",
                contains: [A.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: q,
                    contains: [z, w]
                }].concat(Y)
            },
            _ = {
                className: "class",
                begin: "OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)",
                returnBegin: !0,
                contains: [A.TITLE_MODE, O]
            };
        return {
            name: "C/AL",
            case_insensitive: !0,
            keywords: {
                keyword: q,
                literal: "false true"
            },
            illegal: /\/\*/,
            contains: [z, w, H, $, A.NUMBER_MODE, _, O]
        }
    }
    zo7.exports = uy9
})
// @from(Ln 248303, Col 4)
$o7 = R((YNw, Ho7) => {
    function By9(A) {
        return {
            name: "Cap’n Proto",
            aliases: ["capnp"],
            keywords: {
                keyword: "struct enum interface union group import using const annotation extends in of on as with from fixed",
                built_in: "Void Bool Int8 Int16 Int32 Int64 UInt8 UInt16 UInt32 UInt64 Float32 Float64 Text Data AnyPointer AnyStruct Capability List",
                literal: "true false"
            },
            contains: [A.QUOTE_STRING_MODE, A.NUMBER_MODE, A.HASH_COMMENT_MODE, {
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
                contains: [A.inherit(A.TITLE_MODE, {
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
                contains: [A.inherit(A.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0
                    }
                })]
            }]
        }
    }
    Ho7.exports = By9
})
// @from(Ln 248347, Col 4)
_o7 = R((zNw, Oo7) => {
    function my9(A) {
        let q = "assembly module package import alias class interface object given value assign void function new of extends satisfies abstracts in out return break continue throw assert dynamic if else switch case for while try catch finally then let this outer super is exists nonempty",
            K = "shared abstract formal default actual variable late native deprecated final sealed annotation suppressWarnings small",
            Y = "doc by license see throws tagged",
            z = {
                className: "subst",
                excludeBegin: !0,
                excludeEnd: !0,
                begin: /``/,
                end: /``/,
                keywords: q,
                relevance: 10
            },
            w = [{
                className: "string",
                begin: '"""',
                end: '"""',
                relevance: 10
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: [z]
            }, {
                className: "string",
                begin: "'",
                end: "'"
            }, {
                className: "number",
                begin: "#[0-9a-fA-F_]+|\\$[01_]+|[0-9_]+(?:\\.[0-9_](?:[eE][+-]?\\d+)?)?[kMGTPmunpf]?",
                relevance: 0
            }];
        return z.contains = w, {
            name: "Ceylon",
            keywords: {
                keyword: q + " " + K,
                meta: "doc by license see throws tagged"
            },
            illegal: "\\$[^01]|#[^0-9a-fA-F]",
            contains: [A.C_LINE_COMMENT_MODE, A.COMMENT("/\\*", "\\*/", {
                contains: ["self"]
            }), {
                className: "meta",
                begin: '@[a-z]\\w*(?::"[^"]*")?'
            }].concat(w)
        }
    }
    Oo7.exports = my9
})
// @from(Ln 248397, Col 4)
Xo7 = R((wNw, Jo7) => {
    function Fy9(A) {
        return {
            name: "Clean",
            aliases: ["icl", "dcl"],
            keywords: {
                keyword: "if let in with where case of class instance otherwise implementation definition system module from import qualified as special code inline foreign export ccall stdcall generic derive infix infixl infixr",
                built_in: "Int Real Char Bool",
                literal: "True False"
            },
            contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, {
                begin: "->|<-[|:]?|#!?|>>=|\\{\\||\\|\\}|:==|=:|<>"
            }]
        }
    }
    Jo7.exports = Fy9
})
// @from(Ln 248414, Col 4)
jo7 = R((HNw, Do7) => {
    function Qy9(A) {
        let K = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
            Y = "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
            z = {
                $pattern: K,
                "builtin-name": "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
            },
            w = "[-+]?\\d+(\\.\\d+)?",
            H = {
                begin: K,
                relevance: 0
            },
            $ = {
                className: "number",
                begin: "[-+]?\\d+(\\.\\d+)?",
                relevance: 0
            },
            O = A.inherit(A.QUOTE_STRING_MODE, {
                illegal: null
            }),
            _ = A.COMMENT(";", "$", {
                relevance: 0
            }),
            J = {
                className: "literal",
                begin: /\b(true|false|nil)\b/
            },
            X = {
                begin: "[\\[\\{]",
                end: "[\\]\\}]"
            },
            D = {
                className: "comment",
                begin: "\\^" + K
            },
            j = A.COMMENT("\\^\\{", "\\}"),
            M = {
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
            G = {
                keywords: z,
                className: "name",
                begin: K,
                relevance: 0,
                starts: W
            },
            f = [P, O, D, j, _, M, X, $, J, H],
            Z = {
                beginKeywords: "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
                lexemes: K,
                end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
                contains: [{
                    className: "title",
                    begin: K,
                    relevance: 0,
                    excludeEnd: !0,
                    endsParent: !0
                }].concat(f)
            };
        return P.contains = [A.COMMENT("comment", ""), Z, G, W], W.contains = f, X.contains = f, j.contains = [X], {
            name: "Clojure",
            aliases: ["clj"],
            illegal: /\S/,
            contains: [P, O, D, j, _, M, X, $, J]
        }
    }
    Do7.exports = Qy9
})
// @from(Ln 248492, Col 4)
Po7 = R(($Nw, Mo7) => {
    function gy9(A) {
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
    Mo7.exports = gy9
})
// @from(Ln 248508, Col 4)
Go7 = R((ONw, Wo7) => {
    function Uy9(A) {
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
    Wo7.exports = Uy9
})