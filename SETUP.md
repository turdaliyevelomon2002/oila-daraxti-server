# Oila Daraxti — Ishga tushirish yo'riqnomasi

## 1. PostgreSQL bazasini sozlash

```sql
-- PostgreSQL'ga kiring va bazani yarating:
CREATE DATABASE family_tree;
```

Keyin `.env` faylini tahrirlang (`server/.env`):
```
DB_PASSWORD=sizning_parolingiz
ADMIN_PASSWORD=sizning_admin_parolingiz
```

## 2. Backend ishga tushirish

```bash
cd server
npm run dev
```
Server: http://localhost:3000

## 3. Frontend ishga tushirish

```bash
cd client
npm start
```
Sayt: http://localhost:4200

## 4. Admin panelga kirish

- URL: http://localhost:4200/admin/login
- Login: `admin` (yoki .env dagi ADMIN_USERNAME)
- Parol: `admin123` (yoki .env dagi ADMIN_PASSWORD)

## 5. Telegram bot (keyinroq)

1. @BotFather ga yozing, `/newbot` komandasi
2. Token oling
3. `server/.env` ga qo'shing:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

## Loyiha strukturasi

```
test/
├── client/          ← Angular 19 (frontend)
│   └── src/app/
│       ├── core/    ← services, guards, interceptors
│       ├── shared/  ← header, member-card, family-tree
│       └── pages/   ← home, member-profile, admin, notifications
└── server/          ← Node.js + Express (backend)
    └── src/
        ├── config/       ← database, schema, init
        ├── controllers/  ← business logic
        ├── routes/       ← API endpoints
        ├── middleware/   ← JWT auth
        └── utils/        ← birthday cron, telegram bot
```
