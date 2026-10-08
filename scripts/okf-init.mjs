// Scaffold an OKF v0.2 bundle. Zero dependencies. Never overwrites: an existing file is skipped and reported.
//   node <plugin>/scripts/okf-init.mjs [--root .] [--bundle docs/okf] [--name "Project name"]
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (n) => (args.indexOf(`--${n}`) >= 0 ? args[args.indexOf(`--${n}`) + 1] : undefined);
const ROOT = resolve(flag("root") ?? ".");
const BUNDLE = flag("bundle") ?? "docs/okf";
const NAME = flag("name") ?? basename(ROOT);
const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "templates", "okf");
const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
const vars = { "{{NAME}}": NAME, "{{BUNDLE}}": BUNDLE, "{{DATE}}": now.slice(0, 10), "{{TIMESTAMP}}": now };
// template path -> destination under ROOT
const dest = (rel) => (rel === "okf.json" ? ".agents/okf.json" : rel === "CLAUDE.md" || rel === "AGENTS.md" ? rel : join(BUNDLE, rel));
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));

const created = [], skipped = [];
for (const file of walk(SRC)) {
  const target = join(ROOT, dest(relative(SRC, file)));
  if (existsSync(target)) { skipped.push(relative(ROOT, target)); continue; }
  let text = readFileSync(file, "utf8");
  for (const [k, v] of Object.entries(vars)) text = text.split(k).join(v);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, { flag: "wx" });
  created.push(relative(ROOT, target));
}
console.log(`created:\n${created.map((f) => `  ${f}`).join("\n") || "  (none)"}\nskipped (already exist, not touched):\n${skipped.map((f) => `  ${f}`).join("\n") || "  (none)"}`);
if (skipped.length) console.log("If an existing index.md, AGENTS.md or CLAUDE.md was skipped, add the missing links and pointers by hand, then run validate-okf.");
