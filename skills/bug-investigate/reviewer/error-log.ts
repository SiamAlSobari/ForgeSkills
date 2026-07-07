import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface ErrorPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  {
    name: "Unhandled Promise Rejection",
    pattern: /\.\s*then\s*\([^)]*\)\s*(?:\.\s*then\s*\([^)]*\))*\s*(?!.\s*catch)/g,
    severity: Severity.High,
    description: "Promise chain without .catch() handler. Unhandled rejections can crash the application.",
    recommendation: "Add .catch() handler or use try-catch with async/await.",
  },
  {
    name: "Async Function Without Try-Catch",
    pattern: /async\s+(?:function\s+)?(?:\w+\s*)?\([^)]*\)\s*\{(?![^}]*try)/g,
    severity: Severity.Medium,
    description: "Async function without try-catch block. Unhandled errors will cause unhandled rejection.",
    recommendation: "Wrap async operations in try-catch or use a global error handler.",
  },
  {
    name: "JSON Parse Without Try-Catch",
    pattern: /JSON\.parse\s*\([^)]*\)(?![^}]*catch)/g,
    severity: Severity.Medium,
    description: "JSON.parse without error handling. Invalid JSON will throw SyntaxError.",
    recommendation: "Wrap JSON.parse in try-catch block.",
  },
  {
    name: "Silent Error Swallowing",
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
    severity: Severity.Medium,
    description: "Empty catch block silently swallows errors, making debugging difficult.",
    recommendation: "At minimum, log the error. Consider re-throwing or handling appropriately.",
  },
  {
    name: "Generic Error Catch",
    pattern: /catch\s*\(\s*e\s*\)\s*\{[^}]*console\.log/g,
    severity: Severity.Low,
    description: "Catching errors with only console.log. Error might need more handling.",
    recommendation: "Consider proper error handling, logging service, or re-throwing.",
  },
  {
    name: "Go Panic/Stack Trace Pattern",
    pattern: /panic\s*\(|goroutine\s+\d+\s+\[running\]/g,
    severity: Severity.High,
    description: "Go panic call or goroutine running stack trace pattern.",
    recommendation: "Use recover() to catch panics or investigate stack trace for bug root cause.",
  },
  {
    name: "Python Traceback Pattern",
    pattern: /Traceback\s*\(most\s+recent\s+call\s+last\)/g,
    severity: Severity.High,
    description: "Python traceback/exception stack trace pattern.",
    recommendation: "Ensure python exceptions are caught using try-except block.",
  },
  {
    name: "Java Exception Pattern",
    pattern: /Exception\s+in\s+thread\s+"[^"]+"\s+[\w.]+/g,
    severity: Severity.High,
    description: "Java main thread or worker thread exception crash pattern.",
    recommendation: "Wrap entry point or runnable in a try-catch block.",
  },
  {
    name: "PHP Fatal Error Pattern",
    pattern: /Fatal\s+error:\s+[\w\s]+/g,
    severity: Severity.High,
    description: "PHP fatal runtime error pattern.",
    recommendation: "Configure custom error/exception handler or fix fatal script error.",
  },
];

export async function scanErrorLogs(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of ERROR_PATTERNS) {
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
            category: "Error Handling",
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
