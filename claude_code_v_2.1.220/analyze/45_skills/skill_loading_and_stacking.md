# Skill loading: stacking, re-invocation, argument placeholders, `paths` brace budgets, and the bundled skills

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

Six bullets, five of them anchored to a *single changed statement or a single added guard* inside code
that already existed in 2.1.193. Together they describe how a skill gets from a typed `/name args` into
the conversation, and each one is a repair to a different stage of that pipeline:

```
  typed input
    │
    ├─▶ peelStackedPromptCommands (tpd :343833)   .199 — NEW: peel up to 5 leading /skills
    │
    ├─▶ substituteCommandArguments (vct :237706)  .210 — unmatched $N preserved verbatim
    │
    ├─▶ elideDuplicateSkillInvocation (ZNy :346748) .202 — NEW: don't paste the same skill twice
    │
    └─▶ expandBracePatterns (BIg :158159)         .217 — NEW: budget-bounded `paths:` expansion
```

Plus three content bullets: the bundled `/dataviz` skill (`.198`, `.210`), the bundled `verify` skill's
edit-gating text (`.205`), and the bundled `claude-api` skill's Opus 5 default (`.219`, §8) — the last of
which is the only bullet in this module whose delta is *data in a substitution table* rather than code.

---

## 1. `.199` — stacked slash-skill invocations

> *"`/skill-a /skill-b do XYZ` now loads all leading skills (up to 5) before the remaining text is
> passed as arguments."*

**Verdict: NET_NEW.** `tengu_stacked_slash_commands` **220=1 / 193=0** (`:343685`);
`stackedOriginalInput` **220=9 / 193=0**; `stackedExpansion` **220=8 / 193=0**;
`argsMayContainSlashCommands` **220=4 / 193=0**; `Stacked command limit` **220=1 / 193=0**.
Exported under a real name at `:343017` — `peelStackedPromptCommands: () => tpd`.

### 1.1 The peeler

```javascript
// ============================================
// peelStackedPromptCommands - peel leading /skill tokens off the argument string
// Location: cli_inner_pretty.js:343833-343871   (exported as `peelStackedPromptCommands` at :343017)
// ============================================

// ORIGINAL (for source lookup):
function tpd(e, t, r, n) {
  if (t === void 0 && n === void 0) return { stacked: [], trailingArgs: e, capped: !1 };
  let o = [], i = e, s = t, a = !1;
  for (let l = 0; ; l++) {
    let c = i.trimStart();
    if (!c.startsWith("/")) break;
    if (l >= epd) { a = !0; break; }
    let u = Rfe(c);
    if (!u) break;
    let d = s;
    if (s !== void 0) {
      let f = s.trimStart(), m = f.startsWith("/") ? Rfe(f) : void 0;
      if (!m || m.commandName !== u.commandName) break;
      d = m.args;
    }
    let p = Cv(u.commandName, r);
    if (!p || p.type !== "prompt" || p.context === "fork" || p.getContext !== void 0 ||
        p.argsMayContainSlashCommands || p.userInvocable === !1 || !yk(p) || w9(p)) break;
    if (((i = u.args), (s = d), n?.(p))) continue;
    o.push(p);
  }
  return { stacked: o, trailingArgs: i, capped: a };
}

// READABLE (for understanding):
function peelStackedPromptCommands(argString, rawArgString, commandRegistry, skipPredicate) {
  if (rawArgString === undefined && skipPredicate === undefined)
    return { stacked: [], trailingArgs: argString, capped: false };   // nothing to do
  let stacked = [], rest = argString, rawRest = rawArgString, hitCap = false;
  for (let i = 0; ; i++) {
    let head = rest.trimStart();
    if (!head.startsWith("/")) break;                                  // no more leading commands
    if (i >= MAX_STACKED_COMMANDS) { hitCap = true; break; }           // MAX_STACKED_COMMANDS = 5
    let parsed = parseSlashInvocation(head);
    if (!parsed) break;
    let nextRaw = rawRest;
    if (rawRest !== undefined) {                                       // keep the pre-expansion
      let rawHead = rawRest.trimStart(),                               // string in lockstep …
        parsedRaw = rawHead.startsWith("/") ? parseSlashInvocation(rawHead) : undefined;
      if (!parsedRaw || parsedRaw.commandName !== parsed.commandName) break;  // … or bail
      nextRaw = parsedRaw.args;
    }
    let command = lookupCommand(parsed.commandName, commandRegistry);
    if (!command                                  // unknown
      || command.type !== "prompt"                // not a skill/prompt command
      || command.context === "fork"               // forks own their own turn
      || command.getContext !== undefined         // dynamic context — can't decide statically
      || command.argsMayContainSlashCommands      // e.g. /loop, whose args ARE a command
      || command.userInvocable === false          // model-only
      || !isCommandEnabled(command)               // policy-disabled
      || isSkillOverriddenOff(command))           // skillOverrides: off
      break;
    rest = parsed.args; rawRest = nextRaw;
    if (skipPredicate?.(command)) continue;       // counted against the cap, but not expanded
    stacked.push(command);
  }
  return { stacked, trailingArgs: rest, capped: hitCap };
}

// Mapping: tpd→peelStackedPromptCommands, epd→MAX_STACKED_COMMANDS (=5, :344087),
//          Rfe→parseSlashInvocation (:342629), Cv→lookupCommand (:346396),
//          yk→isCommandEnabled (:326536), w9→isSkillOverriddenOff (:326365)
```

**What it does:** walks the argument string left-to-right, consuming `/name` tokens while each one names a
plain prompt-type skill, and returns the skills to expand plus whatever text is left.

**How it works, and why each exclusion is there:**

1. The **early return** at `:343834` makes the peeler a no-op unless the caller supplied a raw string or a
   skip predicate. Everything downstream is therefore opt-in per call site — the only caller is the
   `case "prompt"` arm at `:343683`.
2. `rawArgString` (`t`) is the pre-expansion input, tracked in lockstep so that the *displayed* prompt can
   be reconstructed. If the two strings disagree on the next command name (`:343852`) the peel stops rather
   than guessing — a conservative bail that keeps the transcript honest.
3. **`command.context === "fork"` breaks the loop** (`:343859`). A fork owns the whole turn (it may even
   become a background agent — see [`skill_context_fork_background.md`](skill_context_fork_background.md)),
   so it cannot be one of several skills merged into one prompt. The same test appears at the call site
   (`:343681`) to disqualify the *first* command too.
4. **`argsMayContainSlashCommands`** (220-only, `:343861`) is the escape hatch for commands whose arguments
   are themselves a command — `/loop 5m /foo`. Without it, `/loop`'s payload would be eaten by the peeler.
5. `!isCommandEnabled` / `isSkillOverriddenOff` mean a policy-disabled or user-disabled skill silently
   ends the chain instead of being expanded.
6. `skipPredicate?.(command)` (`:343867`) advances past a command **without pushing it** — and note it
   still consumed a loop iteration, so it counts against the cap. The call site passes
   `c ? (u ?? (() => !0)) : void 0` (`:343683`), i.e. in the suppressed-invocation mode the predicate
   defaults to "skip everything", which peels the tokens off the argument string without loading anything.

### 1.2 Why the cap is 5

`epd = 5` (`:344087`) is a bare module-level constant — **no feature gate, no env var, no settings key**.
Compare `getMaxSubagentSpawnDepth` (`hee`, `:230896`), which is gate-backed via `tengu_hazel_trellis`
precisely because Anthropic expected to tune it remotely. The absence of a gate here is itself the signal:
5 is not a number they expected to change.

The constraint being managed is **context, not concurrency**. Each stacked skill's full `SKILL.md` body is
concatenated into the same user turn (`:343780`, `I.messages.push(...L.messages)`), and their
`allowedTools`/`disallowedTools` are unioned (`:343781-343782`). Three consequences bound the number:

- **Prompt size.** Bundled skills in this build run from a few hundred bytes to well over 100 KB
  (`file_index.md` §4.4 measures the largest embedded skill payloads at 115,489 and 109,103 chars). Five
  medium skills is already a large fraction of a turn; ten would routinely force a compaction on the very
  turn the user typed.
- **Tool-set coherence.** `allowedTools` is a *union*, and `model`/`effort` are last-writer-wins
  (`:343783-343784`). Every additional skill widens the tool surface and can silently override the model
  the previous one asked for. The more skills stack, the less any one of them controls its own environment.
- **Human legibility.** The user typed the line. Five leading `/name` tokens is roughly where a single
  terminal line stops being readable, and the failure mode (the sixth token silently becoming an argument)
  has to be explainable.

The overflow is **not** an error. `capped` propagates back and produces a warning line
(`:343790-343793`): ``Stacked command limit (${epd}) reached — remaining input passed as arguments``. So
`/a /b /c /d /e /f do XYZ` runs five skills with `"/f do XYZ"` as their argument string — degraded, visible,
and never silently truncated. That is the right failure direction: the model still sees the sixth token.

### 1.3 Transcript bookkeeping — the part with the most call sites

Two message flags are stamped during expansion and read in six places:

- `stackedOriginalInput` (`:343755`) is set on the **first** expansion's user message to
  `` `/${y.name} ${d}` `` — the pre-expansion text for just that command.
