const router = require('express').Router();
const controller = require('./category.controller');
const auth = require('../../middlewares/auth');

router.post('/', auth('ADMIN'), controller.create);
router.get('/', controller.list);

module.exports = router;
