/**
 * ReadTool — read a file from the local filesystem (text / image / PDF / notebook).
 *
 * Readable-source restoration of Claude Code v2.1.183. Logic-equivalent to the
 * 2.1.156 `hg`/`gJ4` Read tool; obf names re-derived against the 2.1.183 bundle.
 *
 * 2.1.183 regions covered (all @cli_inner_pretty.js):
 *   - name/description/prompt constants  : 152188-152245 (Bgi prompt builder, Ws/Rgi/OQe/GNr/Dgi/Ngi/Ogi/o0t)
 *   - input schema P3p + output schema M3p : 463440-463518 (text branch carries `truncatedByTokenCap` @463468)
 *   - tool object hg = pi({...})         : 463520-463650
 *   - validateInput                      : 463601-463644
 *   - call (dedup fast-path + dispatch)  : 463642-463700
 *   - read engine Del + PARTIAL-view     : 463130-463293 (truncation block @463238-463293)
 *   - token-cap guard Lel / Oae          : 463117-463125, class Oae @274924
 *   - line reader ept / YUp / ZUp        : 454540-454748 (KUp=10485760 small-file cap @454748)
 *   - cat -n nudge R3p / $gi / GNr       : 463106-463108, 152227(GNr)/152236($gi)
 *
 * 2.1.88 convention mirror : src/tools/FileReadTool/{FileReadTool.ts,prompt.ts,limits.ts}
 * 2.1.156 scaffold doc     : 04_tools/read_partial_view_and_streaming_exec.md (Part 1)
 *
 * Cross-validation note: the PARTIAL-view truncation block (line-shrink ×0.7/6 then
 * char-fallback, two verbatim banners, `isPartialView` persisted only when a banner was
 * produced) is byte-for-byte the 2.1.145/2.1.156 algorithm; re-read @463238-463293 in the
 * 183 bundle. NEW in 183: the `truncatedByTokenCap` output field on the `text` branch of
 * the output schema (@463468) — a programmatic partial-page signal that survives output
 * reconstruction (unlike the render-time `<system-reminder>` banner).
 */

import { z } from "zod/v4";
import { buildTool, type ToolUseContext } from "../Tool";
import { getCwd } from "../utils/cwd";
import { resolveToCwd } from "../utils/path"; // 2.1.183: Ds @ (absolute-path normalizer)
import { matchingRuleForInput, checkReadPermissionForTool } from "../utils/permissions/filesystem";

// 2.1.183: READ_TOOL_NAME = Ws @cli_inner_pretty.js:152217
const READ_TOOL_NAME = "Read";
// 2.1.183: GREP_TOOL_NAME = Uc @cli_inner_pretty.js:221419 (interpolated into PARTIAL banners)
const GREP_TOOL_NAME = "Grep";

// 2.1.183: DEFAULT_LINE_LIMIT = OQe @cli_inner_pretty.js:152225 — default whole-file line cap.
const DEFAULT_LINE_LIMIT = 2000;

// 2.1.183: MAX_PDF_PAGES_PER_REQUEST = xie @cli_inner_pretty.js (interpolated into schema + validateInput)
const MAX_PDF_PAGES_PER_REQUEST = 20;

// 2.1.183: SMALL_FILE_BYTE_CAP = KUp @cli_inner_pretty.js:454748 — files under this are read
// whole then sliced; larger files stream line-by-line via ZUp.
const SMALL_FILE_BYTE_CAP = 10485760;

// 2.1.183: PARTIAL_VIEW_PREFIX = o0t @cli_inner_pretty.js:152224 — banner prefix for a paginated
// partial view. The model-facing reminder is spliced ahead of the content as a <system-reminder>.
const PARTIAL_VIEW_PREFIX = "[Truncated: PARTIAL view — ";

// 2.1.183: SHORT_DESCRIPTION = Rgi @cli_inner_pretty.js:152226 (matches assets/tools/Read.md "## Description")
const SHORT_DESCRIPTION = "Read a file from the local filesystem.";

// 2.1.183: REREAD_NUDGE = Dgi @cli_inner_pretty.js:152218 — trailing bullet appended to both prompt branches.
const REREAD_NUDGE = `
- Do NOT re-read a file you just edited to verify — Edit/Write would have errored if the change failed, and the harness tracks file state for you.`;

