/**
 * OnboardingMiscTools — readable-source restoration of the "onboarding / web-publish /
 * user-channel / misc" cluster of built-in tools in Claude Code v2.1.183.
 *
 * Tools reconstructed here (contract level):
 *   - Artifact                  — publish an .html/.md file to a claude.ai web page
 *   - DesignSync                (NEW in 2.1.183) — sync local components to a claude.ai/design project
 *   - Projects                  (NEW in 2.1.183, env-gated) — read/write the session's attached claude.ai Project
 *   - SendUserFile              — deliver files to the user (terminal / mobile)
 *   - SendUserMessage  (alias "Brief") — the primary visible user-message channel
 *   - ShareOnboardingGuide      — upload ONBOARDING.md, return a team share link
 *   - ShowOnboardingRolePicker  (NEW in 2.1.183) — Cowork onboarding role chip row
 *   - explain_command           (INTERNAL — raw Anthropic API tool-def, NOT a base tool)
 *   - eval_registered__*        (INTERNAL — REPL registerTool factory, NOT a base tool)
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   Artifact:                 221750 (name VAe), 221839-221851 (isEnabled DCe), 434986-435004 (prompt hza),
 *                             435005-435045 (schemas yza/A$p), 435046-435234 (tool object bza)
 *   DesignSync:               298052-298053 (name XOt / desc wXr), 432337-432342 (isEnabled fdt),
 *                             432834-433017 (schemas), 433025-433201 (tool object RRp + checkPermissions)
 *   Projects:                 433248-433249 (name R6a / desc nfo), 433310-433312 (O6a UUID gate),
 *                             433576-433663 (schemas), 433677-433711 (tool object VRp)
 *   SendUserFile:             221302-221312 (name/desc/prompt RPt/d5r/p5r), 431621-431710 (schemas + tool cRp)
 *   SendUserMessage:          221278-221298 (name/aliases/descs/prompts KO/MPt/c5r/u5r/ivd),
 *                             425320-425441 (schemas iPp/aPp + tool o9a)
 *   ShareOnboardingGuide:     435353-435356 (name/desc gfo M3t), 435379 (R3t), 435302-435307 (isEnabled hdt),
 *                             435390-435412 (schemas), 435413-435462+ (tool object _$p)
 *   ShowOnboardingRolePicker: 424336-424346 (name/desc/prompt A3n/bqa/Sqa + isEnabled DDp),
 *                             424356-424412 (schemas + tool Eqa)
 *   explain_command:          633098-633126 (FMf def + UMf result schema)
 *   eval_registered__*:       425569-425632 (factory pPp)
 *   getAllBaseTools (LW):     436517-436576 — membership spread points
 *
 * 2.1.88 convention mirror: src/tools/BriefTool, src/tools/SendMessageTool (predecessors of the
 *   SendUserMessage channel). No Artifact/DesignSync/Projects/Onboarding dirs existed at 2.1.88 —
 *   those are newer; shape mirrored from the generic per-tool `<Name>Tool.tsx` layout.
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md (tool inventory + naming).
 * Cross-validation note: every name const, isEnabled gate, schema field/.describe string, prompt/description
 *   const, validateInput/checkPermissions branch, and error/message string below was re-read in the 2.1.183
 *   bundle at the cited line. DesignSync(wXr)/Projects(nfo) description consts were byte-compared to
 *   assets/tools/{DesignSync,Projects}.md. getAllBaseTools membership re-verified at 436517-436576.
 */

import { z } from "zod";
import type {
  Tool,
  ToolUseContext,
  ValidationResult,
  PermissionResult,
} from "../Tool";

// ---------------------------------------------------------------------------
// Shared helper references (obfuscated → readable). These live elsewhere in the
// bundle; the per-tool contracts below depend on them but do not re-define them.
// ---------------------------------------------------------------------------
// helper: pi @ tool-factory — buildTool(): wraps a tool spec, supplies defaults/renderers
// helper: we @ memoize-once — lazy Zod-schema initializer (schema built on first access)
// helper: H @ z — the Zod namespace
// helper: Ds @ resolveToCwd — absolute path resolution from a user-supplied path
// helper: C3n @ verifyFilesExist — async existence check; returns a ValidationResult
// helper: I3n @ resolveAttachments — stat + (optionally) upload local files → attachment metadata
// helper: G @ emitTelemetry — analytics event sink
// helper: ra @ isSubagent — true inside a spawned subagent context
// helper: Ir @ getAPIProvider — "firstParty" for claude.ai-authed sessions
// helper: di @ isManagedSettingAllowed — managed-policy feature gate ("allow_*")
// helper: ct / yK @ getFeatureGate — feature-flag check (yK adds a cache-TTL arg)
// helper: Ac @ isClaudeAiAuthed; Co @ isOnboarded; st @ parseBoolTrue(envVal)
// helper: hk @ hasUserChannelTransport; lWe @ isPewterOwlUserChannel (full SendUserMessage surface)

// ===========================================================================
// Artifact
// ===========================================================================

// 2.1.183: ARTIFACT_TOOL_NAME = VAe @cli_inner_pretty.js:221750
export const ARTIFACT_TOOL_NAME = "Artifact";

// 2.1.183: artifactPrompt = hza @cli_inner_pretty.js:434986-435004
// Long design/CSP/favicon authoring prompt. References the design skill `${nFn}` at :434990.
// Quoted verbatim (first + last paragraph shown; full text at the cited region).
const ARTIFACT_PROMPT = `Render an HTML or Markdown file to an Artifact — a default-private web page hosted on claude.ai that the user can later choose to share with their teammates. Use this when communicating visually would be clearer than terminal text.

Write the content to a file first (via Write/Edit), then call Artifact with its path. The file is wrapped in a \`<!doctype html>…<head>…</head><body>\` skeleton at publish time, so write the page content directly — no \`<!DOCTYPE>\`, \`<html>\`, \`<head>\`, or \`<body>\` tags of your own. The file includes a minimal CSS reset. Unless the user names a location, put the file in your scratchpad directory if one is listed in your system prompt.

**Design guidance**: Before writing the page, load the \`${"${nFn}"}\` skill and apply it.

/* …Title / To update / read / Self-contained-only (strict CSP, inline all CSS/JS, data: URIs) /
   Responsive / Favicon (required, emoji-only, keep stable across redeploys)… @cli_inner_pretty.js:434992-435004 */`;

