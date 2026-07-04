import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanModularity(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "tsx", "js", "jsx", "mjs", "cjs"];
  const globPattern = `**/*.{${codeExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**", "**/*.test.*", "**/*.spec.*"],
  });

  // Build import graph
  const imports = new Map<string, Set<string>>();

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const fileImports = new Set<string>();
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]!;
      if (importPath.startsWith(".")) {
        const resolved = join(file, "..", importPath);
        fileImports.add(normalizePath(resolved));
      }
    }

    imports.set(normalizePath(file), fileImports);
  }

  // Check for cross-module imports
  const modules = new Map<string, string[]>();
  for (const file of files) {
    const parts = file.split(/[\/\\]/);
    if (parts.length >= 2) {
      const moduleName = parts[0]!;
      if (!modules.has(moduleName)) modules.set(moduleName, []);
      modules.get(moduleName)!.push(file);
    }
  }

  // Check for circular dependencies
  function hasCycle(node: string, visited: Set<string>, path: Set<string>): boolean {
    visited.add(node);
    path.add(node);

    const neighbors = imports.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, visited, path)) return true;
      } else if (path.has(neighbor)) {
        return true;
      }
    }

    path.delete(node);
    return false;
  }

  const visited = new Set<string>();
  for (const file of imports.keys()) {
    if (!visited.has(file)) {
      if (hasCycle(file, visited, new Set())) {
        findings.push(
          createFinding({
            title: "Circular Dependency",
            description: `Circular dependency detected involving ${file}.`,
            severity: Severity.High,
            confidence: Confidence.Medium,
            category: "Modularity",
            evidence: [
              {
                type: EvidenceType.FileStructure,
                file,
                description: "Circular dependency in import graph",
              },
            ],
            recommendation: "Break circular dependency by extracting shared code to a separate module.",
          })
        );
      }
    }
  }

  return findings;
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/\/+/g, "/");
}
