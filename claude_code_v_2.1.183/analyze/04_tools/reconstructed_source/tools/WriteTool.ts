/**
 * WriteTool — write a file to the local filesystem, overwriting if one exists.
 *
 * Readable-source restoration of Claude Code v2.1.183. Logic-equivalent to the
 * 2.1.156 FileWrite tool; obf names re-derived against the 2.1.183 bundle.
 *
 * 2.1.183 regions covered (all @cli_inner_pretty.js):
 *   - name const Kc + prompt builder ALi + FAd  : 193013-193031
 *   - input schema xwp + output schema kwp       : 390596-390614
 *   - tool object yE = pi({...})                 : 390615-390650
 *   - inputsEquivalent / preparePermissionMatcher: 390653-390663
 *   - checkPermissions (P0e)                      : 390665-390667
 *   - validateInput                               : 390672-390748
 *       · subagent .md report block + telemetry   : 390676-390688
 *       · denied-dir / UNC / symlink / content     : 390689-390705
 *       · velvet-mallet not-read guard (NEW)       : 390707-390730
 *       · stale-read guard                         : 390731-390745
 *   - call (skill triggers → atomic write)        : 390749-390800
 *
 * 2.1.88 convention mirror : src/tools/FileWriteTool/{FileWriteTool.ts,prompt.ts}
 * 2.1.156 scaffold doc     : 04_tools/read_partial_view_and_streaming_exec.md (Part 1, isPartialView consumers)
 *
 * Cross-validation note: the not-read / stale-read guards match the 2.1.156 isPartialView
 * consumer logic (a partial view counts as "not read"). NEW in 2.1.183: the
 * `tengu_velvet_mallet` killswitch (@390709) — when a file has NO read-state at all and the
 * mallet gate is on (globally or per model-bucket), the "File has not been read yet" guard
 * is SKIPPED (guardSkipped:true in the hypothetical telemetry). The same gate is re-checked
 * inside the atomic write at @390780. 0-count in the 2.1.156 before-bundle → genuinely new.
 */

import { z } from "zod/v4";
import { buildTool, type ToolUseContext } from "../Tool";
import { getCwd } from "../utils/cwd";
import { resolveToCwd } from "../utils/path"; // Ds
import { matchingRuleForInput, checkWritePermissionForTool } from "../utils/permissions/filesystem";

// 2.1.183: WRITE_TOOL_NAME = Kc @cli_inner_pretty.js:193030
const WRITE_TOOL_NAME = "Write";
// 2.1.183: READ_TOOL_NAME = Ws / EDIT_TOOL_NAME = Fa — interpolated into the prompt.
const READ_TOOL_NAME = "Read";
const EDIT_TOOL_NAME = "Edit";

// 2.1.183: NOT_READ_MESSAGE = T_n @cli_inner_pretty.js:152086 (shared verbatim across Write/Edit/NotebookEdit).
const NOT_READ_MESSAGE = "File has not been read yet. Read it first before writing to it.";
// 2.1.183: STALE_READ_MESSAGE — the inline validateInput stale string (verbatim, shared with Edit/NotebookEdit).
const STALE_READ_MESSAGE =
  "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.";
// 2.1.183: IN_LOCK_STALE_MESSAGE = w_n @cli_inner_pretty.js:152087 — the DIFFERENT stale string thrown
// INSIDE the atomic write lock (@390793: `throw new Fme(w_n)`). NOT the validateInput STALE_READ_MESSAGE.
const IN_LOCK_STALE_MESSAGE =
  "File content has changed since it was last read. This commonly happens when a linter or formatter run via Bash rewrites the file. Call Read on this file to refresh, then retry the edit.";

// ---------------------------------------------------------------------------
// Prompt builder — 2.1.183: ALi @cli_inner_pretty.js:193017-193030
//   Compact-mode (Dg) branch = assets/tools/Write.md "--- branch 1 ---"; else "--- branch 2 ---".
//   The "If this is an existing file…" bullet is produced by FAd() (@193013).
// ---------------------------------------------------------------------------

function writePrompt(model: unknown): string {
  if (isLeanSystemPrompt(model)) {
    // @193019-193021 — verbatim "branch 1".
    return `Writes a file to the local filesystem, overwriting if one exists.

When to use: creating a new file, or fully replacing one you've already ${READ_TOOL_NAME}. Overwriting an existing file you haven't ${READ_TOOL_NAME} will fail. For partial changes, use ${EDIT_TOOL_NAME} instead.`;
  }
  // @193022-193028 — verbatim "branch 2".
  return `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.${existingFileMustReadBullet()}
- Prefer the Edit tool for modifying existing files — it only sends the diff. Only use this tool to create new files or for complete rewrites.
- NEVER create documentation files (*.md) or README files unless explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`;
}