// 2.1.183: CAT_N_NUDGE = GNr @cli_inner_pretty.js:152227 — the short "cat -n" line-format note.
const CAT_N_NUDGE = "- Results are returned using cat -n format, with line numbers starting at 1";

// 2.1.183: TARGETED_RANGE_NUDGE = Ngi @cli_inner_pretty.js:152231 — used when fileReadingLimits.targetedRangeNudge.
const TARGETED_RANGE_NUDGE =
  "- When you already know which part of the file you need, only read that part. This can be important for larger files.";
// 2.1.183: OFFSET_LIMIT_NUDGE = Ogi @cli_inner_pretty.js:152229 — default offset/limit suggestion.
const OFFSET_LIMIT_NUDGE =
  "- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters";

// ---------------------------------------------------------------------------
// Prompt builder — 2.1.183: Bgi @cli_inner_pretty.js:152188-152230
//   `t` = cat-n nudge (R3p(): $gi if tab-aware separator else GNr)
//   `n` = optional max-size suffix; `r` = targeted-range OR offset/limit nudge.
//   Compact-mode (Dg(e)) branch = "## Prompt --- branch 1 ---"; else "--- branch 2 ---".
// ---------------------------------------------------------------------------

function readPrompt(model: unknown, catNudge: string, maxSizeSuffix: string, rangeNudge: string): string {
  if (isLeanSystemPrompt(model)) {
    // @152190-152198 — verbatim "branch 1"; PDF clause gated on RQe() (PDF support available).
    return `Reads a file from the local filesystem.

- \`file_path\` must be an absolute path.
- Reads up to ${DEFAULT_LINE_LIMIT} lines by default${maxSizeSuffix}.
${rangeNudge}
${catNudge}
- Reads images (PNG, JPG, …) and presents them visually.${
      isPdfSupported()
        ? ' Reads PDFs via the `pages` parameter (e.g. "1-5", max 20 pages/request; required for PDFs over 10 pages).'
        : ""
    } Reads Jupyter notebooks (.ipynb) as cells with outputs.
- Reading a directory, a missing file, or an empty file returns an error or system reminder rather than content.${REREAD_NUDGE}`;
  }
  // @152200-152216 — verbatim "branch 2" (verbose legacy phrasing).
  return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${DEFAULT_LINE_LIMIT} lines starting from the beginning of the file${maxSizeSuffix}
${rangeNudge}
${catNudge}
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.${
    isPdfSupported()
      ? `
- This tool can read PDF files (.pdf). For large PDFs (more than 10 pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: "1-5"). Reading a large PDF without the pages parameter will fail. Maximum 20 pages per request.`
      : ""
  }
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.
- This tool can only read files, not directories. To list files in a directory, use the registered shell tool.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.${REREAD_NUDGE}`;
}

// 2.1.183: catNudge selector R3p @cli_inner_pretty.js:463106 — tab-aware separator? richer note : short note.
function catNudgeForPrompt(): string {
  // $gi (@152236) extends CAT_N_NUDGE with separator detail; falls back to CAT_N_NUDGE.
  return useTabAwareSeparator()
    ? `${CAT_N_NUDGE}. Each line is the line number, a single separator (a tab or \`:\`), then the verbatim file content (including any leading whitespace).`
    : CAT_N_NUDGE;
}

// ---------------------------------------------------------------------------
// Input schema — 2.1.183: P3p @cli_inner_pretty.js:463440-463455
// ---------------------------------------------------------------------------

const inputSchema = z.strictObject({
  file_path: z.string().describe("The absolute path to the file to read"),
  // @463443 — GB() wraps the optional in a "coercible optional" guard.
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("The line number to start reading from. Only provide if the file is too large to read at once"),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("The number of lines to read. Only provide if the file is too large to read at once."),
  // @463449 — pages describe interpolates the max-pages constant.
  pages: z
    .string()
    .optional()
    .describe(
      `Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${MAX_PDF_PAGES_PER_REQUEST} pages per request.`,
    ),
});

// 2.1.183: output schema M3p @cli_inner_pretty.js:463456-463518 — discriminatedUnion on `type`:
//   text | image | pdf | parts | notebook | file_unchanged.
// The `text` branch carries `truncatedByTokenCap` (@463468, NEW in 183).
const outputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    file: z.object({
      filePath: z.string().describe("The path to the file that was read"),
      content: z.string().describe("The content of the file"),
      numLines: z.number().describe("Number of lines in the returned content"),
      startLine: z.number().describe("The starting line number"),
      totalLines: z.number().describe("Total number of lines in the file"),
      // @463468 — NEW in 2.1.183.
      truncatedByTokenCap: z
        .boolean()
        .optional()
        .describe(
          "True when a whole-file read was auto-paginated because it exceeded the token cap (the content is a partial first page). A programmatic signal for internal consumers; survives output reconstruction (unlike the render-time banner).",
        ),
    }),
  }),
  // image / pdf / parts / notebook / file_unchanged branches omitted for brevity (schema-only).
  z.object({
    type: z.literal("file_unchanged"),
    file: z.object({ filePath: z.string().describe("The path to the file") }),
  }),
]);

