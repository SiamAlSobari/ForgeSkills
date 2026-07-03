# Product Requirements Document (PRD)

# SkillForge — Global AI Skills Ecosystem

Version: 2.0

Status: Draft

Owner: <Your Name>

Target Platform:
- OpenCode
- Pi Agent

Category:
Global AI Agent Skills

---

# 1. Product Overview

## What is this?

**SkillForge** adalah kumpulan **Global Skills** yang dirancang untuk AI Coding Agent seperti OpenCode dan Pi Agent.

Ekosistem ini memberikan kemampuan kepada AI Agent untuk melakukan berbagai jenis review dan audit terhadap source code secara otomatis menggunakan reasoning AI.

Setelah skill di-install, pengguna dapat memanggilnya kapan saja melalui command:

```text
/security-audit
/bug-investigate
/performance-audit
/architecture-review
/dependency-review
/database-review
/release-check
```

AI Agent kemudian akan menjalankan workflow yang sesuai tanpa pengguna perlu menjelaskan langkah-langkahnya satu per satu.

Skill ini **bukan scanner baru**, melainkan "otak" yang mengajarkan AI Agent bagaimana berpikir layaknya Engineer specialist saat melakukan review source code.

---

# 2. Background

Saat ini AI Coding Agent sangat baik dalam:

- menulis kode
- memperbaiki bug
- refactor
- membuat test

Namun belum memiliki workflow standar untuk melakukan review dan audit secara sistematis.

Akibatnya:

- setiap user harus menulis prompt panjang
- hasil review tidak konsisten
- AI sering melewatkan issue penting
- AI tidak memiliki standar severity
- AI tidak memiliki format report yang konsisten
- developer harus menggunakan banyak tools terpisah

Ekosistem skill ini dibuat untuk mengatasi masalah tersebut.

---

# 3. Vision

Menjadikan setiap AI Coding Agent mampu bertindak sebagai Engineer specialist hanya dengan satu command.

Developer cukup mengetik:

```text
/security-audit        → Security Engineer
/bug-investigate       → Debugging Engineer
/performance-audit     → Performance Engineer
/architecture-review   → Software Architect
/dependency-review     → Dependency Analyst
/database-review       → Database Engineer
/release-check         → Release Manager
```

AI akan memahami project, melakukan review, kemudian menghasilkan laporan profesional.

---

# 4. Problem Statement

Developer sering mengalami masalah berikut.

## Problem 1

Tidak mengetahui apakah project memiliki vulnerability, bug, atau masalah performa.

## Problem 2

Harus menggunakan banyak tools secara manual.

Contoh:

- Semgrep, Gitleaks, Trivy (security)
- Profiler, APM tools (performance)
- Linter, static analyzer (code quality)
- npm audit, osv-scanner (dependency)

## Problem 3

Hasil scanner sulit dipahami.

Sebagian besar scanner hanya menghasilkan:

- Warning
- Error
- CVE

tanpa menjelaskan:

- penyebab
- dampak
- solusi

## Problem 4

AI Coding Agent belum memiliki workflow review yang baku untuk setiap domain.

---

# 5. Goals

Ekosistem skill harus mampu:

✓ memahami project

✓ memahami framework

✓ memahami struktur repository

✓ melakukan audit keamanan

✓ menginvestigasi bug

✓ menganalisis performa

✓ mereview arsitektur

✓ menganalisis dependency

✓ mereview database

✓ melakukan pre-release check

✓ menjelaskan risiko

✓ memberikan severity

✓ memberikan rekomendasi

✓ menghasilkan report profesional

---

# 6. Non Goals

Ekosistem ini TIDAK bertujuan untuk:

- penetration testing
- exploit vulnerability
- malware analysis
- reverse engineering
- network scanning
- dynamic security testing
- production monitoring
- automated fixing (v1)

Skill hanya melakukan source code review menggunakan AI.

---

# 7. Target Users

Primary

- Backend Developer

- Frontend Developer

- Fullstack Developer

- Mobile Developer

- Software Engineer

Secondary

- Startup

- QA

- CTO

- DevOps

- Security Engineer

- Database Administrator

---

# 8. Product Type

