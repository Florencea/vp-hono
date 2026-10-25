---
trigger: glob
globs: "src/client/components/**, src/client/routes/**, src/client/theme.tsx, src/client/global.css"
description: React Aria Components, TanStack Form, TailwindCSS v4, and @shadcn/lint design system standards.
---

# UI & Styling Architecture Guidelines

Guidelines for building UI components with React Aria Components, TanStack Form, TailwindCSS v4, and React 19.

## 1. Single Source of Truth (SSOT) & Tokens

- **Design Tokens**: TailwindCSS v4 `@theme` in `src/client/global.css` is the sole source of truth for design tokens.
- **Theme Provider**: `src/client/theme.tsx` manages Light / Dark / System modes and applies `.dark` to the document root with zero runtime overhead.
- **Strict Linting Gate**: Enforced via `@shadcn/lint` in `vite.config.ts` (error level).
  - External components may only pass layout utilities (`allow: ["layout"]`) or use variant/size props.
  - Never override appearance/color styles of primitive UI components directly from page code.
  - Off-token colors (`shadcn/no-raw-colors`) and arbitrary values (`shadcn/no-arbitrary-values`) are strictly prohibited.

## 2. Component Styling Rules

- **No Inline `style`**: Never use `style={{ ... }}` on React or React Aria components (`shadcn/no-inline-styles`).
- **No `!` (important)**: Never use the `!` modifier in Tailwind classes.
- **Canonical Classes**: Use Tailwind CSS v4 canonical class syntax (e.g. `bg-(--variable)` instead of `bg-[var(--variable)]`). Run `vpr lint:tailwind` to diagnose and `vpr lint:tailwind:fix` to auto-fix.
- **Animation & Transitions**: Animations are powered by `tw-animate-css` and RAC interaction states (`data-entering`, `data-exiting`, `pressed:`, `focus-visible:`). Use spring-like micro-interactions (`transition-all duration-150 active:scale-95`).

## 3. React 19 & Core Component Wrappers

- **React Compiler**: Automatic fine-grained memoization is powered by React Compiler via `oxc-transform-react`. Avoid manual `useMemo`, `useCallback`, or `React.memo` unless handling non-compiler boundary edge cases.
- **Core Atomic UI Primitives** (`src/client/components/ui/`):
  - `<Button>`: React Aria Button wrapped with CVA variants, focus rings, and micro-press transitions.
  - `<DialogContent>` / `<DataModal>`: Accessible modals with backdrop blur, smooth zoom animations, and dialog roles.
  - `<SheetContent>` / `<DataDrawer>`: Accessible side drawers with slide-in/out transitions.
  - `<DataTable>`: TanStack Table wrapper standardizing responsive scrolling, headers, and accessible row selection.
  - `<Popconfirm>`: Accessible confirmation popover with arrow indicators and warning feedback.
  - `<ToastRegion>`: Unobtrusive bottom-right feedback notifications powered by React Aria toast queues.
- **Forms**: Use `@tanstack/react-form` paired with Zod validation for all client-side forms. Bind errors via `field.state.meta.errors` and RAC `isInvalid` props. Avoid `useEffect` to synchronize form state.
