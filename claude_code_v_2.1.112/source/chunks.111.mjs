
// @from(Ln 280666, Col 4)
Xg4 = p((wow, Jg4) => {
    function STz(q) {
        let K = {
                className: "variable",
                begin: /\$[\w\d#@][\w\d_]*/
            },
            _ = {
                className: "variable",
                begin: /<(?!\/)/,
                end: />/
            };
        return {
            name: "Packet Filter config",
            aliases: ["pf.conf"],
            keywords: {
                $pattern: /[a-z0-9_<>-]+/,
                built_in: "block match pass load anchor|5 antispoof|10 set table",
                keyword: "in out log quick on rdomain inet inet6 proto from port os to route allow-opts divert-packet divert-reply divert-to flags group icmp-type icmp6-type label once probability recieved-on rtable prio queue tos tag tagged user keep fragment for os drop af-to|10 binat-to|10 nat-to|10 rdr-to|10 bitmask least-stats random round-robin source-hash static-port dup-to reply-to route-to parent bandwidth default min max qlimit block-policy debug fingerprints hostid limit loginterface optimization reassemble ruleset-optimization basic none profile skip state-defaults state-policy timeout const counters persist no modulate synproxy state|5 floating if-bound no-sync pflow|10 sloppy source-track global rule max-src-nodes max-src-states max-src-conn max-src-conn-rate overload flush scrub|5 max-mss min-ttl no-df|10 random-id",
                literal: "all any no-route self urpf-failed egress|5 unknown"
            },
            contains: [q.HASH_COMMENT_MODE, q.NUMBER_MODE, q.QUOTE_STRING_MODE, K, _]
        }
    }
    Jg4.exports = STz
})
// @from(Ln 280691, Col 4)
Pg4 = p(($ow, Mg4) => {
    function CTz(q) {
        let K = q.COMMENT("--", "$"),
            _ = "[a-zA-Z_][a-zA-Z_0-9$]*",
            z = "\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$",
            Y = "<<\\s*[a-zA-Z_][a-zA-Z_0-9$]*\\s*>>",
            A = "ABORT ALTER ANALYZE BEGIN CALL CHECKPOINT|10 CLOSE CLUSTER COMMENT COMMIT COPY CREATE DEALLOCATE DECLARE DELETE DISCARD DO DROP END EXECUTE EXPLAIN FETCH GRANT IMPORT INSERT LISTEN LOAD LOCK MOVE NOTIFY PREPARE REASSIGN|10 REFRESH REINDEX RELEASE RESET REVOKE ROLLBACK SAVEPOINT SECURITY SELECT SET SHOW START TRUNCATE UNLISTEN|10 UPDATE VACUUM|10 VALUES AGGREGATE COLLATION CONVERSION|10 DATABASE DEFAULT PRIVILEGES DOMAIN TRIGGER EXTENSION FOREIGN WRAPPER|10 TABLE FUNCTION GROUP LANGUAGE LARGE OBJECT MATERIALIZED VIEW OPERATOR CLASS FAMILY POLICY PUBLICATION|10 ROLE RULE SCHEMA SEQUENCE SERVER STATISTICS SUBSCRIPTION SYSTEM TABLESPACE CONFIGURATION DICTIONARY PARSER TEMPLATE TYPE USER MAPPING PREPARED ACCESS METHOD CAST AS TRANSFORM TRANSACTION OWNED TO INTO SESSION AUTHORIZATION INDEX PROCEDURE ASSERTION ALL ANALYSE AND ANY ARRAY ASC ASYMMETRIC|10 BOTH CASE CHECK COLLATE COLUMN CONCURRENTLY|10 CONSTRAINT CROSS DEFERRABLE RANGE DESC DISTINCT ELSE EXCEPT FOR FREEZE|10 FROM FULL HAVING ILIKE IN INITIALLY INNER INTERSECT IS ISNULL JOIN LATERAL LEADING LIKE LIMIT NATURAL NOT NOTNULL NULL OFFSET ON ONLY OR ORDER OUTER OVERLAPS PLACING PRIMARY REFERENCES RETURNING SIMILAR SOME SYMMETRIC TABLESAMPLE THEN TRAILING UNION UNIQUE USING VARIADIC|10 VERBOSE WHEN WHERE WINDOW WITH BY RETURNS INOUT OUT SETOF|10 IF STRICT CURRENT CONTINUE OWNER LOCATION OVER PARTITION WITHIN BETWEEN ESCAPE EXTERNAL INVOKER DEFINER WORK RENAME VERSION CONNECTION CONNECT TABLES TEMP TEMPORARY FUNCTIONS SEQUENCES TYPES SCHEMAS OPTION CASCADE RESTRICT ADD ADMIN EXISTS VALID VALIDATE ENABLE DISABLE REPLICA|10 ALWAYS PASSING COLUMNS PATH REF VALUE OVERRIDING IMMUTABLE STABLE VOLATILE BEFORE AFTER EACH ROW PROCEDURAL ROUTINE NO HANDLER VALIDATOR OPTIONS STORAGE OIDS|10 WITHOUT INHERIT DEPENDS CALLED INPUT LEAKPROOF|10 COST ROWS NOWAIT SEARCH UNTIL ENCRYPTED|10 PASSWORD CONFLICT|10 INSTEAD INHERITS CHARACTERISTICS WRITE CURSOR ALSO STATEMENT SHARE EXCLUSIVE INLINE ISOLATION REPEATABLE READ COMMITTED SERIALIZABLE UNCOMMITTED LOCAL GLOBAL SQL PROCEDURES RECURSIVE SNAPSHOT ROLLUP CUBE TRUSTED|10 INCLUDE FOLLOWING PRECEDING UNBOUNDED RANGE GROUPS UNENCRYPTED|10 SYSID FORMAT DELIMITER HEADER QUOTE ENCODING FILTER OFF FORCE_QUOTE FORCE_NOT_NULL FORCE_NULL COSTS BUFFERS TIMING SUMMARY DISABLE_PAGE_SKIPPING RESTART CYCLE GENERATED IDENTITY DEFERRED IMMEDIATE LEVEL LOGGED UNLOGGED OF NOTHING NONE EXCLUDE ATTRIBUTE USAGE ROUTINES TRUE FALSE NAN INFINITY ",
            O = "SUPERUSER NOSUPERUSER CREATEDB NOCREATEDB CREATEROLE NOCREATEROLE INHERIT NOINHERIT LOGIN NOLOGIN REPLICATION NOREPLICATION BYPASSRLS NOBYPASSRLS ",
            w = "ALIAS BEGIN CONSTANT DECLARE END EXCEPTION RETURN PERFORM|10 RAISE GET DIAGNOSTICS STACKED|10 FOREACH LOOP ELSIF EXIT WHILE REVERSE SLICE DEBUG LOG INFO NOTICE WARNING ASSERT OPEN ",
            $ = "BIGINT INT8 BIGSERIAL SERIAL8 BIT VARYING VARBIT BOOLEAN BOOL BOX BYTEA CHARACTER CHAR VARCHAR CIDR CIRCLE DATE DOUBLE PRECISION FLOAT8 FLOAT INET INTEGER INT INT4 INTERVAL JSON JSONB LINE LSEG|10 MACADDR MACADDR8 MONEY NUMERIC DEC DECIMAL PATH POINT POLYGON REAL FLOAT4 SMALLINT INT2 SMALLSERIAL|10 SERIAL2|10 SERIAL|10 SERIAL4|10 TEXT TIME ZONE TIMETZ|10 TIMESTAMP TIMESTAMPTZ|10 TSQUERY|10 TSVECTOR|10 TXID_SNAPSHOT|10 UUID XML NATIONAL NCHAR INT4RANGE|10 INT8RANGE|10 NUMRANGE|10 TSRANGE|10 TSTZRANGE|10 DATERANGE|10 ANYELEMENT ANYARRAY ANYNONARRAY ANYENUM ANYRANGE CSTRING INTERNAL RECORD PG_DDL_COMMAND VOID UNKNOWN OPAQUE REFCURSOR NAME OID REGPROC|10 REGPROCEDURE|10 REGOPER|10 REGOPERATOR|10 REGCLASS|10 REGTYPE|10 REGROLE|10 REGNAMESPACE|10 REGCONFIG|10 REGDICTIONARY|10 ",
            j = $.trim().split(" ").map(function(W) {
                return W.split("|")[0]
            }).join("|"),
            H = "CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER CURRENT_CATALOG|10 CURRENT_DATE LOCALTIME LOCALTIMESTAMP CURRENT_ROLE|10 CURRENT_SCHEMA|10 SESSION_USER PUBLIC ",
            J = "FOUND NEW OLD TG_NAME|10 TG_WHEN|10 TG_LEVEL|10 TG_OP|10 TG_RELID|10 TG_RELNAME|10 TG_TABLE_NAME|10 TG_TABLE_SCHEMA|10 TG_NARGS|10 TG_ARGV|10 TG_EVENT|10 TG_TAG|10 ROW_COUNT RESULT_OID|10 PG_CONTEXT|10 RETURNED_SQLSTATE COLUMN_NAME CONSTRAINT_NAME PG_DATATYPE_NAME|10 MESSAGE_TEXT TABLE_NAME SCHEMA_NAME PG_EXCEPTION_DETAIL|10 PG_EXCEPTION_HINT|10 PG_EXCEPTION_CONTEXT|10 ",
            X = "SQLSTATE SQLERRM|10 SUCCESSFUL_COMPLETION WARNING DYNAMIC_RESULT_SETS_RETURNED IMPLICIT_ZERO_BIT_PADDING NULL_VALUE_ELIMINATED_IN_SET_FUNCTION PRIVILEGE_NOT_GRANTED PRIVILEGE_NOT_REVOKED STRING_DATA_RIGHT_TRUNCATION DEPRECATED_FEATURE NO_DATA NO_ADDITIONAL_DYNAMIC_RESULT_SETS_RETURNED SQL_STATEMENT_NOT_YET_COMPLETE CONNECTION_EXCEPTION CONNECTION_DOES_NOT_EXIST CONNECTION_FAILURE SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION TRANSACTION_RESOLUTION_UNKNOWN PROTOCOL_VIOLATION TRIGGERED_ACTION_EXCEPTION FEATURE_NOT_SUPPORTED INVALID_TRANSACTION_INITIATION LOCATOR_EXCEPTION INVALID_LOCATOR_SPECIFICATION INVALID_GRANTOR INVALID_GRANT_OPERATION INVALID_ROLE_SPECIFICATION DIAGNOSTICS_EXCEPTION STACKED_DIAGNOSTICS_ACCESSED_WITHOUT_ACTIVE_HANDLER CASE_NOT_FOUND CARDINALITY_VIOLATION DATA_EXCEPTION ARRAY_SUBSCRIPT_ERROR CHARACTER_NOT_IN_REPERTOIRE DATETIME_FIELD_OVERFLOW DIVISION_BY_ZERO ERROR_IN_ASSIGNMENT ESCAPE_CHARACTER_CONFLICT INDICATOR_OVERFLOW INTERVAL_FIELD_OVERFLOW INVALID_ARGUMENT_FOR_LOGARITHM INVALID_ARGUMENT_FOR_NTILE_FUNCTION INVALID_ARGUMENT_FOR_NTH_VALUE_FUNCTION INVALID_ARGUMENT_FOR_POWER_FUNCTION INVALID_ARGUMENT_FOR_WIDTH_BUCKET_FUNCTION INVALID_CHARACTER_VALUE_FOR_CAST INVALID_DATETIME_FORMAT INVALID_ESCAPE_CHARACTER INVALID_ESCAPE_OCTET INVALID_ESCAPE_SEQUENCE NONSTANDARD_USE_OF_ESCAPE_CHARACTER INVALID_INDICATOR_PARAMETER_VALUE INVALID_PARAMETER_VALUE INVALID_REGULAR_EXPRESSION INVALID_ROW_COUNT_IN_LIMIT_CLAUSE INVALID_ROW_COUNT_IN_RESULT_OFFSET_CLAUSE INVALID_TABLESAMPLE_ARGUMENT INVALID_TABLESAMPLE_REPEAT INVALID_TIME_ZONE_DISPLACEMENT_VALUE INVALID_USE_OF_ESCAPE_CHARACTER MOST_SPECIFIC_TYPE_MISMATCH NULL_VALUE_NOT_ALLOWED NULL_VALUE_NO_INDICATOR_PARAMETER NUMERIC_VALUE_OUT_OF_RANGE SEQUENCE_GENERATOR_LIMIT_EXCEEDED STRING_DATA_LENGTH_MISMATCH STRING_DATA_RIGHT_TRUNCATION SUBSTRING_ERROR TRIM_ERROR UNTERMINATED_C_STRING ZERO_LENGTH_CHARACTER_STRING FLOATING_POINT_EXCEPTION INVALID_TEXT_REPRESENTATION INVALID_BINARY_REPRESENTATION BAD_COPY_FILE_FORMAT UNTRANSLATABLE_CHARACTER NOT_AN_XML_DOCUMENT INVALID_XML_DOCUMENT INVALID_XML_CONTENT INVALID_XML_COMMENT INVALID_XML_PROCESSING_INSTRUCTION INTEGRITY_CONSTRAINT_VIOLATION RESTRICT_VIOLATION NOT_NULL_VIOLATION FOREIGN_KEY_VIOLATION UNIQUE_VIOLATION CHECK_VIOLATION EXCLUSION_VIOLATION INVALID_CURSOR_STATE INVALID_TRANSACTION_STATE ACTIVE_SQL_TRANSACTION BRANCH_TRANSACTION_ALREADY_ACTIVE HELD_CURSOR_REQUIRES_SAME_ISOLATION_LEVEL INAPPROPRIATE_ACCESS_MODE_FOR_BRANCH_TRANSACTION INAPPROPRIATE_ISOLATION_LEVEL_FOR_BRANCH_TRANSACTION NO_ACTIVE_SQL_TRANSACTION_FOR_BRANCH_TRANSACTION READ_ONLY_SQL_TRANSACTION SCHEMA_AND_DATA_STATEMENT_MIXING_NOT_SUPPORTED NO_ACTIVE_SQL_TRANSACTION IN_FAILED_SQL_TRANSACTION IDLE_IN_TRANSACTION_SESSION_TIMEOUT INVALID_SQL_STATEMENT_NAME TRIGGERED_DATA_CHANGE_VIOLATION INVALID_AUTHORIZATION_SPECIFICATION INVALID_PASSWORD DEPENDENT_PRIVILEGE_DESCRIPTORS_STILL_EXIST DEPENDENT_OBJECTS_STILL_EXIST INVALID_TRANSACTION_TERMINATION SQL_ROUTINE_EXCEPTION FUNCTION_EXECUTED_NO_RETURN_STATEMENT MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED INVALID_CURSOR_NAME EXTERNAL_ROUTINE_EXCEPTION CONTAINING_SQL_NOT_PERMITTED MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED EXTERNAL_ROUTINE_INVOCATION_EXCEPTION INVALID_SQLSTATE_RETURNED NULL_VALUE_NOT_ALLOWED TRIGGER_PROTOCOL_VIOLATED SRF_PROTOCOL_VIOLATED EVENT_TRIGGER_PROTOCOL_VIOLATED SAVEPOINT_EXCEPTION INVALID_SAVEPOINT_SPECIFICATION INVALID_CATALOG_NAME INVALID_SCHEMA_NAME TRANSACTION_ROLLBACK TRANSACTION_INTEGRITY_CONSTRAINT_VIOLATION SERIALIZATION_FAILURE STATEMENT_COMPLETION_UNKNOWN DEADLOCK_DETECTED SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION SYNTAX_ERROR INSUFFICIENT_PRIVILEGE CANNOT_COERCE GROUPING_ERROR WINDOWING_ERROR INVALID_RECURSION INVALID_FOREIGN_KEY INVALID_NAME NAME_TOO_LONG RESERVED_NAME DATATYPE_MISMATCH INDETERMINATE_DATATYPE COLLATION_MISMATCH INDETERMINATE_COLLATION WRONG_OBJECT_TYPE GENERATED_ALWAYS UNDEFINED_COLUMN UNDEFINED_FUNCTION UNDEFINED_TABLE UNDEFINED_PARAMETER UNDEFINED_OBJECT DUPLICATE_COLUMN DUPLICATE_CURSOR DUPLICATE_DATABASE DUPLICATE_FUNCTION DUPLICATE_PREPARED_STATEMENT DUPLICATE_SCHEMA DUPLICATE_TABLE DUPLICATE_ALIAS DUPLICATE_OBJECT AMBIGUOUS_COLUMN AMBIGUOUS_FUNCTION AMBIGUOUS_PARAMETER AMBIGUOUS_ALIAS INVALID_COLUMN_REFERENCE INVALID_COLUMN_DEFINITION INVALID_CURSOR_DEFINITION INVALID_DATABASE_DEFINITION INVALID_FUNCTION_DEFINITION INVALID_PREPARED_STATEMENT_DEFINITION INVALID_SCHEMA_DEFINITION INVALID_TABLE_DEFINITION INVALID_OBJECT_DEFINITION WITH_CHECK_OPTION_VIOLATION INSUFFICIENT_RESOURCES DISK_FULL OUT_OF_MEMORY TOO_MANY_CONNECTIONS CONFIGURATION_LIMIT_EXCEEDED PROGRAM_LIMIT_EXCEEDED STATEMENT_TOO_COMPLEX TOO_MANY_COLUMNS TOO_MANY_ARGUMENTS OBJECT_NOT_IN_PREREQUISITE_STATE OBJECT_IN_USE CANT_CHANGE_RUNTIME_PARAM LOCK_NOT_AVAILABLE OPERATOR_INTERVENTION QUERY_CANCELED ADMIN_SHUTDOWN CRASH_SHUTDOWN CANNOT_CONNECT_NOW DATABASE_DROPPED SYSTEM_ERROR IO_ERROR UNDEFINED_FILE DUPLICATE_FILE SNAPSHOT_TOO_OLD CONFIG_FILE_ERROR LOCK_FILE_EXISTS FDW_ERROR FDW_COLUMN_NAME_NOT_FOUND FDW_DYNAMIC_PARAMETER_VALUE_NEEDED FDW_FUNCTION_SEQUENCE_ERROR FDW_INCONSISTENT_DESCRIPTOR_INFORMATION FDW_INVALID_ATTRIBUTE_VALUE FDW_INVALID_COLUMN_NAME FDW_INVALID_COLUMN_NUMBER FDW_INVALID_DATA_TYPE FDW_INVALID_DATA_TYPE_DESCRIPTORS FDW_INVALID_DESCRIPTOR_FIELD_IDENTIFIER FDW_INVALID_HANDLE FDW_INVALID_OPTION_INDEX FDW_INVALID_OPTION_NAME FDW_INVALID_STRING_LENGTH_OR_BUFFER_LENGTH FDW_INVALID_STRING_FORMAT FDW_INVALID_USE_OF_NULL_POINTER FDW_TOO_MANY_HANDLES FDW_OUT_OF_MEMORY FDW_NO_SCHEMAS FDW_OPTION_NAME_NOT_FOUND FDW_REPLY_HANDLE FDW_SCHEMA_NOT_FOUND FDW_TABLE_NOT_FOUND FDW_UNABLE_TO_CREATE_EXECUTION FDW_UNABLE_TO_CREATE_REPLY FDW_UNABLE_TO_ESTABLISH_CONNECTION PLPGSQL_ERROR RAISE_EXCEPTION NO_DATA_FOUND TOO_MANY_ROWS ASSERT_FAILURE INTERNAL_ERROR DATA_CORRUPTED INDEX_CORRUPTED ",
            P = "ARRAY_AGG AVG BIT_AND BIT_OR BOOL_AND BOOL_OR COUNT EVERY JSON_AGG JSONB_AGG JSON_OBJECT_AGG JSONB_OBJECT_AGG MAX MIN MODE STRING_AGG SUM XMLAGG CORR COVAR_POP COVAR_SAMP REGR_AVGX REGR_AVGY REGR_COUNT REGR_INTERCEPT REGR_R2 REGR_SLOPE REGR_SXX REGR_SXY REGR_SYY STDDEV STDDEV_POP STDDEV_SAMP VARIANCE VAR_POP VAR_SAMP PERCENTILE_CONT PERCENTILE_DISC ROW_NUMBER RANK DENSE_RANK PERCENT_RANK CUME_DIST NTILE LAG LEAD FIRST_VALUE LAST_VALUE NTH_VALUE NUM_NONNULLS NUM_NULLS ABS CBRT CEIL CEILING DEGREES DIV EXP FLOOR LN LOG MOD PI POWER RADIANS ROUND SCALE SIGN SQRT TRUNC WIDTH_BUCKET RANDOM SETSEED ACOS ACOSD ASIN ASIND ATAN ATAND ATAN2 ATAN2D COS COSD COT COTD SIN SIND TAN TAND BIT_LENGTH CHAR_LENGTH CHARACTER_LENGTH LOWER OCTET_LENGTH OVERLAY POSITION SUBSTRING TREAT TRIM UPPER ASCII BTRIM CHR CONCAT CONCAT_WS CONVERT CONVERT_FROM CONVERT_TO DECODE ENCODE INITCAP LEFT LENGTH LPAD LTRIM MD5 PARSE_IDENT PG_CLIENT_ENCODING QUOTE_IDENT|10 QUOTE_LITERAL|10 QUOTE_NULLABLE|10 REGEXP_MATCH REGEXP_MATCHES REGEXP_REPLACE REGEXP_SPLIT_TO_ARRAY REGEXP_SPLIT_TO_TABLE REPEAT REPLACE REVERSE RIGHT RPAD RTRIM SPLIT_PART STRPOS SUBSTR TO_ASCII TO_HEX TRANSLATE OCTET_LENGTH GET_BIT GET_BYTE SET_BIT SET_BYTE TO_CHAR TO_DATE TO_NUMBER TO_TIMESTAMP AGE CLOCK_TIMESTAMP|10 DATE_PART DATE_TRUNC ISFINITE JUSTIFY_DAYS JUSTIFY_HOURS JUSTIFY_INTERVAL MAKE_DATE MAKE_INTERVAL|10 MAKE_TIME MAKE_TIMESTAMP|10 MAKE_TIMESTAMPTZ|10 NOW STATEMENT_TIMESTAMP|10 TIMEOFDAY TRANSACTION_TIMESTAMP|10 ENUM_FIRST ENUM_LAST ENUM_RANGE AREA CENTER DIAMETER HEIGHT ISCLOSED ISOPEN NPOINTS PCLOSE POPEN RADIUS WIDTH BOX BOUND_BOX CIRCLE LINE LSEG PATH POLYGON ABBREV BROADCAST HOST HOSTMASK MASKLEN NETMASK NETWORK SET_MASKLEN TEXT INET_SAME_FAMILY INET_MERGE MACADDR8_SET7BIT ARRAY_TO_TSVECTOR GET_CURRENT_TS_CONFIG NUMNODE PLAINTO_TSQUERY PHRASETO_TSQUERY WEBSEARCH_TO_TSQUERY QUERYTREE SETWEIGHT STRIP TO_TSQUERY TO_TSVECTOR JSON_TO_TSVECTOR JSONB_TO_TSVECTOR TS_DELETE TS_FILTER TS_HEADLINE TS_RANK TS_RANK_CD TS_REWRITE TSQUERY_PHRASE TSVECTOR_TO_ARRAY TSVECTOR_UPDATE_TRIGGER TSVECTOR_UPDATE_TRIGGER_COLUMN XMLCOMMENT XMLCONCAT XMLELEMENT XMLFOREST XMLPI XMLROOT XMLEXISTS XML_IS_WELL_FORMED XML_IS_WELL_FORMED_DOCUMENT XML_IS_WELL_FORMED_CONTENT XPATH XPATH_EXISTS XMLTABLE XMLNAMESPACES TABLE_TO_XML TABLE_TO_XMLSCHEMA TABLE_TO_XML_AND_XMLSCHEMA QUERY_TO_XML QUERY_TO_XMLSCHEMA QUERY_TO_XML_AND_XMLSCHEMA CURSOR_TO_XML CURSOR_TO_XMLSCHEMA SCHEMA_TO_XML SCHEMA_TO_XMLSCHEMA SCHEMA_TO_XML_AND_XMLSCHEMA DATABASE_TO_XML DATABASE_TO_XMLSCHEMA DATABASE_TO_XML_AND_XMLSCHEMA XMLATTRIBUTES TO_JSON TO_JSONB ARRAY_TO_JSON ROW_TO_JSON JSON_BUILD_ARRAY JSONB_BUILD_ARRAY JSON_BUILD_OBJECT JSONB_BUILD_OBJECT JSON_OBJECT JSONB_OBJECT JSON_ARRAY_LENGTH JSONB_ARRAY_LENGTH JSON_EACH JSONB_EACH JSON_EACH_TEXT JSONB_EACH_TEXT JSON_EXTRACT_PATH JSONB_EXTRACT_PATH JSON_OBJECT_KEYS JSONB_OBJECT_KEYS JSON_POPULATE_RECORD JSONB_POPULATE_RECORD JSON_POPULATE_RECORDSET JSONB_POPULATE_RECORDSET JSON_ARRAY_ELEMENTS JSONB_ARRAY_ELEMENTS JSON_ARRAY_ELEMENTS_TEXT JSONB_ARRAY_ELEMENTS_TEXT JSON_TYPEOF JSONB_TYPEOF JSON_TO_RECORD JSONB_TO_RECORD JSON_TO_RECORDSET JSONB_TO_RECORDSET JSON_STRIP_NULLS JSONB_STRIP_NULLS JSONB_SET JSONB_INSERT JSONB_PRETTY CURRVAL LASTVAL NEXTVAL SETVAL COALESCE NULLIF GREATEST LEAST ARRAY_APPEND ARRAY_CAT ARRAY_NDIMS ARRAY_DIMS ARRAY_FILL ARRAY_LENGTH ARRAY_LOWER ARRAY_POSITION ARRAY_POSITIONS ARRAY_PREPEND ARRAY_REMOVE ARRAY_REPLACE ARRAY_TO_STRING ARRAY_UPPER CARDINALITY STRING_TO_ARRAY UNNEST ISEMPTY LOWER_INC UPPER_INC LOWER_INF UPPER_INF RANGE_MERGE GENERATE_SERIES GENERATE_SUBSCRIPTS CURRENT_DATABASE CURRENT_QUERY CURRENT_SCHEMA|10 CURRENT_SCHEMAS|10 INET_CLIENT_ADDR INET_CLIENT_PORT INET_SERVER_ADDR INET_SERVER_PORT ROW_SECURITY_ACTIVE FORMAT_TYPE TO_REGCLASS TO_REGPROC TO_REGPROCEDURE TO_REGOPER TO_REGOPERATOR TO_REGTYPE TO_REGNAMESPACE TO_REGROLE COL_DESCRIPTION OBJ_DESCRIPTION SHOBJ_DESCRIPTION TXID_CURRENT TXID_CURRENT_IF_ASSIGNED TXID_CURRENT_SNAPSHOT TXID_SNAPSHOT_XIP TXID_SNAPSHOT_XMAX TXID_SNAPSHOT_XMIN TXID_VISIBLE_IN_SNAPSHOT TXID_STATUS CURRENT_SETTING SET_CONFIG BRIN_SUMMARIZE_NEW_VALUES BRIN_SUMMARIZE_RANGE BRIN_DESUMMARIZE_RANGE GIN_CLEAN_PENDING_LIST SUPPRESS_REDUNDANT_UPDATES_TRIGGER LO_FROM_BYTEA LO_PUT LO_GET LO_CREAT LO_CREATE LO_UNLINK LO_IMPORT LO_EXPORT LOREAD LOWRITE GROUPING CAST ".trim().split(" ").map(function(W) {
                return W.split("|")[0]
            }).join("|");
        return {
            name: "PostgreSQL",
            aliases: ["postgres", "postgresql"],
            case_insensitive: !0,
            keywords: {
                keyword: A + w + O,
                built_in: H + J + X
            },
            illegal: /:==|\W\s*\(\*|(^|\s)\$[a-z]|\{\{|[a-z]:\s*$|\.\.\.|TO:|DO:/,
            contains: [{
                className: "keyword",
                variants: [{
                    begin: /\bTEXT\s*SEARCH\b/
                }, {
                    begin: /\b(PRIMARY|FOREIGN|FOR(\s+NO)?)\s+KEY\b/
                }, {
                    begin: /\bPARALLEL\s+(UNSAFE|RESTRICTED|SAFE)\b/
                }, {
                    begin: /\bSTORAGE\s+(PLAIN|EXTERNAL|EXTENDED|MAIN)\b/
                }, {
                    begin: /\bMATCH\s+(FULL|PARTIAL|SIMPLE)\b/
                }, {
                    begin: /\bNULLS\s+(FIRST|LAST)\b/
                }, {
                    begin: /\bEVENT\s+TRIGGER\b/
                }, {
                    begin: /\b(MAPPING|OR)\s+REPLACE\b/
                }, {
                    begin: /\b(FROM|TO)\s+(PROGRAM|STDIN|STDOUT)\b/
                }, {
                    begin: /\b(SHARE|EXCLUSIVE)\s+MODE\b/
                }, {
                    begin: /\b(LEFT|RIGHT)\s+(OUTER\s+)?JOIN\b/
                }, {
                    begin: /\b(FETCH|MOVE)\s+(NEXT|PRIOR|FIRST|LAST|ABSOLUTE|RELATIVE|FORWARD|BACKWARD)\b/
                }, {
                    begin: /\bPRESERVE\s+ROWS\b/
                }, {
                    begin: /\bDISCARD\s+PLANS\b/
                }, {
                    begin: /\bREFERENCING\s+(OLD|NEW)\b/
                }, {
                    begin: /\bSKIP\s+LOCKED\b/
                }, {
                    begin: /\bGROUPING\s+SETS\b/
                }, {
                    begin: /\b(BINARY|INSENSITIVE|SCROLL|NO\s+SCROLL)\s+(CURSOR|FOR)\b/
                }, {
                    begin: /\b(WITH|WITHOUT)\s+HOLD\b/
                }, {
                    begin: /\bWITH\s+(CASCADED|LOCAL)\s+CHECK\s+OPTION\b/
                }, {
                    begin: /\bEXCLUDE\s+(TIES|NO\s+OTHERS)\b/
                }, {
                    begin: /\bFORMAT\s+(TEXT|XML|JSON|YAML)\b/
                }, {
                    begin: /\bSET\s+((SESSION|LOCAL)\s+)?NAMES\b/
                }, {
                    begin: /\bIS\s+(NOT\s+)?UNKNOWN\b/
                }, {
                    begin: /\bSECURITY\s+LABEL\b/
                }, {
                    begin: /\bSTANDALONE\s+(YES|NO|NO\s+VALUE)\b/
                }, {
                    begin: /\bWITH\s+(NO\s+)?DATA\b/
                }, {
                    begin: /\b(FOREIGN|SET)\s+DATA\b/
                }, {
                    begin: /\bSET\s+(CATALOG|CONSTRAINTS)\b/
                }, {
                    begin: /\b(WITH|FOR)\s+ORDINALITY\b/
                }, {
                    begin: /\bIS\s+(NOT\s+)?DOCUMENT\b/
                }, {
                    begin: /\bXML\s+OPTION\s+(DOCUMENT|CONTENT)\b/
                }, {
                    begin: /\b(STRIP|PRESERVE)\s+WHITESPACE\b/
                }, {
                    begin: /\bNO\s+(ACTION|MAXVALUE|MINVALUE)\b/
                }, {
                    begin: /\bPARTITION\s+BY\s+(RANGE|LIST|HASH)\b/
                }, {
                    begin: /\bAT\s+TIME\s+ZONE\b/
                }, {
                    begin: /\bGRANTED\s+BY\b/
                }, {
                    begin: /\bRETURN\s+(QUERY|NEXT)\b/
                }, {
                    begin: /\b(ATTACH|DETACH)\s+PARTITION\b/
                }, {
                    begin: /\bFORCE\s+ROW\s+LEVEL\s+SECURITY\b/
                }, {
                    begin: /\b(INCLUDING|EXCLUDING)\s+(COMMENTS|CONSTRAINTS|DEFAULTS|IDENTITY|INDEXES|STATISTICS|STORAGE|ALL)\b/
                }, {
                    begin: /\bAS\s+(ASSIGNMENT|IMPLICIT|PERMISSIVE|RESTRICTIVE|ENUM|RANGE)\b/
                }]
            }, {
                begin: /\b(FORMAT|FAMILY|VERSION)\s*\(/
            }, {
                begin: /\bINCLUDE\s*\(/,
                keywords: "INCLUDE"
            }, {
                begin: /\bRANGE(?!\s*(BETWEEN|UNBOUNDED|CURRENT|[-0-9]+))/
            }, {
                begin: /\b(VERSION|OWNER|TEMPLATE|TABLESPACE|CONNECTION\s+LIMIT|PROCEDURE|RESTRICT|JOIN|PARSER|COPY|START|END|COLLATION|INPUT|ANALYZE|STORAGE|LIKE|DEFAULT|DELIMITER|ENCODING|COLUMN|CONSTRAINT|TABLE|SCHEMA)\s*=/
            }, {
                begin: /\b(PG_\w+?|HAS_[A-Z_]+_PRIVILEGE)\b/,
                relevance: 10
            }, {
                begin: /\bEXTRACT\s*\(/,
                end: /\bFROM\b/,
                returnEnd: !0,
                keywords: {
                    type: "CENTURY DAY DECADE DOW DOY EPOCH HOUR ISODOW ISOYEAR MICROSECONDS MILLENNIUM MILLISECONDS MINUTE MONTH QUARTER SECOND TIMEZONE TIMEZONE_HOUR TIMEZONE_MINUTE WEEK YEAR"
                }
            }, {
                begin: /\b(XMLELEMENT|XMLPI)\s*\(\s*NAME/,
                keywords: {
                    keyword: "NAME"
                }
            }, {
                begin: /\b(XMLPARSE|XMLSERIALIZE)\s*\(\s*(DOCUMENT|CONTENT)/,
                keywords: {
                    keyword: "DOCUMENT CONTENT"
                }
            }, {
                beginKeywords: "CACHE INCREMENT MAXVALUE MINVALUE",
                end: q.C_NUMBER_RE,
                returnEnd: !0,
                keywords: "BY CACHE INCREMENT MAXVALUE MINVALUE"
            }, {
                className: "type",
                begin: /\b(WITH|WITHOUT)\s+TIME\s+ZONE\b/
            }, {
                className: "type",
                begin: /\bINTERVAL\s+(YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)(\s+TO\s+(MONTH|HOUR|MINUTE|SECOND))?\b/
            }, {
                begin: /\bRETURNS\s+(LANGUAGE_HANDLER|TRIGGER|EVENT_TRIGGER|FDW_HANDLER|INDEX_AM_HANDLER|TSM_HANDLER)\b/,
                keywords: {
                    keyword: "RETURNS",
                    type: "LANGUAGE_HANDLER TRIGGER EVENT_TRIGGER FDW_HANDLER INDEX_AM_HANDLER TSM_HANDLER"
                }
            }, {
                begin: "\\b(" + P + ")\\s*\\("
            }, {
                begin: "\\.(" + j + ")\\b"
            }, {
                begin: "\\b(" + j + ")\\s+PATH\\b",
                keywords: {
                    keyword: "PATH",
                    type: $.replace("PATH ", "")
                }
            }, {
                className: "type",
                begin: "\\b(" + j + ")\\b"
            }, {
                className: "string",
                begin: "'",
                end: "'",
                contains: [{
                    begin: "''"
                }]
            }, {
                className: "string",
                begin: "(e|E|u&|U&)'",
                end: "'",
                contains: [{
                    begin: "\\\\."
                }],
                relevance: 10
            }, q.END_SAME_AS_BEGIN({
                begin: "\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$",
                end: "\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$",
                contains: [{
                    subLanguage: ["pgsql", "perl", "python", "tcl", "r", "lua", "java", "php", "ruby", "bash", "scheme", "xml", "json"],
                    endsWithParent: !0
                }]
            }), {
                begin: '"',
                end: '"',
                contains: [{
                    begin: '""'
                }]
            }, q.C_NUMBER_MODE, q.C_BLOCK_COMMENT_MODE, K, {
                className: "meta",
                variants: [{
                    begin: "%(ROW)?TYPE",
                    relevance: 10
                }, {
                    begin: "\\$\\d+"
                }, {
                    begin: "^#\\w",
                    end: "$"
                }]
            }, {
                className: "symbol",
                begin: Y,
                relevance: 10
            }]
        }
    }
    Mg4.exports = CTz
})
// @from(Ln 280913, Col 4)
Dg4 = p((jow, Wg4) => {
    function bTz(q) {
        let K = {
                className: "variable",
                begin: "\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*" + "(?![A-Za-z0-9])(?![$])"
            },
            _ = {
                className: "meta",
                variants: [{
                    begin: /<\?php/,
                    relevance: 10
                }, {
                    begin: /<\?[=]?/
                }, {
                    begin: /\?>/
                }]
            },
            z = {
                className: "subst",
                variants: [{
                    begin: /\$\w+/
                }, {
                    begin: /\{\$/,
                    end: /\}/
                }]
            },
            Y = q.inherit(q.APOS_STRING_MODE, {
                illegal: null
            }),
            A = q.inherit(q.QUOTE_STRING_MODE, {
                illegal: null,
                contains: q.QUOTE_STRING_MODE.contains.concat(z)
            }),
            O = q.END_SAME_AS_BEGIN({
                begin: /<<<[ \t]*(\w+)\n/,
                end: /[ \t]*(\w+)\b/,
                contains: q.QUOTE_STRING_MODE.contains.concat(z)
            }),
            w = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE, _],
                variants: [q.inherit(Y, {
                    begin: "b'",
                    end: "'"
                }), q.inherit(A, {
                    begin: 'b"',
                    end: '"'
                }), A, Y, O]
            },
            $ = {
                className: "number",
                variants: [{
                    begin: "\\b0b[01]+(?:_[01]+)*\\b"
                }, {
                    begin: "\\b0o[0-7]+(?:_[0-7]+)*\\b"
                }, {
                    begin: "\\b0x[\\da-f]+(?:_[\\da-f]+)*\\b"
                }, {
                    begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:e[+-]?\\d+)?"
                }],
                relevance: 0
            },
            j = {
                keyword: "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile enum eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list match|0 mixed new object or private protected public real return string switch throw trait try unset use var void while xor yield",
                literal: "false null true",
                built_in: "Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException UnhandledMatchError ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Stringable Throwable Traversable WeakReference WeakMap Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"
            };
        return {
            aliases: ["php3", "php4", "php5", "php6", "php7", "php8"],
            case_insensitive: !0,
            keywords: j,
            contains: [q.HASH_COMMENT_MODE, q.COMMENT("//", "$", {
                contains: [_]
            }), q.COMMENT("/\\*", "\\*/", {
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+"
                }]
            }), q.COMMENT("__halt_compiler.+?;", !1, {
                endsWithParent: !0,
                keywords: "__halt_compiler"
            }), _, {
                className: "keyword",
                begin: /\$this\b/
            }, K, {
                begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            }, {
                className: "function",
                relevance: 0,
                beginKeywords: "fn function",
                end: /[;{]/,
                excludeEnd: !0,
                illegal: "[$%\\[]",
                contains: [{
                    beginKeywords: "use"
                }, q.UNDERSCORE_TITLE_MODE, {
                    begin: "=>",
                    endsParent: !0
                }, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: j,
                    contains: ["self", K, q.C_BLOCK_COMMENT_MODE, w, $]
                }]
            }, {
                className: "class",
                variants: [{
                    beginKeywords: "enum",
                    illegal: /[($"]/
                }, {
                    beginKeywords: "class interface trait",
                    illegal: /[:($"]/
                }],
                relevance: 0,
                end: /\{/,
                excludeEnd: !0,
                contains: [{
                    beginKeywords: "extends implements"
                }, q.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "namespace",
                relevance: 0,
                end: ";",
                illegal: /[.']/,
                contains: [q.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "use",
                relevance: 0,
                end: ";",
                contains: [q.UNDERSCORE_TITLE_MODE]
            }, w, $]
        }
    }
    Wg4.exports = bTz
})
// @from(Ln 281051, Col 4)
fg4 = p((How, Zg4) => {
    function ITz(q) {
        return {
            name: "PHP template",
            subLanguage: "xml",
            contains: [{
                begin: /<\?(php|=)?/,
                end: /\?>/,
                subLanguage: "php",
                contains: [{
                    begin: "/\\*",
                    end: "\\*/",
                    skip: !0
                }, {
                    begin: 'b"',
                    end: '"',
                    skip: !0
                }, {
                    begin: "b'",
                    end: "'",
                    skip: !0
                }, q.inherit(q.APOS_STRING_MODE, {
                    illegal: null,
                    className: null,
                    contains: null,
                    skip: !0
                }), q.inherit(q.QUOTE_STRING_MODE, {
                    illegal: null,
                    className: null,
                    contains: null,
                    skip: !0
                })]
            }]
        }
    }
    Zg4.exports = ITz
})
// @from(Ln 281088, Col 4)
vg4 = p((Jow, Gg4) => {
    function xTz(q) {
        return {
            name: "Plain text",
            aliases: ["text", "txt"],
            disableAutodetect: !0
        }
    }
    Gg4.exports = xTz
})
// @from(Ln 281098, Col 4)
Vg4 = p((Xow, Tg4) => {
    function uTz(q) {
        let K = {
                keyword: "actor addressof and as be break class compile_error compile_intrinsic consume continue delegate digestof do else elseif embed end error for fun if ifdef in interface is isnt lambda let match new not object or primitive recover repeat return struct then trait try type until use var where while with xor",
                meta: "iso val tag trn box ref",
                literal: "this false true"
            },
            _ = {
                className: "string",
                begin: '"""',
                end: '"""',
                relevance: 10
            },
            z = {
                className: "string",
                begin: '"',
                end: '"',
                contains: [q.BACKSLASH_ESCAPE]
            },
            Y = {
                className: "string",
                begin: "'",
                end: "'",
                contains: [q.BACKSLASH_ESCAPE],
                relevance: 0
            },
            A = {
                className: "type",
                begin: "\\b_?[A-Z][\\w]*",
                relevance: 0
            },
            O = {
                begin: q.IDENT_RE + "'",
                relevance: 0
            };
        return {
            name: "Pony",
            keywords: K,
            contains: [A, _, z, Y, O, {
                className: "number",
                begin: "(-?)(\\b0[xX][a-fA-F0-9]+|\\b0[bB][01]+|(\\b\\d+(_\\d+)?(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
                relevance: 0
            }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
        }
    }
    Tg4.exports = uTz
})
// @from(Ln 281145, Col 4)
Ng4 = p((Mow, kg4) => {
    function mTz(q) {
        let K = ["string", "char", "byte", "int", "long", "bool", "decimal", "single", "double", "DateTime", "xml", "array", "hashtable", "void"],
            _ = "Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|Limit|Merge|Mount|Out|Publish|Restore|Save|Sync|Unpublish|Update|Approve|Assert|Build|Complete|Confirm|Deny|Deploy|Disable|Enable|Install|Invoke|Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|Unprotect|Use|ForEach|Sort|Tee|Where",
            z = "-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|-split|-wildcard|-xor",
            Y = {
                $pattern: /-?[A-z\.\-]+\b/,
                keyword: "if else foreach return do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch hidden static parameter",
                built_in: "ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write"
            },
            A = /\w[\w\d]*((-)[\w\d]+)*/,
            O = {
                begin: "`[\\s\\S]",
                relevance: 0
            },
            w = {
                className: "variable",
                variants: [{
                    begin: /\$\B/
                }, {
                    className: "keyword",
                    begin: /\$this/
                }, {
                    begin: /\$[\w\d][\w\d_:]*/
                }]
            },
            $ = {
                className: "literal",
                begin: /\$(null|true|false)\b/
            },
            j = {
                className: "string",
                variants: [{
                    begin: /"/,
                    end: /"/
                }, {
                    begin: /@"/,
                    end: /^"@/
                }],
                contains: [O, w, {
                    className: "variable",
                    begin: /\$[A-z]/,
                    end: /[^A-z]/
                }]
            },
            H = {
                className: "string",
                variants: [{
                    begin: /'/,
                    end: /'/
                }, {
                    begin: /@'/,
                    end: /^'@/
                }]
            },
            J = {
                className: "doctag",
                variants: [{
                    begin: /\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/
                }, {
                    begin: /\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/
                }]
            },
            X = q.inherit(q.COMMENT(null, null), {
                variants: [{
                    begin: /#/,
                    end: /$/
                }, {
                    begin: /<#/,
                    end: /#>/
                }],
                contains: [J]
            }),
            M = {
                className: "built_in",
                variants: [{
                    begin: "(".concat(_, ")+(-)[\\w\\d]+")
                }]
            },
            P = {
                className: "class",
                beginKeywords: "class enum",
                end: /\s*[{]/,
                excludeEnd: !0,
                relevance: 0,
                contains: [q.TITLE_MODE]
            },
            W = {
                className: "function",
                begin: /function\s+/,
                end: /\s*\{|$/,
                excludeEnd: !0,
                returnBegin: !0,
                relevance: 0,
                contains: [{
                    begin: "function",
                    relevance: 0,
                    className: "keyword"
                }, {
                    className: "title",
                    begin: A,
                    relevance: 0
                }, {
                    begin: /\(/,
                    end: /\)/,
                    className: "params",
                    relevance: 0,
                    contains: [w]
                }]
            },
            D = {
                begin: /using\s/,
                end: /$/,
                returnBegin: !0,
                contains: [j, H, {
                    className: "keyword",
                    begin: /(using|assembly|command|module|namespace|type)/
                }]
            },
            Z = {
                variants: [{
                    className: "operator",
                    begin: "(".concat(z, ")\\b")
                }, {
                    className: "literal",
                    begin: /(-)[\w\d]+/,
                    relevance: 0
                }]
            },
            G = {
                className: "selector-tag",
                begin: /@\B/,
                relevance: 0
            },
            f = {
                className: "function",
                begin: /\[.*\]\s*[\w]+[ ]??\(/,
                end: /$/,
                returnBegin: !0,
                relevance: 0,
                contains: [{
                    className: "keyword",
                    begin: "(".concat(Y.keyword.toString().replace(/\s/g, "|"), ")\\b"),
                    endsParent: !0,
                    relevance: 0
                }, q.inherit(q.TITLE_MODE, {
                    endsParent: !0
                })]
            },
            v = [f, X, O, q.NUMBER_MODE, j, H, M, w, $, G],
            V = {
                begin: /\[/,
                end: /\]/,
                excludeBegin: !0,
                excludeEnd: !0,
                relevance: 0,
                contains: [].concat("self", v, {
                    begin: "(" + K.join("|") + ")",
                    className: "built_in",
                    relevance: 0
                }, {
                    className: "type",
                    begin: /[\.\w\d]+/,
                    relevance: 0
                })
            };
        return f.contains.unshift(V), {
            name: "PowerShell",
            aliases: ["ps", "ps1"],
            case_insensitive: !0,
            keywords: Y,
            contains: v.concat(P, W, D, Z, V)
        }
    }
    kg4.exports = mTz
})
// @from(Ln 281321, Col 4)
yg4 = p((Pow, Eg4) => {
    function BTz(q) {
        return {
            name: "Processing",
            keywords: {
                keyword: "BufferedReader PVector PFont PImage PGraphics HashMap boolean byte char color double float int long String Array FloatDict FloatList IntDict IntList JSONArray JSONObject Object StringDict StringList Table TableRow XML false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private",
                literal: "P2D P3D HALF_PI PI QUARTER_PI TAU TWO_PI",
                title: "setup draw",
                built_in: "displayHeight displayWidth mouseY mouseX mousePressed pmouseX pmouseY key keyCode pixels focused frameCount frameRate height width size createGraphics beginDraw createShape loadShape PShape arc ellipse line point quad rect triangle bezier bezierDetail bezierPoint bezierTangent curve curveDetail curvePoint curveTangent curveTightness shape shapeMode beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight mouseClicked mouseDragged mouseMoved mousePressed mouseReleased mouseWheel keyPressed keyPressedkeyReleased keyTyped print println save saveFrame day hour millis minute month second year background clear colorMode fill noFill noStroke stroke alpha blue brightness color green hue lerpColor red saturation modelX modelY modelZ screenX screenY screenZ ambient emissive shininess specular add createImage beginCamera camera endCamera frustum ortho perspective printCamera printProjection cursor frameRate noCursor exit loop noLoop popStyle pushStyle redraw binary boolean byte char float hex int str unbinary unhex join match matchAll nf nfc nfp nfs split splitTokens trim append arrayCopy concat expand reverse shorten sort splice subset box sphere sphereDetail createInput createReader loadBytes loadJSONArray loadJSONObject loadStrings loadTable loadXML open parseXML saveTable selectFolder selectInput beginRaw beginRecord createOutput createWriter endRaw endRecord PrintWritersaveBytes saveJSONArray saveJSONObject saveStream saveStrings saveXML selectOutput popMatrix printMatrix pushMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate ambientLight directionalLight lightFalloff lights lightSpecular noLights normal pointLight spotLight image imageMode loadImage noTint requestImage tint texture textureMode textureWrap blend copy filter get loadPixels set updatePixels blendMode loadShader PShaderresetShader shader createFont loadFont text textFont textAlign textLeading textMode textSize textWidth textAscent textDescent abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt acos asin atan atan2 cos degrees radians sin tan noise noiseDetail noiseSeed random randomGaussian randomSeed"
            },
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE]
        }
    }
    Eg4.exports = BTz
})
// @from(Ln 281336, Col 4)
hg4 = p((Wow, Lg4) => {
    function pTz(q) {
        return {
            name: "Python profiler",
            contains: [q.C_NUMBER_MODE, {
                begin: "[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}",
                end: ":",
                excludeEnd: !0
            }, {
                begin: "(ncalls|tottime|cumtime)",
                end: "$",
                keywords: "ncalls tottime|10 cumtime|10 filename",
                relevance: 10
            }, {
                begin: "function calls",
                end: "$",
                contains: [q.C_NUMBER_MODE],
                relevance: 10
            }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, {
                className: "string",
                begin: "\\(",
                end: "\\)$",
                excludeBegin: !0,
                excludeEnd: !0,
                relevance: 0
            }]
        }
    }
    Lg4.exports = pTz
})
// @from(Ln 281366, Col 4)
Sg4 = p((Dow, Rg4) => {
    function FTz(q) {
        let K = {
                begin: /[a-z][A-Za-z0-9_]*/,
                relevance: 0
            },
            _ = {
                className: "symbol",
                variants: [{
                    begin: /[A-Z][a-zA-Z0-9_]*/
                }, {
                    begin: /_[A-Za-z0-9_]*/
                }],
                relevance: 0
            },
            z = {
                begin: /\(/,
                end: /\)/,
                relevance: 0
            },
            Y = {
                begin: /\[/,
                end: /\]/
            },
            A = {
                className: "comment",
                begin: /%/,
                end: /$/,
                contains: [q.PHRASAL_WORDS_MODE]
            },
            O = {
                className: "string",
                begin: /`/,
                end: /`/,
                contains: [q.BACKSLASH_ESCAPE]
            },
            w = {
                className: "string",
                begin: /0'(\\'|.)/
            },
            $ = {
                className: "string",
                begin: /0'\\s/
            },
            H = [K, _, z, {
                begin: /:-/
            }, Y, A, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, O, w, $, q.C_NUMBER_MODE];
        return z.contains = H, Y.contains = H, {
            name: "Prolog",
            contains: H.concat([{
                begin: /\.$/
            }])
        }
    }
    Rg4.exports = FTz
})
// @from(Ln 281422, Col 4)
bg4 = p((Zow, Cg4) => {
    function gTz(q) {
        var K = "[ \\t\\f]*",
            _ = "[ \\t\\f]+",
            z = K + "[:=]" + K,
            Y = _,
            A = "(" + z + "|" + Y + ")",
            O = "([^\\\\\\W:= \\t\\f\\n]|\\\\.)+",
            w = "([^\\\\:= \\t\\f\\n]|\\\\.)+",
            $ = {
                end: A,
                relevance: 0,
                starts: {
                    className: "string",
                    end: /$/,
                    relevance: 0,
                    contains: [{
                        begin: "\\\\\\\\"
                    }, {
                        begin: "\\\\\\n"
                    }]
                }
            };
        return {
            name: ".properties",
            case_insensitive: !0,
            illegal: /\S/,
            contains: [q.COMMENT("^\\s*[!#]", "$"), {
                returnBegin: !0,
                variants: [{
                    begin: O + z,
                    relevance: 1
                }, {
                    begin: O + Y,
                    relevance: 0
                }],
                contains: [{
                    className: "attr",
                    begin: O,
                    endsParent: !0,
                    relevance: 0
                }],
                starts: $
            }, {
                begin: w + A,
                returnBegin: !0,
                relevance: 0,
                contains: [{
                    className: "meta",
                    begin: w,
                    endsParent: !0,
                    relevance: 0
                }],
                starts: $
            }, {
                className: "attr",
                relevance: 0,
                begin: w + K + "$"
            }]
        }
    }
    Cg4.exports = gTz
})
// @from(Ln 281485, Col 4)
xg4 = p((fow, Ig4) => {
    function UTz(q) {
        return {
            name: "Protocol Buffers",
            keywords: {
                keyword: "package import option optional required repeated group oneof",
                built_in: "double float int32 int64 uint32 uint64 sint32 sint64 fixed32 fixed64 sfixed32 sfixed64 bool string bytes",
                literal: "true false"
            },
            contains: [q.QUOTE_STRING_MODE, q.NUMBER_MODE, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "class",
                beginKeywords: "message enum service",
                end: /\{/,
                illegal: /\n/,
                contains: [q.inherit(q.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0
                    }
                })]
            }, {
                className: "function",
                beginKeywords: "rpc",
                end: /[{;]/,
                excludeEnd: !0,
                keywords: "rpc returns"
            }, {
                begin: /^\s*[A-Z_]+(?=\s*=[^\n]+;$)/
            }]
        }
    }
    Ig4.exports = UTz
})
// @from(Ln 281518, Col 4)
mg4 = p((Gow, ug4) => {
    function QTz(q) {
        let K = {
                keyword: "and case default else elsif false if in import enherits node or true undef unless main settings $string ",
                literal: "alias audit before loglevel noop require subscribe tag owner ensure group mode name|0 changes context force incl lens load_path onlyif provider returns root show_diff type_check en_address ip_address realname command environment hour monute month monthday special target weekday creates cwd ogoutput refresh refreshonly tries try_sleep umask backup checksum content ctime force ignore links mtime purge recurse recurselimit replace selinux_ignore_defaults selrange selrole seltype seluser source souirce_permissions sourceselect validate_cmd validate_replacement allowdupe attribute_membership auth_membership forcelocal gid ia_load_module members system host_aliases ip allowed_trunk_vlans description device_url duplex encapsulation etherchannel native_vlan speed principals allow_root auth_class auth_type authenticate_user k_of_n mechanisms rule session_owner shared options device fstype enable hasrestart directory present absent link atboot blockdevice device dump pass remounts poller_tag use message withpath adminfile allow_virtual allowcdrom category configfiles flavor install_options instance package_settings platform responsefile status uninstall_options vendor unless_system_user unless_uid binary control flags hasstatus manifest pattern restart running start stop allowdupe auths expiry gid groups home iterations key_membership keys managehome membership password password_max_age password_min_age profile_membership profiles project purge_ssh_keys role_membership roles salt shell uid baseurl cost descr enabled enablegroups exclude failovermethod gpgcheck gpgkey http_caching include includepkgs keepalive metadata_expire metalink mirrorlist priority protect proxy proxy_password proxy_username repo_gpgcheck s3_enabled skip_if_unavailable sslcacert sslclientcert sslclientkey sslverify mounted",
                built_in: "architecture augeasversion blockdevices boardmanufacturer boardproductname boardserialnumber cfkey dhcp_servers domain ec2_ ec2_userdata facterversion filesystems ldom fqdn gid hardwareisa hardwaremodel hostname id|0 interfaces ipaddress ipaddress_ ipaddress6 ipaddress6_ iphostnumber is_virtual kernel kernelmajversion kernelrelease kernelversion kernelrelease kernelversion lsbdistcodename lsbdistdescription lsbdistid lsbdistrelease lsbmajdistrelease lsbminordistrelease lsbrelease macaddress macaddress_ macosx_buildversion macosx_productname macosx_productversion macosx_productverson_major macosx_productversion_minor manufacturer memoryfree memorysize netmask metmask_ network_ operatingsystem operatingsystemmajrelease operatingsystemrelease osfamily partitions path physicalprocessorcount processor processorcount productname ps puppetversion rubysitedir rubyversion selinux selinux_config_mode selinux_config_policy selinux_current_mode selinux_current_mode selinux_enforced selinux_policyversion serialnumber sp_ sshdsakey sshecdsakey sshrsakey swapencrypted swapfree swapsize timezone type uniqueid uptime uptime_days uptime_hours uptime_seconds uuid virtual vlans xendomains zfs_version zonenae zones zpool_version"
            },
            _ = q.COMMENT("#", "$"),
            z = "([A-Za-z_]|::)(\\w|::)*",
            Y = q.inherit(q.TITLE_MODE, {
                begin: "([A-Za-z_]|::)(\\w|::)*"
            }),
            A = {
                className: "variable",
                begin: "\\$([A-Za-z_]|::)(\\w|::)*"
            },
            O = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE, A],
                variants: [{
                    begin: /'/,
                    end: /'/
                }, {
                    begin: /"/,
                    end: /"/
                }]
            };
        return {
            name: "Puppet",
            aliases: ["pp"],
            contains: [_, A, O, {
                beginKeywords: "class",
                end: "\\{|;",
                illegal: /=/,
                contains: [Y, _]
            }, {
                beginKeywords: "define",
                end: /\{/,
                contains: [{
                    className: "section",
                    begin: q.IDENT_RE,
                    endsParent: !0
                }]
            }, {
                begin: q.IDENT_RE + "\\s+\\{",
                returnBegin: !0,
                end: /\S/,
                contains: [{
                    className: "keyword",
                    begin: q.IDENT_RE
                }, {
                    begin: /\{/,
                    end: /\}/,
                    keywords: K,
                    relevance: 0,
                    contains: [O, _, {
                        begin: "[a-zA-Z_]+\\s*=>",
                        returnBegin: !0,
                        end: "=>",
                        contains: [{
                            className: "attr",
                            begin: q.IDENT_RE
                        }]
                    }, {
                        className: "number",
                        begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
                        relevance: 0
                    }, A]
                }],
                relevance: 0
            }]
        }
    }
    ug4.exports = QTz
})
// @from(Ln 281593, Col 4)
pg4 = p((vow, Bg4) => {
    function dTz(q) {
        let K = {
                className: "string",
                begin: '(~)?"',
                end: '"',
                illegal: "\\n"
            },
            _ = {
                className: "symbol",
                begin: "#[a-zA-Z_]\\w*\\$?"
            };
        return {
            name: "PureBASIC",
            aliases: ["pb", "pbi"],
            keywords: "Align And Array As Break CallDebugger Case CompilerCase CompilerDefault CompilerElse CompilerElseIf CompilerEndIf CompilerEndSelect CompilerError CompilerIf CompilerSelect CompilerWarning Continue Data DataSection Debug DebugLevel Declare DeclareC DeclareCDLL DeclareDLL DeclareModule Default Define Dim DisableASM DisableDebugger DisableExplicit Else ElseIf EnableASM EnableDebugger EnableExplicit End EndDataSection EndDeclareModule EndEnumeration EndIf EndImport EndInterface EndMacro EndModule EndProcedure EndSelect EndStructure EndStructureUnion EndWith Enumeration EnumerationBinary Extends FakeReturn For ForEach ForEver Global Gosub Goto If Import ImportC IncludeBinary IncludeFile IncludePath Interface List Macro MacroExpandedCount Map Module NewList NewMap Next Not Or Procedure ProcedureC ProcedureCDLL ProcedureDLL ProcedureReturn Protected Prototype PrototypeC ReDim Read Repeat Restore Return Runtime Select Shared Static Step Structure StructureUnion Swap Threaded To UndefineMacro Until Until  UnuseModule UseModule Wend While With XIncludeFile XOr",
            contains: [q.COMMENT(";", "$", {
                relevance: 0
            }), {
                className: "function",
                begin: "\\b(Procedure|Declare)(C|CDLL|DLL)?\\b",
                end: "\\(",
                excludeEnd: !0,
                returnBegin: !0,
                contains: [{
                    className: "keyword",
                    begin: "(Procedure|Declare)(C|CDLL|DLL)?",
                    excludeEnd: !0
                }, {
                    className: "type",
                    begin: "\\.\\w*"
                }, q.UNDERSCORE_TITLE_MODE]
            }, K, _]
        }
    }
    Bg4.exports = dTz
})
// @from(Ln 281630, Col 4)
gg4 = p((Tow, Fg4) => {
    function cTz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function lTz(q) {
        return nTz("(?=", q, ")")
    }

    function nTz(...q) {
        return q.map((_) => cTz(_)).join("")
    }

    function iTz(q) {
        let A = {
                $pattern: /[A-Za-z]\w+|__\w+__/,
                keyword: ["and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal|10", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"],
                built_in: ["__import__", "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"],
                literal: ["__debug__", "Ellipsis", "False", "None", "NotImplemented", "True"],
                type: ["Any", "Callable", "Coroutine", "Dict", "List", "Literal", "Generic", "Optional", "Sequence", "Set", "Tuple", "Type", "Union"]
            },
            O = {
                className: "meta",
                begin: /^(>>>|\.\.\.) /
            },
            w = {
                className: "subst",
                begin: /\{/,
                end: /\}/,
                keywords: A,
                illegal: /#/
            },
            $ = {
                begin: /\{\{/,
                relevance: 0
            },
            j = {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE],
                variants: [{
                    begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
                    end: /'''/,
                    contains: [q.BACKSLASH_ESCAPE, O],
                    relevance: 10
                }, {
                    begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
                    end: /"""/,
                    contains: [q.BACKSLASH_ESCAPE, O],
                    relevance: 10
                }, {
                    begin: /([fF][rR]|[rR][fF]|[fF])'''/,
                    end: /'''/,
                    contains: [q.BACKSLASH_ESCAPE, O, $, w]
                }, {
                    begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                    end: /"""/,
                    contains: [q.BACKSLASH_ESCAPE, O, $, w]
                }, {
                    begin: /([uU]|[rR])'/,
                    end: /'/,
                    relevance: 10
                }, {
                    begin: /([uU]|[rR])"/,
                    end: /"/,
                    relevance: 10
                }, {
                    begin: /([bB]|[bB][rR]|[rR][bB])'/,
                    end: /'/
                }, {
                    begin: /([bB]|[bB][rR]|[rR][bB])"/,
                    end: /"/
                }, {
                    begin: /([fF][rR]|[rR][fF]|[fF])'/,
                    end: /'/,
                    contains: [q.BACKSLASH_ESCAPE, $, w]
                }, {
                    begin: /([fF][rR]|[rR][fF]|[fF])"/,
                    end: /"/,
                    contains: [q.BACKSLASH_ESCAPE, $, w]
                }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
            },
            H = "[0-9](_?[0-9])*",
            J = "(\\b([0-9](_?[0-9])*))?\\.([0-9](_?[0-9])*)|\\b([0-9](_?[0-9])*)\\.",
            X = {
                className: "number",
                relevance: 0,
                variants: [{
                    begin: "(\\b([0-9](_?[0-9])*)|((\\b([0-9](_?[0-9])*))?\\.([0-9](_?[0-9])*)|\\b([0-9](_?[0-9])*)\\.))[eE][+-]?([0-9](_?[0-9])*)[jJ]?\\b"
                }, {
                    begin: "((\\b([0-9](_?[0-9])*))?\\.([0-9](_?[0-9])*)|\\b([0-9](_?[0-9])*)\\.)[jJ]?"
                }, {
                    begin: "\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b"
                }, {
                    begin: "\\b0[bB](_?[01])+[lL]?\\b"
                }, {
                    begin: "\\b0[oO](_?[0-7])+[lL]?\\b"
                }, {
                    begin: "\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b"
                }, {
                    begin: "\\b([0-9](_?[0-9])*)[jJ]\\b"
                }]
            },
            M = {
                className: "comment",
                begin: lTz(/# type:/),
                end: /$/,
                keywords: A,
                contains: [{
                    begin: /# type:/
                }, {
                    begin: /#/,
                    end: /\b\B/,
                    endsWithParent: !0
                }]
            },
            P = {
                className: "params",
                variants: [{
                    className: "",
                    begin: /\(\s*\)/,
                    skip: !0
                }, {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: A,
                    contains: ["self", O, X, j, q.HASH_COMMENT_MODE]
                }]
            };
        return w.contains = [j, X, O], {
            name: "Python",
            aliases: ["py", "gyp", "ipython"],
            keywords: A,
            illegal: /(<\/|->|\?)|=>/,
            contains: [O, X, {
                begin: /\bself\b/
            }, {
                beginKeywords: "if",
                relevance: 0
            }, j, M, q.HASH_COMMENT_MODE, {
                variants: [{
                    className: "function",
                    beginKeywords: "def"
                }, {
                    className: "class",
                    beginKeywords: "class"
                }],
                end: /:/,
                illegal: /[${=;\n,]/,
                contains: [q.UNDERSCORE_TITLE_MODE, P, {
                    begin: /->/,
                    endsWithParent: !0,
                    keywords: A
                }]
            }, {
                className: "meta",
                begin: /^[\t ]*@/,
                end: /(?=#)|$/,
                contains: [X, P, j]
            }]
        }
    }
    Fg4.exports = iTz
})
// @from(Ln 281797, Col 4)
Qg4 = p((Vow, Ug4) => {
    function rTz(q) {
        return {
            aliases: ["pycon"],
            contains: [{
                className: "meta",
                starts: {
                    end: / |$/,
                    starts: {
                        end: "$",
                        subLanguage: "python"
                    }
                },
                variants: [{
                    begin: /^>>>(?=[ ]|$)/
                }, {
                    begin: /^\.\.\.(?=[ ]|$)/
                }]
            }]
        }
    }
    Ug4.exports = rTz
})
// @from(Ln 281820, Col 4)
cg4 = p((kow, dg4) => {
    function oTz(q) {
        return {
            name: "Q",
            aliases: ["k", "kdb"],
            keywords: {
                $pattern: /(`?)[A-Za-z0-9_]+\b/,
                keyword: "do while select delete by update from",
                literal: "0b 1b",
                built_in: "neg not null string reciprocal floor ceiling signum mod xbar xlog and or each scan over prior mmu lsq inv md5 ltime gtime count first var dev med cov cor all any rand sums prds mins maxs fills deltas ratios avgs differ prev next rank reverse iasc idesc asc desc msum mcount mavg mdev xrank mmin mmax xprev rotate distinct group where flip type key til get value attr cut set upsert raze union inter except cross sv vs sublist enlist read0 read1 hopen hclose hdel hsym hcount peach system ltrim rtrim trim lower upper ssr view tables views cols xcols keys xkey xcol xasc xdesc fkeys meta lj aj aj0 ij pj asof uj ww wj wj1 fby xgroup ungroup ej save load rsave rload show csv parse eval min max avg wavg wsum sin cos tan sum",
                type: "`float `double int `timestamp `timespan `datetime `time `boolean `symbol `char `byte `short `long `real `month `date `minute `second `guid"
            },
            contains: [q.C_LINE_COMMENT_MODE, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE]
        }
    }
    dg4.exports = oTz
})
// @from(Ln 281837, Col 4)
ng4 = p((Now, lg4) => {
    function aTz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function sTz(...q) {
        return q.map((_) => aTz(_)).join("")
    }

    function tTz(q) {
        let K = {
                keyword: "in of on if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await import",
                literal: "true false null undefined NaN Infinity",
                built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Behavior bool color coordinate date double enumeration font geocircle georectangle geoshape int list matrix4x4 parent point quaternion real rect size string url variant vector2d vector3d vector4d Promise"
            },
            _ = "[a-zA-Z_][a-zA-Z0-9\\._]*",
            z = {
                className: "keyword",
                begin: "\\bproperty\\b",
                starts: {
                    className: "string",
                    end: "(:|=|;|,|//|/\\*|$)",
                    returnEnd: !0
                }
            },
            Y = {
                className: "keyword",
                begin: "\\bsignal\\b",
                starts: {
                    className: "string",
                    end: "(\\(|:|=|;|,|//|/\\*|$)",
                    returnEnd: !0
                }
            },
            A = {
                className: "attribute",
                begin: "\\bid\\s*:",
                starts: {
                    className: "string",
                    end: "[a-zA-Z_][a-zA-Z0-9\\._]*",
                    returnEnd: !1
                }
            },
            O = {
                begin: "[a-zA-Z_][a-zA-Z0-9\\._]*\\s*:",
                returnBegin: !0,
                contains: [{
                    className: "attribute",
                    begin: "[a-zA-Z_][a-zA-Z0-9\\._]*",
                    end: "\\s*:",
                    excludeEnd: !0,
                    relevance: 0
                }],
                relevance: 0
            },
            w = {
                begin: sTz("[a-zA-Z_][a-zA-Z0-9\\._]*", /\s*\{/),
                end: /\{/,
                returnBegin: !0,
                relevance: 0,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[a-zA-Z_][a-zA-Z0-9\\._]*"
                })]
            };
        return {
            name: "QML",
            aliases: ["qt"],
            case_insensitive: !1,
            keywords: K,
            contains: [{
                className: "meta",
                begin: /^\s*['"]use (strict|asm)['"]/
            }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, {
                className: "string",
                begin: "`",
                end: "`",
                contains: [q.BACKSLASH_ESCAPE, {
                    className: "subst",
                    begin: "\\$\\{",
                    end: "\\}"
                }]
            }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "number",
                variants: [{
                    begin: "\\b(0[bB][01]+)"
                }, {
                    begin: "\\b(0[oO][0-7]+)"
                }, {
                    begin: q.C_NUMBER_RE
                }],
                relevance: 0
            }, {
                begin: "(" + q.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.REGEXP_MODE, {
                    begin: /</,
                    end: />\s*[);\]]/,
                    relevance: 0,
                    subLanguage: "xml"
                }],
                relevance: 0
            }, Y, z, {
                className: "function",
                beginKeywords: "function",
                end: /\{/,
                excludeEnd: !0,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: /[A-Za-z$_][0-9A-Za-z$_]*/
                }), {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
                }],
                illegal: /\[|%/
            }, {
                begin: "\\." + q.IDENT_RE,
                relevance: 0
            }, A, O, w],
            illegal: /#/
        }
    }
    lg4.exports = tTz
})
// @from(Ln 281965, Col 4)
rg4 = p((Eow, ig4) => {
    function eTz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function qVz(q) {
        return Oo1("(?=", q, ")")
    }

    function Oo1(...q) {
        return q.map((_) => eTz(_)).join("")
    }

    function KVz(q) {
        let K = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
            _ = /[a-zA-Z][a-zA-Z_0-9]*/;
        return {
            name: "R",
            illegal: /->/,
            keywords: {
                $pattern: K,
                keyword: "function if in break next repeat else for while",
                literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
                built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
            },
            compilerExtensions: [(z, Y) => {
                if (!z.beforeMatch) return;
                if (z.starts) throw Error("beforeMatch cannot be used with starts");
                let A = Object.assign({}, z);
                Object.keys(z).forEach((O) => {
                    delete z[O]
                }), z.begin = Oo1(A.beforeMatch, qVz(A.begin)), z.starts = {
                    relevance: 0,
                    contains: [Object.assign(A, {
                        endsParent: !0
                    })]
                }, z.relevance = 0, delete A.beforeMatch
            }],
            contains: [q.COMMENT(/#'/, /$/, {
                contains: [{
                    className: "doctag",
                    begin: "@examples",
                    starts: {
                        contains: [{
                            begin: /\n/
                        }, {
                            begin: /#'\s*(?=@[a-zA-Z]+)/,
                            endsParent: !0
                        }, {
                            begin: /#'/,
                            end: /$/,
                            excludeBegin: !0
                        }]
                    }
                }, {
                    className: "doctag",
                    begin: "@param",
                    end: /$/,
                    contains: [{
                        className: "variable",
                        variants: [{
                            begin: K
                        }, {
                            begin: /`(?:\\.|[^`\\])+`/
                        }],
                        endsParent: !0
                    }]
                }, {
                    className: "doctag",
                    begin: /@[a-zA-Z]+/
                }, {
                    className: "meta-keyword",
                    begin: /\\[a-zA-Z]+/
                }]
            }), q.HASH_COMMENT_MODE, {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE],
                variants: [q.END_SAME_AS_BEGIN({
                    begin: /[rR]"(-*)\(/,
                    end: /\)(-*)"/
                }), q.END_SAME_AS_BEGIN({
                    begin: /[rR]"(-*)\{/,
                    end: /\}(-*)"/
                }), q.END_SAME_AS_BEGIN({
                    begin: /[rR]"(-*)\[/,
                    end: /\](-*)"/
                }), q.END_SAME_AS_BEGIN({
                    begin: /[rR]'(-*)\(/,
                    end: /\)(-*)'/
                }), q.END_SAME_AS_BEGIN({
                    begin: /[rR]'(-*)\{/,
                    end: /\}(-*)'/
                }), q.END_SAME_AS_BEGIN({
                    begin: /[rR]'(-*)\[/,
                    end: /\](-*)'/
                }), {
                    begin: '"',
                    end: '"',
                    relevance: 0
                }, {
                    begin: "'",
                    end: "'",
                    relevance: 0
                }]
            }, {
                className: "number",
                relevance: 0,
                beforeMatch: /([^a-zA-Z0-9._])/,
                variants: [{
                    match: /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/
                }, {
                    match: /0[xX][0-9a-fA-F]+([pP][+-]?\d+)?[Li]?/
                }, {
                    match: /(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[Li]?/
                }]
            }, {
                begin: "%",
                end: "%"
            }, {
                begin: Oo1(_, "\\s+<-\\s+")
            }, {
                begin: "`",
                end: "`",
                contains: [{
                    begin: /\\./
                }]
            }]
        }
    }
    ig4.exports = KVz
})
// @from(Ln 282098, Col 4)
ag4 = p((yow, og4) => {
    function _Vz(q) {
        function K(V) {
            return V.map(function(k) {
                return k.split("").map(function(N) {
                    return "\\" + N
                }).join("")
            }).join("|")
        }
        let _ = "~?[a-z$_][0-9a-zA-Z$_]*",
            z = "`?[A-Z$_][0-9a-zA-Z$_]*",
            Y = "'?[a-z$_][0-9a-z$_]*",
            A = "\\s*:\\s*[a-z$_][0-9a-z$_]*(\\(\\s*(" + Y + "\\s*(," + Y + "\\s*)*)?\\))?",
            O = _ + "(" + A + "){0,2}",
            w = "(" + K(["||", "++", "**", "+.", "*", "/", "*.", "/.", "..."]) + "|\\|>|&&|==|===)",
            $ = "\\s+" + w + "\\s+",
            j = {
                keyword: "and as asr assert begin class constraint do done downto else end exception external for fun function functor if in include inherit initializer land lazy let lor lsl lsr lxor match method mod module mutable new nonrec object of open or private rec sig struct then to try type val virtual when while with",
                built_in: "array bool bytes char exn|5 float int int32 int64 list lazy_t|5 nativeint|5 ref string unit ",
                literal: "true false"
            },
            H = "\\b(0[xX][a-fA-F0-9_]+[Lln]?|0[oO][0-7_]+[Lln]?|0[bB][01_]+[Lln]?|[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)",
            J = {
                className: "number",
                relevance: 0,
                variants: [{
                    begin: H
                }, {
                    begin: "\\(-" + H + "\\)"
                }]
            },
            X = {
                className: "operator",
                relevance: 0,
                begin: w
            },
            M = [{
                className: "identifier",
                relevance: 0,
                begin: _
            }, X, J],
            P = [q.QUOTE_STRING_MODE, X, {
                className: "module",
                begin: "\\b" + z,
                returnBegin: !0,
                end: ".",
                contains: [{
                    className: "identifier",
                    begin: z,
                    relevance: 0
                }]
            }],
            W = [{
                className: "module",
                begin: "\\b" + z,
                returnBegin: !0,
                end: ".",
                relevance: 0,
                contains: [{
                    className: "identifier",
                    begin: z,
                    relevance: 0
                }]
            }],
            D = {
                begin: _,
                end: "(,|\\n|\\))",
                relevance: 0,
                contains: [X, {
                    className: "typing",
                    begin: ":",
                    end: "(,|\\n)",
                    returnBegin: !0,
                    relevance: 0,
                    contains: W
                }]
            },
            Z = {
                className: "function",
                relevance: 0,
                keywords: j,
                variants: [{
                    begin: "\\s(\\(\\.?.*?\\)|" + _ + ")\\s*=>",
                    end: "\\s*=>",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: _
                        }, {
                            begin: O
                        }, {
                            begin: /\(\s*\)/
                        }]
                    }]
                }, {
                    begin: "\\s\\(\\.?[^;\\|]*\\)\\s*=>",
                    end: "\\s=>",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [{
                        className: "params",
                        relevance: 0,
                        variants: [D]
                    }]
                }, {
                    begin: "\\(\\.\\s" + _ + "\\)\\s*=>"
                }]
            };
        P.push(Z);
        let G = {
                className: "constructor",
                begin: z + "\\(",
                end: "\\)",
                illegal: "\\n",
                keywords: j,
                contains: [q.QUOTE_STRING_MODE, X, {
                    className: "params",
                    begin: "\\b" + _
                }]
            },
            f = {
                className: "pattern-match",
                begin: "\\|",
                returnBegin: !0,
                keywords: j,
                end: "=>",
                relevance: 0,
                contains: [G, X, {
                    relevance: 0,
                    className: "constructor",
                    begin: z
                }]
            },
            v = {
                className: "module-access",
                keywords: j,
                returnBegin: !0,
                variants: [{
                    begin: "\\b(" + z + "\\.)+" + _
                }, {
                    begin: "\\b(" + z + "\\.)+\\(",
                    end: "\\)",
                    returnBegin: !0,
                    contains: [Z, {
                        begin: "\\(",
                        end: "\\)",
                        skip: !0
                    }].concat(P)
                }, {
                    begin: "\\b(" + z + "\\.)+\\{",
                    end: /\}/
                }],
                contains: P
            };
        return W.push(v), {
            name: "ReasonML",
            aliases: ["re"],
            keywords: j,
            illegal: "(:-|:=|\\$\\{|\\+=)",
            contains: [q.COMMENT("/\\*", "\\*/", {
                illegal: "^(#,\\/\\/)"
            }), {
                className: "character",
                begin: "'(\\\\[^']+|[^'])'",
                illegal: "\\n",
                relevance: 0
            }, q.QUOTE_STRING_MODE, {
                className: "literal",
                begin: "\\(\\)",
                relevance: 0
            }, {
                className: "literal",
                begin: "\\[\\|",
                end: "\\|\\]",
                relevance: 0,
                contains: M
            }, {
                className: "literal",
                begin: "\\[",
                end: "\\]",
                relevance: 0,
                contains: M
            }, G, {
                className: "operator",
                begin: $,
                illegal: "-->",
                relevance: 0
            }, J, q.C_LINE_COMMENT_MODE, f, Z, {
                className: "module-def",
                begin: "\\bmodule\\s+" + _ + "\\s+" + z + "\\s+=\\s+\\{",
                end: /\}/,
                returnBegin: !0,
                keywords: j,
                relevance: 0,
                contains: [{
                    className: "module",
                    relevance: 0,
                    begin: z
                }, {
                    begin: /\{/,
                    end: /\}/,
                    skip: !0
                }].concat(P)
            }, v]
        }
    }
    og4.exports = _Vz
})
// @from(Ln 282308, Col 4)
tg4 = p((Low, sg4) => {
    function zVz(q) {
        return {
            name: "RenderMan RIB",
            keywords: "ArchiveRecord AreaLightSource Atmosphere Attribute AttributeBegin AttributeEnd Basis Begin Blobby Bound Clipping ClippingPlane Color ColorSamples ConcatTransform Cone CoordinateSystem CoordSysTransform CropWindow Curves Cylinder DepthOfField Detail DetailRange Disk Displacement Display End ErrorHandler Exposure Exterior Format FrameAspectRatio FrameBegin FrameEnd GeneralPolygon GeometricApproximation Geometry Hider Hyperboloid Identity Illuminate Imager Interior LightSource MakeCubeFaceEnvironment MakeLatLongEnvironment MakeShadow MakeTexture Matte MotionBegin MotionEnd NuPatch ObjectBegin ObjectEnd ObjectInstance Opacity Option Orientation Paraboloid Patch PatchMesh Perspective PixelFilter PixelSamples PixelVariance Points PointsGeneralPolygons PointsPolygons Polygon Procedural Projection Quantize ReadArchive RelativeDetail ReverseOrientation Rotate Scale ScreenWindow ShadingInterpolation ShadingRate Shutter Sides Skew SolidBegin SolidEnd Sphere SubdivisionMesh Surface TextureCoordinates Torus Transform TransformBegin TransformEnd TransformPoints Translate TrimCurve WorldBegin WorldEnd",
            illegal: "</",
            contains: [q.HASH_COMMENT_MODE, q.C_NUMBER_MODE, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
        }
    }
    sg4.exports = zVz
})
// @from(Ln 282319, Col 4)
qU4 = p((how, eg4) => {
    function YVz(q) {
        let _ = {
            className: "attribute",
            begin: /[a-zA-Z-_]+/,
            end: /\s*:/,
            excludeEnd: !0,
            starts: {
                end: ";",
                relevance: 0,
                contains: [{
                    className: "variable",
                    begin: /\.[a-zA-Z-_]+/
                }, {
                    className: "keyword",
                    begin: /\(optional\)/
                }]
            }
        };
        return {
            name: "Roboconf",
            aliases: ["graph", "instances"],
            case_insensitive: !0,
            keywords: "import",
            contains: [{
                begin: "^facet [a-zA-Z-_][^\\n{]+\\{",
                end: /\}/,
                keywords: "facet",
                contains: [_, q.HASH_COMMENT_MODE]
            }, {
                begin: "^\\s*instance of [a-zA-Z-_][^\\n{]+\\{",
                end: /\}/,
                keywords: "name count channels instance-data instance-state instance of",
                illegal: /\S/,
                contains: ["self", _, q.HASH_COMMENT_MODE]
            }, {
                begin: "^[a-zA-Z-_][^\\n{]+\\{",
                end: /\}/,
                contains: [_, q.HASH_COMMENT_MODE]
            }, q.HASH_COMMENT_MODE]
        }
    }
    eg4.exports = YVz
})
// @from(Ln 282363, Col 4)
_U4 = p((Row, KU4) => {
    function AVz(q) {
        let O = {
                className: "variable",
                variants: [{
                    begin: /\$[\w\d#@][\w\d_]*/
                }, {
                    begin: /\$\{(.*?)\}/
                }]
            },
            w = {
                className: "string",
                begin: /"/,
                end: /"/,
                contains: [q.BACKSLASH_ESCAPE, O, {
                    className: "variable",
                    begin: /\$\(/,
                    end: /\)/,
                    contains: [q.BACKSLASH_ESCAPE]
                }]
            },
            $ = {
                className: "string",
                begin: /'/,
                end: /'/
            };
        return {
            name: "Microtik RouterOS script",
            aliases: ["mikrotik"],
            case_insensitive: !0,
            keywords: {
                $pattern: /:?[\w-]+/,
                literal: "true false yes no nothing nil null",
                keyword: "foreach do while for if from to step else on-error and or not in :" + "foreach do while for if from to step else on-error and or not in".split(" ").join(" :") + " :" + "global local beep delay put len typeof pick log time set find environment terminal error execute parse resolve toarray tobool toid toip toip6 tonum tostr totime".split(" ").join(" :")
            },
            contains: [{
                variants: [{
                    begin: /\/\*/,
                    end: /\*\//
                }, {
                    begin: /\/\//,
                    end: /$/
                }, {
                    begin: /<\//,
                    end: />/
                }],
                illegal: /./
            }, q.COMMENT("^#", "$"), w, $, O, {
                begin: /[\w-]+=([^\s{}[\]()>]+)/,
                relevance: 0,
                returnBegin: !0,
                contains: [{
                    className: "attribute",
                    begin: /[^=]+/
                }, {
                    begin: /=/,
                    endsWithParent: !0,
                    relevance: 0,
                    contains: [w, $, O, {
                        className: "literal",
                        begin: "\\b(" + "true false yes no nothing nil null".split(" ").join("|") + ")\\b"
                    }, {
                        begin: /("[^"]*"|[^\s{}[\]]+)/
                    }]
                }]
            }, {
                className: "number",
                begin: /\*[0-9a-fA-F]+/
            }, {
                begin: "\\b(" + "add remove enable disable set get print export edit find run debug error info warning".split(" ").join("|") + ")([\\s[(\\]|])",
                returnBegin: !0,
                contains: [{
                    className: "builtin-name",
                    begin: /\w+/
                }]
            }, {
                className: "built_in",
                variants: [{
                    begin: "(\\.\\./|/|\\s)((" + "traffic-flow traffic-generator firewall scheduler aaa accounting address-list address align area bandwidth-server bfd bgp bridge client clock community config connection console customer default dhcp-client dhcp-server discovery dns e-mail ethernet filter firmware gps graphing group hardware health hotspot identity igmp-proxy incoming instance interface ip ipsec ipv6 irq l2tp-server lcd ldp logging mac-server mac-winbox mangle manual mirror mme mpls nat nd neighbor network note ntp ospf ospf-v3 ovpn-server page peer pim ping policy pool port ppp pppoe-client pptp-server prefix profile proposal proxy queue radius resource rip ripng route routing screen script security-profiles server service service-port settings shares smb sms sniffer snmp snooper socks sstp-server system tool tracking type upgrade upnp user-manager users user vlan secret vrrp watchdog web-access wireless pptp pppoe lan wan layer7-protocol lease simple raw".split(" ").join("|") + ");?\\s)+"
                }, {
                    begin: /\.\./,
                    relevance: 0
                }]
            }]
        }
    }
    KU4.exports = AVz
})
// @from(Ln 282451, Col 4)
YU4 = p((Sow, zU4) => {
    function OVz(q) {
        return {
            name: "RenderMan RSL",
            keywords: {
                keyword: "float color point normal vector matrix while for if do return else break extern continue",
                built_in: "abs acos ambient area asin atan atmosphere attribute calculatenormal ceil cellnoise clamp comp concat cos degrees depth Deriv diffuse distance Du Dv environment exp faceforward filterstep floor format fresnel incident length lightsource log match max min mod noise normalize ntransform opposite option phong pnoise pow printf ptlined radians random reflect refract renderinfo round setcomp setxcomp setycomp setzcomp shadow sign sin smoothstep specular specularbrdf spline sqrt step tan texture textureinfo trace transform vtransform xcomp ycomp zcomp"
            },
            illegal: "</",
            contains: [q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, q.C_NUMBER_MODE, {
                className: "meta",
                begin: "#",
                end: "$"
            }, {
                className: "class",
                beginKeywords: "surface displacement light volume imager",
                end: "\\("
            }, {
                beginKeywords: "illuminate illuminance gather",
                end: "\\("
            }]
        }
    }
    zU4.exports = OVz
})