type ReadInput = z.infer<typeof inputSchema>;

// ---------------------------------------------------------------------------
// Tool object — 2.1.183: hg = pi({...}) @cli_inner_pretty.js:463520-463650
// ---------------------------------------------------------------------------

export const ReadTool = buildTool({
  name: READ_TOOL_NAME,
  ruleContentField: "file_path",
  searchHint: "read files, images, PDFs, notebooks", // @463522
  maxResultSizeChars: Infinity, // @463523 (1 / 0)
  strict: true,

  async description() {
    return SHORT_DESCRIPTION;
  },

  // @463525-463531
  async prompt({ model }) {
    const limits = getFileReadingLimits();
    const maxSizeSuffix = limits.includeMaxSizeInPrompt
      ? `. Files larger than ${formatFileSize(limits.maxSizeBytes)} will return an error; use offset and limit for larger files`
      : "";
    const rangeNudge = limits.targetedRangeNudge ? TARGETED_RANGE_NUDGE : OFFSET_LIMIT_NUDGE;
    return readPrompt(model, catNudgeForPrompt(), maxSizeSuffix, rangeNudge);
  },

  get inputSchema() {
    return inputSchema;
  },
  get outputSchema() {
    return outputSchema;
  },

  // @463551-463556 — pure read tool.
  isConcurrencySafe() {
    return true;
  },
  isReadOnly() {
    return true;
  },

  toAutoClassifierInput(input: ReadInput) {
    return input.file_path;
  },
  isSearchOrReadCommand() {
    return { isSearch: false, isRead: true };
  },
  getPath({ file_path }: ReadInput) {
    return file_path || getCwd();
  },
  backfillObservableInput(input: ReadInput) {
    if (typeof input.file_path === "string") input.file_path = resolveToCwd(input.file_path);
  },

  // @463567 — file-path matcher for permission rule lookup.
  async preparePermissionMatcher({ file_path }: ReadInput) {
    return (rule: unknown) => filePathMatchesRule(rule, file_path);
  },
  // @463570-463572 — read-only permission helper.
  async checkPermissions(input: ReadInput, ctx: ToolUseContext) {
    return checkReadPermissionForTool(ReadTool, input, getToolPermissionContext(ctx));
  },

  // -------------------------------------------------------------------------
  // validateInput — 2.1.183 @cli_inner_pretty.js:463601-463644
  // -------------------------------------------------------------------------
  async validateInput({ file_path, pages }: ReadInput, ctx: ToolUseContext) {
    // (1) malformed `pages` — @463606, errorCode 7.
    if (pages !== undefined) {
      const range = parsePdfPageRange(pages);
      if (!range) {
        return {
          result: false,
          message: `Invalid pages parameter: "${pages}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`,
          errorCode: 7,
        };
      }
      // (2) page span too wide — @463614, errorCode 8.
      const span = range.lastPage === Infinity ? MAX_PDF_PAGES_PER_REQUEST + 1 : range.lastPage - range.firstPage + 1;
      if (span > MAX_PDF_PAGES_PER_REQUEST) {
        return {
          result: false,
          message: `Page range "${pages}" exceeds maximum of ${MAX_PDF_PAGES_PER_REQUEST} pages per request. Please use a smaller range.`,
          errorCode: 8,
        };
      }
    }

    const absPath = resolveToCwd(file_path);

    // (3) denied directory — @463620, errorCode 1.
    if (matchingRuleForInput(absPath, getToolPermissionContext(ctx), "read", "deny") !== null) {
      return {
        result: false,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1,
      };
    }

    // UNC / "//" paths short-circuit to OK — @463624.
    if (absPath.startsWith("\\\\") || absPath.startsWith("//")) return { result: true };

    const ext = extname(absPath).toLowerCase();

    // (4) binary file — @463629, errorCode 4. Guard: extension is binary AND not a supported
    // image/PDF AND not in the readable-binary allowlist (Pel).
    if (hasBinaryExtension(absPath) && !isPdfExtension(ext) && !READABLE_BINARY_EXTS.has(ext.slice(1))) {
      return {
        result: false,
        message: `This tool cannot read binary files. The file appears to be a binary ${ext} file. Please use appropriate tools for binary file analysis.`,
        errorCode: 4,
      };
    }

    // (5) device / special file that would block or stream forever — @463637, errorCode 9.
    if (isBlockingDeviceFile(absPath)) {
      return {
        result: false,
        message: `Cannot read '${file_path}': this device file would block or produce infinite output.`,
        errorCode: 9,
      };
    }

    return { result: true };
  },

  // -------------------------------------------------------------------------
  // call — 2.1.183 @cli_inner_pretty.js:463642-463700
  //   Dedup fast-path (skips partial views) → skill-dir trigger scan → Del engine.
  // -------------------------------------------------------------------------
  async call({ file_path, offset = 1, limit, pages }: ReadInput, ctx, _extra, msgCtx) {
    const { readFileState, fileReadingLimits } = ctx;
    const limits = getFileReadingLimits();
    const maxSizeBytes = fileReadingLimits?.maxSizeBytes ?? limits.maxSizeBytes;
    const maxTokens = fileReadingLimits?.maxTokens ?? limits.maxTokens;

    const ext = extname(file_path).toLowerCase().slice(1);
    const absPath = resolveToCwd(file_path);
    const prior = readFileState.get(absPath);
    if (prior) {
      logEvent("tengu_file_read_reread", { priorOp: prior.offset === undefined ? "edit_write" : "read" });
    }

    // Dedup fast-path — @463655-463666. Killswitch: tengu_read_dedup_killswitch.
    // CRITICAL: only fires when `!prior.isPartialView` — a partial view must never dedup to
    // file_unchanged, or the unseen tail is hidden forever.
    const dedupCandidate = getFeatureGate("tengu_read_dedup_killswitch", false) ? undefined : readFileState.get(absPath);
    if (dedupCandidate && !dedupCandidate.isPartialView && dedupCandidate.offset !== undefined) {
      if (dedupCandidate.offset === offset && dedupCandidate.limit === limit) {
        try {
          if ((await getMtimeMs(absPath)) === dedupCandidate.timestamp) {
            const dedupExt = analyticsExtForFile(absPath);
            logEvent("tengu_file_read_dedup", { ...(dedupExt !== undefined && { ext: dedupExt }) });
            return { data: { type: "file_unchanged", file: { filePath: file_path } } };
          }
        } catch {
          /* mtime lookup failed → fall through to real read */
        }
      }
    }

    // Conditional skill-dir trigger scan (skipped under CLAUDE_CODE_SIMPLE) — @463669-463680.
    const cwd = getCwd();
    if (!process.env.CLAUDE_CODE_SIMPLE) {
      const triggered = await discoverSkillDirsForPaths([absPath], cwd);
      if (triggered.length > 0) {
        const dynamicTriggers = ctx.dynamicSkillDirTriggers;
        if (dynamicTriggers) for (const dir of triggered) if (!dynamicTriggers.includes(dir)) dynamicTriggers.push(dir);
        activateConditionalSkillsForPaths(triggered).catch(() => {});
      }
      addSkillDirectories([absPath], cwd);
    }

    // Dispatch to the read engine; on ENOENT retry the case-insensitive fallback, else throw
    // a "File does not exist. <cwd note> <cwd>. Did you mean …?" error — @463681-463699.
    try {
      return await readFileBody(file_path, absPath, absPath, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, ctx, msgCtx?.message.id);
    } catch (err) {
      if (getErrnoCode(err) === "ENOENT") {
        const ciFallback = findCaseInsensitivePath(absPath);
        if (ciFallback) {
          try {
            return await readFileBody(file_path, absPath, ciFallback, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, ctx, msgCtx?.message.id);
          } catch (inner) {
            if (!isENOENT(inner)) throw inner;
          }
        }
        const suggestUnderCwd = suggestPathUnderCwd(absPath);
        const similar = await findSimilarFile(absPath);
        let message = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
        if (similar) message += ` Did you mean ${similar}?`;
        else if (suggestUnderCwd) message += ` Did you mean ${suggestUnderCwd}?`;
        throw new FileSystemError(message, "File does not exist");
      }
      throw err;
    }
  },
});

