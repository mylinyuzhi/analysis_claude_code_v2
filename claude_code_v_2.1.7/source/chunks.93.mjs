
// @from(Ln 271413, Col 4)
rZ5 = `You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.`
// @from(Ln 271425, Col 2)
K52
// @from(Ln 271426, Col 4)
V52 = w(() => {
  K52 = {
    agentType: "Bash",
    whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
    tools: [X9],
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => rZ5
  }
})
// @from(Ln 271437, Col 4)
$Y1
// @from(Ln 271438, Col 4)
FD0 = w(() => {
  $Y1 = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => `You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: Use Grep or Glob when you need to search broadly. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication, avoid using emojis.`
  }
})
// @from(Ln 271463, Col 4)
F52
// @from(Ln 271464, Col 4)
H52 = w(() => {
  F52 = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",
    getSystemPrompt: () => `You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc  
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\\n)\\s*(?:export\\s+)?PS1\\s*=\\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \\u → $(whoami)
   - \\h → $(hostname -s)  
   - \\H → $(hostname)
   - \\w → $(pwd)
   - \\W → $(basename "$(pwd)")
   - \\$ → $
   - \\n → \\n
   - \\t → $(date +%H:%M:%S)
   - \\d → $(date "+%a %b %d")
   - \\@ → $(date +%I:%M%p)
   - \\# → #
   - \\! → !

4. When using ANSI color codes, be sure to use \`printf\`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string"   // Project root directory path
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     },
     "context_window": {
       "total_input_tokens": number,       // Total input tokens used in session (cumulative)
       "total_output_tokens": number,      // Total output tokens used in session (cumulative)
       "context_window_size": number,      // Context window size for current model (e.g., 200000)
       "current_usage": {                   // Token usage from last API call (null if no messages yet)
         "input_tokens": number,           // Input tokens for current context
         "output_tokens": number,          // Output tokens generated
         "cache_creation_input_tokens": number,  // Tokens written to cache
         "cache_read_input_tokens": number       // Tokens read from cache
       } | null,
       "used_percentage": number | null,      // Pre-calculated: % of context used (0-100), null if no messages yet
       "remaining_percentage": number | null  // Pre-calculated: % of context remaining (0-100), null if no messages yet
     },
     "vim": {                     // Optional, only present when vim mode is enabled
       "mode": "INSERT" | "NORMAL"  // Current vim editor mode
     }
   }
   
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

   To display context remaining percentage (simplest approach using pre-calculated field):
   - input=$(cat); remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty'); [ -n "$remaining" ] && echo "Context: $remaining% remaining"

   Or to display context used percentage:
   - input=$(cat); used=$(echo "$input" | jq -r '.context_window.used_percentage // empty'); [ -n "$used" ] && echo "Context: $used% used"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command", 
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
`
  }
})
// @from(Ln 271576, Col 4)
CY1 = "ExitPlanMode"
// @from(Ln 271577, Col 2)
vd = "ExitPlanMode"
// @from(Ln 271578, Col 4)
sZ5
// @from(Ln 271578, Col 9)
MS
// @from(Ln 271579, Col 4)
wyA = w(() => {
  cW();
  pL();
  wP();
  sZ5 = `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use ${lI} for broad file pattern matching
- Use ${DI} for searching file contents with regex
- Use ${z3} when you know the specific file path you need to read
- Use ${X9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use ${X9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`, MS = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: [f3, CY1, I8, BY, tq],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    getSystemPrompt: () => sZ5,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
  }
})
// @from(Ln 271628, Col 4)
tZ5
// @from(Ln 271628, Col 9)
UY1
// @from(Ln 271629, Col 4)
HD0 = w(() => {
  wyA();
  wP();
  cW();
  pL();
  tZ5 = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using ${lI}, ${DI}, and ${z3}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${X9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use ${X9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`, UY1 = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: [f3, CY1, I8, BY, tq],
    source: "built-in",
    tools: MS.tools,
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => tZ5,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
  }
})
// @from(Ln 271696, Col 0)
function BY5() {
  if (Yk()) return `- When you cannot find an answer or the feature doesn't exist, direct the user to ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.ISSUES_EXPLAINER}`;
  return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug"
}
// @from(Ln 271700, Col 4)
eZ5 = "https://code.claude.com/docs/en/claude_code_docs_map.md"
// @from(Ln 271701, Col 2)
E52 = "https://platform.claude.com/llms.txt"
// @from(Ln 271702, Col 2)
AY5 = "claude-code-guide"
// @from(Ln 271703, Col 2)
QY5
// @from(Ln 271703, Col 7)
z52
// @from(Ln 271704, Col 4)
$52 = w(() => {
  cW();
  wP();
  MBA();
  GB();
  Q2();
  A0();
  QY5 = `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${eZ5}): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (${E52}): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (${E52}): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${cI} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${aR} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${z3}, ${lI}, and ${DI}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`;
  z52 = {
    agentType: AY5,
    whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
    tools: [lI, DI, z3, cI, aR],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    permissionMode: "dontAsk",
    getSystemPrompt({
      toolUseContext: A
    }) {
      let Q = A.options.commands,
        B = [],
        G = Q.filter((W) => W.type === "prompt");
      if (G.length > 0) {
        let W = G.map((K) => `- /${K.name}: ${K.description}`).join(`
`);
        B.push(`**Available custom skills in this project:**
${W}`)
      }
      let Z = A.options.agentDefinitions.activeAgents.filter((W) => W.source !== "built-in");
      if (Z.length > 0) {
        let W = Z.map((K) => `- ${K.agentType}: ${K.whenToUse}`).join(`
`);
        B.push(`**Available custom agents configured:**
${W}`)
      }
      let Y = A.options.mcpClients;
      if (Y && Y.length > 0) {
        let W = Y.map((K) => `- ${K.name}`).join(`
`);
        B.push(`**Configured MCP servers:**
${W}`)
      }
      let J = Q.filter((W) => W.type === "prompt" && W.source === "plugin");
      if (J.length > 0) {
        let W = J.map((K) => `- /${K.name}: ${K.description}`).join(`
`);
        B.push(`**Available plugin skills:**
${W}`)
      }
      let X = jQ();
      if (Object.keys(X).length > 0) {
        let W = eA(X, null, 2);
        B.push(`**User's settings.json:**
\`\`\`json
${W}
\`\`\``)
      }
      let I = BY5(),
        D = `${QY5}
${I}`;
      if (B.length > 0) return `${D}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${B.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
      return D
    }
  }
})
// @from(Ln 271838, Col 4)
C52 = () => {}
// @from(Ln 271839, Col 4)
U52 = w(() => {
  Wb()
})
// @from(Ln 271843, Col 0)
function ED0() {
  let A = [K52, $Y1, F52, MS, UY1];
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(z52);
  return A
}
// @from(Ln 271848, Col 4)
q52 = w(() => {
  V52();
  FD0();
  H52();
  wyA();
  HD0();
  $52();
  C52();
  U52()
})
// @from(Ln 271863, Col 0)
function N52(A, Q, B, G) {
  let Z = [],
    Y = vA();

  function J(X, I = []) {
    try {
      let D = Y.readdirSync(X);
      for (let W of D) {
        let K = GY5(X, W.name);
        if (W.isDirectory()) J(K, [...I, W.name]);
        else if (W.isFile() && W.name.endsWith(".md")) {
          let V = w52(K, Q, I, B, G);
          if (V) Z.push(V)
        }
      }
    } catch (D) {
      k(`Failed to scan agents directory ${X}: ${D}`, {
        level: "error"
      })
    }
  }
  return J(A), Z
}
// @from(Ln 271887, Col 0)
function w52(A, Q, B, G, Z) {
  let Y = vA();
  if (Py(Y, A, Z)) return null;
  try {
    let J = Y.readFileSync(A, {
        encoding: "utf-8"
      }),
      {
        frontmatter: X,
        content: I
      } = lK(J),
      D = X.name || ZY5(A).replace(/\.md$/, ""),
      K = [Q, ...B, D].join(":"),
      V = X.description || X["when-to-use"] || `Agent from ${Q} plugin`,
      F = M4A(X.tools),
      H = RS(X.skills),
      E = X.color,
      z = X.model,
      $ = X.forkContext,
      O = I.trim();
    return {
      agentType: K,
      whenToUse: V,
      tools: F,
      ...H !== void 0 ? {
        skills: H
      } : {},
      getSystemPrompt: () => O,
      source: "plugin",
      color: E,
      model: z,
      filename: D,
      plugin: G,
      ...{}
    }
  } catch (J) {
    return k(`Failed to load agent from ${A}: ${J}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 271929, Col 0)
function L52() {
  O4A.cache?.clear?.()
}
// @from(Ln 271932, Col 4)
O4A
// @from(Ln 271933, Col 4)
LyA = w(() => {
  Y9();
  DQ();
  GK();
  T1();
  Da();
  kd();
  O4A = W0(async () => {
    let {
      enabled: A,
      errors: Q
    } = await DG(), B = [];
    if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
    for (let G of A) {
      let Z = new Set;
      if (G.agentsPath) try {
        let Y = N52(G.agentsPath, G.name, G.source, Z);
        if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} agents from plugin ${G.name} default directory`)
      } catch (Y) {
        k(`Failed to load agents from plugin ${G.name} default directory: ${Y}`, {
          level: "error"
        })
      }
      if (G.agentsPaths)
        for (let Y of G.agentsPaths) try {
          let X = vA().statSync(Y);
          if (X.isDirectory()) {
            let I = N52(Y, G.name, G.source, Z);
            if (B.push(...I), I.length > 0) k(`Loaded ${I.length} agents from plugin ${G.name} custom path: ${Y}`)
          } else if (X.isFile() && Y.endsWith(".md")) {
            let I = w52(Y, G.name, [], G.source, Z);
            if (I) B.push(I), k(`Loaded agent from plugin ${G.name} custom file: ${Y}`)
          }
        } catch (J) {
          k(`Failed to load agents from plugin ${G.name} custom path ${Y}: ${J}`, {
            level: "error"
          })
        }
    }
    return k(`Total plugin agents loaded: ${B.length}`), B
  })
})
// @from(Ln 271979, Col 0)
function p_(A) {
  return A.source === "built-in"
}
// @from(Ln 271983, Col 0)
function R52(A) {
  return A.source !== "built-in" && A.source !== "plugin"
}
// @from(Ln 271987, Col 0)
function qY1(A) {
  return A.source === "plugin"
}
// @from(Ln 271991, Col 0)
function mb(A) {
  let Q = A.filter((D) => D.source === "built-in"),
    B = A.filter((D) => D.source === "plugin"),
    G = A.filter((D) => D.source === "userSettings"),
    Z = A.filter((D) => D.source === "projectSettings"),
    Y = A.filter((D) => D.source === "policySettings"),
    J = A.filter((D) => D.source === "flagSettings"),
    X = [Q, B, G, Z, J, Y],
    I = new Map;
  for (let D of X)
    for (let W of D) I.set(W.agentType, W);
  return Array.from(I.values())
}
// @from(Ln 272005, Col 0)
function XY5(A) {
  let {
    name: Q,
    description: B,
    model: G
  } = A;
  if (!Q || typeof Q !== "string") return 'Missing required "name" field in frontmatter';
  if (!B || typeof B !== "string") return 'Missing required "description" field in frontmatter';
  if (G && typeof G === "string" && !aJA.includes(G)) return `Invalid model "${G}". Valid options: ${aJA.join(", ")}`;
  return "Unknown parsing error"
}
// @from(Ln 272017, Col 0)
function IY5(A, Q) {
  if (!A.hooks) return;
  let B = jb.safeParse(A.hooks);
  if (!B.success) {
    k(`Invalid hooks in agent '${Q}': ${B.error.message}`);
    return
  }
  return B.data
}
// @from(Ln 272027, Col 0)
function DY5(A, Q, B = "flagSettings") {
  try {
    let G = M52.parse(Q),
      Z = M4A(G.tools),
      Y = G.disallowedTools !== void 0 ? M4A(G.disallowedTools) : void 0,
      J = G.prompt;
    return {
      agentType: A,
      whenToUse: G.description,
      ...Z !== void 0 ? {
        tools: Z
      } : {},
      ...Y !== void 0 ? {
        disallowedTools: Y
      } : {},
      getSystemPrompt: () => J,
      source: B,
      ...G.model ? {
        model: G.model
      } : {},
      ...G.permissionMode ? {
        permissionMode: G.permissionMode
      } : {},
      ...G.mcpServers && G.mcpServers.length > 0 ? {
        mcpServers: G.mcpServers
      } : {},
      ...G.hooks ? {
        hooks: G.hooks
      } : {}
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    return k(`Error parsing agent '${A}' from JSON: ${Z}`), e(G instanceof Error ? G : Error(String(G))), null
  }
}
// @from(Ln 272063, Col 0)
function NY1(A, Q = "flagSettings") {
  try {
    let B = JY5.parse(A);
    return Object.entries(B).map(([G, Z]) => DY5(G, Z, Q)).filter((G) => G !== null)
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    return k(`Error parsing agents from JSON: ${G}`), e(B instanceof Error ? B : Error(String(B))), []
  }
}
// @from(Ln 272073, Col 0)
function WY5(A, Q, B, G, Z) {
  try {
    let {
      name: Y,
      description: J
    } = B;
    if (!Y || typeof Y !== "string" || !J || typeof J !== "string") {
      let S = `Agent file ${A} is missing required '${!Y||typeof Y!=="string"?"name":"description"}' in frontmatter`;
      return k(S), null
    }
    J = J.replace(/\\n/g, `
`);
    let {
      color: X,
      model: I,
      forkContext: D
    } = B;
    if (D !== void 0 && D !== "true" && D !== "false") {
      let b = `Agent file ${A} has invalid forkContext value '${D}'. Must be 'true', 'false', or omitted.`;
      k(b)
    }
    let W = D === "true";
    if (W && I !== "inherit") {
      let b = `Agent file ${A} has forkContext: true but model is not 'inherit'. Overriding to 'inherit'. Agents with forkContext must use model: inherit to avoid context length mismatch.`;
      k(b), I = "inherit"
    }
    let K = I && typeof I === "string" && aJA.includes(I);
    if (I && typeof I === "string" && !K) {
      let b = `Agent file ${A} has invalid model '${I}'. Valid options: ${aJA.join(", ")}`;
      k(b)
    }
    let V = B.permissionMode,
      F = V && NP.includes(V);
    if (V && !F) {
      let b = `Agent file ${A} has invalid permissionMode '${V}'. Valid options: ${NP.join(", ")}`;
      k(b)
    }
    let H = YY5(A, ".md"),
      E = M4A(B.tools),
      z = B.disallowedTools,
      $ = z !== void 0 ? M4A(z) : void 0,
      O = RS(B.skills),
      L = B.mcpServers,
      M;
    if (Array.isArray(L)) M = L.map((b) => {
      let S = O52.safeParse(b);
      if (S.success) return S.data;
      return k(`Agent file ${A} has invalid mcpServers item: ${eA(b)}. Error: ${S.error.message}`), null
    }).filter((b) => b !== null);
    let _ = IY5(B, Y),
      j = G.trim();
    return {
      baseDir: Q,
      agentType: Y,
      whenToUse: J,
      ...E !== void 0 ? {
        tools: E
      } : {},
      ...$ !== void 0 ? {
        disallowedTools: $
      } : {},
      ...O !== void 0 ? {
        skills: O
      } : {},
      ...M !== void 0 && M.length > 0 ? {
        mcpServers: M
      } : {},
      ..._ !== void 0 ? {
        hooks: _
      } : {},
      getSystemPrompt: () => j,
      source: Z,
      filename: H,
      ...X && typeof X === "string" && SN.includes(X) ? {
        color: X
      } : {},
      ...K ? {
        model: I
      } : {},
      ...F ? {
        permissionMode: V
      } : {},
      ...W ? {
        forkContext: W
      } : {}
    }
  } catch (Y) {
    let J = Y instanceof Error ? Y.message : String(Y);
    return k(`Error parsing agent from ${A}: ${J}`), e(Y instanceof Error ? Y : Error(String(Y))), null
  }
}
// @from(Ln 272164, Col 4)
O52
// @from(Ln 272164, Col 9)
M52
// @from(Ln 272164, Col 14)
JY5
// @from(Ln 272164, Col 19)
_52
// @from(Ln 272165, Col 4)
_S = w(() => {
  Y9();
  j9();
  Z0();
  T1();
  v1();
  kd();
  l2();
  EO();
  q52();
  wd();
  LyA();
  mL();
  D4A();
  A0();
  O52 = m.union([m.string(), m.record(m.string(), Rb)]), M52 = m.object({
    description: m.string().min(1, "Description cannot be empty"),
    tools: m.array(m.string()).optional(),
    disallowedTools: m.array(m.string()).optional(),
    prompt: m.string().min(1, "Prompt cannot be empty"),
    model: m.enum(aJA).optional(),
    permissionMode: m.enum(NP).optional(),
    mcpServers: m.array(O52).optional(),
    hooks: m.lazy(() => jb).optional()
  }), JY5 = m.record(m.string(), M52);
  _52 = W0(async (A) => {
    try {
      let Q = await bd("agents", A),
        B = [],
        G = Q.map(({
          filePath: I,
          baseDir: D,
          frontmatter: W,
          content: K,
          source: V
        }) => {
          let F = WY5(I, D, W, K, V);
          if (!F) {
            let H = XY5(W);
            return B.push({
              path: I,
              error: H
            }), k(`Failed to parse agent from ${I}: ${H}`), l("tengu_agent_parse_error", {
              error: H,
              location: V
            }), null
          }
          return F
        }).filter((I) => I !== null),
        Z = await O4A(),
        J = [...ED0(), ...Z, ...G],
        X = mb(J);
      for (let I of X)
        if (I.color) vVA(I.agentType, I.color);
      return {
        activeAgents: X,
        allAgents: J,
        failedFiles: B.length > 0 ? B : void 0
      }
    } catch (Q) {
      let B = Q instanceof Error ? Q.message : String(Q);
      k(`Error loading agent definitions: ${B}`), e(Q instanceof Error ? Q : Error(String(Q)));
      let G = ED0();
      return {
        activeAgents: G,
        allAgents: G,
        failedFiles: [{
          path: "unknown",
          error: B
        }]
      }
    }
  })
})
// @from(Ln 272240, Col 0)
function j52(A, Q, B, G, Z = !1) {
  if (!B || Object.keys(B).length === 0) return;
  let Y = 0;
  for (let J of _b) {
    let X = B[J];
    if (!X || X.length === 0) continue;
    let I = J;
    if (Z && J === "Stop") I = "SubagentStop", k(`Converting Stop hook to SubagentStop for ${G} (subagents trigger SubagentStop)`);
    for (let D of X) {
      let W = D.matcher ?? "",
        K = D.hooks;
      if (!K || K.length === 0) continue;
      for (let V of K) pZ1(A, Q, I, W, V), Y++
    }
  }
  if (Y > 0) k(`Registered ${Y} frontmatter hook(s) from ${G} for session ${Q}`)
}
// @from(Ln 272257, Col 4)
T52 = w(() => {
  GVA();
  vr();
  T1()
})
// @from(Ln 272262, Col 4)
OyA = w(() => {
  DQ();
  C0();
  fQ();
  A0();
  A0()
})
// @from(Ln 272269, Col 4)
wY1 = U((VY5) => {
  var KY5 = [65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
  VY5.REPLACEMENT_CHARACTER = "�";
  VY5.CODE_POINTS = {
    EOF: -1,
    NULL: 0,
    TABULATION: 9,
    CARRIAGE_RETURN: 13,
    LINE_FEED: 10,
    FORM_FEED: 12,
    SPACE: 32,
    EXCLAMATION_MARK: 33,
    QUOTATION_MARK: 34,
    NUMBER_SIGN: 35,
    AMPERSAND: 38,
    APOSTROPHE: 39,
    HYPHEN_MINUS: 45,
    SOLIDUS: 47,
    DIGIT_0: 48,
    DIGIT_9: 57,
    SEMICOLON: 59,
    LESS_THAN_SIGN: 60,
    EQUALS_SIGN: 61,
    GREATER_THAN_SIGN: 62,
    QUESTION_MARK: 63,
    LATIN_CAPITAL_A: 65,
    LATIN_CAPITAL_F: 70,
    LATIN_CAPITAL_X: 88,
    LATIN_CAPITAL_Z: 90,
    RIGHT_SQUARE_BRACKET: 93,
    GRAVE_ACCENT: 96,
    LATIN_SMALL_A: 97,
    LATIN_SMALL_F: 102,
    LATIN_SMALL_X: 120,
    LATIN_SMALL_Z: 122,
    REPLACEMENT_CHARACTER: 65533
  };
  VY5.CODE_POINT_SEQUENCES = {
    DASH_DASH_STRING: [45, 45],
    DOCTYPE_STRING: [68, 79, 67, 84, 89, 80, 69],
    CDATA_START_STRING: [91, 67, 68, 65, 84, 65, 91],
    SCRIPT_STRING: [115, 99, 114, 105, 112, 116],
    PUBLIC_STRING: [80, 85, 66, 76, 73, 67],
    SYSTEM_STRING: [83, 89, 83, 84, 69, 77]
  };
  VY5.isSurrogate = function (A) {
    return A >= 55296 && A <= 57343
  };
  VY5.isSurrogatePair = function (A) {
    return A >= 56320 && A <= 57343
  };
  VY5.getSurrogatePairCodePoint = function (A, Q) {
    return (A - 55296) * 1024 + 9216 + Q
  };
  VY5.isControlCodePoint = function (A) {
    return A !== 32 && A !== 10 && A !== 13 && A !== 9 && A !== 12 && A >= 1 && A <= 31 || A >= 127 && A <= 159
  };
  VY5.isUndefinedCodePoint = function (A) {
    return A >= 64976 && A <= 65007 || KY5.indexOf(A) > -1
  }
})
// @from(Ln 272330, Col 4)
LY1 = U((aOZ, P52) => {
  P52.exports = {
    controlCharacterInInputStream: "control-character-in-input-stream",
    noncharacterInInputStream: "noncharacter-in-input-stream",
    surrogateInInputStream: "surrogate-in-input-stream",
    nonVoidHtmlElementStartTagWithTrailingSolidus: "non-void-html-element-start-tag-with-trailing-solidus",
    endTagWithAttributes: "end-tag-with-attributes",
    endTagWithTrailingSolidus: "end-tag-with-trailing-solidus",
    unexpectedSolidusInTag: "unexpected-solidus-in-tag",
    unexpectedNullCharacter: "unexpected-null-character",
    unexpectedQuestionMarkInsteadOfTagName: "unexpected-question-mark-instead-of-tag-name",
    invalidFirstCharacterOfTagName: "invalid-first-character-of-tag-name",
    unexpectedEqualsSignBeforeAttributeName: "unexpected-equals-sign-before-attribute-name",
    missingEndTagName: "missing-end-tag-name",
    unexpectedCharacterInAttributeName: "unexpected-character-in-attribute-name",
    unknownNamedCharacterReference: "unknown-named-character-reference",
    missingSemicolonAfterCharacterReference: "missing-semicolon-after-character-reference",
    unexpectedCharacterAfterDoctypeSystemIdentifier: "unexpected-character-after-doctype-system-identifier",
    unexpectedCharacterInUnquotedAttributeValue: "unexpected-character-in-unquoted-attribute-value",
    eofBeforeTagName: "eof-before-tag-name",
    eofInTag: "eof-in-tag",
    missingAttributeValue: "missing-attribute-value",
    missingWhitespaceBetweenAttributes: "missing-whitespace-between-attributes",
    missingWhitespaceAfterDoctypePublicKeyword: "missing-whitespace-after-doctype-public-keyword",
    missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers: "missing-whitespace-between-doctype-public-and-system-identifiers",
    missingWhitespaceAfterDoctypeSystemKeyword: "missing-whitespace-after-doctype-system-keyword",
    missingQuoteBeforeDoctypePublicIdentifier: "missing-quote-before-doctype-public-identifier",
    missingQuoteBeforeDoctypeSystemIdentifier: "missing-quote-before-doctype-system-identifier",
    missingDoctypePublicIdentifier: "missing-doctype-public-identifier",
    missingDoctypeSystemIdentifier: "missing-doctype-system-identifier",
    abruptDoctypePublicIdentifier: "abrupt-doctype-public-identifier",
    abruptDoctypeSystemIdentifier: "abrupt-doctype-system-identifier",
    cdataInHtmlContent: "cdata-in-html-content",
    incorrectlyOpenedComment: "incorrectly-opened-comment",
    eofInScriptHtmlCommentLikeText: "eof-in-script-html-comment-like-text",
    eofInDoctype: "eof-in-doctype",
    nestedComment: "nested-comment",
    abruptClosingOfEmptyComment: "abrupt-closing-of-empty-comment",
    eofInComment: "eof-in-comment",
    incorrectlyClosedComment: "incorrectly-closed-comment",
    eofInCdata: "eof-in-cdata",
    absenceOfDigitsInNumericCharacterReference: "absence-of-digits-in-numeric-character-reference",
    nullCharacterReference: "null-character-reference",
    surrogateCharacterReference: "surrogate-character-reference",
    characterReferenceOutsideUnicodeRange: "character-reference-outside-unicode-range",
    controlCharacterReference: "control-character-reference",
    noncharacterCharacterReference: "noncharacter-character-reference",
    missingWhitespaceBeforeDoctypeName: "missing-whitespace-before-doctype-name",
    missingDoctypeName: "missing-doctype-name",
    invalidCharacterSequenceAfterDoctypeName: "invalid-character-sequence-after-doctype-name",
    duplicateAttribute: "duplicate-attribute",
    nonConformingDoctype: "non-conforming-doctype",
    missingDoctype: "missing-doctype",
    misplacedDoctype: "misplaced-doctype",
    endTagWithoutMatchingOpenElement: "end-tag-without-matching-open-element",
    closingOfElementWithOpenChildElements: "closing-of-element-with-open-child-elements",
    disallowedContentInNoscriptInHead: "disallowed-content-in-noscript-in-head",
    openElementsLeftAfterEof: "open-elements-left-after-eof",
    abandonedHeadElementChild: "abandoned-head-element-child",
    misplacedStartTagForHeadElement: "misplaced-start-tag-for-head-element",
    nestedNoscriptInHead: "nested-noscript-in-head",
    eofInElementThatCanContainOnlyText: "eof-in-element-that-can-contain-only-text"
  }
})
// @from(Ln 272394, Col 4)
y52 = U((oOZ, x52) => {
  var gVA = wY1(),
    zD0 = LY1(),
    R4A = gVA.CODE_POINTS;
  class S52 {
    constructor() {
      this.html = null, this.pos = -1, this.lastGapPos = -1, this.lastCharPos = -1, this.gapStack = [], this.skipNextNewLine = !1, this.lastChunkWritten = !1, this.endOfChunkHit = !1, this.bufferWaterline = 65536
    }
    _err() {}
    _addGap() {
      this.gapStack.push(this.lastGapPos), this.lastGapPos = this.pos
    }
    _processSurrogate(A) {
      if (this.pos !== this.lastCharPos) {
        let Q = this.html.charCodeAt(this.pos + 1);
        if (gVA.isSurrogatePair(Q)) return this.pos++, this._addGap(), gVA.getSurrogatePairCodePoint(A, Q)
      } else if (!this.lastChunkWritten) return this.endOfChunkHit = !0, R4A.EOF;
      return this._err(zD0.surrogateInInputStream), A
    }
    dropParsedChunk() {
      if (this.pos > this.bufferWaterline) this.lastCharPos -= this.pos, this.html = this.html.substring(this.pos), this.pos = 0, this.lastGapPos = -1, this.gapStack = []
    }
    write(A, Q) {
      if (this.html) this.html += A;
      else this.html = A;
      this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1, this.lastChunkWritten = Q
    }
    insertHtmlAtCurrentPos(A) {
      this.html = this.html.substring(0, this.pos + 1) + A + this.html.substring(this.pos + 1, this.html.length), this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1
    }
    advance() {
      if (this.pos++, this.pos > this.lastCharPos) return this.endOfChunkHit = !this.lastChunkWritten, R4A.EOF;
      let A = this.html.charCodeAt(this.pos);
      if (this.skipNextNewLine && A === R4A.LINE_FEED) return this.skipNextNewLine = !1, this._addGap(), this.advance();
      if (A === R4A.CARRIAGE_RETURN) return this.skipNextNewLine = !0, R4A.LINE_FEED;
      if (this.skipNextNewLine = !1, gVA.isSurrogate(A)) A = this._processSurrogate(A);
      if (!(A > 31 && A < 127 || A === R4A.LINE_FEED || A === R4A.CARRIAGE_RETURN || A > 159 && A < 64976)) this._checkForProblematicCharacters(A);
      return A
    }
    _checkForProblematicCharacters(A) {
      if (gVA.isControlCodePoint(A)) this._err(zD0.controlCharacterInInputStream);
      else if (gVA.isUndefinedCodePoint(A)) this._err(zD0.noncharacterInInputStream)
    }
    retreat() {
      if (this.pos === this.lastGapPos) this.lastGapPos = this.gapStack.pop(), this.pos--;
      this.pos--
    }
  }
  x52.exports = S52
})