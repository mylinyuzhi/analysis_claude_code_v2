
// @from(Ln 8, Col 0)

// @from(Ln 8, Col 0)
import {
    createRequire as yQq
} from "node:module";

// @from(Ln 12, Col 0)

// @from(Ln 12, Col 0)
var {
    getPrototypeOf: TQq,
    defineProperty: Zk6,
    getOwnPropertyNames: Ue8,
    getOwnPropertyDescriptor: vQq
} = Object, de8 = Object.prototype.hasOwnProperty;

// @from(Ln 638, Col 0)

// @from(Ln 638, Col 0)
import {
    randomUUID as yx1
} from "crypto";

// @from(Ln 1010, Col 0)

// @from(Ln 1010, Col 0)
N1(ls6, {
    default: () => vx
});

// @from(Ln 1088, Col 0)

// @from(Ln 1088, Col 0)
N1(os6, {
    default: () => Nx
});

// @from(Ln 1762, Col 0)

// @from(Ln 1762, Col 0)
N1(qm1, {
    updateLastInteractionTime: () => i86,
    switchSession: () => _P,
    snapshotOutputTokensForTurn: () => llq,
    setUserMsgOptIn: () => Lx,
    setUseCoworkPlugins: () => $V,
    setTracerProvider: () => Vt6,
    setTeleportedSessionInfo: () => ok6,
    setSystemPromptSectionCacheEntry: () => au1,
    setStatsStore: () => zu1,
    setSessionTrustAccepted: () => ik6,
    setSessionSource: () => ku1,
    setSessionPersistenceDisabled: () => gu1,
    setSessionIngressToken: () => s86,
    setSessionBypassPermissionsMode: () => mu1,
    setSdkBetas: () => Du1,
    setSdkAgentProgressSummariesEnabled: () => Vu1,
    setScheduledTasksEnabled: () => dk6,
    setQuestionPreviewFormat: () => Et6,
    setPromptId: () => tk6,
    setPromptCache1hAllowlist: () => Am1,
    setOriginalCwd: () => Jp,
    setOauthTokenFromFd: () => t86,
    setNeedsPlanModeExitAttachment: () => JS,
    setNeedsAutoModeExitAttachment: () => MS,
    setModelStrings: () => uk6,
    setMeterProvider: () => Nt6,
    setMeter: () => Xu1,
    setMainThreadAgentType: () => Wp,
    setMainLoopModelOverride: () => MW,
    setLspRecommendationShownThisSession: () => du1,
    setLoggerProvider: () => Tt6,
    setLastEmittedDate: () => dw6,
    setLastClassifierRequests: () => Fk6,
    setLastAPIRequest: () => Su1,
    setKairosActive: () => alq,
    setIsRemoteMode: () => nu1,
    setIsInteractive: () => vu1,
    setIsInWorktree: () => _A6,
    setInlinePlugins: () => xu1,
    setInitialMainLoopModel: () => Mu1,
    setInitJsonSchema: () => cu1,
    setHasUnknownModelCost: () => Gt6,
    setHasExitedPlanMode: () => HV,
    setFlagSettingsPath: () => Eu1,
    setFlagSettingsInline: () => yu1,
    setEventLogger: () => vt6,
    setDirectConnectServerUrl: () => Ilq,
    setCwdState: () => Xt6,
    setCostStateForRestore: () => xk6,
    setClientType: () => Nu1,
    setChromeFlagOverride: () => uu1,
    setApiKeyFromFd: () => e86,
    setAllowedSettingSources: () => bu1,
    setAllowedChannels: () => Kiq,
    setAdditionalDirectoriesForClaudeMd: () => ak6,
    resetTurnToolDuration: () => qu1,
    resetTurnHookDuration: () => Au1,
    resetTurnClassifierDuration: () => Yu1,
    resetTotalDurationStateAndCost_FOR_TESTS_ONLY: () => blq,
    resetStateForTests: () => u8A,
    resetSdkInitState: () => B8A,
    resetModelStringsForTestingOnly: () => rlq,
    resetCostState: () => uw6,
    removeSessionCronTasks: () => lk6,
    registerHookCallbacks: () => KA6,
    regenerateSessionId: () => ix1,
    preferThirdPartyAuthentication: () => pk6,
    needsPlanModeExitAttachment: () => Fu1,
    needsAutoModeExitAttachment: () => pu1,
    markFirstTeleportMessageLogged: () => ht6,
    isSessionPersistenceDisabled: () => jS,
    incrementBudgetContinuationCount: () => nlq,
    hasUnknownModelCost: () => ju1,
    hasShownLspRecommendationThisSession: () => Uu1,
    hasExitedPlanModeInSession: () => nk6,
    handlePlanModeTransition: () => Dp,
    handleAutoModeTransition: () => Qu1,
    getUserMsgOptIn: () => KG,
    getUseCoworkPlugins: () => Uk6,
    getUsageForModel: () => Ju1,
    getTurnToolDurationMs: () => Flq,
    getTurnToolCount: () => plq,
    getTurnOutputTokens: () => dlq,
    getTurnHookDurationMs: () => Blq,
    getTurnHookCount: () => glq,
    getTurnClassifierDurationMs: () => Qlq,
    getTurnClassifierCount: () => Ulq,
    getTracerProvider: () => a86,
    getTotalWebSearchRequests: () => Ou1,
    getTotalToolDuration: () => tx1,
    getTotalOutputTokens: () => Mp,
    getTotalLinesRemoved: () => r86,
    getTotalLinesAdded: () => n86,
    getTotalInputTokens: () => o86,
    getTotalDuration: () => Iw6,
    getTotalCostUSD: () => LD,
    getTotalCacheReadInputTokens: () => Ik6,
    getTotalCacheCreationInputTokens: () => bk6,
    getTotalAPIDurationWithoutRetries: () => sx1,
    getTotalAPIDuration: () => OV,
    getTokenSaverHits: () => mlq,
    getTokenSaverBytesSaved: () => ulq,
    getTokenCounter: () => Bw6,
    getTeleportedSessionInfo: () => Rt6,
    getSystemPromptSectionCache: () => ou1,
    getStatsStore: () => bw6,
    getSlowOperations: () => F8A,
    getSessionTrustAccepted: () => Qw6,
    getSessionSource: () => slq,
    getSessionProjectDir: () => Ck6,
    getSessionIngressToken: () => Lu1,
    getSessionId: () => R1,
    getSessionCronTasks: () => ck6,
    getSessionCreatedTeams: () => rk6,
    getSessionCounter: () => Pu1,
    getSessionBypassPermissionsMode: () => qA6,
    getSdkBetas: () => Zj,
    getSdkAgentProgressSummariesEnabled: () => Nn,
    getScheduledTasksEnabled: () => pw6,
    getRegisteredHooks: () => Xp,
    getQuestionPreviewFormat: () => kt6,
    getPromptId: () => sk6,
    getPromptCache1hAllowlist: () => eu1,
    getProjectRoot: () => qY,
    getPrCounter: () => mk6,
    getPlanSlugCache: () => YA6,
    getParentSessionId: () => nx1,
    getOriginalCwd: () => AA,
    getOauthTokenFromFd: () => Ru1,
    getModelUsage: () => $S,
    getModelStrings: () => mw6,
    getMeterProvider: () => Tu1,
    getMeter: () => olq,
    getMainThreadAgentType: () => Pp,
    getMainLoopModelOverride: () => HS,
    getLoggerProvider: () => gk6,
    getLocCounter: () => ft6,
    getLastInteractionTime: () => yx,
    getLastEmittedDate: () => tu1,
    getLastClassifierRequests: () => m8A,
    getLastAPIRequest: () => Cu1,
    getKairosActive: () => Vn,
    getIsRemoteMode: () => t4,
    getIsNonInteractiveSession: () => q7,
    getIsInteractive: () => DW,
    getIsInWorktree: () => ru1,
    getInvokedSkillsForAgent: () => St6,
    getInvokedSkills: () => Aiq,
    getInlinePlugins: () => AA6,
    getInitialMainLoopModel: () => xw6,
    getInitJsonSchema: () => Lt6,
    getFlagSettingsPath: () => kn,
    getFlagSettingsInline: () => Fw6,
    getEventLogger: () => fu1,
    getDirectConnectServerUrl: () => rx1,
    getCwdState: () => OS,
    getCurrentTurnTokenBudget: () => clq,
    getCostCounter: () => Zu1,
    getCommitCounter: () => Wu1,
    getCodeEditToolDecisionCounter: () => Bk6,
    getClientType: () => gw6,
    getChromeFlagOverride: () => Qk6,
    getBudgetContinuationCount: () => ilq,
    getApiKeyFromFd: () => hu1,
    getAllowedSettingSources: () => Iu1,
    getAllowedChannels: () => qiq,
    getAgentColorMap: () => yt6,
    getAdditionalDirectoriesForClaudeMd: () => XT,
    getActiveTimeCounter: () => Gu1,
    flushInteractionTime: () => wu1,
    clearSystemPromptSectionState: () => su1,
    clearRegisteredPluginHooks: () => lu1,
    clearRegisteredHooks: () => elq,
    clearInvokedSkillsForAgent: () => zA6,
    clearInvokedSkills: () => iu1,
    addToTurnHookDuration: () => ex1,
    addToTurnClassifierDuration: () => Ku1,
    addToTotalLinesChanged: () => Wt6,
    addToTotalDurationState: () => ox1,
    addToTotalCostState: () => ax1,
    addToToolDuration: () => Pt6,
    addToTokenSaverBytes: () => xlq,
    addToInMemoryErrorLog: () => tlq,
    addSlowOperation: () => g8A,
    addSessionCronTask: () => Bu1,
    addInvokedSkill: () => Uw6
});

// @from(Ln 1950, Col 0)

// @from(Ln 1950, Col 0)
import {
    cwd as Clq
} from "process";

// @from(Ln 1953, Col 0)

// @from(Ln 1953, Col 0)
import {
    realpathSync as S8A
} from "fs";

// @from(Ln 3022, Col 0)

// @from(Ln 3022, Col 0)
N1(It6, {
    default: () => qE6
});

// @from(Ln 3390, Col 0)

// @from(Ln 3390, Col 0)
import {
    writeFileSync as xAA,
    openSync as gnq,
    fsyncSync as Fnq,
    closeSync as pnq
} from "fs";

// @from(Ln 3479, Col 0)

// @from(Ln 3479, Col 0)
import * as W5 from "fs";

// @from(Ln 3480, Col 0)

// @from(Ln 3480, Col 0)
import {
    homedir as uAA
} from "os";

// @from(Ln 3483, Col 0)

// @from(Ln 3483, Col 0)
import * as RD from "path";

// @from(Ln 3484, Col 0)

// @from(Ln 3484, Col 0)
import {
    stat as dnq,
    readdir as cnq,
    readFile as mAA,
    unlink as lnq,
    rmdir as inq,
    rm as nnq,
    mkdir as rnq,
    rename as onq,
    open as Ut6
} from "fs/promises";

// @from(Ln 4030, Col 0)

// @from(Ln 4030, Col 0)
import {
    join as gAA
} from "path";

// @from(Ln 4033, Col 0)

// @from(Ln 4033, Col 0)
import {
    homedir as enq
} from "os";

// @from(Ln 4177, Col 0)

// @from(Ln 4177, Col 0)
import {
    dirname as UAA,
    join as dAA
} from "path";

// @from(Ln 4330, Col 0)

// @from(Ln 4330, Col 0)
N1(z7A, {
    profileReport: () => YE6,
    profileCheckpoint: () => Zq,
    logStartupPerf: () => Y7A,
    isDetailedProfilingEnabled: () => jrq,
    getStartupPerfLogPath: () => K7A
});

// @from(Ln 4337, Col 0)

// @from(Ln 4337, Col 0)
import {
    join as wrq,
    dirname as Orq
} from "path";

// @from(Ln 4490, Col 0)

// @from(Ln 4490, Col 0)
N1(R7, {
    unwrapMessage: () => wE6,
    stringifyPrimitive: () => I7,
    required: () => Lrq,
    randomString: () => Grq,
    propertyKeyTypes: () => jE6,
    promiseAllObject: () => Zrq,
    primitiveTypes: () => vm1,
    prefixIssues: () => WT,
    pick: () => Nrq,
    partial: () => yrq,
    optionalKeys: () => Nm1,
    omit: () => Vrq,
    numKeys: () => frq,
    nullish: () => Ln,
    normalizeParams: () => M7,
    merge: () => Erq,
    jsonStringifyReplacer: () => Zm1,
    joinValues: () => _A,
    issue: () => Em1,
    isPlainObject: () => qO6,
    isObject: () => AO6,
    getSizableOrigin: () => JE6,
    getParsedType: () => Trq,
    getLengthableOrigin: () => ME6,
    getEnumValues: () => OE6,
    getElementAtPath: () => Wrq,
    floatSafeRemainder: () => Gm1,
    finalizeIssue: () => MV,
    extend: () => krq,
    escapeRegex: () => Gp,
    esc: () => HA6,
    defineLazy: () => uz,
    createTransparentProxy: () => vrq,
    clone: () => JV,
    cleanRegex: () => HE6,
    cleanEnum: () => Rrq,
    captureStackTrace: () => rt6,
    cached: () => $E6,
    assignProp: () => fm1,
    assertNotEqual: () => Mrq,
    assertNever: () => Xrq,
    assertIs: () => Drq,
    assertEqual: () => Jrq,
    assert: () => Prq,
    allowsEval: () => Tm1,
    aborted: () => jA6,
    NUMBER_FORMAT_RANGES: () => Vm1,
    Class: () => _7A,
    BIGINT_FORMAT_RANGES: () => km1
});

// @from(Ln 5189, Col 0)

// @from(Ln 5189, Col 0)
N1(MA6, {
    xid: () => Im1,
    uuid7: () => brq,
    uuid6: () => Irq,
    uuid4: () => Crq,
    uuid: () => JA6,
    uppercase: () => YB1,
    unicodeEmail: () => mrq,
    undefined: () => qB1,
    ulid: () => Cm1,
    time: () => nm1,
    string: () => om1,
    rfc5322Email: () => urq,
    number: () => tm1,
    null: () => AB1,
    nanoid: () => xm1,
    lowercase: () => KB1,
    ksuid: () => bm1,
    ipv6: () => pm1,
    ipv4: () => Fm1,
    integer: () => sm1,
    html5Email: () => xrq,
    hostname: () => cm1,
    guid: () => mm1,
    extendedDuration: () => Srq,
    emoji: () => gm1,
    email: () => Bm1,
    e164: () => lm1,
    duration: () => um1,
    domain: () => Frq,
    datetime: () => rm1,
    date: () => im1,
    cuid2: () => Sm1,
    cuid: () => hm1,
    cidrv6: () => Um1,
    cidrv4: () => Qm1,
    browserEmail: () => Brq,
    boolean: () => em1,
    bigint: () => am1,
    base64url: () => Ae6,
    base64: () => dm1,
    _emoji: () => grq
});

// @from(Ln 11617, Col 0)

// @from(Ln 11617, Col 0)
N1(wO6, {
    zhTW: () => JF1,
    zhCN: () => jF1,
    vi: () => HF1,
    ur: () => $F1,
    ua: () => OF1,
    tr: () => wF1,
    th: () => _F1,
    ta: () => zF1,
    sv: () => YF1,
    sl: () => KF1,
    ru: () => qF1,
    pt: () => AF1,
    ps: () => tg1,
    pl: () => eg1,
    ota: () => sg1,
    no: () => ag1,
    nl: () => og1,
    ms: () => rg1,
    mk: () => ng1,
    ko: () => ig1,
    kh: () => lg1,
    ja: () => cg1,
    it: () => dg1,
    id: () => Ug1,
    hu: () => Qg1,
    he: () => pg1,
    frCA: () => Fg1,
    fr: () => gg1,
    fi: () => Bg1,
    fa: () => mg1,
    es: () => ug1,
    eo: () => xg1,
    en: () => kE6,
    de: () => Ig1,
    cs: () => Cg1,
    ca: () => Sg1,
    be: () => hg1,
    az: () => Rg1,
    ar: () => Lg1
});

// @from(Ln 13382, Col 0)

// @from(Ln 13382, Col 0)
N1(Ix, {
    version: () => NB1,
    util: () => R7,
    treeifyError: () => ym1,
    toJSONSchema: () => Np,
    toDotPath: () => O7A,
    safeParseAsync: () => GE6,
    safeParse: () => YO6,
    registry: () => Me6,
    regexes: () => MA6,
    prettifyError: () => Lm1,
    parseAsync: () => ZE6,
    parse: () => WE6,
    locales: () => wO6,
    isValidJWT: () => E7A,
    isValidBase64URL: () => k7A,
    isValidBase64: () => cB1,
    globalRegistry: () => Cx,
    globalConfig: () => zE6,
    function: () => Yp1,
    formatError: () => PE6,
    flattenError: () => XE6,
    config: () => PJ,
    clone: () => JV,
    _xid: () => ke6,
    _void: () => pF1,
    _uuidv7: () => Ze6,
    _uuidv6: () => We6,
    _uuidv4: () => Pe6,
    _uuid: () => Xe6,
    _url: () => Ge6,
    _uppercase: () => SE6,
    _unknown: () => OO6,
    _union: () => Roq,
    _undefined: () => mF1,
    _ulid: () => Ve6,
    _uint64: () => xF1,
    _uint32: () => RF1,
    _tuple: () => oF1,
    _trim: () => mE6,
    _transform: () => Boq,
    _toUpperCase: () => gE6,
    _toLowerCase: () => BE6,
    _templateLiteral: () => ioq,
    _symbol: () => uF1,
    _success: () => Uoq,
    _stringbool: () => eF1,
    _stringFormat: () => Ap1,
    _string: () => PF1,
    _startsWith: () => IE6,
    _size: () => LE6,
    _set: () => boq,
    _safeParseAsync: () => tt6,
    _safeParse: () => st6,
    _regex: () => RE6,
    _refine: () => tF1,
    _record: () => Coq,
    _readonly: () => loq,
    _property: () => rF1,
    _promise: () => roq,
    _positive: () => cF1,
    _pipe: () => coq,
    _parseAsync: () => at6,
    _parse: () => ot6,
    _overwrite: () => vp,
    _optional: () => goq,
    _number: () => NF1,
    _nullable: () => Foq,
    _null: () => BF1,
    _normalize: () => uE6,
    _nonpositive: () => iF1,
    _nonoptional: () => Qoq,
    _nonnegative: () => nF1,
    _never: () => FF1,
    _negative: () => lF1,
    _nativeEnum: () => uoq,
    _nanoid: () => Te6,
    _nan: () => dF1,
    _multipleOf: () => PA6,
    _minSize: () => WA6,
    _minLength: () => Rn,
    _min: () => ZT,
    _mime: () => xE6,
    _maxSize: () => $O6,
    _maxLength: () => HO6,
    _max: () => eE,
    _map: () => Ioq,
    _lte: () => eE,
    _lt: () => fp,
    _lowercase: () => hE6,
    _literal: () => moq,
    _length: () => jO6,
    _lazy: () => noq,
    _ksuid: () => Ee6,
    _jwt: () => be6,
    _isoTime: () => TF1,
    _isoDuration: () => vF1,
    _isoDateTime: () => GF1,
    _isoDate: () => fF1,
    _ipv6: () => Le6,
    _ipv4: () => ye6,
    _intersection: () => Soq,
    _int64: () => bF1,
    _int32: () => LF1,
    _int: () => kF1,
    _includes: () => CE6,
    _guid: () => yE6,
    _gte: () => ZT,
    _gt: () => Tp,
    _float64: () => yF1,
    _float32: () => EF1,
    _file: () => aF1,
    _enum: () => xoq,
    _endsWith: () => bE6,
    _emoji: () => fe6,
    _email: () => De6,
    _e164: () => Ie6,
    _discriminatedUnion: () => hoq,
    _default: () => poq,
    _date: () => QF1,
    _custom: () => sF1,
    _cuid2: () => Ne6,
    _cuid: () => ve6,
    _coercedString: () => WF1,
    _coercedNumber: () => VF1,
    _coercedDate: () => UF1,
    _coercedBoolean: () => SF1,
    _coercedBigint: () => IF1,
    _cidrv6: () => he6,
    _cidrv4: () => Re6,
    _catch: () => doq,
    _boolean: () => hF1,
    _bigint: () => CF1,
    _base64url: () => Ce6,
    _base64: () => Se6,
    _array: () => FE6,
    _any: () => gF1,
    TimePrecision: () => ZF1,
    NEVER: () => _E6,
    JSONSchemaGenerator: () => xe6,
    JSONSchema: () => P4A,
    Doc: () => _e6,
    $output: () => MF1,
    $input: () => DF1,
    $constructor: () => H8,
    $brand: () => Pm1,
    $ZodXID: () => xB1,
    $ZodVoid: () => Yg1,
    $ZodUnknown: () => _O6,
    $ZodUnion: () => je6,
    $ZodUndefined: () => eB1,
    $ZodUUID: () => yB1,
    $ZodURL: () => RB1,
    $ZodULID: () => bB1,
    $ZodType: () => _5,
    $ZodTuple: () => XA6,
    $ZodTransform: () => vE6,
    $ZodTemplateLiteral: () => Vg1,
    $ZodSymbol: () => tB1,
    $ZodSuccess: () => fg1,
    $ZodStringFormat: () => b2,
    $ZodString: () => DA6,
    $ZodSet: () => jg1,
    $ZodRegistry: () => EE6,
    $ZodRecord: () => $g1,
    $ZodRealError: () => KO6,
    $ZodReadonly: () => Ng1,
    $ZodPromise: () => kg1,
    $ZodPrefault: () => Zg1,
    $ZodPipe: () => NE6,
    $ZodOptional: () => Xg1,
    $ZodObject: () => _g1,
    $ZodNumberFormat: () => aB1,
    $ZodNumber: () => $e6,
    $ZodNullable: () => Pg1,
    $ZodNull: () => Ag1,
    $ZodNonOptional: () => Gg1,
    $ZodNever: () => Kg1,
    $ZodNanoID: () => SB1,
    $ZodNaN: () => vg1,
    $ZodMap: () => Hg1,
    $ZodLiteral: () => Mg1,
    $ZodLazy: () => Eg1,
    $ZodKSUID: () => uB1,
    $ZodJWT: () => rB1,
    $ZodIntersection: () => Og1,
    $ZodISOTime: () => gB1,
    $ZodISODuration: () => FB1,
    $ZodISODateTime: () => mB1,
    $ZodISODate: () => BB1,
    $ZodIPv6: () => QB1,
    $ZodIPv4: () => pB1,
    $ZodGUID: () => EB1,
    $ZodFunction: () => Kp1,
    $ZodFile: () => Dg1,
    $ZodError: () => DE6,
    $ZodEnum: () => Jg1,
    $ZodEmoji: () => hB1,
    $ZodEmail: () => LB1,
    $ZodE164: () => nB1,
    $ZodDiscriminatedUnion: () => wg1,
    $ZodDefault: () => Wg1,
    $ZodDate: () => zg1,
    $ZodCustomStringFormat: () => oB1,
    $ZodCustom: () => yg1,
    $ZodCheckUpperCase: () => PB1,
    $ZodCheckStringFormat: () => zO6,
    $ZodCheckStartsWith: () => ZB1,
    $ZodCheckSizeEquals: () => HB1,
    $ZodCheckRegex: () => DB1,
    $ZodCheckProperty: () => fB1,
    $ZodCheckOverwrite: () => vB1,
    $ZodCheckNumberFormat: () => _B1,
    $ZodCheckMultipleOf: () => zB1,
    $ZodCheckMinSize: () => $B1,
    $ZodCheckMinLength: () => JB1,
    $ZodCheckMimeType: () => TB1,
    $ZodCheckMaxSize: () => OB1,
    $ZodCheckMaxLength: () => jB1,
    $ZodCheckLowerCase: () => XB1,
    $ZodCheckLessThan: () => Ke6,
    $ZodCheckLengthEquals: () => MB1,
    $ZodCheckIncludes: () => WB1,
    $ZodCheckGreaterThan: () => Ye6,
    $ZodCheckEndsWith: () => GB1,
    $ZodCheckBigIntFormat: () => wB1,
    $ZodCheck: () => S$,
    $ZodCatch: () => Tg1,
    $ZodCUID2: () => IB1,
    $ZodCUID: () => CB1,
    $ZodCIDRv6: () => dB1,
    $ZodCIDRv4: () => UB1,
    $ZodBoolean: () => fE6,
    $ZodBigIntFormat: () => sB1,
    $ZodBigInt: () => He6,
    $ZodBase64URL: () => iB1,
    $ZodBase64: () => lB1,
    $ZodAsyncError: () => Zp,
    $ZodArray: () => TE6,
    $ZodAny: () => qg1
});

// @from(Ln 13643, Col 0)

// @from(Ln 13643, Col 0)
N1(JO6, {
    time: () => Op1,
    duration: () => $p1,
    datetime: () => _p1,
    date: () => wp1,
    ZodISOTime: () => Be6,
    ZodISODuration: () => ge6,
    ZodISODateTime: () => ue6,
    ZodISODate: () => me6
});

// @from(Ln 14538, Col 0)

// @from(Ln 14538, Col 0)
N1(nE6, {
    string: () => oaq,
    number: () => aaq,
    date: () => eaq,
    boolean: () => saq,
    bigint: () => taq
});

// @from(Ln 14570, Col 0)

