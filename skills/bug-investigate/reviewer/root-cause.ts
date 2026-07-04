import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface RootCausePattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const ROOT_CAUSE_PATTERNS: RootCausePattern[] = [
  {
    name: "Loose Equality",
    pattern: /[^=!]==(?!=)/g,
    severity: Severity.Medium,
    description: "Using == instead of ===. Loose equality can cause unexpected type coercion.",
    recommendation: "Use strict equality (===) to avoid type coercion issues.",
  },
  {
    name: "Implicit Type Coercion",
    pattern: /\+\s*['"]|['"]\s*\+/g,
    severity: Severity.Low,
    description: "String concatenation with + can cause implicit type coercion.",
    recommendation: "Use template literals or explicit String() conversion.",
  },
  {
    name: "Mutation of Function Parameter",
    pattern: /(?:push|pop|shift|unshift|splice|sort|reverse)\s*\(/g,
    severity: Severity.Low,
    description: "Array method that mutates the original array. Could cause unexpected side effects.",
    recommendation: "Consider using non-mutating methods (map, filter, slice, spread).",
  },
  {
    name: "Shared Mutable State",
    pattern: /(?:let|var)\s+\w+\s*=\s*(?:\{|\[)/g,
    severity: Severity.Low,
    description: "Mutable object/array declared that could be shared and modified unexpectedly.",
    recommendation: "Consider using const and creating new objects/arrays instead of mutating.",
  },
];

export async function scanRootCauses(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of ROOT_CAUSE_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", match.index) + 1;
        const lineEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        // Skip comments and strings
        if (snippet.startsWith("//") || snippet.startsWith("*") || snippet.startsWith("/*")) continue;

        findings.push(
          createFinding({
            title: name,
            description,
            severity,
            confidence: Confidence.Low,
            category: "Root Cause",
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
