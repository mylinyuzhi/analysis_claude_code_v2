# Frontmatter rewrite safety: the inline-`#` truncation fix and the `modified:` stamp (`.214`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`, tagged `(193)`.

Two `.214` bullets:

> *"Fixed memory frontmatter values being silently truncated at an inline `#` when memory files are saved"*
> *"Added an ISO `modified` timestamp to memory file frontmatter"*

They are one change. Adding `modified:` means the CLI must now rewrite frontmatter on **every** save
instead of once, which turned a latent lossy round-trip into a bug that would fire constantly. The fix
is not a one-line regex tweak: 2.1.220 adds a **rewrite-safety layer** that (a) proves when a plain YAML
parse is lossless, (b) repairs the common lossy case, (c) refuses to do a structured rewrite at all when
it cannot prove safety, and (d) provides a byte-verified surgical splice as the fallback path.

**Delta proof, all measured in both bundles:**

| Literal | 220 | 193 |
|---|---|---|
| `quoteLossyValues` | 5 | **0** |
| `rewriteHazard` | 6 | **0** |
| `unprovableKeys` | 3 | **0** |
| `stampNewMemoryContent` | 2 | **0** |
| `an inline '#' in` | 1 | **0** |
| `originSessionId` | 3 | 3 &nbsp;*(carryover — see §4)* |
| `Failed to parse YAML frontmatter` | 1 | 1 &nbsp;*(carryover)* |

---

## 1. The machine before the fix

`Lp` (`:158070`) is the frontmatter parser used by *everything* with YAML frontmatter — skills, agents,
commands, plugins, `CLAUDE.md`, and memory files. `DY` (`:160649`) is the memory-specific wrapper that
runs `Lp` and then normalises the result into `{ name, description, metadata }` via `pLg` (`:160687`).

In 2.1.193 the parser was 22 lines:

```javascript
// ============================================
// parseFrontmatter (2.1.193 baseline) - the whole parser before the rewrite-safety layer
// Location: cli_inner_pretty.js:149511-149531 (193)
// ============================================

// ORIGINAL (for source lookup):
function Gm(e, t, n) {
  let r = e.match(eye);
  if (!r) return { frontmatter: {}, content: e };
  let o = r[1] || "", s = e.slice(r[0].length), i = (c) => c, a = {}, l;
  try { a = i(Xxi(Zhe(o))); }
  catch {
    try { let c = XEd(o).replace(/^\t+/gm, (u) => "  ".repeat(u.length)); a = i(Xxi(Zhe(c))); }
    catch (c) { l = c instanceof Error ? c.message : String(c);
      let u = t ? ` in ${t}` : "";
      T(`Failed to parse YAML frontmatter${u}: ${l}`, { level: "warn" }); }
  }
  return { frontmatter: a, content: s, ...(l !== void 0 && { parseError: l }) };
}

// READABLE (for understanding):
function parseFrontmatter(text, sourcePath, _opts) {
  let m = text.match(FRONTMATTER_RE);                       // /^---\s*\n([\s\S]*?)---\s*\n?/
  if (!m) return { frontmatter: {}, content: text };
  let block = m[1] || "", body = text.slice(m[0].length), identity = (x) => x, out = {}, parseError;
  try { out = identity(asPlainObject(yamlParse(block))); }
  catch {
    try {                                                    // salvage pass: quote suspicious scalars
      let repaired = quoteSuspiciousScalars(block).replace(/^\t+/gm, (t) => "  ".repeat(t.length));
      out = identity(asPlainObject(yamlParse(repaired)));
    } catch (err) { parseError = err instanceof Error ? err.message : String(err);
      warn(`Failed to parse YAML frontmatter${sourcePath ? ` in ${sourcePath}` : ""}: ${parseError}`); }
  }
  return { frontmatter: out, content: body, ...(parseError !== void 0 && { parseError }) };
}

// Mapping: Gm→parseFrontmatter, eye→FRONTMATTER_RE, Zhe→yamlParse (Bun.YAML.parse),
//          Xxi→asPlainObject, XEd→quoteSuspiciousScalars, T→warn
```

Note the salvage pass `XEd` / `OIg` — it exists in **both** bundles (`:157984` in 220) and quotes any
value matching `MIg = /[{}[\]*&#!|>%@`]|: /` (`:158236`). Two things about it matter:

1. It only runs **after `Bun.YAML.parse` has thrown.** A frontmatter with an inline `#` parses
   *successfully* — YAML is happy to treat ` #…` as a comment — so the salvage pass never fires for
   this bug. The `#` in `MIg`'s character class is a red herring; it protects against a `#` at the
   *start* of a value, which is a parse-level ambiguity, not a truncation.
2. Its key regex `/^([a-zA-Z_-]+):\s+(.+)$/` is anchored at column 0, so it never sees nested keys.

---

## 2. The bug: a lossy YAML round-trip

**What it does (wrongly):** a memory file's frontmatter is parsed to a JS object, the object is mutated,
and the object is re-serialised over the file. Any information the *parse* discards is gone from the
*serialise*.

**How it goes wrong, step by step:**

1. The user (or the model) writes a memory with a `#` inside an unquoted scalar. This is extremely
   natural in this domain — memory descriptions routinely mention `#tags`, issue numbers (`fixes #412`),
   shell comments, or markdown headings.
