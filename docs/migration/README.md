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

# 前端現代化遷移指引與跨 Agent 協作協議

本目錄（`docs/migration/`）為專案前端從 **Ant Design v6** 遷移至 **React Aria Components + TanStack Form + lucide-react + @shadcn/lint** 的臨時執行指引。
本目錄內容僅在遷移期間保留，**在 Phase 4 完成且驗收通過後將予以全數刪除**。

---

## 1. 跨 Agent 協作工作協議 (Agent Protocol)

由於本遷移專案工作量較大、分為多個階段執行，為了避免長對話中的上下文漂移（Context Drift），每個階段應由獨立的 Agent 對話負責：

1. **強制查閱最新 SSOT 文件與驗證重點**：接手任何階段的 Agent，在開始執行任何代碼更動前，**必須使用 `webread` 查閱上方對照表中的官方最新文件與重點章節**，切勿憑過期記憶推論 API。特別注意 Vite+ 工具鏈規範，所有靜態分析與 Linter 設定必須嚴格維持在 `vite.config.ts` 集中式管理，禁止擅自建立 `.oxlintrc.json` 等多餘設定檔。
2. **遵守階段邊界**：每個 Agent 僅專注於當前階段的目標，不可跨階段執行（例如 Phase 1 Agent 不得安裝套件或更動 UI 組件）。
3. **門禁不變性與高效除錯**：
   - 開發過程針對特定功能或組件測試，請善用 Vite+ 單測試指令進行極速反饋：
     ```bash
     vp test run <spec-path> --reporter=tap-flat --no-color
     ```
   - 每個階段在宣告完成前，必須在終端機執行對應的驗證指令，確保所有單元與 E2E 測試 100% 通過：
     ```bash
     vpr agent:verify:inner
     vpr agent:verify:gate
     ```
4. **Git 協議**：依照本專案 `AGENTS.md` 規範，AI Agent **嚴禁直接執行 `git commit`**，請使用 `git add <files>` 並輸出推薦的英文 Conventional Commit 訊息供使用者本地執行。
5. **跨階段移交與啟動協議**：每個階段（與 Phase 3 的每個 Batch）手冊末尾均已附上**移交前確認事項 (Pre-flight Checklist)** 與**下一階段/批次啟動 Prompt (Next Phase/Batch Activation Prompt)**。當前階段 Agent 完成任務並核對清單後，使用者即可開啟全新對話視窗並直接複製該 Prompt，確保零上下文漂移。

---

## 2. 遷移文件索引 (Document Index)

- 🌐 [Master Plan：前端全面遷移主實施計畫](./master_migration_plan.md)
  - 全景技術選型、架構演進圖、效能指標基準與不可破壞之門禁指令。
- 🛡️ [Phase 1 執行手冊：擴充測試安全網至所有系統行為](./phase1_test_harness_expansion.md)
  - 核心目標：在觸碰任何 UI 前，透過 Vitest Playwright 擴充 6 大行為測試（i18n 切換、登出流轉、佈局收合、表單驗證防呆、API 錯誤攔截、403 導航），鎖死所有系統行為。
- 🏗️ [Phase 2 執行手冊：設計系統基礎建設與 @shadcn/lint 導入](./phase2_design_system_and_linter_setup.md)
  - 核心目標：安裝 RAC、TanStack Form、lucide、@shadcn/lint；建立 `components.json`；擴充 Tailwind v4 色彩 Token；在 `vite.config.ts` 將 `@shadcn/lint` 設為 `warn` 模式（集中式配置，不新增 `.oxlintrc.json`）；封裝基礎 Form 橋接層。
- 🧱 [Phase 3 執行手冊：由底而上分批次組件遷移](./phase3_bottom_up_component_migration.md)
  - 核心目標：嚴格依循由底而上、一次 3~5 個組件的原則，分 5 個批次替換組件並維持每批次 E2E 測試全綠：
    - Batch 3.1: 核心原子與展示類 (Button, PermissionButton, Badge, Card, I18nSwitcher 與 `routes.tsx` 選單圖示)
    - Batch 3.2: 基礎輸入組件與登入頁 (TextField/TextArea, PasswordInput, NumberField, RadioGroup, Login 頁)
    - Batch 3.3: 選擇器、浮層與反饋系統 (Select/MultiSelect, DataModal, DataDrawer, Popconfirm, Toast 系統)
    - Batch 3.4: 樹狀結構與數據表格 (Tree 權限樹, TreeSelect 選擇器, DataTable, DepartmentTreeTable)
    - Batch 3.5: 頁面佈局與各模組重構 (Layout, Department 模組, Role 模組, User 模組, 403 與看板空狀態)
- 🧹 [Phase 4 執行手冊：嚴格守門、清理與文檔收尾](./phase4_enforcement_and_cleanup.md)
  - 核心目標：在 `vite.config.ts` 將 `@shadcn/lint` 提升為 `error`；卸載 `antd` 與 `@ant-design/icons`；清理 `useAntdForm.ts`、`useI18n.ts`、`theme.ts` 與 `providers.tsx`；更新 `canary.test.tsx`；全面更新 `AGENTS.md`、規則與技能文檔；刪除 `docs/migration/`。
