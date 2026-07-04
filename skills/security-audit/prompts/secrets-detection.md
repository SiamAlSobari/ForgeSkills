# Secrets Detection Prompt

Scan source code for hardcoded secrets and credentials.

## Patterns to Detect

### API Keys

```
// AWS Access Key
AKIA[0-9A-Z]{16}

// Google API Key
AIza[0-9A-Za-z\-_]{35}

// GitHub Token
gh[pousr]_[A-Za-z0-9_]{36,255}

// Generic API Key
api[_-]?key[_-]?[=:]\s*['"][A-Za-z0-9\-_]{20,}['"]
```

### Tokens

```
// Bearer Token
bearer\s+[A-Za-z0-9\-_\.]+

// JWT
eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+

// Generic Token
token[_-]?[=:]\s*['"][A-Za-z0-9\-_]{20,}['"]
```

### Passwords

```
// Password Assignment
password[_-]?[=:]\s*['"][^'"]{8,}['"]
passwd[_-]?[=:]\s*['"][^'"]{8,}['"]
secret[_-]?[=:]\s*['"][^'"]{8,}['"]

// Connection String
://[^:]+:[^@]+@[^/]+
```

### Private Keys

```
// RSA Private Key
-----BEGIN RSA PRIVATE KEY-----

// Generic Private Key
-----BEGIN PRIVATE KEY-----

// SSH Key
-----BEGIN OPENSSH PRIVATE KEY-----
```

### Certificates

```
// PEM Certificate
-----BEGIN CERTIFICATE-----
```

## Scanning Strategy

1. Scan all text files (not just code)
2. Check `.env` files (even if gitignored)
3. Check config files (JSON, YAML, TOML)
4. Check comments and documentation
5. Check test files (often contain test credentials)

## False Positive Handling

Exclude:
- Example/placeholder values (`YOUR_API_KEY`, `xxx`, `changeme`)
- Test fixtures with fake credentials
- Documentation showing format only

Include:
- Real-looking keys with proper format
- Base64-encoded strings that decode to keys
- Connection strings with real hostnames

## Output

For each finding:
```
Finding: Hardcoded Secret
Severity: Critical
Confidence: High
File: src/config/database.ts
Line: 15
Evidence: const DB_PASSWORD = "SuperSecret123!"
Recommendation: Move to environment variables
```