// 2.1.183: artifactInputSchema = yza @cli_inner_pretty.js:435005-435036 (lazy)
// The `force` field is present only when vjt() is true; `mcp` only when the frame-MCP surface is on.
const artifactInputSchema = z.strictObject({
  file_path: z.string().describe(
    // @435007-435009
    "Path to an .html or .md file to render. Use a short, distinctive basename — it is the fallback title if the HTML has no <title>.",
  ),
  favicon: z.string().min(1).max(32).describe(
    // @435013-435015
    'Browser-tab icon: one or two emoji (e.g. "📊"). No markup. Keep stable across redeploys; change only on a hard topic pivot.',
  ),
  label: z.string().max(60).optional().describe(
    // @435019-435021
    'Short human-readable name for this version (e.g. "fixed-background"). Shown in the version picker instead of the raw version id.',
  ),
  url: z.string().optional().describe(
    // @435024-435025
    "Existing artifact URL to redeploy to. Pass when the user gives you a URL for an artifact not published in this session; omit for new artifacts or same-session redeploys. Must be an artifact the user owns.",
  ),
  // ...(vjt() && { force: z.boolean().optional().describe("Overwrite without a conflict check…") })  @435027-435033
  // ...(vye?.isFrameMcpEnabled() && { mcp: vye.frameMcpInputSchema() })  @435034
});

// 2.1.183: artifactOutputSchema = A$p @cli_inner_pretty.js:435037-435045
const artifactOutputSchema = z.object({
  url: z.string(),
  path: z.string(),
  title: z.string().optional(),
  version: z.string().optional(),
  mcpDropped: z.string().optional(),
});

// 2.1.183: ArtifactTool = bza @cli_inner_pretty.js:435046-435234
export const ArtifactTool = {
  name: ARTIFACT_TOOL_NAME,
  searchHint: "render an HTML or Markdown file to a claude.ai web page", // @435048
  briefStandalone: true, // @435049
  shouldDefer: false, // @435050
  maxResultSizeChars: 1000, // @435051
  userFacingName: () => "Artifact", // @435052-435054
  inputSchema: artifactInputSchema,
  outputSchema: artifactOutputSchema,

  // isEnabled = DCe() @435061-435063 / DCe @221839-221851:
  //   false if w1i() (kill-switch), !Co() (not onboarded), Ir()!=="firstParty",
  //   entrypoint "local-agent"/"claude-coworker*", ra() (subagent), or yl(CLAUDE_CODE_ARTIFACT);
  //   t = st(CLAUDE_CODE_ARTIFACT); if (!t && C1i()) false; require gate "tengu_cobalt_plinth"; then I1i().
  isEnabled: () => artifactGate(),
  isConcurrencySafe: () => false, // @435064-435066
  isReadOnly: () => false, // @435067-435069
  ruleContentField: "file_path" as const, // @435070
  getPath: ({ file_path }: { file_path: string }) => resolveToCwd(file_path), // @435071-435073

  async description(): Promise<string> {
    // @435169
    return "Render an HTML or Markdown file to an Artifact — a default-private claude.ai web page the user can share with teammates.";
  },
  async prompt({ tools }: { tools: Tool[] }): Promise<string> {
    // @435171-435177 — when the frame-MCP `mcp` field is present, appends the frame-MCP prompt block
    return ARTIFACT_PROMPT;
  },

  // validateInput @435178-435195 — four gates, all errorCode 1:
  async validateInput({ file_path, favicon, url }: z.infer<typeof artifactInputSchema>): Promise<ValidationResult> {
    const ext = extname(file_path).toLowerCase();
    if (ext !== ".html" && ext !== ".htm" && ext !== ".md")
      // @435181
      return { result: false, message: `unsupported file type: ${ext || "(none)"} — use .html or .md`, errorCode: 1 };
    if (favicon.includes("<"))
      // @435183
      return { result: false, message: "favicon must be one or two emoji — no markup", errorCode: 1 };
    if (url !== undefined) {
      const parsed = parseArtifactUrl(url); // NPt
      if (parsed === null)
        // @435186
        return { result: false, message: `not an artifact URL: ${url}`, errorCode: 1 };
      const env = currentArtifactEnv(); // "staging" | "prod"
      if (parsed.env !== env)
        // @435189-435192
        return {
          result: false,
          message: `that artifact URL is for ${parsed.env}, but this session targets ${env} claude.ai — republish it here to mint a ${env} URL, or switch environments`,
          errorCode: 1,
        };
    }
    return { result: true };
  },

  // checkPermissions @435074-435149 — runs the rule engine (_te) first; "deny" passes through.
  //   Probes the target artifact's share-status (parseArtifactUrl NPt → Uuo probe). Same-session
  //   redeploy of an already-published, NON-shared-live artifact short-circuits to allow with
  //   reason "Redeploy of an artifact already published this session" (@435106-435111). Otherwise
  //   reads the .html title and asks: `Claude wants to publish "${title}" (${file_path}) to <page-desc>`
  //   where <page-desc> reflects share status (private / shared-live / pinned-earlier).  @435134-435148
  // helper: _te @rule-eval; NPt @parseArtifactUrl; Uuo @probeShareStatus

  // call @435227+ — writes/encodes the file, deploys to claude.ai (same URL for same path),
  //   returns { data: { url, path, title?, version?, mcpDropped? } }. mapToolResult @435197-435204:
  //   `Published ${path} at ${url}` (+ a ⚠ note if the mcp manifest was rejected).
  call: undefined as unknown as Tool["call"],
};

// ===========================================================================
// DesignSync  (NEW in 2.1.183)
// ===========================================================================

// 2.1.183: DESIGN_SYNC_TOOL_NAME = XOt @cli_inner_pretty.js:298052
export const DESIGN_SYNC_TOOL_NAME = "DesignSync";

