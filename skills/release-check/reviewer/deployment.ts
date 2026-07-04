import { readFileSync, existsSync } from "fs";
import { join } from "path";
import fg from "fast-glob";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanDeployment(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check for Dockerfile
  const dockerfiles = await fg("**/Dockerfile*", { cwd: root, onlyFiles: true });
  for (const file of dockerfiles) {
    const filePath = join(root, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Check for HEALTHCHECK
    if (!content.includes("HEALTHCHECK")) {
      findings.push(
        createFinding({
          title: "No Health Check",
          description: "Dockerfile has no HEALTHCHECK instruction.",
          severity: Severity.Low,
          confidence: Confidence.High,
          category: "Deployment",
          evidence: [{ type: EvidenceType.Configuration, file, description: "No HEALTHCHECK" }],
          recommendation: "Add HEALTHCHECK for container orchestration.",
        })
      );
    }

    // Check for non-root user
    if (!content.includes("USER ")) {
      findings.push(
        createFinding({
          title: "Running as Root",
          description: "Container runs as root user.",
          severity: Severity.Medium,
          confidence: Confidence.High,
          category: "Deployment",
          evidence: [{ type: EvidenceType.Configuration, file, description: "No USER instruction" }],
          recommendation: "Add USER instruction for non-root execution.",
        })
      );
    }
  }

  // Check for .env.example
  if (!existsSync(join(root, ".env.example")) && !existsSync(join(root, ".env.sample"))) {
    const hasEnvConfig = existsSync(join(root, ".env")) || existsSync(join(root, ".env.local"));
    if (hasEnvConfig) {
      findings.push(
        createFinding({
          title: "No .env.example",
          description: "No example environment file for deployment reference.",
          severity: Severity.Low,
          confidence: Confidence.Medium,
          category: "Deployment",
          evidence: [{ type: EvidenceType.FileStructure, file: "project root", description: "No .env.example" }],
          recommendation: "Create .env.example with required variables.",
        })
      );
    }
  }

  return findings;
}
