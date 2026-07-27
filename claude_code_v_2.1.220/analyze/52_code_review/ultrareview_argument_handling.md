# `/ultrareview` argument handling: the `.212`/`.214`/`.216`/`.218` precondition rewrite

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** the same path under `versions/2.1.193/` (718,679 lines), tagged `(193)`.
Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).

Eight changelog bullets across four releases all land in **one function**. This document is mostly a
line-by-line reading of that function against its 2.1.193 predecessor.

| Release | Bullet |
|---|---|
| `.212` | Fixed `/ultrareview` rejecting PR references like `#123`, `PR 123`, and pasted PR URLs; error hints now name the command you actually typed |
| `.212` | Fixed `/ultrareview <branch>` not fetching the branch from origin when it exists remotely; it now suggests the closest branch name on typos |
| `.212` | Fixed `/ultrareview` skipping the billing confirmation in a new conversation after `/clear` |
| `.212` | Fixed `/ultrareview`'s "not a git repository" error on Claude Desktop now suggesting the project's repository folder instead of terminal commands |
| `.214` | Fixed `/ultrareview` refusing to run in repos with no merge base — it now offers to review all tracked files |
| `.216` | Improved the `/ultrareview` diff-too-large error to show configured limits, measured diff size, and largest contributing files |
| `.216` | Improved `/code-review ultra` empty-diff message to name the exact base ref and suggest passing an explicit base |
| `.218` | Fixed `/ultrareview` failing on descriptive arguments like "review my auth changes" — they now run a review of your current branch with the text applied as a note to the findings |
| `.218` | Improved `/ultrareview` error feedback so Claude can correct an invalid argument instead of retrying it unchanged |

---

## 0. The function, and how much it grew

| | 2.1.193 | 2.1.220 |
|---|---|---|
| Name | `Aer` | `PFo` (`precheckLaunchScope`, exported at `:496613`) |
| Location | `:537008-537130 (193)` | `:496639-497060` |
| Lines | 123 | 422 |
| Signature | `(args, invocation = "/code-review ultra")` | `(args, invocation = "/code-review ultra", opts)` |
| Failure shape | `{ ok: false, error }` | `{ ok: false, reason, error }` |
| Distinct failure reasons | 6 | 9 |
| Telemetry per failure | `{ reason }` | `{ reason, …context…, cwd_is_home }` |
| Recovery telemetry | none | `tengu_review_remote_precondition_recovery` × 13 sites |

`tengu_review_remote_precondition_recovery` is **220=13 / 193=0** and `cwd_is_home` is
**220=16 / 193=0** — the two literals that prove the whole state machine is new instrumentation
around an old skeleton. `tengu_review_remote_precondition_failed` is 220=16 / 193=11: five *new*
failure sites, eleven pre-existing.

### The `{reason, method, outcome}` triple — the `.218` "error feedback" bullet, structurally

Every recovery attempt emits the same three-field event:

```javascript
O("tengu_review_remote_precondition_recovery", { reason: Ee(<what was wrong>), method: Ee(<what we tried>), outcome: fe(<what happened>) });
```

The vocabulary, read out of the bundle:

| `reason` | `method` | line | `outcome` values seen |
|---|---|---|---|
| `base_ref_not_found` | `pr_arg_normalization` | `:496656-496659` | `succeeded` / `failed` |
| `base_ref_not_found` | `embedded_pr_hint` | `:496776-496779` | `offered` |
| `base_ref_not_found` | `fetch_retry` | `:496809-496813`, `:496860-496863` | `failed`, or `fe(P)` |
| `base_ref_not_found` | `branch_suggestion` | `:496834-496838` | `offered` |
| `base_ref_not_found` | `prose_instructions` | `:496867-496871` | `fe(P)` |
| `no_merge_base` | `empty_tree_bundle` | `:496932-496939`, `:497201`, `:497301`, `:497360`, `:497451` | `offered` / `accepted` / `declined` / `succeeded` / `failed` |
| `no_merge_base` | `deepen_hint` | `:496976-496980` | `offered` |

Counts: `pr_arg_normalization` 220=1/193=0, `embedded_pr_hint` 1/0, `fetch_retry` 2/0,
`branch_suggestion` 1/0, `prose_instructions` 1/0, `empty_tree_bundle` 6/0, `deepen_hint` 1/0.

**Why a triple rather than a flat reason:** every one of these fixes is a *recovery* — the user's
argument was wrong in a way the client can guess at. The three fields separate "what the user got
wrong", "which guess we made", and "did the guess work", so a dashboard can answer *which recovery
heuristics are worth keeping* rather than only *how often ultrareview fails*. The `offered` /
`accepted` / `declined` triad on `empty_tree_bundle` in particular measures a user decision, not a
code path.

**The two `suppress*` options exist because of this fan-out.** `PFo` is called from three places
(`:497412` headless, `:733007` interactive, plus its own re-entry), and the interactive path calls it
*twice* — once to build the confirmation dialog, once after the user proceeds. Without
`suppressSucceededRecoveryEvent` / `suppressOfferedRecoveryEvent` (`:496654`, `:496866`, `:496931`;
220=3/0 and 2/0) each recovery would be double-counted. `OBt` sets them from
`{ suppressSucceededRecoveryEvent: !t.confirm, suppressOfferedRecoveryEvent: t.confirm && !t.singlePass }`
(`:497413-497414`) — i.e. the *pre-confirmation* pass records offers and the *post-confirmation* pass
records outcomes, and neither records the other's events.

---

## 1. `.212` — PR references: `#123`, `PR 123`, pasted URLs

### 1.1 The normalisation

2.1.193 tested the raw argument: `if (/^\d+$/.test(n))` (`:537018 (193)`). Anything else fell through
to branch handling, so `#123` became "not a branch in this repo".

2.1.220 normalises first:

```javascript
// ============================================
// precheckLaunchScope - PR-argument normalisation (first 15 lines)
// Location: cli_inner_pretty.js:496649-496663
// ============================================

// ORIGINAL (for source lookup):
let n = e.trim(),
  o = Dtn(n),
  i = o?.num.toString() ?? n.match(/^(?:#|PR[\s#]*)(\d+)$/i)?.[1] ?? n;
if (/^\d+$/.test(i)) {
  let P = (F) => {
      if (F === "succeeded" && r?.suppressSucceededRecoveryEvent) return;
      if (i !== n)
        O("tengu_review_remote_precondition_recovery", {
          reason: Ee("base_ref_not_found"), method: Ee("pr_arg_normalization"), outcome: fe(F),
        });
    },
  M = await q$(),
  $ = Jrt(o?.host, M?.host) || (!!o && !!M && jf(o.host) && jf(M.host));

// READABLE (for understanding):
let rawArg = args.trim(),
  parsedPrUrl = parseGitHubPullRequestUrl(rawArg),                       // https://host/owner/repo/pull/N
  prNumber = parsedPrUrl?.num.toString()
           ?? rawArg.match(/^(?:#|PR[\s#]*)(\d+)$/i)?.[1]                // "#123", "PR 123", "PR#123", "pr 123"
           ?? rawArg;                                                    // unchanged -> not a PR
if (/^\d+$/.test(prNumber)) {
  let recordNormalisation = (outcome) => {
      if (outcome === "succeeded" && opts?.suppressSucceededRecoveryEvent) return;
      if (prNumber !== rawArg) logEvent("tengu_review_remote_precondition_recovery", {   // only when we CHANGED it
        reason: "base_ref_not_found", method: "pr_arg_normalization", outcome,
      });
    },
  remote = await getGitHubRemote(),
  hostsMatch = hostsEqual(parsedPrUrl?.host, remote?.host)
            || (!!parsedPrUrl && !!remote && isGitHubDotCom(parsedPrUrl.host) && isGitHubDotCom(remote.host));

// Mapping: PFo→precheckLaunchScope, Dtn→parseGitHubPullRequestUrl (:316026), q$→getGitHubRemote,
//          Jrt→hostsEqual, jf→isGitHubDotCom, Ee/fe→telemetry string sanitisers
```

Three notes on the regex `^(?:#|PR[\s#]*)(\d+)$`:

- `PR[\s#]*` accepts `PR 123`, `PR#123`, `PR #123` and bare `PR123`; the `i` flag covers `pr`.
- It is anchored, so it only fires on an argument that is *entirely* a PR reference. A descriptive
  sentence containing `#123` is handled much later (§4), by a different regex with lookbehinds.
- `Dtn` / `gIy` (`:316026`, `:316033`) is **carryover** — the same regex exists at `:307915 (193)`.
  The delta is that the ultrareview precheck now *calls* it. This is a good example of a bullet whose
  literal grep (`/pull/(\d+)`, 220=4/193=3) under-reports because the machinery was already there.

### 1.2 The new `pr_url_wrong_repo` refusal

Because a pasted URL carries `host/owner/repo`, the precheck can now catch the mistake the old code
could not even see (`:496664-496681`):

```javascript
if (o && (!$ || o.owner.toLowerCase() !== M?.owner.toLowerCase() || o.repo.toLowerCase() !== M?.name.toLowerCase())) {
  … reason: "pr_url_wrong_repo" …
  error: `That link is for ${o.owner}/${o.repo} on ${o.host}, but ${M ? `you're in ${M.owner}/${M.name} on ${M.host}` : "this directory has no GitHub remote"}. cd into a checkout of that repo and run ${t} ${o.num} from there.`
}
```

`pr_url_wrong_repo` is **220=2 / 193=0**. The `hostsMatch` fallback
(`isGitHubDotCom(a) && isGitHubDotCom(b)`) is there so `github.com` and `www.github.com` (and any
other alias the helper folds) do not read as different hosts.

**Why refuse instead of just fetching that PR?** Because the cloud review clones *the local
repository* into the sandbox and then checks out `refs/pull/N/head` inside it (`:497256`). A PR number
from a different repo would resolve to whatever PR N happens to be in the local repo — a silent
wrong-review, the worst possible outcome. Refusing with a `cd` instruction is the only safe answer.

### 1.3 "error hints now name the command you actually typed"

Every error string in `PFo` interpolates `${t}`, the `invocation` parameter, whose default is
`"/code-review ultra"` (`:496639`) but which callers override:

- interactive `/ultrareview` → `` n ? `/${n}` : "/ultrareview" `` (`:733007`)
- headless slash command → same (`:497558`)
- the `claude ultrareview` CLI → `invocation: "claude ultrareview"` (`:865105`)

2.1.193 already threaded `t` into most strings, so this half of the bullet is **carryover in
mechanism**; what is new is that the two *new* error paths (`pr_url_wrong_repo`, the embedded-PR hint)
also do it, and that the headless CLI now supplies its own invocation string.

---

## 2. `.212` — branch fetch from origin, and closest-name suggestions

2.1.193's entire branch validation was four lines (`:537073-537084 (193)`):

```javascript
if (n) {
  let f = async (m) => (await $n(yo(), ["rev-parse", "--verify", "--quiet", m], { preserveOutputOnError: !1 })).code === 0;
  if (!(await f(`origin/${n}`)) && !(await f(n)))
    return { ok: !1, error: `"${n}" is not a branch in this repo. ${t} takes a PR number, a branch name, or no argument …` };
}
```

2.1.220 keeps that probe (`:496756-496761`, now with `--end-of-options` — see §6) and adds a
two-stage recovery around it (`:496803-496857`).

### 2.1 Stage one: `tryFetchBranchFromOrigin`