// 2.1.183: designSyncPrompt = wXr @cli_inner_pretty.js:298053
// description() and prompt() both return this same const (@433033-433038). Byte-identical to
// assets/tools/DesignSync.md. Quoted opening below; the full method-dispatch doc + SECURITY note is
// at the cited line.
const DESIGN_SYNC_PROMPT =
  "Read and update the user's claude.ai/design design-system projects through their claude.ai login " +
  "(or, for sessions without one, a dedicated design authorization from /design-login). Use this together " +
  "with the /design-sync skill to keep a local component library in sync with a Claude Design project — " +
  "incrementally, one component at a time, never as a wholesale replace.\n\n" +
  "The tool dispatches on `method`: list_projects / get_project / list_files / get_file (read); " +
  "create_project (setup); finalize_plan (plan boundary); write_files / delete_files / register_assets / " +
  "unregister_assets (write — require a finalized planId). " +
  "/* full text @cli_inner_pretty.js:298053, incl. 'Required ordering: list/read → finalize_plan → " +
  "write/delete' and the get_file SECURITY note */";

// Per-file content schema (write_files) — vRp @432834-432853
const designFileSchema = z.object({
  path: z.string(),
  localPath: z.string().optional(),
  data: z.string().optional(),
  encoding: z.literal("base64").optional(),
  mimeType: z.string().optional(),
});
// Per-asset card schema (register_assets) — TRp @432854-432871
const designAssetSchema = z.object({
  name: z.string(),
  path: z.string(),
  subtitle: z.string().optional(),
  viewport: z.string().optional(),
  group: z.string().optional(),
});

// 2.1.183: designSyncInputSchema = wRp @cli_inner_pretty.js:432872-432953 (lazy)
const designSyncInputSchema = z.strictObject({
  // @432874-432886
  method: z.enum([
    "list_projects", "get_project", "list_files", "get_file",
    "finalize_plan", "write_files", "delete_files",
    "register_assets", "unregister_assets", "create_project", "report_validate",
  ]),
  projectId: z.string().optional(), // @432887-432890 — required for all except list_projects/create_project
  path: z.string().optional(), // @432891 — get_file path
  writes: z.array(z.string()).max(256).optional(), // @432892-432899 — finalize_plan write paths/globs
  deletes: z.array(z.string()).max(256).optional(), // @432900-432905 — finalize_plan delete paths/globs
  planId: z.string().optional(), // @432906-432911 — token from finalize_plan
  files: z.array(designFileSchema).max(256).optional(), // @432912-432918 — write_files contents
  paths: z.array(z.string()).max(256).optional(), // @432919-432926 — delete_files / unregister_assets
  name: z.string().optional(), // @432927 — create_project name
  assets: z.array(designAssetSchema).max(256).optional(), // @432928-432933 — register_assets cards
  localDir: z.string().optional(), // @432934-432939 — finalize_plan source dir (defaults cwd)
  counts: z.unknown().optional(), // @432940-432951 — report_validate aggregate
});
// Per-method required-keys table CRp @432954-432966; output schema (discriminated union) xRp @432968-433017.

// 2.1.183: DesignSyncTool = RRp @cli_inner_pretty.js:433025-433201
export const DesignSyncTool = {
  name: DESIGN_SYNC_TOOL_NAME,
  searchHint: "sync local design system components to a claude.ai/design project", // @433027
  shouldDefer: true, // @433028
  maxResultSizeChars: 300000, // @433029
  inputSchema: designSyncInputSchema,

  // isEnabled = fdt() @433030-433032 / fdt @432337-432342:
  //   false if !di("allow_design_sync") or ra() (subagent); true if Ac() (claude.ai authed);
  //   else gate "tengu_slate_quill".
  isEnabled: () => designSyncGate(),
  async description() { return DESIGN_SYNC_PROMPT; }, // @433033-433035
  async prompt() { return DESIGN_SYNC_PROMPT; }, // @433036-433038
  isConcurrencySafe: () => false, // @433045-433047
  isReadOnly: (e: z.infer<typeof designSyncInputSchema>) => isDesignReadMethod(e.method), // @433048-433050 (kRp)
  // isDestructive @433051-433053:
  isDestructive: (e: z.infer<typeof designSyncInputSchema>) =>
    e.method === "write_files" || e.method === "delete_files" || e.method === "unregister_assets",
  userFacingName: (e: z.infer<typeof designSyncInputSchema>) => `Design: ${designSummary(e)}`, // @433054-433056

  // validateInput @433077-433099 — errorCode 1 in every branch:
  async validateInput(e: z.infer<typeof designSyncInputSchema>): Promise<ValidationResult> {
    const missing = missingRequiredKeys(e); // IRp
    if (missing.length > 0)
      // @433079
      return { result: false, message: `${e.method} requires: ${missing.join(", ")}.`, errorCode: 1 };
    if (e.method === "finalize_plan" && (e.writes?.length ?? 0) === 0 && (e.deletes?.length ?? 0) === 0)
      // @433081
      return { result: false, message: "finalize_plan needs at least one write or delete path.", errorCode: 1 };
    if (e.method === "write_files")
      for (const f of e.files ?? []) {
        const hasData = f.data !== undefined;
        const hasLocal = f.localPath !== undefined;
        if (hasData === hasLocal)
          // @433089 — exactly one of data/localPath
          return { result: false, message: `Each file needs exactly one of "data" or "localPath" (offending path: ${f.path}).`, errorCode: 1 };
        if (hasLocal && f.encoding !== undefined)
          // @433095 — encoding only on inline data
          return { result: false, message: `"encoding" only applies to inline "data"; localPath files are encoded automatically (offending path: ${f.path}).`, errorCode: 1 };
      }
    return { result: true };
  },

  // checkPermissions @433101-433201 — four ask-branches, all decisionReason.type "safetyCheck":
  //   (1) scope-expansion (I6a()) — @433103-433105:
  //       "DesignSync needs design-system access added to your claude.ai login (user:design:read,
  //        user:design:write). Approving refreshes your token with these scopes — you'll be able to
  //        read and write your org's design-system projects on claude.ai/design."
  //   (2) design-login (!scope && Zpo()&&T3t()&&!Kpo()) — @433109-433111:
  //       "DesignSync needs design-system authorization for your claude.ai account. Approving opens
  //        your browser to authorize read and write access to your org's design-system projects
  //        (user:design:read, user:design:write) — this session's own authentication is not changed."
  //       (Branches 1/2 only fire for non-finalize/create/report methods @433114.)
  //   (3) finalize_plan @433127-433181 — validates localDir (deny "localDir does not exist or is not
  //       accessible: …" @433136), then builds a structured ask: "To project: …", "From folder: …",
  //       "Upload N file(s): …", "Delete …" (+ a ⚠ note for literal write paths missing under localDir).
  //   (4) create_project @433183-433199 — 'Create design-system project "${name}" on claude.ai/design.
  //        The new project will be visible to your whole org (server default — you can change this from
  //        the Share menu after creation).'
  //   default → { behavior: "allow", updatedInput: e }  @433200
  // helper: I6a @needsScopeExpansion; D6a @resolveLocalDir; k6a @projectLabel
  checkPermissions: undefined as unknown as Tool["checkPermissions"],

  // call @433202+ — report_validate short-circuits to { data:{ method:"report_validate" } }; otherwise
  //   dispatches the method against the claude.ai/design CCR API (MRp) and returns the per-method result.
  call: undefined as unknown as Tool["call"],
};