// ===========================================================================
// PARTIAL-view truncation — 2.1.183: inside Del @cli_inner_pretty.js:463238-463293
//
// For a whole-file text read that overruns the model-facing token cap, instead of
// hard-failing we return a fitted prefix + an executable paging banner, and persist the
// cached read-state with isPartialView:true so Edit/Write/dedup refuse to treat it as a
// complete read. This is the load-bearing reconstructed core.
// ===========================================================================

interface ReadState {
  content: string;
  timestamp: number;
  offset: number;
  limit: number | undefined;
  isPartialView?: boolean;
}

function applyTokenCapTruncation(
  content: string,
  totalLines: number,
  offset: number,
  limit: number | undefined,
  pages: string | undefined,
  maxTokens: number,
  ext: string,
): { excerpt: string; numLines: number; effectiveLimit: number | undefined; banner: string | undefined } {
  let excerpt = content;
  let numLines = totalLines;
  let effectiveLimit = limit;
  let banner: string | undefined;

  // Eligibility gate — @463243. Only an implicit whole-file read (offset<=1, no limit, no
  // pages) is salvaged; an explicit window failing the cap is a genuine "window too big".
  const isWholeFileRead = (offset ?? 1) <= 1 && limit === undefined && pages === undefined;

  try {
    ensureUnderTokenCap(content, ext, maxTokens); // throws TokenCapExceeded — Lel @463117
  } catch (err) {
    if (err instanceof TokenCapExceeded && isWholeFileRead) {
      const lines = content.split("\n");
      // charsPerToken: calibrate the estimator to THIS file's bytes/token ratio (floor 0.5).
      const charsPerToken = Math.max(0.5, content.length / Math.max(1, err.tokenCount)); // @463249
      const estTokens = (s: string) => s.length / charsPerToken;

      // Initial line guess: lines * (cap/fullCount) * 0.85 margin — @463251.
      let keepLines = Math.max(
        1,
        Math.min(lines.length, Math.floor(((lines.length * maxTokens) / Math.max(1, err.tokenCount)) * 0.85)),
      );
      let pageExcerpt = lines.slice(0, keepLines).join("\n");

      // Geometric line shrink ×0.7, ≤6 iterations — @463253-463259.
      for (let i = 0; i < 6; i++) {
        if (estTokens(pageExcerpt) <= maxTokens || keepLines <= 1) break;
        keepLines = Math.max(1, Math.floor(keepLines * 0.7));
        pageExcerpt = lines.slice(0, keepLines).join("\n");
      }

      // Char fallback for "one giant line" files (line paging can't help / blank) — @463261-463270.
      let isCharTruncated = false;
      if (estTokens(pageExcerpt) > maxTokens || pageExcerpt.trim() === "") {
        let keepChars = Math.max(1, Math.floor(maxTokens * charsPerToken * 0.85));
        for (let i = 0; i < 6; i++) {
          pageExcerpt = content.slice(0, keepChars);
          if (estTokens(pageExcerpt) <= maxTokens) break;
          keepChars = Math.max(1, Math.floor(keepChars * 0.7));
        }
        // Don't cut through a UTF-16 surrogate pair — @463269.
        const lastCode = pageExcerpt.charCodeAt(pageExcerpt.length - 1);
        if (lastCode >= 0xd800 && lastCode <= 0xdbff) pageExcerpt = pageExcerpt.slice(0, -1);
        isCharTruncated = true;
      }

      excerpt = pageExcerpt;
      numLines = isCharTruncated ? countOccurrences(pageExcerpt, "\n") + 1 : keepLines;
      effectiveLimit = numLines;

      // Two verbatim banner phrasings — @463282-463284. Both begin with PARTIAL_VIEW_PREFIX.
      banner =
        !isCharTruncated && numLines < totalLines
          ? PARTIAL_VIEW_PREFIX +
            `showing lines 1-${numLines} of ${totalLines} total (${err.tokenCount} tokens, cap ${maxTokens}). Call ${READ_TOOL_NAME} with offset=${numLines + 1} limit=${numLines} for the next page, or ${GREP_TOOL_NAME} to find a specific section. Do NOT answer from this page alone if the answer may be further in the file.]`
          : PARTIAL_VIEW_PREFIX +
            `showing the first ${excerpt.length} of ${content.length} characters (${err.tokenCount} tokens, cap ${maxTokens}); this file has very long lines and cannot be paginated by line. Use ${GREP_TOOL_NAME} to find a specific section, or ${READ_TOOL_NAME} with offset/limit to page through it. Do NOT answer from this excerpt alone if the answer may be elsewhere in the file.]`;
    } else {
      throw err;
    }
  }

  return { excerpt, numLines, effectiveLimit, banner };
}

