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
    name: "N+1 Query Pattern",
    pattern: /(?:for|while|forEach|map|filter)\s*\([^)]*\)\s*\{[^}]*(?:find|findOne|findBy|query|select|get)\s*\(/g,
    severity: Severity.High,
    description: "Query inside a loop. This causes N+1 queries instead of a single batched query.",
    recommendation: "Use eager loading or batch queries to fetch all data at once.",
  },
  {
    name: "SELECT * Usage",
    pattern: /SELECT\s+\*\s+FROM/gi,
    severity: Severity.Medium,
    description: "Using SELECT * fetches all columns. This wastes bandwidth and memory.",
    recommendation: "Select only the columns you need.",
  },
  {
    name: "Missing LIMIT",
    pattern: /SELECT\s+(?!.*LIMIT)[^;]+FROM\s+\w+(?:\s+WHERE[^;]+)?;/gi,
    severity: Severity.Medium,
    description: "Query without LIMIT can return unbounded results.",
    recommendation: "Add LIMIT clause to limit result set size.",
  },
  {
    name: "Loop with Database Query",
    pattern: /(?:await|\.then)[^}]*(?:db|prisma|sequelize|knex|mongoose)\.\w+\.\w+\(/g,
    severity: Severity.High,
    description: "Database query inside loop. Consider batching.",
    recommendation: "Batch database queries or use bulk operations.",
  },
];

export async function scanQueries(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "tsx", "js", "jsx", "py", "go", "rb", "php"];
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

    for (const { name, pattern, severity, description, recommendation } of QUERY_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", match.index) + 1;
        const lineEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        findings.push(
          createFinding({
            title: name,
            description,
            severity,
            confidence: Confidence.Medium,
            category: "Database Query",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: `Found ${name} pattern`,
              },
            ],
            recommendation,
          })
        );
      }
    }
  }

  return findings;
}
