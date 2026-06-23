/**
 * NotebookEditTool — replace / insert / delete a single cell in a Jupyter notebook (.ipynb).
 *
 * Readable-source restoration of Claude Code v2.1.183. Logic-equivalent to the
 * 2.1.156 NotebookEdit tool; obf names re-derived against the 2.1.183 bundle.
 *
 * 2.1.183 regions covered (all @cli_inner_pretty.js):
 *   - name const xL                              : 221448
 *   - description oUa + prompt sUa               : 390868-390879
 *   - input schema Lwp + output schema Dwp        : 391008-391040
 *   - tool object wW = pi({...})                  : 391042-391090
 *   - checkPermissions (P0e)                       : 391086-391088
 *   - validateInput                                : 391105-391161
 *   - call (history snapshot → cell mutation → write): 391163-391230+
 *
 * 2.1.88 convention mirror : src/tools/NotebookEditTool/{NotebookEditTool.ts,prompt.ts,constants.ts}
 * 2.1.156 scaffold doc     : 04_tools/read_partial_view_and_streaming_exec.md (Part 1, isPartialView consumers)
 *
 * Cross-validation note: NotebookEdit's not-read guard (@391120, errorCode 9) is the simpler
 * `!state` form — there is NO velvet-mallet/velvet-hammer skip here and NO isPartialView
 * branch (notebooks are never partial-view truncated). The symlink/Perforce check is gated
 * on smr() (@391126). Re-read @391105-391161 in the 183 bundle.
 */

import { z } from "zod/v4";
import { buildTool, type ToolUseContext } from "../Tool";
import { resolveToCwd } from "../utils/path"; // Ds
import { extname } from "path";

// 2.1.183: NOTEBOOK_EDIT_TOOL_NAME = xL @cli_inner_pretty.js:221448
const NOTEBOOK_EDIT_TOOL_NAME = "NotebookEdit";
// 2.1.183: READ_TOOL_NAME = Ws — interpolated into the prompt.
const READ_TOOL_NAME = "Read";

// 2.1.183: DESCRIPTION = oUa @cli_inner_pretty.js:390868 (matches assets/tools/NotebookEdit.md "## Description").
const DESCRIPTION = "Edit a cell in a Jupyter notebook — replace, insert, or delete.";

// 2.1.183: PROMPT = sUa @cli_inner_pretty.js:390872-390879.
const PROMPT = `Replaces, inserts, or deletes a single cell in a Jupyter notebook (.ipynb file).

Usage:
- You must use the ${READ_TOOL_NAME} tool on the notebook in this conversation before editing — this tool will fail otherwise.
- \`notebook_path\` must be an absolute path.
- \`cell_id\` is the \`id\` attribute shown in the ${READ_TOOL_NAME} tool's \`<cell id="...">\` output. It is required for \`replace\` and \`delete\`.
- \`edit_mode\` defaults to \`replace\`. Use \`insert\` to add a new cell after the cell with the given \`cell_id\` (or at the beginning of the notebook if \`cell_id\` is omitted) — \`cell_type\` is required when inserting. Use \`delete\` to remove the cell.`;

// 2.1.183: PERFORCE_READONLY_MESSAGE = kze @cli_inner_pretty.js:48727 (shared with Write/Edit).
const PERFORCE_READONLY_MESSAGE =
  "File is read-only — it has not been opened for edit in Perforce. Run `p4 edit <file>` to check it out, then retry. Do not chmod the file writable; that bypasses Perforce tracking.";

// ---------------------------------------------------------------------------
// Input / output schema — 2.1.183: Lwp @cli_inner_pretty.js:391008, Dwp @391030
// ---------------------------------------------------------------------------

const inputSchema = z.strictObject({
  notebook_path: z
    .string()
    .describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
  cell_id: z
    .string()
    .optional()
    .describe(
      "The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified.",
    ),
  new_source: z.string().describe("The new source for the cell"),
  cell_type: z
    .enum(["code", "markdown"])
    .optional()
    .describe(
      "The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required.",
    ),
  edit_mode: z
    .enum(["replace", "insert", "delete"])
    .optional()
    .describe("The type of edit to make (replace, insert, delete). Defaults to replace."),
});

