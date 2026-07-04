# Project Understanding Prompt

You are analyzing a software project to understand its structure and type.

## Steps

### 1. Detect Project Type

Check for these indicators:

**Monorepo:**
- `lerna.json`, `nx.json`, `turbo.json`, `pnpm-workspace.yaml`
- `package.json` with `workspaces` field
- `apps/` + `packages/` directories

**Polyrepo:**
- `services/` directory with multiple subdirectories
- Multiple independent `package.json` files

**Multi-module:**
- `go.work` file
- `pom.xml` with modules
- `settings.gradle` with subprojects

**Single Project:**
- One `package.json` at root
- One `go.mod` at root
- One `requirements.txt` at root

### 2. Identify Entry Points

Look for:
- `main` field in package.json
- `index.ts`, `index.js`, `main.ts`, `main.js`
- `cmd/` directory (Go)
- `app.py`, `manage.py` (Python)
- `src/main/java/` (Java)

### 3. Map Directory Structure

Identify purpose of each top-level directory:
- `src/` — source code
- `lib/` — library code
- `app/` or `apps/` — applications
- `packages/` — shared packages
- `services/` — microservices
- `tests/` or `__tests__/` — test files
- `docs/` — documentation
- `config/` or `configs/` — configuration
- `scripts/` — build/deploy scripts
- `public/` or `static/` — static assets

### 4. Output Format

```
Project Type: [monorepo|polyrepo|single|multi-module]
Entry Points: [list of entry files]
Key Directories: [list with purposes]
```
