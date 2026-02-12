# .NET 6 Blazor Form Application

## 專案說明

此專案為符合以下需求的 .NET Blazor 表單系統：

### 專案環境
- 使用 .NET 8（專案結構與 .NET 6 相容，可依需求調整 TargetFramework）
- 使用 Blazor 語法（Razor Page 形式）
- 頁面為 .cshtml
- `@page` 上方不加任何路徑或參數（只寫 `@page`）
- 前端與後端程式碼全部寫在同一支 cshtml 裡（不拆成 code-behind）
- 專案可與 ASPX 混用，相容既有 WebForm 邏輯

### 系統性質
- 內網系統
- 主要為表單型系統（新增/修改/查詢/明細）
- 版面簡單清楚，不使用過度前端框架

### 登入者資訊取得方式
使用統一的方法取得登入者資料：
```csharp
var who = GetEmpNo(Request.Query);
```

## 專案結構

```
BlazorFormApp/
├── Pages/
│   ├── Index.cshtml       # 查詢列表頁面
│   ├── Detail.cshtml      # 明細頁面
│   ├── Edit.cshtml        # 新增/編輯頁面
│   ├── Create.cshtml      # 新增頁面（導向 Edit）
│   └── _ViewImports.cshtml
├── wwwroot/
│   └── site.css
├── AuthHelper.cs          # 登入者資訊取得工具
├── Program.cs
├── appsettings.json
└── BlazorFormApp.csproj
```

## 功能說明

### 1. 查詢列表頁面 (Index.cshtml)
- 顯示商品列表
- 提供搜尋功能
- 可連結至明細、編輯、新增功能

### 2. 明細頁面 (Detail.cshtml)
- 顯示單筆商品完整資訊
- 可連結至編輯功能

### 3. 新增/編輯頁面 (Edit.cshtml)
- 同一頁面處理新增與編輯
- 包含表單驗證
- 顯示成功/錯誤訊息

### 4. 登入者資訊取得 (AuthHelper.cs)
- 提供 `GetEmpNo(IQueryCollection query)` 方法
- 從 Query String 取得登入者員工編號

## 如何執行

### 前置需求
- .NET 6.0 SDK 或更高版本（專案使用 .NET 8，但結構與 .NET 6 相容）

### 執行步驟

1. 進入專案目錄
```bash
cd BlazorFormApp
```

2. 還原套件
```bash
dotnet restore
```

3. 執行專案
```bash
dotnet run
```

4. 開啟瀏覽器訪問
```
http://localhost:5000
```

### 測試登入者資訊
在任何頁面的 URL 後加上 `?empNo=YOUR_EMP_NO` 來模擬登入者：
```
http://localhost:5000?empNo=EMP001
http://localhost:5000/Detail?id=P001&empNo=EMP001
```

## 技術特點

1. **單一檔案架構**：所有頁面的前端與後端程式碼都在同一個 .cshtml 檔案中
2. **@functions 區塊**：使用 `@functions` 區塊定義 PageModel 和相關類別
3. **內嵌 CSS**：樣式直接寫在頁面中，保持簡單清楚
4. **統一驗證**：使用 `AuthHelper.GetEmpNo()` 方法統一取得登入者資訊
5. **表單驗證**：包含基本的前端與後端驗證

## 擴展說明

### 資料庫整合
目前使用假資料示範，實際使用時可：
1. 在 Program.cs 註冊資料庫服務（如 Entity Framework Core）
2. 在各頁面的 @functions 中注入資料庫服務
3. 將假資料替換為實際資料庫查詢

### 與 ASPX/WebForms 混用
此架構可與既有的 ASPX 頁面共存：
1. 將 Blazor 頁面放在特定目錄下
2. ASPX 頁面保持在原有位置
3. 共用相同的驗證機制（GetEmpNo）

### 增加更多功能
可依需求新增：
- 刪除功能
- 匯出功能
- 批次操作
- 更複雜的查詢條件

## 注意事項

1. 所有頁面都使用 `@page` 指令，不加任何路徑參數
2. 登入者資訊一律使用 `AuthHelper.GetEmpNo(Request.Query)` 取得
3. 不使用 code-behind 檔案，所有程式碼都在 .cshtml 中
4. 樣式保持簡單實用，不依賴複雜的前端框架
