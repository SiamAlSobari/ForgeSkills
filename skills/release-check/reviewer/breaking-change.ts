import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanBreakingChanges(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check git diff for breaking changes
  // This is a simplified version - in production, you'd compare against previous version

  const codeExtensions = ["ts", "js", "jsx", "tsx"];
  const globPattern = `**/*.{${codeExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/*.test.*"],
  });

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Check for deprecated exports
    const deprecatedRegex = /@deprecated|@obsolete/gi;
    let match: RegExpExecArray | null;

    while ((match = deprecatedRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "Deprecated Code",
          description: "Code marked as deprecated. Will be removed in future version.",
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Breaking Change",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "Deprecated marker" }],
          recommendation: "Remove deprecated code or add migration path.",
        })
      );
    }

    // Check for TODO: remove
    const todoRemoveRegex = /TODO:?\s*remove|FIXME:?\s*remove/gi;
    while ((match = todoRemoveRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "Code Marked for Removal",
          description: "Code has TODO to remove. Should be removed before release.",
          severity: Severity.Medium,
          confidence: Confidence.High,
          category: "Breaking Change",
          evidence: [{ type: EvidenceType.CodePattern, file, line, snippet, description: "TODO remove" }],
          recommendation: "Remove marked code or update TODO.",
        })
      );
    }
  }

  return findings;
}
