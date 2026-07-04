import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

const COPYLEFT_LICENSES = [
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.1",
  "LGPL-3.0",
];

export async function scanLicenses(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return findings;

  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return findings;
  }

  // Check project license
  const projectLicense = pkg.license;
  const isCommercial = !projectLicense || !["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC"].includes(projectLicense);

  // Check dependencies in node_modules
  const deps = { ...pkg.dependencies };

  for (const depName of Object.keys(deps)) {
    const depPkgPath = join(root, "node_modules", depName, "package.json");

    if (existsSync(depPkgPath)) {
      try {
        const depPkg = JSON.parse(readFileSync(depPkgPath, "utf-8"));
        const license = depPkg.license;

        if (license && typeof license === "string") {
          // Check for copyleft in commercial project
          if (isCommercial && COPYLEFT_LICENSES.some((l) => license.includes(l))) {
            findings.push(
              createFinding({
                title: `Copyleft License: ${depName}`,
                description: `Package '${depName}' uses ${license}. Copyleft may require open-sourcing your code.`,
                severity: Severity.High,
                confidence: Confidence.Medium,
                category: "License",
                evidence: [
                  {
                    type: EvidenceType.Dependency,
                    file: `node_modules/${depName}/package.json`,
                    snippet: `"license": "${license}"`,
                    description: "Copyleft license",
                  },
                ],
                recommendation: "Review license terms. Consider alternative package with permissive license.",
              })
            );
          }
        }
      } catch {
        // Skip if can't read
      }
    }
  }

  return findings;
}
