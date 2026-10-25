> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先查閱以下官方最新真相來源 (SSOT)，嚴格禁止依賴模型過往訓練知識！**
> 在執行任何代碼更動前，接手任務的 Agent 必須依據下表指示執行 `webread` 查閱最新規範，切勿憑模型內部的過期記憶推論 API。

## 0. 官方最新真相來源 (SSOT) 與查閱規範

| 框架 / 工具               | 官方最新真相來源 (SSOT URL)                                                                                                                                                             | 關鍵查閱重點 (Verification Focus)                                                                                                                                                                                         | 查閱指令範例                                                                  |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| **React Aria Components** | `https://react-aria.adobe.com/llms.txt`<br/>`https://react-aria.adobe.com/customization.md`<br/>`https://react-aria.adobe.com/styling.md`<br/>`https://react-aria.adobe.com/testing.md` | 官方標準 **`render` prop**（取代舊版自訂標籤或脆弱 wrapper）；`composeRenderProps` 樣式合併；Tailwind v4 短修飾字（`selected:`, `pressed:`, `entering:`, `exiting:`）；`hidden="until-found"` 支援；Popover `placement`。 | `webread https://react-aria.adobe.com/customization.md#dom-elements`          |
| **shadcn/ui**             | `https://ui.shadcn.com/llms.txt`<br/>`https://ui.shadcn.com/docs/components-json`<br/>`https://ui.shadcn.com/docs/tailwind-v4`                                                          | New York 風格（`"style": "new-york"`）；標準 `src/components/ui/` 原子原語目錄分層；CVA (`class-variance-authority`) 與 `cn` 變體管理模式；外觀與行為責任分離。                                                           | `webread https://ui.shadcn.com/docs/components-json`                          |
| **`@shadcn/lint`**        | `https://github.com/shadcn-ui/lint`<br/>`https://raw.githubusercontent.com/shadcn-ui/lint/main/SETUP.md`<br/>`https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md`      | `no-restyle` 邊界：`src/components/ui/**` 豁免（允許原子組件自主樣式定義）；外部業務組件僅傳遞佈局類別（`allow: ["layout"]`）或使用 variant/size，禁止覆蓋組件內部 appearance。                                           | `webread https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md` |
| **Vite+**                 | `https://viteplus.dev/llms-full.txt`<br/>`https://viteplus.dev/guide/lint.md`<br/>`https://viteplus.dev/guide/test.md`                                                                  | 原生 `vp` / `vpx` / `vpr` 工具鏈；單測試執行指令（`vp test run <spec> --reporter=tap-flat --no-color`）；`vite.config.ts` SSOT 零額外配置（**嚴禁建立 `.oxlintrc.json`**）；毫秒級 Vite Task 快取重放。                   | `webread https://viteplus.dev/guide/test.md`                                  |
| **TanStack Form**         | `https://tanstack.com/form/latest`                                                                                                                                                      | 端到端型別安全表單綁定；Zod Validator 適配；欄位狀態與錯誤提取 (`field.state.meta.errors`)；與 RAC 輸入組件的受控與無障礙橋接。                                                                                           | `webread https://tanstack.com/form/latest`                                    |

---

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
# 1. 安裝核心運行時套件（含無障礙基底、日期、圖示、表單、表格與變體樣式）
vp install react-aria-components @internationalized/date lucide-react @tanstack/react-form @tanstack/react-table class-variance-authority

