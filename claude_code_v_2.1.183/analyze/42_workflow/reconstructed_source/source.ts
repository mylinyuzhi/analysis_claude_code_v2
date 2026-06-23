/**
 * Workflow source resolution — readable-source restoration (Claude Code v2.1.183)
 *
 * Subsystem: resolve a Workflow invocation's *script body* from one of three inputs,
 * in strict precedence order `scriptPath > name > script`, with two security/DoS guards
 * that apply to the on-disk path:
 *   - UNC path rejection (`\\server\share`, `//host/share`) before any IO
 *   - a hard 512 KiB (524288-byte) size cap on the script file
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here:
 *     - resolveWorkflowSource  n5a   @419272-419289  (precedence ladder scriptPath>name>script)
 *     - readWorkflowScriptFile r0t   @152126-152137  (UNC reject + size-capped read)
 *     - resolveNamedWorkflow   jjt   @418000-418002  (find named workflow by name)
 *     - getAllWorkflows        J0e   @418006-418024  (memoized registry; available-names source)
 *     - isUncPath              _d    @3889-3891      (^[\\/]{2} detector)
 *     - getCwd                 Pt    @46264-46269    (cwd via Jen(); on throw falls back to Ar() = originalCwd)
 *     - isNotFound             Pn    @8860-8862      (ENOENT classifier)
 *     - readFileBytes          @9927-9944           (FS accessor; reads min(size, cap+1) bytes)
 *     - WORKFLOW_SCRIPT_MAX_BYTES  A2  @152140       (= 524288)
 *   Also cross-checked the two call sites that re-resolve a path/name for permission review:
 *     - checkPermissions: r0t @419492, jjt @419495  (DLp tool object @419420-419508)
 *     - resolveWorkflowSource available-names branch uses J0e(Pt()) @419282
 *
 * CONVENTION mirror — v2.1.88 named-TS tree (/lyz/codespace/3rd/claude-code/src)
 *   Workflow is gated-out there (`feature('WORKFLOW_SCRIPTS')`), so only the *shape* is borrowed:
 *   ESM `.js` import specifiers on `.ts`, `getCwd` from `utils/cwd.js`, the
 *   `tools/WorkflowTool/createWorkflowCommand.ts` named-workflow-loading idiom, and
 *   `utils/filePersistence/*` module-doc header style.
 *
 * SCAFFOLD — v2.1.156 baseline analysis
 *   42_workflow/workflow_tool_definition.md §6 (source precedence, b44) and
 *   §8 (UNC/size, Hj$/tm). Readable names inherited from there; every claim re-verified
 *   against the 183 bundle (lines + obf names re-mangled this build).
 *
 * ── Cross-validation note ────────────────────────────────────────────────────────────
 * Re-verified in the 183 bundle that, unlike the 2.1.156 scaffold, the *named* branch of
 * resolveWorkflowSource returns `{ script, source }` (NOT `resolvedScriptPath`), and that the
 * available-names list on a miss is built from `getAllWorkflows(getCwd())` → `.map(w => w.name)`.
 * Confirmed A2 = 524288 at :152140 and that readFileBytes is called with `A2 + 1` so an
 * oversized file is detected via `byteLength > A2` without slurping the whole file.
 */

import * as path from 'path'

import { getCwd } from '../utils/cwd.js'                 // 2.1.183: getCwd = Pt @46264
import { fileSystem } from '../utils/fileSystem.js'      // 2.1.183: Ut() @9688 (provides readFileBytes @9927)
import { isNotFound } from '../utils/errors.js'          // 2.1.183: isNotFound = Pn @8860 (ENOENT)
import { isUncPath } from '../utils/pathValidation.js'   // 2.1.183: isUncPath = _d @3889
import {
  getAllWorkflows,        // 2.1.183: getAllWorkflows = J0e @418006
  resolveNamedWorkflow,   // 2.1.183: resolveNamedWorkflow = jjt @418000
  type NamedWorkflow,
} from './workflowRegistry.js'
import { WORKFLOW_SCRIPT_MAX_BYTES } from './constants.js' // A2 @152140 (= 524288) — single source of truth

