const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = (userId) =>
  prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

exports.addItem = async (userId, productId, qty=1) => {
  const existing = await prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty }
    });
  }
  return prisma.cartItem.create({
    data: { userId, productId, quantity: qty }
  });
};

exports.updateItem = (userId, id, qty) =>
  prisma.cartItem.updateMany({
    where: { id, userId },
    data: { quantity: qty }
  });

exports.removeItem = (userId, id) =>
  prisma.cartItem.deleteMany({ where: { id, userId } });
