/**
 * find-claude-chunks.js
 * 
 * 目的：分析每个 chunk 文件，识别 Claude Code 代码和 OSS 库
 * 输出：为每个 chunks.X.mjs 生成对应的 chunks.X.json
 */

const fs = require('fs');
const path = require('path');

const chunksDir = path.resolve(__dirname, '../chunks');

// ============== Claude Code 特征签名 ==============
// 使用正则表达式，支持忽略大小写匹配
const claudeSignatures = [
    { name: 'tengu', pattern: /tengu/i },
    { name: 'tengu_grove', pattern: /tengu_grove/i },
    { name: 'tengu_code', pattern: /tengu_code/i },
    { name: 'GA_tengu', pattern: /GA\("tengu/i },
    { name: 'claude.ai', pattern: /claude\.ai/i },
    { name: 'Anthropic', pattern: /Anthropic/i },
    { name: 'Claude Code', pattern: /Claude Code/i },
    { name: 'Claude', pattern: /Claude/i },
    { name: 'permission-mode', pattern: /permission-mode/i },
    { name: '--max-budget-usd', pattern: /--max-budget-usd/i },
    { name: 'mcp-config', pattern: /mcp-config/i },
    { name: 'anthropic-beta', pattern: /anthropic-beta/i },
    { name: 'interleaved-thinking', pattern: /interleaved-thinking/i },
    { name: 'prompt_caching', pattern: /prompt_caching/i },
    { name: 'max_tokens_to_sample', pattern: /max_tokens_to_sample/i },
    // 新增关键字
    { name: 'mcp', pattern: /\bmcp\b/i },
    { name: 'prompt', pattern: /\bprompt\b/i },
    { name: 'max_tokens', pattern: /max_tokens/i },
    { name: 'max_output_tokens', pattern: /max_output_tokens/i },
    { name: 'thinking', pattern: /\bthinking\b/i },
    { name: 'taskTool', pattern: /taskTool/i },
    { name: 'accept edits on', pattern: /accept edits on/i },
    { name: 'How did that compaction go', pattern: /How did that compaction go/i },
    // 新增关键字
    { name: 'codeAgent', pattern: /codeAgent|code_agent/i },
    { name: 'subagent', pattern: /subagent/i },
    { name: 'skill', pattern: /skill/i },
    { name: 'agentic', pattern: /agentic|agent_mode/i },
    { name: 'tool_use', pattern: /tool_use|toolUse/i },
    { name: 'browser_action', pattern: /browser_action|browserAction/i },
    { name: 'slash_command', pattern: /slash.?command/i },
    { name: 'extra-usage', pattern: /extra-usage/i },
    { name: 'install-github-app', pattern: /install-github-app/i },
    { name: 'privacy-setting', pattern: /privacy-setting/i },
    { name: 'security-review', pattern: /security-review/i },

    // 新增: MCP 和会话管理特征
    { name: 'MCP server', pattern: /MCP server/i },
    { name: 'mcpLogs', pattern: /mcpLogs/i },
    { name: 'sessionCounter', pattern: /sessionCounter/i },
    { name: 'sessionIngressToken', pattern: /sessionIngressToken/i },
    { name: 'sessionBypassPermissionsMode', pattern: /sessionBypassPermissionsMode/i },

    // 新增: 代码编辑工具特征
    { name: 'codeEditTool', pattern: /codeEditTool|code.*edit.*tool/i },
    { name: 'codeEditToolDecisionCounter', pattern: /codeEditToolDecisionCounter/i },

    // 新增: Agent 特征
    { name: 'agentColorMap', pattern: /agentColorMap/i },
    { name: 'agentColorIndex', pattern: /agentColorIndex/i },

    // 新增: 性能分析特征
    { name: 'profiler_initialized', pattern: /profiler_initialized/i },
    { name: 'CLAUDE_CODE_PROFILE_STARTUP', pattern: /CLAUDE_CODE_PROFILE_STARTUP/i },

    // 新增: 环境变量特征
    { name: 'CLAUDE_CODE_USE_BEDROCK', pattern: /CLAUDE_CODE_USE_BEDROCK/i },
    { name: 'CLAUDE_CODE_USE_VERTEX', pattern: /CLAUDE_CODE_USE_VERTEX/i },
    { name: 'CLAUDE_CODE_USE_FOUNDRY', pattern: /CLAUDE_CODE_USE_FOUNDRY/i },
    { name: 'CLAUDE_CODE_SESSION_ID', pattern: /CLAUDE_CODE_SESSION_ID/i },

    // 新增: OAuth 和组织特征
    { name: 'oauthAccount', pattern: /oauthAccount/i },
    { name: 'organizationRole', pattern: /organizationRole|organization.*role/i },
    { name: 'workspaceRole', pattern: /workspaceRole|workspace.*role/i },
    { name: 'organizationName', pattern: /organizationName/i },
    { name: 'tengu_oauth', pattern: /tengu_oauth/i },

    // 新增: UI 和交互特征
    { name: 'shell_completion', pattern: /shell.*completion/i },
    { name: 'thinking_toggled', pattern: /thinking.*toggled/i },

    // 新增: 分析事件特征
    { name: 'GA_tengu_event', pattern: /GA\(["']tengu/i },
    { name: 'tengu_grove', pattern: /tengu_grove/i },
    { name: 'statsig', pattern: /statsig/i },

    // 新增: 核心配置特征 (chunks.101)
    { name: 'mcp_config', pattern: /mcp_config/i },
    { name: 'claude_desktop_config', pattern: /claude_desktop/i },
    { name: 'user_config_schema', pattern: /user_config/i },

    // 新增: Bash/Execution 工具特征 (chunks.106)
    { name: 'tengu_bash', pattern: /tengu_bash/i },
    { name: 'tengu_git', pattern: /tengu_git/i },
    { name: 'CLAUDE_CODE_BASH', pattern: /CLAUDE_CODE_BASH/i },

    // 新增: Rate Limit & Quota 特征 (chunks.107)
    { name: 'anthropic_ratelimit', pattern: /anthropic-ratelimit/i },
    { name: 'claude_code_grove', pattern: /claude_code_grove/i },
    { name: 'weekly_limit', pattern: /weekly limit/i },
    { name: 'resetsAt', pattern: /resetsAt/i },

    // 新增: OAuth & Metrics 特征 (chunks.108)
    { name: 'CLAUDEAI_SUCCESS_URL', pattern: /CLAUDEAI_SUCCESS_URL/i },
    { name: 'console_success_url', pattern: /CONSOLE_SUCCESS_URL/i },
    { name: 'oauth_callback', pattern: /d27, ey0/i }, // Just kidding, don't use weak signals. Use strong ones.
    { name: 'oauth_callback_server', pattern: /oauth.*callback.*server/i },
    { name: 'grove_enabled', pattern: /grove_enabled/i },

    // ============== Sandbox System Signatures (from chunks.17.mjs) ==============
    // Sandbox Core Functions
    { name: 'wrapWithSandbox', pattern: /wrapWithSandbox/i },
    { name: 'getSandboxViolationStore', pattern: /getSandboxViolationStore/i },
    { name: 'annotateStderrWithSandboxFailures', pattern: /annotateStderrWithSandboxFailures/i },
    { name: 'isSandboxingEnabled', pattern: /isSandboxingEnabled/i },
    { name: 'checkDependencies', pattern: /checkDependencies.*sandbox/i },

    // Sandbox Configuration
    { name: 'needsNetworkRestriction', pattern: /needsNetworkRestriction/i },
    { name: 'allowUnixSockets', pattern: /allowUnixSockets/i },
    { name: 'allowAllUnixSockets', pattern: /allowAllUnixSockets/i },
    { name: 'allowLocalBinding', pattern: /allowLocalBinding/i },
    { name: 'enableWeakerNestedSandbox', pattern: /enableWeakerNestedSandbox/i },
    { name: 'mandatoryDenySearchDepth', pattern: /mandatoryDenySearchDepth/i },
    { name: 'ignoreViolations', pattern: /ignoreViolations/i },

    // Sandbox File System Control
    { name: 'getFsReadConfig', pattern: /getFsReadConfig/i },
    { name: 'getFsWriteConfig', pattern: /getFsWriteConfig/i },
    { name: 'denyRead', pattern: /denyRead.*filesystem/i },
    { name: 'allowWrite', pattern: /allowWrite.*filesystem/i },
    { name: 'denyWrite', pattern: /denyWrite.*filesystem/i },

    // Sandbox Network Control
    { name: 'getNetworkRestrictionConfig', pattern: /getNetworkRestrictionConfig/i },
    { name: 'allowedDomains', pattern: /allowedDomains.*network/i },
    { name: 'deniedDomains', pattern: /deniedDomains.*network/i },

    // Sandbox State & Monitoring
    { name: 'sandboxViolationStore', pattern: /sandboxViolationStore/i },
    { name: 'SandboxViolationStore', pattern: /class \w+.*violations/i },
    { name: 'linuxBridge', pattern: /linuxBridge/i },
    { name: 'httpSocketPath', pattern: /httpSocketPath/i },
    { name: 'socksSocketPath', pattern: /socksSocketPath/i },

    // Sandbox Commands & Tools
    { name: 'sandbox-exec', pattern: /sandbox-exec/i },
    { name: 'bubblewrap', pattern: /bubblewrap|bwrap/i },

    // Sandbox Logging
    { name: 'Sandbox_macOS_log', pattern: /\[Sandbox macOS\]/i },
    { name: 'Sandbox_Monitor_log', pattern: /\[Sandbox Monitor\]/i },
    { name: 'Sandbox_Linux_log', pattern: /\[Sandbox Linux\]/i },
    { name: 'sandbox_violations_xml', pattern: /<sandbox_violations>/i },

    // Permission System & Proxy Infrastructure
    { name: 'permission_callback', pattern: /permission.*callback/i },
    { name: 'user_permission', pattern: /user.*permission/i },
    { name: 'httpProxyPort', pattern: /httpProxyPort/i },
    { name: 'socksProxyPort', pattern: /socksProxyPort/i },

    // ============== Session Environment Management Signatures (from chunks.68.mjs) ==============
    // Session environment functions
    { name: 'sessionEnvAggregator', pattern: /CLAUDE_ENV_FILE/i },
    { name: 'sessionEnvLoader', pattern: /MNB\s*\(/i },
    { name: 'sessionCacheInvalidation', pattern: /LNB\s*\(/i },
    { name: 'hookPathGenerator', pattern: /LsA\s*\(/i },
    { name: 'sessionDirGetter', pattern: /NNB\s*\(/i },

    // Session directory patterns
    { name: 'sessionEnvDir', pattern: /session-env/i },
    { name: 'hookScriptPattern', pattern: /hook-\d+\.sh/i },

    // Environment variable references
    { name: 'claudeEnvFile', pattern: /process\.env\.CLAUDE_ENV_FILE/i },

    // Cache variable
    { name: 'sessionStateCache', pattern: /Wp\s*=/i },

];

// ============== OSS 库特征 ==============
const ossSignatures = {
    'highlight.js': (content) => {
        return (content.includes('keywords:') && content.includes('contains:')) ||
            (content.includes('hljs') && content.includes('registerLanguage'));
    },
    'rxjs': (content) => {
        return content.includes('Observable') &&
            (content.includes('Subscriber') || content.includes('Subscription'));
    },
    'commander': (content) => {
        return content.includes('this.commands = []') &&
            content.includes('CommanderError');
    },
    'undici': (content) => {
        return content.includes('debuglog("undici")') ||
            (content.includes('node:http') && content.includes('node:net'));
    },
    'zod': (content) => {
        return content.includes('Zod') && content.includes('_parse') &&
            content.includes('safeParse');
    },
    'react': (content) => {
        return (content.includes('React.createElement') || content.includes('createElement')) &&
            (content.includes('useEffect') || content.includes('useState'));
    },
    'lodash': (content) => {
        return /__lodash_hash_undefined__/.test(content) ||
            /lodash/.test(content);
    },
    'sentry': (content) => {
        return /@sentry\//.test(content) || /Sentry\.captureException|SentryHub/.test(content) ||
            content.includes('@sentry/node') || content.includes('Sentry.init');
    },
    'ink': (content) => {
        return /from ['"]ink['"]|require\(['"]ink['"]\)/.test(content) ||
            content.includes('ink-root') || content.includes('ink-text');
    },
    'aws-sdk': (content) => {
        return /@aws-sdk\/|@smithy\//.test(content) || content.includes('AWS_SDK_LOAD_CONFIG');
    },
    'googleapis': (content) => {
        return content.includes('googleapis') || content.includes('google-auth-library') || content.includes('gaxios');
    },
    'opentelemetry': (content) => {
        return content.includes('opentelemetry') || content.includes('OTLPExporterBase');
    },
    'protobuf': (content) => {
        return content.includes('protobuf') || content.includes('google/protobuf/');
    },
    'grpc': (content) => {
        return content.includes('grpc') || content.includes('Http2SubchannelConnector');
    },
    'marked': (content) => {
        return content.includes('marked') && (content.includes('Lexer') || content.includes('Parser'));
    },
    'msal': (content) => {
        return content.includes('@azure/msal-node');
    },
    'execa': (content) => {
        return /execa/.test(content) && /escapedCommand|maxBuffer/.test(content);
    },
    'mime-db': (content) => {
        return /application\/[a-z0-9\-+.]+.*source.*iana/.test(content) &&
            content.includes("compressible");
    },
    'dom-library': (content) => {
        return (/Document\.prototype|createElement|nodeType|DOCUMENT_NODE/.test(content) &&
            /getElementById|querySelector/.test(content)) ||
            (/ownerDocument|parentNode|childNodes/.test(content) &&
                /ELEMENT_NODE|TEXT_NODE/.test(content));
    },
    'emscripten': (content) => {
        return (/WebAssembly|emscripten/.test(content) && /HEAP8|HEAPU8|wasmBinary|asm\.js/.test(content)) ||
            (content.includes('_J6') && content.includes('NEB'));
    },
    'unicode-data': (content) => {
        // Detect character mapping/data files
        return (content.includes('exports = new Uint16Array(') || content.includes('exports = [')) &&
            content.length > 30000;
    },
    'mime-types': (content) => {
        // 更精确的MIME类型数据库识别
        return (/source: "iana"|source: "apache"/.test(content) &&
            /compressible|extensions/.test(content) &&
            /application\/|text\/|image\//.test(content)) ||
            (content.includes('exports = {') &&
                /["']application\//.test(content) &&
                content.split('\n').filter(line => /source:/.test(line)).length > 50);
    },
    'asynckit': (content) => {
        // asynckit异步工具库
        return /serialOrdered|parallel.*serial/.test(content) &&
            (/asynckit/.test(content) || /serial.*parallel.*callback/.test(content));
    },
    'llhttp': (content) => {
        // llhttp (WASM) - detects the WASM binary header in base64
        return content.includes('AGFzbQEAAAAB') &&
            (content.includes('exports =') || content.includes('module.exports ='));
    },
    'marked': (content) => {
        // marked (Markdown parser)
        return (content.includes('blockTokens') && content.includes('inlineTokens')) &&
            (content.includes('blockquote') && content.includes('list') && content.includes('html') && content.includes('def') && content.includes('table')) &&
            (content.includes('reflink') && content.includes('emStrong') && content.includes('codespan'));
    },
    'empty-utility': (content) => {
        return content.length < 300 && (content.includes('export') || content.includes('module.exports'));
    },
    'protobufjs': (content) => {
        // Protocol Buffers库
        return (/proto\..*\.v\d/.test(content) &&
            /encode.*decode.*verify/.test(content)) ||
            /ReflectionObject|Namespace|Root|Type|Field|OneOf|MapField/.test(content);
    },
    'opentelemetry': (content) => {
        // OpenTelemetry
        return /opentelemetry\//.test(content) ||
            /InstrumentationScope|ResourceSpans|TracesData/.test(content) ||
            /BatchSpanProcessor|SimpleSpanProcessor/.test(content);
    },
    'grpc-js': (content) => {
        // gRPC JS
        return /@grpc\/grpc-js/.test(content) ||
            /ServerInterceptingCall|grpc-accept-encoding|Http2SubchannelConnector|ChannelzCallTracker/.test(content);
    },
    'google-protobuf': (content) => {
        // Google Protobuf API definitions
        return /Api.*methods.*options.*version.*sourceContext/.test(content) &&
            /SourceContext.*fileName/.test(content);
    },
    'math-entities': (content) => {
        // Math/HTML Entities (huge list of entities)
        return /XML_ENTITIES.*amp|HTML_ENTITIES.*Aacute/.test(content) &&
            (/Bernoullis|Cayleys|Ascr/.test(content) || /Aopf|Afr/.test(content));
    },
    'sentry-enhanced': (content) => {
        // Sentry Enhanced Detection
        return /(SENTRY_XHR_DATA_KEY|addXhrInstrumentationHandler|__sentry_xhr_v3__|cleanSpanDescription|extractRawUrl|trpcMiddleware|captureConsoleIntegration)/.test(content) ||
            /Sentry.*Integrations/.test(content) ||
            /Sentry\.(Console|Http|OnUncaughtException|Modules)/.test(content);
    },
    'sorted-map': (content) => {
        // Sorted Map / Red-Black Tree implementation
        return /splay|red-black/.test(content) ||
            (content.includes('C20') && content.includes('oH2') && content.includes('GC2') && content.includes('getElementByPos'));
    },
    'yoga-layout': (content) => {
        // Yoga Layout Engine (JS bindings)
        return (content.includes('ALIGN_AUTO') && content.includes('FLEX_DIRECTION_COLUMN')) ||
            (content.includes('Config') && content.includes('Node') && content.includes('setFlexDirection'));
    },
    'websocket-lib': (content) => {
        // WebSocket Implementation
        return (content.includes('CloseEvent') && content.includes('MessageEvent') && content.includes('kWebSocket')) ||
            content.includes('kForOnEventAttribute');
    },
    'text-layout': (content) => {
        // Text Layout / Segmentation library
        return (content.includes('measureWrappedText') && content.includes('getGraphemeBoundaries')) ||
            (content.includes('Intl.Segmenter') && content.includes('wrappedLines'));
    }
};

// 获取所有 .mjs 文件
const files = fs.readdirSync(chunksDir)
    .filter(f => f.endsWith('.mjs') && !f.includes('cli.chunks.mjs'))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
    });

console.log(`\n处理 ${files.length} 个 chunk 文件...\n`);

let stats = {
    claudeCode: 0,
    mixed: 0,
    pureOss: 0,
    unknown: 0,
};

files.forEach(file => {
    const mjsPath = path.join(chunksDir, file);
    const jsonPath = mjsPath.replace('.mjs', '.json');
    const content = fs.readFileSync(mjsPath, 'utf-8');

    // 检测 Claude Code 特征
    const matchedClaudeSignatures = [];
    for (const sig of claudeSignatures) {
        if (sig.pattern.test(content)) {
            matchedClaudeSignatures.push(sig.name);
        }
    }
    const hasClaudeCode = matchedClaudeSignatures.length > 0;

    // 检测 OSS 库特征
    const matchedOssLibs = [];
    for (const [libName, checkFunc] of Object.entries(ossSignatures)) {
        if (checkFunc(content)) {
            matchedOssLibs.push(libName);
        }
    }
    const hasOssLib = matchedOssLibs.length > 0;

    // 确定 ossProjects 和 purpose
    let ossProjects = [];
    let purpose = '';

    if (hasClaudeCode && hasOssLib) {
        // 混合: Claude Code + OSS 库
        // Claude Code 优先，同时记录使用的库
        ossProjects = ['claude-code', ...matchedOssLibs];
        purpose = `Claude Code 应用逻辑 (使用 ${matchedOssLibs.join(', ')})`;
        stats.mixed++;
    } else if (hasClaudeCode) {
        // 纯 Claude Code
        ossProjects = ['claude-code'];
        purpose = 'Claude Code 核心应用逻辑';
        stats.claudeCode++;
    } else if (hasOssLib) {
        // 纯 OSS 库
        ossProjects = matchedOssLibs;
        if (matchedOssLibs.length === 1) {
            purpose = `${matchedOssLibs[0]} 库代码`;
        } else {
            purpose = `OSS 库代码 (${matchedOssLibs.join(', ')})`;
        }
        stats.pureOss++;
    } else {
        // 未知
        ossProjects = ['unknown'];
        purpose = '待分析的代码';
        stats.unknown++;
    }

    // 写入 JSON 文件
    const result = {
        ossProjects: ossProjects,
        purpose: purpose,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`✓ ${file} → ${JSON.stringify(ossProjects)}`);
});

// 总结
console.log(`\n${'='.repeat(50)}`);
console.log(`总结:`);
console.log(`  ✅ 纯 Claude Code:     ${stats.claudeCode} 个`);
console.log(`  ⚠️  混合 (Claude+OSS): ${stats.mixed} 个`);
console.log(`  📚 纯 OSS 库:          ${stats.pureOss} 个`);
console.log(`  ❓ 未知:               ${stats.unknown} 个`);
console.log(`${'='.repeat(50)}\n`);
