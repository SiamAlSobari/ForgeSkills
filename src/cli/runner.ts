import { resolve } from "path";
import { analyzeRepository } from "../../shared/analyzer/repository";
import { calculateLanguageDistribution } from "../../shared/analyzer/language";
import { detectFrameworks } from "../../shared/analyzer/framework";
import { analyzeStructure } from "../../shared/analyzer/structure";
import { deduplicateFindings } from "../../shared/findings/prioritizer";
import { generateMarkdownReport, type ReportMetadata } from "../../shared/report/markdown";
import { generateJsonString } from "../../shared/report/json";
import type { Finding } from "../../shared/findings/types";

interface RunOptions {
  path?: string;
  quick?: boolean;
  deep?: boolean;
  markdown?: boolean;
  json?: boolean;
  verbose?: boolean;
  external?: boolean;
  lang?: string;
}

async function analyzeProject(root: string) {
  const repo = await analyzeRepository(root);
  const files = await import("fast-glob").then((fg) =>
    fg.default("**/*", {
      cwd: root,
      onlyFiles: true,
      ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    })
  );
  const language = calculateLanguageDistribution(files);
  const frameworks = await detectFrameworks(root);
  const structure = await analyzeStructure(root);

  return { repo, files, language, frameworks, structure };
}

function createMetadata(
  root: string,
  scanType: string,
  language: string,
  framework?: string
): ReportMetadata {
  return {
    projectName: root.split(/[\\/]/).pop() || "unknown",
    projectPath: root,
    language,
    framework,
    scanType,
    timestamp: new Date().toISOString(),
  };
}

function outputReport(findings: Finding[], metadata: ReportMetadata, options: RunOptions) {
  const deduplicated = deduplicateFindings(findings);

  if (options.json) {
    console.log(generateJsonString({ metadata, findings: deduplicated }));
  } else {
    console.log(generateMarkdownReport({ metadata, findings: deduplicated, locale: options.lang }));
  }
}

export async function runSecurityAudit(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running security audit on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);
  const primaryLang = language.primary.name;
  const primaryFramework = frameworks[0]?.name;

  const { scanForSecrets } = await import("../../skills/security-audit/reviewer/secrets.js");
  const { scanSourceCode } = await import("../../skills/security-audit/reviewer/source-code.js");
  const { scanConfigs } = await import("../../skills/security-audit/reviewer/config-review.js");
  const { scanInfrastructure } = await import("../../skills/security-audit/reviewer/infrastructure.js");

  const findings: Finding[] = [
    ...(await scanForSecrets(root)),
    ...(await scanSourceCode(root)),
    ...(await scanConfigs(root)),
    ...(await scanInfrastructure(root)),
  ];
  if (options.external) {
    const { runSemgrep } = await import("../shared/scanners/external.js");
    findings.push(...runSemgrep(root));
  }

  const metadata = createMetadata(root, "Security Audit", primaryLang, primaryFramework);
  outputReport(findings, metadata, options);
}

