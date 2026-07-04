import { describe, it, expect } from "vitest";
import { join } from "path";
import { runSecurityAudit } from "../../src/cli/runner";

describe("E2E: Cross-Skill Consistency", () => {
  const fixturePath = join(process.cwd(), "tests/fixtures/node-project");

  it("all skills produce consistent report format", async () => {
    const skills = [
      "security-audit",
      "bug-investigate",
      "performance-audit",
      "architecture-review",
      "dependency-review",
      "database-review",
      "release-check",
    ];

    for (const skill of skills) {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (msg: string) => logs.push(msg);

      try {
        const runner = await import("../../src/cli/runner");
        const fnName = `run${skill.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}`;
        const fn = (runner as any)[fnName];

        if (fn) {
          await fn({ path: fixturePath, json: true });
          const output = logs.join("");
          const report = JSON.parse(output);

          // All reports should have these fields
          expect(report).toHaveProperty("version");
          expect(report).toHaveProperty("metadata");
          expect(report).toHaveProperty("score");
          expect(report).toHaveProperty("summary");
          expect(report).toHaveProperty("findings");
          expect(Array.isArray(report.findings)).toBe(true);
        }
      } finally {
        console.log = originalLog;
      }
    }
  });
});
