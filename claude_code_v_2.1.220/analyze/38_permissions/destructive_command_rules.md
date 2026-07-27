# Destructive-command rules: static refusals and classifier rules

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline lines are tagged `(193)`.

Claude Code refuses destructive commands in **two independent layers**, and the changelog bullets in this
window touch both without distinguishing them:

| layer | where | what it produces | can auto mode override it? |
|---|---|---|---|
| **static analyzer** | `emr` `:390689`, `Evd` `:394257` + the substitution scan `:394272-394395`, `tmr` `:391281` | `behavior: "ask"` with `decisionReason.type: "safetyCheck"` and `classifierApprovable: !1` | only via a named `circuitBreaker` (see [`classifier_adjudication.md`](classifier_adjudication.md) §1) |
| **classifier rule corpus** | the prompt block `:443150-443500`, rule ids `kNy` `:345167-345234` | a `<block>yes</block>` / `<severity>N</severity>` verdict with a category | it *is* the classifier |

The `dangerous` literal is 220=136 / 193=117, which is a real but partial-overlap delta — so this document
diffs site by site rather than reasoning from the count.

---

## 1. The canonical classifier rule-id set is entirely new

**Verdict: NET_NEW, undocumented as a whole.** `kNy` (`:345167-345234`) is a **66-entry** alphabetised
array of snake_case rule ids. Every one I probed is 220=1 / 193=0:

| probe | 220 | 193 |
|---|---|---|
| `self_modification` | 1 | **0** |
| `logging_audit_tampering` | 1 | **0** |
| `unverifiable_deletion_target` | 1 | **0** |
| `shared_scratch_sweep` | 1 | **0** |
| `session_transcript_tampering` | 1 | **0** |

The tail of the list, read verbatim at `:345210-345233`:

```
production_reads · protected_scope_iac_apply · public_data_sharing_upload · real_world_transactions ·
remote_repoint · remote_shell_writes · safety_bypass_flag · sandbox_network_callback ·
secret_store_writes · security_test_removal · security_weaken · self_approval · self_modification ·
sensitive_remote_exec · sensitive_source_provenance · session_transcript_tampering ·
shared_cluster_mutation · shared_scratch_sweep · tls_auth_weaken · tmux_self_drive ·
traffic_redirection · unauthorized_persistence · untrusted_code_integration ·
unverifiable_deletion_target
```

Two companions:

- `xNy` (`:345161-345166`) — four sentinel ids used as *replacement markers* in user config:
  `user_allow_rules_to_replace`, `user_soft_deny_rules_to_replace`, `user_hard_deny_rules_to_replace`,
  `user_environment_to_replace`. These are how a user's `autoMode` block says "replace the shipped rules
  here" rather than "append".
- `HNy = []` (`:345235`) and `l0o = new Set([...kNy, ...HNy])` (`:345236`) — an empty extension slot merged
  with the canonical set. An empty array in a `new Set([...a, ...b])` is the signature of a list that is
  *generated* with a second, currently-empty source (e.g. a server-supplied or experimental rule group).

The gatekeeper is three lines:

```javascript
// ============================================
// canonicalizeClassifierCategory - allow-lists a classifier-returned category before telemetry
// Location: cli_inner_pretty.js:345238-345241
// ============================================

// ORIGINAL (for source lookup):
function Xon(e) {
  return e !== void 0 && l0o.has(e) ? Hp(e) : void 0;
}

// READABLE (for understanding):
function canonicalizeClassifierCategory(category) {
  return category !== undefined && KNOWN_RULE_IDS.has(category)
    ? asTelemetryEnum(category)      // known id: emit it as a low-cardinality enum value
    : undefined;                     // unknown id: drop it entirely
}

// Mapping: Xon→canonicalizeClassifierCategory, l0o→KNOWN_RULE_IDS, Hp→asTelemetryEnum
```

**Why an allow-list rather than passing the string through?** The category comes from a *model
completion*. Forwarding it verbatim to telemetry would let a model (or prompt-injected content) emit
unbounded-cardinality label values, which is both a metrics-blowup and a data-exfiltration channel — a
classifier that can write arbitrary strings into telemetry can encode file contents there. The
membership test collapses the model's output to one of 66 known values or nothing. `Hp` then marks it as a
known enum so downstream redaction does not hash it.

