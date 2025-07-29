const router    = require('express').Router();
const ctrl      = require('./stripe.controller');
const auth      = require('../../middlewares/auth');

router.post(
  '/create-payment-intent',
  auth(),                    // sets req.user
  ctrl.createPaymentIntent
);

router.post(
  '/webhook',
  ctrl.webhookHandler
);

module.exports = router;