// 2.1.183: FAd @cli_inner_pretty.js:193013-193016.
function existingFileMustReadBullet(): string {
  return `
- If this is an existing file, you MUST use the ${READ_TOOL_NAME} tool first to read the file's contents. This tool will fail if you did not read the file first.`;
}

// ---------------------------------------------------------------------------
// Input / output schema — 2.1.183: xwp @cli_inner_pretty.js:390596, kwp @390600
// ---------------------------------------------------------------------------

const inputSchema = z.strictObject({
  file_path: z.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
  content: z.string().describe("The content to write to the file"),
});

const outputSchema = z.object({
  type: z.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
  filePath: z.string().describe("The path to the file that was written"),
  content: z.string().describe("The content that was written to the file"),
  structuredPatch: z.array(structuredPatchHunkSchema).describe("Diff patch showing the changes"),
  originalFile: z.string().nullable().describe("The original file content before the write (null for new files)"),
  gitDiff: gitDiffSchema.optional(),
  userModified: z
    .boolean()
    .optional()
    .describe("True when the user edited the proposed content in the permission dialog before accepting"),
});

type WriteInput = z.infer<typeof inputSchema>;

// ---------------------------------------------------------------------------
// Tool object — 2.1.183: yE = pi({...}) @cli_inner_pretty.js:390615-390748
// ---------------------------------------------------------------------------