2. `Bun.YAML.parse` applies the YAML 1.2 plain-scalar rule: an unquoted scalar ends at the first
   ` #` (space-hash) sequence, and everything after it is a comment.
3. `pLg` builds `{ name, description, metadata }` from that truncated object.
4. `$nu` (`:160653`) re-serialises with `ntr` = `Bun.YAML.stringify` (`:157977`) and writes
   `---\n${…}---\n\n${body}`.
5. The tail is gone from disk. Nothing warns. The next read sees the truncated value as ground truth.

**Why it went unnoticed until `.214`:** in 2.1.193 the rewrite fired **at most once per file**. The
stamper `mMn` (`:242607-242612 (193)`) returned the content unchanged the moment `originSessionId` was
already present. So a memory written by an older build, or written twice, was never rewritten again.
`.214`'s `modified:` timestamp removes that early exit — from `.214` on, *every* save rewrites — which
is exactly why the two bullets ship together.

### 2.1 Reproducing it

The mechanism was verified against the same engine the bundle uses (`Bun.YAML`, Bun 1.4.0 in the
2.1.220 build; reproduced on Bun 1.3.14), with `$Ig` and `EJi` transcribed verbatim from `:158018-158068`:

```
input frontmatter:
  name: shell-conventions
  description: run tests with bun test # not shorthand for anything
  tags: [a, b] # seq with hash
  metadata:
    type: project # nested inline hash

Bun.YAML.parse  (what 2.1.193 rewrote from):
  { name: "shell-conventions",
    description: "run tests with bun test",        <-- 30 characters silently dropped
    tags: ["a","b"],
    metadata: { type: "project" } }

$Ig  ->  quotedKeys: ["description"]   unprovableKeys: ["tags"]
re-parse of $Ig's rewritten text:
  { description: "run tests with bun test # not shorthand for anything",  <-- preserved
    ... }
```

---

## 3. The fix: three tiers of rewrite safety

`Lp` gains an opt-in mode. `r?.quoteLossyValues` is passed **only** by the memory stamper
(`:238655`), so no other frontmatter consumer pays for it — skills, agents and commands keep the exact
2.1.193 code path.

```javascript
// ============================================
// parseFrontmatter - 2.1.220, with the quoteLossyValues rewrite-safety mode
// Location: cli_inner_pretty.js:158070-158126
// ============================================

// ORIGINAL (for source lookup):
function Lp(e, t, r) {
  let n = e.match(wZ);
  if (!n) return { frontmatter: {}, content: e };
  let o = n[1] || "", i = e.slice(n[0].length), s = (f) => f, a = {}, l, c;
  if (r?.quoteLossyValues) {
    let f = e.match(pRt), m = f?.[1] ?? "";
    if (o.trim() !== "" || m.trim() !== "") {
      if (f === null || m.trim() !== o.trim())
        c = 'the closing --- is ambiguous (a value containing "---"?) — part of the block may have read as body';
    }
  }
  let u, d;
  if (r?.quoteLossyValues) {
    let f = $Ig(o);
    if (f.unprovableKeys.length > 0)
      u = `an inline '#' in [${f.unprovableKeys.join(", ")}] cannot be preserved by a rewrite`;
    if (f.text !== null)
      try {
        let m = s(vJi(gV(f.text))), g = c ?? u ?? yru(o, m);
        return { frontmatter: m, content: i, ...(g !== void 0 && { rewriteHazard: g }) };
      } catch {
        d = `quoting [${f.quotedKeys.join(", ")}] broke the document; a rewrite from the plain parse would drop their inline '#' content`;
        let m = t ? ` in ${t}` : "";
        w(`quoteLossyValues: ${d}${m}`, { level: "warn" });
      }
  }
  try { a = s(vJi(gV(o))); }
  catch { try { let f = OIg(o).replace(/^\t+/gm, (m) => "  ".repeat(m.length)); a = s(vJi(gV(f))); }
    catch (f) { l = f instanceof Error ? f.message : String(f);
      let m = t ? ` in ${t}` : "";
      w(`Failed to parse YAML frontmatter${m}: ${l}`, { level: "warn" }); } }
  let p = !r?.quoteLossyValues ? void 0
    : l !== void 0 ? (c ?? `the frontmatter failed to parse: ${l}`)
      : (c ?? u ?? d ?? yru(o, a));
  return { frontmatter: a, content: i, ...(l !== void 0 && { parseError: l }), ...(p !== void 0 && { rewriteHazard: p }) };
}

// READABLE (for understanding):
function parseFrontmatter(text, sourcePath, opts) {
  let m = text.match(FRONTMATTER_RE);                                  // lenient fence
  if (!m) return { frontmatter: {}, content: text };
  let block = m[1] || "", body = text.slice(m[0].length),
    identity = (x) => x, out = {}, parseError, fenceHazard;

  if (opts?.quoteLossyValues) {                                        // TIER 0 — fence agreement
    let strict = text.match(STRICT_FRONTMATTER_RE), strictBlock = strict?.[1] ?? "";
    if (block.trim() !== "" || strictBlock.trim() !== "")
      if (strict === null || strictBlock.trim() !== block.trim())
        fenceHazard = 'the closing --- is ambiguous (a value containing "---"?) — part of the block may have read as body';
  }

  let inlineHashHazard, quotingBrokeItHazard;
  if (opts?.quoteLossyValues) {                                        // TIER 1 — prove / repair
    let pass = requoteLossyScalars(block);
    if (pass.unprovableKeys.length > 0)
      inlineHashHazard = `an inline '#' in [${pass.unprovableKeys.join(", ")}] cannot be preserved by a rewrite`;
    if (pass.text !== null)
      try {
        let repaired = identity(asPlainObject(yamlParse(pass.text)));
        let hazard = fenceHazard ?? inlineHashHazard ?? emptyKeysHazard(block, repaired);
        return { frontmatter: repaired, content: body, ...(hazard !== undefined && { rewriteHazard: hazard }) };
      } catch {                                                        // requoting produced invalid YAML
        quotingBrokeItHazard = `quoting [${pass.quotedKeys.join(", ")}] broke the document; a rewrite from the plain parse would drop their inline '#' content`;
        warn(`quoteLossyValues: ${quotingBrokeItHazard}${sourcePath ? ` in ${sourcePath}` : ""}`);
      }
  }

  try { out = identity(asPlainObject(yamlParse(block))); }             // TIER 2 — the 2.1.193 path, verbatim
  catch { try { out = identity(asPlainObject(yamlParse(
            quoteSuspiciousScalars(block).replace(/^\t+/gm, (t) => "  ".repeat(t.length))))); }
    catch (err) { parseError = err instanceof Error ? err.message : String(err);
      warn(`Failed to parse YAML frontmatter${sourcePath ? ` in ${sourcePath}` : ""}: ${parseError}`); } }

  let hazard = !opts?.quoteLossyValues ? undefined
    : parseError !== undefined ? (fenceHazard ?? `the frontmatter failed to parse: ${parseError}`)
      : (fenceHazard ?? inlineHashHazard ?? quotingBrokeItHazard ?? emptyKeysHazard(block, out));
  return { frontmatter: out, content: body,
           ...(parseError !== undefined && { parseError }),
           ...(hazard !== undefined && { rewriteHazard: hazard }) };
}

// Mapping: Lp→parseFrontmatter, wZ→FRONTMATTER_RE, pRt→STRICT_FRONTMATTER_RE, $Ig→requoteLossyScalars,
//          gV→yamlParse, vJi→asPlainObject, yru→emptyKeysHazard, OIg→quoteSuspiciousScalars, w→warn
```

