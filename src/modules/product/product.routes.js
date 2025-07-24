const router = require('express').Router();
const controller = require('./product.controller');
const auth = require('../../middlewares/auth');

// Public
router.get('/', controller.list);
router.get('/:id', controller.getOne);

// Admin
router.post('/', auth('ADMIN'), controller.create);
router.patch('/:id', auth('ADMIN'), controller.update);
router.delete('/:id', auth('ADMIN'), controller.remove);

module.exports = router;
