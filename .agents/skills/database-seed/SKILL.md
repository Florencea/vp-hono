---
name: database-seed
description: Use when pushing Drizzle schema changes, seeding local SQLite or Cloudflare D1 databases, or resetting database test fixtures.
compatibility: Vite+, Drizzle ORM, SQLite, Cloudflare D1
---

# Database Sync & Seed Workflow

Procedure to push schema definitions and seed data into local SQLite and Cloudflare D1 databases.

## 1. Push Schema Changes

Push table definitions from `src/server/database/schema.ts`:

```bash
npm run db:push
```

## 2. Seed Databases

Populate administrator accounts, departments, and roles across `database.sqlite` and local Cloudflare D1 (`.wrangler/state/v3/d1/`):

```bash
npm run db:seed
```

## 3. Verify Database Integrity

Run server unit tests to confirm data consistency and permission scopes:

```bash
npm run agent:test:unit -- test/server/
```
