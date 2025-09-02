const router     = require('express').Router();
const controller = require('./product.controller');
const auth       = require('../../middlewares/auth');
const cache      = require('../../middlewares/cache');
const validate   = require('../../middlewares/validate');
const { createProductSchema, updateProductSchema } = require('./product.schema');

// Public (cached)
router.get('/filters', cache, controller.getFilters);
router.get('/search',  cache, controller.search);
router.get('/',        cache, controller.list);
router.get('/:id',     cache, controller.getOne);

// Admin
router.post('/', auth('ADMIN'), validate(createProductSchema), controller.create);
router.patch('/:id', auth('ADMIN'), validate(updateProductSchema), controller.update);
router.delete('/:id', auth('ADMIN'), controller.remove);

module.exports = router;