// ===========================================================================
// Projects  (NEW in 2.1.183, env-gated)
// ===========================================================================

// 2.1.183: PROJECTS_TOOL_NAME = R6a @cli_inner_pretty.js:433248
export const PROJECTS_TOOL_NAME = "Projects";

// 2.1.183: projectsPrompt = nfo @cli_inner_pretty.js:433249
// description() and prompt() both return this const (@433685-433690). Byte-identical to
// assets/tools/Projects.md. Opening quoted; full method-dispatch + budget doc at the cited line.
const PROJECTS_PROMPT =
  "Read and write the claude.ai Project attached to this session. A Project is a shared knowledge " +
  "container on claude.ai — its docs persist across sessions and surfaces (chat, Cowork, Claude Code), " +
  "so anything you write here is visible to the user and their team in claude.ai.\n\n" +
  "The session is bound to exactly one project (set by the harness when the session started). You never " +
  "pass a project ID — every method operates on that project.\n\n" +
  "Methods: project_info / project_read / project_search / project_write / project_delete. " +
  "/* full text @cli_inner_pretty.js:433249, incl. the knowledge-budget (~50k token search threshold, " +
  "force:true override) and SECURITY note */";

// 2.1.183: projectsInputSchema = BRp @cli_inner_pretty.js:433576-433607 (lazy)
const projectsInputSchema = z.strictObject({
  method: z.enum(["project_info", "project_read", "project_search", "project_write", "project_delete"]), // @433578
  path: z.string().min(1).max(255).optional(), // @433579-433585 — read/write/delete doc path
  content: z.string().optional(), // @433586-433590 — inline write text (XOR local_path)
  local_path: z.string().optional(), // @433591-433598 — file on disk to upload (never enters context)
  force: z.boolean().optional(), // @433599-433603 — bypass chat-injection budget guard
  query: z.string().min(1).optional(), // @433604 — project_search query
  n: z.number().int().min(1).max(15).optional(), // @433605 — search hit count (default 5)
});
// Per-method required-keys URp @433664-433670; output union FRp @433618-433663; knowledge sub-schema $6a @433609-433617.

// 2.1.183: ProjectsTool = VRp @cli_inner_pretty.js:433677-433711+
// Array-level gate: only added to getAllBaseTools when env CLAUDE_PROJECT_TOOL is set
//   (iKa = Ge.CLAUDE_PROJECT_TOOL ? ProjectsTool : null @436537/436708-resolution).
export const ProjectsTool = {
  name: PROJECTS_TOOL_NAME,
  searchHint: "read and write the session's attached claude.ai project", // @433679
  maxResultSizeChars: 300000, // @433680
  persistenceThresholdCeiling: 300000, // @433681
  inputSchema: projectsInputSchema,

  // isEnabled @433682-433684: di("allow_projects_tool") && hasAttachedProjectUuid()
  //   O6a @433310-433312: process.env.CLAUDE_PROJECT_UUID?.trim() || undefined
  isEnabled: () => isManagedSettingAllowed("allow_projects_tool") && attachedProjectUuid() !== undefined,
  async description() { return PROJECTS_PROMPT; }, // @433685-433687
  async prompt() { return PROJECTS_PROMPT; }, // @433688-433690
  isConcurrencySafe: () => false, // @433697-433699
  isReadOnly: (e: z.infer<typeof projectsInputSchema>) => isProjectReadMethod(e.method), // @433700-433702 (jRp)
  // isDestructive @433703-433705:
  isDestructive: (e: z.infer<typeof projectsInputSchema>) =>
    e.method === "project_write" || e.method === "project_delete",
  userFacingName: (e: z.infer<typeof projectsInputSchema>) => `Project: ${projectSummary(e)}`, // @433706-433708

  // validateInput @433718+ — checks required keys per the URp per-method table.
  // call — dispatches method against the attached project's knowledge API; project_write enforces the
  //   ~50k-token budget guard (refuses crossings unless force:true; hard refuses above max_knowledge_size).
  call: undefined as unknown as Tool["call"],
};

// ===========================================================================
// SendUserFile
// ===========================================================================

// 2.1.183: SEND_USER_FILE_TOOL_NAME = RPt @cli_inner_pretty.js:221302
export const SEND_USER_FILE_TOOL_NAME = "SendUserFile";
// 2.1.183: sendUserFileDescription = d5r @cli_inner_pretty.js:221303
const SEND_USER_FILE_DESCRIPTION = "Send one or more files to the user";
// 2.1.183: sendUserFilePrompt = p5r @cli_inner_pretty.js:221304-221312
const SEND_USER_FILE_PROMPT = `Send files to the user. Use this when the file *is* the deliverable — a generated diagram, a report, a screenshot, a built artifact — and you want it surfaced, not just mentioned. Paths can be absolute or relative to the current working directory.

Add a \`caption\` when a one-liner of context helps ("the failing case is row 42", "before vs after"). Skip it if the file speaks for itself.

Set \`status\` on every call. Use \`proactive\` when you're initiating — the user is away and you want this to reach their phone (build artifact ready, report generated). Use \`normal\` when replying to something the user just said.

Files must already exist on the local filesystem — the tool sends files, it doesn't fetch URLs or render content. When unsure of a path, verify with ls first; absolute paths avoid ambiguity about the working directory.

Example: SendUserFile({ files: ["report.md"], caption: "Here's the report.", status: "normal" })`;

