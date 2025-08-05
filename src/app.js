require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes          = require('./modules/auth/auth.routes');
const categoryRoutes      = require('./modules/category/category.routes');
const productRoutes       = require('./modules/product/product.routes');
const cartRoutes          = require('./modules/cart/cart.routes');
const orderRoutes         = require('./modules/order/order.routes');
const stripePaymentRoutes = require('./modules/payment/stripe.routes');
const stripeWebhookRoutes = require('./modules/payment/webhook.routes');
const navlinkRoutes = require('./modules/navlink/navlink.routes');

const app    = express();
const prisma = new PrismaClient();

app.use(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookRoutes
);

app.use(cors());
app.use(express.json());

app.use('/auth',        authRoutes);
app.use('/categories',  categoryRoutes);
app.use('/products',    productRoutes);
app.use('/cart',        cartRoutes);
app.use('/orders',      orderRoutes);
app.use('/payments/stripe', stripePaymentRoutes);
app.use('/nav-links', navlinkRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true, data: { status: 'ok' } });
});
app.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ ok: true, data: users });
  } catch (err) {
    next(err);
  }
});


app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ ok: false, error: err.message });
});

module.exports = app;
