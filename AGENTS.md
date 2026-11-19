# Agent Development Guidelines

Guidelines for AI agents and human contributors working on this repository.

This project manages dependencies with `npm` and runs the project-local Vite+ (`vp`) toolchain (`node_modules/.bin/vp`) through `npm run <script>` without relying on a global `vp` CLI or `pnpm`.

## 1. Architecture Map

| Layer               | Path                            | Responsibility                                                                                                                |
| :------------------ | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Routes** | `src/client/routes/`            | TanStack Router file routes (protected route tree)                                                                            |
| **Frontend UI**     | `src/client/components/`        | React Aria Components + TanStack Form + Tailwind CSS v4                                                                       |
| **Theme & Tokens**  | `src/client/theme.tsx`          | Light / Dark mode state management & CSS variables bridge                                                                     |
| **Translations**    | `src/locales/`                  | `schema.ts` (SSOT), strict `en-US` & `zh-TW` parity                                                                           |
| **Backend Routes**  | `src/server/routes/`            | OpenAPI route specs, schemas, handlers                                                                                        |
| **API Router**      | `src/server/router.ts`          | Sub-router mounts & RPC `AppType` inference                                                                                   |
| **Database Schema** | `src/server/database/schema.ts` | Drizzle ORM Single Source of Truth                                                                                            |
| **Tests**           | `test/`                         | Vitest Chromium browser & in-memory server tests                                                                              |
| **Domain Rules**    | `.agents/rules/`                | Modular glob-triggered domain rules (`api-routes`, `database`, `ui-styling`, `routing`, `locales`, `testing`, `ci-workflows`) |
| **Project Skills**  | `.agents/skills/`               | On-demand repeatable workflow runbooks (`scaffold-feature`, `database-seed`, `ui-component`, `i18n-sync`)                     |

---

## 2. Core SSOT & Invariants

- **npm-Managed Project-Local `vp`**: Manage dependencies with `npm` (`npm ci`, `npm install`, `npm pkg get/set/delete/fix`) and invoke project-local `vp` through `package.json` scripts (`npm run <script>`) or `npx vp <cmd>` rather than relying on global `vp` or `pnpm`. When upgrading `vite-plus`, keep `package.json` `overrides.vite` (`npm:@voidzero-dev/vite-plus-core@<core-version>`), `overrides.vitest` (`<vitest-version>`), `devDependencies.vitest`, and `devDependencies["@vitest/browser-playwright"]` synchronized with `npx vp toolchain`.
- **Strict `.npmrc` Policy**: Keep `audit=false`, `engine-strict=true`, `fund=false`, `ignore-scripts=true`, `install-strategy=linked`, `save-exact=true`, and `strict-peer-deps=true` in `.npmrc`. Install Playwright browsers explicitly via `npm run test:setup`.
- **Styling SSOT**: TailwindCSS v4 `@theme` in `src/client/global.css` is the sole source of truth for design tokens. Strictly guarded by `@shadcn/lint` in `vite.config.ts`.
  - External page code may only pass layout utilities (`allow: ["layout"]`) or use variant/size props.
  - Never hardcode raw colors (`shadcn/no-raw-colors`), arbitrary values (`shadcn/no-arbitrary-values`), or use inline `style={{ ... }}` (`shadcn/no-inline-styles`).
  - Run `npm run lint:tailwind` to diagnose and `npm run lint:tailwind:fix` to format canonical Tailwind v4 class names.
- **UI Primitives Standard**: Base accessible components live in `src/client/components/ui/` built with React Aria Components (RAC), CVA, and Lucide icons (aligned with shadcn-ui structure).
- **Form SSOT**: TanStack Form (`@tanstack/react-form`) paired with Zod validation is the authoritative client form standard. All forms bind accessible field states (`field.state.meta.errors`) and RAC `isInvalid` props.
- **Compiler Invariant**: React Compiler via `oxc-transform-react` handles fine-grained memoization automatically. Avoid unnecessary manual `useMemo`, `useCallback`, or `React.memo`.
- **Database SSOT**: `src/server/database/schema.ts` is the sole source of truth. Code-first schema push via `npm run db:push`. Database initialization and seed logic in `src/server/database/seed.ts` dual-seeds SQLite and local Cloudflare D1.
- **RBAC Fail-Closed**: Every API route must explicitly declare its access control (`requirePermission`, `authenticatedRoute`, or `publicRoute`). Canary security audits strictly enforce this via `test/canary/rbac-contract.test.ts`.
- **Protected Files**: Never manually edit `src/client/routeTree.gen.ts` (auto-generated by `@tanstack/router-plugin/vite` or `npm run routes:generate`).
- **Domain Rules**: Path-specific rules live under `.agents/rules/` (`api-routes`, `database`, `ui-styling`, `routing`, `locales`, `testing`, `ci-workflows`) and activate via file globbing.

---

## 3. Frictionless Execution (Whitelist-First)

Prioritize `npm run agent:*` commands matching Antigravity's whitelist:

- **Gate**: `npm run agent:verify:gate` (`unit` -> `build` -> `e2e`) or `npm run verify`
- **Inner Loop**: `npm run agent:verify:inner` (`typecheck` -> `lint` -> `agent:lint:tailwind`)
- **Unit Verification**: `npm run agent:verify:unit` (`inner` -> `agent:test:unit`)
- **Unit Tests**: `npm run agent:test:unit` (in-memory server tests)
- **E2E Tests**: `npm run agent:test:e2e` (Chromium browser tests)
- **Type Check**: `npm run typecheck`
- **CI Lint**: `npm run agent:lint:ci` (or `npm run lint:ci`, `actionlint` 0 errors/warnings)
- **Tailwind Lint**: `npm run agent:lint:tailwind`, `npm run agent:lint:tailwind:fix` (or `npm run lint:tailwind`, `npm run lint:tailwind:fix`)
- **Direct Local `vp` Shortcuts**: `npm run dev`, `npm run preview`, `npm run check`, `npm run agent:lint:fix`, `npm run fmt`, `npm run fmt:check`, `npm run lint`, `npm test`, `npm run build` (Client + Server + Worker), `npm start`

---

## 4. Git Workflow & Commit Restrictions

- **NEVER execute `git commit` directly**: Local environment uses 1Password SSH signing; non-interactive commit fails.
- **Protocol**: Stage changes with `git add <files>` and output `git commit -m "..."` in English for user to run locally.

---

## 5. Language & Planning Standards

- **Traditional Chinese for Plans & Responses**: All plans (`/plan`), walkthroughs, and chat responses must strictly be written in **Traditional Chinese (繁體中文)**.
- **Code Artifacts**: Source code, inline comments, commit messages, and automated tests must use concise English.
