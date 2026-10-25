> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先閱讀以下最新官方文件，嚴格禁止依賴模型過往訓練知識！**
>
> 1. **React Aria Components**: https://react-aria.adobe.com/llms.txt
> 2. **shadcn/ui (React Aria Base)**: https://ui.shadcn.com/llms.txt
> 3. **@shadcn/lint (Agent-First Linter)**: https://github.com/shadcn-ui/lint
> 4. **TanStack Form (Type-Safe Forms)**: https://tanstack.com/form/latest

# Phase 2 執行手冊：設計系統基礎建設與 @shadcn/lint 導入

## 1. 階段目標與核心理念

本階段為全新現代化 UI 的**地基工程**。目標是在不破壞現有 Ant Design 運行的前提下，建立完整的 React Aria Components、TanStack Form、lucide-react 與 `@shadcn/lint` 基礎設施。

> [!IMPORTANT]
> **本階段規則準則**：
>
> 1. `@shadcn/lint` 規則在這一階段嚴格配置為 **`warn`**（警告），讓現有頁面維持正常編譯與測試，同時開始為 Agent 提供設計系統的反饋資訊。
> 2. 此階段結束時，所有現有測試（包含 Phase 1 擴充的 E2E 測試）必須持續維持 100% 綠燈。

---

## 2. 套件安裝與環境準備

使用專案統一工具鏈 `vp` 安裝相依套件：

```bash
# 1. 安裝核心運行時套件
vp install react-aria-components @internationalized/date lucide-react @tanstack/react-form

# 2. 安裝開發階段工具與動畫支援
vp install -D @shadcn/lint tw-animate-css
```

---

## 3. 設定 `components.json` (Base: React Aria)

在專案根目錄新增 `components.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/client/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/client/components",
    "utils": "src/client/utils",
    "ui": "src/client/components/ui"
  },
  "base": "aria"
}
```

---

## 4. 擴充 Tailwind CSS v4 設計 Token (`src/client/global.css`)

在 `@theme` 區塊中定義符合 shadcn / RAC 標準的語意 Token，並相容既有的 Antd 變數：

```css
@layer base, theme;

@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/theme.css" layer(theme);

#root {
  @import "tailwindcss/utilities.css";
}

@theme {
  --color-primary: #2f54eb;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #09090b;
  --color-muted: #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-border: #e4e4e7;
  --color-input: #e4e4e7;
  --color-ring: #2f54eb;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;

  --breakpoint-xs: 480px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1600px;
}
```

---

## 5. 配置 `@shadcn/lint` (Oxlint 警告模式)

建立根目錄 `.oxlintrc.json`，註冊 `@shadcn/lint` 插件並設置規則為 `warn`：

```json
{
  "jsPlugins": ["@shadcn/lint"],
  "settings": {
    "shadcn": {
      "ui": "src/client/components/ui",
      "componentImports": ["^src/client/components/ui(/|$)"]
    }
  },
  "rules": {
    "shadcn/no-restyle": [
      "warn",
      {
        "allow": ["layout"],
        "contracts": [{ "pattern": "^Button$", "allow": ["layout"] }]
      }
    ],
    "shadcn/no-raw-colors": "warn",
    "shadcn/no-arbitrary-values": "warn",
    "shadcn/no-inline-styles": "warn"
  },
  "overrides": [
    {
      "files": ["src/client/components/ui/**"],
      "rules": {
        "shadcn/no-restyle": "off",
        "shadcn/no-arbitrary-values": "off"
      }
    }
  ]
}
```

---

## 6. 建置 TanStack Form + React Aria 轉接層 (`src/client/components/ui/form.tsx`)

為了實現極致型別安全並消除重複代碼，在 `src/client/components/ui/form.tsx` 中封裝 TanStack Form 與 React Aria Components 的欄位綁定橋樑：

```tsx
import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { FieldError, Label, TextField as RACTextField } from "react-aria-components";

interface FormFieldProps {
  field: AnyFieldApi;
  label?: string;
  children: ReactNode;
}

export function FormField({ field, label, children }: FormFieldProps) {
  const isInvalid = field.state.meta.errors.length > 0;
  return (
    <RACTextField isInvalid={isInvalid} className="flex flex-col gap-1.5">
      {label && <Label className="text-sm font-medium text-foreground">{label}</Label>}
      {children}
      {isInvalid && (
        <FieldError className="text-xs text-destructive">
          {field.state.meta.errors.join(", ")}
        </FieldError>
      )}
    </RACTextField>
  );
}
```

---

## 7. Phase 2 驗收標準 (Acceptance Gate)

執行以下指令驗證基礎建設完整性：

```bash
# 1. 內部驗證：確保型別檢查、Oxlint (載入 @shadcn/lint)、Tailwind 檢查皆順利通過
vpr agent:verify:inner

# 2. 全門禁驗證：確保現有應用與 Phase 1 測試 100% 正常運行
vpr agent:verify:gate
```

驗收合格後，Phase 2 Agent 即可將健全的基礎設施交付給 Phase 3 執行組件批次遷移。
