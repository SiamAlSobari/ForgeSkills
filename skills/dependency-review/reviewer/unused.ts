import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanUnused(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return findings;

  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return findings;
  }

  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});
  const allDeps = [...deps, ...devDeps];

  // Scan source files for imports
  const codeExtensions = ["ts", "tsx", "js", "jsx", "mjs", "cjs"];
  const globPattern = `**/*.{${codeExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**"],
  });

  const usedPackages = new Set<string>();

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Check for imports/requires
    for (const dep of allDeps) {
      // Match import from 'dep' or require('dep')
      const importRegex = new RegExp(
        `(?:import\\s+.*\\s+from\\s+['"]${escapeRegex(dep)}(?:/[^'"]*)?['"]|require\\s*\\(\\s*['"]${escapeRegex(dep)}(?:/[^'"]*)?['"]\\s*\\))`,
        "g"
      );

      if (importRegex.test(content)) {
        usedPackages.add(dep);
      }
    }
  }

  // Find unused dependencies
  for (const dep of deps) {
    if (!usedPackages.has(dep)) {
      findings.push(
        createFinding({
          title: `Unused Dependency: ${dep}`,
          description: `Package '${dep}' is in dependencies but not imported in any source file.`,
          severity: Severity.Low,
          confidence: Confidence.Medium,
          category: "Unused",
          evidence: [
            {
              type: EvidenceType.Dependency,
              file: "package.json",
              snippet: `"${dep}" in dependencies`,
              description: "Not imported in source code",
            },
          ],
          recommendation: `Run 'npm uninstall ${dep}' if not needed, or move to devDependencies.`,
        })
      );
    }
  }

  // Find misplaced devDependencies
  const devOnlyPatterns = [
    /jest|vitest|mocha|chai|sinon/i,
    /eslint|prettier|tslint/i,
    /typescript|@types\//i,
    /webpack|vite|rollup|esbuild/i,
    /nodemon|ts-node/i,
  ];

  for (const dep of deps) {
    const isDevOnly = devOnlyPatterns.some((p) => p.test(dep));
    if (isDevOnly) {
      findings.push(
        createFinding({
          title: `Misplaced Dependency: ${dep}`,
          description: `Package '${dep}' should be in devDependencies, not dependencies.`,
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Unused",
          evidence: [
            {
              type: EvidenceType.Dependency,
              file: "package.json",
              snippet: `"${dep}" in dependencies`,
              description: "Development tool in production dependencies",
            },
          ],
          recommendation: `Move to devDependencies: npm install --save-dev ${dep}`,
        })
      );
    }
  }

  return findings;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