- `stackedExpansion = true` (`:343779`) is set on **every subsequent** expansion's user message.

Readers, all **220-only**:

| Line | Consumer | Behaviour |
|---|---|---|
| `:530547` | `if (e.stackedExpansion) return !1` | excluded from some eligibility test |
| `:532126`, `:532144` | prompt reconstruction | prefers `stackedOriginalInput` as the display text |
| `:532134` | history walk | skips `stackedExpansion` messages |
| `:739618` | UI render | `TXa.stackedOriginalInput ?? "/name args"` |
| `:739733`, `:755025-755026` | transcript/summary walkers | skip expansions, use the original for the survivor |
| `:822842-822860` | **resume replay** | skips expansions; rebuilds `preExpansionValue` from the original |
| `:847781-847798` | rewind/edit-previous-message | walks back past expansions to the real user message |

**Key insight:** the expensive part of stacking is not the peeling — it is making N synthetic user messages
behave, for every history-facing feature (up-arrow recall, resume, rewind, summarisation), like the **one**
line the user actually typed. Six of the eight consumer sites exist purely to undo the fan-out. That is
why `argsMayContainSlashCommands` and the `getContext !== undefined` exclusion are worth their weight:
every skill that *can* be stacked adds a case to all six.

---

## 2. `.202` — re-invoking a loaded skill no longer duplicates its instructions

> *"Fixed re-invoking an already-loaded skill appending a duplicate copy of its instructions."*

**Verdict: NET_NEW.** The scoping pass probed `already loaded` (220=5 / 193=4) and recorded UNANCHORED.
That anchor is a decoy — three of its hits are unrelated dedupe log lines
(`:270981`, `:439088`, `:530083`, each with a 193 twin at `:475261 (193)`, `:452122 (193)`,
`:599094 (193)`). The **fourth** 220 hit, `:346767`, is the real one, and its cluster is clean:

| Literal | 220 | 193 |
|---|---|---|
| `Skill /${r} is already loaded above; instructions unchanged.` (`:346767`) | 1 | 0 |
| `was loaded earlier (see the invoked-skills reminder above)` (`:346766`) | 1 | 0 |
| `Re-invocation of /` (`:346754`, `:346755`) | 2 | 0 |
| `previously loaded copy was truncated by compaction` (`:346754`) | 1 | 0 |
| `eliding byte-identical re-invocation` (`:346772`) | 1 | 0 |
| `priorContent` (`:346748`, `:347083`) | 2 | 0 |

### 2.1 The elider

```javascript
// ============================================
// elideDuplicateSkillInvocation - replace or annotate a repeated skill body
// Location: cli_inner_pretty.js:346748-346774
// ============================================

// ORIGINAL (for source lookup):
function ZNy({ messages: e, contextMessages: t, commandName: r, args: n, priorContent: o, renderedContent: i }) {
  if (!o || !i) return e;
  let s = S0o(t, o);
  if (!s) return e;
  if (o !== i) {
    let c = o.endsWith(iin)
      ? `(Re-invocation of /${r} — the previously loaded copy was truncated by compaction; the full instructions follow.)`
      : `(Re-invocation of /${r} — the skill instructions were previously loaded; the arguments or dynamic output below are new.)`;
    return [zr({ content: c, isMeta: !0 }), ...e];
  }
  let a = !1,
    l = e.map((c) => {
      if (eRs(c) !== i) return c;
      return ((a = !0), zr({ content: s === "attachment"
            ? `Skill /${r} was loaded earlier (see the invoked-skills reminder above); this is a NEW invocation — follow those instructions now, including any setup steps.${n ? ` Arguments: ${n}` : ""}`
            : `Skill /${r} is already loaded above; instructions unchanged.${n ? ` Arguments: ${n}` : ""}`,
          isMeta: !0 }));
    });
  if (a) w(`SkillTool eliding byte-identical re-invocation of skill ${r}`);
  return l;
}

// READABLE (for understanding):
function elideDuplicateSkillInvocation({ messages, contextMessages, commandName, args, priorContent, renderedContent }) {
  if (!priorContent || !renderedContent) return messages;              // first invocation — nothing to elide
  let where = findPriorSkillContent(contextMessages, priorContent);     // "body" | "attachment" | null
  if (!where) return messages;                                          // it fell out of context — re-send in full

  if (priorContent !== renderedContent) {                               // body CHANGED (new args / dynamic output)
    let note = priorContent.endsWith(COMPACTION_TRUNCATION_MARKER)
      ? `(Re-invocation of /${commandName} — the previously loaded copy was truncated by compaction; the full instructions follow.)`
      : `(Re-invocation of /${commandName} — the skill instructions were previously loaded; the arguments or dynamic output below are new.)`;
    return [meta(note), ...messages];                                   // keep the body, prepend a hint
  }

  let elided = false;                                                   // body IDENTICAL — replace it
  let out = messages.map((m) => {
    if (metaTextOf(m) !== renderedContent) return m;
    elided = true;
    return meta(where === "attachment"
      ? `Skill /${commandName} was loaded earlier (see the invoked-skills reminder above); this is a NEW invocation — follow those instructions now, including any setup steps.${args ? ` Arguments: ${args}` : ""}`
      : `Skill /${commandName} is already loaded above; instructions unchanged.${args ? ` Arguments: ${args}` : ""}`);
  });
  if (elided) debug(`SkillTool eliding byte-identical re-invocation of skill ${commandName}`);
  return out;
}

// Mapping: ZNy→elideDuplicateSkillInvocation, S0o→findPriorSkillContent (:346523),
//          eRs→metaTextOf (:346513), iin→COMPACTION_TRUNCATION_MARKER (:346536), zr→meta
```

### 2.2 Why there are four outcomes and not two

**What it does:** decides, on every `Skill` tool call, whether to paste the skill body again, paste it with
a note, replace it with a pointer, or do nothing.

**How it works:**

1. `priorContent` / `renderedContent` come from a per-agent registry keyed
   `` `${agentId}:${skillName}` `` (`:347021`). The caller reads it **before** the command is processed
   (`f = dOe().get(p)`, `:347022`) and **again after** (`dOe().get(p)?.content`, `:347084`). Rendering the
   skill writes into the registry, so `priorContent` is genuinely "what we sent last time" and
   `renderedContent` is "what we would send now". No hashing, no extra state.
2. `findPriorSkillContent` (`S0o`, `:346523-346534`) scans the live context **backwards** for that exact
   string, and distinguishes two places it can live:
   - as the body of an `isMeta` user message → `"body"` (returns immediately, most recent wins);
   - inside an `invoked_skills` attachment → `"attachment"` (flagged but the scan continues, because a
     real body later in the walk is a stronger match).
   `null` means it is gone — compacted away — so the full body must be re-sent with no note at all.
3. If the rendered body **differs** (different `$ARGUMENTS`, different `!`-block output), the body is kept
   and a one-line meta note is *prepended*. Two variants, chosen by whether the previous copy ends with
   `iin` (`:346536-346538`,
   `[... skill content truncated for compaction; use Read on the skill path if you need the full text]`).
   The compaction variant exists because a model that sees the *same* skill twice, the second time longer,
   would otherwise have to guess which copy is authoritative.
4. If the rendered body is **byte-identical**, the body message is swapped for a pointer. And here the
   `"body"` / `"attachment"` distinction pays for itself: a pointer saying *"already loaded above"* is only
   actionable if the instructions really are above **as prose**. When the prior copy survives only as an
   `invoked_skills` attachment, the replacement text is materially different — it names where to look
   *and* adds *"this is a NEW invocation — follow those instructions now, including any setup steps."*

**Why this approach:** the naive fix (a `Set` of already-loaded skill names, skip on repeat) breaks three
real cases at once — a skill invoked with new arguments, a skill whose body embeds live `!`-command output,
and a skill whose earlier copy was compacted out of context. All three are *legitimate* reasons to re-send.
Comparing rendered strings instead of names makes the decision data-driven, and the extra `where` axis
recovers the one thing string comparison loses: whether the model can actually *see* the earlier copy in
the form it needs.

**Key insight:** the fix is not "deduplicate"; it is **"replace the duplicate with a correctly-worded
pointer"**. Every one of the four branches still emits a message. The token saving comes from the pointer
being ~150 bytes instead of a multi-kilobyte body, and the correctness comes from never leaving the model
without an instruction to act on.

---

## 3. `.210` — unmatched `$1`/`$2` are preserved verbatim

> *"Fixed unmatched `$1`/`$2` positional placeholders in a skill being silently stripped; they are now
> left as typed."*

**Verdict: NET_NEW (two-line change).** The scoping pass probed `positional` (220=25 / 193=15) and
recorded UNANCHORED. The real anchor is a control-flow diff inside one carryover function.
`if (s[g] === void 0) return f;` is **220=1 / 193=0** (`:237732`).

### 3.1 The diff

