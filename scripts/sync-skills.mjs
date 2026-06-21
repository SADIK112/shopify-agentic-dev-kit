#!/usr/bin/env node
// Verifies the Shopify Agent Skills referenced in .shopify/skills/registry.json
// are installed (present as symlinks in .claude/skills/) and prints install
// instructions for any that are missing.  Does NOT vendor skill payloads (ADR 0006).
import { readFileSync, existsSync, readdirSync, lstatSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, ".shopify/skills/registry.json");
const SKILLS_DIR = join(ROOT, ".claude/skills");

const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
const { toolkit, install, apiVersion, surfaces } = registry;

console.log(`Toolkit : ${toolkit}`);
console.log(`API ver : ${apiVersion}`);
console.log(`Install : ${install}\n`);

// Collect installed skill names from .claude/skills/ (symlinks or directories).
const installed = new Set();
if (existsSync(SKILLS_DIR)) {
  for (const name of readdirSync(SKILLS_DIR)) {
    const full = join(SKILLS_DIR, name);
    try {
      // Count both symlinks (normal install) and real directories (manual).
      const stat = lstatSync(full);
      if (stat.isSymbolicLink() || stat.isDirectory()) installed.add(name);
    } catch { /* skip unreadable entries */ }
  }
}

const missing = [];
console.log("Surface               → Skill                                    Installed?");
console.log("─".repeat(76));

for (const s of surfaces) {
  const ok = installed.has(s.skill);
  if (!ok && s.skill) missing.push(s.skill);
  const marker = ok ? "✓" : s.skill ? "✗ MISSING" : "(no skill)";
  console.log(`  ${s.surface.padEnd(20)}→ ${(s.skill ?? "—").padEnd(42)} ${marker}`);
}

console.log();
if (missing.length) {
  console.error(`${missing.length} skill(s) not found in .claude/skills/:\n`);
  for (const sk of missing) {
    console.error(`  npx skill install ${sk}`);
  }
  console.error(`\nOr install all at once: ${install}`);
  process.exit(1);
} else {
  console.log("All registry skills are installed. Skills auto-update via the Toolkit");
  console.log("plugin; do not commit their payloads (see ADR 0006).");
}
