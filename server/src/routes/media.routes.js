const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/media.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', auth, upload.single('file'), ctrl.addMedia);
router.delete('/:id', auth, ctrl.deleteMedia);

module.exports = router;
