# Configuration Review Prompt

Scan configuration files for security issues.

## CORS Misconfiguration

### Patterns to Flag

```javascript
// Wildcard origin
cors({ origin: '*' })
Access-Control-Allow-Origin: *

// Reflecting origin without validation
cors({ origin: true })
cors({ origin: req.headers.origin })

// Null origin allowed
Access-Control-Allow-Origin: null
```

### Safe Pattern

```javascript
cors({ origin: ['https://example.com'] })
cors({ origin: /^https:\/\/.*\.example\.com$/ })
```

## Debug Mode Detection

### Patterns

```javascript
// Environment checks
NODE_ENV !== 'production'
DEBUG=true
DEBUG=*

// Framework debug mode
app.set('debug', true)
DEBUG_MODE = True  # Python

// Logging level
LOG_LEVEL=debug
logging.basicConfig(level=logging.DEBUG)
```

## Authentication Setup

### Check For

- Missing authentication on sensitive endpoints
- Weak password requirements
- No rate limiting on login
- Missing account lockout
- Session timeout not configured

## Session/Cookie Security

### Patterns to Flag

```javascript
// Missing security flags
cookie: {
  httpOnly: false,    // Should be true
  secure: false,      // Should be true in production
  sameSite: 'none'    // Should be 'lax' or 'strict'
}

// Weak session secret
session({ secret: 'keyboard cat' })
session({ secret: 'secret' })
```

## JWT Configuration

### Patterns to Flag

```javascript
// Weak algorithm
jwt.sign(payload, secret, { algorithm: 'none' })
jwt.sign(payload, secret, { algorithm: 'HS256' })  // Consider RS256

// No expiry
jwt.sign(payload, secret)  // No expiresIn

// Weak secret
jwt.sign(payload, 'secret')
jwt.sign(payload, '123456')
```

## HTTPS Enforcement

### Check For

- HTTP allowed in production
- Missing redirect HTTP → HTTPS
- Mixed content (HTTP resources on HTTPS page)

## Environment Variables

### Patterns to Flag

- `.env` file committed to repository
- `.env.example` with real values
- Secrets in `docker-compose.yml`
- Hardcoded database URLs

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [config snippet]
Recommendation: [fix]
```
