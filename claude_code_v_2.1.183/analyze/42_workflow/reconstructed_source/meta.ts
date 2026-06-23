/**
 * Workflow `meta` AST parser + determinism static check — readable-source restoration
 * (Claude Code v2.1.183)
 *
 * Subsystem: the trust-boundary front-end of a Workflow script. Two independent pieces:
 *
 *   1. parseWorkflowMeta — parse the script with Acorn, require the FIRST statement to be
 *      `export const meta = <pure object literal>`, statically evaluate that literal into a
 *      real JS object (no `eval`, no side effects), validate the required `name`/`description`
 *      fields, ban prototype-pollution keys (`__proto__`/`constructor`/`prototype`), and split
 *      off the rest of the script as the executable body. `meta` is read *before* the script is
 *      ever allowed to run (permission dialog, `/workflows` list, telemetry, progress grouping),
 *      so it must be obtainable without executing untrusted code — hence the by-hand AST walk
 *      restricted to literal node types only.
 *
 *   2. isNonDeterministic — a static check that flags a script body as nondeterministic if it
 *      references `Date.now`, `Math.random`, or argless `new Date()`. As of the 2.1.172 fix this
 *      is an Acorn + acorn-walk AST walk (previously a raw regex that false-positived on those
 *      tokens appearing inside strings/comments). On any parse failure it returns `false`
 *      (fail-open: a script Acorn can't parse will be rejected later by parseWorkflowMeta, so the
 *      determinism check declines to guess). Determinism matters because resume replays cached
 *      `agent()` results keyed on `(prompt, opts)` — wall-clock/randomness would make a replay
 *      diverge from the original run.
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here (read directly, obf→readable re-derived):
 *     - isNonDeterministic     rWa   @416439-416465  (acorn-walk simple; catch→false)
 *     - parseWorkflowMeta      m0    @416466-416499  (size guard, parse, shape, eval, validate, split)
 *     - isMetaExport           U0p   @416500-416506  (first stmt = `export const meta = {…}`)
 *     - evalLiteralNode        oWa   @416507-416533  (pure-literal node evaluator)
 *     - evalObjectLiteral      sWa   @416534-416544  (ObjectExpression → null-proto object)
 *     - evalMetaKey            j0p   @416545-416552  (key extraction + reserved-key ban)
 *     - validateMetaFields     G0p   @416553-416562  (name/description required; title/whenToUse opt)
 *     - normalizePhases        W0p   @416563-416573  (phases[] → {title, detail?, model?}[])
 *     - RESERVED_META_KEYS     F0p   @416577         (Set __proto__/constructor/prototype)
 *     - WORKFLOW_SCRIPT_MAX_BYTES  A2  @152140       (= 524288)
 *     - getAcorn               xjn   @411725         (Acorn UMD module; provides `parse`)
 *     - getAcornWalk           ido   @415881         (acorn-walk UMD module; provides `.simple`)
 *   Cross-checked call site: parseWorkflowMeta is invoked by the `workflow()` runtime primitive
 *   `aWa` @416606/@416612 (`m0(script)` then "error" in result → throw).
 *
 * CONVENTION mirror — v2.1.88 named-TS tree (/lyz/codespace/3rd/claude-code/src)
 *   Workflow is gated-out there (`feature('WORKFLOW_SCRIPTS')`; e.g. tools.ts:129,
 *   constants/tools.ts:29), so only the *shape* is borrowed: ESM `.js` import specifiers on `.ts`
 *   (e.g. `import { WORKFLOW_TOOL_NAME } from '../tools/WorkflowTool/constants.js'`) and the
 *   `tools/WorkflowTool/` module-path layout (referenced via dynamic require; the dir's sources are
 *   not checked in). NOTE: acorn appears nowhere in the 2.1.88 src tree — the acorn named-import
 *   style is a local convention for this restoration, NOT something mirrored from 2.1.88. No
 *   implementation to copy.
 *
 * SCAFFOLD — v2.1.156 baseline analysis
 *   42_workflow/workflow_tool_definition.md §5 (`FZ` meta parser). Readable names inherited from
 *   there (parseWorkflowMeta, evalObjectLiteral, validateMetaFields, isMetaExport). NOTE: §5's
 *   companion §6 still documented the OLD inline regex determinism check — in 2.1.183 that is the
 *   AST-walk `rWa`, re-derived here from the 183 bundle (the 2.1.172 fix).
 *
 * ── Cross-validation note ────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle: (a) the determinism check is the AST walk `rWa` (not a
 * regex) with the exact non-computed-Identifier guards on MemberExpression and the
 * `callee.name === "Date" && arguments.length === 0` guard on NewExpression, and `catch { return
 * false }`; (b) parseWorkflowMeta reads `body[0]` only (meta MUST be first) and trims the body
 * via `/^[;\s]*\n/` + `trimStart()`; (c) the reserved-key Set is exactly
 * `["__proto__","constructor","prototype"]` (`F0p` @416577); (d) `evalObjectLiteral` builds a
 * null-prototype object via `Object.create(null)`; (e) `A2 = 524288` @152140; (f) Acorn parse
 * options are `{ ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: true,
 * allowReturnOutsideFunction: true }` identically in both `m0` and `rWa`.
 */

