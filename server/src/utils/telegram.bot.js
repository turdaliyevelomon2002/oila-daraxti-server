const https = require('https');

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
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
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

    req.on('error', (err) => {
      console.error('Telegram yuborishda xato:', err.message);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.error('Telegram timeout');
      req.destroy();
      resolve();
    });

    req.write(body);
    req.end();
  });
}

async function sendTelegramToMany(message, chatIds) {
  for (const chatId of chatIds) {
    await sendTelegramMessage(message, chatId);
  }
}

function handleWebhook(req, res) {
  const update = req.body;
  res.sendStatus(200);

  const msg = update?.message;
  if (!msg) return;

  const chatId = msg.chat?.id;
  const text = (msg.text || '').trim();

  if (text === '/start' || text.startsWith('/start ')) {
    const reply = `Salom! 👋\n\nSizning Telegram Chat ID: <code>${chatId}</code>\n\nBu raqamni oila daraxti adminiga bering — tug'ilgan kun eslatmalari va yangiliklar sizga yuboriladi. 🎂`;
    sendTelegramMessage(reply, chatId);
  } else if (text === '/id') {
    sendTelegramMessage(`Sizning Chat ID: <code>${chatId}</code>`, chatId);
  }
}

module.exports = { sendTelegramMessage, sendTelegramToMany, handleWebhook };
