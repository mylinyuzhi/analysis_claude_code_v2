/**
 * REPLTool — JavaScript REPL with programmatic access to Claude Code tools (contract-level reconstruction).
 *
 * Logic-equivalent to v2.1.156 REPL tool; obf ids RE-DERIVED for v2.1.183 by string-anchoring the name
 * const (`PA="REPL"`), the search hint "execute JavaScript with programmatic tool access", and the input
 * schema thunk `FPp` onto the single `wpo = pi({...})` tool object.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - name const            `PA`                       @221566
 *   - default agent id      `TUe = "main"`             @221567
 *   - enable gate           `nI`                       @221558-221564
 *   - input schema          `FPp`                      @427520-427531
 *   - output schema         `UPp`                      @427531-427546
 *   - block-bearing fields  `GPp` (Set)                @427547
 *   - tool object           `wpo = pi({...})`          @427548-427801
 *   - description builder   `a9a`                      @425538-425542
 *   - prompt builder        `i9a`                      @425443-425537
 *   - maxResultSizeChars    `q9a` (getter)             @427408-427411
 *   - code pre-validate     `tMp` (no-op)              @427481-427483
 *   - timeouts              `jPp=30000` / `G3n=600000` @427488 / @427489
 *
 * 2.1.88 convention mirror: src/tools/REPLTool/{constants.ts,primitiveTools.ts}
 * 2.1.156 scaffold: 04_tools/README.md (REPL tool)
 *
 * Cross-validation note: re-read `wpo` @427548 in the 183 bundle — confirmed `checkPermissions` returns
 * `{behavior:"allow"}` unconditionally (@427578-427580), `isReadOnly()`/`isConcurrencySafe()` both false
 * (@427569-427574), `isEnabled() { return nI() }` (@427566-427568), and `isTransparentWrapper() { return !0 }`
 * (@427742). Prompt / description text confirmed against assets/tools/REPL.md and re-read from `i9a`/`a9a`.
 */

import { z } from "zod";
import type { Tool, ToolUseContext, PermissionResult } from "../Tool";

// ───────────────────────────────────────────────────────────────────────────
// Identity / constants
// ───────────────────────────────────────────────────────────────────────────

// 2.1.183: TOOL_NAME = PA @cli_inner_pretty.js:221566
export const REPL_TOOL_NAME = "REPL";

// 2.1.183: DEFAULT_AGENT_ID = TUe @cli_inner_pretty.js:221567 — REPL contexts are keyed per agent.
const DEFAULT_AGENT_ID = "main";

// 2.1.183: DEFAULT_TIMEOUT_MS = jPp @cli_inner_pretty.js:427488
const DEFAULT_TIMEOUT_MS = 30000;
// 2.1.183: HARD_WALL_CLOCK_LIMIT_MS = G3n @cli_inner_pretty.js:427489 — also the schema's stated max.
const HARD_WALL_CLOCK_LIMIT_MS = 600000;

// 2.1.183: BLOCK_BEARING_RESULT_FIELDS = GPp @cli_inner_pretty.js:427547
//   the output fields that carry renderable blocks: stdout, stderr, error, result.
const BLOCK_BEARING_RESULT_FIELDS = new Set(["stdout", "stderr", "error", "result"]);

// ───────────────────────────────────────────────────────────────────────────
// Enable gate
// ───────────────────────────────────────────────────────────────────────────

/**
 * isEnabled gate for the REPL tool.
 * 2.1.183: nI @cli_inner_pretty.js:221558-221564
 *   - Requires the base feature predicate (`$3()`).
 *   - Env override: CLAUDE_CODE_REPL=falsey disables; =truthy enables (explicit opt-out / opt-in).
 *   - Otherwise enabled only for the "cli"/"remote" entrypoints, behind the `tengu_slate_harbor`
 *     statsig gate (default false).
 */
// 2.1.183: isReplEnabled = nI @cli_inner_pretty.js:221558
export function isReplEnabled(): boolean {
  if (!isBaseFeatureAvailable()) return false; // $3()
  if (isFalsey(process.env.CLAUDE_CODE_REPL)) return false; // yl(...)
  if (isTruthy(process.env.CLAUDE_CODE_REPL)) return true; // st(...)
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  if (entrypoint === "cli" || entrypoint === "remote") {
    return getGateValue("tengu_slate_harbor", false); // ct(...)
  }
  return false;
}

