import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanSupplyChain(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return findings;

  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return findings;
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Check for suspicious patterns
  for (const [name, version] of Object.entries(deps)) {
    const versionStr = version as string;

    // Check for git URLs (can contain malicious code)
    if (versionStr.startsWith("git+") || versionStr.startsWith("github:") || versionStr.startsWith("git:")) {
      findings.push(
        createFinding({
          title: `Git Dependency: ${name}`,
          description: `Package '${name}' uses a git URL. This bypasses npm registry security checks.`,
          severity: Severity.Medium,
          confidence: Confidence.Medium,
          category: "Supply Chain",
          evidence: [
            {
              type: EvidenceType.Dependency,
              file: "package.json",
              snippet: `"${name}": "${versionStr}"`,
              description: "Git URL dependency",
            },
          ],
          recommendation: "Use npm registry version if possible. Review git repository for security.",
        })
      );
    }

    // Check for file: protocol (local packages)
    if (versionStr.startsWith("file:")) {
      findings.push(
        createFinding({
          title: `Local Dependency: ${name}`,
          description: `Package '${name}' uses file: protocol. Won't work when published.`,
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Supply Chain",
          evidence: [
            {
              type: EvidenceType.Dependency,
              file: "package.json",
              snippet: `"${name}": "${versionStr}"`,
              description: "Local file dependency",
            },
          ],
          recommendation: "Publish package to npm or use workspace protocol.",
        })
      );
    }

    // Check for URL-based dependencies
    if (versionStr.startsWith("http:") || versionStr.startsWith("https:")) {
      findings.push(
        createFinding({
          title: `URL Dependency: ${name}`,
          description: `Package '${name}' uses a URL. Content may change without version change.`,
          severity: Severity.High,
          confidence: Confidence.High,
          category: "Supply Chain",
          evidence: [
            {
              type: EvidenceType.Dependency,
              file: "package.json",
              snippet: `"${name}": "${versionStr}"`,
              description: "URL-based dependency",
            },
          ],
          recommendation: "Use npm registry version for security and reproducibility.",
        })
      );
    }
  }

  // Check for postinstall scripts
  const nodeModulesPath = join(root, "node_modules");
  if (existsSync(nodeModulesPath)) {
    for (const depName of Object.keys(deps)) {
      const depPkgPath = join(nodeModulesPath, depName, "package.json");

      if (existsSync(depPkgPath)) {
        try {
          const depPkg = JSON.parse(readFileSync(depPkgPath, "utf-8"));
          const scripts = depPkg.scripts || {};

          if (scripts.postinstall || scripts.preinstall || scripts.install) {
            findings.push(
              createFinding({
                title: `Install Script: ${depName}`,
                description: `Package '${depName}' runs code on install. Could be malicious.`,
                severity: Severity.Medium,
                confidence: Confidence.Low,
                category: "Supply Chain",
                evidence: [
                  {
                    type: EvidenceType.Dependency,
                    file: `node_modules/${depName}/package.json`,
                    snippet: `"postinstall": "${scripts.postinstall || scripts.preinstall || scripts.install}"`,
                    description: "Install-time script",
                  },
                ],
                recommendation: "Review the install script code for security.",
              })
            );
          }
        } catch {
          // Skip if can't read
        }
      }
    }
  }

  return findings;
}
