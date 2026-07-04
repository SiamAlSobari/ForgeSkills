import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface PatternCheck {
  name: string;
  check: (content: string, file: string) => Finding[];
}

function checkLargeClasses(content: string, file: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split("\n");

  // Find class declarations
  const classRegex = /class\s+(\w+)/g;
  let match: RegExpExecArray | null;

  while ((match = classRegex.exec(content)) !== null) {
    const className = match[1];
    const startLine = content.slice(0, match.index).split("\n").length;

    // Find class end (simple heuristic: closing brace at same indent)
    let braceCount = 0;
    let endLine = startLine;
    for (let i = startLine - 1; i < lines.length; i++) {
      const line = lines[i] ?? "";
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      if (braceCount === 0 && i >= startLine) {
        endLine = i + 1;
        break;
      }
    }

    const classLength = endLine - startLine;
    if (classLength > 200) {
      findings.push(
        createFinding({
          title: "Large Class",
          description: `Class '${className}' has ${classLength} lines. Consider splitting into smaller classes.`,
          severity: Severity.Medium,
          confidence: Confidence.High,
          category: "Design Pattern",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line: startLine,
              snippet: `class ${className} { ... } (${classLength} lines)`,
              description: "Large class detected",
            },
          ],
          recommendation: "Split class into smaller classes with single responsibility.",
        })
      );
    }
  }

  return findings;
}

function checkLongMethods(content: string, file: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split("\n");

  // Find function/method declarations
  const funcRegex = /(?:function\s+\w+|(?:async\s+)?(?:\w+\s*(?:=\s*(?:function|\()|(?:\w+\s*)?\([^)]*\)\s*(?:=>|{))))/g;
  let match: RegExpExecArray | null;

  while ((match = funcRegex.exec(content)) !== null) {
    const startLine = content.slice(0, match.index).split("\n").length;

    // Find function end
    let braceCount = 0;
    let endLine = startLine;
    let started = false;
    for (let i = startLine - 1; i < lines.length; i++) {
      const line = lines[i] ?? "";
      if (line.includes("{")) started = true;
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      if (started && braceCount === 0) {
        endLine = i + 1;
        break;
      }
    }

    const funcLength = endLine - startLine;
    if (funcLength > 50) {
      const funcName = lines[startLine - 1]?.trim().slice(0, 50) || "function";
      findings.push(
        createFinding({
          title: "Long Method",
          description: `Method has ${funcLength} lines. Consider breaking into smaller functions.`,
          severity: Severity.Low,
          confidence: Confidence.Medium,
          category: "Design Pattern",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line: startLine,
              snippet: `${funcName}... (${funcLength} lines)`,
              description: "Long method detected",
            },
          ],
          recommendation: "Extract logical blocks into separate functions.",
        })
      );
    }
  }

  return findings;
}

function checkMagicNumbers(content: string, file: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split("\n");

  const magicNumberRegex = /(?:===?|!==?|[<>]=?|\b(?:case|return)\s+)(\d{2,})/g;
  let match: RegExpExecArray | null;

  while ((match = magicNumberRegex.exec(content)) !== null) {
    const num = match[1] ?? "";
    // Skip common numbers
    if (["100", "200", "201", "204", "301", "302", "400", "401", "403", "404", "500"].includes(num)) continue;

    const line = content.slice(0, match.index).split("\n").length;
    const lineStart = content.lastIndexOf("\n", match.index) + 1;
    const lineEnd = content.indexOf("\n", match.index);
    const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

    // Skip if in const declaration
    if (/const\s+\w+\s*=\s*\d/.test(snippet)) continue;

    findings.push(
      createFinding({
        title: "Magic Number",
        description: `Magic number ${num} found. Use named constant for clarity.`,
        severity: Severity.Low,
        confidence: Confidence.Low,
        category: "Design Pattern",
        evidence: [
          {
            type: EvidenceType.CodePattern,
            file,
            line,
            snippet,
            description: `Magic number: ${num}`,
          },
        ],
        recommendation: `Extract to named constant: const MEANINGFUL_NAME = ${num};`,
      })
    );
  }

  return findings;
}

export async function scanPatterns(root: string): Promise<Finding[]> {
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

    findings.push(...checkLargeClasses(content, file));
    findings.push(...checkLongMethods(content, file));
    findings.push(...checkMagicNumbers(content, file));
  }

  return findings;
}
