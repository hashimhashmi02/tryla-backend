require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes        = require('./modules/auth/auth.routes');
const categoryRoutes    = require('./modules/category/category.routes');
const productRoutes     = require('./modules/product/product.routes');
const cartRoutes        = require('./modules/cart/cart.routes');
const orderRoutes       = require('./modules/order/order.routes');
const stripePaymentRoutes = require('./modules/payment/stripe.routes');
const stripeWebhookRoutes = require('./modules/payment/webhook.routes');

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


app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
