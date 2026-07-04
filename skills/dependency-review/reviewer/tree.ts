import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanTree(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check for lock file
  const lockFiles = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lock"];
  let hasLockFile = false;

  for (const lockFile of lockFiles) {
    if (existsSync(join(root, lockFile))) {
      hasLockFile = true;
      break;
    }
  }

  if (!hasLockFile) {
    // Check if package.json exists
    if (existsSync(join(root, "package.json"))) {
      findings.push(
        createFinding({
          title: "Missing Lock File",
          description: "No lock file found. Dependencies may resolve to different versions across environments.",
          severity: Severity.Medium,
          confidence: Confidence.High,
          category: "Dependency Tree",
          evidence: [
            {
              type: EvidenceType.FileStructure,
              file: "package.json",
              description: "No package-lock.json, yarn.lock, or pnpm-lock.yaml",
            },
          ],
          recommendation: "Run 'npm install' to generate a lock file and commit it.",
        })
      );
    }
  }

  // Check package.json for issues
  const pkgPath = join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Check for too many dependencies
      const depCount = Object.keys(deps).length;
      if (depCount > 50) {
        findings.push(
          createFinding({
            title: "Too Many Dependencies",
            description: `Project has ${depCount} dependencies. Consider reducing for smaller bundle and fewer attack vectors.`,
            severity: Severity.Low,
            confidence: Confidence.Medium,
            category: "Dependency Tree",
            evidence: [
              {
                type: EvidenceType.Dependency,
                file: "package.json",
                description: `${depCount} total dependencies`,
              },
            ],
            recommendation: "Review dependencies and remove unused ones. Consider lighter alternatives.",
          })
        );
      }

      // Check for duplicate dependencies (same package in both deps and devDeps)
      const prodDeps = Object.keys(pkg.dependencies || {});
      const devDepKeys = Object.keys(pkg.devDependencies || {});
      const duplicates = prodDeps.filter((d) => devDepKeys.includes(d));

      for (const dup of duplicates) {
        findings.push(
          createFinding({
            title: `Duplicate Dependency: ${dup}`,
            description: `Package '${dup}' is in both dependencies and devDependencies.`,
            severity: Severity.Low,
            confidence: Confidence.High,
            category: "Dependency Tree",
            evidence: [
              {
                type: EvidenceType.Dependency,
                file: "package.json",
                snippet: `"${dup}" in both dependencies and devDependencies`,
                description: "Duplicate entry",
              },
            ],
            recommendation: `Remove from one: keep in dependencies if needed at runtime, devDependencies otherwise.`,
          })
        );
      }
    } catch {
      // Ignore parse errors
    }
  }

  return findings;
}
