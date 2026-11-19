# vp-hono

Full-stack web template combining **Hono** backend and **React 19 + React Aria Components + TanStack Form + Tailwind CSS v4** frontend into a single type-safe codebase, powered by project-local **Vite+** (`vp`) invoked through `npm`.

---

## Highlights

- **Vite+ (`vp`) Unified Toolchain via `npm`**: Sub-second static checks with Oxlint (`npm run lint`), Oxfmt (`npm run fmt`), and integrated Vitest (`npm test`), executing project-local `vp` without requiring a global `vp` CLI or `pnpm`.
- **End-to-End Type Safety**: Server schemas (`@hono/zod-openapi`) infer client RPC (`hc<AppType>`), TanStack Router, and TanStack Form validation with zero manual type duplication.
- **Strict Single Source of Truth (SSOT)**:
  - **Design System & Tokens**: TailwindCSS v4 `@theme` in `src/client/global.css` strictly guarded by `@shadcn/lint`. Native light / dark mode with CSS variables.
  - **UI Primitives**: Headless, fully accessible React Aria Components (RAC) styled to shadcn-ui standards with CVA and Lucide icons.
  - **Database**: Drizzle ORM schema with code-first schema push (`npm run db:push`) and automatic dual-target database seeding (`npm run db:seed` for SQLite & Cloudflare D1).
  - **i18n**: Type-safe isomorphic translations (`LocaleSchema`) with recursive parity contract tests between `en-US` and `zh-TW`.
- **RBAC & Zero Unprotected Routes**: Fail-closed gatekeeper ensuring every route declares permissions, authentication, or explicit public access, combined with fine-grained data scopes (`ALL`, `DEPT_AND_CHILD`, `DEPT`, `SELF`, `CUSTOM`).
- **Dual-Track Testing**: Vitest browser mode running in headless Chromium (`@vitest/browser-playwright`) for UI flows, and in-memory Hono (`app.request()`) for server contract tests.
- **Strict Quality Gate**: Unified verification (`npm run verify`) enforcing strict TypeScript, Oxlint, Oxfmt, Tailwind CSS v4 canonical classes, Knip dead-code detection, dual-track testing, and multi-target builds (Client SPA, Node.js server, Cloudflare Worker).

---

## Quick Start

### 1. Setup & Database

```bash
# Install dependencies from package-lock.json
npm ci

# Push schema and seed initial data
npm run db:push
npm run db:seed
```

> **Database SSOT**: `src/server/database/schema.ts` serves as the single source of truth for database tables. The project follows a code-first schema push workflow (`npm run db:push`), and `npm run db:seed` automatically seeds both the primary database (`database.sqlite`) and local Cloudflare D1 (`.wrangler/state/v3/d1/`).

### 2. Run Development Server

```bash
npm run dev
```

- Web App: `http://localhost:5173/` (native Vite dev server via local `vp dev` with Cloudflare Workers emulation)
- Scalar API Reference: `http://localhost:5173/openapi`
- OpenAPI JSON Spec: `http://localhost:5173/openapi/doc.json`

For Node.js production runner, start with `npm start` (listening on `PORT`, default `3000`).

---

## Package Management Policy

- Dependencies and lockfiles are managed with `npm` (`npm ci` for clean installs, `npm install` for dependency updates).
- `.npmrc` enforces `audit=false`, `engine-strict=true`, `fund=false`, `ignore-scripts=true`, `install-strategy=linked`, `save-exact=true`, and `strict-peer-deps=true`.
- Project-local `vp` is executed through `package.json` scripts (`npm run <script>`) or `npx vp <cmd>` without requiring a global `vp` CLI.
- Because `ignore-scripts=true` disables install scripts, run `npm run test:setup` explicitly to install the Playwright Chromium browser binary.
- When upgrading `vite-plus`, keep `overrides.vite`, `overrides.vitest`, `devDependencies.vitest`, and `devDependencies["@vitest/browser-playwright"]` in `package.json` aligned with `npx vp toolchain`.

---

## UI & Design System Architecture

The frontend follows an atomic, accessible design system architecture:

- **Primitives (`src/client/components/ui/`)**: Built upon React Aria Components and styled with Tailwind CSS v4 & CVA:
  - **Actions & Feedback**: `Button`, `Badge`, `Popconfirm`, `ToastRegion` (`toast`)
  - **Data Input**: `TextField`, `Input`, `Label`, `FieldError`, `NumberField`, `PasswordInput`, `Select`, `MultiSelect`, `Checkbox`, `RadioGroup`
  - **Overlays**: `DialogContent` (Modal), `SheetContent` (Drawer)
  - **Data Display**: `Table`, `Card`
- **Form Architecture**: Powered by `@tanstack/react-form` + Zod schema validation, binding directly to RAC accessible error states (`isInvalid`, `field.state.meta.errors`).
- **Theme & Styling**: Token-driven design tokens declared in `src/client/global.css` `@theme`, strictly guarded against off-token arbitrary values via `@shadcn/lint`.

