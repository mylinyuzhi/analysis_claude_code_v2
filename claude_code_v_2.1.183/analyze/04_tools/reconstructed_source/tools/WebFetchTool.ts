/**
 * WebFetchTool — fetch a URL, convert to markdown, and answer a prompt against
 * it using a small fast model. Readable-source reconstruction for Claude Code
 * v2.1.183.
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - 210992              name const `nE = "WebFetch"`
 *   - 210993-211007       prompt builder `m$i` (lean vs verbose, artifact-exception flag)
 *   - 211008-211027       secondary-model summary prompt `A$i`
 *   - 211028-211046       verbose usage-notes const `DSd`
 *   - 408554-408561       preapproved-host predicate `tjn`
 *   - 409225-409234       input→rule-content `lGa`
 *   - 409235-409239       allow-rule suggestion builder `Guo`
 *   - 409240-409249       artifact-url detector `Jkp`
 *   - 409266-409282       input/output Zod schemas `Ykp` / `Xkp`
 *   - 409283-409518       tool object `gF = pi({...})`
 *   - 134268-134273       lean predicate `Dg` (scaffold X3)
 *   - 147998              feature-flag getter `di`
 *
 * 2.1.88 convention mirror: src/tools/WebFetchTool/{WebFetchTool.ts,prompt.ts}
 * 2.1.156 scaffold: 04_tools/README.md (WebFetch contract)
 *
 * Cross-validation note: re-verified in the 183 bundle that the auth-failure
 * reminder + the artifact-exception clause are now *inside* the model-branched
 * `prompt()` (m$i), gated on `Dg(model)` and on
 * `vl(tools, ARTIFACT_TOOL_NAME) && isArtifactToolEnabled()` (@409371-409375) —
 * unlike 2.1.88 where the auth warning was an unconditional prefix in prompt().
 * Description/prompt strings quoted verbatim from the bundle and confirmed
 * against assets/tools/WebFetch.md.
 */

import { z } from 'zod/v4'
import { buildTool, type ToolDef } from '../Tool.js'
import type { PermissionUpdate } from '../../types/permissions.js'
import type { PermissionDecision } from '../../utils/permissions/PermissionResult.js'
import { lazySchema } from '../../utils/lazySchema.js'

// ── Identity ────────────────────────────────────────────────────────────────

// 2.1.183: WEB_FETCH_TOOL_NAME = nE @cli_inner_pretty.js:210992
export const WEB_FETCH_TOOL_NAME = 'WebFetch'

// ── Prompt text ─────────────────────────────────────────────────────────────

// 2.1.183: WEB_FETCH_VERBOSE_USAGE_NOTES = DSd @cli_inner_pretty.js:211028-211046
// Verbatim; matches assets/tools/WebFetch.md branch-2 tail.
const VERBOSE_USAGE_NOTES = `
- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content

Usage notes:
  - IMPORTANT: If an MCP-provided web fetch tool is available, prefer using that tool instead of this one, as it may have fewer restrictions.
  - The URL must be a fully-formed valid URL
  - HTTP URLs will be automatically upgraded to HTTPS
  - The prompt should describe what information you want to extract from the page
  - This tool is read-only and does not modify any files
  - Results may be summarized if the content is very large
  - Includes a self-cleaning 15-minute cache for faster responses when repeatedly accessing the same URL
  - When a URL redirects to a different host, the tool will inform you and provide the redirect URL in a special format. You should then make a new WebFetch request with the redirect URL to fetch the content.
  - For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).
`

/**
 * Builds the WebFetch `prompt()` text. Two branches keyed by the lean/simple
 * system-prompt predicate `Dg` (scaffold X3); both insert the claude.ai
 * artifact exception clause only when `artifactToolEnabled` is true.
 *
 * 2.1.183: buildWebFetchPrompt = m$i @cli_inner_pretty.js:210993-211007
 * Mapping: m$i→buildWebFetchPrompt, e→model, t→artifactToolEnabled, DSd→VERBOSE_USAGE_NOTES
 */
