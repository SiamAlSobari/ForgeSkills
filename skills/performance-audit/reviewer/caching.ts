import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface CachingPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const CACHING_PATTERNS: CachingPattern[] = [
  {
    name: "Repeated File Read",
    pattern: /(?:readFile|readFileSync)\s*\([^)]*\)/g,
    severity: Severity.Low,
    description: "File read without caching. Same file may be read multiple times.",
    recommendation: "Cache file contents if read frequently.",
  },
  {
    name: "Repeated JSON Parse",
    pattern: /JSON\.parse\s*\([^)]*\)/g,
    severity: Severity.Low,
    description: "JSON.parse called on same data. Consider caching parsed result.",
    recommendation: "Cache parsed JSON if used multiple times.",
  },
  {
    name: "Repeated Computation",
    pattern: /(?:Math\.\w+|\.reduce|\.map|\.filter)\s*\(/g,
    severity: Severity.Low,
    description: "Expensive computation that might benefit from memoization.",
    recommendation: "Consider memoizing if called with same arguments.",
  },
];

export async function scanCaching(root: string): Promise<Finding[]> {
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

    // Only flag if same operation appears multiple times in same file
    for (const { name, pattern, severity, description, recommendation } of CACHING_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      const matches: RegExpExecArray[] = [];
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        matches.push(match);
      }

      if (matches.length > 2) {
        const firstMatch = matches[0]!;
        const lines = content.slice(0, firstMatch.index).split("\n");
        const line = lines.length;

        findings.push(
          createFinding({
            title: `${name} (${matches.length} occurrences)`,
            description: `${description} Found ${matches.length} occurrences in the same file.`,
            severity,
            confidence: Confidence.Low,
            category: "Caching",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet: lines[lines.length - 1]?.trim(),
                description: `Found ${matches.length} ${name} patterns`,
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
