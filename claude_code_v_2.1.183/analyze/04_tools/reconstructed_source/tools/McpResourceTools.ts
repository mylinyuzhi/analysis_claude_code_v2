/**
 * MCP tool family — readable-source restoration for Claude Code v2.1.183.
 *
 * Covers the four "MCP plumbing" tools plus the dynamic per-server tool wrapper:
 *   - ListMcpResourcesTool  (obf `_G`)       — list resources across connected MCP servers
 *   - ReadMcpResourceTool   (obf `kG`)       — read a single resource by (server, uri); SEP-2640 dir listing
 *   - WaitForMcpServers     (obf `sla`)      — block until still-connecting servers come up
 *   - MCPTool base template  (obf `mVr`)     — the inert "mcp" tool every dynamic wrapper spreads from
 *   - buildMcpToolWrappers (the `l = a.map(...)` block) — how an upstream MCP tool becomes a Tool object
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - ListMcpResources name/description/prompt consts: 235977-235994
 *   - ListMcpResources schemas + tool object `_G`:      236140-236238 (render helpers 236123-236131)
 *   - ReadMcpResource name/description consts:          275509-275517
 *   - ReadMcpResource prompt const `ZQi` (SEP-2640):    275519-275530
 *   - ReadMcpResource dir-listing helper `P2d`:         275557-275579
 *   - ReadMcpResource schemas + tool object `kG`:       275580-275746
 *   - WaitForMcpServers description/name `E5r`/`kCe`:   221682-221698
 *   - WaitForMcpServers gates/schemas/tool object:      298062-298206 (timeout `P9d`=5000 @298069)
 *   - MCPTool base template `mVr`:                      261830-261874 (`Kji`/`Yji`="" @236359-236360)
 *   - Dynamic wrapper factory (`l = a.map(...)`):       285100-285318
 *   - MCP name helpers oc/kk/q3/V3/lOe/_nn:             55423-55447
 *   - Consts: zrt="inode/directory"@274900, oxe=2048@284376, K9r=500000@233595
 *
 * 2.1.88 convention mirror:
 *   src/tools/MCPTool/MCPTool.ts, src/tools/ListMcpResourcesTool/ListMcpResourcesTool.ts,
 *   src/tools/ReadMcpResourceTool/ReadMcpResourceTool.ts
 *   (WaitForMcpServers + the dynamic wrapper have no 2.1.88 file — wrapper lives in services/mcp/client.ts.)
 *
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/06_mcp/README.md
 *
 * Cross-validation note: every name const, .describe() string, error string, gate predicate, telemetry
 * event and the SEP-2640 directory-listing branch were read verbatim in the 2.1.183 bundle. NEW in 2.1.183
 * vs 2.1.156: ReadMcpResource's directory-resource listing (`ZQi` prompt paragraph, `D2d.resources`,
 * `P2d` helper, `inode/directory` descend) — wording/`resources` array are new this release.
 */

import { z } from "zod/v4";
import { buildTool, type ToolDef } from "../Tool";
import type { PermissionResult } from "../permissions";

// ============================================================================
// Shared MCP name helpers — obf oc/kk/q3/V3/lOe/_nn @cli_inner_pretty.js:55423-55447
// ============================================================================

// 2.1.183: normalizeServerName = oc @55423
// MCP server/tool names are sanitized to the Anthropic tool-name charset
// [a-zA-Z0-9_-]; "claude.ai " server names get their underscore runs collapsed.
export function normalizeServerName(name: string): string {
  let normalized = name.replace(/[^a-zA-Z0-9_-]/g, "_"); // @55424
  if (name.startsWith("claude.ai ")) {
    // @55425 — collapse runs and trim leading/trailing "_"
    normalized = normalized.replace(/_+/g, "_").replace(/^_|_$/g, "");
  }
  return normalized;
}

// 2.1.183: parseMcpToolName = kk @55428 — split "mcp__<server>__<tool>"
export function parseMcpToolName(
  fullName: string,
): { serverName: string; toolName: string | undefined } | null {
  const parts = fullName.split("__"); // @55429
  const [prefix, server, ...rest] = parts;
  if (prefix !== "mcp" || !server) return null; // @55431
  const toolName = rest.length > 0 ? rest.join("__") : undefined; // @55432 — tool may itself contain "__"
  return { serverName: server, toolName };
}

// 2.1.183: mcpToolNamePrefix = q3 @55435 → `mcp__<normalizedServer>__`
export function mcpToolNamePrefix(serverName: string): string {
  return `mcp__${normalizeServerName(serverName)}__`;
}

// 2.1.183: mcpToolName = V3 @55438 → `mcp__<server>__<tool>` (both normalized)
export function mcpToolName(serverName: string, toolName: string): string {
  return `${mcpToolNamePrefix(serverName)}${normalizeServerName(toolName)}`;
}

// ============================================================================
// Constants
// ============================================================================

// 2.1.183: DIRECTORY_MIME_TYPE = zrt @274900 — SEP-2640 directory-resource mime
const DIRECTORY_MIME_TYPE = "inode/directory";
// 2.1.183: MCP_PROMPT_MAX_CHARS = oxe @284376 — per-tool prompt() truncation ceiling
const MCP_PROMPT_MAX_CHARS = 2048;
// 2.1.183: MCP_RESULT_SIZE_CEILING = K9r @233595 — max honored anthropic/maxResultSizeChars
const MCP_RESULT_SIZE_CEILING = 500_000;

// ============================================================================
// ListMcpResourcesTool — obf `_G` @236164-236237
// ============================================================================

// 2.1.183: LIST_MCP_RESOURCES_TOOL_NAME = Hae @235977
export const LIST_MCP_RESOURCES_TOOL_NAME = "ListMcpResourcesTool";

// 2.1.183: LIST_MCP_RESOURCES_DESCRIPTION = kji @235978-235985 (verbatim)
const LIST_MCP_RESOURCES_DESCRIPTION = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`;

// 2.1.183: LIST_MCP_RESOURCES_PROMPT = Lji @235986-235994 (verbatim)
const LIST_MCP_RESOURCES_PROMPT = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`;

