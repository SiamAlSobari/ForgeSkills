import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanChangelog(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  const changelogFiles = ["CHANGELOG.md", "CHANGES.md", "HISTORY.md", "RELEASE_NOTES.md"];
  let foundChangelog = false;

  for (const file of changelogFiles) {
    const filePath = join(root, file);
    if (existsSync(filePath)) {
      foundChangelog = true;
      const content = readFileSync(filePath, "utf-8");

      // Check if empty
      if (content.trim().length < 50) {
        findings.push(
          createFinding({
            title: "Empty Changelog",
            description: `${file} exists but appears empty or very short.`,
            severity: Severity.Medium,
            confidence: Confidence.High,
            category: "Changelog",
            evidence: [{ type: EvidenceType.Configuration, file, description: "Changelog too short" }],
            recommendation: "Add release notes to changelog.",
          })
        );
      }

      // Check for placeholder text
      if (/TODO|FIXME|placeholder|lorem ipsum/i.test(content)) {
        findings.push(
          createFinding({
            title: "Placeholder in Changelog",
            description: `${file} contains placeholder text.`,
            severity: Severity.Medium,
            confidence: Confidence.High,
            category: "Changelog",
            evidence: [{ type: EvidenceType.Configuration, file, description: "Placeholder text found" }],
            recommendation: "Replace placeholder with actual release notes.",
          })
        );
      }

      break;
    }
  }

  if (!foundChangelog) {
    findings.push(
      createFinding({
        title: "Missing Changelog",
        description: "No changelog file found. Users won't know what changed.",
        severity: Severity.Medium,
        confidence: Confidence.High,
        category: "Changelog",
        evidence: [{ type: EvidenceType.FileStructure, file: "project root", description: "No CHANGELOG.md" }],
        recommendation: "Create CHANGELOG.md with release notes.",
      })
    );
  }

  return findings;
}
