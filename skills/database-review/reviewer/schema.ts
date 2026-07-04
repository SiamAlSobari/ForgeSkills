import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanSchema(root: string): Promise<Finding[]> {
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

    // Check for VARCHAR(255) everywhere
    const varcharRegex = /VARCHAR\s*\(\s*255\s*\)/gi;
    let match: RegExpExecArray | null;

    while ((match = varcharRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "VARCHAR(255) Default",
          description: "Using VARCHAR(255) as default. Consider using appropriate length.",
          severity: Severity.Info,
          confidence: Confidence.Low,
          category: "Schema Design",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "VARCHAR(255)" }],
          recommendation: "Use VARCHAR with appropriate length for the data.",
        })
      );
    }

    // Check for missing NOT NULL
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)/gi;
    while ((match = createTableRegex.exec(content)) !== null) {
      const tableName = match[1]!;
      // Find columns
      const tableStart = match.index;
      const tableEnd = content.indexOf(");", tableStart);
      if (tableEnd === -1) continue;

      const tableBody = content.slice(tableStart, tableEnd);
      const columnRegex = /(\w+)\s+(INT|VARCHAR|TEXT|BOOLEAN|TIMESTAMP|DATE)/gi;
      let colMatch: RegExpExecArray | null;

      while ((colMatch = columnRegex.exec(tableBody)) !== null) {
        const colName = colMatch[1]!;
        if (colName.toLowerCase() === "id") continue;

        // Check if NOT NULL is present
        const colEnd = tableBody.indexOf("\n", colMatch.index);
        const colDef = tableBody.slice(colMatch.index, colEnd === -1 ? undefined : colEnd);

        if (!colDef.toUpperCase().includes("NOT NULL") && !colDef.toUpperCase().includes("PRIMARY KEY")) {
          const line = content.slice(0, tableStart + colMatch.index).split("\n").length;

          findings.push(
            createFinding({
              title: `Nullable Column: ${tableName}.${colName}`,
              description: `Column '${colName}' is nullable. Consider if NULL is valid.`,
              severity: Severity.Info,
              confidence: Confidence.Low,
              category: "Schema Design",
              evidence: [{ type: EvidenceType.CodePattern, file, line, description: `${colName} without NOT NULL` }],
              recommendation: "Add NOT NULL constraint if column should always have a value.",
            })
          );
        }
      }
    }
  }

  return findings;
}