// 2.1.183: listMcpResourcesInputSchema = qxd @236150-236152
const listMcpResourcesInputSchema = () =>
  z.object({
    server: z.string().optional().describe("Optional server name to filter resources by"),
  });
type ListMcpResourcesInput = ReturnType<typeof listMcpResourcesInputSchema>;

// 2.1.183: listMcpResourcesOutputSchema = Vxd @236153-236163
const listMcpResourcesOutputSchema = () =>
  z.array(
    z.object({
      uri: z.string().describe("Resource URI"),
      name: z.string().describe("Resource name"),
      mimeType: z.string().optional().describe("MIME type of the resource"),
      description: z.string().optional().describe("Resource description"),
      server: z.string().describe("Server that provides this resource"),
    }),
  );
type ListMcpResourcesOutput = z.infer<ReturnType<typeof listMcpResourcesOutputSchema>>;

// 2.1.183: ListMcpResourcesTool = _G @236164-236237
export const ListMcpResourcesTool = buildTool({
  isConcurrencySafe() {
    return true; // @236165-236167
  },
  isReadOnly() {
    return true; // @236168-236170 — pure read
  },
  toAutoClassifierInput(input) {
    return input.server ?? ""; // @236171-236173
  },
  shouldDefer: true, // @236174 — loaded on demand via ToolSearch
  name: LIST_MCP_RESOURCES_TOOL_NAME, // @236175
  aliases: ["ListMcpResources"], // @236176
  searchHint: "list resources from connected MCP servers", // @236177
  maxResultSizeChars: 100_000, // @236178
  async description() {
    return LIST_MCP_RESOURCES_DESCRIPTION; // @236179-236181
  },
  async prompt() {
    return LIST_MCP_RESOURCES_PROMPT; // @236182-236184
  },
  get inputSchema(): ListMcpResourcesInput {
    return listMcpResourcesInputSchema();
  },
  get outputSchema() {
    return listMcpResourcesOutputSchema();
  },
  // No checkPermissions — read-only, no permission gate.

  // call @236191-236221
  async call(input, { options: { mcpClients } }) {
    const { server: targetServer } = input;

    // Filter clients by exact name, falling back to normalized-name match. @236192-236200
    const clientsToProcess = targetServer
      ? ((target: string) => {
          const exact = mcpClients.find((c) => c.name === target);
          if (exact) return [exact];
          const normalized = normalizeServerName(target); // @236197
          return mcpClients.filter((c) => normalizeServerName(c.name) === normalized);
        })(targetServer)
      : mcpClients;

    if (targetServer && clientsToProcess.length === 0) {
      // @236201-236205 — McpError("MCP server not found")
      throw new McpError(
        `Server "${targetServer}" not found. Available servers: ${mcpClients.map((c) => c.name).join(", ")}`,
        "MCP server not found",
      );
    }

    // Per-client: skip non-connected; ensure a live connection, then list resources.
    // fetchResourcesForClient (X2) is LRU-cached and invalidated on close /
    // list_changed; ensureConnectedClient (u2e) is a no-op when healthy. @236206-236220
    const results = await Promise.all(
      clientsToProcess.map(async (client) => {
        if (client.type !== "connected") return []; // @236210
        try {
          const fresh = await ensureConnectedClient(client); // helper: u2e @283631
          return await fetchResourcesForClient(fresh); // helper: X2 @285358 (LRU-cached)
        } catch (error) {
          // One server's failure must not sink the whole result. @236214-236215
          logMcpError(client.name, errorMessage(error));
          return [];
        }
      }),
    );

    return { data: results.flat() }; // @236206-236220
  },

  renderToolUseMessage: renderListUseMessage, // jji @236123
  userFacingName: () => "listMcpResources", // @236223
  renderToolResultMessage: renderListResultMessage, // Gji @236126
  isResultTruncated(output, { columns }) {
    return isOutputLineTruncated(jsonStringify(output, null, 2), columns); // @236225-236227
  },
  // mapToolResultToToolResultBlockParam @236228-236235
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    if (!content || content.length === 0) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        // @236233 verbatim — note: a server can still expose tools with zero resources
        content: "No resources found. MCP servers may still provide tools even if they have no resources.",
      };
    }
    return { tool_use_id: toolUseID, type: "tool_result", content: jsonStringify(content) };
  },
} satisfies ToolDef<ListMcpResourcesInput, ListMcpResourcesOutput>);

// 2.1.183: renderListUseMessage = jji @236123-236125
function renderListUseMessage(input: { server?: string }): string {
  return input.server ? `List MCP resources from server "${input.server}"` : "List all MCP resources";
}
// renderListResultMessage = Gji @236126 — UI summary, "(No resources found)" / pretty JSON. Summarized.

// ============================================================================
// ReadMcpResourceTool — obf `kG` @275629-275745  ★ SEP-2640 directory listing
// ============================================================================

// 2.1.183: READ_MCP_RESOURCE_TOOL_NAME = Jrt @275509
export const READ_MCP_RESOURCE_TOOL_NAME = "ReadMcpResourceTool";

// 2.1.183: READ_MCP_RESOURCE_DESCRIPTION = QQi @275510-275517 (verbatim)
const READ_MCP_RESOURCE_DESCRIPTION = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`;

// 2.1.183: READ_MCP_RESOURCE_PROMPT = ZQi @275521-275529 (verbatim) — NEW directory-resource paragraph
const READ_MCP_RESOURCE_PROMPT = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read

When the URI names a directory resource on a server that supports directory listing, the result carries a "resources" array listing the directory's direct children. Subdirectories appear with mimeType "${DIRECTORY_MIME_TYPE}"; read them again to descend.
`;

// 2.1.183: readMcpResourceInputSchema = k2d @275598-275603
const readMcpResourceInputSchema = () =>
  z.object({
    server: z.string().describe("The MCP server name"),
    uri: z.string().describe("The resource URI to read"),
  });
type ReadMcpResourceInput = ReturnType<typeof readMcpResourceInputSchema>;

