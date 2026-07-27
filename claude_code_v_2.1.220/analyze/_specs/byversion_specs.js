export const meta = {
  name: 'cc220-byversion',
  description: 'Write per-release by_version docs covering every one of the 579 changelog bullets',
  phases: [{ title: 'ByVersion', detail: 'one agent per release slice: narrate + per-bullet ledger + anchors' }],
}

const ROOT = '/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.220'
const AN = ROOT + '/analyze'

// slice = the versions one agent owns. bullets = total changelog bullets in the slice.
const SLICES = [
  { slug: 'a', versions: ['2.1.195', '2.1.196'], bullets: 39, note: 'window opener; .196 is a broad reliability + org-default-models release' },
  { slug: 'b', versions: ['2.1.197', '2.1.198'], bullets: 34, note: '.197 is the SINGLE-BULLET Claude Sonnet 5 launch (new default model, native 1M context, promo pricing); .198 is the big autonomy release (subagents background by default, Chrome GA, bg-agent notifications, /dataviz)' },
  { slug: 'c', versions: ['2.1.199', '2.1.200', '2.1.201'], bullets: 42, note: '.201 is a SINGLE-BULLET hotfix (Sonnet 5 mid-conversation system role) that GROUND TRUTH 6.3 proves was REVERTED before .220 - that is the headline of this slice' },
  { slug: 'd', versions: ['2.1.202', '2.1.203', '2.1.204'], bullets: 56, note: '.202 introduces the Dynamic workflow size setting; .203 is a huge background-agent reliability batch; .204 is a SINGLE-BULLET headless SessionStart hook fix' },
  { slug: 'e', versions: ['2.1.205', '2.1.206'], bullets: 50, note: '.205 auto-mode transcript-tamper rule + agent-view polish; .206 /doctor-era fixes, EnterWorktree confirmation, gateway login' },
  { slug: 'f', versions: ['2.1.207'], bullets: 24, note: 'auto mode becomes available without opt-in on Bedrock/Vertex/Foundry; plugin ${user_config.*} shell-injection fix; Bedrock/Vertex default to Opus 4.8 (a value .219 later overwrites)' },
  { slug: 'g', versions: ['2.1.208'], bullets: 46, note: 'the single largest engineering release in the window: screen reader mode promoted, CLAUDE_CODE_PROCESS_WRAPPER, and a very large memory/CPU/leak batch' },
  { slug: 'h', versions: ['2.1.209', '2.1.210'], bullets: 34, note: '.209 is a SINGLE-BULLET revert of an overly broad dialog guard; .210 is agent-view + auto-mode-classifier-model + isolation:worktree containment' },
  { slug: 'i', versions: ['2.1.211'], bullets: 37, note: '--forward-subagent-text lands; permission-preview bidi/zero-width neutralisation; hook ask floors auto mode; worktree-root rule persistence' },
  { slug: 'j', versions: ['2.1.212'], bullets: 48, note: 'the largest bullet count in the window: /fork becomes a background session and /subtask takes over in-session delegation, the four session-budget caps, MCP auto-backgrounding, Task mode deprecation' },
  { slug: 'k', versions: ['2.1.214'], bullets: 47, note: 'the security release: six Bash/PowerShell permission hardening fixes, the EndConversation tool, docker daemon-redirect prompts, OTel correlation attributes. NOTE 2.1.213 was NEVER PUBLISHED - say so explicitly' },
  { slug: 'l', versions: ['2.1.215', '2.1.216'], bullets: 41, note: '.215 is a SINGLE-BULLET change stopping self-invocation of /verify and /code-review; .216 is sandbox.filesystem.disabled + the quadratic normalization fix' },
  { slug: 'm', versions: ['2.1.217', '2.1.218'], bullets: 56, note: '.217 emoji completion + the subagent concurrency cap + no-nesting-by-default; .218 /code-review as a background subagent, skills context:fork backgrounding, classifier absorbs three permission dialogs' },
  { slug: 'n', versions: ['2.1.219', '2.1.220'], bullets: 25, note: 'the window closer: .219 launches Claude Opus 5 (new default Opus, 1M context) plus strictAllowlist / DirectoryAdded / workflowSizeGuideline / nested-subagent depth 3; .220 is a SINGLE "Bug fixes and reliability improvements" bullet - treat that honestly, and use the bundle to say what actually changed if anything is findable' },
]

const BV_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['slug', 'versions', 'bullets_covered', 'files_written', 'anchors_reread', 'module_gaps', 'confidence', 'summary'],
  properties: {
    slug: { type: 'string' },
    versions: { type: 'array', items: { type: 'string' } },
    bullets_covered: { type: 'number' },
    files_written: { type: 'array', items: { type: 'string' } },
    anchors_reread: { type: 'number', description: 'lines you personally re-read in the 2.1.220 bundle' },
    module_gaps: {
      type: 'array',
      description: 'bullets that NO module doc covers - the gap list the overview phase must close',
      items: {
        type: 'object', additionalProperties: false,
        required: ['version', 'bullet_gist', 'theme', 'why_gap'],
        properties: { version: { type: 'string' }, bullet_gist: { type: 'string' }, theme: { type: 'string' }, why_gap: { type: 'string' } },
      },
    },
    confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
    summary: { type: 'string' },
  },
}

