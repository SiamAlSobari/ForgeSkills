import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanUnused } from "../../../skills/dependency-review/reviewer/unused";

describe("dependency-review reviewers for expanded languages", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-dep-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // JS/TS: package.json
    writeFileSync(
      join(tempDir, "package.json"),
      JSON.stringify({
        dependencies: {
          express: "^4.18.2",
          lodash: "^4.17.21",
        },
      })
    );
    // JS/TS code using express but not lodash
    writeFileSync(
      join(tempDir, "server.js"),
      `import express from 'express';
       const app = express();
      `
    );

    // Go: go.mod
    writeFileSync(
      join(tempDir, "go.mod"),
      `module myapp

require (
	github.com/gin-gonic/gin v1.8.1
	github.com/pkg/errors v0.9.1
)
`
    );
    // Go code using gin but not pkg/errors
    writeFileSync(
      join(tempDir, "main.go"),
      `package main
import (
	"github.com/gin-gonic/gin"
)
func main() {
	r := gin.Default()
	r.Run()
}
`
    );

    // Python: requirements.txt
    writeFileSync(
      join(tempDir, "requirements.txt"),
      `requests==2.28.1
numpy>=1.20
`
    );
    // Python code using requests but not numpy
    writeFileSync(
      join(tempDir, "app.py"),
      `import requests
response = requests.get('https://example.com')
`
    );

    // PHP: composer.json
    writeFileSync(
      join(tempDir, "composer.json"),
      JSON.stringify({
        require: {
          "monolog/monolog": "^2.0",
          "symfony/yaml": "^5.0",
        },
      })
    );
    // PHP code using monolog but not symfony/yaml
    writeFileSync(
      join(tempDir, "index.php"),
      `<?php
use Monolog\\Logger;
$log = new Logger('name');
`
    );

    // Java: pom.xml
    writeFileSync(
      join(tempDir, "pom.xml"),
      `<project>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-api</artifactId>
      <version>5.8.2</version>
    </dependency>
    <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-lang3</artifactId>
      <version>3.12.0</version>
    </dependency>
  </dependencies>
</project>
`
    );
    // Java code using junit but not commons-lang3
    writeFileSync(
      join(tempDir, "AppTest.java"),
      `import org.junit.jupiter.api.Test;
public class AppTest {
    @Test
    public void testApp() {}
}
`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanUnused", () => {
    it("detects unused dependencies for all supported languages", async () => {
      const findings = await scanUnused(tempDir);
      const unusedDeps = findings.map((f) => f.title);

      // Verify JS/TS finding
      expect(unusedDeps).toContain("Unused Dependency: lodash");
      expect(unusedDeps).not.toContain("Unused Dependency: express");

      // Verify Go finding
      expect(unusedDeps).toContain("Unused Dependency: github.com/pkg/errors");
      expect(unusedDeps).not.toContain("Unused Dependency: github.com/gin-gonic/gin");

      // Verify Python finding
      expect(unusedDeps).toContain("Unused Dependency: numpy");
      expect(unusedDeps).not.toContain("Unused Dependency: requests");

      // Verify PHP finding
      expect(unusedDeps).toContain("Unused Dependency: symfony/yaml");
      expect(unusedDeps).not.toContain("Unused Dependency: monolog/monolog");

      // Verify Java finding
      expect(unusedDeps).toContain("Unused Dependency: org.apache.commons:commons-lang3");
      expect(unusedDeps).not.toContain("Unused Dependency: org.junit.jupiter:junit-jupiter-api");
    });
  });
});