// @from(Ln 14570, Col 0)
N1(C, {
    xid: () => Haq,
    void: () => haq,
    uuidv7: () => Yaq,
    uuidv6: () => Kaq,
    uuidv4: () => qaq,
    uuid: () => Aaq,
    url: () => fp1,
    uppercase: () => SE6,
    unknown: () => KO,
    union: () => L_,
    undefined: () => Raq,
    ulid: () => $aq,
    uint64: () => yaq,
    uint32: () => Vaq,
    tuple: () => baq,
    trim: () => mE6,
    treeifyError: () => ym1,
    transform: () => pp1,
    toUpperCase: () => gE6,
    toLowerCase: () => BE6,
    toJSONSchema: () => Np,
    templateLiteral: () => Uaq,
    symbol: () => Laq,
    superRefine: () => e4A,
    success: () => paq,
    stringbool: () => laq,
    stringFormat: () => faq,
    string: () => x1,
    strictObject: () => Iaq,
    startsWith: () => IE6,
    size: () => LE6,
    setErrorMap: () => naq,
    set: () => maq,
    safeParseAsync: () => Dp1,
    safeParse: () => Mp1,
    registry: () => Me6,
    regexes: () => MA6,
    regex: () => RE6,
    refine: () => t4A,
    record: () => Tw,
    readonly: () => i4A,
    property: () => rF1,
    promise: () => daq,
    prettifyError: () => Lm1,
    preprocess: () => oe6,
    prefault: () => F4A,
    positive: () => cF1,
    pipe: () => de6,
    partialRecord: () => xaq,
    parseAsync: () => Jp1,
    parse: () => jp1,
    overwrite: () => vp,
    optional: () => YO,
    object: () => p7,
    number: () => NY,
    nullish: () => Faq,
    nullable: () => Ue6,
    null: () => lE6,
    normalize: () => uE6,
    nonpositive: () => iF1,
    nonoptional: () => p4A,
    nonnegative: () => nF1,
    never: () => ce6,
    negative: () => lF1,
    nativeEnum: () => Baq,
    nanoid: () => _aq,
    nan: () => Qaq,
    multipleOf: () => PA6,
    minSize: () => WA6,
    minLength: () => Rn,
    mime: () => xE6,
    maxSize: () => $O6,
    maxLength: () => HO6,
    map: () => uaq,
    lte: () => eE,
    lt: () => fp,
    lowercase: () => hE6,
    looseObject: () => WJ,
    locales: () => wO6,
    literal: () => e4,
    length: () => jO6,
    lazy: () => o4A,
    ksuid: () => jaq,
    keyof: () => Caq,
    jwt: () => Gaq,
    json: () => iaq,
    iso: () => JO6,
    ipv6: () => Maq,
    ipv4: () => Jaq,
    intersection: () => iE6,
    int64: () => Eaq,
    int32: () => Naq,
    int: () => Pp1,
    instanceof: () => caq,
    includes: () => CE6,
    guid: () => eoq,
    gte: () => ZT,
    gt: () => Tp,
    globalRegistry: () => Cx,
    getErrorMap: () => raq,
    function: () => Yp1,
    formatError: () => PE6,
    float64: () => vaq,
    float32: () => Taq,
    flattenError: () => XE6,
    file: () => gaq,
    enum: () => wG,
    endsWith: () => bE6,
    emoji: () => zaq,
    email: () => toq,
    e164: () => Zaq,
    discriminatedUnion: () => ne6,
    date: () => Saq,
    custom: () => cp1,
    cuid2: () => Oaq,
    cuid: () => waq,
    core: () => Ix,
    config: () => PJ,
    coerce: () => nE6,
    clone: () => JV,
    cidrv6: () => Xaq,
    cidrv4: () => Daq,
    check: () => s4A,
    catch: () => d4A,
    boolean: () => y_,
    bigint: () => kaq,
    base64url: () => Waq,
    base64: () => Paq,
    array: () => h7,
    any: () => mp1,
    _default: () => B4A,
    _ZodString: () => Wp1,
    ZodXID: () => Ep1,
    ZodVoid: () => y4A,
    ZodUnknown: () => k4A,
    ZodUnion: () => Bp1,
    ZodUndefined: () => v4A,
    ZodUUID: () => Vp,
    ZodURL: () => Gp1,
    ZodULID: () => kp1,
    ZodType: () => Q3,
    ZodTuple: () => S4A,
    ZodTransform: () => Fp1,
    ZodTemplateLiteral: () => n4A,
    ZodSymbol: () => T4A,
    ZodSuccess: () => Q4A,
    ZodStringFormat: () => fw,
    ZodString: () => QE6,
    ZodSet: () => I4A,
    ZodRecord: () => gp1,
    ZodRealError: () => MO6,
    ZodReadonly: () => l4A,
    ZodPromise: () => a4A,
    ZodPrefault: () => g4A,
    ZodPipe: () => dp1,
    ZodOptional: () => Qp1,
    ZodObject: () => ie6,
    ZodNumberFormat: () => DO6,
    ZodNumber: () => UE6,
    ZodNullable: () => u4A,
    ZodNull: () => N4A,
    ZodNonOptional: () => Up1,
    ZodNever: () => E4A,
    ZodNanoID: () => vp1,
    ZodNaN: () => c4A,
    ZodMap: () => C4A,
    ZodLiteral: () => b4A,
    ZodLazy: () => r4A,
    ZodKSUID: () => yp1,
    ZodJWT: () => xp1,
    ZodIssueCode: () => lp1,
    ZodIntersection: () => h4A,
    ZodISOTime: () => Be6,
    ZodISODuration: () => ge6,
    ZodISODateTime: () => ue6,
    ZodISODate: () => me6,
    ZodIPv6: () => Rp1,
    ZodIPv4: () => Lp1,
    ZodGUID: () => Qe6,
    ZodFile: () => x4A,
    ZodError: () => aoq,
    ZodEnum: () => pE6,
    ZodEmoji: () => Tp1,
    ZodEmail: () => Zp1,
    ZodE164: () => bp1,
    ZodDiscriminatedUnion: () => R4A,
    ZodDefault: () => m4A,
    ZodDate: () => le6,
    ZodCustomStringFormat: () => f4A,
    ZodCustom: () => re6,
    ZodCatch: () => U4A,
    ZodCUID2: () => Vp1,
    ZodCUID: () => Np1,
    ZodCIDRv6: () => Sp1,
    ZodCIDRv4: () => hp1,
    ZodBoolean: () => dE6,
    ZodBigIntFormat: () => up1,
    ZodBigInt: () => cE6,
    ZodBase64URL: () => Ip1,
    ZodBase64: () => Cp1,
    ZodArray: () => L4A,
    ZodAny: () => V4A,
    TimePrecision: () => ZF1,
    NEVER: () => _E6,
    $output: () => MF1,
    $input: () => DF1,
    $brand: () => Pm1
});

// @from(Ln 15420, Col 0)

// @from(Ln 15420, Col 0)
import vqA from "node:process";

// @from(Ln 17366, Col 0)

// @from(Ln 17366, Col 0)
N1(V61, {
    default: () => HP,
    createWebSocketStream: () => kKA.default,
    WebSocketServer: () => LKA.default,
    WebSocket: () => RQ1.default,
    Sender: () => yKA.default,
    Receiver: () => EKA.default
});

// @from(Ln 17378, Col 0)

// @from(Ln 17378, Col 0)
import {
    promises as RKA
} from "fs";

// @from(Ln 17381, Col 0)

// @from(Ln 17381, Col 0)
import {
    createConnection as ueq
} from "net";

// @from(Ln 17384, Col 0)

// @from(Ln 17384, Col 0)
import {
    platform as meq
} from "os";

// @from(Ln 17387, Col 0)

// @from(Ln 17387, Col 0)
import {
    dirname as Beq
} from "path";

// @from(Ln 21989, Col 0)

// @from(Ln 21989, Col 0)
N1(K4, {
    void: () => k6K,
    util: () => P9,
    unknown: () => N6K,
    union: () => hA6,
    undefined: () => f6K,
    tuple: () => L6K,
    transformer: () => u6K,
    symbol: () => G6K,
    string: () => CA,
    strictObject: () => WV,
    setErrorMap: () => deq,
    set: () => h6K,
    record: () => NS,
    quotelessJson: () => Qeq,
    promise: () => x6K,
    preprocess: () => g6K,
    pipeline: () => F6K,
    ostring: () => p6K,
    optional: () => m6K,
    onumber: () => Q6K,
    oboolean: () => U6K,
    objectUtil: () => CQ1,
    object: () => PV,
    number: () => Yy,
    nullable: () => B6K,
    null: () => T6K,
    never: () => V6K,
    nativeEnum: () => b6K,
    nan: () => P6K,
    map: () => R6K,
    makeIssue: () => Ey6,
    literal: () => I6K,
    lazy: () => C6K,
    late: () => D6K,
    isValid: () => mn,
    isDirty: () => C61,
    isAsync: () => EO6,
    isAborted: () => S61,
    intersection: () => y6K,
    instanceof: () => X6K,
    getParsedType: () => ux,
    getErrorMap: () => kO6,
    function: () => S6K,
    enum: () => VS,
    effect: () => u6K,
    discriminatedUnion: () => E6K,
    defaultErrorMap: () => Cp,
    datetimeRegex: () => gKA,
    date: () => Z6K,
    custom: () => pKA,
    coerce: () => d6K,
    boolean: () => CD,
    bigint: () => W6K,
    array: () => VH,
    any: () => v6K,
    addIssueToContext: () => o7,
    ZodVoid: () => Ly6,
    ZodUnknown: () => Bn,
    ZodUnion: () => CO6,
    ZodUndefined: () => hO6,
    ZodType: () => U3,
    ZodTuple: () => Bx,
    ZodTransformer: () => vS,
    ZodSymbol: () => yy6,
    ZodString: () => ZS,
    ZodSet: () => LA6,
    ZodSchema: () => U3,
    ZodRecord: () => Ry6,
    ZodReadonly: () => gO6,
    ZodPromise: () => RA6,
    ZodPipeline: () => Cy6,
    ZodParsedType: () => f7,
    ZodOptional: () => fS,
    ZodObject: () => C$,
    ZodNumber: () => gn,
    ZodNullable: () => bp,
    ZodNull: () => SO6,
    ZodNever: () => mx,
    ZodNativeEnum: () => uO6,
    ZodNaN: () => Sy6,
    ZodMap: () => hy6,
    ZodLiteral: () => xO6,
    ZodLazy: () => bO6,
    ZodIssueCode: () => pA,
    ZodIntersection: () => IO6,
    ZodFunction: () => LO6,
    ZodFirstPartyTypeKind: () => SK,
    ZodError: () => GT,
    ZodEnum: () => pn,
    ZodEffects: () => vS,
    ZodDiscriminatedUnion: () => I61,
    ZodDefault: () => mO6,
    ZodDate: () => EA6,
    ZodCatch: () => BO6,
    ZodBranded: () => b61,
    ZodBoolean: () => RO6,
    ZodBigInt: () => Fn,
    ZodArray: () => GS,
    ZodAny: () => yA6,
    Schema: () => U3,
    ParseStatus: () => jP,
    OK: () => XW,
    NEVER: () => c6K,
    INVALID: () => PK,
    EMPTY_PATH: () => ceq,
    DIRTY: () => kA6,
    BRAND: () => M6K
});

// @from(Ln 30296, Col 0)

// @from(Ln 30296, Col 0)
N1(izA, {
    localPlatformLabel: () => E61,
    createClaudeForChromeMcpServer: () => y11,
    createChromeSocketClient: () => Xd1,
    createBridgeClient: () => L61,
    BridgeClient: () => y61,
    BROWSER_TOOLS: () => Sp
});

// @from(Ln 30695, Col 0)

// @from(Ln 30695, Col 0)
import h11 from "node:process";

// @from(Ln 30696, Col 0)

// @from(Ln 30696, Col 0)
import OL6 from "node:path";

// @from(Ln 30697, Col 0)

// @from(Ln 30697, Col 0)
import {
    fileURLToPath as x_A
} from "node:url";

// @from(Ln 31045, Col 0)

// @from(Ln 31045, Col 0)
import {
    constants as e3K
} from "node:os";

// @from(Ln 31078, Col 0)

// @from(Ln 31078, Col 0)
import {
    constants as q9K
} from "node:os";

// @from(Ln 31145, Col 0)

// @from(Ln 31145, Col 0)
import O9K from "node:process";

// @from(Ln 31366, Col 0)

// @from(Ln 31366, Col 0)
import M9K from "node:os";

// @from(Ln 31443, Col 0)

// @from(Ln 31443, Col 0)
import {
    createWriteStream as f9K
} from "node:fs";

// @from(Ln 31446, Col 0)

// @from(Ln 31446, Col 0)
import {
    ChildProcess as T9K
} from "node:child_process";

// @from(Ln 31721, Col 0)

// @from(Ln 31721, Col 0)
import {
    createReadStream as p9K,
    readFileSync as Q9K
} from "node:fs";

// @from(Ln 31725, Col 0)

// @from(Ln 31725, Col 0)
import {
    setTimeout as U9K
} from "node:timers/promises";

// @from(Ln 31852, Col 0)

// @from(Ln 31852, Col 0)
import {
    Buffer as r9K
} from "node:buffer";

// @from(Ln 31855, Col 0)

// @from(Ln 31855, Col 0)
import {
    ChildProcess as o9K
} from "node:child_process";

// @from(Ln 31910, Col 0)

// @from(Ln 31910, Col 0)
import {
    debuglog as AYK
} from "node:util";

// @from(Ln 31913, Col 0)

// @from(Ln 31913, Col 0)
import qYK from "node:process";

// @from(Ln 31929, Col 0)

// @from(Ln 31929, Col 0)
import {
    Buffer as YYK
} from "node:buffer";

// @from(Ln 31932, Col 0)

// @from(Ln 31932, Col 0)
import zYK from "node:path";

// @from(Ln 31933, Col 0)

// @from(Ln 31933, Col 0)
import od1 from "node:child_process";

// @from(Ln 31934, Col 0)

// @from(Ln 31934, Col 0)
import F11 from "node:process";

// @from(Ln 32157, Col 0)

// @from(Ln 32157, Col 0)
import {
    execSync as $YK
} from "child_process";

// @from(Ln 32238, Col 0)

// @from(Ln 32238, Col 0)
N1(q$6, {
    getOauthConfig: () => P7,
    fileSuffixForOauthConfig: () => td1,
    OAUTH_BETA_HEADER: () => DP,
    CONSOLE_OAUTH_SCOPES: () => l2A,
    CLAUDE_AI_PROFILE_SCOPE: () => pp,
    CLAUDE_AI_OAUTH_SCOPES: () => U11,
    CLAUDE_AI_INFERENCE_SCOPE: () => ZV,
    ALL_OAUTH_SCOPES: () => ed1
});

// @from(Ln 33952, Col 0)

// @from(Ln 33952, Col 0)
import b_K from "url";

// @from(Ln 33957, Col 0)

// @from(Ln 33957, Col 0)
import x_K from "crypto";

// @from(Ln 33991, Col 0)

// @from(Ln 33991, Col 0)
N1(hc1, {
    origin: () => g_K,
    navigator: () => Lc1,
    hasStandardBrowserWebWorkerEnv: () => B_K,
    hasStandardBrowserEnv: () => m_K,
    hasBrowserEnv: () => Rc1
});

// @from(Ln 35282, Col 0)

// @from(Ln 35282, Col 0)
import s2K from "stream";

// @from(Ln 35381, Col 0)

// @from(Ln 35381, Col 0)
import e2K from "util";

// @from(Ln 35382, Col 0)

// @from(Ln 35382, Col 0)
import {
    Readable as AwK
} from "stream";

// @from(Ln 35447, Col 0)

// @from(Ln 35447, Col 0)
import _wK from "stream";

// @from(Ln 35569, Col 0)

// @from(Ln 35569, Col 0)
import HwK from "http";

// @from(Ln 35570, Col 0)

// @from(Ln 35570, Col 0)
import jwK from "https";

// @from(Ln 35571, Col 0)

// @from(Ln 35571, Col 0)
import JwK from "util";

// @from(Ln 35572, Col 0)

// @from(Ln 35572, Col 0)
import qr from "zlib";

// @from(Ln 35573, Col 0)

// @from(Ln 35573, Col 0)
import Z$6 from "stream";

// @from(Ln 35574, Col 0)

// @from(Ln 35574, Col 0)
import {
    EventEmitter as MwK
} from "events";

// @from(Ln 36840, Col 0)

// @from(Ln 36840, Col 0)
N1(G$6, {
    toFormData: () => UwK,
    spread: () => QwK,
    mergeConfig: () => nwK,
    isCancel: () => uwK,
    isAxiosError: () => pwK,
    getAdapter: () => iwK,
    formToJSON: () => lwK,
    default: () => X8,
    all: () => gwK,
    VERSION: () => BwK,
    HttpStatusCode: () => cwK,
    CanceledError: () => xwK,
    CancelToken: () => mwK,
    Cancel: () => FwK,
    AxiosHeaders: () => dwK,
    AxiosError: () => bwK,
    Axios: () => IwK
});

// @from(Ln 36881, Col 0)

// @from(Ln 36881, Col 0)
import {
    join as Ml1
} from "path";

// @from(Ln 36884, Col 0)

// @from(Ln 36884, Col 0)
import {
    homedir as rwK
} from "os";

// @from(Ln 37066, Col 0)

// @from(Ln 37066, Col 0)
import {
    AsyncLocalStorage as KOK
} from "async_hooks";

// @from(Ln 37098, Col 0)

// @from(Ln 37098, Col 0)
import b$ from "node:path";

// @from(Ln 37099, Col 0)

// @from(Ln 37099, Col 0)
import cHA from "node:os";

// @from(Ln 37100, Col 0)

// @from(Ln 37100, Col 0)
import Xl1 from "node:process";

// @from(Ln 37147, Col 0)

// @from(Ln 37147, Col 0)
import {
    join as E81
} from "path";

// @from(Ln 39225, Col 0)

// @from(Ln 39225, Col 0)
import {
    readFile as ZOK,
    stat as GOK,
    open as fOK
} from "fs/promises";

// @from(Ln 39393, Col 0)

// @from(Ln 39393, Col 0)
import {
    release as kOK
} from "os";

// @from(Ln 39396, Col 0)

// @from(Ln 39396, Col 0)
import {
    readFile as EOK,
    readdir as yOK
} from "fs/promises";

// @from(Ln 39476, Col 0)

// @from(Ln 39476, Col 0)
import * as VjA from "node:path/win32";

// @from(Ln 39477, Col 0)

// @from(Ln 39477, Col 0)
import * as u$6 from "node:path";

// @from(Ln 39562, Col 0)

// @from(Ln 39562, Col 0)
import {
    execFile as hOK
} from "child_process";

// @from(Ln 39565, Col 0)

// @from(Ln 39565, Col 0)
import {
    promisify as SOK
} from "util";

// @from(Ln 39587, Col 0)

// @from(Ln 39587, Col 0)
import {
    open as LjA,
    readdir as ooz,
    readFile as IOK,
    realpath as aoz,
    stat as soz
} from "fs/promises";

// @from(Ln 39594, Col 0)

// @from(Ln 39594, Col 0)
import {
    join as bOK
} from "path";

// @from(Ln 39807, Col 0)

// @from(Ln 39807, Col 0)
import {
    homedir as bjA
} from "os";

// @from(Ln 39810, Col 0)

// @from(Ln 39810, Col 0)
import {
    isAbsolute as BOK,
    join as gOK,
    resolve as FOK,
    normalize as ul1,
    dirname as xjA
} from "path";

// @from(Ln 41136, Col 0)

// @from(Ln 41136, Col 0)
import {
    fileURLToPath as R$K
} from "node:url";

// @from(Ln 41139, Col 0)

// @from(Ln 41139, Col 0)
import * as Mr from "node:path";

// @from(Ln 41140, Col 0)

// @from(Ln 41140, Col 0)
import {
    homedir as h$K
} from "node:os";

// @from(Ln 41143, Col 0)

// @from(Ln 41143, Col 0)
import {
    execFile as S$K,
    spawn as C$K
} from "child_process";

// @from(Ln 49098, Col 0)

// @from(Ln 49098, Col 0)
import {
    stat as QyK
} from "fs/promises";

// @from(Ln 49213, Col 0)

// @from(Ln 49213, Col 0)
import {
    AsyncLocalStorage as nyK
} from "async_hooks";

// @from(Ln 62886, Col 0)

// @from(Ln 62886, Col 0)
import {
    Agent as upK
} from "https";

// @from(Ln 99068, Col 0)

// @from(Ln 99068, Col 0)
import {
    dirname as u23
} from "path";

// @from(Ln 99234, Col 0)

// @from(Ln 99234, Col 0)
N1(K58, {
    PERMISSION_MODES: () => CW,
    INTERNAL_PERMISSION_MODES: () => M57,
    EXTERNAL_PERMISSION_MODES: () => y31
});

// @from(Ln 99338, Col 0)

// @from(Ln 99338, Col 0)
N1(UQ, {
    LEGACY_BRIEF_TOOL_NAME: () => z58,
    DESCRIPTION: () => _58,
    BRIEF_TOOL_PROMPT: () => w58,
    BRIEF_TOOL_NAME: () => Y58,
    BRIEF_PROACTIVE_SECTION: () => g23
});

// @from(Ln 100252, Col 0)

// @from(Ln 100252, Col 0)
import {
    readFile as hw3
} from "fs/promises";

// @from(Ln 100255, Col 0)

// @from(Ln 100255, Col 0)
import {
    join as Sw3
} from "path";

// @from(Ln 100388, Col 0)

// @from(Ln 100388, Col 0)
import {
    watchFile as Bw3,
    unwatchFile as U57
} from "fs";

// @from(Ln 100392, Col 0)

// @from(Ln 100392, Col 0)
import {
    readFile as u46,
    stat as c57,
    readdir as gw3
} from "fs/promises";

// @from(Ln 100397, Col 0)

// @from(Ln 100397, Col 0)
import {
    resolve as m31,
    join as ey
} from "path";

// @from(Ln 100691, Col 0)

// @from(Ln 100691, Col 0)
N1(gC6, {
    parseGitRemote: () => BC6,
    parseGitHubRepository: () => m46,
    getCachedRepository: () => mC6,
    detectCurrentRepositoryWithHost: () => uC6,
    detectCurrentRepository: () => cQ,
    clearRepositoryCaches: () => v58
});

// @from(Ln 100785, Col 0)

// @from(Ln 100785, Col 0)
N1(h58, {
    stashToCleanState: () => L58,
    preserveGitStateForIssue: () => wO3,
    normalizeGitRemoteUrl: () => X37,
    isAtGitRoot: () => AO3,
    gitExe: () => hA,
    getWorktreeCount: () => TJ6,
    getRepoRemoteHash: () => FC6,
    getRemoteUrl: () => Lo,
    getIsHeadOnRemote: () => E58,
    getIsGit: () => IH,
    getIsClean: () => Ro,
    getHead: () => D37,
    getGithubRepo: () => ho,
    getGitStateIssue: () => qO3,
    getGitState: () => R58,
    getGitDir: () => V58,
    getFileStatus: () => d31,
    getDefaultBranch: () => oT,
    getCommitsAheadOfDefaultBranch: () => P37,
    getChangedFiles: () => YO3,
    getBranchPushStatus: () => y58,
    getBranch: () => kj,
    findRemoteBase: () => W37,
    findGitRoot: () => H_,
    findCanonicalGitRoot: () => LJ,
    dirIsInGitRepo: () => k58,
    commitAndPushChanges: () => KO3
});

// @from(Ln 100814, Col 0)

// @from(Ln 100814, Col 0)
import {
    createHash as nw3
} from "crypto";

// @from(Ln 100817, Col 0)

// @from(Ln 100817, Col 0)
import {
    statSync as K37,
    readFileSync as Y37
} from "fs";

// @from(Ln 100821, Col 0)

// @from(Ln 100821, Col 0)
import {
    realpath as z37,
    stat as rw3,
    readFile as ow3,
    open as aw3
} from "fs/promises";

// @from(Ln 100827, Col 0)

// @from(Ln 100827, Col 0)
import {
    resolve as N58,
    dirname as J37,
    join as U31,
    sep as _37,
    basename as sw3
} from "path";

// @from(Ln 101328, Col 0)

// @from(Ln 101328, Col 0)
import {
    join as $O3,
    dirname as HO3
} from "path";

// @from(Ln 101332, Col 0)

// @from(Ln 101332, Col 0)
import {
    homedir as jO3
} from "os";

// @from(Ln 101335, Col 0)

// @from(Ln 101335, Col 0)
import {
    mkdir as JO3,
    readFile as MO3,
    appendFile as DO3,
    writeFile as XO3
} from "fs/promises";

// @from(Ln 101629, Col 0)

// @from(Ln 101629, Col 0)
import {
    stat as fO3,
    lstat as E37,
    readdir as TO3,
    realpath as vO3
} from "node:fs/promises";

// @from(Ln 101635, Col 0)

// @from(Ln 101635, Col 0)
import {
    Readable as NO3
} from "node:stream";

// @from(Ln 101638, Col 0)

// @from(Ln 101638, Col 0)
import {
    resolve as y37,
    relative as VO3,
    join as kO3,
    sep as EO3
} from "node:path";

// @from(Ln 101815, Col 0)

// @from(Ln 101815, Col 0)
import {
    watchFile as CO3,
    unwatchFile as x37,
    watch as IO3
} from "fs";

// @from(Ln 101820, Col 0)

// @from(Ln 101820, Col 0)
import {
    open as bO3,
    stat as m37,
    lstat as xO3,
    realpath as m58
} from "fs/promises";

// @from(Ln 101826, Col 0)

// @from(Ln 101826, Col 0)
import * as iO from "path";

// @from(Ln 101827, Col 0)

// @from(Ln 101827, Col 0)
import {
    type as uO3
} from "os";

// @from(Ln 102130, Col 0)

// @from(Ln 102130, Col 0)
N1(e31, {
    watch: () => o37,
    default: () => g46,
    WatchHelper: () => c58,
    FSWatcher: () => t31
});

// @from(Ln 102136, Col 0)

// @from(Ln 102136, Col 0)
import {
    stat as rO3
} from "fs";

// @from(Ln 102139, Col 0)

// @from(Ln 102139, Col 0)
import {
    stat as oO3,
    readdir as aO3
} from "fs/promises";

// @from(Ln 102143, Col 0)

// @from(Ln 102143, Col 0)
import {
    EventEmitter as sO3
} from "events";

// @from(Ln 102146, Col 0)

// @from(Ln 102146, Col 0)
import * as Z9 from "path";

// @from(Ln 103133, Col 0)

// @from(Ln 103133, Col 0)
import {
    constants as U46
} from "fs";

// @from(Ln 103136, Col 0)

// @from(Ln 103136, Col 0)
import {
    mkdir as f$3,
    open as M97,
    stat as tW_,
    symlink as J97,
    unlink as T$3
} from "fs/promises";

// @from(Ln 103143, Col 0)

// @from(Ln 103143, Col 0)
import {
    join as D97
} from "path";

// @from(Ln 103297, Col 0)

// @from(Ln 103297, Col 0)
import {
    randomBytes as N$3
} from "crypto";

// @from(Ln 103497, Col 0)

// @from(Ln 103497, Col 0)
import {
    unlink as E$3
} from "fs/promises";

// @from(Ln 104082, Col 0)

// @from(Ln 104082, Col 0)
import {
    readFile as u97,
    mkdir as Q$3,
    readdir as U$3
} from "fs/promises";

// @from(Ln 104087, Col 0)

// @from(Ln 104087, Col 0)
import {
    join as W38
} from "node:path";

// @from(Ln 104181, Col 0)

// @from(Ln 104181, Col 0)
import {
    AsyncLocalStorage as d$3,
    AsyncResource as c$3
} from "node:async_hooks";

// @from(Ln 104374, Col 0)

// @from(Ln 104374, Col 0)
import Qu from "node:process";

// @from(Ln 104703, Col 0)

// @from(Ln 104703, Col 0)
import {
    AsyncResource as s97
} from "node:async_hooks";

// @from(Ln 106188, Col 0)

// @from(Ln 106188, Col 0)
import * as nY7 from "node:readline";

// @from(Ln 106189, Col 0)

// @from(Ln 106189, Col 0)
import {
    AsyncResource as RH3
} from "node:async_hooks";

// @from(Ln 106639, Col 0)

// @from(Ln 106639, Col 0)
import {
    existsSync as Xz7,
    readFileSync as uH3,
    writeFileSync as mH3
} from "fs";

// @from(Ln 106644, Col 0)

// @from(Ln 106644, Col 0)
import {
    basename as Pz7,
    join as Wz7,
    resolve as BH3
} from "path";

// @from(Ln 107356, Col 0)

// @from(Ln 107356, Col 0)
N1(f98, {
    zlibSync: () => q98,
    zlib: () => nH3,
    zipSync: () => Z98,
    zip: () => Kj3,
    unzlibSync: () => Q91,
    unzlib: () => O_7,
    unzipSync: () => G98,
    unzip: () => wj3,
    strToU8: () => go,
    strFromU8: () => P98,
    inflateSync: () => sJ6,
    inflate: () => D98,
    gzipSync: () => e38,
    gzip: () => lH3,
    gunzipSync: () => F91,
    gunzip: () => __7,
    deflateSync: () => JI6,
    deflate: () => Y_7,
    decompressSync: () => aH3,
    decompress: () => oH3,
    compressSync: () => e38,
    compress: () => lH3,
    Zlib: () => A98,
    ZipPassThrough: () => OI6,
    ZipDeflate: () => eH3,
    Zip: () => qj3,
    Unzlib: () => p91,
    UnzipPassThrough: () => X_7,
    UnzipInflate: () => Yj3,
    Unzip: () => _j3,
    Inflate: () => aT,
    Gzip: () => t38,
    Gunzip: () => g91,
    FlateErrorCode: () => UH3,
    EncodeUTF8: () => tH3,
    Deflate: () => wL,
    Decompress: () => K98,
    DecodeUTF8: () => sH3,
    Compress: () => t38,
    AsyncZlib: () => iH3,
    AsyncZipDeflate: () => Aj3,
    AsyncUnzlib: () => w_7,
    AsyncUnzipInflate: () => zj3,
    AsyncInflate: () => M98,
    AsyncGzip: () => cH3,
    AsyncGunzip: () => z_7,
    AsyncDeflate: () => K_7,
    AsyncDecompress: () => rH3,
    AsyncCompress: () => cH3
});

// @from(Ln 107407, Col 0)

// @from(Ln 107407, Col 0)
import {
    createRequire as gH3
} from "module";

// @from(Ln 109381, Col 0)

// @from(Ln 109381, Col 0)
import {
    existsSync as Lj3,
    readdirSync as y_7,
    readFileSync as V98,
    statSync as L_7
} from "fs";

// @from(Ln 109387, Col 0)

// @from(Ln 109387, Col 0)
import {
    join as k98,
    relative as h_7,
    sep as S_7
} from "path";

// @from(Ln 123322, Col 0)

// @from(Ln 123322, Col 0)
import {
    execFile as uZ3
} from "child_process";

// @from(Ln 123325, Col 0)

// @from(Ln 123325, Col 0)
import {
    readFileSync as VM6,
    writeFileSync as YJ7
} from "fs";

