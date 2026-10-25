---
trigger: glob
globs: "src/server/routes/**, src/server/router.ts, src/server/openapi.ts, src/server/middleware/**"
description: OpenAPI schema validation, RPC router mounting, and mandatory RBAC fail-closed conventions.
---

# API & Routing Guidelines (Server)

Guidelines for backend routing, OpenAPI specifications, and RPC exposure in this repository.

## 1. Modular OpenAPI Routing

- **Route Definitions**: Define request/response Zod schemas in `<feature>.schema.ts` using `@hono/zod-openapi`. Always annotate schema fields with `.openapi({ description: "...", example: ... })`.
- **Route Specifications**: Register route endpoints using `createRoute()` in `<feature>.routes.ts`. Specify tags, summary, middleware, and response schemas.
- **Route Handlers**: Implement handlers in `<feature>.handlers.ts` and export the sub-router in `<feature>/index.ts`.
- **RPC Router Mount**: Mount all sub-routers into `apiRouter` (`src/server/router.ts`) to enable seamless client RPC type inference (`AppType`).
- **End-to-End Type Inference**: The client consumes the API via `api` (`hc<AppType>("/api")` in `src/client/api.ts`), ensuring zero type manual duplication and compile-time contract enforcement.

## 2. Mandatory RBAC & Fail-Closed Gate

- **Zero Unprotected Routes**: Every newly introduced route MUST have explicit access control. Never expose raw, unguarded endpoints.
- **Route Security Declarations**: Every route spec in `createRoute` must declare:
  - `middleware: [requirePermission("...")]` as const for permission-restricted endpoints.
  - `middleware: [authenticatedRoute()]` as const for session-only endpoints.
  - `middleware: [publicRoute()]` as const for explicitly public endpoints.
- **Data Scope Enforcement**: When querying scoped resources (such as users or department data), use `getDataScopeFilter(c, "departments.id")` to enforce `ALL`, `DEPT_AND_CHILD`, `DEPT`, `SELF`, or `CUSTOM` boundaries.
- **Least Privilege Principle**: Default-deny / restricted to `super_admin` with `SELF` scope when unspecified.

## 3. Error Handling & Localized Responses

- **Isomorphic i18n Errors**: Backend errors (including 400, 401, 403, 404, 500) must return localized error messages using `t(c, "errors.<domain>.<code">)` from `src/server/i18n.ts`.
- **Standard Error Schema**: Always use `ErrorResSchema` from `src/server/common/schemas.ts` for non-200 responses to maintain schema consistency.
