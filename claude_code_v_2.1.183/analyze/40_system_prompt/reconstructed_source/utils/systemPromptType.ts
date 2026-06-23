// ============================================================================
// systemPromptType.ts — readable-source reconstruction (Claude Code v2.1.183)
// ----------------------------------------------------------------------------
// 2.1.183 regions covered:
//   - asSystemPrompt brand        = Wc  @cli_inner_pretty.js:360521-360523
//   - SystemPrompt brand (type)   — TS-level type, erased in the obf bundle
//   - identity selector / set      = l_n @cli_inner_pretty.js:149945-149952,
//                                    gNr/OAi/NAi @149953-149955, a_n @149958-149961
//
// 2.1.88 convention mirror : /lyz/codespace/3rd/claude-code/src/utils/systemPromptType.ts
// 2.1.156 scaffold doc     : .../claude_code_v_2.1.156/analyze/44_lean_prompt/README.md
// Anchor dossier (spec)    : ../_anchors_system_prompt.md  (§2, §10)
//
// Cross-validation: `Wc` is the identity-function brand exactly as the 2.1.88
//   `asSystemPrompt` is. The 2.1.183 bundle erases the TS `SystemPrompt` brand
//   (Wc just returns its argument), so the readable `__brand` type below is
//   reconstructed from the 2.1.88 convention; the runtime is `e => e`.
// ============================================================================

// ----------------------------------------------------------------------------
// The branded system-prompt type.
//
// This module is intentionally dependency-free so it can be imported from
// anywhere (the assembler, the merge layer, the API normalization path)
// without risking circular initialization. The brand is a pure TS device — at
// runtime a SystemPrompt is just a `readonly string[]`; the 2.1.183 bundle has
// no runtime trace of the brand because `asSystemPrompt` (Wc) is the identity.
// ----------------------------------------------------------------------------
export type SystemPrompt = readonly string[] & {
  readonly __brand: 'SystemPrompt'
}

// 2.1.183: asSystemPrompt = Wc @cli_inner_pretty.js:360521
// Identity-function brand: `function Wc(e) { return e; }`. Every system-prompt
// array that leaves the merge layer (`mergeSystemPrompt`/bW) or the override
// path is wrapped through this so the type checker tracks "this string[] has
// been blessed as a system prompt" without any runtime cost.
export function asSystemPrompt(value: readonly string[]): SystemPrompt {
  // @360522: `return e;` — the brand is purely a compile-time tag.
  return value as SystemPrompt
}

// ----------------------------------------------------------------------------
// Identity strings + selector.
//
// These are the very first line of the assembled prompt in the live API path
// (prepended in the API-normalization path alongside the billing header). The
// selector chooses between the interactive CLI line and the two SDK-agent
// lines based on invocation mode.
// ----------------------------------------------------------------------------

// 2.1.183: BASE_IDENTITY (interactive CLI) = gNr @cli_inner_pretty.js:149953
export const BASE_IDENTITY =
  // @149953 (verbatim)
  "You are Claude Code, Anthropic's official CLI for Claude."

// 2.1.183: SDK_CLI_IDENTITY (SDK + appendSystemPrompt) = OAi @cli_inner_pretty.js:149954
export const SDK_CLI_IDENTITY =
  // @149954 (verbatim)
  "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."

// 2.1.183: SDK_AGENT_IDENTITY (bare SDK agent) = NAi @cli_inner_pretty.js:149955
export const SDK_AGENT_IDENTITY =
  // @149955 (verbatim)
  "You are a Claude agent, built on Anthropic's Claude Agent SDK."

// 2.1.183: IDENTITY_STRINGS set = a_n (over FJu = [gNr, OAi, NAi]) @cli_inner_pretty.js:149958-149961
// Used by the cache-scope splitter (`a0o`, see systemPrompt.ts §7) to org-cache
// the identity prefix: any prompt entry that `a_n.has(entry)` gets
// `cacheScope: "org"` (shared cross-session), since the identity line is
// constant for every session of an org.
export const IDENTITY_STRINGS: ReadonlySet<string> = new Set([
  BASE_IDENTITY,
  SDK_CLI_IDENTITY,
  SDK_AGENT_IDENTITY,
])

export interface IdentityContext {
  isNonInteractive?: boolean
  hasAppendSystemPrompt?: boolean
}

// 2.1.183: getIdentityString (identity selector) = l_n @cli_inner_pretty.js:149945-149952
//
// Selection logic (faithful):
//   1. Vertex provider always uses the plain base identity (@149946). Vertex
//      hosting historically pins the bare CLI line regardless of mode.
//   2. Non-interactive (SDK / headless) invocations (@149947):
//        - with an appended system prompt  → SDK_CLI_IDENTITY (@149948)
//        - otherwise (bare SDK agent)       → SDK_AGENT_IDENTITY (@149949)
//   3. Everything else (interactive CLI)   → BASE_IDENTITY (@149951)
//
// The interactive/SDK *agent* line "You are an interactive agent that helps
// users with software engineering tasks." is NOT one of these consts; it is
// emitted inline by the intro builders w_f/y_f (see systemPrompt.ts §4/§6).
export function getIdentityString(ctx?: IdentityContext): string {
  // @149946: provider() === "vertex" pins the base line.
  if (provider() === 'vertex') return BASE_IDENTITY
  // @149947: SDK / non-interactive branch.
  if (ctx?.isNonInteractive) {
    if (ctx.hasAppendSystemPrompt) return SDK_CLI_IDENTITY // @149948
    return SDK_AGENT_IDENTITY // @149949
  }
  return BASE_IDENTITY // @149951
}

// helper: provider() = Ir @cli_inner_pretty.js — returns the host provider
// class ("vertex" | "firstParty" | "anthropicAws" | "bedrock" | ...). Imported
// here only to keep the selector self-contained.
declare function provider():
  | 'vertex'
  | 'firstParty'
  | 'anthropicAws'
  | 'bedrock'
  | 'foundry'
  | 'mantle'
  | string