```javascript
// ============================================
// substituteCommandArguments (excerpt) - unmatched positional handling
// Location: cli_inner_pretty.js:237723-237743   (whole function :237706-237744)
// ============================================

// ORIGINAL (for source lookup):
  let p = !1;
  if (
    ((e = e.replace(/\$ARGUMENTS\[(\d+)\]/g, (f, m) => {
      let g = parseInt(m, 10);
      if (s[g] === void 0) return ((p = !0), xfo + f.slice(1));
      return ((d = !0), i(s[g]));
    })),
    (e = e.replace(/\$(\d+)(?!\w)/g, (f, m) => {
      let g = parseInt(m, 10);
      if (s[g] === void 0) return f;
      return ((d = !0), i(s[g]));
    })),
    (e = e.replaceAll("$ARGUMENTS", () => ((d = !0), i(t)))),
    !d && r && t)
  )
    e = e + `\n\nARGUMENTS: ${i(t)}`;
  if (u || p) e = e.replaceAll(xfo, "$");

// READABLE (for understanding):
  let sawUnmatchedIndexed = false;
  text = text.replace(/\$ARGUMENTS\[(\d+)\]/g, (whole, digits) => {
    let idx = parseInt(digits, 10);
    if (positional[idx] === undefined) {
      sawUnmatchedIndexed = true;
      return SENTINEL + whole.slice(1);      // "￿" + "ARGUMENTS[3]"  — hide the $ from the next pass
    }
    substitutedSomething = true;
    return sanitize(positional[idx]);
  });
  text = text.replace(/\$(\d+)(?!\w)/g, (whole, digits) => {
    let idx = parseInt(digits, 10);
    if (positional[idx] === undefined) return whole;   // <-- THE FIX: emit "$2" unchanged
    substitutedSomething = true;
    return sanitize(positional[idx]);
  });
  text = text.replaceAll("$ARGUMENTS", () => { substitutedSomething = true; return sanitize(rawArgs); });
  if (!substitutedSomething && appendFallback && rawArgs)
    text += `\n\nARGUMENTS: ${sanitize(rawArgs)}`;
  if (sawEscapedDollar || sawUnmatchedIndexed) text = text.replaceAll(SENTINEL, "$");

// Mapping: vct→substituteCommandArguments, s→positional, i→sanitize, d→substitutedSomething,
//          p→sawUnmatchedIndexed, u→sawEscapedDollar, xfo→SENTINEL ("￿", :237746),
//          r→appendFallback, t→rawArgs
```

The 2.1.193 ancestor is `tut` (`:298868-298905 (193)`). Its two replacers were:

```javascript
// ORIGINAL (2.1.193, cli_inner_pretty.js:298886-298895):
    ((e = e.replace(/\$ARGUMENTS\[(\d+)\]/g, (p, f) => { d = !0; let m = parseInt(f, 10); return s(i[m]); })),
    (e = e.replace(/\$(\d+)(?!\w)/g,        (p, f) => { d = !0; let m = parseInt(f, 10); return s(i[m]); })),
```

### 3.2 The two bugs, and why the fix needs two different strategies

**Bug 1 — silent stripping.** `s(undefined)` in 193 is `(undefined ?? "").replaceAll(...)` → the empty
string. So `/deploy staging` running a skill that says `Deploy $1 to $2` produced
`Deploy staging to ` — the missing argument vanished and the model could not tell whether the author meant
"no target" or "the user forgot one".

**Bug 2 — suppressed fallback.** 193 set `d = !0` (`substitutedSomething`) *unconditionally*, before even
looking at the value. So a skill whose only placeholder was an unmatched `$2` was recorded as "arguments
were consumed", and the `\n\nARGUMENTS: …` appendix at `:298897-298903 (193)` — the safety net that hands
the model the raw argument string when nothing matched — never fired. The user's input was dropped twice
over. 220 moves `d = !0` inside the matched branch of both replacers, fixing this as a side effect.

**Why the two replacers use different preservation strategies.** They run in sequence over the same string,
and the third statement is `replaceAll("$ARGUMENTS", …)`:

- `$2` can be returned **verbatim** (`return f`). It is safe because `String.prototype.replace` with a
  *function* replacement inserts the return value literally (no `$&`/`$1` re-interpretation, unlike a
  string replacement), and because no later pass matches `$\d+`.
- `$ARGUMENTS[3]` **cannot**. Returning it verbatim would leave the literal text `$ARGUMENTS[3]` in the
  string, and the very next statement, `replaceAll("$ARGUMENTS", …)`, matches its prefix — yielding
  `<entire argument string>[3]`. So the unmatched form is emitted as `"￿" + "ARGUMENTS[3]"`, masking
  the `$` for exactly one statement, and restored at the end.

That restoration is the other half of the fix: the guard went from `if (u)` (193 `:298904`) to
`if (u || p)` (220 `:237743`). Without the `|| p`, an unmatched `$ARGUMENTS[3]` in a skill that contained
no escaped `\$` would have shipped a raw U+FFFF into the prompt.

**Key insight:** `￿` is a *noncharacter* — permanently unassigned by Unicode and guaranteed never to
appear in valid text — which is why it is safe as an in-band mask. The pre-pass at `:237718` uses the same
sentinel for user-escaped `\$` sequences, so both mechanisms share one restore step.

---

## 4. `.217` — `paths:` brace expansion is budget-bounded

> *"Fixed a `CLAUDE.md` or `SKILL.md` `paths` frontmatter value with many brace groups OOM-killing the CLI
> at startup."*

**Verdict: NET_NEW.** [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md)
records this bullet as a trap — `brace expansion` is 220=1 / 193=1 and its only hit (`:211144`) is the Bash
permission parser, while `maxPatterns`/`pattern budget`/`expandedCount` are all 0/0. **That is correct
about the probes and wrong about the conclusion: the fix is anchorable.** The literal to grep is
`Brace pattern expansion exceeds the budget` — **220=1 / 193=0** at `:158177`.

### 4.1 The 2.1.193 expander was unbounded recursion

```javascript
// ORIGINAL (2.1.193, cli_inner_pretty.js:149557-149571):
function Qxi(e) {
  let t = e.match(/^([^{]*)\{([^}]+)\}(.*)$/);
  if (!t) return [e];
  let n = t[1] || "", r = t[2] || "", o = t[3] || "",
    s = r.split(",").map((a) => a.trim()),
    i = [];
  for (let a of s) {
    let l = n + a + o,
      c = Qxi(l);          // <-- recursive, no depth limit, no result limit
    i.push(...c);
  }
  return i;
}
```

Its caller `l$t` (`:149537-149555 (193)`) splits the `paths:` value on top-level commas and flat-maps every
segment through `Qxi`. A value like `src/{a,b}/{c,d}/{e,f}/…` with *k* alternatives in each of *n* groups
produces **kⁿ** strings, built by kⁿ recursive calls and kⁿ array spreads. Twenty two-way groups is a
million strings; thirty is a billion. Because this runs during **`CLAUDE.md` loading at startup**
(`fny`, `:235627-235635`, reached from the `@include` walker `mny`, `:235636`), a single committed
`CLAUDE.md` could kill the process before the REPL appeared — which is exactly what the bullet describes.

### 4.2 The 2.1.220 expander is a bounded worklist

```javascript
// ============================================
// expandBracePatterns - worklist brace expansion with a shared two-axis budget
// Location: cli_inner_pretty.js:158159-158183  (entry point Zno :158136, budget consts :158227-158228)
// ============================================

// ORIGINAL (for source lookup):
function Zno(e) {
  return bru(e, { results: NIg, bytes: FIg });
}
…
function BIg(e, t) {
  if (!e.includes("{")) return [e];
  let r = [], n = [e];
  for (let o = n.pop(); o !== void 0; o = n.pop()) {
    let i = o.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    if (!i) { r.push(o); continue; }
    let s = i[1] || "", a = i[2] || "", l = i[3] || "",
      c = a.split(",").map((d) => d.trim());
    t.bytes -= o.length;
    let u = r.length + n.length + c.length;
    if (t.bytes < 0 || u > t.results || u * e.length > t.bytes)
      return (w(`Brace pattern expansion exceeds the budget; using it unexpanded: ${ma(e, 256)}`, { level: "warn" }), [e]);
    for (let d = c.length - 1; d >= 0; d--) n.push(s + (c[d] ?? "") + l);
  }
  return ((t.results -= r.length), (t.bytes -= r.length * e.length), r);
}
…
var NIg = 1000, FIg = 4194304;

// READABLE (for understanding):
function expandPathsFrontmatter(value) {
  return splitAndExpand(value, { results: MAX_EXPANDED_PATTERNS, bytes: MAX_EXPANSION_BYTES });
}                                                  // 1000 patterns, 4 MiB — ONE budget for the whole value

function expandBracePatterns(pattern, budget) {
  if (!pattern.includes("{")) return [pattern];
  let done = [], work = [pattern];
  for (let item = work.pop(); item !== undefined; item = work.pop()) {   // explicit stack, no recursion
    let m = item.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    if (!m) { done.push(item); continue; }                               // fully expanded
    let prefix = m[1] || "", body = m[2] || "", suffix = m[3] || "",
      alts = body.split(",").map((s) => s.trim());
    budget.bytes -= item.length;                                          // charge for this expansion step
    let projected = done.length + work.length + alts.length;
    if (budget.bytes < 0                          // (a) cumulative work exhausted
      || projected > budget.results               // (b) too many results
      || projected * pattern.length > budget.bytes)  // (c) projected memory too large
      return (warn(`Brace pattern expansion exceeds the budget; using it unexpanded: ${truncate(pattern, 256)}`),
              [pattern]);                          // FAIL SAFE: the raw pattern, not an error
    for (let i = alts.length - 1; i >= 0; i--) work.push(prefix + alts[i] + suffix);
  }
  budget.results -= done.length;
  budget.bytes -= done.length * pattern.length;
  return done;
}

// Mapping: Zno→expandPathsFrontmatter, bru→splitAndExpand (:158139), BIg→expandBracePatterns,
//          NIg→MAX_EXPANDED_PATTERNS (1000), FIg→MAX_EXPANSION_BYTES (4194304 = 4 MiB),
//          ma→truncate, t→budget
```

