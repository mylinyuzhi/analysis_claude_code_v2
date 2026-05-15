# WebFetch — Fetch URL, Convert to Markdown, Apply Model Prompt

> **Tool name:** `WebFetch` (user-facing: `Fetch`)
> **Source:** `cli_inner_pretty.js:377334-377475` (`eI` declaration)
> **Search hint:** *fetch and extract content from a URL*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`WebFetch` performs a **3-stage pipeline**:
1. **Fetch** — GET the URL via the network proxy (egress checks + domain allowlist).
2. **Convert** — for HTML, strip noise tags (style/script/iframe) and run through Turndown for HTML→markdown.
3. **Apply prompt** — feed the markdown + a user-supplied `prompt` to a small fast model and return its answer.

The tool is the model's primary surface for **summarizing web content under a question** without dumping the raw page into the conversation transcript.

---

## Schema

```javascript
// ============================================
// webFetchInputSchema - Ys_ url + prompt
// Location: cli_inner_pretty.js:377318-377323
// ============================================

// ORIGINAL (for source lookup):
Ys_ = yH(() =>
  y.strictObject({
    url: y.string().url().describe("The URL to fetch content from"),
    prompt: y.string().describe("The prompt to run on the fetched content"),
  }),
);

// READABLE (for understanding):
const webFetchInputSchema = lazySchema(() =>
  z.strictObject({
    url: z.string().url(),
    prompt: z.string(),
  }),
);

// Mapping: Ys_→webFetchInputSchema
```

---

## Key Behavior

### v2.1.117 HTML truncation BEFORE turndown

```javascript
// ============================================
// getURLMarkdownContent - HTML truncation before turndown (v2.1.117)
// Location: cli_inner_pretty.js:377170-377176
// ============================================

// ORIGINAL (for source lookup):
if (Y.includes("text/html")) {
  if (((D = (await ta_()).turndown(w.slice(0, qd7))), w.length > qd7))
    D += `\n\n[Content truncated due to length...]`;
  j = Buffer.byteLength(D);
} else ((D = w), (j = M));

// READABLE (for understanding):
if (contentType.includes("text/html")) {
  // qd7 = 1048576 (1 MB) — truncate HTML BEFORE running turndown.
  // Turndown is O(n) on input length but with bad constants;
  // a 5 MB HTML page that fits in memory still hangs turndown for tens of seconds.
  // Truncation gives a predictable upper bound on conversion time.
  markdown = (await initTurndown()).turndown(rawHtml.slice(0, WEB_FETCH_HTML_TRUNCATE_LIMIT));
  if (rawHtml.length > WEB_FETCH_HTML_TRUNCATE_LIMIT) {
    markdown += "\n\n[Content truncated due to length...]";
  }
  bytesProcessed = Buffer.byteLength(markdown);
} else {
  // Non-HTML: pass through verbatim.
  markdown = rawText;
  bytesProcessed = totalBytes;
}

// Mapping: ta_→initTurndown, w→rawHtml, qd7→WEB_FETCH_HTML_TRUNCATE_LIMIT, D→markdown
```

### v2.1.105 style/script stripping

```javascript
// ============================================
// initTurndown - cached lazy turndown with noise-tag removal
// Location: cli_inner_pretty.js:377029-377036
// ============================================

// ORIGINAL (for source lookup):
function ta_() {
  return (sa_ ??= Promise.resolve()
    .then(() => (Hd7(), eQ7))
    .then((H) => {
      let q = new H.default();
      return (q.remove(["style", "script", "noscript", "iframe"]), q);
    }));
}

// READABLE (for understanding):
let turndownPromise = undefined;

function initTurndown() {
  return (turndownPromise ??= Promise.resolve()
    .then(() => (importTurndownModule(), turndownModule))
    .then((mod) => {
      const td = new mod.default();
      // v2.1.105 fix: strip noise tags BEFORE markdown conversion.
      // Without this, large <style> blocks bloat the markdown with CSS
      // garbage and <script> blocks dump executable JS into the prompt.
      td.remove(["style", "script", "noscript", "iframe"]);
      return td;
    }));
}

// Mapping: ta_→initTurndown, sa_→turndownPromise, eQ7→turndownModule, Hd7→importTurndownModule
```

The cache (`sa_ ??= ...`) means the turndown instance is created once per process — repeated WebFetch calls share the same converter.

### Apply-prompt secondary fetch (`TN6`)

```javascript
async function TN6(H, $, q, K, _) {
  // H = prompt, $ = markdown content, q = signal, K = isNonInteractiveSession, _ = isMarkdownPreserveHost
  let A = $.length > oX$
    ? $.slice(0, oX$) + `\n\n[Content truncated due to length...]`
    : $;
  // oX$ = 1e5 (100 KB) — secondary truncation cap on markdown size sent to model.
  // ...build small-fast-model query with system + user prompts...
  let Y = await dE({ systemPrompt: r4([]), userPrompt: z, signal: q, options: { ... } });
  // ...extract text response...
}
```

