# ForgeSkills 🛠️

[![npm version](https://img.shields.io/npm/v/@yammd/forge-skills.svg?style=flat-square)](https://www.npmjs.com/package/@yammd/forge-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/SiamAlSobari/ForgeSkills/ci.yml?branch=main&style=flat-square)](https://github.com/SiamAlSobari/ForgeSkills/actions)

**ForgeSkills** is a Global AI Skills Ecosystem designed to empower AI Coding Agents (such as **OpenCode**, **Claude Code**, and **Google Antigravity**) with specialized software engineering capabilities.

Instead of typing long, complex prompts for every codebase review, ForgeSkills equips your AI agent with standardized commands to perform security audits, bug investigations, architecture reviews, performance profiling, and pre-release checks—all under a consistent reporting format and scoring system.

---

## 🎯 What is this package for?

ForgeSkills bridges the gap between raw AI code assistance and systematic engineering reviews. It teaches your AI agent to think like:
* 🛡️ **Security Engineers** during codebase audits.
* 🔍 **Debugging Engineers** when investigating stack traces or edge cases.
* ⚡ **Performance Engineers** when profiling queries, algorithms, and caches.
* 📐 **Software Architects** when evaluating SOLID compliance and design patterns.
* 📦 **Dependency Analysts** checking package trees and supply-chain risks.
* 🗄️ **Database Administrators** checking query structures and migrations.

---

## 🚀 Available Skills

Once installed, your AI agent gains access to the following global slash commands:

| Command | Role | Purpose & Scope |
| :--- | :--- | :--- |
| `/forge:security-audit` | **Security Engineer** | Scans for hardcoded secrets, SQL injection, XSS, CSRF, SSRF, RCE, unsafe configuration, and Dockerfile/CI-CD vulnerabilities. |
| `/forge:bug-investigate` | **Debugging Specialist** | Analyzes error logs, traces function execution paths, identifies root causes, and catches edge cases/memory leaks. |
| `/forge:performance-audit` | **Performance Engineer** | Detects N+1 query patterns, memory leak models, inefficient algorithms, caching opportunities, and CPU/IO bottlenecks. |
| `/forge:architecture-review` | **Software Architect** | Checks modularity, layer dependencies, design pattern application, SOLID compliance, and identifies technical debt. |
| `/forge:dependency-review` | **Dependency Analyst** | Detects outdated packages, unused dependencies, licensing incompatibilities, and supply chain vulnerabilities. |
| `/forge:database-review` | **DBA** | Evaluates indexing strategies, schema design flaws, SQL anti-patterns (e.g. `SELECT *`), and unsafe migrations. |
| `/forge:release-check` | **Release Manager** | Runs all audits, verifies changelogs, validates semver version bumps, and checks CI/CD pipeline readiness. |

---

## ⚙️ Installation & Setup

ForgeSkills can be used either as a local CLI tool or integrated directly as global skills into your AI agents.

### 1. Integration with AI Agents (OpenCode & Claude Code)

You do not need to install the package globally if you prefer using `npx`. Run the installation script using:

#### 🟢 For OpenCode
```bash
npx @yammd/forge-skills install --opencode
```
* **What this does**: Automatically copies the ForgeSkills workflow rules into OpenCode's directory (`~/.config/opencode/skills/`) and generates custom command shortcuts with frontmatter metadata in `~/.config/opencode/commands/`.
* **Next Steps**: Restart OpenCode. Type `/` in your chat, and you should see all the new slash commands (e.g., `/forge:security-audit`).

#### 🟢 For Claude Code
```bash
npx @yammd/forge-skills install --claude
```
* **What this does**: Installs the skills context under Claude Code's global directory (`~/.claude/skills/`).
* **Next Steps**: Restart Claude Code to load the skills automatically.

#### 🟢 For Google Antigravity
```bash
npx @yammd/forge-skills install --antigravity
# or shortcut:
npx @yammd/forge-skills install --agy
```
* **What this does**: Installs the skills context under Antigravity's global customization directory (`~/.gemini/config/skills/`).
* **Next Steps**: Restart Antigravity to load the skills automatically.

---

### 2. Global CLI Installation (Optional)

If you want to use the commands locally on your machine outside an AI agent's chat interface:

```bash
npm install -g @yammd/forge-skills
```

---

## 🧹 Uninstallation

If you ever need to clean up and remove the integrated skills and commands from your AI agents:

#### 🔴 From OpenCode
```bash
npx @yammd/forge-skills uninstall --opencode
```
* **What this does**: Safely removes all copied skills directories from `~/.config/opencode/skills/` and command files from `~/.config/opencode/commands/`.

#### 🔴 From Claude Code
```bash
npx @yammd/forge-skills uninstall --claude
```
* **What this does**: Safely removes the ForgeSkills skill directories from `~/.claude/skills/`.

#### 🔴 From Google Antigravity
```bash
npx @yammd/forge-skills uninstall --antigravity
# or shortcut:
npx @yammd/forge-skills uninstall --agy
```
* **What this does**: Safely removes the ForgeSkills skill directories from `~/.gemini/config/skills/`.

---

## 💻 Local CLI Usage

If you installed ForgeSkills globally or are running it locally in a development workspace, you can scan repositories directly:

```bash
# General Syntax
forge-skills <command> [path] [options]

# Example: Run a deep security audit in the current directory and output to JSON
forge-skills security-audit . --deep --json

# Example: Run a quick performance audit in a specific folder
forge-skills performance-audit ./src/backend --quick
```

### Supported CLI Flags

Each command accepts the following arguments and options:

* `[path]` — The target directory to scan (default: `.`).
* `--quick` — Runs a fast audit focused strictly on high-impact, critical patterns.
* `--deep` — Runs a comprehensive scan across all source files and configuration items.
* `--markdown` — Generates a beautifully formatted Markdown report (default).
* `--json` — Generates a machine-readable JSON structure containing all findings and scores.
* `--verbose` — Displays detailed execution paths and debug messages.

---

## 📊 Output Example

Below is an example of a Markdown report generated by ForgeSkills, showcasing the table-based severity findings:

### Security Audit Report

**Project:** my-awesome-app  
**Path:** `/path/to/my-awesome-app`  
**Language:** TypeScript  
**Framework:** Express  
**Date:** 2026-07-04T23:45:00Z  

#### Score

**65/100** (Grade: D)

| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 1 |

#### Executive Summary

Found **2** issues: **1** critical, **1** high, **0** medium, **0** low, **0** info.

#### 🔴 Critical Findings

| Title | Location | Description | Impact |
| :--- | :--- | :--- | :--- |
| **Hardcoded API Key** | `src/config/db.ts:12` | Found a hardcoded plain-text API key stored directly in the database configuration file. | Exposes production credentials in source control history, allowing unauthorized read/write access to all application data. |

##### Code Evidence

###### Hardcoded API Key (`src/config/db.ts:12`)
```typescript
const DB_PASSWORD = "super-secret-password-123";
```

---

## 🛠️ Development & Contributions

If you would like to run the project locally and contribute features:

```bash
# Clone the repository
git clone https://github.com/SiamAlSobari/ForgeSkills.git
cd ForgeSkills

# Install packages
bun install

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Perform TypeScript check
bun run typecheck
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
