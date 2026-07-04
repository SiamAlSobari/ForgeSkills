# SkillForge 🛠️

[![npm version](https://img.shields.io/npm/v/@yammd/skillforge.svg?style=flat-square)](https://www.npmjs.com/package/@yammd/skillforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/SiamAlSobari/ForgeSkill/ci.yml?branch=main&style=flat-square)](https://github.com/SiamAlSobari/ForgeSkill/actions)

**SkillForge** is a Global AI Skills Ecosystem designed to empower AI Coding Agents (such as **OpenCode** and **Claude Code**) with specialized software engineering capabilities.

Instead of typing long, complex prompts for every codebase review, SkillForge equips your AI agent with standardized commands to perform security audits, bug investigations, architecture reviews, performance profiling, and pre-release checks—all under a consistent reporting format and scoring system.

---

## 🎯 What is this package for?

SkillForge bridges the gap between raw AI code assistance and systematic engineering reviews. It teaches your AI agent to think like:
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
| `/security-audit` | **Security Engineer** | Scans for hardcoded secrets, SQL injection, XSS, CSRF, SSRF, RCE, unsafe configuration, and Dockerfile/CI-CD vulnerabilities. |
| `/bug-investigate` | **Debugging Specialist** | Analyzes error logs, traces function execution paths, identifies root causes, and catches edge cases/memory leaks. |
| `/performance-audit` | **Performance Engineer** | Detects N+1 query patterns, memory leak models, inefficient algorithms, caching opportunities, and CPU/IO bottlenecks. |
| `/architecture-review` | **Software Architect** | Checks modularity, layer dependencies, design pattern application, SOLID compliance, and identifies technical debt. |
| `/dependency-review` | **Dependency Analyst** | Detects outdated packages, unused dependencies, licensing incompatibilities, and supply chain vulnerabilities. |
| `/database-review` | **DBA** | Evaluates indexing strategies, schema design flaws, SQL anti-patterns (e.g. `SELECT *`), and unsafe migrations. |
| `/release-check` | **Release Manager** | Runs all audits, verifies changelogs, validates semver version bumps, and checks CI/CD pipeline readiness. |

---

## ⚙️ Installation & Setup

SkillForge can be used either as a local CLI tool or integrated directly as global skills into your AI agents.

### 1. Integration with AI Agents (OpenCode & Claude Code)

You do not need to install the package globally if you prefer using `npx`. Run the installation script using:

#### 🟢 For OpenCode
```bash
npx @yammd/skillforge install --opencode
```
* **What this does**: Automatically copies the SkillForge workflow rules into OpenCode's directory (`~/.config/opencode/skills/`) and generates custom command shortcuts with frontmatter metadata in `~/.config/opencode/commands/`.
* **Next Steps**: Restart OpenCode. Type `/` in your chat, and you should see all the new slash commands (e.g., `/security-audit`).

#### 🟢 For Claude Code
```bash
npx @yammd/skillforge install --claude
```
* **What this does**: Installs the skills context under Claude Code's global directory (`~/.claude/skills/`).
* **Next Steps**: Restart Claude Code to load the skills automatically.

---

### 2. Global CLI Installation (Optional)

If you want to use the commands locally on your machine outside an AI agent's chat interface:

```bash
npm install -g @yammd/skillforge
```

---

## 🧹 Uninstallation

If you ever need to clean up and remove the integrated skills and commands from your AI agents:

#### 🔴 From OpenCode
```bash
npx @yammd/skillforge uninstall --opencode
```
* **What this does**: Safely removes all copied skills directories from `~/.config/opencode/skills/` and command files from `~/.config/opencode/commands/`.

#### 🔴 From Claude Code
```bash
npx @yammd/skillforge uninstall --claude
```
* **What this does**: Safely removes the SkillForge skill directories from `~/.claude/skills/`.

---

## 💻 Local CLI Usage

If you installed SkillForge globally or are running it locally in a development workspace, you can scan repositories directly:

```bash
# General Syntax
skillforge <command> [path] [options]

# Example: Run a deep security audit in the current directory and output to JSON
skillforge security-audit . --deep --json

# Example: Run a quick performance audit in a specific folder
skillforge performance-audit ./src/backend --quick
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

Below is an example of a Markdown report generated by SkillForge, showcasing the table-based severity findings:

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

| Title | Location | Description | Recommendation |
| :--- | :--- | :--- | :--- |
| **Hardcoded API Key** | `src/config/db.ts:12` | Found a hardcoded plain-text API key stored directly in the database configuration file. | Move all sensitive credentials to environment variables (`.env`) and inject them at runtime using `process.env.DB_PASSWORD`. |

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
git clone https://github.com/SiamAlSobari/ForgeSkill.git
cd ForgeSkill

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