```javascript
// ============================================
// tryFetchBranchFromOrigin - ls-remote probe then a scoped fetch; 4-valued result
// Location: cli_inner_pretty.js:497074-497130
// ============================================

// ORIGINAL (for source lookup):
async function JI_(e) {
  if (e.startsWith("-") || e.includes(":") || /\s/.test(e)) return "not_found";
  let t = { ...NZ(), GIT_SSH_COMMAND: `${Z.GIT_SSH_COMMAND || "ssh"} -o BatchMode=yes -o StrictHostKeyChecking=yes`, GIT_ALLOW_PROTOCOL: "https:http:ssh" },
    r = await an(fo(), [...Sl, ...gie, "-c", "credential.helper=", "-c", "core.askPass=", "ls-remote", "--heads", "--exit-code", "--end-of-options", "origin", e], { timeout: 4000, preserveOutputOnError: !1, env: t });
  if (r.code !== 0) return r.code === 2 ? "not_found" : "probe_failed";
  if (!r.stdout.split("\n").some((i) => i.split("\t")[1]?.trim() === `refs/heads/${e}`)) return "not_found";
  return (await an(fo(), [...Sl, ...gie, "-c", "credential.helper=", "-c", "core.askPass=", "fetch", "--no-tags", "--end-of-options", "origin", `refs/heads/${e}:refs/remotes/origin/${e}`], { timeout: 15000, preserveOutputOnError: !1, env: t })).code === 0
    ? "recovered" : "fetch_failed";
}

// READABLE (for understanding):
async function tryFetchBranchFromOrigin(branch) {
  if (branch.startsWith("-") || branch.includes(":") || /\s/.test(branch)) return "not_found";   // never shell out on argv-shaped input
  const env = { ...gitBaseEnv(),
    GIT_SSH_COMMAND: `${process.env.GIT_SSH_COMMAND || "ssh"} -o BatchMode=yes -o StrictHostKeyChecking=yes`,  // never prompt
    GIT_ALLOW_PROTOCOL: "https:http:ssh" };                                                                    // no ext::/file:: transports
  const probe = await run(git(), [...GIT_SAFE_FLAGS, ...GIT_SSH_BATCH_FLAGS,
    "-c", "credential.helper=", "-c", "core.askPass=",              // no credential prompt, no askpass GUI
    "ls-remote", "--heads", "--exit-code", "--end-of-options", "origin", branch], { timeout: 4000, env });
  if (probe.code !== 0) return probe.code === 2 ? "not_found" : "probe_failed";   // git exit 2 == --exit-code "no match"
  if (!probe.stdout.split("\n").some(l => l.split("\t")[1]?.trim() === `refs/heads/${branch}`)) return "not_found";
  const fetched = await run(git(), [...GIT_SAFE_FLAGS, ...GIT_SSH_BATCH_FLAGS,
    "-c", "credential.helper=", "-c", "core.askPass=",
    "fetch", "--no-tags", "--end-of-options", "origin", `refs/heads/${branch}:refs/remotes/origin/${branch}`], { timeout: 15000, env });
  return fetched.code === 0 ? "recovered" : "fetch_failed";
}

// Mapping: JI_→tryFetchBranchFromOrigin, an→run, fo→git,
//          Sl→GIT_SAFE_FLAGS (:55279, ["-c","core.hooksPath=/dev/null","-c","core.fsmonitor="]),
//          gie→GIT_SSH_BATCH_FLAGS (:168649), NZ→gitBaseEnv
```

**Why it is built this way** — every clause is a hang or an injection guard:

1. **Input filter first.** A branch starting with `-` would be parsed as a git flag; one containing
   `:` would be a refspec (`--end-of-options` fixes the first, but the filter also refuses the second,
   which `--end-of-options` does not); whitespace means it is prose, not a branch. Refusing before
   spawning is cheaper and safer than sanitising after.
2. **Two-step probe-then-fetch.** `ls-remote --heads --exit-code` with a **4 s** timeout answers "does
   this branch exist remotely" without transferring objects. Only on a hit does it pay for `fetch`
   with a **15 s** timeout. The asymmetry is deliberate: the probe is on the *typo* path (common) and
   the fetch is on the *success* path (rare, and worth waiting for).
3. **Exact ref match after the probe.** `ls-remote --heads origin <name>` matches globs, so
   `refs/heads/feature/x` can come back for `x`. The explicit
   `l.split("\t")[1] === "refs/heads/" + branch` check rejects that.
4. **Non-interactive credentials, four ways.** `BatchMode=yes`, `StrictHostKeyChecking=yes`,
   `credential.helper=` (emptied) and `core.askPass=` (emptied). A precheck that pops an SSH
   passphrase prompt or a credential GUI inside a slash command would hang the session forever. This
   is the single most important property of the function.
5. **`GIT_ALLOW_PROTOCOL: "https:http:ssh"`** blocks `ext::`, `file::` and other transports that a
   hostile `origin` URL could use to execute a command.
6. **Distinguishing `probe_failed` from `not_found`.** `--exit-code` makes git exit 2 when nothing
   matched; any other non-zero is a network/auth failure. The caller treats them differently: only
   `not_found` proceeds to the typo suggester, because suggesting "did you mean X" after a network
   error would be actively misleading.

The caller (`:496804-496856`) reads the four values:

| result | caller behaviour |
|---|---|
| `recovered` + `origin/<name>` now resolves | set `g = true`, continue with the branch |
| `fetch_failed` | refuse with `"<name>" exists on origin but couldn't be fetched. Run \`git fetch origin <name>\` and try <invocation> again.` |
| `probe_failed` | emit `fetch_retry / failed`, fall through to the typo suggester |
| `not_found` | **no** `fetch_retry` event (`if (P !== "not_found")` at `:496808`), fall through to the typo suggester |

That `if (P !== "not_found")` guard keeps the recovery metric honest: a plain typo is not a failed
fetch attempt.

### 2.2 Stage two: `suggestClosestBranchName`

