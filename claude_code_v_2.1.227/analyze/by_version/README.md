# Version-oriented analysis: 2.1.221 through 2.1.227

These files project the 2.1.220-to-2.1.227 implementation analysis back onto the seven supplied
release-note sections. They complement two authoritative overview artifacts:

- [`changelog_analysis.md`](../00_overview/changelog_analysis.md) preserves all 130 supplied bullets.
- [`changelog_to_code_map.md`](../00_overview/changelog_to_code_map.md) gives the bullet-level evidence
  verdict, target anchor, and owning module.

## Versions

| Version | Bullets | Main implementation themes |
|---|---:|---|
| [`2.1.221`](2.1.221.md) | 39 | Focus/accessibility, masking, permission safety, MCP startup, plugin lifecycle, worktrees |
| [`2.1.222`](2.1.222.md) | 21 | Isolation, hook restrictions, proxy/stream reliability, attribution, raw diffs |
| [`2.1.223`](2.1.223.md) | 19 | Marketplace policy, parser hardening, workflow sandbox, model windows, code review |
| [`2.1.224`](2.1.224.md) | 31 | Self-hosted runner, archive plugins, cross-session messaging, masking, Remote Control |
| [`2.1.225`](2.1.225.md) | 14 | Spend caps, trust, auth-source preservation, cross-machine identity, RC reliability |
| [`2.1.226`](2.1.226.md) | 1 | Unscoped reliability rollup; no safe sub-feature attribution |
| [`2.1.227`](2.1.227.md) | 5 | Tier-aware flags, GitHub Action Bash, rewind persistence, Unicode menu, async probes |

## Evidence model

Only the endpoint bundles 2.1.220 and 2.1.227 are present. Therefore:

- The target bundle proves the implementation described by the linked module reports.
- Endpoint comparison can prove that many mechanisms are new or changed across the total window.
- The supplied changelog assigns those mechanisms to a particular intermediate version.
- A version file does not pretend that an unavailable 2.1.224 binary was directly diffed against
  2.1.223.

Detailed control flow belongs to the numbered module documents. These version files explain how the
individual release bullets combine into architectural changes without duplicating symbol mappings.
