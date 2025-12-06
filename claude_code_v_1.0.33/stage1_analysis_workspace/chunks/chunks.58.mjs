
// @from(Start 5253319, End 5254668)
Ef1 = z((db) => {
  Object.defineProperty(db, "__esModule", {
    value: !0
  });
  db.logs = db.ProxyLoggerProvider = db.ProxyLogger = db.NoopLoggerProvider = db.NOOP_LOGGER_PROVIDER = db.NoopLogger = db.NOOP_LOGGER = db.SeverityNumber = void 0;
  var jA6 = Q7B();
  Object.defineProperty(db, "SeverityNumber", {
    enumerable: !0,
    get: function() {
      return jA6.SeverityNumber
    }
  });
  var M7B = KnA();
  Object.defineProperty(db, "NOOP_LOGGER", {
    enumerable: !0,
    get: function() {
      return M7B.NOOP_LOGGER
    }
  });
  Object.defineProperty(db, "NoopLogger", {
    enumerable: !0,
    get: function() {
      return M7B.NoopLogger
    }
  });
  var O7B = DnA();
  Object.defineProperty(db, "NOOP_LOGGER_PROVIDER", {
    enumerable: !0,
    get: function() {
      return O7B.NOOP_LOGGER_PROVIDER
    }
  });
  Object.defineProperty(db, "NoopLoggerProvider", {
    enumerable: !0,
    get: function() {
      return O7B.NoopLoggerProvider
    }
  });
  var SA6 = Ff1();
  Object.defineProperty(db, "ProxyLogger", {
    enumerable: !0,
    get: function() {
      return SA6.ProxyLogger
    }
  });
  var _A6 = Kf1();
  Object.defineProperty(db, "ProxyLoggerProvider", {
    enumerable: !0,
    get: function() {
      return _A6.ProxyLoggerProvider
    }
  });
  var kA6 = L7B();
  db.logs = kA6.LogsAPI.getInstance()
})
// @from(Start 5254674, End 5255209)
BUA = z((T7B) => {
  Object.defineProperty(T7B, "__esModule", {
    value: !0
  });
  T7B.isTracingSuppressed = T7B.unsuppressTracing = T7B.suppressTracing = void 0;
  var yA6 = K9(),
    zf1 = (0, yA6.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

  function xA6(A) {
    return A.setValue(zf1, !0)
  }
  T7B.suppressTracing = xA6;

  function vA6(A) {
    return A.deleteValue(zf1)
  }
  T7B.unsuppressTracing = vA6;

  function bA6(A) {
    return A.getValue(zf1) === !0
  }
  T7B.isTracingSuppressed = bA6
})
// @from(Start 5255215, End 5255815)
Uf1 = z((j7B) => {
  Object.defineProperty(j7B, "__esModule", {
    value: !0
  });
  j7B.BAGGAGE_MAX_TOTAL_LENGTH = j7B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = j7B.BAGGAGE_MAX_NAME_VALUE_PAIRS = j7B.BAGGAGE_HEADER = j7B.BAGGAGE_ITEMS_SEPARATOR = j7B.BAGGAGE_PROPERTIES_SEPARATOR = j7B.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
  j7B.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
  j7B.BAGGAGE_PROPERTIES_SEPARATOR = ";";
  j7B.BAGGAGE_ITEMS_SEPARATOR = ",";
  j7B.BAGGAGE_HEADER = "baggage";
  j7B.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
  j7B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
  j7B.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Start 5255821, End 5257404)
$f1 = z((k7B) => {
  Object.defineProperty(k7B, "__esModule", {
    value: !0
  });
  k7B.parseKeyPairsIntoRecord = k7B.parsePairKeyValue = k7B.getKeyPairs = k7B.serializeKeyPairs = void 0;
  var lA6 = K9(),
    Et = Uf1();

  function iA6(A) {
    return A.reduce((Q, B) => {
      let G = `${Q}${Q!==""?Et.BAGGAGE_ITEMS_SEPARATOR:""}${B}`;
      return G.length > Et.BAGGAGE_MAX_TOTAL_LENGTH ? Q : G
    }, "")
  }
  k7B.serializeKeyPairs = iA6;

  function nA6(A) {
    return A.getAllEntries().map(([Q, B]) => {
      let G = `${encodeURIComponent(Q)}=${encodeURIComponent(B.value)}`;
      if (B.metadata !== void 0) G += Et.BAGGAGE_PROPERTIES_SEPARATOR + B.metadata.toString();
      return G
    })
  }
  k7B.getKeyPairs = nA6;

  function _7B(A) {
    let Q = A.split(Et.BAGGAGE_PROPERTIES_SEPARATOR);
    if (Q.length <= 0) return;
    let B = Q.shift();
    if (!B) return;
    let G = B.indexOf(Et.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (G <= 0) return;
    let Z = decodeURIComponent(B.substring(0, G).trim()),
      I = decodeURIComponent(B.substring(G + 1).trim()),
      Y;
    if (Q.length > 0) Y = (0, lA6.baggageEntryMetadataFromString)(Q.join(Et.BAGGAGE_PROPERTIES_SEPARATOR));
    return {
      key: Z,
      value: I,
      metadata: Y
    }
  }
  k7B.parsePairKeyValue = _7B;

  function aA6(A) {
    let Q = {};
    if (typeof A === "string" && A.length > 0) A.split(Et.BAGGAGE_ITEMS_SEPARATOR).forEach((B) => {
      let G = _7B(B);
      if (G !== void 0 && G.value.length > 0) Q[G.key] = G.value
    });
    return Q
  }
  k7B.parseKeyPairsIntoRecord = aA6
})
// @from(Start 5257410, End 5258746)
f7B = z((v7B) => {
  Object.defineProperty(v7B, "__esModule", {
    value: !0
  });
  v7B.W3CBaggagePropagator = void 0;
  var wf1 = K9(),
    tA6 = BUA(),
    zt = Uf1(),
    qf1 = $f1();
  class x7B {
    inject(A, Q, B) {
      let G = wf1.propagation.getBaggage(A);
      if (!G || (0, tA6.isTracingSuppressed)(A)) return;
      let Z = (0, qf1.getKeyPairs)(G).filter((Y) => {
          return Y.length <= zt.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
        }).slice(0, zt.BAGGAGE_MAX_NAME_VALUE_PAIRS),
        I = (0, qf1.serializeKeyPairs)(Z);
      if (I.length > 0) B.set(Q, zt.BAGGAGE_HEADER, I)
    }
    extract(A, Q, B) {
      let G = B.get(Q, zt.BAGGAGE_HEADER),
        Z = Array.isArray(G) ? G.join(zt.BAGGAGE_ITEMS_SEPARATOR) : G;
      if (!Z) return A;
      let I = {};
      if (Z.length === 0) return A;
      if (Z.split(zt.BAGGAGE_ITEMS_SEPARATOR).forEach((J) => {
          let W = (0, qf1.parsePairKeyValue)(J);
          if (W) {
            let X = {
              value: W.value
            };
            if (W.metadata) X.metadata = W.metadata;
            I[W.key] = X
          }
        }), Object.entries(I).length === 0) return A;
      return wf1.propagation.setBaggage(A, wf1.propagation.createBaggage(I))
    }
    fields() {
      return [zt.BAGGAGE_HEADER]
    }
  }
  v7B.W3CBaggagePropagator = x7B
})
// @from(Start 5258752, End 5259221)
m7B = z((g7B) => {
  Object.defineProperty(g7B, "__esModule", {
    value: !0
  });
  g7B.AnchoredClock = void 0;
  class h7B {
    _monotonicClock;
    _epochMillis;
    _performanceMillis;
    constructor(A, Q) {
      this._monotonicClock = Q, this._epochMillis = A.now(), this._performanceMillis = Q.now()
    }
    now() {
      let A = this._monotonicClock.now() - this._performanceMillis;
      return this._epochMillis + A
    }
  }
  g7B.AnchoredClock = h7B
})
// @from(Start 5259227, End 5260556)
a7B = z((i7B) => {
  Object.defineProperty(i7B, "__esModule", {
    value: !0
  });
  i7B.isAttributeValue = i7B.isAttributeKey = i7B.sanitizeAttributes = void 0;
  var d7B = K9();

  function eA6(A) {
    let Q = {};
    if (typeof A !== "object" || A == null) return Q;
    for (let [B, G] of Object.entries(A)) {
      if (!c7B(B)) {
        d7B.diag.warn(`Invalid attribute key: ${B}`);
        continue
      }
      if (!p7B(G)) {
        d7B.diag.warn(`Invalid attribute value set for key: ${B}`);
        continue
      }
      if (Array.isArray(G)) Q[B] = G.slice();
      else Q[B] = G
    }
    return Q
  }
  i7B.sanitizeAttributes = eA6;

  function c7B(A) {
    return typeof A === "string" && A.length > 0
  }
  i7B.isAttributeKey = c7B;

  function p7B(A) {
    if (A == null) return !0;
    if (Array.isArray(A)) return A16(A);
    return l7B(A)
  }
  i7B.isAttributeValue = p7B;

  function A16(A) {
    let Q;
    for (let B of A) {
      if (B == null) continue;
      if (!Q) {
        if (l7B(B)) {
          Q = typeof B;
          continue
        }
        return !1
      }
      if (typeof B === Q) continue;
      return !1
    }
    return !0
  }

  function l7B(A) {
    switch (typeof A) {
      case "number":
      case "boolean":
      case "string":
        return !0
    }
    return !1
  }
})
// @from(Start 5260562, End 5261168)
Nf1 = z((s7B) => {
  Object.defineProperty(s7B, "__esModule", {
    value: !0
  });
  s7B.loggingErrorHandler = void 0;
  var G16 = K9();

  function Z16() {
    return (A) => {
      G16.diag.error(I16(A))
    }
  }
  s7B.loggingErrorHandler = Z16;

  function I16(A) {
    if (typeof A === "string") return A;
    else return JSON.stringify(Y16(A))
  }

  function Y16(A) {
    let Q = {},
      B = A;
    while (B !== null) Object.getOwnPropertyNames(B).forEach((G) => {
      if (Q[G]) return;
      let Z = B[G];
      if (Z) Q[G] = String(Z)
    }), B = Object.getPrototypeOf(B);
    return Q
  }
})
// @from(Start 5261174, End 5261550)
AGB = z((t7B) => {
  Object.defineProperty(t7B, "__esModule", {
    value: !0
  });
  t7B.globalErrorHandler = t7B.setGlobalErrorHandler = void 0;
  var J16 = Nf1(),
    o7B = (0, J16.loggingErrorHandler)();

  function W16(A) {
    o7B = A
  }
  t7B.setGlobalErrorHandler = W16;

  function X16(A) {
    try {
      o7B(A)
    } catch {}
  }
  t7B.globalErrorHandler = X16
})
// @from(Start 5261556, End 5262737)
YGB = z((ZGB) => {
  Object.defineProperty(ZGB, "__esModule", {
    value: !0
  });
  ZGB.getStringListFromEnv = ZGB.getBooleanFromEnv = ZGB.getStringFromEnv = ZGB.getNumberFromEnv = void 0;
  var QGB = K9(),
    BGB = UA("util");

  function F16(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    let B = Number(Q);
    if (isNaN(B)) {
      QGB.diag.warn(`Unknown value ${(0,BGB.inspect)(Q)} for ${A}, expected a number, using defaults`);
      return
    }
    return B
  }
  ZGB.getNumberFromEnv = F16;

  function GGB(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    return Q
  }
  ZGB.getStringFromEnv = GGB;

  function K16(A) {
    let Q = process.env[A]?.trim().toLowerCase();
    if (Q == null || Q === "") return !1;
    if (Q === "true") return !0;
    else if (Q === "false") return !1;
    else return QGB.diag.warn(`Unknown value ${(0,BGB.inspect)(Q)} for ${A}, expected 'true' or 'false', falling back to 'false' (default)`), !1
  }
  ZGB.getBooleanFromEnv = K16;

  function D16(A) {
    return GGB(A)?.split(",").map((Q) => Q.trim()).filter((Q) => Q !== "")
  }
  ZGB.getStringListFromEnv = D16
})
// @from(Start 5262743, End 5262930)
XGB = z((JGB) => {
  Object.defineProperty(JGB, "__esModule", {
    value: !0
  });
  JGB._globalThis = void 0;
  JGB._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5262936, End 5263120)
KGB = z((VGB) => {
  Object.defineProperty(VGB, "__esModule", {
    value: !0
  });
  VGB.otperformance = void 0;
  var z16 = UA("perf_hooks");
  VGB.otperformance = z16.performance
})
// @from(Start 5263126, End 5263260)
CGB = z((DGB) => {
  Object.defineProperty(DGB, "__esModule", {
    value: !0
  });
  DGB.VERSION = void 0;
  DGB.VERSION = "2.1.0"
})
// @from(Start 5263266, End 5263610)
Lf1 = z((EGB) => {
  Object.defineProperty(EGB, "__esModule", {
    value: !0
  });
  EGB.createConstMap = void 0;

  function U16(A) {
    let Q = {},
      B = A.length;
    for (let G = 0; G < B; G++) {
      let Z = A[G];
      if (Z) Q[String(Z).toUpperCase().replace(/[-.]/g, "_")] = Z
    }
    return Q
  }
  EGB.createConstMap = U16
})
// @from(Start 5263616, End 5294213)
HWB = z((JWB) => {
  Object.defineProperty(JWB, "__esModule", {
    value: !0
  });
  JWB.SEMATTRS_NET_HOST_CARRIER_ICC = JWB.SEMATTRS_NET_HOST_CARRIER_MNC = JWB.SEMATTRS_NET_HOST_CARRIER_MCC = JWB.SEMATTRS_NET_HOST_CARRIER_NAME = JWB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = JWB.SEMATTRS_NET_HOST_CONNECTION_TYPE = JWB.SEMATTRS_NET_HOST_NAME = JWB.SEMATTRS_NET_HOST_PORT = JWB.SEMATTRS_NET_HOST_IP = JWB.SEMATTRS_NET_PEER_NAME = JWB.SEMATTRS_NET_PEER_PORT = JWB.SEMATTRS_NET_PEER_IP = JWB.SEMATTRS_NET_TRANSPORT = JWB.SEMATTRS_FAAS_INVOKED_REGION = JWB.SEMATTRS_FAAS_INVOKED_PROVIDER = JWB.SEMATTRS_FAAS_INVOKED_NAME = JWB.SEMATTRS_FAAS_COLDSTART = JWB.SEMATTRS_FAAS_CRON = JWB.SEMATTRS_FAAS_TIME = JWB.SEMATTRS_FAAS_DOCUMENT_NAME = JWB.SEMATTRS_FAAS_DOCUMENT_TIME = JWB.SEMATTRS_FAAS_DOCUMENT_OPERATION = JWB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = JWB.SEMATTRS_FAAS_EXECUTION = JWB.SEMATTRS_FAAS_TRIGGER = JWB.SEMATTRS_EXCEPTION_ESCAPED = JWB.SEMATTRS_EXCEPTION_STACKTRACE = JWB.SEMATTRS_EXCEPTION_MESSAGE = JWB.SEMATTRS_EXCEPTION_TYPE = JWB.SEMATTRS_DB_SQL_TABLE = JWB.SEMATTRS_DB_MONGODB_COLLECTION = JWB.SEMATTRS_DB_REDIS_DATABASE_INDEX = JWB.SEMATTRS_DB_HBASE_NAMESPACE = JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = JWB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = JWB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = JWB.SEMATTRS_DB_CASSANDRA_TABLE = JWB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = JWB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = JWB.SEMATTRS_DB_CASSANDRA_KEYSPACE = JWB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = JWB.SEMATTRS_DB_OPERATION = JWB.SEMATTRS_DB_STATEMENT = JWB.SEMATTRS_DB_NAME = JWB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = JWB.SEMATTRS_DB_USER = JWB.SEMATTRS_DB_CONNECTION_STRING = JWB.SEMATTRS_DB_SYSTEM = JWB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
  JWB.SEMATTRS_MESSAGING_DESTINATION_KIND = JWB.SEMATTRS_MESSAGING_DESTINATION = JWB.SEMATTRS_MESSAGING_SYSTEM = JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = JWB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = JWB.SEMATTRS_AWS_DYNAMODB_SEGMENT = JWB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = JWB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = JWB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = JWB.SEMATTRS_AWS_DYNAMODB_SELECT = JWB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = JWB.SEMATTRS_AWS_DYNAMODB_LIMIT = JWB.SEMATTRS_AWS_DYNAMODB_PROJECTION = JWB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = JWB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = JWB.SEMATTRS_HTTP_CLIENT_IP = JWB.SEMATTRS_HTTP_ROUTE = JWB.SEMATTRS_HTTP_SERVER_NAME = JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = JWB.SEMATTRS_HTTP_USER_AGENT = JWB.SEMATTRS_HTTP_FLAVOR = JWB.SEMATTRS_HTTP_STATUS_CODE = JWB.SEMATTRS_HTTP_SCHEME = JWB.SEMATTRS_HTTP_HOST = JWB.SEMATTRS_HTTP_TARGET = JWB.SEMATTRS_HTTP_URL = JWB.SEMATTRS_HTTP_METHOD = JWB.SEMATTRS_CODE_LINENO = JWB.SEMATTRS_CODE_FILEPATH = JWB.SEMATTRS_CODE_NAMESPACE = JWB.SEMATTRS_CODE_FUNCTION = JWB.SEMATTRS_THREAD_NAME = JWB.SEMATTRS_THREAD_ID = JWB.SEMATTRS_ENDUSER_SCOPE = JWB.SEMATTRS_ENDUSER_ROLE = JWB.SEMATTRS_ENDUSER_ID = JWB.SEMATTRS_PEER_SERVICE = void 0;
  JWB.DBSYSTEMVALUES_FILEMAKER = JWB.DBSYSTEMVALUES_DERBY = JWB.DBSYSTEMVALUES_FIREBIRD = JWB.DBSYSTEMVALUES_ADABAS = JWB.DBSYSTEMVALUES_CACHE = JWB.DBSYSTEMVALUES_EDB = JWB.DBSYSTEMVALUES_FIRSTSQL = JWB.DBSYSTEMVALUES_INGRES = JWB.DBSYSTEMVALUES_HANADB = JWB.DBSYSTEMVALUES_MAXDB = JWB.DBSYSTEMVALUES_PROGRESS = JWB.DBSYSTEMVALUES_HSQLDB = JWB.DBSYSTEMVALUES_CLOUDSCAPE = JWB.DBSYSTEMVALUES_HIVE = JWB.DBSYSTEMVALUES_REDSHIFT = JWB.DBSYSTEMVALUES_POSTGRESQL = JWB.DBSYSTEMVALUES_DB2 = JWB.DBSYSTEMVALUES_ORACLE = JWB.DBSYSTEMVALUES_MYSQL = JWB.DBSYSTEMVALUES_MSSQL = JWB.DBSYSTEMVALUES_OTHER_SQL = JWB.SemanticAttributes = JWB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = JWB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = JWB.SEMATTRS_MESSAGE_ID = JWB.SEMATTRS_MESSAGE_TYPE = JWB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = JWB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = JWB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = JWB.SEMATTRS_RPC_JSONRPC_VERSION = JWB.SEMATTRS_RPC_GRPC_STATUS_CODE = JWB.SEMATTRS_RPC_METHOD = JWB.SEMATTRS_RPC_SERVICE = JWB.SEMATTRS_RPC_SYSTEM = JWB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = JWB.SEMATTRS_MESSAGING_KAFKA_PARTITION = JWB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = JWB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = JWB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = JWB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = JWB.SEMATTRS_MESSAGING_CONSUMER_ID = JWB.SEMATTRS_MESSAGING_OPERATION = JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = JWB.SEMATTRS_MESSAGING_CONVERSATION_ID = JWB.SEMATTRS_MESSAGING_MESSAGE_ID = JWB.SEMATTRS_MESSAGING_URL = JWB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = JWB.SEMATTRS_MESSAGING_PROTOCOL = JWB.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
  JWB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = JWB.FaasDocumentOperationValues = JWB.FAASDOCUMENTOPERATIONVALUES_DELETE = JWB.FAASDOCUMENTOPERATIONVALUES_EDIT = JWB.FAASDOCUMENTOPERATIONVALUES_INSERT = JWB.FaasTriggerValues = JWB.FAASTRIGGERVALUES_OTHER = JWB.FAASTRIGGERVALUES_TIMER = JWB.FAASTRIGGERVALUES_PUBSUB = JWB.FAASTRIGGERVALUES_HTTP = JWB.FAASTRIGGERVALUES_DATASOURCE = JWB.DbCassandraConsistencyLevelValues = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = JWB.DbSystemValues = JWB.DBSYSTEMVALUES_COCKROACHDB = JWB.DBSYSTEMVALUES_MEMCACHED = JWB.DBSYSTEMVALUES_ELASTICSEARCH = JWB.DBSYSTEMVALUES_GEODE = JWB.DBSYSTEMVALUES_NEO4J = JWB.DBSYSTEMVALUES_DYNAMODB = JWB.DBSYSTEMVALUES_COSMOSDB = JWB.DBSYSTEMVALUES_COUCHDB = JWB.DBSYSTEMVALUES_COUCHBASE = JWB.DBSYSTEMVALUES_REDIS = JWB.DBSYSTEMVALUES_MONGODB = JWB.DBSYSTEMVALUES_HBASE = JWB.DBSYSTEMVALUES_CASSANDRA = JWB.DBSYSTEMVALUES_COLDFUSION = JWB.DBSYSTEMVALUES_H2 = JWB.DBSYSTEMVALUES_VERTICA = JWB.DBSYSTEMVALUES_TERADATA = JWB.DBSYSTEMVALUES_SYBASE = JWB.DBSYSTEMVALUES_SQLITE = JWB.DBSYSTEMVALUES_POINTBASE = JWB.DBSYSTEMVALUES_PERVASIVE = JWB.DBSYSTEMVALUES_NETEZZA = JWB.DBSYSTEMVALUES_MARIADB = JWB.DBSYSTEMVALUES_INTERBASE = JWB.DBSYSTEMVALUES_INSTANTDB = JWB.DBSYSTEMVALUES_INFORMIX = void 0;
  JWB.MESSAGINGOPERATIONVALUES_RECEIVE = JWB.MessagingDestinationKindValues = JWB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = JWB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = JWB.HttpFlavorValues = JWB.HTTPFLAVORVALUES_QUIC = JWB.HTTPFLAVORVALUES_SPDY = JWB.HTTPFLAVORVALUES_HTTP_2_0 = JWB.HTTPFLAVORVALUES_HTTP_1_1 = JWB.HTTPFLAVORVALUES_HTTP_1_0 = JWB.NetHostConnectionSubtypeValues = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = JWB.NetHostConnectionTypeValues = JWB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = JWB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = JWB.NETHOSTCONNECTIONTYPEVALUES_CELL = JWB.NETHOSTCONNECTIONTYPEVALUES_WIRED = JWB.NETHOSTCONNECTIONTYPEVALUES_WIFI = JWB.NetTransportValues = JWB.NETTRANSPORTVALUES_OTHER = JWB.NETTRANSPORTVALUES_INPROC = JWB.NETTRANSPORTVALUES_PIPE = JWB.NETTRANSPORTVALUES_UNIX = JWB.NETTRANSPORTVALUES_IP = JWB.NETTRANSPORTVALUES_IP_UDP = JWB.NETTRANSPORTVALUES_IP_TCP = JWB.FaasInvokedProviderValues = JWB.FAASINVOKEDPROVIDERVALUES_GCP = JWB.FAASINVOKEDPROVIDERVALUES_AZURE = JWB.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
  JWB.MessageTypeValues = JWB.MESSAGETYPEVALUES_RECEIVED = JWB.MESSAGETYPEVALUES_SENT = JWB.RpcGrpcStatusCodeValues = JWB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = JWB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = JWB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = JWB.RPCGRPCSTATUSCODEVALUES_INTERNAL = JWB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = JWB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = JWB.RPCGRPCSTATUSCODEVALUES_ABORTED = JWB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = JWB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = JWB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = JWB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = JWB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = JWB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = JWB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = JWB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = JWB.RPCGRPCSTATUSCODEVALUES_CANCELLED = JWB.RPCGRPCSTATUSCODEVALUES_OK = JWB.MessagingOperationValues = JWB.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
  var GM = Lf1(),
    UGB = "aws.lambda.invoked_arn",
    $GB = "db.system",
    wGB = "db.connection_string",
    qGB = "db.user",
    NGB = "db.jdbc.driver_classname",
    LGB = "db.name",
    MGB = "db.statement",
    OGB = "db.operation",
    RGB = "db.mssql.instance_name",
    TGB = "db.cassandra.keyspace",
    PGB = "db.cassandra.page_size",
    jGB = "db.cassandra.consistency_level",
    SGB = "db.cassandra.table",
    _GB = "db.cassandra.idempotence",
    kGB = "db.cassandra.speculative_execution_count",
    yGB = "db.cassandra.coordinator.id",
    xGB = "db.cassandra.coordinator.dc",
    vGB = "db.hbase.namespace",
    bGB = "db.redis.database_index",
    fGB = "db.mongodb.collection",
    hGB = "db.sql.table",
    gGB = "exception.type",
    uGB = "exception.message",
    mGB = "exception.stacktrace",
    dGB = "exception.escaped",
    cGB = "faas.trigger",
    pGB = "faas.execution",
    lGB = "faas.document.collection",
    iGB = "faas.document.operation",
    nGB = "faas.document.time",
    aGB = "faas.document.name",
    sGB = "faas.time",
    rGB = "faas.cron",
    oGB = "faas.coldstart",
    tGB = "faas.invoked_name",
    eGB = "faas.invoked_provider",
    AZB = "faas.invoked_region",
    QZB = "net.transport",
    BZB = "net.peer.ip",
    GZB = "net.peer.port",
    ZZB = "net.peer.name",
    IZB = "net.host.ip",
    YZB = "net.host.port",
    JZB = "net.host.name",
    WZB = "net.host.connection.type",
    XZB = "net.host.connection.subtype",
    VZB = "net.host.carrier.name",
    FZB = "net.host.carrier.mcc",
    KZB = "net.host.carrier.mnc",
    DZB = "net.host.carrier.icc",
    HZB = "peer.service",
    CZB = "enduser.id",
    EZB = "enduser.role",
    zZB = "enduser.scope",
    UZB = "thread.id",
    $ZB = "thread.name",
    wZB = "code.function",
    qZB = "code.namespace",
    NZB = "code.filepath",
    LZB = "code.lineno",
    MZB = "http.method",
    OZB = "http.url",
    RZB = "http.target",
    TZB = "http.host",
    PZB = "http.scheme",
    jZB = "http.status_code",
    SZB = "http.flavor",
    _ZB = "http.user_agent",
    kZB = "http.request_content_length",
    yZB = "http.request_content_length_uncompressed",
    xZB = "http.response_content_length",
    vZB = "http.response_content_length_uncompressed",
    bZB = "http.server_name",
    fZB = "http.route",
    hZB = "http.client_ip",
    gZB = "aws.dynamodb.table_names",
    uZB = "aws.dynamodb.consumed_capacity",
    mZB = "aws.dynamodb.item_collection_metrics",
    dZB = "aws.dynamodb.provisioned_read_capacity",
    cZB = "aws.dynamodb.provisioned_write_capacity",
    pZB = "aws.dynamodb.consistent_read",
    lZB = "aws.dynamodb.projection",
    iZB = "aws.dynamodb.limit",
    nZB = "aws.dynamodb.attributes_to_get",
    aZB = "aws.dynamodb.index_name",
    sZB = "aws.dynamodb.select",
    rZB = "aws.dynamodb.global_secondary_indexes",
    oZB = "aws.dynamodb.local_secondary_indexes",
    tZB = "aws.dynamodb.exclusive_start_table",
    eZB = "aws.dynamodb.table_count",
    AIB = "aws.dynamodb.scan_forward",
    QIB = "aws.dynamodb.segment",
    BIB = "aws.dynamodb.total_segments",
    GIB = "aws.dynamodb.count",
    ZIB = "aws.dynamodb.scanned_count",
    IIB = "aws.dynamodb.attribute_definitions",
    YIB = "aws.dynamodb.global_secondary_index_updates",
    JIB = "messaging.system",
    WIB = "messaging.destination",
    XIB = "messaging.destination_kind",
    VIB = "messaging.temp_destination",
    FIB = "messaging.protocol",
    KIB = "messaging.protocol_version",
    DIB = "messaging.url",
    HIB = "messaging.message_id",
    CIB = "messaging.conversation_id",
    EIB = "messaging.message_payload_size_bytes",
    zIB = "messaging.message_payload_compressed_size_bytes",
    UIB = "messaging.operation",
    $IB = "messaging.consumer_id",
    wIB = "messaging.rabbitmq.routing_key",
    qIB = "messaging.kafka.message_key",
    NIB = "messaging.kafka.consumer_group",
    LIB = "messaging.kafka.client_id",
    MIB = "messaging.kafka.partition",
    OIB = "messaging.kafka.tombstone",
    RIB = "rpc.system",
    TIB = "rpc.service",
    PIB = "rpc.method",
    jIB = "rpc.grpc.status_code",
    SIB = "rpc.jsonrpc.version",
    _IB = "rpc.jsonrpc.request_id",
    kIB = "rpc.jsonrpc.error_code",
    yIB = "rpc.jsonrpc.error_message",
    xIB = "message.type",
    vIB = "message.id",
    bIB = "message.compressed_size",
    fIB = "message.uncompressed_size";
  JWB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = UGB;
  JWB.SEMATTRS_DB_SYSTEM = $GB;
  JWB.SEMATTRS_DB_CONNECTION_STRING = wGB;
  JWB.SEMATTRS_DB_USER = qGB;
  JWB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = NGB;
  JWB.SEMATTRS_DB_NAME = LGB;
  JWB.SEMATTRS_DB_STATEMENT = MGB;
  JWB.SEMATTRS_DB_OPERATION = OGB;
  JWB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = RGB;
  JWB.SEMATTRS_DB_CASSANDRA_KEYSPACE = TGB;
  JWB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = PGB;
  JWB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = jGB;
  JWB.SEMATTRS_DB_CASSANDRA_TABLE = SGB;
  JWB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = _GB;
  JWB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = kGB;
  JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = yGB;
  JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = xGB;
  JWB.SEMATTRS_DB_HBASE_NAMESPACE = vGB;
  JWB.SEMATTRS_DB_REDIS_DATABASE_INDEX = bGB;
  JWB.SEMATTRS_DB_MONGODB_COLLECTION = fGB;
  JWB.SEMATTRS_DB_SQL_TABLE = hGB;
  JWB.SEMATTRS_EXCEPTION_TYPE = gGB;
  JWB.SEMATTRS_EXCEPTION_MESSAGE = uGB;
  JWB.SEMATTRS_EXCEPTION_STACKTRACE = mGB;
  JWB.SEMATTRS_EXCEPTION_ESCAPED = dGB;
  JWB.SEMATTRS_FAAS_TRIGGER = cGB;
  JWB.SEMATTRS_FAAS_EXECUTION = pGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = lGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_OPERATION = iGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_TIME = nGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_NAME = aGB;
  JWB.SEMATTRS_FAAS_TIME = sGB;
  JWB.SEMATTRS_FAAS_CRON = rGB;
  JWB.SEMATTRS_FAAS_COLDSTART = oGB;
  JWB.SEMATTRS_FAAS_INVOKED_NAME = tGB;
  JWB.SEMATTRS_FAAS_INVOKED_PROVIDER = eGB;
  JWB.SEMATTRS_FAAS_INVOKED_REGION = AZB;
  JWB.SEMATTRS_NET_TRANSPORT = QZB;
  JWB.SEMATTRS_NET_PEER_IP = BZB;
  JWB.SEMATTRS_NET_PEER_PORT = GZB;
  JWB.SEMATTRS_NET_PEER_NAME = ZZB;
  JWB.SEMATTRS_NET_HOST_IP = IZB;
  JWB.SEMATTRS_NET_HOST_PORT = YZB;
  JWB.SEMATTRS_NET_HOST_NAME = JZB;
  JWB.SEMATTRS_NET_HOST_CONNECTION_TYPE = WZB;
  JWB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = XZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_NAME = VZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_MCC = FZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_MNC = KZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_ICC = DZB;
  JWB.SEMATTRS_PEER_SERVICE = HZB;
  JWB.SEMATTRS_ENDUSER_ID = CZB;
  JWB.SEMATTRS_ENDUSER_ROLE = EZB;
  JWB.SEMATTRS_ENDUSER_SCOPE = zZB;
  JWB.SEMATTRS_THREAD_ID = UZB;
  JWB.SEMATTRS_THREAD_NAME = $ZB;
  JWB.SEMATTRS_CODE_FUNCTION = wZB;
  JWB.SEMATTRS_CODE_NAMESPACE = qZB;
  JWB.SEMATTRS_CODE_FILEPATH = NZB;
  JWB.SEMATTRS_CODE_LINENO = LZB;
  JWB.SEMATTRS_HTTP_METHOD = MZB;
  JWB.SEMATTRS_HTTP_URL = OZB;
  JWB.SEMATTRS_HTTP_TARGET = RZB;
  JWB.SEMATTRS_HTTP_HOST = TZB;
  JWB.SEMATTRS_HTTP_SCHEME = PZB;
  JWB.SEMATTRS_HTTP_STATUS_CODE = jZB;
  JWB.SEMATTRS_HTTP_FLAVOR = SZB;
  JWB.SEMATTRS_HTTP_USER_AGENT = _ZB;
  JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = kZB;
  JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = yZB;
  JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = xZB;
  JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = vZB;
  JWB.SEMATTRS_HTTP_SERVER_NAME = bZB;
  JWB.SEMATTRS_HTTP_ROUTE = fZB;
  JWB.SEMATTRS_HTTP_CLIENT_IP = hZB;
  JWB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = gZB;
  JWB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = uZB;
  JWB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = mZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = dZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = cZB;
  JWB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = pZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROJECTION = lZB;
  JWB.SEMATTRS_AWS_DYNAMODB_LIMIT = iZB;
  JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = nZB;
  JWB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = aZB;
  JWB.SEMATTRS_AWS_DYNAMODB_SELECT = sZB;
  JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = rZB;
  JWB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = oZB;
  JWB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = tZB;
  JWB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = eZB;
  JWB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = AIB;
  JWB.SEMATTRS_AWS_DYNAMODB_SEGMENT = QIB;
  JWB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = BIB;
  JWB.SEMATTRS_AWS_DYNAMODB_COUNT = GIB;
  JWB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = ZIB;
  JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = IIB;
  JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = YIB;
  JWB.SEMATTRS_MESSAGING_SYSTEM = JIB;
  JWB.SEMATTRS_MESSAGING_DESTINATION = WIB;
  JWB.SEMATTRS_MESSAGING_DESTINATION_KIND = XIB;
  JWB.SEMATTRS_MESSAGING_TEMP_DESTINATION = VIB;
  JWB.SEMATTRS_MESSAGING_PROTOCOL = FIB;
  JWB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = KIB;
  JWB.SEMATTRS_MESSAGING_URL = DIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_ID = HIB;
  JWB.SEMATTRS_MESSAGING_CONVERSATION_ID = CIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = EIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = zIB;
  JWB.SEMATTRS_MESSAGING_OPERATION = UIB;
  JWB.SEMATTRS_MESSAGING_CONSUMER_ID = $IB;
  JWB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = wIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = qIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = NIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = LIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_PARTITION = MIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = OIB;
  JWB.SEMATTRS_RPC_SYSTEM = RIB;
  JWB.SEMATTRS_RPC_SERVICE = TIB;
  JWB.SEMATTRS_RPC_METHOD = PIB;
  JWB.SEMATTRS_RPC_GRPC_STATUS_CODE = jIB;
  JWB.SEMATTRS_RPC_JSONRPC_VERSION = SIB;
  JWB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = _IB;
  JWB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = kIB;
  JWB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = yIB;
  JWB.SEMATTRS_MESSAGE_TYPE = xIB;
  JWB.SEMATTRS_MESSAGE_ID = vIB;
  JWB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = bIB;
  JWB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = fIB;
  JWB.SemanticAttributes = (0, GM.createConstMap)([UGB, $GB, wGB, qGB, NGB, LGB, MGB, OGB, RGB, TGB, PGB, jGB, SGB, _GB, kGB, yGB, xGB, vGB, bGB, fGB, hGB, gGB, uGB, mGB, dGB, cGB, pGB, lGB, iGB, nGB, aGB, sGB, rGB, oGB, tGB, eGB, AZB, QZB, BZB, GZB, ZZB, IZB, YZB, JZB, WZB, XZB, VZB, FZB, KZB, DZB, HZB, CZB, EZB, zZB, UZB, $ZB, wZB, qZB, NZB, LZB, MZB, OZB, RZB, TZB, PZB, jZB, SZB, _ZB, kZB, yZB, xZB, vZB, bZB, fZB, hZB, gZB, uZB, mZB, dZB, cZB, pZB, lZB, iZB, nZB, aZB, sZB, rZB, oZB, tZB, eZB, AIB, QIB, BIB, GIB, ZIB, IIB, YIB, JIB, WIB, XIB, VIB, FIB, KIB, DIB, HIB, CIB, EIB, zIB, UIB, $IB, wIB, qIB, NIB, LIB, MIB, OIB, RIB, TIB, PIB, jIB, SIB, _IB, kIB, yIB, xIB, vIB, bIB, fIB]);
  var hIB = "other_sql",
    gIB = "mssql",
    uIB = "mysql",
    mIB = "oracle",
    dIB = "db2",
    cIB = "postgresql",
    pIB = "redshift",
    lIB = "hive",
    iIB = "cloudscape",
    nIB = "hsqldb",
    aIB = "progress",
    sIB = "maxdb",
    rIB = "hanadb",
    oIB = "ingres",
    tIB = "firstsql",
    eIB = "edb",
    AYB = "cache",
    QYB = "adabas",
    BYB = "firebird",
    GYB = "derby",
    ZYB = "filemaker",
    IYB = "informix",
    YYB = "instantdb",
    JYB = "interbase",
    WYB = "mariadb",
    XYB = "netezza",
    VYB = "pervasive",
    FYB = "pointbase",
    KYB = "sqlite",
    DYB = "sybase",
    HYB = "teradata",
    CYB = "vertica",
    EYB = "h2",
    zYB = "coldfusion",
    UYB = "cassandra",
    $YB = "hbase",
    wYB = "mongodb",
    qYB = "redis",
    NYB = "couchbase",
    LYB = "couchdb",
    MYB = "cosmosdb",
    OYB = "dynamodb",
    RYB = "neo4j",
    TYB = "geode",
    PYB = "elasticsearch",
    jYB = "memcached",
    SYB = "cockroachdb";
  JWB.DBSYSTEMVALUES_OTHER_SQL = hIB;
  JWB.DBSYSTEMVALUES_MSSQL = gIB;
  JWB.DBSYSTEMVALUES_MYSQL = uIB;
  JWB.DBSYSTEMVALUES_ORACLE = mIB;
  JWB.DBSYSTEMVALUES_DB2 = dIB;
  JWB.DBSYSTEMVALUES_POSTGRESQL = cIB;
  JWB.DBSYSTEMVALUES_REDSHIFT = pIB;
  JWB.DBSYSTEMVALUES_HIVE = lIB;
  JWB.DBSYSTEMVALUES_CLOUDSCAPE = iIB;
  JWB.DBSYSTEMVALUES_HSQLDB = nIB;
  JWB.DBSYSTEMVALUES_PROGRESS = aIB;
  JWB.DBSYSTEMVALUES_MAXDB = sIB;
  JWB.DBSYSTEMVALUES_HANADB = rIB;
  JWB.DBSYSTEMVALUES_INGRES = oIB;
  JWB.DBSYSTEMVALUES_FIRSTSQL = tIB;
  JWB.DBSYSTEMVALUES_EDB = eIB;
  JWB.DBSYSTEMVALUES_CACHE = AYB;
  JWB.DBSYSTEMVALUES_ADABAS = QYB;
  JWB.DBSYSTEMVALUES_FIREBIRD = BYB;
  JWB.DBSYSTEMVALUES_DERBY = GYB;
  JWB.DBSYSTEMVALUES_FILEMAKER = ZYB;
  JWB.DBSYSTEMVALUES_INFORMIX = IYB;
  JWB.DBSYSTEMVALUES_INSTANTDB = YYB;
  JWB.DBSYSTEMVALUES_INTERBASE = JYB;
  JWB.DBSYSTEMVALUES_MARIADB = WYB;
  JWB.DBSYSTEMVALUES_NETEZZA = XYB;
  JWB.DBSYSTEMVALUES_PERVASIVE = VYB;
  JWB.DBSYSTEMVALUES_POINTBASE = FYB;
  JWB.DBSYSTEMVALUES_SQLITE = KYB;
  JWB.DBSYSTEMVALUES_SYBASE = DYB;
  JWB.DBSYSTEMVALUES_TERADATA = HYB;
  JWB.DBSYSTEMVALUES_VERTICA = CYB;
  JWB.DBSYSTEMVALUES_H2 = EYB;
  JWB.DBSYSTEMVALUES_COLDFUSION = zYB;
  JWB.DBSYSTEMVALUES_CASSANDRA = UYB;
  JWB.DBSYSTEMVALUES_HBASE = $YB;
  JWB.DBSYSTEMVALUES_MONGODB = wYB;
  JWB.DBSYSTEMVALUES_REDIS = qYB;
  JWB.DBSYSTEMVALUES_COUCHBASE = NYB;
  JWB.DBSYSTEMVALUES_COUCHDB = LYB;
  JWB.DBSYSTEMVALUES_COSMOSDB = MYB;
  JWB.DBSYSTEMVALUES_DYNAMODB = OYB;
  JWB.DBSYSTEMVALUES_NEO4J = RYB;
  JWB.DBSYSTEMVALUES_GEODE = TYB;
  JWB.DBSYSTEMVALUES_ELASTICSEARCH = PYB;
  JWB.DBSYSTEMVALUES_MEMCACHED = jYB;
  JWB.DBSYSTEMVALUES_COCKROACHDB = SYB;
  JWB.DbSystemValues = (0, GM.createConstMap)([hIB, gIB, uIB, mIB, dIB, cIB, pIB, lIB, iIB, nIB, aIB, sIB, rIB, oIB, tIB, eIB, AYB, QYB, BYB, GYB, ZYB, IYB, YYB, JYB, WYB, XYB, VYB, FYB, KYB, DYB, HYB, CYB, EYB, zYB, UYB, $YB, wYB, qYB, NYB, LYB, MYB, OYB, RYB, TYB, PYB, jYB, SYB]);
  var _YB = "all",
    kYB = "each_quorum",
    yYB = "quorum",
    xYB = "local_quorum",
    vYB = "one",
    bYB = "two",
    fYB = "three",
    hYB = "local_one",
    gYB = "any",
    uYB = "serial",
    mYB = "local_serial";
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = _YB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = kYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = yYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = xYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = vYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = bYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = fYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = hYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = gYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = uYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = mYB;
  JWB.DbCassandraConsistencyLevelValues = (0, GM.createConstMap)([_YB, kYB, yYB, xYB, vYB, bYB, fYB, hYB, gYB, uYB, mYB]);
  var dYB = "datasource",
    cYB = "http",
    pYB = "pubsub",
    lYB = "timer",
    iYB = "other";
  JWB.FAASTRIGGERVALUES_DATASOURCE = dYB;
  JWB.FAASTRIGGERVALUES_HTTP = cYB;
  JWB.FAASTRIGGERVALUES_PUBSUB = pYB;
  JWB.FAASTRIGGERVALUES_TIMER = lYB;
  JWB.FAASTRIGGERVALUES_OTHER = iYB;
  JWB.FaasTriggerValues = (0, GM.createConstMap)([dYB, cYB, pYB, lYB, iYB]);
  var nYB = "insert",
    aYB = "edit",
    sYB = "delete";
  JWB.FAASDOCUMENTOPERATIONVALUES_INSERT = nYB;
  JWB.FAASDOCUMENTOPERATIONVALUES_EDIT = aYB;
  JWB.FAASDOCUMENTOPERATIONVALUES_DELETE = sYB;
  JWB.FaasDocumentOperationValues = (0, GM.createConstMap)([nYB, aYB, sYB]);
  var rYB = "alibaba_cloud",
    oYB = "aws",
    tYB = "azure",
    eYB = "gcp";
  JWB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = rYB;
  JWB.FAASINVOKEDPROVIDERVALUES_AWS = oYB;
  JWB.FAASINVOKEDPROVIDERVALUES_AZURE = tYB;
  JWB.FAASINVOKEDPROVIDERVALUES_GCP = eYB;
  JWB.FaasInvokedProviderValues = (0, GM.createConstMap)([rYB, oYB, tYB, eYB]);
  var AJB = "ip_tcp",
    QJB = "ip_udp",
    BJB = "ip",
    GJB = "unix",
    ZJB = "pipe",
    IJB = "inproc",
    YJB = "other";
  JWB.NETTRANSPORTVALUES_IP_TCP = AJB;
  JWB.NETTRANSPORTVALUES_IP_UDP = QJB;
  JWB.NETTRANSPORTVALUES_IP = BJB;
  JWB.NETTRANSPORTVALUES_UNIX = GJB;
  JWB.NETTRANSPORTVALUES_PIPE = ZJB;
  JWB.NETTRANSPORTVALUES_INPROC = IJB;
  JWB.NETTRANSPORTVALUES_OTHER = YJB;
  JWB.NetTransportValues = (0, GM.createConstMap)([AJB, QJB, BJB, GJB, ZJB, IJB, YJB]);
  var JJB = "wifi",
    WJB = "wired",
    XJB = "cell",
    VJB = "unavailable",
    FJB = "unknown";
  JWB.NETHOSTCONNECTIONTYPEVALUES_WIFI = JJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_WIRED = WJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_CELL = XJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = VJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = FJB;
  JWB.NetHostConnectionTypeValues = (0, GM.createConstMap)([JJB, WJB, XJB, VJB, FJB]);
  var KJB = "gprs",
    DJB = "edge",
    HJB = "umts",
    CJB = "cdma",
    EJB = "evdo_0",
    zJB = "evdo_a",
    UJB = "cdma2000_1xrtt",
    $JB = "hsdpa",
    wJB = "hsupa",
    qJB = "hspa",
    NJB = "iden",
    LJB = "evdo_b",
    MJB = "lte",
    OJB = "ehrpd",
    RJB = "hspap",
    TJB = "gsm",
    PJB = "td_scdma",
    jJB = "iwlan",
    SJB = "nr",
    _JB = "nrnsa",
    kJB = "lte_ca";
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = KJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = DJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = HJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = CJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = EJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = zJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = UJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = $JB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = wJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = qJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = NJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = LJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = MJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = OJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = RJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = PJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = jJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = SJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = _JB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = kJB;
  JWB.NetHostConnectionSubtypeValues = (0, GM.createConstMap)([KJB, DJB, HJB, CJB, EJB, zJB, UJB, $JB, wJB, qJB, NJB, LJB, MJB, OJB, RJB, TJB, PJB, jJB, SJB, _JB, kJB]);
  var yJB = "1.0",
    xJB = "1.1",
    vJB = "2.0",
    bJB = "SPDY",
    fJB = "QUIC";
  JWB.HTTPFLAVORVALUES_HTTP_1_0 = yJB;
  JWB.HTTPFLAVORVALUES_HTTP_1_1 = xJB;
  JWB.HTTPFLAVORVALUES_HTTP_2_0 = vJB;
  JWB.HTTPFLAVORVALUES_SPDY = bJB;
  JWB.HTTPFLAVORVALUES_QUIC = fJB;
  JWB.HttpFlavorValues = {
    HTTP_1_0: yJB,
    HTTP_1_1: xJB,
    HTTP_2_0: vJB,
    SPDY: bJB,
    QUIC: fJB
  };
  var hJB = "queue",
    gJB = "topic";
  JWB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = hJB;
  JWB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = gJB;
  JWB.MessagingDestinationKindValues = (0, GM.createConstMap)([hJB, gJB]);
  var uJB = "receive",
    mJB = "process";
  JWB.MESSAGINGOPERATIONVALUES_RECEIVE = uJB;
  JWB.MESSAGINGOPERATIONVALUES_PROCESS = mJB;
  JWB.MessagingOperationValues = (0, GM.createConstMap)([uJB, mJB]);
  var dJB = 0,
    cJB = 1,
    pJB = 2,
    lJB = 3,
    iJB = 4,
    nJB = 5,
    aJB = 6,
    sJB = 7,
    rJB = 8,
    oJB = 9,
    tJB = 10,
    eJB = 11,
    AWB = 12,
    QWB = 13,
    BWB = 14,
    GWB = 15,
    ZWB = 16;
  JWB.RPCGRPCSTATUSCODEVALUES_OK = dJB;
  JWB.RPCGRPCSTATUSCODEVALUES_CANCELLED = cJB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = pJB;
  JWB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = lJB;
  JWB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = iJB;
  JWB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = nJB;
  JWB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = aJB;
  JWB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = sJB;
  JWB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = rJB;
  JWB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = oJB;
  JWB.RPCGRPCSTATUSCODEVALUES_ABORTED = tJB;
  JWB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = eJB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = AWB;
  JWB.RPCGRPCSTATUSCODEVALUES_INTERNAL = QWB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = BWB;
  JWB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = GWB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = ZWB;
  JWB.RpcGrpcStatusCodeValues = {
    OK: dJB,
    CANCELLED: cJB,
    UNKNOWN: pJB,
    INVALID_ARGUMENT: lJB,
    DEADLINE_EXCEEDED: iJB,
    NOT_FOUND: nJB,
    ALREADY_EXISTS: aJB,
    PERMISSION_DENIED: sJB,
    RESOURCE_EXHAUSTED: rJB,
    FAILED_PRECONDITION: oJB,
    ABORTED: tJB,
    OUT_OF_RANGE: eJB,
    UNIMPLEMENTED: AWB,
    INTERNAL: QWB,
    UNAVAILABLE: BWB,
    DATA_LOSS: GWB,
    UNAUTHENTICATED: ZWB
  };
  var IWB = "SENT",
    YWB = "RECEIVED";
  JWB.MESSAGETYPEVALUES_SENT = IWB;
  JWB.MESSAGETYPEVALUES_RECEIVED = YWB;
  JWB.MessageTypeValues = (0, GM.createConstMap)([IWB, YWB])
})
// @from(Start 5294219, End 5294954)
CWB = z((Ut) => {
  var E96 = Ut && Ut.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    z96 = Ut && Ut.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) E96(Q, A, B)
    };
  Object.defineProperty(Ut, "__esModule", {
    value: !0
  });
  z96(HWB(), Ut)
})
// @from(Start 5294960, End 5310066)
pVB = z((uVB) => {
  Object.defineProperty(uVB, "__esModule", {
    value: !0
  });
  uVB.SEMRESATTRS_K8S_STATEFULSET_NAME = uVB.SEMRESATTRS_K8S_STATEFULSET_UID = uVB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = uVB.SEMRESATTRS_K8S_DEPLOYMENT_UID = uVB.SEMRESATTRS_K8S_REPLICASET_NAME = uVB.SEMRESATTRS_K8S_REPLICASET_UID = uVB.SEMRESATTRS_K8S_CONTAINER_NAME = uVB.SEMRESATTRS_K8S_POD_NAME = uVB.SEMRESATTRS_K8S_POD_UID = uVB.SEMRESATTRS_K8S_NAMESPACE_NAME = uVB.SEMRESATTRS_K8S_NODE_UID = uVB.SEMRESATTRS_K8S_NODE_NAME = uVB.SEMRESATTRS_K8S_CLUSTER_NAME = uVB.SEMRESATTRS_HOST_IMAGE_VERSION = uVB.SEMRESATTRS_HOST_IMAGE_ID = uVB.SEMRESATTRS_HOST_IMAGE_NAME = uVB.SEMRESATTRS_HOST_ARCH = uVB.SEMRESATTRS_HOST_TYPE = uVB.SEMRESATTRS_HOST_NAME = uVB.SEMRESATTRS_HOST_ID = uVB.SEMRESATTRS_FAAS_MAX_MEMORY = uVB.SEMRESATTRS_FAAS_INSTANCE = uVB.SEMRESATTRS_FAAS_VERSION = uVB.SEMRESATTRS_FAAS_ID = uVB.SEMRESATTRS_FAAS_NAME = uVB.SEMRESATTRS_DEVICE_MODEL_NAME = uVB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = uVB.SEMRESATTRS_DEVICE_ID = uVB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = uVB.SEMRESATTRS_CONTAINER_IMAGE_TAG = uVB.SEMRESATTRS_CONTAINER_IMAGE_NAME = uVB.SEMRESATTRS_CONTAINER_RUNTIME = uVB.SEMRESATTRS_CONTAINER_ID = uVB.SEMRESATTRS_CONTAINER_NAME = uVB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = uVB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = uVB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = uVB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = uVB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = uVB.SEMRESATTRS_AWS_ECS_TASK_REVISION = uVB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = uVB.SEMRESATTRS_AWS_ECS_TASK_ARN = uVB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = uVB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = uVB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = uVB.SEMRESATTRS_CLOUD_PLATFORM = uVB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = uVB.SEMRESATTRS_CLOUD_REGION = uVB.SEMRESATTRS_CLOUD_ACCOUNT_ID = uVB.SEMRESATTRS_CLOUD_PROVIDER = void 0;
  uVB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = uVB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = uVB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = uVB.CLOUDPLATFORMVALUES_AZURE_AKS = uVB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = uVB.CLOUDPLATFORMVALUES_AZURE_VM = uVB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = uVB.CLOUDPLATFORMVALUES_AWS_LAMBDA = uVB.CLOUDPLATFORMVALUES_AWS_EKS = uVB.CLOUDPLATFORMVALUES_AWS_ECS = uVB.CLOUDPLATFORMVALUES_AWS_EC2 = uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = uVB.CloudProviderValues = uVB.CLOUDPROVIDERVALUES_GCP = uVB.CLOUDPROVIDERVALUES_AZURE = uVB.CLOUDPROVIDERVALUES_AWS = uVB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = uVB.SemanticResourceAttributes = uVB.SEMRESATTRS_WEBENGINE_DESCRIPTION = uVB.SEMRESATTRS_WEBENGINE_VERSION = uVB.SEMRESATTRS_WEBENGINE_NAME = uVB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = uVB.SEMRESATTRS_TELEMETRY_SDK_VERSION = uVB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = uVB.SEMRESATTRS_TELEMETRY_SDK_NAME = uVB.SEMRESATTRS_SERVICE_VERSION = uVB.SEMRESATTRS_SERVICE_INSTANCE_ID = uVB.SEMRESATTRS_SERVICE_NAMESPACE = uVB.SEMRESATTRS_SERVICE_NAME = uVB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = uVB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = uVB.SEMRESATTRS_PROCESS_RUNTIME_NAME = uVB.SEMRESATTRS_PROCESS_OWNER = uVB.SEMRESATTRS_PROCESS_COMMAND_ARGS = uVB.SEMRESATTRS_PROCESS_COMMAND_LINE = uVB.SEMRESATTRS_PROCESS_COMMAND = uVB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = uVB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = uVB.SEMRESATTRS_PROCESS_PID = uVB.SEMRESATTRS_OS_VERSION = uVB.SEMRESATTRS_OS_NAME = uVB.SEMRESATTRS_OS_DESCRIPTION = uVB.SEMRESATTRS_OS_TYPE = uVB.SEMRESATTRS_K8S_CRONJOB_NAME = uVB.SEMRESATTRS_K8S_CRONJOB_UID = uVB.SEMRESATTRS_K8S_JOB_NAME = uVB.SEMRESATTRS_K8S_JOB_UID = uVB.SEMRESATTRS_K8S_DAEMONSET_NAME = uVB.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
  uVB.TelemetrySdkLanguageValues = uVB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = uVB.TELEMETRYSDKLANGUAGEVALUES_RUBY = uVB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = uVB.TELEMETRYSDKLANGUAGEVALUES_PHP = uVB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = uVB.TELEMETRYSDKLANGUAGEVALUES_JAVA = uVB.TELEMETRYSDKLANGUAGEVALUES_GO = uVB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = uVB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = uVB.TELEMETRYSDKLANGUAGEVALUES_CPP = uVB.OsTypeValues = uVB.OSTYPEVALUES_Z_OS = uVB.OSTYPEVALUES_SOLARIS = uVB.OSTYPEVALUES_AIX = uVB.OSTYPEVALUES_HPUX = uVB.OSTYPEVALUES_DRAGONFLYBSD = uVB.OSTYPEVALUES_OPENBSD = uVB.OSTYPEVALUES_NETBSD = uVB.OSTYPEVALUES_FREEBSD = uVB.OSTYPEVALUES_DARWIN = uVB.OSTYPEVALUES_LINUX = uVB.OSTYPEVALUES_WINDOWS = uVB.HostArchValues = uVB.HOSTARCHVALUES_X86 = uVB.HOSTARCHVALUES_PPC64 = uVB.HOSTARCHVALUES_PPC32 = uVB.HOSTARCHVALUES_IA64 = uVB.HOSTARCHVALUES_ARM64 = uVB.HOSTARCHVALUES_ARM32 = uVB.HOSTARCHVALUES_AMD64 = uVB.AwsEcsLaunchtypeValues = uVB.AWSECSLAUNCHTYPEVALUES_FARGATE = uVB.AWSECSLAUNCHTYPEVALUES_EC2 = uVB.CloudPlatformValues = uVB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = uVB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
  var $t = Lf1(),
    EWB = "cloud.provider",
    zWB = "cloud.account.id",
    UWB = "cloud.region",
    $WB = "cloud.availability_zone",
    wWB = "cloud.platform",
    qWB = "aws.ecs.container.arn",
    NWB = "aws.ecs.cluster.arn",
    LWB = "aws.ecs.launchtype",
    MWB = "aws.ecs.task.arn",
    OWB = "aws.ecs.task.family",
    RWB = "aws.ecs.task.revision",
    TWB = "aws.eks.cluster.arn",
    PWB = "aws.log.group.names",
    jWB = "aws.log.group.arns",
    SWB = "aws.log.stream.names",
    _WB = "aws.log.stream.arns",
    kWB = "container.name",
    yWB = "container.id",
    xWB = "container.runtime",
    vWB = "container.image.name",
    bWB = "container.image.tag",
    fWB = "deployment.environment",
    hWB = "device.id",
    gWB = "device.model.identifier",
    uWB = "device.model.name",
    mWB = "faas.name",
    dWB = "faas.id",
    cWB = "faas.version",
    pWB = "faas.instance",
    lWB = "faas.max_memory",
    iWB = "host.id",
    nWB = "host.name",
    aWB = "host.type",
    sWB = "host.arch",
    rWB = "host.image.name",
    oWB = "host.image.id",
    tWB = "host.image.version",
    eWB = "k8s.cluster.name",
    AXB = "k8s.node.name",
    QXB = "k8s.node.uid",
    BXB = "k8s.namespace.name",
    GXB = "k8s.pod.uid",
    ZXB = "k8s.pod.name",
    IXB = "k8s.container.name",
    YXB = "k8s.replicaset.uid",
    JXB = "k8s.replicaset.name",
    WXB = "k8s.deployment.uid",
    XXB = "k8s.deployment.name",
    VXB = "k8s.statefulset.uid",
    FXB = "k8s.statefulset.name",
    KXB = "k8s.daemonset.uid",
    DXB = "k8s.daemonset.name",
    HXB = "k8s.job.uid",
    CXB = "k8s.job.name",
    EXB = "k8s.cronjob.uid",
    zXB = "k8s.cronjob.name",
    UXB = "os.type",
    $XB = "os.description",
    wXB = "os.name",
    qXB = "os.version",
    NXB = "process.pid",
    LXB = "process.executable.name",
    MXB = "process.executable.path",
    OXB = "process.command",
    RXB = "process.command_line",
    TXB = "process.command_args",
    PXB = "process.owner",
    jXB = "process.runtime.name",
    SXB = "process.runtime.version",
    _XB = "process.runtime.description",
    kXB = "service.name",
    yXB = "service.namespace",
    xXB = "service.instance.id",
    vXB = "service.version",
    bXB = "telemetry.sdk.name",
    fXB = "telemetry.sdk.language",
    hXB = "telemetry.sdk.version",
    gXB = "telemetry.auto.version",
    uXB = "webengine.name",
    mXB = "webengine.version",
    dXB = "webengine.description";
  uVB.SEMRESATTRS_CLOUD_PROVIDER = EWB;
  uVB.SEMRESATTRS_CLOUD_ACCOUNT_ID = zWB;
  uVB.SEMRESATTRS_CLOUD_REGION = UWB;
  uVB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = $WB;
  uVB.SEMRESATTRS_CLOUD_PLATFORM = wWB;
  uVB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = qWB;
  uVB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = NWB;
  uVB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = LWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_ARN = MWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = OWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_REVISION = RWB;
  uVB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TWB;
  uVB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = PWB;
  uVB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = jWB;
  uVB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = SWB;
  uVB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = _WB;
  uVB.SEMRESATTRS_CONTAINER_NAME = kWB;
  uVB.SEMRESATTRS_CONTAINER_ID = yWB;
  uVB.SEMRESATTRS_CONTAINER_RUNTIME = xWB;
  uVB.SEMRESATTRS_CONTAINER_IMAGE_NAME = vWB;
  uVB.SEMRESATTRS_CONTAINER_IMAGE_TAG = bWB;
  uVB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = fWB;
  uVB.SEMRESATTRS_DEVICE_ID = hWB;
  uVB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = gWB;
  uVB.SEMRESATTRS_DEVICE_MODEL_NAME = uWB;
  uVB.SEMRESATTRS_FAAS_NAME = mWB;
  uVB.SEMRESATTRS_FAAS_ID = dWB;
  uVB.SEMRESATTRS_FAAS_VERSION = cWB;
  uVB.SEMRESATTRS_FAAS_INSTANCE = pWB;
  uVB.SEMRESATTRS_FAAS_MAX_MEMORY = lWB;
  uVB.SEMRESATTRS_HOST_ID = iWB;
  uVB.SEMRESATTRS_HOST_NAME = nWB;
  uVB.SEMRESATTRS_HOST_TYPE = aWB;
  uVB.SEMRESATTRS_HOST_ARCH = sWB;
  uVB.SEMRESATTRS_HOST_IMAGE_NAME = rWB;
  uVB.SEMRESATTRS_HOST_IMAGE_ID = oWB;
  uVB.SEMRESATTRS_HOST_IMAGE_VERSION = tWB;
  uVB.SEMRESATTRS_K8S_CLUSTER_NAME = eWB;
  uVB.SEMRESATTRS_K8S_NODE_NAME = AXB;
  uVB.SEMRESATTRS_K8S_NODE_UID = QXB;
  uVB.SEMRESATTRS_K8S_NAMESPACE_NAME = BXB;
  uVB.SEMRESATTRS_K8S_POD_UID = GXB;
  uVB.SEMRESATTRS_K8S_POD_NAME = ZXB;
  uVB.SEMRESATTRS_K8S_CONTAINER_NAME = IXB;
  uVB.SEMRESATTRS_K8S_REPLICASET_UID = YXB;
  uVB.SEMRESATTRS_K8S_REPLICASET_NAME = JXB;
  uVB.SEMRESATTRS_K8S_DEPLOYMENT_UID = WXB;
  uVB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = XXB;
  uVB.SEMRESATTRS_K8S_STATEFULSET_UID = VXB;
  uVB.SEMRESATTRS_K8S_STATEFULSET_NAME = FXB;
  uVB.SEMRESATTRS_K8S_DAEMONSET_UID = KXB;
  uVB.SEMRESATTRS_K8S_DAEMONSET_NAME = DXB;
  uVB.SEMRESATTRS_K8S_JOB_UID = HXB;
  uVB.SEMRESATTRS_K8S_JOB_NAME = CXB;
  uVB.SEMRESATTRS_K8S_CRONJOB_UID = EXB;
  uVB.SEMRESATTRS_K8S_CRONJOB_NAME = zXB;
  uVB.SEMRESATTRS_OS_TYPE = UXB;
  uVB.SEMRESATTRS_OS_DESCRIPTION = $XB;
  uVB.SEMRESATTRS_OS_NAME = wXB;
  uVB.SEMRESATTRS_OS_VERSION = qXB;
  uVB.SEMRESATTRS_PROCESS_PID = NXB;
  uVB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = LXB;
  uVB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = MXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND = OXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND_LINE = RXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND_ARGS = TXB;
  uVB.SEMRESATTRS_PROCESS_OWNER = PXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_NAME = jXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = SXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = _XB;
  uVB.SEMRESATTRS_SERVICE_NAME = kXB;
  uVB.SEMRESATTRS_SERVICE_NAMESPACE = yXB;
  uVB.SEMRESATTRS_SERVICE_INSTANCE_ID = xXB;
  uVB.SEMRESATTRS_SERVICE_VERSION = vXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_NAME = bXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = fXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_VERSION = hXB;
  uVB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = gXB;
  uVB.SEMRESATTRS_WEBENGINE_NAME = uXB;
  uVB.SEMRESATTRS_WEBENGINE_VERSION = mXB;
  uVB.SEMRESATTRS_WEBENGINE_DESCRIPTION = dXB;
  uVB.SemanticResourceAttributes = (0, $t.createConstMap)([EWB, zWB, UWB, $WB, wWB, qWB, NWB, LWB, MWB, OWB, RWB, TWB, PWB, jWB, SWB, _WB, kWB, yWB, xWB, vWB, bWB, fWB, hWB, gWB, uWB, mWB, dWB, cWB, pWB, lWB, iWB, nWB, aWB, sWB, rWB, oWB, tWB, eWB, AXB, QXB, BXB, GXB, ZXB, IXB, YXB, JXB, WXB, XXB, VXB, FXB, KXB, DXB, HXB, CXB, EXB, zXB, UXB, $XB, wXB, qXB, NXB, LXB, MXB, OXB, RXB, TXB, PXB, jXB, SXB, _XB, kXB, yXB, xXB, vXB, bXB, fXB, hXB, gXB, uXB, mXB, dXB]);
  var cXB = "alibaba_cloud",
    pXB = "aws",
    lXB = "azure",
    iXB = "gcp";
  uVB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = cXB;
  uVB.CLOUDPROVIDERVALUES_AWS = pXB;
  uVB.CLOUDPROVIDERVALUES_AZURE = lXB;
  uVB.CLOUDPROVIDERVALUES_GCP = iXB;
  uVB.CloudProviderValues = (0, $t.createConstMap)([cXB, pXB, lXB, iXB]);
  var nXB = "alibaba_cloud_ecs",
    aXB = "alibaba_cloud_fc",
    sXB = "aws_ec2",
    rXB = "aws_ecs",
    oXB = "aws_eks",
    tXB = "aws_lambda",
    eXB = "aws_elastic_beanstalk",
    AVB = "azure_vm",
    QVB = "azure_container_instances",
    BVB = "azure_aks",
    GVB = "azure_functions",
    ZVB = "azure_app_service",
    IVB = "gcp_compute_engine",
    YVB = "gcp_cloud_run",
    JVB = "gcp_kubernetes_engine",
    WVB = "gcp_cloud_functions",
    XVB = "gcp_app_engine";
  uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = nXB;
  uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = aXB;
  uVB.CLOUDPLATFORMVALUES_AWS_EC2 = sXB;
  uVB.CLOUDPLATFORMVALUES_AWS_ECS = rXB;
  uVB.CLOUDPLATFORMVALUES_AWS_EKS = oXB;
  uVB.CLOUDPLATFORMVALUES_AWS_LAMBDA = tXB;
  uVB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = eXB;
  uVB.CLOUDPLATFORMVALUES_AZURE_VM = AVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = QVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_AKS = BVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = GVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = ZVB;
  uVB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = IVB;
  uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = YVB;
  uVB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = JVB;
  uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = WVB;
  uVB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = XVB;
  uVB.CloudPlatformValues = (0, $t.createConstMap)([nXB, aXB, sXB, rXB, oXB, tXB, eXB, AVB, QVB, BVB, GVB, ZVB, IVB, YVB, JVB, WVB, XVB]);
  var VVB = "ec2",
    FVB = "fargate";
  uVB.AWSECSLAUNCHTYPEVALUES_EC2 = VVB;
  uVB.AWSECSLAUNCHTYPEVALUES_FARGATE = FVB;
  uVB.AwsEcsLaunchtypeValues = (0, $t.createConstMap)([VVB, FVB]);
  var KVB = "amd64",
    DVB = "arm32",
    HVB = "arm64",
    CVB = "ia64",
    EVB = "ppc32",
    zVB = "ppc64",
    UVB = "x86";
  uVB.HOSTARCHVALUES_AMD64 = KVB;
  uVB.HOSTARCHVALUES_ARM32 = DVB;
  uVB.HOSTARCHVALUES_ARM64 = HVB;
  uVB.HOSTARCHVALUES_IA64 = CVB;
  uVB.HOSTARCHVALUES_PPC32 = EVB;
  uVB.HOSTARCHVALUES_PPC64 = zVB;
  uVB.HOSTARCHVALUES_X86 = UVB;
  uVB.HostArchValues = (0, $t.createConstMap)([KVB, DVB, HVB, CVB, EVB, zVB, UVB]);
  var $VB = "windows",
    wVB = "linux",
    qVB = "darwin",
    NVB = "freebsd",
    LVB = "netbsd",
    MVB = "openbsd",
    OVB = "dragonflybsd",
    RVB = "hpux",
    TVB = "aix",
    PVB = "solaris",
    jVB = "z_os";
  uVB.OSTYPEVALUES_WINDOWS = $VB;
  uVB.OSTYPEVALUES_LINUX = wVB;
  uVB.OSTYPEVALUES_DARWIN = qVB;
  uVB.OSTYPEVALUES_FREEBSD = NVB;
  uVB.OSTYPEVALUES_NETBSD = LVB;
  uVB.OSTYPEVALUES_OPENBSD = MVB;
  uVB.OSTYPEVALUES_DRAGONFLYBSD = OVB;
  uVB.OSTYPEVALUES_HPUX = RVB;
  uVB.OSTYPEVALUES_AIX = TVB;
  uVB.OSTYPEVALUES_SOLARIS = PVB;
  uVB.OSTYPEVALUES_Z_OS = jVB;
  uVB.OsTypeValues = (0, $t.createConstMap)([$VB, wVB, qVB, NVB, LVB, MVB, OVB, RVB, TVB, PVB, jVB]);
  var SVB = "cpp",
    _VB = "dotnet",
    kVB = "erlang",
    yVB = "go",
    xVB = "java",
    vVB = "nodejs",
    bVB = "php",
    fVB = "python",
    hVB = "ruby",
    gVB = "webjs";
  uVB.TELEMETRYSDKLANGUAGEVALUES_CPP = SVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = _VB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = kVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_GO = yVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_JAVA = xVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = vVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_PHP = bVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = fVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_RUBY = hVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = gVB;
  uVB.TelemetrySdkLanguageValues = (0, $t.createConstMap)([SVB, _VB, kVB, yVB, xVB, vVB, bVB, fVB, hVB, gVB])
})
// @from(Start 5310072, End 5310807)
lVB = z((wt) => {
  var i86 = wt && wt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    n86 = wt && wt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) i86(Q, A, B)
    };
  Object.defineProperty(wt, "__esModule", {
    value: !0
  });
  n86(pVB(), wt)
})
// @from(Start 5310813, End 5323287)
rVB = z((iVB) => {
  Object.defineProperty(iVB, "__esModule", {
    value: !0
  });
  iVB.ATTR_EXCEPTION_TYPE = iVB.ATTR_EXCEPTION_STACKTRACE = iVB.ATTR_EXCEPTION_MESSAGE = iVB.ATTR_EXCEPTION_ESCAPED = iVB.ERROR_TYPE_VALUE_OTHER = iVB.ATTR_ERROR_TYPE = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_POH = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = iVB.ATTR_DOTNET_GC_HEAP_GENERATION = iVB.DB_SYSTEM_NAME_VALUE_POSTGRESQL = iVB.DB_SYSTEM_NAME_VALUE_MYSQL = iVB.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = iVB.DB_SYSTEM_NAME_VALUE_MARIADB = iVB.ATTR_DB_SYSTEM_NAME = iVB.ATTR_DB_STORED_PROCEDURE_NAME = iVB.ATTR_DB_RESPONSE_STATUS_CODE = iVB.ATTR_DB_QUERY_TEXT = iVB.ATTR_DB_QUERY_SUMMARY = iVB.ATTR_DB_OPERATION_NAME = iVB.ATTR_DB_OPERATION_BATCH_SIZE = iVB.ATTR_DB_NAMESPACE = iVB.ATTR_DB_COLLECTION_NAME = iVB.ATTR_CODE_STACKTRACE = iVB.ATTR_CODE_LINE_NUMBER = iVB.ATTR_CODE_FUNCTION_NAME = iVB.ATTR_CODE_FILE_PATH = iVB.ATTR_CODE_COLUMN_NUMBER = iVB.ATTR_CLIENT_PORT = iVB.ATTR_CLIENT_ADDRESS = iVB.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = iVB.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = iVB.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = iVB.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = iVB.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = iVB.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = iVB.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = iVB.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
  iVB.OTEL_STATUS_CODE_VALUE_ERROR = iVB.ATTR_OTEL_STATUS_CODE = iVB.ATTR_OTEL_SCOPE_VERSION = iVB.ATTR_OTEL_SCOPE_NAME = iVB.NETWORK_TYPE_VALUE_IPV6 = iVB.NETWORK_TYPE_VALUE_IPV4 = iVB.ATTR_NETWORK_TYPE = iVB.NETWORK_TRANSPORT_VALUE_UNIX = iVB.NETWORK_TRANSPORT_VALUE_UDP = iVB.NETWORK_TRANSPORT_VALUE_TCP = iVB.NETWORK_TRANSPORT_VALUE_QUIC = iVB.NETWORK_TRANSPORT_VALUE_PIPE = iVB.ATTR_NETWORK_TRANSPORT = iVB.ATTR_NETWORK_PROTOCOL_VERSION = iVB.ATTR_NETWORK_PROTOCOL_NAME = iVB.ATTR_NETWORK_PEER_PORT = iVB.ATTR_NETWORK_PEER_ADDRESS = iVB.ATTR_NETWORK_LOCAL_PORT = iVB.ATTR_NETWORK_LOCAL_ADDRESS = iVB.JVM_THREAD_STATE_VALUE_WAITING = iVB.JVM_THREAD_STATE_VALUE_TIMED_WAITING = iVB.JVM_THREAD_STATE_VALUE_TERMINATED = iVB.JVM_THREAD_STATE_VALUE_RUNNABLE = iVB.JVM_THREAD_STATE_VALUE_NEW = iVB.JVM_THREAD_STATE_VALUE_BLOCKED = iVB.ATTR_JVM_THREAD_STATE = iVB.ATTR_JVM_THREAD_DAEMON = iVB.JVM_MEMORY_TYPE_VALUE_NON_HEAP = iVB.JVM_MEMORY_TYPE_VALUE_HEAP = iVB.ATTR_JVM_MEMORY_TYPE = iVB.ATTR_JVM_MEMORY_POOL_NAME = iVB.ATTR_JVM_GC_NAME = iVB.ATTR_JVM_GC_ACTION = iVB.ATTR_HTTP_ROUTE = iVB.ATTR_HTTP_RESPONSE_STATUS_CODE = iVB.ATTR_HTTP_RESPONSE_HEADER = iVB.ATTR_HTTP_REQUEST_RESEND_COUNT = iVB.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = iVB.HTTP_REQUEST_METHOD_VALUE_TRACE = iVB.HTTP_REQUEST_METHOD_VALUE_PUT = iVB.HTTP_REQUEST_METHOD_VALUE_POST = iVB.HTTP_REQUEST_METHOD_VALUE_PATCH = iVB.HTTP_REQUEST_METHOD_VALUE_OPTIONS = iVB.HTTP_REQUEST_METHOD_VALUE_HEAD = iVB.HTTP_REQUEST_METHOD_VALUE_GET = iVB.HTTP_REQUEST_METHOD_VALUE_DELETE = iVB.HTTP_REQUEST_METHOD_VALUE_CONNECT = iVB.HTTP_REQUEST_METHOD_VALUE_OTHER = iVB.ATTR_HTTP_REQUEST_METHOD = iVB.ATTR_HTTP_REQUEST_HEADER = void 0;
  iVB.ATTR_USER_AGENT_ORIGINAL = iVB.ATTR_URL_SCHEME = iVB.ATTR_URL_QUERY = iVB.ATTR_URL_PATH = iVB.ATTR_URL_FULL = iVB.ATTR_URL_FRAGMENT = iVB.ATTR_TELEMETRY_SDK_VERSION = iVB.ATTR_TELEMETRY_SDK_NAME = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_GO = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = iVB.ATTR_TELEMETRY_SDK_LANGUAGE = iVB.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = iVB.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = iVB.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = iVB.ATTR_SIGNALR_TRANSPORT = iVB.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = iVB.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = iVB.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = iVB.ATTR_SIGNALR_CONNECTION_STATUS = iVB.ATTR_SERVICE_VERSION = iVB.ATTR_SERVICE_NAME = iVB.ATTR_SERVER_PORT = iVB.ATTR_SERVER_ADDRESS = iVB.ATTR_OTEL_STATUS_DESCRIPTION = iVB.OTEL_STATUS_CODE_VALUE_OK = void 0;
  iVB.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
  iVB.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
  iVB.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
  iVB.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
  iVB.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
  iVB.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
  iVB.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
  iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
  iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
  iVB.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
  iVB.ATTR_CLIENT_ADDRESS = "client.address";
  iVB.ATTR_CLIENT_PORT = "client.port";
  iVB.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
  iVB.ATTR_CODE_FILE_PATH = "code.file.path";
  iVB.ATTR_CODE_FUNCTION_NAME = "code.function.name";
  iVB.ATTR_CODE_LINE_NUMBER = "code.line.number";
  iVB.ATTR_CODE_STACKTRACE = "code.stacktrace";
  iVB.ATTR_DB_COLLECTION_NAME = "db.collection.name";
  iVB.ATTR_DB_NAMESPACE = "db.namespace";
  iVB.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
  iVB.ATTR_DB_OPERATION_NAME = "db.operation.name";
  iVB.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
  iVB.ATTR_DB_QUERY_TEXT = "db.query.text";
  iVB.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
  iVB.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
  iVB.ATTR_DB_SYSTEM_NAME = "db.system.name";
  iVB.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
  iVB.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
  iVB.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
  iVB.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
  iVB.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
  iVB.ATTR_ERROR_TYPE = "error.type";
  iVB.ERROR_TYPE_VALUE_OTHER = "_OTHER";
  iVB.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
  iVB.ATTR_EXCEPTION_MESSAGE = "exception.message";
  iVB.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
  iVB.ATTR_EXCEPTION_TYPE = "exception.type";
  var a86 = (A) => `http.request.header.${A}`;
  iVB.ATTR_HTTP_REQUEST_HEADER = a86;
  iVB.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
  iVB.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
  iVB.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
  iVB.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
  iVB.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
  iVB.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
  iVB.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
  iVB.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
  iVB.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
  iVB.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
  iVB.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
  iVB.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
  iVB.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
  var s86 = (A) => `http.response.header.${A}`;
  iVB.ATTR_HTTP_RESPONSE_HEADER = s86;
  iVB.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
  iVB.ATTR_HTTP_ROUTE = "http.route";
  iVB.ATTR_JVM_GC_ACTION = "jvm.gc.action";
  iVB.ATTR_JVM_GC_NAME = "jvm.gc.name";
  iVB.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
  iVB.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
  iVB.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
  iVB.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
  iVB.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
  iVB.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
  iVB.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
  iVB.JVM_THREAD_STATE_VALUE_NEW = "new";
  iVB.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
  iVB.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
  iVB.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
  iVB.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
  iVB.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
  iVB.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
  iVB.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
  iVB.ATTR_NETWORK_PEER_PORT = "network.peer.port";
  iVB.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
  iVB.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
  iVB.ATTR_NETWORK_TRANSPORT = "network.transport";
  iVB.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
  iVB.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
  iVB.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
  iVB.NETWORK_TRANSPORT_VALUE_UDP = "udp";
  iVB.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
  iVB.ATTR_NETWORK_TYPE = "network.type";
  iVB.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
  iVB.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
  iVB.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
  iVB.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
  iVB.ATTR_OTEL_STATUS_CODE = "otel.status_code";
  iVB.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
  iVB.OTEL_STATUS_CODE_VALUE_OK = "OK";
  iVB.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
  iVB.ATTR_SERVER_ADDRESS = "server.address";
  iVB.ATTR_SERVER_PORT = "server.port";
  iVB.ATTR_SERVICE_NAME = "service.name";
  iVB.ATTR_SERVICE_VERSION = "service.version";
  iVB.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
  iVB.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
  iVB.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
  iVB.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
  iVB.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
  iVB.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
  iVB.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
  iVB.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
  iVB.ATTR_URL_FRAGMENT = "url.fragment";
  iVB.ATTR_URL_FULL = "url.full";
  iVB.ATTR_URL_PATH = "url.path";
  iVB.ATTR_URL_QUERY = "url.query";
  iVB.ATTR_URL_SCHEME = "url.scheme";
  iVB.ATTR_USER_AGENT_ORIGINAL = "user_agent.original"
})
// @from(Start 5323293, End 5329341)
AFB = z((oVB) => {
  Object.defineProperty(oVB, "__esModule", {
    value: !0
  });
  oVB.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = oVB.METRIC_KESTREL_UPGRADED_CONNECTIONS = oVB.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = oVB.METRIC_KESTREL_REJECTED_CONNECTIONS = oVB.METRIC_KESTREL_QUEUED_REQUESTS = oVB.METRIC_KESTREL_QUEUED_CONNECTIONS = oVB.METRIC_KESTREL_CONNECTION_DURATION = oVB.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = oVB.METRIC_KESTREL_ACTIVE_CONNECTIONS = oVB.METRIC_JVM_THREAD_COUNT = oVB.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = oVB.METRIC_JVM_MEMORY_USED = oVB.METRIC_JVM_MEMORY_LIMIT = oVB.METRIC_JVM_MEMORY_COMMITTED = oVB.METRIC_JVM_GC_DURATION = oVB.METRIC_JVM_CPU_TIME = oVB.METRIC_JVM_CPU_RECENT_UTILIZATION = oVB.METRIC_JVM_CPU_COUNT = oVB.METRIC_JVM_CLASS_UNLOADED = oVB.METRIC_JVM_CLASS_LOADED = oVB.METRIC_JVM_CLASS_COUNT = oVB.METRIC_HTTP_SERVER_REQUEST_DURATION = oVB.METRIC_HTTP_CLIENT_REQUEST_DURATION = oVB.METRIC_DOTNET_TIMER_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = oVB.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = oVB.METRIC_DOTNET_PROCESS_CPU_TIME = oVB.METRIC_DOTNET_PROCESS_CPU_COUNT = oVB.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = oVB.METRIC_DOTNET_JIT_COMPILED_METHODS = oVB.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = oVB.METRIC_DOTNET_JIT_COMPILATION_TIME = oVB.METRIC_DOTNET_GC_PAUSE_TIME = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = oVB.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = oVB.METRIC_DOTNET_GC_COLLECTIONS = oVB.METRIC_DOTNET_EXCEPTIONS = oVB.METRIC_DOTNET_ASSEMBLY_COUNT = oVB.METRIC_DB_CLIENT_OPERATION_DURATION = oVB.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = oVB.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = oVB.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
  oVB.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
  oVB.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
  oVB.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
  oVB.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
  oVB.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
  oVB.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
  oVB.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
  oVB.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
  oVB.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
  oVB.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
  oVB.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
  oVB.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
  oVB.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
  oVB.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
  oVB.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
  oVB.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
  oVB.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
  oVB.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
  oVB.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
  oVB.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
  oVB.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
  oVB.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
  oVB.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
  oVB.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
  oVB.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
  oVB.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
  oVB.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
  oVB.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
  oVB.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
  oVB.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
  oVB.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
  oVB.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
  oVB.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
  oVB.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
  oVB.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
  oVB.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
  oVB.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
  oVB.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
  oVB.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
  oVB.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
  oVB.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
  oVB.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
  oVB.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
  oVB.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration"
})
// @from(Start 5329347, End 5329501)
GFB = z((QFB) => {
  Object.defineProperty(QFB, "__esModule", {
    value: !0
  });
  QFB.EVENT_EXCEPTION = void 0;
  QFB.EVENT_EXCEPTION = "exception"
})
// @from(Start 5329507, End 5330313)
qt = z((VT) => {
  var C76 = VT && VT.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    GUA = VT && VT.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) C76(Q, A, B)
    };
  Object.defineProperty(VT, "__esModule", {
    value: !0
  });
  GUA(CWB(), VT);
  GUA(lVB(), VT);
  GUA(rVB(), VT);
  GUA(AFB(), VT);
  GUA(GFB(), VT)
})
// @from(Start 5330319, End 5330504)
YFB = z((ZFB) => {
  Object.defineProperty(ZFB, "__esModule", {
    value: !0
  });
  ZFB.ATTR_PROCESS_RUNTIME_NAME = void 0;
  ZFB.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name"
})
// @from(Start 5330510, End 5330923)
XFB = z((JFB) => {
  Object.defineProperty(JFB, "__esModule", {
    value: !0
  });
  JFB.SDK_INFO = void 0;
  var E76 = CGB(),
    HnA = qt(),
    z76 = YFB();
  JFB.SDK_INFO = {
    [HnA.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
    [z76.ATTR_PROCESS_RUNTIME_NAME]: "node",
    [HnA.ATTR_TELEMETRY_SDK_LANGUAGE]: HnA.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
    [HnA.ATTR_TELEMETRY_SDK_VERSION]: E76.VERSION
  }
})
// @from(Start 5330929, End 5331104)
KFB = z((VFB) => {
  Object.defineProperty(VFB, "__esModule", {
    value: !0
  });
  VFB.unrefTimer = void 0;

  function U76(A) {
    A.unref()
  }
  VFB.unrefTimer = U76
})
// @from(Start 5331110, End 5332527)
DFB = z((R_) => {
  Object.defineProperty(R_, "__esModule", {
    value: !0
  });
  R_.unrefTimer = R_.SDK_INFO = R_.otperformance = R_._globalThis = R_.getStringListFromEnv = R_.getNumberFromEnv = R_.getBooleanFromEnv = R_.getStringFromEnv = void 0;
  var CnA = YGB();
  Object.defineProperty(R_, "getStringFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getStringFromEnv
    }
  });
  Object.defineProperty(R_, "getBooleanFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getBooleanFromEnv
    }
  });
  Object.defineProperty(R_, "getNumberFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getNumberFromEnv
    }
  });
  Object.defineProperty(R_, "getStringListFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getStringListFromEnv
    }
  });
  var $76 = XGB();
  Object.defineProperty(R_, "_globalThis", {
    enumerable: !0,
    get: function() {
      return $76._globalThis
    }
  });
  var w76 = KGB();
  Object.defineProperty(R_, "otperformance", {
    enumerable: !0,
    get: function() {
      return w76.otperformance
    }
  });
  var q76 = XFB();
  Object.defineProperty(R_, "SDK_INFO", {
    enumerable: !0,
    get: function() {
      return q76.SDK_INFO
    }
  });
  var N76 = KFB();
  Object.defineProperty(R_, "unrefTimer", {
    enumerable: !0,
    get: function() {
      return N76.unrefTimer
    }
  })
})
// @from(Start 5332533, End 5333865)
Mf1 = z((T_) => {
  Object.defineProperty(T_, "__esModule", {
    value: !0
  });
  T_.getStringListFromEnv = T_.getNumberFromEnv = T_.getStringFromEnv = T_.getBooleanFromEnv = T_.unrefTimer = T_.otperformance = T_._globalThis = T_.SDK_INFO = void 0;
  var mc = DFB();
  Object.defineProperty(T_, "SDK_INFO", {
    enumerable: !0,
    get: function() {
      return mc.SDK_INFO
    }
  });
  Object.defineProperty(T_, "_globalThis", {
    enumerable: !0,
    get: function() {
      return mc._globalThis
    }
  });
  Object.defineProperty(T_, "otperformance", {
    enumerable: !0,
    get: function() {
      return mc.otperformance
    }
  });
  Object.defineProperty(T_, "unrefTimer", {
    enumerable: !0,
    get: function() {
      return mc.unrefTimer
    }
  });
  Object.defineProperty(T_, "getBooleanFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getBooleanFromEnv
    }
  });
  Object.defineProperty(T_, "getStringFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getStringFromEnv
    }
  });
  Object.defineProperty(T_, "getNumberFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getNumberFromEnv
    }
  });
  Object.defineProperty(T_, "getStringListFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getStringListFromEnv
    }
  })
})
// @from(Start 5333871, End 5336221)
$FB = z((zFB) => {
  Object.defineProperty(zFB, "__esModule", {
    value: !0
  });
  zFB.addHrTimes = zFB.isTimeInput = zFB.isTimeInputHrTime = zFB.hrTimeToMicroseconds = zFB.hrTimeToMilliseconds = zFB.hrTimeToNanoseconds = zFB.hrTimeToTimeStamp = zFB.hrTimeDuration = zFB.timeInputToHrTime = zFB.hrTime = zFB.getTimeOrigin = zFB.millisToHrTime = void 0;
  var Of1 = Mf1(),
    HFB = 9,
    O76 = 6,
    R76 = Math.pow(10, O76),
    EnA = Math.pow(10, HFB);

  function ZUA(A) {
    let Q = A / 1000,
      B = Math.trunc(Q),
      G = Math.round(A % 1000 * R76);
    return [B, G]
  }
  zFB.millisToHrTime = ZUA;

  function Rf1() {
    let A = Of1.otperformance.timeOrigin;
    if (typeof A !== "number") {
      let Q = Of1.otperformance;
      A = Q.timing && Q.timing.fetchStart
    }
    return A
  }
  zFB.getTimeOrigin = Rf1;

  function CFB(A) {
    let Q = ZUA(Rf1()),
      B = ZUA(typeof A === "number" ? A : Of1.otperformance.now());
    return EFB(Q, B)
  }
  zFB.hrTime = CFB;

  function T76(A) {
    if (Tf1(A)) return A;
    else if (typeof A === "number")
      if (A < Rf1()) return CFB(A);
      else return ZUA(A);
    else if (A instanceof Date) return ZUA(A.getTime());
    else throw TypeError("Invalid input type")
  }
  zFB.timeInputToHrTime = T76;

  function P76(A, Q) {
    let B = Q[0] - A[0],
      G = Q[1] - A[1];
    if (G < 0) B -= 1, G += EnA;
    return [B, G]
  }
  zFB.hrTimeDuration = P76;

  function j76(A) {
    let Q = HFB,
      B = `${"0".repeat(Q)}${A[1]}Z`,
      G = B.substring(B.length - Q - 1);
    return new Date(A[0] * 1000).toISOString().replace("000Z", G)
  }
  zFB.hrTimeToTimeStamp = j76;

  function S76(A) {
    return A[0] * EnA + A[1]
  }
  zFB.hrTimeToNanoseconds = S76;

  function _76(A) {
    return A[0] * 1000 + A[1] / 1e6
  }
  zFB.hrTimeToMilliseconds = _76;

  function k76(A) {
    return A[0] * 1e6 + A[1] / 1000
  }
  zFB.hrTimeToMicroseconds = k76;

  function Tf1(A) {
    return Array.isArray(A) && A.length === 2 && typeof A[0] === "number" && typeof A[1] === "number"
  }
  zFB.isTimeInputHrTime = Tf1;

  function y76(A) {
    return Tf1(A) || typeof A === "number" || A instanceof Date
  }
  zFB.isTimeInput = y76;

  function EFB(A, Q) {
    let B = [A[0] + Q[0], A[1] + Q[1]];
    if (B[1] >= EnA) B[1] -= EnA, B[0] += 1;
    return B
  }
  zFB.addHrTimes = EFB
})
// @from(Start 5336227, End 5336499)
qFB = z((wFB) => {
  Object.defineProperty(wFB, "__esModule", {
    value: !0
  });
  wFB.ExportResultCode = void 0;
  var l76;
  (function(A) {
    A[A.SUCCESS = 0] = "SUCCESS", A[A.FAILED = 1] = "FAILED"
  })(l76 = wFB.ExportResultCode || (wFB.ExportResultCode = {}))
})
// @from(Start 5336505, End 5337505)
RFB = z((MFB) => {
  Object.defineProperty(MFB, "__esModule", {
    value: !0
  });
  MFB.CompositePropagator = void 0;
  var NFB = K9();
  class LFB {
    _propagators;
    _fields;
    constructor(A = {}) {
      this._propagators = A.propagators ?? [], this._fields = Array.from(new Set(this._propagators.map((Q) => typeof Q.fields === "function" ? Q.fields() : []).reduce((Q, B) => Q.concat(B), [])))
    }
    inject(A, Q, B) {
      for (let G of this._propagators) try {
        G.inject(A, Q, B)
      } catch (Z) {
        NFB.diag.warn(`Failed to inject with ${G.constructor.name}. Err: ${Z.message}`)
      }
    }
    extract(A, Q, B) {
      return this._propagators.reduce((G, Z) => {
        try {
          return Z.extract(G, Q, B)
        } catch (I) {
          NFB.diag.warn(`Failed to extract with ${Z.constructor.name}. Err: ${I.message}`)
        }
        return G
      }, A)
    }
    fields() {
      return this._fields.slice()
    }
  }
  MFB.CompositePropagator = LFB
})
// @from(Start 5337511, End 5338016)
jFB = z((TFB) => {
  Object.defineProperty(TFB, "__esModule", {
    value: !0
  });
  TFB.validateValue = TFB.validateKey = void 0;
  var jf1 = "[_0-9a-z-*/]",
    i76 = `[a-z]${jf1}{0,255}`,
    n76 = `[a-z0-9]${jf1}{0,240}@[a-z]${jf1}{0,13}`,
    a76 = new RegExp(`^(?:${i76}|${n76})$`),
    s76 = /^[ -~]{0,255}[!-~]$/,
    r76 = /,|=/;

  function o76(A) {
    return a76.test(A)
  }
  TFB.validateKey = o76;

  function t76(A) {
    return s76.test(A) && !r76.test(A)
  }
  TFB.validateValue = t76
})
// @from(Start 5338022, End 5339536)
_f1 = z((xFB) => {
  Object.defineProperty(xFB, "__esModule", {
    value: !0
  });
  xFB.TraceState = void 0;
  var SFB = jFB(),
    _FB = 32,
    AG6 = 512,
    kFB = ",",
    yFB = "=";
  class Sf1 {
    _internalState = new Map;
    constructor(A) {
      if (A) this._parse(A)
    }
    set(A, Q) {
      let B = this._clone();
      if (B._internalState.has(A)) B._internalState.delete(A);
      return B._internalState.set(A, Q), B
    }
    unset(A) {
      let Q = this._clone();
      return Q._internalState.delete(A), Q
    }
    get(A) {
      return this._internalState.get(A)
    }
    serialize() {
      return this._keys().reduce((A, Q) => {
        return A.push(Q + yFB + this.get(Q)), A
      }, []).join(kFB)
    }
    _parse(A) {
      if (A.length > AG6) return;
      if (this._internalState = A.split(kFB).reverse().reduce((Q, B) => {
          let G = B.trim(),
            Z = G.indexOf(yFB);
          if (Z !== -1) {
            let I = G.slice(0, Z),
              Y = G.slice(Z + 1, B.length);
            if ((0, SFB.validateKey)(I) && (0, SFB.validateValue)(Y)) Q.set(I, Y)
          }
          return Q
        }, new Map), this._internalState.size > _FB) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, _FB))
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse()
    }
    _clone() {
      let A = new Sf1;
      return A._internalState = new Map(this._internalState), A
    }
  }
  xFB.TraceState = Sf1
})
// @from(Start 5339542, End 5341385)
uFB = z((hFB) => {
  Object.defineProperty(hFB, "__esModule", {
    value: !0
  });
  hFB.W3CTraceContextPropagator = hFB.parseTraceParent = hFB.TRACE_STATE_HEADER = hFB.TRACE_PARENT_HEADER = void 0;
  var znA = K9(),
    QG6 = BUA(),
    BG6 = _f1();
  hFB.TRACE_PARENT_HEADER = "traceparent";
  hFB.TRACE_STATE_HEADER = "tracestate";
  var GG6 = "00",
    ZG6 = "(?!ff)[\\da-f]{2}",
    IG6 = "(?![0]{32})[\\da-f]{32}",
    YG6 = "(?![0]{16})[\\da-f]{16}",
    JG6 = "[\\da-f]{2}",
    WG6 = new RegExp(`^\\s?(${ZG6})-(${IG6})-(${YG6})-(${JG6})(-.*)?\\s?$`);

  function bFB(A) {
    let Q = WG6.exec(A);
    if (!Q) return null;
    if (Q[1] === "00" && Q[5]) return null;
    return {
      traceId: Q[2],
      spanId: Q[3],
      traceFlags: parseInt(Q[4], 16)
    }
  }
  hFB.parseTraceParent = bFB;
  class fFB {
    inject(A, Q, B) {
      let G = znA.trace.getSpanContext(A);
      if (!G || (0, QG6.isTracingSuppressed)(A) || !(0, znA.isSpanContextValid)(G)) return;
      let Z = `${GG6}-${G.traceId}-${G.spanId}-0${Number(G.traceFlags||znA.TraceFlags.NONE).toString(16)}`;
      if (B.set(Q, hFB.TRACE_PARENT_HEADER, Z), G.traceState) B.set(Q, hFB.TRACE_STATE_HEADER, G.traceState.serialize())
    }
    extract(A, Q, B) {
      let G = B.get(Q, hFB.TRACE_PARENT_HEADER);
      if (!G) return A;
      let Z = Array.isArray(G) ? G[0] : G;
      if (typeof Z !== "string") return A;
      let I = bFB(Z);
      if (!I) return A;
      I.isRemote = !0;
      let Y = B.get(Q, hFB.TRACE_STATE_HEADER);
      if (Y) {
        let J = Array.isArray(Y) ? Y.join(",") : Y;
        I.traceState = new BG6.TraceState(typeof J === "string" ? J : void 0)
      }
      return znA.trace.setSpanContext(A, I)
    }
    fields() {
      return [hFB.TRACE_PARENT_HEADER, hFB.TRACE_STATE_HEADER]
    }
  }
  hFB.W3CTraceContextPropagator = fFB
})
// @from(Start 5341391, End 5342012)
pFB = z((dFB) => {
  Object.defineProperty(dFB, "__esModule", {
    value: !0
  });
  dFB.getRPCMetadata = dFB.deleteRPCMetadata = dFB.setRPCMetadata = dFB.RPCType = void 0;
  var VG6 = K9(),
    kf1 = (0, VG6.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA"),
    FG6;
  (function(A) {
    A.HTTP = "http"
  })(FG6 = dFB.RPCType || (dFB.RPCType = {}));

  function KG6(A, Q) {
    return A.setValue(kf1, Q)
  }
  dFB.setRPCMetadata = KG6;

  function DG6(A) {
    return A.deleteValue(kf1)
  }
  dFB.deleteRPCMetadata = DG6;

  function HG6(A) {
    return A.getValue(kf1)
  }
  dFB.getRPCMetadata = HG6
})
// @from(Start 5342018, End 5343232)
oFB = z((sFB) => {
  Object.defineProperty(sFB, "__esModule", {
    value: !0
  });
  sFB.isPlainObject = void 0;
  var zG6 = "[object Object]",
    UG6 = "[object Null]",
    $G6 = "[object Undefined]",
    wG6 = Function.prototype,
    lFB = wG6.toString,
    qG6 = lFB.call(Object),
    NG6 = Object.getPrototypeOf,
    iFB = Object.prototype,
    nFB = iFB.hasOwnProperty,
    Nt = Symbol ? Symbol.toStringTag : void 0,
    aFB = iFB.toString;

  function LG6(A) {
    if (!MG6(A) || OG6(A) !== zG6) return !1;
    let Q = NG6(A);
    if (Q === null) return !0;
    let B = nFB.call(Q, "constructor") && Q.constructor;
    return typeof B == "function" && B instanceof B && lFB.call(B) === qG6
  }
  sFB.isPlainObject = LG6;

  function MG6(A) {
    return A != null && typeof A == "object"
  }

  function OG6(A) {
    if (A == null) return A === void 0 ? $G6 : UG6;
    return Nt && Nt in Object(A) ? RG6(A) : TG6(A)
  }

  function RG6(A) {
    let Q = nFB.call(A, Nt),
      B = A[Nt],
      G = !1;
    try {
      A[Nt] = void 0, G = !0
    } catch {}
    let Z = aFB.call(A);
    if (G)
      if (Q) A[Nt] = B;
      else delete A[Nt];
    return Z
  }

  function TG6(A) {
    return aFB.call(A)
  }
})
// @from(Start 5343238, End 5345666)
ZKB = z((BKB) => {
  Object.defineProperty(BKB, "__esModule", {
    value: !0
  });
  BKB.merge = void 0;
  var tFB = oFB(),
    PG6 = 20;

  function jG6(...A) {
    let Q = A.shift(),
      B = new WeakMap;
    while (A.length > 0) Q = AKB(Q, A.shift(), 0, B);
    return Q
  }
  BKB.merge = jG6;

  function yf1(A) {
    if (qnA(A)) return A.slice();
    return A
  }

  function AKB(A, Q, B = 0, G) {
    let Z;
    if (B > PG6) return;
    if (B++, wnA(A) || wnA(Q) || QKB(Q)) Z = yf1(Q);
    else if (qnA(A)) {
      if (Z = A.slice(), qnA(Q))
        for (let I = 0, Y = Q.length; I < Y; I++) Z.push(yf1(Q[I]));
      else if (IUA(Q)) {
        let I = Object.keys(Q);
        for (let Y = 0, J = I.length; Y < J; Y++) {
          let W = I[Y];
          Z[W] = yf1(Q[W])
        }
      }
    } else if (IUA(A))
      if (IUA(Q)) {
        if (!SG6(A, Q)) return Q;
        Z = Object.assign({}, A);
        let I = Object.keys(Q);
        for (let Y = 0, J = I.length; Y < J; Y++) {
          let W = I[Y],
            X = Q[W];
          if (wnA(X))
            if (typeof X > "u") delete Z[W];
            else Z[W] = X;
          else {
            let V = Z[W],
              F = X;
            if (eFB(A, W, G) || eFB(Q, W, G)) delete Z[W];
            else {
              if (IUA(V) && IUA(F)) {
                let K = G.get(V) || [],
                  D = G.get(F) || [];
                K.push({
                  obj: A,
                  key: W
                }), D.push({
                  obj: Q,
                  key: W
                }), G.set(V, K), G.set(F, D)
              }
              Z[W] = AKB(Z[W], X, B, G)
            }
          }
        }
      } else Z = Q;
    return Z
  }

  function eFB(A, Q, B) {
    let G = B.get(A[Q]) || [];
    for (let Z = 0, I = G.length; Z < I; Z++) {
      let Y = G[Z];
      if (Y.key === Q && Y.obj === A) return !0
    }
    return !1
  }

  function qnA(A) {
    return Array.isArray(A)
  }

  function QKB(A) {
    return typeof A === "function"
  }

  function IUA(A) {
    return !wnA(A) && !qnA(A) && !QKB(A) && typeof A === "object"
  }

  function wnA(A) {
    return typeof A === "string" || typeof A === "number" || typeof A === "boolean" || typeof A > "u" || A instanceof Date || A instanceof RegExp || A === null
  }

  function SG6(A, Q) {
    if (!(0, tFB.isPlainObject)(A) || !(0, tFB.isPlainObject)(Q)) return !1;
    return !0
  }
})
// @from(Start 5345672, End 5346288)
JKB = z((IKB) => {
  Object.defineProperty(IKB, "__esModule", {
    value: !0
  });
  IKB.callWithTimeout = IKB.TimeoutError = void 0;
  class NnA extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, NnA.prototype)
    }
  }
  IKB.TimeoutError = NnA;

  function _G6(A, Q) {
    let B, G = new Promise(function(I, Y) {
      B = setTimeout(function() {
        Y(new NnA("Operation timed out."))
      }, Q)
    });
    return Promise.race([A, G]).then((Z) => {
      return clearTimeout(B), Z
    }, (Z) => {
      throw clearTimeout(B), Z
    })
  }
  IKB.callWithTimeout = _G6
})
// @from(Start 5346294, End 5346697)
FKB = z((XKB) => {
  Object.defineProperty(XKB, "__esModule", {
    value: !0
  });
  XKB.isUrlIgnored = XKB.urlMatches = void 0;

  function WKB(A, Q) {
    if (typeof Q === "string") return A === Q;
    else return !!A.match(Q)
  }
  XKB.urlMatches = WKB;

  function yG6(A, Q) {
    if (!Q) return !1;
    for (let B of Q)
      if (WKB(A, B)) return !0;
    return !1
  }
  XKB.isUrlIgnored = yG6
})
// @from(Start 5346703, End 5347162)
CKB = z((DKB) => {
  Object.defineProperty(DKB, "__esModule", {
    value: !0
  });
  DKB.Deferred = void 0;
  class KKB {
    _promise;
    _resolve;
    _reject;
    constructor() {
      this._promise = new Promise((A, Q) => {
        this._resolve = A, this._reject = Q
      })
    }
    get promise() {
      return this._promise
    }
    resolve(A) {
      this._resolve(A)
    }
    reject(A) {
      this._reject(A)
    }
  }
  DKB.Deferred = KKB
})
// @from(Start 5347168, End 5347960)
$KB = z((zKB) => {
  Object.defineProperty(zKB, "__esModule", {
    value: !0
  });
  zKB.BindOnceFuture = void 0;
  var vG6 = CKB();
  class EKB {
    _callback;
    _that;
    _isCalled = !1;
    _deferred = new vG6.Deferred;
    constructor(A, Q) {
      this._callback = A, this._that = Q
    }
    get isCalled() {
      return this._isCalled
    }
    get promise() {
      return this._deferred.promise
    }
    call(...A) {
      if (!this._isCalled) {
        this._isCalled = !0;
        try {
          Promise.resolve(this._callback.call(this._that, ...A)).then((Q) => this._deferred.resolve(Q), (Q) => this._deferred.reject(Q))
        } catch (Q) {
          this._deferred.reject(Q)
        }
      }
      return this._deferred.promise
    }
  }
  zKB.BindOnceFuture = EKB
})
// @from(Start 5347966, End 5348648)
LKB = z((qKB) => {
  Object.defineProperty(qKB, "__esModule", {
    value: !0
  });
  qKB.diagLogLevelFromString = void 0;
  var cb = K9(),
    wKB = {
      ALL: cb.DiagLogLevel.ALL,
      VERBOSE: cb.DiagLogLevel.VERBOSE,
      DEBUG: cb.DiagLogLevel.DEBUG,
      INFO: cb.DiagLogLevel.INFO,
      WARN: cb.DiagLogLevel.WARN,
      ERROR: cb.DiagLogLevel.ERROR,
      NONE: cb.DiagLogLevel.NONE
    };

  function bG6(A) {
    if (A == null) return;
    let Q = wKB[A.toUpperCase()];
    if (Q == null) return cb.diag.warn(`Unknown log level "${A}", expected one of ${Object.keys(wKB)}, using default`), cb.DiagLogLevel.INFO;
    return Q
  }
  qKB.diagLogLevelFromString = bG6
})
// @from(Start 5348654, End 5349029)
TKB = z((OKB) => {
  Object.defineProperty(OKB, "__esModule", {
    value: !0
  });
  OKB._export = void 0;
  var MKB = K9(),
    fG6 = BUA();

  function hG6(A, Q) {
    return new Promise((B) => {
      MKB.context.with((0, fG6.suppressTracing)(MKB.context.active()), () => {
        A.export(Q, (G) => {
          B(G)
        })
      })
    })
  }
  OKB._export = hG6
})