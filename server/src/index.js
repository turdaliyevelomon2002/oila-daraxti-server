require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const initDatabase = require('./config/init');
const { startBirthdayCron, checkTodayBirthdays } = require('./utils/birthday.cron');
const { handleWebhook } = require('./utils/telegram.bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/check-birthdays', async (req, res) => {
  await checkTodayBirthdays();
  res.json({ message: 'Tug\'ilgan kunlar tekshirildi' });
});
app.post('/api/telegram/webhook', handleWebhook);

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/members', require('./routes/members.routes'));
app.use('/api/media', require('./routes/media.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server xatosi', error: err.message });
});

async function start() {
  try {
    await initDatabase();
    startBirthdayCron();
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT} da ishlamoqda`));
  } catch (err) {
    console.error('Server ishga tushmadi:', err);
    process.exit(1);
  }
}

start();