// 2.1.183: RESOURCE_NOT_FOUND_CODES = L2d @275604 — JSON-RPC codes treated as "resource not found"
const RESOURCE_NOT_FOUND_CODES = new Set([-32002, McpErrorCode.InvalidParams]);

// 2.1.183: readMcpResourceOutputSchema = D2d @275605-275628 — adds SEP-2640 `resources` array
const readMcpResourceOutputSchema = () =>
  z.object({
    contents: z.array(
      z.object({
        uri: z.string().describe("Resource URI"),
        mimeType: z.string().optional().describe("MIME type of the content"),
        text: z.string().optional().describe("Text content of the resource"),
        blobSavedTo: z.string().optional().describe("Path where binary blob content was saved"),
      }),
    ),
    error: z
      .string()
      .optional()
      .describe("Human-readable error when the server could not read the resource"), // @275615
    resources: z
      .array(
        z.object({
          uri: z.string().describe("Child resource URI"),
          name: z.string().describe("Child resource name"),
          mimeType: z.string().optional().describe("Child MIME type"),
        }),
      )
      .optional()
      // @275624-275625 verbatim
      .describe(
        `Direct children when the URI is a directory resource (SEP-2640 resources/directory/read). Subdirectories appear with mimeType "${DIRECTORY_MIME_TYPE}".`,
      ),
  });
type ReadMcpResourceOutput = z.infer<ReturnType<typeof readMcpResourceOutputSchema>>;

/**
 * 2.1.183: readDirectoryResource = P2d @275557-275579
 *
 * SEP-2640 directory listing. Issues `resources/directory/read` against the
 * server, maps each child into {uri,name,mimeType}, and synthesizes a
 * human-readable text body (subdirectories get a trailing "/"). The structured
 * `resources` array is what lets the model descend by re-reading a child URI.
 */
async function readDirectoryResource(
  connection: ConnectedClient,
  uri: string,
): Promise<ReadMcpResourceOutput> {
  const children = (await fetchDirectoryChildren(connection, uri)).map((child) => ({
    uri: decodeMcpUri(child.uri), // helper: Xrt @275478
    name: sanitizeMcpText(child.name), // helper: ij @275496
    mimeType: child.mimeType !== undefined ? sanitizeMcpText(child.mimeType) : undefined,
  }));

  // @275563-275564 — "name/" for subdirectories, "name" otherwise, newline-joined
  const listing = children
    .map((c) => `${c.name}${c.mimeType === DIRECTORY_MIME_TYPE ? "/" : ""}`)
    .join("\n");

  return {
    contents: [
      {
        uri,
        mimeType: DIRECTORY_MIME_TYPE,
        text:
          children.length > 0
            ? `Directory listing for ${uri} (${children.length} ${pluralize(children.length, "entry", "entries")}):\n${listing}`
            : `Directory ${uri} is empty.`, // @275572-275574
      },
    ],
    resources: children,
  };
}