// ─────────────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Hard size cap (in bytes) on a workflow script, whether inline, named, or read from a
 * `scriptPath` file. 524288 = 512 KiB. The inline `script` field also restates this as a
 * Zod `.max(WORKFLOW_SCRIPT_MAX_BYTES)`; this constant additionally bounds the disk read so
 * a `scriptPath` to a huge file can't exhaust memory.
 */
// WORKFLOW_SCRIPT_MAX_BYTES (A2 @152140 = 524288) is owned by ./constants.js and imported above;
// it bounds both the inline-script Zod `.max` (schemas.ts) and the `scriptPath` disk read below.

// ─────────────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────────────

/** The subset of the Workflow tool input that source resolution reads. */
export interface WorkflowSourceInput {
  /** Inline self-contained script source. */
  script?: string
  /** Name of a predefined (built-in or `.claude/workflows/`) workflow. */
  name?: string
  /** Path to a workflow script file on disk. Takes precedence over `script` and `name`. */
  scriptPath?: string
}

/** Successful resolution: a script body plus an optional provenance handle. */
export interface ResolvedWorkflowSource {
  /** The resolved script body to compile and run. */
  script: string
  /**
   * Absolute path the script was read from / will be persisted under. Set only on the
   * `scriptPath` branch.
   */
  resolvedScriptPath?: string
  /** Provenance of a *named* workflow (e.g. "built-in" / "user"). Set only on the `name` branch. */
  source?: NamedWorkflow['source']
}

/** Resolution failure: a human-readable message (surfaced as a soft tool error, never thrown). */
export interface WorkflowSourceError {
  error: string
}

export type WorkflowSourceResult = ResolvedWorkflowSource | WorkflowSourceError

/** Result of reading a `scriptPath` file from disk. */
export type ReadWorkflowScriptResult =
  | { script: string; path: string }
  | { error: string }

// ─────────────────────────────────────────────────────────────────────────────────────
// readWorkflowScriptFile — read a `scriptPath`, rejecting UNC paths, capped at 512 KiB
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Read a workflow script from a path on disk.
 *
 * Security/DoS boundary for every entry point that accepts a `scriptPath` (validateInput,
 * checkPermissions, and resolveWorkflowSource all route through here):
 *  1. Reject UNC paths up front (before any IO) — a UNC path can point at a remote SMB
 *     share, which would let workflow code be sourced from an attacker-controlled server.
 *  2. Resolve relative to the project cwd.
 *  3. Read at most `WORKFLOW_SCRIPT_MAX_BYTES + 1` bytes, then reject if the result exceeds
 *     the cap — detects an oversized file without slurping a multi-gigabyte file into memory.
 *  4. Map not-found vs other IO errors to distinct messages.
 *
 * 2.1.183: readWorkflowScriptFile = r0t @152126-152137
 * 2.1.88 convention: gated-out; mirrors the on-disk-read idiom around utils/filePersistence.
 * 2.1.156 scaffold: workflow_tool_definition.md §8 (Hj$/tm).
 */
