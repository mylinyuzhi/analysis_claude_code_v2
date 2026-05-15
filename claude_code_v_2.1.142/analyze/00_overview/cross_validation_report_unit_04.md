# Cross-Validation Report

- **Unit:** 04
- **Docs base:** `/tmp/u04/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 15

## C1 — Symbol existence (152 candidates)
- PASS: 138
- WARN: 14 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `$ARGV0` — first cited in `38_shell_snapshot/argv0_dispatch.md` line 278
  - `EzY` — first cited in `38_shell_snapshot/cross_validation.md` line 57
  - `KzY` — first cited in `38_shell_snapshot/cross_validation.md` line 33
  - `YzY` — first cited in `38_shell_snapshot/cross_validation.md` line 66
  - `_zY` — first cited in `38_shell_snapshot/cross_validation.md` line 72
  - `a_Y` — first cited in `38_shell_snapshot/cross_validation.md` line 41
  - `e_Y` — first cited in `38_shell_snapshot/config_file_detection.md` line 621
  - `l_Y` — first cited in `38_shell_snapshot/cross_validation.md` line 70
  - `o_Y` — first cited in `38_shell_snapshot/cross_validation.md` line 37
  - `qzY` — first cited in `38_shell_snapshot/config_file_detection.md` line 611
  - `s_Y` — first cited in `38_shell_snapshot/cross_validation.md` line 38
  - `t_Y` — first cited in `38_shell_snapshot/cross_validation.md` line 39
  - `wzY` — first cited in `38_shell_snapshot/cross_validation.md` line 74
  - `zzY` — first cited in `38_shell_snapshot/cross_validation.md` line 73

## C2 — Line/symbol pairing (133 pairs)
- PASS: 128
- FAIL: 5

Mismatched line citations (top 30):
  - `exec` not found near `cli_inner_pretty.js:518960-518960` (cited in `38_shell_snapshot/bash_tool_integration.md`)
  - `$U7` not found near `cli_inner_pretty.js:360885-360885` (cited in `38_shell_snapshot/command_assembly.md`)
  - `evalWrap` not found near `cli_inner_pretty.js:360836-360836` (cited in `38_shell_snapshot/command_assembly.md`)
  - `tY8` not found near `cli_inner_pretty.js:361253-361264` (cited in `38_shell_snapshot/command_assembly.md`)
  - `$U7` not found near `cli_inner_pretty.js:360926-360926` (cited in `38_shell_snapshot/env_snapshot.md`)

## C3 — Line range sanity (184 ranges)
- PASS: 184
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_shell_snapshot.md`
- Mappings: 87
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `c$H` at `cli_inner_pretty.js:555301-555305` (cited in `00_overview/symbol_additions_v2_1_142_shell_snapshot.md`)

```js
}
async function c$H(H, $) {
  try {
    await $.rmdir(H);
  } catch {}
}
async function Fl5() {
  let H = l$H(),

```

**Verdict:** PASS — symbol present in cited window

### Sample — `gl5` at `cli_inner_pretty.js:555422-555433` (cited in `00_overview/symbol_additions_v2_1_142_shell_snapshot.md`)

```js
}
async function gl5() {
  let H = { messages: 0, errors: 0 },
    $ = l$H();
  if ($ === null) return H;
  let q = XA.join(b8(), "hfi-auth.json");
  try {
    if (await Xd(q, $, C$())) H.messages++;
  } catch (K) {
    if (!f8(K)) (N(`Failed to clean up HFI auth file: ${K}`, { level: "error" }), H.errors++);
  }
  return H;
}
async function Ql5() {
  let H = { messages: 0, errors: 0 },

```

**Verdict:** PASS — symbol present in cited window

### Sample — `lp7` at `cli_inner_pretty.js:360470-360472` (cited in `00_overview/symbol_additions_v2_1_142_shell_snapshot.md`)

```js
});
function lp7(H) {
  return qi_(H) + " < /dev/null";
}
function qi_(H) {
  return "'" + H.replaceAll("'", `'"'"'`) + "'";

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Mi_` at `cli_inner_pretty.js:360831-360831` (cited in `38_shell_snapshot/command_assembly.md`)

```js
}
function Mi_(H) {
  let $ = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
    q = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `nl5` at `cli_inner_pretty.js:555482-555482` (cited in `38_shell_snapshot/retention_cleanup.md`)

```js
}
function nl5() {
  return TZ8("tasks");
}

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 138 PASS / 14 WARN
- C2 Line/symbol pairing: 128 PASS / 5 FAIL
- C3 Range sanity: 184 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 - ORIGINAL fidelity (3 sampled blocks)

### Sample - `38_shell_snapshot/config_file_detection.md` block citing `cli_inner_pretty.js:360597-360660`
- Identifiers in ORIGINAL block: 77
- Present in cited bundle window: 77
- Fidelity: 100.0%
- **Verdict: PASS**

### Sample - `38_shell_snapshot/env_snapshot.md` block citing `cli_inner_pretty.js:361221-361232`
- Identifiers in ORIGINAL block: 22
- Present in cited bundle window: 21
- Fidelity: 95.5%
- **Verdict: PASS**

### Sample - `38_shell_snapshot/command_assembly.md` block citing `cli_inner_pretty.js:360853-360855`
- Identifiers in ORIGINAL block: 12
- Present in cited bundle window: 12
- Fidelity: 100.0%
- **Verdict: PASS**