// 2.1.183: ReadMcpResourceTool = kG @275629-275745
export const ReadMcpResourceTool = buildTool({
  isConcurrencySafe() {
    return true; // @275630-275632
  },
  isReadOnly() {
    return true; // @275633-275635
  },
  toAutoClassifierInput(input) {
    return `${input.server} ${input.uri}`; // @275636-275638
  },
  shouldDefer: true, // @275639
  name: READ_MCP_RESOURCE_TOOL_NAME, // @275640 (literal "ReadMcpResourceTool")
  aliases: ["ReadMcpResource"], // @275641
  searchHint: "read a specific MCP resource by URI", // @275642
  maxResultSizeChars: 100_000, // @275643
  async description() {
    return READ_MCP_RESOURCE_DESCRIPTION; // @275644-275646
  },
  async prompt() {
    return READ_MCP_RESOURCE_PROMPT; // @275647-275649
  },
  get inputSchema(): ReadMcpResourceInput {
    return readMcpResourceInputSchema();
  },
  get outputSchema() {
    return readMcpResourceOutputSchema();
  },
  // No checkPermissions — read-only.

  // call @275656-275733
  async call(input, { options: { mcpClients } }) {
    const { server: serverName, uri } = input;

    // Resolve client by exact name, then by normalized name. @275657-275659
    const normalized = normalizeServerName(serverName);
    const client =
      mcpClients.find((c) => c.name === serverName) ??
      mcpClients.find((c) => normalizeServerName(c.name) === normalized);

    if (!client) {
      // @275660-275664
      throw new McpError(
        `Server "${serverName}" not found. Available servers: ${mcpClients.map((c) => c.name).join(", ")}`,
        "MCP server not found",
      );
    }
    if (client.type !== "connected") {
      // @275665
      throw new McpError(`Server "${client.name}" is not connected`, "MCP server not connected");
    }
    if (!client.capabilities?.resources) {
      // @275666-275667 — server didn't advertise the resources capability
      throw new McpError(
        `Server "${client.name}" does not support resources`,
        "MCP server has no resources capability",
      );
    }
    // Plugin-sourced servers are gated through the plugin trust check. @275668
    if (client.config.pluginSource) assertPluginTrusted(client.config.pluginSource);

    const connection = await ensureConnectedClient(client); // u2e @283631
    let result: ReadResourceResult;
    try {
      // @275672 — standard resources/read request
      result = await connection.client.request(
        { method: "resources/read", params: { uri } },
        ReadResourceResultSchema,
      );
    } catch (error) {
      // @275674 — `c instanceof Mi`: Mi is the SDK McpError class (.code), NOT the thrown wrapper Bl.
      if (error instanceof McpError) {
        // (a) Server advertises resources but didn't implement reads. @275675-275687
        if (error.code === McpErrorCode.MethodNotFound) {
          logMcpError(
            client.name,
            "resources/read returned -32601 MethodNotFound — server advertises resources but does not implement reads",
          );
          return {
            data: {
              contents: [],
              error: `Server "${client.name}" advertises resource support but does not implement resource reads.`,
            },
          };
        }
        // (b) SEP-2640 fallback: InvalidParams + dir-capable → try directory listing. @275688-275693
        if (
          isDirectoryResourcesEnabled() && // helper: $L @274842 → ct("tengu_mcp_skills", false)
          error.code === McpErrorCode.InvalidParams &&
          supportsDirectoryListing(connection.capabilities) // helper: qrt @274848
        ) {
          try {
            return { data: await readDirectoryResource(connection, uri) };
          } catch (dirError) {
            // Only swallow a *second* InvalidParams; rethrow anything else. @275692
            if (!(dirError instanceof McpError) || dirError.code !== McpErrorCode.InvalidParams) throw dirError;
          }
        }
        // (c) Known "not found" codes → friendly error + cache eviction. @275694-275705
        if (RESOURCE_NOT_FOUND_CODES.has(error.code)) {
          logMcpError(client.name, `resources/read returned ${error.code} — resource not found`);
          fetchResourcesForClient.cache.delete(client.name); // X2.cache @275697
          fetchResourceTemplates.cache.delete(client.name); // Bae.cache @275698 (resources/templates/list LRU)
          return {
            data: {
              contents: [],
              error: `Resource not found: ${uri} — it may have been deleted or the URI is stale. Re-run ${LIST_MCP_RESOURCES_TOOL_NAME} to refresh.`,
            },
          };
        }
      }
      throw error; // @275707
    }

    // Normalize contents: text passes through; binary blobs are decoded and
    // written to disk (so base64 never lands in the model context). @275709-275731
    return {
      data: {
        contents: await Promise.all(
          result.contents.map(async (c, i) => {
            if ("text" in c) return { uri: c.uri, mimeType: c.mimeType, text: c.text }; // @275713
            if (!("blob" in c) || typeof c.blob !== "string") return { uri: c.uri, mimeType: c.mimeType }; // @275714

            const persistId = `mcp-resource-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`; // @275715
            const persisted = await persistBinaryContent(Buffer.from(c.blob, "base64"), c.mimeType, persistId); // B2e @275434
            if ("error" in persisted) {
              return {
                uri: c.uri,
                mimeType: c.mimeType,
                text: `Binary content could not be saved to disk: ${persisted.error}`, // @275721
              };
            }
            return {
              uri: c.uri,
              mimeType: c.mimeType,
              blobSavedTo: persisted.filepath,
              // getBinaryBlobSavedMessage (_$t) — "[Resource from <server> at <uri>] saved to ..." @275727
              text: getBinaryBlobSavedMessage(
                persisted.filepath,
                c.mimeType,
                persisted.size,
                `[Resource from ${client.name} at ${c.uri}] `,
              ),
            };
          }),
        ),
      },
    };
  },

  renderToolUseMessage: renderReadUseMessage, // eZi @275531
  userFacingName: () => "readMcpResource", // tZi @275535
  renderToolResultMessage: renderReadResultMessage, // nZi @275538
  isResultTruncated(output, { columns }) {
    // @275737-275739 — measure the error string if present, else the pretty JSON
    if (output.error) return isOutputLineTruncated(output.error, columns);
    return isOutputLineTruncated(jsonStringify(output, null, 2), columns);
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    // @275741-275743
    if (content.error) return { tool_use_id: toolUseID, type: "tool_result", content: content.error };
    return { tool_use_id: toolUseID, type: "tool_result", content: jsonStringify(content) };
  },
} satisfies ToolDef<ReadMcpResourceInput, ReadMcpResourceOutput>);

// 2.1.183: renderReadUseMessage = eZi @275531-275534 (null if uri/server missing)
function renderReadUseMessage(input: { server?: string; uri?: string }): string | null {
  if (!input.uri || !input.server) return null;
  return `Read resource "${input.uri}" from server "${input.server}"`;
}
// renderReadResultMessage = nZi @275538 — UI: error / "(No content)" / pretty JSON. Summarized.

// ============================================================================
// WaitForMcpServers — obf `sla` @298095-298206
// ============================================================================

// 2.1.183: WAIT_FOR_MCP_SERVERS_TOOL_NAME = kCe @221698
export const WAIT_FOR_MCP_SERVERS_TOOL_NAME = "WaitForMcpServers";

// 2.1.183: WAIT_FOR_MCP_SERVERS_POLL_TIMEOUT_MS = P9d @298069 — 5 s upper bound on the wait
const WAIT_FOR_MCP_SERVERS_POLL_TIMEOUT_MS = 5000;

// 2.1.183: waitForMcpServersText = E5r @221682-221697 — used for BOTH description() and prompt() (verbatim)
function waitForMcpServersText(): string {
  return [
    "Wait for MCP servers that are still connecting and whose tools are not",
    "yet in your tool list. Pass `servers` to wait for specific ones, or omit",
    "it to wait for all pending servers.",
    "",
    "If the user's request needs tools from a still-connecting server, call this",
    "tool to wait for it. Once it connects, its tools will be added to your tool",
    "list and you can use them directly. Returns ready=true when servers are",
    "ready, ready=false if they failed to connect, need authentication, or are",
    "disabled.",
    "",
    "You do not need to ask the user for confirmation to use this tool.",
  ].join("\n");
}

// 2.1.183: pendingMcpServerNames = ola @298062-298063 — names of servers in "pending" state
function pendingMcpServerNames(): string[] {
  return (getMcpClients() ?? []).filter((c) => c.type === "pending").map((c) => c.name);
}

// 2.1.183: isWaitForMcpServersEnabled = CXr @298065-298068
// Enabled only when there ARE pending servers; suppressed when running headless
// in the SDK-gated mode (fR() && f7(model)).
function isWaitForMcpServersEnabled(model: unknown): boolean {
  if (isSdkRuntime() && isWaitToolSdkSuppressed(model)) return false; // @298066 — fR() && f7(e)
  return pendingMcpServerNames().length > 0; // @298067
}

// 2.1.183: waitForMcpServersInputSchema = M9d @298081-298083
const waitForMcpServersInputSchema = () =>
  z.object({
    servers: z
      .array(z.string())
      .optional()
      .describe("Server names to wait for (default: all pending)"),
  });
