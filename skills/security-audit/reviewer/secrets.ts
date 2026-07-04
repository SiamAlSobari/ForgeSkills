import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface SecretPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
}

const SECRET_PATTERNS: SecretPattern[] = [
  // AWS
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/g, severity: Severity.Critical },
  { name: "AWS Secret Key", pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/g, severity: Severity.Critical },

  // Google
  { name: "Google API Key", pattern: /AIza[0-9A-Za-z\-_]{35}/g, severity: Severity.High },

  // GitHub
  { name: "GitHub Token", pattern: /gh[pousr]_[A-Za-z0-9_]{36,255}/g, severity: Severity.Critical },

  // Generic API Keys
  { name: "API Key", pattern: /(?:api[_-]?key|apikey)\s*[=:]\s*['"][A-Za-z0-9\-_]{20,}['"]/gi, severity: Severity.High },

  // Tokens
  { name: "Bearer Token", pattern: /bearer\s+[A-Za-z0-9\-_\.]{20,}/gi, severity: Severity.High },
  { name: "Generic Token", pattern: /(?:token|access_token|auth_token)\s*[=:]\s*['"][A-Za-z0-9\-_]{20,}['"]/gi, severity: Severity.High },

  // Passwords
  { name: "Password", pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/gi, severity: Severity.Critical },

  // Connection Strings
  { name: "Connection String", pattern: /:\/\/[^:]+:[^@]+@[^/]+/g, severity: Severity.Critical },

  // Private Keys
  { name: "RSA Private Key", pattern: /-----BEGIN RSA PRIVATE KEY-----/g, severity: Severity.Critical },
  { name: "Private Key", pattern: /-----BEGIN PRIVATE KEY-----/g, severity: Severity.Critical },
  { name: "SSH Key", pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g, severity: Severity.Critical },

  // JWT
  { name: "JWT", pattern: /eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/g, severity: Severity.High },
];

const FALSE_POSITIVES = [
  /YOUR_API_KEY/i,
  /YOUR_SECRET/i,
  /xxx+/i,
  /changeme/i,
  /placeholder/i,
  /example\.com/i,
  /localhost/i,
  /127\.0\.0\.1/i,
];

export async function scanForSecrets(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const files = await fg("**/*", {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/out/**",
      "**/*.min.js",
      "**/*.map",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/bun.lock",
    ],
  });

  for (const file of files) {
    const filePath = join(root, file);

    let content: string;
    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue; // Skip binary files
    }

    for (const { name, pattern, severity } of SECRET_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const matchedText = match[0];

        // Check for false positives
        const isFalsePositive = FALSE_POSITIVES.some((fp) => fp.test(matchedText));
        if (isFalsePositive) continue;

        // Get line number
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;

        // Get surrounding context
        const contextStart = Math.max(0, lines.length - 1);
        const contextEnd = content.indexOf("\n", match.index);
        const snippet = content.slice(
          content.lastIndexOf("\n", match.index) + 1,
          contextEnd === -1 ? undefined : contextEnd
        );

        findings.push(
          createFinding({
            title: `Hardcoded ${name}`,
            description: `Found hardcoded ${name.toLowerCase()} in source code. Secrets should never be committed to version control.`,
            severity,
            confidence: Confidence.High,
            category: "Secrets",
            evidence: [
              {
                type: EvidenceType.CodePattern,
                file,
                line,
                snippet,
                description: `Found ${name} pattern`,
              },
            ],
            recommendation: `Move this secret to environment variables or a secrets manager. Add .env to .gitignore if not already excluded.`,
          })
        );
      }
    }
  }

  return findings;
}
