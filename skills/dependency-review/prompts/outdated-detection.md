# Outdated Detection Prompt

Detect outdated packages in project dependencies.

## Detection Strategy

### package.json Analysis

```json
{
  "dependencies": {
    "express": "^4.18.0",    // Check if 5.x available
    "lodash": "^4.17.21",    // Stable, but check security patches
    "moment": "^2.29.4"      // Deprecated, consider dayjs
  }
}
```

### Version Patterns

| Pattern | Meaning | Risk |
|---------|---------|------|
| `^4.18.0` | >=4.18.0 <5.0.0 | Low |
| `~4.18.0` | >=4.18.0 <4.19.0 | Low |
| `4.18.0` | Exact version | None |
| `*` | Any version | High |
| `latest` | Latest version | High |

### Outdated Indicators

1. Major version behind (e.g., v4 when v5 available)
2. Security advisory exists
3. Package deprecated
4. Last updated >2 years ago

## Check Methods

1. Parse package.json versions
2. Check for known deprecated packages
3. Look for pinned versions that are very old

## Output

For each finding:
```
Finding: [Outdated/Deprecated Package]
Severity: [High|Medium|Low]
Package: [name]
Current: [version]
Latest: [version]
Impact: [what's missing]
Recommendation: [how to update]
```
