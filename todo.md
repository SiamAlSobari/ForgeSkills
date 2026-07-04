# TODO — SkillForge

Development roadmap from zero to release.

---

## Phase 0: Project Setup

- [x] Init git repository
- [x] Create folder structure sesuai PRD §21
- [x] Init Bun project (`bun init`)
- [x] Install dependencies:
  - [x] `commander` — CLI framework
  - [x] `zod` — validation
  - [x] `execa` — process execution
  - [x] `fast-glob` — file scanning
- [x] Install dev dependencies:
  - [x] `vitest` — testing
  - [x] `typescript` — type safety
  - [x] `@types/bun` — Bun types
- [x] Setup `tsconfig.json`
- [x] Setup `vitest.config.ts`
- [ ] Setup ESLint + Prettier (optional)
- [x] Setup `.gitignore`
- [x] Setup GitHub Actions CI (basic lint + test)

---

## Phase 1: Shared Infrastructure

Buat komponen yang digunakan semua skill.

### 1.1 Repository Analyzer (`shared/analyzer/`)

- [x] Implement `repository.ts`
  - [x] Detect repository type (git, local, workspace)
  - [x] Scan directory structure
  - [x] Identify key directories (src, lib, app, etc.)
- [x] Implement `language.ts`
  - [x] Map file extensions to languages
  - [x] Calculate language distribution
  - [x] Return primary + secondary languages
- [x] Implement `framework.ts`
  - [x] Detect from config files
  - [x] Detect from dependencies
  - [x] Return framework + version
- [x] Implement `structure.ts`
  - [x] Parse monorepo structure
  - [x] Identify packages/apps/services
  - [x] Map module boundaries
- [x] Implement `config.ts`
  - [x] Find configuration files
  - [x] Parse common formats (JSON, YAML, TOML, ENV)
  - [x] Extract relevant settings

### 1.2 Findings Engine (`shared/findings/`)

- [x] Implement `types.ts`
  - [x] Finding interface
  - [x] Severity enum (Critical, High, Medium, Low, Info)
  - [x] Confidence level
  - [x] Evidence type
- [x] Implement `classifier.ts`
  - [x] Auto-classify severity based on issue type
  - [x] Adjust severity based on context
  - [x] Calculate confidence score
- [x] Implement `prioritizer.ts`
  - [x] Sort by severity
  - [x] Group by category
  - [x] Deduplicate findings

### 1.3 Report Generator (`shared/report/`)

- [x] Implement `score.ts`
  - [x] Calculate Score (0-100)
  - [x] Weight by severity
  - [x] Normalize across project size
- [x] Implement `markdown.ts`
  - [x] Generate markdown report
  - [x] Include all standard sections
  - [x] Add code snippets for findings
  - [x] Add fix suggestions
- [x] Implement `json.ts`
  - [x] Generate JSON report
  - [x] Machine-readable format
  - [x] Include metadata
- [x] Create `templates/report.md` — markdown template

---

## Phase 2: Prompt Templates (Shared)

- [x] Create `shared/prompts/` directory
- [x] Write prompt: Project Understanding
  - [x] Detect project type (monorepo, polyrepo, single)
  - [x] Identify entry points
  - [x] Map directory structure
- [x] Write prompt: Language Detection
  - [x] Identify primary language
  - [x] Identify secondary languages
  - [x] Map file extensions to languages
- [x] Write prompt: Framework Detection
  - [x] Backend frameworks (Gin, Express, NestJS, Spring Boot, Laravel, Django)
  - [x] Frontend frameworks (React, Vue, Angular, NextJS)
  - [x] Mobile frameworks (Flutter, React Native)
  - [x] Detect from package.json, go.mod, requirements.txt, pom.xml, etc.
- [x] Write prompt: Report Generation
  - [x] Score calculation
  - [x] Severity classification
  - [x] Recommendations
  - [x] Next steps

---

## Phase 3: Skill 1 — /security-audit

### 3.1 SKILL.md

- [x] Create `skills/security-audit/SKILL.md`
  - [x] Command definition
  - [x] Workflow steps
  - [x] Output format

