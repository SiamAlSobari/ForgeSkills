import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface ResourcePattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const RESOURCE_PATTERNS: ResourcePattern[] = [
  {
    name: "Sync File Operation",
    pattern: /(?:readFileSync|writeFileSync|appendFileSync|mkdirSync|readdirSync)\s*\(/g,
    severity: Severity.Medium,
    description: "Synchronous file operation blocks the event loop. Use async version.",
    recommendation: "Use fs.promises or callback-based async methods.",
  },
  {
    name: "Sync HTTP Request",
    pattern: /(?:XMLHttpRequest|https?\.\w+Sync)\s*\(/g,
    severity: Severity.High,
    description: "Synchronous HTTP request blocks the entire application.",
    recommendation: "Use fetch, axios, or other async HTTP clients.",
  },
  {
    name: "Large Import",
    pattern: /import\s+.*\s+from\s+['"](?:lodash|moment|rxjs|antd|@mui\/material)['"]/g,
    severity: Severity.Low,
    description: "Importing large library. Consider importing only what you need.",
    recommendation: "Use tree-shakeable imports (e.g., import get from 'lodash/get').",
  },
  {
    name: "Sequential Async Operations",
    pattern: /await\s+\w+[^;]*;\s*\n\s*await\s+\w+/g,
    severity: Severity.Medium,
    description: "Sequential await calls. Consider parallelizing with Promise.all.",
    recommendation: "Use Promise.all for independent async operations.",
  },
];

export async function scanResources(root: string): Promise<Finding[]> {
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

    for (const { name, pattern, severity, description, recommendation } of RESOURCE_PATTERNS) {
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
            category: "Resource",
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
