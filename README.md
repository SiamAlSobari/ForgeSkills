# 🛠️ ForgeSkills

[![npm version](https://img.shields.io/npm/v/@yammd/forge-skills.svg?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@yammd/forge-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/SiamAlSobari/ForgeSkills/ci.yml?branch=main&style=for-the-badge)](https://github.com/SiamAlSobari/ForgeSkills/actions)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**ForgeSkills** is a Global AI Skills Ecosystem designed to empower AI Coding Agents (such as **Google Antigravity / agy**, **OpenCode**, and **Claude Code**) with specialized software engineering capabilities.

Instead of writing long, repetitive prompts for every codebase review, **ForgeSkills** equips your AI agent with standardized commands to perform security audits, bug investigations, architecture reviews, performance profiling, database checks, and pre-release audits—delivering them in a consistent reporting format and scoring system.

---

## 🎯 Key Capabilities

ForgeSkills bridges the gap between raw AI code generation and systematic engineering analysis. It instructs your AI agent to think like:
* 🛡️ **Security Engineers** during codebase audits.
* 🔍 **Debugging Specialists** when analyzing logs, execution paths, and edge cases.
* ⚡ **Performance Engineers** profiling queries, algorithms, and CPU/IO bottlenecks.
* 📐 **Software Architects** evaluating design patterns, modularity, and SOLID compliance.
* 📦 **Dependency Analysts** checking package trees and supply-chain vulnerabilities.
* 🗄️ **Database Administrators** checking indexes, schema design, and query anti-patterns.

---

## 🚀 Available AI Commands & Skills

Once installed, your AI agent gains access to the following global slash commands:

| Command | Specialist Role | Purpose & Scope |
| :--- | :--- | :--- |
| `/forge:security-audit` | 🛡️ **Security Engineer** | Scans for secrets, injection vulnerabilities (SQL, XSS, CSRF, SSRF, RCE), unsafe configs, and container/CI-CD vulnerabilities. |
| `/forge:bug-investigate` | 🔍 **Debugging Specialist** | Analyzes error logs, traces function execution, identifies root causes, and detects edge cases/memory leaks. |
| `/forge:performance-audit` | ⚡ **Performance Engineer** | Detects N+1 query patterns, memory leaks, inefficient algorithms, caching opportunities, and CPU/IO bottlenecks. |
| `/forge:architecture-review` | 📐 **Software Architect** | Evaluates codebase modularity, layer dependencies, design patterns, SOLID principles, and flags technical debt. |
| `/forge:dependency-review` | 📦 **Dependency Analyst** | Detects outdated packages, unused dependencies, license violations, and supply-chain vulnerabilities. |
| `/forge:database-review` | 🗄️ **DBA** | Evaluates index coverage, schema flaws, SQL anti-patterns (e.g. `SELECT *`), and unsafe migrations. |
| `/forge:release-check` | 📦 **Release Manager** | Runs all audits, checks changelogs, validates semver bump correctness, and ensures CI/CD readiness. |

---

## ⚙️ Installation & Setup

You can install ForgeSkills directly as global skills in your favorite AI Agent, or use it as a standalone CLI.

### 1. Integrating with AI Agents

You don't need to manually clone or install the package globally. Use `npx` to install it into your agent configurations.

#### 🟢 Google Antigravity & agy
```bash
npx @yammd/forge-skills install --antigravity
# or use the shortcut:
npx @yammd/forge-skills install --agy
```
* **What this does**: Copies the ForgeSkills system prompt files and configurations to your global Antigravity config directory (`~/.gemini/config/skills/`).
* **Next Steps**: Restart Antigravity. The new skills are loaded automatically.

#### 🟢 OpenCode
```bash
npx @yammd/forge-skills install --opencode
```
* **What this does**: Automatically copies the rules to `~/.config/opencode/skills/` and creates command shortcuts in `~/.config/opencode/commands/`.
* **Next Steps**: Restart OpenCode. Type `/` in the chat to see the slash commands (e.g., `/forge:security-audit`).

#### 🟢 Claude Code
```bash
npx @yammd/forge-skills install --claude
```
* **What this does**: Copies the skills directly to Claude Code's global directory (`~/.claude/skills/`).
* **Next Steps**: Restart Claude Code to auto-load the skills.

---

### 2. Standalone CLI Installation

If you want to use the commands locally from your host terminal outside of any AI chat interface:

```bash
npm install -g @yammd/forge-skills
```

---

## 💻 Local CLI Usage

Execute audits and reviews directly against target directories:

```bash
# General Syntax
forge-skills <command> [path] [options]

# Example: Run a deep security audit in the current directory and output to JSON
forge-skills security-audit . --deep --json

# Example: Run a performance audit in Indonesian
forge-skills performance-audit ./src/backend --lang id
```

### Supported CLI Flags

Each command accepts the following arguments and options:

* `[path]` — The target directory to scan (default: `.`).
* `--quick` — Runs a fast audit focusing strictly on high-impact, critical patterns.
* `--deep` — Runs a comprehensive scan across all source files and configuration items.
* `--markdown` — Generates a beautifully formatted Markdown report (default).
* `--json` — Outputs machine-readable JSON structure containing all findings and scores.
* `--verbose` — Displays detailed execution paths and debugging messages.
* `--external` — Runs external scanners where applicable (e.g., `npm audit`, `semgrep`). (Available on `security-audit` and `dependency-review`).
* `--lang <lang>` — Output language locale (`en` or `id`, default: `en`).

---

## 🧹 Uninstallation

To safely remove integrated skills and commands from your AI agents:

#### 🔴 Google Antigravity
```bash
npx @yammd/forge-skills uninstall --agy
```

#### 🔴 OpenCode
```bash
npx @yammd/forge-skills uninstall --opencode
```

#### 🔴 Claude Code
```bash
npx @yammd/forge-skills uninstall --claude
```

---

## 📊 Sample Output Report

Here is a preview of the report generated by the ForgeSkills CLI when running a security audit:

### 🛡️ Security Audit Report
**Project:** `my-awesome-app`  
**Path:** `/path/to/my-awesome-app`  
**Language:** TypeScript / Express  
**Date:** 2026-07-07  

#### 📈 Score: 65/100 (Grade: D)

| Severity | Count |
| :--- | :---: |
| 🔴 Critical | 1 |
| 🟠 High | 1 |
| 🟡 Medium | 0 |
| 🔵 Low | 0 |

#### 🔴 Critical Findings
* **Hardcoded API Key** (`src/config/db.ts:12`)
  * **Description**: Plain-text API key stored directly in the database config file.
  * **Impact**: Exposes production credentials in source control, allowing unauthorized read/write access.
  * **Code Evidence**:
    ```typescript
    const DB_PASSWORD = "super-secret-password-123";
    ```

---

## 🛠️ Development & Contribution

We use [Bun](https://bun.sh) for fast development and testing.

```bash
# 1. Clone the repository
git clone https://github.com/SiamAlSobari/ForgeSkills.git
cd ForgeSkills

# 2. Install dependencies
bun install

# 3. Run test suite
bun test
bun test:watch

# 4. Perform type checking
bun run typecheck
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