const outputSchema = z.object({
  new_source: z.string().describe("The new source code that was written to the cell"),
  cell_id: z.string().optional().describe("The ID of the cell that was edited"),
  cell_type: z.enum(["code", "markdown"]).describe("The type of the cell"),
  language: z.string().describe("The programming language of the notebook"),
  edit_mode: z.string().describe("The edit mode that was used"),
  error: z.string().optional().describe("Error message if the operation failed"),
  notebook_path: z.string().describe("The path to the notebook file"),
  original_file: z.string().describe("The original notebook content before modification"),
  updated_file: z.string().describe("The updated notebook content after modification"),
});

type NotebookEditInput = z.infer<typeof inputSchema>;

// ---------------------------------------------------------------------------
// Tool object — 2.1.183: wW = pi({...}) @cli_inner_pretty.js:391042-391230
// ---------------------------------------------------------------------------

export const NotebookEditTool = buildTool({
  name: NOTEBOOK_EDIT_TOOL_NAME,
  ruleContentField: "notebook_path",
  searchHint: "edit Jupyter notebook cells (.ipynb)", // @391045
  maxResultSizeChars: 1e5,
  shouldDefer: true, // @391047 — deferred tool (loaded on demand via ToolSearch)

  async description() {
    return DESCRIPTION;
  },
  async prompt() {
    return PROMPT;
  },

  backfillObservableInput(input: NotebookEditInput) {
    if (typeof input.notebook_path === "string") input.notebook_path = resolveToCwd(input.notebook_path);
  },
  // @391059-391061 — distinct user-facing name.
  userFacingName() {
    return "Edit Notebook";
  },

  get inputSchema() {
    return inputSchema;
  },
  get outputSchema() {
    return outputSchema;
  },

  toAutoClassifierInput(input: NotebookEditInput) {
    const mode = input.edit_mode ?? "replace";
    return `${input.notebook_path} ${mode}: ${input.new_source}`;
  },
  getPath(input: NotebookEditInput) {
    return input.notebook_path;
  },

  async preparePermissionMatcher({ notebook_path }: NotebookEditInput) {
    return (rule: unknown) => filePathMatchesRule(rule, notebook_path);
  },
  // @391086-391088 — write permission helper.
  async checkPermissions(input: NotebookEditInput, ctx: ToolUseContext) {
    return checkWritePermissionForTool(NotebookEditTool, input, getToolPermissionContext(ctx));
  },

  // -------------------------------------------------------------------------
  // validateInput — 2.1.183 @cli_inner_pretty.js:391105-391161
  // -------------------------------------------------------------------------
  async validateInput(
    { notebook_path, cell_type, cell_id, edit_mode = "replace" }: NotebookEditInput,
    ctx: ToolUseContext,
  ) {
    const absPath = resolveToCwd(notebook_path);

    // (1) shared denied-dir / outside-workspace pre-check — @391112, errorCode 12.
    const denied = deniedDirectoryPreCheck(absPath, ctx);
    if (denied) return { result: false, message: denied, errorCode: 12 };

    // UNC / "//" short-circuit — @391113.
    if (absPath.startsWith("\\\\") || absPath.startsWith("//")) return { result: true };

    // (2) not a .ipynb — @391114, errorCode 2.
    if (extname(absPath) !== ".ipynb") {
      return {
        result: false,
        message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
        errorCode: 2,
      };
    }

    // (3) bad edit_mode — @391116, errorCode 4.
    if (edit_mode !== "replace" && edit_mode !== "insert" && edit_mode !== "delete") {
      return { result: false, message: "Edit mode must be replace, insert, or delete.", errorCode: 4 };
    }

    // (4) insert requires cell_type — @391118, errorCode 5.
    if (edit_mode === "insert" && !cell_type) {
      return { result: false, message: "Cell type is required when using edit_mode=insert.", errorCode: 5 };
    }

    // (5) not read yet — @391120, errorCode 9. NOTE: simple `!state` (no isPartialView branch,
    // no velvet skip — notebooks are never partial-view truncated).
    const state = ctx.readFileState.get(absPath);
    if (!state) {
      return { result: false, message: "File has not been read yet. Read it first before writing to it.", errorCode: 9 };
    }

    // (6) symlink / Perforce read-only — @391126, errorCode 11. Gated on smr().
    if (symlinkCheckEnabled()) {
      try {
        const { mode } = await getFsImplementation().stat(absPath);
        if (isReadOnlyModeBit(mode)) return { result: false, message: PERFORCE_READONLY_MESSAGE, errorCode: 11 };
      } catch (err) {
        if (!isENOENT(err)) throw err;
      }
    }

    // (7) stale read — @391133, errorCode 10.
    if (getMtimeSync(absPath) > state.timestamp) {
      return {
        result: false,
        message:
          "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
        errorCode: 10,
      };
    }

    // (8) notebook missing / not JSON — @391145-391150, errorCodes 1 / 6.
    let raw: string;
    try {
      raw = readFileSync(absPath).content; // YJ
    } catch (err) {
      if (isENOENT(err)) return { result: false, message: "Notebook file does not exist.", errorCode: 1 };
      throw err;
    }
    const notebook = parseNotebookJson(raw); // Ba
    if (!notebook) return { result: false, message: "Notebook is not valid JSON.", errorCode: 6 };

    // (9) cell_id resolution — @391146-391155, errorCodes 7 / 8.
    if (!cell_id) {
      if (edit_mode !== "insert") {
        return { result: false, message: "Cell ID must be specified when not inserting a new cell.", errorCode: 7 };
      }
    } else if (notebook.cells.findIndex((c) => c.id === cell_id) === -1) {
      // cell_id may be a numeric index (legacy notebooks without ids).
      const index = parseCellIndex(cell_id); // N2t
      if (index !== undefined) {
        if (!notebook.cells[index]) {
          return { result: false, message: `Cell with index ${index} does not exist in notebook.`, errorCode: 7 };
        }
      } else {
        return { result: false, message: `Cell with ID "${cell_id}" not found in notebook.`, errorCode: 8 };
      }
    }

    return { result: true };
  },

  // -------------------------------------------------------------------------
  // call — 2.1.183 @cli_inner_pretty.js:391163-391230+
  //   Optional file-history snapshot → atomic per-path lock → re-parse → resolve target index →
  //   replace/insert/delete the cell → write back. nbformat>=4.5 mints a fresh 8-char cell id on
  //   insert; a `replace` at end-of-notebook is promoted to `insert`.
  // -------------------------------------------------------------------------
  async call(
    { notebook_path, new_source, cell_id, cell_type, edit_mode }: NotebookEditInput,
    { readFileState, getFileHistoryState, applyFileHistoryOp }: NotebookEditCallContext,
    _extra,
    msg,
  ) {
    const absPath = resolveToCwd(notebook_path);
    if (fileHistoryEnabled()) await snapshotFileHistory(getFileHistoryState, applyFileHistoryOp, absPath, msg.uuid);

    return withPerPathLock(absPath, async () => {
      const { content: raw, encoding, lineEndings } = await readNotebookFile(absPath); // IJo
      let notebook: NotebookDoc;
      try {
        notebook = parseJson(raw); // Gt
      } catch {
        // @391174 — surface a structured error result (not a throw) for malformed JSON.
        return {
          data: {
            new_source,
            cell_type: cell_type ?? "code",
            language: "python",
            edit_mode: "replace",
            error: "Notebook is not valid JSON.",
            cell_id,
            notebook_path: absPath,
            original_file: "",
            updated_file: "",
          },
        };
      }

      // Resolve target index — @391191-391199.
      let index: number;
      if (!cell_id) {
        index = 0;
      } else {
        index = notebook.cells.findIndex((c) => c.id === cell_id);
        if (index === -1) {
          const byNumber = parseCellIndex(cell_id);
          if (byNumber !== undefined) index = byNumber;
        }
        if (edit_mode === "insert") index += 1;
      }

      // A replace at end-of-notebook becomes an insert — @391200-391203.
      let mode = edit_mode;
      if (mode === "replace" && index === notebook.cells.length) {
        mode = "insert";
        if (!cell_type) cell_type = "code";
      }

      const language = notebook.metadata.language_info?.name ?? "python";
      // nbformat >= 4.5 carries cell ids — mint a fresh one on insert, reuse cell_id otherwise.
      let newCellId: string | undefined;
      if (notebook.nbformat > 4 || (notebook.nbformat === 4 && notebook.nbformat_minor >= 5)) {
        if (mode === "insert") newCellId = randomUUID().slice(0, 8);
        else if (cell_id !== null) newCellId = cell_id;
      }

      // Apply the mutation — @391209-391224.
      if (mode === "delete") {
        notebook.cells.splice(index, 1);
      } else if (mode === "insert") {
        const cell =
          cell_type === "markdown"
            ? { cell_type: "markdown", id: newCellId, source: new_source, metadata: {} }
            : { cell_type: "code", id: newCellId, source: new_source, metadata: {}, execution_count: null, outputs: [] };
        notebook.cells.splice(index, 0, cell);
      } else {
        const cell = notebook.cells[index];
        cell.source = new_source;
        if (cell.cell_type === "code") {
          cell.execution_count = null;
          cell.outputs = [];
        }
        if (cell_type && cell_type !== cell.cell_type) cell.cell_type = cell_type;
      }

      const updated = jsonStringify(notebook, null, 1); // Re
      const writtenMtime = await writeFileAtomic(absPath, updated, encoding, lineEndings); // dEe
      readFileState.set(absPath, { content: updated, timestamp: writtenMtime, offset: undefined, limit: undefined });

      return {
        data: {
          new_source,
          cell_type: cell_type ?? "code",
          language,
          edit_mode: mode ?? "replace",
          // ... cell_id / notebook_path / original_file / updated_file (summarized).
        },
      };
    });
  },
});

