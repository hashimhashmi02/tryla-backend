const jwt = require('jsonwebtoken');

/**
 * auth middleware
 * usage:
 *   const auth = require('../middlewares/auth');
 *   router.get('/admin', auth('ADMIN'), handler);
 *   router.get('/me', auth(), handler);  // any logged-in user
 *
 * @param {string|string[]} roles  allowed roles 
 */
module.exports = function auth(roles = []) {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      // Expect: "Bearer <token>"
      const token = header.startsWith('Bearer ')
        ? header.split(' ')[1]
        : header; // fallback if someone sends raw token

      if (!token) throw new Error('No token');

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ msg: 'Forbidden' });
      }

      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Unauthenticated' });
    }
  };
};
