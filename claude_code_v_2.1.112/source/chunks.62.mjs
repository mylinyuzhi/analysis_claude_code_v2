
// @from(Ln 160318, Col 4)
vlq = p((flq) => {
    Object.defineProperty(flq, "__esModule", {
        value: !0
    });
    flq.getStringListFromEnv = flq.getBooleanFromEnv = flq.getStringFromEnv = flq.getNumberFromEnv = void 0;
    var Wlq = $5(),
        Dlq = d6("util");

    function OH_(q) {
        let K = process.env[q];
        if (K == null || K.trim() === "") return;
        let _ = Number(K);
        if (isNaN(_)) {
            Wlq.diag.warn(`Unknown value ${(0,Dlq.inspect)(K)} for ${q}, expected a number, using defaults`);
            return
        }
        return _
    }
    flq.getNumberFromEnv = OH_;

    function Zlq(q) {
        let K = process.env[q];
        if (K == null || K.trim() === "") return;
        return K
    }
    flq.getStringFromEnv = Zlq;

    function wH_(q) {
        let K = process.env[q]?.trim().toLowerCase();
        if (K == null || K === "") return !1;
        if (K === "true") return !0;
        else if (K === "false") return !1;
        else return Wlq.diag.warn(`Unknown value ${(0,Dlq.inspect)(K)} for ${q}, expected 'true' or 'false', falling back to 'false' (default)`), !1
    }
    flq.getBooleanFromEnv = wH_;

    function $H_(q) {
        return Zlq(q)?.split(",").map((K) => K.trim()).filter((K) => K !== "")
    }
    flq.getStringListFromEnv = $H_
})
// @from(Ln 160359, Col 4)
klq = p((Tlq) => {
    Object.defineProperty(Tlq, "__esModule", {
        value: !0
    });
    Tlq._globalThis = void 0;
    Tlq._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 160366, Col 4)
ylq = p((Nlq) => {
    Object.defineProperty(Nlq, "__esModule", {
        value: !0
    });
    Nlq.otperformance = void 0;
    var XH_ = d6("perf_hooks");
    Nlq.otperformance = XH_.performance
})
// @from(Ln 160374, Col 4)
Rlq = p((Llq) => {
    Object.defineProperty(Llq, "__esModule", {
        value: !0
    });
    Llq.VERSION = void 0;
    Llq.VERSION = "2.2.0"
})
// @from(Ln 160381, Col 4)
KC1 = p((Slq) => {
    Object.defineProperty(Slq, "__esModule", {
        value: !0
    });
    Slq.createConstMap = void 0;

    function MH_(q) {
        let K = {},
            _ = q.length;
        for (let z = 0; z < _; z++) {
            let Y = q[z];
            if (Y) K[String(Y).toUpperCase().replace(/[-.]/g, "_")] = Y
        }
        return K
    }
    Slq.createConstMap = MH_
})
// @from(Ln 160398, Col 4)
haq = p((Taq) => {
    Object.defineProperty(Taq, "__esModule", {
        value: !0
    });
    Taq.SEMATTRS_NET_HOST_CARRIER_ICC = Taq.SEMATTRS_NET_HOST_CARRIER_MNC = Taq.SEMATTRS_NET_HOST_CARRIER_MCC = Taq.SEMATTRS_NET_HOST_CARRIER_NAME = Taq.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = Taq.SEMATTRS_NET_HOST_CONNECTION_TYPE = Taq.SEMATTRS_NET_HOST_NAME = Taq.SEMATTRS_NET_HOST_PORT = Taq.SEMATTRS_NET_HOST_IP = Taq.SEMATTRS_NET_PEER_NAME = Taq.SEMATTRS_NET_PEER_PORT = Taq.SEMATTRS_NET_PEER_IP = Taq.SEMATTRS_NET_TRANSPORT = Taq.SEMATTRS_FAAS_INVOKED_REGION = Taq.SEMATTRS_FAAS_INVOKED_PROVIDER = Taq.SEMATTRS_FAAS_INVOKED_NAME = Taq.SEMATTRS_FAAS_COLDSTART = Taq.SEMATTRS_FAAS_CRON = Taq.SEMATTRS_FAAS_TIME = Taq.SEMATTRS_FAAS_DOCUMENT_NAME = Taq.SEMATTRS_FAAS_DOCUMENT_TIME = Taq.SEMATTRS_FAAS_DOCUMENT_OPERATION = Taq.SEMATTRS_FAAS_DOCUMENT_COLLECTION = Taq.SEMATTRS_FAAS_EXECUTION = Taq.SEMATTRS_FAAS_TRIGGER = Taq.SEMATTRS_EXCEPTION_ESCAPED = Taq.SEMATTRS_EXCEPTION_STACKTRACE = Taq.SEMATTRS_EXCEPTION_MESSAGE = Taq.SEMATTRS_EXCEPTION_TYPE = Taq.SEMATTRS_DB_SQL_TABLE = Taq.SEMATTRS_DB_MONGODB_COLLECTION = Taq.SEMATTRS_DB_REDIS_DATABASE_INDEX = Taq.SEMATTRS_DB_HBASE_NAMESPACE = Taq.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = Taq.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = Taq.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = Taq.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = Taq.SEMATTRS_DB_CASSANDRA_TABLE = Taq.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = Taq.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = Taq.SEMATTRS_DB_CASSANDRA_KEYSPACE = Taq.SEMATTRS_DB_MSSQL_INSTANCE_NAME = Taq.SEMATTRS_DB_OPERATION = Taq.SEMATTRS_DB_STATEMENT = Taq.SEMATTRS_DB_NAME = Taq.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = Taq.SEMATTRS_DB_USER = Taq.SEMATTRS_DB_CONNECTION_STRING = Taq.SEMATTRS_DB_SYSTEM = Taq.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
    Taq.SEMATTRS_MESSAGING_DESTINATION_KIND = Taq.SEMATTRS_MESSAGING_DESTINATION = Taq.SEMATTRS_MESSAGING_SYSTEM = Taq.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = Taq.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = Taq.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = Taq.SEMATTRS_AWS_DYNAMODB_COUNT = Taq.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = Taq.SEMATTRS_AWS_DYNAMODB_SEGMENT = Taq.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = Taq.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = Taq.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = Taq.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = Taq.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = Taq.SEMATTRS_AWS_DYNAMODB_SELECT = Taq.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = Taq.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = Taq.SEMATTRS_AWS_DYNAMODB_LIMIT = Taq.SEMATTRS_AWS_DYNAMODB_PROJECTION = Taq.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = Taq.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = Taq.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = Taq.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = Taq.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = Taq.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = Taq.SEMATTRS_HTTP_CLIENT_IP = Taq.SEMATTRS_HTTP_ROUTE = Taq.SEMATTRS_HTTP_SERVER_NAME = Taq.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = Taq.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = Taq.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = Taq.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = Taq.SEMATTRS_HTTP_USER_AGENT = Taq.SEMATTRS_HTTP_FLAVOR = Taq.SEMATTRS_HTTP_STATUS_CODE = Taq.SEMATTRS_HTTP_SCHEME = Taq.SEMATTRS_HTTP_HOST = Taq.SEMATTRS_HTTP_TARGET = Taq.SEMATTRS_HTTP_URL = Taq.SEMATTRS_HTTP_METHOD = Taq.SEMATTRS_CODE_LINENO = Taq.SEMATTRS_CODE_FILEPATH = Taq.SEMATTRS_CODE_NAMESPACE = Taq.SEMATTRS_CODE_FUNCTION = Taq.SEMATTRS_THREAD_NAME = Taq.SEMATTRS_THREAD_ID = Taq.SEMATTRS_ENDUSER_SCOPE = Taq.SEMATTRS_ENDUSER_ROLE = Taq.SEMATTRS_ENDUSER_ID = Taq.SEMATTRS_PEER_SERVICE = void 0;
    Taq.DBSYSTEMVALUES_FILEMAKER = Taq.DBSYSTEMVALUES_DERBY = Taq.DBSYSTEMVALUES_FIREBIRD = Taq.DBSYSTEMVALUES_ADABAS = Taq.DBSYSTEMVALUES_CACHE = Taq.DBSYSTEMVALUES_EDB = Taq.DBSYSTEMVALUES_FIRSTSQL = Taq.DBSYSTEMVALUES_INGRES = Taq.DBSYSTEMVALUES_HANADB = Taq.DBSYSTEMVALUES_MAXDB = Taq.DBSYSTEMVALUES_PROGRESS = Taq.DBSYSTEMVALUES_HSQLDB = Taq.DBSYSTEMVALUES_CLOUDSCAPE = Taq.DBSYSTEMVALUES_HIVE = Taq.DBSYSTEMVALUES_REDSHIFT = Taq.DBSYSTEMVALUES_POSTGRESQL = Taq.DBSYSTEMVALUES_DB2 = Taq.DBSYSTEMVALUES_ORACLE = Taq.DBSYSTEMVALUES_MYSQL = Taq.DBSYSTEMVALUES_MSSQL = Taq.DBSYSTEMVALUES_OTHER_SQL = Taq.SemanticAttributes = Taq.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = Taq.SEMATTRS_MESSAGE_COMPRESSED_SIZE = Taq.SEMATTRS_MESSAGE_ID = Taq.SEMATTRS_MESSAGE_TYPE = Taq.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = Taq.SEMATTRS_RPC_JSONRPC_ERROR_CODE = Taq.SEMATTRS_RPC_JSONRPC_REQUEST_ID = Taq.SEMATTRS_RPC_JSONRPC_VERSION = Taq.SEMATTRS_RPC_GRPC_STATUS_CODE = Taq.SEMATTRS_RPC_METHOD = Taq.SEMATTRS_RPC_SERVICE = Taq.SEMATTRS_RPC_SYSTEM = Taq.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = Taq.SEMATTRS_MESSAGING_KAFKA_PARTITION = Taq.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = Taq.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = Taq.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = Taq.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = Taq.SEMATTRS_MESSAGING_CONSUMER_ID = Taq.SEMATTRS_MESSAGING_OPERATION = Taq.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = Taq.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = Taq.SEMATTRS_MESSAGING_CONVERSATION_ID = Taq.SEMATTRS_MESSAGING_MESSAGE_ID = Taq.SEMATTRS_MESSAGING_URL = Taq.SEMATTRS_MESSAGING_PROTOCOL_VERSION = Taq.SEMATTRS_MESSAGING_PROTOCOL = Taq.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
    Taq.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = Taq.FaasDocumentOperationValues = Taq.FAASDOCUMENTOPERATIONVALUES_DELETE = Taq.FAASDOCUMENTOPERATIONVALUES_EDIT = Taq.FAASDOCUMENTOPERATIONVALUES_INSERT = Taq.FaasTriggerValues = Taq.FAASTRIGGERVALUES_OTHER = Taq.FAASTRIGGERVALUES_TIMER = Taq.FAASTRIGGERVALUES_PUBSUB = Taq.FAASTRIGGERVALUES_HTTP = Taq.FAASTRIGGERVALUES_DATASOURCE = Taq.DbCassandraConsistencyLevelValues = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = Taq.DbSystemValues = Taq.DBSYSTEMVALUES_COCKROACHDB = Taq.DBSYSTEMVALUES_MEMCACHED = Taq.DBSYSTEMVALUES_ELASTICSEARCH = Taq.DBSYSTEMVALUES_GEODE = Taq.DBSYSTEMVALUES_NEO4J = Taq.DBSYSTEMVALUES_DYNAMODB = Taq.DBSYSTEMVALUES_COSMOSDB = Taq.DBSYSTEMVALUES_COUCHDB = Taq.DBSYSTEMVALUES_COUCHBASE = Taq.DBSYSTEMVALUES_REDIS = Taq.DBSYSTEMVALUES_MONGODB = Taq.DBSYSTEMVALUES_HBASE = Taq.DBSYSTEMVALUES_CASSANDRA = Taq.DBSYSTEMVALUES_COLDFUSION = Taq.DBSYSTEMVALUES_H2 = Taq.DBSYSTEMVALUES_VERTICA = Taq.DBSYSTEMVALUES_TERADATA = Taq.DBSYSTEMVALUES_SYBASE = Taq.DBSYSTEMVALUES_SQLITE = Taq.DBSYSTEMVALUES_POINTBASE = Taq.DBSYSTEMVALUES_PERVASIVE = Taq.DBSYSTEMVALUES_NETEZZA = Taq.DBSYSTEMVALUES_MARIADB = Taq.DBSYSTEMVALUES_INTERBASE = Taq.DBSYSTEMVALUES_INSTANTDB = Taq.DBSYSTEMVALUES_INFORMIX = void 0;
    Taq.MESSAGINGOPERATIONVALUES_RECEIVE = Taq.MessagingDestinationKindValues = Taq.MESSAGINGDESTINATIONKINDVALUES_TOPIC = Taq.MESSAGINGDESTINATIONKINDVALUES_QUEUE = Taq.HttpFlavorValues = Taq.HTTPFLAVORVALUES_QUIC = Taq.HTTPFLAVORVALUES_SPDY = Taq.HTTPFLAVORVALUES_HTTP_2_0 = Taq.HTTPFLAVORVALUES_HTTP_1_1 = Taq.HTTPFLAVORVALUES_HTTP_1_0 = Taq.NetHostConnectionSubtypeValues = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_NR = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = Taq.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = Taq.NetHostConnectionTypeValues = Taq.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = Taq.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = Taq.NETHOSTCONNECTIONTYPEVALUES_CELL = Taq.NETHOSTCONNECTIONTYPEVALUES_WIRED = Taq.NETHOSTCONNECTIONTYPEVALUES_WIFI = Taq.NetTransportValues = Taq.NETTRANSPORTVALUES_OTHER = Taq.NETTRANSPORTVALUES_INPROC = Taq.NETTRANSPORTVALUES_PIPE = Taq.NETTRANSPORTVALUES_UNIX = Taq.NETTRANSPORTVALUES_IP = Taq.NETTRANSPORTVALUES_IP_UDP = Taq.NETTRANSPORTVALUES_IP_TCP = Taq.FaasInvokedProviderValues = Taq.FAASINVOKEDPROVIDERVALUES_GCP = Taq.FAASINVOKEDPROVIDERVALUES_AZURE = Taq.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
    Taq.MessageTypeValues = Taq.MESSAGETYPEVALUES_RECEIVED = Taq.MESSAGETYPEVALUES_SENT = Taq.RpcGrpcStatusCodeValues = Taq.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = Taq.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = Taq.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = Taq.RPCGRPCSTATUSCODEVALUES_INTERNAL = Taq.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = Taq.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = Taq.RPCGRPCSTATUSCODEVALUES_ABORTED = Taq.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = Taq.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = Taq.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = Taq.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = Taq.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = Taq.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = Taq.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = Taq.RPCGRPCSTATUSCODEVALUES_UNKNOWN = Taq.RPCGRPCSTATUSCODEVALUES_CANCELLED = Taq.RPCGRPCSTATUSCODEVALUES_OK = Taq.MessagingOperationValues = Taq.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
    var jI = KC1(),
        blq = "aws.lambda.invoked_arn",
        Ilq = "db.system",
        xlq = "db.connection_string",
        ulq = "db.user",
        mlq = "db.jdbc.driver_classname",
        Blq = "db.name",
        plq = "db.statement",
        Flq = "db.operation",
        glq = "db.mssql.instance_name",
        Ulq = "db.cassandra.keyspace",
        Qlq = "db.cassandra.page_size",
        dlq = "db.cassandra.consistency_level",
        clq = "db.cassandra.table",
        llq = "db.cassandra.idempotence",
        nlq = "db.cassandra.speculative_execution_count",
        ilq = "db.cassandra.coordinator.id",
        rlq = "db.cassandra.coordinator.dc",
        olq = "db.hbase.namespace",
        alq = "db.redis.database_index",
        slq = "db.mongodb.collection",
        tlq = "db.sql.table",
        elq = "exception.type",
        qnq = "exception.message",
        Knq = "exception.stacktrace",
        _nq = "exception.escaped",
        znq = "faas.trigger",
        Ynq = "faas.execution",
        Anq = "faas.document.collection",
        Onq = "faas.document.operation",
        wnq = "faas.document.time",
        $nq = "faas.document.name",
        jnq = "faas.time",
        Hnq = "faas.cron",
        Jnq = "faas.coldstart",
        Xnq = "faas.invoked_name",
        Mnq = "faas.invoked_provider",
        Pnq = "faas.invoked_region",
        Wnq = "net.transport",
        Dnq = "net.peer.ip",
        Znq = "net.peer.port",
        fnq = "net.peer.name",
        Gnq = "net.host.ip",
        vnq = "net.host.port",
        Tnq = "net.host.name",
        Vnq = "net.host.connection.type",
        knq = "net.host.connection.subtype",
        Nnq = "net.host.carrier.name",
        Enq = "net.host.carrier.mcc",
        ynq = "net.host.carrier.mnc",
        Lnq = "net.host.carrier.icc",
        hnq = "peer.service",
        Rnq = "enduser.id",
        Snq = "enduser.role",
        Cnq = "enduser.scope",
        bnq = "thread.id",
        Inq = "thread.name",
        xnq = "code.function",
        unq = "code.namespace",
        mnq = "code.filepath",
        Bnq = "code.lineno",
        pnq = "http.method",
        Fnq = "http.url",
        gnq = "http.target",
        Unq = "http.host",
        Qnq = "http.scheme",
        dnq = "http.status_code",
        cnq = "http.flavor",
        lnq = "http.user_agent",
        nnq = "http.request_content_length",
        inq = "http.request_content_length_uncompressed",
        rnq = "http.response_content_length",
        onq = "http.response_content_length_uncompressed",
        anq = "http.server_name",
        snq = "http.route",
        tnq = "http.client_ip",
        enq = "aws.dynamodb.table_names",
        qiq = "aws.dynamodb.consumed_capacity",
        Kiq = "aws.dynamodb.item_collection_metrics",
        _iq = "aws.dynamodb.provisioned_read_capacity",
        ziq = "aws.dynamodb.provisioned_write_capacity",
        Yiq = "aws.dynamodb.consistent_read",
        Aiq = "aws.dynamodb.projection",
        Oiq = "aws.dynamodb.limit",
        wiq = "aws.dynamodb.attributes_to_get",
        $iq = "aws.dynamodb.index_name",
        jiq = "aws.dynamodb.select",
        Hiq = "aws.dynamodb.global_secondary_indexes",
        Jiq = "aws.dynamodb.local_secondary_indexes",
        Xiq = "aws.dynamodb.exclusive_start_table",
        Miq = "aws.dynamodb.table_count",
        Piq = "aws.dynamodb.scan_forward",
        Wiq = "aws.dynamodb.segment",
        Diq = "aws.dynamodb.total_segments",
        Ziq = "aws.dynamodb.count",
        fiq = "aws.dynamodb.scanned_count",
        Giq = "aws.dynamodb.attribute_definitions",
        viq = "aws.dynamodb.global_secondary_index_updates",
        Tiq = "messaging.system",
        Viq = "messaging.destination",
        kiq = "messaging.destination_kind",
        Niq = "messaging.temp_destination",
        Eiq = "messaging.protocol",
        yiq = "messaging.protocol_version",
        Liq = "messaging.url",
        hiq = "messaging.message_id",
        Riq = "messaging.conversation_id",
        Siq = "messaging.message_payload_size_bytes",
        Ciq = "messaging.message_payload_compressed_size_bytes",
        biq = "messaging.operation",
        Iiq = "messaging.consumer_id",
        xiq = "messaging.rabbitmq.routing_key",
        uiq = "messaging.kafka.message_key",
        miq = "messaging.kafka.consumer_group",
        Biq = "messaging.kafka.client_id",
        piq = "messaging.kafka.partition",
        Fiq = "messaging.kafka.tombstone",
        giq = "rpc.system",
        Uiq = "rpc.service",
        Qiq = "rpc.method",
        diq = "rpc.grpc.status_code",
        ciq = "rpc.jsonrpc.version",
        liq = "rpc.jsonrpc.request_id",
        niq = "rpc.jsonrpc.error_code",
        iiq = "rpc.jsonrpc.error_message",
        riq = "message.type",
        oiq = "message.id",
        aiq = "message.compressed_size",
        siq = "message.uncompressed_size";
    Taq.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = blq;
    Taq.SEMATTRS_DB_SYSTEM = Ilq;
    Taq.SEMATTRS_DB_CONNECTION_STRING = xlq;
    Taq.SEMATTRS_DB_USER = ulq;
    Taq.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = mlq;
    Taq.SEMATTRS_DB_NAME = Blq;
    Taq.SEMATTRS_DB_STATEMENT = plq;
    Taq.SEMATTRS_DB_OPERATION = Flq;
    Taq.SEMATTRS_DB_MSSQL_INSTANCE_NAME = glq;
    Taq.SEMATTRS_DB_CASSANDRA_KEYSPACE = Ulq;
    Taq.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = Qlq;
    Taq.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = dlq;
    Taq.SEMATTRS_DB_CASSANDRA_TABLE = clq;
    Taq.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = llq;
    Taq.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = nlq;
    Taq.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = ilq;
    Taq.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = rlq;
    Taq.SEMATTRS_DB_HBASE_NAMESPACE = olq;
    Taq.SEMATTRS_DB_REDIS_DATABASE_INDEX = alq;
    Taq.SEMATTRS_DB_MONGODB_COLLECTION = slq;
    Taq.SEMATTRS_DB_SQL_TABLE = tlq;
    Taq.SEMATTRS_EXCEPTION_TYPE = elq;
    Taq.SEMATTRS_EXCEPTION_MESSAGE = qnq;
    Taq.SEMATTRS_EXCEPTION_STACKTRACE = Knq;
    Taq.SEMATTRS_EXCEPTION_ESCAPED = _nq;
    Taq.SEMATTRS_FAAS_TRIGGER = znq;
    Taq.SEMATTRS_FAAS_EXECUTION = Ynq;
    Taq.SEMATTRS_FAAS_DOCUMENT_COLLECTION = Anq;
    Taq.SEMATTRS_FAAS_DOCUMENT_OPERATION = Onq;
    Taq.SEMATTRS_FAAS_DOCUMENT_TIME = wnq;
    Taq.SEMATTRS_FAAS_DOCUMENT_NAME = $nq;
    Taq.SEMATTRS_FAAS_TIME = jnq;
    Taq.SEMATTRS_FAAS_CRON = Hnq;
    Taq.SEMATTRS_FAAS_COLDSTART = Jnq;
    Taq.SEMATTRS_FAAS_INVOKED_NAME = Xnq;
    Taq.SEMATTRS_FAAS_INVOKED_PROVIDER = Mnq;
    Taq.SEMATTRS_FAAS_INVOKED_REGION = Pnq;
    Taq.SEMATTRS_NET_TRANSPORT = Wnq;
    Taq.SEMATTRS_NET_PEER_IP = Dnq;
    Taq.SEMATTRS_NET_PEER_PORT = Znq;
    Taq.SEMATTRS_NET_PEER_NAME = fnq;
    Taq.SEMATTRS_NET_HOST_IP = Gnq;
    Taq.SEMATTRS_NET_HOST_PORT = vnq;
    Taq.SEMATTRS_NET_HOST_NAME = Tnq;
    Taq.SEMATTRS_NET_HOST_CONNECTION_TYPE = Vnq;
    Taq.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = knq;
    Taq.SEMATTRS_NET_HOST_CARRIER_NAME = Nnq;
    Taq.SEMATTRS_NET_HOST_CARRIER_MCC = Enq;
    Taq.SEMATTRS_NET_HOST_CARRIER_MNC = ynq;
    Taq.SEMATTRS_NET_HOST_CARRIER_ICC = Lnq;
    Taq.SEMATTRS_PEER_SERVICE = hnq;
    Taq.SEMATTRS_ENDUSER_ID = Rnq;
    Taq.SEMATTRS_ENDUSER_ROLE = Snq;
    Taq.SEMATTRS_ENDUSER_SCOPE = Cnq;
    Taq.SEMATTRS_THREAD_ID = bnq;
    Taq.SEMATTRS_THREAD_NAME = Inq;
    Taq.SEMATTRS_CODE_FUNCTION = xnq;
    Taq.SEMATTRS_CODE_NAMESPACE = unq;
    Taq.SEMATTRS_CODE_FILEPATH = mnq;
    Taq.SEMATTRS_CODE_LINENO = Bnq;
    Taq.SEMATTRS_HTTP_METHOD = pnq;
    Taq.SEMATTRS_HTTP_URL = Fnq;
    Taq.SEMATTRS_HTTP_TARGET = gnq;
    Taq.SEMATTRS_HTTP_HOST = Unq;
    Taq.SEMATTRS_HTTP_SCHEME = Qnq;
    Taq.SEMATTRS_HTTP_STATUS_CODE = dnq;
    Taq.SEMATTRS_HTTP_FLAVOR = cnq;
    Taq.SEMATTRS_HTTP_USER_AGENT = lnq;
    Taq.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = nnq;
    Taq.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = inq;
    Taq.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = rnq;
    Taq.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = onq;
    Taq.SEMATTRS_HTTP_SERVER_NAME = anq;
    Taq.SEMATTRS_HTTP_ROUTE = snq;
    Taq.SEMATTRS_HTTP_CLIENT_IP = tnq;
    Taq.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = enq;
    Taq.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = qiq;
    Taq.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = Kiq;
    Taq.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = _iq;
    Taq.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = ziq;
    Taq.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = Yiq;
    Taq.SEMATTRS_AWS_DYNAMODB_PROJECTION = Aiq;
    Taq.SEMATTRS_AWS_DYNAMODB_LIMIT = Oiq;
    Taq.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = wiq;
    Taq.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = $iq;
    Taq.SEMATTRS_AWS_DYNAMODB_SELECT = jiq;
    Taq.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = Hiq;
    Taq.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = Jiq;
    Taq.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = Xiq;
    Taq.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = Miq;
    Taq.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = Piq;
    Taq.SEMATTRS_AWS_DYNAMODB_SEGMENT = Wiq;
    Taq.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = Diq;
    Taq.SEMATTRS_AWS_DYNAMODB_COUNT = Ziq;
    Taq.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = fiq;
    Taq.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = Giq;
    Taq.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = viq;
    Taq.SEMATTRS_MESSAGING_SYSTEM = Tiq;
    Taq.SEMATTRS_MESSAGING_DESTINATION = Viq;
    Taq.SEMATTRS_MESSAGING_DESTINATION_KIND = kiq;
    Taq.SEMATTRS_MESSAGING_TEMP_DESTINATION = Niq;
    Taq.SEMATTRS_MESSAGING_PROTOCOL = Eiq;
    Taq.SEMATTRS_MESSAGING_PROTOCOL_VERSION = yiq;
    Taq.SEMATTRS_MESSAGING_URL = Liq;
    Taq.SEMATTRS_MESSAGING_MESSAGE_ID = hiq;
    Taq.SEMATTRS_MESSAGING_CONVERSATION_ID = Riq;
    Taq.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = Siq;
    Taq.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = Ciq;
    Taq.SEMATTRS_MESSAGING_OPERATION = biq;
    Taq.SEMATTRS_MESSAGING_CONSUMER_ID = Iiq;
    Taq.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = xiq;
    Taq.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = uiq;
    Taq.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = miq;
    Taq.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = Biq;
    Taq.SEMATTRS_MESSAGING_KAFKA_PARTITION = piq;
    Taq.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = Fiq;
    Taq.SEMATTRS_RPC_SYSTEM = giq;
    Taq.SEMATTRS_RPC_SERVICE = Uiq;
    Taq.SEMATTRS_RPC_METHOD = Qiq;
    Taq.SEMATTRS_RPC_GRPC_STATUS_CODE = diq;
    Taq.SEMATTRS_RPC_JSONRPC_VERSION = ciq;
    Taq.SEMATTRS_RPC_JSONRPC_REQUEST_ID = liq;
    Taq.SEMATTRS_RPC_JSONRPC_ERROR_CODE = niq;
    Taq.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = iiq;
    Taq.SEMATTRS_MESSAGE_TYPE = riq;
    Taq.SEMATTRS_MESSAGE_ID = oiq;
    Taq.SEMATTRS_MESSAGE_COMPRESSED_SIZE = aiq;
    Taq.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = siq;
    Taq.SemanticAttributes = (0, jI.createConstMap)([blq, Ilq, xlq, ulq, mlq, Blq, plq, Flq, glq, Ulq, Qlq, dlq, clq, llq, nlq, ilq, rlq, olq, alq, slq, tlq, elq, qnq, Knq, _nq, znq, Ynq, Anq, Onq, wnq, $nq, jnq, Hnq, Jnq, Xnq, Mnq, Pnq, Wnq, Dnq, Znq, fnq, Gnq, vnq, Tnq, Vnq, knq, Nnq, Enq, ynq, Lnq, hnq, Rnq, Snq, Cnq, bnq, Inq, xnq, unq, mnq, Bnq, pnq, Fnq, gnq, Unq, Qnq, dnq, cnq, lnq, nnq, inq, rnq, onq, anq, snq, tnq, enq, qiq, Kiq, _iq, ziq, Yiq, Aiq, Oiq, wiq, $iq, jiq, Hiq, Jiq, Xiq, Miq, Piq, Wiq, Diq, Ziq, fiq, Giq, viq, Tiq, Viq, kiq, Niq, Eiq, yiq, Liq, hiq, Riq, Siq, Ciq, biq, Iiq, xiq, uiq, miq, Biq, piq, Fiq, giq, Uiq, Qiq, diq, ciq, liq, niq, iiq, riq, oiq, aiq, siq]);
    var tiq = "other_sql",
        eiq = "mssql",
        qrq = "mysql",
        Krq = "oracle",
        _rq = "db2",
        zrq = "postgresql",
        Yrq = "redshift",
        Arq = "hive",
        Orq = "cloudscape",
        wrq = "hsqldb",
        $rq = "progress",
        jrq = "maxdb",
        Hrq = "hanadb",
        Jrq = "ingres",
        Xrq = "firstsql",
        Mrq = "edb",
        Prq = "cache",
        Wrq = "adabas",
        Drq = "firebird",
        Zrq = "derby",
        frq = "filemaker",
        Grq = "informix",
        vrq = "instantdb",
        Trq = "interbase",
        Vrq = "mariadb",
        krq = "netezza",
        Nrq = "pervasive",
        Erq = "pointbase",
        yrq = "sqlite",
        Lrq = "sybase",
        hrq = "teradata",
        Rrq = "vertica",
        Srq = "h2",
        Crq = "coldfusion",
        brq = "cassandra",
        Irq = "hbase",
        xrq = "mongodb",
        urq = "redis",
        mrq = "couchbase",
        Brq = "couchdb",
        prq = "cosmosdb",
        Frq = "dynamodb",
        grq = "neo4j",
        Urq = "geode",
        Qrq = "elasticsearch",
        drq = "memcached",
        crq = "cockroachdb";
    Taq.DBSYSTEMVALUES_OTHER_SQL = tiq;
    Taq.DBSYSTEMVALUES_MSSQL = eiq;
    Taq.DBSYSTEMVALUES_MYSQL = qrq;
    Taq.DBSYSTEMVALUES_ORACLE = Krq;
    Taq.DBSYSTEMVALUES_DB2 = _rq;
    Taq.DBSYSTEMVALUES_POSTGRESQL = zrq;
    Taq.DBSYSTEMVALUES_REDSHIFT = Yrq;
    Taq.DBSYSTEMVALUES_HIVE = Arq;
    Taq.DBSYSTEMVALUES_CLOUDSCAPE = Orq;
    Taq.DBSYSTEMVALUES_HSQLDB = wrq;
    Taq.DBSYSTEMVALUES_PROGRESS = $rq;
    Taq.DBSYSTEMVALUES_MAXDB = jrq;
    Taq.DBSYSTEMVALUES_HANADB = Hrq;
    Taq.DBSYSTEMVALUES_INGRES = Jrq;
    Taq.DBSYSTEMVALUES_FIRSTSQL = Xrq;
    Taq.DBSYSTEMVALUES_EDB = Mrq;
    Taq.DBSYSTEMVALUES_CACHE = Prq;
    Taq.DBSYSTEMVALUES_ADABAS = Wrq;
    Taq.DBSYSTEMVALUES_FIREBIRD = Drq;
    Taq.DBSYSTEMVALUES_DERBY = Zrq;
    Taq.DBSYSTEMVALUES_FILEMAKER = frq;
    Taq.DBSYSTEMVALUES_INFORMIX = Grq;
    Taq.DBSYSTEMVALUES_INSTANTDB = vrq;
    Taq.DBSYSTEMVALUES_INTERBASE = Trq;
    Taq.DBSYSTEMVALUES_MARIADB = Vrq;
    Taq.DBSYSTEMVALUES_NETEZZA = krq;
    Taq.DBSYSTEMVALUES_PERVASIVE = Nrq;
    Taq.DBSYSTEMVALUES_POINTBASE = Erq;
    Taq.DBSYSTEMVALUES_SQLITE = yrq;
    Taq.DBSYSTEMVALUES_SYBASE = Lrq;
    Taq.DBSYSTEMVALUES_TERADATA = hrq;
    Taq.DBSYSTEMVALUES_VERTICA = Rrq;
    Taq.DBSYSTEMVALUES_H2 = Srq;
    Taq.DBSYSTEMVALUES_COLDFUSION = Crq;
    Taq.DBSYSTEMVALUES_CASSANDRA = brq;
    Taq.DBSYSTEMVALUES_HBASE = Irq;
    Taq.DBSYSTEMVALUES_MONGODB = xrq;
    Taq.DBSYSTEMVALUES_REDIS = urq;
    Taq.DBSYSTEMVALUES_COUCHBASE = mrq;
    Taq.DBSYSTEMVALUES_COUCHDB = Brq;
    Taq.DBSYSTEMVALUES_COSMOSDB = prq;
    Taq.DBSYSTEMVALUES_DYNAMODB = Frq;
    Taq.DBSYSTEMVALUES_NEO4J = grq;
    Taq.DBSYSTEMVALUES_GEODE = Urq;
    Taq.DBSYSTEMVALUES_ELASTICSEARCH = Qrq;
    Taq.DBSYSTEMVALUES_MEMCACHED = drq;
    Taq.DBSYSTEMVALUES_COCKROACHDB = crq;
    Taq.DbSystemValues = (0, jI.createConstMap)([tiq, eiq, qrq, Krq, _rq, zrq, Yrq, Arq, Orq, wrq, $rq, jrq, Hrq, Jrq, Xrq, Mrq, Prq, Wrq, Drq, Zrq, frq, Grq, vrq, Trq, Vrq, krq, Nrq, Erq, yrq, Lrq, hrq, Rrq, Srq, Crq, brq, Irq, xrq, urq, mrq, Brq, prq, Frq, grq, Urq, Qrq, drq, crq]);
    var lrq = "all",
        nrq = "each_quorum",
        irq = "quorum",
        rrq = "local_quorum",
        orq = "one",
        arq = "two",
        srq = "three",
        trq = "local_one",
        erq = "any",
        qoq = "serial",
        Koq = "local_serial";
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = lrq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = nrq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = irq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = rrq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = orq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = arq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = srq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = trq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = erq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = qoq;
    Taq.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = Koq;
    Taq.DbCassandraConsistencyLevelValues = (0, jI.createConstMap)([lrq, nrq, irq, rrq, orq, arq, srq, trq, erq, qoq, Koq]);
    var _oq = "datasource",
        zoq = "http",
        Yoq = "pubsub",
        Aoq = "timer",
        Ooq = "other";
    Taq.FAASTRIGGERVALUES_DATASOURCE = _oq;
    Taq.FAASTRIGGERVALUES_HTTP = zoq;
    Taq.FAASTRIGGERVALUES_PUBSUB = Yoq;
    Taq.FAASTRIGGERVALUES_TIMER = Aoq;
    Taq.FAASTRIGGERVALUES_OTHER = Ooq;
    Taq.FaasTriggerValues = (0, jI.createConstMap)([_oq, zoq, Yoq, Aoq, Ooq]);
    var woq = "insert",
        $oq = "edit",
        joq = "delete";
    Taq.FAASDOCUMENTOPERATIONVALUES_INSERT = woq;
    Taq.FAASDOCUMENTOPERATIONVALUES_EDIT = $oq;
    Taq.FAASDOCUMENTOPERATIONVALUES_DELETE = joq;
    Taq.FaasDocumentOperationValues = (0, jI.createConstMap)([woq, $oq, joq]);
    var Hoq = "alibaba_cloud",
        Joq = "aws",
        Xoq = "azure",
        Moq = "gcp";
    Taq.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = Hoq;
    Taq.FAASINVOKEDPROVIDERVALUES_AWS = Joq;
    Taq.FAASINVOKEDPROVIDERVALUES_AZURE = Xoq;
    Taq.FAASINVOKEDPROVIDERVALUES_GCP = Moq;
    Taq.FaasInvokedProviderValues = (0, jI.createConstMap)([Hoq, Joq, Xoq, Moq]);
    var Poq = "ip_tcp",
        Woq = "ip_udp",
        Doq = "ip",
        Zoq = "unix",
        foq = "pipe",
        Goq = "inproc",
        voq = "other";
    Taq.NETTRANSPORTVALUES_IP_TCP = Poq;
    Taq.NETTRANSPORTVALUES_IP_UDP = Woq;
    Taq.NETTRANSPORTVALUES_IP = Doq;
    Taq.NETTRANSPORTVALUES_UNIX = Zoq;
    Taq.NETTRANSPORTVALUES_PIPE = foq;
    Taq.NETTRANSPORTVALUES_INPROC = Goq;
    Taq.NETTRANSPORTVALUES_OTHER = voq;
    Taq.NetTransportValues = (0, jI.createConstMap)([Poq, Woq, Doq, Zoq, foq, Goq, voq]);
    var Toq = "wifi",
        Voq = "wired",
        koq = "cell",
        Noq = "unavailable",
        Eoq = "unknown";
    Taq.NETHOSTCONNECTIONTYPEVALUES_WIFI = Toq;
    Taq.NETHOSTCONNECTIONTYPEVALUES_WIRED = Voq;
    Taq.NETHOSTCONNECTIONTYPEVALUES_CELL = koq;
    Taq.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = Noq;
    Taq.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = Eoq;
    Taq.NetHostConnectionTypeValues = (0, jI.createConstMap)([Toq, Voq, koq, Noq, Eoq]);
    var yoq = "gprs",
        Loq = "edge",
        hoq = "umts",
        Roq = "cdma",
        Soq = "evdo_0",
        Coq = "evdo_a",
        boq = "cdma2000_1xrtt",
        Ioq = "hsdpa",
        xoq = "hsupa",
        uoq = "hspa",
        moq = "iden",
        Boq = "evdo_b",
        poq = "lte",
        Foq = "ehrpd",
        goq = "hspap",
        Uoq = "gsm",
        Qoq = "td_scdma",
        doq = "iwlan",
        coq = "nr",
        loq = "nrnsa",
        noq = "lte_ca";
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = yoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = Loq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = hoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = Roq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = Soq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = Coq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = boq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = Ioq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = xoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = uoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = moq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = Boq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = poq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = Foq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = goq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = Uoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = Qoq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = doq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_NR = coq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = loq;
    Taq.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = noq;
    Taq.NetHostConnectionSubtypeValues = (0, jI.createConstMap)([yoq, Loq, hoq, Roq, Soq, Coq, boq, Ioq, xoq, uoq, moq, Boq, poq, Foq, goq, Uoq, Qoq, doq, coq, loq, noq]);
    var ioq = "1.0",
        roq = "1.1",
        ooq = "2.0",
        aoq = "SPDY",
        soq = "QUIC";
    Taq.HTTPFLAVORVALUES_HTTP_1_0 = ioq;
    Taq.HTTPFLAVORVALUES_HTTP_1_1 = roq;
    Taq.HTTPFLAVORVALUES_HTTP_2_0 = ooq;
    Taq.HTTPFLAVORVALUES_SPDY = aoq;
    Taq.HTTPFLAVORVALUES_QUIC = soq;
    Taq.HttpFlavorValues = {
        HTTP_1_0: ioq,
        HTTP_1_1: roq,
        HTTP_2_0: ooq,
        SPDY: aoq,
        QUIC: soq
    };
    var toq = "queue",
        eoq = "topic";
    Taq.MESSAGINGDESTINATIONKINDVALUES_QUEUE = toq;
    Taq.MESSAGINGDESTINATIONKINDVALUES_TOPIC = eoq;
    Taq.MessagingDestinationKindValues = (0, jI.createConstMap)([toq, eoq]);
    var qaq = "receive",
        Kaq = "process";
    Taq.MESSAGINGOPERATIONVALUES_RECEIVE = qaq;
    Taq.MESSAGINGOPERATIONVALUES_PROCESS = Kaq;
    Taq.MessagingOperationValues = (0, jI.createConstMap)([qaq, Kaq]);
    var _aq = 0,
        zaq = 1,
        Yaq = 2,
        Aaq = 3,
        Oaq = 4,
        waq = 5,
        $aq = 6,
        jaq = 7,
        Haq = 8,
        Jaq = 9,
        Xaq = 10,
        Maq = 11,
        Paq = 12,
        Waq = 13,
        Daq = 14,
        Zaq = 15,
        faq = 16;
    Taq.RPCGRPCSTATUSCODEVALUES_OK = _aq;
    Taq.RPCGRPCSTATUSCODEVALUES_CANCELLED = zaq;
    Taq.RPCGRPCSTATUSCODEVALUES_UNKNOWN = Yaq;
    Taq.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = Aaq;
    Taq.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = Oaq;
    Taq.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = waq;
    Taq.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = $aq;
    Taq.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = jaq;
    Taq.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = Haq;
    Taq.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = Jaq;
    Taq.RPCGRPCSTATUSCODEVALUES_ABORTED = Xaq;
    Taq.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = Maq;
    Taq.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = Paq;
    Taq.RPCGRPCSTATUSCODEVALUES_INTERNAL = Waq;
    Taq.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = Daq;
    Taq.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = Zaq;
    Taq.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = faq;
    Taq.RpcGrpcStatusCodeValues = {
        OK: _aq,
        CANCELLED: zaq,
        UNKNOWN: Yaq,
        INVALID_ARGUMENT: Aaq,
        DEADLINE_EXCEEDED: Oaq,
        NOT_FOUND: waq,
        ALREADY_EXISTS: $aq,
        PERMISSION_DENIED: jaq,
        RESOURCE_EXHAUSTED: Haq,
        FAILED_PRECONDITION: Jaq,
        ABORTED: Xaq,
        OUT_OF_RANGE: Maq,
        UNIMPLEMENTED: Paq,
        INTERNAL: Waq,
        UNAVAILABLE: Daq,
        DATA_LOSS: Zaq,
        UNAUTHENTICATED: faq
    };
    var Gaq = "SENT",
        vaq = "RECEIVED";
    Taq.MESSAGETYPEVALUES_SENT = Gaq;
    Taq.MESSAGETYPEVALUES_RECEIVED = vaq;
    Taq.MessageTypeValues = (0, jI.createConstMap)([Gaq, vaq])
})
// @from(Ln 160966, Col 4)
Raq = p((c26) => {
    var JW_ = c26 && c26.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        XW_ = c26 && c26.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) JW_(K, q, _)
        };
    Object.defineProperty(c26, "__esModule", {
        value: !0
    });
    XW_(haq(), c26)
})
// @from(Ln 160990, Col 4)
Yeq = p((qeq) => {
    Object.defineProperty(qeq, "__esModule", {
        value: !0
    });
    qeq.SEMRESATTRS_K8S_STATEFULSET_NAME = qeq.SEMRESATTRS_K8S_STATEFULSET_UID = qeq.SEMRESATTRS_K8S_DEPLOYMENT_NAME = qeq.SEMRESATTRS_K8S_DEPLOYMENT_UID = qeq.SEMRESATTRS_K8S_REPLICASET_NAME = qeq.SEMRESATTRS_K8S_REPLICASET_UID = qeq.SEMRESATTRS_K8S_CONTAINER_NAME = qeq.SEMRESATTRS_K8S_POD_NAME = qeq.SEMRESATTRS_K8S_POD_UID = qeq.SEMRESATTRS_K8S_NAMESPACE_NAME = qeq.SEMRESATTRS_K8S_NODE_UID = qeq.SEMRESATTRS_K8S_NODE_NAME = qeq.SEMRESATTRS_K8S_CLUSTER_NAME = qeq.SEMRESATTRS_HOST_IMAGE_VERSION = qeq.SEMRESATTRS_HOST_IMAGE_ID = qeq.SEMRESATTRS_HOST_IMAGE_NAME = qeq.SEMRESATTRS_HOST_ARCH = qeq.SEMRESATTRS_HOST_TYPE = qeq.SEMRESATTRS_HOST_NAME = qeq.SEMRESATTRS_HOST_ID = qeq.SEMRESATTRS_FAAS_MAX_MEMORY = qeq.SEMRESATTRS_FAAS_INSTANCE = qeq.SEMRESATTRS_FAAS_VERSION = qeq.SEMRESATTRS_FAAS_ID = qeq.SEMRESATTRS_FAAS_NAME = qeq.SEMRESATTRS_DEVICE_MODEL_NAME = qeq.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = qeq.SEMRESATTRS_DEVICE_ID = qeq.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = qeq.SEMRESATTRS_CONTAINER_IMAGE_TAG = qeq.SEMRESATTRS_CONTAINER_IMAGE_NAME = qeq.SEMRESATTRS_CONTAINER_RUNTIME = qeq.SEMRESATTRS_CONTAINER_ID = qeq.SEMRESATTRS_CONTAINER_NAME = qeq.SEMRESATTRS_AWS_LOG_STREAM_ARNS = qeq.SEMRESATTRS_AWS_LOG_STREAM_NAMES = qeq.SEMRESATTRS_AWS_LOG_GROUP_ARNS = qeq.SEMRESATTRS_AWS_LOG_GROUP_NAMES = qeq.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = qeq.SEMRESATTRS_AWS_ECS_TASK_REVISION = qeq.SEMRESATTRS_AWS_ECS_TASK_FAMILY = qeq.SEMRESATTRS_AWS_ECS_TASK_ARN = qeq.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = qeq.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = qeq.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = qeq.SEMRESATTRS_CLOUD_PLATFORM = qeq.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = qeq.SEMRESATTRS_CLOUD_REGION = qeq.SEMRESATTRS_CLOUD_ACCOUNT_ID = qeq.SEMRESATTRS_CLOUD_PROVIDER = void 0;
    qeq.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = qeq.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = qeq.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = qeq.CLOUDPLATFORMVALUES_AZURE_AKS = qeq.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = qeq.CLOUDPLATFORMVALUES_AZURE_VM = qeq.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = qeq.CLOUDPLATFORMVALUES_AWS_LAMBDA = qeq.CLOUDPLATFORMVALUES_AWS_EKS = qeq.CLOUDPLATFORMVALUES_AWS_ECS = qeq.CLOUDPLATFORMVALUES_AWS_EC2 = qeq.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = qeq.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = qeq.CloudProviderValues = qeq.CLOUDPROVIDERVALUES_GCP = qeq.CLOUDPROVIDERVALUES_AZURE = qeq.CLOUDPROVIDERVALUES_AWS = qeq.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = qeq.SemanticResourceAttributes = qeq.SEMRESATTRS_WEBENGINE_DESCRIPTION = qeq.SEMRESATTRS_WEBENGINE_VERSION = qeq.SEMRESATTRS_WEBENGINE_NAME = qeq.SEMRESATTRS_TELEMETRY_AUTO_VERSION = qeq.SEMRESATTRS_TELEMETRY_SDK_VERSION = qeq.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = qeq.SEMRESATTRS_TELEMETRY_SDK_NAME = qeq.SEMRESATTRS_SERVICE_VERSION = qeq.SEMRESATTRS_SERVICE_INSTANCE_ID = qeq.SEMRESATTRS_SERVICE_NAMESPACE = qeq.SEMRESATTRS_SERVICE_NAME = qeq.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = qeq.SEMRESATTRS_PROCESS_RUNTIME_VERSION = qeq.SEMRESATTRS_PROCESS_RUNTIME_NAME = qeq.SEMRESATTRS_PROCESS_OWNER = qeq.SEMRESATTRS_PROCESS_COMMAND_ARGS = qeq.SEMRESATTRS_PROCESS_COMMAND_LINE = qeq.SEMRESATTRS_PROCESS_COMMAND = qeq.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = qeq.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = qeq.SEMRESATTRS_PROCESS_PID = qeq.SEMRESATTRS_OS_VERSION = qeq.SEMRESATTRS_OS_NAME = qeq.SEMRESATTRS_OS_DESCRIPTION = qeq.SEMRESATTRS_OS_TYPE = qeq.SEMRESATTRS_K8S_CRONJOB_NAME = qeq.SEMRESATTRS_K8S_CRONJOB_UID = qeq.SEMRESATTRS_K8S_JOB_NAME = qeq.SEMRESATTRS_K8S_JOB_UID = qeq.SEMRESATTRS_K8S_DAEMONSET_NAME = qeq.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
    qeq.TelemetrySdkLanguageValues = qeq.TELEMETRYSDKLANGUAGEVALUES_WEBJS = qeq.TELEMETRYSDKLANGUAGEVALUES_RUBY = qeq.TELEMETRYSDKLANGUAGEVALUES_PYTHON = qeq.TELEMETRYSDKLANGUAGEVALUES_PHP = qeq.TELEMETRYSDKLANGUAGEVALUES_NODEJS = qeq.TELEMETRYSDKLANGUAGEVALUES_JAVA = qeq.TELEMETRYSDKLANGUAGEVALUES_GO = qeq.TELEMETRYSDKLANGUAGEVALUES_ERLANG = qeq.TELEMETRYSDKLANGUAGEVALUES_DOTNET = qeq.TELEMETRYSDKLANGUAGEVALUES_CPP = qeq.OsTypeValues = qeq.OSTYPEVALUES_Z_OS = qeq.OSTYPEVALUES_SOLARIS = qeq.OSTYPEVALUES_AIX = qeq.OSTYPEVALUES_HPUX = qeq.OSTYPEVALUES_DRAGONFLYBSD = qeq.OSTYPEVALUES_OPENBSD = qeq.OSTYPEVALUES_NETBSD = qeq.OSTYPEVALUES_FREEBSD = qeq.OSTYPEVALUES_DARWIN = qeq.OSTYPEVALUES_LINUX = qeq.OSTYPEVALUES_WINDOWS = qeq.HostArchValues = qeq.HOSTARCHVALUES_X86 = qeq.HOSTARCHVALUES_PPC64 = qeq.HOSTARCHVALUES_PPC32 = qeq.HOSTARCHVALUES_IA64 = qeq.HOSTARCHVALUES_ARM64 = qeq.HOSTARCHVALUES_ARM32 = qeq.HOSTARCHVALUES_AMD64 = qeq.AwsEcsLaunchtypeValues = qeq.AWSECSLAUNCHTYPEVALUES_FARGATE = qeq.AWSECSLAUNCHTYPEVALUES_EC2 = qeq.CloudPlatformValues = qeq.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = qeq.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = qeq.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = qeq.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
    var l26 = KC1(),
        Saq = "cloud.provider",
        Caq = "cloud.account.id",
        baq = "cloud.region",
        Iaq = "cloud.availability_zone",
        xaq = "cloud.platform",
        uaq = "aws.ecs.container.arn",
        maq = "aws.ecs.cluster.arn",
        Baq = "aws.ecs.launchtype",
        paq = "aws.ecs.task.arn",
        Faq = "aws.ecs.task.family",
        gaq = "aws.ecs.task.revision",
        Uaq = "aws.eks.cluster.arn",
        Qaq = "aws.log.group.names",
        daq = "aws.log.group.arns",
        caq = "aws.log.stream.names",
        laq = "aws.log.stream.arns",
        naq = "container.name",
        iaq = "container.id",
        raq = "container.runtime",
        oaq = "container.image.name",
        aaq = "container.image.tag",
        saq = "deployment.environment",
        taq = "device.id",
        eaq = "device.model.identifier",
        qsq = "device.model.name",
        Ksq = "faas.name",
        _sq = "faas.id",
        zsq = "faas.version",
        Ysq = "faas.instance",
        Asq = "faas.max_memory",
        Osq = "host.id",
        wsq = "host.name",
        $sq = "host.type",
        jsq = "host.arch",
        Hsq = "host.image.name",
        Jsq = "host.image.id",
        Xsq = "host.image.version",
        Msq = "k8s.cluster.name",
        Psq = "k8s.node.name",
        Wsq = "k8s.node.uid",
        Dsq = "k8s.namespace.name",
        Zsq = "k8s.pod.uid",
        fsq = "k8s.pod.name",
        Gsq = "k8s.container.name",
        vsq = "k8s.replicaset.uid",
        Tsq = "k8s.replicaset.name",
        Vsq = "k8s.deployment.uid",
        ksq = "k8s.deployment.name",
        Nsq = "k8s.statefulset.uid",
        Esq = "k8s.statefulset.name",
        ysq = "k8s.daemonset.uid",
        Lsq = "k8s.daemonset.name",
        hsq = "k8s.job.uid",
        Rsq = "k8s.job.name",
        Ssq = "k8s.cronjob.uid",
        Csq = "k8s.cronjob.name",
        bsq = "os.type",
        Isq = "os.description",
        xsq = "os.name",
        usq = "os.version",
        msq = "process.pid",
        Bsq = "process.executable.name",
        psq = "process.executable.path",
        Fsq = "process.command",
        gsq = "process.command_line",
        Usq = "process.command_args",
        Qsq = "process.owner",
        dsq = "process.runtime.name",
        csq = "process.runtime.version",
        lsq = "process.runtime.description",
        nsq = "service.name",
        isq = "service.namespace",
        rsq = "service.instance.id",
        osq = "service.version",
        asq = "telemetry.sdk.name",
        ssq = "telemetry.sdk.language",
        tsq = "telemetry.sdk.version",
        esq = "telemetry.auto.version",
        qtq = "webengine.name",
        Ktq = "webengine.version",
        _tq = "webengine.description";
    qeq.SEMRESATTRS_CLOUD_PROVIDER = Saq;
    qeq.SEMRESATTRS_CLOUD_ACCOUNT_ID = Caq;
    qeq.SEMRESATTRS_CLOUD_REGION = baq;
    qeq.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = Iaq;
    qeq.SEMRESATTRS_CLOUD_PLATFORM = xaq;
    qeq.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = uaq;
    qeq.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = maq;
    qeq.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = Baq;
    qeq.SEMRESATTRS_AWS_ECS_TASK_ARN = paq;
    qeq.SEMRESATTRS_AWS_ECS_TASK_FAMILY = Faq;
    qeq.SEMRESATTRS_AWS_ECS_TASK_REVISION = gaq;
    qeq.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = Uaq;
    qeq.SEMRESATTRS_AWS_LOG_GROUP_NAMES = Qaq;
    qeq.SEMRESATTRS_AWS_LOG_GROUP_ARNS = daq;
    qeq.SEMRESATTRS_AWS_LOG_STREAM_NAMES = caq;
    qeq.SEMRESATTRS_AWS_LOG_STREAM_ARNS = laq;
    qeq.SEMRESATTRS_CONTAINER_NAME = naq;
    qeq.SEMRESATTRS_CONTAINER_ID = iaq;
    qeq.SEMRESATTRS_CONTAINER_RUNTIME = raq;
    qeq.SEMRESATTRS_CONTAINER_IMAGE_NAME = oaq;
    qeq.SEMRESATTRS_CONTAINER_IMAGE_TAG = aaq;
    qeq.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = saq;
    qeq.SEMRESATTRS_DEVICE_ID = taq;
    qeq.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = eaq;
    qeq.SEMRESATTRS_DEVICE_MODEL_NAME = qsq;
    qeq.SEMRESATTRS_FAAS_NAME = Ksq;
    qeq.SEMRESATTRS_FAAS_ID = _sq;
    qeq.SEMRESATTRS_FAAS_VERSION = zsq;
    qeq.SEMRESATTRS_FAAS_INSTANCE = Ysq;
    qeq.SEMRESATTRS_FAAS_MAX_MEMORY = Asq;
    qeq.SEMRESATTRS_HOST_ID = Osq;
    qeq.SEMRESATTRS_HOST_NAME = wsq;
    qeq.SEMRESATTRS_HOST_TYPE = $sq;
    qeq.SEMRESATTRS_HOST_ARCH = jsq;
    qeq.SEMRESATTRS_HOST_IMAGE_NAME = Hsq;
    qeq.SEMRESATTRS_HOST_IMAGE_ID = Jsq;
    qeq.SEMRESATTRS_HOST_IMAGE_VERSION = Xsq;
    qeq.SEMRESATTRS_K8S_CLUSTER_NAME = Msq;
    qeq.SEMRESATTRS_K8S_NODE_NAME = Psq;
    qeq.SEMRESATTRS_K8S_NODE_UID = Wsq;
    qeq.SEMRESATTRS_K8S_NAMESPACE_NAME = Dsq;
    qeq.SEMRESATTRS_K8S_POD_UID = Zsq;
    qeq.SEMRESATTRS_K8S_POD_NAME = fsq;
    qeq.SEMRESATTRS_K8S_CONTAINER_NAME = Gsq;
    qeq.SEMRESATTRS_K8S_REPLICASET_UID = vsq;
    qeq.SEMRESATTRS_K8S_REPLICASET_NAME = Tsq;
    qeq.SEMRESATTRS_K8S_DEPLOYMENT_UID = Vsq;
    qeq.SEMRESATTRS_K8S_DEPLOYMENT_NAME = ksq;
    qeq.SEMRESATTRS_K8S_STATEFULSET_UID = Nsq;
    qeq.SEMRESATTRS_K8S_STATEFULSET_NAME = Esq;
    qeq.SEMRESATTRS_K8S_DAEMONSET_UID = ysq;
    qeq.SEMRESATTRS_K8S_DAEMONSET_NAME = Lsq;
    qeq.SEMRESATTRS_K8S_JOB_UID = hsq;
    qeq.SEMRESATTRS_K8S_JOB_NAME = Rsq;
    qeq.SEMRESATTRS_K8S_CRONJOB_UID = Ssq;
    qeq.SEMRESATTRS_K8S_CRONJOB_NAME = Csq;
    qeq.SEMRESATTRS_OS_TYPE = bsq;
    qeq.SEMRESATTRS_OS_DESCRIPTION = Isq;
    qeq.SEMRESATTRS_OS_NAME = xsq;
    qeq.SEMRESATTRS_OS_VERSION = usq;
    qeq.SEMRESATTRS_PROCESS_PID = msq;
    qeq.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = Bsq;
    qeq.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = psq;
    qeq.SEMRESATTRS_PROCESS_COMMAND = Fsq;
    qeq.SEMRESATTRS_PROCESS_COMMAND_LINE = gsq;
    qeq.SEMRESATTRS_PROCESS_COMMAND_ARGS = Usq;
    qeq.SEMRESATTRS_PROCESS_OWNER = Qsq;
    qeq.SEMRESATTRS_PROCESS_RUNTIME_NAME = dsq;
    qeq.SEMRESATTRS_PROCESS_RUNTIME_VERSION = csq;
    qeq.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = lsq;
    qeq.SEMRESATTRS_SERVICE_NAME = nsq;
    qeq.SEMRESATTRS_SERVICE_NAMESPACE = isq;
    qeq.SEMRESATTRS_SERVICE_INSTANCE_ID = rsq;
    qeq.SEMRESATTRS_SERVICE_VERSION = osq;
    qeq.SEMRESATTRS_TELEMETRY_SDK_NAME = asq;
    qeq.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = ssq;
    qeq.SEMRESATTRS_TELEMETRY_SDK_VERSION = tsq;
    qeq.SEMRESATTRS_TELEMETRY_AUTO_VERSION = esq;
    qeq.SEMRESATTRS_WEBENGINE_NAME = qtq;
    qeq.SEMRESATTRS_WEBENGINE_VERSION = Ktq;
    qeq.SEMRESATTRS_WEBENGINE_DESCRIPTION = _tq;
    qeq.SemanticResourceAttributes = (0, l26.createConstMap)([Saq, Caq, baq, Iaq, xaq, uaq, maq, Baq, paq, Faq, gaq, Uaq, Qaq, daq, caq, laq, naq, iaq, raq, oaq, aaq, saq, taq, eaq, qsq, Ksq, _sq, zsq, Ysq, Asq, Osq, wsq, $sq, jsq, Hsq, Jsq, Xsq, Msq, Psq, Wsq, Dsq, Zsq, fsq, Gsq, vsq, Tsq, Vsq, ksq, Nsq, Esq, ysq, Lsq, hsq, Rsq, Ssq, Csq, bsq, Isq, xsq, usq, msq, Bsq, psq, Fsq, gsq, Usq, Qsq, dsq, csq, lsq, nsq, isq, rsq, osq, asq, ssq, tsq, esq, qtq, Ktq, _tq]);
    var ztq = "alibaba_cloud",
        Ytq = "aws",
        Atq = "azure",
        Otq = "gcp";
    qeq.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = ztq;
    qeq.CLOUDPROVIDERVALUES_AWS = Ytq;
    qeq.CLOUDPROVIDERVALUES_AZURE = Atq;
    qeq.CLOUDPROVIDERVALUES_GCP = Otq;
    qeq.CloudProviderValues = (0, l26.createConstMap)([ztq, Ytq, Atq, Otq]);
    var wtq = "alibaba_cloud_ecs",
        $tq = "alibaba_cloud_fc",
        jtq = "aws_ec2",
        Htq = "aws_ecs",
        Jtq = "aws_eks",
        Xtq = "aws_lambda",
        Mtq = "aws_elastic_beanstalk",
        Ptq = "azure_vm",
        Wtq = "azure_container_instances",
        Dtq = "azure_aks",
        Ztq = "azure_functions",
        ftq = "azure_app_service",
        Gtq = "gcp_compute_engine",
        vtq = "gcp_cloud_run",
        Ttq = "gcp_kubernetes_engine",
        Vtq = "gcp_cloud_functions",
        ktq = "gcp_app_engine";
    qeq.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = wtq;
    qeq.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = $tq;
    qeq.CLOUDPLATFORMVALUES_AWS_EC2 = jtq;
    qeq.CLOUDPLATFORMVALUES_AWS_ECS = Htq;
    qeq.CLOUDPLATFORMVALUES_AWS_EKS = Jtq;
    qeq.CLOUDPLATFORMVALUES_AWS_LAMBDA = Xtq;
    qeq.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = Mtq;
    qeq.CLOUDPLATFORMVALUES_AZURE_VM = Ptq;
    qeq.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = Wtq;
    qeq.CLOUDPLATFORMVALUES_AZURE_AKS = Dtq;
    qeq.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = Ztq;
    qeq.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = ftq;
    qeq.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = Gtq;
    qeq.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = vtq;
    qeq.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = Ttq;
    qeq.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = Vtq;
    qeq.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = ktq;
    qeq.CloudPlatformValues = (0, l26.createConstMap)([wtq, $tq, jtq, Htq, Jtq, Xtq, Mtq, Ptq, Wtq, Dtq, Ztq, ftq, Gtq, vtq, Ttq, Vtq, ktq]);
    var Ntq = "ec2",
        Etq = "fargate";
    qeq.AWSECSLAUNCHTYPEVALUES_EC2 = Ntq;
    qeq.AWSECSLAUNCHTYPEVALUES_FARGATE = Etq;
    qeq.AwsEcsLaunchtypeValues = (0, l26.createConstMap)([Ntq, Etq]);
    var ytq = "amd64",
        Ltq = "arm32",
        htq = "arm64",
        Rtq = "ia64",
        Stq = "ppc32",
        Ctq = "ppc64",
        btq = "x86";
    qeq.HOSTARCHVALUES_AMD64 = ytq;
    qeq.HOSTARCHVALUES_ARM32 = Ltq;
    qeq.HOSTARCHVALUES_ARM64 = htq;
    qeq.HOSTARCHVALUES_IA64 = Rtq;
    qeq.HOSTARCHVALUES_PPC32 = Stq;
    qeq.HOSTARCHVALUES_PPC64 = Ctq;
    qeq.HOSTARCHVALUES_X86 = btq;
    qeq.HostArchValues = (0, l26.createConstMap)([ytq, Ltq, htq, Rtq, Stq, Ctq, btq]);
    var Itq = "windows",
        xtq = "linux",
        utq = "darwin",
        mtq = "freebsd",
        Btq = "netbsd",
        ptq = "openbsd",
        Ftq = "dragonflybsd",
        gtq = "hpux",
        Utq = "aix",
        Qtq = "solaris",
        dtq = "z_os";
    qeq.OSTYPEVALUES_WINDOWS = Itq;
    qeq.OSTYPEVALUES_LINUX = xtq;
    qeq.OSTYPEVALUES_DARWIN = utq;
    qeq.OSTYPEVALUES_FREEBSD = mtq;
    qeq.OSTYPEVALUES_NETBSD = Btq;
    qeq.OSTYPEVALUES_OPENBSD = ptq;
    qeq.OSTYPEVALUES_DRAGONFLYBSD = Ftq;
    qeq.OSTYPEVALUES_HPUX = gtq;
    qeq.OSTYPEVALUES_AIX = Utq;
    qeq.OSTYPEVALUES_SOLARIS = Qtq;
    qeq.OSTYPEVALUES_Z_OS = dtq;
    qeq.OsTypeValues = (0, l26.createConstMap)([Itq, xtq, utq, mtq, Btq, ptq, Ftq, gtq, Utq, Qtq, dtq]);
    var ctq = "cpp",
        ltq = "dotnet",
        ntq = "erlang",
        itq = "go",
        rtq = "java",
        otq = "nodejs",
        atq = "php",
        stq = "python",
        ttq = "ruby",
        etq = "webjs";
    qeq.TELEMETRYSDKLANGUAGEVALUES_CPP = ctq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_DOTNET = ltq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_ERLANG = ntq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_GO = itq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_JAVA = rtq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_NODEJS = otq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_PHP = atq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_PYTHON = stq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_RUBY = ttq;
    qeq.TELEMETRYSDKLANGUAGEVALUES_WEBJS = etq;
    qeq.TelemetrySdkLanguageValues = (0, l26.createConstMap)([ctq, ltq, ntq, itq, rtq, otq, atq, stq, ttq, etq])
})
// @from(Ln 161270, Col 4)
Aeq = p((n26) => {
    var UD_ = n26 && n26.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        QD_ = n26 && n26.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) UD_(K, q, _)
        };
    Object.defineProperty(n26, "__esModule", {
        value: !0
    });
    QD_(Yeq(), n26)
})
// @from(Ln 161294, Col 4)
Heq = p((Oeq) => {
    Object.defineProperty(Oeq, "__esModule", {
        value: !0
    });
    Oeq.ATTR_EXCEPTION_TYPE = Oeq.ATTR_EXCEPTION_STACKTRACE = Oeq.ATTR_EXCEPTION_MESSAGE = Oeq.ATTR_EXCEPTION_ESCAPED = Oeq.ERROR_TYPE_VALUE_OTHER = Oeq.ATTR_ERROR_TYPE = Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_POH = Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = Oeq.ATTR_DOTNET_GC_HEAP_GENERATION = Oeq.DB_SYSTEM_NAME_VALUE_POSTGRESQL = Oeq.DB_SYSTEM_NAME_VALUE_MYSQL = Oeq.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = Oeq.DB_SYSTEM_NAME_VALUE_MARIADB = Oeq.ATTR_DB_SYSTEM_NAME = Oeq.ATTR_DB_STORED_PROCEDURE_NAME = Oeq.ATTR_DB_RESPONSE_STATUS_CODE = Oeq.ATTR_DB_QUERY_TEXT = Oeq.ATTR_DB_QUERY_SUMMARY = Oeq.ATTR_DB_OPERATION_NAME = Oeq.ATTR_DB_OPERATION_BATCH_SIZE = Oeq.ATTR_DB_NAMESPACE = Oeq.ATTR_DB_COLLECTION_NAME = Oeq.ATTR_CODE_STACKTRACE = Oeq.ATTR_CODE_LINE_NUMBER = Oeq.ATTR_CODE_FUNCTION_NAME = Oeq.ATTR_CODE_FILE_PATH = Oeq.ATTR_CODE_COLUMN_NUMBER = Oeq.ATTR_CLIENT_PORT = Oeq.ATTR_CLIENT_ADDRESS = Oeq.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = Oeq.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = Oeq.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = Oeq.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = Oeq.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = Oeq.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = Oeq.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = Oeq.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = Oeq.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = Oeq.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
    Oeq.OTEL_STATUS_CODE_VALUE_ERROR = Oeq.ATTR_OTEL_STATUS_CODE = Oeq.ATTR_OTEL_SCOPE_VERSION = Oeq.ATTR_OTEL_SCOPE_NAME = Oeq.NETWORK_TYPE_VALUE_IPV6 = Oeq.NETWORK_TYPE_VALUE_IPV4 = Oeq.ATTR_NETWORK_TYPE = Oeq.NETWORK_TRANSPORT_VALUE_UNIX = Oeq.NETWORK_TRANSPORT_VALUE_UDP = Oeq.NETWORK_TRANSPORT_VALUE_TCP = Oeq.NETWORK_TRANSPORT_VALUE_QUIC = Oeq.NETWORK_TRANSPORT_VALUE_PIPE = Oeq.ATTR_NETWORK_TRANSPORT = Oeq.ATTR_NETWORK_PROTOCOL_VERSION = Oeq.ATTR_NETWORK_PROTOCOL_NAME = Oeq.ATTR_NETWORK_PEER_PORT = Oeq.ATTR_NETWORK_PEER_ADDRESS = Oeq.ATTR_NETWORK_LOCAL_PORT = Oeq.ATTR_NETWORK_LOCAL_ADDRESS = Oeq.JVM_THREAD_STATE_VALUE_WAITING = Oeq.JVM_THREAD_STATE_VALUE_TIMED_WAITING = Oeq.JVM_THREAD_STATE_VALUE_TERMINATED = Oeq.JVM_THREAD_STATE_VALUE_RUNNABLE = Oeq.JVM_THREAD_STATE_VALUE_NEW = Oeq.JVM_THREAD_STATE_VALUE_BLOCKED = Oeq.ATTR_JVM_THREAD_STATE = Oeq.ATTR_JVM_THREAD_DAEMON = Oeq.JVM_MEMORY_TYPE_VALUE_NON_HEAP = Oeq.JVM_MEMORY_TYPE_VALUE_HEAP = Oeq.ATTR_JVM_MEMORY_TYPE = Oeq.ATTR_JVM_MEMORY_POOL_NAME = Oeq.ATTR_JVM_GC_NAME = Oeq.ATTR_JVM_GC_ACTION = Oeq.ATTR_HTTP_ROUTE = Oeq.ATTR_HTTP_RESPONSE_STATUS_CODE = Oeq.ATTR_HTTP_RESPONSE_HEADER = Oeq.ATTR_HTTP_REQUEST_RESEND_COUNT = Oeq.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = Oeq.HTTP_REQUEST_METHOD_VALUE_TRACE = Oeq.HTTP_REQUEST_METHOD_VALUE_PUT = Oeq.HTTP_REQUEST_METHOD_VALUE_POST = Oeq.HTTP_REQUEST_METHOD_VALUE_PATCH = Oeq.HTTP_REQUEST_METHOD_VALUE_OPTIONS = Oeq.HTTP_REQUEST_METHOD_VALUE_HEAD = Oeq.HTTP_REQUEST_METHOD_VALUE_GET = Oeq.HTTP_REQUEST_METHOD_VALUE_DELETE = Oeq.HTTP_REQUEST_METHOD_VALUE_CONNECT = Oeq.HTTP_REQUEST_METHOD_VALUE_OTHER = Oeq.ATTR_HTTP_REQUEST_METHOD = Oeq.ATTR_HTTP_REQUEST_HEADER = void 0;
    Oeq.ATTR_USER_AGENT_ORIGINAL = Oeq.ATTR_URL_SCHEME = Oeq.ATTR_URL_QUERY = Oeq.ATTR_URL_PATH = Oeq.ATTR_URL_FULL = Oeq.ATTR_URL_FRAGMENT = Oeq.ATTR_TELEMETRY_SDK_VERSION = Oeq.ATTR_TELEMETRY_SDK_NAME = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_GO = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = Oeq.ATTR_TELEMETRY_SDK_LANGUAGE = Oeq.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = Oeq.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = Oeq.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = Oeq.ATTR_SIGNALR_TRANSPORT = Oeq.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = Oeq.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = Oeq.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = Oeq.ATTR_SIGNALR_CONNECTION_STATUS = Oeq.ATTR_SERVICE_VERSION = Oeq.ATTR_SERVICE_NAME = Oeq.ATTR_SERVER_PORT = Oeq.ATTR_SERVER_ADDRESS = Oeq.ATTR_OTEL_STATUS_DESCRIPTION = Oeq.OTEL_STATUS_CODE_VALUE_OK = void 0;
    Oeq.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
    Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
    Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
    Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
    Oeq.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
    Oeq.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
    Oeq.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
    Oeq.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
    Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
    Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
    Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
    Oeq.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
    Oeq.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
    Oeq.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
    Oeq.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
    Oeq.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
    Oeq.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
    Oeq.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
    Oeq.ATTR_CLIENT_ADDRESS = "client.address";
    Oeq.ATTR_CLIENT_PORT = "client.port";
    Oeq.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
    Oeq.ATTR_CODE_FILE_PATH = "code.file.path";
    Oeq.ATTR_CODE_FUNCTION_NAME = "code.function.name";
    Oeq.ATTR_CODE_LINE_NUMBER = "code.line.number";
    Oeq.ATTR_CODE_STACKTRACE = "code.stacktrace";
    Oeq.ATTR_DB_COLLECTION_NAME = "db.collection.name";
    Oeq.ATTR_DB_NAMESPACE = "db.namespace";
    Oeq.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
    Oeq.ATTR_DB_OPERATION_NAME = "db.operation.name";
    Oeq.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
    Oeq.ATTR_DB_QUERY_TEXT = "db.query.text";
    Oeq.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
    Oeq.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
    Oeq.ATTR_DB_SYSTEM_NAME = "db.system.name";
    Oeq.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
    Oeq.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
    Oeq.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
    Oeq.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
    Oeq.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
    Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
    Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
    Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
    Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
    Oeq.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
    Oeq.ATTR_ERROR_TYPE = "error.type";
    Oeq.ERROR_TYPE_VALUE_OTHER = "_OTHER";
    Oeq.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
    Oeq.ATTR_EXCEPTION_MESSAGE = "exception.message";
    Oeq.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
    Oeq.ATTR_EXCEPTION_TYPE = "exception.type";
    var dD_ = (q) => `http.request.header.${q}`;
    Oeq.ATTR_HTTP_REQUEST_HEADER = dD_;
    Oeq.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
    Oeq.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
    Oeq.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
    Oeq.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
    Oeq.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
    Oeq.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
    Oeq.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
    Oeq.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
    Oeq.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
    Oeq.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
    Oeq.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
    Oeq.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
    Oeq.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
    var cD_ = (q) => `http.response.header.${q}`;
    Oeq.ATTR_HTTP_RESPONSE_HEADER = cD_;
    Oeq.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
    Oeq.ATTR_HTTP_ROUTE = "http.route";
    Oeq.ATTR_JVM_GC_ACTION = "jvm.gc.action";
    Oeq.ATTR_JVM_GC_NAME = "jvm.gc.name";
    Oeq.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
    Oeq.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
    Oeq.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
    Oeq.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
    Oeq.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
    Oeq.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
    Oeq.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
    Oeq.JVM_THREAD_STATE_VALUE_NEW = "new";
    Oeq.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
    Oeq.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
    Oeq.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
    Oeq.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
    Oeq.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
    Oeq.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
    Oeq.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
    Oeq.ATTR_NETWORK_PEER_PORT = "network.peer.port";
    Oeq.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
    Oeq.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
    Oeq.ATTR_NETWORK_TRANSPORT = "network.transport";
    Oeq.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
    Oeq.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
    Oeq.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
    Oeq.NETWORK_TRANSPORT_VALUE_UDP = "udp";
    Oeq.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
    Oeq.ATTR_NETWORK_TYPE = "network.type";
    Oeq.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
    Oeq.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
    Oeq.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
    Oeq.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
    Oeq.ATTR_OTEL_STATUS_CODE = "otel.status_code";
    Oeq.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
    Oeq.OTEL_STATUS_CODE_VALUE_OK = "OK";
    Oeq.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
    Oeq.ATTR_SERVER_ADDRESS = "server.address";
    Oeq.ATTR_SERVER_PORT = "server.port";
    Oeq.ATTR_SERVICE_NAME = "service.name";
    Oeq.ATTR_SERVICE_VERSION = "service.version";
    Oeq.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
    Oeq.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
    Oeq.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
    Oeq.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
    Oeq.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
    Oeq.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
    Oeq.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
    Oeq.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
    Oeq.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
    Oeq.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
    Oeq.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
    Oeq.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
    Oeq.ATTR_URL_FRAGMENT = "url.fragment";
    Oeq.ATTR_URL_FULL = "url.full";
    Oeq.ATTR_URL_PATH = "url.path";
    Oeq.ATTR_URL_QUERY = "url.query";
    Oeq.ATTR_URL_SCHEME = "url.scheme";
    Oeq.ATTR_USER_AGENT_ORIGINAL = "user_agent.original"
})
// @from(Ln 161439, Col 4)
Peq = p((Jeq) => {
    Object.defineProperty(Jeq, "__esModule", {
        value: !0
    });
    Jeq.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = Jeq.METRIC_KESTREL_UPGRADED_CONNECTIONS = Jeq.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = Jeq.METRIC_KESTREL_REJECTED_CONNECTIONS = Jeq.METRIC_KESTREL_QUEUED_REQUESTS = Jeq.METRIC_KESTREL_QUEUED_CONNECTIONS = Jeq.METRIC_KESTREL_CONNECTION_DURATION = Jeq.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = Jeq.METRIC_KESTREL_ACTIVE_CONNECTIONS = Jeq.METRIC_JVM_THREAD_COUNT = Jeq.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = Jeq.METRIC_JVM_MEMORY_USED = Jeq.METRIC_JVM_MEMORY_LIMIT = Jeq.METRIC_JVM_MEMORY_COMMITTED = Jeq.METRIC_JVM_GC_DURATION = Jeq.METRIC_JVM_CPU_TIME = Jeq.METRIC_JVM_CPU_RECENT_UTILIZATION = Jeq.METRIC_JVM_CPU_COUNT = Jeq.METRIC_JVM_CLASS_UNLOADED = Jeq.METRIC_JVM_CLASS_LOADED = Jeq.METRIC_JVM_CLASS_COUNT = Jeq.METRIC_HTTP_SERVER_REQUEST_DURATION = Jeq.METRIC_HTTP_CLIENT_REQUEST_DURATION = Jeq.METRIC_DOTNET_TIMER_COUNT = Jeq.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = Jeq.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = Jeq.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = Jeq.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = Jeq.METRIC_DOTNET_PROCESS_CPU_TIME = Jeq.METRIC_DOTNET_PROCESS_CPU_COUNT = Jeq.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = Jeq.METRIC_DOTNET_JIT_COMPILED_METHODS = Jeq.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = Jeq.METRIC_DOTNET_JIT_COMPILATION_TIME = Jeq.METRIC_DOTNET_GC_PAUSE_TIME = Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = Jeq.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = Jeq.METRIC_DOTNET_GC_COLLECTIONS = Jeq.METRIC_DOTNET_EXCEPTIONS = Jeq.METRIC_DOTNET_ASSEMBLY_COUNT = Jeq.METRIC_DB_CLIENT_OPERATION_DURATION = Jeq.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = Jeq.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = Jeq.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = Jeq.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
    Jeq.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
    Jeq.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
    Jeq.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
    Jeq.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
    Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
    Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
    Jeq.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
    Jeq.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
    Jeq.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
    Jeq.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
    Jeq.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
    Jeq.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
    Jeq.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
    Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
    Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
    Jeq.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
    Jeq.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
    Jeq.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
    Jeq.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
    Jeq.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
    Jeq.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
    Jeq.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
    Jeq.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
    Jeq.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
    Jeq.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
    Jeq.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
    Jeq.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
    Jeq.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
    Jeq.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
    Jeq.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
    Jeq.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
    Jeq.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
    Jeq.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
    Jeq.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
    Jeq.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
    Jeq.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
    Jeq.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
    Jeq.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
    Jeq.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
    Jeq.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
    Jeq.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
    Jeq.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
    Jeq.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
    Jeq.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
    Jeq.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
    Jeq.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
    Jeq.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
    Jeq.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
    Jeq.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
    Jeq.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
    Jeq.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
    Jeq.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration"
})
// @from(Ln 161497, Col 4)
Zeq = p((Weq) => {
    Object.defineProperty(Weq, "__esModule", {
        value: !0
    });
    Weq.EVENT_EXCEPTION = void 0;
    Weq.EVENT_EXCEPTION = "exception"
})
// @from(Ln 161504, Col 4)
i26 = p((xB) => {
    var Hv_ = xB && xB.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        xo6 = xB && xB.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) Hv_(K, q, _)
        };
    Object.defineProperty(xB, "__esModule", {
        value: !0
    });
    xo6(Raq(), xB);
    xo6(Aeq(), xB);
    xo6(Heq(), xB);
    xo6(Peq(), xB);
    xo6(Zeq(), xB)
})
// @from(Ln 161532, Col 4)
veq = p((feq) => {
    Object.defineProperty(feq, "__esModule", {
        value: !0
    });
    feq.ATTR_PROCESS_RUNTIME_NAME = void 0;
    feq.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name"
})
// @from(Ln 161539, Col 4)
keq = p((Teq) => {
    Object.defineProperty(Teq, "__esModule", {
        value: !0
    });
    Teq.SDK_INFO = void 0;
    var Jv_ = Rlq(),
        oV8 = i26(),
        Xv_ = veq();
    Teq.SDK_INFO = {
        [oV8.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
        [Xv_.ATTR_PROCESS_RUNTIME_NAME]: "node",
        [oV8.ATTR_TELEMETRY_SDK_LANGUAGE]: oV8.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
        [oV8.ATTR_TELEMETRY_SDK_VERSION]: Jv_.VERSION
    }
})
// @from(Ln 161554, Col 4)
Neq = p((Za) => {
    Object.defineProperty(Za, "__esModule", {
        value: !0
    });
    Za.SDK_INFO = Za.otperformance = Za._globalThis = Za.getStringListFromEnv = Za.getNumberFromEnv = Za.getBooleanFromEnv = Za.getStringFromEnv = void 0;
    var aV8 = vlq();
    Object.defineProperty(Za, "getStringFromEnv", {
        enumerable: !0,
        get: function() {
            return aV8.getStringFromEnv
        }
    });
    Object.defineProperty(Za, "getBooleanFromEnv", {
        enumerable: !0,
        get: function() {
            return aV8.getBooleanFromEnv
        }
    });
    Object.defineProperty(Za, "getNumberFromEnv", {
        enumerable: !0,
        get: function() {
            return aV8.getNumberFromEnv
        }
    });
    Object.defineProperty(Za, "getStringListFromEnv", {
        enumerable: !0,
        get: function() {
            return aV8.getStringListFromEnv
        }
    });
    var Mv_ = klq();
    Object.defineProperty(Za, "_globalThis", {
        enumerable: !0,
        get: function() {
            return Mv_._globalThis
        }
    });
    var Pv_ = ylq();
    Object.defineProperty(Za, "otperformance", {
        enumerable: !0,
        get: function() {
            return Pv_.otperformance
        }
    });
    var Wv_ = keq();
    Object.defineProperty(Za, "SDK_INFO", {
        enumerable: !0,
        get: function() {
            return Wv_.SDK_INFO
        }
    })
})
// @from(Ln 161606, Col 4)
_C1 = p((fa) => {
    Object.defineProperty(fa, "__esModule", {
        value: !0
    });
    fa.getStringListFromEnv = fa.getNumberFromEnv = fa.getStringFromEnv = fa.getBooleanFromEnv = fa.otperformance = fa._globalThis = fa.SDK_INFO = void 0;
    var r26 = Neq();
    Object.defineProperty(fa, "SDK_INFO", {
        enumerable: !0,
        get: function() {
            return r26.SDK_INFO
        }
    });
    Object.defineProperty(fa, "_globalThis", {
        enumerable: !0,
        get: function() {
            return r26._globalThis
        }
    });
    Object.defineProperty(fa, "otperformance", {
        enumerable: !0,
        get: function() {
            return r26.otperformance
        }
    });
    Object.defineProperty(fa, "getBooleanFromEnv", {
        enumerable: !0,
        get: function() {
            return r26.getBooleanFromEnv
        }
    });
    Object.defineProperty(fa, "getStringFromEnv", {
        enumerable: !0,
        get: function() {
            return r26.getStringFromEnv
        }
    });
    Object.defineProperty(fa, "getNumberFromEnv", {
        enumerable: !0,
        get: function() {
            return r26.getNumberFromEnv
        }
    });
    Object.defineProperty(fa, "getStringListFromEnv", {
        enumerable: !0,
        get: function() {
            return r26.getStringListFromEnv
        }
    })
})
// @from(Ln 161655, Col 4)
Seq = p((heq) => {
    Object.defineProperty(heq, "__esModule", {
        value: !0
    });
    heq.addHrTimes = heq.isTimeInput = heq.isTimeInputHrTime = heq.hrTimeToMicroseconds = heq.hrTimeToMilliseconds = heq.hrTimeToNanoseconds = heq.hrTimeToTimeStamp = heq.hrTimeDuration = heq.timeInputToHrTime = heq.hrTime = heq.getTimeOrigin = heq.millisToHrTime = void 0;
    var zC1 = _C1(),
        Eeq = 9,
        fv_ = 6,
        Gv_ = Math.pow(10, fv_),
        sV8 = Math.pow(10, Eeq);

    function uo6(q) {
        let K = q / 1000,
            _ = Math.trunc(K),
            z = Math.round(q % 1000 * Gv_);
        return [_, z]
    }
    heq.millisToHrTime = uo6;

    function YC1() {
        let q = zC1.otperformance.timeOrigin;
        if (typeof q !== "number") {
            let K = zC1.otperformance;
            q = K.timing && K.timing.fetchStart
        }
        return q
    }
    heq.getTimeOrigin = YC1;

    function yeq(q) {
        let K = uo6(YC1()),
            _ = uo6(typeof q === "number" ? q : zC1.otperformance.now());
        return Leq(K, _)
    }
    heq.hrTime = yeq;

    function vv_(q) {
        if (AC1(q)) return q;
        else if (typeof q === "number")
            if (q < YC1()) return yeq(q);
            else return uo6(q);
        else if (q instanceof Date) return uo6(q.getTime());
        else throw TypeError("Invalid input type")
    }
    heq.timeInputToHrTime = vv_;

    function Tv_(q, K) {
        let _ = K[0] - q[0],
            z = K[1] - q[1];
        if (z < 0) _ -= 1, z += sV8;
        return [_, z]
    }
    heq.hrTimeDuration = Tv_;

    function Vv_(q) {
        let K = Eeq,
            _ = `${"0".repeat(K)}${q[1]}Z`,
            z = _.substring(_.length - K - 1);
        return new Date(q[0] * 1000).toISOString().replace("000Z", z)
    }
    heq.hrTimeToTimeStamp = Vv_;

    function kv_(q) {
        return q[0] * sV8 + q[1]
    }
    heq.hrTimeToNanoseconds = kv_;

    function Nv_(q) {
        return q[0] * 1000 + q[1] / 1e6
    }
    heq.hrTimeToMilliseconds = Nv_;

    function Ev_(q) {
        return q[0] * 1e6 + q[1] / 1000
    }
    heq.hrTimeToMicroseconds = Ev_;

    function AC1(q) {
        return Array.isArray(q) && q.length === 2 && typeof q[0] === "number" && typeof q[1] === "number"
    }
    heq.isTimeInputHrTime = AC1;

    function yv_(q) {
        return AC1(q) || typeof q === "number" || q instanceof Date
    }
    heq.isTimeInput = yv_;

    function Leq(q, K) {
        let _ = [q[0] + K[0], q[1] + K[1]];
        if (_[1] >= sV8) _[1] -= sV8, _[0] += 1;
        return _
    }
    heq.addHrTimes = Leq
})
// @from(Ln 161749, Col 4)
Ieq = p((Ceq) => {
    Object.defineProperty(Ceq, "__esModule", {
        value: !0
    });
    Ceq.unrefTimer = void 0;

    function pv_(q) {
        if (typeof q !== "number") q.unref()
    }
    Ceq.unrefTimer = pv_
})
// @from(Ln 161760, Col 4)
ueq = p((xeq) => {
    Object.defineProperty(xeq, "__esModule", {
        value: !0
    });
    xeq.ExportResultCode = void 0;
    var Fv_;
    (function(q) {
        q[q.SUCCESS = 0] = "SUCCESS", q[q.FAILED = 1] = "FAILED"
    })(Fv_ = xeq.ExportResultCode || (xeq.ExportResultCode = {}))
})
// @from(Ln 161770, Col 4)
geq = p((peq) => {
    Object.defineProperty(peq, "__esModule", {
        value: !0
    });
    peq.CompositePropagator = void 0;
    var meq = $5();
    class Beq {
        _propagators;
        _fields;
        constructor(q = {}) {
            this._propagators = q.propagators ?? [], this._fields = Array.from(new Set(this._propagators.map((K) => typeof K.fields === "function" ? K.fields() : []).reduce((K, _) => K.concat(_), [])))
        }
        inject(q, K, _) {
            for (let z of this._propagators) try {
                z.inject(q, K, _)
            } catch (Y) {
                meq.diag.warn(`Failed to inject with ${z.constructor.name}. Err: ${Y.message}`)
            }
        }
        extract(q, K, _) {
            return this._propagators.reduce((z, Y) => {
                try {
                    return Y.extract(z, K, _)
                } catch (A) {
                    meq.diag.warn(`Failed to extract with ${Y.constructor.name}. Err: ${A.message}`)
                }
                return z
            }, q)
        }
        fields() {
            return this._fields.slice()
        }
    }
    peq.CompositePropagator = Beq
})
// @from(Ln 161805, Col 4)
deq = p((Ueq) => {
    Object.defineProperty(Ueq, "__esModule", {
        value: !0
    });
    Ueq.validateValue = Ueq.validateKey = void 0;
    var wC1 = "[_0-9a-z-*/]",
        gv_ = `[a-z]${wC1}{0,255}`,
        Uv_ = `[a-z0-9]${wC1}{0,240}@[a-z]${wC1}{0,13}`,
        Qv_ = new RegExp(`^(?:${gv_}|${Uv_})$`),
        dv_ = /^[ -~]{0,255}[!-~]$/,
        cv_ = /,|=/;

    function lv_(q) {
        return Qv_.test(q)
    }
    Ueq.validateKey = lv_;

    function nv_(q) {
        return dv_.test(q) && !cv_.test(q)
    }
    Ueq.validateValue = nv_
})
// @from(Ln 161827, Col 4)
jC1 = p((req) => {
    Object.defineProperty(req, "__esModule", {
        value: !0
    });
    req.TraceState = void 0;
    var ceq = deq(),
        leq = 32,
        rv_ = 512,
        neq = ",",
        ieq = "=";
    class $C1 {
        _internalState = new Map;
        constructor(q) {
            if (q) this._parse(q)
        }
        set(q, K) {
            let _ = this._clone();
            if (_._internalState.has(q)) _._internalState.delete(q);
            return _._internalState.set(q, K), _
        }
        unset(q) {
            let K = this._clone();
            return K._internalState.delete(q), K
        }
        get(q) {
            return this._internalState.get(q)
        }
        serialize() {
            return this._keys().reduce((q, K) => {
                return q.push(K + ieq + this.get(K)), q
            }, []).join(neq)
        }
        _parse(q) {
            if (q.length > rv_) return;
            if (this._internalState = q.split(neq).reverse().reduce((K, _) => {
                    let z = _.trim(),
                        Y = z.indexOf(ieq);
                    if (Y !== -1) {
                        let A = z.slice(0, Y),
                            O = z.slice(Y + 1, _.length);
                        if ((0, ceq.validateKey)(A) && (0, ceq.validateValue)(O)) K.set(A, O)
                    }
                    return K
                }, new Map), this._internalState.size > leq) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, leq))
        }
        _keys() {
            return Array.from(this._internalState.keys()).reverse()
        }
        _clone() {
            let q = new $C1;
            return q._internalState = new Map(this._internalState), q
        }
    }
    req.TraceState = $C1
})
// @from(Ln 161882, Col 4)
q64 = p((teq) => {
    Object.defineProperty(teq, "__esModule", {
        value: !0
    });
    teq.W3CTraceContextPropagator = teq.parseTraceParent = teq.TRACE_STATE_HEADER = teq.TRACE_PARENT_HEADER = void 0;
    var tV8 = $5(),
        ov_ = Io6(),
        av_ = jC1();
    teq.TRACE_PARENT_HEADER = "traceparent";
    teq.TRACE_STATE_HEADER = "tracestate";
    var sv_ = "00",
        tv_ = "(?!ff)[\\da-f]{2}",
        ev_ = "(?![0]{32})[\\da-f]{32}",
        qT_ = "(?![0]{16})[\\da-f]{16}",
        KT_ = "[\\da-f]{2}",
        _T_ = new RegExp(`^\\s?(${tv_})-(${ev_})-(${qT_})-(${KT_})(-.*)?\\s?$`);

    function aeq(q) {
        let K = _T_.exec(q);
        if (!K) return null;
        if (K[1] === "00" && K[5]) return null;
        return {
            traceId: K[2],
            spanId: K[3],
            traceFlags: parseInt(K[4], 16)
        }
    }
    teq.parseTraceParent = aeq;
    class seq {
        inject(q, K, _) {
            let z = tV8.trace.getSpanContext(q);
            if (!z || (0, ov_.isTracingSuppressed)(q) || !(0, tV8.isSpanContextValid)(z)) return;
            let Y = `${sv_}-${z.traceId}-${z.spanId}-0${Number(z.traceFlags||tV8.TraceFlags.NONE).toString(16)}`;
            if (_.set(K, teq.TRACE_PARENT_HEADER, Y), z.traceState) _.set(K, teq.TRACE_STATE_HEADER, z.traceState.serialize())
        }
        extract(q, K, _) {
            let z = _.get(K, teq.TRACE_PARENT_HEADER);
            if (!z) return q;
            let Y = Array.isArray(z) ? z[0] : z;
            if (typeof Y !== "string") return q;
            let A = aeq(Y);
            if (!A) return q;
            A.isRemote = !0;
            let O = _.get(K, teq.TRACE_STATE_HEADER);
            if (O) {
                let w = Array.isArray(O) ? O.join(",") : O;
                A.traceState = new av_.TraceState(typeof w === "string" ? w : void 0)
            }
            return tV8.trace.setSpanContext(q, A)
        }
        fields() {
            return [teq.TRACE_PARENT_HEADER, teq.TRACE_STATE_HEADER]
        }
    }
    teq.W3CTraceContextPropagator = seq
})
// @from(Ln 161938, Col 4)
Y64 = p((_64) => {
    Object.defineProperty(_64, "__esModule", {
        value: !0
    });
    _64.getRPCMetadata = _64.deleteRPCMetadata = _64.setRPCMetadata = _64.RPCType = void 0;
    var YT_ = $5(),
        HC1 = (0, YT_.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA"),
        AT_;
    (function(q) {
        q.HTTP = "http"
    })(AT_ = _64.RPCType || (_64.RPCType = {}));

    function OT_(q, K) {
        return q.setValue(HC1, K)
    }
    _64.setRPCMetadata = OT_;

    function wT_(q) {
        return q.deleteValue(HC1)
    }
    _64.deleteRPCMetadata = wT_;

    function $T_(q) {
        return q.getValue(HC1)
    }
    _64.getRPCMetadata = $T_
})
// @from(Ln 161965, Col 4)
J64 = p((j64) => {
    Object.defineProperty(j64, "__esModule", {
        value: !0
    });
    j64.isPlainObject = void 0;
    var JT_ = "[object Object]",
        XT_ = "[object Null]",
        MT_ = "[object Undefined]",
        PT_ = Function.prototype,
        A64 = PT_.toString,
        WT_ = A64.call(Object),
        DT_ = Object.getPrototypeOf,
        O64 = Object.prototype,
        w64 = O64.hasOwnProperty,
        o26 = Symbol ? Symbol.toStringTag : void 0,
        $64 = O64.toString;

    function ZT_(q) {
        if (!fT_(q) || GT_(q) !== JT_) return !1;
        let K = DT_(q);
        if (K === null) return !0;
        let _ = w64.call(K, "constructor") && K.constructor;
        return typeof _ == "function" && _ instanceof _ && A64.call(_) === WT_
    }
    j64.isPlainObject = ZT_;

    function fT_(q) {
        return q != null && typeof q == "object"
    }

    function GT_(q) {
        if (q == null) return q === void 0 ? MT_ : XT_;
        return o26 && o26 in Object(q) ? vT_(q) : TT_(q)
    }

    function vT_(q) {
        let K = w64.call(q, o26),
            _ = q[o26],
            z = !1;
        try {
            q[o26] = void 0, z = !0
        } catch {}
        let Y = $64.call(q);
        if (z)
            if (K) q[o26] = _;
            else delete q[o26];
        return Y
    }

    function TT_(q) {
        return $64.call(q)
    }
})
// @from(Ln 162018, Col 4)
f64 = p((D64) => {
    Object.defineProperty(D64, "__esModule", {
        value: !0
    });
    D64.merge = void 0;
    var X64 = J64(),
        VT_ = 20;

    function kT_(...q) {
        let K = q.shift(),
            _ = new WeakMap;
        while (q.length > 0) K = P64(K, q.shift(), 0, _);
        return K
    }
    D64.merge = kT_;

    function JC1(q) {
        if (_k8(q)) return q.slice();
        return q
    }

    function P64(q, K, _ = 0, z) {
        let Y;
        if (_ > VT_) return;
        if (_++, Kk8(q) || Kk8(K) || W64(K)) Y = JC1(K);
        else if (_k8(q)) {
            if (Y = q.slice(), _k8(K))
                for (let A = 0, O = K.length; A < O; A++) Y.push(JC1(K[A]));
            else if (mo6(K)) {
                let A = Object.keys(K);
                for (let O = 0, w = A.length; O < w; O++) {
                    let $ = A[O];
                    Y[$] = JC1(K[$])
                }
            }
        } else if (mo6(q))
            if (mo6(K)) {
                if (!NT_(q, K)) return K;
                Y = Object.assign({}, q);
                let A = Object.keys(K);
                for (let O = 0, w = A.length; O < w; O++) {
                    let $ = A[O],
                        j = K[$];
                    if (Kk8(j))
                        if (typeof j > "u") delete Y[$];
                        else Y[$] = j;
                    else {
                        let H = Y[$],
                            J = j;
                        if (M64(q, $, z) || M64(K, $, z)) delete Y[$];
                        else {
                            if (mo6(H) && mo6(J)) {
                                let X = z.get(H) || [],
                                    M = z.get(J) || [];
                                X.push({
                                    obj: q,
                                    key: $
                                }), M.push({
                                    obj: K,
                                    key: $
                                }), z.set(H, X), z.set(J, M)
                            }
                            Y[$] = P64(Y[$], j, _, z)
                        }
                    }
                }
            } else Y = K;
        return Y
    }

    function M64(q, K, _) {
        let z = _.get(q[K]) || [];
        for (let Y = 0, A = z.length; Y < A; Y++) {
            let O = z[Y];
            if (O.key === K && O.obj === q) return !0
        }
        return !1
    }

    function _k8(q) {
        return Array.isArray(q)
    }

    function W64(q) {
        return typeof q === "function"
    }

    function mo6(q) {
        return !Kk8(q) && !_k8(q) && !W64(q) && typeof q === "object"
    }

    function Kk8(q) {
        return typeof q === "string" || typeof q === "number" || typeof q === "boolean" || typeof q > "u" || q instanceof Date || q instanceof RegExp || q === null
    }

    function NT_(q, K) {
        if (!(0, X64.isPlainObject)(q) || !(0, X64.isPlainObject)(K)) return !1;
        return !0
    }
})
// @from(Ln 162118, Col 4)
T64 = p((G64) => {
    Object.defineProperty(G64, "__esModule", {
        value: !0
    });
    G64.callWithTimeout = G64.TimeoutError = void 0;
    class zk8 extends Error {
        constructor(q) {
            super(q);
            Object.setPrototypeOf(this, zk8.prototype)
        }
    }
    G64.TimeoutError = zk8;

    function ET_(q, K) {
        let _, z = new Promise(function(A, O) {
            _ = setTimeout(function() {
                O(new zk8("Operation timed out."))
            }, K)
        });
        return Promise.race([q, z]).then((Y) => {
            return clearTimeout(_), Y
        }, (Y) => {
            throw clearTimeout(_), Y
        })
    }
    G64.callWithTimeout = ET_
})
// @from(Ln 162145, Col 4)
E64 = p((k64) => {
    Object.defineProperty(k64, "__esModule", {
        value: !0
    });
    k64.isUrlIgnored = k64.urlMatches = void 0;

    function V64(q, K) {
        if (typeof K === "string") return q === K;
        else return !!q.match(K)
    }
    k64.urlMatches = V64;

    function LT_(q, K) {
        if (!K) return !1;
        for (let _ of K)
            if (V64(q, _)) return !0;
        return !1
    }
    k64.isUrlIgnored = LT_
})
// @from(Ln 162165, Col 4)
R64 = p((L64) => {
    Object.defineProperty(L64, "__esModule", {
        value: !0
    });
    L64.Deferred = void 0;
    class y64 {
        _promise;
        _resolve;
        _reject;
        constructor() {
            this._promise = new Promise((q, K) => {
                this._resolve = q, this._reject = K
            })
        }
        get promise() {
            return this._promise
        }
        resolve(q) {
            this._resolve(q)
        }
        reject(q) {
            this._reject(q)
        }
    }
    L64.Deferred = y64
})
// @from(Ln 162191, Col 4)
I64 = p((C64) => {
    Object.defineProperty(C64, "__esModule", {
        value: !0
    });
    C64.BindOnceFuture = void 0;
    var RT_ = R64();
    class S64 {
        _callback;
        _that;
        _isCalled = !1;
        _deferred = new RT_.Deferred;
        constructor(q, K) {
            this._callback = q, this._that = K
        }
        get isCalled() {
            return this._isCalled
        }
        get promise() {
            return this._deferred.promise
        }
        call(...q) {
            if (!this._isCalled) {
                this._isCalled = !0;
                try {
                    Promise.resolve(this._callback.call(this._that, ...q)).then((K) => this._deferred.resolve(K), (K) => this._deferred.reject(K))
                } catch (K) {
                    this._deferred.reject(K)
                }
            }
            return this._deferred.promise
        }
    }
    C64.BindOnceFuture = S64
})
// @from(Ln 162225, Col 4)
B64 = p((u64) => {
    Object.defineProperty(u64, "__esModule", {
        value: !0
    });
    u64.diagLogLevelFromString = void 0;
    var Ga = $5(),
        x64 = {
            ALL: Ga.DiagLogLevel.ALL,
            VERBOSE: Ga.DiagLogLevel.VERBOSE,
            DEBUG: Ga.DiagLogLevel.DEBUG,
            INFO: Ga.DiagLogLevel.INFO,
            WARN: Ga.DiagLogLevel.WARN,
            ERROR: Ga.DiagLogLevel.ERROR,
            NONE: Ga.DiagLogLevel.NONE
        };

    function ST_(q) {
        if (q == null) return;
        let K = x64[q.toUpperCase()];
        if (K == null) return Ga.diag.warn(`Unknown log level "${q}", expected one of ${Object.keys(x64)}, using default`), Ga.DiagLogLevel.INFO;
        return K
    }
    u64.diagLogLevelFromString = ST_
})
// @from(Ln 162249, Col 4)
U64 = p((F64) => {
    Object.defineProperty(F64, "__esModule", {
        value: !0
    });
    F64._export = void 0;
    var p64 = $5(),
        CT_ = Io6();

    function bT_(q, K) {
        return new Promise((_) => {
            p64.context.with((0, CT_.suppressTracing)(p64.context.active()), () => {
                q.export(K, (z) => {
                    _(z)
                })
            })
        })
    }
    F64._export = bT_
})