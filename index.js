import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Инициализируем Prisma и бота
const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// URL веб-приложения (Vercel)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://tlbot-wine.vercel.app';

console.log('🤖 Starting Telegram bot...');
console.log('📱 Web App URL:', WEB_APP_URL);

// Функция для создания/обновления пользователя
async function upsertUser(telegramUser) {
  try {
    const userDataForDb = {
      telegramId: telegramUser.id.toString(),
      username: telegramUser.username || null,
      firstName: telegramUser.first_name || null,
      lastName: telegramUser.last_name || null,
      language: telegramUser.language_code || null,
    };

    const user = await prisma.user.upsert({
      where: { telegramId: userDataForDb.telegramId },
      update: userDataForDb,
      create: userDataForDb,
    });

    return user;
  } catch (error) {
    console.error('❌ Error upserting user:', error);
    return null;
  }
}

// Команда /start
bot.start(async (ctx) => {
  try {
    console.log('📨 /start command from:', ctx.from.username || ctx.from.first_name);
    
    const user = await upsertUser(ctx.from);
    console.log('👤 User upserted:', user.id);
    
    const welcome = `Йоу, Привет! 👋 

Это Total Lookas — креативное производство полного цикла.

Мы создаём брендинг, дизайн и персонализированные товары для бизнеса и частных лиц.

Выбери действие:`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '� Открыть приложение', web_app: { url: WEB_APP_URL } }],
        [{ text: '📞 Связаться с нами', callback_data: 'contact' }],
        [{ text: 'ℹ️ О нас', callback_data: 'about' }]
      ]
    };

    await ctx.reply(welcome, { reply_markup: keyboard });
    console.log('✅ Welcome message sent');
  } catch (error) {
    console.error('❌ Error in start command:', error);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
});

// Команда /webapp
bot.command('webapp', async (ctx) => {
  try {
    console.log('📨 /webapp command from:', ctx.from.username || ctx.from.first_name);
    
    const user = await upsertUser(ctx.from);
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '� Открыть приложение', web_app: { url: WEB_APP_URL } }]
      ]
    };
    
    await ctx.reply('Нажмите на кнопку ниже, чтобы открыть каталог:', { reply_markup: keyboard });
    console.log('✅ Webapp message sent');
  } catch (error) {
    console.error('❌ Error in webapp command:', error);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
});

// Кнопка "Связаться с нами"
bot.action('contact', async (ctx) => {
  try {
    console.log('📨 Contact action from:', ctx.from.username || ctx.from.first_name);
    await ctx.answerCbQuery();
    await ctx.reply('📞 Свяжитесь с нами:\n\n� Менеджер: @zelenayaaliya\n📱 Телефон: +79991627758\n�📧 Email: total-lookas@yandex.ru\n🌐 Сайт: totallookas.ru');
    console.log('✅ Contact info sent');
  } catch (error) {
    console.error('❌ Error in contact action:', error);
    await ctx.answerCbQuery('Произошла ошибка');
  }
});

// Кнопка "О нас"
bot.action('about', async (ctx) => {
  try {
    console.log('📨 About action from:', ctx.from.username || ctx.from.first_name);
    await ctx.answerCbQuery();
    await ctx.reply('ℹ️ О Total Lookas:\n\nМы — креативное производство полного цикла, специализирующееся на брендинге, дизайне и персонализированных товарах для бизнеса и частных лиц.\n\n� Брендинг и дизайн\n👕 Персонализированная одежда\n⚡ Быстрое производство\n💯 Качество и индивидуальный подход');
    console.log('✅ About info sent');
  } catch (error) {
    console.error('❌ Error in about action:', error);
    await ctx.answerCbQuery('Произошла ошибка');
  }
});

// Обработка данных из веб-приложения
bot.on('web_app_data', async (ctx) => {
  try {
    console.log('📨 Web app data from:', ctx.from.username || ctx.from.first_name);
    
    const user = await upsertUser(ctx.from);
    const webAppData = ctx.webAppData?.data;
    
    if (webAppData) {
      // Сохраняем данные в базу
      await prisma.webAppData.create({
        data: {
          userId: user.id,
          data: JSON.parse(webAppData),
        },
      });
      
      console.log('💾 Web app data saved for user:', user.id);
      await ctx.reply('✅ Спасибо! Ваш заказ принят. Мы свяжемся с вами в ближайшее время.');
    }
  } catch (error) {
    console.error('❌ Error processing web app data:', error);
    await ctx.reply('Произошла ошибка при обработке заказа. Попробуйте еще раз.');
  }
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  console.error('Context:', ctx.update);
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('🛑 Stopping bot...');
  bot.stop('SIGINT');
  prisma.$disconnect();
});

process.once('SIGTERM', () => {
  console.log('🛑 Stopping bot...');
  bot.stop('SIGTERM');
  prisma.$disconnect();
});

// Запускаем бота
async function startBot() {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Запускаем бота
    await bot.launch();
    console.log('🚀 Bot started successfully!');
    console.log('Bot username:', (await bot.telegram.getMe()).username);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

startBot();
