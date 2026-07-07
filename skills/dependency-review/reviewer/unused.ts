import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanUnused(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const hasPkg = existsSync(join(root, "package.json"));
  const hasGo = existsSync(join(root, "go.mod"));
  const hasPy = existsSync(join(root, "requirements.txt"));
  const hasPhp = existsSync(join(root, "composer.json"));
  const hasJava = existsSync(join(root, "pom.xml"));

  // 1. Node.js (JavaScript/TypeScript)
  if (hasPkg) {
    const pkgPath = join(root, "package.json");
    let pkg: any;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    } catch {}

    if (pkg) {
      const deps = Object.keys(pkg.dependencies || {});
      const devDeps = Object.keys(pkg.devDependencies || {});
      const allDeps = [...deps, ...devDeps];

      const files = await fg("**/*.{ts,tsx,js,jsx,mjs,cjs}", {
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

        for (const dep of allDeps) {
          const importRegex = new RegExp(
            `(?:import\\s+.*\\s+from\\s+['"]${escapeRegex(dep)}(?:/[^'"]*)?['"]|require\\s*\\(\\s*['"]${escapeRegex(dep)}(?:/[^'"]*)?['"]\\s*\\))`,
            "g"
          );
          if (importRegex.test(content)) {
            usedPackages.add(dep);
          }
        }
      }

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
    }
  }

  // 2. Go
  if (hasGo) {
    const goModPath = join(root, "go.mod");
    let content = "";
    try {
      content = readFileSync(goModPath, "utf-8");
    } catch {}

    const goDeps: string[] = [];
    const lines = content.split("\n");
    let inRequireBlock = false;
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("require (")) {
        inRequireBlock = true;
        continue;
      }
      if (inRequireBlock && line === ")") {
        inRequireBlock = false;
        continue;
      }
      if (inRequireBlock) {
        const match = line.match(/^([^\s]+)/);
        if (match && match[1]) {
          goDeps.push(match[1]);
        }
      } else if (line.startsWith("require ")) {
        const match = line.slice(8).trim().match(/^([^\s]+)/);
        if (match && match[1]) {
          goDeps.push(match[1]);
        }
      }
    }

    if (goDeps.length > 0) {
      const files = await fg("**/*.go", {
        cwd: root,
        onlyFiles: true,
        ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**"],
      });

      const usedGoDeps = new Set<string>();
      for (const file of files) {
        let fileContent = "";
        try {
          fileContent = readFileSync(join(root, file), "utf-8");
        } catch {
          continue;
        }

        for (const dep of goDeps) {
          const importRegex = new RegExp(`"${escapeRegex(dep)}(?:/[^"]*)?"`);
          if (importRegex.test(fileContent)) {
            usedGoDeps.add(dep);
          }
        }
      }

      for (const dep of goDeps) {
        if (!usedGoDeps.has(dep)) {
          findings.push(
            createFinding({
              title: `Unused Dependency: ${dep}`,
              description: `Go module '${dep}' is required in go.mod but not imported in any source file.`,
              severity: Severity.Low,
              confidence: Confidence.Medium,
              category: "Unused",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "go.mod",
                  snippet: `require ${dep}`,
                  description: "Not imported in Go source code",
                },
              ],
              recommendation: `Run 'go mod tidy' to clean up unused dependencies.`,
            })
          );
        }
      }
    }
  }

  // 3. Python
  if (hasPy) {
    const reqPath = join(root, "requirements.txt");
    let content = "";
    try {
      content = readFileSync(reqPath, "utf-8");
    } catch {}

    const pyDeps: string[] = [];
    const lines = content.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#") || line.startsWith("-")) {
        continue;
      }
      const match = line.match(/^([a-zA-Z0-9_\-]+)/);
      if (match && match[1]) {
        pyDeps.push(match[1]);
      }
    }

    if (pyDeps.length > 0) {
      const files = await fg("**/*.py", {
        cwd: root,
        onlyFiles: true,
        ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**"],
      });

      const usedPyDeps = new Set<string>();
      for (const file of files) {
        let fileContent = "";
        try {
          fileContent = readFileSync(join(root, file), "utf-8");
        } catch {
          continue;
        }

        for (const dep of pyDeps) {
          const namesToCheck = [dep, dep.replace(/-/g, "_")];
          let isUsed = false;
          for (const name of namesToCheck) {
            const importRegex = new RegExp(
              `(?:^|\\n)\\s*(?:import\\s+(?:[^\\n]*,\\s*)*${escapeRegex(name)}(?:\\s+|$|\\.)|from\\s+${escapeRegex(name)}(?:\\s+|\\.)import)`,
              "i"
            );
            if (importRegex.test(fileContent)) {
              isUsed = true;
              break;
            }
          }
          if (isUsed) {
            usedPyDeps.add(dep);
          }
        }
      }

      for (const dep of pyDeps) {
        if (!usedPyDeps.has(dep)) {
          findings.push(
            createFinding({
              title: `Unused Dependency: ${dep}`,
              description: `Python package '${dep}' is in requirements.txt but not imported in any source file.`,
              severity: Severity.Low,
              confidence: Confidence.Medium,
              category: "Unused",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "requirements.txt",
                  snippet: dep,
                  description: "Not imported in Python source code",
                },
              ],
              recommendation: `Remove '${dep}' from requirements.txt if not needed.`,
            })
          );
        }
      }
    }
  }

  // 4. PHP
  if (hasPhp) {
    const composerPath = join(root, "composer.json");
    let content = "";
    try {
      content = readFileSync(composerPath, "utf-8");
    } catch {}

    let composerJson: any;
    try {
      composerJson = JSON.parse(content);
    } catch {}

    if (composerJson && composerJson.require) {
      const phpDeps = Object.keys(composerJson.require).filter(
        (dep) => dep !== "php" && !dep.startsWith("ext-")
      );

      if (phpDeps.length > 0) {
        const files = await fg("**/*.php", {
          cwd: root,
          onlyFiles: true,
          ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**", "**/vendor/**"],
        });

        const usedPhpDeps = new Set<string>();
        for (const file of files) {
          let fileContent = "";
          try {
            fileContent = readFileSync(join(root, file), "utf-8");
          } catch {
            continue;
          }

          for (const dep of phpDeps) {
            const [vendor, pkg] = dep.split("/");
            const candidates = new Set<string>();
            const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

            if (vendor) {
              candidates.add(vendor.toLowerCase());
              candidates.add(clean(vendor));
            }
            if (pkg) {
              candidates.add(pkg.toLowerCase());
              candidates.add(clean(pkg));
            }

            // Find all "use" statements
            const useRegex = /use\s+([a-zA-Z0-9_\\]+)/gi;
            let match: RegExpExecArray | null;
            let isUsed = false;

            while ((match = useRegex.exec(fileContent)) !== null) {
              const namespace = match[1];
              if (!namespace) continue;
              const nsParts = namespace.split("\\").map((p) => p.toLowerCase());
              for (const part of nsParts) {
                if (candidates.has(part)) {
                  isUsed = true;
                  break;
                }
              }
              if (isUsed) break;
            }

            // Also check require/include
            if (!isUsed) {
              const reqIncRegex = new RegExp(
                `(?:require|require_once|include|include_once)\\s*\\(?\\s*['"][^'"]*${escapeRegex(dep)}[^'"]*['"]`,
                "i"
              );
              if (reqIncRegex.test(fileContent)) {
                isUsed = true;
              }
            }

            if (isUsed) {
              usedPhpDeps.add(dep);
            }
          }
        }

        for (const dep of phpDeps) {
          if (!usedPhpDeps.has(dep)) {
            findings.push(
              createFinding({
                title: `Unused Dependency: ${dep}`,
                description: `Composer package '${dep}' is in require but not imported or required in any source file.`,
                severity: Severity.Low,
                confidence: Confidence.Medium,
                category: "Unused",
                evidence: [
                  {
                    type: EvidenceType.Dependency,
                    file: "composer.json",
                    snippet: `"${dep}"`,
                    description: "Not used in PHP source code",
                  },
                ],
                recommendation: `Run 'composer remove ${dep}' if not needed.`,
              })
            );
          }
        }
      }
    }
  }

  // 5. Java
  if (hasJava) {
    const pomPath = join(root, "pom.xml");
    let content = "";
    try {
      content = readFileSync(pomPath, "utf-8");
    } catch {}

    const javaDeps: { groupId: string; artifactId: string }[] = [];
    const dependencyBlocks = content.match(/<dependency>[\s\S]*?<\/dependency>/g) || [];
    for (const block of dependencyBlocks) {
      const groupIdMatch = block.match(/<groupId>([\s\S]*?)<\/groupId>/);
      const artifactIdMatch = block.match(/<artifactId>([\s\S]*?)<\/artifactId>/);
      if (groupIdMatch && artifactIdMatch && groupIdMatch[1] && artifactIdMatch[1]) {
        javaDeps.push({
          groupId: groupIdMatch[1].trim(),
          artifactId: artifactIdMatch[1].trim(),
        });
      }
    }

    if (javaDeps.length > 0) {
      const files = await fg("**/*.java", {
        cwd: root,
        onlyFiles: true,
        ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**", "**/target/**"],
      });

      const usedJavaDeps = new Set<string>();
      for (const file of files) {
        let fileContent = "";
        try {
          fileContent = readFileSync(join(root, file), "utf-8");
        } catch {
          continue;
        }

        for (const dep of javaDeps) {
          const nameVariants = [
            dep.groupId,
            dep.artifactId,
            dep.artifactId.replace(/-/g, "."),
            dep.artifactId.replace(/-/g, "_"),
            dep.artifactId.replace(/-/g, ""),
          ];
          const groupParts = dep.groupId.split(".");
          if (groupParts.length > 1) {
            const lastPart = groupParts.slice(-1)[0];
            if (lastPart !== undefined) {
              nameVariants.push(lastPart);
            }
            nameVariants.push(groupParts.slice(-2).join("."));
          }

          let isUsed = false;
          for (const variant of nameVariants) {
            const importRegex = new RegExp(`import\\s+(?:static\\s+)?(?:[a-zA-Z0-9._]+\\.)*${escapeRegex(variant)}(?:\\.[a-zA-Z0-9._]+)?\\s*;`, "i");
            if (importRegex.test(fileContent)) {
              isUsed = true;
              break;
            }
          }

          if (isUsed) {
            usedJavaDeps.add(`${dep.groupId}:${dep.artifactId}`);
          }
        }
      }

      for (const dep of javaDeps) {
        const key = `${dep.groupId}:${dep.artifactId}`;
        if (!usedJavaDeps.has(key)) {
          findings.push(
            createFinding({
              title: `Unused Dependency: ${key}`,
              description: `Maven dependency '${key}' is defined in pom.xml but not imported in any source file.`,
              severity: Severity.Low,
              confidence: Confidence.Medium,
              category: "Unused",
              evidence: [
                {
                  type: EvidenceType.Dependency,
                  file: "pom.xml",
                  snippet: `<artifactId>${dep.artifactId}</artifactId>`,
                  description: "Not imported in Java source code",
                },
              ],
              recommendation: `Remove dependency '${key}' from pom.xml if not needed.`,
            })
          );
        }
      }
    }
  }

  return findings;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
