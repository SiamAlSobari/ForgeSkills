import { describe, it, expect } from "vitest";
import { existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { runInstall, runUninstall } from "../../src/cli/install";

describe("Integration: Install and Uninstall", () => {
  const tempBase = join(tmpdir(), `skillforge-test-${Date.now()}`);

  it("successfully installs and uninstalls to a mock target path for opencode", () => {
    // Create mock directories
    mkdirSync(tempBase, { recursive: true });

    // Run install
    runInstall({ agent: "opencode", path: tempBase });

    // Check if skills and commands were created
    expect(existsSync(join(tempBase, "skills"))).toBe(true);
    expect(existsSync(join(tempBase, "commands"))).toBe(true);
    expect(existsSync(join(tempBase, "skills", "security-audit"))).toBe(true);
    expect(existsSync(join(tempBase, "commands", "security-audit.md"))).toBe(true);

    // Run uninstall
    runUninstall({ agent: "opencode", path: tempBase });

    // Check if skills and commands were removed
    expect(existsSync(join(tempBase, "skills", "security-audit"))).toBe(false);
    expect(existsSync(join(tempBase, "commands", "security-audit.md"))).toBe(false);

    // Cleanup tempBase
    rmSync(tempBase, { recursive: true, force: true });
  });

  it("successfully installs and uninstalls to a mock target path for claude", () => {
    // Create mock directories
    mkdirSync(tempBase, { recursive: true });

    // Run install
    runInstall({ agent: "claude", path: tempBase });

    // Check if skills were created
    expect(existsSync(join(tempBase, "skills"))).toBe(true);
    expect(existsSync(join(tempBase, "skills", "security-audit"))).toBe(true);
    // commands folder should not be created for claude
    expect(existsSync(join(tempBase, "commands"))).toBe(false);

    // Run uninstall
    runUninstall({ agent: "claude", path: tempBase });

    // Check if skills were removed
    expect(existsSync(join(tempBase, "skills", "security-audit"))).toBe(false);

    // Cleanup tempBase
    rmSync(tempBase, { recursive: true, force: true });
  });
});
