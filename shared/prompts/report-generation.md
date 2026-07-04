# Report Generation Prompt

You are generating a professional code review report.

## Score Calculation

Base score: 100

Deductions per finding:
- Critical: -25 points
- High: -15 points
- Medium: -8 points
- Low: -3 points
- Info: 0 points

Minimum score: 0

### Grade Scale

| Score | Grade |
|-------|-------|
| 90-100 | A |
| 80-89 | B |
| 70-79 | C |
| 60-69 | D |
| 0-59 | F |

## Severity Classification

### Critical
- Immediate security risk
- Data breach potential
- Remote code execution
- Authentication bypass

### High
- Significant vulnerability
- Requires authentication to exploit
- Limited data exposure

### Medium
- Security weakness
- Best practice violation
- Potential issue under specific conditions

### Low
- Minor issue
- Code quality concern
- Optimization opportunity

### Info
- Informational finding
- Best practice suggestion
- No immediate risk

## Report Structure

```markdown
# [Audit Type] Report

**Project:** [name]
**Path:** [path]
**Language:** [language]
**Framework:** [framework]
**Date:** [timestamp]

## Score

**[score]/100** (Grade: [grade])

| Severity | Count |
|----------|-------|
| Critical | [n] |
| High | [n] |
| Medium | [n] |
| Low | [n] |
| Info | [n] |

## Executive Summary

[1-2 paragraph summary of findings]

## Critical Findings

### [Finding Title]
**Category:** [category]
**Confidence:** [High|Medium|Low]

[Description of the issue]

**Evidence:**
- `[file]` (line [n])
  [code snippet]

**Recommendation:**
[How to fix]

---

[Repeat for each finding by severity]

## Recommendations

1. [Priority recommendation]
2. [Second priority]
...

## Next Steps

1. [Immediate action]
2. [Short-term action]
3. [Long-term action]
```

## Writing Guidelines

- Be specific: cite file paths and line numbers
- Show evidence: include code snippets
- Explain impact: why does this matter?
- Provide actionable fixes: how to resolve
- Use confident language for high-confidence findings
- Use hedging language for low-confidence findings
