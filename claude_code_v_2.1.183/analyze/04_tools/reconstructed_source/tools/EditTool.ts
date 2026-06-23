/**
 * EditTool — exact string replacement in a single file.
 *
 * Readable-source restoration of Claude Code v2.1.183. Logic-equivalent to the
 * 2.1.156 FileEdit tool; obf names re-derived against the 2.1.183 bundle.
 *
 * 2.1.183 regions covered (all @cli_inner_pretty.js):
 *   - name const Fa + shared messages T_n/w_n    : 152083-152089
 *   - prompt builder gYa → ANp + mNp             : 444232-444255
 *   - input schema ZUn + output schema Blo        : 390017-390025
 *   - tool object kH = pi({...})                  : 444496-444545
 *   - checkPermissions (P0e)                       : 444538-444540
 *   - validateInput                                : 444546-444690
 *       · same-string / denied-dir / size / symlink: 444551-444579
 *       · ENOENT / create-collision / .ipynb redirect: 444596-444625
 *       · velvet-hammer not-read guard (NEW)        : 444627-444646
 *       · stale-read guard                          : 444647-444661
 *       · no-match / multi-match                    : 444662-444685
 *   - call (skill triggers → string replace → write): 444703+
 *
 * 2.1.88 convention mirror : src/tools/FileEditTool/{FileEditTool.ts,prompt.ts,utils.ts,constants.ts}
 * 2.1.156 scaffold doc     : 04_tools/read_partial_view_and_streaming_exec.md (Part 1, editPartialViewGuard)
 *
 * Cross-validation note: Edit uses behavior:"ask" on almost every failure (unlike Write,
 * which uses plain errors) so the model is re-prompted rather than hard-erroring. NEW in
 * 2.1.183: the `tengu_velvet_hammer` killswitch (@444625) — when the not-read guard would
 * fire, the gate (global OR per model-bucket) can SKIP it (guardSkipped:true in the
 * hypothetical telemetry). 0-count in the 2.1.156 before-bundle → genuinely new. Note the
 * subtle difference vs Write's velvet-mallet: Edit's skip does NOT require `!state` — a
 * partial-view entry can also be skipped past.
 */

import { z } from "zod/v4";
import { buildTool, type ToolUseContext } from "../Tool";
import { resolveToCwd } from "../utils/path"; // Ds
import { matchingRuleForInput, checkWritePermissionForTool } from "../utils/permissions/filesystem";

// 2.1.183: EDIT_TOOL_NAME = Fa @cli_inner_pretty.js:152083
const EDIT_TOOL_NAME = "Edit";
// 2.1.183: READ_TOOL_NAME = Ws / NOTEBOOK_EDIT_TOOL_NAME = xL — interpolated into prompt/errors.
const READ_TOOL_NAME = "Read";
const NOTEBOOK_EDIT_TOOL_NAME = "NotebookEdit";

// 2.1.183: NOT_READ_MESSAGE = T_n @cli_inner_pretty.js:152086 (shared verbatim across Write/Edit/NotebookEdit).
const NOT_READ_MESSAGE = "File has not been read yet. Read it first before writing to it.";
const STALE_READ_MESSAGE =
  "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.";

// 2.1.183: MAX_EDITABLE_FILE_SIZE = EYa @cli_inner_pretty.js (interpolated into the too-large error).
declare const MAX_EDITABLE_FILE_SIZE: number;

// ---------------------------------------------------------------------------
// Prompt builder — 2.1.183: gYa → ANp @cli_inner_pretty.js:444232-444255
//   Compact-mode (Dg) branch = assets/tools/Edit.md "--- branch 1 ---"; else "--- branch 2 ---".
//   Separator phrasing depends on the tab-aware-separator flag (N2e); branch 2's uniqueness
//   bullet `r` has a minimal-anchor variant gated on tengu_edit_minimalanchor_jrn.
// ---------------------------------------------------------------------------

function editPrompt(model: unknown): string {
  const tabAware = useTabAwareSeparator();
  if (isLeanSystemPrompt(model)) {
    // @444239-444243 — verbatim "branch 1".
    return `Performs exact string replacement in a file.

- You must ${READ_TOOL_NAME} the file in this conversation before editing, or the call will fail.
- \`old_string\` must match the file exactly, including indentation, and be unique — the edit fails otherwise. Strip the Read line prefix (${tabAware ? "line number + a single tab or `:`" : "line number + tab"}) before matching.
- \`replace_all: true\` replaces every occurrence instead.`;
  }
  // @444244-444253 — verbatim "branch 2".
  const prefix = tabAware ? "line number + a single separator character (a tab or `:`)" : "line number + tab";
  const uniquenessBullet = getFeatureGate("tengu_edit_minimalanchor_jrn", false)
    ? "\n- Keep `old_string` minimal — usually 1-3 lines, only enough to be unique in the file. Including excess context wastes tokens and is an error.\n- The edit will FAIL if `old_string` is not unique in the file. In that case, add the minimum extra context needed for uniqueness, or use `replace_all` to change every instance."
    : "\n- The edit will FAIL if `old_string` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use `replace_all` to change every instance of `old_string`.";
  return `Performs exact string replacements in files.

Usage:${usageReadBullet()}
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: ${prefix}. Everything after that is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.${uniquenessBullet}
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`;
}