// ---------------------------------------------------------------------------
// Helper declarations (source-anchored; deep bodies summarized).
// ---------------------------------------------------------------------------

interface NotebookCell {
  cell_type: string;
  id?: string;
  source: string;
  metadata: Record<string, unknown>;
  execution_count?: number | null;
  outputs?: unknown[];
}
interface NotebookDoc {
  cells: NotebookCell[];
  metadata: { language_info?: { name?: string } };
  nbformat: number;
  nbformat_minor: number;
}
interface NotebookEditCallContext extends ToolUseContext {
  getFileHistoryState: unknown;
  applyFileHistoryOp: unknown;
}

import { checkWritePermissionForTool } from "../utils/permissions/filesystem";

declare function deniedDirectoryPreCheck(absPath: string, ctx: ToolUseContext): string | undefined; // Xct
declare function symlinkCheckEnabled(): boolean; // smr
declare function isReadOnlyModeBit(mode: number): boolean; // Lze
declare function getFsImplementation(): { stat(p: string): Promise<{ mode: number }> }; // Ut
declare function getMtimeSync(p: string): number; // XJ
declare function readFileSync(p: string): { content: string }; // YJ
declare function parseNotebookJson(raw: string): NotebookDoc | null; // Ba
declare function parseCellIndex(cellId: string): number | undefined; // N2t
declare function getToolPermissionContext(ctx: ToolUseContext): unknown; // Br
declare function filePathMatchesRule(rule: unknown, filePath: string): boolean; // uye
declare function isENOENT(err: unknown): boolean; // Pn
declare function fileHistoryEnabled(): boolean; // Tb
declare function snapshotFileHistory(get: unknown, apply: unknown, p: string, uuid: string): Promise<void>; // Bke
declare function withPerPathLock<T>(p: string, fn: () => Promise<T>): Promise<T>; // uEe
declare function readNotebookFile(p: string): Promise<{ content: string; encoding: string; lineEndings: string }>; // IJo
declare function parseJson(raw: string): NotebookDoc; // Gt
declare function jsonStringify(doc: NotebookDoc, replacer: null, space: number): string; // Re
declare function writeFileAtomic(p: string, content: string, encoding: string, lineEndings: string): Promise<number>; // dEe
declare function randomUUID(): string; // crypto.randomUUID