// Persist read-state — @463289. isPartialView is set ONLY when a banner was produced.
function persistReadState(
  readFileState: Map<string, ReadState>,
  key: string,
  excerpt: string,
  mtimeMs: number,
  offset: number,
  effectiveLimit: number | undefined,
  banner: string | undefined,
): void {
  readFileState.set(key, {
    content: excerpt,
    timestamp: Math.floor(mtimeMs),
    offset,
    limit: effectiveLimit,
    ...(banner !== undefined && { isPartialView: true }),
  });
}

// 2.1.183: TokenCapExceeded = Oae @cli_inner_pretty.js:274924 — carries tokenCount + cap.
class TokenCapExceeded extends Error {
  constructor(public tokenCount: number, public cap: number) {
    super(`Token cap exceeded: ${tokenCount} > ${cap}`);
  }
}

// 2.1.183: ensureUnderTokenCap = Lel @cli_inner_pretty.js:463117-463125
//   Fast path: skip the precise tokenizer if the cheap estimate is under cap/4.
function ensureUnderTokenCap(content: string, ext: string, maxTokensOverride?: number): void {
  const maxTokens = maxTokensOverride ?? getFileReadingLimits().maxTokens;
  const cheapEstimate = roughTokenCountEstimationForFileType(content, ext); // ROi @463119 (def @220297)
  if (!cheapEstimate || cheapEstimate <= maxTokens / 4) return;
  const preciseCount = countTokensWithAPI(content) ?? cheapEstimate; // Sel @463122
  if (preciseCount > maxTokens) throw new TokenCapExceeded(preciseCount, maxTokens);
}

