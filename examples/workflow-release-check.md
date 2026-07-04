# Example Workflow: Full Release Check

## Scenario

You're about to release v2.0.0 of your API. Run all checks before deploying.

## Steps

### 1. Run Security Audit

```bash
bun run dev security-audit . --deep
```

Check for:
- Hardcoded secrets
- SQL injection
- XSS vulnerabilities
- Configuration issues

### 2. Run Dependency Review

```bash
bun run dev dependency-review . --deep
```

Check for:
- Outdated packages
- Unused dependencies
- License issues

### 3. Run Performance Audit

```bash
bun run dev performance-audit . --quick
```

Check for:
- N+1 queries
- Memory leaks
- Blocking operations

### 4. Run Release Check

```bash
bun run dev release-check .
```

Check for:
- Changelog exists
- Version bumped
- CI/CD configured
- No breaking changes

### 5. Generate JSON Reports

```bash
bun run dev security-audit . --json > security-report.json
bun run dev dependency-review . --json > dependency-report.json
```

### 6. Review and Fix

1. Address all Critical findings
2. Address High findings
3. Document Medium/Low findings

### 7. Deploy

Once all checks pass, deploy with confidence.

## Automation

Create a script to run all checks:

```bash
#!/bin/bash
set -e

echo "Running security audit..."
bun run dev security-audit . --json > reports/security.json

echo "Running dependency review..."
bun run dev dependency-review . --json > reports/dependencies.json

echo "Running release check..."
bun run dev release-check . --json > reports/release.json

echo "All checks passed!"
```
