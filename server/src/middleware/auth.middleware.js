const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Token yo\'q' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token noto\'g\'ri yoki muddati o\'tgan' });
  }
}

module.exports = authMiddleware;
