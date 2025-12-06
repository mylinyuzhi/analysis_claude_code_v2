
// @from(Start 447681, End 450697)
bS0 = z((KB7, vS0) => {
  function no9(A) {
    let B = "[eE][-+]?\\d(_|\\d)*",
      G = "\\d(_|\\d)*(\\.\\d(_|\\d)*)?(" + B + ")?",
      Z = "\\w+",
      Y = "\\b(" + ("\\d(_|\\d)*#\\w+(\\.\\w+)?#(" + B + ")?") + "|" + G + ")",
      J = "[A-Za-z](_?[A-Za-z0-9.])*",
      W = `[]\\{\\}%#'"`,
      X = A.COMMENT("--", "$"),
      V = {
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
      contains: [X, {
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
        begin: Y,
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
        contains: [X, {
          className: "title",
          begin: "(\\bwith\\s+)?\\b(function|procedure)\\s+",
          end: "(\\(|\\s+|$)",
          excludeBegin: !0,
          excludeEnd: !0,
          illegal: `[]\\{\\}%#'"`
        }, V, {
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
      }, V]
    }
  }
  vS0.exports = no9
})
// @from(Start 450703, End 453023)
hS0 = z((DB7, fS0) => {
  function ao9(A) {
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
  fS0.exports = ao9
})
// @from(Start 453029, End 454505)
uS0 = z((HB7, gS0) => {
  function so9(A) {
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
  gS0.exports = so9
})
// @from(Start 454511, End 457694)
lS0 = z((CB7, pS0) => {
  function cS0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function mS0(...A) {
    return A.map((B) => cS0(B)).join("")
  }

  function dS0(...A) {
    return "(" + A.map((B) => cS0(B)).join("|") + ")"
  }

  function ro9(A) {
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
      I = [G, Z, A.HASH_COMMENT_MODE],
      Y = [/apart from/, /aside from/, /instead of/, /out of/, /greater than/, /isn't|(doesn't|does not) (equal|come before|come after|contain)/, /(greater|less) than( or equal)?/, /(starts?|ends|begins?) with/, /contained by/, /comes (before|after)/, /a (ref|reference)/, /POSIX (file|path)/, /(date|time) string/, /quoted form/],
      J = [/clipboard info/, /the clipboard/, /info for/, /list (disks|folder)/, /mount volume/, /path to/, /(close|open for) access/, /(get|set) eof/, /current date/, /do shell script/, /get volume settings/, /random number/, /set volume/, /system attribute/, /system info/, /time to GMT/, /(load|run|store) script/, /scripting components/, /ASCII (character|number)/, /localized string/, /choose (application|color|file|file name|folder|from list|remote application|URL)/, /display (alert|dialog)/];
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
        begin: mS0(/\b/, dS0(...J), /\b/)
      }, {
        className: "built_in",
        begin: /^\s*return\b/
      }, {
        className: "literal",
        begin: /\b(text item delimiters|current application|missing value)\b/
      }, {
        className: "keyword",
        begin: mS0(/\b/, dS0(...Y), /\b/)
      }, {
        beginKeywords: "on",
        illegal: /[${=;\n]/,
        contains: [A.UNDERSCORE_TITLE_MODE, B]
      }, ...I],
      illegal: /\/\/|->|=>|\[\[/
    }
  }
  pS0.exports = ro9
})
// @from(Start 457700, End 461645)
nS0 = z((EB7, iS0) => {
  function oo9(A) {
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
      I = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: B,
        contains: []
      },
      Y = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [A.BACKSLASH_ESCAPE, I]
      };
    I.contains = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, Y, Z, A.REGEXP_MODE];
    let J = I.contains.concat([A.C_BLOCK_COMMENT_MODE, A.C_LINE_COMMENT_MODE]);
    return {
      name: "ArcGIS Arcade",
      keywords: B,
      contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, Y, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, G, Z, {
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
              contains: J
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
          contains: J
        }],
        illegal: /\[|%/
      }, {
        begin: /\$[(.]/
      }],
      illegal: /#(?!!)/
    }
  }
  iS0.exports = oo9
})
// @from(Start 461651, End 472664)
sS0 = z((zB7, aS0) => {
  function to9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function eo9(A) {
    return kD1("(?=", A, ")")
  }

  function pyA(A) {
    return kD1("(", A, ")?")
  }

  function kD1(...A) {
    return A.map((B) => to9(B)).join("")
  }

  function At9(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      I = "(decltype\\(auto\\)|" + pyA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + pyA("<[^<>]+>") + ")",
      Y = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      J = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      W = {
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
      X = {
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
      V = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(W, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      F = {
        className: "title",
        begin: pyA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      K = pyA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      H = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "_Bool _Complex _Imaginary",
        _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
        literal: "true false nullptr NULL"
      },
      C = {
        className: "function.dispatch",
        relevance: 0,
        keywords: H,
        begin: kD1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, eo9(/\s*\(/))
      },
      E = [C, V, Y, Q, A.C_BLOCK_COMMENT_MODE, X, W],
      U = {
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
        contains: E.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: H,
          contains: E.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      q = {
        className: "function",
        begin: "(" + I + "[\\*&\\s]+)+" + K,
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
          begin: K,
          returnBegin: !0,
          contains: [F],
          relevance: 0
        }, {
          begin: /::/,
          relevance: 0
        }, {
          begin: /:/,
          endsWithParent: !0,
          contains: [W, X]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: H,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, W, X, Y, {
            begin: /\(/,
            end: /\)/,
            keywords: H,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, W, X, Y]
          }]
        }, Y, Q, A.C_BLOCK_COMMENT_MODE, V]
      };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: H,
      illegal: "</",
      classNameAliases: {
        "function.dispatch": "built_in"
      },
      contains: [].concat(U, q, C, E, [V, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: H,
        contains: ["self", Y]
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
        preprocessor: V,
        strings: W,
        keywords: H
      }
    }
  }

  function Qt9(A) {
    let Q = {
        keyword: "boolean byte word String",
        built_in: "KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD ",
        _: "setup loop runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put",
        literal: "DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW"
      },
      B = At9(A),
      G = B.keywords;
    return G.keyword += " " + Q.keyword, G.literal += " " + Q.literal, G.built_in += " " + Q.built_in, G._ += " " + Q._, B.name = "Arduino", B.aliases = ["ino"], B.supersetOf = "cpp", B
  }
  aS0.exports = Qt9
})
// @from(Start 472670, End 476336)
oS0 = z((UB7, rS0) => {
  function Bt9(A) {
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
  rS0.exports = Bt9
})
// @from(Start 476342, End 479963)
Q_0 = z(($B7, A_0) => {
  function eS0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function tS0(A) {
    return cs("(?=", A, ")")
  }

  function Gt9(A) {
    return cs("(", A, ")?")
  }

  function cs(...A) {
    return A.map((B) => eS0(B)).join("")
  }

  function Zt9(...A) {
    return "(" + A.map((B) => eS0(B)).join("|") + ")"
  }

  function It9(A) {
    let Q = cs(/[A-Z_]/, Gt9(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
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
      I = A.inherit(Z, {
        begin: /\(/,
        end: /\)/
      }),
      Y = A.inherit(A.APOS_STRING_MODE, {
        className: "meta-string"
      }),
      J = A.inherit(A.QUOTE_STRING_MODE, {
        className: "meta-string"
      }),
      W = {
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
        contains: [Z, J, Y, I, {
          begin: /\[/,
          end: /\]/,
          contains: [{
            className: "meta",
            begin: /<![a-z]/,
            end: />/,
            contains: [Z, I, J, Y]
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
        contains: [W],
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
        contains: [W],
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
        begin: cs(/</, tS0(cs(Q, Zt9(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [{
          className: "name",
          begin: Q,
          relevance: 0,
          starts: W
        }]
      }, {
        className: "tag",
        begin: cs(/<\//, tS0(cs(Q, />/))),
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
  A_0.exports = It9
})
// @from(Start 479969, End 484054)
Z_0 = z((wB7, G_0) => {
  function Yt9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function B_0(...A) {
    return A.map((B) => Yt9(B)).join("")
  }

  function Jt9(A) {
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
        begin: B_0(/\*\*/, /((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/, /(\*(?!\*)|\\[^\n]|[^*\n\\])*/, /\*\*/),
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
        begin: B_0(/__/, /((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/, /(_(?!_)|\\[^\n]|[^_\n\\])*/, /__/),
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
      I = {
        className: "symbol",
        begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
        relevance: 10
      },
      Y = {
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
      }, Y, I, ...B, ...G, ...Z, {
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
  G_0.exports = Jt9
})
// @from(Start 484060, End 487671)
Y_0 = z((qB7, I_0) => {
  function Wt9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function yD1(...A) {
    return A.map((B) => Wt9(B)).join("")
  }

  function Xt9(A) {
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
          begin: yD1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
          begin: yD1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
          begin: yD1(A.UNDERSCORE_IDENT_RE, /\s*\(/),
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
  I_0.exports = Xt9
})
// @from(Start 487677, End 489009)
W_0 = z((NB7, J_0) => {
  function Vt9(A) {
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
  J_0.exports = Vt9
})
// @from(Start 489015, End 501828)
V_0 = z((LB7, X_0) => {
  function Ft9(A) {
    let Q = "ByRef Case Const ContinueCase ContinueLoop Dim Do Else ElseIf EndFunc EndIf EndSelect EndSwitch EndWith Enum Exit ExitLoop For Func Global If In Local Next ReDim Return Select Static Step Switch Then To Until Volatile WEnd While With",
      B = ["EndRegion", "forcedef", "forceref", "ignorefunc", "include", "include-once", "NoTrayIcon", "OnAutoItStartRegister", "pragma", "Region", "RequireAdmin", "Tidy_Off", "Tidy_On", "Tidy_Parameters"],
      G = "True False And Null Not Or Default",
      Z = "Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive",
      I = {
        variants: [A.COMMENT(";", "$", {
          relevance: 0
        }), A.COMMENT("#cs", "#ce"), A.COMMENT("#comments-start", "#comments-end")]
      },
      Y = {
        begin: "\\$[A-z0-9_]+"
      },
      J = {
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
      W = {
        variants: [A.BINARY_NUMBER_MODE, A.C_NUMBER_MODE]
      },
      X = {
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
          contains: [J, {
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
        }, J, I]
      },
      V = {
        className: "symbol",
        begin: "@[A-z0-9_]+"
      },
      F = {
        className: "function",
        beginKeywords: "Func",
        end: "$",
        illegal: "\\$|\\[|%",
        contains: [A.UNDERSCORE_TITLE_MODE, {
          className: "params",
          begin: "\\(",
          end: "\\)",
          contains: [Y, J, W]
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
      contains: [I, Y, J, W, X, V, F]
    }
  }
  X_0.exports = Ft9
})
// @from(Start 501834, End 504096)
K_0 = z((MB7, F_0) => {
  function Kt9(A) {
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
  F_0.exports = Kt9
})
// @from(Start 504102, End 505321)
H_0 = z((OB7, D_0) => {
  function Dt9(A) {
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
  D_0.exports = Dt9
})
// @from(Start 505327, End 507287)
E_0 = z((RB7, C_0) => {
  function Ht9(A) {
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
  C_0.exports = Ht9
})
// @from(Start 507293, End 510196)
U_0 = z((TB7, z_0) => {
  function Ct9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Et9(...A) {
    return A.map((B) => Ct9(B)).join("")
  }

  function zt9(A) {
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
        begin: Et9(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
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
      I = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [A.BACKSLASH_ESCAPE, Q, G]
      };
    G.contains.push(I);
    let Y = {
        className: "",
        begin: /\\"/
      },
      J = {
        className: "string",
        begin: /'/,
        end: /'/
      },
      W = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [{
          begin: /\d+#[0-9a-f]+/,
          className: "number"
        }, A.NUMBER_MODE, Q]
      },
      X = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
      V = A.SHEBANG({
        binary: `(${X.join("|")})`,
        relevance: 10
      }),
      F = {
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
      contains: [V, A.SHEBANG(), F, W, A.HASH_COMMENT_MODE, Z, I, Y, J, Q]
    }
  }
  z_0.exports = zt9
})
// @from(Start 510202, End 511924)
w_0 = z((PB7, $_0) => {
  function Ut9(A) {
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
  $_0.exports = Ut9
})
// @from(Start 511930, End 512360)
N_0 = z((jB7, q_0) => {
  function $t9(A) {
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
  q_0.exports = $t9
})
// @from(Start 512366, End 512971)
M_0 = z((SB7, L_0) => {
  function wt9(A) {
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
  L_0.exports = wt9
})
// @from(Start 512977, End 520336)
R_0 = z((_B7, O_0) => {
  function qt9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Nt9(A) {
    return xD1("(?=", A, ")")
  }

  function lyA(A) {
    return xD1("(", A, ")?")
  }

  function xD1(...A) {
    return A.map((B) => qt9(B)).join("")
  }

  function Lt9(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      I = "(decltype\\(auto\\)|" + lyA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + lyA("<[^<>]+>") + ")",
      Y = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      J = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      W = {
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
      X = {
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
      V = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(W, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      F = {
        className: "title",
        begin: lyA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      K = lyA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      H = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "_Bool _Complex _Imaginary",
        _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
        literal: "true false nullptr NULL"
      },
      C = {
        className: "function.dispatch",
        relevance: 0,
        keywords: H,
        begin: xD1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, Nt9(/\s*\(/))
      },
      E = [C, V, Y, Q, A.C_BLOCK_COMMENT_MODE, X, W],
      U = {
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
        contains: E.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: H,
          contains: E.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      q = {
        className: "function",
        begin: "(" + I + "[\\*&\\s]+)+" + K,
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
          begin: K,
          returnBegin: !0,
          contains: [F],
          relevance: 0
        }, {
          begin: /::/,
          relevance: 0
        }, {
          begin: /:/,
          endsWithParent: !0,
          contains: [W, X]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: H,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, W, X, Y, {
            begin: /\(/,
            end: /\)/,
            keywords: H,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, W, X, Y]
          }]
        }, Y, Q, A.C_BLOCK_COMMENT_MODE, V]
      };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: H,
      illegal: "</",
      classNameAliases: {
        "function.dispatch": "built_in"
      },
      contains: [].concat(U, q, C, E, [V, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: H,
        contains: ["self", Y]
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
        preprocessor: V,
        strings: W,
        keywords: H
      }
    }
  }

  function Mt9(A) {
    let Q = Lt9(A),
      B = ["c", "h"],
      G = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
    if (Q.disableAutodetect = !0, Q.aliases = [], !A.getLanguage("c")) Q.aliases.push(...B);
    if (!A.getLanguage("cpp")) Q.aliases.push(...G);
    return Q
  }
  O_0.exports = Mt9
})
// @from(Start 520342, End 526542)
P_0 = z((kB7, T_0) => {
  function Ot9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function iyA(A) {
    return Rt9("(", A, ")?")
  }

  function Rt9(...A) {
    return A.map((B) => Ot9(B)).join("")
  }

  function Tt9(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      I = "(decltype\\(auto\\)|" + iyA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + iyA("<[^<>]+>") + ")",
      Y = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      J = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      W = {
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
      X = {
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
      V = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(W, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      F = {
        className: "title",
        begin: iyA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      K = iyA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      D = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
        literal: "true false nullptr NULL"
      },
      H = [V, Y, Q, A.C_BLOCK_COMMENT_MODE, X, W],
      C = {
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
        contains: H.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: D,
          contains: H.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      E = {
        className: "function",
        begin: "(" + I + "[\\*&\\s]+)+" + K,
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
          begin: K,
          returnBegin: !0,
          contains: [F],
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: D,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, W, X, Y, {
            begin: /\(/,
            end: /\)/,
            keywords: D,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, W, X, Y]
          }]
        }, Y, Q, A.C_BLOCK_COMMENT_MODE, V]
      };
    return {
      name: "C",
      aliases: ["h"],
      keywords: D,
      disableAutodetect: !0,
      illegal: "</",
      contains: [].concat(C, E, H, [V, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: D,
        contains: ["self", Y]
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
        preprocessor: V,
        strings: W,
        keywords: D
      }
    }
  }
  T_0.exports = Tt9
})
// @from(Start 526548, End 528108)
S_0 = z((yB7, j_0) => {
  function Pt9(A) {
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
      I = {
        className: "string",
        begin: /(#\d+)+/
      },
      Y = {
        className: "number",
        begin: "\\b\\d+(\\.\\d+)?(DT|D|T)",
        relevance: 0
      },
      J = {
        className: "string",
        begin: '"',
        end: '"'
      },
      W = {
        className: "function",
        beginKeywords: "procedure",
        end: /[:;]/,
        keywords: "procedure|10",
        contains: [A.TITLE_MODE, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: Q,
          contains: [Z, I]
        }].concat(G)
      },
      X = {
        className: "class",
        begin: "OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)",
        returnBegin: !0,
        contains: [A.TITLE_MODE, W]
      };
    return {
      name: "C/AL",
      case_insensitive: !0,
      keywords: {
        keyword: Q,
        literal: "false true"
      },
      illegal: /\/\*/,
      contains: [Z, I, Y, J, A.NUMBER_MODE, X, W]
    }
  }
  j_0.exports = Pt9
})
// @from(Start 528114, End 529340)
k_0 = z((xB7, __0) => {
  function jt9(A) {
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
  __0.exports = jt9
})
// @from(Start 529346, End 530908)
x_0 = z((vB7, y_0) => {
  function St9(A) {
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
      I = [{
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
    return Z.contains = I, {
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
      }].concat(I)
    }
  }
  y_0.exports = St9
})
// @from(Start 530914, End 531568)
b_0 = z((bB7, v_0) => {
  function _t9(A) {
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
  v_0.exports = _t9
})
// @from(Start 531574, End 536111)
h_0 = z((fB7, f_0) => {
  function kt9(A) {
    let B = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
      G = "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
      Z = {
        $pattern: B,
        "builtin-name": "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
      },
      I = "[-+]?\\d+(\\.\\d+)?",
      Y = {
        begin: B,
        relevance: 0
      },
      J = {
        className: "number",
        begin: "[-+]?\\d+(\\.\\d+)?",
        relevance: 0
      },
      W = A.inherit(A.QUOTE_STRING_MODE, {
        illegal: null
      }),
      X = A.COMMENT(";", "$", {
        relevance: 0
      }),
      V = {
        className: "literal",
        begin: /\b(true|false|nil)\b/
      },
      F = {
        begin: "[\\[\\{]",
        end: "[\\]\\}]"
      },
      K = {
        className: "comment",
        begin: "\\^" + B
      },
      D = A.COMMENT("\\^\\{", "\\}"),
      H = {
        className: "symbol",
        begin: "[:]{1,2}" + B
      },
      C = {
        begin: "\\(",
        end: "\\)"
      },
      E = {
        endsWithParent: !0,
        relevance: 0
      },
      U = {
        keywords: Z,
        className: "name",
        begin: B,
        relevance: 0,
        starts: E
      },
      q = [C, W, K, D, X, H, F, J, V, Y],
      w = {
        beginKeywords: "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
        lexemes: B,
        end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
        contains: [{
          className: "title",
          begin: B,
          relevance: 0,
          excludeEnd: !0,
          endsParent: !0
        }].concat(q)
      };
    return C.contains = [A.COMMENT("comment", ""), w, U, E], E.contains = q, F.contains = q, D.contains = [F], {
      name: "Clojure",
      aliases: ["clj"],
      illegal: /\S/,
      contains: [C, W, K, D, X, H, F, J, V]
    }
  }
  f_0.exports = kt9
})
// @from(Start 536117, End 536408)
u_0 = z((hB7, g_0) => {
  function yt9(A) {
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
  g_0.exports = yt9
})
// @from(Start 536414, End 538965)
d_0 = z((gB7, m_0) => {
  function xt9(A) {
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
  m_0.exports = xt9
})
// @from(Start 538971, End 543532)
p_0 = z((uB7, c_0) => {
  var vt9 = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
    bt9 = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    ft9 = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
    ht9 = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
    gt9 = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
    ut9 = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
    mt9 = [].concat(gt9, ut9, ft9, ht9);

  function dt9(A) {
    let Q = ["npm", "print"],
      B = ["yes", "no", "on", "off"],
      G = ["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"],
      Z = ["var", "const", "let", "function", "static"],
      I = (D) => (H) => !D.includes(H),
      Y = {
        keyword: vt9.concat(G).filter(I(Z)),
        literal: bt9.concat(B),
        built_in: mt9.concat(Q)
      },
      J = "[A-Za-z$_][0-9A-Za-z$_]*",
      W = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: Y
      },
      X = [A.BINARY_NUMBER_MODE, A.inherit(A.C_NUMBER_MODE, {
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
          contains: [A.BACKSLASH_ESCAPE, W]
        }, {
          begin: /"/,
          end: /"/,
          contains: [A.BACKSLASH_ESCAPE, W]
        }]
      }, {
        className: "regexp",
        variants: [{
          begin: "///",
          end: "///",
          contains: [W, A.HASH_COMMENT_MODE]
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
    W.contains = X;
    let V = A.inherit(A.TITLE_MODE, {
        begin: "[A-Za-z$_][0-9A-Za-z$_]*"
      }),
      F = "(\\(.*\\)\\s*)?\\B[-=]>",
      K = {
        className: "params",
        begin: "\\([^\\(]",
        returnBegin: !0,
        contains: [{
          begin: /\(/,
          end: /\)/,
          keywords: Y,
          contains: ["self"].concat(X)
        }]
      };
    return {
      name: "CoffeeScript",
      aliases: ["coffee", "cson", "iced"],
      keywords: Y,
      illegal: /\/\*/,
      contains: X.concat([A.COMMENT("###", "###"), A.HASH_COMMENT_MODE, {
        className: "function",
        begin: "^\\s*[A-Za-z$_][0-9A-Za-z$_]*\\s*=\\s*" + F,
        end: "[-=]>",
        returnBegin: !0,
        contains: [V, K]
      }, {
        begin: /[:\(,=]\s*/,
        relevance: 0,
        contains: [{
          className: "function",
          begin: F,
          end: "[-=]>",
          returnBegin: !0,
          contains: [K]
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
          contains: [V]
        }, V]
      }, {
        begin: "[A-Za-z$_][0-9A-Za-z$_]*:",
        end: ":",
        returnBegin: !0,
        returnEnd: !0,
        relevance: 0
      }])
    }
  }
  c_0.exports = dt9
})