// 2.1.183: sendUserFileInputSchema = aRp @cli_inner_pretty.js:431621-431631 (lazy)
const sendUserFileInputSchema = z.strictObject({
  files: z
    .preprocess((v) => (typeof v === "string" ? [v] : v), z.array(z.string()).min(1))
    .describe(
      // @431623-431625
      "File paths (absolute or relative to cwd) to send to the user. Always pass an array, even for a single file.",
    ),
  caption: z.string().optional().describe("Optional short caption for the file(s)."), // @431626
  status: z.enum(["normal", "proactive"]).describe(
    // @431627-431629
    "Use 'proactive' when you're surfacing a file the user hasn't asked for and needs to see now — a generated artifact, a completed report. Use 'normal' when replying to something the user just said.",
  ),
});

// 2.1.183: sendUserFileOutputSchema = lRp @cli_inner_pretty.js:431632-431645
const sendUserFileOutputSchema = z.object({
  caption: z.string().optional(),
  attachments: z
    .array(
      z.object({
        path: z.string(),
        size: z.number(),
        isImage: z.boolean(),
        file_uuid: z.string().optional(),
        media_type: z.string().optional(),
      }),
    )
    .describe("Resolved file metadata"),
});

// 2.1.183: SendUserFileTool = cRp @cli_inner_pretty.js:431646-431710
export const SendUserFileTool = {
  name: SEND_USER_FILE_TOOL_NAME,
  searchHint: "deliver files (screenshots, reports, artifacts) to the user", // @431648
  briefStandalone: true, // @431649
  maxResultSizeChars: 100000, // @431650 (1e5)
  userFacingName: () => "", // @431651-431653
  inputSchema: sendUserFileInputSchema,
  outputSchema: sendUserFileOutputSchema,

  // isEnabled @431660-431666:
  //   false if Ir()!=="firstParty" or ra(); false if !gate("tengu_send_user_file"); then
  //   (hasTransport hk() || env CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE || st(CLAUDE_CODE_REMOTE)) && !isPewterOwl().
  isEnabled() {
    if (getAPIProvider() !== "firstParty" || isSubagent()) return false;
    if (!getFeatureGate("tengu_send_user_file", true)) return false;
    return (
      (hasUserChannelTransport() ||
        !!process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE ||
        parseBoolTrue(process.env.CLAUDE_CODE_REMOTE)) && !isPewterOwlUserChannel()
    );
  },
  isConcurrencySafe: () => true, // @431667-431669
  isReadOnly: () => true, // @431670-431672

  async validateInput({ files }: z.infer<typeof sendUserFileInputSchema>): Promise<ValidationResult> {
    return verifyFilesExist(files); // C3n @431676-431678
  },
  async description() { return SEND_USER_FILE_DESCRIPTION; }, // @431679-431681
  async prompt() { return SEND_USER_FILE_PROMPT; }, // @431682-431684

  // mapToolResult @431685-431701: `${n} ${file(s)} delivered to user.` + per-attachment `  path → file_uuid: …` lines.

  // call @431704-431709:
  async call(
    { files, caption, status }: z.infer<typeof sendUserFileInputSchema>,
    ctx: ToolUseContext,
  ) {
    emitTelemetry("tengu_send_user_file", { proactive: status === "proactive", file_count: files.length }); // @431705
    const appState = ctx.getAppState();
    const attachments = await resolveAttachments(files, {
      replBridgeEnabled: appState.replBridgeEnabled,
      signal: ctx.abortController.signal,
    });
    return { data: { caption, attachments } };
  },
};

// ===========================================================================
// SendUserMessage  (alias "Brief") — the primary visible user-message channel
// ===========================================================================

// 2.1.183: SEND_USER_MESSAGE_TOOL_NAME = KO @cli_inner_pretty.js:221278
export const SEND_USER_MESSAGE_TOOL_NAME = "SendUserMessage";
// 2.1.183: SEND_USER_MESSAGE_ALIAS = MPt @cli_inner_pretty.js:221279
export const SEND_USER_MESSAGE_ALIAS = "Brief";
// 2.1.183: turnWithoutSendSentinel = ivd @cli_inner_pretty.js:221280
export const TURN_WITHOUT_SEND_SENTINEL = "You ended the turn without calling SendUserMessage.";
// 2.1.183: sendUserMessageDescription = l5r @cli_inner_pretty.js:221281
const SEND_USER_MESSAGE_DESCRIPTION = "Send a message to the user";
// 2.1.183: messageFieldDescription = r9a @cli_inner_pretty.js:425320
const MESSAGE_FIELD_DESCRIPTION = "The message for the user. Supports markdown formatting.";

// 2.1.183: sendUserMessagePromptFull = c5r @cli_inner_pretty.js:221282
const SEND_USER_MESSAGE_PROMPT_FULL =
  "Send a message the user will read. Text outside this tool is visible in the detail view, but most won't " +
  "open it — the answer lives here.\n\n" +
  "`message` supports markdown. `attachments` accepts two forms per entry: a file path string (absolute or " +
  "cwd-relative) for a file you can read here — images, diffs, logs — or the exact {file_uuid, file_name, " +
  "size, is_image} object a device tool like `attach_file` returned to you. Use the path form when the file " +
  "is on your working filesystem; use the object form when the user's device already uploaded the file and " +
  "handed you a reference — pass that object through verbatim, don't try to path it.\n\n" +
  "`status` labels intent: 'normal' when replying to what they just asked; 'proactive' when you're " +
  "initiating — a scheduled task finished, a blocker surfaced during background work, you need input on " +
  "something they haven't asked about. Set it honestly; downstream routing uses it.";