// ───────────────────────────────────────────────────────────────────────────
// Input / output schema
// ───────────────────────────────────────────────────────────────────────────

/**
 * Input schema.
 * 2.1.183: FPp = we(() => H.strictObject({...})) @cli_inner_pretty.js:427520-427531
 */
const inputSchema = z.strictObject({
  // @427521
  code: z
    .string()
    .describe(
      "JavaScript code to execute. Supports top-level await. State persists across calls.",
    ),
  // @427522-427525
  description: z
    .string()
    .optional()
    .describe(
      'Clear, concise description of what this script does in active voice (5-10 words). E.g. "Trace upgrade message to its GrowthBook flag"',
    ),
  // @427526
  timeout: z
    .number()
    .optional()
    .describe("Optional timeout in milliseconds (default 30000, max 600000)"),
});

type ReplInput = z.infer<typeof inputSchema>;

/**
 * Output schema.
 * 2.1.183: UPp = we(() => H.object({...})) @cli_inner_pretty.js:427531-427546
 */
const outputSchema = z.object({
  code: z.string().describe("The code that was executed"),
  result: z.unknown().describe("Return value from the code execution"),
  stdout: z.string().describe("Captured console.log output"),
  stderr: z.string().describe("Captured console.error output"),
  error: z.string().optional().describe("Error message if execution failed"),
  registeredTools: z
    .array(z.string())
    .optional()
    .describe("Names of tools registered during this execution"),
  images: z
    .array(z.object({ base64: z.string(), mediaType: z.string() }))
    .optional()
    .describe("Images returned by inner Read calls — surfaced as image content blocks"),
  documents: z
    .array(z.object({ base64: z.string() }))
    .optional()
    .describe("PDFs returned by inner Read calls — surfaced as document content blocks"),
});

// ───────────────────────────────────────────────────────────────────────────
// Description / prompt
// ───────────────────────────────────────────────────────────────────────────

/**
 * Description (two variants, gated on whether REPL is fully enabled).
 * 2.1.183: a9a @cli_inner_pretty.js:425538-425542
 */
// 2.1.183: buildReplDescription = a9a @cli_inner_pretty.js:425538
function buildReplDescription(): string {
  return isReplEnabled()
    ? "Execute JavaScript to read, write, edit files and run shell commands" // @425540
    : "Execute JavaScript code with access to Claude Code tools"; // @425541
}

/**
 * Prompt (two branches; the first is the dense-shorthand "investigation" prompt used when REPL is fully
 * enabled, the second is the simpler "programming interface" prompt).
 * 2.1.183: i9a @cli_inner_pretty.js:425443-425537
 *   - `e = nI()` selects the branch.
 *   - `t = Su()` (POSIX/bash available?) chooses the shell-tool name `n` (`ns`=Bash on POSIX,
 *     `Xs`=PowerShell otherwise) and the heredoc/quoting guidance.
 *   - `r = await cPp()` (is `gh` on PATH? @425550) toggles the `gh()` shorthand + `REPO` lines.
 *   - Tool-name interpolations in branch 1: `${Fa}`=Edit, `${xL}`=NotebookEdit.
 * Confirmed verbatim against assets/tools/REPL.md (## Prompt branches 1 & 2).
 */
