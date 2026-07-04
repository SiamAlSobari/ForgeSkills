import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanIndexing(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const sqlExtensions = ["sql", "ts", "js", "py", "go", "rb", "php"];
  const globPattern = `**/*.{${sqlExtensions.join(",")}}`;

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

    // Check for WHERE on non-indexed columns
    const whereRegex = /WHERE\s+(\w+)\s*[=<>]/gi;
    let match: RegExpExecArray | null;

    while ((match = whereRegex.exec(content)) !== null) {
      const column = match[1]!;
      if (["id", "user_id", "created_at", "updated_at"].includes(column.toLowerCase())) continue;

      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: `Query on '${column}' Column`,
          description: `Query filters on '${column}'. Verify this column is indexed.`,
          severity: Severity.Low,
          confidence: Confidence.Low,
          category: "Indexing",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: `WHERE ${column} = ...` }],
          recommendation: `Add index if frequently queried.`,
        })
      );
    }
  }

  return findings;
}
