> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先閱讀以下最新官方文件，嚴格禁止依賴模型過往訓練知識！**
>
> 1. **React Aria Components**: https://react-aria.adobe.com/llms.txt
> 2. **shadcn/ui (React Aria Base)**: https://ui.shadcn.com/llms.txt
> 3. **@shadcn/lint (Agent-First Linter)**: https://github.com/shadcn-ui/lint
> 4. **TanStack Form (Type-Safe Forms)**: https://tanstack.com/form/latest

# Phase 4 執行手冊：嚴格守門、清理與文檔收尾

## 1. 階段目標與核心理念

本階段為遷移的**終章收尾工程**。目標是將設計系統約束提升為不可逾越的硬性防線（Hard Gate），徹底移除所有 Ant Design 的遺留套件與過渡代碼，並全面更新專案規格文檔，確保未來的開發者與 AI Agent 完全依循全新架構前進。

---

## 2. 升級 `@shadcn/lint` 規則為 `error`

修改 `.oxlintrc.json`，將所有警告級別提升為強制報錯：

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
      "error",
      {
        "allow": ["layout"],
        "contracts": [
          { "pattern": "^Button$", "allow": ["layout"] },
          { "pattern": "^CardContent$", "allow": ["layout", "spacing"] }
        ]
      }
    ],
    "shadcn/no-raw-colors": "error",
    "shadcn/no-arbitrary-values": "error",
    "shadcn/no-inline-styles": "error"
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

## 3. 卸載舊依賴與清理過渡代碼

### 3.1 卸載套件

```bash
vp remove antd @ant-design/icons
```

### 3.2 刪除廢棄檔案

- 刪除 `src/client/hooks/useAntdForm.ts`。

### 3.3 簡化 `src/client/theme.ts`

- 移除 `createAntdTheme`、`useAntdTheme`、`MutationObserver` 監聽。
- 全站色彩完全回歸純 Tailwind v4 CSS 變數，零運行時成本。

### 3.4 簡化 `src/client/providers.tsx`

- 移除 `ConfigProvider`、`antdLocales` 與 Antd 的 `<App>` 上下文包裝。

### 3.5 清理臨時遷移目錄

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