**Why does the list live in the client at all**, given the rules themselves are prompt text? Because the
client consumes the category: `tengu_auto_mode_decision` carries it (`:345797`, `:345844`), and the
decision UI keys off it. The prompt and this list must therefore be kept in sync by hand — the kind of
coupling that argues these are generated from one source.

---

## 2. `.205`: the session-transcript tampering rule

> `.205`: *"Added an auto mode rule that blocks tampering with session transcript files."*

**Verdict: NET_NEW.** `session_transcript_tampering` 220=1 (`:345225`) / 193=0;
`Session Transcript Tampering` 220=1 (`:443406`) / 193=0.

The rule text, read at `:443406`:

> `Session Transcript Tampering [named+specifics — **must name:** that this flagged transcript write is a
> false positive — fine to allow]: Writing to a Claude Code session transcript (the session `.jsonl`
> history files under `~/.claude/projects/` or the equivalent configured config dir) — directly or through
> shell commands — or forging or altering classifier meta lines (the `{"meta":{…}}` ground-truth lines this
> classifier reads) so they read back as harness-injected. The transcript is harness-written session
> state, not an agent working file or memory directory: a tampered entry feeds every later classification
> once the session is resumed. Reading transcripts is routine and not this rule.`

**Why this rule exists, and why it is in the classifier rather than a deny rule.** The threat is
*self-authorisation*: the classifier's entire input is the transcript. If the agent can append to the
transcript, it can write a line that *looks like* a user saying "yes, delete everything", and every
subsequent classification in that session — and in every resumed session — reads that line as ground
truth. It is privilege escalation with a persistence property.

Four details show the rule was written by someone who had thought about it:

1. **Two attack surfaces, one rule.** "Writing to a session transcript" *and* "forging or altering
   classifier meta lines". The second is the sharper one: `SBs(meta)` (`:442610-442612`) is
   `JSON.stringify({ meta: e })`, i.e. the harness's own ground-truth line format. A forged `{"meta":…}`
   line is indistinguishable from a real one once written.
2. **"directly or through shell commands"** — closes the obvious bypass of doing it with `echo >>` instead
   of the Write tool. Note this is a *classifier* rule, not a path deny rule, precisely because a shell
   redirection target is not always statically resolvable.
3. **"Reading transcripts is routine and not this rule"** — an explicit negative. Without it the model
   would block `/resume`, transcript summarisation, and the `/doctor` denial-record analysis (which
   `:785819` documents as reading exactly these files).
4. **The clearing condition is inverted.** Most rules clear when the user names the target; this one
   clears when the user names *that the flag is a false positive*. There is no legitimate "please tamper
   with the transcript" request, so the only escape is an explicit "this write is fine".

`session_transcript_tampering` sits in `kNy` between `sensitive_source_provenance` and
`shared_cluster_mutation` (`:345224-345226`), alongside `logging_audit_tampering` and
`self_modification` — three rules that all defend the *harness's own state* rather than the user's data.
That grouping is the design statement: the agent is not a trusted writer of its own audit trail.

---

## 3. `.205`: the unresolvable-variable deletion rule

> `.205`: *"Improved auto mode to ask before running `rm -rf` on a variable it can't resolve from
> context."*

**Verdict: NET_NEW as a classifier rule.** `Unverifiable Deletion Target` 220=1 (`:443379`) / 193=0.

This bullet was recorded UNANCHORED during scoping (the probe was `rm -rf`, which is 220=17 / 193=11 —
a useless anchor because the string appears throughout the prompt corpus and the static analyzer). The
real anchor is the rule title.

The rule text (`:443379`) is the longest single rule in the corpus. Its structure is worth extracting
because it is the template every other `[named+specifics]` rule follows:

