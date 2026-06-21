#!/usr/bin/env node
// Enforces the architecture boundaries from .ai/ARCHITECTURE.md.
// Fails (exit 1) on violations so `npm run check` and CI catch them.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, "app");
const violations = [];
const warnings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(ts|tsx)$/.test(name) || name.endsWith(".d.ts")) continue;
    check(p, readFileSync(p, "utf8"));
  }
}

// Strip line comments, block comments, and string/template literals so we match
// real code, not prose in comments or example strings.
function stripNonCode(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")   // block comments
    .replace(/\/\/[^\n]*/g, " ")          // line comments
    .replace(/`(?:\\.|[^`\\])*`/g, "``")  // template literals
    .replace(/"(?:\\.|[^"\\])*"/g, '""')  // double-quoted strings
    .replace(/'(?:\\.|[^'\\])*'/g, "''"); // single-quoted strings
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ");
}

// Only treat a `#graphql` template literal as "inline" — comments are fine.
function hasInlineGraphql(src) {
  return /`#graphql/.test(src);
}

// Heuristic: repository Prisma queries that look like they might be missing shop
// scoping. Flags findMany/findFirst calls without a { where: ... shop ... } pattern.
// This is a warning, not a hard failure — the heuristic has false positives for
// global-scope queries (sessions, config). Review manually.
function checkShopScope(file, src, rel) {
  // Skip files that explicitly opt out with a comment
  if (/shop-scope-exempt/.test(src)) return;
  const calls = src.match(/\.(findMany|findFirst)\s*\(\s*\{[^)]{0,400}\}/gs) ?? [];
  for (const call of calls) {
    if (!/\bshop\b/.test(call)) {
      warnings.push(`${rel}: Prisma ${call.match(/\.(findMany|findFirst)/)?.[1]} may be missing shop scope — verify multi-tenant safety`);
    }
  }
}

function check(file, rawSrc) {
  const rel = relative(ROOT, file);
  const src = stripNonCode(rawSrc);          // comments + strings removed
  const noComments = stripComments(rawSrc);  // comments removed, strings kept
  const isRepo = /\/repositories\//.test(rel);
  const isRoute = /\/routes\//.test(rel) || /\.route\./.test(rel);
  const isService = /\/services\//.test(rel);
  const isSharedClient = /shared\/lib\//.test(rel);

  // Prisma only in repositories (strings kept so we see import paths; comments gone)
  if (!isRepo && /@prisma\/client|prisma\.server/.test(noComments) && !/shared\/lib\/prisma\.server/.test(rel)) {
    violations.push(`${rel}: imports Prisma outside repositories/`);
  }
  // No inline GraphQL in routes (check raw — the tag lives in a template literal)
  if (isRoute && hasInlineGraphql(rawSrc)) {
    violations.push(`${rel}: inline GraphQL in a route (move to domain graphql/)`);
  }
  // Services must not import Remix or Prisma (import statements only)
  if (isService && /import[^;]*@remix-run\//.test(src)) {
    violations.push(`${rel}: service imports @remix-run/* (keep services framework-free)`);
  }
  // File size ceiling
  const lines = rawSrc.split("\n").length;
  if (lines > 300) violations.push(`${rel}: ${lines} lines (>300 hard ceiling — split)`);
  // Explicit `any` annotations in app code (allow in shared low-level adapters
  // and anything with an eslint-disable acknowledging the exception)
  if (!isSharedClient && /eslint-disable/.test(rawSrc) === false && /:\s*any\b|<any>/.test(src)) {
    violations.push(`${rel}: explicit \`any\` type (use unknown + narrowing)`);
  }
  // process.env access only allowed in shared/lib/ (centralized config layer).
  // Services, routes, and repositories must receive config via injected clients.
  if (!isSharedClient && /\bprocess\.env\b/.test(src)) {
    violations.push(`${rel}: direct process.env access outside shared/lib/ — centralize config in app/shared/lib/ (e.g. env.ts)`);
  }
  // Shop-scope heuristic (repositories only — that's where all Prisma lives)
  if (isRepo) checkShopScope(file, noComments, rel);
}

try { walk(APP); } catch (e) { if (e.code !== "ENOENT") throw e; /* app/ not yet created */ }

if (warnings.length) {
  console.warn("Architecture warnings (review manually):\n" + warnings.map(v => "  ~ " + v).join("\n"));
  console.warn();
}

if (violations.length) {
  console.error("Architecture check FAILED:\n" + violations.map(v => "  - " + v).join("\n"));
  process.exit(1);
}
console.log(`Architecture check passed.${warnings.length ? ` (${warnings.length} warning(s) above)` : ""}`);
