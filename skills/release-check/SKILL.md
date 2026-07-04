---
name: release-check
description: >
  Pre-release checklist - changelog, version, CI/CD, breaking changes.
  Trigger when user types /release-check or requests a pre-release check.
---

# /release-check

Pre-release checklist using AI reasoning.

## Command

```
/release-check [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Options

- `[path]` — Target directory (default: current directory)
- `--quick` — Fast scan, focus on critical issues only
- `--deep` — Thorough scan, check all patterns
- `--markdown` — Output as markdown (default)
- `--json` — Output as JSON
- `--verbose` — Include detailed evidence

## Purpose

Pre-release verification:
- Changelog verification
- Version validation
- CI/CD pipeline check
- Deployment configuration
- Breaking change detection

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Project type
- Version management
- CI/CD configuration

### Step 2: Run Release Checks

Execute analysis prompts:
1. Changelog Verification (`prompts/changelog-verification.md`)
2. Version Validation (`prompts/version-validation.md`)
3. CI/CD Check (`prompts/ci-cd-check.md`)
4. Deployment Config (`prompts/deployment-config.md`)
5. Breaking Change Detection (`prompts/breaking-change-detection.md`)

### Step 3: Generate Report

Use `shared/report/` to generate:
- Release Readiness Score (0-100)
- Checklist status
- Blocking issues

## Output Format

```
Release Check Report

Score: [0-100] (Grade: A-F)

✅ Passing: [count]
⚠️ Warnings: [count]
❌ Blocking: [count]

[Detailed checklist items]

Blocking Issues:
1. [issue]
2. [issue]

Recommendations:
1. [action]
2. [action]
```