export async function runBugInvestigate(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running bug investigation on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanErrorLogs } = await import("../../skills/bug-investigate/reviewer/error-log.js");
  const { scanCodePaths } = await import("../../skills/bug-investigate/reviewer/code-path.js");
  const { scanRootCauses } = await import("../../skills/bug-investigate/reviewer/root-cause.js");
  const { scanEdgeCases } = await import("../../skills/bug-investigate/reviewer/edge-case.js");

  const findings: Finding[] = [
    ...(await scanErrorLogs(root)),
    ...(await scanCodePaths(root)),
    ...(await scanRootCauses(root)),
    ...(await scanEdgeCases(root)),
  ];

  const metadata = createMetadata(root, "Bug Investigation", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runPerformanceAudit(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running performance audit on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanQueries } = await import("../../skills/performance-audit/reviewer/query.js");
  const { scanMemory } = await import("../../skills/performance-audit/reviewer/memory.js");
  const { scanAlgorithms } = await import("../../skills/performance-audit/reviewer/algorithm.js");
  const { scanCaching } = await import("../../skills/performance-audit/reviewer/caching.js");
  const { scanResources } = await import("../../skills/performance-audit/reviewer/resource.js");

  const findings: Finding[] = [
    ...(await scanQueries(root)),
    ...(await scanMemory(root)),
    ...(await scanAlgorithms(root)),
    ...(await scanCaching(root)),
    ...(await scanResources(root)),
  ];

  const metadata = createMetadata(root, "Performance Audit", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runArchitectureReview(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running architecture review on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanPatterns } = await import("../../skills/architecture-review/reviewer/pattern.js");
  const { scanSeparation } = await import("../../skills/architecture-review/reviewer/separation.js");
  const { scanModularity } = await import("../../skills/architecture-review/reviewer/modularity.js");
  const { scanDebt } = await import("../../skills/architecture-review/reviewer/debt.js");
  const { scanSOLID } = await import("../../skills/architecture-review/reviewer/solid.js");

  const findings: Finding[] = [
    ...(await scanPatterns(root)),
    ...(await scanSeparation(root)),
    ...(await scanModularity(root)),
    ...(await scanDebt(root)),
    ...(await scanSOLID(root)),
  ];

  const metadata = createMetadata(root, "Architecture Review", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runDependencyReview(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running dependency review on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanOutdated } = await import("../../skills/dependency-review/reviewer/outdated.js");
  const { scanUnused } = await import("../../skills/dependency-review/reviewer/unused.js");
  const { scanTree } = await import("../../skills/dependency-review/reviewer/tree.js");
  const { scanLicenses } = await import("../../skills/dependency-review/reviewer/license.js");
  const { scanSupplyChain } = await import("../../skills/dependency-review/reviewer/supply-chain.js");

  const findings: Finding[] = [
    ...(await scanOutdated(root)),
    ...(await scanUnused(root)),
    ...(await scanTree(root)),
    ...(await scanLicenses(root)),
    ...(await scanSupplyChain(root)),
  ];
  if (options.external) {
    const { runNpmAudit } = await import("../shared/scanners/external.js");
    findings.push(...runNpmAudit(root));
  }

  const metadata = createMetadata(root, "Dependency Review", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runDatabaseReview(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running database review on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanQueryPerformance } = await import("../../skills/database-review/reviewer/query.js");
  const { scanIndexing } = await import("../../skills/database-review/reviewer/index.js");
  const { scanSchema } = await import("../../skills/database-review/reviewer/schema.js");
  const { scanAntiPatterns } = await import("../../skills/database-review/reviewer/anti-pattern.js");
  const { scanMigrations } = await import("../../skills/database-review/reviewer/migration.js");

  const findings: Finding[] = [
    ...(await scanQueryPerformance(root)),
    ...(await scanIndexing(root)),
    ...(await scanSchema(root)),
    ...(await scanAntiPatterns(root)),
    ...(await scanMigrations(root)),
  ];

  const metadata = createMetadata(root, "Database Review", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runReleaseCheck(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running release check on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanChangelog } = await import("../../skills/release-check/reviewer/changelog.js");
  const { scanVersion } = await import("../../skills/release-check/reviewer/version.js");
  const { scanCICD } = await import("../../skills/release-check/reviewer/ci-cd.js");
  const { scanDeployment } = await import("../../skills/release-check/reviewer/deployment.js");
  const { scanBreakingChanges } = await import("../../skills/release-check/reviewer/breaking-change.js");

  const findings: Finding[] = [
    ...(await scanChangelog(root)),
    ...(await scanVersion(root)),
    ...(await scanCICD(root)),
    ...(await scanDeployment(root)),
    ...(await scanBreakingChanges(root)),
  ];

  const metadata = createMetadata(root, "Release Check", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}

export async function runAiAudit(options: RunOptions) {
  const root = resolve(options.path || ".");
  if (!options.json) console.log(`Running AI audit on ${root}...`);

  const { language, frameworks } = await analyzeProject(root);

  const { scanClientConfig } = await import("../../skills/ai-audit/reviewer/client-config.js");
  const { scanPromptQuality } = await import("../../skills/ai-audit/reviewer/prompt-quality.js");
  const { scanFallbackSafety } = await import("../../skills/ai-audit/reviewer/fallback-safety.js");

  const findings: Finding[] = [
    ...(await scanClientConfig(root)),
    ...(await scanPromptQuality(root)),
    ...(await scanFallbackSafety(root)),
  ];

  const metadata = createMetadata(root, "AI Audit", language.primary.name, frameworks[0]?.name);
  outputReport(findings, metadata, options);
}