// @from(Ln 123329, Col 0)

// @from(Ln 123329, Col 0)
import {
    mkdtemp as mZ3,
    rm as BZ3,
    writeFile as gZ3
} from "fs/promises";

// @from(Ln 123334, Col 0)

// @from(Ln 123334, Col 0)
import {
    tmpdir as FZ3
} from "os";

// @from(Ln 123337, Col 0)

// @from(Ln 123337, Col 0)
import {
    join as KJ7
} from "path";

// @from(Ln 123340, Col 0)

// @from(Ln 123340, Col 0)
import {
    promisify as pZ3
} from "util";

// @from(Ln 123584, Col 0)

// @from(Ln 123584, Col 0)
import {
    chmodSync as lZ3,
    existsSync as jz8,
    mkdirSync as OJ7,
    readFileSync as iZ3,
    writeFileSync as nZ3
} from "fs";

// @from(Ln 123591, Col 0)

// @from(Ln 123591, Col 0)
import {
    join as $J7,
    resolve as oY1,
    sep as rZ3
} from "path";

// @from(Ln 123749, Col 0)

// @from(Ln 123749, Col 0)
import {
    existsSync as Dz8,
    readFileSync as zG3,
    statSync as MJ7
} from "fs";

// @from(Ln 123754, Col 0)

// @from(Ln 123754, Col 0)
import * as Yv from "fs/promises";

// @from(Ln 123755, Col 0)

// @from(Ln 123755, Col 0)
import * as XJ7 from "os";

// @from(Ln 123756, Col 0)

// @from(Ln 123756, Col 0)
import {
    join as _G3,
    resolve as Ha
} from "path";

// @from(Ln 123844, Col 0)

// @from(Ln 123844, Col 0)
N1(PJ7, {
    packExtension: () => GJ7
});

// @from(Ln 123847, Col 0)

// @from(Ln 123847, Col 0)
import {
    createHash as OG3
} from "crypto";

// @from(Ln 123850, Col 0)

// @from(Ln 123850, Col 0)
import {
    existsSync as WJ7,
    mkdirSync as $G3,
    readFileSync as HG3,
    statSync as jG3,
    writeFileSync as JG3
} from "fs";

// @from(Ln 123857, Col 0)

// @from(Ln 123857, Col 0)
import {
    basename as MG3,
    join as ZJ7,
    relative as DG3,
    resolve as Gz8,
    sep as XG3
} from "path";

// @from(Ln 124086, Col 0)

// @from(Ln 124086, Col 0)
N1(fz8, {
    verifyMcpbFile: () => UZ3,
    verifyCertificateChain: () => wJ7,
    validateManifest: () => Pz8,
    unsignMcpbFile: () => cZ3,
    unpackExtension: () => Jz8,
    signMcpbFile: () => QZ3,
    shouldExclude: () => Rj3,
    replaceVariables: () => aY1,
    readPackageJson: () => Zz7,
    readMcpbIgnorePatterns: () => E98,
    promptVisualAssets: () => Cz7,
    promptUserConfig: () => bz7,
    promptUrls: () => Sz7,
    promptTools: () => yz7,
    promptServerConfig: () => Ez7,
    promptPrompts: () => Lz7,
    promptOptionalFields: () => Rz7,
    promptLongDescription: () => hz7,
    promptCompatibility: () => Iz7,
    promptBasicInfo: () => Vz7,
    promptAuthorInfo: () => kz7,
    printNextSteps: () => uz7,
    packExtension: () => GJ7,
    initExtension: () => i38,
    hasRequiredConfigMissing: () => TJ7,
    getMcpConfigForManifest: () => WG3,
    getDefaultServerConfig: () => vz7,
    getDefaultRepositoryUrl: () => Gz7,
    getDefaultOptionalFields: () => Nz7,
    getDefaultEntryPoint: () => l38,
    getDefaultBasicInfo: () => fz7,
    getDefaultAuthorUrl: () => d38,
    getDefaultAuthorName: () => Q38,
    getDefaultAuthorInfo: () => Tz7,
    getDefaultAuthorEmail: () => U38,
    getAllFilesWithCount: () => n91,
    getAllFiles: () => I_7,
    extractSignatureBlock: () => iI6,
    createMcpConfig: () => c38,
    cleanMcpb: () => wG3,
    buildManifest: () => xz7,
    McpbUserConfigurationOptionSchema: () => Dz7,
    McpbUserConfigValuesSchema: () => bH3,
    McpbSignatureInfoSchema: () => xH3,
    McpbManifestToolSchema: () => Jz7,
    McpbManifestServerSchema: () => Hz7,
    McpbManifestSchema: () => YI6,
    McpbManifestRepositorySchema: () => wz7,
    McpbManifestPromptSchema: () => Mz7,
    McpbManifestPlatformOverrideSchema: () => Oz7,
    McpbManifestMcpConfigSchema: () => $z7,
    McpbManifestCompatibilitySchema: () => jz7,
    McpbManifestAuthorSchema: () => _z7,
    McpServerConfigSchema: () => p38,
    EXCLUDE_PATTERNS: () => C_7,
    CURRENT_MANIFEST_VERSION: () => e46
});

// @from(Ln 124182, Col 0)

// @from(Ln 124182, Col 0)
import * as sY1 from "path";

// @from(Ln 124249, Col 0)

// @from(Ln 124249, Col 0)
import * as VJ7 from "os";

// @from(Ln 124250, Col 0)

// @from(Ln 124250, Col 0)
import * as Zq6 from "path";

// @from(Ln 124288, Col 0)

// @from(Ln 124288, Col 0)
import {
    createHash as Ez8
} from "crypto";

// @from(Ln 124291, Col 0)

// @from(Ln 124291, Col 0)
import {
    writeFile as Az1
} from "fs/promises";

// @from(Ln 124294, Col 0)

// @from(Ln 124294, Col 0)
import {
    join as Ja,
    dirname as NG3
} from "path";

// @from(Ln 124676, Col 0)

// @from(Ln 124676, Col 0)
import {
    createHash as LG3
} from "crypto";

// @from(Ln 124679, Col 0)

// @from(Ln 124679, Col 0)
import {
    userInfo as RG3
} from "os";

// @from(Ln 124829, Col 0)

// @from(Ln 124829, Col 0)
import {
    join as CG3
} from "path";

// @from(Ln 124832, Col 0)

// @from(Ln 124832, Col 0)
import {
    chmodSync as IG3
} from "fs";

// @from(Ln 125026, Col 0)

// @from(Ln 125026, Col 0)
import {
    isAbsolute as xG3,
    join as wz1,
    normalize as Sz8,
    sep as pJ7
} from "path";

// @from(Ln 125032, Col 0)

// @from(Ln 125032, Col 0)
import {
    homedir as uG3
} from "os";

// @from(Ln 125191, Col 0)

// @from(Ln 125191, Col 0)
import rJ7 from "node:process";

// @from(Ln 131697, Col 0)

// @from(Ln 131697, Col 0)
import {
    posix as oL3
} from "path";

// @from(Ln 135480, Col 0)

// @from(Ln 135480, Col 0)
import {
    Agent as bR3,
    createServer as xR3
} from "node:http";

// @from(Ln 135484, Col 0)

// @from(Ln 135484, Col 0)
import {
    request as jP7
} from "node:http";

// @from(Ln 135487, Col 0)

// @from(Ln 135487, Col 0)
import {
    request as uR3
} from "node:https";

// @from(Ln 135490, Col 0)

// @from(Ln 135490, Col 0)
import {
    connect as JP7
} from "node:net";

// @from(Ln 135493, Col 0)

// @from(Ln 135493, Col 0)
import {
    URL as mR3
} from "node:url";

// @from(Ln 135954, Col 0)

// @from(Ln 135954, Col 0)
import {
    spawnSync as rR3
} from "node:child_process";

// @from(Ln 136606, Col 0)

// @from(Ln 136606, Col 0)
N1(d_1, {
    default: () => vx6
});

// @from(Ln 136684, Col 0)

// @from(Ln 136684, Col 0)
N1(n_1, {
    default: () => $m
});

// @from(Ln 136851, Col 0)

// @from(Ln 136851, Col 0)
N1(K21, {
    default: () => Ow8
});

// @from(Ln 137356, Col 0)

// @from(Ln 137356, Col 0)
import * as vZ7 from "fs";

// @from(Ln 137386, Col 0)

// @from(Ln 137386, Col 0)
import {
    spawn as Xb3
} from "child_process";

// @from(Ln 137389, Col 0)

// @from(Ln 137389, Col 0)
import {
    text as NZ7
} from "node:stream/consumers";

// @from(Ln 137415, Col 0)

// @from(Ln 137415, Col 0)
import {
    homedir as Ww8
} from "os";

// @from(Ln 137418, Col 0)

// @from(Ln 137418, Col 0)
import * as FG from "path";

// @from(Ln 137419, Col 0)

// @from(Ln 137419, Col 0)
import * as uq6 from "fs";

// @from(Ln 137546, Col 0)

// @from(Ln 137546, Col 0)
import {
    join as yL,
    dirname as Wb3
} from "node:path";

// @from(Ln 137550, Col 0)

// @from(Ln 137550, Col 0)
import {
    fileURLToPath as Zb3
} from "node:url";

// @from(Ln 137553, Col 0)

// @from(Ln 137553, Col 0)
import * as Bq6 from "node:fs";

// @from(Ln 137554, Col 0)

// @from(Ln 137554, Col 0)
import {
    execSync as Gb3
} from "node:child_process";

// @from(Ln 137557, Col 0)

// @from(Ln 137557, Col 0)
import {
    homedir as fb3
} from "node:os";

// @from(Ln 137664, Col 0)

// @from(Ln 137664, Col 0)
import {
    randomBytes as Nb3
} from "node:crypto";

// @from(Ln 137667, Col 0)

// @from(Ln 137667, Col 0)
import * as $2 from "fs";

// @from(Ln 137668, Col 0)

// @from(Ln 137668, Col 0)
import {
    spawn as SZ7
} from "node:child_process";

// @from(Ln 137671, Col 0)

// @from(Ln 137671, Col 0)
import {
    tmpdir as Ew8
} from "node:os";

// @from(Ln 137674, Col 0)

// @from(Ln 137674, Col 0)
import IJ, {
    join as CZ7
} from "node:path";

// @from(Ln 138062, Col 0)

// @from(Ln 138062, Col 0)
import {
    spawn as hb3
} from "child_process";

// @from(Ln 138065, Col 0)

// @from(Ln 138065, Col 0)
import * as WU from "path";

// @from(Ln 138333, Col 0)

// @from(Ln 138333, Col 0)
import * as Iw8 from "fs";

// @from(Ln 138334, Col 0)

// @from(Ln 138334, Col 0)
import {
    EOL as Cw8
} from "node:os";

// @from(Ln 139006, Col 0)

// @from(Ln 139006, Col 0)
N1(NG7, {
    shouldAllowManagedSandboxDomainsOnly: () => Uq6,
    resolvePathPatternForSandbox: () => Qq6,
    convertToSandboxRuntimeConfig: () => R21,
    addToExcludedCommands: () => Uw8,
    SandboxViolationStore: () => HD6,
    SandboxRuntimeConfigSchema: () => Bw8,
    SandboxManager: () => vA
});

// @from(Ln 139015, Col 0)

// @from(Ln 139015, Col 0)
import {
    resolve as pq6,
    join as zx3
} from "path";

// @from(Ln 139019, Col 0)

// @from(Ln 139019, Col 0)
import {
    readFile as _x3
} from "fs/promises";

// @from(Ln 139753, Col 0)

// @from(Ln 139753, Col 0)
import {
    randomBytes as Vu3
} from "crypto";

// @from(Ln 140328, Col 0)

// @from(Ln 140328, Col 0)
import {
    createHash as gu3
} from "crypto";

// @from(Ln 140395, Col 0)

// @from(Ln 140395, Col 0)
import {
    extname as Qu3,
    join as Uu3,
    normalize as oG7
} from "path";

// @from(Ln 140458, Col 0)

// @from(Ln 140458, Col 0)
import {
    createHash as eG7
} from "crypto";

// @from(Ln 141115, Col 0)

// @from(Ln 141115, Col 0)
import MO8 from "node:process";

// @from(Ln 141116, Col 0)

// @from(Ln 141116, Col 0)
import Ym3 from "node:os";

// @from(Ln 141117, Col 0)

// @from(Ln 141117, Col 0)
import Mf7 from "node:tty";

// @from(Ln 142825, Col 0)

// @from(Ln 142825, Col 0)
import _w1 from "node:process";

// @from(Ln 142826, Col 0)

// @from(Ln 142826, Col 0)
import {
    PassThrough as Sm3
} from "node:stream";

// @from(Ln 145988, Col 0)

// @from(Ln 145988, Col 0)
import * as BP from "path";

// @from(Ln 145989, Col 0)

// @from(Ln 145989, Col 0)
import * as $u6 from "os";

// @from(Ln 146096, Col 0)

// @from(Ln 146096, Col 0)
import {
    execFileSync as LN7
} from "node:child_process";

// @from(Ln 146138, Col 0)

// @from(Ln 146138, Col 0)
import {
    setMaxListeners as gp3
} from "events";

// @from(Ln 146345, Col 0)

// @from(Ln 146345, Col 0)
import {
    PassThrough as QN7
} from "node:stream";

// @from(Ln 155227, Col 0)

// @from(Ln 155227, Col 0)
N1(Yk7, {
    swapLayout: () => XH8,
    preloadLayout: () => DH8,
    initLayout: () => PO1,
    createLayoutNode: () => WO1
});

// @from(Ln 155895, Col 0)

// @from(Ln 155895, Col 0)
import {
    Buffer as YU3
} from "buffer";

// @from(Ln 155898, Col 0)

// @from(Ln 155898, Col 0)
import {
    open as zU3
} from "fs/promises";

// @from(Ln 158875, Col 0)

// @from(Ln 158875, Col 0)
import {
    EventEmitter as Yd3
} from "events";

// @from(Ln 159371, Col 0)

// @from(Ln 159371, Col 0)
import {
    readFileSync as Pd3
} from "fs";

// @from(Ln 159538, Col 0)

// @from(Ln 159538, Col 0)
import {
    Buffer as fd3
} from "buffer";

// @from(Ln 160334, Col 0)

// @from(Ln 160334, Col 0)
N1(Ey7, {
    stopCapturingEarlyInput: () => $s,
    startCapturingEarlyInput: () => pd3,
    seedEarlyInput: () => Tj8,
    isCapturingEarlyInput: () => dd3,
    hasEarlyInput: () => Ud3,
    consumeEarlyInput: () => fj8
});

// @from(Ln 160987, Col 0)

// @from(Ln 160987, Col 0)
import {
    writeSync as CK6
} from "fs";

// @from(Ln 161365, Col 0)

// @from(Ln 161365, Col 0)
import {
    Stream as ed3
} from "stream";

// @from(Ln 161433, Col 0)

// @from(Ln 161433, Col 0)
import {
    spawnSync as zc3
} from "child_process";

// @from(Ln 163698, Col 0)

// @from(Ln 163698, Col 0)
N1(pu6, {
    wrapText: () => jk,
    useThemeSetting: () => yX6,
    useTheme: () => z7,
    useTerminalViewport: () => Ds,
    useTerminalTitle: () => M$1,
    useTerminalFocus: () => p_,
    useStdin: () => Ms,
    useSelection: () => uL7,
    usePreviewTheme: () => Y$1,
    useInterval: () => gj8,
    useInput: () => jA,
    useFocusManager: () => RL7,
    useFocus: () => EL7,
    useApp: () => IX6,
    useAnimationTimer: () => bL7,
    useAnimationFrame: () => gJ,
    render: () => BC,
    measureElement: () => bX6,
    createRoot: () => _l3,
    color: () => kA,
    ThemeProvider: () => K$1,
    Text: () => T,
    TerminalFocusEvent: () => NX6,
    Spacer: () => bj8,
    RawAnsi: () => $$1,
    NoSelect: () => BU,
    Newline: () => iG,
    Link: () => y7,
    InputEvent: () => Cu6,
    EventEmitter: () => LK6,
    Event: () => uC,
    ClickEvent: () => xu6,
    Box: () => m,
    BaseText: () => Kz,
    BaseBox: () => _X,
    Ansi: () => wK
});

// @from(Ln 164600, Col 0)

// @from(Ln 164600, Col 0)
N1(rL7, {
    hasIdeOnboardingDialogBeenShown: () => nL7,
    IdeOnboardingDialog: () => dj8
});

// @from(Ln 164730, Col 0)

// @from(Ln 164730, Col 0)
import {
    basename as Pl3,
    join as lj8,
    resolve as ij8,
    sep as k$1
} from "path";

// @from(Ln 164736, Col 0)

// @from(Ln 164736, Col 0)
import {
    createConnection as Wl3
} from "net";

// @from(Ln 170582, Col 0)

// @from(Ln 170582, Col 0)
import TA9 from "assert";

// @from(Ln 174183, Col 0)

// @from(Ln 174183, Col 0)
N1(GB7, {
    default: () => XD8,
    BaseAnthropic: () => yz,
    AnthropicBedrock: () => XD8
});

// @from(Ln 174339, Col 0)

// @from(Ln 174339, Col 0)
N1(EB7, {
    default: () => fD8,
    BaseAnthropic: () => yz,
    AnthropicFoundry: () => fD8
});

// @from(Ln 174407, Col 0)

// @from(Ln 174407, Col 0)
import {
    EOL as QK9
} from "node:os";

// @from(Ln 174410, Col 0)

// @from(Ln 174410, Col 0)
import UK9 from "node:util";

// @from(Ln 174411, Col 0)

// @from(Ln 174411, Col 0)
import * as mB7 from "node:process";

// @from(Ln 174825, Col 0)

// @from(Ln 174825, Col 0)
import {
    randomUUID as oK9
} from "node:crypto";

// @from(Ln 174998, Col 0)

// @from(Ln 174998, Col 0)
import {
    inspect as sK9
} from "node:util";

// @from(Ln 175107, Col 0)

// @from(Ln 175107, Col 0)
import * as _P6 from "node:http";

// @from(Ln 175108, Col 0)

// @from(Ln 175108, Col 0)
import * as wP6 from "node:https";

// @from(Ln 175109, Col 0)

// @from(Ln 175109, Col 0)
import * as _j1 from "node:zlib";

// @from(Ln 175110, Col 0)

// @from(Ln 175110, Col 0)
import {
    Transform as q59
} from "node:stream";

// @from(Ln 175734, Col 0)

// @from(Ln 175734, Col 0)
import {
    Readable as $X8
} from "stream";

// @from(Ln 176135, Col 0)

// @from(Ln 176135, Col 0)
import * as jP6 from "node:os";

// @from(Ln 176136, Col 0)

// @from(Ln 176136, Col 0)
import * as jj1 from "node:process";

// @from(Ln 177937, Col 0)

// @from(Ln 177937, Col 0)
import U39 from "node:fs";

// @from(Ln 177938, Col 0)

// @from(Ln 177938, Col 0)
import d39 from "node:os";

// @from(Ln 177939, Col 0)

// @from(Ln 177939, Col 0)
import c39 from "node:path";

// @from(Ln 178338, Col 0)

// @from(Ln 178338, Col 0)
N1(GP6, {
    unexpectedError: () => Bm6,
    postRequestFailed: () => gm6
});

// @from(Ln 178379, Col 0)

// @from(Ln 178379, Col 0)
N1(j2, {
    userTimeoutReached: () => rm6,
    userCanceled: () => sm6,
    unexpectedCredentialType: () => lm6,
    tokenRefreshRequired: () => aU,
    tokenParsingError: () => Ss,
    tokenClaimsCnfRequiredForSignedJwt: () => w56,
    stateNotFound: () => Cs,
    stateMismatch: () => tK6,
    requestCannotBeMade: () => K56,
    openIdConfigError: () => aK6,
    nullOrEmptyToken: () => rK6,
    nonceMismatch: () => eK6,
    noNetworkConnectivity: () => am6,
    noCryptoObject: () => bs,
    noAccountInSilentRequest: () => rU,
    noAccountFound: () => cm6,
    networkError: () => oK6,
    nestedAppAuthBridgeDisabled: () => em6,
    multipleMatchingTokens: () => Fm6,
    multipleMatchingAppMetadata: () => q56,
    multipleMatchingAccounts: () => pm6,
    missingTenantIdError: () => tm6,
    methodNotImplemented: () => G3,
    maxAgeTranspired: () => A56,
    keyIdMissing: () => H56,
    invalidState: () => nC,
    invalidClientCredential: () => nm6,
    invalidCacheRecord: () => _56,
    invalidCacheEnvironment: () => oU,
    invalidAssertion: () => im6,
    hashNotDeserialized: () => sK6,
    endpointResolutionError: () => oG,
    endSessionEndpointNotSupported: () => $56,
    emptyInputScopeSet: () => Is,
    deviceCodeUnknownError: () => dm6,
    deviceCodePollingCancelled: () => Qm6,
    deviceCodeExpired: () => Um6,
    clientInfoEmptyError: () => nK6,
    clientInfoDecodingError: () => hs,
    cannotRemoveEmptyScope: () => Y56,
    cannotAppendScopeSet: () => z56,
    bindingKeyNotRemoved: () => om6,
    authorizationCodeMissingFromServerResponse: () => O56,
    authTimeNotFound: () => nU
});

// @from(Ln 178872, Col 0)

// @from(Ln 178872, Col 0)
N1(vP6, {
    urlParseError: () => im,
    urlEmptyError: () => M56,
    untrustedAuthority: () => G56,
    tokenRequestEmpty: () => X56,
    redirectUriEmpty: () => j56,
    pkceParamsMissing: () => W56,
    missingSshKid: () => KB6,
    missingSshJwk: () => tU,
    missingNonceAuthenticationHeader: () => YB6,
    logoutRequestEmpty: () => P56,
    invalidRequestMethodForEAR: () => $B6,
    invalidCodeChallengeMethod: () => qB6,
    invalidCloudDiscoveryMetadata: () => ms,
    invalidClaims: () => us,
    invalidAuthorizePostBodyParameters: () => HB6,
    invalidAuthorityMetadata: () => Z56,
    invalidAuthenticationHeader: () => zB6,
    emptyInputScopesError: () => D56,
    claimsRequestParsingError: () => AB6,
    cannotSetOIDCOptions: () => _B6,
    cannotAllowPlatformBroker: () => wB6,
    authorityUriInsecure: () => J56,
    authorityMismatch: () => OB6
});

// @from(Ln 179384, Col 0)

// @from(Ln 179384, Col 0)
N1(mj1, {
    isKmsi: () => QX8,
    getJWSPayload: () => up7,
    extractTokenClaims: () => Ad,
    checkMaxAge: () => DB6
});

// @from(Ln 179422, Col 0)

// @from(Ln 179422, Col 0)
N1(lP, {
    stripLeadingHashOrQuery: () => Bp7,
    normalizeUrlForComparison: () => s39,
    mapToQueryString: () => rm,
    getDeserializedResponse: () => UX8
});

// @from(Ln 180619, Col 0)

// @from(Ln 180619, Col 0)
N1(v56, {
    X_MS_LIB_CAPABILITY: () => GP8,
    X_CLIENT_VER: () => DP8,
    X_CLIENT_SKU: () => MP8,
    X_CLIENT_OS: () => XP8,
    X_CLIENT_LAST_TELEM: () => ZP8,
    X_CLIENT_EXTRA_SKU: () => G99,
    X_CLIENT_CURR_TELEM: () => WP8,
    X_CLIENT_CPU: () => PP8,
    X_APP_VER: () => TP8,
    X_APP_NAME: () => fP8,
    TOKEN_TYPE: () => Uj1,
    STATE: () => zP8,
    SID: () => CP8,
    SESSION_STATE: () => D99,
    SCOPE: () => KP8,
    RETURN_SPA_CODE: () => cj1,
    RESPONSE_TYPE: () => tX8,
    RESPONSE_MODE: () => eX8,
    REQ_CNF: () => dj1,
    REQUESTED_TOKEN_USE: () => RP8,
    REFRESH_TOKEN_EXPIRES_IN: () => M99,
    REFRESH_TOKEN: () => YP8,
    REDIRECT_URI: () => Qj1,
    PROMPT: () => wP8,
    POST_LOGOUT_URI: () => vP8,
    ON_BEHALF_OF: () => P99,
    OBO_ASSERTION: () => LP8,
    NONCE: () => _P8,
    NATIVE_BROKER: () => hP8,
    LOGOUT_HINT: () => SP8,
    LOGIN_HINT: () => IP8,
    INSTANCE_AWARE: () => LP6,
    ID_TOKEN_HINT: () => NP8,
    ID_TOKEN: () => j99,
    GRANT_TYPE: () => AP8,
    FOCI: () => W99,
    EXPIRES_IN: () => J99,
    ERROR_DESCRIPTION: () => $99,
    ERROR: () => O99,
    EAR_JWK: () => xP8,
    EAR_JWE_CRYPTO: () => uP8,
    DOMAIN_HINT: () => bP8,
    DEVICE_CODE: () => VP8,
    CODE_VERIFIER: () => jP8,
    CODE_CHALLENGE_METHOD: () => HP8,
    CODE_CHALLENGE: () => $P8,
    CODE: () => OP8,
    CLIENT_SECRET: () => kP8,
    CLIENT_REQUEST_ID: () => JP8,
    CLIENT_INFO: () => X99,
    CLIENT_ID: () => om,
    CLIENT_ASSERTION_TYPE: () => yP8,
    CLIENT_ASSERTION: () => EP8,
    CLAIMS: () => qP8,
    CCS_HEADER: () => Z99,
    BROKER_REDIRECT_URI: () => lj1,
    BROKER_CLIENT_ID: () => ZB6,
    ACCESS_TOKEN: () => H99
});

// @from(Ln 180740, Col 0)

// @from(Ln 180740, Col 0)
N1(q4, {
    instrumentBrokerParams: () => N56,
    addUsername: () => E99,
    addThrottling: () => hB6,
    addState: () => TB6,
    addSshJwk: () => LB6,
    addSid: () => ij1,
    addServerTelemetry: () => RB6,
    addScopes: () => V56,
    addResponseType: () => f99,
    addResponseMode: () => mP8,
    addRequestTokenUse: () => k99,
    addRefreshToken: () => dP8,
    addRedirectUri: () => E56,
    addPrompt: () => pP8,
    addPostLogoutRedirectUri: () => BP8,
    addPostBodyParameters: () => R99,
    addPopToken: () => yB6,
    addPassword: () => y99,
    addOboAssertion: () => V99,
    addNonce: () => QP8,
    addNativeBroker: () => T99,
    addLogoutHint: () => lP8,
    addLoginHint: () => hP6,
    addLibraryInfo: () => GB6,
    addInstanceAware: () => EB6,
    addIdTokenHint: () => gP8,
    addGrantType: () => kB6,
    addExtraQueryParameters: () => Kd,
    addEARParameters: () => L99,
    addDomainHint: () => FP8,
    addDeviceCode: () => N99,
    addCorrelationId: () => L56,
    addCodeVerifier: () => cP8,
    addCodeChallengeParams: () => v99,
    addClientSecret: () => vB6,
    addClientInfo: () => R56,
    addClientId: () => k56,
    addClientCapabilitiesToClaims: () => np7,
    addClientAssertionType: () => VB6,
    addClientAssertion: () => NB6,
    addClaims: () => y56,
    addCcsUpn: () => ps,
    addCcsOid: () => qd,
    addBrokerParameters: () => Yd,
    addAuthorizationCode: () => UP8,
    addApplicationTelemetry: () => fB6
});

// @from(Ln 181141, Col 0)

// @from(Ln 181141, Col 0)
N1(ZO, {
    wasClockTurnedBack: () => iP8,
    toSecondsFromDate: () => h99,
    toDateFromSeconds: () => CB6,
    nowSeconds: () => Tk,
    isTokenExpired: () => CP6,
    isCacheExpired: () => S99,
    delay: () => C99
});

// @from(Ln 181184, Col 0)

