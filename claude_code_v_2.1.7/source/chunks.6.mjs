
// @from(Ln 17807, Col 4)
ks0 = U((Oi7, vs0) => {
  function v14(A) {
    let B = "[eE][-+]?\\d(_|\\d)*",
      G = "\\d(_|\\d)*(\\.\\d(_|\\d)*)?(" + B + ")?",
      Z = "\\w+",
      J = "\\b(" + ("\\d(_|\\d)*#\\w+(\\.\\w+)?#(" + B + ")?") + "|" + G + ")",
      X = "[A-Za-z](_?[A-Za-z0-9.])*",
      I = `[]\\{\\}%#'"`,
      D = A.COMMENT("--", "$"),
      W = {
        begin: "\\s+:\\s+",
        end: "\\s*(:=|;|\\)|=>|$)",
        illegal: `[]\\{\\}%#'"`,
        contains: [{
          beginKeywords: "loop for declare others",
          endsParent: !0
        }, {
          className: "keyword",
          beginKeywords: "not null constant access function procedure in out aliased exception"
        }, {
          className: "type",
          begin: "[A-Za-z](_?[A-Za-z0-9.])*",
          endsParent: !0,
          relevance: 0
        }]
      };
    return {
      name: "Ada",
      case_insensitive: !0,
      keywords: {
        keyword: "abort else new return abs elsif not reverse abstract end accept entry select access exception of separate aliased exit or some all others subtype and for out synchronized array function overriding at tagged generic package task begin goto pragma terminate body private then if procedure type case in protected constant interface is raise use declare range delay limited record when delta loop rem while digits renames with do mod requeue xor",
        literal: "True False"
      },
      contains: [D, {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [{
          begin: /""/,
          relevance: 0
        }]
      }, {
        className: "string",
        begin: /'.'/
      }, {
        className: "number",
        begin: J,
        relevance: 0
      }, {
        className: "symbol",
        begin: "'[A-Za-z](_?[A-Za-z0-9.])*"
      }, {
        className: "title",
        begin: "(\\bwith\\s+)?(\\bprivate\\s+)?\\bpackage\\s+(\\bbody\\s+)?",
        end: "(is|$)",
        keywords: "package body",
        excludeBegin: !0,
        excludeEnd: !0,
        illegal: `[]\\{\\}%#'"`
      }, {
        begin: "(\\b(with|overriding)\\s+)?\\b(function|procedure)\\s+",
        end: "(\\bis|\\bwith|\\brenames|\\)\\s*;)",
        keywords: "overriding function procedure with is renames return",
        returnBegin: !0,
        contains: [D, {
          className: "title",
          begin: "(\\bwith\\s+)?\\b(function|procedure)\\s+",
          end: "(\\(|\\s+|$)",
          excludeBegin: !0,
          excludeEnd: !0,
          illegal: `[]\\{\\}%#'"`
        }, W, {
          className: "type",
          begin: "\\breturn\\s+",
          end: "(\\s+|;|$)",
          keywords: "return",
          excludeBegin: !0,
          excludeEnd: !0,
          endsParent: !0,
          illegal: `[]\\{\\}%#'"`
        }]
      }, {
        className: "type",
        begin: "\\b(sub)?type\\s+",
        end: "\\s+",
        keywords: "type",
        excludeBegin: !0,
        illegal: `[]\\{\\}%#'"`
      }, W]
    }
  }
  vs0.exports = v14
})
// @from(Ln 17900, Col 4)
fs0 = U((Mi7, bs0) => {
  function k14(A) {
    var Q = {
        className: "built_in",
        begin: "\\b(void|bool|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|string|ref|array|double|float|auto|dictionary)"
      },
      B = {
        className: "symbol",
        begin: "[a-zA-Z0-9_]+@"
      },
      G = {
        className: "keyword",
        begin: "<",
        end: ">",
        contains: [Q, B]
      };
    return Q.contains = [G], B.contains = [G], {
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
      }, Q, B, {
        className: "literal",
        begin: "\\b(null|true|false)"
      }, {
        className: "number",
        relevance: 0,
        begin: "(-?)(\\b0[xXbBoOdD][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?f?|\\.\\d+f?)([eE][-+]?\\d+f?)?)"
      }]
    }
  }
  bs0.exports = k14
})
// @from(Ln 17978, Col 4)
gs0 = U((Ri7, hs0) => {
  function b14(A) {
    let Q = {
        className: "number",
        begin: /[$%]\d+/
      },
      B = {
        className: "number",
        begin: /\d+/
      },
      G = {
        className: "number",
        begin: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/
      },
      Z = {
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
        contains: [G, Z, A.inherit(A.QUOTE_STRING_MODE, {
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
            contains: ["self", Q]
          }, G, B, A.QUOTE_STRING_MODE]
        }
      }],
      illegal: /\S/
    }
  }
  hs0.exports = b14
})
// @from(Ln 18037, Col 4)
ps0 = U((_i7, cs0) => {
  function ds0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function us0(...A) {
    return A.map((B) => ds0(B)).join("")
  }

  function ms0(...A) {
    return "(" + A.map((B) => ds0(B)).join("|") + ")"
  }

  function f14(A) {
    let Q = A.inherit(A.QUOTE_STRING_MODE, {
        illegal: null
      }),
      B = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        contains: ["self", A.C_NUMBER_MODE, Q]
      },
      G = A.COMMENT(/--/, /$/),
      Z = A.COMMENT(/\(\*/, /\*\)/, {
        contains: ["self", G]
      }),
      Y = [G, Z, A.HASH_COMMENT_MODE],
      J = [/apart from/, /aside from/, /instead of/, /out of/, /greater than/, /isn't|(doesn't|does not) (equal|come before|come after|contain)/, /(greater|less) than( or equal)?/, /(starts?|ends|begins?) with/, /contained by/, /comes (before|after)/, /a (ref|reference)/, /POSIX (file|path)/, /(date|time) string/, /quoted form/],
      X = [/clipboard info/, /the clipboard/, /info for/, /list (disks|folder)/, /mount volume/, /path to/, /(close|open for) access/, /(get|set) eof/, /current date/, /do shell script/, /get volume settings/, /random number/, /set volume/, /system attribute/, /system info/, /time to GMT/, /(load|run|store) script/, /scripting components/, /ASCII (character|number)/, /localized string/, /choose (application|color|file|file name|folder|from list|remote application|URL)/, /display (alert|dialog)/];
    return {
      name: "AppleScript",
      aliases: ["osascript"],
      keywords: {
        keyword: "about above after against and around as at back before beginning behind below beneath beside between but by considering contain contains continue copy div does eighth else end equal equals error every exit fifth first for fourth from front get given global if ignoring in into is it its last local me middle mod my ninth not of on onto or over prop property put ref reference repeat returning script second set seventh since sixth some tell tenth that the|0 then third through thru timeout times to transaction try until where while whose with without",
        literal: "AppleScript false linefeed return pi quote result space tab true",
        built_in: "alias application boolean class constant date file integer list number real record string text activate beep count delay launch log offset read round run say summarize write character characters contents day frontmost id item length month name paragraph paragraphs rest reverse running time version weekday word words year"
      },
      contains: [Q, A.C_NUMBER_MODE, {
        className: "built_in",
        begin: us0(/\b/, ms0(...X), /\b/)
      }, {
        className: "built_in",
        begin: /^\s*return\b/
      }, {
        className: "literal",
        begin: /\b(text item delimiters|current application|missing value)\b/
      }, {
        className: "keyword",
        begin: us0(/\b/, ms0(...J), /\b/)
      }, {
        beginKeywords: "on",
        illegal: /[${=;\n]/,
        contains: [A.UNDERSCORE_TITLE_MODE, B]
      }, ...Y],
      illegal: /\/\/|->|=>|\[\[/
    }
  }
  cs0.exports = f14
})
// @from(Ln 18099, Col 4)
is0 = U((ji7, ls0) => {
  function h14(A) {
    let B = {
        keyword: "if for while var new function do return void else break",
        literal: "BackSlash DoubleQuote false ForwardSlash Infinity NaN NewLine null PI SingleQuote Tab TextFormatting true undefined",
        built_in: "Abs Acos Angle Attachments Area AreaGeodetic Asin Atan Atan2 Average Bearing Boolean Buffer BufferGeodetic Ceil Centroid Clip Console Constrain Contains Cos Count Crosses Cut Date DateAdd DateDiff Day Decode DefaultValue Dictionary Difference Disjoint Distance DistanceGeodetic Distinct DomainCode DomainName Equals Exp Extent Feature FeatureSet FeatureSetByAssociation FeatureSetById FeatureSetByPortalItem FeatureSetByRelationshipName FeatureSetByTitle FeatureSetByUrl Filter First Floor Geometry GroupBy Guid HasKey Hour IIf IndexOf Intersection Intersects IsEmpty IsNan IsSelfIntersecting Length LengthGeodetic Log Max Mean Millisecond Min Minute Month MultiPartToSinglePart Multipoint NextSequenceValue Now Number OrderBy Overlaps Point Polygon Polyline Portal Pow Random Relate Reverse RingIsClockWise Round Second SetGeometry Sin Sort Sqrt Stdev Sum SymmetricDifference Tan Text Timestamp Today ToLocal Top Touches ToUTC TrackCurrentTime TrackGeometryWindow TrackIndex TrackStartTime TrackWindow TypeOf Union UrlEncode Variance Weekday When Within Year "
      },
      G = {
        className: "symbol",
        begin: "\\$[datastore|feature|layer|map|measure|sourcefeature|sourcelayer|targetfeature|targetlayer|value|view]+"
      },
      Z = {
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
      Y = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: B,
        contains: []
      },
      J = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [A.BACKSLASH_ESCAPE, Y]
      };
    Y.contains = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, J, Z, A.REGEXP_MODE];
    let X = Y.contains.concat([A.C_BLOCK_COMMENT_MODE, A.C_LINE_COMMENT_MODE]);
    return {
      name: "ArcGIS Arcade",
      keywords: B,
      contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, J, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, G, Z, {
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
              keywords: B,
              contains: X
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
          contains: X
        }],
        illegal: /\[|%/
      }, {
        begin: /\$[(.]/
      }],
      illegal: /#(?!!)/
    }
  }
  ls0.exports = h14
})
// @from(Ln 18201, Col 4)
as0 = U((Ti7, ns0) => {
  function g14(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function u14(A) {
    return XO1("(?=", A, ")")
  }

  function IpA(A) {
    return XO1("(", A, ")?")
  }

  function XO1(...A) {
    return A.map((B) => g14(B)).join("")
  }

  function m14(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      Y = "(decltype\\(auto\\)|" + IpA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + IpA("<[^<>]+>") + ")",
      J = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      X = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      I = {
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
      D = {
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
      W = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(I, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      K = {
        className: "title",
        begin: IpA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      V = IpA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      H = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "_Bool _Complex _Imaginary",
        _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
        literal: "true false nullptr NULL"
      },
      E = {
        className: "function.dispatch",
        relevance: 0,
        keywords: H,
        begin: XO1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, u14(/\s*\(/))
      },
      z = [E, W, J, Q, A.C_BLOCK_COMMENT_MODE, D, I],
      $ = {
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
        keywords: H,
        contains: z.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: H,
          contains: z.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      O = {
        className: "function",
        begin: "(" + Y + "[\\*&\\s]+)+" + V,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: H,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [{
          begin: "decltype\\(auto\\)",
          keywords: H,
          relevance: 0
        }, {
          begin: V,
          returnBegin: !0,
          contains: [K],
          relevance: 0
        }, {
          begin: /::/,
          relevance: 0
        }, {
          begin: /:/,
          endsWithParent: !0,
          contains: [I, D]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: H,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, I, D, J, {
            begin: /\(/,
            end: /\)/,
            keywords: H,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, I, D, J]
          }]
        }, J, Q, A.C_BLOCK_COMMENT_MODE, W]
      };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: H,
      illegal: "</",
      classNameAliases: {
        "function.dispatch": "built_in"
      },
      contains: [].concat($, O, E, z, [W, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: H,
        contains: ["self", J]
      }, {
        begin: A.IDENT_RE + "::",
        keywords: H
      }, {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{
          beginKeywords: "final class struct"
        }, A.TITLE_MODE]
      }]),
      exports: {
        preprocessor: W,
        strings: I,
        keywords: H
      }
    }
  }

  function d14(A) {
    let Q = {
        keyword: "boolean byte word String",
        built_in: "KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD ",
        _: "setup loop runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put",
        literal: "DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW"
      },
      B = m14(A),
      G = B.keywords;
    return G.keyword += " " + Q.keyword, G.literal += " " + Q.literal, G.built_in += " " + Q.built_in, G._ += " " + Q._, B.name = "Arduino", B.aliases = ["ino"], B.supersetOf = "cpp", B
  }
  ns0.exports = d14
})
// @from(Ln 18403, Col 4)
rs0 = U((Pi7, os0) => {
  function c14(A) {
    let Q = {
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
      }, Q, A.QUOTE_STRING_MODE, {
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
  os0.exports = c14
})
// @from(Ln 18463, Col 4)
At0 = U((Si7, es0) => {
  function ts0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function ss0(A) {
    return Y1A("(?=", A, ")")
  }

  function p14(A) {
    return Y1A("(", A, ")?")
  }

  function Y1A(...A) {
    return A.map((B) => ts0(B)).join("")
  }

  function l14(...A) {
    return "(" + A.map((B) => ts0(B)).join("|") + ")"
  }

  function i14(A) {
    let Q = Y1A(/[A-Z_]/, p14(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
      B = /[A-Za-z0-9._:-]+/,
      G = {
        className: "symbol",
        begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
      },
      Z = {
        begin: /\s/,
        contains: [{
          className: "meta-keyword",
          begin: /#?[a-z_][a-z1-9_-]+/,
          illegal: /\n/
        }]
      },
      Y = A.inherit(Z, {
        begin: /\(/,
        end: /\)/
      }),
      J = A.inherit(A.APOS_STRING_MODE, {
        className: "meta-string"
      }),
      X = A.inherit(A.QUOTE_STRING_MODE, {
        className: "meta-string"
      }),
      I = {
        endsWithParent: !0,
        illegal: /</,
        relevance: 0,
        contains: [{
          className: "attr",
          begin: B,
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
              contains: [G]
            }, {
              begin: /'/,
              end: /'/,
              contains: [G]
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
        contains: [Z, X, J, Y, {
          begin: /\[/,
          end: /\]/,
          contains: [{
            className: "meta",
            begin: /<![a-z]/,
            end: />/,
            contains: [Z, Y, X, J]
          }]
        }]
      }, A.COMMENT(/<!--/, /-->/, {
        relevance: 10
      }), {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      }, G, {
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
        contains: [I],
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
        contains: [I],
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
        begin: Y1A(/</, ss0(Y1A(Q, l14(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [{
          className: "name",
          begin: Q,
          relevance: 0,
          starts: I
        }]
      }, {
        className: "tag",
        begin: Y1A(/<\//, ss0(Y1A(Q, />/))),
        contains: [{
          className: "name",
          begin: Q,
          relevance: 0
        }, {
          begin: />/,
          relevance: 0,
          endsParent: !0
        }]
      }]
    }
  }
  es0.exports = i14
})
// @from(Ln 18625, Col 4)
Gt0 = U((xi7, Bt0) => {
  function n14(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Qt0(...A) {
    return A.map((B) => n14(B)).join("")
  }

  function a14(A) {
    let Q = {
        begin: "^'{3,}[ \\t]*$",
        relevance: 10
      },
      B = [{
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
      G = [{
        className: "strong",
        begin: /\*{2}([^\n]+?)\*{2}/
      }, {
        className: "strong",
        begin: Qt0(/\*\*/, /((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/, /(\*(?!\*)|\\[^\n]|[^*\n\\])*/, /\*\*/),
        relevance: 0
      }, {
        className: "strong",
        begin: /\B\*(\S|\S[^\n]*?\S)\*(?!\w)/
      }, {
        className: "strong",
        begin: /\*[^\s]([^\n]+\n)+([^\n]+)\*/
      }],
      Z = [{
        className: "emphasis",
        begin: /_{2}([^\n]+?)_{2}/
      }, {
        className: "emphasis",
        begin: Qt0(/__/, /((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/, /(_(?!_)|\\[^\n]|[^_\n\\])*/, /__/),
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
      Y = {
        className: "symbol",
        begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
        relevance: 10
      },
      J = {
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
      }, J, Y, ...B, ...G, ...Z, {
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
      }, Q, {
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
  Bt0.exports = a14
})
// @from(Ln 18795, Col 4)
Yt0 = U((yi7, Zt0) => {
  function o14(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function IO1(...A) {
    return A.map((B) => o14(B)).join("")
  }

  function r14(A) {
    let Q = "false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else extends implements break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws privileged aspectOf adviceexecution proceed cflowbelow cflow initialization preinitialization staticinitialization withincode target within execution getWithinTypeName handler thisJoinPoint thisJoinPointStaticPart thisEnclosingJoinPointStaticPart declare parents warning error soft precedence thisAspectInstance",
      B = "get set args call";
    return {
      name: "AspectJ",
      keywords: Q,
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
          keywords: Q + " get set args call",
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
          begin: IO1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
          returnBegin: !0,
          contains: [A.UNDERSCORE_TITLE_MODE]
        }]
      }, {
        begin: /[:]/,
        returnBegin: !0,
        end: /[{;]/,
        relevance: 0,
        excludeEnd: !1,
        keywords: Q,
        illegal: /["\[\]]/,
        contains: [{
          begin: IO1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
          keywords: Q + " get set args call",
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
        keywords: Q,
        excludeEnd: !0,
        contains: [{
          begin: IO1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
          returnBegin: !0,
          relevance: 0,
          contains: [A.UNDERSCORE_TITLE_MODE]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          relevance: 0,
          keywords: Q,
          contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, A.C_BLOCK_COMMENT_MODE]
        }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      }, A.C_NUMBER_MODE, {
        className: "meta",
        begin: /@[A-Za-z]+/
      }]
    }
  }
  Zt0.exports = r14
})
// @from(Ln 18901, Col 4)
Xt0 = U((vi7, Jt0) => {
  function s14(A) {
    let Q = {
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
      contains: [Q, A.inherit(A.QUOTE_STRING_MODE, {
        contains: [Q]
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
  Jt0.exports = s14
})
// @from(Ln 18952, Col 4)
Dt0 = U((ki7, It0) => {
  function t14(A) {
    let Q = "ByRef Case Const ContinueCase ContinueLoop Dim Do Else ElseIf EndFunc EndIf EndSelect EndSwitch EndWith Enum Exit ExitLoop For Func Global If In Local Next ReDim Return Select Static Step Switch Then To Until Volatile WEnd While With",
      B = ["EndRegion", "forcedef", "forceref", "ignorefunc", "include", "include-once", "NoTrayIcon", "OnAutoItStartRegister", "pragma", "Region", "RequireAdmin", "Tidy_Off", "Tidy_On", "Tidy_Parameters"],
      G = "True False And Null Not Or Default",
      Z = "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
      Y = {
        variants: [A.COMMENT(";", "$", {
          relevance: 0
        }), A.COMMENT("#cs", "#ce"), A.COMMENT("#comments-start", "#comments-end")]
      },
      J = {
        begin: "\\$[A-z0-9_]+"
      },
      X = {
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
      I = {
        variants: [A.BINARY_NUMBER_MODE, A.C_NUMBER_MODE]
      },
      D = {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {
          "meta-keyword": B
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
          contains: [X, {
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
        }, X, Y]
      },
      W = {
        className: "symbol",
        begin: "@[A-z0-9_]+"
      },
      K = {
        className: "function",
        beginKeywords: "Func",
        end: "$",
        illegal: "\\$|\\[|%",
        contains: [A.UNDERSCORE_TITLE_MODE, {
          className: "params",
          begin: "\\(",
          end: "\\)",
          contains: [J, X, I]
        }]
      };
    return {
      name: "AutoIt",
      case_insensitive: !0,
      illegal: /\/\*/,
      keywords: {
        keyword: Q,
        built_in: "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
        literal: "True False And Null Not Or Default"
      },
      contains: [Y, J, X, I, D, W, K]
    }
  }
  It0.exports = t14
})
// @from(Ln 19056, Col 4)
Kt0 = U((bi7, Wt0) => {
  function e14(A) {
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
  Wt0.exports = e14
})
// @from(Ln 19092, Col 4)
Ft0 = U((fi7, Vt0) => {
  function A04(A) {
    let Q = {
        className: "variable",
        variants: [{
          begin: /\$[\w\d#@][\w\d_]*/
        }, {
          begin: /\$\{(.*?)\}/
        }]
      },
      B = "BEGIN END if else while do for in break continue delete next nextfile function func exit|10",
      G = {
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
      contains: [Q, G, A.REGEXP_MODE, A.HASH_COMMENT_MODE, A.NUMBER_MODE]
    }
  }
  Vt0.exports = A04
})
// @from(Ln 19140, Col 4)
Et0 = U((hi7, Ht0) => {
  function Q04(A) {
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
  Ht0.exports = Q04
})
// @from(Ln 19168, Col 4)
$t0 = U((gi7, zt0) => {
  function B04(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function G04(...A) {
    return A.map((B) => B04(B)).join("")
  }

  function Z04(A) {
    let Q = {},
      B = {
        begin: /\$\{/,
        end: /\}/,
        contains: ["self", {
          begin: /:-/,
          contains: [Q]
        }]
      };
    Object.assign(Q, {
      className: "variable",
      variants: [{
        begin: G04(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
      }, B]
    });
    let G = {
        className: "subst",
        begin: /\$\(/,
        end: /\)/,
        contains: [A.BACKSLASH_ESCAPE]
      },
      Z = {
        begin: /<<-?\s*(?=\w+)/,
        starts: {
          contains: [A.END_SAME_AS_BEGIN({
            begin: /(\w+)/,
            end: /(\w+)/,
            className: "string"
          })]
        }
      },
      Y = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [A.BACKSLASH_ESCAPE, Q, G]
      };
    G.contains.push(Y);
    let J = {
        className: "",
        begin: /\\"/
      },
      X = {
        className: "string",
        begin: /'/,
        end: /'/
      },
      I = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [{
          begin: /\d+#[0-9a-f]+/,
          className: "number"
        }, A.NUMBER_MODE, Q]
      },
      D = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
      W = A.SHEBANG({
        binary: `(${D.join("|")})`,
        relevance: 10
      }),
      K = {
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
      contains: [W, A.SHEBANG(), K, I, A.HASH_COMMENT_MODE, Z, Y, J, X, Q]
    }
  }
  zt0.exports = Z04
})
// @from(Ln 19263, Col 4)
Ut0 = U((ui7, Ct0) => {
  function Y04(A) {
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
  Ct0.exports = Y04
})
// @from(Ln 19296, Col 4)
Nt0 = U((mi7, qt0) => {
  function J04(A) {
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
  qt0.exports = J04
})
// @from(Ln 19316, Col 4)
Lt0 = U((di7, wt0) => {
  function X04(A) {
    let Q = {
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
        contains: [Q]
      }, Q]
    }
  }
  wt0.exports = X04
})
// @from(Ln 19347, Col 4)
Mt0 = U((ci7, Ot0) => {
  function I04(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function D04(A) {
    return DO1("(?=", A, ")")
  }

  function DpA(A) {
    return DO1("(", A, ")?")
  }

  function DO1(...A) {
    return A.map((B) => I04(B)).join("")
  }

  function W04(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      Y = "(decltype\\(auto\\)|" + DpA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + DpA("<[^<>]+>") + ")",
      J = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      X = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      I = {
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
      D = {
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
      W = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(I, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      K = {
        className: "title",
        begin: DpA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      V = DpA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      H = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "_Bool _Complex _Imaginary",
        _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
        literal: "true false nullptr NULL"
      },
      E = {
        className: "function.dispatch",
        relevance: 0,
        keywords: H,
        begin: DO1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, D04(/\s*\(/))
      },
      z = [E, W, J, Q, A.C_BLOCK_COMMENT_MODE, D, I],
      $ = {
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
        keywords: H,
        contains: z.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: H,
          contains: z.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      O = {
        className: "function",
        begin: "(" + Y + "[\\*&\\s]+)+" + V,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: H,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [{
          begin: "decltype\\(auto\\)",
          keywords: H,
          relevance: 0
        }, {
          begin: V,
          returnBegin: !0,
          contains: [K],
          relevance: 0
        }, {
          begin: /::/,
          relevance: 0
        }, {
          begin: /:/,
          endsWithParent: !0,
          contains: [I, D]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: H,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, I, D, J, {
            begin: /\(/,
            end: /\)/,
            keywords: H,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, I, D, J]
          }]
        }, J, Q, A.C_BLOCK_COMMENT_MODE, W]
      };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: H,
      illegal: "</",
      classNameAliases: {
        "function.dispatch": "built_in"
      },
      contains: [].concat($, O, E, z, [W, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: H,
        contains: ["self", J]
      }, {
        begin: A.IDENT_RE + "::",
        keywords: H
      }, {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{
          beginKeywords: "final class struct"
        }, A.TITLE_MODE]
      }]),
      exports: {
        preprocessor: W,
        strings: I,
        keywords: H
      }
    }
  }

  function K04(A) {
    let Q = W04(A),
      B = ["c", "h"],
      G = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
    if (Q.disableAutodetect = !0, Q.aliases = [], !A.getLanguage("c")) Q.aliases.push(...B);
    if (!A.getLanguage("cpp")) Q.aliases.push(...G);
    return Q
  }
  Ot0.exports = K04
})
// @from(Ln 19546, Col 4)
_t0 = U((pi7, Rt0) => {
  function V04(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function WpA(A) {
    return F04("(", A, ")?")
  }

  function F04(...A) {
    return A.map((B) => V04(B)).join("")
  }

  function H04(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      Y = "(decltype\\(auto\\)|" + WpA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + WpA("<[^<>]+>") + ")",
      J = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      X = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      I = {
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
      D = {
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
      W = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(I, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      K = {
        className: "title",
        begin: WpA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      V = WpA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      F = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
        literal: "true false nullptr NULL"
      },
      H = [W, J, Q, A.C_BLOCK_COMMENT_MODE, D, I],
      E = {
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
        keywords: F,
        contains: H.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: F,
          contains: H.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      z = {
        className: "function",
        begin: "(" + Y + "[\\*&\\s]+)+" + V,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: F,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [{
          begin: "decltype\\(auto\\)",
          keywords: F,
          relevance: 0
        }, {
          begin: V,
          returnBegin: !0,
          contains: [K],
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: F,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, I, D, J, {
            begin: /\(/,
            end: /\)/,
            keywords: F,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, I, D, J]
          }]
        }, J, Q, A.C_BLOCK_COMMENT_MODE, W]
      };
    return {
      name: "C",
      aliases: ["h"],
      keywords: F,
      disableAutodetect: !0,
      illegal: "</",
      contains: [].concat(E, z, H, [W, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: F,
        contains: ["self", J]
      }, {
        begin: A.IDENT_RE + "::",
        keywords: F
      }, {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{
          beginKeywords: "final class struct"
        }, A.TITLE_MODE]
      }]),
      exports: {
        preprocessor: W,
        strings: I,
        keywords: F
      }
    }
  }
  Rt0.exports = H04
})
// @from(Ln 19716, Col 4)
Tt0 = U((li7, jt0) => {
  function E04(A) {
    let Q = "div mod in and or not xor asserterror begin case do downto else end exit for if of repeat then to until while with var",
      B = "false true",
      G = [A.C_LINE_COMMENT_MODE, A.COMMENT(/\{/, /\}/, {
        relevance: 0
      }), A.COMMENT(/\(\*/, /\*\)/, {
        relevance: 10
      })],
      Z = {
        className: "string",
        begin: /'/,
        end: /'/,
        contains: [{
          begin: /''/
        }]
      },
      Y = {
        className: "string",
        begin: /(#\d+)+/
      },
      J = {
        className: "number",
        begin: "\\b\\d+(\\.\\d+)?(DT|D|T)",
        relevance: 0
      },
      X = {
        className: "string",
        begin: '"',
        end: '"'
      },
      I = {
        className: "function",
        beginKeywords: "procedure",
        end: /[:;]/,
        keywords: "procedure|10",
        contains: [A.TITLE_MODE, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: Q,
          contains: [Z, Y]
        }].concat(G)
      },
      D = {
        className: "class",
        begin: "OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)",
        returnBegin: !0,
        contains: [A.TITLE_MODE, I]
      };
    return {
      name: "C/AL",
      case_insensitive: !0,
      keywords: {
        keyword: Q,
        literal: "false true"
      },
      illegal: /\/\*/,
      contains: [Z, Y, J, X, A.NUMBER_MODE, D, I]
    }
  }
  jt0.exports = E04
})
// @from(Ln 19779, Col 4)
St0 = U((ii7, Pt0) => {
  function z04(A) {
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
  Pt0.exports = z04
})
// @from(Ln 19823, Col 4)
yt0 = U((ni7, xt0) => {
  function $04(A) {
    let Q = "assembly module package import alias class interface object given value assign void function new of extends satisfies abstracts in out return break continue throw assert dynamic if else switch case for while try catch finally then let this outer super is exists nonempty",
      B = "shared abstract formal default actual variable late native deprecated final sealed annotation suppressWarnings small",
      G = "doc by license see throws tagged",
      Z = {
        className: "subst",
        excludeBegin: !0,
        excludeEnd: !0,
        begin: /``/,
        end: /``/,
        keywords: Q,
        relevance: 10
      },
      Y = [{
        className: "string",
        begin: '"""',
        end: '"""',
        relevance: 10
      }, {
        className: "string",
        begin: '"',
        end: '"',
        contains: [Z]
      }, {
        className: "string",
        begin: "'",
        end: "'"
      }, {
        className: "number",
        begin: "#[0-9a-fA-F_]+|\\$[01_]+|[0-9_]+(?:\\.[0-9_](?:[eE][+-]?\\d+)?)?[kMGTPmunpf]?",
        relevance: 0
      }];
    return Z.contains = Y, {
      name: "Ceylon",
      keywords: {
        keyword: Q + " " + B,
        meta: "doc by license see throws tagged"
      },
      illegal: "\\$[^01]|#[^0-9a-fA-F]",
      contains: [A.C_LINE_COMMENT_MODE, A.COMMENT("/\\*", "\\*/", {
        contains: ["self"]
      }), {
        className: "meta",
        begin: '@[a-z]\\w*(?::"[^"]*")?'
      }].concat(Y)
    }
  }
  xt0.exports = $04
})
// @from(Ln 19873, Col 4)
kt0 = U((ai7, vt0) => {
  function C04(A) {
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
  vt0.exports = C04
})
// @from(Ln 19890, Col 4)
ft0 = U((oi7, bt0) => {
  function U04(A) {
    let B = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
      G = "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
      Z = {
        $pattern: B,
        "builtin-name": "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
      },
      Y = "[-+]?\\d+(\\.\\d+)?",
      J = {
        begin: B,
        relevance: 0
      },
      X = {
        className: "number",
        begin: "[-+]?\\d+(\\.\\d+)?",
        relevance: 0
      },
      I = A.inherit(A.QUOTE_STRING_MODE, {
        illegal: null
      }),
      D = A.COMMENT(";", "$", {
        relevance: 0
      }),
      W = {
        className: "literal",
        begin: /\b(true|false|nil)\b/
      },
      K = {
        begin: "[\\[\\{]",
        end: "[\\]\\}]"
      },
      V = {
        className: "comment",
        begin: "\\^" + B
      },
      F = A.COMMENT("\\^\\{", "\\}"),
      H = {
        className: "symbol",
        begin: "[:]{1,2}" + B
      },
      E = {
        begin: "\\(",
        end: "\\)"
      },
      z = {
        endsWithParent: !0,
        relevance: 0
      },
      $ = {
        keywords: Z,
        className: "name",
        begin: B,
        relevance: 0,
        starts: z
      },
      O = [E, I, V, F, D, H, K, X, W, J],
      L = {
        beginKeywords: "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
        lexemes: B,
        end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
        contains: [{
          className: "title",
          begin: B,
          relevance: 0,
          excludeEnd: !0,
          endsParent: !0
        }].concat(O)
      };
    return E.contains = [A.COMMENT("comment", ""), L, $, z], z.contains = O, K.contains = O, F.contains = [K], {
      name: "Clojure",
      aliases: ["clj"],
      illegal: /\S/,
      contains: [E, I, V, F, D, H, K, X, W]
    }
  }
  bt0.exports = U04
})
// @from(Ln 19968, Col 4)
gt0 = U((ri7, ht0) => {
  function q04(A) {
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
  ht0.exports = q04
})
// @from(Ln 19984, Col 4)
mt0 = U((si7, ut0) => {
  function N04(A) {
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
  ut0.exports = N04
})
// @from(Ln 20002, Col 4)
ct0 = U((ti7, dt0) => {
  var w04 = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
    L04 = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    O04 = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
    M04 = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
    R04 = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
    _04 = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
    j04 = [].concat(R04, _04, O04, M04);

  function T04(A) {
    let Q = ["npm", "print"],
      B = ["yes", "no", "on", "off"],
      G = ["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"],
      Z = ["var", "const", "let", "function", "static"],
      Y = (F) => (H) => !F.includes(H),
      J = {
        keyword: w04.concat(G).filter(Y(Z)),
        literal: L04.concat(B),
        built_in: j04.concat(Q)
      },
      X = "[A-Za-z$_][0-9A-Za-z$_]*",
      I = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: J
      },
      D = [A.BINARY_NUMBER_MODE, A.inherit(A.C_NUMBER_MODE, {
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
          contains: [A.BACKSLASH_ESCAPE, I]
        }, {
          begin: /"/,
          end: /"/,
          contains: [A.BACKSLASH_ESCAPE, I]
        }]
      }, {
        className: "regexp",
        variants: [{
          begin: "///",
          end: "///",
          contains: [I, A.HASH_COMMENT_MODE]
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
    I.contains = D;
    let W = A.inherit(A.TITLE_MODE, {
        begin: "[A-Za-z$_][0-9A-Za-z$_]*"
      }),
      K = "(\\(.*\\)\\s*)?\\B[-=]>",
      V = {
        className: "params",
        begin: "\\([^\\(]",
        returnBegin: !0,
        contains: [{
          begin: /\(/,
          end: /\)/,
          keywords: J,
          contains: ["self"].concat(D)
        }]
      };
    return {
      name: "CoffeeScript",
      aliases: ["coffee", "cson", "iced"],
      keywords: J,
      illegal: /\/\*/,
      contains: D.concat([A.COMMENT("###", "###"), A.HASH_COMMENT_MODE, {
        className: "function",
        begin: "^\\s*[A-Za-z$_][0-9A-Za-z$_]*\\s*=\\s*" + K,
        end: "[-=]>",
        returnBegin: !0,
        contains: [W, V]
      }, {
        begin: /[:\(,=]\s*/,
        relevance: 0,
        contains: [{
          className: "function",
          begin: K,
          end: "[-=]>",
          returnBegin: !0,
          contains: [V]
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
          contains: [W]
        }, W]
      }, {
        begin: "[A-Za-z$_][0-9A-Za-z$_]*:",
        end: ":",
        returnBegin: !0,
        returnEnd: !0,
        relevance: 0
      }])
    }
  }
  dt0.exports = T04
})