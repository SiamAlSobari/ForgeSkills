import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanPromptQuality(root: string): Promise<Finding[]> {
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

    // 1. Socratic Tutor Prompt audit
    if (/socratic/i.test(content)) {
      // Check if prompt definition contains limits/intro/greetings handling
      const contentLower = content.toLowerCase();
      const hasIdentity = contentLower.includes("identity") || contentLower.includes("introduce") || contentLower.includes("intro") || contentLower.includes("greeting") || contentLower.includes("halo") || contentLower.includes("hi");
      const hasTurnLimit = contentLower.includes("limit") || contentLower.includes("turn") || contentLower.includes("step") || contentLower.includes("tahap") || contentLower.includes("langkah");

      if (!hasIdentity || !hasTurnLimit) {
        const index = content.search(/socratic/i);
        const lines = content.slice(0, index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", index) + 1;
        const lineEnd = content.indexOf("\n", index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        let details = "";
        let rec = "";
        if (!hasIdentity && !hasTurnLimit) {
          details = "The Socratic tutor prompt is missing constraints for identity/greeting handling and conversation turn limits.";
          rec = "Update the Socratic prompt to: 1) Handle simple greetings/identities naturally, and 2) Enforce clear limits (e.g. ask only one question at a time, limit steps).";
        } else if (!hasIdentity) {
          details = "The Socratic tutor prompt is missing constraints for identity/greeting handling.";
          rec = "Add instructions to respond naturally when greeted (e.g., 'hello', 'siapa kamu') instead of replying with a Socratic question.";
        } else {
          details = "The Socratic tutor prompt is missing step/turn limit constraints.";
          rec = "Instruct the model to guide the user step-by-step and ask only one simple question at a time to prevent outputting overwhelming questions.";
        }

        findings.push(
          createFinding({
            title: "Incoherent Socratic Tutor Prompt Design",
            description: `${details} Without these constraints, the LLM will output confusing responses to simple questions or greetings.`,
            severity: Severity.High,
            confidence: Confidence.High,
            category: "Prompt Quality",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: "Socratic keyword detected with missing prompt constraints",
              },
            ],
            recommendation: rec,
          })
        );
      }
    }

    // 2. JSON Prompt without JSON Mode / Response Schema
    const jsonInPromptRegex = /(?:json|format|schema)/i;
    if (jsonInPromptRegex.test(content) && /['"`][^'`"]*(?:json|format|schema)[^'`"]*['"`]/i.test(content)) {
      // Check if response_format or json mode is used
      const hasJsonMode = /response_format|responseSchema|structuredOutputs/i.test(content) || /json\s*mode/i.test(content);
      if (!hasJsonMode) {
        // Let's find where the JSON string is
        const match = /['"`][^'`"]*(?:json|format|schema)[^'`"]*['"`]/i.exec(content);
        if (match) {
          const lines = content.slice(0, match.index).split("\n");
          const line = lines.length;

          const lineStart = content.lastIndexOf("\n", match.index) + 1;
          const lineEnd = content.indexOf("\n", match.index);
          const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

          findings.push(
            createFinding({
              title: "JSON Output Requested without Schema/Mode Enforcement",
              description: "The prompt requests structured output (JSON/Format/Schema), but JSON Mode or response schemas are not configured in the client API. The model might output markdown syntax, leading to parsing failures.",
              severity: Severity.Medium,
              confidence: Confidence.Medium,
              category: "Prompt Quality",
              evidence: [
                {
                  type: EvidenceType.CodePattern,
                  file,
                  line,
                  snippet,
                  description: "Prompt requesting JSON format without API enforcement",
                },
              ],
              recommendation: "Set `response_format: { type: 'json_object' }` (for OpenAI) or define a structured response schema (for Gemini/Anthropic) to enforce format outputs.",
            })
          );
        }
      }
    }
  }

  return findings;
}
