# {{scanType}} Report

**Project:** {{projectName}}
**Path:** {{projectPath}}
**Language:** {{language}}
**Framework:** {{framework}}
**Date:** {{timestamp}}

---

## Score

**{{score}}/100** (Grade: {{grade}})

| Severity | Count |
|----------|-------|
| Critical | {{criticalCount}} |
| High | {{highCount}} |
| Medium | {{mediumCount}} |
| Low | {{lowCount}} |
| Info | {{infoCount}} |

---

## Executive Summary

Found **{{totalFindings}}** issues: **{{criticalCount}}** critical, **{{highCount}}** high, **{{mediumCount}}** medium, **{{lowCount}}** low, **{{infoCount}}** info.

---

## Critical Findings

{{#each criticalFindings}}
### {{this.title}}

**Category:** {{this.category}}
**Confidence:** {{this.confidence}}

{{this.description}}

**Evidence:**
{{#each this.evidence}}
- `{{this.file}}` {{#if this.line}}(line {{this.line}}){{/if}}
{{#if this.snippet}}
```
{{this.snippet}}
```
{{/if}}
{{/each}}

**Impact:**
{{this.impact}}

---
{{/each}}

## High Findings

{{#each highFindings}}
### {{this.title}}

**Category:** {{this.category}}
**Confidence:** {{this.confidence}}

{{this.description}}

**Impact:**
{{this.impact}}

---
{{/each}}

## Medium Findings

{{#each mediumFindings}}
### {{this.title}}

**Category:** {{this.category}}
**Confidence:** {{this.confidence}}

{{this.description}}

**Impact:**
{{this.impact}}

---
{{/each}}

## Low Findings

{{#each lowFindings}}
### {{this.title}}

**Category:** {{this.category}}
**Confidence:** {{this.confidence}}

{{this.description}}

**Impact:**
{{this.impact}}

---
{{/each}}

## Next Steps

{{#each nextSteps}}
{{@number}}. {{this}}
{{/each}}
