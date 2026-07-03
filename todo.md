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

- [ ] Create `shared/prompts/` directory
- [ ] Write prompt: Project Understanding
  - [ ] Detect project type (monorepo, polyrepo, single)
  - [ ] Identify entry points
  - [ ] Map directory structure
- [ ] Write prompt: Language Detection
  - [ ] Identify primary language
  - [ ] Identify secondary languages
  - [ ] Map file extensions to languages
- [ ] Write prompt: Framework Detection
  - [ ] Backend frameworks (Gin, Express, NestJS, Spring Boot, Laravel, Django)
  - [ ] Frontend frameworks (React, Vue, Angular, NextJS)
  - [ ] Mobile frameworks (Flutter, React Native)
  - [ ] Detect from package.json, go.mod, requirements.txt, pom.xml, etc.
- [ ] Write prompt: Report Generation
  - [ ] Score calculation
  - [ ] Severity classification
  - [ ] Recommendations
  - [ ] Next steps

---

## Phase 3: Skill 1 — /security-audit

### 3.1 SKILL.md

- [ ] Create `skills/security-audit/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 3.2 Prompts

- [ ] Write prompt: Secrets Detection
  - [ ] API keys
  - [ ] Tokens
  - [ ] Passwords
  - [ ] Private keys
  - [ ] SSH keys
  - [ ] Certificates
- [ ] Write prompt: Source Code Review
  - [ ] SQL Injection patterns
  - [ ] XSS patterns
  - [ ] CSRF patterns
  - [ ] SSRF patterns
  - [ ] RCE patterns
  - [ ] Command Injection patterns
  - [ ] Path Traversal patterns
  - [ ] Unsafe Deserialization patterns
- [ ] Write prompt: Configuration Review
  - [ ] CORS misconfiguration
  - [ ] Debug mode detection
  - [ ] Authentication setup
  - [ ] Session/Cookie config
  - [ ] JWT configuration
- [ ] Write prompt: Infrastructure Review
  - [ ] Dockerfile analysis
  - [ ] docker-compose security
  - [ ] Kubernetes manifests
  - [ ] CI/CD configuration

### 3.3 Review Engine

- [ ] Implement `skills/security-audit/reviewer/secrets.ts`
- [ ] Implement `skills/security-audit/reviewer/source-code.ts`
- [ ] Implement `skills/security-audit/reviewer/config-review.ts`
- [ ] Implement `skills/security-audit/reviewer/infrastructure.ts`

---

## Phase 4: Skill 2 — /bug-investigate

### 4.1 SKILL.md

- [ ] Create `skills/bug-investigate/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 4.2 Prompts

- [ ] Write prompt: Error Log Analysis
  - [ ] Parse stack traces
  - [ ] Identify error patterns
  - [ ] Extract context
- [ ] Write prompt: Code Path Tracing
  - [ ] Trace function calls
  - [ ] Identify entry points
  - [ ] Map data flow
- [ ] Write prompt: Root Cause Analysis
  - [ ] Identify potential causes
  - [ ] Rank by likelihood
  - [ ] Provide evidence
- [ ] Write prompt: Edge Case Detection
  - [ ] Null/undefined handling
  - [ ] Boundary conditions
  - [ ] Race conditions
  - [ ] Memory leaks

### 4.3 Review Engine

- [ ] Implement `skills/bug-investigate/reviewer/error-log.ts`
- [ ] Implement `skills/bug-investigate/reviewer/code-path.ts`
- [ ] Implement `skills/bug-investigate/reviewer/root-cause.ts`
- [ ] Implement `skills/bug-investigate/reviewer/edge-case.ts`

---

## Phase 5: Skill 3 — /performance-audit

### 5.1 SKILL.md

