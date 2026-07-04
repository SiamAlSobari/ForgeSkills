import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanMigrations(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const migrationPatterns = ["**/migrations/**", "**/migrate/**", "**/db/migrate/**"];
  const files: string[] = [];

  for (const pattern of migrationPatterns) {
    const matches = await fg(pattern, {
      cwd: root,
      onlyFiles: true,
      ignore: ["**/node_modules/**"],
    });
    files.push(...matches);
  }

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Check for DROP TABLE
    const dropRegex = /DROP\s+TABLE/gi;
    let match: RegExpExecArray | null;

    while ((match = dropRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "DROP TABLE in Migration",
          description: "DROP TABLE permanently deletes data. Consider renaming first.",
          severity: Severity.Critical,
          confidence: Confidence.High,
          category: "Migration Safety",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "DROP TABLE" }],
          recommendation: "Rename table first, verify, then drop in separate migration.",
        })
      );
    }

    // Check for column deletion
    const dropColRegex = /ALTER\s+TABLE\s+\w+\s+DROP\s+COLUMN/gi;
    while ((match = dropColRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "DROP COLUMN in Migration",
          description: "Dropping a column loses data. Consider deprecating first.",
          severity: Severity.High,
          confidence: Confidence.High,
          category: "Migration Safety",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "DROP COLUMN" }],
          recommendation: "Stop using column in code first, then drop in separate migration.",
        })
      );
    }

    // Check for NOT NULL without default
    const setNotNullRegex = /ALTER\s+TABLE\s+\w+\s+ALTER\s+COLUMN\s+\w+\s+SET\s+NOT\s+NULL/gi;
    while ((match = setNotNullRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "SET NOT NULL Without Default",
          description: "Adding NOT NULL constraint may fail if existing NULL values.",
          severity: Severity.High,
          confidence: Confidence.Medium,
          category: "Migration Safety",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "SET NOT NULL" }],
          recommendation: "Update existing NULL values before adding constraint.",
        })
      );
    }
  }

  return findings;
}
