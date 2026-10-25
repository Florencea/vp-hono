> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先閱讀以下最新官方文件，嚴格禁止依賴模型過往訓練知識！**
>
> 1. **React Aria Components**: https://react-aria.adobe.com/llms.txt
> 2. **shadcn/ui (React Aria Base)**: https://ui.shadcn.com/llms.txt
> 3. **@shadcn/lint (Agent-First Linter)**: https://github.com/shadcn-ui/lint
> 4. **TanStack Form (Type-Safe Forms)**: https://tanstack.com/form/latest

# 前端現代化遷移指引與跨 Agent 協作協議

本目錄（`docs/migration/`）為專案前端從 **Ant Design v6** 遷移至 **React Aria Components + TanStack Form + lucide-react + @shadcn/lint** 的臨時執行指引。
本目錄內容僅在遷移期間保留，**在 Phase 4 完成且驗收通過後將予以全數刪除**。

---

## 1. 跨 Agent 協作工作協議 (Agent Protocol)

由於本遷移專案工作量較大、分為多個階段執行，為了避免長對話中的上下文漂移（Context Drift），每個階段應由獨立的 Agent 對話負責：

1. **強制閱讀最新文件**：接手任何階段的 Agent，在開始執行任何代碼更動前，**必須使用 `webread` 閱讀上方 4 大官方最新文件**，切勿憑模型內部的過期記憶推論 API。
2. **遵守階段邊界**：每個 Agent 僅專注於當前階段的目標，不可跨階段執行（例如 Phase 1 Agent 不得安裝套件或更動 UI 組件）。
3. **門禁不變性**：每個階段在宣告完成前，必須在終端機執行對應的驗證指令，確保所有單元與 E2E 測試 100% 通過：
   ```bash
   vpr agent:verify:inner
   vpr agent:verify:gate
   ```
4. **Git 協議**：依照本專案 `AGENTS.md` 規範，AI Agent **嚴禁直接執行 `git commit`**，請使用 `git add <files>` 並輸出推薦的英文 Conventional Commit 訊息供使用者本地執行。

---

## 2. 遷移文件索引 (Document Index)

- 🌐 [Master Plan：前端全面遷移主實施計畫](./master_migration_plan.md)
  - 全景技術選型、架構演進圖、效能指標基準與不可破壞之門禁指令。
- 🛡️ [Phase 1 執行手冊：擴充測試安全網至所有系統行為](./phase1_test_harness_expansion.md)
  - 核心目標：在觸碰任何 UI 前，透過 Vitest Playwright 擴充 6 大行為測試（i18n 切換、登出流轉、佈局收合、表單驗證防呆、API 錯誤攔截、403 導航），鎖死所有系統行為。
- 🏗️ [Phase 2 執行手冊：設計系統基礎建設與 @shadcn/lint 導入](./phase2_design_system_and_linter_setup.md)
  - 核心目標：安裝 RAC、TanStack Form、lucide、@shadcn/lint；建立 `components.json`；擴充 Tailwind v4 色彩 Token；將 Linter 設為 `warn` 模式；封裝基礎 Form 橋接層。
- 🧱 [Phase 3 執行手冊：由底而上分批次組件遷移](./phase3_bottom_up_component_migration.md)
  - 核心目標：嚴格依循由底而上、一次 3~5 個組件的原則，分 5 個批次替換組件並維持每批次 E2E 測試全綠：
    - Batch 3.1: 核心原子與展示類 (Button, PermissionButton, Badge, Card, I18nSwitcher)
    - Batch 3.2: 基礎輸入組件與登入頁 (TextField, PasswordInput, RadioGroup, Select, Login 頁)
    - Batch 3.3: 彈窗、抽屜與確認浮層 (DataModal, DataDrawer, Popconfirm, Toast)
    - Batch 3.4: 數據表格與階層選擇器 (DataTable, TreeSelect, DepartmentTreeTable)
    - Batch 3.5: 頁面佈局與各模組重構 (Layout, User 頁, Role 頁, Department 頁, 403/看板)
- 🧹 [Phase 4 執行手冊：嚴格守門、清理與文檔收尾](./phase4_enforcement_and_cleanup.md)
  - 核心目標：將 `@shadcn/lint` 提升為 `error`；卸載 `antd` 與 `@ant-design/icons`；刪除遺留 theme bridge 與舊表單 hook；更新 `AGENTS.md`、規則與技能文檔；刪除 `docs/migration/`。
