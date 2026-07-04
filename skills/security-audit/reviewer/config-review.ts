import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface ConfigCheck {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const CORS_CHECKS: ConfigCheck[] = [
  {
    name: "CORS Wildcard Origin",
    pattern: /(?:origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin\s*:\s*\*)/g,
    severity: Severity.High,
    description: "CORS wildcard origin allows any domain to make cross-origin requests.",
    recommendation: "Restrict CORS to specific trusted domains.",
  },
  {
    name: "CORS Reflecting Origin",
    pattern: /origin\s*:\s*(?:true|req\.headers\.origin)/g,
    severity: Severity.Medium,
    description: "CORS reflects the request origin without validation.",
    recommendation: "Validate origins against a whitelist before reflecting.",
  },
];

const DEBUG_CHECKS: ConfigCheck[] = [
  {
    name: "Debug Mode Enabled",
    pattern: /(?:NODE_ENV\s*!==?\s*['"]production['"]|DEBUG\s*=\s*(?:true|\*)|debug\s*:\s*true)/g,
    severity: Severity.Medium,
    description: "Debug mode may be enabled in production, exposing sensitive information.",
    recommendation: "Ensure debug mode is disabled in production environments.",
  },
];

const JWT_CHECKS: ConfigCheck[] = [
  {
    name: "Weak JWT Secret",
    pattern: /(?:secret\s*:\s*['"](?:secret|123456|password|keyboard cat)['"]|algorithm\s*:\s*['"]none['"])/g,
    severity: Severity.Critical,
    description: "JWT is configured with a weak or insecure secret/algorithm.",
    recommendation: "Use a strong, random secret and avoid the 'none' algorithm.",
  },
  {
    name: "JWT No Expiry",
    pattern: /jwt\.sign\s*\(\s*[^,]+,\s*[^,]+\s*\)/g,
    severity: Severity.Medium,
    description: "JWT token created without expiration time.",
    recommendation: "Add expiresIn option to JWT signing to limit token lifetime.",
  },
];

const SESSION_CHECKS: ConfigCheck[] = [
  {
    name: "Insecure Cookie - httpOnly Disabled",
    pattern: /httpOnly\s*:\s*false/g,
    severity: Severity.Medium,
    description: "Cookie httpOnly flag is disabled, allowing JavaScript access to cookies.",
    recommendation: "Set httpOnly to true for session cookies.",
  },
  {
    name: "Insecure Cookie - secure Disabled",
    pattern: /secure\s*:\s*false/g,
    severity: Severity.Medium,
    description: "Cookie secure flag is disabled, allowing transmission over HTTP.",
    recommendation: "Set secure to true in production to enforce HTTPS.",
  },
  {
    name: "Weak Session Secret",
    pattern: /secret\s*:\s*['"](?:secret|keyboard cat|123456)['"]/g,
    severity: Severity.High,
    description: "Session uses a weak secret key.",
    recommendation: "Use a strong, random session secret from environment variables.",
  },
];

const ENV_CHECKS: ConfigCheck[] = [
  {
    name: "Environment Variable Exposed",
    pattern: /(?:DB_PASSWORD|API_KEY|SECRET_KEY|PRIVATE_KEY)\s*=\s*[^\$\{]/g,
    severity: Severity.Critical,
    description: "Sensitive environment variable value is hardcoded.",
    recommendation: "Move secrets to .env file and add .env to .gitignore.",
  },
];

export async function scanConfigs(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check for .env committed
  const envFiles = await fg(".env*", {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: [".env.example", ".env.sample", ".env.template"],
  });

  for (const envFile of envFiles) {
    findings.push(
      createFinding({
        title: "Environment File Committed",
        description: `The file ${envFile} may contain secrets and should not be committed to version control.`,
        severity: Severity.High,
        confidence: Confidence.Medium,
        category: "Configuration",
        evidence: [
          {
            type: EvidenceType.Configuration,
            file: envFile,
            description: "Environment file found in repository",
          },
        ],
        recommendation: "Add .env files to .gitignore and use environment variables or a secrets manager.",
      })
    );
  }

  // Scan config files
  const configExtensions = ["ts", "js", "json", "yaml", "yml", "toml", "env", "local"];
  const globPattern = `**/*.{${configExtensions.join(",")}}`;

  const files = await fg(globPattern, {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/bun.lock"],
  });

  const allChecks = [
    ...CORS_CHECKS,
    ...DEBUG_CHECKS,
    ...JWT_CHECKS,
    ...SESSION_CHECKS,
    ...ENV_CHECKS,
  ];

  for (const file of files) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    for (const { name, pattern, severity, description, recommendation } of allChecks) {
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
            category: "Configuration",
            evidence: [
              {
                type: EvidenceType.Configuration,
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
