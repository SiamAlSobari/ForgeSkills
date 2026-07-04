import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanDebt(root: string): Promise<Finding[]> {
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

    const lines = content.split("\n");

    // Check file size
    if (lines.length > 300) {
      findings.push(
        createFinding({
          title: "Large File",
          description: `File has ${lines.length} lines. Consider splitting into smaller modules.`,
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Technical Debt",
          evidence: [
            {
              type: EvidenceType.FileStructure,
              file,
              description: `File size: ${lines.length} lines`,
            },
          ],
          recommendation: "Split file by responsibility into separate modules.",
        })
      );
    }

    // Check nesting depth
    let maxNesting = 0;
    let maxNestingLine = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";
      const indent = line.search(/\S/);
      if (indent >= 0) {
        const nesting = Math.floor(indent / 2);
        if (nesting > maxNesting) {
          maxNesting = nesting;
          maxNestingLine = i + 1;
        }
      }
    }

    if (maxNesting > 4) {
      findings.push(
        createFinding({
          title: "Deep Nesting",
          description: `Code has ${maxNesting} levels of nesting. Consider extracting or using early returns.`,
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Technical Debt",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line: maxNestingLine,
              description: `Max nesting depth: ${maxNesting}`,
            },
          ],
          recommendation: "Use early returns, extract functions, or use guard clauses.",
        })
      );
    }

    // Check for TODO/FIXME/HACK comments
    const todoRegex = /(?:TODO|FIXME|HACK|XXX|TEMP)\s*:?\s*(.*)/gi;
    let match: RegExpExecArray | null;

    while ((match = todoRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const snippet = match[0].trim();

      findings.push(
        createFinding({
          title: "TODO/FIXME Comment",
          description: `Found ${snippet.split(":")[0]} comment. Address this before production.`,
          severity: Severity.Info,
          confidence: Confidence.High,
          category: "Technical Debt",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line,
              snippet,
              description: "Technical debt marker",
            },
          ],
          recommendation: "Address the TODO/FIXME or create a ticket to track it.",
        })
      );
    }

    // Check for deprecated patterns
    const deprecatedPatterns = [
      { pattern: /\bvar\s+/g, name: "var declaration", use: "const/let" },
      { pattern: /function\s*\([^)]*\)\s*\{/g, name: "function expression", use: "arrow function" },
      { pattern: /\.apply\s*\(/g, name: "Function.apply", use: "spread operator" },
      { pattern: /\.call\s*\(/g, name: "Function.call", use: "direct call" },
    ];

    for (const { pattern, name, use } of deprecatedPatterns) {
      let depMatch: RegExpExecArray | null;
      while ((depMatch = pattern.exec(content)) !== null) {
        const line = content.slice(0, depMatch.index).split("\n").length;
        const lineStart = content.lastIndexOf("\n", depMatch.index) + 1;
        const lineEnd = content.indexOf("\n", depMatch.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        findings.push(
          createFinding({
            title: `Deprecated Pattern: ${name}`,
            description: `Using ${name}. Consider using ${use} instead.`,
            severity: Severity.Info,
            confidence: Confidence.Low,
            category: "Technical Debt",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: `Deprecated ${name}`,
              },
            ],
            recommendation: `Replace with ${use}.`,
          })
        );
      }
    }
  }

  return findings;
}