**How the budget works, and why there are three tests:**

1. `budget.bytes -= item.length` charges for *work already done*, before any test. Even a pattern that
   never blows the result cap eventually exhausts the byte budget if it keeps re-expanding — this is the
   only test that bounds **total work** rather than output size.
2. `projected > budget.results` bounds the **count**: already-finished plus still-pending plus this
   fan-out. Note it is checked *before* pushing, so the cap is never exceeded even transiently.
3. `projected * pattern.length > budget.bytes` bounds **memory**: 1000 patterns of 4 KB each is 4 MB, so
   the two constants are calibrated against each other. A short pattern is allowed all 1000 slots; a long
   one is cut off by memory long before it reaches 1000.

**The budget object is shared and mutable.** `Zno` creates it once per `paths:` value and `bru` threads
the *same object* through every comma-separated segment (`:158157`), decrementing on success
(`:158182`). So `paths: "a{1..}/**, b{...}/**, c{...}/**"` gets 1000 patterns *in total*, not 1000 each —
closing the obvious workaround of splitting one hostile pattern into ten.

**Failure is silent-but-logged, and safe.** On budget exhaustion the function returns `[pattern]` — the
*unexpanded* original. The skill still loads; its `paths:` scoping simply matches the literal brace string
(i.e. probably nothing). Compare the alternatives: throwing would make one bad `CLAUDE.md` unloadable;
returning `[]` would make the skill match *everything* or *nothing* depending on the caller. Returning the
raw pattern is the only option that is both non-fatal and non-privilege-escalating.

**Recursion → worklist is load-bearing, not cosmetic.** 193's `Qxi` recursed once per intermediate string;
a pattern with 20 nested groups blew the JS stack before it blew the heap. The explicit `work` array moves
that to the heap where the byte budget can see it. Reverse-order pushing (`for (i = alts.length-1; i >= 0;
i--)`) preserves left-to-right output order under LIFO popping — so the fix is behaviour-preserving for
every pattern that stays inside the budget.

**Both consumers, verified:**

| Consumer | 2.1.220 | 2.1.193 |
|---|---|---|
| `CLAUDE.md` / `@include` `paths:` | `fny` `:235627-235635`, calls `Zno(t.paths)` `:235630` | `:233770 (193)`, calls `l$t(t.paths)` |
| `SKILL.md` `paths:` | `sn_` `:438436-438443`, calls `Zno(e.paths)` `:438438` | `:451518 (193)`, calls `l$t(e.paths)` |

Both then strip a trailing `/**` and drop the whole list if it is empty or all-`**` — carryover logic,
identical in both builds.

> **Cross-reference:** `.207`'s `tengu_uncompilable_ignore_pattern` (`:224144`, site table naming
> `claudemd_rule_globs` / `skill_paths`) handles the *other* failure mode of the same field — a pattern
> that expands fine but will not compile. That one is owned by
> [`../38_permissions/rule_matching_and_glob_semantics.md`](../38_permissions/rule_matching_and_glob_semantics.md).

---

## 5. The bundled `/dataviz` skill (`.198`) and its OKLab validator (`.210`)

> `.198` — *"Added a `/dataviz` skill with a runnable color-palette validator."*
> `.210` — *"Updated the bundled dataviz skill: OKLab colour difference and recalibrated CVD thresholds."*
> `.216` — *"Updated the bundled dataviz skill (palette reorder, direct-label guidance)."*

**Verdict: NET_NEW skill; the three revisions are NOT separable with a 193 baseline.**
`dataviz` **220=6 / 193=2** (the two 193 hits are unrelated), `OKLab` **220=16 / 193=0**,
`tengu_cobalt_plinth_dataviz` **220=1 / 193=0**.

Because the whole skill arrives inside this window, `.198`, `.210` and `.216` all land in the same
end-state text and no two-bundle diff can attribute a sentence to one of them. What *is* verifiable:

**Registration** (`Oom`, `:777520-777543`). Built-in skills are declared with the shared registrar `ou`:
`name: bvo` (`:777522`, where `bvo = "dataviz"` at `:318659`), `menuDescription:
"Chart and dashboard design guidance"` (`:777523`), `userInvocable: !0` (`:777525`), and — unusually —
`files: () => Mom().then((t) => t.SKILL_FILES)` (`:777526`). It is one of the few bundled skills that ships
a **file tree**, not just a `SKILL.md`. The tree (`c8S`, `:777505-777515`) is nine entries:

```
references/anti-patterns.md   references/choosing-a-form.md   references/color-formula.md
references/components.md      references/interaction.md       references/marks-and-anatomy.md
references/palette.md         scripts/validate_palette.js     scripts/validate_palette.py
```

The last two are the *"runnable colour-palette validator"* of the `.198` bullet, and there are two of them
because the skill has to work whether the agent's chart code is JS or Python. Both are shipped as source
strings and materialised on demand.

**The validator's contract**, read from the embedded source (`:777100-777175` for the JS CLI shim, the
Python docstring at `:777259` onwards) and the skill prose (`:776231-776237`, `:776273-776283`):

- ΔE is **Euclidean distance in OKLab ×100** (`:776235-776236`), not CIE ΔE — this is the `.210` "OKLab
  colour difference" claim, present in the shipped text.
- CVD separation target **≥ 8**, floor **≥ 6**, and the 6–8 band is a WARN that is *"legal only if you also
  ship secondary encoding"* (`:776283`) — direct labels, gaps, or texture.
- CVD is simulated with **Machado–Oliveira–Fernandes 2009** for protanopia and deuteranopia; tritanopia is
  reported but not gated (`:776237`).
- Five computable checks (lightness band, chroma floor, CVD separation, normal-vision floor, WCAG contrast
  vs surface) plus two structural rules the skill enforces rather than measures (fixed hue order, values
  resolve to real ramp steps).
- Exit code discipline: `process.exit(result.ok ? 0 : 1)` at `:777146`, with argument errors exiting `2`
  (`:777125`, `:777127`, `:777131`, `:777135`, `:777142`) — a WARN band does not fail the run.
- The JS file **dual-targets**: a Node CLI guard (`process.argv[1].endsWith("validate_palette.js")`,
  `:777115`) and a browser auto-run driven by `document.body.dataset.palette` (`:777150` onwards), with the
  browser path deliberately re-implementing the CLI's enum validation so a bad `data-pairs` cannot
  *"silently downgrade to the weaker adjacent check"* (comment at `:777162`).

**The `.216` "direct-label guidance"** is visible as the secondary-encoding escape hatch woven through the
thresholds (`:776283`, `:776615`), and the *"palette reorder"* as the repeated insistence that slot
**ordering is the CVD-safety mechanism, not cosmetic** (`:776231`, `:776622`) with a stated optimisation
objective — maximise the *minimum adjacent* CVD ΔE (`:776321`).

### 5.1 The `dataviz` gate is a callout injected into a *different* skill

This is the most interesting structural detail and it is entirely undocumented:

```javascript
// ============================================
// buildDatavizCalloutForArtifactDesign - gate-controlled cross-skill pointer
// Location: cli_inner_pretty.js:772270-772289
// ============================================

// ORIGINAL (for source lookup):
function F6S() {
  if (Ke("tengu_cobalt_plinth_dataviz", !1))
    return `**When adding charts or diagrams** The craft shifts from identity to honesty — pick the form the data's shape calls for, keep encodings from exaggerating, title the finding rather than the axes. Load the \`${bvo}\` skill for the specifics; this skill continues to govern the page the chart sits in.`;
  return "";
}
function jrm() {
  ou({
    name: CBe,
    menuDescription: "Design guidance for Artifacts",
    description: N6S,
    isEnabled: mN,
    userInvocable: !0,
    async getPromptForCommand() {
      let { SKILL_MD: e } = await O6S();
      return [{ type: "text", text: Lp(e).content.trimStart().replace($6S, F6S) }];
    },
  });
}
var M6S, $6S = "<!-- dataviz-callout -->", N6S = "Design guidance and fundamentals for Artifacts.";

