import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface ConfigPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const CONFIG_PATTERNS: ConfigPattern[] = [
  {
    name: "Hardcoded OpenAI API Key",
    pattern: /apiKey\s*:\s*['"]sk-[a-zA-Z0-9]{30,}['"]/gi,
    severity: Severity.Critical,
    description: "Hardcoded OpenAI API Key detected in client configuration. This poses a severe security risk.",
    recommendation: "Move the API key to environment variables (e.g. process.env.OPENAI_API_KEY).",
  },
  {
    name: "Hardcoded Google/Gemini API Key",
    pattern: /(?:apiKey|key)\s*:\s*['"]AIza[a-zA-Z0-9_-]{35}['"]/gi,
    severity: Severity.Critical,
    description: "Hardcoded Gemini API Key detected in client configuration. This poses a severe security risk.",
    recommendation: "Move the API key to environment variables (e.g. process.env.GEMINI_API_KEY).",
  },
  {
    name: "Hardcoded Anthropic API Key",
    pattern: /apiKey\s*:\s*['"]sk-ant-[a-zA-Z0-9_-]{40,}['"]/gi,
    severity: Severity.Critical,
    description: "Hardcoded Anthropic API Key detected in client configuration. This poses a severe security risk.",
    recommendation: "Move the API key to environment variables (e.g. process.env.ANTHROPIC_API_KEY).",
  },
  {
    name: "Excessive LLM Temperature Setting",
    pattern: /temperature\s*:\s*(?:1\.[1-9]|2\.0|[2-9])/gi,
    severity: Severity.Medium,
    description: "Extremely high temperature setting detected. High temperature (e.g. > 1.0) can cause the LLM to output incoherent, gibberish, or unintelligible responses.",
    recommendation: "Reduce the temperature to 0.7 or lower for creative tasks, and 0.2 - 0.5 for Socratic, structured, or deterministic tasks.",
  },
];

export async function scanClientConfig(root: string): Promise<Finding[]> {
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

    // 1. Scan regular regex patterns
    for (const { name, pattern, severity, description, recommendation } of CONFIG_PATTERNS) {
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
            confidence: Confidence.High,
            category: "AI Client Config",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: `Found issue: ${name}`,
              },
            ],
            recommendation,
          })
        );
      }
    }

    // 2. Scan for LLM calls that are NOT wrapped in try-catch
    const llmCallRegex = /(?:chat\.completions\.create|messages\.create|generateContent|generateText)\s*\(/g;
    let callMatch: RegExpExecArray | null;
    while ((callMatch = llmCallRegex.exec(content)) !== null) {
      const index = callMatch.index;
      // Look back up to 400 characters to see if there's a try keyword
      const lookback = content.slice(Math.max(0, index - 400), index);
      const hasTry = /\btry\b/g.test(lookback);

      if (!hasTry) {
        const lines = content.slice(0, index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", index) + 1;
        const lineEnd = content.indexOf("\n", index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        findings.push(
          createFinding({
            title: "AI API Call outside Try-Catch block",
            description: "An LLM client API call is made without being wrapped in a try-catch block. If the API is rate-limited, timeout occurs, or the key is invalid, the entire request/application will crash.",
            severity: Severity.High,
            confidence: Confidence.Medium,
            category: "AI Client Config",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: "LLM call outside try-catch",
              },
            ],
            recommendation: "Wrap the AI client call in a try-catch block and implement a structured error handler or fallback response.",
          })
        );
      }
    }

    // 3. Scan for Client instantiation without timeout/maxRetries configurations
    const clientInstantiationRegex = /new\s+(?:OpenAI|Anthropic|GoogleGenAI)\s*\(([\s\S]*?)\)/gi;
    let instMatch: RegExpExecArray | null;
    while ((instMatch = clientInstantiationRegex.exec(content)) !== null) {
      const configObject = instMatch[1] || "";
      const hasTimeout = /timeout\s*:/i.test(configObject);
      const hasRetries = /maxRetries\s*:/i.test(configObject);

      if (!hasTimeout && !hasRetries) {
        const lines = content.slice(0, instMatch.index).split("\n");
        const line = lines.length;

        const lineStart = content.lastIndexOf("\n", instMatch.index) + 1;
        const lineEnd = content.indexOf("\n", instMatch.index);
        const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

        findings.push(
          createFinding({
            title: "AI Client Initialised without Timeout/Retry Policy",
            description: "The AI SDK client is initialized without explicit timeout or retry configurations. Under slow network conditions, requests can hang indefinitely, resulting in a poor user experience.",
            severity: Severity.Medium,
            confidence: Confidence.Medium,
            category: "AI Client Config",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: "Client instantiation missing timeout/retry params",
              },
            ],
            recommendation: "Pass a 'timeout' (e.g. 10000ms) and 'maxRetries' parameter to the client configuration.",
          })
        );
      }
    }
  }

  return findings;
}