type WaitForMcpServersInput = ReturnType<typeof waitForMcpServersInputSchema>;

// 2.1.183: waitForMcpServersOutputSchema = R9d @298084-298093
const waitForMcpServersOutputSchema = () =>
  z.object({
    ready: z.boolean(),
    connected: z.array(z.string()),
    failed: z.array(z.string()),
    stillPending: z.array(z.string()),
    needsAuth: z.array(z.string()),
    disabled: z.array(z.string()),
    unknown: z.array(z.string()),
  });
type WaitForMcpServersOutput = z.infer<ReturnType<typeof waitForMcpServersOutputSchema>>;

// 2.1.183: WaitForMcpServers = sla @298095-298206
export const WaitForMcpServers = buildTool({
  isEnabled() {
    return isWaitForMcpServersEnabled(getCurrentModel()); // @298096-298098 (Gs())
  },
  isConcurrencySafe() {
    return false; // @298099-298101 — polls/mutates connection state; NOT concurrency-safe
  },
  isReadOnly() {
    return true; // @298102-298104
  },
  name: WAIT_FOR_MCP_SERVERS_TOOL_NAME, // @298105
  maxResultSizeChars: 10_000, // @298106
  async description() {
    return waitForMcpServersText(); // @298107-298109
  },
  async prompt() {
    return waitForMcpServersText(); // @298110-298112
  },
  get inputSchema(): WaitForMcpServersInput {
    return waitForMcpServersInputSchema();
  },
  get outputSchema() {
    return waitForMcpServersOutputSchema();
  },
  // checkPermissions @298119-298121 — always allowed (no user prompt)
  async checkPermissions(input): Promise<PermissionResult> {
    return { behavior: "allow", updatedInput: input };
  },

  // call @298122-298183
  async call(input, context) {
    const {
      options: { refreshMcpClients, mcpClients },
      abortController,
      getMcp,
    } = context;

    // Prefer a fresh snapshot each poll: refreshMcpClients() → getMcp().clients → static list. @298128
    const snapshot = () => refreshMcpClients?.() ?? getMcp?.().clients ?? mcpClients;

    // Default to all pending servers when `servers` is omitted. @298129
    const requested = input.servers?.length ? input.servers : pendingMcpServerNames();
    const requestedNormalized = new Set(requested.map(normalizeServerName)); // @298130

    // Match requested names exactly OR by normalized form. @298131
    const matching = () =>
      snapshot().filter(
        (c) => requested.includes(c.name) || requestedNormalized.has(normalizeServerName(c.name)),
      );

    // Poll every 50 ms until none are pending, 5 s elapsed, or aborted. @298132-298134
    const start = Date.now();
    const deadline = start + WAIT_FOR_MCP_SERVERS_POLL_TIMEOUT_MS;
    while (matching().some((c) => c.type === "pending") && Date.now() < deadline && !abortController.signal.aborted) {
      await sleep(50, abortController.signal); // Un(50, signal) @298134
    }

    const waitMs = Date.now() - start;
    const final = matching();

    // Bucket by connection state. @298142-298160
    const connected: string[] = [];
    const failed: string[] = [];
    const stillPending: string[] = [];
    const needsAuth: string[] = [];
    const disabled: string[] = [];
    for (const c of final) {
      switch (c.type) {
        case "connected":
          connected.push(c.name);
          break;
        case "failed":
          failed.push(c.name);
          break;
        case "pending":
          stillPending.push(c.name);
          break;
        case "needs-auth":
          needsAuth.push(c.name);
          break;
        case "disabled":
          disabled.push(c.name);
          break;
      }
    }

    // "unknown" = requested names that match no known server. @298161-298162
    const seen = new Set(final.map((c) => normalizeServerName(c.name)));
    const unknown = requested.filter((name) => !seen.has(normalizeServerName(name)));

    // ready ⇔ nothing is still pending / failed / needs-auth / disabled / unknown. @298163
    const ready =
      stillPending.length === 0 &&
      failed.length === 0 &&
      needsAuth.length === 0 &&
      disabled.length === 0 &&
      unknown.length === 0;

    log(
      `[WaitForMcpServers] waited=${waitMs}ms connected=${connected.join(",")} failed=${failed.join(",")} ` +
        `pending=${stillPending.join(",")} needsAuth=${needsAuth.join(",")} disabled=${disabled.join(",")} unknown=${unknown.join(",")}`,
    ); // @298166

    // tengu_mcp_pending_call telemetry @298168-298180
    sendTelemetry("tengu_mcp_pending_call", {
      requestedCount: requested.length,
      connectedCount: connected.length,
      failedCount: failed.length,
      pendingCount: stillPending.length,
      needsAuthCount: needsAuth.length,
      disabledCount: disabled.length,
      unknownCount: unknown.length,
      waitMs,
      matched: ready,
      matchType: redactEnum("wait"),
      success: ready,
    });

    return { data: { ready, connected, failed, stillPending, needsAuth, disabled, unknown } };
  },

  renderToolUseMessage: renderWaitUseMessage, // rla @298059
  userFacingName: renderWaitUserFacingName, // nla
  // mapToolResultToToolResultBlockParam @298186-298205 — human-readable bucket summary
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    const lines = [
      `ready: ${output.ready}`,
      output.connected.length
        ? `Connected (their tools are now available — call them directly): ${output.connected.join(", ")}`
        : "",
      output.failed.length ? `Failed to connect: ${output.failed.join(", ")}` : "",
      output.stillPending.length ? `Still connecting (try again or proceed without): ${output.stillPending.join(", ")}` : "",
      output.needsAuth.length ? `Needs authentication (ask the user to run /mcp): ${output.needsAuth.join(", ")}` : "",
      output.disabled.length ? `Disabled (ask the user to enable via /mcp): ${output.disabled.join(", ")}` : "",
      output.unknown.length ? `Unknown (no MCP server with this name is configured): ${output.unknown.join(", ")}` : "",
    ].filter(Boolean);
    return {
      type: "tool_result",
      tool_use_id: toolUseID,
      content: lines.join("\n"),
      is_error: !output.ready, // @298203 — not-ready is surfaced as an error block
    };
  },
} satisfies ToolDef<WaitForMcpServersInput, WaitForMcpServersOutput>);

