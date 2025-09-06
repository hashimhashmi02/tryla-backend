const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const badRequest = (msg) => Object.assign(new Error(msg), { status: 400 });
const isAdmin = (user) => !!user && user.role === 'ADMIN';
const ALLOWED_STATUS =
  Prisma?.$Enums?.OrderStatus
    ? Object.values(Prisma.$Enums.OrderStatus)
    : ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

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
      quantity:  ci.quantity,
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
  return prisma.order.findMany({
    where: isAdmin(user) ? {} : { userId: user.id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getOrder = async (user, orderId) => {
  const where = isAdmin(user)
    ? { id: orderId }
    : { id: orderId, userId: user.id };

 
  return isAdmin(user)
    ? prisma.order.findUnique({
        where,
        include: { user: true, items: { include: { product: true } } },
      })
    : prisma.order.findFirst({
        where,
        include: { user: true, items: { include: { product: true } } },
      });
};

exports.updateStatus = async (orderId, status) => {
  const s = String(status || '').toUpperCase().trim();
  if (!ALLOWED_STATUS.includes(s)) {
    throw badRequest(`Invalid status. Allowed: ${ALLOWED_STATUS.join(', ')}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data:  { status: s },
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
