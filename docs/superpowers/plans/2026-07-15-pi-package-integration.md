# Pi Package Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Pi Package support into ForgeSkills by adding `pi` manifest configurations to `package.json` and documenting `pi install` commands in `README.md`.

**Architecture:** Add standard Pi Package keywords and skill directory maps to `package.json`, then add a Pi installation subsection to `README.md`. Verify programmatically via automated tests.

**Tech Stack:** Bun, TypeScript, Vitest

## Global Constraints
- Target platform: Pi Agent
- Location of config: `package.json`, `README.md`

---

### Task 1: Test and Configure package.json for Pi Package Support

**Files:**
- Create: `tests/package-json.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: None
- Produces: Validated `package.json` configuration for Pi Agent.

- [ ] **Step 1: Write the failing test**

  Create `tests/package-json.test.ts` with the following content:
  ```typescript
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
  ```

- [ ] **Step 2: Run test to verify it fails**

  Run: `bun run test tests/package-json.test.ts`
  Expected: FAIL with missing keyword/property errors.

- [ ] **Step 3: Write minimal implementation**

  Modify `package.json` to add `"pi-package"` and `"pi"` key:
  ```json
    "keywords": [
      "ai",
      "code-review",
      "security-audit",
      "performance",
      "architecture",
      "skills",
      "opencode",
      "claude",
      "pi-package"
    ],
    "pi": {
      "skills": [
        "./skills"
      ]
    }
  ```

- [ ] **Step 4: Run test to verify it passes**

  Run: `bun run test tests/package-json.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**

  ```bash
  git add package.json tests/package-json.test.ts
  git commit -m "feat: add pi-package configuration to package.json"
  ```

---

### Task 2: Document Pi Agent Installation in README.md

**Files:**
- Modify: `README.md`
- Modify: `tests/package-json.test.ts`

**Interfaces:**
- Consumes: Validated `package.json` config
- Produces: Updated `README.md` documentation with Pi install guides.

- [ ] **Step 1: Write the failing test**

  Add a new test to `tests/package-json.test.ts`:
  ```typescript
  test("README.md has pi install documentation", () => {
    const readmePath = join(__dirname, "../README.md");
    const readmeContent = readFileSync(readmePath, "utf8");

    expect(readmeContent).toContain("pi install git:github.com/SiamAlSobari/ForgeSkills");
  });
  ```

- [ ] **Step 2: Run test to verify it fails**

  Run: `bun run test tests/package-json.test.ts`
  Expected: FAIL with missing documentation content error.

- [ ] **Step 3: Write minimal implementation**

  Modify `README.md` under `## ⚙️ Installation & Management` and `### 1. Quick Integration` to add the following block:
  ```markdown
  ### For Pi Agent

  Install globally as a Pi Package directly from GitHub or local path:

  ```bash
  # Install globally from GitHub repository
  pi install git:github.com/SiamAlSobari/ForgeSkills

  # Or install from local directory
  pi install ./path/to/ForgeSkills
  ```
  ```

- [ ] **Step 4: Run test to verify it passes**

  Run: `bun run test tests/package-json.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**

  ```bash
  git add README.md tests/package-json.test.ts
  git commit -m "docs: add pi install documentation to README.md"
  ```