### 3.2 Prompts

- [x] Write prompt: Secrets Detection
  - [x] API keys
  - [x] Tokens
  - [x] Passwords
  - [x] Private keys
  - [x] SSH keys
  - [x] Certificates
- [x] Write prompt: Source Code Review
  - [x] SQL Injection patterns
  - [x] XSS patterns
  - [x] CSRF patterns
  - [x] SSRF patterns
  - [x] RCE patterns
  - [x] Command Injection patterns
  - [x] Path Traversal patterns
  - [x] Unsafe Deserialization patterns
- [x] Write prompt: Configuration Review
  - [x] CORS misconfiguration
  - [x] Debug mode detection
  - [x] Authentication setup
  - [x] Session/Cookie config
  - [x] JWT configuration
- [x] Write prompt: Infrastructure Review
  - [x] Dockerfile analysis
  - [x] docker-compose security
  - [x] Kubernetes manifests
  - [x] CI/CD configuration

### 3.3 Review Engine

- [x] Implement `skills/security-audit/reviewer/secrets.ts`
- [x] Implement `skills/security-audit/reviewer/source-code.ts`
- [x] Implement `skills/security-audit/reviewer/config-review.ts`
- [x] Implement `skills/security-audit/reviewer/infrastructure.ts`

---

## Phase 4: Skill 2 — /bug-investigate

### 4.1 SKILL.md

- [x] Create `skills/bug-investigate/SKILL.md`
  - [x] Command definition
  - [x] Workflow steps
  - [x] Output format

### 4.2 Prompts

- [x] Write prompt: Error Log Analysis
  - [x] Parse stack traces
  - [x] Identify error patterns
  - [x] Extract context
- [x] Write prompt: Code Path Tracing
  - [x] Trace function calls
  - [x] Identify entry points
  - [x] Map data flow
- [x] Write prompt: Root Cause Analysis
  - [x] Identify potential causes
  - [x] Rank by likelihood
  - [x] Provide evidence
- [x] Write prompt: Edge Case Detection
  - [x] Null/undefined handling
  - [x] Boundary conditions
  - [x] Race conditions
  - [x] Memory leaks

### 4.3 Review Engine

- [x] Implement `skills/bug-investigate/reviewer/error-log.ts`
- [x] Implement `skills/bug-investigate/reviewer/code-path.ts`
- [x] Implement `skills/bug-investigate/reviewer/root-cause.ts`
- [x] Implement `skills/bug-investigate/reviewer/edge-case.ts`

---

## Phase 5: Skill 3 — /performance-audit

### 5.1 SKILL.md

- [x] Create `skills/performance-audit/SKILL.md`
  - [x] Command definition
  - [x] Workflow steps
  - [x] Output format

### 5.2 Prompts

- [x] Write prompt: Query Analysis
  - [x] N+1 query detection
  - [x] Slow query identification
  - [x] Missing index detection
- [x] Write prompt: Memory Analysis
  - [x] Memory leak patterns
  - [x] Large object allocation
  - [x] Unbounded growth
- [x] Write prompt: Algorithm Analysis
  - [x] Complexity analysis
  - [x] Inefficient patterns
  - [x] Optimization opportunities
- [x] Write prompt: Caching Review
  - [x] Cache hit/miss patterns
  - [x] Cache invalidation
  - [x] Cache strategy
- [x] Write prompt: Resource Usage
  - [x] CPU-intensive operations
  - [x] I/O blocking
  - [x] Network calls

### 5.3 Review Engine

- [x] Implement `skills/performance-audit/reviewer/query.ts`
- [x] Implement `skills/performance-audit/reviewer/memory.ts`
- [x] Implement `skills/performance-audit/reviewer/algorithm.ts`
- [x] Implement `skills/performance-audit/reviewer/caching.ts`
- [x] Implement `skills/performance-audit/reviewer/resource.ts`

---

## Phase 6: Skill 4 — /architecture-review

### 6.1 SKILL.md

- [x] Create `skills/architecture-review/SKILL.md`
  - [x] Command definition
  - [x] Workflow steps
  - [x] Output format