The 100 KB cap (`oX$ = 1e5`) is the markdown-after-conversion limit. A page that produced 500 KB of markdown still only sends the first 100 KB to the model, with a truncation marker.

### Cache layer (15-min TTL)

```javascript
ra_ = 900000;       // 15 min cache TTL
oa_ = 52428800;     // 50 MB total cache size
LN6 = new zR({ maxSize: oa_, ttl: ra_ });
```

Repeated WebFetch to the same URL within 15 min returns from cache. The cache is size-bounded (50 MB total) and per-entry weighted by `j = Buffer.byteLength(markdown)`.

### Cross-host redirects are returned, not followed

```javascript
if (("type" in A) && A.type === "redirect") {
  // Build "REDIRECT DETECTED" message including originalUrl, redirectUrl, status
  // — the model must explicitly call WebFetch again with the new URL.
}
```

This prevents an attacker from redirecting `WebFetch(github.com)` → `WebFetch(evil.com)` silently. The model must explicitly retry with the new host (and the user sees the redirect in chat).

### Domain check + egress proxy

`Ad7(hostname)` calls Anthropic's `/api/web/domain_info` endpoint to verify the host is safe to fetch. Three outcomes:
- `allowed` — proceed.
- `blocked` — throw `DomainBlockedError` (`JN6`).
- `check_failed` — throw `DomainCheckFailedError` (`XN6`), usually network/policy issue.

If the egress proxy returns HTTP 403 with `x-proxy-error: blocked-by-allowlist`, throw `EgressBlockedError` (`Kd7`).

`Oq().skipWebFetchPreflight` lets enterprise environments with restrictive security policies skip the domain check.

---

## Key Insights

**Three layers of truncation, each at a different stage:**
1. **`Hs_ = 10485760` (10 MB)** — raw response size cap on the HTTP fetch (`maxContentLength`).
2. **`qd7 = 1048576` (1 MB)** — HTML truncation before turndown. (v2.1.117 fix.)
3. **`oX$ = 1e5` (100 KB)** — markdown truncation before model.

Each layer protects a different cost: bytes-over-network, conversion time, model tokens.

**Why a small-fast model for the apply-prompt step?** The user's prompt is usually "summarize this page" or "find the API URL on this page" — questions answerable from text, not requiring deep reasoning. Using Claude Haiku/Sonnet for the apply-prompt step keeps both latency and cost in check.

**Why cache by URL not by URL+prompt?** Different prompts on the same URL want the same markdown; only the apply-prompt result differs. The cache stores the *fetched + converted* markdown so re-asking new questions about the same page is fast.

**Cross-host redirects are returned-not-followed for security.** A malicious site can redirect to `localhost:8080` or to internal-network addresses if the redirect is followed silently. Forcing the model (and user) to opt into the new host with an explicit second call prevents SSRF through redirect chains.

**Preapproved hosts (`ff8`) skip the model step.** For Markdown-preserving hosts (curated allowlist where the content is already known to be markdown), the tool can return the content verbatim if it's under `oX$`. This saves a model call for fetching e.g. CHANGELOG.md from a known docs site.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.117:** Fixed WebFetch hanging on very large HTML pages by truncating input before HTML-to-markdown conversion (`qd7 = 1048576` introduced here).
- **v2.1.105:** Turndown removes `["style", "script", "noscript", "iframe"]` before conversion (the `q.remove([...])` line at 377034).
- **v2.1.126:** Fixed deferred tools (WebFetch, WebSearch, etc.) not being available to skills with `context: fork` and other subagents on their first turn.
- **v2.1.121:** Domain check timeout, cache size/TTL adjustments stable since.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Web*

Key functions in this document:
- `WebFetchTool` (`eI`) — declaration with `shouldDefer: true`
- `getURLMarkdownContent` (`GN6`) — HTML truncation + turndown
- `applyPromptToMarkdown` (`TN6`) — small-fast model apply-prompt
- `fetchURL` (`ZN6`) — HTTP layer with redirect detection
- `initTurndown` (`ta_`) — lazy cached turndown with noise-tag removal
- `WEB_FETCH_HTML_TRUNCATE_LIMIT` (`qd7`) — `1048576` (1 MB)
- `WEB_FETCH_MARKDOWN_TRUNCATE_LIMIT` (`oX$`) — `100000` (100 KB)
- `WEB_FETCH_CACHE_TTL_MS` (`ra_`) — `900000` (15 min)
- `WEB_FETCH_CACHE_MAX_SIZE` (`oa_`) — `52428800` (50 MB)
- `DomainBlockedError` (`JN6`), `DomainCheckFailedError` (`XN6`), `EgressBlockedError` (`Kd7`)
- `isMarkdownPreserveURL` (`WN6`) — preapproved markdown-passthrough host check
- `checkDomainAllowed` (`Ad7`) — Anthropic domain-info preflight