### 3.1 Tier 0 — the two-fence disagreement check

**What it does:** parses the same text with a *lenient* and a *strict* fence regex and compares.

```
wZ  = /^---\s*\n([\s\S]*?)---\s*\n?/                     :158237   (lenient — used since 193)
pRt = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/ :158237   (strict — 220-only, also used by the splicer)
```

**How it works:** `wZ` accepts a closing `---` anywhere, including one embedded inside a value. `pRt`
requires the closing fence to occupy a whole line, and tolerates CRLF. If the two disagree about where
the frontmatter block ends — `f === null || m.trim() !== o.trim()` (`:158083`) — then part of what one
parser calls "frontmatter" the other calls "body", and any rewrite would move that text across the
fence. That yields hazard *"the closing `---` is ambiguous (a value containing `---`?)"*.

**Why this is checked first:** it is the only hazard that can corrupt the **body**, not just a value.
The tier ordering `c ?? u ?? d ?? yru(...)` (`:158095`, `:158119`) is a strict severity ranking:
fence ambiguity ▸ inline `#` ▸ requoting broke it ▸ no keys at all.

### 3.2 Tier 1 — `requoteLossyScalars`: prove losslessness per line

**What it does:** walks the frontmatter line by line and, for each top-level `key: value` line with an
unquoted value, asks YAML itself whether the parse is lossless. If not, it rewrites that one line as a
double-quoted scalar.

