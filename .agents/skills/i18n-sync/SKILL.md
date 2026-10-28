---
name: i18n-sync
description: Use when adding or modifying localization strings, synchronizing en-US and zh-TW dictionaries, or resolving i18n contract test drift.
compatibility: Vite+, TypeScript, i18n
---

# Internationalization (i18n) Synchronization Workflow

Runbook for adding or modifying translation keys with zero key drift.

## 1. Define Schema Keys

Add nested translation keys in `src/locales/schema.ts` under `localeSchema`:

```typescript
export const localeSchema = {
  // ...
  myFeature: {
    title: "",
    description: "",
  },
};
```

## 2. Populate Language Dictionaries

Fill corresponding translated strings into both dictionaries:

- **English**: `src/locales/en-US.ts`
- **Traditional Chinese**: `src/locales/zh-TW.ts`

Both files must satisfy `LocaleSchema`:

```typescript
export const enUS = {
  // ...
} satisfies LocaleSchema;
```

## 3. Verify Translation Parity

Run the canary contract test to ensure zero key drift:

```bash
vpr agent:test:unit test/canary/i18n-contract.test.ts
```
