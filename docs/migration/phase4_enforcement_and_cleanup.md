> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先閱讀以下最新官方文件，嚴格禁止依賴模型過往訓練知識！**
>
> 1. **React Aria Components**: https://react-aria.adobe.com/llms.txt
> 2. **shadcn/ui (React Aria Base)**: https://ui.shadcn.com/llms.txt
> 3. **@shadcn/lint (Agent-First Linter)**: https://github.com/shadcn-ui/lint
> 4. **TanStack Form (Type-Safe Forms)**: https://tanstack.com/form/latest
> 5. **Vite+ (Unified Web Toolchain)**: https://viteplus.dev/llms-full.txt

# Phase 4 執行手冊：嚴格守門、清理與文檔收尾

## 1. 階段目標與核心理念

本階段為遷移的**終章收尾工程**。目標是將設計系統約束提升為不可逾越的硬性防線（Hard Gate），徹底移除所有 Ant Design 的遺留套件與過渡代碼，並全面更新專案規格文檔，確保未來的開發者與 AI Agent 完全依循全新架構前進。

---

## 2. 升級 `vite.config.ts` 中的 `@shadcn/lint` 規則為 `error`

依據 Vite+ 規範（SSOT 集中於 `vite.config.ts`），修改專案根目錄 `vite.config.ts` 的 `lint` 區塊，將所有 `@shadcn/lint` 設計系統規則由 `warn` 正式提升為強制報錯 (`error`)，構築無法逾越的防線：

```ts
// vite.config.ts
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
      jsPlugins: ["@shadcn/lint"],
      settings: {
        shadcn: {
          ui: "src/client/components/ui",
          componentImports: ["^src/client/components/ui(/|$)"],
        },
      },
      rules: {
        "react/react-in-jsx-scope": "off",
        // Phase 4 升級為 error：全面禁止任意樣式破壞與未授權覆寫
        "shadcn/no-restyle": [
          "error",
          {
            allow: ["layout"],
            contracts: [
              { pattern: "^Button$", allow: ["layout"] },
              { pattern: "^CardContent$", allow: ["layout", "spacing"] },
            ],
          },
        ],
        "shadcn/no-raw-colors": "error",
        "shadcn/no-arbitrary-values": "error",
        "shadcn/no-inline-styles": "error",
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
```

---

## 3. 卸載舊依賴與清理過渡代碼

### 3.1 卸載套件

```bash
vp remove antd @ant-design/icons
```

### 3.2 刪除廢棄檔案

- 刪除舊表單 Hook：`src/client/hooks/useAntdForm.ts`。

### 3.3 清理 `src/client/hooks/useI18n.ts`

- 移除 Antd 語系型別與字典引入：
  - 移除 `import type { Locale } from "antd/es/locale"`。
  - 移除 `import antdEnUS` 與 `import antdZhTW`。
  - 移除 `antdLocales` 物件常數，使 i18n 系統純粹維護專案自主語系。

### 3.4 簡化 `src/client/theme.ts`

- 移除 `ThemeConfig`、`createAntdTheme`、`useAntdTheme` 與動態 `MutationObserver` 監聽。
- 全站色彩完全回歸純 Tailwind v4 CSS 變數，零運行時成本。

### 3.5 簡化 `src/client/providers.tsx`

- 移除 `AntdProvider`、`ConfigProvider` 與 Antd 的 `<App>` 上下文包裝。
- 掛載 `<ToastRegion queue={toastQueue} />`（引用自 `src/client/utils/toast.ts`），確保全域錯誤攔截與操作回饋通知正常彈出。

### 3.6 適配 Canary 測試 (`test/client/canary.test.tsx`)

- 將原本測試「`SSOT Token Bridge: Tailwind --color-primary bridges into Antd primary button background`」更新為測試 RAC Button：
  - 斷言以純 Tailwind v4 `--color-primary` 渲染的登入送出按鈕背景色依然精準符合 `rgb(47, 84, 235)`。
  - 確保 Phase 4 門禁執行 `vpr agent:test:e2e` 時 100% 綠燈。