export const WriteTool = buildTool({
  name: WRITE_TOOL_NAME,
  ruleContentField: "file_path",
  searchHint: "create or overwrite files", // @390617
  maxResultSizeChars: 1e5, // @390618
  strict: true,

  async description() {
    return "Write a file to the local filesystem."; // @390621 (matches assets/tools/Write.md "## Description")
  },
  async prompt({ model }) {
    return writePrompt(model);
  },

  get inputSchema() {
    return inputSchema;
  },
  get outputSchema() {
    return outputSchema;
  },

  getPath(input: WriteInput) {
    return input.file_path;
  },
  // @390654-390658 — trailing-newline-only differences are treated as equivalent (idempotent rewrite).
  inputsEquivalent(a: WriteInput, b: WriteInput) {
    if (a.file_path !== b.file_path) return false;
    if (a.content === b.content) return true;
    return a.content.replace(/\n+$/, "") === b.content.replace(/\n+$/, "");
  },
  backfillObservableInput(input: WriteInput) {
    if (typeof input.file_path === "string") input.file_path = resolveToCwd(input.file_path);
  },

  // @390661 — file-path matcher.
  async preparePermissionMatcher({ file_path }: WriteInput) {
    return (rule: unknown) => filePathMatchesRule(rule, file_path);
  },
  // @390665-390667 — write permission helper.
  async checkPermissions(input: WriteInput, ctx: ToolUseContext) {
    return checkWritePermissionForTool(WriteTool, input, getToolPermissionContext(ctx));
  },

  // -------------------------------------------------------------------------
  // validateInput — 2.1.183 @cli_inner_pretty.js:390672-390748
  // -------------------------------------------------------------------------
  async validateInput({ file_path, content }: WriteInput, ctx: ToolUseContext) {
    const absPath = resolveToCwd(file_path);

    // (1) shared denied-directory / outside-workspace pre-check — @390674, errorCode 7.
    const denied = deniedDirectoryPreCheck(absPath, ctx);
    if (denied) return { result: false, message: denied, errorCode: 7 };

    // (2) subagent .md report-file block — @390676-390688, errorCode 5.
    // A subagent (ctx.agentId set) writing REPORT/SUMMARY/FINDINGS/ANALYSIS*.md is blocked:
    // it should return findings as text in its final response instead of writing report files.
    if (ctx.agentId && /^(REPORT|SUMMARY|FINDINGS|ANALYSIS).*\.md$/i.test(basename(absPath))) {
      logEvent("tengu_subagent_md_report_blocked", { contentBytes: Buffer.byteLength(content) });
      return {
        result: false,
        message:
          "Subagents should return findings as text, not write report files. Include this content in your final response instead.",
        errorCode: 5,
      };
    }

    // (3) forbidden-content guard — @390689, errorCode 0.
    const contentGuardMessage = forbiddenContentMessage(absPath, content);
    if (contentGuardMessage) return { result: false, message: contentGuardMessage, errorCode: 0 };

    // (4) denied directory (rule lookup) — @390691, errorCode 1.
    if (matchingRuleForInput(absPath, getToolPermissionContext(ctx), "edit", "deny") !== null) {
      return {
        result: false,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1,
      };
    }

    // UNC / "//" short-circuit — @390695.
    if (absPath.startsWith("\\\\") || absPath.startsWith("//")) return { result: true };

    // (5) symlink / Perforce read-only special file — @390702, errorCode 6.
    const fs = getFsImplementation();
    let mtimeMs: number | undefined;
    try {
      const stat = await fs.stat(absPath);
      mtimeMs = stat.mtimeMs;
      if (isReadOnlyModeBit(stat.mode)) return { result: false, message: PERFORCE_READONLY_MESSAGE, errorCode: 6 };
    } catch (err) {
      if (isENOENT(err)) return { result: true }; // new file → nothing else to validate.
      throw err;
    }

    const state = ctx.readFileState.get(absPath);

    // (6) not-read guard — @390707-390730, errorCode 2.
    // A missing entry OR a partial view counts as "not read".
    if (!state || state.isPartialView) {
      const permissionLayers = collectPermissionLayers(ctx);
      const modelBucket = modelBucketForLayers(permissionLayers);
      // velvet-mallet (NEW @390709): skip the guard only when there is NO state AND the gate
      // is on (globally, or per the model bucket).
      const guardSkipped =
        !state &&
        (getFeatureGate("tengu_velvet_mallet", false) ||
          getFeatureGate(perModelGateName("tengu_velvet_mallet", permissionLayers), false));

      logEvent("tengu_write_tool_not_read_hypothetical", {
        wouldHaveResult: state && Math.floor(mtimeMs!) > state.timestamp ? "errorCode3" : "success",
        isPartialView: state?.isPartialView === true,
        isFilePathAbsolute: isAbsolutePath(file_path),
        guardSkipped,
        modelBucket,
      });

      if (!guardSkipped) {
        return { result: false, message: NOT_READ_MESSAGE, errorCode: 2 };
      }
      return { result: true };
    }

    // (7) stale-read guard — @390731-390745, errorCode 3.
    // If the on-disk mtime is newer than our cached read, the file changed under us.
    // For a whole-file read we tolerate a byte-equal change (e.g. a no-op formatter run).
    if (Math.floor(mtimeMs!) > state.timestamp) {
      const wasWholeFileRead = (state.offset ?? 1) <= 1 && state.limit === undefined;
      let byteEqual = false;
      if (wasWholeFileRead) {
        const onDisk = (await fs.readFileBytes(absPath)).toString("utf8").replaceAll("\r\n", "\n");
        byteEqual = contentMatchesCachedRead(state, onDisk);
      }
      if (!byteEqual) {
        return { result: false, message: STALE_READ_MESSAGE, errorCode: 3 };
      }
    }

    return { result: true };
  },

  // -------------------------------------------------------------------------
  // call — 2.1.183 @cli_inner_pretty.js:390749-390800
  //   Skill-dir trigger scan → beforeFileEdited hook → mkdir → optional history snapshot →
  //   atomic write under a per-path lock (uEe). Inside the lock a final not-read /
  //   stale-read re-check runs (with the same velvet-mallet skip) before committing.
  // -------------------------------------------------------------------------
  async call({ file_path, content }: WriteInput, ctx, _extra, msg) {
    const { readFileState, options, permissionLayers, getFileHistoryState, applyFileHistoryOp, dynamicSkillDirTriggers } = ctx as WriteCallContext;
    const absPath = resolveToCwd(file_path);
    const dir = dirname(absPath);
    const cwd = getCwd();

    // Conditional skill-dir triggers — @390766-390771.
    const triggered = await discoverSkillDirsForPaths([absPath], cwd);
    if (triggered.length > 0) {
      if (dynamicSkillDirTriggers) {
        for (const d of triggered) if (!dynamicSkillDirTriggers.includes(d)) dynamicSkillDirTriggers.push(d);
      }
      activateConditionalSkillsForPaths(triggered).catch(() => {});
    }
    addSkillDirectories([absPath], cwd);

    await beforeFileEditedHook(absPath); // $ge.beforeFileEdited
    await getFsImplementation().mkdir(dir);
    if (fileHistoryEnabled()) await snapshotFileHistory(getFileHistoryState, applyFileHistoryOp, absPath, msg.uuid); // Bke when Tb()

    // Atomic write under a per-path lock — @390775.
    const originalContent = await withPerPathLock(absPath, async () => {
      let existing: { content: string; encoding: string } | null;
      try {
        existing = readFileSync(absPath); // YJ
      } catch (err) {
        if (isENOENT(err)) existing = null;
        else throw err;
      }
      // In-lock re-check: a non-null existing file with no read-state (and no velvet-mallet
      // skip) throws NOT_READ (T_n) @390791; a stale read throws IN_LOCK_STALE (w_n) @390793.
      if (existing !== null) {
        const state = readFileState.get(absPath);
        if (!state) {
          if (
            !(
              getFeatureGate("tengu_velvet_mallet", false) ||
              getFeatureGate(perModelGateName("tengu_velvet_mallet", collectPermissionLayers({ options, permissionLayers } as ToolUseContext)), false)
            )
          ) {
            throw new FileWriteError(NOT_READ_MESSAGE);
          }
        } else if (getMtimeSync(absPath) > state.timestamp) {
          // @390793 — in-lock stale throw uses w_n (IN_LOCK_STALE_MESSAGE), a DIFFERENT string
          // from the validateInput STALE_READ_MESSAGE above.
          const ok = (state.offset ?? 1) <= 1 && state.limit === undefined && contentMatchesCachedRead(state, existing.content);
          if (!ok) throw new FileWriteError(IN_LOCK_STALE_MESSAGE);
        }
      }
      const encoding = existing?.encoding ?? "utf8";
      const prior = existing?.content ?? null;
      content = normalizeWrittenContent(absPath, content); // UTn (e.g. trailing-newline policy)
      const writtenMtime = await writeFileAtomic(absPath, content, encoding, "LF"); // dEe
      readFileState.set(absPath, { content, timestamp: writtenMtime, offset: undefined, limit: undefined });
      return prior;
    });

    // Materializes the create/update output with structuredPatch + gitDiff (summarized).
    return buildWriteResult(absPath, content, originalContent);
  },
});

