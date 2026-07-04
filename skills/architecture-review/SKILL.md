---
name: architecture-review
description: >
  Review project architecture - patterns, separation, modularity, SOLID.
  Trigger when user types /architecture-review or requests an architecture review.
---

# /architecture-review

Review project architecture using AI reasoning.

## Command

```
/architecture-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Options

- `[path]` — Target directory (default: current directory)
- `--quick` — Fast scan, focus on critical issues only
- `--deep` — Thorough scan, check all patterns
- `--markdown` — Output as markdown (default)
- `--json` — Output as JSON
- `--verbose` — Include detailed evidence

## Purpose

Analyze source code for:
- Design pattern usage
- Separation of concerns
- Module boundaries
- Technical debt
- SOLID principles compliance

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Repository type
- Primary language
- Framework
- Project structure

### Step 2: Run Architecture Analysis

Execute analysis prompts:
1. Design Patterns (`prompts/design-patterns.md`)
2. Separation of Concerns (`prompts/separation-of-concerns.md`)
3. Modularity (`prompts/modularity.md`)
4. Technical Debt (`prompts/technical-debt.md`)
5. SOLID Compliance (`prompts/solid-compliance.md`)

### Step 3: Generate Report

Use `shared/report/` to generate:
- Architecture Score (0-100)
- Pattern analysis
- Refactoring recommendations

## Output Format

```
Architecture Review Report

Score: [0-100] (Grade: A-F)

Critical Findings: [count]
High Findings: [count]
Medium Findings: [count]
Low Findings: [count]

[Detailed findings with evidence]

Recommendations:
1. [refactoring suggestion]
2. [refactoring suggestion]

Next Steps:
1. [immediate action]
2. [short-term action]
```
