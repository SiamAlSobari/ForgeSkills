import { describe, it, expect } from "vitest";
import { join } from "path";
import { runSecurityAudit, runBugInvestigate, runPerformanceAudit } from "../../src/cli/runner";

describe("Integration: Full Workflow", () => {
  const fixturePath = join(process.cwd(), "tests/fixtures/node-project");

  it("security-audit returns findings", async () => {
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runSecurityAudit({ path: fixturePath, json: false });
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.join("\n")).toContain("Security Audit");
    } finally {
      console.log = originalLog;
    }
  });

  it("bug-investigate returns findings", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runBugInvestigate({ path: fixturePath, json: false });
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.join("\n")).toContain("Bug Investigation");
    } finally {
      console.log = originalLog;
    }
  });

  it("performance-audit returns findings", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runPerformanceAudit({ path: fixturePath, json: false });
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.join("\n")).toContain("Performance Audit");
    } finally {
      console.log = originalLog;
    }
  });
});
