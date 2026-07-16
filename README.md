# 🛠️ ForgeSkills

[![npm version](https://img.shields.io/npm/v/@yammd/forge-skills.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@yammd/forge-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-Compatible-black?style=flat-square&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**ForgeSkills** is a global AI skills ecosystem that empowers AI Coding Agents (such as **Google Antigravity / agy**, **OpenCode**, and **Claude Code**) with specialized software engineering capabilities.

Instead of writing long, repetitive system prompts, **ForgeSkills** equips your AI agents with standardized commands to perform security audits, bug investigations, architecture reviews, performance profiling, database checks, and pre-release audits—all delivered in a consistent reporting format and scoring system.

---

## 🎯 Key Specialists Exposed

ForgeSkills bridges the gap between raw AI code generation and systematic engineering analysis. It instructs your AI agent to think like:

* 🛡️ **Security Engineers** — detecting secrets, injections, and unsafe configurations.
* 🔍 **Debugging Specialists** — analyzing logs, execution paths, and edge cases.
* ⚡ **Performance Engineers** — profiling queries, algorithms, and CPU/IO bottlenecks.
* 📐 **Software Architects** — evaluating design patterns and SOLID compliance.
* 📦 **Dependency Analysts** — finding unused packages and supply-chain risks.
* 🗄️ **Database Administrators** — auditing queries, indexing, and migration issues.
* 🤖 **AI/LLM Reviewers** — auditing SDK configurations, prompt quality, Socratic tutoring flows, and fallback logic.

---

## 🚀 Slash Commands

Once installed, your AI agent gains access to the following global slash commands:

| Command | Specialist Role | Purpose & Scope |
| :--- | :--- | :--- |
| `/forge:security-audit` | 🛡️ Security Engineer | Scans for secrets, injection vulnerabilities (SQL, XSS, CSRF, SSRF, RCE), and unsafe configurations. |
| `/forge:bug-investigate` | 🔍 Debug Specialist | Analyzes error logs, function execution paths, root causes, panics, and edge cases. |
| `/forge:performance-audit` | ⚡ Performance Engineer | Audits N+1 query patterns, memory leaks, inefficient algorithms, caching, and CPU/IO bottlenecks. |
| `/forge:architecture-review` | 📐 Software Architect | Evaluates design patterns, modularity, SOLID principles, and identifies technical debt. |
| `/forge:dependency-review` | 📦 Dependency Analyst | Detects outdated packages, unused dependencies, license issues, and supply-chain risks. |
| `/forge:database-review` | 🗄️ Database Administrator | Audits query execution plans, indexing coverage, database schemas, and migration scripts. |
| `/forge:release-check` | 📦 Release Manager | Runs full checklists, changelog validation, breaking changes, and CI/CD pipelines readiness. |
| `/forge:ai-audit` | 🤖 AI/LLM Reviewer | Audits LLM integration configurations, prompt quality, Socratic tutoring pitfalls, and fallback security. |

> [!TIP]
> **🌐 Language Support**: Optimized for **JavaScript, TypeScript, Python, Go, Java, and PHP**—with extensible pattern definitions to analyze any code repository.

---

## ⚙️ Installation & Management

You don't need to manually clone or configure files. Install and manage everything directly using `npx`.

### 1. Quick Integration

Run the installer command for your preferred AI agent:

```bash
# For Google Antigravity & agy
npx @yammd/forge-skills install --agy

# For OpenCode
npx @yammd/forge-skills install --opencode

# For Claude Code
npx @yammd/forge-skills install --claude
```

> [!NOTE]
> This command copies the system prompts and configurations into your agent's global config directory. Just restart the agent afterwards!

### For Pi Agent

Install globally as a Pi Package directly from GitHub or local path:

```bash
# Install globally from GitHub repository
pi install git:github.com/SiamAlSobari/ForgeSkills

# Or install from local directory
pi install ./path/to/ForgeSkills
```

### 2. Interactive Upgrade & Maintenance

When a new version is released, update your active agents with a single interactive menu:

```bash
npx @yammd/forge-skills@latest upgrade
```

* **Interactive Menu**: Use the **Up/Down arrows** to navigate, **Space** to select/deselect agents, and **Enter** to perform the upgrade.

### 3. Uninstalling

To cleanly remove the skills from your agents:

```bash
npx @yammd/forge-skills uninstall --agy
# or --opencode, --claude
```

---

## 💻 Local CLI Usage

You can also run audits directly on your machine outside any AI agent interface:

```bash
# Install globally
npm install -g @yammd/forge-skills

# Run a deep security audit in the current folder
forge-skills security-audit . --deep

# Run a performance audit with Indonesian output
forge-skills performance-audit ./src/backend --lang id
```

### CLI Flags
* `--quick` — Runs a fast audit focusing strictly on high-impact, critical patterns.
* `--deep` — Runs a comprehensive scan across all source files.
* `--json` — Outputs machine-readable JSON structure instead of Markdown.
* `--lang <lang>` — Output language locale (`en` or `id`, default: `en`).

---

## 🛠️ Development & Contribution

We use [Bun](https://bun.sh) for fast development and testing.

```bash
# 1. Clone & install
git clone https://github.com/SiamAlSobari/ForgeSkills.git
cd ForgeSkills
bun install

# 2. Run test suite
bun test

# 3. Check types
bun run typecheck
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