// READABLE (for understanding):
function buildDatavizCalloutForArtifactDesign() {
  if (getFeatureValue("tengu_cobalt_plinth_dataviz", false))
    return "**When adding charts or diagrams** … Load the `dataviz` skill for the specifics; this skill continues to govern the page the chart sits in.";
  return "";                                          // gate off → the placeholder collapses to nothing
}
function registerArtifactDesignSkill() {
  registerBuiltInSkill({
    name: ARTIFACT_DESIGN_SKILL_ID,                   // "artifact-design"
    menuDescription: "Design guidance for Artifacts",
    userInvocable: true,
    async getPromptForCommand() {
      let { SKILL_MD } = await loadArtifactDesignBundle();
      return [{ type: "text",
        text: parseFrontmatter(SKILL_MD).content.trimStart()
                .replace(DATAVIZ_CALLOUT_PLACEHOLDER, buildDatavizCalloutForArtifactDesign) }];
    },
  });
}

// Mapping: F6S→buildDatavizCalloutForArtifactDesign, jrm→registerArtifactDesignSkill,
//          Ke→getFeatureValue, CBe→ARTIFACT_DESIGN_SKILL_ID (:318657), bvo→"dataviz" (:318659),
//          $6S→DATAVIZ_CALLOUT_PLACEHOLDER, Lp→parseFrontmatter (:158070), ou→registerBuiltInSkill
```

So the `artifact-design` SKILL.md contains an HTML comment `<!-- dataviz-callout -->` that is
**string-replaced at prompt-build time** with either a cross-skill pointer or the empty string, depending
on a remote gate. This is a **skill-composition primitive** the changelog never mentions: one bundled skill
can conditionally advertise another without either file changing on disk, and the toggle is server-side.

### 5.2 The `tengu_cobalt_plinth_*` family — four undocumented Artifact capabilities

`tengu_cobalt_plinth` is **220=10 / 193=5**. It is not a skills family at all: it is the gate namespace of
the **Artifact** (published-page) module, declared as a block of thin `Ke(gate, default)` accessors at
`:381688-381716`, right below that module's export table (`MANIFEST_TOTAL_BUDGET`, `FRAME_RUNTIME_*`,
`ARTIFACT_LIST_*`, `:381680-381687`). The names are botanical, matching the codename style of
`tengu_hazel_trellis` and `tengu_saffron_anchor` (the latter sits inside the same block, `:381692`).

| Gate | Accessor | Default | 193 | What it gates (line read in 220) |
|---|---|---|---|---|
| `tengu_cobalt_plinth_fern` | `csn` `:381688` | **`!0`** | present `:415110 (193)` | master Artifact enable; also `:382106`, `:422886`, `:423116` |
| `tengu_cobalt_plinth_putguard` | `C5y` `:381712` | **`!0`** | present `:415119 (193)` | publish concurrency guard |
| `tengu_cobalt_plinth_reader_persist` | `T5y` `:381706` | `!1` | present `:415116 (193)` | reader-side persistence |
| `tengu_cobalt_plinth_direct` | — | — | present `:415162 (193)` | direct-publish path |
| **`tengu_cobalt_plinth_laurel`** | `lPs` `:381694` | `!1` | **0** | adds the `lang` (BCP-47) parameter to the Artifact tool schema — `:421599-421607` |
| **`tengu_cobalt_plinth_bracken`** | `cxo` `:381700` | `!1` | **0** | **multi-file publish**: adds the `files` array to the schema (`:421608`) and guards the publish path (`:382381`) with `multi-file publish is not enabled for this account` |
| **`tengu_cobalt_plinth_osier`** | `Abd` `:381697` | `!1` | **0** | **kill switch** on shared-scope listing — `if (r !== "mine" && Abd())` returns `scope_disabled` (`:383259-383263`). Note the inverted polarity: *true* disables. |
| **`tengu_cobalt_plinth_sedge`** | `cPs` `:381703` | `!1` | **0** | reading an artifact as a **public (non-member) reader** — `:383659-383664` |
| `tengu_cobalt_plinth_dataviz` | inline `:772274` | `!1` | **0** | the cross-skill callout of §5.1 |

**Finding:** 2.1.220 ships **four unannounced Artifact capabilities dark** — per-page language tagging,
multi-file publishing, a shared-listing kill switch, and public-reader access — all defaulting to off and
all switchable server-side without a release. Two of them (`laurel`, `bracken`) mutate the **Artifact tool's
JSON schema** at build time, so enabling them changes what the model is told the tool accepts, with no
client update. None appear in the 25-release changelog.

The odd one out is `osier`: every sibling is *enable-a-feature*, but `osier` is *disable-a-feature*. That
asymmetry is a tell — shared-scope listing is presumably already live, and the gate exists as a rollback
lever rather than a rollout lever.

---

## 6. `.205` — project verify skills rewritten every session

> *"Fixed project verify skills being rewritten on every session instead of only when a documented command
> changed."*

**Verdict: DELTA in prompt text, not code.** `Routine learnings` **220=1 / 193=0** (`:789373`);
`verify/SKILL.md` **220=3 / 193=0**; `bootstraps this repo` **220=2 / 193=0**. The `verify` skill itself
is *carryover* — `Verify that a code change actually does what` is **220=2 / 193=2** and
`run-skill-generator` is **220=6 / 193=6**.

The changed paragraph is the "Neither" arm of the bundled `verify` skill's surface-probing checklist:

```
// 2.1.193, cli_inner_pretty.js:661758-661761
- **Neither** → cold start from README/package.json/Makefile. Timebox
  ~15min. Stuck → BLOCKED with exactly where, plus a filled-in
  `/run-skill-generator` prompt. Got through → note the working
  build/launch recipe so it can become a `verifier-*` skill.
```

```
// 2.1.220, cli_inner_pretty.js:789361-789375
- **Neither** → cold start from README/package.json/Makefile. Timebox
  ~15min. Stuck → BLOCKED with exactly where, plus a filled-in
  `/run-skill-generator` prompt. Got through → **persist what you
  learned**: create `.claude/skills/verify/SKILL.md` at the level you
  probed above — repo root for a single-package repo; the touched
  package/app dir (`apps/desktop/.claude/skills/verify/SKILL.md`) in
  a monorepo where verification is per-package — capturing the
  build/launch/drive recipe that worked, so the next session skips
  this cold start. Keep it short: the commands that worked, the
  flows worth driving, any gotchas. A project verify skill already
  exists → edit it only when it steered you wrong: a documented
  command failed or turned out wrong, or a needed step it doesn't
  cover. Routine learnings don't warrant an edit, and never rewrite
  or reorganize existing content for style.
```

**Honest reading.** 2.1.193 did not write a `verify/SKILL.md` at all — it only said "note the working
recipe". The *bootstrap* capability and its *edit gate* both arrive inside this window, and with only a
`.193` baseline they cannot be separated: the `.205` bullet describes a regression introduced by a feature
that itself post-dates the baseline. What is provable is (a) the end state, (b) that the gating clause
(`Routine learnings…`, `never rewrite or reorganize existing content for style`) exists only in 220, and
(c) that the fix is **entirely prompt-level** — there is no code path that compares a skill's content
before rewriting it. The enforcement is a sentence addressed to the model.

Two smaller changes rode along in the same block: the probe list gained a per-directory level
(`ls <touched-dir>/.claude/skills/      # each dir level the diff names`, `:789351`, where 193's block at
`:661747-661749 (193)` probed only `ls .claude/skills/`), and the skill's own `description` gained
*"bootstraps this repo's project verify skill if none exists yet"* (`:789267`, echoed at `:789573`).

> `.216`'s *"Claude no longer runs the `/verify` and `/code-review` skills on its own"* touches the same
> skill but is a `disable-model-invocation` change owned by `52_code_review`.

---

## 7. `.216` — plugin skills with a `name` frontmatter field keep their plugin prefix

**Verdict: NET_NEW (three added expressions).** Not in the assignment brief but it belongs to this
pipeline, and it is a clean one-site diff in the plugin skill loader.

```javascript
// 2.1.193, cli_inner_pretty.js:474884, 474930-474932
      v = a.name != null ? String(a.name) : void 0,
      …
      userFacingName() {
        return v || e;                      // frontmatter name REPLACES the whole id -> prefix lost
      },
```

```javascript
// 2.1.220, cli_inner_pretty.js:270585-270588, 270636-270638
      C = a.name != null ? String(a.name) : void 0,
      I = e.slice(0, e.lastIndexOf(":") + 1),         // "myplugin:"  (or "" if unqualified)
      R = C ? `${I}${C}` : e,                          // "myplugin:" + frontmatter name
      H = C && !C.includes(":") ? [C] : void 0,        // bare name kept as an alias
      …
      userFacingName() {
        return R;
      },
```

The canonical `name` (`e`) is unchanged in both builds; only the *display* name was broken. 220 splits the
namespace prefix off the canonical id and re-prepends it, and registers the bare frontmatter name as an
**alias** (`aliases: H`, `:270639`) so users who had been typing `/shortname` keep working. Both halves are
needed: prefix restoration alone would have broken every existing muscle-memory invocation.

---

## 8. `.219` — the bundled `claude-api` skill defaults to Opus 5

> *"The `claude-api` skill now defaults to Claude Opus 5, with a migration path from Opus 4.8."*