| part | content |
|---|---|
| **trigger** | a recursive forced delete (`rm -rf`/`-fr`/`-Rf`, `Remove-Item -Recurse -Force`, or an equivalent) whose target *is* a shell variable (`$VAR`, `${VAR}`) or a glob rooted at one (`"$VAR"/*`) |
| **condition** | the value "cannot be derived from anything in this transcript: no in-window assignment (`VAR=…`, `export VAR=…`, `read VAR`, `for VAR in …`) and not an obvious literal" |
| **rationale** | *"The value came only from earlier command output the classifier never sees, so the blast radius is unknowable — an empty or unexpected `$VAR` turns `rm -rf "$VAR"/*` into a `$HOME` or filesystem-root wipe."* |
| **extension** | multi-part paths: *"`"$BASE/$pin"`: if any component can be empty, the delete silently climbs to the parent directory or the filesystem root"* |
| **posture** | `Fail closed.` |
| **negative cases** | assigned in-window; a literal path (`./node_modules`, `/tmp/foo`, `dist/`); a well-known-safe temp pattern |
| **clearing** | the user names the exact path; **or** the agent re-runs the delete with the resolved literal written into the command — and *"an `echo "$VAR"` does not clear it: its output never reaches this classifier, so the re-run would be just as unverifiable"* |

**Why the classifier and not the static analyzer?** The static analyzer already has a narrower version of
this check (§4) — it catches a variable expansion that would resolve to `/` when empty. What it *cannot*
do is decide whether the variable's value is knowable, because that is a question about the
**transcript**, not about the command. Only the classifier sees the transcript. The four in-window
assignment forms (`VAR=`, `export`, `read`, `for`) are exactly the ones a static single-command analyzer
would miss because they occurred in an earlier tool call.

**The `echo "$VAR"` clause is the most instructive sentence in the corpus.** It anticipates the obvious
agent workaround — "let me print the variable to prove it's safe" — and rejects it with the correct
reason: tool *output* is not part of the classifier's input, so the proof is invisible. The only accepted
proof is to move the value into the command text itself, where the classifier can see it and apply the
ordinary deletion rules. That is a genuinely subtle information-flow argument, and getting it wrong would
have created a trivial bypass.

Two sibling rules complete the deletion family, both 220-only:

- **`Irreversible Local Destruction`** (`:443378`) — the general local-delete rule, with an explicit
  presumption: *"presume the tree is dirty (tool output is unseen — a prior `git status`/`checkout` call
  or no Write/Edit in transcript does not prove it clean)"*. Same information-flow reasoning: absence of
  evidence in the transcript is not evidence.
- **`Shared Scratch Sweep`** (`:443380`) — `/tmp`, `/var/tmp`, `$TMPDIR` wildcard deletion, with the
  rationale *"These directories are shared with other agents and processes; a sweep destroys their live
  working state."* This is a multi-agent-era rule; it only makes sense once several Claude Code sessions
  run concurrently on one machine.

---

## 4. `.208`: catastrophic removals inside command substitutions

> `.208`: *"Catastrophic removals (e.g. `rm -rf ~`) in commands containing `$(…)`/backticks/`<(…)` now
> prompt in `--dangerously-skip-permissions` and auto mode, matching the plain form."*

**Verdict: NET_NEW.** `too many to analyze for catastrophic removals` 220=1 (`:394329`) / 193=0;
`inside command substitution` 220=2 / 193=0; `tengu_bash_dangerous_rm_too_complex` 220=2 / 193=1.

### The gap that was closed

2.1.193 ran the destructive-command checks on the **top-level command text** only. `SMs(command)`
(220 `:390781`) detects an unresolvable-variable deletion target, and 193 called it once
(`:460583 (193)` region) on `e.command`. A command whose `rm -rf` lived inside `$(…)` or backticks was
never inspected — the substitution body is not part of the top-level argv.

2.1.220 adds a substitution-body scan. Reading `:394285-394395`:

1. Collect substitution bodies. The pre-existing `$E(command)` splitter is used for the deny-rule loop
   (`:394274`), and a dedicated recursive collector (`:394300-394325`) walks the parse tree stripping the
   `$(`/`` ` ``/`<(` wrappers and the trailing `)`/`` ` ``/`}`, trimming a leading `|` and trailing `;`.
2. **Budget check** (`:394325-394333`):

