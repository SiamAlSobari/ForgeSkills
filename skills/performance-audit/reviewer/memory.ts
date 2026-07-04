import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface MemoryPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const MEMORY_PATTERNS: MemoryPattern[] = [
  {
    name: "Event Listener Without Cleanup",
    pattern: /addEventListener\s*\([^)]*\)/g,
    severity: Severity.Medium,
    description: "Event listener added without corresponding removeEventListener. Can cause memory leaks in SPAs.",
    recommendation: "Remove event listeners in cleanup/unmount lifecycle.",
  },
  {
    name: "setInterval Without Cleanup",
    pattern: /setInterval\s*\(/g,
    severity: Severity.Medium,
    description: "setInterval without clearInterval. Timer runs indefinitely.",
    recommendation: "Store interval ID and clear it in cleanup lifecycle.",
  },
  {
    name: "setTimeout Without Cleanup",
    pattern: /setTimeout\s*\(/g,
    severity: Severity.Low,
    description: "setTimeout without clearTimeout. May fire after component unmount.",
    recommendation: "Store timeout ID and clear it in cleanup lifecycle.",
  },
  {
    name: "Global Variable Growth",
    pattern: /(?:window|global|globalThis)\.\w+\s*(?:=|\[)/g,
    severity: Severity.Medium,
    description: "Writing to global object. Data accumulates and is never garbage collected.",
    recommendation: "Avoid storing data on global objects. Use module-scoped variables.",
  },
  {
    name: "Array Push Without Limit",
    pattern: /\.push\s*\([^)]*\)/g,
    severity: Severity.Low,
    description: "Array.push without size limit. Array grows unbounded.",
    recommendation: "Implement size limits or cleanup for growing arrays.",
  },
];

export async function scanMemory(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of MEMORY_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", match.index) + 1;
        const lineEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        // Skip if inside cleanup
        const contextBefore = content.slice(Math.max(0, match.index - 200), match.index);
        if (/removeEventListener|clearInterval|clearTimeout|cleanup|unmount|dispose/.test(contextBefore)) continue;

        findings.push(
          createFinding({
            title: name,
            description,
            severity,
            confidence: Confidence.Medium,
            category: "Memory",
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
