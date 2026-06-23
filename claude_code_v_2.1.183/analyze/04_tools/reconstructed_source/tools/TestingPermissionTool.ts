/**
 * TestingPermissionTool — an end-to-end test fixture. It is built and registered like any other
 * tool, but `isEnabled()` is hard-coded to `false`, so it is filtered out of every assembled tool
 * pool (by `kfo`/`zR`) and never reaches the model in production. E2E tests force-enable it to
 * exercise the permission "ask" path: its `checkPermissions` always returns `{ behavior: "ask" }`.
 *
 * No 2.1.88 mirror file (test-only fixture); reconstructed wholly from the v2.1.183 bundle.
 * Shape mirrors the generic `ToolDef` contract used across `src/tools/*`.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   :428772            i8a  = name const "TestingPermission"
 *   :428778            gMp  = input schema (empty strictObject)
 *   :428779-428830     xky  = the tool object (built by module `a8a`)
 * 2.1.88 convention mirror: src/tools/* generic ToolDef shape (no dedicated TestingPermissionTool)
 * 2.1.156 scaffold: 04_tools/README.md (carryover; isEnabled()===false throughout)
 * Cross-validation: name/description/prompt/checkPermissions/call strings quoted verbatim from the
 *   bundle at :428772-428826; confirmed `isEnabled(){ return false }` at :428794-428796.
 */

import { z } from "zod/v4";
import type { ToolDef } from "../Tool";
import { buildTool } from "../Tool";
import { lazySchema } from "../utils/lazySchema";

// 2.1.183: TESTING_PERMISSION_TOOL_NAME = i8a @cli_inner_pretty.js:428772
export const TESTING_PERMISSION_TOOL_NAME = "TestingPermission";

// 2.1.183: inputSchema = gMp @cli_inner_pretty.js:428778 — no arguments.
const inputSchema = lazySchema(() => z.strictObject({}));
type InputSchema = ReturnType<typeof inputSchema>;
export type Input = z.infer<InputSchema>;

// 2.1.183: TestingPermissionTool = xky @cli_inner_pretty.js:428779-428830
export const TestingPermissionTool = buildTool({
  name: TESTING_PERMISSION_TOOL_NAME,
  maxResultSizeChars: 100_000, // @428781

  // @428782-428784  (verbatim)
  async description() {
    return "Test tool that always asks for permission";
  },
  // @428785-428787  (verbatim; matches assets/tools/TestingPermission.md)
  async prompt() {
    return "Test tool that always asks for permission before executing. Used for end-to-end testing.";
  },

  get inputSchema(): InputSchema {
    return inputSchema();
  },

  userFacingName() {
    return "TestingPermission"; // @428791-428793
  },

  // 2.1.183: isEnabled @cli_inner_pretty.js:428794-428796 — ALWAYS disabled. The tool object is
  // built and registered, but this `false` keeps it out of every production tool pool; only the
  // E2E harness force-enables it.
  isEnabled() {
    return false;
  },
  isConcurrencySafe() {
    return true; // @428797
  },
  isReadOnly() {
    return true; // @428800
  },

  // 2.1.183: checkPermissions @cli_inner_pretty.js:428803-428805 — unconditionally prompts.
  async checkPermissions() {
    return { behavior: "ask" as const, message: "Run test?" };
  },

  // All render* hooks are no-ops for this fixture. @428806-428823
  renderToolUseMessage() {
    return null;
  },
  renderToolUseProgressMessage() {
    return null;
  },
  renderToolUseQueuedMessage() {
    return null;
  },
  renderToolUseRejectedMessage() {
    return null;
  },
  renderToolResultMessage() {
    return null;
  },
  renderToolUseErrorMessage() {
    return null;
  },

  // @428824-428826
  async call() {
    return { data: `${TESTING_PERMISSION_TOOL_NAME} executed successfully` };
  },

  mapToolResultToToolResultBlockParam(output: string, toolUseID: string) {
    return { type: "tool_result", content: String(output), tool_use_id: toolUseID };
  },
} satisfies ToolDef<InputSchema, string>);

// Mapping: i8a→TESTING_PERMISSION_TOOL_NAME, gMp→inputSchema, xky→TestingPermissionTool, a8a→module-init
