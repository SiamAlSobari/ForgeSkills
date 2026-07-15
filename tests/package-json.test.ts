import { test, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

test("package.json has pi-package keyword and pi.skills config", () => {
  const pkgPath = join(__dirname, "../package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

  expect(pkg.keywords).toContain("pi-package");
  expect(pkg.pi).toBeDefined();
  expect(pkg.pi.skills).toContain("./skills");
});
