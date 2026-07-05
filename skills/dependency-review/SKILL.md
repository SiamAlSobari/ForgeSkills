---
name: forge:dependency-review
description: >
  Review project dependencies - outdated, unused, licenses, supply chain risks.
  Trigger when user types /forge:dependency-review or requests a dependency review.
---

# /forge:dependency-review

Review project dependencies using AI reasoning.

## Command

```
/forge:dependency-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Options

- `[path]` — Target directory (default: current directory)
- `--quick` — Fast scan, focus on critical issues only
- `--deep` — Thorough scan, check all patterns
- `--markdown` — Output as markdown (default)
- `--json` — Output as JSON
- `--verbose` — Include detailed evidence

## Purpose

Analyze project dependencies for:
- Outdated packages
- Unused dependencies
- Dependency tree issues
- License compatibility
- Supply chain risks

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Package manager
- Dependency files (package.json, go.mod, requirements.txt)

### Step 2: Run Dependency Analysis

Execute analysis prompts:
1. Outdated Detection (`prompts/outdated-detection.md`)
2. Unused Detection (`prompts/unused-detection.md`)
3. Dependency Tree (`prompts/dependency-tree.md`)
4. License Compatibility (`prompts/license-compatibility.md`)
5. Supply Chain Risk (`prompts/supply-chain-risk.md`)

### Step 3: Generate Report

Use `shared/report/` to generate:
- Dependency Health Score (0-100)
- Risk analysis
- Update recommendations

## Output Format

```
Dependency Review Report

Score: [0-100] (Grade: A-F)

Critical Findings: [count]
High Findings: [count]
Medium Findings: [count]
Low Findings: [count]

[Detailed findings with evidence]

Recommendations:
1. [update suggestion]
2. [removal suggestion]

Next Steps:
1. [immediate action]
2. [short-term action]
```