// 2.1.183: sendUserMessagePromptBrief = u5r @cli_inner_pretty.js:221284
const SEND_USER_MESSAGE_PROMPT_BRIEF =
  "Send a message the user will read verbatim. Use this for content they need to see exactly as written " +
  "between tool calls — a generated code snippet, a specific value, a direct reply to something they asked " +
  "mid-task. Don't use it for routine narration of what you're about to do, or for your final answer — " +
  "normal text reaches them for those.";

// Pre-resolved uploaded-file object — sPp @425335-425344
const preResolvedFileSchema = z
  .strictObject({
    file_uuid: z.string(),
    file_name: z.string(),
    size: z.number(),
    is_image: z.boolean(),
    media_type: z.string().optional(),
  })
  .describe(
    "A file already uploaded to the filestore (e.g. by the device attach_file tool). Passed through without local stat or upload.",
  );

// Full input schema (when isPewterOwl) — iPp @425346-425358
const sendUserMessageFullSchema = z.strictObject({
  message: z.string().describe(MESSAGE_FIELD_DESCRIPTION),
  attachments: z
    .array(z.union([z.string(), preResolvedFileSchema]))
    .optional()
    .describe(
      // @425351-425353
      "Optional attachments for the user to see alongside your message. Each entry is either a file path (absolute or relative to cwd) for a file you can read locally, or a pre-resolved {file_uuid, file_name, size, is_image} object you obtained from a device tool such as attach_file.",
    ),
  status: z.enum(["normal", "proactive"]).describe(
    // @425354-425356
    "Use 'proactive' when you're surfacing something the user hasn't asked for and needs to see now — task completion while they're away, a blocker you hit, an unsolicited status update. Use 'normal' when replying to something the user just said.",
  ),
});
// Brief input schema (message-only) — aPp @425359
const sendUserMessageBriefSchema = z.object({ message: z.string().describe(MESSAGE_FIELD_DESCRIPTION) });
// Output schema — lPp @425360-425380 (message, attachments?, sentAt?).

// 2.1.183: SendUserMessageTool = o9a @cli_inner_pretty.js:425381-425441
export const SendUserMessageTool = {
  name: SEND_USER_MESSAGE_TOOL_NAME,
  aliases: [SEND_USER_MESSAGE_ALIAS], // @425383
  searchHint: "send a message to the user — your primary visible output channel", // @425384
  briefStandalone: true, // @425385
  maxResultSizeChars: 100000, // @425386 (1e5)
  userFacingName: () => "", // @425387-425389

  // inputSchema getter @425390-425392: full schema in the Pewter-Owl surface, brief otherwise.
  get inputSchema() {
    return isPewterOwlUserChannel() ? sendUserMessageFullSchema : sendUserMessageBriefSchema;
  },

  // isEnabled @425396-425398: isPewterOwlUserChannel() || isPewterOwlToolGate()
  //   lWe @425220-425221: (Cre() && u3t()) || yRr();  Kve @134338-134341: CLAUDE_CODE_PEWTER_OWL_TOOL ?? gate
  isEnabled: () => isPewterOwlUserChannel() || isPewterOwlToolGate(),
  isConcurrencySafe: () => true, // @425399-425401
  isReadOnly: () => true, // @425402-425404

  async validateInput(e: { attachments?: unknown[] }): Promise<ValidationResult> {
    // @425408-425411
    if (!("attachments" in e) || !e.attachments?.length) return { result: true };
    return verifyFilesExist(e.attachments);
  },
  async description() { return SEND_USER_MESSAGE_DESCRIPTION; }, // @425412-425414
  async prompt() {
    // @425415-425417
    return isPewterOwlUserChannel() ? SEND_USER_MESSAGE_PROMPT_FULL : SEND_USER_MESSAGE_PROMPT_BRIEF;
  },

  // mapToolResult @425418-425421: `Message delivered to user.` (+ ` (N attachment(s) included)` when any).

  // call @425425-425440:
  async call(e: z.infer<typeof sendUserMessageFullSchema>, ctx: ToolUseContext) {
    const message = e.message;
    const attachments = "attachments" in e ? e.attachments : undefined;
    const sentAt = new Date().toISOString();
    emitTelemetry("tengu_brief_send", {
      proactive: "status" in e && (e as { status?: string }).status === "proactive",
      attachment_count: attachments?.length ?? 0,
    }); // @425430
    if (!attachments?.length) return { data: { message, sentAt } };
    const appState = ctx.getAppState();
    const resolved = await resolveAttachments(attachments, {
      replBridgeEnabled: appState.replBridgeEnabled,
      signal: ctx.abortController.signal,
    });
    return { data: { message, attachments: resolved, sentAt } };
  },
};

// ===========================================================================
// ShareOnboardingGuide
// ===========================================================================

// 2.1.183: SHARE_ONBOARDING_GUIDE_TOOL_NAME = M3t @cli_inner_pretty.js:435353
export const SHARE_ONBOARDING_GUIDE_TOOL_NAME = "ShareOnboardingGuide";
// 2.1.183: ONBOARDING_FILE = R3t @cli_inner_pretty.js:435379
const ONBOARDING_FILE = "ONBOARDING.md";

// 2.1.183: shareOnboardingGuidePrompt = gfo @cli_inner_pretty.js:435354-435356
// description() and prompt() both return this const (@435417-435440).
const SHARE_ONBOARDING_GUIDE_PROMPT = `Upload the ONBOARDING.md in the current directory and return a share link teammates can open in Claude Code. Call this after the user has confirmed the final content.

When called with the default mode='check': if a local ONBOARDING.md is present, uploads it to the most-recently-updated org guide (or creates one if none exist) and returns a fresh link. If no local file is present, returns the existing link without uploading (status: has_existing).`;