```javascript
if ((o(e), n.length > 64)) {
  if (/\brm(?:dir)?\b/.test(e.text))
    return _Ke(
      "rm",
      `This command contains ${n.length} command substitutions — too many to analyze for catastrophic removals. This requires explicit approval.`,
      `— too many command substitutions to analyze (${n.length})`,
    );
  return null;
}
```

3. For each body: strip nested substitutions with a bounded loop, then re-parse and re-run the whole
   `emr` removal analysis on any `rm`/`rmdir` found:

```javascript
let d = c.replace(/`[^`]*`/g, "__CMDSUB__");
for (let m = "", g = 0; m !== d && g < 16; g++) ((m = d), (d = d.replace(/\$\([^()]*\)/g, "__CMDSUB__")));
let p = d !== c,
  f = await aVe(d);
if (f.kind === "simple")
  for (let m of f.commands) {
    let g = x2e(m.argv), y = pko(g[0]);
    if (y !== "rm" && y !== "rmdir") continue;
    let _ = g.slice(1), E = emr(y, _, t, r, i);
    ...
  }
```

4. And separately, the unresolvable-variable check per body (`:394349-394357`) — the new `_Ke` site with
   the message

```
Dangerous ${u.command} operation detected inside command substitution: '${u.target}'

This target is a shell variable expansion that points at the filesystem root (or a top-level directory)
when the variable is unset or empty. This requires explicit approval and cannot be auto-allowed by
permission rules.
```

   This is the seventh `cannot be auto-allowed by permission rules` site; 193 had six. The plain-form
   sibling survives unchanged at `:394293` (193 `:460583`).

### The two budgets, and why they fail in opposite directions

**64 substitutions.** Above it, the code branches on whether the command *mentions* `rm`/`rmdir` at all:

- mentions it ⇒ **refuse** (`_Ke`, which carries `circuitBreaker: "dangerousRemoval"`);
- does not mention it ⇒ `return null`, i.e. "no destructive finding", and the command proceeds through the
  rest of the pipeline.

That asymmetry is the right call and easy to get backwards. A command with 200 substitutions and no `rm`
anywhere in its text cannot contain an `rm` (the check is on `e.text`, the whole command), so refusing it
would be a pure false positive. A command with 200 substitutions *and* an `rm` token might be hiding a
catastrophic delete in body #137, and the analyzer has given up — so it must ask.

**16 nesting iterations.** `for (let m = "", g = 0; m !== d && g < 16; g++)` collapses `$(…)` innermost-first
by repeatedly replacing the *non-nested* form `\$\([^()]*\)`. Each pass removes one level. The loop exits
early on a fixed point (`m !== d` fails). Sixteen levels of nested substitution is far beyond anything
legitimate; beyond it, `p = d !== c` is still true and `d` still contains `$(`, so the subsequent parse of
`d` sees a `$(` with no close and yields a non-`simple` result — which means no `rm` is extracted and the
body contributes nothing. That is the *permissive* direction, mitigated by the fact that reaching 16
levels requires 16 nested substitutions in a single body, which the 64-body budget and the top-level
tokenizer-divergence guards make hard to arrange quietly.

**Why does the bullet say "in `--dangerously-skip-permissions` and auto mode"?** Because `_Ke` produces
`classifierApprovable: !1`, which no permission rule and no bypass mode can satisfy — the message says so:
*"cannot be auto-allowed by permission rules"*. This is the one category of check that survives
`--dangerously-skip-permissions`, and `.208` extended it to substitution bodies so the plain and
substituted forms behave identically. `.218` then added `circuitBreaker: "dangerousRemoval"` (`:390684`)
so that *auto mode specifically* may adjudicate it with the classifier rather than prompting — see
[`classifier_adjudication.md`](classifier_adjudication.md) §1. Read together, `.208` and `.218` are: widen
the check's reach, then give the model a way to clear its false positives.

---

## 5. The static removal analyzer `emr`, for context

The classifier rules above are the *policy*; `emr` (`:390689-390790`) is the *static* half, and it is
carryover — worth summarising so the deltas above have a frame.

`emr(verb, args, cwd, extraDirs, cdCompound)` resolves the removal targets via `tmr[verb](args)` — a
per-command argv→targets extractor table (`tmr`, `:391281`, with entries for `cd`, `ls`, `find`, and
many others) — then, for each target:

1. Strips trailing `/*`, `/**`, `/***` groups repeatedly to a fixed point (`:390706-390711`), recording
   `m = f !== p` ("the target was glob-suffixed").
2. **`cd`-compound refusal** (`:390714-390718`): if a `cd` precedes the removal and the target is a
   relative glob, the target cannot be statically resolved — refuse. `This command changes directories
   before the removal…` is 220=1 / 193=1.
3. **Unresolvable-target refusal** (`:390724-390740`): a glob-suffixed relative target combined with any
   of — a dangerous prefix (`gYr`, `:214148`), a command-substitution sentinel (`Lf`), a leading `~`,
   a leading `//`, a `..` segment, `rmdir -p`, or a `*/` component — is refused.
4. Then the critical-system-directory (`:390753`), workspace-directory (`:390761`), and
   unenumerable-glob (`:390774`) refusals.

All five refusal messages are `220 = 193` in count. So the static layer did not change in this window;
what changed is *where it is invoked from* (§4) and *whether its verdict can be adjudicated* (`.218`).

---

## 6. `docker` and `file`: read-only-table removals

Two `.214` bullets are destructive-command adjacent but are really *read-only table* edits, and they are
documented in [`security_hardening_214.md`](security_hardening_214.md) §5-§6:

- `file -m`/`--magic-file`/`-f` deleted from `file.safeFlags` (`:392410-392445`; `"--magic-file"`
  220=0 / 193=1)
- the docker daemon-redirect flag list grown from 8 to 15 entries (`hYr`, `:213928-213944`)

Both belong to the same principle as this document: a command classified read-only must not be able to
name a target the classification did not cover.

---

## 7. `tengu_destructive_command_warning` — a UI gate, and it is carryover

`tengu_destructive_command_warning` is **220=2 / 193=2 — carryover**, and both
2.1.220 sites are in the *rendering* layer, not the permission pipeline:

- `:768343` — `let j = Ke("tengu_destructive_command_warning", !1) ? tRu(r) : null,`
- `:770318` — `if (!Ke("tengu_destructive_command_warning", !1)) return null;`

Default `!1` in both builds. So this is a default-off remote gate for an extra warning banner on the
permission dialog, present in 2.1.193 already. **Do not report it as a `.21x` addition** — it appears new
only because it was absent from the 2.1.193 analysis tree's gate inventory, not from the 2.1.193 bundle.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md).

Key functions in this document:
- `CLASSIFIER_RULE_IDS` (`kNy`, `:345167`) - the 66-entry canonical rule-id array (220-only)
- `USER_RULE_REPLACEMENT_MARKERS` (`xNy`, `:345161`) - four `*_to_replace` sentinels
- `KNOWN_RULE_IDS` (`l0o`, `:345236`) - `new Set([...kNy, ...HNy])`, with `HNy = []` an empty extension slot
- `canonicalizeClassifierCategory` (`Xon`, `:345238`) - allow-list before telemetry
- `makeDangerousRemovalAsk` (`_Ke`, `:390676`) - the `safetyCheck` + `circuitBreaker: "dangerousRemoval"` builder
- `analyzeRemovalTargets` (`emr`, `:390689`) - the static removal analyzer (carryover)
- `ARGV_TO_TARGETS` (`tmr`, `:391281`) - per-command argv→target extractor table
- `findUnresolvableVariableRemoval` (`SMs`, `:390781`) - "expands to `/` when empty" detector
- `checkCommandSubstitutionRemovals` (inside `Evd`, `:394257-394395`) - the `.208` substitution scan
- `splitCommandSubstitutions` (`$E`, `:512259`) - substitution splitter with its own `AIe` over-length guard
- `parseShellCommandAsync` (`aVe`, `:209760`) - the async parse used to re-analyze a substitution body
- `hasDangerousPathPrefix` (`gYr`, `:214148`) - dangerous-prefix predicate used by `emr`
- `hasCatastrophicRemovalPattern` (`nmr`, `:394710`) - the `rm -rf ~`-class matcher
- `serializeClassifierMetaLine` (`SBs`, `:442610`) - `JSON.stringify({ meta })`, the format the transcript rule protects