import { getAcorn } from '../utils/acorn.js'         // 2.1.183: getAcorn = xjn @411725
import { getAcornWalk } from '../utils/acornWalk.js'  // 2.1.183: getAcornWalk = ido @415881
import { WORKFLOW_SCRIPT_MAX_BYTES } from './constants.js' // A2 @152140 (= 524288) — single source of truth

// Acorn node types are intentionally loose here — the bundle parses with `ecmaVersion: "latest"`
// and walks `.type`-tagged ESTree nodes structurally. We model them as `any` to mirror the
// untyped walk in the original without inventing a node-type dependency.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AcornNode = any

// ─────────────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Hard size cap (bytes) on a workflow script. 524288 = 512 KiB. Shared with source.ts;
 * parseWorkflowMeta re-checks it up front so the named/`scriptPath` paths (whose script did not
 * pass the inline schema's `.max`) are still bounded.
 */
// WORKFLOW_SCRIPT_MAX_BYTES (A2 @152140 = 524288) is owned by ./constants.js and imported above;
// used by the size guard in parseWorkflowMeta below.

/**
 * Keys forbidden in a `meta` literal — the prototype-pollution surface. Setting any of these on
 * the evaluated object (even though it is null-prototype) is rejected outright.
 */
// 2.1.183: RESERVED_META_KEYS = F0p @416577
const RESERVED_META_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/** Acorn parse options shared verbatim by parseWorkflowMeta and isNonDeterministic. */
// 2.1.183: literal options object passed to both m0 (@416472) and rWa (@416445)
const WORKFLOW_PARSE_OPTIONS = {
  ecmaVersion: 'latest' as const,
  sourceType: 'module' as const,
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────────────

/** A single declared phase of a workflow (purely descriptive metadata). */
export interface WorkflowPhase {
  title: string
  detail?: string
  model?: string
}

/** The validated, statically-evaluated `meta` block of a workflow script. */
export interface WorkflowMeta {
  name: string
  description: string
  title?: string
  whenToUse?: string
  phases?: WorkflowPhase[]
}

/** Successful parse: the validated meta plus the executable script body (meta export stripped). */
export interface ParsedWorkflow {
  meta: WorkflowMeta
  scriptBody: string
}

/** Soft failure surfaced to the model as a tool error — never thrown out of parseWorkflowMeta. */
export interface WorkflowMetaError {
  error: string
}

export type ParseWorkflowMetaResult = ParsedWorkflow | WorkflowMetaError

// ─────────────────────────────────────────────────────────────────────────────────────
// isNonDeterministic — AST static check for Date.now / Math.random / new Date()
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Statically detect whether a script references nondeterministic primitives.
 *
 * Flags `true` if the AST contains:
 *   - a non-computed member access `Date.now` or `Math.random`
 *     (both `object` and `property` must be plain identifiers — `obj["now"]` and `x.Date.now`
 *      shapes that aren't `Identifier.Identifier` are deliberately NOT matched), or
 *   - an argless `new Date()` (`new Date(ts)` is fine — it's deterministic given its argument).
 *
 * On ANY parse error it returns `false` (fail-open). A script Acorn can't parse will be rejected
 * by parseWorkflowMeta anyway; the determinism gate declines to false-positive on unparseable
 * input. This AST walk replaced the pre-2.1.172 regex, which matched the tokens even inside
 * string literals and comments.
 *
 * 2.1.183: isNonDeterministic = rWa @416439-416465
 * 2.1.88 convention: gated-out; mirrors acorn + acorn-walk simple-walk usage.
 * 2.1.156 scaffold: §6 documented the OLD regex form; this is the AST rewrite (2.1.172 fix).
 */
// 2.1.183: rWa @416439
export function isNonDeterministic(source: string): boolean {
  const { parse } = getAcorn()       // @416440  let { parse: t } = xjn()
  const walk = getAcornWalk()        // @416441  n = ido()
  let nonDeterministic = false       // @416442  r = !1

  try {
    // @416444  parse as an ES module with top-level await/return permitted.
    const ast = parse(source, WORKFLOW_PARSE_OPTIONS)

    // @416450  acorn-walk simple walk — visits every node, no scope tracking needed.
    walk.simple(ast, {
      // @416451  Date.now / Math.random
      MemberExpression(node: AcornNode) {
        // @416452  Require `Identifier.Identifier` (not computed) — `Date["now"]`, dynamic
        //          property access, and nested member chains do not match.
        if (
          node.computed ||
          node.object.type !== 'Identifier' ||
          node.property.type !== 'Identifier'
        ) {
          return
        }
        const objectName = node.object.name    // @416453  i
        const propertyName = node.property.name // @416454  a
        // @416455
        if (
          (objectName === 'Date' && propertyName === 'now') ||
          (objectName === 'Math' && propertyName === 'random')
        ) {
          nonDeterministic = true
        }
      },
      // @416457  argless `new Date()`
      NewExpression(node: AcornNode) {
        // @416458  `new Date()` with zero args is wall-clock-dependent; `new Date(arg)` is fine.
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Date' &&
          node.arguments.length === 0
        ) {
          nonDeterministic = true
        }
      },
    })
  } catch {
    // @416461  Fail-open: unparseable input is not flagged here (parseWorkflowMeta rejects it).
    return false
  }

  // @416464
  return nonDeterministic
}

// ─────────────────────────────────────────────────────────────────────────────────────
// parseWorkflowMeta — parse, require `export const meta = {…}` first, eval + validate, split
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Parse a workflow script and extract its validated `meta` block plus the executable body.
 *
 * Steps:
 *   1. Size guard (`> WORKFLOW_SCRIPT_MAX_BYTES` → error).
 *   2. Acorn-parse as an ES module; a parse failure returns a message that explicitly blames
 *      TypeScript syntax (the single most common authoring mistake).
 *   3. The FIRST statement (`body[0]`) must be `export const meta = <ObjectExpression>`.
 *   4. Statically evaluate the object literal (no `eval`); only literal node types are allowed,
 *      and the reserved prototype-pollution keys are banned.
 *   5. Validate fields (`name`/`description` required non-empty strings; `title`/`whenToUse`
 *      optional; `phases` normalized).
 *   6. Split the body: everything after the meta export's end offset, leading `;`/whitespace
 *      stripped.
 *
 * All failures return `{ error }` — never thrown.
 *
 * 2.1.183: parseWorkflowMeta = m0 @416466-416499
 * 2.1.88 convention: gated-out; mirrors tools/WorkflowTool/ meta-parsing module.
 * 2.1.156 scaffold: §5 (`FZ`). Logic unchanged from 2.1.156; lines + obf names re-derived.
 */
// 2.1.183: m0 @416466
export function parseWorkflowMeta(source: string): ParseWorkflowMetaResult {
  // @416467  size guard (UTF-16 .length, matching the original — not byte length).
  if (source.length > WORKFLOW_SCRIPT_MAX_BYTES) {
    return { error: `Script exceeds ${WORKFLOW_SCRIPT_MAX_BYTES} bytes` }
  }

  let ast: AcornNode
  try {
    // @416470
    const { parse } = getAcorn()
    ast = parse(source, WORKFLOW_PARSE_OPTIONS)
  } catch (e) {
    // @416478  Parse failure → blame TypeScript syntax (verbatim message from the bundle).
    return {
      error:
        `Script parse error: ${e instanceof Error ? e.message : String(e)}. ` +
        'Workflow scripts must be plain JavaScript — TypeScript syntax (type annotations like ' +
        '`: string[]`, interfaces, generics) fails to parse.',
    }
  }

  // @416482  meta MUST be the first statement.
  const first = ast.body[0]
  if (!first || first.type !== 'ExportNamedDeclaration' || !isMetaExport(first)) {
    return {
      error:
        '`export const meta = { name, description, phases }` must be the FIRST statement in the script',
    }
  }

  // @416485  the ObjectExpression initializer of `const meta = …`.
  const initNode = first.declaration.declarations[0].init

  let metaRaw: Record<string, unknown>
  try {
    // @416488  static evaluation (throws on any non-literal / reserved-key construct).
    metaRaw = evalObjectLiteral(initNode)
  } catch (e) {
    // @416490
    return { error: `meta must be a pure literal: ${e instanceof Error ? e.message : String(e)}` }
  }

  // @416492  field validation (returns `{ error }` or `{ meta }`).
  const validated = validateMetaFields(metaRaw)
  if ('error' in validated) return validated

  // @416494  body = everything after the meta export, with a leading `;`/newline run trimmed.
  const scriptBody = source
    .slice(first.end)
    .replace(/^[;\s]*\n/, '')
    .trimStart()

  // @416498
  return { meta: validated.meta, scriptBody }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// isMetaExport — shape check: `export const meta = <ObjectExpression>`
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * True iff an `ExportNamedDeclaration` node is exactly `export const meta = <ObjectExpression>`
 * (a single `const` declarator named `meta` whose initializer is an object literal).
 *
 * 2.1.183: isMetaExport = U0p @416500-416506
 */
// 2.1.183: U0p @416500
function isMetaExport(node: AcornNode): boolean {
  const decl = node.declaration                                  // @416501
  if (!decl || decl.type !== 'VariableDeclaration') return false // @416502
  // @416503  must be `const` with exactly one declarator.
  if (decl.kind !== 'const' || decl.declarations.length !== 1) return false
  const declarator = decl.declarations[0]                        // @416504
  // @416505  declarator is `meta = <ObjectExpression>`.
  return (
    declarator.id.type === 'Identifier' &&
    declarator.id.name === 'meta' &&
    declarator.init?.type === 'ObjectExpression'
  )
}

// ─────────────────────────────────────────────────────────────────────────────────────
// evalLiteralNode / evalObjectLiteral — pure static evaluation of the meta literal
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Statically evaluate a single AST node into a real JS value, allowing ONLY literal node types.
 * Mutually recursive with evalObjectLiteral. Anything outside the whitelist throws.
 *
 * Allowed shapes:
 *   - Literal                 → its value
 *   - ArrayExpression         → mapped elements (NO sparse holes, NO spread)
 *   - ObjectExpression        → evalObjectLiteral (nested)
 *   - TemplateLiteral         → joined cooked quasis, but ONLY with zero interpolations
 *   - UnaryExpression         → ONLY `-<numericLiteral>` (negative numbers)
 *   - anything else           → throw `non-literal node type in meta: <type>`
 *
 * 2.1.183: evalLiteralNode = oWa @416507-416533
 */
// 2.1.183: oWa @416507
function evalLiteralNode(node: AcornNode): unknown {
  switch (node.type) {
    case 'Literal':
      // @416510
      return node.value

    case 'ArrayExpression':
      // @416511
      return node.elements.map((element: AcornNode) => {
        // @416513  sparse holes are `null` elements — disallowed.
        if (element === null) throw new Error('sparse arrays not allowed')
        // @416514  no `...spread` in a meta array.
        if (element.type === 'SpreadElement') throw new Error('spread not allowed in meta')
        return evalLiteralNode(element)
      })

    case 'ObjectExpression':
      // @416517
      return evalObjectLiteral(node)

    case 'TemplateLiteral': {
      // @416519
      // @416521  interpolations (`${…}`) are not statically evaluable here → reject.
      if (node.expressions.length > 0) {
        throw new Error('template interpolation not allowed in meta')
      }
      // @416522  concatenate the cooked text of every quasi (each defaults to "").
      return node.quasis.map((quasi: AcornNode) => quasi.value.cooked ?? '').join('')
    }

    case 'UnaryExpression': {
      // @416524
      // @416526  ONLY `-<number literal>` is allowed (so negative numbers parse).
      if (
        node.operator === '-' &&
        node.argument.type === 'Literal' &&
        typeof node.argument.value === 'number'
      ) {
        return -node.argument.value
      }
      // @416528
      throw new Error('only negative-number unary allowed in meta')
    }

    default:
      // @416531
      throw new Error(`non-literal node type in meta: ${node.type}`)
  }
}

/**
 * Statically evaluate an `ObjectExpression` into a null-prototype plain object.
 *
 * Rejects anything that isn't a plain `init` property: spread, computed keys, methods, and
 * getters/setters all throw. Keys are extracted (and prototype-pollution-checked) by evalMetaKey;
 * values recurse through evalLiteralNode.
 *
 * The result object is created with `Object.create(null)` so it has no inherited prototype —
 * combined with the reserved-key ban in evalMetaKey this closes the prototype-pollution surface.
 *
 * 2.1.183: evalObjectLiteral = sWa @416534-416544
 */
// 2.1.183: sWa @416534
function evalObjectLiteral(node: AcornNode): Record<string, unknown> {
  // @416535  null-prototype object — no inherited keys, no `__proto__` assignment magic.
  const result: Record<string, unknown> = Object.create(null)

  for (const property of node.properties) {
    // @416537  spread (`...x`) and any non-Property node are rejected.
    if (property.type !== 'Property') throw new Error('only plain properties allowed in meta')
    // @416539  computed keys (`[expr]: …`) are not statically resolvable → rejected.
    if (property.computed) throw new Error('computed keys not allowed in meta')
    // @416540  methods, getters and setters are not plain data → rejected.
    if (property.method || property.kind !== 'init') {
      throw new Error('methods/accessors not allowed in meta')
    }
    // @416541
    result[evalMetaKey(property)] = evalLiteralNode(property.value)
  }

  // @416543
  return result
}

// ─────────────────────────────────────────────────────────────────────────────────────
// evalMetaKey — extract a property key and ban prototype-pollution names
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Extract the string key of a meta property, supporting only `Identifier` and `Literal` keys, and
 * reject the reserved prototype-pollution names (`__proto__`, `constructor`, `prototype`).
 *
 * 2.1.183: evalMetaKey = j0p @416545-416552
 */
// 2.1.183: j0p @416545
function evalMetaKey(property: AcornNode): string {
  let key: string
  // @416547  `{ name: … }` — identifier key.
  if (property.key.type === 'Identifier') {
    key = property.key.name
  } else if (property.key.type === 'Literal') {
    // @416548  `{ "name": … }` — string/number literal key, coerced to string.
    key = String(property.key.value)
  } else {
    // @416549
    throw new Error(`unsupported key type in meta: ${property.key.type}`)
  }
  // @416550  prototype-pollution guard.
  if (RESERVED_META_KEYS.has(key)) {
    throw new Error(`reserved key name not allowed in meta: ${key}`)
  }
  return key
}

// ─────────────────────────────────────────────────────────────────────────────────────
// validateMetaFields — enforce required fields and normalize phases
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Validate the evaluated meta object's fields:
 *   - `name`        — required, non-empty string.
 *   - `description` — required, non-empty string.
 *   - `title`       — optional; kept only if a non-empty string, else `undefined`.
 *   - `whenToUse`   — optional; kept only if a string, else `undefined`.
 *   - `phases`      — optional; normalized via normalizePhases.
 *
 * Returns `{ error }` on a missing/invalid required field, else `{ meta }`.
 *
 * 2.1.183: validateMetaFields = G0p @416553-416562
 */
// 2.1.183: G0p @416553
function validateMetaFields(
  raw: Record<string, unknown>,
): { meta: WorkflowMeta } | WorkflowMetaError {
  // @416554
  const name = raw.name
  // @416555
  if (typeof name !== 'string' || name.length === 0) {
    return { error: 'meta.name must be a non-empty string' }
  }
  // @416556
  const description = raw.description
  // @416557
  if (typeof description !== 'string' || description.length === 0) {
    return { error: 'meta.description must be a non-empty string' }
  }
  // @416558  title: keep only a non-empty string, else undefined.
  const title =
    typeof raw.title === 'string' && raw.title.length > 0 ? raw.title : undefined
  // @416559  whenToUse: keep any string (empty allowed), else undefined.
  const whenToUse = typeof raw.whenToUse === 'string' ? raw.whenToUse : undefined
  // @416560
  const phases = normalizePhases(raw.phases)

  // @416561
  return { meta: { name, description, title, whenToUse, phases } }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// normalizePhases — coerce a `phases` value into a clean {title, detail?, model?}[]
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Normalize the optional `phases` field. Anything that isn't an array → `undefined`. Each element
 * is kept only if it is a non-null object with a string `title`; `detail`/`model` are kept only
 * if strings. An empty resulting array collapses to `undefined`.
 *
 * 2.1.183: normalizePhases = W0p @416563-416573
 */
// 2.1.183: W0p @416563
function normalizePhases(value: unknown): WorkflowPhase[] | undefined {
  // @416564  non-array → drop entirely.
  if (!Array.isArray(value)) return undefined

  const phases: WorkflowPhase[] = []
  for (const entry of value) {
    // @416567  keep only object entries that carry a `title`.
    if (entry && typeof entry === 'object' && 'title' in entry) {
      const { title, detail, model } = entry as Record<string, unknown>
      // @416569  `title` must be a string; detail/model are optional strings.
      if (typeof title === 'string') {
        phases.push({
          title,
          detail: typeof detail === 'string' ? detail : undefined,
          model: typeof model === 'string' ? model : undefined,
        })
      }
    }
  }

  // @416572  empty → undefined (no phases declared).
  return phases.length > 0 ? phases : undefined
}

// Mapping (this file):
//   rWa→isNonDeterministic, m0→parseWorkflowMeta, U0p→isMetaExport, oWa→evalLiteralNode,
//   sWa→evalObjectLiteral, j0p→evalMetaKey, G0p→validateMetaFields, W0p→normalizePhases,
//   F0p→RESERVED_META_KEYS, A2→WORKFLOW_SCRIPT_MAX_BYTES, xjn→getAcorn, ido→getAcornWalk;
//   e→source/node/raw/value, t→ast/result/parse, n→node/entry/walk, r→nonDeterministic,
//   s→node, i→objectName, a→propertyName, o→initNode, l→error-bound exception.