### 6.2 Prompts

- [x] Write prompt: Design Pattern Analysis
  - [x] Identify used patterns
  - [x] Check pattern correctness
  - [x] Suggest improvements
- [x] Write prompt: Separation of Concerns
  - [x] Layer analysis
  - [x] Responsibility distribution
  - [x] Coupling detection
- [x] Write prompt: Modularity Evaluation
  - [x] Module boundaries
  - [x] Interface design
  - [x] Dependency direction
- [x] Write prompt: Technical Debt
  - [x] Code smells
  - [x] Deprecated patterns
  - [x] Refactoring opportunities
- [x] Write prompt: SOLID Compliance
  - [x] Single Responsibility
  - [x] Open/Closed
  - [x] Liskov Substitution
  - [x] Interface Segregation
  - [x] Dependency Inversion

### 6.3 Review Engine

- [x] Implement `skills/architecture-review/reviewer/pattern.ts`
- [x] Implement `skills/architecture-review/reviewer/separation.ts`
- [x] Implement `skills/architecture-review/reviewer/modularity.ts`
- [x] Implement `skills/architecture-review/reviewer/debt.ts`
- [x] Implement `skills/architecture-review/reviewer/solid.ts`

---

## Phase 7: Skill 5 — /dependency-review

### 7.1 SKILL.md

- [x] Create `skills/dependency-review/SKILL.md`
  - [x] Command definition
  - [x] Workflow steps
  - [x] Output format

### 7.2 Prompts

- [x] Write prompt: Outdated Package Detection
  - [x] Compare with latest versions
  - [x] Check changelog
  - [x] Identify breaking changes
- [x] Write prompt: Unused Dependency Detection
  - [x] Scan imports
  - [x] Compare with package.json
  - [x] Identify dead dependencies
- [x] Write prompt: Dependency Tree Analysis
  - [x] Visualize tree
  - [x] Identify duplicates
  - [x] Check depth
- [x] Write prompt: License Compatibility
  - [x] Detect licenses
  - [x] Check compatibility
  - [x] Flag conflicts
- [x] Write prompt: Supply Chain Risk
  - [x] Check package authenticity
  - [x] Verify maintainer
  - [x] Detect typosquatting

### 7.3 Review Engine

- [x] Implement `skills/dependency-review/reviewer/outdated.ts`
- [x] Implement `skills/dependency-review/reviewer/unused.ts`
- [x] Implement `skills/dependency-review/reviewer/tree.ts`
- [x] Implement `skills/dependency-review/reviewer/license.ts`
- [x] Implement `skills/dependency-review/reviewer/supply-chain.ts`

---

## Phase 8: Skill 6 — /database-review

### 8.1 SKILL.md

- [ ] Create `skills/database-review/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 8.2 Prompts

- [ ] Write prompt: Query Performance
  - [ ] Slow query detection
  - [ ] Missing index detection
  - [ ] Full table scan detection
- [ ] Write prompt: Indexing Strategy
  - [ ] Index usage analysis
  - [ ] Composite index opportunities
  - [ ] Unused index detection
- [ ] Write prompt: Schema Design
  - [ ] Normalization check
  - [ ] Data type optimization
  - [ ] Relationship analysis
- [ ] Write prompt: SQL Anti-patterns
  - [ ] SELECT *
  - [ ] N+1 queries
  - [ ] Subquery optimization
  - [ ] JOIN optimization
- [ ] Write prompt: Migration Safety
  - [ ] Breaking changes
  - [ ] Data loss risks
  - [ ] Rollback strategy

### 8.3 Review Engine

- [ ] Implement `skills/database-review/reviewer/query.ts`
- [ ] Implement `skills/database-review/reviewer/index.ts`
- [ ] Implement `skills/database-review/reviewer/schema.ts`
- [ ] Implement `skills/database-review/reviewer/anti-pattern.ts`
- [ ] Implement `skills/database-review/reviewer/migration.ts`

---

## Phase 9: Skill 7 — /release-check

### 9.1 SKILL.md

- [ ] Create `skills/release-check/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 9.2 Prompts