**Ownership note.** This bullet was previously punted between `45_skills` and `47_models` and analysed by
neither (cycle C2 in [`../00_overview/_xval_contradictions.md`](../00_overview/_xval_contradictions.md) §2).
It is owned here: the mechanism is a *skill-loading* mechanism, and it lives entirely inside the skill
module. `47_models` owns the model catalogue this section contrasts against, but not this substitution.

**Verdict: NET_NEW data in a CARRYOVER mechanism.** The templating machinery is byte-for-byte the same
idea as 2.1.193 — `SKILL_MODEL_VARS` is **220=3 / 193=3** lines, all three of them the same three call
sites. What changed is the *contents* of the substituted table and two keys that did not exist before:

| anchor | 2.1.220 | 2.1.193 |
|---|---|---|
| `PREV_OPUS_ID` | **10 lines / 11 occurrences** | **0** |
| `PREV_OPUS_NAME` | **14 lines / 16 occurrences** | **0** |
| `SONNET_NEXT_ID` | 27 lines / 30 occurrences | 0 |
| `claude-opus-5` | 42 lines | 0 |
| `Migrating to {{OPUS_NAME}}` | 9 | 0 |
| `server-side-fallback-2026-07-01` | 10 | 0 |
| `SKILL_MODEL_VARS` | 3 | 3 |
| `CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL` | 2 | 2 |
| `tengu_claude_api_skill_loaded` | 1 | 1 |

The last three rows are the important negatives: the skill's *registration*, its *kill switch*, and its
*telemetry* are all untouched. Only the payload moved.

---

### 8.1 What the skill payload actually is

`claude-api` is not a prompt string. It is a **three-part bundle compiled into the binary** and exported
from one generated module (`ycm`), whose entire public surface is three symbols:

```javascript
// ============================================
// claudeApiSkillBundle - the three compiled-in halves of the claude-api skill
// Location: cli_inner_pretty.js:799547
// ============================================

// ORIGINAL (for source lookup):
tt(ycm, { SKILL_PROMPT: () => ZzS, SKILL_MODEL_VARS: () => QzS, SKILL_FILES: () => eKS });

// READABLE (for understanding):
defineLazyExports(claudeApiSkillBundle, {
  SKILL_PROMPT:     () => skillPromptMarkdown,   // the top-level SKILL.md body
  SKILL_MODEL_VARS: () => skillModelVars,        // {{PLACEHOLDER}} -> literal model id / display name
  SKILL_FILES:      () => skillDocFiles,         // 63 doc paths -> compiled-in markdown strings
});

// Mapping: tt→defineLazyExports, ycm→claudeApiSkillBundle, ZzS→skillPromptMarkdown,
//          QzS→skillModelVars, eKS→skillDocFiles
```

`SKILL_FILES` (`eKS`, `:799633-799697`) is a flat path→string map of **63 markdown documents** keyed by
their original repo paths — `python/claude-api/README.md`, `go/claude-api/tool-use.md`,
`shared/model-migration.md`, `shared/prompt-caching.md`, and so on. Every value is another compiled-in
string constant. Nothing is read from disk and nothing is fetched; the skill is a fully offline
documentation corpus, which is the whole point of its trigger text (`:799887`): *"the user asks about an
LLM (pricing/model choice/limits/caching) — **never answer from memory**"*. The bundle exists precisely
because the model's own weights are stale about Anthropic's newest models.

Registration is a plain skill registration, gated by an env kill switch (`:801763`, **2 / 2 carryover**):

```javascript
// ============================================
// registerClaudeApiSkill - registers the bundled claude-api skill
// Location: cli_inner_pretty.js:799796-799815 (gate at :801763)
// ============================================

// ORIGINAL (for source lookup):
function lKS() {
  ou({
    name: "claude-api",
    menuDescription: "Build and debug apps that use the Claude API",
    description: Acm,
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    userInvocable: !0,
    files: () => bcm().then(rKS),
    async getPromptForCommand(e) {
      let [t, r] = await Promise.all([oKS(), bcm()]);
      return (
        O("tengu_claude_api_skill_loaded", { detected_lang: fe(t ?? "none"), subcommand: wcm(e), has_args: e.trim().length > 0 }),
        [{ type: "text", text: sKS(t, e, r) }]
      );
    },
  });
}
// gate, :801763:
  if ((t(), !Yt(process.env.CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL))) { let { registerClaudeApiSkill: o } = (Ccm(), en(Tcm)); o(); }

// READABLE (for understanding):
function registerClaudeApiSkill() {
  registerBuiltinSkill({
    name: "claude-api",
    menuDescription: "Build and debug apps that use the Claude API",
    description: CLAUDE_API_SKILL_DESCRIPTION,
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    userInvocable: true,
    files: () => loadSkillBundle().then(substituteAllSkillFiles),   // <- table applied to all 63 docs
    async getPromptForCommand(argsText) {
      let [detectedLang, bundle] = await Promise.all([detectProjectLanguage(), loadSkillBundle()]);
      logEvent("tengu_claude_api_skill_loaded", {
        detected_lang: redact(detectedLang ?? "none"),
        subcommand: matchSubcommand(argsText),
        has_args: argsText.trim().length > 0,
      });
      return [{ type: "text", text: buildClaudeApiSkillPrompt(detectedLang, argsText, bundle) }];
    },
  });
}

// Mapping: lKS→registerClaudeApiSkill, ou→registerBuiltinSkill, Acm→CLAUDE_API_SKILL_DESCRIPTION,
//          bcm→loadSkillBundle, rKS→substituteAllSkillFiles, oKS→detectProjectLanguage,
//          wcm→matchSubcommand, sKS→buildClaudeApiSkillPrompt, O→logEvent, fe→redact,
//          Yt→parseBooleanEnv, e→argsText, t→detectedLang, r→bundle
```

Language detection (`oKS`, `:799715-799731`) is a single `readdir` of the cwd matched against a
literal extension/filename table (`nKS`, `:799876-799884`: `python` → `.py`/`requirements.txt`/
`pyproject.toml`/`setup.py`/`Pipfile`, `typescript` → `.ts`/`.tsx`/`tsconfig.json`/`package.json`, …).
`curl: []` is the deliberate empty entry — it can never be auto-detected, only chosen. On `readdir`
failure the function returns `null` rather than throwing, and `sKS` then embeds **all 63** docs instead
of the language subset. That is the same fail-open posture catalogued for the rest of this module: a
detection failure degrades to a larger prompt, never to a missing skill.

---

### 8.2 The substitution is textual, at load time, and fails open

**What it does:** rewrites every `{{PLACEHOLDER}}` in a compiled-in markdown string into a concrete model
id or display name, after first deleting all HTML comments.

```javascript
// ============================================
// processSkillMarkdown - comment-strip to fixpoint, then {{VAR}} substitution
// Location: cli_inner_pretty.js:799732-799738 (+ :799710-799714, :799739-799741)
// ============================================

// ORIGINAL (for source lookup):
function ucl(e, t) {
  let r = e,
    n;
  do ((n = r), (r = r.replace(/<!--[\s\S]*?-->\n?/g, "")));
  while (r !== n);
  return ((r = r.replace(/\{\{(\w+)\}\}/g, (o, i) => t[i] ?? o)), r);
}
function rKS(e) {
  let t = {};
  for (let [r, n] of Object.entries(e.SKILL_FILES)) t[r] = ucl(n, e.SKILL_MODEL_VARS);
  return t;
}
function vcm(e, t) {
  return ucl(e, t.SKILL_MODEL_VARS);
}

// READABLE (for understanding):
function processSkillMarkdown(markdown, modelVars) {
  let current = markdown, previous;
  do {                                                     // strip HTML comments to a FIXPOINT
    previous = current;
    current = current.replace(/<!--[\s\S]*?-->\n?/g, "");
  } while (current !== previous);
  return current.replace(/\{\{(\w+)\}\}/g,
    (whole, key) => modelVars[key] ?? whole);              // unknown key -> emit the {{KEY}} verbatim
}
function substituteAllSkillFiles(bundle) {                 // eager pass over all 63 docs
  let out = {};
  for (let [path, markdown] of Object.entries(bundle.SKILL_FILES))
    out[path] = processSkillMarkdown(markdown, bundle.SKILL_MODEL_VARS);
  return out;
}
function substituteOneSkillFile(markdown, bundle) {
  return processSkillMarkdown(markdown, bundle.SKILL_MODEL_VARS);
}

// Mapping: ucl→processSkillMarkdown, rKS→substituteAllSkillFiles, vcm→substituteOneSkillFile,
//          e→markdown/bundle, t→modelVars/bundle, r→current, n→previous, o→whole, i→key
```

**How it works:**

1. **Comment stripping runs first, and to a fixpoint.** The regex `<!--[\s\S]*?-->\n?` is non-greedy, so
   one pass over `<!-- a <!-- b --> c -->` leaves the trailing ` c -->` behind. The `do…while (r !== n)`
   loop re-runs until a pass changes nothing. This is also why authoring comments in the source markdown
   (`<!-- TODO: update on next launch -->`) cost zero prompt tokens at runtime.
2. **Substitution runs second, on the comment-free text.** The ordering is load-bearing in one direction
   only: a `{{VAR}}` sitting *inside* an HTML comment is deleted before it can be substituted, so a
   commented-out block never leaks a model id. Reversing the two steps would let a substituted value that
   happened to contain `-->` unbalance a comment and truncate real content.