// ---------------------------------------------------------------------------
// Helper declarations (source-anchored; deep bodies summarized).
// ---------------------------------------------------------------------------

interface WriteCallContext extends ToolUseContext {
  options: unknown;
  permissionLayers: unknown;
  getFileHistoryState: unknown;
  applyFileHistoryOp: unknown;
  dynamicSkillDirTriggers?: string[];
}

// 2.1.183: PERFORCE_READONLY_MESSAGE = kze @cli_inner_pretty.js:48727 (shared with Edit/NotebookEdit).
const PERFORCE_READONLY_MESSAGE =
  "File is read-only — it has not been opened for edit in Perforce. Run `p4 edit <file>` to check it out, then retry. Do not chmod the file writable; that bypasses Perforce tracking.";

declare const structuredPatchHunkSchema: z.ZodTypeAny; // Olo
declare const gitDiffSchema: z.ZodTypeAny; // Nlo

declare function isLeanSystemPrompt(model: unknown): boolean; // Dg
declare function deniedDirectoryPreCheck(absPath: string, ctx: ToolUseContext): string | undefined; // Xct
declare function forbiddenContentMessage(absPath: string, content: string): string | undefined; // k0n
declare function isReadOnlyModeBit(mode: number): boolean; // Lze
declare function getFsImplementation(): { stat(p: string): Promise<{ mtimeMs: number; mode: number }>; readFileBytes(p: string): Promise<Buffer>; mkdir(p: string): Promise<void> }; // Ut
declare function collectPermissionLayers(ctx: ToolUseContext): unknown; // Bo(L0e(ctx))
declare function modelBucketForLayers(layers: unknown): string; // gxt
declare function perModelGateName(base: string, layers: unknown): string; // cJe
declare function contentMatchesCachedRead(state: { content: string }, onDisk: string): boolean; // hae
declare function getToolPermissionContext(ctx: ToolUseContext): unknown; // Br
declare function filePathMatchesRule(rule: unknown, filePath: string): boolean; // uye
declare function basename(p: string): string; // path.basename
declare function dirname(p: string): string; // path.dirname
declare function isAbsolutePath(p: string): boolean; // path.isAbsolute
declare function getFeatureGate(name: string, fallback: boolean): boolean; // ct
declare function logEvent(name: string, data?: Record<string, unknown>): void; // G
declare function isENOENT(err: unknown): boolean; // Pn
declare function discoverSkillDirsForPaths(paths: string[], cwd: string): Promise<string[]>; // tut
declare function activateConditionalSkillsForPaths(dirs: string[]): Promise<void>; // nut
declare function addSkillDirectories(paths: string[], cwd: string): void; // rut
declare function beforeFileEditedHook(p: string): Promise<void>; // $ge.beforeFileEdited
declare function fileHistoryEnabled(): boolean; // Tb
declare function snapshotFileHistory(get: unknown, apply: unknown, p: string, uuid: string): Promise<void>; // Bke
declare function withPerPathLock<T>(p: string, fn: () => Promise<T>): Promise<T>; // uEe
declare function readFileSync(p: string): { content: string; encoding: string }; // YJ
declare function getMtimeSync(p: string): number; // XJ
declare function normalizeWrittenContent(p: string, content: string): string; // UTn
declare function writeFileAtomic(p: string, content: string, encoding: string, lineEnding: string): Promise<number>; // dEe
declare function buildWriteResult(p: string, content: string, original: string | null): unknown;
declare class FileWriteError extends Error {} // Fme
