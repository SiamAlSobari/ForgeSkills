# Supply Chain Risk Prompt

Assess supply chain risks in dependencies.

## Risk Factors

### Package Authenticity

| Factor | Risk Level |
|--------|------------|
| <100 weekly downloads | High |
| <10 stars on GitHub | Medium |
| No repository link | Medium |
| Single maintainer | Medium |
| New package (<6 months) | High |

### Typosquatting

Common targets:
- `lodash` → `l0dash`, `lodahs`
- `express` → `expres`, `expresss`
- `react` → `raect`, `recat`

### Known Malicious

Check for:
- Packages with known security advisories
- Packages with suspicious code patterns
- Packages that execute code on install

## Detection Strategy

1. Check package.json repository field
2. Look for suspicious package names
3. Check for postinstall scripts

## Output

For each finding:
```
Finding: [Supply Chain Risk]
Severity: [Critical|High|Medium]
Package: [name]
Risk: [risk description]
Evidence: [indicators]
Recommendation: [mitigation]
```
