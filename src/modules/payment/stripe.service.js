// src/modules/payment/stripe.service.js

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

// grab the generated enum so we can set status = COMPLETED
const OrderStatus = Prisma.OrderStatus

/**
 * Create a Stripe PaymentIntent for a given order.
 * @param {string} orderId
 * @returns {Promise<Stripe.PaymentIntent>}
 */
exports.createPaymentIntent = async (orderId) => {
  // fetch the order + its items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order) {
    const err = new Error('Order not found')
    err.status = 404
    throw err
  }

  // sum item.price * quantity, then *100 for cents
  const rawAmount = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity * 100,
    0
  )

  // Stripe requires a whole-integer number of cents
  const amount = Math.round(rawAmount)

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderId },
  })

  return intent
}

/**
 * Handle incoming Stripe webhook events.
 * @param {Stripe.Event} event
 */
exports.handleWebhookEvent = async (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi      = event.data.object
      const orderId = pi.metadata.orderId

      // debug log so you can see exactly what came in
      console.log('🍀 received webhook for PI', pi.id, 'metadata.orderId=', orderId)

      if (!orderId) {
        console.warn('⚠️  Missing orderId in metadata – skipping database update.')
        break
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status:          OrderStatus.COMPLETED,
          paymentIntentId: pi.id,
        },
      })
      break
    }

    default:
      // anything else, just log it
      console.log(`ℹ️  Unhandled Stripe event type: ${event.type}`)
  }
}
