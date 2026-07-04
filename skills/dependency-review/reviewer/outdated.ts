import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

const DEPRECATED_PACKAGES: Record<string, { alternative: string; severity: Severity }> = {
  "moment": { alternative: "dayjs or date-fns", severity: Severity.Medium },
  "request": { alternative: "node-fetch, axios, or got", severity: Severity.High },
  "node-uuid": { alternative: "uuid", severity: Severity.Medium },
  "left-pad": { alternative: "String.padStart()", severity: Severity.Low },
  "istanbul": { alternative: "nyc or c8", severity: Severity.Low },
  "tslint": { alternative: "eslint with @typescript-eslint", severity: Severity.Medium },
};

export async function scanOutdated(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check package.json
  const pkgPath = join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      for (const [name, version] of Object.entries(allDeps)) {
        const versionStr = version as string;

        // Check for deprecated packages
        if (name in DEPRECATED_PACKAGES) {
          const info = DEPRECATED_PACKAGES[name]!;
          findings.push(
            createFinding({
              title: `Deprecated Package: ${name}`,
              description: `Package '${name}' is deprecated. Use ${info.alternative} instead.`,
              severity: info.severity,
              confidence: Confidence.High,
              category: "Outdated",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "package.json",
                  snippet: `"${name}": "${versionStr}"`,
                  description: "Deprecated dependency",
                },
              ],
              recommendation: `Replace '${name}' with ${info.alternative}.`,
            })
          );
        }

        // Check for wildcard versions
        if (versionStr === "*" || versionStr === "latest") {
          findings.push(
            createFinding({
              title: `Unpinned Version: ${name}`,
              description: `Package '${name}' uses '${versionStr}' which can break unexpectedly.`,
              severity: Severity.High,
              confidence: Confidence.High,
              category: "Outdated",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "package.json",
                  snippet: `"${name}": "${versionStr}"`,
                  description: "Unpinned version",
                },
              ],
              recommendation: "Pin to a specific version range (e.g., ^1.2.3).",
            })
          );
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Check go.mod
  const goModPath = join(root, "go.mod");
  if (existsSync(goModPath)) {
    try {
      const content = readFileSync(goModPath, "utf-8");
      // Check for very old Go version
      const goVersionMatch = content.match(/go\s+(\d+\.\d+)/);
      if (goVersionMatch) {
        const version = parseFloat(goVersionMatch[1]!);
        if (version < 1.18) {
          findings.push(
            createFinding({
              title: "Outdated Go Version",
              description: `Go version ${goVersionMatch[1]} is outdated. Current stable is 1.21+.`,
              severity: Severity.Medium,
              confidence: Confidence.High,
              category: "Outdated",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "go.mod",
                  snippet: `go ${goVersionMatch[1]}`,
                  description: "Outdated Go version",
                },
              ],
              recommendation: "Update to Go 1.21 or later for security patches and features.",
            })
          );
        }
      }
    } catch {
      // Ignore
    }
  }

  // Check requirements.txt
  const reqPath = join(root, "requirements.txt");
  if (existsSync(reqPath)) {
    try {
      const content = readFileSync(reqPath, "utf-8");
      const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));

      for (const line of lines) {
        const [name] = line.split(/[=<>!]/);
        if (!name) continue;

        // Check for deprecated Python packages
        const deprecatedPython: Record<string, string> = {
          "nose": "pytest",
          "fabric": "fabric2",
          "pycrypto": "pycryptodome",
        };

        if (name.trim() in deprecatedPython) {
          findings.push(
            createFinding({
              title: `Deprecated Package: ${name.trim()}`,
              description: `Package '${name.trim()}' is deprecated. Use ${deprecatedPython[name.trim()]} instead.`,
              severity: Severity.Medium,
              confidence: Confidence.High,
              category: "Outdated",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "requirements.txt",
                  snippet: line.trim(),
                  description: "Deprecated dependency",
                },
              ],
              recommendation: `Replace with ${deprecatedPython[name.trim()]}.`,
            })
          );
        }
      }
    } catch {
      // Ignore
    }
  }

  return findings;
}
