const beautify = require("js-beautify").js;
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(
  "/Users/linyuzhi/codespace/myagent/analyze/cc/2107_cli.js",
  "utf-8"
);

const beautified = beautify(source, {
  indent_size: 2,
  space_in_empty_paren: true,
  preserve_newlines: true,
  max_preserve_newlines: 2,
  jslint_happy: false,
  space_after_anon_function: true,
  brace_style: "collapse",
  keep_array_indentation: false,
  keep_function_indentation: false,
  space_before_conditional: true,
  break_chained_methods: false,
  eval_code: false,
  unescape_strings: false,
  wrap_line_length: 0,
});

fs.writeFileSync(
  path.resolve(__dirname, "../cli.beautify.mjs"),
  beautified
);

console.log("Beautification complete. Output: cli.beautify.mjs");
