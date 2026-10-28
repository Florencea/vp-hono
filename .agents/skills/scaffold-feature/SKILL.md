---
name: scaffold-feature
description: Use when scaffolding a new full-stack feature slice, bootstrapping OpenAPI routes and handlers, or creating end-to-end domain modules.
compatibility: Vite+, Hono, React 19, React Aria Components, TanStack Form
---

# Scaffold Feature Workflow

Step-by-step procedure to generate and implement an end-to-end type-safe feature slice.

## 1. Run Generator

Execute the scaffolding script:

```bash
vpr scaffold:feature <feature-name>
```

This automatically generates:

- Backend: `src/server/routes/<feature>/` (schema, routes, handlers, index)
- Sub-router mount: `src/server/router.ts`
- Translations: Keys appended to `src/locales/schema.ts`, `en-US.ts`, `zh-TW.ts`
- Contract test: `test/server/<feature>-contract.test.ts`

## 2. Implement Business Logic

1. **Schema & RBAC**: Define request/response fields in `<feature>.schema.ts` and attach security guards (`requirePermission`, `authenticatedRoute`, or `publicRoute`).
2. **Handlers & Scope**: Implement database queries in `<feature>.handlers.ts` using `getDataScopeFilter(c, ...)`.
3. **Frontend Wiring**: Create client route under `src/client/routes/` and build UI forms using `@tanstack/react-form` + React Aria Components.

## 3. Verify Implementation

```bash
# 1. Typecheck and unit contract tests
vpr agent:verify:unit

# 2. Comprehensive verification gate
vpr agent:verify:gate
```
