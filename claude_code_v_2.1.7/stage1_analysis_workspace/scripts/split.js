const acorn = require("acorn");
const walk = require("acorn-walk");
const fs = require("fs");
const path = require("path");

const CHUNK_THRESHOLD = 100_000;
const currentChunk = {
  pathCount: 1,
  content: "",
};

const source = fs.readFileSync(
  path.resolve(__dirname, "../cli.beautify.mjs"),
  "utf-8"
);

const ast = acorn.parse(source, {
  allowHashBang: true,
  sourceType: "module",
  ecmaVersion: "latest",
  locations: true,
});

const chunksDir = path.resolve(__dirname, "../chunks");

const chunksEntry = path.resolve(chunksDir, "cli.chunks.mjs");
fs.writeFileSync(chunksEntry, "");

// help Mac users with case-insensitive file system
const namedSet = new Set();
function namer(value) {
  let count = 0;
  let newValue = `${value.toLowerCase()}_${count}`;
  while (namedSet.has(newValue)) {
    count++;
    newValue = `${value.toLowerCase()}_${count}`;
  }
  namedSet.add(newValue);
  return newValue;
}

const chunksIndex = {};

// Extract file header (shebang, version comment, imports) before first AST node
const firstNodeStart = ast.body.length > 0 ? ast.body[0].start : 0;
const fileHeader = source.slice(0, firstNodeStart);
if (fileHeader.trim()) {
  currentChunk.content = `// === FILE HEADER ===\n${fileHeader}\n// === END FILE HEADER ===\n`;
}

walk.fullAncestor(ast, (node, _state, ancestors) => {
  if (node.type === "Program") {
    return;
  }

  const lastAncestor = ancestors[ancestors.length - 2]; // exclude current
  if (lastAncestor.type !== "Program") {
    // only split top level
    return;
  }

  let splited = false;
  switch (node.type) {
    case "FunctionDeclaration":
      splited = writeWithCheck(getContent(node), node.id.name);
      return;
    case "ExportNamedDeclaration": {
      if (node.specifiers && node.specifiers.length > 0) {
        let exportSpec = node.specifiers.find((s) => s.type === "ExportSpecifier");
        if (exportSpec) {
          splited = writeWithCheck(getContent(node), exportSpec.exported.name);
          return;
        }
      }
      if (node.declaration) {
        if (node.declaration.id) {
          splited = writeWithCheck(getContent(node), node.declaration.id.name);
          return;
        }
        if (node.declaration.declarations) {
          node.declaration.declarations.forEach((decl) => {
            if (decl.id && decl.id.name) {
              writeWithCheck(getContent(decl), decl.id.name);
            }
          });
          return;
        }
      }
      appendToEntry(node);
      return;
    }
    case "VariableDeclaration":
      if (node.declarations.some((decl) => decl.id.type !== "Identifier")) {
        appendToEntry(node);
        return;
      }
      const seenNames = new Set();
      node.declarations.forEach((decl) => {
        if (!seenNames.has(decl.id.name)) {
          seenNames.add(decl.id.name);
          writeWithCheck(getContent(decl), decl.id.name);
        }
      });
      return;
    case "ClassDeclaration":
      splited = writeWithCheck(getContent(node), node.id.name);
      return;
    default:
  }

  if (!splited) {
    appendToEntry(node);
  }
});

// flush last chunk
fs.writeFileSync(
  path.resolve(chunksDir, `chunks.${currentChunk.pathCount}.mjs`),
  currentChunk.content
);

fs.writeFileSync(
  path.resolve(chunksDir, `chunks.index.json`),
  JSON.stringify(chunksIndex, null, 2)
);

console.log(`Split complete. Created ${currentChunk.pathCount} chunk files.`);
console.log(`Index saved to chunks.index.json`);

function getContent(node) {
  return `\n// @from(${getPositionInfo(node)})\n${source.slice(
    node.start,
    node.end
  )}`;
}

function writeWithCheck(content, name) {
  const chunkPath = path.resolve(chunksDir, `chunks.${currentChunk.pathCount}.mjs`);
  if (currentChunk.content.length + content.length > CHUNK_THRESHOLD) {
    // flush
    fs.writeFileSync(chunkPath, currentChunk.content);
    currentChunk.content = "";
    currentChunk.pathCount++;
  }

  if (chunksIndex[name]) {
    // handle name conflict by appending suffix
    let newName = name;
    let suffix = 1;
    while (chunksIndex[newName]) {
      newName = `${name}_${suffix}`;
      suffix++;
    }
    name = newName;
  }
  chunksIndex[name] = path.relative(chunksDir, chunkPath);

  currentChunk.content += content;
  return true;
}

function appendToEntry(node) {
  fs.appendFileSync(
    chunksEntry,
    `\n// @from(${getPositionInfo(node)})\n` + getContent(node) + "\n"
  );
}

function getPositionInfo(node) {
  return node.loc
    ? `Ln ${node.loc.start.line}, Col ${node.loc.start.column}`
    : `Start ${node.start}, End ${node.end}`;
}
