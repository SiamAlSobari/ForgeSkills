import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface AlgorithmPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const ALGORITHM_PATTERNS: AlgorithmPattern[] = [
  {
    name: "Nested Loop - O(n²)",
    pattern: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)\s*\{/g,
    severity: Severity.Medium,
    description: "Nested loops create O(n²) complexity. Can be slow for large datasets.",
    recommendation: "Consider using a Map or Set for O(n) lookups instead of inner loop.",
  },
  {
    name: "Array IndexOf in Loop",
    pattern: /for\s*\([^)]*\)[^}]*\.indexOf\s*\(/g,
    severity: Severity.Medium,
    description: "Array.indexOf is O(n) inside a loop, creating O(n²) complexity.",
    recommendation: "Use a Set for O(1) lookups instead of Array.indexOf.",
  },
  {
    name: "Array Find in Loop",
    pattern: /for\s*\([^)]*\)[^}]*\.find\s*\(/g,
    severity: Severity.Medium,
    description: "Array.find is O(n) inside a loop, creating O(n²) complexity.",
    recommendation: "Use a Map for O(1) lookups instead of Array.find.",
  },
  {
    name: "String Concatenation in Loop",
    pattern: /for\s*\([^)]*\)[^}]*\+=\s*['"]/g,
    severity: Severity.Low,
    description: "String concatenation in loop creates new strings each iteration.",
    recommendation: "Use array.join() or template literals for better performance.",
  },
];

export async function scanAlgorithms(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of ALGORITHM_PATTERNS) {
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
            category: "Algorithm",
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
