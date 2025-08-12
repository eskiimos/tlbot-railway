# TL Bot Standalone

Standalone Telegram bot deployment for TL Clothing.

## Environment Variables

Create a `.env` file with the following variables:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
DATABASE_URL=your_neon_database_url_here
WEB_APP_URL=https://tlbot-jr021tfee-eskimos-projects.vercel.app
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Deployment

This bot can be deployed to:
- Railway
- Render
- Heroku
- Any Node.js hosting platform

## Features

- `/start` - Welcome message with inline keyboard
- `/webapp` - Direct link to web application
- Contact and about buttons
- Web app data processing
- User management with Prisma ORM