function buildWebFetchPrompt(model: unknown, artifactToolEnabled = false): string {
  if (isLeanSystemPrompt(model)) {
    // Lean branch @210995-210999. The artifact-exception sentence (`@210997`)
    // is appended to the auth-failure bullet only when the Artifact tool is
    // live in the current tool list.
    return `Fetches a URL, converts the page to markdown, and answers \`prompt\` against it using a small fast model.

- Fails on authenticated/private URLs — use an authenticated MCP tool or \`gh\` for those instead.${
      artifactToolEnabled
        ? ' Exception: claude.ai/code/artifact/{uuid} URLs ARE fetchable via your claude.ai login — use WebFetch, not curl (curl gets the SPA shell or a Cloudflare 403).'
        : ''
    }
- HTTP is upgraded to HTTPS. Cross-host redirects are returned to you rather than followed; call again with the redirect URL.
- Responses are cached for 15 minutes per URL.`
  }

  // Verbose branch @211000-211006: the unconditional auth-failure reminder,
  // then the artifact-exception block (only when artifactToolEnabled), then the
  // long usage-notes const.
  return `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, look for a specialized MCP tool that provides authenticated access.
${
    artifactToolEnabled
      ? `- Exception: claude.ai/code/artifact/{uuid} URLs (including preview.claude.ai) ARE fetchable — WebFetch uses your claude.ai login. Use WebFetch for these, not curl or a headless browser (those return the SPA shell or a Cloudflare 403, not the content).
`
      : ''
  }${VERBOSE_USAGE_NOTES}`
}

/**
 * Prompt handed to the small/fast model that summarizes fetched markdown.
 * For non-preapproved domains it enforces the 125-char quote ceiling and the
 * lyrics/legal guardrails.
 *
 * 2.1.183: buildSecondaryModelPrompt = A$i @cli_inner_pretty.js:211008-211027
 * Mapping: A$i→buildSecondaryModelPrompt, e→markdownContent, t→prompt, n→isPreapprovedDomain
 */
function buildSecondaryModelPrompt(
  markdownContent: string,
  prompt: string,
  isPreapprovedDomain: boolean,
): string {
  const guidelines = isPreapprovedDomain
    ? 'Provide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed.' // @211019
    : `Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics.` // @211020-211024

  return `
Web page content:
---
${markdownContent}
---

${prompt}

${guidelines}
`
}

// ── Schemas ─────────────────────────────────────────────────────────────────

