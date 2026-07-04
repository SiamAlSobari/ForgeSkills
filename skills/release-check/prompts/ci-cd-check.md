# CI/CD Check Prompt

Verify CI/CD pipeline configuration.

## Checks

### Pipeline Exists

Look for:
- .github/workflows/*.yml
- .gitlab-ci.yml
- Jenkinsfile
- .circleci/config.yml
- bitbucket-pipelines.yml

### Pipeline Configuration

```yaml
# Good: tests run on push
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      - run: npm run lint
      - run: npm run build
```

### Test Coverage

- Tests run in CI
- Coverage reported
- Coverage threshold set

### Build Verification

- Build step exists
- Build passes
- Artifacts generated

## Output

For each finding:
```
Finding: [CI/CD Issue]
Severity: [High|Medium|Low]
File: [path]
Evidence: [config snippet]
Recommendation: [fix]
```