// renderWaitUseMessage = rla @298059-298060 → `Wait for MCP servers to connect: <list>` / "Wait for pending MCP servers to connect"
// renderWaitUserFacingName = nla — UI label. Both summarized.

// ============================================================================
// MCPTool base template — obf `mVr` @261836-261874
//
// This is the inert "mcp" tool every dynamic per-server wrapper spreads from.
// description/prompt are EMPTY strings here (Kji="" @236359, Yji="" @236360);
// the real text comes from the upstream tool definition (see wrapper below).
// ============================================================================

// 2.1.183: mcpToolInputSchema = E$d @261830 — accepts any object (server defines its own schema)
const mcpToolInputSchema = () => z.object({}).passthrough();
type McpToolInput = ReturnType<typeof mcpToolInputSchema>;

// 2.1.183: mcpToolOutputSchema = H$d @261831-261835
const mcpToolOutputSchema = () =>
  z
    .union([
      z.string(),
      z.array(z.object({ type: z.string() }).passthrough()),
      z.undefined(),
    ])
    .describe("MCP tool execution result");
type McpToolOutput = z.infer<ReturnType<typeof mcpToolOutputSchema>>;

// 2.1.183: MCPTool = mVr @261836-261874
export const MCPTool = buildTool({
  isMcp: true, // @261837
  isOpenWorld() {
    return false; // @261838-261840 — overridden per upstream tool
  },
  name: "mcp", // @261841 — overridden per upstream tool to mcp__<server>__<tool>
  maxResultSizeChars: 100_000, // @261842
  async description() {
    return ""; // Yji="" @261843-261845 — overridden per upstream tool
  },
  async prompt() {
    return ""; // Kji="" @261846-261848 — overridden per upstream tool
  },
  get inputSchema(): McpToolInput {
    return mcpToolInputSchema();
  },
  get outputSchema() {
    return mcpToolOutputSchema();
  },
  async call() {
    return { data: "" }; // @261855-261857 — placeholder; overridden per upstream tool
  },
  // checkPermissions @261858-261860 — base passthrough (wrapper adds an addRules suggestion)
  async checkPermissions(): Promise<PermissionResult> {
    return { behavior: "passthrough", message: "MCPTool requires permission." };
  },
  renderToolUseMessage: renderMcpUseMessage, // OVi @261861
  userFacingName: () => "mcp", // @261862
  renderToolUseProgressMessage: renderMcpProgressMessage, // NVi @261863
  renderToolResultMessage: renderMcpResultMessage, // gIn @261864
  isResultTruncated(output, context) {
    // @261865-261870 — measure string, or any text block in a content array
    const columns = context?.columns;
    if (typeof output === "string") return isOutputLineTruncated(output, columns);
    if (Array.isArray(output)) return output.some((b) => b.type === "text" && isOutputLineTruncated(b.text, columns));
    return false;
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    // @261871-261873 — stripMcpMeta (Nnt @236249) drops upstream `_meta` before serializing
    return { tool_use_id: toolUseID, type: "tool_result", content: stripMcpMeta(content) };
  },
} satisfies ToolDef<McpToolInput, McpToolOutput>);

// ============================================================================
// Dynamic per-server MCP tool wrapper — the `l = a.map(...)` block @285100-285318
//
// Inside the MCP-client tool-loader: for each upstream tool `u` from a connected
// server `e`, build a Tool object by spreading MCPTool and overriding identity,
// schema passthrough, gating from annotation hints, permissions, and call().
// ============================================================================

/**
 * 2.1.183: buildMcpToolWrappers — the `a.map((u) => { ... })` block @285133-285304
 *
 * `loadedTools` (`a` @285113-285125) is the upstream tool list AFTER filtering out
 * tools whose JSON schema uses constructs the Anthropic API rejects: each is run
 * through validateMcpSchema (CGd @283609); a non-null result names the offending
 * construct, the tool is dropped with logMcpError(..."its input schema uses ${d},
 * which the Anthropic API does not accept...") @285119-285124 and a
 * `tengu_mcp_degraded` (reason "tool_schema_unsupported") event @285127.
 */