```javascript
// ============================================
// requoteLossyScalars - per-line losslessness prover + repairer
// Location: cli_inner_pretty.js:158018-158058
// ============================================

// ORIGINAL (for source lookup):
function $Ig(e) {
  let t = [], r = [],
    n = e.split(`\n`).map((o) => {
        let i = o.endsWith("\r"), s = i ? o.slice(0, -1) : o,
          a = s.match(/^([A-Za-z0-9_][A-Za-z0-9_.-]*):[ \t]+(.*)$/);
        if (!a) return (EJi(s, r), o);
        let [, l, c] = a;
        if (!l || !c) return o;
        let u = c.trimEnd();
        if (u === "") return o;
        if (/^["'|>]/.test(u)) return (EJi(s, r), o);
        let d;
        try { d = gV(u); } catch { return o; }
        if (typeof d !== "string" && d !== null) return (EJi(s, r), o);
        if (!((typeof d === "string" && d !== u) || (d === null && !["null", "Null", "NULL", "~"].includes(u)))) return o;
        t.push(l);
        let f = u.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
        return `${l}: "${f}"${i ? "\r" : ""}`;
      });
  return { text: t.length === 0 ? null : n.join(`\n`), quotedKeys: t, unprovableKeys: r };
}

// READABLE (for understanding):
function requoteLossyScalars(block) {
  let quotedKeys = [], unprovableKeys = [],
    lines = block.split("\n").map((rawLine) => {
      let hadCR = rawLine.endsWith("\r"), line = hadCR ? rawLine.slice(0, -1) : rawLine,
        kv = line.match(/^([A-Za-z0-9_][A-Za-z0-9_.-]*):[ \t]+(.*)$/);   // TOP-LEVEL keys only
      if (!kv) return (recordUnprovableInlineHash(line, unprovableKeys), rawLine);
      let [, key, rawValue] = kv;
      if (!key || !rawValue) return rawLine;
      let value = rawValue.trimEnd();
      if (value === "") return rawLine;
      if (/^["'|>]/.test(value))                                         // already quoted / block scalar
        return (recordUnprovableInlineHash(line, unprovableKeys), rawLine);
      let parsed;
      try { parsed = yamlParse(value); } catch { return rawLine; }       // value alone is not valid YAML
      if (typeof parsed !== "string" && parsed !== null)                 // number / bool / seq / map
        return (recordUnprovableInlineHash(line, unprovableKeys), rawLine);
      let lossy = (typeof parsed === "string" && parsed !== value)
               || (parsed === null && !["null", "Null", "NULL", "~"].includes(value));
      if (!lossy) return rawLine;                                        // PROVED lossless — leave verbatim
      quotedKeys.push(key);
      let escaped = value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
      return `${key}: "${escaped}"${hadCR ? "\r" : ""}`;
    });
  return { text: quotedKeys.length === 0 ? null : lines.join("\n"), quotedKeys, unprovableKeys };
}

// Mapping: $Ig→requoteLossyScalars, EJi→recordUnprovableInlineHash, gV→yamlParse,
//          t→quotedKeys, r→unprovableKeys, u→value, d→parsed
```

**The losslessness test is the clever part.** It does not pattern-match for `#`. It parses the raw
scalar text *on its own* and compares the result to the raw text:

