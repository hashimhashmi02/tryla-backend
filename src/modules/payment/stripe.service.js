const Stripe        = require('stripe');
const { send }      = require('../../utils/email');
const { PrismaClient, OrderStatus } = require('@prisma/client');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

exports.createPaymentIntent = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }


  const rawAmount = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity * 100,
    0
  );
  const amount = Math.round(rawAmount);


  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderId },
  });
};

exports.handleWebhookEvent = async (event) => {
  if (event.type !== 'payment_intent.succeeded') {
    console.log(`ℹ️  Unhandled event type: ${event.type}`);
    return;
  }

  const pi      = event.data.object;
  const orderId = pi.metadata.orderId;
  console.log('🍀 Webhook received for PI', pi.id, 'orderId=', orderId);

  if (!orderId) {
    console.warn('⚠️  Missing orderId in metadata—skipping update.');
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

 
  if (order?.user?.email) {
    await send(
      order.user.email,
      `Payment Confirmed (#${orderId})`,
      `<p>Hey ${order.user.name || ''},<br>
         Your payment for order <b>#${orderId}</b> succeeded! Thanks for shopping.</p>`
    );
  }


  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.COMPLETED,
      paymentIntentId: pi.id,
    },
  });

  console.log(`✅ Order ${orderId} marked as COMPLETED`);
};
