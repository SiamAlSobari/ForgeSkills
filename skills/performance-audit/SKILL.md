---
name: forge:performance-audit
description: >
  Audit application performance - queries, memory, algorithms, caching, resources.
  Trigger when user types /forge:performance-audit or requests a performance audit/review.
---

# /forge:performance-audit

Audit application performance using AI reasoning.

## Command

```
/forge:performance-audit [path] [--quick|--deep] [--markdown|--json] [--verbose]
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
- N+1 query patterns
- Memory leaks
- Algorithm complexity issues
- Missing caching opportunities
- Resource usage problems

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Repository type
- Primary language
- Framework
- Database usage

### Step 2: Run Performance Analysis

Execute analysis prompts:
1. Query Analysis (`prompts/query-analysis.md`)
2. Memory Analysis (`prompts/memory-analysis.md`)
3. Algorithm Analysis (`prompts/algorithm-analysis.md`)
4. Caching Review (`prompts/caching-review.md`)
5. Resource Usage (`prompts/resource-usage.md`)

### Step 3: Generate Report

Use `shared/report/` to generate:
- Performance Score (0-100)
- Bottleneck analysis
- Optimization recommendations

## Output Format

```
Performance Audit Report

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