Produk ini adalah:

Global AI Agent Skills (Ecosystem)

Bukan:

- Plugin
- Extension
- CLI
- Framework
- Library

Skill di-load oleh AI Agent.

---

# 9. Skills Overview

## 9.1 /security-audit

**Purpose:** Security review source code

**Scope:**
- Source code vulnerabilities (SQL Injection, XSS, CSRF, SSRF, RCE, etc.)
- Secrets detection (API keys, tokens, passwords)
- Configuration review (CORS, CSP, JWT, debug mode)
- Dependency vulnerabilities
- Infrastructure security (Dockerfile, K8s, CI/CD)

**Output:** Security Score, severity-based findings, recommendations

---

## 9.2 /bug-investigate

**Purpose:** Investigasi bug secara otomatis

**Scope:**
- Error log analysis
- Code path tracing
- Root cause identification
- Edge case detection
- Race condition detection
- Memory leak detection
- Exception handling review

**Output:** Root cause analysis, affected code, fix suggestions

---

## 9.3 /performance-audit

**Purpose:** Audit performa aplikasi

**Scope:**
- N+1 query detection
- Memory leak patterns
- Algorithm complexity analysis
- Caching strategy review
- Resource usage analysis
- Database query optimization
- Bundle size analysis (frontend)
- Lazy loading opportunities

**Output:** Performance Score, bottleneck analysis, optimization recommendations

---

## 9.4 /architecture-review

**Purpose:** Review arsitektur project

**Scope:**
- Design pattern analysis
- Separation of concerns check
- Modularity evaluation
- Dependency direction review
- Technical debt identification
- SOLID principles compliance
- Code coupling analysis
- Layer architecture validation

**Output:** Architecture Score, pattern analysis, refactoring recommendations

---

## 9.5 /dependency-review

**Purpose:** Review dependencies

**Scope:**
- Outdated package detection
- Unused dependency identification
- Dependency tree analysis
- License compatibility check
- Supply chain risk detection
- Version conflict detection
- Bundle size impact
- Security vulnerability in dependencies

**Output:** Dependency Health Score, risk analysis, update recommendations

---

## 9.6 /database-review

**Purpose:** Review database usage

**Scope:**
- Query performance analysis
- Indexing strategy review
- Schema design evaluation
- SQL anti-pattern detection
- Migration safety check
- Connection pool analysis
- N+1 query detection (ORM)
- Data type optimization

**Output:** Database Health Score, query analysis, optimization recommendations

---

## 9.7 /release-check

**Purpose:** Pre-release checklist

**Scope:**
- Run all audits (security, performance, architecture, dependency, database)
- Changelog verification
- Version bump validation
- CI/CD pipeline check
- Deployment configuration review
- Breaking change detection
- API compatibility check
- Documentation completeness

**Output:** Release Readiness Score, checklist status, blocking issues

---

# 10. How It Works

Install Skills

↓

Skills tersedia secara global

↓

User menjalankan command

↓

AI Agent mengaktifkan skill

↓

Skill menjalankan workflow

↓

AI menghasilkan Report

---

# 11. Installation Flow

Repository

↓

Install ke folder skill OpenCode / Pi

↓

Restart Agent

↓

Semua skill aktif

↓

Dapat dipanggil kapan saja

---

# 12. User Experience

User membuka project.

Kemudian mengetik:

```text
/security-audit
```

atau

```text
/bug-investigate
/performance-audit
/architecture-review
/dependency-review
/database-review
/release-check
```

AI menjawab:

1. Memahami project

2. Mengidentifikasi bahasa

3. Mengidentifikasi framework

4. Melakukan review sesuai domain

5. Menghasilkan laporan

Tanpa user perlu memberikan prompt tambahan.

---

# 13. Functional Requirements

## FR-001

Semua skill harus tersedia secara global setelah di-install.

---

## FR-002

Setiap skill harus dapat dipanggil menggunakan command masing-masing.

---

## FR-003

Semua skill harus mampu mengenali bahasa pemrograman secara otomatis.

Contoh:

- Go
- Python
- Java
- PHP
- Dart
- TypeScript
- Rust

---

