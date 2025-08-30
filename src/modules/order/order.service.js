const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const badRequest = (msg) => Object.assign(new Error(msg), { status: 400 });

exports.createOrder = async (userId, shippingAddress, recipientName, recipientPhone) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) throw badRequest('Cart is empty');

  let total = 0;
  const orderItemsData = cartItems.map((ci) => {
    const price = Number(ci.product.price);
    total += price * ci.quantity;
    return {
      productId: ci.productId,
      quantity: ci.quantity,
      price,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddress,
        recipientName,
        recipientPhone,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });
    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });

  return order;
};


exports.listOrders = async (user) => {
  const isAdmin = user && user.role === 'ADMIN';

  return prisma.order.findMany({
    where: isAdmin ? {} : { userId: user.id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};


exports.getOrder = async (user, orderId) => {
  const isAdmin = user && user.role === 'ADMIN';

  if (isAdmin) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
  }


  return prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });
};


exports.updateStatus = async (orderId, status) => {
  const allowed = Object.values(Prisma.OrderStatus); // e.g. ['PENDING','SHIPPED','COMPLETED','CANCELLED']
  if (!allowed.includes(status)) {
    throw badRequest(`Invalid status. Allowed: ${allowed.join(', ')}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });
};


exports.listMyOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
