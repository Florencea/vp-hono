---
trigger: glob
globs: ".github/workflows/**"
description: CI workflow verification standards, actionlint requirements, and security guidelines.
---

# CI & GitHub Actions Workflow Standards

Standards for maintaining and updating GitHub Actions workflows.

## 1. Shift-Left Local Verification

- **Strict Requirement**: Whenever `.github/workflows/` files are added or modified, running `actionlint` locally with **0 errors and 0 warnings** is mandatory before staging (`git add`).
- **Execution Script**: Execute via `vpr lint:ci` (or `actionlint` directly).

## 2. Guardrail Boundaries

- **Offline-Only Tool**: `actionlint` is strictly an offline / local shift-left verification guardrail.
- **Remote Workflow Invariant**: Never embed `actionlint` steps into remote GitHub Actions workflow files (`.github/workflows/*.yml`).

## 3. GitHub Actions Runner Best Practices & Invariants

- **Concurrency Policy**: Workflows triggered by `push` and `pull_request` must declare top-level `concurrency` with `cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}` to prevent redundant CI runs and runner starvation.
- **Timeout Protection**: Every runner job must declare an explicit `timeout-minutes` (standard: `15`) to prevent stalled tests or deadlocked processes from consuming the 360-minute default limit.
- **Architecture-Aware Caching**: Cache keys for toolchain tasks (e.g. Vite Task Cache) must incorporate `${{ runner.os }}-${{ runner.arch }}` to ensure complete cache isolation between x64 and ARM64 runners.
- **Artifact Retention**: Failure diagnostic uploads via `actions/upload-artifact` must specify `retention-days: 7` to avoid unnecessary storage usage.
- **Node.js Runtime Invariant**:
  - Node.js 26 is the project's authoritative Active LTS engine (`package.json` `engines.node`).
  - Following the Node.js release schedule evolution, upstream canary testing will be reintroduced once Node.js v27 officially enters the Current release phase.
