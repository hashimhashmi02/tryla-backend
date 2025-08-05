const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const service = require('./stripe.service');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) throw Object.assign(new Error('orderId is required'), { status: 400 });
    const intent = await service.createPaymentIntent(orderId);
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
};

exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    await service.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (err) {
    console.error('⚠️ Webhook error:', err.message);
    res.status(err.status || 400).send(`Webhook Error: ${err.message}`);
  }
};
