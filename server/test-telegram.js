require('dotenv').config();
const { sendTelegramMessage } = require('./src/utils/telegram.bot');

async function test() {
  console.log('Telegram botni sinab ko\'rilmoqda...');
  console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? '✓ bor' : '✗ yo\'q');
  console.log('Chat ID:', process.env.TELEGRAM_CHAT_ID ? '✓ bor' : '✗ yo\'q');

  await sendTelegramMessage('🎉 Test xabari! Oila Daraxti boti muvaffaqiyatli ishlayapti.');
  console.log('Xabar yuborildi — Telegramni tekshiring!');
}

test();
