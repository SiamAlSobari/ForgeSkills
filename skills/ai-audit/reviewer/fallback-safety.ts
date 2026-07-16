import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanFallbackSafety(root: string): Promise<Finding[]> {
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

    // 1. Direct JSON.parse on LLM content without try-catch
    const jsonParseRegex = /JSON\.parse\s*\(\s*(?:[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)\s*\)/g;
    let jsonMatch: RegExpExecArray | null;
    while ((jsonMatch = jsonParseRegex.exec(content)) !== null) {
      // Check if it's within a try-catch block in the surrounding 200 chars
      const lookback = content.slice(Math.max(0, jsonMatch.index - 200), jsonMatch.index);
      const hasTry = /\btry\b/g.test(lookback);

      // Verify if the parsed variable is related to LLM output
      const snippetLine = content.slice(
        content.lastIndexOf("\n", jsonMatch.index) + 1,
        content.indexOf("\n", jsonMatch.index)
      );

      const isLlmRelated = /response|message|content|text|completion|result/i.test(snippetLine);

      if (!hasTry && isLlmRelated) {
        const lines = content.slice(0, jsonMatch.index).split("\n");
        const line = lines.length;
        const snippet = snippetLine.trim();

        findings.push(
          createFinding({
            title: "Unsafe Parsing of LLM Output",
            description: "Direct JSON.parse() on LLM output without error handling. If the LLM returns non-JSON or malformed data, it will crash the request.",
            severity: Severity.High,
            confidence: Confidence.High,
            category: "Fallback & Safety",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: "JSON.parse of LLM output without try-catch protection",
              },
            ],
            recommendation: "Wrap the JSON.parse operation in a try-catch block, and handle parsing errors by returning a user-friendly fallback response.",
          })
        );
      }
    }

    // 2. Direct HTML injection of LLM response without sanitization
    const innerHtmlRegex = /\.innerHTML\s*=/g;
    const dangerouslySetRegex = /dangerouslySetInnerHTML/g;

    const hasDirectHtml = innerHtmlRegex.test(content) || dangerouslySetRegex.test(content);
    const hasLlmReference = /response|message|content|text|completion|result/i.test(content);
    const hasSanitizer = /sanitize|purify|escapeHtml/i.test(content);

    if (hasDirectHtml && hasLlmReference && !hasSanitizer) {
      const index = content.search(/\.innerHTML\s*=|dangerouslySetInnerHTML/);
      const lines = content.slice(0, index).split("\n");
      const line = lines.length;

      const lineStart = content.lastIndexOf("\n", index) + 1;
      const lineEnd = content.indexOf("\n", index);
      const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

      findings.push(
        createFinding({
          title: "Direct HTML Rendering of LLM Output without Sanitisation",
          description: "LLM output is directly rendered into innerHTML or dangerouslySetInnerHTML without sanitization. An attacker using prompt injection can execute cross-site scripting (XSS).",
          severity: Severity.High,
          confidence: Confidence.Medium,
          category: "Fallback & Safety",
          evidence: [
            {
              type: EvidenceType.CodePattern,
              file,
              line,
              snippet,
              description: "HTML injection without sanitize function",
            },
          ],
          recommendation: "Use a sanitizer library like DOMPurify to sanitize generative content before rendering it as HTML.",
        })
      );
    }
  }

  return findings;
}
