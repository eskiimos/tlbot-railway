import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Инициализируем бота (без базы данных для тестирования)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// URL веб-приложения (Vercel)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://tlbot-jr021tfee-eskimos-projects.vercel.app';

console.log('🤖 Starting Telegram bot...');
console.log('📱 Web App URL:', WEB_APP_URL);

// Команда /start
bot.start(async (ctx) => {
  try {
    console.log('📨 /start command from:', ctx.from.username || ctx.from.first_name);
    
    const welcome = `Привет! 👋
    
Добро пожаловать в TL Bot! 
Здесь ты можешь:

🛍️ Посмотреть наш каталог товаров
📱 Оформить заказ через веб-приложение
💬 Связаться с нами

Выбери действие:`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🛍️ Открыть каталог', web_app: { url: WEB_APP_URL } }],
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
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🛍️ Открыть каталог TL', web_app: { url: WEB_APP_URL } }]
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
    await ctx.reply('📞 Свяжитесь с нами:\n\n📧 Email: info@tl-clothing.com\n📱 Telegram: @tl_support\n🌐 Сайт: tl-clothing.com');
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
    await ctx.reply('ℹ️ О TL Clothing:\n\nМы специализируемся на производстве качественной одежды. Наша миссия - предоставить вам комфортную и стильную одежду по доступным ценам.\n\n🎯 Индивидуальный подход к каждому заказу\n⚡ Быстрое производство\n💯 Гарантия качества');
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
    
    const webAppData = ctx.webAppData?.data;
    
    if (webAppData) {
      console.log('💾 Web app data received:', webAppData);
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
});

process.once('SIGTERM', () => {
  console.log('🛑 Stopping bot...');
  bot.stop('SIGTERM');
});

// Запускаем бота
async function startBot() {
  try {
    // Запускаем бота
    await bot.launch();
    console.log('🚀 Bot started successfully!');
    const me = await bot.telegram.getMe();
    console.log('Bot username:', me.username);
    console.log('Bot ID:', me.id);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

startBot();
