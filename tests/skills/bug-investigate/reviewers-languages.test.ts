import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanErrorLogs } from "../../../skills/bug-investigate/reviewer/error-log";
import { scanCodePaths } from "../../../skills/bug-investigate/reviewer/code-path";
import { scanEdgeCases } from "../../../skills/bug-investigate/reviewer/edge-case";
import { scanRootCauses } from "../../../skills/bug-investigate/reviewer/root-cause";

describe("bug-investigate reviewers for multi-language extensions", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-multi-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // Go tests
    writeFileSync(
      join(tempDir, "main.go"),
      `package main
import "fmt"
func main() {
    _ = fmt.Println("Hello Go")
    _, err := fmt.Println("Error ignored")
}`
    );

    // Python tests
    writeFileSync(
      join(tempDir, "app.py"),
      `def divide(a, b):
    return a / b

if __name__ == "__main__":
    try:
        divide(10, 0)
    except Exception as e:
        print(e)`
    );

    // Java tests
    writeFileSync(
      join(tempDir, "Main.java"),
      `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}`
    );

    // PHP tests
    writeFileSync(
      join(tempDir, "index.php"),
      `<?php
$obj->doSomething();
set_exception_handler(function($e) {
    echo $e->getMessage();
});`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanEdgeCases", () => {
    it("detects Go unhandled errors, Python division by variable, PHP null method invocation", async () => {
      const findings = await scanEdgeCases(tempDir);
      const titles = findings.map(f => f.title);
      expect(titles).toContain("Go Unhandled Error");
      expect(titles).toContain("Division Without Zero Check");
      expect(titles).toContain("Null Method Invocation");
    });
  });

  describe("scanCodePaths", () => {
    it("detects main/entry points for Go, Python, Java", async () => {
      const findings = await scanCodePaths(tempDir);
      const titles = findings.map(f => f.title);
      expect(titles).toContain("Entry Point / Main Function");
    });
  });

  describe("scanRootCauses", () => {
    it("detects Python/PHP exception/panic handler patterns", async () => {
      const findings = await scanRootCauses(tempDir);
      const titles = findings.map(f => f.title);
      expect(titles).toContain("Exception/Panic Handler");
    });
  });
});
