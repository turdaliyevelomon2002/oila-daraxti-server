const router = require('express').Router();
const ctrl = require('../controllers/notifications.controller');

router.get('/', ctrl.getAll);
router.get('/unread', ctrl.getUnread);
router.patch('/:id/read', ctrl.markRead);
router.patch('/read-all', ctrl.markAllRead);

module.exports = router;
