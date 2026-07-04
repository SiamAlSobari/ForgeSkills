import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanCICD(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check for CI/CD config files
  const cicdFiles = [
    ".github/workflows/*.yml",
    ".github/workflows/*.yaml",
    ".gitlab-ci.yml",
    "Jenkinsfile",
    ".circleci/config.yml",
    "bitbucket-pipelines.yml",
  ];

  let hasCICD = false;

  for (const pattern of cicdFiles) {
    const files = await fg(pattern, { cwd: root, onlyFiles: true });
    if (files.length > 0) {
      hasCICD = true;

      for (const file of files) {
        const filePath = join(root, file);
        let content: string;

        try {
          content = readFileSync(filePath, "utf-8");
        } catch {
          continue;
        }

        // Check for test step
        if (!/test|jest|vitest|mocha|pytest/i.test(content)) {
          findings.push(
            createFinding({
              title: "No Tests in CI",
              description: `CI config ${file} doesn't run tests.`,
              severity: Severity.High,
              confidence: Confidence.Medium,
              category: "CI/CD",
              evidence: [{ type: EvidenceType.Configuration, file, description: "No test step found" }],
              recommendation: "Add test step to CI pipeline.",
            })
          );
        }

        // Check for lint step
        if (!/lint|eslint|prettier/i.test(content)) {
          findings.push(
            createFinding({
              title: "No Linting in CI",
              description: `CI config ${file} doesn't run linting.`,
              severity: Severity.Low,
              confidence: Confidence.Medium,
              category: "CI/CD",
              evidence: [{ type: EvidenceType.Configuration, file, description: "No lint step found" }],
              recommendation: "Add lint step to CI pipeline.",
            })
          );
        }

        // Check for build step
        if (!/build|compile|tsc/i.test(content)) {
          findings.push(
            createFinding({
              title: "No Build in CI",
              description: `CI config ${file} doesn't verify build.`,
              severity: Severity.Medium,
              confidence: Confidence.Medium,
              category: "CI/CD",
              evidence: [{ type: EvidenceType.Configuration, file, description: "No build step found" }],
              recommendation: "Add build step to CI pipeline.",
            })
          );
        }
      }
    }
  }

  if (!hasCICD) {
    findings.push(
      createFinding({
        title: "No CI/CD Configuration",
        description: "No CI/CD pipeline found. Automated testing and deployment not configured.",
        severity: Severity.High,
        confidence: Confidence.High,
        category: "CI/CD",
        evidence: [{ type: EvidenceType.FileStructure, file: "project root", description: "No CI/CD config files" }],
        recommendation: "Add GitHub Actions, GitLab CI, or other CI/CD configuration.",
      })
    );
  }

  return findings;
}
