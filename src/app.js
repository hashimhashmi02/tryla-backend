const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const authRoutes     = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/category/category.routes');
const productRoutes  = require('./modules/product/product.routes');

const prisma = new PrismaClient();
const app    = express();

app.use(cors());
app.use(express.json());

app.use('/auth',       authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products',   productRoutes);


app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.use((err, req, res, next) => {
  console.error(err); // prints stack to your console
  res.status(err.status || 500).json({
    message: err.message,
    stack:   err.stack,     // you can remove stack in prod
  });
});

module.exports = app;