# 2. 安裝開發階段工具與動畫支援
vp install -D @shadcn/lint tw-animate-css
```

---

## 3. 設定 `components.json` (Base: React Aria, New York Style)

依據 shadcn/ui 官方規範（[components.json 指引](https://ui.shadcn.com/docs/components-json)），在專案根目錄新增 `components.json`，指定 `"style": "new-york"` 與標準目錄映射：

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/client/global.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/client/components",
    "utils": "src/client/utils",
    "ui": "src/client/components/ui",
    "lib": "src/client/utils",
    "hooks": "src/client/hooks"
  }
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

## 5. 配置 `@shadcn/lint` 於 `vite.config.ts` (Oxlint 警告模式)

> [!IMPORTANT]
> **Vite+ 單一配置來源 (SSOT) 與 `@shadcn/lint` 設計系統邊界規範**：
>
> 1. **嚴禁獨立設定檔**：依據 Vite+ 官方指引（[Vite+ Lint Configuration](https://viteplus.dev/llms-full.txt)），**嚴格禁止在專案根目錄或子目錄建立 `.oxlintrc.json` 或 `oxlint.config.ts`**。全站 Oxlint 設定（包含 `jsPlugins`、`settings`、`rules` 與 `overrides`）完全集中在根目錄 `vite.config.ts` 的 `lint` 區塊。
> 2. **`no-restyle` 邊界設計哲學**（參閱 [rules.md](https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md)）：
>    - **原子組件目錄豁免 (`src/client/components/ui/**`)**：在此目錄內，關閉 `shadcn/no-restyle` 與 `shadcn/no-arbitrary-values`，賦予原子組件完整權限自主定義預設外觀、變體樣式與內部佈局。
>    - **外部業務組件嚴格隔離**：外部業務組件（如頁面、業務表單）僅允許傳遞佈局類別（`allow: ["layout"]`，如 `w-full`, `mt-4`, `flex-1`），或透過 `variant` 與 `size` prop 調配樣式，**嚴禁覆蓋組件內部 appearance（如文字顏色、背景色、邊框色、圓角）**。

修改根目錄 `vite.config.ts`，在 `lint` 物件中註冊 `@shadcn/lint` 作為 `jsPlugins`，並配置規則為 `warn` 級別：

```ts
// vite.config.ts
export default defineConfig(({ mode }) => {
  const isTest = mode === "test" || process.env.NODE_ENV === "test";

  return {
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
    },
    lint: {
      ignorePatterns: [
        "dist/**",
        ".cache/**",
        ".tanstack/**",
        ".vitest/**",
        "test-results/**",
        "playwright-report/**",
        "blob-report/**",
        "src/client/routeTree.gen.ts",
      ],
      options: {
        typeAware: true,
        typeCheck: true,
      },
      categories: {
        correctness: "error",
        suspicious: "error",
        perf: "error",
      },
      plugins: ["react", "unicorn", "typescript", "oxc", "vitest", "promise"],
      // 註冊 @shadcn/lint 作為 Oxlint JS Plugin
      jsPlugins: ["@shadcn/lint"],
      settings: {
        shadcn: {
          ui: "src/client/components/ui",
          componentImports: ["^src/client/components/ui(/|$)"],
        },
      },
      rules: {
        "react/react-in-jsx-scope": "off",
        // Phase 2 嚴格配置為 warn，提供即時引導而不阻斷現有構建與測試
        "shadcn/no-restyle": [
          "warn",
          {
            allow: ["layout"],
            contracts: [{ pattern: "^Button$", allow: ["layout"] }],
          },
        ],
        "shadcn/no-raw-colors": "warn",
        "shadcn/no-arbitrary-values": "warn",
        "shadcn/no-inline-styles": "warn",
      },
      overrides: [
        {
          files: ["src/client/components/ui/**"],
          rules: {
            "shadcn/no-restyle": "off",
            "shadcn/no-arbitrary-values": "off",
          },
        },
      ],
    },
    // ... 其餘 fmt, run, environments, plugins, test 保持不變
```

---

## 6. 建置 TanStack Form 欄位橋接與錯誤渲染 (`src/client/components/ui/form.tsx`)

為了實現極致型別安全並消除重複代碼，在 `src/client/components/ui/form.tsx` 中封裝通用欄位佈局與錯誤訊息組件。
請注意：React Aria Components 各輸入組件（`TextField`, `RadioGroup`, `Select`, `NumberField`）各自具備獨立的 ARIA 容器，因此此處提供靈活的 Field 容器與錯誤提取器：

```tsx
import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface FieldItemProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FieldItem({ label, required, error, children, className }: FieldItemProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function getFieldError(field: AnyFieldApi): string | undefined {
  const errors = field.state.meta.errors;
  if (!errors || errors.length === 0) return undefined;
  const first = errors[0];
  return typeof first === "string" ? first : (first as { message?: string })?.message;
}
```

---

## 7. 建置 Toast 通知基礎架構 (`src/client/utils/toast.ts`)

基於 React Aria Components (v1.7+) 的 `UNSTABLE_ToastQueue` 建立全域單例 Toast 發送系統，為後續替換 Antd `message.error()` 與 `message.success()` 提供統一介面：

```tsx
import { UNSTABLE_ToastQueue as ToastQueue } from "react-aria-components";

export interface ToastContent {
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}

export const toastQueue = new ToastQueue<ToastContent>({
  maxVisibleToasts: 5,
});

export const toast = {
  success: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "success" }, { timeout: 4000 }),
  error: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "error" }, { timeout: 5000 }),
  info: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "info" }, { timeout: 4000 }),
};
```

---

## 8. Phase 2 驗收標準 (Acceptance Gate)

執行以下指令驗證基礎建設完整性：

```bash
# 0. 內迴圈單一測試快速驗證 (如金絲雀測試，毫秒級快速確認)
vp test run test/client/canary.test.tsx --reporter=tap-flat --no-color

# 1. 內部驗證：確保型別檢查、Oxlint (載入 @shadcn/lint)、Tailwind 檢查皆順利通過
vpr agent:verify:inner

# 2. 全門禁驗證：確保現有應用與 Phase 1 測試 100% 正常運行
vpr agent:verify:gate
```

驗收合格後，Phase 2 Agent 即可將健全的基礎設施交付給 Phase 3 執行組件批次遷移。

---

## 9. 階段結束確認事項與 Phase 3 啟動指令 (Handover & Next Phase Activation)

### 9.1 移交前確認事項 (Pre-flight Checklist)

請在結束當前 Phase 2 對話前，逐一核對以下檢查項目：

- [ ] 所有相依套件已完成安裝（包含 `class-variance-authority` 與 `@tanstack/react-table`）。
- [ ] 專案根目錄 `components.json` 已正確建立且符合最新 shadcn 規範（`style: "new-york"`, `baseColor: "neutral"`, 無固定 `$schema`）。
- [ ] `src/client/global.css` 已擴充 `@theme` 語意 Token（如 `--color-primary`, `--color-background`, `--color-muted` 等）。
- [ ] `vite.config.ts` 中的 `lint` 區塊已正確配置 `@shadcn/lint` 插件為 `warn` 模式與 `overrides`，專案內無新增 `.oxlintrc.json`，且未破壞原有 linter 行為。
- [ ] `src/client/components/ui/form.tsx` 與 `src/client/utils/toast.ts` 已建立且無型別錯誤。
- [ ] 執行 `vpr agent:verify:inner` 零報錯；執行 `vpr agent:verify:gate` 100% 綠燈通過。
- [ ] 產生英文 Conventional Commit 建議並由使用者在本地終端機完成提交。

### 9.2 Phase 3 啟動 Prompt (供使用者複製至全新 Agent 對話)

```markdown
請擔任前端現代化遷移的 Phase 3 負責 Agent。

請先依序閱讀以下文件以建立上下文與最新 API 真相來源：

1. `docs/migration/README.md`（查閱第 0 節 SSOT 對照表）
2. `docs/migration/phase3_bottom_up_component_migration.md`
3. 使用 `webread` 查閱官方最新真相來源：
   - React Aria: `webread https://react-aria.adobe.com/customization.md#dom-elements`
   - shadcn/ui: `webread https://ui.shadcn.com/docs/components-json`
   - @shadcn/lint: `webread https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md`
   - Vite+: `webread https://viteplus.dev/guide/test.md`
   - TanStack Form: `webread https://tanstack.com/form/latest`

【當前狀態】
Phase 1 測試安全網與 Phase 2 基礎建設（RAC, TanStack Form/Table, cva, @shadcn/lint warn in vite.config.ts）已全數就緒，門禁檢驗 100% 綠燈。

【本次任務目標】
執行 Phase 3「由底而上分批次組件遷移」。
請從 Batch 3.1（核心展示與原子組件：`ui/button.tsx`, `PermissionButton.tsx`, `ui/badge.tsx`, `ui/card.tsx`, `I18nSwitcher.tsx` 與 `routes.tsx` 選單圖示）開始執行。

【執行約束】

- 嚴格落實「一次 3~5 個組件、由底而上」原則。
- 開發時使用 `vp test run <spec> --reporter=tap-flat --no-color` 進行極速單測試反饋。
- 每完成一個 Batch，必須立即在終端機執行 `vpr agent:verify:gate`，確認既有業務功能與 Phase 1 測試零破壞，再進行下一批次（或移交給下一對話）。
```
