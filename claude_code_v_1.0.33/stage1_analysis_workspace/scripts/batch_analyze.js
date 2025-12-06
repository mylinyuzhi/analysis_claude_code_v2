const fs = require('fs');
const path = require('path');

const chunksDir = path.resolve(__dirname, '../chunks');

// Common signatures for libraries
const signatures = {
    'highlight.js': (content) => {
        return (content.includes('keywords:') && content.includes('contains:')) ||
            (content.includes('hljs') && content.includes('registerLanguage'));
    },
    'rxjs': (content) => {
        return content.includes('Observable') && (content.includes('Subscriber') || content.includes('Subscription') || content.includes('next:') || content.includes('complete:'));
    },
    'commander': (content) => {
        // Source code of commander
        return content.includes('this.commands = []') && content.includes('this._allowUnknownOption = !1') && content.includes('CommanderError');
    },
    'undici': (content) => {
        return content.includes('debuglog("undici")') || (content.includes('node:http') && content.includes('node:net') && content.includes('fetch'));
    },
    'zod': (content) => {
        return content.includes('Zod') && content.includes('_parse') && content.includes('safeParse');
    },
    'react': (content) => {
        // React framework
        return content.includes('createElement') && content.includes('useEffect') && !content.includes('tengu');
    }
};

// Signatures for Claude Code application logic
const claudeSignatures = [
    'tengu', // Telemetry event name
    'claude.ai',
    'Anthropic',
    'Claude Code',
    'permission-mode',
    '--max-budget-usd', // CLI flag
    'mcp-config',       // CLI flag
    'tengu_grove',
    'tengu_code',
    'GA("tengu'
];

// Loop through all anticipated chunk files
for (let i = 1; i <= 158; i++) {
    const mjsFilename = `chunks.${i}.mjs`;
    const mjsPath = path.join(chunksDir, mjsFilename);
    const jsonFilename = `chunks.${i}.json`;
    const jsonPath = path.join(chunksDir, jsonFilename);

    if (!fs.existsSync(mjsPath)) continue;

    const content = fs.readFileSync(mjsPath, 'utf8');
    const detectedOss = [];
    let isClaude = false;
    let purpose = "";

    // 1. Detect OSS
    for (const [libName, checkFunc] of Object.entries(signatures)) {
        if (checkFunc(content)) {
            detectedOss.push(libName);
        }
    }

    // 2. Detect Claude Code
    for (const sig of claudeSignatures) {
        if (content.includes(sig)) {
            isClaude = true;
            break;
        }
    }

    // Heuristic: If it has "tengu" it is definitely Claude code, even if it uses libraries
    if (content.includes('tengu')) {
        isClaude = true;
    }

    // 3. Conflict Resolution & Refinement
    if (detectedOss.includes('highlight.js')) {
        purpose = "Syntax highlighting language definition (highlight.js)";
        isClaude = false; // Valid override: highlight.js files are pure lib
    } else if (detectedOss.includes('rxjs')) {
        purpose = "Reactive programming utilities (RxJS)";
        isClaude = false;
    } else if (detectedOss.includes('commander')) {
        purpose = "Commander.js library code";
        isClaude = false;
    } else if (detectedOss.includes('undici')) {
        purpose = "Undici HTTP Client";
        isClaude = false;
    } else if (isClaude) {
        purpose = "Claude Code application logic";
        // Ensure ossProjects is empty if it's purely app code, unless it mixes both?
        // Usually chunks are either lib or app. If detected 'react' but also 'tengu', it's App code using React.
        // So we keep detectedOss to show what it USES, but isClaude=true means it IS app code.
    } else if (i === 1) {
        purpose = "Runtime infrastructure and polyfills";
        isClaude = true;
    } else {
        // Fallback for unknown
        purpose = "Utility code or unrecognized library";
        if (content.length < 50000 && content.includes("Error") && !content.includes("node_modules")) {
            // Small file with errors might be app code
            // But let's be conservative.
        }
    }

    // Correct chunks.158 specifically if needed
    if (i === 158) {
        isClaude = true;
        purpose = "Main CLI entry point and command routing";
    }

    // Write result
    const result = {
        ossProjects: detectedOss,
        purpose: purpose,
        containsClaudeCode: isClaude
    };

    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
}

console.log("Batch analysis complete.");
