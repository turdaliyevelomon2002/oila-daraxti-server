const cron = require('node-cron');
const pool = require('../config/database');
const { sendTelegramMessage } = require('./telegram.bot');

async function checkTodayBirthdays() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const result = await pool.query(
      `SELECT * FROM members
       WHERE EXTRACT(MONTH FROM birth_date) = $1
         AND EXTRACT(DAY FROM birth_date) = $2
         AND death_date IS NULL`,
      [month, day]
    );

    for (const member of result.rows) {
      const age = today.getFullYear() - new Date(member.birth_date).getFullYear();

      const existing = await pool.query(
        `SELECT id FROM notifications
         WHERE member_id = $1 AND scheduled_for = CURRENT_DATE AND type = 'birthday'`,
        [member.id]
      );

      if (existing.rows.length === 0) {
        const msgUz = `🎂 Bugun ${member.name_uz}ning tug'ilgan kuni! ${age} yosh to'ldi. Tabriklaymiz! 🎉`;
        const msgRu = `🎂 Сегодня день рождения ${member.name_ru || member.name_uz}! Исполнилось ${age} лет. Поздравляем! 🎉`;
        const msgEn = `🎂 Today is ${member.name_en || member.name_uz}'s birthday! Turning ${age} years old. Congratulations! 🎉`;

        await pool.query(
          `INSERT INTO notifications (member_id, type, message_uz, message_ru, message_en, scheduled_for)
           VALUES ($1, 'birthday', $2, $3, $4, CURRENT_DATE)`,
          [member.id, msgUz, msgRu, msgEn]
        );

        // Barcha ro'yxatdagi telegram foydalanuvchilarga yuboriladi
        const tgUsers = await pool.query(`SELECT chat_id FROM telegram_users`);
        for (const u of tgUsers.rows) {
          await sendTelegramMessage(msgUz, u.chat_id);
        }

        if (tgUsers.rows.length === 0 && process.env.TELEGRAM_CHAT_ID) {
          await sendTelegramMessage(msgUz);
        }
      }
    }

    if (result.rows.length > 0) {
      console.log(`${result.rows.length} ta tug'ilgan kun eslatmasi yaratildi`);
    }
  } catch (err) {
    console.error('Birthday tekshirishda xato:', err);
  }
}

function startBirthdayCron() {
  checkTodayBirthdays();
  cron.schedule('0 8 * * *', checkTodayBirthdays);
  console.log('Birthday cron ishga tushdi (har kuni 08:00 + server yoqilganda)');
}

module.exports = { startBirthdayCron, checkTodayBirthdays };
