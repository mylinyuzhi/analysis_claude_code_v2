
// @from(Ln 253519, Col 4)
YO4 = x((i7w, KO4) => {
    function UU9(A) {
        var q = {
                className: "built_in",
                begin: "\\b(void|bool|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|string|ref|array|double|float|auto|dictionary)"
            },
            K = {
                className: "symbol",
                begin: "[a-zA-Z0-9_]+@"
            },
            Y = {
                className: "keyword",
                begin: "<",
                end: ">",
                contains: [q, K]
            };
        return q.contains = [Y], K.contains = [Y], {
            name: "AngelScript",
            aliases: ["asc"],
            keywords: "for in|0 break continue while do|0 return if else case switch namespace is cast or and xor not get|0 in inout|10 out override set|0 private public const default|0 final shared external mixin|10 enum typedef funcdef this super import from interface abstract|0 try catch protected explicit property",
            illegal: "(^using\\s+[A-Za-z0-9_\\.]+;$|\\bfunction\\s*[^\\(])",
            contains: [{
                className: "string",
                begin: "'",
                end: "'",
                illegal: "\\n",
                contains: [A.BACKSLASH_ESCAPE],
                relevance: 0
            }, {
                className: "string",
                begin: '"""',
                end: '"""'
            }, {
                className: "string",
                begin: '"',
                end: '"',
                illegal: "\\n",
                contains: [A.BACKSLASH_ESCAPE],
                relevance: 0
            }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
                className: "string",
                begin: "^\\s*\\[",
                end: "\\]"
            }, {
                beginKeywords: "interface namespace",
                end: /\{/,
                illegal: "[;.\\-]",
                contains: [{
                    className: "symbol",
                    begin: "[a-zA-Z0-9_]+"
                }]
            }, {
                beginKeywords: "class",
                end: /\{/,
                illegal: "[;.\\-]",
                contains: [{
                    className: "symbol",
                    begin: "[a-zA-Z0-9_]+",
                    contains: [{
                        begin: "[:,]\\s*",
                        contains: [{
                            className: "symbol",
                            begin: "[a-zA-Z0-9_]+"
                        }]
                    }]
                }]
            }, q, K, {
                className: "literal",
                begin: "\\b(null|true|false)"
            }, {
                className: "number",
                relevance: 0,
                begin: "(-?)(\\b0[xXbBoOdD][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?f?|\\.\\d+f?)([eE][-+]?\\d+f?)?)"
            }]
        }
    }
    KO4.exports = UU9
})
// @from(Ln 253597, Col 4)
_O4 = x((n7w, zO4) => {
    function dU9(A) {
        let q = {
                className: "number",
                begin: /[$%]\d+/
            },
            K = {
                className: "number",
                begin: /\d+/
            },
            Y = {
                className: "number",
                begin: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/
            },
            z = {
                className: "number",
                begin: /:\d{1,5}/
            };
        return {
            name: "Apache config",
            aliases: ["apacheconf"],
            case_insensitive: !0,
            contains: [A.HASH_COMMENT_MODE, {
                className: "section",
                begin: /<\/?/,
                end: />/,
                contains: [Y, z, A.inherit(A.QUOTE_STRING_MODE, {
                    relevance: 0
                })]
            }, {
                className: "attribute",
                begin: /\w+/,
                relevance: 0,
                keywords: {
                    nomarkup: "order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"
                },
                starts: {
                    end: /$/,
                    relevance: 0,
                    keywords: {
                        literal: "on off all deny allow"
                    },
                    contains: [{
                        className: "meta",
                        begin: /\s\[/,
                        end: /\]$/
                    }, {
                        className: "variable",
                        begin: /[\$%]\{/,
                        end: /\}/,
                        contains: ["self", q]
                    }, Y, K, A.QUOTE_STRING_MODE]
                }
            }],
            illegal: /\S/
        }
    }
    zO4.exports = dU9
})
// @from(Ln 253656, Col 4)
jO4 = x((r7w, HO4) => {
    function $O4(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function wO4(...A) {
        return A.map((K) => $O4(K)).join("")
    }

    function OO4(...A) {
        return "(" + A.map((K) => $O4(K)).join("|") + ")"
    }

    function cU9(A) {
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
            _ = [Y, z, A.HASH_COMMENT_MODE],
            w = [/apart from/, /aside from/, /instead of/, /out of/, /greater than/, /isn't|(doesn't|does not) (equal|come before|come after|contain)/, /(greater|less) than( or equal)?/, /(starts?|ends|begins?) with/, /contained by/, /comes (before|after)/, /a (ref|reference)/, /POSIX (file|path)/, /(date|time) string/, /quoted form/],
            O = [/clipboard info/, /the clipboard/, /info for/, /list (disks|folder)/, /mount volume/, /path to/, /(close|open for) access/, /(get|set) eof/, /current date/, /do shell script/, /get volume settings/, /random number/, /set volume/, /system attribute/, /system info/, /time to GMT/, /(load|run|store) script/, /scripting components/, /ASCII (character|number)/, /localized string/, /choose (application|color|file|file name|folder|from list|remote application|URL)/, /display (alert|dialog)/];
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
                begin: wO4(/\b/, OO4(...O), /\b/)
            }, {
                className: "built_in",
                begin: /^\s*return\b/
            }, {
                className: "literal",
                begin: /\b(text item delimiters|current application|missing value)\b/
            }, {
                className: "keyword",
                begin: wO4(/\b/, OO4(...w), /\b/)
            }, {
                beginKeywords: "on",
                illegal: /[${=;\n]/,
                contains: [A.UNDERSCORE_TITLE_MODE, K]
            }, ..._],
            illegal: /\/\/|->|=>|\[\[/
        }
    }
    HO4.exports = cU9
})
// @from(Ln 253718, Col 4)
MO4 = x((o7w, JO4) => {
    function lU9(A) {
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
            _ = {
                className: "subst",
                begin: "\\$\\{",
                end: "\\}",
                keywords: K,
                contains: []
            },
            w = {
                className: "string",
                begin: "`",
                end: "`",
                contains: [A.BACKSLASH_ESCAPE, _]
            };
        _.contains = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, w, z, A.REGEXP_MODE];
        let O = _.contains.concat([A.C_BLOCK_COMMENT_MODE, A.C_LINE_COMMENT_MODE]);
        return {
            name: "ArcGIS Arcade",
            keywords: K,
            contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, w, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, Y, z, {
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
                            contains: O
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
                    contains: O
                }],
                illegal: /\[|%/
            }, {
                begin: /\$[(.]/
            }],
            illegal: /#(?!!)/
        }
    }
    JO4.exports = lU9
})
// @from(Ln 253820, Col 4)
XO4 = x((a7w, DO4) => {
    function iU9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function nU9(A) {
        return SE8("(?=", A, ")")
    }

    function SW1(A) {
        return SE8("(", A, ")?")
    }

    function SE8(...A) {
        return A.map((K) => iU9(K)).join("")
    }

    function rU9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            _ = "(decltype\\(auto\\)|" + SW1("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + SW1("<[^<>]+>") + ")",
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
                begin: SW1("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            M = SW1("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
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
                begin: SE8(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, nU9(/\s*\(/))
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

    function oU9(A) {
        let q = {
                keyword: "boolean byte word String",
                built_in: "KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD ",
                _: "setup loop runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put",
                literal: "DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW"
            },
            K = rU9(A),
            Y = K.keywords;
        return Y.keyword += " " + q.keyword, Y.literal += " " + q.literal, Y.built_in += " " + q.built_in, Y._ += " " + q._, K.name = "Arduino", K.aliases = ["ino"], K.supersetOf = "cpp", K
    }
    DO4.exports = oU9
})
// @from(Ln 254022, Col 4)
WO4 = x((s7w, PO4) => {
    function aU9(A) {
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
    PO4.exports = aU9
})
// @from(Ln 254082, Col 4)
TO4 = x((t7w, fO4) => {
    function GO4(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function ZO4(A) {
        return G96("(?=", A, ")")
    }

    function sU9(A) {
        return G96("(", A, ")?")
    }

    function G96(...A) {
        return A.map((K) => GO4(K)).join("")
    }

    function tU9(...A) {
        return "(" + A.map((K) => GO4(K)).join("|") + ")"
    }

    function eU9(A) {
        let q = G96(/[A-Z_]/, sU9(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
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
            _ = A.inherit(z, {
                begin: /\(/,
                end: /\)/
            }),
            w = A.inherit(A.APOS_STRING_MODE, {
                className: "meta-string"
            }),
            O = A.inherit(A.QUOTE_STRING_MODE, {
                className: "meta-string"
            }),
            $ = {
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
                contains: [z, O, w, _, {
                    begin: /\[/,
                    end: /\]/,
                    contains: [{
                        className: "meta",
                        begin: /<![a-z]/,
                        end: />/,
                        contains: [z, _, O, w]
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
                contains: [$],
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
                contains: [$],
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
                begin: G96(/</, ZO4(G96(q, tU9(/\/>/, />/, /\s/)))),
                end: /\/?>/,
                contains: [{
                    className: "name",
                    begin: q,
                    relevance: 0,
                    starts: $
                }]
            }, {
                className: "tag",
                begin: G96(/<\//, ZO4(G96(q, />/))),
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
    fO4.exports = eU9
})
// @from(Ln 254244, Col 4)
VO4 = x((e7w, NO4) => {
    function Ad9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function vO4(...A) {
        return A.map((K) => Ad9(K)).join("")
    }

    function qd9(A) {
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
                begin: vO4(/\*\*/, /((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/, /(\*(?!\*)|\\[^\n]|[^*\n\\])*/, /\*\*/),
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
                begin: vO4(/__/, /((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/, /(_(?!_)|\\[^\n]|[^_\n\\])*/, /__/),
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
            _ = {
                className: "symbol",
                begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
                relevance: 10
            },
            w = {
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
            }, w, _, ...K, ...Y, ...z, {
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
    NO4.exports = qd9
})
// @from(Ln 254414, Col 4)
EO4 = x((A4w, kO4) => {
    function Kd9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function CE8(...A) {
        return A.map((K) => Kd9(K)).join("")
    }

    function Yd9(A) {
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
                    begin: CE8(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
                    begin: CE8(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
                    begin: CE8(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
    kO4.exports = Yd9
})
// @from(Ln 254520, Col 4)
LO4 = x((q4w, yO4) => {
    function zd9(A) {
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
    yO4.exports = zd9
})
// @from(Ln 254571, Col 4)
hO4 = x((K4w, RO4) => {
    function _d9(A) {
        let q = "ByRef Case Const ContinueCase ContinueLoop Dim Do Else ElseIf EndFunc EndIf EndSelect EndSwitch EndWith Enum Exit ExitLoop For Func Global If In Local Next ReDim Return Select Static Step Switch Then To Until Volatile WEnd While With",
            K = ["EndRegion", "forcedef", "forceref", "ignorefunc", "include", "include-once", "NoTrayIcon", "OnAutoItStartRegister", "pragma", "Region", "RequireAdmin", "Tidy_Off", "Tidy_On", "Tidy_Parameters"],
            Y = "True False And Null Not Or Default",
            z = "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
            _ = {
                variants: [A.COMMENT(";", "$", {
                    relevance: 0
                }), A.COMMENT("#cs", "#ce"), A.COMMENT("#comments-start", "#comments-end")]
            },
            w = {
                begin: "\\$[A-z0-9_]+"
            },
            O = {
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
            $ = {
                variants: [A.BINARY_NUMBER_MODE, A.C_NUMBER_MODE]
            },
            H = {
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
                    contains: [O, {
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
                }, O, _]
            },
            j = {
                className: "symbol",
                begin: "@[A-z0-9_]+"
            },
            J = {
                className: "function",
                beginKeywords: "Func",
                end: "$",
                illegal: "\\$|\\[|%",
                contains: [A.UNDERSCORE_TITLE_MODE, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    contains: [w, O, $]
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
            contains: [_, w, O, $, H, j, J]
        }
    }
    RO4.exports = _d9
})
// @from(Ln 254675, Col 4)
CO4 = x((Y4w, SO4) => {
    function wd9(A) {
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
    SO4.exports = wd9
})
// @from(Ln 254711, Col 4)
bO4 = x((z4w, IO4) => {
    function Od9(A) {
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
    IO4.exports = Od9
})
// @from(Ln 254759, Col 4)
uO4 = x((_4w, xO4) => {
    function $d9(A) {
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
    xO4.exports = $d9
})
// @from(Ln 254787, Col 4)
BO4 = x((w4w, mO4) => {
    function Hd9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function jd9(...A) {
        return A.map((K) => Hd9(K)).join("")
    }

    function Jd9(A) {
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
                begin: jd9(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
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
            _ = {
                className: "string",
                begin: /"/,
                end: /"/,
                contains: [A.BACKSLASH_ESCAPE, q, Y]
            };
        Y.contains.push(_);
        let w = {
                className: "",
                begin: /\\"/
            },
            O = {
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
                }, A.NUMBER_MODE, q]
            },
            H = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
            j = A.SHEBANG({
                binary: `(${H.join("|")})`,
                relevance: 10
            }),
            J = {
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
            contains: [j, A.SHEBANG(), J, $, A.HASH_COMMENT_MODE, z, _, w, O, q]
        }
    }
    mO4.exports = Jd9
})
// @from(Ln 254882, Col 4)
FO4 = x((O4w, gO4) => {
    function Md9(A) {
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
    gO4.exports = Md9
})
// @from(Ln 254915, Col 4)
QO4 = x(($4w, pO4) => {
    function Dd9(A) {
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
    pO4.exports = Dd9
})
// @from(Ln 254935, Col 4)
dO4 = x((H4w, UO4) => {
    function Xd9(A) {
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
    UO4.exports = Xd9
})
// @from(Ln 254966, Col 4)
lO4 = x((j4w, cO4) => {
    function Pd9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function Wd9(A) {
        return IE8("(?=", A, ")")
    }

    function CW1(A) {
        return IE8("(", A, ")?")
    }

    function IE8(...A) {
        return A.map((K) => Pd9(K)).join("")
    }

    function Zd9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            _ = "(decltype\\(auto\\)|" + CW1("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + CW1("<[^<>]+>") + ")",
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
                begin: CW1("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            M = CW1("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
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
                begin: IE8(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, Wd9(/\s*\(/))
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

    function Gd9(A) {
        let q = Zd9(A),
            K = ["c", "h"],
            Y = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
        if (q.disableAutodetect = !0, q.aliases = [], !A.getLanguage("c")) q.aliases.push(...K);
        if (!A.getLanguage("cpp")) q.aliases.push(...Y);
        return q
    }
    cO4.exports = Gd9
})
// @from(Ln 255165, Col 4)
nO4 = x((J4w, iO4) => {
    function fd9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function IW1(A) {
        return Td9("(", A, ")?")
    }

    function Td9(...A) {
        return A.map((K) => fd9(K)).join("")
    }

    function vd9(A) {
        let q = A.COMMENT("//", "$", {
                contains: [{
                    begin: /\\\n/
                }]
            }),
            K = "decltype\\(auto\\)",
            Y = "[a-zA-Z_]\\w*::",
            z = "<[^<>]+>",
            _ = "(decltype\\(auto\\)|" + IW1("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + IW1("<[^<>]+>") + ")",
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
                begin: IW1("[a-zA-Z_]\\w*::") + A.IDENT_RE,
                relevance: 0
            },
            M = IW1("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
            D = {
                keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
                built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
                literal: "true false nullptr NULL"
            },
            X = [j, w, q, A.C_BLOCK_COMMENT_MODE, H, $],
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
                keywords: D,
                contains: X.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: D,
                    contains: X.concat(["self"]),
                    relevance: 0
                }]),
                relevance: 0
            },
            W = {
                className: "function",
                begin: "(" + _ + "[\\*&\\s]+)+" + M,
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: D,
                illegal: /[^\w\s\*&:<>.]/,
                contains: [{
                    begin: "decltype\\(auto\\)",
                    keywords: D,
                    relevance: 0
                }, {
                    begin: M,
                    returnBegin: !0,
                    contains: [J],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: D,
                    relevance: 0,
                    contains: [q, A.C_BLOCK_COMMENT_MODE, $, H, w, {
                        begin: /\(/,
                        end: /\)/,
                        keywords: D,
                        relevance: 0,
                        contains: ["self", q, A.C_BLOCK_COMMENT_MODE, $, H, w]
                    }]
                }, w, q, A.C_BLOCK_COMMENT_MODE, j]
            };
        return {
            name: "C",
            aliases: ["h"],
            keywords: D,
            disableAutodetect: !0,
            illegal: "</",
            contains: [].concat(P, W, X, [j, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: D,
                contains: ["self", w]
            }, {
                begin: A.IDENT_RE + "::",
                keywords: D
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
                keywords: D
            }
        }
    }
    iO4.exports = vd9
})
// @from(Ln 255335, Col 4)
oO4 = x((M4w, rO4) => {
    function Nd9(A) {
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
            _ = {
                className: "string",
                begin: /(#\d+)+/
            },
            w = {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?(DT|D|T)",
                relevance: 0
            },
            O = {
                className: "string",
                begin: '"',
                end: '"'
            },
            $ = {
                className: "function",
                beginKeywords: "procedure",
                end: /[:;]/,
                keywords: "procedure|10",
                contains: [A.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: q,
                    contains: [z, _]
                }].concat(Y)
            },
            H = {
                className: "class",
                begin: "OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)",
                returnBegin: !0,
                contains: [A.TITLE_MODE, $]
            };
        return {
            name: "C/AL",
            case_insensitive: !0,
            keywords: {
                keyword: q,
                literal: "false true"
            },
            illegal: /\/\*/,
            contains: [z, _, w, O, A.NUMBER_MODE, H, $]
        }
    }
    rO4.exports = Nd9
})
// @from(Ln 255398, Col 4)
sO4 = x((D4w, aO4) => {
    function Vd9(A) {
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
    aO4.exports = Vd9
})
// @from(Ln 255442, Col 4)
eO4 = x((X4w, tO4) => {
    function kd9(A) {
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
            _ = [{
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
        return z.contains = _, {
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
            }].concat(_)
        }
    }
    tO4.exports = kd9
})
// @from(Ln 255492, Col 4)
q$4 = x((P4w, A$4) => {
    function Ed9(A) {
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
    A$4.exports = Ed9
})