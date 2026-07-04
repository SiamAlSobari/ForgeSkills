import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanAntiPatterns(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "js", "py", "go", "rb", "php"];
  const globPattern = `**/*.{${codeExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**", "**/*.test.*"],
  });

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // N+1 query pattern
    const loopRegex = /(?:for|while|forEach|map)\s*\([^)]*\)\s*\{[^}]*(?:query|find|select|execute)\s*\(/gi;
    let match: RegExpExecArray | null;

    while ((match = loopRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "N+1 Query Pattern",
          description: "Database query inside a loop. This causes N+1 queries.",
          severity: Severity.High,
          confidence: Confidence.Medium,
          category: "SQL Anti-pattern",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "Query in loop" }],
          recommendation: "Use eager loading or batch queries.",
        })
      );
    }

    // String concatenation in query
    const concatRegex = /(?:query|execute|find)\s*\(\s*['"`].*\$\{|(?:query|execute|find)\s*\(\s*['"`].*\+/gi;
    while ((match = concatRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "SQL Injection Risk",
          description: "String interpolation in SQL query. Use parameterized queries.",
          severity: Severity.Critical,
          confidence: Confidence.High,
          category: "SQL Anti-pattern",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "String interpolation in query" }],
          recommendation: "Use parameterized queries: query('SELECT * FROM users WHERE id = ?', [id])",
        })
      );
    }
  }

  return findings;
}
