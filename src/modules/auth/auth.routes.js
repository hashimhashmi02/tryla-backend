const router = require('express').Router();
const controller = require('./auth.controller');
const auth = require('../../middlewares/auth');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/me', auth(), controller.me);

module.exports = router;
