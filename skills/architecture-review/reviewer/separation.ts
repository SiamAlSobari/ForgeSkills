import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanSeparation(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "tsx", "js", "jsx", "mjs", "cjs"];
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

    // Check for business logic in controllers
    if (/controller|handler|route/i.test(file)) {
      const businessLogicPatterns = [
        /await\s+\w+\.(?:save|create|update|delete|find)/g,
        /(?:hash|encrypt|bcrypt|crypto)\s*\(/g,
        /send(?:Email|SMS|Notification)\s*\(/g,
      ];

      for (const pattern of businessLogicPatterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(content)) !== null) {
          const line = content.slice(0, match.index).split("\n").length;
          const lineStart = content.lastIndexOf("\n", match.index) + 1;
          const lineEnd = content.indexOf("\n", match.index);
          const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

          findings.push(
            createFinding({
              title: "Business Logic in Controller",
              description: "Controller contains business logic. Move to service layer.",
              severity: Severity.Medium,
              confidence: Confidence.Medium,
              category: "Separation of Concerns",
              evidence: [
                {
                  type: EvidenceType.CodePattern,
                  file,
                  line,
                  snippet,
                  description: "Business logic found in controller",
                },
              ],
              recommendation: "Extract business logic to a service class.",
            })
          );
        }
      }
    }

    // Check for direct DB access in services
    if (/service/i.test(file)) {
      const dbPatterns = [
        /\.(?:query|execute|raw)\s*\(/g,
        /(?:SELECT|INSERT|UPDATE|DELETE)\s+/gi,
      ];

      for (const pattern of dbPatterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(content)) !== null) {
          const line = content.slice(0, match.index).split("\n").length;
          const lineStart = content.lastIndexOf("\n", match.index) + 1;
          const lineEnd = content.indexOf("\n", match.index);
          const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

          // Skip if it's using a repository pattern
          if (/repository|repo/i.test(snippet)) continue;

          findings.push(
            createFinding({
              title: "Direct DB Access in Service",
              description: "Service contains direct database queries. Use repository pattern.",
              severity: Severity.Medium,
              confidence: Confidence.Low,
              category: "Separation of Concerns",
              evidence: [
                {
                  type: EvidenceType.CodePattern,
                  file,
                  line,
                  snippet,
                  description: "Direct database access in service",
                },
              ],
              recommendation: "Use repository pattern for data access.",
            })
          );
        }
      }
    }
  }

  return findings;
}
