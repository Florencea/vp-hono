---
name: ui-component
description: Use when authoring new accessible UI primitives under src/client/components/ui/ or building compound components with React Aria Components.
compatibility: Vite+, React 19, React Aria Components, Tailwind CSS v4, @shadcn/lint
---

# UI Component Development Workflow

Runbook for authoring accessible UI primitives and compound components.

## 1. Check Existing Primitives

Before creating a new primitive, check `src/client/components/ui/` to reuse existing components (`Button`, `TextField`, `Select`, `DialogContent`, `SheetContent`, `Popconfirm`, `Table`, etc.).

## 2. Primitive Component Authoring Pattern

Author atomic primitives using `class-variance-authority` (CVA) and React Aria Components (RAC):

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

## 3. Format & Verify

Execute the inner verification and formatting loop:

```bash
# 1. Automatically fix Tailwind class ordering / canonical forms
vpr lint:tailwind:fix

# 2. Type check, Oxlint, and Tailwind canonical class check
vpr agent:verify:inner

# 3. Client E2E Chromium tests
vpr agent:test:e2e
```
