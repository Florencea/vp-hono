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

## 0. 官方最新真相來源 (SSOT) 與查閱規範

| 框架 / 工具               | 官方最新真相來源 (SSOT URL)                                                                                                                                                             | 關鍵查閱重點 (Verification Focus)                                                                                                                                                                                         | 查閱指令範例                                                                  |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| **React Aria Components** | `https://react-aria.adobe.com/llms.txt`<br/>`https://react-aria.adobe.com/customization.md`<br/>`https://react-aria.adobe.com/styling.md`<br/>`https://react-aria.adobe.com/testing.md` | 官方標準 **`render` prop**（取代舊版自訂標籤或脆弱 wrapper）；`composeRenderProps` 樣式合併；Tailwind v4 短修飾字（`selected:`, `pressed:`, `entering:`, `exiting:`）；`hidden="until-found"` 支援；Popover `placement`。 | `webread https://react-aria.adobe.com/customization.md#dom-elements`          |
| **shadcn/ui**             | `https://ui.shadcn.com/llms.txt`<br/>`https://ui.shadcn.com/docs/components-json`<br/>`https://ui.shadcn.com/docs/tailwind-v4`                                                          | New York 風格（`"style": "new-york"`）；標準 `src/components/ui/` 原子原語目錄分層；CVA (`class-variance-authority`) 與 `cn` 變體管理模式；外觀與行為責任分離。                                                           | `webread https://ui.shadcn.com/docs/components-json`                          |
| **`@shadcn/lint`**        | `https://github.com/shadcn-ui/lint`<br/>`https://raw.githubusercontent.com/shadcn-ui/lint/main/SETUP.md`<br/>`https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md`      | `no-restyle` 邊界：`src/components/ui/**` 豁免（允許原子組件自主樣式定義）；外部業務組件僅傳遞佈局類別（`allow: ["layout"]`）或使用 variant/size，禁止覆蓋組件內部 appearance。                                           | `webread https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md` |
| **Vite+**                 | `https://viteplus.dev/llms-full.txt`<br/>`https://viteplus.dev/guide/lint.md`<br/>`https://viteplus.dev/guide/test.md`                                                                  | 原生 `vp` / `vpx` / `vpr` 工具鏈；單測試執行指令（`vp test run <spec> --reporter=tap-flat --no-color`）；`vite.config.ts` SSOT 零額外配置（**嚴禁建立 `.oxlintrc.json`**）；毫秒級 Vite Task 快取重放。                   | `webread https://viteplus.dev/guide/test.md`                                  |
| **TanStack Form**         | `https://tanstack.com/form/latest`                                                                                                                                                      | 端到端型別安全表單綁定；Zod Validator 適配；欄位狀態與錯誤提取 (`field.state.meta.errors`)；與 RAC 輸入組件的受控與無障礙橋接。                                                                                           | `webread https://tanstack.com/form/latest`                                    |

---

# Phase 1 執行手冊：擴充測試安全網至所有系統行為

## 1. 階段目標與核心理念

本階段為重構的**第一防線**。在修改或安裝任何 UI 組件之前，必須先將既有系統中「尚未有自動化測試覆蓋之使用者行為」用 **Vitest Playwright 瀏覽器測試** 完全覆蓋並鎖死。

任何後續階段的組件遷移，只要引發任何行為倒退（Regression），皆能在此安全網中即時報錯。

---

## 2. 測試規範與撰寫準則