---

## Feature Development Workflow

This template follows an **End-to-End Type-Safe & Test-Driven (TDD)** development flow:

1. **Scaffold Feature Slice**:
   - Run `npm run scaffold:feature -- <feature-name>` to bootstrap schema, routes, handlers, and contract tests.
2. **Implement Business Logic**:
   - Connect handlers and database models in `src/server/routes/<feature>/`.
3. **Client UI & Form**:
   - Create routes in `src/client/routes/` and components in `src/client/components/<feature>/`.
   - Build accessible forms using `@tanstack/react-form` and React Aria Components (`TextField`, `Select`, `DialogContent`, etc.).
4. **Browser Mode Test**:
   - Write real browser tests in `test/client/` using `renderAppAt()` to verify UI interactions, token styles, and RPC calls.
5. **Unified Verification Gate**:
   - Execute `npm run verify` (or `npm run agent:verify:gate`) to verify types, lints, formatting, dead code, tests, and builds.

---

## Verification Gate (Definition of Done)

Run the unified gate before committing or completing development tasks:

```bash
npm run verify
```

Executes `typecheck` + `vp check` (Oxlint + Oxfmt + typecheck) + `agent:lint:tailwind` + `check:deadcode` (Knip) + `vp test run` (Vitest dual-track: Chromium + Node) + `vp build`. Must pass with 0 errors and 0 warnings.

---

## Available Scripts

| Command                         | Description                                                                                             |
| :------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `npm run dev`                   | Start native Vite dev server via `vp dev` (with `@cloudflare/vite-plugin` emulation)                    |
| `npm run preview`               | Preview production build locally via `vp preview`                                                       |
| `npm run check`                 | Run Oxlint, Oxfmt, and TypeScript checks via `vp check`                                                 |
| `npm run fmt`                   | Format source and manifest files with Oxfmt (`vp fmt`)                                                  |
| `npm run fmt:check`             | Verify formatting without modifying files (`vp fmt --check`)                                            |
| `npm run lint`                  | Run Oxlint checks (`vp lint`)                                                                           |
| `npm run agent:lint:fix`        | Auto-fix formatting, lint, and Tailwind issues (`vp check --fix` + Tailwind fixer)                      |
| `npm run verify`                | Run unified verification gate (typecheck, check, tailwind, deadcode, tests, build)                      |
| `npm run check:fast`            | Fast feedback loop (`typecheck` + `lint` + server unit tests)                                           |
| `npm run agent:verify:inner`    | Agent fail-fast static verification (`typecheck` + `lint` + `agent:lint:tailwind`)                      |
| `npm run agent:verify:unit`     | Agent unit verification (`inner` + server unit tests)                                                   |
| `npm run agent:verify:gate`     | Agent comprehensive gate (`unit` + `build` + client E2E tests)                                          |
| `npm run typecheck`             | TypeScript strict type check with raw output                                                            |
| `npm run agent:test:unit`       | Server in-memory unit tests in flat TAP format                                                          |
| `npm run agent:test:e2e`        | Client browser E2E tests in headless Chromium in flat TAP format                                        |
| `npm test`                      | Run all Vitest tests via `vp test run` (client + server)                                                |
| `npm run test:unit`             | Run server unit tests via `vp test run --project server`                                                |
| `npm run test:e2e`              | Run client E2E tests via `vp test run --project client`                                                 |
| `npm run test:setup`            | Install Playwright Chromium binary                                                                      |
| `npm run build`                 | Build client SPA (`dist/client`), server bundle (`dist/server`), and Cloudflare Worker (`dist/vp_hono`) |
| `npm start`                     | Start Node.js production server (`node dist/server/app.js`)                                             |
| `npm run lint:ci`               | Validate GitHub Actions workflows locally via `actionlint`                                              |
| `npm run lint:tailwind`         | Check Tailwind CSS v4 canonical class syntax                                                            |
| `npm run lint:tailwind:fix`     | Automatically format Tailwind CSS v4 canonical classes                                                  |
| `npm run check:deadcode`        | Audit unused code and dependencies with Knip                                                            |
| `npm run routes:generate`       | Generate TanStack Router route tree (`src/client/routeTree.gen.ts`)                                     |
| `npm run scaffold:feature -- …` | Scaffold a full-stack feature slice                                                                     |
| `npm run db:push`               | Push schema changes via Drizzle Kit                                                                     |
| `npm run db:seed`               | Seed database with initial data                                                                         |
| `npm run db:studio`             | Launch Drizzle Studio database manager                                                                  |
| `npm run deploy:cf`             | Deploy to Cloudflare Workers                                                                            |
| `npm run docker:build`          | Build Docker image with Node.js runtime aligned to `engines.node`                                       |

---

## Guidelines

For architectural rules, SSOT conventions, and strict coding standards, see [AGENTS.md](AGENTS.md).
