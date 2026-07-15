import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("package.json", () => {
  it("has pi-package keyword and pi.skills config", () => {
    const pkgPath = join(__dirname, "../package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

    expect(pkg.keywords).toContain("pi-package");
    expect(pkg.pi).toBeDefined();
    expect(pkg.pi?.skills).toContain("./skills");
  });

  it("has pi install documentation in README.md", () => {
    const readmePath = join(__dirname, "../README.md");
    const readmeContent = readFileSync(readmePath, "utf8");

    expect(readmeContent).toContain("pi install git:github.com/SiamAlSobari/ForgeSkills");
  });
});