phase('ByVersion')

const results = await parallel(SLICES.map((s) => () => agent(
`You are writing the per-release reference layer of the Claude Code v2.1.220 deobfuscation tree.

## Step 0 - MANDATORY reading
1. ${AN}/_CONVENTIONS.md  - bundles, citation rule, traps, format. Non-negotiable.
2. ${AN}/_GROUND_TRUTH_verified_anchors.md  - hand-verified anchors + resolved discrepancies.
3. ${AN}/00_overview/_false_delta_ledger.md - 61 carryover traps + 125 verified net-new anchors, indexed.
   **Check every bullet you write against register 1.** If your bullet is in there, you must not call it new.
4. The scoping file(s) covering your versions (per-bullet anchor probes with 220/193 counts):
     ${AN}/00_overview/_scope_v195_199.md    (.195-.199)
     ${AN}/00_overview/_scope_v200_205.md    (.200-.205)
     ${AN}/00_overview/_scope_v206_210.md    (.206-.210)
     ${AN}/00_overview/_scope_v211_214.md    (.211-.214)
     ${AN}/00_overview/_scope_v215_220.md    (.215-.220)
5. ${ROOT}/CHANGELOG.md - your versions' sections, read in full.
6. The module docs that already exist, so you can LINK to them instead of duplicating:
     ls ${AN}/*/  and read the README.md of any module dir relevant to your bullets.
7. Format exemplar: /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/by_version/2.1.187.md

## Step 1 - YOUR ASSIGNMENT
Versions: ${s.versions.join(', ')}   (~${s.bullets} changelog bullets)
Context: ${s.note}

Write ONE FILE PER VERSION:
${s.versions.map((v) => `  ${AN}/by_version/${v}.md`).join('\n')}

## Step 2 - WHAT EACH FILE MUST CONTAIN

### a) A release narrative (2-5 paragraphs)
What was this release FOR? What is its centre of gravity? How does it relate to the releases either side
of it? For a single-bullet release, say what a one-bullet release means (hotfix? model launch? revert?)
and find the code that shipped in it if you can.

### b) The complete per-bullet ledger - THE CORE ARTEFACT
Every single bullet of the release, in changelog order, no exceptions and no silent omissions:

| # | Bullet (abridged) | Theme | Verdict | Anchor (\`cli_inner_pretty.js:<line>\`) | 220/193 | Covered in |
|---|---|---|---|---|---|---|

- **Verdict** ∈ NET_NEW | DELTA | CARRYOVER | UNANCHORED | SERVER_SIDE
- **Anchor** must be a line you RE-READ in the 2.1.220 bundle during this task. The scoping files give
  you a candidate; confirm it. If you cannot confirm, write \`(unconfirmed)\` and lower the verdict.
- **Covered in** = a relative link to the module doc + section that analyses it
  (e.g. \`[38_permissions/security_hardening_214.md](../38_permissions/security_hardening_214.md)\`),
  or \`-\` if no module doc covers it. Every \`-\` row goes in your \`module_gaps\` return value.

### c) Deep-dives on the 2-5 most substantial bullets of the release
Use the depth template (_CONVENTIONS.md 5.3) and at least one dual-version code snippet
(_CONVENTIONS.md 5.2) per file where the release has real code substance. Do NOT re-derive what a module
doc already covers well - instead pick bullets the modules under-served, and say you are doing that.

### d) A "what the changelog does not say" section
Anything you found in the bundle that belongs to this release but is absent from its bullets, and any
bullet the code contradicts. Ground truth 6.2b (the .219 Opus 4.7 fast-mode bullet is PREMATURE - the
bundle only warns of a FUTURE removal) is the model for this section.

## Step 3 - HARD RULES
- Do not invent line numbers. Confirm or mark unconfirmed.
- Do not call a ledger-register-1 bullet new.
- Account for 100% of the bullets. A missing row is the worst defect available here.
- Each file ends with \`## Related Symbols\` in LIST format (_CONVENTIONS.md 5.1). No mapping tables.
- English only. Correct link depth: from by_version/x.md a module is ../NN_mod/y.md and the previous
  tree is ../../../claude_code_v_2.1.193/analyze/...
- Write ONLY your ${s.versions.length} file(s) under ${AN}/by_version/. Do not touch module dirs.

## Step 4 - SELF-VERIFY
Count the rows in each ledger and compare with the changelog's bullet count for that version
(\`awk '/^## ${s.versions[0]}$/{f=1;next} /^## /{f=0} f&&/^- /{n++} END{print n}' ${ROOT}/CHANGELOG.md\`).
They must match exactly. Re-read 5 of your own citations in the bundle and confirm. Report the counts.

Return the structured result, and be honest in \`module_gaps\` - that list drives the next phase.`,
  { label: `bv:${s.versions.join('+')}`, phase: 'ByVersion', schema: BV_SCHEMA },
)))

const ok = results.filter(Boolean)
log(`by_version done: ${ok.length}/${SLICES.length} slices, ${ok.reduce((a, r) => a + (r.bullets_covered || 0), 0)} bullets covered`)
return { slices: ok, gaps: ok.flatMap((r) => r.module_gaps || []) }
