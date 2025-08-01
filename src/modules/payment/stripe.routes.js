const router = require('express').Router();
const ctrl   = require('./stripe.controller');
const auth   = require('../../middlewares/auth');

// POST /payments/stripe/create-payment-intent

router.post(
  '/create-payment-intent',
  auth(),   
  ctrl.createPaymentIntent
);

module.exports = router;
