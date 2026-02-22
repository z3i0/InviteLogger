# Onyx Royal - Discord Invite & Welcome Bot

A powerful, feature-rich Discord bot designed for server management, welcome experiences, and detailed invite tracking.

## 🚀 Features

- **Dynamic Welcome System**: Professional text and image-based welcome messages.
- **Invite Tracking**: Know exactly who invited new members and which code was used.
- **Auto-Role Logic**: 
  - 🤖 Special role for bots: `only bot`
  - 👤 Special role for humans: `ONX Members`
- **Dashboard API**: Express-based server for leaderboard and join logs data.
- **Database Flexibility**: Supports Postgres with Drizzle ORM or In-Memory fallback.
- **Multi-Language Support**: Arabic and English support.

## 🛠️ Setup & Installation

### 1. Requirements
- Node.js 20+
- npm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file:
```env
DISCORD_TOKEN=your_token_here
DATABASE_URL=your_postgres_url (optional, will use in-memory if empty)
PORT=5000
```

### 4. Running the Bot
- **Development**: `npm run dev`
- **Production**: `npm run build` then `npm start`

## 📦 Deployment

For deployment on a VPS (like Contabo), we recommend using **PM2**:

```bash
sudo npm install pm2 -g
npm run build
pm2 start dist/index.cjs --name onyx-bot
```

## 📜 License
MIT