// @from(Ln 181184, Col 0)
N1(sG, {
    updateCloudDiscoveryMetadata: () => IB6,
    updateAuthorityEndpointMetadata: () => IP6,
    isThrottlingEntity: () => m99,
    isServerTelemetryEntity: () => u99,
    isRefreshTokenEntity: () => x99,
    isIdTokenEntity: () => b99,
    isCredentialEntity: () => nj1,
    isAuthorityMetadataExpired: () => oj1,
    isAuthorityMetadataEntity: () => F99,
    isAppMetadataEntity: () => g99,
    isAccessTokenEntity: () => I99,
    generateAuthorityMetadataExpiresAt: () => rj1,
    generateAppMetadataKey: () => B99,
    createRefreshTokenEntity: () => oP8,
    createIdTokenEntity: () => nP8,
    createAccessTokenEntity: () => rP8
});

// @from(Ln 181733, Col 0)

// @from(Ln 181733, Col 0)
N1(ej1, {
    createDiscoveredInstance: () => sP8
});

// @from(Ln 181931, Col 0)

// @from(Ln 181931, Col 0)
N1(YJ1, {
    uxNotAllowed: () => KJ1,
    refreshTokenExpired: () => uB6,
    noTokensFound: () => Us,
    nativeAccountUnavailable: () => xB6,
    loginRequired: () => q08,
    interactionRequired: () => eP8,
    consentRequired: () => A08,
    badToken: () => ds
});

// @from(Ln 182610, Col 0)

// @from(Ln 182610, Col 0)
N1(gB6, {
    validateAuthorizationResponse: () => JQ7,
    getStandardAuthorizeRequestParameters: () => d99,
    getAuthorizeUrl: () => c99,
    getAuthorizationCodePayload: () => l99
});

// @from(Ln 183038, Col 0)

// @from(Ln 183038, Col 0)
N1(z08, {
    Serializer: () => dK6,
    Deserializer: () => ls
});

// @from(Ln 183154, Col 0)

// @from(Ln 183154, Col 0)
import O08 from "http";

// @from(Ln 183155, Col 0)

// @from(Ln 183155, Col 0)
import kQ7 from "https";

// @from(Ln 183997, Col 0)

// @from(Ln 183997, Col 0)
import Wz9 from "crypto";

// @from(Ln 184006, Col 0)

// @from(Ln 184006, Col 0)
import Zz9 from "crypto";

// @from(Ln 187430, Col 0)

// @from(Ln 187430, Col 0)
import NH9 from "http";

// @from(Ln 188266, Col 0)

// @from(Ln 188266, Col 0)
import {
    accessSync as LH9,
    constants as fi7,
    statSync as RH9,
    readFileSync as hH9
} from "fs";

// @from(Ln 188272, Col 0)

// @from(Ln 188272, Col 0)
import SH9 from "path";

// @from(Ln 188660, Col 0)

// @from(Ln 188660, Col 0)
N1(Vk, {
    version: () => eC,
    internals: () => z08,
    UsernamePasswordClient: () => $g6,
    TokenCacheContext: () => cL,
    TokenCache: () => oB6,
    ServerError: () => tG,
    ResponseMode: () => cm,
    PublicClientApplication: () => jg6,
    ProtocolMode: () => iW,
    PromptValue: () => Ls,
    OnBehalfOfClient: () => Jg6,
    ManagedIdentitySourceNames: () => tK,
    ManagedIdentityApplication: () => AB,
    Logger: () => kv,
    LogLevel: () => l$,
    InteractionRequiredAuthErrorMessage: () => K08,
    InteractionRequiredAuthErrorCodes: () => YJ1,
    InteractionRequiredAuthError: () => vk,
    DistributedCachePlugin: () => MW8,
    DeviceCodeClient: () => Hg6,
    CryptoProvider: () => $d,
    ConfidentialClientApplication: () => Mg6,
    ClientCredentialClient: () => B56,
    ClientConfigurationErrorMessage: () => gX8,
    ClientConfigurationErrorCodes: () => vP6,
    ClientConfigurationError: () => NP6,
    ClientAuthErrorMessage: () => mX8,
    ClientAuthErrorCodes: () => j2,
    ClientAuthError: () => xs,
    ClientAssertion: () => tC,
    ClientApplication: () => m56,
    AzureCloudInstance: () => sU,
    AuthErrorMessage: () => xX8,
    AuthErrorCodes: () => GP6,
    AuthError: () => T5
});

// @from(Ln 188945, Col 0)

// @from(Ln 188945, Col 0)
import li7 from "node:fs";

// @from(Ln 188969, Col 0)

// @from(Ln 188969, Col 0)
import tH9 from "node:fs";

// @from(Ln 188985, Col 0)

// @from(Ln 188985, Col 0)
import ri7 from "node:process";

// @from(Ln 188986, Col 0)

// @from(Ln 188986, Col 0)
import Aj9 from "node:os";

// @from(Ln 188987, Col 0)

// @from(Ln 188987, Col 0)
import qj9 from "node:fs";

// @from(Ln 189005, Col 0)

// @from(Ln 189005, Col 0)
import oi7 from "node:process";

// @from(Ln 189006, Col 0)

// @from(Ln 189006, Col 0)
import ai7, {
    constants as Kj9
} from "node:fs/promises";

// @from(Ln 189056, Col 0)

// @from(Ln 189056, Col 0)
import {
    promisify as _j9
} from "node:util";

// @from(Ln 189059, Col 0)

// @from(Ln 189059, Col 0)
import wj9 from "node:process";

// @from(Ln 189060, Col 0)

// @from(Ln 189060, Col 0)
import {
    execFile as Oj9
} from "node:child_process";

// @from(Ln 189074, Col 0)

// @from(Ln 189074, Col 0)
import Hj9 from "node:process";

// @from(Ln 189075, Col 0)

// @from(Ln 189075, Col 0)
import {
    promisify as jj9
} from "node:util";

// @from(Ln 189078, Col 0)

// @from(Ln 189078, Col 0)
import {
    execFile as Jj9,
    execFileSync as Py2
} from "node:child_process";

// @from(Ln 189106, Col 0)

// @from(Ln 189106, Col 0)
import {
    promisify as Dj9
} from "node:util";

// @from(Ln 189109, Col 0)

// @from(Ln 189109, Col 0)
import {
    execFile as Xj9
} from "node:child_process";

// @from(Ln 189165, Col 0)

// @from(Ln 189165, Col 0)
import {
    promisify as Zj9
} from "node:util";

// @from(Ln 189168, Col 0)

// @from(Ln 189168, Col 0)
import LW8 from "node:process";

// @from(Ln 189169, Col 0)

// @from(Ln 189169, Col 0)
import {
    execFile as Gj9
} from "node:child_process";

// @from(Ln 189200, Col 0)

// @from(Ln 189200, Col 0)
N1(Jn7, {
    openApp: () => Rj9,
    default: () => hj9,
    apps: () => ss
});

// @from(Ln 189205, Col 0)

// @from(Ln 189205, Col 0)
import hW8 from "node:process";

// @from(Ln 189206, Col 0)

// @from(Ln 189206, Col 0)
import {
    Buffer as $n7
} from "node:buffer";

// @from(Ln 189209, Col 0)

// @from(Ln 189209, Col 0)
import Hn7 from "node:path";

// @from(Ln 189210, Col 0)

// @from(Ln 189210, Col 0)
import {
    fileURLToPath as vj9
} from "node:url";

// @from(Ln 189213, Col 0)

// @from(Ln 189213, Col 0)
import {
    promisify as Nj9
} from "node:util";

// @from(Ln 189216, Col 0)

// @from(Ln 189216, Col 0)
import jn7 from "node:child_process";

// @from(Ln 189217, Col 0)

// @from(Ln 189217, Col 0)
import Vj9, {
    constants as kj9
} from "node:fs/promises";

// @from(Ln 189786, Col 0)

// @from(Ln 189786, Col 0)
import {
    readFile as Cj9
} from "node:fs/promises";

// @from(Ln 190044, Col 0)

// @from(Ln 190044, Col 0)
import uj9 from "child_process";

// @from(Ln 190144, Col 0)

// @from(Ln 190144, Col 0)
import mj9 from "child_process";

// @from(Ln 190227, Col 0)

// @from(Ln 190227, Col 0)
import * as fn7 from "child_process";

// @from(Ln 190416, Col 0)

// @from(Ln 190416, Col 0)
import {
    createHash as yn7,
    createPrivateKey as pj9
} from "node:crypto";

// @from(Ln 190420, Col 0)

// @from(Ln 190420, Col 0)
import {
    readFile as Qj9
} from "node:fs/promises";

// @from(Ln 190954, Col 0)

// @from(Ln 190954, Col 0)
import {
    createHash as un7
} from "node:crypto";

// @from(Ln 190957, Col 0)

// @from(Ln 190957, Col 0)
import {
    readFile as KJ9
} from "node:fs/promises";

// @from(Ln 191074, Col 0)

// @from(Ln 191074, Col 0)
N1(Fn7, {
    useIdentityPlugin: () => a39,
    serializeAuthenticationRecord: () => Fi7,
    logger: () => Tv,
    getDefaultAzureCredential: () => YJ9,
    getBearerTokenProvider: () => Bn7,
    deserializeAuthenticationRecord: () => pi7,
    WorkloadIdentityCredential: () => Md,
    VisualStudioCodeCredential: () => SX8,
    UsernamePasswordCredential: () => kg6,
    OnBehalfOfCredential: () => AZ8,
    ManagedIdentityCredential: () => ts,
    InteractiveBrowserCredential: () => rW8,
    EnvironmentCredential: () => Eg6,
    DeviceCodeCredential: () => aW8,
    DefaultAzureCredential: () => yg6,
    CredentialUnavailableErrorName: () => hD8,
    CredentialUnavailableError: () => D4,
    ClientSecretCredential: () => Vg6,
    ClientCertificateCredential: () => Ng6,
    ClientAssertionCredential: () => r56,
    ChainedTokenCredential: () => Tg6,
    AzurePowerShellCredential: () => fg6,
    AzurePipelinesCredential: () => sW8,
    AzureDeveloperCliCredential: () => Gg6,
    AzureCliCredential: () => Zg6,
    AzureAuthorityHosts: () => mm,
    AuthorizationCodeCredential: () => tW8,
    AuthenticationRequiredError: () => cC,
    AuthenticationErrorName: () => Dm6,
    AuthenticationError: () => dC,
    AggregateAuthenticationErrorName: () => SD8,
    AggregateAuthenticationError: () => Xm6
});

// @from(Ln 214482, Col 0)

// @from(Ln 214482, Col 0)
N1(S64, {
    default: () => Df8,
    BaseAnthropic: () => yz,
    AnthropicVertex: () => Df8
});

// @from(Ln 214791, Col 0)

// @from(Ln 214791, Col 0)
import {
    createHash as m64,
    randomUUID as HT9
} from "crypto";

// @from(Ln 214795, Col 0)

// @from(Ln 214795, Col 0)
import {
    dirname as B64,
    join as g64
} from "path";

// @from(Ln 214799, Col 0)

// @from(Ln 214799, Col 0)
import {
    writeFile as F64,
    readFile as p64,
    mkdir as Q64
} from "fs/promises";

// @from(Ln 217940, Col 0)

// @from(Ln 217940, Col 0)
import {
    normalize as ED1
} from "path";

// @from(Ln 218047, Col 0)

// @from(Ln 218047, Col 0)
N1(Ld, {
    validateTeamMemWritePath: () => Sv9,
    validateTeamMemKey: () => Ff8,
    isTeamMemoryEnabled: () => SD1,
    isTeamMemPath: () => m14,
    isTeamMemFile: () => JF6,
    getTeamMemPath: () => Lk,
    getTeamMemEntrypoint: () => hv9,
    PathTraversalError: () => MX
});

// @from(Ln 218057, Col 0)

// @from(Ln 218057, Col 0)
import {
    dirname as I14,
    join as hD1,
    resolve as Bf8,
    sep as gf8
} from "path";

// @from(Ln 218063, Col 0)

// @from(Ln 218063, Col 0)
import {
    realpath as b14,
    lstat as Lv9
} from "fs/promises";

// @from(Ln 218167, Col 0)

// @from(Ln 218167, Col 0)
N1(B14, {
    buildTypedCombinedMemoryPrompt: () => Iv9,
    buildExtractModeTypedCombinedPrompt: () => bv9,
    buildCombinedMemoryPrompt: () => Cv9
});

// @from(Ln 218373, Col 0)

// @from(Ln 218373, Col 0)
N1(s14, {
    stripHtmlComments: () => o14,
    shouldShowClaudeMdExternalIncludesWarning: () => of8,
    resetGetMemoryFilesCache: () => cf8,
    processMemoryFile: () => Sk,
    processMdRules: () => Xt,
    processConditionedMdRules: () => PF6,
    isMemoryFilePath: () => a14,
    hasExternalClaudeMdIncludes: () => mD1,
    getUltraClaudeMd: () => Wt,
    getMemoryFilesForNestedDirectory: () => nf8,
    getMemoryFiles: () => vO,
    getManagedAndUserConditionalRules: () => if8,
    getLargeMemoryFiles: () => Pt,
    getImportantClaudeMdEntries: () => uD1,
    getExternalClaudeMdIncludes: () => E06,
    getConditionalRulesForCwdLevelDirectory: () => rf8,
    getClaudeMds: () => lf8,
    getAllMemoryFilePaths: () => ov9,
    MAX_ULTRAMEMORY_CHARACTER_COUNT: () => O36,
    MAX_MEMORY_CHARACTER_COUNT: () => JB
});

// @from(Ln 218395, Col 0)

// @from(Ln 218395, Col 0)
import {
    join as hk,
    parse as mv9,
    dirname as XF6,
    relative as Bv9,
    isAbsolute as gv9,
    basename as Fv9,
    sep as df8,
    extname as pv9
} from "path";

// @from(Ln 219325, Col 0)

// @from(Ln 219325, Col 0)
import {
    AsyncLocalStorage as AN9
} from "async_hooks";

// @from(Ln 219352, Col 0)

// @from(Ln 219352, Col 0)
N1(KT8, {
    waitForTeammatesToBecomeIdle: () => qT8,
    setDynamicTeamContext: () => qN9,
    runWithTeammateContext: () => UD1,
    isTeammate: () => $Y,
    isTeamLead: () => KZ,
    isPlanModeRequired: () => NF6,
    isInProcessTeammate: () => eP,
    hasWorkingInProcessTeammates: () => AT8,
    hasActiveInProcessTeammates: () => cD1,
    getTeammateContext: () => iM,
    getTeammateColor: () => H$,
    getTeamName: () => l5,
    getParentSessionId: () => Zt,
    getDynamicTeamContext: () => vF6,
    getAgentName: () => i3,
    getAgentId: () => nM,
    createTeammateContext: () => dD1,
    clearDynamicTeamContext: () => KN9
});

// @from(Ln 219485, Col 0)

// @from(Ln 219485, Col 0)
import {
    join as kF6
} from "path";

// @from(Ln 219488, Col 0)

// @from(Ln 219488, Col 0)
import {
    mkdir as YN9,
    readdir as YT8,
    readFile as H84,
    unlink as j84,
    writeFile as iD1
} from "fs/promises";

// @from(Ln 220743, Col 0)

// @from(Ln 220743, Col 0)
import {
    join as DN9
} from "path";

// @from(Ln 220800, Col 0)

// @from(Ln 220800, Col 0)
import {
    homedir as XN9
} from "os";

// @from(Ln 220803, Col 0)

// @from(Ln 220803, Col 0)
import {
    join as PN9
} from "path";

// @from(Ln 220806, Col 0)

// @from(Ln 220806, Col 0)
import {
    stat as V84
} from "fs/promises";

// @from(Ln 220895, Col 0)

// @from(Ln 220895, Col 0)
import {
    homedir as GN9
} from "os";

// @from(Ln 220898, Col 0)

// @from(Ln 220898, Col 0)
import {
    dirname as Su2,
    join as vt
} from "path";

// @from(Ln 220959, Col 0)

// @from(Ln 220959, Col 0)
N1(L84, {
    shouldOfferTerminalSetup: () => I06,
    setupTerminal: () => HX1,
    markBackslashReturnUsed: () => ET8,
    isShiftEnterKeyBindingInstalled: () => VT8,
    hasUsedBackslashReturn: () => kT8,
    getNativeCSIuTerminalDisplayName: () => NT8,
    call: () => VN9
});

// @from(Ln 220968, Col 0)

// @from(Ln 220968, Col 0)
import {
    randomBytes as WT8
} from "crypto";

// @from(Ln 220971, Col 0)

// @from(Ln 220971, Col 0)
import {
    copyFile as ZT8,
    mkdir as GT8,
    readFile as fT8,
    writeFile as TT8
} from "fs/promises";

// @from(Ln 220977, Col 0)

// @from(Ln 220977, Col 0)
import {
    homedir as vT8,
    platform as OX1
} from "os";

// @from(Ln 220981, Col 0)

// @from(Ln 220981, Col 0)
import {
    dirname as TN9,
    join as XB
} from "path";

// @from(Ln 220985, Col 0)

// @from(Ln 220985, Col 0)
import {
    pathToFileURL as vN9
} from "url";

// @from(Ln 221331, Col 0)

// @from(Ln 221331, Col 0)
import {
    join as yT8
} from "path";

// @from(Ln 221334, Col 0)

// @from(Ln 221334, Col 0)
import {
    createHash as LN9
} from "crypto";

// @from(Ln 221337, Col 0)

// @from(Ln 221337, Col 0)
import {
    mkdir as RN9,
    writeFile as hN9,
    readFile as SN9,
    readdir as CN9,
    stat as IN9,
    unlink as bN9
} from "fs/promises";

// @from(Ln 221407, Col 0)

// @from(Ln 221407, Col 0)
import {
    join as u84
} from "path";

// @from(Ln 221410, Col 0)

// @from(Ln 221410, Col 0)
import {
    appendFile as uN9,
    writeFile as mN9
} from "fs/promises";

// @from(Ln 221784, Col 0)

// @from(Ln 221784, Col 0)
import {
    basename as QN9,
    extname as UN9,
    posix as i84,
    sep as dN9
} from "path";

// @from(Ln 221812, Col 0)

// @from(Ln 221812, Col 0)
import {
    join as nN9,
    isAbsolute as im2,
    relative as nm2
} from "path";

// @from(Ln 221817, Col 0)

// @from(Ln 221817, Col 0)
import {
    stat as rN9
} from "fs/promises";

// @from(Ln 222633, Col 0)

// @from(Ln 222633, Col 0)
N1(VX1, {
    sharp: () => fA4,
    getNativeModule: () => GA4,
    default: () => WV9
});

// @from(Ln 230884, Col 0)

// @from(Ln 230884, Col 0)
import {
    createReadStream as wx9,
    fstat as Ox9
} from "fs";

// @from(Ln 230888, Col 0)

// @from(Ln 230888, Col 0)
import {
    readFile as $x9,
    stat as Hx9
} from "fs/promises";

// @from(Ln 231216, Col 0)

// @from(Ln 231216, Col 0)
import {
    mkdir as kx9,
    stat as Ex9
} from "fs/promises";

// @from(Ln 231220, Col 0)

// @from(Ln 231220, Col 0)
import {
    execFile as yx9
} from "node:child_process";

// @from(Ln 231223, Col 0)

// @from(Ln 231223, Col 0)
import {
    join as EN8
} from "node:path";

// @from(Ln 231226, Col 0)

// @from(Ln 231226, Col 0)
import * as OP1 from "node:os";

// @from(Ln 231501, Col 0)

// @from(Ln 231501, Col 0)
import {
    access as bx9
} from "fs/promises";

// @from(Ln 231504, Col 0)

// @from(Ln 231504, Col 0)
import {
    join as $P1
} from "node:path/posix";

// @from(Ln 231507, Col 0)

// @from(Ln 231507, Col 0)
import {
    join as xx9
} from "node:path";

// @from(Ln 231510, Col 0)

// @from(Ln 231510, Col 0)
import {
    tmpdir as ux9
} from "node:os";

// @from(Ln 231599, Col 0)

// @from(Ln 231599, Col 0)
import {
    join as Bx9
} from "path";

// @from(Ln 231602, Col 0)

// @from(Ln 231602, Col 0)
import {
    tmpdir as gx9
} from "os";

// @from(Ln 231647, Col 0)

// @from(Ln 231647, Col 0)
import {
    constants as Ap6,
    realpathSync as q34,
    readFileSync as px9,
    unlinkSync as Qx9,
    openSync as Ux9,
    closeSync as K34
} from "node:fs";

// @from(Ln 231655, Col 0)

// @from(Ln 231655, Col 0)
import {
    mkdir as dx9
} from "fs/promises";

// @from(Ln 231658, Col 0)

// @from(Ln 231658, Col 0)
import {
    execFileSync as cx9,
    spawn as lx9
} from "node:child_process";

// @from(Ln 231662, Col 0)

// @from(Ln 231662, Col 0)
import {
    isAbsolute as ix9,
    resolve as nx9
} from "node:path";

// @from(Ln 231666, Col 0)

// @from(Ln 231666, Col 0)
import {
    join as rx9
} from "node:path/posix";

// @from(Ln 231669, Col 0)

// @from(Ln 231669, Col 0)
import {
    accessSync as ox9
} from "fs";

// @from(Ln 232099, Col 0)

// @from(Ln 232099, Col 0)
import {
    join as BN8
} from "path";

// @from(Ln 232102, Col 0)

// @from(Ln 232102, Col 0)
import {
    mkdir as Hu9,
    writeFile as ju9,
    stat as Ju9
} from "fs/promises";

// @from(Ln 232474, Col 0)

// @from(Ln 232474, Col 0)
import {
    randomUUID as Eu9
} from "crypto";

// @from(Ln 232477, Col 0)

// @from(Ln 232477, Col 0)
import {
    join as v34
} from "path";

// @from(Ln 232480, Col 0)

// @from(Ln 232480, Col 0)
import {
    mkdir as yu9,
    readdir as Lu9,
    readFile as Ru9
} from "fs/promises";

// @from(Ln 233296, Col 0)

// @from(Ln 233296, Col 0)
import {
    readFile as du9,
    stat as cu9
} from "fs/promises";

// @from(Ln 233300, Col 0)

// @from(Ln 233300, Col 0)
import {
    readFileSync as lu9
} from "fs";

// @from(Ln 233303, Col 0)

// @from(Ln 233303, Col 0)
import {
    join as iu9,
    dirname as nu9
} from "path";

// @from(Ln 233886, Col 0)

// @from(Ln 233886, Col 0)
import {
    pathToFileURL as Om9
} from "url";

// @from(Ln 233922, Col 0)

// @from(Ln 233922, Col 0)
import {
    randomBytes as $m9
} from "crypto";

// @from(Ln 233946, Col 0)

// @from(Ln 233946, Col 0)
import {
    randomUUID as Dm9
} from "crypto";

// @from(Ln 233949, Col 0)

// @from(Ln 233949, Col 0)
import {
    join as ut,
    resolve as Xm9,
    sep as Pm9
} from "path";

// @from(Ln 233954, Col 0)

// @from(Ln 233954, Col 0)
import {
    copyFile as Wm9,
    writeFile as Zm9
} from "fs/promises";

// @from(Ln 234292, Col 0)

// @from(Ln 234292, Col 0)
import {
    join as id,
    normalize as vm9,
    sep as xB
} from "path";

// @from(Ln 234372, Col 0)

// @from(Ln 234372, Col 0)
import {
    normalize as Vm9,
    posix as D94,
    win32 as X94
} from "path";

// @from(Ln 234477, Col 0)

// @from(Ln 234477, Col 0)
import {
    randomUUID as ym9
} from "crypto";

// @from(Ln 234581, Col 0)

// @from(Ln 234581, Col 0)
import {
    realpath as Sm9
} from "fs/promises";

// @from(Ln 234584, Col 0)

// @from(Ln 234584, Col 0)
import {
    join as mt,
    dirname as B36,
    basename as SP1,
    sep as NW6,
    isAbsolute as Cm9,
    relative as Im9
} from "path";

// @from(Ln 235058, Col 0)

// @from(Ln 235058, Col 0)
import {
    readdir as pm9,
    readFile as Qm9
} from "fs/promises";

// @from(Ln 235062, Col 0)

// @from(Ln 235062, Col 0)
import {
    createHash as Um9
} from "crypto";

// @from(Ln 235065, Col 0)

// @from(Ln 235065, Col 0)
import * as g36 from "path";

// @from(Ln 235066, Col 0)

// @from(Ln 235066, Col 0)
import {
    posix as dm9,
    win32 as cm9
} from "path";

// @from(Ln 235678, Col 0)

// @from(Ln 235678, Col 0)
N1(x94, {
    shouldRenderSearchHints: () => b94,
    isDeferredTool: () => GX,
    getPrompt: () => mP1,
    formatDeferredToolLine: () => fp6,
    TOOL_SEARCH_TOOL_NAME: () => HZ
});

// @from(Ln 235751, Col 0)

// @from(Ln 235751, Col 0)
N1(d94, {
    outputSchema: () => U94,
    inputSchema: () => Q94,
    clearToolSearchDescriptionCache: () => JB9,
    ToolSearchTool: () => Tp6
});

// @from(Ln 235991, Col 0)

// @from(Ln 235991, Col 0)
import {
    readFile as c94
} from "fs/promises";

// @from(Ln 236050, Col 0)

// @from(Ln 236050, Col 0)
N1(s94, {
    getSkillToolInfo: () => TV8,
    getSkillInfo: () => ZB9,
    getPrompt: () => dP1,
    getLimitedSkillToolCommands: () => vV8,
    getCharBudget: () => UP1,
    formatCommandsWithinBudget: () => fV8,
    clearPromptCache: () => NV8,
    SKILL_BUDGET_CONTEXT_PERCENT: () => r94,
    DEFAULT_CHAR_BUDGET: () => a94,
    CHARS_PER_TOKEN: () => o94
});

// @from(Ln 236384, Col 0)

// @from(Ln 236384, Col 0)
import {
    randomUUID as NB9
} from "crypto";

// @from(Ln 236693, Col 0)

// @from(Ln 236693, Col 0)
N1(XY4, {
    isKairosCronEnabled: () => kR,
    CRON_LIST_TOOL_NAME: () => SW6,
    CRON_LIST_PROMPT: () => bV8,
    CRON_LIST_DESCRIPTION: () => IV8,
    CRON_DELETE_TOOL_NAME: () => ed,
    CRON_DELETE_PROMPT: () => CV8,
    CRON_DELETE_DESCRIPTION: () => SV8,
    CRON_CREATE_TOOL_NAME: () => ER,
    CRON_CREATE_PROMPT: () => hV8,
    CRON_CREATE_DESCRIPTION: () => RV8
});

// @from(Ln 236801, Col 0)

// @from(Ln 236801, Col 0)
N1(fY4, {
    isTeamMemoryWriteOrEdit: () => hB9,
    isTeamMemorySearch: () => RB9,
    isTeamMemFile: () => JF6,
    appendTeamMemorySummaryParts: () => SB9
});

// @from(Ln 237424, Col 0)

// @from(Ln 237424, Col 0)
N1(UV8, {
    parseCommandRaw: () => pV8,
    parseCommand: () => FV8,
    extractCommandArguments: () => QV8,
    ensureInitialized: () => eB9
});

// @from(Ln 237471, Col 0)

// @from(Ln 237471, Col 0)
N1(IY4, {
    RegexParsedCommand_DEPRECATED: () => dV8,
    ParsedCommand: () => ot
});

// @from(Ln 239137, Col 0)

// @from(Ln 239137, Col 0)
import {
    isAbsolute as fg9,
    resolve as Tg9
} from "path";

// @from(Ln 239141, Col 0)

// @from(Ln 239141, Col 0)
import {
    homedir as vg9
} from "os";

// @from(Ln 240983, Col 0)

// @from(Ln 240983, Col 0)
import {
    join as bp6
} from "path";

// @from(Ln 242405, Col 0)

// @from(Ln 242405, Col 0)
import {
    createHash as _F9
} from "crypto";

// @from(Ln 243088, Col 0)

// @from(Ln 243088, Col 0)
import {
    AsyncLocalStorage as nz4
} from "async_hooks";

// @from(Ln 243593, Col 0)

// @from(Ln 243593, Col 0)
import {
    randomUUID as ZF9
} from "crypto";

// @from(Ln 243997, Col 0)

// @from(Ln 243997, Col 0)
import {
    randomBytes as NF9
} from "crypto";

// @from(Ln 244978, Col 0)

// @from(Ln 244978, Col 0)
import {
    join as L_4
} from "path";

// @from(Ln 245050, Col 0)

// @from(Ln 245050, Col 0)
import {
    dirname as nt2,
    join as _96
} from "path";