- `parsed !== value` ⟹ YAML changed the bytes. That covers inline `#` comments **and** every other
  plain-scalar transformation (trailing-space folding, `\` handling, multi-space collapse) without
  enumerating them.
- `parsed === null` while the raw text is not one of the four YAML null tokens ⟹ the value vanished
  entirely — e.g. a value that is *only* a comment.

Everything else — a value YAML returns unchanged, a value that fails to parse standalone, an already
quoted value — is left byte-for-byte alone. `text` is `null` when nothing was rewritten, which lets
`Lp` skip the re-parse entirely on the overwhelmingly common clean path.

**Why re-parse rather than patch the object?** Because the escaping must be validated. `$Ig` produces
new YAML text and `Lp` feeds it straight back through `gV` (`:158094`). If the requoted document does
not parse — the escaping was wrong, or the value contained something the naive `\\`/`\"` escape cannot
express — the `catch` at `:158097` records the `quotingBrokeItHazard` and falls through to the plain
2.1.193 parse. **The repair can never make things worse than the old behaviour**; the worst case is the
old behaviour plus a hazard flag. That is a deliberate fail-soft design, and it is why the tier-2 block
is a byte-for-byte copy of the 193 code rather than a refactor.

### 3.3 Tier 1b — `recordUnprovableInlineHash`: the honest "I cannot fix this" path

Some lines are unrepairable by requoting: flow sequences (`tags: [a, b] # note`), flow maps, numbers,
booleans, block scalars (`|`/`>`), and already-quoted values with a trailing comment. Re-quoting a
sequence would change its *type*, which is worse than losing a comment. For those, `EJi` (`:158059`)
determines only whether an inline `#` is present, and if so names the key:

```javascript
// ============================================
// recordUnprovableInlineHash - flags a key whose inline '#' cannot be preserved by requoting
// Location: cli_inner_pretty.js:158059-158069
// ============================================

// ORIGINAL (for source lookup):
function EJi(e, t) {
  let r = e.match(/^("(?:[^"\\]|\\.)*"):[ \t]+(.*)$/) ??
          e.match(/^('(?:[^']|'')*'):[ \t]+(.*)$/) ??
          e.match(/^([^\s#][^:\n]*?):[ \t]+(.*)$/);
  if (r === null) return;
  let [, n, o] = r;
  if (!n || !o) return;
  let i = o.trimEnd().replace(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'/g, "");
  if (/^#|[ \t]#/.test(i)) t.push(n);
}

// READABLE (for understanding):
function recordUnprovableInlineHash(line, unprovableKeys) {
  let kv = line.match(/^("(?:[^"\\]|\\.)*"):[ \t]+(.*)$/)     // double-quoted KEY
        ?? line.match(/^('(?:[^']|'')*'):[ \t]+(.*)$/)        // single-quoted KEY
        ?? line.match(/^([^\s#][^:\n]*?):[ \t]+(.*)$/);       // bare key, non-comment, column 0
  if (kv === null) return;
  let [, key, rawValue] = kv;
  if (!key || !rawValue) return;
  let outsideQuotes = rawValue.trimEnd()
        .replace(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'/g, "");    // erase quoted spans first
  if (/^#|[ \t]#/.test(outsideQuotes)) unprovableKeys.push(key);
}

// Mapping: EJi→recordUnprovableInlineHash, t→unprovableKeys, i→outsideQuotes
```

**The quoted-span erasure at `:158067` is the subtle bit.** `description: "a # b" # real comment` must
be flagged, but `description: "a # b"` must not. Deleting every quoted span first leaves
` # real comment` in the first case and an empty remainder in the second, so the ` #` test decides
correctly without any parsing. The test itself is `/^#|[ \t]#/` — a `#` at position 0 *or* preceded by
whitespace — which is exactly the YAML plain-scalar comment rule.

### 3.4 The residual gap: nested keys are covered by neither pass

Both `$Ig`'s key regex (`/^([A-Za-z0-9_][A-Za-z0-9_.-]*):[ \t]+(.*)$/`) and all three of `EJi`'s
fallbacks are anchored to column 0 with a non-whitespace first character. An **indented** line —
`  type: project # note`, i.e. anything under `metadata:` — matches none of them, so it is neither
requoted nor flagged.

Verified empirically alongside §2.1: the input's `metadata.type` value lost its `# nested inline hash`
tail in the re-parse of `$Ig`'s output, and `unprovableKeys` did not name it.

This matters because `metadata` is where the memory schema puts everything interesting: `pLg`
(`:160687`) folds `metadata` into the record, `FVr` (`:160695`) reads `metadata.originSessionId`, `Onu`
(`:160696`) writes `metadata.{originSessionId,modified}`, and the memory template `Nnu` (`:160666-160679`)
prints `metadata:\n  type: {{…}}` as the shape the model should emit. **So the shipped fix covers
`name:` and `description:` but not `metadata.*`.** Whether that is deliberate scope-limiting (the
`metadata` values are machine-written enums, not prose) or an oversight is not decidable from the
bundle — but a reader should not assume the bullet's "memory frontmatter values" means all of them.

### 3.5 Why a hazard *flag* and not a throw

`rewriteHazard` is a `string | undefined` carried on the parse result, never an exception. The consumer
decides. That matters because `Lp` is called from dozens of places that must not fail on a weird
memory file — the hazard is advisory data, and only `Bfo` acts on it. An exception would have forced
try/catch at every call site or a second parser entry point.

---

## 4. Bullet `.214` #10 — the `modified:` timestamp

### 4.1 What actually changed

**`originSessionId` is 220=3 / 193=3 — pure carryover.** Provenance stamping already existed. And the
two call sites are carryover too: 193's `mMn` was called from the Write tool (`:378447 (193)`) and the
Edit tool (`:452720 (193)`); 220's `Bfo` is called from the Edit tool (`:311213`) and the Write tool
(`:311525`). The *wiring* did not move. Only the stamper body did.

```javascript
// ============================================
// stampNewMemoryContent - writes originSessionId + an ISO `modified` into memory frontmatter
// Location: cli_inner_pretty.js:238652-238668
// ============================================

// ORIGINAL (for source lookup):
function Bfo(e, t) {
  if (!(e.endsWith(".md") && Wde(e)) || !wZ.test(t)) return t;
  let n = new Date().toISOString(),
    o = uie(e) ? null : DY(t, e, { quoteLossyValues: !0 }),
    i = o !== null && FVr(o.frontmatter, "originSessionId") === null ? o : null;
  if (i !== null) {
    if (i.rewriteHazard === void 0) return $nu(Onu(i.frontmatter, { originSessionId: kt(), modified: n }), i.body);
    w(`stampNewMemoryContent: not stamping provenance on ${e} — ${i.rewriteHazard}`, { level: "warn" });
  }
  let s = Loy(t, n);
  if (s === null)
    return (w(`stampNewMemoryContent: not dating ${e} — no faithful place for a modified line`, { level: "warn" }), t);
  return s;
}

// READABLE (for understanding):
function stampNewMemoryContent(filePath, content) {
  if (!(filePath.endsWith(".md") && isUnderMemoryRoot(filePath)) || !FRONTMATTER_RE.test(content))
    return content;                                                   // not a memory file, or no frontmatter
  let nowIso = new Date().toISOString(),
    parsed = isUnderTeamMemoryDir(filePath)                           // team files: never stamp provenance
      ? null
      : parseFrontmatter(content, filePath, { quoteLossyValues: true }),
    firstSave = parsed !== null && readMetadataString(parsed.frontmatter, "originSessionId") === null
      ? parsed : null;
  if (firstSave !== null) {
    if (firstSave.rewriteHazard === undefined)                        // PATH A: safe structured rewrite
      return serializeMemoryFile(
        withMetadata(firstSave.frontmatter, { originSessionId: getSessionId(), modified: nowIso }),
        firstSave.body);
    warn(`stampNewMemoryContent: not stamping provenance on ${filePath} — ${firstSave.rewriteHazard}`);
  }
  let spliced = spliceModifiedLine(content, nowIso);                  // PATH B: surgical line splice
  if (spliced === null) {                                             // PATH C: give up, change nothing
    warn(`stampNewMemoryContent: not dating ${filePath} — no faithful place for a modified line`);
    return content;
  }
  return spliced;
}

// Mapping: Bfo→stampNewMemoryContent, Wde→isUnderMemoryRoot, uie→isUnderTeamMemoryDir,
//          DY→parseFrontmatter, FVr→readMetadataString, $nu→serializeMemoryFile,
//          Onu→withMetadata, kt→getSessionId, Loy→spliceModifiedLine, wZ→FRONTMATTER_RE
```

The 2.1.193 twin, for contrast:

```javascript
function mMn(e, t) {                                             // :242607-242612 (193)
  if (!vKd(e) || !eye.test(t)) return t;
  let { frontmatter: n, body: r } = qwn(t);
  if (zwn(n, "originSessionId") !== null) return t;              // <-- early exit: at most ONE rewrite ever
  return a0i(i0i(n, { originSessionId: xt() }), r);
}
```

### 4.2 On every save, or only on change?

**On every save.** There is no equality check, no dirty flag, and no comparison against the previous
`modified` value. The timestamp is `new Date().toISOString()` computed at `:238654` before any branch,
so a Write or Edit that changes nothing but a single character still re-stamps. The only reasons a save
does **not** produce a new `modified:` are structural, never "the content is unchanged":

| Condition | Line | Outcome |
|---|---|---|
| Path is not `*.md` under the memory root | `:238653` | content returned untouched |
| Content has no `---` fence at all | `:238653` | untouched — the stamper never *creates* frontmatter |
| `Loy` cannot find a faithful place for the line | `:238662` | untouched + a `warn` |

Note the last one is a *silent-to-the-user* no-op; the only trace is a debug-level log.

### 4.3 Three write paths, in severity order

**Path A — structured rewrite** (`:238658`). Taken only when *all* of: not a team-memory file,
`originSessionId` is absent (⇒ first save), and `rewriteHazard === undefined` (⇒ the round-trip was
proved safe). Serialises the whole frontmatter through `Bun.YAML.stringify`, which normalises key order
(`node_type` is forced first, `:160655`), drops null-valued keys (`:160656`), and kebab-cases the
`name` (`fLg`, `:160697`). This is the *only* path that reformats.

**Path B — surgical splice** (`:238661`). Everything else: subsequent saves, team-memory files, and
first saves that carry a hazard. Never touches the object model; edits **one line** of text.

**Path C — refuse** (`:238662-238666`). `Loy` returned `null`.

**Why is a team-memory file forced onto Path B?** `uie(e)` (`:161233`) tests whether the path is inside
the team memory directory. Team memories are *shared*, so stamping them with the local session's
`originSessionId` would be both wrong and a small information leak into a shared file. But they still
get a `modified:` date, because the splice writes only that. 2.1.193 excluded them entirely — `vKd`
(`:242602-242606 (193)`) returned `false` for them and they were never touched at all.

### 4.4 `spliceModifiedLine` — the byte-verified surgical edit

```javascript
// ============================================
// spliceModifiedLine - inserts or updates one `modified:` line, then proves nothing else moved
// Location: cli_inner_pretty.js:238669-238700
// ============================================

// ORIGINAL (for source lookup):
function Loy(e, t) {
  let r = e.match(wZ), n = e.match(pRt);
  if (r === null || n === null || r[1].trim() !== n[1].trim()) return null;
  let o = DY(e), { name: i, description: s, metadata: a } = o.frontmatter;
  if (i === null && s === null && Object.keys(a).length === 0) return null;
  let l = n[0].length, c = e.slice(0, l).split(`\n`),
    u = e.slice(0, l).includes(`\r\n`) ? "\r" : "",
    d = (A, b = "") => `${A}modified: ${t}${b}${u}`,
    p = c.flatMap((A, b) => (b > 0 && b < c.length - 1 && Roy.test(A) ? [b] : []));
  if (p.length > 1 || (p.length === 0 && "modified" in a)) return null;
  let f = p[0],
    m = f !== void 0 ? [...c.slice(0, f), d(...Doy(pFe(c[f]))), ...c.slice(f + 1)] : Poy(c, d);
  if (m === null) return null;
  let g = m.join(`\n`) + e.slice(l), y = DY(g), _ = g.match(pRt);
  return Jg(y.frontmatter, { ...o.frontmatter, metadata: { ...a, modified: t } }) &&
    y.body === o.body && _ !== null && g.slice(_[0].length) === e.slice(l)
    ? g : null;
}

// READABLE (for understanding):
function spliceModifiedLine(content, nowIso) {
  let lenient = content.match(FRONTMATTER_RE), strict = content.match(STRICT_FRONTMATTER_RE);
  if (lenient === null || strict === null || lenient[1].trim() !== strict[1].trim())
    return null;                                                   // 1. both fence readings must agree
  let before = parseMemoryFrontmatter(content),
    { name, description, metadata } = before.frontmatter;
  if (name === null && description === null && Object.keys(metadata).length === 0)
    return null;                                                   // 2. refuse to date an empty block
  let blockLen = strict[0].length,
    lines = content.slice(0, blockLen).split("\n"),
    cr = content.slice(0, blockLen).includes("\r\n") ? "\r" : "",   // 3. preserve the file's line ending
    makeLine = (indent, trailingComment = "") => `${indent}modified: ${nowIso}${trailingComment}${cr}`,
    hits = lines.flatMap((l, i) =>
      i > 0 && i < lines.length - 1 && MODIFIED_LINE_RE.test(l) ? [i] : []);
  if (hits.length > 1 || (hits.length === 0 && "modified" in metadata))
    return null;                                                   // 4. ambiguous: >1 line, or a value we cannot see
  let at = hits[0],
    next = at !== undefined
      ? [...lines.slice(0, at), makeLine(...splitModifiedIndentAndComment(stripCR(lines[at]))), ...lines.slice(at + 1)]
      : insertModifiedLine(lines, makeLine);                        // 5. update in place, or insert
  if (next === null) return null;
  let out = next.join("\n") + content.slice(blockLen),
    after = parseMemoryFrontmatter(out), outStrict = out.match(STRICT_FRONTMATTER_RE);
  return deepEqual(after.frontmatter, { ...before.frontmatter, metadata: { ...metadata, modified: nowIso } })
      && after.body === before.body                                 // 6. VERIFY: only `modified` changed,
      && outStrict !== null                                         //    body identical, fence still valid,
      && out.slice(outStrict[0].length) === content.slice(blockLen) //    post-fence bytes identical
    ? out : null;
}

// Mapping: Loy→spliceModifiedLine, wZ→FRONTMATTER_RE, pRt→STRICT_FRONTMATTER_RE, DY→parseMemoryFrontmatter,
//          Roy→MODIFIED_LINE_RE, Doy→splitModifiedIndentAndComment, Poy→insertModifiedLine,
//          pFe→stripCR, Jg→deepEqual, e→content, t→nowIso
```

Supporting regexes, all declared together at `:238755`:

```
Roy = /^(\s*)modified\s*:/    an existing modified line (any indentation)
lps = /^\s*(#|$)/             a blank or comment-only line
cps = /^\s+\S/                an indented, non-blank line  (i.e. a child of a block key)
```

**Step 4 deserves its own note.** `hits.length === 0 && "modified" in metadata` means: the parsed
object *has* a `modified` key but no source line matches `/^(\s*)modified\s*:/`. That can only happen
if the key came from a flow mapping (`metadata: {modified: x}`), a merge key, or an anchor/alias — all
shapes a line splice cannot safely edit. Refusing is correct and it is the one condition here that is
invisible from the text alone.

**Step 6 is the whole reason this function is trustworthy.** It re-parses its own output and asserts
four things: the frontmatter object equals the input object *plus exactly* `metadata.modified`; the
body string is identical; the strict fence still matches; and the bytes after the fence are
byte-identical to the input's. If any check fails, it returns `null` and the caller writes the original
content. **A byte-level splice validated by a semantic re-parse** — the splice is fast and preserves
formatting, the re-parse catches the cases where the splice's textual reasoning was wrong.

### 4.5 Comment preservation on update

```javascript
function Doy(e) {                                                        // :238704-238707
  let [, t, r] = e.match(/^(\s*)modified\s*:([\s\S]*)$/);
  return [t, /^["']/.test(r.trimStart()) ? "" : (r.match(/([ \t]+#.*)$/)?.[1] ?? "")];
}
```

`splitModifiedIndentAndComment` returns `[indent, trailingComment]`. When updating an existing
`modified:` line, the user's own indentation **and** their trailing `# comment` are carried onto the new
line — unless the old value was quoted, in which case a trailing `#` might be *inside* the quotes and
re-appending it would duplicate content. That is the same inline-`#` reasoning as §3.3, applied to a
single line. The two fixes are the same idea at two granularities, which is strong evidence they were
written together.

### 4.6 Insertion placement

`Poy` (`:238711-238726`) decides where a *new* `modified:` line goes:

1. Find the first line matching `/^metadata:/` (`r`, `:238712`) and the first matching
   `/^metadata:\s*(#.*)?$/` (`n`, `:238713`) — i.e. a `metadata:` that opens a *block* (nothing but an
   optional comment after the colon).
2. If a `metadata:` exists but is not block-style (`r !== -1 && n === -1`) — e.g. `metadata: {a: 1}` —
   **return `null`**. A flow mapping cannot take an inserted line.
3. If there is no `metadata:` at all, insert immediately before the closing `---`
   (`findLastIndex(l => l.trim() === "---")`, `:238716-238717`) at top level.
4. Otherwise find the end of the `metadata:` block with `Moy` (`:238727-238745`) and insert there,
   copying the indentation of the block's first real child
   (`.find(a => cps.test(…) && !lps.test(…))?.match(/^(\s+)/)?.[1] ?? "  "`, `:238720-238724`) — with a
   two-space default when the block is empty.

`Moy` walks forward over indented lines (`cps`) and *tentatively* over runs of blank/comment lines
(`lps`), only accepting such a run if an indented line follows it (`:238734-238741`). This keeps a
trailing comment block that belongs to the *next* key from being swallowed into `metadata`, while
allowing a comment in the middle of the block. `r < e.length - 1` throughout stops the scan before the
closing fence.

**Design summary:** prefer to put `modified` *inside* `metadata` (where the schema wants it, matching
`Onu`'s `metadata: {…modified}` in Path A), fall back to top level, and refuse rather than guess.

---

## 5. Why this design, and what it costs

**Why prove losslessness instead of just always quoting everything?** Always quoting would reformat
every memory file on every save — churning git diffs, breaking the model's own expectations about the
file it just wrote, and converting typed values (numbers, booleans, sequences) into strings. The
prover's `parsed !== value` test touches only the lines that actually need it.

**Why keep the whole 2.1.193 path intact underneath?** Three layers of fallback (`$Ig` fails →
plain parse → salvage parse) mean the new code can only ever *add* fidelity. Combined with
`rewriteHazard` being advisory rather than fatal, the worst possible regression from this change is
"behaves exactly like 2.1.193, plus a warn line".

**Why not simply not rewrite?** Because `.214` wanted a `modified:` timestamp, which requires writing.
The splice path is the answer to "how do you write one field into a document you are not confident you
can re-serialise" — and its step-6 verification is what makes that answer sound.

**Cost:** on the first save of a memory file, the frontmatter is now parsed up to **three** times
(`$Ig`'s per-line `yamlParse` calls, the requoted whole-block parse, then `Loy`'s two `DY` calls if the
splice path runs). For a frontmatter block of a few hundred bytes on a human-initiated file write, that
is free. It would not be free if `quoteLossyValues` were enabled globally — which is exactly why it is
opt-in and why only `Bfo` passes it.

**Key insight:** the fix is not "handle `#`". It is *"never rewrite a document you cannot prove you can
reconstruct"*, implemented as a losslessness prover plus a verified surgical fallback. The `#` is just
the instance of unprovability that YAML makes most likely.

---

## 6. Adjacent: `.217`'s brace-expansion budget lives in the same module

`_scope_v215_220.md:145`/`:176-178` files `.217`'s *"Fixed a `CLAUDE.md` or `SKILL.md` `paths`
frontmatter value with many brace groups OOM-killing or stalling the CLI at startup — brace expansion is
now budget-bounded"* under `performance`, and reports that no literal could be found (`maxPatterns` /
`pattern budget` / `expandedCount` all 0/0).

**The literal exists.** `Brace pattern expansion exceeds the budget; using it unexpanded:` is
**220=1 (`:158177`) / 193=0**, inside `BIg` (`:158159-158183`), the brace expander reached from `Zno`
(`:158136`) — which is called by `fny` (`:235627`) on exactly the `paths:` frontmatter key the bullet
names. The budget is a mutable `{ results, bytes }` record seeded at `:158137` from
`NIg = 1000, FIg = 4194304` (`:158227-158228`) — a 1,000-pattern / 4 MiB ceiling, decremented as the
worklist expands, with the projected cost check `t.bytes < 0 || u > t.results || u * e.length > t.bytes`
(`:158175`). On exhaustion the pattern is used **unexpanded** rather than dropped, so the failure mode
is under-matching, not a crash. Handing this to `50_performance` as the missing anchor.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_auto_memory.md](../00_overview/symbol_additions_v2_1_220_auto_memory.md).

