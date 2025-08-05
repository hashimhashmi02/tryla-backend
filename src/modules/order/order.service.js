const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { send } = require('../../utils/email');  // Nodemailer wrapper

const STATUS_TRANSITIONS = {
  PENDING:   ['PAID'],
  PAID:      ['SHIPPED'],
  SHIPPED:   ['DELIVERED'],
  DELIVERED: []
};


exports.createOrder = async (userId) => {

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
  if (cartItems.length === 0) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }

 
  let total = 0;
  const orderItemsData = cartItems.map(item => {
    const priceNum = Number(item.product.price);
    total += priceNum * item.quantity;
    return {
      productId: item.productId,
      quantity:  item.quantity,
      price:     item.product.price
    };
  });

  
  const order = await prisma.$transaction(async tx => {
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

  const user = await prisma.user.findUnique({ where: { id: userId }});
  if (user && user.email) {
    await send(
      user.email,
      `Order #${order.id} received`,
      `<p>Thanks for your order, ${user.name || ''}!<br>
       Your order <strong>#${order.id}</strong> is now <em>PENDING</em>.<br>
       Total: $${order.total.toFixed(2)}</p>`
    );
  }

  return order;
};


exports.listOrders = async (user) => {
  const where = user.role === 'ADMIN' ? {} : { userId: user.id };
  return prisma.order.findMany({
    where,
    include: {
      items:   { include: { product: true } },
      user:    true
    },
    orderBy: { createdAt: 'desc' }
  });
};

exports.getOrder = async (user, orderId) => {
  const whereClause = user.role === 'ADMIN'
    ? { id: orderId }
    : { id: orderId, userId: user.id };
  const o = await prisma.order.findUnique({
    where: whereClause,
    include: {
      items:   { include: { product: true } },
      user:    true
    }
  });
  return o;
};


exports.changeStatus = async (orderId, newStatus) => {

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }


  const allowedNext = STATUS_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    const err = new Error(`Invalid status transition: ${order.status} → ${newStatus}`);
    err.status = 400;
    throw err;
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data:  { status: newStatus }
  });

  return updated;
};