// @from(Ln 245531, Col 0)

// @from(Ln 245531, Col 0)
import {
    join as oW6,
    basename as aW6,
    dirname as wc
} from "path";

// @from(Ln 245984, Col 0)

// @from(Ln 245984, Col 0)
N1(Ck8, {
    setupPluginHookHotReload: () => oF9,
    resetHotReloadState: () => rF9,
    loadPluginHooks: () => nB,
    clearPluginHookCache: () => d01
});

// @from(Ln 246107, Col 0)

// @from(Ln 246107, Col 0)
import {
    join as aF9,
    basename as sF9
} from "path";

// @from(Ln 246211, Col 0)

// @from(Ln 246211, Col 0)
import {
    join as rB,
    dirname as d_4,
    basename as tF9
} from "path";

// @from(Ln 246216, Col 0)

// @from(Ln 246216, Col 0)
import {
    tmpdir as eF9
} from "os";

// @from(Ln 246219, Col 0)

// @from(Ln 246219, Col 0)
import {
    randomBytes as c_4
} from "crypto";

// @from(Ln 246222, Col 0)

// @from(Ln 246222, Col 0)
import {
    readdir as Ap9,
    rm as uk8,
    readFile as qp9,
    writeFile as xk8,
    rename as Kp9,
    stat as U_4,
    lstat as Yp9
} from "fs/promises";

// @from(Ln 246399, Col 0)

// @from(Ln 246399, Col 0)
import {
    readdir as _p9,
    rm as A24,
    stat as wp9,
    unlink as Op9,
    writeFile as $p9
} from "fs/promises";

// @from(Ln 246406, Col 0)

// @from(Ln 246406, Col 0)
import {
    join as r01
} from "path";

// @from(Ln 246533, Col 0)

// @from(Ln 246533, Col 0)
import {
    join as TX,
    basename as K24,
    dirname as Y24,
    sep as e01,
    resolve as Hc,
    isAbsolute as w24
} from "path";

// @from(Ln 247676, Col 0)

// @from(Ln 247676, Col 0)
import {
    rename as nk8,
    rm as yp9
} from "fs/promises";

// @from(Ln 247680, Col 0)

// @from(Ln 247680, Col 0)
import {
    dirname as rk8,
    sep as ak8,
    join as Lp9,
    resolve as ok8
} from "path";

// @from(Ln 247686, Col 0)

// @from(Ln 247686, Col 0)
import {
    randomBytes as Rp9
} from "crypto";

// @from(Ln 247977, Col 0)

// @from(Ln 247977, Col 0)
import {
    copyFile as Sp9,
    readdir as YZ6,
    readFile as AQ6,
    readlink as Cp9,
    realpath as wW1,
    rename as E24,
    rm as D96,
    rmdir as Ip9,
    stat as bp9,
    symlink as qE8
} from "fs/promises";

// @from(Ln 247989, Col 0)

// @from(Ln 247989, Col 0)
import {
    join as r3,
    resolve as xp9,
    basename as up9,
    relative as T24,
    dirname as KE8,
    sep as v24
} from "path";

// @from(Ln 249245, Col 0)

// @from(Ln 249245, Col 0)
import {
    join as ep9,
    basename as AQ9
} from "path";

// @from(Ln 249414, Col 0)

// @from(Ln 249414, Col 0)
N1(g24, {
    parseAgentsFromJson: () => _Q6,
    parseAgentFromMarkdown: () => B24,
    parseAgentFromJson: () => m24,
    isPluginAgent: () => zQ6,
    isCustomAgent: () => YQ6,
    isBuiltInAgent: () => Qj,
    hasRequiredMcpServers: () => HW1,
    getAgentDefinitionsWithOverrides: () => UI,
    getActiveAgentsFromList: () => dv,
    filterAgentsByMcpRequirements: () => zE8,
    clearAgentDefinitionsCache: () => Fk8
});

// @from(Ln 249427, Col 0)

// @from(Ln 249427, Col 0)
import {
    basename as qQ9
} from "path";

// @from(Ln 249784, Col 0)

// @from(Ln 249784, Col 0)
import {
    resolve as _Q9
} from "path";

// @from(Ln 250114, Col 0)

// @from(Ln 250114, Col 0)
import {
    dirname as _Aw,
    join as wQ9
} from "path";

// @from(Ln 250210, Col 0)

// @from(Ln 250210, Col 0)
import {
    createHash as jQ9
} from "crypto";

// @from(Ln 250213, Col 0)

// @from(Ln 250213, Col 0)
import {
    join as JQ9
} from "path";

// @from(Ln 250471, Col 0)

// @from(Ln 250471, Col 0)
import {
    platform as _w4,
    tmpdir as WQ9,
    userInfo as ZQ9,
    homedir as JE8
} from "os";

// @from(Ln 250477, Col 0)

// @from(Ln 250477, Col 0)
import {
    join as hR
} from "path";

// @from(Ln 250480, Col 0)

// @from(Ln 250480, Col 0)
import {
    access as zw4
} from "fs/promises";

// @from(Ln 250483, Col 0)

// @from(Ln 250483, Col 0)
import {
    readdirSync as GQ9
} from "fs";

// @from(Ln 250801, Col 0)

// @from(Ln 250801, Col 0)
import {
    join as vQ9
} from "path";

// @from(Ln 251125, Col 0)

// @from(Ln 251125, Col 0)
import {
    join as EW1,
    dirname as RQ9,
    parse as hQ9
} from "path";

// @from(Ln 251130, Col 0)

// @from(Ln 251130, Col 0)
import {
    open as SQ9,
    stat as CQ9,
    chmod as IQ9,
    rename as bQ9,
    unlink as xQ9
} from "fs/promises";

// @from(Ln 274654, Col 0)

// @from(Ln 274654, Col 0)
N1(SZ6, {
    storeOAuthAccountInfo: () => hZ6,
    shouldUseClaudeAIAuth: () => aI,
    refreshOAuthToken: () => QQ6,
    populateOAuthAccountInfoIfNeeded: () => my8,
    parseScopes: () => pQ6,
    isOAuthTokenExpired: () => Yg,
    getOrganizationUUID: () => mR,
    fetchProfileInfo: () => fZ1,
    fetchAndStoreUserRoles: () => xy8,
    exchangeCodeForTokens: () => by8,
    createAndStoreApiKey: () => uy8,
    buildAuthUrl: () => GZ1
});

// @from(Ln 274949, Col 0)

// @from(Ln 274949, Col 0)
import * as EW4 from "http";

// @from(Ln 275046, Col 0)

// @from(Ln 275046, Col 0)
import * as UQ6 from "crypto";

// @from(Ln 275548, Col 0)

// @from(Ln 275548, Col 0)
import {
    watch as ee9
} from "fs";

// @from(Ln 276317, Col 0)

// @from(Ln 276317, Col 0)
N1(qZ4, {
    unregisterTeamForSessionCleanup: () => KL8,
    syncTeammateMode: () => ey8,
    setMultipleMemberModes: () => AL8,
    setMemberMode: () => xZ6,
    setMemberActive: () => aQ6,
    sanitizeAgentName: () => y6Y,
    removeTeammateFromTeamFile: () => g96,
    removeMemberFromTeam: () => sy8,
    removeMemberByAgentId: () => ty8,
    removeHiddenPaneId: () => R6Y,
    registerTeamForSessionCleanup: () => qL8,
    readTeamFile: () => e$,
    isPaneHidden: () => ay8,
    inputSchema: () => E6Y,
    getHiddenPaneIds: () => AZ4,
    cleanupTeamDirectories: () => CZ1,
    cleanupSessionTeams: () => S6Y,
    addHiddenPaneId: () => L6Y
});

// @from(Ln 276337, Col 0)

// @from(Ln 276337, Col 0)
import {
    join as m96
} from "path";

// @from(Ln 276340, Col 0)

// @from(Ln 276340, Col 0)
import {
    mkdirSync as T6Y,
    readFileSync as v6Y,
    writeFileSync as N6Y
} from "fs";

// @from(Ln 276345, Col 0)

// @from(Ln 276345, Col 0)
import {
    readFile as tW4,
    writeFile as V6Y,
    mkdir as k6Y,
    rm as oy8
} from "fs/promises";

// @from(Ln 276751, Col 0)

// @from(Ln 276751, Col 0)
N1(KZ4, {
    requestTeammateShutdown: () => YL8,
    injectUserMessageToTeammate: () => tQ6,
    getAllInProcessTeammateTasks: () => BR,
    findTeammateTaskByAgentId: () => _g,
    appendTeammateMessage: () => uZ1,
    InProcessTeammateTask: () => sQ6
});

// @from(Ln 283909, Col 0)

// @from(Ln 283909, Col 0)
import {
    isDeepStrictEqual as w8Y
} from "node:util";

// @from(Ln 284368, Col 0)

// @from(Ln 284368, Col 0)
import {
    randomBytes as J8Y
} from "crypto";

// @from(Ln 284371, Col 0)

// @from(Ln 284371, Col 0)
import {
    basename as M8Y,
    extname as D8Y,
    isAbsolute as X8Y,
    join as SL8
} from "path";

// @from(Ln 284568, Col 0)

// @from(Ln 284568, Col 0)
import {
    join as WG1
} from "path";

// @from(Ln 284571, Col 0)

// @from(Ln 284571, Col 0)
import {
    open as G8Y,
    mkdir as f8Y
} from "fs/promises";

// @from(Ln 284674, Col 0)

// @from(Ln 284674, Col 0)
import {
    pathToFileURL as N8Y
} from "url";

// @from(Ln 285545, Col 0)

// @from(Ln 285545, Col 0)
import {
    createHash as b8Y
} from "crypto";

// @from(Ln 287680, Col 0)

// @from(Ln 287680, Col 0)
import {
    writeSync as Jg
} from "fs";

// @from(Ln 288584, Col 0)

// @from(Ln 288584, Col 0)
import {
    openSync as P4Y
} from "fs";

// @from(Ln 288587, Col 0)

// @from(Ln 288587, Col 0)
import {
    ReadStream as W4Y
} from "tty";

// @from(Ln 288834, Col 0)

// @from(Ln 288834, Col 0)
import {
    join as V4Y
} from "path";

// @from(Ln 288899, Col 0)

// @from(Ln 288899, Col 0)
import {
    createHash as E4Y
} from "crypto";

// @from(Ln 288902, Col 0)

// @from(Ln 288902, Col 0)
import {
    open as y4Y,
    unlink as $V4
} from "fs/promises";

// @from(Ln 289179, Col 0)

// @from(Ln 289179, Col 0)
N1(xR8, {
    waitForPolicyLimitsToLoad: () => EU6,
    stopBackgroundPolling: () => bR8,
    startBackgroundPolling: () => WV4,
    refreshPolicyLimits: () => yU6,
    loadPolicyLimits: () => IR8,
    isPolicyLimitsEligible: () => Kb,
    isPolicyAllowed: () => qD,
    initializePolicyLimitsLoadingPromise: () => SR8,
    clearPolicyLimitsCache: () => UG1
});

// @from(Ln 289190, Col 0)

// @from(Ln 289190, Col 0)
import {
    join as g4Y
} from "path";

// @from(Ln 289193, Col 0)

// @from(Ln 289193, Col 0)
import {
    createHash as F4Y
} from "crypto";

// @from(Ln 289196, Col 0)

// @from(Ln 289196, Col 0)
import {
    readFileSync as p4Y
} from "fs";

// @from(Ln 289199, Col 0)

// @from(Ln 289199, Col 0)
import {
    writeFile as Q4Y,
    unlink as XV4
} from "fs/promises";

// @from(Ln 319323, Col 0)

// @from(Ln 319323, Col 0)
N1(Zb8, {
    isTelemetryEnabled: () => dQ4,
    initializeTelemetry: () => DZY,
    flushTelemetry: () => XZY,
    bootstrapTelemetry: () => UQ4
});

// @from(Ln 319733, Col 0)

// @from(Ln 319733, Col 0)
N1(cQ4, {
    performLogout: () => dd6,
    clearAuthRelatedCaches: () => wv1,
    call: () => WZY
});

// @from(Ln 319784, Col 0)

// @from(Ln 319784, Col 0)
import {
    homedir as ZZY
} from "os";

// @from(Ln 319787, Col 0)

// @from(Ln 319787, Col 0)
import {
    join as $v1
} from "path";

// @from(Ln 319829, Col 0)

// @from(Ln 319829, Col 0)
import {
    join as cd6
} from "path";

// @from(Ln 319912, Col 0)

// @from(Ln 319912, Col 0)
import {
    homedir as aQ4
} from "os";

// @from(Ln 319915, Col 0)

// @from(Ln 319915, Col 0)
import {
    join as Eb8
} from "path";

// @from(Ln 319918, Col 0)

// @from(Ln 319918, Col 0)
import {
    readFile as fZY,
    open as TZY,
    stat as vZY
} from "fs/promises";

// @from(Ln 320002, Col 0)

// @from(Ln 320002, Col 0)
import {
    constants as NZY
} from "fs";

// @from(Ln 320005, Col 0)

// @from(Ln 320005, Col 0)
import {
    join as VZY
} from "path";

// @from(Ln 320008, Col 0)

// @from(Ln 320008, Col 0)
import {
    homedir as nd6
} from "os";

// @from(Ln 320011, Col 0)

// @from(Ln 320011, Col 0)
import {
    accessSync as kZY
} from "fs";

// @from(Ln 320293, Col 0)

// @from(Ln 320293, Col 0)
import {
    join as CZY
} from "node:path";

// @from(Ln 320296, Col 0)

// @from(Ln 320296, Col 0)
import {
    createHash as IZY
} from "node:crypto";

// @from(Ln 320299, Col 0)

// @from(Ln 320299, Col 0)
import {
    chmodSync as bZY
} from "fs";

// @from(Ln 320457, Col 0)

// @from(Ln 320457, Col 0)
import {
    readFile as FZY
} from "fs/promises";

// @from(Ln 320568, Col 0)

// @from(Ln 320568, Col 0)
import {
    realpath as $U4
} from "fs/promises";

// @from(Ln 320571, Col 0)

// @from(Ln 320571, Col 0)
import {
    homedir as RY6
} from "os";

// @from(Ln 320574, Col 0)

// @from(Ln 320574, Col 0)
import {
    join as xg,
    posix as od6,
    win32 as ad6,
    delimiter as pZY
} from "path";

// @from(Ln 320892, Col 0)

// @from(Ln 320892, Col 0)
import {
    join as HU4,
    basename as iZY
} from "path";

// @from(Ln 321077, Col 0)

// @from(Ln 321077, Col 0)
import {
    join as HM,
    dirname as ec,
    resolve as Al,
    delimiter as aZY,
    basename as sZY
} from "node:path";

// @from(Ln 321084, Col 0)

// @from(Ln 321084, Col 0)
import {
    homedir as WU4
} from "node:os";

// @from(Ln 321087, Col 0)

// @from(Ln 321087, Col 0)
import {
    constants as ZU4,
    existsSync as wf6
} from "fs";

// @from(Ln 321091, Col 0)

// @from(Ln 321091, Col 0)
import {
    access as GU4,
    copyFile as Qb8,
    chmod as tZY,
    rename as kv1,
    unlink as mg,
    mkdir as bY6,
    symlink as eZY,
    stat as kf,
    lstat as AGY,
    realpath as qGY,
    readlink as Ub8,
    readdir as td6,
    rmdir as KGY,
    rm as Lv1,
    writeFile as YGY
} from "fs/promises";

// @from(Ln 322360, Col 0)

// @from(Ln 322360, Col 0)
N1(Sv1, {
    installOAuthTokens: () => wc6,
    authStatus: () => PGY,
    authLogout: () => WGY,
    authLogin: () => XGY
});

// @from(Ln 322544, Col 0)

// @from(Ln 322544, Col 0)
N1(xU4, {
    ConsoleOAuthFlow: () => uY6
});

// @from(Ln 323006, Col 0)

// @from(Ln 323006, Col 0)
N1(gU4, {
    call: () => GGY,
    Login: () => Hf6
});

// @from(Ln 323090, Col 0)

// @from(Ln 323090, Col 0)
N1(Xc6, {
    updateSessionTitle: () => Ax8,
    sendTranscriptToRemoteSession: () => VGY,
    sendEventToRemoteSession: () => eb8,
    prepareApiRequest: () => k0,
    getOAuthHeaders: () => zj,
    getBranchFromSession: () => mv1,
    fetchSession: () => jf6,
    fetchCodeSessionsFromSessionsAPI: () => tb8,
    axiosGetWithRetry: () => UU4,
    CodeSessionSchema: () => vGY
});

// @from(Ln 323102, Col 0)

// @from(Ln 323102, Col 0)
import {
    randomUUID as pU4
} from "crypto";

// @from(Ln 323448, Col 0)

// @from(Ln 323448, Col 0)
N1(rU4, {
    call: () => Kx8
});

// @from(Ln 323468, Col 0)

// @from(Ln 323468, Col 0)
N1(oU4, {
    call: () => kGY
});

// @from(Ln 325084, Col 0)

// @from(Ln 325084, Col 0)
N1(Qd4, {
    writeToMailbox: () => x3,
    sendShutdownRequestToMailbox: () => rv1,
    readUnreadMessages: () => pY6,
    readMailbox: () => wl,
    markMessagesAsReadByPredicate: () => Tx8,
    markMessagesAsRead: () => kc6,
    markMessageAsReadByIndex: () => Vc6,
    isTeamPermissionUpdate: () => sv1,
    isTaskAssignment: () => av1,
    isStructuredProtocolMessage: () => AN1,
    isShutdownRequest: () => M66,
    isShutdownRejected: () => ov1,
    isShutdownApproved: () => Lf,
    isSandboxPermissionResponse: () => Rc6,
    isSandboxPermissionRequest: () => nv1,
    isPlanApprovalResponse: () => Zf6,
    isPlanApprovalRequest: () => UY6,
    isPermissionResponse: () => QY6,
    isPermissionRequest: () => Lc6,
    isModeSetRequest: () => ev1,
    isIdleNotification: () => yc6,
    getLastPeerDmSummary: () => hc6,
    getInboxPath: () => FY6,
    formatTeammateMessages: () => HTY,
    createShutdownRequestMessage: () => Wf6,
    createShutdownRejectedMessage: () => fx8,
    createShutdownApprovedMessage: () => Gx8,
    createSandboxPermissionResponseMessage: () => Zx8,
    createSandboxPermissionRequestMessage: () => Wx8,
    createPermissionResponseMessage: () => Px8,
    createPermissionRequestMessage: () => Xx8,
    createModeSetRequestMessage: () => tv1,
    createIdleNotification: () => Ec6,
    clearMailbox: () => $TY,
    ShutdownRequestMessageSchema: () => Bd4,
    ShutdownRejectedMessageSchema: () => Fd4,
    ShutdownApprovedMessageSchema: () => gd4,
    PlanApprovalResponseMessageSchema: () => md4,
    PlanApprovalRequestMessageSchema: () => ud4,
    ModeSetRequestMessageSchema: () => pd4
});

// @from(Ln 325126, Col 0)

// @from(Ln 325126, Col 0)
import {
    mkdir as wTY,
    readFile as xd4,
    writeFile as Pf6
} from "fs/promises";

// @from(Ln 325131, Col 0)

// @from(Ln 325131, Col 0)
import {
    join as Dx8
} from "path";

// @from(Ln 326419, Col 0)

// @from(Ln 326419, Col 0)
import {
    pathToFileURL as kTY
} from "url";

// @from(Ln 326553, Col 0)

// @from(Ln 326553, Col 0)
import {
    relative as ETY
} from "path";

// @from(Ln 326633, Col 0)

// @from(Ln 326633, Col 0)
import {
    basename as hTY,
    sep as STY
} from "path";

// @from(Ln 327519, Col 0)

// @from(Ln 327519, Col 0)
N1(Pc4, {
    checkHasTeamMemOps: () => dTY,
    TeamMemCountParts: () => cTY
});

// @from(Ln 329035, Col 0)

// @from(Ln 329035, Col 0)
import {
    AsyncLocalStorage as OvY
} from "async_hooks";

// @from(Ln 329210, Col 0)

// @from(Ln 329210, Col 0)
N1(JN1, {
    processSlashCommand: () => DvY,
    processPromptSlashCommand: () => WvY,
    looksLikeCommand: () => sc4,
    formatSkillLoadingMetadata: () => tc4
});

// @from(Ln 329216, Col 0)

// @from(Ln 329216, Col 0)
import {
    randomUUID as ac4
} from "crypto";

// @from(Ln 329690, Col 0)

// @from(Ln 329690, Col 0)
import {
    randomUUID as GvY
} from "crypto";

// @from(Ln 330048, Col 0)

// @from(Ln 330048, Col 0)
import {
    randomBytes as VvY
} from "crypto";

// @from(Ln 330392, Col 0)

// @from(Ln 330392, Col 0)
import {
    randomBytes as SvY
} from "crypto";

// @from(Ln 331224, Col 0)

// @from(Ln 331224, Col 0)
import {
    dirname as uvY,
    join as kN1
} from "path";

// @from(Ln 331228, Col 0)

// @from(Ln 331228, Col 0)
import {
    mkdir as xl4,
    writeFile as rx8
} from "fs/promises";

// @from(Ln 332073, Col 0)

// @from(Ln 332073, Col 0)
N1(rl4, {
    TEAMMATE_SYSTEM_PROMPT_ADDENDUM: () => tx8
});

// @from(Ln 332087, Col 0)

// @from(Ln 332087, Col 0)
import {
    mkdir as cbw,
    readdir as lbw,
    readFile as ANY,
    writeFile as ibw,
    unlink as nbw
} from "fs/promises";

// @from(Ln 332094, Col 0)

// @from(Ln 332094, Col 0)
import {
    join as qNY
} from "path";

// @from(Ln 333139, Col 0)

// @from(Ln 333139, Col 0)
N1(Wi4, {
    resetDetectionCache: () => WNY,
    isTmuxAvailable: () => N66,
    isIt2CliAvailable: () => tc6,
    isInsideTmuxSync: () => uN1,
    isInsideTmux: () => yb,
    isInITerm2: () => V66,
    getLeaderPaneId: () => mN1,
    IT2_COMMAND: () => BN1
});

// @from(Ln 333188, Col 0)

// @from(Ln 333188, Col 0)
N1(wu8, {
    setCliTeammateModeOverride: () => ZNY,
    getTeammateModeFromSnapshot: () => Al6,
    getCliTeammateModeOverride: () => zu8,
    clearCliTeammateModeOverride: () => _u8,
    captureTeammateModeSnapshot: () => Zi4
});

// @from(Ln 333401, Col 0)

// @from(Ln 333401, Col 0)
import {
    homedir as gN1
} from "os";

// @from(Ln 333500, Col 0)

// @from(Ln 333500, Col 0)
N1(Ii4, {
    TmuxBackend: () => Ju8
});

// @from(Ln 333735, Col 0)

// @from(Ln 333735, Col 0)
N1(mi4, {
    ITermBackend: () => Xu8
});

// @from(Ln 333838, Col 0)

// @from(Ln 333838, Col 0)
N1(pi4, {
    resetBackendDetection: () => SNY,
    registerTmuxBackend: () => Mu8,
    registerITermBackend: () => Pu8,
    isInProcessEnabled: () => Rb,
    getTeammateExecutor: () => RNY,
    getResolvedTeammateMode: () => Tu8,
    getInProcessBackend: () => Fi4,
    getCachedBackend: () => Ff6,
    getBackendByType: () => fu8,
    detectAndGetBackend: () => k66
});

// @from(Ln 334353, Col 0)

// @from(Ln 334353, Col 0)
import {
    join as Eu8
} from "path";

// @from(Ln 334356, Col 0)

// @from(Ln 334356, Col 0)
import {
    readFile as INY,
    mkdir as bNY,
    writeFile as xNY
} from "fs/promises";

// @from(Ln 334876, Col 0)

// @from(Ln 334876, Col 0)
N1($n4, {
    removeAgentWorktree: () => E66,
    parsePRReference: () => lN1,
    killTmuxSession: () => Qf6,
    keepWorktree: () => Uf6,
    isTmuxAvailable: () => mu8,
    hasWorktreeChanges: () => pu8,
    getTmuxInstallInstructions: () => Bu8,
    getCurrentWorktreeSession: () => S0,
    generateTmuxSessionName: () => Iu8,
    execIntoTmuxWorktree: () => rNY,
    createWorktreeForSession: () => Yl6,
    createTmuxSessionForWorktree: () => gu8,
    createAgentWorktree: () => zl6,
    copyWorktreeIncludeFiles: () => On4,
    cleanupWorktree: () => df6,
    cleanupStaleAgentWorktrees: () => Fu8
});

// @from(Ln 334894, Col 0)

// @from(Ln 334894, Col 0)
import {
    join as ME,
    dirname as Kn4,
    basename as Yn4
} from "path";

// @from(Ln 334899, Col 0)

// @from(Ln 334899, Col 0)
import {
    mkdir as Cu8,
    symlink as QNY,
    copyFile as zn4,
    stat as _n4,
    readFile as UNY,
    readdir as dNY
} from "fs/promises";

// @from(Ln 334907, Col 0)

// @from(Ln 334907, Col 0)
import {
    spawnSync as If
} from "child_process";

// @from(Ln 335708, Col 0)

// @from(Ln 335708, Col 0)
import {
    createHash as sNY
} from "crypto";

// @from(Ln 335711, Col 0)

// @from(Ln 335711, Col 0)
import {
    join as aN1,
    dirname as Dn4,
    isAbsolute as Xn4,
    relative as tNY
} from "path";

// @from(Ln 335717, Col 0)

// @from(Ln 335717, Col 0)
import {
    inspect as eNY
} from "util";

// @from(Ln 335720, Col 0)

// @from(Ln 335720, Col 0)
import {
    chmodSync as Pn4
} from "fs";

// @from(Ln 335723, Col 0)

// @from(Ln 335723, Col 0)
import {
    copyFile as AVY,
    link as qVY,
    mkdir as KVY
} from "fs/promises";

// @from(Ln 336186, Col 0)

// @from(Ln 336186, Col 0)
import {
    randomUUID as vn4
} from "crypto";

// @from(Ln 336189, Col 0)

// @from(Ln 336189, Col 0)
import {
    relative as lu8
} from "path";

// @from(Ln 336879, Col 0)

// @from(Ln 336879, Col 0)
N1(bn4, {
    validateSessionRepository: () => MV1,
    validateGitState: () => eu8,
    teleportToRemoteWithErrorHandling: () => Am8,
    teleportToRemote: () => DV1,
    teleportResumeCodeSession: () => Oz6,
    teleportFromSessionsAPI: () => In4,
    processMessagesForTeleportResume: () => Jl6,
    pollRemoteSessionEvents: () => qm8,
    checkOutTeleportedSessionBranch: () => Ml6
});

// @from(Ln 336890, Col 0)

// @from(Ln 336890, Col 0)
import {
    randomUUID as VVY
} from "crypto";

// @from(Ln 337403, Col 0)

// @from(Ln 337403, Col 0)
import {
    randomUUID as bVY
} from "crypto";

// @from(Ln 337557, Col 0)

// @from(Ln 337557, Col 0)
import {
    randomUUID as gVY
} from "crypto";

// @from(Ln 337755, Col 0)

// @from(Ln 337755, Col 0)
import {
    writeFile as pVY
} from "fs/promises";

// @from(Ln 338064, Col 0)

// @from(Ln 338064, Col 0)
import {
    promises as iVY
} from "fs";

// @from(Ln 342397, Col 0)

// @from(Ln 342397, Col 0)
import {
    spawn as aEY
} from "child_process";

// @from(Ln 342569, Col 0)

// @from(Ln 342569, Col 0)
import {
    pathToFileURL as sEY
} from "url";

// @from(Ln 342572, Col 0)

// @from(Ln 342572, Col 0)
import * as io4 from "path";

// @from(Ln 342765, Col 0)

// @from(Ln 342765, Col 0)
import {
    readFile as oo4
} from "fs/promises";

// @from(Ln 342768, Col 0)

// @from(Ln 342768, Col 0)
import {
    join as qyY,
    resolve as Um8,
    relative as KyY
} from "path";

// @from(Ln 342988, Col 0)

// @from(Ln 342988, Col 0)
import * as fl from "path";

// @from(Ln 342989, Col 0)