Key functions in this document:
- `parseFrontmatter` (`Lp`, `:158070`) - the shared frontmatter parser; gained the `quoteLossyValues` mode
- `requoteLossyScalars` (`$Ig`, `:158018`) - per-line losslessness prover and repairer
- `recordUnprovableInlineHash` (`EJi`, `:158059`) - flags keys whose inline `#` cannot be requoted
- `emptyKeysHazard` (`yru`, `:158127`) - lowest-severity hazard: a block that parsed to no keys
- `quoteSuspiciousScalars` (`OIg`, `:157984`) - the pre-existing post-throw salvage pass (carryover)
- `parseMemoryFrontmatter` (`DY`, `:160649`) - memory-shaped wrapper over `Lp`
- `serializeMemoryFile` (`$nu`, `:160653`) - `---` + `Bun.YAML.stringify` + body
- `normalizeMemoryFrontmatter` (`pLg`, `:160687`) - builds `{name, description, metadata}`
- `readMetadataString` (`FVr`, `:160695`) - non-empty-string metadata reader
- `withMetadata` (`Onu`, `:160696`) - frozen metadata merge
- `stampNewMemoryContent` (`Bfo`, `:238652`) - the three-path stamper; called from Edit `:311213` and Write `:311525`
- `spliceModifiedLine` (`Loy`, `:238669`) - byte-splice + semantic re-verification
- `splitModifiedIndentAndComment` (`Doy`, `:238704`) - preserves indent and trailing comment on update
- `insertModifiedLine` (`Poy`, `:238711`) - placement inside `metadata:` / before the closing fence
- `findMetadataBlockEnd` (`Moy`, `:238727`) - block-scope scanner tolerant of interior comment runs
- `insertAt` (`c1u`, `:238708`) - array splice helper
- `stripCR` (`pFe`, `:238701`) - trailing `\r` remover
- `isUnderMemoryRoot` (`Wde`, `:157057`) - path is under the memory dir
- `isUnderTeamMemoryDir` (`uie`, `:161233`) - path is under the team memory dir
- `expandBracePatternsWithBudget` (`BIg`, `:158159`) - the `.217` budget-bounded brace expander
- `splitAndExpandPatterns` (`bru`, `:158139`) - comma splitter feeding the expander
- `FRONTMATTER_RE` (`wZ`, `:158237`) / `STRICT_FRONTMATTER_RE` (`pRt`, `:158237`) - the two fence regexes
- `MODIFIED_LINE_RE` (`Roy`, `:238755`) / `BLANK_OR_COMMENT_RE` (`lps`) / `INDENTED_LINE_RE` (`cps`)