// ---------------------------------------------------------------------------
// Input / output schema — 2.1.183: ZUn @cli_inner_pretty.js:390017, Blo @390030
// ---------------------------------------------------------------------------

const inputSchema = z.strictObject({
  file_path: z.string().describe("The absolute path to the file to modify"),
  old_string: z.string().describe("The text to replace"),
  new_string: z.string().describe("The text to replace it with (must be different from old_string)"),
  // @390021 — n0() wraps a defaulted optional boolean.
  replace_all: z.boolean().default(false).optional().describe("Replace all occurrences of old_string (default false)"),
});

type EditInput = z.infer<typeof inputSchema>;

declare const outputSchema: z.ZodTypeAny; // Blo — { oldStart, oldLines, ..., structuredPatch, ... }

// ---------------------------------------------------------------------------
// Tool object — 2.1.183: kH = pi({...}) @cli_inner_pretty.js:444496-444690
// ---------------------------------------------------------------------------

export const EditTool = buildTool({
  name: EDIT_TOOL_NAME,
  ruleContentField: "file_path",
  searchHint: "modify file contents in place", // @444499
  maxResultSizeChars: 1e5,
  strict: true,

  async description() {
    return "A tool for editing files"; // @444503 (matches assets/tools/Edit.md "## Description")
  },
  async prompt({ model }) {
    return editPrompt(model);
  },

  get inputSchema() {
    return inputSchema;
  },
  get outputSchema() {
    return outputSchema;
  },

  toAutoClassifierInput(input: EditInput) {
    return `${input.file_path}: ${input.new_string}`;
  },
  getPath(input: EditInput) {
    return input.file_path;
  },
  backfillObservableInput(input: EditInput) {
    if (typeof input.file_path === "string") input.file_path = resolveToCwd(input.file_path);
  },

  async preparePermissionMatcher({ file_path }: EditInput) {
    return (rule: unknown) => filePathMatchesRule(rule, file_path);
  },
  // @444538-444540 — write permission helper.
  async checkPermissions(input: EditInput, ctx: ToolUseContext) {
    return checkWritePermissionForTool(EditTool, input, getToolPermissionContext(ctx));
  },

  // -------------------------------------------------------------------------
  // validateInput — 2.1.183 @cli_inner_pretty.js:444546-444690
  // Note: nearly every failure carries behavior:"ask" so the model can self-correct.
  // -------------------------------------------------------------------------
  async validateInput(input: EditInput, ctx: ToolUseContext) {
    const { file_path, old_string, new_string, replace_all = false } = input;
    const absPath = resolveToCwd(file_path);

    // (1) shared denied-dir / outside-workspace pre-check — @444549, errorCode 12.
    const denied = deniedDirectoryPreCheck(absPath, ctx);
    if (denied) return { result: false, message: denied, errorCode: 12 };

    // (2) forbidden-content guard — @444551, errorCode 0.
    const contentGuardMessage = forbiddenContentMessage(absPath, new_string);
    if (contentGuardMessage) return { result: false, message: contentGuardMessage, errorCode: 0 };

    // (3) no-op edit — @444552, errorCode 1.
    if (old_string === new_string) {
      return {
        result: false,
        behavior: "ask",
        message: "No changes to make: old_string and new_string are exactly the same.",
        errorCode: 1,
      };
    }

    // (4) denied directory (rule lookup) — @444558, errorCode 2.
    if (matchingRuleForInput(absPath, getToolPermissionContext(ctx), "edit", "deny") !== null) {
      return {
        result: false,
        behavior: "ask",
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 2,
      };
    }

    // UNC / "//" short-circuit — @444566.
    if (absPath.startsWith("\\\\") || absPath.startsWith("//")) return { result: true };

    const fs = getFsImplementation();
    try {
      const { size, mode } = await fs.stat(absPath);
      // (5) too large — @444570, errorCode 10.
      if (size > MAX_EDITABLE_FILE_SIZE) {
        return {
          result: false,
          behavior: "ask",
          message: `File is too large to edit (${formatFileSize(size)}). Maximum editable file size is ${formatFileSize(MAX_EDITABLE_FILE_SIZE)}.`,
          errorCode: 10,
        };
      }
      // (6) symlink / Perforce read-only — @444576, errorCode 11.
      if (isReadOnlyModeBit(mode)) return { result: false, behavior: "ask", message: PERFORCE_READONLY_MESSAGE, errorCode: 11 };
    } catch (err) {
      if (!isENOENT(err)) throw err;
    }

    // Read current contents (UTF-16LE BOM aware), normalize line endings — @444584-444594.
    let diskContent: string | null;
    try {
      const bytes = await fs.readFileBytes(absPath);
      const encoding = bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe ? "utf16le" : "utf8";
      diskContent = bytes.toString(encoding).replaceAll("\r\n", "\n");
    } catch (err) {
      if (isENOENT(err)) diskContent = null;
      else throw err;
    }

    // (7) target missing — @444596, errorCode 4 (ask). An empty old_string means "create",
    // which is allowed for a missing file.
    if (diskContent === null) {
      if (old_string === "") return { result: true };
      const suggestUnderCwd = suggestPathUnderCwd(absPath);
      const similar = await findSimilarFile(absPath);
      let message = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
      if (similar) message += ` Did you mean ${similar}?`;
      else if (suggestUnderCwd) message += ` Did you mean ${suggestUnderCwd}?`;
      return { result: false, behavior: "ask", message, errorCode: 4 };
    }

    // (8) create-collision — @444604, errorCode 3. old_string==="" requires an empty file.
    if (old_string === "") {
      if (diskContent.trim() !== "") {
        return { result: false, behavior: "ask", message: "Cannot create new file - file already exists.", errorCode: 3 };
      }
      return { result: true };
    }

    // (9) notebook redirect — @444613, errorCode 5.
    if (absPath.endsWith(".ipynb")) {
      return {
        result: false,
        behavior: "ask",
        message: `File is a Jupyter Notebook. Use the ${NOTEBOOK_EDIT_TOOL_NAME} to edit this file.`,
        errorCode: 5,
      };
    }

    const state = ctx.readFileState.get(absPath);

    // (10) not-read guard — @444627-444646, errorCode 6 (ask). Missing OR partial view = not read.
    if (!state || state.isPartialView) {
      const layers = collectPermissionLayers(ctx);
      const modelBucket = modelBucketForLayers(layers);
      // velvet-hammer (NEW @444625): the gate (global OR per-bucket) can skip the guard.
      // Unlike Write's velvet-mallet, this does NOT require `!state`.
      const guardSkipped =
        getFeatureGate("tengu_velvet_hammer", false) || getFeatureGate(perModelGateName("tengu_velvet_hammer", layers), false);

      logEvent("tengu_edit_tool_not_read_hypothetical", {
        wouldHaveResult: classifyHypotheticalEdit(diskContent, old_string, replace_all),
        isPartialView: state?.isPartialView === true,
        isFilePathAbsolute: isAbsolutePath(file_path),
        guardSkipped,
        modelBucket,
      });

      if (!guardSkipped) {
        return {
          result: false,
          behavior: "ask",
          message: NOT_READ_MESSAGE,
          meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
          errorCode: 6,
        };
      }
    }

    // (11) stale-read guard — @444647-444661, errorCode 7 (ask). A whole-file byte-equal change
    // is tolerated; otherwise, if the edit would still apply cleanly post-change ("recovered"),
    // allow it, else block.
    if (state) {
      if (getMtimeSync(absPath) > state.timestamp) {
        const wholeFileByteEqual = (state.offset ?? 1) <= 1 && state.limit === undefined && contentMatchesCachedRead(state, diskContent);
        if (!wholeFileByteEqual) {
          const reapplied = reapplyEditAfterChange(diskContent, old_string, replace_all); // Pmo
          const recovered = editStillApplies(reapplied); // HYa
          logEvent("tengu_edit_tool_stale_read", { wouldHaveResult: classifyReapplied(reapplied), recovered });
          if (!recovered) {
            return { result: false, behavior: "ask", message: STALE_READ_MESSAGE, errorCode: 7 };
          }
        }
      }
    }

    // (12) no-match — @444662, errorCode 8 (ask). matchOldString (v0e) handles the \uXXXX
    // escape-swap retry; if it still fails AND the string contained such escapes, append a hint.
    const matched = matchOldString(diskContent, old_string);
    if (!matched) {
      const hint = containsUnicodeEscapes(old_string)
        ? `
(note: Edit also tried swapping \\uXXXX escapes and their characters; neither form matched, so the mismatch is likely elsewhere in old_string. Re-read the file and copy the exact surrounding text.)`
        : "";
      return {
        result: false,
        behavior: "ask",
        message: `String to replace not found in file.
String: ${old_string}${hint}`,
        meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)) },
        errorCode: 8,
      };
    }

    // (13) ambiguous match — @444677, errorCode 9 (ask). Multiple matches without replace_all.
    const matchCount = diskContent.split(matched).length - 1;
    if (matchCount > 1 && !replace_all) {
      return {
        result: false,
        behavior: "ask",
        message: `Found ${matchCount} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${old_string}`,
        meta: { isFilePathAbsolute: String(isAbsolutePath(file_path)), actualOldString: matched },
        errorCode: 9,
      };
    }

    // (14) post-edit validation hook (fYa) may surface its own error — @444688.
    const postEditError = validateEditResult(absPath, diskContent, () =>
      replace_all ? diskContent.replaceAll(matched, new_string) : diskContent.replace(matched, new_string),
    );
    if (postEditError !== null) return postEditError;

    // Success — pass the actually-matched old string back so call replaces the same thing.
    return { result: true, meta: { actualOldString: matched } };
  },

  // -------------------------------------------------------------------------
  // call — 2.1.183 @cli_inner_pretty.js:444703+
  //   Same edit pipeline as Write (skill triggers → beforeFileEdited → mkdir → history
  //   snapshot), then the string replace under the atomic per-path lock:
  //     replace_all ? content.replaceAll(old, new) : content.replace(old, new)
  // -------------------------------------------------------------------------
  // call: summarized — shares the Write pipeline; the load-bearing branch is the
  // replace_all vs single-replace choice and the actualOldString carried from validateInput.
  async call() {
    /* see WriteTool.call for the shared atomic-write pipeline; Edit applies the string
       replacement computed against actualOldString. */
    throw new Error("reconstruction stub — see anchor @444703");
  },
});