// 2.1.183: buildReplPrompt = i9a @cli_inner_pretty.js:425443
async function buildReplPrompt(): Promise<string> {
  const fullyEnabled = isReplEnabled(); // nI()
  const posixShell = isPosixShellAvailable(); // Su()
  const shellToolName = posixShell ? "Bash" : "PowerShell"; // n = t ? ns : Xs
  const hasGh = await isGhOnPath(); // r = await cPp()

  // @425448 — PowerShell-specific shQuote guidance (used as the non-POSIX fallback in both branches).
  const powershellQuoteNote =
    "`shQuote(s)` is POSIX-only — for PowerShell, double the single quotes: `\"'\"+s.replaceAll(\"'\", \"''\")+\"'\"`. For multi-line input use a here-string `@'\\n...\\n'@` (closing `'@` at column 0).";

  // @425449 — heredoc example string, gh-aware (`gh pr edit ... <<'EOF'` vs `git commit -F - <<'EOF'`).
  const heredocExample = hasGh
    ? "gh pr edit N --body-file - <<'EOF'\\n\"+body+\"\\nEOF"
    : "git commit -F - <<'EOF'\\n\"+msg+\"\\nEOF";

  if (fullyEnabled) {
    // ── Branch 1: dense-shorthand investigation prompt ────────────────────────
    return `
REPL is your **only way** to investigate — shell, file reads, and code search all happen here via the shorthands below. Edit, Write, and Agent are still available as top-level tools for direct use.

**Aim for 1-3 REPL calls per turn** — over-fetch and batch.

## Dense scripts — every char is an output token

\`\`\`javascript
o.git=sh('git status')
for(const f of (await rgf('X','src')).slice(0,5)) o[f]=cat(f,1,300)
o
\`\`\`

\`o\` is pre-declared \`{}\`; assign results directly to \`o.key\` (no \`const x=\` then repack). Thenable \`o.*\` values are auto-awaited **at return only** — \`o.x=sh(c)\` needs no await, but a shorthand result used inline (concat, template, arg to another call) does: \`const c=await cat(f); put(f,c+s)\`, never \`put(f,cat(f)+s)\`. **End the script with bare \`o\`** (or a statement) to return the full object; ending on \`o.x=...\` returns just that one value. Relative paths resolve against cwd. No \`//\` comments — the \`description\` param is your comment. No blank lines, single-char vars.

## API
- \`sh(cmd,ms?)\` → stdout+stderr (merged — never write \`2>&1\` or \`2>/dev/null\`)
- \`cat(path,off?,lim?)\` → file content
- \`rg(pat,path?,{A,B,C,glob,head,type,i}?)\` → match text
- \`rgf(pat,path?,glob?)\` → matching file paths[]
- \`gl(pat,path?)\` → glob file paths[]
- \`put(path,content)\` → write file
${hasGh ? "- \\`gh(args)\\` → \\`sh('gh '+args)\\` with \\`-R \\${REPO}\\` injected\n" : ""}- \`chdir(path)\` — set cwd for this REPL call
- \`haiku(prompt,schema?)\` — one-turn model sampling
- \`registerTool(name,desc,schema,handler)\` / \`unregisterTool\` / \`listTools\` / \`getTool\`
- \`log\` (console.log) · \`str\` (JSON.stringify) · \`shQuote(s)\`${hasGh ? " · \\`REPO\\` ('owner/name')" : ""}
- \`await Edit({…})\` / \`await NotebookEdit({…})\` / \`await mcp__server__tool({…})\` (MCP tools by full name)

Shorthands never throw — \`sh\`/\`cat\`/\`rg\` return the error text on failure, \`rgf\`/\`gl\` return \`[]\`, never \`undefined\`. Permission-denied is a hard no — don't retry the same call; pivot or stop.

## Rules
- One investigation = one call. Put the next step in the code; grep→read→grep in one script. A failing inner call degrades the result, not the whole script.
- No \`import\`/\`require\`/\`process\`/Node globals — the VM context is sealed. ≥3 ops per call. Over-fetch (3-5 files, 3-4 patterns).
- Variables persist across calls. Last expression (or \`o\`) = return value. No top-level \`return\` — end with \`o\` and branch with \`if/else\` above it.
- Never re-invoke a stateful op (\`sh\`/\`Edit\`/\`put\`) to grab another field — \`git reset\`, \`rm\`, migrations run twice.
- ${
      posixShell
        ? `Don't \`put()\` to a temp file just to feed a shell command — pipe via heredoc instead: \`sh("${heredocExample}")\`. Generic temp paths get clobbered by parallel agents.`
        : powershellQuoteNote
    }
`;
  }

  // ── Branch 2: programming-interface prompt ──────────────────────────────────
  return `
REPL is your programming interface to Claude Code's tools. Use it to loop, branch, and compose tool calls with code.

## How to Use

Write JavaScript that calls tools as async functions:
\`\`\`javascript
const { filenames } = await Glob({ pattern: 'src/**/*.ts' })
for (const f of filenames) {
  const { file } = await Read({ file_path: f })
  if (file.content.includes('oldName')) {
    await Edit({ file_path: f, old_string: 'oldName', new_string: 'newName', replace_all: true })
  }
}
\`\`\`

**IMPORTANT: Batch ALL operations into ONE REPL call.** Don't make multiple separate REPL calls - write a complete script that does everything.

## Available Tools

All tools work as async functions: \`Read\`, \`Write\`, \`Edit\`, \`Glob\`, \`Grep\`, \`${shellToolName}\`, etc. MCP tools are callable by their full name (e.g. \`await mcp__slack__slack_send_message({...})\`).

\`\`\`javascript
const { filenames } = await Glob({ pattern: '*.ts' })
const { file } = await Read({ file_path: 'config.json' })
await Edit({ file_path: 'foo.ts', old_string: 'old', new_string: 'new' })
const { stdout } = await ${shellToolName}({ command: 'git status' })
\`\`\`

## Tips
- \`import\`/\`require\` don't work here — the vm context is sealed. For filesystem access use \`Read\`/\`Write\`/\`Glob\`; for shell use \`${shellToolName}\`.
- Use \`Promise.all()\` for parallel operations
- Variables persist across REPL calls
- Last expression is returned as the result
- \`haiku(prompt, schema?)\` — one-turn model sampling. Without schema returns text; with a JSON schema returns the parsed object.
- \`registerTool(name, desc, schema, handler)\` defines a new tool; \`unregisterTool(name)\`, \`listTools()\`, \`getTool(name)\` manage them
- ${
    posixShell
      ? `\`shQuote(s)\` quotes a string for Bash — use this instead of \`JSON.stringify\` (double quotes don't protect backticks or \`$\`)
- Don't write a temp file just to feed a shell command — pipe via heredoc: \`await ${shellToolName}({command: "${heredocExample}"})\`. Generic temp paths get clobbered by parallel agents.`
      : powershellQuoteNote
  }
