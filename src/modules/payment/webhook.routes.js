const router     = require('express').Router();
const ctrl       = require('./stripe.controller');

router.post('/', ctrl.webhookHandler);

module.exports = router;
