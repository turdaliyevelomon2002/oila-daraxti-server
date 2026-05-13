const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/telegram.controller');

router.get('/', auth, ctrl.getAll);
router.put('/:id/link', auth, ctrl.linkMember);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
