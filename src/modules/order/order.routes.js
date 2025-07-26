const router = require('express').Router();
const ctrl   = require('./order.controller');
const auth   = require('../../middlewares/auth');

router.use(auth());

router.post('/',    ctrl.checkout);     // POST   /orders      => create order from cart
router.get('/',     ctrl.listOrders);   // GET    /orders
router.get('/:id',  ctrl.getOrder);     // GET    /orders/:id
router.patch('/:id/status', auth('ADMIN'), ctrl.updateStatus); // PATCH /orders/:id/status { status }
module.exports = router;
