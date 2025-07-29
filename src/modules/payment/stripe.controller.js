const service = require('./stripe.service');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) throw new Error('orderId is required');
    const intent = await service.createPaymentIntent(orderId);
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
};

exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = require('stripe')(process.env.STRIPE_SECRET_KEY)
      .webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try{
    await service.handleWebhookEvent(event);
    res.json({received:true});
  }catch(err){
    console.error('webhook processing error',err);
    res.status(500).send ();
  }
};