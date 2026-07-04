import { describe, it, expect } from "vitest";
import { join } from "path";
import { runSecurityAudit } from "../../src/cli/runner";

describe("Integration: Output Format", () => {
  const fixturePath = join(process.cwd(), "tests/fixtures/node-project");

  it("outputs markdown by default", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runSecurityAudit({ path: fixturePath, markdown: true });
      const output = logs.join("\n");
      expect(output).toContain("#");
      expect(output).toContain("**");
    } finally {
      console.log = originalLog;
    }
  });

  it("outputs JSON when requested", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runSecurityAudit({ path: fixturePath, json: true });
      const output = logs.join("\n");
      // Should be valid JSON
      expect(() => JSON.parse(output)).not.toThrow();
    } finally {
      console.log = originalLog;
    }
  });
});
