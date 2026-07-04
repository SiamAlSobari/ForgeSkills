import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanVersion(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return findings;

  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return findings;
  }

  const version = pkg.version;

  // Check version exists
  if (!version) {
    findings.push(
      createFinding({
        title: "Missing Version",
        description: "package.json has no version field.",
        severity: Severity.High,
        confidence: Confidence.High,
        category: "Version",
        evidence: [{ type: EvidenceType.Configuration, file: "package.json", description: "No version field" }],
        recommendation: "Add version to package.json.",
      })
    );
    return findings;
  }

  // Check semantic versioning
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
  if (!semverRegex.test(version)) {
    findings.push(
      createFinding({
        title: "Invalid Version Format",
        description: `Version '${version}' doesn't follow semantic versioning.`,
        severity: Severity.Medium,
        confidence: Confidence.High,
        category: "Version",
        evidence: [{ type: EvidenceType.Configuration, file: "package.json", snippet: `"version": "${version}"`, description: "Invalid version format" }],
        recommendation: "Use semantic versioning: MAJOR.MINOR.PATCH",
      })
    );
  }

  // Check if version is 0.x (pre-1.0)
  if (version.startsWith("0.")) {
    findings.push(
      createFinding({
        title: "Pre-1.0 Version",
        description: `Version ${version} indicates pre-stable release.`,
        severity: Severity.Info,
        confidence: Confidence.High,
        category: "Version",
        evidence: [{ type: EvidenceType.Configuration, file: "package.json", snippet: `"version": "${version}"`, description: "Pre-1.0 version" }],
        recommendation: "Bump to 1.0.0 when ready for stable release.",
      })
    );
  }

  return findings;
}
