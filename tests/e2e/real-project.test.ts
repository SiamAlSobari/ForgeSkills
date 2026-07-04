import { describe, it, expect } from "vitest";
import { join } from "path";
import {
  runSecurityAudit,
  runBugInvestigate,
  runPerformanceAudit,
  runArchitectureReview,
  runDependencyReview,
  runDatabaseReview,
  runReleaseCheck,
} from "../../src/cli/runner";

describe("E2E: Real Project Scan", () => {
  // Use the SkillForge project itself as test target
  const projectPath = process.cwd();

  it("security-audit completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runSecurityAudit({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
      expect(report).toHaveProperty("score");
    } finally {
      console.log = originalLog;
    }
  });

  it("bug-investigate completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runBugInvestigate({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });

  it("performance-audit completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runPerformanceAudit({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });

  it("architecture-review completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runArchitectureReview({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });

  it("dependency-review completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runDependencyReview({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });

  it("database-review completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runDatabaseReview({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });

  it("release-check completes without error", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      await runReleaseCheck({ path: projectPath, json: true });
      const output = logs.join("");
      const report = JSON.parse(output);
      expect(report).toHaveProperty("findings");
    } finally {
      console.log = originalLog;
    }
  });
});