// 2.1.183: r0t @152126
export async function readWorkflowScriptFile(
  rawPath: string,
): Promise<ReadWorkflowScriptResult> {
  // @152127  _d(e) — reject `\\server\share` / `//host/share` before touching the disk.
  if (isUncPath(rawPath)) {
    return { error: `UNC paths are not allowed for workflow scriptPath: ${rawPath}` }
  }

  // @152128  anchor to the project working directory.
  const resolved = path.resolve(getCwd(), rawPath)

  try {
    // @152130  read min(fileSize, cap + 1) bytes — the "+1" makes an exactly-cap-sized file
    //          pass while a larger one yields byteLength > cap.
    const bytes = await fileSystem().readFileBytes(resolved, WORKFLOW_SCRIPT_MAX_BYTES + 1)

    // @152131  size guard.
    if (bytes.byteLength > WORKFLOW_SCRIPT_MAX_BYTES) {
      return { error: `Workflow script file ${resolved} exceeds ${WORKFLOW_SCRIPT_MAX_BYTES} bytes` }
    }

    // @152132
    return { script: bytes.toString('utf-8'), path: resolved }
  } catch (e) {
    // @152134  ENOENT → friendly "not found"; any other IO error → generic failure.
    if (isNotFound(e)) {
      return { error: `Workflow script file not found: ${resolved}` }
    }
    // @152135
    return { error: `Failed to read workflow script file ${resolved}: ${e}` }
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// resolveWorkflowSource — precedence ladder: scriptPath > name > script
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a Workflow invocation's input into a concrete script body.
 *
 * Precedence (strict, first match wins):
 *   1. `scriptPath` — a file on disk. If `script` is *also* present, trust the inline
 *      script verbatim and only resolve the path (for persistence); otherwise read the file.
 *   2. `name`       — a predefined workflow; look it up in the registry. On a miss, list the
 *      available workflow names in the error.
 *   3. `script`     — the inline source as-is.
 *   4. none         — the "Must provide script, name, or scriptPath" error (same message the
 *      input schema's `.refine` produces).
 *
 * Returns a soft `{ error }` on any failure — callers surface it as a tool result, never a throw.
 *
 * 2.1.183: resolveWorkflowSource = n5a @419272-419289
 * 2.1.88 convention: named-workflow loading mirrors tools/WorkflowTool/createWorkflowCommand.ts.
 * 2.1.156 scaffold: workflow_tool_definition.md §6 (b44 precedence).
 */
// 2.1.183: n5a @419272
export async function resolveWorkflowSource(
  input: WorkflowSourceInput,
): Promise<WorkflowSourceResult> {
  // ── 1. scriptPath wins ─────────────────────────────────────────────────────────────
  // @419273
  if (input.scriptPath) {
    // @419274  If both a path and an inline script were sent, trust the inline script and
    //          only resolve the path (so persistence/iterate-in-place still uses that path).
    if (input.script) {
      return {
        script: input.script,
        resolvedScriptPath: path.resolve(getCwd(), input.scriptPath),
      }
    }

    // @419275  Otherwise read the file (UNC-rejected, size-capped).
    const read = await readWorkflowScriptFile(input.scriptPath)
    // @419276  Propagate a read failure verbatim.
    if ('error' in read) return read
    // @419277
    return { script: read.script, resolvedScriptPath: read.path }
  }

  // ── 2. name ────────────────────────────────────────────────────────────────────────
  // @419279
  if (input.name) {
    // @419280  Look the workflow up in the registry (scoped to the current cwd).
    const found = await resolveNamedWorkflow(input.name, getCwd())

    // @419281  Miss → list the available names so the model can correct itself.
    if (!found) {
      // @419282  available = getAllWorkflows(cwd).map(w => w.name).join(", ")
      const available = (await getAllWorkflows(getCwd())).map((w) => w.name).join(', ')
      return { error: `Workflow "${input.name}" not found. Available: ${available || '(none)'}` }
    }

    // @419285  Inline `script` (if any) overrides the registry script, but provenance is kept.
    return { script: input.script ?? found.script, source: found.source }
  }

  // ── 3. inline script ───────────────────────────────────────────────────────────────
  // @419287
  if (input.script) return { script: input.script }

  // ── 4. nothing provided ────────────────────────────────────────────────────────────
  // @419288  Same message as the input schema's `.refine`.
  return { error: 'Must provide script, name, or scriptPath' }
}

// Mapping (this file):
//   n5a→resolveWorkflowSource, r0t→readWorkflowScriptFile, _d→isUncPath, Pt→getCwd,
//   Pn→isNotFound, Ut→fileSystem, A2→WORKFLOW_SCRIPT_MAX_BYTES,
//   jjt→resolveNamedWorkflow, J0e→getAllWorkflows;
//   e→input/rawPath, t→found/read/resolved, n→available/bytes, s5a/MQe→path.
