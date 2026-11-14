---
trigger: glob
globs: ".github/workflows/**"
description: CI workflow verification standards, actionlint requirements, and security guidelines.
---

# CI & GitHub Actions Workflow Standards

Standards for maintaining and updating GitHub Actions workflows.

## 1. Shift-Left Local Verification

- **Strict Requirement**: Whenever `.github/workflows/` files are added or modified, running `actionlint` locally with **0 errors and 0 warnings** is mandatory before staging (`git add`).
- **Execution Script**: Execute via `vpr agent:lint:ci` (or `vpr lint:ci` / `actionlint` directly).

## 2. Guardrail Boundaries

- **Offline-Only Tool**: `actionlint` is strictly an offline / local shift-left verification guardrail.
- **Remote Workflow Invariant**: Never embed `actionlint` steps into remote GitHub Actions workflow files (`.github/workflows/*.yml`).

## 3. Centralized Workflows (`Florencea/vp-actions`)

- **Centralized Pipeline**: Standard Web and Fullstack applications consume the centralized Reusable Workflow from `Florencea/vp-actions/.github/workflows/vp-web-ci.yml@v3.0.0` (`ubuntu-24.04`).
- **Custom Inputs**:
  - `pre-test-command`: Pass repository-specific preparation hooks (e.g. `vp run db:seed`).
- **Specialized Workflows**: Applications with custom display or Electron packaging needs consume `Florencea/vp-actions/.github/workflows/vp-electron-ci.yml@v3.0.0` or modular Composite Actions:
  - `Florencea/vp-actions/actions/setup-vp-env@v3.0.0`: Node.js engine, Vite+, dependency installation, and Vite Task Cache.
  - `Florencea/vp-actions/actions/setup-playwright@v3.0.0`: Chromium binary installation and Linux system dependencies.

## 4. GitHub Actions Runner Best Practices & Invariants

- **Exact SemVer Pinning Invariant**:
  - Pin GitHub Actions and reusable workflows to exact SemVer tags and manage upgrades via `up`.
  - Authoritative Action Baselines:
    - `Florencea/vp-actions/.github/workflows/vp-web-ci.yml@v3.0.0`
    - `Florencea/vp-actions/actions/setup-vp-env@v3.0.0`
    - `Florencea/vp-actions/actions/setup-playwright@v3.0.0`
    - `actions/checkout@v7.0.1`
    - `voidzero-dev/setup-vp@v1.22.0`
    - `actions/cache@v6.1.0`
    - `actions/upload-artifact@v7.0.2`
- **Concurrency Policy**: Workflows triggered by `push` and `pull_request` must declare top-level `concurrency` with `cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}` to prevent redundant CI runs and runner starvation.
- **Timeout Protection**: Every runner job must declare an explicit `timeout-minutes` (standard: `15`) to prevent stalled tests or deadlocked processes from consuming the default limit.
- **Architecture-Aware Caching**: Cache keys for toolchain tasks (e.g. Vite Task Cache) must incorporate `${{ runner.os }}-${{ runner.arch }}` to ensure complete cache isolation between x64 and ARM64 runners.
- **Artifact Retention**: Failure diagnostic uploads via `actions/upload-artifact` must specify `retention-days: 7` to avoid unnecessary storage usage.
- **Node.js Runtime Invariant**:
  - Node.js 26 is the project's authoritative Active LTS engine (`package.json` `engines.node`).
  - Following the Node.js release schedule evolution, upstream canary testing will be reintroduced once Node.js v27 officially enters the Current release phase.