function buildMcpToolWrappers(server: McpServerConnection, loadedTools: UpstreamMcpTool[]): Tool[] {
  // CLAUDE_AGENT_SDK_MCP_NO_PREFIX: SDK servers may expose tools under their bare
  // upstream name instead of mcp__<server>__<tool>. @285100
  const useBareName = server.config.type === "sdk" && parseBoolTrue(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

  // claudeai-proxy / http / sse servers may ship per-tool permission ceilings. @285101-285104
  const toolPermissions =
    server.config.type === "claudeai-proxy" || server.config.type === "http" || server.config.type === "sse"
      ? server.config.toolPermissions
      : undefined;

  return loadedTools
    .map((tool) => {
      // Full wire name `mcp__<server>__<tool>`. @285135
      const fullName = mcpToolName(server.name, tool.name);

      // Honor anthropic/maxResultSizeChars hint (capped at MCP_RESULT_SIZE_CEILING). @285136-285137
      const maxResultHint = tool._meta?.["anthropic/maxResultSizeChars"];
      const hasResultSizeAnnotation =
        typeof maxResultHint === "number" && Number.isFinite(maxResultHint) && maxResultHint > 0;

      const wrapper: Tool = {
        ...MCPTool, // @285139 — spread the inert base
        name: useBareName ? tool.name : fullName, // @285140

        // Provenance metadata used by the UI / permission system. @285141-285152
        mcpInfo: {
          serverName: server.name,
          scope: server.config.scope,
          displayName: "displayName" in server.config ? server.config.displayName : undefined,
          iconUrl: "iconUrl" in server.config ? server.config.iconUrl : undefined,
          serverInfoName: server.serverInfo?.name,
          toolName: tool.name,
          title: tool.annotations?.title?.replace(/\s+/g, " ").trim() || undefined,
          execution: tool.execution,
          role: "role" in server.config ? server.config.role : undefined,
          effectiveMaxPermission: toolPermissions?.[tool.name],
        },
        isMcp: true, // @285153

        // anthropic/searchHint hint (whitespace-collapsed). @285154-285157
        searchHint:
          typeof tool._meta?.["anthropic/searchHint"] === "string"
            ? tool._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || undefined
            : undefined,
        // Eagerly load when the server or the tool opts in. @285158
        alwaysLoad: server.config.alwaysLoad === true || tool._meta?.["anthropic/alwaysLoad"] === true,

        // description = the upstream tool's description verbatim. @285159-285161
        async description() {
          return tool.description ?? "";
        },
        // prompt = the upstream description, truncated to MCP_PROMPT_MAX_CHARS. @285162-285165
        async prompt() {
          const desc = tool.description ?? "";
          return desc.length > MCP_PROMPT_MAX_CHARS
            ? truncate(desc, MCP_PROMPT_MAX_CHARS) + "… [truncated]"
            : desc;
        },

        // Gating is entirely driven by the upstream annotation hints. @285166-285181
        isConcurrencySafe() {
          return tool.annotations?.readOnlyHint ?? false;
        },
        isReadOnly() {
          return tool.annotations?.readOnlyHint ?? false;
        },
        readOnlyHint: tool.annotations?.readOnlyHint,
        toAutoClassifierInput(input) {
          return buildMcpClassifierInput(input, tool.name); // kGd @283640
        },
        isDestructive() {
          return tool.annotations?.destructiveHint ?? false;
        },
        isOpenWorld() {
          return tool.annotations?.openWorldHint ?? false;
        },

        // Honor the per-tool result-size annotation (capped). @285182-285183
        maxResultSizeChars: hasResultSizeAnnotation
          ? Math.min(maxResultHint, MCP_RESULT_SIZE_CEILING)
          : MCPTool.maxResultSizeChars,
        persistenceThresholdCeiling: hasResultSizeAnnotation ? MCP_RESULT_SIZE_CEILING : undefined,

        // Raw upstream JSON schema passed straight through to the wire (already
        // validated by validateMcpSchema above). @285184
        inputJSONSchema: tool.inputSchema,

        // Permission: passthrough + suggest an allow rule for this exact tool. @285185-285198
        async checkPermissions(): Promise<PermissionResult> {
          return {
            behavior: "passthrough",
            message: "MCPTool requires permission.",
            suggestions: [
              {
                type: "addRules",
                rules: [{ toolName: fullName, ruleContent: undefined }],
                behavior: "allow",
                destination: "localSettings",
              },
            ],
          };
        },

        // call: invoke the upstream tool, emitting mcp_progress events, with a
        // single retry on session recovery. @285199-285281
        async call(args, ctx, _unused, extra, onProgress) {
          const toolUseId = extractToolUseId(extra); // MGd @284287
          const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

          if (onProgress && toolUseId) {
            onProgress({
              type: "progress",
              toolUseID: toolUseId,
              data: { type: "mcp_progress", status: "started", serverName: server.name, toolName: tool.name }, // @285206
            });
          }

          const startedAt = Date.now();
          const maxRetries = 1; // @285209
          for (let attempt = 0; ; attempt++) {
            try {
              const client = await ensureConnectedClient(server); // u2e @283631
              // invokeMcpTool (k7r @284034) — the actual MCP CallTool round-trip.
              const result = await invokeMcpTool({
                client,
                clientConnection: server,
                tool: tool.name,
                args,
                meta,
                signal: ctx.abortController.signal,
                setAppState: ctx.setAppState,
                imageLimits: getImageLimits(ctx.options.mainLoopModel),
                toolExecution: tool.execution,
                taskRegistry: ctx.taskRegistry,
                toolUseId,
                onProgress:
                  onProgress && toolUseId
                    ? (event) => onProgress({ type: "progress", toolUseID: toolUseId, data: event })
                    : undefined,
                requestDialog: ctx.requestDialog,
                hasResultSizeAnnotation,
              });

              if (onProgress && toolUseId) {
                onProgress({
                  type: "progress",
                  toolUseID: toolUseId,
                  data: {
                    type: "mcp_progress",
                    status: "completed",
                    serverName: server.name,
                    toolName: tool.name,
                    elapsedTimeMs: Date.now() - startedAt, // @285243
                  },
                });
              }
              if (!result.isError) onPossibleGitOperation(tool.name); // oZi @285246

              return {
                data: result.content, // @285248
                // Forward _meta / structuredContent under mcpMeta when present. @285249-285254
                ...((result._meta || result.structuredContent) && {
                  mcpMeta: {
                    ...(result._meta && { _meta: result._meta }),
                    ...(result.structuredContent && { structuredContent: result.structuredContent }),
                  },
                }),
              };
            } catch (error) {
              // Retry exactly once after a session-recovery error. @285257-285260
              if (error instanceof SessionRecoveryError && attempt < maxRetries) {
                logMcpInfo(server.name, `Retrying tool '${tool.name}' after session recovery`);
                continue;
              }
              if (onProgress && toolUseId) {
                onProgress({
                  type: "progress",
                  toolUseID: toolUseId,
                  data: {
                    type: "mcp_progress",
                    status: "failed",
                    serverName: server.name,
                    toolName: tool.name,
                    elapsedTimeMs: Date.now() - startedAt, // @285270
                  },
                });
              }
              // Wrap plain/McpError into the user-facing McpError. @285273-285278
              if (error instanceof Error && !(error instanceof McpError)) {
                const ctor = error.constructor.name;
                if (ctor === "Error") throw new McpError(error.message, error.message.slice(0, 200));
                if (ctor === "McpError" && "code" in error && typeof error.code === "number")
                  throw new McpError(error.message, `McpError ${error.code}`);
              }
              throw error;
            }
          }
        },

        // userFacingName = "<server> - <title|tool> (MCP)". @285282-285285
        userFacingName() {
          const label = (tool.annotations?.title || tool.name).replace(/\s+/g, " ").trim();
          return `${server.name} - ${label} (MCP)`;
        },

        // Per-integration overrides, only for stdio servers. @285286-285292
        // Chrome (Claude-in-Chrome) and computer-use servers can patch specific
        // tools (e.g. richer rendering / permission handling).
        ...(isClaudeInChromeServer(server.name) && (server.config.type === "stdio" || !server.config.type)
          ? getClaudeInChromeMCPToolOverrides(tool.name)
          : {}),
        ...((server.config.type === "stdio" || !server.config.type) && isComputerUseServer(server.name)
          ? getComputerUseMCPToolOverrides(tool.name)
          : {}),
        ...(isBuiltinBashOrFetchTool(tool.name) ? getBuiltinMcpToolOverrides() : {}),
      };

      // Wrap call() once more to stamp the active server/tool onto the context,
      // gate plugin-sourced servers, and fire first-use telemetry. @285294-285301
      const innerCall = wrapper.call;
      wrapper.call = async (args, ctx, a3, a4, a5) => {
        ctx.options.activeMcpServer = server.name;
        ctx.options.activeMcpTool = tool.name;
        if (server.config.pluginSource) assertPluginTrusted(server.config.pluginSource);
        if (shouldNotifyFirstMcpUse(server.name, server.config.type, getServerKind(server.config))) {
          notifyFirstMcpUse(server.name);
        }
        return innerCall(args, ctx, a3, a4, a5);
      };

      return wrapper;
    })
    .filter(isDefinedTool); // wGd @285305 — drop any nulled-out entries
}

// ============================================================================
// Helper references (verified present in the 2.1.183 bundle; bodies out of scope)
// ============================================================================
//
// MCP client/runtime:
//   ensureConnectedClient        u2e   @283631  — get/refresh a live client connection
//   fetchResourcesForClient      X2    @285358  — LRU-cached resources/list (HC-wrapped, caches by server name)
//   fetchResourceTemplates       Bae   @285377  — LRU-cached resources/templates/list (HC-wrapped); its cache is the SECOND eviction in kG.call @275698 (NOT a directory cache)
//   fetchDirectoryChildren       OQi   @274867  — SEP-2640 readMcpDirectory (plain async fn, NO .cache); call site @275558
//   invokeMcpTool                k7r   @284034  — the upstream CallTool round-trip
//   supportsDirectoryListing     qrt   @274848  — capability probe (extensions["io.modelcontextprotocol/skills"].directoryRead === true)
//   isDirectoryResourcesEnabled  $L    @274842  — gate, returns ct("tengu_mcp_skills", false) (Statsig flag that also enables SEP-2640 dir listing)
//   validateMcpSchema            CGd   @283609  — returns the rejected schema construct, or null
//   getMcpClients                iRe   @3521    — current MCP client list (from session state)
//   getCurrentModel              Gs    @102401  — main-loop model
//   isSdkRuntime                 fR    @221224  — running under the Agent SDK
//   isWaitToolSdkSuppressed      f7    @221218  — SDK-mode suppression predicate for the wait tool
//
// Per-integration overrides (stdio only):
//   isClaudeInChromeServer       bAe   @192789
//   getClaudeInChromeMCPToolOverrides  AGd().getClaudeInChromeMCPToolOverrides @285287
//   isComputerUseServer          lTe   @145256
//   getComputerUseMCPToolOverrides     gGd().getComputerUseMCPToolOverrides    @285290
//   isBuiltinBashOrFetchTool/getBuiltinMcpToolOverrides   Jea/Qea  @285292
//
// Result/blob plumbing:
//   persistBinaryContent         B2e   @275434
//   getBinaryBlobSavedMessage    _$t   @275449  (def; call site @275727)
//   stripMcpMeta                 Nnt   @236249
//   decodeMcpUri                 Xrt   @275478
//   sanitizeMcpText              ij    @275496
//   extractToolUseId             MGd   @284287
//   buildMcpClassifierInput      kGd   @283640
//
// Generic utils:
//   McpError (user-facing wrapper)  Bl   @8957  — class TelemetrySafeError extends Error;
//                                              constructor(message, telemetryMessage); name="TelemetrySafeError".
//                                              This is what the resource/wrapper code THROWS as `new Bl(msg, telemetryMsg)`
//                                              (the 2nd arg is the telemetry-safe message, not a "shortMessage").
//                                              ABOVE this file uses the name `McpError` for `Bl` — read it as TelemetrySafeError.
//   SdkMcpError (caught class)      Mi   @25573 — class McpError extends Error; constructor(code, message, data);
//                                              .name="McpError", .code:number. This is the SDK error CAUGHT by
//                                              `catch (c) { if (c instanceof Mi) ... }` @275674 and whose `.code` is read.
//                                              ABOVE, `error instanceof McpError` @414 means `c instanceof Mi`, and the
//                                              string check `ctor === "McpError"` @285276 matches Mi (name "McpError").
//   McpErrorCode (enum)          Oi    @25199-25208 — InvalidParams=-32602 / MethodNotFound=-32601 / …
//   SessionRecoveryError (class) yot
//   truncate                     RD    @10081
//   normalizeServerName          oc    @55423  (reconstructed above)
//   logMcpError                  wu
//   logMcpInfo                   on
//   errorMessage                 Se
//   jsonStringify                Re
//   isOutputLineTruncated        hG
//   sleep                        Un
//   pluralize                    vn
//   sendTelemetry                G
//   redactEnum                   Qe
//   log                          v
//   parseBoolTrue                st
//   assertPluginTrusted          $9
//   onPossibleGitOperation       oZi   @275747 (PR/MR creation telemetry)
//   shouldNotifyFirstMcpUse / notifyFirstMcpUse   _1r / TLi
//   getServerKind                Hge
//   getImageLimits               ch
//   renderMcpUseMessage/Progress/Result   OVi/NVi/gIn
