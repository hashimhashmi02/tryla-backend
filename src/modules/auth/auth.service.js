const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pickUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

exports.signup = async ({ name, email, password }) => {
  if (!name || !email || !password) throw new Error('Missing fields');

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already in use');

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash }
  });

  const token = jwt.sign(pickUser(user), process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user: pickUser(user), token };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('Missing fields');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = jwt.sign(pickUser(user), process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user: pickUser(user), token };
};