// 2.1.183: shareOnboardingGuideInputSchema = h$p @cli_inner_pretty.js:435390-435404 (lazy)
const shareOnboardingGuideInputSchema = z.strictObject({
  mode: z
    .enum(["check", "update", "create", "delete"])
    .default("check")
    .describe(
      // @435394-435395
      "'check' (default): if ONBOARDING.md is present locally, uploads it to the most-recent guide (creates one if none exist); otherwise reports the existing link without uploading. 'update': upload to a specific guide by short_code. 'create': always make a new link. 'delete': remove a guide.",
    ),
  short_code: z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,64}$/)
    .optional()
    .describe(
      // @435400-435401
      "Short code of a specific guide to target (returned by a previous call). Honored by check, update, and delete — skips the org-wide lookup and targets this guide directly.",
    ),
});
// Output schema y$p @435405-435412: { status: "created"|"updated"|"deleted"|"has_existing"|"unavailable", share_url?, short_code?, message }.

// 2.1.183: ShareOnboardingGuideTool = _$p @cli_inner_pretty.js:435413-435462+
export const ShareOnboardingGuideTool = {
  name: SHARE_ONBOARDING_GUIDE_TOOL_NAME,
  searchHint: "upload ONBOARDING.md and get a team share link", // @435415
  maxResultSizeChars: 1000, // @435416
  async description() { return SHARE_ONBOARDING_GUIDE_PROMPT; }, // @435417-435419
  async prompt() { return SHARE_ONBOARDING_GUIDE_PROMPT; }, // @435438-435440

  // isEnabled = hdt() @435420-435422 / hdt @435302-435307:
  //   false if ra() (subagent) or !di("allow_team_onboarding") or !iH(); else gate "tengu_flint_harbor_share".
  isEnabled: () => shareOnboardingGuideGate(),
  isConcurrencySafe: () => false, // @435423-435425
  isReadOnly: () => false, // @435426-435428
  inputSchema: shareOnboardingGuideInputSchema,

  async validateInput(): Promise<ValidationResult> {
    return { result: true }; // @435435-435437 — always valid
  },
  isDestructive: (e: z.infer<typeof shareOnboardingGuideInputSchema>) => e.mode === "delete", // @435444-435446

  // call @435450+ — mode "delete": resolve short_code (own or most-recent hfo()), vza(code) deletes →
  //   `Guide ${code} deleted.` (or unavailable "No guide found for this org to delete." / "Delete didn't
  //   go through (…)."). mode "check": find guide, stat local ONBOARDING.md (R3t); if present, upload via
  //   Hza (POST /api/organizations/:orgUUID/claude_code/onboarding) and emit
  //   tengu_team_onboarding_share_created; else return existing link (status: has_existing).
  // helper: hfo @mostRecentOrgGuide; Afo @listOrgGuides; vza @deleteGuide; Hza @uploadGuide
  call: undefined as unknown as Tool["call"],
};

// ===========================================================================
// ShowOnboardingRolePicker  (NEW in 2.1.183)
// ===========================================================================

// 2.1.183: SHOW_ONBOARDING_ROLE_PICKER_TOOL_NAME = A3n @cli_inner_pretty.js:424336
export const SHOW_ONBOARDING_ROLE_PICKER_TOOL_NAME = "ShowOnboardingRolePicker";
// 2.1.183: showOnboardingRolePickerDescription = bqa @cli_inner_pretty.js:424337-424338
const SHOW_ONBOARDING_ROLE_PICKER_DESCRIPTION =
  "Render a clickable role-picker chip row during Cowork onboarding so the user can pick their role and get a matching plugin installed.";
// 2.1.183: showOnboardingRolePickerPrompt = Sqa @cli_inner_pretty.js:424339-424343
const SHOW_ONBOARDING_ROLE_PICKER_PROMPT = `Render a clickable role-picker chip row during Cowork onboarding. Call this when asking the user what kind of work they do so they can pick their role and get a matching plugin installed. The role list is hardcoded in the frontend — call with no args.

The call blocks until the user responds. Three resolution paths all land in the tool result: chip click or free-form typed answer → {"role": "Legal"} or {"role": "paralegal"}; X button → {"dismissed": true}. An empty object {} means the user approved without picking a role — treat it like a dismissal. Free-form roles may not match the chip list — search the marketplace with whatever string you get.

Do NOT call this in normal conversation. Only call this when explicitly helping the user set up Cowork for their role/job function.`;

// 2.1.183: rolePickerInputSchema = kDp @cli_inner_pretty.js:424356 — empty object (no args)
const rolePickerInputSchema = z.strictObject({});
// Output schema LDp @424357: { role?, dismissed? }.
const rolePickerOutputSchema = z.object({
  role: z.string().optional(),
  dismissed: z.boolean().optional(),
});

// 2.1.183: ShowOnboardingRolePickerTool = Eqa @cli_inner_pretty.js:424358-424412
export const ShowOnboardingRolePickerTool = {
  name: SHOW_ONBOARDING_ROLE_PICKER_TOOL_NAME,
  searchHint: "show the Cowork onboarding role picker", // @424360
  maxResultSizeChars: 10000, // @424361 (1e4)
  inputSchema: rolePickerInputSchema,
  outputSchema: rolePickerOutputSchema,

  // isEnabled = DDp @424344-424346: returns Ge.CLAUDE_CODE_REMOTE (only remote/Cowork sessions).
  isEnabled: () => Boolean(process.env.CLAUDE_CODE_REMOTE),
  isConcurrencySafe: () => true, // @424369-424371
  isReadOnly: () => true, // @424372-424374
  requiresUserInteraction: () => true, // @424375-424377
  async description() { return SHOW_ONBOARDING_ROLE_PICKER_DESCRIPTION; }, // @424378-424380
  async prompt() { return SHOW_ONBOARDING_ROLE_PICKER_PROMPT; }, // @424381-424383

  // checkPermissions @424387-424389: always ask.
  async checkPermissions(): Promise<PermissionResult> {
    return { behavior: "ask", message: "Pick your role?", updatedInput: {} };
  },

  // call @424390-424398: blocks until the UI returns the picker result; echoes { role?, dismissed? }
  //   (role only when a non-empty string; dismissed only when a boolean).
  async call(e: { role?: string; dismissed?: boolean }) {
    const { role, dismissed } = e;
    return {
      data: {
        ...(typeof role === "string" && role.trim() !== "" && { role }),
        ...(typeof dismissed === "boolean" && { dismissed }),
      },
    };
  },
};