3. **The key pattern is `\w+`.** No dots, no indexing, no expression syntax — the table can only be
   consulted by flat identifier. There is no template *language* here and therefore no evaluation surface.
4. **Unknown keys fall through verbatim** (`t[i] ?? o` returns the whole `{{KEY}}` match, not `undefined`).
   A typo'd placeholder ships to the model as the literal string `{{OPPUS_ID}}` — visibly wrong to a reader
   and to a doc reviewer, rather than silently producing `model="undefined"` in generated code.
5. **Two entry points, one eager and one lazy.** `substituteAllSkillFiles` (`:799710`) is wired to the
   skill's `files:` accessor and rewrites all 63 documents at once; `substituteOneSkillFile` (`:799739`)
   is called per-document by the `<doc path=…>` wrapper (`Scm`, `:799742-799754`) and by the SKILL.md
   prompt builder (`sKS`, `:799755`). Substitution therefore happens **at skill-load time on every
   invocation**, not once at startup and not at build time.

**Why this approach:** the alternative — baking `claude-opus-5` directly into 63 markdown files — would
mean a model launch touches every document in the corpus, with a real chance of missing one and shipping a
skill that recommends two different models in two different files. A single table makes the launch edit
**exactly one object literal**, and makes internal consistency a structural property rather than a review
task. The cost is that the docs are no longer readable as plain markdown in the source tree, and that the
substituted values cannot depend on anything the client knows at runtime — see §8.4.

**Key insight:** substitution being *textual and fail-open* is what makes the one-table design safe. The
regex cannot fail, cannot throw, and cannot produce a malformed document; the worst outcome of a bad table
is a visible `{{KEY}}` in the prompt. That is the same failure-direction discipline this module documents
for the brace expander (§4) and the `$N` substituter (§3) — when the guard can't do its job, emit the input
unchanged rather than a wrong answer.

---

### 8.3 The table diff: a one-deep generational ring

This is the whole of the `.219` change. The 2.1.193 table had **11 keys**; 2.1.220 has **15**.

```javascript
// ============================================
// skillModelVars - the claude-api skill's {{VAR}} substitution table
// Location: cli_inner_pretty.js:799615-799631  (2.1.193: :671821-671833)
// ============================================

// ORIGINAL (for source lookup) — 2.1.193, cli_inner_pretty.js:671821-671833 (193):
  ((Esm = {
    FABLE_ID: "claude-fable-5",
    FABLE_NAME: "Claude Fable 5",
    MYTHOS_ID: "claude-mythos-5",
    MYTHOS_NAME: "Claude Mythos 5",
    OPUS_ID: "claude-opus-4-8",
    OPUS_NAME: "Claude Opus 4.8",
    SONNET_ID: "claude-sonnet-4-6",
    SONNET_NAME: "Claude Sonnet 4.6",
    HAIKU_ID: "claude-haiku-4-5",
    HAIKU_NAME: "Claude Haiku 4.5",
    PREV_SONNET_ID: "claude-sonnet-4-5",
  }),

// ORIGINAL (for source lookup) — 2.1.220, cli_inner_pretty.js:799615-799631:
  ((QzS = {
    FABLE_ID: "claude-fable-5",
    FABLE_NAME: "Claude Fable 5",
    MYTHOS_ID: "claude-mythos-5",
    MYTHOS_NAME: "Claude Mythos 5",
    OPUS_ID: "claude-opus-5",
    OPUS_NAME: "Claude Opus 5",
    PREV_OPUS_ID: "claude-opus-4-8",
    PREV_OPUS_NAME: "Claude Opus 4.8",
    SONNET_ID: "claude-sonnet-5",
    SONNET_NAME: "Claude Sonnet 5",
    SONNET_NEXT_ID: "claude-sonnet-5",
    SONNET_NEXT_NAME: "Claude Sonnet 5",
    HAIKU_ID: "claude-haiku-4-5",
    HAIKU_NAME: "Claude Haiku 4.5",
    PREV_SONNET_ID: "claude-sonnet-4-6",
  }),

// READABLE (for understanding):
const skillModelVars = {
  // current generation
  OPUS_ID:   "claude-opus-5",     OPUS_NAME:   "Claude Opus 5",      // 193 had opus-4-8 here
  SONNET_ID: "claude-sonnet-5",   SONNET_NAME: "Claude Sonnet 5",    // 193 had sonnet-4-6 here
  HAIKU_ID:  "claude-haiku-4-5",  HAIKU_NAME:  "Claude Haiku 4.5",   // unchanged
  FABLE_ID:  "claude-fable-5",    FABLE_NAME:  "Claude Fable 5",     // unchanged
  MYTHOS_ID: "claude-mythos-5",   MYTHOS_NAME: "Claude Mythos 5",    // unchanged
  // one generation back — NEW slot for Opus, shifted value for Sonnet
  PREV_OPUS_ID:   "claude-opus-4-8",  PREV_OPUS_NAME: "Claude Opus 4.8",  // == 193's OPUS_*
  PREV_SONNET_ID: "claude-sonnet-4-6",                                    // == 193's SONNET_ID
  // forward pointer, currently collapsed onto the current generation
  SONNET_NEXT_ID: "claude-sonnet-5",  SONNET_NEXT_NAME: "Claude Sonnet 5",
};

// Mapping: Esm→skillModelVars (193), QzS→skillModelVars (220)
```

**The rule the diff reveals:** on a model launch the outgoing generation's values are not deleted, they are
**demoted one slot**. `PREV_OPUS_ID`/`PREV_OPUS_NAME` in 2.1.220 hold *literally the strings that
`OPUS_ID`/`OPUS_NAME` held in 2.1.193*, and `PREV_SONNET_ID` moved from `claude-sonnet-4-5` to
`claude-sonnet-4-6` — 193's `SONNET_ID` — by the same shift. The table is a **one-deep generational ring
buffer** per family: current + exactly one predecessor, no deeper history. Anything older than one
generation is written as a literal in the prose (`:797089` mentions `Opus 4.7` and `:798514` names
`Claude Opus 4.5, Claude Opus 4.1` inline), which is precisely how you can tell the ring is one deep by
design and not merely under-populated.

`SONNET_NEXT_ID`/`SONNET_NEXT_NAME` (**27 lines / 0**) is the mirror-image slot: a *forward* pointer,
currently collapsed onto `SONNET_ID`. It exists so that documentation which needs to say "the next Sonnet"
can be written once and re-aimed by a table edit — the same launch-cost argument as §8.2, applied
pre-emptively. Right now it is a no-op alias, which is exactly what you would expect immediately after
`.197` shipped Sonnet 5.

---

### 8.4 What `PREV_OPUS_*` is actually for — three roles, only one of which is migration

The bullet calls it *"a migration path from Opus 4.8"*, which undersells it. Reading all 14 lines carrying
`PREV_OPUS_NAME` plus the 10 carrying `PREV_OPUS_ID` shows **three distinct jobs**:

**1. A live fallback routing target — not prose at all.** `:790890` is inside a code example the skill
tells the model to emit:

```
    "fallbacks": [{"model": "{{PREV_OPUS_ID}}"}],
```

and `:797101` explains why: *"Handle `stop_reason: "refusal"` before reading `content`, and opt into
`fallbacks: "default"` (`server-side-fallback-2026-07-01`) rather than pinning a model — cyber-category
refusals route to {{PREV_OPUS_NAME}}"*. Opus 5 ships with safety classifiers that can decline with
`stop_reason: "refusal"` on an HTTP 200 (`:796871`), and the previous Opus is the **recommended fallback
model** for those declines. So `PREV_OPUS_ID` is substituted into code that will actually run in the
user's application. This is the role that makes a stale value dangerous rather than merely untidy.

**2. A migration baseline.** `:796871` — *"{{OPUS_NAME}} is the successor to {{PREV_OPUS_NAME}} in the
Opus line"* — heads a `Migrating to {{OPUS_NAME}}` section (**9 / 0**) whose checklist is written entirely
as a *diff against the predecessor*: `:797089` says the cache minimum *"drops to 512 tokens (from 1024 on
Opus 4.8)"*, that Opus 5 *"delegates more readily than Opus 4.8 — remove any 'delegate more' guidance you
added for 4.8"*, and that its rate limits are *"a separate bucket from the combined Opus 4.x pool"*. The
predecessor is the frame of reference for every `[TUNE]` item; without a `PREV_OPUS_*` slot that section
could not be written generationally at all. Note it also chains: *"(only if coming from Opus 4.7 or
earlier) apply the **Migrating to Opus 4.7** breaking changes first"* — that older section is **8 / 7
carryover**, i.e. the corpus keeps prior migration sections and stacks the new one on top rather than
replacing it.

**3. A support-matrix floor.** `:796803` — *"No beta header is required; available on
{{PREV_OPUS_NAME}}"* — and `:798514` — *"**Supported models:** {{FABLE_NAME}}, {{OPUS_NAME}},
{{PREV_OPUS_NAME}}, {{SONNET_NAME}}, and {{HAIKU_NAME}}"*. Here `PREV_OPUS` names a model that is still
**current and supported**, letting a capability be described as available across both generations without
hard-coding either.

