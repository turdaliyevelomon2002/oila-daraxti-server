const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const ctrl = require('../controllers/members.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.get('/tree', ctrl.getTree);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, upload.single('photo'), ctrl.create);
router.put('/:id', auth, upload.single('photo'), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