// ===========================================================================
// Line-format / line-reader helper — 2.1.183: ept @cli_inner_pretty.js:454540-454556
//
// ept(path, startLine=0, limit, byteCap, signal, opts): small files (< SMALL_FILE_BYTE_CAP)
// are read whole then sliced by YUp (@454558); larger files stream via ZUp (@454718). YUp
// strips a BOM, normalizes \r\n → \n, counts lines, and truncates at the byte cap
// (truncatedByBytes). Returns { content, lineCount, totalLines, totalBytes, readBytes,
// mtimeMs, truncatedByBytes }. The cat -n line numbering is applied at render time by the
// Del formatter (using CAT_N_NUDGE / addLineNumbers), NOT here.
// ===========================================================================

interface LineReadResult {
  content: string;
  lineCount: number;
  totalLines: number;
  totalBytes: number;
  readBytes: number;
  mtimeMs: number;
  truncatedByBytes: boolean;
}

// Reconstructed core of the small-file slice path (YUp). helper: ZUp @454718 — large-file
// streaming variant (same contract); summarized.
function sliceLinesFromWholeFile(
  raw: Buffer,
  startLine: number,
  limit: number | undefined,
  byteCap: number | undefined,
): { content: string; lineCount: number; totalLines: number; truncatedByBytes: boolean } {
  let text = raw.toString("utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  text = text.replace(/\r\n/g, "\n"); // normalize line endings

  const allLines = text.split("\n");
  const totalLines = allLines.length;
  let selected = allLines.slice(startLine, limit !== undefined ? startLine + limit : undefined);

  let truncatedByBytes = false;
  if (byteCap !== undefined) {
    let joined = selected.join("\n");
    if (Buffer.byteLength(joined, "utf8") > byteCap) {
      truncatedByBytes = true;
      while (selected.length > 0 && Buffer.byteLength(selected.join("\n"), "utf8") > byteCap) selected.pop();
      joined = selected.join("\n");
    }
    return { content: joined, lineCount: selected.length, totalLines, truncatedByBytes };
  }
  return { content: selected.join("\n"), lineCount: selected.length, totalLines, truncatedByBytes };
}

// ---------------------------------------------------------------------------
// Helper declarations (source-anchored; deep bodies summarized).
// ---------------------------------------------------------------------------

// helper: Del @cli_inner_pretty.js:463130 — read engine. Branches by extension:
//   ipynb → notebook (with a Bash/PowerShell jq nudge when too large @463137-463149),
//   image (Pel.has(ext)), pdf ($Qe(ext)), else text via ept + applyTokenCapTruncation.
declare function readFileBody(
  filePath: string,
  absPath: string,
  resolvedPath: string,
  ext: string,
  offset: number,
  limit: number | undefined,
  pages: string | undefined,
  maxSizeBytes: number,
  maxTokens: number,
  readFileState: Map<string, ReadState>,
  ctx: ToolUseContext,
  messageId?: string,
): Promise<unknown>;

// helper: ept @454540 — line reader entrypoint (small vs streaming dispatch).
declare function readLines(
  path: string,
  startLine: number,
  limit: number | undefined,
  byteCap: number | undefined,
  signal: AbortSignal,
  opts?: unknown,
): Promise<LineReadResult>;

// Trivial / shared helpers (anchored, declared).
declare function isLeanSystemPrompt(model: unknown): boolean; // Dg
declare function isPdfSupported(): boolean; // RQe
declare function isPdfExtension(ext: string): boolean; // $Qe
declare function useTabAwareSeparator(): boolean; // N2e
declare function getFileReadingLimits(): { maxTokens: number; maxSizeBytes: number; includeMaxSizeInPrompt: boolean; targetedRangeNudge: boolean }; // Tge
declare function formatFileSize(bytes: number): string; // $a
declare function extname(p: string): string; // path.extname
declare function hasBinaryExtension(p: string): boolean; // BEt
declare const READABLE_BINARY_EXTS: Set<string>; // Pel — readable-binary extension allowlist
declare function isBlockingDeviceFile(p: string): boolean; // x3p
declare function parsePdfPageRange(pages: string): { firstPage: number; lastPage: number } | null; // jNr
declare function getToolPermissionContext(ctx: ToolUseContext): unknown; // Br
declare function filePathMatchesRule(rule: unknown, filePath: string): boolean; // uye
declare function getMtimeMs(p: string): Promise<number>; // z$e
declare function analyticsExtForFile(p: string): string | undefined; // jse
declare function discoverSkillDirsForPaths(paths: string[], cwd: string): Promise<string[]>; // tut
declare function activateConditionalSkillsForPaths(dirs: string[]): Promise<void>; // nut
declare function addSkillDirectories(paths: string[], cwd: string): void; // rut
declare function findCaseInsensitivePath(p: string): string | undefined; // L3p
declare function suggestPathUnderCwd(p: string): string | undefined; // Dze
declare function findSimilarFile(p: string): Promise<string | undefined>; // uoe
declare function countOccurrences(s: string, needle: string): number; // Fu
declare function roughTokenCountEstimationForFileType(content: string, ext: string): number | undefined; // ROi
declare function countTokensWithAPI(content: string): number | undefined; // Sel
declare function getErrnoCode(err: unknown): string | undefined; // dn
declare function isENOENT(err: unknown): boolean; // Pn
declare function getFeatureGate(name: string, fallback: boolean): boolean; // ct
declare function logEvent(name: string, data?: Record<string, unknown>): void; // G
declare const FILE_NOT_FOUND_CWD_NOTE: string; // bN
declare class FileSystemError extends Error {
  constructor(message: string, code: string);
} // Bl