// @from(Ln 342989, Col 0)
import {
    pathToFileURL as Vl6
} from "url";

// @from(Ln 343163, Col 0)

// @from(Ln 343163, Col 0)
import {
    randomUUID as OyY
} from "crypto";

// @from(Ln 343302, Col 0)

// @from(Ln 343302, Col 0)
import {
    fileURLToPath as jyY
} from "url";

// @from(Ln 343514, Col 0)

// @from(Ln 343514, Col 0)
N1(Xa4, {
    scanForSecrets: () => lm8,
    getSecretLabel: () => WyY
});

// @from(Ln 344302, Col 0)

// @from(Ln 344302, Col 0)
import {
    extname as byY
} from "path";

// @from(Ln 344506, Col 0)

// @from(Ln 344506, Col 0)
import {
    relative as myY
} from "path";

// @from(Ln 344630, Col 0)

// @from(Ln 344630, Col 0)
import {
    isAbsolute as gyY,
    relative as ma4,
    resolve as FyY
} from "path";

// @from(Ln 344849, Col 0)

// @from(Ln 344849, Col 0)
import {
    access as QyY,
    readFile as UyY
} from "fs/promises";

// @from(Ln 344853, Col 0)

// @from(Ln 344853, Col 0)
import {
    dirname as dyY,
    join as cyY,
    relative as lyY,
    sep as iyY
} from "path";

// @from(Ln 345130, Col 0)

// @from(Ln 345130, Col 0)
import {
    dirname as YLY,
    sep as zLY
} from "path";

// @from(Ln 345549, Col 0)

// @from(Ln 345549, Col 0)
import {
    relative as OLY
} from "path";

// @from(Ln 346128, Col 0)

// @from(Ln 346128, Col 0)
import {
    relative as DLY
} from "path";

// @from(Ln 346279, Col 0)

// @from(Ln 346279, Col 0)
import {
    extname as XLY,
    isAbsolute as fs4,
    resolve as Ts4
} from "path";

// @from(Ln 346568, Col 0)

// @from(Ln 346568, Col 0)
import {
    join as ZLY
} from "path";

// @from(Ln 346571, Col 0)

// @from(Ln 346571, Col 0)
import {
    writeFile as GLY
} from "fs/promises";

// @from(Ln 361468, Col 0)

// @from(Ln 361468, Col 0)
N1(r6q, {
    validateURL: () => l6q,
    isPreapprovedUrl: () => ug8,
    isPermittedRedirect: () => n6q,
    getWithPermittedRedirects: () => mg8,
    getURLMarkdownContent: () => Bg8,
    clearWebFetchCache: () => VCY,
    checkDomainBlocklist: () => i6q,
    applyPromptToMarkdown: () => gg8,
    MAX_MARKDOWN_LENGTH: () => ol6
});

// @from(Ln 363216, Col 0)

// @from(Ln 363216, Col 0)
N1(VT6, {
    setAutoModeFlagCli: () => nCY,
    setAutoModeCircuitBroken: () => oCY,
    setAutoModeActive: () => qF8,
    isAutoModeCircuitBroken: () => aCY,
    isAutoModeActive: () => iCY,
    getAutoModeFlagCli: () => rCY,
    _resetForTesting: () => sCY
});

// @from(Ln 363774, Col 0)

// @from(Ln 363774, Col 0)
import {
    relative as $IY
} from "path";

// @from(Ln 364297, Col 0)

// @from(Ln 364297, Col 0)
import {
    readFile as MIY
} from "fs/promises";

// @from(Ln 364300, Col 0)

// @from(Ln 364300, Col 0)
import {
    pathToFileURL as DIY
} from "url";

// @from(Ln 364303, Col 0)

// @from(Ln 364303, Col 0)
import * as _F8 from "path";

// @from(Ln 367176, Col 0)

// @from(Ln 367176, Col 0)
N1(aAq, {
    isWorktreeModeEnabled: () => ST6
});

// @from(Ln 367350, Col 0)

// @from(Ln 367350, Col 0)
import {
    join as DF8
} from "path";

// @from(Ln 367353, Col 0)

// @from(Ln 367353, Col 0)
import {
    randomUUID as MbY
} from "crypto";

// @from(Ln 367356, Col 0)

// @from(Ln 367356, Col 0)
import {
    readFileSync as DbY
} from "fs";

// @from(Ln 367359, Col 0)

// @from(Ln 367359, Col 0)
import {
    writeFile as XbY,
    mkdir as PbY
} from "fs/promises";

// @from(Ln 367593, Col 0)

// @from(Ln 367593, Col 0)
N1(J7q, {
    CronCreateTool: () => TbY
});

// @from(Ln 367717, Col 0)

// @from(Ln 367717, Col 0)
N1(D7q, {
    CronDeleteTool: () => VbY
});

// @from(Ln 367813, Col 0)

// @from(Ln 367813, Col 0)
N1(P7q, {
    CronListTool: () => ybY
});

// @from(Ln 367908, Col 0)

// @from(Ln 367908, Col 0)
N1(G7q, {
    uploadBriefAttachment: () => BbY
});

// @from(Ln 367911, Col 0)

// @from(Ln 367911, Col 0)
import {
    randomUUID as LbY
} from "crypto";

// @from(Ln 367914, Col 0)

// @from(Ln 367914, Col 0)
import {
    readFile as RbY
} from "fs/promises";

// @from(Ln 367917, Col 0)

// @from(Ln 367917, Col 0)
import {
    basename as hbY,
    extname as SbY
} from "path";

// @from(Ln 368017, Col 0)

// @from(Ln 368017, Col 0)
import {
    stat as T7q
} from "fs/promises";

// @from(Ln 368189, Col 0)

// @from(Ln 368189, Col 0)
N1(xl, {
    isBriefEntitled: () => wE1,
    isBriefEnabled: () => S7q,
    BriefTool: () => UbY
});

// @from(Ln 368459, Col 0)

// @from(Ln 368459, Col 0)
N1(F7q, {
    TeamCreateTool: () => rbY
});

// @from(Ln 368462, Col 0)

// @from(Ln 368462, Col 0)
import {
    join as fF8
} from "path";

// @from(Ln 368465, Col 0)

// @from(Ln 368465, Col 0)
import {
    mkdir as dbY,
    writeFile as cbY
} from "fs/promises";

// @from(Ln 368693, Col 0)

// @from(Ln 368693, Col 0)
N1(r7q, {
    TeamDeleteTool: () => abY
});

// @from(Ln 368991, Col 0)

// @from(Ln 368991, Col 0)
N1(z4q, {
    SendMessageTool: () => OxY
});

// @from(Ln 371128, Col 0)

// @from(Ln 371128, Col 0)
import {
    randomUUID as LxY
} from "crypto";

// @from(Ln 371131, Col 0)

// @from(Ln 371131, Col 0)
import {
    rm as RxY
} from "fs";

// @from(Ln 371134, Col 0)

// @from(Ln 371134, Col 0)
import {
    appendFile as hxY,
    copyFile as g4q,
    mkdir as xF8
} from "fs/promises";

// @from(Ln 371139, Col 0)

// @from(Ln 371139, Col 0)
import {
    dirname as F4q,
    isAbsolute as SxY,
    join as xz6,
    relative as CxY
} from "path";

// @from(Ln 372540, Col 0)

// @from(Ln 372540, Col 0)
import {
    readdir as nxY,
    stat as rxY
} from "fs/promises";

// @from(Ln 372544, Col 0)

// @from(Ln 372544, Col 0)
import {
    join as oxY,
    basename as axY
} from "path";

// @from(Ln 372659, Col 0)

// @from(Ln 372659, Col 0)
import {
    readdir as Aqq,
    stat as qqq
} from "fs/promises";

// @from(Ln 372663, Col 0)

// @from(Ln 372663, Col 0)
import {
    dirname as aF8,
    parse as SE1,
    relative as Bl,
    resolve as Kqq
} from "path";

// @from(Ln 372669, Col 0)

// @from(Ln 372669, Col 0)
import {
    randomUUID as KuY
} from "node:crypto";

// @from(Ln 374704, Col 0)

// @from(Ln 374704, Col 0)
import {
    join as dqq
} from "path";

// @from(Ln 374707, Col 0)

// @from(Ln 374707, Col 0)
import {
    readFile as cqq
} from "fs/promises";

// @from(Ln 375873, Col 0)

// @from(Ln 375873, Col 0)
N1(Vp8, {
    initExtractMemories: () => cmY,
    executeExtractMemories: () => lmY,
    createAutoMemCanUseTool: () => fKq
});

// @from(Ln 376280, Col 0)

// @from(Ln 376280, Col 0)
import {
    randomUUID as nmY
} from "crypto";

// @from(Ln 377358, Col 0)

// @from(Ln 377358, Col 0)
import {
    randomUUID as emY
} from "crypto";

// @from(Ln 378204, Col 0)

// @from(Ln 378204, Col 0)
N1(pp8, {
    prewarm: () => XBY,
    isModifierPressed: () => DBY,
    getModifiers: () => MBY
});

// @from(Ln 378209, Col 0)

// @from(Ln 378209, Col 0)
import {
    createRequire as $BY
} from "module";

// @from(Ln 378212, Col 0)

// @from(Ln 378212, Col 0)
import {
    fileURLToPath as HBY
} from "url";

// @from(Ln 378215, Col 0)

// @from(Ln 378215, Col 0)
import {
    dirname as jBY,
    join as JBY
} from "path";

// @from(Ln 378565, Col 0)

// @from(Ln 378565, Col 0)
import {
    basename as WBY
} from "path";

// @from(Ln 379116, Col 0)

// @from(Ln 379116, Col 0)
import {
    dirname as yBY,
    resolve as LBY
} from "path";

// @from(Ln 379120, Col 0)

// @from(Ln 379120, Col 0)
import {
    stat as RBY
} from "fs/promises";

// @from(Ln 379177, Col 0)

// @from(Ln 379177, Col 0)
import {
    dirname as hBY,
    basename as SBY,
    join as P5q,
    sep as Jy1
} from "path";

// @from(Ln 379729, Col 0)

// @from(Ln 379729, Col 0)
N1(V5q, {
    call: () => dBY
});

// @from(Ln 379852, Col 0)

// @from(Ln 379852, Col 0)
N1(h5q, {
    call: () => rBY
});

// @from(Ln 380025, Col 0)

// @from(Ln 380025, Col 0)
import {
    readFile as aBY
} from "fs/promises";

// @from(Ln 380425, Col 0)

// @from(Ln 380425, Col 0)
N1(Q5q, {
    renderFeedbackComponent: () => p5q,
    call: () => KgY
});

// @from(Ln 381641, Col 0)

// @from(Ln 381641, Col 0)
N1(DQ8, {
    default: () => BgY,
    FileIndex: () => mgY
});

// @from(Ln 381656, Col 0)

// @from(Ln 381656, Col 0)
import * as OD from "path";

// @from(Ln 382022, Col 0)

// @from(Ln 382022, Col 0)
import {
    join as rgY
} from "path";

// @from(Ln 382242, Col 0)

// @from(Ln 382242, Col 0)
N1(kQ8, {
    clearSessionCaches: () => VQ8
});

// @from(Ln 382281, Col 0)

// @from(Ln 382281, Col 0)
N1(T3q, {
    clearConversation: () => EQ8
});

// @from(Ln 382284, Col 0)

// @from(Ln 382284, Col 0)
import {
    randomUUID as YFY
} from "crypto";

// @from(Ln 382375, Col 0)

// @from(Ln 382375, Col 0)
N1(v3q, {
    call: () => zFY
});

// @from(Ln 382404, Col 0)

// @from(Ln 382404, Col 0)
N1(k3q, {
    call: () => OFY
});

// @from(Ln 382498, Col 0)

// @from(Ln 382498, Col 0)
import {
    join as jFY,
    relative as JFY,
    sep as MFY
} from "path";

// @from(Ln 382503, Col 0)

// @from(Ln 382503, Col 0)
import {
    createHash as DFY
} from "crypto";

// @from(Ln 382506, Col 0)

// @from(Ln 382506, Col 0)
import {
    readdir as XFY,
    readFile as S3q,
    mkdir as PFY,
    writeFile as WFY,
    stat as ZFY
} from "fs/promises";

// @from(Ln 383177, Col 0)

// @from(Ln 383177, Col 0)
N1(FQ8, {
    stopTeamMemoryWatcher: () => m3q,
    startTeamMemoryWatcher: () => SFY,
    notifyTeamMemoryWrite: () => CFY,
    _resetWatcherStateForTesting: () => IFY
});

// @from(Ln 383299, Col 0)

// @from(Ln 383299, Col 0)
N1(Q3q, {
    registerSessionFileAccessHooks: () => xFY,
    isMemoryFileAccess: () => UQ8
});

// @from(Ln 383475, Col 0)

// @from(Ln 383475, Col 0)
import {
    readFile as uFY,
    stat as mFY
} from "fs/promises";

// @from(Ln 383732, Col 0)

// @from(Ln 383732, Col 0)
N1(e3q, {
    fileExtension: () => s3q,
    call: () => ApY
});

// @from(Ln 383736, Col 0)

// @from(Ln 383736, Col 0)
import {
    mkdir as lFY,
    writeFile as iFY
} from "fs/promises";

// @from(Ln 383740, Col 0)

// @from(Ln 383740, Col 0)
import {
    tmpdir as nFY
} from "os";

// @from(Ln 383743, Col 0)

// @from(Ln 383743, Col 0)
import {
    join as o3q
} from "path";

// @from(Ln 384068, Col 0)

// @from(Ln 384068, Col 0)
import {
    join as KpY
} from "path";

// @from(Ln 384071, Col 0)

// @from(Ln 384071, Col 0)
import {
    readdir as YpY
} from "fs/promises";

// @from(Ln 384343, Col 0)

// @from(Ln 384343, Col 0)
N1($9q, {
    call: () => JpY
});

// @from(Ln 384499, Col 0)

// @from(Ln 384499, Col 0)
N1(f9q, {
    call: () => PpY
});

// @from(Ln 385074, Col 0)

// @from(Ln 385074, Col 0)
N1(hy1, {
    isBridgeEnabledBlocking: () => Kn6,
    isBridgeEnabled: () => dl,
    checkBridgeMinVersion: () => Yn6
});

// @from(Ln 385710, Col 0)

// @from(Ln 385710, Col 0)
N1(I9q, {
    ClaudeMdExternalIncludesDialog: () => eQ8
});

// @from(Ln 387868, Col 0)

// @from(Ln 387868, Col 0)
N1(r9q, {
    call: () => lpY
});

// @from(Ln 388463, Col 0)

// @from(Ln 388463, Col 0)
import {
    PassThrough as LQY
} from "stream";

// @from(Ln 388522, Col 0)

// @from(Ln 388522, Col 0)
N1(jYq, {
    call: () => IQY
});

// @from(Ln 388554, Col 0)

// @from(Ln 388554, Col 0)
N1(MYq, {
    call: () => xQY
});

// @from(Ln 388735, Col 0)

// @from(Ln 388735, Col 0)
N1(ZYq, {
    call: () => mQY
});

// @from(Ln 389139, Col 0)

// @from(Ln 389139, Col 0)
import {
    resolve as lQY
} from "path";

// @from(Ln 389347, Col 0)

// @from(Ln 389347, Col 0)
N1(SYq, {
    DiffDialog: () => nQY
});

// @from(Ln 389621, Col 0)

// @from(Ln 389621, Col 0)
N1(IYq, {
    call: () => aQY
});

// @from(Ln 390506, Col 0)

// @from(Ln 390506, Col 0)
N1(tYq, {
    Doctor: () => GU8
});

// @from(Ln 390509, Col 0)

// @from(Ln 390509, Col 0)
import {
    join as ZU8
} from "path";

// @from(Ln 390963, Col 0)

// @from(Ln 390963, Col 0)
N1(Azq, {
    call: () => cUY
});

// @from(Ln 390989, Col 0)

// @from(Ln 390989, Col 0)
import {
    basename as iUY
} from "path";

// @from(Ln 391015, Col 0)

// @from(Ln 391015, Col 0)
import {
    join as oUY
} from "path";

// @from(Ln 391018, Col 0)

// @from(Ln 391018, Col 0)
import {
    tmpdir as aUY
} from "os";

// @from(Ln 391021, Col 0)

// @from(Ln 391021, Col 0)
import {
    createHash as sUY,
    randomUUID as tUY
} from "crypto";

// @from(Ln 391157, Col 0)

// @from(Ln 391157, Col 0)
import {
    mkdir as zdY
} from "fs/promises";

// @from(Ln 391160, Col 0)

// @from(Ln 391160, Col 0)
import {
    join as Ozq
} from "path";

// @from(Ln 391379, Col 0)

// @from(Ln 391379, Col 0)
import {
    homedir as jdY
} from "os";

// @from(Ln 391382, Col 0)

// @from(Ln 391382, Col 0)
import {
    relative as JdY
} from "path";

// @from(Ln 391402, Col 0)

// @from(Ln 391402, Col 0)
N1(Dzq, {
    call: () => WdY
});

// @from(Ln 391405, Col 0)

// @from(Ln 391405, Col 0)
import {
    mkdir as DdY,
    writeFile as XdY
} from "fs/promises";

// @from(Ln 391947, Col 0)

// @from(Ln 391947, Col 0)
N1(Vzq, {
    call: () => vdY
});

// @from(Ln 392101, Col 0)

// @from(Ln 392101, Col 0)
N1(Izq, {
    formatWorkspaceFolders: () => yU8,
    call: () => xdY
});

// @from(Ln 392105, Col 0)

// @from(Ln 392105, Col 0)
import * as Czq from "path";

// @from(Ln 392903, Col 0)

// @from(Ln 392903, Col 0)
N1(Uzq, {
    call: () => ldY
});

// @from(Ln 392906, Col 0)

// @from(Ln 392906, Col 0)
import {
    stat as QdY,
    writeFile as UdY,
    mkdir as ddY
} from "fs/promises";

// @from(Ln 392911, Col 0)

// @from(Ln 392911, Col 0)
import {
    dirname as cdY
} from "path";

// @from(Ln 394062, Col 0)

// @from(Ln 394062, Col 0)
import {
    isDeepStrictEqual as k_q
} from "node:util";

// @from(Ln 394760, Col 0)

// @from(Ln 394760, Col 0)
N1(g_q, {
    call: () => YcY
});

// @from(Ln 395272, Col 0)

// @from(Ln 395272, Col 0)
N1(d_q, {
    call: () => _cY
});

// @from(Ln 396016, Col 0)

// @from(Ln 396016, Col 0)
import {
    createServer as uU8
} from "http";

// @from(Ln 396019, Col 0)

// @from(Ln 396019, Col 0)
import {
    parse as LlY
} from "url";

// @from(Ln 396022, Col 0)

// @from(Ln 396022, Col 0)
import {
    createHash as RlY,
    randomBytes as hlY
} from "crypto";

// @from(Ln 396026, Col 0)

// @from(Ln 396026, Col 0)
import {
    mkdir as SlY
} from "fs/promises";

// @from(Ln 396029, Col 0)

// @from(Ln 396029, Col 0)
import {
    join as ClY
} from "path";

// @from(Ln 399363, Col 0)

// @from(Ln 399363, Col 0)
N1(Jwq, {
    settingSourceToScope: () => TiY,
    isPersistableScope: () => fiY,
    installSelectedPlugins: () => tU8,
    getPluginEditableScopes: () => T16,
    getInstalledPlugins: () => EL1,
    findMissingPlugins: () => viY,
    checkEnabledPlugins: () => sU8
});

// @from(Ln 399372, Col 0)

// @from(Ln 399372, Col 0)
import {
    join as GiY
} from "path";

// @from(Ln 399536, Col 0)

// @from(Ln 399536, Col 0)
import {
    resolve as NiY
} from "path";

// @from(Ln 399539, Col 0)

// @from(Ln 399539, Col 0)
import {
    homedir as ViY
} from "os";

// @from(Ln 399777, Col 0)

// @from(Ln 399777, Col 0)
import {
    join as Xwq,
    dirname as kiY
} from "path";

// @from(Ln 401146, Col 0)

// @from(Ln 401146, Col 0)
import {
    join as xiY
} from "path";

// @from(Ln 401149, Col 0)

// @from(Ln 401149, Col 0)
import {
    randomBytes as uiY
} from "crypto";

// @from(Ln 401152, Col 0)

// @from(Ln 401152, Col 0)
import {
    readFile as miY,
    writeFile as BiY,
    rename as giY,
    unlink as FiY
} from "fs/promises";

// @from(Ln 402876, Col 0)

// @from(Ln 402876, Col 0)
import {
    join as eiY
} from "path";

// @from(Ln 402879, Col 0)

// @from(Ln 402879, Col 0)
import {
    randomBytes as AnY
} from "crypto";

// @from(Ln 402882, Col 0)

// @from(Ln 402882, Col 0)
import {
    readFile as qnY,
    writeFile as KnY,
    rename as YnY,
    unlink as znY
} from "fs/promises";

// @from(Ln 402992, Col 0)

// @from(Ln 402992, Col 0)
import {
    join as $nY
} from "path";

// @from(Ln 402995, Col 0)

// @from(Ln 402995, Col 0)
import {
    randomBytes as HnY
} from "crypto";

// @from(Ln 402998, Col 0)

// @from(Ln 402998, Col 0)
import {
    readFile as pwq,
    rename as jnY,
    unlink as JnY,
    writeFile as MnY
} from "fs/promises";

// @from(Ln 403166, Col 0)

// @from(Ln 403166, Col 0)
import * as J_6 from "fs/promises";

// @from(Ln 403167, Col 0)

// @from(Ln 403167, Col 0)
import * as rv6 from "path";

// @from(Ln 404597, Col 0)

// @from(Ln 404597, Col 0)
import {
    readFile as Jd8,
    stat as ynY
} from "fs/promises";

// @from(Ln 404601, Col 0)

// @from(Ln 404601, Col 0)
import * as Eh from "path";

// @from(Ln 405852, Col 0)

// @from(Ln 405852, Col 0)
N1(AOq, {
    call: () => enY
});

// @from(Ln 408741, Col 0)

// @from(Ln 408741, Col 0)
N1(HHq, {
    call: () => OtY
});

// @from(Ln 408990, Col 0)

// @from(Ln 408990, Col 0)
import {
    join as HtY,
    dirname as WHq
} from "path";

// @from(Ln 408994, Col 0)

// @from(Ln 408994, Col 0)
import {
    writeFile as ZHq,
    mkdir as GHq,
    readFile as jtY
} from "fs/promises";

// @from(Ln 409146, Col 0)

// @from(Ln 409146, Col 0)
N1(EHq, {
    call: () => DtY
});

// @from(Ln 409262, Col 0)

// @from(Ln 409262, Col 0)
N1(dn6, {
    updateBridgeSessionTitle: () => Gc8,
    getBridgeSession: () => WtY,
    createBridgeSession: () => Wc8,
    archiveBridgeSession: () => Zc8
});

// @from(Ln 409519, Col 0)

// @from(Ln 409519, Col 0)
N1(bHq, {
    call: () => ZtY
});

// @from(Ln 409750, Col 0)

// @from(Ln 409750, Col 0)
import {
    sep as vtY
} from "path";

// @from(Ln 409906, Col 0)

// @from(Ln 409906, Col 0)
import {
    relative as VtY
} from "path";

// @from(Ln 410886, Col 0)

// @from(Ln 410886, Col 0)
import {
    homedir as UtY
} from "os";

// @from(Ln 413843, Col 0)

// @from(Ln 413843, Col 0)
N1(OJq, {
    filterResumableSessions: () => wJq,
    call: () => A6z
});

// @from(Ln 414108, Col 0)

// @from(Ln 414108, Col 0)
N1(JJq, {
    call: () => O6z
});

// @from(Ln 414413, Col 0)

// @from(Ln 414413, Col 0)
N1(GJq, {
    call: () => X6z
});

// @from(Ln 414442, Col 0)

// @from(Ln 414442, Col 0)
N1(NJq, {
    call: () => W6z
});

// @from(Ln 414782, Col 0)

// @from(Ln 414782, Col 0)
import {
    randomUUID as k6z
} from "crypto";

// @from(Ln 416140, Col 0)

// @from(Ln 416140, Col 0)
N1(lJq, {
    call: () => C6z
});

// @from(Ln 416413, Col 0)

// @from(Ln 416413, Col 0)
N1(qMq, {
    call: () => x6z
});

// @from(Ln 416442, Col 0)

// @from(Ln 416442, Col 0)
N1(zMq, {
    call: () => m6z
});

// @from(Ln 416502, Col 0)

// @from(Ln 416502, Col 0)
N1(OMq, {
    call: () => g6z
});

// @from(Ln 416538, Col 0)

// @from(Ln 416538, Col 0)
N1(MMq, {
    playAnimation: () => xR1,
    call: () => a6z
});

// @from(Ln 416542, Col 0)

// @from(Ln 416542, Col 0)
import {
    join as bR1
} from "path";

// @from(Ln 416904, Col 0)

// @from(Ln 416904, Col 0)
N1(WMq, {
    call: () => A1z
});

// @from(Ln 416907, Col 0)

// @from(Ln 416907, Col 0)
import {
    join as PMq
} from "path";

// @from(Ln 418089, Col 0)

// @from(Ln 418089, Col 0)
N1(CMq, {
    call: () => D1z
});

// @from(Ln 418117, Col 0)

// @from(Ln 418117, Col 0)
N1(uMq, {
    call: () => W1z
});

// @from(Ln 418278, Col 0)

// @from(Ln 418278, Col 0)
N1(pMq, {
    call: () => V1z,
    FastModePicker: () => BR1
});

// @from(Ln 418645, Col 0)

// @from(Ln 418645, Col 0)
N1(lMq, {
    call: () => E1z
});

// @from(Ln 418697, Col 0)

// @from(Ln 418697, Col 0)
N1(oMq, {
    PrivacySettingsDialog: () => Zl8,
    GroveDialog: () => Wl8
});

// @from(Ln 419053, Col 0)

// @from(Ln 419053, Col 0)
N1(sMq, {
    call: () => C1z
});

// @from(Ln 420170, Col 0)

// @from(Ln 420170, Col 0)
N1(PDq, {
    call: () => n1z
});

// @from(Ln 420203, Col 0)

// @from(Ln 420203, Col 0)
N1(fDq, {
    call: () => a1z
});

// @from(Ln 420206, Col 0)

// @from(Ln 420206, Col 0)
import {
    relative as o1z
} from "path";

// @from(Ln 420242, Col 0)

// @from(Ln 420242, Col 0)
N1(kDq, {
    deriveFirstPrompt: () => VDq,
    call: () => z8z
});

// @from(Ln 420246, Col 0)

// @from(Ln 420246, Col 0)
import {
    randomUUID as t1z
} from "crypto";

// @from(Ln 420249, Col 0)

// @from(Ln 420249, Col 0)
import {
    readFile as e1z,
    mkdir as A8z,
    writeFile as q8z
} from "fs/promises";

// @from(Ln 420476, Col 0)

// @from(Ln 420476, Col 0)
import {
    join as zi
} from "path";

// @from(Ln 420479, Col 0)

// @from(Ln 420479, Col 0)
import {
    mkdir as w8z,
    open as O8z,
    unlink as $8z,
    stat as H8z
} from "fs/promises";

// @from(Ln 423899, Col 0)

// @from(Ln 423899, Col 0)
N1(yXq, {
    call: () => s8z
});

// @from(Ln 423931, Col 0)

// @from(Ln 423931, Col 0)
N1(SXq, {
    call: () => e8z
});

// @from(Ln 424043, Col 0)

// @from(Ln 424043, Col 0)
N1(mXq, {
    call: () => KAz
});

// @from(Ln 424079, Col 0)

// @from(Ln 424079, Col 0)
N1(pXq, {
    call: () => zAz
});

// @from(Ln 424103, Col 0)

// @from(Ln 424103, Col 0)
import {
    createWriteStream as wAz,
    writeFileSync as OAz
} from "fs";

// @from(Ln 424107, Col 0)

// @from(Ln 424107, Col 0)
import {
    readdir as $Az,
    readFile as HAz,
    writeFile as jAz
} from "fs/promises";

// @from(Ln 424112, Col 0)

// @from(Ln 424112, Col 0)
import {
    join as dXq
} from "path";

// @from(Ln 424115, Col 0)

// @from(Ln 424115, Col 0)
import {
    pipeline as JAz
} from "stream/promises";

