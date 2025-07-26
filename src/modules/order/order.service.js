const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (userId) => {
  // Fetch cart items
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
  if (items.length === 0) throw new Error('Cart is empty');

  // Calculate total & prepare OrderItems
  let total = 0;
  const orderItemsData = items.map(i => {
    total += Number(i.product.price) * i.quantity;
    return {
      productId: i.productId,
      quantity:  i.quantity,
      price:     i.product.price
    };
  });

  // Transaction: create Order + OrderItems + clear Cart
  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        userId,
        total,
        items: { create: orderItemsData }
      },
      include: { items: true }
    });
    await tx.cartItem.deleteMany({ where: { userId } });
    return o;
  });

  return order;
};

exports.listOrders = (user) => {
  const where = user.role === 'ADMIN' ? {} : { userId: user.id };
  return prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' }
  });
};

exports.getOrder = (user, id) => {
  const where = user.role === 'ADMIN'
    ? { id }
    : { id, userId: user.id };
  return prisma.order.findUnique({
    where,
    include: { items: { include: { product: true } }, user: true }
  });
};

exports.updateStatus = (id, status) =>
  prisma.order.update({
    where: { id },
    data: { status }
  });