**Why this approach:** roles 1 and 3 are why the pair could not simply be a literal `"Claude Opus 4.8"` in
the prose. A literal would be correct today and silently wrong at the next Opus launch, in a document that
tells users what to put in production `fallbacks`. Binding it to a table slot means the next launch's
demotion fixes the fallback advice, the migration baseline, and the support matrix **in one edit**, in
lockstep, with no possibility of one of the three being missed.

**Key insight:** `PREV_OPUS_*` is not a "migration source" — it is a *generic one-generation-back
reference*, and the fallback role means it is closer to runtime configuration than to documentation. That
also means it inherits the substitution's blind spot, which is the next section.

---

### 8.5 The blind spot: the table is a constant, the `opus` alias is provider-dependent

`skillModelVars` is a frozen object literal. It takes no arguments, consults no settings, and knows
nothing about which provider the session is talking to. But the model catalogue's alias table
(`:14461-14486`, read in 2.1.220) resolves `opus` **per provider**:

```javascript
// ============================================
// modelCatalogAliases - the runtime `opus`/`sonnet` alias resolution, per provider
// Location: cli_inner_pretty.js:14461-14486
// ============================================

// ORIGINAL (for source lookup):
    aliases: {
      opus: {
        default: "claude-opus-5",
        per_provider: {
          bedrock: "claude-opus-5",
          vertex: "claude-opus-5",
          foundry: "claude-opus-4-6",
          mantle: "claude-opus-5",
          anthropic_aws: "claude-opus-5",
          gateway: "claude-opus-4-7",
        },
      },
      sonnet: { default: "claude-sonnet-5", per_provider: { bedrock: "claude-sonnet-4-5", … } },
      haiku: { default: "claude-haiku-4-5" },
      fable: { default: "claude-fable-5" },
    },

// READABLE (for understanding):
const modelCatalogAliases = {
  opus: {
    default: "claude-opus-5",
    perProvider: {
      bedrock: "claude-opus-5", vertex: "claude-opus-5", mantle: "claude-opus-5",
      anthropicAws: "claude-opus-5",
      foundry: "claude-opus-4-6",     // <-- two generations behind the skill's OPUS_ID
      gateway: "claude-opus-4-7",     // <-- one generation behind, and behind PREV_OPUS_ID too
    },
  },
  // …
};

// Mapping: per_provider→perProvider, anthropic_aws→anthropicAws
```

**What happens on Foundry or a gateway.** The skill emits `model="claude-opus-5"` regardless — the
substitution has no provider input. On **Foundry** the `opus` alias is `claude-opus-4-6`, so *neither*
`OPUS_ID` (`claude-opus-5`) *nor* `PREV_OPUS_ID` (`claude-opus-4-8`) is what that provider serves; the
back-reference is itself **two generations ahead** of Foundry's current Opus. On **gateway** the alias is
`claude-opus-4-7`, again behind both slots. So on those two providers the skill's primary recommendation
*and* its refusal-fallback recommendation both name model ids the caller's provider does not resolve.

Two things bound the damage, and they are worth stating precisely rather than hand-waving:

- The skill documents the **Claude API / Anthropic SDK**, and its own text repeatedly scopes features by
  provider — `:797089` says fast mode *"is Claude-API-only — drop it on Bedrock, Google Cloud, and
  Foundry routes"*. It is written for first-party API code, where `default: "claude-opus-5"` is right.
- The skill's ids are advice about the *user's application*, not about the Claude Code session's own
  model. Nothing in `processSkillMarkdown` feeds the agent loop's model selection.

But the mismatch is real for a Foundry or gateway user asking this skill to write their code, and it is a
**structural** consequence of the design in §8.2: a constant table cannot express a provider-dependent
value. The two tables are maintained independently — one is a build-validated generated catalogue
(`generate:model-catalog`, see [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md)
§6.5), the other a hand-written 15-key literal in the skill module — and nothing checks them against each
other.

**Fast-mode pricing (corrected).** `:797089` also advertises fast mode as `speed: "fast"`,
`fast-mode-2026-02-01`, **$10/$50**. An earlier pass in this tree claimed there was no fast-mode pricing in
the client; that claim is **RETRACTED**. `Dji` (`:109772-109784`) short-circuits the catalogue tier lookup:

```javascript
function Dji(e, t) {                                                    // :109772-109784
  let r = lo(e);
  if (t.speed === "fast") {
    if (r === "claude-opus-4-8" || r === "claude-opus-5") return a7n;   // a7n :109843-109850
    if (r === "claude-opus-4-6" || r === "claude-opus-4-7") return UIc;
  }
  …
}
// a7n = { inputTokens: 10, outputTokens: 50, promptCacheWriteTokens: 12.5,
//         promptCacheWrite1hTokens: 20, promptCacheReadTokens: 1, webSearchRequests: 0.01 }
```

so the skill's `$10/$50` matches `a7n` exactly. Use the account in `_GROUND_TRUTH` §6.5; do not repeat the
retracted "under-reported by ~2×" claim. Note the branch fires only for `claude-opus-4-8` and
`claude-opus-5` — the same two ids as `OPUS_ID` and `PREV_OPUS_ID`, which is a third independent place the
generation pair is hard-coded and a third place the next launch has to be remembered.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_skills_plugins.md](../00_overview/symbol_additions_v2_1_220_skills_plugins.md).

Key functions in this document:
- `peelStackedPromptCommands` (`tpd`, `:343833`) - the `.199` stacked-skill peeler; cap `MAX_STACKED_COMMANDS` (`epd`, `:344087`) = 5
- `elideDuplicateSkillInvocation` (`ZNy`, `:346748`) - the `.202` four-branch re-invocation elider
- `findPriorSkillContent` (`S0o`, `:346523`) - body-vs-attachment locator that picks the pointer wording
- `metaTextOf` (`eRs`, `:346513`) - meta-message text extractor
- `substituteCommandArguments` (`vct`, `:237706`) - `$ARGUMENTS` / `$N` substitution; the `.210` fix at `:237727`/`:237732`/`:237743`
- `expandPathsFrontmatter` (`Zno`, `:158136`) / `splitAndExpand` (`bru`, `:158139`) / `expandBracePatterns` (`BIg`, `:158159`) - the `.217` budget-bounded expander
- `readClaudeMdPathsFrontmatter` (`fny`, `:235627`) / `readSkillPathsFrontmatter` (`sn_`, `:438436`) - its two consumers
- `registerDatavizSkill` (`Oom`, `:777520`) - `/dataviz` registration with a nine-file bundle
- `buildDatavizCalloutForArtifactDesign` (`F6S`, `:772270`) - gate-driven cross-skill callout injection
- `isArtifactMultiFilePublishEnabled` (`cxo`, `:381700`) / `isArtifactLangParamEnabled` (`lPs`, `:381694`) / `isArtifactSharedScopeListingDisabled` (`Abd`, `:381697`) / `isArtifactPublicReadEnabled` (`cPs`, `:381703`) - the four dark Artifact gates
- `buildPluginSkillCommand` display-name fix - `:270585-270588`, `:270636-270638`
- `processSkillMarkdown` (`ucl`, `:799732-799738`) - the `.219` `{{VAR}}` substituter; comment-strip to fixpoint, then fail-open `\w+` replacement
- `skillModelVars` (`QzS`, `:799615-799631`) - the 15-key model table; 2.1.193's 11-key twin is `Esm` `:671821-671833 (193)`
- `skillPromptMarkdown` (`ZzS`, `:799632`) / `skillDocFiles` (`eKS`, `:799633-799697`) - the SKILL.md body and the 63-document offline corpus
- `substituteAllSkillFiles` (`rKS`, `:799710-799714`) / `substituteOneSkillFile` (`vcm`, `:799739-799741`) - the eager and per-document substitution entry points
- `wrapDocsWithPathTags` (`Scm`, `:799742-799754`) / `buildClaudeApiSkillPrompt` (`sKS`, `:799755`) - `<doc path=…>` assembly and prompt construction
- `registerClaudeApiSkill` (`lKS`, `:799796-799815`) - registration; kill switch `CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL` `:801763`
- `detectProjectLanguage` (`oKS`, `:799715-799731`) / language table (`nKS`, `:799876-799884`) - cwd `readdir` heuristic, `null` on failure
- `claudeApiSkillBundle` (`ycm`, `:799546-799547`) / `loadSkillBundle` (`bcm`, `:799707-799709`) - the lazy module and its memoised loader
- `CLAUDE_API_SKILL_DESCRIPTION` (`Acm`, `:799886-799893`) / `matchSubcommand` (`wcm`, `:799793`) - trigger text and the `["migrate","managed-agents-onboard"]` subcommand list (`aKS`, `:799894`)
- `modelCatalogAliases` (`:14461-14486`) - provider-dependent `opus`/`sonnet` resolution the skill table cannot see
- `resolveModelPricing` (`Dji`, `:109772-109784`) / `fastModeOpusPricing` (`a7n`, `:109843-109850`) - the fast-mode `$10/$50` override (corrects the retracted claim; see `_GROUND_TRUTH` §6.5)
