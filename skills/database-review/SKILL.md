---
name: forge:database-review
description: >
  Review database usage - queries, indexing, schema, migrations.
  Trigger when user types /forge:database-review or requests a database review.
---

# /forge:database-review

Review database usage and queries using AI reasoning.

## Command

```
/forge:database-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Options

- `[path]` — Target directory (default: current directory)
- `--quick` — Fast scan, focus on critical issues only
- `--deep` — Thorough scan, check all patterns
- `--markdown` — Output as markdown (default)
- `--json` — Output as JSON
- `--verbose` — Include detailed evidence

## Purpose

Analyze database usage for:
- Query performance issues
- Indexing problems
- Schema design issues
- SQL anti-patterns
- Migration risks

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Database type (PostgreSQL, MySQL, MongoDB, etc.)
- ORM usage
- Migration files

### Step 2: Run Database Analysis

Execute analysis prompts:
1. Query Performance (`prompts/query-performance.md`)
2. Indexing Strategy (`prompts/indexing-strategy.md`)
3. Schema Design (`prompts/schema-design.md`)
4. SQL Anti-patterns (`prompts/sql-anti-patterns.md`)
5. Migration Safety (`prompts/migration-safety.md`)

### Step 3: Generate Report

Use `shared/report/` to generate:
- Database Health Score (0-100)
- Query analysis
- Optimization recommendations

## Output Format

```
Database Review Report

Score: [0-100] (Grade: A-F)

Critical Findings: [count]
High Findings: [count]
Medium Findings: [count]
Low Findings: [count]

[Detailed findings with evidence]

Recommendations:
1. [optimization]
2. [optimization]

Next Steps:
1. [immediate action]
2. [short-term action]
```
