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
  - **Actions & Feedback**:
    - `<Button>`: React Aria Button with CVA variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and sizes (`default`, `sm`, `lg`, `icon`).
    - `<Popconfirm>`: Accessible confirmation popover powered by RAC `DialogTrigger` + `Popover` with destructive action confirmation.
    - `<Badge>`: Status indicator with CVA variants (`default`, `secondary`, `outline`, `destructive`).
    - `<ToastRegion>` & `toast`: Accessible floating notifications queue (`toast.success()`, `toast.error()`, `toast.info()`).
  - **Inputs & Form Controls**:
    - `<TextField>`, `<Input>`, `<Label>`, `<FieldError>`: Form field primitives with accessible state bindings.
    - `<Select>`, `<SelectItem>`: Accessible dropdown selection powered by RAC `Select`.
    - `<MultiSelect>`: Tag-based multi-selection with responsive chips and keyboard removal.
    - `<NumberField>`: Number input with increment/decrement steppers.
    - `<PasswordInput>`: Secure password field with reveal/hide toggle.
    - `<Checkbox>`, `<CheckboxGroup>`, `<RadioGroup>`, `<Radio>`: Accessible selection controls.
  - **Overlays**:
    - `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogFooter>`: Accessible modal dialogs with backdrop blur and smooth zoom transitions.
    - `<SheetContent>`, `<SheetHeader>`, `<SheetTitle>`, `<SheetFooter>`: Accessible slide-over side drawers.
  - **Data Display**:
    - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>`: Responsive tabular layout primitives.
    - `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`: Container primitives.

## 4. TanStack Form & Validation Pattern

All forms bind `@tanstack/react-form` to React Aria Components with Zod validation:

```tsx
<form.Field name="username">
  {(field) => {
    const isInvalid = field.state.meta.errors.length > 0;
    return (
      <TextField isInvalid={isInvalid} className="w-full">
        <Label>{t("user.username")}</Label>
        <Input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={t("common.pleaseEnter", { field: t("user.username") })}
        />
        {isInvalid ? <FieldError>{field.state.meta.errors.join(", ")}</FieldError> : null}
      </TextField>
    );
  }}
</form.Field>
```

- Bind `field.state.meta.errors` directly to `<FieldError>`.
- Never use `useEffect` to synchronize form state with props; use controlled `defaultValues` or form reset handlers.
