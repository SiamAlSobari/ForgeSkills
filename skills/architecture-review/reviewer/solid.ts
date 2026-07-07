import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanSOLID(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "tsx", "js", "jsx", "mjs", "cjs", "py", "go", "java", "php"];
  const globPattern = `**/*.{${codeExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**", "**/*.test.*", "**/*.spec.*"],
  });

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // SRP: Check for classes with too many methods
    const classRegex = /class\s+(\w+)[^{]*\{([\s\S]*?)\n\}/g;
    let classMatch: RegExpExecArray | null;

    while ((classMatch = classRegex.exec(content)) !== null) {
      const className = classMatch[1];
      const classBody = classMatch[2];
      if (!classBody) continue;

      const methodCount = (classBody.match(/(?:async\s+)?(?:get\s+)?(?:\w+)\s*\(/g) || []).length;

      if (methodCount > 10) {
        const line = content.slice(0, classMatch.index).split("\n").length;
        findings.push(
          createFinding({
            title: "SRP Violation: Too Many Methods",
            description: `Class '${className}' has ${methodCount} methods. It likely has too many responsibilities.`,
            severity: Severity.Medium,
            confidence: Confidence.Medium,
            category: "SOLID",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet: `class ${className} { ... } (${methodCount} methods)`,
                description: "SRP violation",
              },
            ],
            recommendation: "Split class into smaller classes with single responsibility.",
          })
        );
      }
    }

    // DIP: Check for new keyword on concrete classes
    const newRegex = /new\s+([A-Z]\w+)\s*\(/g;
    let newMatch: RegExpExecArray | null;

    while ((newMatch = newRegex.exec(content)) !== null) {
      const className = newMatch[1]!;
      // Skip common framework classes
      if (["Error", "Map", "Set", "Array", "Object", "Promise", "Date", "RegExp", "Response", "Request"].includes(className)) continue;

      const line = content.slice(0, newMatch.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", newMatch.index) + 1;
      const lineEnd = content.indexOf("\n", newMatch.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      // Skip if in factory or test
      if (/factory|test|spec|mock/i.test(file)) continue;

      findings.push(
        createFinding({
          title: "DIP Violation: Concrete Dependency",
          description: `Direct instantiation of '${className}'. Consider using dependency injection.`,
          severity: Severity.Low,
          confidence: Confidence.Low,
          category: "SOLID",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line,
              snippet,
              description: `new ${className}(...)`,
            },
          ],
          recommendation: "Inject dependency through constructor or use factory pattern.",
        })
      );
    }
  }

  return findings;
}