- [ ] Create `skills/performance-audit/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 5.2 Prompts

- [ ] Write prompt: Query Analysis
  - [ ] N+1 query detection
  - [ ] Slow query identification
  - [ ] Missing index detection
- [ ] Write prompt: Memory Analysis
  - [ ] Memory leak patterns
  - [ ] Large object allocation
  - [ ] Unbounded growth
- [ ] Write prompt: Algorithm Analysis
  - [ ] Complexity analysis
  - [ ] Inefficient patterns
  - [ ] Optimization opportunities
- [ ] Write prompt: Caching Review
  - [ ] Cache hit/miss patterns
  - [ ] Cache invalidation
  - [ ] Cache strategy
- [ ] Write prompt: Resource Usage
  - [ ] CPU-intensive operations
  - [ ] I/O blocking
  - [ ] Network calls

### 5.3 Review Engine

- [ ] Implement `skills/performance-audit/reviewer/query.ts`
- [ ] Implement `skills/performance-audit/reviewer/memory.ts`
- [ ] Implement `skills/performance-audit/reviewer/algorithm.ts`
- [ ] Implement `skills/performance-audit/reviewer/caching.ts`
- [ ] Implement `skills/performance-audit/reviewer/resource.ts`

---

## Phase 6: Skill 4 — /architecture-review

### 6.1 SKILL.md

- [ ] Create `skills/architecture-review/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 6.2 Prompts

- [ ] Write prompt: Design Pattern Analysis
  - [ ] Identify used patterns
  - [ ] Check pattern correctness
  - [ ] Suggest improvements
- [ ] Write prompt: Separation of Concerns
  - [ ] Layer analysis
  - [ ] Responsibility distribution
  - [ ] Coupling detection
- [ ] Write prompt: Modularity Evaluation
  - [ ] Module boundaries
  - [ ] Interface design
  - [ ] Dependency direction
- [ ] Write prompt: Technical Debt
  - [ ] Code smells
  - [ ] Deprecated patterns
  - [ ] Refactoring opportunities
- [ ] Write prompt: SOLID Compliance
  - [ ] Single Responsibility
  - [ ] Open/Closed
  - [ ] Liskov Substitution
  - [ ] Interface Segregation
  - [ ] Dependency Inversion

### 6.3 Review Engine

- [ ] Implement `skills/architecture-review/reviewer/pattern.ts`
- [ ] Implement `skills/architecture-review/reviewer/separation.ts`
- [ ] Implement `skills/architecture-review/reviewer/modularity.ts`
- [ ] Implement `skills/architecture-review/reviewer/debt.ts`
- [ ] Implement `skills/architecture-review/reviewer/solid.ts`

---

## Phase 7: Skill 5 — /dependency-review

### 7.1 SKILL.md

- [ ] Create `skills/dependency-review/SKILL.md`
  - [ ] Command definition
  - [ ] Workflow steps
  - [ ] Output format

### 7.2 Prompts

- [ ] Write prompt: Outdated Package Detection
  - [ ] Compare with latest versions
  - [ ] Check changelog
  - [ ] Identify breaking changes
- [ ] Write prompt: Unused Dependency Detection
  - [ ] Scan imports
  - [ ] Compare with package.json
  - [ ] Identify dead dependencies
- [ ] Write prompt: Dependency Tree Analysis
  - [ ] Visualize tree
  - [ ] Identify duplicates
  - [ ] Check depth
- [ ] Write prompt: License Compatibility
  - [ ] Detect licenses
  - [ ] Check compatibility
  - [ ] Flag conflicts
- [ ] Write prompt: Supply Chain Risk
  - [ ] Check package authenticity
  - [ ] Verify maintainer
  - [ ] Detect typosquatting

### 7.3 Review Engine

- [ ] Implement `skills/dependency-review/reviewer/outdated.ts`
- [ ] Implement `skills/dependency-review/reviewer/unused.ts`
- [ ] Implement `skills/dependency-review/reviewer/tree.ts`
- [ ] Implement `skills/dependency-review/reviewer/license.ts`
- [ ] Implement `skills/dependency-review/reviewer/supply-chain.ts`

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