## FR-004

Semua skill harus mengenali framework.

Contoh:

Backend

- Gin
- Fiber
- Echo
- Express
- NestJS
- Spring Boot
- Laravel
- Django

Frontend

- React
- Vue
- Angular
- NextJS

Mobile

- Flutter
- React Native

---

## FR-005

Semua skill harus memahami struktur repository.

Contoh:

backend/

frontend/

apps/

packages/

services/

libs/

---

## FR-006

Skill harus menggunakan format report yang konsisten.

---

## FR-007

Skill harus mengelompokkan severity.

Critical

High

Medium

Low

Info

---

## FR-008

Skill harus memberikan alasan mengapa issue tersebut penting.

---

## FR-009

Skill harus memberikan rekomendasi.

---

## FR-010

Skill harus memberikan Score (0-100).

---

## FR-011

Skill harus menghasilkan laporan akhir.

---

# 14. AI Workflow (Generic)

User

↓

/\<command\>

↓

AI membaca repository

↓

Memahami project

↓

Mendeteksi framework

↓

Mendeteksi bahasa

↓

Menganalisis sesuai domain

↓

Mengelompokkan findings

↓

Memberikan rekomendasi

↓

Menghasilkan report

---

# 15. Output Format

Setiap skill menghasilkan laporan dengan format konsisten.

```text
Project Information

Score

Executive Summary

Critical Findings

High Findings

Medium Findings

Low Findings

Best Practices

Recommendations

Next Steps
```

---

# 16. Command Specification

## Global Commands

```text
/security-audit [path] [--quick|--deep] [--markdown|--json] [--verbose]
/bug-investigate [path] [--quick|--deep] [--markdown|--json] [--verbose]
/performance-audit [path] [--quick|--deep] [--markdown|--json] [--verbose]
/architecture-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
/dependency-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
/database-review [path] [--quick|--deep] [--markdown|--json] [--verbose]
/release-check [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Optional Parameters

```text
.              — scan current directory
./path         — scan specific path
--quick        — fast scan
--deep         — thorough scan
--markdown     — output as markdown
--json         — output as JSON
--verbose      — detailed output
```

---

# 17. Repository Discovery

Saat command dijalankan, AI harus melakukan identifikasi repository terlebih dahulu.

Repository yang didukung:

- Monorepo
- Polyrepo
- Single Project
- Workspace
- Multi-module Repository

Contoh struktur:

```text
apps/
packages/
backend/
frontend/
mobile/
services/
libs/
```

Skill harus mampu menentukan bagian project yang relevan untuk direview.

---

# 18. AI Decision Flow

Sebelum melakukan review, AI harus menentukan:

1. Bahasa pemrograman utama
2. Framework utama
3. Build system
4. Package manager
5. Repository type
6. Configuration files
7. Security-sensitive files
8. Authentication mechanism
9. Deployment configuration

Workflow ini memastikan review dilakukan sesuai konteks project.

---

# 19. Technical Architecture

```text
                       User
                         │
                         ▼
                AI Coding Agent
          (OpenCode / Pi Agent)
                         │
          Detect Slash Command
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
/security-audit   /bug-investigate   /performance-audit
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                         ▼
               Global Skill Loader
                         │
                         ▼
              Shared Analysis Engine
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   Repository      Language        Framework
   Analysis        Detection       Detection
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              Domain-Specific Review
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    Security        Performance      Architecture
    Review          Analysis         Review
                         │
                         ▼
              Findings Prioritization
                         │
                         ▼
              Recommendation Generator
                         │
                         ▼
                    Report Output
```

---

# 20. Skill Lifecycle

Skill mengikuti lifecycle berikut.

```text
Install Skills
      │
      ▼
Agent Startup
      │
      ▼
Skill Discovery
      │
      ▼
Register Global Commands
      │
      ▼
Waiting User Request
      │
      ▼
User Executes Command
      │
      ▼
Load Skill Context
      │
      ▼
Execute Workflow
      │
      ▼
Generate Report
      │
      ▼