```javascript
// ============================================
// suggestClosestBranchName - main/master swap, then Levenshtein <= 2 over local+origin heads
// Location: cli_inner_pretty.js:497131-497159
// ============================================

// ORIGINAL (for source lookup):
async function QI_(e) {
  let { stdout: t, code: r } = await an(fo(), [...Sl, "for-each-ref", "--format=%(refname:short)", "--count=2000", "refs/heads", "refs/remotes/origin"], { preserveOutputOnError: !1 });
  if (r !== 0) return null;
  let n = new Map();
  for (let a of t.split("\n")) {
    let l = a.trim();
    if (!l || l === "origin" || l === "origin/HEAD") continue;
    let c = l.startsWith("origin/") ? l.slice(7) : l;
    if (l.startsWith("origin/") || !n.has(c)) n.set(c, l);
  }
  let o = e === "main" ? "master" : e === "master" ? "main" : null;
  if (o !== null) { let a = n.get(o); if (a) return a; }
  let i = null, s = 3;
  for (let [a, l] of n) {
    if (Math.abs(a.length - e.length) >= s) continue;
    let c = Spt(e, a);
    if (c > 0 && c < s) ((s = c), (i = l));
  }
  return i;
}

// READABLE (for understanding):
async function suggestClosestBranchName(wanted) {
  const { stdout, code } = await run(git(), [...GIT_SAFE_FLAGS, "for-each-ref",
    "--format=%(refname:short)", "--count=2000", "refs/heads", "refs/remotes/origin"], {});
  if (code !== 0) return null;
  const byShortName = new Map();                          // short name -> the ref to SHOW
  for (const line of stdout.split("\n")) {
    const ref = line.trim();
    if (!ref || ref === "origin" || ref === "origin/HEAD") continue;
    const shortName = ref.startsWith("origin/") ? ref.slice(7) : ref;
    if (ref.startsWith("origin/") || !byShortName.has(shortName)) byShortName.set(shortName, ref);
  }                                                       // origin/X wins over a local X of the same name
  const swapped = wanted === "main" ? "master" : wanted === "master" ? "main" : null;
  if (swapped !== null) { const hit = byShortName.get(swapped); if (hit) return hit; }   // special case FIRST
  let best = null, bestDistance = 3;                      // strictly < 3, i.e. edit distance 1 or 2
  for (const [shortName, ref] of byShortName) {
    if (Math.abs(shortName.length - wanted.length) >= bestDistance) continue;   // cheap length prefilter
    const d = levenshtein(wanted, shortName);
    if (d > 0 && d < bestDistance) { bestDistance = d; best = ref; }            // tightens as it improves
  }
  return best;
}

// Mapping: QI_→suggestClosestBranchName, Spt→levenshtein (:326579), an→run, fo→git
```

**Design points worth naming:**

- **`main`↔`master` is checked before edit distance, and it is not an edit-distance match at all**
  (`levenshtein("main","master") = 4`). Without the special case, the single most common mistake in
  the wild would produce no suggestion. Hard-coding it is the right call: it is the one branch-name
  pair with a semantic, not typographic, relationship.
- **`origin/X` beats local `X`.** The map insert (`if (ref.startsWith("origin/") || !map.has(short))`)
  lets an origin ref overwrite a local one but not vice versa. The suggestion is fed into
  `` Did you mean `${M}`? ``, and suggesting `origin/develop` is more useful than `develop` when the
  user's problem was that the branch is remote-only.
- **`--count=2000`** bounds a pathological monorepo. Beyond 2000 refs the suggester silently sees a
  truncated set — a deliberate accuracy-for-latency trade, since this runs on the error path of an
  interactive command.
- **`bestDistance` tightens inside the loop**, so the length prefilter gets stricter as a better match
  is found. On a 2000-ref repo that turns most iterations into one subtraction.
- **`d > 0`** excludes an exact match, which cannot happen (we only got here because the ref does not
  resolve) but would produce "did you mean `<the thing you typed>`?" if it did.

The refusal that consumes it (`:496849-496854`):

```javascript
let $ = M ? ` Did you mean \`${M}\`?` : "";
return { ok: !1, reason: "base_ref_not_found",
  error: `"${m}" is not a branch in this repo.${$} ${t} takes a PR number, a branch name, or no argument (reviews your current branch). Try ${t} by itself.` };
```

The tail sentence is byte-identical to 193's; the `Did you mean` clause and the `reason` field are the
delta.

---

## 3. `.214` — no merge base: review against the git empty tree

**What it does:** when `git merge-base <base> HEAD` produces nothing — an orphan branch, an unrelated
history, or a repo with no `main` at all — the review now diffs against the *git empty tree* instead
of refusing, which is exactly "review all tracked files".

**How it works** (`:496881-496956`):

1. `merge-base origin/<base> HEAD`; on failure retry with the bare `<base>` (`:496878-496879`).
2. If still empty, gather three facts: does `HEAD` resolve (`M`), is the clone shallow (`$` /`D`), and
   is the fallback enabled (`eLu()` reads `empty_tree_fallback_enabled !== !1` from the remote config,
   `:226422-226424`, **220=1 / 193=0** — default-on, remotely killable).
3. Only when `HEAD` resolves **and** the clone is **not** shallow **and** the fallback is enabled, run
   `git diff --shortstat <EMPTY_TREE_SHA>`.

```javascript
kWs = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"        // :497523, exported as EMPTY_TREE_SHA :496620
```

That constant is git's well-known hash of the empty tree object; diffing against it yields every
tracked file as an addition. It is **220=1 / 193=0**.

4. Empty result → `empty_diff` with a base-aware message (`:496903-496905`).
5. Over the configured limits → `local_diff_too_large` with `after_fallback: !0` in telemetry
   (`:496918`) and remediation that branches on whether a base branch exists at all
   (`:496922-496924`).
6. Otherwise return `ok`, with a scope object carrying two new fields:

```javascript
scope: { mode: "branch", headBranch: E, baseBranch: _, mergeBaseSha: kWs, diffStat: F.trim(),
         hadArg: m.length > 0,
         noMergeBase: q ? "unrelated_history" : "base_ref_missing",     // :496951
         instructions: f }
