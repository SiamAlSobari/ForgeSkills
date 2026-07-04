import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface VulnPattern {
  name: string;
  category: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const VULN_PATTERNS: VulnPattern[] = [
  // SQL Injection
  {
    name: "SQL Injection",
    category: "Injection",
    pattern: /(?:`[^`]*\$\{[^}]+\}|"[^"]*\$\{[^}]+\}|'[^']*\$\{[^}]+\}|\+\s*(?:req\.|params\.|query\.|body\.))/g,
    severity: Severity.Critical,
    description: "String interpolation or concatenation in SQL query allows SQL injection attacks.",
    recommendation: "Use parameterized queries or prepared statements instead of string interpolation.",
  },

  // XSS - innerHTML
  {
    name: "XSS via innerHTML",
    category: "XSS",
    pattern: /\.innerHTML\s*=/g,
    severity: Severity.High,
    description: "Direct innerHTML assignment can lead to Cross-Site Scripting (XSS) attacks.",
    recommendation: "Use textContent for plain text or sanitize HTML before insertion.",
  },

  // XSS - dangerouslySetInnerHTML
  {
    name: "XSS via dangerouslySetInnerHTML",
    category: "XSS",
    pattern: /dangerouslySetInnerHTML/g,
    severity: Severity.High,
    description: "React dangerouslySetInnerHTML can lead to XSS if input is not sanitized.",
    recommendation: "Sanitize HTML content using DOMPurify or similar library before rendering.",
  },

  // XSS - v-html
  {
    name: "XSS via v-html",
    category: "XSS",
    pattern: /v-html\s*=/g,
    severity: Severity.High,
    description: "Vue v-html directive can lead to XSS if input is not sanitized.",
    recommendation: "Sanitize HTML content or use template interpolation instead.",
  },

  // SSRF
  {
    name: "Server-Side Request Forgery",
    category: "SSRF",
    pattern: /(?:fetch|axios\.(?:get|post|put|delete))\s*\(\s*(?:req\.(?:query|body|params)|userInput)/g,
    severity: Severity.High,
    description: "User-controlled URL in server-side request can lead to SSRF attacks.",
    recommendation: "Validate and whitelist allowed URLs before making server-side requests.",
  },

  // RCE - eval
  {
    name: "Remote Code Execution via eval",
    category: "RCE",
    pattern: /\beval\s*\(/g,
    severity: Severity.Critical,
    description: "eval() with user input allows arbitrary code execution.",
    recommendation: "Never use eval(). Use safer alternatives like JSON.parse() for data parsing.",
  },

  // RCE - exec
  {
    name: "Command Injection via exec",
    category: "RCE",
    pattern: /(?:exec|execSync|spawn)\s*\(\s*(?:`[^`]*\$\{|[^,]*\+\s*(?:req\.|params\.|query\.|body\.))/g,
    severity: Severity.Critical,
    description: "Shell command execution with user input allows command injection.",
    recommendation: "Use execFile with argument arrays instead of exec with string interpolation.",
  },

  // RCE - child_process
  {
    name: "Command Injection via child_process",
    category: "RCE",
    pattern: /child_process\.(?:exec|execSync)\s*\(/g,
    severity: Severity.High,
    description: "child_process.exec can lead to command injection if input is not sanitized.",
    recommendation: "Use execFile or spawn with argument arrays instead of exec.",
  },

  // Path Traversal
  {
    name: "Path Traversal",
    category: "Path Traversal",
    pattern: /(?:readFile|readFileSync|readdir|readdirSync)\s*\(\s*(?:req\.(?:query|params|body)|\.\.\/)/g,
    severity: Severity.High,
    description: "User-controlled file path can lead to path traversal attacks.",
    recommendation: "Validate file paths and use path.resolve() with a base directory check.",
  },

  // Unsafe Redirect
  {
    name: "Open Redirect",
    category: "Redirect",
    pattern: /res\.redirect\s*\(\s*(?:req\.(?:query|body|params))/g,
    severity: Severity.Medium,
    description: "User-controlled redirect URL can lead to phishing attacks.",
    recommendation: "Whitelist allowed redirect URLs or use relative paths only.",
  },
];

export async function scanSourceCode(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const codeExtensions = ["ts", "tsx", "js", "jsx", "mjs", "cjs", "py", "go", "java", "rb", "php"];
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

    for (const { name, category, pattern, severity, description, recommendation } of VULN_PATTERNS) {
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
            category,
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
