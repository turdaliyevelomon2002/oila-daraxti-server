const https = require('https');
const pool = require('../config/database');

function sendTelegramMessage(message, chatId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
  if (!token || !targetChatId) return Promise.resolve();

  const body = JSON.stringify({ chat_id: String(targetChatId), text: message, parse_mode: 'HTML' });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) console.error('Telegram xatosi:', parsed.description);
          else console.log(`Telegram xabar yuborildi (chat: ${targetChatId}) ✓`);
        } catch {}
        resolve();
      });
    });

    req.on('error', (err) => { console.error('Telegram yuborishda xato:', err.message); resolve(); });
    req.setTimeout(10000, () => { console.error('Telegram timeout'); req.destroy(); resolve(); });
    req.write(body);
    req.end();
  });
}

async function handleWebhook(req, res) {
  const update = req.body;
  res.sendStatus(200);

  const msg = update?.message;
  if (!msg) return;

  const chatId = msg.chat?.id;
  const text = (msg.text || '').trim();
  const firstName = msg.from?.first_name || '';
  const lastName = msg.from?.last_name || '';
  const username = msg.from?.username || null;

  if (text === '/start' || text.startsWith('/start ')) {
    try {
      await pool.query(
        `INSERT INTO telegram_users (chat_id, telegram_username, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (chat_id) DO UPDATE
           SET telegram_username = EXCLUDED.telegram_username,
               first_name = EXCLUDED.first_name,
               last_name = EXCLUDED.last_name`,
        [chatId, username, firstName, lastName]
      );
      console.log(`Telegram user ro'yxatdan o'tdi: ${firstName} (${chatId})`);
    } catch (err) {
      console.error('Telegram user saqlashda xato:', err.message);
    }

    const welcomeText = `Salom, ${firstName}! 👋\n\nSiz oila daraxti botiga ro'yxatdan o'tdingiz. Endi tug'ilgan kun eslatmalari va oila yangiliklari sizga yuboriladi. 🌳🎂`;
    sendTelegramMessage(welcomeText, chatId);
  }
}

module.exports = { sendTelegramMessage, handleWebhook };