// ---------------------------------------------------------------------------
// Helper declarations (source-anchored; deep bodies summarized).
// ---------------------------------------------------------------------------

// 2.1.183: PERFORCE_READONLY_MESSAGE = kze @cli_inner_pretty.js:48727 (shared).
const PERFORCE_READONLY_MESSAGE =
  "File is read-only — it has not been opened for edit in Perforce. Run `p4 edit <file>` to check it out, then retry. Do not chmod the file writable; that bypasses Perforce tracking.";

import { getCwd } from "../utils/cwd";

declare function isLeanSystemPrompt(model: unknown): boolean; // Dg
declare function useTabAwareSeparator(): boolean; // N2e
declare function usageReadBullet(): string; // mNp — the "You must use your Read tool…" bullet
declare function deniedDirectoryPreCheck(absPath: string, ctx: ToolUseContext): string | undefined; // Xct
declare function forbiddenContentMessage(absPath: string, content: string): string | undefined; // k0n
declare function isReadOnlyModeBit(mode: number): boolean; // Lze
declare function formatFileSize(bytes: number): string; // $a
declare function getFsImplementation(): { stat(p: string): Promise<{ size: number; mode: number }>; readFileBytes(p: string): Promise<Buffer> }; // Ut
declare function collectPermissionLayers(ctx: ToolUseContext): unknown; // Bo(L0e(ctx))
declare function modelBucketForLayers(layers: unknown): string; // gxt
declare function perModelGateName(base: string, layers: unknown): string; // cJe
declare function contentMatchesCachedRead(state: { content: string }, onDisk: string): boolean; // hae
declare function classifyHypotheticalEdit(content: string, oldString: string, replaceAll: boolean): string; // SNp
declare function reapplyEditAfterChange(content: string, oldString: string, replaceAll: boolean): unknown; // Pmo
declare function editStillApplies(reapplied: unknown): boolean; // HYa
declare function classifyReapplied(reapplied: unknown): string; // vYa
declare function matchOldString(content: string, oldString: string): string | undefined; // v0e
declare function containsUnicodeEscapes(s: string): boolean; // nFa
declare function validateEditResult(absPath: string, content: string, apply: () => string): { result: boolean; behavior?: string; message?: string; errorCode?: number } | null; // fYa
declare function suggestPathUnderCwd(p: string): string | undefined; // Dze
declare function findSimilarFile(p: string): Promise<string | undefined>; // uoe
declare function getMtimeSync(p: string): number; // XJ
declare function getToolPermissionContext(ctx: ToolUseContext): unknown; // Br
declare function filePathMatchesRule(rule: unknown, filePath: string): boolean; // uye
declare function isAbsolutePath(p: string): boolean; // path.isAbsolute
declare function getFeatureGate(name: string, fallback: boolean): boolean; // ct
declare function logEvent(name: string, data?: Record<string, unknown>): void; // G
declare function isENOENT(err: unknown): boolean; // Pn
declare const FILE_NOT_FOUND_CWD_NOTE: string; // bN
