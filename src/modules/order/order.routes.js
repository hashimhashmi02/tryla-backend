const router = require('express').Router();
const ctrl   = require('./order.controller');
const auth   = require('../../middlewares/auth');

router.use(auth());          

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/checkout', ctrl.checkout);
router.patch('/:id/status', auth('ADMIN'), ctrl.updateStatus);

module.exports = router;