// @from(Ln 424118, Col 0)

// @from(Ln 424118, Col 0)
import {
    getHeapSnapshot as MAz,
    getHeapSpaceStatistics as DAz,
    getHeapStatistics as XAz
} from "v8";

// @from(Ln 424271, Col 0)

// @from(Ln 424271, Col 0)
N1(nXq, {
    call: () => ZAz
});

// @from(Ln 424359, Col 0)

// @from(Ln 424359, Col 0)
N1(APq, {
    DEFAULT_SESSION_TIMEOUT_MS: () => Bl8,
    BRIDGE_LOGIN_INSTRUCTION: () => NN6,
    BRIDGE_LOGIN_ERROR: () => gl8
});

// @from(Ln 425303, Col 0)

// @from(Ln 425303, Col 0)
N1(kPq, {
    call: () => IAz
});

// @from(Ln 425306, Col 0)

// @from(Ln 425306, Col 0)
import * as NPq from "path";

// @from(Ln 425391, Col 0)

// @from(Ln 425391, Col 0)
import {
    readdir as RPq
} from "fs/promises";

// @from(Ln 425394, Col 0)

// @from(Ln 425394, Col 0)
import {
    join as xAz
} from "path";

// @from(Ln 425445, Col 0)

// @from(Ln 425445, Col 0)
import {
    chmod as gAz,
    mkdir as xPq,
    readFile as uPq,
    writeFile as mPq
} from "fs/promises";

// @from(Ln 425451, Col 0)

// @from(Ln 425451, Col 0)
import {
    homedir as FAz
} from "os";

// @from(Ln 425454, Col 0)

// @from(Ln 425454, Col 0)
import {
    join as $i
} from "path";

// @from(Ln 425457, Col 0)

// @from(Ln 425457, Col 0)
import {
    fileURLToPath as pAz
} from "url";

// @from(Ln 425631, Col 0)

// @from(Ln 425631, Col 0)
N1(BPq, {
    call: () => A7z
});

// @from(Ln 425864, Col 0)

// @from(Ln 425864, Col 0)
N1(QPq, {
    call: () => K7z
});

// @from(Ln 425895, Col 0)

// @from(Ln 425895, Col 0)
import {
    constants as _h1
} from "fs";

// @from(Ln 425898, Col 0)

// @from(Ln 425898, Col 0)
import {
    mkdir as z7z,
    open as _7z
} from "fs/promises";

// @from(Ln 425902, Col 0)

// @from(Ln 425902, Col 0)
import {
    join as cPq,
    dirname as w7z,
    normalize as O7z,
    isAbsolute as $7z,
    sep as H7z
} from "path";

// @from(Ln 426211, Col 0)

// @from(Ln 426211, Col 0)
N1(ePq, {
    call: () => v7z
});

// @from(Ln 426251, Col 0)

// @from(Ln 426251, Col 0)
import {
    join as V7z
} from "path";

// @from(Ln 426432, Col 0)

// @from(Ln 426432, Col 0)
N1($0q, {
    sanitizeFilename: () => O0q,
    extractFirstPrompt: () => w0q,
    call: () => R7z
});

// @from(Ln 426437, Col 0)

// @from(Ln 426437, Col 0)
import {
    join as E7z
} from "path";

// @from(Ln 426527, Col 0)

// @from(Ln 426527, Col 0)
N1(M0q, {
    call: () => d7z
});

// @from(Ln 426786, Col 0)

// @from(Ln 426786, Col 0)
N1(Z0q, {
    call: () => i7z
});

// @from(Ln 426967, Col 0)

// @from(Ln 426967, Col 0)
N1(v0q, {
    call: () => r7z
});

// @from(Ln 427273, Col 0)

// @from(Ln 427273, Col 0)
N1(R0q, {
    call: () => A4z
});

// @from(Ln 427305, Col 0)

// @from(Ln 427305, Col 0)
N1(I0q, {
    call: () => el8
});

// @from(Ln 427356, Col 0)

// @from(Ln 427356, Col 0)
N1(x0q, {
    call: () => Y4z
});

// @from(Ln 427521, Col 0)

// @from(Ln 427521, Col 0)
N1(F0q, {
    call: () => X4z
});

// @from(Ln 427714, Col 0)

// @from(Ln 427714, Col 0)
import {
    join as W4z
} from "path";

// @from(Ln 427717, Col 0)

// @from(Ln 427717, Col 0)
import {
    open as Z4z
} from "fs/promises";

// @from(Ln 427720, Col 0)

// @from(Ln 427720, Col 0)
import {
    randomBytes as G4z
} from "crypto";

// @from(Ln 427901, Col 0)

// @from(Ln 427901, Col 0)
import {
    open as T4z
} from "fs/promises";

// @from(Ln 427904, Col 0)

// @from(Ln 427904, Col 0)
import {
    basename as v4z,
    join as Xh1
} from "path";

// @from(Ln 429168, Col 0)

// @from(Ln 429168, Col 0)
import {
    dirname as HWq,
    join as Pi8
} from "path";

// @from(Ln 429172, Col 0)

// @from(Ln 429172, Col 0)
import {
    readFile as jWq,
    writeFile as n4z,
    unlink as r4z,
    mkdir as o4z
} from "fs/promises";

// @from(Ln 429178, Col 0)

// @from(Ln 429178, Col 0)
import {
    tmpdir as a4z
} from "os";

// @from(Ln 429181, Col 0)

// @from(Ln 429181, Col 0)
import {
    fileURLToPath as s4z
} from "url";

// @from(Ln 430177, Col 0)

// @from(Ln 430177, Col 0)
N1(vWq, {
    call: () => Vqz
});

// @from(Ln 430203, Col 0)

// @from(Ln 430203, Col 0)
import {
    join as Xi,
    extname as Eqz
} from "path";

// @from(Ln 430207, Col 0)

// @from(Ln 430207, Col 0)
import {
    readFile as yWq,
    readdir as yqz,
    unlink as Lqz,
    mkdir as fi8,
    writeFile as Ti8
} from "fs/promises";

// @from(Ln 432168, Col 0)

// @from(Ln 432168, Col 0)
N1(gWq, {
    default: () => $Kz
});

// @from(Ln 432293, Col 0)

// @from(Ln 432293, Col 0)
N1(UWq, {
    call: () => VKz
});

// @from(Ln 432595, Col 0)

// @from(Ln 432595, Col 0)
N1(lWq, {
    default: () => EKz
});

// @from(Ln 432623, Col 0)

// @from(Ln 432623, Col 0)
N1(nWq, {
    isVoiceStreamAvailable: () => ki8,
    connectVoiceStream: () => Ei8,
    FINALIZE_TIMEOUTS_MS: () => Vi8
});

// @from(Ln 432805, Col 0)

// @from(Ln 432805, Col 0)
import {
    basename as oWq
} from "path";

// @from(Ln 432845, Col 0)

// @from(Ln 432845, Col 0)
N1(AZq, {
    writeNativePlaybackData: () => uKz,
    stopNativeRecording: () => IKz,
    stopNativePlayback: () => mKz,
    startNativeRecording: () => CKz,
    startNativePlayback: () => xKz,
    microphoneAuthorizationStatus: () => gKz,
    isNativeRecordingActive: () => bKz,
    isNativePlaying: () => BKz,
    isNativeAudioAvailable: () => SKz
});

// @from(Ln 432928, Col 0)

// @from(Ln 432928, Col 0)
N1(hr6, {
    stopRecording: () => HZq,
    startRecording: () => $Zq,
    requestMicrophonePermission: () => dKz,
    preloadNativeAudio: () => pKz,
    checkVoiceDependencies: () => UKz,
    checkRecordingAvailability: () => cKz
});

// @from(Ln 432936, Col 0)

// @from(Ln 432936, Col 0)
import {
    spawn as zZq,
    spawnSync as FKz
} from "child_process";

// @from(Ln 433131, Col 0)

// @from(Ln 433131, Col 0)
N1(MZq, {
    useVoice: () => sKz,
    normalizeLanguageForSTT: () => Lh1,
    computeLevel: () => JZq
});

// @from(Ln 433523, Col 0)

// @from(Ln 433523, Col 0)
N1(DZq, {
    call: () => eKz
});

// @from(Ln 433626, Col 0)

// @from(Ln 433626, Col 0)
N1(PZq, {
    default: () => q5z
});

// @from(Ln 433845, Col 0)

// @from(Ln 433845, Col 0)
import {
    version as _5z,
    release as w5z
} from "os";

// @from(Ln 434748, Col 0)

// @from(Ln 434748, Col 0)
N1(mi8, {
    modelSupportsToolReference: () => Vi6,
    isToolSearchToolAvailable: () => bz6,
    isToolSearchEnabledOptimistic: () => dk,
    isToolSearchEnabled: () => yi6,
    isToolReferenceBlock: () => tb,
    isDeferredToolsDeltaEnabled: () => ki6,
    getToolSearchMode: () => Fi8,
    getDeferredToolsDelta: () => eF8,
    getAutoToolSearchCharThreshold: () => BZq,
    extractDiscoveredToolNames: () => zF
});

// @from(Ln 435900, Col 0)

// @from(Ln 435900, Col 0)
N1(KGq, {
    renderChromeToolResultMessage: () => qGq,
    getClaudeInChromeMCPToolOverrides: () => P3z
});

// @from(Ln 436083, Col 0)

// @from(Ln 436083, Col 0)
N1(zGq, {
    createLinkedTransportPair: () => Z3z
});

// @from(Ln 436113, Col 0)

// @from(Ln 436113, Col 0)
import {
    readFile as v3z,
    writeFile as N3z,
    unlink as V3z,
    mkdir as k3z
} from "fs/promises";

// @from(Ln 436119, Col 0)

// @from(Ln 436119, Col 0)
import {
    join as E3z,
    dirname as y3z
} from "path";

// @from(Ln 437933, Col 0)

// @from(Ln 437933, Col 0)
import {
    dirname as U3z,
    isAbsolute as jn8,
    sep as d3z
} from "path";

// @from(Ln 438304, Col 0)

// @from(Ln 438304, Col 0)
import {
    createHash as l3z
} from "crypto";

// @from(Ln 438675, Col 0)

// @from(Ln 438675, Col 0)
import {
    randomUUID as Dn8
} from "crypto";

// @from(Ln 440091, Col 0)

// @from(Ln 440091, Col 0)
import {
    randomBytes as J9z
} from "crypto";

// @from(Ln 440970, Col 0)

// @from(Ln 440970, Col 0)
import {
    link as C9z,
    copyFile as I9z,
    readFile as b9z,
    stat as x9z,
    truncate as u9z
} from "fs/promises";

// @from(Ln 443681, Col 0)

// @from(Ln 443681, Col 0)
N1(dfq, {
    isAutoModeAllowlistedTool: () => RYz,
    getClassifierDecision: () => hYz
});

// @from(Ln 444290, Col 0)

// @from(Ln 444290, Col 0)
N1(y1q, {
    verifyAutoModeGateAccess: () => Dc6,
    transitionPermissionMode: () => ki,
    stripDangerousPermissionsForAutoMode: () => Vi,
    shouldDisableBypassPermissions: () => bv1,
    restoreDangerousPermissions: () => x_6,
    removeDangerousPermissions: () => YTq,
    prepareContextForPlanMode: () => LT6,
    parseToolListFromCLI: () => Kh,
    parseBaseToolsFromCLI: () => zTq,
    isOverlyBroadBashAllowRule: () => gn8,
    isOrgAllowlistedForDAC: () => QYz,
    isDefaultPermissionModeAuto: () => KS1,
    isDangerousTaskPermission: () => ATq,
    isDangerousBashPermission: () => efq,
    isBypassPermissionsModeDisabled: () => bd,
    isAutoModeGateEnabled: () => IN,
    initializeToolPermissionContext: () => Qn8,
    initialPermissionModeFromCLI: () => pn8,
    hasAutoModeOptInAnySource: () => my1,
    getAutoModeUnavailableReason: () => dn8,
    getAutoModeUnavailableNotification: () => qS1,
    getAutoModeEnabledState: () => J16,
    findOverlyBroadBashPermissions: () => UYz,
    findDangerousClassifierPermissions: () => Fn8,
    createDisabledBypassPermissionsContext: () => X36,
    checkAndDisableBypassPermissions: () => cn8
});

// @from(Ln 444318, Col 0)

// @from(Ln 444318, Col 0)
import {
    relative as gYz
} from "path";

// @from(Ln 444321, Col 0)

// @from(Ln 444321, Col 0)
import {
    resolve as FYz
} from "path";

// @from(Ln 444891, Col 0)

// @from(Ln 444891, Col 0)
import {
    dirname as lYz,
    join as bN6,
    resolve as wTq,
    sep as iYz
} from "path";

// @from(Ln 444897, Col 0)

// @from(Ln 444897, Col 0)
import {
    readdir as nYz,
    readFile as rYz,
    stat as OTq,
    lstat as oYz,
    realpath as aYz
} from "fs/promises";

// @from(Ln 444904, Col 0)

// @from(Ln 444904, Col 0)
import {
    existsSync as nn8
} from "fs";

// @from(Ln 444907, Col 0)

// @from(Ln 444907, Col 0)
import {
    homedir as sYz
} from "os";

// @from(Ln 445132, Col 0)

// @from(Ln 445132, Col 0)
import {
    basename as qzz
} from "path";

// @from(Ln 445324, Col 0)

// @from(Ln 445324, Col 0)
import {
    randomUUID as SE
} from "crypto";

// @from(Ln 447908, Col 0)

// @from(Ln 447908, Col 0)
N1(YV8, {
    writeAgentMetadata: () => gc6,
    setSessionFileForTesting: () => czz,
    setRemoteIngressUrlForTesting: () => lzz,
    setInternalEventWriter: () => _r8,
    setInternalEventReader: () => wr8,
    setAgentTranscriptSubdir: () => px8,
    sessionIdExists: () => fU6,
    searchSessionsByCustomTitle: () => GF,
    saveTag: () => Oh1,
    saveMode: () => K_z,
    saveCustomTitle: () => X_6,
    saveAiGeneratedTitle: () => Xr8,
    saveAgentSetting: () => qo6,
    saveAgentName: () => fc8,
    saveAgentColor: () => Vy1,
    restoreSessionMetadata: () => LF,
    resetSessionFilePointer: () => Zh,
    resetProjectForTesting: () => dzz,
    resetProjectFlushStateForTesting: () => Uzz,
    removeTranscriptMessage: () => Or8,
    recordTranscript: () => _F,
    recordSidechainTranscript: () => dg,
    recordQueueOperation: () => kV8,
    recordFileHistorySnapshot: () => _l6,
    recordContextCollapseSnapshot: () => rzz,
    recordContextCollapseCommit: () => nzz,
    recordContentReplacement: () => pz6,
    recordAttributionSnapshot: () => izz,
    readAgentMetadata: () => Mm8,
    reAppendSessionMetadata: () => gE1,
    loadTranscriptFromFile: () => azz,
    loadTranscriptFile: () => u_6,
    loadSubagentTranscripts: () => JS1,
    loadSameRepoMessageLogsProgressive: () => Ko6,
    loadSameRepoMessageLogs: () => VR1,
    loadMessageLogs: () => OR1,
    loadFullLog: () => hb,
    loadAllSubagentTranscriptsFromDisk: () => AQ8,
    loadAllProjectsMessageLogsProgressive: () => jS1,
    loadAllProjectsMessageLogs: () => cc8,
    loadAllLogsFromSessionFile: () => yh1,
    linkSessionToPR: () => q_z,
    isTranscriptMessage: () => Wl,
    isLoggableMessage: () => MS1,
    isLiteLog: () => Hh,
    isEphemeralToolProgress: () => er6,
    isCustomTitleEnabled: () => Ki,
    hydrateRemoteSession: () => Hr8,
    hydrateFromCCRv2InternalEvents: () => jr8,
    getUserType: () => zr8,
    getTranscriptPathForSession: () => cf,
    getTranscriptPath: () => Cz,
    getSessionIdFromLog: () => n_,
    getSessionFilesWithMtime: () => yr6,
    getSessionFilesLite: () => uN6,
    getProjectsDir: () => sb,
    getProjectDir: () => mj,
    getNodeEnv: () => CTq,
    getLogByIndex: () => iu8,
    getLastSessionLog: () => Hl6,
    getFirstMeaningfulUserMessageTextContent: () => Yr6,
    getCurrentSessionTitle: () => ek,
    getCurrentSessionTag: () => ol8,
    getCurrentSessionAgentColor: () => Pr8,
    getAgentTranscriptPath: () => L0,
    getAgentTranscript: () => hf6,
    flushSessionStorage: () => jF,
    findUnresolvedToolUse: () => fr8,
    fetchLogs: () => bTq,
    extractTeammateTranscriptsFromTasks: () => ep8,
    extractAgentIdsFromMessages: () => Gr8,
    enrichLogs: () => m_6,
    doesMessageExistInSession: () => Zr8,
    clearSessionMetadata: () => ai6,
    clearSessionMessagesCache: () => Hp8,
    clearAgentTranscriptSubdir: () => Qx8,
    cacheSessionTitle: () => Wr8,
    adoptResumedSessionFile: () => $r8
});

// @from(Ln 447988, Col 0)

// @from(Ln 447988, Col 0)
import {
    join as uN,
    basename as xzz,
    dirname as zS1
} from "path";

// @from(Ln 447993, Col 0)

// @from(Ln 447993, Col 0)
import {
    openSync as uzz,
    fstatSync as mzz,
    readSync as Bzz,
    closeSync as gzz
} from "fs";

// @from(Ln 447999, Col 0)

// @from(Ln 447999, Col 0)
import {
    appendFile as kTq,
    mkdir as sr6,
    open as Fzz,
    readFile as _S1,
    readdir as wS1,
    stat as RTq,
    writeFile as tr6
} from "fs/promises";

// @from(Ln 450219, Col 0)

// @from(Ln 450219, Col 0)
import {
    randomUUID as J_z
} from "crypto";

// @from(Ln 450369, Col 0)

// @from(Ln 450369, Col 0)
import {
    randomUUID as dTq
} from "crypto";

// @from(Ln 450553, Col 0)

// @from(Ln 450553, Col 0)
import {
    lookup as M_z
} from "dns";

// @from(Ln 450556, Col 0)

// @from(Ln 450556, Col 0)
import {
    isIP as rTq
} from "net";

// @from(Ln 450804, Col 0)

// @from(Ln 450804, Col 0)
N1(PR8, {
    hasWorktreeCreateHook: () => iN1,
    hasInstructionsLoadedHook: () => WF6,
    hasBlockingResult: () => QN6,
    getUserPromptSubmitHookBlockingMessage: () => Er8,
    getTeammateIdleHookMessage: () => yp8,
    getTaskCompletedHookMessage: () => $i6,
    getStopHookMessage: () => Ep8,
    getSessionEndHookTimeoutMs: () => LQ8,
    getPreToolHookBlockingMessage: () => yF8,
    getMatchingHooks: () => kr8,
    executeWorktreeRemoveHook: () => rN1,
    executeWorktreeCreateHook: () => nN1,
    executeUserPromptSubmitHooks: () => yr8,
    executeTeammateIdleHooks: () => Rp8,
    executeTaskCompletedHooks: () => Hi6,
    executeSubagentStartHooks: () => Ux8,
    executeStopHooks: () => Lp8,
    executeStatusLineCommand: () => Lr8,
    executeSetupHooks: () => Uu8,
    executeSessionStartHooks: () => Qu8,
    executeSessionEndHooks: () => RQ8,
    executePreToolHooks: () => LF8,
    executePreCompactHooks: () => sT6,
    executePostToolUseFailureHooks: () => hF8,
    executePostToolHooks: () => RF8,
    executePostCompactHooks: () => FE1,
    executePermissionRequestHooks: () => b_6,
    executeNotificationHooks: () => Xm,
    executeInstructionsLoadedHooks: () => ZF6,
    executeFileSuggestionCommand: () => vQ8,
    executeElicitationResultHooks: () => q$8,
    executeElicitationHooks: () => A$8,
    executeConfigChangeHooks: () => UN6,
    createBaseHookInput: () => $w
});

// @from(Ln 450840, Col 0)

// @from(Ln 450840, Col 0)
import {
    spawn as N_z
} from "node:child_process";

// @from(Ln 450843, Col 0)

// @from(Ln 450843, Col 0)
import {
    randomUUID as CE
} from "crypto";

// @from(Ln 453098, Col 0)

// @from(Ln 453098, Col 0)
import {
    userInfo as R_z
} from "os";

// @from(Ln 453126, Col 0)

// @from(Ln 453126, Col 0)
import {
    execFile as h_z
} from "child_process";

// @from(Ln 453129, Col 0)

// @from(Ln 453129, Col 0)
import {
    existsSync as S_z
} from "fs";

// @from(Ln 453207, Col 0)

// @from(Ln 453207, Col 0)
import {
    join as C_z
} from "path";

// @from(Ln 453357, Col 0)

// @from(Ln 453357, Col 0)
import * as g_6 from "path";

// @from(Ln 453358, Col 0)

// @from(Ln 453358, Col 0)
import {
    stat as x_z
} from "fs/promises";

// @from(Ln 453567, Col 0)

// @from(Ln 453567, Col 0)
import {
    dirname as yvq,
    join as $o6,
    resolve as wo6
} from "path";

// @from(Ln 454079, Col 0)

// @from(Ln 454079, Col 0)
N1(IHq, {
    resolveSkillModelOverride: () => Pl6,
    renderModelSetting: () => on6,
    renderModelName: () => qJ,
    renderDefaultModelSetting: () => Oi6,
    parseUserSpecifiedModel: () => H5,
    normalizeModelStringForAPI: () => lg,
    modelDisplayString: () => oR,
    isOpus1mMergeEnabled: () => pH,
    isNonCustomOpusModel: () => V36,
    isLegacyModelRemapEnabled: () => IS1,
    getUserSpecifiedModelSetting: () => uR,
    getSmallFastModel: () => lH,
    getRuntimeMainLoopModel: () => II,
    getPublicModelName: () => cQ8,
    getPublicModelDisplayName: () => ei6,
    getOpus46PricingSuffix: () => Il,
    getMarketingNameForModel: () => Cl,
    getMainLoopModel: () => cK,
    getDefaultSonnetModel: () => Ef,
    getDefaultOpusModel: () => GN,
    getDefaultMainLoopModelSetting: () => Mv,
    getDefaultMainLoopModel: () => g0,
    getDefaultHaikuModel: () => hT6,
    getClaudeAiUserDefaultModelDescription: () => Of6,
    getCanonicalName: () => IY,
    getBestModel: () => mvq,
    firstPartyNameToCanonical: () => Of
});

// @from(Ln 454567, Col 0)

// @from(Ln 454567, Col 0)
import {
    extname as O2z
} from "path";

// @from(Ln 455402, Col 0)

// @from(Ln 455402, Col 0)
import {
    randomUUID as L2z
} from "crypto";

// @from(Ln 455405, Col 0)

// @from(Ln 455405, Col 0)
import {
    writeFile as R2z,
    appendFile as h2z,
    unlink as ivq,
    readdir as S2z,
    mkdir as nvq
} from "fs/promises";

// @from(Ln 455412, Col 0)

// @from(Ln 455412, Col 0)
import * as FS1 from "path";

// @from(Ln 455794, Col 0)

// @from(Ln 455794, Col 0)
N1(KNq, {
    shutdown1PEventLogging: () => TU6,
    shouldSampleEvent: () => US1,
    reinitialize1PEventLoggingIfConfigChanged: () => F2z,
    logGrowthBookExperimentTo1P: () => nr8,
    logEventTo1P: () => Hv6,
    is1PEventLoggingEnabled: () => p_6,
    initialize1PEventLogging: () => qNq,
    getEventSamplingConfig: () => evq
});

// @from(Ln 455804, Col 0)

// @from(Ln 455804, Col 0)
import {
    randomUUID as svq
} from "crypto";

// @from(Ln 455981, Col 0)

// @from(Ln 455981, Col 0)
N1(HNq, {
    stopPeriodicGrowthBookRefresh: () => Ao8,
    setupPeriodicGrowthBookRefresh: () => $Nq,
    resetGrowthBook: () => Wo6,
    refreshGrowthBookFeatures: () => ONq,
    refreshGrowthBookAfterAuthChange: () => EY6,
    onGrowthBookRefresh: () => Hc6,
    initializeGrowthBook: () => Ri,
    hasGrowthBookEnvOverride: () => p2z,
    getFeatureValue_DEPRECATED: () => iS1,
    getFeatureValue_CACHED_WITH_REFRESH: () => lk,
    getFeatureValue_CACHED_MAY_BE_STALE: () => w8,
    getDynamicConfig_CACHED_MAY_BE_STALE: () => mf,
    getDynamicConfig_BLOCKS_ON_INIT: () => rR,
    getApiBaseUrlHost: () => _Nq,
    checkStatsigFeatureGate_CACHED_MAY_BE_STALE: () => jY,
    checkSecurityRestrictionGate: () => ln8,
    checkGate_CACHED_OR_BLOCKING: () => zn6
});

// @from(Ln 456385, Col 0)

// @from(Ln 456385, Col 0)
import {
    join as Bh,
    normalize as tN6,
    posix as K86,
    sep as sf
} from "path";

// @from(Ln 456391, Col 0)

// @from(Ln 456391, Col 0)
import {
    homedir as U2z,
    tmpdir as d2z
} from "os";

// @from(Ln 456395, Col 0)

// @from(Ln 456395, Col 0)
import {
    randomBytes as c2z
} from "crypto";

// @from(Ln 457092, Col 0)

// @from(Ln 457092, Col 0)
import {
    isAbsolute as Oo8,
    resolve as $o8,
    dirname as Kwz
} from "path";

// @from(Ln 457097, Col 0)

// @from(Ln 457097, Col 0)
import {
    homedir as ZNq
} from "os";

// @from(Ln 457294, Col 0)

// @from(Ln 457294, Col 0)
import {
    join as wwz
} from "path";

// @from(Ln 457321, Col 0)

// @from(Ln 457321, Col 0)
import {
    dirname as Hwz,
    isAbsolute as jwz,
    join as Jwz,
    normalize as vNq,
    relative as Mwz,
    sep as rS1
} from "path";

// @from(Ln 457418, Col 0)

// @from(Ln 457418, Col 0)
import {
    isAbsolute as jo8,
    resolve as Pwz,
    relative as yNq,
    sep as l_6,
    basename as oS1,
    dirname as Go6,
    extname as Jo8,
    join as i_6,
    normalize as Wwz
} from "path";

// @from(Ln 457429, Col 0)

// @from(Ln 457429, Col 0)
import {
    homedir as RNq
} from "os";

// @from(Ln 457432, Col 0)

// @from(Ln 457432, Col 0)
import {
    chmodSync as Zwz,
    writeFileSync as ENq
} from "fs";

// @from(Ln 457436, Col 0)

// @from(Ln 457436, Col 0)
import {
    stat as hNq,
    realpath as Gwz
} from "fs/promises";

// @from(Ln 457830, Col 0)

// @from(Ln 457830, Col 0)
N1(Vo6, {
    shouldSkipPluginAutoupdate: () => Qv6,
    setMockBillingAccessOverride: () => wA4,
    saveGlobalConfig: () => d1,
    saveCurrentProjectConfig: () => c2,
    resetTrustDialogAcceptedCacheForTesting: () => ywz,
    recordFirstStartTime: () => Go8,
    isProjectConfigKey: () => Rwz,
    isGlobalConfigKey: () => Ewz,
    isAutoUpdaterDisabled: () => CF,
    hasConsoleBillingAccess: () => No6,
    hasClaudeAiBillingAccess: () => fI,
    getUserClaudeRulesDir: () => gD1,
    getRemoteControlAtStartup: () => e66,
    getProjectPathForConfig: () => AC1,
    getOrCreateUserID: () => Jy,
    getOrCreateAnonymousId: () => CG1,
    getMemoryPath: () => PI,
    getManagedClaudeRulesDir: () => BD1,
    getGlobalConfigWriteCount: () => hwz,
    getGlobalConfig: () => X1,
    getCustomApiKeyStatus: () => To6,
    getCurrentProjectConfig: () => d2,
    getAutoUpdaterDisabledReason: () => hY6,
    enableConfigs: () => vo6,
    checkHasTrustDialogAccepted: () => l_,
    _wouldLoseAuthStateForTesting: () => xwz,
    _setGlobalConfigCacheForTesting: () => uwz,
    _getConfigForTesting: () => bwz,
    PROJECT_CONFIG_KEYS: () => gNq,
    NOTIFICATION_CHANNELS: () => ek1,
    GLOBAL_CONFIG_KEYS: () => BNq,
    EDITOR_MODES: () => AE1,
    DEFAULT_GLOBAL_CONFIG: () => Kx,
    CONFIG_WRITE_DISPLAY_THRESHOLD: () => Swz
});

