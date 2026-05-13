const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/members.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/tree', ctrl.getTree);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, upload.single('photo'), ctrl.create);
router.put('/:id', auth, upload.single('photo'), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
