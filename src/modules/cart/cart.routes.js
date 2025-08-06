const router = require('express').Router();
const ctrl   = require('./cart.controller');
const auth   = require('../../middlewares/auth');


router.use(auth());


router.get('/', ctrl.list);


router.post('/', ctrl.create);


router.patch('/:id', ctrl.update);


router.delete('/:id', ctrl.remove);

module.exports = router;
