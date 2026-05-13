const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const ctrl = require('../controllers/media.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post('/', auth, upload.single('file'), ctrl.addMedia);
router.delete('/:id', auth, ctrl.deleteMedia);

module.exports = router;
