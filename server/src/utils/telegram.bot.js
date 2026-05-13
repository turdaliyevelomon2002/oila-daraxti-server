const https = require('https');

async function sendTelegramMessage(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });

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
          else console.log('Telegram xabar yuborildi ✓');
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

module.exports = { sendTelegramMessage };
