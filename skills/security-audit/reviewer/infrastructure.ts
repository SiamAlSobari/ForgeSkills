import { readFileSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

interface InfraCheck {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  recommendation: string;
}

const DOCKERFILE_CHECKS: InfraCheck[] = [
  {
    name: "Docker Running as Root",
    pattern: /^(?!.*USER\s+\w+)/gm,
    severity: Severity.Medium,
    description: "Dockerfile does not specify a non-root USER, container runs as root by default.",
    recommendation: "Add a USER instruction to run the container as a non-root user.",
  },
  {
    name: "Docker Using Latest Tag",
    pattern: /FROM\s+\w+:latest/g,
    severity: Severity.Medium,
    description: "Using 'latest' tag can lead to unpredictable builds.",
    recommendation: "Pin the image to a specific version for reproducible builds.",
  },
  {
    name: "Docker Secret in ENV",
    pattern: /(?:ENV|ARG)\s+(?:API_KEY|SECRET|PASSWORD|TOKEN|DB_)/gim,
    severity: Severity.High,
    description: "Secrets exposed in Docker ENV or ARG instructions.",
    recommendation: "Use Docker secrets or multi-stage builds to handle sensitive data.",
  },
  {
    name: "Docker Sudo Installed",
    pattern: /apt-get\s+install.*sudo/g,
    severity: Severity.Medium,
    description: "sudo package installed in container, potentially allowing privilege escalation.",
    recommendation: "Remove sudo from container images.",
  },
];

const DOCKER_COMPOSE_CHECKS: InfraCheck[] = [
  {
    name: "Docker Compose Exposed Database Port",
    pattern: /ports:\s*\n\s*-\s*['"]?(?:3306|5432|27017|6379|9200)/gm,
    severity: Severity.Medium,
    description: "Database port exposed to host network.",
    recommendation: "Remove port mapping for database services unless needed for development.",
  },
  {
    name: "Docker Compose Hardcoded Secret",
    pattern: /(?:DB_PASSWORD|API_KEY|SECRET_KEY)\s*:\s*['"]?(?!\$\{)[^'"\s]+/g,
    severity: Severity.High,
    description: "Secrets hardcoded in docker-compose.yml.",
    recommendation: "Use Docker secrets or environment variable references.",
  },
  {
    name: "Docker Compose Privileged Mode",
    pattern: /privileged\s*:\s*true/g,
    severity: Severity.High,
    description: "Container running in privileged mode with full host access.",
    recommendation: "Remove privileged mode and use specific capabilities instead.",
  },
];

const KUBERNETES_CHECKS: InfraCheck[] = [
  {
    name: "K8s Privileged Container",
    pattern: /privileged\s*:\s*true/g,
    severity: Severity.Critical,
    description: "Container running in privileged mode with full host access.",
    recommendation: "Set privileged to false and use specific security contexts.",
  },
  {
    name: "K8s Running as Root",
    pattern: /runAsNonRoot\s*:\s*false/g,
    severity: Severity.High,
    description: "Container configured to run as root.",
    recommendation: "Set runAsNonRoot to true and specify a non-root user.",
  },
  {
    name: "K8s Host Network",
    pattern: /hostNetwork\s*:\s*true/g,
    severity: Severity.High,
    description: "Container using host network namespace.",
    recommendation: "Use pod networking instead of host network.",
  },
  {
    name: "K8s Secret in Environment",
    pattern: /value\s*:\s*['"]?(?!\$\{)[A-Za-z0-9+/=]{20,}/g,
    severity: Severity.High,
    description: "Possible secret value hardcoded in Kubernetes manifest.",
    recommendation: "Use Kubernetes Secrets or external secret management.",
  },
];

const CICD_CHECKS: InfraCheck[] = [
  {
    name: "CI/CD Secret in Logs",
    pattern: /echo\s+\$\{\{\s*secrets\.\w+\s*\}\}/g,
    severity: Severity.Critical,
    description: "Secret exposed in CI/CD logs via echo command.",
    recommendation: "Never echo secrets. Use environment variables directly.",
  },
  {
    name: "CI/CD Unpinned Action",
    pattern: /uses:\s+\w+\/\w+@(?:main|master)/g,
    severity: Severity.Medium,
    description: "GitHub Action using unpinned branch reference.",
    recommendation: "Pin actions to specific commit SHA or version tag.",
  },
];

export async function scanInfrastructure(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Dockerfile
  const dockerfiles = await fg("**/Dockerfile*", {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**"],
  });

  for (const file of dockerfiles) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Special check: USER instruction presence
    if (!content.includes("USER ")) {
      findings.push(
        createFinding({
          title: "Docker Running as Root",
          description: "Dockerfile does not specify a non-root USER.",
          severity: Severity.Medium,
          confidence: Confidence.High,
          category: "Infrastructure",
          evidence: [
            {
              type: EvidenceType.Configuration,
              file,
              description: "No USER instruction found",
            },
          ],
          recommendation: "Add USER instruction to run as non-root.",
        })
      );
    }

    for (const check of DOCKERFILE_CHECKS) {
      if (check.name === "Docker Running as Root") continue; // Handled above

      const regex = new RegExp(check.pattern.source, check.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;
        const snippet = lines[lines.length - 1]?.trim();

        findings.push(
          createFinding({
            title: check.name,
            description: check.description,
            severity: check.severity,
            confidence: Confidence.High,
            category: "Infrastructure",
            evidence: [
              {
                type: EvidenceType.Configuration,
                file,
                line,
                snippet,
                description: `Found ${check.name} pattern`,
              },
            ],
            recommendation: check.recommendation,
          })
        );
      }
    }
  }

  // docker-compose
  const composeFiles = await fg("**/docker-compose*.{yml,yaml}", {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**"],
  });

  for (const file of composeFiles) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    for (const check of DOCKER_COMPOSE_CHECKS) {
      const regex = new RegExp(check.pattern.source, check.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;
        const snippet = lines[lines.length - 1]?.trim();

        findings.push(
          createFinding({
            title: check.name,
            description: check.description,
            severity: check.severity,
            confidence: Confidence.Medium,
            category: "Infrastructure",
            evidence: [
              {
                type: EvidenceType.Configuration,
                file,
                line,
                snippet,
                description: `Found ${check.name} pattern`,
              },
            ],
            recommendation: check.recommendation,
          })
        );
      }
    }
  }

  // Kubernetes
  const k8sFiles = await fg("**/*.{yaml,yml}", {
    cwd: root,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/docker-compose*"],
  });

  for (const file of k8sFiles) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Only check files that look like K8s manifests
    if (!content.includes("apiVersion:") || !content.includes("kind:")) continue;

    for (const check of KUBERNETES_CHECKS) {
      const regex = new RegExp(check.pattern.source, check.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;
        const snippet = lines[lines.length - 1]?.trim();

        findings.push(
          createFinding({
            title: check.name,
            description: check.description,
            severity: check.severity,
            confidence: Confidence.Medium,
            category: "Infrastructure",
            evidence: [
              {
                type: EvidenceType.Configuration,
                file,
                line,
                snippet,
                description: `Found ${check.name} pattern`,
              },
            ],
            recommendation: check.recommendation,
          })
        );
      }
    }
  }

  // CI/CD
  const cicdFiles = await fg(".github/workflows/*.{yml,yaml}", {
    cwd: root,
    onlyFiles: true,
  });

  for (const file of cicdFiles) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    for (const check of CICD_CHECKS) {
      const regex = new RegExp(check.pattern.source, check.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const lines = content.slice(0, match.index).split("\n");
        const line = lines.length;
        const snippet = lines[lines.length - 1]?.trim();

        findings.push(
          createFinding({
            title: check.name,
            description: check.description,
            severity: check.severity,
            confidence: Confidence.High,
            category: "Infrastructure",
            evidence: [
              {
                type: EvidenceType.Configuration,
                file,
                line,
                snippet,
                description: `Found ${check.name} pattern`,
              },
            ],
            recommendation: check.recommendation,
          })
        );
      }
    }
  }

  return findings;
}
