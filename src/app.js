const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./modules/auth/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());      

app.use('/auth', authRoutes);

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
