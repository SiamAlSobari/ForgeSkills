# Deployment Config Prompt

Check deployment configuration for issues.

## Checks

### Environment Variables

```bash
# Bad: secrets in code
API_KEY=sk_live_abc123

# Good: reference to secret manager
API_KEY=${{ secrets.API_KEY }}
```

### Docker Configuration

```dockerfile
# Bad: running as root
FROM node:18

# Good: non-root user
FROM node:18
RUN adduser -u 1001 app
USER app
```

### Health Checks

```yaml
# Good: health check defined
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Scaling Configuration

- Resource limits defined
- Replica count appropriate
- Auto-scaling configured (if needed)

## Output

For each finding:
```
Finding: [Deployment Issue]
Severity: [Critical|High|Medium|Low]
File: [path]
Evidence: [config snippet]
Recommendation: [fix]
```