1. **堅持 ARIA 角色與標籤查詢（參考 [React Aria 官方測試指引](https://react-aria.adobe.com/testing.md)）**：
   - 嚴格使用標準無障礙查詢方法：
     - `screen.getByRole("button", { name: ... })`
     - `screen.getByRole("dialog")`
     - `screen.getByLabelText(...)`
     - `screen.getByText(...)`
   - **禁止** 依賴 Antd 特有的 DOM 類名（如 `.ant-btn`, `.ant-input`），確保在後續 Phase 3 換為 React Aria 時，測試腳本零修改即可直接沿用。
2. **測試環境隔離與 Mocking**：
   - 使用現有的 `renderAppAt(path)` 工具與 `window.fetch` mock。
   - 確保每個測試案例具備良好隔離性，執行後自動清理。
3. **內迴圈單一測試快速除錯**：
   - 撰寫與調試測試案例時，善用 Vite+ 單測試指令 `vp test run <spec> --reporter=tap-flat --no-color` 獲得毫秒級反饋。

---

## 3. 本階段需新增的測試模組清單

### 3.1 語系即時切換測試 (`test/client/e2e-i18n.test.tsx`)

- **行為驗證**：
  1. 使用者點擊 Header 上的 `I18nSwitcher` 語言圖示。
  2. 展開語系選單，由目前語系切換為另一語系（例如繁體中文 -> English）。
  3. 驗證全站 UI 標籤即時更新（如 Header 上的「登出」變為「Logout」、表格標題即時更動），不發生整頁 Reload。

### 3.2 認證流轉與登出測試 (`test/client/e2e-auth-flow.test.tsx`)

> [!WARNING]
> **Playwright 瀏覽器測試環境注意事項（重要避坑指引）**：
> 現有 `src/client/hooks/useAuth.ts` 在登入與登出成功時會執行 `window.location.reload()`。
> 在 Vitest Playwright 瀏覽器測試中，若未攔截原生 reload，會導致測試執行器頁面重載而中斷測試。
> 撰寫本測試時，**必須** 使用 `vi.spyOn(window.location, "reload").mockImplementation(() => {})` 攔截，並驗證以下流程：

- **行為驗證**：
  1. 登入狀態下，點擊 Header 的「登出」按鈕。
  2. 驗證發出 `POST /api/auth/logout` 請求。
  3. 驗證 `window.location.reload` 或導航被觸發，重新以未登入狀態渲染時，路由處於 `/login` 頁面，且 Header 與側邊導航選單正確隱藏。
  4. 在 `/login` 頁面輸入帳號密碼並點擊送出按鈕，驗證發出 `POST /api/auth/login` 請求且負載符合 `LoginReqSchema`。

### 3.3 佈局與側邊欄互動測試 (`test/client/e2e-layout.test.tsx`)

- **行為驗證**：
  1. 驗證應用程式頂部呈現 Logo 與系統標題 (`APP_TITLE`)。
  2. 點擊側邊欄收合觸發器，驗證側邊欄在收合與展開狀態下的寬度變化與狀態變更。
  3. 點擊不同選單項目（使用者管理、角色管理、部門管理），驗證 URL 路由與頁面內容即時切換。

### 3.4 表單驗證錯誤與無障礙反饋測試 (`test/client/e2e-form-validation.test.tsx`)

- **行為驗證**（全數使用無障礙角色與文字定位，嚴禁依賴 `.ant-*` 類名）：
  1. **UserModal**：打開新增人員彈窗，故意留空必填欄位並點擊確認，驗證客戶端攔截提交、不發送網路請求，並在 DOM 中以 `screen.getByText(/required|請輸入/i)` 捕捉可辨識的錯誤訊息文字。
  2. **RoleDrawer**：打開新增角色抽屜，輸入不符合規範的代碼或留空，驗證表單觸發錯誤提示。
  3. **DepartmentModal**：驗證名稱留空時的表單防呆。

### 3.5 全域 API 異常攔截與通知測試 (`test/client/e2e-error-boundary.test.tsx`)

- **行為驗證**：
  1. Mock 後端 API 回傳 HTTP 500 或 400 錯誤。
  2. 觸發該操作，驗證 React Query 的 `QueryCache` / `MutationCache` 正確捕捉錯誤。
  3. 透過通用標準斷言 `screen.getByText(errorMessage)` 驗證畫面上彈出包含錯誤描述的通知浮層（Phase 1 為 Antd message，Phase 3 會無縫切換為 RAC Toast，保持測試 100% 相容）。

### 3.6 403 權限拒絕頁面流轉測試 (`test/client/e2e-403.test.tsx`)

- **行為驗證**：
  1. 直接訪問 `/403`。
  2. 驗證頁面渲染 403 禁止訪問之標題與描述資訊。
  3. 點擊「返回首頁」按鈕，驗證成功透過 TanStack Router 導回首頁 `/`。

---

## 4. Phase 1 驗收標準 (Acceptance Gate)

在開發與最終驗收時，請依循以下指令：

```bash
# 1. 內迴圈單一測試快速除錯 (以 i18n 測試為例，毫秒級快速回饋)
vp test run test/client/e2e-i18n.test.tsx --reporter=tap-flat --no-color

# 2. 執行所有 Client 瀏覽器測試
vpr agent:test:e2e
```

當 `agent:test:e2e` 顯示所有案例（預計 35+ 個 E2E 測試）100% 通過時，Phase 1 即告完成，可平順移交給 Phase 2 Agent。

---

## 5. 階段結束確認事項與 Phase 2 啟動指令 (Handover & Next Phase Activation)

### 5.1 移交前確認事項 (Pre-flight Checklist)

請在結束當前 Phase 1 對話前，逐一核對以下檢查項目：

- [x] 6 個新增測試檔案皆已建立且符合標準 ARIA 角色與標籤查詢模式（嚴禁依賴 `.ant-*` 特有類名）。
- [x] 認證測試已正確 Mock `window.location.reload`，測試執行期間無瀏覽器重新載入之崩潰現象。
- [x] 執行 `vpr agent:test:e2e`，確保所有既有與新增測試 100% 通過（零失敗、零跳過）。
- [x] 執行 `git status` 確認本階段未更動任何 `src/client/` 業務代碼與 UI 組件（嚴守 Phase 1 階段邊界）。
- [x] 執行 `vpx oxfmt test/client` 確保新增的測試腳本排版格式合規。
- [x] 產生英文 Conventional Commit 建議並由使用者在本地終端機完成提交。

### 5.2 Phase 2 啟動 Prompt (供使用者複製至全新 Agent 對話)

```markdown
請擔任前端現代化遷移的 Phase 2 負責 Agent。

請先依序閱讀以下文件以建立上下文與最新 API 真相來源：

1. `docs/migration/README.md`（查閱第 0 節 SSOT 對照表）
2. `docs/migration/phase2_design_system_and_linter_setup.md`
3. 使用 `webread` 查閱官方最新真相來源：
   - React Aria: `webread https://react-aria.adobe.com/customization.md#dom-elements`
   - shadcn/ui: `webread https://ui.shadcn.com/docs/components-json`
   - @shadcn/lint: `webread https://raw.githubusercontent.com/shadcn-ui/lint/main/docs/rules.md`
   - Vite+: `webread https://viteplus.dev/guide/test.md`
   - TanStack Form: `webread https://tanstack.com/form/latest`

【當前狀態】
Phase 1 測試安全網已完全建立，所有 Playwright E2E 瀏覽器測試皆 100% 通過。

【本次任務目標】
執行 Phase 2 設計系統基礎建設與 @shadcn/lint 導入：

1. 安裝核心運行時套件（`react-aria-components`, `@internationalized/date`, `lucide-react`, `@tanstack/react-form`, `@tanstack/react-table`, `class-variance-authority`）與開發工具（`@shadcn/lint`, `tw-animate-css`）。
2. 建立根目錄 `components.json`（Base: aria）。
3. 擴充 `src/client/global.css` 中的 `@theme` 語意色彩 Token。
4. 在 `vite.config.ts` 的 `lint` 區塊中配置 `@shadcn/lint` 為 `warn` 模式（包含 jsPlugins, settings 與 overrides，嚴禁建立獨立 .oxlintrc.json）。
5. 建置健全的 TanStack Form 欄位橋接層 (`src/client/components/ui/form.tsx`) 與 Toast 全域單例 (`src/client/utils/toast.ts`)。

【執行約束】

- 嚴格遵守 Phase 2 邊界：不得修改既有 Antd 業務頁面。
- 完成後必須執行 `vpr agent:verify:inner` 與 `vpr agent:verify:gate`，確保現有功能與 Phase 1 測試 100% 綠燈。
```