### 3.7 清理臨時遷移目錄

- 在通過驗收後，刪除 `docs/migration/` 整個目錄：
  ```bash
  rm -rf docs/migration
  ```

---

## 4. 全面更新專案規範文檔

必須更新以下專案指南與規範，確保與新架構對齊：

1. **`AGENTS.md`**：
   - 架構映射表：將 Frontend UI 改為 `React Aria Components + TanStack Form + Tailwind CSS v4`。
   - 核心不變性：載明表單採用 TanStack Form、設計約束採用 `@shadcn/lint`。
2. **`.agents/rules/ui-styling.md`**：
   - 移除所有關於 Ant Design 6 的舊規範。
   - 新增 React Aria Components 規範、TanStack Form 欄位封裝規範與 `@shadcn/lint` 禁制清單。
3. **`.agents/skills/scaffold-feature/SKILL.md`**：
   - 更新鷹架腳本產生的客戶端範本，改為產生基於 TanStack Form + RAC 的頁面與彈窗。

---

## 5. 終極全門禁驗收 (Final Gate Verification)

在交付給使用者前，Agent 必須執行完整的門禁驗收指令：

```bash
# 1. 驗證所有型別與 Linter (此時 @shadcn/lint 為 error，必須 0 報錯)
vpr agent:verify:inner

# 2. 驗證死代碼檢測 (確保 antd 已徹底移除且無殘留無用引用)
vpr check:deadcode

# 3. 執行全套單元、合約與瀏覽器 E2E 測試
vpr agent:test:unit
vpr agent:test:e2e

# 4. 全門禁構建與測試
vpr agent:verify:gate
```

當所有指令順利通過，Client JS 打包體積降至預期水準，且無任何警告與錯誤時，宣告本次前端現代化重構圓滿完成！

---

## 6. 完工驗收確認事項與總結指引 (Final Completion Checklist & Wrap-up)

### 6.1 完工驗收確認清單 (Final Acceptance Checklist)

請在宣告整個重構專案結束前，逐一核對以下終極清單：

- [ ] `vite.config.ts` 中的 `@shadcn/lint` 規則已提升為 `error`，專案內無任何 `.oxlintrc.json` 殘留，且 `vpr agent:verify:inner` 0 報錯。
- [ ] `package.json` 中的 `antd` 與 `@ant-design/icons` 已徹底卸載。
- [ ] `src/client/hooks/useAntdForm.ts` 已刪除。
- [ ] `src/client/hooks/useI18n.ts` 已移除 `antdLocales` 與 Antd 語系引入。
- [ ] `src/client/theme.ts` 已簡化，移除 Antd 主題橋接與 MutationObserver。
- [ ] `src/client/providers.tsx` 已移除 `AntdProvider`、`ConfigProvider`、`App`，並掛載 `ToastRegion`。
- [ ] `test/client/canary.test.tsx` 已適配 RAC Button 且全套 E2E 測試 100% 通過。
- [ ] `AGENTS.md`、`.agents/rules/ui-styling.md` 與 `.agents/skills/scaffold-feature/SKILL.md` 已全面更新。
- [ ] 執行 `vpr check:deadcode` (Knip) 0 未使用依賴。
- [ ] 執行 `vpr agent:verify:gate` 通過（單元測試、打包構建與瀏覽器 E2E 全綠）。
- [ ] 執行 `rm -rf docs/migration` 徹底刪除臨時遷移手冊目錄。
- [ ] 產生英文 Conventional Commit 建議並由使用者在本地終端機完成最終提交。

### 6.2 完工總結輸出模板 (Completion Summary Output)

完成上述檢查後，請輸出繁體中文的完工總結，向使用者彙報：

1. **依賴與體積變化**：呈現卸載 antd 後 Client Chunk 體積的縮減數據。
2. **門禁驗收成果**：列出 `vpr agent:verify:gate` 與 `knip` 的 100% 通過證明。
3. **規範與文檔狀態**：說明 `AGENTS.md` 與技能文檔已正式對齊最新架構。
