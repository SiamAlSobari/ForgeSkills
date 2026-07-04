import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface CodePathPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const CODE_PATH_PATTERNS: CodePathPattern[] = [
  {
    name: "Unsafe Property Access",
    pattern: /\w+\.\w+\.\w+(?!\?\.)/g,
    severity: Severity.Medium,
    description: "Deep property access without optional chaining. Will crash if intermediate value is null/undefined.",
    recommendation: "Use optional chaining (?.) for safe property access.",
  },
  {
    name: "Array Access Without Bounds Check",
    pattern: /\w+\[\d+\]\.\w+/g,
    severity: Severity.Medium,
    description: "Direct array index access without checking array length.",
    recommendation: "Check array length before accessing elements or use optional chaining.",
  },
  {
    name: "Missing Await",
    pattern: /=\s*(?:fetch|axios\.\w+|await\s+\w+)\s*\([^)]*\)\s*;(?!\s*await)/g,
    severity: Severity.High,
    description: "Possible missing await on async operation. Result will be a Promise, not the resolved value.",
    recommendation: "Add await before async function calls.",
  },
  {
    name: "Null Access After Check",
    pattern: /if\s*\(\s*\w+\s*\)\s*\{[^}]*\w+\.\w+/g,
    severity: Severity.Low,
    description: "Property access inside null check, but value could change between check and use.",
    recommendation: "Use optional chaining or store value in variable.",
  },
];

export async function scanCodePaths(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of CODE_PATH_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", match.index) + 1;
        const lineEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        // Skip false positives
        if (name === "Unsafe Property Access") {
          // Skip console.log, module.exports, etc.
          if (/console\.\w+|module\.\w+|process\.\w+|window\.\w+|document\.\w+/.test(snippet)) continue;
        }

        findings.push(
          createFinding({
            title: name,
            description,
            severity,
            confidence: Confidence.Low,
            category: "Code Path",
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
