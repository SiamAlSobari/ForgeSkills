import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface EdgeCasePattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const EDGE_CASE_PATTERNS: EdgeCasePattern[] = [
  {
    name: "Missing Null Check",
    pattern: /\.\s*(?:length|toUpperCase|toLowerCase|trim|toString|valueOf)\s*\(/g,
    severity: Severity.Medium,
    description: "Method call without null check. Will crash if object is null/undefined.",
    recommendation: "Add null check or use optional chaining (?.).",
  },
  {
    name: "Empty Array Access",
    pattern: /\[\s*0\s*\]\s*\./g,
    severity: Severity.Medium,
    description: "Accessing first element without checking if array is empty.",
    recommendation: "Check array.length > 0 before accessing elements.",
  },
  {
    name: "Missing Event Listener Cleanup",
    pattern: /addEventListener\s*\(/g,
    severity: Severity.Medium,
    description: "Event listener added without cleanup. Can cause memory leaks in SPAs.",
    recommendation: "Remove event listeners in cleanup/unmount lifecycle.",
  },
  {
    name: "Missing Timer Cleanup",
    pattern: /(?:setInterval|setTimeout)\s*\(/g,
    severity: Severity.Medium,
    description: "Timer created without cleanup. Can cause memory leaks and unexpected behavior.",
    recommendation: "Clear intervals/timeouts in cleanup/unmount lifecycle.",
  },
  {
    name: "Go Unhandled Error",
    pattern: /(?:_|, _)\s*:=\s*|_\s*=\s*/g,
    severity: Severity.Medium,
    description: "Go error or value explicitly ignored using blank identifier.",
    recommendation: "Handle the error returned by the function instead of discarding it with '_'.",
  },
  {
    name: "Division Without Zero Check",
    pattern: /\/\s*(?![\d/*])(\$?[a-zA-Z_]\w*)/g,
    severity: Severity.Low,
    description: "Division by variable without zero check.",
    recommendation: "Check divisor is not zero before division.",
  },
  {
    name: "Null Method Invocation",
    pattern: /\b(?:[a-zA-Z_]\w*)\s*->\s*(?:[a-zA-Z_]\w*)\s*\(/g,
    severity: Severity.Medium,
    description: "Method invocation using -> operator in PHP without null check.",
    recommendation: "Ensure object is not null before invoking methods.",
  },
  {
    name: "AI API Call without Catch Block",
    pattern: /(?:chat\.completions\.create|messages\.create|generateContent)\s*\([^)]*\)\s*(?!\.\s*catch)/g,
    severity: Severity.High,
    description: "AI SDK API call without .catch() block or try-catch context. Network timeout or 429 Rate Limits will crash the application.",
    recommendation: "Ensure the promise has a .catch() handler or is wrapped in a try-catch block.",
  },
  {
    name: "Direct JSON Parsing of LLM Output",
    pattern: /JSON\.parse\s*\(\s*(?:[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)*(?:response|content|text)[^)]*\)/gi,
    severity: Severity.High,
    description: "Direct JSON parsing of an LLM response variable without structural or schema validation. Can crash if response is malformed.",
    recommendation: "Use a try-catch block and implement fallback values.",
  },
];

export async function scanEdgeCases(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of EDGE_CASE_PATTERNS) {
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
            confidence: Confidence.Low,
            category: "Edge Case",
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
