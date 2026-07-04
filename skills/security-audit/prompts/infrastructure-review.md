# Infrastructure Review Prompt

Scan infrastructure files for security issues.

## Dockerfile Analysis

### Patterns to Flag

```dockerfile
# Running as root
FROM node:18
# Missing USER instruction

# Using latest tag
FROM node:latest

# Secrets in build args
ARG DB_PASSWORD
ENV API_KEY=sk_live_abc123

# Exposing sensitive ports
EXPOSE 22  # SSH
EXPOSE 3306  # MySQL
EXPOSE 5432  # PostgreSQL

# Missing health check
# No HEALTHCHECK instruction

# Installing unnecessary packages
RUN apt-get install -y sudo
```

### Safe Patterns

```dockerfile
# Multi-stage build
FROM node:18 AS builder
# ...
FROM node:18-slim
COPY --from=builder /app/dist /app

# Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Specific version
FROM node:18.17.0-alpine
```

## docker-compose Security

### Patterns to Flag

```yaml
# Exposed ports to host
services:
  db:
    ports:
      - "3306:3306"  # Exposed to host

# Secrets in environment
services:
  app:
    environment:
      - DB_PASSWORD=secret123

# Privileged mode
services:
  app:
    privileged: true

# Host network
services:
  app:
    network_mode: host
```

## Kubernetes Manifests

### Patterns to Flag

```yaml
# Privileged container
securityContext:
  privileged: true

# Running as root
securityContext:
  runAsNonRoot: false

# Host namespace
hostNetwork: true
hostPID: true

# Missing resource limits
# No resources.limits defined

# Secrets in environment
env:
  - name: API_KEY
    value: "sk_live_abc123"
```

### Safe Patterns

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false

resources:
  limits:
    cpu: "1"
    memory: "512Mi"
  requests:
    cpu: "500m"
    memory: "256Mi"
```

## CI/CD Configuration

### GitHub Actions Patterns to Flag

```yaml
# Secrets exposed in logs
- run: echo ${{ secrets.API_KEY }}

# Unpinned actions
- uses: actions/checkout@main  # Should pin version

# Pull request target with checkout
on:
  pull_request_target:
- uses: actions/checkout@v4
  with:
    ref: ${{ github.event.pull_request.head.sha }}  # Dangerous
```

### GitLab CI Patterns to Flag

```yaml
# Secrets in script
script:
  - echo $SECRET_KEY

# Unprotected variables
variables:
  DB_PASSWORD: "secret"
```

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