// ===========================================================================
// explain_command  (INTERNAL — NOT a getAllBaseTools entry)
// ===========================================================================
//
// This is a raw Anthropic-API `tools` entry (wire-format `input_schema`, NOT a pi()/buildTool()
// object). It is never in getAllBaseTools and is never exposed to the agent. It is used ONLY by the
// permission-explainer sub-LLM call (EW(...) @633027-633056) with tool_choice forced to this tool and
// system prompt "Analyze shell commands and explain what they do, why you're running them, and potential
// risks." (BMf @633082). The model's reply is parsed by explainCommandResultSchema (UMf).
//
// 2.1.183: explainCommandToolDef = FMf @cli_inner_pretty.js:633098-633118
export const explainCommandToolDef = {
  name: "explain_command",
  description: "Provide an explanation of a shell command", // @633100
  input_schema: {
    type: "object" as const,
    properties: {
      explanation: { type: "string", description: "What this command does (1-2 sentences)" }, // @633104
      reasoning: {
        type: "string",
        // @633107
        description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"',
      },
      risk: { type: "string", description: "What could go wrong, under 15 words" }, // @633109
      riskLevel: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH"],
        // @633113
        description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)",
      },
    },
    required: ["explanation", "reasoning", "risk", "riskLevel"],
  },
};

// 2.1.183: explainCommandResultSchema = UMf @cli_inner_pretty.js:633119-633126
const explainCommandResultSchema = z.object({
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  explanation: z.string(),
  reasoning: z.string(),
  risk: z.string(),
});

// ===========================================================================
// eval_registered__*  (INTERNAL — NOT a getAllBaseTools entry)
// ===========================================================================
//
// A per-registered-tool factory used by the REPL `registerTool` surface. The wire name is templated
// `eval_registered__${name}` (the literal lives only at the factory site). These tools are collected by
// c9a(e,t) @425552-425556 (`for (let [,r] of e) push(makeRegisteredEvalTool(r, t))`) and only exist when
// the REPL eval/registration surface is active — NEVER part of getAllBaseTools. The name prefix is also
// guarded at :377614 (n.name.startsWith("eval_registered__")) and validated at registerTool :426825
// (name must match ^[a-zA-Z0-9_-]{1,111}$; the wire name is prefixed with 'eval_registered__').
//
// 2.1.183: makeRegisteredEvalTool = pPp @cli_inner_pretty.js:425569-425632
export function makeRegisteredEvalTool(
  registered: {
    name: string;
    description: string;
    schema: unknown; // caller-supplied JSON schema → inputJSONSchema
    handler: (input: unknown) => Promise<unknown>;
    displayName?: string;
  },
  serializer: { stringify: (v: unknown) => string; toStr: (v: unknown) => string },
) {
  const passthroughSchema = z.object({}).passthrough(); // @425570
  return {
    name: `eval_registered__${registered.name}`, // @425572
    maxResultSizeChars: 100000, // @425573 (1e5)
    async prompt() { return registered.description; }, // @425574-425576
    async description() { return registered.description; }, // @425577-425579
    inputSchema: passthroughSchema, // @425580
    inputJSONSchema: registered.schema, // @425581
    isEnabled: () => true, // @425582-425584
    isConcurrencySafe: () => false, // @425585-425587
    isReadOnly: () => false, // @425588-425590
    async checkPermissions(): Promise<PermissionResult> {
      // @425595-425597
      return { behavior: "ask", message: `Execute registered tool "${registered.name}"` };
    },
    async call(input: unknown) {
      // @425598-425600
      return { data: await registered.handler(input) };
    },
    userFacingName: () => registered.displayName ?? registered.name, // @425601-425603
  };
}

// ---------------------------------------------------------------------------
// getAllBaseTools membership (LW @cli_inner_pretty.js:436517-436576)
//
//   DesignSync                k$p   @436536 (always present when isEnabled)
//   Projects                  iKa   @436537 — conditional spread: only when env CLAUDE_PROJECT_TOOL set
//   Artifact                  dKa   @436540 (conditional spread; null when DCe()-disabled module-bind)
//   ShareOnboardingGuide      _Ka   @436550 (conditional spread)
//   ShowOnboardingRolePicker  Eqa   @436560 (direct)
//   SendUserMessage           o9a   @436564 (direct)
//   SendUserFile              x$p   @436565 (direct)
//
//   explain_command + eval_registered__* are NOT here (internal/eval-only — confirmed above).
// ---------------------------------------------------------------------------

// --- Local helper declarations (resolved elsewhere in the bundle; declared for type-completeness) ---
declare function resolveToCwd(p: string): string; // Ds
declare function extname(p: string): string; // Adt.extname
declare function parseArtifactUrl(url: string): { env: string; slug: string } | null; // NPt
declare function currentArtifactEnv(): "staging" | "prod";
declare function artifactGate(): boolean; // DCe
declare function designSyncGate(): boolean; // fdt
declare function isDesignReadMethod(method: string): boolean; // kRp
declare function designSummary(e: unknown): string; // efo
declare function missingRequiredKeys(e: unknown): string[]; // IRp
declare function attachedProjectUuid(): string | undefined; // O6a
declare function isProjectReadMethod(method: string): boolean; // jRp
declare function projectSummary(e: unknown): string; // a4n
declare function shareOnboardingGuideGate(): boolean; // hdt
declare function isManagedSettingAllowed(key: string): boolean; // di
declare function getAPIProvider(): string; // Ir
declare function isSubagent(): boolean; // ra
declare function getFeatureGate(name: string, fallback: boolean): boolean; // ct
declare function parseBoolTrue(v: unknown): boolean; // st
declare function hasUserChannelTransport(): boolean; // hk
declare function isPewterOwlUserChannel(): boolean; // lWe
declare function isPewterOwlToolGate(): boolean; // Kve
declare function verifyFilesExist(files: unknown[]): Promise<ValidationResult>; // C3n
declare function resolveAttachments(
  files: unknown[],
  opts: { replBridgeEnabled?: boolean; signal: AbortSignal },
): Promise<unknown[]>; // I3n
declare function emitTelemetry(event: string, props: Record<string, unknown>): void; // G
