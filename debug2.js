import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });
console.log('🔧 Dotenv result:', envResult);

console.log('🔧 Environment check:');
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
console.log('Token length:', process.env.TELEGRAM_BOT_TOKEN?.length);
console.log('WEB_APP_URL:', process.env.WEB_APP_URL);

// Check if env file exists
import fs from 'fs';
const envPath = path.join(__dirname, '.env');
console.log('Env file exists:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  console.log('Env file content:', fs.readFileSync(envPath, 'utf8'));
}

// If token still not loaded, exit early
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('❌ Bot token not found. Exiting...');
  process.exit(1);
}

// Инициализируем бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// URL веб-приложения (Vercel)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://tlbot-jr021tfee-eskimos-projects.vercel.app';

console.log('🤖 Starting Telegram bot...');
console.log('📱 Web App URL:', WEB_APP_URL);

// Логирование всех обновлений
bot.use(async (ctx, next) => {
  console.log('📥 Received update:', JSON.stringify(ctx.update, null, 2));
  await next();
});

// Команда /start
bot.start(async (ctx) => {
  try {
    console.log('📨 /start command from:', ctx.from.username || ctx.from.first_name);
    
    const welcome = `Йоу, Привет! 👋 Это Total Lookas — креативное производство полного цикла. Конструктор соберёт КП за пару минут: от футболок и худи до аксессуаров и упаковки.

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
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '� Открыть приложение TL', web_app: { url: WEB_APP_URL } }]
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
    
    const contactText = `📞 Свяжитесь с нами:

Менеджер: @zelenayaaliya
Телефон: +79991627758
Email: total-lookas@yandex.ru
Сайт: totallookas.ru`;

    const backKeyboard = {
      inline_keyboard: [
        [{ text: '🔙 Назад в меню', callback_data: 'back_to_menu' }]
      ]
    };

    await ctx.editMessageText(contactText, { reply_markup: backKeyboard });
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
    
    const aboutText = `ℹ️ О Total Lookas:

Total Lookas — креативное агентство полного цикла, с 2017 года превращающее корпоративный мерч в арт-объекты. Мы объединяем дерзкий стиль Динара Ярмухаметова с корпоративным сервисом: берём на себя всё — от идеи и дизайна до лекал, производства и логистики, в среднем за 20 дней. 

Наш ассортимент охватывает всё от футболок и худи до ювелирных аксессуаров, позволяя клиентам «полностью одеть» бренд и выделиться на рынке. Нам доверяют фестивали, корпорации, артисты и блогеры, потому что «мы можем всё» — быстро, смело и качественно.`;

    const backKeyboard = {
      inline_keyboard: [
        [{ text: '� Назад в меню', callback_data: 'back_to_menu' }]
      ]
    };

    await ctx.editMessageText(aboutText, { reply_markup: backKeyboard });
    console.log('✅ About info sent');
  } catch (error) {
    console.error('❌ Error in about action:', error);
    await ctx.answerCbQuery('Произошла ошибка');
  }
});

// Кнопка "Назад в меню"
bot.action('back_to_menu', async (ctx) => {
  try {
    console.log('📨 Back to menu action from:', ctx.from.username || ctx.from.first_name);
    await ctx.answerCbQuery();
    
    const welcome = `Йоу, Привет! 👋 Это Total Lookas — креативное производство полного цикла. Конструктор соберёт КП за пару минут: от футболок и худи до аксессуаров и упаковки.

Выбери действие:`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '📱 Открыть приложение', web_app: { url: WEB_APP_URL } }],
        [{ text: '📞 Связаться с нами', callback_data: 'contact' }],
        [{ text: 'ℹ️ О нас', callback_data: 'about' }]
      ]
    };

    await ctx.editMessageText(welcome, { reply_markup: keyboard });
    console.log('✅ Back to menu');
  } catch (error) {
    console.error('❌ Error in back to menu action:', error);
    await ctx.answerCbQuery('Произошла ошибка');
  }
});

// Обработка данных из веб-приложения
bot.on('web_app_data', async (ctx) => {
  try {
    console.log('📨 Web app data from:', ctx.from.username || ctx.from.first_name);
    console.log('🔍 Full context:', JSON.stringify(ctx.update, null, 2));
    
    const webAppData = ctx.webAppData?.data;
    
    if (webAppData) {
      console.log('💾 Web app data received:', webAppData);
      try {
        const parsedData = JSON.parse(webAppData);
        console.log('📊 Parsed data:', JSON.stringify(parsedData, null, 2));
      } catch (parseError) {
        console.log('❌ Failed to parse web app data:', parseError);
      }
      await ctx.reply('✅ Спасибо! Ваш заказ принят. Мы свяжемся с вами в ближайшее время.');
    } else {
      console.log('⚠️ No web app data found in context');
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
