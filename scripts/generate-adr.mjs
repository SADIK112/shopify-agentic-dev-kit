#!/usr/bin/env node
// Usage: node scripts/generate-adr.mjs "short-title-as-slug"
// Creates docs/adr/NNNN-<slug>.md from docs/adr/TEMPLATE.md (auto-numbers),
// then appends a one-line entry to .ai/DECISIONS.md.
//
// Example: node scripts/generate-adr.mjs "no-raw-sql-without-adr"
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const ADR_DIR = join(ROOT, "docs/adr");
const DECISIONS_PATH = join(ROOT, ".ai/DECISIONS.md");
const TEMPLATE_PATH = join(ADR_DIR, "TEMPLATE.md");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/generate-adr.mjs \"short-title-slug\"");
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Slug must be lowercase letters, numbers, and hyphens only. Got: "${slug}"`);
  console.error("Example: node scripts/generate-adr.mjs \"no-raw-sql-without-adr\"");
  process.exit(1);
}

// Find the next ADR number by scanning existing files.
const existing = readdirSync(ADR_DIR)
  .map(f => parseInt(f.match(/^(\d+)/)?.[1] ?? "0", 10))
  .filter(n => n > 0);
const next = existing.length ? Math.max(...existing) + 1 : 1;
const num = String(next).padStart(4, "0");

const filename = `${num}-${slug}.md`;
const filepath = join(ADR_DIR, filename);

// Read template and replace placeholder.
const template = readFileSync(TEMPLATE_PATH, "utf8");
const content = template.replace("NNNN", num).replace(
  "Title (replace with a noun-phrase, not a verb)",
  slug.replace(/-/g, " "),
);

writeFileSync(filepath, content);
console.log(`Created: docs/adr/${filename}`);

// Append stub entry to DECISIONS.md.
const decisions = readFileSync(DECISIONS_PATH, "utf8");
const stub = `| ${next} | ${slug.replace(/-/g, " ")} | <why> | adr/${num} |`;

// Insert before the "## Standing tradeoffs" section if it exists, else append.
const updated = decisions.includes("## Standing tradeoffs")
  ? decisions.replace("## Standing tradeoffs", `${stub}\n\n## Standing tradeoffs`)
  : decisions + "\n" + stub;

writeFileSync(DECISIONS_PATH, updated);
console.log(`Updated: .ai/DECISIONS.md (entry ${next})`);
console.log(`\nEdit docs/adr/${filename} to fill in Context, Decision, and Consequences.`);
console.log(`Update the stub in .ai/DECISIONS.md with a one-line "why".`);