```

**Why the `unrelated_history` / `base_ref_missing` distinction matters.** `q` is true when the base
ref exists somewhere (explicit arg, or `origin/<base>`, or local `<base>` resolves,
`:496887-496890`). So:

- `unrelated_history` — the base branch is right there and simply shares no commits with `HEAD`.
- `base_ref_missing` — there is no such branch; "all files" is the only possible reading.

That single field then drives three separate user-facing strings and one launcher decision:

| Consumer | `unrelated_history` | `base_ref_missing` |
|---|---|---|
| confirmation body `:497461-497465` | `Reviewing all files (no common history with <base>)` | `Reviewing all files (no <base> branch to compare against)` |
| launch banner `:497316-497319` | `<head> (all files — no common history with <base>)` | `<head> (all files)` |
| bundle scope `:497278` | `bundleForceScope: "squashed"` (220=2/193=0) | same |

`bundleForceScope: "squashed"` is the mechanical consequence: with no merge base there is no
incremental bundle to send, so the whole tree ships as one squashed commit.

**Ordering choice worth noting:** the shallow-clone check comes *before* the empty-tree fallback is
even attempted (`$ === "false"` is required at `:496886`). A shallow clone that appears to have no
merge base almost certainly *does* have one beyond the fetch depth, so reviewing "all files" would be
wrong. Instead it gets its own `deepen_hint` recovery with a copy-pasteable
`git fetch --deepen=100 origin <base>` (`:496986-496987`). This is the correct priority: never let a
fallback paper over a fixable local condition.

The launch path then reports the outcome of the offer at four points — `offered` (`:496932`),
`accepted` (`:497451`), `succeeded` (`:497360`), `failed` (`:497201`, `:497301`) — which is how the
team can tell whether users actually want an all-files review.

---

## 4. `.218` — descriptive arguments become a note

### 4.1 The classification

```javascript
// ============================================
// precheckLaunchScope - descriptive-argument branch
// Location: cli_inner_pretty.js:496762-496801
// ============================================

