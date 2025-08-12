# TL Bot - Railway Deployment

## 🚀 Быстрый деплой на Railway

### Шаг 1: Создание GitHub репозитория

1. Перейдите на [GitHub.com](https://github.com)
2. Создайте новый репозиторий `tlbot-railway`
3. Сделайте его публичным
4. НЕ добавляйте README, .gitignore или лицензию

### Шаг 2: Загрузка кода на GitHub

```bash
cd /Users/bahtiarmingazov/Documents/tlbot/bot-standalone
git remote add origin https://github.com/eskiimos/tlbot-railway.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой на Railway

1. Откройте [Railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Выберите репозиторий `tlbot-railway`
6. Railway автоматически определит Node.js проект

### Шаг 4: Переменные окружения

В настройках проекта на Railway добавьте:

```
TELEGRAM_BOT_TOKEN=7482550053:AAEd0XzEb3tkL1pryqkMYXn1YhoqJaMD7N0
DATABASE_URL=postgresql://neondb_owner:npg_MHMuPM4YBvb6@ep-crimson-math-a5r8xo7p.us-east-2.aws.neon.tech/neondb?sslmode=require
WEB_APP_URL=https://tlbot-wine.vercel.app
```

### Шаг 5: Готово! 🎉

После деплоя бот будет работать 24/7 в облаке.

## 📋 Что произойдет:

- ✅ Бот будет доступен 24/7
- ✅ Будет сохранять данные в облачную БД Neon
- ✅ Будет получать данные из веб-приложения
- ✅ Автоматически перезапускаться при обновлениях

## 🔧 Локальное тестирование

Для локального тестирования:
```bash
npm install
npm start
```