- [ ] Write prompt: Changelog Verification
  - [ ] Check changelog exists
  - [ ] Verify format
  - [ ] Check completeness
- [ ] Write prompt: Version Validation
  - [ ] Check version bump
  - [ ] Verify semantic versioning
  - [ ] Check consistency
- [ ] Write prompt: CI/CD Check
  - [ ] Verify pipeline config
  - [ ] Check test coverage
  - [ ] Verify build success
- [ ] Write prompt: Deployment Config
  - [ ] Check environment variables
  - [ ] Verify secrets
  - [ ] Check scaling config
- [ ] Write prompt: Breaking Change Detection
  - [ ] API compatibility
  - [ ] Database migration
  - [ ] Configuration changes

### 9.3 Review Engine

- [ ] Implement `skills/release-check/reviewer/changelog.ts`
- [ ] Implement `skills/release-check/reviewer/version.ts`
- [ ] Implement `skills/release-check/reviewer/ci-cd.ts`
- [ ] Implement `skills/release-check/reviewer/deployment.ts`
- [ ] Implement `skills/release-check/reviewer/breaking-change.ts`

---

## Phase 10: CLI & Runtime (Optional)

- [ ] Create `src/cli/` directory
- [ ] Implement `index.ts`
  - [ ] Setup Commander
  - [ ] Register all commands
  - [ ] Parse arguments
  - [ ] Validate with Zod
- [ ] Implement `runner.ts`
  - [ ] Orchestrate review pipeline
  - [ ] Handle errors gracefully
  - [ ] Show progress indicators
- [ ] Implement `config.ts`
  - [ ] Load user config (optional)
  - [ ] Default settings
  - [ ] Override with CLI flags

---

## Phase 11: Testing

- [ ] Create `tests/` directory
- [ ] Create test fixtures:
  - [ ] Sample Node.js project
  - [ ] Sample Go project
  - [ ] Sample Python project
  - [ ] Sample project with known issues
- [ ] Unit tests:
  - [ ] `shared/analyzer/*.test.ts`
  - [ ] `shared/findings/*.test.ts`
  - [ ] `shared/report/*.test.ts`
  - [ ] `skills/*/reviewer/*.test.ts`
- [ ] Integration tests:
  - [ ] Full workflow test per skill
  - [ ] CLI command test
  - [ ] Output format test
- [ ] E2E tests:
  - [ ] Real project scan
  - [ ] Performance benchmarks
  - [ ] Cross-skill consistency

---

## Phase 12: Documentation

- [ ] Write `README.md`
  - [ ] Installation instructions
  - [ ] Quick start guide
  - [ ] Command reference (all 7 skills)
  - [ ] Examples
- [ ] Write `docs/`
  - [ ] Architecture overview
  - [ ] Contributing guide
  - [ ] Skill customization
  - [ ] Troubleshooting
- [ ] Create `examples/`
  - [ ] Example reports per skill
  - [ ] Example configurations
  - [ ] Example workflows

---

## Phase 13: Polish & Release v1.0

- [ ] Code review & cleanup
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Add logging (optional)
- [ ] Version bump (v1.0.0)
- [ ] Create GitHub release
- [ ] Write release notes
- [ ] Publish to npm (optional)
- [ ] Announce (optional)

---

## Phase 14: Future Enhancements (v1.1+)

- [ ] External scanner integration:
  - [ ] Gitleaks
  - [ ] Semgrep
  - [ ] Trivy
  - [ ] npm audit
  - [ ] osv-scanner
- [ ] Incremental analysis
- [ ] Caching for faster re-scans
- [ ] Multi-language report support

---

## Notes

- Phase 0-2 (shared infrastructure) harus selesai dulu sebelum Phase 3-9 (skills)
- Phase 3-9 bisa dikerjakan paralel setelah Phase 1-2 selesai
- Phase 10 (CLI) optional — skill bisa jalan tanpa runtime
- Testing harus happen alongside development, bukan sesudahnya
- Documentation harus diupdate seiring features dibuat

---

*Last updated: 2026-07-03*