// ORIGINAL (for source lookup):
let l = /\s/.test(n),
  c = l && ((await a(`origin/${n}`)) || (await a(n))),
  u = l && !c ? n.match(/https:\/\/\S*\/pull\/\d+\b/) : null,
  d = l && !c && !u
      ? (n.match(/(?<![\w/#-])(?:#|PR)[-\s#]*(\d+)\b/i) ??
         n.match(/(?<![\w/#-])pull[\s-]+request[-\s#]*(\d+)\b/i) ??
         n.match(/\/pull\/(\d+)\b/i) ??
         n.match(/^(\d+)\b/))
      : null;
if (u || d) { … reason: "base_ref_not_found", error: `Your request mentions what looks like a PR reference (${P}). To review that PR, run \`${t} ${M}\`. …` }
let p = l && !c && !n.startsWith("-"),
  f = p ? n : void 0,                 // -> scope.instructions  (the "note")
  m = p ? "" : n,                     // -> the base-ref candidate
  g = !1;

// READABLE (for understanding):
const looksLikeProse = /\s/.test(rawArg);                                  // any whitespace at all
const proseIsActuallyABranch = looksLikeProse && (await refExists(`origin/${rawArg}`) || await refExists(rawArg));
const embeddedUrl  = looksLikeProse && !proseIsActuallyABranch ? rawArg.match(/https:\/\/\S*\/pull\/\d+\b/) : null;
const embeddedRef  = looksLikeProse && !proseIsActuallyABranch && !embeddedUrl ? (…four regexes…) : null;
if (embeddedUrl || embeddedRef) return { ok: false, reason: "base_ref_not_found", error: "…looks like a PR reference…" };
const treatAsNote  = looksLikeProse && !proseIsActuallyABranch && !rawArg.startsWith("-");
const instructions = treatAsNote ? rawArg : undefined;                     // free-form note
const baseRefArg   = treatAsNote ? "" : rawArg;                            // fall through as "no argument"
```

**The ordering is the whole design**, and each step is a refusal to guess wrong:

1. **Whitespace is the only trigger.** A single token is never prose; it is a branch or a PR number.
   Cheap, and it cannot misfire on `feature/my-branch`.
2. **A branch name containing whitespace still wins.** `refExists` is tried on the *whole* string
   first, so a genuinely odd branch name is not reinterpreted as a note.
3. **An embedded PR reference is refused, not guessed.** "review my auth changes in #123" gets
   `Your request mentions what looks like a PR reference (#123). To review that PR, run
   \`/ultrareview 123\`. To review your current branch instead, rerun without the PR-style
   reference.` — because reviewing the branch while the user named a PR, or reviewing the PR while the
   user wrote a sentence, are both plausible and both wrong. Asking is correct.
   The lookbehind `(?<![\w/#-])` stops `abc#123`, `v1.2-3`, and `foo/#4` from matching.
4. **`!rawArg.startsWith("-")`** keeps a mistyped flag (`--fix-typo something`) out of the note path;
   it falls through to the branch path and gets a proper "not a branch" error.

### 4.2 Where the note goes — and where it deliberately does not

`instructions` rides the scope object into `OFo` (`launchRemoteReview`) and then into the task
registration (`:497348`, `reviewInstructions:` — **220=7 / 193=0**). It reaches the user and the
model in four places:

| Site | Text |
|---|---|
| pre-confirmation body `:497469-497471` | `Note for findings (not a base branch): "<truncated>"` |
| launch banner `:497379-497382` | `Your text was read as a note, not a base branch — the standard review runs on the diff above, and the findings will be related to your note when they arrive.` |
| model nudge at launch `:497396` (`Epn`) | `The user's argument was interpreted as a review note, not a base branch: "…". The cloud review runs its standard pass over the branch diff and does not see the note; when the findings arrive, prioritize and relate them to the user's request.` |
| findings arrival `:318295-318298` | `This review was launched with a note, recorded at launch time: "…". The cloud review did not see the note — it ran a standard review of the diff. When presenting these findings, prioritize and relate them to that note.` |

**All four say the same thing three times: the cloud reviewer never sees the note.** That is the
honest design. The note is not passed to the remote bughunter session (the `environmentVariables` at
`:497281` carry only `BUGHUNTER_BASE_BRANCH` and the fleet-size tuning); it is stored client-side on
the task and replayed to the *local* model when the findings return. So the feature is
"post-filter/prioritise by the user's intent", not "scoped review", and the strings refuse to let
either the user or the model believe otherwise.

`o_r` (`previewInstructions`, `:497071-497073`) collapses whitespace and truncates to 80 chars for
display; the full text is truncated to `gvo` for the model-facing copies (`ma(t, gvo)`).

Counts: `read as a note, not a base branch` 220=2/193=0; `Note for findings (not a base branch)`
220=3/193=0; `recorded at launch time` 220=1/193=0.

### 4.3 "Error feedback so Claude can correct an invalid argument"

Two mechanisms, both new:

**(a) the `reason` field.** Every `PFo` failure now returns a machine-readable
`reason ∈ {not_git_repo, pr_url_wrong_repo, no_github_remote, monorepo_blocked, pr_diff_too_large,
repo_too_large_to_bundle, base_ref_not_found, empty_diff, local_diff_too_large, no_merge_base}`, and
`OBt` propagates it (`:497416`, `{ status: "error", message: n.error, reason: n.reason }`). 2.1.193's
`Aer` returned `{ ok: !1, error }` with no reason at all.

**(b) the failure is written into the transcript as a synthetic message.** The SDK/control-request
path builds it in `jkm` (`:844951-844961`):

```javascript
function jkm(e, t) {
  if (t.status === "needs-confirm") return [];
  let r = zr({ content: `<${U$}>/ultrareview${e ? " " + Na(e) : ""}</${U$}>`, isMeta: !0 });
  if (t.status === "launched") return [r, zr({ content: `<${RC}>${Na(t.message)}</${RC}>`, isMeta: !0 })];
  let n = t.status === "blocked" && t.actionUrl ? `${t.message}\nMore: ${t.actionUrl}` : t.message;
  return [r, zr({ content: `<${fU}>Ultrareview did not launch: ${Na(n)}</${fU}>`, isMeta: !0 })];
}
```

`Ultrareview did not launch:` is **220=1 / 193=0**. The pair of meta messages — the command echo plus
the stderr block — is what makes the failure *visible to the model in the next turn*. Before, the
error went to the UI only, so a model retrying the command re-sent the identical invalid argument.
Note `needs-confirm` returns `[]`: a pending billing dialog is not a failure and must not be narrated
into the transcript.

---

## 5. `.216` — the two improved messages

### 5.1 diff-too-large now shows limits, size, and largest files

```javascript
// 220 :497030-497040
let { stdout: D, code: U } = await an(fo(), [...Sl, "-c", "core.quotepath=false", "diff", "--no-ext-diff", "--no-textconv", "--numstat", I],
      { preserveOutputOnError: !1, timeout: 1e4, maxBuffer: 10485760 }),
  W = U === 0 ? g7d(D) : "";
return { ok: !1, reason: "local_diff_too_large",
  error: `Diff is too large for ultrareview: ${L.filesCount.toLocaleString()} ${Et(L.filesCount, "file")}, ${$.toLocaleString()} ${Et($, "line")} changed (limits: ${P.toLocaleString()} ${Et(P, "file")}, ${M.toLocaleString()} ${Et(M, "line")}).${W} Pass a closer base branch (\`${t} <branch>\`) to narrow the scope, or split the change.` };
```

versus 193 (`:537125 (193)`):

```javascript
error: `Diff is too large for ultrareview: ${u.trim()}. Pass a closer base branch (\`${t} <branch>\`) to narrow the scope, or split the change.`
```

`u.trim()` was git's raw `--shortstat` line. The new message adds (a) the measured counts formatted
with `toLocaleString()`, (b) **the configured limits**, which come from the remote config
(`Xdo()`, `:496712` — `max_diff_files` default 500, `max_diff_lines` default 8000; the helper itself
is byte-equivalent carryover from `TSo` `:384872 (193)`), and (c) the top-3 largest files:

```javascript
// formatLargestDiffFiles - :497061-497070
function g7d(e, t = 3) {
  let { perFileStats: r } = EEo(e, Number.POSITIVE_INFINITY),
    n = [...r.entries()].map(([i, s]) => ({ path: i, lines: s.added + s.removed })).filter((i) => i.lines > 0);
  if (n.length === 0) return "";
  return ` Largest files: ${n.sort((i, s) => s.lines - i.lines).slice(0, t).map((i) => `${i.path} (${i.lines.toLocaleString()} ${Et(i.lines, "line")})`).join(", ")}.`;
}
```

`Largest files:` is **220=1 / 193=0**. This runs a *second* git command — `--numstat`, capped at
10 s / 10 MiB — only on the failure path, so the happy path still pays for one cheap `--shortstat`.
`core.quotepath=false` keeps non-ASCII paths readable in the message. `Number.POSITIVE_INFINITY` is
passed as the per-file cap because the caller wants the true totals to sort by, not a truncated view.

**Why show the limits at all?** Because they are server-tunable. A user who sees "500 files" can
reason about splitting; a user who sees only "too large" cannot tell whether they are 10 % or 10×
over.

### 5.2 empty-diff now names the base ref and the merge base

```javascript
// 220 :497009-497013
let P = m ? `try a different base, e.g. \`${t} <branch>\`` : `pass one explicitly, e.g. \`${t} <branch>\``;
return { ok: !1, reason: "empty_diff",
  error: `No changes to review: the diff against ${b} (merge-base ${I.slice(0, 7)}) is empty. If you have local edits, stage or commit them first. If your branch was already merged or you meant a different base, ${P}.` };
```

versus 193 (`:537107 (193)`):

```javascript
error: `It doesn't look like you have any new commits or changes to review against your ${o} branch. Stage or commit them first?`
```

Three additions: `${b}` is the **ref that actually resolved** — remember `:496879` retries the bare
`<base>` when `origin/<base>` fails, so `b` can be either, and 193's message always printed the
plain base name even when `origin/` was used. `${I.slice(0,7)}` is the merge-base short SHA, which
disambiguates "already merged" from "wrong base". And the remediation clause branches on whether the
user supplied a base (`m`): *try a different* base vs *pass one*. The telemetry gained
`used_origin_ref: b !== _` and `had_explicit_base: m.length > 0` (`:497004-497005`) to measure exactly
that split.

The empty-tree branch has its own empty-diff message (`:496903-496905`) that instead branches on `q`
(does a base branch exist at all).

---

## 6. `.212` — "not a git repository" on Claude Desktop

The narrowest fix in the theme, and a clean example of a message being *decomposed* rather than
rewritten.

```javascript
// ============================================
// buildNoGitRepoRemediation - terminal instructions vs a GUI-host folder hint
// Location: cli_inner_pretty.js:497507-497511
// ============================================

// ORIGINAL (for source lookup):
function y7d() {
  return G$()
    ? "Open your project's repository folder and try again."
    : 'Run "git init" here to create a repository, or cd into an existing one.';
}

// READABLE (for understanding):
function buildNoGitRepoRemediation() {
  return isGuiEntrypoint()                       // CLAUDE_CODE_ENTRYPOINT in the GUI-host set
    ? "Open your project's repository folder and try again."
    : 'Run "git init" here to create a repository, or cd into an existing one.';
}

// Mapping: y7d→buildNoGitRepoRemediation, G$→isGuiEntrypoint (:46401,
//          `let e = Z.CLAUDE_CODE_ENTRYPOINT; return e !== void 0 && WBl.has(e);`)
```

Both call sites now end with `${y7d()}`:

- `:496646` — the precheck's own `not_git_repo` refusal
- `:497194` — `OFo`'s `not_in_git_repo` eligibility error

2.1.193 hard-coded the terminal sentence at both twins (`:537014 (193)`, `:537164 (193)`), so a
Claude Desktop user with no terminal was told to `cd`. `needs a git repository so it can clone your
code into a cloud sandbox, but <cwd> is not inside one.` is byte-identical in all four places — only
the trailing sentence moved behind `isGuiEntrypoint()`.

The same release added `cwd_is_home: Z7()` (`:497512-497520`) to every failure event —
`VGn(realpath(cwd), realpath(homedir()))`, i.e. "is the session running in the user's home
directory". That is the telemetry that would have shown this bug: GUI hosts launch in `$HOME`, which
is very often not a repo.

---

## 7. `.212` — the billing confirmation after `/clear`

**This is the sharpest bug-to-fix mapping in the theme: a module-level `var` became app state.**

2.1.193 (`:536994-537003 (193)`, `:537146 (193)`, `:537358 (193)`):

```javascript
tt(…, { confirmOverage: () => Her, checkOverageGate: () => Ter, _resetOverageConfirmedForTests: () => S0f });
function Her() { SOo = !0; }
function S0f() { SOo = !1; }          // test-only
…
case "confirm": { if (SOo) return { kind: "proceed", billingNote: t }; … }
…
var SOo = !1;                          // module-level, process-lifetime
```

The latch lived for the life of the **process**. `/clear` starts a new conversation but not a new
process, so the second `/ultrareview` after a `/clear` billed without asking. The only reset in the
codebase was `_resetOverageConfirmedForTests` — the name is an admission that nothing else could
clear it.

2.1.220 removes both `confirmOverage` and `_resetOverageConfirmedForTests` from the export table
(compare `:496609-496621` with `:536993-536997 (193)`; both literals are **220=0 / 193=1**) and makes
the gate a pure function of a parameter:

```javascript
// ============================================
// checkOverageGate - the billing gate, now parameterised instead of latched
// Location: cli_inner_pretty.js:497160-497178
// ============================================

// ORIGINAL (for source lookup):
async function MFo({ overageConfirmed: e }) {
  let t = await f7d();
  if (!t) return { kind: "proceed", billingNote: "", preflightUnavailable: !0 };
  let r = t.billing_note ?? "";
  switch (t.action) {
    case "proceed": return { kind: "proceed", billingNote: r };
    case "blocked":  return { kind: "blocked", reason: t.blocked?.reason ?? "server", message: t.blocked?.message ?? "Ultrareview is unavailable for your organization.", actionUrl: t.blocked?.action_url ?? null };
    case "confirm": {
      if (e) return { kind: "proceed", billingNote: r };
      return { kind: "needs-confirm", body: `This review bills as usage credits (${XNe()}).`, billingNote: r };
    }
  }
}

// READABLE (for understanding):
async function checkOverageGate({ overageConfirmed }) {
  const preflight = await fetchOveragePreflight();
  if (!preflight) return { kind: "proceed", billingNote: "", preflightUnavailable: true };   // NEW third state
  …
  case "confirm": return overageConfirmed ? { kind: "proceed", … } : { kind: "needs-confirm", … };
}

// Mapping: MFo→checkOverageGate, XNe→getReviewCostNote (:226405), f7d→fetchOveragePreflight
```

The latch now lives in conversation app state:

```javascript
S2s = { …, prResolvedThisSession: !1, ultrareviewOverageConfirmed: !1 };  // :448580-448595
Xa_ = Object.keys(S2s);                                                    // :448596
function E2s(e) { … return { ...e, ...S2s, webBrowser: … }; }              // :448564-448570  resetPerConversationState
function LYe(e) { e((t) => (t.ultrareviewOverageConfirmed ? t : { ...t, ultrareviewOverageConfirmed: !0 })); }  // :503512
```

`E2s` is spread into the new state by `clearConversation` (`:449495`, inside the `/clear` handler that
also emits `tengu_cache_eviction_hint` with `scope: "conversation_clear"` at `:449443`), so the flag
resets exactly when the conversation does. `ultrareviewOverageConfirmed` is **220=11 / 193=0**;
`S2s`/`Xa_` is the "reset on clear" manifest, and the accessor pair
`isUltrareviewOverageConfirmed` / `markUltrareviewOverageConfirmed` is threaded through six surfaces
(`:340442`, `:503636`, `:653771`, `:822427`, `:841379`, `:848797`) plus two no-op stubs for contexts
that must always re-ask (`:567156`, `:865100`).

**Why per-conversation and not per-session or per-launch?** Because the confirmation is *consent to
spend*, and the natural unit of consent is the task the user is working on. `/clear` is the user
declaring a new task. A per-process latch under-asks (the bug); a per-invocation prompt over-asks and
would make a three-review debugging session miserable. Per-conversation is the only defensible
middle, and it costs exactly one key in an existing reset manifest.

Note the third gate state added at the same time: `preflightUnavailable: !0` when the server
preflight cannot be reached. `OBt` treats that specially (`:497437-497442`) — if the caller withheld
consent and none was recorded, it returns
`Couldn't verify your review quota right now, so this review may bill as usage credits (…)`. So an
unreachable billing service fails *toward asking*, never toward silent spend.

---

## 8. Hardening picked up along the way

Not in any bullet, but in the same diff:

- **`--end-of-options`** on every git invocation that takes user input:
  `rev-parse --verify --quiet --end-of-options <ref>` (`:496758`), `ls-remote … --end-of-options`
  (`:497093`), `fetch … --end-of-options` (`:497121`). **220=5 / 193=0** (the other two are
  `branch -D` at `:225648` and one at `:774490`). This is the fix for a branch argument that starts
  with `-`; `tryFetchBranchFromOrigin`'s own `startsWith("-")` filter is belt-and-braces on top.
- **`--no-ext-diff --no-textconv`** on the three `git diff` calls (`:496891`, `:496997`, `:497032`).
  2.1.193's `git diff --shortstat` (`:537098 (193)`) had neither, so a repo-local
  `diff.external` / textconv filter could execute during a precheck.
- **`Sl`** (`:55279`, `["-c","core.hooksPath=/dev/null","-c","core.fsmonitor="]`) is prefixed to every
  git call here. The literal exists in 193 (`:382049 (193)`) but the ultrareview precheck did not use
  it — 193 called `$n(yo(), ["rev-parse", …])` with no safety flags at all.
- **`LC_ALL: "C"`** on the shortstat calls (`:496893`, `:496999`) so the parser is locale-independent.
  This one *is* carryover (`:537100 (193)`).

---

## 9. Verdict table

| Bullet | Verdict | Proof |
|---|---|---|
| `.212` PR references `#123` / `PR 123` / URLs | **NET_NEW** | normaliser `:496649-496651`; `pr_arg_normalization` 220=1/193=0; `pr_url_wrong_repo` 220=2/193=0. `Dtn`/`gIy` itself is carryover (`:307915 (193)`) — the delta is the call, not the regex |
| `.212` error hints name your command | **DELTA** (mechanism carryover) | `${t}` interpolation exists in 193; new is that the new paths use it and `claude ultrareview` supplies `invocation: "claude ultrareview"` `:865105` |
| `.212` branch fetch + typo suggestion | **NET_NEW** | `JI_` `:497074-497130`, `QI_` `:497131-497159`; `fetch_retry` 2/0, `branch_suggestion` 1/0. 193's whole branch check is 4 lines at `:537073-537084 (193)` |
| `.212` billing confirmation after `/clear` | **NET_NEW** | `ultrareviewOverageConfirmed` 220=11/193=0; 193's `var SOo` `:537358 (193)`; `_resetOverageConfirmedForTests` 220=0/193=1 |
| `.212` Desktop folder hint | **DELTA — one sentence** | `y7d()` `:497507`; 193 hard-codes the terminal text at `:537014` and `:537164 (193)`. `needs a git repository so it can clone…` is byte-identical |
| `.214` no merge base → all tracked files | **NET_NEW** | `kWs = "4b825dc…"` `:497523` 220=1/193=0; `empty_tree_bundle` 6/0; `empty_tree_fallback_enabled` 1/0; `bundleForceScope` 2/0 |
| `.216` diff-too-large detail | **NET_NEW** | `g7d` `:497061`; `Largest files:` 220=1/193=0; compare 193 `:537125` |
| `.216` empty-diff names the base ref | **NET_NEW** | `:497013`; compare 193 `:537107`; new telemetry `used_origin_ref` / `had_explicit_base` `:497004-497005` |
| `.218` descriptive arguments as a note | **NET_NEW** | `:496762-496801`; `reviewInstructions` 7/0; `read as a note, not a base branch` 2/0; `recorded at launch time` 1/0 |
| `.218` error feedback for Claude | **NET_NEW** | `reason` field on all ten failure returns; `Ultrareview did not launch:` `:844960` 220=1/193=0 |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_code_review.md](../00_overview/symbol_additions_v2_1_220_code_review.md).

Key functions and constants in this document:
- `precheckLaunchScope` (`PFo`) - the whole argument/precondition state machine, `:496639`
- `parseUltrareviewArgs` (`Spn`) - strips leading/trailing `--fix` / `--comment`, `:496622`
- `tryFetchBranchFromOrigin` (`JI_`) - 4-valued ls-remote-then-fetch recovery, `:497074`
- `suggestClosestBranchName` (`QI_`) - main/master swap then Levenshtein ≤2, `:497131`
- `formatLargestDiffFiles` (`g7d`) - top-3 contributors for the too-large message, `:497061`
- `previewInstructions` (`o_r`) - whitespace-collapse + 80-char truncate for the note, `:497071`
- `buildNoGitRepoRemediation` (`y7d`) - GUI-host folder hint vs terminal commands, `:497507`
- `isCwdHomeDirectory` (`Z7`) - `cwd_is_home` telemetry predicate, `:497512`
- `EMPTY_TREE_SHA` (`kWs`) - `4b825dc642cb6eb9a060e54bf8d69288fbee4904`, `:497523`
- `checkOverageGate` (`MFo`) - parameterised billing gate with `preflightUnavailable`, `:497160`
- `markUltrareviewOverageConfirmed` (`LYe`) - per-conversation consent latch setter, `:503512`
- `PER_CONVERSATION_STATE_DEFAULTS` (`S2s`) / `resetPerConversationState` (`E2s`) - `:448580` / `:448564`
- `launchRemoteReview` (`OFo`) - cloud session creation + note plumbing, `:497180`
- `runUltrareviewHeadless` (`OBt`) - the non-interactive driver, `:497398`
- `ultrareviewLaunchAcknowledgementNudge` (`Epn`) - post-launch model instruction, `:497395`
- `buildUltrareviewLaunchMessages` (`jkm`) - synthetic transcript messages incl. the failure block, `:844951`
- `isGuiEntrypoint` (`G$`) - `CLAUDE_CODE_ENTRYPOINT` membership test, `:46401`
- `getUltrareviewDiffLimits` (`Xdo`) - `max_diff_files` 500 / `max_diff_lines` 8000, `:226417`
- `isEmptyTreeFallbackEnabled` (`eLu`) - remote kill switch, default on, `:226422`
