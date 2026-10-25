---
name: ui-component
description: Workflow for creating or updating accessible UI primitives and compound components using React Aria Components, Tailwind CSS v4, and @shadcn/lint standards.
compatibility: Vite+, React 19, React Aria Components, Tailwind CSS v4, @shadcn/lint
---

# UI Component Development Workflow

Guidelines and workflow for authoring or updating UI primitives under `src/client/components/ui/` and compound business components.

## 1. Design Token & Architecture Rules

- **Token SSOT**: Only use Tailwind CSS v4 `@theme` design tokens defined in `src/client/global.css` (e.g., `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`).
- **Strict Linting**:
  - `@shadcn/lint` enforces zero arbitrary values (`shadcn/no-arbitrary-values`) and zero raw colors (`shadcn/no-raw-colors`).
  - No inline styles (`shadcn/no-inline-styles`).
  - External callers may only pass layout utilities (`margin`, `display`, `flex`, `grid`, etc.).
- **Canonical Classes**: Always use canonical Tailwind CSS v4 syntax. Format via `vpr lint:tailwind:fix`.
- **Accessibility**: Use React Aria Components (RAC) hooks and components to ensure keyboard navigation, ARIA roles, and screen reader compatibility.

## 2. Primitive Component Authoring Pattern

For atomic primitives under `src/client/components/ui/`, use `class-variance-authority` (CVA) for variants and size options:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn.ts";

const componentVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-muted",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof componentVariants> {}

export function Component({ className, variant, size, ...props }: ComponentProps) {
  return <div className={cn(componentVariants({ variant, size }), className)} {...props} />;
}
```

## 3. Verification & Diagnostic Commands

After authoring or editing UI components, run the inner verification loop:

```bash
# 1. Type check, Oxlint, and Tailwind canonical class check
vpr agent:verify:inner

# 2. Automatically fix Tailwind class ordering / canonical forms
vpr lint:tailwind:fix

# 3. Client E2E Chromium tests
vpr agent:test:e2e
```
