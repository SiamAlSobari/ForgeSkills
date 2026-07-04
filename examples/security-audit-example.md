# Security Audit Report

**Project:** my-api-app
**Path:** /path/to/my-api-app
**Language:** TypeScript
**Framework:** Express
**Date:** 2024-01-15T10:30:00Z

---

## Score

**72/100** (Grade: C)

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 2 |
| Medium | 3 |
| Low | 5 |

---

## Executive Summary

Found **11** issues: **1** critical, **2** high, **3** medium, **5** low. The project has a hardcoded secret and SQL injection vulnerability that should be addressed immediately.

---

## Critical Findings

### Hardcoded Secret

**Category:** Security | **Confidence:** High

Found hardcoded API key in source code. Secrets should never be committed to version control.

**Evidence:**
- `src/config/api.ts` (line 12)
  ```typescript
  const API_KEY = "sk_live_abc123def456";
  ```

**Recommendation:**
Move to environment variables. Add `.env` to `.gitignore`.

---

## High Findings

### SQL Injection

**Category:** Injection | **Confidence:** High

String interpolation in SQL query allows SQL injection attacks.

**Evidence:**
- `src/routes/users.ts` (line 45)
  ```typescript
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
  ```

**Recommendation:**
Use parameterized queries: `db.query('SELECT * FROM users WHERE id = ?', [req.params.id])`

---

### Remote Code Execution

**Category:** RCE | **Confidence:** High

`eval()` with user input allows arbitrary code execution.

**Evidence:**
- `src/routes/admin.ts` (line 23)
  ```typescript
  eval(req.body.code);
  ```

**Recommendation:**
Remove eval() usage. Use safer alternatives based on the use case.

---

## Medium Findings

### CORS Wildcard Origin

**Category:** Configuration | **Confidence:** Medium

CORS wildcard origin allows any domain to make cross-origin requests.

**Evidence:**
- `src/middleware/cors.ts` (line 5)
  ```typescript
  app.use(cors({ origin: '*' }));
  ```

**Recommendation:**
Restrict CORS to specific trusted domains.

---

## Recommendations

1. Remove all hardcoded secrets immediately
2. Implement parameterized queries
3. Remove eval() usage
4. Configure CORS properly
5. Add rate limiting

## Next Steps

1. Fix all Critical issues before deployment
2. Address High issues within this sprint
3. Schedule Medium issues for next release
