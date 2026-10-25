> [!CAUTION]
> **跨 Agent 執行嚴格指令：無論如何都必須先閱讀以下最新官方文件，嚴格禁止依賴模型過往訓練知識！**
>
> 1. **React Aria Components**: https://react-aria.adobe.com/llms.txt
> 2. **shadcn/ui (React Aria Base)**: https://ui.shadcn.com/llms.txt
> 3. **@shadcn/lint (Agent-First Linter)**: https://github.com/shadcn-ui/lint
> 4. **TanStack Form (Type-Safe Forms)**: https://tanstack.com/form/latest

# Phase 1 執行手冊：擴充測試安全網至所有系統行為

## 1. 階段目標與核心理念

本階段為重構的**第一防線**。在修改或安裝任何 UI 組件之前，必須先將既有系統中「尚未有自動化測試覆蓋之使用者行為」用 **Vitest Playwright 瀏覽器測試** 完全覆蓋並鎖死。

任何後續階段的組件遷移，只要引發任何行為倒退（Regression），皆能在此安全網中即時報錯。

---

## 2. 測試規範與撰寫準則

1. **堅持 ARIA 角色與標籤查詢**：
   - 嚴格使用標準無障礙查詢方法：
     - `screen.getByRole("button", { name: ... })`
     - `screen.getByRole("dialog")`
     - `screen.getByLabelText(...)`
     - `screen.getByText(...)`
   - **禁止** 依賴 Antd 特有的 DOM 類名（如 `.ant-btn`, `.ant-input`），確保在後續 Phase 3 換為 React Aria 時，測試腳本零修改即可直接沿用。
2. **測試環境隔離與 Mocking**：
   - 使用現有的 `renderAppAt(path)` 工具與 `window.fetch` mock。
   - 確保每個測試案例具備良好隔離性，執行後自動清理。

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

執行以下指令，所有既有測試與新增之 6 個測試檔案必須全數通過：

```bash
# 執行所有 Client 瀏覽器測試
vpr agent:test:e2e
```

當 `agent:test:e2e` 顯示所有案例（預計 35+ 個 E2E 測試）100% 通過時，Phase 1 即告完成，可平順移交給 Phase 2 Agent。
