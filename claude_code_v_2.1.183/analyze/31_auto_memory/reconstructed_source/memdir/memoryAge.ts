/**
 * memdir/memoryAge.ts — memory staleness / relative-age helpers.
 *
 * These helpers exist because models reason poorly about raw timestamps: a
 * floor-rounded "N days old" caveat triggers staleness reasoning that an ISO
 * mtime does not. They are consumed on the recall path (relevant-memories
 * prefix) and on cached file-read output (per-memory <system-reminder>).
 *
 * 2.1.183 regions: cli_inner_pretty.js:220191-220208 (the whole cluster)
 *   - memoryAgeDays        = EHd @220191
 *   - memoryFreshnessText  = YWr @220194  (callsite e5n @465355)
 *   - memoryFreshnessNote  = xOi @220203  (callsite N3p @463115)
 * 2.1.88 ancestor: src/memdir/memoryAge.ts (memoryAgeDays / memoryAge /
 *   memoryFreshnessText / memoryFreshnessNote)
 * scaffold: none unit-specific; v2.1.156 memdir_core.md (carryover context).
 * cross-val: re-read the EHd/YWr/xOi cluster in 183; confirmed the day
 *   constant (86400000), the exact freshness string (single concatenated
 *   segment, U+2014 em-dash @220199), and the <system-reminder>\n wrapper.
 *
 * DELTA v2.1.183: the 88 ancestor's `memoryAge(mtimeMs): string` formatter
 *   ("today" / "yesterday" / "N days ago") is GONE in 183 — there is no such
 *   function in the bundle. EHd is referenced ONLY by YWr (verified: the only
 *   EHd callsite @220195 besides its own def), and the recall/file-read paths
 *   consume the freshness text/note, not a relative-age label. Removed here to
 *   match 183 behavior. (The "today" / "${n} day(s) ago" string @509519 belongs
 *   to an unrelated module — different pluralization helper vn() — not memdir.)
 */

/**
 * Days elapsed since mtime.  Floor-rounded — 0 for today, 1 for
 * yesterday, 2+ for older.  Negative inputs (future mtime, clock skew)
 * clamp to 0.
 */
// 2.1.183: memoryAgeDays = EHd @cli_inner_pretty.js:220191
export function memoryAgeDays(mtimeMs: number): number {
  return Math.max(0, Math.floor((Date.now() - mtimeMs) / 86_400_000));
}

/**
 * Plain-text staleness caveat for memories >1 day old.  Returns ''
 * for fresh (today/yesterday) memories — warning there is noise.
 *
 * Use this when the consumer already provides its own wrapping
 * (e.g. the relevant-memories recall prefix e5n@465355, which prepends
 * this text above `Memory: ${path}:`).
 *
 * Motivated by user reports of stale code-state memories (file:line
 * citations to code that has since changed) being asserted as fact —
 * the citation makes the stale claim sound more authoritative, not less.
 */
// 2.1.183: memoryFreshnessText = YWr @cli_inner_pretty.js:220194
export function memoryFreshnessText(mtimeMs: number): string {
  const days = memoryAgeDays(mtimeMs); // @220195
  if (days <= 1) return "";
  // Verbatim from 183 @220197-220201 — single concatenated segment, U+2014 em-dash.
  return (
    `This memory is ${days} days old. ` +
    "Memories are point-in-time observations, not live state — " +
    "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
  );
}

/**
 * Per-memory staleness note wrapped in <system-reminder> tags, with a
 * trailing newline.  Returns '' for memories ≤ 1 day old.  Use this for
 * callers that don't add their own system-reminder wrapper (e.g. the
 * cached file-read output path N3p@463115).
 */
// 2.1.183: memoryFreshnessNote = xOi @cli_inner_pretty.js:220203
export function memoryFreshnessNote(mtimeMs: number): string {
  const text = memoryFreshnessText(mtimeMs); // @220204
  if (!text) return "";
  // 183 emits the tag followed by a literal newline @220206-220207.
  return `<system-reminder>${text}</system-reminder>\n`;
}
