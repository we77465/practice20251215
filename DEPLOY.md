# 部署到 Railway.app 指南

## 前置準備

1. 註冊 [Railway](https://railway.app) 帳號
2. 安裝 [Railway CLI](https://docs.railway.app/develop/cli)（可選）
3. 將專案推送到 GitHub

## 步驟一：建立專案

1. 登入 Railway Dashboard
2. 點擊 **New Project**
3. 選擇 **Deploy from GitHub repo**
4. 授權並選擇你的 `reptile-shop` repository

## 步驟二：新增 PostgreSQL 資料庫

1. 在專案中點擊 **New**
2. 選擇 **Database** → **Add PostgreSQL**
3. Railway 會自動建立資料庫並生成連線字串

## 步驟三：部署後端

1. 點擊 **New** → **GitHub Repo**
2. 選擇 repository，設定 Root Directory 為 `backend`
3. 加入環境變數：

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=隨機產生一個安全的密鑰
JWT_SECRET_KEY=隨機產生另一個密鑰
FLASK_ENV=production
```

4. Railway 會自動偵測 Dockerfile 並部署

## 步驟四：部署前端

1. 再次點擊 **New** → **GitHub Repo**
2. 選擇同一 repository，Root Directory 設為 `frontend`
3. 加入環境變數：

```
VITE_API_URL=https://your-backend-service.railway.app/api
```

4. 等待建置完成

## 步驟五：初始化資料庫

部署完成後，進入後端服務的 Shell：

```bash
railway run python seed_data.py
```

或透過 Railway Dashboard 的 **Shell** 功能執行。

## 步驟六：設定網域

1. 在前端服務設定中找到 **Settings** → **Domains**
2. 點擊 **Generate Domain** 取得 `*.railway.app` 網域
3. 或設定自訂網域

## 環境變數說明

| 變數 | 說明 | 範例 |
|------|------|------|
| DATABASE_URL | PostgreSQL 連線字串 | 由 Railway 自動生成 |
| SECRET_KEY | Flask 密鑰 | 使用 `python -c "import secrets; print(secrets.token_hex(32))"` 產生 |
| JWT_SECRET_KEY | JWT 簽名密鑰 | 同上 |
| VITE_API_URL | 後端 API 網址 | `https://xxx.railway.app/api` |

## 常見問題

### 資料庫連線失敗
確認 `DATABASE_URL` 環境變數正確設定，並使用 `${{Postgres.DATABASE_URL}}` 語法連結。

### 前端無法呼叫 API
1. 確認 `VITE_API_URL` 設定正確
2. 確認後端服務已啟動
3. 檢查 CORS 設定

### 建置失敗
查看 Railway 的 Build Logs 找出錯誤原因。

## 費用

Railway 提供每月 $5 的免費額度，足夠小型專案使用。
詳情請參考 [Railway Pricing](https://railway.app/pricing)。
