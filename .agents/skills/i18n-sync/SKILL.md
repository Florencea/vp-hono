---
name: i18n-sync
description: Workflow for adding, modifying, and verifying isomorphic localized translation keys across schema, en-US, and zh-TW.
compatibility: Vite+, TypeScript, i18n
---

# Internationalization (i18n) Synchronization Workflow

Guidelines and workflow for maintaining zero key drift and strict schema parity across application translations.

## 1. Schema-First Translation Definition

All translations are strictly typed and originate in `src/locales/schema.ts`:

1. Open `src/locales/schema.ts`.
2. Add your new nested translation keys under `localeSchema`:

```typescript
export const localeSchema = {
  // ...
  myFeature: {
    title: "",
    description: "",
    submitSuccess: "",
  },
};
```

## 2. Sync Language Dictionaries

Update both language files with non-empty values matching the schema keys:

- **English**: `src/locales/en-US.ts`
- **Traditional Chinese**: `src/locales/zh-TW.ts`

Ensure each file ends with `satisfies LocaleSchema`:

```typescript
export const enUS = {
  // ...
} satisfies LocaleSchema;
```

## 3. Verify Translation Parity Contract

Run the i18n contract test suite to assert zero key drift and parameter interpolation accuracy:

```bash
vpr agent:test:unit test/canary/i18n-contract.test.ts
```

All dictionary keys are checked recursively, and both server (`t(c, key)`) and client (`useI18n()`) APIs are verified.
