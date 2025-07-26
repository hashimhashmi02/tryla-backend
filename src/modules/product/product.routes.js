const router     = require('express').Router();
const controller = require('./product.controller');
const auth       = require('../../middlewares/auth');


// Filters metadata (sizes, availability options, categories)
router.get('/filters', controller.getFilters);
router.get('/',         controller.list);
router.get('/:id',      controller.getOne);


router.post('/',        auth('ADMIN'), controller.create);
router.patch('/:id',    auth('ADMIN'), controller.update);
router.delete('/:id',   auth('ADMIN'), controller.remove);

module.exports = router;
