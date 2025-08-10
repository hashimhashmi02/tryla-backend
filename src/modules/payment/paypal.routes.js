const router = require('express').Router();
const auth   = require('../../middlewares/auth');
const ctrl   = require('./paypal.controller');

router.use(auth());           // all PayPal endpoints require login
router.post('/create-order',  ctrl.createPayPalOrder);
router.post('/capture-order', ctrl.capturePayPalOrder);

module.exports = router;