`;
}

// ───────────────────────────────────────────────────────────────────────────
// maxResultSizeChars (dynamic)
// ───────────────────────────────────────────────────────────────────────────

/**
 * maxResultSizeChars getter — honours a `trim<N>k` model-name suffix, else defaults to 100k chars.
 * 2.1.183: q9a @cli_inner_pretty.js:427408-427411
 *   - Reads the active model id (`_1i()`); if it matches `/trim(\d+)k/`, the cap is `<N> * 1000` chars.
 *   - Otherwise 1e5 (100000).
 */
// 2.1.183: getReplMaxResultSizeChars = q9a @cli_inner_pretty.js:427408
function getReplMaxResultSizeChars(): number {
  const match = getActiveModelId()?.match(/trim(\d+)k/); // _1i()
  return match ? parseInt(match[1], 10) * 1000 : 1e5;
}

// ───────────────────────────────────────────────────────────────────────────
// Code pre-validation (no-op)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Pre-execution code validation hook — currently a no-op in 2.1.183.
 * 2.1.183: tMp @cli_inner_pretty.js:427481-427483 — `function tMp(e) { return; }`.
 */
// 2.1.183: validateReplCode = tMp @cli_inner_pretty.js:427481 — no-op
function validateReplCode(_code: string): void {
  return;
}

// ───────────────────────────────────────────────────────────────────────────
// Tool object
// ───────────────────────────────────────────────────────────────────────────

/**
 * The REPL tool.
 * 2.1.183: wpo = pi({...}) @cli_inner_pretty.js:427548-427801
 *   Header: searchHint:"execute JavaScript with programmatic tool access".
 *   maxResultSizeChars is a getter → `q9a()`.
 *   isReadOnly()/isConcurrencySafe() both false — the REPL can run arbitrary stateful tool calls.
 *   isTransparentWrapper() → true — REPL is treated as a pass-through wrapper around inner tool calls.
 *
 * checkPermissions: always `{behavior:"allow"}` (@427578-427580) — the REPL container itself is uncondition-
 *   ally permitted; each INNER tool call invoked from the script is permission-checked individually at runtime.
 *
 * `call` (summarized) @427581-427738 — load-bearing behavior:
 *   1. Resolve the per-agent REPL VM context (`getReplContexts()[agentId]`, default agent "main").
 *   2. `validateReplCode(code)` (tMp, no-op), clamp timeout to `min(timeout ?? 30000, 600000)`.
 *   3. Install two watchdogs:
 *      - SCRIPT-TIME watchdog (`JPp`, armed only while no inner tool is running): on fire →
 *        `REPL execution timed out after <ms>ms of script time (inner tool calls excluded). Script may
 *         still be running — avoid unbounded awaits.`
 *      - INNER-TOOL watchdog (`eMp`): on fire emits `tengu_repl_inner_watchdog_fired`, aborts, and
 *        rejects with `REPL inner tool call <name> exceeded <ms>ms watchdog (native timeout <...>). The
 *        call may be hung — try a shorter timeout on the tool itself.`
 *      - plus a HARD wall-clock guard at `G3n` (600000 ms): `REPL execution exceeded hard wall-clock
 *        limit of 600000ms. An inner tool call may be hung — …`.
 *   4. Reuse the VM context when `boundaryUuid` matches the first message uuid; otherwise build a fresh
 *      one and (re)hydrate state from the fork/resume log.
 *   5. Compile the (rewritten) code into a `vm.Script` (dynamic `import()` is disabled — throws "import()
 *      is not available in REPL code.") and run it in the sealed context; forward `bash_progress`/inner
 *      tool progress events; collect images/documents returned by inner Read calls.
 *   6. On success return `{ code, result, stdout, stderr, registeredTools?, images?, documents? }`
 *      (plus `newMessages`/`newTools`); pending-at-script-end inner calls append a
 *      "⚠ N tool call(s) still pending … Add 'await'." warning to stderr.
 *      On throw return `{ code, result:null, stdout, stderr, error }`, prepending inner-tool error
 *      summaries ("Inner tool errors (likely root cause): …") when present.
 */
// 2.1.183: REPLTool = wpo @cli_inner_pretty.js:427548
export const REPLTool: Tool<typeof inputSchema, typeof outputSchema> = {
  name: REPL_TOOL_NAME, // PA

  searchHint: "execute JavaScript with programmatic tool access",

  // @427551 — dynamic cap via q9a().
  get maxResultSizeChars() {
    return getReplMaxResultSizeChars();
  },

  async prompt(): Promise<string> {
    return buildReplPrompt(); // i9a
  },

  async description(): Promise<string> {
    return buildReplDescription(); // a9a
  },

  get inputSchema() {
    return inputSchema; // FPp
  },
  get outputSchema() {
    return outputSchema; // UPp
  },

  // @427566 — enabled iff the REPL gate passes.
  isEnabled(): boolean {
    return isReplEnabled(); // nI
  },

  isConcurrencySafe(): boolean {
    return false;
  },
  isReadOnly(): boolean {
    return false;
  },

  toAutoClassifierInput(input: ReplInput): string {
    return input.code;
  },

  // @427578-427580 — REPL container is always allowed; inner calls are checked individually at runtime.
  async checkPermissions(): Promise<PermissionResult> {
    return { behavior: "allow" };
  },

  userFacingName(): string {
    return "REPL";
  },

  // @427742 — REPL is a transparent wrapper around the inner tool calls it makes.
  isTransparentWrapper(): boolean {
    return true;
  },

  // call: see summary above — wpo.call @cli_inner_pretty.js:427581+.
  async *call() {
    /* summarized — see anchor block above */
  },
};

// ───────────────────────────────────────────────────────────────────────────
// Externally-provided helpers (defined elsewhere in the bundle)
// ───────────────────────────────────────────────────────────────────────────

// helper: $3 @bundle — base feature predicate;  yl/st @bundle — env falsey/truthy parsers
declare function isBaseFeatureAvailable(): boolean;
declare function isFalsey(value: string | undefined): boolean;
declare function isTruthy(value: string | undefined): boolean;
// helper: ct @bundle — statsig gate read with default;  Su @bundle — POSIX/bash shell available?
declare function getGateValue(gate: string, defaultValue: boolean): boolean;
declare function isPosixShellAvailable(): boolean;
// helper: cPp @cli_inner_pretty.js:425550 — is `gh` on PATH?  (await _A("gh") !== null)
declare function isGhOnPath(): Promise<boolean>;
// helper: _1i @cli_inner_pretty.js:221552 — active model id (for the `trim<N>k` cap suffix)
declare function getActiveModelId(): string | undefined;
