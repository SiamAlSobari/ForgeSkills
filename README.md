# 🛠️ ForgeSkills

[![npm version](https://img.shields.io/npm/v/@yammd/forge-skills.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@yammd/forge-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-Compatible-black?style=flat-square&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**ForgeSkills** is a global AI skills ecosystem that empowers AI Coding Agents (such as **Google Antigravity / agy**, **OpenCode**, **Claude Code**, and **Pi Agent**) with specialized software engineering capabilities.

### 🌟 Why ForgeSkills?
While modern AI agents are incredibly powerful at writing code and fixing simple bugs, they often lack a structured, systematic methodology for reviewing and auditing codebases. Developers are forced to write long, repetitive prompts to guide the AI, leading to inconsistent outputs, missed vulnerabilities, and lack of severity standardization.

**ForgeSkills** bridges this gap. It acts as a plug-and-play "brain upgrade" for your AI agents, equipping them with standardized commands, structured prompt instructions, and static scanning patterns. It teaches the agent to think, analyze, and report like a seasoned specialist.

### 💎 Key Features
* **Standardised Slash Commands** — Run audits directly inside your AI agent's chat interface (e.g., `/forge:security-audit`, `/forge:ai-audit`).
* **Consistent Scoring & Grading** — Get a clear, severity-weighted score (0-100) and structured Markdown or JSON report for every run.
* **Stand-alone CLI Tool** — Perform static code audits directly from your local terminal or integrate them into CI/CD pipelines.
* **Extensible Architecture** — Customize patterns, add languages, and define custom prompts tailored to your team's stack.
* **Language Agnostic** — Optimized for JavaScript, TypeScript, Python, Go, Java, and PHP.

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
# For Google Antigravity, OpenCode, Claude Code
npx @yammd/forge-skills uninstall --agy
# or --opencode, --claude

# For Pi Agent
pi uninstall @yammd/forge-skills
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

If you want to contribute, set up the project locally, run tests, or add custom prompts/skills, please read our [Contributing Guide](docs/contributing.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