Finish
```

---

# 21. Repository Structure

```text
skillforge/
├── shared/                    # Shared components
│   ├── analyzer/              # Repository analysis
│   ├── findings/              # Findings & severity
│   └── report/                # Report generator
│
├── skills/                    # Individual skills
│   ├── security-audit/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   ├── bug-investigate/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   ├── performance-audit/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   ├── architecture-review/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   ├── dependency-review/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   ├── database-review/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   └── templates/
│   └── release-check/
│       ├── SKILL.md
│       ├── prompts/
│       └── templates/
│
├── src/                       # Runtime (optional)
│   ├── cli/
│   └── config/
│
├── tests/
├── docs/
├── examples/
├── templates/
├── README.md
├── LICENSE
└── package.json
```

---

# 22. Technology Stack

## Skill Layer

Purpose:
Define the AI reasoning, workflow, and instructions executed by the AI agent.

Technology:
- Markdown
- YAML (optional)

Deliverables:
- SKILL.md (7 files)
- Prompt Templates
- Examples
- Workflow Definitions

---

## Runtime Layer

Purpose:
Optional runtime for installation, validation, and future automation.

Technology:
- TypeScript
- Bun

Libraries:
- commander
- zod
- execa
- fast-glob

---

## Documentation

Technology

- Markdown

---

## Testing

Technology

- Vitest

---

## CI/CD

Technology

- GitHub Actions

---

# 23. Compatibility

Target platform:

- OpenCode
- Pi Agent

Target Operating System:

- Windows
- macOS
- Linux

Target Repository:

- Git Repository
- Local Workspace
- Remote Workspace (future)

---

# 24. Performance Requirements

Target performa:

- Repository kecil (<5K files)
  < 10 detik

- Repository menengah (5K–50K files)
  < 60 detik

- Repository besar (>50K files)
  Progressive Analysis

Skill harus mendukung incremental analysis pada versi mendatang.

---

# 25. Success Metrics

- Semua skill dapat dipanggil dengan command masing-masing.
- AI menghasilkan laporan yang konsisten pada project dengan struktur berbeda.
- Laporan memuat tingkat keparahan, penjelasan, dan rekomendasi.
- Developer dapat memahami hasil review tanpa harus membaca output scanner mentah.
- Skill dapat digunakan pada berbagai bahasa dan framework tanpa konfigurasi manual.
- `/release-check` dapat menjalankan semua audit sekaligus.

---

# 26. Risks

Risiko yang diketahui:

- False Positive
- False Negative
- Repository terlalu besar
- Bahasa pemrograman belum didukung
- Framework baru belum dikenali
- Skill terlalu banyak sehingga maintenance berat

Mitigasi:

- AI harus menjelaskan tingkat keyakinan (confidence level) pada setiap temuan.
- AI harus menyebutkan asumsi jika konteks repository tidak lengkap.
- AI tidak boleh mengklaim adanya issue tanpa bukti dari kode atau konfigurasi yang dianalisis.
- Gunakan shared components untuk mengurangi duplikasi.

---

# 27. Open Source Vision

Ekosistem skill ini dirancang sebagai komponen reusable yang dapat dipasang pada berbagai AI Coding Agent.

Target awal:
- OpenCode
- Pi Agent

Target jangka panjang:
- AI agent lain yang mendukung konsep skill atau workflow serupa.

Tujuan akhirnya adalah menyediakan standar workflow review yang konsisten sehingga developer dapat memperoleh hasil yang mudah dipahami, terstruktur, dan dapat ditindaklanjuti hanya dengan menjalankan satu perintah.

---

# 28. Roadmap

## v1.0 — Core Skills

- /security-audit
- /bug-investigate
- /performance-audit
- /architecture-review
- /dependency-review
- /database-review
- /release-check

## v1.1 — Enhanced Analysis

- External scanner integration (Gitleaks, Semgrep, Trivy)
- Incremental analysis
- Caching for faster re-scans

## v1.2 — Auto Fix

- Auto Fix Suggestions
- Code fix generation

## v2.0 — PR Review

- GitHub/GitLab integration
- PR comment automation
- Inline suggestions

## v3.0 — Organization Policy

- Custom rules per organization
- Policy enforcement
- Compliance reporting

---

*Last updated: 2026-07-03*