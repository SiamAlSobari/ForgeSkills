import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface QueryPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const QUERY_PATTERNS: QueryPattern[] = [
  {
    name: "SELECT * Usage",
    pattern: /SELECT\s+\*\s+FROM/gi,
    severity: Severity.Medium,
    description: "SELECT * fetches all columns. This wastes bandwidth and may break if schema changes.",
    recommendation: "Select only the columns you need.",
  },
  {
    name: "Missing WHERE Clause",
    pattern: /SELECT\s+(?!.*WHERE)[^;]+FROM\s+\w+\s*;/gi,
    severity: Severity.Medium,
    description: "Query without WHERE clause scans entire table.",
    recommendation: "Add WHERE clause to filter results.",
  },
  {
    name: "Subquery in WHERE",
    pattern: /WHERE\s+\w+\s+IN\s*\(\s*SELECT/gi,
    severity: Severity.Low,
    description: "Subquery in WHERE may be slower than JOIN.",
    recommendation: "Consider using JOIN instead of subquery.",
  },
  {
    name: "Implicit Cross Join",
    pattern: /FROM\s+\w+\s*,\s*\w+/g,
    severity: Severity.High,
    description: "Implicit cross join creates cartesian product.",
    recommendation: "Use explicit JOIN with ON clause.",
  },
];

export async function scanQueryPerformance(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of QUERY_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const line = content.slice(0, match.index).split("\n").length;
        const lineStart = content.lastIndexOf("\n", match.index) + 1;
        const lineEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        findings.push(
          createFinding({
            title: name,
            description,
            severity,
            confidence: Confidence.Medium,
            category: "Query Performance",
            evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: `Found ${name}` }],
            recommendation,
          })
        );
      }
    }
  }

  return findings;
}
