---
name: bug-investigate
description: >
  Investigate bugs automatically - error logs, code paths, root cause analysis, edge cases.
  Trigger when user types /bug-investigate or requests bug investigation/debugging.
---

# /bug-investigate

Investigate bugs automatically using AI reasoning.

## Command

```
/bug-investigate [path] [--quick|--deep] [--markdown|--json] [--verbose]
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
- Error handling issues
- Null/undefined access risks
- Race conditions
- Memory leaks
- Edge case bugs

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Repository type
- Primary language
- Framework
- Project structure

### Step 2: Run Bug Analysis

Execute analysis prompts:
1. Error Log Analysis (`prompts/error-log-analysis.md`)
2. Code Path Tracing (`prompts/code-path-tracing.md`)
3. Root Cause Analysis (`prompts/root-cause-analysis.md`)
4. Edge Case Detection (`prompts/edge-case-detection.md`)

### Step 3: Classify Findings

For each finding:
- Assign severity: Critical, High, Medium, Low, Info
- Assign confidence: High, Medium, Low
- Include evidence (file, line, code snippet)

### Step 4: Generate Report

Use `shared/report/` to generate:
- Bug Score (0-100)
- Severity-grouped findings
- Root cause analysis
- Fix recommendations

## Output Format

```
Bug Investigation Report

Score: [0-100] (Grade: A-F)

Critical Findings: [count]
High Findings: [count]
Medium Findings: [count]
Low Findings: [count]
Info Findings: [count]

[Detailed findings with evidence and root cause]

Recommendations:
1. [actionable fix]
2. [actionable fix]

Next Steps:
1. [immediate action]
2. [short-term action]
```
