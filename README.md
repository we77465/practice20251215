# 🦎 爬蟲寵物專賣店

一個完整的爬蟲寵物電商網站，使用 React + Flask + PostgreSQL 建置，支援 Docker 容器化部署。

## 功能特色

- 🛒 **商品瀏覽與搜尋** - 分類瀏覽、關鍵字搜尋
- ❤️ **收藏追蹤** - 收藏喜愛的商品
- 🛍️ **購物車** - 管理購物車、調整數量
- 💳 **結帳系統** - 填寫配送資訊、建立訂單
- 👤 **會員系統** - 註冊、登入、個人資料管理
- 📦 **訂單管理** - 查看訂單歷史與狀態
- ⚙️ **管理後台** - 商品 CRUD、訂單管理、統計儀表板

## 技術架構

| 元件 | 技術 |
|------|------|
| Frontend | React 18 + Vite |
| Backend | Flask 3.x + SQLAlchemy |
| Database | PostgreSQL 15 |
| Auth | JWT (Flask-JWT-Extended) |
| Container | Docker + Docker Compose |

## 快速開始

### 使用 Docker Compose (推薦)

```bash
# 1. 複製環境變數
cp .env.example .env

# 2. 啟動所有服務
docker-compose up --build

# 3. 初始化資料庫（首次執行）
docker-compose exec backend python seed_data.py
```

啟動後訪問:
- 前端: http://localhost
- API: http://localhost:5000/api

### 本地開發

**後端:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python seed_data.py  # 初始化資料
python app.py
```

**前端:**
```bash
cd frontend
npm install
npm run dev
```

## 測試帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| 管理員 | admin@reptile-shop.com | admin123 |
| 一般用戶 | user@test.com | user123 |

## 部署到 Railway

1. 在 [Railway](https://railway.app) 建立新專案
2. 連結你的 GitHub Repository
3. 新增 PostgreSQL 資料庫
4. 設定環境變數 (參考 `.env.example`)
5. 部署完成後，Railway 會自動提供 `.railway.app` 網域

詳細部署步驟請參考 `DEPLOY.md`。

## 專案結構

```
reptile-shop/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   └── seed_data.py
└── frontend/
    ├── Dockerfile
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    └── nginx.conf
```

## License

MIT
