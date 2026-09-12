import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([
  ".git",
  ".next",
  "node_modules",
  ".vercel",
  "dist",
  "build",
  "coverage",
]);
const lines = [path.basename(root)];

function walk(dir, prefix = "") {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !ignored.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    lines.push(prefix + connector + entry.name);
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), prefix + (isLast ? "    " : "│   "));
    }
  });
}

walk(root);
fs.writeFileSync(
  path.join(root, "PROJECT_STRUCTURE.txt"),
  `${lines.join("\n")}\n`,
);
console.log("Updated PROJECT_STRUCTURE.txt");