// @from(Ln 457866, Col 0)

// @from(Ln 457866, Col 0)
import {
    resolve as uNq,
    dirname as sS1,
    join as tf,
    basename as Po8
} from "path";

// @from(Ln 457872, Col 0)

// @from(Ln 457872, Col 0)
import {
    randomBytes as Nwz,
    randomUUID as Vwz
} from "crypto";

// @from(Ln 458629, Col 0)

// @from(Ln 458629, Col 0)
N1(S16, {
    validateForceLoginOrg: () => Yl,
    saveOAuthTokensIfNeeded: () => $f6,
    saveApiKey: () => By8,
    removeApiKey: () => Vb8,
    refreshGcpCredentialsIfNeeded: () => sg6,
    refreshGcpAuth: () => aNq,
    refreshAwsAuth: () => rNq,
    refreshAndGetAwsCredentials: () => To,
    prefetchGcpCredentialsIfSafe: () => ho8,
    prefetchAwsCredentialsAndBedRockInfoIfSafe: () => So8,
    prefetchApiKeyFromApiKeyHelperIfSafe: () => yo8,
    isUsing3PServices: () => uI,
    isTeamSubscriber: () => Ix6,
    isTeamPremiumSubscriber: () => t66,
    isProSubscriber: () => LC,
    isOverageProvisioningAllowed: () => U06,
    isOtelHeadersHelperFromProjectOrLocalSettings: () => eNq,
    isMaxSubscriber: () => RL,
    isGcpAuthRefreshFromProjectSettings: () => Ro8,
    isEnterpriseSubscriber: () => awz,
    isCustomApiKeyApproved: () => nwz,
    isConsumerSubscriber: () => vU6,
    isClaudeAISubscriber: () => iA,
    isAwsCredentialExportFromProjectSettings: () => Eo8,
    isAwsAuthRefreshFromProjectSettings: () => Vo8,
    isAnthropicAuthEnabled: () => iH,
    is1PApiCustomer: () => fb8,
    hasProfileScope: () => XG,
    hasOpusAccess: () => owz,
    hasAnthropicApiKeyAuth: () => RU8,
    handleOAuth401Error: () => DG,
    getSubscriptionType: () => CK,
    getSubscriptionName: () => $R1,
    getRateLimitTier: () => ox,
    getOtelHeadersFromHelper: () => Tb8,
    getOauthAccountInfo: () => L3,
    getClaudeAIOAuthTokensAsync: () => Eo6,
    getClaudeAIOAuthTokens: () => sA,
    getAuthTokenSource: () => aR,
    getApiKeyFromConfigOrMacOSKeychain: () => ON6,
    getApiKeyFromApiKeyHelper: () => v06,
    getAnthropicApiKeyWithSource: () => s2,
    getAnthropicApiKey: () => RV,
    getAccountInformation: () => _c6,
    clearOAuthTokenCache: () => Cv1,
    clearGcpCredentialsCache: () => aF6,
    clearAwsCredentialsCache: () => oF6,
    clearApiKeyHelperCache: () => rF6,
    checkGcpCredentialsValid: () => oNq,
    checkAndRefreshOAuthTokenIfNeeded: () => dz,
    calculateApiKeyHelperTTL: () => nNq
});

// @from(Ln 458682, Col 0)

// @from(Ln 458682, Col 0)
import {
    mkdir as mwz
} from "fs/promises";

// @from(Ln 458685, Col 0)

// @from(Ln 458685, Col 0)
import {
    exec as lNq
} from "child_process";

// @from(Ln 459533, Col 0)

// @from(Ln 459533, Col 0)
N1(_Vq, {
    initializeAnalyticsSink: () => o_6,
    initializeAnalyticsGates: () => bo8
});

// @from(Ln 459603, Col 0)

// @from(Ln 459603, Col 0)
N1(_n8, {
    runClaudeInChromeMcpServer: () => OOz,
    createChromeContext: () => wVq
});

// @from(Ln 459607, Col 0)

// @from(Ln 459607, Col 0)
import {
    format as Ro6
} from "util";

// @from(Ln 459741, Col 0)

// @from(Ln 459741, Col 0)
N1(DVq, {
    sendChromeMessage: () => a_6,
    runChromeNativeHost: () => POz
});

// @from(Ln 459745, Col 0)

// @from(Ln 459745, Col 0)
import {
    createServer as $Oz
} from "net";

// @from(Ln 459748, Col 0)

// @from(Ln 459748, Col 0)
import {
    platform as xo8
} from "os";

// @from(Ln 459751, Col 0)

// @from(Ln 459751, Col 0)
import {
    join as HOz
} from "path";

// @from(Ln 459754, Col 0)

// @from(Ln 459754, Col 0)
import {
    appendFile as jOz,
    chmod as $Vq,
    mkdir as JOz,
    readdir as HVq,
    rmdir as MOz,
    stat as DOz,
    unlink as uo8
} from "fs/promises";

// @from(Ln 460043, Col 0)

// @from(Ln 460043, Col 0)
import {
    spawn as ZOz
} from "child_process";

// @from(Ln 460046, Col 0)

// @from(Ln 460046, Col 0)
import {
    createInterface as WVq
} from "readline";

// @from(Ln 460049, Col 0)

// @from(Ln 460049, Col 0)
import {
    createWriteStream as GOz
} from "fs";

// @from(Ln 460052, Col 0)

// @from(Ln 460052, Col 0)
import {
    tmpdir as fOz
} from "os";

// @from(Ln 460055, Col 0)

// @from(Ln 460055, Col 0)
import {
    join as ZVq,
    dirname as TOz
} from "path";

// @from(Ln 460799, Col 0)

// @from(Ln 460799, Col 0)
N1(So6, {
    writeBridgePointer: () => pOz,
    readBridgePointerAcrossWorktrees: () => QOz,
    readBridgePointer: () => go8,
    getBridgePointerPath: () => XC1,
    clearBridgePointer: () => Fo8,
    BRIDGE_POINTER_TTL_MS: () => CVq
});

// @from(Ln 460807, Col 0)

// @from(Ln 460807, Col 0)
import {
    mkdir as IOz,
    readFile as bOz,
    stat as xOz,
    unlink as uOz,
    writeFile as mOz
} from "fs/promises";

// @from(Ln 460814, Col 0)

// @from(Ln 460814, Col 0)
import {
    dirname as BOz,
    join as gOz
} from "path";

// @from(Ln 460909, Col 0)

// @from(Ln 460909, Col 0)
N1(do8, {
    initializeErrorLogSink: () => Uo8,
    getMCPLogsPath: () => PC1,
    getErrorsPath: () => po8,
    _flushLogWritersForTesting: () => lOz,
    _clearLogWritersForTesting: () => iOz
});

// @from(Ln 460916, Col 0)

// @from(Ln 460916, Col 0)
import {
    dirname as dOz,
    join as IVq
} from "path";

// @from(Ln 461049, Col 0)

// @from(Ln 461049, Col 0)
N1(io8, {
    sleep: () => iZ,
    runBridgeLoop: () => gVq,
    parseArgs: () => QVq,
    isServerError: () => pVq,
    isConnectionError: () => FVq,
    bridgeMain: () => P$z
});

// @from(Ln 461057, Col 0)

// @from(Ln 461057, Col 0)
import {
    randomUUID as xVq
} from "crypto";

// @from(Ln 461060, Col 0)

// @from(Ln 461060, Col 0)
import {
    hostname as tOz,
    tmpdir as eOz
} from "os";

// @from(Ln 461064, Col 0)

// @from(Ln 461064, Col 0)
import {
    basename as A$z,
    join as q$z,
    resolve as co8
} from "path";

// @from(Ln 462180, Col 0)

// @from(Ln 462180, Col 0)
N1(lVq, {
    showInvalidConfigDialog: () => T$z
});

// @from(Ln 462409, Col 0)

// @from(Ln 462409, Col 0)
import * as s_6 from "path";

// @from(Ln 462537, Col 0)

// @from(Ln 462537, Col 0)
import {
    posix as sVq,
    win32 as tVq
} from "path";

// @from(Ln 463917, Col 0)

// @from(Ln 463917, Col 0)
import * as Fo6 from "fs/promises";

// @from(Ln 463918, Col 0)

// @from(Ln 463918, Col 0)
import * as bE from "path";

// @from(Ln 464081, Col 0)

// @from(Ln 464081, Col 0)
N1(Ekq, {
    renameRecordingForSession: () => Qo6,
    installAsciicastRecorder: () => pHz,
    getSessionRecordingPaths: () => gHz,
    getRecordFilePath: () => kkq,
    flushAsciicastRecorder: () => FHz,
    _resetRecordingStateForTesting: () => BHz
});

// @from(Ln 464089, Col 0)

// @from(Ln 464089, Col 0)
import {
    appendFile as xHz,
    rename as uHz
} from "fs/promises";

// @from(Ln 464093, Col 0)

// @from(Ln 464093, Col 0)
import {
    basename as kC1,
    dirname as mHz,
    join as Ii
} from "path";

// @from(Ln 464223, Col 0)

// @from(Ln 464223, Col 0)
import {
    join as ykq
} from "path";

// @from(Ln 464785, Col 0)

// @from(Ln 464785, Col 0)
import {
    realpathSync as nHz
} from "fs";

// @from(Ln 464959, Col 0)

// @from(Ln 464959, Col 0)
N1(OEq, {
    ApproveApiKey: () => Wa8
});

// @from(Ln 465460, Col 0)

// @from(Ln 465460, Col 0)
N1(MEq, {
    Onboarding: () => eHz
});

// @from(Ln 465732, Col 0)

// @from(Ln 465732, Col 0)
N1(SEq, {
    TrustDialog: () => Ajz
});

// @from(Ln 465735, Col 0)

// @from(Ln 465735, Col 0)
import {
    homedir as hEq
} from "os";

// @from(Ln 465936, Col 0)

// @from(Ln 465936, Col 0)
N1(IEq, {
    BypassPermissionsModeDialog: () => $jz
});

// @from(Ln 466015, Col 0)

// @from(Ln 466015, Col 0)
N1(xEq, {
    AutoModeOptInDialog: () => fa8,
    AUTO_MODE_DESCRIPTION: () => xC1
});

// @from(Ln 466116, Col 0)

// @from(Ln 466116, Col 0)
N1(uEq, {
    ClaudeInChromeOnboarding: () => Xjz
});

// @from(Ln 466203, Col 0)

// @from(Ln 466203, Col 0)
import {
    appendFileSync as Wjz
} from "fs";

// @from(Ln 466824, Col 0)

// @from(Ln 466824, Col 0)
import {
    join as ya8
} from "path";

// @from(Ln 466827, Col 0)

// @from(Ln 466827, Col 0)
import {
    mkdir as hjz,
    writeFile as Sjz,
    readdir as Cjz,
    unlink as Ayq
} from "fs/promises";

// @from(Ln 467379, Col 0)

// @from(Ln 467379, Col 0)
import {
    dirname as pjz
} from "path";

// @from(Ln 467902, Col 0)

// @from(Ln 467902, Col 0)
import {
    writeFile as hyq
} from "fs/promises";

// @from(Ln 468949, Col 0)

// @from(Ln 468949, Col 0)
import {
    stat as EJz,
    open as yJz
} from "fs/promises";

// @from(Ln 469434, Col 0)

// @from(Ln 469434, Col 0)
N1(OLq, {
    registerLoopSkill: () => gJz
});

// @from(Ln 475934, Col 0)

// @from(Ln 475934, Col 0)
N1(JRq, {
    registerClaudeApiSkill: () => PMz
});

// @from(Ln 475937, Col 0)

// @from(Ln 475937, Col 0)
import {
    readdir as jMz
} from "fs/promises";

// @from(Ln 476073, Col 0)

// @from(Ln 476073, Col 0)
import {
    homedir as WMz
} from "os";

// @from(Ln 476076, Col 0)

// @from(Ln 476076, Col 0)
import {
    join as ZMz
} from "path";

// @from(Ln 476079, Col 0)

// @from(Ln 476079, Col 0)
import {
    stat as GMz,
    copyFile as fMz
} from "fs/promises";

// @from(Ln 476136, Col 0)

// @from(Ln 476136, Col 0)
N1(iC1, {
    setup: () => NMz
});

// @from(Ln 476258, Col 0)

// @from(Ln 476258, Col 0)
N1(GRq, {
    InvalidSettingsDialog: () => VMz
});

// @from(Ln 476401, Col 0)

// @from(Ln 476401, Col 0)
import {
    join as nZ
} from "path";

// @from(Ln 476684, Col 0)

// @from(Ln 476684, Col 0)
N1(RRq, {
    startBackgroundHousekeeping: () => Qa8
});

// @from(Ln 476733, Col 0)

// @from(Ln 476733, Col 0)
import {
    mkdir as mMz,
    readFile as bI$,
    writeFile as BMz,
    stat as xI$
} from "fs/promises";

// @from(Ln 476739, Col 0)

// @from(Ln 476739, Col 0)
import {
    dirname as gMz
} from "path";

// @from(Ln 477156, Col 0)

// @from(Ln 477156, Col 0)
import {
    randomUUID as gRq
} from "crypto";

// @from(Ln 478396, Col 0)

// @from(Ln 478396, Col 0)
import {
    URL as lDz
} from "url";

// @from(Ln 478471, Col 0)

// @from(Ln 478471, Col 0)
import {
    randomUUID as lRq
} from "crypto";

// @from(Ln 478755, Col 0)

// @from(Ln 478755, Col 0)
import {
    URL as nDz
} from "url";

// @from(Ln 478758, Col 0)

// @from(Ln 478758, Col 0)
import {
    PassThrough as rDz
} from "stream";

// @from(Ln 478885, Col 0)

// @from(Ln 478885, Col 0)
import {
    randomUUID as oDz
} from "crypto";

// @from(Ln 478989, Col 0)

// @from(Ln 478989, Col 0)
N1(eRq, {
    processBashCommand: () => sDz
});

// @from(Ln 478992, Col 0)

// @from(Ln 478992, Col 0)
import {
    randomUUID as aDz
} from "crypto";

// @from(Ln 479086, Col 0)

// @from(Ln 479086, Col 0)
import {
    randomUUID as tDz
} from "node:crypto";

// @from(Ln 479278, Col 0)

// @from(Ln 479278, Col 0)
N1(_hq, {
    selectableUserMessagesFilter: () => XV6,
    messagesAfterAreOnlySynthetic: () => YI1,
    MessageSelector: () => zs8
});

// @from(Ln 479283, Col 0)

// @from(Ln 479283, Col 0)
import {
    randomUUID as AXz
} from "crypto";

// @from(Ln 479286, Col 0)

// @from(Ln 479286, Col 0)
import * as DV6 from "path";

// @from(Ln 479859, Col 0)

// @from(Ln 479859, Col 0)
import {
    randomUUID as $86
} from "crypto";

// @from(Ln 480594, Col 0)

// @from(Ln 480594, Col 0)
import {
    randomUUID as Phq
} from "crypto";

// @from(Ln 480820, Col 0)

// @from(Ln 480820, Col 0)
import {
    isAbsolute as $Xz,
    resolve as HXz
} from "path";

// @from(Ln 480953, Col 0)

// @from(Ln 480953, Col 0)
import {
    join as Hs8
} from "path";

// @from(Ln 480956, Col 0)

// @from(Ln 480956, Col 0)
import {
    readFile as Thq
} from "fs/promises";

// @from(Ln 481076, Col 0)

// @from(Ln 481076, Col 0)
import {
    join as yhq,
    dirname as XXz
} from "path";

// @from(Ln 481080, Col 0)

// @from(Ln 481080, Col 0)
import {
    readFile as PXz,
    writeFile as Js8,
    unlink as Lhq,
    mkdir as WXz
} from "fs/promises";

// @from(Ln 481180, Col 0)

// @from(Ln 481180, Col 0)
N1(xhq, {
    isRecurringTaskAged: () => Ihq,
    createCronScheduler: () => Ds8,
    buildMissedTaskNotification: () => bhq,
    RECURRING_MAX_AGE_MS: () => Chq
});

// @from(Ln 481362, Col 0)

// @from(Ln 481362, Col 0)
N1(uhq, {
    getCronJitterConfig: () => Ws8
});

// @from(Ln 481515, Col 0)

// @from(Ln 481515, Col 0)
import {
    randomUUID as fs8
} from "crypto";

// @from(Ln 482506, Col 0)

// @from(Ln 482506, Col 0)
N1(vs8, {
    initReplBridge: () => bXz
});

// @from(Ln 482509, Col 0)

// @from(Ln 482509, Col 0)
import {
    hostname as IXz
} from "os";

// @from(Ln 482650, Col 0)

// @from(Ln 482650, Col 0)
N1(YSq, {
    runHeadless: () => mXz,
    removeInterruptedMessage: () => ehq,
    reconcileMcpServers: () => KSq,
    handleOrphanedPermissionResponse: () => ASq,
    handleMcpSetServers: () => qSq,
    createCanUseToolWithPermissionPrompt: () => shq
});

// @from(Ln 482658, Col 0)

// @from(Ln 482658, Col 0)
import {
    dirname as ihq
} from "path";

// @from(Ln 482661, Col 0)

// @from(Ln 482661, Col 0)
import {
    cwd as MI1
} from "process";

// @from(Ln 482664, Col 0)

// @from(Ln 482664, Col 0)
import {
    randomUUID as WD
} from "crypto";

// @from(Ln 484640, Col 0)

// @from(Ln 484640, Col 0)
N1($Sq, {
    App: () => dXz
});

// @from(Ln 484721, Col 0)

// @from(Ln 484721, Col 0)
import {
    spawn as cXz
} from "child_process";

// @from(Ln 484984, Col 0)

// @from(Ln 484984, Col 0)
N1(ySq, {
    resolveInboundAttachments: () => $Pz,
    extractInboundAttachments: () => zPz
});

// @from(Ln 484988, Col 0)

// @from(Ln 484988, Col 0)
import {
    randomUUID as oXz
} from "crypto";

// @from(Ln 484991, Col 0)

// @from(Ln 484991, Col 0)
import {
    mkdir as aXz,
    writeFile as sXz
} from "fs/promises";

// @from(Ln 484995, Col 0)

// @from(Ln 484995, Col 0)
import {
    basename as tXz,
    join as ESq
} from "path";

// @from(Ln 485653, Col 0)

// @from(Ln 485653, Col 0)
import {
    basename as XPz,
    join as PPz,
    sep as bSq
} from "path";

// @from(Ln 485658, Col 0)

// @from(Ln 485658, Col 0)
import {
    homedir as WPz
} from "os";

// @from(Ln 485967, Col 0)

// @from(Ln 485967, Col 0)
import {
    randomUUID as NPz
} from "crypto";

// @from(Ln 485970, Col 0)

// @from(Ln 485970, Col 0)
import {
    basename as VPz
} from "path";

// @from(Ln 486142, Col 0)

// @from(Ln 486142, Col 0)
import {
    basename as hPz,
    relative as SPz
} from "path";

// @from(Ln 486257, Col 0)

// @from(Ln 486257, Col 0)
import {
    relative as CPz
} from "path";

// @from(Ln 486508, Col 0)

// @from(Ln 486508, Col 0)
import {
    basename as xPz
} from "path";

// @from(Ln 486511, Col 0)

// @from(Ln 486511, Col 0)
import {
    relative as uPz
} from "path";

// @from(Ln 486624, Col 0)

// @from(Ln 486624, Col 0)
import * as j86 from "path";

// @from(Ln 487238, Col 0)

// @from(Ln 487238, Col 0)
import {
    basename as ePz,
    relative as A0z
} from "path";

// @from(Ln 489088, Col 0)

// @from(Ln 489088, Col 0)
import {
    basename as p0z,
    relative as Q0z
} from "path";

// @from(Ln 489442, Col 0)

// @from(Ln 489442, Col 0)
import {
    relative as n0z
} from "path";

// @from(Ln 489640, Col 0)

// @from(Ln 489640, Col 0)
import {
    basename as t0z
} from "path";

// @from(Ln 493940, Col 0)

// @from(Ln 493940, Col 0)
import {
    basename as UWz
} from "path";

// @from(Ln 494065, Col 0)

// @from(Ln 494065, Col 0)
N1(tIq, {
    VoiceWarmupHint: () => rs8,
    VoiceIndicator: () => oWz
});

// @from(Ln 494883, Col 0)

// @from(Ln 494883, Col 0)
import * as Xbq from "path";

// @from(Ln 498417, Col 0)

// @from(Ln 498417, Col 0)
import {
    randomUUID as RGz
} from "crypto";

// @from(Ln 498894, Col 0)

// @from(Ln 498894, Col 0)
import {
    basename as FGz
} from "path";

// @from(Ln 500057, Col 0)

// @from(Ln 500057, Col 0)
import * as juq from "path";

// @from(Ln 501996, Col 0)

// @from(Ln 501996, Col 0)
import {
    randomUUID as gfz
} from "crypto";

// @from(Ln 503245, Col 0)

// @from(Ln 503245, Col 0)
import {
    randomUUID as lfz
} from "crypto";

// @from(Ln 504198, Col 0)

// @from(Ln 504198, Col 0)
import {
    randomUUID as Emq
} from "crypto";

// @from(Ln 505088, Col 0)

// @from(Ln 505088, Col 0)
import {
    randomUUID as Umq
} from "crypto";

// @from(Ln 505144, Col 0)

// @from(Ln 505144, Col 0)
import {
    readFile as qTz
} from "fs/promises";

// @from(Ln 506387, Col 0)

// @from(Ln 506387, Col 0)
import {
    extname as xTz
} from "path";

// @from(Ln 506543, Col 0)

// @from(Ln 506543, Col 0)
import {
    extname as pTz,
    join as QTz
} from "path";

// @from(Ln 507774, Col 0)

// @from(Ln 507774, Col 0)
N1(it8, {
    useVoiceIntegration: () => kvz,
    VoiceKeybindingHandler: () => Evz
});

// @from(Ln 508020, Col 0)

// @from(Ln 508020, Col 0)
N1(Cgq, {
    useScheduledTasks: () => yvz
});

// @from(Ln 508078, Col 0)

// @from(Ln 508078, Col 0)
N1(Fgq, {
    computeIsStreamingTextEnabled: () => ggq,
    REPL: () => ot8
});

// @from(Ln 508082, Col 0)

// @from(Ln 508082, Col 0)
import {
    dirname as Lvz
} from "path";

// @from(Ln 508085, Col 0)

// @from(Ln 508085, Col 0)
import {
    randomUUID as S26
} from "crypto";

// @from(Ln 510391, Col 0)

// @from(Ln 510391, Col 0)
N1(igq, {
    TeleportResumeWrapper: () => cvz
});

// @from(Ln 510510, Col 0)

// @from(Ln 510510, Col 0)
N1(rgq, {
    TeleportRepoMismatchDialog: () => lvz
});

// @from(Ln 510602, Col 0)

// @from(Ln 510602, Col 0)
N1(egq, {
    teleportWithProgress: () => nvz,
    TeleportProgress: () => tgq
});

// @from(Ln 510718, Col 0)

// @from(Ln 510718, Col 0)
N1(KFq, {
    ResumeConversation: () => avz
});

// @from(Ln 510721, Col 0)

// @from(Ln 510721, Col 0)
import {
    dirname as rvz
} from "path";

// @from(Ln 511112, Col 0)

// @from(Ln 511112, Col 0)
N1(OFq, {
    startMCPServer: () => KNz
});

// @from(Ln 511271, Col 0)

// @from(Ln 511271, Col 0)
N1(MFq, {
    readClaudeDesktopMcpServers: () => _Nz,
    getClaudeDesktopConfigPath: () => JFq
});

// @from(Ln 511275, Col 0)

// @from(Ln 511275, Col 0)
import * as tt8 from "path";

// @from(Ln 511276, Col 0)

// @from(Ln 511276, Col 0)
import * as jFq from "os";

// @from(Ln 511277, Col 0)

// @from(Ln 511277, Col 0)
import {
    readFile as YNz,
    readdir as zNz,
    stat as HFq
} from "fs/promises";

// @from(Ln 511346, Col 0)

// @from(Ln 511346, Col 0)
N1(G86, {
    mcpServeHandler: () => $Nz,
    mcpResetChoicesHandler: () => XNz,
    mcpRemoveHandler: () => HNz,
    mcpListHandler: () => jNz,
    mcpGetHandler: () => JNz,
    mcpAddJsonHandler: () => MNz,
    mcpAddFromDesktopHandler: () => DNz
});

// @from(Ln 511355, Col 0)

// @from(Ln 511355, Col 0)
import {
    cwd as wNz
} from "process";

// @from(Ln 511358, Col 0)

// @from(Ln 511358, Col 0)
import {
    stat as ONz
} from "fs/promises";

// @from(Ln 511598, Col 0)

// @from(Ln 511598, Col 0)
N1(sh, {
    pluginValidateHandler: () => PNz,
    pluginUpdateHandler: () => ENz,
    pluginUninstallHandler: () => NNz,
    pluginListHandler: () => WNz,
    pluginInstallHandler: () => vNz,
    pluginEnableHandler: () => VNz,
    pluginDisableHandler: () => kNz,
    marketplaceUpdateHandler: () => TNz,
    marketplaceRemoveHandler: () => fNz,
    marketplaceListHandler: () => GNz,
    marketplaceAddHandler: () => ZNz,
    handleMarketplaceError: () => Ua6,
    VALID_UPDATE_SCOPES: () => O_6,
    VALID_INSTALLABLE_SCOPES: () => i0
});

// @from(Ln 511985, Col 0)

// @from(Ln 511985, Col 0)
N1(WFq, {
    install: () => CNz
});

// @from(Ln 511988, Col 0)

// @from(Ln 511988, Col 0)
import {
    homedir as yNz
} from "node:os";

// @from(Ln 511991, Col 0)

// @from(Ln 511991, Col 0)
import {
    join as LNz
} from "node:path";

// @from(Ln 512212, Col 0)

// @from(Ln 512212, Col 0)
N1(Lb1, {
    setupTokenHandler: () => bNz,
    installHandler: () => BNz,
    doctorHandler: () => mNz
});

// @from(Ln 512217, Col 0)

// @from(Ln 512217, Col 0)
import {
    cwd as INz
} from "process";

// @from(Ln 512310, Col 0)

// @from(Ln 512310, Col 0)
N1(fFq, {
    agentsHandler: () => gNz
});

// @from(Ln 512356, Col 0)

// @from(Ln 512356, Col 0)
N1(et8, {
    autoModeDefaultsHandler: () => FNz,
    autoModeConfigHandler: () => pNz
});

// @from(Ln 512385, Col 0)

// @from(Ln 512385, Col 0)
N1(NFq, {
    update: () => QNz
});

// @from(Ln 512685, Col 0)

// @from(Ln 512685, Col 0)
N1(yFq, {
    startDeferredPrefetches: () => mC1,
    main: () => _Vz
});

// @from(Ln 512689, Col 0)

// @from(Ln 512689, Col 0)
import {
    existsSync as UNz,
    readFileSync as kFq
} from "fs";

// @from(Ln 512693, Col 0)

// @from(Ln 512693, Col 0)
import {
    cwd as iNz
} from "process";

// @from(Ln 512696, Col 0)

// @from(Ln 512696, Col 0)
import {
    resolve as ca6
} from "path";

// @from(Ln 514448, Col 0)

// @from(Ln 514448, Col 0)
process.env.COREPACK_ENABLE_AUTO_PIN = "0";

// @from(Ln 514449, Col 0)

// @from(Ln 514449, Col 0)
if (process.env.CLAUDE_CODE_REMOTE === "true") {
    let A = process.env.NODE_OPTIONS || "";
    process.env.NODE_OPTIONS = A ? `${A} --max-old-space-size=8192` : "--max-old-space-size=8192"
}

// @from(Ln 514532, Col 0)

// @from(Ln 514532, Col 0)
JVz();