// 2.1.183: inputSchema = Ykp @cli_inner_pretty.js:409266-409271
const inputSchema = lazySchema(() =>
  z.strictObject({
    url: z.string().url().describe('The URL to fetch content from'), // @409268
    prompt: z.string().describe('The prompt to run on the fetched content'), // @409269
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: outputSchema = Xkp @cli_inner_pretty.js:409272-409282
// NEW vs 2.1.88: optional `artifactRead` block ({slug, ver}) for claude.ai
// artifact reads (the version recorded via setArtifactReadVersion in `call`).
const outputSchema = lazySchema(() =>
  z.object({
    bytes: z.number().describe('Size of the fetched content in bytes'),
    code: z.number().describe('HTTP response code'),
    codeText: z.string().describe('HTTP response code text'),
    result: z
      .string()
      .describe('Processed result from applying the prompt to the content'),
    durationMs: z.number().describe('Time taken to fetch and process the content'),
    url: z.string().describe('The URL that was fetched'),
    artifactRead: z.object({ slug: z.string(), ver: z.string() }).optional(), // @409280
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.infer<OutputSchema>

// ── Permission helpers ──────────────────────────────────────────────────────

/**
 * Maps a WebFetch input to its permission rule-content string: `domain:<host>`
 * on success, or `input:<raw>` if the URL can't be parsed.
 *
 * 2.1.183: webFetchInputToRuleContent = lGa @cli_inner_pretty.js:409225-409234
 * Mapping: lGa→webFetchInputToRuleContent
 */
function webFetchInputToRuleContent(input: { [k: string]: unknown }): string {
  try {
    const parsed = WebFetchTool.inputSchema.safeParse(input)
    if (!parsed.success) return `input:${input.toString()}`
    const { url } = parsed.data
    return `domain:${new URL(url).hostname}` // @409230
  } catch {
    return `input:${input.toString()}`
  }
}

/**
 * Builds the "addRules → allow (localSettings)" suggestion list shown when
 * WebFetch is asked-but-ungranted.
 *
 * 2.1.183: buildAllowSuggestions = Guo @cli_inner_pretty.js:409235-409239
 * Mapping: Guo→buildAllowSuggestions, e→ruleContent
 */
function buildAllowSuggestions(ruleContent: string): PermissionUpdate[] {
  return [
    {
      type: 'addRules',
      destination: 'localSettings',
      rules: [{ toolName: WEB_FETCH_TOOL_NAME, ruleContent }],
      behavior: 'allow',
    },
  ]
}

// Predicate: is this URL on the preapproved-host allowlist (host + path match)?
// 2.1.183: isPreapprovedUrl = tjn @cli_inner_pretty.js:408554-408561
//   → try { new URL(e); return T2a(host, pathname) } catch { return false }
//   helper: T2a @408... — preapproved host/path matcher
// helper: isLeanSystemPrompt = Dg @134268-134273 — lean/simple system-prompt predicate (X3)
// helper: isFeatureEnabled = di @147998 — Statsig/local feature-flag getter
declare function isPreapprovedUrl(url: string): boolean
declare function isLeanSystemPrompt(model: unknown): boolean
declare function isFeatureEnabled(flag: string): boolean

// Permission-rule lookups against the active tool-permission context.
// helper: getToolPermissionContext = Br @... — appState.toolPermissionContext
// helper: getRulesForTool = jY @... — map of rule-content → rule for (tool, behavior)
// helper: matchRuleByContent = m2n @... — looks up ruleContent in that map
declare function getToolPermissionContext(context: ToolUseContext): unknown
declare function getRulesForTool(
  permissionContext: unknown,
  tool: unknown,
  behavior: 'deny' | 'ask' | 'allow',
): Map<string, unknown>
declare function matchRuleByContent(rules: Map<string, unknown>, ruleContent: string): unknown
type ToolUseContext = any

// ── Artifact / fetch helpers (call() internals — summarized) ────────────────
//
// helper: detectArtifactUrl = Jkp @409240-409249 — returns parsed artifact ref
//   ({slug,ver}) when `vl(tools, ARTIFACT_TOOL_NAME) && isArtifactToolEnabled()`
//   and the URL is a claude.ai artifact URL, else null.
// helper: fetchUrlAsMarkdown = njn @... — performs the HTTP fetch and returns a
//   FetchedContent | {type:'redirect'} | {type:'http_error'} | {type:'provenance_denied'}.
// helper: summarizeWithModel = rjn @... — runs buildSecondaryModelPrompt through
//   the small/fast model over the (HTML→markdown) content.
// helper: htmlToMarkdown = ejn @... — converts artifact HTML to markdown.
// helper: httpStatusText = ojn @... — HTTP status-code → reason phrase.
// helper: formatHttpErrorResult = Kkp @... — builds the http_error result string.
// helper: provenancePromptFlow = y2a @... — interactive provenance re-fetch prompt.
// helper: persistBinaryContent = persistBinaryContent @... — saves PDFs/binaries to disk.
declare const MAX_RAW_MARKDOWN_LENGTH: number // Tut — markdown shortcut size ceiling

// ── Tool object ─────────────────────────────────────────────────────────────

// 2.1.183: WebFetchTool = gF @cli_inner_pretty.js:409283-409518
export const WebFetchTool = buildTool({
  name: WEB_FETCH_TOOL_NAME,
  // Permission rules key off the `url` input field. @409285
  ruleContentField: 'url',
  searchHint: 'fetch and extract content from a URL', // @409286
  // 100K chars — tool-result persistence threshold. @409287
  maxResultSizeChars: 100_000,
  shouldDefer: true, // @409288 — deferred / ToolSearch-loaded

  async description(input) {
    const { url } = input as { url: string }
    try {
      // @409292
      return `Claude wants to fetch content from ${new URL(url).hostname}`
    } catch {
      return 'Claude wants to fetch content from this URL' // @409294
    }
  },

  userFacingName() {
    return 'Fetch' // @409298
  },

  // getToolUseSummary: lco @393584; getActivityDescription @409301-409304
  // → `Fetching ${summary}` | 'Fetching web page'.

  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },

  // Feature-gated: only enabled when the `allow_web_fetch` flag is on. @409311-409313
  isEnabled() {
    return isFeatureEnabled('allow_web_fetch')
  },
  isConcurrencySafe() {
    return true // @409314-409316
  },
  isReadOnly() {
    return true // @409317-409319
  },

  toAutoClassifierInput(input) {
    // @409320-409322
    return input.prompt ? `${input.url}: ${input.prompt}` : input.url
  },

  /**
   * Rule-based permission decision keyed on the `domain:<host>` rule-content.
   * Precedence: deny rule → ask rule → allow rule → preapproved-host allow →
   * default ask. @409323-409349
   */
  async checkPermissions(input, context): Promise<PermissionDecision> {
    const permissionContext = getToolPermissionContext(context)
    const ruleContent = webFetchInputToRuleContent(input)

    const denyRule = matchRuleByContent(
      getRulesForTool(permissionContext, WebFetchTool, 'deny'),
      ruleContent,
    )
    if (denyRule) {
      return {
        behavior: 'deny',
        // @409330
        message: `${WebFetchTool.name} denied access to ${ruleContent}.`,
        decisionReason: { type: 'rule', rule: denyRule },
      }
    }

    const askRule = matchRuleByContent(
      getRulesForTool(permissionContext, WebFetchTool, 'ask'),
      ruleContent,
    )
    if (askRule) {
      return {
        behavior: 'ask',
        // @409337
        message: `Claude requested permissions to use ${WebFetchTool.name}, but you haven't granted it yet.`,
        decisionReason: { type: 'rule', rule: askRule },
        suggestions: buildAllowSuggestions(ruleContent),
      }
    }

    const allowRule = matchRuleByContent(
      getRulesForTool(permissionContext, WebFetchTool, 'allow'),
      ruleContent,
    )
    if (allowRule) {
      return {
        behavior: 'allow',
        updatedInput: input,
        decisionReason: { type: 'rule', rule: allowRule },
      }
    }

    // Preapproved host (docs.anthropic.com etc.) → allow without a rule. @409343-409344
    if (isPreapprovedUrl(input.url)) {
      return {
        behavior: 'allow',
        updatedInput: input,
        decisionReason: { type: 'other', reason: 'Preapproved host' },
      }
    }

    return {
      behavior: 'ask',
      // @409347
      message: `Claude requested permissions to use ${WebFetchTool.name}, but you haven't granted it yet.`,
      suggestions: buildAllowSuggestions(ruleContent),
    }
  },

  async validateInput(input) {
    const { url } = input
    try {
      new URL(url)
    } catch {
      return {
        result: false,
        // @409361
        message: `Error: Invalid URL "${url}". The URL provided could not be parsed.`,
        meta: { reason: 'invalid_url' },
        errorCode: 1,
      }
    }
    return { result: true }
  },

  /**
   * Prompt text — detects whether the claude.ai Artifact tool is live in the
   * current tool list (`vl(tools, ARTIFACT_TOOL_NAME) && isArtifactToolEnabled()`)
   * and, when so, lets buildWebFetchPrompt inject the artifact-exception clause.
   * @409368-409378
   */
  async prompt({ model, tools }) {
    let artifactToolEnabled = false
    {
      // Dynamic import of the Artifact tool wiring (out of scope here). @409371-409375
      const [{ ARTIFACT_TOOL_NAME }, { isArtifactToolEnabled }] = await Promise.all([
        import('../ArtifactTool/prompt.js'),
        import('../ArtifactTool/enablement.js'),
      ])
      artifactToolEnabled = !!toolListIncludes(tools ?? [], ARTIFACT_TOOL_NAME) && isArtifactToolEnabled()
    }
    return buildWebFetchPrompt(model, artifactToolEnabled)
  },

  /**
   * Fetches and returns the processed result. Faithful behavior (@409379-409514):
   *   1. Upgrade `http:` → `https:`. @409389-409391
   *   2. Artifact path: if `detectArtifactUrl(url)` matches, read the claude.ai
   *      artifact via `readArtifactContent`. Owner-role artifacts return raw or
   *      disk-saved HTML (with a `[Artifact … owned by you; …]` header) and, when
   *      the frame-base-version flag is on, record `artifactRead:{slug,ver}` and
   *      call `setArtifactReadVersion`; non-owner artifacts are summarized via the
   *      small model. @409393-409448
   *   3. Otherwise `fetchUrlAsMarkdown(url)` and branch on the response type:
   *        - provenance_denied → throw, or run the interactive `provenancePromptFlow`
   *          (telemetry `tengu_web_fetch_provenance_prompt`). @409451-409467
   *        - http_error → telemetry `tengu_web_fetch_http_error`; return the
   *          formatted error result. @409468-409481
   *        - redirect → return the verbatim REDIRECT DETECTED block (see below).
   *          @409482-409503
   *   4. Markdown shortcut: preapproved host + `text/markdown` + body <
   *      MAX_RAW_MARKDOWN_LENGTH → return raw markdown; else summarize via the
   *      small model. @409504-409508
   *   5. Binary content saved to disk → append a `[Binary content (… ) also
   *      saved to …]` note. @409509-409512
   * Returns `{ data: Output }`.
   */
  async call({ url, prompt }, context, canUseTool, parentMessage) {
    const start = Date.now()

    // (1) Upgrade scheme. @409387-409392
    let target = url
    try {
      const u = new URL(url)
      if (u.protocol === 'http:') u.protocol = 'https:'
      target = u.href
    } catch {
      // leave target as-is on parse failure
    }

    // (2) Artifact path — summarized; see helper notes above. @409393-409448
    // (3) fetchUrlAsMarkdown + response-type branching. @409450-409503
    const response = await fetchUrlAsMarkdown(target, context.abortController)

    // (3c) Cross-host redirect — surfaced to the model verbatim. @409482-409503
    if ('type' in response && response.type === 'redirect') {
      const statusText = httpStatusText(response.statusCode)
      const message = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${response.originalUrl}
Redirect URL: ${response.redirectUrl}
Status: ${response.statusCode} ${statusText}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${response.redirectUrl}"
- prompt: "${prompt}"`
      return {
        data: {
          bytes: Buffer.byteLength(message),
          code: response.statusCode,
          codeText: statusText,
          result: message,
          durationMs: Date.now() - start,
          url,
        } satisfies Output,
      }
    }

    // (4) Success path — markdown shortcut for preapproved+small, else summarize. @409504-409508
    const { content, bytes, code, codeText, contentType, persistedPath, persistedSize } =
      response as FetchedContent
    const preapproved = isPreapprovedUrl(url)

    let result: string
    if (preapproved && contentType.includes('text/markdown') && content.length < MAX_RAW_MARKDOWN_LENGTH) {
      result = content
    } else {
      result = await summarizeWithModel(
        prompt,
        content,
        context.abortController.signal,
        context.options.isNonInteractiveSession,
        preapproved,
        context.agentContext,
      )
    }

    // (5) Binary side-file note. @409509-409512
    if (persistedPath) {
      result += `

[Binary content (${contentType}, ${formatFileSize(persistedSize ?? bytes)}) also saved to ${persistedPath}]`
    }

    return {
      data: {
        bytes,
        code,
        codeText,
        result,
        durationMs: Date.now() - start,
        url,
      } satisfies Output,
    }
  },

  // @409515-409517 — pass the processed result straight through as the block content.
  mapToolResultToToolResultBlockParam({ result }, toolUseID) {
    return { tool_use_id: toolUseID, type: 'tool_result', content: result }
  },

  // renderToolUseMessage: _2a, renderToolUseProgressMessage: b2a,
  // renderToolResultMessage: S2a — UI helpers (out of scope here).
} as unknown as ToolDef<InputSchema, Output>)

// ── External-helper stubs (real bodies live elsewhere in the bundle) ─────────
declare function toolListIncludes(tools: unknown[], name: string): boolean
declare function formatFileSize(bytes: number): string // $a @...
declare function fetchUrlAsMarkdown(
  url: string,
  abortController: AbortController,
): Promise<FetchedContent | { type: string; [k: string]: any }> // njn @...
declare function summarizeWithModel(
  prompt: string,
  content: string,
  signal: AbortSignal,
  isNonInteractiveSession: boolean,
  isPreapproved: boolean,
  agentContext: unknown,
): Promise<string> // rjn @...
declare function httpStatusText(statusCode: number): string // ojn @...
type FetchedContent = {
  content: string
  bytes: number
  code: number
  codeText: string
  contentType: string
  persistedPath?: string
  persistedSize?: number
}
